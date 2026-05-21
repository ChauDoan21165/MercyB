# Replay Readiness Matrix

Date: 2026-05-20

| Subsystem | Currently blocked? | Setup complete? | Runtime verified? | Privacy reviewed? | Production-safe? | Owner | Next action |
|---|---:|---:|---:|---:|---:|---|---|
| Placement V3 merged codebase | No | Yes | Local only | Partial | No | A37/Chau | Keep #942 baseline; run credentialed smoke next |
| OpenAI provider | Yes | No | No | N/A | No | Chau | Complete `provider-setup/openai-setup.md` and `runtime-validation/validate-openai.md` |
| Gemini provider | Yes | No | No | N/A | No | Chau | Complete `provider-setup/gemini-setup.md` and `runtime-validation/validate-gemini.md` |
| Azure Speech | Yes | No | No | N/A | No | Chau | Complete `provider-setup/azure-speech-setup.md` and `runtime-validation/validate-azure-speech.md` |
| Supabase runtime | Yes | No | No | Partial | No | Chau | Complete `provider-setup/supabase-setup.md` and `runtime-validation/validate-supabase.md` |
| Shadow capture schema | Yes | No | No | No | No | Future A37 | Design migration/RLS after privacy approval |
| Shadow capture middleware | Yes | No | No | No | No | Future A37 | Implement only after schema and kill switch exist |
| Replay engine | Yes | No | No | Partial | No | Future A37 | Build after real capture artifacts exist |
| Sanitization audit | Yes | No | No | Partial | No | Future A37 | Implement before exporting any replay data |
| Operator dashboard | Yes | No | No | No | No | Future A37 | Build after persisted replay diffs exist |
| Local simulation | Partially | No | No | Partial | No | Future A37 | Use `local-simulation-guide.md`; label as simulation only |
| Production rollout | Yes | No | No | No | No | Chau/A37 | Use `production-rollout-gates.md` before enabling |
