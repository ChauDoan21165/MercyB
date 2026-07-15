// Punjabi C2 pragmatic strategy pack for Vietnamese- and English-speaking
// learners. Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support material, not native-reviewed authority. Native
// review is deferred. Shahmukhi is mentioned only for script awareness, not as
// a full course.

export type PunjabiPragmaticStrategyFocus =
  | "indirectness"
  | "face_saving"
  | "strategic_warmth"
  | "respectful_disagreement"
  | "changing_topic"
  | "calming_conflict"
  | "formal_public_communication"
  | "community_communication";

export type PunjabiPragmaticStrategySetting =
  | "family"
  | "community"
  | "workplace"
  | "public_notice"
  | "canada_service"
  | "education";

export type PunjabiPragmaticPhrase = {
  cell_id?: string;
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiPragmaticTrap = {
  trap_vi: string;
  trap_en: string;
  safer_vi: string;
  safer_en: string;
};

export type PunjabiPragmaticStrategyEntry = {
  id: string;
  focus: PunjabiPragmaticStrategyFocus;
  setting: PunjabiPragmaticStrategySetting;
  title_vi: string;
  title_en: string;
  situation_vi: string;
  situation_en: string;
  strategy_vi: string;
  strategy_en: string;
  phrases: PunjabiPragmaticPhrase[];
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  learner_trap?: PunjabiPragmaticTrap;
  canada_practical?: boolean;
};

export const PRAGMATIC_STRATEGY_C2_DISCLAIMER = {
  vi: "Gói chiến lược ngữ dụng Punjabi C2 này chỉ hỗ trợ học tập. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ, không phải khóa học đầy đủ.",
  en: "This C2 Punjabi pragmatic strategy pack is for study support only. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness, not taught as a full course.",
} as const;

export const pragmaticStrategyC2Entries: PunjabiPragmaticStrategyEntry[] = [
  {
    id: "pa_c2_prag_indirect_deadline",
    focus: "indirectness",
    setting: "workplace",
    title_vi: "Nhắc hạn một cách gián tiếp nhưng rõ",
    title_en: "Indirect but clear deadline reminder",
    situation_vi: "Bạn cần nhắc đồng nghiệp gửi tài liệu mà không nghe như ra lệnh.",
    situation_en: "You need to remind a colleague to send a document without sounding commanding.",
    strategy_vi: "Dùng nhắc nhẹ + lý do chung + thời hạn cụ thể.",
    strategy_en: "Use a gentle reminder + shared reason + specific deadline.",
    phrases: [
      {
        cell_id: "b5d364a2-ca8c-414e-87a4-7965334b731e",
        gurmukhi: "ਸਿਰਫ਼ ਯਾਦ ਦਿਵਾਉਣਾ ਸੀ",
        romanization: "sirf yaad divauna si",
        vi: "Tôi chỉ muốn nhắc nhẹ.",
        en: "Just wanted to remind.",
      },
      {
        cell_id: "769ce4fb-8d8c-4a76-8546-0f17824c0a90",
        gurmukhi: "ਤਾਂ ਜੋ ਕੰਮ ਸਮੇਂ ਤੇ ਪੂਰਾ ਹੋ ਸਕੇ",
        romanization: "taan jo kamm same te pura ho sake",
        vi: "Để công việc có thể hoàn tất đúng hạn.",
        en: "So the work can be finished on time.",
      },
    ],
    model_gurmukhi: "ਸਿਰਫ਼ ਯਾਦ ਦਿਵਾਉਣਾ ਸੀ ਕਿ ਕਿਰਪਾ ਕਰਕੇ ਫ਼ਾਈਲ ਅੱਜ ਭੇਜ ਦਿਓ, ਤਾਂ ਜੋ ਕੰਮ ਸਮੇਂ ਤੇ ਪੂਰਾ ਹੋ ਸਕੇ।",
    model_romanization: "sirf yaad divauna si ki kirpa karke file ajj bhej dio, taan jo kamm same te pura ho sake.",
    model_vi: "Tôi chỉ muốn nhắc nhẹ là vui lòng gửi tệp hôm nay, để công việc có thể hoàn tất đúng hạn.",
    model_en: "Just a reminder to please send the file today, so the work can be finished on time.",
    learner_trap: {
      trap_vi: "Nói gián tiếp quá mức khiến người nghe không biết cần làm gì.",
      trap_en: "Being so indirect that the listener cannot tell what action is needed.",
      safer_vi: "Giữ hành động và hạn rõ, chỉ làm mềm cách mở lời.",
      safer_en: "Keep the action and deadline clear; soften only the opener.",
    },
  },
  {
    id: "pa_c2_prag_face_save_correction",
    focus: "face_saving",
    setting: "community",
    title_vi: "Sửa lỗi mà giữ thể diện",
    title_en: "Correct while preserving face",
    situation_vi: "Ai đó nói sai thông tin trong nhóm nhưng bạn muốn sửa nhẹ.",
    situation_en: "Someone gives incorrect information in a group and you want to correct gently.",
    strategy_vi: "Tránh 'anh/chị sai'; đưa thông tin cập nhật hoặc cách hiểu khác.",
    strategy_en: "Avoid 'you are wrong'; offer updated information or another reading.",
    phrases: [
      {
        cell_id: "c9647983-adbb-40ed-b6f9-cb7c8460439a",
        gurmukhi: "ਮੇਰੀ ਜਾਣਕਾਰੀ ਅਨੁਸਾਰ",
        romanization: "meri jaankaari anusaar",
        vi: "Theo thông tin của tôi.",
        en: "According to my information.",
      },
      {
        cell_id: "4b4d78a5-1810-40fc-adbf-30fe74fd9a57",
        gurmukhi: "ਸ਼ਾਇਦ ਨਵੀਂ ਜਾਣਕਾਰੀ ਇਹ ਹੈ",
        romanization: "shayad navin jaankaari ih hai",
        vi: "Có lẽ thông tin mới là...",
        en: "Perhaps the updated information is...",
      },
    ],
    model_gurmukhi: "ਮੇਰੀ ਜਾਣਕਾਰੀ ਅਨੁਸਾਰ, ਸ਼ਾਇਦ ਨਵੀਂ ਜਾਣਕਾਰੀ ਇਹ ਹੈ ਕਿ ਮੀਟਿੰਗ ਸੋਮਵਾਰ ਨੂੰ ਹੈ।",
    model_romanization: "meri jaankaari anusaar, shayad navin jaankaari ih hai ki meeting somvaar nu hai.",
    model_vi: "Theo thông tin của tôi, có lẽ thông tin mới là cuộc họp vào thứ Hai.",
    model_en: "According to my information, perhaps the updated information is that the meeting is on Monday.",
    learner_trap: {
      trap_vi: "Sửa công khai bằng 'không đúng' làm người kia mất mặt.",
      trap_en: "Correcting publicly with 'not correct', making the person lose face.",
      safer_vi: "Đặt sửa lỗi vào 'thông tin mới' hoặc 'theo tôi biết'.",
      safer_en: "Frame the correction as 'updated information' or 'as far as I know'.",
    },
  },
  {
    id: "pa_c2_prag_warm_request",
    focus: "strategic_warmth",
    setting: "family",
    title_vi: "Ấm áp chiến lược khi nhờ việc",
    title_en: "Strategic warmth when asking a favor",
    situation_vi: "Bạn nhờ người quen giúp nhưng không muốn tạo áp lực quan hệ.",
    situation_en: "You ask someone you know for help without pressuring the relationship.",
    strategy_vi: "Mở bằng sự trân trọng, cho quyền từ chối, rồi nêu việc cụ thể.",
    strategy_en: "Open with appreciation, allow refusal, then state the specific task.",
    phrases: [
      {
        cell_id: "b804450f-6140-4124-a327-9e901088b55d",
        gurmukhi: "ਮੈਨੂੰ ਪਤਾ ਹੈ ਤੁਸੀਂ ਵਿਅਸਤ ਹੋ",
        romanization: "mainu pata hai tusin viast ho",
        vi: "Tôi biết anh/chị bận.",
        en: "I know you are busy.",
      },
      {
        cell_id: "24fd8536-f97f-4074-aa48-18df5a8f9869",
        gurmukhi: "ਜੇ ਤੁਹਾਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ",
        romanization: "je tuhanu suvidha hove",
        vi: "Nếu anh/chị thấy tiện.",
        en: "If it is convenient for you.",
      },
    ],
    model_gurmukhi: "ਮੈਨੂੰ ਪਤਾ ਹੈ ਤੁਸੀਂ ਵਿਅਸਤ ਹੋ; ਜੇ ਤੁਹਾਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ ਤਾਂ ਕੀ ਤੁਸੀਂ ਇਹ ਸੁਨੇਹਾ ਵੇਖ ਸਕਦੇ ਹੋ?",
    model_romanization: "mainu pata hai tusin viast ho; je tuhanu suvidha hove taan ki tusin ih suneha vekh sakde ho?",
    model_vi: "Tôi biết anh/chị bận; nếu tiện thì anh/chị xem tin nhắn này giúp được không?",
    model_en: "I know you are busy; if convenient, could you look at this message?",
  },
  {
    id: "pa_c2_prag_disagree_meeting",
    focus: "respectful_disagreement",
    setting: "workplace",
    title_vi: "Bất đồng trong cuộc họp",
    title_en: "Disagreeing in a meeting",
    situation_vi: "Bạn không đồng ý với đề xuất nhưng muốn giữ giọng chuyên nghiệp.",
    situation_en: "You disagree with a proposal but want to keep a professional tone.",
    strategy_vi: "Công nhận mục tiêu chung, rồi đưa lo ngại cụ thể.",
    strategy_en: "Acknowledge the shared goal, then give a specific concern.",
    phrases: [
      {
        cell_id: "327a9ffc-2500-4c30-88ee-46ae6e358de4",
        gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ",
        romanization: "maqsad naal main sahimat haan",
        vi: "Tôi đồng ý với mục tiêu.",
        en: "I agree with the goal.",
      },
      {
        cell_id: "194a72da-b77c-43dc-9083-e59c3dcb321a",
        gurmukhi: "ਮੇਰੀ ਚਿੰਤਾ ਇਹ ਹੈ ਕਿ",
        romanization: "meri chinta ih hai ki",
        vi: "Điều tôi lo là...",
        en: "My concern is that...",
      },
    ],
    model_gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ, ਪਰ ਮੇਰੀ ਚਿੰਤਾ ਇਹ ਹੈ ਕਿ ਸਮਾਂ ਕਾਫ਼ੀ ਨਹੀਂ ਹੋਵੇਗਾ।",
    model_romanization: "maqsad naal main sahimat haan, par meri chinta ih hai ki sama kaafi nahin hovega.",
    model_vi: "Tôi đồng ý với mục tiêu, nhưng điều tôi lo là thời gian sẽ không đủ.",
    model_en: "I agree with the goal, but my concern is that there will not be enough time.",
    learner_trap: {
      trap_vi: "Bắt đầu bằng 'tôi không đồng ý' khiến không khí căng.",
      trap_en: "Opening with 'I disagree' can make the room tense.",
      safer_vi: "Trước tiên công nhận mục tiêu chung.",
      safer_en: "Acknowledge the shared goal first.",
    },
  },
  {
    id: "pa_c2_prag_change_topic",
    focus: "changing_topic",
    setting: "community",
    title_vi: "Chuyển chủ đề lịch sự",
    title_en: "Polite topic change",
    situation_vi: "Cuộc trò chuyện đi xa khỏi mục tiêu hoặc sang chủ đề quá riêng tư.",
    situation_en: "The conversation drifts from the goal or moves into something too private.",
    strategy_vi: "Công nhận chủ đề, rồi kéo nhẹ về mục tiêu chính.",
    strategy_en: "Acknowledge the topic, then gently return to the main goal.",
    phrases: [
      {
        cell_id: "43181f8e-052a-4d92-9d5e-e9aca297b7df",
        gurmukhi: "ਇਹ ਵੀ ਮਹੱਤਵਪੂਰਨ ਗੱਲ ਹੈ",
        romanization: "ih vi mahatvapuran gall hai",
        vi: "Đây cũng là việc quan trọng.",
        en: "This is also important.",
      },
      {
        cell_id: "48224f26-9ec8-460d-9008-ccaf8a0a471f",
        gurmukhi: "ਫਿਲਹਾਲ ਮੁੱਖ ਗੱਲ ਵੱਲ ਆਈਏ",
        romanization: "filhaal mukh gall vall aie",
        vi: "Hiện tại ta quay lại việc chính.",
        en: "For now, let's return to the main point.",
      },
    ],
    model_gurmukhi: "ਇਹ ਵੀ ਮਹੱਤਵਪੂਰਨ ਗੱਲ ਹੈ, ਪਰ ਫਿਲਹਾਲ ਮੁੱਖ ਗੱਲ ਵੱਲ ਆਈਏ ਤਾਂ ਜੋ ਫ਼ੈਸਲਾ ਹੋ ਸਕੇ।",
    model_romanization: "ih vi mahatvapuran gall hai, par filhaal mukh gall vall aie taan jo faisla ho sake.",
    model_vi: "Đây cũng là việc quan trọng, nhưng hiện tại ta quay lại việc chính để có thể ra quyết định.",
    model_en: "This is also important, but for now let's return to the main point so a decision can be made.",
    learner_trap: {
      trap_vi: "Đổi chủ đề đột ngột bằng 'thôi nói chuyện khác'.",
      trap_en: "Changing topic abruptly with 'let's talk about something else'.",
      safer_vi: "Công nhận chủ đề trước khi chuyển hướng.",
      safer_en: "Acknowledge the topic before redirecting.",
    },
  },
  {
    id: "pa_c2_prag_calm_conflict",
    focus: "calming_conflict",
    setting: "community",
    title_vi: "Hạ nhiệt xung đột",
    title_en: "Calming conflict",
    situation_vi: "Hai người đang nói căng trong cuộc họp cộng đồng.",
    situation_en: "Two people are speaking tensely in a community meeting.",
    strategy_vi: "Tách cảm xúc khỏi quyết định, đề nghị nghe từng phần.",
    strategy_en: "Separate emotion from decision-making and suggest hearing each part.",
    phrases: [
      {
        cell_id: "d325eccd-5391-4321-9e44-28111241e602",
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        cell_id: "0c67e565-5f60-4883-8ec0-b9a7aaf9da95",
        gurmukhi: "ਫ਼ੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਸਭ ਨੂੰ ਸੁਣਨਾ ਜ਼ਰੂਰੀ ਹੈ",
        romanization: "faisle ton pehlan sabh nu sunna zaruri hai",
        vi: "Trước khi quyết định, cần nghe mọi người.",
        en: "Before deciding, it is important to hear everyone.",
      },
    ],
    model_gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਫ਼ੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਸਭ ਨੂੰ ਸੁਣਨਾ ਜ਼ਰੂਰੀ ਹੈ।",
    model_romanization: "aao ikk-ikk gall sunie. faisle ton pehlan sabh nu sunna zaruri hai.",
    model_vi: "Ta hãy nghe từng ý một. Trước khi quyết định, cần nghe mọi người.",
    model_en: "Let's hear one point at a time. Before deciding, it is important to hear everyone.",
    learner_trap: {
      trap_vi: "Nói 'bình tĩnh đi' trực tiếp có thể làm người khác căng hơn.",
      trap_en: "Saying 'calm down' directly can make people more tense.",
      safer_vi: "Đề xuất quy trình nói chuyện thay vì đánh giá cảm xúc.",
      safer_en: "Suggest a speaking process instead of judging emotions.",
    },
  },
  {
    id: "pa_c2_prag_public_correction_canada",
    focus: "formal_public_communication",
    setting: "canada_service",
    title_vi: "Sửa thông báo công khai ở Canada",
    title_en: "Public correction in Canada",
    situation_vi: "Một thông báo về lớp, giấy tờ, hoặc địa điểm ở Canada có lỗi.",
    situation_en: "A notice about a class, document, or location in Canada has an error.",
    strategy_vi: "Nhận lỗi ngắn, đưa thông tin đúng, xin lỗi vì bất tiện.",
    strategy_en: "Briefly acknowledge the error, give correct information, apologize for inconvenience.",
    phrases: [
      {
        cell_id: "203210f7-a93b-407a-aa53-1fc09d453f7b",
        gurmukhi: "ਪਿਛਲੇ ਸੁਨੇਹੇ ਵਿੱਚ ਗਲਤੀ ਰਹਿ ਗਈ ਸੀ",
        romanization: "pichhle sunehe vich galti rahi gayi si",
        vi: "Tin nhắn trước có lỗi.",
        en: "There was an error in the previous message.",
      },
      {
        cell_id: "8a52b575-a18b-42d8-ae71-fbe23c4fca2f",
        gurmukhi: "ਅਸੁਵਿਧਾ ਲਈ ਮਾਫ਼ ਕਰਨਾ",
        romanization: "asuvidha lai maaf karna",
        vi: "Xin lỗi vì bất tiện.",
        en: "Sorry for the inconvenience.",
      },
    ],
    model_gurmukhi: "ਪਿਛਲੇ ਸੁਨੇਹੇ ਵਿੱਚ ਗਲਤੀ ਰਹਿ ਗਈ ਸੀ। ਕੈਨੇਡਾ ਵਾਲੀ ਕਲਾਸ ਦਾ ਸਹੀ ਕਮਰਾ 204 ਹੈ। ਅਸੁਵਿਧਾ ਲਈ ਮਾਫ਼ ਕਰਨਾ।",
    model_romanization: "pichhle sunehe vich galti rahi gayi si. Canada wali class da sahi kamra 204 hai. asuvidha lai maaf karna.",
    model_vi: "Tin nhắn trước có lỗi. Phòng đúng của lớp ở Canada là 204. Xin lỗi vì bất tiện.",
    model_en: "There was an error in the previous message. The correct room for the Canada class is 204. Sorry for the inconvenience.",
    canada_practical: true,
  },
  {
    id: "pa_c2_prag_community_ask_feedback",
    focus: "community_communication",
    setting: "community",
    title_vi: "Mời góp ý cộng đồng",
    title_en: "Inviting community feedback",
    situation_vi: "Bạn muốn khuyến khích người khác góp ý mà không làm họ thấy bị kiểm tra.",
    situation_en: "You want to invite feedback without making people feel tested.",
    strategy_vi: "Mời góp ý như sự hợp tác chung, không như phê bình.",
    strategy_en: "Invite feedback as shared cooperation, not criticism.",
    phrases: [
      {
        cell_id: "0a861fe6-b85e-4323-97bf-9f7d0e006ac4",
        gurmukhi: "ਤੁਹਾਡੀ ਰਾਏ ਸਾਡੇ ਲਈ ਕੀਮਤੀ ਹੈ",
        romanization: "tuhadi rai sade lai keemti hai",
        vi: "Ý kiến của anh/chị rất quý với chúng tôi.",
        en: "Your view is valuable to us.",
      },
      {
        cell_id: "0e039fce-00f6-4176-96d2-ba7d650af2ee",
        gurmukhi: "ਜੇ ਕੋਈ ਸੁਝਾਅ ਹੋਵੇ",
        romanization: "je koi sujhaa hove",
        vi: "Nếu có đề xuất nào.",
        en: "If there is any suggestion.",
      },
    ],
    model_gurmukhi: "ਤੁਹਾਡੀ ਰਾਏ ਸਾਡੇ ਲਈ ਕੀਮਤੀ ਹੈ। ਜੇ ਕੋਈ ਸੁਝਾਅ ਹੋਵੇ ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਸਾਂਝਾ ਕਰੋ।",
    model_romanization: "tuhadi rai sade lai keemti hai. je koi sujhaa hove taan kirpa karke sanjha karo.",
    model_vi: "Ý kiến của anh/chị rất quý với chúng tôi. Nếu có đề xuất nào, xin vui lòng chia sẻ.",
    model_en: "Your view is valuable to us. If there is any suggestion, please share it.",
  },
  {
    id: "pa_c2_prag_school_canada",
    focus: "formal_public_communication",
    setting: "education",
    title_vi: "Viết cho trường học ở Canada",
    title_en: "Writing to a school in Canada",
    situation_vi: "Bạn cần hỏi thông tin từ trường nhưng muốn giọng vừa trang trọng vừa dễ gần.",
    situation_en: "You need to ask a school for information with a formal but approachable tone.",
    strategy_vi: "Chào lịch sự, nêu mục đích, hỏi bước tiếp theo.",
    strategy_en: "Open politely, state purpose, ask for the next step.",
    phrases: [
      {
        cell_id: "7dc608fe-a345-4b3d-87ac-b62fc265df0d",
        gurmukhi: "ਮੈਂ ਦਾਖ਼ਲੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ",
        romanization: "main daakhle di prakiria bare puchhna chahunda/chahundi haan",
        vi: "Tôi muốn hỏi về quy trình nhập học.",
        en: "I would like to ask about the admission process.",
      },
      {
        cell_id: "eb724158-e689-4c7b-907d-b08ffacf879c",
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੋਵੇਗਾ?",
        romanization: "agla kadam ki hovega?",
        vi: "Bước tiếp theo là gì?",
        en: "What would the next step be?",
      },
    ],
    model_gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਦਾਖ਼ਲੇ ਦੀ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਅਗਲਾ ਕਦਮ ਕੀ ਹੋਵੇਗਾ?",
    model_romanization: "sat sri akaal ji, main Canada vich daakhle di prakiria bare puchhna chahunda/chahundi haan. kirpa karke dasso, agla kadam ki hovega?",
    model_vi: "Xin chào, tôi muốn hỏi về quy trình nhập học ở Canada. Xin vui lòng cho biết bước tiếp theo là gì.",
    model_en: "Hello, I would like to ask about the admission process in Canada. Please let me know what the next step would be.",
    canada_practical: true,
  },
  {
    id: "pa_c2_prag_script_scope",
    focus: "formal_public_communication",
    setting: "education",
    title_vi: "Nói rõ phạm vi chữ viết",
    title_en: "Clarifying script scope",
    situation_vi: "Bạn giải thích tài liệu học Punjabi này dùng hệ chữ nào.",
    situation_en: "You explain which script this Punjabi learning material uses.",
    strategy_vi: "Nêu Gurmukhi là chính và Shahmukhi chỉ để nhận biết.",
    strategy_en: "State that Gurmukhi is primary and Shahmukhi is for awareness only.",
    phrases: [
      {
        cell_id: "441a3bf2-c886-4e77-89ae-3fc5bd2ea0e2",
        gurmukhi: "ਗੁਰਮੁਖੀ ਮੁੱਖ ਲਿਪੀ ਹੈ",
        romanization: "Gurmukhi mukh lipi hai",
        vi: "Gurmukhi là hệ chữ chính.",
        en: "Gurmukhi is the primary script.",
      },
      {
        cell_id: "d4632fc8-311f-4229-844e-8e4204c02836",
        gurmukhi: "ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ",
        romanization: "Shahmukhi sirf jaankaari lai",
        vi: "Shahmukhi chỉ để nhận biết.",
        en: "Shahmukhi is for awareness only.",
      },
    ],
    model_gurmukhi: "ਇਸ ਸਮੱਗਰੀ ਵਿੱਚ ਗੁਰਮੁਖੀ ਮੁੱਖ ਲਿਪੀ ਹੈ; ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਿਕਰ ਕੀਤੀ ਗਈ ਹੈ, ਪੂਰੇ ਕੋਰਸ ਵਾਂਗ ਨਹੀਂ।",
    model_romanization: "is samagri vich Gurmukhi mukh lipi hai; Shahmukhi sirf jaankaari lai zikar kiti gayi hai, pure course vaang nahin.",
    model_vi: "Trong tài liệu này Gurmukhi là hệ chữ chính; Shahmukhi chỉ được nhắc để nhận biết, không phải như một khóa đầy đủ.",
    model_en: "In this material Gurmukhi is the primary script; Shahmukhi is mentioned only for awareness, not as a full course.",
  },
];

export const pragmaticStrategyC2ByFocus = (
  focus: PunjabiPragmaticStrategyFocus,
): PunjabiPragmaticStrategyEntry[] =>
  pragmaticStrategyC2Entries.filter((entry) => entry.focus === focus);
