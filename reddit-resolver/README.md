# Experimental Reddit browser resolver

An experimental browser resolver integrated with the API's Reddit yt-dlp plugin
developed on the `codex/reddit-server` branch. **Deployed to production on 2026-11-16.**
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
variant also downloaded successfully. On 2026-11-16 live checks resolved photo
`1ublsxv`, resolved crosspost `ze20j2` after independently checking its source
`x7xpyo`, and rejected the explicit adult-content gate at `degtjo`.
These selected checks do not establish general captcha reliability.

Recovery behavior:

- A deleted/private/missing post does not close a healthy anonymous browser
  session or trigger the service-wide network cooldown.
- Post-specific refusals are cached for 60 seconds (at most 100 entries).
  Temporary network/challenge errors are never cached as post refusals.
- Verified crosspost sources share the bounded metadata cache. A crosspost
  inherits its source's expiry; wrapping a cached source does not extend the
  lifetime of its age verification.
- Recognizing a category name is not sufficient to answer a challenge: the
  active classifier/detector must support it. Unsupported tasks are refreshed
  within the existing bounds instead of submitting an empty selection.
- An absent widget on the explicit humanity-check page fails after 20 seconds,
  leaving time for a fresh proxy session. Failed image loading and rejected or
  unsupported challenges also permit one retry, provided at least 60 seconds
  remain in the original 200-second request budget. A second failure stops.

These changes address specific failure modes; they do not guarantee that a
fresh Reddit session will pass its captcha. Captcha timeouts still occur in
live checks, and successful cache hits must not be counted as fresh-session
successes when measuring availability.

A subsequent live run with recovery enabled on 2026-11-16 resolved crosspost
`ze20j2` in 183.4 seconds and returned its cached source `x7xpyo` in 0.5 seconds.
The adult gate was rejected in 14.7 seconds (repeat refusal: 0.6 seconds), after
which photo `1ublsxv` still resolved in the same session in 7.1 seconds (repeat
metadata: 0.3 seconds). This checks reuse and isolation of post refusals, not a
statistically measured improvement in fresh-session captcha acceptance.

Production release checks on 2026-11-16 passed: public website job creation
returned 202 in 179 ms; polling through Cloudflare returned short responses;
the video download completed with H.264 video and AAC audio, and the public file
returned HTTP 206 for a 4096-byte range. The adult-gate job returned the adult
refusal after 181 seconds without holding an HTTP request open. `/ru/reddit`
returned 200; the held article returned 404 and was absent from the channel feed.
The bot container was recreated and passed its startup check. An isolated test
also confirmed that the released API starts and stays available without Reddit.
These checks do not establish a general fresh-session captcha success rate.

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

The website requests metadata with `Prefer: respond-async`: `POST /info`
returns HTTP 202 and an opaque job ID, then `GET /info/jobs/:id` returns status
or the normalized result/error. Each browser/proxy request has a 20-second
timeout; extraction continues in the API process across polling requests.
Creation keeps the existing Turnstile and URL checks. Jobs are API-key scoped,
bounded, expire, and status replies use `Cache-Control: no-store`.
The bot keeps its existing synchronous 240-second wait.
The site sends an HMAC-derived visitor scope (no raw IP in that header): pending
jobs are limited to two per visitor and eight overall. Polling has its own
60/minute visitor bucket, preserves authentication and API-key rate limits, and
does not consume the shared heavy-request IP bucket. After the first 30 seconds
the client polls every six seconds instead of three.

Model downloads use a persistent BuildKit cache mount, copied into the final
image during build. Runtime stays offline; ordinary resolver edits no longer
invalidate model warmup. The release article is held outside the web build at
`docs/drafts/reddit-bot-site/` pending owner review of production results.

Reddit media uses the server's direct connection first. CDN HTTP 403/429 enables
the existing ISP pool (`YOUTUBE_PROXY_URLS`, falling back to `YOUTUBE_PROXY_URL`)
for that download only; later downloads start direct again. Failed ISP addresses
can be rotated. Video/audio retries keep verified metadata and resume files.
DASH/HLS manifests and single photos also try ISP after direct blocking or a
network failure; a missing file (404) does not trigger ISP traffic. Residential
`REDDIT_PROXY_URL` remains exclusive to browser/post resolution and is never
selected for media. CDN fallback does not bypass the age checks.

The admin dashboard includes a Reddit summary (bot and website only), a daily
chart and a Reddit-filtered error log. Completed/expired downloads, file failures,
metadata failures, pending requests and adult-content refusals are separate.
The displayed success percentage covers terminal file downloads only; it is
not an end-to-end availability estimate. File volume includes cache deliveries
and does not measure proxy consumption. The article remains a draft.

Memory lifecycle (released 2026-11-17):

- HTTP/browser modules do not import ONNX, Transformers.js or Sharp. These run
  in one lazily started child process; its environment excludes proxy credentials.
- Classification, grid splitting, detection and optional audio use bounded IPC.
  A model operation shares the original post deadline. Crashes and timeouts
  reject waiting operations; a subsequent request can start a fresh child.
- The inference child stops after 120 seconds idle, only when no post or operation
  is active. The browser retains its separate five-minute idle timeout, and
  verified metadata keeps its original cache/age expiry. A cache hit starts no
  inference. Shutdown terminates both browser and inference.
- CPU memory arenas are disabled for direct ORT and Transformers sessions;
  classification tensors are disposed after copying scores. Models still load
  from the offline image cache. Resolution, model revisions and thresholds are
  unchanged. A local inference failure does not rotate the residential session.
- Runtime RAM/CPU/PID limits and swap settings are unchanged. The combined browser
  and detector benchmark approaches 1900 MiB: disabling production swap needs
  more peak measurements and is intentionally deferred.

Reproduce tests and offline memory checks from the repository root, using a
separate local test image (this does not deploy production):

```sh
docker buildx build --builder videoner-release-bounded --load \
  -t videoner-reddit-resolver-memory-check:20261117 ./reddit-resolver
docker run --rm --network none --memory=768m --memory-swap=768m --cpus=1 \
  -v "$PWD/reddit-resolver/test:/app/test:ro" \
  --entrypoint sh videoner-reddit-resolver-memory-check:20261117 \
  -c 'node --test test/*.test.mjs'
docker run --rm --network none --memory=1900m --memory-swap=1900m --cpus=1 \
  -v "$PWD/reddit-resolver/bench:/app/bench:ro" \
  --entrypoint node videoner-reddit-resolver-memory-check:20261117 \
  /app/bench/worker-memory.mjs
```

`bench/model-memory.mjs` compares `BENCH_ARENA=1/0` and optionally
`BENCH_PATTERN=0`, using `BENCH_STEPS` repetitions (default 20). Run these
sequentially with the same 1900 MiB limits; the historical arena-enabled repeated
case exited 137 at that limit. The worker benchmark uses a local synthetic page,
real Chromium and model inference, with an accelerated test-only idle timeout;
its default is 20 restart cycles. It does not contact Reddit or use any proxy.
Set `BENCH_CYCLES=1 BENCH_SKIP_DETECT=1` for a short idle-memory-only check.
