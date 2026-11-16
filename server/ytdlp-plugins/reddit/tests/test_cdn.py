import importlib.util
import io
import json
import os
from pathlib import Path
import sys
import time
import types
import unittest
from unittest.mock import Mock, patch
from urllib.error import HTTPError, URLError


class Base:
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__()


class ExtractionError(Exception):
    def __init__(self, message, **kwargs):
        super().__init__(message)


reddit = types.ModuleType('yt_dlp.extractor.reddit')
reddit.RedditIE = Base
common = types.ModuleType('yt_dlp.extractor.common')
common.InfoExtractor = Base
utils = types.ModuleType('yt_dlp.utils')
utils.ExtractorError = ExtractionError
source = Path(__file__).parents[1] / 'yt_dlp_plugins/extractor/reddit_videoner.py'
spec = importlib.util.spec_from_file_location('reddit_cdn_under_test', source)
module = importlib.util.module_from_spec(spec)
with patch.dict(sys.modules, {'yt_dlp': types.ModuleType('yt_dlp'), 'yt_dlp.extractor': types.ModuleType('yt_dlp.extractor'),
                            'yt_dlp.extractor.reddit': reddit, 'yt_dlp.extractor.common': common, 'yt_dlp.utils': utils}):
    spec.loader.exec_module(module)


class CdnReserveTests(unittest.TestCase):
    URL = 'https://v.redd.it/example/DASHPlaylist.mpd'

    def test_direct_success_does_not_read_proxy_pool(self):
        opener = Mock(); opener.open.return_value = io.BytesIO(b'<MPD/>')
        with patch.object(module.urllib.request, 'build_opener', return_value=opener), \
                patch.object(module, '_isp_pool', side_effect=AssertionError('not needed')):
            self.assertEqual(module._cdn_manifest(self.URL, time.monotonic() + 25), ('<MPD/>', False))

    def test_403_uses_only_isp_pool_and_rotates_failed_proxy(self):
        handlers = []
        def build(handler):
            handlers.append(handler.proxies)
            opener = Mock()
            if len(handlers) == 1:
                opener.open.side_effect = HTTPError(self.URL, 403, 'Forbidden', None, None)
            elif len(handlers) == 2:
                opener.open.side_effect = URLError('ISP failed')
            else:
                opener.open.return_value = io.BytesIO(b'<MPD/>')
            return opener
        with patch.dict(os.environ, {'YOUTUBE_PROXY_URLS': 'http://isp-one.test:1234,http://isp-two.test:1234',
                                     'REDDIT_PROXY_URL': 'http://residential.test:1234'}, clear=True), \
                patch.object(module.random, 'shuffle'), patch.object(module.urllib.request, 'build_opener', side_effect=build):
            self.assertEqual(module._cdn_manifest(self.URL, time.monotonic() + 25), ('<MPD/>', False))
        self.assertEqual(handlers, [{}, {'http': 'http://isp-one.test:1234', 'https': 'http://isp-one.test:1234'},
                                     {'http': 'http://isp-two.test:1234', 'https': 'http://isp-two.test:1234'}])

    def test_missing_file_does_not_spend_proxy_traffic(self):
        opener = Mock(); opener.open.side_effect = HTTPError(self.URL, 404, 'Missing', None, None)
        with patch.object(module.urllib.request, 'build_opener', return_value=opener), \
                patch.object(module, '_isp_pool', side_effect=AssertionError('not needed')):
            self.assertEqual(module._cdn_manifest(self.URL, time.monotonic() + 25), (None, False))

    def test_all_isp_failures_are_reported_without_exception_details(self):
        opener = Mock(); opener.open.side_effect = HTTPError(self.URL, 429, 'blocked', None, None)
        with patch.object(module.urllib.request, 'build_opener', return_value=opener), \
                patch.object(module, '_isp_pool', return_value=['http://isp.test:1234']):
            self.assertEqual(module._cdn_manifest(self.URL, time.monotonic() + 25), (None, True))

    def test_relative_cmaf_manifest_has_absolute_base_for_video_and_audio(self):
        media = {'kind': 'video', 'id': 'abc123', 'over_18': False, 'age_verified': True,
                 'dash_url': 'https://v.redd.it/example/DASHPlaylist.mpd?quality=hd'}
        opener = Mock(); opener.open.return_value = io.BytesIO(json.dumps({'ok': True, 'media': media}).encode())
        extractor = module.VideonerRedditIE()
        extractor._parse_xml = Mock(return_value='parsed manifest')
        def formats(doc, **kwargs):
            # SegmentBase index requests also need an absolute base before
            # yt-dlp can even finish extracting modern CMAF manifests.
            base = kwargs.get('mpd_base_url', '')
            return [{'url': module.urllib.parse.urljoin(base, name)}
                    for name in ['CMAF_220.mp4', 'CMAF_AUDIO_128.mp4']]
        extractor._parse_mpd_formats = Mock(side_effect=formats)
        with patch.object(module.urllib.request, 'build_opener', return_value=opener), \
                patch.object(module, '_cdn_manifest', return_value=('<MPD/>', False)):
            result = extractor._real_extract('https://www.reddit.com/comments/abc123/')
        self.assertEqual([item['url'] for item in result['formats']],
                         ['https://v.redd.it/example/CMAF_220.mp4', 'https://v.redd.it/example/CMAF_AUDIO_128.mp4'])
        self.assertEqual(extractor._parse_mpd_formats.call_args.kwargs['mpd_url'], media['dash_url'])

    def test_adult_refusal_happens_before_any_cdn_or_isp_access(self):
        opener = Mock(); opener.open.return_value = io.BytesIO(json.dumps({'ok': True, 'media': {'over_18': True}}).encode())
        with patch.object(module.urllib.request, 'build_opener', return_value=opener), \
                patch.object(module, '_cdn_manifest', side_effect=AssertionError('must not fetch media')):
            with self.assertRaisesRegex(ExtractionError, 'Adult content:'):
                module.VideonerRedditIE()._real_extract('https://www.reddit.com/comments/abc123/')


class ShareLinkTests(unittest.TestCase):
    # Короткие ссылки идут отдельным классом (см. VideonerRedditShareIE).
    def test_share_links_match_only_the_share_extractor(self):
        import re
        share = re.compile(module.VideonerRedditShareIE._VALID_URL)
        for url in ('https://www.reddit.com/r/mildlyinfuriating/s/SLn5ybPnDJ',
                    'https://reddit.com/r/x/s/AbC_1-2?utm_source=share', 'https://redd.it/1xg31h3'):
            self.assertTrue(share.match(url), url)
        self.assertFalse(share.match('https://www.reddit.com/r/x/comments/1xg31h3/y/'))
        self.assertIs(module.VideonerRedditShareIE._real_extract, module.VideonerRedditIE._real_extract)


if __name__ == '__main__':
    unittest.main()
