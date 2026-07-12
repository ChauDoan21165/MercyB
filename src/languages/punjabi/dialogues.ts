// src/languages/punjabi/dialogues.ts
//
// Compact Punjabi dialogue roleplays for Vietnamese- and English-speaking
// learners. Gurmukhi is primary; romanization is a support layer. Shahmukhi is
// noted only for awareness, not taught as a course track.

import type { PunjabiCefrLevel, PunjabiDialogueLine } from "./lessons";

export type PunjabiDialogueTopic =
  | "greetings"
  | "family"
  | "food"
  | "shopping"
  | "transit"
  | "phone"
  | "clinic"
  | "school"
  | "workplace"
  | "public_office";

export type PunjabiUsefulPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiCommonMistake = {
  vi: string;
  en: string;
};

export type PunjabiDialogue = {
  cell_id?: string;
  id: number;
  level: PunjabiCefrLevel;
  topic: PunjabiDialogueTopic;
  title_vi: string;
  title_en: string;
  learner_goal_vi: string;
  learner_goal_en: string;
  lines: PunjabiDialogueLine[];
  useful_phrases: PunjabiUsefulPhrase[];
  common_mistake: PunjabiCommonMistake;
};

export const PUNJABI_DIALOGUE_TOPICS: PunjabiDialogueTopic[] = [
  "greetings",
  "family",
  "food",
  "shopping",
  "transit",
  "phone",
  "clinic",
  "school",
  "workplace",
  "public_office",
];

export const PUNJABI_DIALOGUE_SCRIPT_NOTE = {
  vi: "Khóa hội thoại này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải một nhánh học đầy đủ.",
  en: "This dialogue batch uses Gurmukhi as the primary script. Shahmukhi is mentioned for awareness only, not as a full course track.",
};

export const punjabiDialogues: PunjabiDialogue[] = [
  {
    id: 1,
    level: "A1",
    topic: "greetings",
    title_vi: "Chào lần đầu",
    title_en: "First greeting",
    learner_goal_vi: "Chào lịch sự và tự giới thiệu tên.",
    learner_goal_en: "Greet politely and introduce your name.",
    lines: [
      { speaker: "A", gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
      { speaker: "B", gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੇਰਾ ਨਾਮ ਰਵੀ ਹੈ।", romanization: "sat sri akal. mera naam Ravi hai", vi: "Xin chào. Tôi tên Ravi.", en: "Hello. My name is Ravi." },
    ],
    useful_phrases: [
      { gurmukhi: "ਮੇਰਾ ਨਾਮ ... ਹੈ", romanization: "mera naam ... hai", vi: "Tên tôi là ...", en: "My name is ..." },
      { gurmukhi: "ਜੀ", romanization: "ji", vi: "ạ / từ lịch sự", en: "respect marker" },
    ],
    common_mistake: {
      vi: "Đừng bỏ ਜੀ khi nói với người lớn tuổi hoặc trong tình huống lịch sự.",
      en: "Do not drop ji when speaking politely or to an elder.",
    },
  },
  {
    id: 2,
    level: "A1",
    topic: "greetings",
    title_vi: "Hỏi thăm",
    title_en: "Checking in",
    learner_goal_vi: "Hỏi và trả lời 'bạn khỏe không'.",
    learner_goal_en: "Ask and answer 'how are you'.",
    lines: [
      { speaker: "A", gurmukhi: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", romanization: "tusi kiven ho?", vi: "Bạn khỏe không?", en: "How are you?" },
      { speaker: "B", gurmukhi: "ਮੈਂ ਠੀਕ ਹਾਂ, ਧੰਨਵਾਦ।", romanization: "main thik han, dhannvaad", vi: "Tôi khỏe, cảm ơn.", en: "I am fine, thank you." },
    ],
    useful_phrases: [
      { gurmukhi: "ਕਿਵੇਂ ਹੋ?", romanization: "kiven ho?", vi: "khỏe không?", en: "how are you?" },
      { gurmukhi: "ਠੀਕ ਹਾਂ", romanization: "thik han", vi: "tôi ổn", en: "I am fine" },
    ],
    common_mistake: {
      vi: "ਮੈਂ là 'tôi'; đừng nhầm với ਮੇਰਾ 'của tôi'.",
      en: "Main means 'I'; do not confuse it with mera, 'my'.",
    },
  },
  {
    id: 3,
    level: "A2",
    topic: "greetings",
    title_vi: "Tạm biệt",
    title_en: "Saying goodbye",
    learner_goal_vi: "Kết thúc cuộc trò chuyện thân thiện.",
    learner_goal_en: "Close a conversation warmly.",
    lines: [
      { speaker: "A", gurmukhi: "ਮੈਂ ਹੁਣ ਜਾਂਦਾ ਹਾਂ।", romanization: "main hun janda han", vi: "Bây giờ tôi đi.", en: "I am going now." },
      { speaker: "B", gurmukhi: "ਠੀਕ ਹੈ, ਫਿਰ ਮਿਲਦੇ ਹਾਂ।", romanization: "thik hai, phir milde han", vi: "Được, hẹn gặp lại.", en: "Okay, see you again." },
    ],
    useful_phrases: [
      { gurmukhi: "ਫਿਰ ਮਿਲਦੇ ਹਾਂ", romanization: "phir milde han", vi: "hẹn gặp lại", en: "see you again" },
      { gurmukhi: "ਠੀਕ ਹੈ", romanization: "thik hai", vi: "được / ổn", en: "okay" },
    ],
    common_mistake: {
      vi: "ਜਾਂਦਾ dùng cho người nói nam trong mẫu này; ngữ pháp giới tính cần học dần.",
      en: "Janda is masculine in this model; gender agreement needs gradual study.",
    },
  },
  {
    id: 4,
    level: "A1",
    topic: "family",
    title_vi: "Giới thiệu gia đình",
    title_en: "Introducing family",
    learner_goal_vi: "Nói đây là mẹ hoặc bố của bạn.",
    learner_goal_en: "Say this is your mother or father.",
    lines: [
      { speaker: "A", gurmukhi: "ਇਹ ਮੇਰੀ ਮਾਤਾ ਹੈ।", romanization: "ih meri mata hai", vi: "Đây là mẹ tôi.", en: "This is my mother." },
      { speaker: "B", gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਮਾਤਾ ਜੀ।", romanization: "sat sri akal mata ji", vi: "Xin chào mẹ ạ.", en: "Hello, mother, respectfully." },
    ],
    useful_phrases: [
      { gurmukhi: "ਇਹ ਮੇਰੀ ... ਹੈ", romanization: "ih meri ... hai", vi: "Đây là ... của tôi", en: "This is my ..." },
      { gurmukhi: "ਮਾਤਾ ਜੀ", romanization: "mata ji", vi: "mẹ / thưa mẹ", en: "mother respectfully" },
    ],
    common_mistake: {
      vi: "Dùng ਮੇਰੀ với danh từ giống cái trong mẫu này; đừng dùng ਮੇਰਾ cho ਮਾਤਾ.",
      en: "Use meri with this feminine noun; do not use mera for mata.",
    },
  },
  {
    id: 5,
    level: "A2",
    topic: "family",
    title_vi: "Hỏi về anh chị em",
    title_en: "Asking about siblings",
    learner_goal_vi: "Hỏi ai đó có anh chị em không.",
    learner_goal_en: "Ask whether someone has siblings.",
    lines: [
      { speaker: "A", gurmukhi: "ਕੀ ਤੁਹਾਡੇ ਭਰਾ ਭੈਣ ਹਨ?", romanization: "ki tuhade bhra bhain han?", vi: "Bạn có anh chị em không?", en: "Do you have brothers or sisters?" },
      { speaker: "B", gurmukhi: "ਹਾਂ, ਮੇਰੀ ਇੱਕ ਭੈਣ ਹੈ।", romanization: "han, meri ikk bhain hai", vi: "Có, tôi có một chị/em gái.", en: "Yes, I have one sister." },
    ],
    useful_phrases: [
      { gurmukhi: "ਇੱਕ ਭੈਣ", romanization: "ikk bhain", vi: "một chị/em gái", en: "one sister" },
      { gurmukhi: "ਭਰਾ ਭੈਣ", romanization: "bhra bhain", vi: "anh chị em", en: "siblings" },
    ],
    common_mistake: {
      vi: "ਕੀ ở đầu câu tạo câu hỏi có/không; đừng dịch từng chữ thành 'cái gì'.",
      en: "Ki at the start can mark a yes/no question; do not always translate it as 'what'.",
    },
  },
  {
    id: 6,
    level: "B1",
    topic: "family",
    title_vi: "Mời gia đình đến ăn tối",
    title_en: "Inviting family to dinner",
    learner_goal_vi: "Mời người thân đến nhà vào cuối tuần.",
    learner_goal_en: "Invite relatives over on the weekend.",
    lines: [
      { speaker: "A", gurmukhi: "ਕੀ ਤੁਸੀਂ ਐਤਵਾਰ ਨੂੰ ਸਾਡੇ ਘਰ ਆਓਗੇ?", romanization: "ki tusi aitvaar nu sade ghar aaoge?", vi: "Chủ nhật bạn đến nhà chúng tôi nhé?", en: "Will you come to our home on Sunday?" },
      { speaker: "B", gurmukhi: "ਹਾਂ, ਅਸੀਂ ਖੁਸ਼ੀ ਨਾਲ ਆਵਾਂਗੇ।", romanization: "han, asin khushi nal avange", vi: "Vâng, chúng tôi sẽ vui vẻ đến.", en: "Yes, we will gladly come." },
    ],
    useful_phrases: [
      { gurmukhi: "ਸਾਡੇ ਘਰ", romanization: "sade ghar", vi: "nhà chúng tôi", en: "our home" },
      { gurmukhi: "ਖੁਸ਼ੀ ਨਾਲ", romanization: "khushi nal", vi: "vui lòng / với niềm vui", en: "gladly" },
    ],
    common_mistake: {
      vi: "ਨੂੰ thường đánh dấu thời gian hoặc tân ngữ; đừng bỏ trong ਐਤਵਾਰ ਨੂੰ.",
      en: "Nu often marks time or objects; do not drop it in aitvaar nu.",
    },
  },
  {
    id: 7,
    level: "A1",
    topic: "food",
    title_vi: "Gọi nước",
    title_en: "Ordering water",
    learner_goal_vi: "Gọi một chai nước một cách lịch sự.",
    learner_goal_en: "Order a bottle of water politely.",
    lines: [
      { speaker: "Server", gurmukhi: "ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ?", romanization: "tuhanu ki chahida hai?", vi: "Bạn cần gì?", en: "What do you need?" },
      { speaker: "Customer", gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai", vi: "Tôi cần nước.", en: "I need water." },
    ],
    useful_phrases: [
      { gurmukhi: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ", romanization: "mainu ... chahida hai", vi: "Tôi cần ...", en: "I need ..." },
      { gurmukhi: "ਪਾਣੀ", romanization: "pani", vi: "nước", en: "water" },
    ],
    common_mistake: {
      vi: "ਮੈਨੂੰ là 'cho tôi/tôi cần'; không dùng ਮੈਂ trong mẫu cần đồ.",
      en: "Mainu means 'to me/I need'; do not use main in this need pattern.",
    },
  },
  {
    id: 8,
    level: "A2",
    topic: "food",
    title_vi: "Ăn chay",
    title_en: "Vegetarian food",
    learner_goal_vi: "Hỏi món này có ăn chay được không.",
    learner_goal_en: "Ask whether a dish is vegetarian.",
    lines: [
      { speaker: "Customer", gurmukhi: "ਕੀ ਇਹ ਸਬਜ਼ੀ ਵਾਲਾ ਹੈ?", romanization: "ki ih sabzi vala hai?", vi: "Món này có rau/ăn chay không?", en: "Is this vegetarian?" },
      { speaker: "Server", gurmukhi: "ਹਾਂ, ਇਸ ਵਿੱਚ ਮਾਸ ਨਹੀਂ ਹੈ।", romanization: "han, is vich maas nahin hai", vi: "Có, trong đó không có thịt.", en: "Yes, it has no meat." },
    ],
    useful_phrases: [
      { gurmukhi: "ਮਾਸ ਨਹੀਂ", romanization: "maas nahin", vi: "không thịt", en: "no meat" },
      { gurmukhi: "ਇਸ ਵਿੱਚ", romanization: "is vich", vi: "trong món này", en: "in this" },
    ],
    common_mistake: {
      vi: "ਨਹੀਂ đứng sau danh từ/cụm phủ định; đừng đặt nó như tiếng Việt.",
      en: "Nahin follows the item being negated here; avoid English word order.",
    },
  },
  {
    id: 9,
    level: "B1",
    topic: "food",
    title_vi: "Dị ứng thực phẩm",
    title_en: "Food allergy",
    learner_goal_vi: "Nói bạn bị dị ứng đậu phộng.",
    learner_goal_en: "Say you have a peanut allergy.",
    lines: [
      { speaker: "Customer", gurmukhi: "ਮੈਨੂੰ ਮੂੰਗਫਲੀ ਤੋਂ ਐਲਰਜੀ ਹੈ।", romanization: "mainu mungphali ton allergy hai", vi: "Tôi bị dị ứng đậu phộng.", en: "I am allergic to peanuts." },
      { speaker: "Server", gurmukhi: "ਠੀਕ ਹੈ, ਅਸੀਂ ਧਿਆਨ ਰੱਖਾਂਗੇ।", romanization: "thik hai, asin dhian rakhange", vi: "Được, chúng tôi sẽ chú ý.", en: "Okay, we will take care." },
    ],
    useful_phrases: [
      { gurmukhi: "ਐਲਰਜੀ ਹੈ", romanization: "allergy hai", vi: "bị dị ứng", en: "am allergic" },
      { gurmukhi: "ਧਿਆਨ ਰੱਖਾਂਗੇ", romanization: "dhian rakhange", vi: "sẽ chú ý", en: "will take care" },
    ],
    common_mistake: {
      vi: "ਤੋਂ trong mẫu này giống 'với/đối với' dị ứng; đừng bỏ sau thực phẩm.",
      en: "Ton marks the allergy trigger here; keep it after the food item.",
    },
  },
  {
    id: 10,
    level: "A1",
    topic: "shopping",
    title_vi: "Hỏi giá",
    title_en: "Asking the price",
    learner_goal_vi: "Hỏi món đồ này bao nhiêu tiền.",
    learner_goal_en: "Ask how much an item costs.",
    lines: [
      { speaker: "Customer", gurmukhi: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?" },
      { speaker: "Shopkeeper", gurmukhi: "ਇਹ ਪੰਜਾਹ ਰੁਪਏ ਦਾ ਹੈ।", romanization: "ih panjah rupaye da hai", vi: "Cái này giá năm mươi rupee.", en: "This is fifty rupees." },
    ],
    useful_phrases: [
      { gurmukhi: "ਕਿੰਨੇ ਦਾ?", romanization: "kinne da?", vi: "bao nhiêu tiền?", en: "how much?" },
      { gurmukhi: "ਰੁਪਏ", romanization: "rupaye", vi: "rupee", en: "rupees" },
    ],
    common_mistake: {
      vi: "ਕਿੰਨੇ ਦਾ là mẫu hỏi giá; đừng dùng ਕੀ 'gì' để hỏi giá.",
      en: "Kinne da is the price pattern; do not use ki for price.",
    },
  },
  {
    id: 11,
    level: "A2",
    topic: "shopping",
    title_vi: "Xin túi",
    title_en: "Asking for a bag",
    learner_goal_vi: "Xin một túi khi mua hàng.",
    learner_goal_en: "Ask for a bag while shopping.",
    lines: [
      { speaker: "Customer", gurmukhi: "ਕੀ ਮੈਨੂੰ ਇੱਕ ਥੈਲਾ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki mainu ikk thaila mil sakda hai?", vi: "Cho tôi một cái túi được không?", en: "Can I get a bag?" },
      { speaker: "Shopkeeper", gurmukhi: "ਹਾਂ ਜੀ, ਇਹ ਲਓ।", romanization: "han ji, ih lao", vi: "Vâng, đây ạ.", en: "Yes, here you go." },
    ],
    useful_phrases: [
      { gurmukhi: "ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "mil sakda hai?", vi: "có thể nhận được không?", en: "can I get?" },
      { gurmukhi: "ਇਹ ਲਓ", romanization: "ih lao", vi: "đây, nhận lấy", en: "here you go" },
    ],
    common_mistake: {
      vi: "ਹਾਂ ਜੀ lịch sự hơn ਹਾਂ; dùng được khi trả lời khách.",
      en: "Han ji is more polite than han and fits service situations.",
    },
  },
  {
    id: 12,
    level: "B1",
    topic: "shopping",
    title_vi: "Đổi kích cỡ",
    title_en: "Changing size",
    learner_goal_vi: "Hỏi có kích cỡ lớn hơn không.",
    learner_goal_en: "Ask if a larger size is available.",
    lines: [
      { speaker: "Customer", gurmukhi: "ਕੀ ਇਹ ਵੱਡੇ ਸਾਈਜ਼ ਵਿੱਚ ਹੈ?", romanization: "ki ih vadde size vich hai?", vi: "Cái này có cỡ lớn hơn không?", en: "Is this available in a larger size?" },
      { speaker: "Shopkeeper", gurmukhi: "ਹਾਂ, ਮੈਂ ਲਿਆਉਂਦਾ ਹਾਂ।", romanization: "han, main liaunda han", vi: "Có, tôi mang ra.", en: "Yes, I will bring it." },
    ],
    useful_phrases: [
      { gurmukhi: "ਵੱਡੇ ਸਾਈਜ਼ ਵਿੱਚ", romanization: "vadde size vich", vi: "trong cỡ lớn hơn", en: "in a larger size" },
      { gurmukhi: "ਮੈਂ ਲਿਆਉਂਦਾ ਹਾਂ", romanization: "main liaunda han", vi: "tôi mang ra", en: "I will bring it" },
    ],
    common_mistake: {
      vi: "ਵਿੱਚ nghĩa 'trong'; dùng với kích cỡ, màu, mẫu.",
      en: "Vich means 'in' and works with size, color, and model options.",
    },
  },
  {
    id: 13,
    level: "A1",
    topic: "transit",
    title_vi: "Hỏi trạm xe buýt",
    title_en: "Asking for the bus stop",
    learner_goal_vi: "Hỏi trạm xe buýt ở đâu.",
    learner_goal_en: "Ask where the bus stop is.",
    lines: [
      { speaker: "A", gurmukhi: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?", romanization: "bas adda kithe hai?", vi: "Trạm xe buýt ở đâu?", en: "Where is the bus stop?" },
      { speaker: "B", gurmukhi: "ਉਹ ਅੱਗੇ ਹੈ।", romanization: "oh agge hai", vi: "Nó ở phía trước.", en: "It is ahead." },
    ],
    useful_phrases: [
      { gurmukhi: "ਕਿੱਥੇ ਹੈ?", romanization: "kithe hai?", vi: "ở đâu?", en: "where is it?" },
      { gurmukhi: "ਅੱਗੇ", romanization: "agge", vi: "phía trước", en: "ahead" },
    ],
    common_mistake: {
      vi: "ਕਿੱਥੇ hỏi nơi chốn; ਕੀ hỏi 'gì'.",
      en: "Kithe asks location; ki asks 'what'.",
    },
  },
  {
    id: 14,
    level: "A2",
    topic: "transit",
    title_vi: "Mua vé",
    title_en: "Buying a ticket",
    learner_goal_vi: "Mua một vé đi thành phố.",
    learner_goal_en: "Buy one ticket to the city.",
    lines: [
      { speaker: "A", gurmukhi: "ਮੈਨੂੰ ਸ਼ਹਿਰ ਲਈ ਇੱਕ ਟਿਕਟ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu shehar lai ikk ticket chahidi hai", vi: "Tôi cần một vé đi thành phố.", en: "I need one ticket to the city." },
      { speaker: "B", gurmukhi: "ਠੀਕ ਹੈ, ਪੰਜ ਰੁਪਏ।", romanization: "thik hai, panj rupaye", vi: "Được, năm rupee.", en: "Okay, five rupees." },
    ],
    useful_phrases: [
      { gurmukhi: "ਲਈ", romanization: "lai", vi: "cho / đi đến", en: "for/to" },
      { gurmukhi: "ਇੱਕ ਟਿਕਟ", romanization: "ikk ticket", vi: "một vé", en: "one ticket" },
    ],
    common_mistake: {
      vi: "ਚਾਹੀਦੀ dùng với ਟਿਕਟ trong mẫu này; chú ý giống của danh từ.",
      en: "Chahidi agrees with ticket in this model; watch noun gender.",
    },
  },
  {
    id: 15,
    level: "B1",
    topic: "transit",
    title_vi: "Tàu bị trễ",
    title_en: "Delayed train",
    learner_goal_vi: "Hỏi tàu trễ bao lâu.",
    learner_goal_en: "Ask how long the train is delayed.",
    lines: [
      { speaker: "A", gurmukhi: "ਰੇਲ ਕਿੰਨੀ ਦੇਰ ਨਾਲ ਆਵੇਗੀ?", romanization: "rel kinni der nal avegi?", vi: "Tàu sẽ đến trễ bao lâu?", en: "How late will the train arrive?" },
      { speaker: "B", gurmukhi: "ਲਗਭਗ ਦਸ ਮਿੰਟ ਦੇਰ ਹੈ।", romanization: "lagbhag das mint der hai", vi: "Trễ khoảng mười phút.", en: "It is about ten minutes late." },
    ],
    useful_phrases: [
      { gurmukhi: "ਕਿੰਨੀ ਦੇਰ", romanization: "kinni der", vi: "bao lâu", en: "how long" },
      { gurmukhi: "ਲਗਭਗ", romanization: "lagbhag", vi: "khoảng", en: "about" },
    ],
    common_mistake: {
      vi: "ਦੇਰ là 'trễ/thời gian lâu'; không nhầm với ਦਿਨ 'ngày'.",
      en: "Der means delay/time length; do not confuse it with din, day.",
    },
  },
  {
    id: 16,
    level: "A1",
    topic: "phone",
    title_vi: "A lô",
    title_en: "Answering the phone",
    learner_goal_vi: "Bắt đầu cuộc gọi đơn giản.",
    learner_goal_en: "Start a simple phone call.",
    lines: [
      { speaker: "A", gurmukhi: "ਹੈਲੋ, ਕੀ ਤੁਸੀਂ ਰਵੀ ਹੋ?", romanization: "hello, ki tusi Ravi ho?", vi: "A lô, bạn là Ravi phải không?", en: "Hello, are you Ravi?" },
      { speaker: "B", gurmukhi: "ਹਾਂ ਜੀ, ਮੈਂ ਰਵੀ ਹਾਂ।", romanization: "han ji, main Ravi han", vi: "Vâng, tôi là Ravi.", en: "Yes, I am Ravi." },
    ],
    useful_phrases: [
      { gurmukhi: "ਕੀ ਤੁਸੀਂ ... ਹੋ?", romanization: "ki tusi ... ho?", vi: "bạn có phải là ... không?", en: "are you ...?" },
      { gurmukhi: "ਹਾਂ ਜੀ", romanization: "han ji", vi: "vâng ạ", en: "yes, respectfully" },
    ],
    common_mistake: {
      vi: "ਤੁਸੀਂ lịch sự hơn ਤੂੰ; dùng an toàn khi gọi điện.",
      en: "Tusi is more polite than tu and safer on phone calls.",
    },
  },
  {
    id: 17,
    level: "A2",
    topic: "phone",
    title_vi: "Xin gọi lại",
    title_en: "Asking to call back",
    learner_goal_vi: "Nói bạn sẽ gọi lại sau.",
    learner_goal_en: "Say you will call back later.",
    lines: [
      { speaker: "A", gurmukhi: "ਮੈਂ ਹੁਣ ਬਿਜ਼ੀ ਹਾਂ।", romanization: "main hun busy han", vi: "Bây giờ tôi bận.", en: "I am busy now." },
      { speaker: "B", gurmukhi: "ਠੀਕ ਹੈ, ਬਾਅਦ ਵਿੱਚ ਫੋਨ ਕਰੋ।", romanization: "thik hai, baad vich phone karo", vi: "Được, gọi lại sau nhé.", en: "Okay, call later." },
    ],
    useful_phrases: [
      { gurmukhi: "ਬਾਅਦ ਵਿੱਚ", romanization: "baad vich", vi: "sau đó / lát nữa", en: "later" },
      { gurmukhi: "ਫੋਨ ਕਰੋ", romanization: "phone karo", vi: "hãy gọi điện", en: "call" },
    ],
    common_mistake: {
      vi: "ਕਰੋ là dạng lịch sự của mệnh lệnh; đừng dùng dạng quá thân mật với người lạ.",
      en: "Karo is a polite imperative; avoid overly casual commands with strangers.",
    },
  },
  {
    id: 18,
    level: "B2",
    topic: "phone",
    title_vi: "Để lại lời nhắn",
    title_en: "Leaving a message",
    learner_goal_vi: "Để lại lời nhắn ngắn khi người cần gặp vắng mặt.",
    learner_goal_en: "Leave a short message when someone is unavailable.",
    lines: [
      { speaker: "A", gurmukhi: "ਉਹ ਇਸ ਵੇਲੇ ਦਫ਼ਤਰ ਵਿੱਚ ਨਹੀਂ ਹਨ।", romanization: "oh is vele daftar vich nahin han", vi: "Hiện giờ họ không ở văn phòng.", en: "They are not in the office right now." },
      { speaker: "B", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਕਹਿਣਾ ਕਿ ਮੈਂ ਫੋਨ ਕੀਤਾ ਸੀ।", romanization: "kirpa karke kehna ki main phone kita si", vi: "Làm ơn nói rằng tôi đã gọi.", en: "Please say that I called." },
    ],
    useful_phrases: [
      { gurmukhi: "ਇਸ ਵੇਲੇ", romanization: "is vele", vi: "lúc này", en: "right now" },
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਕਹਿਣਾ", romanization: "kirpa karke kehna", vi: "làm ơn nói lại", en: "please say" },
    ],
    common_mistake: {
      vi: "ਸੀ đánh dấu quá khứ trong ਕੀਤਾ ਸੀ; đừng bỏ khi nói 'đã gọi'.",
      en: "Si marks past time in kita si; keep it when saying 'called'.",
    },
  },
  {
    id: 19,
    level: "A1",
    topic: "clinic",
    title_vi: "Nói bị đau",
    title_en: "Saying something hurts",
    learner_goal_vi: "Nói bạn bị đau đầu.",
    learner_goal_en: "Say you have a headache.",
    lines: [
      { speaker: "Doctor", gurmukhi: "ਤੁਹਾਨੂੰ ਕੀ ਸਮੱਸਿਆ ਹੈ?", romanization: "tuhanu ki samassia hai?", vi: "Bạn có vấn đề gì?", en: "What problem do you have?" },
      { speaker: "Patient", gurmukhi: "ਮੇਰੇ ਸਿਰ ਵਿੱਚ ਦਰਦ ਹੈ।", romanization: "mere sir vich dard hai", vi: "Tôi đau đầu.", en: "I have pain in my head." },
    ],
    useful_phrases: [
      { gurmukhi: "ਦਰਦ ਹੈ", romanization: "dard hai", vi: "bị đau", en: "hurts / has pain" },
      { gurmukhi: "ਸਿਰ", romanization: "sir", vi: "đầu", en: "head" },
    ],
    common_mistake: {
      vi: "Punjabi dùng 'trong đầu có đau' trong mẫu này; đừng dịch từng chữ quá cứng.",
      en: "Punjabi phrases this as 'pain in my head'; do not force English word order.",
    },
  },
  {
    id: 20,
    level: "A2",
    topic: "clinic",
    title_vi: "Đặt lịch khám",
    title_en: "Booking an appointment",
    learner_goal_vi: "Hỏi có lịch hẹn hôm nay không.",
    learner_goal_en: "Ask whether an appointment is available today.",
    lines: [
      { speaker: "Patient", gurmukhi: "ਕੀ ਅੱਜ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki ajj sama mil sakda hai?", vi: "Hôm nay có thể có lịch không?", en: "Can I get a time today?" },
      { speaker: "Reception", gurmukhi: "ਹਾਂ, ਤਿੰਨ ਵਜੇ ਆ ਜਾਓ।", romanization: "han, tinn vaje aa jao", vi: "Có, hãy đến lúc ba giờ.", en: "Yes, come at three o'clock." },
    ],
    useful_phrases: [
      { gurmukhi: "ਅੱਜ", romanization: "ajj", vi: "hôm nay", en: "today" },
      { gurmukhi: "ਤਿੰਨ ਵਜੇ", romanization: "tinn vaje", vi: "lúc ba giờ", en: "at three o'clock" },
    ],
    common_mistake: {
      vi: "ਵਜੇ dùng với giờ; đừng bỏ khi nói thời gian hẹn.",
      en: "Vaje is used with clock time; keep it for appointments.",
    },
  },
  {
    id: 21,
    level: "B2",
    topic: "clinic",
    title_vi: "Mô tả triệu chứng",
    title_en: "Describing symptoms",
    learner_goal_vi: "Mô tả sốt và ho kéo dài hai ngày.",
    learner_goal_en: "Describe fever and cough lasting two days.",
    lines: [
      { speaker: "Doctor", gurmukhi: "ਤੁਹਾਨੂੰ ਕਿੰਨੇ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ?", romanization: "tuhanu kinne din ton bukhar hai?", vi: "Bạn bị sốt mấy ngày rồi?", en: "How many days have you had a fever?" },
      { speaker: "Patient", gurmukhi: "ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਅਤੇ ਖੰਘ ਹੈ।", romanization: "do din ton bukhar ate khang hai", vi: "Tôi bị sốt và ho hai ngày rồi.", en: "I have had fever and cough for two days." },
    ],
    useful_phrases: [
      { gurmukhi: "ਦੋ ਦਿਨ ਤੋਂ", romanization: "do din ton", vi: "từ hai ngày nay", en: "for two days" },
      { gurmukhi: "ਬੁਖਾਰ ਅਤੇ ਖੰਘ", romanization: "bukhar ate khang", vi: "sốt và ho", en: "fever and cough" },
    ],
    common_mistake: {
      vi: "ਤੋਂ sau khoảng thời gian diễn tả 'từ/được bao lâu'.",
      en: "Ton after a time span expresses duration up to now.",
    },
  },
  {
    id: 22,
    level: "A1",
    topic: "school",
    title_vi: "Hỏi lớp học",
    title_en: "Asking about class",
    learner_goal_vi: "Hỏi lớp Punjabi ở đâu.",
    learner_goal_en: "Ask where the Punjabi class is.",
    lines: [
      { speaker: "Student", gurmukhi: "ਪੰਜਾਬੀ ਕਲਾਸ ਕਿੱਥੇ ਹੈ?", romanization: "Punjabi class kithe hai?", vi: "Lớp Punjabi ở đâu?", en: "Where is the Punjabi class?" },
      { speaker: "Teacher", gurmukhi: "ਕਲਾਸ ਕਮਰਾ ਦੋ ਵਿੱਚ ਹੈ।", romanization: "class kamra do vich hai", vi: "Lớp ở phòng số hai.", en: "The class is in room two." },
    ],
    useful_phrases: [
      { gurmukhi: "ਕਮਰਾ ਦੋ", romanization: "kamra do", vi: "phòng hai", en: "room two" },
      { gurmukhi: "ਕਲਾਸ", romanization: "class", vi: "lớp học", en: "class" },
    ],
    common_mistake: {
      vi: "ਕਿੱਥੇ là từ hỏi vị trí; đặt trước ਹੈ trong câu đơn.",
      en: "Kithe asks location and comes before hai in this simple question.",
    },
  },
  {
    id: 23,
    level: "A2",
    topic: "school",
    title_vi: "Xin nhắc lại",
    title_en: "Asking for repetition",
    learner_goal_vi: "Xin giáo viên nói lại chậm hơn.",
    learner_goal_en: "Ask the teacher to repeat more slowly.",
    lines: [
      { speaker: "Student", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke phir dasso", vi: "Làm ơn nói lại.", en: "Please say it again." },
      { speaker: "Teacher", gurmukhi: "ਠੀਕ ਹੈ, ਮੈਂ ਹੌਲੀ ਬੋਲਦਾ ਹਾਂ।", romanization: "thik hai, main hauli bolda han", vi: "Được, tôi nói chậm.", en: "Okay, I will speak slowly." },
    ],
    useful_phrases: [
      { gurmukhi: "ਫਿਰ ਦੱਸੋ", romanization: "phir dasso", vi: "nói lại", en: "say again" },
      { gurmukhi: "ਹੌਲੀ", romanization: "hauli", vi: "chậm", en: "slowly" },
    ],
    common_mistake: {
      vi: "ਦੱਸੋ lịch sự hơn ਦੱਸ; phù hợp khi nói với giáo viên.",
      en: "Dasso is more polite than dass and fits talking to a teacher.",
    },
  },
  {
    id: 24,
    level: "B1",
    topic: "school",
    title_vi: "Nộp bài muộn",
    title_en: "Submitting late homework",
    learner_goal_vi: "Giải thích bài tập sẽ nộp muộn một ngày.",
    learner_goal_en: "Explain that homework will be one day late.",
    lines: [
      { speaker: "Student", gurmukhi: "ਮੇਰਾ ਕੰਮ ਇੱਕ ਦਿਨ ਦੇਰ ਨਾਲ ਹੋਵੇਗਾ।", romanization: "mera kamm ikk din der nal hovega", vi: "Bài của tôi sẽ muộn một ngày.", en: "My work will be one day late." },
      { speaker: "Teacher", gurmukhi: "ਠੀਕ ਹੈ, ਕੱਲ੍ਹ ਭੇਜ ਦਿਓ।", romanization: "thik hai, kall bhej dio", vi: "Được, gửi ngày mai nhé.", en: "Okay, send it tomorrow." },
    ],
    useful_phrases: [
      { gurmukhi: "ਇੱਕ ਦਿਨ ਦੇਰ ਨਾਲ", romanization: "ikk din der nal", vi: "muộn một ngày", en: "one day late" },
      { gurmukhi: "ਭੇਜ ਦਿਓ", romanization: "bhej dio", vi: "hãy gửi", en: "please send" },
    ],
    common_mistake: {
      vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai tùy ngữ cảnh; câu này là ngày mai.",
      en: "Kall can mean yesterday or tomorrow by context; here it means tomorrow.",
    },
  },
  {
    id: 25,
    level: "A1",
    topic: "workplace",
    title_vi: "Ngày đầu đi làm",
    title_en: "First day at work",
    learner_goal_vi: "Tự giới thiệu với đồng nghiệp.",
    learner_goal_en: "Introduce yourself to a coworker.",
    lines: [
      { speaker: "A", gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਨਵਾਂ ਕਰਮਚਾਰੀ ਹਾਂ।", romanization: "sat sri akal, main nava karamchari han", vi: "Xin chào, tôi là nhân viên mới.", en: "Hello, I am a new employee." },
      { speaker: "B", gurmukhi: "ਸਵਾਗਤ ਹੈ।", romanization: "swagat hai", vi: "Chào mừng.", en: "Welcome." },
    ],
    useful_phrases: [
      { gurmukhi: "ਨਵਾਂ ਕਰਮਚਾਰੀ", romanization: "nava karamchari", vi: "nhân viên mới", en: "new employee" },
      { gurmukhi: "ਸਵਾਗਤ ਹੈ", romanization: "swagat hai", vi: "chào mừng", en: "welcome" },
    ],
    common_mistake: {
      vi: "ਕਰਮਚਾਰੀ là nhân viên; đừng nhầm với ਕੰਮ 'công việc'.",
      en: "Karamchari means employee; do not confuse it with kamm, work.",
    },
  },
  {
    id: 26,
    level: "B1",
    topic: "workplace",
    title_vi: "Hỏi hạn chót",
    title_en: "Asking about a deadline",
    learner_goal_vi: "Hỏi hạn chót của báo cáo.",
    learner_goal_en: "Ask about the report deadline.",
    lines: [
      { speaker: "A", gurmukhi: "ਰਿਪੋਰਟ ਦੀ ਆਖਰੀ ਤਾਰੀਖ ਕੀ ਹੈ?", romanization: "report di akhri tarik ki hai?", vi: "Hạn chót của báo cáo là ngày nào?", en: "What is the report deadline?" },
      { speaker: "B", gurmukhi: "ਆਖਰੀ ਤਾਰੀਖ ਸ਼ੁੱਕਰਵਾਰ ਹੈ।", romanization: "akhri tarik shukkarvaar hai", vi: "Hạn chót là thứ Sáu.", en: "The deadline is Friday." },
    ],
    useful_phrases: [
      { gurmukhi: "ਆਖਰੀ ਤਾਰੀਖ", romanization: "akhri tarik", vi: "hạn chót", en: "deadline" },
      { gurmukhi: "ਸ਼ੁੱਕਰਵਾਰ", romanization: "shukkarvaar", vi: "thứ Sáu", en: "Friday" },
    ],
    common_mistake: {
      vi: "ਦੀ nối sở hữu với danh từ giống cái ਤਾਰੀਖ.",
      en: "Di links possession with the feminine noun tarik.",
    },
  },
  {
    id: 27,
    level: "C1",
    topic: "workplace",
    title_vi: "Không đồng ý lịch sự",
    title_en: "Disagreeing politely",
    learner_goal_vi: "Nêu bất đồng trong cuộc họp mà vẫn giữ lịch sự.",
    learner_goal_en: "Disagree in a meeting while staying polite.",
    lines: [
      { speaker: "A", gurmukhi: "ਮੇਰੀ ਰਾਏ ਥੋੜ੍ਹੀ ਵੱਖਰੀ ਹੈ।", romanization: "meri rai thorhi vakhri hai", vi: "Ý kiến của tôi hơi khác.", en: "My opinion is slightly different." },
      { speaker: "B", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕਾਰਨ ਦੱਸੋ।", romanization: "kirpa karke apna karan dasso", vi: "Làm ơn nêu lý do của bạn.", en: "Please explain your reason." },
    ],
    useful_phrases: [
      { gurmukhi: "ਮੇਰੀ ਰਾਏ", romanization: "meri rai", vi: "ý kiến của tôi", en: "my opinion" },
      { gurmukhi: "ਥੋੜ੍ਹੀ ਵੱਖਰੀ", romanization: "thorhi vakhri", vi: "hơi khác", en: "slightly different" },
    ],
    common_mistake: {
      vi: "Dùng ਥੋੜ੍ਹੀ để làm mềm bất đồng; nói quá trực tiếp có thể nghe gắt.",
      en: "Use thorhi to soften disagreement; a bare contradiction can sound harsh.",
    },
  },
  {
    id: 28,
    level: "A2",
    topic: "public_office",
    title_vi: "Hỏi mẫu đơn",
    title_en: "Asking for a form",
    learner_goal_vi: "Xin mẫu đơn ở cơ quan công quyền.",
    learner_goal_en: "Ask for a form at a public office.",
    lines: [
      { speaker: "Visitor", gurmukhi: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu ih form chahida hai", vi: "Tôi cần mẫu đơn này.", en: "I need this form." },
      { speaker: "Clerk", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਥੇ ਦਸਤਖਤ ਕਰੋ।", romanization: "kirpa karke ithe dastkhat karo", vi: "Làm ơn ký ở đây.", en: "Please sign here." },
    ],
    useful_phrases: [
      { gurmukhi: "ਫਾਰਮ", romanization: "form", vi: "mẫu đơn", en: "form" },
      { gurmukhi: "ਦਸਤਖਤ ਕਰੋ", romanization: "dastkhat karo", vi: "hãy ký", en: "sign" },
    ],
    common_mistake: {
      vi: "ਇੱਥੇ là 'ở đây'; không nhầm với ਉੱਥੇ 'ở kia'.",
      en: "Ithe means here; do not confuse it with uthe, there.",
    },
  },
  {
    id: 29,
    level: "B1",
    topic: "public_office",
    title_vi: "Hỏi giấy tờ cần thiết",
    title_en: "Asking about required documents",
    learner_goal_vi: "Hỏi cần mang giấy tờ nào.",
    learner_goal_en: "Ask which documents are required.",
    lines: [
      { speaker: "Visitor", gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
      { speaker: "Clerk", gurmukhi: "ਪਾਸਪੋਰਟ ਅਤੇ ਪਤਾ ਲਿਆਓ।", romanization: "passport ate pata liao", vi: "Hãy mang hộ chiếu và địa chỉ.", en: "Bring a passport and address." },
    ],
    useful_phrases: [
      { gurmukhi: "ਦਸਤਾਵੇਜ਼", romanization: "dastavez", vi: "giấy tờ", en: "documents" },
      { gurmukhi: "ਲੋੜੀਂਦੇ ਹਨ", romanization: "lorinde han", vi: "được yêu cầu / cần thiết", en: "are required" },
    ],
    common_mistake: {
      vi: "ਕਿਹੜੇ hỏi 'những cái nào'; hợp với danh từ số nhiều như giấy tờ.",
      en: "Kihre asks 'which ones' and fits plural items like documents.",
    },
  },
  {
    id: 30,
    level: "C1",
    topic: "public_office",
    title_vi: "Yêu cầu giải thích quyết định",
    title_en: "Requesting an explanation",
    learner_goal_vi: "Hỏi lịch sự lý do hồ sơ bị từ chối.",
    learner_goal_en: "Politely ask why an application was refused.",
    lines: [
      { speaker: "Visitor", gurmukhi: "ਕੀ ਤੁਸੀਂ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusi faisle da karan samjha sakde ho?", vi: "Bạn có thể giải thích lý do của quyết định không?", en: "Can you explain the reason for the decision?" },
      { speaker: "Clerk", gurmukhi: "ਹਾਂ, ਇੱਕ ਦਸਤਾਵੇਜ਼ ਅਧੂਰਾ ਹੈ।", romanization: "han, ikk dastavez adhura hai", vi: "Có, một giấy tờ chưa đầy đủ.", en: "Yes, one document is incomplete." },
    ],
    useful_phrases: [
      { gurmukhi: "ਫੈਸਲੇ ਦਾ ਕਾਰਨ", romanization: "faisle da karan", vi: "lý do của quyết định", en: "reason for the decision" },
      { gurmukhi: "ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "samjha sakde ho?", vi: "có thể giải thích không?", en: "can you explain?" },
    ],
    common_mistake: {
      vi: "ਸਕਦੇ ਹੋ làm câu hỏi lịch sự hơn; đừng dùng mệnh lệnh khi hỏi nhân viên.",
      en: "Sakde ho makes the request polite; avoid commands with officials.",
    },
  },
];

export default punjabiDialogues;
