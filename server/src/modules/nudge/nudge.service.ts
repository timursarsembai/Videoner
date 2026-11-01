import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

// Один раз пишет человеку, который запустил бота и за 48 часов не прислал ни
// одной ссылки. Это ПОДСКАЗКА, а не опрос: такие люди отваливаются до первого
// действия, спрашивать «что не понравилось» бессмысленно — не понравиться ещё
// нечему. Поэтому в тексте пример ссылки и явное «больше не побеспокою».
//
// Почему так осторожно: массовые непрошеные сообщения — ровно тот шаблон, за
// который в Telegram жмут «Пожаловаться на спам», а после нескольких жалоб
// боту режут рассылку. Отсюда три ограничения: строго одно сообщение на
// человека за всё время, только дневное окно и потолок на запуск.
@Injectable()
export class NudgeService {
  private readonly logger = new Logger(NudgeService.name);

  // Все пороги вынесены в переменные окружения со значениями по умолчанию,
  // равными боевым: так их можно подкрутить без пересборки образа и, главное,
  // прогнать весь сценарий на отдельном контейнере против staging-БД, не
  // дожидаясь дневного окна. Проверять рассылку живым людям «на глаз» нельзя.
  private readonly SILENCE_HOURS = this.envInt('NUDGE_SILENCE_HOURS', 48);
  // Окно отправки в UTC. Сервер живёт в UTC, аудитория в основном русскоязычная
  // (Алматы, UTC+5), поэтому 06:00–15:00 UTC = 11:00–20:00 по Алматы. Ночью не
  // пишем: сообщение от незнакомого бота в три часа ночи — самый быстрый путь
  // в блок.
  private readonly WINDOW_START_UTC = this.envInt('NUDGE_WINDOW_START_UTC', 6);
  private readonly WINDOW_END_UTC = this.envInt('NUDGE_WINDOW_END_UTC', 15);
  // Потолок на один запуск. Страхует от единственного по-настоящему опасного
  // сценария: ошибка в условии выборки и веерная рассылка всей базе разом.
  private readonly MAX_PER_RUN = this.envInt('NUDGE_MAX_PER_RUN', 20);
  // Пауза между отправками, чтобы не упереться в лимиты Telegram.
  private readonly SEND_DELAY_MS = 400;

  constructor(private prisma: PrismaService) {}

  private envInt(name: string, fallback: number): number {
    const parsed = Number(process.env[name]);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  // Расписание тоже из окружения (по умолчанию раз в час) — нужно, чтобы в
  // тестовом прогоне поставить «каждую минуту» и увидеть не только отправку,
  // но и то, что на следующем тике повторного сообщения НЕ уходит.
  @Cron(process.env.NUDGE_CRON || CronExpression.EVERY_HOUR)
  async sendNudges() {
    // Выключатель. По умолчанию ВЫКЛЮЧЕНО и включается только в
    // docker-compose.prod.yml — иначе staging-контур, у которого свой БД, но
    // тот же BOT_TOKEN, писал бы тем же живым людям второй раз.
    if (process.env.NUDGE_ENABLED !== 'true') {
      return;
    }

    const hourUtc = new Date().getUTCHours();
    if (hourUtc < this.WINDOW_START_UTC || hourUtc >= this.WINDOW_END_UTC) {
      return;
    }

    const cutoff = new Date(Date.now() - this.SILENCE_HOURS * 60 * 60 * 1000);

    // downloads: { none: {} } — ни одной загрузки вообще, включая упавшие:
    // если человек пробовал и у него не вышло, ему нужна не подсказка, а
    // разбор, и такой случай лучше видеть руками.
    const users = await this.prisma.botUser.findMany({
      where: {
        firstSeenAt: { lte: cutoff },
        nudgeSentAt: null,
        downloads: { none: {} },
      },
      orderBy: { firstSeenAt: 'asc' },
      take: this.MAX_PER_RUN,
    });

    if (users.length === 0) {
      return;
    }

    this.logger.log(`Подсказка после ${this.SILENCE_HOURS}ч молчания: кандидатов ${users.length}`);

    let sent = 0;
    for (const user of users) {
      const text = this.textFor(user.language ?? user.languageCode);
      const result = await this.send(user.telegramId, text);

      if (result === 'retry') {
        // Сеть или лимит Telegram — не помечаем, вернёмся через час.
        this.logger.warn(`Отложил подсказку для ${user.telegramId}, попробую позже`);
        break;
      }

      // 'sent' и 'blocked' помечаем одинаково: если человек заблокировал бота,
      // повторять попытку бессмысленно и вредно.
      await this.prisma.botUser.update({
        where: { id: user.id },
        data: { nudgeSentAt: new Date() },
      });
      if (result === 'sent') {
        sent++;
      }

      await new Promise((resolve) => setTimeout(resolve, this.SEND_DELAY_MS));
    }

    this.logger.log(`Подсказка отправлена: ${sent} из ${users.length}`);
  }

  // Ссылка-пример: jNQXAC9IVRw — «Me at the zoo», самое первое видео YouTube
  // (2005, 19 секунд, человек рассказывает про слонов в зоопарке). Выбрана
  // намеренно и менять её на что попало не нужно: нейтральный сюжет без
  // музыки и религиозного содержания (требование владельца), и при этом
  // ролик исторический — он не будет удалён и не сломает пример со временем.
  private textFor(languageCode: string | null): string {
    const code = languageCode?.toLowerCase() ?? '';

    if (code.startsWith('kk')) {
      return (
        'Сәлеметсіз бе! Сіз бұл ботты іске қостыңыз, бірақ әлі ештеңе жүктеп алмадыңыз — ' +
        'бәлкім, неден бастау керегі түсініксіз болған шығар.\n\n' +
        'Бәрі бір әрекетпен жасалады: осында видео сілтемесін жіберіңіз, ' +
        'мысалы https://youtube.com/watch?v=jNQXAC9IVRw — мен дайын ' +
        'файлды шамамен жарты минутта қайтарамын.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest және Threads жұмыс істейді. Толығымен тегін және кез келген ' +
        'сапада — 4K-ге дейін, HD үшін қосымша төлеудің қажеті жоқ.\n\n' +
        'Егер бірдеңе жұмыс істемесе, жауап ретінде жай ғана жазып жіберіңіз. Бұл ' +
        'жалғыз еске салу, бұдан былай мазаламаймын.'
      );
    }

    if (code.startsWith('ce')) {
      return (
        'Маршалла! Шу хӀокху ботаца доладелла, амма хӀинца а цхьа а хӀума чуяккхина дац — ' +
        'хила мега, мичара доладала деза ца хаьа.\n\n' +
        'Цхьа гӀулч бен яц: кхуза видеон хьажорг дахьийта, ' +
        'масала https://youtube.com/watch?v=jNQXAC9IVRw — ас ' +
        'кийча файл ахминот гергга хенахь юхадохьуьйтур ю.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest а, Threads а болх беш ю. ДӀадерриг мах боцуш а, муьлхха а ' +
        'дикаллехь а — 4K кхаччалц, HD-на тӀе мах бац.\n\n' +
        'Цхьаъ болх ца беш делахь, кхузахь жоп язде. ХӀара ' +
        'цхьа бен доцу дагахьбаккхар ду, кхин Шу хьийзор дац.'
      );
    }

    if (code.startsWith('bs')) {
      return (
        'Zdravo! Pokrenuli ste ovog bota, ali još niste ništa preuzeli — ' +
        'možda nije jasno odakle početi.\n\n' +
        'Samo jedan korak: pošaljite ovdje link videa, ' +
        'na primjer https://youtube.com/watch?v=jNQXAC9IVRw — a ja ću vam ' +
        'vratiti gotov fajl za otprilike pola minute.\n\n' +
        'Radi sa YouTubeom, TikTokom, Instagramom, Facebookom, Twitterom/X, Vimeom, VK, ' +
        'Rutubeom, OK.ru, Pinterestom i Threadsom. Potpuno besplatno i u bilo kojem ' +
        'kvalitetu — do 4K, bez doplate za HD.\n\n' +
        'Ako nešto ne radi, samo odgovorite ovdje. Ovo je ' +
        'jedini podsjetnik, neću vas više uznemiravati.'
      );
    }

    if (code.startsWith('sq')) {
      return (
        'Përshëndetje! E keni nisur këtë bot, por ende nuk keni shkarkuar asgjë — ' +
        'ndoshta nuk është e qartë nga t\'ia filloni.\n\n' +
        'Vetëm një hap: dërgoni këtu lidhjen e një videoje, ' +
        'për shembull https://youtube.com/watch?v=jNQXAC9IVRw — dhe unë ' +
        'jua kthej skedarin gati brenda rreth gjysmë minute.\n\n' +
        'Funksionon me YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest dhe Threads. Plotësisht falas dhe në çdo ' +
        'cilësi — deri në 4K, pa pagesë shtesë për HD.\n\n' +
        'Nëse diçka nuk funksionon, thjesht përgjigjuni këtu. Ky është ' +
        'i vetmi kujtues, nuk do t\'ju shqetësoj më.'
      );
    }

    if (code.startsWith('tt')) {
      return (
        'Сәлам! Сез бу ботны җибәрдегез, ләкин әлегә бернәрсә дә йөкләмәдегез — ' +
        'бәлки, кайдан башларга икәне аңлашылмагандыр.\n\n' +
        'Бары бер адым: монда видеоның сылтамасын җибәрегез, ' +
        'мәсәлән https://youtube.com/watch?v=jNQXAC9IVRw — ә мин әзер ' +
        'файлны якынча ярты минутта кайтарам.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest һәм Threads эшли. Тулысынча бушлай һәм теләсә нинди ' +
        'сыйфатта — 4K га кадәр, HD өчен өстәмә түләү кирәкми.\n\n' +
        'Берәр нәрсә эшләмәсә, монда җавап язып җибәрегез. Бу ' +
        'бердәнбер искәртү, башка борчымыйм.'
      );
    }

    if (code.startsWith('tk')) {
      return (
        'Salam! Siz bu boty açdyňyz, emma entek hiç zat ýüklemediňiz — ' +
        'belki, nireden başlamalydygy düşnüksiz bolandyr.\n\n' +
        'Bary-ýogy bir ädim: şu ýere wideonyň salgysyny iberiň, ' +
        'meselem https://youtube.com/watch?v=jNQXAC9IVRw — men taýýar ' +
        'faýly takmynan ýarym minutda yzyna ibererin.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest we Threads işleýär. Doly mugt we islendik ' +
        'hilde — 4K-a çenli, HD üçin goşmaça töleg ýok.\n\n' +
        'Bir zat işlemese, şu ýerde jogap ýazyň. Bu ' +
        'ýeke-täk ýatlatma, mundan beýläk sizi biynjalyk etmerin.'
      );
    }

    if (code.startsWith('ug')) {
      return (
        'ياخشىمۇسىز! بۇ بوتنى قوزغاتتىڭىز، ئەمما تېخى ھېچنېمە چۈشۈرمىدىڭىز — ' +
        'بەلكىم نەدىن باشلاشنى بىلمىگەنسىز.\n\n' +
        'پەقەت بىر قەدەم: بۇ يەرگە بىر ۋىدىيونىڭ ئۇلانمىسىنى يوللاڭ، ' +
        'مەسىلەن https://youtube.com/watch?v=jNQXAC9IVRw — مەن ' +
        'تەييار ھۆججەتنى تەخمىنەن يېرىم مىنۇت ئىچىدە قايتۇرىمەن.\n\n' +
        'YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، ' +
        'Rutube، OK.ru، Pinterest ۋە Threads ئىشلەيدۇ. پۈتۈنلەي ھەقسىز ۋە ھەر قانداق ' +
        'سۈپەتتە — 4K غىچە، HD ئۈچۈن قوشۇمچە ھەق يوق.\n\n' +
        'بىرەر نەرسە ئىشلىمىسە، بۇ يەردە جاۋاب يېزىڭ. بۇ ' +
        'بىردىنبىر ئەسكەرتىش، ئەمدى ئاۋارە قىلمايمەن.'
      );
    }

    if (code.startsWith('ku') || code.startsWith('kmr')) {
      return (
        'Silav! Te ev bot da destpêkirin, lê hîn te tiştek danexistiye — ' +
        'dibe ku ne zelal be ji ku dest pê bikî.\n\n' +
        'Tenê gavek: lînka vîdyoyekê li vir bişîne, ' +
        'wek nimûne https://youtube.com/watch?v=jNQXAC9IVRw — û ez ê ' +
        'pelê di nêzîkî nîv deqeyê de ji te re bişînim.\n\n' +
        'Bi YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest û Threads re dixebite. Bi tevahî belaş e û bi her ' +
        'kalîteyê — heta 4K, ji bo HD pereyê zêde tune.\n\n' +
        'Heke tiştek nexebite, tenê li vir bersiv bide. Ev ' +
        'tenê bîranîn e, ez ê êdî te aciz nekim.'
      );
    }

    if (code.startsWith('ckb')) {
      return (
        'سڵاو! ئەم بۆتەت دەستپێکرد، بەڵام هێشتا هیچت دانەگرتووە — ' +
        'لەوانەیە ڕوون نەبێت لە کوێوە دەست پێبکەیت.\n\n' +
        'تەنها یەک هەنگاو: بەستەری ڤیدیۆیەک لێرە بنێرە، ' +
        'بۆ نموونە https://youtube.com/watch?v=jNQXAC9IVRw — منیش ' +
        'فایلەکە لە نزیکەی نیو خولەکدا بۆت دەنێرمەوە.\n\n' +
        'YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، ' +
        'Rutube، OK.ru، Pinterest و Threads کار دەکەن. بە تەواوی بەخۆڕایی و بە هەر ' +
        'کوالیتییەک — تا 4K، هیچ پارەیەکی زیادە بۆ HD نییە.\n\n' +
        'ئەگەر شتێک کاری نەکرد، تەنها لێرە وەڵام بدەرەوە. ئەمە ' +
        'تاکە بیرخستنەوەیە، چیتر بێزارت ناکەم.'
      );
    }

    if (code.startsWith('ps')) {
      return (
        'سلام! تاسو دا بوټ پیل کړ، خو تر اوسه مو هېڅ نه دي ښکته کړي — ' +
        'ښايي دا روښانه نه وي چې له کومه پیل وکړئ.\n\n' +
        'یوازې یو ګام: دلته د یوې ویډیو لینک ولېږئ، ' +
        'د بېلګې په توګه https://youtube.com/watch?v=jNQXAC9IVRw — او زه به ' +
        'چمتو فایل تاسو ته شاوخوا نیمه دقیقه کې بېرته ولېږم.\n\n' +
        'YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، ' +
        'Rutube، OK.ru، Pinterest او Threads کار کوي. بشپړ وړیا او په هر ' +
        'کیفیت — تر 4K پورې، د HD لپاره اضافي پیسې نشته.\n\n' +
        'که څه کار ونه کړي، یوازې دلته ځواب ولیکئ. دا ' +
        'یوازینۍ یادونه ده، بیا به مو ونه ځوروم.'
      );
    }

    if (code.startsWith('ro') || code.startsWith('mo')) {
      return (
        'Salut! Ai pornit acest bot, dar încă n-ai descărcat nimic — ' +
        'poate nu e clar de unde să începi.\n\n' +
        'E un singur pas: trimite aici linkul unui videoclip, ' +
        'de exemplu https://youtube.com/watch?v=jNQXAC9IVRw — iar eu îți trimit ' +
        'fișierul în aproximativ jumătate de minut.\n\n' +
        'Funcționează cu YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest și Threads. Complet gratuit și la orice ' +
        'calitate — până la 4K, fără plată în plus pentru HD.\n\n' +
        'Dacă ceva nu merge, doar răspunde aici. Acesta e ' +
        'singurul memento, nu te mai deranjez.'
      );
    }

    if (code.startsWith('nl')) {
      return (
        'Hoi! Je hebt deze bot gestart maar nog niets gedownload — ' +
        'misschien is het niet duidelijk waar je moet beginnen.\n\n' +
        'Het is maar één stap: stuur hier een videolink, ' +
        'bijvoorbeeld https://youtube.com/watch?v=jNQXAC9IVRw — dan stuur ik ' +
        'het bestand binnen ongeveer een halve minuut terug.\n\n' +
        'Werkt met YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest en Threads. Helemaal gratis en in elke ' +
        'kwaliteit — tot 4K, zonder extra kosten voor HD.\n\n' +
        'Werkt er iets niet, stuur dan gewoon een antwoord. Dit is de ' +
        'enige herinnering, ik val je hierna niet meer lastig.'
      );
    }

    if (code.startsWith('ms')) {
      return (
        'Hai! Anda telah memulakan bot ini tetapi belum memuat turun apa-apa — ' +
        'mungkin tidak jelas di mana hendak bermula.\n\n' +
        'Hanya satu langkah: hantar pautan video ke sini, ' +
        'contohnya https://youtube.com/watch?v=jNQXAC9IVRw — dan saya akan ' +
        'menghantar semula fail dalam kira-kira setengah minit.\n\n' +
        'Berfungsi dengan YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest dan Threads. Percuma sepenuhnya dan dalam apa-apa ' +
        'kualiti — sehingga 4K, tiada bayaran tambahan untuk HD.\n\n' +
        'Jika ada yang tidak berfungsi, balas sahaja di sini. Ini ' +
        'satu-satunya peringatan, saya tidak akan mengganggu anda lagi.'
      );
    }

    if (code.startsWith('tg')) {
      return (
        'Салом! Шумо ин ботро оғоз кардед, вале то ҳол чизе боргирӣ накардаед — ' +
        'шояд маълум нест, ки аз куҷо сар кардан лозим аст.\n\n' +
        'Танҳо як қадам: ба ин ҷо пайванди видеоро фиристед, ' +
        'масалан https://youtube.com/watch?v=jNQXAC9IVRw — ман файли ' +
        'тайёрро тақрибан дар ним дақиқа бармегардонам.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest ва Threads кор мекунанд. Комилан ройгон ва бо ҳар ' +
        'сифат — то 4K, барои HD пардохти иловагӣ лозим нест.\n\n' +
        'Агар чизе кор накунад, танҳо ҷавоб нависед. Ин ' +
        'ягона ёдрасонӣ аст, дигар шуморо ташвиш намедиҳам.'
      );
    }

    if (code.startsWith('ky')) {
      return (
        'Салам! Сиз бул ботту иштеттиңиз, бирок азырынча эч нерсе жүктөп ала элексиз — ' +
        'балким, эмнеден баштоо керек экени түшүнүксүз болгондур.\n\n' +
        'Бир эле кадам: бул жакка видеонун шилтемесин жөнөтүңүз, ' +
        'мисалы https://youtube.com/watch?v=jNQXAC9IVRw — мен даяр ' +
        'файлды болжол менен жарым мүнөттө кайтарам.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest жана Threads иштейт. Толугу менен акысыз жана каалаган ' +
        'сапатта — 4K чейин, HD үчүн кошумча төлөөнүн кереги жок.\n\n' +
        'Эгер бир нерсе иштебесе, жөн гана жооп жазыңыз. Бул ' +
        'жалгыз эскертүү, мындан ары тынчыңызды албайм.'
      );
    }

    if (code.startsWith('az')) {
      return (
        'Salam! Bu botu işə saldınız, amma hələ heç nə yükləməmisiniz — ' +
        'bəlkə haradan başlamaq aydın deyil.\n\n' +
        'Cəmi bir addım: buraya video linki göndərin, ' +
        'məsələn https://youtube.com/watch?v=jNQXAC9IVRw — mən də hazır ' +
        'faylı təxminən yarım dəqiqəyə qaytaracağam.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest və Threads işləyir. Tamamilə pulsuzdur və istənilən ' +
        'keyfiyyətdə — 4K-ya qədər, HD üçün əlavə ödəniş yoxdur.\n\n' +
        'Bir şey işləməsə, sadəcə cavab yazın. Bu ' +
        'yeganə xatırlatmadır, daha narahat etməyəcəyəm.'
      );
    }

    if (code.startsWith('so')) {
      return (
        'Salaan! Waxaad bilowday bot-kan laakiin weli waxba ma aadan soo dejin — ' +
        'malaha ma cadda meesha laga bilaabo.\n\n' +
        'Hal tallaabo oo keliya: halkan ku soo dir link-ga muuqaal, ' +
        'tusaale ahaan https://youtube.com/watch?v=jNQXAC9IVRw — anna ' +
        'faylka ayaan kuu soo celin doonaa qiyaastii nus daqiiqo gudaheed.\n\n' +
        'Wuxuu la shaqeeyaa YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest iyo Threads. Gebi ahaanba waa bilaash, tayo kasta — ' +
        'ilaa 4K, lacag dheeraad ah looma baahna HD.\n\n' +
        'Haddii ay wax shaqayn waayaan, halkan uun ku jawaab. Tani waa ' +
        'xasuusin keliya, mar dambe kuma dhibi doono.'
      );
    }

    if (code.startsWith('ha')) {
      return (
        'Sannu! Kun fara wannan bot amma har yanzu ba ku sauke komai ba — ' +
        'wataƙila ba a fayyace inda za a fara ba.\n\n' +
        'Mataki ɗaya kawai: ku aiko da hanyar haɗin bidiyo a nan, ' +
        'misali https://youtube.com/watch?v=jNQXAC9IVRw — ni kuma zan dawo ' +
        'muku da fayil ɗin cikin kusan rabin minti.\n\n' +
        'Yana aiki da YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest da Threads. Kyauta ne gaba ɗaya kuma a kowane ' +
        'inganci — har zuwa 4K, babu ƙarin kuɗi don HD.\n\n' +
        'Idan wani abu bai yi aiki ba, ku amsa a nan kawai. Wannan ne ' +
        'kaɗai tunatarwa, ba zan sake damun ku ba.'
      );
    }

    if (code.startsWith('om')) {
      return (
        'Akkam! Boota kana jalqabdaniittu, garuu ammayyuu homaa hin buufanne — ' +
        'eessaa akka jalqabdan ifa hin taane ta\'a.\n\n' +
        'Tarkaanfii tokko qofa: liinkii viidiyoo tokkoo asitti ergaa, ' +
        'fakkeenyaaf https://youtube.com/watch?v=jNQXAC9IVRw — ani immoo ' +
        'faayilicha gara walakkaa daqiiqaa keessatti isinii deebisa.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest fi Threads irratti hojjeta. Guutummaatti bilisa, qulqullina ' +
        'kamiinuu — hanga 4K, HD dhaaf kaffaltii dabalataa hin qabu.\n\n' +
        'Wanti tokko yoo hin hojjenne, asumatti deebii barreessaa qofa. Kun ' +
        'yaadachiisa qofa, si\'a kana booda isin hin rakkisu.'
      );
    }

    if (code.startsWith('am')) {
      return (
        'ሰላም! ይህን ቦት ጀምረዋል፣ ግን እስካሁን ምንም አላወረዱም — ' +
        'ከየት እንደሚጀምሩ ግልጽ ላይሆን ይችላል።\n\n' +
        'አንድ እርምጃ ብቻ ነው፦ የቪዲዮ ሊንክ እዚህ ይላኩ፣ ' +
        'ለምሳሌ https://youtube.com/watch?v=jNQXAC9IVRw — እኔም ' +
        'ፋይሉን በግማሽ ደቂቃ ገደማ እልክልዎታለሁ።\n\n' +
        'YouTube፣ TikTok፣ Instagram፣ Facebook፣ Twitter/X፣ Vimeo፣ VK፣ ' +
        'Rutube፣ OK.ru፣ Pinterest እና Threads ይሰራሉ። ሙሉ በሙሉ ነፃ ነው፣ በማንኛውም ' +
        'ጥራት — እስከ 4K፣ ለHD ተጨማሪ ክፍያ የለም።\n\n' +
        'የሆነ ነገር ካልሰራ በቀላሉ እዚሁ ይመልሱ። ይህ ' +
        'ብቸኛው ማስታወሻ ነው፣ ከዚህ በኋላ አላስቸግርዎትም።'
      );
    }

    if (code.startsWith('tl') || code.startsWith('fil')) {
      return (
        'Hello! Sinimulan mo ang bot na ito pero wala ka pang na-download — ' +
        'baka hindi malinaw kung saan magsisimula.\n\n' +
        'Isang hakbang lang: ipadala dito ang link ng isang video, ' +
        'halimbawa https://youtube.com/watch?v=jNQXAC9IVRw — at ibabalik ko ang ' +
        'file sa loob ng mga kalahating minuto.\n\n' +
        'Gumagana sa YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest at Threads. Ganap na libre at sa anumang ' +
        'kalidad — hanggang 4K, walang dagdag na bayad para sa HD.\n\n' +
        'Kung may hindi gumana, mag-reply ka lang dito. Ito ang ' +
        'tanging paalala, hindi na kita guguluhin ulit.'
      );
    }

    if (code.startsWith('th')) {
      return (
        'สวัสดี! คุณเริ่มใช้บอทนี้แล้ว แต่ยังไม่ได้ดาวน์โหลดอะไรเลย — ' +
        'อาจเป็นเพราะยังไม่แน่ใจว่าจะเริ่มตรงไหน\n\n' +
        'แค่ขั้นตอนเดียว: ส่งลิงก์วิดีโอมาที่นี่ ' +
        'เช่น https://youtube.com/watch?v=jNQXAC9IVRw — แล้วบอทจะส่ง ' +
        'ไฟล์กลับให้ภายในประมาณครึ่งนาที\n\n' +
        'รองรับ YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest และ Threads ใช้ฟรีทั้งหมดและได้ทุก' +
        'ความละเอียด — สูงสุด 4K ไม่มีค่าใช้จ่ายเพิ่มสำหรับ HD\n\n' +
        'ถ้ามีอะไรใช้งานไม่ได้ ตอบกลับที่นี่ได้เลย นี่เป็น' +
        'การแจ้งเตือนครั้งเดียว จะไม่รบกวนอีก'
      );
    }

    if (code.startsWith('ko')) {
      return (
        '안녕하세요! 이 봇을 시작하셨지만 아직 아무것도 다운로드하지 않으셨어요. ' +
        '어디서부터 시작해야 할지 몰랐을 수도 있어요.\n\n' +
        '한 단계면 충분해요. 여기에 동영상 링크를 보내 주세요. ' +
        '예: https://youtube.com/watch?v=jNQXAC9IVRw — 약 30초 안에 ' +
        '파일을 보내 드릴게요.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest, Threads를 지원해요. 완전히 무료이고 어떤 ' +
        '화질이든 — 4K까지, HD도 추가 요금이 없어요.\n\n' +
        '문제가 있으면 여기에 답장만 해 주세요. 이번이 ' +
        '유일한 안내이며, 다시 연락드리지 않을게요.'
      );
    }

    if (code.startsWith('ja')) {
      return (
        'こんにちは！このボットを起動されましたが、まだ何もダウンロードされていません。' +
        '何から始めればよいか分かりにくかったかもしれません。\n\n' +
        '手順は1つだけです。ここに動画のリンクを送ってください。' +
        '例: https://youtube.com/watch?v=jNQXAC9IVRw ——約30秒で' +
        'ファイルをお返しします。\n\n' +
        'YouTube、TikTok、Instagram、Facebook、Twitter/X、Vimeo、VK、' +
        'Rutube、OK.ru、Pinterest、Threads に対応しています。完全無料で、どの' +
        '画質でも——4K まで、HD の追加料金はありません。\n\n' +
        'うまくいかない場合は、ここに返信してください。' +
        'お知らせはこの1回だけで、今後ご連絡することはありません。'
      );
    }

    if (code.startsWith('pl')) {
      return (
        'Cześć! Uruchomiłeś tego bota, ale jeszcze nic nie pobrałeś — ' +
        'może nie było jasne, od czego zacząć.\n\n' +
        'Wystarczy jeden krok: wyślij tu link do filmu, ' +
        'na przykład https://youtube.com/watch?v=jNQXAC9IVRw — a ja odeślę ' +
        'gotowy plik w mniej więcej pół minuty.\n\n' +
        'Działa z YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest i Threads. Całkowicie za darmo i w dowolnej ' +
        'jakości — do 4K, za HD nic nie dopłacasz.\n\n' +
        'Jeśli coś nie działa, po prostu odpisz tutaj. To ' +
        'jedyne przypomnienie, więcej nie będę przeszkadzać.'
      );
    }

    if (code.startsWith('ur')) {
      return (
        'السلام علیکم! آپ نے یہ بوٹ شروع کیا تھا، لیکن ابھی تک کچھ ڈاؤن لوڈ نہیں کیا — ' +
        'شاید یہ واضح نہیں تھا کہ کہاں سے شروع کریں۔\n\n' +
        'بس ایک قدم: یہاں کسی ویڈیو کا لنک بھیجیں، ' +
        'مثلاً https://youtube.com/watch?v=jNQXAC9IVRw — اور میں تقریباً آدھے منٹ میں ' +
        'فائل واپس بھیج دوں گا۔\n\n' +
        'YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، ' +
        'Rutube، OK.ru، Pinterest اور Threads کے ساتھ کام کرتا ہے۔ مکمل طور پر مفت اور کسی بھی ' +
        'کوالٹی میں — 4K تک، HD کے لیے کوئی اضافی خرچ نہیں۔\n\n' +
        'اگر کچھ کام نہ کرے تو بس یہیں جواب دے دیں۔ یہ ' +
        'واحد یاد دہانی ہے، دوبارہ تنگ نہیں کروں گا۔'
      );
    }

    if (code.startsWith('bn')) {
      return (
        'নমস্কার! আপনি এই বটটি চালু করেছেন, কিন্তু এখনও কিছু ডাউনলোড করেননি — ' +
        'হয়তো কোথা থেকে শুরু করবেন বোঝা যায়নি।\n\n' +
        'মাত্র একটি ধাপ: এখানে একটি ভিডিওর লিংক পাঠান, ' +
        'যেমন https://youtube.com/watch?v=jNQXAC9IVRw — আর আমি প্রায় আধা মিনিটের মধ্যে ' +
        'ফাইলটি ফেরত পাঠাব।\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest এবং Threads-এ কাজ করে। সম্পূর্ণ বিনামূল্যে এবং যেকোনো ' +
        'মানে — 4K পর্যন্ত, HD-এর জন্য কোনো অতিরিক্ত খরচ নেই।\n\n' +
        'কিছু কাজ না করলে, শুধু এখানে উত্তর দিন। এটিই ' +
        'একমাত্র রিমাইন্ডার, আর বিরক্ত করব না।'
      );
    }

    if (code.startsWith('vi')) {
      return (
        'Xin chào! Bạn đã khởi động bot này nhưng chưa tải xuống gì — ' +
        'có lẽ bạn chưa rõ nên bắt đầu từ đâu.\n\n' +
        'Chỉ cần một bước: gửi liên kết video vào đây, ' +
        'ví dụ https://youtube.com/watch?v=jNQXAC9IVRw — và mình sẽ gửi lại ' +
        'tệp trong khoảng nửa phút.\n\n' +
        'Hỗ trợ YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest và Threads. Hoàn toàn miễn phí và với mọi ' +
        'chất lượng — lên đến 4K, không mất thêm phí cho HD.\n\n' +
        'Nếu có gì không hoạt động, bạn chỉ cần trả lời tại đây. Đây là ' +
        'lời nhắc duy nhất, mình sẽ không làm phiền nữa.'
      );
    }

    if (code.startsWith('fa')) {
      return (
        'سلام! شما این ربات را راه‌اندازی کردید، اما هنوز چیزی دانلود نکرده‌اید — ' +
        'شاید روشن نبود از کجا باید شروع کرد.\n\n' +
        'فقط یک قدم لازم است: لینک یک ویدیو را اینجا بفرستید، ' +
        'مثلاً https://youtube.com/watch?v=jNQXAC9IVRw — و من فایل آماده را ' +
        'حدود نیم دقیقه بعد برایتان می‌فرستم.\n\n' +
        'با YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، ' +
        'Rutube، OK.ru، Pinterest و Threads کار می‌کند. کاملاً رایگان و با هر ' +
        'کیفیتی — تا 4K، بدون هزینهٔ اضافه برای HD.\n\n' +
        'اگر چیزی کار نکرد، همین‌جا جواب بدهید. این ' +
        'تنها یادآوری است و دیگر مزاحمتان نمی‌شوم.'
      );
    }

    if (code.startsWith('tr')) {
      return (
        'Merhaba! Bu botu başlattınız ama henüz hiçbir şey indirmediniz — ' +
        'belki nereden başlayacağınız net değildi.\n\n' +
        'Tek adım yeterli: buraya bir video bağlantısı gönderin, ' +
        'örneğin https://youtube.com/watch?v=jNQXAC9IVRw — ben de dosyayı ' +
        'yaklaşık yarım dakika içinde size geri göndereyim.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest ve Threads ile çalışır. Tamamen ücretsiz ve istediğiniz ' +
        'kalitede — 4K\'ya kadar, HD için ek ücret yok.\n\n' +
        'Bir şey çalışmazsa buraya yanıt yazmanız yeterli. Bu ' +
        'tek hatırlatma, sizi bir daha rahatsız etmeyeceğim.'
      );
    }

    if (code.startsWith('uz')) {
      return (
        'Assalomu alaykum! Siz bu botni ishga tushirdingiz, lekin hali hech narsa yuklab olmadingiz — ' +
        'balki nimadan boshlashni bilmagandirsiz.\n\n' +
        'Hammasi bir qadamda: bu yerga video havolasini yuboring, ' +
        'masalan https://youtube.com/watch?v=jNQXAC9IVRw — va men tayyor ' +
        'faylni taxminan yarim daqiqada qaytaraman.\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest va Threads bilan ishlaydi. Butunlay bepul va istalgan ' +
        'sifatda — 4K gacha, HD uchun qoʻshimcha toʻlov yoʻq.\n\n' +
        'Agar biror narsa ishlamasa, shu yerga javob yozing. Bu ' +
        'yagona eslatma, boshqa bezovta qilmayman.'
      );
    }

    if (code.startsWith('es')) {
      return (
        '¡Hola! Iniciaste este bot, pero todavía no has descargado nada — ' +
        'quizá no estaba claro por dónde empezar.\n\n' +
        'Es un solo paso: envíame el enlace de un video, ' +
        'por ejemplo https://youtube.com/watch?v=jNQXAC9IVRw — y te devuelvo ' +
        'el archivo en unos treinta segundos.\n\n' +
        'Funciona con YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest y Threads. Totalmente gratis y en cualquier ' +
        'calidad — hasta 4K, el HD no cuesta nada extra.\n\n' +
        'Si algo no funciona, solo responde aquí. Este es ' +
        'el único recordatorio, no volveré a molestarte.'
      );
    }

    if (code.startsWith('pt')) {
      return (
        'Olá! Você iniciou este bot, mas ainda não baixou nada — ' +
        'talvez não tenha ficado claro por onde começar.\n\n' +
        'É só um passo: envie aqui o link de um vídeo, ' +
        'por exemplo https://youtube.com/watch?v=jNQXAC9IVRw — e eu devolvo ' +
        'o arquivo em cerca de meio minuto.\n\n' +
        'Funciona com YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest e Threads. Totalmente grátis e em qualquer ' +
        'qualidade — até 4K, sem custo extra pelo HD.\n\n' +
        'Se algo não funcionar, é só responder aqui. Este é ' +
        'o único lembrete, não vou incomodar de novo.'
      );
    }

    if (code.startsWith('it')) {
      return (
        'Ciao! Hai avviato questo bot, ma non hai ancora scaricato nulla — ' +
        'forse non era chiaro da dove cominciare.\n\n' +
        'Basta un passaggio: mandami il link di un video, ' +
        'per esempio https://youtube.com/watch?v=jNQXAC9IVRw — e ti rimando ' +
        'il file in circa mezzo minuto.\n\n' +
        'Funziona con YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest e Threads. Completamente gratis e in qualsiasi ' +
        'qualità — fino al 4K, l’HD non costa nulla in più.\n\n' +
        'Se qualcosa non funziona, rispondi pure qui. Questo è ' +
        'l’unico promemoria, non ti disturberò più.'
      );
    }

    if (code.startsWith('fr')) {
      return (
        'Bonjour ! Vous avez lancé ce bot, mais vous n’avez encore rien téléchargé — ' +
        'peut-être ne saviez-vous pas par où commencer.\n\n' +
        'Une seule étape suffit : envoyez-moi le lien d’une vidéo, ' +
        'par exemple https://youtube.com/watch?v=jNQXAC9IVRw — et je vous renvoie ' +
        'le fichier en une demi-minute environ.\n\n' +
        'Fonctionne avec YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest et Threads. Entièrement gratuit et dans n’importe quelle ' +
        'qualité — jusqu’à la 4K, sans supplément pour la HD.\n\n' +
        'Si quelque chose ne fonctionne pas, répondez simplement ici. C’est ' +
        'le seul rappel, je ne vous dérangerai plus.'
      );
    }

    if (code.startsWith('de')) {
      return (
        'Hallo! Du hast diesen Bot gestartet, aber noch nichts heruntergeladen — ' +
        'vielleicht war nicht klar, wo man anfängt.\n\n' +
        'Es ist nur ein Schritt: Schick mir einen Link zu einem Video, ' +
        'zum Beispiel https://youtube.com/watch?v=jNQXAC9IVRw — und ich schicke dir ' +
        'die Datei in etwa einer halben Minute zurück.\n\n' +
        'Funktioniert mit YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest und Threads. Komplett kostenlos und in jeder ' +
        'Qualität — bis 4K, HD kostet nichts extra.\n\n' +
        'Wenn etwas nicht klappt, antworte einfach hier. Das ist ' +
        'die einzige Erinnerung — ich melde mich nicht noch einmal.'
      );
    }

    if (code.startsWith('sw')) {
      return (
        'Habari! Uliwasha bot hii, lakini bado hujapakua chochote — ' +
        'huenda haikuwa wazi uanzie wapi.\n\n' +
        'Ni hatua moja tu: tuma hapa kiungo cha video, ' +
        'kwa mfano https://youtube.com/watch?v=jNQXAC9IVRw — nami nitakurudishia ' +
        'faili ndani ya takriban nusu dakika.\n\n' +
        'Inafanya kazi na YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest na Threads. Bure kabisa na kwa ubora ' +
        'wowote — hadi 4K, hakuna malipo ya ziada kwa HD.\n\n' +
        'Kama kitu hakifanyi kazi, nijibu tu hapa. Huu ndio ' +
        'ukumbusho pekee, sitakusumbua tena.'
      );
    }

    if (code.startsWith('id') || code.startsWith('in')) {
      return (
        'Halo! Anda sudah memulai bot ini, tetapi belum mengunduh apa pun — ' +
        'mungkin belum jelas harus mulai dari mana.\n\n' +
        'Cukup satu langkah: kirim tautan video ke sini, ' +
        'misalnya https://youtube.com/watch?v=jNQXAC9IVRw — dan saya akan mengirim ' +
        'filenya kembali dalam sekitar setengah menit.\n\n' +
        'Mendukung YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest, dan Threads. Sepenuhnya gratis dan dalam kualitas ' +
        'apa pun — hingga 4K, tanpa biaya tambahan untuk HD.\n\n' +
        'Jika ada yang tidak berfungsi, cukup balas pesan ini. Ini ' +
        'satu-satunya pengingat, saya tidak akan mengganggu lagi.'
      );
    }

    if (code.startsWith('hi')) {
      return (
        'नमस्ते! आपने यह बॉट शुरू किया था, लेकिन अभी तक कुछ भी डाउनलोड नहीं किया — ' +
        'शायद यह साफ़ नहीं था कि शुरुआत कहाँ से करें।\n\n' +
        'बस एक कदम: यहाँ किसी वीडियो का लिंक भेजें, ' +
        'जैसे https://youtube.com/watch?v=jNQXAC9IVRw — और मैं लगभग आधे मिनट में ' +
        'तैयार फ़ाइल वापस भेज दूँगा।\n\n' +
        'YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest और Threads के साथ काम करता है। पूरी तरह मुफ़्त और किसी भी ' +
        'क्वालिटी में — 4K तक, HD के लिए कोई अतिरिक्त शुल्क नहीं।\n\n' +
        'अगर कुछ काम न करे, तो बस जवाब में लिख दें। यह ' +
        'इकलौता रिमाइंडर है, आगे परेशान नहीं करूँगा।'
      );
    }

    if (code.startsWith('zh')) {
      return (
        '你好！你启动了这个机器人，但还没有下载任何内容——' +
        '也许是不清楚从哪里开始。\n\n' +
        '只需一步：把视频链接发到这里，' +
        '例如 https://youtube.com/watch?v=jNQXAC9IVRw ——大约半分钟后' +
        '我就会把文件发回给你。\n\n' +
        '支持 YouTube、TikTok、Instagram、Facebook、Twitter/X、Vimeo、VK、' +
        'Rutube、OK.ru、Pinterest 和 Threads。完全免费，任意画质——' +
        '最高 4K，HD 无需额外付费。\n\n' +
        '如果遇到问题，直接回复这条消息告诉我即可。这是' +
        '唯一一次提醒，之后不会再打扰你。'
      );
    }

    if (code.startsWith('ar')) {
      return (
        'مرحبًا! لقد شغّلت هذا البوت لكنك لم تحمّل شيئًا بعد — ' +
        'ربما لم يكن واضحًا من أين تبدأ.\n\n' +
        'الأمر يتم بخطوة واحدة: أرسل هنا رابط فيديو، ' +
        'مثلًا https://youtube.com/watch?v=jNQXAC9IVRw — وسأعيد إليك الملف ' +
        'جاهزًا خلال نصف دقيقة تقريبًا.\n\n' +
        'يعمل مع YouTube وTikTok وInstagram وFacebook وTwitter/X وVimeo وVK ' +
        'وRutube وOK.ru وPinterest وThreads. مجاني بالكامل وبأي جودة — ' +
        'حتى 4K، ولا حاجة لدفع أي مبلغ مقابل HD.\n\n' +
        'إذا لم ينجح شيء، فقط اكتب لي ذلك في الرد. هذا ' +
        'هو التذكير الوحيد، ولن أزعجك مرة أخرى.'
      );
    }

    if (code.startsWith('uk')) {
      return (
        'Вітаю! Ви запускали цього бота, але поки нічого не завантажили — ' +
        'можливо, було незрозуміло, з чого почати.\n\n' +
        'Усе робиться за одну дію: надішліть сюди посилання на відео, ' +
        'наприклад https://youtube.com/watch?v=jNQXAC9IVRw — і я поверну готовий ' +
        'файл приблизно за пів хвилини.\n\n' +
        'Працюють YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest і Threads. Повністю безкоштовно й у будь-якій ' +
        'якості — аж до 4K, доплачувати за HD не потрібно.\n\n' +
        'Якщо щось не спрацює, просто напишіть про це у відповідь. Це ' +
        'єдине нагадування, більше не потурбую.'
      );
    }

    if (code.startsWith('ru')) {
      return (
        'Здравствуйте! Вы запускали этого бота, но пока ничего не скачали — ' +
        'возможно, было непонятно, с чего начать.\n\n' +
        'Всё делается в одно действие: пришлите сюда ссылку на видео, ' +
        'например https://youtube.com/watch?v=jNQXAC9IVRw — и я верну готовый ' +
        'файл примерно за полминуты.\n\n' +
        'Работают YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru, Pinterest и Threads. Полностью бесплатно и в любом ' +
        'качестве — вплоть до 4K, доплачивать за HD не нужно.\n\n' +
        'Если что-то не сработает, просто напишите об этом в ответ. Это ' +
        'единственное напоминание, больше не побеспокою.'
      );
    }

    return (
      "Hi! You started this bot but haven't downloaded anything yet — maybe it " +
      "wasn't clear where to begin.\n\n" +
      'It takes one step: send me a link to a video, for example ' +
      'https://youtube.com/watch?v=jNQXAC9IVRw — and I’ll send the file back in ' +
      'about half a minute.\n\n' +
      'Works with YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
      'Rutube, OK.ru, Pinterest and Threads. Completely free and in any ' +
      'quality, up to 4K — HD costs nothing extra.\n\n' +
      'If something goes wrong, just reply here. This is the only reminder — ' +
      "I won't message you again."
    );
  }

  private async send(
    telegramId: bigint,
    text: string,
  ): Promise<'sent' | 'blocked' | 'retry'> {
    const token = process.env.BOT_TOKEN;
    if (!token) {
      this.logger.warn('Не настроен BOT_TOKEN — подсказка не отправлена');
      return 'retry';
    }

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramId.toString(),
          text,
          // Ссылка в тексте — пример, а не то, что человек должен открыть:
          // превью только отвлекало бы от смысла сообщения.
          disable_web_page_preview: true,
        }),
      });

      if (res.ok) {
        return 'sent';
      }

      const body = await res.text();
      // 403 — заблокировал бота; 400 с "chat not found" — удалил аккаунт.
      // И то и другое означает «больше не пытаться».
      if (res.status === 403 || (res.status === 400 && body.includes('chat not found'))) {
        this.logger.log(`${telegramId}: бот заблокирован или чат недоступен — помечаю, чтобы не повторять`);
        return 'blocked';
      }

      this.logger.error(`Telegram отклонил подсказку для ${telegramId}: ${res.status} ${body.slice(0, 200)}`);
      return 'retry';
    } catch (error) {
      this.logger.error(`Ошибка отправки подсказки для ${telegramId}:`, error);
      return 'retry';
    }
  }
}
