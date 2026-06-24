// Punjabi C1 acceptance samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1AcceptanceArea =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response"
  | "public_professional_tone";

export type PunjabiC1AcceptanceMode =
  | "acceptance"
  | "ship_candidate"
  | "go_no_go"
  | "pre_integration";

export type PunjabiC1AcceptancePhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1AcceptanceSample = {
  id: string;
  level: "C1";
  area: PunjabiC1AcceptanceArea;
  mode: PunjabiC1AcceptanceMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  acceptance_prompt_vi: string;
  acceptance_prompt_en: string;
  sample: PunjabiC1AcceptancePhrase;
  acceptance_checks_vi: readonly string[];
  acceptance_checks_en: readonly string[];
  ship_candidate_checks_vi: readonly string[];
  ship_candidate_checks_en: readonly string[];
  go_no_go_notes_vi: readonly string[];
  go_no_go_notes_en: readonly string[];
  canada_example: PunjabiC1AcceptancePhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1AcceptanceSamplesScriptAwareness = {
  vi: "Bộ này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết một hệ chữ Punjabi khác, không phải phần học chính.",
  en: "This pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main course script.",
} as const;

export const c1AcceptanceSamples: PunjabiC1AcceptanceSample[] = [
  {
    id: "pa_c1_acceptance_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "acceptance",
    title_pa: "ਸਰੋਤ ਸਾਰ acceptance",
    title_rom: "sarot saar acceptance",
    title_vi: "Acceptance tóm tắt nguồn",
    title_en: "Source summary acceptance",
    acceptance_prompt_vi: "Duyệt summary nếu claim, evidence và source voice đều còn nguyên.",
    acceptance_prompt_en: "Accept the summary if the claim, evidence, and source voice are preserved.",
    sample: {
      pa: "ਸਰੋਤ ਦੱਸਦਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਜਾਣਕਾਰੀ ਨਾਲ ਲੋਕ ਸੇਵਾ ਦੀ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਵਧੇਰੇ ਭਰੋਸੇਯੋਗ ਸਮਝਦੇ ਹਨ।",
      rom: "sarot dassda hai ki spasht jankari nal lok seva di prakiria nu vadhere bharoseyog samajhde han.",
      vi: "Nguồn cho biết thông tin rõ giúp người dân xem quy trình dịch vụ là đáng tin hơn.",
      en: "The source states that clear information helps people view the service process as more trustworthy.",
    },
    acceptance_checks_vi: ["Claim giữ đúng nguồn.", "Evidence không bị thêm bớt.", "Giọng vẫn trung lập."],
    acceptance_checks_en: ["Claim matches the source.", "Evidence is not added or removed.", "Tone remains neutral."],
    ship_candidate_checks_vi: ["Có thể dùng trong review cuối.", "Không cần dữ liệu live.", "Không có claim thời sự."],
    ship_candidate_checks_en: ["Usable in final review.", "No live data needed.", "No current-news claim."],
    go_no_go_notes_vi: ["Go nếu không thêm opinion.", "No-go nếu biến summary thành critique.", "Go nếu đủ ngắn cho app data."],
    go_no_go_notes_en: ["Go if no opinion is added.", "No-go if the summary becomes critique.", "Go if compact enough for app data."],
    canada_example: {
      context_vi: "Summary về dịch vụ công cộng tại Canada.",
      context_en: "Summary about public services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਜਾਣਕਾਰੀ ਦੀ ਸਪਸ਼ਟਤਾ ਭਰੋਸੇ ਅਤੇ ਪਹੁੰਚ ਦੋਵਾਂ ਨਾਲ ਜੁੜਦੀ ਹੈ।",
      rom: "Canada vich seva jankari di spashtata bharose ate pahunch dovan nal jurdi hai.",
      vi: "Tại Canada, sự rõ ràng của thông tin dịch vụ liên quan đến cả niềm tin và khả năng tiếp cận.",
      en: "In Canada, clarity of service information is connected to both trust and access.",
    },
    learner_traps_vi: ["Đừng thêm đánh giá cá nhân.", "Đừng bỏ mất điều kiện hoặc giới hạn của nguồn."],
    learner_traps_en: ["Do not add personal evaluation.", "Do not lose the source's conditions or limits."],
  },
  {
    id: "pa_c1_acceptance_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "ship_candidate",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ ship-candidate",
    title_rom: "savdhan daava ship-candidate",
    title_vi: "Ship-candidate claim thận trọng",
    title_en: "Cautious claim ship candidate",
    acceptance_prompt_vi: "Duyệt nếu claim đủ rõ nhưng vẫn có hedge và giới hạn phạm vi.",
    acceptance_prompt_en: "Accept if the claim is clear while keeping hedging and scope limits.",
    sample: {
      pa: "ਇਹ ਨਤੀਜੇ ਸੰਕੇਤ ਦਿੰਦੇ ਹਨ ਕਿ ਨਵੀਂ ਪ੍ਰਕਿਰਿਆ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ, ਹਾਲਾਂਕਿ ਵੱਡੇ ਪੱਧਰ ਤੇ ਹੋਰ ਜਾਂਚ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "ih natije sanket dinde han ki navi prakiria labhdaik ho sakdi hai, halanki vadde padhar te hor janch lorindi hai.",
      vi: "Các kết quả này cho thấy quy trình mới có thể hữu ích, tuy nhiên vẫn cần kiểm tra thêm ở quy mô lớn.",
      en: "These results indicate that the new process may be useful, although further testing at a larger scale is needed.",
    },
    acceptance_checks_vi: ["Có hedge rõ.", "Phạm vi không bị phóng đại.", "Kết luận vẫn có ích."],
    acceptance_checks_en: ["Clear hedging.", "Scope is not exaggerated.", "Conclusion remains useful."],
    ship_candidate_checks_vi: ["Phù hợp acceptance review.", "Không suy diễn quá evidence.", "Không cần nguồn ngoài."],
    ship_candidate_checks_en: ["Fits acceptance review.", "Does not exceed the evidence.", "No outside source required."],
    go_no_go_notes_vi: ["Go nếu hedge vừa mức.", "No-go nếu nói chắc tuyệt đối.", "No-go nếu claim mơ hồ quá."],
    go_no_go_notes_en: ["Go if hedging is measured.", "No-go if it sounds absolutely certain.", "No-go if the claim is too vague."],
    canada_example: {
      context_vi: "Đánh giá pilot trong tổ chức tại Canada.",
      context_en: "Pilot evaluation in a Canadian organization.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪਾਇਲਟ ਤੋਂ ਸਿੱਧਾ ਰਾਸ਼ਟਰੀ ਨਤੀਜਾ ਕੱਢਣਾ ਉਚਿਤ ਨਹੀਂ ਹੋਵੇਗਾ।",
      rom: "Canada de pilot ton sidhha rashtri natija kadhna uchit nahin hovega.",
      vi: "Từ một pilot tại Canada, không nên rút ngay kết luận cấp quốc gia.",
      en: "It would not be appropriate to draw an immediate national conclusion from a Canadian pilot.",
    },
    learner_traps_vi: ["Đừng dùng chắc chắn khi evidence nhỏ.", "Đừng hedge đến mức câu không còn nghĩa."],
    learner_traps_en: ["Do not sound certain when evidence is limited.", "Do not hedge until the sentence loses meaning."],
  },
  {
    id: "pa_c1_acceptance_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "go_no_go",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ go-no-go",
    title_rom: "sabut tulna go-no-go",
    title_vi: "Go/no-go so sánh bằng chứng",
    title_en: "Evidence comparison go/no-go",
    acceptance_prompt_vi: "Duyệt nếu người học phân biệt loại evidence và kết luận cân bằng.",
    acceptance_prompt_en: "Accept if the learner distinguishes evidence types and gives a balanced conclusion.",
    sample: {
      pa: "ਅੰਕੜੇ ਰੁਝਾਨ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਇੰਟਰਵਿਊ ਕਾਰਣਾਂ ਬਾਰੇ ਗਹਿਰਾਈ ਦਿੰਦੇ ਹਨ; ਇਸ ਲਈ ਦੋਵੇਂ ਸਬੂਤ ਇਕੱਠੇ ਪੜ੍ਹਣੇ ਚਾਹੀਦੇ ਹਨ।",
      rom: "ankde rujhan dikhaounde han, jadki interview karna bare gahirai dinde han; is lai dove sabut ikathe parhne chahide han.",
      vi: "Số liệu cho thấy xu hướng, còn phỏng vấn cung cấp chiều sâu về nguyên nhân; vì vậy nên đọc hai loại bằng chứng cùng nhau.",
      en: "The figures show patterns, while interviews provide depth about causes; therefore both types of evidence should be read together.",
    },
    acceptance_checks_vi: ["Hai evidence được tách rõ.", "Kết luận không thiên lệch.", "Có lý do cho comparison."],
    acceptance_checks_en: ["Two evidence types are distinct.", "Conclusion is not biased.", "Reason for comparison is present."],
    ship_candidate_checks_vi: ["Dùng được trong rubric.", "Không trộn nguồn.", "Không overclaim."],
    ship_candidate_checks_en: ["Usable in a rubric.", "Sources are not blended.", "Does not overclaim."],
    go_no_go_notes_vi: ["Go nếu comparison rõ.", "No-go nếu chọn phe quá sớm.", "No-go nếu bỏ limitation."],
    go_no_go_notes_en: ["Go if comparison is clear.", "No-go if it takes a side too early.", "No-go if limitations are omitted."],
    canada_example: {
      context_vi: "So sánh dữ liệu và feedback cộng đồng tại Canada.",
      context_en: "Comparing data and community feedback in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਕੜੇ ਅਤੇ ਭਾਈਚਾਰੇ ਦੀ ਫੀਡਬੈਕ ਇਕੱਠੇ ਵੇਖਣ ਨਾਲ ਫੈਸਲਾ ਸੰਤੁਲਿਤ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada vich ankde ate bhaichare di feedback ikathe vekhan nal faisla santulit rahinda hai.",
      vi: "Tại Canada, xem số liệu cùng feedback cộng đồng giúp quyết định cân bằng hơn.",
      en: "In Canada, considering figures together with community feedback keeps the decision more balanced.",
    },
    learner_traps_vi: ["Đừng xem một nguồn là đủ cho mọi kết luận.", "Đừng xóa khác biệt giữa số liệu và trải nghiệm."],
    learner_traps_en: ["Do not treat one source as enough for every conclusion.", "Do not erase the difference between figures and experience."],
  },
  {
    id: "pa_c1_acceptance_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "rasmi patar-vihar pre-integration",
    title_vi: "Pre-integration thư tín trang trọng",
    title_en: "Formal correspondence pre-integration",
    acceptance_prompt_vi: "Duyệt nếu message có mục đích rõ, tone lịch sự và register chuyên nghiệp.",
    acceptance_prompt_en: "Accept if the message has a clear purpose, polite tone, and professional register.",
    sample: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਕੀ ਸੋਮਵਾਰ ਤੱਕ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰਨਾ ਸੰਭਵ ਹੋਵੇਗਾ, ਤਾਂ ਜੋ ਅਸੀਂ ਅਗਲੇ ਕਦਮ ਸਮੇਂ ਸਿਰ ਯੋਜਿਤ ਕਰ ਸਕੀਏ।",
      rom: "kirpa karke dasso ki ki somvar tak update sanjha karna sambhav hovega, tan jo asin agle kadam samen sir yojit kar sakie.",
      vi: "Vui lòng cho biết liệu có thể chia sẻ cập nhật trước thứ Hai không, để chúng tôi lên kế hoạch bước tiếp theo đúng hạn.",
      en: "Please let us know whether it will be possible to share an update by Monday so that we can plan the next steps on time.",
    },
    acceptance_checks_vi: ["Request cụ thể.", "Tone không trách móc.", "Deadline được nói lịch sự."],
    acceptance_checks_en: ["Specific request.", "No blaming tone.", "Deadline is expressed politely."],
    ship_candidate_checks_vi: ["Không giống chat casual.", "Không cần gửi email thật.", "Không chạm auth/billing."],
    ship_candidate_checks_en: ["Does not sound like casual chat.", "No real email sending needed.", "Does not touch auth or billing."],
    go_no_go_notes_vi: ["Go nếu request rõ.", "No-go nếu ra lệnh mạnh.", "No-go nếu quá vòng vo."],
    go_no_go_notes_en: ["Go if the request is clear.", "No-go if it uses a strong command.", "No-go if it is too indirect."],
    canada_example: {
      context_vi: "Follow-up trong môi trường làm việc tại Canada.",
      context_en: "Follow-up in a Canadian workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਕੰਮਕਾਜੀ ਸੰਦਰਭ ਵਿੱਚ ਸਿੱਧੀ ਪਰ ਨਿਮਰ ਬੇਨਤੀ ਆਮ ਤੌਰ ਤੇ ਢੰਗੀ ਮੰਨੀ ਜਾਂਦੀ ਹੈ।",
      rom: "Canada de kamkaji sandarbh vich sidhhi par nimar benati aam taur te dangi manni jandi hai.",
      vi: "Trong môi trường làm việc tại Canada, yêu cầu thẳng nhưng lịch sự thường được xem là phù hợp.",
      en: "In a Canadian workplace context, a direct but polite request is usually considered appropriate.",
    },
    learner_traps_vi: ["Đừng dịch y nguyên văn nói thân mật.", "Đừng làm câu quá lạnh hoặc quá dài."],
    learner_traps_en: ["Do not translate casual speech word for word.", "Do not make the sentence too cold or too long."],
  },
  {
    id: "pa_c1_acceptance_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "acceptance",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ acceptance",
    title_rom: "karjakari sankhep acceptance",
    title_vi: "Acceptance bản tóm tắt điều hành",
    title_en: "Executive summary acceptance",
    acceptance_prompt_vi: "Duyệt nếu summary giữ priority, risk, recommendation và next step trong câu gọn.",
    acceptance_prompt_en: "Accept if the summary keeps the priority, risk, recommendation, and next step in concise language.",
    sample: {
      pa: "ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਕਾਇਮ ਰੱਖਣੀ ਹੈ; ਮੁੱਖ ਜੋਖਮ ਸਮਾਂ ਅਤੇ ਖਰਚਾ ਹੈ, ਇਸ ਲਈ ਅਗਲਾ ਕਦਮ ਸੀਮਿਤ ਪਾਇਲਟ ਦੀ ਸਮੀਖਿਆ ਹੈ।",
      rom: "tarji seva di gunvatta kaim rakhni hai; mukh jokham sama ate kharcha hai, is lai agla kadam simit pilot di samikhia hai.",
      vi: "Ưu tiên là duy trì chất lượng dịch vụ; rủi ro chính là thời gian và chi phí, vì vậy bước tiếp theo là review pilot giới hạn.",
      en: "The priority is maintaining service quality; the main risks are time and cost, so the next step is to review a limited pilot.",
    },
    acceptance_checks_vi: ["Có priority.", "Có risk.", "Có next step/recommendation."],
    acceptance_checks_en: ["Has a priority.", "Has a risk.", "Has a next step or recommendation."],
    ship_candidate_checks_vi: ["Đủ gọn cho acceptance.", "Không thành full report.", "Không cần dữ liệu live."],
    ship_candidate_checks_en: ["Concise enough for acceptance.", "Does not become a full report.", "No live data needed."],
    go_no_go_notes_vi: ["Go nếu action rõ.", "No-go nếu chỉ mô tả vấn đề.", "No-go nếu bỏ rủi ro chính."],
    go_no_go_notes_en: ["Go if the action is clear.", "No-go if it only describes the problem.", "No-go if the main risk is missing."],
    canada_example: {
      context_vi: "Executive summary cho chương trình cộng đồng tại Canada.",
      context_en: "Executive summary for a community program in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਭਾਈਚਾਰਕ ਪ੍ਰੋਗਰਾਮ ਲਈ ਸੰਖੇਪ ਵਿੱਚ ਗੁਣਵੱਤਾ, ਖਰਚਾ ਅਤੇ ਅਗਲਾ ਕਦਮ ਇਕੱਠੇ ਆਉਣੇ ਚਾਹੀਦੇ ਹਨ।",
      rom: "Canada de bhaicharak program lai sankhep vich gunvatta, kharcha ate agla kadam ikathe aune chahide han.",
      vi: "Cho chương trình cộng đồng tại Canada, summary nên gom chất lượng, chi phí và bước tiếp theo lại với nhau.",
      en: "For a community program in Canada, the summary should bring quality, cost, and the next step together.",
    },
    learner_traps_vi: ["Đừng viết quá dài như báo cáo đầy đủ.", "Đừng quên recommendation hoặc bước tiếp theo."],
    learner_traps_en: ["Do not write it like a full report.", "Do not forget the recommendation or next step."],
  },
  {
    id: "pa_c1_acceptance_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "ship_candidate",
    title_pa: "ਰਜਿਸਟਰ calibration ship-candidate",
    title_rom: "register calibration ship-candidate",
    title_vi: "Ship-candidate chỉnh register",
    title_en: "Register calibration ship candidate",
    acceptance_prompt_vi: "Duyệt nếu câu chuyển từ casual sang professional mà không đổi nghĩa.",
    acceptance_prompt_en: "Accept if the sentence moves from casual to professional without changing meaning.",
    sample: {
      pa: "ਇਹ ਵਿਚਾਰ ਲਾਭਦਾਇਕ ਹੈ, ਪਰ ਰਿਪੋਰਟ ਵਿੱਚ ਇਸ ਨੂੰ ਹੋਰ ਸਬੂਤ ਅਤੇ ਸੀਮਾਵਾਂ ਨਾਲ ਜੋੜ ਕੇ ਪੇਸ਼ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "ih vichar labhdaik hai, par report vich is nu hor sabut ate simavan nal jor ke pesh karna chahida hai.",
      vi: "Ý này hữu ích, nhưng trong báo cáo nên trình bày nó cùng với thêm bằng chứng và giới hạn.",
      en: "This idea is useful, but in the report it should be presented with further evidence and limitations.",
    },
    acceptance_checks_vi: ["Professional hơn bản casual.", "Nghĩa không đổi.", "Có limitation."],
    acceptance_checks_en: ["More professional than the casual version.", "Meaning is not changed.", "Has a limitation."],
    ship_candidate_checks_vi: ["Hợp formal register.", "Không quá trang trọng giả tạo.", "Không cần audio."],
    ship_candidate_checks_en: ["Fits formal register.", "Not artificially formal.", "No audio needed."],
    go_no_go_notes_vi: ["Go nếu register nhất quán.", "No-go nếu thêm ý mới.", "No-go nếu còn quá thân mật."],
    go_no_go_notes_en: ["Go if register is consistent.", "No-go if new meaning is added.", "No-go if it remains too casual."],
    canada_example: {
      context_vi: "Memo công việc tại Canada.",
      context_en: "Workplace memo in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਮੈਮੋ ਵਿੱਚ ਲਹਿਜ਼ਾ ਨਿਮਰ, ਸਪਸ਼ਟ ਅਤੇ ਪੇਸ਼ਾਵਰ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de memo vich lehja nimar, spasht ate peshavar rahina chahida hai.",
      vi: "Trong memo tại Canada, giọng nên lịch sự, rõ ràng và chuyên nghiệp.",
      en: "In a Canadian memo, the tone should remain polite, clear, and professional.",
    },
    learner_traps_vi: ["Đừng dùng slang.", "Đừng làm formal bằng cách thêm từ rỗng."],
    learner_traps_en: ["Do not use slang.", "Do not make it formal by adding empty words."],
  },
  {
    id: "pa_c1_acceptance_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "go_no_go",
    title_pa: "ਪ੍ਰਸਤੁਤੀ ਜਵਾਬ go-no-go",
    title_rom: "prastuti jawab go-no-go",
    title_vi: "Go/no-go phản hồi thuyết trình",
    title_en: "Presentation response go/no-go",
    acceptance_prompt_vi: "Duyệt nếu response trả lời câu hỏi khó bằng concession, evidence và next step.",
    acceptance_prompt_en: "Accept if the response handles a difficult question with concession, evidence, and a next step.",
    sample: {
      pa: "ਤੁਹਾਡੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ। ਉਪਲਬਧ ਸਬੂਤ ਹਾਲੇ ਸੀਮਿਤ ਹਨ, ਇਸ ਲਈ ਅਸੀਂ ਪਹਿਲਾਂ ਛੋਟਾ ਟੈਸਟ ਕਰਕੇ ਨਤੀਜੇ ਸਾਂਝੇ ਕਰਾਂਗੇ।",
      rom: "tuhadi chinta vajab hai. uplabdh sabut hale simit han, is lai asin pahlan chhota test karke natije sanjhe karange.",
      vi: "Mối quan ngại của anh/chị là hợp lý. Bằng chứng hiện còn hạn chế, vì vậy chúng tôi sẽ thử nhỏ trước và chia sẻ kết quả.",
      en: "Your concern is valid. The available evidence is still limited, so we will first run a small test and share the results.",
    },
    acceptance_checks_vi: ["Công nhận câu hỏi.", "Có evidence limit.", "Có next step."],
    acceptance_checks_en: ["Acknowledges the question.", "Has an evidence limit.", "Has a next step."],
    ship_candidate_checks_vi: ["Phù hợp Q&A C1.", "Không né câu hỏi.", "Không hứa quá mức."],
    ship_candidate_checks_en: ["Fits C1 Q&A.", "Does not avoid the question.", "Does not overpromise."],
    go_no_go_notes_vi: ["Go nếu trả lời trực tiếp.", "No-go nếu phòng thủ.", "No-go nếu bỏ next step."],
    go_no_go_notes_en: ["Go if it answers directly.", "No-go if defensive.", "No-go if the next step is missing."],
    canada_example: {
      context_vi: "Q&A sau presentation tại Canada.",
      context_en: "Q&A after a presentation in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਪੇਸ਼ਾਵਰ Q&A ਵਿੱਚ ਚਿੰਤਾ ਨੂੰ ਮੰਨ ਕੇ ਸੀਮਿਤ ਸਬੂਤ ਸਪਸ਼ਟ ਕਰਨਾ ਲਾਭਦਾਇਕ ਹੁੰਦਾ ਹੈ।",
      rom: "Canada de peshavar Q&A vich chinta nu mann ke simit sabut spasht karna labhdaik hunda hai.",
      vi: "Trong Q&A chuyên nghiệp tại Canada, việc công nhận quan ngại và nói rõ evidence còn giới hạn là hữu ích.",
      en: "In a Canadian professional Q&A, acknowledging the concern and clarifying limited evidence is useful.",
    },
    learner_traps_vi: ["Đừng trả lời như tranh cãi cá nhân.", "Đừng hứa kết quả khi evidence chưa đủ."],
    learner_traps_en: ["Do not answer like a personal argument.", "Do not promise outcomes when evidence is insufficient."],
  },
  {
    id: "pa_c1_acceptance_public_professional_tone",
    level: "C1",
    area: "public_professional_tone",
    mode: "pre_integration",
    title_pa: "ਜਨਤਕ ਪੇਸ਼ਾਵਰ ਲਹਿਜ਼ਾ pre-integration",
    title_rom: "jantak peshavar lehja pre-integration",
    title_vi: "Pre-integration giọng dịch vụ công/chuyên nghiệp",
    title_en: "Public professional tone pre-integration",
    acceptance_prompt_vi: "Duyệt nếu thông báo công khai rõ, respectful và không đổ lỗi cho người đọc.",
    acceptance_prompt_en: "Accept if the public notice is clear, respectful, and does not blame the reader.",
    sample: {
      pa: "ਅਸੁਵਿਧਾ ਲਈ ਖੇਦ ਹੈ। ਸਾਡੀ ਟੀਮ ਅਰਜ਼ੀਆਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਸਮੀਖਿਆ ਕਰ ਰਹੀ ਹੈ ਅਤੇ ਜਲਦੀ ਤੋਂ ਜਲਦੀ ਅਗਲਾ ਅਪਡੇਟ ਸਾਂਝਾ ਕਰੇਗੀ।",
      rom: "asuvidha lai khed hai. sadi team arzian nu kramvar samikhia kar rahi hai ate jaldi ton jaldi agla update sanjha karegi.",
      vi: "Chúng tôi xin lỗi vì sự bất tiện. Nhóm của chúng tôi đang xem xét hồ sơ theo thứ tự và sẽ chia sẻ cập nhật tiếp theo sớm nhất có thể.",
      en: "We apologize for the inconvenience. Our team is reviewing applications in order and will share the next update as soon as possible.",
    },
    acceptance_checks_vi: ["Thông tin rõ.", "Tone respectful.", "Không đổ lỗi."],
    acceptance_checks_en: ["Information is clear.", "Tone is respectful.", "No blame."],
    ship_candidate_checks_vi: ["Hợp public-service tone.", "Không hứa date giả.", "Không cần hệ thống live."],
    ship_candidate_checks_en: ["Fits public-service tone.", "Does not invent a date.", "No live system needed."],
    go_no_go_notes_vi: ["Go nếu người đọc biết trạng thái.", "No-go nếu mơ hồ.", "No-go nếu có blame tone."],
    go_no_go_notes_en: ["Go if the reader knows the status.", "No-go if vague.", "No-go if it has a blaming tone."],
    canada_example: {
      context_vi: "Thông báo dịch vụ cộng đồng tại Canada.",
      context_en: "Community-service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਸੇਵਾ ਸੰਦਰਭ ਵਿੱਚ ਜਨਤਕ ਸੁਨੇਹਾ ਸਪਸ਼ਟ, ਨਿਮਰ ਅਤੇ ਕਾਰਵਾਈਯੋਗ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "Canada de seva sandarbh vich jantak suneha spasht, nimar ate karvaiyog rahina chahida hai.",
      vi: "Trong bối cảnh dịch vụ tại Canada, thông báo công khai nên rõ, lịch sự và có thể hành động được.",
      en: "In a Canadian service context, a public message should be clear, polite, and actionable.",
    },
    learner_traps_vi: ["Đừng dùng lời xin lỗi rỗng mà không có status.", "Đừng thêm ngày tháng không có trong dữ liệu."],
    learner_traps_en: ["Do not use an empty apology without status.", "Do not add dates that are not in the data."],
  },
];
