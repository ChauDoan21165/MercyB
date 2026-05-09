// src/data/exam-prep/toefl/writing-topics.ts
//
// TOEFL iBT Writing practice content — 8 original Task 1 (Integrated)
// and Task 2 (Academic Discussion) prompts authored for MercyBlade.
//
// Task 1 (Integrated Writing): read a passage, listen to a short lecture,
// then write a response summarising how the lecture challenges or
// supports the reading. 150–225 words recommended, ~20 min.
//
// Task 2 (Writing for an Academic Discussion): read a professor's
// question and two student responses in an online forum, then contribute
// your own viewpoint. ~100 words, ~10 min. This replaced the old
// "Independent Writing" essay in the July 2023 TOEFL revision.
//
// All prompts, sample materials, outlines, tips, and vocabulary are
// original — written for MercyBlade based on the public TOEFL iBT
// test specification. None are reproduced from ETS or any prep book.
//
// Vietnamese-speaker tips target L1-interference patterns: literal
// translation, article drop, plural-s omission, weak hedging, and
// comma-spliced run-on sentences.

export type TOEFLWritingTaskType = "integrated" | "academic_discussion";

export interface TOEFLVocabularyItem {
  word: string;
  translation_vi: string;
  pronunciation_ipa: string;
  level: "B1" | "B2" | "C1";
}

export interface TOEFLIntegratedPrompt {
  /** Short reading passage (200–300 words) the test-taker reads first. */
  reading_passage: string;
  /** Summary of the lecture audio they would hear (since we use static
   *  audio, this is the transcript). Lecture challenges or supports. */
  lecture_transcript: string;
  /** How the lecture relates to the reading. */
  lecture_relationship: "challenges" | "supports";
  /** The writing prompt question. */
  prompt_question: string;
}

export interface TOEFLWritingTopic {
  /** Stable kebab-case ID — used as URL slug. */
  id: string;
  task_type: TOEFLWritingTaskType;
  topic_title_vi: string;
  topic_title_en: string;
  description_vi: string;
  description_en: string;
  /** For Task 2: the professor's question + two student responses. */
  prompt_vi: string;
  prompt_en: string;
  /** For Task 1: integrated reading + lecture transcript. */
  integrated?: TOEFLIntegratedPrompt;
  /** The writing instruction shown to the test-taker. */
  writing_instruction_vi: string;
  writing_instruction_en: string;
  approach_outline_vi: string[];
  vietnamese_speaker_tips: string[];
  key_vocabulary: TOEFLVocabularyItem[];
  recommended_minutes: number;
  min_words: number;
}

// ── Reusable tips ───────────────────────────────────────────────────────────

const TIP_PARAGRAPH =
  "Task 1 yêu cầu cấu trúc 3 đoạn rõ: intro (tóm tắt reading + lecture), body (chỉ ra điểm lecture phản biện), conclusion (ngắn gọn).";
const TIP_POINT_BY_POINT =
  "Trình bày point-by-point: mỗi đoạn body = một điểm reading + lecture phản biện điểm đó. Đừng tách reading hết rồi lecture hết.";
const TIP_NOT_OPINION =
  "Task 1 KHÔNG yêu cầu opinion của bạn. Chỉ tóm tắt lecture và nêu cách nó phản biện reading.";
const TIP_DISCUSSION_FORMAT =
  "Task 2 Academic Discussion: viết NHƯ đang post bài trong forum — giọng tự nhiên, học thuật nhẹ, ~100 từ.";
const TIP_CONTRIBUTE =
  "Task 2 phải ĐÓNG GÓP ý mới — không chỉ đồng ý với một sinh viên. Thêm ý riêng, ví dụ mới, hoặc chất vấn nhẹ.";
const TIP_ARTICLES =
  "Mạo từ a/an/the là điểm trừ thường xuyên cho người Việt. Đếm được số ít → cần a/an. Đã xác định → the.";
const TIP_HEDGING =
  "Tránh khẳng định tuyệt đối. Dùng 'tend to', 'in many cases', 'arguably', 'to a large extent'.";

// ── Topics ──────────────────────────────────────────────────────────────────

export const TOEFL_WRITING_TOPICS: TOEFLWritingTopic[] = [
  // ═══ Task 1 — Integrated Writing ═══
  {
    id: "integrated_four_day_workweek",
    task_type: "integrated",
    topic_title_vi: "Tuần làm việc 4 ngày",
    topic_title_en: "The four-day workweek",
    description_vi:
      "Bài đọc lập luận rằng tuần làm việc 4 ngày tăng năng suất. Bài giảng phản biện bằng dữ liệu thực tế. Viết bài tổng hợp.",
    description_en:
      "The reading argues a 4-day workweek boosts productivity. The lecture challenges this with real-world data. Write a summary.",
    prompt_vi:
      "Tóm tắt các luận điểm trong bài giảng, và giải thích cách chúng phản biện các luận điểm trong bài đọc.",
    prompt_en:
      "Summarize the points made in the lecture, explaining how they challenge the points made in the reading.",
    integrated: {
      reading_passage:
        "A growing number of companies are experimenting with a four-day workweek, in which employees work four eight-hour days instead of five. Proponents argue that this model increases productivity because workers are better rested and more focused during their shorter, more intense work periods. Studies from Iceland and the United Kingdom, conducted between 2015 and 2022, reported that output remained stable or even improved at firms that adopted the four-day schedule. Employees reported higher job satisfaction, lower burnout rates, and fewer sick days. Additionally, companies saved on operational costs such as electricity and office supplies. The four-day model is therefore presented as a win-win: happier workers producing the same or more output at lower cost to the employer.",
      lecture_transcript:
        "While the four-day workweek sounds appealing, the evidence presented in the reading overstates the benefits and overlooks significant practical problems. First, the Iceland and UK studies the reading cites were conducted almost entirely in public-sector offices and small tech firms — environments where work is knowledge-based and output is hard to measure precisely. In manufacturing, retail, healthcare, and education, a four-day week often means hiring additional staff to cover the fifth day, which erases any supposed cost savings. Second, the claim that productivity 'remained stable' ignores what researchers call the 'intensification effect': workers on a four-day schedule simply compressed five days of work into four by skipping breaks, working through lunch, and staying later — a pattern that is unsustainable and leads to higher long-term burnout, not lower. Third, client-facing businesses reported dissatisfaction from customers who could not reach staff on the closed day. Several large law firms and consultancies that tried the model quietly reverted after losing clients who expected five-day availability. In short, the four-day workweek may work for a narrow set of office-based roles, but the reading's claim that it is a universal solution is not supported by the broader data.",
      lecture_relationship: "challenges",
      prompt_question:
        "Summarize the points made in the lecture, explaining how they cast doubt on the specific arguments presented in the reading passage.",
    },
    writing_instruction_vi:
      "Viết bài tóm tắt 150–225 từ. Không nêu ý kiến cá nhân — chỉ tóm tắt cách bài giảng phản biện bài đọc.",
    writing_instruction_en:
      "Write a summary of 150–225 words. Do not give your personal opinion — only summarize how the lecture challenges the reading.",
    approach_outline_vi: [
      "Đoạn 1 (Intro): Tóm tắt luận điểm chính của reading (4-day week tăng productivity) + lecture (phản biện: dữ liệu hẹp, intensification, mất khách).",
      "Đoạn 2 (Body 1): Reading nói studies Iceland/UK ủng hộ → lecture nói studies chỉ trong public-sector và tech nhỏ, không áp dụng cho manufacturing, healthcare, retail.",
      "Đoạn 3 (Body 2): Reading nói productivity ổn định → lecture chỉ ra 'intensification effect' — nhân viên nén 5 ngày vào 4 ngày, không bền vững.",
      "Đoạn 4 (Body 3): Reading nói tiết kiệm chi phí → lecture nói doanh nghiệp phải thuê thêm nhân sự cover ngày thứ 5, mất khách hàng.",
      "Kết luận: Lecture challenges reading bằng cách chỉ ra dữ liệu không đại diện, intensification, và vấn đề khách hàng.",
    ],
    vietnamese_speaker_tips: [
      TIP_PARAGRAPH,
      TIP_POINT_BY_POINT,
      TIP_NOT_OPINION,
      "Đừng dịch 'intensification effect' = 'hiệu ứng tăng cường' — giữ nguyên thuật ngữ và giải thích ngắn.",
      "Cấu trúc paraphrase reading: 'The reading claims X…' / 'According to the passage…'. Lecture: 'The lecturer challenges this by arguing…' / 'The professor points out that…'.",
    ],
    key_vocabulary: [
      { word: "intensification", translation_vi: "sự tăng cường độ", pronunciation_ipa: "/ɪnˌtɛn.sɪ.fɪˈkeɪ.ʃən/", level: "C1" },
      { word: "proponent", translation_vi: "người ủng hộ", pronunciation_ipa: "/prəˈpoʊ.nənt/", level: "B2" },
      { word: "operational cost", translation_vi: "chi phí vận hành", pronunciation_ipa: "/ˌɒp.əˈreɪ.ʃən.əl kɒst/", level: "B2" },
      { word: "client-facing", translation_vi: "tiếp xúc khách hàng", pronunciation_ipa: "/ˈklaɪ.ənt ˈfeɪ.sɪŋ/", level: "C1" },
      { word: "revert", translation_vi: "quay lại (chế độ cũ)", pronunciation_ipa: "/rɪˈvɜːrt/", level: "C1" },
    ],
    recommended_minutes: 20,
    min_words: 150,
  },
  {
    id: "integrated_rewilding_wolves",
    task_type: "integrated",
    topic_title_vi: "Tái hoang dã: thả sói về Yellowstone",
    topic_title_en: "Rewilding: wolves in Yellowstone",
    description_vi:
      "Bài đọc mô tả thành công của việc thả sói về Yellowstone. Bài giảng chỉ ra những hệ quả tiêu cực bị bỏ qua.",
    description_en:
      "The reading describes the success of reintroducing wolves to Yellowstone. The lecture points out overlooked negative consequences.",
    prompt_vi:
      "Tóm tắt các luận điểm trong bài giảng, giải thích cách chúng nghi ngờ các tuyên bố trong bài đọc.",
    prompt_en:
      "Summarize the points made in the lecture, explaining how they cast doubt on the claims in the reading passage.",
    integrated: {
      reading_passage:
        "The reintroduction of grey wolves to Yellowstone National Park in 1995 is widely celebrated as one of the most successful wildlife restoration projects in history. After wolves were eliminated from the park in the 1920s, the elk population grew unchecked, leading to overgrazing of young willow and aspen trees along riverbanks. The return of wolves, the reading notes, triggered a 'trophic cascade': wolves reduced elk numbers, which allowed vegetation to recover, which in turn stabilised riverbanks and created habitat for beavers, songbirds, and fish. This ecological chain reaction is cited in textbooks as evidence that apex predators play an irreplaceable role in maintaining ecosystem health. Furthermore, wolf-watching tourism now generates millions of dollars annually for communities near the park, demonstrating that conservation can have economic as well as ecological benefits.",
      lecture_transcript:
        "The story of Yellowstone's wolves is often told as an unqualified success, but this narrative simplifies a far messier reality. First, the 'trophic cascade' the reading describes — wolves → fewer elk → more trees → healthier rivers — has been challenged by newer research. A 2018 study published in Ecological Monographs found that willow recovery in Yellowstone was driven primarily by changes in water availability and beaver activity, not by elk reduction alone. Some streams showed vegetation recovery even in areas elk still frequented, and some areas with few elk showed no recovery at all. Second, the economic benefits of wolf-watching tourism are real but concentrated in a handful of gateway towns; ranchers in the wider region, however, have suffered verified livestock losses that the reading does not mention. The Wyoming Game and Fish Department recorded an average of sixty confirmed cattle and sheep kills per year attributable to wolves since 2000. Third, the wolf population has now grown beyond the park's carrying capacity, and packs are dispersing into areas where they come into conflict with humans and domestic animals, prompting state-managed culls that undercut the restoration narrative. The Yellowstone wolf project has had real ecological effects, but presenting it as a simple cascade of benefits ignores the complex, contested, and expensive reality on the ground.",
      lecture_relationship: "challenges",
      prompt_question:
        "Summarize the points made in the lecture, explaining how they cast doubt on specific claims in the reading passage.",
    },
    writing_instruction_vi:
      "Viết bài tóm tắt 150–225 từ. Không đưa ý kiến cá nhân.",
    writing_instruction_en:
      "Write a summary of 150–225 words. Do not give your personal opinion.",
    approach_outline_vi: [
      "Đoạn 1 (Intro): Reading — trophic cascade thành công, kinh tế tốt. Lecture — phản biện bằng nghiên cứu mới, thiệt hại chăn nuôi, xung đột.",
      "Đoạn 2: Reading nói trophic cascade rõ ràng → Lecture dẫn study 2018: willow recovery do nước + beaver, không chỉ elk.",
      "Đoạn 3: Reading nói kinh tế tốt → Lecture: lợi ích tập trung vài thị trấn, người chăn nuôi thiệt hại ~60 con/năm.",
      "Đoạn 4: Reading không nhắc hậu quả dài hạn → Lecture: sói vượt sức chứa, phân tán ra ngoài, bị tiêu hủy.",
      "Kết luận: Lecture challenges reading bằng cách chỉ ra nghiên cứu mới, chi phí kinh tế ẩn, và vấn đề quản lý dài hạn.",
    ],
    vietnamese_speaker_tips: [
      TIP_POINT_BY_POINT,
      TIP_NOT_OPINION,
      "Thuật ngữ 'trophic cascade' nên giữ nguyên + giải thích ngắn một lần.",
      "Đừng dịch 'carrying capacity' = 'khả năng chở' — đúng là 'sức chứa sinh thái'.",
    ],
    key_vocabulary: [
      { word: "trophic cascade", translation_vi: "chuỗi phản ứng dinh dưỡng", pronunciation_ipa: "/ˈtrɒf.ɪk kæsˈkeɪd/", level: "C1" },
      { word: "overgrazing", translation_vi: "chăn thả quá mức", pronunciation_ipa: "/ˌoʊ.vɚˈɡreɪ.zɪŋ/", level: "C1" },
      { word: "apex predator", translation_vi: "động vật săn mồi đầu bảng", pronunciation_ipa: "/ˈeɪ.pɛks ˈprɛd.ə.tɚ/", level: "C1" },
      { word: "dispersing", translation_vi: "phân tán", pronunciation_ipa: "/dɪˈspɝː.sɪŋ/", level: "B2" },
      { word: "cull", translation_vi: "tiêu hủy có kiểm soát", pronunciation_ipa: "/kʌl/", level: "C1" },
    ],
    recommended_minutes: 20,
    min_words: 150,
  },
  {
    id: "integrated_remote_work_productivity",
    task_type: "integrated",
    topic_title_vi: "Làm việc từ xa và năng suất",
    topic_title_en: "Remote work and productivity",
    description_vi:
      "Bài đọc cho rằng remote work tăng năng suất. Bài giảng chất vấn bằng nghiên cứu về collaboration và innovation.",
    description_en:
      "The reading claims remote work increases productivity. The lecture questions this with research on collaboration and innovation.",
    prompt_vi:
      "Tóm tắt các điểm chính trong bài giảng và giải thích cách chúng đặt nghi vấn lên các tuyên bố cụ thể trong bài đọc.",
    prompt_en:
      "Summarize the main points in the lecture, explaining how they cast doubt on specific claims in the reading.",
    integrated: {
      reading_passage:
        "Remote work has been widely adopted since 2020, and a growing body of research suggests it improves individual productivity. A 2023 study by Stanford University tracked 16,000 workers across multiple industries and found that fully remote employees completed 13% more tasks per day than their in-office counterparts. The reading attributes this to fewer distractions, no commute time, and the ability to work during one's most productive hours. Remote workers also reported higher job satisfaction and were 35% less likely to quit. From an employer's perspective, remote work allows access to a global talent pool unrestricted by geography, and reduces real-estate costs by eliminating or shrinking office space. The reading concludes that remote work is an irreversible and broadly positive shift in how knowledge work is done.",
      lecture_transcript:
        "The reading's focus on individual task completion misses what has become the central concern of organizational researchers: collaboration and innovation. The Stanford study the reading cites measured tasks like calls handled or lines of code written — metrics that capture individual throughput, not the quality of team output. A separate 2024 analysis from Microsoft Research, using data from 61,000 employees, found that while remote workers completed more individual tasks, cross-team collaboration — measured by shared document edits, multi-author projects, and inter-departmental meetings — dropped by 25% in fully remote settings. This matters because the most economically valuable work in knowledge industries is not individual task completion but the kind of creative, multi-disciplinary problem-solving that happens when people from different teams interact informally. The Microsoft study also found that siloed communication increased: remote workers talked more to their immediate team and far less to anyone outside it, reducing the 'weak ties' that prior research has identified as critical for innovation and career advancement. Junior employees were disproportionately affected, receiving 30% less mentorship and feedback than their in-office peers. The lecturer does not argue that remote work should be abandoned, but that the reading's narrow focus on individual task metrics paints an incomplete picture of productivity that ignores the collaborative and developmental dimensions most important to long-term organizational health.",
      lecture_relationship: "challenges",
      prompt_question:
        "Summarize the points made in the lecture, explaining how they call into question the specific claims made in the reading passage.",
    },
    writing_instruction_vi:
      "Viết bài tóm tắt 150–225 từ. Không đưa ý kiến cá nhân.",
    writing_instruction_en:
      "Write a summary of 150–225 words. Do not give your personal opinion.",
    approach_outline_vi: [
      "Đoạn 1 (Intro): Reading — remote work tăng individual productivity 13%. Lecture — phản biện: bỏ qua collaboration và innovation.",
      "Đoạn 2: Reading dùng Stanford study → Lecture chỉ ra study đó đo individual tasks, không đo team output. Microsoft study cho thấy cross-team collaboration giảm 25%.",
      "Đoạn 3: Reading nói global talent pool, tiết kiệm văn phòng → Lecture: siloed communication tăng, junior employees mất mentorship 30%.",
      "Đoạn 4 (nếu cần): Lecture không phủ nhận remote work, nhưng chỉ ra reading quá hẹp trong cách định nghĩa productivity.",
      "Kết luận: Lecture challenges reading bằng cách cho thấy productivity thực sự bao gồm collaboration + innovation, không chỉ individual tasks.",
    ],
    vietnamese_speaker_tips: [
      TIP_POINT_BY_POINT,
      TIP_NOT_OPINION,
      "Đừng dịch 'weak ties' = 'mối quan hệ yếu' không giải thích — thêm 'mối quan hệ xã giao / không chính thức'.",
      "Cấu trúc tương phản: 'Whereas the reading emphasizes X, the lecture argues that Y is more consequential because…'.",
    ],
    key_vocabulary: [
      { word: "throughput", translation_vi: "sản lượng (công việc)", pronunciation_ipa: "/ˈθruː.pʊt/", level: "C1" },
      { word: "siloed", translation_vi: "biệt lập, khép kín", pronunciation_ipa: "/ˈsaɪ.loʊd/", level: "C1" },
      { word: "weak ties", translation_vi: "mối quan hệ xã giao", pronunciation_ipa: "/wiːk taɪz/", level: "C1" },
      { word: "disproportionately", translation_vi: "một cách không cân xứng", pronunciation_ipa: "/ˌdɪs.prəˈpɔːr.ʃən.ət.li/", level: "C1" },
      { word: "mentorship", translation_vi: "sự hướng dẫn, cố vấn", pronunciation_ipa: "/ˈmɛn.tɔːr.ʃɪp/", level: "B2" },
    ],
    recommended_minutes: 20,
    min_words: 150,
  },

  // ═══ Task 2 — Academic Discussion ═══
  {
    id: "discussion_social_media_democracy",
    task_type: "academic_discussion",
    topic_title_vi: "Mạng xã hội: tốt hay xấu cho dân chủ?",
    topic_title_en: "Social media: good or bad for democracy?",
    description_vi:
      "Giáo sư hỏi liệu mạng xã hội giúp hay hại dân chủ. Hai sinh viên nêu quan điểm trái chiều. Bạn đóng góp ý kiến.",
    description_en:
      "A professor asks whether social media helps or harms democracy. Two students offer opposing views. Contribute your perspective.",
    prompt_vi:
      "Giáo sư Martin: 'Mạng xã hội đã thay đổi cách công dân tham gia chính trị. Một số người cho rằng nó trao quyền cho tiếng nói bên lề; số khác lo ngại về tin giả và phân cực. Theo bạn, mạng xã hội giúp ích hay gây hại cho dân chủ nhiều hơn?'\n\nSinh viên Ana: 'Tôi nghĩ mạng xã hội có hại nhiều hơn. Thuật toán ưu tiên nội dung gây sốc, không phải nội dung chính xác. Người dùng bị nhốt trong bong bóng thông tin.'\n\nSinh viên Ben: 'Tôi không đồng ý. Mạng xã hội đã giúp các phong trào như #MeToo và biểu tình Hong Kong lan tỏa toàn cầu. Không có nó, những tiếng nói đó sẽ bị bỏ qua.'",
    prompt_en:
      "Professor Martin: 'Social media has transformed how citizens engage with politics. Some argue it empowers marginalized voices; others worry about misinformation and polarization. In your view, does social media do more to help or harm democracy?'\n\nStudent Ana: 'I think social media does more harm. Algorithms prioritize shocking content over accurate information. Users get trapped in information bubbles where they only see views they already agree with.'\n\nStudent Ben: 'I disagree. Social media has enabled movements like #MeToo and the Hong Kong protests to reach a global audience. Without it, those voices would have been ignored.'",
    writing_instruction_vi:
      "Viết bài đóng góp ý kiến của bạn (~100 từ). Không chỉ đồng ý/với Ana hoặc Ben — thêm ý riêng.",
    writing_instruction_en:
      "Write a post contributing your own perspective (~100 words). Don't just agree with Ana or Ben — add your own point.",
    approach_outline_vi: [
      "Mở: Thừa nhận cả Ana và Ben đều có điểm đúng.",
      "Ý chính: Đề xuất góc nhìn thứ ba — vấn đề không phải là công nghệ, mà là thiếu giáo dục truyền thông (media literacy).",
      "Kết: Nếu công dân được dạy cách kiểm chứng thông tin, mạng xã hội có thể là công cụ dân chủ mạnh mẽ.",
    ],
    vietnamese_speaker_tips: [
      TIP_CONTRIBUTE,
      "Viết với giọng forum — tự nhiên hơn essay. 'I'd add that…' / 'Building on Ben's point…' / 'One thing neither mentioned is…'.",
      "Độ dài ~100 từ = khoảng 5–7 câu. Đừng viết dài — đây là bài post, không phải essay.",
      TIP_ARTICLES,
    ],
    key_vocabulary: [
      { word: "media literacy", translation_vi: "kỹ năng truyền thông", pronunciation_ipa: "/ˈmiː.di.ə ˈlɪt.ər.ə.si/", level: "C1" },
      { word: "polarization", translation_vi: "sự phân cực", pronunciation_ipa: "/ˌpoʊ.lɚ.əˈzeɪ.ʃən/", level: "C1" },
      { word: "algorithm", translation_vi: "thuật toán", pronunciation_ipa: "/ˈæl.ɡə.rɪð.əm/", level: "B2" },
      { word: "bubble", translation_vi: "bong bóng (thông tin)", pronunciation_ipa: "/ˈbʌb.əl/", level: "B2" },
      { word: "misinformation", translation_vi: "thông tin sai lệch", pronunciation_ipa: "/ˌmɪs.ɪn.fɚˈmeɪ.ʃən/", level: "B2" },
    ],
    recommended_minutes: 10,
    min_words: 100,
  },
  {
    id: "discussion_universal_basic_income",
    task_type: "academic_discussion",
    topic_title_vi: "Thu nhập cơ bản toàn dân (UBI)",
    topic_title_en: "Universal Basic Income (UBI)",
    description_vi:
      "Giáo sư hỏi về UBI. Hai sinh viên tranh luận về chi phí và tác động. Bạn đưa ra quan điểm riêng.",
    description_en:
      "A professor asks about UBI. Two students debate cost and impact. Contribute your own perspective.",
    prompt_vi:
      "Giáo sư Chen: 'Khi AI thay thế nhiều việc làm, một số quốc gia đang thí điểm thu nhập cơ bản toàn dân (UBI). Liệu UBI là giải pháp khả thi cho thất nghiệp công nghệ, hay nó quá đắt và tạo ra tâm lý ỷ lại?'\n\nSinh viên Diego: 'Tôi ủng hộ UBI. Các thí điểm ở Phần Lan và Kenya cho thấy người nhận UBI không lười đi — họ dùng thời gian để học kỹ năng mới hoặc khởi nghiệp nhỏ.'\n\nSinh viên Emma: 'Tôi lo về chi phí. UBI cho toàn dân ở một nước lớn như Mỹ sẽ tốn hàng nghìn tỷ đô la mỗi năm. Tiền đó lấy từ đâu — tăng thuế? Cắt giảm phúc lợi khác?'",
    prompt_en:
      "Professor Chen: 'As AI displaces more jobs, some countries are piloting Universal Basic Income. Is UBI a viable solution to technological unemployment, or is it too expensive and creates dependency?'\n\nStudent Diego: 'I support UBI. Pilots in Finland and Kenya show recipients didn't become lazy — they used the time to learn new skills or start small businesses.'\n\nStudent Emma: 'I worry about cost. UBI for everyone in a large country like the US would cost trillions annually. Where does that money come from — higher taxes? Cutting other welfare?'",
    writing_instruction_vi:
      "Viết bài đóng góp ý kiến (~100 từ). Thêm góc nhìn riêng, không chỉ đồng ý với Diego hoặc Emma.",
    writing_instruction_en:
      "Write a post with your own perspective (~100 words). Add your own angle, not just agree with Diego or Emma.",
    approach_outline_vi: [
      "Mở: Ghi nhận điểm của cả Diego (evidence từ pilots) và Emma (cost concern).",
      "Ý chính: Đề xuất UBI có điều kiện hoặc UBI theo ngành (targeted UBI) thay vì toàn dân — thí điểm cho người lao động trong ngành rủi ro cao trước.",
      "Kết: Targeted approach vừa kiểm soát được chi phí vừa thu thập dữ liệu thực tế trước khi mở rộng.",
    ],
    vietnamese_speaker_tips: [
      TIP_CONTRIBUTE,
      "Đưa ra quan điểm 'trung gian' (targeted UBI) là chiến lược tốt — cho thấy critical thinking mà không bị cực đoan.",
      "Dùng 'pilot', 'phase in', 'means-test' cho vocabulary band cao.",
      "Tránh dùng 'I think' quá nhiều — 1 lần là đủ trong bài ~100 từ.",
    ],
    key_vocabulary: [
      { word: "pilot", translation_vi: "thí điểm", pronunciation_ipa: "/ˈpaɪ.lət/", level: "B2" },
      { word: "dependency", translation_vi: "tâm lý ỷ lại", pronunciation_ipa: "/dɪˈpɛn.dən.si/", level: "C1" },
      { word: "phase in", translation_vi: "triển khai từng bước", pronunciation_ipa: "/feɪz ɪn/", level: "C1" },
      { word: "means-test", translation_vi: "kiểm tra điều kiện thu nhập", pronunciation_ipa: "/miːnz tɛst/", level: "C1" },
      { word: "technological unemployment", translation_vi: "thất nghiệp do công nghệ", pronunciation_ipa: "/ˌtɛk.nəˈlɒdʒ.ɪ.kəl ˌʌn.ɪmˈplɔɪ.mənt/", level: "C1" },
    ],
    recommended_minutes: 10,
    min_words: 100,
  },
  {
    id: "discussion_space_exploration_priority",
    task_type: "academic_discussion",
    topic_title_vi: "Khám phá vũ trụ: ưu tiên đúng?",
    topic_title_en: "Space exploration: the right priority?",
    description_vi:
      "Giáo sư hỏi liệu tiền khám phá vũ trụ có nên chuyển sang giải quyết vấn đề Trái Đất. Hai sinh viên tranh luận.",
    description_en:
      "A professor asks whether space exploration funding should shift to solving Earth's problems. Two students debate.",
    prompt_vi:
      "Giáo sư Williams: 'Các chính phủ chi hàng tỷ đô la cho khám phá vũ trụ. Số tiền này có nên dùng để giải quyết các vấn đề trên Trái Đất như đói nghèo, bệnh tật, và biến đổi khí hậu thay vì tìm kiếm sự sống ngoài hành tinh?'\n\nSinh viên Mei: 'Tôi nghĩ khám phá vũ trụ rất quan trọng. Công nghệ từ NASA đã tạo ra hàng ngàn sản phẩm hữu ích — từ máy lọc nước đến vật liệu cách nhiệt. Hơn nữa, nhân loại cần một 'kế hoạch B' nếu Trái Đất không còn ở được.'\n\nSinh viên Omar: 'Tôi phản đối. Hàng tỷ người đang thiếu nước sạch và thực phẩm NGAY BÂY GIỜ. Thật vô lý khi chi tiền tìm nước trên Sao Hỏa trong khi trẻ em chết vì bệnh có thể phòng ngừa.'",
    prompt_en:
      "Professor Williams: 'Governments spend billions on space exploration. Should this money be redirected to solving problems on Earth like poverty, disease, and climate change instead of searching for extraterrestrial life?'\n\nStudent Mei: 'I think space exploration is important. NASA technology has produced thousands of useful products — from water filters to insulation materials. Plus, humanity needs a Plan B if Earth becomes uninhabitable.'\n\nStudent Omar: 'I disagree. Billions of people lack clean water and food right now. It seems absurd to spend money looking for water on Mars while children die from preventable diseases.'",
    writing_instruction_vi:
      "Viết bài đóng góp (~100 từ). Đưa ra quan điểm cân bằng hoặc góc nhìn thứ ba.",
    writing_instruction_en:
      "Write a post (~100 words). Offer a balanced view or a third perspective.",
    approach_outline_vi: [
      "Mở: Cả Mei và Omar đều có lý — đây không phải là lựa chọn nhị phân.",
      "Ý chính: Đề xuất 'spin-off model' — đầu tư vào công nghệ vũ trụ nhưng bắt buộc các phát minh phải được chuyển giao miễn phí cho các ứng dụng dân sự (y tế, nước sạch, năng lượng).",
      "Kết: Cách này vừa giữ được khám phá khoa học vừa tạo ra lợi ích trực tiếp cho người dân Trái Đất.",
    ],
    vietnamese_speaker_tips: [
      TIP_CONTRIBUTE,
      "Ý tưởng 'spin-off technology' là hướng critical thinking tốt cho bài này.",
      "Dùng 'either/or fallacy' để chỉ ra sai lầm logic khi coi đây là lựa chọn nhị phân.",
      TIP_HEDGING,
    ],
    key_vocabulary: [
      { word: "spin-off technology", translation_vi: "công nghệ phái sinh", pronunciation_ipa: "/spɪn ɒf tɛkˈnɒl.ə.dʒi/", level: "C1" },
      { word: "extraterrestrial", translation_vi: "ngoài Trái Đất", pronunciation_ipa: "/ˌɛk.strə.təˈrɛs.tri.əl/", level: "C1" },
      { word: "uninhabitable", translation_vi: "không thể ở được", pronunciation_ipa: "/ˌʌn.ɪnˈhæb.ɪ.tə.bəl/", level: "C1" },
      { word: "binary choice", translation_vi: "lựa chọn nhị phân", pronunciation_ipa: "/ˈbaɪ.nər.i tʃɔɪs/", level: "C1" },
      { word: "preventable", translation_vi: "có thể phòng ngừa", pronunciation_ipa: "/prɪˈvɛn.tə.bəl/", level: "B2" },
    ],
    recommended_minutes: 10,
    min_words: 100,
  },
  {
    id: "discussion_college_degree_value",
    task_type: "academic_discussion",
    topic_title_vi: "Bằng đại học còn giá trị?",
    topic_title_en: "Is a college degree still worth it?",
    description_vi:
      "Với chi phí đại học tăng cao và sự trỗi dậy của bootcamp, bằng đại học còn cần thiết?",
    description_en:
      "With rising college costs and the rise of bootcamps, is a college degree still necessary?",
    prompt_vi:
      "Giáo sư Thompson: 'Học phí đại học đã tăng gấp ba lần trong 30 năm qua. Nhiều công ty công nghệ giờ tuyển dụng không yêu cầu bằng cấp. Liệu bằng đại học 4 năm còn là khoản đầu tư xứng đáng?'\n\nSinh viên Lucas: 'Tôi nghĩ bằng đại học vẫn rất giá trị. Dữ liệu cho thấy người có bằng cử nhân kiếm trung bình nhiều hơn 1 triệu đô la trong suốt sự nghiệp. Và nhiều ngành — y tế, luật, kỹ thuật — vẫn bắt buộc phải có bằng.'\n\nSinh viên Priya: 'Tôi không đồng ý. Tôi biết nhiều lập trình viên thành công chỉ với bootcamp 12 tuần. Chi phí đại học ở Mỹ quá cao — sinh viên tốt nghiệp với khoản nợ khổng lồ mà không đảm bảo có việc.'",
    prompt_en:
      "Professor Thompson: 'College tuition has tripled in 30 years. Many tech companies now hire without requiring a degree. Is a four-year college degree still a worthwhile investment?'\n\nStudent Lucas: 'I think a degree is still very valuable. Data shows bachelor's degree holders earn about a million dollars more over a career on average. And many fields — medicine, law, engineering — still require a degree.'\n\nStudent Priya: 'I disagree. I know many successful programmers who did just a 12-week bootcamp. College in the US is too expensive — graduates leave with massive debt and no job guarantee.'",
    writing_instruction_vi:
      "Viết bài đóng góp (~100 từ). Đưa ra góc nhìn cân bằng hoặc ý mới.",
    writing_instruction_en:
      "Write a post (~100 words). Offer a balanced view or a new angle.",
    approach_outline_vi: [
      "Mở: Thừa nhận cả Lucas (ROI dài hạn) và Priya (nợ + bootcamp) đều có điểm đúng.",
      "Ý chính: Đề xuất mô hình 'hybrid' — 2 năm đại học cơ bản + 2 năm học nghề/apprenticeship có trả lương. Mô hình này đang phát triển ở Đức và Thụy Sĩ.",
      "Kết: Tương lai không phải là 'có bằng hay không', mà là 'kết hợp giáo dục truyền thống và đào tạo thực hành thế nào cho hiệu quả nhất'.",
    ],
    vietnamese_speaker_tips: [
      TIP_CONTRIBUTE,
      "Đưa ra mô hình cụ thể (apprenticeship model) là cách thể hiện kiến thức thực tế — tăng điểm.",
      "Dùng 'earning premium' thay cho 'earn more money' để tăng lexical resource.",
      "Tránh 'nowadays' đứng đầu câu một mình — nên 'In recent years' hoặc 'Over the past decade'.",
    ],
    key_vocabulary: [
      { word: "apprenticeship", translation_vi: "học nghề (có trả lương)", pronunciation_ipa: "/əˈprɛn.tɪs.ʃɪp/", level: "C1" },
      { word: "earning premium", translation_vi: "mức lương chênh lệch", pronunciation_ipa: "/ˈɝː.nɪŋ ˈpriː.mi.əm/", level: "C1" },
      { word: "bootcamp", translation_vi: "khóa đào tạo cấp tốc", pronunciation_ipa: "/ˈbuːt.kæmp/", level: "B2" },
      { word: "return on investment", translation_vi: "lợi tức đầu tư", pronunciation_ipa: "/rɪˈtɝːn ɒn ɪnˈvɛst.mənt/", level: "B2" },
      { word: "hybrid model", translation_vi: "mô hình kết hợp", pronunciation_ipa: "/ˈhaɪ.brɪd ˈmɒd.əl/", level: "B2" },
    ],
    recommended_minutes: 10,
    min_words: 100,
  },
  {
    id: "discussion_genetically_modified_foods",
    task_type: "academic_discussion",
    topic_title_vi: "Thực phẩm biến đổi gen (GMO)",
    topic_title_en: "Genetically modified foods (GMOs)",
    description_vi:
      "GMO có thể giải quyết nạn đói toàn cầu — nhưng có an toàn không? Hai sinh viên tranh luận.",
    description_en:
      "GMOs could solve global hunger — but are they safe? Two students debate.",
    prompt_vi:
      "Giáo sư Nakamura: 'Với dân số toàn cầu dự kiến đạt 10 tỷ vào năm 2050, thực phẩm biến đổi gen (GMO) được quảng bá là giải pháp cho an ninh lương thực. Nhưng nhiều người tiêu dùng lo ngại về rủi ro sức khỏe và môi trường. GMO có phải là con đường đúng đắn?'\n\nSinh viên Fatima: 'Tôi ủng hộ GMO. Cây trồng biến đổi gen có thể chịu hạn, kháng sâu bệnh, và cho năng suất cao hơn. Hàng trăm nghiên cứu đã kết luận GMO an toàn không kém thực phẩm thông thường.'\n\nSinh viên Kenji: 'Tôi lo ngại. Vấn đề không chỉ là an toàn thực phẩm — mà là quyền lực tập trung vào tay vài tập đoàn hạt giống như Monsanto. Nông dân nhỏ bị phụ thuộc vào hạt giống có bản quyền.'",
    prompt_en:
      "Professor Nakamura: 'With the global population projected to reach 10 billion by 2050, GMOs are promoted as a solution to food security. But many consumers worry about health and environmental risks. Are GMOs the right path forward?'\n\nStudent Fatima: 'I support GMOs. Genetically modified crops can withstand drought, resist pests, and produce higher yields. Hundreds of studies have concluded GMOs are as safe as conventional food.'\n\nStudent Kenji: 'I'm concerned. The issue isn't just food safety — it's corporate concentration. A few seed companies like Monsanto control most of the market. Small farmers become dependent on patented seeds.'",
    writing_instruction_vi:
      "Viết bài đóng góp (~100 từ). Đưa ra góc nhìn riêng biệt, không chỉ lặp lại Fatima hoặc Kenji.",
    writing_instruction_en:
      "Write a post (~100 words). Offer a distinct perspective, not just repeat Fatima or Kenji.",
    approach_outline_vi: [
      "Mở: Cả Fatima (khoa học ủng hộ an toàn) và Kenji (tập trung quyền lực) đều có luận điểm mạnh.",
      "Ý chính: Đề xuất 'open-source GMO' — nghiên cứu GMO do đại học công thực hiện, không cấp bằng sáng chế, như dự án Golden Rice. Kết hợp quy định chống độc quyền.",
      "Kết: Vấn đề không phải là công nghệ GMO, mà là ai sở hữu và kiểm soát nó.",
    ],
    vietnamese_speaker_tips: [
      TIP_CONTRIBUTE,
      "Góc nhìn 'open-source GMO' thể hiện critical thinking rất tốt — examiner đánh giá cao.",
      "Dùng 'intellectual property', 'patent', 'antitrust' cho lexical resource band C1.",
      "Đừng viết 'GMO food' — 'GMO' đã bao gồm food. Viết 'GM crops' hoặc 'GM foods'.",
    ],
    key_vocabulary: [
      { word: "food security", translation_vi: "an ninh lương thực", pronunciation_ipa: "/fuːd sɪˈkjʊr.ə.t̬i/", level: "B2" },
      { word: "patent", translation_vi: "bằng sáng chế", pronunciation_ipa: "/ˈpæt.ənt/", level: "C1" },
      { word: "open-source", translation_vi: "mã nguồn mở (không độc quyền)", pronunciation_ipa: "/ˈoʊ.pən sɔːrs/", level: "C1" },
      { word: "corporate concentration", translation_vi: "tập trung quyền lực doanh nghiệp", pronunciation_ipa: "/ˈkɔːr.pər.ət ˌkɒn.sənˈtreɪ.ʃən/", level: "C1" },
      { word: "conventional", translation_vi: "thông thường, truyền thống", pronunciation_ipa: "/kənˈvɛn.ʃən.əl/", level: "B2" },
    ],
    recommended_minutes: 10,
    min_words: 100,
  },
];

export function findTOEFLWritingTopicById(
  id: string,
): TOEFLWritingTopic | undefined {
  return TOEFL_WRITING_TOPICS.find((t) => t.id === id);
}
