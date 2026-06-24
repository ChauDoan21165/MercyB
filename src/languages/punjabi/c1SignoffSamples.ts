// Punjabi C1 signoff samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1SignoffArea =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response"
  | "public_professional_tone";

export type PunjabiC1SignoffMode =
  | "signoff"
  | "pre_a11_signoff"
  | "seal"
  | "pre_integration";

export type PunjabiC1SignoffPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1SignoffSample = {
  id: string;
  level: "C1";
  area: PunjabiC1SignoffArea;
  mode: PunjabiC1SignoffMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  signoff_prompt_vi: string;
  signoff_prompt_en: string;
  sample: PunjabiC1SignoffPhrase;
  signoff_checks_vi: readonly string[];
  signoff_checks_en: readonly string[];
  pre_a11_signoff_checks_vi: readonly string[];
  pre_a11_signoff_checks_en: readonly string[];
  seal_notes_vi: readonly string[];
  seal_notes_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1SignoffPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1SignoffSamplesScriptAwareness = {
  vi: "Bộ signoff này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết một hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This signoff pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1SignoffSamples: PunjabiC1SignoffSample[] = [
  {
    id: "pa_c1_signoff_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "signoff",
    title_pa: "ਸਰੋਤ ਸਾਰ signoff",
    title_rom: "sarot saar signoff",
    title_vi: "Signoff cho tóm tắt nguồn",
    title_en: "Signoff for source summary",
    signoff_prompt_vi: "Dùng sample này để signoff rằng summary giữ claim, evidence và scope trước khi chốt.",
    signoff_prompt_en: "Use this sample to sign off that the summary keeps the claim, evidence, and scope before closure.",
    sample: {
      pa: "ਸਰੋਤ ਦੱਸਦਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਜਾਣਕਾਰੀ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਨੂੰ ਸੁਧਾਰ ਸਕਦੀ ਹੈ, ਅਤੇ ਇਹ ਦਾਅਵਾ ਉਡੀਕ ਸਮੇਂ ਤੇ ਵਰਤੋਂਕਾਰ ਫੀਡਬੈਕ ਨਾਲ ਸਮਰਥਿਤ ਹੈ।",
      rom: "sarot dassda hai ki spasht jankari seva di pahunch nu sudhar sakdi hai, ate ih daava udik samen te vartonkar feedback nal samarthit hai.",
      vi: "Nguồn nói rằng thông tin rõ có thể cải thiện khả năng tiếp cận dịch vụ, và claim này được hỗ trợ bằng thời gian chờ cùng phản hồi người dùng.",
      en: "The source says that clear information can improve service access, and this claim is supported by wait times and user feedback.",
    },
    signoff_checks_vi: ["Claim trung tâm rõ.", "Scope không bị phóng rộng.", "Giọng neutral."],
    signoff_checks_en: ["Central claim is clear.", "Scope is not overstretched.", "Tone stays neutral."],
    pre_a11_signoff_checks_vi: ["Có thể gắn nhãn pre-A11-signoff.", "Không cần dữ liệu live.", "Không đổi scope sau khi chốt."],
    pre_a11_signoff_checks_en: ["Can be labeled pre-A11-signoff.", "No live data needed.", "Do not change scope after closure."],
    seal_notes_vi: ["Giữ dạng signoff ngắn.", "Không chạm integration.", "Không có native-review claim."],
    seal_notes_en: ["Keep the signoff short.", "Do not touch integration.", "No native-review claim."],
    pre_integration_notes_vi: ["Không chạy A11.", "Không chạm Supabase.", "Không deploy."],
    pre_integration_notes_en: ["Does not run A11.", "Does not touch Supabase.", "No deploy."],
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source summary about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਨੂੰ ਸਰੋਤ ਨਤੀਜੇ, ਵਰਤੋਂ ਅਤੇ ਭਰੋਸੇ ਨਾਲ ਜੋੜਦਾ ਹੈ।",
      rom: "Canada vich seva di pahunch nu sarot natije, varton ate bharose nal jorda hai.",
      vi: "Tại Canada, nguồn liên hệ khả năng tiếp cận dịch vụ với kết quả, mức sử dụng và niềm tin.",
      en: "In Canada, the source links service access with outcomes, usage, and trust.",
    },
    learner_traps_vi: ["Đừng biến summary thành opinion.", "Đừng bỏ scope của nguồn."],
    learner_traps_en: ["Do not turn the summary into an opinion.", "Do not drop the source's scope."],
  },
  {
    id: "pa_c1_signoff_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "pre_a11_signoff",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ pre-A11-signoff",
    title_rom: "savdhan daava pre-A11-signoff",
    title_vi: "Claim thận trọng cho pre-A11-signoff",
    title_en: "Cautious claim for pre-A11-signoff",
    signoff_prompt_vi: "Dùng sample này để kiểm tra claim có lực nhưng vẫn giữ giới hạn evidence rõ ràng.",
    signoff_prompt_en: "Use this sample to check that the claim has force while the evidence limits stay clear.",
    sample: {
      pa: "ਮੌਜੂਦਾ ਸਬੂਤ ਇਹ ਸੰਕੇਤ ਦਿੰਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਮਦਦਗਾਰ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਪੱਧਰ ਤੇ ਲਾਗੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਮੁਲਾਂਕਣ ਦੀ ਲੋੜ ਹੈ।",
      rom: "maujuda sabut ih sanket dinde han ki navi prakiria madadgar ho sakdi hai, par vadde padhar te lagu karan ton pahlan hor mulankan di lor hai.",
      vi: "Bằng chứng hiện có gợi ý quy trình mới có thể hữu ích, nhưng cần thêm đánh giá trước khi áp dụng ở quy mô lớn.",
      en: "The current evidence suggests that the new process may be useful, but further evaluation is needed before large-scale rollout.",
    },
    signoff_checks_vi: ["Có hedge.", "Giới hạn scale rõ.", "Claim vẫn có nội dung."],
    signoff_checks_en: ["Has hedging.", "Scale limit is clear.", "The claim still has substance."],
    pre_a11_signoff_checks_vi: ["Có thể checksum mức chắc chắn.", "Có thể checksum limitation.", "Không có claim tuyệt đối."],
    pre_a11_signoff_checks_en: ["Certainty level can be checksummed.", "Limitation can be checksummed.", "No absolute claim."],
    seal_notes_vi: ["Dùng cho pre-merge signoff.", "Không cần dữ liệu live.", "Không đẩy claim quá xa."],
    seal_notes_en: ["Use for pre-merge signoff.", "No live data needed.", "Do not push the claim too far."],
    pre_integration_notes_vi: ["Không chạm scoring.", "Không chạm Azure.", "Không cần nguồn ngoài."],
    pre_integration_notes_en: ["Does not touch scoring.", "Does not touch Azure.", "No outside source needed."],
    canada_example: {
      context_vi: "Đánh giá pilot trong tổ chức tại Canada.",
      context_en: "Pilot evaluation in an organization in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਦਾ ਨਤੀਜਾ ਉਮੀਦਜਨਕ ਹੈ, ਪਰ ਇਸ ਨੂੰ ਅੰਤਿਮ ਸਬੂਤ ਨਹੀਂ ਮੰਨਣਾ ਚਾਹੀਦਾ।",
      rom: "Canada de pilot da natija umidjanak hai, par is nu antim sabut nahin mannna chahida.",
      vi: "Kết quả pilot tại Canada có triển vọng, nhưng không nên xem là bằng chứng cuối cùng.",
      en: "The Canadian pilot result is promising, but it should not be treated as final evidence.",
    },
    learner_traps_vi: ["Đừng dùng chắc chắn khi evidence còn hạn chế.", "Đừng làm claim mơ hồ quá mức."],
    learner_traps_en: ["Do not use certainty when evidence is limited.", "Do not make the claim too vague."],
  },
  {
    id: "pa_c1_signoff_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "seal",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ seal",
    title_rom: "sabut tulna seal",
    title_vi: "Seal so sánh bằng chứng",
    title_en: "Seal for evidence comparison",
    signoff_prompt_vi: "Dùng sample này để seal rằng số liệu và phản hồi được phân biệt rõ.",
    signoff_prompt_en: "Use this sample to seal that figures and feedback are clearly distinguished.",
    sample: {
      pa: "ਅੰਕੜੇ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ ਦੱਸਦੇ ਹਨ, ਜਦਕਿ ਫੀਡਬੈਕ ਲੋਕਾਂ ਦੇ ਤਜਰਬੇ ਨੂੰ ਉਭਾਰਦਾ ਹੈ; ਦੋਵੇਂ ਮਿਲ ਕੇ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਤਸਵੀਰ ਦਿੰਦੇ ਹਨ।",
      rom: "ankde badlaa di matra dassde han, jadki feedback lokan de tajarbe nu ubharda hai; dove mil ke vadhere santulit tasvir dinde han.",
      vi: "Số liệu cho biết mức độ thay đổi, còn phản hồi làm nổi bật trải nghiệm của người dùng; hai nguồn cùng nhau cho bức tranh cân bằng hơn.",
      en: "Figures show the amount of change, while feedback highlights users' experience; together they provide a more balanced picture.",
    },
    signoff_checks_vi: ["Phân biệt loại evidence.", "Kết luận vừa mức.", "Không chọn phe sớm."],
    signoff_checks_en: ["Evidence types are distinguished.", "The conclusion is measured.", "No early side-taking."],
    pre_a11_signoff_checks_vi: ["Có data và phản hồi.", "Có lý do đọc chung.", "Không vượt evidence."],
    pre_a11_signoff_checks_en: ["Has data and feedback.", "Has a reason to read them together.", "Does not exceed the evidence."],
    seal_notes_vi: ["Phù hợp seal.", "Không trộn vai trò nguồn.", "Giữ sentence compact."],
    seal_notes_en: ["Fits the seal.", "Does not mix source roles.", "Keeps the sentence compact."],
    pre_integration_notes_vi: ["Dữ liệu là sample tĩnh.", "Không chạm RLS.", "Không deploy."],
    pre_integration_notes_en: ["Data is a static sample.", "Does not touch RLS.", "No deploy."],
    canada_example: {
      context_vi: "So sánh số liệu chính thức và trải nghiệm cộng đồng tại Canada.",
      context_en: "Comparing official figures and community experience in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਕੜੇ ਅਤੇ ਭਾਈਚਾਰੇ ਦੇ ਤਜਰਬੇ ਇਕੱਠੇ ਵੇਖਣ ਨਾਲ ਨਤੀਜਾ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada vich ankde ate bhaichare de tajarbe ikathe vekhan nal natija vadhere santulit rahinda hai.",
      vi: "Tại Canada, xem số liệu cùng trải nghiệm cộng đồng giúp kết luận cân bằng hơn.",
      en: "In Canada, considering figures together with community experience keeps the conclusion more balanced.",
    },
    learner_traps_vi: ["Đừng xóa khác biệt giữa các nguồn.", "Đừng kết luận rộng hơn dữ liệu."],
    learner_traps_en: ["Do not erase differences between sources.", "Do not conclude more broadly than the data."],
  },
  {
    id: "pa_c1_signoff_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "rasmi patar-vihar pre-integration",
    title_vi: "Thư tín trang trọng trước integration",
    title_en: "Formal correspondence before integration",
    signoff_prompt_vi: "Kiểm tra email có request rõ, lịch sự và không biến thành chat trong pre-integration.",
    signoff_prompt_en: "Check that the email is clear, polite, and not chat-like during pre-integration.",
    sample: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੀਟਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਅਪਡੇਟ ਕੀਤੀ ਸੂਚੀ ਸਾਂਝੀ ਕਰ ਦਿਓ, ਤਾਂ ਜੋ ਟੀਮ ਆਪਣੇ ਸਵਾਲ ਅਤੇ ਤਰਜੀਹਾਂ ਢੰਗ ਨਾਲ ਤਿਆਰ ਕਰ ਸਕੇ।",
      rom: "kirpa karke meeting ton pahlan update kiti suchi sanjhi kar dio, tan jo team apne sawal ate tarjihan dhang nal tiar kar sake.",
      vi: "Vui lòng chia sẻ danh sách đã cập nhật trước cuộc họp để đội ngũ có thể chuẩn bị câu hỏi và ưu tiên đúng cách.",
      en: "Please share the updated list before the meeting so the team can prepare its questions and priorities properly.",
    },
    signoff_checks_vi: ["Request trực tiếp nhưng lịch sự.", "Có lý do request.", "Không trách móc."],
    signoff_checks_en: ["Request is direct but polite.", "Has a reason for the request.", "No blaming."],
    pre_a11_signoff_checks_vi: ["Có phrase lịch sự.", "Có mục đích.", "Không gửi email thật."],
    pre_a11_signoff_checks_en: ["Has a polite phrase.", "Has a purpose.", "No real email is sent."],
    seal_notes_vi: ["Dùng trong signoff pack.", "Giữ formal tone.", "Không biến thành casual chat."],
    seal_notes_en: ["Use in the signoff pack.", "Keep a formal tone.", "Do not turn it into casual chat."],
    pre_integration_notes_vi: ["Không chạm auth.", "Không chạm billing.", "Không chạy A11."],
    pre_integration_notes_en: ["Does not touch auth.", "Does not touch billing.", "Does not run A11."],
    canada_example: {
      context_vi: "Email chuẩn bị review tại workplace ở Canada.",
      context_en: "Review-preparation email in a Canadian workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਕੰਮਕਾਜੀ ਸੰਦਰਭ ਵਿੱਚ ਪਹਿਲਾਂ ਸੂਚੀ ਮੰਗਣਾ ਸਿੱਧਾ ਅਤੇ ਨਿਮਰ ਦੋਵੇਂ ਹੋ ਸਕਦਾ ਹੈ।",
      rom: "Canada de kamkaji sandarbh vich pahlan suchi mangna sidhha ate nimar dove ho sakda hai.",
      vi: "Trong workplace tại Canada, yêu cầu danh sách trước có thể vừa trực tiếp vừa lịch sự.",
      en: "In a Canadian workplace, asking for the list in advance can be both direct and polite.",
    },
    learner_traps_vi: ["Đừng dùng mệnh lệnh gắt.", "Đừng quên giải thích vì sao cần tài liệu."],
    learner_traps_en: ["Do not use a harsh command.", "Do not forget to explain why the material is needed."],
  },
  {
    id: "pa_c1_signoff_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "signoff",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ signoff",
    title_rom: "karjakari sankhep signoff",
    title_vi: "Executive summary cho signoff",
    title_en: "Executive summary for signoff",
    signoff_prompt_vi: "Dùng sample này để signoff rằng summary có priority, risk và next step trước khi chốt bộ.",
    signoff_prompt_en: "Use this sample to sign off that the summary has priority, risk, and next step before closing the pack.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਭਰੋਸੇਯੋਗਤਾ ਹੈ, ਮੁੱਖ ਜੋਖਮ ਸੀਮਿਤ ਸਟਾਫ ਸਮਾਂ ਹੈ, ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੋ ਹਫ਼ਤਿਆਂ ਦੀ ਸਮੀਖਿਆ ਪੂਰੀ ਕਰਨਾ ਹੈ।",
      rom: "mukh tarji seva di bharoseyogta hai, mukh jokham simit staff sama hai, ate agla kadam do haftian di samikhia puri karna hai.",
      vi: "Ưu tiên chính là độ tin cậy của dịch vụ, rủi ro chính là thời gian nhân sự hạn chế, và bước tiếp theo là hoàn tất review hai tuần.",
      en: "The main priority is service reliability, the main risk is limited staff time, and the next step is to complete a two-week review.",
    },
    signoff_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    signoff_checks_en: ["Has a priority.", "Has a risk.", "Has a next step."],
    pre_a11_signoff_checks_vi: ["Compact.", "Checksum được action.", "Không thành report dài."],
    pre_a11_signoff_checks_en: ["Compact.", "Action can be checksummed.", "Does not become a long report."],
    seal_notes_vi: ["Phù hợp seal.", "Không lan man.", "Giữ cấu trúc điều hành."],
    seal_notes_en: ["Fits a seal.", "Does not ramble.", "Keeps an executive structure."],
    pre_integration_notes_vi: ["Không cần nguồn ngoài.", "Không chạm audio.", "Không native-review claim."],
    pre_integration_notes_en: ["No outside source needed.", "Does not touch audio.", "No native-review claim."],
    canada_example: {
      context_vi: "Executive summary cho chương trình dịch vụ tại Canada.",
      context_en: "Executive summary for a service program in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸੇਵਾ ਪ੍ਰੋਗਰਾਮ ਲਈ ਇਹ ਸੰਖੇਪ ਤਰਜੀਹ, ਜੋਖਮ ਅਤੇ ਅਗਲੇ ਕਦਮ ਨੂੰ ਛੋਟੇ ਰੂਪ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de seva program lai ih sankhep tarji, jokham ate agle kadam nu chhote rup vich rakhda hai.",
      vi: "Cho chương trình dịch vụ tại Canada, summary này giữ priority, risk và next step ở dạng ngắn.",
      en: "For a service program in Canada, this summary keeps the priority, risk, and next step in a short form.",
    },
    learner_traps_vi: ["Đừng viết background quá dài.", "Đừng bỏ bước tiếp theo."],
    learner_traps_en: ["Do not write too much background.", "Do not omit the next step."],
  },
  {
    id: "pa_c1_signoff_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "seal",
    title_pa: "ਰਜਿਸਟਰ calibration seal",
    title_rom: "register calibration seal",
    title_vi: "Seal chỉnh register",
    title_en: "Register calibration seal",
    signoff_prompt_vi: "Kiểm tra xem câu có đủ formal, cautious và tự nhiên để seal trước khi chốt không.",
    signoff_prompt_en: "Check whether the sentence is formal, cautious, and natural enough to seal before closure.",
    sample: {
      pa: "ਇਸ ਨਤੀਜੇ ਨੂੰ ਰਿਪੋਰਟ ਵਿੱਚ ਸਾਵਧਾਨੀ ਨਾਲ ਦਰਸਾਉਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਇਹ ਸੰਭਾਵੀ ਰੁਝਾਨ ਦਿਖਾਉਂਦਾ ਹੈ ਪਰ ਕਾਰਨ ਪੱਕਾ ਨਹੀਂ ਕਰਦਾ।",
      rom: "is natije nu report vich savdhani nal darsaunda chahida hai, kyonki ih sambhavi rujhan dikhaunda hai par karan pakka nahin karda.",
      vi: "Kết quả này nên được trình bày thận trọng trong báo cáo vì nó cho thấy xu hướng có thể có nhưng không xác nhận nguyên nhân.",
      en: "This result should be presented cautiously in the report because it shows a possible trend but does not confirm the cause.",
    },
    signoff_checks_vi: ["Register formal.", "Không quá casual.", "Không làm mất nghĩa."],
    signoff_checks_en: ["Formal register.", "Not too casual.", "Does not lose meaning."],
    pre_a11_signoff_checks_vi: ["Claim cautious.", "Có limitation.", "Không phóng đại."],
    pre_a11_signoff_checks_en: ["Cautious claim.", "Has a limitation.", "No exaggeration."],
    seal_notes_vi: ["Dùng để seal trước chốt.", "Không cần audio.", "Không Azure."],
    seal_notes_en: ["Use to seal before closure.", "No audio needed.", "No Azure."],
    pre_integration_notes_vi: ["Không cần audio.", "Không pronunciation scoring.", "Không Azure."],
    pre_integration_notes_en: ["No audio needed.", "No pronunciation scoring.", "No Azure."],
    canada_example: {
      context_vi: "Memo chuyên nghiệp tại Canada.",
      context_en: "Professional memo in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਮੈਮੋ ਵਿੱਚ ਇਹ ਲਹਿਜ਼ਾ ਪੇਸ਼ਾਵਰ ਰਹਿੰਦਾ ਹੈ ਅਤੇ ਨਤੀਜੇ ਨੂੰ ਹੱਦ ਤੋਂ ਵੱਧ ਨਹੀਂ ਦਿਖਾਉਂਦਾ।",
      rom: "Canada de memo vich ih lehja peshavar rahinda hai ate natije nu hadd ton vadh nahin dikhaunda.",
      vi: "Trong memo tại Canada, giọng này chuyên nghiệp và không phóng đại kết quả.",
      en: "In a Canadian memo, this tone remains professional and does not overstate the result.",
    },
    learner_traps_vi: ["Đừng dùng từ quá casual.", "Đừng làm câu mất phần thận trọng."],
    learner_traps_en: ["Do not use overly casual wording.", "Do not lose the cautious part of the sentence."],
  },
  {
    id: "pa_c1_signoff_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "pre_a11_signoff",
    title_pa: "ਪੇਸ਼ਕਾਰੀ ਜਵਾਬ pre-A11-signoff",
    title_rom: "peshkari jawab pre-A11-signoff",
    title_vi: "Phản hồi thuyết trình cho pre-A11-signoff",
    title_en: "Presentation response for pre-A11-signoff",
    signoff_prompt_vi: "Dùng sample này để kiểm tra phản hồi Q&A có cảm ơn, trả lời trực tiếp và giữ giới hạn claim.",
    signoff_prompt_en: "Use this sample to check that the Q&A response thanks the speaker, answers directly, and keeps the claim bounded.",
    sample: {
      pa: "ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ। ਇਹ ਨਤੀਜਾ ਦਿਲਚਸਪ ਹੈ, ਪਰ ਮੈਂ ਇਸ ਨੂੰ pilot-ਸਤਰ ਦਾ ਸੰਕੇਤ ਹੀ ਕਹਾਂਗਾ ਜਦ ਤੱਕ ਵੱਡਾ ਦੁਹਰਾਓ ਨਾ ਮਿਲੇ।",
      rom: "tuhade sawal lai dhannvad. ih natija dilchasap hai, par main is nu pilot-satar da sanket hi kahanga jad tak vadda dohrao na mile.",
      vi: "Cảm ơn câu hỏi của bạn. Kết quả này thú vị, nhưng tôi chỉ gọi nó là tín hiệu ở mức pilot cho tới khi có thêm bằng chứng lặp lại ở quy mô lớn hơn.",
      en: "Thank you for the question. The result is interesting, but I would only call it a pilot-level signal until we have stronger repetition at larger scale.",
    },
    signoff_checks_vi: ["Có lời cảm ơn.", "Trả lời trực tiếp.", "Không phóng đại."],
    signoff_checks_en: ["Includes thanks.", "Answers directly.", "Does not overstate."],
    pre_a11_signoff_checks_vi: ["Có giới hạn claim.", "Có next step.", "Không thành PR."],
    pre_a11_signoff_checks_en: ["Has claim limits.", "Has a next step.", "Does not become PR copy."],
    seal_notes_vi: ["Tốt cho signoff card.", "Không cần data live.", "Giữ giọng chuyên nghiệp."],
    seal_notes_en: ["Good for a signoff card.", "No live data needed.", "Keeps a professional tone."],
    pre_integration_notes_vi: ["Không chạm auth.", "Không chạm billing.", "Không chạy A11."],
    pre_integration_notes_en: ["Does not touch auth.", "Does not touch billing.", "Does not run A11."],
    canada_example: {
      context_vi: "Phản hồi thuyết trình tại hội thảo ở Canada.",
      context_en: "Presentation response at a conference in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸੈਸ਼ਨ ਵਿੱਚ ਇਹ ਜਵਾਬ ਸਵਾਲ ਨੂੰ ਸਿੱਧਾ ਲੈਂਦਾ ਹੈ ਪਰ ਦਾਅਵੇ ਨੂੰ ਸੀਮਿਤ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de session vich ih jawab sawal nu sidhha lainda hai par daave nu simit rakhda hai.",
      vi: "Trong phiên ở Canada, phản hồi này đi thẳng vào câu hỏi nhưng giữ claim ở mức giới hạn.",
      en: "In a Canadian session, this response addresses the question directly while keeping the claim limited.",
    },
    learner_traps_vi: ["Đừng trả lời vòng quanh.", "Đừng biến Q&A thành quảng cáo."],
    learner_traps_en: ["Do not answer in circles.", "Do not turn Q&A into advertising."],
  },
  {
    id: "pa_c1_signoff_public_professional_tone",
    level: "C1",
    area: "public_professional_tone",
    mode: "signoff",
    title_pa: "ਜਨਤਕ ਪੇਸ਼ਾਵਰ ਲਹਿਜ਼ਾ signoff",
    title_rom: "jantak peshavar lehja signoff",
    title_vi: "Giọng công khai chuyên nghiệp cho signoff",
    title_en: "Public professional tone for signoff",
    signoff_prompt_vi: "Kiểm tra câu public/service có lịch sự, rõ ràng và phù hợp với bối cảnh công chúng không.",
    signoff_prompt_en: "Check that the public/service sentence is polite, clear, and appropriate for a public-facing context.",
    sample: {
      pa: "ਸੇਵਾ ਬਾਰੇ ਸਵਾਲ ਹੋਣ ਤੇ, ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕੇਸ ਨੰਬਰ ਦਿਓ, ਤਾਂ ਜੋ ਅਸੀਂ ਤੁਹਾਡੀ ਬੇਨਤੀ ਨੂੰ ਤੇਜ਼ੀ ਨਾਲ ਦੇਖ ਸਕੀਏ।",
      rom: "seva bare sawal hon te, kirpa karke apna case number dio, tan jo asi tuhadi benati nu tesi nal dekh sakiye.",
      vi: "Khi có câu hỏi về dịch vụ, vui lòng cho biết mã hồ sơ để chúng tôi có thể xem yêu cầu của bạn nhanh hơn.",
      en: "If you have a service question, please provide your case number so we can review your request faster.",
    },
    signoff_checks_vi: ["Lịch sự.", "Rõ ràng.", "Phù hợp public-facing."],
    signoff_checks_en: ["Polite.", "Clear.", "Suitable for public-facing use."],
    pre_a11_signoff_checks_vi: ["Có thể dùng trong signoff công khai.", "Không quá thân mật.", "Không chạm hệ thống thật."],
    pre_a11_signoff_checks_en: ["Can be used in a public signoff.", "Not overly familiar.", "Does not touch a real system."],
    seal_notes_vi: ["Giữ tone dịch vụ.", "Không sounding like chat.", "Không thêm cam kết quá mức."],
    seal_notes_en: ["Keep a service tone.", "Do not sound like chat.", "Do not add overpromises."],
    pre_integration_notes_vi: ["Không chạm auth.", "Không chạm billing.", "Không deploy."],
    pre_integration_notes_en: ["Does not touch auth.", "Does not touch billing.", "No deploy."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công khai tại Canada.",
      context_en: "Public service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਜਨਤਕ ਸੇਵਾ ਨੋਟਿਸ ਵਿੱਚ ਇਹ ਲਹਿਜ਼ਾ ਸਪਸ਼ਟ ਅਤੇ ਆਦਰਯੋਗ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada de jantak seva notice vich ih lehja spasht ate adar yog rahinda hai.",
      vi: "Trong thông báo dịch vụ công khai tại Canada, giọng này rõ ràng và tôn trọng.",
      en: "In a Canadian public service notice, this tone stays clear and respectful.",
    },
    learner_traps_vi: ["Đừng dùng câu quá thân mật.", "Đừng bỏ thông tin thực dụng."],
    learner_traps_en: ["Do not use overly casual wording.", "Do not omit practical information."],
  },
];
