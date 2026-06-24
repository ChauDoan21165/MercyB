// Punjabi A1 learner proof pack for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiLearnerProofDomain =
  | "greetings"
  | "self_introduction"
  | "numbers_prices"
  | "help_repair"
  | "polite_service"
  | "gurmukhi_recognition"
  | "canada_practical";

export type PunjabiLearnerProofStyle =
  | "proof_pack"
  | "final_owner_review"
  | "final_qa";

export type PunjabiLearnerProofItemA1 = {
  id: string;
  domain: PunjabiLearnerProofDomain;
  style: PunjabiLearnerProofStyle;
  learner_can_do_vi: string;
  learner_can_do_en: string;
  prompt_vi: string;
  prompt_en: string;
  evidence_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  pass_check_vi: string;
  pass_check_en: string;
  explanation_vi: string;
  explanation_en: string;
  common_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const learnerProofPackScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 proof pack. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1LearnerProofPack: PunjabiLearnerProofItemA1[] = [
  {
    id: "pa_a1_proof_greeting_001",
    domain: "greetings",
    style: "proof_pack",
    learner_can_do_vi: "Tôi có thể chào lịch sự khi bắt đầu nói chuyện.",
    learner_can_do_en: "I can greet politely when starting an interaction.",
    prompt_vi: "Chào nhân viên quầy dịch vụ cộng đồng.",
    prompt_en: "Greet a community-service counter staff member.",
    evidence_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    pass_check_vi: "Người học dùng Gurmukhi hoặc nói đúng cụm chào cốt lõi.",
    pass_check_en: "The learner uses Gurmukhi or says the core greeting correctly.",
    explanation_vi: "Đây là bằng chứng tối thiểu cho chức năng chào hỏi A1.",
    explanation_en: "This is minimal evidence for the A1 greeting function.",
    common_trap: {
      audience: "vi",
      vi: "Không đọc thêm âm /a/ sau phụ âm cuối trong romanization.",
      en: "Do not add an extra /a/ sound after the final consonant in romanization.",
    },
    canada_practical: true,
    review_links: ["pa_a1_exit_greetings_001", "pa_a1_smoke_greeting_001"],
  },
  {
    id: "pa_a1_proof_intro_001",
    domain: "self_introduction",
    style: "final_qa",
    learner_can_do_vi: "Tôi có thể nói tên mình và hỏi tên người khác.",
    learner_can_do_en: "I can say my name and ask someone else's name.",
    prompt_vi: "Nói 'Tên tôi là Nam. Tên bạn là gì?'",
    prompt_en: "Say 'My name is Nam. What is your name?'",
    evidence_pa: "ਮੇਰਾ ਨਾਮ ਨਾਮ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam Nam hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là Nam. Tên bạn là gì?",
    meaning_en: "My name is Nam. What is your name?",
    pass_check_vi: "Có cả ਮੇਰਾ ਨਾਮ ... ਹੈ và câu hỏi ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ.",
    pass_check_en: "Includes both ਮੇਰਾ ਨਾਮ ... ਹੈ and the question ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ.",
    explanation_vi: "Mẫu này kiểm tra giới thiệu bản thân và hỏi lại trong một lượt.",
    explanation_en: "This checks self-introduction and asking back in one turn.",
    common_trap: {
      audience: "en",
      vi: "Không đảo trật tự câu hỏi như tiếng Anh 'what is'.",
      en: "Do not invert the question like English 'what is'.",
    },
    review_links: ["pa_a1_exit_identity_001", "pa_a1_integration_identity_001"],
  },
  {
    id: "pa_a1_proof_numbers_price_001",
    domain: "numbers_prices",
    style: "proof_pack",
    learner_can_do_vi: "Tôi có thể nhận ra số và giá đơn giản.",
    learner_can_do_en: "I can recognize simple numbers and prices.",
    prompt_vi: "Đọc giá cho hai vé.",
    prompt_en: "Read the price for two tickets.",
    evidence_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    pass_check_vi: "Người học nhận ra ਦੋ, ਟਿਕਟਾਂ, ਪੰਜ, và ਡਾਲਰ.",
    pass_check_en: "The learner recognizes ਦੋ, ਟਿਕਟਾਂ, ਪੰਜ, and ਡਾਲਰ.",
    explanation_vi: "Đây là bằng chứng thực tế cho số, vé, và giá ở A1.",
    explanation_en: "This is practical evidence for A1 numbers, tickets, and prices.",
    common_trap: {
      audience: "both",
      vi: "Đừng chỉ học số bằng chữ Latin; hãy nhìn Gurmukhi trước.",
      en: "Do not learn numbers only in Latin letters; look at Gurmukhi first.",
    },
    canada_practical: true,
    review_links: ["pa_a1_exit_numbers_001", "pa_a1_smoke_numbers_001"],
  },
  {
    id: "pa_a1_proof_help_001",
    domain: "help_repair",
    style: "final_owner_review",
    learner_can_do_vi: "Tôi có thể xin giúp đỡ khi không hiểu.",
    learner_can_do_en: "I can ask for help when I do not understand.",
    prompt_vi: "Nói lịch sự rằng bạn cần giúp và không hiểu.",
    prompt_en: "Politely say that you need help and do not understand.",
    evidence_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।",
    romanization: "kirpa karke madad karo. mainu samajh nahin aundi.",
    meaning_vi: "Làm ơn giúp tôi. Tôi không hiểu.",
    meaning_en: "Please help me. I do not understand.",
    pass_check_vi: "Có lời xin giúp và câu phủ định với ਨਹੀਂ.",
    pass_check_en: "Includes a help request and a negative sentence with ਨਹੀਂ.",
    explanation_vi: "Bằng chứng này cho thấy người học biết sửa tình huống giao tiếp.",
    explanation_en: "This proves the learner can repair a communication problem.",
    common_trap: {
      audience: "vi",
      vi: "Cần giữ ਨਹੀਂ trong câu 'không hiểu'.",
      en: "Keep ਨਹੀਂ in the 'do not understand' sentence.",
    },
    canada_practical: true,
    review_links: ["pa_a1_exit_help_001", "pa_a1_integration_help_001"],
  },
  {
    id: "pa_a1_proof_service_repeat_001",
    domain: "polite_service",
    style: "final_qa",
    learner_can_do_vi: "Tôi có thể yêu cầu nhắc lại một cách lịch sự.",
    learner_can_do_en: "I can ask for repetition politely.",
    prompt_vi: "Ở quầy dịch vụ, yêu cầu người nói nhắc lại.",
    prompt_en: "At a service counter, ask the speaker to repeat.",
    evidence_pa: "ਮਾਫ਼ ਕਰਨਾ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "maf karna. kirpa karke dubara kaho.",
    meaning_vi: "Xin lỗi/cho tôi hỏi. Làm ơn nói lại.",
    meaning_en: "Excuse me. Please say that again.",
    pass_check_vi: "Có mở lời lịch sự và yêu cầu ਦੁਬਾਰਾ ਕਹੋ.",
    pass_check_en: "Includes a polite opener and the request ਦੁਬਾਰਾ ਕਹੋ.",
    explanation_vi: "Đây là cụm bảo vệ người học khi nghe không kịp.",
    explanation_en: "This phrase protects the learner when they miss what was said.",
    common_trap: {
      audience: "both",
      vi: "Không cần xin lỗi dài; dùng một yêu cầu rõ và lịch sự.",
      en: "No long apology is needed; use one clear polite request.",
    },
    canada_practical: true,
    review_links: ["pa_a1_exit_polite_001", "pa_a1_integration_polite_counter_001"],
  },
  {
    id: "pa_a1_proof_form_001",
    domain: "canada_practical",
    style: "proof_pack",
    learner_can_do_vi: "Tôi có thể nói tôi cần mẫu đơn.",
    learner_can_do_en: "I can say that I need a form.",
    prompt_vi: "Ở văn phòng trường hoặc trung tâm cộng đồng, nói bạn cần mẫu đơn.",
    prompt_en: "At a school office or community centre, say you need a form.",
    evidence_pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu form chahida hai",
    meaning_vi: "Tôi cần mẫu đơn.",
    meaning_en: "I need a form.",
    pass_check_vi: "Dùng được khung ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ với ਫਾਰਮ.",
    pass_check_en: "Uses the frame ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ with ਫਾਰਮ.",
    explanation_vi: "Đây là nhu cầu dịch vụ phổ biến trong bối cảnh Canada.",
    explanation_en: "This is a common service need in Canada contexts.",
    common_trap: {
      audience: "en",
      vi: "Không dịch từng chữ thành 'I form need'; học cả khung câu.",
      en: "Do not translate word-for-word as 'I form need'; learn the sentence frame.",
    },
    canada_practical: true,
    review_links: ["pa_a1_exit_canada_001", "pa_a1_service_counter_form_001"],
  },
  {
    id: "pa_a1_proof_appointment_001",
    domain: "canada_practical",
    style: "final_owner_review",
    learner_can_do_vi: "Tôi có thể nói về lịch hẹn rất đơn giản.",
    learner_can_do_en: "I can talk about a very simple appointment.",
    prompt_vi: "Nói 'Tôi có lịch hẹn' tại quầy tiếp tân.",
    prompt_en: "Say 'I have an appointment' at reception.",
    evidence_pa: "ਮੇਰੇ ਕੋਲ ਅਪਾਇੰਟਮੈਂਟ ਹੈ।",
    romanization: "mere kol appointment hai",
    meaning_vi: "Tôi có lịch hẹn.",
    meaning_en: "I have an appointment.",
    pass_check_vi: "Có ਮੇਰੇ ਕੋਲ cho 'tôi có' và từ ਅਪਾਇੰਟਮੈਂਟ.",
    pass_check_en: "Includes ਮੇਰੇ ਕੋਲ for 'I have' and the word ਅਪਾਇੰਟਮੈਂਟ.",
    explanation_vi: "Câu này phù hợp với phòng khám, trường học, hoặc dịch vụ công.",
    explanation_en: "This sentence fits clinics, schools, or public services.",
    common_trap: {
      audience: "both",
      vi: "Không bỏ ਕੋਲ trong mẫu 'tôi có'.",
      en: "Do not drop ਕੋਲ in the 'I have' frame.",
    },
    canada_practical: true,
    review_links: ["pa_a1_exit_canada_002", "pa_a1_service_counter_appointment_001"],
  },
  {
    id: "pa_a1_proof_id_001",
    domain: "canada_practical",
    style: "final_qa",
    learner_can_do_vi: "Tôi có thể nhận ra yêu cầu giấy tờ tùy thân.",
    learner_can_do_en: "I can recognize a request for identification.",
    prompt_vi: "Nhận ra câu hỏi về giấy tờ tùy thân.",
    prompt_en: "Recognize a question about identification.",
    evidence_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "ki tuhade kol pachhan hai?",
    meaning_vi: "Bạn có giấy tờ tùy thân không?",
    meaning_en: "Do you have identification?",
    pass_check_vi: "Nhận ra ਕੀ ở đầu câu hỏi và ਪਛਾਣ là giấy tờ/tính danh.",
    pass_check_en: "Recognizes ਕੀ at the start of the question and ਪਛਾਣ as identification.",
    explanation_vi: "Bằng chứng này thiên về nhận hiểu, phù hợp A1.",
    explanation_en: "This evidence is recognition-focused, which fits A1.",
    common_trap: {
      audience: "vi",
      vi: "Đừng nhầm câu hỏi có/không với câu hỏi 'cái gì'.",
      en: "Do not confuse this yes/no question with a 'what' question.",
    },
    canada_practical: true,
    review_links: ["pa_a1_exit_canada_003", "pa_a1_recognition_service_001"],
  },
  {
    id: "pa_a1_proof_gurmukhi_words_001",
    domain: "gurmukhi_recognition",
    style: "proof_pack",
    learner_can_do_vi: "Tôi có thể nhận ra vài từ sinh tồn bằng Gurmukhi.",
    learner_can_do_en: "I can recognize a few survival words in Gurmukhi.",
    prompt_vi: "Ghép các từ Gurmukhi với nghĩa.",
    prompt_en: "Match the Gurmukhi words with meanings.",
    evidence_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    pass_check_vi: "Người học đọc Gurmukhi trước khi dùng romanization.",
    pass_check_en: "The learner reads Gurmukhi before using romanization.",
    explanation_vi: "Mục này chứng minh nhận diện chữ viết, không chỉ học thuộc âm Latin.",
    explanation_en: "This proves script recognition, not only Latin-letter memorization.",
    common_trap: {
      audience: "both",
      vi: "Romanization là hỗ trợ, không phải đáp án chính.",
      en: "Romanization is support, not the main answer.",
    },
    canada_practical: true,
    review_links: ["pa_a1_exit_gurmukhi_001", "pa_a1_recognition_gurmukhi_001"],
  },
  {
    id: "pa_a1_proof_final_owner_001",
    domain: "polite_service",
    style: "final_owner_review",
    learner_can_do_vi: "Tôi có thể hoàn thành một lượt giao tiếp dịch vụ ngắn.",
    learner_can_do_en: "I can complete one short service interaction.",
    prompt_vi: "Chào, nói bạn cần nước, rồi cảm ơn.",
    prompt_en: "Greet, say you need water, then thank the person.",
    evidence_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ। ਧੰਨਵਾਦ।",
    romanization: "sat sri akal. mainu pani chahida hai. dhanvad.",
    meaning_vi: "Xin chào. Tôi cần nước. Cảm ơn.",
    meaning_en: "Hello. I need water. Thank you.",
    pass_check_vi: "Có chào hỏi, nhu cầu với ਚਾਹੀਦਾ ਹੈ, và lời cảm ơn.",
    pass_check_en: "Includes a greeting, a need with ਚਾਹੀਦਾ ਹੈ, and thanks.",
    explanation_vi: "Đây là mẫu final-owner-review nhỏ cho A1: đủ lịch sự và đủ rõ.",
    explanation_en: "This is a small final-owner-review sample for A1: polite enough and clear enough.",
    common_trap: {
      audience: "both",
      vi: "Đừng chỉ nói một danh từ; thêm khung câu nhu cầu.",
      en: "Do not say only a noun; add the need sentence frame.",
    },
    canada_practical: true,
    review_links: ["pa_a1_exit_food_001", "pa_a1_exit_polite_001"],
  },
];

export default punjabiA1LearnerProofPack;
