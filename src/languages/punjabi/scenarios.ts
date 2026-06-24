// src/languages/punjabi/scenarios.ts
//
// Punjabi practical scenario packs for Vietnamese-speaking and English-
// speaking learners. Gurmukhi is primary; romanization is provided as support.
// Shahmukhi is script awareness only, not a full course here.
//
// Native review is deferred.

export type PunjabiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PunjabiScenarioTopic =
  | "market"
  | "restaurant"
  | "taxi_transit"
  | "housing"
  | "hospital"
  | "pharmacy"
  | "police_help"
  | "immigration_public_office"
  | "school"
  | "workplace"
  | "bank"
  | "phone"
  | "complaint"
  | "meeting";

export type PunjabiUtterance = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiScenario = {
  id: string;
  level: PunjabiCefrLevel;
  topic: PunjabiScenarioTopic;
  title_en: string;
  title_vi: string;
  situation_en: string;
  situation_vi: string;
  goal_en: string;
  goal_vi: string;
  phrases: PunjabiUtterance[];
  modelResponse: PunjabiUtterance;
  escalationPhrase: PunjabiUtterance;
  note_en: string;
  note_vi: string;
};

const topicPhrases: Record<PunjabiScenarioTopic, PunjabiUtterance[]> = {
  market: [
    { pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "eh kinne da hai?", en: "How much is this?", vi: "Cái này bao nhiêu tiền?" },
    { pa: "ਥੋੜ੍ਹਾ ਘੱਟ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "thora ghatt kar sakde ho?", en: "Can you reduce it a little?", vi: "Bạn có thể bớt một chút không?" },
  ],
  restaurant: [
    { pa: "ਮੈਨੂੰ ਇਹ ਡਿਸ਼ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu eh dish chahidi hai.", en: "I would like this dish.", vi: "Tôi muốn món này." },
    { pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਿਰਚ ਘੱਟ ਰੱਖੋ।", romanization: "kirpa karke mirch ghatt rakho.", en: "Please keep the chili low.", vi: "Vui lòng cho ít ớt." },
  ],
  taxi_transit: [
    { pa: "ਮੈਨੂੰ ਇਸ ਪਤੇ ਤੇ ਜਾਣਾ ਹੈ।", romanization: "mainu is pate te jana hai.", en: "I need to go to this address.", vi: "Tôi cần đến địa chỉ này." },
    { pa: "ਮੀਟਰ ਚਲਾ ਦਿਓ ਜੀ।", romanization: "meter chala dio ji.", en: "Please turn on the meter.", vi: "Vui lòng bật đồng hồ tính tiền." },
  ],
  housing: [
    { pa: "ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "bathroom vich paani leak ho riha hai.", en: "Water is leaking in the bathroom.", vi: "Nước đang rò trong phòng tắm." },
    { pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਕਿਸੇ ਨੂੰ ਭੇਜੋ।", romanization: "kirpa karke murammat lai kise nu bhejo.", en: "Please send someone for the repair.", vi: "Vui lòng gửi người đến sửa." },
  ],
  hospital: [
    { pa: "ਮੈਨੂੰ ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਹੈ।", romanization: "mainu chhati vich dard hai.", en: "I have chest pain.", vi: "Tôi bị đau ngực." },
    { pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ।", romanization: "mainu doctor naal gall karni hai.", en: "I need to speak with a doctor.", vi: "Tôi cần nói chuyện với bác sĩ." },
  ],
  pharmacy: [
    { pa: "ਮੈਨੂੰ ਖੰਘ ਲਈ ਦਵਾਈ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu khangh lai davai chahidi hai.", en: "I need medicine for a cough.", vi: "Tôi cần thuốc trị ho." },
    { pa: "ਇਹ ਦਵਾਈ ਕਿਵੇਂ ਲੈਣੀ ਹੈ?", romanization: "eh davai kiven laini hai?", en: "How should I take this medicine?", vi: "Tôi nên dùng thuốc này như thế nào?" },
  ],
  police_help: [
    { pa: "ਮੇਰਾ ਬਟੂਆ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ।", romanization: "mera batua gumm ho gia hai.", en: "My wallet has gone missing.", vi: "Ví của tôi bị mất." },
    { pa: "ਮੈਂ ਰਿਪੋਰਟ ਦਰਜ ਕਰਵਾਉਣੀ ਹੈ।", romanization: "main report daraj karvauni hai.", en: "I need to file a report.", vi: "Tôi cần trình báo/lập biên bản." },
  ],
  immigration_public_office: [
    { pa: "ਮੇਰੇ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "mere form vich madad kar sakde ho?", en: "Can you help with my form?", vi: "Bạn có thể giúp tôi với mẫu đơn không?" },
    { pa: "ਮੇਰੇ ਕੋਲ ਪਾਸਪੋਰਟ ਅਤੇ ਪਤੇ ਦਾ ਸਬੂਤ ਹੈ।", romanization: "mere kol passport ate pate da saboot hai.", en: "I have my passport and proof of address.", vi: "Tôi có hộ chiếu và giấy chứng minh địa chỉ." },
  ],
  school: [
    { pa: "ਮੈਨੂੰ ਅਧਿਆਪਕ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ।", romanization: "mainu adhiapak naal gall karni hai.", en: "I need to speak with the teacher.", vi: "Tôi cần nói chuyện với giáo viên." },
    { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusin eh dubara samjha sakde ho?", en: "Can you explain this again?", vi: "Bạn có thể giải thích lại không?" },
  ],
  workplace: [
    { pa: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਰਿਪੋਰਟ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin mainu report bhej sakde ho?", en: "Can you send me the report?", vi: "Bạn có thể gửi báo cáo cho tôi không?" },
    { pa: "ਮੈਨੂੰ ਹੋਰ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu hor sama chahida hai.", en: "I need more time.", vi: "Tôi cần thêm thời gian." },
  ],
  bank: [
    { pa: "ਮੈਂ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main khata kholhna chahunda han.", en: "I want to open an account.", vi: "Tôi muốn mở tài khoản." },
    { pa: "ਫੀਸ ਕਿੰਨੀ ਹੈ?", romanization: "fees kinni hai?", en: "How much is the fee?", vi: "Phí là bao nhiêu?" },
  ],
  phone: [
    { pa: "ਆਵਾਜ਼ ਸਾਫ਼ ਨਹੀਂ ਆ ਰਹੀ।", romanization: "aawaz saaf nahin aa rahi.", en: "The sound is not clear.", vi: "Âm thanh không rõ." },
    { pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "ki tusin dubara keh sakde ho?", en: "Can you say that again?", vi: "Bạn có thể nói lại không?" },
  ],
  complaint: [
    { pa: "ਮੈਨੂੰ ਇਸ ਸੇਵਾ ਬਾਰੇ ਸ਼ਿਕਾਇਤ ਹੈ।", romanization: "mainu is seva bare shikayat hai.", en: "I have a complaint about this service.", vi: "Tôi có khiếu nại về dịch vụ này." },
    { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੱਲ ਦੱਸੋ।", romanization: "kirpa karke hall dasso.", en: "Please tell me the solution.", vi: "Vui lòng cho tôi biết cách giải quyết." },
  ],
  meeting: [
    { pa: "ਕੀ ਅਸੀਂ ਮੁੱਖ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "ki asin mukh bindu ton shuru kariye?", en: "Shall we start with the main point?", vi: "Chúng ta bắt đầu với điểm chính nhé?" },
    { pa: "ਮੈਂ ਇੱਕ ਹੋਰ ਸੁਝਾਅ ਦੇਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main ikk hor sujhao dena chahunda han.", en: "I would like to give another suggestion.", vi: "Tôi muốn đưa ra một đề xuất khác." },
  ],
};

const topicEscalations: Record<PunjabiScenarioTopic, PunjabiUtterance> = {
  market: { pa: "ਜੇ ਕੀਮਤ ਠੀਕ ਨਹੀਂ, ਮੈਂ ਹੋਰ ਦੁਕਾਨ ਵੇਖ ਲੈਂਦਾ ਹਾਂ।", romanization: "je keemat theek nahin, main hor dukan vekh lainda han.", en: "If the price is not right, I will check another shop.", vi: "Nếu giá không phù hợp, tôi sẽ xem cửa hàng khác." },
  restaurant: { pa: "ਇਹ ਮੇਰਾ ਆਰਡਰ ਨਹੀਂ ਹੈ; ਕਿਰਪਾ ਕਰਕੇ ਚੈੱਕ ਕਰੋ।", romanization: "eh mera order nahin hai; kirpa karke check karo.", en: "This is not my order; please check.", vi: "Đây không phải món tôi gọi; vui lòng kiểm tra." },
  taxi_transit: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਥੇ ਰੋਕ ਦਿਓ।", romanization: "kirpa karke itthe rok dio.", en: "Please stop here.", vi: "Vui lòng dừng ở đây." },
  housing: { pa: "ਜੇ ਅੱਜ ਮੁਰੰਮਤ ਨਹੀਂ ਹੋ ਸਕਦੀ, ਮੈਨੂੰ ਲਿਖਤੀ ਸਮਾਂ ਦਿਓ।", romanization: "je ajj murammat nahin ho sakdi, mainu likhti sama dio.", en: "If it cannot be repaired today, give me a written time.", vi: "Nếu hôm nay không sửa được, hãy cho tôi thời gian bằng văn bản." },
  hospital: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਬੁਲਾਓ।", romanization: "kirpa karke turant doctor nu bulao.", en: "Please call a doctor immediately.", vi: "Vui lòng gọi bác sĩ ngay." },
  pharmacy: { pa: "ਜੇ ਇਹ ਗੰਭੀਰ ਹੈ, ਮੈਂ ਕਲੀਨਿਕ ਜਾਵਾਂਗਾ।", romanization: "je eh gambhir hai, main clinic javanga.", en: "If this is serious, I will go to a clinic.", vi: "Nếu nghiêm trọng, tôi sẽ đến phòng khám." },
  police_help: { pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu dubhashia chahida hai.", en: "I need an interpreter.", vi: "Tôi cần phiên dịch viên." },
  immigration_public_office: { pa: "ਮੈਨੂੰ ਨਿਯਮ ਸਮਝ ਨਹੀਂ ਆਇਆ; ਕਿਰਪਾ ਕਰਕੇ ਲਿਖ ਕੇ ਦਿਓ।", romanization: "mainu niyam samajh nahin aaya; kirpa karke likh ke dio.", en: "I did not understand the rule; please write it down.", vi: "Tôi chưa hiểu quy định; vui lòng viết ra." },
  school: { pa: "ਕੀ ਅਸੀਂ ਮੀਟਿੰਗ ਲਈ ਹੋਰ ਸਮਾਂ ਰੱਖ ਸਕਦੇ ਹਾਂ?", romanization: "ki asin meeting lai hor sama rakh sakde han?", en: "Can we set another time for a meeting?", vi: "Chúng ta có thể hẹn một thời gian khác để họp không?" },
  workplace: { pa: "ਜੇ ਇਹ ਜ਼ਰੂਰੀ ਹੈ, ਮੈਂ ਮੈਨੇਜਰ ਨਾਲ ਗੱਲ ਕਰਾਂਗਾ।", romanization: "je eh zaroori hai, main manager naal gall karanga.", en: "If this is urgent, I will speak with the manager.", vi: "Nếu việc này khẩn cấp, tôi sẽ nói chuyện với quản lý." },
  bank: { pa: "ਮੈਨੂੰ ਲਿਖਤੀ ਸ਼ਰਤਾਂ ਦਿਖਾਓ ਜੀ।", romanization: "mainu likhti shartan dikhao ji.", en: "Please show me the written terms.", vi: "Vui lòng cho tôi xem điều khoản bằng văn bản." },
  phone: { pa: "ਮੈਂ ਕਾਲ ਬੰਦ ਕਰਕੇ ਦੁਬਾਰਾ ਕਰਦਾ ਹਾਂ।", romanization: "main call band karke dubara karda han.", en: "I will hang up and call again.", vi: "Tôi sẽ cúp máy và gọi lại." },
  complaint: { pa: "ਜੇ ਹੱਲ ਨਹੀਂ ਮਿਲਦਾ, ਮੈਂ ਲਿਖਤੀ ਸ਼ਿਕਾਇਤ ਕਰਾਂਗਾ।", romanization: "je hall nahin milda, main likhti shikayat karanga.", en: "If there is no solution, I will make a written complaint.", vi: "Nếu không có cách giải quyết, tôi sẽ khiếu nại bằng văn bản." },
  meeting: { pa: "ਇਹ ਮੁੱਦਾ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ; ਕੀ ਅਸੀਂ ਫ਼ੈਸਲਾ ਰੋਕ ਸਕਦੇ ਹਾਂ?", romanization: "eh mudda aje spasht nahin; ki asin faisla rok sakde han?", en: "This issue is not clear yet; can we pause the decision?", vi: "Vấn đề này chưa rõ; chúng ta có thể tạm hoãn quyết định không?" },
};

const topicNotes: Record<PunjabiScenarioTopic, { en: string; vi: string }> = {
  market: {
    en: "Use ਜੀ for polite tone. Light bargaining can be normal in markets, but fixed-price shops are different.",
    vi: "Dùng ਜੀ để lịch sự. Mặc cả nhẹ có thể bình thường ở chợ, nhưng cửa hàng niêm yết giá thì khác.",
  },
  restaurant: {
    en: "Polite requests with ਕਿਰਪਾ ਕਰਕੇ are safe. State food restrictions clearly before ordering.",
    vi: "Yêu cầu với ਕਿਰਪਾ ਕਰਕੇ là cách an toàn, lịch sự. Nói rõ hạn chế ăn uống trước khi gọi món.",
  },
  taxi_transit: {
    en: "Show the address if pronunciation is hard. Confirm meter or fare before the ride starts.",
    vi: "Đưa địa chỉ nếu khó phát âm. Xác nhận đồng hồ hoặc giá trước khi bắt đầu đi.",
  },
  housing: {
    en: "Keep requests factual and ask for timing in writing when a repair affects safety or daily life.",
    vi: "Trình bày sự việc cụ thể và xin thời gian bằng văn bản khi sửa chữa ảnh hưởng an toàn hoặc sinh hoạt.",
  },
  hospital: {
    en: "Language support only, not medical advice. Use urgent, simple symptom words and ask for qualified help.",
    vi: "Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế. Dùng từ triệu chứng đơn giản, khẩn cấp và yêu cầu người có chuyên môn.",
  },
  pharmacy: {
    en: "Language support only, not medical advice. Confirm dosage, allergies, and when to see a clinician.",
    vi: "Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế. Xác nhận liều dùng, dị ứng và khi nào cần gặp bác sĩ.",
  },
  police_help: {
    en: "Language support only, not legal advice. Ask for an interpreter and written report details.",
    vi: "Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý. Hãy xin phiên dịch và chi tiết biên bản bằng văn bản.",
  },
  immigration_public_office: {
    en: "Language support only, not legal advice. Ask staff to write document requirements and deadlines.",
    vi: "Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý. Nhờ nhân viên ghi yêu cầu giấy tờ và hạn chót.",
  },
  school: {
    en: "ਤੁਸੀਂ is a respectful default with teachers and office staff. Ask for repetition without apologizing too much.",
    vi: "ਤੁਸੀਂ là cách xưng hô lịch sự với giáo viên và nhân viên trường. Có thể xin nhắc lại, không cần xin lỗi quá nhiều.",
  },
  workplace: {
    en: "Use direct but polite requests. Give a reason when asking for more time or changing plans.",
    vi: "Yêu cầu trực tiếp nhưng lịch sự. Nêu lý do khi xin thêm thời gian hoặc đổi kế hoạch.",
  },
  bank: {
    en: "Ask for written terms before agreeing to fees or account conditions.",
    vi: "Hỏi điều khoản bằng văn bản trước khi đồng ý phí hoặc điều kiện tài khoản.",
  },
  phone: {
    en: "Phone Punjabi often uses short clarification phrases. Repeat numbers and times slowly.",
    vi: "Khi gọi điện bằng Punjabi thường dùng câu làm rõ ngắn. Lặp lại số và giờ chậm rãi.",
  },
  complaint: {
    en: "Stay factual: date, problem, evidence, requested fix. Written follow-up is often clearer.",
    vi: "Giữ tính sự việc: ngày, vấn đề, bằng chứng, cách xử lý mong muốn. Theo dõi bằng văn bản thường rõ hơn.",
  },
  meeting: {
    en: "Softening phrases like ਕੀ ਅਸੀਂ... help you disagree or redirect without sounding abrupt.",
    vi: "Cụm làm mềm như ਕੀ ਅਸੀਂ... giúp bạn bất đồng hoặc chuyển hướng mà không quá đột ngột.",
  },
};

type PunjabiScenarioSeed = readonly [
  id: string,
  level: PunjabiCefrLevel,
  topic: PunjabiScenarioTopic,
  title_en: string,
  title_vi: string,
  situation_en: string,
  situation_vi: string,
  goal_en: string,
  goal_vi: string,
  modelResponse: PunjabiUtterance,
];

const rawScenarios: readonly PunjabiScenarioSeed[] = [
  ["a1-market-01", "A1", "market", "Buy fruit", "Mua trái cây", "You are buying apples at a market stall.", "Bạn mua táo ở một sạp chợ.", "Ask the price and buy one kilo.", "Hỏi giá và mua một ký.", { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਸੇਬ ਕਿੰਨੇ ਦੇ ਹਨ? ਮੈਨੂੰ ਇੱਕ ਕਿਲੋ ਦੇ ਦਿਓ।", romanization: "sat sri akal ji, seb kinne de han? mainu ikk kilo de dio.", en: "Hello, how much are the apples? Please give me one kilo.", vi: "Xin chào, táo bao nhiêu? Cho tôi một ký." }],
  ["a1-restaurant-01", "A1", "restaurant", "Order lunch", "Gọi bữa trưa", "You are in a small restaurant.", "Bạn đang ở một quán ăn nhỏ.", "Order one dish and ask for less chili.", "Gọi một món và xin ít ớt.", { pa: "ਮੈਨੂੰ ਦਾਲ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮਿਰਚ ਘੱਟ ਰੱਖੋ।", romanization: "mainu daal chahidi hai. kirpa karke mirch ghatt rakho.", en: "I would like dal. Please keep the chili low.", vi: "Tôi muốn món dal. Vui lòng cho ít ớt." }],
  ["a1-taxi-01", "A1", "taxi_transit", "Give an address", "Đưa địa chỉ", "You get into a taxi.", "Bạn lên taxi.", "Show an address and ask for the meter.", "Đưa địa chỉ và xin bật đồng hồ.", { pa: "ਮੈਨੂੰ ਇਸ ਪਤੇ ਤੇ ਜਾਣਾ ਹੈ। ਮੀਟਰ ਚਲਾ ਦਿਓ ਜੀ।", romanization: "mainu is pate te jana hai. meter chala dio ji.", en: "I need to go to this address. Please turn on the meter.", vi: "Tôi cần đến địa chỉ này. Vui lòng bật đồng hồ." }],
  ["a1-phone-01", "A1", "phone", "Ask to repeat", "Xin nhắc lại", "A caller speaks too fast.", "Người gọi nói quá nhanh.", "Ask them to repeat slowly.", "Xin họ nhắc lại chậm hơn.", { pa: "ਮਾਫ਼ ਕਰਨਾ, ਆਵਾਜ਼ ਸਾਫ਼ ਨਹੀਂ ਆ ਰਹੀ। ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, aawaz saaf nahin aa rahi. ki tusin dubara keh sakde ho?", en: "Sorry, the sound is not clear. Can you say that again?", vi: "Xin lỗi, âm thanh không rõ. Bạn có thể nói lại không?" }],
  ["a1-school-01", "A1", "school", "Ask the teacher", "Hỏi giáo viên", "You do not understand an instruction.", "Bạn không hiểu một hướng dẫn.", "Ask for another explanation.", "Xin giải thích lại.", { pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਕੀ ਤੁਸੀਂ ਇਹ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "maaf karna ji, ki tusin eh dubara samjha sakde ho?", en: "Excuse me, can you explain this again?", vi: "Xin lỗi, bạn/thầy cô có thể giải thích lại không?" }],
  ["a1-bank-01", "A1", "bank", "Ask a fee", "Hỏi phí", "You are at a bank counter.", "Bạn ở quầy ngân hàng.", "Ask about a fee.", "Hỏi về một khoản phí.", { pa: "ਮੈਂ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਫੀਸ ਕਿੰਨੀ ਹੈ?", romanization: "main khata kholhna chahunda han. fees kinni hai?", en: "I want to open an account. How much is the fee?", vi: "Tôi muốn mở tài khoản. Phí là bao nhiêu?" }],
  ["a1-pharmacy-01", "A1", "pharmacy", "Cough medicine", "Thuốc ho", "You have a cough and enter a pharmacy.", "Bạn bị ho và vào hiệu thuốc.", "Ask for medicine and dosage.", "Hỏi thuốc và cách dùng.", { pa: "ਮੈਨੂੰ ਖੰਘ ਲਈ ਦਵਾਈ ਚਾਹੀਦੀ ਹੈ। ਇਹ ਦਵਾਈ ਕਿਵੇਂ ਲੈਣੀ ਹੈ?", romanization: "mainu khangh lai davai chahidi hai. eh davai kiven laini hai?", en: "I need medicine for a cough. How should I take this medicine?", vi: "Tôi cần thuốc trị ho. Tôi nên dùng thuốc này như thế nào?" }],
  ["a2-housing-01", "A2", "housing", "Report a leak", "Báo rò nước", "Water is leaking in your rental bathroom.", "Nước rò trong phòng tắm nhà thuê.", "Report the problem and ask for repair.", "Báo vấn đề và xin sửa.", { pa: "ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਕਿਸੇ ਨੂੰ ਭੇਜੋ।", romanization: "bathroom vich paani leak ho riha hai. kirpa karke murammat lai kise nu bhejo.", en: "Water is leaking in the bathroom. Please send someone for the repair.", vi: "Nước đang rò trong phòng tắm. Vui lòng gửi người đến sửa." }],
  ["a2-hospital-01", "A2", "hospital", "Describe pain", "Mô tả đau", "You are at hospital reception.", "Bạn ở quầy tiếp nhận bệnh viện.", "Say the symptom and ask for a doctor.", "Nói triệu chứng và xin gặp bác sĩ.", { pa: "ਮੈਨੂੰ ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਹੈ। ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ।", romanization: "mainu chhati vich dard hai. mainu doctor naal gall karni hai.", en: "I have chest pain. I need to speak with a doctor.", vi: "Tôi bị đau ngực. Tôi cần nói chuyện với bác sĩ." }],
  ["a2-police-01", "A2", "police_help", "Lost wallet", "Mất ví", "Your wallet is missing.", "Ví của bạn bị mất.", "File a simple police report.", "Trình báo đơn giản với cảnh sát.", { pa: "ਮੇਰਾ ਬਟੂਆ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ। ਮੈਂ ਰਿਪੋਰਟ ਦਰਜ ਕਰਵਾਉਣੀ ਹੈ।", romanization: "mera batua gumm ho gia hai. main report daraj karvauni hai.", en: "My wallet has gone missing. I need to file a report.", vi: "Ví của tôi bị mất. Tôi cần trình báo." }],
  ["a2-office-01", "A2", "immigration_public_office", "Form help", "Nhờ giúp mẫu đơn", "You are at a public office with a form.", "Bạn ở cơ quan công với một mẫu đơn.", "Ask for form help and show documents.", "Nhờ giúp mẫu đơn và đưa giấy tờ.", { pa: "ਮੇਰੇ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ? ਮੇਰੇ ਕੋਲ ਪਾਸਪੋਰਟ ਅਤੇ ਪਤੇ ਦਾ ਸਬੂਤ ਹੈ।", romanization: "mere form vich madad kar sakde ho? mere kol passport ate pate da saboot hai.", en: "Can you help with my form? I have my passport and proof of address.", vi: "Bạn có thể giúp tôi với mẫu đơn không? Tôi có hộ chiếu và chứng minh địa chỉ." }],
  ["a2-workplace-01", "A2", "workplace", "Ask for a report", "Xin báo cáo", "You need a coworker's report.", "Bạn cần báo cáo từ đồng nghiệp.", "Ask politely and mention time.", "Hỏi lịch sự và nêu thời gian.", { pa: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਰਿਪੋਰਟ ਭੇਜ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਅੱਜ ਸ਼ਾਮ ਤੱਕ ਚਾਹੀਦੀ ਹੈ।", romanization: "ki tusin mainu report bhej sakde ho? mainu ajj shaam takk chahidi hai.", en: "Can you send me the report? I need it by this evening.", vi: "Bạn có thể gửi báo cáo cho tôi không? Tôi cần trước tối nay." }],
  ["a2-complaint-01", "A2", "complaint", "Wrong item", "Sai món/hàng", "You received the wrong item.", "Bạn nhận sai món/hàng.", "State the problem and ask for a fix.", "Nêu vấn đề và xin xử lý.", { pa: "ਮੈਨੂੰ ਇਸ ਸੇਵਾ ਬਾਰੇ ਸ਼ਿਕਾਇਤ ਹੈ। ਇਹ ਮੇਰਾ ਆਰਡਰ ਨਹੀਂ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਹੱਲ ਦੱਸੋ।", romanization: "mainu is seva bare shikayat hai. eh mera order nahin hai, kirpa karke hall dasso.", en: "I have a complaint about this service. This is not my order; please tell me the solution.", vi: "Tôi có khiếu nại về dịch vụ này. Đây không phải đơn của tôi; vui lòng cho biết cách xử lý." }],
  ["b1-meeting-01", "B1", "meeting", "Start a meeting", "Bắt đầu cuộc họp", "You need to begin a team meeting.", "Bạn cần bắt đầu cuộc họp nhóm.", "Open with the main point and add a suggestion.", "Mở đầu bằng điểm chính và thêm đề xuất.", { pa: "ਕੀ ਅਸੀਂ ਮੁੱਖ ਬਿੰਦੂ ਤੋਂ ਸ਼ੁਰੂ ਕਰੀਏ? ਮੈਂ ਇੱਕ ਹੋਰ ਸੁਝਾਅ ਦੇਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "ki asin mukh bindu ton shuru kariye? main ikk hor sujhao dena chahunda han.", en: "Shall we start with the main point? I would like to give another suggestion.", vi: "Chúng ta bắt đầu với điểm chính nhé? Tôi muốn đưa ra một đề xuất khác." }],
  ["b1-market-02", "B1", "market", "Compare prices", "So sánh giá", "Two stalls sell the same item.", "Hai sạp bán cùng một món.", "Ask for a better price politely.", "Hỏi giá tốt hơn một cách lịch sự.", { pa: "ਦੂਜੀ ਦੁਕਾਨ ਤੇ ਕੀਮਤ ਘੱਟ ਹੈ। ਕੀ ਤੁਸੀਂ ਥੋੜ੍ਹਾ ਘੱਟ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "duji dukan te keemat ghatt hai. ki tusin thora ghatt kar sakde ho?", en: "The price is lower at the other shop. Can you reduce it a little?", vi: "Cửa hàng kia giá thấp hơn. Bạn có thể bớt một chút không?" }],
  ["b1-restaurant-02", "B1", "restaurant", "Explain allergy", "Giải thích dị ứng", "You need to avoid nuts.", "Bạn cần tránh các loại hạt.", "Ask whether the dish has nuts.", "Hỏi món có hạt không.", { pa: "ਮੈਨੂੰ ਮੂੰਗਫਲੀ ਨਾਲ ਐਲਰਜੀ ਹੈ। ਕੀ ਇਸ ਡਿਸ਼ ਵਿੱਚ ਮੂੰਗਫਲੀ ਹੈ?", romanization: "mainu moongfali naal allergy hai. ki is dish vich moongfali hai?", en: "I am allergic to peanuts. Does this dish have peanuts?", vi: "Tôi dị ứng đậu phộng. Món này có đậu phộng không?" }],
  ["b1-transit-02", "B1", "taxi_transit", "Missed bus", "Lỡ xe buýt", "You missed your bus connection.", "Bạn lỡ chuyến xe buýt nối chuyến.", "Ask for the next route.", "Hỏi tuyến tiếp theo.", { pa: "ਮੇਰੀ ਬੱਸ ਨਿਕਲ ਗਈ ਹੈ। ਅਗਲੀ ਬੱਸ ਕਦੋਂ ਆਵੇਗੀ?", romanization: "meri bass nikal gai hai. agli bass kadon aavegi?", en: "My bus has left. When will the next bus come?", vi: "Xe buýt của tôi đã đi rồi. Khi nào chuyến tiếp theo đến?" }],
  ["b1-housing-02", "B1", "housing", "No heat", "Không có sưởi", "The heat is not working.", "Hệ thống sưởi không hoạt động.", "Report urgency and ask for timing.", "Báo tính khẩn cấp và hỏi thời gian.", { pa: "ਹੀਟ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ ਅਤੇ ਕਮਰਾ ਬਹੁਤ ਠੰਢਾ ਹੈ। ਮੁਰੰਮਤ ਕਦੋਂ ਹੋਵੇਗੀ?", romanization: "heat kamm nahin kar rahi ate kamra bahut thandha hai. murammat kadon hovegi?", en: "The heat is not working and the room is very cold. When will the repair happen?", vi: "Sưởi không hoạt động và phòng rất lạnh. Khi nào sẽ sửa?" }],
  ["b1-hospital-02", "B1", "hospital", "Appointment delay", "Lịch hẹn bị trễ", "Your clinic appointment is delayed.", "Lịch hẹn phòng khám của bạn bị trễ.", "Ask how long and what to do.", "Hỏi trễ bao lâu và cần làm gì.", { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਲੇਟ ਹੈ। ਮੈਨੂੰ ਹੋਰ ਕਿੰਨਾ ਉਡੀਕ ਕਰਨੀ ਪਵੇਗੀ?", romanization: "meri appointment late hai. mainu hor kinna udeek karni pavegi?", en: "My appointment is late. How much longer will I have to wait?", vi: "Lịch hẹn của tôi bị trễ. Tôi phải chờ thêm bao lâu?" }],
  ["b1-pharmacy-02", "B1", "pharmacy", "Check side effects", "Hỏi tác dụng phụ", "You receive medicine at a pharmacy.", "Bạn nhận thuốc ở hiệu thuốc.", "Ask about side effects and dosage.", "Hỏi về tác dụng phụ và liều dùng.", { pa: "ਇਸ ਦਵਾਈ ਦੇ ਕੋਈ ਸਾਈਡ ਇਫੈਕਟ ਹਨ? ਮੈਨੂੰ ਦਿਨ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ ਲੈਣੀ ਹੈ?", romanization: "is davai de koi side effect han? mainu din vich kinni vaar laini hai?", en: "Does this medicine have side effects? How many times a day should I take it?", vi: "Thuốc này có tác dụng phụ không? Tôi nên uống mấy lần mỗi ngày?" }],
  ["b1-police-02", "B1", "police_help", "Ask for interpreter", "Xin phiên dịch", "You need help explaining an incident.", "Bạn cần trợ giúp giải thích một sự việc.", "Ask for an interpreter and report number.", "Xin phiên dịch và số hồ sơ.", { pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਮੈਨੂੰ ਰਿਪੋਰਟ ਨੰਬਰ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "mainu dubhashia chahida hai. ki mainu report number mil sakda hai?", en: "I need an interpreter. Can I get the report number?", vi: "Tôi cần phiên dịch viên. Tôi có thể lấy số biên bản không?" }],
  ["b1-office-02", "B1", "immigration_public_office", "Missing document", "Thiếu giấy tờ", "A clerk says a document is missing.", "Nhân viên nói thiếu giấy tờ.", "Ask what is missing and the deadline.", "Hỏi thiếu gì và hạn chót.", { pa: "ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਘੱਟ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਆਖ਼ਰੀ ਤਾਰੀਖ ਲਿਖ ਦਿਓ।", romanization: "kihra dastavez ghatt hai? kirpa karke akhri tarikh likh dio.", en: "Which document is missing? Please write down the deadline.", vi: "Thiếu giấy tờ nào? Vui lòng viết hạn chót." }],
  ["b1-school-02", "B1", "school", "Parent meeting", "Họp phụ huynh", "You meet a teacher about homework.", "Bạn gặp giáo viên về bài tập.", "Ask what your child should practice.", "Hỏi con nên luyện gì.", { pa: "ਮੇਰਾ ਬੱਚਾ ਘਰ ਵਿੱਚ ਕੀ ਅਭਿਆਸ ਕਰੇ? ਕੀ ਤੁਸੀਂ ਉਦਾਹਰਨ ਦੇ ਸਕਦੇ ਹੋ?", romanization: "mera bacha ghar vich ki abhyas kare? ki tusin udaharan de sakde ho?", en: "What should my child practice at home? Can you give an example?", vi: "Con tôi nên luyện gì ở nhà? Bạn/thầy cô có thể cho ví dụ không?" }],
  ["b1-workplace-02", "B1", "workplace", "Explain delay", "Giải thích chậm trễ", "You cannot finish a task today.", "Bạn không thể hoàn thành việc hôm nay.", "Give a reason and propose a new time.", "Nêu lý do và đề xuất thời gian mới.", { pa: "ਡਾਟਾ ਅਜੇ ਪੂਰਾ ਨਹੀਂ ਆਇਆ, ਇਸ ਕਰਕੇ ਮੈਨੂੰ ਹੋਰ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ। ਮੈਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਭੇਜਾਂਗਾ।", romanization: "data aje pura nahin aaya, is karke mainu hor sama chahida hai. main kallh savere bhejanga.", en: "The data has not fully arrived yet, so I need more time. I will send it tomorrow morning.", vi: "Dữ liệu chưa đến đủ, nên tôi cần thêm thời gian. Tôi sẽ gửi sáng mai." }],
  ["b1-bank-02", "B1", "bank", "Question a charge", "Hỏi về khoản phí", "You see an unexpected bank fee.", "Bạn thấy một khoản phí bất ngờ.", "Ask what the fee is for.", "Hỏi phí này dùng cho gì.", { pa: "ਮੇਰੇ ਖਾਤੇ ਵਿੱਚ ਇਹ ਫੀਸ ਕਿਉਂ ਲੱਗੀ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਸਮਝਾਓ।", romanization: "mere khate vich eh fees kyon laggi hai? kirpa karke samjhao.", en: "Why was this fee charged to my account? Please explain.", vi: "Vì sao tài khoản của tôi bị tính phí này? Vui lòng giải thích." }],
  ["b2-phone-02", "B2", "phone", "Clarify appointment", "Làm rõ lịch hẹn", "You are confirming details on the phone.", "Bạn xác nhận chi tiết qua điện thoại.", "Repeat date, time, and location.", "Lặp lại ngày, giờ và địa điểm.", { pa: "ਮੈਂ ਪੁਸ਼ਟੀ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ: ਅਪਾਇੰਟਮੈਂਟ ਮੰਗਲਵਾਰ ਦਸ ਵਜੇ, ਕਮਰਾ ਪੰਜ ਵਿੱਚ ਹੈ?", romanization: "main pushti karna chahunda han: appointment mangalvaar dass vaje, kamra panj vich hai?", en: "I want to confirm: the appointment is Tuesday at ten, in room five?", vi: "Tôi muốn xác nhận: lịch hẹn là thứ Ba lúc mười giờ, ở phòng năm phải không?" }],
  ["b2-complaint-02", "B2", "complaint", "Service follow-up", "Theo dõi khiếu nại", "A service issue was not fixed.", "Một vấn đề dịch vụ chưa được xử lý.", "Refer to the earlier complaint and request a date.", "Nhắc khiếu nại trước và yêu cầu ngày xử lý.", { pa: "ਮੈਂ ਪਿਛਲੇ ਹਫ਼ਤੇ ਸ਼ਿਕਾਇਤ ਕੀਤੀ ਸੀ, ਪਰ ਹੱਲ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਦੀ ਤਾਰੀਖ ਦੱਸੋ।", romanization: "main pichhle hafte shikayat kiti si, par hall nahin milia. kirpa karke murammat di tarikh dasso.", en: "I complained last week, but there is no solution. Please tell me the repair date.", vi: "Tôi đã khiếu nại tuần trước, nhưng chưa có cách xử lý. Vui lòng cho biết ngày sửa." }],
  ["b2-meeting-02", "B2", "meeting", "Disagree politely", "Bất đồng lịch sự", "You disagree in a meeting.", "Bạn không đồng ý trong cuộc họp.", "Acknowledge the idea and offer another option.", "Ghi nhận ý kiến và đưa lựa chọn khác.", { pa: "ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਦਾ ਹਾਂ, ਪਰ ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ ਦੂਜਾ ਵਿਕਲਪ ਜ਼ਿਆਦਾ ਠੀਕ ਹੈ।", romanization: "main tuhadi gall samajhda han, par mere vichar vich duja vikalp zyada theek hai.", en: "I understand your point, but in my view the second option is better.", vi: "Tôi hiểu ý bạn, nhưng theo tôi lựa chọn thứ hai phù hợp hơn." }],
  ["b2-market-03", "B2", "market", "Return damaged item", "Trả hàng bị lỗi", "A purchased item is damaged.", "Một món đã mua bị lỗi.", "Explain evidence and ask for exchange.", "Nêu bằng chứng và xin đổi.", { pa: "ਮੈਂ ਇਹ ਕੱਲ੍ਹ ਖਰੀਦਿਆ ਸੀ, ਪਰ ਘਰ ਜਾ ਕੇ ਵੇਖਿਆ ਕਿ ਇਹ ਟੁੱਟਿਆ ਹੈ। ਕੀ ਬਦਲ ਸਕਦੇ ਹੋ?", romanization: "main eh kallh kharidia si, par ghar ja ke vekhia ki eh tuttia hai. ki badal sakde ho?", en: "I bought this yesterday, but at home I saw it was broken. Can you exchange it?", vi: "Tôi mua cái này hôm qua, nhưng về nhà thấy bị vỡ. Có thể đổi không?" }],
  ["b2-restaurant-03", "B2", "restaurant", "Group reservation", "Đặt bàn nhóm", "You call a restaurant for a group.", "Bạn gọi nhà hàng cho một nhóm.", "Reserve and mention dietary needs.", "Đặt bàn và nêu nhu cầu ăn uống.", { pa: "ਅਸੀਂ ਛੇ ਲੋਕਾਂ ਲਈ ਮੇਜ਼ ਬੁੱਕ ਕਰਨੀ ਹੈ। ਦੋ ਲੋਕ ਸ਼ਾਕਾਹਾਰੀ ਹਨ।", romanization: "asin chhe lokan lai mez book karni hai. do lok shakahari han.", en: "We need to book a table for six people. Two people are vegetarian.", vi: "Chúng tôi cần đặt bàn cho sáu người. Hai người ăn chay." }],
  ["b2-transit-03", "B2", "taxi_transit", "Dispute fare", "Tranh luận giá xe", "The fare seems higher than agreed.", "Giá xe có vẻ cao hơn đã thỏa thuận.", "Ask for clarification calmly.", "Bình tĩnh hỏi làm rõ.", { pa: "ਸ਼ੁਰੂ ਵਿੱਚ ਕੀਮਤ ਘੱਟ ਦੱਸੀ ਸੀ। ਹੁਣ ਕਿਰਾਇਆ ਵੱਧ ਕਿਉਂ ਹੈ?", romanization: "shuru vich keemat ghatt dassi si. hun kiraya vadh kyon hai?", en: "At the start you said a lower price. Why is the fare higher now?", vi: "Lúc đầu bạn nói giá thấp hơn. Vì sao bây giờ tiền xe cao hơn?" }],
  ["c1-housing-03", "C1", "housing", "Lease terms", "Điều khoản thuê", "You are reviewing a lease renewal.", "Bạn xem lại gia hạn hợp đồng thuê.", "Ask for unclear terms in writing.", "Yêu cầu điều khoản chưa rõ bằng văn bản.", { pa: "ਨਵੀਂ ਲੀਜ਼ ਵਿੱਚ ਜੁਰਮਾਨੇ ਵਾਲੀ ਧਾਰਾ ਸਪਸ਼ਟ ਨਹੀਂ। ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਨੂੰ ਲਿਖਤੀ ਤੌਰ ਤੇ ਸਮਝਾਓ।", romanization: "navi lease vich jurmane wali dhara spasht nahin. kirpa karke is nu likhti taur te samjhao.", en: "The penalty clause in the new lease is not clear. Please explain it in writing.", vi: "Điều khoản phạt trong hợp đồng mới chưa rõ. Vui lòng giải thích bằng văn bản." }],
  ["c1-hospital-03", "C1", "hospital", "Consent question", "Hỏi về đồng thuận", "A clinician explains a procedure.", "Nhân viên y tế giải thích một thủ thuật.", "Ask about risk and alternatives.", "Hỏi rủi ro và lựa chọn thay thế.", { pa: "ਮੈਂ ਫ਼ਾਇਦੇ ਸਮਝ ਲਏ ਹਨ, ਪਰ ਖ਼ਤਰੇ ਅਤੇ ਹੋਰ ਵਿਕਲਪ ਵੀ ਜਾਣਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main faide samajh lae han, par khatre ate hor vikalp vi janana chahunda han.", en: "I understand the benefits, but I also want to know the risks and other options.", vi: "Tôi hiểu lợi ích, nhưng cũng muốn biết rủi ro và lựa chọn khác." }],
  ["c1-pharmacy-03", "C1", "pharmacy", "Medicine interaction", "Tương tác thuốc", "You already take another medicine.", "Bạn đang dùng một thuốc khác.", "Ask whether the medicines can be combined.", "Hỏi có thể dùng chung không.", { pa: "ਮੈਂ ਪਹਿਲਾਂ ਹੀ ਹੋਰ ਦਵਾਈ ਲੈ ਰਿਹਾ ਹਾਂ। ਕੀ ਇਹ ਦੋਵੇਂ ਇਕੱਠੇ ਲੈ ਸਕਦਾ ਹਾਂ?", romanization: "main pahilan hi hor davai lai riha han. ki eh dove ikatthe lai sakda han?", en: "I am already taking another medicine. Can I take both together?", vi: "Tôi đang dùng một thuốc khác. Tôi có thể dùng cả hai cùng nhau không?" }],
  ["c1-police-03", "C1", "police_help", "Witness statement", "Lời khai nhân chứng", "You witnessed an incident.", "Bạn chứng kiến một sự việc.", "Give a careful statement and ask for interpreter support.", "Trình bày cẩn thận và xin hỗ trợ phiên dịch.", { pa: "ਮੈਂ ਘਟਨਾ ਦੇਖੀ ਸੀ, ਪਰ ਸਹੀ ਵੇਰਵਾ ਦੇਣ ਲਈ ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ।", romanization: "main ghatna dekhi si, par sahi verva den lai mainu dubhashia chahida hai.", en: "I saw the incident, but I need an interpreter to give accurate details.", vi: "Tôi đã thấy sự việc, nhưng cần phiên dịch để trình bày chi tiết chính xác." }],
  ["c1-office-03", "C1", "immigration_public_office", "Deadline extension", "Gia hạn hạn chót", "You cannot meet a document deadline.", "Bạn không kịp hạn nộp giấy tờ.", "Ask whether an extension is possible.", "Hỏi có thể gia hạn không.", { pa: "ਦਸਤਾਵੇਜ਼ ਸਮੇਂ ਤੇ ਨਹੀਂ ਆਇਆ। ਕੀ ਮਿਆਦ ਵਧਾਉਣ ਦੀ ਕੋਈ ਪ੍ਰਕਿਰਿਆ ਹੈ?", romanization: "dastavez same te nahin aaya. ki miad vadhaun di koi prakiria hai?", en: "The document did not arrive on time. Is there any process to extend the deadline?", vi: "Giấy tờ không đến kịp. Có quy trình nào để gia hạn không?" }],
  ["c1-school-03", "C1", "school", "Course appeal", "Khiếu nại học phần", "You want to discuss a course grade.", "Bạn muốn trao đổi về điểm môn học.", "Ask for criteria and next steps.", "Hỏi tiêu chí và bước tiếp theo.", { pa: "ਮੈਂ ਗ੍ਰੇਡ ਦੇ ਮਾਪਦੰਡ ਸਮਝਣਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਜੇ ਅਪੀਲ ਕਰਨੀ ਹੋਵੇ, ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "main grade de mapdand samajhna chahunda han. je appeal karni hove, agla kadam ki hai?", en: "I want to understand the grading criteria. If I need to appeal, what is the next step?", vi: "Tôi muốn hiểu tiêu chí chấm điểm. Nếu cần khiếu nại, bước tiếp theo là gì?" }],
  ["c2-workplace-03", "C2", "workplace", "Negotiate scope", "Thương lượng phạm vi", "A project has grown beyond the original plan.", "Dự án vượt quá kế hoạch ban đầu.", "Set boundaries and propose priorities.", "Đặt ranh giới và đề xuất ưu tiên.", { pa: "ਮੌਜੂਦਾ ਸਮੇਂ ਵਿੱਚ ਇਹ ਦਾਇਰਾ ਬਹੁਤ ਵੱਡਾ ਹੈ। ਆਓ ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ ਹਿੱਸੇ ਤੇ ਸਹਿਮਤ ਹੋਈਏ।", romanization: "maujuda same vich eh daira bahut vadda hai. aao pahilan sab ton zaroori hisse te sahimat hoie.", en: "At present this scope is too large. Let us first agree on the most urgent part.", vi: "Hiện tại phạm vi này quá lớn. Trước tiên hãy thống nhất phần cấp thiết nhất." }],
  ["c2-bank-03", "C2", "bank", "Challenge terms", "Chất vấn điều khoản", "You are offered a complex account product.", "Bạn được giới thiệu một sản phẩm tài khoản phức tạp.", "Ask about risk, fees, and written terms.", "Hỏi rủi ro, phí và điều khoản bằng văn bản.", { pa: "ਮੈਂ ਸਾਈਨ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਜੋਖ਼ਮ, ਫੀਸਾਂ ਅਤੇ ਲਿਖਤੀ ਸ਼ਰਤਾਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਮਝਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main sign karan ton pahilan jokham, feesan ate likhti shartan puri tarhan samajhna chahunda han.", en: "Before signing, I want to fully understand the risks, fees, and written terms.", vi: "Trước khi ký, tôi muốn hiểu đầy đủ rủi ro, phí và điều khoản bằng văn bản." }],
  ["c2-phone-03", "C2", "phone", "High-stakes clarification", "Làm rõ việc quan trọng", "You receive important instructions by phone.", "Bạn nhận hướng dẫn quan trọng qua điện thoại.", "Ask for written confirmation.", "Xin xác nhận bằng văn bản.", { pa: "ਇਹ ਜਾਣਕਾਰੀ ਮਹੱਤਵਪੂਰਨ ਹੈ। ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਈਮੇਲ ਰਾਹੀਂ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "eh jaankari mahatvapuran hai. ki tusin mainu email rahin pushti bhej sakde ho?", en: "This information is important. Can you send me confirmation by email?", vi: "Thông tin này quan trọng. Bạn có thể gửi xác nhận qua email cho tôi không?" }],
  ["c2-complaint-03", "C2", "complaint", "Escalate complaint", "Nâng cấp khiếu nại", "A repeated complaint has not been resolved.", "Một khiếu nại lặp lại chưa được giải quyết.", "Escalate while staying factual.", "Nâng cấp khiếu nại nhưng giữ tính sự việc.", { pa: "ਇਹ ਤੀਜੀ ਵਾਰ ਹੈ ਕਿ ਮੈਂ ਇਹੀ ਮੁੱਦਾ ਦਰਜ ਕਰਵਾ ਰਿਹਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਜ਼ਿੰਮੇਵਾਰ ਵਿਭਾਗ ਨਾਲ ਜੋੜੋ।", romanization: "eh tiji vaar hai ki main ehi mudda daraj karva riha han. kirpa karke mainu zimmedar vibhag naal joro.", en: "This is the third time I am registering the same issue. Please connect me with the responsible department.", vi: "Đây là lần thứ ba tôi ghi nhận cùng vấn đề này. Vui lòng nối tôi với bộ phận chịu trách nhiệm." }],
  ["c2-meeting-03", "C2", "meeting", "Defer decision", "Hoãn quyết định", "The meeting lacks enough evidence.", "Cuộc họp chưa có đủ bằng chứng.", "Recommend deferring the decision.", "Đề nghị hoãn quyết định.", { pa: "ਸਬੂਤ ਅਜੇ ਅਧੂਰੇ ਹਨ, ਇਸ ਲਈ ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਫ਼ੈਸਲਾ ਅਗਲੀ ਮੀਟਿੰਗ ਤੱਕ ਰੋਕਿਆ ਜਾਵੇ।", romanization: "saboot aje adhure han, is lai meri sifarash hai ki faisla agli meeting takk rokia jave.", en: "The evidence is still incomplete, so my recommendation is that the decision be paused until the next meeting.", vi: "Bằng chứng vẫn chưa đầy đủ, nên tôi đề nghị hoãn quyết định đến cuộc họp sau." }],
  ["c2-restaurant-04", "C2", "restaurant", "Formal event menu", "Thực đơn sự kiện trang trọng", "You are arranging food for a formal event.", "Bạn sắp xếp đồ ăn cho sự kiện trang trọng.", "Confirm menu, restrictions, and timing.", "Xác nhận thực đơn, hạn chế ăn uống và thời gian.", { pa: "ਸਾਡੇ ਮਹਿਮਾਨਾਂ ਵਿੱਚ ਸ਼ਾਕਾਹਾਰੀ ਅਤੇ ਐਲਰਜੀ ਵਾਲੇ ਲੋਕ ਹਨ, ਇਸ ਲਈ ਮੈਨੂ ਅਤੇ ਸਮਾਂ ਲਿਖਤੀ ਤੌਰ ਤੇ ਪੁਸ਼ਟੀ ਕਰੋ।", romanization: "sade mehmanan vich shakahari ate allergy wale lok han, is lai menu ate sama likhti taur te pushti karo.", en: "Among our guests are vegetarians and people with allergies, so confirm the menu and timing in writing.", vi: "Trong khách mời có người ăn chay và người dị ứng, nên hãy xác nhận thực đơn và thời gian bằng văn bản." }],
] as const;

const scenarios = rawScenarios.map(
  ([
    id,
    level,
    topic,
    title_en,
    title_vi,
    situation_en,
    situation_vi,
    goal_en,
    goal_vi,
    modelResponse,
  ]) => ({
    id: `pa-scn-${id}`,
    level,
    topic,
    title_en,
    title_vi,
    situation_en,
    situation_vi,
    goal_en,
    goal_vi,
    modelResponse,
  }),
);

export const punjabiScenarios: PunjabiScenario[] = scenarios.map((scenario) => ({
  ...scenario,
  phrases: topicPhrases[scenario.topic],
  escalationPhrase: topicEscalations[scenario.topic],
  note_en: topicNotes[scenario.topic].en,
  note_vi: topicNotes[scenario.topic].vi,
}));
