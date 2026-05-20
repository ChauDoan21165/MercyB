# Replay Validation Matrix

| Area | Simulated validated? | Local validated? | Live validated? | Production validated? | Evidence source | Blocker |
|---|---:|---:|---:|---:|---|---|
| fixture loading | yes | yes | no | no | `check-replay-fixtures.ts`, replay simulation logs | live env not configured |
| replay execution | yes | yes | no | no | `simulated-runs/`, `determinism-runs/` logs | no Supabase URL/anon key in current shell |
| replay persistence | local-shaped only | partial | no | no | simulated `.local-persistence.json` artifacts | service-role persistence not validated |
| drift generation | yes | yes | no | no | simulated `.drift-diff.json`, stability report tests | no live provider outputs |
| replay dashboard | simulated payload only | yes | no | no | dashboard simulated-state rendering, simulated dashboard payload | no live persisted replay rows |
| replay determinism | yes | yes | no | no | `replayDeterminism.test.ts`, `check-replay-determinism -- --runs 5` | live providers are not deterministic by contract |
| provider metadata | simulated only | partial | no | no | simulated `provider: "none"`, model `local-drift-simulator-v1` | real provider traces unavailable |
| replay rollback | documented | yes | no | no | `replay-rollback-guide.md` | no live incident or persisted bad run yet |
| replay cleanup | documented | yes | no | no | rollback guide quarantine procedure | no live artifacts to clean |
| replay evidence collection | documented | yes | no | no | evidence checklist and `live-replay-evidence/README.md` | no live evidence bundle yet |

Current status: #943 is operationally prepared for first live replay once env vars and Supabase state exist. It is not live validated.
