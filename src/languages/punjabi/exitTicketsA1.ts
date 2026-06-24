// Punjabi A1 exit tickets for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is practical learner support. Native review is deferred.

export type PunjabiExitTicketDomain =
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "food"
  | "directions"
  | "help"
  | "polite_service"
  | "gurmukhi_recognition"
  | "canada_survival";

export type PunjabiExitTicketKind =
  | "exit_ticket"
  | "final_proof"
  | "final_qa";

export type PunjabiExitTicketA1 = {
  id: string;
  domain: PunjabiExitTicketDomain;
  kind: PunjabiExitTicketKind;
  prompt_vi: string;
  prompt_en: string;
  expected_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  proof_vi: string;
  proof_en: string;
  explanation_vi: string;
  explanation_en: string;
  review_if_missed: string[];
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
};

export const exitTicketsScriptAwareness =
  "Gurmukhi is primary for these Punjabi A1 exit tickets. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1ExitTickets: PunjabiExitTicketA1[] = [
  {
    id: "pa_a1_exit_greetings_001",
    domain: "greetings",
    kind: "exit_ticket",
    prompt_vi: "Trước khi rời bài chào hỏi, nói một lời chào lịch sự.",
    prompt_en: "Before leaving greetings, say one polite greeting.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    proof_vi: "Bạn nhận ra và dùng được lời chào cơ bản.",
    proof_en: "You recognize and use the basic greeting.",
    explanation_vi: "Đây là kiểm tra nhanh nhất cho chào hỏi A1.",
    explanation_en: "This is the fastest A1 greeting check.",
    review_if_missed: ["pa_a1_smoke_greeting_001", "pa_a1_golden_greetings_001"],
    learner_trap: { audience: "vi", vi: "Không thêm nguyên âm sau âm cuối của ਸਤ.", en: "Do not add a vowel after final ਤ." },
    canada_practical: true,
  },
  {
    id: "pa_a1_exit_identity_001",
    domain: "identity",
    kind: "final_qa",
    prompt_vi: "Nói 'Tên tôi là Lan' và hỏi tên người khác.",
    prompt_en: "Say 'My name is Lan' and ask someone else's name.",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam Lan hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là Lan. Tên bạn là gì?",
    meaning_en: "My name is Lan. What is your name?",
    proof_vi: "Bạn có thể giới thiệu và hỏi tên trong một lượt.",
    proof_en: "You can introduce yourself and ask a name in one turn.",
    explanation_vi: "Mục này kiểm tra cả ਹੈ và vị trí ਕੀ.",
    explanation_en: "This checks both ਹੈ and placement of ਕੀ.",
    review_if_missed: ["pa_a1_smoke_identity_001", "pa_a1_integration_identity_001"],
    learner_trap: { audience: "both", vi: "Không đặt ਕੀ ở cuối câu hỏi tên.", en: "Do not put ਕੀ at the end of the name question." },
  },
  {
    id: "pa_a1_exit_family_001",
    domain: "family",
    kind: "exit_ticket",
    prompt_vi: "Nói một câu về mẹ và một câu có 'tôi có'.",
    prompt_en: "Say one sentence about mother and one with 'I have'.",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhain hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một chị/em gái.",
    meaning_en: "This is my mother. I have one sister.",
    proof_vi: "Bạn phân biệt ਮੇਰੀ và ਮੇਰੇ ਕੋਲ.",
    proof_en: "You distinguish ਮੇਰੀ and ਮੇਰੇ ਕੋਲ.",
    explanation_vi: "Gia đình A1 cần cả giới thiệu người và sở hữu.",
    explanation_en: "A1 family needs both introducing people and possession.",
    review_if_missed: ["pa_a1_smoke_family_001", "pa_a1_integration_family_001"],
    learner_trap: { audience: "en", vi: "Tiếng Anh có một 'my'; Punjabi đổi ਮੇਰਾ/ਮੇਰੀ.", en: "English has one 'my'; Punjabi changes ਮੇਰਾ/ਮੇਰੀ." },
  },
  {
    id: "pa_a1_exit_numbers_001",
    domain: "numbers",
    kind: "final_proof",
    prompt_vi: "Nhận ra số trong vé và giá.",
    prompt_en: "Recognize numbers in tickets and prices.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    proof_vi: "Bạn nhận ra ਦੋ và ਪੰਜ trong tình huống thực tế.",
    proof_en: "You recognize ਦੋ and ਪੰਜ in practical situations.",
    explanation_vi: "Đây là kiểm tra nhanh cho số, vé và giá.",
    explanation_en: "This is a quick check for numbers, tickets, and prices.",
    review_if_missed: ["pa_a1_smoke_numbers_001", "pa_a1_integration_numbers_001"],
    learner_trap: { audience: "both", vi: "Đừng học số chỉ bằng chữ Latin.", en: "Do not learn numbers only through Latin letters." },
    canada_practical: true,
  },
  {
    id: "pa_a1_exit_food_001",
    domain: "food",
    kind: "exit_ticket",
    prompt_vi: "Nói một nhu cầu cơ bản về nước.",
    prompt_en: "State one basic need for water.",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    proof_vi: "Bạn dùng được khung ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    proof_en: "You can use the frame ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    explanation_vi: "Đây là khung sinh tồn quan trọng ở A1.",
    explanation_en: "This is an important A1 survival frame.",
    review_if_missed: ["pa_a1_smoke_food_001", "pa_a1_golden_food_001"],
    learner_trap: { audience: "vi", vi: "Giữ ਮੈਨੂੰ trong câu nhu cầu.", en: "Keep ਮੈਨੂੰ in need statements." },
  },
  {
    id: "pa_a1_exit_directions_001",
    domain: "directions",
    kind: "final_qa",
    prompt_vi: "Hỏi bến xe buýt ở đâu và nhận ra hướng phải.",
    prompt_en: "Ask where the bus stop is and recognize right.",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ? ਸੱਜੇ ਜਾਓ।",
    romanization: "bas adda kithe hai? sajje jao.",
    meaning_vi: "Bến xe buýt ở đâu? Đi bên phải.",
    meaning_en: "Where is the bus stop? Go right.",
    proof_vi: "Bạn hỏi địa điểm và hiểu chỉ dẫn ngắn.",
    proof_en: "You ask a location and understand a short direction.",
    explanation_vi: "ਕਿੱਥੇ ਹੈ hỏi nơi chốn; ਸੱਜੇ là bên phải.",
    explanation_en: "ਕਿੱਥੇ ਹੈ asks location; ਸੱਜੇ means right.",
    review_if_missed: ["pa_a1_smoke_directions_001", "pa_a1_integration_directions_001"],
    learner_trap: { audience: "en", vi: "Không đảo như 'where is' tiếng Anh.", en: "Do not invert like English 'where is'." },
    canada_practical: true,
  },
  {
    id: "pa_a1_exit_help_001",
    domain: "help",
    kind: "exit_ticket",
    prompt_vi: "Xin giúp và nói bạn không hiểu.",
    prompt_en: "Ask for help and say you do not understand.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।",
    romanization: "kirpa karke madad karo. mainu samajh nahin aundi.",
    meaning_vi: "Làm ơn giúp tôi. Tôi không hiểu.",
    meaning_en: "Please help. I do not understand.",
    proof_vi: "Bạn sửa được tình huống giao tiếp khó.",
    proof_en: "You can repair a difficult interaction.",
    explanation_vi: "Kết hợp yêu cầu giúp với câu báo không hiểu.",
    explanation_en: "Combines a help request with saying you do not understand.",
    review_if_missed: ["pa_a1_smoke_help_001", "pa_a1_integration_help_001"],
    learner_trap: { audience: "vi", vi: "Đừng bỏ không/ਨਹੀਂ khi dịch câu phủ định.", en: "Do not miss ਨਹੀਂ in the negative sentence." },
    canada_practical: true,
  },
  {
    id: "pa_a1_exit_polite_001",
    domain: "polite_service",
    kind: "final_proof",
    prompt_vi: "Yêu cầu nhân viên nói lại một cách lịch sự.",
    prompt_en: "Politely ask a staff member to repeat.",
    expected_pa: "ਮਾਫ਼ ਕਰਨਾ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "maf karna. kirpa karke dubara kaho.",
    meaning_vi: "Xin lỗi/cho tôi hỏi. Làm ơn nói lại.",
    meaning_en: "Excuse me. Please say that again.",
    proof_vi: "Bạn biết dùng cụm lịch sự khi nghe không kịp.",
    proof_en: "You know how to use polite repair language when you miss something.",
    explanation_vi: "ਮਾਫ਼ ਕਰਨਾ mở lời; ਦੁਬਾਰਾ ਕਹੋ yêu cầu lặp lại.",
    explanation_en: "ਮਾਫ਼ ਕਰਨਾ opens politely; ਦੁਬਾਰਾ ਕਹੋ asks for repetition.",
    review_if_missed: ["pa_a1_smoke_service_003", "pa_a1_integration_polite_counter_001"],
    learner_trap: { audience: "both", vi: "Đừng im lặng khi không nghe kịp.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
  },
  {
    id: "pa_a1_exit_gurmukhi_001",
    domain: "gurmukhi_recognition",
    kind: "exit_ticket",
    prompt_vi: "Nhận ra từ sinh tồn và dịch vụ bằng Gurmukhi.",
    prompt_en: "Recognize survival and service words in Gurmukhi.",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    proof_vi: "Bạn đọc chữ Gurmukhi trước khi nhìn romanization.",
    proof_en: "You read Gurmukhi before looking at romanization.",
    explanation_vi: "Exit ticket này kiểm tra script chứ không chỉ trí nhớ Latin.",
    explanation_en: "This exit ticket checks script, not only Latin-letter memory.",
    review_if_missed: ["pa_a1_smoke_gurmukhi_001", "pa_a1_integration_gurmukhi_001"],
    learner_trap: { audience: "both", vi: "Không tự kiểm tra chỉ bằng chữ Latin.", en: "Do not self-check only with Latin letters." },
    canada_practical: true,
  },
  {
    id: "pa_a1_exit_canada_001",
    domain: "canada_survival",
    kind: "final_proof",
    prompt_vi: "Ở văn phòng trường hoặc dịch vụ cộng đồng, nói bạn cần mẫu đơn.",
    prompt_en: "At a school or community service counter, say you need a form.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "sat sri akal. mainu form chahida hai.",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn.",
    meaning_en: "Hello. I need a form.",
    proof_vi: "Bạn kết hợp chào hỏi với nhu cầu dịch vụ đơn giản.",
    proof_en: "You combine a greeting with a simple service need.",
    explanation_vi: "Mẫu này phù hợp với bối cảnh Canada thực tế.",
    explanation_en: "This sample fits practical Canada contexts.",
    review_if_missed: ["pa_a1_smoke_service_001", "pa_a1_integration_canada_001"],
    canada_practical: true,
  },
  {
    id: "pa_a1_exit_canada_002",
    domain: "canada_survival",
    kind: "final_qa",
    prompt_vi: "Nhận ra câu hỏi về lịch hẹn và giấy tờ tùy thân.",
    prompt_en: "Recognize appointment and identification questions.",
    expected_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਦੋਂ ਹੈ? ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "meri appointment kadon hai? ki tuhade kol pachhan hai?",
    meaning_vi: "Lịch hẹn của tôi là khi nào? Bạn có giấy tờ tùy thân không?",
    meaning_en: "When is my appointment? Do you have ID?",
    proof_vi: "Bạn nhận ra ਅਪਾਇੰਟਮੈਂਟ, ਕਦੋਂ, ਪਛਾਣ và ਕੋਲ.",
    proof_en: "You recognize ਅਪਾਇੰਟਮੈਂਟ, ਕਦੋਂ, ਪਛਾਣ, and ਕੋਲ.",
    explanation_vi: "Đây là bằng chứng cuối cho dịch vụ phòng khám/công cộng A1.",
    explanation_en: "This is final evidence for A1 clinic/public-counter service language.",
    review_if_missed: ["pa_a1_smoke_service_002", "pa_a1_integration_canada_002"],
    learner_trap: { audience: "en", vi: "Punjabi dùng ਕੋਲ cho 'have' trong mẫu này.", en: "Punjabi uses ਕੋਲ for 'have' in this pattern." },
    canada_practical: true,
  },
];

export default punjabiA1ExitTickets;
