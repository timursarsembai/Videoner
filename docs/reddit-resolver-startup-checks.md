**Active investigation: Reddit startup and CPU — 23 November 2026**

Production was not modified by these experiments. One temporary fresh resolver
used the deployed image, the same 1900 MiB RAM / 3800 MiB RAM+swap / one CPU /
200 PID limits and a separate anonymous proxy session. Proxy configuration was
passed through stdin, never argv or logs. It resolved the recent failed post in
101 seconds through four visible challenge rounds. The bicycle task was retried
and then reloaded. Cold split-grid took 9.875 seconds, first classification
8.442 seconds, later splits/classifications were below one second. This is
not proof that import costs alone explain those cold wall-clock durations.
The container was stopped and removed; no video or Telegram messages were sent.

Branch change: inference-worker now imports tile-model directly for split-grid
and classification, and imports vision/Transformers only for detection or audio.
Classification previously called vision.classifyTiles, a direct wrapper around
the same tile function. Models, thresholds, preprocessing, thread settings,
resource limits and retry policy in the project are unchanged by this patch.
Image dimensions are checked before importing model dependencies.

45 existing tests pass. A real-model offline regression used a fixed synthetic
96×96 RGB grid, split into nine images. Old/new classifier output digests were
identical. In one cached-files run, split+classification was 1503 ms before and
1055 ms after; this is a small microbenchmark gain, not an end-to-end claim.
Removing Transformers inside a disposable container made the old worker fail,
while the new worker still split/classified correctly. Detection then failed as
expected without its required Transformers dependency. The helper is
`bench/tile-worker.mjs`, with `test/fixtures/solid-grid.png`.

Separate CPU experiments used the old deployed worker, a headed blank Chromium
page and a fixed 400×400 synthetic image, offline. Each mode had the same RAM
and swap limits. A first screenshot scenario failed under the default test user;
the successful CPU comparison ran as root only in disposable containers.

| CPU quota / detector intra-op threads | First detector, seconds | Warm detector, seconds | Peak cgroup MiB |
|---|---:|---:|---:|
| 1 / 1 | 52.4 | 21.4 | 1654 |
| 2 / 1 | 41.4 | 20.1 | 1672 |
| 2 / 2 | 28.8 | 18.5 | 1588 |

No swap was used in these runs. CPU=2/thread=2 was an ephemeral vision.mjs mount,
not a repository or production setting. These are sequential single runs,
not a statistically controlled benchmark or an accuracy evaluation. Google
challenges vary, so timings from different fresh live sessions are not an A/B
comparison. Raising CPU alone did not substantially improve the warm detector.

Next work can proceed without waiting for a customer failure: use representative
labeled grid images to check detector outputs with multiple threads, repeat
latency/memory measurements, and evaluate whether the CPU cost is justified.
A production CPU/thread change needs separate owner approval. The small lazy
import patch is independently reviewable and remains undeployed in this branch.
The next real failure trace will still be needed to identify the historical
CHALLENGE_TIMEOUT's precise phase; neither successful probe proves that it is fixed.
