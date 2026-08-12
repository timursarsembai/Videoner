"""Экстрактор Threads для yt-dlp.

Своего экстрактора Threads в yt-dlp нет (заявки висят с 2023 года), а generic
получает пустой JS-шелл. Разведка 10.08.2026 показала следующее.

Обычному браузерному UA Threads отдаёт один и тот же шелл ~255 КБ и на профиль,
и на пост, и на /embed/ — медиа-данных в нём нет вообще; контент подтягивается
GraphQL-запросом уже в браузере. Приватный API /api/v1/media/<pk>/info/ анониму
отвечает редиректом на логин. Прокси не помогает: через него приходит тот же
шелл, то есть дело не в IP дата-центра.

Работает единственный путь: запросить каноническую ссылку с UA поискового
робота — тогда Meta отдаёт server-side рендер, и в блоках
<script type="application/json" data-sjs> лежит тот же JSON, что получает
приложение, вместе с video_versions. Примерно половина запросов всё равно
возвращает шелл, поэтому здесь повтор; на шести постах трёх аккаунтов повтор
дал 6 из 6.

Когда основной путь не справился, идём в соседний контейнер threads-resolver —
он открывает пост в Chromium и перехватывает тот же GraphQL-ответ. Это резерв
на случай, если Meta начнёт сверять UA робота с reverse DNS и путь выше умрёт.
Той же дорогой уходят короткие ссылки /t/CODE: их SSR не отдаёт ни при каком UA.

Пост может нести несколько файлов (carousel_media) и смешивать в них видео с
фотографиями — такой отдаём плейлистом, по элементу на файл. Виды файлов
различаются по media_type: 1 — фото, 2 — видео, 8 — карусель, 19 — пост без
медиа вовсе (у него, что важно, image_versions2 присутствует, но пуст).
"""

import base64
import json
import os
import re
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

from yt_dlp.extractor.common import InfoExtractor
from yt_dlp.utils import ExtractorError, int_or_none, traverse_obj, url_or_none

# UA поискового робота. Именно полный, а не короткий "Googlebot": короткий
# отдаёт вместе с постом ещё и ленту рекомендаций (до 22 чужих видео в ответе),
# а лишние узлы тут — прямой риск отдать пользователю не тот ролик.
_CRAWLER_UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

# Столько раз пробуем дешёвый путь, прежде чем поднимать Chromium.
_ATTEMPTS = 5
_RETRY_SLEEP = 1.5

# Если основной путь провалился целиком столько раз подряд за _DEGRADED_WINDOW,
# считаем его закрытым и делаем всего одну попытку — проверка при каждом
# скачивании сохраняется, но мы не жжём по пять запросов и ~10 секунд на каждом.
# Состояние во временном файле, потому что yt-dlp запускается новым процессом
# на каждое скачивание и память между запусками не переживает.
_DEGRADED_AFTER = 3
_DEGRADED_WINDOW = 30 * 60
_STATE_FILE = os.path.join(tempfile.gettempdir(), 'yt-dlp-threads-state.json')

_SJS_RE = re.compile(r'<script type="application/json"[^>]*\bdata-sjs\b[^>]*>(.*?)</script>', re.S)

# Threads отдаёт ровно один прогрессивный рендер, ограниченный по короткой
# стороне; предел зашит в тег кодировки внутри самой ссылки
# (…xpv_progressive.INSTAGRAM.CLIPS.C3.720.dash_baseline_1_v1…).
_VENCODE_CAP_RE = re.compile(r'\.C\d+\.(\d{3,4})\.')
_DEFAULT_CAP = 720

# Ссылка «Поделиться» из мобильного приложения — threads.com/share/<код>.
# Код в ней СВОЙ и с кодом поста не совпадает, а редиректа на канонический
# адрес нет: страница отвечает 200 сама по себе. Зато в её разметке лежит
# og:url с настоящим адресом поста, и данные поста там же — второй запрос не
# нужен. Символ @ в og:url приходит экранированным (&#064;), поэтому в шаблоне
# допускаем оба вида.
_OG_URL_RE = re.compile(r'<meta property="og:url" content="([^"]+)"')
_CANONICAL_RE = re.compile(r'/(?:@|&#0?64;)([^/"?#]+)/post/([A-Za-z0-9_-]+)')


class ThreadsIE(InfoExtractor):
    IE_NAME = 'threads'
    IE_DESC = 'Threads (Meta)'
    _VALID_URL = (
        r'https?://(?:www\.)?threads\.(?:net|com)/'
        r'(?:@(?P<uploader>[^/?#]+)/post/(?P<id>[A-Za-z0-9_-]+)'
        r'|t/(?P<short>[A-Za-z0-9_-]+)'
        r'|share/(?P<share>[A-Za-z0-9_-]+))'
    )

    # ------------------------------------------------------------------ #
    # Состояние основного пути                                            #
    # ------------------------------------------------------------------ #

    def _read_state(self):
        try:
            with open(_STATE_FILE, encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}

    def _write_state(self, state):
        # Состояние — подсказка, а не источник истины: не смогли записать,
        # значит следующий запуск просто сделает полный круг попыток.
        try:
            with open(_STATE_FILE, 'w', encoding='utf-8') as f:
                json.dump(state, f)
        except Exception:
            pass

    def _planned_attempts(self):
        state = self._read_state()
        fails = int_or_none(state.get('fails')) or 0
        since = time.time() - (state.get('ts') or 0)
        if fails >= _DEGRADED_AFTER and since < _DEGRADED_WINDOW:
            self.write_debug(
                f'Threads: основной путь не отвечал {fails} раз подряд, '
                f'делаем одну проверочную попытку и уходим в резерв')
            return 1
        return _ATTEMPTS

    def _note_primary(self, ok):
        if ok:
            self._write_state({'fails': 0, 'ts': time.time()})
            return
        state = self._read_state()
        fails = (int_or_none(state.get('fails')) or 0) + 1
        self._write_state({'fails': fails, 'ts': time.time()})

    # ------------------------------------------------------------------ #
    # Разбор JSON                                                         #
    # ------------------------------------------------------------------ #

    def _post_node(self, webpage, code):
        """Узел запрошенного поста, и только он.

        Сверка по code обязательна. На несуществующий или удалённый пост
        Threads не отдаёт 404, а молча рендерит посторонние посты — без этой
        проверки пользователь получил бы чужое видео вместо запрошенного
        (проверено на выдуманном коде: приходит 585 КБ нормального вида,
        og:url при этом вырождается в голый https://www.threads.com/).

        Одному коду отвечает несколько узлов разной полноты, и первый
        попавшийся годится не всегда: у поста-карусели рядом лежит «худой»
        двойник с одной обложкой. Взяв его, мы отдали бы одну картинку вместо
        шести файлов, поэтому собираем всех кандидатов и берём содержательного.
        """
        found = []

        def walk(obj):
            if isinstance(obj, dict):
                if obj.get('code') == code:
                    found.append(obj)
                for value in obj.values():
                    walk(value)
            elif isinstance(obj, list):
                for value in obj:
                    walk(value)

        for blob in _SJS_RE.findall(webpage):
            try:
                walk(json.loads(self._unescape(blob)))
            except Exception:
                continue
            if found:
                return max(found, key=self._richness)
        return None

    @classmethod
    def _richness(cls, node):
        """Похож ли узел на полные данные поста, а не на огрызок."""
        if cls._carousel_items(node):
            return 3
        if node.get('video_versions'):
            return 2
        if cls._candidates(node):
            return 1
        return 0

    @staticmethod
    def _unescape(blob):
        # Meta экранирует <, > и & внутри application/json, чтобы блок не
        # разорвал разметку; без обратной замены ссылки CDN приходят с &amp;
        # в параметрах и не открываются.
        return blob.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"')

    @staticmethod
    def _carousel_items(node):
        """Элементы карусели. У обычного поста их нет — вернётся пустой список."""
        items = node.get('carousel_media')
        if not isinstance(items, list):
            return []
        return [item for item in items if isinstance(item, dict)]

    @staticmethod
    def _candidates(node):
        """Варианты снимка. Пустой список — значит картинки у узла нет вовсе.

        Проверять именно кандидатов, а не наличие самого image_versions2:
        текстовые посты (media_type=19) несут этот объект пустым, и по одному
        его присутствию мы принимали бы запись без единой картинки за фото.
        """
        return [candidate
                for candidate in traverse_obj(node, ('image_versions2', 'candidates')) or []
                if isinstance(candidate, dict) and url_or_none(candidate.get('url'))]

    @classmethod
    def _media_items(cls, node):
        """Файлы поста по порядку. Одиночный пост — сам себе единственный файл."""
        return cls._carousel_items(node) or [node]

    @staticmethod
    def _delivered_size(media, video_url):
        """Фактические размеры файла, а не размеры исходника.

        original_width/height описывают исходник: для поста 2160x3840 реально
        приходит 720x1280. Отдать наверх размеры исходника нельзя — логика
        платного качества посчитала бы 4K, а пользователь получил бы 720p.
        Считаем по пределу из тега кодировки; формула сошлась на всех трёх
        файлах, которые я скачал и прогнал через ffprobe (720x900, 720x1280
        и 4K-исходник, приехавший как 720x1280).
        """
        width = int_or_none(media.get('original_width'))
        height = int_or_none(media.get('original_height'))
        if not width or not height:
            return None, None
        cap = int_or_none(traverse_obj(_VENCODE_CAP_RE.search(video_url), 1)) or _DEFAULT_CAP
        short = min(width, height)
        if short <= cap:
            return width, height
        scale = cap / short
        return round(width * scale), round(height * scale)

    @staticmethod
    def _duration(video_url):
        # Длительности в JSON поста нет, но она лежит в параметре efg самой
        # ссылки — base64 с описанием кодировки.
        try:
            efg = urllib.parse.parse_qs(urllib.parse.urlparse(video_url).query)['efg'][0]
            payload = json.loads(base64.b64decode(efg + '=' * (-len(efg) % 4)).decode())
            return int_or_none(payload.get('duration_s'))
        except Exception:
            return None

    def _thumbnails(self, item):
        """Обложки по возрастанию размера — самая крупная последней.

        Порядок здесь не косметика, а уговор с сервером: полноразмерный снимок
        он берёт последним в списке (см. bestPhotoUrl в server/src/lib/playlist.ts).
        В самом JSON кандидаты идут наоборот, от крупного к мелкому, и часть из
        них — квадратные обрезки того же кадра, поэтому сортируем по площади, а
        не полагаемся на исходный порядок. Ту же сортировку делает и сам yt-dlp,
        но только когда размеры заполнены, — а он у нас не единственный
        потребитель этого списка.
        """
        thumbnails = [{
            'url': candidate['url'],
            'width': int_or_none(candidate.get('width')),
            'height': int_or_none(candidate.get('height')),
        } for candidate in self._candidates(item)]
        thumbnails.sort(key=lambda t: (t['width'] or 0) * (t['height'] or 0))
        return thumbnails

    def _entry_from_item(self, item, node, index, code, url):
        """Один файл поста: видео либо фотография.

        Фотография возвращается с пустым formats — так её отличает и yt-dlp, и
        наш сервер (entryKind в server/src/lib/playlist.ts): у снимка форматов
        нет, а ссылка на него лежит в обложках.
        """
        thumbnails = self._thumbnails(item)
        # Элементы карусели своего кода не имеют — только pk. Собираем id из
        # кода поста и номера, чтобы он оставался читаемым и не совпадал у
        # соседних файлов.
        entry_id = code if item is node else f'{code}-{index}'

        video_url = url_or_none(traverse_obj(item, ('video_versions', 0, 'url')))
        if not video_url:
            if not thumbnails:
                return None
            return {
                'id': entry_id,
                'formats': [],
                'thumbnails': thumbnails,
                'width': int_or_none(item.get('original_width')),
                'height': int_or_none(item.get('original_height')),
            }

        # Все три version type (101/102/103) указывают на один и тот же файл —
        # выбора качества у Threads нет, рендер ровно один.
        width, height = self._delivered_size(item, video_url)

        # has_audio у элементов карусели не заполнен — его нет ни у самого
        # элемента, ни у поста над ним (проверено на смешанной карусели
        # 12.08.2026). Раз признак неизвестен, считаем, что звук есть: рендеры
        # Threads прогрессивные и смикшированные, а вот пометив живой ролик
        # беззвучным, мы отдали бы пользователю немое видео.
        has_audio = item.get('has_audio')
        if has_audio is None:
            has_audio = node.get('has_audio')

        # Формат отдаём СПИСКОМ, а не полями url/ext на верхнем уровне. При
        # единственном формате yt-dlp принимает и то и другое, но в --dump-json
        # тогда не появляется ключ formats, а сервер разбирает ответ для всех
        # площадок одинаково — через info.formats.filter(). Без списка /info
        # падал с "Cannot read properties of undefined (reading 'filter')"
        # (поймано на staging 10.08.2026).
        video_format = {
            'format_id': 'progressive',
            'url': video_url,
            'ext': 'mp4',
            'width': width,
            'height': height,
            'vcodec': 'avc1',
            # Файл прогрессивный, звук уже смикширован — проверено ffprobe
            # (h264 + aac в одном mp4), доклеивать ffmpeg-ом нечего.
            'acodec': 'none' if has_audio is False else 'aac',
        }

        return {
            'id': entry_id,
            'formats': [video_format],
            'duration': self._duration(video_url),
            'thumbnails': thumbnails,
            'width': width,
            'height': height,
        }

    def _info_from_node(self, node, code, url):
        uploader = traverse_obj(node, ('user', 'username'))
        caption = traverse_obj(node, ('caption', 'text')) or ''
        title = caption.strip().splitlines()[0][:120] if caption.strip() else None
        fallback_title = f'Threads post by @{uploader}' if uploader else f'Threads {code}'

        common = {
            'title': title or fallback_title,
            'description': caption.strip() or None,
            'uploader': traverse_obj(node, ('user', 'full_name')),
            'uploader_id': uploader,
            'uploader_url': f'https://www.threads.com/@{uploader}' if uploader else None,
            'timestamp': int_or_none(node.get('taken_at')),
            'like_count': int_or_none(node.get('like_count')),
            'webpage_url': url,
        }

        entries = []
        for index, item in enumerate(self._media_items(node), 1):
            entry = self._entry_from_item(item, node, index, code, url)
            if entry:
                entries.append({**common, **entry, 'extractor_key': self.ie_key()})

        if not entries:
            return None

        # Один файл отдаём как один файл, а не как плейлист из одного: так
        # ответ для обычного поста остаётся ровно таким, каким был до появления
        # каруселей, и весь код ниже по течению не замечает разницы.
        if len(entries) == 1:
            return {**entries[0], 'id': code}

        return {
            **common,
            '_type': 'playlist',
            'id': code,
            'entries': entries,
        }

    # ------------------------------------------------------------------ #
    # Основной путь: SSR по UA робота                                     #
    # ------------------------------------------------------------------ #

    @staticmethod
    def _code_from_og_url(webpage):
        """Код поста из og:url.

        Нужен для ссылок «Поделиться» (threads.com/share/<код>): их код —
        свой собственный, с кодом поста не совпадает, а редиректа на
        канонический адрес нет. При этом на несуществующий пост og:url
        вырождается в голый https://www.threads.com/ — шаблон тогда не
        совпадёт, и код останется неизвестным. Это и нужно: лучше уйти в
        резерв, чем взять первое попавшееся видео со страницы.
        """
        og = _OG_URL_RE.search(webpage)
        if not og:
            return None
        canonical = _CANONICAL_RE.search(og.group(1))
        return canonical.group(2) if canonical else None

    def _extract_via_crawler(self, target, code):
        """code=None — адрес не содержит кода поста (ссылка «Поделиться»),
        тогда берём его из og:url той же страницы."""
        attempts = self._planned_attempts()
        for attempt in range(1, attempts + 1):
            webpage = self._download_webpage(
                target, code or 'threads', fatal=False,
                headers={'User-Agent': _CRAWLER_UA, 'Accept-Language': 'en-US,en;q=0.9'},
                note=f'Запрашиваю пост (попытка {attempt} из {attempts})',
                errnote=False)
            if webpage:
                code = code or self._code_from_og_url(webpage)
            if webpage and code:
                node = self._post_node(webpage, code)
                if node:
                    info = self._info_from_node(node, code, target)
                    if info:
                        self._note_primary(True)
                        return info
                    # Пост нашёлся, но медиа в нём нет — повторять бессмысленно.
                    self._note_primary(True)
                    raise ExtractorError(
                        'В этом посте Threads нет ни видео, ни фотографий', expected=True)
            if attempt < attempts:
                time.sleep(_RETRY_SLEEP)
        self._note_primary(False)
        return None

    # ------------------------------------------------------------------ #
    # Резерв: соседний контейнер с Chromium                               #
    # ------------------------------------------------------------------ #

    def _resolver_base(self):
        return (self._configuration_arg('resolver_url', [None])[0]
                or os.environ.get('THREADS_RESOLVER_URL')
                or 'http://threads-resolver:4417')

    def _extract_via_resolver(self, url, code):
        base = self._resolver_base().rstrip('/')
        endpoint = f'{base}/resolve?url={urllib.parse.quote(url, safe="")}'
        self.to_screen('Основной путь не сработал, поднимаю резервный резолвер')
        try:
            # Намеренно НЕ через _download_json: yt-dlp применил бы к запросу
            # общий --proxy (у нас он включается автоматически при блокировках),
            # и обращение к соседнему контейнеру ушло бы во внешний прокси.
            opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
            with opener.open(endpoint, timeout=120) as response:
                payload = json.loads(response.read().decode('utf-8'))
        except urllib.error.URLError as e:
            raise ExtractorError(
                f'Резервный резолвер Threads недоступен: {e.reason}', expected=True)
        except Exception as e:
            raise ExtractorError(f'Резервный резолвер Threads ответил неожиданно: {e}')

        if not payload.get('ok'):
            raise ExtractorError(
                payload.get('error') or 'Резервный резолвер не нашёл видео', expected=True)

        node = payload['node']
        # Резолвер перехватывает тот же GraphQL-ответ, что лежит в SSR, поэтому
        # разбираем его тем же кодом — расхождению в полях взяться неоткуда.
        info = self._info_from_node(node, node.get('code') or code, url)
        if not info:
            raise ExtractorError(
                'В этом посте Threads нет ни видео, ни фотографий', expected=True)
        return info

    # ------------------------------------------------------------------ #

    def _real_extract(self, url):
        match = self._match_valid_url(url)
        code = match.group('id')
        uploader = match.group('uploader')
        share = match.group('share')

        target = None
        if uploader and code:
            target = f'https://www.threads.com/@{uploader}/post/{code}'
        elif share:
            # Страница «Поделиться» сама отдаёт и данные поста, и его
            # канонический адрес в og:url — отдельный запрос не нужен.
            target = f'https://www.threads.com/share/{share}/'
            code = None

        # Короткие ссылки /t/CODE SSR не отдают ни при каком UA — они сразу
        # уходят в резерв, там их открывает настоящий браузер.
        if target:
            info = self._extract_via_crawler(target, code)
            if info:
                return info

        return self._extract_via_resolver(url, code or share or match.group('short'))
