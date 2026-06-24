// Punjabi C1 register calibration for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiRegisterCalibrationAreaC1 =
  | "formal_writing"
  | "academic_summary"
  | "argument_revision"
  | "professional_correspondence"
  | "public_service_notice"
  | "presentation_response"
  | "cautious_claim"
  | "community_response";

export type PunjabiRegisterCalibrationModeC1 =
  | "register_shift"
  | "final_hardening"
  | "review_check";

export type PunjabiRegisterCalibrationPhraseC1 = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiRegisterCalibrationCardC1 = {
  id: string;
  level: "C1";
  area: PunjabiRegisterCalibrationAreaC1;
  mode: PunjabiRegisterCalibrationModeC1;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  stress_prompt_vi: string;
  stress_prompt_en: string;
  response_frame: PunjabiRegisterCalibrationPhraseC1;
  risk_signals_vi: readonly string[];
  risk_signals_en: readonly string[];
  final_qa_vi: readonly string[];
  final_qa_en: readonly string[];
  canada_example: PunjabiRegisterCalibrationPhraseC1 & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const registerCalibrationScriptAwarenessC1 = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const registerCalibrationC1: PunjabiRegisterCalibrationCardC1[] = [
  {
    id: "pa_c1_register_formal_writing",
    level: "C1",
    area: "formal_writing",
    mode: "register_shift",
    title_pa: "ਰਸਮੀ ਲਿਖਤ ਦੀ ਤਰਤੀਬ",
    title_rom: "rasmi likhat di tartib",
    title_vi: "Điều chỉnh văn phong trang trọng",
    title_en: "Formal writing register calibration",
    stress_prompt_vi: "Viết mở đầu trang trọng khi cần nêu giới hạn mà không làm yếu lập luận.",
    stress_prompt_en: "Write a formal opening when you need to state limits without weakening the argument.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਇਹ ਦਰਸਾਉਂਦੀ ਹੈ ਕਿ ਅਸੀਂ ਨਤੀਜੇ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹੀਏ ਅਤੇ ਹੋਰ ਸਬੂਤ ਦੀ ਉਡੀਕ ਕਰੀਏ।",
      rom: "uplabdh jankari ih darsaundi hai ki asi natije nu savdhani nal parhiye ate hor sabut di udik kariye.",
      vi: "Thông tin hiện có cho thấy nên đọc kết quả thận trọng và chờ thêm bằng chứng.",
      en: "The information available suggests that we should read the finding cautiously and wait for more evidence.",
    },
    risk_signals_vi: ["Giữ giọng trang trọng.", "Có giới hạn rõ.", "Không làm câu yếu đi."],
    risk_signals_en: ["Keeps a formal tone.", "States limits clearly.", "Does not weaken the sentence."],
    final_qa_vi: ["Có hedge.", "Không quá đời thường.", "Vẫn có lập trường."],
    final_qa_en: ["Has hedging.", "Not too casual.", "Still has a position."],
    canada_example: {
      context_vi: "Văn bản trang trọng cho bối cảnh Canada.",
      context_en: "Formal text for a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਰਿਪੋਰਟ ਲਈ ਇਹ ਕਹਿਣਾ ਢੰਗੀ ਹੈ ਕਿ ਮੌਜੂਦਾ ਸਬੂਤ ਪੂਰੇ ਨਹੀਂ ਹਨ।",
      rom: "Canada vich report lai ih kahna dangi hai ki maujuda sabut pure nahin han.",
      vi: "Trong báo cáo ở Canada, nên nói rằng bằng chứng hiện có chưa đầy đủ.",
      en: "In a report in Canada, it is appropriate to say that the current evidence is not complete.",
    },
    learner_traps_vi: ["Đừng viết như đang nói chuyện thân mật.", "Đừng tuyên bố quá chắc."],
    learner_traps_en: ["Do not write like a casual conversation.", "Do not sound overly certain."],
  },
  {
    id: "pa_c1_register_academic_summary",
    level: "C1",
    area: "academic_summary",
    mode: "final_hardening",
    title_pa: "ਅਕਾਦਮਿਕ ਸਾਰ ਦੀ ਸੁਰ-ਠੀਕ",
    title_rom: "academic saar di sur-thik",
    title_vi: "Chỉnh giọng tóm tắt học thuật",
    title_en: "Academic summary register calibration",
    stress_prompt_vi: "Tóm tắt một nghiên cứu bằng giọng học thuật ngắn gọn, không phô diễn.",
    stress_prompt_en: "Summarize a study in a concise academic voice without sounding showy.",
    response_frame: {
      pa: "ਲੇਖ ਦਾ ਕੇਂਦਰੀ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਢਾਂਚਾ ਸਪਸ਼ਟ ਹੋਣ ਨਾਲ ਪਾਠਕ ਦੀ ਸਮਝ ਬਿਹਤਰ ਹੁੰਦੀ ਹੈ।",
      rom: "lekh da kendri natija ih hai ki dhaanchha spasht hon nal pathak di samajh behtar hundi hai.",
      vi: "Kết luận trung tâm của bài là cấu trúc rõ ràng giúp người đọc hiểu tốt hơn.",
      en: "The article's central finding is that clear structure improves reader comprehension.",
    },
    risk_signals_vi: ["Có tone học thuật.", "Nén được ý chính.", "Không thêm màu cá nhân."],
    risk_signals_en: ["Academic tone is present.", "Compresses the main idea.", "Adds no personal colouring."],
    final_qa_vi: ["Ngắn mà đủ.", "Không biến thành bình luận.", "Phù hợp bản tóm tắt."],
    final_qa_en: ["Short but sufficient.", "Does not become commentary.", "Fits a summary."],
    canada_example: {
      context_vi: "Tóm tắt học thuật trong bối cảnh Canada.",
      context_en: "Academic summary in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਸਪਸ਼ਟ ਬਣਤਰ ਨੂੰ ਪੜ੍ਹਨਯੋਗਤਾ ਦਾ ਮੁੱਖ ਕਾਰਨ ਦੱਸਿਆ ਗਿਆ ਹੈ।",
      rom: "Canada di report vich spasht bantrar nu parhn yogyta da mukh karan dassia gaya hai.",
      vi: "Trong báo cáo ở Canada, cấu trúc rõ được nêu là lý do chính cho khả năng đọc hiểu.",
      en: "In the Canadian report, clear structure is named as the main reason for readability.",
    },
    learner_traps_vi: ["Đừng biến tóm tắt thành đánh giá.", "Đừng làm văn phong quá cứng."],
    learner_traps_en: ["Do not turn the summary into an evaluation.", "Do not make the style too rigid."],
  },
  {
    id: "pa_c1_register_argument_revision",
    level: "C1",
    area: "argument_revision",
    mode: "review_check",
    title_pa: "ਦਲੀਲ ਦੀ ਸੋਧ",
    title_rom: "dalil di sodh",
    title_vi: "Chỉnh sửa lập luận",
    title_en: "Argument revision register calibration",
    stress_prompt_vi: "Sửa một lập luận để bớt tuyệt đối mà vẫn giữ sức thuyết phục.",
    stress_prompt_en: "Revise an argument to sound less absolute while still persuasive.",
    response_frame: {
      pa: "ਇਹ ਰੁਝਾਨ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਇਕੱਲਾ ਸਬੂਤ ਨਹੀਂ ਮੰਨਿਆ ਜਾਣਾ ਚਾਹੀਦਾ। ਹੋਰ ਸਰੋਤਾਂ ਨਾਲ ਮਿਲਾ ਕੇ ਦੇਖਣ ਨਾਲ ਨਤੀਜਾ ਵਧੇਰੇ ਭਰੋਸੇਯੋਗ ਬਣਦਾ ਹੈ।",
      rom: "ih rujhan mahatvapuran hai, par is nu ikalla sabut nahin mannia jana chahida. hor srotan nal mila ke dekhhan nal natija vadere bharoseyog bannda hai.",
      vi: "Xu hướng này là quan trọng, nhưng không nên coi là bằng chứng duy nhất. Khi ghép với nguồn khác, kết quả đáng tin hơn.",
      en: "This trend is important, but it should not be treated as the only evidence. When combined with other sources, the conclusion becomes more reliable.",
    },
    risk_signals_vi: ["Không tuyệt đối hóa.", "Có điều chỉnh lập luận.", "Giữ sức nặng."],
    risk_signals_en: ["Does not over-absolute the claim.", "Revises the argument.", "Keeps force."],
    final_qa_vi: ["Có thay đổi register.", "Có logic bổ sung.", "Không mất trọng tâm."],
    final_qa_en: ["Register changes are present.", "Adds logic.", "Does not lose focus."],
    canada_example: {
      context_vi: "Sửa lập luận cho báo cáo ở Canada.",
      context_en: "Revising an argument for a report in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਅਧਿਐਨ ਵਿੱਚ ਇਹ ਕਹਿਣਾ ਠੀਕ ਹੈ ਕਿ ਨਤੀਜਾ ਮਜ਼ਬੂਤ ਹੈ, ਪਰ ਇਕੱਲਾ ਨਹੀਂ।",
      rom: "Canada de adhiyan vich ih kahna theek hai ki natija mazbut hai, par ikalla nahin.",
      vi: "Trong nghiên cứu ở Canada, nên nói kết quả mạnh, nhưng không phải duy nhất.",
      en: "In the Canadian study, it is fine to say the result is strong, but not exclusive.",
    },
    learner_traps_vi: ["Đừng viết quá cứng đầu.", "Đừng làm mất sức thuyết phục."],
    learner_traps_en: ["Do not sound stubborn.", "Do not lose persuasive force."],
  },
  {
    id: "pa_c1_register_professional_correspondence",
    level: "C1",
    area: "professional_correspondence",
    mode: "register_shift",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪੱਤਰ-ਵਿਹਾਰ",
    title_rom: "peshavar patar-vihar",
    title_vi: "Thư tín chuyên nghiệp",
    title_en: "Professional correspondence register calibration",
    stress_prompt_vi: "Viết email theo dõi tiến độ mà vẫn lịch sự và hiệu quả.",
    stress_prompt_en: "Write a progress follow-up email that stays polite and effective.",
    response_frame: {
      pa: "ਮੈਂ ਪਿਛਲੇ ਸੁਨੇਹੇ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ ਹਾਂ। ਜੇ ਤੁਸੀਂ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰ ਸਕੋ, ਤਾਂ ਅਗਲੇ ਕਦਮ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਵਿੱਚ ਸਹੂਲਤ ਰਹੇਗੀ।",
      rom: "main pichhle sunehe bare nimar follow-up kar riha han. je tusi update sanjha kar sako, tan agle kadam di yojna banauan vich sahulat rahegi.",
      vi: "Tôi xin follow-up lịch sự về tin nhắn trước. Nếu bạn có thể chia sẻ cập nhật, việc lên kế hoạch cho bước tiếp theo sẽ thuận hơn.",
      en: "I am politely following up on the previous message. If you can share an update, it will make planning the next step easier.",
    },
    risk_signals_vi: ["Lịch sự.", "Có mục tiêu.", "Không gây áp lực."],
    risk_signals_en: ["Polite tone.", "Has a goal.", "Not pressuring."],
    final_qa_vi: ["Không giống chat.", "Có next step.", "Phù hợp môi trường công việc."],
    final_qa_en: ["Not chat-like.", "Has a next step.", "Fits a workplace setting."],
    canada_example: {
      context_vi: "Email chuyên nghiệp trong bối cảnh Canada.",
      context_en: "Professional email in a Canadian context.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਨੂੰ ਭੇਜੇ ਸੁਨੇਹੇ ਵਿੱਚ ਮਿਤਭਾਸ਼ੀ ਅਤੇ ਸਪਸ਼ਟਤਾ ਦੋਵੇਂ ਜ਼ਰੂਰੀ ਹਨ।",
      rom: "Canada de daftar nu bheje sunehe vich mitbhashi ate spashtata dovein zaruri han.",
      vi: "Trong email gửi văn phòng ở Canada, cả sự tiết chế và rõ ràng đều quan trọng.",
      en: "In an email sent to an office in Canada, both restraint and clarity matter.",
    },
    learner_traps_vi: ["Đừng quá lạnh.", "Đừng quá thân mật."],
    learner_traps_en: ["Do not sound cold.", "Do not sound too familiar."],
  },
  {
    id: "pa_c1_register_public_service_notice",
    level: "C1",
    area: "public_service_notice",
    mode: "final_hardening",
    title_pa: "ਜਨਤਕ ਸੂਚਨਾ",
    title_rom: "jantak suchna",
    title_vi: "Thông báo công cộng",
    title_en: "Public-service notice register calibration",
    stress_prompt_vi: "Viết thông báo ngắn cho nhiều người bị ảnh hưởng và cần bước tiếp theo rõ ràng.",
    stress_prompt_en: "Write a short notice for many affected people when the next step must be clear.",
    response_frame: {
      pa: "ਸੇਵਾ ਸਮੇਂ ਵਿੱਚ ਤਬਦੀਲੀ ਅਗਲੇ ਸੋਮਵਾਰ ਤੋਂ ਲਾਗੂ ਹੋਵੇਗੀ। ਜਿਨ੍ਹਾਂ ਲੋਕਾਂ ਦੀ ਮੀਟਿੰਗ ਬੁਕ ਹੈ, ਉਨ੍ਹਾਂ ਨੂੰ ਨਵਾਂ ਸਮਾਂ ਈਮੇਲ ਰਾਹੀਂ ਮਿਲੇਗਾ। ਮਦਦ ਲਈ ਸੇਵਾ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      rom: "seva samen vich tabdili agle somvar ton lagu hovegi. jinhan lokan di meeting book hai, unha nu nava sama email rahin milega. madad lai seva kendar nal sampark karo.",
      vi: "Thay đổi giờ dịch vụ sẽ áp dụng từ thứ Hai tới. Người đã đặt lịch sẽ nhận giờ mới qua email. Hãy liên hệ trung tâm dịch vụ để được hỗ trợ.",
      en: "The service-hours change will take effect next Monday. People with booked appointments will receive a new time by email. Contact the service centre for help.",
    },
    risk_signals_vi: ["Người bị ảnh hưởng rõ.", "Bước tiếp theo rõ.", "Có hỗ trợ tiếp cận."],
    risk_signals_en: ["Affected people are clear.", "Next step is clear.", "Access support is present."],
    final_qa_vi: ["Không có jargon nội bộ.", "Có chỉ dẫn hành động.", "Giọng công bằng."],
    final_qa_en: ["No internal jargon.", "Has action guidance.", "Fair tone."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công tại Canada.",
      context_en: "Public-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੀਂ ਸੇਵਾ ਲਈ ਵੈੱਬਸਾਈਟ ਅਤੇ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਦੋਵੇਂ ਸਪਸ਼ਟ ਦਿੱਤੇ ਜਾਣ।",
      rom: "Canada vich navi seva lai website ate bhasha sahaita dovein spasht ditte jan.",
      vi: "Tại Canada, với dịch vụ mới, website và hỗ trợ ngôn ngữ đều nên được nêu rõ.",
      en: "In Canada, for a new service, both the website and language support should be stated clearly.",
    },
    learner_traps_vi: ["Đừng viết như email nội bộ.", "Đừng quên người đọc cần làm gì."],
    learner_traps_en: ["Do not write it like an internal email.", "Do not forget what the reader should do."],
  },
  {
    id: "pa_c1_register_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "review_check",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਦੇ ਜਵਾਬ",
    title_rom: "peshkari de jawab",
    title_vi: "Phản hồi sau thuyết trình",
    title_en: "Presentation response register calibration",
    stress_prompt_vi: "Trả lời câu hỏi khó sau thuyết trình mà vẫn giữ mức chắc chắn vừa đủ.",
    stress_prompt_en: "Answer a hard question after a presentation while keeping measured confidence.",
    response_frame: {
      pa: "ਇਹ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ ਕਿਉਂਕਿ ਇਹ ਡਾਟਾ ਦੀ ਸੀਮਾ ਵੱਲ ਧਿਆਨ ਦਿਵਾਉਂਦਾ ਹੈ। ਨਮੂਨਾ ਹਾਲੇ ਛੋਟਾ ਹੈ, ਪਰ ਰੁਝਾਨ ਅਗਲੇ ਅਧਿਐਨ ਲਈ ਲਾਭਦਾਇਕ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
      rom: "ih sawal mahatvapuran hai kyonki ih data di sima vall dhian divaunda hai. namuna hale chhota hai, par rujhan agle adhiyan lai labhdaik disha dinda hai.",
      vi: "Câu hỏi này quan trọng vì nó chỉ ra giới hạn dữ liệu. Mẫu còn nhỏ, nhưng xu hướng này cho hướng hữu ích cho nghiên cứu tiếp theo.",
      en: "This question is important because it points to a data limitation. The sample is still small, but the trend gives a useful direction for the next study.",
    },
    risk_signals_vi: ["Công nhận câu hỏi.", "Nêu giới hạn.", "Không phòng thủ."],
    risk_signals_en: ["Acknowledges the question.", "States the limitation.", "Not defensive."],
    final_qa_vi: ["Không né câu hỏi.", "Không nói quá chắc.", "Có hướng tiếp theo."],
    final_qa_en: ["Does not dodge the question.", "Does not sound too certain.", "Has next direction."],
    canada_example: {
      context_vi: "Q&A thuyết trình tại Canada.",
      context_en: "Presentation Q&A in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਰਸ਼ਕਾਂ ਲਈ ਇਹ ਕਹਿਣਾ ਢੰਗੀ ਹੈ ਕਿ ਨਤੀਜੇ ਹਾਲੇ ਸ਼ੁਰੂਆਤੀ ਹਨ।",
      rom: "Canada de darshkan lai ih kahna dangi hai ki natije hale shuruaati han.",
      vi: "Với khán giả ở Canada, nên nói kết quả vẫn còn ở giai đoạn đầu.",
      en: "For an audience in Canada, it is appropriate to say the results are still early-stage.",
    },
    learner_traps_vi: ["Đừng trả lời như đang cãi nhau.", "Đừng phóng đại mẫu nhỏ."],
    learner_traps_en: ["Do not answer as if arguing.", "Do not overstate a small sample."],
  },
  {
    id: "pa_c1_register_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "register_shift",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ",
    title_rom: "savdhan daava",
    title_vi: "Claim thận trọng",
    title_en: "Cautious claim register calibration",
    stress_prompt_vi: "Viết claim có lực nhưng vẫn nhấn mạnh giới hạn dữ liệu.",
    stress_prompt_en: "Write a claim that has force while still emphasizing data limits.",
    response_frame: {
      pa: "ਉਪਲਬਧ ਅੰਕੜੇ ਇਹ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਲੰਬੇ ਸਮੇਂ ਦੇ ਪ੍ਰਭਾਵ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "uplabdh ankre ih sujhaounde han ki navi prakiria madadgar ho sakdi hai, par lambe samen de prabhav lai hor samikhia lorindi hai.",
      vi: "Số liệu hiện có gợi ý quy trình mới có thể hữu ích, nhưng tác động dài hạn cần được xem xét thêm.",
      en: "The available figures suggest that the new process may be helpful, but the long-term effect needs further review.",
    },
    risk_signals_vi: ["Có hedge.", "Không quá chắc.", "Vẫn có lực."],
    risk_signals_en: ["Has hedging.", "Not overly certain.", "Still has force."],
    final_qa_vi: ["Không dùng ngôn ngữ tuyệt đối.", "Có hạn chế dài hạn.", "Không mất lập trường."],
    final_qa_en: ["No absolute language.", "States a long-term limit.", "Does not lose stance."],
    canada_example: {
      context_vi: "Claim thận trọng về pilot tại Canada.",
      context_en: "Cautious claim about a pilot in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਤੋਂ ਲੱਗਦਾ ਹੈ ਕਿ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ, ਪਰ ਹੋਰ ਡਾਟਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de pilot ton lagda hai ki online booking madad kar sakdi hai, par hor data chahida hai.",
      vi: "Từ pilot tại Canada, có vẻ đặt lịch trực tuyến có thể giúp ích, nhưng cần thêm dữ liệu.",
      en: "The Canadian pilot suggests that online booking may help, but more data is needed.",
    },
    learner_traps_vi: ["Đừng nói chắc từ dữ liệu ngắn.", "Đừng hedge nhiều đến mức mất ý."],
    learner_traps_en: ["Do not sound certain from short data.", "Do not hedge so much that meaning disappears."],
  },
  {
    id: "pa_c1_register_community_response",
    level: "C1",
    area: "community_response",
    mode: "final_hardening",
    title_pa: "ਸਨਮਾਨੀ ਸਮੁਦਾਇਕ ਜਵਾਬ",
    title_rom: "sanmani samudayik jawab",
    title_vi: "Phản hồi cộng đồng tôn trọng",
    title_en: "Respectful community response register calibration",
    stress_prompt_vi: "Viết phản hồi cho cộng đồng khi cần lịch sự, gần gũi vừa phải và rõ ràng.",
    stress_prompt_en: "Write a community-facing response that stays respectful, moderately warm, and clear.",
    response_frame: {
      pa: "ਅਸੀਂ ਤੁਹਾਡੀ ਚਿੰਤਾ ਨੂੰ ਸਵੀਕਾਰ ਕਰਦੇ ਹਾਂ ਅਤੇ ਅਗਲੇ ਅਪਡੇਟ ਵਿੱਚ ਹੋਰ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕਰਾਂਗੇ। ਜੇ ਤੁਹਾਨੂੰ ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਸਾਨੂੰ ਦੱਸੋ।",
      rom: "asi tuhadi chinta nu sweekar karde han ate agle update vich hor jankari sanjhi karange. je tuhanu bhasha sahaita chahidi hai, kirpa karke sanu dasso.",
      vi: "Chúng tôi ghi nhận mối quan tâm của bạn và sẽ chia sẻ thêm thông tin trong bản cập nhật tới. Nếu bạn cần hỗ trợ ngôn ngữ, vui lòng cho chúng tôi biết.",
      en: "We acknowledge your concern and will share more information in the next update. If you need language support, please let us know.",
    },
    risk_signals_vi: ["Tôn trọng cộng đồng.", "Không quá thân mật.", "Có hỗ trợ."],
    risk_signals_en: ["Respectful to community.", "Not too casual.", "Support is present."],
    final_qa_vi: ["Giọng cân bằng.", "Có chỗ cho follow-up.", "Không thành khẩu hiệu."],
    final_qa_en: ["Balanced tone.", "Leaves room for follow-up.", "Does not become a slogan."],
    canada_example: {
      context_vi: "Phản hồi cộng đồng tại Canada.",
      context_en: "Community response in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਕਮਿਊਨਿਟੀ ਲਈ ਸਪਸ਼ਟਤਾ ਅਤੇ ਆਦਰ ਇਕੱਠੇ ਰੱਖਣੇ ਚਾਹੀਦੇ ਹਨ।",
      rom: "Canada di community lai spashtata ate adar ikatthe rakhne chahide han.",
      vi: "Với cộng đồng ở Canada, cần giữ đồng thời sự rõ ràng và tôn trọng.",
      en: "For a community in Canada, clarity and respect should be kept together.",
    },
    learner_traps_vi: ["Đừng quá xa cách.", "Đừng quá suồng sã."],
    learner_traps_en: ["Do not sound distant.", "Do not sound overly familiar."],
  },
];
