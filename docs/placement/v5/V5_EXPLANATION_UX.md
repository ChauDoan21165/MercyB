# V5 Explanation UX

> Discovery draft — C1/C2 prioritization required before any implementation.
> How V5 explains adaptive recommendations, confidence, and uncertainty to learners.
> Vietnamese-first, outcomes-over-engagement, no dark patterns.

---

## 1. Design Philosophy

### 1.1 The Explanation Spectrum

V5 explanations span a spectrum from **implicit** (the UI itself communicates the message) to **explicit** (a bilingual text explanation). The rule: prefer implicit when the meaning is visually obvious; use explicit when the learner might otherwise feel confused or manipulated.

| Level | Mechanism | Example |
|-------|-----------|---------|
| **Implicit** | Layout, ordering, visual weight | The top day card is larger — that's today's focus. No text needed. |
| **Subtle** | Single-line bilingual label | "Hôm nay: Nghe hiểu" / "Today: Listening" |
| **Explicit** | 2–3 sentence card | "Tuần này mình tập trung vào kỹ năng nghe vì điểm nghe của bạn đang thấp hơn các kỹ năng khác." |
| **Detailed** | Expandable section | Full breakdown of why each recommendation was chosen, only on tap. |

### 1.2 Forbidden Explanation Patterns

- ❌ **Numeric scores shown to learners.** "Your speaking is 3.2/6.0" — never. Use CEFR levels (A1–C2) and qualitative direction.
- ❌ **Comparative language.** "You're behind 70% of learners" — never. All comparisons are self-referential ("since last month").
- ❌ **Blame language.** "You missed 4 days" → use "Đã 4 ngày rồi — học một bài ngắn nhé?" / "It's been 4 days — try a quick lesson?"
- ❌ **Telemetry vocabulary leakage.** Words like "churn risk", "burnout score", "confidence interval", "provider trust tier", "quarantine" never appear in learner-facing UI. The `<LearnerDiagnosticsCard>` already enforces this via `FORBIDDEN_VOCAB` guard.
- ❌ **False precision.** "You have a 73.4% chance of reaching B1 by September" — no. Use qualitative: "Bạn đang đi đúng hướng để đạt B1" / "You're on track for B1."
- ❌ **Empty reassurance.** "You're doing great!" with no basis. Every positive message must be tied to observable evidence from the learner's own data.

---

## 2. Confidence Visualization

### 2.1 Per-Skill Confidence

Current V3 shows per-skill CEFR level but not confidence. V5 adds a simple visual:

**Design:** 5 filled/empty dots per skill. 5 dots = highest confidence (recent, consistent evidence). 1 dot = lowest (old observation, due for refresh).

```
Speaking   ● ● ● ○ ○   B1 — fairly confident
Listening  ● ● ○ ○ ○   A2 — due for a check
Reading    ● ● ● ● ○   B1 — confident
Writing    ● ● ● ○ ○   A2 — moderately confident
Conversation ● ○ ○ ○ ○  A2 — very uncertain, try a quick chat?
```

**Rules:**
- Dots are derived from `confidence` (0–1) rounded to nearest 0.2.
- Never show the raw number (0.73). Only dots.
- When confidence drops below 3 dots, add a subtle "Làm mới" / "Refresh" nudge next to that skill.
- The nudge links to a quick speaking/listening/reading activity, not a full re-test.

### 2.2 Confidence Decay Awareness

When an observation is old (e.g., speaking last assessed 45 days ago), the dots visibly fade. A gentle label appears: "Đã 45 ngày — làm một bài ngắn để cập nhật nhé?"

**Implementation:**
```
decayConfidence(skill.confidence, lastObservedAt, now, halfLifeDays=30)
→ if decayedConfidence < 0.4: show refresh nudge
→ visual: dots fade from solid to outline as confidence decays
```

---

## 3. Recommendation Explanations

### 3.1 Study Plan Explanations

Each day in the curriculum plan has a "Why this day?" expandable section (collapsed by default):

| Plan Element | Explanation Pattern |
|-------------|-------------------|
| **Focus skill** | "Hôm nay tập trung vào [skill] vì đây là kỹ năng bạn cần cải thiện nhất hiện tại." / "Today focuses on [skill] because it's your current growth area." |
| **Review activity** | "Ôn lại bài [title] — bạn đã học bài này cách đây [N] ngày. Ôn tập giúp nhớ lâu hơn." / "Reviewing [title] — you studied this [N] days ago. Spaced review strengthens memory." |
| **Challenge day** | "Hôm nay là ngày thử thách — bài khó hơn một chút để bạn tiến bộ nhanh hơn." / "Challenge day — slightly harder material to accelerate your progress." |
| **Light day** | "Hôm nay học nhẹ nhàng thôi — 2 bài là đủ rồi. Ngày mai mình tiếp tục nhé." / "A lighter day — 2 lessons is plenty. We'll continue tomorrow." |
| **Speaking day** | "Hôm nay có bài luyện nói — đừng lo, mình luyện từng chút một." / "Speaking practice today — no pressure, step by step." |

### 3.2 Intervention Explanations

When the adaptive system adjusts the plan (fewer activities, different focus), explain why — gently:

| Intervention | Explanation (VI first, then EN) |
|-------------|--------------------------------|
| **Reduced daily count (burnout)** | "Hôm nay mình giảm số bài xuống còn 2 bài — học ít mà chất lượng thì tốt hơn." / "We've trimmed today to 2 lessons — quality over quantity." |
| **Speaking prompt (avoidance)** | "Đã mấy ngày rồi bạn chưa luyện nói — làm một bài ngắn nhé? Không cần hoàn hảo đâu." / "It's been a few days since you practiced speaking — try a short one? No need to be perfect." |
| **Re-engagement (churn risk)** | "Có một bài học mới mà mình nghĩ bạn sẽ thích — xem thử nhé?" / "There's a new lesson we think you'll enjoy — want to take a look?" |
| **Stale skill refresh** | "Đã lâu rồi bạn chưa luyện [skill] — làm một bài ngắn để mình cập nhật trình độ của bạn nhé?" / "It's been a while since you practiced [skill] — a quick refresh to update your level?" |

### 3.3 Forecast Explanations

**Pace projection:**
"Với nhịp độ học hiện tại của bạn (khoảng 3 buổi/tuần, 25 phút/buổi), bạn có thể đạt B1 vào khoảng tháng 10."

**What-if:**
"Nếu bạn học 5 buổi/tuần thay vì 3, bạn có thể đạt B1 sớm hơn — khoảng tháng 7. Nhưng quan trọng là học đều đặn, không cần vội."

**Forecast accuracy (every 30 days):**
"30 ngày qua, kỹ năng đọc của bạn tiến bộ nhanh hơn dự đoán — tốt hơn mình nghĩ! Kỹ năng nói thì đang đi đúng hướng."

---

## 4. Uncertainty Display

### 4.1 When to Show Uncertainty

| Situation | Display |
|-----------|---------|
| Single placement, no history | "Đây là kết quả dựa trên bài kiểm tra đầu tiên của bạn. Càng học nhiều, mình càng hiểu rõ trình độ của bạn hơn." |
| Old observation (> 60 days) | Faded confidence dots + refresh nudge |
| Contradictory evidence (two snapshots disagree) | "Có vẻ trình độ của bạn đang thay đổi — làm thêm một bài ngắn để mình cập nhật nhé?" |
| Low confidence from provider | No learner-facing difference — the system resolves uncertainty internally. Learners never see provider trust scores. |

### 4.2 How to Show Uncertainty

- **Never as a number.** No "65% confidence interval."
- **As a gentle invitation to refresh.** The UI offers a short activity, not a warning.
- **As a natural part of the journey.** "Mình vẫn đang tìm hiểu trình độ của bạn — mỗi bài học giúp mình hiểu rõ hơn."

---

## 5. Copy Guidelines

### 5.1 Tone

| Attribute | Rule |
|-----------|------|
| **Voice** | Warm, supportive, like a tutor who wants you to succeed — not a coach demanding performance |
| **Person** | "Mình" (we/us, inclusive) and "bạn" (you, respectful). Never "tôi" (I, formal/distant) |
| **Length** | Headlines: 4–8 words. Body: 1–2 short sentences. Never paragraphs of explanation |
| **Judgment** | Zero judgmental adjectives. "Bài này hơi khó" not "bạn làm sai nhiều" |

### 5.2 Bilingual Format

All copy follows the pattern established by `<BilingualLabel>`:
- Vietnamese line: larger, bolder, primary
- English line: smaller, lighter, secondary
- Vietnamese is always the authoritative version; English is a translation

### 5.3 Diagnostic Copy (from V4 diagnostics.ts)

The `buildLearnerDiagnostics()` function already produces bilingual `LearnerDiagnostic` objects with `headline: { vi, en }` and `body: { vi, en }`. V5 components consume these directly — no new copy authoring needed for diagnostics.

| Diagnostic Kind | VI Headline Pattern | EN Headline Pattern |
|----------------|-------------------|-------------------|
| `focus_skill_this_week` | "Tuần này, tập trung vào: [skill]" | "Focus this week: [skill]" |
| `overloaded_today` | "Hôm nay có vẻ hơi nhiều" | "Today feels a bit full" |
| `speaking_improving` | "Kỹ năng nói của bạn đang tiến bộ" | "Your speaking is improving" |
| `review_overdue` | "Đến lúc ôn lại một số bài rồi" | "Time to review some lessons" |
| `pronunciation_lagging` | "Phát âm cần thêm thời gian" | "Pronunciation needs more time" |
| `streak_recoverable` | "Đừng lo — bạn có thể quay lại bất cứ lúc nào" | "No worries — you can jump back in anytime" |

---

## 6. Accessibility Considerations

| Requirement | Implementation |
|-------------|---------------|
| **Screen readers** | All explanation text is real DOM text, not images. `aria-label` on visual-only elements (dots, radar). |
| **Color independence** | Confidence dots use filled/empty distinction, not just color. Radar uses pattern + color. |
| **Touch targets** | All tappable explanations (expandable sections, nudge buttons) ≥ 44×44px. |
| **Reduced motion** | Timeline and radar animations disabled when `prefers-reduced-motion: reduce`. |
| **Font scaling** | All copy responds to user font-size preferences. No fixed-height containers that clip text. |
| **Vietnamese typography** | Tone marks rendered correctly at all sizes. Tested on iOS Safari, Android Chrome, desktop Chrome. |

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| **Over-explaining** — too much text, learner skips | Collapse explanations by default. Show only headlines. Expand on tap. |
| **False confidence** — system sounds more certain than it is | Always qualify single-observation results. Show uncertainty as natural, not alarming. |
| **Vietnamese copy quality** — translations feel machine-generated | All V5 copy reviewed by native Vietnamese speaker before merge. No auto-translated strings. |
| **Explanation fatigue** — learner sees same messages repeatedly | Vary phrasing. Track which explanations were shown and rotate. Don't show the same nudge more than once per week. |
| **Mobile rendering** — explanations take too much vertical space | Keep explanations collapsible. Inline nudges are single-line. Full explanations are one-tap away. |
