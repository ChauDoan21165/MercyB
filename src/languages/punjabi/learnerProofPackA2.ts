// src/languages/punjabi/learnerProofPackA2.ts
//
// Punjabi A2 learner proof pack for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiLearnerProofPackA2Scenario =
  | "daily_routines"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "short_message_comprehension"
  | "polite_repair_phrases";

export type PunjabiLearnerProofPackA2Style =
  | "proof_pack"
  | "final_owner_review"
  | "final_qa";

export type PunjabiLearnerProofPackA2EvidenceLine = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiLearnerProofPackA2Trap = {
  trap_vi: string;
  trap_en: string;
  repair_pa: string;
  repair_romanization: string;
};

export type PunjabiLearnerProofPackA2Item = {
  id: string;
  scenario: PunjabiLearnerProofPackA2Scenario;
  style: PunjabiLearnerProofPackA2Style;
  title_vi: string;
  title_en: string;
  owner_review_vi: string;
  owner_review_en: string;
  learner_can_prove_vi: string[];
  learner_can_prove_en: string[];
  evidence_lines: PunjabiLearnerProofPackA2EvidenceLine[];
  final_qa: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  explanation_vi: string;
  explanation_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  traps: PunjabiLearnerProofPackA2Trap[];
  owner_acceptance_vi: string;
  owner_acceptance_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong learner proof pack; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this learner proof pack; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const learnerProofPackA2: PunjabiLearnerProofPackA2Item[] = [
  {
    id: "pa_a2_proof_daily_routines",
    scenario: "daily_routines",
    style: "proof_pack",
    title_vi: "Proof pack: thói quen hằng ngày",
    title_en: "Proof pack: daily routines",
    owner_review_vi: "Người học chứng minh được giờ, thói quen, phương tiện, và một việc đã làm.",
    owner_review_en: "The learner can prove time, routine, transport, and one completed action.",
    learner_can_prove_vi: ["Nói giờ với ਵਜੇ.", "Dùng habitual theo giới tính người nói.", "Thêm một câu quá khứ ngắn."],
    learner_can_prove_en: ["Use clock time with ਵਜੇ.", "Use habitual agreement for speaker gender.", "Add one short past-tense sentence."],
    evidence_lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਸੱਤ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere satt vaje utthdi haan.", vi: "Tôi thức dậy lúc bảy giờ sáng. (nữ)", en: "I wake up at seven in the morning. (female speaker)" },
      { pa: "ਫਿਰ ਮੈਂ ਬੱਸ ਨਾਲ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "phir main bass naal kamm te jandi haan.", vi: "Rồi tôi đi làm bằng xe buýt.", en: "Then I go to work by bus." },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਘਰ ਵਿੱਚ ਖਾਣਾ ਬਣਾਇਆ।", romanization: "kal main ghar vich khana banaia.", vi: "Hôm qua tôi nấu ăn ở nhà.", en: "Yesterday I cooked food at home." },
    ],
    final_qa: [
      { q_vi: "Người học thức dậy lúc mấy giờ?", q_en: "What time does the learner wake up?", answer_pa: "ਸੱਤ ਵਜੇ", answer_romanization: "satt vaje", answer_vi: "Bảy giờ.", answer_en: "At seven." },
      { q_vi: "Việc đã làm hôm qua là gì?", q_en: "What completed action is mentioned?", answer_pa: "ਖਾਣਾ ਬਣਾਇਆ", answer_romanization: "khana banaia", answer_vi: "Nấu ăn.", answer_en: "Cooked food." },
    ],
    explanation_vi: "Mẫu cho thấy người học tích hợp time, routine, transport, và past action ở mức A2.",
    explanation_en: "The sample shows the learner integrating time, routine, transport, and a past action at A2.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Người nói nam cần ਉੱਠਦਾ/ਜਾਂਦਾ.", trap_en: "A male speaker needs ਉੱਠਦਾ/ਜਾਂਦਾ.", repair_pa: "ਮੈਂ ਉੱਠਦਾ ਹਾਂ।", repair_romanization: "main utthda haan." }],
    owner_acceptance_vi: "Đạt nếu có ít nhất hai routine lines và một past-action line rõ nghĩa.",
    owner_acceptance_en: "Accept if there are at least two routine lines and one clear past-action line.",
  },
  {
    id: "pa_a2_proof_appointments",
    scenario: "appointments",
    style: "final_owner_review",
    title_vi: "Final owner review: lịch hẹn",
    title_en: "Final owner review: appointments",
    owner_review_vi: "Người học có thể xác nhận lịch, xin đổi giờ, và nhắc giấy tờ.",
    owner_review_en: "The learner can confirm an appointment, ask to change time, and mention a document.",
    learner_can_prove_vi: ["Nói ngày/giờ với ਵਜੇ.", "Dùng ਸਕਦਾ/ਸਕਦੀ cho yêu cầu.", "Nêu giấy tờ cần mang."],
    learner_can_prove_en: ["State day/time with ਵਜੇ.", "Use ਸਕਦਾ/ਸਕਦੀ for a request.", "Name a document to bring."],
    canada_practical_vi: "Thực tế với clinic, dentist, school office, hoặc settlement office ở Canada.",
    canada_practical_en: "Practical for clinics, dentists, school offices, or settlement offices in Canada.",
    evidence_lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment budhvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Tư lúc hai giờ.", en: "My appointment is Wednesday at two." },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "ki main is nu shukkarvaar tinn vaje kar sakda haan?", vi: "Tôi có thể đổi nó sang thứ Sáu lúc ba giờ không? (nam)", en: "Can I make it Friday at three? (male speaker)" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main health card naal liaavanga.", vi: "Tôi sẽ mang thẻ y tế. (nam)", en: "I will bring the health card. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Lịch ban đầu khi nào?", q_en: "When is the original appointment?", answer_pa: "ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "budhvaar do vaje", answer_vi: "Thứ Tư lúc hai giờ.", answer_en: "Wednesday at two." },
      { q_vi: "Giấy tờ nào được nhắc?", q_en: "Which document is mentioned?", answer_pa: "ਹੈਲਥ ਕਾਰਡ", answer_romanization: "health card", answer_vi: "Thẻ y tế.", answer_en: "Health card." },
    ],
    explanation_vi: "Mẫu chứng minh khả năng xử lý appointment thực dụng với polite modal và thông tin cụ thể.",
    explanation_en: "The sample proves practical appointment handling with a polite modal and specific information.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Không bỏ ngày/giờ mới khi xin đổi lịch.", trap_en: "Do not omit the new day/time when rescheduling.", repair_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", repair_romanization: "shukkarvaar tinn vaje" }],
    owner_acceptance_vi: "Đạt nếu người nghe biết lịch cũ, lịch mới, và giấy tờ cần mang.",
    owner_acceptance_en: "Accept if the listener knows the old time, new time, and document to bring.",
  },
  {
    id: "pa_a2_proof_transport",
    scenario: "transport",
    style: "proof_pack",
    title_vi: "Proof pack: đi lại",
    title_en: "Proof pack: transport",
    owner_review_vi: "Người học hỏi tuyến, điểm xuống, và báo trễ bằng câu ngắn.",
    owner_review_en: "The learner asks route, stop, and reports delay in short sentences.",
    learner_can_prove_vi: ["Hỏi đích đến với ਤੱਕ.", "Hỏi xuống ở đâu với ਕਿੱਥੇ.", "Báo trễ bằng ਦੇਰ ਨਾਲ."],
    learner_can_prove_en: ["Ask destination with ਤੱਕ.", "Ask where to get off with ਕਿੱਥੇ.", "Report lateness with ਦੇਰ ਨਾਲ."],
    canada_practical_vi: "Dùng được với bus, SkyTrain, TTC, GO Train, stop, hoặc platform.",
    canada_practical_en: "Usable with buses, SkyTrain, TTC, GO Train, stops, or platforms.",
    evidence_lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗੀ।", romanization: "main das mint der naal aavangi.", vi: "Tôi sẽ đến muộn mười phút. (nữ)", en: "I will be ten minutes late. (female speaker)" },
    ],
    final_qa: [
      { q_vi: "Đích đến là gì?", q_en: "What is the destination?", answer_pa: "ਲਾਇਬ੍ਰੇਰੀ", answer_romanization: "library", answer_vi: "Thư viện.", answer_en: "Library." },
      { q_vi: "Người học trễ bao lâu?", q_en: "How late is the learner?", answer_pa: "ਦਸ ਮਿੰਟ", answer_romanization: "das mint", answer_vi: "Mười phút.", answer_en: "Ten minutes." },
    ],
    explanation_vi: "Mẫu chứng minh learner có thể sống sót trong tuyến đường đơn giản và repair timing.",
    explanation_en: "The sample proves the learner can handle a simple route and timing repair.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "ਬੱਸ thường dùng ਜਾਂਦੀ trong mẫu này.", trap_en: "ਬੱਸ usually takes ਜਾਂਦੀ in this pattern.", repair_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", repair_romanization: "bass jandi hai." }],
    owner_acceptance_vi: "Đạt nếu có route question, stop question, và delay phrase.",
    owner_acceptance_en: "Accept if there is a route question, stop question, and delay phrase.",
  },
  {
    id: "pa_a2_proof_housing",
    scenario: "housing",
    style: "final_owner_review",
    title_vi: "Final owner review: nhà ở",
    title_en: "Final owner review: housing",
    owner_review_vi: "Người học báo vấn đề nhà ở với vị trí, thời điểm, và yêu cầu hành động.",
    owner_review_en: "The learner reports a housing issue with location, timing, and action request.",
    learner_can_prove_vi: ["Mở bằng ਮਾਫ਼ ਕਰਨਾ.", "Nêu thiết bị/vấn đề.", "Yêu cầu xem bằng ਸਕਦੇ ਹੋ."],
    learner_can_prove_en: ["Open with ਮਾਫ਼ ਕਰਨਾ.", "Name the device/problem.", "Request a check with ਸਕਦੇ ਹੋ."],
    canada_practical_vi: "Thực tế khi nhắn landlord hoặc building manager về heater/leak/laundry.",
    canada_practical_en: "Practical when messaging a landlord or building manager about heat/leaks/laundry.",
    evidence_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "maaf karna, bathroom vich paani leak ho riha hai.", vi: "Xin lỗi, nước đang rò trong phòng tắm.", en: "Sorry, water is leaking in the bathroom." },
      { pa: "ਇਹ ਕੱਲ੍ਹ ਰਾਤ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh kal raat ton ho riha hai.", vi: "Việc này đang xảy ra từ tối qua.", en: "This has been happening since last night." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Bạn có thể xem hôm nay không?", en: "Can you check today?" },
    ],
    final_qa: [
      { q_vi: "Vấn đề ở đâu?", q_en: "Where is the problem?", answer_pa: "ਬਾਥਰੂਮ ਵਿੱਚ", answer_romanization: "bathroom vich", answer_vi: "Trong phòng tắm.", answer_en: "In the bathroom." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਕੱਲ੍ਹ ਰਾਤ ਤੋਂ", answer_romanization: "kal raat ton", answer_vi: "Từ tối qua.", answer_en: "Since last night." },
    ],
    explanation_vi: "Mẫu đủ rõ cho người nhận biết location, duration, và request.",
    explanation_en: "The sample is clear enough for the recipient to know location, duration, and request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Không chỉ viết 'problem' mà không có vị trí.", trap_en: "Do not write only 'problem' without a location.", repair_pa: "ਬਾਥਰੂਮ ਵਿੱਚ", repair_romanization: "bathroom vich" }],
    owner_acceptance_vi: "Đạt nếu tin nhắn đủ để landlord/building manager biết cần kiểm tra gì.",
    owner_acceptance_en: "Accept if the message tells the landlord/building manager what to inspect.",
  },
  {
    id: "pa_a2_proof_school",
    scenario: "school",
    style: "final_qa",
    title_vi: "Final QA: trường học",
    title_en: "Final QA: school",
    owner_review_vi: "Người học có thể báo vắng học và xin homework.",
    owner_review_en: "The learner can report absence and ask for homework.",
    learner_can_prove_vi: ["Dùng ਮੇਰਾ ਬੱਚਾ.", "Nêu lý do health cơ bản.", "Yêu cầu homework/email."],
    learner_can_prove_en: ["Use ਮੇਰਾ ਬੱਚਾ.", "Give a basic health reason.", "Ask for homework/email."],
    canada_practical_vi: "Dùng được với school office hoặc giáo viên tại Canada.",
    canada_practical_en: "Usable with a Canadian school office or teacher.",
    evidence_lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He/she has a fever." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi bài tập qua email không?", en: "Can you email the homework?" },
    ],
    final_qa: [
      { q_vi: "Tại sao vắng?", q_en: "Why absent?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Yêu cầu gì?", q_en: "What is requested?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi bài tập qua email.", answer_en: "Email the homework." },
    ],
    explanation_vi: "Mẫu chứng minh learner quản lý được school absence message A2.",
    explanation_en: "The sample proves the learner can manage an A2 school absence message.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "ਮੇਰਾ/ਮੇਰੀ theo danh từ sau, không theo phụ huynh.", trap_en: "ਮੇਰਾ/ਮੇਰੀ follows the noun, not the parent.", repair_pa: "ਮੇਰਾ ਬੱਚਾ", repair_romanization: "mera bachcha" }],
    owner_acceptance_vi: "Đạt nếu school biết ai vắng, lý do, và yêu cầu homework.",
    owner_acceptance_en: "Accept if the school knows who is absent, why, and the homework request.",
  },
  {
    id: "pa_a2_proof_childcare",
    scenario: "childcare",
    style: "proof_pack",
    title_vi: "Proof pack: childcare",
    title_en: "Proof pack: childcare",
    owner_review_vi: "Người học báo giờ đón và người đón thay một cách rõ ràng.",
    owner_review_en: "The learner clearly states pickup time and alternate pickup person.",
    learner_can_prove_vi: ["Dùng ਬੱਚੇ ਨੂੰ cho child as object.", "Nêu giờ đón.", "Nêu người đón thay."],
    learner_can_prove_en: ["Use ਬੱਚੇ ਨੂੰ for the child as object.", "State pickup time.", "Name alternate pickup person."],
    canada_practical_vi: "Phù hợp daycare/after-school care khi có pickup list.",
    canada_practical_en: "Fits daycare/after-school care when there is a pickup list.",
    evidence_lines: [
      { pa: "ਮੈਂ ਅੱਜ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain bachche nu lain aavegi.", vi: "Chị/em gái tôi sẽ đến đón trẻ.", en: "My sister will come to pick up the child." },
      { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Cô ấy có trong danh sách đón.", en: "She is on the pickup list." },
    ],
    final_qa: [
      { q_vi: "Ai sẽ đón?", q_en: "Who will pick up?", answer_pa: "ਮੇਰੀ ਭੈਣ", answer_romanization: "meri bhain", answer_vi: "Chị/em gái tôi.", answer_en: "My sister." },
      { q_vi: "Cô ấy có trong danh sách không?", q_en: "Is she on the list?", answer_pa: "pickup list ਵਿੱਚ ਹੈ", answer_romanization: "pickup list vich hai", answer_vi: "Có trong pickup list.", answer_en: "On the pickup list." },
    ],
    explanation_vi: "Mẫu chứng minh learner có thể xử lý pickup change rõ ràng và an toàn.",
    explanation_en: "The sample proves the learner can handle a pickup change clearly and safely.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Không bỏ người đón thay hoặc giờ đón.", trap_en: "Do not omit the alternate person or pickup time.", repair_pa: "ਮੇਰੀ ਭੈਣ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵੇਗੀ।", repair_romanization: "meri bhain panj vaje lain aavegi." }],
    owner_acceptance_vi: "Đạt nếu staff biết ai đón, khi nào, và có được phép không.",
    owner_acceptance_en: "Accept if staff know who picks up, when, and whether they are authorized.",
  },
  {
    id: "pa_a2_proof_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "final_owner_review",
    title_vi: "Final owner review: workplace small talk",
    title_en: "Final owner review: workplace small talk",
    owner_review_vi: "Người học mở small talk lịch sự và chuyển lại công việc.",
    owner_review_en: "The learner opens polite small talk and moves back to work.",
    learner_can_prove_vi: ["Dùng greeting phù hợp.", "Dùng ਤੁਹਾਡਾ lịch sự.", "Chuyển sang công việc bằng phrase ngắn."],
    learner_can_prove_en: ["Use a suitable greeting.", "Use polite ਤੁਹਾਡਾ.", "Move to work with a short phrase."],
    canada_practical_vi: "Weather/weekend small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weather/weekend small talk is often safe in many Canadian workplaces.",
    evidence_lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਮੇਰਾ ਦਿਨ ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "mera din changa hai, dhanvaad.", vi: "Ngày của tôi tốt, cảm ơn.", en: "My day is good, thank you." },
      { pa: "ਹੁਣ ਅਸੀਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin kamm shuru kariye?", vi: "Bây giờ chúng ta bắt đầu làm việc nhé?", en: "Shall we start work now?" },
    ],
    final_qa: [
      { q_vi: "Từ nào làm câu lịch sự hơn?", q_en: "Which word makes it more polite?", answer_pa: "ਤੁਹਾਡਾ", answer_romanization: "tuhada", answer_vi: "Của bạn, lịch sự.", answer_en: "Your, polite." },
      { q_vi: "Câu chuyển lại công việc?", q_en: "Line that moves back to work?", answer_pa: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", answer_romanization: "kamm shuru kariye?", answer_vi: "Bắt đầu làm việc nhé?", answer_en: "Shall we start work?" },
    ],
    explanation_vi: "Mẫu giữ small talk ngắn, lịch sự, và phù hợp môi trường làm việc.",
    explanation_en: "The sample keeps small talk short, polite, and workplace-appropriate.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật với đồng nghiệp mới.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar with a new coworker.", repair_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", repair_romanization: "tuhada din kiven hai?" }],
    owner_acceptance_vi: "Đạt nếu câu không quá riêng tư và có transition về công việc.",
    owner_acceptance_en: "Accept if it is not too personal and has a transition back to work.",
  },
  {
    id: "pa_a2_proof_short_message_comprehension",
    scenario: "short_message_comprehension",
    style: "final_qa",
    title_vi: "Final QA: hiểu tin nhắn ngắn",
    title_en: "Final QA: short-message comprehension",
    owner_review_vi: "Người học đọc tin nhắn ngắn và lấy được thời gian, nơi, vật cần mang.",
    owner_review_en: "The learner reads a short message and extracts time, place, and item to bring.",
    learner_can_prove_vi: ["Nhận ra ਅੱਜ/ਕੱਲ੍ਹ.", "Lấy giờ với ਵਜੇ.", "Trả lời bằng câu ngắn."],
    learner_can_prove_en: ["Recognize ਅੱਜ/ਕੱਲ੍ਹ.", "Extract clock time with ਵਜੇ.", "Answer in a short sentence."],
    canada_practical_vi: "Dùng được với school notice, library class, settlement class, hoặc workplace training.",
    canada_practical_en: "Usable with school notices, library classes, settlement classes, or workplace training.",
    evidence_lines: [
      { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਲਿਆਓ।", romanization: "kirpa karke notebook liaao.", vi: "Xin hãy mang vở.", en: "Please bring a notebook." },
      { pa: "ਮੈਨੂੰ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਜਾਣਾ ਹੈ।", romanization: "mainu kal tinn vaje library jaana hai.", vi: "Tôi cần đi thư viện ngày mai lúc ba giờ.", en: "I need to go to the library tomorrow at three." },
    ],
    final_qa: [
      { q_vi: "Khi nào có lớp?", q_en: "When is class?", answer_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", answer_romanization: "kal tinn vaje", answer_vi: "Ngày mai lúc ba giờ.", answer_en: "Tomorrow at three." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਨੋਟਬੁੱਕ", answer_romanization: "notebook", answer_vi: "Vở.", answer_en: "Notebook." },
    ],
    explanation_vi: "Mẫu chứng minh learner có thể đọc thông báo ngắn và trả lời thông tin chính.",
    explanation_en: "The sample proves the learner can read a short notice and answer key information.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Đừng trả lời chỉ 'library' mà thiếu ngày/giờ.", trap_en: "Do not answer only 'library' without day/time.", repair_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", repair_romanization: "kal tinn vaje" }],
    owner_acceptance_vi: "Đạt nếu người học nêu đúng thời gian, địa điểm, và vật cần mang.",
    owner_acceptance_en: "Accept if the learner gives the correct time, place, and item to bring.",
  },
  {
    id: "pa_a2_proof_polite_repair_phrases",
    scenario: "polite_repair_phrases",
    style: "proof_pack",
    title_vi: "Proof pack: repair phrases lịch sự",
    title_en: "Proof pack: polite repair phrases",
    owner_review_vi: "Người học xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    owner_review_en: "The learner asks for repetition, slower speech, and confirms understanding.",
    learner_can_prove_vi: ["Dùng ਮਾਫ਼ ਕਰਨਾ.", "Xin nhắc lại với ਦੁਬਾਰਾ.", "Xác nhận bằng ਇਸ ਦਾ ਮਤਲਬ."],
    learner_can_prove_en: ["Use ਮਾਫ਼ ਕਰਨਾ.", "Ask for repetition with ਦੁਬਾਰਾ.", "Confirm with ਇਸ ਦਾ ਮਤਲਬ."],
    evidence_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
      { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab eh hai ki mainu kal auna hai?", vi: "Có phải ý là tôi phải đến ngày mai không?", en: "Does this mean that I need to come tomorrow?" },
    ],
    final_qa: [
      { q_vi: "Câu xin nhắc lại?", q_en: "Repetition request?", answer_pa: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", answer_romanization: "dubara kahi sakde ho?", answer_vi: "Bạn có thể nói lại không?", answer_en: "Can you say that again?" },
      { q_vi: "Cụm xác nhận ý hiểu?", q_en: "Understanding-confirmation phrase?", answer_pa: "ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ", answer_romanization: "is da matlab eh hai ki", answer_vi: "Có phải ý là...", answer_en: "Does this mean that..." },
    ],
    explanation_vi: "Mẫu chứng minh learner không đoán im lặng khi thông tin quan trọng chưa rõ.",
    explanation_en: "The sample proves the learner does not silently guess when important information is unclear.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Đừng chỉ nói 'what?' trong môi trường lịch sự.", trap_en: "Do not just say 'what?' in a polite setting.", repair_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", repair_romanization: "ki tusi dubara kahi sakde ho?" }],
    owner_acceptance_vi: "Đạt nếu learner có ít nhất hai repair phrases và một confirmation phrase.",
    owner_acceptance_en: "Accept if the learner has at least two repair phrases and one confirmation phrase.",
  },
];
