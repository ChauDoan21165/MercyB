// src/data/exam-prep/toefl/listening-items.ts
//
// TOEFL iBT Listening practice content — 6 original items
// (2 conversations + 4 lectures) authored for MercyBlade.
//
// TOEFL Listening format (post-July 2023):
//   3 lectures (~500 words, 6 questions each) +
//   2 conversations (~400 words, 5 questions each) = 28 questions, ~36 min
//
// All scripts, questions, vocabulary, and strategies are original —
// written for MercyBlade based on the public TOEFL iBT test specification.
// None are reproduced from ETS or any prep book.

export type TOEFLListeningItemType = "conversation" | "lecture";
export type TOEFLListeningBand = 5.5 | 6.5 | 7.5 | 8.5;

export interface TOEFLListeningQuestion {
  number: number;
  type: "gist" | "detail" | "inference" | "purpose" | "attitude";
  question_text: string;
  options?: string[];
  correct_answer: string;
  explanation_vi: string;
}

export interface TOEFLListeningVocab {
  word: string;
  ipa: string;
  vi_translation: string;
  band_level: number;
  context_use: string;
}

export interface TOEFLListeningItem {
  id: string;
  /** Supabase storage key for the passage narration (toefl-listening/{id}.mp3). */
  audioKey?: string;
  type: TOEFLListeningItemType;
  section_label: string;
  topic_title_vi: string;
  topic_title_en: string;
  audio_script: string;
  questions: TOEFLListeningQuestion[];
  vocabulary_focus: TOEFLListeningVocab[];
  vietnamese_speaker_strategies: string[];
  common_mistakes_vi: string[];
  estimated_time_minutes: number;
  difficulty_band: TOEFLListeningBand;
}

// ── Reusable strategies ──────────────────────────────────────────────────────

const STRAT_PREDICT =
  "TOEFL Listening không cho xem câu hỏi trước khi nghe như IELTS. Nhưng bạn có thể đoán chủ đề từ giọng speaker và câu mở đầu. Tập trung vào: ai nói với ai, ở đâu, vấn đề chính là gì.";
const STRAT_TAKE_NOTES =
  "Ghi chú theo cấu trúc: main idea → key point 1 → example → key point 2 → example. Không ghi cả câu — chỉ keywords và mũi tên liên kết.";
const STRAT_INTONATION =
  "TOEFL rất hay hỏi về thái độ speaker. Chú ý giọng điệu: 'Well, actually…' / 'I'm not so sure about that' / 'That's a great question' — đây là tín hiệu cho attitude questions.";
const STRAT_TRANSITIONS =
  "Từ chuyển tiếp = tín hiệu cho câu hỏi detail. 'The most important factor is…', 'Surprisingly…', 'What this means is…' → gần như chắc chắn có câu hỏi.";

// ═══════════════════════════════════════════════════════════════════════════
// Conversation 1: Course Registration (campus, Band 5.5)
// ═══════════════════════════════════════════════════════════════════════════

const CONVO_ADVISOR: TOEFLListeningItem = {
  id: "toefl_listening_advisor_prereqs",
  audioKey: "toefl-listening/toefl_listening_advisor_prereqs.mp3",
  type: "conversation",
  section_label: "Conversation 1",
  topic_title_vi: "Gặp cố vấn học tập về đăng ký môn",
  topic_title_en: "Meeting with Academic Advisor about Course Registration",
  audio_script: `ADVISOR: Hi, come on in. How can I help you today?
STUDENT: Thanks, Professor Miller. I'm trying to register for Introduction to Biochemistry next semester, but the online system won't let me. It says I haven't completed the prerequisites.
ADVISOR: Let me look at your transcript. You're a sophomore, correct?
STUDENT: Yes, second year. Majoring in biology.
ADVISOR: Okay, I see the issue. Biochemistry requires both General Chemistry 102 and Organic Chemistry 201. You completed Chemistry 102 with a B-plus last spring, but I don't see Organic Chemistry anywhere on your record.
STUDENT: I'm taking Organic Chemistry right now. This semester. I'll finish it in December.
ADVISOR: Ah, that explains it. The registration system doesn't recognize courses you're currently enrolled in — it only checks completed courses. So technically, the prerequisite isn't satisfied yet.
STUDENT: But by the time Biochemistry starts in January, I WILL have finished Organic Chemistry. Isn't there a way to override this?
ADVISOR: There is — I can issue a prerequisite override, but only if your current grade in Organic Chemistry is a B or above. Let me check with Professor Watkins, who teaches that course. [typing] Hmm, she has you at a B-plus average so far. That qualifies. I'll submit the override now, and you should be able to register within twenty-four hours.
STUDENT: That's a relief. Thank you so much.
ADVISOR: One more thing — Biochemistry is a demanding course. Are you taking any other lab sciences next semester? Because four lab courses in one term is really difficult.
STUDENT: I was planning to take Microbiology as well. That has a lab component.
ADVISOR: I'd strongly recommend dropping one of them. Maybe take Microbiology in the fall of your junior year instead. Two lab courses with Biochemistry is manageable; three is a recipe for burnout. I've seen too many students try to do too much and have their grades suffer across the board.
STUDENT: I'll think about it. Thanks for the advice.`,
  questions: [
    { number: 1, type: "gist", question_text: "Why does the student visit the advisor?", options: ["A) To change her major from biology.", "B) To resolve a registration problem for Biochemistry.", "C) To complain about her Organic Chemistry grade.", "D) To get advice about which professor to take."], correct_answer: "B", explanation_vi: "Ngay đầu hội thoại: 'I'm trying to register for Introduction to Biochemistry... the online system won't let me.'" },
    { number: 2, type: "detail", question_text: "What prerequisite is the student currently taking?", options: ["A) General Chemistry 102", "B) Organic Chemistry 201", "C) Microbiology", "D) Biochemistry"], correct_answer: "B", explanation_vi: "Student nói 'I'm taking Organic Chemistry right now. This semester.'" },
    { number: 3, type: "detail", question_text: "What condition must be met for the override to be approved?", options: ["A) The student must have an A in all science courses.", "B) The student's current Organic Chemistry grade must be at least a B.", "C) The student must get permission from the department chair.", "D) The student must drop another course first."], correct_answer: "B", explanation_vi: "Advisor: 'I can issue a prerequisite override, but only if your current grade in Organic Chemistry is a B or above.'" },
    { number: 4, type: "inference", question_text: "What can be inferred about the advisor's recommendation regarding lab courses?", options: ["A) The advisor believes students should take as many lab courses as possible.", "B) The advisor thinks four lab courses in one term is too demanding.", "C) The advisor wants the student to change her major.", "D) The advisor dislikes the Biochemistry professor."], correct_answer: "B", explanation_vi: "Advisor: 'four lab courses in one term is really difficult' và gợi ý giảm xuống còn 2 lab courses." },
    { number: 5, type: "attitude", question_text: "What is the student's attitude at the end of the conversation?", options: ["A) Angry about the registration system.", "B) Grateful but still considering the advice about course load.", "C) Completely dismissive of the advisor's suggestion.", "D) Worried about failing Organic Chemistry."], correct_answer: "B", explanation_vi: "Student nói 'That's a relief. Thank you so much' (biết ơn) nhưng cũng 'I'll think about it' (đang cân nhắc lời khuyên)." },
  ],
  vocabulary_focus: [
    { word: "prerequisite", ipa: "/priːˈrɛk.wɪ.zɪt/", vi_translation: "môn học tiên quyết", band_level: 6, context_use: "Khóa học bắt buộc phải hoàn thành trước khi đăng ký khóa cao hơn." },
    { word: "override", ipa: "/ˈoʊ.vɚ.raɪd/", vi_translation: "bỏ qua, ghi đè (quy định)", band_level: 7, context_use: "Advisor có thể 'issue a prerequisite override' = cấp phép bỏ qua yêu cầu tiên quyết." },
    { word: "transcript", ipa: "/ˈtræn.skrɪpt/", vi_translation: "bảng điểm", band_level: 6, context_use: "Bản ghi chính thức tất cả các khóa học đã hoàn thành và điểm số." },
    { word: "burnout", ipa: "/ˈbɝːn.aʊt/", vi_translation: "kiệt sức (học tập/làm việc)", band_level: 7, context_use: "'A recipe for burnout' = công thức dẫn đến kiệt sức." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_PREDICT,
    STRAT_INTONATION,
    "Conversation thường có pattern: vấn đề → giải thích → giải pháp → cảnh báo/lời khuyên thêm. Theo dõi pattern này để note-taking.",
    "'Sophomore' = sinh viên năm hai (US). 'Junior' = năm ba, 'Senior' = năm cuối. Học thuộc các từ này.",
  ],
  common_mistakes_vi: [
    "Nhầm Organic Chemistry 201 VỚI General Chemistry 102 — sinh viên ĐÃ hoàn thành Chem 102, ĐANG học Organic Chem 201.",
    "Chốt 'B-plus' là điểm của Biochemistry — thực ra đó là điểm Organic Chemistry hiện tại.",
    "Bỏ qua cảnh báo cuối cùng về 'four lab courses' — câu hỏi inference thường nằm ở phần cuối conversation.",
  ],
  estimated_time_minutes: 5,
  difficulty_band: 5.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Conversation 2: Library Fine Dispute (campus, Band 6.5)
// ═══════════════════════════════════════════════════════════════════════════

const CONVO_LIBRARY: TOEFLListeningItem = {
  id: "toefl_listening_library_fine",
  audioKey: "toefl-listening/toefl_listening_library_fine.mp3",
  type: "conversation",
  section_label: "Conversation 2",
  topic_title_vi: "Tranh luận về tiền phạt thư viện",
  topic_title_en: "Library Fine Dispute",
  audio_script: `STUDENT: Excuse me, I got an email saying I owe a thirty-dollar fine for an overdue book, but I'm pretty sure I returned it on time.
LIBRARIAN: Let me check the system. What's the title of the book?
STUDENT: It's 'The Sixth Extinction' by Elizabeth Kolbert. I checked it out on January 15th and returned it on February 28th. I remember because it was the day before my midterm exam.
LIBRARIAN: I see the record. It was checked out January 15th, due February 12th — that's a four-week loan — and returned on February 28th. That's sixteen days late.
STUDENT: Wait, February 12th? I thought the standard loan period was six weeks. That's what it's always been for me.
LIBRARIAN: Normally it is, but this book is on the reserve list for Professor Henderson's environmental science class. Reserve books have a shorter loan period — four weeks instead of six. There should have been a sticker on the front cover indicating that.
STUDENT: I didn't see any sticker. Honestly, I don't remember one being there. If there was a sticker, it must have fallen off or something. Is there any way to waive the fine given the circumstances?
LIBRARIAN: I can reduce it. For a first-time reserve violation, I can cut the fine in half — so fifteen dollars instead of thirty. But I can't waive it completely without supervisor approval, and the supervisor won't be in until Monday.
STUDENT: Okay, fifteen dollars is better than thirty. But can I at least appeal the rest? There really was no sticker on the book when I checked it out.
LIBRARIAN: You can file an appeal. I'll give you a form — fill it out and return it to the front desk. The appeals committee meets on the first Wednesday of every month, so they'll review it at the next meeting. If they agree, the remaining fifteen dollars will be refunded to your account.
STUDENT: That's fair. I'll do that. Thanks for your help.`,
  questions: [
    { number: 1, type: "gist", question_text: "What is the conversation mainly about?", options: ["A) A student trying to renew a library book.", "B) A dispute over a library fine for an overdue book.", "C) A student looking for a book for a class.", "D) A librarian explaining reserve policies."], correct_answer: "B", explanation_vi: "Toàn bộ hội thoại xoay quanh việc sinh viên tranh luận về khoản phạt $30 cho sách quá hạn." },
    { number: 2, type: "detail", question_text: "How many days late was the book returned?", options: ["A) 12 days", "B) 14 days", "C) 16 days", "D) 28 days"], correct_answer: "C", explanation_vi: "Librarian: 'due February 12th... returned on February 28th. That's sixteen days late.'" },
    { number: 3, type: "detail", question_text: "Why was the loan period shorter than usual?", options: ["A) The book was damaged.", "B) The book was on the reserve list for a class.", "C) The student had overdue fines from before.", "D) The library was closing for renovation."], correct_answer: "B", explanation_vi: "Librarian: 'this book is on the reserve list for Professor Henderson's environmental science class. Reserve books have a shorter loan period.'" },
    { number: 4, type: "purpose", question_text: "Why does the student mention that there was no sticker on the book?", options: ["A) To argue that the library's labeling system is broken.", "B) To support her claim that she was unaware of the shorter loan period.", "C) To request a different copy of the book.", "D) To complain about the library staff."], correct_answer: "B", explanation_vi: "Sinh viên dùng lý do 'no sticker' để biện minh rằng cô ấy không biết về thời hạn 4 tuần." },
    { number: 5, type: "inference", question_text: "What will likely happen if the appeals committee agrees with the student?", options: ["A) The student will receive a full refund of all library fines ever paid.", "B) The remaining fifteen dollars will be returned to the student.", "C) The book will be removed from the reserve list.", "D) The librarian will be disciplined."], correct_answer: "B", explanation_vi: "Librarian nói nếu committee đồng ý, 'the remaining fifteen dollars will be refunded to your account.'" },
  ],
  vocabulary_focus: [
    { word: "reserve list", ipa: "/rɪˈzɝːv lɪst/", vi_translation: "danh sách sách dành riêng (cho khóa học)", band_level: 6, context_use: "Sách giáo sư yêu cầu thư viện giữ lại cho sinh viên trong lớp — thời hạn mượn ngắn hơn." },
    { word: "waive", ipa: "/weɪv/", vi_translation: "miễn (phí, hình phạt)", band_level: 7, context_use: "'Waive the fine' = miễn tiền phạt." },
    { word: "appeal", ipa: "/əˈpiːl/", vi_translation: "kháng nghị, khiếu nại", band_level: 7, context_use: "'File an appeal' = nộp đơn khiếu nại chính thức." },
    { word: "violation", ipa: "/ˌvaɪ.əˈleɪ.ʃən/", vi_translation: "vi phạm", band_level: 7, context_use: "'First-time reserve violation' = lần đầu vi phạm quy định sách reserve." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_INTONATION,
    STRAT_TRANSITIONS,
    "Số ngày (16 days late), số tiền ($30 → $15) là chi tiết hay hỏi. Ghi chính xác.",
    "Từ viết tắt trong thư viện: 'reserve' = sách giáo trình, 'loan period' = thời hạn mượn, 'overdue' = quá hạn.",
  ],
  common_mistakes_vi: [
    "Nhầm thời hạn chuẩn (6 tuần) với thời hạn reserve (4 tuần).",
    "Quên rằng sinh viên ĐÃ trả sách — vấn đề là trả trễ, không phải làm mất sách.",
    "Chốt đáp án là 'waive completely' — thực tế librarian chỉ giảm 50% ban đầu, phần còn lại cần appeal.",
  ],
  estimated_time_minutes: 5,
  difficulty_band: 6.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Lecture 1: Fermi Paradox (astronomy, Band 7.5)
// ═══════════════════════════════════════════════════════════════════════════

const LECTURE_FERMI: TOEFLListeningItem = {
  id: "toefl_listening_fermi_paradox",
  audioKey: "toefl-listening/toefl_listening_fermi_paradox.mp3",
  type: "lecture",
  section_label: "Lecture 1",
  topic_title_vi: "Nghịch lý Fermi",
  topic_title_en: "The Fermi Paradox",
  audio_script: "PROFESSOR: In 1950, the physicist Enrico Fermi was having lunch with colleagues at Los Alamos when the conversation turned to a recent cartoon in The New Yorker showing aliens stealing trash cans. Fermi suddenly asked a question that has haunted astronomy ever since: 'Where is everybody?' Given the vast age and size of the universe, he reasoned, there should be many advanced civilizations out there. So why haven't we seen any evidence of them? This is the Fermi Paradox.\n\nLet me put some numbers behind this. Our Milky Way galaxy contains roughly two hundred billion stars. Recent data from NASA's Kepler mission suggests that about twenty percent of Sun-like stars have an Earth-sized planet in the habitable zone — the region where liquid water can exist on the surface. That means there could be around forty billion potentially habitable planets in our galaxy alone. Even if only a tiny fraction of those developed intelligent life, you'd still expect thousands or even millions of civilizations.\n\nThe really puzzling part isn't just that we haven't been visited — it's that we see no evidence at all. A civilization just a few million years older than ours — a blink of an eye in cosmic terms — could have colonized the entire galaxy by now, even at sub-light speeds. The physicist Michael Hart argued in 1975 that the absence of extraterrestrial artifacts on Earth, in the solar system, or visible in our astronomical surveys is strong evidence that no such civilization exists. This is sometimes called the 'Hart-Tipler argument' or, more provocatively, the 'Great Silence.'\n\nDozens of explanations have been proposed. Some are astrophysical: maybe habitable planets are rarer than we think, or maybe complex life requires additional unlikely steps beyond just having liquid water. Others are sociological: maybe advanced civilizations inevitably destroy themselves through war or environmental collapse before they can colonize space — what's called the 'Great Filter' hypothesis. Still others suggest that advanced civilizations are out there but deliberately hiding — a concept known as the 'zoo hypothesis,' where they observe us without interference, like we observe animals in a nature reserve.\n\nBut perhaps the most unsettling possibility is the simplest one: that we truly are alone. If the Great Filter lies behind us — meaning that the jump from single-celled to complex life is extraordinarily rare — then we might be the first, or the only, intelligent civilization in the galaxy. Some scientists find this possibility exciting because it gives humanity a tremendous responsibility. If we are the only species capable of understanding the cosmos, then our survival and eventual expansion into space takes on a significance that goes far beyond our own planet.",
  questions: [
    { number: 1, type: "gist", question_text: "What is the main topic of the lecture?", options: ["A) The life and work of Enrico Fermi.", "B) The search for Earth-like planets.", "C) The Fermi Paradox and possible explanations for the absence of alien civilizations.", "D) The history of NASA's Kepler mission."], correct_answer: "C", explanation_vi: "Toàn bộ bài giảng thảo luận về Fermi Paradox: tại sao chúng ta chưa tìm thấy bằng chứng về nền văn minh ngoài Trái Đất, và các giả thuyết giải thích." },
    { number: 2, type: "detail", question_text: "According to the professor, approximately how many potentially habitable planets might exist in the Milky Way?", options: ["A) 200 billion", "B) 40 billion", "C) A few thousand", "D) One million"], correct_answer: "B", explanation_vi: "Prof: 'around forty billion potentially habitable planets in our galaxy alone' (20% của 200 billion)." },
    { number: 3, type: "detail", question_text: "What is the 'zoo hypothesis'?", options: ["A) Aliens keep humans in space zoos for entertainment.", "B) Advanced civilizations observe us without making contact.", "C) Humans are the only intelligent species in the universe.", "D) Aliens are afraid of Earth's dangerous animals."], correct_answer: "B", explanation_vi: "Prof: 'the zoo hypothesis, where they observe us without interference, like we observe animals in a nature reserve.'" },
    { number: 4, type: "inference", question_text: "What does the professor imply about the Great Filter hypothesis?", options: ["A) It has been proven correct by recent research.", "B) If the Great Filter lies behind us, humanity bears a special responsibility.", "C) It is the least plausible explanation for the Fermi Paradox.", "D) The Great Filter only applies to single-celled organisms."], correct_answer: "B", explanation_vi: "Prof nói: 'If the Great Filter lies behind us... then we might be the first, or the only, intelligent civilization... this gives humanity a tremendous responsibility.'" },
    { number: 5, type: "purpose", question_text: "Why does the professor mention Michael Hart's 1975 argument?", options: ["A) To provide support for the idea that advanced civilizations do not exist.", "B) To show that Fermi was wrong about the number of stars in the galaxy.", "C) To criticize the zoo hypothesis.", "D) To argue for increased funding for SETI research."], correct_answer: "A", explanation_vi: "Michael Hart lập luận rằng sự vắng mặt của hiện vật ngoài Trái Đất là 'strong evidence that no such civilization exists.'" },
    { number: 6, type: "attitude", question_text: "What is the professor's tone when describing the possibility that we are alone in the galaxy?", options: ["A) Dismissive and skeptical.", "B) Alarmist and fearful.", "C) Thoughtful, presenting both the unsettling nature and the potential significance.", "D) Humorous and lighthearted throughout."], correct_answer: "C", explanation_vi: "Prof gọi đây là 'the most unsettling possibility' nhưng cũng nói một số nhà khoa học thấy nó 'exciting because it gives humanity a tremendous responsibility' — giọng điệu cân bằng, suy tư." },
  ],
  vocabulary_focus: [
    { word: "habitable zone", ipa: "/ˈhæb.ɪ.tə.bəl zoʊn/", vi_translation: "vùng ở được", band_level: 7, context_use: "Vùng quanh sao nơi nước lỏng có thể tồn tại trên bề mặt hành tinh." },
    { word: "artifact", ipa: "/ˈɑːr.t̬ə.fækt/", vi_translation: "hiện vật, dấu tích", band_level: 7, context_use: "Bằng chứng vật lý về sự tồn tại của nền văn minh ngoài Trái Đất." },
    { word: "colonize", ipa: "/ˈkɑː.lə.naɪz/", vi_translation: "xâm chiếm, định cư", band_level: 7, context_use: "'Colonized the entire galaxy' = định cư khắp thiên hà." },
    { word: "Great Filter", ipa: "/ɡreɪt ˈfɪl.tɚ/", vi_translation: "Bộ lọc Vĩ đại (giả thuyết)", band_level: 8, context_use: "Giả thuyết rằng có một rào cản khiến sự sống thông minh hiếm hoặc không tồn tại." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_TAKE_NOTES,
    STRAT_TRANSITIONS,
    "'Billions' và 'millions' dễ gây nhầm trong bài giảng về thiên văn. Ghi số cụ thể: '200 billion stars', '40 billion habitable planets'.",
    "Khi professor nói 'perhaps the most unsettling possibility' — đây là tín hiệu cho câu hỏi attitude/tone.",
    "Học thuộc các hypothesis name: Great Filter, zoo hypothesis, Hart-Tipler argument — TOEFL hay hỏi matching.",
  ],
  common_mistakes_vi: [
    "Nhầm Kepler mission (tìm hành tinh) với SETI (tìm tín hiệu vô tuyến từ aliens).",
    "Hiểu 'zoo hypothesis' theo nghĩa đen (sở thú) thay vì nghĩa ẩn dụ (quan sát mà không can thiệp).",
    "Quên rằng Fermi Paradox KHÔNG CÓ lời giải chắc chắn — tất cả chỉ là hypotheses.",
  ],
  estimated_time_minutes: 7,
  difficulty_band: 7.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Lecture 2: Mycorrhizal Networks (biology, Band 7.5)
// ═══════════════════════════════════════════════════════════════════════════

const LECTURE_MYCORRHIZAL: TOEFLListeningItem = {
  id: "toefl_listening_mycorrhizal_networks",
  audioKey: "toefl-listening/toefl_listening_mycorrhizal_networks.mp3",
  type: "lecture",
  section_label: "Lecture 2",
  topic_title_vi: "Mạng lưới nấm rễ (Wood Wide Web)",
  topic_title_en: "Mycorrhizal Networks: The Wood Wide Web",
  audio_script: "PROFESSOR: When we look at a forest, we tend to see individual trees — each one competing for sunlight, water, and nutrients. But beneath the surface, there's an entirely different story. The roots of most trees are connected by a vast underground network of fungi, forming what ecologists sometimes call the 'wood wide web.' This network isn't just a curiosity — it fundamentally changes how we understand forest ecology.\n\nThe key players are mycorrhizal fungi — 'myco' meaning fungus, 'rhizal' meaning root. These fungi form symbiotic relationships with about ninety percent of land plants. The fungi extend microscopic threads called hyphae through the soil, vastly increasing the surface area available for absorbing water and minerals like phosphorus and nitrogen. In exchange, the trees provide the fungi with sugars produced through photosynthesis. This is textbook symbiosis: both partners benefit.\n\nBut what's really remarkable is that a single fungal network can connect dozens of trees — even trees of different species. And these connections aren't just passive pipes moving water and nutrients around. Research by ecologist Suzanne Simard at the University of British Columbia demonstrated that trees actually transfer carbon through these networks. Using radioactive carbon isotopes, Simard showed that carbon absorbed by a large, established Douglas fir was transferred to young seedlings growing in the shade — seedlings that couldn't photosynthesize enough on their own to survive. The older trees were essentially feeding the younger ones.\n\nEven more surprising, the network seems to allow something resembling communication. When a tree is attacked by insects, it releases chemical signals into the air — that's been known for decades. But Simard's work suggests that warning signals can also travel through the fungal network underground, reaching neighboring trees before the insects do. Those neighbors, having received the signal, begin producing defensive chemicals preemptively. It's as if the forest has an immune system — a distributed, underground early-warning network.\n\nNow, I should add a note of scientific caution. Some researchers argue that the 'wood wide web' metaphor has been overstated in popular science. They point out that while carbon transfer IS real, the quantities involved are very small, and we don't yet know whether they're ecologically significant. Others note that the fungal network isn't necessarily altruistic — fungi are independent organisms pursuing their own survival strategy. They may direct resources to whichever tree offers them the best return, essentially running a market economy beneath the forest floor. But regardless of the exact interpretation, one thing is clear: a forest is far more interconnected than we thought fifty years ago. Trees are not solitary competitors; they are participants in a complex, cooperative, and competitive underground economy that we are only beginning to understand.",
  questions: [
    { number: 1, type: "gist", question_text: "What is the main topic of the lecture?", options: ["A) The life cycle of forest trees.", "B) The underground fungal networks that connect forest trees.", "C) How to prevent insect attacks on trees.", "D) The history of Canadian forestry research."], correct_answer: "B", explanation_vi: "Toàn bộ bài giảng tập trung vào mycorrhizal networks — mạng lưới nấm kết nối cây trong rừng." },
    { number: 2, type: "detail", question_text: "According to the professor, what do trees provide to the fungi in this symbiotic relationship?", options: ["A) Water and minerals", "B) Phosphorus and nitrogen", "C) Sugars from photosynthesis", "D) Insect defense chemicals"], correct_answer: "C", explanation_vi: "Prof: 'the trees provide the fungi with sugars produced through photosynthesis.'" },
    { number: 3, type: "detail", question_text: "What did Suzanne Simard's carbon isotope experiment demonstrate?", options: ["A) That fungi cannot transfer carbon between trees.", "B) That older trees transferred carbon to younger seedlings through the fungal network.", "C) That trees only compete with each other.", "D) That Douglas fir trees are not connected to mycorrhizal networks."], correct_answer: "B", explanation_vi: "Prof: 'carbon absorbed by a large, established Douglas fir was transferred to young seedlings growing in the shade.'" },
    { number: 4, type: "inference", question_text: "What does the professor imply about the 'wood wide web' metaphor?", options: ["A) It is completely false and should be abandoned.", "B) While it captures something real, some scientists believe it oversimplifies a complex system.", "C) It was first proposed in the 19th century.", "D) It applies only to tropical forests."], correct_answer: "B", explanation_vi: "Prof: 'Some researchers argue that the 'wood wide web' metaphor has been overstated... the quantities involved are very small, and we don't yet know whether they're ecologically significant.'" },
    { number: 5, type: "purpose", question_text: "Why does the professor mention that fungi 'may direct resources to whichever tree offers them the best return'?", options: ["A) To suggest that fungi are altruistic organisms.", "B) To introduce an alternative interpretation — that the network may function like a market rather than a cooperative system.", "C) To argue that trees should be studied in isolation.", "D) To criticize Simard's research methods."], correct_answer: "B", explanation_vi: "Đây là alternative interpretation: fungi 'running a market economy beneath the forest floor' — không hoàn toàn hợp tác như một số người nghĩ." },
    { number: 6, type: "detail", question_text: "According to the lecture, what happens when a tree is attacked by insects?", options: ["A) The tree immediately dies.", "B) Neighboring trees may receive warning signals through the fungal network and produce defensive chemicals.", "C) The fungi abandon the tree completely.", "D) The tree releases sugars to attract more insects."], correct_answer: "B", explanation_vi: "Prof: 'warning signals can also travel through the fungal network underground, reaching neighboring trees before the insects do.'" },
  ],
  vocabulary_focus: [
    { word: "mycorrhizal", ipa: "/ˌmaɪ.kəˈraɪ.zəl/", vi_translation: "(thuộc về) nấm rễ cộng sinh", band_level: 8, context_use: "Thuật ngữ sinh học chỉ mối quan hệ cộng sinh giữa nấm và rễ cây." },
    { word: "symbiosis", ipa: "/ˌsɪm.baɪˈoʊ.sɪs/", vi_translation: "sự cộng sinh", band_level: 7, context_use: "Mối quan hệ trong đó cả hai bên cùng có lợi." },
    { word: "preemptively", ipa: "/priːˈɛmp.tɪv.li/", vi_translation: "một cách phủ đầu, dự phòng", band_level: 8, context_use: "Cây nhận tín hiệu cảnh báo sản xuất hóa chất phòng thủ 'preemptively' — trước khi bị tấn công." },
    { word: "altruistic", ipa: "/ˌæl.truˈɪs.tɪk/", vi_translation: "vị tha", band_level: 8, context_use: "Hành vi hy sinh lợi ích bản thân vì lợi ích của cá thể khác." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_TAKE_NOTES,
    STRAT_TRANSITIONS,
    "'Mycorrhizal' là từ khó — tập phát âm: MY-co-RYE-zal. Tập ghi chú nhanh bằng 'MC network' thay vì viết đầy đủ.",
    "Khi professor nói 'I should add a note of scientific caution' — đây là tín hiệu sắp có ý KIỂU phản biện, hầu như luôn có câu hỏi.",
    "Các thuật ngữ sinh học có nguồn gốc Hy Lạp/Latin: 'myco-' = fungus, '-rhizal' = root. Học prefix giúp đoán nghĩa.",
  ],
  common_mistakes_vi: [
    "Nhầm 'hyphae' (sợi nấm) với 'roots' (rễ cây) — đây là hai thứ khác nhau.",
    "Bỏ qua phần scientific caution ở cuối bài — cho rằng 'wood wide web' là kết luận đã được chứng minh đầy đủ.",
    "Hiểu 'market economy' theo nghĩa đen — đây là phép ẩn dụ cho cách nấm phân phối tài nguyên.",
  ],
  estimated_time_minutes: 7,
  difficulty_band: 7.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Conversation 3: Lab Partner Conflict (campus, Band 6.5)
// ═══════════════════════════════════════════════════════════════════════════

const CONVO_LAB_PARTNER: TOEFLListeningItem = {
  id: "toefl_listening_lab_partner_conflict",
  audioKey: "toefl-listening/toefl_listening_lab_partner_conflict.mp3",
  type: "conversation",
  section_label: "Conversation 3",
  topic_title_vi: "Mâu thuẫn với bạn cùng nhóm thí nghiệm",
  topic_title_en: "Lab Partner Conflict",
  audio_script: `STUDENT: Professor Davies, can I talk to you for a minute? It's about my chemistry lab.
PROFESSOR: Of course. Come in. What's going on?
STUDENT: I'm having a problem with my lab partner. We were assigned to work together for the whole semester, and the first three labs have been a disaster. He keeps showing up forty-five minutes late, and when he does arrive, he doesn't read the procedure beforehand. So I end up doing all the calculations and writing up the data while he just stands there.
PROFESSOR: Have you talked to him directly about it?
STUDENT: Yes, twice. The first time, he said he'd been sick. The second time, he just said sorry and promised to do better. But last Wednesday, the same thing happened, and he didn't even apologize.
PROFESSOR: I see. Has the quality of the work suffered as a result?
STUDENT: That's the strange part — the lab reports have actually been okay, because I do most of the work. But it's not fair, and I'm worried about the upcoming midterm lab practical, where we're supposed to work together under time pressure. If he's not prepared, we'll both fail.
PROFESSOR: Let me suggest a few options. First, I could reassign you to a different partner. There's another student in the same section whose partner dropped the course last week, so the timing actually works out.
STUDENT: That would be ideal, honestly. But I don't want to seem like I'm tattling.
PROFESSOR: It's not tattling — it's a legitimate request. Lab partnerships only work when both people contribute. The second option is that I could speak with him directly. Sometimes a conversation with the professor changes the dynamic.
STUDENT: I think I'd prefer the reassignment, if that's really an option. We've already had three weeks of friction, and I don't think a conversation will fix it at this point.
PROFESSOR: Understood. I'll arrange it for next week's lab. In the meantime, here's something to keep in mind for the future: when you start a new lab partnership — or any group project — set explicit expectations on day one. Agree on who reads the procedure before lab, who handles which calculations, and what happens if someone misses a session. It feels awkward, but it prevents exactly this kind of situation.
STUDENT: That makes sense. Thank you, Professor.`,
  questions: [
    { number: 1, type: "gist", question_text: "Why does the student visit Professor Davies?", options: ["A) To request a deadline extension on a lab report.", "B) To resolve a conflict with an unreliable lab partner.", "C) To switch into a different chemistry course.", "D) To ask about extra credit assignments."], correct_answer: "B", explanation_vi: "Sinh viên ngay đầu hội thoại nói 'I'm having a problem with my lab partner.'" },
    { number: 2, type: "detail", question_text: "Approximately how late has the partner been arriving to lab?", options: ["A) 15 minutes", "B) 30 minutes", "C) 45 minutes", "D) Over an hour"], correct_answer: "C", explanation_vi: "Sinh viên: 'He keeps showing up forty-five minutes late.'" },
    { number: 3, type: "detail", question_text: "Why does the professor say the timing for a reassignment 'actually works out'?", options: ["A) The semester is almost over anyway.", "B) Another student's partner just dropped the course.", "C) The midterm lab has been postponed.", "D) The lab schedule is being reorganized."], correct_answer: "B", explanation_vi: "Professor: 'There's another student in the same section whose partner dropped the course last week, so the timing actually works out.'" },
    { number: 4, type: "purpose", question_text: "Why does the student mention the upcoming midterm lab practical?", options: ["A) To ask the professor to delay the practical.", "B) To explain that previous lab grades have suffered.", "C) To justify why the partner problem needs to be resolved soon.", "D) To request that the practical be done individually."], correct_answer: "C", explanation_vi: "Sinh viên dùng midterm practical làm lý do cấp bách: 'If he's not prepared, we'll both fail.'" },
    { number: 5, type: "inference", question_text: "What can be inferred about the student's hesitation regarding the reassignment?", options: ["A) She is concerned about appearing as if she's reporting on her partner.", "B) She does not believe the new partner will be any better.", "C) She prefers to continue working with her current partner.", "D) She wants extra credit for handling the situation alone."], correct_answer: "A", explanation_vi: "Sinh viên: 'I don't want to seem like I'm tattling.' Đây là sự ngần ngại về việc bị xem là tố cáo." },
    { number: 6, type: "attitude", question_text: "What is the professor's tone when offering advice about future lab partnerships?", options: ["A) Critical and dismissive.", "B) Constructive and forward-looking.", "C) Reluctant to give any advice.", "D) Angry at the student for not handling it sooner."], correct_answer: "B", explanation_vi: "Professor đề xuất quy tắc cho tương lai: 'set explicit expectations on day one' — giọng điệu xây dựng và hướng tới tương lai." },
  ],
  vocabulary_focus: [
    { word: "tattling", ipa: "/ˈtæt.əl.ɪŋ/", vi_translation: "tố cáo, mách lẻo", band_level: 7, context_use: "Hành vi báo cáo lỗi của người khác cho người có thẩm quyền — thường bị xem là tiêu cực." },
    { word: "reassign", ipa: "/ˌriː.əˈsaɪn/", vi_translation: "phân công lại", band_level: 7, context_use: "'Reassign you to a different partner' = phân công lại cho bạn cùng nhóm khác." },
    { word: "friction", ipa: "/ˈfrɪk.ʃən/", vi_translation: "ma sát, mâu thuẫn", band_level: 7, context_use: "Trong ngữ cảnh xã hội: căng thẳng giữa hai người làm việc cùng nhau." },
    { word: "lab practical", ipa: "/læb ˈpræk.tɪ.kəl/", vi_translation: "bài thi thực hành tại phòng thí nghiệm", band_level: 7, context_use: "Một dạng bài kiểm tra trong đó sinh viên thực hiện một quy trình thí nghiệm dưới giới hạn thời gian." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_INTONATION,
    STRAT_TRANSITIONS,
    "Conversation về 'conflict' thường có cấu trúc: vấn đề → đã thử gì → giải pháp được đề xuất → quyết định. Note theo cấu trúc này.",
    "'Tattling' và 'reporting' nghe khác nhau với người bản ngữ — tattling mang nghĩa tiêu cực (trẻ con mách lẻo), reporting trung tính.",
  ],
  common_mistakes_vi: [
    "Nhầm rằng sinh viên đang phàn nàn về điểm — thực ra điểm 'lab reports have actually been okay'.",
    "Bỏ qua việc sinh viên đã CHỌN reassignment thay vì để professor nói chuyện — đây là chi tiết quan trọng cho câu hỏi inference.",
    "Hiểu lời khuyên cuối của professor là chỉ trích — thực ra là forward-looking advice cho tương lai.",
  ],
  estimated_time_minutes: 5,
  difficulty_band: 6.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Lecture 3: Bystander Effect (social science / psychology, Band 7.5)
// ═══════════════════════════════════════════════════════════════════════════

const LECTURE_BYSTANDER: TOEFLListeningItem = {
  id: "toefl_listening_bystander_effect",
  audioKey: "toefl-listening/toefl_listening_bystander_effect.mp3",
  type: "lecture",
  section_label: "Lecture 3",
  topic_title_vi: "Hiệu ứng người ngoài cuộc",
  topic_title_en: "The Bystander Effect",
  audio_script: "PROFESSOR: Today I want to talk about a classic finding in social psychology — one that has shaped how we think about human behavior in emergencies for over fifty years. It's called the bystander effect, and it refers to a counterintuitive phenomenon: the more people who witness an emergency, the LESS likely any one of them is to intervene.\n\nThe research origins of this concept go back to a 1964 incident in New York City. A young woman named Kitty Genovese was attacked outside her apartment building, and according to news reports at the time, dozens of neighbors heard her cries for help but did nothing. Now, I should note that subsequent investigations have questioned some of those original reports — the number of witnesses was probably smaller than initially claimed, and some did call the police. But the case sparked a wave of psychological research that has held up remarkably well even when the specific Genovese details have been revised.\n\nThe two researchers most associated with this work are John Darley and Bibb Latané. In a series of experiments in the late 1960s, they staged various emergencies — smoke filling a room, a person apparently having a seizure, a request for help from another room — and systematically varied the number of bystanders present. The results were striking. When subjects believed they were the only person aware of the emergency, roughly seventy-five percent took action within a few minutes. But when subjects believed five other people were also aware, intervention rates dropped to around thirty percent — and those who did help took significantly longer to act.\n\nDarley and Latané proposed two psychological mechanisms to explain this pattern. The first is what they called 'diffusion of responsibility.' When you're the only witness, you bear all the responsibility for helping — and the social and moral cost of doing nothing is high. But when other witnesses are present, that responsibility gets divided, even if no one explicitly discusses it. Each individual bystander thinks, consciously or unconsciously, 'somebody else will probably handle this' — and as a result, no one does.\n\nThe second mechanism is 'pluralistic ignorance,' which is more subtle. In an ambiguous situation — is that person actually having a heart attack, or just resting? — we look to others for cues about how to interpret what we're seeing. If no one else is reacting with alarm, we conclude the situation must not be serious. But of course, the other bystanders are doing exactly the same thing — looking at us for cues. The result is a kind of frozen inaction in which everyone is waiting for someone else to confirm that the emergency is real.\n\nNow, I want to leave you with one important nuance. Recent research using video footage of actual public emergencies has produced a more optimistic picture than the laboratory studies suggest. In a 2019 study analyzing surveillance footage from cities in three countries, researchers found that bystanders intervened in roughly ninety percent of public assault cases — much higher than Darley and Latané would have predicted. So the bystander effect is real, but it may be weaker in genuine high-stakes situations than in the artificial scenarios used in early experiments. The lesson, perhaps, is not that humans are passive in emergencies, but that we are slower to act when uncertainty is high and responsibility is shared. Knowing this — being aware of the effect — actually helps us push past it when the moment comes.",
  questions: [
    { number: 1, type: "gist", question_text: "What is the main topic of the lecture?", options: ["A) The history of New York City crime in the 1960s.", "B) The bystander effect and its psychological explanations.", "C) The career of psychologist Bibb Latané.", "D) Differences between laboratory and field research."], correct_answer: "B", explanation_vi: "Bài giảng tập trung vào bystander effect, các thí nghiệm gốc, và hai cơ chế tâm lý giải thích nó." },
    { number: 2, type: "detail", question_text: "In the Darley and Latané experiments, what was the approximate intervention rate when subjects believed they were the only witness?", options: ["A) 30%", "B) 50%", "C) 75%", "D) 90%"], correct_answer: "C", explanation_vi: "Prof: 'When subjects believed they were the only person aware of the emergency, roughly seventy-five percent took action.'" },
    { number: 3, type: "detail", question_text: "What is 'diffusion of responsibility'?", options: ["A) The tendency for emergencies to spread to multiple locations.", "B) The division of moral responsibility among multiple witnesses, leading each to assume someone else will act.", "C) A method for distributing tasks fairly in a workplace.", "D) The professor's name for a category of brain disease."], correct_answer: "B", explanation_vi: "Prof: 'when other witnesses are present, that responsibility gets divided... Each individual bystander thinks somebody else will probably handle this.'" },
    { number: 4, type: "inference", question_text: "What can be inferred about the original Kitty Genovese reports?", options: ["A) They were entirely fabricated by journalists.", "B) Subsequent investigations found the number of witnesses was likely smaller than initially reported.", "C) Genovese herself was uninjured.", "D) The case has no connection to the bystander effect."], correct_answer: "B", explanation_vi: "Prof: 'subsequent investigations have questioned some of those original reports — the number of witnesses was probably smaller than initially claimed.'" },
    { number: 5, type: "purpose", question_text: "Why does the professor describe pluralistic ignorance?", options: ["A) To argue that bystanders are deliberately uncaring.", "B) To explain a second mechanism, distinct from diffusion of responsibility, that contributes to bystander inaction.", "C) To suggest that emergencies are usually misinterpreted.", "D) To dismiss Darley and Latané's research."], correct_answer: "B", explanation_vi: "Prof giới thiệu pluralistic ignorance là 'second mechanism' — bổ sung cho diffusion of responsibility, không thay thế nó." },
    { number: 6, type: "attitude", question_text: "What is the professor's overall view of the bystander effect by the end of the lecture?", options: ["A) The effect is entirely a myth disproved by recent research.", "B) The effect is real but may be weaker in genuine emergencies than in laboratory scenarios.", "C) The effect is even stronger than Darley and Latané proposed.", "D) The effect cannot be studied scientifically."], correct_answer: "B", explanation_vi: "Prof kết luận: 'the bystander effect is real, but it may be weaker in genuine high-stakes situations than in the artificial scenarios used in early experiments.'" },
  ],
  vocabulary_focus: [
    { word: "counterintuitive", ipa: "/ˌkaʊn.t̬ɚ.ɪnˈtuː.ɪ.t̬ɪv/", vi_translation: "trái với trực giác", band_level: 8, context_use: "Hiện tượng đi ngược lại điều ta tưởng đúng (ví dụ: nhiều người chứng kiến lại ít can thiệp hơn)." },
    { word: "diffusion", ipa: "/dɪˈfjuː.ʒən/", vi_translation: "sự khuếch tán, phân tán", band_level: 7, context_use: "'Diffusion of responsibility' = trách nhiệm bị phân tán giữa nhiều người." },
    { word: "pluralistic ignorance", ipa: "/ˌplʊr.əˈlɪs.tɪk ˈɪɡ.nɚ.əns/", vi_translation: "ngu dốt số đông", band_level: 8, context_use: "Hiện tượng nhiều người cùng hiểu sai một tình huống vì mỗi người dựa vào phản ứng của người khác." },
    { word: "ambiguous", ipa: "/æmˈbɪɡ.ju.əs/", vi_translation: "mơ hồ, không rõ ràng", band_level: 7, context_use: "Tình huống có thể được hiểu theo nhiều cách — yếu tố làm tăng pluralistic ignorance." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_TAKE_NOTES,
    STRAT_TRANSITIONS,
    "Bài giảng có cấu trúc: hiện tượng → ví dụ lịch sử → thí nghiệm → 2 cơ chế → nuance hiện đại. Note theo cấu trúc này.",
    "Hai cơ chế (diffusion of responsibility, pluralistic ignorance) là 'compare/contrast pair' — câu hỏi hay yêu cầu phân biệt.",
    "'Counterintuitive' = trái với trực giác. Dấu hiệu rằng prof sắp giải thích điều gì đó NGƯỢC với suy nghĩ thông thường.",
  ],
  common_mistakes_vi: [
    "Cho rằng diffusion of responsibility và pluralistic ignorance là cùng một thứ — chúng KHÁC nhau (một là chia trách nhiệm, một là hiểu sai tình huống).",
    "Quên phần 'recent research' ở cuối — câu hỏi attitude/conclusion thường nằm ở đó.",
    "Chốt rằng Genovese case bị bác bỏ hoàn toàn — thực ra prof nói các CHI TIẾT bị xét lại nhưng lý thuyết vẫn vững.",
  ],
  estimated_time_minutes: 7,
  difficulty_band: 7.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Lecture 4: The Printing Press and Information Revolution (history, Band 7.5)
// ═══════════════════════════════════════════════════════════════════════════

const LECTURE_PRINTING_PRESS: TOEFLListeningItem = {
  id: "toefl_listening_printing_press",
  audioKey: "toefl-listening/toefl_listening_printing_press.mp3",
  type: "lecture",
  section_label: "Lecture 4",
  topic_title_vi: "Máy in và cuộc cách mạng thông tin",
  topic_title_en: "The Printing Press and the Information Revolution",
  audio_script: "PROFESSOR: When historians look for technologies that genuinely changed the course of civilization — that didn't just make existing tasks faster, but actually restructured how societies functioned — Johannes Gutenberg's movable type printing press, developed in the German city of Mainz around 1450, is almost always near the top of the list. Today I want to look at WHY this particular invention had such enormous consequences, because the answer isn't quite as obvious as it might seem.\n\nFirst, some context. Printing itself wasn't new in 1450. The Chinese had been using wood-block printing since at least the seventh century, and Korean printers had experimented with movable metal type as early as the 1230s. What was different about Gutenberg's system was the combination of three innovations: a durable alloy for the type pieces, an oil-based ink that adhered well to metal, and — crucially — a press mechanism adapted from the wine and olive presses common in the Rhine valley. None of these alone was revolutionary. Together, they made it possible to produce books at a fraction of the previous cost, with consistent quality, in numbers that simply hadn't existed before.\n\nLet me give you some numbers. Before Gutenberg, a hand-copied Bible took a single scribe roughly a year to produce and cost the equivalent of a small farm. Within fifty years of Gutenberg's first Bible in 1455, more than twenty million printed books were in circulation across Europe — more books than European scribes had produced in the previous thousand years combined. The price of a typical book fell to perhaps one percent of what a manuscript had cost. For the first time in European history, owning a personal library was within reach of merchants, doctors, lawyers, and even prosperous craftsmen — not just monasteries and nobility.\n\nBut here's where it gets interesting from a historian's perspective. The economic impact was enormous, but the cultural impact was even more significant. When information becomes cheap and abundant, several things happen that were not obvious in advance. Take the Protestant Reformation, which began in 1517 with Martin Luther's Ninety-Five Theses. Luther's complaints against the Catholic Church were not new — earlier reformers like Jan Hus had raised similar objections a century earlier and been burned at the stake. Why did Luther succeed where Hus had failed? The standard answer points directly to printing. Luther's pamphlets, written in vernacular German rather than Latin, were reprinted within weeks in dozens of cities across Europe. By 1523, an estimated three million copies of Luther's writings were in circulation. The Catholic Church, which had successfully suppressed earlier heretics by controlling manuscript copying, found itself unable to control the printing press.\n\nA second consequence was the rise of standardized national languages. In manuscript culture, regional dialects had varied enormously, and there was no clear 'correct' way to spell or write a given language. Printers, however, needed to choose one form. As books printed in particular dialects — the German of Saxony, the English of London, the Italian of Florence — circulated widely, those dialects gradually became accepted as the 'standard' form of their respective languages. This standardization, in turn, helped create the sense of shared national identity that would become so powerful in later centuries.\n\nFinally, the printing press transformed science. Before printing, scientific knowledge depended on personal correspondence and slow manuscript copying — and copying errors accumulated, sometimes to the point of making a text useless. After printing, an astronomer in Bologna and an astronomer in Cracow could be sure they were reading the exact same book, with the exact same diagrams. This made systematic, cumulative scientific progress possible in a way it simply hadn't been before. So when we ask why the Scientific Revolution emerged in Europe in the sixteenth and seventeenth centuries — and not, say, in China, which had been technologically more advanced for centuries — printing has to be a significant part of the answer.",
  questions: [
    { number: 1, type: "gist", question_text: "What is the lecture mainly about?", options: ["A) The biography of Johannes Gutenberg.", "B) The technical components of the printing press.", "C) Why the Gutenberg printing press had such large cultural and political consequences.", "D) The history of book prices in medieval Europe."], correct_answer: "C", explanation_vi: "Prof tập trung vào CÁC HỆ QUẢ của printing press — kinh tế, văn hóa, tôn giáo, ngôn ngữ, khoa học — không chỉ kỹ thuật." },
    { number: 2, type: "detail", question_text: "Which of the following innovations was specifically adapted from existing technology in the Rhine valley?", options: ["A) The metal alloy for type pieces.", "B) The oil-based ink.", "C) The press mechanism, adapted from wine and olive presses.", "D) The Latin alphabet."], correct_answer: "C", explanation_vi: "Prof: 'a press mechanism adapted from the wine and olive presses common in the Rhine valley.'" },
    { number: 3, type: "detail", question_text: "Approximately how many printed books were in circulation in Europe within 50 years of Gutenberg's first Bible?", options: ["A) 100,000", "B) 1 million", "C) 20 million", "D) 100 million"], correct_answer: "C", explanation_vi: "Prof: 'Within fifty years of Gutenberg's first Bible in 1455, more than twenty million printed books were in circulation across Europe.'" },
    { number: 4, type: "inference", question_text: "What does the professor imply about why Martin Luther succeeded where earlier reformers like Jan Hus had failed?", options: ["A) Luther's theological arguments were more sophisticated.", "B) The printing press allowed Luther's ideas to spread faster than the Church could suppress them.", "C) The Catholic Church had become weaker by 1517.", "D) Luther had stronger political connections."], correct_answer: "B", explanation_vi: "Prof: 'The Catholic Church, which had successfully suppressed earlier heretics by controlling manuscript copying, found itself unable to control the printing press.'" },
    { number: 5, type: "purpose", question_text: "Why does the professor mention that printing existed in China and Korea before Gutenberg?", options: ["A) To argue that Gutenberg's contribution was unimportant.", "B) To establish that the revolutionary aspect of Gutenberg's system was the COMBINATION of innovations, not printing itself.", "C) To compare Asian and European literacy rates.", "D) To suggest Gutenberg copied his ideas from Asia."], correct_answer: "B", explanation_vi: "Prof nói 'Printing itself wasn't new in 1450' rồi nhấn mạnh 'the combination of three innovations' là điều đột phá." },
    { number: 6, type: "attitude", question_text: "Why does the professor mention China at the end of the lecture?", options: ["A) To argue that China invented the modern Scientific Revolution.", "B) To raise the question of why the Scientific Revolution emerged in Europe rather than in technologically advanced China — and to credit printing as part of the answer.", "C) To criticize Chinese scholarly practices.", "D) To suggest that European science was derived from Chinese sources."], correct_answer: "B", explanation_vi: "Prof: 'when we ask why the Scientific Revolution emerged in Europe... and not, say, in China... printing has to be a significant part of the answer.'" },
  ],
  vocabulary_focus: [
    { word: "movable type", ipa: "/ˈmuː.və.bəl taɪp/", vi_translation: "kiểu chữ rời", band_level: 7, context_use: "Hệ thống in trong đó từng chữ cái là một mảnh kim loại có thể sắp xếp lại — đột phá của Gutenberg." },
    { word: "vernacular", ipa: "/vɚˈnæk.jə.lɚ/", vi_translation: "tiếng địa phương / tiếng dân gian", band_level: 8, context_use: "Luther viết bằng 'vernacular German' — tiếng Đức bình dân, không phải tiếng Latin của giới học giả." },
    { word: "scribe", ipa: "/skraɪb/", vi_translation: "người chép sách (tay)", band_level: 7, context_use: "Trước Gutenberg, sách được chép tay bởi scribes trong tu viện." },
    { word: "cumulative", ipa: "/ˈkjuː.mjə.lə.t̬ɪv/", vi_translation: "tích lũy", band_level: 7, context_use: "'Cumulative scientific progress' = tiến bộ khoa học tích lũy theo thời gian — chỉ có khi văn bản chuẩn được lưu hành." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_TAKE_NOTES,
    STRAT_TRANSITIONS,
    "Bài giảng theo cấu trúc cause-effect: technology → economic → cultural (religion, language, science). Note theo từng tầng.",
    "Số liệu cụ thể (1450, 1455, 1517, 1523, 20 triệu sách, 3 triệu pamphlet) là chi tiết hay hỏi. Ghi đầy đủ.",
    "Khi prof nói 'Why did Luther succeed where Hus had failed?' — đây là rhetorical question, sắp có câu trả lời quan trọng.",
  ],
  common_mistakes_vi: [
    "Cho rằng Gutenberg phát minh ra in ấn — thực ra Trung Quốc và Hàn Quốc đã in trước; đột phá là COMBINATION ba yếu tố.",
    "Nhầm Hus và Luther — Hus là người trước (bị thiêu), Luther là người thành công (nhờ printing press).",
    "Bỏ qua phần 'standardized national languages' — đây là consequence riêng, không phải hệ quả của Reformation.",
  ],
  estimated_time_minutes: 8,
  difficulty_band: 7.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Lecture 5: Renaissance Linear Perspective (arts, Band 7.5)
// ═══════════════════════════════════════════════════════════════════════════

const LECTURE_PERSPECTIVE: TOEFLListeningItem = {
  id: "toefl_listening_linear_perspective",
  audioKey: "toefl-listening/toefl_listening_linear_perspective.mp3",
  type: "lecture",
  section_label: "Lecture 5",
  topic_title_vi: "Phối cảnh tuyến tính thời Phục Hưng",
  topic_title_en: "Linear Perspective in Renaissance Painting",
  audio_script: "PROFESSOR: Look at any major Western painting from before about 1420 — a medieval altarpiece, a Byzantine icon, a Gothic illuminated manuscript — and you'll notice something strange. The figures often seem to float in indeterminate space. Buildings appear to lean at impossible angles. Important figures are sometimes much larger than the people standing right next to them. Now look at a painting from a hundred years later — Raphael's School of Athens, say, or Leonardo's Last Supper — and the difference is unmistakable. Suddenly we're looking through a window into a coherent three-dimensional space. What happened in that century? The short answer is: linear perspective.\n\nLinear perspective is a mathematical technique for representing three-dimensional space on a two-dimensional surface. The basic principle is that parallel lines receding into the distance — the edges of a road, the columns of a colonnade — appear to converge at a single point on the horizon, called the vanishing point. Anything we want to depict at a distance is drawn smaller, in proportion to that distance, with everything organized around this single fixed viewpoint. The viewer becomes, in effect, the eye of the painting.\n\nThe credit for the systematic discovery of linear perspective generally goes to the Florentine architect Filippo Brunelleschi, who is best known for designing the great dome of Florence Cathedral. Around 1413, Brunelleschi conducted a famous experiment in front of the Florence Baptistery. He painted the Baptistery on a small panel using strict geometric rules — and then drilled a hole through the panel at the exact location of the vanishing point. By holding a mirror in front of the painted side and looking through the hole from behind, a viewer would see the reflected painting line up almost perfectly with the actual building visible behind it. This was, in essence, a demonstration that mathematics could capture visual reality.\n\nBrunelleschi himself didn't write down his rules. The man who did was a fellow Florentine, the polymath Leon Battista Alberti, whose 1435 treatise 'On Painting' provided the first systematic written description of perspective. Alberti's text became the workshop manual for an entire generation of Italian artists. By the 1450s, painters such as Piero della Francesca were using perspective with extraordinary mathematical precision — Piero himself wrote a separate treatise on perspective and was accomplished in pure geometry.\n\nNow, here's what I find most interesting about this story. Linear perspective is sometimes presented as an obvious improvement — as if medieval artists were simply WRONG and Renaissance artists FIXED the problem. But that's not how art historians today see it. Medieval artists were not failing to depict realistic space; they were depicting something else entirely. In a Byzantine icon, for example, the size of figures often reflects spiritual importance, not physical proximity. Christ is large because Christ is theologically central, not because Christ is closer to the viewer. The flat, gold-background space of a medieval altarpiece was not meant to be a window into the physical world — it was meant to evoke a sacred, timeless space outside ordinary experience.\n\nWhat linear perspective did, then, was not 'correct' an error but propose a fundamentally different theory of what painting is for. Renaissance perspective treats the painting as a window — a slice of optical reality presented to a single human viewer at a fixed position. This is intimately connected with the broader Renaissance interest in classical antiquity, in mathematics, in human experience as the measure of all things. So when you see the deep, coherent space of a Raphael fresco, you're not just seeing a technical achievement. You're seeing a particular philosophical stance about the human viewer, about the visible world, and about the role of art — a stance that would dominate Western painting for the next four centuries, until the impressionists and modernists began to question it again in the late 1800s.",
  questions: [
    { number: 1, type: "gist", question_text: "What is the main topic of the lecture?", options: ["A) The biography of Filippo Brunelleschi.", "B) Linear perspective in Renaissance painting and its broader cultural meaning.", "C) The construction of Florence Cathedral.", "D) Differences between Italian and Byzantine architecture."], correct_answer: "B", explanation_vi: "Prof không chỉ giải thích kỹ thuật phối cảnh mà còn đặt nó vào bối cảnh văn hóa rộng hơn — chuyển dịch trong cách hiểu về vai trò của hội họa." },
    { number: 2, type: "detail", question_text: "What was Brunelleschi's famous experiment in front of the Florence Baptistery designed to demonstrate?", options: ["A) That mirrors could be used as art tools.", "B) That mathematical rules of perspective could capture visual reality with great accuracy.", "C) That the Baptistery was poorly designed architecturally.", "D) That painting on small panels was superior to fresco."], correct_answer: "B", explanation_vi: "Prof: 'This was, in essence, a demonstration that mathematics could capture visual reality.'" },
    { number: 3, type: "detail", question_text: "Who wrote the first systematic treatise on perspective?", options: ["A) Filippo Brunelleschi", "B) Leon Battista Alberti", "C) Piero della Francesca", "D) Raphael"], correct_answer: "B", explanation_vi: "Prof: 'Alberti, whose 1435 treatise On Painting provided the first systematic written description of perspective.'" },
    { number: 4, type: "inference", question_text: "What can be inferred about the size of figures in a Byzantine icon?", options: ["A) Larger figures are always closer to the viewer.", "B) Size is determined primarily by spiritual or theological importance, not physical distance.", "C) All figures are drawn the same size.", "D) Size depends on the artist's personal preference with no rule."], correct_answer: "B", explanation_vi: "Prof: 'In a Byzantine icon... the size of figures often reflects spiritual importance, not physical proximity.'" },
    { number: 5, type: "purpose", question_text: "Why does the professor argue that linear perspective did not 'correct' an error in medieval art?", options: ["A) Because medieval painters didn't actually exist.", "B) Because medieval artists were depicting a different kind of space — sacred and symbolic — not failing at physical realism.", "C) Because linear perspective was actually invented in the Middle Ages.", "D) Because Renaissance perspective is mathematically incorrect."], correct_answer: "B", explanation_vi: "Prof: 'Medieval artists were not failing to depict realistic space; they were depicting something else entirely.'" },
    { number: 6, type: "attitude", question_text: "What is the professor's view of the relationship between Renaissance perspective and broader Renaissance culture?", options: ["A) The two are unconnected; perspective was a purely technical advance.", "B) Perspective expressed deeper Renaissance values — interest in classical antiquity, mathematics, and the human viewer as the measure of reality.", "C) Renaissance culture rejected perspective as too rigid.", "D) Perspective was a Byzantine import."], correct_answer: "B", explanation_vi: "Prof kết luận: 'intimately connected with the broader Renaissance interest in classical antiquity, in mathematics, in human experience as the measure of all things.'" },
  ],
  vocabulary_focus: [
    { word: "vanishing point", ipa: "/ˈvæn.ɪ.ʃɪŋ pɔɪnt/", vi_translation: "điểm tụ", band_level: 7, context_use: "Điểm trên đường chân trời nơi các đường song song có vẻ hội tụ — khái niệm trung tâm của phối cảnh tuyến tính." },
    { word: "treatise", ipa: "/ˈtriː.t̬ɪs/", vi_translation: "luận văn, chuyên khảo", band_level: 7, context_use: "Văn bản học thuật dài và có hệ thống. Alberti's 1435 'treatise On Painting'." },
    { word: "polymath", ipa: "/ˈpɑː.li.mæθ/", vi_translation: "người đa tài (nhiều lĩnh vực)", band_level: 8, context_use: "Người thông thạo nhiều lĩnh vực — Alberti là kiến trúc sư, nhà toán học, nhà văn." },
    { word: "altarpiece", ipa: "/ˈɔːl.tɚ.piːs/", vi_translation: "tranh thờ trên bàn thờ", band_level: 8, context_use: "Tác phẩm nghệ thuật tôn giáo đặt phía sau bàn thờ trong nhà thờ — đặc trưng của hội họa thời trung cổ." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_TAKE_NOTES,
    STRAT_TRANSITIONS,
    "Bài giảng có 2 phần: (1) cách phối cảnh hoạt động + lịch sử khám phá, (2) ý nghĩa văn hóa rộng hơn. Note riêng từng phần.",
    "Tên người + năm là chi tiết hay hỏi: Brunelleschi (~1413), Alberti (1435), Piero della Francesca (1450s).",
    "Khi prof nói 'here's what I find most interesting' — đây là tín hiệu cho ý thesis chính của bài.",
  ],
  common_mistakes_vi: [
    "Hiểu prof đang nói medieval art LÀ KÉM hơn Renaissance art — thực ra prof phản bác quan điểm này.",
    "Nhầm Brunelleschi (kiến trúc sư, làm thí nghiệm) với Alberti (viết treatise).",
    "Bỏ qua đoạn cuối về impressionists/modernists — chi tiết để trả lời câu hỏi 'how long did this dominate?'",
  ],
  estimated_time_minutes: 8,
  difficulty_band: 7.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Lecture 6: The Human Microbiome (science, Band 8.5)
// ═══════════════════════════════════════════════════════════════════════════

const LECTURE_MICROBIOME: TOEFLListeningItem = {
  id: "toefl_listening_human_microbiome",
  audioKey: "toefl-listening/toefl_listening_human_microbiome.mp3",
  type: "lecture",
  section_label: "Lecture 6",
  topic_title_vi: "Hệ vi sinh vật người",
  topic_title_en: "The Human Microbiome",
  audio_script: "PROFESSOR: For most of the history of medicine, microbes were viewed almost exclusively as enemies — as the agents of disease, things to be killed with antibiotics or sterilized away with disinfectants. Over the last twenty years, that view has been almost completely overturned. We now know that the human body is home to roughly thirty-eight trillion microbial cells — bacteria, fungi, viruses, and archaea — collectively called the human microbiome. To put that number in perspective: it's roughly equal to the number of human cells in our bodies. By cell count, you are approximately half human and half microbe.\n\nThe vast majority of these microbes live in the gut, particularly the large intestine, where they form a complex ecosystem that researchers are only beginning to understand. The collective genome of these microbes — sometimes called the metagenome — contains more than two hundred times as many genes as the human genome itself. Some of these microbial genes do things our own cells cannot. They digest fibers our enzymes can't break down, synthesize vitamins our bodies don't make, and produce compounds that influence our immune system, our metabolism, and — increasingly clearly — even our brain.\n\nThe gut-brain connection is one of the most fascinating frontiers of microbiome research. There's a major nerve called the vagus nerve that connects the gut directly to the brain, and gut microbes can produce neurotransmitters — including serotonin, dopamine, and GABA — that influence signaling along this nerve. Studies in mice have shown that transferring the microbiome of an anxious mouse into a previously calm mouse can produce anxiety-like behavior in the recipient. The reverse transfer can produce calming effects. While we have to be cautious about extending mouse findings directly to humans, parallel patterns have appeared in clinical observations: people with depression often have measurably different gut microbiomes from people without depression, and certain probiotic interventions have shown modest but real effects on mood.\n\nAnother active area is the relationship between the microbiome and the immune system. Roughly seventy percent of immune cells reside in tissues lining the gut, where they are in constant contact with microbial populations. Early-life exposure to a diverse microbial environment appears to be important for proper immune development. The 'hygiene hypothesis,' first proposed in the late 1980s, suggests that the rising rates of allergies and autoimmune disorders in industrialized societies are partly due to children growing up in excessively sanitized environments, depriving their developing immune systems of the microbial inputs needed to learn proper regulation. Recent research has refined this into what's now called the 'old friends' hypothesis — the idea is not that we need MORE pathogens, but that we need contact with the diverse, mostly harmless microbes our species evolved alongside.\n\nNow, I want to be careful about the limitations here, because microbiome research is famously prone to overhype. Popular media sometimes treats the microbiome as a magic explanation for everything from obesity to autism, and we don't have nearly enough rigorous data to support most of those claims. Many published correlations turn out not to replicate when other research groups try the same study with different populations. Causation is particularly hard to establish — does an altered microbiome CAUSE depression, or does depression CAUSE an altered microbiome through changed eating patterns and inflammation? Often both are true. So the honest summary is this: the microbiome is genuinely important, more important than we appreciated even ten years ago, but we are still in early days of understanding what to do with that knowledge clinically. Be skeptical of probiotic supplements claiming dramatic benefits — most have minimal evidence supporting them — but pay attention to dietary fiber, which feeds gut bacteria, and to the broader principle that human biology is intertwined with microbial biology in ways our medical traditions have only just begun to take seriously.",
  questions: [
    { number: 1, type: "gist", question_text: "What is the main topic of the lecture?", options: ["A) The dangers of bacterial infections.", "B) The human microbiome — what it is, what it does, and the limits of current research.", "C) The history of antibiotics.", "D) Probiotic supplement marketing."], correct_answer: "B", explanation_vi: "Prof bao quát microbiome từ cell count, gut-brain, immune system, đến hạn chế nghiên cứu hiện tại." },
    { number: 2, type: "detail", question_text: "Approximately how many microbial cells does the human body host?", options: ["A) 38 thousand", "B) 38 million", "C) 38 billion", "D) 38 trillion"], correct_answer: "D", explanation_vi: "Prof: 'roughly thirty-eight trillion microbial cells.'" },
    { number: 3, type: "detail", question_text: "What is the vagus nerve?", options: ["A) A nerve that connects the gut directly to the brain.", "B) A bundle of microbes in the small intestine.", "C) A type of digestive enzyme.", "D) The largest nerve in the human leg."], correct_answer: "A", explanation_vi: "Prof: 'There's a major nerve called the vagus nerve that connects the gut directly to the brain.'" },
    { number: 4, type: "inference", question_text: "What can be inferred about the 'old friends' hypothesis?", options: ["A) It claims that pathogens cause autoimmune disease.", "B) It is a refinement of the hygiene hypothesis, emphasizing exposure to traditionally co-evolved microbes rather than to harmful ones.", "C) It rejects the hygiene hypothesis entirely.", "D) It applies only to children with allergies."], correct_answer: "B", explanation_vi: "Prof: 'the idea is not that we need MORE pathogens, but that we need contact with the diverse, mostly harmless microbes our species evolved alongside.'" },
    { number: 5, type: "purpose", question_text: "Why does the professor describe the mouse microbiome transfer experiments?", options: ["A) To prove that humans can be cured of anxiety with microbe transfers.", "B) To illustrate one line of evidence — with appropriate caution — for the gut-brain connection.", "C) To recommend that students take probiotics.", "D) To suggest mouse research is irrelevant to humans."], correct_answer: "B", explanation_vi: "Prof present thí nghiệm chuột rồi nói 'we have to be cautious about extending mouse findings directly to humans' nhưng cũng nêu parallel observations ở người." },
    { number: 6, type: "attitude", question_text: "What is the professor's overall attitude toward microbiome research?", options: ["A) Dismissive — most claims are unfounded hype.", "B) Enthusiastic without reservation — the field will solve major medical problems within the decade.", "C) Cautiously optimistic — the field is genuinely important but prone to overhype, and rigorous evidence is still emerging.", "D) Hostile to all probiotic interventions."], correct_answer: "C", explanation_vi: "Prof gọi nghiên cứu là 'genuinely important' nhưng cũng cảnh báo 'famously prone to overhype' và 'we are still in early days' — quan điểm cẩn trọng nhưng tích cực." },
  ],
  vocabulary_focus: [
    { word: "microbiome", ipa: "/ˈmaɪ.kroʊ.baɪ.oʊm/", vi_translation: "hệ vi sinh vật", band_level: 8, context_use: "Tổng thể vi khuẩn, nấm, virus sống trong/trên cơ thể người." },
    { word: "metagenome", ipa: "/ˌmɛt.əˈdʒiː.noʊm/", vi_translation: "siêu hệ gen", band_level: 8, context_use: "Tổng hợp tất cả các gen của vi sinh vật trong hệ vi sinh — lớn hơn hệ gen người 200 lần." },
    { word: "neurotransmitter", ipa: "/ˌnʊr.oʊ.trænzˈmɪt.ɚ/", vi_translation: "chất dẫn truyền thần kinh", band_level: 8, context_use: "Chất hóa học dẫn tín hiệu giữa các tế bào thần kinh — serotonin, dopamine, GABA." },
    { word: "replicate", ipa: "/ˈrɛp.lɪ.keɪt/", vi_translation: "tái lập (kết quả nghiên cứu)", band_level: 7, context_use: "Trong khoa học: tái lập một thí nghiệm để kiểm chứng. 'Many published correlations turn out not to replicate.'" },
  ],
  vietnamese_speaker_strategies: [
    STRAT_TAKE_NOTES,
    STRAT_TRANSITIONS,
    "Bài giảng có 4 phần: (1) tổng quan + số liệu, (2) gut-brain, (3) immune system, (4) cảnh báo về overhype. Note theo cấu trúc.",
    "Khi prof nói 'I want to be careful about the limitations here' — sắp có nội dung quan trọng cho câu hỏi attitude.",
    "Học các thuật ngữ y khoa qua prefix: 'micro-' = nhỏ, 'meta-' = vượt qua, 'neuro-' = thần kinh, 'auto-' = tự, 'patho-' = bệnh.",
  ],
  common_mistakes_vi: [
    "Cho rằng prof đang quảng bá probiotic supplements — thực ra prof khuyến cáo NGHI NGỜ chúng.",
    "Hiểu 'half human and half microbe' theo nghĩa khối lượng — thực ra là theo SỐ LƯỢNG TẾ BÀO.",
    "Bỏ qua phần causation/correlation — đây là điểm quan trọng cho câu hỏi attitude/inference.",
  ],
  estimated_time_minutes: 9,
  difficulty_band: 8.5,
};

// ── Exports ──────────────────────────────────────────────────────────────────

export const TOEFL_LISTENING_ITEMS: TOEFLListeningItem[] = [
  CONVO_ADVISOR,
  CONVO_LIBRARY,
  CONVO_LAB_PARTNER,
  LECTURE_FERMI,
  LECTURE_MYCORRHIZAL,
  LECTURE_BYSTANDER,
  LECTURE_PRINTING_PRESS,
  LECTURE_PERSPECTIVE,
  LECTURE_MICROBIOME,
];

export function getTOEFLListeningItemById(id: string): TOEFLListeningItem | undefined {
  return TOEFL_LISTENING_ITEMS.find((item) => item.id === id);
}
