// src/data/exam-prep/ielts/writing-topics.ts
//
// 10 ORIGINAL IELTS Writing Task 2 topic prompts authored for MercyBlade,
// chosen specifically for the questions Vietnamese learners search and
// debate most often: education, technology, work, family, urbanization,
// environment, social media, gender roles, healthcare, government.
//
// Each entry is a real Task 2 prompt of the type IDP / Cambridge Assessment
// English use (opinion / discussion / two-part question), but every prompt,
// approach outline, tip, and vocabulary item below is original — written
// for this project. None of the text reproduces a published IELTS exam
// question or commercial prep-book content. Verbatim reuse requires
// attribution.
//
// Vietnamese-speaker tips deliberately call out L1-interference patterns
// the broader prep market ignores: literal-translation idioms, missing
// articles, plural-s drop, weak hedging, conclusion-as-thesis ordering,
// register slips, comma-spliced run-ons.

export type IeltsWritingTaskType =
  | "opinion" // Do you agree or disagree?
  | "discussion" // Discuss both views and give your opinion.
  | "two_part" // Two related questions to answer.
  | "advantages_disadvantages"; // Outweigh / not outweigh.

export interface IeltsVocabularyItem {
  word: string;
  translation_vi: string;
  pronunciation_ipa: string;
  /** CEFR proficiency at which this word is expected to be active. */
  level: "B1" | "B2" | "C1";
}

export interface IeltsWritingTopic {
  /** Stable ID — used as the URL slug and for sitemap generation. */
  id: string;
  task_type: IeltsWritingTaskType;
  topic_title_vi: string;
  topic_title_en: string;
  description_vi: string;
  description_en: string;
  prompt_vi: string;
  prompt_en: string;
  /**
   * High-level structural outline (intro → body 1 → body 2 → conclusion)
   * the learner should follow. Vietnamese-first.
   */
  approach_outline_vi: string[];
  vietnamese_speaker_tips: string[];
  key_vocabulary: IeltsVocabularyItem[];
  /** Recommended writing time in minutes (Task 2 = 40 by default). */
  recommended_minutes: number;
  /** Minimum word count (Task 2 = 250). */
  min_words: number;
}

// ─────────────────────────────────────────────────────────────────────
// Reused tips — appended where they fit naturally, not on every topic.
// ─────────────────────────────────────────────────────────────────────

const TIP_LITERAL_TRANSLATION =
  "Đừng dịch từng chữ từ tiếng Việt — examiner nhận ra ngay. Viết bằng tư duy tiếng Anh: chủ ngữ rõ, động từ chính trước, bổ ngữ sau.";
const TIP_HEDGING =
  "Tránh khẳng định tuyệt đối ('always', 'never', 'all'). Dùng hedging: 'tend to', 'in many cases', 'arguably', 'to a large extent'.";
const TIP_ARTICLES =
  "Mạo từ a/an/the là điểm trừ thường xuyên cho người Việt. Đếm được số ít → cần a/an. Đã xác định / chỉ duy nhất → the.";
const TIP_PLURALS =
  "Đừng quên -s số nhiều. 'Children learns' / 'Many student' đều bị trừ điểm Grammatical Range and Accuracy.";

// ─────────────────────────────────────────────────────────────────────
// Topic catalogue — 10 entries
// ─────────────────────────────────────────────────────────────────────

export const IELTS_WRITING_TOPICS: IeltsWritingTopic[] = [
  {
    id: "second_language_primary_school",
    task_type: "discussion",
    topic_title_vi: "Học ngôn ngữ thứ hai từ tiểu học",
    topic_title_en: "Learning a second language in primary school",
    description_vi:
      "Có nên cho trẻ học ngoại ngữ ngay từ tiểu học, hay đợi đến cấp hai? Bài luận thảo luận hai quan điểm và đưa ra quan điểm cá nhân.",
    description_en:
      "Should children learn a second language from primary school, or should it wait until secondary school? Discuss both views.",
    prompt_vi:
      "Một số người cho rằng học sinh nên học ngoại ngữ thứ hai từ tiểu học. Số khác cho rằng nên đợi đến trung học. Hãy thảo luận cả hai quan điểm và đưa ra quan điểm cá nhân.",
    prompt_en:
      "Some people believe children should start learning a second language in primary school. Others think it is better to wait until secondary school. Discuss both views and give your own opinion.",
    approach_outline_vi: [
      "Mở bài: paraphrase đề + nêu rõ cấu trúc bài (thảo luận hai quan điểm + nêu opinion).",
      "Body 1: ủng hộ học sớm — não trẻ tiếp thu phát âm tốt hơn, ít rào cản tâm lý.",
      "Body 2: ủng hộ học muộn — trẻ cần củng cố tiếng mẹ đẻ trước, tránh quá tải.",
      "Conclusion: nêu opinion rõ ràng, không lấp lửng. Có thể chọn 'sớm' với điều kiện không hy sinh tiếng mẹ đẻ.",
    ],
    vietnamese_speaker_tips: [
      "Đừng viết 'In my opinion, I think' — thừa. Chỉ cần 'In my view' hoặc 'I would argue that'.",
      TIP_HEDGING,
      "Vocabulary chủ đề: 'cognitive development', 'language acquisition', 'critical period', 'curriculum'.",
      "Đừng dịch 'tiếng mẹ đẻ' = 'mother language' — đúng là 'mother tongue' hoặc 'first language / L1'.",
    ],
    key_vocabulary: [
      { word: "cognitive development", translation_vi: "phát triển nhận thức", pronunciation_ipa: "/ˈkɒɡ.nə.tɪv dɪˈvɛl.əp.mənt/", level: "C1" },
      { word: "language acquisition", translation_vi: "tiếp thu ngôn ngữ", pronunciation_ipa: "/ˈlæŋ.ɡwɪdʒ ˌæk.wɪˈzɪʃ.ən/", level: "C1" },
      { word: "curriculum", translation_vi: "chương trình học", pronunciation_ipa: "/kəˈrɪk.jə.ləm/", level: "B2" },
      { word: "critical period", translation_vi: "giai đoạn vàng", pronunciation_ipa: "/ˈkrɪt.ɪ.kəl ˈpɪə.ri.əd/", level: "C1" },
      { word: "bilingual", translation_vi: "song ngữ", pronunciation_ipa: "/baɪˈlɪŋ.ɡwəl/", level: "B2" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
  {
    id: "remote_work_outweigh_drawbacks",
    task_type: "advantages_disadvantages",
    topic_title_vi: "Làm việc từ xa: lợi và hại",
    topic_title_en: "Remote work: advantages and disadvantages",
    description_vi:
      "Làm việc từ xa ngày càng phổ biến sau đại dịch. Lợi ích có lớn hơn bất lợi không? Bài luận advantages-outweigh-disadvantages.",
    description_en:
      "Remote work has become widespread post-pandemic. Do the advantages outweigh the disadvantages?",
    prompt_vi:
      "Ngày càng nhiều công ty cho phép nhân viên làm việc từ xa toàn thời gian. Lợi ích của xu hướng này có lớn hơn bất lợi không? Đưa ra quan điểm và ví dụ cụ thể.",
    prompt_en:
      "More and more companies are allowing employees to work remotely full-time. Do the advantages of this trend outweigh the disadvantages? Give reasons and specific examples.",
    approach_outline_vi: [
      "Mở bài: paraphrase + nêu rõ opinion (outweigh hoặc not outweigh) ngay.",
      "Body 1: lợi ích chính — flexibility, không tốn thời gian commute, mở rộng talent pool.",
      "Body 2: bất lợi chính — isolation, ranh giới công việc/cuộc sống mờ, khó coaching nhân viên mới.",
      "Conclusion: tái khẳng định opinion, không thêm ý mới.",
    ],
    vietnamese_speaker_tips: [
      "Đừng dịch 'làm việc từ xa' = 'far working'. Đúng: 'remote work' / 'work from home (WFH)' / 'telecommuting'.",
      TIP_LITERAL_TRANSLATION,
      "Cấu trúc cao điểm: 'Although X has benefits, the costs are arguably more pressing'.",
      "Vocabulary B2-C1: 'flexibility', 'productivity', 'work-life balance', 'commuting time', 'team cohesion'.",
    ],
    key_vocabulary: [
      { word: "remote work", translation_vi: "làm việc từ xa", pronunciation_ipa: "/rɪˈmoʊt wɜːrk/", level: "B2" },
      { word: "work-life balance", translation_vi: "cân bằng công việc - cuộc sống", pronunciation_ipa: "/wɜːrk laɪf ˈbæl.əns/", level: "B2" },
      { word: "team cohesion", translation_vi: "tính gắn kết đội ngũ", pronunciation_ipa: "/tiːm koʊˈhiː.ʒən/", level: "C1" },
      { word: "commuting time", translation_vi: "thời gian đi lại", pronunciation_ipa: "/kəˈmjuː.tɪŋ taɪm/", level: "B2" },
      { word: "productivity", translation_vi: "năng suất", pronunciation_ipa: "/ˌproʊ.dʌkˈtɪv.ə.t̬i/", level: "B2" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
  {
    id: "social_media_young_people",
    task_type: "two_part",
    topic_title_vi: "Mạng xã hội và giới trẻ",
    topic_title_en: "Social media and young people",
    description_vi:
      "Mạng xã hội ảnh hưởng đến giới trẻ thế nào, và cha mẹ - nhà trường nên làm gì? Bài luận two-part.",
    description_en:
      "How does social media affect young people, and what should parents and schools do?",
    prompt_vi:
      "Mạng xã hội đang định hình hành vi và quan điểm của giới trẻ một cách sâu sắc. Ảnh hưởng tiêu cực chính là gì? Cha mẹ và nhà trường có thể làm gì để giảm thiểu chúng?",
    prompt_en:
      "Social media is profoundly shaping young people's behaviour and views. What are the main negative effects? What can parents and schools do to mitigate them?",
    approach_outline_vi: [
      "Mở bài: paraphrase + nêu rõ bài sẽ trả lời 2 câu hỏi.",
      "Body 1: tác động tiêu cực — so sánh xã hội (social comparison), giảm khả năng tập trung, lo âu.",
      "Body 2: giải pháp — giáo dục về digital literacy, giới hạn thời gian, mở kênh đối thoại tại trường.",
      "Conclusion: tóm tắt cả hai phần, không thêm ý.",
    ],
    vietnamese_speaker_tips: [
      "Mỗi câu hỏi của đề = một body paragraph. Đừng gộp.",
      "Đừng dịch 'so sánh xã hội' = 'social comparing' — đúng là 'social comparison'.",
      "Cấu trúc 'X can mitigate Y by Z-ing' rất hữu ích cho phần giải pháp.",
      TIP_HEDGING,
    ],
    key_vocabulary: [
      { word: "digital literacy", translation_vi: "kỹ năng số", pronunciation_ipa: "/ˈdɪdʒ.ɪ.təl ˈlɪt.ə.rə.si/", level: "C1" },
      { word: "screen time", translation_vi: "thời gian dùng màn hình", pronunciation_ipa: "/skriːn taɪm/", level: "B2" },
      { word: "social comparison", translation_vi: "so sánh xã hội", pronunciation_ipa: "/ˈsoʊ.ʃəl kəmˈpær.ɪ.sən/", level: "C1" },
      { word: "anxiety", translation_vi: "sự lo âu", pronunciation_ipa: "/æŋˈzaɪ.ə.t̬i/", level: "B2" },
      { word: "mitigate", translation_vi: "giảm nhẹ", pronunciation_ipa: "/ˈmɪt̬.ə.ɡeɪt/", level: "C1" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
  {
    id: "urbanization_quality_of_life",
    task_type: "discussion",
    topic_title_vi: "Đô thị hóa và chất lượng sống",
    topic_title_en: "Urbanization and quality of life",
    description_vi:
      "Đô thị hóa nhanh ở Việt Nam mang lại lợi ích kinh tế nhưng cũng gây áp lực hạ tầng. Thảo luận hai quan điểm.",
    description_en:
      "Rapid urbanization in Vietnam brings economic benefits but strains infrastructure. Discuss both views.",
    prompt_vi:
      "Đô thị hóa giúp các thành phố đông dân hơn, kinh tế phát triển hơn, nhưng cũng làm chất lượng sống giảm. Bạn cho rằng lợi ích lớn hơn hay vấn đề lớn hơn?",
    prompt_en:
      "Urbanization makes cities more populated and economically vibrant but lowers quality of life. Do the benefits outweigh the problems?",
    approach_outline_vi: [
      "Mở bài: paraphrase + opinion rõ ràng.",
      "Body 1: lợi ích — tạo việc làm, hạ tầng giáo dục/y tế tốt hơn, kết nối khu vực.",
      "Body 2: vấn đề — kẹt xe, ô nhiễm không khí, giá nhà tăng cao, mất không gian xanh.",
      "Conclusion: opinion + đề xuất hướng giải quyết ngắn (sustainable urban planning).",
    ],
    vietnamese_speaker_tips: [
      "Vocabulary chủ đề: 'urbanization', 'congestion', 'air quality', 'urban planning', 'green space'.",
      "Đừng dịch 'tắc đường' = 'traffic blocking' — đúng là 'traffic congestion' / 'gridlock'.",
      "Đưa ví dụ cụ thể (Hà Nội, TP.HCM) tăng điểm Task Response. Tránh chung chung.",
      TIP_PLURALS,
    ],
    key_vocabulary: [
      { word: "urbanization", translation_vi: "đô thị hóa", pronunciation_ipa: "/ˌɜːr.bə.nəˈzeɪ.ʃən/", level: "C1" },
      { word: "congestion", translation_vi: "tắc nghẽn (giao thông)", pronunciation_ipa: "/kənˈdʒɛs.tʃən/", level: "B2" },
      { word: "infrastructure", translation_vi: "hạ tầng", pronunciation_ipa: "/ˈɪn.frəˌstrʌk.tʃɚ/", level: "B2" },
      { word: "green space", translation_vi: "không gian xanh", pronunciation_ipa: "/ɡriːn speɪs/", level: "B2" },
      { word: "urban planning", translation_vi: "quy hoạch đô thị", pronunciation_ipa: "/ˈɜːr.bən ˈplæn.ɪŋ/", level: "B2" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
  {
    id: "online_education_replace_traditional",
    task_type: "opinion",
    topic_title_vi: "Học trực tuyến có thay được học truyền thống?",
    topic_title_en: "Can online education replace traditional schooling?",
    description_vi:
      "Học trực tuyến đã chứng minh hiệu quả ở một số bậc học, nhưng liệu nó có thể thay thế hoàn toàn lớp học vật lý?",
    description_en:
      "Online education has proved effective in some contexts. But can it fully replace physical classrooms?",
    prompt_vi:
      "Một số người cho rằng học trực tuyến cuối cùng sẽ thay thế hoàn toàn lớp học truyền thống. Bạn đồng ý với quan điểm này tới mức nào?",
    prompt_en:
      "Some people believe online education will eventually replace traditional classrooms. To what extent do you agree?",
    approach_outline_vi: [
      "Mở bài: paraphrase + opinion rõ (đồng ý / không đồng ý / một phần).",
      "Body 1: ủng hộ — tiếp cận giáo viên giỏi không phụ thuộc địa lý, học theo nhịp riêng, tiết kiệm chi phí.",
      "Body 2: phản đối — kỹ năng xã hội, thực hành phòng lab, kỷ luật học tập đòi hỏi môi trường vật lý.",
      "Conclusion: tổng kết opinion. 'Partially agree' là chiến lược an toàn cho band 7+.",
    ],
    vietnamese_speaker_tips: [
      "'To what extent do you agree' = không buộc phải đồng ý hoặc phản đối hoàn toàn. 'Partially agree' rất hợp.",
      "Đừng dùng 'in nowadays' — sai. Chỉ 'nowadays' đứng độc lập, hoặc 'in today's world'.",
      "Vocabulary B2: 'self-paced', 'asynchronous', 'face-to-face', 'practical skills', 'soft skills'.",
      TIP_ARTICLES,
    ],
    key_vocabulary: [
      { word: "self-paced", translation_vi: "theo nhịp cá nhân", pronunciation_ipa: "/sɛlf peɪst/", level: "B2" },
      { word: "asynchronous", translation_vi: "không đồng bộ thời gian", pronunciation_ipa: "/eɪˈsɪŋ.krə.nəs/", level: "C1" },
      { word: "face-to-face", translation_vi: "trực tiếp (mặt đối mặt)", pronunciation_ipa: "/ˌfeɪs.təˈfeɪs/", level: "B1" },
      { word: "soft skills", translation_vi: "kỹ năng mềm", pronunciation_ipa: "/sɒft skɪlz/", level: "B2" },
      { word: "engagement", translation_vi: "sự gắn kết, tham gia", pronunciation_ipa: "/ɪnˈɡeɪdʒ.mənt/", level: "B2" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
  {
    id: "environmental_responsibility_individual_government",
    task_type: "discussion",
    topic_title_vi: "Bảo vệ môi trường: trách nhiệm cá nhân hay chính phủ?",
    topic_title_en: "Environmental responsibility: individuals or governments?",
    description_vi:
      "Ai gánh trách nhiệm chính trong việc bảo vệ môi trường — cá nhân hay nhà nước? Thảo luận cả hai.",
    description_en:
      "Who carries the main responsibility for protecting the environment — individuals or governments? Discuss both views.",
    prompt_vi:
      "Một số người tin rằng bảo vệ môi trường là trách nhiệm của mỗi cá nhân. Số khác cho rằng chỉ chính phủ mới có đủ quyền lực để tạo thay đổi thực sự. Thảo luận cả hai quan điểm và nêu ý kiến của bạn.",
    prompt_en:
      "Some believe protecting the environment is the responsibility of every individual. Others argue only governments have the power to drive real change. Discuss both views and give your opinion.",
    approach_outline_vi: [
      "Mở bài: paraphrase + nêu cấu trúc bài.",
      "Body 1: cá nhân — tiêu dùng, phân loại rác, sử dụng phương tiện công cộng tạo ra cộng hưởng lớn.",
      "Body 2: chính phủ — quy định, thuế carbon, đầu tư năng lượng tái tạo có hiệu lực hệ thống.",
      "Conclusion: 'Responsibility is shared' là opinion an toàn và đúng đắn — nêu cả hai bổ trợ nhau.",
    ],
    vietnamese_speaker_tips: [
      "Đừng dịch 'phân loại rác' = 'classify trash' — đúng: 'sort waste' / 'recycle separately'.",
      "Vocabulary C1: 'emissions', 'carbon footprint', 'renewable energy', 'policy intervention', 'sustainability'.",
      "Cấu trúc lập luận mạnh: 'While X has merit, Y is the more decisive lever because…'",
      TIP_LITERAL_TRANSLATION,
    ],
    key_vocabulary: [
      { word: "carbon footprint", translation_vi: "dấu chân carbon", pronunciation_ipa: "/ˈkɑːr.bən ˈfʊt.prɪnt/", level: "C1" },
      { word: "renewable energy", translation_vi: "năng lượng tái tạo", pronunciation_ipa: "/rɪˈnuː.ə.bəl ˈɛn.ɚ.dʒi/", level: "B2" },
      { word: "emissions", translation_vi: "khí thải", pronunciation_ipa: "/ɪˈmɪʃ.ənz/", level: "B2" },
      { word: "sustainability", translation_vi: "tính bền vững", pronunciation_ipa: "/səˌsteɪ.nəˈbɪl.ə.t̬i/", level: "C1" },
      { word: "policy intervention", translation_vi: "can thiệp chính sách", pronunciation_ipa: "/ˈpɑː.lə.si ˌɪn.t̬ɚˈvɛn.ʃən/", level: "C1" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
  {
    id: "gender_roles_workplace",
    task_type: "opinion",
    topic_title_vi: "Vai trò giới trong công việc",
    topic_title_en: "Gender roles in the workplace",
    description_vi:
      "Phụ nữ và nam giới có nên có cùng cơ hội ở mọi nghề nghiệp? Bài luận opinion.",
    description_en:
      "Should women and men have equal opportunities in every profession?",
    prompt_vi:
      "Một số người cho rằng nam giới và phụ nữ có khả năng thiên bẩm khác nhau, nên một số nghề phù hợp với nam giới hơn (và ngược lại). Bạn đồng ý hay phản đối?",
    prompt_en:
      "Some argue that men and women have innately different abilities, so certain professions suit one gender more than the other. To what extent do you agree or disagree?",
    approach_outline_vi: [
      "Mở bài: paraphrase + opinion mạnh (disagree là hướng dễ bảo vệ với evidence sociology).",
      "Body 1: phản bác 'innate differences' — bằng chứng nghiên cứu và ví dụ phụ nữ thành công ở STEM.",
      "Body 2: hậu quả của tư duy giới — bỏ phí talent pool, củng cố bất bình đẳng thu nhập.",
      "Conclusion: tái khẳng định, đề xuất giáo dục bình đẳng từ sớm.",
    ],
    vietnamese_speaker_tips: [
      "Tránh ngôn ngữ định kiến giới ('manly', 'feminine job'). Examiner đánh giá lập luận, không quan điểm cá nhân — viết khách quan.",
      "Vocabulary C1: 'gender stereotype', 'glass ceiling', 'pay gap', 'meritocracy', 'aptitude'.",
      "Đừng dịch 'rào cản' = 'barrier' lặp đi lặp lại — đa dạng: 'obstacle', 'structural barrier', 'systemic bias'.",
      TIP_HEDGING,
    ],
    key_vocabulary: [
      { word: "gender stereotype", translation_vi: "định kiến giới", pronunciation_ipa: "/ˈdʒɛn.dɚ ˈstɛr.i.ə.taɪp/", level: "C1" },
      { word: "glass ceiling", translation_vi: "trần kính (rào cản vô hình)", pronunciation_ipa: "/ɡlæs ˈsiː.lɪŋ/", level: "C1" },
      { word: "pay gap", translation_vi: "chênh lệch lương", pronunciation_ipa: "/peɪ ɡæp/", level: "B2" },
      { word: "meritocracy", translation_vi: "chế độ trọng dụng năng lực", pronunciation_ipa: "/ˌmɛr.ɪˈtɒk.rə.si/", level: "C1" },
      { word: "aptitude", translation_vi: "năng khiếu", pronunciation_ipa: "/ˈæp.tə.tuːd/", level: "C1" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
  {
    id: "public_healthcare_funding",
    task_type: "discussion",
    topic_title_vi: "Tài trợ y tế công",
    topic_title_en: "Public healthcare funding",
    description_vi:
      "Y tế nên được tài trợ hoàn toàn bằng thuế công, hay nên có khu vực tư nhân? Thảo luận cả hai.",
    description_en:
      "Should healthcare be entirely tax-funded, or should there be a private sector?",
    prompt_vi:
      "Một số người tin y tế nên được tài trợ hoàn toàn bằng thuế của nhà nước. Số khác cho rằng cần có khu vực tư để giảm tải. Hãy thảo luận cả hai và nêu quan điểm.",
    prompt_en:
      "Some believe healthcare should be entirely funded by taxation. Others argue a private sector is needed to ease pressure. Discuss both views and give your opinion.",
    approach_outline_vi: [
      "Mở bài: paraphrase + nêu cấu trúc.",
      "Body 1: hệ thống công — bình đẳng tiếp cận, không phá sản vì bệnh tật.",
      "Body 2: hệ thống hỗn hợp — giảm thời gian chờ, lựa chọn cho người chi trả được.",
      "Conclusion: opinion — 'mixed system' với ưu tiên công thường là hướng cân bằng nhất.",
    ],
    vietnamese_speaker_tips: [
      "Vocabulary chuyên ngành: 'universal coverage', 'out-of-pocket cost', 'private sector', 'subsidy', 'co-payment'.",
      "Đừng dịch 'bảo hiểm y tế' = 'health insurance' theo nghĩa rất hẹp — IELTS context dùng 'healthcare coverage' hoặc 'health system'.",
      "Cấu trúc đối lập mạnh: 'In contrast to X, Y offers Z'.",
      TIP_HEDGING,
    ],
    key_vocabulary: [
      { word: "universal coverage", translation_vi: "bảo hiểm y tế toàn dân", pronunciation_ipa: "/ˌjuː.nəˈvɝː.səl ˈkʌv.ɚ.ɪdʒ/", level: "C1" },
      { word: "out-of-pocket cost", translation_vi: "chi phí tự chi trả", pronunciation_ipa: "/ˌaʊt.əv ˈpɒk.ɪt kɒst/", level: "C1" },
      { word: "subsidy", translation_vi: "trợ cấp", pronunciation_ipa: "/ˈsʌb.sə.di/", level: "B2" },
      { word: "co-payment", translation_vi: "đồng chi trả", pronunciation_ipa: "/ˈkoʊ ˌpeɪ.mənt/", level: "C1" },
      { word: "private sector", translation_vi: "khu vực tư", pronunciation_ipa: "/ˈpraɪ.vət ˈsɛk.tɚ/", level: "B2" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
  {
    id: "tourism_cultural_preservation",
    task_type: "advantages_disadvantages",
    topic_title_vi: "Du lịch và bảo tồn văn hóa",
    topic_title_en: "Tourism and cultural preservation",
    description_vi:
      "Du lịch quốc tế mang lại doanh thu nhưng cũng đe dọa bảo tồn văn hóa. Lợi có lớn hơn hại?",
    description_en:
      "International tourism brings revenue but threatens cultural preservation. Do the benefits outweigh the costs?",
    prompt_vi:
      "Du lịch quốc tế mang lại nguồn thu lớn cho nhiều quốc gia, nhưng cũng có thể làm xói mòn văn hóa địa phương. Bạn cho rằng lợi ích kinh tế lớn hơn cái giá văn hóa hay không?",
    prompt_en:
      "International tourism generates significant revenue but can also erode local culture. Do the economic benefits outweigh the cultural costs?",
    approach_outline_vi: [
      "Mở bài: paraphrase + opinion (cân bằng hoặc nghiêng về một phía).",
      "Body 1: lợi ích — tạo việc làm, nâng cấp hạ tầng, lan tỏa văn hóa nếu được quản lý tốt.",
      "Body 2: cái giá — thương mại hóa lễ hội, mất tính chân thực, đẩy giá sinh hoạt lên với người bản địa.",
      "Conclusion: opinion + ngắn gọn nêu quản lý du lịch bền vững là hướng đi.",
    ],
    vietnamese_speaker_tips: [
      "Đừng dịch 'mất văn hóa' = 'lose culture' — đúng là 'cultural erosion' / 'commodification of culture'.",
      "Đưa ví dụ cụ thể (Hội An, Sa Pa) tăng điểm Task Response.",
      "Vocabulary C1: 'authenticity', 'commercialization', 'sustainable tourism', 'cultural heritage', 'local livelihoods'.",
      TIP_LITERAL_TRANSLATION,
    ],
    key_vocabulary: [
      { word: "cultural heritage", translation_vi: "di sản văn hóa", pronunciation_ipa: "/ˈkʌl.tʃɚ.əl ˈhɛr.ɪ.tɪdʒ/", level: "B2" },
      { word: "authenticity", translation_vi: "tính chân thực", pronunciation_ipa: "/ˌɔː.θɛnˈtɪs.ə.t̬i/", level: "C1" },
      { word: "sustainable tourism", translation_vi: "du lịch bền vững", pronunciation_ipa: "/səˈsteɪ.nə.bəl ˈtʊr.ɪ.zəm/", level: "B2" },
      { word: "commodification", translation_vi: "thương mại hóa", pronunciation_ipa: "/kəˌmɒd.ɪ.fɪˈkeɪ.ʃən/", level: "C1" },
      { word: "local livelihoods", translation_vi: "sinh kế địa phương", pronunciation_ipa: "/ˈloʊ.kəl ˈlaɪv.li.hʊdz/", level: "C1" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
  {
    id: "ai_workforce_displacement",
    task_type: "two_part",
    topic_title_vi: "AI và lao động: thay thế hay bổ trợ?",
    topic_title_en: "AI and labour: replacement or augmentation?",
    description_vi:
      "AI có thay thế nhiều ngành nghề. Ngành nào dễ bị thay thế nhất, và xã hội nên chuẩn bị thế nào?",
    description_en:
      "AI is replacing roles in many industries. Which roles are most at risk, and how should society prepare?",
    prompt_vi:
      "Trí tuệ nhân tạo đang thay thế lao động trong nhiều ngành. Theo bạn, ngành nào dễ bị thay thế nhất? Xã hội — đặc biệt là chính phủ và hệ thống giáo dục — có thể làm gì để chuẩn bị cho người lao động?",
    prompt_en:
      "Artificial intelligence is replacing workers in many industries. In your view, which roles are most exposed? What can society — especially governments and education systems — do to prepare workers?",
    approach_outline_vi: [
      "Mở bài: paraphrase + nêu rõ trả lời 2 câu.",
      "Body 1: ngành rủi ro cao — admin, customer service routine, data entry, một số kế toán cấp thấp.",
      "Body 2: chuẩn bị — giáo dục lifelong learning, reskilling fund, social safety net, focus vào nghề cần creativity và empathy.",
      "Conclusion: tóm tắt cả hai phần.",
    ],
    vietnamese_speaker_tips: [
      "Mỗi câu hỏi = một body paragraph. Đừng quên trả lời CẢ HAI — bỏ một ý là tụt Task Response nặng.",
      "Vocabulary C1: 'automation', 'reskilling', 'lifelong learning', 'displacement', 'augmentation'.",
      "Cấu trúc 'X is unlikely to fully replace Y because Z' tốt cho lập luận sắc sảo.",
      "Đừng dùng 'in my opinion' nhiều — chỉ một lần ở conclusion là đủ.",
    ],
    key_vocabulary: [
      { word: "automation", translation_vi: "tự động hóa", pronunciation_ipa: "/ˌɔː.təˈmeɪ.ʃən/", level: "B2" },
      { word: "reskilling", translation_vi: "đào tạo lại nghề", pronunciation_ipa: "/riːˈskɪl.ɪŋ/", level: "C1" },
      { word: "lifelong learning", translation_vi: "học suốt đời", pronunciation_ipa: "/ˈlaɪf.lɒŋ ˈlɝː.nɪŋ/", level: "B2" },
      { word: "displacement", translation_vi: "sự thay thế (mất việc)", pronunciation_ipa: "/dɪsˈpleɪs.mənt/", level: "C1" },
      { word: "safety net", translation_vi: "lưới an sinh", pronunciation_ipa: "/ˈseɪf.ti nɛt/", level: "B2" },
    ],
    recommended_minutes: 40,
    min_words: 250,
  },
];

export function findIeltsWritingTopicById(
  id: string,
): IeltsWritingTopic | undefined {
  return IELTS_WRITING_TOPICS.find((t) => t.id === id);
}
