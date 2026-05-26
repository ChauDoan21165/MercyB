// src/lib/writing-feedback/vn-writing-patterns.ts
//
// Vietnamese-specific IELTS Writing Task 2 error patterns.
//
// The patterns and pedagogical commentary collected here are drawn from
// the broader literature on Vietnamese-English contrastive analysis and
// the public IELTS examiner training materials issued by IDP and
// Cambridge Assessment English. Specific pattern groupings (article
// omission, plural marking loss, comma-spliced run-ons, conclusion-as-
// thesis ordering, weak hedging) recur across:
//   - IDP "Common errors among Vietnamese IELTS test-takers" briefings
//   - Cambridge ESOL band-descriptor commentary on grammatical accuracy
//   - Tran (2007), Nguyen (2018) and similar peer-reviewed contrastive
//     studies on Vietnamese learners' written English
//
// All wrong/correct examples and Vietnamese pedagogical notes in this
// file are **original** — written for MercyBlade. None of this text is
// reproduced from a commercial prep book or test report.
//
// Detection note: this file is data-only. The matching heuristics live
// in scoreEssayVN.ts so the dictionary stays a pure reference doc.

export type VnWritingPatternId =
  | "missing_articles"
  | "plural_inconsistency"
  | "run_on_with_comma"
  | "overused_furthermore"
  | "thesis_in_conclusion"
  | "topic_sentence_missing"
  | "under_developed_body"
  | "vague_referent_pronouns"
  | "literal_translation_idioms"
  | "weak_hedging_absolute"
  | "list_without_synthesis"
  | "informal_register_in_essay"
  | "tense_inconsistency"
  | "comparison_structure_double"
  | "noun_clause_that_drop"
  | "subject_verb_agreement_collective"
  | "preposition_at_in_on"
  | "uncountable_treated_countable"
  | "and_then_chain"
  | "fronted_because_fragment"
  | "always_never_overuse"
  | "phrasal_verb_avoidance";

export interface VnWritingPatternExample {
  /** Wrong sentence as a Vietnamese learner would typically produce it. */
  wrong: string;
  /** Corrected version preserving the writer's intended meaning. */
  correct: string;
  /** Vietnamese explanation of WHY the wrong form happens (L1 transfer). */
  why_vi: string;
}

export interface VnWritingPattern {
  id: VnWritingPatternId;
  vi_name: string;
  en_name: string;
  description_vi: string;
  description_en: string;
  /**
   * Approximate impact on overall IELTS Writing Task 2 band when the
   * pattern recurs throughout the essay. Negative = drops the band.
   * Single occurrences usually don't move the band; recurring patterns
   * are what the IELTS examiner registers.
   */
  ielts_band_impact: number;
  examples: VnWritingPatternExample[];
}

export const VN_WRITING_PATTERNS: VnWritingPattern[] = [
  // ── Grammar-anchored patterns ─────────────────────────────────────
  {
    id: "missing_articles",
    vi_name: "Bỏ mạo từ a / an / the",
    en_name: "Missing articles",
    description_vi:
      "Tiếng Việt không có mạo từ. Người học thường bỏ a/an/the trước danh từ đếm được số ít hoặc danh từ đã xác định, làm câu sai ngữ pháp và giảm Grammatical Range.",
    description_en:
      "Vietnamese has no article system. Learners drop a/an/the before singular countable or specified nouns, producing ungrammatical noun phrases and lowering Grammatical Range.",
    ielts_band_impact: -1.0,
    examples: [
      {
        wrong: "Government should build new school in every district.",
        correct: "The government should build a new school in every district.",
        why_vi: "Tiếng Việt nói 'chính phủ' không có mạo từ; tiếng Anh cần 'the' khi nói về định chế cụ thể.",
      },
      {
        wrong: "Education plays important role in society.",
        correct: "Education plays an important role in society.",
        why_vi: "Cụm 'play a role' luôn cần 'a' — không có 'a' câu sẽ gãy nghĩa.",
      },
    ],
  },
  {
    id: "plural_inconsistency",
    vi_name: "Số nhiều không nhất quán",
    en_name: "Plural marking inconsistency",
    description_vi:
      "Tiếng Việt không đánh dấu số nhiều bằng đuôi từ. Bỏ -s ở danh từ số nhiều là lỗi tần suất cao trong bài viết người Việt — IELTS examiner tính như lỗi Grammar lặp lại.",
    description_en:
      "Vietnamese marks plurality lexically (e.g. 'những'), not morphologically. Dropping plural -s is high-frequency in VN learner writing and recurring instances visibly drag down Grammatical Range.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "Many student fail the exam every year.",
        correct: "Many students fail the exam every year.",
        why_vi: "'Many' luôn đi với danh từ số nhiều có -s.",
      },
      {
        wrong: "Children should learn three language at school.",
        correct: "Children should learn three languages at school.",
        why_vi: "Số đếm > 1 yêu cầu danh từ số nhiều.",
      },
    ],
  },
  {
    id: "run_on_with_comma",
    vi_name: "Câu nối bằng dấu phẩy (comma splice)",
    en_name: "Comma-spliced run-on sentence",
    description_vi:
      "Tiếng Việt cho phép nối hai mệnh đề độc lập bằng dấu phẩy. Tiếng Anh không — phải dùng dấu chấm, dấu chấm phẩy, hoặc liên từ. Comma splice phá Coherence và Grammar.",
    description_en:
      "Vietnamese permits linking two independent clauses with a comma. English does not — it requires a period, semicolon, or coordinating conjunction. Comma splices damage both Coherence and Grammar bands.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "I went to school, I studied math, I came home.",
        correct: "I went to school, studied math, and came home.",
        why_vi: "Tiếng Việt 'Tôi đi học, tôi học toán, tôi về nhà' đúng. Tiếng Anh phải gộp các động từ hoặc tách thành các câu riêng.",
      },
      {
        wrong: "Pollution is increasing, the government must act now.",
        correct: "Pollution is increasing; the government must act now.",
        why_vi: "Hai mệnh đề độc lập — dùng dấu chấm phẩy hoặc 'so'.",
      },
    ],
  },
  {
    id: "comparison_structure_double",
    vi_name: "So sánh kép (more better)",
    en_name: "Double comparative",
    description_vi:
      "Lỗi 'more better', 'more easier', 'more bigger' — kết hợp hai dấu hiệu so sánh. IELTS Grammar examiner trừ điểm rõ vì đây là lỗi cơ bản B1.",
    description_en:
      "'More better', 'more easier', 'more bigger' — stacking two comparative markers. A clear B1-level grammar error that IELTS Grammatical Range explicitly penalises.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "Online learning is more easier than traditional classes.",
        correct: "Online learning is easier than traditional classes.",
        why_vi: "Tính từ ngắn dùng -er; bỏ 'more'.",
      },
      {
        wrong: "This solution is more better for everyone.",
        correct: "This solution is better for everyone.",
        why_vi: "'Better' đã là so sánh — không cần 'more'.",
      },
    ],
  },
  {
    id: "noun_clause_that_drop",
    vi_name: "Bỏ 'that' trong mệnh đề danh từ trang trọng",
    en_name: "That-clause omission in formal register",
    description_vi:
      "Trong văn nói tiếng Anh có thể bỏ 'that' sau 'think/believe/say'. Trong IELTS Writing Task 2, giữ 'that' lại để giữ register trang trọng.",
    description_en:
      "Spoken English may drop 'that' after think/believe/say. IELTS Task 2 expects formal register where 'that' is retained.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "I believe technology will change everything.",
        correct: "I believe that technology will change everything.",
        why_vi: "Văn viết IELTS chuẩn giữ 'that' để rõ ràng và trang trọng.",
      },
    ],
  },
  {
    id: "subject_verb_agreement_collective",
    vi_name: "Hợp số chủ-vị với danh từ tập hợp",
    en_name: "Subject-verb agreement with collective nouns",
    description_vi:
      "Danh từ như 'government', 'family', 'team' ở tiếng Anh-Mỹ là số ít. Người Việt thường nói 'the government are' theo logic 'nhiều người'.",
    description_en:
      "Nouns like 'government', 'family', 'team' take singular agreement in American English. VN learners often default to plural by member-count logic.",
    ielts_band_impact: -0.25,
    examples: [
      {
        wrong: "The government are responsible for clean air.",
        correct: "The government is responsible for clean air.",
        why_vi: "'Government' là số ít trong tiếng Anh-Mỹ. Anh-Anh có thể chấp nhận 'are' nhưng nhất quán quan trọng.",
      },
    ],
  },
  {
    id: "preposition_at_in_on",
    vi_name: "Sai giới từ at / in / on",
    en_name: "Wrong preposition (at / in / on)",
    description_vi:
      "Tiếng Việt dùng 'ở' / 'tại' rộng. Tiếng Anh phân biệt at + điểm, in + không gian, on + bề mặt — và quy tắc thời gian (at + giờ, in + tháng, on + ngày).",
    description_en:
      "Vietnamese uses 'ở' / 'tại' broadly. English distinguishes at (point), in (enclosed/abstract), on (surface) — plus time rules (at + clock, in + month, on + day).",
    ielts_band_impact: -0.25,
    examples: [
      {
        wrong: "I was born in 5th of June.",
        correct: "I was born on the 5th of June.",
        why_vi: "Ngày cụ thể dùng 'on'.",
      },
      {
        wrong: "She lives at Hanoi.",
        correct: "She lives in Hanoi.",
        why_vi: "Thành phố là không gian — dùng 'in'.",
      },
    ],
  },
  {
    id: "uncountable_treated_countable",
    vi_name: "Coi danh từ không đếm được như đếm được",
    en_name: "Uncountable noun treated as countable",
    description_vi:
      "Information, advice, knowledge, equipment, furniture, research là không đếm được. 'Many informations', 'an advice', 'two knowledges' đều sai.",
    description_en:
      "Information, advice, knowledge, equipment, furniture, research are uncountable. 'Many informations', 'an advice', 'two knowledges' are all wrong.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "She gave me many useful informations.",
        correct: "She gave me much useful information.",
        why_vi: "'Information' không đếm được — dùng 'much' và bỏ -s.",
      },
      {
        wrong: "I need an advice from you.",
        correct: "I need a piece of advice from you.",
        why_vi: "'Advice' không đếm được — đếm bằng cụm 'a piece of advice'.",
      },
    ],
  },
  {
    id: "tense_inconsistency",
    vi_name: "Lẫn thì trong cùng đoạn văn",
    en_name: "Tense inconsistency within a paragraph",
    description_vi:
      "Tiếng Việt không chia thì. Người học thường nhảy thì giữa hiện tại và quá khứ trong cùng đoạn, gây lẫn lộn dòng thời gian.",
    description_en:
      "Vietnamese doesn't conjugate for tense. Learners often switch between present and past within a paragraph, blurring the time line.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "Last year I visited Tokyo. The city is very busy and I love the food there.",
        correct: "Last year I visited Tokyo. The city was very busy and I loved the food there.",
        why_vi: "Đã chọn quá khứ ở câu đầu — duy trì thì quá khứ trong toàn đoạn kể trải nghiệm.",
      },
    ],
  },

  // ── Coherence & cohesion patterns ─────────────────────────────────
  {
    id: "overused_furthermore",
    vi_name: "Lạm dụng furthermore / moreover / in addition",
    en_name: "Overused formal connectors",
    description_vi:
      "Người học Việt được dạy connector trang trọng và dùng quá nhiều. Mỗi đoạn mở bằng 'Furthermore' / 'Moreover' nghe máy móc — IELTS Coherence trừ điểm 'mechanical' linking.",
    description_en:
      "VN learners are drilled on formal connectors and over-deploy them. Every paragraph opening with 'Furthermore' / 'Moreover' reads mechanical — IELTS Coherence explicitly penalises this.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "Furthermore, education is important. Moreover, it brings opportunities. In addition, it changes lives.",
        correct: "Education is important because it opens up opportunities and changes lives.",
        why_vi: "Một câu liền mạch hơn ba câu nối bằng connector. IELTS thưởng câu phức tự nhiên hơn câu lặp + connector.",
      },
    ],
  },
  {
    id: "and_then_chain",
    vi_name: "Chuỗi 'and then'",
    en_name: "'And then' narrative chain",
    description_vi:
      "Đặc biệt phổ biến trong câu chuyện: 'I went to school and then I studied and then I went home and then...' — mọi event nối bằng 'and then'. Coherence band sẽ cap ở 5.",
    description_en:
      "Especially common in narrative passages: every event linked by 'and then'. Coherence band typically caps at 5 with this pattern.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "I woke up and then I had breakfast and then I went to work.",
        correct: "After waking up and having breakfast, I went to work.",
        why_vi: "Dùng cụm tham chiếu thời gian (after, before, while) thay vì 'and then' lặp lại.",
      },
    ],
  },
  {
    id: "vague_referent_pronouns",
    vi_name: "Đại từ tham chiếu mơ hồ",
    en_name: "Vague referent pronouns",
    description_vi:
      "'It is good for everyone' khi 'it' chưa rõ chỉ vào điều gì — IELTS Coherence trừ điểm vì người đọc phải đoán.",
    description_en:
      "'It is good for everyone' when 'it' has no clear antecedent — IELTS Coherence penalises forcing the reader to guess.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "Many people use social media every day. It is dangerous.",
        correct: "Many people use social media every day. This habit is dangerous.",
        why_vi: "Thay 'It' bằng cụm danh từ rõ ràng để người đọc không phải đoán.",
      },
    ],
  },

  // ── Macro-structure / argument patterns ───────────────────────────
  {
    id: "thesis_in_conclusion",
    vi_name: "Thesis nằm ở kết luận, không phải mở bài",
    en_name: "Thesis in conclusion (not introduction)",
    description_vi:
      "Truyền thống văn học/luận Việt thường tiết lộ luận điểm ở cuối ('điểm rơi'). IELTS Task 2 đòi thesis rõ ràng ở mở bài, được nhắc lại ở kết luận.",
    description_en:
      "Vietnamese essay tradition often reveals the argument at the end ('reveal point'). IELTS Task 2 expects a clear thesis in the introduction, restated in the conclusion.",
    ielts_band_impact: -1.0,
    examples: [
      {
        wrong: "Mở bài kể bối cảnh chung, các đoạn body đưa ví dụ, kết luận đột ngột tuyên bố quan điểm.",
        correct: "Mở bài: bối cảnh ngắn + thesis rõ ('I strongly agree...'). Body: chứng minh từng phần. Conclusion: nhắc lại thesis + tổng kết.",
        why_vi: "IELTS examiner đọc mở bài và body đầu tiên — nếu chưa thấy thesis sau 50 từ, Task Achievement đã giảm.",
      },
    ],
  },
  {
    id: "topic_sentence_missing",
    vi_name: "Đoạn body thiếu câu chủ đề",
    en_name: "Body paragraph missing topic sentence",
    description_vi:
      "Đoạn body nhảy thẳng vào ví dụ mà không nêu controlling idea ở câu đầu. Coherence cap ở 5–6 vì không thấy 'central topic' theo IELTS rubric.",
    description_en:
      "Body paragraph jumps straight to examples without a controlling idea in the first sentence. Coherence caps at 5–6 because the 'central topic' the IELTS rubric requires isn't visible.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "For example, in Singapore the government banned plastic bags. Vietnam should follow.",
        correct: "Government regulation is the most effective lever. For example, in Singapore the government banned plastic bags, and Vietnam should follow.",
        why_vi: "Câu chủ đề nói rõ luận điểm; ví dụ chỉ minh họa. Đảo ngược thứ tự là pattern Việt-Anh phổ biến.",
      },
    ],
  },
  {
    id: "under_developed_body",
    vi_name: "Đoạn body phát triển sơ sài",
    en_name: "Under-developed body paragraph",
    description_vi:
      "Đoạn body chỉ có câu chủ đề + 1 ví dụ + dừng. IELTS Task Achievement đòi pattern Topic → Explain → Example → Implication (TEEI) — bỏ 'Implication' đẩy band xuống 6.",
    description_en:
      "Body paragraph: topic sentence + 1 example + stop. IELTS Task Achievement expects Topic → Explain → Example → Implication; missing the implication caps the band at 6.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "Pollution is bad. For example, the air in Hanoi is dirty.",
        correct: "Pollution harms long-term public health. For example, air-quality measurements in Hanoi consistently exceed WHO guidelines, leading to higher rates of respiratory disease — a cost the public bears for decades.",
        why_vi: "Sau ví dụ phải có câu phân tích hệ quả (implication). Band 7+ luôn có câu này.",
      },
    ],
  },
  {
    id: "list_without_synthesis",
    vi_name: "Liệt kê không tổng hợp",
    en_name: "List without synthesis",
    description_vi:
      "Đoạn body liệt kê 3 ví dụ song song, không lồng ghép thành luận chứng. IELTS examiner đọc thấy data nhưng không thấy argument.",
    description_en:
      "Body paragraph lists three parallel examples without weaving them into an argument. The IELTS examiner sees data but no argument.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "First, Singapore is clean. Second, Tokyo is clean. Third, Seoul is clean.",
        correct: "Asian cities that prioritised public-transit investment in the 1990s — Singapore, Tokyo, and Seoul — now show measurably cleaner air than peers that delayed.",
        why_vi: "Tổng hợp 3 ví dụ thành 1 câu lồng luận điểm sẽ kéo Coherence + Lexical Resource lên cùng lúc.",
      },
    ],
  },

  // ── Register & lexical patterns ───────────────────────────────────
  {
    id: "informal_register_in_essay",
    vi_name: "Văn nói trong bài viết",
    en_name: "Informal register in formal essay",
    description_vi:
      "Contractions (don't, won't, I'm), 'I think', 'everybody knows', 'a lot of' đều hạ register. IELTS Task 2 cần văn trang trọng, không như nói chuyện.",
    description_en:
      "Contractions, 'I think', 'everybody knows', 'a lot of' all lower the register. IELTS Task 2 expects formal academic register.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "I think everybody knows that pollution is a big problem.",
        correct: "It is widely accepted that pollution is a major issue.",
        why_vi: "'I think' và 'everybody knows' là speech register; văn IELTS dùng 'It is widely accepted', 'It is generally argued'.",
      },
      {
        wrong: "There are a lot of reasons why kids don't read books.",
        correct: "There are several reasons why children do not read books.",
        why_vi: "'A lot of' → 'several / numerous / a number of'. 'Kids' → 'children'. Bỏ contraction 'don't' → 'do not'.",
      },
    ],
  },
  {
    id: "weak_hedging_absolute",
    vi_name: "Khẳng định tuyệt đối, thiếu hedging",
    en_name: "Absolute claims, weak hedging",
    description_vi:
      "Văn học đường Việt thường khẳng định tuyệt đối ('X always Y', 'Everyone knows that...'). IELTS thưởng hedged claims ('X tends to', 'It is often the case that').",
    description_en:
      "Vietnamese school writing often makes absolute claims. IELTS rewards hedged claims that acknowledge nuance.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "All teenagers are addicted to their phones.",
        correct: "Many teenagers tend to spend excessive time on their phones.",
        why_vi: "Tránh 'all', 'always', 'never'. Dùng 'many', 'tend to', 'often' để nhường chỗ cho ngoại lệ.",
      },
    ],
  },
  {
    id: "always_never_overuse",
    vi_name: "Lạm dụng 'always' / 'never'",
    en_name: "Always / never overuse",
    description_vi:
      "Lặp 'always' / 'never' trong cùng bài làm luận chứng yếu. Mỗi 'always' nên thay bằng 'often / typically / frequently' tùy ngữ cảnh.",
    description_en:
      "Repeated 'always' / 'never' weakens the argument. Replace each with 'often / typically / frequently' as the context allows.",
    ielts_band_impact: -0.25,
    examples: [
      {
        wrong: "Students always ignore their homework. Teachers never have time to check.",
        correct: "Students frequently neglect their homework, and teachers often lack time to check it.",
        why_vi: "Frequency adverbs (frequently, often) đa dạng hơn 'always/never' và đúng band 7.",
      },
    ],
  },
  {
    id: "literal_translation_idioms",
    vi_name: "Dịch idiom theo nghĩa đen",
    en_name: "Literal translation of idioms",
    description_vi:
      "Dịch idiom Việt sang Anh chữ-cho-chữ ('eat full and warm', 'have name on list', 'open eyes wide') hoặc dùng idiom tiếng Anh sai bối cảnh. IELTS đánh giá Lexical Resource thấp khi gặp.",
    description_en:
      "Word-for-word translations of Vietnamese idioms or English idioms used in the wrong context lower Lexical Resource.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "We must eat full and warm before thinking about studies.",
        correct: "We must meet basic needs before pursuing further education.",
        why_vi: "'Ăn no mặc ấm' không có equivalent tiếng Anh — paraphrase ý chính ('basic needs').",
      },
    ],
  },
  {
    id: "phrasal_verb_avoidance",
    vi_name: "Tránh phrasal verb làm văn nghe sách giáo khoa",
    en_name: "Phrasal-verb avoidance (textbook tone)",
    description_vi:
      "Văn IELTS B2+ tự nhiên dùng phrasal verbs ('point out', 'come up with', 'rely on'). Người học Việt né phrasal vì sợ sai → văn nghe sách vở. Lexical Resource cap ở 6.",
    description_en:
      "Natural B2+ writing uses phrasal verbs. VN learners avoid them out of caution, producing textbook-flat prose. Lexical Resource caps at 6.",
    ielts_band_impact: -0.25,
    examples: [
      {
        wrong: "The author mentions that the policy will succeed.",
        correct: "The author points out that the policy will succeed.",
        why_vi: "'Point out' tự nhiên hơn 'mention' trong văn IELTS B2+. Dùng cẩn thận, đúng bối cảnh.",
      },
    ],
  },
  {
    id: "fronted_because_fragment",
    vi_name: "Câu cụt bắt đầu bằng Because",
    en_name: "Fronted 'Because' fragment",
    description_vi:
      "'Because air pollution is bad.' đứng một mình là câu cụt. Tiếng Việt 'Vì ô nhiễm không khí xấu' có thể đứng riêng; tiếng Anh phải có mệnh đề chính.",
    description_en:
      "'Because air pollution is bad.' standing alone is a fragment. English requires a main clause to complete the thought.",
    ielts_band_impact: -0.5,
    examples: [
      {
        wrong: "Many people fall sick. Because air pollution is bad.",
        correct: "Many people fall sick because air pollution is bad.",
        why_vi: "Mệnh đề bắt đầu bằng 'because' phải nối với mệnh đề chính bằng cùng câu hoặc dấu phẩy.",
      },
    ],
  },
];

/**
 * Look up a pattern by id. Returns undefined for unknown ids — caller
 * decides whether to fail loud or fall through.
 */
export function findVnPatternById(id: string): VnWritingPattern | undefined {
  return VN_WRITING_PATTERNS.find((p) => p.id === id);
}
