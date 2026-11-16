"""Reddit page metadata from the local browser; media goes straight to Reddit CDN."""
import json
import os
import re
import urllib.parse
import urllib.request

from yt_dlp.extractor.reddit import RedditIE as BuiltinRedditIE
from yt_dlp.utils import ExtractorError

_ADULT = 'Adult content: the platform marked this post as 18+; Videoner does not download such content.'
_UNAVAILABLE = 'Reddit server access unavailable'


def _cdn_url(value, hosts):
    if not isinstance(value, str):
        return None
    parsed = urllib.parse.urlsplit(value)
    if parsed.scheme != 'https' or parsed.hostname not in hosts or parsed.username or parsed.password:
        return None
    if parsed.port not in (None, 443):
        return None
    return value


class VideonerRedditIE(BuiltinRedditIE, plugin_name='videoner'):
    _VALID_URL = r'(?i)https?://(?:(?:(?:www|old|m|np|new)\.)?reddit\.com/(?:(?:(?:r|user)/[^/?#]+/)?comments/[a-z0-9]+(?:/[^?#]*)?|r/[^/?#]+/s/[a-z0-9_-]+/?)|redd\.it/[a-z0-9]+/?)(?:[?#].*)?$'

    def _real_initialize(self):
        # No Reddit account, exported cookies, age opt-in or anonymous JSON API.
        pass

    def _real_extract(self, url):
        base = os.environ.get('REDDIT_RESOLVER_URL', 'http://reddit-resolver:4418').rstrip('/')
        request = urllib.request.Request(base + '/resolve',
            data=json.dumps({'url': url}).encode(), headers={'Content-Type': 'application/json'})
        try:
            opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
            with opener.open(request, timeout=225) as response:
                raw = response.read(1024 * 1024 + 1)
                if len(raw) > 1024 * 1024:
                    raise ValueError('oversized resolver reply')
                result = json.loads(raw)
        except Exception:
            # urllib/browser exceptions can contain authenticated proxy URLs.
            raise ExtractorError(_UNAVAILABLE, expected=True) from None
        if not result.get('ok'):
            code = result.get('code')
            if code == 'REDDIT_ADULT_CONTENT':
                raise ExtractorError(_ADULT, expected=True)
            if code == 'REDDIT_NO_MEDIA':
                raise ExtractorError('No video formats found', expected=True)
            raise ExtractorError(_UNAVAILABLE, expected=True)
        media = result.get('media') or {}
        if media.get('over_18') is True:
            raise ExtractorError(_ADULT, expected=True)
        if media.get('age_verified') is not True or media.get('over_18') is not False:
            raise ExtractorError(_UNAVAILABLE, expected=True)
        post_id = media.get('id')
        expected = re.search(r'/comments/([a-z0-9]+)(?:/|[?#]|$)', url, re.I)
        if not isinstance(post_id, str) or not re.fullmatch(r'[a-z0-9]+', post_id, re.I) or (expected and expected[1].lower() != post_id.lower()):
            raise ExtractorError(_UNAVAILABLE, expected=True)
        info = {'id': post_id, 'title': media.get('title') or post_id,
                'webpage_url': url, 'age_limit': 0, 'over_18': False}
        if media.get('kind') == 'photo':
            image = _cdn_url(media.get('image_url'), ('i.redd.it',))
            if not image:
                raise ExtractorError(_UNAVAILABLE, expected=True)
            return {**info, 'formats': [], 'thumbnails': [{'url': image, 'id': 'original'}]}
        if media.get('kind') != 'video':
            raise ExtractorError('No video formats found', expected=True)
        dash = _cdn_url(media.get('dash_url'), ('v.redd.it',))
        hls = _cdn_url(media.get('hls_url'), ('v.redd.it',))
        formats = self._extract_mpd_formats(dash, post_id, mpd_id='dash', fatal=False) if dash else []
        # MPD declares old DASH_2_4_M/audio and new DASH_720.mp4 /
        # DASH_AUDIO_128.mp4 correctly. Never guess an audio URL or assume
        # that a video without an audio adaptation set has sound.
        if not formats and hls:
            formats = self._extract_m3u8_formats(hls, post_id, 'mp4', m3u8_id='hls', fatal=False)
        if not formats:
            raise ExtractorError('No video formats found', expected=True)
        return {**info, 'formats': formats, 'duration': media.get('duration'),
                'thumbnail': _cdn_url(media.get('thumbnail'), ('i.redd.it', 'preview.redd.it', 'external-preview.redd.it'))}
