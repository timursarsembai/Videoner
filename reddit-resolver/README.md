# Experimental Reddit browser resolver

An isolated diagnostic prototype, **not connected to production API, bot or web**.
It tests automatic reCAPTCHA image selection on a local CPU using a dedicated
tile classifier and YOLOS ONNX models. Optional audio recognition (`--audio`) uses local Whisper;
Google denied the audio challenge in the initial live test. No account
cookies or external inference/captcha service.
Only anonymous browser session data lives in the temporary browser context.

The model revisions and npm dependencies are pinned. Warm up models before
running; the actual probe disables model downloads. Model files belong in a
cache volume, never Git. The experimental runner uses the existing local
`videoner-threads-resolver` image for Chromium and Xvfb; it doesn't modify that
image or any running service.

The runner accepts a public HTTPS Reddit post URL, reads `REDDIT_PROXY_URL`
from its environment or the project's local `.env`, and passes the secret
over standard input. It creates a temporary container limited to 1900 MiB,
one CPU and 200 processes. Reports and challenge screenshots go to `/tmp`.
Don't pass proxy credentials on the command line.

Example, from the repository root, after installing dependencies and warming
the models in the same container image:

```sh
python3 reddit-resolver/run-probe.py https://www.reddit.com/r/videos/comments/6rrwyj/ --country de
```

Tests: `node --test test/*.test.mjs` in this directory. They cover the browser
URL boundary and selecting tiles from classification/detection results;
they do not establish that Reddit will accept the resulting challenge.

Unrecognized challenges are reloaded at most twice, then fail explicitly. A 4x4 task uses whole-image object
localization for supported COCO categories; categories outside that detector
are currently unsupported. Requests and solving rounds are bounded. Reddit
403/429 responses are errors, not successful resolutions.

On 2026-11-15 one unattended live probe passed reCAPTCHA, received HTTP 200
and matched post `6rrwyj`, with an unchanged exit IP before/after. Other probes
were rejected, expired, or received Reddit 429: this is not a reliability claim.
Before this can become a feature, checks must establish reliable `over_18`
verification for the post and its crosspost source, and video/audio retrieval
through the existing downloader. No feature announcement or deployment should
imply these are already done.
