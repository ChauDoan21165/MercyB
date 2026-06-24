// src/languages/punjabi/narrativeTasksB1.ts
//
// Punjabi B1 narrative task cards for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only as script awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1NarrativeFocus =
  | "retell_events"
  | "explain_sequence"
  | "cause_effect"
  | "workplace_incident"
  | "health_service_problem"
  | "before_after_comparison";

export type PunjabiNarrativeLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiNarrativeTrap = {
  trap_en: string;
  trap_vi: string;
  repair: PunjabiNarrativeLine;
};

export type PunjabiB1NarrativeTask = {
  id: string;
  level: "B1";
  focus: PunjabiB1NarrativeFocus;
  title_en: string;
  title_vi: string;
  context_en: string;
  context_vi: string;
  narrativeGoal_en: string;
  narrativeGoal_vi: string;
  canadaContext?: string;
  sequenceMarkers: PunjabiNarrativeLine[];
  modelNarrative: PunjabiNarrativeLine[];
  expansionPrompt_en: string;
  expansionPrompt_vi: string;
  commonTraps: PunjabiNarrativeTrap[];
};

export const punjabiB1NarrativeTasks: PunjabiB1NarrativeTask[] = [
  {
    id: "pa-b1-narrative-01-late-appointment",
    level: "B1",
    focus: "retell_events",
    title_en: "Retell why you missed part of an appointment",
    title_vi: "Kể lại vì sao bạn lỡ một phần lịch hẹn",
    context_en: "You arrived late to a clinic or settlement-service appointment.",
    context_vi: "Bạn đến muộn lịch hẹn ở phòng khám hoặc dịch vụ hỗ trợ định cư.",
    narrativeGoal_en: "Retell three events in order and end with what you did next.",
    narrativeGoal_vi: "Kể ba sự việc theo thứ tự và kết thúc bằng việc bạn làm tiếp theo.",
    canadaContext: "Useful for clinic, school, settlement, or Service Canada-style appointments.",
    sequenceMarkers: [
      { pa: "ਪਹਿਲਾਂ", romanization: "pahilan", en: "first", vi: "trước tiên" },
      { pa: "ਫਿਰ", romanization: "phir", en: "then", vi: "sau đó" },
      { pa: "ਅਖੀਰ ਵਿੱਚ", romanization: "akhir vich", en: "in the end", vi: "cuối cùng" },
    ],
    modelNarrative: [
      { pa: "ਪਹਿਲਾਂ ਮੇਰੀ ਬੱਸ ਦੇਰ ਨਾਲ ਆਈ।", romanization: "pahilan meri bass der naal aai.", en: "First, my bus arrived late.", vi: "Trước tiên, xe buýt của tôi đến trễ." },
      { pa: "ਫਿਰ ਰਸਤੇ ਵਿੱਚ ਟ੍ਰੈਫਿਕ ਬਹੁਤ ਸੀ।", romanization: "phir raste vich traffic bahut si.", en: "Then there was a lot of traffic on the way.", vi: "Sau đó trên đường rất kẹt xe." },
      { pa: "ਅਖੀਰ ਵਿੱਚ ਮੈਂ ਰਿਸੈਪਸ਼ਨ ਨੂੰ ਫ਼ੋਨ ਕਰਕੇ ਨਵਾਂ ਸਮਾਂ ਪੁੱਛਿਆ।", romanization: "akhir vich main reception nu phone karke nava sama puchhia.", en: "In the end, I called reception and asked for a new time.", vi: "Cuối cùng, tôi gọi lễ tân và hỏi giờ mới." },
    ],
    expansionPrompt_en: "Add one sentence explaining how long the delay was.",
    expansionPrompt_vi: "Thêm một câu giải thích bị trễ bao lâu.",
    commonTraps: [
      {
        trap_en: "Listing events without time markers makes the story hard to follow.",
        trap_vi: "Liệt kê sự việc mà không có mốc thời gian làm câu chuyện khó theo dõi.",
        repair: { pa: "ਉਸ ਤੋਂ ਬਾਅਦ ਮੈਂ ਦਫ਼ਤਰ ਪਹੁੰਚਿਆ।", romanization: "us ton baad main daftar pahunchia.", en: "After that, I reached the office.", vi: "Sau đó, tôi đến văn phòng." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-02-workplace-spill",
    level: "B1",
    focus: "workplace_incident",
    title_en: "Report a small workplace incident",
    title_vi: "Báo cáo một sự cố nhỏ ở nơi làm việc",
    context_en: "A box fell and a drink spilled near a walkway.",
    context_vi: "Một hộp rơi và đồ uống đổ gần lối đi.",
    narrativeGoal_en: "Report what happened, what risk it caused, and what action you took.",
    narrativeGoal_vi: "Báo cáo chuyện xảy ra, rủi ro gây ra và hành động bạn đã làm.",
    canadaContext: "Useful for safety reporting in retail, warehouse, school, or office jobs.",
    sequenceMarkers: [
      { pa: "ਜਦੋਂ", romanization: "jadon", en: "when", vi: "khi" },
      { pa: "ਇਸ ਕਰਕੇ", romanization: "is karke", en: "because of this / so", vi: "vì vậy" },
      { pa: "ਤੁਰੰਤ", romanization: "turant", en: "immediately", vi: "ngay lập tức" },
    ],
    modelNarrative: [
      { pa: "ਜਦੋਂ ਮੈਂ ਸ਼ੈਲਫ਼ ਸਾਫ਼ ਕਰ ਰਿਹਾ ਸੀ, ਇੱਕ ਬਾਕਸ ਹੇਠਾਂ ਡਿੱਗ ਗਿਆ।", romanization: "jadon main shelf saaf kar riha si, ikk box hethan digg gia.", en: "When I was cleaning the shelf, a box fell down.", vi: "Khi tôi đang lau kệ, một hộp rơi xuống." },
      { pa: "ਇਸ ਕਰਕੇ ਕੌਫੀ ਫਰਸ਼ ਤੇ ਡਿੱਗ ਗਈ ਅਤੇ ਰਸਤਾ ਗਿੱਲਾ ਹੋ ਗਿਆ।", romanization: "is karke coffee farsh te digg gai ate rasta gilla ho gia.", en: "Because of this, coffee spilled on the floor and the walkway became wet.", vi: "Vì vậy cà phê đổ xuống sàn và lối đi bị ướt." },
      { pa: "ਮੈਂ ਤੁਰੰਤ ਸਾਈਨ ਲਾਇਆ ਅਤੇ ਮੈਨੇਜਰ ਨੂੰ ਦੱਸਿਆ।", romanization: "main turant sign laia ate manager nu dassia.", en: "I immediately put up a sign and told the manager.", vi: "Tôi lập tức đặt biển báo và báo cho quản lý." },
    ],
    expansionPrompt_en: "Add who witnessed the incident and whether anyone was hurt.",
    expansionPrompt_vi: "Thêm ai chứng kiến sự cố và có ai bị thương không.",
    commonTraps: [
      {
        trap_en: "Forgetting to say the safety action after the problem.",
        trap_vi: "Quên nói hành động an toàn sau khi nêu vấn đề.",
        repair: { pa: "ਮੈਂ ਗਿੱਲੇ ਫਰਸ਼ ਦਾ ਸਾਈਨ ਲਾਇਆ।", romanization: "main gille farsh da sign laia.", en: "I put up a wet-floor sign.", vi: "Tôi đặt biển báo sàn ướt." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-03-health-problem",
    level: "B1",
    focus: "health_service_problem",
    title_en: "Explain a health problem over time",
    title_vi: "Giải thích vấn đề sức khỏe theo thời gian",
    context_en: "You tell clinic staff how a symptom started and changed.",
    context_vi: "Bạn nói với nhân viên phòng khám triệu chứng bắt đầu và thay đổi thế nào.",
    narrativeGoal_en: "Describe start time, change, and current problem. Language support only, not medical advice.",
    narrativeGoal_vi: "Mô tả thời điểm bắt đầu, sự thay đổi và vấn đề hiện tại. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    canadaContext: "Useful for walk-in clinic, nurse line, or family-doctor conversations.",
    sequenceMarkers: [
      { pa: "ਕੱਲ੍ਹ ਸਵੇਰੇ", romanization: "kallh savere", en: "yesterday morning / tomorrow morning by context", vi: "sáng hôm qua / sáng mai tùy ngữ cảnh" },
      { pa: "ਬਾਅਦ ਵਿੱਚ", romanization: "baad vich", en: "later", vi: "sau đó" },
      { pa: "ਹੁਣ", romanization: "hun", en: "now", vi: "bây giờ" },
    ],
    modelNarrative: [
      { pa: "ਕੱਲ੍ਹ ਸਵੇਰੇ ਮੇਰੇ ਗਲੇ ਵਿੱਚ ਦਰਦ ਸ਼ੁਰੂ ਹੋਇਆ।", romanization: "kallh savere mere gale vich dard shuru hoia.", en: "Yesterday morning, pain started in my throat.", vi: "Sáng hôm qua cổ họng tôi bắt đầu đau." },
      { pa: "ਬਾਅਦ ਵਿੱਚ ਖੰਘ ਵੀ ਸ਼ੁਰੂ ਹੋ ਗਈ।", romanization: "baad vich khangh vi shuru ho gai.", en: "Later, a cough also started.", vi: "Sau đó tôi cũng bắt đầu ho." },
      { pa: "ਹੁਣ ਰਾਤ ਨੂੰ ਸੌਣਾ ਔਖਾ ਹੈ।", romanization: "hun raat nu sauna aukha hai.", en: "Now it is hard to sleep at night.", vi: "Bây giờ ban đêm khó ngủ." },
    ],
    expansionPrompt_en: "Add how many days the symptom has lasted and whether it is getting better or worse.",
    expansionPrompt_vi: "Thêm triệu chứng kéo dài bao nhiêu ngày và đang đỡ hơn hay nặng hơn.",
    commonTraps: [
      {
        trap_en: "ਕੱਲ੍ਹ can mean yesterday or tomorrow; add a verb tense or extra time word.",
        trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; hãy thêm thì động từ hoặc từ chỉ thời gian.",
        repair: { pa: "ਕੱਲ੍ਹ ਸਵੇਰੇ ਦਰਦ ਸ਼ੁਰੂ ਹੋਇਆ ਸੀ।", romanization: "kallh savere dard shuru hoia si.", en: "The pain started yesterday morning.", vi: "Cơn đau bắt đầu sáng hôm qua." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-04-service-problem",
    level: "B1",
    focus: "health_service_problem",
    title_en: "Explain a service problem",
    title_vi: "Giải thích vấn đề dịch vụ",
    context_en: "You explain that your bank card or library card did not work.",
    context_vi: "Bạn giải thích rằng thẻ ngân hàng hoặc thẻ thư viện không hoạt động.",
    narrativeGoal_en: "Explain what you tried, what happened, and what help you need.",
    narrativeGoal_vi: "Giải thích bạn đã thử gì, chuyện gì xảy ra và cần trợ giúp gì.",
    canadaContext: "Useful for banks, libraries, transit-card desks, or community offices.",
    sequenceMarkers: [
      { pa: "ਪਹਿਲੀ ਵਾਰ", romanization: "pahili vaar", en: "the first time", vi: "lần đầu" },
      { pa: "ਦੂਜੀ ਵਾਰ", romanization: "duji vaar", en: "the second time", vi: "lần thứ hai" },
      { pa: "ਇਸ ਲਈ", romanization: "is lai", en: "therefore / so", vi: "vì vậy" },
    ],
    modelNarrative: [
      { pa: "ਪਹਿਲੀ ਵਾਰ ਮੈਂ ਕਾਰਡ ਮਸ਼ੀਨ ਵਿੱਚ ਲਾਇਆ, ਪਰ ਕੰਮ ਨਹੀਂ ਕੀਤਾ।", romanization: "pahili vaar main card machine vich laia, par kamm nahin kita.", en: "The first time I put the card in the machine, but it did not work.", vi: "Lần đầu tôi đưa thẻ vào máy, nhưng không hoạt động." },
      { pa: "ਦੂਜੀ ਵਾਰ ਸਕ੍ਰੀਨ ਤੇ ਗਲਤੀ ਆ ਗਈ।", romanization: "duji vaar screen te galti aa gai.", en: "The second time, an error appeared on the screen.", vi: "Lần thứ hai, màn hình hiện lỗi." },
      { pa: "ਇਸ ਲਈ ਮੈਨੂੰ ਨਵਾਂ ਕਾਰਡ ਜਾਂ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "is lai mainu nava card jaan madad chahidi hai.", en: "So I need a new card or help.", vi: "Vì vậy tôi cần thẻ mới hoặc trợ giúp." },
    ],
    expansionPrompt_en: "Add what the screen said and when the problem started.",
    expansionPrompt_vi: "Thêm màn hình ghi gì và vấn đề bắt đầu khi nào.",
    commonTraps: [
      {
        trap_en: "Saying only 'not working' without explaining what you tried.",
        trap_vi: "Chỉ nói 'không hoạt động' mà không giải thích đã thử gì.",
        repair: { pa: "ਮੈਂ ਦੋ ਵਾਰ ਕੋਸ਼ਿਸ਼ ਕੀਤੀ, ਪਰ ਹਰ ਵਾਰ ਗਲਤੀ ਆਈ।", romanization: "main do vaar koshish kiti, par har vaar galti aai.", en: "I tried twice, but each time an error came.", vi: "Tôi thử hai lần, nhưng lần nào cũng hiện lỗi." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-05-before-after-language",
    level: "B1",
    focus: "before_after_comparison",
    title_en: "Compare before and after learning Punjabi",
    title_vi: "So sánh trước và sau khi học Punjabi",
    context_en: "You describe progress in a language class.",
    context_vi: "Bạn mô tả tiến bộ trong lớp ngôn ngữ.",
    narrativeGoal_en: "Compare what was difficult before and what is easier now.",
    narrativeGoal_vi: "So sánh điều trước đây khó và điều bây giờ dễ hơn.",
    sequenceMarkers: [
      { pa: "ਪਹਿਲਾਂ", romanization: "pahilan", en: "before / earlier", vi: "trước đây" },
      { pa: "ਹੁਣ", romanization: "hun", en: "now", vi: "bây giờ" },
      { pa: "ਪਹਿਲਾਂ ਨਾਲੋਂ", romanization: "pahilan nalon", en: "compared with before", vi: "so với trước đây" },
    ],
    modelNarrative: [
      { pa: "ਪਹਿਲਾਂ ਮੈਨੂੰ ਫ਼ੋਨ ਤੇ ਪੰਜਾਬੀ ਸਮਝਣੀ ਔਖੀ ਲੱਗਦੀ ਸੀ।", romanization: "pahilan mainu phone te Punjabi samajhni aukhi lagdi si.", en: "Before, understanding Punjabi on the phone felt difficult to me.", vi: "Trước đây tôi thấy khó hiểu Punjabi qua điện thoại." },
      { pa: "ਹੁਣ ਮੈਂ ਹੌਲੀ ਗੱਲਬਾਤ ਵਿੱਚ ਮੁੱਖ ਜਾਣਕਾਰੀ ਸਮਝ ਲੈਂਦਾ ਹਾਂ।", romanization: "hun main hauli galbaat vich mukh jaankari samajh lainda han.", en: "Now I can understand the main information in slow conversation.", vi: "Bây giờ tôi hiểu được thông tin chính trong cuộc nói chuyện chậm." },
      { pa: "ਪਹਿਲਾਂ ਨਾਲੋਂ ਮੇਰਾ ਭਰੋਸਾ ਵਧ ਗਿਆ ਹੈ।", romanization: "pahilan nalon mera bharosa vadh gia hai.", en: "Compared with before, my confidence has increased.", vi: "So với trước đây, sự tự tin của tôi đã tăng." },
    ],
    expansionPrompt_en: "Add one example of a real conversation that is easier now.",
    expansionPrompt_vi: "Thêm một ví dụ về cuộc trò chuyện thật mà bây giờ dễ hơn.",
    commonTraps: [
      {
        trap_en: "Using only ਹੁਣ without clearly saying what changed from before.",
        trap_vi: "Chỉ dùng ਹੁਣ mà không nói rõ điều gì đã thay đổi so với trước.",
        repair: { pa: "ਪਹਿਲਾਂ ਇਹ ਔਖਾ ਸੀ, ਪਰ ਹੁਣ ਆਸਾਨ ਹੈ।", romanization: "pahilan eh aukha si, par hun aasan hai.", en: "Before it was hard, but now it is easy.", vi: "Trước đây nó khó, nhưng bây giờ dễ." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-06-explain-sequence-school",
    level: "B1",
    focus: "explain_sequence",
    title_en: "Explain steps for a school sign-up",
    title_vi: "Giải thích các bước đăng ký ở trường",
    context_en: "You explain how you signed up for a school or community class.",
    context_vi: "Bạn giải thích cách bạn đăng ký lớp ở trường hoặc cộng đồng.",
    narrativeGoal_en: "Explain a process using clear sequence words.",
    narrativeGoal_vi: "Giải thích một quy trình bằng từ chỉ trình tự rõ ràng.",
    canadaContext: "Useful for adult-school, library, and community-centre registration.",
    sequenceMarkers: [
      { pa: "ਸਭ ਤੋਂ ਪਹਿਲਾਂ", romanization: "sabh ton pahilan", en: "first of all", vi: "trước hết" },
      { pa: "ਫਿਰ", romanization: "phir", en: "then", vi: "sau đó" },
      { pa: "ਅੰਤ ਵਿੱਚ", romanization: "ant vich", en: "at the end", vi: "cuối cùng" },
    ],
    modelNarrative: [
      { pa: "ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਮੈਂ ਆਨਲਾਈਨ ਫਾਰਮ ਭਰਿਆ।", romanization: "sabh ton pahilan main online form bharia.", en: "First of all, I filled out the online form.", vi: "Trước hết, tôi điền mẫu trực tuyến." },
      { pa: "ਫਿਰ ਮੈਂ ਈਮੇਲ ਵਿੱਚ ਆਈ ਪੁਸ਼ਟੀ ਪੜ੍ਹੀ।", romanization: "phir main email vich aai pushti parhi.", en: "Then I read the confirmation that came by email.", vi: "Sau đó tôi đọc xác nhận gửi qua email." },
      { pa: "ਅੰਤ ਵਿੱਚ ਮੈਂ ਪਹਿਲੀ ਕਲਾਸ ਲਈ ਸਮੇਂ ਤੇ ਪਹੁੰਚਿਆ।", romanization: "ant vich main pahili class lai same te pahunchia.", en: "At the end, I arrived on time for the first class.", vi: "Cuối cùng, tôi đến đúng giờ cho buổi học đầu tiên." },
    ],
    expansionPrompt_en: "Add one sentence about a document or ID you had to show.",
    expansionPrompt_vi: "Thêm một câu về giấy tờ hoặc ID bạn phải trình.",
    commonTraps: [
      {
        trap_en: "Using ਫਿਰ repeatedly is understandable but can sound flat.",
        trap_vi: "Lặp lại ਫਿਰ nhiều lần vẫn hiểu được nhưng nghe đơn điệu.",
        repair: { pa: "ਉਸ ਤੋਂ ਬਾਅਦ ਮੈਂ ਫੀਸ ਭਰੀ।", romanization: "us ton baad main fees bhari.", en: "After that, I paid the fee.", vi: "Sau đó, tôi đóng phí." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-07-cause-effect-weather",
    level: "B1",
    focus: "cause_effect",
    title_en: "Describe cause and effect from weather",
    title_vi: "Mô tả nguyên nhân và kết quả do thời tiết",
    context_en: "Snow or heavy rain changed your plan.",
    context_vi: "Tuyết hoặc mưa lớn làm thay đổi kế hoạch của bạn.",
    narrativeGoal_en: "Connect the weather cause to the result and your decision.",
    narrativeGoal_vi: "Nối nguyên nhân thời tiết với kết quả và quyết định của bạn.",
    canadaContext: "Useful for Canadian winter delays, school notices, and workplace messages.",
    sequenceMarkers: [
      { pa: "ਕਿਉਂਕਿ", romanization: "kyonki", en: "because", vi: "bởi vì" },
      { pa: "ਇਸ ਕਰਕੇ", romanization: "is karke", en: "because of this / so", vi: "vì vậy" },
      { pa: "ਇਸ ਲਈ", romanization: "is lai", en: "therefore", vi: "do đó" },
    ],
    modelNarrative: [
      { pa: "ਕਿਉਂਕਿ ਬਰਫ਼ ਬਹੁਤ ਪਈ, ਰਸਤੇ ਬੰਦ ਹੋ ਗਏ।", romanization: "kyonki baraf bahut pai, raste band ho gaye.", en: "Because a lot of snow fell, the roads were closed.", vi: "Vì tuyết rơi nhiều, đường bị đóng." },
      { pa: "ਇਸ ਕਰਕੇ ਬੱਸਾਂ ਵੀ ਲੇਟ ਹੋ ਗਈਆਂ।", romanization: "is karke bassan vi late ho gaian.", en: "Because of this, the buses also became late.", vi: "Vì vậy xe buýt cũng bị trễ." },
      { pa: "ਇਸ ਲਈ ਮੈਂ ਮੀਟਿੰਗ ਆਨਲਾਈਨ ਕਰਨ ਲਈ ਕਿਹਾ।", romanization: "is lai main meeting online karan lai keha.", en: "Therefore, I asked to do the meeting online.", vi: "Do đó tôi xin họp trực tuyến." },
    ],
    expansionPrompt_en: "Change the cause to heavy rain and explain a different result.",
    expansionPrompt_vi: "Đổi nguyên nhân thành mưa lớn và giải thích một kết quả khác.",
    commonTraps: [
      {
        trap_en: "Putting ਕਿਉਂਕਿ and ਇਸ ਕਰਕੇ in the same short clause can be repetitive.",
        trap_vi: "Đặt ਕਿਉਂਕਿ và ਇਸ ਕਰਕੇ trong cùng mệnh đề ngắn có thể lặp.",
        repair: { pa: "ਮੀਂਹ ਪਿਆ, ਇਸ ਕਰਕੇ ਮੈਂ ਘਰ ਰਿਹਾ।", romanization: "minh pia, is karke main ghar riha.", en: "It rained, so I stayed home.", vi: "Trời mưa, nên tôi ở nhà." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-08-cause-effect-document",
    level: "B1",
    focus: "cause_effect",
    title_en: "Explain why an application is delayed",
    title_vi: "Giải thích vì sao hồ sơ bị chậm",
    context_en: "A public-service application is delayed because a document is missing.",
    context_vi: "Một hồ sơ dịch vụ công bị chậm vì thiếu giấy tờ.",
    narrativeGoal_en: "Explain cause, effect, and next step. Language support only, not legal advice.",
    narrativeGoal_vi: "Giải thích nguyên nhân, kết quả và bước tiếp theo. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    canadaContext: "Useful for service counters, newcomer support, and document checklists.",
    sequenceMarkers: [
      { pa: "ਕਿਉਂਕਿ", romanization: "kyonki", en: "because", vi: "bởi vì" },
      { pa: "ਇਸ ਕਰਕੇ", romanization: "is karke", en: "so / because of this", vi: "vì vậy" },
      { pa: "ਹੁਣ", romanization: "hun", en: "now", vi: "bây giờ" },
    ],
    modelNarrative: [
      { pa: "ਕਿਉਂਕਿ ਪਤੇ ਦਾ ਸਬੂਤ ਨਹੀਂ ਸੀ, ਅਰਜ਼ੀ ਪੂਰੀ ਨਹੀਂ ਹੋਈ।", romanization: "kyonki pate da saboot nahin si, arzi puri nahin hoi.", en: "Because there was no proof of address, the application was not complete.", vi: "Vì không có chứng minh địa chỉ, hồ sơ chưa hoàn chỉnh." },
      { pa: "ਇਸ ਕਰਕੇ ਅਧਿਕਾਰੀ ਨੇ ਮੈਨੂੰ ਕੱਲ੍ਹ ਵਾਪਸ ਆਉਣ ਲਈ ਕਿਹਾ।", romanization: "is karke adhikari ne mainu kallh wapas aun lai keha.", en: "So the officer told me to come back tomorrow.", vi: "Vì vậy nhân viên bảo tôi quay lại ngày mai." },
      { pa: "ਹੁਣ ਮੈਂ ਬਿੱਲ ਦੀ ਕਾਪੀ ਲਿਆਉਂਦਾ ਹਾਂ।", romanization: "hun main bill di copy liaunda han.", en: "Now I am bringing a copy of the bill.", vi: "Bây giờ tôi mang bản sao hóa đơn." },
    ],
    expansionPrompt_en: "Add a sentence asking the officer to write the missing document.",
    expansionPrompt_vi: "Thêm một câu nhờ nhân viên ghi ra giấy tờ còn thiếu.",
    commonTraps: [
      {
        trap_en: "Using ਅਰਜ਼ੀ for every paper; it means application, not every document.",
        trap_vi: "Dùng ਅਰਜ਼ੀ cho mọi giấy tờ; nó nghĩa là hồ sơ/đơn, không phải mọi tài liệu.",
        repair: { pa: "ਮੈਨੂੰ ਇਹ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣਾ ਹੈ।", romanization: "mainu eh dastavez liauna hai.", en: "I need to bring this document.", vi: "Tôi cần mang giấy tờ này." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-09-work-schedule-change",
    level: "B1",
    focus: "workplace_incident",
    title_en: "Report a schedule change at work",
    title_vi: "Báo thay đổi lịch làm việc",
    context_en: "Your shift changed after a coworker called in sick.",
    context_vi: "Ca làm của bạn thay đổi sau khi đồng nghiệp báo ốm.",
    narrativeGoal_en: "Explain what changed, why it changed, and what you confirmed.",
    narrativeGoal_vi: "Giải thích điều gì thay đổi, vì sao thay đổi và bạn đã xác nhận gì.",
    canadaContext: "Useful for hourly jobs, retail, food service, and childcare work.",
    sequenceMarkers: [
      { pa: "ਅੱਜ ਸਵੇਰੇ", romanization: "ajj savere", en: "this morning", vi: "sáng nay" },
      { pa: "ਫਿਰ", romanization: "phir", en: "then", vi: "sau đó" },
      { pa: "ਅਖੀਰ ਵਿੱਚ", romanization: "akhir vich", en: "in the end", vi: "cuối cùng" },
    ],
    modelNarrative: [
      { pa: "ਅੱਜ ਸਵੇਰੇ ਮੈਨੇਜਰ ਨੇ ਮੈਨੂੰ ਫ਼ੋਨ ਕੀਤਾ।", romanization: "ajj savere manager ne mainu phone kita.", en: "This morning, the manager called me.", vi: "Sáng nay quản lý gọi cho tôi." },
      { pa: "ਫਿਰ ਉਸ ਨੇ ਕਿਹਾ ਕਿ ਮੇਰਾ ਸ਼ਿਫਟ ਦੋ ਘੰਟੇ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਹੋਵੇਗਾ।", romanization: "phir us ne keha ki mera shift do ghante pahilan shuru hovega.", en: "Then they said my shift would start two hours earlier.", vi: "Sau đó quản lý nói ca của tôi sẽ bắt đầu sớm hơn hai tiếng." },
      { pa: "ਅਖੀਰ ਵਿੱਚ ਮੈਂ ਨਵਾਂ ਸਮਾਂ ਟੈਕਸਟ ਵਿੱਚ ਪੁਸ਼ਟੀ ਕਰ ਲਿਆ।", romanization: "akhir vich main nava sama text vich pushti kar lia.", en: "In the end, I confirmed the new time by text.", vi: "Cuối cùng, tôi xác nhận giờ mới qua tin nhắn." },
    ],
    expansionPrompt_en: "Add why the coworker could not come and who approved the change.",
    expansionPrompt_vi: "Thêm vì sao đồng nghiệp không đến được và ai duyệt thay đổi.",
    commonTraps: [
      {
        trap_en: "Not distinguishing ਪਹਿਲਾਂ as earlier in time versus first in sequence.",
        trap_vi: "Không phân biệt ਪਹਿਲਾਂ là sớm hơn về thời gian hay trước tiên trong trình tự.",
        repair: { pa: "ਮੇਰਾ ਸ਼ਿਫਟ ਦੋ ਘੰਟੇ ਜਲਦੀ ਸ਼ੁਰੂ ਹੋਵੇਗਾ।", romanization: "mera shift do ghante jaldi shuru hovega.", en: "My shift will start two hours early.", vi: "Ca của tôi sẽ bắt đầu sớm hơn hai tiếng." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-10-before-after-housing",
    level: "B1",
    focus: "before_after_comparison",
    title_en: "Compare housing before and after a repair",
    title_vi: "So sánh nhà ở trước và sau khi sửa",
    context_en: "A landlord fixed a heating or water problem.",
    context_vi: "Chủ nhà đã sửa vấn đề sưởi hoặc nước.",
    narrativeGoal_en: "Compare the problem before, the repair, and the result after.",
    narrativeGoal_vi: "So sánh vấn đề trước đó, việc sửa chữa và kết quả sau đó.",
    canadaContext: "Useful for rental repair follow-up and tenant-landlord communication.",
    sequenceMarkers: [
      { pa: "ਪਹਿਲਾਂ", romanization: "pahilan", en: "before", vi: "trước đây" },
      { pa: "ਮੁਰੰਮਤ ਤੋਂ ਬਾਅਦ", romanization: "murammat ton baad", en: "after the repair", vi: "sau khi sửa" },
      { pa: "ਹੁਣ", romanization: "hun", en: "now", vi: "bây giờ" },
    ],
    modelNarrative: [
      { pa: "ਪਹਿਲਾਂ ਕਮਰੇ ਵਿੱਚ ਹੀਟ ਨਹੀਂ ਆ ਰਹੀ ਸੀ।", romanization: "pahilan kamre vich heat nahin aa rahi si.", en: "Before, heat was not coming into the room.", vi: "Trước đây phòng không có hơi ấm/sưởi." },
      { pa: "ਮੁਰੰਮਤ ਤੋਂ ਬਾਅਦ ਹੀਟਰ ਚੱਲਣਾ ਸ਼ੁਰੂ ਹੋ ਗਿਆ।", romanization: "murammat ton baad heater challna shuru ho gia.", en: "After the repair, the heater started working.", vi: "Sau khi sửa, máy sưởi bắt đầu hoạt động." },
      { pa: "ਹੁਣ ਕਮਰਾ ਪਹਿਲਾਂ ਨਾਲੋਂ ਜ਼ਿਆਦਾ ਗਰਮ ਹੈ।", romanization: "hun kamra pahilan nalon zyada garam hai.", en: "Now the room is warmer than before.", vi: "Bây giờ phòng ấm hơn trước." },
    ],
    expansionPrompt_en: "Add whether you still need one more repair.",
    expansionPrompt_vi: "Thêm liệu bạn vẫn cần thêm một lần sửa nữa không.",
    commonTraps: [
      {
        trap_en: "Using only ਗਰਮ without saying what changed.",
        trap_vi: "Chỉ dùng ਗਰਮ mà không nói điều gì đã thay đổi.",
        repair: { pa: "ਹੁਣ ਪਹਿਲਾਂ ਨਾਲੋਂ ਗਰਮ ਹੈ।", romanization: "hun pahilan nalon garam hai.", en: "Now it is warmer than before.", vi: "Bây giờ ấm hơn trước." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-11-retell-phone-call",
    level: "B1",
    focus: "retell_events",
    title_en: "Retell an important phone call",
    title_vi: "Kể lại một cuộc gọi quan trọng",
    context_en: "You explain what a receptionist told you by phone.",
    context_vi: "Bạn giải thích lễ tân đã nói gì qua điện thoại.",
    narrativeGoal_en: "Retell the caller, the message, and the action you must take.",
    narrativeGoal_vi: "Kể lại người gọi, thông điệp và hành động bạn phải làm.",
    canadaContext: "Useful for appointment, school, job, and service calls.",
    sequenceMarkers: [
      { pa: "ਫ਼ੋਨ ਤੇ", romanization: "phone te", en: "on the phone", vi: "qua điện thoại" },
      { pa: "ਉਸ ਨੇ ਕਿਹਾ", romanization: "us ne keha", en: "they said", vi: "người đó nói" },
      { pa: "ਮੈਨੂੰ ਕਰਨਾ ਹੈ", romanization: "mainu karna hai", en: "I have to do", vi: "tôi phải làm" },
    ],
    modelNarrative: [
      { pa: "ਫ਼ੋਨ ਤੇ ਰਿਸੈਪਸ਼ਨ ਨੇ ਮੈਨੂੰ ਕਾਲ ਕੀਤੀ।", romanization: "phone te reception ne mainu call kiti.", en: "Reception called me on the phone.", vi: "Lễ tân gọi cho tôi qua điện thoại." },
      { pa: "ਉਸ ਨੇ ਕਿਹਾ ਕਿ ਅਪਾਇੰਟਮੈਂਟ ਦਸ ਵਜੇ ਦੀ ਬਜਾਏ ਗਿਆਰਾਂ ਵਜੇ ਹੈ।", romanization: "us ne keha ki appointment dass vaje di bajaye giaran vaje hai.", en: "They said the appointment is at eleven instead of ten.", vi: "Người đó nói lịch hẹn là mười một giờ thay vì mười giờ." },
      { pa: "ਮੈਨੂੰ ਨਵਾਂ ਸਮਾਂ ਕੈਲੰਡਰ ਵਿੱਚ ਲਿਖਣਾ ਹੈ।", romanization: "mainu nava sama calendar vich likhna hai.", en: "I have to write the new time in my calendar.", vi: "Tôi phải ghi giờ mới vào lịch." },
    ],
    expansionPrompt_en: "Add one sentence confirming the address or room number.",
    expansionPrompt_vi: "Thêm một câu xác nhận địa chỉ hoặc số phòng.",
    commonTraps: [
      {
        trap_en: "Confusing ਦੀ ਬਜਾਏ with ਬਾਅਦ; it means instead of, not after.",
        trap_vi: "Nhầm ਦੀ ਬਜਾਏ với ਬਾਅਦ; nó nghĩa là thay vì, không phải sau đó.",
        repair: { pa: "ਦਸ ਵਜੇ ਦੀ ਬਜਾਏ ਗਿਆਰਾਂ ਵਜੇ।", romanization: "dass vaje di bajaye giaran vaje.", en: "At eleven instead of ten.", vi: "Lúc mười một giờ thay vì mười giờ." },
      },
    ],
  },
  {
    id: "pa-b1-narrative-12-explain-sequence-bank",
    level: "B1",
    focus: "explain_sequence",
    title_en: "Explain steps at a bank",
    title_vi: "Giải thích các bước ở ngân hàng",
    context_en: "You explain how you opened or updated an account.",
    context_vi: "Bạn giải thích cách bạn mở hoặc cập nhật tài khoản.",
    narrativeGoal_en: "Explain the steps and documents in a simple sequence.",
    narrativeGoal_vi: "Giải thích các bước và giấy tờ theo trình tự đơn giản.",
    canadaContext: "Useful for bank-account, debit-card, or direct-deposit conversations.",
    sequenceMarkers: [
      { pa: "ਪਹਿਲਾਂ", romanization: "pahilan", en: "first", vi: "trước tiên" },
      { pa: "ਫਿਰ", romanization: "phir", en: "then", vi: "sau đó" },
      { pa: "ਆਖ਼ਰ ਵਿੱਚ", romanization: "akhar vich", en: "finally", vi: "cuối cùng" },
    ],
    modelNarrative: [
      { pa: "ਪਹਿਲਾਂ ਮੈਂ ਆਪਣਾ ਆਈਡੀ ਦਿਖਾਇਆ।", romanization: "pahilan main apna ID dikhaya.", en: "First, I showed my ID.", vi: "Trước tiên, tôi trình ID." },
      { pa: "ਫਿਰ ਕਰਮਚਾਰੀ ਨੇ ਮੇਰਾ ਪਤਾ ਚੈੱਕ ਕੀਤਾ।", romanization: "phir karamchari ne mera pata check kita.", en: "Then the employee checked my address.", vi: "Sau đó nhân viên kiểm tra địa chỉ của tôi." },
      { pa: "ਆਖ਼ਰ ਵਿੱਚ ਮੈਨੂੰ ਨਵਾਂ ਕਾਰਡ ਮਿਲਿਆ।", romanization: "akhar vich mainu nava card milia.", en: "Finally, I received a new card.", vi: "Cuối cùng, tôi nhận thẻ mới." },
    ],
    expansionPrompt_en: "Add one sentence about asking for written fees.",
    expansionPrompt_vi: "Thêm một câu về việc hỏi phí bằng văn bản.",
    commonTraps: [
      {
        trap_en: "Using ਪਤਾ as 'I know' when the context needs address.",
        trap_vi: "Dùng ਪਤਾ theo nghĩa 'biết' khi ngữ cảnh cần địa chỉ.",
        repair: { pa: "ਮੇਰਾ ਪਤਾ ਇਸ ਬਿੱਲ ਤੇ ਹੈ।", romanization: "mera pata is bill te hai.", en: "My address is on this bill.", vi: "Địa chỉ của tôi nằm trên hóa đơn này." },
      },
    ],
  },
];
