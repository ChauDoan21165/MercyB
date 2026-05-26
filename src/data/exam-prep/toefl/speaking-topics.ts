// src/data/exam-prep/toefl/speaking-topics.ts
//
// TOEFL iBT Speaking practice content — 8 original topics across all
// 4 task types, authored for MercyBlade.
//
// Task format (post-July 2023 TOEFL iBT Enhanced):
//   Task 1: Independent Speaking — personal opinion, 15s prep / 45s speak
//   Task 2: Integrated (campus) — read announcement + listen to conversation, 
//            then summarise student's opinion, 30s prep / 60s speak
//   Task 3: Integrated (academic) — read passage + listen to lecture excerpt,
//            then explain concept using examples, 30s prep / 60s speak
//   Task 4: Integrated (academic lecture only) — listen to lecture excerpt,
//            then summarise key points, 20s prep / 60s speak
//
// All prompts, sample answers, tips, and vocabulary are original — written
// for MercyBlade based on the public TOEFL iBT test specification. None
// are reproduced from ETS or any prep book.
//
// Vietnamese-speaker tips target: pronunciation of final consonants,
// word stress in multi-syllable academic words, article placement,
// and the tendency to speak in translated-Vietnamese word order.

export type TOEFLSpeakingTaskType = "independent" | "integrated_campus" | "integrated_academic" | "integrated_lecture";

export interface TOEFLSpeakingVocabularyItem {
  word: string;
  translation_vi: string;
  pronunciation_ipa: string;
  level: "B1" | "B2" | "C1";
}

export interface TOEFLSpeakingTopic {
  id: string;
  task_number: 1 | 2 | 3 | 4;
  task_type: TOEFLSpeakingTaskType;
  topic_title_vi: string;
  topic_title_en: string;
  description_vi: string;
  description_en: string;
  /** The prompt the test-taker sees. For integrated tasks, this includes
   *  the reading passage + question. The "listening" content is described
   *  as a transcript since we use static audio. */
  prompt_vi: string;
  prompt_en: string;
  /** Reading passage for Tasks 2 & 3. Undefined for Tasks 1 & 4. */
  reading_passage?: string;
  /** Audio transcript for integrated tasks. */
  listening_transcript?: string;
  preparation_seconds: number;
  speaking_seconds: number;
  /** A band-7 sample response (English only — for reference). */
  sample_response_en: string;
  /** A band-5 sample response with common Vietnamese-speaker errors annotated. */
  sample_response_band5_en: string;
  /** Annotations on the band-5 sample pointing out specific errors. */
  band5_error_notes_vi: string[];
  vietnamese_speaker_tips: string[];
  key_vocabulary: TOEFLSpeakingVocabularyItem[];
}

// ── Reusable tips ───────────────────────────────────────────────────────────

const TIP_FINAL_CONSONANTS =
  "Người Việt thường nuốt âm cuối: 'right' nghe thành 'rye', 'task' thành 'tass'. Tập phát âm rõ -t, -d, -k, -s ở cuối từ.";
const TIP_WORD_STRESS =
  "Trọng âm từ tiếng Anh quan trọng hơn bạn nghĩ. 'PRE-sent' (n) khác 'pre-SENT' (v). Sai trọng âm = examiner nghe không ra từ.";
const TIP_TEMPLATE =
  "Luôn có template cho mỗi task. Task 1: 'In my opinion… for two reasons. First… Second…'. Khung sẵn giúp bạn không bị khựng.";
const TIP_TRANSITIONS =
  "Dùng từ chuyển tiếp rõ ràng: 'The first reason is…', 'In addition…', 'For example…'. Examiner dùng transcript để chấm — từ chuyển tiếp giúp họ theo dõi.";
const TIP_SUMMARIZE =
  "Tasks 2–4 yêu cầu TÓM TẮT, không phải ý kiến cá nhân. Chỉ report lại những gì speaker nói.";
const TIP_TIME_MANAGEMENT =
  "Task 1 (45s): 5s intro + 18s reason 1 + 18s reason 2 + 4s conclusion. Dùng đồng hồ đếm ngược để luyện.";

// ── Topics ──────────────────────────────────────────────────────────────────

export const TOEFL_SPEAKING_TOPICS: TOEFLSpeakingTopic[] = [
  // ═══ Task 1 — Independent Speaking ═══
  {
    id: "speaking_task1_online_learning",
    task_number: 1,
    task_type: "independent",
    topic_title_vi: "Học trực tuyến hay học trên lớp?",
    topic_title_en: "Online learning vs. in-person classes?",
    description_vi:
      "Bạn thích học trực tuyến hay học trên lớp truyền thống hơn? Giải thích lý do với ví dụ cụ thể.",
    description_en:
      "Do you prefer online learning or traditional in-person classes? Explain with specific examples.",
    prompt_vi:
      "Một số sinh viên thích học trực tuyến vì linh hoạt. Số khác thích lớp học truyền thống vì tương tác trực tiếp. Bạn thích hình thức nào hơn? Giải thích lý do với ví dụ cụ thể.",
    prompt_en:
      "Some students prefer online learning because it is flexible. Others prefer traditional in-person classes because of direct interaction. Which do you prefer? Explain with specific examples.",
    preparation_seconds: 15,
    speaking_seconds: 45,
    sample_response_en:
      "I prefer in-person classes for two main reasons. First, I learn better when I can interact with the professor directly. In my chemistry class last semester, I often stayed after lectures to ask questions about experiments I didn't understand — that's something you can't easily do in a Zoom call. Second, in-person classes help me stay focused. When I tried online learning during the pandemic, I constantly got distracted by my phone and social media notifications. I ended up rewatching lectures at double speed just before exams, which wasn't effective. For these reasons, I believe traditional classrooms work better for me.",
    sample_response_band5_en:
      "I prefer online class. Because it's more flexible. I can study at home, don't need go to school. Save time and money. Also I can watch lecture again if I don't understand. In traditional class, sometime teacher speak too fast and I miss information. But online I can pause. So online is better for me.",
    band5_error_notes_vi: [
      "'Online class' thiếu mạo từ — nên là 'online classes' hoặc 'online learning'.",
      "'don't need go' sai ngữ pháp — đúng: 'I don't need to go' hoặc 'I don't have to go'.",
      "'sometime teacher speak' — thiếu 's' (sometimes) và chia động từ (speaks).",
      "'save time and money' là câu không chủ ngữ — cần 'It saves time and money'.",
      "'I can pause' đúng nhưng quá ngắn — nên thêm 'I can pause the video and take notes'.",
    ],
    vietnamese_speaker_tips: [
      TIP_TEMPLATE,
      TIP_FINAL_CONSONANTS,
      "'Flexible' trọng âm rơi vào âm đầu: FLEC-sible, không phải flec-SI-ble.",
      "Đừng dịch 'tiết kiệm thời gian' thành 'save time' rồi dừng — thêm ví dụ: 'It saves me about two hours of commuting every day'.",
    ],
    key_vocabulary: [
      { word: "interaction", translation_vi: "sự tương tác", pronunciation_ipa: "/ˌɪn.təˈræk.ʃən/", level: "B2" },
      { word: "distracted", translation_vi: "bị phân tâm", pronunciation_ipa: "/dɪˈstræk.tɪd/", level: "B2" },
      { word: "commute", translation_vi: "đi lại (hàng ngày)", pronunciation_ipa: "/kəˈmjuːt/", level: "B2" },
      { word: "pause", translation_vi: "tạm dừng", pronunciation_ipa: "/pɔːz/", level: "B1" },
    ],
  },
  {
    id: "speaking_task1_social_media_age",
    task_number: 1,
    task_type: "independent",
    topic_title_vi: "Độ tuổi tối thiểu dùng mạng xã hội",
    topic_title_en: "Minimum age for social media",
    description_vi:
      "Có nên quy định độ tuổi tối thiểu (ví dụ 16) để dùng mạng xã hội? Nêu ý kiến và ví dụ.",
    description_en:
      "Should there be a minimum age (e.g. 16) to use social media? Give your opinion and examples.",
    prompt_vi:
      "Một số quốc gia đang xem xét luật cấm trẻ dưới 16 tuổi dùng mạng xã hội. Bạn đồng ý hay phản đối? Giải thích lý do.",
    prompt_en:
      "Some countries are considering laws to ban children under 16 from using social media. Do you agree or disagree? Explain your reasons.",
    preparation_seconds: 15,
    speaking_seconds: 45,
    sample_response_en:
      "I agree that there should be a minimum age of sixteen for social media, for two reasons. First, social media platforms use algorithms designed to keep users scrolling as long as possible, and younger teenagers simply don't have the self-regulation to resist this. My younger cousin, who is thirteen, spends over five hours a day on TikTok, and her grades have noticeably dropped. Second, social media exposes young users to harmful content and cyberbullying before they have the emotional maturity to handle it. At sixteen, most teenagers have developed better critical thinking skills and are more capable of distinguishing between real and manipulated content. While some argue that social media helps young people stay connected with friends, I believe the risks to mental health outweigh that benefit.",
    sample_response_band5_en:
      "I agree children under sixteen should not use social media. Because it's very dangerous. Many bad people on internet can contact them. Also social media make children addicted. They cannot stop scrolling even when they need study. For example my little brother, he play game all day and not do homework. So I think sixteen is good age.",
    band5_error_notes_vi: [
      "'Many bad people on internet' — thiếu mạo từ 'the' (on the internet).",
      "'social media make' — chủ ngữ số ít cần 'makes'.",
      "'he play game' — sai chia động từ: 'he plays games'.",
      "'not do homework' — thiếu trợ động từ: 'doesn't do his homework'.",
      "Dùng 'addicted' không có giải thích — nên thêm 'because the algorithm shows them content endlessly'.",
    ],
    vietnamese_speaker_tips: [
      TIP_TEMPLATE,
      TIP_WORD_STRESS,
      "'Algorithm' trọng âm vào âm đầu: AL-go-rithm.",
      "'Addicted' phát âm là /əˈdɪk.tɪd/ — âm 'a' đầu là schwa, không phải 'a' như trong 'apple'.",
      "Đừng dịch 'nội dung độc hại' = 'poison content' — đúng: 'harmful content' hoặc 'inappropriate content'.",
    ],
    key_vocabulary: [
      { word: "self-regulation", translation_vi: "khả năng tự kiểm soát", pronunciation_ipa: "/ˌsɛlf ˌrɛɡ.jəˈleɪ.ʃən/", level: "C1" },
      { word: "cyberbullying", translation_vi: "bắt nạt qua mạng", pronunciation_ipa: "/ˈsaɪ.bɚ ˌbʊl.i.ɪŋ/", level: "B2" },
      { word: "critical thinking", translation_vi: "tư duy phản biện", pronunciation_ipa: "/ˈkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/", level: "B2" },
      { word: "manipulated", translation_vi: "bị thao túng, chỉnh sửa", pronunciation_ipa: "/məˈnɪp.jə.leɪ.tɪd/", level: "C1" },
    ],
  },

  // ═══ Task 2 — Integrated: Campus Situation ═══
  {
    id: "speaking_task2_parking_fee_increase",
    task_number: 2,
    task_type: "integrated_campus",
    topic_title_vi: "Tăng phí đỗ xe trong campus",
    topic_title_en: "Campus parking fee increase",
    description_vi:
      "Đọc thông báo trường về tăng phí đỗ xe. Nghe sinh viên phản đối. Tóm tắt ý kiến sinh viên.",
    description_en:
      "Read a university announcement about a parking fee increase. Hear a student opposing it. Summarize the student's opinion.",
    prompt_vi:
      "Trường đại học thông báo tăng phí đỗ xe để tài trợ tuyến xe buýt mới. Sinh viên trong đoạn ghi âm phản đối kế hoạch này. Hãy tóm tắt ý kiến của sinh viên và giải thích lý do cô ấy phản đối.",
    prompt_en:
      "The university announced a parking fee increase to fund a new shuttle bus route. The student in the recording opposes this plan. Summarize the student's opinion and explain her reasons.",
    reading_passage:
      "Announcement from the Campus Transportation Office: Beginning next semester, the daily parking fee for the main campus lot will increase from $3 to $6. The additional revenue will fund a new free shuttle bus route connecting the main campus with the West Campus apartments, where many students live. The shuttle will run every 15 minutes during peak hours. The university believes this change will reduce traffic congestion on campus while providing a convenient transportation option for students who cannot afford parking.",
    listening_transcript:
      "STUDENT: I read that announcement about the parking fee and honestly, I think it's a terrible idea. First of all, doubling the fee is just too much. I commute from off-campus because I can't afford to live in the apartments near the school, and now they want me to pay twice as much just to park my car? That's not fair to students who don't have another option. Second, the whole argument about reducing traffic doesn't make sense. The new shuttle only serves West Campus apartments — but most commuters, like me, live much further away in different parts of the city. A shuttle that goes between campus and West Campus isn't going to help me at all. I'll still have to drive. So basically, I'm paying more for no benefit. And the shuttle is 'free' only if you ignore the fact that commuters are the ones funding it through higher parking fees. It feels like I'm being charged extra to subsidise a service I can't even use.",
    preparation_seconds: 30,
    speaking_seconds: 60,
    sample_response_en:
      "The student disagrees with the university's plan to double the parking fee, and she gives two reasons. First, she says the fee increase is unfair because it will cost her twice as much to park, and as an off-campus commuter who can't afford campus housing, she has no other transportation option. The higher fee just makes her life more expensive without giving her any alternative. Second, she argues that the new shuttle bus won't reduce traffic as the university claims, because the shuttle only connects the main campus to West Campus apartments. Most commuters, including her, live in completely different parts of the city, so they won't use the shuttle at all. They will still drive and now pay double for parking. Essentially, she feels she's being forced to subsidize a shuttle service that doesn't benefit her.",
    sample_response_band5_en:
      "The student don't like the parking plan. She say it's too expensive because she cannot pay. She live far away so she must drive every day. The university say shuttle bus reduce traffic, but she say it's not true because shuttle only go to West Campus but she live different area. So she still drive and pay more money. She think it's not fair.",
    band5_error_notes_vi: [
      "'The student don't like' — chủ ngữ số ít cần 'doesn't'.",
      "'She say' — thiếu 's': 'she says'.",
      "'she cannot pay' — nên cụ thể hơn: 'she can't afford the increased fee'.",
      "'she live far' — thiếu 's': 'she lives'.",
      "Toàn bộ câu trả lời dùng hiện tại đơn — nên thêm một vài câu có 'would', 'could' để tăng grammatical range.",
    ],
    vietnamese_speaker_tips: [
      TIP_SUMMARIZE,
      "Task 2 cần nêu rõ: (1) sinh viên đồng ý hay phản đối, (2) 2 lý do chính, (3) paraphrase reading, không lặp nguyên văn.",
      "Đừng đọc lại nguyên văn từ reading passage — paraphrase bằng từ của bạn.",
      "'Commuter' trọng âm vào âm thứ hai: com-MU-ter.",
      "Đừng nêu ý kiến cá nhân — chỉ report ý kiến của speaker.",
    ],
    key_vocabulary: [
      { word: "subsidise", translation_vi: "trợ cấp, bao cấp", pronunciation_ipa: "/ˈsʌb.sə.daɪz/", level: "C1" },
      { word: "commuter", translation_vi: "người đi làm/xa hàng ngày", pronunciation_ipa: "/kəˈmjuː.tər/", level: "B2" },
      { word: "congestion", translation_vi: "sự tắc nghẽn", pronunciation_ipa: "/kənˈdʒɛs.tʃən/", level: "B2" },
      { word: "revenue", translation_vi: "doanh thu, nguồn thu", pronunciation_ipa: "/ˈrɛv.ən.juː/", level: "B2" },
    ],
  },
  {
    id: "speaking_task2_dining_hall_hours",
    task_number: 2,
    task_type: "integrated_campus",
    topic_title_vi: "Rút ngắn giờ mở cửa nhà ăn",
    topic_title_en: "Shortened dining hall hours",
    description_vi:
      "Đọc thông báo trường về việc rút ngắn giờ nhà ăn. Nghe sinh viên phản đối. Tóm tắt ý kiến.",
    description_en:
      "Read a university announcement about shortened dining hall hours. Hear a student opposing it. Summarize the opinion.",
    prompt_vi:
      "Trường thông báo nhà ăn sẽ đóng cửa lúc 7 giờ tối thay vì 9 giờ để tiết kiệm chi phí. Sinh viên trong băng ghi âm không đồng ý. Tóm tắt ý kiến của anh ấy.",
    prompt_en:
      "The university announced the dining hall will close at 7 PM instead of 9 PM to save costs. The student in the recording disagrees. Summarize his opinion.",
    reading_passage:
      "Notice from Dining Services: Effective March 1st, the main dining hall will close at 7:00 PM instead of the current 9:00 PM. This change is estimated to save the university $120,000 annually in staffing and utility costs. Students who have evening classes or activities can use the vending machines in the student center, which will be restocked with additional meal options.",
    listening_transcript:
      "STUDENT: I really disagree with this new closing time. Seven o'clock is way too early. I have a chemistry lab every Tuesday and Thursday that doesn't finish until six-thirty, and by the time I get to the dining hall, it's almost seven. If they close at seven, I'll have maybe five minutes to eat — or more likely, I'll miss dinner completely. And the university's suggestion to use vending machines is honestly insulting. A bag of chips and a soda is not a replacement for a proper meal. Also, I'm not the only one — half the students on my floor have evening labs, club meetings, or sports practice that run past seven. The university is basically telling us that if we participate in campus activities, we can't have dinner. That seems unfair, especially considering how much we pay for meal plans.",
    preparation_seconds: 30,
    speaking_seconds: 60,
    sample_response_en:
      "The student strongly disagrees with the plan to close the dining hall at seven PM, and he provides two main objections. First, the new closing time directly conflicts with his schedule — he has a chemistry lab that ends at six-thirty on Tuesdays and Thursdays, which leaves him almost no time to eat before the dining hall closes. He feels he would regularly miss dinner under this new policy. Second, he argues that the proposed alternative — vending machines — is completely inadequate because packaged snacks cannot replace a proper hot meal. He also points out that many other students have evening commitments like labs, clubs, and sports practice, meaning a large portion of the student body would be affected. He concludes that it's unfair to charge students for meal plans while making it impossible for them to actually use the dining hall.",
    sample_response_band5_en:
      "The student is angry about close at seven. He has lab until six thirty so he cannot eat. The university say vending machine but he say it's not real food. Many student have activity at night so they also cannot eat. He think it's unfair because he pay meal plan.",
    band5_error_notes_vi: [
      "'close at seven' — thiếu chủ ngữ và mạo từ: 'the dining hall closing at seven'.",
      "'Many student have activity' — cần 'students' (số nhiều) và 'activities'.",
      "Dùng từ 'angry' không phù hợp register học thuật — nên dùng 'frustrated' hoặc 'disagrees'.",
      "'real food' quá informal — nên dùng 'proper meal' hoặc 'nutritious meal'.",
      "Toàn bộ present simple — thiếu modal verbs (would, could) và câu phức.",
    ],
    vietnamese_speaker_tips: [
      TIP_SUMMARIZE,
      TIP_TRANSITIONS,
      "Paraphrase: 'close at 7 PM' → 'the new seven o'clock closing time' / 'the reduced hours'.",
      "'Meal plan' là cụm từ đặc thù ở đại học Mỹ — tiền trả trước cho các bữa ăn trong kỳ.",
      "Đừng nói 'student is angry' trong bài thi — dùng 'the student opposes', 'the student disagrees', 'the student is frustrated by'.",
    ],
    key_vocabulary: [
      { word: "inadequate", translation_vi: "không đầy đủ, thiếu thốn", pronunciation_ipa: "/ɪnˈæd.ə.kwət/", level: "C1" },
      { word: "meal plan", translation_vi: "gói ăn (trả trước)", pronunciation_ipa: "/miːl plæn/", level: "B2" },
      { word: "utility costs", translation_vi: "chi phí điện nước", pronunciation_ipa: "/juːˈtɪl.ə.ti kɒsts/", level: "B2" },
      { word: "conflict", translation_vi: "xung đột, mâu thuẫn", pronunciation_ipa: "/ˈkɒn.flɪkt/", level: "B2" },
    ],
  },

  // ═══ Task 3 — Integrated: Academic (Read + Listen → Speak) ═══
  {
    id: "speaking_task3_cultural_dimensions",
    task_number: 3,
    task_type: "integrated_academic",
    topic_title_vi: "Lý thuyết chiều văn hóa Hofstede",
    topic_title_en: "Hofstede's cultural dimensions theory",
    description_vi:
      "Đọc về individualism vs. collectivism. Nghe giáo sư cho ví dụ. Giải thích khái niệm bằng ví dụ.",
    description_en:
      "Read about individualism vs. collectivism. Hear the professor give examples. Explain the concept using the examples.",
    prompt_vi:
      "Bài đọc định nghĩa khái niệm 'individualism vs. collectivism' trong lý thuyết văn hóa. Sử dụng các ví dụ từ bài giảng, giải thích hai khái niệm này.",
    prompt_en:
      "The reading defines the concept of 'individualism vs. collectivism' in cultural theory. Using the examples from the lecture, explain these two concepts.",
    reading_passage:
      "Cultural Dimensions Theory, developed by Dutch psychologist Geert Hofstede, identifies several dimensions along which national cultures can be compared. One of the most widely studied is individualism versus collectivism. In individualist cultures, people tend to prioritize personal goals over group goals, value independence, and define their identity primarily in terms of personal achievements. In contrast, collectivist cultures emphasize group harmony, loyalty to family and community, and define identity through group membership. The United States is often cited as a highly individualist culture, while many East Asian societies are described as collectivist. Hofstede's framework has been influential in cross-cultural psychology and international business, though critics argue it oversimplifies complex cultural realities.",
    listening_transcript:
      "PROFESSOR: Let me give you two concrete examples that illustrate the difference between individualism and collectivism in practice. First, consider how companies give feedback to employees. In the United States, which scores very high on individualism, managers typically give direct, individual feedback in one-on-one meetings. They'll say things like 'You did a great job on this project, Sarah' — naming the individual, praising the individual. But in Japan, a more collectivist culture, public praise of one person is often avoided because singling someone out can embarrass them and disrupt group harmony. Instead, praise is given to the whole team. The second example is decision-making in families. In many individualist cultures, a young person choosing a career will primarily consider their own interests and ambitions. But in collectivist cultures, career choice is often a family decision — parents' expectations and the family's economic needs play a major role. So you can see the same underlying dimension — individual goals versus group goals — showing up in both workplace behaviour and family life.",
    preparation_seconds: 30,
    speaking_seconds: 60,
    sample_response_en:
      "The reading describes the cultural dimension of individualism versus collectivism. According to the passage, individualist cultures prioritize personal goals, independence, and individual achievement, while collectivist cultures emphasize group harmony, loyalty, and group identity. The professor provides two examples to illustrate this distinction. First, in workplace feedback: in the individualist United States, managers praise individual employees by name in private meetings, whereas in collectivist Japan, public individual praise is avoided because it can embarrass the person and disrupt group harmony — praise is given to the whole team instead. Second, in career choice: in individualist societies, young people choose careers based on their own interests, but in collectivist cultures, career decisions are often made by the whole family, with parents' expectations playing a major role. These examples show how the individualist-collectivist dimension affects both professional and personal life.",
    sample_response_band5_en:
      "The reading talk about individual and collectivist culture. Individual culture mean people care about themself, their own success. Collectivist culture mean people care about group, family. The professor give two example. First at work, in America the boss say 'good job' to one person but in Japan they say to whole team because they don't want make someone embarrass. Second, in America young people choose job what they like, but in Asia they choose job what family want. So the difference is individual think about self, collectivist think about group.",
    band5_error_notes_vi: [
      "'The reading talk' — chủ ngữ số ít cần 'talks'.",
      "'care about themself' — 'themselves' là đúng.",
      "'make someone embarrass' — cần 'make someone feel embarrassed' hoặc 'embarrass someone'.",
      "'choose job what they like' — nên dùng 'choose the job they want' hoặc 'choose whatever job they like'.",
      "Giọng điệu informal ('talk about', 'say good job') — cần register học thuật hơn.",
    ],
    vietnamese_speaker_tips: [
      "Task 3 cần: (1) tóm tắt khái niệm từ reading (15–20s), (2) 2 ví dụ từ lecture (30–35s), (3) kết luận ngắn (5s).",
      "'Individualism' 7 âm tiết — tập phát âm chậm, rõ: in-di-vi-du-a-li-sm.",
      "Dùng 'whereas' / 'in contrast' để so sánh hai nền văn hóa.",
      "Đừng copy nguyên câu từ reading passage — paraphrase.",
    ],
    key_vocabulary: [
      { word: "individualism", translation_vi: "chủ nghĩa cá nhân", pronunciation_ipa: "/ˌɪn.dɪˈvɪdʒ.u.ə.lɪ.zəm/", level: "C1" },
      { word: "collectivism", translation_vi: "chủ nghĩa tập thể", pronunciation_ipa: "/kəˈlɛk.tɪ.vɪ.zəm/", level: "C1" },
      { word: "harmony", translation_vi: "sự hòa hợp", pronunciation_ipa: "/ˈhɑːr.mə.ni/", level: "B2" },
      { word: "singling out", translation_vi: "chỉ đích danh (một người)", pronunciation_ipa: "/ˈsɪŋ.ɡəl.ɪŋ aʊt/", level: "C1" },
      { word: "underlying", translation_vi: "nằm bên dưới, cơ bản", pronunciation_ipa: "/ˌʌn.dɚˈlaɪ.ɪŋ/", level: "C1" },
    ],
  },
  {
    id: "speaking_task3_cognitive_dissonance",
    task_number: 3,
    task_type: "integrated_academic",
    topic_title_vi: "Bất hòa nhận thức (Cognitive Dissonance)",
    topic_title_en: "Cognitive dissonance theory",
    description_vi:
      "Đọc về cognitive dissonance. Nghe giáo sư cho ví dụ từ nghiên cứu. Giải thích khái niệm.",
    description_en:
      "Read about cognitive dissonance. Hear the professor give research examples. Explain the concept.",
    prompt_vi:
      "Bài đọc mô tả thuyết bất hòa nhận thức (cognitive dissonance). Dùng các ví dụ trong bài giảng, giải thích thuyết này.",
    prompt_en:
      "The reading describes cognitive dissonance theory. Using the examples from the lecture, explain this theory.",
    reading_passage:
      "Cognitive dissonance theory, proposed by psychologist Leon Festinger in 1957, describes the mental discomfort people experience when they hold two contradictory beliefs simultaneously, or when their behaviour conflicts with their beliefs. To reduce this discomfort, people typically change one of the conflicting elements — either modifying their belief, changing their behaviour, or adding new beliefs that justify the contradiction. The theory has been widely applied to understand phenomena such as post-purchase rationalization, where consumers convince themselves that an expensive purchase was worthwhile to avoid feeling they made a mistake.",
    listening_transcript:
      "PROFESSOR: Let me share two classic examples from Festinger's research. The first is from a famous study conducted in the 1950s. Festinger and his colleague Carlsmith asked participants to perform an extremely boring task — turning pegs on a board for an hour. Afterward, they asked some participants to tell the next person that the task was interesting, and paid them either one dollar or twenty dollars for lying. Here's the fascinating result: the people paid just one dollar later reported that they actually found the task more enjoyable than those paid twenty dollars. Why? The people paid twenty dollars could justify the lie — 'I did it for the money.' But the people paid only one dollar couldn't justify their dishonesty that way, so they changed their belief instead — 'Maybe the task wasn't so boring after all.' The second example is from consumer behaviour: someone who buys an expensive car that turns out to have high fuel consumption will often focus on the car's safety features or comfort, downplaying the fuel cost to justify the purchase. In both cases, we see the same pattern — when behaviour and belief conflict, people adjust their beliefs to reduce the psychological discomfort.",
    preparation_seconds: 30,
    speaking_seconds: 60,
    sample_response_en:
      "The reading explains cognitive dissonance theory, which is the mental discomfort people feel when their beliefs and actions contradict each other. To resolve this discomfort, they either change their belief, change their behaviour, or add new justifications. The professor illustrates this with two examples. In the first, from a 1950s experiment, participants did a boring task and were then paid either one dollar or twenty dollars to lie about it being interesting. The one-dollar group later rated the task as more enjoyable than the twenty-dollar group. The professor explains that the twenty-dollar group could justify lying — 'I did it for the money' — but the one-dollar group couldn't, so they unconsciously changed their belief about the task to reduce the discomfort of having lied for almost nothing. The second example involves a car buyer who discovers their new car uses a lot of fuel. Instead of admitting they made a bad purchase, they focus on the car's other positive features to justify the decision. Both examples demonstrate the same mechanism: when behaviour can't be changed, beliefs are adjusted to eliminate the uncomfortable contradiction.",
    sample_response_band5_en:
      "The reading talk about cognitive dissonance — when people feel uncomfortable because they think one thing but do another thing. The professor give example about experiment. Some people do boring task then they lie and get one dollar or twenty dollar. The one dollar people later say the task was interesting — because they cannot explain why they lie for only one dollar. The twenty dollar people say it's boring because they know they lie for money. Second example about car — if you buy expensive car but it use much petrol, you will say 'but it's very safe' to make yourself feel better.",
    band5_error_notes_vi: [
      "'they think one thing but do another thing' — informal, nên paraphrase: 'they hold a belief that contradicts their actions'.",
      "'much petrol' — 'a lot of petrol' hoặc 'high fuel consumption' mới đúng.",
      "'make yourself feel better' — informal; nên: 'to reduce the psychological discomfort' hoặc 'to justify the decision'.",
      "Không dùng linking words academic — thiếu 'furthermore', 'additionally', 'in both cases'.",
    ],
    vietnamese_speaker_tips: [
      TIP_TEMPLATE,
      "'Dissonance' — DIS-so-nance, trọng âm đầu, không phải dis-SO-nance.",
      "Mô hình: 'The reading defines X. The professor provides examples. First… Second… In both cases, we see…'",
      "Tập paraphrase thuật ngữ kỹ thuật bằng ngôn ngữ đơn giản hơn 1 lần, sau đó dùng thuật ngữ.",
    ],
    key_vocabulary: [
      { word: "dissonance", translation_vi: "sự bất hòa, mâu thuẫn", pronunciation_ipa: "/ˈdɪs.ə.nəns/", level: "C1" },
      { word: "contradictory", translation_vi: "mâu thuẫn, trái ngược", pronunciation_ipa: "/ˌkɒn.trəˈdɪk.tər.i/", level: "C1" },
      { word: "justify", translation_vi: "biện minh, bào chữa", pronunciation_ipa: "/ˈdʒʌs.tə.faɪ/", level: "B2" },
      { word: "unconsciously", translation_vi: "một cách vô thức", pronunciation_ipa: "/ʌnˈkɒn.ʃəs.li/", level: "C1" },
    ],
  },

  // ═══ Task 4 — Integrated: Academic Lecture Only ═══
  {
    id: "speaking_task4_keystone_species",
    task_number: 4,
    task_type: "integrated_lecture",
    topic_title_vi: "Loài chủ chốt (keystone species)",
    topic_title_en: "Keystone species",
    description_vi:
      "Nghe bài giảng về loài chủ chốt trong hệ sinh thái. Tóm tắt định nghĩa và ví dụ.",
    description_en:
      "Listen to a lecture about keystone species in ecosystems. Summarize the definition and examples.",
    prompt_vi:
      "Sử dụng các điểm và ví dụ từ bài giảng, giải thích khái niệm 'loài chủ chốt' (keystone species) và tác động của chúng đối với hệ sinh thái.",
    prompt_en:
      "Using points and examples from the lecture, explain the concept of keystone species and their impact on ecosystems.",
    listening_transcript:
      "PROFESSOR: Today we're going to talk about an important concept in ecology — the keystone species. A keystone species is a species whose impact on its ecosystem is disproportionately large relative to its population size. In other words, if you remove this species, the entire ecosystem changes dramatically, even though the species itself might not be very numerous. Let me give you two examples. The first is the sea otter, which lives along the Pacific coast of North America. Sea otters eat sea urchins. Sea urchins eat kelp, which is a type of large seaweed that forms underwater forests. When sea otters were hunted almost to extinction in the nineteenth century, the sea urchin population exploded. The urchins ate so much kelp that the kelp forests disappeared, and with them went all the fish and other creatures that depended on the kelp for habitat. When sea otters were reintroduced and protected, the urchin population went back down, the kelp forests recovered, and the entire ecosystem was restored. The second example is the beaver. Beavers build dams, which create ponds and wetlands. These ponds provide habitat for fish, frogs, birds, and many insects. When beavers were trapped out of many North American streams in the eighteenth and nineteenth centuries, the ponds disappeared and biodiversity in those areas dropped significantly. So in both cases, a single species — not the most numerous one in the system — was responsible for maintaining the structure of an entire ecological community.",
    preparation_seconds: 20,
    speaking_seconds: 60,
    sample_response_en:
      "The professor explains the concept of keystone species — a species that has a much larger effect on its ecosystem than you would expect from its population size. She gives two examples to illustrate this. The first example is the sea otter. Sea otters eat sea urchins, which eat kelp. When sea otters were hunted nearly to extinction, the urchin population grew out of control and destroyed the kelp forests. This caused all the fish and animals that relied on kelp to disappear as well. When otters were reintroduced, the ecosystem recovered. The second example is the beaver. Beavers build dams that create ponds and wetlands, which provide habitat for many species. When beavers were removed from streams, the ponds disappeared and biodiversity declined. Both examples show the same pattern — a single species, even if not the most abundant, can determine the health and structure of an entire ecosystem.",
    sample_response_band5_en:
      "Professor talk about keystone species — animal that is very important for environment even if not many. First example is sea otter. Sea otter eat sea urchin. When otter disappear, urchin eat all kelp and destroy forest. Then fish also die. But when otter come back, everything recover. Second example is beaver. Beaver make dam, create pond. Many animal live in pond. But when beaver gone, pond dry and animal go away. So keystone species is very important.",
    band5_error_notes_vi: [
      "'animal that is very important' — nên dùng 'a species whose impact is disproportionately large'.",
      "'When otter disappear' — sai chia động từ: 'When otters disappeared'.",
      "'destroy forest' — thiếu mạo từ: 'destroyed the kelp forests'.",
      "'animal go away' — informal; nên 'the species that depended on the ponds disappeared'.",
      "Dùng 'very important' lặp lại — thay bằng 'essential', 'critical', 'vital'.",
    ],
    vietnamese_speaker_tips: [
      "Task 4: 20s prep là rất ngắn. Dùng 10s đầu để note 2–3 keywords từ mỗi ví dụ.",
      "Cấu trúc: 'The professor discusses X, which is defined as… He/she provides two examples. First… Second…'",
      "'Keystone' = KEY-stone, trọng âm đầu. 'Disproportionately' = dis-pro-POR-tion-ate-ly.",
      "Đừng đưa thêm ví dụ riêng của bạn — chỉ tóm tắt bài giảng.",
    ],
    key_vocabulary: [
      { word: "keystone species", translation_vi: "loài chủ chốt", pronunciation_ipa: "/ˈkiː.stoʊn ˈspiː.ʃiːz/", level: "C1" },
      { word: "disproportionately", translation_vi: "một cách không cân xứng", pronunciation_ipa: "/ˌdɪs.prəˈpɔːr.ʃən.ət.li/", level: "C1" },
      { word: "extinction", translation_vi: "sự tuyệt chủng", pronunciation_ipa: "/ɪkˈstɪŋk.ʃən/", level: "B2" },
      { word: "biodiversity", translation_vi: "đa dạng sinh học", pronunciation_ipa: "/ˌbaɪ.oʊ.daɪˈvɝː.sə.t̬i/", level: "B2" },
      { word: "habitat", translation_vi: "môi trường sống", pronunciation_ipa: "/ˈhæb.ɪ.tæt/", level: "B2" },
    ],
  },
  {
    id: "speaking_task4_diffusion_of_innovation",
    task_number: 4,
    task_type: "integrated_lecture",
    topic_title_vi: "Lý thuyết khuếch tán đổi mới",
    topic_title_en: "Diffusion of innovation theory",
    description_vi:
      "Nghe bài giảng về cách công nghệ mới lan tỏa trong xã hội. Tóm tắt các nhóm người dùng.",
    description_en:
      "Listen to a lecture about how new technologies spread through society. Summarize the user categories.",
    prompt_vi:
      "Sử dụng các điểm và ví dụ từ bài giảng, giải thích thuyết khuếch tán đổi mới (diffusion of innovation) và các nhóm người dùng công nghệ.",
    prompt_en:
      "Using points and examples from the lecture, explain the diffusion of innovation theory and the categories of technology adopters.",
    listening_transcript:
      "PROFESSOR: In 1962, a sociologist named Everett Rogers published a theory that explains how new ideas and technologies spread through a population. He called it the diffusion of innovation, and he identified five categories of people based on how quickly they adopt something new. The first category, making up about two and a half percent of the population, are the innovators. These are the risk-takers — the people who camp outside the store to buy the newest phone on launch day. They're willing to deal with bugs and high prices just to be first. Then come the early adopters, about thirteen and a half percent. These are opinion leaders — when they adopt something, others watch and follow. A good example is a popular tech reviewer on YouTube: they're not the very first, but their endorsement can make or break a product. Next is the early majority, about thirty-four percent. These people are more careful — they wait until a technology has been tested and reviewed before buying. They're not followers, but they're not pioneers either. After them comes the late majority, another thirty-four percent. These are the skeptics who only adopt when something has become standard or when they feel pressure to keep up. For instance, someone who finally bought a smartphone in 2018 because their old flip phone stopped being supported. And finally, the laggards — about sixteen percent — who resist change and may never adopt unless absolutely forced to. The key insight of Rogers' theory is that adoption isn't random — it follows a predictable bell-curve pattern, and each group is influenced by different factors.",
    preparation_seconds: 20,
    speaking_seconds: 60,
    sample_response_en:
      "The professor discusses Everett Rogers' diffusion of innovation theory, which explains how new technologies spread through a population in a predictable pattern. Rogers identified five adopter categories. First, innovators — about 2.5% of people — are the first to try new things. They're risk-takers who don't mind high prices or early bugs. Second, early adopters, roughly 13.5%, are opinion leaders whose choices influence others, like popular tech reviewers on YouTube. Third, the early majority, about 34%, are more cautious and wait for reviews before adopting. Fourth, the late majority, another 34%, are skeptics who adopt only when a technology has become mainstream or when they feel social pressure — the professor gives the example of someone who finally bought a smartphone in 2018. Finally, the laggards, about 16%, resist change and may never adopt new technology unless forced. The professor emphasizes that these groups form a bell curve, and each is motivated by different factors.",
    sample_response_band5_en:
      "Professor explain about how new technology spread. There are five group of people. First group, innovator, very small percent — they buy new phone immediately even it expensive. Second group, early adopter, they are like famous people on YouTube, they influence other. Third group, early majority, they wait and read review. Fourth, late majority, they very slow, only buy when everyone have. Like someone buy smartphone very late. Last group, laggard, they never want change. So adoption follow a bell curve pattern.",
    band5_error_notes_vi: [
      "'Professor explain' — thiếu 's': 'The professor explains'.",
      "'about how new technology spread' — cần 'spreads' hoặc 'how new technologies spread'.",
      "'they buy new phone immediately even it expensive' — thiếu mạo từ và to be: 'even if it is expensive'.",
      "'they influence other' — cần 'others' (số nhiều).",
      "Câu rời rạc, không có liên kết — thiếu 'furthermore', 'in addition', 'finally'.",
    ],
    vietnamese_speaker_tips: [
      TIP_TIME_MANAGEMENT,
      "Tập phát âm số phần trăm: 'two point five percent', 'thirteen point five percent'.",
      "'Diffusion' = dif-FU-sion, trọng âm thứ hai, không phải DIFF-usion.",
      "Mô hình trả lời: 'The professor discusses Rogers' theory of X. He identifies five categories. The first is… The second is…'",
    ],
    key_vocabulary: [
      { word: "diffusion", translation_vi: "sự khuếch tán, lan tỏa", pronunciation_ipa: "/dɪˈfjuː.ʒən/", level: "C1" },
      { word: "endorsement", translation_vi: "sự chứng thực, ủng hộ", pronunciation_ipa: "/ɪnˈdɔːrs.mənt/", level: "C1" },
      { word: "pioneer", translation_vi: "người tiên phong", pronunciation_ipa: "/ˌpaɪ.əˈnɪr/", level: "B2" },
      { word: "bell curve", translation_vi: "đường cong hình chuông (phân phối chuẩn)", pronunciation_ipa: "/bɛl kɝːv/", level: "C1" },
      { word: "skeptic", translation_vi: "người hoài nghi", pronunciation_ipa: "/ˈskɛp.tɪk/", level: "C1" },
    ],
  },

  // ═══ Task 1 — Independent Speaking (added) ═══
  {
    id: "speaking_task1_university_pe_requirement",
    task_number: 1,
    task_type: "independent",
    topic_title_vi: "Đại học có nên bắt buộc môn thể dục?",
    topic_title_en: "Should universities require physical education?",
    description_vi:
      "Một số đại học bắt buộc tất cả sinh viên hoàn thành ít nhất một học kỳ thể dục. Bạn đồng ý hay phản đối?",
    description_en:
      "Some universities require all students to complete at least one semester of physical education. Do you agree or disagree?",
    prompt_vi:
      "Một số đại học có quy định bắt buộc tất cả sinh viên phải hoàn thành ít nhất một học kỳ thể dục để tốt nghiệp. Bạn đồng ý hay phản đối quy định này? Giải thích lý do với ví dụ cụ thể.",
    prompt_en:
      "Some universities require all students to complete at least one semester of physical education in order to graduate. Do you agree or disagree with this requirement? Explain with specific reasons and examples.",
    preparation_seconds: 15,
    speaking_seconds: 45,
    sample_response_en:
      "I disagree with making physical education a graduation requirement, for two reasons. First, university students are adults, and they should be trusted to manage their own health choices. Forcing them to take a class they didn't choose can actually create resentment toward exercise rather than enthusiasm for it. Second, the time and tuition spent on a required PE course would, for many students, be better spent on courses directly related to their major or career goals. A computer science student paying for a semester of badminton, for example, is paying real money for something they could practice for free at the campus gym in their own time. I do think universities should make exercise opportunities widely available — free gym access, intramural leagues, fitness classes — but availability is different from mandate. Respecting students' autonomy is more likely to produce healthy adults than compelling them.",
    sample_response_band5_en:
      "I disagree this rule. Because students already very busy. They have many homework, projects, exams. Adding PE class is too much. Also, students can do exercise by themself. They can go gym, play sport with friends. Don't need teacher tell them. So university should not require this class. Students should have freedom to choose what they want to study.",
    band5_error_notes_vi: [
      "'I disagree this rule' — thiếu giới từ: 'I disagree WITH this rule'.",
      "'students already very busy' — thiếu động từ to be: 'students are already very busy'.",
      "'many homework' — homework là uncountable, đúng là 'a lot of homework'.",
      "'do exercise by themself' — 'themselves' số nhiều, không phải 'themself'.",
      "'go gym' — thiếu mạo từ và giới từ: 'go to the gym'.",
    ],
    vietnamese_speaker_tips: [
      TIP_TEMPLATE,
      TIP_FINAL_CONSONANTS,
      "'Mandate' và 'requirement' là từ học thuật cao — dùng được sẽ tăng điểm vocabulary.",
      "Cấu trúc nâng cao: 'X is different from Y' — 'availability is different from mandate' nghe sang hơn 'X and Y are not the same'.",
    ],
    key_vocabulary: [
      { word: "mandate", translation_vi: "quy định bắt buộc", pronunciation_ipa: "/ˈmæn.deɪt/", level: "C1" },
      { word: "autonomy", translation_vi: "quyền tự chủ", pronunciation_ipa: "/ɔːˈtɑː.nə.mi/", level: "C1" },
      { word: "intramural", translation_vi: "(thể thao) nội bộ trường", pronunciation_ipa: "/ˌɪn.trəˈmjʊr.əl/", level: "C1" },
      { word: "compel", translation_vi: "ép buộc", pronunciation_ipa: "/kəmˈpɛl/", level: "B2" },
    ],
  },

  // ═══ Task 2 — Integrated: Campus Situation (added) ═══
  {
    id: "speaking_task2_campus_solar_panels",
    task_number: 2,
    task_type: "integrated_campus",
    topic_title_vi: "Lắp tấm pin mặt trời trên mái ký túc xá",
    topic_title_en: "Solar panels on dormitory roofs",
    description_vi:
      "Đọc thông báo của trường và nghe hai sinh viên thảo luận. Tóm tắt ý kiến của sinh viên nam và lý do.",
    description_en:
      "Read the university announcement and listen to two students discussing it. Summarize the male student's opinion and the reasons he gives.",
    prompt_vi:
      "Bài đọc: Trường vừa công bố kế hoạch lắp tấm pin mặt trời trên mái tất cả các ký túc xá vào mùa hè tới. Bài nghe: hai sinh viên thảo luận. Tóm tắt ý kiến của sinh viên nam và hai lý do anh ấy đưa ra.",
    prompt_en:
      "Reading: The university has announced a plan to install solar panels on the roofs of all dormitories next summer. Listening: two students discuss the announcement. Summarize the male student's opinion of the plan and the two reasons he gives for that opinion.",
    reading_passage:
      "ANNOUNCEMENT FROM THE OFFICE OF SUSTAINABILITY: As part of the university's commitment to reducing its carbon footprint, solar panels will be installed on the roofs of all 14 residential dormitories during the upcoming summer break. The installation is projected to cover approximately 35 percent of the dormitories' annual electricity demand and is expected to pay for itself through reduced utility costs within 12 years. The project is funded by a state grant for renewable energy infrastructure and will not result in any increase to student housing fees. Some construction noise during the summer is anticipated; students remaining on campus over the summer should expect roof-area work between 8:00 a.m. and 4:00 p.m. on weekdays.",
    listening_transcript:
      "FEMALE STUDENT: Hey, did you see the email about solar panels going on all the dorms?\nMALE STUDENT: Yeah, I'm actually really pleased about it. I've been wondering when they'd do something visible like this.\nFEMALE STUDENT: You think it's a good idea?\nMALE STUDENT: Definitely. Two main reasons. First — the email talks about reducing the carbon footprint, but I think the more important effect is symbolic. When a thousand prospective students tour campus next fall and see solar panels everywhere, that sends a message about what the university actually values. It's not just a marketing brochure claim about sustainability — it's a visible commitment.\nFEMALE STUDENT: Hm, I hadn't thought about it that way.\nMALE STUDENT: And the second reason is the financial part. They said it pays for itself in twelve years through utility savings, and the installation is funded by a state grant. So it's not coming out of housing fees. The university gets cheaper electricity for decades after that — money that can go into financial aid or research. It's the kind of decision that looks expensive in year one but pays off enormously over twenty or thirty years.\nFEMALE STUDENT: I'm a little worried about the construction noise this summer, though.\nMALE STUDENT: Sure, that part is annoying for anyone staying on campus. But it's a one-time cost for a benefit that lasts decades. Hard to see that as a real downside.",
    preparation_seconds: 30,
    speaking_seconds: 60,
    sample_response_en:
      "The university has announced that solar panels will be installed on all 14 dormitory roofs this summer, funded by a state grant. The male student is strongly in favor of the plan, and he gives two reasons. First, he believes the symbolic value of the panels matters even more than the carbon reduction itself. He thinks that when prospective students visit campus and see visible solar infrastructure, it demonstrates that the university's commitment to sustainability is real, not just a marketing claim. Second, he sees it as a sound financial decision. The installation is funded externally by a state grant, so housing fees won't increase, and the panels will pay for themselves in twelve years. After that, the university benefits from decades of reduced electricity costs, which can be redirected to financial aid or research. He acknowledges the summer construction noise will be inconvenient but considers it a one-time cost for a benefit lasting decades.",
    sample_response_band5_en:
      "The university plan to put solar panel on all dormitory roof. The man student agree with this plan. He give two reason. First reason is symbolic. When other students come visit, they see the panel and think university care about environment. Second reason is money. The panel pay for itself in twelve year. Also the government give money for install. So student no need pay more. The man student think it is good idea, even there is noise in summer.",
    band5_error_notes_vi: [
      "'plan to put solar panel' — thiếu mạo từ + thiếu plural: 'plans to put solar panels'.",
      "'The man student' — không tự nhiên. Đúng: 'The male student'.",
      "'agree with' đúng nhưng 'agree with this plan' nên thay bằng 'is in favor of the plan'.",
      "'He give two reason' — sai chia động từ + plural: 'He gives two reasons'.",
      "'pay for itself in twelve year' — thiếu plural và article: 'will pay for itself within twelve years'.",
    ],
    vietnamese_speaker_tips: [
      TIP_SUMMARIZE,
      TIP_TIME_MANAGEMENT,
      "Task 2 luôn cần đề cập CẢ READING + LISTENING. Nhiều sinh viên Việt chỉ nói LISTENING — bị trừ điểm vì thiếu summary của reading.",
      "Cấu trúc 'in favor of' nghe học thuật hơn 'agree with'. Tập dùng các collocation chính: 'in favor of', 'opposed to', 'concerned about', 'enthusiastic about'.",
    ],
    key_vocabulary: [
      { word: "carbon footprint", translation_vi: "dấu chân carbon (lượng phát thải)", pronunciation_ipa: "/ˈkɑːr.bən ˈfʊt.prɪnt/", level: "B2" },
      { word: "infrastructure", translation_vi: "cơ sở hạ tầng", pronunciation_ipa: "/ˈɪn.frəˌstrʌk.tʃɚ/", level: "B2" },
      { word: "symbolic", translation_vi: "có tính biểu tượng", pronunciation_ipa: "/sɪmˈbɑː.lɪk/", level: "B2" },
      { word: "redirect", translation_vi: "chuyển hướng (tài nguyên)", pronunciation_ipa: "/ˌriː.dəˈrɛkt/", level: "B2" },
    ],
  },

  // ═══ Task 3 — Integrated: Academic (added) ═══
  {
    id: "speaking_task3_framing_effect",
    task_number: 3,
    task_type: "integrated_academic",
    topic_title_vi: "Hiệu ứng đóng khung (framing effect)",
    topic_title_en: "The framing effect",
    description_vi:
      "Đọc đoạn về hiệu ứng đóng khung và nghe ví dụ của giáo sư. Giải thích khái niệm bằng các ví dụ trong bài giảng.",
    description_en:
      "Read about the framing effect and listen to the professor's examples. Explain the concept using the examples from the lecture.",
    prompt_vi:
      "Bài đọc giới thiệu khái niệm 'framing effect' trong kinh tế học hành vi. Giáo sư đưa ra hai ví dụ minh họa. Giải thích framing effect bằng các ví dụ giáo sư đã đưa.",
    prompt_en:
      "The reading introduces the concept of the 'framing effect' in behavioral economics. The professor gives two examples. Explain the framing effect using the examples the professor provides.",
    reading_passage:
      "THE FRAMING EFFECT. The framing effect is a cognitive bias in which people's choices are influenced by HOW information is presented rather than by the underlying facts themselves. Two descriptions that are mathematically equivalent can produce systematically different decisions if one is phrased in terms of gains and the other in terms of losses, or if one emphasizes a different reference point. The framing effect challenges classical economic theory, which assumes that rational decision-makers respond only to the substance of information, not its presentation.",
    listening_transcript:
      "PROFESSOR: Let me give you two clean examples that show the framing effect in action.\n\nThe first comes from medical decision-making. Imagine you're considering a surgery for a serious condition, and the doctor says, 'Of patients who undergo this surgery, ninety percent are alive five years later.' Most people would consent. Now imagine the doctor says, 'Of patients who undergo this surgery, ten percent die within five years.' These two statements describe exactly the same outcome. But experimental studies show that patients are significantly less likely to consent to surgery when the second framing is used — even when they're explicitly told the statistics are identical. The 'die' frame triggers a stronger emotional response than the 'alive' frame, and that emotional response shifts the decision.\n\nThe second example comes from a classic study by Tversky and Kahneman about a hypothetical disease outbreak. Subjects were told that an unusual disease was expected to kill 600 people, and asked to choose between two programs. Half the subjects saw the choice framed as gains: Program A would save 200 lives for sure; Program B has a one-third chance of saving all 600 and a two-thirds chance of saving none. Most chose Program A — the certain gain. The other half of subjects saw the same choice framed as losses: Program A would result in 400 deaths for sure; Program B has a one-third chance that nobody dies and a two-thirds chance that 600 die. Now most chose Program B — the gamble. The two scenarios are mathematically identical. But framing the same outcomes as 'lives saved' versus 'lives lost' completely flipped the preference.",
    preparation_seconds: 30,
    speaking_seconds: 60,
    sample_response_en:
      "The framing effect is a cognitive bias where people's decisions change based on how information is presented, even when the underlying facts are identical. The professor illustrates this with two examples. The first involves a medical decision. When a doctor says ninety percent of surgery patients are alive after five years, most patients agree to the surgery. But when the same outcome is described as ten percent dying within five years, far fewer agree — even though the statistics are mathematically the same. The 'death' framing produces a stronger emotional reaction. The second example is from a famous Tversky and Kahneman experiment about a disease outbreak. When the choice was framed as 'lives saved,' people preferred a certain gain — Program A saving 200 for sure. When the same choice was framed as 'lives lost,' people preferred to gamble — Program B with a chance no one dies. The mathematics is identical in both versions, but the framing — gains versus losses — completely reverses the preference. Together, these examples show how framing, not facts, often drives real decisions.",
    sample_response_band5_en:
      "Framing effect mean people decide different by how information present. Professor give two example. First example is doctor talk about surgery. If doctor say ninety percent live, patient agree. If doctor say ten percent die, patient not agree. But same number. Second example is disease. People can choose program A or B. If frame as save life, people choose A safe option. If frame as lose life, people choose B gamble. Same situation but different choice. So framing very important.",
    band5_error_notes_vi: [
      "'Framing effect mean' — sai số: 'The framing effect MEANS' (chủ ngữ số ít cần -s).",
      "'how information present' — thiếu trợ động từ: 'how information IS presented'.",
      "'Professor give two example' — sai chia động từ + plural: 'The professor gives two examples'.",
      "'doctor talk about' — sai chia động từ: 'the doctor talks about'.",
      "'patient not agree' — thiếu trợ động từ: 'the patient DOES NOT agree' hoặc 'patients do not agree'.",
    ],
    vietnamese_speaker_tips: [
      TIP_SUMMARIZE,
      TIP_TIME_MANAGEMENT,
      "Task 3 academic concept yêu cầu định nghĩa concept TRƯỚC, rồi mới giải thích bằng ví dụ. Đừng nhảy thẳng vào ví dụ.",
      "'Mathematically equivalent' / 'mathematically identical' là collocation hữu ích cho concept-explanation tasks.",
      "Khi nói về psychology experiment, dùng cấu trúc 'Researchers found that…' hoặc 'Studies showed that…' — chuẩn academic.",
    ],
    key_vocabulary: [
      { word: "cognitive bias", translation_vi: "thiên kiến nhận thức", pronunciation_ipa: "/ˈkɑːɡ.nə.t̬ɪv ˈbaɪ.əs/", level: "C1" },
      { word: "frame", translation_vi: "đóng khung, trình bày (theo cách nào đó)", pronunciation_ipa: "/freɪm/", level: "B2" },
      { word: "consent", translation_vi: "đồng ý (chính thức)", pronunciation_ipa: "/kənˈsɛnt/", level: "B2" },
      { word: "gamble", translation_vi: "đánh bạc, lựa chọn rủi ro", pronunciation_ipa: "/ˈɡæm.bəl/", level: "B2" },
    ],
  },

  // ═══ Task 4 — Integrated: Lecture-only (added) ═══
  {
    id: "speaking_task4_dark_energy",
    task_number: 4,
    task_type: "integrated_lecture",
    topic_title_vi: "Năng lượng tối",
    topic_title_en: "Dark energy",
    description_vi:
      "Nghe đoạn giảng về năng lượng tối. Tóm tắt khái niệm và bằng chứng giáo sư đưa ra.",
    description_en:
      "Listen to a short lecture about dark energy. Summarize the concept and the evidence the professor presents.",
    prompt_vi:
      "Sử dụng các điểm chính từ bài giảng, giải thích năng lượng tối là gì và bằng chứng nào đã dẫn các nhà khoa học đến giả thuyết này.",
    prompt_en:
      "Using the points from the lecture, explain what dark energy is and what evidence led scientists to propose it.",
    listening_transcript:
      "PROFESSOR: Until 1998, almost every astronomer assumed that the expansion of the universe — first observed by Edwin Hubble in the 1920s — must be slowing down over time. The reasoning seemed straightforward. Gravity pulls all matter together. So even though the universe is expanding from the Big Bang, gravity should be acting as a brake, gradually decelerating that expansion.\n\nThen, in 1998, two independent research teams measured the brightness of distant Type 1a supernovae — extremely bright stellar explosions whose intrinsic luminosity is well known, which makes them excellent distance markers across the universe. The teams expected to find that the most distant supernovae appeared a little brighter than they would in a steadily expanding universe — because the universe should have been expanding faster in the past, before gravity slowed it down. Instead, they found the opposite. The distant supernovae were FAINTER than expected. This meant that the expansion of the universe was not slowing down at all. It was speeding up.\n\nThis was one of the most surprising discoveries in modern physics. To explain it, theorists proposed that some unknown energy must be filling all of space, exerting a kind of negative pressure that overpowers gravity at the largest scales. They called it dark energy — 'dark' because we cannot detect it directly, only its effects. Independent measurements since 1998 — from the cosmic microwave background, from large-scale galaxy surveys, from gravitational lensing — have all converged on the same conclusion: roughly sixty-eight percent of the total energy content of the universe consists of this mysterious dark energy. Yet despite a quarter century of effort, we still don't know what it actually IS. It remains one of the largest unsolved problems in physics.",
    preparation_seconds: 20,
    speaking_seconds: 60,
    sample_response_en:
      "The professor explains dark energy as a mysterious form of energy that fills all of space and causes the universe's expansion to accelerate, rather than slow down. Until 1998, scientists assumed the expansion would gradually decelerate because gravity pulls matter together. The key evidence came that year, when two research teams measured the brightness of distant Type 1a supernovae. These supernovae have a known intrinsic brightness, so they work as cosmic distance markers. The teams expected the most distant supernovae to appear slightly brighter than predicted — because the universe should have been expanding faster in the past. Instead, the supernovae appeared FAINTER than expected, meaning the expansion was actually accelerating. To explain this, scientists proposed that an unknown energy fills space and exerts a negative pressure that overpowers gravity at large scales. They named it dark energy because its effects are visible but the energy itself cannot be detected directly. Subsequent measurements from the cosmic microwave background and galaxy surveys have confirmed that dark energy makes up about sixty-eight percent of the universe's total energy content, although its true nature remains unknown.",
    sample_response_band5_en:
      "Dark energy is energy in space. Before, scientists think universe expand slow down because gravity. But in 1998, scientist measure supernova and see they are not bright enough. So expansion is fast, not slow. Scientists not understand why, so they call this energy dark energy. Other measurement also support this idea. Dark energy is sixty-eight percent of universe but we don't know what it is. It is big mystery in physics.",
    band5_error_notes_vi: [
      "'scientists think universe expand' — sai chia động từ và thiếu mạo từ: 'scientists thought the universe was expanding'.",
      "'see they are not bright enough' — câu cụt ý: 'and saw that they were not as bright as expected'.",
      "'expansion is fast, not slow' — quá đơn giản: 'the expansion was actually accelerating, not decelerating'.",
      "'scientists not understand' — thiếu trợ động từ: 'scientists do not understand' hoặc 'did not understand'.",
      "'big mystery' — thiếu mạo từ + nâng cấp vocab: 'one of the largest unsolved problems in physics'.",
    ],
    vietnamese_speaker_tips: [
      TIP_SUMMARIZE,
      TIP_TIME_MANAGEMENT,
      "Task 4 chỉ có lecture (không có reading), nên cấu trúc thường là: concept → evidence → consequence. Theo dõi 3 lớp này khi note.",
      "Số liệu khoa học (1998, 68%) và tên kỹ thuật (Type 1a supernovae) là điểm cộng — ghi và dùng lại trong response.",
      "'Counterintuitive' / 'unexpected' / 'surprising' là từ tốt khi mô tả phát hiện khoa học bất ngờ.",
    ],
    key_vocabulary: [
      { word: "decelerate", translation_vi: "giảm tốc, chậm lại", pronunciation_ipa: "/ˌdiːˈsɛl.ə.reɪt/", level: "C1" },
      { word: "supernova", translation_vi: "siêu tân tinh (vụ nổ sao)", pronunciation_ipa: "/ˌsuː.pɚˈnoʊ.və/", level: "C1" },
      { word: "intrinsic", translation_vi: "vốn có, nội tại", pronunciation_ipa: "/ɪnˈtrɪn.zɪk/", level: "C1" },
      { word: "converge", translation_vi: "hội tụ, đồng quy", pronunciation_ipa: "/kənˈvɝːdʒ/", level: "C1" },
    ],
  },
];

export function findTOEFLSpeakingTopicById(
  id: string,
): TOEFLSpeakingTopic | undefined {
  return TOEFL_SPEAKING_TOPICS.find((t) => t.id === id);
}
