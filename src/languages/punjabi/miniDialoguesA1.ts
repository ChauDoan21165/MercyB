// Punjabi A1 mini-dialogues for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is practical learner support. Native review is deferred.

export type PunjabiMiniDialogueTopic =
  | "greeting"
  | "name"
  | "family"
  | "food_order"
  | "price"
  | "directions"
  | "asking_for_help"
  | "clinic_reception"
  | "school_office"
  | "workplace_greeting";

export type PunjabiMiniDialogue = {
  id: string;
  topic: PunjabiMiniDialogueTopic;
  title_vi: string;
  title_en: string;
  setting_vi: string;
  setting_en: string;
  lines: {
    speaker: string;
    pa: string;
    romanization: string;
    vi: string;
    en: string;
  }[];
  key_phrase: {
    pa: string;
    romanization: string;
    vi: string;
    en: string;
  };
  practice_prompt_vi: string;
  practice_prompt_en: string;
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
};

export const miniDialogueScriptAwareness =
  "Gurmukhi is primary for these Punjabi A1 mini-dialogues. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1MiniDialogues: PunjabiMiniDialogue[] = [
  {
    id: "pa_a1_dialogue_greeting_001",
    topic: "greeting",
    title_vi: "Chào và hỏi thăm",
    title_en: "Greeting and checking in",
    setting_vi: "Hai người gặp nhau lần đầu trong lớp.",
    setting_en: "Two people meet for the first time in class.",
    lines: [
      { speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
      { speaker: "B", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", romanization: "sat sri akal. tusi kive ho?", vi: "Xin chào. Bạn khỏe không?", en: "Hello. How are you?" },
      { speaker: "A", pa: "ਮੈਂ ਠੀਕ ਹਾਂ। ਧੰਨਵਾਦ।", romanization: "main thik han. dhanvad", vi: "Tôi ổn. Cảm ơn.", en: "I am fine. Thank you." },
    ],
    key_phrase: { pa: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", romanization: "tusi kive ho?", vi: "Bạn khỏe không?", en: "How are you?" },
    practice_prompt_vi: "Đổi vai và trả lời bằng 'ਮੈਂ ਠੀਕ ਹਾਂ।'",
    practice_prompt_en: "Switch roles and answer with 'ਮੈਂ ਠੀਕ ਹਾਂ।'",
    learner_trap: { audience: "en", vi: "Dùng ਤੁਸੀਂ với người mới gặp.", en: "Use polite ਤੁਸੀਂ with new adults." },
  },
  {
    id: "pa_a1_dialogue_name_001",
    topic: "name",
    title_vi: "Hỏi tên",
    title_en: "Asking a name",
    setting_vi: "Giới thiệu tên khi làm quen.",
    setting_en: "Introducing names when meeting.",
    lines: [
      { speaker: "A", pa: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?", romanization: "tuhada nam ki hai?", vi: "Tên bạn là gì?", en: "What is your name?" },
      { speaker: "B", pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।", romanization: "mera nam Lan hai", vi: "Tên tôi là Lan.", en: "My name is Lan." },
      { speaker: "A", pa: "ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਖੁਸ਼ੀ ਹੋਈ।", romanization: "tuhanu mil ke khushi hoi", vi: "Rất vui được gặp bạn.", en: "Nice to meet you." },
    ],
    key_phrase: { pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।", romanization: "mera nam Lan hai", vi: "Tên tôi là Lan.", en: "My name is Lan." },
    practice_prompt_vi: "Thay ਲਾਨ bằng tên của bạn.",
    practice_prompt_en: "Replace ਲਾਨ with your name.",
    learner_trap: { audience: "vi", vi: "Không bỏ ਹੈ ở cuối câu giới thiệu.", en: "Vietnamese speakers may drop ਹੈ; keep it." },
  },
  {
    id: "pa_a1_dialogue_family_001",
    topic: "family",
    title_vi: "Giới thiệu gia đình",
    title_en: "Introducing family",
    setting_vi: "Nói về ảnh gia đình.",
    setting_en: "Talking about a family photo.",
    lines: [
      { speaker: "A", pa: "ਇਹ ਕੌਣ ਹੈ?", romanization: "ih kaun hai?", vi: "Đây là ai?", en: "Who is this?" },
      { speaker: "B", pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।", romanization: "ih meri man hai", vi: "Đây là mẹ tôi.", en: "This is my mother." },
      { speaker: "A", pa: "ਬਹੁਤ ਚੰਗਾ।", romanization: "bahut changa", vi: "Rất tốt / hay quá.", en: "Very nice." },
    ],
    key_phrase: { pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।", romanization: "ih meri man hai", vi: "Đây là mẹ tôi.", en: "This is my mother." },
    practice_prompt_vi: "Thay ਮਾਂ bằng ਭਰਾ hoặc ਭੈਣ.",
    practice_prompt_en: "Replace ਮਾਂ with ਭਰਾ or ਭੈਣ.",
    learner_trap: { audience: "both", vi: "Chú ý ਮੇਰਾ/ਮੇਰੀ theo danh từ.", en: "Watch ਮੇਰਾ/ਮੇਰੀ with the noun." },
  },
  {
    id: "pa_a1_dialogue_food_001",
    topic: "food_order",
    title_vi: "Gọi đồ uống",
    title_en: "Ordering a drink",
    setting_vi: "Gọi món ở quán ăn.",
    setting_en: "Ordering at a cafe or restaurant.",
    lines: [
      { speaker: "A", pa: "ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu chah chahidi hai", vi: "Tôi muốn trà.", en: "I want tea." },
      { speaker: "B", pa: "ਹੋਰ ਕੁਝ?", romanization: "hor kujh?", vi: "Còn gì nữa không?", en: "Anything else?" },
      { speaker: "A", pa: "ਮੈਨੂੰ ਪਾਣੀ ਵੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani vi chahida hai", vi: "Tôi cũng cần nước.", en: "I also need water." },
    ],
    key_phrase: { pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai", vi: "Tôi cần nước.", en: "I need water." },
    practice_prompt_vi: "Thay ਪਾਣੀ bằng ਚਾਹ hoặc ਖਾਣਾ.",
    practice_prompt_en: "Replace ਪਾਣੀ with ਚਾਹ or ਖਾਣਾ.",
    learner_trap: { audience: "en", vi: "ਚਾਹੀਦਾ/ਚਾਹੀਦੀ có thể đổi theo danh từ.", en: "ਚਾਹੀਦਾ/ਚਾਹੀਦੀ can change with the noun." },
    canada_practical: true,
  },
  {
    id: "pa_a1_dialogue_price_001",
    topic: "price",
    title_vi: "Hỏi giá",
    title_en: "Asking the price",
    setting_vi: "Mua một món nhỏ ở cửa hàng.",
    setting_en: "Buying a small item in a shop.",
    lines: [
      { speaker: "A", pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?" },
      { speaker: "B", pa: "ਇਹ ਪੰਜ ਡਾਲਰ ਦਾ ਹੈ।", romanization: "ih panj dollar da hai", vi: "Cái này năm đô la.", en: "It is five dollars." },
      { speaker: "A", pa: "ਠੀਕ ਹੈ। ਧੰਨਵਾਦ।", romanization: "thik hai. dhanvad", vi: "Được. Cảm ơn.", en: "Okay. Thank you." },
    ],
    key_phrase: { pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?" },
    practice_prompt_vi: "Thay ਪੰਜ bằng ਦੋ hoặc ਦਸ.",
    practice_prompt_en: "Replace ਪੰਜ with ਦੋ or ਦਸ.",
    learner_trap: { audience: "both", vi: "ਕਿੰਨੇ ਦਾ hỏi giá; ਕਿੰਨੇ ਵਜੇ hỏi giờ.", en: "ਕਿੰਨੇ ਦਾ asks price; ਕਿੰਨੇ ਵਜੇ asks time." },
    canada_practical: true,
  },
  {
    id: "pa_a1_dialogue_directions_001",
    topic: "directions",
    title_vi: "Hỏi bến xe",
    title_en: "Asking for the bus stop",
    setting_vi: "Hỏi đường trong thành phố Canada.",
    setting_en: "Asking directions in a Canadian city.",
    lines: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?", romanization: "maf karna, bas adda kithe hai?", vi: "Xin lỗi, bến xe ở đâu?", en: "Sorry, where is the bus stop?" },
      { speaker: "B", pa: "ਬੱਸ ਅੱਡਾ ਉੱਥੇ ਹੈ।", romanization: "bas adda utthe hai", vi: "Bến xe ở kia.", en: "The bus stop is there." },
      { speaker: "A", pa: "ਧੰਨਵਾਦ ਜੀ।", romanization: "dhanvad ji", vi: "Cảm ơn ạ.", en: "Thank you, respectfully." },
    ],
    key_phrase: { pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?", romanization: "bas adda kithe hai?", vi: "Bến xe ở đâu?", en: "Where is the bus stop?" },
    practice_prompt_vi: "Thay ਬੱਸ ਅੱਡਾ bằng ਕਲਿਨਿਕ hoặc ਵਾਸ਼ਰੂਮ.",
    practice_prompt_en: "Replace ਬੱਸ ਅੱਡਾ with ਕਲਿਨਿਕ or ਵਾਸ਼ਰੂਮ.",
    learner_trap: { audience: "en", vi: "Không đảo như tiếng Anh 'where is'.", en: "Do not invert like English 'where is'." },
    canada_practical: true,
  },
  {
    id: "pa_a1_dialogue_help_001",
    topic: "asking_for_help",
    title_vi: "Nhờ giúp đỡ",
    title_en: "Asking for help",
    setting_vi: "Ở quầy dịch vụ, người học cần hỗ trợ.",
    setting_en: "At a service counter, the learner needs help.",
    lines: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "maf karna, mainu madad chahidi hai", vi: "Xin lỗi, tôi cần giúp đỡ.", en: "Sorry, I need help." },
      { speaker: "B", pa: "ਹਾਂ ਜੀ, ਦੱਸੋ।", romanization: "han ji, dasso", vi: "Vâng, xin nói.", en: "Yes, please tell me." },
      { speaker: "A", pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ।", romanization: "mainu samajh nahin ai", vi: "Tôi không hiểu.", en: "I did not understand." },
    ],
    key_phrase: { pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu madad chahidi hai", vi: "Tôi cần giúp đỡ.", en: "I need help." },
    practice_prompt_vi: "Tập nói câu này trước khi giải thích vấn đề.",
    practice_prompt_en: "Practice saying this before explaining the problem.",
    learner_trap: { audience: "vi", vi: "Giữ ਮੈਨੂੰ trong mẫu 'tôi cần'.", en: "Keep ਮੈਨੂੰ in this need pattern." },
    canada_practical: true,
  },
  {
    id: "pa_a1_dialogue_clinic_001",
    topic: "clinic_reception",
    title_vi: "Tiếp tân phòng khám",
    title_en: "Clinic reception",
    setting_vi: "Hỏi giờ hẹn ở phòng khám Canada.",
    setting_en: "Asking appointment time at a Canadian clinic.",
    lines: [
      { speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੇਰਾ ਅਪਾਇੰਟਮੈਂਟ ਕਿੰਨੇ ਵਜੇ ਹੈ?", romanization: "sat sri akal. mera appointment kinne vaje hai?", vi: "Xin chào. Lịch hẹn của tôi lúc mấy giờ?", en: "Hello. What time is my appointment?" },
      { speaker: "B", pa: "ਤੁਹਾਡਾ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", romanization: "tuhada appointment do vaje hai", vi: "Lịch hẹn của bạn lúc hai giờ.", en: "Your appointment is at two." },
      { speaker: "A", pa: "ਧੰਨਵਾਦ।", romanization: "dhanvad", vi: "Cảm ơn.", en: "Thank you." },
    ],
    key_phrase: { pa: "ਮੇਰਾ ਅਪਾਇੰਟਮੈਂਟ ਕਿੰਨੇ ਵਜੇ ਹੈ?", romanization: "mera appointment kinne vaje hai?", vi: "Lịch hẹn của tôi lúc mấy giờ?", en: "What time is my appointment?" },
    practice_prompt_vi: "Thay ਦੋ bằng ਤਿੰਨ hoặc ਚਾਰ khi trả lời.",
    practice_prompt_en: "Replace ਦੋ with ਤਿੰਨ or ਚਾਰ when answering.",
    canada_practical: true,
  },
  {
    id: "pa_a1_dialogue_school_001",
    topic: "school_office",
    title_vi: "Văn phòng trường",
    title_en: "School office",
    setting_vi: "Xin mẫu đơn ở trường.",
    setting_en: "Asking for a form at school.",
    lines: [
      { speaker: "A", pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu form chahida hai", vi: "Tôi cần mẫu đơn.", en: "I need a form." },
      { speaker: "B", pa: "ਇਹ ਫਾਰਮ ਲਓ ਜੀ।", romanization: "ih form lao ji", vi: "Mời lấy mẫu đơn này.", en: "Please take this form." },
      { speaker: "A", pa: "ਧੰਨਵਾਦ ਜੀ।", romanization: "dhanvad ji", vi: "Cảm ơn ạ.", en: "Thank you, respectfully." },
    ],
    key_phrase: { pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu form chahida hai", vi: "Tôi cần mẫu đơn.", en: "I need a form." },
    practice_prompt_vi: "Thay ਫਾਰਮ bằng ਜਾਣਕਾਰੀ hoặc ਮਦਦ.",
    practice_prompt_en: "Replace ਫਾਰਮ with ਜਾਣਕਾਰੀ or ਮਦਦ.",
    learner_trap: { audience: "both", vi: "ਜੀ làm lời đưa/nhận lịch sự hơn.", en: "ਜੀ makes the exchange more polite." },
    canada_practical: true,
  },
  {
    id: "pa_a1_dialogue_workplace_001",
    topic: "workplace_greeting",
    title_vi: "Chào ở nơi làm việc",
    title_en: "Workplace greeting",
    setting_vi: "Chào đồng nghiệp vào buổi sáng.",
    setting_en: "Greeting a coworker in the morning.",
    lines: [
      { speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।", romanization: "sat sri akal", vi: "Xin chào.", en: "Hello." },
      { speaker: "B", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਅੱਜ ਕੰਮ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal. ajj kamm kive hai?", vi: "Xin chào. Hôm nay công việc thế nào?", en: "Hello. How is work today?" },
      { speaker: "A", pa: "ਠੀਕ ਹੈ। ਧੰਨਵਾਦ।", romanization: "thik hai. dhanvad", vi: "Ổn. Cảm ơn.", en: "It is okay. Thank you." },
    ],
    key_phrase: { pa: "ਅੱਜ ਕੰਮ ਕਿਵੇਂ ਹੈ?", romanization: "ajj kamm kive hai?", vi: "Hôm nay công việc thế nào?", en: "How is work today?" },
    practice_prompt_vi: "Trả lời ngắn bằng ਠੀਕ ਹੈ.",
    practice_prompt_en: "Answer briefly with ਠੀਕ ਹੈ.",
    canada_practical: true,
  },
];

export default punjabiA1MiniDialogues;
