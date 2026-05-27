# A/B variants — Stage 3 launch content kit

Variant treatments for every TikTok script, every Facebook post, and every Zalo card in the kit. **A** is the version that already shipped in [`tiktok-vn-scripts.md`](./tiktok-vn-scripts.md), [`facebook-diaspora-posts.md`](./facebook-diaspora-posts.md), and [`zalo-share-cards.md`](./zalo-share-cards.md) — kept here as a reference summary, not redefined. **B** is an alternative angle: different hook, different proof point, or different call-to-action.

Each pair documents:

- **Hypothesis** — the *one specific thing* we're testing with B (a hook style, a proof style, or a CTA style — not all three at once).
- **Success signal** — the platform-native metric that would tell us B beat A. *How* to read those signals — and the privacy boundary around reading them — is in [`measurement-plan.md`](./measurement-plan.md); *when* to commit to one variant is in [`decision-criteria.md`](./decision-criteria.md).

Variants only change **one axis** per pair. Multi-axis variants confound the read.

---

## TikTok scripts — 5 pairs

### Script 1 — *"Bạn có biết mình hay mắc lỗi gì khi nói tiếng Anh?"*

| | Treatment |
|---|---|
| **A (shipped)** | Talking-head question hook → 8 s screen recording of `/weak-at` populated → CTA `mercyblade.com/weak-at`. Hook line: *"Bạn có biết mình hay mắc lỗi gì khi nói tiếng Anh không?"* |
| **B** | **No talking-head opener.** Cold-open straight onto the populated `/weak-at` screen recording for the first 4 seconds (auto-captioned with the three section names: *Lỗi ngữ pháp · Kết quả kiểm tra · Phát âm*). Talking-head appears at 0:04–0:08 as the explainer beat. CTA unchanged. Hook line moves to mid-roll caption: *"Mở /weak-at là thấy luôn — không cần đăng nhập."* |

**Hypothesis (B):** The product surface itself is more arresting than a face on TikTok-VN. Cold-opening on the screen recording removes the parasocial-intro tax and gets the audience to the proof faster.

**Success signal:** Mean view-through duration on B exceeds A by ≥20% AND share count on B exceeds A. Likes-per-view alone is too noisy a signal at low N — we need the *time* metric to confirm the product surface, not just the hook, is what holds attention.

---

### Script 2 — *"Học xong rồi luyện gì tiếp theo?"*

| | Treatment |
|---|---|
| **A (shipped)** | Talking-head question + frustrated-scroll cutaway → 9 s screen recording of `SuggestedPracticeList` + tap-into-drill demo → CTA. |
| **B** | **CTA changes from URL-only to imperative-plus-URL.** Final 4 seconds carry an on-screen instruction: *"Chạm vào link mô tả ngay bên dưới"* + a visual arrow pointing down toward the TikTok caption area. Voiceover ends with the literal call: *"Link dưới ảnh — vào thử."* (Hook + proof unchanged.) |

**Hypothesis (B):** TikTok-VN audiences are habituated to "link in bio" but not always to a description-area URL — naming and pointing to the link affordance increases click-through despite no change in messaging.

**Success signal:** Profile-link clicks per impression on B exceeds A by ≥30%. Other engagement metrics (likes, shares, comments) expected to stay flat or near-flat — if they move, the CTA change is being confounded by some other delta in the recording.

---

### Script 3 — *"Lỗi tiếng Anh của riêng người Việt — không phải lỗi chung chung"*

| | Treatment |
|---|---|
| **A (shipped)** | Talking-head asks *"Tại sao người Việt hay quên thêm -s cho he, she, it?"* → whiteboard cutaway → screen recording of the L1 row → tap to AI Tutor. |
| **B** | **Hook re-frames from "tại sao" question to "side-by-side comparison" reveal.** First 5 seconds is a split-screen visual: left = "**Tiếng Việt:** Cô ấy đi học mỗi ngày" / right = "**Tiếng Anh:** She **goes** to school every day" with the *-s* circled and a small pulse animation. Talking-head appears at 0:05 and continues per A. The "đi học" → "goes" contrast does the hook work visually rather than verbally. |

**Hypothesis (B):** The L1-thesis is fundamentally visual — *"the verb has to change"* — and showing it lands harder than asking about it. The split-screen contrast also gives the video a TikTok-native "before/after" feel that the algorithm-rewards format prefers.

**Success signal:** Save-count on B exceeds A by ≥50%. Saves indicate the visual is worth coming back to (the "I want to remember this rule" signal). Comments containing follow-up grammar questions are a soft secondary signal — bookmark-worthy content draws clarifying replies.

---

### Script 4 — *"App học tiếng Anh có cần gửi dữ liệu lên server không?"*

| | Treatment |
|---|---|
| **A (shipped)** | DevTools Network panel direct-shown — technical credibility approach. |
| **B** | **Analogy replaces the DevTools demo for the proof beat.** No DevTools. Instead: a 8-second animation showing a phone with a "data envelope" trying to leave, hitting an invisible wall, and going back into the phone. Voiceover: *"Dữ liệu học của bạn ở trên máy của bạn — không gửi đi đâu."* Audience-broadening play; gives up the technical "you can verify this yourself" credibility in exchange for accessibility. |

**Hypothesis (B):** The DevTools demo is high-credibility for ~10% of the TikTok-VN audience (technical viewers) and confusing for the other 90%. An animation lands the *what* without the *how* and may reach a wider audience — at the cost of being un-verifiable on the surface.

**Success signal:** Overall reach (impressions) on B exceeds A by ≥2x AND comment-quality is "asks about privacy" rather than "asks what DevTools is". If B reaches more people but draws "how do I verify?" comments, that's a *good* signal — the privacy claim landed and curiosity follows. Comments asking "what's DevTools?" on B mean the script lost the technical audience without gaining the broader one.

**Caveat:** If B underperforms A, do NOT conclude "the audience doesn't care about privacy." It may just mean the DevTools framing was the right level — pin the test back to credibility-vs-accessibility, not topic interest.

---

### Script 5 — *"Không có chuỗi học. Không có XP. Chỉ ba thứ cần luyện."*

| | Treatment |
|---|---|
| **A (shipped)** | General audience — *"Cảm thấy áp lực vì chuỗi học mỗi ngày?"*. Universal-fatigue hook. |
| **B** | **Audience pivot to older / parent learners.** Hook re-targets: *"Mẹ mình học tiếng Anh năm nay — và sợ mấy app bắt vào học mỗi ngày."* Followed by the same `/weak-at` walkthrough but with the parent/older-learner framing in the voiceover. CTA softens: *"Gửi link này cho người thân đang học tiếng Anh — mercyblade.com/weak-at."* The "forward this to someone" CTA is the new test. |

**Hypothesis (B):** The audience most likely to share the anti-shame posture is the *adult-child of an older Vietnamese learner*, not the learner themselves. A "forward to your parent" CTA captures the gift-giver audience that a general "are you tired?" hook may not.

**Success signal:** Share count on B exceeds A by ≥3x. Save count secondary signal (parents-of-learners may save rather than share-publicly out of decorum). Comments containing the words "ba mẹ" / "bố mẹ" / "cô chú" / "bác" indicate the audience pivot is landing.

---

## Facebook diaspora posts — 5 pairs

### Post 1 — *"Mình hay mắc lỗi tiếng Anh nào? Bây giờ thì biết rồi."*

| | Treatment |
|---|---|
| **A (shipped)** | First-person confession opener: *"Học tiếng Anh đã nhiều năm. Vẫn cứ có lúc gặp một câu, mở miệng — và tự hỏi 'mình nói có đúng không?'"* |
| **B** | **Opens with a quoted prompt.** First two lines are a fictional-but-true quoted exchange that any diaspora reader recognizes: *"Bạn của mình — sống ở Mỹ 15 năm — bảo: 'tiếng Anh của tao đủ để đi làm, nhưng vẫn có những lỗi tao mắc đi mắc lại.' Mình hỏi: 'lỗi gì?' Bạn ấy chịu."* Then transitions into the same product description. CTA + image-pairing unchanged. |

**Hypothesis (B):** The "quoted friend" hook is a stronger thumb-stop than the founder's own confession. It lets the reader project onto the third-party character rather than feel preached to, and it sets up the diagnostic story as *"this is for people who can't answer that question"*.

**Success signal:** Average comment length on B exceeds A. Specifically: comments containing self-disclosure ("mình cũng vậy", "tôi sống ở X năm…", named-grammar-point examples) are the engagement we want. Surface-level "thanks" comments are not. Read the comment thread, not the like count.

---

### Post 2 — *"Học xong rồi luyện gì tiếp theo? Câu hỏi không ai trả lời thẳng."*

| | Treatment |
|---|---|
| **A (shipped)** | Founder voice; reflective + product-explainer mix. |
| **B** | **Learner voice — author shifts to first-person learner (not founder).** Opening line becomes: *"Tôi vừa thử /weak-at trên MercyBlade. Đây là ba điều nó nói tôi nên luyện tiếp theo:"* followed by three concrete labels from the Stage 3A taxonomy (real learner-language strings, not invented ones). The post becomes a "I tried it; here's what I got" report. Closes with: *"Không có app nào trước đây nói cho tôi cụ thể như thế."* (No fabricated outcome — only the literal observation that the suggestion was specific.) |

**Hypothesis (B):** Learner-voice testimonials read more credibly than founder-voice product explanations. The constraint: the kit-wide rule disallows fabricated testimonials. B threads the needle by being a *factual report of trying the product*, not a *claim of outcome from using it*. The reader infers value; the post doesn't claim it.

**Success signal:** Click-through to `mercyblade.com/weak-at` on B exceeds A by ≥50% (measured via referral domain on the platform-side URL parameter; see `measurement-plan.md`). Higher because the post implicitly asks the reader to do what the narrator did.

**Risk:** B is closer to the "is this a real learner?" line than A. If a reader asks "who wrote this?", the answer needs to be unambiguous — Chau wrote it, narrating his own first walk-through. Don't post B from a sock-puppet account or from an account that pretends to be a stranger.

---

### Post 3 — *"Sống ở Mỹ/Canada/Úc nhiều năm — vẫn mắc lỗi tiếng Anh của người Việt"*

| | Treatment |
|---|---|
| **A (shipped)** | Problem-framing — "these are my recurring errors" + product as the diagnostic. |
| **B** | **Pride-framing — flip the same observation into linguistic-identity affirmation.** Opening: *"Mình mắc những lỗi tiếng Anh của người Việt — và mình không xin lỗi vì điều đó. Đó là dấu hiệu tiếng Việt còn sống trong cách mình tư duy. Cái cần là một công cụ hiểu điều đó."* Then introduces `/weak-at` as the tool that *names* (not "fixes") the patterns. The L1 patterns become a feature of bilingual cognition, not a defect to erase. |

**Hypothesis (B):** Diaspora-identity audiences engage more when the linguistic-interference frame is positioned as identity-positive rather than as a problem to solve. The "không xin lỗi vì điều đó" line is the strongest engagement bet — it gives the reader something to nod at before the product enters.

**Success signal:** Share count on B exceeds A by ≥2x in diaspora-identity groups specifically. Sentiment in comments matters more than count — comments containing pride/identity language ("đúng vậy", "không phải lỗi, là dấu hiệu") indicate the frame is landing.

**Caveat:** If B underperforms in non-identity-group contexts (general Facebook feeds, English-learning groups), it doesn't mean the frame failed — just that audience-context matters more than copy. Post B inside diaspora-identity groups; post A in general feeds.

---

### Post 4 — *"Học tiếng Anh không cần gửi dữ liệu lên server — đây là một quyết định"*

| | Treatment |
|---|---|
| **A (shipped)** | Decision-explanation — *"Sao lại làm thế? Hai lý do."* Founder explaining the *why*. |
| **B** | **Verification-first — lead with how to check, not why.** Opening: *"Bạn có thể kiểm tra điều này trong 30 giây. Mở DevTools, vào /weak-at, đếm yêu cầu mạng. Kết quả: 0."* Then the explanation follows the demonstration. CTA: *"Tự kiểm tra (30 giây): mercyblade.com/weak-at"*. |

**Hypothesis (B):** A privacy claim that opens with "here's how you can verify this yourself" is more credible than one that opens with "here are our reasons". The verification-first framing also self-selects for a more engaged audience — readers who actually open DevTools become advocates more reliably than readers who only read the explanation.

**Success signal:** Comments containing "đã thử / đã kiểm tra / verified" on B exceed A. Click-through metric secondary — what we're testing is *credibility transfer*, not raw traffic, so a reader who comments "I checked and it's true" is worth more than three silent click-throughs.

---

### Post 5 — *"Mệt thì cũng không sao — viết riêng cho bố mẹ học tiếng Anh"*

| | Treatment |
|---|---|
| **A (shipped)** | Soft kindness — addressed to the older learner directly + with an "EN gloss for diaspora children" coda. |
| **B** | **Reversed audience — addressed primarily to the adult child, not the parent.** Opening (in EN, then VI): *"If your Vietnamese-speaking parent has tried and quit a language app because of the daily-streak pressure — this is for you to forward to them."* Then VI body explains the product to a hypothetical recipient. Same product description as A; the framing shifts from "to the parent, with a child translation" to "to the child, with a parent forward in mind". |

**Hypothesis (B):** The gift-giver pattern (adult child curating tools for older parents) is a stronger acquisition vector than the direct-to-parent ask, because the adult child has more discretionary time and more comfort with apps. A "forward this to your parent" CTA gives the post a job for the diaspora-child reader.

**Success signal:** Share count on B exceeds A by ≥3x — specifically the "share to a friend / send to messenger" private-share counter, not public-feed share. The success of this post is in *private-channel propagation*, which is invisible to the public feed but visible in Facebook's "shares" metric (see `measurement-plan.md` for the precise read).

---

## Zalo share cards — 5 pairs

Zalo's compressed format gives less room to vary. Each variant changes *one element*: the hook framing OR the CTA.

### Card 1 — "the diagnostic ask"

| | Treatment |
|---|---|
| **A (shipped)** | Question hook: *"Bạn có biết mình hay mắc lỗi tiếng Anh gì không?"* + standard CTA. |
| **B** | **Imperative hook + same CTA.** *"Kiểm tra 30 giây: mình hay mắc lỗi tiếng Anh gì? MercyBlade tổng hợp 3 điều."* The "30 giây" time-bound is the new test — making the click sound bounded reduces friction. |

**Hypothesis (B):** Question hooks read as low-stakes scrollable in Zalo's compressed format; imperatives with bounded time commitments ("30 giây") read as low-risk-clickable. The time bound matters more than the verb mood.

**Success signal:** Manual count of forward-on rate. In a group of N forwards out, how many forward the card on to a fourth recipient? Forward-survivability is the Zalo-native metric, not click-through (which Zalo doesn't expose to senders).

---

### Card 2 — "the what-to-practice ask"

| | Treatment |
|---|---|
| **A (shipped)** | Question hook + product description: *"Học xong rồi luyện gì tiếp theo? MercyBlade nói rõ ba điều bạn nên luyện."* |
| **B** | **Stat-led hook.** *"3 dòng. 3 thứ bạn nên luyện tiếp theo. MercyBlade chỉ ra cụ thể."* The number-led structure mimics the actual product surface ("exactly three rows") and tightens the value prop. |

**Hypothesis (B):** Stat-led hooks survive Zalo's scroll better than question hooks because the value is named in the first three words. Receivers who skim Zalo at speed are more likely to register *"3 dòng / 3 thứ"* than *"luyện gì tiếp theo?"*.

**Success signal:** In a one-week split-send (A to half a forwarding chain, B to the other half, randomized by Chau manually), B's forward-on rate exceeds A's by ≥30%.

---

### Card 3 — "the no-streak angle"

| | Treatment |
|---|---|
| **A (shipped)** | Negation-led: *"Không có chuỗi học. Không có XP. Chỉ 3 thứ cụ thể bạn nên luyện."* |
| **B** | **Permission-led.** *"Học vài phút là đủ. Mệt thì cũng không sao. MercyBlade — 3 thứ bạn nên luyện."* Drops the "not X" framing entirely and leads with the Rule-4 permission line from `voice-guidelines-vn.md`. |

**Hypothesis (B):** Negation-led copy primes the reader to think about the thing being negated (the streak system). Permission-led copy primes the reader to feel the absence of pressure directly. For older / parent learners, the permission frame may land harder than the negation frame.

**Success signal:** B's forward-on rate exceeds A's specifically when forwarded into groups containing older / parent learners. In tech-leaning groups, A and B are expected to perform within noise of each other — the differential is audience-specific.

---

### Card 4 — "the L1 angle"

| | Treatment |
|---|---|
| **A (shipped)** | Problem-statement: *"Lỗi tiếng Anh của riêng người Việt — không phải lỗi chung chung."* |
| **B** | **Teacher-voice.** *"Cô Mercy biết người Việt hay quên thêm -s cho he, she, it. Vào học cùng cô — mercyblade.com/weak-at."* Names the AI tutor character + a concrete example pattern. The shift is from product-positioning to *Cô Mercy is waiting*. |

**Hypothesis (B):** Naming the teacher character + a concrete pattern is more clickable than positioning the product. The teacher-frame gives the click a destination beyond a page; it gives it a person.

**Success signal:** Click-through on B exceeds A (read via UTM parameter on the inbound link — see `measurement-plan.md`).

---

### Card 5 — "the privacy angle"

| | Treatment |
|---|---|
| **A (shipped)** | Technical / verification-led: *"Trang /weak-at đọc dữ liệu trên máy bạn — không gửi lên server. Có thể tự kiểm tra bằng DevTools."* |
| **B** | **Trust-led.** *"Dữ liệu học của bạn ở lại với bạn. Không gửi đi đâu cả. MercyBlade — mercyblade.com/weak-at."* No mention of DevTools or verification; pure claim. Simpler card; trades verifiability for accessibility. |

**Hypothesis (B):** A trust-led claim travels further in Zalo than a verifiable one, because Zalo audiences aren't generally going to open DevTools — the verifiability is wasted bandwidth in the format. The simpler claim may forward more.

**Success signal:** Forward-on rate on B exceeds A by ≥50%. Caveat: if A's audience converts at a much higher rate (technical / privacy-conscious receivers click-through more than they forward), A may "win" by a different metric. This pair specifically tests *Zalo virality* not *acquisition quality* — keep that scope explicit in the read.

---

## What this file is NOT

- **Not a request for permission to A/B test all 15 pairs at once.** Most variant tests are sequential, not parallel — see `decision-criteria.md` for the recommended cadence.
- **Not a license to invent new variants on the fly.** Each B is documented here precisely so the test stays scoped to one axis at a time. "B-prime" (a variant of a variant) goes into a follow-up file.
- **Not a recommendation that B will win.** A is the shipped baseline because A is the founder's first-principles best guess. B's job is to challenge that guess; many B variants will lose, and that is a successful test.
- **Not an outcome-claim license.** No B variant introduces outcome claims that A didn't carry. The "I tried it; here's what I got" framing in Facebook Post 2 B is a *factual observation report*, not a *result claim* — and the line is documented.
