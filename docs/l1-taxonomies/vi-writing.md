# Vietnamese-Speaker English-Writing Error Taxonomy

> Curated, judgement-driven, not encyclopedic. Biased toward what a Vietnamese
> English teacher would actually flag while reading real Vietnamese-learner
> writing — emails, IELTS Task 2 essays, TOEFL independent essays, chat
> messages, exam paragraphs, cover letters. Built from teaching judgement;
> uncertainty markers (`TODO: verify`) live inline where the linguistic
> claim about Vietnamese needs Chau's check before shipping to feedback UIs
> (PRINCIPLES §7).

## Why a separate "writing" taxonomy

The MercyBlade Vietlish stack already has three pieces:

- **`src/lib/pronunciation/vn-phoneme-map.ts`** — sound-level transfer
  (`th → t`, `final-s drop`, voicing). Spoken output only.
- **`src/lib/feedback/l1-vn-explanations.ts` + `src/lib/feedback/rule-packs/vi/rules.ts`** —
  ~60 per-sentence grammar rules (3rd-person-s, missing be, articles,
  conditionals, modals, tag questions, etc.). One sentence in, one rule
  fires.
- **`docs/placement-vn-l1-interference-taxonomy.md`** — 37 patterns across
  phonology / morphology / syntax / lexicon / discourse / pragmatics,
  scoped to placement-grading and lesson-routing.
- **`docs/l1-taxonomies/vi-grammar.md`** (C1's parallel deliverable) —
  per-sentence grammar in depth.

What is missing is **the writing-specific layer**: the errors that only
become visible (or become dominant) when a Vietnamese learner sits down to
*construct* English — has time to think, hesitates over articles, chains
sentences, picks reporting verbs, signs off an email. Vietlish is loudest
in writing. Spoken Vietlish disappears under the prosody; written Vietlish
sits on the page.

This document is the writing layer. It is curated from the same teaching
discipline as `vn-phoneme-map.ts`, not from a textbook.

## Severity scale

Severity here is a **consumer-side** signal — it tells Mercy (or any
downstream UI) *how to behave* when a pattern matches. It is **not** an
engine tie-breaker. The detector contract remains the one
`src/lib/feedback/rule-packs/vi/rules.ts` already implements:
**first match wins, in registry order**. If two rules could fire on the
same paragraph, ordering decides which one teaches; severity decides
how loud the teach is. (C1's `vi-grammar.md` makes the same call; both
docs route through whatever schema C4 lands.)

Three tiers — matching the convention in
`src/data/placement/vnL1Interference.ts` (modulo the `'med'` vs
`'medium'` spelling reconciliation C4 will lock; this doc writes
`'medium'`):

- **high** — catch and correct, every time. The error blocks meaning,
  fails an IELTS band descriptor, or makes a professional email look
  unhirable. Mercy rewrites the sentence and explains.
- **medium** — catch and suggest. The writing is intelligible but
  Vietnamese-flavoured; in an academic or professional context it costs a
  band. Mercy points at it with a "more natural would be…" suggestion.
- **low** — flag only if the learner asked for a full edit. Stylistic,
  not error. Mercy leaves it unless the user requested polish.

Why three tiers instead of four: a fourth "info-only" tier collapsed into
"low" in practice — learners ignore it and Mercy's UI doesn't have the
space. Why not numeric (0.85 / 0.75…): writing has no equivalent of
"recognizable substitute"; either we fix it or we don't. Phoneme partial
credit doesn't transfer to prose.

## What this doc is NOT covering

| Layer | Owner | Not here because |
|---|---|---|
| Per-sentence grammar (3rd-person-s, missing be, modal + bare V…) | `l1-vn-explanations.ts` + C1's `vi-grammar.md` | 60 rules already shipped or in C1's pipeline; duplicating them dilutes the signal |
| Pronunciation / sound-level transfer | `vn-phoneme-map.ts` + C3 | Spoken only |
| Placement-grading tag IDs | `placement-vn-l1-interference-taxonomy.md` | That doc is the routing surface; this doc is the teaching content for the writing slice |
| Single-word vocabulary (false-friend list at scale) | future C5 / vocabulary skill | Touched here only when it produces multi-word writing failure |
| Tone / register in **speech** (apology sequencing, request softening spoken) | placement pragmatics section | Speech-act work, not writing |

Where overlap is unavoidable (topic-comment surfaces both in spoken syntax
and written paragraphs; formality calibration overlaps placement
pragmatics), this doc gives the **writing-length** example — paragraph or
email body, not single sentence — and explicitly points at the upstream
doc.

---

## 1. Register / formality mismatch — `vi_write_register`

**EN:** Vietnamese honorifics, kinship terms, and politeness particles
encode register at the pronoun level (`em / anh / chị / thầy / cô / cháu`).
English encodes register at the **genre + verb-choice + greeting** level.
Vietnamese learners either overshoot (Indian-business-school
"Respected Sir, kindly do the needful") or undershoot ("Hi teacher, send
me the slides"). Same learner often does both inside a 200-word email.

**VN:** Tiếng Việt mã hoá mức lịch sự ở **đại từ xưng hô** ("em / anh /
chị / thầy / cô"). Tiếng Anh mã hoá ở **thể loại văn bản + chọn động từ +
chào hỏi**. Người Việt hay vượt mức (kiểu "Respected Sir…") hoặc xuống
quá mức ("Hi teacher, send me the slides") — và rất hay làm cả hai trong
cùng một email.

**Severity:** high (job application, university email, IELTS GT letter).
Medium for casual chat with classmates.

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `Dear Sir/Madam, I am Nguyen Van A, age 25, working at ABC company. I hope you are healthy. I am writing to apply for the job.` | `Dear Hiring Manager, I'm applying for the Marketing Coordinator role. I have five years of experience at ABC and would bring…` | VN business letters open with full self-ID + health check; translates literally |
| `Respected Professor Smith, Kindly please grant me the permission to submit assignment late.` | `Dear Professor Smith, I'm writing to ask for a two-day extension on the assignment because…` | "Kính gửi" + "kính mong" stacked, translated via Indian-English business templates VN learners are taught from |
| `Hi teacher, gimme the slides pls, thanks teacher` | `Hi Linh, could you send the slides from yesterday? Thanks!` | Direct kinship-term carryover ("thầy ơi"); "gimme" + "pls" picked up from informal English without genre awareness |
| `Dear teacher Tran` | `Dear Ms Tran` *or* `Dear Tran` | "thầy Trân / cô Trân" template; English doesn't stack title + given name + surname |
| `I hope this email find you well. I am writing this letter to inform you that I would like to ask about the schedule.` | `Hi Mai, quick question about Thursday's schedule —` | Overshoot: stitched together from two formal-email templates; loses the question itself |
| `Thank you teacher for read my essay. I am very appreciate.` | `Thank you for reading my essay — I really appreciate it.` | "Cảm ơn thầy đã đọc bài em" → literal; "appreciate" treated as adjective via Vietnamese verb→adjective slippage |
| `Sir, I want one coffee.` *(written in chat to a barista app)* | `Hi! One coffee, please — small, oat milk.` | "Anh ơi, cho em một ly cà phê" translated with the formal pronoun chosen by default |
| `Dear all members of the committee, I have the honour to present myself…` *(IELTS GT casual letter to a friend)* | `Hi Linh, hope you're well —` | Genre-recognition failure: GT informal letter being treated as application letter |
| `Looking forward your reply soonest.` | `Looking forward to hearing from you.` | Calque of "mong sớm nhận được hồi âm"; "soonest" lifted from Indian-English biz template |
| `I hope you can understand my situation and sympathy with me.` | `I'd really appreciate your understanding.` | "thông cảm" → "sympathy"; over-explicit emotional request VN considers polite, EN reads as pressure |
| `Greetings of the day to you, Sir.` *(opening of a TOEFL essay)* | *(no opening salutation in an essay)* | Letter-template muscle memory overflowing into essay genre |
| `Hello professor I have one question. The exam is on Friday. The room is changed. Where is the new room.` | `Hi Professor Lee — quick question: where is Friday's exam being held?` | Each sentence is fine in isolation; the whole has no email shape (subject line missing, no closing, four short bullets that read like a status update) |
| `Best regards forever, your student Chau` | `Best regards,` *or* `Best,` *or* `— Chau` | "Trân trọng đời đời" doesn't exist in EN sign-offs; loanword decoration |

---

## 2. Paragraph cohesion — parataxis vs explicit connectives — `vi_write_cohesion_parataxis`

**EN:** Vietnamese narrative tolerates **parataxis** — clauses stacked
side by side, logical relations inferred. English expository prose
expects **explicit connectives** (`however, therefore, in addition, as a
result, by contrast, for instance`). A Vietlish paragraph reads as a
list of facts; an English-flavoured paragraph reads as an argument
moving forward.

> needsReview: parataxis-tolerance is broadly accepted for VN narrative,
> but the implicit comparative claim ("VN learners produce more parataxic
> English than other ESL groups") is teaching judgement, not corpus-verified.

**VN:** Văn tiếng Việt cho phép **ghép câu kề nhau** — người đọc tự
suy ra mối quan hệ. Văn nghị luận tiếng Anh đòi **từ nối tường minh**
("however, therefore, in addition…"). Đoạn văn Vietlish nghe như một
**danh sách** sự kiện; đoạn văn tiếng Anh tốt là một **lập luận**
dịch chuyển về phía trước.

**Severity:** high in essays and academic writing (kills IELTS Task 2
Coherence band). Medium in personal-narrative chat.

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `I went to school. The weather was nice. I met my friend. We talked about the exam. The exam was difficult.` | `On the way to school, the weather was so nice that I lingered. I ran into a friend; we ended up talking about how difficult the exam had been.` | VN narrative chains scenes by time-order — relations are implicit |
| `Vietnam has many problems. Pollution is serious. Traffic is bad. Education is expensive.` | `Vietnam faces several intertwined problems: pollution and traffic strain the cities, while the cost of education strains the household.` | VN topic-sentence + listing pattern translated 1:1; English expects subordination |
| `I want to study abroad. My parents do not have much money. I am working part-time.` | `I want to study abroad, **but** my parents can't fully fund it, **so** I'm working part-time.` | Causal chain — "muốn / nhưng / nên" — flattened to three independent sentences |
| `Online learning is good. Online learning is bad.` | `Online learning has clear benefits **and yet** carries equally clear costs.` | The "two-sided" essay turn delivered as two unconnected claims |
| `The economy is growing. Many people are poor.` | `**Despite** sustained economic growth, large numbers of Vietnamese remain poor.` | Concessive relationship ("mặc dù") lost when split into two sentences |
| `Firstly, I will discuss pollution. Secondly, I will discuss traffic. Thirdly, I will discuss education. Finally, I will conclude.` | *(delete the meta-frame; argue the case)* `Pollution and traffic both follow from the same source — uncontrolled urban growth — and education will, too, unless…` | Mechanical "firstly/secondly" scaffolding is taught in VN IELTS prep; English C1 readers find it juvenile |
| `He studies hard. He gets good grade.` | `He studies hard, **so** he gets good grades.` | Result/consequence ("nên") dropped because VN allows it to be inferred |
| `The film was long. I enjoyed it.` | `The film was long, **but** I enjoyed it.` *(or)* `**Even though** the film was long, I enjoyed it.` | Concessive — "tuy / nhưng" — dropped |
| `Many students learn English. Few become fluent.` | `Many students learn English; **few, however,** become fluent.` | Contrastive relationship dropped; the "however" is doing the argumentative work |
| `She is intelligent. She is kind. She is hardworking. She is my best friend.` | `Intelligent, kind, and hardworking — she's my best friend.` *(or)* `She's my best friend: intelligent, kind, and hardworking.` | Four predicate-only clauses; VN often lists attributes in parallel with no joiner |
| `The temperature was 39 degrees. I could not sleep.` | `The temperature hit 39 degrees, **so** sleep was impossible.` | "Vì… nên" pattern; learners drop the "nên" when translating |
| `I tried three times. I failed three times. I want to try again.` | `I tried three times and failed each time, **and yet** I want to try again.` | Persistence-after-failure relationship — "vẫn / vẫn còn" — not translated |
| `Vietnamese food is famous. Pho is the most famous dish. Pho is made of beef and noodles. Foreigners like pho.` | `Vietnamese food is internationally famous, and the dish that travels best is **pho** — a beef-and-noodle soup foreigners take to immediately.` | Four atomic facts; the argument "pho is the iconic ambassador" is implicit in VN, must be explicit in EN |
| `I read the book. The book was interesting. The author is famous.` | `I read the book — it was interesting, and the author is famous.` *(or)* `I read the book; it's interesting, and its author is well-known.` | Cohesion failure: same noun ("book") repeated where "it" + connective would carry the thought |
| `I disagree with him. His argument has logic. The conclusion is wrong.` | `I disagree with him: his argument is internally logical, **but** the conclusion is wrong.` | Concession-then-rebuttal pattern; VN learners often deliver it as flat list |

---

## 3. Sentence-boundary errors — `vi_write_sentence_boundary`

**EN:** Comma splices, run-ons, fragments. Vietnamese punctuation is
historically looser around the period/comma boundary — Vietnamese can
chain clauses with commas where English requires a period or
semicolon. Vietnamese also tolerates fragments as standalone "sentences"
in narrative; English (in writing) usually wants a finite verb.

**VN:** Tiếng Việt cho phép nối các mệnh đề bằng dấu phẩy thoải mái hơn
tiếng Anh. Dấu chấm câu trong tiếng Việt linh hoạt; người học viết tiếng
Anh dễ dùng dấu phẩy ở chỗ phải dùng dấu chấm hoặc chấm phẩy. Tiếng
Việt cũng chấp nhận "câu không có động từ" trong văn kể — tiếng Anh viết
chuẩn yêu cầu mỗi câu phải có động từ chia thì.

**Severity:** high in formal writing; medium in chat.

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `I went home, I was tired, I slept early.` | `I went home. I was tired, so I slept early.` *(or)* `I went home tired and slept early.` | Comma-chain — VN narrative comfortable here |
| `My mother is a teacher, she works in a school in Hanoi, the school is very old.` | `My mother is a teacher. She works in an old school in Hanoi.` | Three clauses joined with commas; VN allows this for descriptive chaining |
| `Because I was tired.` *(standalone "sentence")* | *(attach to the previous sentence)* `…I went to bed early because I was tired.` | "Vì tôi mệt" can stand alone as a turn in VN narrative; in EN written prose it's a fragment |
| `She is smart. And hardworking. And kind.` | `She is smart, hardworking, and kind.` | VN treats "Và…" / "Còn…" as legitimate sentence openers in casual writing; in EN essay register it reads broken |
| `The exam was very difficult, however I passed.` | `The exam was very difficult; however, I passed.` *(or)* `The exam was very difficult. However, I passed.` | "However" used as a coordinator the way "nhưng" works — but "however" is a conjunctive adverb, needs `;` or `.` |
| `I love Hanoi, the food is good, the people are friendly, the weather is cool.` | `I love Hanoi: the food is good, the people are friendly, and the weather is cool.` | Colon + list would render the relationship; commas alone don't |
| `In conclusion, every people should learn English, it is important for the future.` | `In conclusion, everyone should learn English; it matters for the future.` | The argumentative connection demands a strong break |
| `Although the price is high. The quality is good.` | `Although the price is high, the quality is good.` | "Mặc dù giá cao. Chất lượng tốt." — Vietnamese accepts the dependent clause as a one-line topic; EN doesn't |
| `My favorite season. Is autumn.` | `My favorite season is autumn.` | Subject and predicate split by period — likely line-break-driven (mobile chat habit) |
| `I want to ask a question, can you help me?` | `I want to ask a question. Can you help me?` *(or)* `Can you help me with a question?` | Declarative + interrogative jammed with a comma |
| `When I was a child. I lived in Da Nang.` | `When I was a child, I lived in Da Nang.` | Subordinate-first clause needs a comma, not a period |
| `The book is on the table the table is in the kitchen.` | `The book is on the table. The table is in the kitchen.` *(or)* `The book is on the kitchen table.` | Pure run-on, no boundary at all — chat-typing habit transferring into essay |
| `She said. That she was tired.` | `She said that she was tired.` | Period inside a single reported clause — line-break artifact from mobile composition |
| `Lan, who is my best friend, she is from Hue.` | `Lan, who is my best friend, is from Hue.` | Subject "Lan" picked up again by "she" after the relative clause — comma-chain habit |

---

## 4. Topic-comment leakage in writing — `vi_write_topic_comment`

**EN:** Vietnamese is a **topic-prominent** language: a sentence often
starts with the topic ("As for X…", "About X…"), then comments on it.
English permits topicalization but uses it sparingly, mostly in spoken
contrast. In writing, Vietnamese learners deliberately reach for
topicalizers ("As for…", "Regarding…", "Talking about…", "About…",
"This problem,…") more often than English style allows. This is
**more visible in writing than speech** because the learner has time
to construct the topic-frame consciously. (needsReview — the "more
visible in writing" framing is extrapolation from teaching observation;
the placement taxonomy treats topic-comment as register-neutral, and a
spoken-vs-written frequency study would be the only way to confirm.)

Placement taxonomy covers this for sentence-level grading
(`topic-comment-fronting`). This entry is the **writing-deliberate**
variant — the kind that appears in IELTS introductions and business
emails. Cite, don't duplicate.

**VN:** Tiếng Việt là **ngôn ngữ chủ đề**, hay mở đầu bằng chủ đề
("Về vấn đề X…", "Cái này…", "Còn anh…") rồi mới nhận xét. Tiếng Anh
ít làm vậy trong văn viết. Người học hay **chủ động** dùng cấu trúc
chủ đề khi viết — vì có thời gian xây câu — và đó là lúc Vietlish lộ
ra rõ nhất trong essay/email.

**Severity:** medium in essays (English allows occasional
topicalization; overuse costs cohesion band). High in business email
("Regarding to…" is a marked error).

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `This problem, we need to solve it carefully.` | `We need to solve this problem carefully.` | Topic ("Vấn đề này…") fronted; English prefers SVO unless contrast is needed |
| `About the new policy, many people think it is unfair.` | `Many people think the new policy is unfair.` | "Về chính sách mới…" — Vietnamese topicalizer transferred literally |
| `Regarding to the meeting, I will not attend.` | `I won't be able to attend the meeting.` *(or, only if framing the topic matters:)* `Regarding the meeting — I won't attend.` | Double error: "regarding **to**" is not English; topicalization unnecessary |
| `As for me, I prefer coffee.` *(opens an essay paragraph with this)* | `I prefer coffee.` | "Còn tôi, tôi thích cà phê" — VN topicalizes the "I" against an implicit contrast; in writing without that contrast it reads odd |
| `Talking about climate change, it is a big problem.` | `Climate change is a big problem.` | "Nói về biến đổi khí hậu…" calque; the topic-frame is redundant in EN writing |
| `In my opinion, I think education is important.` | `I think education is important.` *(or)* `In my opinion, education is important.` | Double opinion marker — "Theo tôi, tôi nghĩ…" is normal VN; EN picks one |
| `My family, we live in Hue.` | `My family lives in Hue.` | Already in placement as `topic-comment-fronting`; in writing it surfaces in personal narrative essays |
| `For example the case of Vietnam, the GDP grows fast.` | `Vietnam, for example, has seen fast GDP growth.` | Example-marker fronted as topic; EN inserts mid-sentence |
| `Concerning to your question, the answer is yes.` | `To answer your question: yes.` | "Về câu hỏi của bạn…" + non-existent "concerning **to**" — register-formal email error |
| `What I want to say is that English is hard.` | `English is hard.` *(or, only if signposting a turn:)* `My point is: English is hard.` | "Cái mà tôi muốn nói là…" — VN topicalizes the speech act itself |
| `The reason why I love Vietnam, it is because of the food.` | `I love Vietnam because of the food.` *(or)* `The reason I love Vietnam is the food.` | Pseudo-cleft structure with resumptive "it"; doubled topic-frame |
| `About IELTS Writing Task 2, it is the hardest part of the test.` *(essay opening)* | `IELTS Writing Task 2 is the hardest part of the test.` | "About…it is…" — topic + pronoun pickup |
| `Honestly speaking, I don't agree.` | `Honestly, I don't agree.` *(or just)* `I don't agree.` | "Nói thật ra…" — VN softener; in EN writing the doubled marker reads anxious |
| `Generally speaking, in general, English grammar is difficult.` | `English grammar is difficult.` *(or pick one hedge)* | Hedge-stacking at the start of an essay — common in VN-trained IELTS templates |

---

## 5. Reported speech and reporting-verb variety — `vi_write_reporting_verbs`

**EN:** Different from C1's per-sentence rule on **tense backshift in
reported speech** (`vi_l1_reported_speech`). This is a **vocabulary +
genre** issue: Vietnamese learners write academic and journalistic
prose almost entirely with "said" because Vietnamese `nói / bảo` covers
a wide semantic range. (needsReview — "almost entirely" is teaching
generalisation; an actual count over a B2-C1 VN-learner essay corpus
would either confirm or soften this.) English expects a graded set of reporting verbs
— `argue, suggest, claim, note, observe, contend, insist, point out,
report, allege, propose, maintain, acknowledge, concede` — each carrying
a different epistemic stance.

**VN:** Khác với quy tắc câu gián tiếp (lùi thì) trong
`l1-vn-explanations.ts`. Đây là vấn đề **từ vựng + thể loại văn bản**.
Tiếng Việt dùng "nói / bảo" rất rộng. Tiếng Anh viết học thuật phân
biệt rõ: "argue, suggest, claim, note, contend, insist, point out…" —
mỗi từ thể hiện **mức độ chắc chắn / lập trường** khác nhau.

**Severity:** medium (B2+ academic). Low at A2/B1.

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `The author said that climate change is real.` *(repeated 6× in one essay)* | `The author **argues** that climate change is real… She **points out** that… She **contends** that…` | "Tác giả nói…" works for all stances in VN; EN needs lexical variety per IELTS Lexical Resource band |
| `He told that the meeting is cancelled.` | `He **said** the meeting is cancelled.` *(or)* `He **told us** the meeting is cancelled.` | "Told" requires an indirect object in EN; "bảo" doesn't in VN |
| `She said about the new policy.` | `She **commented on** the new policy.` *(or)* `She **spoke about** the new policy.` | "Nói về" → "said about"; English doesn't take that complement |
| `The professor said his opinion.` | `The professor **gave** his opinion.` *(or)* `The professor **stated** his view.` | "Nói ý kiến" — VN allows "say" to take an opinion-noun |
| `The newspaper said the price increased.` | `The newspaper **reported that** the price increased.` | Print/news source — English reaches for "report" |
| `He said me that the train is late.` | `He **told me** the train is late.` | Confusion of say/tell — `say` doesn't take a personal indirect object |
| `The boss said me to come early.` | `The boss **asked** me to come early.` *(or)* `…**told me** to come early.` | Said-me + infinitive: layered error (say/tell + reporting-verb choice) |
| `Lan said yes.` *(in a formal report)* | `Lan **agreed**.` | "Said yes" registers as conversational; report-genre wants "agreed/consented" |
| `The study said that Vietnamese learners struggle with articles.` | `The study **found** that Vietnamese learners struggle with articles.` *(or)* `The study **shows** that…` | Studies don't "say" in EN academic prose — they find / show / demonstrate |
| `He said no.` | `He **refused**.` *(or)* `He **declined**.` *(or, in chat:)* `He said no.` | Casual-only; in a report needs lexicalisation |
| `The teacher said that the homework is due Friday.` *(school chat — fine)* + `The minister said that the policy is necessary.` *(essay — wrong)* | *(school chat fine)* / *(essay:)* `The minister **insisted** the policy was necessary.` | Same verb, two genres — VN learner often uses identical reporting verb across both |
| `I said him sorry.` | `I **apologised** to him.` *(or)* `I **told him I was sorry**.` | "Tôi nói với anh ấy xin lỗi" → calque; English has a dedicated apology verb |
| `The book says that…` *(repeated 4×)* | `The book **argues that** / **claims that** / **suggests that** / **shows that** …` | Variation expected at B2+; VN learner doesn't have the lexical set |

---

## 6. Hedging and certainty calibration — `vi_write_hedging`

**EN:** English academic and professional writing calibrates certainty
with a graded set of hedges (`may, might, could, possibly, perhaps,
tend to, often, generally, arguably, it is widely believed that`).
Vietnamese academic style splits: some genres (state-paper, formal
opinion piece) are **direct and unhedged** ("rất rõ ràng rằng…"); others
(traditional letter, deferential note) are **over-hedged** with politeness
markers that don't map to epistemic hedges in English. (needsReview —
the binary "splits" framing is rough; VN academic writing has more
internal variation than two poles, and an applied-linguistics source
would calibrate this better.) Vietnamese
learners arrive in IELTS Task 2 with one of two opposite habits.

**VN:** Tiếng Anh học thuật cần "may / might / could / tend to /
generally" để cân chỉnh mức chắc chắn. Tiếng Việt một mặt rất thẳng
("rõ ràng là…", "chắc chắn là…"), mặt khác rất rào đón
("có lẽ chăng…", "có thể là chăng…"). Người học IELTS thường lệch về
một thái cực.

**Severity:** medium for IELTS Task 2 Lexical Resource (over-asserted
claims cost band). Low for personal essays / chat.

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `Vietnam is the best country in the world.` *(IELTS Task 2 thesis)* | `Vietnam, in many respects, is **among the most distinctive** countries in the world.` | Direct VN tradition + nationalism; English Task 2 marker expects hedged claim |
| `All Vietnamese students love English.` | `**Many** Vietnamese students **tend to** enjoy English.` | Universal quantifier where "many / most / tend to" is needed |
| `Technology is destroying our society.` | `Technology **may be eroding** several aspects of social life.` | Bare assertion; English C1 writing softens dramatic claims |
| `It is 100% correct that climate change is real.` | `Climate change is **well-documented**.` *(or)* `The evidence for climate change is **overwhelming**.` | Percent-hedge from VN "100% đúng" — not idiomatic EN |
| `Maybe perhaps it could possibly be that some students might struggle.` | `Some students may struggle.` | Hedge-stack — over-corrected from a teacher's "always hedge" lesson |
| `In my humble opinion, with all due respect, I would like to suggest that…` *(opening of an academic email)* | `I'd like to suggest…` *(or, formal:)* `I would suggest…` | Stacked politeness from VN deference; English reads as anxious |
| `I think that probably maybe English is hard.` | `English **can be** hard.` | Triple hedge ("nghĩ là / chắc là / có lẽ"); pick one |
| `It is certain that students will fail without practice.` | `Students **are likely to** fail without practice.` | Certainty over-claim; "chắc chắn" → "certain" |
| `Everyone knows that pollution is bad.` | `Pollution is **widely recognised as** harmful.` | "Ai cũng biết" — universal-knowledge claim in VN; English softens to "widely recognised" |
| `The government must immediately solve this problem.` | `The government **should consider** addressing this problem.` *(in a measured opinion piece)* | Modal-strength mismatch: "phải ngay lập tức" = "must immediately" lifts the demand higher than English op-ed allows |
| `It is obvious that English is more useful than other languages.` | `English **is, arguably**, more widely useful than other languages.` | "Rõ ràng là" — VN essay opener; the "arguably" is the calibrated EN form |
| `The author is wrong.` | `The author **overstates** the case.` *(or)* `The author's claim **may be too strong**.` | Direct VN academic style; in English a hedged disagreement is more credible |
| `If we do not act now, the world will end.` | `Without action, the consequences **could be severe**.` | Apocalyptic claim — EN op-ed expects hedged consequence |

---

## 7. Article use across a paragraph — `vi_write_article_discourse`

**EN:** Distinct from the per-sentence article-omission rule
(`vi_l1_missing_article` in `l1-vn-explanations.ts`). The writing-specific
pattern: a Vietnamese learner introduces a referent with `a`, then drops
articles entirely, **or** introduces with `the` (treating it as known to
the reader because it's known to the writer), **or** switches mid-paragraph.
The error class is about **tracking discourse referents across sentences**,
not picking an article in a single sentence.

**VN:** Khác với quy tắc thiếu mạo từ trong từng câu. Lỗi viết là
**theo dõi đối tượng trong cả đoạn** — giới thiệu bằng "a" rồi bỏ
hoàn toàn ở câu sau, hoặc dùng "the" ngay từ đầu vì người viết biết
nhưng người đọc chưa biết.

**Severity:** medium (kills IELTS Cohesion + Grammar bands together).

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `I bought a book yesterday. Book was very interesting.` | `I bought a book yesterday. **The** book was very interesting.` | New referent → `a`; second mention → `the`. VN drops both because tracked by context |
| `The dog ran into the room. Dog was wet.` | `**A** dog ran into the room. **The** dog was wet.` | Reverse error: starts with "the" before the reader has met the referent |
| `Yesterday I met a teacher. Teacher was very kind. We talked for an hour. Teacher gave me advice.` | `Yesterday I met a teacher. **She** was very kind. We talked for an hour, and **she** gave me advice.` | First mention OK, but subsequent references repeat the noun without article rather than pronominalising |
| `The Vietnam is a beautiful country.` | `Vietnam is a beautiful country.` | Already in placement; appears in writing as overcorrection after learning "use the" |
| `I have the dog. The dog is brown. I love the dog.` | `I have **a** dog. **He's** brown, and I love him.` | Triple "the" — overcorrection from a lesson on definiteness |
| `My father is teacher. He works in school. The school is big.` | `My father is **a** teacher. He works in **a** school — **the** school is big.` | Mixed: article missing in introductions, then appears once anchored |
| `The pollution is a serious problem. The traffic is bad. The education is expensive.` | `Pollution is a serious problem. Traffic is bad. Education is expensive.` | "The" inserted before generic uncountable abstracts — over-application of definiteness |
| `In introduction, I will discuss three points.` | `**In the introduction**, I will discuss three points.` *(or)* `**In this essay**, I will discuss three points.` | Genre-frame noun ("introduction") dropped article |
| `I want to discuss problem of unemployment. Problem affects young people.` | `I want to discuss **the** problem of unemployment. **The** problem affects young people.` | Specific-of-NP — must be definite — dropped |
| `Last summer I went to beach. Beach was crowded.` | `Last summer I went to **the** beach. **It** was crowded.` | Geographic-specific definite ("the beach") dropped; pronoun second time |
| `She is best student.` | `She is **the** best student.` | Already in placement; recurs in essays |
| `I read interesting article about Vietnam. Article was written by Vietnamese author. Author lives in Hanoi.` | `I read **an** interesting article about Vietnam. **It** was written by **a** Vietnamese author who lives in Hanoi.` | Three-sentence pattern showing all three errors at once: new-referent missing `a`, second-mention missing pronoun, third-mention missing `a` for the newly-introduced author |
| `Internet is changing the world.` *(essay opener)* | `**The** internet is changing the world.` | Unique-referent definite ("the internet") dropped — VN treats it as the bare name |
| `I am writing about my family. Family is very important to me.` | `I'm writing about my family. **My family** is very important to me.` *(or)* `**They** are very important to me.` | Repetition of bare noun instead of possessive/pronoun re-mention |

---

## 8. Tense consistency across a paragraph — `vi_write_tense_paragraph`

**EN:** Distinct from C1's per-sentence tense rules. The writing-specific
pattern: a Vietnamese narrator sets the time once at the top of the
paragraph ("Yesterday…", "Last summer…", "When I was a child…") and then
the verbs **stop changing**. (needsReview — the "writing-specific"
framing may overstate; the same time-set-once-then-flat pattern surfaces
in spoken VN-learner narrative too, and the writing-vs-speech distinction
here is more about visibility than about a different underlying error.) The reader of an English paragraph expects
each verb to carry the tense; the Vietnamese learner's verbs sit in
present or unmarked form throughout. IELTS essays show the opposite
problem too: past example for support, present generic for thesis,
future implication — and the boundaries collapse.

**VN:** Tiếng Việt đặt mốc thời gian ở đầu câu / đầu đoạn — sau đó động
từ không cần đổi. Tiếng Anh đòi **mỗi động từ** đều mang dấu thì. Kết
quả là cả đoạn Vietlish có thời gian mâu thuẫn: mốc ở quá khứ, nhưng
động từ vẫn ở hiện tại.

**Severity:** high in narrative writing; medium in expository essays
(IELTS).

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `Last summer I traveled to Da Nang. The beach is beautiful. We swim every morning. The food is delicious.` | `Last summer I traveled to Da Nang. The beach **was** beautiful. We **swam** every morning, and the food **was** delicious.` | Time set once ("last summer"); subsequent verbs left in present |
| `Yesterday I go to school. The teacher gives us a test. The test is difficult. I do my best.` | `Yesterday I **went** to school. The teacher **gave** us a test — it **was** difficult, but I **did** my best.` | Same pattern, one-day window |
| `When I was a child, I live in Hue. My family is poor. We work hard.` | `When I was a child, I **lived** in Hue. My family **was** poor, and we **worked** hard.` | "Khi còn nhỏ" → past frame; remaining verbs left in present |
| `In my essay, I will discuss three points. First, technology was important. Second, education is important. Third, family will be important.` | `In this essay, I **will discuss** three points: technology, education, and family — **all** important to modern life.` | Three different tenses for three parallel points; tense-shift muddles parallel-structure cohesion |
| `The author wrote that climate change is real. He argues it will get worse. He showed that we are too slow.` | `The author **argues that** climate change is real, and **insists that** it will get worse — pointing out we **have been** too slow to respond.` | Reporting-verb tense mixed with content-clause tense |
| `Last week we have a meeting. The boss said the project is cancelled.` | `Last week we **had** a meeting. The boss **said** the project **had been** cancelled.` *(or)* `…**was being** cancelled.` | Present-perfect "have" used as past; backshift in reported speech not applied |
| `I am studying in Canada since 2024.` | `I **have been** studying in Canada since 2024.` | Continuing-state — VN "đang học từ 2024" — needs present perfect continuous in EN |
| `If I had money, I will buy a house.` | `If I had money, I **would** buy a house.` | Already in placement (`vi_l1_conditional_mix`); appears in writing when the learner is mid-paragraph and forgets the if-frame |
| `Yesterday, the weather is good, so we go to the park, but it starts to rain, so we come home.` | `Yesterday the weather **was** good, so we **went** to the park, but it **started** to rain, so we **came** home.` | Four verbs, all left in present; the "yesterday" alone is doing the work |
| `When I arrived at the airport, my friend already leave.` | `When I arrived at the airport, my friend **had already left**.` | Past perfect missing — already in placement (`vi_l1_past_perfect_missing`); appears in narrative writing as the second clause |
| `I was working at ABC. I do many projects. I get a promotion.` | `I was working at ABC, **doing** many projects, **and got** a promotion.` *(or)* `I **worked** at ABC on many projects and **got** a promotion.` | Aspect (past continuous → past simple → present simple) collapses |
| `Today, the price is high. Yesterday, the price is also high.` | `Today, the price is high. Yesterday it **was** also high.` | Yesterday clause keeps present — common because the "is" was reused mechanically |
| `He has worked here for 10 years. He started in 2014.` | `He **has worked** here for 10 years. He **started** in 2014.` *(this is correct)* — but learners often write: `He worked here for 10 years. He starts in 2014.` | Aspect-collision when learner over-corrects after a present-perfect lesson |

---

## 9. Possessive and relative-clause structure in writing — `vi_write_possessive_relative`

**EN:** Sentence-level possessive-`'s` and relative-pronoun choice are
covered in `l1-vn-explanations.ts` (`vi_l1_possessive_s_missing`,
`vi_l1_relative_pronoun`). The writing-specific failures: **"the X of
me / of him"** as a default possessive (calque of `của tôi`),
**double-marked relative clauses** ("the man who his car is red") because
Vietnamese relative-like modification can retain a possessive pronoun,
and **resumptive pronouns** ("the man I met him") that survive into
written prose because they sound complete to the writer.

**VN:** Khác với quy tắc câu lẻ. Lỗi viết hay gặp: dùng "the X **of**
me" thay vì "my X" (dịch nguyên "của tôi"); mệnh đề quan hệ **gấp đôi
chủ ngữ** ("the man **who his car** is red") vì tiếng Việt cho phép
giữ đại từ sở hữu; **đại từ lặp lại** ("the man I met **him**") vẫn sót
trong câu viết vì người Việt thấy đầy đủ.

**Severity:** medium in formal writing; low in chat.

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `This is the book of me.` | `This is **my** book.` | "Cuốn sách của tôi" → "of me" — possessive `'s` not yet automatic |
| `The car of my brother is red.` | `**My brother's** car is red.` | Same "của X" pattern in writing |
| `The man who his car is red is my uncle.` | `The man **whose** car is red is my uncle.` | "Ông mà xe của ông đỏ" — VN retains the possessive pronoun in the relative clause; English collapses to `whose` |
| `The girl which I love her is from Hue.` | `The girl **I love** is from Hue.` *(or)* `The girl **whom I love** is from Hue.` | Resumptive "her" + wrong relative pronoun ("which" for person) |
| `The book what I bought yesterday is interesting.` | `The book **that** I bought yesterday is interesting.` | "What" used as relative pronoun — calque of VN "cái mà" |
| `The man I met him at the conference is famous.` | `The man **I met** at the conference is famous.` | Resumptive "him" — VN allows the pronoun in relative-like clauses |
| `My friend, his name is Tuan, is from Hanoi.` | `My friend **Tuan** is from Hanoi.` *(or)* `My friend, **whose name is** Tuan, is from Hanoi.` | "Bạn tôi, tên là Tuấn, ở Hà Nội" — VN appositive uses a full clause; EN uses appositive noun or `whose` |
| `The students which they are from Vietnam study hard.` | `The students **who are** from Vietnam study hard.` | Wrong relative + resumptive subject pronoun |
| `The city where I was born in is Hue.` | `The city **where I was born** is Hue.` *(or)* `The city **I was born in** is Hue.` | Double-marking: relative adverb "where" + preposition "in" — only one allowed |
| `The reason why I came is because I missed home.` | `The reason **I came** is **that** I missed home.` *(or, more relaxed:)* `I came **because** I missed home.` | "Lý do tại sao mà…là vì…" stacked subordinators — VN style |
| `Vietnam, it is a country which is in Southeast Asia.` | `Vietnam, **a country in Southeast Asia**, …` *(appositive)* *(or)* `Vietnam is a country in Southeast Asia.` | Topic-pickup "it" + heavy relative clause; appositive would be cleaner |
| `My sister she lives in Saigon.` | `My sister lives in Saigon.` | Subject doubled — VN topic + comment leaking; appears repeatedly in writing |
| `The team that I am working with them is small.` | `The team **I work with** is small.` | Relative clause + resumptive object "them"; one or the other, not both |
| `Tuan, my friend who he is a doctor, helped me.` | `Tuan, my friend **who is a doctor**, helped me.` *(or)* `My friend Tuan, a doctor, helped me.` | Appositive + relative clause with resumptive subject |

---

## 10. False cognates and direct calques — `vi_write_calques`

**EN:** Placement covers some of this at sentence level
(`literal-vietnamese-calques`). The writing-specific surface: longer
calques that survive **because they form plausible English sentences**.
"Open the light" is obvious; "with the development of modern society"
is invisible to the writer but reads as IELTS-essay padding. Vietnamese
academic English has a recurring set of calques imported from VN
journalism / Communist Party stylistics — "with the development of",
"more and more", "in nowadays", "according to me" — that appear in
essay introductions and never spontaneously in native English.

> needsReview: the "Communist Party stylistics" sourcing is the most
> politically loaded claim in the doc. The calques are real and the
> pattern is widely observed; the *attribution* (whether the rhetorical
> source is official journalism, state textbooks, IELTS-prep templates,
> or some mix) needs a Vietnamese-applied-linguistics citation rather
> than founder-judgement framing before this ships in any user-facing UI.

**VN:** Khác với calque ngắn ở từng câu (placement có rồi). Lỗi viết là
**calque dài** vẫn nghe ổn trong tiếng Anh — không bị bắt ngay nhưng
đọc thấy "Vietlish": "with the development of modern society", "more
and more", "in nowadays", "according to me"… Đa số lấy từ phong cách
báo chí và văn chính luận Việt Nam.

**Severity:** medium for IELTS / TOEFL essays (kills Lexical Resource
band). Low for chat.

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `With the development of modern society, English becomes more important.` | `As modern society develops, English becomes increasingly important.` *(or just)* `English is increasingly important today.` | "Cùng với sự phát triển của xã hội hiện đại" — VN journalism boilerplate |
| `More and more people are learning English nowadays.` | `Increasingly, people are learning English.` *(or)* `More people are learning English than ever before.` | "Ngày càng nhiều" + "ngày nay" — both calqued, both intact |
| `In nowadays, the internet is everywhere.` | `**Today**, the internet is everywhere.` *(or)* `The internet is everywhere now.` | "Vào ngày nay" — calque; "in nowadays" is not English |
| `According to me, English is the most useful language.` | `**In my view**, English is the most useful language.` *(or)* `**To me**, English is the most useful language.` | "Theo tôi" → "according to me"; English reserves "according to X" for external sources |
| `In the conclusion, I want to repeat that pollution is serious.` | `In conclusion, pollution is serious.` *(or just)* `To conclude: pollution is serious.` | Genre-frame "Trong phần kết luận" + "tôi muốn nhắc lại" — both calqued |
| `I have a busy schedule, so I cannot arrange time to meet you.` | `I'm busy, so I can't make time to meet.` | "Sắp xếp thời gian" → "arrange time" — VN compound calque |
| `Open the light, please.` | `Turn on the light, please.` | Already in placement; included for completeness |
| `Close the wifi.` | `Turn off the wifi.` *(or)* `Disconnect the wifi.` | "Tắt wifi" → "close wifi" |
| `I will go home by walking.` | `I'll walk home.` *(or)* `I'll go home on foot.` | "Đi bộ về nhà" — "by walking" is over-literal |
| `She graduated **from** university **with** the high mark.` | `She graduated from university **with high marks**.` *(or)* `She graduated with honours.` | "Tốt nghiệp với điểm cao" — close, but "with the high mark" reads odd |
| `My father has the high position in the company.` | `My father is in a senior position at the company.` *(or)* `My father holds a senior role.` | "Có chức vụ cao" — calqued; "the high position" sounds like a job title |
| `He gave me a lot of pressure.` | `He put a lot of pressure on me.` | "Cho tôi áp lực" — VN "cho" wants "give" in EN; English uses "put pressure on" |
| `The salary is too low, cannot afford the life.` | `The salary is too low to live on.` | "Không đủ sống" — "afford the life" is a calque-collapse |
| `Please feedback me your opinion.` | `Please share your feedback.` *(or)* `Please get back to me with your thoughts.` | "Feedback" used as verb in VN business English; English prefers noun |
| `I will try my best to do well.` | `I'll do my best.` | Doubled effort marker — VN "cố gắng hết sức để làm tốt" |
| `In my hometown, there are many beautiful sceneries.` | `My hometown has many beautiful views.` *(or)* `…beautiful scenery.` | "Phong cảnh đẹp" plural with -s, but "scenery" is uncountable |
| `Recently in recent years, the economy is growing fast.` | `In recent years, the economy has grown quickly.` | "Gần đây trong những năm gần đây" — doubled time-frame, calqued |
| `I want to share with you about my experience.` | `I want to share my experience with you.` | "Chia sẻ với bạn về…" — preposition order calqued |

---

## 11. Punctuation transfer — `vi_write_punctuation`

**EN:** Vietnamese punctuation conventions are similar to French (which
influenced VN typography under colonial rule) and to mobile-chat
informality.

> needsReview: the broad "French colonial influence on VN punctuation"
> framing is plausible but oversimplified. Modern VN typography is a
> mix of French-era conventions (spacing around `:` `;`), Soviet/Russian-
> textbook conventions (1950s-80s education imports), and recent Anglo
> conventions (post-2000 chat / web). Calling the whole basket "French
> legacy" is a teaching shortcut that needs a typography-history source
> before shipping. The systematic transfers:

- **Multiple exclamation marks** ("Thank you!!!") — VN chat habit
- **Ellipsis as politeness softener** ("I think we should… reconsider…")
  carrying the function of VN "ạ / nhé / nhỉ"
- **Em-dash / en-dash / hyphen confusion**
- **Space before colons / semicolons** (French legacy in VN typesetting:
  "Pour Chau : voici…")
- **Quotation-mark style** — VN sometimes uses `« »` (French) or curly
  quotes inconsistently (needsReview — modern VN print mostly uses
  straight `"..."`; `« »` survives mainly in older academic typesetting
  and some journalism, not in learner writing. The frequency claim is
  probably overstated.)
- **Decimal comma vs decimal point** (VN: `1.500.000` for 1.5M, EN:
  `1,500,000`) (needsReview — this convention is shared with most of
  continental Europe; flagging it as "Vietnamese transfer" is technically
  correct from the learner's frame but not VN-specific in origin.)
- **Comma before subject in topicalised sentence** ("This problem, we
  must solve") — overlaps with topic-comment but punctuation-specific
- **Period inside parentheses placement** — VN tends to place period
  before close-paren in display contexts

**VN:** Dấu câu tiếng Việt chịu ảnh hưởng tiếng Pháp (di sản thuộc địa)
và thói quen chat trên điện thoại. Các lỗi chuyển di hệ thống:

- **Nhiều dấu chấm than** ("Thank you!!!") — thói quen chat
- **Dấu ba chấm thay cho "ạ/nhé/nhỉ"** — làm nhẹ giọng nhưng tiếng Anh
  viết nghiêm túc không dùng vậy
- **Khoảng trắng trước dấu `:` và `;`** — di sản tiếng Pháp
- **Dấu nháy kép kiểu `« »`** thỉnh thoảng xuất hiện
- **Dấu thập phân** — VN dùng dấu chấm, EN dùng dấu phẩy (và ngược lại
  cho hàng nghìn)

**Severity:** medium for professional email and academic essay (a
"Thanks!!!" in a cover letter is a real signal). Low for personal chat.

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| `Thank you so much for your help!!!` *(in a job-application thank-you note)* | `Thank you so much for your help.` *(or single `!`)* | VN chat habit; multiple `!!!` reads as immature in formal genres |
| `I think we should… reconsider… this plan… maybe later…` | `I think we should reconsider this plan, perhaps later.` | Ellipsis-as-softener — VN "ạ / nhé / chắc là…" carried over |
| `Dear Sir : I am writing to apply…` | `Dear Sir, I am writing to apply…` *(or)* `Dear Sir: I am writing to apply…` | Space before `:` — French/VN typographic legacy |
| `He said " I am tired " and left.` | `He said, "I am tired," and left.` | Space inside quotation marks + missing comma before quoted speech |
| `The price is 1.500.000 VND.` *(in EN copy)* | `The price is 1,500,000 VND.` *(US/UK)* *(or, if writing for VN audience:)* `The price is 1.500.000 VND.` *(locale-correct)* | Thousands separator collision — VN uses `.`, EN uses `,` |
| `I bought 3,5 kg of rice.` *(in EN copy)* | `I bought 3.5 kg of rice.` | Decimal comma vs point |
| `The meeting is at 9 :30 am.` | `The meeting is at 9:30 am.` | Space before `:` in time |
| `She is from Vietnam «my country»` | `She is from Vietnam — my country.` *(or)* `She is from Vietnam (my country).` | French-style guillemets transferred; EN prefers parens or em-dash |
| `This problem , we must solve.` | `We must solve this problem.` *(or, only if topicalisation is justified:)* `This problem — we must solve it.` | Topicalising comma; English prefers em-dash if you must front the topic |
| `Hello !` | `Hello!` | Space before `!` — French legacy |
| `(I went home early.)` *(inside a paragraph)* | `(I went home early).` *(if period belongs to the larger sentence)* *(or)* `I went home early. (Or so I thought.)` | Period placement around parens — VN tradition vs EN convention |
| `I love Vietnam ; it is my home.` | `I love Vietnam; it is my home.` | Space before semicolon |
| `Subject : application for marketing role` | `Subject: Application for marketing role` | Email subject line — space before `:` + missing title-case |
| `She said : "I am tired."` | `She said: "I am tired."` *(or, more idiomatic EN:)* `She said, "I am tired."` | Both space-before-colon and the colon-vs-comma choice; EN dialogue uses comma |

---

## 12. Essay structure conventions (IELTS Task 2 / TOEFL independent) — `vi_write_essay_structure`

**EN:** Vietnamese learners arrive at IELTS Task 2 / TOEFL with a
**listing reflex**: present a topic, list three sub-topics with a marker
("Firstly… Secondly… Thirdly…"), restate in conclusion. The Vietnamese
academic essay tradition (in Vietnamese) is comfortable with this
structure; the IELTS band descriptors at Band 7+ explicitly want
**argument**, not enumeration. (needsReview — "the VN academic essay
tradition" is treated as monolithic here; in practice VN secondary-
school văn nghị luận, university-level academic writing, and IELTS-prep
templates each have different conventions, and the listing-reflex is
probably more an artefact of IELTS-prep coaching than of academic VN
per se.) Common writing failures:

- Listing instead of arguing
- Mechanical "Firstly / Secondly / Finally" scaffolding visible
- "In conclusion" + verbatim restate of intro
- No counter-argument addressed
- Body paragraph with no claim — just facts
- Examples without analysis ("for example, [story]" — then nothing)
- Thesis = topic restated, not a position

**VN:** Người học tiếng Anh Việt Nam mang vào IELTS Task 2 thói quen
**liệt kê**: nêu chủ đề, kể ba ý phụ ("Thứ nhất… Thứ hai… Thứ ba…"),
kết lại bằng nhắc lại mở bài. Truyền thống văn nghị luận Việt Nam chấp
nhận cấu trúc này; IELTS Band 7+ đòi **lập luận**, không phải liệt kê.

**Severity:** high for IELTS / TOEFL prep (literally a band difference).
Low for personal essays / chat.

| learner produces | target form | why this happens in Vietnamese |
|---|---|---|
| **Thesis:** `In this essay, I will discuss three points: pollution, traffic, and education.` | **Thesis:** `Vietnam's three pressing problems — pollution, traffic, and education — share a single root: uncontrolled urban growth.` | First version states the topic; second states a **position**. VN essay tradition asks for the former |
| **Body topic sentence:** `Firstly, pollution is a problem.` | **Body topic sentence:** `Pollution, the most visible of these problems, has tripled in measured PM2.5 since 2015.` | Mechanical "Firstly" + bare claim; replace with content-rich topic sentence |
| **Body content:** `For example, in Hanoi the air is very dirty.` *(then nothing)* | **Body content:** `For example, Hanoi's air-quality index regularly exceeds 200, a level the WHO classifies as unsafe — meaning even healthy adults are advised to stay indoors.` | "For example" introduces but the analysis doesn't follow |
| **Conclusion:** `In conclusion, I have discussed three points: pollution, traffic, and education. These are three problems of Vietnam.` | **Conclusion:** `The three problems are not three problems — they're three faces of one. Addressing any of them in isolation will fail.` | Restate-the-intro conclusion; English C1 wants synthesis |
| **Two-sided essay opening:** `Online learning has many advantages. Online learning has many disadvantages.` | **Opening:** `Online learning's advantages are now obvious — its costs less so. This essay weighs the two.` | Listing both sides as flat claims; English wants the **tension** stated |
| **Counter-argument:** *(absent — the essay only argues one side)* | **Counter-argument:** `Critics argue that traditional classrooms offer irreplaceable peer interaction. That objection is real, but…` | VN essay tradition doesn't always require addressing the counter-side; IELTS Band 7+ does |
| **Hedge stack:** `Firstly, in my opinion, I think that maybe pollution might possibly be a serious problem.` | `Pollution is a serious problem.` *(direct claim, no need for triple hedge in the topic sentence)* | Compounded VN-essay habits: order marker + opinion marker + hedge |
| **Generic example:** `For example, many people think this.` | `For example, a 2024 survey of 1,200 Hanoi residents found 78% rating traffic the city's worst problem.` | "Many people think" is not an example; English Task 2 examples want specifics |
| **Pseudo-conclusion in middle of body:** `So, in conclusion of this paragraph, pollution is bad.` | `These figures suggest that pollution, more than any other factor, drives the city's worsening livability.` | Two paragraph conclusions in one essay because each paragraph closes with a mini "In conclusion" — VN paragraph-essay habit |
| **Listing markers stacked:** `Firstly… Secondly… Thirdly… Lastly… Finally…` *(five markers in a four-paragraph essay)* | *(remove markers entirely; let the content carry the structure)* | One marker per paragraph maximum at C1; ideally zero |
| **Thesis = topic restated:** `The topic is whether students should wear uniforms. In this essay, I will discuss this topic.` | `Students should wear uniforms, but only through the end of secondary school.` *(or any concrete position)* | Genre-template restating the prompt instead of taking a position |
| **Cover-everything intro:** `Education is very important. It is the foundation of society. Many countries have different education systems. In Vietnam, education is improving. In this essay, I will discuss the role of homework in modern education.` | `Whether homework actually improves learning has become an open question — even in Vietnam, where two-hour nightly assignments are standard.` | Five generic sentences before reaching the prompt; VN essay tradition warms up first |
| **Quotation-as-evidence:** `As Ho Chi Minh said, "Learning is a lifelong journey." This shows that education is important.` | *(omit; aphorisms are not evidence in IELTS)* | VN essay tradition opens with a quoted authority; IELTS examiners discount this |
| **Final paragraph drift:** *(starts on conclusion, drifts into new argument)* | *(conclusion should not introduce new evidence)* | VN essay tradition allows the final paragraph to bring in a fresh angle; IELTS treats this as a coherence error |

---

## Future work — patterns considered and held back

These were on the candidate list but rejected for this draft. Each has a
one-line reason; revisit when the corpus gives evidence.

- **Spelling and capitalisation patterns** (`advise/advice`, `effect/affect`,
  `loose/lose`, proper-noun caps) — real, but mostly L2-universal not
  VN-specific; risks turning the doc into a general-English spelling list.
  Add as `vi_write_spelling` only when a VN-specific source is identified
  (e.g. Vietnamese romanisation interfering with `d/gi/r` in proper
  names — flagged in placement under "Open Patterns").
- **Genre-specific micro-conventions** (CV bullet-point voice, cover-letter
  opening lines, LinkedIn message register) — better as a separate
  "professional writing playbook" than as a transfer-error taxonomy.
- **Citation style** (APA / MLA in-text citations, quotation embedding) —
  university-specific; out of scope for IELTS/TOEFL-focused MercyBlade
  audience.
- **Email subject-line conventions** (case, length, urgency markers) —
  worth covering eventually, but it's an English-business norm, not
  Vietnamese-specific transfer.
- **Code-switching markers in chat** (mixing VN words into EN sentences:
  "ok la", "thanks nhé") — separate phenomenon; not an error per se.
- **Honorific kinship pronouns leaking into English** ("my older brother
  he…", "my aunt she…") — already covered by `over-explicit-pronoun-reference`
  in placement.
- **Vietnamese-tone-influenced typography** (smiley density, sticker
  references) — out of scope: typography, not language.
- **Discourse marker stacking in chat** ("ok so anyway like basically") —
  VN-learner-specific only when paired with specific VN translations
  ("thì là mà"); evidence insufficient to anchor.

## Format note — for C4 (schema owner) / A4 (downstream)

C4 owns the canonical schema. This doc is structured so it can be
mechanically transformed into a TypeScript module parallel to
`vn-phoneme-map.ts` and the shape C1's `vi-grammar.md` proposes. To
keep the two docs aligned, the field names below mirror C1's sketch
(camelCase, TS-native):

```ts
// sketch — not authoritative; C4 decides the final shape
export interface WritingErrorFamily {
  id: string;                       // 'vi_write_cohesion_parataxis'
  family: string;                   // 'cohesion' | 'register' | 'punctuation' | …
  descriptionEn: string;            // one-line EN summary
  descriptionVi: string;            // one-line VI summary
  severity: 'high' | 'medium' | 'low';
  severityRationale: string;        // one sentence — why this tier
  examples: Array<{
    learnerProduces: string;
    targetForm: string;
    whyViL1?: string;               // optional VN-side gloss
  }>;
  cefrMin?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  cefrMax?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  upstreamRefs?: string[];          // e.g. ['placement:topic-comment-fronting',
                                    //       'rules:vi_l1_possessive_s_missing',
                                    //       'grammar:topic-comment']
  needsReview?: boolean;            // honest-uncertainty marker (PRINCIPLES §7)
}
```

Anchors worth preserving:

- **Per-family ID** in snake_case (`vi_write_<family>`) — matches the
  `src/lib/feedback/rule-packs/vi/rules.ts` convention until C4 locks
  one namespace across the placement file, the detector, C1's grammar
  doc, and this writing doc.
- **Per-example `whyViL1`** is optional, not every example needs it;
  some errors are self-explanatory.
- **Cross-references to upstream taxonomies** (`placement:…`,
  `rules:vi_l1_…`, `grammar:…`) so a writing-layer rule fire doesn't
  shadow a sentence-layer fire when both apply. The runtime policy
  (correct the highest-severity error first; absorb side-effect
  cleanups; leave low-tier siblings) is the same one C1 flags in
  `vi-grammar.md` under "Cross-family interaction notes".
- **`needsReview`** mirrors `l1-vn-explanations.ts.needs_review` — when
  the VN-side linguistic claim is a teaching heuristic rather than a
  verified generalisation, flag it.

Reconciliation points C4 inherits from this doc + C1's doc:

1. **Tag namespace.** Three conventions currently coexist:
   `vi_l1_missing_article` (detector, snake_case),
   `final-consonant-cluster-reduction` (placement file, kebab-lower),
   and (before today) C1+C2 docs used kebab-case. Per Chau's
   alignment note, both `vi-grammar.md` and this doc now use
   snake_case to track the detector. C4 picks the final convention.
2. **Severity-spelling.** `vnL1Interference.ts` writes `'med'`; both
   taxonomy docs write `'medium'`. C4 locks one.
3. **Severity is consumer-side.** Not a runtime tie-breaker between
   competing rules — that stays first-match-wins via the ordered
   registry. Both docs treat severity as the tutor-behaviour signal
   only.

Conversion path: this Markdown doc → a script in `scripts/` extracts the
12 section headers + table rows → emits `src/data/vi-writing-patterns.ts`
(or whatever name C4 lands) in the locked schema. The Markdown stays the
source of truth; the generated TS is the consumed artifact. Same
relationship as `placement-vn-l1-interference-taxonomy.md` →
`src/data/placement/vnL1Interference.ts`.

## Anchors and references

- `STRATEGY.md` (V3 — Competitive thesis) — "deep enough to fix adult Vietlish" is the winning
  sentence this document operationalises for the writing surface.
- `PRINCIPLES.md` §7 — honest uncertainty markers (`needs_review`,
  `TODO: verify`) belong in every entry whose VN-side claim isn't
  textbook-confirmed.
- `src/lib/pronunciation/vn-phoneme-map.ts` — tone, scale, and
  curated-not-encyclopedic discipline this doc mirrors.
- `src/lib/feedback/l1-vn-explanations.ts` — 60 per-sentence rules with
  teacher-voice Vietnamese; the writing layer **extends** these into
  multi-sentence territory, never replaces them.
- `src/lib/feedback/rule-packs/vi/rules.ts` — ordered registry the
  detector evaluates per sentence; writing-layer rules would be a
  separate pack (`writingRules.ts`) consumed by a paragraph-level
  detector, not inserted into the sentence registry.
- `docs/placement-vn-l1-interference-taxonomy.md` — the upstream
  placement-grading routing surface; this doc's `vi_write_topic_comment`,
  `vi_write_cohesion_parataxis`, `vi_write_register` overlap its
  `topic-comment-fronting`, `connector-overuse-and-stacking`,
  `formality-calibration` and `indirect-main-point-delay` patterns.
- `docs/l1-taxonomies/vi-grammar.md` — C1's parallel sentence-level
  grammar taxonomy. When in doubt: if the error is bounded by a single
  finite verb, it belongs to C1; if it requires reading more than one
  sentence to detect, it belongs here.
