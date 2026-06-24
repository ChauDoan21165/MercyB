// Punjabi C1 closure packet samples for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught here.
// Native review is deferred.

export type PunjabiC1ClosurePacketArea =
  | "source_summary"
  | "cautious_claim"
  | "evidence_comparison"
  | "formal_correspondence"
  | "executive_summary"
  | "register_calibration"
  | "presentation_response"
  | "public_professional_tone";

export type PunjabiC1ClosurePacketMode =
  | "closure_packet"
  | "pre_a11_closure"
  | "ci_readiness"
  | "pre_integration";

export type PunjabiC1ClosurePacketPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiC1ClosurePacketSample = {
  id: string;
  level: "C1";
  area: PunjabiC1ClosurePacketArea;
  mode: PunjabiC1ClosurePacketMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  merge_prompt_vi: string;
  merge_prompt_en: string;
  sample: PunjabiC1ClosurePacketPhrase;
  closure_packet_checks_vi: readonly string[];
  closure_packet_checks_en: readonly string[];
  pre_a11_closure_checks_vi: readonly string[];
  pre_a11_closure_checks_en: readonly string[];
  pre_integration_notes_vi: readonly string[];
  pre_integration_notes_en: readonly string[];
  canada_example: PunjabiC1ClosurePacketPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const c1ClosurePacketSamplesScriptAwareness = {
  vi: "Bộ closure packet này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết một hệ chữ Punjabi khác, không phải phần luyện chính.",
  en: "This closure packet pack uses Gurmukhi as the primary script. Shahmukhi is mentioned only to recognize another Punjabi script, not as the main practice script.",
} as const;

export const c1ClosurePacketSamples: PunjabiC1ClosurePacketSample[] = [
  {
    id: "pa_c1_closure_packet_source_summary",
    level: "C1",
    area: "source_summary",
    mode: "closure_packet",
    title_pa: "ਸਰੋਤ ਸਾਰ closure packet",
    title_rom: "sarot saar closure packet",
    title_vi: "Tóm tắt nguồn cho closure packet",
    title_en: "Source summary for closure packet",
    merge_prompt_vi: "Dùng sample này để kiểm tra trước merge rằng claim, evidence và neutrality vẫn rõ.",
    merge_prompt_en: "Use this sample before merge to check that claim, evidence, and neutrality remain clear.",
    sample: {
      pa: "ਸਰੋਤ ਦੱਸਦਾ ਹੈ ਕਿ ਸਪਸ਼ਟ ਸੇਵਾ ਜਾਣਕਾਰੀ ਲੋਕਾਂ ਦੀ ਪਹੁੰਚ ਵਧਾ ਸਕਦੀ ਹੈ, ਖਾਸ ਕਰਕੇ ਜਦੋਂ ਸਮਾਂ, ਯੋਗਤਾ ਅਤੇ ਸੰਪਰਕ ਰਸਤੇ ਇਕੱਠੇ ਦਿੱਤੇ ਜਾਣ।",
      rom: "sarot dassda hai ki spasht seva jankari lokan di pahunch vadha sakdi hai, khas karke jadon sama, yogta ate sampark raste ikathe ditte jaan.",
      vi: "Nguồn cho biết thông tin dịch vụ rõ có thể tăng khả năng tiếp cận, nhất là khi giờ, điều kiện đủ tiêu chuẩn và cách liên hệ được đưa cùng nhau.",
      en: "The source says that clear service information can increase access, especially when hours, eligibility, and contact routes are given together.",
    },
    closure_packet_checks_vi: ["Claim trung tâm rõ.", "Evidence không bị thêm thắt.", "Tone vẫn trung lập."],
    closure_packet_checks_en: ["Central claim is clear.", "Evidence is not embellished.", "Tone remains neutral."],
    pre_a11_closure_checks_vi: ["Có thể checksum claim.", "Có thể checksum evidence.", "Không cần dữ liệu live."],
    pre_a11_closure_checks_en: ["Claim can be checksummed.", "Evidence can be checksummed.", "No live data needed."],
    pre_integration_notes_vi: ["Không chạy A11 integration.", "Không chạm Supabase.", "Không claim native review."],
    pre_integration_notes_en: ["Does not run A11 integration.", "Does not touch Supabase.", "No native-review claim."],
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ cộng đồng tại Canada.",
      context_en: "Source summary about community services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਆਏ ਲੋਕਾਂ ਲਈ ਸੇਵਾ ਜਾਣਕਾਰੀ ਸਾਫ਼ ਹੋਵੇ ਤਾਂ ਪਹਿਲਾ ਸੰਪਰਕ ਆਸਾਨ ਹੋ ਜਾਂਦਾ ਹੈ।",
      rom: "Canada vich nave aaye lokan lai seva jankari saaf hove tan pahila sampark asan ho janda hai.",
      vi: "Tại Canada, nếu thông tin dịch vụ rõ, lần liên hệ đầu tiên của người mới đến sẽ dễ hơn.",
      en: "In Canada, clear service information makes a newcomer's first contact easier.",
    },
    learner_traps_vi: ["Đừng biến summary thành opinion.", "Đừng bỏ điều kiện hoặc phạm vi của nguồn."],
    learner_traps_en: ["Do not turn a summary into an opinion.", "Do not omit the source's condition or scope."],
  },
  {
    id: "pa_c1_closure_packet_cautious_claim",
    level: "C1",
    area: "cautious_claim",
    mode: "pre_a11_closure",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵਾ pre-A11-closure checksum",
    title_rom: "savdhan daava pre-A11-closure checksum",
    title_vi: "Claim thận trọng cho pre-A11-closure checksum",
    title_en: "Cautious claim for pre-A11-closure checksum",
    merge_prompt_vi: "Dùng sample này để kiểm tra claim có hedge vừa đủ trước khi đóng gói.",
    merge_prompt_en: "Use this sample to check that the claim has enough hedging before packaging.",
    sample: {
      pa: "ਮੌਜੂਦਾ ਨਤੀਜੇ ਇਹ ਸੰਕੇਤ ਦਿੰਦੇ ਹਨ ਕਿ ਤਬਦੀਲੀ ਲਾਭਦਾਇਕ ਹੋ ਸਕਦੀ ਹੈ, ਪਰ ਵੱਡੇ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਹੋਰ ਡਾਟਾ ਅਤੇ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "maujuda natije ih sanket dinde han ki tabdili labhdayak ho sakdi hai, par vadde faisle ton pahlan hor data ate samikhia lorindi hai.",
      vi: "Kết quả hiện có gợi ý thay đổi có thể hữu ích, nhưng cần thêm dữ liệu và review trước quyết định lớn.",
      en: "Current results suggest the change may be useful, but more data and review are needed before a large decision.",
    },
    closure_packet_checks_vi: ["Hedge rõ.", "Không phóng đại.", "Vẫn có luận điểm."],
    closure_packet_checks_en: ["Clear hedging.", "No exaggeration.", "Still has a point."],
    pre_a11_closure_checks_vi: ["Checksum được mức độ chắc chắn.", "Checksum được limitation.", "Không có claim tuyệt đối."],
    pre_a11_closure_checks_en: ["Certainty level can be checksummed.", "Limitation can be checksummed.", "No absolute claim."],
    pre_integration_notes_vi: ["Không chạm scoring.", "Không chạm Azure.", "Không cần nguồn ngoài."],
    pre_integration_notes_en: ["Does not touch scoring.", "Does not touch Azure.", "No outside source needed."],
    canada_example: {
      context_vi: "Đánh giá pilot trong workplace tại Canada.",
      context_en: "Pilot evaluation in a Canadian workplace.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਛੋਟੇ ਪਾਇਲਟ ਦੇ ਨਤੀਜੇ ਉਮੀਦਜਨਕ ਹਨ, ਪਰ ਉਹ ਹਾਲੇ ਪੂਰੇ ਸੰਗਠਨ ਲਈ ਅੰਤਿਮ ਸਬੂਤ ਨਹੀਂ ਹਨ।",
      rom: "Canada de chhote pilot de natije umidjanak han, par oh hale pure sangathan lai antim sabut nahin han.",
      vi: "Kết quả pilot nhỏ tại Canada có triển vọng, nhưng chưa phải bằng chứng cuối cùng cho toàn tổ chức.",
      en: "The small Canadian pilot has promising results, but they are not yet final evidence for the whole organization.",
    },
    learner_traps_vi: ["Đừng dùng 'chắc chắn' với pilot nhỏ.", "Đừng hedge đến mức câu không còn ý."],
    learner_traps_en: ["Do not use 'certain' with a small pilot.", "Do not hedge until the sentence has no point."],
  },
  {
    id: "pa_c1_closure_packet_evidence_comparison",
    level: "C1",
    area: "evidence_comparison",
    mode: "ci_readiness",
    title_pa: "ਸਬੂਤ ਤੁਲਨਾ CI-readiness",
    title_rom: "sabut tulna CI-readiness",
    title_vi: "So sánh bằng chứng cho CI-readiness",
    title_en: "Evidence comparison for CI readiness",
    merge_prompt_vi: "Dùng sample này để CI check so sánh giữa số liệu và phản hồi định tính.",
    merge_prompt_en: "Use this sample so CI can check comparison between figures and qualitative feedback.",
    sample: {
      pa: "ਅੰਕੜੇ ਬਦਲਾਅ ਦੀ ਮਾਤਰਾ ਦਿਖਾਉਂਦੇ ਹਨ, ਜਦਕਿ ਫੀਡਬੈਕ ਦੱਸਦਾ ਹੈ ਕਿ ਲੋਕਾਂ ਨੇ ਤਬਦੀਲੀ ਨੂੰ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕੀਤਾ; ਇਸ ਲਈ ਦੋਵੇਂ ਕਿਸਮਾਂ ਦੇ ਸਬੂਤ ਇਕੱਠੇ ਪੜ੍ਹਣੇ ਚਾਹੀਦੇ ਹਨ।",
      rom: "ankde badlaa di matra dikhaunde han, jadki feedback dassda hai ki lokan ne tabdili nu kiven mahsus kita; is lai dove kisman de sabut ikathe parhne chahide han.",
      vi: "Số liệu cho thấy mức độ thay đổi, còn phản hồi cho biết người dân cảm nhận thay đổi thế nào; vì vậy nên đọc hai loại bằng chứng cùng nhau.",
      en: "Figures show the amount of change, while feedback shows how people experienced it; therefore both types of evidence should be read together.",
    },
    closure_packet_checks_vi: ["Phân biệt loại evidence.", "Kết luận vừa mức.", "Không chọn phe sớm."],
    closure_packet_checks_en: ["Distinguishes evidence types.", "Measured conclusion.", "Does not choose a side early."],
    pre_a11_closure_checks_vi: ["Có số liệu.", "Có phản hồi.", "Có lý do đọc chung."],
    pre_a11_closure_checks_en: ["Has figures.", "Has feedback.", "Has a reason to read them together."],
    pre_integration_notes_vi: ["Dữ liệu là sample tĩnh.", "Không chạm RLS.", "Không deploy."],
    pre_integration_notes_en: ["Data is a static sample.", "Does not touch RLS.", "No deploy."],
    canada_example: {
      context_vi: "So sánh evidence cho dịch vụ cộng đồng tại Canada.",
      context_en: "Evidence comparison for community service in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਕੜੇ ਅਤੇ ਰਹਾਇਸ਼ੀਆਂ ਦੀ ਫੀਡਬੈਕ ਇਕੱਠੇ ਵੇਖਣ ਨਾਲ ਨੀਤੀ ਫੈਸਲਾ ਵਧੇਰੇ ਸੰਤੁਲਿਤ ਰਹਿੰਦਾ ਹੈ।",
      rom: "Canada vich ankde ate rihashian di feedback ikathe vekhan nal niti faisla vadhere santulit rahinda hai.",
      vi: "Tại Canada, xem số liệu và phản hồi cư dân cùng nhau giúp quyết định chính sách cân bằng hơn.",
      en: "In Canada, reading figures and resident feedback together keeps a policy decision more balanced.",
    },
    learner_traps_vi: ["Đừng nói số liệu và feedback có cùng chức năng.", "Đừng kết luận rộng hơn evidence."],
    learner_traps_en: ["Do not say figures and feedback have the same function.", "Do not conclude more broadly than the evidence."],
  },
  {
    id: "pa_c1_closure_packet_formal_correspondence",
    level: "C1",
    area: "formal_correspondence",
    mode: "pre_integration",
    title_pa: "ਰਸਮੀ ਪੱਤਰਚਾਰ pre-integration",
    title_rom: "rasmi patar-vihar pre-integration",
    title_vi: "Thư tín trang trọng trước integration",
    title_en: "Formal correspondence before integration",
    merge_prompt_vi: "Dùng sample này để kiểm tra email formal có request rõ, lịch sự và không casual.",
    merge_prompt_en: "Use this sample to check that a formal email has a clear request, politeness, and no casual tone.",
    sample: {
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੀਟਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਅਪਡੇਟ ਕੀਤੀ ਸੂਚੀ ਸਾਂਝੀ ਕਰ ਦਿਓ, ਤਾਂ ਜੋ ਟੀਮ ਆਪਣੇ ਸਵਾਲ ਅਤੇ ਤਰਜੀਹਾਂ ਢੰਗ ਨਾਲ ਤਿਆਰ ਕਰ ਸਕੇ।",
      rom: "kirpa karke meeting ton pahlan update kiti suchi sanjhi kar dio, tan jo team apne sawal ate tarjihan dhang nal tiar kar sake.",
      vi: "Vui lòng chia sẻ danh sách đã cập nhật trước cuộc họp để đội ngũ có thể chuẩn bị câu hỏi và ưu tiên đúng cách.",
      en: "Please share the updated list before the meeting so the team can prepare its questions and priorities properly.",
    },
    closure_packet_checks_vi: ["Request trực tiếp nhưng lịch sự.", "Có lý do request.", "Không trách móc."],
    closure_packet_checks_en: ["Request is direct but polite.", "Has a reason for the request.", "No blaming."],
    pre_a11_closure_checks_vi: ["Có phrase lịch sự.", "Có mục đích.", "Không gửi email thật."],
    pre_a11_closure_checks_en: ["Has a polite phrase.", "Has a purpose.", "No real email is sent."],
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
    id: "pa_c1_closure_packet_executive_summary",
    level: "C1",
    area: "executive_summary",
    mode: "closure_packet",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ closure packet",
    title_rom: "karjakari sankhep closure packet",
    title_vi: "Executive summary cho closure packet",
    title_en: "Executive summary for closure packet",
    merge_prompt_vi: "Dùng sample này để kiểm tra summary ngắn có priority, risk và next step trước merge.",
    merge_prompt_en: "Use this sample to check a short summary with priority, risk, and next step before merge.",
    sample: {
      pa: "ਮੁੱਖ ਤਰਜੀਹ ਸੇਵਾ ਦੀ ਭਰੋਸੇਯੋਗਤਾ ਹੈ, ਮੁੱਖ ਜੋਖਮ ਸੀਮਿਤ ਸਟਾਫ ਸਮਾਂ ਹੈ, ਅਤੇ ਅਗਲਾ ਕਦਮ ਦੋ ਹਫ਼ਤਿਆਂ ਦੀ ਸਮੀਖਿਆ ਪੂਰੀ ਕਰਨਾ ਹੈ।",
      rom: "mukh tarji seva di bharoseyogta hai, mukh jokham simit staff sama hai, ate agla kadam do haftian di samikhia puri karna hai.",
      vi: "Ưu tiên chính là độ tin cậy của dịch vụ, rủi ro chính là thời gian nhân sự hạn chế, và bước tiếp theo là hoàn tất review hai tuần.",
      en: "The main priority is service reliability, the main risk is limited staff time, and the next step is to complete a two-week review.",
    },
    closure_packet_checks_vi: ["Có priority.", "Có risk.", "Có next step."],
    closure_packet_checks_en: ["Has a priority.", "Has a risk.", "Has a next step."],
    pre_a11_closure_checks_vi: ["Compact.", "Checksum được action.", "Không thành report dài."],
    pre_a11_closure_checks_en: ["Compact.", "Action can be checksummed.", "Does not become a long report."],
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
    id: "pa_c1_closure_packet_register_calibration",
    level: "C1",
    area: "register_calibration",
    mode: "ci_readiness",
    title_pa: "ਰਜਿਸਟਰ calibration CI-readiness",
    title_rom: "register calibration CI-readiness",
    title_vi: "Chỉnh register cho CI-readiness",
    title_en: "Register calibration for CI readiness",
    merge_prompt_vi: "Dùng sample này để kiểm tra register formal, cautious và đủ tự nhiên.",
    merge_prompt_en: "Use this sample to check a formal, cautious, and natural enough register.",
    sample: {
      pa: "ਇਸ ਨਤੀਜੇ ਨੂੰ ਰਿਪੋਰਟ ਵਿੱਚ ਸਾਵਧਾਨੀ ਨਾਲ ਦਰਸਾਉਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਇਹ ਸੰਭਾਵੀ ਰੁਝਾਨ ਦਿਖਾਉਂਦਾ ਹੈ ਪਰ ਕਾਰਨ ਪੱਕਾ ਨਹੀਂ ਕਰਦਾ।",
      rom: "is natije nu report vich savdhani nal darsaunda chahida hai, kyonki ih sambhavi rujhan dikhaunda hai par karan pakka nahin karda.",
      vi: "Kết quả này nên được trình bày thận trọng trong báo cáo vì nó cho thấy xu hướng có thể có nhưng không xác nhận nguyên nhân.",
      en: "This result should be presented cautiously in the report because it shows a possible trend but does not confirm the cause.",
    },
    closure_packet_checks_vi: ["Register formal.", "Không quá casual.", "Không làm mất nghĩa."],
    closure_packet_checks_en: ["Formal register.", "Not too casual.", "Does not lose meaning."],
    pre_a11_closure_checks_vi: ["Claim cautious.", "Có limitation.", "Không phóng đại."],
    pre_a11_closure_checks_en: ["Cautious claim.", "Has a limitation.", "No exaggeration."],
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
    learner_traps_vi: ["Đừng dịch văn nói word-by-word.", "Đừng làm câu quá lạnh hoặc mơ hồ."],
    learner_traps_en: ["Do not translate spoken wording word for word.", "Do not make the sentence too cold or vague."],
  },
  {
    id: "pa_c1_closure_packet_presentation_response",
    level: "C1",
    area: "presentation_response",
    mode: "pre_a11_closure",
    title_pa: "ਪ੍ਰਜ਼ੈਂਟੇਸ਼ਨ ਜਵਾਬ pre-A11-closure checksum",
    title_rom: "presentation jawab pre-A11-closure checksum",
    title_vi: "Phản hồi presentation cho pre-A11-closure checksum",
    title_en: "Presentation response for pre-A11-closure checksum",
    merge_prompt_vi: "Dùng sample này để kiểm tra câu trả lời Q&A có cấu trúc và không phòng thủ.",
    merge_prompt_en: "Use this sample to check a structured, non-defensive Q&A answer.",
    sample: {
      pa: "ਇਹ ਵਾਜਬ ਸਵਾਲ ਹੈ। ਪਹਿਲਾਂ, ਅੰਕੜੇ ਸੀਮਿਤ ਸਮੇਂ ਨੂੰ ਕਵਰ ਕਰਦੇ ਹਨ; ਦੂਜਾ, ਫੀਡਬੈਕ ਨਤੀਜੇ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ ਪਰ ਇਸ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।",
      rom: "ih vajab sawal hai. pahlan, ankde simit samen nu cover karde han; duja, feedback natije da samarthan karda hai par is nu puri tarah sabat nahin karda.",
      vi: "Đây là câu hỏi hợp lý. Thứ nhất, số liệu chỉ bao phủ thời gian giới hạn; thứ hai, phản hồi hỗ trợ kết quả nhưng không chứng minh hoàn toàn.",
      en: "This is a reasonable question. First, the figures cover a limited period; second, feedback supports the result but does not fully prove it.",
    },
    closure_packet_checks_vi: ["Ghi nhận câu hỏi.", "Có cấu trúc.", "Tone không phòng thủ."],
    closure_packet_checks_en: ["Acknowledges the question.", "Structured.", "Tone is not defensive."],
    pre_a11_closure_checks_vi: ["Có limitation.", "Không overstated.", "Có evidence boundary."],
    pre_a11_closure_checks_en: ["Has a limitation.", "Not overstated.", "Has an evidence boundary."],
    pre_integration_notes_vi: ["Không tạo audio.", "Không scoring.", "Không native-review claim."],
    pre_integration_notes_en: ["Creates no audio.", "No scoring.", "No native-review claim."],
    canada_example: {
      context_vi: "Q&A sau presentation tại Canada.",
      context_en: "Q&A after a presentation in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਪ੍ਰਜ਼ੈਂਟੇਸ਼ਨ ਤੋਂ ਬਾਅਦ ਇਹ ਜਵਾਬ ਸਵਾਲ ਦਾ ਆਦਰ ਕਰਦਾ ਹੈ ਅਤੇ ਸਬੂਤ ਦੀ ਸੀਮਾ ਸਾਫ਼ ਕਰਦਾ ਹੈ।",
      rom: "Canada vich presentation ton baad ih jawab sawal da adar karda hai ate sabut di sima saaf karda hai.",
      vi: "Tại Canada, câu trả lời sau presentation này tôn trọng câu hỏi và làm rõ giới hạn bằng chứng.",
      en: "In Canada, this post-presentation answer respects the question and clarifies the evidence limit.",
    },
    learner_traps_vi: ["Đừng trả lời phòng thủ.", "Đừng nói evidence chứng minh nhiều hơn nó có thể."],
    learner_traps_en: ["Do not answer defensively.", "Do not say the evidence proves more than it can."],
  },
  {
    id: "pa_c1_closure_packet_public_professional_tone",
    level: "C1",
    area: "public_professional_tone",
    mode: "pre_integration",
    title_pa: "ਜਨਤਕ ਪੇਸ਼ਾਵਰ ਲਹਿਜ਼ਾ pre-integration",
    title_rom: "jantak peshavar lehja pre-integration",
    title_vi: "Giọng public/professional trước integration",
    title_en: "Public/professional tone before integration",
    merge_prompt_vi: "Dùng sample này để kiểm tra thông báo công khai rõ, tôn trọng và có next action.",
    merge_prompt_en: "Use this sample to check a public notice that is clear, respectful, and has a next action.",
    sample: {
      pa: "ਸੇਵਾ ਸਮੇਂ ਅਗਲੇ ਹਫ਼ਤੇ ਤੋਂ ਬਦਲੇ ਜਾਣਗੇ। ਕਿਰਪਾ ਕਰਕੇ ਨਵਾਂ ਸਮਾਂ ਵੇਖੋ ਅਤੇ ਜੇ ਤੁਹਾਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ ਤਾਂ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      rom: "seva samen agle hafte ton badle jaan ge. kirpa karke nava sama vekho ate je tuhanu madad chahidi hai tan team nal sampark karo.",
      vi: "Giờ dịch vụ sẽ thay đổi từ tuần tới. Vui lòng xem giờ mới và liên hệ đội ngũ nếu bạn cần hỗ trợ.",
      en: "Service hours will change starting next week. Please check the new hours and contact the team if you need support.",
    },
    closure_packet_checks_vi: ["Thông báo rõ.", "Tone tôn trọng.", "Có next action."],
    closure_packet_checks_en: ["Clear notice.", "Respectful tone.", "Has a next action."],
    pre_a11_closure_checks_vi: ["Không đổ lỗi.", "Không quá dài.", "Sẵn sàng freeze."],
    pre_a11_closure_checks_en: ["No blaming.", "Not too long.", "Ready to freeze."],
    pre_integration_notes_vi: ["Không deploy.", "Không RLS.", "Không Supabase."],
    pre_integration_notes_en: ["No deploy.", "No RLS.", "No Supabase."],
    canada_example: {
      context_vi: "Thông báo dịch vụ công cộng tại Canada.",
      context_en: "Public service notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਜਨਤਕ ਸੇਵਾ ਸੰਦਰਭ ਵਿੱਚ ਸਾਫ਼ ਸਮਾਂ ਅਤੇ ਸੰਪਰਕ ਵਿਕਲਪ ਲੋਕਾਂ ਲਈ ਲਾਭਦਾਇਕ ਹੁੰਦੇ ਹਨ।",
      rom: "Canada de jantak seva sandarbh vich saaf sama ate sampark vikalp lokan lai labhdayak hunde han.",
      vi: "Trong bối cảnh dịch vụ công cộng tại Canada, giờ rõ và lựa chọn liên hệ có ích cho người dân.",
      en: "In a Canadian public-service context, clear hours and contact options are useful for people.",
    },
    learner_traps_vi: ["Đừng nghe như trách người đọc.", "Đừng thiếu hành động tiếp theo."],
    learner_traps_en: ["Do not sound as if blaming the reader.", "Do not omit the next action."],
  },
];
