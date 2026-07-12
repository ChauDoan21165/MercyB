# Vietnamese-L1 Detector Benchmark v1

Generated: 2026-07-12T09:33:51.495Z

Status: fixture-smoke-run; public-corpus run pending licensed local data

## Method

This report was produced by scripts/benchmark/run-vi-en-detector-benchmark.ts. It imports the shipped detectL1Error detector surface and does not inline detector logic. The annotated track measures precision/recall against mappable gold tags. The VN-L1 proxy track measures detector fire-rate against a native/reference comparison set and is not an accuracy score.

Seed: 20260712

Limit per track: 5000

## Corpus Choices And Licenses

- Annotated track: CLC FCE Dataset, optionally paired with UD English-ESL/TLE annotations. FCE contains learner scripts, error annotation, and first-language metadata under a non-commercial research/education license that excludes product/service use and requires citation. UD English-ESL annotations are CC BY-SA 4.0 but omit the underlying FCE text.
- VN-L1 proxy track: ICNALE Written Essays Plus, selected because WEP includes Vietnam-region learner essays and ICNALE includes native-speaker reference data. ICNALE downloads require registration/password and prohibit reproducing or redistributing data.
- Skipped in v1: Lang-8 because the public release does not provide a clean Vietnamese-L1 English subset for this harness; BEA W&I+LOCNESS because FCE/UD is the clearer first annotated path.

## Annotated Track

Sample size: 4

Corpus counts: {"fixture-fce":4}

| Detector tag | Gold support | Precision | Recall | TP | FP | FN |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| vi_l1_3rd_person_s | 1 | 1.0000 | 1.0000 | 1 | 0 | 0 |
| vi_l1_plural_s | 1 | 1.0000 | 1.0000 | 1 | 0 | 0 |
| vi_l1_preposition_transfer | 1 | n/a | 0.0000 | 0 | 0 | 1 |

Unmappable gold codes:

- OTHER:LEXICAL: 1

## VN-L1 Proxy Track

Sample size: 4

Corpus counts: {"fixture-icnale-wep":4}

| Group | Samples | Detector fires | Fire-rate | Tags |
| --- | ---: | ---: | ---: | --- |
| native_reference | 2 | 0 | 0.0000 | none |
| vn_l1 | 2 | 2 | 1.0000 | vi_l1_3rd_person_s=1, vi_l1_plural_s=1 |

## Limitations

- The numbers above are fixture smoke data, not public-corpus evidence.
- The committed snapshot is a fixture smoke run unless the owner reruns the harness with licensed local FCE and ICNALE exports.
- FCE error annotations are not Vietnamese-L1-specific; only mappable error classes are scored, and unmappable classes remain explicit.
- ICNALE/WEP proxy results are a false-positive/fire-rate proxy over learner and native/reference texts, not an accuracy measurement.
- Corpus text is intentionally excluded from git because the source licenses restrict redistribution.

## Publishability Read

Not publishable as an accuracy claim yet. It is publishable only as a methods draft until the owner supplies licensed local FCE and ICNALE exports and reruns the harness.
