# Placement Test v3 Design

Status: draft design for A22  
Scope: research + system design only; no implementation

## 1. North Star

Placement Test v3 is MercyBlade's DET-class, AI-graded diagnostic assessment for signed-in free-tier learners: a short, mobile-first, bilingual VN↔EN test that estimates separate CEFR skill levels, identifies Vietnamese-L1 transfer problems, and recommends the next pair-matrix lessons that will actually move the learner forward. It supersedes v1's small binary-search adaptive quiz and v2's unexposed multiple-choice 2PL IRT engine by combining v2's quantitative backbone with AI-native speaking, writing, listening, and conversational tasks. Its sophistication comes from multi-modal grading, uncertainty-aware CEFR reporting, and calibration against human grades; its MercyBlade specificity comes from Vietnamese-first UX, Mercy's bilingual teacher voice, and diagnostic codes tied to Vietnamese-speaker pronunciation and grammar interference. Positioning: unlike Duolingo's in-app placement, v3 is not just a course-entry shortcut; unlike the Duolingo English Test, it is not a high-stakes certification exam; unlike Cambridge tests, it is not a long general-purpose exam battery: it is a fast, pair-matrix-native learning diagnosis that converts free Vietnamese learners into a precise MercyBlade path.

## 2. User Journey

The target learner is already signed in, on the free tier, and has either finished pair-selection onboarding or defaults to the Vietnamese-native → English flagship track. The test must feel like a useful lesson preview, not a bureaucratic exam.

1. **Entry: Take Placement**
   - Entry points: Home banner for users with no recent v3 profile, Account action, and a post-signup nudge.
   - Copy is Vietnamese-first for the flagship track: "Làm bài đánh giá trình độ" with English secondary below. For EN→VI users, English becomes primary.
   - The intro sets expectations: 5-8 minutes, microphone required for speaking, headphones recommended, no score shame, one free full result.
   - Estimated time: 20-30 seconds.

2. **Environment + consent check**
   - The app asks for microphone access before the first speaking task, not after the user has already invested time.
   - The user sees a plain retention notice: audio is used for scoring and calibration; Chau must decide final retention policy in §14.
   - If mic permission is denied, the user can continue with a reduced-confidence reading/writing/listening profile; speaking is marked `not_reportable`.
   - Estimated time: 20-40 seconds.

3. **Warm-up self-rating**
   - One bilingual self-rating question, inherited conceptually from v2: beginner / intermediate / advanced / not sure.
   - This seeds item difficulty but is not reported as evidence.
   - Estimated time: 10 seconds.

4. **Objective adaptive core**
   - The first 5-7 tasks are quick selected-response items: vocabulary-in-context, grammar/transfer distractors, short reading comprehension, and listen-and-type/listen-and-select.
   - Modality: read, listen, tap/type.
   - Vietnamese support: task instructions bilingual; content mostly English; optional Vietnamese reveal on reading items is logged and discounts confidence.
   - Estimated time: 2-3 minutes.

5. **Read-aloud pronunciation task**
   - The learner reads 2 short sentences chosen for Vietnamese-speaker problem sounds: final consonants, /theta/ and /dh/, /r/ vs /l/, tense endings, consonant clusters, word stress.
   - Modality: speak from text.
   - Azure phoneme assessment provides accuracy, fluency, completeness, phoneme, word, and optional prosody signals; AI interprets these against Vietnamese-specific error categories.
   - Estimated time: 45-60 seconds.

6. **Short writing task**
   - The learner writes 45-70 words from a VN-relevant prompt, e.g. "Describe a time English helped you at school, work, or online."
   - Prompt appears in Vietnamese and English, but the response must be in English for VI→EN.
   - AI scores grammar, lexical range, coherence, task fulfillment, and L1-interference flags.
   - Estimated time: 90 seconds.

7. **Listening + summary task**
   - The learner hears a short dialogue or monologue once or twice, then writes a 1-3 sentence summary or answers a short prompt.
   - Scenario is local: job interview, IELTS class, airport, customer support, Canadian/Vietnamese diaspora life.
   - Modality: listen, write.
   - Estimated time: 75-90 seconds.

8. **Conversation with Mercy**
   - Mercy asks 2-3 adaptive spoken questions. The first question is broad and friendly; follow-ups depend on transcript content and estimated ability, echoing DET-style intra-task adaptivity.
   - The learner speaks 20-40 seconds per answer. Mercy's visible wording remains warm, bilingual, and low-pressure.
   - AI grades fluency, interactional adequacy, grammar under time pressure, lexical range, coherence, and repair ability.
   - Estimated time: 2 minutes.

9. **Batch scoring + progress state**
   - Objective tasks score immediately. Audio is uploaded to storage and Azure. Transcripts and open responses go through AI grading.
   - The result screen can show "Đang chấm phần nói và viết..." with a 10-25 second budget. If batch scoring exceeds the limit, the user gets a provisional profile and a notification when the final profile is ready.

10. **Results + recommendations**
    - Output is not one level only. The result shows Speaking, Listening, Reading, Writing, confidence bands, top strengths, top gaps, and "3 bài nên học tiếp".
    - Free-tier value demonstration: show enough diagnostic detail to build trust, then recommend paid lessons only as secondary when the primary next lesson is free or accessible.
    - Each recommendation has a "why this lesson" explanation tied to a diagnostic code, e.g. "Bạn bỏ `-s` số nhiều trong 2/3 câu; học bài này trước khi luyện IELTS Speaking Part 2."

## 3. Modalities & Task Types

External rationale: DET combines adaptive objective tasks with writing/speaking engines and interactive tasks; its current research report distinguishes grading individual responses from scoring them into final reported scores, and describes both IRT and weighted aggregation as valid components of a digital-first test [DET administration/scoring report](https://duolingo-papers.s3.us-east-1.amazonaws.com/reports/Duolingo_whitepaper_test_scoring_current.pdf). CEFR descriptors are organized across reception, production, interaction, and mediation, not a single monolithic level [Council of Europe CEFR descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors).

| Modality / task type | Assesses | Count | Duration | Why include it |
|---|---:|---:|---:|---|
| Self-rating seed | Initial prior only; not reported | 1 | 10s | Keeps adaptive start humane and reduces early over/under-targeting. v2 already models this as a prior. |
| Vocabulary + grammar MC | Reading, grammar control, lexical range, VN transfer distractors | 3-4 | 60-75s | Fast objective signal; supports IRT; catches known Vietnamese errors such as articles, plural `-s`, tense, and question inversion. |
| Reading comprehension | Reading, inference, tolerance for English-only input | 1-2 | 60-75s | CEFR reception descriptors include reading for information and argument; optional VI reveal becomes a confidence signal. |
| Listening selected response / dictation | Listening, phonological decoding, working memory | 1-2 | 45-75s | DET includes dictation/listening tasks with objective or continuous grades; MercyBlade needs listening separate from reading. |
| Read aloud | Pronunciation accuracy, fluency, completeness, stress/prosody | 2 | 45-60s | Azure can produce phoneme/word-level evidence; this is MercyBlade's Vietnamese-pronunciation moat. |
| Short writing | Writing, grammar, coherence, vocabulary, L1 interference | 1 | 90s | CEFR written production needs open response; MC grammar cannot estimate productive control. |
| Listen then summarize | Listening + writing integration | 1 | 75-90s | Integrated tasks reveal whether the learner can process meaning, not just recognize words. |
| Conversation with Mercy | Speaking production, interaction, fluency, repair, grammar under pressure | 1 topic, 2-3 turns | 2m | CEFR oral interaction is distinct from monologue; DET uses interactive speaking with follow-up prompts. |
| Optional finish-early/provisional path | Completion protection | N/A | N/A | If a learner cannot speak or network fails, v3 still returns a partial profile with honest confidence. |

Total expected time: 5.5-8 minutes for a complete run. The system should enforce a maximum of about 10 minutes; longer becomes a product risk for free users.

## 4. Assessment Engine

The engine should treat **grading** and **scoring** as separate layers. Grading converts a response into task-level evidence; scoring combines evidence into skill estimates and confidence intervals. This matches the distinction in the DET scoring overview and also protects MercyBlade from hard-coding one model's output as final truth.

### Model Choice

Default production recommendation as of May 20, 2026:

- **Claude Sonnet 4.6** for most grading turns: strong enough for structured rubric judgment, lower cost and faster latency than Opus.
- **Claude Opus 4.7** for calibration adjudication, prompt development, contested low-confidence cases, and periodic audit batches. Anthropic lists Opus 4.7 as its most capable generally available model and Sonnet 4.6 as the best speed/intelligence balance, with current listed prices of $5/$25 per million input/output tokens for Opus and $3/$15 for Sonnet [Anthropic model overview](https://platform.claude.com/docs/en/about-claude/models/overview).
- **Azure Pronunciation Assessment** for scripted read-aloud phoneme and word evidence. Microsoft states pronunciation assessment gives accuracy and fluency feedback and costs the same baseline as Speech to Text; scripted assessment can return phoneme, syllable, word, full-text, fluency, completeness, prosody, and error-type signals [Microsoft pronunciation assessment docs](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment).

Model names are intentionally isolated in config. If Anthropic or another provider changes pricing or quality, the design survives with a provider adapter.

### Objective Adaptive Core

Reuse v2's server-side structure for selected-response tasks:

- `placement_items`: item bank with difficulty, discrimination, content, answer key, L1 tags.
- 2PL IRT kernel: `prob2PL`, item information, test information, standard error.
- EAP/MLE theta estimator and adaptive item selector.
- Content balancing across reading, listening, grammar, vocabulary.
- Randomesque exposure control and Vietnamese-L1 nudge.

Grading:

- MC: deterministic correct/incorrect server-side.
- Dictation/listen-and-type: normalize punctuation/case, then use continuous score 0-1; v2 currently assumes dichotomous scoring, so v3 either dichotomizes for the IRT backbone or stores continuous grades in the response trace and maps them into a graded-response model later.
- VI reveal: if Vietnamese support is shown, mark `l1_revealed_used=true`; objective correctness may still count, but confidence and mastery are discounted.

Rubric:

- Objective CEFR intent from item authoring.
- IRT item parameters from v2's current expert estimates until pilot data can recalibrate.
- L1-transfer flags from v2's `L1TransferTag` plus the broader 61-rule VN detector in `src/lib/feedback/l1-error-detector.ts`.

Confidence:

- Use theta SE for objective-core ability.
- If fewer than minimum items per skill, mark that skill `not_reportable`.
- Do not overfit a single grammar miss into a high-severity gap; require repeated evidence or open-response confirmation.

### Read-Aloud Pronunciation

Flow:

- Client records audio; uploads to storage; edge function calls Azure.
- Azure returns transcript plus pronunciation JSON.
- AI receives target text, Azure scores, phoneme details, duration, transcript, learner pair, and Vietnamese-specific phoneme map.

Prompt template sketch:

- System: "You are an English pronunciation assessor for Vietnamese learners. Use Azure phoneme evidence. Do not infer personality or effort. Return JSON only."
- Inputs: target sentence, transcript, Azure word/phoneme scores, locale, known VN problem pairs.
- Rubric: accuracy, fluency, completeness, stress/prosody, intelligibility, VN-L1 flags.
- Output: CEFR speaking-pronunciation evidence, not whole Speaking level alone.

Rubric:

- Azure `AccuracyScore` and phoneme-level scores drive segmental pronunciation.
- Fluency/completeness/prosody inform oral production but cannot alone prove high CEFR.
- Custom VN flags: `vi_pron_final_consonant_drop`, `vi_pron_th_to_t_d`, `vi_pron_r_l_confusion`, `vi_pron_ed_ending`, `vi_pron_cluster_reduction`, `vi_pron_word_stress_flat`.

Confidence:

- High when Azure audio quality is good and transcript aligns.
- Medium when ASR transcript is noisy but phoneme evidence is usable.
- Low when audio is too short, clipped, or target text not attempted.

### Short Writing

Flow:

- The response is scored by Sonnet 4.6 with a strict JSON schema.
- A deterministic L1 detector runs in parallel where expected-answer comparison is possible; for open writing, AI assigns L1 flags and the rule detector can validate obvious cases.

Prompt template sketch:

- System: "You are a CEFR-aligned writing assessor for Vietnamese-native English learners. Grade only the submitted English. Use CEFR descriptors and MercyBlade diagnostic tags. Return JSON."
- Inputs: prompt, learner response, native/target pair, time limit, whether assistance was used.
- Rubric dimensions: task fulfillment, grammatical control, vocabulary range, coherence/cohesion, spelling/punctuation, Vietnamese L1 interference.
- Calibration examples: stored internally, not in this doc.

Rubric:

- CEFR Companion Volume written production descriptors as the anchor, especially overall written production, creative writing, and reports/essays categories.
- Custom MercyBlade additions: productive control of articles, plurality, verb tense/aspect, question order, prepositions, countability, possessive `s`, adjective order, conditionals, relative clauses.

Confidence:

- Response under 20 words: cap Writing at A2 unless the prompt explicitly asked for a short answer.
- Copy-paste or off-topic response: task fulfillment low, confidence in ability low.
- AI returns both `score` and `evidence_quotes` limited to short excerpts.

### Listening + Summary

Flow:

- Audio prompt is served from Supabase room-audio or generated/curated placement audio.
- Selected-response portions score objectively.
- Summary response is graded by AI against a hidden transcript and key points.

Prompt template sketch:

- System: "Assess listening comprehension and summary quality. Do not reward grammar beyond what blocks meaning; separate Listening evidence from Writing evidence."
- Inputs: transcript, expected key points, learner summary, replay count, response time.
- Output: listening comprehension grade, writing-language grade, missed key points, hallucinated details, confidence.

Rubric:

- Listening: gist, details, inference, speaker intent.
- Writing spillover: grammar only affects Listening if it prevents evidence of comprehension.

Confidence:

- If audio replay count exceeds configured limit due to technical retry, do not penalize.
- If learner writes in Vietnamese, mark Listening evidence partial if content is correct but Writing not reportable.

### Conversation with Mercy

Flow:

- Mercy asks a first prompt selected by current objective estimate and pair.
- Learner speaks; transcript is produced by STT.
- Sonnet 4.6 grades the response and generates the next prompt from a constrained set. The follow-up prompt is content-adaptive but must remain within assessment-safe templates.
- After 2-3 turns, a conversation evaluator scores the whole mini-session.

Prompt template sketch:

- System: "You are the hidden assessor, not Mercy. Grade a spoken interaction transcript from a Vietnamese learner of English. Separate fluency, interaction, grammar, vocabulary, coherence, and pronunciation evidence. Return JSON."
- Inputs: prompts, transcripts, durations, pauses if available, Azure pronunciation evidence if captured, objective estimate prior.
- Rubric: CEFR oral production + oral interaction descriptors, plus custom L1 tags.

Rubric:

- Fluency: amount of speech, pause pattern, repair, self-correction.
- Interaction: relevance to prompt, ability to answer follow-up, clarification behavior.
- Grammar/vocab: productive range under time pressure.
- Pronunciation: if Azure or STT confidence exists; otherwise mark pronunciation evidence weak.

Confidence:

- Do not let verbosity alone inflate level.
- Penalize memorized/off-topic template answers.
- If transcript confidence is low, use audio/pronunciation evidence where possible and widen confidence interval.

### Final Scoring

Recommended scoring model for v3:

- Keep objective theta as one evidence stream.
- Convert each open-response rubric dimension to calibrated logits by skill.
- Fuse evidence with a Bayesian/evidence-weighted model, not a simple average.
- Report CEFR bands with confidence intervals, e.g. `B1 [A2-B1]`, not fake precision.
- If modalities disagree sharply, report the split: "Reading B1, Speaking A2" is better than hiding it in "A2 overall."

## 5. Multi-Dimensional CEFR Output Schema

The stored profile should be machine-readable enough to drive recommendations and human-readable enough to render results without re-grading.

```json
{
  "schema_version": "placement_v3_profile_1",
  "profile_id": "uuid",
  "session_id": "uuid",
  "user_id": "uuid",
  "native_language": "vi",
  "target_language": "en",
  "completed_at": "2026-05-20T18:30:00Z",
  "overall": {
    "cefr": "B1",
    "confidence": 0.74,
    "ci": { "low": "A2", "high": "B1" },
    "reportable": true
  },
  "skills": {
    "speaking": {
      "cefr": "A2",
      "ci": { "low": "A1", "high": "B1" },
      "confidence": 0.62,
      "subscores": {
        "pronunciation": 0.58,
        "fluency": 0.55,
        "grammar_control": 0.51,
        "interaction": 0.64,
        "lexical_range": 0.49
      },
      "evidence_count": 4,
      "reportable": true
    },
    "listening": {
      "cefr": "B1",
      "ci": { "low": "A2", "high": "B1" },
      "confidence": 0.7,
      "evidence_count": 3,
      "reportable": true
    },
    "reading": {
      "cefr": "B1",
      "ci": { "low": "B1", "high": "B2" },
      "confidence": 0.81,
      "evidence_count": 5,
      "reportable": true
    },
    "writing": {
      "cefr": "A2",
      "ci": { "low": "A2", "high": "B1" },
      "confidence": 0.68,
      "evidence_count": 2,
      "reportable": true
    }
  },
  "strengths": [
    {
      "code": "reading_gist_b1",
      "label_vi": "Nắm ý chính khi đọc",
      "label_en": "Reading for gist",
      "evidence": "Answered 2/2 gist questions correctly without Vietnamese reveal."
    }
  ],
  "gaps": [
    {
      "code": "vi_l1_missing_article",
      "severity": "high",
      "skill": "writing",
      "label_vi": "Thiếu mạo từ a/an/the",
      "label_en": "Article omission",
      "evidence_count": 3,
      "confidence": 0.82
    }
  ],
  "l1_interference_flags": [
    {
      "code": "vi_l1_plural_s",
      "category": "grammar",
      "severity": "moderate",
      "skill_evidence": ["writing", "conversation"],
      "lesson_map_key": "vi_en.grammar.plural_s.a1_a2"
    },
    {
      "code": "vi_pron_final_consonant_drop",
      "category": "pronunciation",
      "severity": "high",
      "skill_evidence": ["read_aloud"],
      "lesson_map_key": "vi_en.pronunciation.final_consonants.a1_b1"
    }
  ],
  "recommendations": [
    {
      "rank": 1,
      "lesson_id": "english_a2_a201",
      "pair": "vi-en",
      "reason_code": "vi_l1_missing_article",
      "reason_vi": "Bạn đang bỏ a/an/the trong câu đơn. Bài này sửa lỗi đó trước khi lên bài dài hơn.",
      "reason_en": "You are dropping a/an/the in simple sentences. This lesson fixes that before longer speaking tasks.",
      "access": "free",
      "confidence": 0.86
    }
  ],
  "scoring_trace_ref": "placement_sessions_v3.scoring_trace",
  "retake": {
    "eligible_at": "2026-06-03T18:30:00Z",
    "policy": "free_retake_after_14_days"
  }
}
```

Allowed CEFR values: `pre_a1`, `A1`, `A2`, `B1`, `B2`, `C1`, `C2`. Confidence intervals are discrete CEFR bands, not numeric-only hidden theta values, because the UI must be honest to learners.

## 6. Pair-Matrix Integration

v3 must not be an English-only feature hidden behind Vietnamese copy. It should be designed as a pair-matrix assessment shell with the VI→EN implementation first.

Current repo shape:

- Pair choice lives in `native_language` + ordered `target_languages`.
- Anonymous and signed-in onboarding already distinguish `nativeLanguage` and `primaryTarget`.
- Vietnamese → English rooms live under `public/data/*.json`, mapped today by `src/lib/placement/cefrToRoom.ts`.
- English-native → Vietnamese lessons exist as the `src/languages/vietnamese` track with 536 lessons.
- Other target-language lesson tracks expose CEFR-like levels and categories, although not all are equally deep.

Recommendation routing:

- `native_language=vi`, `target_language=en`: recommend English rooms and VN-specific grammar/pronunciation lessons.
- `native_language=en`, `target_language=vi`: recommend Vietnamese-for-foreigners lessons; L1 interference shifts from Vietnamese→English to English→Vietnamese problems, e.g. tones, classifiers, pronoun choice, word order, politeness particles.
- Other pairs: use the same profile shell but start with reading/writing/objective tasks until pair-specific speech/l1 maps exist.

Diagnostic-code mapping schema:

```json
{
  "map_version": "pair_matrix_diagnostic_map_1",
  "diagnostic_code": "vi_l1_missing_article",
  "source_pair": "vi-en",
  "target_skill": "writing",
  "cefr_min": "A1",
  "cefr_max": "B1",
  "severity_weights": {
    "low": 0.4,
    "moderate": 0.8,
    "high": 1.0
  },
  "lesson_candidates": [
    {
      "lesson_id": "english_a1_a101",
      "rank_weight": 0.9,
      "access": "free",
      "repair_type": "foundation"
    },
    {
      "lesson_id": "english_a2_a201",
      "rank_weight": 1.0,
      "access": "free",
      "repair_type": "next_step"
    }
  ],
  "explanation_templates": {
    "vi": "Bạn đang thiếu mạo từ trong câu tiếng Anh. Học bài này để sửa từ gốc.",
    "en": "You are missing English articles. This lesson repairs the foundation."
  }
}
```

Recommendation ranking:

1. Filter by pair and target language.
2. Filter by skill and CEFR range.
3. Prefer high-confidence, high-severity gaps.
4. Prefer free or currently accessible lessons for the primary CTA.
5. Add one stretch lesson if the learner's confidence interval reaches the next band.
6. Never recommend a non-existent room; keep the existing CI-style validation that v1/v2 used for CEFR-to-room mapping.

## 7. Architecture

Text diagram:

```text
React client
  ├─ Placement v3 UI shell
  ├─ Media recorder + permission check
  ├─ Supabase auth JWT
  └─ Progress/result renderer

Supabase Edge Functions
  ├─ placement-session-v3
  │   ├─ starts/resumes sessions
  │   ├─ serves safe public task payloads
  │   ├─ records responses
  │   ├─ calls v2 objective engine for MC/listening/reading
  │   ├─ calls AI grading adapter for open responses
  │   └─ assembles final profile + recommendations
  ├─ azure-phoneme
  │   └─ existing pronunciation assessment path
  └─ ai-grading-adapter
      ├─ Claude Sonnet 4.6 online grading
      ├─ Opus 4.7 audit/adjudication path
      └─ schema validation + retry/repair

Data layer
  ├─ placement_sessions_v3
  ├─ placement_responses_v3
  ├─ placement_profiles_v3
  ├─ placement_items / placement_items_v3
  ├─ placement_diagnostic_lesson_map
  └─ Storage bucket for response audio
```

Data flow per modality:

- Objective item: client requests next item → edge strips answer keys → client submits answer → edge scores deterministically → v2 engine updates theta and picks next item.
- Read aloud: client records audio → storage ref + metadata saved → Azure phoneme returns scores → AI maps evidence to pronunciation flags → response evaluation saved.
- Writing: client submits text → edge stores raw text → AI returns rubric JSON → schema validator checks it → response evaluation saved.
- Listening summary: edge knows hidden transcript/key points → client submits summary → AI grades against key points → listening and writing evidence split.
- Conversation: edge selects Mercy prompt → client records/transcribes → AI grades turn and chooses constrained follow-up → final conversation evaluation saved.

Real-time vs batch:

- Real-time: start/resume, objective scoring, item selection, simple result progress.
- Near-real-time: Azure read-aloud scoring with 12-15 second timeout, matching the current `cloudScorer` timeout posture.
- Batch within session: final AI aggregation with 25 second result-screen budget.
- Deferred: Opus adjudication for low-confidence or malformed cases; calibration batches; human-review exports.

Latency budgets:

- Start session: <700 ms.
- Objective answer submit: <500 ms p95 excluding network.
- Azure read-aloud: <12 seconds or fallback.
- Single AI grading call: <8 seconds Sonnet p95 target; timeout at 15 seconds.
- Final result: <25 seconds before provisional result path.

Failure modes:

- AI timeout: save response, mark evaluation `pending`, return provisional profile if enough objective evidence exists.
- AI returns invalid JSON: retry once with a repair prompt; if still invalid, store raw output and mark `needs_review`.
- Azure failure: use existing local pronunciation fallback only for practice feedback; for placement, mark pronunciation confidence low rather than pretending cloud evidence exists.
- Network loss mid-test: resume session; if current item cannot be reconstructed, restart that modality block without double-counting.
- User denies mic: complete a non-speaking profile with `speaking.reportable=false`.
- Storage upload fails: skip audio modality and continue; core placement survives.
- Prompt injection in learner answer: model prompt explicitly treats learner text as data; output schema validation rejects instruction-following artifacts.

## 8. Storage Schema

Recommendation: create new v3 tables. Do not extend v2 tables in place. v2 is an unexposed but coherent engine; v3 has raw audio, transcripts, AI evaluations, multi-skill profiles, and retention concerns that would overload the v2 shape.

```sql
create table public.placement_sessions_v3 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  native_language text not null,
  target_language text not null,
  status text not null check (status in (
    'started', 'in_progress', 'grading', 'complete', 'provisional', 'abandoned', 'failed'
  )),
  self_rating text check (self_rating in ('beginner', 'intermediate', 'advanced', 'not_sure')),
  engine_version text not null,
  item_bank_version text not null,
  profile_id uuid,
  objective_theta numeric,
  objective_se numeric,
  scoring_trace jsonb not null default '{}'::jsonb,
  failure_reason text,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.placement_responses_v3 (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.placement_sessions_v3(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  seq int not null,
  modality text not null,
  task_type text not null,
  item_id text,
  prompt_ref text,
  prompt_payload jsonb not null default '{}'::jsonb,
  response_text text,
  response_json jsonb not null default '{}'::jsonb,
  audio_storage_path text,
  transcript text,
  azure_result jsonb,
  ai_evaluation jsonb,
  deterministic_score jsonb,
  confidence numeric,
  status text not null check (status in ('recorded', 'graded', 'pending', 'failed', 'needs_review')),
  shown_at timestamptz,
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  unique (session_id, seq)
);

create table public.placement_profiles_v3 (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.placement_sessions_v3(id) on delete cascade,
  native_language text not null,
  target_language text not null,
  overall_cefr text not null,
  overall_confidence numeric not null,
  skill_profile jsonb not null,
  strengths jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  l1_interference_flags jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  report jsonb not null,
  created_at timestamptz not null default now()
);

create table public.placement_diagnostic_lesson_map (
  id uuid primary key default gen_random_uuid(),
  map_version text not null,
  source_pair text not null,
  diagnostic_code text not null,
  target_skill text not null,
  cefr_min text not null,
  cefr_max text not null,
  lesson_candidates jsonb not null,
  explanation_templates jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (map_version, source_pair, diagnostic_code, target_skill)
);
```

RLS:

- Users can `select` their own sessions, responses, and profiles.
- Users can insert/update only through edge functions, not direct browser writes, for assessment integrity.
- Admin level 9 can read all for QA/calibration.
- Teacher-review role can read anonymized response exports only if Chau approves that workflow.
- `placement_diagnostic_lesson_map` can be publicly readable if it contains no sensitive scoring keys, but admin-only write.

Retention policy:

- Store raw text responses indefinitely unless user deletes account; they are product learning history.
- Store raw audio for 30 days by default, then delete or replace with derived features/transcripts. Keep longer only for opt-in calibration.
- Store Azure phoneme JSON and derived scores for history because they are small and useful.
- Calibration set should be explicit opt-in: `calibration_consent_at`, not hidden in generic terms.

Coexistence:

- v1 `user_placements` remains historical.
- v2 tables remain for engine/item-bank reuse and possible back-compat, but v3 writes its own profile.
- `profiles.placement_*` can point to latest placement across versions after v3 launch, but source must be recorded: `placement_source='v3'`.

## 9. v2 Reuse Decision

### Option A: Extend v2's IRT machinery as the quantitative backbone

Arguments for:

- v2 already has a serious server-side design: item-bank validation, answer-key hiding, 2PL math, EAP/MLE estimation, adaptive item selection, termination, response scoring, result assembly, and browser flow types.
- The code is test-heavy and pure in the right places. That is rare and valuable.
- Objective items are still useful. Open-response AI grading is powerful but noisy; a small IRT spine gives stability, speed, and a fallback when AI/audio fails.
- DET itself combines adaptive IRT-style sections with non-adaptive writing/speaking engines and weighted aggregation. Hybrid is not a compromise; it is the industry pattern.
- v2's L1-tag nudge is directly aligned with MercyBlade's moat.

Arguments against:

- v2's item types are MC-heavy and not designed for a conversational/multi-modal UX.
- Its per-skill model is reading/listening/grammar/vocabulary/writing-sample, not the final S/L/R/W output Chau wants.
- It was gated and never exposed, so no empirical calibration data exists.
- Extending the v2 tables directly could create a confusing half-v2, half-v3 schema.

### Option B: Go fully AI-native and retire v2 entirely

Arguments for:

- Simpler mental model: every task is graded by AI and the final profile is just rubric aggregation.
- Faster to prototype a polished demo.
- Better aligned with conversational UX and Mercy persona.
- Avoids spending time authoring/calibrating IRT item parameters.

Arguments against:

- Higher cost and latency per test.
- More vulnerability to model drift, JSON failures, and inconsistent grading.
- Harder to explain confidence without a calibrated objective backbone.
- Throws away tested code that solves real assessment problems.
- Makes offline/provisional degradation weaker.

### Recommendation

Choose **Option A: reuse v2 as the quantitative backbone, but do not extend v2's UX or tables directly**. The architecture should be "v3 session shell + v2 objective engine module + AI grading modules." This keeps the strongest part of v2, avoids inheriting v2's MC-only product shape, and gives MercyBlade a credible assessment core instead of a pure LLM demo. Retire v2's unmounted pages after v3 ships, but keep the engine pieces that v3 imports or ports.

## 10. Phasing

This is a realistic 12-week build plan for a single founder plus AI agents. It assumes no high-stakes certification claims, only product placement and recommendations.

### Phase 1, weeks 1-2: Foundation + one modality

Deliverables:

- v3 design finalization and task inventory.
- New v3 schema migration and RLS.
- `placement-session-v3` edge function skeleton.
- AI grading adapter with strict JSON schema.
- One complete modality: short writing task scored by Sonnet and stored in `placement_responses_v3`.
- Admin/debug page or SQL view for inspecting grading traces.

Acceptance criteria:

- A signed-in test user can complete one writing task and receive a stored rubric evaluation.
- Invalid AI JSON is caught and retried once.
- RLS prevents users from reading others' sessions.
- Cost logging records model, tokens, latency, and status.

Estimated PRs: 5-7.

### Phase 2, weeks 3-6: Additional modalities + conversational shell

Deliverables:

- Objective adaptive core wired from v2 engine or ported into v3 shell.
- Read-aloud flow using existing Azure phoneme function.
- Listening summary task with hidden transcript/key-point grading.
- Conversation-with-Mercy assessment shell with constrained follow-up prompts.
- Mobile-first UI for intro, tasks, recording, progress, and provisional result.

Acceptance criteria:

- Complete end-to-end session with objective, speaking, writing, listening, and conversation evidence.
- Mic-denied path completes with honest partial profile.
- AI timeout path returns provisional result.
- Audio upload/storage references work on mobile Safari/Chrome.

Estimated PRs: 10-14.

### Phase 3, weeks 7-10: Integration, recommendations, multi-skill output

Deliverables:

- Multi-dimensional CEFR profile assembly.
- Diagnostic-to-lesson map for VI→EN top 30-50 gaps.
- Result page with S/L/R/W bands, confidence, strengths, gaps, and recommended lessons.
- Pair-aware routing for VI→EN and EN→VI first pass.
- Profile writeback to `profiles.placement_*` latest fields.
- Analytics: started, completed, abandoned, provisional, recommendation clicked, converted.

Acceptance criteria:

- Result recommendations always point to existing accessible lessons.
- At least 30 VN-specific diagnostic codes map to lesson candidates.
- A learner with weak speaking but stronger reading sees split-skill output, not a flattened misleading level.
- Free-tier conversion CTA appears after value delivery, not before results.

Estimated PRs: 8-12.

### Phase 4, weeks 11-12: Polish, calibration, launch

Deliverables:

- Human-teacher calibration set and review workflow.
- Prompt/rubric iteration based on disagreements.
- Cost dashboard and kill switches.
- Abuse/rate limits and retake policy.
- Draft launch copy and support FAQ.
- Gradual rollout behind feature flag.

Acceptance criteria:

- At least 100 completed beta sessions, with 30-50 human-reviewed samples.
- AI skill estimates within target tolerance on calibration set.
- p95 complete result under 25 seconds or provisional path works.
- No P0 mobile UX issues at 375-414 px.
- Feature flag can disable v3 without breaking existing app.

Estimated PRs: 6-9.

Total estimated PRs: 29-42.

## 11. Risks & Unknowns

### Technical risks

1. **AI grading reliability**: LLM rubrics may drift or over-score fluent but inaccurate responses.
2. **Latency**: multi-modal grading may exceed the user's patience on mobile.
3. **Audio quality**: cheap microphones, background noise, iOS permissions, and codec conversion can reduce speaking evidence.
4. **Calibration gap**: without human grades, CEFR labels may be persuasive but wrong.
5. **Schema complexity**: v3 can become a second assessment platform if response traces, profiles, and recommendations are not tightly owned.

### Product risks

1. **Completion rate**: free users may not finish a 5-8 minute test unless the value is clear.
2. **Trust**: users may distrust AI scoring if the result feels generic or too flattering.
3. **Conversion timing**: pushing paid too early will make the test feel like a trap.
4. **Result anxiety**: low scores can discourage learners if copy is not careful.
5. **Recommendation quality**: if recommended lessons feel unrelated, the whole test loses credibility.

### Spikes before phase 1

- AI grading spike: 20 real or synthetic Vietnamese-learner writing/speaking samples scored by Sonnet and Opus, compared manually.
- Audio spike: read-aloud recording on iOS Safari, Android Chrome, and desktop; measure upload, Azure result, and failure modes.
- Cost spike: run 100 simulated full sessions through expected prompts and measure token cost.
- Recommendation spike: map 20 existing L1 diagnostic tags to real lesson IDs and verify the content actually repairs the gap.

### Cost risk

The key risk is not Azure; it is LLM output and repeated retries. A naive design that sends the entire session transcript to Opus after every task could turn placement into a loss leader. The design should grade per response with Sonnet, aggregate compact evidence once, and reserve Opus for audits.

## 12. Cost Model

Assumptions for estimate:

- Sonnet 4.6 production grading.
- Opus 4.7 used on 10% of sessions for adjudication/calibration, not every session.
- Per full test: 4 AI grading calls plus one final aggregation.
- Average tokens per full test: 12,000 input tokens and 3,000 output tokens on Sonnet.
- Opus audit on 10%: 8,000 input and 2,000 output tokens per audited test.
- Anthropic listed prices: Sonnet 4.6 at $3 input / $15 output per million tokens; Opus 4.7 at $5 input / $25 output per million tokens [Anthropic model overview](https://platform.claude.com/docs/en/about-claude/models/overview).
- Azure pronunciation: assume 90 seconds of assessed audio per completed test. Microsoft bills pronunciation assessment at baseline Speech to Text rates, in second increments; use a planning placeholder of **$1/audio hour** until Chau confirms the exact Azure region calculator price [Microsoft docs](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment), [Azure Speech pricing page](https://azure.microsoft.com/en-us/pricing/details/speech/).

Per-test estimate:

| Component | Calculation | Cost |
|---|---:|---:|
| Sonnet input | 0.012 MTok × $3 | $0.036 |
| Sonnet output | 0.003 MTok × $15 | $0.045 |
| Opus audit amortized | 10% × ((0.008 × $5) + (0.002 × $25)) | $0.009 |
| Azure pronunciation | 1.5 min / 60 × $1 | $0.025 |
| Storage + misc | small buffer | $0.005 |
| **Estimated total** |  | **$0.12/test** |

At 1,000 tests/month:

- AI + Azure: about **$120/month**.
- If only 3% convert to $4/month Basic equivalent, 30 conversions produce $120 MRR. At $8/month Premium equivalent, 15 conversions covers test cost.

At 10,000 tests/month:

- AI + Azure: about **$1,200/month**.
- At 3% conversion to $4/month, 300 conversions produce $1,200 MRR. At $8/month, 150 conversions covers test cost.

This is acceptable if placement improves conversion. It is not acceptable if the test is offered repeatedly without retake limits. Free users should get one full v3 result, then retakes after a cooldown or after meaningful study progress.

## 13. Calibration Methodology

Accuracy target:

- Initial launch target: **within ±0.5 CEFR band per skill for 70% of reviewed samples**, and within ±1 band for 90%.
- Mature target: **±0.5 CEFR for 80%** per skill after enough human-graded data.
- Do not claim certification-grade accuracy. This is placement and lesson routing.

Human grading plan:

1. Collect beta sessions from consenting users.
2. Export anonymized response packets: prompt, response, transcript, audio if consented, AI rubric, hidden profile.
3. Hire 2 Vietnamese English teachers or IELTS/VSTEP tutors for independent skill ratings.
4. Chau can review product voice and Vietnamese-specific diagnosis, but should not be the only CEFR rater; founder-only calibration creates bias and bottleneck.
5. For disagreements larger than one CEFR band, use a third adjudicator or Opus 4.7 audit as a secondary signal, then inspect rubric failure.

Metrics:

- Exact skill-band agreement.
- Within-0.5 and within-1 CEFR agreement.
- Weighted kappa or adjacent agreement for ordinal bands.
- Bias by skill: AI over/under-scoring Speaking, Writing, Listening, Reading.
- Bias by level: especially A1/A2 and B2/C1 boundaries.
- Recommendation validation: teacher says "yes/no" whether the top lesson is appropriate.

Calibration loop:

- Week 1 beta: 30 sessions, manually inspect all.
- Week 2 beta: 100 sessions, human grade 50.
- Launch: continue sampling 5-10% of completed sessions with consent.
- Update prompts only with before/after calibration reports; do not tune by anecdote.
- Version every rubric and model. A profile must know which rubric produced it.

## 14. Open Questions

These require Chau's product judgment before phase 1 starts.

1. **Audio retention**
   - Option A: delete raw audio after 30 days; keep transcript/features.
   - Option B: keep audio longer for consenting calibration users.
   - Trade-off: A is privacy-safer and easier to explain; B improves pronunciation calibration.

2. **Free retake policy**
   - Option A: one full test free, retake after 14 days.
   - Option B: unlimited retakes.
   - Option C: one free full result, paid users get more frequent retakes.
   - Trade-off: unlimited retakes increases cost and gaming; paid-gated retakes may feel harsh if framed badly.

3. **Accuracy threshold for launch**
   - Proposed: launch when human comparison reaches ±0.5 CEFR on 70% of samples and no systematic harmful bias.
   - Trade-off: waiting for 80-90% delays launch; launching earlier risks trust.

4. **Result strictness**
   - Option A: encouraging but strict CEFR labels.
   - Option B: softer labels with wider confidence.
   - Trade-off: strict labels earn trust with serious learners; softer labels reduce discouragement but can feel vague.

5. **Conversion placement**
   - Option A: show full diagnostic first, then paid CTA under recommendations.
   - Option B: blur advanced detail behind paid.
   - Trade-off: A demonstrates value and fits outcomes-first; B may convert some users but risks making the assessment feel like bait.

6. **Teacher calibration source**
   - Option A: Chau recruits Vietnamese IELTS/VSTEP teachers.
   - Option B: use online ESL raters.
   - Option C: mix both.
   - Trade-off: Vietnamese teachers better understand L1 interference; external raters reduce local bias.

7. **Pair coverage at launch**
   - Option A: launch VI→EN only.
   - Option B: include EN→VI partial placement.
   - Trade-off: A is deeper and aligned with 95% effort; B proves matrix architecture but increases scope.

8. **Use of Opus in production**
   - Option A: Sonnet-only live, Opus audit offline.
   - Option B: Opus adjudicates low-confidence live sessions.
   - Trade-off: B improves quality but raises cost and latency.

9. **How prominently to compare to DET**
   - Recommendation: internally use "DET-class"; externally say "AI placement test for Vietnamese learners" unless legal/brand review says comparison is safe.
   - Trade-off: DET positioning is clear to Chau and builders; public comparison may invite the wrong high-stakes expectation.

10. **Human review consent wording**
    - The product needs exact Vietnamese copy explaining that anonymized answers may be reviewed to improve scoring.
    - Trade-off: explicit consent may reduce calibration pool; hidden review damages trust.

## Sources

- Council of Europe, CEFR descriptors and Companion Volume: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors and https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4
- Duolingo English Test administration and scoring report: https://duolingo-papers.s3.us-east-1.amazonaws.com/reports/Duolingo_whitepaper_test_scoring_current.pdf
- Duolingo English Test item scoring overview: https://testcenter.zendesk.com/hc/en-us/articles/39104960626189-How-the-Items-Are-Scored
- EvalYaks CEFR speaking assessment with LLMs: https://arxiv.org/abs/2408.12226
- Anthropic Claude model overview and pricing: https://platform.claude.com/docs/en/about-claude/models/overview
- Microsoft Azure Pronunciation Assessment: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment
- Azure Speech pricing page: https://azure.microsoft.com/en-us/pricing/details/speech/
