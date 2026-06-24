// Punjabi C2 capstone tasks for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support language tasks, not native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2CapstoneFocus =
  | "nuanced_disagreement"
  | "negotiation"
  | "deescalation"
  | "sensitive_topic_framing"
  | "advanced_register"
  | "community_discourse"
  | "public_discourse"
  | "professional_discourse";

export type PunjabiC2CapstoneMode = "speaking" | "writing" | "mediation" | "checkpoint";

export type PunjabiC2CapstonePhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2CapstoneCheckpoint = {
  skill_vi: string;
  skill_en: string;
  success_vi: string;
  success_en: string;
};

export type PunjabiC2CapstoneTrap = {
  trap_vi: string;
  trap_en: string;
  better_vi: string;
  better_en: string;
};

export type PunjabiC2CapstoneTask = {
  id: string;
  focus: PunjabiC2CapstoneFocus;
  mode: PunjabiC2CapstoneMode;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  task_vi: string;
  task_en: string;
  useful_phrases: PunjabiC2CapstonePhrase[];
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  checkpoints: PunjabiC2CapstoneCheckpoint[];
  learner_trap?: PunjabiC2CapstoneTrap;
  canada_practical?: boolean;
};

export const C2_CAPSTONE_TASKS_DISCLAIMER = {
  vi: "Nhiệm vụ tổng hợp Punjabi C2 này chỉ hỗ trợ học tập. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ, không phải khóa học đầy đủ.",
  en: "These C2 Punjabi capstone tasks are for study support only. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness, not taught as a full course.",
} as const;

export const capstoneTasksC2: PunjabiC2CapstoneTask[] = [
  {
    id: "pa_c2_capstone_disagreement_meeting",
    focus: "nuanced_disagreement",
    mode: "speaking",
    title_vi: "Bất đồng tinh tế trong cuộc họp",
    title_en: "Nuanced disagreement in a meeting",
    scenario_vi: "Một đề xuất có mục tiêu tốt nhưng thời hạn quá gấp.",
    scenario_en: "A proposal has a good goal but an unrealistic deadline.",
    task_vi: "Công nhận mục tiêu, nêu lo ngại về thời hạn, và đề xuất xem lại lịch.",
    task_en: "Acknowledge the goal, raise concern about timing, and propose reviewing the schedule.",
    useful_phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ",
        romanization: "maqsad naal main sahimat haan",
        vi: "Tôi đồng ý với mục tiêu.",
        en: "I agree with the goal.",
      },
      {
        gurmukhi: "ਮੇਰੀ ਚਿੰਤਾ ਸਮੇਂ ਬਾਰੇ ਹੈ",
        romanization: "meri chinta same bare hai",
        vi: "Điều tôi lo là về thời gian.",
        en: "My concern is about timing.",
      },
    ],
    model_gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਮੇਰੀ ਚਿੰਤਾ ਸਮੇਂ ਬਾਰੇ ਹੈ। ਕੀ ਅਸੀਂ ਮਿਆਦ ਨੂੰ ਮੁੜ ਵੇਖ ਸਕਦੇ ਹਾਂ?",
    model_romanization: "maqsad naal main sahimat haan, par meri chinta same bare hai. ki asin miaad nu mur vekh sakde haan?",
    model_vi: "Tôi đồng ý với mục tiêu, nhưng điều tôi lo là thời gian. Chúng ta có thể xem lại hạn không?",
    model_en: "I agree with the goal, but my concern is timing. Could we review the deadline?",
    checkpoints: [
      {
        skill_vi: "Công nhận trước khi phản biện.",
        skill_en: "Validate before disagreeing.",
        success_vi: "Người nghe thấy mục tiêu được tôn trọng.",
        success_en: "The listener hears that the goal is respected.",
      },
      {
        skill_vi: "Nêu lo ngại cụ thể.",
        skill_en: "Name a specific concern.",
        success_vi: "Vấn đề là thời hạn, không phải con người.",
        success_en: "The issue is timing, not the person.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói ngay 'không được' làm mất sắc thái.",
      trap_en: "Opening with 'this will not work' loses nuance.",
      better_vi: "Bắt đầu từ mục tiêu chung rồi giới hạn bằng ਪਰ.",
      better_en: "Start with the shared goal, then limit with ਪਰ.",
    },
  },
  {
    id: "pa_c2_capstone_negotiation_canada_docs",
    focus: "negotiation",
    mode: "mediation",
    title_vi: "Đàm phán lựa chọn giấy tờ ở Canada",
    title_en: "Negotiating document options in Canada",
    scenario_vi: "Bạn thiếu bản gốc giấy tờ cho dịch vụ công ở Canada nhưng có bản sao.",
    scenario_en: "You lack an original document for a Canadian public service but have a copy.",
    task_vi: "Thừa nhận yêu cầu, giải thích tình huống, và hỏi lựa chọn thay thế.",
    task_en: "Acknowledge the requirement, explain the situation, and ask about alternatives.",
    useful_phrases: [
      {
        gurmukhi: "ਮੈਨੂੰ ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ ਦੀ ਸਮਝ ਹੈ",
        romanization: "mainu lorinde dastavez di samajh hai",
        vi: "Tôi hiểu giấy tờ cần thiết.",
        en: "I understand the required document.",
      },
      {
        gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੋ ਸਕਦਾ ਹੈ?",
        romanization: "ki koi hor vikalp ho sakda hai?",
        vi: "Có lựa chọn thay thế nào không?",
        en: "Could there be another option?",
      },
    ],
    model_gurmukhi: "ਮੈਨੂੰ ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੈ; ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੋ ਸਕਦਾ ਹੈ?",
    model_romanization: "mainu lorinde dastavez di samajh hai. is vele mere kol copy hai; ki koi hor vikalp ho sakda hai?",
    model_vi: "Tôi hiểu giấy tờ cần thiết. Hiện tại tôi có bản sao; có lựa chọn thay thế nào không?",
    model_en: "I understand the required document. Right now I have a copy; could there be another option?",
    checkpoints: [
      {
        skill_vi: "Không phủ nhận quy định.",
        skill_en: "Do not dismiss the requirement.",
        success_vi: "Câu mở đầu cho thấy bạn hiểu yêu cầu.",
        success_en: "The opening shows you understand the requirement.",
      },
      {
        skill_vi: "Hỏi lựa chọn thay thế.",
        skill_en: "Ask for alternatives.",
        success_vi: "Cuộc trao đổi vẫn tiếp tục thay vì bế tắc.",
        success_en: "The exchange continues instead of stopping.",
      },
    ],
    canada_practical: true,
    learner_trap: {
      trap_vi: "Chỉ nói 'tôi không có' rồi dừng lại.",
      trap_en: "Only saying 'I do not have it' and stopping.",
      better_vi: "Hỏi về ਵਿਕਲਪ một cách lịch sự.",
      better_en: "Ask politely about ਵਿਕਲਪ.",
    },
  },
  {
    id: "pa_c2_capstone_deescalation_group",
    focus: "deescalation",
    mode: "speaking",
    title_vi: "Hạ nhiệt thảo luận nhóm",
    title_en: "De-escalating a group discussion",
    scenario_vi: "Hai người nói chồng lên nhau trong cuộc họp cộng đồng.",
    scenario_en: "Two people are speaking over each other in a community meeting.",
    task_vi: "Đề xuất nghe từng ý một và nhắc mục tiêu chung là tìm giải pháp.",
    task_en: "Suggest hearing one point at a time and remind the group that the shared goal is finding a solution.",
    useful_phrases: [
      {
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ",
        romanization: "maqsad hall labhna hai",
        vi: "Mục tiêu là tìm giải pháp.",
        en: "The goal is to find a solution.",
      },
    ],
    model_gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਸਭ ਨੂੰ ਬਾਰੀ-ਬਾਰੀ ਸੁਣਨਾ ਜ਼ਰੂਰੀ ਹੈ।",
    model_romanization: "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai sabh nu baari-baari sunna zaruri hai.",
    model_vi: "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy cần nghe mọi người lần lượt.",
    model_en: "Let's hear one point at a time. The goal is to find a solution, so it is important to hear everyone in turn.",
    checkpoints: [
      {
        skill_vi: "Đề xuất quy trình, không phán xét cảm xúc.",
        skill_en: "Suggest process, not emotional judgment.",
        success_vi: "Không dùng câu như 'bình tĩnh đi'.",
        success_en: "Avoids phrases like 'calm down'.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói thẳng 'đừng cãi nhau' làm tăng căng thẳng.",
      trap_en: "Saying 'stop arguing' may increase tension.",
      better_vi: "Đề xuất nghe từng lượt.",
      better_en: "Suggest turn-taking.",
    },
  },
  {
    id: "pa_c2_capstone_sensitive_topic",
    focus: "sensitive_topic_framing",
    mode: "writing",
    title_vi: "Đóng khung chủ đề nhạy cảm",
    title_en: "Framing a sensitive topic",
    scenario_vi: "Bạn cần gửi tin nhắn về phân công vai trò trong nhóm cộng đồng.",
    scenario_en: "You need to send a message about assigning roles in a community group.",
    task_vi: "Tránh giả định vai trò theo tuổi, giới, hoặc gia đình; mời mọi người chọn theo khả năng.",
    task_en: "Avoid assigning roles by age, gender, or family assumptions; invite people to choose by capacity.",
    useful_phrases: [
      {
        gurmukhi: "ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ",
        romanization: "ruchi ate same de anusaar",
        vi: "Theo sở thích và thời gian.",
        en: "According to interest and availability.",
      },
      {
        gurmukhi: "ਕੌਣ ਸੁਵਿਧਾ ਮਹਿਸੂਸ ਕਰਦਾ ਹੈ?",
        romanization: "kaun suvidha mahisus karda hai?",
        vi: "Ai cảm thấy tiện/thoải mái?",
        en: "Who feels comfortable?",
      },
    ],
    model_gurmukhi: "ਅਸੀਂ ਕੰਮ ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ। ਕੌਣ ਇਸ ਹਿੱਸੇ ਲਈ ਸੁਵਿਧਾ ਮਹਿਸੂਸ ਕਰਦਾ ਹੈ?",
    model_romanization: "asin kamm ruchi ate same de anusaar vand sakde haan. kaun is hisse lai suvidha mahisus karda hai?",
    model_vi: "Chúng ta có thể chia việc theo sở thích và thời gian. Ai cảm thấy thuận tiện với phần này?",
    model_en: "We can divide the work according to interest and availability. Who feels comfortable with this part?",
    checkpoints: [
      {
        skill_vi: "Không gán vai theo định kiến.",
        skill_en: "Avoid stereotype-based role assignment.",
        success_vi: "Câu hỏi mở cho mọi người tự chọn.",
        success_en: "The open question lets people self-select.",
      },
    ],
  },
  {
    id: "pa_c2_capstone_advanced_register_email",
    focus: "advanced_register",
    mode: "writing",
    title_vi: "Email trang trọng nhưng ấm",
    title_en: "Formal but warm email",
    scenario_vi: "Bạn viết cho trường hoặc chương trình cộng đồng ở Canada để hỏi bước tiếp theo.",
    scenario_en: "You write to a Canadian school or community program to ask about the next step.",
    task_vi: "Mở lịch sự, nêu mục đích, hỏi bước tiếp theo, và cảm ơn.",
    task_en: "Open politely, state the purpose, ask for the next step, and thank them.",
    useful_phrases: [
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੋਵੇਗਾ?",
        romanization: "agla kadam ki hovega?",
        vi: "Bước tiếp theo là gì?",
        en: "What would the next step be?",
      },
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade same lai dhannvaad",
        vi: "Cảm ơn vì thời gian của anh/chị.",
        en: "Thank you for your time.",
      },
    ],
    model_gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਪ੍ਰੋਗਰਾਮ ਬਾਰੇ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਅਗਲਾ ਕਦਮ ਕੀ ਹੋਵੇਗਾ? ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ।",
    model_romanization: "sat sri akaal ji, main Canada vich program bare puchhna chahunda/chahundi haan. kirpa karke dasso, agla kadam ki hovega? tuhade same lai dhannvaad.",
    model_vi: "Xin chào, tôi muốn hỏi về chương trình ở Canada. Xin vui lòng cho biết bước tiếp theo là gì. Cảm ơn anh/chị vì thời gian.",
    model_en: "Hello, I would like to ask about the program in Canada. Please let me know what the next step would be. Thank you for your time.",
    checkpoints: [
      {
        skill_vi: "Giữ trang trọng nhưng không lạnh.",
        skill_en: "Keep it formal but not cold.",
        success_vi: "Có lời chào, mục đích rõ, và cảm ơn.",
        success_en: "Includes greeting, clear purpose, and thanks.",
      },
    ],
    canada_practical: true,
  },
  {
    id: "pa_c2_capstone_community_closing",
    focus: "community_discourse",
    mode: "speaking",
    title_vi: "Kết lời cộng đồng",
    title_en: "Community closing",
    scenario_vi: "Bạn kết thúc một buổi họp cộng đồng có nhiều quan điểm.",
    scenario_en: "You close a community meeting with several viewpoints.",
    task_vi: "Cảm ơn mọi người, công nhận khác biệt, và nêu bước tiếp theo.",
    task_en: "Thank everyone, acknowledge difference, and state the next step.",
    useful_phrases: [
      {
        gurmukhi: "ਸਭ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ",
        romanization: "sabh de sahiyog lai dhannvaad",
        vi: "Cảm ơn sự hợp tác của mọi người.",
        en: "Thank you for everyone's cooperation.",
      },
      {
        gurmukhi: "ਵੱਖ-ਵੱਖ ਵਿਚਾਰਾਂ ਦੇ ਬਾਵਜੂਦ",
        romanization: "vakh-vakh vicharan de bavjud",
        vi: "Dù có nhiều ý kiến khác nhau.",
        en: "Despite different views.",
      },
    ],
    model_gurmukhi: "ਸਭ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਵੱਖ-ਵੱਖ ਵਿਚਾਰਾਂ ਦੇ ਬਾਵਜੂਦ, ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰਨਾ ਲਾਭਦਾਇਕ ਰਹੇਗਾ।",
    model_romanization: "sabh de sahiyog lai dhannvaad. vakh-vakh vicharan de bavjud, agla kadam spasht karna laabhdaik rahega.",
    model_vi: "Cảm ơn sự hợp tác của mọi người. Dù có nhiều ý kiến khác nhau, làm rõ bước tiếp theo sẽ hữu ích.",
    model_en: "Thank you for everyone's cooperation. Despite different views, clarifying the next step will be useful.",
    checkpoints: [
      {
        skill_vi: "Không xóa bỏ bất đồng.",
        skill_en: "Do not erase disagreement.",
        success_vi: "Câu kết thừa nhận khác biệt và vẫn hướng tới bước tiếp theo.",
        success_en: "The closing acknowledges difference and still moves to the next step.",
      },
    ],
  },
  {
    id: "pa_c2_capstone_public_notice",
    focus: "public_discourse",
    mode: "writing",
    title_vi: "Thông báo công khai sửa thông tin",
    title_en: "Public correction notice",
    scenario_vi: "Thông báo trước về thời gian sự kiện có lỗi.",
    scenario_en: "A previous event-time notice had an error.",
    task_vi: "Nhận lỗi ngắn, đưa thông tin đúng, và xin lỗi vì bất tiện.",
    task_en: "Briefly acknowledge the error, give correct information, and apologize for inconvenience.",
    useful_phrases: [
      {
        gurmukhi: "ਪਿਛਲੇ ਸੁਨੇਹੇ ਵਿੱਚ ਗਲਤੀ ਰਹਿ ਗਈ ਸੀ",
        romanization: "pichhle sunehe vich galti rahi gayi si",
        vi: "Tin nhắn trước có lỗi.",
        en: "There was an error in the previous message.",
      },
      {
        gurmukhi: "ਅਸੁਵਿਧਾ ਲਈ ਮਾਫ਼ ਕਰਨਾ",
        romanization: "asuvidha lai maaf karna",
        vi: "Xin lỗi vì bất tiện.",
        en: "Sorry for the inconvenience.",
      },
    ],
    model_gurmukhi: "ਪਿਛਲੇ ਸੁਨੇਹੇ ਵਿੱਚ ਗਲਤੀ ਰਹਿ ਗਈ ਸੀ। ਸਹੀ ਸਮਾਂ ਸ਼ਾਮ 6 ਵਜੇ ਹੈ। ਅਸੁਵਿਧਾ ਲਈ ਮਾਫ਼ ਕਰਨਾ।",
    model_romanization: "pichhle sunehe vich galti rahi gayi si. sahi sama shaam 6 vaje hai. asuvidha lai maaf karna.",
    model_vi: "Tin nhắn trước có lỗi. Thời gian đúng là 6 giờ tối. Xin lỗi vì bất tiện.",
    model_en: "There was an error in the previous message. The correct time is 6 p.m. Sorry for the inconvenience.",
    checkpoints: [
      {
        skill_vi: "Sửa rõ, không đổ lỗi.",
        skill_en: "Correct clearly without blame.",
        success_vi: "Người đọc thấy ngay thông tin đúng.",
        success_en: "Readers can immediately see the correct information.",
      },
    ],
  },
  {
    id: "pa_c2_capstone_professional_feedback",
    focus: "professional_discourse",
    mode: "checkpoint",
    title_vi: "Góp ý chuyên nghiệp ở C2",
    title_en: "C2 professional feedback",
    scenario_vi: "Bạn cần góp ý một đoạn văn chưa rõ.",
    scenario_en: "You need to give feedback on a paragraph that is not clear.",
    task_vi: "Nói theo tiêu chí người đọc, tránh phán xét người viết.",
    task_en: "Speak in terms of reader criteria, avoiding judgment of the writer.",
    useful_phrases: [
      {
        gurmukhi: "ਪਾਠਕ ਲਈ",
        romanization: "paathak lai",
        vi: "Đối với người đọc.",
        en: "For the reader.",
      },
      {
        gurmukhi: "ਇਸ ਹਿੱਸੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ",
        romanization: "is hisse nu hor spasht kita ja sakda hai",
        vi: "Phần này có thể được làm rõ hơn.",
        en: "This part could be made clearer.",
      },
    ],
    model_gurmukhi: "ਪਾਠਕ ਲਈ ਇਸ ਹਿੱਸੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ, ਖ਼ਾਸ ਕਰਕੇ ਮੁੱਖ ਕਾਰਨ ਅਤੇ ਨਤੀਜੇ ਦੇ ਵਿਚਕਾਰ ਸੰਬੰਧ।",
    model_romanization: "paathak lai is hisse nu hor spasht kita ja sakda hai, khaas karke mukh kaaran ate natije de vichkar sambandh.",
    model_vi: "Đối với người đọc, phần này có thể được làm rõ hơn, đặc biệt là quan hệ giữa lý do chính và kết quả.",
    model_en: "For the reader, this part could be made clearer, especially the link between the main reason and the result.",
    checkpoints: [
      {
        skill_vi: "Góp ý vào văn bản, không vào người.",
        skill_en: "Comment on the text, not the person.",
        success_vi: "Câu nêu tiêu chí rõ ràng.",
        success_en: "The sentence names a clear criterion.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'bạn viết sai' khi vấn đề là độ rõ.",
      trap_en: "Saying 'you wrote it wrong' when the issue is clarity.",
      better_vi: "Nói 'đối với người đọc...' để chuyển sang tiêu chí.",
      better_en: "Use 'for the reader...' to shift to criteria.",
    },
  },
  {
    id: "pa_c2_capstone_script_scope",
    focus: "public_discourse",
    mode: "checkpoint",
    title_vi: "Checkpoint phạm vi hệ chữ",
    title_en: "Script-scope checkpoint",
    scenario_vi: "Bạn giải thích phạm vi khóa học trước lớp.",
    scenario_en: "You explain course scope to a class.",
    task_vi: "Nói Gurmukhi là chính và Shahmukhi chỉ để nhận biết, không so sánh hơn/kém.",
    task_en: "Say Gurmukhi is primary and Shahmukhi is awareness only, without ranking scripts.",
    useful_phrases: [
      {
        gurmukhi: "ਗੁਰਮੁਖੀ ਮੁੱਖ ਲਿਪੀ ਹੈ",
        romanization: "Gurmukhi mukh lipi hai",
        vi: "Gurmukhi là hệ chữ chính.",
        en: "Gurmukhi is the primary script.",
      },
      {
        gurmukhi: "ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ",
        romanization: "Shahmukhi sirf jaankaari lai",
        vi: "Shahmukhi chỉ để nhận biết.",
        en: "Shahmukhi is for awareness only.",
      },
    ],
    model_gurmukhi: "ਇਸ ਕੋਰਸ ਵਿੱਚ ਗੁਰਮੁਖੀ ਮੁੱਖ ਲਿਪੀ ਹੈ; ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਿਕਰ ਹੈ, ਪੂਰੇ ਕੋਰਸ ਵਾਂਗ ਨਹੀਂ।",
    model_romanization: "is course vich Gurmukhi mukh lipi hai; Shahmukhi sirf jaankaari lai zikar hai, pure course vaang nahin.",
    model_vi: "Trong khóa này Gurmukhi là hệ chữ chính; Shahmukhi chỉ được nhắc để nhận biết, không phải như một khóa đầy đủ.",
    model_en: "In this course Gurmukhi is the primary script; Shahmukhi is mentioned only for awareness, not as a full course.",
    checkpoints: [
      {
        skill_vi: "Nêu phạm vi, không đánh giá hệ chữ.",
        skill_en: "State scope, do not evaluate scripts.",
        success_vi: "Có awareness nhưng không biến thành khóa Shahmukhi.",
        success_en: "Includes awareness without turning into a Shahmukhi course.",
      },
    ],
  },
];

export const capstoneTasksC2ByFocus = (focus: PunjabiC2CapstoneFocus): PunjabiC2CapstoneTask[] =>
  capstoneTasksC2.filter((task) => task.focus === focus);
