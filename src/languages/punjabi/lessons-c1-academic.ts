// Punjabi C1 Academic / Professional lesson batch for Vietnamese-speaking
// and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.

export type PunjabiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PunjabiC1Category =
  | "presentation"
  | "formal_message"
  | "meeting"
  | "policy_discussion"
  | "summary"
  | "polite_disagreement"
  | "evidence"
  | "recommendation";

export type PunjabiSentence = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiVocab = {
  word: string;
  rom: string;
  vi: string;
  en: string;
  pos: string;
};

export type PunjabiC1Lesson = {
  id: string;
  level: PunjabiCefrLevel;
  category: PunjabiC1Category;
  title_pa: string;
  title_vi: string;
  title_en: string;
  sentences: PunjabiSentence[];
  vocabulary: PunjabiVocab[];
  notes_vi: string;
  notes_en: string;
  tip_vi: string;
  tip_en: string;
};

export const lessons: PunjabiC1Lesson[] = [
  {
    id: "pa_c1_presentation_opening",
    level: "C1",
    category: "presentation",
    title_pa: "ਰਸਮੀ ਪੇਸ਼ਕਾਰੀ ਦੀ ਸ਼ੁਰੂਆਤ",
    title_vi: "Mở đầu bài thuyết trình trang trọng",
    title_en: "Opening a formal presentation",
    sentences: [
      {
        pa: "ਮਾਣਯੋਗ ਸਹਿਯੋਗੀਓ, ਅੱਜ ਦੀ ਪੇਸ਼ਕਾਰੀ ਦਾ ਵਿਸ਼ਾ ਸੰਸਥਾਗਤ ਬਦਲਾਅ ਹੈ।",
        rom: "maanyog sahiyogio, ajj di peshkari da visha sansthagat badlaa hai.",
        vi: "Thưa các đồng nghiệp kính mến, chủ đề của bài trình bày hôm nay là thay đổi tổ chức.",
        en: "Distinguished colleagues, today's presentation concerns organizational change.",
      },
      {
        pa: "ਮੈਂ ਪਹਿਲਾਂ ਪਿਛੋਕੜ ਰੱਖਾਂਗਾ, ਫਿਰ ਮੁੱਖ ਦਲੀਲ ਤੇ ਆਵਾਂਗਾ।",
        rom: "main pahilan pichhokar rakhanga, phir mukh daleel te aavanga.",
        vi: "Trước hết tôi sẽ trình bày bối cảnh, sau đó chuyển sang lập luận chính.",
        en: "I will first set out the background, then move to the central argument.",
      },
      {
        pa: "ਅੰਤ ਵਿੱਚ, ਮੈਂ ਅਗਲੇ ਕਦਮਾਂ ਬਾਰੇ ਸੰਖੇਪ ਸਿਫਾਰਸ਼ ਕਰਾਂਗਾ।",
        rom: "ant vich, main agle kadman bare sankhep sifarash karanga.",
        vi: "Cuối cùng, tôi sẽ đưa ra khuyến nghị ngắn gọn về các bước tiếp theo.",
        en: "Finally, I will offer a brief recommendation on next steps.",
      },
    ],
    vocabulary: [
      { word: "ਮਾਣਯੋਗ", rom: "maanyog", vi: "kính mến, đáng kính", en: "honorable / distinguished", pos: "adj." },
      { word: "ਪੇਸ਼ਕਾਰੀ", rom: "peshkari", vi: "bài trình bày", en: "presentation", pos: "n." },
      { word: "ਪਿਛੋਕੜ", rom: "pichhokar", vi: "bối cảnh", en: "background", pos: "n." },
      { word: "ਦਲੀਲ", rom: "daleel", vi: "lập luận", en: "argument", pos: "n." },
    ],
    notes_vi:
      "Trong văn phong chuyên nghiệp Punjabi, ਮਾਣਯੋਗ tạo sắc thái trang trọng. Gurmukhi là chữ chính trong khóa này; Shahmukhi tồn tại trong cộng đồng Punjabi khác nhưng chỉ được nhắc để nhận biết.",
    notes_en:
      "In professional Punjabi, ਮਾਣਯੋਗ gives a formal tone. Gurmukhi is the primary script in this course; Shahmukhi exists in other Punjabi communities but is mentioned here only for awareness.",
    tip_vi:
      "Khung C1: chào trang trọng, nêu chủ đề, báo cấu trúc, rồi hứa phần kết luận. Tránh mở đầu quá thân mật như câu chuyện cá nhân dài.",
    tip_en:
      "C1 frame: formal greeting, topic, structure, then a promised closing. Avoid opening with a long personal anecdote in formal settings.",
  },
  {
    id: "pa_c1_formal_email_request",
    level: "C1",
    category: "formal_message",
    title_pa: "ਰਸਮੀ ਈਮੇਲ ਵਿੱਚ ਬੇਨਤੀ",
    title_vi: "Yêu cầu lịch sự trong email trang trọng",
    title_en: "Making a request in a formal email",
    sentences: [
      {
        pa: "ਸਤਿਕਾਰਯੋਗ ਡਾ. ਕੌਰ ਜੀ, ਮੈਂ ਖੋਜ ਪ੍ਰਸਤਾਵ ਬਾਰੇ ਤੁਹਾਡੀ ਰਾਏ ਮੰਗਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        rom: "satkaryog da. kaur ji, main khoj prastav bare tuhadi rae mangna chahunda han.",
        vi: "Kính gửi Tiến sĩ Kaur, tôi muốn xin ý kiến của bà về đề cương nghiên cứu.",
        en: "Dear Dr. Kaur, I would like to ask for your opinion on the research proposal.",
      },
      {
        pa: "ਜੇ ਤੁਹਾਡੇ ਲਈ ਸੰਭਵ ਹੋਵੇ, ਕੀ ਤੁਸੀਂ ਇਸ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਤੱਕ ਟਿੱਪਣੀਆਂ ਭੇਜ ਸਕਦੇ ਹੋ?",
        rom: "je tuhade lai sambhav hove, ki tusi is hafte de ant takk tippaniyan bhej sakde ho?",
        vi: "Nếu có thể, bà có thể gửi nhận xét trước cuối tuần này không?",
        en: "If possible, could you send comments by the end of this week?",
      },
      {
        pa: "ਤੁਹਾਡੇ ਸਮੇਂ ਅਤੇ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਪਹਿਲਾਂ ਹੀ ਧੰਨਵਾਦ।",
        rom: "tuhade same ate margdarshan lai pahilan hi dhanvad.",
        vi: "Xin cảm ơn trước về thời gian và sự hướng dẫn của bà.",
        en: "Thank you in advance for your time and guidance.",
      },
    ],
    vocabulary: [
      { word: "ਸਤਿਕਾਰਯੋਗ", rom: "satkaryog", vi: "kính gửi, đáng kính", en: "respected", pos: "adj." },
      { word: "ਖੋਜ ਪ੍ਰਸਤਾਵ", rom: "khoj prastav", vi: "đề cương nghiên cứu", en: "research proposal", pos: "n." },
      { word: "ਰਾਏ", rom: "rae", vi: "ý kiến", en: "opinion", pos: "n." },
      { word: "ਮਾਰਗਦਰਸ਼ਨ", rom: "margdarshan", vi: "sự hướng dẫn", en: "guidance", pos: "n." },
    ],
    notes_vi:
      "ਜੀ sau tên hoặc chức danh làm câu lịch sự hơn. Công thức ਜੇ ਤੁਹਾਡੇ ਲਈ ਸੰਭਵ ਹੋਵੇ tương đương 'nếu thuận tiện cho ông/bà', mềm hơn yêu cầu trực tiếp.",
    notes_en:
      "ਜੀ after a name or title adds politeness. ਜੇ ਤੁਹਾਡੇ ਲਈ ਸੰਭਵ ਹੋਵੇ means 'if it is possible for you' and softens a direct request.",
    tip_vi:
      "Email C1 nên có ba phần: lý do viết, yêu cầu cụ thể có hạn thời gian, và lời cảm ơn. Không dùng mệnh lệnh trần khi viết cho giảng viên hoặc cấp trên.",
    tip_en:
      "A C1 email needs three parts: reason for writing, a specific request with timing, and thanks. Avoid bare imperatives when writing to faculty or senior colleagues.",
  },
  {
    id: "pa_c1_meeting_agenda",
    level: "C1",
    category: "meeting",
    title_pa: "ਮੀਟਿੰਗ ਦਾ ਐਜੰਡਾ ਸੰਭਾਲਣਾ",
    title_vi: "Điều phối chương trình họp",
    title_en: "Managing a meeting agenda",
    sentences: [
      {
        pa: "ਆਓ ਪਹਿਲਾਂ ਐਜੰਡੇ ਦੇ ਤਿੰਨ ਮੁੱਖ ਬਿੰਦੂ ਸਪਸ਼ਟ ਕਰ ਲਈਏ।",
        rom: "aao pahilan agenda de tinn mukh bindu spasht kar laiye.",
        vi: "Trước hết, chúng ta hãy làm rõ ba điểm chính của chương trình họp.",
        en: "Let us first clarify the three main points on the agenda.",
      },
      {
        pa: "ਇਸ ਮੱਦੇ ਉੱਤੇ ਫ਼ੈਸਲਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਾਨੂੰ ਖ਼ਤਰੇ ਅਤੇ ਲਾਭ ਦੋਵੇਂ ਵੇਖਣੇ ਪੈਣਗੇ।",
        rom: "is madde utte faisla karan ton pahilan sanu khatre ate labh dovein vekhne painge.",
        vi: "Trước khi quyết định về vấn đề này, chúng ta phải xem xét cả rủi ro và lợi ích.",
        en: "Before deciding on this matter, we will need to examine both risks and benefits.",
      },
      {
        pa: "ਜੇ ਕੋਈ ਐਤਰਾਜ਼ ਨਹੀਂ, ਅਸੀਂ ਦੂਜੇ ਬਿੰਦੂ ਵੱਲ ਵਧਦੇ ਹਾਂ।",
        rom: "je koi aitraaz nahi, asi duje bindu vall vadhde han.",
        vi: "Nếu không có phản đối nào, chúng ta chuyển sang điểm thứ hai.",
        en: "If there are no objections, we will move to the second point.",
      },
    ],
    vocabulary: [
      { word: "ਐਜੰਡਾ", rom: "agenda", vi: "chương trình họp", en: "agenda", pos: "n." },
      { word: "ਬਿੰਦੂ", rom: "bindu", vi: "điểm, mục", en: "point / item", pos: "n." },
      { word: "ਐਤਰਾਜ਼", rom: "aitraaz", vi: "sự phản đối", en: "objection", pos: "n." },
      { word: "ਫ਼ੈਸਲਾ", rom: "faisla", vi: "quyết định", en: "decision", pos: "n." },
    ],
    notes_vi:
      "ਆਓ + động từ tạo lời mời điều phối, không áp đặt. Trong họp chuyên nghiệp, dùng ਅਸੀਂ để tạo trách nhiệm chung thay vì chỉ ra lỗi cá nhân.",
    notes_en:
      "ਆਓ + verb frames facilitation as an invitation rather than an order. In professional meetings, ਅਸੀਂ creates shared responsibility instead of singling out blame.",
    tip_vi:
      "Người điều phối C1 cần báo chuyển chủ đề rõ: ਪਹਿਲਾਂ, ਫਿਰ, ਅੰਤ ਵਿੱਚ. Câu 'ਜੇ ਕੋਈ ਐਤਰਾਜ਼ ਨਹੀਂ' giúp chuyển tiếp mà vẫn cho người khác cơ hội phản hồi.",
    tip_en:
      "A C1 facilitator signposts movement clearly: ਪਹਿਲਾਂ, ਫਿਰ, ਅੰਤ ਵਿੱਚ. The phrase 'ਜੇ ਕੋਈ ਐਤਰਾਜ਼ ਨਹੀਂ' moves forward while leaving space for response.",
  },
  {
    id: "pa_c1_policy_discussion",
    level: "C1",
    category: "policy_discussion",
    title_pa: "ਨੀਤੀ ਬਾਰੇ ਸੰਤੁਲਿਤ ਚਰਚਾ",
    title_vi: "Thảo luận chính sách một cách cân bằng",
    title_en: "Balanced policy discussion",
    sentences: [
      {
        pa: "ਇਸ ਨੀਤੀ ਦਾ ਉਦੇਸ਼ ਪਹੁੰਚ ਵਧਾਉਣਾ ਹੈ, ਪਰ ਲਾਗੂ ਕਰਨ ਦੀ ਲਾਗਤ ਵੀ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
        rom: "is niti da udesh pahunch vadhauna hai, par lagu karan di lagat vi mahatvapuran hai.",
        vi: "Mục tiêu của chính sách này là mở rộng khả năng tiếp cận, nhưng chi phí triển khai cũng quan trọng.",
        en: "The aim of this policy is to expand access, but implementation cost is also significant.",
      },
      {
        pa: "ਨੀਤੀ ਦੀ ਸਫ਼ਲਤਾ ਇਸ ਗੱਲ ਤੇ ਨਿਰਭਰ ਕਰੇਗੀ ਕਿ ਸਥਾਨਕ ਸੰਸਥਾਵਾਂ ਕਿਵੇਂ ਸ਼ਾਮਲ ਹੁੰਦੀਆਂ ਹਨ।",
        rom: "niti di safalta is gall te nirbhar karegi ki sthanak sansthavan kiven shamil hundian han.",
        vi: "Thành công của chính sách sẽ phụ thuộc vào cách các tổ chức địa phương tham gia.",
        en: "The policy's success will depend on how local institutions participate.",
      },
      {
        pa: "ਇਸ ਲਈ, ਮੁਲਾਂਕਣ ਸਿਰਫ਼ ਅੰਕੜਿਆਂ ਨਾਲ ਨਹੀਂ, ਪ੍ਰਭਾਵ ਦੀ ਗੁਣਵੱਤਾ ਨਾਲ ਵੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "is lai, mulankan sirf ankrian nal nahi, prabhav di gunvatta nal vi hona chahida hai.",
        vi: "Vì vậy, việc đánh giá không chỉ nên dựa vào số liệu mà còn vào chất lượng tác động.",
        en: "Therefore, evaluation should consider not only numbers but also the quality of impact.",
      },
    ],
    vocabulary: [
      { word: "ਨੀਤੀ", rom: "niti", vi: "chính sách", en: "policy", pos: "n." },
      { word: "ਲਾਗੂ ਕਰਨਾ", rom: "lagu karna", vi: "triển khai, áp dụng", en: "to implement", pos: "v." },
      { word: "ਮੁਲਾਂਕਣ", rom: "mulankan", vi: "đánh giá", en: "evaluation", pos: "n." },
      { word: "ਪ੍ਰਭਾਵ", rom: "prabhav", vi: "tác động", en: "impact", pos: "n." },
    ],
    notes_vi:
      "Cấu trúc 'ਉਦੇਸ਼... ਪਰ...' cho phép nêu mục tiêu và giới hạn cùng lúc. Đây là văn phong chính sách cân bằng, tránh biến thảo luận thành khẩu hiệu.",
    notes_en:
      "The frame 'ਉਦੇਸ਼... ਪਰ...' lets you state an aim and a constraint together. This creates balanced policy prose rather than slogan-like language.",
    tip_vi:
      "Khi nói về chính sách, ghép ba lớp: mục tiêu, điều kiện triển khai, tiêu chí đánh giá. Đó là mức C1 vì câu trả lời có cấu trúc, không chỉ có ý kiến.",
    tip_en:
      "For policy discussion, combine three layers: aim, implementation condition, and evaluation criterion. That is C1 because the response is structured, not merely opinionated.",
  },
  {
    id: "pa_c1_summarizing_information",
    level: "C1",
    category: "summary",
    title_pa: "ਜਾਣਕਾਰੀ ਦਾ ਸੰਖੇਪ ਸਾਰ",
    title_vi: "Tóm tắt thông tin một cách chính xác",
    title_en: "Summarizing information precisely",
    sentences: [
      {
        pa: "ਸੰਖੇਪ ਵਿੱਚ, ਰਿਪੋਰਟ ਤਿੰਨ ਮੁੱਖ ਰੁਝਾਨ ਦਰਸਾਉਂਦੀ ਹੈ।",
        rom: "sankhep vich, report tinn mukh rujhan darsaaundi hai.",
        vi: "Tóm lại, báo cáo cho thấy ba xu hướng chính.",
        en: "In brief, the report indicates three main trends.",
      },
      {
        pa: "ਪਹਿਲਾ ਰੁਝਾਨ ਭਾਗੀਦਾਰੀ ਵਿੱਚ ਵਾਧਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤਾਂ ਦੀ ਘਾਟ ਨਾਲ ਜੁੜਿਆ ਹੈ।",
        rom: "pahila rujhan bhagidari vich vadha hai, jadki duja sarotan di ghat nal juria hai.",
        vi: "Xu hướng thứ nhất là sự gia tăng tham gia, trong khi xu hướng thứ hai liên quan đến thiếu nguồn lực.",
        en: "The first trend is increased participation, while the second is linked to limited resources.",
      },
      {
        pa: "ਤੀਜਾ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਲੰਬੇ ਸਮੇਂ ਦੀ ਯੋਜਨਾ ਅਜੇ ਵੀ ਅਸਪਸ਼ਟ ਹੈ।",
        rom: "tija natija eh hai ki lambe same di yojna aje vi aspasht hai.",
        vi: "Kết luận thứ ba là kế hoạch dài hạn vẫn chưa rõ ràng.",
        en: "The third finding is that the long-term plan remains unclear.",
      },
    ],
    vocabulary: [
      { word: "ਸੰਖੇਪ ਵਿੱਚ", rom: "sankhep vich", vi: "tóm lại", en: "in brief", pos: "phr." },
      { word: "ਰੁਝਾਨ", rom: "rujhan", vi: "xu hướng", en: "trend", pos: "n." },
      { word: "ਭਾਗੀਦਾਰੀ", rom: "bhagidari", vi: "sự tham gia", en: "participation", pos: "n." },
      { word: "ਅਸਪਸ਼ਟ", rom: "aspasht", vi: "không rõ ràng", en: "unclear", pos: "adj." },
    ],
    notes_vi:
      "ਸੰਖੇਪ ਵਿੱਚ mở phần tóm tắt. ਜਦਕਿ tương đương 'trong khi', hữu ích để so sánh hai kết quả mà không viết hai câu rời rạc.",
    notes_en:
      "ਸੰਖੇਪ ਵਿੱਚ opens a summary. ਜਦਕਿ means 'whereas/while' and helps compare two findings without splitting them into disconnected sentences.",
    tip_vi:
      "Tóm tắt C1 không liệt kê mọi chi tiết. Hãy gom dữ liệu thành ਰੁਝਾਨ, ਨਤੀਜਾ, ਕਾਰਨ, ਸੀਮਾ: xu hướng, kết quả, nguyên nhân, giới hạn.",
    tip_en:
      "A C1 summary does not list every detail. Group information into ਰੁਝਾਨ, ਨਤੀਜਾ, ਕਾਰਨ, ਸੀਮਾ: trend, finding, cause, limitation.",
  },
  {
    id: "pa_c1_polite_disagreement",
    level: "C1",
    category: "polite_disagreement",
    title_pa: "ਅਸਹਿਮਤੀ ਨਿਮਰਤਾ ਨਾਲ ਪ੍ਰਗਟ ਕਰਨੀ",
    title_vi: "Bày tỏ bất đồng một cách lịch sự",
    title_en: "Expressing polite disagreement",
    sentences: [
      {
        pa: "ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਦਾ ਹਾਂ, ਪਰ ਇਸ ਨਤੀਜੇ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹਿਮਤ ਨਹੀਂ ਹਾਂ।",
        rom: "main tuhadi gall samajhda han, par is natije nal puri tarah sahimat nahi han.",
        vi: "Tôi hiểu ý của ông/bà, nhưng tôi không hoàn toàn đồng ý với kết luận này.",
        en: "I understand your point, but I do not fully agree with this conclusion.",
      },
      {
        pa: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ, ਸਬੂਤ ਇਸ ਤੋਂ ਕੁਝ ਵੱਖਰੀ ਤਸਵੀਰ ਪੇਸ਼ ਕਰਦੇ ਹਨ।",
        rom: "mere vichar vich, sabut is ton kujh vakhri tasvir pesh karde han.",
        vi: "Theo quan điểm của tôi, bằng chứng đưa ra một bức tranh hơi khác.",
        en: "In my view, the evidence presents a somewhat different picture.",
      },
      {
        pa: "ਸ਼ਾਇਦ ਅਸੀਂ ਇਸ ਦਲੀਲ ਨੂੰ ਹੋਰ ਸੀਮਿਤ ਰੂਪ ਵਿੱਚ ਰੱਖ ਸਕਦੇ ਹਾਂ।",
        rom: "shayad asi is daleel nu hor simit rup vich rakh sakde han.",
        vi: "Có lẽ chúng ta có thể trình bày lập luận này theo cách giới hạn hơn.",
        en: "Perhaps we can frame this argument in a more limited way.",
      },
    ],
    vocabulary: [
      { word: "ਅਸਹਿਮਤੀ", rom: "asahimati", vi: "bất đồng", en: "disagreement", pos: "n." },
      { word: "ਸਹਿਮਤ", rom: "sahimat", vi: "đồng ý", en: "in agreement", pos: "adj." },
      { word: "ਸਬੂਤ", rom: "sabut", vi: "bằng chứng", en: "evidence", pos: "n." },
      { word: "ਸੀਮਿਤ", rom: "simit", vi: "giới hạn", en: "limited", pos: "adj." },
    ],
    notes_vi:
      "Câu 'ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਦਾ ਹਾਂ' công nhận quan điểm trước khi phản biện. 'ਪੂਰੀ ਤਰ੍ਹਾਂ ਨਹੀਂ' mềm hơn 'ਗਲਤ ਹੈ' và phù hợp học thuật.",
    notes_en:
      "'ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਦਾ ਹਾਂ' acknowledges the other point before disagreement. 'Not fully' is softer than 'wrong' and fits academic register.",
    tip_vi:
      "Bất đồng C1 có bốn bước: công nhận, giới hạn mức đồng ý, nêu bằng chứng, đề xuất cách diễn đạt hẹp hơn.",
    tip_en:
      "C1 disagreement has four moves: acknowledge, limit agreement, cite evidence, and propose a narrower formulation.",
  },
  {
    id: "pa_c1_using_evidence",
    level: "C1",
    category: "evidence",
    title_pa: "ਸਬੂਤ ਨਾਲ ਦਲੀਲ ਮਜ਼ਬੂਤ ਕਰਨੀ",
    title_vi: "Củng cố lập luận bằng bằng chứng",
    title_en: "Strengthening an argument with evidence",
    sentences: [
      {
        pa: "ਉਪਲਬਧ ਸਬੂਤ ਦੱਸਦੇ ਹਨ ਕਿ ਇਹ ਰੁਝਾਨ ਇਕੱਲੀ ਘਟਨਾ ਨਹੀਂ ਹੈ।",
        rom: "upalabdh sabut dassde han ki eh rujhan ikalli ghatna nahi hai.",
        vi: "Bằng chứng hiện có cho thấy xu hướng này không phải là một sự kiện đơn lẻ.",
        en: "The available evidence indicates that this trend is not an isolated event.",
      },
      {
        pa: "ਹਾਲਾਂਕਿ ਨਮੂਨਾ ਛੋਟਾ ਹੈ, ਨਤੀਜੇ ਫਿਰ ਵੀ ਵਿਚਾਰਯੋਗ ਹਨ।",
        rom: "halanki namuna chhota hai, natije phir vi vicharyog han.",
        vi: "Mặc dù mẫu nhỏ, các kết quả vẫn đáng xem xét.",
        en: "Although the sample is small, the results are still worth considering.",
      },
      {
        pa: "ਇਹ ਦਾਅਵਾ ਹੋਰ ਮਜ਼ਬੂਤ ਹੋਵੇਗਾ ਜੇ ਅਸੀਂ ਤੁਲਨਾਤਮਕ ਡਾਟਾ ਸ਼ਾਮਲ ਕਰੀਏ।",
        rom: "eh daava hor mazbut hovega je asi tulnatmak data shamil kariye.",
        vi: "Luận điểm này sẽ mạnh hơn nếu chúng ta thêm dữ liệu so sánh.",
        en: "This claim would be stronger if we included comparative data.",
      },
    ],
    vocabulary: [
      { word: "ਉਪਲਬਧ", rom: "upalabdh", vi: "hiện có, sẵn có", en: "available", pos: "adj." },
      { word: "ਨਮੂਨਾ", rom: "namuna", vi: "mẫu", en: "sample", pos: "n." },
      { word: "ਵਿਚਾਰਯੋਗ", rom: "vicharyog", vi: "đáng xem xét", en: "worth considering", pos: "adj." },
      { word: "ਤੁਲਨਾਤਮਕ", rom: "tulnatmak", vi: "mang tính so sánh", en: "comparative", pos: "adj." },
    ],
    notes_vi:
      "ਹਾਲਾਂਕਿ... ਫਿਰ ਵੀ... là khung nhượng bộ: thừa nhận giới hạn nhưng giữ giá trị của lập luận. Đây là dấu hiệu văn phong học thuật trưởng thành.",
    notes_en:
      "ਹਾਲਾਂਕਿ... ਫਿਰ ਵੀ... is a concession frame: it admits a limitation while preserving the argument's value. This is a mature academic register marker.",
    tip_vi:
      "Đừng chỉ nói 'có bằng chứng'. Hãy nêu loại bằng chứng: ਉਪਲਬਧ, ਤੁਲਨਾਤਮਕ, ਗੁਣਾਤਮਕ, ਮਾਤਰਾਤਮਕ. Cụ thể hóa giúp lập luận đáng tin hơn.",
    tip_en:
      "Do not merely say 'there is evidence.' Name the type: available, comparative, qualitative, quantitative. Specificity makes the argument more credible.",
  },
  {
    id: "pa_c1_recommendation",
    level: "C1",
    category: "recommendation",
    title_pa: "ਪੇਸ਼ਾਵਰ ਸਿਫਾਰਸ਼ ਦੇਣੀ",
    title_vi: "Đưa ra khuyến nghị chuyên nghiệp",
    title_en: "Giving a professional recommendation",
    sentences: [
      {
        pa: "ਮੇਰੀ ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਪਾਇਲਟ ਯੋਜਨਾ ਪਹਿਲਾਂ ਦੋ ਵਿਭਾਗਾਂ ਵਿੱਚ ਸ਼ੁਰੂ ਕੀਤੀ ਜਾਵੇ।",
        rom: "meri sifarash hai ki pilot yojna pahilan do vibhagan vich shuru kiti jave.",
        vi: "Khuyến nghị của tôi là trước hết triển khai kế hoạch thí điểm ở hai phòng ban.",
        en: "My recommendation is to begin the pilot plan in two departments first.",
      },
      {
        pa: "ਇਸ ਨਾਲ ਖ਼ਤਰਾ ਸੀਮਿਤ ਰਹੇਗਾ ਅਤੇ ਸਿੱਖਣ ਲਈ ਕਾਫ਼ੀ ਡਾਟਾ ਮਿਲੇਗਾ।",
        rom: "is nal khatra simit rahega ate sikhan lai kafi data milega.",
        vi: "Cách này sẽ giữ rủi ro ở mức giới hạn và cung cấp đủ dữ liệu để học hỏi.",
        en: "This would limit risk while providing enough data for learning.",
      },
      {
        pa: "ਜੇ ਨਤੀਜੇ ਸੰਤੋਸ਼ਜਨਕ ਹੋਣ, ਤਦ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਵਿਸਤਾਰ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
        rom: "je natije santoshjanak hon, tad agle paraa vich vistar kita ja sakda hai.",
        vi: "Nếu kết quả đạt yêu cầu, có thể mở rộng ở giai đoạn tiếp theo.",
        en: "If the results are satisfactory, expansion can follow in the next phase.",
      },
    ],
    vocabulary: [
      { word: "ਸਿਫਾਰਸ਼", rom: "sifarash", vi: "khuyến nghị", en: "recommendation", pos: "n." },
      { word: "ਪਾਇਲਟ ਯੋਜਨਾ", rom: "pilot yojna", vi: "kế hoạch thí điểm", en: "pilot plan", pos: "n." },
      { word: "ਪੜਾਅ", rom: "paraa", vi: "giai đoạn", en: "phase", pos: "n." },
      { word: "ਵਿਸਤਾਰ", rom: "vistar", vi: "mở rộng", en: "expansion", pos: "n." },
    ],
    notes_vi:
      "Câu bị động/khả năng 'ਕੀਤੀ ਜਾਵੇ' và 'ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ' tạo giọng khách quan, phù hợp báo cáo hoặc đề xuất nội bộ.",
    notes_en:
      "Passive/potential forms such as 'ਕੀਤੀ ਜਾਵੇ' and 'ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ' create an objective tone suitable for reports or internal proposals.",
    tip_vi:
      "Khuyến nghị mạnh ở C1 thường có điều kiện: làm gì, vì sao, giới hạn rủi ro thế nào, và khi nào mở rộng.",
    tip_en:
      "A strong C1 recommendation is conditional: what to do, why, how risk is limited, and when to expand.",
  },
  {
    id: "pa_c1_academic_citation",
    level: "C1",
    category: "evidence",
    title_pa: "ਅਕਾਦਮਿਕ ਹਵਾਲਾ ਅਤੇ ਪਰਾਭਾਸ਼ਾ",
    title_vi: "Trích dẫn và diễn giải học thuật",
    title_en: "Academic citation and paraphrase",
    sentences: [
      {
        pa: "ਲੇਖਕ ਦਲੀਲ ਦਿੰਦਾ ਹੈ ਕਿ ਸਮਾਜਕ ਭਰੋਸਾ ਸੰਸਥਾਵਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਨਾਲ ਜੁੜਿਆ ਹੈ।",
        rom: "lekhak daleel dinda hai ki samajik bharosa sansthavan di karguzari nal juria hai.",
        vi: "Tác giả lập luận rằng niềm tin xã hội gắn với hiệu quả hoạt động của các tổ chức.",
        en: "The author argues that social trust is linked to institutional performance.",
      },
      {
        pa: "ਦੂਜੇ ਸ਼ਬਦਾਂ ਵਿੱਚ, ਸਮੱਸਿਆ ਸਿਰਫ਼ ਸਰੋਤਾਂ ਦੀ ਨਹੀਂ, ਭਰੋਸੇ ਦੀ ਵੀ ਹੈ।",
        rom: "duje shabdan vich, samasya sirf sarotan di nahi, bharose di vi hai.",
        vi: "Nói cách khác, vấn đề không chỉ là nguồn lực mà còn là niềm tin.",
        en: "In other words, the problem is not only resources but also trust.",
      },
      {
        pa: "ਇਹ ਪਰਾਭਾਸ਼ਾ ਮੂਲ ਵਿਚਾਰ ਨੂੰ ਰੱਖਦੀ ਹੈ ਪਰ ਸ਼ਬਦਾਵਲੀ ਬਦਲਦੀ ਹੈ।",
        rom: "eh parabhasha mul vichar nu rakhdi hai par shabdavali badaldi hai.",
        vi: "Cách diễn giải này giữ ý gốc nhưng thay đổi cách dùng từ.",
        en: "This paraphrase preserves the original idea while changing the wording.",
      },
    ],
    vocabulary: [
      { word: "ਲੇਖਕ", rom: "lekhak", vi: "tác giả", en: "author", pos: "n." },
      { word: "ਸਮਾਜਕ ਭਰੋਸਾ", rom: "samajik bharosa", vi: "niềm tin xã hội", en: "social trust", pos: "n." },
      { word: "ਪਰਾਭਾਸ਼ਾ", rom: "parabhasha", vi: "diễn giải", en: "paraphrase", pos: "n." },
      { word: "ਸ਼ਬਦਾਵਲੀ", rom: "shabdavali", vi: "từ vựng, cách dùng từ", en: "vocabulary / wording", pos: "n." },
    ],
    notes_vi:
      "ਲੇਖਕ ਦਲੀਲ ਦਿੰਦਾ ਹੈ ਕਿ... là công thức báo cáo nguồn. ਦੂਜੇ ਸ਼ਬਦਾਂ ਵਿੱਚ dùng để diễn giải, không phải để thêm ý mới không có trong nguồn.",
    notes_en:
      "ਲੇਖਕ ਦਲੀਲ ਦਿੰਦਾ ਹੈ ਕਿ... is a source-reporting frame. ਦੂਜੇ ਸ਼ਬਦਾਂ ਵਿੱਚ marks paraphrase, not an excuse to add a new idea absent from the source.",
    tip_vi:
      "Khi diễn giải học thuật, giữ quan hệ ý nghĩa nhưng đổi cấu trúc câu. Nếu giữ quá nhiều từ gốc, đó không còn là diễn giải tốt.",
    tip_en:
      "In academic paraphrase, preserve the conceptual relationship but change sentence structure. Keeping too much original wording weakens the paraphrase.",
  },
  {
    id: "pa_c1_meeting_minutes",
    level: "C1",
    category: "meeting",
    title_pa: "ਮੀਟਿੰਗ ਦੇ ਫ਼ੈਸਲੇ ਦਰਜ ਕਰਨੇ",
    title_vi: "Ghi biên bản quyết định cuộc họp",
    title_en: "Recording meeting decisions",
    sentences: [
      {
        pa: "ਮੀਟਿੰਗ ਵਿੱਚ ਇਹ ਫ਼ੈਸਲਾ ਕੀਤਾ ਗਿਆ ਕਿ ਮਸੌਦਾ ਅਗਲੇ ਸੋਮਵਾਰ ਤੱਕ ਸੋਧਿਆ ਜਾਵੇਗਾ।",
        rom: "meeting vich eh faisla kita gia ki masoda agle somvar takk sodhia javega.",
        vi: "Trong cuộc họp, đã quyết định rằng bản dự thảo sẽ được sửa trước thứ Hai tới.",
        en: "The meeting decided that the draft will be revised by next Monday.",
      },
      {
        pa: "ਕਾਰਵਾਈ ਲਈ ਜ਼ਿੰਮੇਵਾਰ ਟੀਮ ਨੂੰ ਸਮਾਂ-ਸਾਰਣੀ ਭੇਜੀ ਜਾਵੇਗੀ।",
        rom: "karvai lai zimmedar team nu sama-sarni bheji javegi.",
        vi: "Nhóm chịu trách nhiệm hành động sẽ được gửi lịch trình.",
        en: "The team responsible for action will be sent the timeline.",
      },
      {
        pa: "ਅਗਲੀ ਸਮੀਖਿਆ ਵਿੱਚ ਤਰੱਕੀ ਅਤੇ ਬਾਕੀ ਚੁਣੌਤੀਆਂ ਦੋਵੇਂ ਵੇਖੀਆਂ ਜਾਣਗੀਆਂ।",
        rom: "agli samikhia vich tarakki ate baki chunautian dovein vekhian jangian.",
        vi: "Trong lần rà soát tiếp theo, cả tiến độ và các thách thức còn lại sẽ được xem xét.",
        en: "The next review will examine both progress and remaining challenges.",
      },
    ],
    vocabulary: [
      { word: "ਮਸੌਦਾ", rom: "masoda", vi: "bản dự thảo", en: "draft", pos: "n." },
      { word: "ਸੋਧਣਾ", rom: "sodhna", vi: "sửa đổi, chỉnh sửa", en: "to revise", pos: "v." },
      { word: "ਸਮਾਂ-ਸਾਰਣੀ", rom: "sama-sarni", vi: "lịch trình", en: "timeline", pos: "n." },
      { word: "ਸਮੀਖਿਆ", rom: "samikhia", vi: "rà soát, đánh giá lại", en: "review", pos: "n." },
    ],
    notes_vi:
      "Biên bản thường dùng bị động để tập trung vào quyết định hơn là người nói: ਫ਼ੈਸਲਾ ਕੀਤਾ ਗਿਆ, ਭੇਜੀ ਜਾਵੇਗੀ, ਵੇਖੀਆਂ ਜਾਣਗੀਆਂ.",
    notes_en:
      "Minutes often use passive voice to focus on decisions rather than speakers: ਫ਼ੈਸਲਾ ਕੀਤਾ ਗਿਆ, ਭੇਜੀ ਜਾਵੇਗੀ, ਵੇਖੀਆਂ ਜਾਣਗੀਆਂ.",
    tip_vi:
      "Biên bản C1 cần ghi ba thứ: quyết định, người/nhóm chịu trách nhiệm, hạn thời gian. Thiếu một trong ba phần này thì chưa đủ hành động.",
    tip_en:
      "C1 minutes should record three items: decision, responsible person/team, and deadline. Without one of these, the action item is incomplete.",
  },
  {
    id: "pa_c1_executive_summary",
    level: "C1",
    category: "summary",
    title_pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ ਲਿਖਣਾ",
    title_vi: "Viết tóm tắt điều hành",
    title_en: "Writing an executive summary",
    sentences: [
      {
        pa: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ ਦਾ ਮਕਸਦ ਪੂਰੇ ਦਸਤਾਵੇਜ਼ ਦੀ ਮੁੱਖ ਦਿਸ਼ਾ ਸਾਫ਼ ਕਰਨਾ ਹੈ।",
        rom: "karjkari sankhep da maksad pure dastavez di mukh disha saaf karna hai.",
        vi: "Mục đích của tóm tắt điều hành là làm rõ hướng chính của toàn bộ tài liệu.",
        en: "The purpose of an executive summary is to clarify the main direction of the whole document.",
      },
      {
        pa: "ਮੁੱਖ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਮੌਜੂਦਾ ਪ੍ਰਕਿਰਿਆ ਕਾਰਗਰ ਹੈ, ਪਰ ਮਾਪਣ ਦੀ ਪ੍ਰਣਾਲੀ ਕਮਜ਼ੋਰ ਹੈ।",
        rom: "mukh natija eh hai ki maujuda prakiria kargar hai, par mapan di pranali kamzor hai.",
        vi: "Kết luận chính là quy trình hiện tại hiệu quả, nhưng hệ thống đo lường còn yếu.",
        en: "The main finding is that the current process is effective, but the measurement system is weak.",
      },
      {
        pa: "ਇਸ ਲਈ ਤਿੰਨ ਮਹੀਨਿਆਂ ਦੇ ਅੰਦਰ ਨਵਾਂ ਮਾਪਦੰਡ ਲਾਗੂ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।",
        rom: "is lai tinn mahinian de andar nava mapdand lagu karan di sifarash kiti jandi hai.",
        vi: "Vì vậy, khuyến nghị triển khai tiêu chuẩn đo lường mới trong vòng ba tháng.",
        en: "Therefore, implementing a new metric within three months is recommended.",
      },
    ],
    vocabulary: [
      { word: "ਕਾਰਜਕਾਰੀ ਸੰਖੇਪ", rom: "karjkari sankhep", vi: "tóm tắt điều hành", en: "executive summary", pos: "n." },
      { word: "ਦਸਤਾਵੇਜ਼", rom: "dastavez", vi: "tài liệu", en: "document", pos: "n." },
      { word: "ਪ੍ਰਕਿਰਿਆ", rom: "prakiria", vi: "quy trình", en: "process", pos: "n." },
      { word: "ਮਾਪਦੰਡ", rom: "mapdand", vi: "tiêu chuẩn đo lường", en: "metric / standard", pos: "n." },
    ],
    notes_vi:
      "Tóm tắt điều hành không phải mục lục. Nó phải nêu vấn đề, kết luận chính và khuyến nghị để người bận rộn có thể quyết định nhanh.",
    notes_en:
      "An executive summary is not a table of contents. It states the issue, main finding, and recommendation so a busy reader can decide quickly.",
    tip_vi:
      "Dùng 'ਮੁੱਖ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ...' để nêu kết luận chính. Sau đó nối bằng 'ਇਸ ਲਈ...' để biến kết luận thành hành động.",
    tip_en:
      "Use 'ਮੁੱਖ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ...' to state the main finding. Then connect with 'ਇਸ ਲਈ...' to turn the finding into action.",
  },
  {
    id: "pa_c1_professional_followup",
    level: "C1",
    category: "formal_message",
    title_pa: "ਮੀਟਿੰਗ ਤੋਂ ਬਾਅਦ ਰਸਮੀ ਸੁਨੇਹਾ",
    title_vi: "Tin nhắn trang trọng sau cuộc họp",
    title_en: "Formal follow-up after a meeting",
    sentences: [
      {
        pa: "ਅੱਜ ਦੀ ਚਰਚਾ ਲਈ ਧੰਨਵਾਦ; ਤੁਹਾਡੇ ਸੁਝਾਅ ਬਹੁਤ ਲਾਭਦਾਇਕ ਰਹੇ।",
        rom: "ajj di charcha lai dhanvad; tuhade sujhaa bahut labhdaik rahe.",
        vi: "Cảm ơn về cuộc thảo luận hôm nay; các góp ý của ông/bà rất hữu ích.",
        en: "Thank you for today's discussion; your suggestions were very useful.",
      },
      {
        pa: "ਜਿਵੇਂ ਸਹਿਮਤੀ ਹੋਈ, ਮੈਂ ਸੋਧਿਆ ਹੋਇਆ ਮਸੌਦਾ ਬੁੱਧਵਾਰ ਤੱਕ ਸਾਂਝਾ ਕਰਾਂਗਾ।",
        rom: "jiven sahimati hoi, main sodhia hoia masoda budhvar takk sanjha karanga.",
        vi: "Như đã thống nhất, tôi sẽ chia sẻ bản dự thảo đã chỉnh sửa trước thứ Tư.",
        en: "As agreed, I will share the revised draft by Wednesday.",
      },
      {
        pa: "ਜੇ ਕੋਈ ਵਾਧੂ ਟਿੱਪਣੀ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਜਾਣੂ ਕਰਵਾਓ।",
        rom: "je koi vadhu tippani hove, kirpa karke mainu janu karvao.",
        vi: "Nếu có nhận xét bổ sung, xin vui lòng cho tôi biết.",
        en: "If there are any additional comments, please let me know.",
      },
    ],
    vocabulary: [
      { word: "ਸੁਝਾਅ", rom: "sujhaa", vi: "gợi ý, góp ý", en: "suggestion", pos: "n." },
      { word: "ਲਾਭਦਾਇਕ", rom: "labhdaik", vi: "hữu ích", en: "useful", pos: "adj." },
      { word: "ਸਾਂਝਾ ਕਰਨਾ", rom: "sanjha karna", vi: "chia sẻ", en: "to share", pos: "v." },
      { word: "ਜਾਣੂ ਕਰਵਾਉਣਾ", rom: "janu karvauna", vi: "cho biết, thông báo", en: "to inform", pos: "v." },
    ],
    notes_vi:
      "ਜਿਵੇਂ ਸਹਿਮਤੀ ਹੋਈ tương đương 'as agreed' và rất hữu ích trong email/tin nhắn sau họp để biến trao đổi thành cam kết cụ thể.",
    notes_en:
      "ਜਿਵੇਂ ਸਹਿਮਤੀ ਹੋਈ means 'as agreed' and is useful in follow-up messages because it turns discussion into a concrete commitment.",
    tip_vi:
      "Follow-up C1 nên lịch sự nhưng rõ trách nhiệm: cảm ơn, nhắc điều đã thống nhất, nêu sản phẩm và hạn gửi.",
    tip_en:
      "A C1 follow-up is polite but accountable: thank the reader, restate what was agreed, name the deliverable and deadline.",
  },
  {
    id: "pa_c1_research_limitations",
    level: "C1",
    category: "evidence",
    title_pa: "ਖੋਜ ਦੀਆਂ ਸੀਮਾਵਾਂ ਮੰਨਣੀਆਂ",
    title_vi: "Thừa nhận giới hạn nghiên cứu",
    title_en: "Acknowledging research limitations",
    sentences: [
      {
        pa: "ਇਸ ਅਧਿਐਨ ਦੀ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ਡਾਟਾ ਸਿਰਫ਼ ਇੱਕ ਖੇਤਰ ਤੋਂ ਇਕੱਠਾ ਕੀਤਾ ਗਿਆ।",
        rom: "is adhian di ikk mahatvapuran sima eh hai ki data sirf ikk khetar ton ikattha kita gia.",
        vi: "Một giới hạn quan trọng của nghiên cứu này là dữ liệu chỉ được thu thập từ một khu vực.",
        en: "One important limitation of this study is that data was collected from only one region.",
      },
      {
        pa: "ਇਸ ਕਾਰਨ ਨਤੀਜਿਆਂ ਨੂੰ ਸਾਰੇ ਸੰਦਰਭਾਂ ਤੇ ਲਾਗੂ ਕਰਨਾ ਠੀਕ ਨਹੀਂ ਹੋਵੇਗਾ।",
        rom: "is karan natijian nu sare sandarbhan te lagu karna thik nahi hovega.",
        vi: "Vì lý do này, sẽ không phù hợp nếu áp dụng kết quả cho mọi bối cảnh.",
        en: "For this reason, it would not be appropriate to apply the findings to all contexts.",
      },
      {
        pa: "ਫਿਰ ਵੀ, ਅਧਿਐਨ ਅਗਲੀ ਖੋਜ ਲਈ ਲਾਭਦਾਇਕ ਦਿਸ਼ਾ ਦਿੰਦਾ ਹੈ।",
        rom: "phir vi, adhian agli khoj lai labhdaik disha dinda hai.",
        vi: "Tuy vậy, nghiên cứu vẫn đưa ra hướng hữu ích cho nghiên cứu tiếp theo.",
        en: "Even so, the study provides a useful direction for further research.",
      },
    ],
    vocabulary: [
      { word: "ਅਧਿਐਨ", rom: "adhian", vi: "nghiên cứu", en: "study", pos: "n." },
      { word: "ਸੀਮਾ", rom: "sima", vi: "giới hạn", en: "limitation", pos: "n." },
      { word: "ਸੰਦਰਭ", rom: "sandarbh", vi: "bối cảnh", en: "context", pos: "n." },
      { word: "ਅਗਲੀ ਖੋਜ", rom: "agli khoj", vi: "nghiên cứu tiếp theo", en: "further research", pos: "n." },
    ],
    notes_vi:
      "Ở C1, thừa nhận ਸੀਮਾ không làm lập luận yếu đi; nó làm phạm vi kết luận chính xác hơn. ਫਿਰ ਵੀ giúp giữ giá trị sau khi nêu hạn chế.",
    notes_en:
      "At C1, acknowledging a ਸੀਮਾ does not weaken the argument; it makes the scope of the conclusion more precise. ਫਿਰ ਵੀ preserves value after a limitation.",
    tip_vi:
      "Công thức hữu ích: ਸੀਮਾ → hậu quả diễn giải → giá trị còn lại. Đây là cách viết học thuật cẩn trọng.",
    tip_en:
      "Useful formula: limitation → interpretive consequence → remaining value. This is careful academic writing.",
  },
];
