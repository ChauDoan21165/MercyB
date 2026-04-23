# Placement Test — Text Wireframes

**Status:** approved by Chau, Step B complete.
**Source:** CC's wireframe proposal + Chau's revisions A–D and answers to design questions 1–6.
**Purpose:** reference document for Step D (UI build) and any future redesigns.

All screens are mobile-first (target 375 px). Desktop widens padding and allows 2-column grids on the branch screen; otherwise layouts are identical.

Visual tokens (already in the app):

- Card: white background, 1 px border `rgba(0,0,0,0.10)`, `border-radius: 18px`, soft drop shadow.
- Primary button: dark pill (`#111827`), white text, 48 px min height.
- Ghost button: white background, 1 px border `rgba(0,0,0,0.14)`, dark text.
- Body font: system sans.
- Max content width: 960 px centered (matches `AccountPage` `maxWidth: 980`).

Bilingual copy pattern everywhere: English on top, Vietnamese directly below in lighter slate (`#94a3b8`). Matches the existing `BiLabel` helper.

---

## Screen 1 — Welcome / intro

**Route:** `/placement`
**Entry:** immediately after signup completes (session set).

### Layout (top → bottom)

1. App header band (existing router shell — rainbow-M + wordmark + Account link).
2. Centered column, max 520 px wide, 32 px top padding:

   **Big heading** (28 px mobile / 36 px desktop, `fontWeight: 950`):
   > **Let's find where you should start**
   > *Hãy tìm điểm bắt đầu phù hợp cho bạn*

   **Subtitle** (16 px, slate `#475569`, max 440 px):
   > A short test will show us your English level and point you at the first lesson that fits — no guessing.
   > *Một bài đánh giá ngắn sẽ cho chúng tôi biết trình độ của bạn và giới thiệu bài học đầu tiên phù hợp — bạn không phải tự đoán.*

3. **"What to expect" card** (18 px radius, 20 px padding):

   ```
   ⏱  About 6–9 minutes
       Khoảng 6–9 phút

   📝  10–12 questions (fewer or more based on your answers)
       10–12 câu hỏi (có thể ít hoặc nhiều tuỳ câu trả lời)

   🇻🇳  Bilingual support — English + Vietnamese throughout
       Song ngữ — Tiếng Anh + Tiếng Việt suốt bài
   ```

4. **Primary CTA** (full-width pill, 48 px min):
   > **Start placement test**
   > *Bắt đầu đánh giá*

5. **Skip link** (ghost-text style, centered, 14 px):
   > Skip for now — I'll explore on my own
   > *Bỏ qua — để tôi tự khám phá*

### Reference

Matches `AccountPage` card styling. Feels like a brand-new `AccountPage` card centered on a blank white page.

---

## Screen 2 — "Who is this account for?"

**Route:** `/placement/who`
**Entry:** only reached by tapping **Start placement test** on Screen 1.

### Layout

1. App header (unchanged).
2. Centered column:

   **Heading:**
   > **Who is this account for?**
   > *Tài khoản này là của ai?*

3. **Two branch cards.** Stacked on mobile; 2-column on desktop (≥640 px).

   **Card A — Adult**

   ```
   🧑  Me — an adult learner
       Mình — người lớn đang học

   Short test, 6–9 minutes, gives you a CEFR level
   and a recommended starting lesson.
   Bài đánh giá ngắn, 6–9 phút, cho bạn trình độ CEFR
   và bài học nên bắt đầu.
   ```

   **Card B — Child**

   ```
   👧  My child (ages 4–10)
       Con của mình (4–10 tuổi)

   Kids skip the test and go straight to fun
   beginner rooms — alphabet, colors, animals.
   Trẻ em bỏ qua bài đánh giá và vào thẳng các phòng
   khởi đầu vui — bảng chữ cái, màu sắc, động vật.
   ```

   Each card: entire card is the tap target, 100–140 px tall, subtle border highlight on hover/press.

4. **Back link** (ghost-text, bottom-left, 14 px):
   > ← Back · *← Quay lại*

### Branching behavior

- Tap **Card A** → `/placement/test` (Screen 3 flow).
- Tap **Card B** → write an audit row to `user_placements` with

  ```
  placement_method    = 'self_report_kid'
  cefr                = 'pre_a1'
  recommended_room_id = 'alphabet_adventure_kids_l1'
  ```

  Also set matching fields on `profiles`. Then navigate to `/room/alphabet_adventure_kids_l1`. No questions asked.

### Reference

Like the Pricing page plan cards — tappable, large, clear primary-action area.

---

## Screen 3 — Question card (multiple-choice variant)

**Route:** `/placement/test` (state-driven; questions don't get their own URLs).
**Entry:** from Screen 2 Card A, or from any other question's Next button.

### Layout (top → bottom)

1. **Progress strip** (sticky under app header, 16 px tall block):

   ```
   ▓▓▓▓▓▓▓░░░░░░░░░  Question 5 of ~12
                     Câu 5 / ~12
   ```

   - Bar: 4 px tall, rounded, emerald `#10b981` fill on slate `#e2e8f0` track.
   - Label: 11 px uppercase, centered.
   - **Revision A**: no "Skip test" link. The progress strip is progress + count only. See § Skip flow.

2. **Prompt block** (centered card, max 560 px wide, 24 px padding).

   **Instruction label** (12 px uppercase, slate-500):
   > Choose the best answer · *Chọn đáp án đúng nhất*

   **Sentence with blank** (20–22 px, `fontWeight: 700`):
   > She ___ English every day.

   **Vietnamese stem translation** (14 px, slate-400):
   > *She ___ English every day.*

   For fill-in items where `prompt.en === prompt.vi`, UI may render both lines the same or suppress the duplicate — keep both for consistency with reading questions.

3. **Option list** — 4 cards stacked on mobile, 2×2 grid on desktop (≥640 px).

   Each option card:
   - 72 px min height, full-width (mobile) or 48 % width (desktop).
   - Letter badge (a/b/c/d) in a 32 px circle, slate-100 background.
   - Option text: 16–18 px, medium weight.
   - Border 1 px slate-200. Selected state: 2 px emerald-500 border + emerald-50 fill.
   - Tap target: entire card.

   ```
   ( a )  study
   ( b )  studies        ← selected
   ( c )  studying
   ( d )  studied
   ```

4. **Next button** (bottom, full-width pill, 48 px):
   > **Next question** · *Câu tiếp theo*

   Disabled (50 % opacity) until an option is selected. **Revision B**: the user may change their selection freely between options before tapping Next. The answer is committed only when Next is tapped. Until then, tapping another option simply replaces the selected state — no visual lockout.

### Per-question feedback

**None (Q1 answer).** Selecting an option locks it visually but does not reveal correctness. All feedback lives on the Results screen. This preserves test integrity.

### Reference

Option cards use the Pricing plan-card pattern. Overall screen feels like a lean `AccountPage` card.

---

## Screen 4 — Question card (reading-passage variant)

Same chrome as Screen 3, with a passage block inserted between the progress strip and the question prompt.

### Layout

1. Progress strip (sticky under app header; same as Screen 3).
2. **Passage card** (max 620 px, 20 px padding, slate-50 background, 18 px radius).

   **Top row:**
   > 📖 Read the passage · *Đọc đoạn văn sau*

   **Show/Hide Vietnamese toggle** (ghost, pill, 11 px label).
   - Default (Q2 answer): **Hidden**.
   - When the user taps **Show Vietnamese** the VI translation appears in 14 px slate-400 below the English passage.
   - The engine logs `vi_revealed = true` on that question's response (see Step E persistence). `false` otherwise.

   **English passage** (15–16 px, line-height 1.6, slate-900, no inner scroll):
   > Many young people in Vietnam are learning English to find better jobs...

   **Vietnamese translation** (conditional, 14 px, slate-400).

3. **Prompt block** — same style as MC.
4. **Option list** — 4 cards, always stacked (never 2×2 for reading, even on desktop).
5. **Next button** — same as MC, sticky at the bottom of the viewport.

### Revision C — no inner scroll on passage

The passage card expands fully in the document flow. The whole page scrolls naturally. Progress strip stays sticky under the app header; Next button stays sticky at the bottom of the viewport. Passage text scrolls between them with normal page scroll.

Inner scroll on a sticky card is historically janky on iOS Safari (nested sticky + touch scroll conflicts). Avoid in v0. Revisit if UX testing on iPhone shows the natural-scroll feel is worse.

---

## Screen 5 — Progress indicator (persistent)

Described inside Screens 3 and 4 for context. Standalone spec here for reuse during the build.

**Structure** — 16 px tall strip, sticky under the app header across the entire `/placement/test` route.

```
┌──────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░  Question 5 of ~12       │
│                         Câu 5 / ~12              │
└──────────────────────────────────────────────────┘
```

- **Bar**: 4 px tall, rounded ends. Fill = `questionsAnswered / estimatedTotal`. `estimatedTotal` starts at 12 and can be revised down to 8 if the adaptive engine converges early. Tilde in the label signals approximation.
- **No skip link here** (Revision A). At question 8+, a **Finish early** ghost button may appear in a secondary row below the progress strip — see § Finish-early flow.
- **Never display the running CEFR estimate** — that would let test-takers meta-game.

### Finish-early flow (Q8+)

From question 8 onward (the adaptive engine's minimum), a small secondary row below the progress strip shows:

> **Finish early** · *Kết thúc sớm*

Ghost button, 36 px height, right-aligned. Tapping it **commits the current CEFR estimate** and routes to the Results screen. Different from Skip (which discards the session).

If the user insists on abandoning before Q8, closing the tab or hitting the browser back button is the only path (see § Skip flow).

---

## Screen 6 — Results screen

**Route:** `/placement/results`
**Entry:** after the final question of the adaptive run, or after Finish Early at Q8+.

### Layout (top → bottom)

1. App header (existing shell).

2. **Celebratory banner** (matches Home's warm `#FFF8F3` surface):
   > **Here's what we found**
   > *Đây là kết quả của bạn*

   Subline (14 px slate-600):
   > Based on your answers. You can retake anytime.
   > *Dựa trên câu trả lời của bạn. Bạn có thể làm lại bất cứ lúc nào.*

3. **"Your level" card** (white, 18 px radius, 24 px padding).

   Tiny label (12 px uppercase slate-500):
   > Your level · *Trình độ của bạn*

   **Huge level** (56 px, `fontWeight: 950`, emerald or level-tinted):
   > **A2**

   **Bilingual warm subtitle** (Q3 answer):
   - EN (18 px, `fontWeight: 700`): `Elementary — solid foundation`
   - VI (14 px slate-400): `Sơ cấp — nền tảng đã vững`

   Apply analogous warm framing per level — do not use "Pre-intermediate" style, do not use Duolingo-cute:

   | CEFR | EN tagline | VI tagline |
   |---|---|---|
   | pre_a1 | `Absolute beginner — a clean start` | `Mới hoàn toàn — một khởi đầu sạch sẽ` |
   | A1 | `Beginner — first words and phrases` | `Sơ khởi — từ vựng và câu đầu tiên` |
   | A2 | `Elementary — solid foundation` | `Sơ cấp — nền tảng đã vững` |
   | B1 | `Intermediate — conversational confidence` | `Trung cấp — tự tin giao tiếp` |
   | B2 | `Upper intermediate — fluent and flexible` | `Trung cấp cao — trôi chảy và linh hoạt` |
   | C1 | `Advanced — command and nuance` | `Cao cấp — làm chủ và tinh tế` |
   | C2 | `Proficient — near-native precision` | `Thành thạo — gần như bản ngữ` |

   One-sentence description below (15 px slate-600, max 440 px), level-specific:
   > You can handle simple past-tense conversations and short everyday texts. Next up: present perfect, basic conditionals, and richer vocabulary.
   > *Bạn có thể xử lý hội thoại quá khứ đơn và các đoạn văn ngắn hàng ngày. Bước tiếp theo: thì hiện tại hoàn thành, câu điều kiện cơ bản và vốn từ phong phú hơn.*

4. **"Start here" card** (white card, emerald accent border).

   Tiny label:
   > Recommended starting lesson · *Bài học đầu tiên gợi ý*

   Room title (20 px, `fontWeight: 800`):
   > Present Perfect — Experiences
   > *Thì hiện tại hoàn thành — kinh nghiệm*

   Short description (14 px slate-600, 2 lines max, pulled from room JSON):
   > Learn to say what you've done and where you've been using "have / has + past participle".
   > *Học cách nói những gì bạn đã làm và những nơi bạn đã đến với "have / has + phân từ II".*

   **Primary CTA** (full-width pill):
   > **Start this lesson** · *Bắt đầu bài học*

5. **Secondary options row** (two ghost buttons, 50/50 on mobile):
   - **See other lessons at A2** · *Xem các bài khác ở A2*
   - **Retake test** · *Làm lại*

6. **Small stats footer** (Revision D — time removed):
   > 11 questions · 23 April 2026
   > *11 câu · 23/04/2026*

### Reference

Level card uses the big-number treatment from `AccountPage` `valueStyle`. "Start here" card uses the primary-CTA pattern from `Billing` plan cards.

---

## Screen 7 — Skip flow

### Where skip is reachable (Revision A applied)

1. **Welcome screen** (Screen 1) — "Skip for now" ghost text link.
2. **During the test** — **no** skip link on Screens 3 and 4 for questions 1–7.
3. **From question 8 onward** — **Finish Early** button on Screen 5. Different from Skip (commits current estimate; does not discard session).
4. **Browser back button mid-test** — triggers skip confirmation modal (escape hatch preserved).

A user who truly needs to bail out at question 3 can close the tab. We don't need to make it easy.

### Skip confirmation modal

Shown when skip is requested on Screen 1 or via browser back during the test. Uses the existing shadcn `Dialog` component (matches tone of `GiftCodeModal`).

**Title** (20 px, `fontWeight: 900`):
> Skip placement test?
> *Bỏ qua bài đánh giá?*

**Body** (15 px slate-600):
> You can take it anytime from your Account page, and we'll recommend a starting lesson whenever you're ready.
> *Bạn có thể làm bất cứ lúc nào từ trang Tài khoản, và chúng tôi sẽ giới thiệu bài học phù hợp khi bạn sẵn sàng.*

**Buttons (Revision Q4)** — stacked on mobile, side-by-side on desktop:
- **Primary: Keep testing** · *Tiếp tục làm bài*
- **Ghost: Yes, skip** · *Vâng, bỏ qua*

### Skip confirmed behavior

- No writes to `profiles.placement_*`.
- No row in `user_placements`.
- Route to `/` (Home).
- Home shows a **dismissible banner** at the top of the content column (Q5 answer):
  > 🎯 Take the placement test to see where to start · *Làm bài đánh giá để biết nên bắt đầu từ đâu* · [ Take test → / Làm bài → ]
- Dismissal stored in `localStorage.mb.placement.banner.dismissed`. **Not persisted to Supabase** — cheap UX nudge, not worth a round-trip.
- Permanent home for the feature is the **Retake button on Account** (Screen 8).

---

## Screen 8 — Retake flow

### Entry point

`AccountPage` actions row gets one new button, between **Pricing** and **Redeem gift code**:

```
[ Refresh entitlements ]
[ Billing ]
[ Manage billing ]
[ Pricing ]
[ Take placement test ]     ← new
[ Redeem gift code ]
[ Sign out ]
```

### Label logic

- If `profiles.placement_completed_at IS NULL`:
  > **Take placement test** · *Làm bài đánh giá*
- Else:
  > **Retake placement test** · *Làm lại bài đánh giá*
  > with a 12 px subtext: `Last taken: 22 Apr 2026 · result A2` · *Lần gần nhất: 22/04/2026 · kết quả A2*

### Tap behavior

- **Retake** (placement already completed): shows a small confirm modal:
  > Your previous result will be kept in your history, but the recommended lesson will be updated. Continue?
  > *Kết quả cũ vẫn được lưu trong lịch sử, nhưng bài học gợi ý sẽ được cập nhật. Tiếp tục?*
  - Primary: **Continue** · *Tiếp tục*
  - Ghost: **Cancel** · *Huỷ*

- **Confirmed (or first time taking)**: routes to `/placement` (Screen 1).

### History

Every completed session writes to `user_placements` (append-only audit). `profiles.placement_*` fields always reflect the latest completed result. No UI for viewing history in v0 — reserved for a later feature.

---

## Engine-facing notes (for Step C)

- **Per-question feedback: off** (Q1 answer). Engine returns only correctness to internal scoring, never surfaces it to the UI.
- **Vietnamese reveal logging** (Q2 answer): reading questions record `vi_revealed: boolean` in the per-question response. Stored in `user_placements.question_responses` JSONB.
- **Skip is not a commit path** — only Finish Early (Q8+) or full completion write results.
- **Kid branch writes** a `user_placements` row with `placement_method = 'self_report_kid'` for audit consistency (Q6 answer).
- **Adaptive engine** targets ~12 questions, minimum 8, maximum 15. Details in `src/lib/placement/engine.ts`.
