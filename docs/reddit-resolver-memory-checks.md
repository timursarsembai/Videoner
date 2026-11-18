**Reddit resolver: memory changes and pre-release checks, 17 November 2026**

Branch `codex/reddit-memory`, based on main `37eeda2`. No production deployment
or changes to compose limits, secrets, cookies, bot/server/web during the
pre-release checks. The exported
`google-captcha-bypass` snapshot is not automatically updated.

Implementation: one lazy inference child, separate from browser/HTTP/cache.
Idle shutdown is 120 seconds with no active post or inference. Browser idle stays
five minutes. Parent imports no native model libraries; lazy model selection,
original age checks, metadata TTL and post budget are preserved. Direct CPU ORT
and Transformers sessions use enableCpuMemArena=false. Classification tensors
are disposed after score copies. Model versions, input resolution and thresholds
are unchanged. IPC has input/output bounds and image pixel limits. Child crashes,
invalid replies and deadline expiration reject pending work, terminate the old
child and allow a later request to recover. Local inference errors do not cause
residential country/session rotation or a network cooldown.

Measurements used disposable containers, the existing image's pinned offline
models, synthetic images, one CPU, 1900 MiB RAM and zero swap. Production was
untouched; no residential traffic was spent. RSS and cgroup memory are distinct:
cgroup values also include reclaimable file cache and other processes.

| Scenario | Result |
|---|---|
| Historical arena enabled, 20 classifier + repeated detector operations | First detector RSS ~1449 MiB; test exited 137 during subsequent work |
| Arena disabled, 20 classifier + 20 detector operations | Passed; cgroup peak 1474363392 bytes (~1406 MiB); detector-end RSS ~255 MiB; swap zero |
| Same process after dispose + 10 seconds | RSS ~160 MiB; native process still alive |
| Arena disabled and memory pattern disabled, two detector operations | Peak ~1382 MiB; no useful reduction; memory-pattern default retained |
| New client + headed Chromium + 20 classify/restart cycles + split-grid/classify/detect | Passed; peak 1932189696 bytes (~1843 MiB); swap zero; classification outputs identical across restarts |
| Same benchmark after inference child exits, browser retained | cgroup current ~444 MiB; parent RSS ~120 MiB |
| Same benchmark after browser closes | cgroup current ~351 MiB; parent RSS ~121 MiB |
| Separate short idle check, 10 seconds after browser closes | parent RSS ~139 MiB; cgroup anon ~110 MiB; total cgroup ~504 MiB including file cache; swap zero |

These tests demonstrate lifecycle and memory behavior, not CAPTCHA success rates.
They do not reproduce every Reddit page/browser working set. One historical
single-detector run took ~20 seconds; the 20-operation arena-disabled detector
series averaged ~27 seconds per operation including its loading stage. These are
not controlled latency comparisons; cold loading and allocator overhead remain
relevant within the existing 200-second post deadline. Disabling memory patterns
showed no compelling peak reduction and was not applied.

Production swap must remain unchanged for this release: the combined synthetic
case has only about 57 MiB headroom below 1900 MiB, below the planned safety
margin. Do not claim production memory is capped at 140 MiB during active work,
raise the agreed RAM limit, or disable swap based on the idle measurement.

Release only after tests, code review, commit/push and fresh owner consent.
Deploy from `/home/aksak/apps/Videoner`, only `reddit-resolver`, with the bounded
builder and >=500 MiB MemAvailable monitor. Save previous image ID; rollback
recreates only the resolver with the previous image. No DB migration is needed.
Verify health, idle worker exit and one adult-safe post after release; observe
RAM+swap, OOM/restarts, request time and Reddit success/failure stages for a day.

Final packaging verification: the separate local image
`videoner-reddit-resolver-memory-check:20261117` built successfully with the
bounded builder (minimum host MemAvailable 4824 MiB). All 38 tests passed inside
that image under its normal `node` user, including 13 new lifecycle/cache/error
checks. An isolated 512 MiB/no-swap container returned health 200 and invalid URL
400, then stopped on SIGTERM with exit 0 and OOMKilled=false. No live Reddit
request or production deployment was performed in this task.


**Production release and recovery verification, 17–18 November 2026**

Owner separately authorized deployment. Commit `d36174e` was fast-forwarded into
main and pushed. `./scripts/deploy.sh reddit-resolver` ran from the main checkout
with builder `videoner-release-bounded`; minimum host MemAvailable was 4770 MiB.
The old image and resolver-only rollback are saved at
`/home/aksak/backups/videoner/reddit-memory-20261117T032206Z/`.
Only the resolver was recreated by this deployment; the wrapper verified unchanged
server/bot/web container IDs at that time and unchanged resolver RAM/swap limits.
Subsequent parallel Claude changes and deployments were preserved.

Production resolver image is
`sha256:397080f781a07c3b36e6dba7aacafe4b28b45e8a28b66b283086cf52f6401710`,
started 2026-11-17 03:25:39 UTC. Verification on 18 November found it healthy,
restart count 0, OOMKilled=false, and cgroup OOM/max events zero. The inference
worker and Chromium were absent in idle snapshots; Node and Xvfb remained.

The diagnostic bot API request begun on 17 November completed the iPad post
`1xxc74w`: DB record at 11:11:11 UTC, source BOT, not from cache, 35 seconds,
854×480, 5 544 213 bytes. A later independent API download on 18 November
04:28:39 UTC also succeeded (220p). Both records have since become EXPIRED
through normal file retention. The daemon interrupted result collection, so
recovery checked DB records instead of repeating the already successful request.
No Telegram messages were sent by this operator check.

At 18 November 09:44 UTC cgroup memory was 69.5 MiB RAM plus 88.1 MiB swap,
with 16.0 MiB anon and 46.4 MiB file cache. Cumulative peaks since resolver start:
956.9 MiB RAM and 100.4 MiB swap. These observations cover a small set of actual
requests and do not supersede the larger synthetic browser/detector peak.
The production settings remain 1900 MiB RAM and 1900 MiB additional allowed swap.

The first monitoring launch was interrupted and did not run. Recovery started
a bounded observer on 18 November 09:44 UTC, ending 19 November 09:44 UTC, with
60-second resource samples and no Reddit/proxy requests. Script, PID, fixed
expiry and `memory-24h.jsonl` are in the same private backup directory. Observer
liveness and its first persisted sample were verified. It is a background
process, not a reboot-persistent system service; if the host reboots, check its
PID before resuming observation. It sends no external notifications.

Next: review these resource samples alongside Download/LinkFailure counts, then
work on peak memory with representative inputs. Production swap remains enabled
until the agreed safety margin is demonstrated. General CAPTCHA reliability is
still not established by this small sample. No further deploy was performed
during daemon recovery.
