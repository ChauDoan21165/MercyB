# Validate Azure Speech Runtime

Purpose: prove Azure Speech credentials can issue a token. This validates credential reachability only, not pronunciation scoring quality.

## Exact Commands

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
test -n "${AZURE_SPEECH_KEY:-}" && echo "AZURE_SPEECH_KEY=set" || echo "AZURE_SPEECH_KEY=missing"
test -n "${AZURE_SPEECH_REGION:-}" && echo "AZURE_SPEECH_REGION=set" || echo "AZURE_SPEECH_REGION=missing"
```

```bash
curl -sS -X POST "https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken" \
  -H "Ocp-Apim-Subscription-Key: ${AZURE_SPEECH_KEY}" \
  | tee reports/a37-shadow-replay-readiness/runtime-validation/azure-speech-token.txt \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(d.length > 100 ? 'azure-speech=validated' : 'azure-speech=not-validated'))"
```

## Expected Outputs

```text
AZURE_SPEECH_KEY=set
AZURE_SPEECH_REGION=set
azure-speech=validated
```

## Traces / Logs To Capture

- UTC timestamp.
- Redacted env presence lines.
- Token length only; do not paste the token into reports.
- Region used.
- Latency from shell timing if measured.

## What Counts As Validated

Azure Speech is validated only if the token endpoint returns a token-like response and the final line is `azure-speech=validated`.

## What Remains Unproven

- Native/mobile audio capture.
- Audio upload/transcoding.
- Azure phoneme scoring with real placement audio.
- Speaking replay determinism.

## Troubleshooting

- `AZURE_SPEECH_KEY=missing`: export the key.
- `AZURE_SPEECH_REGION=missing`: export the region.
- `401`: invalid key.
- `404`: incorrect region.
- Token file is short or contains JSON error: inspect error without committing token.
