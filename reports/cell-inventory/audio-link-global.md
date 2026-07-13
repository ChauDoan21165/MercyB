# WP-AUDIO-LINK-1 Global Audio Link

## Verdict

Scheme A legacy-root ingest and scheme B structured lesson-unit ingest are complete. Scheme B is intentionally linked to lesson JSON units, not CELL rows, per amendment 7. HEAD verification was run against the public `room-audio` bucket and the unresolvable audio gaps are preserved in the JSON artifact.

## Scheme Counts

| Scheme | Linked |
| --- | ---: |
| A_legacy_root | 297 |
| B_structured_lesson_unit | 25103 |

## Linked Vs Verified By Language And Level

| Language | Level | Linked | Verified | Unverified |
| --- | --- | ---: | ---: | ---: |
| legacy-root | legacy-root | 297 | 296 | 1 |
| fr | A1 | 310 | 310 | 0 |
| fr | A2 | 190 | 190 | 0 |
| fr | B1 | 285 | 285 | 0 |
| fr | B2 | 1713 | 1713 | 0 |
| fr | C1 | 1148 | 1148 | 0 |
| fr | C2 | 557 | 557 | 0 |
| de | A1 | 310 | 310 | 0 |
| de | A2 | 190 | 190 | 0 |
| de | B1 | 285 | 285 | 0 |
| de | B2 | 1764 | 1764 | 0 |
| de | C1 | 990 | 989 | 1 |
| de | C2 | 554 | 554 | 0 |
| ja | A1 | 111 | 111 | 0 |
| ja | A2 | 223 | 223 | 0 |
| ja | B1 | 285 | 285 | 0 |
| ja | B2 | 1784 | 1784 | 0 |
| ja | C1 | 1075 | 1074 | 1 |
| ja | C2 | 538 | 538 | 0 |
| ko | A1 | 240 | 240 | 0 |
| ko | A2 | 285 | 285 | 0 |
| ko | B1 | 285 | 285 | 0 |
| ko | B2 | 1728 | 1728 | 0 |
| ko | C1 | 1235 | 1234 | 1 |
| ko | C2 | 590 | 560 | 30 |
| zh | A1 | 285 | 285 | 0 |
| zh | A2 | 285 | 285 | 0 |
| zh | B1 | 285 | 285 | 0 |
| zh | B2 | 1629 | 1629 | 0 |
| zh | C1 | 965 | 965 | 0 |
| zh | C2 | 505 | 505 | 0 |
| es | A1 | 191 | 191 | 0 |
| es | A2 | 253 | 253 | 0 |
| es | B1 | 340 | 340 | 0 |
| es | B2 | 299 | 299 | 0 |
| es | C1 | 316 | 316 | 0 |
| es | C2 | 269 | 269 | 0 |
| vi | A1 | 627 | 626 | 1 |
| vi | A2 | 200 | 200 | 0 |
| vi | B1 | 1169 | 1169 | 0 |
| vi | B2 | 246 | 246 | 0 |
| vi | C1 | 311 | 311 | 0 |
| vi | C2 | 253 | 253 | 0 |

## Step 6 Unresolvable Audio Gaps By Language

| Language | Gaps |
| --- | ---: |
| legacy-root | 1 |
| de | 1 |
| ja | 1 |
| ko | 31 |
| vi | 1 |

## Check-K Rescope

Check-K remains cell-scoped. It may consume committed `audio-map-*.json` artifacts keyed by canonical cell UUIDs, but it must not count scheme B lesson-unit links as cell-level checked-in reference audio. The baseline definition was updated to make that distinction explicit.
