// Темы, частоту которых владелец хочет видеть (18.11.2026): религия по
// конфессиям и эзотерика. Пока ТОЛЬКО подсчёт в дашборде, ничего не
// блокируем — решение о блокировке владелец примет, посмотрев цифры.
//
// Определяем по словам в названии, хэштегах и имени автора. Это грубо: видео,
// подписанное одними эмодзи, сюда не попадёт, а слово может встретиться не по
// теме. Поэтому в дашборде у каждой темы есть примеры — по ним видно, где
// список слов промахивается, и его правят здесь (подсчёт идёт на лету, так что
// правка сразу пересчитывает и прошлое).
//
// Слово — начало слова (основа): «ислам» найдёт и «исламский». Слова со
// знаком «=» на конце — только целиком (короткие, иначе ловили бы лишнее).

export type TopicId =
  | 'islam'
  | 'christianity'
  | 'judaism'
  | 'eastern'
  | 'religion_other'
  | 'esoteric';

export const TOPIC_LABELS: Record<TopicId, string> = {
  islam: 'Ислам',
  christianity: 'Христианство',
  judaism: 'Иудаизм',
  eastern: 'Буддизм, индуизм',
  religion_other: 'Религия (без уточнения)',
  esoteric: 'Эзотерика',
};

const WORDS: Record<TopicId, string[]> = {
  islam: [
    'islam', 'ислам', 'muslim', 'мусульм', 'мұсылман', 'quran', 'qur\'an', 'koran', 'коран', 'құран', 'куран',
    'allah', 'аллах', 'алла таға', 'алла тағала', 'аллаһ', 'namaz=', 'намаз=', 'намаза=', 'намазы=', 'намазе=', 'намазу=', 'сура=', 'суры=', 'surah',
    'hadith', 'хадис', 'хадис', 'мечет', 'mosque', 'мешіт', 'ramadan', 'рамадан', 'рамазан', 'ораза', 'iftar', 'ифтар',
    'дуа=', 'dua=', 'дұға', 'sunnah', 'сунна', 'сүннет', 'пророк мухаммад', 'пророка мухаммад', 'prophet muhammad', 'пайғамбар',
    'ﷺ', 'inshallah', 'иншаллах', 'иншааллах', 'mashallah', 'машаллах', 'машаАллах', 'alhamdulillah', 'альхамдулиллях',
    'әлхамдулиллаһ', 'subhanallah', 'субханаллах', 'бисмилл', 'bismill', 'имам=', 'imam=', 'ummah', 'умма=',
    'hijab', 'хиджаб', 'никях', 'nikah', 'джума=', 'джума-намаз', 'жұма намаз', 'азан=', 'adhan', 'такбир', 'устаз', 'ұстаз', 'ustaz',
    'мулла', 'тауба', 'тәубе', 'тавба', 'jannah', 'джаннат', 'жәннат', 'ахират', 'ақырет', 'akhirah', 'dhikr', 'зикр',
    'салават', 'salawat', 'nasheed', 'нашид', 'хадж', 'hajj', 'умра', 'umrah', 'шариат', 'sharia', 'фикх', 'фетва',
    'الله', 'قرآن', 'سورة', 'اللهم', 'سبحان', 'الحمد', 'إسلام', 'الإسلام', 'مسلم', 'رسول', 'صلى',
  ],
  christianity: [
    'christianity', 'christian music', 'christian song', 'christian worship', 'jesus christ', 'christ=', 'христиан', 'христос', 'христа=', 'христе=', 'иисус', 'jesus', 'bible', 'библи', 'евангелие', 'евангелия', 'евангельск', 'gospel', 'church', 'церков', 'церкв',
    'православ', 'orthodox', 'catholic', 'католи', 'протестант', 'пастор', 'pastor', 'проповед', 'sermon',
    'батюшк', 'священник', 'priest', 'богородиц', 'virgin mary', 'икона', 'иконы', 'крещени', 'baptism', 'пасха',
    'псалом', 'псалт', 'psalm', 'аминь', 'господь', 'архиерей', 'монастыр', 'монах', 'patriarch',
    'патриарх', 'hallelujah', 'аллилуй', 'святой дух', 'holy spirit',
  ],
  judaism: [
    'judaism', 'иудаи', 'torah', 'тора=', 'талмуд', 'talmud', 'rabbi', 'раввин', 'синагог', 'synagogue',
    'shabbat', 'шаббат', 'hanukkah', 'ханук', 'кашрут',
  ],
  eastern: [
    'buddh', 'будд', 'dharma', 'дхарм', 'krishna', 'кришн', 'веды=', 'ведическ', 'vedic', 'shiva=', 'шива=',
    'ganesh', 'ганеш', 'hindu', 'индуи', 'bhagavad', 'бхагавад', 'далай-лам', 'dalai lama',
  ],
  religion_other: [
    'religion', 'религи', 'дін=', 'діни', 'молитв', 'богослов', 'духовн', 'грех',
  ],
  esoteric: [
    'таро', 'taro=', 'tarot', 'таролог', 'астролог', 'astrolog', 'гороскоп', 'horoscope', 'натальн', 'natal chart',
    'нумеролог', 'numerolog', 'эзотер', 'esoter', 'приворот', 'отворот', 'порча', 'порчу', 'сглаз', 'гадани',
    'гадалк', 'гадаю', 'witchtok', 'witchcraft', 'чакр', 'chakra', 'манифестац', 'manifesting',
    'manifestation', 'закон притяжения', 'law of attraction', 'руны', 'рун=', 'runes', 'матрица судьбы',
    'human design', 'дизайн человека', 'ретроградн', 'retrograde', 'зодиак', 'zodiac', 'знак зодиака', 'экстрасенс',
    'psychic', 'медиум', 'ясновид', 'оберег', 'амулет', 'кармическ', 'ченнелинг', 'channeling',
    'ангельские числа', 'angel number', 'хиромант', 'palmistry', 'бал ашу', 'балгер', 'сиқыр', 'магия', 'магии',
    'колдов', 'заговор на', 'ритуал на', 'энергетическ', 'astrology', 'tarotreading', 'tarotcards',
    'полнолуни', 'новолуни', 'full moon ritual', 'аффирмац', 'affirmation', 'медитац',
  ],
};

// Ислам и другие конфессии важнее «религии вообще»: если сработало и то и
// другое, тема — конкретная конфессия.
const ORDER: TopicId[] = ['islam', 'christianity', 'judaism', 'eastern', 'esoteric', 'religion_other'];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const PATTERNS: Record<TopicId, RegExp> = Object.fromEntries(
  (Object.keys(WORDS) as TopicId[]).map((id) => {
    const parts = WORDS[id].map((w) => {
      const whole = w.endsWith('=');
      const word = escape((whole ? w.slice(0, -1) : w).toLowerCase());
      // Граница — не буква и не цифра (\b в JS не понимает кириллицу).
      return `(?<![\\p{L}\\p{N}])${word}${whole ? '(?![\\p{L}\\p{N}])' : ''}`;
    });
    return [id, new RegExp(parts.join('|'), 'u')];
  }),
) as Record<TopicId, RegExp>;

export function topicsOf(item: { title?: string | null; hashtags?: string[] | null; author?: string | null }): TopicId[] {
  const text = [item.title ?? '', ...(item.hashtags ?? []).map((t) => `#${t}`), item.author ?? '']
    .join('\n')
    .toLowerCase()
    // Хэштеги пишут слитно (#таролог, #quranrecitation) — «#» не мешает
    // границе слова, а слитное окончание основе не мешает.
    .replace(/#/g, ' ');
  const found = ORDER.filter((id) => PATTERNS[id].test(text));
  // Конкретная конфессия есть — «религия вообще» лишняя.
  const specific = found.some((id) => id !== 'religion_other' && id !== 'esoteric');
  return specific ? found.filter((id) => id !== 'religion_other') : found;
}
