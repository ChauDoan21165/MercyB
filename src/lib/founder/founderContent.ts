// src/lib/founder/founderContent.ts
//
// Step 11 — founder content layer ("Made by Chau" identity moat).
//
// Bilingual content drawn ONLY from PRODUCT_CONFIG.founder + the
// publicly-known beats Chau has already documented in the existing
// blog post `cau-chuyen-mercyblade-tu-mot-nha-bao-luu-vong.md`:
//
//   - Vietnamese journalist
//   - exile / forced relocation
//   - Article 117 (Vietnam's penal code on "anti-state propaganda")
//   - Grande Prairie (current home)
//   - 20+ years of speaking English without fully understanding it
//   - the "I am go" / "I am going" moment with his daughter
//   - the five non-negotiables (CLAUDE.md mission)
//
// Content discipline:
//   - We do NOT invent specific dates, employers, names of newspapers,
//     case numbers, or details Chau hasn't already published. Where the
//     existing blog post says "[CHAU TODO]", this file leaves the slot
//     vague (e.g. "many years" instead of a specific year). Chau swaps
//     specifics later without breaking the data shape.
//   - Every entry is bilingual VN-first; English mirrors meaning, not
//     literal word-for-word.
//   - Tone: dignified, quietly confident. No sob story. No boast.
//   - Quotes are SHORT — they appear in sidebars, footers, hero rails.

export type FounderQuote = {
  /** URL-safe id so a UI can pick a stable rotation seed. */
  id: string;
  /** Vietnamese — primary surface. */
  vi: string;
  /** English — natural, not a literal calque. */
  en: string;
  /**
   * Where this quote feels appropriate. UI selects by context:
   *  - 'pricing'       → next to the price card
   *  - 'blog-footer'   → below an article body
   *  - 'landing'       → in a soft mid-page rail
   *  - 'onboarding'    → on success-state
   *  - 'general'       → safe everywhere (default fallback)
   */
  context: "pricing" | "blog-footer" | "landing" | "onboarding" | "general";
};

export type FounderMilestone = {
  id: string;
  /** Loose label — "many years ago", "after exile", "today". Avoid invented dates. */
  when_vi: string;
  when_en: string;
  /** One-sentence description of the beat. */
  vi: string;
  en: string;
};

export type FounderStruggle = {
  id: string;
  /** Short, vignette-style title. */
  title_vi: string;
  title_en: string;
  /** 2–4 sentence first-person vignette. Universal-Vietnamese-learner experience. */
  vi: string;
  en: string;
  /** Optional L1 weakness tag this struggle illustrates. */
  l1_tag?: string;
};

// ── Quotes ──────────────────────────────────────────────────────────────

export const FOUNDER_QUOTES: readonly FounderQuote[] = Object.freeze([
  {
    id: "made-for-vietnamese-not-everyone",
    vi: "MercyBlade không làm cho mọi người. Nó làm cho người Việt — và đó là việc tôi vui vẻ thừa nhận.",
    en: "MercyBlade isn't for everyone. It's for Vietnamese learners — and that's a trade-off I'm happy to admit.",
    context: "landing",
  },
  {
    id: "twenty-years-misunderstanding",
    vi: "Tôi nói tiếng Anh hai mươi năm trước khi nhận ra mình hiểu sai một quy tắc đơn giản nhất.",
    en: "I spoke English for twenty years before I realised I'd misunderstood the simplest rule of all.",
    context: "general",
  },
  {
    id: "vi-first-not-translated",
    vi: "Mỗi giải thích bắt đầu từ tiếng Việt — không phải tiếng Anh dịch ra. Đây là sự khác biệt.",
    en: "Every explanation starts in Vietnamese — not as a translation from English. That's the whole difference.",
    context: "pricing",
  },
  {
    id: "outcome-over-engagement",
    vi: "Nếu một tính năng giữ chân học viên nhưng không dạy họ — tôi bỏ tính năng đó.",
    en: "If a feature boosts retention but doesn't teach the learner, I cut the feature.",
    context: "general",
  },
  {
    id: "kids-mode-sacred",
    vi: "Kids mode không có quảng cáo, không cần đăng nhập, không có CTA bán hàng. Phụ huynh tin chúng tôi.",
    en: "Kids mode has no ads, no login, no sales CTA. Parents trust us — we don't betray that.",
    context: "blog-footer",
  },
  {
    id: "small-but-right",
    vi: "Thà có năm mươi quy tắc đúng và sâu, còn hơn năm nghìn bài lặt vặt.",
    en: "I'd rather have fifty rules done right and deep than five thousand half-done lessons.",
    context: "general",
  },
  {
    id: "exile-clarified",
    vi: "Lưu vong dạy tôi điều mà nghề báo không dạy được: bạn chỉ thực sự hiểu một thứ khi mất nó.",
    en: "Exile taught me what journalism couldn't: you only really understand a thing once you've lost it.",
    context: "landing",
  },
  {
    id: "for-the-mother-on-night-shift",
    vi: "Tôi xây MercyBlade cho người mẹ làm ca đêm, ôn tiếng Anh trên xe bus về nhà — không phải cho người ngồi lớp ở Mỹ.",
    en: "I built MercyBlade for the mother on a night shift, studying English on the bus home — not for the student in a US classroom.",
    context: "landing",
  },
  {
    id: "honest-not-fluent",
    vi: "Tiếng Anh của tôi không hoàn hảo. Nhưng nó đủ để xây cái này — và đó là thông điệp.",
    en: "My English isn't perfect. But it's enough to build this — and that's the point.",
    context: "general",
  },
  {
    id: "promise-to-vietnam",
    vi: "Tôi không hứa thay đổi cuộc đời bạn. Tôi hứa app này được làm cho bạn — không phải cho ai khác.",
    en: "I don't promise this app will change your life. I promise it was made for you — not for anyone else.",
    context: "onboarding",
  },
  {
    id: "moat-is-empathy",
    vi: "Một AI có thể bắt chước giọng tôi. Nó không thể bắt chước hai mươi năm sai.",
    en: "An AI can mimic my voice. It can't mimic twenty years of getting it wrong.",
    context: "pricing",
  },
  {
    id: "outcomes-define",
    vi: "Học viên đỗ IELTS, nhận việc ở nước ngoài, dạy con không truyền lại sai lầm — đó là cách tôi đo MercyBlade.",
    en: "Students who pass IELTS, land jobs abroad, teach their kids without passing on the same mistakes — that's how I measure MercyBlade.",
    context: "general",
  },
]);

// ── Milestones — abstract beats only, no invented specifics ───────────

export const FOUNDER_MILESTONES: readonly FounderMilestone[] = Object.freeze([
  {
    id: "journalism-vietnam",
    when_vi: "Trước khi rời Việt Nam",
    when_en: "Before leaving Vietnam",
    vi: "Nhiều năm làm báo về xã hội, văn hóa, và những đề tài chính quyền không muốn thấy trên báo.",
    en: "Many years as a journalist covering society, culture, and the topics the government preferred not to see in print.",
  },
  {
    id: "article-117",
    when_vi: "Article 117",
    when_en: "Article 117",
    vi: "Điều 117 Bộ luật Hình sự Việt Nam — tội 'tuyên truyền chống Nhà nước'. Đây là lý do nhiều nhà báo Việt phải rời đất nước.",
    en: "Article 117 of Vietnam's penal code — 'anti-state propaganda'. The reason many Vietnamese journalists have to leave.",
  },
  {
    id: "exile",
    when_vi: "Đi lưu vong",
    when_en: "Going into exile",
    vi: "Rời Việt Nam không phải tự nguyện. Hành lý: một chiếc laptop, vài quyển sổ tay, và tiếng Anh 'đủ sống'.",
    en: "Leaving Vietnam was not voluntary. The luggage: a laptop, a few notebooks, and English 'enough to get by'.",
  },
  {
    id: "grande-prairie",
    when_vi: "Đến Grande Prairie",
    when_en: "Settling in Grande Prairie",
    vi: "Định cư ở Grande Prairie — xa Sài Gòn, xa cộng đồng báo chí cũ. Bắt đầu lại từ đầu, mọi thứ.",
    en: "Settled in Grande Prairie — far from Saigon, far from the old newsroom. Starting over, from scratch, in everything.",
  },
  {
    id: "the-i-am-go-night",
    when_vi: "Đêm 'I am go'",
    when_en: "The 'I am go' night",
    vi: "Đêm con gái tám tuổi hỏi vì sao 'I am going' đúng nhưng 'I am go' lại sai. Câu trả lời không có. Đây là lúc MercyBlade được hình dung lần đầu.",
    en: "The night an eight-year-old daughter asked why 'I am going' is right but 'I am go' is wrong. There was no answer. That's when MercyBlade was first imagined.",
  },
  {
    id: "first-line-of-code",
    when_vi: "Dòng code đầu tiên",
    when_en: "First line of code",
    vi: "Bắt đầu xây MercyBlade — không phải như một startup, mà như một câu trả lời cá nhân cho câu hỏi của con gái.",
    en: "Started building MercyBlade — not as a startup, but as a personal answer to a daughter's question.",
  },
  {
    id: "five-non-negotiables",
    when_vi: "Năm nguyên tắc nền tảng",
    when_en: "The five non-negotiables",
    vi: "Vietnamese-first khắp nơi, kids mode thiêng liêng, mobile-first, outcomes hơn engagement, không có VIP. Viết ra trong tuần đầu, vẫn giữ đến hôm nay.",
    en: "Vietnamese-first everywhere, kids mode is sacred, mobile-first, outcomes over engagement, no VIP tier. Written in the first week, still in force today.",
  },
  {
    id: "today",
    when_vi: "Hôm nay",
    when_en: "Today",
    vi: "MercyBlade là website công khai, một cộng đồng học viên người Việt đang lớn lên, và một lời hứa: app này được làm cho bạn.",
    en: "Today, MercyBlade is a live web product, a growing community of Vietnamese learners, and a promise: this app is made for you.",
  },
]);

// ── Struggles — universal-Vietnamese-learner vignettes, first person ─

export const FOUNDER_STRUGGLES: readonly FounderStruggle[] = Object.freeze([
  {
    id: "i-am-go",
    title_vi: "'I am go' — câu hỏi tôi không trả lời được",
    title_en: "'I am go' — the question I couldn't answer",
    vi: "Con gái tám tuổi của tôi hỏi vì sao 'I am going' đúng nhưng 'I am go' lại sai. Tôi mở miệng định trả lời rồi đứng im. Hai mươi năm tôi nói tiếng Anh hằng ngày — và một câu hỏi đơn giản nhất từ một đứa trẻ làm tôi đứng hình.",
    en: "My eight-year-old daughter asked why 'I am going' is right but 'I am go' is wrong. I opened my mouth and stopped. Twenty years of speaking English every day — and the simplest possible question from a child stopped me cold.",
  },
  {
    id: "develop-three-weeks",
    title_vi: "Phát âm sai 'develop' suốt nhiều tuần",
    title_en: "Mispronouncing 'develop' for weeks",
    vi: "Tôi nhấn đầu — DE-velop — vì nhìn chữ là vậy. Đồng nghiệp người Mỹ không sửa, vì họ đoán được. Đến khi một học viên Anh hỏi 'You mean di-VEL-op?' tôi mới biết. Nhiều tuần lặp lại lỗi mà không ai nói.",
    en: "I stressed the first syllable — DE-velop — because that's what the spelling looked like. American colleagues didn't correct me, because they could guess. It took an English student asking 'You mean di-VEL-op?' before I learned. Weeks of the same mistake, no one saying anything.",
  },
  {
    id: "missing-final-s",
    title_vi: "Bỏ -s cuối — và mọi câu hỏi đều thành câu kể",
    title_en: "Dropping the final -s — and every question becoming a statement",
    vi: "Tôi nói 'She go to work' và không ai nhăn mặt — nên tôi tưởng không sao. Sai đó là sai dấu hiệu nhỏ nhưng nó tích lại thành 'tiếng Anh nghe lạ'. Người Việt mình không ai dạy lỗi này, vì chính họ cũng mắc.",
    en: "I'd say 'She go to work' and no one winced — so I thought it was fine. That tiny missing -s adds up: it's the sound of 'foreign English' even when nothing else is wrong. No Vietnamese person taught me to fix it, because they made the same mistake.",
    l1_tag: "vi_l1_3rd_person_s",
  },
  {
    id: "polish-vs-Polish",
    title_vi: "'Polish' vs 'polish' — và tôi không biết",
    title_en: "'Polish' vs 'polish' — and I had no idea",
    vi: "Một khách hàng người Mỹ hỏi 'Are you Polish?'. Tôi nghĩ họ hỏi tôi có làm móng không. Nhân viên tiệm nail Việt nào cũng từng có khoảnh khắc như thế — sai một âm, hiểu lệch toàn bộ câu.",
    en: "An American customer asked 'Are you Polish?' I thought they were asking if I did nails. Every Vietnamese nail tech has had a moment like that — one wrong vowel, and the whole sentence flips.",
  },
  {
    id: "interview-frozen",
    title_vi: "Cuộc phỏng vấn tôi đứng hình",
    title_en: "The interview where I froze",
    vi: "Phỏng vấn xin việc đầu tiên ở nước ngoài, người ta hỏi 'Tell me about yourself'. Tôi đã chuẩn bị câu trả lời bằng tiếng Anh — nhưng não tôi đột nhiên dịch ngược về tiếng Việt. Tôi nói được ba câu rồi đứng im. Họ không gọi lại.",
    en: "First overseas job interview, they asked 'Tell me about yourself.' I'd rehearsed in English — but my brain suddenly flipped back to Vietnamese. I got three sentences out and stopped. They didn't call back.",
  },
  {
    id: "kids-translate-for-parents",
    title_vi: "Con dịch cho bố mẹ ở phòng khám",
    title_en: "Kids translating for parents at the doctor",
    vi: "Tôi từng đi cùng một gia đình Việt đến phòng khám, đứa con mười tuổi dịch cho bố. Đứa bé phải dịch chẩn đoán y khoa cho người cha. Tôi nghĩ: việc của một app đáng làm là khiến cảnh đó không cần xảy ra.",
    en: "I went with a Vietnamese family to a clinic once. The ten-year-old translated medical terms for her father. A child carrying a medical diagnosis to a parent. I thought: an app worth building is one that makes that scene unnecessary.",
  },
  {
    id: "cant-cant",
    title_vi: "'Can't' nuốt /t/ — và tôi nói ngược ý mình",
    title_en: "Swallowing the /t/ in 'can't' — and saying the opposite",
    vi: "Người Việt mình quen bỏ phụ âm cuối. Khi tôi nói 'I can't help you' nhưng nuốt /t/, khách nghe 'I can help you'. Cả hai bên hiểu ngược chiều — đến lúc rõ thì khách đã giận.",
    en: "Vietnamese speakers swallow final consonants. When I said 'I can't help you' and dropped the /t/, the customer heard 'I can help you'. Both sides going opposite directions — by the time we untangled it, the customer was already upset.",
  },
]);

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * Pick a quote suitable for `context`. Falls back to the union of
 * context-matched + 'general' quotes so every surface always has at
 * least one option. Caller picks the index (random, rotation, or
 * deterministic seed).
 */
export function quotesForContext(context: FounderQuote["context"]): FounderQuote[] {
  return FOUNDER_QUOTES.filter((q) => q.context === context || q.context === "general");
}
