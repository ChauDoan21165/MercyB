// Punjabi C2 discourse nuance practice for Vietnamese- and English-speaking
// learners. Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support material, not native-reviewed authority. Native
// review is deferred. Shahmukhi is mentioned only for script awareness, not as
// a full course.

export type PunjabiC2NuanceFocus =
  | "hedging"
  | "diplomatic_disagreement"
  | "misunderstanding_repair"
  | "sensitive_topics"
  | "formal_warm_tone"
  | "storytelling_transitions"
  | "persuasive_sequence"
  | "public_community_register";

export type PunjabiC2Register = "formal" | "warm" | "community" | "workplace" | "public";

export type PunjabiC2NuancePhrase = {
  cell_id?: string;
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
  register: PunjabiC2Register;
};

export type PunjabiC2LearnerTrap = {
  trap_vi: string;
  trap_en: string;
  safer_vi: string;
  safer_en: string;
};

export type PunjabiC2NuanceEntry = {
  id: string;
  focus: PunjabiC2NuanceFocus;
  title_vi: string;
  title_en: string;
  context_vi: string;
  context_en: string;
  discourse_move_vi: string;
  discourse_move_en: string;
  phrases: PunjabiC2NuancePhrase[];
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  learner_trap?: PunjabiC2LearnerTrap;
  canada_practical?: boolean;
};

export const C2_DISCOURSE_NUANCE_DISCLAIMER = {
  vi: "Thực hành sắc thái diễn ngôn Punjabi C2 chỉ để hỗ trợ học tập. Gurmukhi là chính; phiên âm giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ, không phải khóa học đầy đủ.",
  en: "C2 Punjabi discourse nuance practice for study support only. Gurmukhi is primary; romanization helps reading. Native review is deferred. Shahmukhi is noted only for script awareness, not taught as a full course.",
} as const;

export const discourseNuanceC2Entries: PunjabiC2NuanceEntry[] = [
  {
    id: "pa_c2_hedging_evidence",
    focus: "hedging",
    title_vi: "Rào đón dựa trên bằng chứng",
    title_en: "Evidence-based hedging",
    context_vi: "Khi bạn chưa có toàn bộ dữ kiện nhưng cần nêu nhận định trong họp hoặc lớp học.",
    context_en: "When you do not have all the facts but need to state a view in a meeting or class.",
    discourse_move_vi: "Đặt giới hạn cho nhận định trước, rồi nêu điểm chính.",
    discourse_move_en: "Limit the claim first, then state the main point.",
    phrases: [
      {
        cell_id: "8ff7e310-90c4-4557-adee-d273966f5910",
        gurmukhi: "ਮੇਰੇ ਕੋਲ ਜਿੰਨੀ ਜਾਣਕਾਰੀ ਹੈ",
        romanization: "mere kol jinni jaankaari hai",
        vi: "Theo lượng thông tin tôi có.",
        en: "Based on the information I have.",
        register: "workplace",
      },
      {
        cell_id: "92db85cc-474f-46e4-affe-89ab567e1baa",
        gurmukhi: "ਇਹ ਲੱਗਦਾ ਹੈ ਕਿ",
        romanization: "ih laggda hai ki",
        vi: "Có vẻ là...",
        en: "It appears that...",
        register: "formal",
      },
    ],
    model_gurmukhi: "ਮੇਰੇ ਕੋਲ ਜਿੰਨੀ ਜਾਣਕਾਰੀ ਹੈ, ਇਹ ਲੱਗਦਾ ਹੈ ਕਿ ਸਮਾਂ-ਸੂਚੀ ਵਿੱਚ ਥੋੜ੍ਹੀ ਤਬਦੀਲੀ ਲੋੜੀਂਦੀ ਹੈ।",
    model_romanization: "mere kol jinni jaankaari hai, ih laggda hai ki sama-suchi vich thorrhi tabdili lorindi hai.",
    model_vi: "Theo thông tin tôi có, có vẻ lịch trình cần thay đổi một chút.",
    model_en: "Based on the information I have, it appears the schedule needs a small change.",
    learner_trap: {
      trap_vi: "Nói chắc tuyệt đối khi dữ kiện chưa đủ.",
      trap_en: "Sounding fully certain when the evidence is incomplete.",
      safer_vi: "Dùng ਮੇਰੇ ਕੋਲ ਜਿੰਨੀ ਜਾਣਕਾਰੀ ਹੈ để giới hạn phạm vi.",
      safer_en: "Use ਮੇਰੇ ਕੋਲ ਜਿੰਨੀ ਜਾਣਕਾਰੀ ਹੈ to limit the claim.",
    },
  },
  {
    id: "pa_c2_disagree_validate",
    focus: "diplomatic_disagreement",
    title_vi: "Bất đồng sau khi công nhận mối quan ngại",
    title_en: "Disagree after validating the concern",
    context_vi: "Thảo luận cộng đồng hoặc nơi làm việc khi bạn cần phản biện mà không làm mất thể diện.",
    context_en: "Community or workplace discussion where you need to push back without making someone lose face.",
    discourse_move_vi: "Công nhận lý do của người kia, rồi mở thêm góc nhìn.",
    discourse_move_en: "Validate the other person's reason, then open another angle.",
    phrases: [
      {
        cell_id: "9166939e-60f8-401d-9f4c-71f0272e97ce",
        gurmukhi: "ਤੁਹਾਡੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ",
        romanization: "tuhadi chinta vaajab hai",
        vi: "Quan ngại của anh/chị là hợp lý.",
        en: "Your concern is valid.",
        register: "community",
      },
      {
        cell_id: "39e579a2-9cf6-472d-b1ab-57860debc308",
        gurmukhi: "ਫਿਰ ਵੀ ਇੱਕ ਹੋਰ ਪੱਖ ਹੈ",
        romanization: "fir vi ikk hor pakkh hai",
        vi: "Tuy vậy còn một khía cạnh khác.",
        en: "Still, there is another side.",
        register: "formal",
      },
    ],
    model_gurmukhi: "ਤੁਹਾਡੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ; ਫਿਰ ਵੀ ਇੱਕ ਹੋਰ ਪੱਖ ਹੈ ਜਿਸ ਨੂੰ ਅਸੀਂ ਵੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
    model_romanization: "tuhadi chinta vaajab hai; fir vi ikk hor pakkh hai jis nu asin vekhna chahida hai.",
    model_vi: "Quan ngại của anh/chị là hợp lý; tuy vậy còn một khía cạnh khác mà chúng ta nên xem.",
    model_en: "Your concern is valid; still, there is another side we should consider.",
    learner_trap: {
      trap_vi: "Dịch thẳng 'I disagree' thành câu phủ định quá mạnh.",
      trap_en: "Translating 'I disagree' into an overly blunt negative sentence.",
      safer_vi: "Dùng công thức công nhận trước, phản biện sau.",
      safer_en: "Use a validate-first, disagree-second structure.",
    },
  },
  {
    id: "pa_c2_repair_misunderstanding",
    focus: "misunderstanding_repair",
    title_vi: "Sửa hiểu lầm mà không đổ lỗi",
    title_en: "Repair misunderstanding without blame",
    context_vi: "Khi lời bạn bị hiểu khác ý, nhất là trong email hoặc cuộc họp.",
    context_en: "When your point was understood differently, especially in email or meetings.",
    discourse_move_vi: "Nhận phần chưa rõ thuộc về cách diễn đạt của mình, rồi nói lại.",
    discourse_move_en: "Treat the unclear part as wording you can repair, then restate.",
    phrases: [
      {
        cell_id: "874fefd1-525e-4a48-8de9-54a53b9c7fb9",
        gurmukhi: "ਸ਼ਾਇਦ ਮੇਰੀ ਗੱਲ ਸਪਸ਼ਟ ਨਹੀਂ ਸੀ",
        romanization: "shayad meri gall spasht nahin si",
        vi: "Có lẽ lời tôi chưa rõ.",
        en: "Perhaps my point was not clear.",
        register: "workplace",
      },
      {
        cell_id: "51ddaf1e-355a-48e2-8594-a777cd7f44d7",
        gurmukhi: "ਮੇਰਾ ਮਤਲਬ ਇਹ ਸੀ ਕਿ",
        romanization: "mera matlab ih si ki",
        vi: "Ý tôi là...",
        en: "What I meant was...",
        register: "formal",
      },
    ],
    model_gurmukhi: "ਸ਼ਾਇਦ ਮੇਰੀ ਗੱਲ ਸਪਸ਼ਟ ਨਹੀਂ ਸੀ। ਮੇਰਾ ਮਤਲਬ ਇਹ ਸੀ ਕਿ ਮਿਆਦ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਸਭ ਨਾਲ ਸਲਾਹ ਕਰੀਏ।",
    model_romanization: "shayad meri gall spasht nahin si. mera matlab ih si ki miaad badlan ton pehlan sabh naal salaah kariye.",
    model_vi: "Có lẽ lời tôi chưa rõ. Ý tôi là trước khi đổi hạn, chúng ta nên hỏi ý kiến mọi người.",
    model_en: "Perhaps my point was not clear. I meant that before changing the deadline, we should consult everyone.",
    learner_trap: {
      trap_vi: "Nói 'anh/chị hiểu sai rồi', làm người nghe mất mặt.",
      trap_en: "Saying 'you misunderstood', which can embarrass the listener.",
      safer_vi: "Nói ਮੇਰੀ ਗੱਲ ਸਪਸ਼ਟ ਨਹੀਂ ਸੀ để tự nhận phần diễn đạt.",
      safer_en: "Say ਮੇਰੀ ਗੱਲ ਸਪਸ਼ਟ ਨਹੀਂ ਸੀ to own the wording issue.",
    },
  },
  {
    id: "pa_c2_sensitive_topic_boundary",
    focus: "sensitive_topics",
    title_vi: "Đặt ranh giới khi chủ đề nhạy cảm",
    title_en: "Set boundaries around sensitive topics",
    context_vi: "Khi cuộc trò chuyện đi vào tôn giáo, chính trị, gia đình, tiền bạc, hoặc danh tính cá nhân.",
    context_en: "When a conversation moves into religion, politics, family, money, or personal identity.",
    discourse_move_vi: "Công nhận độ nhạy cảm, rồi xin chuyển về phần liên quan đến nhiệm vụ.",
    discourse_move_en: "Acknowledge sensitivity, then return to the task-relevant part.",
    phrases: [
      {
        cell_id: "eb787b9b-6ff1-4b39-96e3-8f46bc2c713f",
        gurmukhi: "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ",
        romanization: "ih visha sanvedansheel hai",
        vi: "Chủ đề này nhạy cảm.",
        en: "This topic is sensitive.",
        register: "formal",
      },
      {
        cell_id: "eb6e4b87-f4a1-4317-937b-e8a9ff33d948",
        gurmukhi: "ਆਓ ਕੰਮ ਵਾਲੇ ਹਿੱਸੇ ਤੇ ਧਿਆਨ ਦੇਈਏ",
        romanization: "aao kamm wale hisse te dhiaan deie",
        vi: "Ta hãy tập trung vào phần công việc.",
        en: "Let's focus on the work-related part.",
        register: "workplace",
      },
    ],
    model_gurmukhi: "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ, ਇਸ ਲਈ ਆਓ ਕੰਮ ਵਾਲੇ ਹਿੱਸੇ ਤੇ ਧਿਆਨ ਦੇਈਏ।",
    model_romanization: "ih visha sanvedansheel hai, is lai aao kamm wale hisse te dhiaan deie.",
    model_vi: "Chủ đề này nhạy cảm, vì vậy ta hãy tập trung vào phần công việc.",
    model_en: "This topic is sensitive, so let's focus on the work-related part.",
    learner_trap: {
      trap_vi: "Cố tranh luận sâu khi mục tiêu chỉ là hoàn tất việc chung.",
      trap_en: "Debating deeply when the goal is only to complete shared work.",
      safer_vi: "Đặt ranh giới ngắn, không phán xét.",
      safer_en: "Set a short boundary without judging.",
    },
  },
  {
    id: "pa_c2_formal_warm_canada_service",
    focus: "formal_warm_tone",
    title_vi: "Trang trọng nhưng ấm trong bối cảnh Canada",
    title_en: "Formal but warm in a Canada context",
    context_vi: "Email cho trường học, nơi làm việc, hoặc dịch vụ cộng đồng ở Canada.",
    context_en: "Email to a school, workplace, or community service in Canada.",
    discourse_move_vi: "Mở lịch sự, nêu mục đích rõ, kết bằng lời cảm ơn.",
    discourse_move_en: "Open politely, state the purpose clearly, close with thanks.",
    phrases: [
      {
        cell_id: "bd07548d-e379-4edf-9c18-be84d84cdf1c",
        gurmukhi: "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade same lai dhannvaad",
        vi: "Cảm ơn vì thời gian của anh/chị.",
        en: "Thank you for your time.",
        register: "formal",
      },
      {
        cell_id: "766e5593-bfab-4195-8396-a6ef3df87b23",
        gurmukhi: "ਜੇ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੋਵੇ",
        romanization: "je hor jaankaari chahidi hove",
        vi: "Nếu cần thêm thông tin.",
        en: "If more information is needed.",
        register: "workplace",
      },
    ],
    model_gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਕਲਾਸ ਦੇ ਸਮੇਂ ਬਾਰੇ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ। ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ।",
    model_romanization: "sat sri akaal ji, main Canada vich class de same bare puchhna chahunda/chahundi haan. tuhade same lai dhannvaad.",
    model_vi: "Xin chào, tôi muốn hỏi về giờ học ở Canada. Cảm ơn anh/chị vì thời gian.",
    model_en: "Hello, I would like to ask about class times in Canada. Thank you for your time.",
    canada_practical: true,
  },
  {
    id: "pa_c2_story_transition",
    focus: "storytelling_transitions",
    title_vi: "Chuyển đoạn khi kể chuyện",
    title_en: "Transitions in storytelling",
    context_vi: "Khi kể một trải nghiệm phức tạp và cần giữ người nghe theo mạch.",
    context_en: "When telling a complex experience and keeping the listener oriented.",
    discourse_move_vi: "Đánh dấu bối cảnh, bước ngoặt, rồi ý nghĩa.",
    discourse_move_en: "Mark the setting, turning point, then meaning.",
    phrases: [
      {
        cell_id: "584d6769-6e06-4fa1-b32e-c14219337c5d",
        gurmukhi: "ਉਸ ਵੇਲੇ ਗੱਲ ਇਹ ਸੀ ਕਿ",
        romanization: "us vele gall ih si ki",
        vi: "Lúc đó vấn đề là...",
        en: "At that time, the thing was...",
        register: "warm",
      },
      {
        cell_id: "738a0b39-e1bd-470d-888f-b26f3f1c68ff",
        gurmukhi: "ਇਥੋਂ ਗੱਲ ਬਦਲੀ",
        romanization: "ithon gall badli",
        vi: "Từ đây câu chuyện đổi hướng.",
        en: "This is where things changed.",
        register: "warm",
      },
    ],
    model_gurmukhi: "ਉਸ ਵੇਲੇ ਗੱਲ ਇਹ ਸੀ ਕਿ ਸਾਨੂੰ ਰਸਤਾ ਨਹੀਂ ਪਤਾ ਸੀ। ਇਥੋਂ ਗੱਲ ਬਦਲੀ, ਕਿਉਂਕਿ ਇੱਕ ਪਰਿਵਾਰ ਨੇ ਮਦਦ ਕੀਤੀ।",
    model_romanization: "us vele gall ih si ki sanu rasta nahin pata si. ithon gall badli, kyonki ikk parivaar ne madad kiti.",
    model_vi: "Lúc đó vấn đề là chúng tôi không biết đường. Từ đây câu chuyện đổi hướng, vì một gia đình đã giúp.",
    model_en: "At that time, the issue was that we did not know the way. This is where things changed, because a family helped.",
  },
  {
    id: "pa_c2_persuasive_sequence",
    focus: "persuasive_sequence",
    title_vi: "Chuỗi thuyết phục: vấn đề, lý do, bước tiếp",
    title_en: "Persuasive sequence: issue, reason, next step",
    context_vi: "Khi đề xuất thay đổi trong nhóm, hội phụ huynh, nơi làm việc, hoặc cộng đồng.",
    context_en: "When proposing change in a team, parent group, workplace, or community.",
    discourse_move_vi: "Nêu vấn đề không đổ lỗi, đưa lý do, rồi đề xuất bước nhỏ.",
    discourse_move_en: "Name the issue without blame, give a reason, then propose a small next step.",
    phrases: [
      {
        cell_id: "ec303784-f67f-44ea-b208-fbc5c0e6f1d5",
        gurmukhi: "ਮੁੱਦਾ ਇਹ ਹੈ ਕਿ",
        romanization: "mudda ih hai ki",
        vi: "Vấn đề là...",
        en: "The issue is that...",
        register: "formal",
      },
      {
        cell_id: "a206e584-7dba-4c42-9bd0-842aaff6b93f",
        gurmukhi: "ਪਹਿਲਾ ਕਦਮ ਇਹ ਹੋ ਸਕਦਾ ਹੈ",
        romanization: "pehla kadam ih ho sakda hai",
        vi: "Bước đầu có thể là...",
        en: "The first step could be...",
        register: "formal",
      },
    ],
    model_gurmukhi: "ਮੁੱਦਾ ਇਹ ਹੈ ਕਿ ਜਾਣਕਾਰੀ ਦੇਰ ਨਾਲ ਮਿਲਦੀ ਹੈ। ਪਹਿਲਾ ਕਦਮ ਇਹ ਹੋ ਸਕਦਾ ਹੈ ਕਿ ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਛੋਟਾ ਅੱਪਡੇਟ ਭੇਜਿਆ ਜਾਵੇ।",
    model_romanization: "mudda ih hai ki jaankaari der naal mildi hai. pehla kadam ih ho sakda hai ki hafte vich ikk chhota update bhejia jaave.",
    model_vi: "Vấn đề là thông tin đến muộn. Bước đầu có thể là gửi một cập nhật ngắn mỗi tuần.",
    model_en: "The issue is that information arrives late. The first step could be sending a short weekly update.",
    learner_trap: {
      trap_vi: "Đề xuất thay đổi bằng lời trách móc.",
      trap_en: "Proposing change through blame.",
      safer_vi: "Nêu vấn đề hệ thống rồi đề xuất bước nhỏ.",
      safer_en: "Name the system issue and propose a small step.",
    },
  },
  {
    id: "pa_c2_public_community_notice",
    focus: "public_community_register",
    title_vi: "Thông báo cộng đồng trang trọng",
    title_en: "Formal community announcement",
    context_vi: "Thông báo cho sự kiện cộng đồng, nhóm học, hoặc tổ chức địa phương.",
    context_en: "Announcement for a community event, study group, or local organization.",
    discourse_move_vi: "Chào tập thể, nêu thay đổi, cảm ơn sự hợp tác.",
    discourse_move_en: "Address the group, state the change, thank people for cooperation.",
    phrases: [
      {
        cell_id: "a384de71-502f-46ec-8d75-c311db5de33d",
        gurmukhi: "ਸਭ ਮੈਂਬਰਾਂ ਨੂੰ ਸੂਚਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ",
        romanization: "sabh memberan nu suchit kita jaanda hai",
        vi: "Xin thông báo đến tất cả thành viên.",
        en: "All members are hereby informed.",
        register: "public",
      },
      {
        cell_id: "2a64b7ac-4272-4c57-b46f-085a34c77227",
        gurmukhi: "ਤੁਹਾਡੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade sahiyog lai dhannvaad",
        vi: "Cảm ơn sự hợp tác của anh/chị/mọi người.",
        en: "Thank you for your cooperation.",
        register: "community",
      },
    ],
    model_gurmukhi: "ਸਭ ਮੈਂਬਰਾਂ ਨੂੰ ਸੂਚਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਕਿ ਮੀਟਿੰਗ ਐਤਵਾਰ ਦੀ ਥਾਂ ਸੋਮਵਾਰ ਨੂੰ ਹੋਵੇਗੀ। ਤੁਹਾਡੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ।",
    model_romanization: "sabh memberan nu suchit kita jaanda hai ki meeting aitvaar di thaan somvaar nu hovegi. tuhade sahiyog lai dhannvaad.",
    model_vi: "Xin thông báo đến tất cả thành viên rằng cuộc họp sẽ diễn ra vào thứ Hai thay vì Chủ nhật. Cảm ơn sự hợp tác của mọi người.",
    model_en: "All members are informed that the meeting will be on Monday instead of Sunday. Thank you for your cooperation.",
  },
  {
    id: "pa_c2_public_repair_canada",
    focus: "public_community_register",
    title_vi: "Sửa thông báo công khai sau nhầm lẫn",
    title_en: "Public correction after a mistake",
    context_vi: "Khi một nhóm cộng đồng ở Canada cần sửa thông tin sai về thời gian, địa điểm, hoặc giấy tờ.",
    context_en: "When a community group in Canada needs to correct wrong information about time, place, or documents.",
    discourse_move_vi: "Nhận thiếu sót, đưa thông tin đúng, xin lỗi vì bất tiện.",
    discourse_move_en: "Acknowledge the error, give the correct information, apologize for inconvenience.",
    phrases: [
      {
        cell_id: "0a727a5d-6e16-4e0f-a429-1c969d504519",
        gurmukhi: "ਪਿਛਲੇ ਸੁਨੇਹੇ ਵਿੱਚ ਗਲਤੀ ਰਹਿ ਗਈ ਸੀ",
        romanization: "pichhle sunehe vich galti rahi gayi si",
        vi: "Tin nhắn trước có thiếu sót/lỗi.",
        en: "There was an error in the previous message.",
        register: "public",
      },
      {
        cell_id: "7db67485-cf54-42f7-a84c-a436d8687266",
        gurmukhi: "ਅਸੁਵਿਧਾ ਲਈ ਮਾਫ਼ ਕਰਨਾ",
        romanization: "asuvidha lai maaf karna",
        vi: "Xin lỗi vì bất tiện.",
        en: "Sorry for the inconvenience.",
        register: "formal",
      },
    ],
    model_gurmukhi: "ਪਿਛਲੇ ਸੁਨੇਹੇ ਵਿੱਚ ਗਲਤੀ ਰਹਿ ਗਈ ਸੀ। ਕੈਨੇਡਾ ਵਾਲੀ ਵਰਕਸ਼ਾਪ ਦਾ ਸਹੀ ਸਮਾਂ ਸ਼ਾਮ 6 ਵਜੇ ਹੈ। ਅਸੁਵਿਧਾ ਲਈ ਮਾਫ਼ ਕਰਨਾ।",
    model_romanization: "pichhle sunehe vich galti rahi gayi si. Canada wali workshop da sahi sama shaam 6 vaje hai. asuvidha lai maaf karna.",
    model_vi: "Tin nhắn trước có lỗi. Thời gian đúng của buổi workshop ở Canada là 6 giờ tối. Xin lỗi vì bất tiện.",
    model_en: "There was an error in the previous message. The correct time for the Canada workshop is 6 p.m. Sorry for the inconvenience.",
    canada_practical: true,
  },
];

export const discourseNuanceByFocus = (
  focus: PunjabiC2NuanceFocus,
): PunjabiC2NuanceEntry[] => discourseNuanceC2Entries.filter((entry) => entry.focus === focus);
