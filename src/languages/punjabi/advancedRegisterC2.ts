// Punjabi C2 advanced register pack for Vietnamese- and English-speaking
// learners. Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support material, not native-reviewed authority. Native
// review is deferred. Shahmukhi is mentioned only for script awareness, not as
// a full course.

export type PunjabiAdvancedRegisterFocus =
  | "warmth"
  | "distance"
  | "deference"
  | "indirectness"
  | "disagreement"
  | "community_speech"
  | "professional_tone"
  | "sensitive_topic_framing";

export type PunjabiAdvancedRegisterSetting =
  | "family"
  | "community"
  | "workplace"
  | "public_service"
  | "education"
  | "formal_public";

export type PunjabiAdvancedRegisterPhrase = {
  cell_id?: string;
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiAdvancedRegisterTrap = {
  issue_vi: string;
  issue_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiAdvancedRegisterEntry = {
  id: string;
  focus: PunjabiAdvancedRegisterFocus;
  setting: PunjabiAdvancedRegisterSetting;
  title_vi: string;
  title_en: string;
  register_goal_vi: string;
  register_goal_en: string;
  when_to_use_vi: string;
  when_to_use_en: string;
  phrases: PunjabiAdvancedRegisterPhrase[];
  too_plain?: PunjabiAdvancedRegisterPhrase;
  better_gurmukhi: string;
  better_romanization: string;
  better_vi: string;
  better_en: string;
  learner_trap?: PunjabiAdvancedRegisterTrap;
  canada_practical?: boolean;
};

export const ADVANCED_REGISTER_C2_DISCLAIMER = {
  vi: "Gói ngữ vực Punjabi C2 này chỉ hỗ trợ học tập. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ, không phải khóa học đầy đủ.",
  en: "This C2 Punjabi advanced register pack is for study support only. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness, not taught as a full course.",
} as const;

export const advancedRegisterC2Entries: PunjabiAdvancedRegisterEntry[] = [
  {
    id: "pa_c2_register_warm_boundary",
    focus: "warmth",
    setting: "family",
    title_vi: "Ấm áp nhưng vẫn có ranh giới",
    title_en: "Warmth with a boundary",
    register_goal_vi: "Giữ giọng gần gũi khi bạn không thể nhận lời.",
    register_goal_en: "Keep a warm tone when you cannot accept.",
    when_to_use_vi: "Khi người thân hoặc bạn cộng đồng nhờ việc nhưng bạn không đủ thời gian.",
    when_to_use_en: "When a relative or community friend asks for help but you do not have enough time.",
    phrases: [
      {
        cell_id: "36ee4d5e-bb8c-49b6-a0fc-f7428806fa30",
        gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਮੇਰੇ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੈ",
        romanization: "tuhadi gall mere lai mahatvapuran hai",
        vi: "Việc của anh/chị quan trọng với tôi.",
        en: "Your matter is important to me.",
      },
      {
        cell_id: "a1619a09-2b4c-443a-a387-15828fc94b30",
        gurmukhi: "ਇਸ ਵੇਲੇ ਮੈਂ ਪੂਰਾ ਸਮਾਂ ਨਹੀਂ ਦੇ ਸਕਾਂਗਾ/ਸਕਾਂਗੀ",
        romanization: "is vele main pura sama nahin de sakanga/sakangi",
        vi: "Lúc này tôi không thể dành đủ thời gian.",
        en: "Right now I cannot give full time.",
      },
    ],
    too_plain: {
      gurmukhi: "ਮੈਂ ਨਹੀਂ ਕਰ ਸਕਦਾ/ਸਕਦੀ।",
      romanization: "main nahin kar sakda/sakdi.",
      vi: "Tôi không làm được. Có thể nghe cụt.",
      en: "I cannot do it. Can sound abrupt.",
    },
    better_gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਮੇਰੇ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਪਰ ਇਸ ਵੇਲੇ ਮੈਂ ਪੂਰਾ ਸਮਾਂ ਨਹੀਂ ਦੇ ਸਕਾਂਗਾ/ਸਕਾਂਗੀ।",
    better_romanization: "tuhadi gall mere lai mahatvapuran hai, par is vele main pura sama nahin de sakanga/sakangi.",
    better_vi: "Việc của anh/chị quan trọng với tôi, nhưng lúc này tôi không thể dành đủ thời gian.",
    better_en: "Your matter is important to me, but right now I cannot give it full time.",
    learner_trap: {
      issue_vi: "Tưởng thân mật thì có thể từ chối rất ngắn.",
      issue_en: "Assuming closeness makes a very short refusal safe.",
      repair_vi: "Thêm một câu công nhận quan hệ hoặc tầm quan trọng trước khi từ chối.",
      repair_en: "Add one sentence acknowledging the relationship or importance before refusing.",
    },
  },
  {
    id: "pa_c2_register_distance_service",
    focus: "distance",
    setting: "public_service",
    title_vi: "Khoảng cách lịch sự trong dịch vụ công",
    title_en: "Polite distance in public service",
    register_goal_vi: "Nói rõ yêu cầu mà không quá thân mật hoặc áp lực.",
    register_goal_en: "State the request clearly without sounding too familiar or pressuring.",
    when_to_use_vi: "Khi hỏi thông tin ở văn phòng, trường học, dịch vụ định cư, hoặc quầy tiếp nhận tại Canada.",
    when_to_use_en: "When asking at an office, school, settlement service, or reception desk in Canada.",
    phrases: [
      {
        cell_id: "31cbfa32-3023-4edc-be24-db8c11009632",
        gurmukhi: "ਮੈਨੂੰ ਇਸ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ",
        romanization: "mainu is prakiria bare jaankaari chahidi hai",
        vi: "Tôi cần thông tin về quy trình này.",
        en: "I need information about this process.",
      },
      {
        cell_id: "37737539-34bf-4904-a646-eac9a5e53374",
        gurmukhi: "ਜੇ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕੋ",
        romanization: "je tusin madad kar sako",
        vi: "Nếu anh/chị có thể hỗ trợ.",
        en: "If you could help.",
      },
    ],
    better_gurmukhi: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੈਨੂੰ ਇਸ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਜੇ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕੋ ਤਾਂ ਧੰਨਵਾਦ।",
    better_romanization: "maaf karna ji, mainu is prakiria bare jaankaari chahidi hai. je tusin madad kar sako taan dhannvaad.",
    better_vi: "Xin lỗi ạ, tôi cần thông tin về quy trình này. Nếu anh/chị hỗ trợ được thì xin cảm ơn.",
    better_en: "Excuse me, I need information about this process. I would appreciate your help if possible.",
    canada_practical: true,
  },
  {
    id: "pa_c2_register_deference_elder",
    focus: "deference",
    setting: "community",
    title_vi: "Kính trọng người lớn tuổi mà không phóng đại",
    title_en: "Deference to elders without overdoing it",
    register_goal_vi: "Dùng kính ngữ vừa đủ để nghe tôn trọng và tự nhiên.",
    register_goal_en: "Use enough respect to sound courteous and natural.",
    when_to_use_vi: "Khi xin ý kiến người lớn tuổi trong sự kiện gia đình hoặc cộng đồng.",
    when_to_use_en: "When asking an elder's opinion at a family or community event.",
    phrases: [
      {
        cell_id: "1d642a12-28f5-4446-bc07-abe3e820a245",
        gurmukhi: "ਤੁਹਾਡੀ ਰਾਏ ਸਾਡੇ ਲਈ ਕੀਮਤੀ ਹੈ",
        romanization: "tuhadi rai sade lai keemti hai",
        vi: "Ý kiến của bác/anh/chị rất quý với chúng tôi.",
        en: "Your opinion is valuable to us.",
      },
      {
        cell_id: "3db0eb4f-5f00-48b9-82a0-5b53fd22be92",
        gurmukhi: "ਤੁਸੀਂ ਕੀ ਸਲਾਹ ਦਿੰਦੇ ਹੋ?",
        romanization: "tusin ki salaah dinde ho?",
        vi: "Bác/anh/chị khuyên thế nào?",
        en: "What advice would you give?",
      },
    ],
    too_plain: {
      gurmukhi: "ਤੁਸੀਂ ਕੀ ਸੋਚਦੇ ਹੋ?",
      romanization: "tusin ki sochde ho?",
      vi: "Anh/chị nghĩ gì? Đúng nhưng hơi trung tính.",
      en: "What do you think? Correct but a bit neutral.",
    },
    better_gurmukhi: "ਤੁਹਾਡੀ ਰਾਏ ਸਾਡੇ ਲਈ ਕੀਮਤੀ ਹੈ ਜੀ। ਤੁਸੀਂ ਕੀ ਸਲਾਹ ਦਿੰਦੇ ਹੋ?",
    better_romanization: "tuhadi rai sade lai keemti hai ji. tusin ki salaah dinde ho?",
    better_vi: "Ý kiến của bác/anh/chị rất quý với chúng tôi. Bác/anh/chị khuyên thế nào?",
    better_en: "Your opinion is valuable to us. What advice would you give?",
    learner_trap: {
      issue_vi: "Dùng quá nhiều từ trang trọng làm câu nghe sân khấu.",
      issue_en: "Using too many formal words makes the sentence theatrical.",
      repair_vi: "Một câu công nhận + ਜੀ thường đủ.",
      repair_en: "One acknowledgement plus ਜੀ is often enough.",
    },
  },
  {
    id: "pa_c2_register_indirect_deadline",
    focus: "indirectness",
    setting: "workplace",
    title_vi: "Gián tiếp khi nhắc hạn",
    title_en: "Indirectness when reminding about deadlines",
    register_goal_vi: "Nhắc việc rõ nhưng không biến thành ra lệnh.",
    register_goal_en: "Remind clearly without turning it into a command.",
    when_to_use_vi: "Khi đồng nghiệp hoặc bạn học chưa gửi phần việc.",
    when_to_use_en: "When a colleague or classmate has not sent their part.",
    phrases: [
      {
        cell_id: "c25d1108-27f8-46ce-a13b-ea84c9b98b97",
        gurmukhi: "ਸਿਰਫ਼ ਯਾਦ ਦਿਵਾਉਣਾ ਸੀ",
        romanization: "sirf yaad divauna si",
        vi: "Tôi chỉ muốn nhắc nhẹ.",
        en: "Just wanted to remind.",
      },
      {
        cell_id: "a0731e86-32ed-4a61-a0ed-6e802934801b",
        gurmukhi: "ਤਾਂ ਜੋ ਅਸੀਂ ਸਮੇਂ ਤੇ ਪੂਰਾ ਕਰ ਸਕੀਏ",
        romanization: "taan jo asin same te pura kar sakie",
        vi: "Để chúng ta có thể hoàn tất đúng hạn.",
        en: "So that we can finish on time.",
      },
    ],
    too_plain: {
      gurmukhi: "ਅੱਜ ਭੇਜੋ।",
      romanization: "ajj bhejo.",
      vi: "Gửi hôm nay. Nghe như mệnh lệnh.",
      en: "Send it today. Sounds like a command.",
    },
    better_gurmukhi: "ਸਿਰਫ਼ ਯਾਦ ਦਿਵਾਉਣਾ ਸੀ ਕਿ ਕਿਰਪਾ ਕਰਕੇ ਅੱਜ ਭੇਜ ਦਿਓ, ਤਾਂ ਜੋ ਅਸੀਂ ਸਮੇਂ ਤੇ ਪੂਰਾ ਕਰ ਸਕੀਏ।",
    better_romanization: "sirf yaad divauna si ki kirpa karke ajj bhej dio, taan jo asin same te pura kar sakie.",
    better_vi: "Tôi chỉ muốn nhắc nhẹ là vui lòng gửi hôm nay, để chúng ta có thể hoàn tất đúng hạn.",
    better_en: "Just a reminder to please send it today, so that we can finish on time.",
    learner_trap: {
      issue_vi: "Nhầm gián tiếp với mơ hồ.",
      issue_en: "Confusing indirectness with vagueness.",
      repair_vi: "Giữ hạn cụ thể, nhưng thêm lý do chung.",
      repair_en: "Keep the deadline specific, but add the shared reason.",
    },
  },
  {
    id: "pa_c2_register_disagree_public",
    focus: "disagreement",
    setting: "formal_public",
    title_vi: "Bất đồng trong diễn đàn công khai",
    title_en: "Disagreement in a public forum",
    register_goal_vi: "Phản biện mạnh nhưng không làm cá nhân hóa tranh luận.",
    register_goal_en: "Push back strongly without personalizing the debate.",
    when_to_use_vi: "Khi phát biểu trong họp cộng đồng, hội đồng, hoặc thảo luận chính sách.",
    when_to_use_en: "When speaking in a community meeting, board, or policy discussion.",
    phrases: [
      {
        cell_id: "8aea287d-b86f-4117-8823-e01164defd72",
        gurmukhi: "ਮੈਂ ਇਸ ਨਤੀਜੇ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹਿਮਤ ਨਹੀਂ",
        romanization: "main is natije naal puri tarah sahimat nahin",
        vi: "Tôi không hoàn toàn đồng ý với kết luận này.",
        en: "I do not fully agree with this conclusion.",
      },
      {
        cell_id: "30b13e5d-cf0c-4d99-a4b3-9c447c4a64d6",
        gurmukhi: "ਕਾਰਨ ਇਹ ਹੈ ਕਿ",
        romanization: "kaaran ih hai ki",
        vi: "Lý do là...",
        en: "The reason is...",
      },
    ],
    better_gurmukhi: "ਮੈਂ ਇਸ ਨਤੀਜੇ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹਿਮਤ ਨਹੀਂ। ਕਾਰਨ ਇਹ ਹੈ ਕਿ ਕੁਝ ਪ੍ਰਭਾਵ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ।",
    better_romanization: "main is natije naal puri tarah sahimat nahin. kaaran ih hai ki kujh prabhav aje spasht nahin han.",
    better_vi: "Tôi không hoàn toàn đồng ý với kết luận này. Lý do là một số tác động vẫn chưa rõ.",
    better_en: "I do not fully agree with this conclusion. The reason is that some effects are still unclear.",
    learner_trap: {
      issue_vi: "Phản biện bằng cách đánh giá người nói.",
      issue_en: "Disagreeing by judging the speaker.",
      repair_vi: "Phản biện kết luận, lý do, hoặc dữ kiện.",
      repair_en: "Disagree with the conclusion, reason, or evidence instead.",
    },
  },
  {
    id: "pa_c2_register_community_thanks",
    focus: "community_speech",
    setting: "community",
    title_vi: "Lời cảm ơn đại diện cộng đồng",
    title_en: "Community-facing thanks",
    register_goal_vi: "Dùng giọng bao gồm tập thể, khiêm tốn, không tự đề cao.",
    register_goal_en: "Use an inclusive, modest tone without self-promotion.",
    when_to_use_vi: "Khi kết thúc sự kiện văn hóa, lớp học cộng đồng, hoặc buổi hỗ trợ.",
    when_to_use_en: "When closing a cultural event, community class, or support session.",
    phrases: [
      {
        cell_id: "d9265155-f8bc-40ce-8c55-9927e7a26be5",
        gurmukhi: "ਸਭ ਦੇ ਸਹਿਯੋਗ ਨਾਲ",
        romanization: "sabh de sahiyog naal",
        vi: "Nhờ sự hợp tác của mọi người.",
        en: "With everyone's cooperation.",
      },
      {
        cell_id: "8db2ac80-2964-4174-95c3-5f3c863b1263",
        gurmukhi: "ਅਸੀਂ ਦਿਲੋਂ ਧੰਨਵਾਦ ਕਰਦੇ ਹਾਂ",
        romanization: "asin dilon dhannvaad karde haan",
        vi: "Chúng tôi chân thành cảm ơn.",
        en: "We sincerely thank you.",
      },
    ],
    better_gurmukhi: "ਸਭ ਦੇ ਸਹਿਯੋਗ ਨਾਲ ਇਹ ਕਾਰਜ ਸੰਭਵ ਹੋਇਆ। ਅਸੀਂ ਦਿਲੋਂ ਧੰਨਵਾਦ ਕਰਦੇ ਹਾਂ।",
    better_romanization: "sabh de sahiyog naal ih kaaraj sambhav hoia. asin dilon dhannvaad karde haan.",
    better_vi: "Nhờ sự hợp tác của mọi người, việc này đã thành hiện thực. Chúng tôi chân thành cảm ơn.",
    better_en: "With everyone's cooperation, this work became possible. We sincerely thank you.",
  },
  {
    id: "pa_c2_register_professional_feedback",
    focus: "professional_tone",
    setting: "workplace",
    title_vi: "Góp ý chuyên nghiệp bằng ngôn ngữ quy trình",
    title_en: "Professional feedback through process language",
    register_goal_vi: "Góp ý rõ, tránh biến lỗi thành phẩm chất cá nhân.",
    register_goal_en: "Give clear feedback without turning an error into a personal trait.",
    when_to_use_vi: "Khi sửa tài liệu, quy trình, lịch làm việc, hoặc phản hồi đồng nghiệp.",
    when_to_use_en: "When revising documents, processes, schedules, or colleague work.",
    phrases: [
      {
        cell_id: "074c8a2f-3f28-4087-877a-3fb5ff395c07",
        gurmukhi: "ਇਸ ਹਿੱਸੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ",
        romanization: "is hisse nu hor spasht kita ja sakda hai",
        vi: "Phần này có thể được làm rõ hơn.",
        en: "This part can be made clearer.",
      },
      {
        cell_id: "421c15df-d68e-4226-83bb-f031e768d069",
        gurmukhi: "ਪਾਠਕ ਲਈ",
        romanization: "paathak lai",
        vi: "Đối với người đọc.",
        en: "For the reader.",
      },
    ],
    too_plain: {
      gurmukhi: "ਇਹ ਗਲਤ ਹੈ।",
      romanization: "ih galat hai.",
      vi: "Cái này sai. Quá ngắn cho góp ý chuyên nghiệp.",
      en: "This is wrong. Too short for professional feedback.",
    },
    better_gurmukhi: "ਪਾਠਕ ਲਈ ਇਸ ਹਿੱਸੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
    better_romanization: "paathak lai is hisse nu hor spasht kita ja sakda hai.",
    better_vi: "Đối với người đọc, phần này có thể được làm rõ hơn.",
    better_en: "For the reader, this part can be made clearer.",
    learner_trap: {
      issue_vi: "Dùng 'sai' khi thực ra vấn đề là độ rõ.",
      issue_en: "Using 'wrong' when the actual issue is clarity.",
      repair_vi: "Nói tiêu chí: rõ hơn, nhất quán hơn, dễ đọc hơn.",
      repair_en: "Name the criterion: clearer, more consistent, easier to read.",
    },
  },
  {
    id: "pa_c2_register_sensitive_family",
    focus: "sensitive_topic_framing",
    setting: "family",
    title_vi: "Đóng khung chủ đề gia đình nhạy cảm",
    title_en: "Framing sensitive family topics",
    register_goal_vi: "Mở chủ đề tế nhị mà giảm cảm giác chất vấn.",
    register_goal_en: "Open a delicate topic while reducing the feeling of interrogation.",
    when_to_use_vi: "Khi cần hỏi về kế hoạch gia đình, sức khỏe, tiền bạc, hoặc quyết định cá nhân.",
    when_to_use_en: "When asking about family plans, health, money, or personal decisions.",
    phrases: [
      {
        cell_id: "d213b7b0-7d3b-44c7-8017-6d7fe6340efb",
        gurmukhi: "ਜੇ ਤੁਸੀਂ ਸਾਂਝਾ ਕਰਨਾ ਚਾਹੋ",
        romanization: "je tusin sanjha karna chaho",
        vi: "Nếu anh/chị muốn chia sẻ.",
        en: "If you would like to share.",
      },
      {
        cell_id: "a5e8b0e3-e18c-4041-bcd4-ca23f87d9887",
        gurmukhi: "ਮੈਂ ਸਿਰਫ਼ ਸਮਝਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ",
        romanization: "main sirf samajhna chahunda/chahundi haan",
        vi: "Tôi chỉ muốn hiểu.",
        en: "I only want to understand.",
      },
    ],
    too_plain: {
      gurmukhi: "ਤੁਸੀਂ ਇਹ ਕਿਉਂ ਕੀਤਾ?",
      romanization: "tusin ih kyon kita?",
      vi: "Sao anh/chị làm vậy? Dễ nghe như tra hỏi.",
      en: "Why did you do this? Can sound interrogating.",
    },
    better_gurmukhi: "ਜੇ ਤੁਸੀਂ ਸਾਂਝਾ ਕਰਨਾ ਚਾਹੋ, ਮੈਂ ਸਿਰਫ਼ ਸਮਝਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ ਕਿ ਇਹ ਫ਼ੈਸਲਾ ਕਿਵੇਂ ਬਣਿਆ।",
    better_romanization: "je tusin sanjha karna chaho, main sirf samajhna chahunda/chahundi haan ki ih faisla kiven bania.",
    better_vi: "Nếu anh/chị muốn chia sẻ, tôi chỉ muốn hiểu quyết định này đã hình thành thế nào.",
    better_en: "If you would like to share, I only want to understand how this decision came about.",
    learner_trap: {
      issue_vi: "Hỏi 'tại sao' quá trực tiếp trong chủ đề riêng tư.",
      issue_en: "Asking 'why' too directly on a private topic.",
      repair_vi: "Cho người nghe quyền không chia sẻ.",
      repair_en: "Give the listener permission not to share.",
    },
  },
  {
    id: "pa_c2_register_canada_school",
    focus: "professional_tone",
    setting: "education",
    title_vi: "Email cho trường học ở Canada",
    title_en: "Emailing a school in Canada",
    register_goal_vi: "Kết hợp lịch sự, mục đích rõ, và thông tin cần thiết.",
    register_goal_en: "Combine politeness, clear purpose, and necessary information.",
    when_to_use_vi: "Khi viết cho giáo viên, văn phòng trường, hoặc chương trình cộng đồng ở Canada.",
    when_to_use_en: "When writing to a teacher, school office, or community program in Canada.",
    phrases: [
      {
        cell_id: "b5a351f4-a0aa-42b3-b2c0-bc3e1002f18f",
        gurmukhi: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਸਕੂਲ ਦੇ ਕਾਰਜਕ੍ਰਮ ਬਾਰੇ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ",
        romanization: "main Canada vich school de kaarjakram bare puchhna chahunda/chahundi haan",
        vi: "Tôi muốn hỏi về chương trình của trường ở Canada.",
        en: "I would like to ask about the school program in Canada.",
      },
      {
        cell_id: "f9732873-03b7-4599-b2d2-f1e4f2daa51a",
        gurmukhi: "ਜੇ ਕੋਈ ਫਾਰਮ ਲੋੜੀਂਦਾ ਹੋਵੇ",
        romanization: "je koi form lorinda hove",
        vi: "Nếu cần mẫu đơn nào.",
        en: "If any form is required.",
      },
    ],
    better_gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਸਕੂਲ ਦੇ ਕਾਰਜਕ੍ਰਮ ਬਾਰੇ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ। ਜੇ ਕੋਈ ਫਾਰਮ ਲੋੜੀਂਦਾ ਹੋਵੇ ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ।",
    better_romanization: "sat sri akaal ji, main Canada vich school de kaarjakram bare puchhna chahunda/chahundi haan. je koi form lorinda hove taan kirpa karke dasso.",
    better_vi: "Xin chào, tôi muốn hỏi về chương trình của trường ở Canada. Nếu cần mẫu đơn nào, xin vui lòng cho biết.",
    better_en: "Hello, I would like to ask about the school program in Canada. If any form is required, please let me know.",
    canada_practical: true,
  },
  {
    id: "pa_c2_register_script_awareness",
    focus: "distance",
    setting: "education",
    title_vi: "Nói về hệ chữ một cách trung tính",
    title_en: "Discussing scripts neutrally",
    register_goal_vi: "Nhận biết Shahmukhi mà không biến nó thành khóa học trong phần này.",
    register_goal_en: "Acknowledge Shahmukhi without turning it into a course here.",
    when_to_use_vi: "Khi giải thích phạm vi tài liệu cho người học hoặc phụ huynh.",
    when_to_use_en: "When explaining course scope to learners or parents.",
    phrases: [
      {
        cell_id: "3b2f36c7-92dd-45ad-90a4-c8e5430f942c",
        gurmukhi: "ਇੱਥੇ ਗੁਰਮੁਖੀ ਮੁੱਖ ਹੈ",
        romanization: "ithe Gurmukhi mukh hai",
        vi: "Ở đây Gurmukhi là chính.",
        en: "Here Gurmukhi is primary.",
      },
      {
        cell_id: "afa348be-6aa7-4328-bd0a-164219851b19",
        gurmukhi: "ਸ਼ਾਹਮੁਖੀ ਬਾਰੇ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਿਕਰ ਹੈ",
        romanization: "Shahmukhi bare sirf jaankaari lai zikar hai",
        vi: "Shahmukhi chỉ được nhắc để nhận biết.",
        en: "Shahmukhi is mentioned only for awareness.",
      },
    ],
    better_gurmukhi: "ਇੱਥੇ ਗੁਰਮੁਖੀ ਮੁੱਖ ਹੈ; ਸ਼ਾਹਮੁਖੀ ਬਾਰੇ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਿਕਰ ਹੈ।",
    better_romanization: "ithe Gurmukhi mukh hai; Shahmukhi bare sirf jaankaari lai zikar hai.",
    better_vi: "Ở đây Gurmukhi là chính; Shahmukhi chỉ được nhắc để nhận biết.",
    better_en: "Here Gurmukhi is primary; Shahmukhi is mentioned only for awareness.",
  },
];

export const advancedRegisterC2ByFocus = (
  focus: PunjabiAdvancedRegisterFocus,
): PunjabiAdvancedRegisterEntry[] =>
  advancedRegisterC2Entries.filter((entry) => entry.focus === focus);
