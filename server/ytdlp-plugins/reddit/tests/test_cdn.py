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
utils = types.ModuleType('yt_dlp.utils')
utils.ExtractorError = ExtractionError
source = Path(__file__).parents[1] / 'yt_dlp_plugins/extractor/reddit_videoner.py'
spec = importlib.util.spec_from_file_location('reddit_cdn_under_test', source)
module = importlib.util.module_from_spec(spec)
with patch.dict(sys.modules, {'yt_dlp': types.ModuleType('yt_dlp'), 'yt_dlp.extractor': types.ModuleType('yt_dlp.extractor'),
                            'yt_dlp.extractor.reddit': reddit, 'yt_dlp.utils': utils}):
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

    def test_adult_refusal_happens_before_any_cdn_or_isp_access(self):
        opener = Mock(); opener.open.return_value = io.BytesIO(json.dumps({'ok': True, 'media': {'over_18': True}}).encode())
        with patch.object(module.urllib.request, 'build_opener', return_value=opener), \
                patch.object(module, '_cdn_manifest', side_effect=AssertionError('must not fetch media')):
            with self.assertRaisesRegex(ExtractionError, 'Adult content:'):
                module.VideonerRedditIE()._real_extract('https://www.reddit.com/comments/abc123/')


if __name__ == '__main__':
    unittest.main()
