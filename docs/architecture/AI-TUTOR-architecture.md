# AI Tutor Architecture — Four-Tab Seed-Grown Design

Core principle: The learner's own corrected sentence is the seed that grows the entire learning loop. Each tab has exactly one job. Topic coherence flows: Grammar (write/correct) → Speak (practice corrected sentence + content-aware follow-up) → Logic (Vietlish analysis). Lộ trình is orientation only.

Tab 1 — Lộ trình (orientation only)
- Static route card with three numbered steps ("1. Sửa một câu / 2. Luyện nói câu đó / 3. Hiểu vì sao tiếng Anh nói vậy") and a CTA to Grammar.
- No mic, no answer box, no Mercy đọc surface.
- Out of scope here: dynamic cross-session memory summary ("Hôm trước bạn luyện…"). That is a separate future MR pending reliable cross-session learner memory substrate.

Tab 2 — Sửa câu (writing + correction only)
- Textarea + "Sửa câu này" + corrected sentence with explanation + CTA "Đưa câu này sang Luyện nói" that writes to shared state and switches tab.
- Optional secondary voice input ("Đọc câu thay vì gõ") with draft-confirmation: transcription shown first with "[Dùng câu này] [Thu lại]".
- No "Mercy speak" or "Mercy đọc" card. Mic is input method only, never primary surface.

Tab 3 — Luyện nói (pronunciation practice + content-aware follow-up)
- Reads latest corrected sentence from shared state; fallback to generic prompt only when no corrected sentence exists.
- Mercy TTS-reads the corrected sentence, learner repeats via mic.
- Interim similarity score from speech-to-text-vs-target string-similarity (not phoneme grading).
- Exact label format: "Bạn nói giống câu mẫu khoảng X%." + line beneath: "Mercy đang nghe theo từ. Sẽ chấm phát âm chi tiết hơn sau."
- Never label as "pronunciation score" / "phát âm score" until Azure phoneme work lands.
- Phase 1 deterministic follow-up library, 6–10 sentence-pattern follow-ups. Architecture mirrors L4 rule library: pattern detection → templated follow-up.
- Phase 1 refinements: (a) deterministic depth cap at 4 follow-up turns per topic, then graceful pivot "Bạn muốn luyện thêm câu khác không?"; (b) L4 pattern detection wired into Speak — when learner's reply contains an L4-detected error, Mercy surfaces it through the existing SuggestionPanel (!155) before next follow-up; (c) state machine tracks "what's been asked" per session — never repeat the same templated follow-up within a session.

Tab 4 — Logic (curated Vietlish analysis + LLM fallback)
- Learner selects from curated library OR free-types a sentence.
- Curated starter set, 8 patterns: missing articles (a/an/the); unmarked past tense; plural -s; topic-comment fronting; in/on/at preposition transfer; interesting/interested adjective trap; word-for-word Vietnamese order; countable/uncountable nouns.
- Each entry: VN-language explanation; EN correct example; the Vietlish trap; contrast/memory aid.
- LLM fallback only for unmatched free-typed sentences. Mark long-tail; future MRs promote common LLM cases into curated entries.

Shared state
- Single source of truth for latest corrected sentence. Match existing codebase pattern (React context / Zustand) — do not add a new state library.
- Grammar writes; Speak and Logic read.

PHASE PLAN

Phase 1 (this MR, in flight by ChatGPT): four-tab refactor, deterministic Speak follow-ups, curated Logic library, shared state, honest interim score labeling, three Phase-1 refinements above.

Phase 2 (future MR, not now): LLM-augmented Speak follow-ups. Phase 2's design goal is to escape the deterministic ceiling in these four specific ways — record them explicitly:
1. Depth past 4 turns without template repetition.
2. Content-aware pivots (learner says "burned the fish" → Mercy notices "burned" and reacts, not just follows the pattern slot).
3. Emotional state modeling (frustration → ease off; coasting → push).
4. Unexpected teaching moments (catch awkward Vietlish even when grammatically correct).
Phase 2 should target these gaps specifically, with strict prompt + fallback-to-deterministic when API unavailable.

Phase 3 (further future): cross-session learner memory. "Hôm trước bạn luyện X" becomes possible. Requires reliable per-learner memory substrate not yet built.

DEPENDENCIES
- L4 wiring (!155) is reused as the content-aware-pivot mechanism in Speak Phase 1.
- Azure phoneme work is the eventual upgrade path for the Speak similarity score — it replaces interim string-similarity but keeps the same primary number label so learner trust is continuous across the upgrade.
