# Validate Gemini Runtime

Purpose: prove Gemini can be called from the local A37 runtime. This validates provider reachability only, not replay or failover quality.

## Exact Commands

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
test -n "${GEMINI_API_KEY:-}" && echo "GEMINI_API_KEY=set" || echo "GEMINI_API_KEY=missing"
```

```bash
curl -sS "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Return exactly: gemini-runtime-ok"}]}]}' \
  | tee reports/a37-shadow-replay-readiness/runtime-validation/gemini-runtime-response.json \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d); const text=JSON.stringify(j); console.log(text.includes('gemini-runtime-ok') ? 'gemini=validated' : 'gemini=not-validated');})"
```

## Expected Outputs

```text
GEMINI_API_KEY=set
gemini=validated
```

## Traces / Logs To Capture

- UTC timestamp.
- Redacted env presence line.
- Full JSON response file.
- Model name/endpoint used.
- Latency from shell timing if measured.

## What Counts As Validated

Gemini is validated only if the command returns a real response containing `gemini-runtime-ok`.

## What Remains Unproven

- OpenAI-to-Gemini failover inside `_shared/aiProvider.ts`.
- Placement grader accuracy.
- Replay determinism.
- Production quota stability.

## Troubleshooting

- `GEMINI_API_KEY=missing`: export the key in the current shell.
- `PERMISSION_DENIED`: enable the API or relax key restrictions.
- `RESOURCE_EXHAUSTED`: quota/rate limit.
- `404`: model endpoint changed or model unavailable to project.
