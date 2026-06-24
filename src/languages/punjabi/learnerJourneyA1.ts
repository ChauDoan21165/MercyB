// Punjabi A1 learner journey for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is practical learner support. Native review is deferred.

export type PunjabiLearnerJourneyStage =
  | "gurmukhi_first_contact"
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "food"
  | "directions"
  | "help"
  | "polite_requests"
  | "canada_services"
  | "a1_handoff";

export type PunjabiLearnerJourneyActivity =
  | "exposure"
  | "guided_practice"
  | "recall"
  | "mini_roleplay"
  | "readiness_check"
  | "handoff";

export type PunjabiLearnerJourneyStepA1 = {
  id: string;
  order: number;
  stage: PunjabiLearnerJourneyStage;
  activity: PunjabiLearnerJourneyActivity;
  title_vi: string;
  title_en: string;
  learner_goal_vi: string;
  learner_goal_en: string;
  sample_pa: string;
  romanization?: string;
  sample_vi: string;
  sample_en: string;
  explanation_vi: string;
  explanation_en: string;
  readiness_signal_vi: string;
  readiness_signal_en: string;
  handoff_next_vi: string;
  handoff_next_en: string;
  review_links: string[];
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
};

export const learnerJourneyScriptAwareness =
  "Gurmukhi is primary for this Punjabi A1 learner journey. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1LearnerJourney: PunjabiLearnerJourneyStepA1[] = [
  {
    id: "pa_a1_journey_gurmukhi_001",
    order: 1,
    stage: "gurmukhi_first_contact",
    activity: "exposure",
    title_vi: "Gặp Gurmukhi trước",
    title_en: "Meet Gurmukhi first",
    learner_goal_vi: "Tôi nhận ra vài từ sinh tồn bằng chữ Gurmukhi.",
    learner_goal_en: "I recognize a few survival words in Gurmukhi.",
    sample_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ",
    romanization: "pani, madad, bas",
    sample_vi: "nước, giúp đỡ, xe buýt",
    sample_en: "water, help, bus",
    explanation_vi: "Hành trình A1 bắt đầu bằng nhận diện chữ thật, rồi mới dùng romanization để hỗ trợ.",
    explanation_en: "The A1 journey starts with real script recognition, then uses romanization as support.",
    readiness_signal_vi: "Bạn nối được ਪਾਣੀ, ਮਦਦ, ਬੱਸ với nghĩa mà không cần chữ Latin trước.",
    readiness_signal_en: "You can match ਪਾਣੀ, ਮਦਦ, ਬੱਸ to meanings without Latin first.",
    handoff_next_vi: "Chuyển sang chào hỏi khi nhận ra ít nhất ba từ Gurmukhi.",
    handoff_next_en: "Move to greetings after recognizing at least three Gurmukhi words.",
    review_links: ["pa_a1_final_gurmukhi_001", "pa_a1_recall_gurmukhi_001"],
    learner_trap: { audience: "both", vi: "Đừng học Punjabi A1 chỉ bằng romanization.", en: "Do not learn Punjabi A1 only through romanization." },
    canada_practical: true,
  },
  {
    id: "pa_a1_journey_greetings_001",
    order: 2,
    stage: "greetings",
    activity: "guided_practice",
    title_vi: "Chào và hỏi thăm",
    title_en: "Greet and check in",
    learner_goal_vi: "Tôi chào lịch sự và hỏi thăm đơn giản.",
    learner_goal_en: "I greet politely and ask a simple check-in question.",
    sample_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    romanization: "sat sri akal. tusin kiven ho?",
    sample_vi: "Xin chào. Bạn khỏe không?",
    sample_en: "Hello. How are you?",
    explanation_vi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ dùng cho lời chào; ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ? hỏi thăm.",
    explanation_en: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ is for greeting; ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ? checks in.",
    readiness_signal_vi: "Bạn phân biệt câu chào với câu hỏi tên và giá.",
    readiness_signal_en: "You distinguish greetings from name and price questions.",
    handoff_next_vi: "Chuyển sang giới thiệu bản thân sau khi nói được hai câu này.",
    handoff_next_en: "Move to self-introduction after producing these two lines.",
    review_links: ["pa_a1_final_greetings_001", "pa_a1_recall_greetings_002"],
    learner_trap: { audience: "vi", vi: "Không thêm nguyên âm sau âm cuối của ਸਤ.", en: "Vietnamese speakers should not add a vowel after final ਤ." },
  },
  {
    id: "pa_a1_journey_identity_001",
    order: 3,
    stage: "identity",
    activity: "recall",
    title_vi: "Nói tên và hỏi tên",
    title_en: "Say and ask names",
    learner_goal_vi: "Tôi giới thiệu tên và hỏi tên người khác.",
    learner_goal_en: "I introduce my name and ask someone else's name.",
    sample_pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam Lan hai. tuhada nam ki hai?",
    sample_vi: "Tên tôi là Lan. Tên bạn là gì?",
    sample_en: "My name is Lan. What is your name?",
    explanation_vi: "ਮੇਰਾ ਨਾਮ ... ਹੈ là giới thiệu; ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ? là hỏi tên lịch sự.",
    explanation_en: "ਮੇਰਾ ਨਾਮ ... ਹੈ introduces; ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ? asks a name politely.",
    readiness_signal_vi: "Bạn giữ ਹੈ ở cuối và đặt ਕੀ đúng chỗ.",
    readiness_signal_en: "You keep final ਹੈ and place ਕੀ correctly.",
    handoff_next_vi: "Chuyển sang gia đình khi mẫu tên đã ổn định.",
    handoff_next_en: "Move to family once name patterns are stable.",
    review_links: ["pa_a1_final_identity_001", "pa_a1_recall_identity_002"],
    learner_trap: { audience: "both", vi: "Không đặt ਕੀ ở cuối câu hỏi tên.", en: "Do not put ਕੀ at the end of the name question." },
    canada_practical: true,
  },
  {
    id: "pa_a1_journey_family_001",
    order: 4,
    stage: "family",
    activity: "guided_practice",
    title_vi: "Nói về gia đình gần",
    title_en: "Talk about close family",
    learner_goal_vi: "Tôi nói được một câu đơn giản về mẹ hoặc chị/em gái.",
    learner_goal_en: "I can say a simple sentence about my mother or sister.",
    sample_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhain hai.",
    sample_vi: "Đây là mẹ tôi. Tôi có một chị/em gái.",
    sample_en: "This is my mother. I have one sister.",
    explanation_vi: "ਮੇਰੀ đi với ਮਾਂ; ਮੇਰੇ ਕੋਲ ... ਹੈ diễn đạt sở hữu.",
    explanation_en: "ਮੇਰੀ pairs with ਮਾਂ; ਮੇਰੇ ਕੋਲ ... ਹੈ expresses possession.",
    readiness_signal_vi: "Bạn không dùng một mẫu 'my/have' cho mọi trường hợp.",
    readiness_signal_en: "You do not use one 'my/have' pattern for every case.",
    handoff_next_vi: "Chuyển sang số khi bạn phân biệt ਮੇਰਾ/ਮੇਰੀ và ਕੋਲ.",
    handoff_next_en: "Move to numbers after distinguishing ਮੇਰਾ/ਮੇਰੀ and ਕੋਲ.",
    review_links: ["pa_a1_final_family_001", "pa_a1_final_family_002"],
    learner_trap: { audience: "en", vi: "Tiếng Anh có một 'my'; Punjabi có ਮੇਰਾ/ਮੇਰੀ.", en: "English has one 'my'; Punjabi uses ਮੇਰਾ/ਮੇਰੀ." },
  },
  {
    id: "pa_a1_journey_numbers_001",
    order: 5,
    stage: "numbers",
    activity: "readiness_check",
    title_vi: "Số nhỏ cho vé và giá",
    title_en: "Small numbers for tickets and prices",
    learner_goal_vi: "Tôi nhận ra số nhỏ trong vé và giá.",
    learner_goal_en: "I recognize small numbers in tickets and prices.",
    sample_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    sample_vi: "Hai vé. Năm đô la.",
    sample_en: "Two tickets. Five dollars.",
    explanation_vi: "Số A1 nối trực tiếp với nhu cầu thực tế: vé, giá, số lượng.",
    explanation_en: "A1 numbers connect directly to practical needs: tickets, prices, quantities.",
    readiness_signal_vi: "Bạn nhận ra ਦੋ và ਪੰਜ trong Gurmukhi.",
    readiness_signal_en: "You recognize ਦੋ and ਪੰਜ in Gurmukhi.",
    handoff_next_vi: "Chuyển sang đồ ăn/nước khi bạn đọc được số trong cụm ngắn.",
    handoff_next_en: "Move to food/water after reading numbers in short phrases.",
    review_links: ["pa_a1_final_numbers_001", "pa_a1_recall_numbers_002"],
    learner_trap: { audience: "both", vi: "Đừng học số chỉ qua chữ Latin.", en: "Do not learn numbers only through Latin letters." },
    canada_practical: true,
  },
  {
    id: "pa_a1_journey_food_001",
    order: 6,
    stage: "food",
    activity: "mini_roleplay",
    title_vi: "Nói nhu cầu đồ ăn/nước",
    title_en: "State food and water needs",
    learner_goal_vi: "Tôi nói được nhu cầu cơ bản và hỏi món chay.",
    learner_goal_en: "I state a basic need and ask about vegetarian food.",
    sample_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਇਹ ਸ਼ਾਕਾਹਾਰੀ ਹੈ?",
    romanization: "mainu pani chahida hai. ki ih shakahari hai?",
    sample_vi: "Tôi cần nước. Món này có phải chay không?",
    sample_en: "I need water. Is this vegetarian?",
    explanation_vi: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ là nhu cầu; ਕੀ mở câu hỏi yes/no.",
    explanation_en: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ states need; ਕੀ opens a yes/no question.",
    readiness_signal_vi: "Bạn không nhầm 'Tôi cần nước' với 'Tôi là nước'.",
    readiness_signal_en: "You do not confuse 'I need water' with 'I am water'.",
    handoff_next_vi: "Chuyển sang chỉ đường sau khi dùng được khung nhu cầu.",
    handoff_next_en: "Move to directions after using the need frame.",
    review_links: ["pa_a1_final_food_001", "pa_a1_recall_food_002"],
    learner_trap: { audience: "vi", vi: "Giữ ਮੈਨੂੰ trong câu nhu cầu.", en: "Keep ਮੈਨੂੰ in need statements." },
    canada_practical: true,
  },
  {
    id: "pa_a1_journey_directions_001",
    order: 7,
    stage: "directions",
    activity: "guided_practice",
    title_vi: "Hỏi và hiểu chỉ đường",
    title_en: "Ask and understand directions",
    learner_goal_vi: "Tôi hỏi một nơi ở đâu và hiểu trái/phải.",
    learner_goal_en: "I ask where a place is and understand left/right.",
    sample_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ? ਸੱਜੇ ਜਾਓ।",
    romanization: "bas adda kithe hai? sajje jao.",
    sample_vi: "Bến xe buýt ở đâu? Đi bên phải.",
    sample_en: "Where is the bus stop? Go right.",
    explanation_vi: "ਕਿੱਥੇ hỏi nơi chốn; ਸੱਜੇ/ਖੱਬੇ là phải/trái.",
    explanation_en: "ਕਿੱਥੇ asks location; ਸੱਜੇ/ਖੱਬੇ are right/left.",
    readiness_signal_vi: "Bạn đặt ਕਿੱਥੇ trước ਹੈ và phân biệt ਸੱਜੇ/ਖੱਬੇ.",
    readiness_signal_en: "You place ਕਿੱਥੇ before ਹੈ and distinguish ਸੱਜੇ/ਖੱਬੇ.",
    handoff_next_vi: "Chuyển sang nhờ giúp khi bạn có thể hỏi đường ngắn.",
    handoff_next_en: "Move to help requests after asking short direction questions.",
    review_links: ["pa_a1_final_directions_001", "pa_a1_recall_directions_002"],
    learner_trap: { audience: "en", vi: "Không đảo trật tự như 'where is' tiếng Anh.", en: "Do not invert the order like English 'where is'." },
    canada_practical: true,
  },
  {
    id: "pa_a1_journey_help_001",
    order: 8,
    stage: "help",
    activity: "mini_roleplay",
    title_vi: "Xin giúp và nói không hiểu",
    title_en: "Ask for help and say you do not understand",
    learner_goal_vi: "Tôi xin giúp đỡ và nói khi không hiểu.",
    learner_goal_en: "I ask for help and say when I do not understand.",
    sample_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।",
    romanization: "kirpa karke madad karo. mainu samajh nahin aundi.",
    sample_vi: "Làm ơn giúp tôi. Tôi không hiểu.",
    sample_en: "Please help. I do not understand.",
    explanation_vi: "ਕਿਰਪਾ ਕਰਕੇ làm câu lịch sự; ਨਹੀਂ tạo phủ định.",
    explanation_en: "ਕਿਰਪਾ ਕਰਕੇ makes the sentence polite; ਨਹੀਂ marks negation.",
    readiness_signal_vi: "Bạn nói được câu giúp đỡ mà không quá cụt.",
    readiness_signal_en: "You can ask for help without sounding too abrupt.",
    handoff_next_vi: "Chuyển sang yêu cầu lịch sự trước khi vào dịch vụ Canada.",
    handoff_next_en: "Move to polite requests before Canada service scenarios.",
    review_links: ["pa_a1_final_help_001", "pa_a1_recall_help_002"],
    learner_trap: { audience: "both", vi: "Đừng bỏ lịch sự khi nhờ người lạ.", en: "Do not drop politeness when asking a stranger." },
    canada_practical: true,
  },
  {
    id: "pa_a1_journey_polite_001",
    order: 9,
    stage: "polite_requests",
    activity: "recall",
    title_vi: "Mở lời lịch sự",
    title_en: "Open politely",
    learner_goal_vi: "Tôi nói cảm ơn, xin lỗi/cho tôi hỏi và làm ơn.",
    learner_goal_en: "I say thank you, excuse me, and please.",
    sample_pa: "ਮਾਫ਼ ਕਰਨਾ। ਧੰਨਵਾਦ। ਕਿਰਪਾ ਕਰਕੇ।",
    romanization: "maf karna. dhannvad. kirpa karke.",
    sample_vi: "Xin lỗi/cho tôi hỏi. Cảm ơn. Làm ơn.",
    sample_en: "Excuse me. Thank you. Please.",
    explanation_vi: "Các cụm này giúp mở và đóng tương tác dịch vụ lịch sự.",
    explanation_en: "These phrases help open and close service interactions politely.",
    readiness_signal_vi: "Bạn biết chọn cụm lịch sự trước câu hỏi hoặc sau khi được giúp.",
    readiness_signal_en: "You know which polite phrase to use before a question or after help.",
    handoff_next_vi: "Chuyển sang tương tác dịch vụ Canada khi các cụm lịch sự đã tự nhiên.",
    handoff_next_en: "Move to Canada service interactions once polite phrases feel natural.",
    review_links: ["pa_a1_final_politeness_001", "pa_a1_final_politeness_002"],
    canada_practical: true,
  },
  {
    id: "pa_a1_journey_services_001",
    order: 10,
    stage: "canada_services",
    activity: "mini_roleplay",
    title_vi: "Quầy dịch vụ Canada",
    title_en: "Canada service counters",
    learner_goal_vi: "Tôi dùng câu đơn giản ở văn phòng trường, phòng khám hoặc quầy dịch vụ.",
    learner_goal_en: "I use simple phrases at a school office, clinic, or service counter.",
    sample_pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ। ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਦੋਂ ਹੈ?",
    romanization: "mainu form chahida hai. meri appointment kadon hai?",
    sample_vi: "Tôi cần mẫu đơn. Lịch hẹn của tôi là khi nào?",
    sample_en: "I need a form. When is my appointment?",
    explanation_vi: "Dịch vụ A1 dùng lại khung nhu cầu, thời gian và từ vựng Gurmukhi thực tế.",
    explanation_en: "A1 service language reuses need, time, and practical Gurmukhi vocabulary.",
    readiness_signal_vi: "Bạn nhận ra ਫਾਰਮ, ਅਪਾਇੰਟਮੈਂਟ, ਪਛਾਣ trong ngữ cảnh dịch vụ.",
    readiness_signal_en: "You recognize ਫਾਰਮ, ਅਪਾਇੰਟਮੈਂਟ, ਪਛਾਣ in service contexts.",
    handoff_next_vi: "Chuyển sang kiểm tra readiness A1 trước khi lên A2.",
    handoff_next_en: "Move to A1 readiness checks before going to A2.",
    review_links: ["pa_a1_final_services_001", "pa_a1_recall_service_002"],
    learner_trap: { audience: "both", vi: "Đừng luyện dịch vụ chỉ bằng tiếng Anh nghĩa; cần nhìn Gurmukhi.", en: "Do not practice services only through English meanings; look at Gurmukhi." },
    canada_practical: true,
  },
  {
    id: "pa_a1_journey_services_002",
    order: 11,
    stage: "canada_services",
    activity: "readiness_check",
    title_vi: "Giấy tờ tùy thân và xác nhận",
    title_en: "ID and confirmation",
    learner_goal_vi: "Tôi hiểu câu hỏi đơn giản về giấy tờ tùy thân.",
    learner_goal_en: "I understand a simple question about ID.",
    sample_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "ki tuhade kol pachhan hai?",
    sample_vi: "Bạn có giấy tờ tùy thân không?",
    sample_en: "Do you have ID?",
    explanation_vi: "ਪਛਾਣ nghĩa là giấy tờ tùy thân/ID; ਕੋਲ diễn đạt 'có' trong mẫu này.",
    explanation_en: "ਪਛਾਣ means identification/ID; ਕੋਲ expresses 'have' in this pattern.",
    readiness_signal_vi: "Bạn phân biệt câu ID với câu giá và địa điểm.",
    readiness_signal_en: "You distinguish the ID question from price and location questions.",
    handoff_next_vi: "Nếu còn nhầm, quay lại service recall trước handoff.",
    handoff_next_en: "If still confused, return to service recall before handoff.",
    review_links: ["pa_a1_final_services_003", "pa_a1_recall_service_003"],
    learner_trap: { audience: "en", vi: "Không dịch 'have' bằng một động từ tiếng Anh; nhớ mẫu ਕੋਲ.", en: "Do not map 'have' to one English-style verb; remember the ਕੋਲ pattern." },
    canada_practical: true,
  },
  {
    id: "pa_a1_journey_handoff_001",
    order: 12,
    stage: "a1_handoff",
    activity: "handoff",
    title_vi: "Sẵn sàng chuyển tiếp sau A1",
    title_en: "Ready for post-A1 handoff",
    learner_goal_vi: "Tôi biết mục nào đã sẵn sàng và mục nào cần ôn trước khi học tiếp.",
    learner_goal_en: "I know what is ready and what needs review before continuing.",
    sample_pa: "ਮੈਨੂੰ ਕੀ ਦੁਹਰਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
    romanization: "mainu ki duhrauna chahida hai?",
    sample_vi: "Tôi nên ôn lại gì?",
    sample_en: "What should I review?",
    explanation_vi: "Handoff tốt không tuyên bố hoàn hảo; nó chỉ rõ mục mạnh/yếu để học tiếp.",
    explanation_en: "A good handoff does not claim perfection; it identifies strengths and review areas.",
    readiness_signal_vi: "Bạn có thể chọn một mục yếu: Gurmukhi, tên, số, chỉ đường, hoặc dịch vụ.",
    readiness_signal_en: "You can pick one weak area: Gurmukhi, names, numbers, directions, or services.",
    handoff_next_vi: "Chuyển sang nội dung tiếp theo sau khi hoàn tất review mục yếu.",
    handoff_next_en: "Move to the next content after reviewing the weak area.",
    review_links: ["pa_a1_cando_services_003", "pa_a1_ready_gurmukhi_001"],
    learner_trap: { audience: "both", vi: "Không tự đánh giá chỉ bằng romanization.", en: "Do not self-assess only with romanization." },
  },
];

export default punjabiA1LearnerJourney;
