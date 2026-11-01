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
