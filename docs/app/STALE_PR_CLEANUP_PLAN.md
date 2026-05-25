# Stale PR Cleanup Plan

Date: 2026-05-25
Branch: `a11-stale-pr-cleanup-plan`
Main baseline: `f0c26ae355ea60eeea300ebd66e00025e21597cc`

## Scope

This is a recommendation-only cleanup plan. No PRs were closed, merged, or modified.

Source of truth read:

- `docs/app/APP_LOGIC_FLOW.md`
- `docs/app/CONTINUOUS_LOGIC_FLOW_MAP.md`
- `docs/app/REPO_LOGIC_INSPECTION_PROTOCOL.md`

Current product assumptions:

- Foundation is done.
- Study OS Phase 1 is done on main through #1102.
- Mercy Kids stays `/kids/vi-english`, picture + speak only.
- AI Tutor owns Today's Lesson, Journey, Grammar, Speak, Logic, progress, and safe local memory.
- Logic mode stays text-only: no mic, speaker, TTS, or fallback voice labels.
- Memory remains local summary-only unless separately approved.
- Placement work stays outside this cleanup stream.

## Executive Recommendation

Close or supersede the old Foundation/AI Tutor stack PRs that predate #1068, #1073, #1077, #1096, #1100, #1101, and #1102. Keep or merge only docs/audit PRs and small safety PRs after review. Do not merge realtime voice or Placement/V4 PRs during Study OS cleanup without an explicit owner decision.

Highest-risk stale PRs:

- #1083: realtime voice, provider/edge/migration scope, optional later only.
- #1067, #1066, #1065, #1064, #1063, #1061, #1060, #1059, #1038: mostly superseded by current main.
- Placement/V4 PRs #992, #967, #965, #964, #963, #961, #959, #954 and related older Placement draft stack: keep out of Study OS.

## Detailed Priority PRs

| PR | Title | Current status | Main already contains the work? | Risk if merged now | Recommendation | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| #1099 | docs(app): audit whole repo logic cleanup | Open, merge state unknown | No | Low; docs-only but may duplicate this plan. | MERGE AFTER REVIEW | Still useful as a whole-repo audit, but should not be treated as current cleanup authority if this plan lands. |
| #1098 | fix(ui): separate floating Mercy helper from Kids | Open, clean | Partial | Medium; touches floating helper files that current main already simplified through #1093. | MERGE AFTER REVIEW | Related to current boundaries, but must be reviewed against current helper launcher behavior. |
| #1097 | Connect Vietlish logic engine to AI Tutor Logic mode | Open, dirty | Yes | Medium; main already has #1100 connecting Vietlish logic diagnosis. | CLOSE AS SUPERSEDED | Current main includes `feat: show vietlish logic diagnosis in logic mode (#1100)`. |
| #1084 | Audit adult AI Tutor study flow | Open, clean | No | Low; docs-only. | MERGE AFTER REVIEW | Keep if the adult study flow audit adds details not covered by #1099 or this plan. |
| #1083 | Add OpenAI Realtime voice chat for AI Tutor | Open, dirty | No | High; optional later voice, provider/edge/migration scope, touches AI Tutor and Kids test. | CLOSE AS UNSAFE/STALE | Realtime voice is explicitly later-only for Journey/Speak and should not land during Study OS cleanup. |
| #1082 | A3 refresh app flow alignment audit | Open, blocked | Partial | Low code risk, but stale duplicate docs. | CLOSE AS SUPERSEDED | Same audit theme as #1081/#1095/#1099 and now this plan. |
| #1081 | A3 app flow alignment audit | Open, clean | Partial | Low code risk, but stale duplicate docs. | CLOSE AS SUPERSEDED | Superseded by #1095 plus current cleanup plan. |
| #1074 | Clean AI Tutor speakable text | Open, dirty | Partial | Medium; touches `AiTutor.tsx`, voice engine, and speakable text after later Logic/Study OS work landed. | MERGE AFTER REVIEW | Safety intent is valid, but branch must be rebased and checked against #1100 Logic and current voice behavior. |
| #1067 | Add tutor target-language copy packs | Open, dirty | Yes | High; stale conflicts in AI Tutor copy/components. | CLOSE AS SUPERSEDED | Main contains target-language copy packs via #1073. |
| #1066 | Add Google TTS Teacher Mercy voice engine | Open, dirty | Yes | High; provider/edge/migration changes are already present and stale. | CLOSE AS SUPERSEDED | Main already has Google provider files under `supabase/functions/mercy-tts` and voice engine updates. |
| #1065 | Add tutor product config layer | Open, dirty | Partial | High; touches Kids, AI Tutor, and product config; can regress Kids picture + speak rule. | NEEDS OWNER DECISION | Product config cleanup may still be needed, but this branch is too stale. Rebuild as a tiny focused PR if needed. |
| #1064 | Audit Teacher Mercy tutor architecture | Open, dirty | Partial | High; docs plus stale product code touching Kids and AI Tutor. | CLOSE AS SUPERSEDED | Extract docs only if wanted; do not merge stale code. |
| #1063 | Scope tutor memory by product and language | Open, clean | Yes | Medium; may overwrite current memory shape/tests. | CLOSE AS SUPERSEDED | Current `learningMemory.ts` already scopes by product and target language. |
| #1061 | Add TutorTurn contract and tutor engine | Open, clean | Yes | Medium; can overwrite current tutor engine after Study OS updates. | CLOSE AS SUPERSEDED | Main already has `tutorEngine.ts`, `tutorTypes.ts`, and tests. |
| #1060 | Add tutor correction engine | Open, dirty | Yes | Medium; stale correction rules/tests. | CLOSE AS SUPERSEDED | Main already has `correctionEngine.ts` and `correctionRules/en.ts`. |
| #1059 | Fix AI Tutor shell and voice state | Open, dirty | Yes | High; broad stale changes across shell, voice, AI Tutor, and Kids tests. | CLOSE AS SUPERSEDED | Superseded by #1056, #1058, #1068, #1077, #1096, #1100, and later Study OS work. |
| #1038 | AI Tutor Voice Phase 1 - microphone input + learning memory + CTA + route fixes | Open, dirty | Yes | High; very old broad branch across routes, memory, CTA, and language pages. | CLOSE AS SUPERSEDED | Current main contains the route, CTA, voice, memory, and guardrail work in newer PRs. |
| #992 | test(v4): add deterministic V4 telemetry harness fixtures | Open, dirty | Partial | Medium; Placement/V4 only, outside Study OS. | NEEDS OWNER DECISION | Main already has V4 telemetry work (#968, #1026); Placement owner should decide. |
| #987 | docs: add principle 19 - operator commands must never false-green | Open, clean | No | Low; governance docs only. | NEEDS OWNER DECISION | Not Study OS; can merge independently if governance owner wants it. |
| #983 | docs: add single-agent handoff principle | Open, dirty | No | Low/medium; governance docs conflict risk. | NEEDS OWNER DECISION | Not Study OS; likely needs rebase against current `PRINCIPLES.md`. |
| #967 | feat(placement-v3): add live runner replay audit | Open, clean, base is #965 | Partial | Medium; stacked Placement PR. | NEEDS OWNER DECISION | Do not merge during Study OS cleanup; review with Placement stack. |
| #965 | feat(placement-v3): harden live validation runner | Open, clean, base is #959 | Partial | Medium; stacked Placement PR. | NEEDS OWNER DECISION | Do not merge during Study OS cleanup; review with Placement stack. |
| #964 | feat(placement-v3): land A29 non-writing graders on origin | Open, dirty | Partial | High; large Placement edge function stack with package changes. | NEEDS OWNER DECISION | Out of scope; may overlap already merged Placement recovery and V3 work. |
| #963 | feat(placement-v3): add persistence burn-in runner | Open, dirty | Partial | Medium; scripts, package, audio fixture. | NEEDS OWNER DECISION | Out of scope; Placement owner should compare against #966 and later gates. |
| #961 | feat(placement-v3): add Azure speaking burn-in | Open, dirty | Partial | Medium/high; Azure speaking runner and Placement session files. | NEEDS OWNER DECISION | Out of scope and voice-adjacent; do not merge in Study OS cleanup. |
| #959 | feat(placement-v3): add live validation runner | Open, dirty | Yes/partial | Medium; main already has live runner lineage via #962 and hardening commits. | CLOSE AS SUPERSEDED or NEEDS OWNER DECISION | Likely superseded by later Placement runner work, but owner should confirm before closing. |
| #954 | feat(placement-v3): add endurance + regression burn-in tooling | Open draft, dirty | Partial | High; draft, large Placement scope. | CLOSE AS UNSAFE/STALE | Draft Placement branch should not remain a merge candidate against current main. |

## Full Open PR Classification

This table classifies every open PR returned by `gh pr list --state open --limit 150` at audit time.

| PR | Title | Current status | Main already contains the work? | Risk if merged now | Recommendation | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| #1099 | docs(app): audit whole repo logic cleanup | Open, unknown | No | Low | MERGE AFTER REVIEW | Current audit context, docs-only. |
| #1098 | fix(ui): separate floating Mercy helper from Kids | Open, unknown | Partial | Medium | MERGE AFTER REVIEW | Boundary-relevant, but must be checked against current helper. |
| #1097 | Connect Vietlish logic engine to AI Tutor Logic mode | Open, unknown | Yes | Medium | CLOSE AS SUPERSEDED | Main has #1100. |
| #1084 | Audit adult AI Tutor study flow | Open, unknown | No | Low | MERGE AFTER REVIEW | Docs-only; review for duplication. |
| #1083 | Add OpenAI Realtime voice chat for AI Tutor | Open, unknown | No | High | CLOSE AS UNSAFE/STALE | Optional realtime voice later; provider/edge/migration scope. |
| #1082 | A3 refresh app flow alignment audit | Open, unknown | Partial | Low | CLOSE AS SUPERSEDED | Superseded audit doc. |
| #1081 | A3 app flow alignment audit | Open, unknown | Partial | Low | CLOSE AS SUPERSEDED | Superseded audit doc. |
| #1074 | Clean AI Tutor speakable text | Open, unknown | Partial | Medium | MERGE AFTER REVIEW | Safety intent valid; needs rebase/review. |
| #1067 | Add tutor target-language copy packs | Open, unknown | Yes | High | CLOSE AS SUPERSEDED | Main has #1073. |
| #1066 | Add Google TTS Teacher Mercy voice engine | Open, unknown | Yes | High | CLOSE AS SUPERSEDED | Main has Google TTS path. |
| #1065 | Add tutor product config layer | Open, unknown | Partial | High | NEEDS OWNER DECISION | Rebuild focused config cleanup instead. |
| #1064 | Audit Teacher Mercy tutor architecture | Open, unknown | Partial | High | CLOSE AS SUPERSEDED | Stale code plus docs. |
| #1063 | Scope tutor memory by product and language | Open, unknown | Yes | Medium | CLOSE AS SUPERSEDED | Main memory is already scoped. |
| #1061 | Add TutorTurn contract and tutor engine | Open, unknown | Yes | Medium | CLOSE AS SUPERSEDED | Main already has engine/types. |
| #1060 | Add tutor correction engine | Open, unknown | Yes | Medium | CLOSE AS SUPERSEDED | Main already has correction engine. |
| #1059 | Fix AI Tutor shell and voice state | Open, unknown | Yes | High | CLOSE AS SUPERSEDED | Superseded by foundation and Study OS work. |
| #1038 | AI Tutor Voice Phase 1 - microphone input + learning memory + CTA + route fixes | Open, unknown | Yes | High | CLOSE AS SUPERSEDED | Superseded by newer AI Tutor PRs. |
| #992 | test(v4): add deterministic V4 telemetry harness fixtures | Open, unknown | Partial | Medium | NEEDS OWNER DECISION | Placement/V4 owner decision. |
| #987 | docs: add principle 19 - operator commands must never false-green | Open, unknown | No | Low | NEEDS OWNER DECISION | Governance docs. |
| #983 | docs: add single-agent handoff principle | Open, unknown | No | Low/medium | NEEDS OWNER DECISION | Governance docs, likely needs rebase. |
| #967 | feat(placement-v3): add live runner replay audit | Open, clean | Partial | Medium | NEEDS OWNER DECISION | Stacked Placement PR. |
| #965 | feat(placement-v3): harden live validation runner | Open, clean | Partial | Medium | NEEDS OWNER DECISION | Stacked Placement PR. |
| #964 | feat(placement-v3): land A29 non-writing graders on origin | Open, unknown | Partial | High | NEEDS OWNER DECISION | Large Placement edge stack. |
| #963 | feat(placement-v3): add persistence burn-in runner | Open, unknown | Partial | Medium | NEEDS OWNER DECISION | Placement script stack. |
| #961 | feat(placement-v3): add Azure speaking burn-in | Open, unknown | Partial | High | NEEDS OWNER DECISION | Placement voice-adjacent stack. |
| #959 | feat(placement-v3): add live validation runner | Open, unknown | Yes/partial | Medium | NEEDS OWNER DECISION | Likely superseded, but Placement owner should confirm. |
| #954 | feat(placement-v3): add endurance + regression burn-in tooling | Open draft, unknown | Partial | High | CLOSE AS UNSAFE/STALE | Draft large Placement branch. |
| #953 | feat(placement-v3): add runtime observability and forensic tooling | Open draft, unknown | Partial | Medium | NEEDS OWNER DECISION | Placement draft stack. |
| #952 | docs(placement-v3): add A37 shadow replay readiness report | Open, unknown | No | Low | NEEDS OWNER DECISION | Placement docs. |
| #951 | feat(placement-v3): add data-quality audit + integrity tooling | Open draft, unknown | Partial | Medium | NEEDS OWNER DECISION | Placement draft stack. |
| #950 | test: stabilize Placement V3 test harness and E2E reliability | Open, unknown | Partial | Medium | NEEDS OWNER DECISION | Placement tests. |
| #948 | chore(placement-v3): add merge-readiness audit for PR stack | Open draft, unknown | No | Low | NEEDS OWNER DECISION | Placement docs. |
| #946 | feat(placement-v3): add adaptive item generation gauntlet scaffold | Open draft, unknown | No/partial | Medium | NEEDS OWNER DECISION | Placement draft stack. |
| #944 | feat(placement-v3): add benchmarking infrastructure scaffold | Open draft, unknown | No/partial | Medium | NEEDS OWNER DECISION | Placement draft stack. |
| #943 | feat(placement-v3): add grading drift replay harness | Open draft, unknown | No/partial | Medium | NEEDS OWNER DECISION | Placement draft stack. |
| #940 | feat(placement-v3): full UI implementation (A30) | Open draft, unknown | Partial | High | NEEDS OWNER DECISION | Placement UI stack; out of Study OS. |
| #939 | feat(placement-v3): conversational Mercy assessment mode (A32) | Open draft, unknown | Partial | High | NEEDS OWNER DECISION | Placement conversational mode; out of Study OS. |
| #938 | feat(placement-v3): session orchestrator + state machine (A31) | Open draft, unknown | Partial | High | NEEDS OWNER DECISION | Placement session stack. |
| #937 | feat(placement-v3): prompt library + calibration corpus (A25) | Open draft, unknown | No/partial | Medium | NEEDS OWNER DECISION | Placement prompt stack. |
| #936 | feat(placement-v3): recommendation engine + lesson index (A26) | Open draft, unknown | No/partial | Medium | NEEDS OWNER DECISION | Placement recommender stack. |
| #935 | feat(placement-v3): storage schema + migrations + RLS (A24) | Open draft, unknown | Partial | High | NEEDS OWNER DECISION | Placement storage/migrations. |
| #934 | feat(placement-v3): Vietnamese L1 interference taxonomy (A23) | Open draft, unknown | No/partial | Medium | NEEDS OWNER DECISION | Placement taxonomy stack. |
| #933 | feat(placement-v3): AI CEFR grading core for writing assessment | Open draft, unknown | Partial | High | NEEDS OWNER DECISION | Placement grading core. |
| #932 | docs(placement): v3 design - DET-class AI-graded placement (A22) | Open draft, unknown | Partial | Low | NEEDS OWNER DECISION | Placement design docs. |
| #926 | docs(observability): chunk recovery instrumentation audit (A14d-audit) | Open, unknown | No | Low | NEEDS OWNER DECISION | Observability docs. |
| #924 | feat(public-api-validation): zod schemas for l1-detect (A11c-l1-detect) | Open, unknown | No | Medium | NEEDS OWNER DECISION | Public API validation. |
| #923 | ci(boundaries): promote Module Boundaries to required-check ruleset | Open draft, unknown | No | High | NEEDS OWNER DECISION | CI policy change. |
| #922 | test(billing): raise src/billing coverage to 75%+ | Open draft, unknown | No | Medium | NEEDS OWNER DECISION | Billing tests. |
| #916 | feat(admin-validation): zod schemas for admin-list-* trio | Open, unknown | No | Medium | NEEDS OWNER DECISION | Admin validation. |
| #915 | docs(audit): HTTP-200-on-failure pattern sweep across edge functions | Open, unknown | No | Low | NEEDS OWNER DECISION | Edge docs. |
| #914 | feat(admin-validation): zod schemas for admin-management | Open, unknown | No | Medium | NEEDS OWNER DECISION | Admin validation. |
| #911 | feat(admin-validation): zod schemas for admin-hide-room | Open, unknown | No | Medium | NEEDS OWNER DECISION | Admin validation. |
| #910 | feat(admin-validation): zod schemas for admin-publish-room | Open, unknown | No | Medium | NEEDS OWNER DECISION | Admin validation. |
| #907 | feat(admin-validation): zod schemas for admin-set-tier | Open, unknown | No | Medium | NEEDS OWNER DECISION | Admin validation. |
| #906 | feat(sentry): widen DOM-mutation noise filter to include insertBefore | Open, unknown | No | Medium | NEEDS OWNER DECISION | Observability runtime change. |
| #905 | docs(skills): formalize agent dispatch discipline | Open, unknown | No | Low | NEEDS OWNER DECISION | Governance docs. |
| #904 | docs(observability): production error pattern triage | Open, unknown | No | Low | NEEDS OWNER DECISION | Observability docs. |
| #903 | chore(dead-code): delete dead Teacher-Mercy widget subsystem | Open, unknown | Unknown | High | NEEDS OWNER DECISION | Dead-code deletion may overlap current Teacher Mercy/Study OS surfaces. |
| #902 | docs(security): anon-readable tables investigation | Open, unknown | No | Low | NEEDS OWNER DECISION | Security docs. |
| #901 | feat(sentry): pin plugin + runtime release.name explicitly | Open, unknown | No | Medium | NEEDS OWNER DECISION | Observability runtime/config. |
| #897 | docs(security): canonical RLS reference + inline policy documentation | Open, unknown | No | Low | NEEDS OWNER DECISION | Security docs. |
| #896 | chore(process): PR template soft-enforcement + weekly compliance observability | Open, unknown | No | Medium | NEEDS OWNER DECISION | Process/CI behavior. |
| #895 | feat(webhook): zod runtime validation for RevenueCat payloads | Open, unknown | No | Medium | NEEDS OWNER DECISION | Billing webhook. |
| #894 | test(billing): raise _billing coverage to 60%+ | Open, unknown | No | Medium | NEEDS OWNER DECISION | Billing tests. |
| #893 | feat(webhook): zod runtime validation for Stripe payloads | Open, unknown | No | Medium | NEEDS OWNER DECISION | Billing webhook. |
| #892 | docs(audit): Sentry release + sourcemap pipeline audit | Open, unknown | No | Low | NEEDS OWNER DECISION | Observability docs. |
| #891 | feat(webhook): zod runtime validation for Google RTDN payloads | Open, unknown | No | Medium | NEEDS OWNER DECISION | Billing webhook. |
| #890 | docs(pr-template): codify real-device verification gate | Open, unknown | No | Low | NEEDS OWNER DECISION | Governance/process docs. |
| #889 | docs(audit): native Sentry init audit - iOS + Android | Open, unknown | No | Low | NEEDS OWNER DECISION | Observability docs. |
| #888 | docs(security): edge function security + validation audit | Open, unknown | No | Low | NEEDS OWNER DECISION | Security docs. |
| #886 | feat(webhook): zod runtime validation for Apple payloads | Open, unknown | No | Medium | NEEDS OWNER DECISION | Billing webhook. |
| #885 | feat(observability): slow-query instrumentation for Supabase calls | Open, unknown | No | Medium | NEEDS OWNER DECISION | Observability runtime. |
| #884 | ci(coverage): add Vitest coverage gate with per-folder ratchet | Open, unknown | No | High | NEEDS OWNER DECISION | CI gate change. |
| #882 | chore(types): regenerate database.types.ts post #789+#832 apply | Open, unknown | Unknown | Medium | NEEDS OWNER DECISION | Generated types can conflict with current schema. |
| #881 | chore(principles): P16 sub-clause rebase | Open, unknown | No | Low | NEEDS OWNER DECISION | Governance docs. |
| #877 | feat(billing): A18 PR2 - stripe-webhook repoint | Open draft, unknown | No | High | NEEDS OWNER DECISION | Billing runtime change. |
| #876 | docs(principles): P18 - boxed headline required on every report | Open, unknown | No | Low | NEEDS OWNER DECISION | Governance docs. |
| #875 | docs(billing): A18 PR2 scope | Open, unknown | No | Low | NEEDS OWNER DECISION | Billing docs. |
| #857 | chore(sentry): remove smoke-test scaffold | Open draft, unknown | Unknown | Medium | NEEDS OWNER DECISION | Observability cleanup. |
| #829 | docs(principles): P16 sub-clause - harness-policy seam handling | Open, unknown | No | Low | NEEDS OWNER DECISION | Governance docs. |
| #801 | docs(customer): mylinh apply-ready package | Open, unknown | No | Low | NEEDS OWNER DECISION | Customer ops docs. |
| #783 | docs: session-end principles refresh | Open, unknown | No | Low | NEEDS OWNER DECISION | Governance docs. |
| #782 | docs(agent-briefs): premise correction protocol added to preflight checklist | Open draft, unknown | No | Low | NEEDS OWNER DECISION | Agent docs. |
| #781 | docs(agent-briefs): PR title convention for dispatch-driven PRs | Open, unknown | No | Low | NEEDS OWNER DECISION | Agent docs. |

## Suggested Closure Batch

First closure batch, after owner approval:

- #1097
- #1082
- #1081
- #1067
- #1066
- #1064
- #1063
- #1061
- #1060
- #1059
- #1038

Unsafe/stale hold-or-close batch:

- #1083
- #954

Owner-decision batch:

- #1065
- #1074
- all Placement/V4 PRs
- governance/process/billing/observability backlog PRs

## Validation

```sh
git diff --check
```

