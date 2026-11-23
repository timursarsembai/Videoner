**Reddit resolver diagnostics — release 23 November 2026**

Owner authorized deployment of diagnostic commit `d60fe28`. The commit was
fast-forwarded into main and pushed; only reddit-resolver was replaced.
Models, selection rules, age checks, retry policy and configured deadlines are
unchanged. The new bounded trace records stage transitions, operation durations,
Google checkbox state and post readiness booleans, with cgroup resource deltas.
It excludes URLs, HTML, titles, proxy credentials, cookies, scores and images.

Pre-release validation: 45 tests passed; the final separate test image passed
HTTP health/invalid-input checks, log filtering, source hash comparison and clean
shutdown. No Reddit/proxy requests were made in those offline checks.

The original deploy.sh invocation stalled at `docker system df` before writing
any log output or changing containers. Only its own deployment process group
was stopped. The release then used the equivalent steps from the main checkout:
fetch_secrets prod .env through scripts/lib-secrets.sh; bounded-builder
`docker compose ... build reddit-resolver`; active-extractor check;
`docker compose ... up -d --no-deps reddit-resolver`.
The repository deployment script was not changed and no global cache cleanup
was forced. Minimum MemAvailable: build 10840 MiB, replacement 10792 MiB.
The wrapper verified server/bot/web IDs and resolver RAM/swap limits unchanged.

Rollback files and closed local logs:
`/home/aksak/backups/videoner/reddit-diagnostics-20261123T215731Z/`.
The old image is tagged there in containers-before.json; rollback.sh recreates
only the resolver. New image:
`sha256:896f26060cdbe8f19a0d0d11de2f2af4c588c23d90d9e8b8d26ea60349769c1d`.

One controlled metadata request used the latest Reddit URL recorded as
SERVER_BLOCKED. It went directly from the API container to the private resolver;
no video files were downloaded and no Telegram messages were sent.
At 22:10:43 UTC it returned HTTP 200, ok=true, kind=video after 153992 ms.
The post snapshot matched the requested post and had its post-type attribute.

Observed stages: five visible challenges, four classification operations,
one object-detection operation, one rejected/reloaded challenge, then the post.
The 4×4 buses detection took 49192 ms. This includes inference-child/model work,
not just the model's native run. The request's cgroup CPU usage counter increased
by ~92.8 seconds and throttled time by ~38.6 seconds. The latter is a cumulative
scheduler counter, not an additive explanation of wall-clock delay.
Memory max events increased by 570; OOM/oom_kill remained zero and swap stayed
zero during this request. Max events count attempts/pressure at the cgroup limit,
not failed requests or OOM kills. The resolver remained healthy with zero restarts.

This successful request does not determine the cause of earlier timeouts.
The previous last successful download was 16:18:46 UTC; the old log subsequently
contained two CHALLENGE_TIMEOUT, one POST_MISMATCH and two BUSY errors. The old
server did not retain per-request stages. In the current implementation the
200-second budget is checked between asynchronous operations, so awaited browser
operations can take wall time past that budget. No timeout extension was applied.

Next: inspect the next failed request's trace before changing challenge logic.
Use counts/lastStage/anchorChecked/readiness flags to distinguish widget loading,
model processing, verification and post rendering. Evaluate 4×4 inference cost
and resource pressure using representative inputs; do not infer a model defect,
a bad proxy or a Google-format change from this single success. Any further
production changes require separate owner approval.
