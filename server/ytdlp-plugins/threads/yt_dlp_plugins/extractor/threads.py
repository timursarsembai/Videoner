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


class ThreadsIE(InfoExtractor):
    IE_NAME = 'threads'
    IE_DESC = 'Threads (Meta)'
    _VALID_URL = (
        r'https?://(?:www\.)?threads\.(?:net|com)/'
        r'(?:@(?P<uploader>[^/?#]+)/post|t)/(?P<id>[A-Za-z0-9_-]+)'
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
                return found[0]
        return None

    @staticmethod
    def _unescape(blob):
        # Meta экранирует <, > и & внутри application/json, чтобы блок не
        # разорвал разметку; без обратной замены ссылки CDN приходят с &amp;
        # в параметрах и не открываются.
        return blob.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"')

    @staticmethod
    def _media_of(node):
        """Узел с видео: сам пост либо первый видео-элемент карусели."""
        if node.get('video_versions'):
            return node
        for item in node.get('carousel_media') or []:
            if isinstance(item, dict) and item.get('video_versions'):
                return item
        return None

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

    def _info_from_node(self, node, code, url):
        media = self._media_of(node)
        if not media:
            return None
        video_url = url_or_none(traverse_obj(media, ('video_versions', 0, 'url')))
        if not video_url:
            return None

        # Все три version type (101/102/103) указывают на один и тот же файл —
        # выбора качества у Threads нет, рендер ровно один.
        width, height = self._delivered_size(media, video_url)
        has_audio = media.get('has_audio')
        uploader = traverse_obj(node, ('user', 'username'))
        caption = traverse_obj(node, ('caption', 'text')) or ''
        title = caption.strip().splitlines()[0][:120] if caption.strip() else None

        thumbnails = [{
            'url': candidate['url'],
            'width': int_or_none(candidate.get('width')),
            'height': int_or_none(candidate.get('height')),
        } for candidate in traverse_obj(media, ('image_versions2', 'candidates')) or []
            if url_or_none(candidate.get('url'))]

        fallback_title = f'Threads video by @{uploader}' if uploader else f'Threads {code}'

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
            'acodec': 'aac' if has_audio else 'none',
        }

        return {
            'id': code,
            'title': title or fallback_title,
            'description': caption.strip() or None,
            'formats': [video_format],
            'duration': self._duration(video_url),
            'thumbnails': thumbnails,
            'uploader': traverse_obj(node, ('user', 'full_name')),
            'uploader_id': uploader,
            'uploader_url': f'https://www.threads.com/@{uploader}' if uploader else None,
            'timestamp': int_or_none(node.get('taken_at')),
            'like_count': int_or_none(node.get('like_count')),
            'webpage_url': url,
            'extractor_key': self.ie_key(),
        }

    # ------------------------------------------------------------------ #
    # Основной путь: SSR по UA робота                                     #
    # ------------------------------------------------------------------ #

    def _extract_via_crawler(self, code, uploader):
        target = f'https://www.threads.com/@{uploader}/post/{code}'
        attempts = self._planned_attempts()
        for attempt in range(1, attempts + 1):
            webpage = self._download_webpage(
                target, code, fatal=False,
                headers={'User-Agent': _CRAWLER_UA, 'Accept-Language': 'en-US,en;q=0.9'},
                note=f'Запрашиваю пост (попытка {attempt} из {attempts})',
                errnote=False)
            if webpage:
                node = self._post_node(webpage, code)
                if node:
                    info = self._info_from_node(node, code, target)
                    if info:
                        self._note_primary(True)
                        return info
                    # Пост нашёлся, но видео в нём нет — повторять бессмысленно.
                    self._note_primary(True)
                    raise ExtractorError('В этом посте Threads нет видео', expected=True)
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
            raise ExtractorError('В этом посте Threads нет видео', expected=True)
        return info

    # ------------------------------------------------------------------ #

    def _real_extract(self, url):
        match = self._match_valid_url(url)
        code, uploader = match.group('id'), match.group('uploader')

        # Короткие ссылки /t/CODE не отдают SSR ни при каком UA — там имени
        # автора нет, а канонический адрес без него не собрать.
        if uploader:
            info = self._extract_via_crawler(code, uploader)
            if info:
                return info

        return self._extract_via_resolver(url, code)
