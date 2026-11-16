# Experimental Reddit browser resolver

An experimental browser resolver integrated with the API's Reddit yt-dlp plugin
on the `codex/reddit-server` branch. **Not deployed.**
It performs automatic reCAPTCHA image selection on a local CPU using a dedicated
tile classifier and YOLOS ONNX models. Optional audio recognition (`--audio`) uses local Whisper;
Google denied the audio challenge in the initial live test. No account
cookies or external inference/captcha service.
Only anonymous browser session data lives in the temporary browser context.

The model revisions and npm dependencies are pinned. The Dockerfile downloads
Chromium and warms the models during the build; runtime model downloads are
disabled. Model files never belong in Git. The diagnostic runner uses the existing local
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
URL boundary, selecting tiles, post parsing, age gates and source verification;
they do not establish that Reddit will accept the resulting challenge.

Unrecognized challenges are reloaded at most twice, then fail explicitly. A 4x4 task uses whole-image object
localization for supported COCO categories; categories outside that detector
are currently unsupported. Requests and solving rounds are bounded. Reddit
403/429 responses are errors, not successful resolutions.

On 2026-11-15 one unattended live probe passed reCAPTCHA, received HTTP 200
and matched post `6rrwyj`, with an unchanged exit IP before/after. Other probes
were rejected, expired, or received Reddit 429: this is not a reliability claim.
The HTTP resolver subsequently returned that post's metadata. Its media was
downloaded directly from Reddit CDN and merged into H.264/AAC MP4; a video-only
variant also downloaded successfully. Live photo, crosspost and adult-content
coverage remains incomplete; fixture tests alone do not establish reliability.

The resolver rejects explicit mature-content gates and marked posts. It follows
crosspost sources and requires an independently checked source; an unresolved
post or source fails closed. The API plugin requires `age_verified: true` and
`over_18: false`. No account login or age-gate acceptance is performed.

Compose exposes no resolver port and caps it at 1900 MiB, one CPU and 200 PIDs.
The API has **no startup dependency** on this service. An unavailable resolver
fails the Reddit request, while the API continues serving other requests.
To verify this with an already built API image and a disposable PostgreSQL:

```sh
docker build --memory=2g -t videoner-reddit-api-check ./server
python3 scripts/check-reddit-isolation.py videoner-reddit-api-check
```

Run these commands from the feature worktree. The check creates an internal
Docker network, uses test credentials only, and removes its containers afterward.
It does not deploy or access the production database, cookies or proxy.
