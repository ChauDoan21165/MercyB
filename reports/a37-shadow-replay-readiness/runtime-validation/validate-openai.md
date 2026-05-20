# Validate OpenAI Runtime

Purpose: prove OpenAI can be called from the local A37 runtime. This validates provider reachability only, not shadow replay.

## Exact Commands

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
test -n "${OPENAI_API_KEY:-}" && echo "OPENAI_API_KEY=set" || echo "OPENAI_API_KEY=missing"
```

```bash
curl -sS https://api.openai.com/v1/responses \
  -H "Authorization: Bearer ${OPENAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4.1-mini","input":"Return exactly: openai-runtime-ok"}' \
  | tee reports/a37-shadow-replay-readiness/runtime-validation/openai-runtime-response.json \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d); const text=JSON.stringify(j); console.log(text.includes('openai-runtime-ok') ? 'openai=validated' : 'openai=not-validated');})"
```

## Expected Outputs

```text
OPENAI_API_KEY=set
openai=validated
```

## Traces / Logs To Capture

- UTC timestamp.
- Redacted env presence line.
- Full JSON response file.
- Model name returned by provider.
- Latency from shell timing if measured.

## What Counts As Validated

OpenAI is validated only if the command returns a real response containing `openai-runtime-ok`.

## What Remains Unproven

- Placement grader prompt quality.
- Shadow replay determinism.
- Supabase edge function connectivity.
- Token accounting in the Placement V3 session path.

## Troubleshooting

- `OPENAI_API_KEY=missing`: export the key in the current shell.
- `401`: rotate or correct the key.
- `model_not_found`: change to the model configured in `_shared/aiProvider.ts`.
- `429`: wait, increase quota, or use another authorized project.
