# Vietnamese-L1 Detector Benchmark v1

Generated: 2026-07-12T11:21:04.875Z

Status: public-corpus-derived metrics

## Method

This report was produced by scripts/benchmark/run-vi-en-detector-benchmark.ts. It imports the shipped detectL1Error detector surface and does not inline detector logic. The annotated track measures precision/recall against mappable gold tags. The VN-L1 proxy track measures detector fire-rate against a reference/baseline comparison set and is not an accuracy score.

Seed: 20260712

Limit per track: 5000

## Corpus Choices And Licenses

- Annotated track: CLC FCE Dataset, optionally paired with UD English-ESL/TLE annotations. FCE contains learner scripts, error annotation, and first-language metadata under a non-commercial research/education license that excludes product/service use and requires citation. UD English-ESL annotations are CC BY-SA 4.0 but omit the underlying FCE text.
- VN-L1 proxy track: ICNALE Written Essays Plus, selected because WEP includes Vietnam-region learner essays. The local WEP v0.7 package used for v2 does not include the original ICNALE native-speaker Written Essays module, so the comparison group is non-Vietnamese-L1 WEP learner text rather than native reference text. ICNALE downloads require registration/password and prohibit reproducing or redistributing data.
- Skipped in v1: Lang-8 because the public release does not provide a clean Vietnamese-L1 English subset for this harness; BEA W&I+LOCNESS because FCE/UD is the clearer first annotated path.

## Annotated Track

Sample size: 0

Corpus counts: {}

| Detector tag | Gold support | Precision | Recall | TP | FP | FN |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| No public annotated corpus rows were run. | 0 | n/a | n/a | 0 | 0 | 0 |

Unmappable gold codes:

- None in this run.

## v2 ICNALE WEP Proxy Track

Sample size: 5000

Corpus counts: {"icnale-wep":5000}

| Group | Samples | Detector fires | Fire-rate | Tags |
| --- | ---: | ---: | ---: | --- |
| non_vn_l1_baseline | 3402 | 1067 | 0.3136 | vi_l1_topic_comment_fronting=95, vi_l1_tag_polarity=79, vi_l1_missing_article=877, vi_l1_conditional_mix=3, vi_l1_no_article_generic=5, vi_l1_preposition_transfer=7, vi_l1_double_negative=1 |
| vn_l1 | 1598 | 509 | 0.3185 | vi_l1_missing_article=400, vi_l1_tag_polarity=57, vi_l1_topic_comment_fronting=44, vi_l1_preposition_transfer=6, vi_l1_no_article_generic=1, vi_l1_countable=1 |

### Proxy Tag Ratios

| Comparison | Detector tag | VN samples | VN fire-rate | Baseline samples | Baseline fire-rate | VN/baseline ratio |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| vn_l1 vs non_vn_l1_baseline | vi_l1_conditional_mix | 1598 | 0.0000 | 3402 | 0.0009 | 0.0000 |
| vn_l1 vs non_vn_l1_baseline | vi_l1_countable | 1598 | 0.0006 | 3402 | 0.0000 | n/a |
| vn_l1 vs non_vn_l1_baseline | vi_l1_double_negative | 1598 | 0.0000 | 3402 | 0.0003 | 0.0000 |
| vn_l1 vs non_vn_l1_baseline | vi_l1_missing_article | 1598 | 0.2503 | 3402 | 0.2578 | 0.9709 |
| vn_l1 vs non_vn_l1_baseline | vi_l1_no_article_generic | 1598 | 0.0006 | 3402 | 0.0015 | 0.4000 |
| vn_l1 vs non_vn_l1_baseline | vi_l1_preposition_transfer | 1598 | 0.0038 | 3402 | 0.0021 | 1.8095 |
| vn_l1 vs non_vn_l1_baseline | vi_l1_tag_polarity | 1598 | 0.0357 | 3402 | 0.0232 | 1.5388 |
| vn_l1 vs non_vn_l1_baseline | vi_l1_topic_comment_fronting | 1598 | 0.0275 | 3402 | 0.0279 | 0.9857 |

## Limitations

- The numbers above are derived from local licensed corpus exports; raw corpus text is not committed.
- The v2 proxy snapshot uses licensed local ICNALE WEP text only; the raw corpus and prepared JSONL remain outside git.
- FCE error annotations are not Vietnamese-L1-specific; only mappable error classes are scored, and unmappable classes remain explicit.
- ICNALE/WEP proxy results are a false-positive/fire-rate proxy over learner and reference/baseline texts, not an accuracy measurement.
- The v2 WEP package has no native-speaker/reference correction layer, so high baseline fire-rates are evidence of broad detector sensitivity, not Vietnamese-specific precision.
- Corpus text is intentionally excluded from git because the source licenses restrict redistribution.

## Publishability Read

Not publishable as an accuracy claim. This v2 section is publishable only as a proxy/fire-rate methods artifact until the FCE annotated track is run and the ICNALE native/reference module is added or the baseline is renamed explicitly in any public copy.
