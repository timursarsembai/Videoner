**Reddit resolver: memory changes and pre-release checks, 17 November 2026**

Branch `codex/reddit-memory`, based on main `37eeda2`. No production deployment
or changes to compose limits, secrets, cookies, bot/server/web. The exported
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
