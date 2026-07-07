# AAK Ownership Routing Registry

This file documents the deterministic ownership routing registry in `ownership-routing-registry.json`.

The registry is data-only. The AAK validator loads it read-only, compiles the listed patterns, freezes the loaded registry, and applies rules by ascending `priority`. If no rule matches, the validator uses `default_owner_team`.

| Priority | Rule ID | Pattern | Flags | Owner team | Examples |
| ---: | --- | --- | --- | --- | --- |
| 10 | `ownership-routing-replay` | `replay` | `i` | `C4` | `replay`, `Replay` |
| 20 | `ownership-routing-teacher-mercy` | `teacher.?mercy` | `i` | `C2` | `teacher mercy`, `teacher-mercy` |
| 30 | `ownership-routing-coverage` | `coverage` | `i` | `C3` | `coverage`, `Coverage Engine` |
| 40 | `ownership-routing-judge-decision` | `judge|decision` | `i` | `Admin` | `judge`, `decision` |
| 50 | `ownership-routing-admin-governance` | `eipc|oii|governance|admin` | `i` | `Admin` | `eipc`, `oii`, `governance`, `admin` |
| 60 | `ownership-routing-capability` | `capability` | `i` | `Admin` | `capability` |

Policy note: this registry preserves the previous hard-coded ownership routing examples exactly. Registry edits are policy changes and require matching tests.
