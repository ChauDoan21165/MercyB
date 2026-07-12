# Vietnamese-L1 Detector Benchmark Harness

This harness measures the shipped Vietnamese-L1 English detector against local corpus exports. It imports the production detector surfaces from `src/lib/feedback`; do not copy detector rules into benchmark code.

## Corpus Choices And Licenses

- Annotated track: CLC FCE Dataset, optionally combined with UD English-ESL/TLE annotations. FCE includes original anonymized exam scripts, error annotation, and first-language demographics. The FCE license allows non-commercial research and educational use, excludes product/service use, and requires citation of Yannakoudakis, Briscoe, and Medlock. UD English-ESL annotations are CC BY-SA 4.0, but the underlying FCE text is not included and must be obtained separately.
- VN-L1 proxy track: ICNALE Written Essays Plus. ICNALE WEP includes Vietnam-region learner essays and the broader ICNALE includes native-speaker reference data. ICNALE requires user registration/password for downloads and prohibits reproducing or redistributing ICNALE data.
- Skipped for v1: Lang-8 because the public corpus is research/education-only and does not provide a clean Vietnamese-L1 English subset for this harness. BEA W&I+LOCNESS is not used in v1 because FCE/UD gives a clearer local path for annotated learner sentences.

Corpus files must stay out of git. Place prepared JSONL under `benchmark-data/`.

## Input Formats

Annotated JSONL:

```json
{"id":"fce-001","corpus":"fce","learner_l1":"vi","source":"She go home.","reference":"She goes home.","gold_error_codes":["M:VERB:SVA"]}
```

The harness accepts `gold_tags` when a row has a manually verified detector-tag mapping. Otherwise it maps a small ERRANT-style subset from `gold_error_codes` and reports unmappable codes explicitly.

Proxy JSONL:

```json
{"id":"icnale-vnm-001","corpus":"icnale-wep","group":"vn_l1","text":"She go home.","reference_text":"She goes home."}
{"id":"icnale-ens-001","corpus":"icnale-we","group":"native_reference","text":"She goes home.","reference_text":"She goes home."}
```

The proxy track reports detector fire-rate only. It is not an accuracy score.

## Rerun

Fixture smoke run:

```sh
npx tsx scripts/benchmark/run-vi-en-detector-benchmark.ts \
  --annotated scripts/benchmark/fixtures/annotated.jsonl \
  --proxy scripts/benchmark/fixtures/proxy.jsonl \
  --out reports/benchmark/vi-en-detector-benchmark-v1.results.json \
  --report reports/benchmark/vi-en-detector-benchmark-v1.md \
  --seed 20260712 \
  --limit 5000
```

Licensed local corpus run:

```sh
npx tsx scripts/benchmark/run-vi-en-detector-benchmark.ts \
  --annotated benchmark-data/fce/annotated.jsonl \
  --proxy benchmark-data/icnale/proxy.jsonl \
  --out reports/benchmark/vi-en-detector-benchmark-v1.results.json \
  --report reports/benchmark/vi-en-detector-benchmark-v1.md \
  --seed 20260712 \
  --limit 5000
```

The deterministic cap is 5,000 rows per track.
