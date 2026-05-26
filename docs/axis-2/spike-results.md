# Bar #2 Option B F0 Spike

## Method

- Input fixtures: MP3 files in `public/audio/tones/`.
- Decode path: `ffmpeg` converts each fixture to mono 16 kHz 16-bit PCM WAV in a temp file.
- F0 estimator: Web Audio-compatible normalized autocorrelation on 40 ms frames with 10 ms hop, 75-500 Hz search range, and correlation threshold `0.45`.
- Silence handling: dynamic RMS gate per fixture; only voiced frames enter the contour.
- Contour comparison: each voiced contour is median-smoothed, resampled to 12 points, normalized around its own median F0 in semitones, then averaged per tone.
- Distance matrix: root-mean-square distance between tone-level normalized contour vectors, in semitone units.

This is a local spike, not production code. Absolute F0 depends on the fixture voice; the decision uses normalized contour shape and relative tone separability.

## Fixtures Analyzed

| fixture | tone | duration_ms | voiced_frames | median_f0_hz | slope_st | range_st | f0_contour_hz_12pt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ba | ngang | 1608 | 30 | 133.3 | -1.04 | 2.36 | [147.8, 130.8, 136.4, 135.6, 133.3, 133.3, 133.3, 133.3, 129.0, 129.0, 132.2, 129.7] |
| bà | huyen | 1584 | 29 | 118.5 | -3.75 | 6.68 | [159.0, 129.0, 126.0, 125.4, 122.0, 119.6, 118.3, 116.8, 116.8, 116.8, 108.1, 108.5] |
| bán | sac | 1656 | 35 | 149.5 | +7.23 | 8.66 | [156.2, 132.2, 131.1, 133.6, 137.6, 140.9, 147.7, 167.7, 188.7, 207.3, 216.2, 213.4] |
| bạn | nang | 1704 | 37 | 108.8 | -3.24 | 7.25 | [156.1, 126.4, 116.3, 110.5, 107.3, 105.3, 103.7, 103.2, 102.7, 106.6, 111.5, 112.7] |
| cà | huyen | 1536 | 23 | 121.2 | -4.83 | 10.71 | [185.1, 131.1, 130.1, 126.0, 124.0, 121.2, 121.2, 121.2, 121.2, 119.4, 118.5, 99.7] |
| cá | sac | 1584 | 25 | 140.4 | +3.33 | 4.04 | [137.6, 129.9, 129.0, 130.1, 132.7, 135.5, 144.3, 154.3, 156.7, 161.6, 163.0, 156.2] |
| có | sac | 1608 | 29 | 144.1 | +6.79 | 8.25 | [144.2, 136.5, 129.0, 129.0, 130.3, 135.0, 146.4, 160.8, 178.0, 192.2, 206.3, 207.8] |
| cọ | nang | 1584 | 27 | 114.3 | -1.14 | 4.08 | [135.2, 124.2, 118.4, 113.3, 108.9, 106.8, 107.5, 110.0, 111.8, 116.2, 119.1, 118.5] |
| la | ngang | 1608 | 32 | 131.1 | +0.60 | 4.71 | [105.5, 129.0, 132.2, 138.5, 136.8, 135.5, 132.3, 131.1, 131.1, 127.6, 127.0, 125.0] |
| lá | sac | 1656 | 35 | 130.1 | +2.21 | 10.35 | [137.4, 123.2, 127.4, 130.1, 126.6, 128.9, 133.4, 139.0, 152.7, 96.6, 175.7, 168.5] |
| ma | ngang | 1608 | 31 | 134.5 | -0.92 | 2.26 | [148.9, 134.1, 136.7, 136.8, 136.8, 135.6, 135.2, 134.5, 132.4, 130.7, 132.8, 134.5] |
| mà | huyen | 1608 | 31 | 124.0 | -1.83 | 2.79 | [126.9, 131.1, 130.1, 130.1, 128.1, 125.4, 123.7, 121.2, 120.5, 120.3, 117.4, 111.6] |
| má | sac | 1632 | 33 | 133.3 | +3.79 | 5.40 | [121.8, 133.3, 132.2, 131.4, 130.1, 130.7, 134.4, 140.5, 150.3, 160.9, 166.4, 154.9] |
| mã | nga | 1680 | 39 | 119.4 | -0.65 | 6.45 | [155.9, 126.1, 121.6, 117.9, 113.6, 110.5, 107.4, 109.7, 116.5, 128.2, 131.1, 129.2] |
| mạ | nang | 1632 | 34 | 114.3 | -3.19 | 4.96 | [137.8, 128.0, 126.0, 122.1, 117.6, 115.1, 111.9, 110.3, 111.9, 114.3, 108.1, 103.4] |
| mả | hoi | 1728 | 43 | 120.3 | +7.21 | 10.10 | [103.9, 125.2, 120.6, 116.0, 112.5, 107.4, 108.8, 113.8, 129.1, 159.5, 184.7, 186.1] |
| tôi | ngang | 1560 | 25 | 128.0 | -2.00 | 4.06 | [124.9, 148.9, 131.8, 130.6, 129.3, 128.0, 128.0, 127.7, 126.5, 123.2, 117.8, 120.4] |
| tối | sac | 1584 | 29 | 130.1 | -0.30 | 3.78 | [155.5, 128.0, 126.9, 125.0, 125.2, 128.8, 129.6, 134.0, 138.4, 139.1, 131.9, 132.3] |

## Tone Contour Summaries

| tone | fixtures | median_f0_hz | mean_slope_st | mean_range_st | mean_normalized_contour_st |
| --- | --- | --- | --- | --- | --- |
| hoi | mả | 120.3 | +7.21 | 10.10 | [-2.54, 0.69, 0.05, -0.63, -1.17, -1.97, -1.74, -0.96, 1.22, 4.88, 7.42, 7.56] |
| huyen | bà, cà, mà | 121.2 | -3.47 | 6.73 | [4.27, 1.27, 1.03, 0.82, 0.49, 0.11, -0.03, -0.22, -0.25, -0.35, -0.98, -2.25] |
| nang | bạn, cọ, mạ | 114.3 | -2.52 | 5.43 | [4.13, 2.0, 1.15, 0.42, -0.19, -0.54, -0.76, -0.73, -0.59, -0.03, 0.05, -0.17] |
| nga | mã | 119.4 | -0.65 | 6.45 | [4.62, 0.94, 0.31, -0.22, -0.86, -1.34, -1.84, -1.46, -0.43, 1.23, 1.62, 1.37] |
| ngang | ba, la, ma, tôi | 132.2 | -0.84 | 3.35 | [-0.16, 0.49, 0.33, 0.47, 0.3, 0.18, 0.06, -0.01, -0.26, -0.55, -0.59, -0.59] |
| sac | bán, cá, có, lá, má, tối | 136.8 | +3.84 | 6.75 | [0.48, -0.94, -1.1, -1.02, -0.95, -0.58, 0.17, 1.35, 2.58, 2.06, 4.07, 3.62] |

## Pairwise Distance Matrix

| tone | hoi | huyen | nang | nga | ngang | sac |
| --- | --- | --- | --- | --- | --- | --- |
| hoi | 0.0 | 4.62 | 4.02 | 3.42 | 3.87 | 2.25 |
| huyen | 4.62 | 0.0 | 0.82 | 1.66 | 1.41 | 2.97 |
| nang | 4.02 | 0.82 | 0.0 | 0.99 | 1.42 | 2.58 |
| nga | 3.42 | 1.66 | 0.99 | 0.0 | 1.93 | 2.17 |
| ngang | 3.87 | 1.41 | 1.42 | 1.93 | 0.0 | 2.33 |
| sac | 2.25 | 2.97 | 2.58 | 2.17 | 2.33 | 0.0 |

## Empirical Findings

- Four-tone separation (`ngang`, `huyen`, `sac`, `nang`): minimum pairwise distance = `0.82` semitone RMS.
- `ngã` / `nặng` reachability: distance = `0.99` semitone RMS.
- `hỏi` / `ngã` separation: distance = `3.42` semitone RMS.
- `ngã` has only one fixture (`mã`), and `hỏi` has only one fixture (`mả`), so those conclusions are low-confidence.
- The fixture set is TTS-like and clean; this does not prove learner microphone scoring will be stable.

## Pass/Fail Conclusion

- Four tones separate cleanly enough for a prototype: **FAIL**.
- `ngã`/`nặng` are reachable from the fixture contours: **PASS**.
- Option B viable as designed: **NO**, for fixture-based listen/compare or guided prototype scoring only.

## Recommendation for Bar #2 Option B

Option B needs redesign before PR-b. The current fixtures do not provide enough contour separation for the proposed scoring approach.
