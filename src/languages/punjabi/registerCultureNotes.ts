// Punjabi register & culture notes for safer communication.
//
// Scope/status: study-support notes for learners, not native-certified
// authority. Native review is deferred. These notes describe cautious language
// choices, not fixed traits of any community. Gurmukhi is primary; romanization
// is a reading aid. Shahmukhi is mentioned only for script awareness.

export type PunjabiCefrLevel = "A2" | "B1" | "B2" | "C1" | "C2";

export type PunjabiRegisterTopic =
  | "respect"
  | "elder_younger_address"
  | "honorifics"
  | "indirect_refusal"
  | "softening"
  | "apologies"
  | "requests"
  | "too_direct_phrasing"
  | "family_community_context"
  | "customer_service"
  | "workplace_respect"
  | "script_awareness";

export type PunjabiPhrase = {
  gurmukhi: string;
  romanization?: string;
  vi: string;
  en: string;
};

export type PunjabiRegisterCultureNote = {
  id: string;
  level: PunjabiCefrLevel;
  topic: PunjabiRegisterTopic;
  title_vi: string;
  title_en: string;
  note_vi: string;
  note_en: string;
  avoid?: PunjabiPhrase;
  safer_phrase: PunjabiPhrase;
  tip_vi?: string;
  tip_en?: string;
};

export const REGISTER_CULTURE_DISCLAIMER = {
  vi: "Ghi chú Punjabi này chỉ hỗ trợ học giao tiếp an toàn; không phải thẩm định bản xứ hay quy tắc tuyệt đối về cộng đồng nào. Thẩm định bản xứ được hoãn lại. Gurmukhi là chính; Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "These Punjabi notes are study-support guidance for safer communication, not native-certified authority and not fixed traits or absolute rules about any community. Native review is deferred. Gurmukhi is primary; Shahmukhi is noted only for script awareness.",
} as const;

export const TOPIC_ORDER: PunjabiRegisterTopic[] = [
  "respect",
  "elder_younger_address",
  "honorifics",
  "indirect_refusal",
  "softening",
  "apologies",
  "requests",
  "too_direct_phrasing",
  "family_community_context",
  "customer_service",
  "workplace_respect",
  "script_awareness",
];

type NoteSeed = Omit<PunjabiRegisterCultureNote, "id">;

const seeds: NoteSeed[] = [
  {
    level: "A2",
    topic: "respect",
    title_vi: "Thêm ਜੀ để mềm và kính trọng",
    title_en: "Add ਜੀ for light respect",
    note_vi: "ਜੀ là lựa chọn an toàn khi nói với người chưa thân, khách hàng, giáo viên, hoặc người lớn tuổi.",
    note_en: "ਜੀ is a safe choice with people you do not know well, customers, teachers, or elders.",
    avoid: { gurmukhi: "ਹਾਂ", romanization: "haan", vi: "Ừ/vâng, có thể nghe cụt.", en: "Yes, possibly curt." },
    safer_phrase: { gurmukhi: "ਹਾਂ ਜੀ", romanization: "haan ji", vi: "Vâng ạ.", en: "Yes, respectfully." },
  },
  {
    level: "B1",
    topic: "respect",
    title_vi: "Không biến lịch sự thành xa cách",
    title_en: "Do not make politeness distant",
    note_vi: "Trong nhóm thân, dùng quá nhiều cụm trang trọng có thể tạo khoảng cách; giữ ਜੀ ở điểm nhấn chính là đủ.",
    note_en: "Among close people, too much formality can create distance; one well-placed ਜੀ is often enough.",
    safer_phrase: { gurmukhi: "ਠੀਕ ਹੈ ਜੀ, ਮੈਂ ਵੇਖ ਲੈਂਦਾ/ਲੈਂਦੀ ਹਾਂ।", romanization: "theek hai ji, main vekh lainda/laindi haan.", vi: "Vâng, tôi xem thử.", en: "Okay, I will take a look." },
  },
  {
    level: "B2",
    topic: "respect",
    title_vi: "Tôn trọng bằng cách công nhận ý người khác",
    title_en: "Show respect by acknowledging the other view",
    note_vi: "Trước khi bất đồng, công nhận ý chính giúp câu nghe hợp tác hơn.",
    note_en: "Before disagreeing, acknowledging the main point makes the sentence more collaborative.",
    safer_phrase: { gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਸਮਝ ਆ ਰਹੀ ਹੈ।", romanization: "tuhadi gall samajh aa rahi hai.", vi: "Tôi hiểu ý anh/chị.", en: "I understand your point." },
  },
  {
    level: "C1",
    topic: "respect",
    title_vi: "Tôn trọng không đồng nghĩa luôn đồng ý",
    title_en: "Respect does not mean always agreeing",
    note_vi: "Ở trình độ cao, người học cần nói rõ lập trường mà vẫn giữ thể diện cho người nghe.",
    note_en: "At advanced levels, learners need to state a position while preserving the listener's face.",
    avoid: { gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਠੀਕ ਨਹੀਂ।", romanization: "tuhadi gall theek nahin.", vi: "Ý của anh/chị không đúng. Quá trực tiếp.", en: "Your point is not right. Too direct." },
    safer_phrase: { gurmukhi: "ਆਦਰ ਨਾਲ ਕਹਿਣਾ ਚਾਹਾਂਗਾ/ਚਾਹਾਂਗੀ ਕਿ ਮੇਰੀ ਰਾਏ ਕੁਝ ਵੱਖਰੀ ਹੈ।", romanization: "aadar naal kahina chahanga/chahangi ki meri rai kujh vakhri hai.", vi: "Tôi xin nói với sự tôn trọng rằng ý kiến của tôi hơi khác.", en: "Respectfully, I would say my view is somewhat different." },
  },
  {
    level: "A2",
    topic: "elder_younger_address",
    title_vi: "Dùng ਤੁਸੀਂ khi chưa chắc quan hệ",
    title_en: "Use ਤੁਸੀਂ when the relationship is unclear",
    note_vi: "ਤੂੰ rất thân mật; với người lớn tuổi hoặc chưa thân, ਤੁਸੀਂ an toàn hơn.",
    note_en: "ਤੂੰ is very familiar; with elders or people you do not know well, ਤੁਸੀਂ is safer.",
    avoid: { gurmukhi: "ਤੂੰ ਕਿਵੇਂ ਹੈਂ?", romanization: "tun kiven hain?", vi: "Bạn/mày khỏe không? Rất thân.", en: "How are you? Very familiar." },
    safer_phrase: { gurmukhi: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ ਜੀ?", romanization: "tusin kiven ho ji?", vi: "Anh/chị khỏe không ạ?", en: "How are you, respectfully?" },
  },
  {
    level: "B1",
    topic: "elder_younger_address",
    title_vi: "ਭਰਾ ਜੀ / ਭੈਣ ਜੀ như cách gọi an toàn",
    title_en: "ਭਰਾ ਜੀ / ਭੈਣ ਜੀ as safer address",
    note_vi: "Trong dịch vụ hoặc cộng đồng, ਭਰਾ ਜੀ và ਭੈਣ ਜੀ có thể thân thiện mà vẫn tôn trọng.",
    note_en: "In service or community settings, ਭਰਾ ਜੀ and ਭੈਣ ਜੀ can sound friendly yet respectful.",
    safer_phrase: { gurmukhi: "ਭਰਾ ਜੀ, ਇੱਕ ਮਿੰਟ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "bhra ji, ikk mint madad kar sakde ho?", vi: "Anh ơi, giúp tôi một phút được không?", en: "Brother, could you help for a minute?" },
  },
  {
    level: "B2",
    topic: "elder_younger_address",
    title_vi: "Tránh giả định quan hệ gia đình quá nhanh",
    title_en: "Avoid assuming family-like closeness too quickly",
    note_vi: "Cách gọi thân mật có thể ấm áp, nhưng nếu chưa rõ tuổi/vai, dùng ਨਾਮ + ਜੀ hoặc ਤੁਸੀਂ sẽ an toàn hơn.",
    note_en: "Kinship-style address can be warm, but if age or role is unclear, name + ਜੀ or ਤੁਸੀਂ is safer.",
    safer_phrase: { gurmukhi: "ਅਮਨ ਜੀ, ਤੁਸੀਂ ਇਹ ਵੇਖ ਸਕਦੇ ਹੋ?", romanization: "Aman ji, tusin ih vekh sakde ho?", vi: "Anh/chị Aman, anh/chị xem phần này được không?", en: "Aman ji, could you look at this?" },
  },
  {
    level: "C1",
    topic: "elder_younger_address",
    title_vi: "Điều chỉnh cách xưng hô theo phản hồi",
    title_en: "Adjust address based on feedback",
    note_vi: "Nếu người khác tự giới thiệu cách gọi, hãy dùng cách đó thay vì giữ lựa chọn ban đầu.",
    note_en: "If someone gives a preferred form of address, use that instead of holding to your first choice.",
    safer_phrase: { gurmukhi: "ਤੁਸੀਂ ਦੱਸੋ, ਮੈਂ ਤੁਹਾਨੂੰ ਕਿਵੇਂ ਬੁਲਾਵਾਂ?", romanization: "tusin dasso, main tuhanu kiven bulaavan?", vi: "Anh/chị cho biết tôi nên gọi thế nào?", en: "Please tell me how I should address you." },
  },
  {
    level: "A2",
    topic: "honorifics",
    title_vi: "ਸਾਹਿਬ / ਮੈਡਮ trong dịch vụ",
    title_en: "ਸਾਹਿਬ / ਮੈਡਮ in service settings",
    note_vi: "Trong bối cảnh khách hàng, ਸਾਹਿਬ hoặc ਮੈਡਮ có thể lịch sự, nhưng không cần dùng trong mọi câu.",
    note_en: "In customer-facing contexts, ਸਾਹਿਬ or ਮੈਡਮ can be polite, but not every sentence needs them.",
    safer_phrase: { gurmukhi: "ਸਾਹਿਬ, ਤੁਹਾਡਾ ਬਿੱਲ ਤਿਆਰ ਹੈ।", romanization: "sahib, tuhada bill tiyaar hai.", vi: "Thưa anh/ông, hóa đơn của anh/ông đã sẵn sàng.", en: "Sir, your bill is ready." },
  },
  {
    level: "B1",
    topic: "honorifics",
    title_vi: "ਨਾਮ + ਜੀ là lựa chọn linh hoạt",
    title_en: "Name + ਜੀ is flexible",
    note_vi: "ਨਾਮ + ਜੀ thường tôn trọng mà không quá nặng nề, phù hợp lớp học, công việc, và dịch vụ.",
    note_en: "Name + ਜੀ is often respectful without sounding heavy, useful in class, work, and service.",
    safer_phrase: { gurmukhi: "ਸਿਮਰਨ ਜੀ, ਕੀ ਤੁਸੀਂ ਸਮਾਂ ਦੇ ਸਕਦੇ ਹੋ?", romanization: "Simran ji, ki tusin sama de sakde ho?", vi: "Simran ji, anh/chị có thể dành thời gian không?", en: "Simran ji, could you spare some time?" },
  },
  {
    level: "B2",
    topic: "honorifics",
    title_vi: "Honorific không sửa được câu quá thẳng",
    title_en: "An honorific cannot fix a blunt sentence",
    note_vi: "Thêm ਜੀ vào mệnh lệnh mạnh vẫn có thể nghe gắt; cần đổi cấu trúc câu.",
    note_en: "Adding ਜੀ to a strong command may still sound harsh; the sentence structure should change.",
    avoid: { gurmukhi: "ਹੁਣੇ ਭੇਜੋ ਜੀ।", romanization: "hune bhejo ji.", vi: "Gửi ngay ạ. Vẫn áp lực.", en: "Send it now, please. Still pressuring." },
    safer_phrase: { gurmukhi: "ਹੋ ਸਕੇ ਤਾਂ ਅੱਜ ਭੇਜ ਦਿਓ ਜੀ।", romanization: "ho sake taan ajj bhej dio ji.", vi: "Nếu được thì hôm nay gửi giúp tôi nhé.", en: "If possible, please send it today." },
  },
  {
    level: "C1",
    topic: "honorifics",
    title_vi: "Giữ honorific ổn định trong văn bản",
    title_en: "Keep honorifics consistent in writing",
    note_vi: "Trong email trang trọng, chuyển qua lại giữa thân mật và kính trọng có thể gây khó hiểu.",
    note_en: "In formal email, switching between familiar and respectful address can confuse the tone.",
    safer_phrase: { gurmukhi: "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ ਜੀ।", romanization: "tuhade same lai dhannvaad ji.", vi: "Cảm ơn anh/chị vì thời gian.", en: "Thank you for your time." },
  },
  {
    level: "A2",
    topic: "indirect_refusal",
    title_vi: "ਮੁਸ਼ਕਲ ਹੈ là từ chối mềm",
    title_en: "ਮੁਸ਼ਕਲ ਹੈ is a soft refusal",
    note_vi: "Thay vì không thẳng, ਇਸ ਵਾਰੀ ਮੁਸ਼ਕਲ ਹੈ cho biết hiện tại không thuận lợi.",
    note_en: "Instead of a flat no, ਇਸ ਵਾਰੀ ਮੁਸ਼ਕਲ ਹੈ says the current occasion is difficult.",
    safer_phrase: { gurmukhi: "ਇਸ ਵਾਰੀ ਮੁਸ਼ਕਲ ਹੈ ਜੀ।", romanization: "is vaari mushkal hai ji.", vi: "Lần này hơi khó ạ.", en: "This time is difficult, respectfully." },
  },
  {
    level: "B1",
    topic: "indirect_refusal",
    title_vi: "Để ngỏ tương lai khi từ chối",
    title_en: "Leave the future open when refusing",
    note_vi: "Nếu muốn giữ quan hệ, thêm ਅਗਲੀ ਵਾਰੀ ਵੇਖਦੇ ਹਾਂ sau lời từ chối hiện tại.",
    note_en: "To preserve relationship, add ਅਗਲੀ ਵਾਰੀ ਵੇਖਦੇ ਹਾਂ after the current refusal.",
    safer_phrase: { gurmukhi: "ਅੱਜ ਨਹੀਂ ਹੋ ਸਕੇਗਾ, ਅਗਲੀ ਵਾਰੀ ਵੇਖਦੇ ਹਾਂ।", romanization: "ajj nahin ho sakega, agli vaari vekhde haan.", vi: "Hôm nay không được, lần sau mình xem nhé.", en: "Today will not work; let's see next time." },
  },
  {
    level: "B2",
    topic: "indirect_refusal",
    title_vi: "ਵੇਖਦੇ ਹਾਂ có thể là không",
    title_en: "ਵੇਖਦੇ ਹਾਂ may mean no",
    note_vi: "Trong một số bối cảnh, 'để xem' không phải lời hứa. Người học nên hỏi lại nhẹ nếu cần xác nhận.",
    note_en: "In some contexts, 'we will see' is not a promise. Learners can gently confirm if needed.",
    safer_phrase: { gurmukhi: "ਠੀਕ ਹੈ ਜੀ, ਮੈਂ ਬਾਅਦ ਵਿੱਚ ਪੁੱਛ ਲਵਾਂਗਾ/ਲਵਾਂਗੀ।", romanization: "theek hai ji, main baad vich puchh lavaanga/lavaangi.", vi: "Vâng, tôi sẽ hỏi lại sau.", en: "Okay, I will check again later." },
  },
  {
    level: "C1",
    topic: "indirect_refusal",
    title_vi: "Từ chối với lý do vừa đủ",
    title_en: "Refuse with just enough reason",
    note_vi: "Giải thích quá dài có thể nghe như bào chữa; nói ngắn, rõ, và lịch sự thường tốt hơn.",
    note_en: "Over-explaining can sound defensive; short, clear, polite refusal often works better.",
    safer_phrase: { gurmukhi: "ਇਸ ਸਮੇਂ ਮੈਂ ਵਾਅਦਾ ਨਹੀਂ ਕਰ ਸਕਦਾ/ਸਕਦੀ।", romanization: "is same main vaada nahin kar sakda/sakdi.", vi: "Lúc này tôi chưa thể hứa.", en: "At this time I cannot promise." },
  },
  {
    level: "A2",
    topic: "softening",
    title_vi: "ਜ਼ਰਾ làm yêu cầu bớt nặng",
    title_en: "ਜ਼ਰਾ lightens a request",
    note_vi: "ਜ਼ਰਾ nghĩa là 'một chút', thường làm câu nhờ vả nghe nhẹ hơn.",
    note_en: "ਜ਼ਰਾ means 'a little' and often makes requests sound lighter.",
    safer_phrase: { gurmukhi: "ਜ਼ਰਾ ਸੁਣੋ ਜੀ।", romanization: "zara suno ji.", vi: "Anh/chị nghe tôi một chút nhé.", en: "Please listen for a moment." },
  },
  {
    level: "B1",
    topic: "softening",
    title_vi: "ਹੋ ਸਕੇ ਤਾਂ trao quyền từ chối",
    title_en: "ਹੋ ਸਕੇ ਤਾਂ allows refusal",
    note_vi: "Cụm này giảm áp lực vì người nghe có thể nói không nếu không tiện.",
    note_en: "This phrase lowers pressure because the listener may decline if it is inconvenient.",
    safer_phrase: { gurmukhi: "ਹੋ ਸਕੇ ਤਾਂ ਕੱਲ੍ਹ ਜਵਾਬ ਦੇ ਦਿਓ।", romanization: "ho sake taan kallh javaab de dio.", vi: "Nếu được thì ngày mai trả lời giúp tôi.", en: "If possible, please answer tomorrow." },
  },
  {
    level: "B2",
    topic: "softening",
    title_vi: "ਸ਼ਾਇਦ làm góp ý bớt tuyệt đối",
    title_en: "ਸ਼ਾਇਦ makes feedback less absolute",
    note_vi: "Trong góp ý, ਸ਼ਾਇਦ giúp người nghe không cảm thấy bị phán xét ngay.",
    note_en: "In feedback, ਸ਼ਾਇਦ helps the listener not feel immediately judged.",
    safer_phrase: { gurmukhi: "ਸ਼ਾਇਦ ਇਹ ਵਾਕ ਹੋਰ ਸਪਸ਼ਟ ਹੋ ਸਕੇ।", romanization: "shayad ih vaak hor spasht ho sake.", vi: "Có lẽ câu này có thể rõ hơn.", en: "Perhaps this sentence could be clearer." },
  },
  {
    level: "C1",
    topic: "softening",
    title_vi: "Làm mềm nhưng không mơ hồ",
    title_en: "Soften without becoming vague",
    note_vi: "Ở C1, người học cần vừa lịch sự vừa nói rõ yêu cầu, hạn, hoặc vấn đề.",
    note_en: "At C1, learners need to be polite while still naming the request, deadline, or issue.",
    safer_phrase: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਅੰਤਿਮ ਮਸੌਦਾ ਭੇਜ ਦਿਓ।", romanization: "kirpa karke shukkarvaar takk antim masauda bhej dio.", vi: "Vui lòng gửi bản nháp cuối trước thứ Sáu.", en: "Please send the final draft by Friday." },
  },
  {
    level: "A2",
    topic: "apologies",
    title_vi: "ਮਾਫ਼ ਕਰਨਾ là xin lỗi cơ bản",
    title_en: "ਮਾਫ਼ ਕਰਨਾ is a basic apology",
    note_vi: "Dùng khi va chạm nhẹ, hỏi lại, hoặc mở đầu yêu cầu gây phiền.",
    note_en: "Use it for small mistakes, asking again, or opening a potentially inconvenient request.",
    safer_phrase: { gurmukhi: "ਮਾਫ਼ ਕਰਨਾ ਜੀ।", romanization: "maaf karna ji.", vi: "Xin lỗi ạ.", en: "Sorry / excuse me." },
  },
  {
    level: "B1",
    topic: "apologies",
    title_vi: "Nhận trách nhiệm cụ thể",
    title_en: "Take specific responsibility",
    note_vi: "ਮੇਰੀ ਗਲਤੀ ਸੀ rõ hơn chỉ nói 'xin lỗi', nhất là khi bạn gây nhầm lẫn.",
    note_en: "ਮੇਰੀ ਗਲਤੀ ਸੀ is clearer than only saying sorry, especially when you caused confusion.",
    safer_phrase: { gurmukhi: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰੀ ਗਲਤੀ ਸੀ।", romanization: "maaf karna, meri galti si.", vi: "Xin lỗi, đó là lỗi của tôi.", en: "Sorry, it was my mistake." },
  },
  {
    level: "B2",
    topic: "apologies",
    title_vi: "Xin lỗi kèm sửa sai",
    title_en: "Apologize with repair",
    note_vi: "Trong dịch vụ/công việc, thêm hành động sửa sai làm lời xin lỗi đáng tin hơn.",
    note_en: "In service or work, adding a repair action makes the apology more credible.",
    safer_phrase: { gurmukhi: "ਅਸੁਵਿਧਾ ਲਈ ਮਾਫ਼ ਕਰਨਾ, ਅਸੀਂ ਹੁਣੇ ਠੀਕ ਕਰਦੇ ਹਾਂ।", romanization: "asuvidha lai maaf karna, asin hune theek karde haan.", vi: "Xin lỗi vì bất tiện, chúng tôi sửa ngay.", en: "Sorry for the inconvenience; we will fix it now." },
  },
  {
    level: "C1",
    topic: "apologies",
    title_vi: "Xin lỗi không đổ lỗi cho người nghe",
    title_en: "Apologize without blaming the listener",
    note_vi: "Tránh kiểu 'nếu anh/chị hiểu sai'. Tập trung vào thông điệp hoặc quy trình.",
    note_en: "Avoid 'if you misunderstood'. Focus on the message or process.",
    avoid: { gurmukhi: "ਜੇ ਤੁਸੀਂ ਗਲਤ ਸਮਝੇ ਤਾਂ ਮਾਫ਼ ਕਰਨਾ।", romanization: "je tusin galat samjhe taan maaf karna.", vi: "Nếu anh/chị hiểu sai thì xin lỗi. Dễ đổ lỗi.", en: "Sorry if you misunderstood. Can sound blaming." },
    safer_phrase: { gurmukhi: "ਜੇ ਮੇਰੀ ਗੱਲ ਸਪਸ਼ਟ ਨਹੀਂ ਸੀ ਤਾਂ ਮਾਫ਼ ਕਰਨਾ।", romanization: "je meri gall spasht nahin si taan maaf karna.", vi: "Xin lỗi nếu lời tôi chưa rõ.", en: "Sorry if my point was not clear." },
  },
  {
    level: "A2",
    topic: "requests",
    title_vi: "ਕਿਰਪਾ ਕਰਕੇ cho yêu cầu cơ bản",
    title_en: "ਕਿਰਪਾ ਕਰਕੇ for basic requests",
    note_vi: "ਕਿਰਪਾ ਕਰਕੇ tương đương 'vui lòng', phù hợp tin nhắn và bối cảnh bán trang trọng.",
    note_en: "ਕਿਰਪਾ ਕਰਕੇ means 'please' and fits messages and semi-formal contexts.",
    safer_phrase: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਥੇ ਦਸਤਖ਼ਤ ਕਰੋ।", romanization: "kirpa karke ithe dastkhat karo.", vi: "Vui lòng ký ở đây.", en: "Please sign here." },
  },
  {
    level: "B1",
    topic: "requests",
    title_vi: "Hỏi khả năng thay vì ra lệnh",
    title_en: "Ask ability instead of commanding",
    note_vi: "ਸਕਦੇ ਹੋ chuyển câu thành yêu cầu lịch sự hơn mệnh lệnh trực tiếp.",
    note_en: "ਸਕਦੇ ਹੋ turns the sentence into a more polite request than a direct command.",
    safer_phrase: { gurmukhi: "ਕੀ ਤੁਸੀਂ ਇਹ ਫ਼ਾਈਲ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin ih file bhej sakde ho?", vi: "Anh/chị có thể gửi tệp này không?", en: "Could you send this file?" },
  },
  {
    level: "B2",
    topic: "requests",
    title_vi: "Nêu lý do ngắn cho yêu cầu",
    title_en: "Give a brief reason for a request",
    note_vi: "Một lý do ngắn giúp người nghe hiểu áp lực thời gian mà không bị ép.",
    note_en: "A brief reason helps the listener understand timing pressure without feeling pushed.",
    safer_phrase: { gurmukhi: "ਰਿਪੋਰਟ ਲਈ, ਕੀ ਤੁਸੀਂ ਅੰਕੜੇ ਅੱਜ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "report lai, ki tusin ankde ajj bhej sakde ho?", vi: "Để làm báo cáo, anh/chị gửi số liệu hôm nay được không?", en: "For the report, could you send the figures today?" },
  },
  {
    level: "C1",
    topic: "requests",
    title_vi: "Yêu cầu trang trọng cần rõ trách nhiệm",
    title_en: "Formal requests need clear responsibility",
    note_vi: "Trong văn bản tổ chức, nêu rõ việc cần làm và thời hạn, nhưng giữ giọng lịch sự.",
    note_en: "In organizational writing, name the action and deadline clearly while keeping a polite tone.",
    avoid: { gurmukhi: "ਪੁਸ਼ਟੀ ਹੁਣੇ ਭੇਜੋ।", romanization: "pushti hune bhejo.", vi: "Gửi xác nhận ngay. Nghe ép buộc.", en: "Send confirmation now. Sounds forceful." },
    safer_phrase: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪੁਸ਼ਟੀ ਬੁੱਧਵਾਰ ਤੱਕ ਭੇਜ ਦਿਓ।", romanization: "kirpa karke apni pushti budhvaar takk bhej dio.", vi: "Vui lòng gửi xác nhận trước thứ Tư.", en: "Please send your confirmation by Wednesday." },
  },
  {
    level: "A2",
    topic: "too_direct_phrasing",
    title_vi: "Tránh mệnh lệnh trần",
    title_en: "Avoid bare commands",
    note_vi: "Một động từ mệnh lệnh không đệm có thể nghe như ra lệnh, nhất là với người chưa thân.",
    note_en: "A bare imperative can sound commanding, especially with people you do not know well.",
    avoid: { gurmukhi: "ਬੈਠੋ।", romanization: "baitho.", vi: "Ngồi đi.", en: "Sit." },
    safer_phrase: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਬੈਠੋ ਜੀ।", romanization: "kirpa karke baitho ji.", vi: "Xin mời ngồi ạ.", en: "Please have a seat." },
  },
  {
    level: "B1",
    topic: "too_direct_phrasing",
    title_vi: "Tránh 'bạn sai' quá nhanh",
    title_en: "Avoid 'you are wrong' too quickly",
    note_vi: "Trong góp ý, nói phần chưa rõ thường an toàn hơn đánh giá người nghe.",
    note_en: "In feedback, naming what is unclear is safer than judging the listener.",
    avoid: { gurmukhi: "ਤੁਸੀਂ ਗਲਤ ਹੋ।", romanization: "tusin galat ho.", vi: "Anh/chị sai.", en: "You are wrong." },
    safer_phrase: { gurmukhi: "ਇਹ ਹਿੱਸਾ ਮੈਨੂੰ ਸਪਸ਼ਟ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।", romanization: "ih hissa mainu spasht nahin lagg riha.", vi: "Phần này với tôi chưa rõ.", en: "This part does not seem clear to me." },
  },
  {
    level: "B2",
    topic: "too_direct_phrasing",
    title_vi: "Phê bình ý, không phê bình người",
    title_en: "Critique the idea, not the person",
    note_vi: "Chuyển từ 'anh/chị làm sai' sang 'quy trình này cần xem lại' giúp giảm đối đầu.",
    note_en: "Shifting from 'you did wrong' to 'this process needs review' reduces confrontation.",
    safer_phrase: { gurmukhi: "ਇਸ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖਣ ਦੀ ਲੋੜ ਹੈ।", romanization: "is prakiria nu mur vekhan di lor hai.", vi: "Quy trình này cần được xem lại.", en: "This process needs to be reviewed." },
  },
  {
    level: "C1",
    topic: "too_direct_phrasing",
    title_vi: "Nói rõ hậu quả mà không đe dọa",
    title_en: "State consequences without threatening",
    note_vi: "Trong công việc, nói tác động thực tế tốt hơn dùng ngôn ngữ gây áp lực.",
    note_en: "At work, naming the practical impact is better than pressure language.",
    safer_phrase: { gurmukhi: "ਜੇ ਅੱਜ ਪੁਸ਼ਟੀ ਨਾ ਮਿਲੀ ਤਾਂ ਸਮਾਂ-ਸੂਚੀ ਪ੍ਰਭਾਵਿਤ ਹੋ ਸਕਦੀ ਹੈ।", romanization: "je ajj pushti na mili taan sama-suchi prabhavit ho sakdi hai.", vi: "Nếu hôm nay chưa có xác nhận, lịch trình có thể bị ảnh hưởng.", en: "If confirmation is not received today, the schedule may be affected." },
  },
  {
    level: "A2",
    topic: "family_community_context",
    title_vi: "Gia đình/cộng đồng: hỏi nhẹ trước",
    title_en: "Family/community: ask gently first",
    note_vi: "Trong bối cảnh gia đình hoặc cộng đồng, mở bằng câu hỏi nhẹ thường tốt hơn đi thẳng vào yêu cầu.",
    note_en: "In family or community contexts, opening with a gentle question often works better than jumping into a request.",
    safer_phrase: { gurmukhi: "ਤੁਹਾਡੇ ਕੋਲ ਇੱਕ ਮਿੰਟ ਹੈ ਜੀ?", romanization: "tuhade kol ikk mint hai ji?", vi: "Anh/chị có một phút không ạ?", en: "Do you have a minute?" },
  },
  {
    level: "B1",
    topic: "family_community_context",
    title_vi: "Không giả định mọi gia đình giống nhau",
    title_en: "Do not assume every family works the same way",
    note_vi: "Dùng câu hỏi mở giúp tránh áp đặt vai trò gia đình hoặc cộng đồng.",
    note_en: "Open questions help avoid imposing assumptions about family or community roles.",
    safer_phrase: { gurmukhi: "ਤੁਹਾਡੇ ਘਰ ਵਿੱਚ ਇਹ ਕਿਵੇਂ ਕੀਤਾ ਜਾਂਦਾ ਹੈ?", romanization: "tuhade ghar vich ih kiven kita jaanda hai?", vi: "Ở nhà anh/chị việc này thường làm thế nào?", en: "How is this usually done in your household?" },
  },
  {
    level: "B2",
    topic: "family_community_context",
    title_vi: "Lời mời nên để đường lui",
    title_en: "Invitations should leave an exit",
    note_vi: "Thêm 'nếu tiện' giúp người nghe từ chối mà không mất mặt.",
    note_en: "Adding 'if convenient' lets the listener decline without losing face.",
    safer_phrase: { gurmukhi: "ਜੇ ਤੁਹਾਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ ਤਾਂ ਆ ਜਾਓ ਜੀ।", romanization: "je tuhanu suvidha hove taan aa jao ji.", vi: "Nếu tiện thì anh/chị ghé nhé.", en: "If it is convenient, please come by." },
  },
  {
    level: "C1",
    topic: "family_community_context",
    title_vi: "Khi đại diện nhóm, nói khiêm tốn",
    title_en: "When representing a group, speak modestly",
    note_vi: "Trong ngữ cảnh cộng đồng, dùng ਅਸੀਂ và lời cảm ơn giúp phát biểu ít cá nhân hóa.",
    note_en: "In community settings, using ਅਸੀਂ and gratitude makes the statement less self-centered.",
    safer_phrase: { gurmukhi: "ਅਸੀਂ ਸਭ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ ਕਰਦੇ ਹਾਂ।", romanization: "asin sabh de sahiyog lai dhannvaad karde haan.", vi: "Chúng tôi cảm ơn sự hợp tác của mọi người.", en: "We thank everyone for their cooperation." },
  },
  {
    level: "A2",
    topic: "customer_service",
    title_vi: "Mở đầu bằng ਮਾਫ਼ ਕਰਨਾ trong dịch vụ",
    title_en: "Open with ਮਾਫ਼ ਕਰਨਾ in service encounters",
    note_vi: "Khi cần hỏi nhân viên hoặc khách, ਮਾਫ਼ ਕਰਨਾ ਜੀ là cách mở lời an toàn.",
    note_en: "When asking staff or customers something, ਮਾਫ਼ ਕਰਨਾ ਜੀ is a safe opener.",
    safer_phrase: { gurmukhi: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "maaf karna ji, ih kinne da hai?", vi: "Xin lỗi ạ, cái này bao nhiêu tiền?", en: "Excuse me, how much is this?" },
  },
  {
    level: "B1",
    topic: "customer_service",
    title_vi: "Khi có lỗi hóa đơn, dùng ਸ਼ਾਇਦ",
    title_en: "For bill issues, use ਸ਼ਾਇਦ",
    note_vi: "ਸ਼ਾਇਦ ਗਲਤੀ ਹੈ nêu vấn đề mà không buộc tội nhân viên.",
    note_en: "ਸ਼ਾਇਦ ਗਲਤੀ ਹੈ raises the issue without accusing the staff.",
    safer_phrase: { gurmukhi: "ਇਸ ਬਿੱਲ ਵਿੱਚ ਸ਼ਾਇਦ ਗਲਤੀ ਹੈ ਜੀ।", romanization: "is bill vich shayad galti hai ji.", vi: "Hóa đơn này có lẽ có lỗi ạ.", en: "There may be a mistake in this bill." },
  },
  {
    level: "B2",
    topic: "customer_service",
    title_vi: "Giải thích chậm lại cho khách",
    title_en: "Slow down explanations for customers",
    note_vi: "Trong dịch vụ, nói từng bước giúp câu nghe hỗ trợ hơn là đổ lỗi.",
    note_en: "In service, step-by-step wording sounds more helpful than blaming.",
    safer_phrase: { gurmukhi: "ਮੈਂ ਤੁਹਾਨੂੰ ਕਦਮ-ਦਰ-ਕਦਮ ਸਮਝਾ ਦਿੰਦਾ/ਦਿੰਦੀ ਹਾਂ।", romanization: "main tuhanu kadam-dar-kadam samjha dinda/dindi haan.", vi: "Tôi sẽ giải thích từng bước cho anh/chị.", en: "I will explain it step by step." },
  },
  {
    level: "C1",
    topic: "customer_service",
    title_vi: "Từ chối chính sách mà vẫn giữ thiện chí",
    title_en: "Decline by policy while keeping goodwill",
    note_vi: "Nêu chính sách và đề xuất lựa chọn thay thế giúp câu ít cá nhân hóa.",
    note_en: "Naming policy and offering an alternative makes the refusal less personal.",
    safer_phrase: { gurmukhi: "ਨੀਤੀ ਅਨੁਸਾਰ ਇਹ ਸੰਭਵ ਨਹੀਂ, ਪਰ ਅਸੀਂ ਇਹ ਵਿਕਲਪ ਦੇ ਸਕਦੇ ਹਾਂ।", romanization: "niti anusaar ih sambhav nahin, par asin ih vikalp de sakde haan.", vi: "Theo chính sách việc này không thể, nhưng chúng tôi có thể đưa lựa chọn này.", en: "Under policy this is not possible, but we can offer this option." },
  },
  {
    level: "A2",
    topic: "workplace_respect",
    title_vi: "Trong công việc, dùng ਤੁਸੀਂ mặc định",
    title_en: "At work, default to ਤੁਸੀਂ",
    note_vi: "Cho đến khi quan hệ thân hơn, ਤੁਸੀਂ giúp giữ khoảng cách chuyên nghiệp.",
    note_en: "Until the relationship becomes closer, ਤੁਸੀਂ helps keep professional distance.",
    safer_phrase: { gurmukhi: "ਕੀ ਤੁਸੀਂ ਮੀਟਿੰਗ ਵਿੱਚ ਆ ਸਕਦੇ ਹੋ?", romanization: "ki tusin meeting vich aa sakde ho?", vi: "Anh/chị có thể đến cuộc họp không?", en: "Can you come to the meeting?" },
  },
  {
    level: "B1",
    topic: "workplace_respect",
    title_vi: "Nhắc việc bằng thời hạn rõ",
    title_en: "Remind with a clear deadline",
    note_vi: "Một lời nhắc tốt nêu việc cần làm, thời hạn, và giữ giọng trung tính.",
    note_en: "A good reminder names the action, deadline, and keeps a neutral tone.",
    safer_phrase: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਰਿਪੋਰਟ ਸ਼ਾਮ ਤੱਕ ਭੇਜ ਦਿਓ।", romanization: "kirpa karke report shaam takk bhej dio.", vi: "Vui lòng gửi báo cáo trước buổi tối.", en: "Please send the report by the evening." },
  },
  {
    level: "B2",
    topic: "workplace_respect",
    title_vi: "Bất đồng trong họp",
    title_en: "Disagreeing in a meeting",
    note_vi: "Bắt đầu bằng việc hiểu ý người khác trước khi đưa ý kiến khác.",
    note_en: "Start by showing you understand the other point before giving a different view.",
    safer_phrase: { gurmukhi: "ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਦਾ/ਸਮਝਦੀ ਹਾਂ, ਪਰ ਇੱਕ ਹੋਰ ਪੱਖ ਵੀ ਹੈ।", romanization: "main tuhadi gall samajhda/samajhdi haan, par ikk hor pakkh vi hai.", vi: "Tôi hiểu ý anh/chị, nhưng còn một khía cạnh khác.", en: "I understand your point, but there is another side too." },
  },
  {
    level: "C2",
    topic: "workplace_respect",
    title_vi: "Tóm tắt căng thẳng một cách xây dựng",
    title_en: "Summarize tension constructively",
    note_vi: "Ở C2, kết luận tốt có thể thừa nhận bất đồng nhưng nhấn mạnh bước tiếp theo.",
    note_en: "At C2, a good close can acknowledge disagreement while emphasizing the next step.",
    safer_phrase: { gurmukhi: "ਸਾਡੇ ਵਿਚਾਰ ਵੱਖਰੇ ਹਨ, ਪਰ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰਨਾ ਲਾਭਦਾਇਕ ਰਹੇਗਾ।", romanization: "sade vichaar vakhre han, par agla kadam spasht karna laabhdaik rahega.", vi: "Ý kiến của chúng ta khác nhau, nhưng làm rõ bước tiếp theo sẽ hữu ích.", en: "Our views differ, but clarifying the next step will be useful." },
  },
  {
    level: "A2",
    topic: "script_awareness",
    title_vi: "Gurmukhi là trọng tâm học trong ghi chú này",
    title_en: "Gurmukhi is the learning focus here",
    note_vi: "Người học nên nhận ra rằng Punjabi cũng có thể được viết bằng Shahmukhi, nhưng ghi chú này không dạy Shahmukhi đầy đủ.",
    note_en: "Learners should know Punjabi may also be written in Shahmukhi, but these notes do not teach a full Shahmukhi course.",
    safer_phrase: { gurmukhi: "ਮੈਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹ ਰਿਹਾ/ਰਹੀ ਹਾਂ।", romanization: "main Gurmukhi parh riha/rahi haan.", vi: "Tôi đang học đọc Gurmukhi.", en: "I am learning to read Gurmukhi." },
  },
  {
    level: "B1",
    topic: "script_awareness",
    title_vi: "Hỏi hệ chữ một cách trung tính",
    title_en: "Ask about script neutrally",
    note_vi: "Nếu không chắc văn bản dùng hệ chữ nào, hỏi trung tính thay vì giả định.",
    note_en: "If you are unsure which script a text uses, ask neutrally instead of assuming.",
    safer_phrase: { gurmukhi: "ਇਹ ਲਿਖਤ ਕਿਸ ਲਿਪੀ ਵਿੱਚ ਹੈ?", romanization: "ih likhat kis lipi vich hai?", vi: "Văn bản này viết bằng hệ chữ nào?", en: "Which script is this text in?" },
  },
  {
    level: "B2",
    topic: "script_awareness",
    title_vi: "Không gọi một hệ chữ là 'đúng hơn'",
    title_en: "Do not call one script 'more correct'",
    note_vi: "Với người học, tốt hơn là nói rõ phạm vi học: Gurmukhi chính, Shahmukhi để nhận biết.",
    note_en: "For learners, it is better to state the learning scope: Gurmukhi primary, Shahmukhi for awareness.",
    safer_phrase: { gurmukhi: "ਇਸ ਕੋਰਸ ਵਿੱਚ ਗੁਰਮੁਖੀ ਮੁੱਖ ਹੈ; ਸ਼ਾਹਮੁਖੀ ਬਾਰੇ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਹੈ।", romanization: "is course vich Gurmukhi mukh hai; Shahmukhi bare sirf jaankaari hai.", vi: "Trong khóa này Gurmukhi là chính; Shahmukhi chỉ là thông tin nhận biết.", en: "In this course Gurmukhi is primary; Shahmukhi is awareness only." },
  },
  {
    level: "C1",
    topic: "script_awareness",
    title_vi: "Romanization chỉ là cầu đọc",
    title_en: "Romanization is only a reading bridge",
    note_vi: "Phiên âm giúp người mới đọc, nhưng không thay thế học chữ Gurmukhi.",
    note_en: "Romanization helps early reading, but it does not replace learning Gurmukhi.",
    safer_phrase: { gurmukhi: "ਰੋਮਨ ਲਿਪੀ ਸਹਾਇਤਾ ਹੈ, ਪਰ ਮੁੱਖ ਪਾਠ ਗੁਰਮੁਖੀ ਵਿੱਚ ਹੈ।", romanization: "roman lipi sahaita hai, par mukh paath Gurmukhi vich hai.", vi: "Chữ Roman là hỗ trợ, nhưng bài chính bằng Gurmukhi.", en: "Roman script is support, but the main lesson is in Gurmukhi." },
  },
];

export const notes: PunjabiRegisterCultureNote[] = seeds.map((seed, index) => ({
  id: `pa_register_${String(index + 1).padStart(2, "0")}`,
  ...seed,
}));

export const notesByTopic = (topic: PunjabiRegisterTopic): PunjabiRegisterCultureNote[] =>
  notes.filter((note) => note.topic === topic);
