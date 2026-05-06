// Type definitions for Chinese lesson data
// Mirrors the schema used by all 50 lessons; types derived from existing data.

export type ChineseVocabEntry = {
  chinese: string;
  pinyin: string;
  english: string;
  vi?: string;
};

export type ChineseSentence = {
  chinese: string;
  pinyin: string;
  english: string;
  vi?: string;
  pronunciation_focus?: string[];
};

export type ChineseDialogueLine = {
  speaker: string;
  chinese: string;
  pinyin: string;
  english: string;
  vi?: string;
};

export type ChineseExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
};

export type ChineseExerciseMatching = {
  type: "matching";
  pairs: ChineseVocabEntry[];
  instruction: string;
};

export type ChineseExerciseTranslation = {
  type: "translation";
  vietnamese: string;
  chinese: string;
  pinyin: string;
};

export type ChineseExercise =
  | ChineseExerciseFillBlank
  | ChineseExerciseMatching
  | ChineseExerciseTranslation;

export type ChineseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// Category meta — parallels FRENCH_CATEGORIES / GERMAN_CATEGORIES shape.
// Categories listed here are the ones currently used in the lesson data
// (study_career = Cat 1 Học tập & Nghề nghiệp, cultural_communication =
// Cat 2 Giao tiếp Văn hóa, fluency = B2 calibration sample). New B2
// rounds add to this list as they ship.
export type ChineseCategoryId =
  | "study_career"
  | "cultural_communication"
  | "travel_mobility"
  | "personal_social"
  | "fluency";

export type ChineseCategoryMeta = {
  id: ChineseCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const CHINESE_CATEGORIES: ReadonlyArray<ChineseCategoryMeta> = [
  { id: "study_career", title_vi: "Học tập & Nghề nghiệp", title_en: "Study & Career", expected_count: 10 },
  { id: "cultural_communication", title_vi: "Giao tiếp Văn hóa", title_en: "Cultural Communication", expected_count: 10 },
  { id: "travel_mobility", title_vi: "Du lịch & Di chuyển", title_en: "Travel & Mobility", expected_count: 10 },
  { id: "personal_social", title_vi: "Quan hệ cá nhân & Xã hội", title_en: "Personal & Social Relationships", expected_count: 10 },
  { id: "fluency", title_vi: "Lưu loát", title_en: "Fluency", expected_count: 5 },
];

export type IdiomGloss = {
  idiom: string;
  literal: string;
  meaning: string;
  example: string;
};

// B2-specific dialogue line — adds Vietnamese gloss to the existing
// {speaker, chinese, pinyin, english} shape used by lessons 1-50.
export type ChineseB2DialogueLine = {
  speaker: string;
  chinese: string;
  pinyin: string;
  english: string;
  vi?: string;
};

export type ChineseLesson = {
  id: number;
  level: ChineseCefrLevel;
  title: string;
  pinyin: string;
  topic: string;
  vocab: ChineseVocabEntry[];
  sentences: ChineseSentence[];
  dialogue: ChineseDialogueLine[];
  exercises: ChineseExercise[];
  // B2-specific optional fields (Phase 2 conversation-focused lessons).
  // All optional — existing A1/A2/B1 lessons typecheck unchanged.
  cultural_notes_vi?: string;
  tip_advice_vi?: string;
  dialogue_long?: ChineseB2DialogueLine[];
  roleplay_prompts?: string[];
  register_notes?: string;
  idiom_glosses?: IdiomGloss[];
  // Forward-compatible fields for the cross-language B2 template.
  // Legacy `title` / `topic` remain authoritative until the renderer reads these.
  category?: ChineseCategoryId;
  title_vi?: string;
  title_en?: string;
};

export const lessons: ChineseLesson[] = [
  {
    id: 1,
level: "A1",
    title: "你好",
    pinyin: "nǐ hǎo",
    topic: "Greetings",
    vocab: [
      { chinese: "你好", pinyin: "nǐ hǎo", english: "Hello" },
      { chinese: "早上好", pinyin: "zǎo shang hǎo", english: "Good morning" },
      { chinese: "再见", pinyin: "zài jiàn", english: "Goodbye" },
      { chinese: "谢谢", pinyin: "xiè xiè", english: "Thank you" },
      { chinese: "对不起", pinyin: "duì bu qǐ", english: "Sorry" },
      { chinese: "没关系", pinyin: "méi guān xì", english: "It's okay" },
      { chinese: "请问", pinyin: "qǐng wèn", english: "Excuse me / May I ask" },
      { chinese: "欢迎", pinyin: "huān yíng", english: "Welcome" },
      { chinese: "晚安", pinyin: "wǎn ān", english: "Good night" },
      { chinese: "回头见", pinyin: "huí tóu jiàn", english: "See you later" }
    ],

    sentences: [
      { chinese: "你好吗？", pinyin: "nǐ hǎo ma?", english: "How are you?" },
      { chinese: "我很好，谢谢。", pinyin: "wǒ hěn hǎo, xiè xiè.", english: "I'm fine, thank you." },
      { chinese: "早上好，今天天气不错。", pinyin: "zǎo shang hǎo, jīn tiān tiān qì bù cuò.", english: "Good morning, the weather is nice today." },
      { chinese: "再见，明天见。", pinyin: "zài jiàn, míng tiān jiàn.", english: "Goodbye, see you tomorrow." },
      { chinese: "欢迎来到中国！", pinyin: "huān yíng lái dào zhōng guó!", english: "Welcome to China!" }
    ],

    dialogue: [
      { speaker: "A", chinese: "你好！你是新来的同学吗？", pinyin: "nǐ hǎo! nǐ shì xīn lái de tóng xué ma?", english: "Hello! Are you a new student?" },
      { speaker: "B", chinese: "是的，我叫小王。很高兴认识你。", pinyin: "shì de, wǒ jiào xiǎo wáng. hěn gāo xìng rèn shí nǐ.", english: "Yes, my name is Xiao Wang. Nice to meet you." },
      { speaker: "A", chinese: "我也很高兴认识你。欢迎来到我们班。", pinyin: "wǒ yě hěn gāo xìng rèn shí nǐ. huān yíng lái dào wǒ men bān.", english: "Nice to meet you too. Welcome to our class." },
      { speaker: "B", chinese: "谢谢！希望我们能成为好朋友。", pinyin: "xiè xiè! xī wàng wǒ men néng chéng wéi hǎo péng yǒu.", english: "Thank you! I hope we can become good friends." }
    ],

    exercises: [
      { type: "fill-blank", question: "___好，我是老师。", answer: "你" },
      { type: "matching", pairs: [{ chinese: "再见", pinyin: "zài jiàn", english: "goodbye" }, { chinese: "谢谢", pinyin: "xiè xiè", english: "thank you" }], instruction: "Match Chinese with English" },
      { type: "translation", vietnamese: "Chào buổi sáng, bạn khỏe không?", chinese: "早上好，你好吗？", pinyin: "zǎo shang hǎo, nǐ hǎo ma?" }
    ],
  },
  {
    id: 2,
level: "A1",
    title: "数字",
    pinyin: "shù zì",
    topic: "Numbers 1-10",
    vocab: [
      { chinese: "一", pinyin: "yī", english: "one" },
      { chinese: "二", pinyin: "èr", english: "two" },
      { chinese: "三", pinyin: "sān", english: "three" },
      { chinese: "四", pinyin: "sì", english: "four" },
      { chinese: "五", pinyin: "wǔ", english: "five" },
      { chinese: "六", pinyin: "liù", english: "six" },
      { chinese: "七", pinyin: "qī", english: "seven" },
      { chinese: "八", pinyin: "bā", english: "eight" },
      { chinese: "九", pinyin: "jiǔ", english: "nine" },
      { chinese: "十", pinyin: "shí", english: "ten" }
    ],

    sentences: [
      { chinese: "我有三个苹果。", pinyin: "wǒ yǒu sān gè píng guǒ.", english: "I have three apples." },
      { chinese: "今天是五月二号。", pinyin: "jīn tiān shì wǔ yuè èr hào.", english: "Today is May 2nd." },
      { chinese: "这个多少钱？十块钱。", pinyin: "zhè gè duō shao qián? shí kuài qián.", english: "How much is this? Ten yuan." },
      { chinese: "我们班有八个学生。", pinyin: "wǒ men bān yǒu bā gè xué shēng.", english: "Our class has eight students." },
      { chinese: "请给我五杯水。", pinyin: "qǐng gěi wǒ wǔ bēi shuǐ.", english: "Please give me five glasses of water." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你家有几口人？", pinyin: "nǐ jiā yǒu jǐ kǒu rén?", english: "How many people are in your family?" },
      { speaker: "B", chinese: "我家有四口人。爸爸、妈妈、哥哥和我。", pinyin: "wǒ jiā yǒu sì kǒu rén. bà ba, mā ma, gē ge hé wǒ.", english: "There are four people. Dad, mom, older brother and me." },
      { speaker: "A", chinese: "你哥哥多大？", pinyin: "nǐ gē ge duō dà?", english: "How old is your brother?" },
      { speaker: "B", chinese: "他二十五岁。", pinyin: "tā èr shí wǔ suì.", english: "He is twenty-five years old." }
    ],

    exercises: [
      { type: "fill-blank", question: "我买了___本书。", answer: "三" },
      { type: "matching", pairs: [{ chinese: "七", pinyin: "qī", english: "seven" }, { chinese: "九", pinyin: "jiǔ", english: "nine" }], instruction: "Match the number with English" },
      { type: "translation", vietnamese: "Có tám quyển sách trên bàn.", chinese: "桌子上有八本书。", pinyin: "zhuō zi shàng yǒu bā běn shū." }
    ],
  },
  {
    id: 3,
level: "A1",
    title: "家人",
    pinyin: "jiā rén",
    topic: "Family",
    vocab: [
      { chinese: "妈妈", pinyin: "mā ma", english: "mother" },
      { chinese: "爸爸", pinyin: "bà ba", english: "father" },
      { chinese: "哥哥", pinyin: "gē ge", english: "older brother" },
      { chinese: "姐姐", pinyin: "jiě jie", english: "older sister" },
      { chinese: "弟弟", pinyin: "dì di", english: "younger brother" },
      { chinese: "妹妹", pinyin: "mèi mei", english: "younger sister" },
      { chinese: "爷爷", pinyin: "yé ye", english: "grandfather" },
      { chinese: "奶奶", pinyin: "nǎi nai", english: "grandmother" },
      { chinese: "儿子", pinyin: "ér zi", english: "son" },
      { chinese: "女儿", pinyin: "nǚ ér", english: "daughter" }
    ],

    sentences: [
      { chinese: "我爸爸是医生。", pinyin: "wǒ bà ba shì yī shēng.", english: "My father is a doctor." },
      { chinese: "我妈妈做的饭很好吃。", pinyin: "wǒ mā ma zuò de fàn hěn hǎo chī.", english: "The food my mother makes is delicious." },
      { chinese: "我有一个哥哥和一个妹妹。", pinyin: "wǒ yǒu yī gè gē ge hé yī gè mèi mei.", english: "I have one older brother and one younger sister." },
      { chinese: "爷爷和奶奶住在老家。", pinyin: "yé ye hé nǎi nai zhù zài lǎo jiā.", english: "Grandpa and grandma live in the hometown." },
      { chinese: "我女儿今年五岁了。", pinyin: "wǒ nǚ ér jīn nián wǔ suì le.", english: "My daughter is five years old this year." }
    ],

    dialogue: [
      { speaker: "A", chinese: "这是你家人的照片吗？", pinyin: "zhè shì nǐ jiā rén de zhào piàn ma?", english: "Is this a photo of your family?" },
      { speaker: "B", chinese: "是的。这是我爸爸和妈妈。", pinyin: "shì de. zhè shì wǒ bà ba hé mā ma.", english: "Yes. These are my father and mother." },
      { speaker: "A", chinese: "你姐姐看起来很像你妈妈。", pinyin: "nǐ jiě jie kàn qǐ lái hěn xiàng nǐ mā ma.", english: "Your older sister looks a lot like your mother." },
      { speaker: "B", chinese: "大家都这么说。", pinyin: "dà jiā dōu zhè me shuō.", english: "Everyone says that." }
    ],

    exercises: [
      { type: "fill-blank", question: "我___做饭很好吃。", answer: "妈妈" },
      { type: "matching", pairs: [{ chinese: "哥哥", pinyin: "gē ge", english: "older brother" }, { chinese: "妹妹", pinyin: "mèi mei", english: "younger sister" }], instruction: "Match family terms with English" },
      { type: "translation", vietnamese: "Gia đình tôi có năm người.", chinese: "我的家有五口人。", pinyin: "wǒ de jiā yǒu wǔ kǒu rén." }
    ],
  },
  {
    id: 4,
level: "A1",
    title: "颜色",
    pinyin: "yán sè",
    topic: "Colors",
    vocab: [
      { chinese: "红色", pinyin: "hóng sè", english: "red" },
      { chinese: "蓝色", pinyin: "lán sè", english: "blue" },
      { chinese: "绿色", pinyin: "lǜ sè", english: "green" },
      { chinese: "黄色", pinyin: "huáng sè", english: "yellow" },
      { chinese: "白色", pinyin: "bái sè", english: "white" },
      { chinese: "黑色", pinyin: "hēi sè", english: "black" },
      { chinese: "紫色", pinyin: "zǐ sè", english: "purple" },
      { chinese: "橙色", pinyin: "chéng sè", english: "orange" },
      { chinese: "粉色", pinyin: "fěn sè", english: "pink" },
      { chinese: "灰色", pinyin: "huī sè", english: "gray" }
    ],

    sentences: [
      { chinese: "我喜欢红色的花。", pinyin: "wǒ xǐ huān hóng sè de huā.", english: "I like red flowers." },
      { chinese: "天空是蓝色的。", pinyin: "tiān kōng shì lán sè de.", english: "The sky is blue." },
      { chinese: "她穿了一件白色的裙子。", pinyin: "tā chuān le yī jiàn bái sè de qún zi.", english: "She wore a white dress." },
      { chinese: "这件黑色的外套很好看。", pinyin: "zhè jiàn hēi sè de wài tào hěn hǎo kàn.", english: "This black coat looks very nice." },
      { chinese: "春天有很多绿色的植物。", pinyin: "chūn tiān yǒu hěn duō lǜ sè de zhí wù.", english: "There are many green plants in spring." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你喜欢什么颜色？", pinyin: "nǐ xǐ huān shén me yán sè?", english: "What color do you like?" },
      { speaker: "B", chinese: "我最喜欢蓝色，像大海的颜色。", pinyin: "wǒ zuì xǐ huān lán sè, xiàng dà hǎi de yán sè.", english: "I like blue the most, like the color of the ocean." },
      { speaker: "A", chinese: "我也喜欢蓝色。你讨厌什么颜色？", pinyin: "wǒ yě xǐ huān lán sè. nǐ tǎo yàn shén me yán sè?", english: "I also like blue. What color do you dislike?" },
      { speaker: "B", chinese: "我不太喜欢灰色，看起来太闷了。", pinyin: "wǒ bù tài xǐ huān huī sè, kàn qǐ lái tài mèn le.", english: "I don't really like gray, it looks too dull." }
    ],

    exercises: [
      { type: "fill-blank", question: "苹果是___色的。", answer: "红" },
      { type: "matching", pairs: [{ chinese: "黄色", pinyin: "huáng sè", english: "yellow" }, { chinese: "绿色", pinyin: "lǜ sè", english: "green" }], instruction: "Match the color with English" },
      { type: "translation", vietnamese: "Tôi muốn mua một chiếc áo màu đen.", chinese: "我想买一件黑色的衣服。", pinyin: "wǒ xiǎng mǎi yī jiàn hēi sè de yī fu." }
    ],
  },
  {
    id: 5,
level: "A1",
    title: "食物",
    pinyin: "shí wù",
    topic: "Food",
    vocab: [
      { chinese: "米饭", pinyin: "mǐ fàn", english: "rice" },
      { chinese: "面条", pinyin: "miàn tiáo", english: "noodles" },
      { chinese: "饺子", pinyin: "jiǎo zi", english: "dumplings" },
      { chinese: "面包", pinyin: "miàn bāo", english: "bread" },
      { chinese: "鸡肉", pinyin: "jī ròu", english: "chicken" },
      { chinese: "牛肉", pinyin: "niú ròu", english: "beef" },
      { chinese: "鱼", pinyin: "yú", english: "fish" },
      { chinese: "蔬菜", pinyin: "shū cài", english: "vegetables" },
      { chinese: "水果", pinyin: "shuǐ guǒ", english: "fruit" },
      { chinese: "蛋糕", pinyin: "dàn gāo", english: "cake" }
    ],

    sentences: [
      { chinese: "我喜欢吃中国菜。", pinyin: "wǒ xǐ huān chī zhōng guó cài.", english: "I like eating Chinese food." },
      { chinese: "饺子是我最喜欢的食物。", pinyin: "jiǎo zi shì wǒ zuì xǐ huān de shí wù.", english: "Dumplings are my favorite food." },
      { chinese: "今天中午我吃了面条。", pinyin: "jīn tiān zhōng wǔ wǒ chī le miàn tiáo.", english: "I ate noodles for lunch today." },
      { chinese: "多吃蔬菜对身体好。", pinyin: "duō chī shū cài duì shēn tǐ hǎo.", english: "Eating more vegetables is good for your health." },
      { chinese: "妈妈做的鱼很好吃。", pinyin: "mā ma zuò de yú hěn hǎo chī.", english: "The fish mom makes is delicious." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你饿了吗？我们去吃饭吧。", pinyin: "nǐ è le ma? wǒ men qù chī fàn ba.", english: "Are you hungry? Let's go eat." },
      { speaker: "B", chinese: "好啊，你想吃什么？", pinyin: "hǎo a, nǐ xiǎng chī shén me?", english: "Sure, what do you want to eat?" },
      { speaker: "A", chinese: "我想吃饺子，附近有一家不错的饺子馆。", pinyin: "wǒ xiǎng chī jiǎo zi, fù jìn yǒu yī jiā bù cuò de jiǎo zi guǎn.", english: "I want dumplings. There's a good dumpling restaurant nearby." },
      { speaker: "B", chinese: "太好了，我也很久没吃饺子了。", pinyin: "tài hǎo le, wǒ yě hěn jiǔ méi chī jiǎo zi le.", english: "Great, I haven't had dumplings in a long time either." }
    ],

    exercises: [
      { type: "fill-blank", question: "中国人喜欢吃___。", answer: "米饭" },
      { type: "matching", pairs: [{ chinese: "鸡肉", pinyin: "jī ròu", english: "chicken" }, { chinese: "蔬菜", pinyin: "shū cài", english: "vegetables" }], instruction: "Match the food with English" },
      { type: "translation", vietnamese: "Tôi thích ăn bánh bao Trung Quốc.", chinese: "我喜欢吃中国饺子。", pinyin: "wǒ xǐ huān chī zhōng guó jiǎo zi." }
    ],
  },
  {
    id: 6,
level: "A1",
    title: "饮料",
    pinyin: "yǐn liào",
    topic: "Drinks",
    vocab: [
      { chinese: "水", pinyin: "shuǐ", english: "water" },
      { chinese: "茶", pinyin: "chá", english: "tea" },
      { chinese: "咖啡", pinyin: "kā fēi", english: "coffee" },
      { chinese: "牛奶", pinyin: "niú nǎi", english: "milk" },
      { chinese: "果汁", pinyin: "guǒ zhī", english: "fruit juice" },
      { chinese: "啤酒", pinyin: "pí jiǔ", english: "beer" },
      { chinese: "可乐", pinyin: "kě lè", english: "cola" },
      { chinese: "豆浆", pinyin: "dòu jiāng", english: "soy milk" },
      { chinese: "红酒", pinyin: "hóng jiǔ", english: "red wine" },
      { chinese: "热水", pinyin: "rè shuǐ", english: "hot water" }
    ],

    sentences: [
      { chinese: "请给我一杯水。", pinyin: "qǐng gěi wǒ yī bēi shuǐ.", english: "Please give me a glass of water." },
      { chinese: "中国人喜欢喝绿茶。", pinyin: "zhōng guó rén xǐ huān hē lǜ chá.", english: "Chinese people like to drink green tea." },
      { chinese: "我每天早上喝一杯咖啡。", pinyin: "wǒ měi tiān zǎo shang hē yī bēi kā fēi.", english: "I drink a cup of coffee every morning." },
      { chinese: "小孩子应该多喝牛奶。", pinyin: "xiǎo hái zi yīng gāi duō hē niú nǎi.", english: "Children should drink more milk." },
      { chinese: "果汁比可乐更健康。", pinyin: "guǒ zhī bǐ kě lè gèng jiàn kāng.", english: "Fruit juice is healthier than cola." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你想喝点什么？茶还是咖啡？", pinyin: "nǐ xiǎng hē diǎn shén me? chá hái shì kā fēi?", english: "What would you like to drink? Tea or coffee?" },
      { speaker: "B", chinese: "我喝茶吧，有绿茶吗？", pinyin: "wǒ hē chá ba, yǒu lǜ chá ma?", english: "I'll have tea. Do you have green tea?" },
      { speaker: "A", chinese: "有，中国的绿茶很有名。", pinyin: "yǒu, zhōng guó de lǜ chá hěn yǒu míng.", english: "Yes, Chinese green tea is very famous." },
      { speaker: "B", chinese: "谢谢，请给我一杯。", pinyin: "xiè xiè, qǐng gěi wǒ yī bēi.", english: "Thank you, please give me a cup." }
    ],

    exercises: [
      { type: "fill-blank", question: "早上我喜欢喝___。", answer: "咖啡" },
      { type: "matching", pairs: [{ chinese: "茶", pinyin: "chá", english: "tea" }, { chinese: "牛奶", pinyin: "niú nǎi", english: "milk" }], instruction: "Match the drink with English" },
      { type: "translation", vietnamese: "Cho tôi một cốc nước.", chinese: "请给我一杯水。", pinyin: "qǐng gěi wǒ yī bēi shuǐ." }
    ],
  },
  {
    id: 7,
level: "A1",
    title: "星期",
    pinyin: "xīng qī",
    topic: "Days of the Week",
    vocab: [
      { chinese: "星期一", pinyin: "xīng qī yī", english: "Monday" },
      { chinese: "星期二", pinyin: "xīng qī èr", english: "Tuesday" },
      { chinese: "星期三", pinyin: "xīng qī sān", english: "Wednesday" },
      { chinese: "星期四", pinyin: "xīng qī sì", english: "Thursday" },
      { chinese: "星期五", pinyin: "xīng qī wǔ", english: "Friday" },
      { chinese: "星期六", pinyin: "xīng qī liù", english: "Saturday" },
      { chinese: "星期天", pinyin: "xīng qī tiān", english: "Sunday" },
      { chinese: "周末", pinyin: "zhōu mò", english: "weekend" },
      { chinese: "今天", pinyin: "jīn tiān", english: "today" },
      { chinese: "明天", pinyin: "míng tiān", english: "tomorrow" }
    ],

    sentences: [
      { chinese: "今天是星期一。", pinyin: "jīn tiān shì xīng qī yī.", english: "Today is Monday." },
      { chinese: "我星期五有中文课。", pinyin: "wǒ xīng qī wǔ yǒu zhōng wén kè.", english: "I have Chinese class on Friday." },
      { chinese: "周末你要做什么？", pinyin: "zhōu mò nǐ yào zuò shén me?", english: "What are you going to do this weekend?" },
      { chinese: "星期三见！", pinyin: "xīng qī sān jiàn!", english: "See you on Wednesday!" },
      { chinese: "我星期四和星期五都很忙。", pinyin: "wǒ xīng qī sì hé xīng qī wǔ dōu hěn máng.", english: "I'm busy on Thursday and Friday." }
    ],

    dialogue: [
      { speaker: "A", chinese: "今天星期几？", pinyin: "jīn tiān xīng qī jǐ?", english: "What day is it today?" },
      { speaker: "B", chinese: "今天是星期五。", pinyin: "jīn tiān shì xīng qī wǔ.", english: "Today is Friday." },
      { speaker: "A", chinese: "太好了，明天就是周末了！", pinyin: "tài hǎo le, míng tiān jiù shì zhōu mò le!", english: "Great, tomorrow is the weekend!" },
      { speaker: "B", chinese: "是啊，这个周末你有什么计划？", pinyin: "shì a, zhè gè zhōu mò nǐ yǒu shén me jì huà?", english: "Yeah, what plans do you have this weekend?" }
    ],

    exercises: [
      { type: "fill-blank", question: "___是星期日。", answer: "明天" },
      { type: "matching", pairs: [{ chinese: "星期一", pinyin: "xīng qī yī", english: "Monday" }, { chinese: "周末", pinyin: "zhōu mò", english: "weekend" }], instruction: "Match the day with English" },
      { type: "translation", vietnamese: "Thứ Ba tôi có lớp học tiếng Anh.", chinese: "星期二我有英语课。", pinyin: "xīng qī èr wǒ yǒu yīng yǔ kè." }
    ],
  },
  {
    id: 8,
level: "A1",
    title: "月份",
    pinyin: "yuè fèn",
    topic: "Months",
    vocab: [
      { chinese: "一月", pinyin: "yī yuè", english: "January" },
      { chinese: "二月", pinyin: "èr yuè", english: "February" },
      { chinese: "三月", pinyin: "sān yuè", english: "March" },
      { chinese: "四月", pinyin: "sì yuè", english: "April" },
      { chinese: "五月", pinyin: "wǔ yuè", english: "May" },
      { chinese: "六月", pinyin: "liù yuè", english: "June" },
      { chinese: "七月", pinyin: "qī yuè", english: "July" },
      { chinese: "八月", pinyin: "bā yuè", english: "August" },
      { chinese: "九月", pinyin: "jiǔ yuè", english: "September" },
      { chinese: "十月", pinyin: "shí yuè", english: "October" }
    ],

    sentences: [
      { chinese: "我的生日在五月。", pinyin: "wǒ de shēng rì zài wǔ yuè.", english: "My birthday is in May." },
      { chinese: "中国的新年在一月或二月。", pinyin: "zhōng guó de xīn nián zài yī yuè huò èr yuè.", english: "Chinese New Year is in January or February." },
      { chinese: "八月的天气很热。", pinyin: "bā yuè de tiān qì hěn rè.", english: "The weather in August is very hot." },
      { chinese: "学校九月开学。", pinyin: "xué xiào jiǔ yuè kāi xué.", english: "School starts in September." },
      { chinese: "十月一日是中国的国庆节。", pinyin: "shí yuè yī rì shì zhōng guó de guó qìng jié.", english: "October 1st is China's National Day." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你的生日是几月几号？", pinyin: "nǐ de shēng rì shì jǐ yuè jǐ hào?", english: "When is your birthday?" },
      { speaker: "B", chinese: "我的生日是三月十五号。", pinyin: "wǒ de shēng rì shì sān yuè shí wǔ hào.", english: "My birthday is March 15th." },
      { speaker: "A", chinese: "那很快就要到了！", pinyin: "nà hěn kuài jiù yào dào le!", english: "Then it's coming soon!" },
      { speaker: "B", chinese: "是啊，到时候我们一起吃饭吧。", pinyin: "shì a, dào shí hou wǒ men yī qǐ chī fàn ba.", english: "Yes, let's have a meal together then." }
    ],

    exercises: [
      { type: "fill-blank", question: "春节在一月___二月。", answer: "或" },
      { type: "matching", pairs: [{ chinese: "六月", pinyin: "liù yuè", english: "June" }, { chinese: "十二月", pinyin: "shí èr yuè", english: "December" }], instruction: "Match the month with English" },
      { type: "translation", vietnamese: "Sinh nhật của bạn là tháng mấy?", chinese: "你的生日是几月？", pinyin: "nǐ de shēng rì shì jǐ yuè?" }
    ],
  },
  {
    id: 9,
level: "A1",
    title: "天气",
    pinyin: "tiān qì",
    topic: "Weather",
    vocab: [
      { chinese: "晴天", pinyin: "qíng tiān", english: "sunny" },
      { chinese: "阴天", pinyin: "yīn tiān", english: "cloudy" },
      { chinese: "下雨", pinyin: "xià yǔ", english: "rain" },
      { chinese: "下雪", pinyin: "xià xuě", english: "snow" },
      { chinese: "刮风", pinyin: "guā fēng", english: "windy" },
      { chinese: "温度", pinyin: "wēn dù", english: "temperature" },
      { chinese: "冷", pinyin: "lěng", english: "cold" },
      { chinese: "热", pinyin: "rè", english: "hot" },
      { chinese: "凉快", pinyin: "liáng kuai", english: "cool" },
      { chinese: "暖和", pinyin: "nuǎn huo", english: "warm" }
    ],

    sentences: [
      { chinese: "今天天气很好。", pinyin: "jīn tiān tiān qì hěn hǎo.", english: "The weather is very good today." },
      { chinese: "明天可能会下雨。", pinyin: "míng tiān kě néng huì xià yǔ.", english: "It might rain tomorrow." },
      { chinese: "北京的冬天很冷。", pinyin: "běi jīng de dōng tiān hěn lěng.", english: "Beijing's winter is very cold." },
      { chinese: "夏天太热了，我不喜欢。", pinyin: "xià tiān tài rè le, wǒ bù xǐ huān.", english: "Summer is too hot, I don't like it." },
      { chinese: "外面的温度是多少？", pinyin: "wài miàn de wēn dù shì duō shao?", english: "What's the temperature outside?" }
    ],

    dialogue: [
      { speaker: "A", chinese: "你看天气预报了吗？明天天气怎么样？", pinyin: "nǐ kàn tiān qì yù bào le ma? míng tiān tiān qì zěn me yàng?", english: "Did you check the weather forecast? How's the weather tomorrow?" },
      { speaker: "B", chinese: "明天是晴天，但有点冷。", pinyin: "míng tiān shì qíng tiān, dàn yǒu diǎn lěng.", english: "Tomorrow will be sunny but a bit cold." },
      { speaker: "A", chinese: "那我多穿一件衣服。", pinyin: "nà wǒ duō chuān yī jiàn yī fu.", english: "Then I'll wear an extra layer." },
      { speaker: "B", chinese: "对，最高温度只有十度。", pinyin: "duì, zuì gāo wēn dù zhǐ yǒu shí dù.", english: "Right, the high is only 10 degrees." }
    ],

    exercises: [
      { type: "fill-blank", question: "今天___了。", answer: "下雨" },
      { type: "matching", pairs: [{ chinese: "晴天", pinyin: "qíng tiān", english: "sunny" }, { chinese: "下雪", pinyin: "xià xuě", english: "snow" }], instruction: "Match the weather term with English" },
      { type: "translation", vietnamese: "Ngày mai trời sẽ lạnh.", chinese: "明天会很冷。", pinyin: "míng tiān huì hěn lěng." }
    ],
  },
  {
    id: 10,
level: "A1",
    title: "动物",
    pinyin: "dòng wù",
    topic: "Animals",
    vocab: [
      { chinese: "猫", pinyin: "māo", english: "cat" },
      { chinese: "狗", pinyin: "gǒu", english: "dog" },
      { chinese: "鸟", pinyin: "niǎo", english: "bird" },
      { chinese: "鱼", pinyin: "yú", english: "fish" },
      { chinese: "马", pinyin: "mǎ", english: "horse" },
      { chinese: "牛", pinyin: "niú", english: "cow" },
      { chinese: "羊", pinyin: "yáng", english: "sheep" },
      { chinese: "鸡", pinyin: "jī", english: "chicken" },
      { chinese: "兔子", pinyin: "tù zi", english: "rabbit" },
      { chinese: "熊猫", pinyin: "xióng māo", english: "panda" }
    ],

    sentences: [
      { chinese: "我有一只可爱的小猫。", pinyin: "wǒ yǒu yī zhī kě ài de xiǎo māo.", english: "I have a cute little cat." },
      { chinese: "狗是人类最好的朋友。", pinyin: "gǒu shì rén lèi zuì hǎo de péng yǒu.", english: "Dogs are humans' best friends." },
      { chinese: "熊猫是中国的国宝。", pinyin: "xióng māo shì zhōng guó de guó bǎo.", english: "Pandas are China's national treasure." },
      { chinese: "马跑得很快。", pinyin: "mǎ pǎo de hěn kuài.", english: "Horses run very fast." },
      { chinese: "我喜欢去动物园看动物。", pinyin: "wǒ xǐ huān qù dòng wù yuán kàn dòng wù.", english: "I like going to the zoo to see animals." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你喜欢什么动物？", pinyin: "nǐ xǐ huān shén me dòng wù?", english: "What animals do you like?" },
      { speaker: "B", chinese: "我最喜欢狗，它们非常可爱。", pinyin: "wǒ zuì xǐ huān gǒu, tā men fēi cháng kě ài.", english: "I like dogs the most, they are very cute." },
      { speaker: "A", chinese: "你有养宠物吗？", pinyin: "nǐ yǒu yǎng chǒng wù ma?", english: "Do you have any pets?" },
      { speaker: "B", chinese: "有，我养了一只兔子。", pinyin: "yǒu, wǒ yǎng le yī zhī tù zi.", english: "Yes, I have a rabbit." }
    ],

    exercises: [
      { type: "fill-blank", question: "___是中国的国宝。", answer: "熊猫" },
      { type: "matching", pairs: [{ chinese: "猫", pinyin: "māo", english: "cat" }, { chinese: "马", pinyin: "mǎ", english: "horse" }], instruction: "Match the animal with English" },
      { type: "translation", vietnamese: "Tôi có một con chó màu đen.", chinese: "我有一只黑色的狗。", pinyin: "wǒ yǒu yī zhī hēi sè de gǒu." }
    ],
  },
  {
    id: 11,
level: "A1",
    title: "身体",
    pinyin: "shēn tǐ",
    topic: "Body Parts",
    vocab: [
      { chinese: "头", pinyin: "tóu", english: "head" },
      { chinese: "眼睛", pinyin: "yǎn jing", english: "eye" },
      { chinese: "鼻子", pinyin: "bí zi", english: "nose" },
      { chinese: "嘴巴", pinyin: "zuǐ ba", english: "mouth" },
      { chinese: "耳朵", pinyin: "ěr duo", english: "ear" },
      { chinese: "手", pinyin: "shǒu", english: "hand" },
      { chinese: "脚", pinyin: "jiǎo", english: "foot" },
      { chinese: "腿", pinyin: "tuǐ", english: "leg" },
      { chinese: "肩膀", pinyin: "jiān bǎng", english: "shoulder" },
      { chinese: "肚子", pinyin: "dù zi", english: "stomach" }
    ],

    sentences: [
      { chinese: "她的眼睛很漂亮。", pinyin: "tā de yǎn jing hěn piào liang.", english: "Her eyes are very beautiful." },
      { chinese: "我头疼，想休息一下。", pinyin: "wǒ tóu téng, xiǎng xiū xi yī xià.", english: "I have a headache, I want to rest." },
      { chinese: "请用手吃饭在中国是正常的。", pinyin: "qǐng yòng shǒu chī fàn zài zhōng guó shì zhèng cháng de.", english: "Eating with hands is normal in China." },
      { chinese: "跑步对腿很有好处。", pinyin: "pǎo bù duì tuǐ hěn yǒu hǎo chù.", english: "Running is good for your legs." },
      { chinese: "他说的话我听不懂，可能是耳朵有问题。", pinyin: "tā shuō de huà wǒ tīng bù dǒng, kě néng shì ěr duo yǒu wèn tí.", english: "I can't understand what he says, maybe there's something wrong with my ears." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你怎么了？看起来不舒服。", pinyin: "nǐ zěn me le? kàn qǐ lái bù shū fu.", english: "What's wrong? You look uncomfortable." },
      { speaker: "B", chinese: "我肚子疼，可能是吃坏了东西。", pinyin: "wǒ dù zi téng, kě néng shì chī huài le dōng xi.", english: "My stomach hurts, maybe I ate something bad." },
      { speaker: "A", chinese: "要不要去医院看看？", pinyin: "yào bù yào qù yī yuàn kàn kàn?", english: "Should we go to the hospital?" },
      { speaker: "B", chinese: "不用，休息一下应该就没事了。", pinyin: "bù yòng, xiū xi yī xià yīng gāi jiù méi shì le.", english: "No need, I should be fine after resting." }
    ],

    exercises: [
      { type: "fill-blank", question: "我___疼，想睡觉。", answer: "头" },
      { type: "matching", pairs: [{ chinese: "眼睛", pinyin: "yǎn jing", english: "eye" }, { chinese: "脚", pinyin: "jiǎo", english: "foot" }], instruction: "Match body part with English" },
      { type: "translation", vietnamese: "Tai của tôi bị đau.", chinese: "我的耳朵疼。", pinyin: "wǒ de ěr duo téng." }
    ],
  },
  {
    id: 12,
level: "A1",
    title: "方向",
    pinyin: "fāng xiàng",
    topic: "Directions",
    vocab: [
      { chinese: "左边", pinyin: "zuǒ biān", english: "left" },
      { chinese: "右边", pinyin: "yòu biān", english: "right" },
      { chinese: "前面", pinyin: "qián miàn", english: "front / ahead" },
      { chinese: "后面", pinyin: "hòu miàn", english: "behind" },
      { chinese: "旁边", pinyin: "páng biān", english: "beside" },
      { chinese: "北", pinyin: "běi", english: "north" },
      { chinese: "南", pinyin: "nán", english: "south" },
      { chinese: "东", pinyin: "dōng", english: "east" },
      { chinese: "西", pinyin: "xī", english: "west" },
      { chinese: "中间", pinyin: "zhōng jiān", english: "middle / center" }
    ],

    sentences: [
      { chinese: "邮局在银行的左边。", pinyin: "yóu jú zài yín háng de zuǒ biān.", english: "The post office is to the left of the bank." },
      { chinese: "一直往前走，不要转弯。", pinyin: "yī zhí wǎng qián zǒu, bù yào zhuǎn wān.", english: "Go straight ahead, don't turn." },
      { chinese: "学校在超市旁边。", pinyin: "xué xiào zài chāo shì páng biān.", english: "The school is next to the supermarket." },
      { chinese: "北京在河北的北边。", pinyin: "běi jīng zài hé běi de běi biān.", english: "Beijing is north of Hebei." },
      { chinese: "我的家在市中心中间。", pinyin: "wǒ de jiā zài shì zhōng xīn zhōng jiān.", english: "My home is in the center of the city." }
    ],

    dialogue: [
      { speaker: "A", chinese: "请问，最近的医院怎么走？", pinyin: "qǐng wèn, zuì jìn de yī yuàn zěn me zǒu?", english: "Excuse me, how do I get to the nearest hospital?" },
      { speaker: "B", chinese: "往前走两个路口，然后右转。", pinyin: "wǎng qián zǒu liǎng gè lù kǒu, rán hòu yòu zhuǎn.", english: "Go forward two blocks, then turn right." },
      { speaker: "A", chinese: "离这里远吗？", pinyin: "lí zhè lǐ yuǎn ma?", english: "Is it far from here?" },
      { speaker: "B", chinese: "不远，走路大概五分钟。", pinyin: "bù yuǎn, zǒu lù dà gài wǔ fēn zhōng.", english: "Not far, about a five-minute walk." }
    ],

    exercises: [
      { type: "fill-blank", question: "学校在超市的___。", answer: "旁边" },
      { type: "matching", pairs: [{ chinese: "左边", pinyin: "zuǒ biān", english: "left" }, { chinese: "前面", pinyin: "qián miàn", english: "front" }], instruction: "Match the direction with English" },
      { type: "translation", vietnamese: "Rẽ phải ở ngã tư tiếp theo.", chinese: "在下一个路口右转。", pinyin: "zài xià yī gè lù kǒu yòu zhuǎn." }
    ],
  },
  {
    id: 13,
level: "A1",
    title: "时间",
    pinyin: "shí jiān",
    topic: "Time",
    vocab: [
      { chinese: "点", pinyin: "diǎn", english: "o'clock" },
      { chinese: "分", pinyin: "fēn", english: "minute" },
      { chinese: "小时", pinyin: "xiǎo shí", english: "hour" },
      { chinese: "早上", pinyin: "zǎo shang", english: "morning" },
      { chinese: "中午", pinyin: "zhōng wǔ", english: "noon" },
      { chinese: "下午", pinyin: "xià wǔ", english: "afternoon" },
      { chinese: "晚上", pinyin: "wǎn shang", english: "evening" },
      { chinese: "现在", pinyin: "xiàn zài", english: "now" },
      { chinese: "时间", pinyin: "shí jiān", english: "time" },
      { chinese: "半", pinyin: "bàn", english: "half" }
    ],

    sentences: [
      { chinese: "现在几点了？", pinyin: "xiàn zài jǐ diǎn le?", english: "What time is it now?" },
      { chinese: "现在是下午三点十五分。", pinyin: "xiàn zài shì xià wǔ sān diǎn shí wǔ fēn.", english: "It's 3:15 PM now." },
      { chinese: "我每天早上七点起床。", pinyin: "wǒ měi tiān zǎo shang qī diǎn qǐ chuáng.", english: "I get up at 7 AM every day." },
      { chinese: "会议是几点开始？", pinyin: "huì yì shì jǐ diǎn kāi shǐ?", english: "What time does the meeting start?" },
      { chinese: "我们有一个小时的休息时间。", pinyin: "wǒ men yǒu yī gè xiǎo shí de xiū xi shí jiān.", english: "We have one hour of rest time." }
    ],

    dialogue: [
      { speaker: "A", chinese: "我们几点见面？", pinyin: "wǒ men jǐ diǎn jiàn miàn?", english: "What time shall we meet?" },
      { speaker: "B", chinese: "下午两点半怎么样？", pinyin: "xià wǔ liǎng diǎn bàn zěn me yàng?", english: "How about 2:30 PM?" },
      { speaker: "A", chinese: "可以。在哪里见面？", pinyin: "kě yǐ. zài nǎ lǐ jiàn miàn?", english: "That works. Where shall we meet?" },
      { speaker: "B", chinese: "在图书馆门口，不见不散。", pinyin: "zài tú shū guǎn mén kǒu, bù jiàn bù sàn.", english: "At the library entrance, don't leave until we meet." }
    ],

    exercises: [
      { type: "fill-blank", question: "现在是___八点。", answer: "早上" },
      { type: "matching", pairs: [{ chinese: "下午", pinyin: "xià wǔ", english: "afternoon" }, { chinese: "晚上", pinyin: "wǎn shang", english: "evening" }], instruction: "Match the time of day with English" },
      { type: "translation", vietnamese: "Bây giờ là mấy giờ?", chinese: "现在几点了？", pinyin: "xiàn zài jǐ diǎn le?" }
    ],
  },
  {
    id: 14,
level: "A1",
    title: "爱好",
    pinyin: "ài hào",
    topic: "Hobbies",
    vocab: [
      { chinese: "看书", pinyin: "kàn shū", english: "read books" },
      { chinese: "听音乐", pinyin: "tīng yīn yuè", english: "listen to music" },
      { chinese: "游泳", pinyin: "yóu yǒng", english: "swim" },
      { chinese: "跑步", pinyin: "pǎo bù", english: "run / jog" },
      { chinese: "画画", pinyin: "huà huà", english: "draw / paint" },
      { chinese: "唱歌", pinyin: "chàng gē", english: "sing" },
      { chinese: "跳舞", pinyin: "tiào wǔ", english: "dance" },
      { chinese: "摄影", pinyin: "shè yǐng", english: "photography" },
      { chinese: "做饭", pinyin: "zuò fàn", english: "cook" },
      { chinese: "旅行", pinyin: "lǚ xíng", english: "travel" }
    ],

    sentences: [
      { chinese: "我的爱好是看书。", pinyin: "wǒ de ài hào shì kàn shū.", english: "My hobby is reading books." },
      { chinese: "周末我喜欢去游泳。", pinyin: "zhōu mò wǒ xǐ huān qù yóu yǒng.", english: "On weekends I like to go swimming." },
      { chinese: "她唱歌唱得很好听。", pinyin: "tā chàng gē chàng de hěn hǎo tīng.", english: "She sings very beautifully." },
      { chinese: "我最近在学习跳舞。", pinyin: "wǒ zuì jìn zài xué xí tiào wǔ.", english: "I am learning to dance recently." },
      { chinese: "旅行是我最喜欢的活动。", pinyin: "lǚ xíng shì wǒ zuì xǐ huān de huó dòng.", english: "Travel is my favorite activity." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你平时有什么爱好？", pinyin: "nǐ píng shí yǒu shén me ài hào?", english: "What hobbies do you have?" },
      { speaker: "B", chinese: "我喜欢听音乐和跑步。你呢？", pinyin: "wǒ xǐ huān tīng yīn yuè hé pǎo bù. nǐ ne?", english: "I like listening to music and running. What about you?" },
      { speaker: "A", chinese: "我喜欢摄影，特别是拍风景。", pinyin: "wǒ xǐ huān shè yǐng, tè bié shì pāi fēng jǐng.", english: "I like photography, especially taking pictures of landscapes." },
      { speaker: "B", chinese: "那我们周末可以一起去拍照。", pinyin: "nà wǒ men zhōu mò kě yǐ yī qǐ qù pāi zhào.", english: "Then we can go take photos together this weekend." }
    ],

    exercises: [
      { type: "fill-blank", question: "我的爱好是___书。", answer: "看" },
      { type: "matching", pairs: [{ chinese: "唱歌", pinyin: "chàng gē", english: "sing" }, { chinese: "旅行", pinyin: "lǚ xíng", english: "travel" }], instruction: "Match the hobby with English" },
      { type: "translation", vietnamese: "Cuối tuần bạn thích làm gì?", chinese: "周末你喜欢做什么？", pinyin: "zhōu mò nǐ xǐ huān zuò shén me?" }
    ],
  },
  {
    id: 15,
level: "A1",
    title: "学校",
    pinyin: "xué xiào",
    topic: "School",
    vocab: [
      { chinese: "学校", pinyin: "xué xiào", english: "school" },
      { chinese: "老师", pinyin: "lǎo shī", english: "teacher" },
      { chinese: "学生", pinyin: "xué shēng", english: "student" },
      { chinese: "教室", pinyin: "jiào shì", english: "classroom" },
      { chinese: "课本", pinyin: "kè běn", english: "textbook" },
      { chinese: "作业", pinyin: "zuò yè", english: "homework" },
      { chinese: "考试", pinyin: "kǎo shì", english: "exam" },
      { chinese: "成绩", pinyin: "chéng jì", english: "grade / score" },
      { chinese: "学期", pinyin: "xué qī", english: "semester" },
      { chinese: "毕业", pinyin: "bì yè", english: "graduate" }
    ],

    sentences: [
      { chinese: "我在北京大学学习。", pinyin: "wǒ zài běi jīng dà xué xué xí.", english: "I study at Peking University." },
      { chinese: "我们的老师很严格。", pinyin: "wǒ men de lǎo shī hěn yán gé.", english: "Our teacher is very strict." },
      { chinese: "今天的作业做完了吗？", pinyin: "jīn tiān de zuò yè zuò wán le ma?", english: "Have you finished today's homework?" },
      { chinese: "下个星期有考试。", pinyin: "xià gè xīng qī yǒu kǎo shì.", english: "There is an exam next week." },
      { chinese: "我希望这学期的成绩能更好。", pinyin: "wǒ xī wàng zhè xué qī de chéng jì néng gèng hǎo.", english: "I hope my grades will be better this semester." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你在哪个学校读书？", pinyin: "nǐ zài nǎ gè xué xiào dú shū?", english: "Which school do you study at?" },
      { speaker: "B", chinese: "我在上海大学学习中文。", pinyin: "wǒ zài shàng hǎi dà xué xué xí zhōng wén.", english: "I study Chinese at Shanghai University." },
      { speaker: "A", chinese: "中文难吗？", pinyin: "zhōng wén nán ma?", english: "Is Chinese difficult?" },
      { speaker: "B", chinese: "有点难，但是很有意思。", pinyin: "yǒu diǎn nán, dàn shì hěn yǒu yì si.", english: "A bit difficult, but very interesting." }
    ],

    exercises: [
      { type: "fill-blank", question: "你的___做完了吗？", answer: "作业" },
      { type: "matching", pairs: [{ chinese: "老师", pinyin: "lǎo shī", english: "teacher" }, { chinese: "考试", pinyin: "kǎo shì", english: "exam" }], instruction: "Match the school term with English" },
      { type: "translation", vietnamese: "Tôi là sinh viên đại học.", chinese: "我是大学生。", pinyin: "wǒ shì dà xué shēng." }
    ],
  },
  {
    id: 16,
level: "A2",
    title: "旅行",
    pinyin: "lǚ xíng",
    topic: "Travel",
    vocab: [
      { chinese: "飞机", pinyin: "fēi jī", english: "airplane" },
      { chinese: "火车", pinyin: "huǒ chē", english: "train" },
      { chinese: "汽车", pinyin: "qì chē", english: "car" },
      { chinese: "机场", pinyin: "jī chǎng", english: "airport" },
      { chinese: "车站", pinyin: "chē zhàn", english: "station" },
      { chinese: "酒店", pinyin: "jiǔ diàn", english: "hotel" },
      { chinese: "签证", pinyin: "qiān zhèng", english: "visa" },
      { chinese: "护照", pinyin: "hù zhào", english: "passport" },
      { chinese: "地图", pinyin: "dì tú", english: "map" },
      { chinese: "行李", pinyin: "xíng li", english: "luggage" }
    ],

    sentences: [
      { chinese: "我坐飞机去北京。", pinyin: "wǒ zuò fēi jī qù běi jīng.", english: "I'm flying to Beijing." },
      { chinese: "机场离这里远吗？", pinyin: "jī chǎng lí zhè lǐ yuǎn ma?", english: "Is the airport far from here?" },
      { chinese: "我已经订好了酒店。", pinyin: "wǒ yǐ jīng dìng hǎo le jiǔ diàn.", english: "I have already booked a hotel." },
      { chinese: "请出示你的护照和签证。", pinyin: "qǐng chū shì nǐ de hù zhào hé qiān zhèng.", english: "Please show your passport and visa." },
      { chinese: "我的行李很重。", pinyin: "wǒ de xíng li hěn zhòng.", english: "My luggage is very heavy." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你假期打算去哪里？", pinyin: "nǐ jià qī dǎ suàn qù nǎ lǐ?", english: "Where are you planning to go for the holiday?" },
      { speaker: "B", chinese: "我打算去西安旅行。", pinyin: "wǒ dǎ suàn qù xī ān lǚ xíng.", english: "I plan to travel to Xi'an." },
      { speaker: "A", chinese: "你怎么去？坐飞机还是火车？", pinyin: "nǐ zěn me qù? zuò fēi jī hái shì huǒ chē?", english: "How will you go? By plane or train?" },
      { speaker: "B", chinese: "坐高铁，只要四个小时。", pinyin: "zuò gāo tiě, zhǐ yào sì gè xiǎo shí.", english: "By high-speed rail, it only takes four hours." }
    ],

    exercises: [
      { type: "fill-blank", question: "我___火车去上海。", answer: "坐" },
      { type: "matching", pairs: [{ chinese: "飞机", pinyin: "fēi jī", english: "airplane" }, { chinese: "护照", pinyin: "hù zhào", english: "passport" }], instruction: "Match the travel term with English" },
      { type: "translation", vietnamese: "Khách sạn của tôi ở trung tâm thành phố.", chinese: "我的酒店在市中心。", pinyin: "wǒ de jiǔ diàn zài shì zhōng xīn." }
    ],
  },
  {
    id: 17,
level: "A2",
    title: "购物",
    pinyin: "gòu wù",
    topic: "Shopping",
    vocab: [
      { chinese: "买", pinyin: "mǎi", english: "buy" },
      { chinese: "卖", pinyin: "mài", english: "sell" },
      { chinese: "多少钱", pinyin: "duō shao qián", english: "how much money" },
      { chinese: "便宜", pinyin: "pián yi", english: "cheap" },
      { chinese: "贵", pinyin: "guì", english: "expensive" },
      { chinese: "打折", pinyin: "dǎ zhé", english: "discount" },
      { chinese: "超市", pinyin: "chāo shì", english: "supermarket" },
      { chinese: "商场", pinyin: "shāng chǎng", english: "shopping mall" },
      { chinese: "试穿", pinyin: "shì chuān", english: "try on (clothes)" },
      { chinese: "退货", pinyin: "tuì huò", english: "return goods" }
    ],

    sentences: [
      { chinese: "这件衣服多少钱？", pinyin: "zhè jiàn yī fu duō shao qián?", english: "How much is this piece of clothing?" },
      { chinese: "太贵了，能便宜一点吗？", pinyin: "tài guì le, néng pián yi yī diǎn ma?", english: "Too expensive, can it be a bit cheaper?" },
      { chinese: "今天商场有打折活动。", pinyin: "jīn tiān shāng chǎng yǒu dǎ zhé huó dòng.", english: "The mall has a discount event today." },
      { chinese: "我可以试穿一下吗？", pinyin: "wǒ kě yǐ shì chuān yī xià ma?", english: "Can I try it on?" },
      { chinese: "这个超市的蔬菜很新鲜。", pinyin: "zhè gè chāo shì de shū cài hěn xīn xiān.", english: "The vegetables in this supermarket are very fresh." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你好，这种苹果怎么卖？", pinyin: "nǐ hǎo, zhè zhǒng píng guǒ zěn me mài?", english: "Hello, how much do these apples cost?" },
      { speaker: "B", chinese: "十元一斤。", pinyin: "shí yuán yī jīn.", english: "Ten yuan per jin." },
      { speaker: "A", chinese: "能便宜一点吗？", pinyin: "néng pián yi yī diǎn ma?", english: "Can it be a little cheaper?" },
      { speaker: "B", chinese: "如果你买两斤，可以九元一斤。", pinyin: "rú guǒ nǐ mǎi liǎng jīn, kě yǐ jiǔ yuán yī jīn.", english: "If you buy two jin, it can be nine yuan per jin." }
    ],

    exercises: [
      { type: "fill-blank", question: "这个包太___了，我不买了。", answer: "贵" },
      { type: "matching", pairs: [{ chinese: "买", pinyin: "mǎi", english: "buy" }, { chinese: "便宜", pinyin: "pián yi", english: "cheap" }], instruction: "Match the shopping term with English" },
      { type: "translation", vietnamese: "Cái này giá bao nhiêu?", chinese: "这个多少钱？", pinyin: "zhè gè duō shao qián?" }
    ],
  },
  {
    id: 18,
level: "A2",
    title: "情绪",
    pinyin: "qíng xù",
    topic: "Emotions",
    vocab: [
      { chinese: "开心", pinyin: "kāi xīn", english: "happy" },
      { chinese: "难过", pinyin: "nán guò", english: "sad" },
      { chinese: "生气", pinyin: "shēng qì", english: "angry" },
      { chinese: "害怕", pinyin: "hài pà", english: "afraid" },
      { chinese: "担心", pinyin: "dān xīn", english: "worried" },
      { chinese: "紧张", pinyin: "jǐn zhāng", english: "nervous" },
      { chinese: "兴奋", pinyin: "xīng fèn", english: "excited" },
      { chinese: "感动", pinyin: "gǎn dòng", english: "touched / moved" },
      { chinese: "无聊", pinyin: "wú liáo", english: "bored" },
      { chinese: "满意", pinyin: "mǎn yì", english: "satisfied" }
    ],

    sentences: [
      { chinese: "我今天很开心。", pinyin: "wǒ jīn tiān hěn kāi xīn.", english: "I am very happy today." },
      { chinese: "你为什么看起来这么难过？", pinyin: "nǐ wèi shén me kàn qǐ lái zhè me nán guò?", english: "Why do you look so sad?" },
      { chinese: "别生气，他只是在开玩笑。", pinyin: "bié shēng qì, tā zhǐ shì zài kāi wán xiào.", english: "Don't be angry, he's just joking." },
      { chinese: "考试之前我总是很紧张。", pinyin: "kǎo shì zhī qián wǒ zǒng shì hěn jǐn zhāng.", english: "I'm always nervous before exams." },
      { chinese: "收到你的信我很感动。", pinyin: "shōu dào nǐ de xìn wǒ hěn gǎn dòng.", english: "I was very touched to receive your letter." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你看起来不太开心，怎么了？", pinyin: "nǐ kàn qǐ lái bù tài kāi xīn, zěn me le?", english: "You don't look very happy. What's wrong?" },
      { speaker: "B", chinese: "我考试没考好，有点难过。", pinyin: "wǒ kǎo shì méi kǎo hǎo, yǒu diǎn nán guò.", english: "I didn't do well on the exam. I'm a bit sad." },
      { speaker: "A", chinese: "别担心，下次一定会更好。", pinyin: "bié dān xīn, xià cì yī dìng huì gèng hǎo.", english: "Don't worry, next time will definitely be better." },
      { speaker: "B", chinese: "谢谢你安慰我。", pinyin: "xiè xiè nǐ ān wèi wǒ.", english: "Thank you for comforting me." }
    ],

    exercises: [
      { type: "fill-blank", question: "收到礼物我很___。", answer: "开心" },
      { type: "matching", pairs: [{ chinese: "生气", pinyin: "shēng qì", english: "angry" }, { chinese: "紧张", pinyin: "jǐn zhāng", english: "nervous" }], instruction: "Match the emotion with English" },
      { type: "translation", vietnamese: "Tôi rất vui khi gặp bạn.", chinese: "见到你我很开心。", pinyin: "jiàn dào nǐ wǒ hěn kāi xīn." }
    ],
  },
  {
    id: 19,
level: "A2",
    title: "日常",
    pinyin: "rì cháng",
    topic: "Daily Routine",
    vocab: [
      { chinese: "起床", pinyin: "qǐ chuáng", english: "get up" },
      { chinese: "刷牙", pinyin: "shuā yá", english: "brush teeth" },
      { chinese: "洗澡", pinyin: "xǐ zǎo", english: "take a shower" },
      { chinese: "吃早饭", pinyin: "chī zǎo fàn", english: "eat breakfast" },
      { chinese: "上班", pinyin: "shàng bān", english: "go to work" },
      { chinese: "下班", pinyin: "xià bān", english: "get off work" },
      { chinese: "睡觉", pinyin: "shuì jiào", english: "sleep" },
      { chinese: "锻炼", pinyin: "duàn liàn", english: "exercise" },
      { chinese: "看电视", pinyin: "kàn diàn shì", english: "watch TV" },
      { chinese: "上网", pinyin: "shàng wǎng", english: "go online" }
    ],

    sentences: [
      { chinese: "我每天六点半起床。", pinyin: "wǒ měi tiān liù diǎn bàn qǐ chuáng.", english: "I get up at 6:30 every day." },
      { chinese: "吃完早饭后我去上班。", pinyin: "chī wán zǎo fàn hòu wǒ qù shàng bān.", english: "After eating breakfast I go to work." },
      { chinese: "下班后我喜欢去锻炼。", pinyin: "xià bān hòu wǒ xǐ huān qù duàn liàn.", english: "After work I like to exercise." },
      { chinese: "晚上我一般十一点睡觉。", pinyin: "wǎn shang wǒ yī bān shí yī diǎn shuì jiào.", english: "At night I usually sleep at 11." },
      { chinese: "周末我会多睡一会儿。", pinyin: "zhōu mò wǒ huì duō shuì yī huǐ er.", english: "On weekends I sleep in a bit." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你每天几点起床？", pinyin: "nǐ měi tiān jǐ diǎn qǐ chuáng?", english: "What time do you get up every day?" },
      { speaker: "B", chinese: "我六点起床，你呢？", pinyin: "wǒ liù diǎn qǐ chuáng, nǐ ne?", english: "I get up at six. What about you?" },
      { speaker: "A", chinese: "我七点起床。你起得真早。", pinyin: "wǒ qī diǎn qǐ chuáng. nǐ qǐ de zhēn zǎo.", english: "I get up at seven. You get up so early." },
      { speaker: "B", chinese: "是啊，我要先锻炼再吃早饭。", pinyin: "shì a, wǒ yào xiān duàn liàn zài chī zǎo fàn.", english: "Yeah, I exercise first then have breakfast." }
    ],

    exercises: [
      { type: "fill-blank", question: "早上我___早饭。", answer: "吃" },
      { type: "matching", pairs: [{ chinese: "起床", pinyin: "qǐ chuáng", english: "get up" }, { chinese: "睡觉", pinyin: "shuì jiào", english: "sleep" }], instruction: "Match the daily activity with English" },
      { type: "translation", vietnamese: "Tôi đi làm lúc 8 giờ.", chinese: "我八点去上班。", pinyin: "wǒ bā diǎn qù shàng bān." }
    ],
  },
  {
    id: 20,
level: "A2",
    title: "动词",
    pinyin: "dòng cí",
    topic: "Simple Verbs",
    vocab: [
      { chinese: "吃", pinyin: "chī", english: "eat" },
      { chinese: "喝", pinyin: "hē", english: "drink" },
      { chinese: "看", pinyin: "kàn", english: "see / look / watch" },
      { chinese: "听", pinyin: "tīng", english: "listen" },
      { chinese: "说", pinyin: "shuō", english: "speak / say" },
      { chinese: "读", pinyin: "dú", english: "read" },
      { chinese: "写", pinyin: "xiě", english: "write" },
      { chinese: "走", pinyin: "zǒu", english: "walk / go" },
      { chinese: "做", pinyin: "zuò", english: "do / make" },
      { chinese: "想", pinyin: "xiǎng", english: "think / want" }
    ],

    sentences: [
      { chinese: "我们去看电影吧。", pinyin: "wǒ men qù kàn diàn yǐng ba.", english: "Let's go watch a movie." },
      { chinese: "你喜欢吃什么？", pinyin: "nǐ xǐ huān chī shén me?", english: "What do you like to eat?" },
      { chinese: "她在写作业。", pinyin: "tā zài xiě zuò yè.", english: "She is doing homework." },
      { chinese: "你在听什么歌？", pinyin: "nǐ zài tīng shén me gē?", english: "What song are you listening to?" },
      { chinese: "我想学习中文。", pinyin: "wǒ xiǎng xué xí zhōng wén.", english: "I want to learn Chinese." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你在做什么？", pinyin: "nǐ zài zuò shén me?", english: "What are you doing?" },
      { speaker: "B", chinese: "我在看书。你喜欢看书吗？", pinyin: "wǒ zài kàn shū. nǐ xǐ huān kàn shū ma?", english: "I'm reading a book. Do you like reading?" },
      { speaker: "A", chinese: "喜欢，但我更喜欢看电影。", pinyin: "xǐ huān, dàn wǒ gèng xǐ huān kàn diàn yǐng.", english: "Yes, but I prefer watching movies." },
      { speaker: "B", chinese: "那我们周末一起看电影吧。", pinyin: "nà wǒ men zhōu mò yī qǐ kàn diàn yǐng ba.", english: "Then let's watch a movie together this weekend." }
    ],

    exercises: [
      { type: "fill-blank", question: "我想___一杯水。", answer: "喝" },
      { type: "matching", pairs: [{ chinese: "说", pinyin: "shuō", english: "speak" }, { chinese: "写", pinyin: "xiě", english: "write" }], instruction: "Match the verb with English" },
      { type: "translation", vietnamese: "Tôi muốn học tiếng Trung.", chinese: "我想学习中文。", pinyin: "wǒ xiǎng xué xí zhōng wén." }
    ],
  },
  {
    id: 21,
level: "A2",
    title: "打电话",
    pinyin: "dǎ diàn huà",
    topic: "Making Phone Calls",
    vocab: [
      { chinese: "电话", pinyin: "diàn huà", english: "telephone" },
      { chinese: "打", pinyin: "dǎ", english: "to call" },
      { chinese: "接", pinyin: "jiē", english: "to answer (phone)" },
      { chinese: "挂", pinyin: "guà", english: "to hang up" },
      { chinese: "号码", pinyin: "hào mǎ", english: "number" },
      { chinese: "留言", pinyin: "liú yán", english: "leave a message" },
      { chinese: "回电", pinyin: "huí diàn", english: "call back" },
      { chinese: "占线", pinyin: "zhàn xiàn", english: "line busy" },
      { chinese: "拨号", pinyin: "bō hào", english: "to dial" },
      { chinese: "信号", pinyin: "xìn hào", english: "signal" }
    ],

    sentences: [
      { chinese: "请稍等一下，我接个电话。", pinyin: "qǐng shāo děng yī xià, wǒ jiē gè diàn huà.", english: "Please wait a moment, I need to answer a call." },
      { chinese: "对不起，您拨的号码是空号。", pinyin: "duì bu qǐ, nín bō de hào mǎ shì kōng hào.", english: "Sorry, the number you dialed is not in service." },
      { chinese: "我会尽快回电给你。", pinyin: "wǒ huì jǐn kuài huí diàn gěi nǐ.", english: "I will call you back as soon as possible." },
      { chinese: "这里信号不好，我听不清。", pinyin: "zhè lǐ xìn hào bù hǎo, wǒ tīng bù qīng.", english: "The signal here is bad, I can't hear clearly." },
      { chinese: "请帮我转接分机123。", pinyin: "qǐng bāng wǒ zhuǎn jiē fēn jī yī èr sān.", english: "Please transfer me to extension 123." }
    ],

    dialogue: [
      { speaker: "A", chinese: "喂，你好。请问是李经理吗？", pinyin: "wéi, nǐ hǎo. qǐng wèn shì lǐ jīng lǐ ma?", english: "Hello, is this Manager Li?" },
      { speaker: "B", chinese: "是的，我是。您是哪位？", pinyin: "shì de, wǒ shì. nín shì nǎ wèi?", english: "Yes, this is he. Who is speaking?" },
      { speaker: "A", chinese: "我是张华，想跟您确认一下会议时间。", pinyin: "wǒ shì zhāng huá, xiǎng gēn nín què rèn yī xià huì yì shí jiān.", english: "This is Zhang Hua, I'd like to confirm the meeting time with you." },
      { speaker: "B", chinese: "好的，你十分钟后打过来好吗？我现在有点忙。", pinyin: "hǎo de, nǐ shí fēn zhōng hòu dǎ guò lái hǎo ma? wǒ xiàn zài yǒu diǎn máng.", english: "Okay, can you call back in ten minutes? I'm a bit busy now." },
    ],

    exercises: [
      { type: "fill-blank", question: "请帮我___电话给王先生。", answer: "打" },
      { type: "matching", pairs: [{ chinese: "占线", pinyin: "zhàn xiàn", english: "line busy" }, { chinese: "回电", pinyin: "huí diàn", english: "call back" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Xin lỗi, số máy bạn gọi hiện đang bận.", chinese: "对不起，您拨的电话正在通话中。", pinyin: "duì bu qǐ, nín bō de diàn huà zhèng zài tōng huà zhōng." }
    ],
  },
  {
    id: 22,
level: "A2",
    title: "写邮件",
    pinyin: "xiě yóu jiàn",
    topic: "Writing Emails",
    vocab: [
      { chinese: "邮件", pinyin: "yóu jiàn", english: "email" },
      { chinese: "收件人", pinyin: "shōu jiàn rén", english: "recipient" },
      { chinese: "主题", pinyin: "zhǔ tí", english: "subject" },
      { chinese: "附件", pinyin: "fù jiàn", english: "attachment" },
      { chinese: "抄送", pinyin: "chāo sòng", english: "CC (carbon copy)" },
      { chinese: "回复", pinyin: "huí fù", english: "reply" },
      { chinese: "转发", pinyin: "zhuǎn fā", english: "forward" },
      { chinese: "草稿", pinyin: "cǎo gǎo", english: "draft" },
      { chinese: "发送", pinyin: "fā sòng", english: "send" },
      { chinese: "收件箱", pinyin: "shōu jiàn xiāng", english: "inbox" }
    ],

    sentences: [
      { chinese: "请查收附件中的文件。", pinyin: "qǐng chá shōu fù jiàn zhōng de wén jiàn.", english: "Please find the attached file." },
      { chinese: "麻烦您在周五前回复。", pinyin: "má fan nín zài zhōu wǔ qián huí fù.", english: "Please reply by Friday." },
      { chinese: "这封邮件我想抄送给经理。", pinyin: "zhè fēng yóu jiàn wǒ xiǎng chāo sòng gěi jīng lǐ.", english: "I want to CC this email to the manager." },
      { chinese: "请帮我转发给所有员工。", pinyin: "qǐng bāng wǒ zhuǎn fā gěi suǒ yǒu yuán gōng.", english: "Please forward this to all employees." },
      { chinese: "你的邮件我收到了，谢谢。", pinyin: "nǐ de yóu jiàn wǒ shōu dào le, xiè xiè.", english: "I received your email, thank you." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你好，我收到了你的邮件。附件打不开。", pinyin: "nǐ hǎo, wǒ shōu dào le nǐ de yóu jiàn. fù jiàn dǎ bù kāi.", english: "Hello, I received your email. The attachment won't open." },
      { speaker: "B", chinese: "抱歉，可能是格式问题。我重新发一次PDF的。", pinyin: "bào qiàn, kě néng shì gé shì wèn tí. wǒ chóng xīn fā yī cì PDF de.", english: "Sorry, it might be a format issue. I'll resend it as a PDF." },
      { speaker: "A", chinese: "好的，谢谢。另外主题行好像写错了。", pinyin: "hǎo de, xiè xiè. lìng wài zhǔ tí háng hǎo xiàng xiě cuò le.", english: "Okay, thanks. Also, the subject line seems wrong." },
      { speaker: "B", chinese: "哦，我马上修改后再发一遍。", pinyin: "ò, wǒ mǎ shàng xiū gǎi hòu zài fā yī biàn.", english: "Oh, I'll revise it and send again right away." },
    ],

    exercises: [
      { type: "fill-blank", question: "请把文件作为___发送。", answer: "附件" },
      { type: "matching", pairs: [{ chinese: "收件人", pinyin: "shōu jiàn rén", english: "recipient" }, { chinese: "抄送", pinyin: "chāo sòng", english: "CC" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Tôi sẽ gửi email cho bạn vào ngày mai.", chinese: "我明天会把邮件发给你。", pinyin: "wǒ míng tiān huì bǎ yóu jiàn fā gěi nǐ." }
    ],
  },
  {
    id: 23,
level: "A2",
    title: "在银行",
    pinyin: "zài yín háng",
    topic: "At the Bank",
    vocab: [
      { chinese: "银行", pinyin: "yín háng", english: "bank" },
      { chinese: "账户", pinyin: "zhàng hù", english: "account" },
      { chinese: "存款", pinyin: "cún kuǎn", english: "deposit" },
      { chinese: "取款", pinyin: "qǔ kuǎn", english: "withdraw" },
      { chinese: "汇款", pinyin: "huì kuǎn", english: "remittance / transfer" },
      { chinese: "利率", pinyin: "lì lǜ", english: "interest rate" },
      { chinese: "密码", pinyin: "mì mǎ", english: "PIN / password" },
      { chinese: "柜台", pinyin: "guì tái", english: "counter" },
      { chinese: "自动取款机", pinyin: "zì dòng qǔ kuǎn jī", english: "ATM" },
      { chinese: "兑换", pinyin: "duì huàn", english: "exchange (currency)" }
    ],

    sentences: [
      { chinese: "我要开一个储蓄账户。", pinyin: "wǒ yào kāi yī gè chǔ xù zhàng hù.", english: "I'd like to open a savings account." },
      { chinese: "请问汇款需要手续费吗？", pinyin: "qǐng wèn huì kuǎn xū yào shǒu xù fèi ma?", english: "Is there a fee for transferring money?" },
      { chinese: "我的密码忘了，可以重置吗？", pinyin: "wǒ de mì mǎ wàng le, kě yǐ chóng zhì ma?", english: "I forgot my PIN, can I reset it?" },
      { chinese: "今天人民币对美元的汇率是多少？", pinyin: "jīn tiān rén mín bì duì měi yuán de huì lǜ shì duō shǎo?", english: "What is today's RMB to USD exchange rate?" },
      { chinese: "请帮我取两千元。", pinyin: "qǐng bāng wǒ qǔ liǎng qiān yuán.", english: "Please help me withdraw 2000 yuan." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你好，我想开一个银行账户。", pinyin: "nǐ hǎo, wǒ xiǎng kāi yī gè yín háng zhàng hù.", english: "Hello, I'd like to open a bank account." },
      { speaker: "B", chinese: "好的，请问您要开什么类型的账户？", pinyin: "hǎo de, qǐng wèn nín yào kāi shén me lèi xíng de zhàng hù?", english: "Okay, what type of account would you like to open?" },
      { speaker: "A", chinese: "储蓄账户，可以吗？", pinyin: "chǔ xù zhàng hù, kě yǐ ma?", english: "A savings account, is that okay?" },
      { speaker: "B", chinese: "没问题。请出示您的身份证和填写这张表格。", pinyin: "méi wèn tí. qǐng chū shì nín de shēn fèn zhèng hé tián xiě zhè zhāng biǎo gé.", english: "No problem. Please show your ID and fill out this form." },
    ],

    exercises: [
      { type: "fill-blank", question: "我想___换一些美元。", answer: "兑" },
      { type: "matching", pairs: [{ chinese: "存款", pinyin: "cún kuǎn", english: "deposit" }, { chinese: "取款", pinyin: "qǔ kuǎn", english: "withdraw" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Tôi muốn chuyển khoản 500 đô la Mỹ.", chinese: "我想汇款五百美元。", pinyin: "wǒ xiǎng huì kuǎn wǔ bǎi měi yuán." }
    ],
  },
  {
    id: 24,
level: "A2",
    title: "在邮局",
    pinyin: "zài yóu jú",
    topic: "At the Post Office",
    vocab: [
      { chinese: "邮局", pinyin: "yóu jú", english: "post office" },
      { chinese: "邮票", pinyin: "yóu piào", english: "stamp" },
      { chinese: "信封", pinyin: "xìn fēng", english: "envelope" },
      { chinese: "包裹", pinyin: "bāo guǒ", english: "parcel" },
      { chinese: "挂号信", pinyin: "guà hào xìn", english: "registered mail" },
      { chinese: "平信", pinyin: "píng xìn", english: "ordinary mail" },
      { chinese: "快递", pinyin: "kuài dì", english: "express delivery" },
      { chinese: "邮费", pinyin: "yóu fèi", english: "postage" },
      { chinese: "寄信", pinyin: "jì xìn", english: "send a letter" },
      { chinese: "收信", pinyin: "shōu xìn", english: "receive a letter" }
    ],

    sentences: [
      { chinese: "我要寄一个包裹到越南。", pinyin: "wǒ yào jì yī gè bāo guǒ dào yuè nán.", english: "I want to send a parcel to Vietnam." },
      { chinese: "请问寄往中国的平信需要多少邮费？", pinyin: "qǐng wèn jì wǎng zhōng guó de píng xìn xū yào duō shǎo yóu fèi?", english: "How much is the postage for an ordinary letter to China?" },
      { chinese: "这封信请用挂号信寄。", pinyin: "zhè fēng xìn qǐng yòng guà hào xìn jì.", english: "Please send this letter by registered mail." },
      { chinese: "我需要买十张八毛钱的邮票。", pinyin: "wǒ xū yào mǎi shí zhāng bā máo qián de yóu piào.", english: "I need to buy ten stamps at 80 fen each." },
      { chinese: "这个包裹几天能到？", pinyin: "zhè gè bāo guǒ jǐ tiān néng dào?", english: "How many days will this parcel take to arrive?" }
    ],

    dialogue: [
      { speaker: "A", chinese: "你好，我想寄一个包裹。", pinyin: "nǐ hǎo, wǒ xiǎng jì yī gè bāo guǒ.", english: "Hello, I want to send a parcel." },
      { speaker: "B", chinese: "好的，请把包裹放在秤上。寄到哪里？", pinyin: "hǎo de, qǐng bǎ bāo guǒ fàng zài chèng shàng. jì dào nǎ lǐ?", english: "Okay, please put the parcel on the scale. Where to?" },
      { speaker: "A", chinese: "寄到越南河内。", pinyin: "jì dào yuè nán hé nèi.", english: "To Hanoi, Vietnam." },
      { speaker: "B", chinese: "运费是六十元。请填写这个表格。", pinyin: "yùn fèi shì liù shí yuán. qǐng tián xiě zhè gè biǎo gé.", english: "The shipping cost is 60 yuan. Please fill out this form." },
    ],

    exercises: [
      { type: "fill-blank", question: "我要___一封信到国外。", answer: "寄" },
      { type: "matching", pairs: [{ chinese: "挂号信", pinyin: "guà hào xìn", english: "registered mail" }, { chinese: "快递", pinyin: "kuài dì", english: "express delivery" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Tôi cần mua tem để gửi thư này.", chinese: "我需要买邮票寄这封信。", pinyin: "wǒ xū yào mǎi yóu piào jì zhè fēng xìn." }
    ],
  },
  {
    id: 25,
level: "A2",
    title: "租房子",
    pinyin: "zū fáng zi",
    topic: "Renting an Apartment",
    vocab: [
      { chinese: "租房", pinyin: "zū fáng", english: "rent a house" },
      { chinese: "房东", pinyin: "fáng dōng", english: "landlord" },
      { chinese: "租金", pinyin: "zū jīn", english: "rent" },
      { chinese: "押金", pinyin: "yā jīn", english: "deposit" },
      { chinese: "签约", pinyin: "qiān yuē", english: "sign a contract" },
      { chinese: "户型", pinyin: "hù xíng", english: "layout / unit type" },
      { chinese: "家具", pinyin: "jiā jù", english: "furniture" },
      { chinese: "水电费", pinyin: "shuǐ diàn fèi", english: "utilities (water and electricity)" },
      { chinese: "中介", pinyin: "zhōng jiè", english: "agency" },
      { chinese: "看房", pinyin: "kàn fáng", english: "view a property" }
    ],

    sentences: [
      { chinese: "我想租一个一室一厅的公寓。", pinyin: "wǒ xiǎng zū yī gè yī shì yī tīng de gōng yù.", english: "I want to rent a one-bedroom apartment." },
      { chinese: "请问租金包含水电费吗？", pinyin: "qǐng wèn zū jīn bāo hán shuǐ diàn fèi ma?", english: "Does the rent include utilities?" },
      { chinese: "押金是两个月的租金。", pinyin: "yā jīn shì liǎng gè yuè de zū jīn.", english: "The deposit is two months' rent." },
      { chinese: "我想先看房再决定。", pinyin: "wǒ xiǎng xiān kàn fáng zài jué dìng.", english: "I'd like to view the apartment before deciding." },
      { chinese: "合同签一年可以吗？", pinyin: "hé tóng qiān yī nián kě yǐ ma?", english: "Is it okay to sign a one-year contract?" }
    ],

    dialogue: [
      { speaker: "A", chinese: "你好，我在网上看到你有房子要出租。", pinyin: "nǐ hǎo, wǒ zài wǎng shàng kàn dào nǐ yǒu fáng zi yào chū zū.", english: "Hello, I saw online that you have a house for rent." },
      { speaker: "B", chinese: "是的，请问你想看哪一套？", pinyin: "shì de, qǐng wèn nǐ xiǎng kàn nǎ yī tào?", english: "Yes, which one would you like to see?" },
      { speaker: "A", chinese: "那个两室一厅的，月租三千的。", pinyin: "nà gè liǎng shì yī tīng de, yuè zū sān qiān de.", english: "The two-bedroom one with a monthly rent of 3000." },
      { speaker: "B", chinese: "好的，明天下午两点可以看房吗？", pinyin: "hǎo de, míng tiān xià wǔ liǎng diǎn kě yǐ kàn fáng ma?", english: "Okay, can you come at 2 PM tomorrow to view it?" },
    ],

    exercises: [
      { type: "fill-blank", question: "租房要交两个月___金。", answer: "押" },
      { type: "matching", pairs: [{ chinese: "租金", pinyin: "zū jīn", english: "rent" }, { chinese: "押金", pinyin: "yā jīn", english: "deposit" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Tôi muốn thuê một căn hộ gần trung tâm thành phố.", chinese: "我想租一个靠近市中心的公寓。", pinyin: "wǒ xiǎng zū yī gè kào jìn shì zhōng xīn de gōng yù." }
    ],
  },
  {
    id: 26,
level: "A2",
    title: "投诉与退货",
    pinyin: "tóu sù yǔ tuì huò",
    topic: "Complaints and Returns",
    vocab: [
      { chinese: "投诉", pinyin: "tóu sù", english: "complaint" },
      { chinese: "退货", pinyin: "tuì huò", english: "return goods" },
      { chinese: "退款", pinyin: "tuì kuǎn", english: "refund" },
      { chinese: "换货", pinyin: "huàn huò", english: "exchange" },
      { chinese: "质量问题", pinyin: "zhì liàng wèn tí", english: "quality issue" },
      { chinese: "发票", pinyin: "fā piào", english: "invoice / receipt" },
      { chinese: "保修期", pinyin: "bǎo xiū qī", english: "warranty period" },
      { chinese: "客服", pinyin: "kè fú", english: "customer service" },
      { chinese: "破损", pinyin: "pò sǔn", english: "damaged" },
      { chinese: "不满意", pinyin: "bù mǎn yì", english: "dissatisfied" }
    ],

    sentences: [
      { chinese: "我买的产品有质量问题，我想退货。", pinyin: "wǒ mǎi de chǎn pǐn yǒu zhì liàng wèn tí, wǒ xiǎng tuì huò.", english: "The product I bought has a quality issue, I want to return it." },
      { chinese: "请问退货需要提供发票吗？", pinyin: "qǐng wèn tuì huò xū yào tí gōng fā piào ma?", english: "Do I need to provide an invoice for a return?" },
      { chinese: "这件衣服我穿了不合身，能换一件吗？", pinyin: "zhè jiàn yī fú wǒ chuān le bù hé shēn, néng huàn yī jiàn ma?", english: "This clothing doesn't fit, can I exchange it?" },
      { chinese: "你们的服务太差了，我要投诉。", pinyin: "nǐ men de fú wù tài chà le, wǒ yào tóu sù.", english: "Your service is terrible, I want to complain." },
      { chinese: "退款会在七个工作日内到账。", pinyin: "tuì kuǎn huì zài qī gè gōng zuò rì nèi dào zhàng.", english: "The refund will be credited within seven business days." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你好，我昨天在这里买的手机有毛病。", pinyin: "nǐ hǎo, wǒ zuó tiān zài zhè lǐ mǎi de shǒu jī yǒu máo bìng.", english: "Hello, the phone I bought here yesterday has a problem." },
      { speaker: "B", chinese: "不好意思，请问是什么问题？", pinyin: "bù hǎo yì si, qǐng wèn shì shén me wèn tí?", english: "I'm sorry, what is the problem?" },
      { speaker: "A", chinese: "屏幕经常黑屏，我想退款。", pinyin: "píng mù jīng cháng hēi píng, wǒ xiǎng tuì kuǎn.", english: "The screen goes black often, I want a refund." },
      { speaker: "B", chinese: "我帮您检查一下，如果在保修期内可以免费维修或换货。", pinyin: "wǒ bāng nín jiǎn chá yī xià, rú guǒ zài bǎo xiū qī nèi kě yǐ miǎn fèi wéi xiū huò huàn huò.", english: "Let me check for you. If it's under warranty, we can repair or exchange it for free." },
    ],

    exercises: [
      { type: "fill-blank", question: "我想___这件商品。", answer: "退货" },
      { type: "matching", pairs: [{ chinese: "投诉", pinyin: "tóu sù", english: "complaint" }, { chinese: "退款", pinyin: "tuì kuǎn", english: "refund" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Tôi không hài lòng với chất lượng sản phẩm.", chinese: "我对产品质量不满意。", pinyin: "wǒ duì chǎn pǐn zhì liàng bù mǎn yì." }
    ],
  },
  {
    id: 27,
level: "A2",
    title: "详细指路",
    pinyin: "xiáng xì zhǐ lù",
    topic: "Giving Detailed Directions",
    vocab: [
      { chinese: "指路", pinyin: "zhǐ lù", english: "give directions" },
      { chinese: "十字路口", pinyin: "shí zì lù kǒu", english: "crossroads" },
      { chinese: "红绿灯", pinyin: "hóng lǜ dēng", english: "traffic light" },
      { chinese: "拐弯", pinyin: "guǎi wān", english: "turn" },
      { chinese: "直走", pinyin: "zhí zǒu", english: "go straight" },
      { chinese: "左边", pinyin: "zuǒ biān", english: "left side" },
      { chinese: "右边", pinyin: "yòu biān", english: "right side" },
      { chinese: "对面", pinyin: "duì miàn", english: "opposite side" },
      { chinese: "附近", pinyin: "fù jìn", english: "nearby" },
      { chinese: "路口", pinyin: "lù kǒu", english: "intersection" }
    ],

    sentences: [
      { chinese: "一直往前走，到第二个红绿灯左拐。", pinyin: "yī zhí wǎng qián zǒu, dào dì èr gè hóng lǜ dēng zuǒ guǎi.", english: "Go straight ahead, turn left at the second traffic light." },
      { chinese: "邮局就在银行对面。", pinyin: "yóu jú jiù zài yín háng duì miàn.", english: "The post office is opposite the bank." },
      { chinese: "过了十字路口，你会看到一家超市。", pinyin: "guò le shí zì lù kǒu, nǐ huì kàn dào yī jiā chāo shì.", english: "After crossing the intersection, you will see a supermarket." },
      { chinese: "从这条街一直走，在第三个路口右拐。", pinyin: "cóng zhè tiáo jiē yī zhí zǒu, zài dì sān gè lù kǒu yòu guǎi.", english: "Walk along this street, turn right at the third intersection." },
      { chinese: "图书馆就在你左边的那栋楼里。", pinyin: "tú shū guǎn jiù zài nǐ zuǒ biān de nà dòng lóu lǐ.", english: "The library is in the building on your left." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你好，请问去火车站怎么走？", pinyin: "nǐ hǎo, qǐng wèn qù huǒ chē zhàn zěn me zǒu?", english: "Hello, how do I get to the train station?" },
      { speaker: "B", chinese: "你直走，到那个大十字路口右转。", pinyin: "nǐ zhí zǒu, dào nà gè dà shí zì lù kǒu yòu zhuǎn.", english: "Go straight, turn right at the big crossroads." },
      { speaker: "A", chinese: "然后呢？", pinyin: "rán hòu ne?", english: "Then what?" },
      { speaker: "B", chinese: "再走大概五分钟，你就会看到火车站在你的左边。", pinyin: "zài zǒu dà gài wǔ fēn zhōng, nǐ jiù huì kàn dào huǒ chē zhàn zài nǐ de zuǒ biān.", english: "Then walk about five more minutes, and you'll see the train station on your left." },
    ],

    exercises: [
      { type: "fill-blank", question: "请在这个路口右___。", answer: "拐" },
      { type: "matching", pairs: [{ chinese: "红绿灯", pinyin: "hóng lǜ dēng", english: "traffic light" }, { chinese: "十字路口", pinyin: "shí zì lù kǒu", english: "crossroads" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Đi thẳng đến ngã tư rồi rẽ trái.", chinese: "直走到十字路口然后左转。", pinyin: "zhí zǒu dào shí zì lù kǒu rán hòu zuǒ zhuǎn." }
    ],
  },
  {
    id: 28,
level: "A2",
    title: "讨论新闻",
    pinyin: "tǎo lùn xīn wén",
    topic: "Discussing News",
    vocab: [
      { chinese: "新闻", pinyin: "xīn wén", english: "news" },
      { chinese: "头条", pinyin: "tóu tiáo", english: "headline" },
      { chinese: "报道", pinyin: "bào dào", english: "report" },
      { chinese: "事件", pinyin: "shì jiàn", english: "event" },
      { chinese: "记者", pinyin: "jì zhě", english: "journalist" },
      { chinese: "采访", pinyin: "cǎi fǎng", english: "interview" },
      { chinese: "直播", pinyin: "zhí bō", english: "live broadcast" },
      { chinese: "热点", pinyin: "rè diǎn", english: "hot topic" },
      { chinese: "评论", pinyin: "píng lùn", english: "comment" },
      { chinese: "关注", pinyin: "guān zhù", english: "follow / pay attention to" }
    ],

    sentences: [
      { chinese: "今天头条新闻是什么？", pinyin: "jīn tiān tóu tiáo xīn wén shì shén me?", english: "What is today's headline news?" },
      { chinese: "这篇文章报道了最新的科技进展。", pinyin: "zhè piān wén zhāng bào dào le zuì xīn de kē jì jìn zhǎn.", english: "This article reports the latest technological progress." },
      { chinese: "你对这个事件的看法是什么？", pinyin: "nǐ duì zhè gè shì jiàn de kàn fǎ shì shén me?", english: "What is your opinion on this event?" },
      { chinese: "新闻里说今天会有大雨。", pinyin: "xīn wén lǐ shuō jīn tiān huì yǒu dà yǔ.", english: "The news says there will be heavy rain today." },
      { chinese: "这条新闻引起了广泛关注。", pinyin: "zhè tiáo xīn wén yǐn qǐ le guǎng fàn guān zhù.", english: "This news has attracted widespread attention." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你看到今天的热点新闻了吗？", pinyin: "nǐ kàn dào jīn tiān de rè diǎn xīn wén le ma?", english: "Did you see today's hot news?" },
      { speaker: "B", chinese: "看到了，是关于气候变化大会的。", pinyin: "kàn dào le, shì guān yú qì hòu biàn huà dà huì de.", english: "Yes, it's about the climate change conference." },
      { speaker: "A", chinese: "我觉得政府应该采取更多措施。", pinyin: "wǒ jué de zhèng fǔ yīng gāi cǎi qǔ gèng duō cuò shī.", english: "I think the government should take more measures." },
      { speaker: "B", chinese: "是啊，每个人都应该关注这个问题。", pinyin: "shì a, měi gè rén dōu yīng gāi guān zhù zhè gè wèn tí.", english: "Yes, everyone should pay attention to this issue." },
    ],

    exercises: [
      { type: "fill-blank", question: "今天的___新闻是关于环境保护的。", answer: "热点" },
      { type: "matching", pairs: [{ chinese: "报道", pinyin: "bào dào", english: "report" }, { chinese: "评论", pinyin: "píng lùn", english: "comment" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Bạn có tin tức gì mới không?", chinese: "你有什么新消息吗？", pinyin: "nǐ yǒu shén me xīn xiāo xi ma?" }
    ],
  },
  {
    id: 29,
level: "A2",
    title: "文化差异",
    pinyin: "wén huà chā yì",
    topic: "Cultural Differences",
    vocab: [
      { chinese: "文化", pinyin: "wén huà", english: "culture" },
      { chinese: "差异", pinyin: "chā yì", english: "difference" },
      { chinese: "习俗", pinyin: "xí sú", english: "custom" },
      { chinese: "传统", pinyin: "chuán tǒng", english: "tradition" },
      { chinese: "价值观", pinyin: "jià zhí guān", english: "values" },
      { chinese: "禁忌", pinyin: "jìn jì", english: "taboo" },
      { chinese: "礼仪", pinyin: "lǐ yí", english: "etiquette" },
      { chinese: "问候", pinyin: "wèn hòu", english: "greeting" },
      { chinese: "餐桌礼仪", pinyin: "cān zhuō lǐ yí", english: "table manners" },
      { chinese: "谦虚", pinyin: "qiān xū", english: "modesty" }
    ],

    sentences: [
      { chinese: "在中国，人们见面时通常会握手。", pinyin: "zài zhōng guó, rén men jiàn miàn shí tōng cháng huì wò shǒu.", english: "In China, people usually shake hands when they meet." },
      { chinese: "越南和中国的饮食习惯有很多相似之处。", pinyin: "yuè nán hé zhōng guó de yǐn shí xí guàn yǒu hěn duō xiāng sì zhī chù.", english: "There are many similarities in eating habits between Vietnam and China." },
      { chinese: "送礼物时要注意对方的禁忌。", pinyin: "sòng lǐ wù shí yào zhù yì duì fāng de jìn jì.", english: "When giving gifts, be mindful of the other person's taboos." },
      { chinese: "在中国，用筷子指人是不礼貌的。", pinyin: "zài zhōng guó, yòng kuài zi zhǐ rén shì bù lǐ mào de.", english: "In China, pointing at someone with chopsticks is rude." },
      { chinese: "谦虚是中国文化中的重要品质。", pinyin: "qiān xū shì zhōng guó wén huà zhōng de zhòng yào pǐn zhì.", english: "Modesty is an important quality in Chinese culture." }
    ],

    dialogue: [
      { speaker: "A", chinese: "我发现越南和中国有很多文化差异。", pinyin: "wǒ fā xiàn yuè nán hé zhōng guó yǒu hěn duō wén huà chā yì.", english: "I found that there are many cultural differences between Vietnam and China." },
      { speaker: "B", chinese: "是啊，比如在越南，人们见面习惯鞠躬。", pinyin: "shì a, bǐ rú zài yuè nán, rén men jiàn miàn xí guàn jū gōng.", english: "Yes, for example in Vietnam, people tend to bow when they meet." },
      { speaker: "A", chinese: "在中国，点头和微笑更常见。", pinyin: "zài zhōng guó, diǎn tóu hé wēi xiào gèng cháng jiàn.", english: "In China, nodding and smiling are more common." },
      { speaker: "B", chinese: "了解这些差异能帮助我们更好地沟通。", pinyin: "liǎo jiě zhè xiē chā yì néng bāng zhù wǒ men gèng hǎo dì gōu tōng.", english: "Understanding these differences can help us communicate better." },
    ],

    exercises: [
      { type: "fill-blank", question: "在不同的文化中，___观念可能不同。", answer: "价值" },
      { type: "matching", pairs: [{ chinese: "习俗", pinyin: "xí sú", english: "custom" }, { chinese: "礼仪", pinyin: "lǐ yí", english: "etiquette" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Sự khác biệt văn hóa rất thú vị.", chinese: "文化差异很有趣。", pinyin: "wén huà chā yì hěn yǒu qù." }
    ],
  },
  {
    id: 30,
level: "A2",
    title: "面试",
    pinyin: "miàn shì",
    topic: "Job Interviews",
    vocab: [
      { chinese: "面试", pinyin: "miàn shì", english: "interview" },
      { chinese: "简历", pinyin: "jiǎn lì", english: "resume" },
      { chinese: "职位", pinyin: "zhí wèi", english: "position" },
      { chinese: "面试官", pinyin: "miàn shì guān", english: "interviewer" },
      { chinese: "应聘者", pinyin: "yìng pìn zhě", english: "applicant" },
      { chinese: "特长", pinyin: "tè cháng", english: "strength / specialty" },
      { chinese: "经验", pinyin: "jīng yàn", english: "experience" },
      { chinese: "学历", pinyin: "xué lì", english: "education background" },
      { chinese: "工资", pinyin: "gōng zī", english: "salary" },
      { chinese: "录用", pinyin: "lù yòng", english: "hire" }
    ],

    sentences: [
      { chinese: "请简单介绍一下你自己。", pinyin: "qǐng jiǎn dān jiè shào yī xià nǐ zì jǐ.", english: "Please briefly introduce yourself." },
      { chinese: "你为什么想加入我们公司？", pinyin: "nǐ wèi shén me xiǎng jiā rù wǒ men gōng sī?", english: "Why do you want to join our company?" },
      { chinese: "我有多年的销售经验。", pinyin: "wǒ yǒu duō nián de xiāo shòu jīng yàn.", english: "I have many years of sales experience." },
      { chinese: "你的弱点是什么？", pinyin: "nǐ de ruò diǎn shì shén me?", english: "What are your weaknesses?" },
      { chinese: "面试后我会尽快通知你结果。", pinyin: "miàn shì hòu wǒ huì jǐn kuài tōng zhī nǐ jié guǒ.", english: "I will inform you of the result as soon as possible after the interview." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你好，我是来面试市场部经理的。", pinyin: "nǐ hǎo, wǒ shì lái miàn shì shì chǎng bù jīng lǐ de.", english: "Hello, I'm here for the marketing manager interview." },
      { speaker: "B", chinese: "请坐。请先做个自我介绍。", pinyin: "qǐng zuò. qǐng xiān zuò gè zì wǒ jiè shào.", english: "Please have a seat. First, please introduce yourself." },
      { speaker: "A", chinese: "我叫陈明，有五年市场营销经验。", pinyin: "wǒ jiào chén míng, yǒu wǔ nián shì chǎng yíng xiāo jīng yàn.", english: "My name is Chen Ming, I have five years of marketing experience." },
      { speaker: "B", chinese: "好的，那你能谈谈你最大的成就吗？", pinyin: "hǎo de, nà nǐ néng tán tán nǐ zuì dà de chéng jiù ma?", english: "Okay, can you talk about your greatest achievement?" },
    ],

    exercises: [
      { type: "fill-blank", question: "请把你的___递给我。", answer: "简历" },
      { type: "matching", pairs: [{ chinese: "面试官", pinyin: "miàn shì guān", english: "interviewer" }, { chinese: "应聘者", pinyin: "yìng pìn zhě", english: "applicant" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Tôi có kinh nghiệm làm việc trong lĩnh vực tài chính.", chinese: "我有金融领域的工作经验。", pinyin: "wǒ yǒu jīn róng lǐng yù de gōng zuò jīng yàn." }
    ],
  },
  {
    id: 31,
level: "B1",
    title: "商务会议",
    pinyin: "shāng wù huì yì",
    topic: "Business Meetings",
    vocab: [
      { chinese: "会议", pinyin: "huì yì", english: "meeting" },
      { chinese: "议程", pinyin: "yì chéng", english: "agenda" },
      { chinese: "讨论", pinyin: "tǎo lùn", english: "discussion" },
      { chinese: "提案", pinyin: "tí àn", english: "proposal" },
      { chinese: "决策", pinyin: "jué cè", english: "decision" },
      { chinese: "会议室", pinyin: "huì yì shì", english: "meeting room" },
      { chinese: "幻灯片", pinyin: "huàn dēng piàn", english: "slides" },
      { chinese: "记录", pinyin: "jì lù", english: "minutes / notes" },
      { chinese: "主持人", pinyin: "zhǔ chí rén", english: "moderator" },
      { chinese: "参会者", pinyin: "cān huì zhě", english: "participant" }
    ],

    sentences: [
      { chinese: "会议将在下午两点开始。", pinyin: "huì yì jiāng zài xià wǔ liǎng diǎn kāi shǐ.", english: "The meeting will start at 2 PM." },
      { chinese: "请大家先看一下今天的议程。", pinyin: "qǐng dà jiā xiān kàn yī xià jīn tiān de yì chéng.", english: "Please take a look at today's agenda first." },
      { chinese: "这个提案还需要进一步讨论。", pinyin: "zhè gè tí àn hái xū yào jìn yī bù tǎo lùn.", english: "This proposal needs further discussion." },
      { chinese: "谁来做会议记录？", pinyin: "shuí lái zuò huì yì jì lù?", english: "Who will take the meeting minutes?" },
      { chinese: "我们最后达成了一致。", pinyin: "wǒ men zuì hòu dá chéng le yī zhì.", english: "We finally reached an agreement." }
    ],

    dialogue: [
      { speaker: "A", chinese: "各位早上好，我们今天的会议开始了。", pinyin: "gè wèi zǎo shang hǎo, wǒ men jīn tiān de huì yì kāi shǐ le.", english: "Good morning everyone, let's start today's meeting." },
      { speaker: "B", chinese: "请问有新的提案要讨论吗？", pinyin: "qǐng wèn yǒu xīn de tí àn yào tǎo lùn ma?", english: "Is there a new proposal to discuss?" },
      { speaker: "A", chinese: "是的，我们先讨论市场部的新方案。", pinyin: "shì de, wǒ men xiān tǎo lùn shì chǎng bù de xīn fāng àn.", english: "Yes, let's first discuss the new plan from the marketing department." },
      { speaker: "B", chinese: "好的，我准备了相关数据。", pinyin: "hǎo de, wǒ zhǔn bèi le xiāng guān shù jù.", english: "Okay, I have prepared the relevant data." },
    ],

    exercises: [
      { type: "fill-blank", question: "请准时参加___.", answer: "会议" },
      { type: "matching", pairs: [{ chinese: "议程", pinyin: "yì chéng", english: "agenda" }, { chinese: "提案", pinyin: "tí àn", english: "proposal" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Chúng ta cần đưa ra quyết định vào cuối buổi họp.", chinese: "我们必须在会议结束时做出决定。", pinyin: "wǒ men bì xū zài huì yì jié shù shí zuò chū jué dìng." }
    ],
  },
  {
    id: 32,
level: "B1",
    title: "做演讲",
    pinyin: "zuò yǎn jiǎng",
    topic: "Giving Presentations",
    vocab: [
      { chinese: "演讲", pinyin: "yǎn jiǎng", english: "speech / presentation" },
      { chinese: "听众", pinyin: "tīng zhòng", english: "audience" },
      { chinese: "幻灯片", pinyin: "huàn dēng piàn", english: "slides" },
      { chinese: "内容", pinyin: "nèi róng", english: "content" },
      { chinese: "开场白", pinyin: "kāi chǎng bái", english: "opening remarks" },
      { chinese: "结论", pinyin: "jié lùn", english: "conclusion" },
      { chinese: "手势", pinyin: "shǒu shì", english: "gesture" },
      { chinese: "眼神交流", pinyin: "yǎn shén jiāo liú", english: "eye contact" },
      { chinese: "麦克风", pinyin: "mài kè fēng", english: "microphone" },
      { chinese: "提问环节", pinyin: "tí wèn huán jié", english: "Q&A session" }
    ],

    sentences: [
      { chinese: "今天我演讲的主题是环保。", pinyin: "jīn tiān wǒ yǎn jiǎng de zhǔ tí shì huán bǎo.", english: "Today my presentation topic is environmental protection." },
      { chinese: "请大家看幻灯片上的图表。", pinyin: "qǐng dà jiā kàn huàn dēng piàn shàng de tú biǎo.", english: "Please look at the chart on the slide." },
      { chinese: "最后，我来总结一下今天的内容。", pinyin: "zuì hòu, wǒ lái zǒng jié yī xià jīn tiān de nèi róng.", english: "Finally, let me summarize today's content." },
      { chinese: "演讲过程中要注意与听众的眼神交流。", pinyin: "yǎn jiǎng guò chéng zhōng yào zhù yì yǔ tīng zhòng de yǎn shén jiāo liú.", english: "During the presentation, maintain eye contact with the audience." },
      { chinese: "现在进入提问环节，大家有什么问题吗？", pinyin: "xiàn zài jìn rù tí wèn huán jié, dà jiā yǒu shén me wèn tí ma?", english: "Now let's move to the Q&A session. Any questions?" }
    ],

    dialogue: [
      { speaker: "A", chinese: "大家好，感谢各位来听我的演讲。", pinyin: "dà jiā hǎo, gǎn xiè gè wèi lái tīng wǒ de yǎn jiǎng.", english: "Hello everyone, thank you for coming to my presentation." },
      { speaker: "B", chinese: "你的开场白很吸引人。", pinyin: "nǐ de kāi chǎng bái hěn xī yǐn rén.", english: "Your opening remarks were very engaging." },
      { speaker: "A", chinese: "谢谢。接下来我想分享一些数据。", pinyin: "xiè xiè. jiē xià lái wǒ xiǎng fēn xiǎng yī xiē shù jù.", english: "Thank you. Next, I'd like to share some data." },
      { speaker: "B", chinese: "好的，请继续。", pinyin: "hǎo de, qǐng jì xù.", english: "Okay, please go ahead." },
    ],

    exercises: [
      { type: "fill-blank", question: "请在演讲时使用___。", answer: "麦克风" },
      { type: "matching", pairs: [{ chinese: "听众", pinyin: "tīng zhòng", english: "audience" }, { chinese: "结论", pinyin: "jié lùn", english: "conclusion" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Bài thuyết trình của bạn rất tuyệt vời.", chinese: "你的演讲非常精彩。", pinyin: "nǐ de yǎn jiǎng fēi cháng jīng cǎi." }
    ],
  },
  {
    id: 33,
level: "B1",
    title: "谈判",
    pinyin: "tán pàn",
    topic: "Negotiating",
    vocab: [
      { chinese: "谈判", pinyin: "tán pàn", english: "negotiation" },
      { chinese: "条件", pinyin: "tiáo jiàn", english: "condition / term" },
      { chinese: "妥协", pinyin: "tuǒ xié", english: "compromise" },
      { chinese: "双赢", pinyin: "shuāng yíng", english: "win-win" },
      { chinese: "底线", pinyin: "dǐ xiàn", english: "bottom line" },
      { chinese: "合同", pinyin: "hé tong", english: "contract" },
      { chinese: "报价", pinyin: "bào jià", english: "quote / offer" },
      { chinese: "折扣", pinyin: "zhé kòu", english: "discount" },
      { chinese: "条款", pinyin: "tiáo kuǎn", english: "clause" },
      { chinese: "让步", pinyin: "ràng bù", english: "concession" }
    ],

    sentences: [
      { chinese: "这个价格我们无法接受。", pinyin: "zhè gè jià gé wǒ men wú fǎ jiē shòu.", english: "We cannot accept this price." },
      { chinese: "如果你们能给更多折扣，我们可以合作。", pinyin: "rú guǒ nǐ men néng gěi gèng duō zhé kòu, wǒ men kě yǐ hé zuò.", english: "If you can give a bigger discount, we can cooperate." },
      { chinese: "我们的底线是百分之十的优惠。", pinyin: "wǒ men de dǐ xiàn shì bǎi fēn zhī shí de yōu huì.", english: "Our bottom line is a ten percent discount." },
      { chinese: "我们双方都需要做出一些让步。", pinyin: "wǒ men shuāng fāng dōu xū yào zuò chū yī xiē ràng bù.", english: "Both sides need to make some concessions." },
      { chinese: "希望我们能达成双赢的协议。", pinyin: "xī wàng wǒ men néng dá chéng shuāng yíng de xié yì.", english: "I hope we can reach a win-win agreement." }
    ],

    dialogue: [
      { speaker: "A", chinese: "关于报价，我们认为贵方的价格偏高。", pinyin: "guān yú bào jià, wǒ men rèn wéi guì fāng de jià gé piān gāo.", english: "Regarding the quotation, we think your price is too high." },
      { speaker: "B", chinese: "这个价格已经是很优惠的了。", pinyin: "zhè gè jià gé yǐ jīng shì hěn yōu huì de le.", english: "This price is already very favorable." },
      { speaker: "A", chinese: "如果我们订购更多数量，能打折吗？", pinyin: "rú guǒ wǒ men dìng gòu gèng duō shù liàng, néng dǎ zhé ma?", english: "If we order a larger quantity, can you give a discount?" },
      { speaker: "B", chinese: "如果订单超过一千件，我们可以给八五折。", pinyin: "rú guǒ dìng dān chāo guò yī qiān jiàn, wǒ men kě yǐ gěi bā wǔ zhé.", english: "If the order exceeds 1,000 units, we can give 15% off." },
    ],

    exercises: [
      { type: "fill-blank", question: "谈判中要学会___。", answer: "妥协" },
      { type: "matching", pairs: [{ chinese: "双赢", pinyin: "shuāng yíng", english: "win-win" }, { chinese: "让步", pinyin: "ràng bù", english: "concession" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Chúng ta cần đàm phán lại các điều khoản hợp đồng.", chinese: "我们需要重新谈判合同条款。", pinyin: "wǒ men xū yào chóng xīn tán pàn hé tong tiáo kuǎn." }
    ],
  },
  {
    id: 34,
level: "B1",
    title: "社交媒体",
    pinyin: "shè jiāo méi tǐ",
    topic: "Social Media",
    vocab: [
      { chinese: "社交媒体", pinyin: "shè jiāo méi tǐ", english: "social media" },
      { chinese: "帖子", pinyin: "tiě zi", english: "post" },
      { chinese: "点赞", pinyin: "diǎn zàn", english: "like" },
      { chinese: "评论", pinyin: "píng lùn", english: "comment" },
      { chinese: "分享", pinyin: "fēn xiǎng", english: "share" },
      { chinese: "关注", pinyin: "guān zhù", english: "follow" },
      { chinese: "粉丝", pinyin: "fěn sī", english: "fans / followers" },
      { chinese: "私信", pinyin: "sī xìn", english: "private message" },
      { chinese: "动态", pinyin: "dòng tài", english: "updates / feed" },
      { chinese: "朋友圈", pinyin: "péng yǒu quān", english: "moments (WeChat)" }
    ],

    sentences: [
      { chinese: "我每天都会刷朋友圈。", pinyin: "wǒ měi tiān dōu huì shuā péng yǒu quān.", english: "I check my WeChat Moments every day." },
      { chinese: "这条帖子获得了上万个点赞。", pinyin: "zhè tiáo tiě zi huò dé le shàng wàn gè diǎn zàn.", english: "This post got tens of thousands of likes." },
      { chinese: "请不要在社交媒体上泄露隐私。", pinyin: "qǐng bù yào zài shè jiāo méi tǐ shàng xiè lù yǐn sī.", english: "Please don't leak private information on social media." },
      { chinese: "你可以关注我的账号获取最新动态。", pinyin: "nǐ kě yǐ guān zhù wǒ de zhàng hào huò qǔ zuì xīn dòng tài.", english: "You can follow my account for the latest updates." },
      { chinese: "我私信给你发了一些照片。", pinyin: "wǒ sī xìn gěi nǐ fā le yī xiē zhào piàn.", english: "I sent you some photos in a private message." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你看我昨天发的朋友圈了吗？", pinyin: "nǐ kàn wǒ zuó tiān fā de péng yǒu quān le ma?", english: "Did you see my WeChat Moments post yesterday?" },
      { speaker: "B", chinese: "看到了，那张照片拍得真好看。", pinyin: "kàn dào le, nà zhāng zhào piàn pāi de zhēn hǎo kàn.", english: "Yes, that photo is really beautiful." },
      { speaker: "A", chinese: "谢谢！你帮我点个赞吧。", pinyin: "xiè xiè! nǐ bāng wǒ diǎn gè zàn ba.", english: "Thanks! Please give it a like." },
      { speaker: "B", chinese: "已经点了，还给你留了评论。", pinyin: "yǐ jīng diǎn le, hái gěi nǐ liú le píng lùn.", english: "Already did, and I left a comment too." },
    ],

    exercises: [
      { type: "fill-blank", question: "请给我点个___。", answer: "赞" },
      { type: "matching", pairs: [{ chinese: "粉丝", pinyin: "fěn sī", english: "fans" }, { chinese: "私信", pinyin: "sī xìn", english: "private message" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Tôi thích chia sẻ ảnh trên mạng xã hội.", chinese: "我喜欢在社交媒体上分享照片。", pinyin: "wǒ xǐ huān zài shè jiāo méi tǐ shàng fēn xiǎng zhào piàn." }
    ],
  },
  {
    id: 35,
level: "B1",
    title: "环境问题",
    pinyin: "huán jìng wèn tí",
    topic: "Environmental Issues",
    vocab: [
      { chinese: "环境", pinyin: "huán jìng", english: "environment" },
      { chinese: "污染", pinyin: "wū rǎn", english: "pollution" },
      { chinese: "回收", pinyin: "huí shōu", english: "recycle" },
      { chinese: "垃圾", pinyin: "lā jī", english: "garbage" },
      { chinese: "减排", pinyin: "jiǎn pái", english: "emission reduction" },
      { chinese: "节能", pinyin: "jié néng", english: "energy saving" },
      { chinese: "气候", pinyin: "qì hòu", english: "climate" },
      { chinese: "生态", pinyin: "shēng tài", english: "ecology" },
      { chinese: "可持续发展", pinyin: "kě chí xù fā zhǎn", english: "sustainable development" },
      { chinese: "森林", pinyin: "sēn lín", english: "forest" }
    ],

    sentences: [
      { chinese: "空气污染越来越严重了。", pinyin: "kōng qì wū rǎn yuè lái yuè yán zhòng le.", english: "Air pollution is getting worse." },
      { chinese: "我们应该把垃圾分类回收。", pinyin: "wǒ men yīng gāi bǎ lā jī fēn lèi huí shōu.", english: "We should sort garbage for recycling." },
      { chinese: "减少碳排放是全球共同的责任。", pinyin: "jiǎn shǎo tàn pái fàng shì quán qiú gòng tóng de zé rèn.", english: "Reducing carbon emissions is a global responsibility." },
      { chinese: "使用节能灯可以节约用电。", pinyin: "shǐ yòng jié néng dēng kě yǐ jié yuē yòng diàn.", english: "Using energy-saving bulbs can save electricity." },
      { chinese: "保护森林就是保护我们的未来。", pinyin: "bǎo hù sēn lín jiù shì bǎo hù wǒ men de wèi lái.", english: "Protecting forests means protecting our future." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你觉得我们应该怎么保护环境？", pinyin: "nǐ jué de wǒ men yīng gāi zěn me bǎo hù huán jìng?", english: "How do you think we should protect the environment?" },
      { speaker: "B", chinese: "我觉得少用塑料袋是一个好办法。", pinyin: "wǒ jué de shǎo yòng sù liào dài shì yī gè hǎo bàn fǎ.", english: "I think using fewer plastic bags is a good way." },
      { speaker: "A", chinese: "对，还有就是多坐公共交通。", pinyin: "duì, hái yǒu jiù shì duō zuò gōng gòng jiāo tōng.", english: "Right, and also use public transportation more." },
      { speaker: "B", chinese: "是的，每个人都出一份力，环境会更好。", pinyin: "shì de, měi gè rén dōu chū yī fèn lì, huán jìng huì gèng hǎo.", english: "Yes, if everyone does their part, the environment will be better." },
    ],

    exercises: [
      { type: "fill-blank", question: "我们要减少___排放。", answer: "碳" },
      { type: "matching", pairs: [{ chinese: "回收", pinyin: "huí shōu", english: "recycle" }, { chinese: "污染", pinyin: "wū rǎn", english: "pollution" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Bảo vệ môi trường là trách nhiệm của mỗi người.", chinese: "保护环境是每个人的责任。", pinyin: "bǎo hù huán jìng shì měi gè rén de zé rèn." }
    ],
  },
  {
    id: 36,
level: "B1",
    title: "表达观点",
    pinyin: "biǎo dá guān diǎn",
    topic: "Expressing Opinions",
    vocab: [
      { chinese: "观点", pinyin: "guān diǎn", english: "opinion / viewpoint" },
      { chinese: "看法", pinyin: "kàn fǎ", english: "view" },
      { chinese: "同意", pinyin: "tóng yì", english: "agree" },
      { chinese: "反对", pinyin: "fǎn duì", english: "oppose" },
      { chinese: "在我看来", pinyin: "zài wǒ kàn lái", english: "in my opinion" },
      { chinese: "我觉得", pinyin: "wǒ jué de", english: "I think" },
      { chinese: "事实上", pinyin: "shì shí shàng", english: "in fact" },
      { chinese: "总的来说", pinyin: "zǒng de lái shuō", english: "generally speaking" },
      { chinese: "另一方面", pinyin: "lìng yī fāng miàn", english: "on the other hand" },
      { chinese: "毫无疑问", pinyin: "háo wú yí wèn", english: "without a doubt" }
    ],

    sentences: [
      { chinese: "在我看来，这个计划可行。", pinyin: "zài wǒ kàn lái, zhè gè jì huà kě xíng.", english: "In my opinion, this plan is feasible." },
      { chinese: "我完全同意你的看法。", pinyin: "wǒ wán quán tóng yì nǐ de kàn fǎ.", english: "I completely agree with your view." },
      { chinese: "我反对这个提议，因为它不够环保。", pinyin: "wǒ fǎn duì zhè gè tí yì, yīn wèi tā bù gòu huán bǎo.", english: "I oppose this proposal because it's not environmentally friendly enough." },
      { chinese: "事实上，我们还有更好的选择。", pinyin: "shì shí shàng, wǒ men hái yǒu gèng hǎo de xuǎn zé.", english: "In fact, we have better options." },
      { chinese: "总的来说，这次活动很成功。", pinyin: "zǒng de lái shuō, zhè cì huó dòng hěn chéng gōng.", english: "Generally speaking, this event was very successful." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你觉得我们应该搬家吗？", pinyin: "nǐ jué de wǒ men yīng gāi bān jiā ma?", english: "Do you think we should move?" },
      { speaker: "B", chinese: "在我看来，搬家太麻烦了。", pinyin: "zài wǒ kàn lái, bān jiā tài má fan le.", english: "In my opinion, moving is too troublesome." },
      { speaker: "A", chinese: "可是现在的房子太小了。", pinyin: "kě shì xiàn zài de fáng zi tài xiǎo le.", english: "But the current house is too small." },
      { speaker: "B", chinese: "你说得也有道理。那我们考虑一下。", pinyin: "nǐ shuō de yě yǒu dào lǐ. nà wǒ men kǎo lǜ yī xià.", english: "You have a point. Let's consider it." },
    ],

    exercises: [
      { type: "fill-blank", question: "___，我们应该坚持到底。", answer: "总的来说" },
      { type: "matching", pairs: [{ chinese: "同意", pinyin: "tóng yì", english: "agree" }, { chinese: "反对", pinyin: "fǎn duì", english: "oppose" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Theo tôi, đây là một ý kiến hay.", chinese: "在我看来，这是个好主意。", pinyin: "zài wǒ kàn lái, zhè shì gè hǎo zhǔ yì." }
    ],
  },
  {
    id: 37,
level: "B1",
    title: "提出建议",
    pinyin: "tí chū jiàn yì",
    topic: "Making Suggestions",
    vocab: [
      { chinese: "建议", pinyin: "jiàn yì", english: "suggestion" },
      { chinese: "推荐", pinyin: "tuī jiàn", english: "recommend" },
      { chinese: "最好", pinyin: "zuì hǎo", english: "had better" },
      { chinese: "不妨", pinyin: "bù fáng", english: "might as well" },
      { chinese: "也许", pinyin: "yě xǔ", english: "perhaps" },
      { chinese: "考虑", pinyin: "kǎo lǜ", english: "consider" },
      { chinese: "试试", pinyin: "shì shì", english: "try" },
      { chinese: "建议你", pinyin: "jiàn yì nǐ", english: "I suggest you" },
      { chinese: "不如", pinyin: "bù rú", english: "why not" },
      { chinese: "应该", pinyin: "yīng gāi", english: "should" }
    ],

    sentences: [
      { chinese: "我建议你多休息几天。", pinyin: "wǒ jiàn yì nǐ duō xiū xī jǐ tiān.", english: "I suggest you rest a few more days." },
      { chinese: "不如我们一起去爬山吧。", pinyin: "bù rú wǒ men yī qǐ qù pá shān ba.", english: "Why don't we go hiking together?" },
      { chinese: "这部电影很好看，推荐你看看。", pinyin: "zhè bù diàn yǐng hěn hǎo kàn, tuī jiàn nǐ kàn kàn.", english: "This movie is great, I recommend you watch it." },
      { chinese: "你最好提前预约，免得排队。", pinyin: "nǐ zuì hǎo tí qián yù yuē, miǎn de pái duì.", english: "You'd better make a reservation in advance to avoid queuing." },
      { chinese: "你可以考虑换个工作环境。", pinyin: "nǐ kě yǐ kǎo lǜ huàn gè gōng zuò huán jìng.", english: "You could consider changing your work environment." }
    ],

    dialogue: [
      { speaker: "A", chinese: "最近工作压力好大，怎么办？", pinyin: "zuì jìn gōng zuò yā lì hǎo dà, zěn me bàn?", english: "I've been under a lot of work pressure lately, what should I do?" },
      { speaker: "B", chinese: "我建议你每天运动一下。", pinyin: "wǒ jiàn yì nǐ měi tiān yùn dòng yī xià.", english: "I suggest you exercise every day." },
      { speaker: "A", chinese: "可是我没时间。", pinyin: "kě shì wǒ méi shí jiān.", english: "But I have no time." },
      { speaker: "B", chinese: "那不妨试试冥想，几分钟就行。", pinyin: "nà bù fáng shì shì míng xiǎng, jǐ fēn zhōng jiù xíng.", english: "Then why not try meditation, just a few minutes." },
    ],

    exercises: [
      { type: "fill-blank", question: "我___你早点睡觉。", answer: "建议" },
      { type: "matching", pairs: [{ chinese: "推荐", pinyin: "tuī jiàn", english: "recommend" }, { chinese: "试试", pinyin: "shì shì", english: "try" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Bạn nên học tiếng Trung mỗi ngày.", chinese: "你应该每天学中文。", pinyin: "nǐ yīng gāi měi tiān xué zhōng wén." }
    ],
  },
  {
    id: 38,
level: "B1",
    title: "道歉与借口",
    pinyin: "dào qiàn yǔ jiè kǒu",
    topic: "Apologizing and Making Excuses",
    vocab: [
      { chinese: "道歉", pinyin: "dào qiàn", english: "apologize" },
      { chinese: "对不起", pinyin: "duì bu qǐ", english: "sorry" },
      { chinese: "原谅", pinyin: "yuán liàng", english: "forgive" },
      { chinese: "借口", pinyin: "jiè kǒu", english: "excuse" },
      { chinese: "误会", pinyin: "wù huì", english: "misunderstanding" },
      { chinese: "不是故意的", pinyin: "bù shì gù yì de", english: "not intentional" },
      { chinese: "保证", pinyin: "bǎo zhèng", english: "guarantee / promise" },
      { chinese: "弥补", pinyin: "mí bǔ", english: "make up for" },
      { chinese: "抱歉", pinyin: "bào qiàn", english: "apologetic" },
      { chinese: "关系", pinyin: "guān xì", english: "relationship" }
    ],

    sentences: [
      { chinese: "对不起，我来晚了。", pinyin: "duì bu qǐ, wǒ lái wǎn le.", english: "Sorry, I'm late." },
      { chinese: "我不是故意弄坏你的东西的。", pinyin: "wǒ bù shì gù yì nòng huài nǐ de dōng xi de.", english: "I didn't mean to break your things." },
      { chinese: "请原谅我的迟到，路上堵车了。", pinyin: "qǐng yuán liàng wǒ de chí dào, lù shàng dǔ chē le.", english: "Please forgive my lateness, there was a traffic jam." },
      { chinese: "我保证下次不会再发生这样的事情。", pinyin: "wǒ bǎo zhèng xià cì bù huì zài fā shēng zhè yàng de shì qíng.", english: "I promise it won't happen again." },
      { chinese: "我想弥补我的过错。", pinyin: "wǒ xiǎng mí bǔ wǒ de guò cuò.", english: "I want to make up for my mistake." }
    ],

    dialogue: [
      { speaker: "A", chinese: "对不起，我把你的书弄丢了。", pinyin: "duì bu qǐ, wǒ bǎ nǐ de shū nòng diū le.", english: "Sorry, I lost your book." },
      { speaker: "B", chinese: "没关系，那本书我早就看完了。", pinyin: "méi guān xì, nà běn shū wǒ zǎo jiù kàn wán le.", english: "It's okay, I finished reading that book long ago." },
      { speaker: "A", chinese: "但我还是觉得很抱歉。", pinyin: "dàn wǒ hái shì jué de hěn bào qiàn.", english: "But I still feel very sorry." },
      { speaker: "B", chinese: "真的没关系，别放在心上。", pinyin: "zhēn de méi guān xì, bié fàng zài xīn shàng.", english: "Really, it's fine. Don't worry about it." },
    ],

    exercises: [
      { type: "fill-blank", question: "请___，我迟到了。", answer: "原谅" },
      { type: "matching", pairs: [{ chinese: "道歉", pinyin: "dào qiàn", english: "apologize" }, { chinese: "借口", pinyin: "jiè kǒu", english: "excuse" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Tôi xin lỗi vì đã làm phiền bạn.", chinese: "对不起，打扰你了。", pinyin: "duì bu qǐ, dǎ rǎo nǐ le." }
    ],
  },
  {
    id: 39,
level: "B1",
    title: "给建议",
    pinyin: "gěi jiàn yì",
    topic: "Giving Advice",
    vocab: [
      { chinese: "建议", pinyin: "jiàn yì", english: "advice" },
      { chinese: "忠告", pinyin: "zhōng gào", english: "word of advice" },
      { chinese: "经验", pinyin: "jīng yàn", english: "experience" },
      { chinese: "明智", pinyin: "míng zhì", english: "wise" },
      { chinese: "不要", pinyin: "bù yào", english: "don't" },
      { chinese: "应该", pinyin: "yīng gāi", english: "should" },
      { chinese: "最好", pinyin: "zuì hǎo", english: "had better" },
      { chinese: "小心", pinyin: "xiǎo xīn", english: "be careful" },
      { chinese: "重要", pinyin: "zhòng yào", english: "important" },
      { chinese: "记住", pinyin: "jì zhù", english: "remember" }
    ],

    sentences: [
      { chinese: "我给你的忠告是别轻易放弃。", pinyin: "wǒ gěi nǐ de zhōng gào shì bié qīng yì fàng qì.", english: "My advice to you is don't give up easily." },
      { chinese: "你应该先学基础再学高级内容。", pinyin: "nǐ yīng gāi xiān xué jī chǔ zài xué gāo jí nèi róng.", english: "You should learn the basics first before advanced content." },
      { chinese: "最好多听听别人的意见。", pinyin: "zuì hǎo duō tīng tīng bié rén de yì jiàn.", english: "You'd better listen to others' opinions more." },
      { chinese: "小心别上当受骗。", pinyin: "xiǎo xīn bié shàng dàng shòu piàn.", english: "Be careful not to get cheated." },
      { chinese: "记住，健康是最重要的。", pinyin: "jì zhù, jiàn kāng shì zuì zhòng yào de.", english: "Remember, health is the most important." }
    ],

    dialogue: [
      { speaker: "A", chinese: "我想自己创业，你觉得怎么样？", pinyin: "wǒ xiǎng zì jǐ chuàng yè, nǐ jué de zěn me yàng?", english: "I want to start my own business, what do you think?" },
      { speaker: "B", chinese: "我建议你先做好市场调研。", pinyin: "wǒ jiàn yì nǐ xiān zuò hǎo shì chǎng diào yán.", english: "I suggest you do market research first." },
      { speaker: "A", chinese: "有道理，还有别的建议吗？", pinyin: "yǒu dào lǐ, hái yǒu bié de jiàn yì ma?", english: "That makes sense, any other advice?" },
      { speaker: "B", chinese: "记住要控制成本，别盲目扩张。", pinyin: "jì zhù yào kòng zhì chéng běn, bié máng mù kuò zhāng.", english: "Remember to control costs and don't expand blindly." },
    ],

    exercises: [
      { type: "fill-blank", question: "我___你多运动。", answer: "建议" },
      { type: "matching", pairs: [{ chinese: "忠告", pinyin: "zhōng gào", english: "advice" }, { chinese: "明智", pinyin: "míng zhì", english: "wise" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Lời khuyên của tôi là hãy kiên nhẫn.", chinese: "我的建议是要有耐心。", pinyin: "wǒ de jiàn yì shì yào yǒu nài xīn." }
    ],
  },
  {
    id: 40,
level: "B1",
    title: "描述经历",
    pinyin: "miáo shù jīng lì",
    topic: "Describing Experiences",
    vocab: [
      { chinese: "经历", pinyin: "jīng lì", english: "experience" },
      { chinese: "曾经", pinyin: "céng jīng", english: "once (in the past)" },
      { chinese: "记得", pinyin: "jì de", english: "remember" },
      { chinese: "当时", pinyin: "dāng shí", english: "at that time" },
      { chinese: "第一次", pinyin: "dì yī cì", english: "first time" },
      { chinese: "难忘", pinyin: "nán wàng", english: "unforgettable" },
      { chinese: "遇到", pinyin: "yù dào", english: "encounter" },
      { chinese: "发生", pinyin: "fā shēng", english: "happen" },
      { chinese: "最后", pinyin: "zuì hòu", english: "finally" },
      { chinese: "感觉", pinyin: "gǎn jué", english: "feeling" }
    ],

    sentences: [
      { chinese: "我曾经去过北京，那里很美。", pinyin: "wǒ céng jīng qù guò běi jīng, nà lǐ hěn měi.", english: "I have been to Beijing, it's beautiful there." },
      { chinese: "记得我第一次上台演讲时非常紧张。", pinyin: "jì de wǒ dì yī cì shàng tái yǎn jiǎng shí fēi cháng jǐn zhāng.", english: "I remember my first time giving a speech on stage, I was very nervous." },
      { chinese: "当时我完全不知道该怎么办。", pinyin: "dāng shí wǒ wán quán bù zhī dào gāi zěn me bàn.", english: "At that time I had no idea what to do." },
      { chinese: "那次旅行让我很难忘。", pinyin: "nà cì lǚ xíng ràng wǒ hěn nán wàng.", english: "That trip was unforgettable for me." },
      { chinese: "最后我克服了困难，感觉很有成就感。", pinyin: "zuì hòu wǒ kè fú le kùn nán, gǎn jué hěn yǒu chéng jiù gǎn.", english: "Finally I overcame the difficulty and felt a great sense of achievement." }
    ],

    dialogue: [
      { speaker: "A", chinese: "听说你去年去了西藏，感觉怎么样？", pinyin: "tīng shuō nǐ qù nián qù le xī zàng, gǎn jué zěn me yàng?", english: "I heard you went to Tibet last year, how was it?" },
      { speaker: "B", chinese: "一次非常难忘的经历。那里的风景太震撼了。", pinyin: "yī cì fēi cháng nán wàng de jīng lì. nà lǐ de fēng jǐng tài zhèn hàn le.", english: "A very unforgettable experience. The scenery there was breathtaking." },
      { speaker: "A", chinese: "你当时高反严重吗？", pinyin: "nǐ dāng shí gāo fǎn yán zhòng ma?", english: "Did you suffer from altitude sickness?" },
      { speaker: "B", chinese: "有一点，但很快就适应了。", pinyin: "yǒu yī diǎn, dàn hěn kuài jiù shì yìng le.", english: "A little, but I adapted quickly." },
    ],

    exercises: [
      { type: "fill-blank", question: "我___爬过那座山。", answer: "曾经" },
      { type: "matching", pairs: [{ chinese: "经历", pinyin: "jīng lì", english: "experience" }, { chinese: "难忘", pinyin: "nán wàng", english: "unforgettable" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Lần đầu tiên tôi ăn món này, tôi đã rất thích.", chinese: "我第一次吃这个菜时，非常喜欢。", pinyin: "wǒ dì yī cì chī zhè gè cài shí, fēi cháng xǐ huān." }
    ],
  },
  {
    id: 41,
level: "B1",
    title: "比较选择",
    pinyin: "bǐ jiào xuǎn zé",
    topic: "Comparing Options",
    vocab: [
      { chinese: "比较", pinyin: "bǐ jiào", english: "compare" },
      { chinese: "选择", pinyin: "xuǎn zé", english: "choice / choose" },
      { chinese: "更好", pinyin: "gèng hǎo", english: "better" },
      { chinese: "不如", pinyin: "bù rú", english: "not as good as" },
      { chinese: "一样", pinyin: "yī yàng", english: "same" },
      { chinese: "优点", pinyin: "yōu diǎn", english: "advantage" },
      { chinese: "缺点", pinyin: "quē diǎn", english: "disadvantage" },
      { chinese: "性价比", pinyin: "xìng jià bǐ", english: "cost performance" },
      { chinese: "便宜", pinyin: "pián yí", english: "cheap" },
      { chinese: "贵", pinyin: "guì", english: "expensive" }
    ],

    sentences: [
      { chinese: "这两个手机，你比较一下哪个更好？", pinyin: "zhè liǎng gè shǒu jī, nǐ bǐ jiào yī xià nǎ gè gèng hǎo?", english: "Compare these two phones, which one is better?" },
      { chinese: "A款比B款便宜，但功能不如B款多。", pinyin: "A kuǎn bǐ B kuǎn pián yí, dàn gōng néng bù rú B kuǎn duō.", english: "Model A is cheaper than B, but it doesn't have as many features as B." },
      { chinese: "这两本书内容差不多一样。", pinyin: "zhè liǎng běn shū nèi róng chà bu duō yī yàng.", english: "The content of these two books is about the same." },
      { chinese: "你觉得选哪个方案更合适？", pinyin: "nǐ jué de xuǎn nǎ gè fāng àn gèng hé shì?", english: "Which plan do you think is more suitable?" },
      { chinese: "从性价比来看，这款产品很划算。", pinyin: "cóng xìng jià bǐ lái kàn, zhè kuǎn chǎn pǐn hěn huá suàn.", english: "In terms of cost performance, this product is a good deal." }
    ],

    dialogue: [
      { speaker: "A", chinese: "我在纠结买哪辆车，你能帮我比较一下吗？", pinyin: "wǒ zài jiū jié mǎi nǎ liàng chē, nǐ néng bāng wǒ bǐ jiào yī xià ma?", english: "I'm torn about which car to buy, can you help me compare?" },
      { speaker: "B", chinese: "这两款车各有优缺点。一个省油，一个空间大。", pinyin: "zhè liǎng kuǎn chē gè yǒu yōu quē diǎn. yī gè shěng yóu, yī gè kōng jiān dà.", english: "These two cars each have pros and cons. One is fuel-efficient, the other has more space." },
      { speaker: "A", chinese: "那如果你是我，你会选哪个？", pinyin: "nà rú guǒ nǐ shì wǒ, nǐ huì xuǎn nǎ gè?", english: "Then if you were me, which one would you choose?" },
      { speaker: "B", chinese: "我选空间大的，因为我经常带家人出行。", pinyin: "wǒ xuǎn kōng jiān dà de, yīn wèi wǒ jīng cháng dài jiā rén chū xíng.", english: "I'd choose the one with more space, because I often travel with family." },
    ],

    exercises: [
      { type: "fill-blank", question: "这两条裙子，哪条更___？", answer: "好看" },
      { type: "matching", pairs: [{ chinese: "优点", pinyin: "yōu diǎn", english: "advantage" }, { chinese: "缺点", pinyin: "quē diǎn", english: "disadvantage" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Cái này rẻ hơn cái kia.", chinese: "这个比那个便宜。", pinyin: "zhè gè bǐ nà gè pián yí." }
    ],
  },
  {
    id: 42,
level: "B1",
    title: "假设情况",
    pinyin: "jiǎ shè qíng kuàng",
    topic: "Hypothetical Situations",
    vocab: [
      { chinese: "假设", pinyin: "jiǎ shè", english: "assume / suppose" },
      { chinese: "如果", pinyin: "rú guǒ", english: "if" },
      { chinese: "要是", pinyin: "yào shì", english: "if (colloquial)" },
      { chinese: "那么", pinyin: "nà me", english: "then" },
      { chinese: "否则", pinyin: "fǒu zé", english: "otherwise" },
      { chinese: "可能", pinyin: "kě néng", english: "maybe / possible" },
      { chinese: "会", pinyin: "huì", english: "will / would" },
      { chinese: "万一", pinyin: "wàn yī", english: "just in case" },
      { chinese: "假如", pinyin: "jiǎ rú", english: "if (supposing)" },
      { chinese: "想象", pinyin: "xiǎng xiàng", english: "imagine" }
    ],

    sentences: [
      { chinese: "如果明天不下雨，我们就去公园。", pinyin: "rú guǒ míng tiān bù xià yǔ, wǒ men jiù qù gōng yuán.", english: "If it doesn't rain tomorrow, we'll go to the park." },
      { chinese: "要是我是你，我就会接受这个offer。", pinyin: "yào shì wǒ shì nǐ, wǒ jiù huì jiē shòu zhè gè offer.", english: "If I were you, I would accept this offer." },
      { chinese: "假设你有100万，你会怎么花？", pinyin: "jiǎ shè nǐ yǒu yī bǎi wàn, nǐ huì zěn me huā?", english: "Suppose you had one million, how would you spend it?" },
      { chinese: "万一他不同意，我们还有备用方案。", pinyin: "wàn yī tā bù tóng yì, wǒ men hái yǒu bèi yòng fāng àn.", english: "In case he disagrees, we have a backup plan." },
      { chinese: "想象一下十年后的生活会是什么样子。", pinyin: "xiǎng xiàng yī xià shí nián hòu de shēng huó huì shì shén me yàng zi.", english: "Imagine what life will be like ten years from now." }
    ],

    dialogue: [
      { speaker: "A", chinese: "假如你中了彩票，你会做什么？", pinyin: "jiǎ rú nǐ zhòng le cǎi piào, nǐ huì zuò shén me?", english: "If you won the lottery, what would you do?" },
      { speaker: "B", chinese: "我会先环游世界，再投资房地产。", pinyin: "wǒ huì xiān huán yóu shì jiè, zài tóu zī fáng dì chǎn.", english: "I would travel around the world first, then invest in real estate." },
      { speaker: "A", chinese: "那如果彩票没中呢？", pinyin: "nà rú guǒ cǎi piào méi zhòng ne?", english: "And if you didn't win?" },
      { speaker: "B", chinese: "那就继续努力工作呗。", pinyin: "nà jiù jì xù nǔ lì gōng zuò bei.", english: "Then I'll just keep working hard." },
    ],

    exercises: [
      { type: "fill-blank", question: "___明天下雨，我们就不去了。", answer: "如果" },
      { type: "matching", pairs: [{ chinese: "假设", pinyin: "jiǎ shè", english: "suppose" }, { chinese: "万一", pinyin: "wàn yī", english: "in case" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Nếu tôi có thời gian, tôi sẽ đi du lịch.", chinese: "如果我有时间，我会去旅游。", pinyin: "rú guǒ wǒ yǒu shí jiān, wǒ huì qù lǚ yóu." }
    ],
  },
  {
    id: 43,
level: "B1",
    title: "转述",
    pinyin: "zhuǎn shù",
    topic: "Reporting Speech",
    vocab: [
      { chinese: "转述", pinyin: "zhuǎn shù", english: "report (speech)" },
      { chinese: "说", pinyin: "shuō", english: "say" },
      { chinese: "告诉", pinyin: "gào su", english: "tell" },
      { chinese: "提到", pinyin: "tí dào", english: "mention" },
      { chinese: "问", pinyin: "wèn", english: "ask" },
      { chinese: "回答", pinyin: "huí dá", english: "answer" },
      { chinese: "解释道", pinyin: "jiě shì dào", english: "explain" },
      { chinese: "声称", pinyin: "shēng chēng", english: "claim" },
      { chinese: "据说", pinyin: "jù shuō", english: "it is said that" },
      { chinese: "据报道", pinyin: "jù bào dào", english: "according to reports" }
    ],

    sentences: [
      { chinese: "他说他明天会来。", pinyin: "tā shuō tā míng tiān huì lái.", english: "He said he would come tomorrow." },
      { chinese: "她告诉我她已经完成了作业。", pinyin: "tā gào su wǒ tā yǐ jīng wán chéng le zuò yè.", english: "She told me she had finished her homework." },
      { chinese: "老师提到下周会有考试。", pinyin: "lǎo shī tí dào xià zhōu huì yǒu kǎo shì.", english: "The teacher mentioned there will be an exam next week." },
      { chinese: "他问我今天几号。", pinyin: "tā wèn wǒ jīn tiān jǐ hào.", english: "He asked me what the date is today." },
      { chinese: "据报道，气温将下降。", pinyin: "jù bào dào, qì wēn jiāng xià jiàng.", english: "According to reports, the temperature will drop." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你听说小李说什么了吗？", pinyin: "nǐ tīng shuō xiǎo lǐ shuō shén me le ma?", english: "Did you hear what Xiao Li said?" },
      { speaker: "B", chinese: "他告诉我他下个月要辞职。", pinyin: "tā gào su wǒ tā xià gè yuè yào cí zhí.", english: "He told me he's going to resign next month." },
      { speaker: "A", chinese: "真的吗？他提到原因了吗？", pinyin: "zhēn de ma? tā tí dào yuán yīn le ma?", english: "Really? Did he mention the reason?" },
      { speaker: "B", chinese: "他说他想换个行业。", pinyin: "tā shuō tā xiǎng huàn gè háng yè.", english: "He said he wants to change industries." },
    ],

    exercises: [
      { type: "fill-blank", question: "他___我他已经吃过饭了。", answer: "告诉" },
      { type: "matching", pairs: [{ chinese: "转述", pinyin: "zhuǎn shù", english: "report speech" }, { chinese: "声称", pinyin: "shēng chēng", english: "claim" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Cô ấy nói rằng cô ấy rất mệt.", chinese: "她说她很累。", pinyin: "tā shuō tā hěn lèi." }
    ],
  },
  {
    id: 44,
level: "B1",
    title: "被动语态",
    pinyin: "bèi dòng yǔ tài",
    topic: "Passive Voice",
    vocab: [
      { chinese: "被", pinyin: "bèi", english: "by (passive marker)" },
      { chinese: "让", pinyin: "ràng", english: "let / by (passive)" },
      { chinese: "叫", pinyin: "jiào", english: "by (passive, colloquial)" },
      { chinese: "给", pinyin: "gěi", english: "by (passive)" },
      { chinese: "受到", pinyin: "shòu dào", english: "receive / be subjected to" },
      { chinese: "遭到", pinyin: "zāo dào", english: "suffer / meet with" },
      { chinese: "得到", pinyin: "dé dào", english: "get / obtain" },
      { chinese: "由", pinyin: "yóu", english: "by (indicating agent)" },
      { chinese: "被动了", pinyin: "bèi dòng le", english: "was done (passive)" },
      { chinese: "被动句", pinyin: "bèi dòng jù", english: "passive sentence" }
    ],

    sentences: [
      { chinese: "我的钱包被偷了。", pinyin: "wǒ de qián bāo bèi tōu le.", english: "My wallet was stolen." },
      { chinese: "这个蛋糕是妈妈做的。", pinyin: "zhè gè dàn gāo shì mā ma zuò de.", english: "This cake was made by mom." },
      { chinese: "会议室已经打扫干净了。", pinyin: "huì yì shì yǐ jīng dǎ sǎo gān jìng le.", english: "The meeting room has been cleaned." },
      { chinese: "他受到了大家的热烈欢迎。", pinyin: "tā shòu dào le dà jiā de rè liè huān yíng.", english: "He received a warm welcome from everyone." },
      { chinese: "文件已经由秘书发送了。", pinyin: "wén jiàn yǐ jīng yóu mì shū fā sòng le.", english: "The document has been sent by the secretary." }
    ],

    dialogue: [
      { speaker: "A", chinese: "你听说那个消息了吗？", pinyin: "nǐ tīng shuō nà gè xiāo xi le ma?", english: "Did you hear that news?" },
      { speaker: "B", chinese: "没有，怎么了？", pinyin: "méi yǒu, zěn me le?", english: "No, what happened?" },
      { speaker: "A", chinese: "我们公司的项目被取消了。", pinyin: "wǒ men gōng sī de xiàng mù bèi qǔ xiāo le.", english: "Our company's project was canceled." },
      { speaker: "B", chinese: "什么？怎么会这样？", pinyin: "shén me? zěn me huì zhè yàng?", english: "What? How could that happen?" },
    ],

    exercises: [
      { type: "fill-blank", question: "窗户___人打破了。", answer: "被" },
      { type: "matching", pairs: [{ chinese: "被", pinyin: "bèi", english: "by (passive)" }, { chinese: "由", pinyin: "yóu", english: "by (agent)" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Bức thư đã được gửi đi.", chinese: "信已经被寄出了。", pinyin: "xìn yǐ jīng bèi jì chū le." }
    ],
  },
  {
    id: 45,
level: "B1",
    title: "定语从句",
    pinyin: "dìng yǔ cóng jù",
    topic: "Relative Clauses",
    vocab: [
      { chinese: "的", pinyin: "de", english: "possessive / relative particle" },
      { chinese: "那个", pinyin: "nà gè", english: "that (one)" },
      { chinese: "这个", pinyin: "zhè gè", english: "this (one)" },
      { chinese: "的", pinyin: "de", english: "relative clause marker" },
      { chinese: "人", pinyin: "rén", english: "person" },
      { chinese: "东西", pinyin: "dōng xi", english: "thing" },
      { chinese: "地方", pinyin: "dì fāng", english: "place" },
      { chinese: "时候", pinyin: "shí hou", english: "time" },
      { chinese: "原因", pinyin: "yuán yīn", english: "reason" },
      { chinese: "方式", pinyin: "fāng shì", english: "way / method" }
    ],

    sentences: [
      { chinese: "那个穿红衣服的女孩是我的妹妹。", pinyin: "nà gè chuān hóng yī fú de nǚ hái shì wǒ de mèi mei.", english: "The girl who is wearing red clothes is my sister." },
      { chinese: "我昨天买的那本书很有意思。", pinyin: "wǒ zuó tiān mǎi de nà běn shū hěn yǒu yì si.", english: "The book that I bought yesterday is very interesting." },
      { chinese: "他住的地方离公司很远。", pinyin: "tā zhù de dì fāng lí gōng sī hěn yuǎn.", english: "The place where he lives is far from the company." },
      { chinese: "这就是我们上次见面的地方。", pinyin: "zhè jiù shì wǒ men shàng cì jiàn miàn de dì fāng.", english: "This is the place where we met last time." },
      { chinese: "你知道他迟到的原因吗？", pinyin: "nǐ zhī dào tā chí dào de yuán yīn ma?", english: "Do you know the reason why he was late?" }
    ],

    dialogue: [
      { speaker: "A", chinese: "你认识那个在银行工作的人吗？", pinyin: "nǐ rèn shi nà gè zài yín háng gōng zuò de rén ma?", english: "Do you know the person who works at the bank?" },
      { speaker: "B", chinese: "认识啊，他是我大学同学。", pinyin: "rèn shi a, tā shì wǒ dà xué tóng xué.", english: "Yes, he was my college classmate." },
      { speaker: "A", chinese: "他上次帮我办业务的那个，服务很好。", pinyin: "tā shàng cì bāng wǒ bàn yè wù de nà gè, fú wù hěn hǎo.", english: "The one who helped me with business last time, his service was great." },
      { speaker: "B", chinese: "是啊，他一直都很靠谱。", pinyin: "shì a, tā yī zhí dōu hěn kào pǔ.", english: "Yeah, he's always reliable." },
    ],

    exercises: [
      { type: "fill-blank", question: "我___那本书在桌子上。", answer: "的" },
      { type: "matching", pairs: [{ chinese: "的", pinyin: "de", english: "relative clause marker" }, { chinese: "地方", pinyin: "dì fāng", english: "place" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Người đàn ông đang nói chuyện với cô ấy là sếp của tôi.", chinese: "正在和她说话的那个人是我的老板。", pinyin: "zhèng zài hé tā shuō huà de nà gè rén shì wǒ de lǎo bǎn." }
    ],
  },
  {
    id: 46,
level: "B2",
    title: "条件句",
    pinyin: "tiáo jiàn jù",
    topic: "Conditional Sentences",
    vocab: [
      { chinese: "如果", pinyin: "rú guǒ", english: "if" },
      { chinese: "就", pinyin: "jiù", english: "then" },
      { chinese: "只要", pinyin: "zhǐ yào", english: "as long as" },
      { chinese: "只有", pinyin: "zhǐ yǒu", english: "only if" },
      { chinese: "除非", pinyin: "chú fēi", english: "unless" },
      { chinese: "否则", pinyin: "fǒu zé", english: "otherwise" },
      { chinese: "要是", pinyin: "yào shì", english: "if (colloquial)" },
      { chinese: "假如", pinyin: "jiǎ rú", english: "suppose" },
      { chinese: "只要...就", pinyin: "zhǐ yào...jiù", english: "as long as...then" },
      { chinese: "不管...都", pinyin: "bù guǎn...dōu", english: "no matter...still" }
    ],

    sentences: [
      { chinese: "如果明天天晴，我们就去海边。", pinyin: "rú guǒ míng tiān tiān qíng, wǒ men jiù qù hǎi biān.", english: "If it's sunny tomorrow, we'll go to the beach." },
      { chinese: "只要你努力，就一定能成功。", pinyin: "zhǐ yào nǐ nǔ lì, jiù yī dìng néng chéng gōng.", english: "As long as you work hard, you will surely succeed." },
      { chinese: "只有你同意，我才会做。", pinyin: "zhǐ yǒu nǐ tóng yì, wǒ cái huì zuò.", english: "Only if you agree will I do it." },
      { chinese: "除非下雨，否则比赛照常进行。", pinyin: "chú fēi xià yǔ, fǒu zé bǐ sài zhào cháng jìn xíng.", english: "Unless it rains, the game will go on as usual." },
      { chinese: "不管多难，我都要试一下。", pinyin: "bù guǎn duō nán, wǒ dōu yào shì yī xià.", english: "No matter how difficult, I will try it." }
    ],

    dialogue: [
      { speaker: "A", chinese: "如果你中了彩票，你会辞职吗？", pinyin: "rú guǒ nǐ zhòng le cǎi piào, nǐ huì cí zhí ma?", english: "If you won the lottery, would you resign?" },
      { speaker: "B", chinese: "可能不会，除非是特别大奖。", pinyin: "kě néng bù huì, chú fēi shì tè bié dà jiǎng.", english: "Probably not, unless it's a huge jackpot." },
      { speaker: "A", chinese: "只要工作有意义，钱少点也没关系？", pinyin: "zhǐ yào gōng zuò yǒu yì yì, qián shǎo diǎn yě méi guān xì?", english: "As long as work is meaningful, less money doesn't matter?" },
      { speaker: "B", chinese: "对啊，我觉得开心最重要。", pinyin: "duì a, wǒ jué de kāi xīn zuì zhòng yào.", english: "Right, I think happiness is the most important." },
    ],

    exercises: [
      { type: "fill-blank", question: "___你努力，就___成功。", answer: "只要 / 就" },
      { type: "matching", pairs: [{ chinese: "除非", pinyin: "chú fēi", english: "unless" }, { chinese: "否则", pinyin: "fǒu zé", english: "otherwise" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Nếu trời mưa, tôi sẽ ở nhà.", chinese: "如果下雨，我就待在家里。", pinyin: "rú guǒ xià yǔ, wǒ jiù dāi zài jiā lǐ." }
    ],
  },
  {
    id: 47,
level: "B2",
    title: "成语俗语",
    pinyin: "chéng yǔ sú yǔ",
    topic: "Idiomatic Expressions",
    vocab: [
      { chinese: "成语", pinyin: "chéng yǔ", english: "Chinese idiom" },
      { chinese: "俗语", pinyin: "sú yǔ", english: "common saying" },
      { chinese: "一石二鸟", pinyin: "yī shí èr niǎo", english: "kill two birds with one stone" },
      { chinese: "画蛇添足", pinyin: "huà shé tiān zú", english: "draw legs on a snake – unnecessary" },
      { chinese: "对牛弹琴", pinyin: "duì niú tán qín", english: "cast pearls before swine" },
      { chinese: "亡羊补牢", pinyin: "wáng yáng bǔ láo", english: "better late than never" },
      { chinese: "塞翁失马", pinyin: "sài wēng shī mǎ", english: "a blessing in disguise" },
      { chinese: "入乡随俗", pinyin: "rù xiāng suí sú", english: "when in Rome, do as the Romans do" },
      { chinese: "马马虎虎", pinyin: "mǎ mǎ hǔ hǔ", english: "so-so" },
      { chinese: "七上八下", pinyin: "qī shàng bā xià", english: "anxious / unsettled" }
    ],

    sentences: [
      { chinese: "他学习中文，又交到朋友，真是一石二鸟。", pinyin: "tā xué xí zhōng wén, yòu jiāo dào péng yǒu, zhēn shì yī shí èr niǎo.", english: "He learns Chinese and makes friends – it's killing two birds with one stone." },
      { chinese: "这件事已经解决了，别再画蛇添足。", pinyin: "zhè jiàn shì yǐ jīng jiě jué le, bié zài huà shé tiān zú.", english: "This matter is already solved, don't add unnecessary details." },
      { chinese: "给他讲道理就像对牛弹琴。", pinyin: "gěi tā jiǎng dào lǐ jiù xiàng duì niú tán qín.", english: "Explaining reason to him is like casting pearls before swine." },
      { chinese: "虽然晚了，但亡羊补牢，为时未晚。", pinyin: "suī rán wǎn le, dàn wáng yáng bǔ láo, wéi shí wèi wǎn.", english: "Although it's late, it's better late than never." },
      { chinese: "没被录取其实是塞翁失马，后来找到了更好的工作。", pinyin: "méi bèi lù qǔ qí shí shì sài wēng shī mǎ, hòu lái zhǎo dào le gèng hǎo de gōng zuò.", english: "Not getting admitted was actually a blessing in disguise – later found a better job." }
    ],

    dialogue: [
      { speaker: "A", chinese: "明天要去新公司上班了，我心里七上八下的。", pinyin: "míng tiān yào qù xīn gōng sī shàng bān le, wǒ xīn lǐ qī shàng bā xià de.", english: "I'm going to work at a new company tomorrow, I feel anxious." },
      { speaker: "B", chinese: "别担心，入乡随俗，慢慢就适应了。", pinyin: "bié dān xīn, rù xiāng suí sú, màn màn jiù shì yìng le.", english: "Don't worry, when in Rome do as the Romans do, you'll adapt gradually." },
      { speaker: "A", chinese: "我中文说得还是马马虎虎。", pinyin: "wǒ zhōng wén shuō de hái shì mǎ mǎ hǔ hǔ.", english: "My Chinese is still just so-so." },
      { speaker: "B", chinese: "没关系，多练习就好了。", pinyin: "méi guān xì, duō liàn xí jiù hǎo le.", english: "It's okay, just practice more." },
    ],

    exercises: [
      { type: "fill-blank", question: "这个成语是“___补牢”。", answer: "亡羊" },
      { type: "matching", pairs: [{ chinese: "一石二鸟", pinyin: "yī shí èr niǎo", english: "kill two birds with one stone" }, { chinese: "画蛇添足", pinyin: "huà shé tiān zú", english: "draw legs on a snake" }],
 instruction: "Match the Chinese idioms with English" },
      { type: "translation", vietnamese: "Anh ấy làm việc chăm chỉ, nhưng chỉ được mức trung bình.", chinese: "他工作努力，但只是马马虎虎。", pinyin: "tā gōng zuò nǔ lì, dàn zhǐ shì mǎ mǎ hǔ hǔ." }
    ],
  },
  {
    id: 48,
level: "B2",
    title: "俚语口语",
    pinyin: "lǐ yǔ kǒu yǔ",
    topic: "Slang and Colloquial",
    vocab: [
      { chinese: "俚语", pinyin: "lǐ yǔ", english: "slang" },
      { chinese: "口语", pinyin: "kǒu yǔ", english: "colloquial speech" },
      { chinese: "牛逼", pinyin: "niú bī", english: "awesome (slang)" },
      { chinese: "靠谱", pinyin: "kào pǔ", english: "reliable" },
      { chinese: "不靠谱", pinyin: "bù kào pǔ", english: "unreliable" },
      { chinese: "给力", pinyin: "gěi lì", english: "impressive / awesome" },
      { chinese: "坑爹", pinyin: "kēng diē", english: "sucks / deceitful" },
      { chinese: "吓死宝宝了", pinyin: "xià sǐ bǎo bao le", english: "scared me to death (playful)" },
      { chinese: "土豪", pinyin: "tǔ háo", english: "rich person / nouveau riche" },
      { chinese: "聊天", pinyin: "liáo tiān", english: "chat" }
    ],

    sentences: [
      { chinese: "他太厉害了，真是牛逼！", pinyin: "tā tài lì hài le, zhēn shì niú bī!", english: "He's so amazing, really awesome!" },
      { chinese: "这个人很靠谱，你可以信任他。", pinyin: "zhè gè rén hěn kào pǔ, nǐ kě yǐ xìn rèn tā.", english: "This person is reliable, you can trust him." },
      { chinese: "今天的演唱会太给力了！", pinyin: "jīn tiān de yǎn chàng huì tài gěi lì le!", english: "Today's concert was awesome!" },
      { chinese: "这个网站真是坑爹，东西质量太差。", pinyin: "zhè gè wǎng zhàn zhēn shì kēng diē, dōng xi zhì liàng tài chà.", english: "This website sucks, the product quality is terrible." },
      { chinese: "你突然出现，吓死宝宝了。", pinyin: "nǐ tū rán chū xiàn, xià sǐ bǎo bao le.", english: "You suddenly appeared, scared me to death." }
    ],

    dialogue: [
      { speaker: "A", chinese: "新来的同事怎么样？", pinyin: "xīn lái de tóng shì zěn me yàng?", english: "How's the new colleague?" },
      { speaker: "B", chinese: "挺靠谱的，做事很给力。", pinyin: "tǐng kào pǔ de, zuò shì hěn gěi lì.", english: "Pretty reliable, his work is impressive." },
      { speaker: "A", chinese: "那就好，之前那个太坑爹了。", pinyin: "nà jiù hǎo, zhī qián nà gè tài kēng diē le.", english: "Good, the previous one was too unreliable." },
      { speaker: "B", chinese: "哈哈，别提了，咱们聊天吧。", pinyin: "hā hā, bié tí le, zán men liáo tiān ba.", english: "Haha, let's not talk about it, let's chat." },
    ],

    exercises: [
      { type: "fill-blank", question: "这个手机真___，功能很强大。", answer: "给力" },
      { type: "matching", pairs: [{ chinese: "靠谱", pinyin: "kào pǔ", english: "reliable" }, { chinese: "坑爹", pinyin: "kēng diē", english: "sucks" }],
 instruction: "Match the colloquial expressions" },
      { type: "translation", vietnamese: "Anh ấy rất ngầu (awesome).", chinese: "他太牛了。", pinyin: "tā tài niú le." }
    ],
  },
  {
    id: 49,
level: "B2",
    title: "辩论技巧",
    pinyin: "biàn lùn jì qiǎo",
    topic: "Debating Skills",
    vocab: [
      { chinese: "辩论", pinyin: "biàn lùn", english: "debate" },
      { chinese: "观点", pinyin: "guān diǎn", english: "point of view" },
      { chinese: "论据", pinyin: "lùn jù", english: "argument / evidence" },
      { chinese: "反驳", pinyin: "fǎn bó", english: "refute" },
      { chinese: "质询", pinyin: "zhì xún", english: "cross-examine" },
      { chinese: "立论", pinyin: "lì lùn", english: "establish an argument" },
      { chinese: "结论", pinyin: "jié lùn", english: "conclusion" },
      { chinese: "逻辑", pinyin: "luó ji", english: "logic" },
      { chinese: "说服", pinyin: "shuì fú", english: "persuade" },
      { chinese: "举例", pinyin: "jǔ lì", english: "give an example" }
    ],

    sentences: [
      { chinese: "你的观点很新颖，但论据不够充分。", pinyin: "nǐ de guān diǎn hěn xīn yǐng, dàn lùn jù bù gòu chōng fèn.", english: "Your viewpoint is novel, but the evidence is insufficient." },
      { chinese: "我想反驳你的第二个论点。", pinyin: "wǒ xiǎng fǎn bó nǐ de dì èr gè lùn diǎn.", english: "I'd like to refute your second argument." },
      { chinese: "请举例说明你的立场。", pinyin: "qǐng jǔ lì shuō míng nǐ de lì chǎng.", english: "Please give examples to illustrate your position." },
      { chinese: "辩论中逻辑清晰非常重要。", pinyin: "biàn lùn zhōng luó ji qīng xī fēi cháng zhòng yào.", english: "Clear logic is very important in a debate." },
      { chinese: "最终，我们得出了一个共同的结论。", pinyin: "zuì zhōng, wǒ men dé chū le yī gè gòng tóng de jié lùn.", english: "In the end, we reached a common conclusion." }
    ],

    dialogue: [
      { speaker: "A", chinese: "我认为网络利大于弊。", pinyin: "wǒ rèn wéi wǎng luò lì dà yú bì.", english: "I think the internet has more advantages than disadvantages." },
      { speaker: "B", chinese: "我反对。很多人沉迷网络浪费时间。", pinyin: "wǒ fǎn duì. hěn duō rén chén mí wǎng luò làng fèi shí jiān.", english: "I disagree. Many people waste time addicted to the internet." },
      { speaker: "A", chinese: "但是网络提高了工作效率。", pinyin: "dàn shì wǎng luò tí gāo le gōng zuò xiào lǜ.", english: "But the internet improves work efficiency." },
      { speaker: "B", chinese: "我承认这一点，但利与弊需要平衡。", pinyin: "wǒ chéng rèn zhè yī diǎn, dàn lì yǔ bì xū yào píng héng.", english: "I admit that, but advantages and disadvantages need balance." },
    ],

    exercises: [
      { type: "fill-blank", question: "辩论时要用___说服对方。", answer: "逻辑" },
      { type: "matching", pairs: [{ chinese: "反驳", pinyin: "fǎn bó", english: "refute" }, { chinese: "论据", pinyin: "lùn jù", english: "evidence" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Tôi muốn đưa ra một ví dụ để chứng minh quan điểm của mình.", chinese: "我想举一个例子来证明我的观点。", pinyin: "wǒ xiǎng jǔ yī gè lì zi lái zhèng míng wǒ de guān diǎn." }
    ],
  },
  {
    id: 50,
level: "B2",
    title: "总复习",
    pinyin: "zǒng fù xí",
    topic: "Final Comprehensive Review",
    vocab: [
      { chinese: "复习", pinyin: "fù xí", english: "review" },
      { chinese: "总结", pinyin: "zǒng jié", english: "summarize" },
      { chinese: "巩固", pinyin: "gǒng gù", english: "consolidate" },
      { chinese: "进步", pinyin: "jìn bù", english: "progress" },
      { chinese: "努力", pinyin: "nǔ lì", english: "effort" },
      { chinese: "收获", pinyin: "shōu huò", english: "gain" },
      { chinese: "掌握", pinyin: "zhǎng wò", english: "master" },
      { chinese: "运用", pinyin: "yùn yòng", english: "apply" },
      { chinese: "流利", pinyin: "liú lì", english: "fluent" },
      { chinese: "沟通", pinyin: "gōu tōng", english: "communicate" }
    ],

    sentences: [
      { chinese: "这个学期我们学到了很多新知识。", pinyin: "zhè gè xué qī wǒ men xué dào le hěn duō xīn zhī shi.", english: "This semester we learned a lot of new knowledge." },
      { chinese: "我需要复习一下之前学过的内容。", pinyin: "wǒ xū yào fù xí yī xià zhī qián xué guò de nèi róng.", english: "I need to review the content I learned before." },
      { chinese: "通过练习，我的中文进步很大。", pinyin: "tōng guò liàn xí, wǒ de zhōng wén jìn bù hěn dà.", english: "Through practice, my Chinese has improved a lot." },
      { chinese: "我希望自己能更流利地用中文沟通。", pinyin: "wǒ xī wàng zì jǐ néng gèng liú lì dì yòng zhōng wén gōu tōng.", english: "I hope I can communicate more fluently in Chinese." },
      { chinese: "总结一下，学好语言需要毅力和方法。", pinyin: "zǒng jié yī xià, xué hǎo yǔ yán xū yào yì lì hé fāng fǎ.", english: "To sum up, learning a language well requires perseverance and methods." }
    ],

    dialogue: [
      { speaker: "A", chinese: "学完了这三十课，你觉得收获大吗？", pinyin: "xué wán le zhè sān shí kè, nǐ jué de shōu huò dà ma?", english: "After finishing these thirty lessons, do you think you've gained a lot?" },
      { speaker: "B", chinese: "当然啦，我的口语和听力都进步了。", pinyin: "dāng rán la, wǒ de kǒu yǔ hé tīng lì dōu jìn bù le.", english: "Of course, my speaking and listening have improved." },
      { speaker: "A", chinese: "我们还需要继续巩固。", pinyin: "wǒ men hái xū yào jì xù gǒng gù.", english: "We still need to continue consolidating." },
      { speaker: "B", chinese: "没错，一起加油吧！", pinyin: "méi cuò, yī qǐ jiā yóu ba!", english: "Right, let's work hard together!" },
    ],

    exercises: [
      { type: "fill-blank", question: "学语言要经常___。", answer: "复习" },
      { type: "matching", pairs: [{ chinese: "流利", pinyin: "liú lì", english: "fluent" }, { chinese: "沟通", pinyin: "gōu tōng", english: "communicate" }],
 instruction: "Match the Chinese with English" },
      { type: "translation", vietnamese: "Chúc bạn học tiếng Trung thành công!", chinese: "祝你学习中文成功！", pinyin: "zhù nǐ xué xí zhōng wén chéng gōng!" }
    ],
  },
  {
    id: 51,
    level: "B2",
    category: "fluency",
    title: "请假回越南探亲",
    pinyin: "qǐng jià huí yuè nán tàn qīn",
    topic: "Requesting leave to visit family in Vietnam",
    title_vi: "Xin nghỉ phép về Việt Nam thăm gia đình",
    title_en: "Requesting extended leave to visit family in Vietnam",
    sentences: [
      {
        chinese: "王经理, 我有件私事想向您汇报。",
        pinyin: "Wáng jīnglǐ, wǒ yǒu jiàn sī shì xiǎng xiàng nín huìbào.",
        english: "Manager Wang, I have a personal matter I'd like to report to you.",
        vi: "Anh Vương, em có việc riêng muốn báo cáo với anh.",
        pronunciation_focus: ["您 → nín thanh 2 (KHÔNG phải nǐ)", "汇报 → huìbào (formal: 'báo cáo cấp trên')", "私事 → sī shì (việc riêng)", "经理 → jīnglǐ (chức danh, đứng sau họ)"]
      },
      {
        chinese: "我母亲身体出了状况, 需要我回越南陪她一段时间。",
        pinyin: "Wǒ mǔqīn shēntǐ chū le zhuàngkuàng, xūyào wǒ huí yuè nán péi tā yīduàn shíjiān.",
        english: "My mother has had a health issue; I need to return to Vietnam to be with her for a while.",
        vi: "Mẹ em có vấn đề sức khỏe, em cần về Việt Nam ở cạnh bà một thời gian.",
        pronunciation_focus: ["出了状况 → chū le zhuàngkuàng (cụm cố định: 'có chuyện/vấn đề xảy ra')", "陪 → péi thanh 2 (đi cùng/chăm sóc)", "一段时间 → yīduàn shíjiān (một quãng thời gian — vague intentionally)", "母亲 → mǔqīn (formal hơn 妈妈)"]
      },
      {
        chinese: "请问可以请三到四周的事假吗? 我愿意以无薪形式办理。",
        pinyin: "Qǐng wèn kěyǐ qǐng sān dào sì zhōu de shì jià ma? Wǒ yuànyì yǐ wú xīn xíngshì bànlǐ.",
        english: "May I request 3-4 weeks personal leave? I'm willing to take it as unpaid.",
        vi: "Em có thể xin nghỉ phép 3 đến 4 tuần được không? Em sẵn sàng làm theo hình thức không lương.",
        pronunciation_focus: ["事假 → shì jià (việc riêng — KHÔNG phải 病假 bìng jià là nghỉ ốm)", "无薪 → wú xīn (không lương)", "形式 → xíngshì (hình thức/cách thức)", "办理 → bànlǐ (xử lý chính thức qua thủ tục)"]
      },
      {
        chinese: "我会提前安排好工作交接, 确保不影响项目进度。",
        pinyin: "Wǒ huì tíqián ānpái hǎo gōngzuò jiāojiē, quèbǎo bù yǐngxiǎng xiàngmù jìndù.",
        english: "I'll arrange the work handover in advance to ensure project progress isn't affected.",
        vi: "Em sẽ sắp xếp bàn giao công việc trước, đảm bảo không ảnh hưởng tiến độ dự án.",
        pronunciation_focus: ["提前 → tíqián thanh 2-2 (sớm hơn dự định)", "工作交接 → gōngzuò jiāojiē (bàn giao công việc — cụm chuẩn)", "项目进度 → xiàngmù jìndù (tiến độ dự án)", "确保 → quèbǎo (đảm bảo — formal)"]
      },
      {
        chinese: "给您和团队添麻烦了, 实在是情非得已。",
        pinyin: "Gěi nín hé tuánduì tiān máfan le, shízài shì qíng fēi dé yǐ.",
        english: "Sorry to cause trouble for you and the team — circumstances really force my hand.",
        vi: "Em đã gây phiền hà cho anh và cả team, thật sự là bất đắc dĩ.",
        pronunciation_focus: ["添麻烦 → tiān máfan thanh 1-2-2 (gây phiền — cụm lễ phép)", "情非得已 → qíng fēi dé yǐ (idiom 4 chữ: bất đắc dĩ)", "实在 → shízài (thật sự, thành thật)", "团队 → tuánduì (team/đội)"]
      }
    ],
    vocab: [
      { chinese: "请假", pinyin: "qǐng jià", english: "to request leave", vi: "xin nghỉ phép" },
      { chinese: "探亲", pinyin: "tàn qīn", english: "visit family (especially distant relatives)", vi: "về thăm gia đình" },
      { chinese: "事假", pinyin: "shì jià", english: "personal leave (vs sick leave 病假)", vi: "nghỉ phép việc riêng" },
      { chinese: "无薪假", pinyin: "wú xīn jià", english: "unpaid leave", vi: "nghỉ không lương" },
      { chinese: "家事", pinyin: "jiā shì", english: "family matter", vi: "chuyện gia đình" },
      { chinese: "体谅", pinyin: "tǐ liàng", english: "to understand sympathetically", vi: "thông cảm" },
      { chinese: "添麻烦", pinyin: "tiān má fan", english: "to cause trouble (set polite phrase)", vi: "gây phiền hà" },
      { chinese: "工作交接", pinyin: "gōng zuò jiāo jiē", english: "work handover", vi: "bàn giao công việc" },
      { chinese: "远程协助", pinyin: "yuǎn chéng xié zhù", english: "remote assistance", vi: "hỗ trợ từ xa" },
      { chinese: "情非得已", pinyin: "qíng fēi dé yǐ", english: "circumstances force one's hand (4-char idiom)", vi: "bất đắc dĩ" }
    ],
    dialogue: [
      { speaker: "Linh", chinese: "王经理, 我有件私事想跟您商量一下。", pinyin: "Wáng jīnglǐ, wǒ yǒu jiàn sī shì xiǎng gēn nín shāngliang yīxià.", english: "Manager Wang, I have a personal matter I'd like to discuss with you.", vi: "Anh Vương, em có việc riêng muốn thảo luận với anh." },
      { speaker: "王经理", chinese: "你说, 没事。是工作上的还是私事?", pinyin: "Nǐ shuō, méi shì. Shì gōngzuò shàng de háishì sī shì?", english: "Go ahead. Is it about work or a personal matter?", vi: "Em nói đi, không sao. Là chuyện công việc hay việc riêng?" },
      { speaker: "Linh", chinese: "是私事。我母亲身体不太好, 我想请假回越南陪她。", pinyin: "Shì sī shì. Wǒ mǔqīn shēntǐ bù tài hǎo, wǒ xiǎng qǐng jià huí yuè nán péi tā.", english: "It's personal. My mother isn't well; I'd like to take leave to return to Vietnam to be with her.", vi: "Là việc riêng. Mẹ em sức khỏe không tốt, em muốn xin nghỉ phép về Việt Nam ở cạnh bà." },
      { speaker: "王经理", chinese: "这是大事, 应该的。你尽快把工作交接安排好就行。", pinyin: "Zhè shì dà shì, yīnggāi de. Nǐ jǐnkuài bǎ gōngzuò jiāojiē ānpái hǎo jiù xíng.", english: "This is important — of course. Just arrange the handover as quickly as possible.", vi: "Đây là chuyện quan trọng, đương nhiên rồi. Em sắp xếp bàn giao công việc càng sớm càng tốt là được." }
    ],
    dialogue_long: [
      { speaker: "Linh", chinese: "王经理, 您现在方便吗? 我有件私事想向您汇报。", pinyin: "Wáng jīnglǐ, nín xiànzài fāngbiàn ma? Wǒ yǒu jiàn sī shì xiǎng xiàng nín huìbào.", english: "Manager Wang, is now a convenient time? I have a personal matter I'd like to report to you.", vi: "Anh Vương, bây giờ anh có rảnh không? Em có việc riêng muốn báo cáo với anh." },
      { speaker: "王经理", chinese: "你说, 我现在有时间。坐下吧。", pinyin: "Nǐ shuō, wǒ xiànzài yǒu shíjiān. Zuò xià ba.", english: "Go ahead, I have time now. Have a seat.", vi: "Em nói đi, bây giờ anh có thời gian. Em ngồi đi." },
      { speaker: "Linh", chinese: "是这样的, 我母亲在越南突然病了, 需要做手术。我想请假回去陪她一段时间。", pinyin: "Shì zhèyàng de, wǒ mǔqīn zài yuè nán tūrán bìng le, xūyào zuò shǒushù. Wǒ xiǎng qǐng jià huí qù péi tā yīduàn shíjiān.", english: "It's like this — my mother in Vietnam has fallen ill suddenly and needs surgery. I'd like to take leave to return and be with her for a while.", vi: "Là thế này, mẹ em ở Việt Nam đột nhiên bị bệnh, cần phẫu thuật. Em muốn xin nghỉ phép về ở cạnh bà một thời gian." },
      { speaker: "王经理", chinese: "啊, 这事大了。严重吗? 是急诊还是?", pinyin: "À, zhè shì dà le. Yánzhòng ma? Shì jízhěn háishì?", english: "Ah, this is serious. Is it grave? Is it an emergency?", vi: "À, chuyện này lớn rồi. Nghiêm trọng không? Là cấp cứu hay?" },
      { speaker: "Linh", chinese: "不算急诊, 但是医生建议家人陪护。我哥姐都不在国内, 只能我回去。", pinyin: "Bù suàn jízhěn, dànshì yīshēng jiànyì jiārén péi hù. Wǒ gē jiě dōu bù zài guónèi, zhǐ néng wǒ huí qù.", english: "Not exactly emergency, but the doctor recommends family caregivers. My older brother and sister aren't in the country, so it has to be me.", vi: "Không tính cấp cứu, nhưng bác sĩ khuyến nghị có người nhà chăm. Anh chị em không ai ở Việt Nam, chỉ có em về được." },
      { speaker: "王经理", chinese: "我明白。那你打算请多久?", pinyin: "Wǒ míngbái. Nà nǐ dǎsuàn qǐng duō jiǔ?", english: "I understand. So how long are you planning to take?", vi: "Anh hiểu rồi. Vậy em định nghỉ bao lâu?" },
      { speaker: "Linh", chinese: "我想请三到四周, 以无薪形式办理。如果您觉得太长, 三周也可以。", pinyin: "Wǒ xiǎng qǐng sān dào sì zhōu, yǐ wú xīn xíngshì bànlǐ. Rúguǒ nín juéde tài cháng, sān zhōu yě kěyǐ.", english: "I'd like to take 3-4 weeks, processed as unpaid. If you think it's too long, 3 weeks is also fine.", vi: "Em muốn xin 3 đến 4 tuần, làm theo hình thức không lương. Nếu anh thấy quá dài, 3 tuần cũng được." },
      { speaker: "王经理", chinese: "三周到四周... 这段时间正好是Q4冲刺, 项目进度比较紧。", pinyin: "Sān zhōu dào sì zhōu... zhè duàn shíjiān zhènghǎo shì Q4 chōngcì, xiàngmù jìndù bǐjiào jǐn.", english: "3 to 4 weeks... this period happens to be the Q4 sprint, project schedules are quite tight.", vi: "3 đến 4 tuần... khoảng thời gian này đúng là Q4 nước rút, tiến độ dự án khá gấp." },
      { speaker: "Linh", chinese: "我完全理解您的顾虑。我已经想好了交接方案: 张明可以接手日常运营, 我把所有文档整理好, 留下详细操作手册。", pinyin: "Wǒ wánquán lǐjiě nín de gùlǜ. Wǒ yǐjīng xiǎng hǎo le jiāojiē fāng'àn: Zhāng Míng kěyǐ jiēshǒu rìcháng yùnyíng, wǒ bǎ suǒyǒu wéndàng zhěnglǐ hǎo, liú xià xiángxì cāozuò shǒucè.", english: "I completely understand your concerns. I've already planned the handover: Zhang Ming can take over daily operations; I'll organize all the documents and leave a detailed operations manual.", vi: "Em hoàn toàn hiểu mối lo của anh. Em đã nghĩ xong phương án bàn giao: Trương Minh có thể tiếp quản vận hành hàng ngày, em sẽ chuẩn bị tất cả tài liệu và để lại sổ tay vận hành chi tiết." },
      { speaker: "王经理", chinese: "张明经验够吗? 万一有突发情况呢?", pinyin: "Zhāng Míng jīngyàn gòu ma? Wànyī yǒu tūfā qíngkuàng ne?", english: "Is Zhang Ming experienced enough? What if something unexpected comes up?", vi: "Trương Minh kinh nghiệm có đủ không? Lỡ có tình huống đột xuất thì sao?" },
      { speaker: "Linh", chinese: "我可以每天晚上越南时间花一小时远程协助, 紧急情况可以微信联系。我会提前把所有关键节点的负责人都安排好。", pinyin: "Wǒ kěyǐ měi tiān wǎnshàng yuè nán shíjiān huā yī xiǎoshí yuǎnchéng xiézhù, jǐnjí qíngkuàng kěyǐ wēixìn liánxì. Wǒ huì tíqián bǎ suǒyǒu guānjiàn jiédiǎn de fùzérén dōu ānpái hǎo.", english: "I can spend an hour each evening (Vietnam time) on remote assistance; for emergencies, WeChat is fine. I'll arrange responsible owners for every critical milestone in advance.", vi: "Em có thể dành mỗi tối giờ Việt Nam một tiếng để hỗ trợ từ xa, trường hợp khẩn có thể liên hệ WeChat. Em sẽ sắp xếp trước người phụ trách cho mọi mốc quan trọng." },
      { speaker: "王经理", chinese: "这样啊。那我们这样, 你请三周, 然后看情况, 如果家里没问题就准时回来。", pinyin: "Zhèyàng a. Nà wǒmen zhèyàng, nǐ qǐng sān zhōu, ránhòu kàn qíngkuàng, rúguǒ jiā lǐ méi wèntí jiù zhǔnshí huílái.", english: "I see. Let's do this — you take 3 weeks, then we'll see; if things at home are okay, you come back on time.", vi: "Vậy à. Mình làm thế này: em nghỉ 3 tuần, sau đó xem tình hình, nếu nhà ổn thì quay lại đúng hẹn." },
      { speaker: "Linh", chinese: "好的, 三周可以。非常感谢您的体谅。", pinyin: "Hǎo de, sān zhōu kěyǐ. Fēicháng gǎnxiè nín de tǐliàng.", english: "Okay, 3 weeks works. Thank you so much for your understanding.", vi: "Được, 3 tuần được. Em rất cảm ơn anh đã thông cảm." },
      { speaker: "王经理", chinese: "客气了。家里事情大于天, 这个谁都能理解。你打算什么时候出发?", pinyin: "Kèqì le. Jiā lǐ shìqíng dà yú tiān, zhège shéi dōu néng lǐjiě. Nǐ dǎsuàn shénme shíhou chūfā?", english: "Don't mention it. Family matters are above all else — anyone can understand that. When are you planning to leave?", vi: "Khách sáo quá. Chuyện gia đình lớn hơn trời, ai cũng hiểu. Em định khi nào đi?" },
      { speaker: "Linh", chinese: "我希望能下周一出发。这周我把所有事情交接清楚。", pinyin: "Wǒ xīwàng néng xià zhōu yī chūfā. Zhè zhōu wǒ bǎ suǒyǒu shìqíng jiāojiē qīngchu.", english: "I hope to leave next Monday. This week I'll get everything handed over clearly.", vi: "Em mong có thể đi vào thứ Hai tuần sau. Tuần này em sẽ bàn giao mọi việc rõ ràng." },
      { speaker: "王经理", chinese: "行。那这周我们安排一次团队会议, 你给大家说明一下情况, 然后细化交接方案。回来以后, 你给我一份完整的总结报告。", pinyin: "Xíng. Nà zhè zhōu wǒmen ānpái yī cì tuánduì huìyì, nǐ gěi dàjiā shuōmíng yīxià qíngkuàng, ránhòu xìhuà jiāojiē fāng'àn. Huí lái yǐhòu, nǐ gěi wǒ yī fèn wánzhěng de zǒngjié bàogào.", english: "Alright. So this week we'll schedule a team meeting where you explain the situation and finalize the handover plan. After you return, give me a complete summary report.", vi: "Được. Vậy tuần này mình sắp xếp một cuộc họp team, em giải thích tình hình cho mọi người, rồi chi tiết hóa kế hoạch bàn giao. Sau khi về, em đưa anh một báo cáo tổng kết đầy đủ." },
      { speaker: "Linh", chinese: "没问题, 我一定办妥。给您和团队添麻烦了, 实在是情非得已。", pinyin: "Méi wèntí, wǒ yīdìng bàn tuǒ. Gěi nín hé tuánduì tiān máfan le, shízài shì qíng fēi dé yǐ.", english: "No problem, I'll definitely handle it properly. Sorry for causing trouble to you and the team — it's really circumstances forcing my hand.", vi: "Không vấn đề gì, em chắc chắn sẽ làm chu đáo. Đã gây phiền hà cho anh và cả team, thật sự là bất đắc dĩ." },
      { speaker: "王经理", chinese: "别这么说。家家有本难念的经, 大家互相理解就好。你回去好好照顾母亲, 工作的事不用太担心。", pinyin: "Bié zhème shuō. Jiā jiā yǒu běn nán niàn de jīng, dàjiā hùxiāng lǐjiě jiù hǎo. Nǐ huí qù hǎohǎo zhàogù mǔqīn, gōngzuò de shì bù yòng tài dānxīn.", english: "Don't say that. Every family has its own hard sutra to chant — as long as we all understand each other, that's enough. Go back and take good care of your mother; don't worry too much about work.", vi: "Đừng nói thế. Nhà nào chẳng có chuyện khó riêng, mọi người hiểu nhau là được. Em về chăm sóc mẹ cho tốt, chuyện công việc không cần lo nhiều." }
    ],
    roleplay_prompts: [
      "Sếp ban đầu từ chối thẳng vì đang Q4 và một dự án lớn đến hạn cuối tháng. Hãy thuyết phục bằng cách dùng cụm 情非得已, mô tả tình huống gia đình cụ thể (đủ để hiểu nhưng không quá riêng tư), và đưa ra kế hoạch bàn giao chi tiết — tên người tiếp quản, ngày bắt đầu/kết thúc, cách hỗ trợ từ xa, kênh liên lạc khẩn.",
      "Sếp đề nghị tăng tiền thưởng cuối năm để bạn ở lại không nghỉ. Hãy từ chối khéo léo bằng cụm '您的好意我心领了, 但是这件事我必须回去' — vẫn giữ thiện cảm, không làm sếp cảm thấy đề nghị bị đập thẳng. Nếu phù hợp, dùng 网开一面 để xin sếp châm chước. Không kéo cuộc đàm phán quá 3 lượt.",
      "Bạn đã về Việt Nam được 1 tuần thì sếp gọi WeChat hỏi liệu có thể quay lại sớm hơn 1 tuần được không vì có sự cố khẩn ở dự án. Hãy quyết định CÓ/KHÔNG và phản hồi bằng tiếng Trung công sở — bao gồm lý do nếu từ chối + đề xuất giải pháp thay thế (remote, ai có thể xử lý), hoặc kế hoạch quay lại nếu đồng ý."
    ],
    register_notes: "Trong tiếng Trung công sở, sự lựa chọn 您 (nín — kính ngữ 'ngài/anh chị/quý vị') vs 你 (nǐ — 'bạn/anh/em') là hành động đầu tiên báo hiệu cấp bậc và sự tôn trọng. Trong cuộc nói chuyện này, Linh dùng 您 với 王经理 từ đầu đến cuối — không một lần nào rớt xuống 你. Đây là quy tắc bắt buộc khi nói với sếp, đặc biệt sếp lớn tuổi hoặc trong cuộc gặp chính thức. Khác Pháp/Đức (nơi 'vous'/'Sie' có thể chuyển sang 'tu'/'du' sau thời gian thân quen), người Trung Quốc nói chung KHÔNG bao giờ chuyển từ 您 xuống 你 với cấp trên trong môi trường công sở — kể cả sau nhiều năm làm việc cùng. Nếu sếp Trung Quốc bảo 'cứ gọi tôi là Lão Trương' (你叫我老张就行) — đó là dấu hiệu đặc biệt về sự gần gũi cá nhân, nhưng đa số trường hợp vẫn nên giữ kính ngữ trong các cuộc nói chuyện chính thức.\n\nNgược lại, sếp dùng 你 với nhân viên — đó là chuẩn mực, không phải thiếu tôn trọng. Trong dialogue_long bạn sẽ thấy 王经理 nói '你说' (anh nói đi), '你打算请多久' — đây là 你 cấp trên dùng với cấp dưới, không có ý hạ thấp. Đừng cảm thấy bị xúc phạm.\n\nKhái niệm 面子 (miànzi — 'thể diện') chi phối toàn bộ cuộc nói chuyện này. Có hai mặt:\n\n(1) '给面子' (gěi miànzi — cho thể diện) — bạn phải để sếp có không gian đồng ý mà không cảm thấy bị ép. Đó là lý do mở đầu bằng '我有件私事想向您汇报' thay vì nói thẳng '我要请假'. Cụm 汇报 (báo cáo) hạ vai bạn xuống và nâng sếp lên (sếp có quyền quyết định, không bị bắt đáp ứng).\n\n(2) '丢面子' (diū miànzi — mất thể diện) — tránh để sếp mất mặt trước team. Nếu sếp đã đồng ý cho 3 tuần và bạn xin thêm, đừng đòi hỏi qua email cc cả phòng — phải gặp riêng. Nếu sếp pushback, đừng cãi lý — chuyển sang 商量 (thảo luận, đàm phán nhẹ) bằng cụm '您看这样行不行...' (anh xem thế này có được không).\n\nTuyệt đối tránh: (a) Nói thẳng '我必须' (tôi phải) — nghe như tối hậu thư; thay bằng '我希望能...' hoặc '您看可不可以...'; (b) Đề cập số ngày/yêu cầu trước khi giải thích lý do — sếp Trung Quốc xử lý theo trật tự bối cảnh→cảm xúc→đề xuất, đảo ngược trật tự này bị coi là transactional, lạnh lùng; (c) Pháp/Đức không có cấu trúc 面子 tương đương — đừng copy mẫu Pháp ('je souhaiterais aborder') hoặc Đức ('ich möchte Klartext reden') sang Trung. Trung Quốc cần MỀM HƠN nhiều, gián tiếp hơn nhiều — Pháp trực tiếp được đọc là confident; Trung Quốc trực tiếp được đọc là vô lễ.",
    idiom_glosses: [
      {
        idiom: "情非得已",
        literal: "tình cảnh không có đường nào khác (qíng fēi dé yǐ)",
        meaning: "Bất đắc dĩ — hoàn cảnh ép buộc, không phải do mình chọn. Dùng để xin lỗi khi mình phải làm điều gây phiền hà cho người khác mà nguyên nhân nằm ngoài tầm kiểm soát của mình. Cụm này chuyển trách nhiệm từ 'lựa chọn cá nhân' sang 'hoàn cảnh' — một cách lịch sự để xin sự thông cảm. Đây là cụm CHÌA KHÓA cho mọi cuộc xin nghỉ/xin phá lệ trong tiếng Trung công sở.",
        example: "给您和团队添麻烦了, 实在是情非得已。"
      },
      {
        idiom: "家家有本难念的经",
        literal: "nhà nào cũng có một quyển kinh khó tụng (jiā jiā yǒu běn nán niàn de jīng)",
        meaning: "Mỗi gia đình đều có vấn đề riêng, không ai được miễn nỗi khổ. Sếp dùng cụm này khi muốn báo hiệu sự thông cảm và đồng cảm: 'anh hiểu, ai cũng có việc nhà'. Đây là cách sếp Trung Quốc thể hiện humanity mà không phá vỡ formality của môi trường công sở. Khi sếp nói cụm này với bạn, đó là tín hiệu đèn xanh — cuộc đàm phán đã kết thúc thuận lợi.",
        example: "别这么说。家家有本难念的经, 大家互相理解就好。"
      },
      {
        idiom: "网开一面",
        literal: "mở một mặt của lưới — để con vật chạy thoát (wǎng kāi yī miàn)",
        meaning: "Châm chước, mở đường — bỏ qua một quy tắc/phá lệ cho ai đó trong hoàn cảnh đặc biệt. Đây là cụm bạn DÙNG khi xin sếp thể tất, hoặc cụm sếp DÙNG khi đồng ý phá lệ cho bạn. Nguồn gốc: vua Thành Tang thời Thương ra lệnh chỉ giăng lưới ba phía thay vì bốn phía để chim thú có đường thoát — biểu trưng cho lòng nhân từ.",
        example: "这次情况特殊, 还请王经理网开一面, 让我多请一周。"
      },
      {
        idiom: "推心置腹",
        literal: "đẩy tim vào bụng người khác (tuī xīn zhì fù)",
        meaning: "Nói chuyện chân thành, mở lòng — không giấu giếm, không vòng vo. Dùng khi cuộc nói chuyện đã đến độ tin tưởng đủ để bộc lộ thật. Trong context xin nghỉ, sếp có thể dùng cụm này để mời bạn nói thật ('我们推心置腹地谈一谈' — chúng ta nói chân thành nhé). Khác 腹を割って話す (Nhật) ở chỗ này NHẸ HƠN, ít kịch tính hơn — chỉ là báo hiệu 'nói thật đi, tôi nghe'.",
        example: "既然你都说了, 那我们就推心置腹地谈一谈。"
      }
    ],
    cultural_notes_vi: "Văn hóa công sở Trung Quốc xem việc về quê chăm gia đình là một trong những lý do chính đáng nhất để xin nghỉ — bắt nguồn từ giá trị 孝道 (xiàodào — đạo hiếu). Khi bạn nói '母亲身体不太好' (mẹ tôi sức khỏe không tốt), gần như mọi sếp Trung Quốc thế hệ trước sẽ hiểu và chấp nhận, vì văn hóa Khổng giáo đặt nghĩa vụ với cha mẹ trên hầu hết các nghĩa vụ khác — bao gồm công việc. Khác biệt với Việt Nam: ở Việt Nam, lý do 'gia đình' cũng được chấp nhận nhưng thường gắn với 'lễ tết' hoặc 'đám cưới'; ở Trung Quốc, 'thăm bệnh cha mẹ' được trọng vọng đặc biệt và gần như không bị chất vấn lý do.\n\nTuy nhiên, KHÔNG có nghĩa là dễ dãi — người Trung Quốc vẫn sẽ đo 'thể diện' (面子) qua cách bạn xử lý quá trình. Sáu quy tắc:\n\n(1) Báo càng SỚM càng tốt — 越早越好 (yuè zǎo yuè hǎo). Báo trước 1-2 ngày là xúc phạm trầm trọng; báo trước 2-3 tuần là chuẩn; báo trước 1 tháng là lý tưởng. Báo qua tin nhắn WeChat sẽ bị coi là không trang trọng — phải gọi điện hoặc gặp trực tiếp, sau đó mới gửi văn bản chính thức qua hệ thống HR.\n\n(2) Đừng giải thích quá nhiều chi tiết riêng tư. Sếp Trung Quốc tôn trọng 'có chuyện riêng' hơn là biết tỉ mỉ. Nói '母亲身体出了状况, 需要照顾' là đủ — không cần kể bệnh gì, ai chăm, chi tiết bác sĩ. Quá nhiều chi tiết = nghi ngờ lý do thật.\n\n(3) PHẢI có kế hoạch bàn giao TRƯỚC khi xin nghỉ — không thể vừa xin vừa hỏi 'ai sẽ làm thay em'. Đó là trách nhiệm của bạn, không phải sếp. Đề xuất tên cụ thể, có hướng dẫn chi tiết, cam kết hỗ trợ từ xa = cách duy nhất để sếp đồng ý mà không mất thể diện.\n\n(4) Luôn bao gồm cụm '添麻烦了' (tiān máfan le — gây phiền hà) — đây không phải xin lỗi mà là dấu hiệu lễ phép tiêu chuẩn. Thiếu nó sẽ bị coi là vô tâm, không biết điều.\n\n(5) Sau khi quay lại, BẮT BUỘC mang quà nhỏ (土特产 tǔtèchǎn — đặc sản quê hương) cho team — đó là 礼尚往来 (lǐ shàng wǎng lái — qua lại có lễ). Không cần đắt tiền, chỉ cần biểu trưng. Bỏ qua bước này sẽ bị nhớ rất lâu trong văn hóa workplace Trung Quốc.\n\n(6) Tuần đầu sau khi quay lại, viết một báo cáo tóm tắt cho sếp — không cần dài, chỉ cần 'tôi đã quay lại, mọi thứ ổn, cảm ơn anh đã cho phép' + cập nhật về việc tiếp quản các dự án. Đây là đóng vòng tròn giao tiếp.\n\nKhác biệt cơ bản với Pháp/Đức/Việt:\n- Pháp: xin nghỉ là quyền hợp đồng (entitled time off) → đàm phán dựa trên dữ liệu;\n- Đức: xin nghỉ là quá trình formal có quy tắc → tuân thủ luật và process;\n- Việt Nam: xin nghỉ là chuyện cá nhân giữa nhân viên và sếp → tương đối linh hoạt;\n- Trung Quốc: xin nghỉ là một sự BAN ƠN từ sếp → cần đáp lại bằng 'thể diện' (làm tròn trách nhiệm trước/sau, mang quà, viết báo cáo).\n\nHiểu khung này sẽ giúp người Việt làm việc ở Trung Quốc tránh hai cái bẫy phổ biến: (1) cứng nhắc theo phong cách Pháp/Đức ('đây là quyền của tôi') — bị coi là vô lễ; (2) quá linh hoạt theo phong cách Việt ('em báo gấp lát ạ') — bị coi là thiếu chuyên nghiệp.",
    tip_advice_vi: "(1) Mở đầu KHÔNG nói thẳng '请假'. Bắt đầu bằng '王经理, 我有件私事想向您汇报' hoặc '您现在方便吗? 我想跟您商量一下' — cho sếp không gian chuẩn bị tâm lý. Cụm 商量 (shāngliang — thảo luận) làm nhẹ tone hơn 请示 (qǐngshì — xin chỉ thị); cụm 汇报 (huìbào — báo cáo) hạ vai bạn xuống, nâng sếp lên.\n\n(2) Nói lý do TRƯỚC, yêu cầu SAU. Người Trung Quốc xử lý theo trật tự: bối cảnh → cảm xúc → đề xuất. Nói thẳng 'tôi cần nghỉ 3 tuần' trước khi giải thích lý do sẽ bị coi là transactional, lạnh lùng. Trật tự đúng: '母亲身体出了状况' → '需要我回去陪她' → '想请三到四周事假'.\n\n(3) Khi sếp pushback (gần như chắc chắn sẽ có, ít nhất một lần), đừng phản pháo bằng '我必须'. Dùng '我也很为难, 但是情非得已' (tôi cũng khó xử nhưng bất đắc dĩ) — báo hiệu bạn cũng cảm nhận vấn đề về phía sếp, và mượn cụm 情非得已 để chuyển trách nhiệm sang hoàn cảnh, không phải lựa chọn cá nhân. Sếp sẽ thấy bạn không bướng bỉnh.\n\n(4) Đề xuất luôn cụ thể: tên người tiếp quản, ngày bắt đầu/kết thúc, kế hoạch hỗ trợ từ xa, cách liên lạc khẩn cấp. Sếp Trung Quốc đánh giá cao sự CHỦ ĐỘNG hơn sự tuân lệnh. Đừng chỉ phàn nàn rồi đợi sếp giải quyết — sẽ bị coi là không có năng lực.\n\n(5) Đáp ứng cảm xúc của sếp. Nếu sếp lo lắng về dự án, nói '我理解您的顾虑' (em hiểu mối quan tâm của anh, wǒ lǐjiě nín de gùlǜ). Nếu sếp tỏ ra thông cảm, nói '感谢您的体谅' (cảm ơn anh đã thấu hiểu, gǎnxiè nín de tǐliàng). Lờ đi cảm xúc của sếp = bị coi là không nhạy cảm — một điểm trừ lớn trong văn hóa Trung Quốc.\n\n(6) Câu chốt PHẢI là cảm ơn — không phải '好的, 那就这样' (OK, vậy quyết định thế) mà là '非常感谢您的支持, 我会做好交接' (rất cảm ơn sự ủng hộ của anh, em sẽ bàn giao tốt). Đóng vòng tròn bằng cảm xúc tích cực.\n\n(7) Mẹo phát âm cuối cho người Việt: 您 (nín, thanh 2 — đi lên) khác 你 (nǐ, thanh 3 — xuống rồi lên). Sai thanh điệu sẽ làm rớt formal register ngay. Tập đọc to '您好' '您看' '您觉得' nhiều lần trước cuộc gặp. Cụm 4 chữ idiom 情非得已 cũng cần luyện thanh điệu (qíng-fēi-dé-yǐ = 2-1-2-3) — đọc sai sẽ bị nghe nhầm hoặc không hiểu.",
    exercises: [
      { type: "fill-blank", question: "给您和团队添麻烦了, 实在是 ___ 。", answer: "情非得已" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung công sở với nghĩa tiếng Việt phù hợp khi xin nghỉ phép.",
        pairs: [
          { chinese: "请假", pinyin: "qǐng jià", english: "xin nghỉ phép" },
          { chinese: "情非得已", pinyin: "qíng fēi dé yǐ", english: "bất đắc dĩ — hoàn cảnh ép buộc" },
          { chinese: "网开一面", pinyin: "wǎng kāi yī miàn", english: "châm chước, mở đường, phá lệ" },
          { chinese: "添麻烦", pinyin: "tiān má fan", english: "gây phiền hà (cụm lễ phép)" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em xin nghỉ phép 3 tuần về Việt Nam thăm gia đình. Em sẽ bàn giao công việc chu đáo trước khi đi, và hỗ trợ từ xa khi cần.",
        chinese: "我想请三周事假回越南探亲。我会在出发前把工作交接好, 需要的时候可以远程协助。",
        pinyin: "Wǒ xiǎng qǐng sān zhōu shì jià huí yuè nán tàn qīn. Wǒ huì zài chū fā qián bǎ gōng zuò jiāo jiē hǎo, xū yào de shí hou kě yǐ yuǎn chéng xié zhù."
      }
    ]
  },
  {
    id: 52,
    level: "B2",
    category: "study_career",
    title: "在中国公司的面试",
    pinyin: "zài zhōng guó gōng sī de miàn shì",
    topic: "Job interview at a Chinese company",
    title_vi: "Phỏng vấn xin việc tại công ty Trung Quốc",
    title_en: "Job interview at a Chinese company",
    sentences: [
      {
        chinese: "您好, 我是来面试软件工程师职位的阮文海。",
        pinyin: "Nín hǎo, wǒ shì lái miànshì ruǎnjiàn gōngchéngshī zhíwèi de Ruǎn Wénhǎi.",
        english: "Hello, I am Nguyen Van Hai, here to interview for the software engineer position.",
        vi: "Em chào anh/chị, em là Nguyễn Văn Hải, đến phỏng vấn vị trí kỹ sư phần mềm.",
        pronunciation_focus: ["您好 → nín hǎo (KHÔNG nǐ hǎo trong môi trường formal)", "面试 → miànshì (phỏng vấn — KHÔNG 面谈 miàntán)", "职位 → zhíwèi (vị trí — KHÔNG 工作 gōngzuò)", "软件 → ruǎnjiàn (mainland; Đài Loan dùng 軟體)"]
      },
      {
        chinese: "感谢贵公司给我这次面试的机会。",
        pinyin: "Gǎnxiè guì gōngsī gěi wǒ zhè cì miànshì de jīhuì.",
        english: "Thank you for giving me this interview opportunity.",
        vi: "Cảm ơn quý công ty đã cho em cơ hội phỏng vấn này.",
        pronunciation_focus: ["贵公司 → guì gōngsī (cụm formal: 'quý công ty')", "感谢 → gǎnxiè (formal hơn 谢谢 xièxie)", "机会 → jīhuì thanh 1-4", "这次 → zhè cì (lần này)"]
      },
      {
        chinese: "我之前在河内的越南分公司实习了一年。",
        pinyin: "Wǒ zhīqián zài Hénèi de Yuènán fēn gōngsī shíxí le yī nián.",
        english: "I previously interned for a year at the Vietnam branch in Hanoi.",
        vi: "Trước đây em đã thực tập một năm tại chi nhánh Việt Nam ở Hà Nội.",
        pronunciation_focus: ["分公司 → fēn gōngsī (chi nhánh)", "实习 → shíxí (thực tập)", "之前 → zhīqián (trước đây)", "河内 → Hénèi (Hà Nội)"]
      },
      {
        chinese: "我希望能为公司的越南市场贡献自己的力量。",
        pinyin: "Wǒ xīwàng néng wèi gōngsī de Yuènán shìchǎng gòngxiàn zìjǐ de lìliàng.",
        english: "I hope to contribute my efforts to the company's Vietnam market.",
        vi: "Em hy vọng có thể đóng góp công sức cho thị trường Việt Nam của công ty.",
        pronunciation_focus: ["贡献 → gòngxiàn (đóng góp — formal)", "市场 → shìchǎng (thị trường)", "力量 → lìliàng (sức lực)", "希望 → xīwàng (hy vọng)"]
      },
      {
        chinese: "如果有幸加入贵公司, 我会全力以赴。",
        pinyin: "Rúguǒ yǒu xìng jiārù guì gōngsī, wǒ huì quánlì yǐ fù.",
        english: "If I have the honor of joining your company, I will give my all.",
        vi: "Nếu may mắn được gia nhập quý công ty, em sẽ dốc toàn lực.",
        pronunciation_focus: ["有幸 → yǒu xìng (có vinh hạnh — formal)", "加入 → jiārù (gia nhập)", "全力以赴 → quánlì yǐ fù (idiom 4 chữ: dốc toàn lực)", "贵公司 → guì gōngsī"]
      }
    ],
    vocab: [
      { chinese: "面试", pinyin: "miàn shì", english: "job interview", vi: "phỏng vấn xin việc" },
      { chinese: "简历", pinyin: "jiǎn lì", english: "resume / CV", vi: "sơ yếu lý lịch / CV" },
      { chinese: "应聘", pinyin: "yìng pìn", english: "to apply for a job", vi: "ứng tuyển" },
      { chinese: "招聘", pinyin: "zhāo pìn", english: "to recruit", vi: "tuyển dụng" },
      { chinese: "职位", pinyin: "zhí wèi", english: "position / role", vi: "vị trí công việc" },
      { chinese: "薪资", pinyin: "xīn zī", english: "salary (formal)", vi: "lương (trang trọng)" },
      { chinese: "试用期", pinyin: "shì yòng qī", english: "probation period", vi: "thời gian thử việc" },
      { chinese: "全力以赴", pinyin: "quán lì yǐ fù", english: "give one's all (4-char idiom)", vi: "dốc toàn lực" },
      { chinese: "团队合作", pinyin: "tuán duì hé zuò", english: "teamwork", vi: "làm việc nhóm" },
      { chinese: "贡献", pinyin: "gòng xiàn", english: "to contribute (formal)", vi: "đóng góp" }
    ],
    dialogue: [
      { speaker: "HR", chinese: "请先做一下自我介绍。", pinyin: "Qǐng xiān zuò yīxià zìwǒ jièshào.", english: "Please give a brief self-introduction first.", vi: "Trước tiên xin em tự giới thiệu một chút." },
      { speaker: "阮文海", chinese: "您好, 我叫阮文海, 越南河内人, 河内国家大学计算机系毕业。", pinyin: "Nín hǎo, wǒ jiào Ruǎn Wénhǎi, Yuènán Hénèi rén, Hénèi Guójiā Dàxué jìsuànjī xì bìyè.", english: "Hello, my name is Nguyen Van Hai, from Hanoi, Vietnam, graduated from the computer science department of Vietnam National University, Hanoi.", vi: "Em chào anh/chị, em tên là Nguyễn Văn Hải, người Hà Nội Việt Nam, tốt nghiệp khoa Công nghệ Thông tin Đại học Quốc gia Hà Nội." },
      { speaker: "HR", chinese: "你的中文是怎么学的?", pinyin: "Nǐ de zhōngwén shì zěnme xué de?", english: "How did you learn Chinese?", vi: "Tiếng Trung của em học bằng cách nào?" },
      { speaker: "阮文海", chinese: "我从大学一年级开始自学, 后来在孔子学院系统学习了三年。", pinyin: "Wǒ cóng dàxué yī niánjí kāishǐ zìxué, hòulái zài Kǒngzǐ Xuéyuàn xìtǒng xuéxí le sān nián.", english: "I started self-studying from my freshman year, and later studied systematically at the Confucius Institute for three years.", vi: "Em tự học từ năm nhất đại học, sau đó học bài bản tại Học viện Khổng Tử ba năm." }
    ],
    dialogue_long: [
      { speaker: "HR", chinese: "您好, 阮先生, 请坐。先做一下自我介绍吧。", pinyin: "Nín hǎo, Ruǎn xiānsheng, qǐng zuò. Xiān zuò yīxià zìwǒ jièshào ba.", english: "Hello, Mr. Nguyen, please have a seat. Let's start with a self-introduction.", vi: "Chào anh Nguyễn, mời ngồi. Trước tiên anh tự giới thiệu một chút nhé." },
      { speaker: "阮文海", chinese: "您好, 我叫阮文海, 今年二十六岁, 河内国家大学计算机系毕业, 目前在越南一家科技公司做后端开发。", pinyin: "Nín hǎo, wǒ jiào Ruǎn Wénhǎi, jīnnián èrshíliù suì, Hénèi Guójiā Dàxué jìsuànjī xì bìyè, mùqián zài Yuènán yī jiā kējì gōngsī zuò hòuduān kāifā.", english: "Hello, my name is Nguyen Van Hai, 26 this year, graduated from the computer science department of Vietnam National University, Hanoi, currently working as a backend developer at a Vietnamese tech company.", vi: "Em chào anh/chị, em tên là Nguyễn Văn Hải, năm nay 26 tuổi, tốt nghiệp khoa CNTT Đại học Quốc gia Hà Nội, hiện đang làm lập trình viên backend tại một công ty công nghệ Việt Nam." },
      { speaker: "HR", chinese: "你为什么想加入我们公司?", pinyin: "Nǐ wèishénme xiǎng jiārù wǒmen gōngsī?", english: "Why do you want to join our company?", vi: "Sao em muốn vào công ty chúng tôi?" },
      { speaker: "阮文海", chinese: "贵公司在东南亚的影响力很大, 而且越南市场正在快速发展。我希望能成为连接两国技术团队的桥梁。", pinyin: "Guì gōngsī zài Dōngnányà de yǐngxiǎnglì hěn dà, érqiě Yuènán shìchǎng zhèngzài kuàisù fāzhǎn. Wǒ xīwàng néng chéngwéi liánjiē liǎng guó jìshù tuánduì de qiáoliáng.", english: "Your company has great influence in Southeast Asia, and the Vietnam market is developing rapidly. I hope to become a bridge connecting the tech teams of both countries.", vi: "Quý công ty có ảnh hưởng lớn ở Đông Nam Á, và thị trường Việt Nam đang phát triển nhanh. Em mong có thể trở thành cây cầu nối hai đội ngũ kỹ thuật của hai nước." },
      { speaker: "HR", chinese: "你的中文水平怎么样? 能用中文开会吗?", pinyin: "Nǐ de zhōngwén shuǐpíng zěnmeyàng? Néng yòng zhōngwén kāihuì ma?", english: "How is your Chinese level? Can you conduct meetings in Chinese?", vi: "Trình độ tiếng Trung của em thế nào? Có thể họp bằng tiếng Trung được không?" },
      { speaker: "阮文海", chinese: "HSK六级, 日常交流和技术讨论都没问题。需要的时候我也可以做中越翻译。", pinyin: "HSK liù jí, rìcháng jiāoliú hé jìshù tǎolùn dōu méi wèntí. Xūyào de shíhou wǒ yě kěyǐ zuò zhōng-yuè fānyì.", english: "HSK 6, daily communication and technical discussions are no problem. If needed, I can also do Chinese-Vietnamese translation.", vi: "HSK 6, giao tiếp hàng ngày và thảo luận kỹ thuật đều không vấn đề. Khi cần em cũng có thể phiên dịch Trung-Việt." },
      { speaker: "HR", chinese: "你之前的项目中, 最有挑战性的是哪一个?", pinyin: "Nǐ zhīqián de xiàngmù zhōng, zuì yǒu tiǎozhàn xìng de shì nǎ yī gè?", english: "Among your previous projects, which was the most challenging?", vi: "Trong các dự án trước đây, dự án nào thử thách nhất?" },
      { speaker: "阮文海", chinese: "去年我负责重构一个支付系统, 日交易量五十万。当时压力很大, 但最后成功上线, 性能提升了三倍。", pinyin: "Qùnián wǒ fùzé chónggòu yī gè zhīfù xìtǒng, rì jiāoyì liàng wǔshí wàn. Dāngshí yālì hěn dà, dàn zuìhòu chénggōng shàngxiàn, xìngnéng tíshēng le sān bèi.", english: "Last year I led the refactor of a payment system handling 500,000 daily transactions. The pressure was high, but it launched successfully and performance improved threefold.", vi: "Năm ngoái em phụ trách tái cấu trúc một hệ thống thanh toán, 500 nghìn giao dịch mỗi ngày. Lúc đó áp lực lớn, nhưng cuối cùng triển khai thành công, hiệu năng tăng gấp ba." },
      { speaker: "HR", chinese: "你期望的薪资是多少?", pinyin: "Nǐ qīwàng de xīnzī shì duōshao?", english: "What is your expected salary?", vi: "Mức lương mong muốn của em là bao nhiêu?" },
      { speaker: "阮文海", chinese: "根据我的经验和市场行情, 我希望税前月薪在两万五到三万人民币之间。当然, 这也要看贵公司的整体福利。", pinyin: "Gēnjù wǒ de jīngyàn hé shìchǎng hángqíng, wǒ xīwàng shuì qián yuèxīn zài liǎng wàn wǔ dào sān wàn rénmínbì zhījiān. Dāngrán, zhè yě yào kàn guì gōngsī de zhěngtǐ fúlì.", english: "Based on my experience and market rates, I hope for a pre-tax monthly salary between 25,000 and 30,000 RMB. Of course, this also depends on your overall benefits.", vi: "Dựa trên kinh nghiệm và mặt bằng thị trường, em mong lương trước thuế từ 25 nghìn đến 30 nghìn nhân dân tệ một tháng. Tất nhiên, còn tùy phúc lợi tổng thể của quý công ty." },
      { speaker: "HR", chinese: "你能接受出差吗? 比如每个月去深圳总部一周。", pinyin: "Nǐ néng jiēshòu chūchāi ma? Bǐrú měi gè yuè qù Shēnzhèn zǒngbù yī zhōu.", english: "Can you accept business travel? For example, going to Shenzhen headquarters for a week each month.", vi: "Em có thể chấp nhận đi công tác không? Ví dụ mỗi tháng sang trụ sở Thâm Quyến một tuần." },
      { speaker: "阮文海", chinese: "完全可以接受。出差对我来说也是学习的机会, 可以更好地了解总部的技术体系。", pinyin: "Wánquán kěyǐ jiēshòu. Chūchāi duì wǒ lái shuō yěshì xuéxí de jīhuì, kěyǐ gèng hǎo de liǎojiě zǒngbù de jìshù tǐxì.", english: "Completely acceptable. Business travel is also a learning opportunity for me, allowing me to better understand the headquarters' technical system.", vi: "Hoàn toàn chấp nhận được. Đối với em, đi công tác cũng là cơ hội học hỏi, giúp hiểu rõ hơn hệ thống kỹ thuật của trụ sở chính." },
      { speaker: "HR", chinese: "你对我们公司还有什么想了解的?", pinyin: "Nǐ duì wǒmen gōngsī hái yǒu shénme xiǎng liǎojiě de?", english: "Is there anything else you'd like to know about our company?", vi: "Em còn muốn tìm hiểu gì về công ty chúng tôi không?" },
      { speaker: "阮文海", chinese: "我想了解一下团队的技术栈和未来一年的产品规划, 以便我做好准备。", pinyin: "Wǒ xiǎng liǎojiě yīxià tuánduì de jìshù zhàn hé wèilái yī nián de chǎnpǐn guīhuà, yǐbiàn wǒ zuòhǎo zhǔnbèi.", english: "I'd like to know about the team's tech stack and product roadmap for the coming year, so I can prepare well.", vi: "Em muốn tìm hiểu công nghệ của team và lộ trình sản phẩm năm tới, để em chuẩn bị tốt." },
      { speaker: "HR", chinese: "好问题。我们后端用Go和Java, 前端是React。明年重点是越南和印尼市场的本地化。", pinyin: "Hǎo wèntí. Wǒmen hòuduān yòng Go hé Java, qiánduān shì React. Míngnián zhòngdiǎn shì Yuènán hé Yìnní shìchǎng de běndìhuà.", english: "Good question. Our backend uses Go and Java, frontend is React. Next year's focus is localization for Vietnam and Indonesia markets.", vi: "Câu hỏi hay. Backend chúng tôi dùng Go và Java, frontend là React. Trọng tâm năm tới là bản địa hóa cho thị trường Việt Nam và Indonesia." },
      { speaker: "阮文海", chinese: "正好我有Go的经验, 而且越南本地化是我最擅长的方向。如果有幸加入, 我会全力以赴。", pinyin: "Zhènghǎo wǒ yǒu Go de jīngyàn, érqiě Yuènán běndìhuà shì wǒ zuì shàncháng de fāngxiàng. Rúguǒ yǒu xìng jiārù, wǒ huì quánlì yǐ fù.", english: "I happen to have Go experience, and Vietnam localization is my strongest area. If I have the honor of joining, I will give my all.", vi: "Vừa hay em có kinh nghiệm Go, và bản địa hóa Việt Nam là thế mạnh nhất của em. Nếu may mắn được gia nhập, em sẽ dốc toàn lực." },
      { speaker: "HR", chinese: "好的, 谢谢您今天的时间。我们一周内会给您答复。", pinyin: "Hǎo de, xièxie nín jīntiān de shíjiān. Wǒmen yī zhōu nèi huì gěi nín dáfù.", english: "Alright, thank you for your time today. We'll get back to you within a week.", vi: "Được rồi, cảm ơn anh đã dành thời gian hôm nay. Chúng tôi sẽ phản hồi anh trong vòng một tuần." }
    ],
    roleplay_prompts: [
      "Đóng vai một ứng viên Việt Nam có 2 năm kinh nghiệm trả lời câu hỏi 'tại sao em rời công ty hiện tại'. KHÔNG nói xấu công ty cũ. Dùng cụm '寻求更大的发展空间' (tìm kiếm không gian phát triển lớn hơn) hoặc '希望挑战自己' (mong thử thách bản thân) — chuyển frame từ 'rời đi' sang 'hướng tới'.",
      "Phỏng vấn viên hỏi 'em có điểm yếu gì'. Trả lời chân thành nhưng khôn khéo — chọn một điểm yếu kèm cách bạn đang khắc phục. Tránh hai lỗi phổ biến: (1) 'em không có điểm yếu' (vô lễ), (2) liệt kê điểm yếu nghiêm trọng (mất cơ hội).",
      "Cuối phỏng vấn, HR đề nghị mức lương thấp hơn 20% so với kỳ vọng của bạn. Hãy thương lượng khéo léo bằng cách dùng cụm '我希望能在贵公司长期发展' để cho thấy bạn không chỉ đòi tiền, sau đó đưa ra dữ liệu thị trường cụ thể. Không kéo thương lượng quá 2 lượt."
    ],
    register_notes: "Phỏng vấn xin việc tại công ty Trung Quốc đòi hỏi 您 (nín) liên tục từ ứng viên đến HR/sếp tương lai — không bao giờ rớt xuống 你 dù HR có thể trẻ hơn bạn. Cụm gọi 贵公司 (guì gōngsī — quý công ty) là chuẩn formal, KHÔNG dùng 你们公司 (nǐmen gōngsī — công ty các bạn). Khi nói về mình, KHÔNG dùng 我们越南人 (chúng tôi người Việt Nam) — quá generalize; dùng 'tôi cá nhân' (我个人) hoặc đơn giản 我.\n\nCác cụm formal bắt buộc: 自我介绍 (zìwǒ jièshào — tự giới thiệu, KHÔNG 介绍我自己), 期望薪资 (qīwàng xīnzī — lương kỳ vọng, KHÔNG 想要多少钱), 出差 (chūchāi — đi công tác, KHÔNG 去外地). Khi cảm ơn cuối phỏng vấn, dùng '感谢您今天的时间' chứ KHÔNG '谢谢' đơn lẻ.\n\nTránh tuyệt đối: (a) Hỏi về nghỉ phép/lương cụ thể trong vòng phỏng vấn đầu — chỉ thảo luận khi HR đưa offer; (b) Dùng tiếng Anh chen vào (code-switching) — bị coi là khoe hoặc thiếu tự tin với tiếng Trung; (c) Tự khen quá đà bằng cụm 我最厉害 — dùng 我比较擅长 hoặc 我有一定经验 thay thế.",
    idiom_glosses: [
      {
        idiom: "全力以赴",
        literal: "đem hết sức mạnh xông tới (quán lì yǐ fù)",
        meaning: "Dốc toàn lực — cam kết làm hết khả năng. Cụm chuẩn ứng viên dùng cuối phỏng vấn để thể hiện cam kết. Mạnh hơn 努力工作 nhưng không cường điệu.",
        example: "如果有幸加入贵公司, 我会全力以赴。"
      },
      {
        idiom: "学有所长",
        literal: "học có chỗ sở trường (xué yǒu suǒ cháng)",
        meaning: "Học có chuyên môn — mỗi người có thế mạnh riêng. Dùng khi nói về kỹ năng đặc thù: '我学有所长, 在Go语言开发方面比较突出'.",
        example: "我学有所长, 在Go语言开发方面比较突出。"
      },
      {
        idiom: "谦虚谨慎",
        literal: "khiêm tốn cẩn trọng (qiān xū jǐn shèn)",
        meaning: "Khiêm tốn và thận trọng — tự đặc tả phong cách làm việc lý tưởng cho ứng viên Trung Quốc. Đối lập với phong cách 'self-promotion' phương Tây. Dùng nó để miêu tả mình mà không bị coi là yếu đuối.",
        example: "我做事比较谦虚谨慎, 喜欢先听后说。"
      },
      {
        idiom: "知人善任",
        literal: "biết người khéo dùng (zhī rén shàn rèn)",
        meaning: "Biết người và biết dùng người — phẩm chất khen sếp. Dùng khi nói về sếp cũ một cách tích cực: '我之前的领导知人善任, 教会了我很多'. Tránh tự khen mình bằng cụm này.",
        example: "我之前的领导知人善任, 教会了我很多。"
      }
    ],
    cultural_notes_vi: "Văn hóa phỏng vấn Trung Quốc khác biệt với Việt Nam ở bốn điểm chính: (1) Cấu trúc câu trả lời PHẢI có tổ chức 3 phần (tổng — phân tích — tổng) chứ không phải kể tự nhiên. Nói '我有三点想分享' (em có ba điểm muốn chia sẻ) trước khi liệt kê = ấn tượng tích cực; nói lan man = bị coi là thiếu logic. (2) Tự giới thiệu phải bao gồm: tên, tuổi, quê, học vấn, kinh nghiệm — theo trật tự đó, không đảo. Người Việt thường bỏ tuổi/quê — ở Trung Quốc đây là information cần có. (3) Nói về sếp cũ tuyệt đối tích cực, dù bạn rời vì sếp tệ — 我之前的领导教会了我很多. Nói xấu sếp cũ = tự đóng cửa với mọi sếp tương lai (giới HR Trung Quốc rất nhỏ và liên kết). (4) Trả lời câu hỏi về điểm yếu — phải có thật nhưng không nghiêm trọng, kèm cách bạn đang khắc phục. Mẫu chuẩn: '我有时候过于追求完美, 现在在学习更好地分配时间' (đôi khi em theo đuổi sự hoàn hảo quá mức, giờ em đang học cách phân bổ thời gian tốt hơn).\n\nVề 关系 (guānxi): nếu công ty này có nhân viên Việt Nam khác giới thiệu bạn, đừng giấu — đề cập tự nhiên sẽ tăng độ tin cậy. Trong văn hóa Trung Quốc, 'nội bộ giới thiệu' (内推 nèituī) là kênh tuyển dụng quan trọng nhất, không phải '走后门' (đi cửa sau) như nhiều người Việt lầm tưởng.",
    tip_advice_vi: "(1) Đến SỚM 15 phút, không sớm hơn (sếp chưa sẵn sàng tiếp), không muộn (mất điểm tức thì). (2) Trang phục: nam mặc sơ mi cài cúc + quần tây, nữ mặc váy công sở hoặc sơ mi + chân váy/quần. KHÔNG đeo túi xách hàng hiệu lộ liễu — văn hóa làm việc Trung Quốc đại lục đánh giá cao 'low-key'. (3) Bắt tay nhẹ — không quá mạnh kiểu Mỹ. Nữ ứng viên có thể không đưa tay trước; chờ HR chìa tay. (4) Khi HR mời ngồi, nói 谢谢 và ngồi nhẹ nhàng. Đừng tự rót nước cho mình — đợi HR mời. (5) Trả lời câu hỏi: dùng cấu trúc '首先...其次...最后...' (đầu tiên... tiếp theo... cuối cùng...) — sếp Trung Quốc cực thích cấu trúc rõ ràng này. (6) Khi không hiểu câu hỏi, KHÔNG đoán mò. Nói '不好意思, 您能再解释一下吗?' (xin lỗi, anh có thể giải thích lại không?) — chứng tỏ bạn cẩn thận, không phải yếu kém. (7) Cuối phỏng vấn, đứng dậy bắt tay (nếu HR đứng), cúi đầu nhẹ, nói '谢谢您今天的时间, 期待您的好消息'. Gửi email cảm ơn trong 24 giờ tiếp theo bằng tiếng Trung — đây là điểm cộng lớn vì rất ít ứng viên Trung Quốc làm bước này.",
    exercises: [
      { type: "fill-blank", question: "如果有幸加入贵公司, 我会 ___ 。", answer: "全力以赴" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung phỏng vấn với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "贵公司", pinyin: "guì gōngsī", english: "quý công ty (formal)" },
          { chinese: "试用期", pinyin: "shì yòng qī", english: "thời gian thử việc" },
          { chinese: "全力以赴", pinyin: "quán lì yǐ fù", english: "dốc toàn lực" },
          { chinese: "期望薪资", pinyin: "qī wàng xīn zī", english: "lương kỳ vọng" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Cảm ơn quý công ty đã cho em cơ hội phỏng vấn. Nếu may mắn được gia nhập, em sẽ dốc toàn lực vì sự phát triển của công ty.",
        chinese: "感谢贵公司给我面试的机会。如果有幸加入, 我会为公司的发展全力以赴。",
        pinyin: "Gǎn xiè guì gōng sī gěi wǒ miàn shì de jī huì. Rú guǒ yǒu xìng jiā rù, wǒ huì wèi gōng sī de fā zhǎn quán lì yǐ fù."
      }
    ]
  },
  {
    id: 53,
    level: "B2",
    category: "study_career",
    title: "中国政府奖学金面试",
    pinyin: "zhōng guó zhèng fǔ jiǎng xué jīn miàn shì",
    topic: "CSC scholarship interview",
    title_vi: "Phỏng vấn học bổng Chính phủ Trung Quốc (CSC)",
    title_en: "Chinese Government (CSC) Scholarship interview",
    sentences: [
      {
        chinese: "尊敬的各位老师, 您们好。",
        pinyin: "Zūnjìng de gè wèi lǎoshī, nínmen hǎo.",
        english: "Respected teachers, hello to all of you.",
        vi: "Kính thưa các thầy cô, em xin chào các thầy cô.",
        pronunciation_focus: ["尊敬的 → zūnjìng de (kính thưa — formal academic)", "各位 → gè wèi (mỗi vị — formal số nhiều)", "您们 → nínmen (số nhiều của 您, dùng formal)", "老师 → lǎoshī (giáo viên / thầy cô)"]
      },
      {
        chinese: "我申请的是清华大学计算机科学硕士项目。",
        pinyin: "Wǒ shēnqǐng de shì Qīnghuá Dàxué jìsuànjī kēxué shuòshì xiàngmù.",
        english: "I am applying for the Master's program in Computer Science at Tsinghua University.",
        vi: "Em ứng tuyển chương trình Thạc sĩ Khoa học Máy tính của Đại học Thanh Hoa.",
        pronunciation_focus: ["申请 → shēnqǐng (xin/ứng tuyển)", "硕士 → shuòshì (thạc sĩ)", "清华 → Qīnghuá (Thanh Hoa)", "项目 → xiàngmù (chương trình; mainland; Đài Loan dùng 專案)"]
      },
      {
        chinese: "我的研究方向是人工智能在越南语处理上的应用。",
        pinyin: "Wǒ de yánjiū fāngxiàng shì réngōng zhìnéng zài Yuènányǔ chǔlǐ shàng de yìngyòng.",
        english: "My research direction is the application of AI in Vietnamese language processing.",
        vi: "Hướng nghiên cứu của em là ứng dụng trí tuệ nhân tạo trong xử lý tiếng Việt.",
        pronunciation_focus: ["研究方向 → yánjiū fāngxiàng (hướng nghiên cứu)", "人工智能 → réngōng zhìnéng (AI)", "越南语 → Yuènányǔ (tiếng Việt)", "应用 → yìngyòng (ứng dụng)"]
      },
      {
        chinese: "毕业后我希望回越南, 把所学应用到本国的科技发展中。",
        pinyin: "Bìyè hòu wǒ xīwàng huí Yuènán, bǎ suǒ xué yìngyòng dào běnguó de kējì fāzhǎn zhōng.",
        english: "After graduation, I hope to return to Vietnam and apply what I've learned to my country's tech development.",
        vi: "Sau khi tốt nghiệp em mong trở về Việt Nam, đem những gì học được áp dụng vào sự phát triển khoa học công nghệ của đất nước.",
        pronunciation_focus: ["所学 → suǒ xué (những gì đã học — formal)", "本国 → běn guó (nước nhà — formal)", "科技 → kējì (khoa học công nghệ)", "毕业 → bìyè (tốt nghiệp)"]
      },
      {
        chinese: "请各位老师给我这个学习的机会, 我一定不会辜负厚望。",
        pinyin: "Qǐng gè wèi lǎoshī gěi wǒ zhège xuéxí de jīhuì, wǒ yīdìng bù huì gūfù hòuwàng.",
        english: "Please give me this opportunity to study, and I will not disappoint your high expectations.",
        vi: "Xin các thầy cô cho em cơ hội học tập này, em nhất định sẽ không phụ kỳ vọng.",
        pronunciation_focus: ["辜负 → gūfù (phụ lòng — formal)", "厚望 → hòuwàng (kỳ vọng cao — formal)", "学习 → xuéxí (học tập)", "机会 → jīhuì (cơ hội)"]
      }
    ],
    vocab: [
      { chinese: "奖学金", pinyin: "jiǎng xué jīn", english: "scholarship", vi: "học bổng" },
      { chinese: "申请", pinyin: "shēn qǐng", english: "to apply", vi: "ứng tuyển / xin" },
      { chinese: "硕士", pinyin: "shuò shì", english: "Master's degree", vi: "thạc sĩ" },
      { chinese: "博士", pinyin: "bó shì", english: "PhD / Doctorate", vi: "tiến sĩ" },
      { chinese: "研究方向", pinyin: "yán jiū fāng xiàng", english: "research direction", vi: "hướng nghiên cứu" },
      { chinese: "导师", pinyin: "dǎo shī", english: "academic supervisor", vi: "giáo sư hướng dẫn" },
      { chinese: "厚望", pinyin: "hòu wàng", english: "high expectations (formal)", vi: "kỳ vọng cao" },
      { chinese: "辜负", pinyin: "gū fù", english: "to fail / disappoint expectations", vi: "phụ lòng" },
      { chinese: "学术", pinyin: "xué shù", english: "academic", vi: "học thuật" },
      { chinese: "鹏程万里", pinyin: "péng chéng wàn lǐ", english: "great future ahead (4-char idiom)", vi: "tiền đồ rộng mở" }
    ],
    dialogue: [
      { speaker: "评审", chinese: "请简要介绍一下您的学术背景。", pinyin: "Qǐng jiǎnyào jièshào yīxià nín de xuéshù bèijǐng.", english: "Please briefly introduce your academic background.", vi: "Xin em giới thiệu ngắn gọn về nền tảng học thuật." },
      { speaker: "陈氏梅", chinese: "我本科就读于河内国家大学, 主修计算机科学, GPA是3.85/4.0。", pinyin: "Wǒ běnkē jiùdú yú Hénèi Guójiā Dàxué, zhǔ xiū jìsuànjī kēxué, GPA shì sān diǎn bā wǔ bǐ sì diǎn líng.", english: "I did my undergraduate at Vietnam National University, Hanoi, majoring in Computer Science with a GPA of 3.85/4.0.", vi: "Em học đại học tại Đại học Quốc gia Hà Nội, chuyên ngành Khoa học Máy tính, GPA 3.85/4.0." },
      { speaker: "评审", chinese: "为什么选择中国, 而不是其他国家?", pinyin: "Wèishénme xuǎnzé Zhōngguó, ér bù shì qítā guójiā?", english: "Why China instead of other countries?", vi: "Sao lại chọn Trung Quốc thay vì các nước khác?" },
      { speaker: "陈氏梅", chinese: "中国在AI领域发展最快, 而且越中两国关系密切, 我希望成为友谊的桥梁。", pinyin: "Zhōngguó zài AI lǐngyù fāzhǎn zuì kuài, érqiě Yuè-Zhōng liǎng guó guānxi mìqiè, wǒ xīwàng chéngwéi yǒuyì de qiáoliáng.", english: "China leads in AI development, and Vietnam-China relations are close. I hope to be a bridge of friendship.", vi: "Trung Quốc dẫn đầu phát triển AI, và quan hệ Việt-Trung rất gần gũi. Em mong làm cầu nối hữu nghị." }
    ],
    dialogue_long: [
      { speaker: "评审", chinese: "陈同学, 您好。请先用中文做一个三分钟的自我介绍。", pinyin: "Chén tóngxué, nín hǎo. Qǐng xiān yòng zhōngwén zuò yī gè sān fēnzhōng de zìwǒ jièshào.", english: "Hello, Chen. Please give a three-minute self-introduction in Chinese first.", vi: "Chào em Trần. Trước tiên em hãy tự giới thiệu trong ba phút bằng tiếng Trung." },
      { speaker: "陈氏梅", chinese: "尊敬的各位老师, 您们好。我叫陈氏梅, 来自越南河内, 河内国家大学计算机科学专业本科毕业。", pinyin: "Zūnjìng de gè wèi lǎoshī, nínmen hǎo. Wǒ jiào Chén Shìméi, láizì Yuènán Hénèi, Hénèi Guójiā Dàxué jìsuànjī kēxué zhuānyè běnkē bìyè.", english: "Respected teachers, hello. My name is Tran Thi Mai, from Hanoi, Vietnam, undergraduate graduate of Computer Science at Vietnam National University, Hanoi.", vi: "Kính thưa các thầy cô, em chào các thầy cô. Em tên là Trần Thị Mai, đến từ Hà Nội Việt Nam, tốt nghiệp đại học chuyên ngành Khoa học Máy tính tại Đại học Quốc gia Hà Nội." },
      { speaker: "评审", chinese: "您的本科成绩怎么样? 有发表过论文吗?", pinyin: "Nín de běnkē chéngjì zěnmeyàng? Yǒu fābiǎo guò lùnwén ma?", english: "How were your undergraduate grades? Have you published any papers?", vi: "Thành tích đại học của em thế nào? Đã có công bố bài báo nào chưa?" },
      { speaker: "陈氏梅", chinese: "GPA是3.85, 专业前5%。我有一篇关于越南语自然语言处理的论文发表在ACL Workshop。", pinyin: "GPA shì sān diǎn bā wǔ, zhuānyè qián bǎi fēn zhī wǔ. Wǒ yǒu yī piān guānyú Yuènányǔ zìrán yǔyán chǔlǐ de lùnwén fābiǎo zài ACL Workshop.", english: "GPA 3.85, top 5% of my major. I have a paper on Vietnamese NLP published at an ACL Workshop.", vi: "GPA là 3.85, top 5% chuyên ngành. Em có một bài báo về xử lý ngôn ngữ tự nhiên tiếng Việt đăng tại ACL Workshop." },
      { speaker: "评审", chinese: "您为什么选择清华大学的这个项目?", pinyin: "Nín wèishénme xuǎnzé Qīnghuá Dàxué de zhège xiàngmù?", english: "Why did you choose this Tsinghua program?", vi: "Sao em chọn chương trình này của Thanh Hoa?" },
      { speaker: "陈氏梅", chinese: "清华的孙茂松教授在低资源语言NLP领域是国际权威, 这正是我未来想深入的方向。", pinyin: "Qīnghuá de Sūn Màosōng jiàoshòu zài dī zīyuán yǔyán NLP lǐngyù shì guójì quánwēi, zhè zhèngshì wǒ wèilái xiǎng shēnrù de fāngxiàng.", english: "Tsinghua's Professor Sun Maosong is an international authority in low-resource language NLP, exactly the area I want to pursue.", vi: "Giáo sư Tôn Mậu Tùng của Thanh Hoa là chuyên gia quốc tế trong NLP ngôn ngữ ít tài nguyên, chính là hướng em muốn đi sâu." },
      { speaker: "评审", chinese: "如果获得奖学金, 您打算研究什么具体课题?", pinyin: "Rúguǒ huòdé jiǎngxuéjīn, nín dǎsuàn yánjiū shénme jùtǐ kètí?", english: "If you receive the scholarship, what specific topic do you plan to research?", vi: "Nếu được học bổng, em định nghiên cứu chủ đề cụ thể nào?" },
      { speaker: "陈氏梅", chinese: "我想研究越南语-中文双向机器翻译, 重点解决越南语声调和汉字之间的对应问题。", pinyin: "Wǒ xiǎng yánjiū Yuènányǔ-zhōngwén shuāng xiàng jīqì fānyì, zhòngdiǎn jiějué Yuènányǔ shēngdiào hé hànzì zhī jiān de duìyìng wèntí.", english: "I want to research Vietnamese-Chinese bidirectional machine translation, focusing on solving the correspondence between Vietnamese tones and Chinese characters.", vi: "Em muốn nghiên cứu dịch máy song ngữ Việt-Trung hai chiều, tập trung giải quyết tương ứng giữa thanh điệu tiếng Việt và Hán tự." },
      { speaker: "评审", chinese: "这个题目很有意义。您毕业以后有什么计划?", pinyin: "Zhège tímù hěn yǒu yìyì. Nín bìyè yǐhòu yǒu shénme jìhuà?", english: "That topic is meaningful. What are your plans after graduation?", vi: "Đề tài rất có ý nghĩa. Sau tốt nghiệp em có kế hoạch gì?" },
      { speaker: "陈氏梅", chinese: "我会回越南, 继续在越南国家大学做研究, 并将中越两国的学术合作推向更深层次。", pinyin: "Wǒ huì huí Yuènán, jìxù zài Yuènán Guójiā Dàxué zuò yánjiū, bìng jiāng Zhōng-Yuè liǎng guó de xuéshù hézuò tuī xiàng gèng shēn céngcì.", english: "I will return to Vietnam to continue research at Vietnam National University and push China-Vietnam academic cooperation deeper.", vi: "Em sẽ về Việt Nam, tiếp tục nghiên cứu tại Đại học Quốc gia Việt Nam, và đẩy hợp tác học thuật Việt-Trung lên tầm cao hơn." },
      { speaker: "评审", chinese: "您的中文是怎么学的? 现在水平如何?", pinyin: "Nín de zhōngwén shì zěnme xué de? Xiànzài shuǐpíng rúhé?", english: "How did you learn Chinese? What's your current level?", vi: "Tiếng Trung em học bằng cách nào? Trình độ hiện tại ra sao?" },
      { speaker: "陈氏梅", chinese: "从大二开始在孔子学院学了四年, 暑假参加过厦门大学的语言项目。HSK六级, 280分。", pinyin: "Cóng dà èr kāishǐ zài Kǒngzǐ Xuéyuàn xué le sì nián, shǔjià cānjiā guò Xiàmén Dàxué de yǔyán xiàngmù. HSK liù jí, èr bǎi bā shí fēn.", english: "From my second year at university I studied four years at the Confucius Institute, and joined Xiamen University's language program in summer. HSK 6, score 280.", vi: "Từ năm hai em bắt đầu học bốn năm tại Học viện Khổng Tử, hè tham gia chương trình ngôn ngữ tại Đại học Hạ Môn. HSK 6, 280 điểm." },
      { speaker: "评审", chinese: "您对中国文化最感兴趣的是什么?", pinyin: "Nín duì Zhōngguó wénhuà zuì gǎn xìngqù de shì shénme?", english: "What aspect of Chinese culture interests you most?", vi: "Văn hóa Trung Quốc, em quan tâm nhất điều gì?" },
      { speaker: "陈氏梅", chinese: "汉字的演变, 特别是繁体到简体的过程。这背后是语言学和社会学的有趣交汇。", pinyin: "Hànzì de yǎnbiàn, tèbié shì fántǐ dào jiǎntǐ de guòchéng. Zhè bèihòu shì yǔyánxué hé shèhuìxué de yǒuqù jiāohuì.", english: "The evolution of Chinese characters, especially traditional to simplified. Behind it is a fascinating intersection of linguistics and sociology.", vi: "Sự diễn biến của Hán tự, đặc biệt là quá trình từ phồn thể sang giản thể. Đằng sau nó là sự giao thoa thú vị giữa ngôn ngữ học và xã hội học." },
      { speaker: "评审", chinese: "好, 最后一个问题。如果未获得奖学金, 您会怎么办?", pinyin: "Hǎo, zuìhòu yī gè wèntí. Rúguǒ wèi huòdé jiǎngxuéjīn, nín huì zěnme bàn?", english: "Good, last question. If you don't receive the scholarship, what will you do?", vi: "Tốt, câu hỏi cuối. Nếu không nhận được học bổng, em sẽ làm gì?" },
      { speaker: "陈氏梅", chinese: "我会继续提升自己, 明年再申请。我对中国学习的决心不会因为一次结果而改变。", pinyin: "Wǒ huì jìxù tíshēng zìjǐ, míngnián zài shēnqǐng. Wǒ duì Zhōngguó xuéxí de juéxīn bù huì yīnwèi yī cì jiéguǒ ér gǎibiàn.", english: "I will continue improving and apply again next year. My determination to study in China won't change because of one outcome.", vi: "Em sẽ tiếp tục nâng cao bản thân, năm sau ứng tuyển lại. Quyết tâm học ở Trung Quốc của em không thay đổi vì một lần kết quả." },
      { speaker: "评审", chinese: "好的, 谢谢您的回答。我们会在两周内通知结果。", pinyin: "Hǎo de, xièxie nín de huídá. Wǒmen huì zài liǎng zhōu nèi tōngzhī jiéguǒ.", english: "Alright, thank you for your answers. We will notify you of the results within two weeks.", vi: "Được rồi, cảm ơn em đã trả lời. Chúng tôi sẽ thông báo kết quả trong hai tuần." }
    ],
    roleplay_prompts: [
      "Đóng vai bạn — sinh viên Việt Nam ứng tuyển CSC — đối diện ban giám khảo gồm 3 giáo sư Trung Quốc. Hãy tự giới thiệu trong 3 phút theo cấu trúc 'tổng-phân-tổng': mở đầu bằng tóm tắt, kể chi tiết học vấn + nghiên cứu, kết thúc bằng cam kết về Trung Quốc và đóng góp cho Việt Nam.",
      "Giám khảo hỏi 'tại sao chọn ngành này' nhưng bạn cảm thấy câu trả lời chuẩn bị sẵn không phù hợp với mạch hội thoại. Hãy điều chỉnh, kết nối với câu hỏi cụ thể của giám khảo, dùng cụm '让我重新阐述' (để em diễn đạt lại) — tránh đọc thuộc lòng cứng nhắc.",
      "Cuối phỏng vấn, giám khảo hỏi 'em có câu hỏi gì không'. Hãy chuẩn bị 2 câu hỏi chất lượng: một về chương trình học cụ thể (lab nào, supervisor có sẵn không), một về đời sống sinh viên Việt Nam tại trường. Tránh hỏi về visa, tiền sinh hoạt — đó là việc của 留学服务中心."
    ],
    register_notes: "Phỏng vấn học bổng CSC dùng register academic-formal cao nhất — cao hơn cả phỏng vấn xin việc. Cụm mở đầu bắt buộc '尊敬的各位老师, 您们好' (kính thưa các thầy cô, chào các thầy cô) — KHÔNG '老师们好' đơn lẻ. Khi nhắc đến mình, dùng 我 hoặc tên đầy đủ kiểu '陈氏梅' (Trần Thị Mai), KHÔNG dùng nickname tiếng Anh.\n\nGọi giáo sư bằng họ + 教授 (jiàoshòu — giáo sư): '王教授', '李教授'. Nếu không biết tên, gọi '老师'. KHÔNG gọi '先生/女士' (sir/madam) — quá generic. Khi nhắc đến trường, dùng tên đầy đủ trong lần đầu '清华大学', sau đó có thể '清华' nhưng KHÔNG '清华大' (cắt sai).\n\nCác cụm formal academic: 学术背景 (xuéshù bèijǐng — nền tảng học thuật), 研究方向 (yánjiū fāngxiàng — hướng nghiên cứu), 发表论文 (fābiǎo lùnwén — công bố bài báo), 厚望 (hòuwàng — kỳ vọng cao), 不会辜负 (bù huì gūfù — không phụ lòng). Câu kết bắt buộc có '请各位老师...' và 'cam kết tương lai'.",
    idiom_glosses: [
      {
        idiom: "鹏程万里",
        literal: "đường chim bằng vạn dặm (péng chéng wàn lǐ)",
        meaning: "Tiền đồ rộng mở — tương lai xa và lớn. Cụm chuẩn để diễn tả khát vọng học thuật của ứng viên: '希望能在贵校鹏程万里'. Nguồn gốc: Trang Tử kể về chim bằng bay vạn dặm về phương nam.",
        example: "希望能在贵校的支持下鹏程万里。"
      },
      {
        idiom: "勤能补拙",
        literal: "cần cù bù đắp được sự vụng về (qín néng bǔ zhuō)",
        meaning: "Chăm chỉ bù được sự kém cỏi. Cụm khiêm tốn lý tưởng cho phỏng vấn — thừa nhận có hạn chế nhưng cam kết bù bằng nỗ lực. Tránh dùng cụm này nếu bạn đang khoe điểm cao.",
        example: "我相信勤能补拙, 一定可以跟上课程。"
      },
      {
        idiom: "精益求精",
        literal: "tinh đã tinh còn đòi tinh hơn (jīng yì qiú jīng)",
        meaning: "Không ngừng cầu toàn — luôn muốn cải thiện hơn nữa. Cụm dùng khi nói về thái độ làm việc/nghiên cứu: '我对自己的研究始终精益求精'. Đặc biệt phù hợp ngữ cảnh academic.",
        example: "我对自己的研究始终精益求精。"
      },
      {
        idiom: "学海无涯",
        literal: "biển học không bờ (xué hǎi wú yá)",
        meaning: "Sự học không có giới hạn — biển kiến thức mênh mông. Cụm khiêm tốn dùng cuối phỏng vấn để thể hiện thái độ học hỏi liên tục: '学海无涯, 我会一直努力'.",
        example: "学海无涯, 我会一直努力下去。"
      }
    ],
    cultural_notes_vi: "Phỏng vấn CSC khác biệt với phỏng vấn xin việc ở ba điểm cốt lõi: (1) Trọng tâm là 'cam kết về Trung Quốc' và 'đóng góp cho Việt Nam' — KHÔNG phải năng lực cá nhân. Giám khảo CSC là cán bộ ngoại giao + giáo sư, họ đánh giá 'bạn có phải đại sứ tốt cho quan hệ Việt-Trung không'. Câu trả lời quan trọng nhất: 毕业后我会回越南做什么. Nói 'em muốn ở lại Trung Quốc làm việc' = mất học bổng ngay (CSC yêu cầu về nước). (2) Phải biết một thứ về 'Trung Quốc cụ thể' ngoài chương trình học — văn hóa, lịch sử, một thành phố, một tác giả. Cho thấy bạn quan tâm Trung Quốc, không chỉ học bổng. (3) Tuyệt đối tránh đề cập 'tôi không có tiền học' — CSC là quan hệ đối ngoại, không phải từ thiện. Lý do nên là 'cơ hội học tập với các giáo sư hàng đầu', KHÔNG 'không có tiền'.\n\nVề 关系 với giáo sư trước: nếu bạn đã liên lạc email với supervisor tiềm năng và có hồi đáp tích cực, hãy đề cập trong phỏng vấn — '我已经和孙教授通过邮件交流, 他对我的题目很感兴趣' (em đã trao đổi qua email với GS Tôn, ông ấy quan tâm đề tài của em). Đây là điểm cộng lớn.\n\nGiám khảo có thể test khả năng tiếng Trung bằng câu hỏi bất ngờ về tin tức, ẩm thực, lịch sử Trung Quốc. Chuẩn bị trước 5-10 câu trả lời ngắn về văn hóa Trung Quốc bạn yêu thích — '我喜欢苏轼的诗', '我对长城的历史感兴趣'.",
    tip_advice_vi: "(1) MẶC chỉnh tề, đứng đắn, không mặc áo in sao Việt Nam (cờ, anh hùng dân tộc) — giám khảo có thể không quen, gây phản ứng ngược. Sơ mi trắng + chân váy đen / quần tây đen là an toàn. (2) Mang theo bản in CV bằng tiếng Trung và tiếng Anh, kẹp file gọn gàng — giám khảo có thể yêu cầu. Bản tiếng Trung dùng tên Hán tự (Trần Thị Mai → 陈氏梅), KHÔNG để pinyin. (3) Mở đầu '尊敬的各位老师, 您们好' kèm cúi đầu nhẹ. Đây là chi tiết nhỏ nhưng tạo ấn tượng formal academic. (4) Khi không biết câu trả lời, KHÔNG bịa. Nói '这个问题我之前没有深入思考过, 但我可以从X的角度尝试回答' (câu này em chưa suy nghĩ sâu, nhưng em có thể thử trả lời từ góc độ X). Sự thật + thử nghiệm > bịa. (5) Câu hỏi 'tại sao Trung Quốc, không phải Mỹ/Anh/Úc' — chuẩn bị KỸ. Trả lời sai là CSC sẽ nghĩ Trung Quốc là 'lựa chọn dự phòng'. Mẫu: '中国在AI领域发展最快, 而且越中文化相近, 我适应得更快'. (6) Sau phỏng vấn, gửi thư cảm ơn bằng tiếng Trung tới ban tổ chức trong 24 giờ — đây là cử chỉ rất ít người Việt làm, gây ấn tượng tốt. (7) Mẹo phát âm: '尊敬的' (zūnjìng de) — z là âm khô như 'tz' không phải 'z' tiếng Anh; '清华' Qīnghuá thanh 1-2 (cao bằng-lên), tránh đọc thanh 1-1 thành tên không đúng.",
    exercises: [
      { type: "fill-blank", question: "请各位老师给我学习的机会, 我一定不会 ___ 厚望。", answer: "辜负" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung học bổng với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "硕士", pinyin: "shuò shì", english: "thạc sĩ" },
          { chinese: "导师", pinyin: "dǎo shī", english: "giáo sư hướng dẫn" },
          { chinese: "鹏程万里", pinyin: "péng chéng wàn lǐ", english: "tiền đồ rộng mở" },
          { chinese: "学海无涯", pinyin: "xué hǎi wú yá", english: "biển học không bờ" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Sau khi tốt nghiệp em sẽ về Việt Nam, áp dụng kiến thức để thúc đẩy hợp tác học thuật Việt-Trung.",
        chinese: "毕业后我会回越南, 应用所学推动中越学术合作。",
        pinyin: "Bì yè hòu wǒ huì huí Yuè nán, yìng yòng suǒ xué tuī dòng zhōng yuè xué shù hé zuò."
      }
    ]
  },
  {
    id: 54,
    level: "B2",
    category: "study_career",
    title: "和导师讨论毕业论文选题",
    pinyin: "hé dǎo shī tǎo lùn bì yè lùn wén xuǎn tí",
    topic: "Thesis topic discussion with supervisor",
    title_vi: "Thảo luận đề tài luận văn tốt nghiệp với giáo sư hướng dẫn",
    title_en: "Discussing graduation thesis topic with supervisor",
    sentences: [
      {
        chinese: "王教授, 我想跟您讨论一下我的毕业论文选题。",
        pinyin: "Wáng jiàoshòu, wǒ xiǎng gēn nín tǎolùn yīxià wǒ de bìyè lùnwén xuǎntí.",
        english: "Professor Wang, I'd like to discuss my graduation thesis topic with you.",
        vi: "Giáo sư Vương, em muốn thảo luận với thầy về đề tài luận văn tốt nghiệp của em.",
        pronunciation_focus: ["教授 → jiàoshòu (giáo sư — họ + chức danh)", "讨论 → tǎolùn (thảo luận)", "选题 → xuǎntí (chọn đề tài)", "毕业论文 → bìyè lùnwén (luận văn tốt nghiệp)"]
      },
      {
        chinese: "我目前考虑了三个方向, 想听听您的意见。",
        pinyin: "Wǒ mùqián kǎolǜ le sān gè fāngxiàng, xiǎng tīngting nín de yìjiàn.",
        english: "I'm currently considering three directions and want to hear your opinion.",
        vi: "Hiện em đang cân nhắc ba hướng, muốn nghe ý kiến của thầy.",
        pronunciation_focus: ["考虑 → kǎolǜ (cân nhắc)", "方向 → fāngxiàng (hướng đi)", "意见 → yìjiàn (ý kiến)", "目前 → mùqián (hiện tại)"]
      },
      {
        chinese: "第一个方向是越南语NLP, 第二个是中越机器翻译, 第三个是低资源语言模型。",
        pinyin: "Dì yī gè fāngxiàng shì Yuènányǔ NLP, dì èr gè shì zhōng-yuè jīqì fānyì, dì sān gè shì dī zīyuán yǔyán móxíng.",
        english: "The first direction is Vietnamese NLP, second is Chinese-Vietnamese machine translation, third is low-resource language models.",
        vi: "Hướng thứ nhất là NLP tiếng Việt, thứ hai là dịch máy Trung-Việt, thứ ba là mô hình ngôn ngữ ít tài nguyên.",
        pronunciation_focus: ["NLP → cụm âm tiếng Anh giữ nguyên", "机器翻译 → jīqì fānyì (dịch máy)", "低资源 → dī zīyuán (ít tài nguyên)", "模型 → móxíng (mô hình)"]
      },
      {
        chinese: "您觉得哪个方向更有研究价值, 也更适合我的背景?",
        pinyin: "Nín juéde nǎ gè fāngxiàng gèng yǒu yánjiū jiàzhí, yě gèng shìhé wǒ de bèijǐng?",
        english: "Which direction do you think has more research value and suits my background better?",
        vi: "Thầy thấy hướng nào có giá trị nghiên cứu hơn, và phù hợp với nền tảng của em hơn?",
        pronunciation_focus: ["研究价值 → yánjiū jiàzhí (giá trị nghiên cứu)", "适合 → shìhé (phù hợp)", "背景 → bèijǐng (nền tảng)", "您觉得 → nín juéde"]
      },
      {
        chinese: "我会根据您的建议进一步缩小范围, 然后开始写开题报告。",
        pinyin: "Wǒ huì gēnjù nín de jiànyì jìnyībù suōxiǎo fànwéi, ránhòu kāishǐ xiě kāití bàogào.",
        english: "I'll further narrow the scope based on your suggestions, then start writing the proposal.",
        vi: "Em sẽ thu hẹp phạm vi theo gợi ý của thầy, sau đó bắt đầu viết đề cương.",
        pronunciation_focus: ["建议 → jiànyì (gợi ý / kiến nghị)", "缩小范围 → suōxiǎo fànwéi (thu hẹp phạm vi)", "开题报告 → kāití bàogào (đề cương / proposal)", "进一步 → jìnyībù (đi thêm bước nữa)"]
      }
    ],
    vocab: [
      { chinese: "毕业论文", pinyin: "bì yè lùn wén", english: "graduation thesis", vi: "luận văn tốt nghiệp" },
      { chinese: "选题", pinyin: "xuǎn tí", english: "topic selection", vi: "chọn đề tài" },
      { chinese: "开题报告", pinyin: "kāi tí bào gào", english: "research proposal", vi: "đề cương nghiên cứu" },
      { chinese: "导师", pinyin: "dǎo shī", english: "supervisor / advisor", vi: "giáo sư hướng dẫn" },
      { chinese: "文献综述", pinyin: "wén xiàn zōng shù", english: "literature review", vi: "tổng quan tài liệu" },
      { chinese: "研究方法", pinyin: "yán jiū fāng fǎ", english: "research methodology", vi: "phương pháp nghiên cứu" },
      { chinese: "实验数据", pinyin: "shí yàn shù jù", english: "experimental data", vi: "dữ liệu thí nghiệm" },
      { chinese: "答辩", pinyin: "dá biàn", english: "thesis defense", vi: "bảo vệ luận văn" },
      { chinese: "有的放矢", pinyin: "yǒu dì fàng shǐ", english: "have a clear target (4-char idiom)", vi: "có mục tiêu rõ ràng" },
      { chinese: "集思广益", pinyin: "jí sī guǎng yì", english: "draw on collective wisdom", vi: "tập hợp ý kiến rộng rãi" }
    ],
    dialogue: [
      { speaker: "梅", chinese: "王教授, 您现在方便讨论一下我的论文吗?", pinyin: "Wáng jiàoshòu, nín xiànzài fāngbiàn tǎolùn yīxià wǒ de lùnwén ma?", english: "Professor Wang, is now a good time to discuss my thesis?", vi: "Giáo sư Vương, bây giờ thầy có tiện thảo luận về luận văn của em không?" },
      { speaker: "王教授", chinese: "可以, 你说说现在的进展。", pinyin: "Kěyǐ, nǐ shuōshuo xiànzài de jìnzhǎn.", english: "Yes, tell me about the current progress.", vi: "Được, em nói tiến độ hiện tại đi." },
      { speaker: "梅", chinese: "我看了二十多篇论文, 觉得越南语NLP方向最有意思。", pinyin: "Wǒ kàn le èrshí duō piān lùnwén, juéde Yuènányǔ NLP fāngxiàng zuì yǒu yìsi.", english: "I read over twenty papers and think the Vietnamese NLP direction is most interesting.", vi: "Em đã đọc hơn hai mươi bài, thấy hướng NLP tiếng Việt thú vị nhất." },
      { speaker: "王教授", chinese: "那范围还是太大, 需要再具体一些。", pinyin: "Nà fànwéi háishì tài dà, xūyào zài jùtǐ yīxiē.", english: "That's still too broad — needs to be more specific.", vi: "Vậy phạm vi vẫn quá rộng, cần cụ thể hơn nữa." }
    ],
    dialogue_long: [
      { speaker: "梅", chinese: "王教授, 您好。这是您让我一周前准备的三个选题方向, 我整理成PPT了。", pinyin: "Wáng jiàoshòu, nín hǎo. Zhè shì nín ràng wǒ yī zhōu qián zhǔnbèi de sān gè xuǎntí fāngxiàng, wǒ zhěnglǐ chéng PPT le.", english: "Hello Professor Wang. These are the three topic directions you asked me to prepare a week ago — I've organized them into a PPT.", vi: "Chào thầy Vương. Đây là ba hướng đề tài thầy bảo em chuẩn bị tuần trước, em đã làm thành PPT." },
      { speaker: "王教授", chinese: "好, 你简要说一下每个的核心问题。", pinyin: "Hǎo, nǐ jiǎnyào shuō yīxià měi gè de héxīn wèntí.", english: "Good, briefly state the core question of each.", vi: "Được, em nói ngắn gọn câu hỏi cốt lõi của từng hướng đi." },
      { speaker: "梅", chinese: "第一个: 越南语命名实体识别在医学领域的应用。第二个: 中越机器翻译中文化词的处理。第三个: 低资源越南方言的语音识别。", pinyin: "Dì yī gè: Yuènányǔ mìngmíng shítǐ shíbié zài yīxué lǐngyù de yìngyòng. Dì èr gè: Zhōng-yuè jīqì fānyì zhōng wénhuà cí de chǔlǐ. Dì sān gè: Dī zīyuán Yuènán fāngyán de yǔyīn shíbié.", english: "First: Vietnamese named entity recognition in medical domain. Second: handling cultural terms in Chinese-Vietnamese MT. Third: speech recognition for low-resource Vietnamese dialects.", vi: "Một: Nhận diện thực thể tên trong lĩnh vực y học tiếng Việt. Hai: Xử lý từ văn hóa trong dịch máy Trung-Việt. Ba: Nhận diện giọng nói các phương ngữ Việt ít tài nguyên." },
      { speaker: "王教授", chinese: "这三个题目都不错, 但难度差别很大。你自己最看好哪个?", pinyin: "Zhè sān gè tímù dōu bùcuò, dàn nándù chābié hěn dà. Nǐ zìjǐ zuì kànhǎo nǎ gè?", english: "All three are decent, but the difficulty varies greatly. Which do you favor yourself?", vi: "Cả ba đều ổn, nhưng độ khó chênh lệch lớn. Em tự thấy thích nhất hướng nào?" },
      { speaker: "梅", chinese: "我比较倾向第二个, 因为我有越南文化背景, 数据收集也比较容易。", pinyin: "Wǒ bǐjiào qīngxiàng dì èr gè, yīnwèi wǒ yǒu Yuènán wénhuà bèijǐng, shùjù shōují yě bǐjiào róngyì.", english: "I lean toward the second, because I have Vietnamese cultural background and data collection would be easier.", vi: "Em nghiêng về hướng hai, vì em có nền văn hóa Việt Nam, thu thập dữ liệu cũng dễ hơn." },
      { speaker: "王教授", chinese: "选题要有的放矢。文化词处理这个方向, 最近三年有哪些代表性论文?", pinyin: "Xuǎntí yào yǒu dì fàng shǐ. Wénhuà cí chǔlǐ zhège fāngxiàng, zuìjìn sān nián yǒu nǎxiē dàibiǎo xìng lùnwén?", english: "Topic selection must have a clear target. What are the representative papers on cultural term processing in the past three years?", vi: "Chọn đề tài phải có mục tiêu rõ. Hướng xử lý từ văn hóa, ba năm gần đây có những bài báo tiêu biểu nào?" },
      { speaker: "梅", chinese: "ACL 2023有一篇关于中日文化词翻译的, 还有清华去年的一篇用大语言模型做文化适配。", pinyin: "ACL 2023 yǒu yī piān guānyú zhōng-rì wénhuà cí fānyì de, hái yǒu Qīnghuá qùnián de yī piān yòng dà yǔyán móxíng zuò wénhuà shìpèi.", english: "ACL 2023 has one on Chinese-Japanese cultural term translation, plus Tsinghua's last year used LLMs for cultural adaptation.", vi: "ACL 2023 có một bài về dịch từ văn hóa Trung-Nhật, và Thanh Hoa năm ngoái có bài dùng mô hình ngôn ngữ lớn để thích ứng văn hóa." },
      { speaker: "王教授", chinese: "好, 那你的创新点在哪里? 别人没做过的是什么?", pinyin: "Hǎo, nà nǐ de chuàngxīn diǎn zài nǎlǐ? Biérén méi zuò guò de shì shénme?", english: "Good. So where is your innovation? What has nobody done before?", vi: "Được, vậy điểm sáng tạo của em ở đâu? Cái mà người khác chưa làm là gì?" },
      { speaker: "梅", chinese: "中越文化词在汉源词上有特殊重叠, 但词义已经分化。这个对比维度还没有专门的研究。", pinyin: "Zhōng-yuè wénhuà cí zài hàn yuán cí shàng yǒu tèshū chóngdié, dàn cíyì yǐjīng fēnhuà. Zhège duìbǐ wéidù hái méiyǒu zhuānmén de yánjiū.", english: "Chinese-Vietnamese cultural terms have special overlap on Sino-origin words, but meanings have diverged. This contrast dimension hasn't been specifically researched.", vi: "Từ văn hóa Trung-Việt có chồng chéo đặc biệt ở từ Hán gốc, nhưng nghĩa đã phân hóa. Chiều đối chiếu này chưa có nghiên cứu chuyên sâu." },
      { speaker: "王教授", chinese: "这个角度很有意思, 也有学术价值。你打算怎么收集数据?", pinyin: "Zhège jiǎodù hěn yǒu yìsi, yě yǒu xuéshù jiàzhí. Nǐ dǎsuàn zěnme shōují shùjù?", english: "That angle is interesting and has academic value. How do you plan to collect data?", vi: "Góc nhìn này rất thú vị và có giá trị học thuật. Em định thu thập dữ liệu thế nào?" },
      { speaker: "梅", chinese: "我打算从越南文学经典和中文古文中各选一千个文化词, 人工标注语义对应关系。", pinyin: "Wǒ dǎsuàn cóng Yuènán wénxué jīngdiǎn hé zhōngwén gǔwén zhōng gè xuǎn yīqiān gè wénhuà cí, réngōng biāozhù yǔyì duìyìng guānxi.", english: "I plan to select a thousand cultural terms each from Vietnamese literary classics and Chinese classical texts, manually annotating semantic correspondence.", vi: "Em định chọn 1000 từ văn hóa từ kinh điển văn học Việt và 1000 từ cổ văn Trung, gắn nhãn tương ứng ngữ nghĩa thủ công." },
      { speaker: "王教授", chinese: "人工标注一千对会很辛苦, 你最好集思广益, 找两三个同学一起。", pinyin: "Réngōng biāozhù yīqiān duì huì hěn xīnkǔ, nǐ zuìhǎo jí sī guǎng yì, zhǎo liǎng sān gè tóngxué yīqǐ.", english: "Manual annotation of a thousand pairs will be exhausting — better to draw on collective wisdom and find two or three classmates to help.", vi: "Gắn nhãn 1000 cặp thủ công sẽ rất mệt, em nên tập hợp ý kiến rộng rãi, tìm hai ba bạn cùng làm." },
      { speaker: "梅", chinese: "好的, 我会和阮同学还有黄同学商量。他们都对越南文学感兴趣。", pinyin: "Hǎo de, wǒ huì hé Ruǎn tóngxué hái yǒu Huáng tóngxué shāngliang. Tāmen dōu duì Yuènán wénxué gǎn xìngqù.", english: "Okay, I'll discuss with classmate Nguyen and classmate Hoang. Both are interested in Vietnamese literature.", vi: "Vâng, em sẽ thảo luận với bạn Nguyễn và bạn Hoàng. Cả hai đều quan tâm văn học Việt." },
      { speaker: "王教授", chinese: "另外, 你这周内把开题报告大纲发给我, 我看完一起讨论。", pinyin: "Lìngwài, nǐ zhè zhōu nèi bǎ kāití bàogào dàgāng fā gěi wǒ, wǒ kàn wán yīqǐ tǎolùn.", english: "Also, send me the proposal outline within this week, I'll read it and we'll discuss.", vi: "Ngoài ra, em gửi em đề cương trong tuần này, thầy đọc xong sẽ thảo luận cùng." },
      { speaker: "梅", chinese: "好, 我周五前一定发给您。请问大纲需要包括哪些部分?", pinyin: "Hǎo, wǒ zhōuwǔ qián yīdìng fā gěi nín. Qǐng wèn dàgāng xūyào bāokuò nǎxiē bùfèn?", english: "Okay, I'll send it before Friday. May I ask which sections the outline should include?", vi: "Vâng, em chắc chắn gửi trước thứ Sáu. Cho em hỏi đề cương cần bao gồm phần nào?" },
      { speaker: "王教授", chinese: "至少要有: 研究背景、文献综述、研究问题、方法、预期成果、时间计划。每部分一页就够。", pinyin: "Zhìshǎo yào yǒu: yánjiū bèijǐng, wénxiàn zōngshù, yánjiū wèntí, fāngfǎ, yùqī chéngguǒ, shíjiān jìhuà. Měi bùfèn yī yè jiù gòu.", english: "At minimum: background, literature review, research questions, methodology, expected outcomes, timeline. One page per section is enough.", vi: "Ít nhất phải có: nền tảng nghiên cứu, tổng quan tài liệu, câu hỏi nghiên cứu, phương pháp, kết quả dự kiến, kế hoạch thời gian. Mỗi phần một trang là đủ." },
      { speaker: "梅", chinese: "明白了, 谢谢您的指导。我会认真准备。", pinyin: "Míngbái le, xièxie nín de zhǐdǎo. Wǒ huì rènzhēn zhǔnbèi.", english: "Understood, thank you for your guidance. I'll prepare carefully.", vi: "Em hiểu rồi, cảm ơn thầy đã chỉ bảo. Em sẽ chuẩn bị nghiêm túc." }
    ],
    roleplay_prompts: [
      "Đóng vai sinh viên trình bày đề tài luận văn với giáo sư khó tính. Giáo sư bác bỏ hai trong ba hướng. Hãy không phòng thủ, lắng nghe lý do, và đề xuất điều chỉnh hướng còn lại theo gợi ý của giáo sư — dùng cụm '我会按照您的建议调整' và '让我重新想想'.",
      "Giáo sư hỏi 'điểm sáng tạo của em ở đâu' nhưng bạn chưa thực sự rõ. Đừng nói dối. Dùng cụm '这正是我想跟您讨论的地方' (đây chính là điểm em muốn thảo luận với thầy) — chuyển từ phòng thủ sang hỏi thẳng. Giáo sư Trung Quốc đánh giá cao sinh viên dám thừa nhận chưa biết.",
      "Bạn đã viết đề cương nhưng cảm thấy phương pháp chưa đủ mạnh. Hẹn gặp giáo sư để xin ý kiến. Hãy đóng vai chuẩn bị câu mở đầu, mô tả vấn đề cụ thể (KHÔNG nói 'em không biết phải làm gì'), và 2-3 phương án bạn đã nghĩ tới. Giáo sư đánh giá cao sinh viên đến với câu hỏi cụ thể, không đến với khoảng trống."
    ],
    register_notes: "Đối thoại với giáo sư hướng dẫn giữ register 您 toàn bộ — kể cả nếu thầy có đề nghị 'cứ gọi tôi là Lão Vương' (老王 — colloquial), bạn vẫn giữ '王教授' trong các cuộc trao đổi học thuật chính thức. Sinh viên Trung Quốc có thể chuyển sang 'Lão sư' khi thân hơn, nhưng sinh viên nước ngoài nên giữ formal lâu hơn — vì văn hóa khác nên giáo sư mong bạn giữ khoảng cách lễ độ.\n\nCác cụm formal academic bắt buộc: 请教 (qǐngjiào — xin được thỉnh giáo, dùng khi hỏi câu khó), 不吝赐教 (bù lìn cì jiào — xin thầy không tiếc lời chỉ bảo, dùng cuối email/đầu cuộc gặp formal), 您的建议 (nín de jiànyì — gợi ý của thầy, KHÔNG '你的意见'), 进一步 (jìnyībù — đi thêm bước nữa).\n\nKhi không đồng ý với giáo sư: KHÔNG dùng '我不同意' thẳng. Dùng '我有一些不同的想法, 请您看看是否合理' (em có vài suy nghĩ khác, xin thầy xem có hợp lý không) — chuyển từ đối đầu sang xin ý kiến. Giáo sư Trung Quốc đánh giá cao sinh viên có chính kiến nhưng biết cách thể hiện nhẹ nhàng.\n\nTránh: (a) Đem theo điện thoại đặt trên bàn — bị coi là không tôn trọng; (b) Cắt lời khi thầy đang giải thích; (c) Trả lời 'em không biết' trống không — luôn kèm '让我去查一下再回复您'.",
    idiom_glosses: [
      {
        idiom: "有的放矢",
        literal: "có đích thì bắn tên (yǒu dì fàng shǐ)",
        meaning: "Có mục tiêu rõ ràng — không bắn tên vu vơ. Cụm chuẩn giáo sư dùng để khuyên sinh viên thu hẹp đề tài: '选题要有的放矢, 不能太宽泛'. Khi nghe thầy nói cụm này = đề tài bạn còn quá rộng, cần cụ thể hơn.",
        example: "选题要有的放矢, 不能太宽泛。"
      },
      {
        idiom: "集思广益",
        literal: "tập hợp tư duy, làm rộng lợi ích (jí sī guǎng yì)",
        meaning: "Tập hợp ý kiến rộng rãi để có lợi ích lớn — làm việc nhóm, không một mình. Giáo sư khuyên sinh viên không tự ôm đề tài quá lớn: 'một mình làm sẽ chậm, hãy tìm bạn cùng nhau'.",
        example: "你最好集思广益, 找两三个同学一起做。"
      },
      {
        idiom: "推陈出新",
        literal: "đẩy cũ ra, đưa mới vào (tuī chén chū xīn)",
        meaning: "Loại bỏ cái cũ, đưa cái mới — tinh thần đổi mới trong nghiên cứu. Giáo sư Trung Quốc đặc biệt thích sinh viên làm được điều này: kế thừa nhưng có sáng tạo. Cụm dùng khi mô tả contribution của thesis.",
        example: "好的研究要在前人基础上推陈出新。"
      },
      {
        idiom: "锲而不舍",
        literal: "khắc mà không bỏ (qiè ér bù shě)",
        meaning: "Kiên trì không bỏ cuộc — khắc đá không ngừng. Cụm dùng để miêu tả thái độ làm thesis. Khi giáo sư nói '希望你锲而不舍' = thầy đang động viên bạn kiên trì qua khó khăn.",
        example: "做研究最重要的是锲而不舍。"
      }
    ],
    cultural_notes_vi: "Quan hệ giáo sư-học trò ở Trung Quốc đặc biệt hơn ở Việt Nam — không chỉ là quan hệ học thuật mà gần như quan hệ 'sư phụ-đệ tử'. Bốn nguyên tắc cốt lõi: (1) Giáo sư sẽ theo dõi bạn ngay cả sau khi tốt nghiệp — viết thư giới thiệu, kết nối công việc, mời về hội thảo. Vì vậy đầu tư vào quan hệ này = đầu tư dài hạn. (2) KHÔNG đổi giáo sư hướng dẫn giữa chừng trừ khi cực kỳ nghiêm trọng — bị coi là 'phản bội' (背叛 bèipàn). Nếu thực sự không hợp, phải làm qua trưởng khoa, không tự đi tìm thầy khác. (3) Thầy có thể yêu cầu bạn phụ việc cá nhân (mua sách, đặt vé hội thảo) — đây không phải lạm dụng mà là cách kiểm tra 'người có biết điều không'. Hợp tác = được dạy nhiều hơn. Từ chối thẳng = mất cơ hội. (4) Quà tặng đầu năm/tết Trung Thu — không bắt buộc nhưng được đánh giá cao. Quà nhỏ từ Việt Nam (cà phê, lụa) = lý tưởng. Đắt tiền = phản tác dụng (bị nghi hối lộ).\n\nVề thesis: chủ đề nghiên cứu thường là 'nửa của thầy, nửa của trò'. Thầy gợi ý hướng lớn (vì nó liên quan đến project quốc gia / quỹ nghiên cứu của thầy), bạn cụ thể hóa. Đừng đến cuộc gặp đầu với 'em đã quyết tâm làm X' — cứng quá. Nói 'em đang cân nhắc 3 hướng, muốn nghe thầy' = thầy có không gian định hình.\n\nNếu thesis của bạn tham gia project quốc gia của thầy, dữ liệu/code có thể cần ký NDA — KHÔNG được đăng GitHub public. Hỏi rõ trước khi làm, đừng giả định standard quốc tế.",
    tip_advice_vi: "(1) Hẹn gặp giáo sư qua email TRANG TRỌNG, không qua WeChat trừ khi thầy đã cho phép. Tiêu đề: '关于毕业论文选题的请教 — 学生陈氏梅' (về việc xin thỉnh giáo đề tài luận văn — sinh viên Trần Thị Mai). (2) Đến đúng giờ — nếu trễ phút nào, gửi tin nhắn xin lỗi ngay. Đến SỚM 5-10 phút, đợi trước văn phòng. (3) Mang theo vở ghi chép VÀ thiết bị ghi âm (xin phép trước nếu dùng). Thầy nói nhanh, có nhiều cụm chuyên môn — không kịp ghi sẽ mất thông tin. (4) Đầu cuộc gặp, mở bằng câu cảm ơn cụ thể: '感谢您上次给我的反馈, 我已经按照您的建议修改了' (cảm ơn phản hồi lần trước của thầy, em đã sửa theo gợi ý). Đừng vào thẳng vấn đề mới — thầy sẽ cảm thấy mình chỉ là công cụ. (5) Khi không hiểu, KHÔNG gật đầu giả vờ. Hỏi '不好意思, 您能再说一遍吗?' hoặc '让我确认一下我的理解'. Giáo sư Trung Quốc tôn trọng sinh viên hỏi lại hơn là sinh viên giả vờ hiểu rồi sai. (6) Cuối cuộc gặp, tóm tắt 3 việc cần làm tiếp: '我接下来会做ABC, 下周X前向您汇报'. Đây là dấu hiệu chuyên nghiệp đặc biệt mạnh. (7) Sau cuộc gặp, gửi email tóm tắt trong 24h: nội dung thảo luận, action items, deadline. Tiêu đề '与王教授会议纪要 — DD/MM' — đây là chuẩn academic Trung Quốc.",
    exercises: [
      { type: "fill-blank", question: "选题要 ___ , 不能太宽泛。", answer: "有的放矢" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung học thuật với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "导师", pinyin: "dǎo shī", english: "giáo sư hướng dẫn" },
          { chinese: "开题报告", pinyin: "kāi tí bào gào", english: "đề cương / proposal" },
          { chinese: "文献综述", pinyin: "wén xiàn zōng shù", english: "tổng quan tài liệu" },
          { chinese: "锲而不舍", pinyin: "qiè ér bù shě", english: "kiên trì không bỏ cuộc" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em sẽ thu hẹp đề tài theo gợi ý của thầy, gửi đề cương vào tuần sau.",
        chinese: "我会按照您的建议缩小选题, 下周把开题报告发给您。",
        pinyin: "Wǒ huì àn zhào nín de jiàn yì suō xiǎo xuǎn tí, xià zhōu bǎ kāi tí bào gào fā gěi nín."
      }
    ]
  },
  {
    id: 55,
    level: "B2",
    category: "study_career",
    title: "实习岗位的协商",
    pinyin: "shí xí gǎng wèi de xié shāng",
    topic: "Internship position negotiation",
    title_vi: "Thương lượng vị trí thực tập",
    title_en: "Negotiating an internship position",
    sentences: [
      {
        chinese: "李经理, 谢谢您给我这次实习的机会。",
        pinyin: "Lǐ jīnglǐ, xièxie nín gěi wǒ zhè cì shíxí de jīhuì.",
        english: "Manager Li, thank you for giving me this internship opportunity.",
        vi: "Anh Lý, em cảm ơn anh đã cho em cơ hội thực tập này.",
        pronunciation_focus: ["实习 → shíxí (thực tập)", "机会 → jīhuì", "经理 → jīnglǐ", "谢谢 → xièxie (rút gọn của 谢谢您)"]
      },
      {
        chinese: "我想跟您讨论一下实习的具体安排。",
        pinyin: "Wǒ xiǎng gēn nín tǎolùn yīxià shíxí de jùtǐ ānpái.",
        english: "I'd like to discuss the specific arrangements for the internship.",
        vi: "Em muốn thảo luận với anh về sắp xếp cụ thể của kỳ thực tập.",
        pronunciation_focus: ["讨论 → tǎolùn", "具体 → jùtǐ (cụ thể)", "安排 → ānpái (sắp xếp)", "实习 → shíxí"]
      },
      {
        chinese: "我希望能参与具体的项目, 而不只是辅助工作。",
        pinyin: "Wǒ xīwàng néng cānyù jùtǐ de xiàngmù, ér bù zhǐ shì fǔzhù gōngzuò.",
        english: "I hope to participate in specific projects, not just assistant work.",
        vi: "Em mong được tham gia dự án cụ thể, không chỉ làm việc phụ trợ.",
        pronunciation_focus: ["参与 → cānyù (tham gia)", "项目 → xiàngmù (dự án)", "辅助 → fǔzhù (phụ trợ)", "希望 → xīwàng"]
      },
      {
        chinese: "关于实习津贴, 不知道贵公司有什么标准?",
        pinyin: "Guānyú shíxí jīntiē, bù zhīdào guì gōngsī yǒu shénme biāozhǔn?",
        english: "Regarding internship stipend, may I ask what the company's standard is?",
        vi: "Về phụ cấp thực tập, không biết quý công ty có tiêu chuẩn thế nào?",
        pronunciation_focus: ["津贴 → jīntiē (phụ cấp)", "标准 → biāozhǔn (tiêu chuẩn)", "贵公司 → guì gōngsī (formal)", "关于 → guānyú (về)"]
      },
      {
        chinese: "我会量力而行, 把每件交代的任务做到最好。",
        pinyin: "Wǒ huì liànglì ér xíng, bǎ měi jiàn jiāodài de rènwù zuò dào zuì hǎo.",
        english: "I will act within my capacity and do every assigned task as best I can.",
        vi: "Em sẽ làm trong khả năng, hoàn thành tốt nhất mỗi việc được giao.",
        pronunciation_focus: ["量力而行 → liànglì ér xíng (idiom 4 chữ: làm trong khả năng)", "交代 → jiāodài (giao phó)", "任务 → rènwù (nhiệm vụ)", "做到最好 → zuò dào zuì hǎo"]
      }
    ],
    vocab: [
      { chinese: "实习", pinyin: "shí xí", english: "internship", vi: "thực tập" },
      { chinese: "实习生", pinyin: "shí xí shēng", english: "intern", vi: "thực tập sinh" },
      { chinese: "津贴", pinyin: "jīn tiē", english: "stipend / allowance", vi: "phụ cấp" },
      { chinese: "工作量", pinyin: "gōng zuò liàng", english: "workload", vi: "khối lượng công việc" },
      { chinese: "工作时间", pinyin: "gōng zuò shí jiān", english: "working hours", vi: "thời gian làm việc" },
      { chinese: "项目", pinyin: "xiàng mù", english: "project", vi: "dự án" },
      { chinese: "导师制", pinyin: "dǎo shī zhì", english: "mentor system", vi: "chế độ thầy hướng dẫn (mentor)" },
      { chinese: "转正", pinyin: "zhuǎn zhèng", english: "to convert from intern to full-time", vi: "chuyển chính thức (sau thực tập)" },
      { chinese: "量力而行", pinyin: "liàng lì ér xíng", english: "act within one's ability (4-char idiom)", vi: "làm trong khả năng" },
      { chinese: "循序渐进", pinyin: "xún xù jiàn jìn", english: "step by step", vi: "tuần tự tiến lên" }
    ],
    dialogue: [
      { speaker: "实习生", chinese: "李经理, 我下周一就能开始实习。", pinyin: "Lǐ jīnglǐ, wǒ xià zhōu yī jiù néng kāishǐ shíxí.", english: "Manager Li, I can start the internship next Monday.", vi: "Anh Lý, em có thể bắt đầu thực tập từ thứ Hai tuần sau." },
      { speaker: "李经理", chinese: "好的。具体安排我们一会儿讨论。", pinyin: "Hǎo de. Jùtǐ ānpái wǒmen yīhuǐr tǎolùn.", english: "Good. Let's discuss the specifics shortly.", vi: "Được. Lát nữa mình thảo luận chi tiết." },
      { speaker: "实习生", chinese: "我想知道工作时间和有没有导师指导。", pinyin: "Wǒ xiǎng zhīdào gōngzuò shíjiān hé yǒu méiyǒu dǎoshī zhǐdǎo.", english: "I'd like to know the working hours and if there's mentor guidance.", vi: "Em muốn biết thời gian làm việc và có thầy hướng dẫn không." },
      { speaker: "李经理", chinese: "工作时间九点到六点, 我们会给你安排一位mentor。", pinyin: "Gōngzuò shíjiān jiǔ diǎn dào liù diǎn, wǒmen huì gěi nǐ ānpái yī wèi mentor.", english: "Working hours are 9 to 6, and we'll assign you a mentor.", vi: "Giờ làm 9 đến 6, chúng tôi sẽ phân cho em một mentor." }
    ],
    dialogue_long: [
      { speaker: "实习生", chinese: "李经理, 您好。感谢公司接受我的实习申请。我想确认几个细节。", pinyin: "Lǐ jīnglǐ, nín hǎo. Gǎnxiè gōngsī jiēshòu wǒ de shíxí shēnqǐng. Wǒ xiǎng quèrèn jǐ gè xìjié.", english: "Manager Li, hello. Thank you for accepting my internship application. I'd like to confirm a few details.", vi: "Chào anh Lý. Cảm ơn công ty đã chấp nhận đơn thực tập của em. Em muốn xác nhận vài chi tiết." },
      { speaker: "李经理", chinese: "好, 你说说看。", pinyin: "Hǎo, nǐ shuōshuo kàn.", english: "Sure, go ahead.", vi: "Được, em nói xem nào." },
      { speaker: "实习生", chinese: "首先是实习时长。我打算从七月一号到九月三十号, 一共三个月, 您看可以吗?", pinyin: "Shǒuxiān shì shíxí shícháng. Wǒ dǎsuàn cóng qī yuè yī hào dào jiǔ yuè sānshí hào, yīgòng sān gè yuè, nín kàn kěyǐ ma?", english: "First, internship duration. I plan from July 1st to September 30th, three months total. Is that okay?", vi: "Đầu tiên là thời lượng thực tập. Em định từ 1/7 đến 30/9, tổng cộng ba tháng, anh thấy ổn không?" },
      { speaker: "李经理", chinese: "三个月可以, 但我们一般实习生最少六个月。三个月你能学到的有限。", pinyin: "Sān gè yuè kěyǐ, dàn wǒmen yībān shíxíshēng zuìshǎo liù gè yuè. Sān gè yuè nǐ néng xué dào de yǒuxiàn.", english: "Three months works, but our interns usually do at least six. In three months, what you can learn is limited.", vi: "Ba tháng được, nhưng thường thực tập sinh chúng tôi tối thiểu sáu tháng. Ba tháng em học được không nhiều." },
      { speaker: "实习生", chinese: "我理解。但九月开学, 我必须回学校。如果可以, 寒假再来三个月, 加起来六个月可以吗?", pinyin: "Wǒ lǐjiě. Dàn jiǔ yuè kāixué, wǒ bìxū huí xuéxiào. Rúguǒ kěyǐ, hánjià zài lái sān gè yuè, jiā qǐlái liù gè yuè kěyǐ ma?", english: "I understand. But September is school start — I must return to school. If possible, three more months in winter break, totaling six months — would that work?", vi: "Em hiểu. Nhưng tháng 9 vào học, em phải về trường. Nếu được, kỳ nghỉ đông quay lại ba tháng nữa, cộng lại sáu tháng được không?" },
      { speaker: "李经理", chinese: "这个安排不错, 但要看你寒假期间项目的连续性。我们再讨论。", pinyin: "Zhège ānpái bùcuò, dàn yào kàn nǐ hánjià qījiān xiàngmù de liánxù xìng. Wǒmen zài tǎolùn.", english: "That arrangement is decent, but depends on project continuity during winter break. Let's discuss further.", vi: "Cách sắp xếp này ổn, nhưng còn tùy vào tính liên tục của dự án trong kỳ đông. Mình thảo luận thêm." },
      { speaker: "实习生", chinese: "好的。第二个问题是津贴。请问贵公司实习生的津贴标准是多少?", pinyin: "Hǎo de. Dì èr gè wèntí shì jīntiē. Qǐng wèn guì gōngsī shíxíshēng de jīntiē biāozhǔn shì duōshao?", english: "Okay. Second question is stipend. May I ask the company's intern stipend standard?", vi: "Vâng. Câu thứ hai là phụ cấp. Cho em hỏi tiêu chuẩn phụ cấp thực tập sinh của quý công ty là bao nhiêu?" },
      { speaker: "李经理", chinese: "本科生每天两百, 研究生每天三百。包午餐, 不报销住宿。", pinyin: "Běnkē shēng měi tiān èr bǎi, yánjiūshēng měi tiān sān bǎi. Bāo wǔcān, bù bàoxiāo zhùsù.", english: "Undergrads 200 RMB per day, grad students 300. Lunch included, no housing reimbursement.", vi: "Sinh viên đại học 200 tệ/ngày, sau đại học 300 tệ/ngày. Bao ăn trưa, không hoàn tiền nhà ở." },
      { speaker: "实习生", chinese: "明白。第三, 关于工作内容, 我希望能参与具体项目, 而不只做辅助工作。", pinyin: "Míngbái. Dì sān, guānyú gōngzuò nèiróng, wǒ xīwàng néng cānyù jùtǐ xiàngmù, ér bù zhǐ zuò fǔzhù gōngzuò.", english: "Understood. Third, regarding work content, I hope to join concrete projects, not just assistant work.", vi: "Em hiểu. Thứ ba, về nội dung công việc, em mong tham gia dự án cụ thể, không chỉ việc phụ trợ." },
      { speaker: "李经理", chinese: "这个我能理解。但实习初期还是从基础工作开始, 循序渐进。前两周熟悉环境, 之后会安排你跟一个小项目。", pinyin: "Zhège wǒ néng lǐjiě. Dàn shíxí chūqī háishì cóng jīchǔ gōngzuò kāishǐ, xúnxù jiànjìn. Qián liǎng zhōu shúxī huánjìng, zhīhòu huì ānpái nǐ gēn yī gè xiǎo xiàngmù.", english: "I understand. But early on we still start with basic work, step by step. First two weeks for orientation, then we'll put you on a small project.", vi: "Anh hiểu. Nhưng giai đoạn đầu vẫn phải bắt đầu từ việc cơ bản, tuần tự tiến lên. Hai tuần đầu làm quen, sau đó sẽ phân cho em một dự án nhỏ." },
      { speaker: "实习生", chinese: "好的, 我会量力而行。如果项目需要加班, 是否有额外补贴?", pinyin: "Hǎo de, wǒ huì liànglì ér xíng. Rúguǒ xiàngmù xūyào jiābān, shìfǒu yǒu éwài bǔtiē?", english: "Okay, I'll work within my capacity. If projects need overtime, is there extra allowance?", vi: "Vâng, em sẽ làm trong khả năng. Nếu dự án cần tăng ca, có phụ cấp thêm không?" },
      { speaker: "李经理", chinese: "实习生原则上不加班。如果情况特殊, 我会单独和你商量, 不会强制。", pinyin: "Shíxíshēng yuánzé shàng bù jiābān. Rúguǒ qíngkuàng tèshū, wǒ huì dāndú hé nǐ shāngliang, bù huì qiángzhì.", english: "Interns in principle don't do overtime. If circumstances are special, I'll discuss with you privately, no forcing.", vi: "Thực tập sinh về nguyên tắc không tăng ca. Nếu hoàn cảnh đặc biệt, anh sẽ thảo luận riêng với em, không bắt buộc." },
      { speaker: "实习生", chinese: "谢谢您的体贴。最后, 实习结束后是否有转正机会?", pinyin: "Xièxie nín de tǐtiē. Zuìhòu, shíxí jiéshù hòu shìfǒu yǒu zhuǎnzhèng jīhuì?", english: "Thank you for your consideration. Finally, after the internship, is there a chance to convert to full-time?", vi: "Cảm ơn anh đã quan tâm. Cuối cùng, sau khi thực tập có cơ hội chuyển chính thức không?" },
      { speaker: "李经理", chinese: "有, 表现优秀的实习生我们会优先考虑转正。具体看你的整体表现和团队推荐。", pinyin: "Yǒu, biǎoxiàn yōuxiù de shíxíshēng wǒmen huì yōuxiān kǎolǜ zhuǎnzhèng. Jùtǐ kàn nǐ de zhěngtǐ biǎoxiàn hé tuánduì tuījiàn.", english: "Yes, outstanding interns get priority for conversion. Specifics depend on your overall performance and team recommendation.", vi: "Có. Thực tập sinh xuất sắc sẽ được ưu tiên chuyển chính thức. Tùy vào biểu hiện tổng thể và đề xuất của team." },
      { speaker: "实习生", chinese: "明白了。我会努力争取。麻烦您把书面合同发我一份, 我家长想看一下。", pinyin: "Míngbái le. Wǒ huì nǔlì zhēngqǔ. Máfan nín bǎ shūmiàn hétong fā wǒ yī fèn, wǒ jiāzhǎng xiǎng kàn yīxià.", english: "Understood. I'll work hard for it. Could you send me the written contract — my parents would like to see it.", vi: "Em hiểu rồi. Em sẽ cố gắng. Phiền anh gửi em bản hợp đồng văn bản, bố mẹ em muốn xem." },
      { speaker: "李经理", chinese: "没问题, 今天下班前发到你邮箱。还有什么疑问随时联系我。", pinyin: "Méi wèntí, jīntiān xiàbān qián fā dào nǐ yóuxiāng. Hái yǒu shénme yíwèn suíshí liánxì wǒ.", english: "No problem, will send to your email by end of today. Any questions, contact me anytime.", vi: "Không vấn đề, trước giờ tan ca hôm nay sẽ gửi vào email của em. Có thắc mắc gì cứ liên hệ anh bất cứ lúc nào." }
    ],
    roleplay_prompts: [
      "Đóng vai sinh viên Việt Nam thương lượng thời lượng thực tập với manager Trung Quốc — bạn chỉ có 3 tháng nhưng công ty yêu cầu 6 tháng. Hãy đề xuất phương án 'split' (3 tháng hè + 3 tháng đông) và cam kết 'remote' giai đoạn giữa nếu cần.",
      "Manager đề nghị mức phụ cấp 150 tệ/ngày, thấp hơn mặt bằng. Hãy thương lượng tăng lên 200 — KHÔNG đòi hỏi cứng nhắc, nhưng đưa ra dữ liệu thị trường (mức HSK 5+, sinh viên top trường) và đề xuất 'thử việc 1 tháng, sau đó review'.",
      "Sau 2 tuần thực tập, bạn nhận ra mình chỉ được giao việc copy-paste, không có project. Hãy hẹn gặp manager riêng để xin chuyển sang việc có ý nghĩa hơn — KHÔNG phàn nàn về quá khứ, nói về điều bạn muốn làm tiếp theo. Dùng cụm '我希望能更好地发挥我的能力'."
    ],
    register_notes: "Thương lượng thực tập là môi trường formal vừa phải — không quá cao như phỏng vấn CSC nhưng vẫn 您 thường xuyên. Manager là 经理 (jīnglǐ) hoặc 主管 (zhǔguǎn) — gọi bằng họ + chức danh. Nếu manager trẻ và bảo 'cứ gọi anh là Tiểu Lý' (小李), bạn vẫn nên giữ '李经理' trong các cuộc trao đổi chính thức về hợp đồng/lương.\n\nCác cụm formal về thực tập: 实习津贴 (shíxí jīntiē — phụ cấp thực tập), 工作内容 (gōngzuò nèiróng — nội dung công việc), 转正 (zhuǎnzhèng — chuyển chính thức), 加班 (jiābān — tăng ca), 量力而行 (liànglì ér xíng — làm trong khả năng).\n\nKhi đề nghị tăng phụ cấp/giờ làm: KHÔNG dùng '我要' (tôi muốn). Dùng '我希望' hoặc '不知道是否可以'. Khi từ chối yêu cầu của manager: KHÔNG '我不行'. Dùng '我尽量' (tôi sẽ cố hết sức) hoặc '让我再想想' (để em suy nghĩ thêm). Manager Trung Quốc đặc biệt phản cảm với 'cứng nhắc' từ thực tập sinh.\n\nQuan trọng: KHÔNG gửi email khiếu nại/thương lượng quan trọng qua WeChat — phải qua email công ty. WeChat dùng cho cập nhật hàng ngày, không cho thương lượng.",
    idiom_glosses: [
      {
        idiom: "量力而行",
        literal: "đo sức rồi mà đi (liàng lì ér xíng)",
        meaning: "Làm trong khả năng — biết giới hạn của mình. Cụm khiêm tốn lý tưởng cho thực tập sinh: thừa nhận chưa giàu kinh nghiệm nhưng cam kết làm tốt nhất có thể. Tránh hứa quá lớn rồi không làm được.",
        example: "我会量力而行, 把每件任务做到最好。"
      },
      {
        idiom: "循序渐进",
        literal: "theo thứ tự dần tiến (xún xù jiàn jìn)",
        meaning: "Tuần tự tiến lên — học từ cơ bản đến nâng cao. Cụm manager thường dùng để giải thích vì sao thực tập sinh phải bắt đầu từ việc cơ bản. Khi nghe manager nói cụm này = chấp nhận lộ trình, đừng đòi 'nhảy cóc'.",
        example: "实习初期循序渐进, 不要太着急。"
      },
      {
        idiom: "实事求是",
        literal: "tìm sự thật từ sự việc (shí shì qiú shì)",
        meaning: "Thực sự cầu thị — nói thật, không khoe khoang, không che giấu. Cụm dùng khi báo cáo tiến độ với manager: thừa nhận điều chưa làm xong, đề xuất cách giải quyết. Manager Trung Quốc đánh giá rất cao thái độ này.",
        example: "汇报工作要实事求是, 不要虚报。"
      },
      {
        idiom: "抛砖引玉",
        literal: "ném gạch dụ ngọc (pāo zhuān yǐn yù)",
        meaning: "Đem cái thô (của mình) để dụ cái tinh (của người) — khiêm tốn dùng khi đề xuất ý tưởng. Cụm chuẩn khi thực tập sinh dám đưa đề xuất với senior: '我先抛砖引玉, 大家有更好的想法欢迎补充'.",
        example: "我先抛砖引玉, 提一个初步想法。"
      }
    ],
    cultural_notes_vi: "Văn hóa thực tập Trung Quốc đại lục đặc biệt khác biệt với Việt Nam ở bốn điểm: (1) Thực tập KHÔNG phải là 'học việc miễn phí' như nhiều người Việt nghĩ — phụ cấp 150-300 tệ/ngày là chuẩn, có hợp đồng chính thức, đóng bảo hiểm xã hội (一般实习生险 yībān shíxíshēng xiǎn). KHÔNG ký hợp đồng = công ty 'đen', tránh xa. (2) Thực tập sinh được kỳ vọng làm việc THẬT, không chỉ photocopy/pha trà. Nhưng cũng KHÔNG được phép sai sót lớn — khác Mỹ (nơi 'fail fast' OK), Trung Quốc kỳ vọng thực tập sinh chăm chỉ + ít sai. (3) Mối quan hệ với 'mentor' (đồng nghiệp được phân để hướng dẫn bạn) cực quan trọng — đây là người sẽ viết đánh giá cuối kỳ và quyết định 转正 (chuyển chính thức). Tặng quà cuối kỳ (không bắt buộc nhưng được đánh giá cao): cà phê Việt Nam, bánh kẹo, vật kỷ niệm — tránh đắt tiền. (4) 'Nhậu' (聚餐 jùcān) team là cơ hội xây dựng quan hệ — đừng từ chối hết. Nếu không uống rượu được, nói 'đang dùng thuốc' (在吃药) — không bị hỏi thêm. Người không đi 聚餐 = bị coi là 'không hòa nhập' và mất cơ hội 转正.\n\nVề 转正: tỉ lệ chuyển từ thực tập sang chính thức ở các công ty Trung Quốc lớn (Tencent, Alibaba, ByteDance) khoảng 30-50%. Yếu tố quyết định: (a) đánh giá của mentor; (b) đóng góp cụ thể cho project; (c) thái độ làm việc (khiêm tốn, chủ động, ít than vãn); (d) quan hệ với team — không phải chỉ kỹ năng. Sinh viên Việt Nam thường giỏi (a) và (c) nhưng yếu (d) — đầu tư vào quan hệ team từ đầu.\n\nThời gian thực tập tiêu chuẩn: 6 tháng cho mainland (3 tháng coi là 'quá ngắn', không đủ thấy biểu hiện). Nếu chỉ có 3 tháng do lịch học, đề xuất split (3 hè + 3 đông) hoặc 'remote part-time' giai đoạn giữa.",
    tip_advice_vi: "(1) Khi nhận offer thực tập, KHÔNG vội ký ngay. Yêu cầu hợp đồng văn bản (实习协议 shíxí xiéyì), đọc kỹ 6 mục: thời lượng, giờ làm, phụ cấp, công việc cụ thể, bảo hiểm, điều khoản chấm dứt. Nếu thiếu mục nào = công ty không chuyên nghiệp, cẩn thận. (2) Tuần đầu đến công ty SỚM 30 phút, làm quen với mọi người, ghi nhớ tên + chức vụ. Sếp Trung Quốc đặc biệt nhớ thực tập sinh chào hỏi đầy đủ. (3) KHÔNG mang đồ ăn nặng mùi (pho gà, mắm tôm) lên văn phòng — văn phòng Trung Quốc thường không có khu ăn riêng, mùi sẽ gây phản cảm. (4) Khi mentor giao việc, LUÔN tóm tắt lại để xác nhận: '我理解一下, 您是想让我做ABC, 截止时间是X, 对吗?'. Bước này cứu bạn khỏi 80% lỗi. (5) Khi sai, KHÔNG che giấu. Nói '我做错了, 现在的情况是X, 我想到的解决方案是Y, 您看可以吗?' — chuyển từ 'tôi sai' sang 'tôi đã có giải pháp'. Manager Trung Quốc đánh giá rất cao. (6) Cuối tuần, gửi email tóm tắt cho mentor: việc đã làm + việc tuần sau + câu hỏi cần hỗ trợ. Đây là 周报 (zhōubào — báo cáo tuần), chuẩn mực ở các công ty Trung Quốc lớn. (7) Nếu được chuyển chính thức, đừng vội đồng ý. Hỏi rõ vị trí, lương, lộ trình thăng tiến. Manager mong bạn 'chín chắn', không 'mê mẩn ngay'.",
    exercises: [
      { type: "fill-blank", question: "实习初期不要太急, 要 ___ 。", answer: "循序渐进" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung thực tập với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "实习津贴", pinyin: "shí xí jīn tiē", english: "phụ cấp thực tập" },
          { chinese: "转正", pinyin: "zhuǎn zhèng", english: "chuyển chính thức" },
          { chinese: "量力而行", pinyin: "liàng lì ér xíng", english: "làm trong khả năng" },
          { chinese: "抛砖引玉", pinyin: "pāo zhuān yǐn yù", english: "ném gạch dụ ngọc (đề xuất khiêm tốn)" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em hy vọng được tham gia dự án cụ thể, không chỉ làm việc phụ trợ. Em sẽ làm trong khả năng và làm tốt nhất mỗi việc được giao.",
        chinese: "我希望能参与具体项目, 不只做辅助工作。我会量力而行, 把每件任务做到最好。",
        pinyin: "Wǒ xī wàng néng cān yù jù tǐ xiàng mù, bù zhǐ zuò fǔ zhù gōng zuò. Wǒ huì liàng lì ér xíng, bǎ měi jiàn rèn wù zuò dào zuì hǎo."
      }
    ]
  },
  {
    id: 56,
    level: "B2",
    category: "study_career",
    title: "给留学办公室发邮件咨询签证",
    pinyin: "gěi liú xué bàn gōng shì fā yóu jiàn zī xún qiān zhèng",
    topic: "Emailing study-abroad office about visa",
    title_vi: "Gửi email cho văn phòng du học hỏi về visa",
    title_en: "Emailing the study-abroad office about visa",
    sentences: [
      {
        chinese: "尊敬的留学办公室老师, 您好。",
        pinyin: "Zūnjìng de liúxué bàngōngshì lǎoshī, nín hǎo.",
        english: "Respected teachers at the study-abroad office, hello.",
        vi: "Kính gửi các thầy cô văn phòng du học, em xin chào.",
        pronunciation_focus: ["尊敬的 → zūnjìng de (formal opening)", "留学办公室 → liúxué bàngōngshì (văn phòng du học)", "您好 → nín hǎo", "老师 → lǎoshī (gọi chung cho cán bộ trường)"]
      },
      {
        chinese: "我是已被贵校录取的越南籍硕士新生。",
        pinyin: "Wǒ shì yǐ bèi guì xiào lùqǔ de Yuènán jí shuòshì xīnshēng.",
        english: "I am a newly admitted Vietnamese Master's student at your university.",
        vi: "Em là tân sinh viên thạc sĩ người Việt đã được quý trường nhận.",
        pronunciation_focus: ["贵校 → guì xiào (quý trường — formal)", "录取 → lùqǔ (tuyển nhận)", "越南籍 → Yuènán jí (quốc tịch Việt Nam)", "硕士新生 → shuòshì xīnshēng"]
      },
      {
        chinese: "我想咨询一下学习签证(X1)办理的具体流程。",
        pinyin: "Wǒ xiǎng zīxún yīxià xuéxí qiānzhèng (X1) bànlǐ de jùtǐ liúchéng.",
        english: "I'd like to inquire about the specific procedure for processing the student visa (X1).",
        vi: "Em muốn hỏi về quy trình cụ thể làm visa du học (X1).",
        pronunciation_focus: ["咨询 → zīxún (tham vấn / hỏi)", "签证 → qiānzhèng (visa)", "X1 → loại visa du học dài hạn", "流程 → liúchéng (quy trình)"]
      },
      {
        chinese: "我目前还没收到JW202表和录取通知书的纸质版。",
        pinyin: "Wǒ mùqián hái méi shōu dào JW202 biǎo hé lùqǔ tōngzhīshū de zhǐzhì bǎn.",
        english: "I have not yet received the paper version of the JW202 form and admission letter.",
        vi: "Hiện em chưa nhận được bản giấy của mẫu JW202 và giấy báo nhập học.",
        pronunciation_focus: ["JW202表 → mẫu đơn quan trọng cho visa du học", "录取通知书 → lùqǔ tōngzhīshū (giấy báo nhập học)", "纸质版 → zhǐzhì bǎn (bản giấy)", "目前 → mùqián"]
      },
      {
        chinese: "请问大约什么时候能收到? 不胜感激。",
        pinyin: "Qǐng wèn dàyuē shénme shíhou néng shōu dào? Bù shèng gǎnjī.",
        english: "May I ask approximately when I will receive them? Greatly appreciated.",
        vi: "Cho em hỏi khoảng khi nào em có thể nhận được? Em vô cùng biết ơn.",
        pronunciation_focus: ["大约 → dàyuē (khoảng)", "不胜感激 → bù shèng gǎnjī (vô cùng biết ơn — formal email closer)", "请问 → qǐng wèn (cho phép em hỏi)", "什么时候 → shénme shíhou"]
      }
    ],
    vocab: [
      { chinese: "留学", pinyin: "liú xué", english: "study abroad", vi: "du học" },
      { chinese: "签证", pinyin: "qiān zhèng", english: "visa", vi: "thị thực" },
      { chinese: "录取通知书", pinyin: "lù qǔ tōng zhī shū", english: "admission letter", vi: "giấy báo nhập học" },
      { chinese: "JW202表", pinyin: "JW èr líng èr biǎo", english: "JW202 form (visa application form for Chinese student visa)", vi: "mẫu JW202" },
      { chinese: "体检", pinyin: "tǐ jiǎn", english: "physical examination", vi: "khám sức khỏe" },
      { chinese: "邮寄", pinyin: "yóu jì", english: "to post / mail", vi: "gửi qua bưu điện" },
      { chinese: "公证", pinyin: "gōng zhèng", english: "notarization", vi: "công chứng" },
      { chinese: "不胜感激", pinyin: "bù shèng gǎn jī", english: "greatly appreciated (formal email closer)", vi: "vô cùng biết ơn" },
      { chinese: "有备无患", pinyin: "yǒu bèi wú huàn", english: "be prepared, avoid trouble", vi: "có chuẩn bị thì không lo" },
      { chinese: "按部就班", pinyin: "àn bù jiù bān", english: "follow steps in order", vi: "theo từng bước" }
    ],
    dialogue: [
      { speaker: "学生", chinese: "您好, 我是越南来的新生, 想咨询签证的事。", pinyin: "Nín hǎo, wǒ shì Yuènán lái de xīnshēng, xiǎng zīxún qiānzhèng de shì.", english: "Hello, I'm a new student from Vietnam wanting to inquire about the visa.", vi: "Chào thầy cô, em là tân sinh viên đến từ Việt Nam, muốn hỏi về visa." },
      { speaker: "办公室老师", chinese: "好的, 您的录取通知书号是多少?", pinyin: "Hǎo de, nín de lùqǔ tōngzhīshū hào shì duōshao?", english: "Sure, what's your admission letter number?", vi: "Được, số giấy báo nhập học của em là bao nhiêu?" },
      { speaker: "学生", chinese: "QH202509-1234。", pinyin: "QH èr líng èr wǔ líng jiǔ - yāo èr sān sì.", english: "QH202509-1234.", vi: "QH202509-1234." },
      { speaker: "办公室老师", chinese: "查到了, 您的JW202表已经在邮寄路上, 大概十天到。", pinyin: "Chá dào le, nín de JW202 biǎo yǐjīng zài yóujì lùshàng, dàgài shí tiān dào.", english: "Found you. Your JW202 is already in the mail, about ten days to arrive.", vi: "Tìm thấy rồi, mẫu JW202 của em đã trên đường gửi, khoảng 10 ngày sẽ đến." }
    ],
    dialogue_long: [
      { speaker: "学生", chinese: "尊敬的留学办公室老师, 您好。我是QH202509-1234, 越南河内的陈氏梅。", pinyin: "Zūnjìng de liúxué bàngōngshì lǎoshī, nín hǎo. Wǒ shì QH202509-1234, Yuènán Hénèi de Chén Shìméi.", english: "Respected teachers, hello. I'm QH202509-1234, Tran Thi Mai from Hanoi, Vietnam.", vi: "Kính gửi các thầy cô, em xin chào. Em là số QH202509-1234, Trần Thị Mai từ Hà Nội, Việt Nam." },
      { speaker: "办公室老师", chinese: "您好, 陈同学。需要什么帮助?", pinyin: "Nín hǎo, Chén tóngxué. Xūyào shénme bāngzhù?", english: "Hello, Chen. What help do you need?", vi: "Chào em Trần. Em cần giúp gì?" },
      { speaker: "学生", chinese: "我下个月就要赴中国了, 但JW202表和录取通知书的纸质版还没收到。", pinyin: "Wǒ xià gè yuè jiù yào fù Zhōngguó le, dàn JW202 biǎo hé lùqǔ tōngzhīshū de zhǐzhì bǎn hái méi shōu dào.", english: "I'm going to China next month, but I haven't received the paper JW202 and admission letter yet.", vi: "Tháng sau em đã phải sang Trung Quốc, nhưng bản giấy mẫu JW202 và giấy báo nhập học vẫn chưa nhận được." },
      { speaker: "办公室老师", chinese: "我帮您查一下。请稍等。... 您的材料是上周三发的, 走的是DHL国际快递。", pinyin: "Wǒ bāng nín chá yīxià. Qǐng shāo děng. ... Nín de cáiliào shì shàng zhōu sān fā de, zǒu de shì DHL guójì kuàidì.", english: "Let me check for you. One moment... Your materials were sent last Wednesday by DHL international express.", vi: "Em để cô tra cứu. Xin đợi một chút... Tài liệu của em đã gửi từ thứ Tư tuần trước, đi DHL quốc tế." },
      { speaker: "学生", chinese: "请问大约什么时候能到河内?", pinyin: "Qǐng wèn dàyuē shénme shíhou néng dào Hénèi?", english: "May I ask approximately when it will reach Hanoi?", vi: "Cho em hỏi khoảng khi nào sẽ đến Hà Nội?" },
      { speaker: "办公室老师", chinese: "DHL一般七到十天。这是您的运单号: 1234567890。您可以在DHL官网查。", pinyin: "DHL yībān qī dào shí tiān. Zhè shì nín de yùndān hào: 1234567890. Nín kěyǐ zài DHL guānwǎng chá.", english: "DHL usually takes 7-10 days. Here's your tracking number: 1234567890. You can check on DHL's official site.", vi: "DHL thường 7-10 ngày. Đây là mã vận đơn: 1234567890. Em có thể tra trên website DHL." },
      { speaker: "学生", chinese: "好的, 谢谢。还有一个问题: 我办X1签证除了JW202还需要哪些材料?", pinyin: "Hǎo de, xièxie. Hái yǒu yī gè wèntí: wǒ bàn X1 qiānzhèng chúle JW202 hái xūyào nǎxiē cáiliào?", english: "Okay, thanks. One more question: besides the JW202, what other materials do I need for X1 visa?", vi: "Vâng, cảm ơn. Còn câu nữa: làm visa X1 ngoài JW202, em cần thêm tài liệu gì?" },
      { speaker: "办公室老师", chinese: "需要: 护照原件 (有效期六个月以上)、录取通知书原件、JW202原件、近期照片、签证申请表。", pinyin: "Xūyào: hùzhào yuánjiàn (yǒuxiào qī liù gè yuè yǐshàng), lùqǔ tōngzhīshū yuánjiàn, JW202 yuánjiàn, jìnqī zhàopiàn, qiānzhèng shēnqǐng biǎo.", english: "You need: passport original (valid 6+ months), admission letter original, JW202 original, recent photo, visa application form.", vi: "Cần: hộ chiếu gốc (còn hạn từ 6 tháng trở lên), giấy báo nhập học gốc, JW202 gốc, ảnh mới, đơn xin visa." },
      { speaker: "学生", chinese: "体检也需要做对吗?", pinyin: "Tǐjiǎn yě xūyào zuò duì ma?", english: "I also need to do a physical exam, right?", vi: "Khám sức khỏe cũng cần làm phải không?" },
      { speaker: "办公室老师", chinese: "对, 需要在指定医院做。您去越南卫生部认可的医院, 拿《外国人体格检查记录》表。", pinyin: "Duì, xūyào zài zhǐdìng yīyuàn zuò. Nín qù Yuènán wèishēng bù rènkě de yīyuàn, ná 《Wàiguó rén tǐgé jiǎnchá jìlù》 biǎo.", english: "Yes, must be done at designated hospital. Go to a Vietnam Ministry of Health-approved hospital and get the 'Foreigner Physical Examination Record' form.", vi: "Đúng, phải làm ở bệnh viện chỉ định. Em đến bệnh viện được Bộ Y tế Việt Nam công nhận, lấy biểu mẫu 'Hồ sơ khám sức khỏe người nước ngoài'." },
      { speaker: "学生", chinese: "请问体检的有效期是多久?", pinyin: "Qǐng wèn tǐjiǎn de yǒuxiào qī shì duō jiǔ?", english: "May I ask the validity period of the physical exam?", vi: "Cho em hỏi kết quả khám sức khỏe có hiệu lực bao lâu?" },
      { speaker: "办公室老师", chinese: "六个月。所以您不要太早做, 大约出发前一个月做最合适。", pinyin: "Liù gè yuè. Suǒyǐ nín bù yào tài zǎo zuò, dàyuē chūfā qián yī gè yuè zuò zuì héshì.", english: "Six months. So don't do it too early — about a month before departure is most suitable.", vi: "Sáu tháng. Vậy nên em đừng làm quá sớm, khoảng một tháng trước khi đi là phù hợp nhất." },
      { speaker: "学生", chinese: "明白。最后一个问题, 学费什么时候交? 我现在可以先转账吗?", pinyin: "Míngbái. Zuìhòu yī gè wèntí, xuéfèi shénme shíhou jiāo? Wǒ xiànzài kěyǐ xiān zhuǎnzhàng ma?", english: "Understood. Last question: when do I pay tuition? Can I transfer now?", vi: "Em hiểu. Câu cuối, học phí khi nào nộp? Em có thể chuyển khoản trước được không?" },
      { speaker: "办公室老师", chinese: "建议您到校后再交, 因为我们要核对身份。如果一定要先交, 必须用我们的官方账号, 我现在发给您。", pinyin: "Jiànyì nín dào xiào hòu zài jiāo, yīnwèi wǒmen yào héduì shēnfèn. Rúguǒ yīdìng yào xiān jiāo, bìxū yòng wǒmen de guānfāng zhànghào, wǒ xiànzài fā gěi nín.", english: "Recommend paying after arrival, since we need identity verification. If you must pay early, must use our official account — I'll send it now.", vi: "Khuyên em đến trường rồi nộp, vì cần đối chiếu danh tính. Nếu nhất định nộp sớm, phải dùng tài khoản chính thức của trường, cô gửi em ngay." },
      { speaker: "学生", chinese: "好的, 那我等到校再交。非常感谢您的耐心解答!", pinyin: "Hǎo de, nà wǒ děng dào xiào zài jiāo. Fēicháng gǎnxiè nín de nàixīn jiědá!", english: "Okay, I'll wait until arrival. Thank you very much for your patient explanation!", vi: "Vâng, vậy em đợi đến trường rồi nộp. Cảm ơn cô rất nhiều đã kiên nhẫn giải đáp!" },
      { speaker: "办公室老师", chinese: "不客气。如果还有问题, 您可以发邮件到 admission@xxx.edu.cn, 我们会尽快回复。", pinyin: "Bù kèqì. Rúguǒ hái yǒu wèntí, nín kěyǐ fā yóujiàn dào admission@xxx.edu.cn, wǒmen huì jǐn kuài huífù.", english: "You're welcome. If more questions, email admission@xxx.edu.cn — we'll reply as soon as possible.", vi: "Không có gì. Nếu còn thắc mắc, em có thể gửi email tới admission@xxx.edu.cn, chúng tôi sẽ phản hồi sớm." }
    ],
    roleplay_prompts: [
      "Đóng vai sinh viên Việt Nam viết email đầu tiên cho văn phòng du học Trung Quốc khi JW202 chưa đến sau 4 tuần. Hãy viết theo cấu trúc: tiêu đề trang trọng + chào + tự giới thiệu (mã sinh viên) + nêu vấn đề cụ thể + câu hỏi rõ ràng + cảm ơn (kèm 不胜感激) + ký tên đầy đủ. KHÔNG dùng tone gấp gáp.",
      "Sau khi nhận JW202, bạn phát hiện thông tin SAI (tên bị viết nhầm, tháng sinh sai). Hãy viết email báo lỗi — không đổ lỗi, chỉ nêu sự việc + đề xuất giải pháp + xác nhận deadline. Dùng cụm '我注意到...可能存在出入' (em nhận thấy có thể có sai sót).",
      "Bạn đã làm khám sức khỏe ở bệnh viện không nằm trong danh sách Bộ Y tế Việt Nam công nhận. Văn phòng du học từ chối kết quả. Hãy viết email xin được làm lại + xin gia hạn deadline visa do lỗi thông tin từ phía bạn — chịu trách nhiệm rõ, không đổ lỗi cho bệnh viện."
    ],
    register_notes: "Email cho văn phòng du học là môi trường formal cao nhất của giao tiếp viết — cao hơn email cho manager công ty. Tiêu đề email PHẢI có 3 phần: chủ đề chính + mã sinh viên/ngữ cảnh + tên ngắn. Ví dụ: '关于JW202表邮寄进度咨询 — 越南陈氏梅 QH202509-1234'. Email không có cấu trúc tiêu đề rõ = bị bỏ qua.\n\nMở đầu BẮT BUỘC '尊敬的留学办公室老师, 您好' — không '老师好' đơn lẻ, không gọi tên cụ thể (vì email thường gửi đến hộp chung). Khi văn phòng đã trả lời và biết ai phụ trách bạn, có thể chuyển sang '尊敬的[姓]老师' từ email tiếp theo.\n\nCác cụm formal email: 不胜感激 (bù shèng gǎnjī — vô cùng biết ơn), 烦请 (fánqǐng — phiền thầy/cô), 望尽快回复 (wàng jǐn kuài huífù — mong sớm phản hồi), 期待您的回复 (qídài nín de huífù — mong nhận phản hồi). Câu kết: 'XX 顿首' (XX dùnshǒu — XX cúi đầu) — quá formal cho email; 'XX 敬上' (jìng shàng — kính trình) là formal vừa phải, lý tưởng cho email du học. Cuối cùng kèm chữ ký: tên đầy đủ + mã sinh viên + số điện thoại.\n\nKhi xin lỗi vì lỗi của mình (lỗi thông tin, sai mẫu): KHÔNG dùng '对不起'. Dùng '给您添麻烦了, 实在抱歉' (gây phiền hà cho thầy cô, thực sự xin lỗi). Đây là cụm chuẩn academic email.",
    idiom_glosses: [
      {
        idiom: "不胜感激",
        literal: "không thể chịu nổi sự biết ơn (bù shèng gǎn jī)",
        meaning: "Vô cùng biết ơn — câu kết email formal chuẩn. Mạnh hơn '感谢' nhưng không cường điệu. Thiếu cụm này ở email xin việc/du học bị coi là khô khan.",
        example: "请您协助处理, 不胜感激。"
      },
      {
        idiom: "有备无患",
        literal: "có chuẩn bị thì không có nỗi lo (yǒu bèi wú huàn)",
        meaning: "Có chuẩn bị thì không lo — chuẩn bị kỹ để tránh rắc rối. Cụm dùng khi giải thích vì sao bạn hỏi nhiều câu nhỏ về visa/khám sức khỏe: '我想有备无患, 提前确认一下'.",
        example: "我想有备无患, 提前确认一下细节。"
      },
      {
        idiom: "按部就班",
        literal: "theo bộ phận và thứ tự (àn bù jiù bān)",
        meaning: "Theo từng bước, không bỏ qua quy trình. Cụm dùng khi cam kết tuân thủ thủ tục: '我会按部就班, 一步一步办理'. Đặc biệt phù hợp cho ngữ cảnh hành chính/visa.",
        example: "我会按部就班完成所有手续。"
      },
      {
        idiom: "名正言顺",
        literal: "danh chính ngôn thuận (míng zhèng yán shùn)",
        meaning: "Có cơ sở chính đáng — danh nghĩa đúng, lời nói thuận. Cụm dùng khi xin được làm điều gì có lý do hợp pháp/hợp lệ: '我已经被贵校录取, 申请X1签证名正言顺'.",
        example: "我已经被贵校录取, 申请X1签证名正言顺。"
      }
    ],
    cultural_notes_vi: "Văn phòng du học (留学办公室 / 国际处) ở các đại học Trung Quốc có tốc độ phản hồi rất khác nhau: trường top (Bắc Đại, Thanh Hoa, Phúc Đán) phản hồi 1-3 ngày; trường địa phương 5-10 ngày. KHÔNG nên gửi email follow-up sớm hơn 5 ngày — bị coi là thiếu kiên nhẫn. Sau 7 ngày không phản hồi, gửi email follow-up nhẹ nhàng kèm tham chiếu email đầu.\n\nThời gian xử lý JW202: 2-4 tuần kể từ khi nhận hồ sơ điện tử. Nếu chưa đến trong 4 tuần, có khả năng (a) hồ sơ thiếu mục, (b) thông tin sai, (c) bưu điện. Hỏi văn phòng để có mã tracking.\n\nVề visa X1 vs X2: X1 cho học trên 6 tháng (du học chính thức), X2 cho học dưới 6 tháng (đoạn ngắn). KHÔNG nhầm — sai loại visa = bị từ chối nhập cảnh.\n\nKhám sức khỏe: phải làm ở bệnh viện được Bộ Y tế Việt Nam và Đại sứ quán Trung Quốc cùng công nhận. Tại Hà Nội: Bệnh viện Trung ương Quân đội 108, Bệnh viện E. Tại HCMC: Bệnh viện Chợ Rẫy, Bệnh viện Đại học Y Dược. Làm ở bệnh viện ngoài danh sách = kết quả bị từ chối, phải làm lại.\n\nKhi đến Trung Quốc, trong 30 ngày phải làm 'tạm trú' (临时居留 línshí jūliú) tại sở cảnh sát. Không làm = bị phạt 500-2000 tệ + có ghi vào hồ sơ. Văn phòng du học sẽ hướng dẫn nhưng bạn phải tự nhớ deadline.",
    tip_advice_vi: "(1) MỌI email gửi văn phòng du học PHẢI có mã sinh viên/số đơn ở tiêu đề. Email không có mã = bị bỏ qua hoặc trả lời lệch nội dung. Chèn mã ngay sau chủ đề: '关于JW202表咨询 — QH202509-1234'. (2) Mỗi email chỉ hỏi 1 chủ đề. Nhồi 5 câu hỏi vào 1 email = nhân viên trả lời câu dễ trước, câu khó bỏ sót, bạn phải hỏi lại. Hỏi về visa = email A; hỏi về ký túc = email B. (3) ĐÍNH KÈM tài liệu liên quan (PDF của giấy báo nhập học, ảnh hộ chiếu) khi cần thiết — đừng để nhân viên phải tự tra. Tệp đặt tên rõ: 'TranThiMai_Passport_QH202509-1234.pdf'. (4) Định dạng email: font Arial/SimSun 12pt, line spacing 1.5, đoạn cách dòng. KHÔNG dùng emoji. KHÔNG viết hoa toàn bộ. Email lộn xộn = ấn tượng xấu. (5) Câu kết: 'XX 敬上' (XX kính trình) + dòng riêng cho chữ ký gồm tên + mã sinh viên + số điện thoại + email. Đây là chữ ký chuẩn academic Trung Quốc. (6) Nếu phải gửi email khẩn (visa sắp hết, hồ sơ thiếu), tiêu đề bắt đầu bằng '【紧急】' (jǐnjí — khẩn cấp). Lạm dụng = mất tác dụng; chỉ dùng khi thực sự khẩn. (7) Sau khi nhận phản hồi, gửi email cảm ơn ngắn gọn trong 24h: '谢谢您的解答, 我已经按照您的指导办理。如有疑问会再联系您'. Bước này tạo ấn tượng chuyên nghiệp và mở đường cho lần liên hệ tiếp theo.",
    exercises: [
      { type: "fill-blank", question: "请您协助处理, ___ 。", answer: "不胜感激" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung email du học với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "录取通知书", pinyin: "lù qǔ tōng zhī shū", english: "giấy báo nhập học" },
          { chinese: "签证", pinyin: "qiān zhèng", english: "visa / thị thực" },
          { chinese: "不胜感激", pinyin: "bù shèng gǎn jī", english: "vô cùng biết ơn (formal)" },
          { chinese: "按部就班", pinyin: "àn bù jiù bān", english: "theo từng bước" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em là tân sinh viên thạc sĩ người Việt đã được quý trường nhận. Em muốn hỏi về quy trình làm visa du học X1.",
        chinese: "我是已被贵校录取的越南籍硕士新生。我想咨询X1学习签证的办理流程。",
        pinyin: "Wǒ shì yǐ bèi guì xiào lù qǔ de Yuè nán jí shuò shì xīn shēng. Wǒ xiǎng zī xún X1 xué xí qiān zhèng de bàn lǐ liú chéng."
      }
    ]
  },
  {
    id: 57,
    level: "B2",
    category: "study_career",
    title: "从越南打电话面试中国雇主",
    pinyin: "cóng yuè nán dǎ diàn huà miàn shì zhōng guó gù zhǔ",
    topic: "Phone interview from Vietnam to Chinese employer",
    title_vi: "Phỏng vấn qua điện thoại từ Việt Nam với nhà tuyển dụng Trung Quốc",
    title_en: "Phone interview from Vietnam to a Chinese employer",
    sentences: [
      {
        chinese: "您好, 我是越南的应聘者阮文海, 现在方便面试吗?",
        pinyin: "Nín hǎo, wǒ shì Yuènán de yìngpìn zhě Ruǎn Wénhǎi, xiànzài fāngbiàn miànshì ma?",
        english: "Hello, I'm Nguyen Van Hai, the applicant from Vietnam. Is now convenient for the interview?",
        vi: "Em chào anh/chị, em là Nguyễn Văn Hải, ứng viên từ Việt Nam. Bây giờ phỏng vấn có tiện không ạ?",
        pronunciation_focus: ["应聘者 → yìngpìnzhě (ứng viên — formal)", "方便 → fāngbiàn (tiện)", "面试 → miànshì", "现在 → xiànzài"]
      },
      {
        chinese: "信号有点不太稳定, 如果断开请您稍等, 我会立刻回拨。",
        pinyin: "Xìnhào yǒudiǎn bù tài wěndìng, rúguǒ duànkāi qǐng nín shāo děng, wǒ huì lìkè huíbō.",
        english: "The signal is a bit unstable; if it disconnects please wait a moment, I'll call back immediately.",
        vi: "Tín hiệu hơi không ổn, nếu bị ngắt xin anh/chị đợi chút, em sẽ gọi lại ngay.",
        pronunciation_focus: ["信号 → xìnhào (tín hiệu)", "稳定 → wěndìng (ổn định)", "断开 → duànkāi (ngắt)", "回拨 → huíbō (gọi lại)"]
      },
      {
        chinese: "请您说话稍微大声一点, 我这边能听得更清楚。",
        pinyin: "Qǐng nín shuōhuà shāowēi dàshēng yīdiǎn, wǒ zhè biān néng tīng de gèng qīngchu.",
        english: "Could you speak a little louder? I can hear more clearly on my end.",
        vi: "Phiền anh/chị nói to hơn một chút, em sẽ nghe rõ hơn.",
        pronunciation_focus: ["稍微 → shāowēi (hơi)", "大声 → dàshēng (to tiếng)", "清楚 → qīngchu (rõ ràng)", "听得 → tīng de"]
      },
      {
        chinese: "您刚才说的那一点, 我想再确认一下我的理解。",
        pinyin: "Nín gāngcái shuō de nà yī diǎn, wǒ xiǎng zài quèrèn yīxià wǒ de lǐjiě.",
        english: "About what you just said, I'd like to confirm my understanding.",
        vi: "Về điều anh/chị vừa nói, em muốn xác nhận lại cách hiểu của em.",
        pronunciation_focus: ["刚才 → gāngcái (vừa rồi)", "确认 → quèrèn (xác nhận)", "理解 → lǐjiě (cách hiểu)", "那一点 → nà yī diǎn (điểm đó)"]
      },
      {
        chinese: "感谢您今天的时间, 期待您的好消息。",
        pinyin: "Gǎnxiè nín jīntiān de shíjiān, qídài nín de hǎo xiāoxi.",
        english: "Thank you for your time today; I look forward to your good news.",
        vi: "Cảm ơn anh/chị đã dành thời gian hôm nay, em mong tin tốt từ anh/chị.",
        pronunciation_focus: ["感谢 → gǎnxiè (formal hơn 谢谢)", "期待 → qídài (mong chờ)", "好消息 → hǎo xiāoxi (tin tốt)", "今天 → jīntiān"]
      }
    ],
    vocab: [
      { chinese: "电话面试", pinyin: "diàn huà miàn shì", english: "phone interview", vi: "phỏng vấn qua điện thoại" },
      { chinese: "信号", pinyin: "xìn hào", english: "signal", vi: "tín hiệu" },
      { chinese: "回拨", pinyin: "huí bō", english: "to call back", vi: "gọi lại" },
      { chinese: "确认", pinyin: "què rèn", english: "to confirm", vi: "xác nhận" },
      { chinese: "录取", pinyin: "lù qǔ", english: "to admit / hire", vi: "tuyển dụng / nhận" },
      { chinese: "时差", pinyin: "shí chà", english: "time difference", vi: "chênh lệch múi giờ" },
      { chinese: "网络", pinyin: "wǎng luò", english: "network / internet", vi: "mạng" },
      { chinese: "言简意赅", pinyin: "yán jiǎn yì gāi", english: "concise and to the point (4-char idiom)", vi: "lời ngắn ý đủ" },
      { chinese: "应对自如", pinyin: "yìng duì zì rú", english: "respond with ease (4-char idiom)", vi: "ứng đối tự nhiên" },
      { chinese: "见机行事", pinyin: "jiàn jī xíng shì", english: "act according to circumstances", vi: "tùy cơ ứng biến" }
    ],
    dialogue: [
      { speaker: "HR", chinese: "您好, 是阮文海吗?", pinyin: "Nín hǎo, shì Ruǎn Wénhǎi ma?", english: "Hello, is this Nguyen Van Hai?", vi: "Em chào anh, có phải Nguyễn Văn Hải không?" },
      { speaker: "阮文海", chinese: "是的, 您好。请问您是?", pinyin: "Shì de, nín hǎo. Qǐng wèn nín shì?", english: "Yes, hello. May I ask who's calling?", vi: "Vâng đúng ạ, em chào anh/chị. Cho em hỏi là ai vậy?" },
      { speaker: "HR", chinese: "我是上海ABC科技公司的张, 我们约的是今天下午三点电话面试。", pinyin: "Wǒ shì Shànghǎi ABC Kējì Gōngsī de Zhāng, wǒmen yuē de shì jīntiān xiàwǔ sān diǎn diànhuà miànshì.", english: "I'm Zhang from Shanghai ABC Tech Company. We scheduled the phone interview for 3 PM today.", vi: "Anh là Trương từ Công ty Công nghệ ABC Thượng Hải, mình hẹn phỏng vấn điện thoại 3 giờ chiều nay." },
      { speaker: "阮文海", chinese: "好的张哥, 我准备好了。请您开始。", pinyin: "Hǎo de Zhāng gē, wǒ zhǔnbèi hǎo le. Qǐng nín kāishǐ.", english: "Okay Brother Zhang, I'm ready. Please go ahead.", vi: "Vâng anh Trương, em đã sẵn sàng. Mời anh bắt đầu." }
    ],
    dialogue_long: [
      { speaker: "HR", chinese: "您好, 阮先生, 我是上海ABC科技的HR张明。我们准时开始面试。", pinyin: "Nín hǎo, Ruǎn xiānsheng, wǒ shì Shànghǎi ABC Kējì de HR Zhāng Míng. Wǒmen zhǔnshí kāishǐ miànshì.", english: "Hello, Mr. Nguyen. I'm Zhang Ming, HR at Shanghai ABC Tech. Let's start the interview on time.", vi: "Chào anh Nguyễn, tôi là Trương Minh, HR công ty Công nghệ ABC Thượng Hải. Mình bắt đầu phỏng vấn đúng giờ nhé." },
      { speaker: "阮文海", chinese: "您好张老师。请问您能听清楚我说话吗? 网络可能不太稳定。", pinyin: "Nín hǎo Zhāng lǎoshī. Qǐng wèn nín néng tīng qīngchu wǒ shuōhuà ma? Wǎngluò kěnéng bù tài wěndìng.", english: "Hello Teacher Zhang. Can you hear me clearly? The network might be unstable.", vi: "Chào anh Trương. Cho em hỏi anh nghe em rõ không? Mạng có thể không ổn định lắm." },
      { speaker: "HR", chinese: "听得很清楚, 您也能听到我吗?", pinyin: "Tīng de hěn qīngchu, nín yě néng tīng dào wǒ ma?", english: "I hear you clearly. Can you also hear me?", vi: "Tôi nghe rõ. Anh cũng nghe được tôi chứ?" },
      { speaker: "阮文海", chinese: "能听到, 谢谢。如果中途断线, 我会立刻回拨, 请您稍等。", pinyin: "Néng tīng dào, xièxie. Rúguǒ zhōngtú duànxiàn, wǒ huì lìkè huíbō, qǐng nín shāo děng.", english: "Yes I can, thank you. If we disconnect mid-call, I'll call back immediately — please wait briefly.", vi: "Em nghe được, cảm ơn anh. Nếu giữa chừng bị ngắt, em sẽ gọi lại ngay, xin anh đợi một chút." },
      { speaker: "HR", chinese: "好的。先做一个三分钟的自我介绍, 重点突出和这个职位相关的经验。", pinyin: "Hǎo de. Xiān zuò yī gè sān fēnzhōng de zìwǒ jièshào, zhòngdiǎn tūchū hé zhège zhíwèi xiāngguān de jīngyàn.", english: "Good. First, a three-minute self-introduction, highlighting experience relevant to this role.", vi: "Được. Trước tiên anh tự giới thiệu ba phút, tập trung vào kinh nghiệm liên quan đến vị trí này." },
      { speaker: "阮文海", chinese: "好的。我叫阮文海, 河内国家大学计算机系毕业, 三年后端开发经验, 主要做支付系统。最近一年负责越南最大支付平台MoMo的核心模块。", pinyin: "Hǎo de. Wǒ jiào Ruǎn Wénhǎi, Hénèi Guójiā Dàxué jìsuànjī xì bìyè, sān nián hòuduān kāifā jīngyàn, zhǔyào zuò zhīfù xìtǒng. Zuìjìn yī nián fùzé Yuènán zuì dà zhīfù píngtái MoMo de héxīn mókuài.", english: "Okay. I'm Nguyen Van Hai, graduated from Vietnam National University Hanoi computer science department, 3 years backend development experience, mainly on payment systems. The past year I led core modules of MoMo, Vietnam's largest payment platform.", vi: "Vâng. Em tên là Nguyễn Văn Hải, tốt nghiệp khoa CNTT Đại học Quốc gia Hà Nội, ba năm kinh nghiệm backend, chủ yếu hệ thống thanh toán. Năm gần nhất em phụ trách module lõi của MoMo - nền tảng thanh toán lớn nhất Việt Nam." },
      { speaker: "HR", chinese: "您能用中文做技术讨论吗? 比如和北京团队的代码评审。", pinyin: "Nín néng yòng zhōngwén zuò jìshù tǎolùn ma? Bǐrú hé Běijīng tuánduì de dàimǎ píngshěn.", english: "Can you do technical discussions in Chinese? E.g. code review with the Beijing team.", vi: "Anh có thể thảo luận kỹ thuật bằng tiếng Trung không? Ví dụ code review với team Bắc Kinh." },
      { speaker: "阮文海", chinese: "可以。我HSK六级, 平时阅读中文技术文档, 也参与过北京同事的几次远程会议。", pinyin: "Kěyǐ. Wǒ HSK liù jí, píngshí yuèdú zhōngwén jìshù wéndàng, yě cānyù guò Běijīng tóngshì de jǐ cì yuǎnchéng huìyì.", english: "Yes. HSK 6, I regularly read Chinese tech docs and have joined several remote meetings with Beijing colleagues.", vi: "Được. Em HSK 6, hàng ngày đọc tài liệu kỹ thuật tiếng Trung, cũng tham gia vài cuộc họp từ xa với đồng nghiệp Bắc Kinh." },
      { speaker: "HR", chinese: "好。这个职位需要每月去北京一周, 您能接受吗?", pinyin: "Hǎo. Zhège zhíwèi xūyào měi yuè qù Běijīng yī zhōu, nín néng jiēshòu ma?", english: "Good. This role requires going to Beijing one week per month — acceptable?", vi: "Được. Vị trí này cần đi Bắc Kinh một tuần mỗi tháng, anh chấp nhận được không?" },
      { speaker: "阮文海", chinese: "可以接受。如果是固定的时间, 我可以提前安排家事。", pinyin: "Kěyǐ jiēshòu. Rúguǒ shì gùdìng de shíjiān, wǒ kěyǐ tíqián ānpái jiāshì.", english: "Acceptable. If it's a fixed time, I can arrange family matters in advance.", vi: "Em chấp nhận được. Nếu là thời gian cố định, em có thể sắp xếp việc gia đình trước." },
      { speaker: "HR", chinese: "您期望的薪资是多少?", pinyin: "Nín qīwàng de xīnzī shì duōshao?", english: "What's your expected salary?", vi: "Lương kỳ vọng của anh là bao nhiêu?" },
      { speaker: "阮文海", chinese: "根据市场和我的经验, 税前月薪三万到三万五人民币。当然要看整体福利。", pinyin: "Gēnjù shìchǎng hé wǒ de jīngyàn, shuì qián yuèxīn sān wàn dào sān wàn wǔ rénmínbì. Dāngrán yào kàn zhěngtǐ fúlì.", english: "Based on market and my experience, pre-tax monthly 30,000-35,000 RMB. Of course depends on overall benefits.", vi: "Dựa trên thị trường và kinh nghiệm của em, lương trước thuế 30 đến 35 nghìn nhân dân tệ. Còn tùy phúc lợi tổng thể." },
      { speaker: "HR", chinese: "明白。那您对我们公司还有什么问题想了解的?", pinyin: "Míngbái. Nà nín duì wǒmen gōngsī hái yǒu shénme wèntí xiǎng liǎojiě de?", english: "Understood. Any questions you'd like to ask about our company?", vi: "Tôi hiểu. Anh còn câu hỏi nào về công ty không?" },
      { speaker: "阮文海", chinese: "我想了解越南办公室的规模, 以及我会和哪个团队合作。", pinyin: "Wǒ xiǎng liǎojiě Yuènán bàngōngshì de guīmó, yǐjí wǒ huì hé nǎ gè tuánduì hézuò.", english: "I'd like to know the size of the Vietnam office and which team I'll work with.", vi: "Em muốn tìm hiểu quy mô văn phòng Việt Nam, và em sẽ làm với team nào." },
      { speaker: "HR", chinese: "胡志明市办公室目前30人, 您会进入支付团队, 直接汇报给越南区CTO黎先生。", pinyin: "Húzhìmíng shì bàngōngshì mùqián sānshí rén, nín huì jìnrù zhīfù tuánduì, zhíjiē huìbào gěi Yuènán qū CTO Lí xiānsheng.", english: "Ho Chi Minh City office currently has 30 people. You'll join the payment team, reporting directly to Vietnam region CTO, Mr. Le.", vi: "Văn phòng TP HCM hiện 30 người. Anh sẽ vào team thanh toán, báo cáo trực tiếp cho CTO khu vực Việt Nam, anh Lê." },
      { speaker: "阮文海", chinese: "明白了, 谢谢您的解答。如果有进一步的问题, 我可以邮件联系您吗?", pinyin: "Míngbái le, xièxie nín de jiědá. Rúguǒ yǒu jìnyībù de wèntí, wǒ kěyǐ yóujiàn liánxì nín ma?", english: "Understood, thank you for the explanation. If I have further questions, may I email you?", vi: "Em hiểu rồi, cảm ơn anh đã giải đáp. Nếu có thêm câu hỏi, em có thể email anh được không?" },
      { speaker: "HR", chinese: "当然可以。我们会在一周内给您正式答复。今天感谢您的时间。", pinyin: "Dāngrán kěyǐ. Wǒmen huì zài yī zhōu nèi gěi nín zhèngshì dáfù. Jīntiān gǎnxiè nín de shíjiān.", english: "Of course. We'll give a formal reply within a week. Thank you for your time today.", vi: "Đương nhiên được. Chúng tôi sẽ phản hồi chính thức trong một tuần. Cảm ơn anh đã dành thời gian hôm nay." }
    ],
    roleplay_prompts: [
      "Đóng vai ứng viên Việt Nam phỏng vấn điện thoại với HR Trung Quốc. Trong phỏng vấn, mạng đột ngột mất 30 giây. Hãy gọi lại ngay, mở đầu bằng '不好意思, 刚才信号断了, 您能听到我吗?' và xin tiếp tục từ điểm đã ngắt — KHÔNG yêu cầu HR nhắc lại toàn bộ.",
      "HR đặt câu hỏi rất nhanh và không rõ. Bạn không hiểu 60% câu hỏi. Hãy yêu cầu họ nói lại, KHÔNG đoán mò. Dùng cụm '不好意思, 您刚才说...这部分我没听清, 能再说一遍吗?' — chỉ rõ phần không hiểu, không nói chung chung.",
      "Cuối phỏng vấn, HR đề nghị kiểm tra tiếng Trung qua bài đọc kèm dịch trực tiếp. Đoạn văn dài 3 đoạn. Bạn có 30 giây chuẩn bị. Hãy yêu cầu thêm thời gian (1 phút) hoặc xin được dịch ý chính thay vì từng câu. Đề xuất phải khéo léo, không bị coi là yếu."
    ],
    register_notes: "Phỏng vấn điện thoại đặc biệt khó vì thiếu cues hình ảnh — bạn không thấy phản ứng của HR, không thấy họ đang ghi chú. Vì vậy phải dùng register formal HƠN một chút so với phỏng vấn trực tiếp. 您 toàn bộ — kể cả nếu HR trẻ và bảo 'cứ gọi tôi là Tiểu Trương'.\n\nCác cụm chuẩn cho phone interview: mở đầu '您好, 我是阮文海, 现在方便面试吗?'; khi không nghe rõ '不好意思, 您能再说一遍吗?' hoặc '请您稍微大声一点'; khi xác nhận hiểu đúng '我想再确认一下我的理解, 您是说...对吗?'; khi mất tín hiệu '不好意思, 刚才信号断了, 您能听到我吗?'; câu kết '感谢您今天的时间, 期待您的好消息'.\n\nTránh tuyệt đối: (a) Cười khẩy hoặc thở dài qua điện thoại — âm thanh rõ hơn bình thường; (b) Ngắt lời HR — qua điện thoại càng dễ ngắt nhầm; đợi 1 giây sau khi HR ngừng để chắc chắn họ đã xong; (c) Đa nhiệm — chỉ làm phỏng vấn, không vừa làm vừa kiểm tra điện thoại; HR Trung Quốc thường hỏi 'em đang làm gì khác không?' nếu nghe tiếng gõ phím.\n\nNgôn ngữ thân thể qua điện thoại: ĐỨNG (giọng tự tin hơn), MỈM CƯỜI (giọng thân thiện hơn), KHÔNG đeo headphone in-ear (âm thanh dội về thiếu tự nhiên — dùng over-ear nếu có).",
    idiom_glosses: [
      {
        idiom: "言简意赅",
        literal: "lời ngắn ý đủ (yán jiǎn yì gāi)",
        meaning: "Lời nói ngắn gọn nhưng ý nghĩa đầy đủ. Cụm khen kỹ năng giao tiếp lý tưởng cho phone interview — HR Trung Quốc đặc biệt thích ứng viên trả lời ngắn gọn rõ ý. Tự nhận: '我尽量言简意赅, 不耽误您的时间'.",
        example: "您的问题, 我尽量言简意赅地回答。"
      },
      {
        idiom: "应对自如",
        literal: "ứng đối tự nhiên (yìng duì zì rú)",
        meaning: "Phản ứng nhanh, linh hoạt — không lúng túng. Cụm dùng khi tự miêu tả khả năng ứng phó: '在压力下我能应对自如'. Tránh dùng khi bạn đang lúng túng — sẽ phản tác dụng.",
        example: "在突发情况下我能应对自如。"
      },
      {
        idiom: "见机行事",
        literal: "thấy cơ thì hành sự (jiàn jī xíng shì)",
        meaning: "Tùy cơ ứng biến — không bám cứng kế hoạch. Cụm tích cực miêu tả phong cách làm việc linh hoạt. Đặc biệt phù hợp khi nói về kỹ năng xử lý dự án phức tạp.",
        example: "项目推进中我会见机行事, 灵活调整。"
      },
      {
        idiom: "慎言慎行",
        literal: "cẩn ngôn cẩn hành (shèn yán shèn xíng)",
        meaning: "Cẩn trọng từng lời nói và hành động. Cụm khiêm tốn lý tưởng cho ứng viên trẻ — báo hiệu bạn không bốc đồng, không hứa quá. Đối lập với 'self-promotion' phương Tây.",
        example: "我做事比较慎言慎行, 喜欢先思考再行动。"
      }
    ],
    cultural_notes_vi: "Phỏng vấn điện thoại quốc tế (Việt Nam ↔ Trung Quốc) có những đặc thù mà phỏng vấn trực tiếp không có: (1) Múi giờ — Trung Quốc UTC+8, Việt Nam UTC+7, chênh lệch 1 giờ. KHÔNG nhầm: nếu HR ở Bắc Kinh đề xuất '下午三点' (3 giờ chiều) = 14:00 giờ Việt Nam. Hỏi rõ múi giờ trong email xác nhận. (2) Ngôn ngữ: HR có thể chuyển sang tiếng Anh nếu thấy bạn yếu tiếng Trung — đừng coi đó là tích cực. Họ đang thử bạn. Cố giữ tiếng Trung đến cuối; nếu thực sự không hiểu, nói '能用中文换一种说法吗?' (có thể nói bằng tiếng Trung theo cách khác không). (3) Wechat call vs điện thoại quốc tế: phần lớn HR Trung Quốc thích Wechat hơn vì rẻ và quen thuộc. Cài Wechat trước, kết bạn với HR vài ngày trước phỏng vấn để test signal. Nếu HR muốn gọi điện thoại quốc tế, không sao, nhưng tự xác nhận chi phí roaming. (4) Ghi âm: ở Trung Quốc, ghi âm cuộc gọi phỏng vấn KHÔNG được phép trừ khi cả hai bên đồng ý. Đừng tự ghi để 'review sau'. Nếu cần ghi nhớ, ghi chép tay trong khi nói.\n\nTâm lý qua điện thoại: HR Trung Quốc đánh giá ứng viên qua giọng nói cao hơn 30%. Giọng tự tin (đứng nói), giọng cười nhẹ trước câu trả lời, giọng nhanh nhưng rõ = ấn tượng tốt. Giọng lí nhí, ngập ngừng, dài dòng = ấn tượng xấu. Tập đứng trước gương phỏng vấn 30 phút trước cuộc gọi thật.\n\nVề follow-up: gửi email cảm ơn trong 24 giờ bằng tiếng Trung. Đính kèm portfolio/code samples nếu chưa gửi. Đây là điểm cộng đặc biệt vì ít ứng viên Việt Nam làm bước này.",
    tip_advice_vi: "(1) TEST setup 24 giờ trước: gọi thử bạn bè qua chính kênh sẽ dùng (WeChat call / Skype / Zoom), kiểm tra micro, headset, mạng. KHÔNG dùng wifi nhà cafe — phải mạng nhà cá nhân hoặc 4G ổn định. (2) Chuẩn bị 'crash kit': số WeChat của HR, email backup, số hotline lễ tân công ty (phòng khi mất tín hiệu). Nếu cuộc gọi rớt mà không liên lạc lại được = mất phỏng vấn. (3) Ngồi/đứng ở phòng yên tĩnh, đóng cửa, treo bảng 'không làm phiền' nếu sống chung. Tiếng trẻ con/chó sủa qua điện thoại = ứng viên không chuyên nghiệp. (4) Trước phỏng vấn 5 phút, uống nước ấm (giọng rõ hơn), KHÔNG cà phê (làm khô họng), KHÔNG sữa (làm nhầy họng). (5) Đặt CV, JD, ghi chú trên bàn — NHƯNG đừng đọc thuộc; HR sẽ nghe ra. Dùng làm tham chiếu khi cần. (6) Khi không hiểu một từ chuyên môn của HR, KHÔNG đoán. Hỏi '不好意思, 您说的XX是指...?' — chứng tỏ bạn cẩn thận. (7) Sau khi cúp máy, KHÔNG đăng status mạng xã hội ('vừa phỏng vấn xong căng quá') — HR Trung Quốc kiểm tra Linkedin/Facebook ứng viên trước khi quyết định.",
    exercises: [
      { type: "fill-blank", question: "我尽量 ___ 地回答您的问题。", answer: "言简意赅" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung phỏng vấn điện thoại với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "信号", pinyin: "xìn hào", english: "tín hiệu" },
          { chinese: "回拨", pinyin: "huí bō", english: "gọi lại" },
          { chinese: "时差", pinyin: "shí chà", english: "chênh lệch múi giờ" },
          { chinese: "言简意赅", pinyin: "yán jiǎn yì gāi", english: "lời ngắn ý đủ" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Xin lỗi, tín hiệu vừa rồi không ổn, anh có thể nhắc lại câu hỏi cuối được không?",
        chinese: "不好意思, 刚才信号不太稳定, 您能重复一下最后一个问题吗?",
        pinyin: "Bù hǎo yì si, gāng cái xìn hào bù tài wěn dìng, nín néng chóng fù yī xià zuì hòu yī gè wèn tí ma?"
      }
    ]
  },
  {
    id: 58,
    level: "B2",
    category: "study_career",
    title: "商务交流会上的自我介绍",
    pinyin: "shāng wù jiāo liú huì shàng de zì wǒ jiè shào",
    topic: "Self-introduction at a business networking event",
    title_vi: "Tự giới thiệu tại sự kiện giao lưu doanh nghiệp",
    title_en: "Self-introduction at a business networking event",
    sentences: [
      {
        chinese: "您好, 我是越南胡志明市的陈伟, 在Vingroup负责中国市场。",
        pinyin: "Nín hǎo, wǒ shì Yuènán Húzhìmíng shì de Chén Wěi, zài Vingroup fùzé Zhōngguó shìchǎng.",
        english: "Hello, I'm Tran Vy from Ho Chi Minh City, Vietnam, in charge of China market at Vingroup.",
        vi: "Em chào anh/chị, em là Trần Vĩ từ TP HCM Việt Nam, phụ trách thị trường Trung Quốc tại Vingroup.",
        pronunciation_focus: ["负责 → fùzé (phụ trách)", "市场 → shìchǎng (thị trường)", "胡志明市 → Húzhìmíng shì", "您好 → nín hǎo"]
      },
      {
        chinese: "今天能在这里认识您, 我感到非常荣幸。",
        pinyin: "Jīntiān néng zài zhèlǐ rènshi nín, wǒ gǎndào fēicháng róngxìng.",
        english: "I feel very honored to meet you here today.",
        vi: "Hôm nay được làm quen với anh/chị tại đây, em cảm thấy rất vinh hạnh.",
        pronunciation_focus: ["荣幸 → róngxìng (vinh hạnh)", "认识 → rènshi (làm quen)", "感到 → gǎndào (cảm thấy)", "非常 → fēicháng"]
      },
      {
        chinese: "这是我的名片, 请多多指教。",
        pinyin: "Zhè shì wǒ de míngpiàn, qǐng duōduō zhǐjiào.",
        english: "Here's my business card; please favor me with your guidance.",
        vi: "Đây là danh thiếp của em, xin được chỉ giáo nhiều.",
        pronunciation_focus: ["名片 → míngpiàn (danh thiếp)", "请多多指教 → qǐng duōduō zhǐjiào (cụm formal khi trao đổi danh thiếp)", "这是 → zhè shì", "我的 → wǒ de"]
      },
      {
        chinese: "我们公司主要做电商和金融科技, 跟贵公司可能有合作空间。",
        pinyin: "Wǒmen gōngsī zhǔyào zuò diànshāng hé jīnróng kējì, gēn guì gōngsī kěnéng yǒu hézuò kōngjiān.",
        english: "Our company mainly does e-commerce and fintech; there may be cooperation potential with your company.",
        vi: "Công ty em chủ yếu làm thương mại điện tử và công nghệ tài chính, có thể có không gian hợp tác với quý công ty.",
        pronunciation_focus: ["电商 → diànshāng (thương mại điện tử, viết tắt 电子商务)", "金融科技 → jīnróng kējì (fintech)", "合作空间 → hézuò kōngjiān (không gian hợp tác)", "贵公司 → guì gōngsī"]
      },
      {
        chinese: "如果方便的话, 我们加个微信, 以后保持联系。",
        pinyin: "Rúguǒ fāngbiàn de huà, wǒmen jiā gè wēixìn, yǐhòu bǎochí liánxì.",
        english: "If convenient, let's add WeChat and keep in touch in the future.",
        vi: "Nếu tiện, mình kết bạn WeChat, sau này giữ liên lạc.",
        pronunciation_focus: ["微信 → wēixìn (WeChat)", "保持联系 → bǎochí liánxì (giữ liên lạc)", "以后 → yǐhòu (về sau)", "方便 → fāngbiàn"]
      }
    ],
    vocab: [
      { chinese: "商务交流会", pinyin: "shāng wù jiāo liú huì", english: "business networking event", vi: "sự kiện giao lưu doanh nghiệp" },
      { chinese: "名片", pinyin: "míng piàn", english: "business card", vi: "danh thiếp" },
      { chinese: "请多多指教", pinyin: "qǐng duō duō zhǐ jiào", english: "please give guidance (set phrase when meeting)", vi: "xin được chỉ giáo nhiều" },
      { chinese: "合作", pinyin: "hé zuò", english: "cooperation", vi: "hợp tác" },
      { chinese: "互利共赢", pinyin: "hù lì gòng yíng", english: "mutual benefit, win-win", vi: "đôi bên cùng có lợi" },
      { chinese: "保持联系", pinyin: "bǎo chí lián xì", english: "keep in touch", vi: "giữ liên lạc" },
      { chinese: "行业", pinyin: "háng yè", english: "industry", vi: "ngành nghề" },
      { chinese: "礼尚往来", pinyin: "lǐ shàng wǎng lái", english: "courtesy demands reciprocity", vi: "có qua có lại" },
      { chinese: "一见如故", pinyin: "yī jiàn rú gù", english: "feel like old friends at first meeting", vi: "gặp lần đầu như đã thân quen" },
      { chinese: "八面玲珑", pinyin: "bā miàn líng lóng", english: "smooth in all directions", vi: "khéo léo mọi mặt" }
    ],
    dialogue: [
      { speaker: "陈伟", chinese: "您好, 我叫陈伟, 来自越南Vingroup。", pinyin: "Nín hǎo, wǒ jiào Chén Wěi, láizì Yuènán Vingroup.", english: "Hello, I'm Tran Vy from Vingroup Vietnam.", vi: "Em chào anh, em là Trần Vĩ đến từ Vingroup Việt Nam." },
      { speaker: "张总", chinese: "您好陈先生, 我是BYD的张明。", pinyin: "Nín hǎo Chén xiānsheng, wǒ shì BYD de Zhāng Míng.", english: "Hello Mr. Tran, I'm Zhang Ming from BYD.", vi: "Chào anh Trần, tôi là Trương Minh của BYD." },
      { speaker: "陈伟", chinese: "久仰大名。这是我的名片, 请多多指教。", pinyin: "Jiǔ yǎng dà míng. Zhè shì wǒ de míngpiàn, qǐng duōduō zhǐjiào.", english: "Long admired your name. Here's my card; please give guidance.", vi: "Lâu nay đã ngưỡng mộ. Đây là danh thiếp của em, xin được chỉ giáo." },
      { speaker: "张总", chinese: "客气了。这是我的, 我们多交流。", pinyin: "Kèqì le. Zhè shì wǒ de, wǒmen duō jiāoliú.", english: "You're too polite. Here's mine — let's stay in touch.", vi: "Khách sáo quá. Đây là danh thiếp của tôi, mình trao đổi nhiều nhé." }
    ],
    dialogue_long: [
      { speaker: "陈伟", chinese: "您好, 请问您是BYD的张总吗?", pinyin: "Nín hǎo, qǐng wèn nín shì BYD de Zhāng zǒng ma?", english: "Hello, are you Director Zhang of BYD?", vi: "Em chào anh, cho em hỏi anh có phải là Tổng Trương của BYD không ạ?" },
      { speaker: "张总", chinese: "是的, 我是张明。您是?", pinyin: "Shì de, wǒ shì Zhāng Míng. Nín shì?", english: "Yes, I'm Zhang Ming. And you are?", vi: "Đúng rồi, tôi là Trương Minh. Còn anh?" },
      { speaker: "陈伟", chinese: "我是越南Vingroup的陈伟, 主要负责中国市场拓展。今天能在这里认识您, 我感到非常荣幸。", pinyin: "Wǒ shì Yuènán Vingroup de Chén Wěi, zhǔyào fùzé Zhōngguó shìchǎng tuòzhǎn. Jīntiān néng zài zhèlǐ rènshi nín, wǒ gǎndào fēicháng róngxìng.", english: "I'm Tran Vy from Vingroup Vietnam, mainly in charge of China market expansion. I'm very honored to meet you here today.", vi: "Em là Trần Vĩ từ Vingroup Việt Nam, chủ yếu phụ trách mở rộng thị trường Trung Quốc. Hôm nay được gặp anh tại đây em rất vinh hạnh." },
      { speaker: "张总", chinese: "Vingroup我听说过, 是越南最大的集团之一。您具体做哪一块?", pinyin: "Vingroup wǒ tīngshuō guò, shì Yuènán zuì dà de jítuán zhī yī. Nín jùtǐ zuò nǎ yī kuài?", english: "I've heard of Vingroup, one of Vietnam's largest groups. What specifically do you handle?", vi: "Vingroup tôi đã nghe đến, là một trong những tập đoàn lớn nhất Việt Nam. Anh cụ thể phụ trách mảng nào?" },
      { speaker: "陈伟", chinese: "我负责VinFast电动车在中国的供应链对接。这是我的名片, 请多多指教。", pinyin: "Wǒ fùzé VinFast diàndòngchē zài Zhōngguó de gōngyìng liàn duìjiē. Zhè shì wǒ de míngpiàn, qǐng duōduō zhǐjiào.", english: "I handle VinFast EV's supply-chain integration in China. Here's my card, please favor me with your guidance.", vi: "Em phụ trách kết nối chuỗi cung ứng của xe điện VinFast tại Trung Quốc. Đây là danh thiếp của em, xin được chỉ giáo." },
      { speaker: "张总", chinese: "电动车! 我们正好是同行。这是我的名片, 我负责BYD的东南亚业务。", pinyin: "Diàndòngchē! Wǒmen zhènghǎo shì tóngháng. Zhè shì wǒ de míngpiàn, wǒ fùzé BYD de Dōngnányà yèwù.", english: "EVs! We're in the same field. Here's mine — I handle BYD's Southeast Asia business.", vi: "Xe điện! Mình đúng cùng ngành rồi. Đây là danh thiếp của tôi, tôi phụ trách thị trường Đông Nam Á của BYD." },
      { speaker: "陈伟", chinese: "真是太好了, 一见如故。BYD在越南最近也在扩张吧?", pinyin: "Zhēn shì tài hǎo le, yī jiàn rú gù. BYD zài Yuènán zuìjìn yě zài kuòzhāng ba?", english: "Wonderful — feels like meeting an old friend. BYD is also expanding in Vietnam recently, right?", vi: "Thật là tuyệt, gặp như đã thân lâu. BYD ở Việt Nam gần đây cũng đang mở rộng đúng không ạ?" },
      { speaker: "张总", chinese: "对, 我们去年在河内开了4S店, 今年要进胡志明市。您对越南本地的渠道熟悉吗?", pinyin: "Duì, wǒmen qùnián zài Hénèi kāi le 4S diàn, jīnnián yào jìn Húzhìmíng shì. Nín duì Yuènán běndì de qúdào shúxī ma?", english: "Yes, we opened a 4S dealership in Hanoi last year, this year we're entering Ho Chi Minh City. Are you familiar with local Vietnam channels?", vi: "Đúng, năm ngoái chúng tôi mở 4S ở Hà Nội, năm nay sẽ vào TP HCM. Anh có quen với các kênh phân phối Việt Nam không?" },
      { speaker: "陈伟", chinese: "比较熟悉。Vingroup在汽车销售网络上有很多资源, 也许我们公司可以做一些合作。", pinyin: "Bǐjiào shúxī. Vingroup zài qìchē xiāoshòu wǎngluò shàng yǒu hěn duō zīyuán, yěxǔ wǒmen gōngsī kěyǐ zuò yīxiē hézuò.", english: "Quite familiar. Vingroup has many resources in auto sales networks — perhaps our companies could do some cooperation.", vi: "Khá quen. Vingroup có nhiều nguồn lực trong mạng lưới bán xe, có lẽ công ty mình có thể hợp tác." },
      { speaker: "张总", chinese: "正合我意。互利共赢是最好的。下个月我会去河内出差, 到时候详谈?", pinyin: "Zhèng hé wǒ yì. Hùlì gòngyíng shì zuì hǎo de. Xià gè yuè wǒ huì qù Hénèi chūchāi, dào shíhou xiángtán?", english: "Exactly my thinking. Win-win is best. Next month I'll travel to Hanoi — we can discuss in detail then?", vi: "Đúng ý tôi. Đôi bên cùng có lợi là tốt nhất. Tháng sau tôi sẽ đi công tác Hà Nội, tới lúc đó mình bàn chi tiết nhé?" },
      { speaker: "陈伟", chinese: "好的, 我会很期待。您几号到, 我可以安排办公室会面。", pinyin: "Hǎo de, wǒ huì hěn qídài. Nín jǐ hào dào, wǒ kěyǐ ānpái bàngōngshì huìmiàn.", english: "Great, I'll look forward to it. What date do you arrive — I can arrange an office meeting.", vi: "Vâng, em rất mong chờ. Anh đến ngày mấy, em có thể sắp xếp gặp tại văn phòng." },
      { speaker: "张总", chinese: "10月15号到, 待三天。我让助理跟您协调。", pinyin: "Shí yuè shí wǔ hào dào, dài sān tiān. Wǒ ràng zhùlǐ gēn nín xiétiáo.", english: "Arrive Oct 15, staying three days. I'll have my assistant coordinate with you.", vi: "Tới ngày 15/10, ở ba ngày. Tôi sẽ bảo trợ lý phối hợp với anh." },
      { speaker: "陈伟", chinese: "好的。如果方便的话, 我们先加个微信, 直接沟通更快。", pinyin: "Hǎo de. Rúguǒ fāngbiàn de huà, wǒmen xiān jiā gè wēixìn, zhíjiē gōutōng gèng kuài.", english: "Sounds good. If convenient, let's add WeChat first — direct communication is faster.", vi: "Vâng. Nếu tiện, mình kết WeChat trước, trao đổi trực tiếp nhanh hơn." },
      { speaker: "张总", chinese: "好, 您扫我吧。", pinyin: "Hǎo, nín sǎo wǒ ba.", english: "Sure, scan mine.", vi: "Được, anh quét QR của tôi đi." },
      { speaker: "陈伟", chinese: "加上了。期待和您进一步交流。希望能在贵公司的拓展中尽一份力。", pinyin: "Jiā shàng le. Qídài hé nín jìnyībù jiāoliú. Xīwàng néng zài guì gōngsī de tuòzhǎn zhōng jìn yī fèn lì.", english: "Added. Looking forward to further exchanges. I hope to contribute to your company's expansion.", vi: "Đã kết bạn. Mong được trao đổi thêm với anh. Em hy vọng có thể đóng góp một phần cho việc mở rộng của quý công ty." },
      { speaker: "张总", chinese: "客气, 互相互相。先这样, 您忙您的, 我们后续联系。", pinyin: "Kèqì, hùxiāng hùxiāng. Xiān zhèyàng, nín máng nín de, wǒmen hòuxù liánxì.", english: "Don't be too formal — mutually. For now, you continue with your matters; we'll be in touch.", vi: "Khách sáo quá, qua lại thôi. Tạm thế đã, anh cứ tiếp tục công việc, mình liên lạc sau." },
      { speaker: "陈伟", chinese: "好的, 谢谢张总, 后会有期。", pinyin: "Hǎo de, xièxie Zhāng zǒng, hòu huì yǒu qī.", english: "Thank you, Director Zhang. Until next time.", vi: "Vâng, cảm ơn Tổng Trương, hẹn gặp lại." }
    ],
    roleplay_prompts: [
      "Đóng vai bạn — đại diện công ty Việt Nam — tiếp cận một CEO Trung Quốc tại tiệc cocktail. Bạn có 30 giây trước khi họ chuyển sang người khác. Hãy tạo 'elevator pitch' bằng tiếng Trung gồm: tên + công ty + giá trị bạn mang lại + đề xuất follow-up cụ thể (không chỉ 'có thời gian gặp nhau'). Dùng cụm '互利共赢'.",
      "Bạn vừa được giới thiệu với 'Lão Vương' — sếp của một đối tác tiềm năng. Lão Vương lớn tuổi và bảo thủ. Hãy tự giới thiệu theo phong cách kính trọng cao: dùng họ + 总, hỏi thăm về công ty của họ trước khi nói về mình, dùng cụm '久仰大名' nếu phù hợp.",
      "Trong một sự kiện, bạn nhận ra mình đã trao đổi danh thiếp với cùng một người 6 tháng trước nhưng họ không nhớ. Hãy gợi nhớ lịch sự — đề cập sự kiện cũ + chủ đề đã nói + tiến triển từ đó. Tránh gây bối rối; dùng cụm '不知道您还记得吗'."
    ],
    register_notes: "Sự kiện giao lưu doanh nghiệp Trung Quốc có register đặc biệt — 'formal nhưng ấm'. 您 toàn bộ với người mới gặp, đặc biệt người lớn tuổi/cấp cao hơn. Cách gọi: tên + chức danh viết tắt — 'Lý 总' (zǒng — viết tắt của 总经理 zǒng jīnglǐ, tổng giám đốc), 'Trương 董' (dǒng — viết tắt của 董事长 dǒng shì zhǎng, chủ tịch HĐQT). Gọi sai chức danh = ấn tượng xấu ngay.\n\nCác cụm chuẩn networking: mở đầu '您好, 请问您是X公司的Y总吗?' (xác nhận trước, không đoán); trao danh thiếp '请多多指教' kèm hai tay đưa danh thiếp, mặt chữ hướng về phía người nhận; khen công ty người ta '久仰大名' (lâu nay đã ngưỡng mộ — chỉ dùng khi thật sự biết); đề xuất hợp tác '互利共赢' (đôi bên cùng có lợi); kết thúc '后会有期' (hẹn gặp lại) hoặc '保持联系' (giữ liên lạc).\n\nTránh: (a) Trao danh thiếp một tay — bị coi là khinh miệt; (b) Cất danh thiếp ngay vào túi — phải đọc kỹ vài giây trước khi cất; (c) Viết lên danh thiếp người khác trước mặt họ — vô lễ; (d) Nói về tôn giáo, chính trị, tranh chấp Biển Đông — chuyển chủ đề ngay nếu đối phương đề cập.",
    idiom_glosses: [
      {
        idiom: "一见如故",
        literal: "gặp lần đầu như đã thân quen (yī jiàn rú gù)",
        meaning: "Gặp lần đầu mà cảm thấy như đã quen lâu — dùng để bày tỏ thiện cảm với người mới gặp. Cụm này ấm áp, lý tưởng cho networking. Tránh lạm dụng — chỉ dùng khi thật sự cảm thấy.",
        example: "和您一见如故, 真希望以后多多交流。"
      },
      {
        idiom: "互利共赢",
        literal: "có lợi lẫn nhau, cùng nhau thắng (hù lì gòng yíng)",
        meaning: "Đôi bên cùng có lợi, cùng thắng — cụm chuẩn cho đề xuất hợp tác. Người Trung Quốc đặc biệt thích cụm này vì khẳng định không ai bị thiệt. Dùng thay cho 'win-win' tiếng Anh.",
        example: "我们的合作能做到互利共赢。"
      },
      {
        idiom: "礼尚往来",
        literal: "lễ là sự qua lại (lǐ shàng wǎng lái)",
        meaning: "Có qua có lại mới toại lòng nhau — nguyên tắc đối nhân xử thế Trung Quốc. Khi đối tác giúp bạn, bạn phải đền đáp; khi bạn giúp họ, mong đợi họ đền đáp. KHÔNG phải hối lộ — đây là bản chất của 关系.",
        example: "礼尚往来嘛, 下次我请您吃饭。"
      },
      {
        idiom: "久仰大名",
        literal: "lâu ngưỡng mộ tên lớn (jiǔ yǎng dà míng)",
        meaning: "Đã ngưỡng mộ tên tuổi từ lâu — cụm trang trọng khi gặp người nổi tiếng/cấp cao. Chỉ dùng khi BẠN THỰC SỰ BIẾT về họ — nếu không sẽ bị hỏi 'biết gì về tôi?' và lúng túng.",
        example: "张总, 久仰大名, 今天终于见到您。"
      }
    ],
    cultural_notes_vi: "Sự kiện giao lưu doanh nghiệp ở Trung Quốc đại lục là môi trường cực kỳ chiến lược — không phải 'cocktail party' nhẹ nhàng kiểu phương Tây. Bốn quy tắc cốt lõi: (1) Danh thiếp (名片) là CÔNG CỤ chuyên nghiệp, không phải mảnh giấy. In song ngữ Trung-Anh ở hai mặt; chức danh phải khớp tiếng Trung lẫn tiếng Anh. Mang TỐI THIỂU 50 cái cho một sự kiện 2 giờ. Cạn danh thiếp giữa chừng = thiếu chuẩn bị. (2) Quy tắc trao danh thiếp: hai tay đưa, mặt chữ hướng về phía người nhận, kèm câu '请多多指教'. Khi nhận, đọc kỹ 5-10 giây, có thể bình luận về công ty/chức vụ ('哦, 您是负责东南亚的'), sau đó cất vào ví danh thiếp (không phải ví tiền — bị coi là vô lễ). (3) Thứ tự giới thiệu: cấp thấp → cấp cao, trẻ → già, chủ → khách. Nếu bạn muốn người A gặp người B, giới thiệu A cho B trước (vì B là cấp cao hơn). Đừng tự xuất hiện trước người cao cấp — chờ được giới thiệu hoặc xin phép. (4) Sau sự kiện, gửi tin nhắn WeChat trong 24 giờ với: cảm ơn cuộc trò chuyện + đề cập 1 chi tiết cụ thể đã nói + đề xuất bước tiếp theo. Đây là yếu tố quyết định liệu mối quan hệ có sống tiếp hay không.\n\nVề 关系 (guānxi): mục tiêu networking ở Trung Quốc KHÔNG phải 'mở rộng mạng lưới rộng' (network) như phương Tây, mà 'xây dựng mối quan hệ sâu' (relationship) với 5-10 người chiến lược. Một bữa ăn dài 2 giờ với 1 người = giá trị hơn 10 cuộc trao danh thiếp ngắn. Đầu tư thời gian vào ít người chất lượng cao.\n\nĂn uống tại sự kiện: nếu có rượu trắng (白酒 báijiǔ), bạn KHÔNG bắt buộc phải uống nếu lý do hợp lý (đang lái xe, bị bệnh, theo tôn giáo). Nhưng nếu uống được, một-hai shot kèm câu 'cùng cạn ly vì hợp tác' sẽ tạo dấu ấn đặc biệt.",
    tip_advice_vi: "(1) Chuẩn bị 'elevator pitch' 30 giây bằng tiếng Trung: tên + công ty + 1 thành tựu + 1 đề xuất cụ thể. Tập đến mức tự nhiên, không như đọc thuộc. (2) Mang theo: ví danh thiếp (KHÔNG để trong ví tiền), bút (để ghi chú lên danh thiếp người khác SAU sự kiện), điện thoại đã sạc đầy (chụp QR WeChat), kẹo bạc hà. (3) Trang phục: nam mặc vest tối màu + cà vạt; nữ mặc váy công sở + áo khoác. Tránh: trang sức lộng lẫy (nữ), cà vạt sặc sỡ (nam) — văn hóa kinh doanh Trung Quốc đại lục thiên về 'trang nhã'. (4) Đi quanh phòng theo chiến thuật: 30 phút đầu quan sát ai có mặt, ai cần tiếp cận; 60 phút giữa tập trung vào 3-5 người chiến lược; 30 phút cuối follow-up với những người đã gặp. (5) Khi không nhớ tên người mới gặp, KHÔNG đoán mò. Hỏi lại: '不好意思, 您贵姓?' (xin lỗi, anh/chị họ gì?) — đây là cách lịch sự xác nhận. (6) Tránh chủ đề nhạy cảm: chính trị nội bộ Trung Quốc, Đài Loan, tranh chấp biển, tham nhũng. Nếu đối phương đề cập, chuyển chủ đề bằng '这是个复杂的问题, 我们改天慢慢聊' (đây là chủ đề phức tạp, mình từ từ nói sau). (7) Trong vòng 24 giờ sau sự kiện, gửi tin WeChat: '张总, 昨天和您聊得很愉快, 关于...我整理了一些资料, 方便的话我发给您' — đây là follow-up vàng, ít người làm.",
    exercises: [
      { type: "fill-blank", question: "我们的合作一定能做到 ___ 。", answer: "互利共赢" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung networking với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "名片", pinyin: "míng piàn", english: "danh thiếp" },
          { chinese: "请多多指教", pinyin: "qǐng duō duō zhǐ jiào", english: "xin được chỉ giáo nhiều" },
          { chinese: "一见如故", pinyin: "yī jiàn rú gù", english: "gặp lần đầu như đã thân quen" },
          { chinese: "礼尚往来", pinyin: "lǐ shàng wǎng lái", english: "có qua có lại" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Đây là danh thiếp của em, xin được chỉ giáo nhiều. Mong sau này mình hợp tác đôi bên cùng có lợi.",
        chinese: "这是我的名片, 请多多指教。希望以后我们的合作能互利共赢。",
        pinyin: "Zhè shì wǒ de míng piàn, qǐng duō duō zhǐ jiào. Xī wàng yǐ hòu wǒ men de hé zuò néng hù lì gòng yíng."
      }
    ]
  },
  {
    id: 59,
    level: "B2",
    category: "study_career",
    title: "申请被拒后的跟进",
    pinyin: "shēn qǐng bèi jù hòu de gēn jìn",
    topic: "Following up on rejected application",
    title_vi: "Theo sát sau khi đơn ứng tuyển bị từ chối",
    title_en: "Following up on a rejected application",
    sentences: [
      {
        chinese: "尊敬的李老师, 我已经收到贵校的拒信。",
        pinyin: "Zūnjìng de Lǐ lǎoshī, wǒ yǐjīng shōu dào guì xiào de jù xìn.",
        english: "Respected Teacher Li, I have received your university's rejection letter.",
        vi: "Kính thưa cô Lý, em đã nhận được thư từ chối của quý trường.",
        pronunciation_focus: ["拒信 → jù xìn (thư từ chối)", "尊敬的 → zūnjìng de", "已经 → yǐjīng (đã)", "贵校 → guì xiào"]
      },
      {
        chinese: "虽然结果遗憾, 但我仍然非常感谢您的考虑。",
        pinyin: "Suīrán jiéguǒ yíhàn, dàn wǒ réngrán fēicháng gǎnxiè nín de kǎolǜ.",
        english: "Although the result is regrettable, I still deeply appreciate your consideration.",
        vi: "Dù kết quả đáng tiếc, em vẫn vô cùng cảm ơn cô đã cân nhắc.",
        pronunciation_focus: ["遗憾 → yíhàn (đáng tiếc)", "仍然 → réngrán (vẫn còn)", "考虑 → kǎolǜ (cân nhắc)", "感谢 → gǎnxiè"]
      },
      {
        chinese: "如果方便的话, 想请您指出我申请材料中的不足之处。",
        pinyin: "Rúguǒ fāngbiàn de huà, xiǎng qǐng nín zhǐchū wǒ shēnqǐng cáiliào zhōng de bùzú zhī chù.",
        english: "If convenient, may I ask you to point out the shortcomings in my application materials?",
        vi: "Nếu tiện, em xin cô chỉ ra những điểm còn thiếu sót trong hồ sơ ứng tuyển của em.",
        pronunciation_focus: ["指出 → zhǐchū (chỉ ra)", "不足之处 → bùzú zhī chù (chỗ thiếu sót — formal)", "方便的话 → fāngbiàn de huà", "申请材料 → shēnqǐng cáiliào"]
      },
      {
        chinese: "我打算明年再申请, 希望届时能呈现更好的自己。",
        pinyin: "Wǒ dǎsuàn míngnián zài shēnqǐng, xīwàng jièshí néng chéngxiàn gèng hǎo de zìjǐ.",
        english: "I plan to apply again next year, and hope to present a better self by then.",
        vi: "Em định năm sau ứng tuyển lại, mong đến lúc đó có thể thể hiện một bản thân tốt hơn.",
        pronunciation_focus: ["届时 → jièshí (đến lúc đó — formal)", "呈现 → chéngxiàn (thể hiện — formal)", "明年 → míngnián", "申请 → shēnqǐng"]
      },
      {
        chinese: "不胜感激, 期待您的回复。",
        pinyin: "Bù shèng gǎnjī, qídài nín de huífù.",
        english: "Greatly appreciated; looking forward to your reply.",
        vi: "Vô cùng biết ơn, em mong nhận được phản hồi của cô.",
        pronunciation_focus: ["不胜感激 → bù shèng gǎnjī (formal closer)", "期待 → qídài (mong chờ)", "回复 → huífù (phản hồi)", "您的 → nín de"]
      }
    ],
    vocab: [
      { chinese: "拒信", pinyin: "jù xìn", english: "rejection letter", vi: "thư từ chối" },
      { chinese: "申请材料", pinyin: "shēn qǐng cái liào", english: "application materials", vi: "hồ sơ ứng tuyển" },
      { chinese: "不足之处", pinyin: "bù zú zhī chù", english: "shortcomings (formal)", vi: "chỗ thiếu sót" },
      { chinese: "反馈", pinyin: "fǎn kuì", english: "feedback", vi: "phản hồi" },
      { chinese: "改进", pinyin: "gǎi jìn", english: "to improve", vi: "cải thiện" },
      { chinese: "再次申请", pinyin: "zài cì shēn qǐng", english: "to reapply", vi: "ứng tuyển lại" },
      { chinese: "不耻下问", pinyin: "bù chǐ xià wèn", english: "not ashamed to ask those below (4-char idiom)", vi: "không xấu hổ hỏi người dưới" },
      { chinese: "屡败屡战", pinyin: "lǚ bài lǚ zhàn", english: "fight on despite repeated defeats", vi: "thua nhiều vẫn chiến tiếp" },
      { chinese: "卷土重来", pinyin: "juǎn tǔ chóng lái", english: "stage a comeback", vi: "cuốn đất quay lại — quyết tâm comeback" },
      { chinese: "虚心求教", pinyin: "xū xīn qiú jiào", english: "humbly seek guidance", vi: "hư tâm cầu giáo" }
    ],
    dialogue: [
      { speaker: "陈氏梅", chinese: "李老师, 您好。我收到了贵校的拒信。", pinyin: "Lǐ lǎoshī, nín hǎo. Wǒ shōu dào le guì xiào de jù xìn.", english: "Hello Teacher Li. I received your school's rejection letter.", vi: "Cô Lý, em chào cô. Em đã nhận được thư từ chối của quý trường." },
      { speaker: "李老师", chinese: "嗯, 很遗憾这次没能录取你。", pinyin: "Èn, hěn yíhàn zhè cì méi néng lùqǔ nǐ.", english: "Yes, regrettably we couldn't admit you this time.", vi: "Ừm, rất tiếc lần này chưa thể nhận em." },
      { speaker: "陈氏梅", chinese: "请问能告诉我具体不足在哪里吗?", pinyin: "Qǐng wèn néng gàosu wǒ jùtǐ bùzú zài nǎlǐ ma?", english: "May I ask which specific aspects fell short?", vi: "Cho em hỏi cụ thể em chưa đủ ở chỗ nào ạ?" },
      { speaker: "李老师", chinese: "主要是研究计划的可行性需要再加强。", pinyin: "Zhǔyào shì yánjiū jìhuà de kěxíng xìng xūyào zài jiāqiáng.", english: "Mainly, the feasibility of your research plan needs strengthening.", vi: "Chủ yếu là tính khả thi của kế hoạch nghiên cứu cần được củng cố thêm." }
    ],
    dialogue_long: [
      { speaker: "陈氏梅", chinese: "尊敬的李老师, 您好。我是越南陈氏梅, 申请号QH202509-1234。我已经收到贵校的拒信。", pinyin: "Zūnjìng de Lǐ lǎoshī, nín hǎo. Wǒ shì Yuènán Chén Shìméi, shēnqǐng hào QH202509-1234. Wǒ yǐjīng shōu dào guì xiào de jù xìn.", english: "Respected Teacher Li, hello. I'm Tran Thi Mai from Vietnam, application number QH202509-1234. I have received your school's rejection letter.", vi: "Kính chào cô Lý. Em là Trần Thị Mai từ Việt Nam, mã đơn QH202509-1234. Em đã nhận được thư từ chối." },
      { speaker: "李老师", chinese: "陈同学你好, 看到你的邮件了。这次审核确实没能通过, 实在抱歉。", pinyin: "Chén tóngxué nǐ hǎo, kàn dào nǐ de yóujiàn le. Zhè cì shěnhé quèshí méi néng tōngguò, shízài bàoqiàn.", english: "Hello Chen, I've seen your email. The review indeed didn't pass this time — truly sorry.", vi: "Chào em Trần, cô đã đọc email của em. Lần xét duyệt này quả thực chưa đậu, thực sự xin lỗi." },
      { speaker: "陈氏梅", chinese: "结果遗憾, 但我仍然非常感谢您的考虑。如果方便的话, 想请您指出我申请材料中的不足。", pinyin: "Jiéguǒ yíhàn, dàn wǒ réngrán fēicháng gǎnxiè nín de kǎolǜ. Rúguǒ fāngbiàn de huà, xiǎng qǐng nín zhǐchū wǒ shēnqǐng cáiliào zhōng de bùzú.", english: "The result is regrettable, but I deeply appreciate your consideration. If convenient, may I ask you to point out shortcomings in my materials?", vi: "Kết quả đáng tiếc, nhưng em vẫn vô cùng cảm ơn cô đã cân nhắc. Nếu tiện, em xin cô chỉ ra những thiếu sót trong hồ sơ." },
      { speaker: "李老师", chinese: "评审组反馈主要有三点: 第一, 研究计划可行性, 时间和资源都偏理想化。", pinyin: "Píngshěn zǔ fǎnkuì zhǔyào yǒu sān diǎn: dì yī, yánjiū jìhuà kěxíng xìng, shíjiān hé zīyuán dōu piān lǐxiǎng huà.", english: "The review committee's feedback has three points: first, research plan feasibility — both time and resources lean toward idealistic.", vi: "Phản hồi của hội đồng có ba điểm: thứ nhất, tính khả thi của kế hoạch nghiên cứu, thời gian và nguồn lực đều thiên về lý tưởng hóa." },
      { speaker: "陈氏梅", chinese: "明白。我之前确实低估了数据收集的工作量。第二点呢?", pinyin: "Míngbái. Wǒ zhīqián quèshí dīgū le shùjù shōují de gōngzuò liàng. Dì èr diǎn ne?", english: "Understood. I did underestimate the workload of data collection. What's the second point?", vi: "Em hiểu. Trước em đã coi nhẹ khối lượng thu thập dữ liệu. Điểm thứ hai là gì ạ?" },
      { speaker: "李老师", chinese: "第二, 推荐信偏弱。一封是教课老师写的, 没有体现你的研究能力。", pinyin: "Dì èr, tuījiàn xìn piān ruò. Yī fēng shì jiāo kè lǎoshī xiě de, méiyǒu tǐxiàn nǐ de yánjiū nénglì.", english: "Second, recommendation letters are weak. One is from a teaching teacher, not reflecting your research ability.", vi: "Thứ hai, thư giới thiệu hơi yếu. Một thư là của giáo viên dạy lớp, chưa thể hiện khả năng nghiên cứu của em." },
      { speaker: "陈氏梅", chinese: "我下次会请研究项目的导师写。第三点是?", pinyin: "Wǒ xià cì huì qǐng yánjiū xiàngmù de dǎoshī xiě. Dì sān diǎn shì?", english: "Next time I'll ask my research project advisor to write. And the third point?", vi: "Lần sau em sẽ nhờ thầy hướng dẫn dự án nghiên cứu viết. Điểm thứ ba?" },
      { speaker: "李老师", chinese: "第三, 个人陈述写得太通用, 没有针对我们项目的特点。看不出你为什么非要来我们这里。", pinyin: "Dì sān, gèrén chénshù xiě de tài tōngyòng, méiyǒu zhēnduì wǒmen xiàngmù de tèdiǎn. Kàn bù chū nǐ wèishénme fēi yào lái wǒmen zhèlǐ.", english: "Third, the personal statement is too generic, not targeted at our program's features. Couldn't see why you specifically must come to us.", vi: "Thứ ba, bài tự thuật cá nhân viết quá chung chung, không nhắm vào đặc điểm chương trình. Không thấy được lý do em nhất định phải đến đây." },
      { speaker: "陈氏梅", chinese: "这一点是我反思最深的。我下次会研究每个项目的特色, 写得更具体。", pinyin: "Zhè yī diǎn shì wǒ fǎnsī zuì shēn de. Wǒ xià cì huì yánjiū měi gè xiàngmù de tèsè, xiě de gèng jùtǐ.", english: "This is the point I've reflected on most. Next time I'll research each program's distinctive features and write more specifically.", vi: "Điểm này là điều em suy ngẫm nhiều nhất. Lần sau em sẽ nghiên cứu đặc trưng từng chương trình và viết cụ thể hơn." },
      { speaker: "李老师", chinese: "嗯, 你的态度很好。年轻人屡败屡战很正常, 重要的是从中学习。", pinyin: "Èn, nǐ de tàidu hěn hǎo. Niánqīng rén lǚ bài lǚ zhàn hěn zhèngcháng, zhòngyào de shì cóng zhōng xuéxí.", english: "Hmm, your attitude is good. It's normal for young people to fight on through defeats — what matters is learning from them.", vi: "Ừm, thái độ của em rất tốt. Người trẻ thua nhiều lần là bình thường, quan trọng là học được từ đó." },
      { speaker: "陈氏梅", chinese: "谢谢您的鼓励。我打算明年再申请, 届时希望能呈现更好的自己。", pinyin: "Xièxie nín de gǔlì. Wǒ dǎsuàn míngnián zài shēnqǐng, jièshí xīwàng néng chéngxiàn gèng hǎo de zìjǐ.", english: "Thank you for the encouragement. I plan to reapply next year and hope to present a better self by then.", vi: "Cảm ơn cô đã động viên. Em định năm sau ứng tuyển lại, mong khi đó thể hiện một bản thân tốt hơn." },
      { speaker: "李老师", chinese: "好。如果你有改进后的研究计划, 可以发给我看, 我尽量给你建议。", pinyin: "Hǎo. Rúguǒ nǐ yǒu gǎijìn hòu de yánjiū jìhuà, kěyǐ fā gěi wǒ kàn, wǒ jǐnliàng gěi nǐ jiànyì.", english: "Good. If you have an improved research plan, you can send it to me — I'll try to give suggestions.", vi: "Được. Nếu em có kế hoạch nghiên cứu đã cải thiện, có thể gửi cô xem, cô sẽ cố gắng góp ý." },
      { speaker: "陈氏梅", chinese: "真的可以吗? 这是我莫大的荣幸! 我会认真修改后再发您。", pinyin: "Zhēn de kěyǐ ma? Zhè shì wǒ mòdà de róngxìng! Wǒ huì rènzhēn xiūgǎi hòu zài fā nín.", english: "Really? That's my greatest honor! I'll carefully revise before sending you.", vi: "Thật ạ? Đây là vinh hạnh lớn của em! Em sẽ sửa kỹ rồi gửi cô." },
      { speaker: "李老师", chinese: "客气了。学术之路本来就是不断试错。我相信你卷土重来时一定更强。", pinyin: "Kèqì le. Xuéshù zhī lù běnlái jiù shì bùduàn shìcuò. Wǒ xiāngxìn nǐ juǎn tǔ chóng lái shí yīdìng gèng qiáng.", english: "Don't be too formal. The academic path is constant trial and error. I believe when you make your comeback, you'll be stronger.", vi: "Khách sáo quá. Con đường học thuật vốn là thử và sai liên tục. Cô tin khi em quay lại sẽ mạnh hơn." },
      { speaker: "陈氏梅", chinese: "您的鼓励对我意义重大。请允许我把您加为微信, 以后向您虚心求教。", pinyin: "Nín de gǔlì duì wǒ yìyì zhòngdà. Qǐng yǔnxǔ wǒ bǎ nín jiā wèi wēixìn, yǐhòu xiàng nín xūxīn qiújiào.", english: "Your encouragement means a lot to me. Please allow me to add you on WeChat to humbly seek guidance later.", vi: "Sự động viên của cô có ý nghĩa rất lớn với em. Cho phép em kết bạn WeChat để sau này hư tâm cầu giáo cô." },
      { speaker: "李老师", chinese: "可以, 但邮件正式的事情还是发邮件。微信只用来简短沟通。", pinyin: "Kěyǐ, dàn yóujiàn zhèngshì de shìqing háishì fā yóujiàn. Wēixìn zhǐ yòng lái jiǎnduǎn gōutōng.", english: "Sure, but for formal matters, still email. WeChat only for brief communication.", vi: "Được, nhưng việc trang trọng vẫn gửi email. WeChat chỉ dùng trao đổi ngắn." }
    ],
    roleplay_prompts: [
      "Đóng vai bạn vừa nhận thư từ chối từ học bổng CSC. Hãy viết email cho điều phối viên xin feedback cụ thể về hồ sơ — không van nài, không trách móc, chỉ xin thông tin để cải thiện. Mở đầu '虽然结果遗憾, 但我仍然感谢...', đóng bằng '不胜感激'.",
      "Sau khi nhận feedback, bạn không đồng ý với một điểm (vd: họ nói 'thiếu kinh nghiệm nghiên cứu' nhưng bạn có 2 paper). Hãy phản hồi nhẹ nhàng, KHÔNG đối đầu — dùng cụm '我可能在材料中没有充分体现这部分, 是否能补充说明?' (có lẽ em chưa thể hiện đầy đủ phần này, em có thể bổ sung không?).",
      "Một năm sau khi bị từ chối, bạn ứng tuyển lại cùng trường. Trong personal statement, hãy đề cập (lịch sự) về lần ứng tuyển trước, những gì đã cải thiện, và sự kiên định của bạn. Dùng cụm '屡败屡战' và '卷土重来' để thể hiện tinh thần — không tự thương hại."
    ],
    register_notes: "Email follow-up sau khi bị từ chối là môi trường formal cao nhưng cũng nhạy cảm. Phải cân bằng giữa: (a) thể hiện thất vọng (có thật), (b) thể hiện biết ơn (chân thành), (c) xin feedback cụ thể (chuyên nghiệp), (d) báo hiệu sẽ quay lại (kiên định).\n\nMở đầu BẮT BUỘC '尊敬的[姓]老师' — đã có quan hệ trước, không phải '留学办公室老师' generic. Câu mở: '我已经收到贵校的拒信' — thừa nhận sự thật, không né tránh. Sau đó IMMEDIATELY chuyển sang biết ơn: '虽然结果遗憾, 但我仍然非常感谢您的考虑'.\n\nKhi xin feedback: KHÔNG dùng '为什么我没被录取?' (tại sao tôi không được chọn? — phòng thủ). Dùng '想请您指出我申请材料中的不足之处' (xin thầy chỉ ra những thiếu sót — học hỏi). Sự khác biệt nhỏ nhưng tâm lý hoàn toàn khác.\n\nKhi báo ý định quay lại: '我打算明年再申请, 希望届时能呈现更好的自己'. Dùng 届时 (jièshí — đến lúc đó) thay vì 那时 (nà shí — lúc đó) — formal hơn. 呈现 (chéngxiàn — thể hiện/trình bày) thay vì 表现 (biǎoxiàn — biểu hiện) — formal hơn.\n\nTránh: (a) Tone bi quan ('em rất buồn') — không chuyên nghiệp; (b) Tone quá tích cực ('em hoàn toàn không sao') — không chân thành; (c) Đổ lỗi ('có lẽ vì lý do nào khác') — phá quan hệ.",
    idiom_glosses: [
      {
        idiom: "屡败屡战",
        literal: "thua nhiều, đánh nhiều (lǚ bài lǚ zhàn)",
        meaning: "Thua nhiều lần vẫn chiến đấu — kiên trì không bỏ cuộc dù thất bại lặp lại. Cụm dùng để miêu tả tinh thần người trẻ ứng tuyển nhiều lần. Tích cực hơn '屡战屡败' (đánh nhiều, thua nhiều — bi quan).",
        example: "年轻人屡败屡战很正常, 重要的是不放弃。"
      },
      {
        idiom: "卷土重来",
        literal: "cuốn đất quay lại (juǎn tǔ chóng lái)",
        meaning: "Comeback mạnh mẽ — như cuộn đất bụi bay lên rồi xông trở lại trận địa. Cụm hùng hồn để miêu tả quyết tâm thử lại sau thất bại. Hơi cường điệu — dùng khi bạn thực sự cam kết.",
        example: "明年我会卷土重来, 这次一定更有准备。"
      },
      {
        idiom: "不耻下问",
        literal: "không xấu hổ hỏi người dưới (bù chǐ xià wèn)",
        meaning: "Không cảm thấy xấu hổ khi hỏi người có vẻ kém hơn mình — phẩm chất khiêm tốn của người ham học. Cụm tự miêu tả thái độ cầu thị: '我会不耻下问, 向所有人学习'.",
        example: "我会不耻下问, 不断向他人请教。"
      },
      {
        idiom: "虚心求教",
        literal: "hư tâm cầu giáo (xū xīn qiú jiào)",
        meaning: "Khiêm tốn xin được chỉ giáo — thái độ học hỏi đúng. Cụm dùng khi xin feedback từ người trên: '请允许我向您虚心求教'. Đặc biệt phù hợp khi đang có thất bại — báo hiệu bạn sẵn sàng học.",
        example: "请允许我以后向您虚心求教。"
      }
    ],
    cultural_notes_vi: "Văn hóa xin feedback sau khi bị từ chối ở Trung Quốc khác biệt với Mỹ/châu Âu: (1) Trường top Trung Quốc THƯỜNG KHÔNG cung cấp feedback cá nhân — không phải vì lười, mà vì sợ tranh chấp pháp lý. Đại đa số reply '我们对所有申请人保持公平, 不便对个案做点评' (chúng tôi công bằng với mọi ứng viên, không tiện đánh giá từng trường hợp). KHÔNG nài nỉ. (2) Tuy nhiên, nếu bạn ĐÃ CÓ quan hệ trước (đã email với GS, đã đến trường thăm) — feedback có thể có. Đầu tư xây dựng quan hệ TRƯỚC khi nộp đơn, không sau khi bị từ chối. (3) Nếu nhận được feedback, đó là TÀI SẢN. Phải đáp lại trang trọng: cảm ơn cụ thể từng điểm, mô tả cách bạn sẽ cải thiện, hứa cập nhật về tiến độ. Nhiều người Việt nhận feedback rồi im lặng — bị coi là thiếu tôn trọng và đóng cửa cho lần sau.\n\nVăn hóa 'thử lại' (再申请): Trung Quốc đại lục đặc biệt tôn trọng người kiên trì. Đỗ đại học/du học sau 2-3 lần thất bại = dấu hiệu của 'có chí'. Đừng giấu lịch sử thất bại trong đơn lần sau — đề cập trong personal statement với khung 'từ thất bại tôi học được X, Y, Z'. Đây là điểm cộng, không trừ.\n\nVề tone: KHÔNG bi lụy ('giấc mơ của em đã tan vỡ'), KHÔNG giả vờ bình thản ('không sao đâu, lần sau lại tới'). Tone đúng: 'tiếc nhưng học được, sẽ quay lại mạnh hơn'. Đây là phong thái 'reasonable resilience' (kiên cường lý tính) mà người Trung Quốc đánh giá cao.\n\nVề thời điểm follow-up: gửi email feedback trong 1-2 tuần sau khi nhận thư từ chối, KHÔNG quá sớm (1-2 ngày — nóng vội), KHÔNG quá muộn (1 tháng — không quan tâm).",
    tip_advice_vi: "(1) ĐỌC LẠI thư từ chối kỹ trước khi viết email follow-up. Một số trường đã ghi sẵn 'không cung cấp feedback' — nếu vậy, KHÔNG email xin. Chuyển sang trường khác. (2) Tiêu đề email cụ thể: '关于申请结果的请教 — 申请号QH202509-1234'. Đừng dùng '为什么没被录取' — quá đối đầu. (3) Cấu trúc email 4 đoạn: (a) thừa nhận + cảm ơn; (b) xin feedback cụ thể; (c) cam kết cải thiện; (d) đóng formal. Mỗi đoạn 2-3 câu, không lan man. (4) KHÔNG đính kèm CV mới hay portfolio — chưa đến lúc. Email này chỉ là xin feedback, không phải re-pitch. (5) Nếu nhận được feedback gay gắt ('hồ sơ của bạn quá yếu'), KHÔNG defensive. Reply: '感谢您坦诚的反馈, 我会认真消化, 努力改进' (cảm ơn phản hồi thẳng thắn, em sẽ tiếp thu nghiêm túc và cải thiện). Người Trung Quốc đặc biệt đánh giá cao thái độ này. (6) Cập nhật tiến độ sau 3-6 tháng: gửi email ngắn cho người đã cho feedback, kèm 'tôi đã cải thiện X, Y, Z theo gợi ý của thầy/cô' + đính kèm bản cập nhật ngắn. Đây là 'closing the loop' — ít người làm, gây ấn tượng đặc biệt mạnh. (7) Lần ứng tuyển sau, đề cập (ngắn gọn) trong personal statement: '去年申请未果, 我深刻反思了三点不足... 一年来我做了以下改进...'. Đây là dấu hiệu của 'growth mindset' — điểm cộng lớn ở Trung Quốc.",
    exercises: [
      { type: "fill-blank", question: "明年我一定 ___ , 这次更有准备。", answer: "卷土重来" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung sau từ chối với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "拒信", pinyin: "jù xìn", english: "thư từ chối" },
          { chinese: "不足之处", pinyin: "bù zú zhī chù", english: "chỗ thiếu sót" },
          { chinese: "屡败屡战", pinyin: "lǚ bài lǚ zhàn", english: "thua nhiều vẫn chiến tiếp" },
          { chinese: "虚心求教", pinyin: "xū xīn qiú jiào", english: "hư tâm cầu giáo" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Tuy kết quả đáng tiếc, em vẫn vô cùng cảm ơn cô đã cân nhắc. Xin cô chỉ ra những thiếu sót để em có thể cải thiện cho lần sau.",
        chinese: "虽然结果遗憾, 但我仍然非常感谢您的考虑。请您指出我的不足之处, 以便我下次改进。",
        pinyin: "Suī rán jié guǒ yí hàn, dàn wǒ réng rán fēi cháng gǎn xiè nín de kǎo lǜ. Qǐng nín zhǐ chū wǒ de bù zú zhī chù, yǐ biàn wǒ xià cì gǎi jìn."
      }
    ]
  },
  {
    id: 60,
    level: "B2",
    category: "study_career",
    title: "请教授写推荐信",
    pinyin: "qǐng jiào shòu xiě tuī jiàn xìn",
    topic: "Asking a professor for a letter of recommendation",
    title_vi: "Xin giáo sư viết thư giới thiệu",
    title_en: "Asking a professor for a letter of recommendation",
    sentences: [
      {
        chinese: "尊敬的王教授, 冒昧打扰您, 实在抱歉。",
        pinyin: "Zūnjìng de Wáng jiàoshòu, màomèi dǎrǎo nín, shízài bàoqiàn.",
        english: "Respected Professor Wang, I'm sorry to disturb you out of place.",
        vi: "Kính thưa giáo sư Vương, em mạo muội làm phiền thầy, em thực sự xin lỗi.",
        pronunciation_focus: ["冒昧 → màomèi (mạo muội — formal)", "打扰 → dǎrǎo (làm phiền)", "抱歉 → bàoqiàn (xin lỗi)", "尊敬的 → zūnjìng de"]
      },
      {
        chinese: "我打算申请清华大学的硕士项目, 想恳请您为我写一封推荐信。",
        pinyin: "Wǒ dǎsuàn shēnqǐng Qīnghuá Dàxué de shuòshì xiàngmù, xiǎng kěnqǐng nín wèi wǒ xiě yī fēng tuījiàn xìn.",
        english: "I plan to apply for Tsinghua's Master's program and humbly ask you to write a letter of recommendation for me.",
        vi: "Em định ứng tuyển chương trình thạc sĩ Đại học Thanh Hoa, em xin khẩn thiết nhờ thầy viết một thư giới thiệu cho em.",
        pronunciation_focus: ["恳请 → kěnqǐng (khẩn thỉnh — formal)", "推荐信 → tuījiàn xìn (thư giới thiệu)", "硕士项目 → shuòshì xiàngmù", "申请 → shēnqǐng"]
      },
      {
        chinese: "您是最了解我学术能力的老师, 您的推荐对我意义重大。",
        pinyin: "Nín shì zuì liǎojiě wǒ xuéshù nénglì de lǎoshī, nín de tuījiàn duì wǒ yìyì zhòngdà.",
        english: "You are the teacher who knows my academic ability best; your recommendation is of great significance to me.",
        vi: "Thầy là người hiểu rõ năng lực học thuật của em nhất, thư giới thiệu của thầy có ý nghĩa to lớn với em.",
        pronunciation_focus: ["了解 → liǎojiě (hiểu rõ)", "学术能力 → xuéshù nénglì (năng lực học thuật)", "意义重大 → yìyì zhòngdà (ý nghĩa to lớn)", "推荐 → tuījiàn"]
      },
      {
        chinese: "推荐信的截止日期是十二月十五号, 我会提前把所有相关材料发给您。",
        pinyin: "Tuījiàn xìn de jiézhǐ rìqī shì shí'èr yuè shíwǔ hào, wǒ huì tíqián bǎ suǒyǒu xiāngguān cáiliào fā gěi nín.",
        english: "The deadline is December 15th — I'll send you all relevant materials in advance.",
        vi: "Hạn nộp thư giới thiệu là 15/12, em sẽ gửi thầy mọi tài liệu liên quan từ trước.",
        pronunciation_focus: ["截止日期 → jiézhǐ rìqī (hạn nộp)", "提前 → tíqián (trước hạn)", "相关材料 → xiāngguān cáiliào (tài liệu liên quan)", "十二月 → shí'èr yuè"]
      },
      {
        chinese: "您的知遇之恩, 我永远铭记在心。",
        pinyin: "Nín de zhī yù zhī ēn, wǒ yǒngyuǎn míngjì zài xīn.",
        english: "I will forever remember your kindness in recognizing my potential.",
        vi: "Ơn tri ngộ của thầy, em vĩnh viễn khắc ghi trong lòng.",
        pronunciation_focus: ["知遇之恩 → zhī yù zhī ēn (ơn tri ngộ — idiom 4 chữ formal)", "永远 → yǒngyuǎn (mãi mãi)", "铭记在心 → míngjì zài xīn (khắc ghi trong lòng)", "您的 → nín de"]
      }
    ],
    vocab: [
      { chinese: "推荐信", pinyin: "tuī jiàn xìn", english: "letter of recommendation", vi: "thư giới thiệu" },
      { chinese: "教授", pinyin: "jiào shòu", english: "professor", vi: "giáo sư" },
      { chinese: "恳请", pinyin: "kěn qǐng", english: "to humbly request (formal)", vi: "khẩn thỉnh" },
      { chinese: "截止日期", pinyin: "jié zhǐ rì qī", english: "deadline", vi: "hạn chót" },
      { chinese: "推荐人", pinyin: "tuī jiàn rén", english: "recommender", vi: "người giới thiệu" },
      { chinese: "学术能力", pinyin: "xué shù néng lì", english: "academic ability", vi: "năng lực học thuật" },
      { chinese: "知遇之恩", pinyin: "zhī yù zhī ēn", english: "kindness of recognizing one's worth", vi: "ơn tri ngộ" },
      { chinese: "不胜感激", pinyin: "bù shèng gǎn jī", english: "greatly appreciated", vi: "vô cùng biết ơn" },
      { chinese: "恩重如山", pinyin: "ēn zhòng rú shān", english: "kindness as heavy as a mountain", vi: "ơn nặng như núi" },
      { chinese: "铭记在心", pinyin: "míng jì zài xīn", english: "engrave in heart", vi: "khắc ghi trong lòng" }
    ],
    dialogue: [
      { speaker: "学生", chinese: "王教授, 我有件事想恳请您。", pinyin: "Wáng jiàoshòu, wǒ yǒu jiàn shì xiǎng kěnqǐng nín.", english: "Professor Wang, there's something I'd like to humbly ask of you.", vi: "Thầy Vương, em có việc muốn khẩn thiết nhờ thầy." },
      { speaker: "王教授", chinese: "你说说看。", pinyin: "Nǐ shuōshuo kàn.", english: "Go ahead.", vi: "Em nói xem nào." },
      { speaker: "学生", chinese: "我打算申请清华硕士, 希望您能为我写推荐信。", pinyin: "Wǒ dǎsuàn shēnqǐng Qīnghuá shuòshì, xīwàng nín néng wèi wǒ xiě tuījiàn xìn.", english: "I'm applying for Tsinghua's Master's and hope you can write a recommendation.", vi: "Em định ứng tuyển thạc sĩ Thanh Hoa, mong thầy có thể viết thư giới thiệu cho em." },
      { speaker: "王教授", chinese: "可以, 把你的简历和申请项目发给我吧。", pinyin: "Kěyǐ, bǎ nǐ de jiǎnlì hé shēnqǐng xiàngmù fā gěi wǒ ba.", english: "Sure, send me your CV and the application program.", vi: "Được, gửi thầy CV và chương trình em ứng tuyển nhé." }
    ],
    dialogue_long: [
      { speaker: "学生", chinese: "尊敬的王教授, 冒昧打扰您。我是您去年指导过NLP项目的陈氏梅。", pinyin: "Zūnjìng de Wáng jiàoshòu, màomèi dǎrǎo nín. Wǒ shì nín qùnián zhǐdǎo guò NLP xiàngmù de Chén Shìméi.", english: "Respected Professor Wang, sorry to disturb. I'm Tran Thi Mai whom you supervised last year on the NLP project.", vi: "Kính thưa thầy Vương, em mạo muội làm phiền. Em là Trần Thị Mai mà thầy đã hướng dẫn dự án NLP năm ngoái." },
      { speaker: "王教授", chinese: "陈同学, 我记得你。怎么了, 有什么事?", pinyin: "Chén tóngxué, wǒ jìde nǐ. Zěnme le, yǒu shénme shì?", english: "Chen, I remember you. What's up, what's the matter?", vi: "Em Trần, thầy nhớ em. Có chuyện gì vậy?" },
      { speaker: "学生", chinese: "我打算申请清华大学计算机学院的硕士项目, 想恳请您为我写一封推荐信。", pinyin: "Wǒ dǎsuàn shēnqǐng Qīnghuá Dàxué jìsuànjī xuéyuàn de shuòshì xiàngmù, xiǎng kěnqǐng nín wèi wǒ xiě yī fēng tuījiàn xìn.", english: "I'm applying to Tsinghua's Computer Science Master's, and humbly ask you to write a recommendation letter.", vi: "Em định ứng tuyển chương trình thạc sĩ khoa Công nghệ Thông tin Đại học Thanh Hoa, em xin khẩn thiết nhờ thầy viết thư giới thiệu." },
      { speaker: "王教授", chinese: "清华啊, 这是好目标。你打算申请哪个研究方向?", pinyin: "Qīnghuá a, zhè shì hǎo mùbiāo. Nǐ dǎsuàn shēnqǐng nǎ gè yánjiū fāngxiàng?", english: "Tsinghua — that's a good goal. Which research direction are you applying to?", vi: "Thanh Hoa à, mục tiêu tốt đấy. Em định ứng tuyển hướng nghiên cứu nào?" },
      { speaker: "学生", chinese: "孙茂松教授的低资源语言NLP方向, 这跟我们去年做的越南语项目很相关。", pinyin: "Sūn Màosōng jiàoshòu de dī zīyuán yǔyán NLP fāngxiàng, zhè gēn wǒmen qùnián zuò de Yuènányǔ xiàngmù hěn xiāngguān.", english: "Professor Sun Maosong's low-resource language NLP direction, very related to the Vietnamese project we did last year.", vi: "Hướng NLP ngôn ngữ ít tài nguyên của giáo sư Tôn Mậu Tùng, rất liên quan đến dự án tiếng Việt mình làm năm ngoái." },
      { speaker: "王教授", chinese: "嗯, 方向选得很对。截止日期是什么时候?", pinyin: "Èn, fāngxiàng xuǎn de hěn duì. Jiézhǐ rìqī shì shénme shíhou?", english: "Yes, well-chosen direction. When's the deadline?", vi: "Ừm, hướng chọn rất đúng. Hạn chót khi nào?" },
      { speaker: "学生", chinese: "推荐信截止是十二月十五号, 也就是从今天起还有四十天。我希望能给您足够时间。", pinyin: "Tuījiàn xìn jiézhǐ shì shí'èr yuè shíwǔ hào, yě jiùshì cóng jīntiān qǐ hái yǒu sìshí tiān. Wǒ xīwàng néng gěi nín zúgòu shíjiān.", english: "Recommendation deadline is Dec 15, which is 40 days from today. I hope to give you enough time.", vi: "Hạn thư giới thiệu là 15/12, tính từ hôm nay là còn 40 ngày. Em mong dành cho thầy đủ thời gian." },
      { speaker: "王教授", chinese: "好, 时间充裕。你需要把哪些材料发给我?", pinyin: "Hǎo, shíjiān chōngyù. Nǐ xūyào bǎ nǎxiē cáiliào fā gěi wǒ?", english: "Good, ample time. What materials do you need to send me?", vi: "Được, thời gian rộng rãi. Em cần gửi thầy những tài liệu gì?" },
      { speaker: "学生", chinese: "我会发您: 简历、个人陈述、研究计划草稿、推荐信提交链接, 还有我整理的我们去年项目成果摘要。", pinyin: "Wǒ huì fā nín: jiǎnlì, gèrén chénshù, yánjiū jìhuà cǎogǎo, tuījiàn xìn tíjiāo liànjiē, hái yǒu wǒ zhěnglǐ de wǒmen qùnián xiàngmù chéngguǒ zhāiyào.", english: "I'll send: CV, personal statement, research plan draft, recommendation submission link, plus a summary of our project's outcomes from last year.", vi: "Em sẽ gửi thầy: CV, bài tự thuật, bản nháp kế hoạch nghiên cứu, link nộp thư giới thiệu, và bản tóm tắt thành quả dự án năm ngoái em đã tổng hợp." },
      { speaker: "王教授", chinese: "项目摘要好, 这能帮我写得更具体。还有清华那边对推荐信有什么具体要求吗?", pinyin: "Xiàngmù zhāiyào hǎo, zhè néng bāng wǒ xiě de gèng jùtǐ. Hái yǒu Qīnghuá nà biān duì tuījiàn xìn yǒu shénme jùtǐ yāoqiú ma?", english: "Project summary is good — helps me write more specifically. Does Tsinghua have specific requirements for recommendation letters?", vi: "Tóm tắt dự án tốt, giúp thầy viết cụ thể hơn. Bên Thanh Hoa có yêu cầu cụ thể nào cho thư giới thiệu không?" },
      { speaker: "学生", chinese: "他们要求英文版, 字数八百到一千二, 主要评估学术能力、研究潜力、和个人品质。", pinyin: "Tāmen yāoqiú yīngwén bǎn, zìshù bā bǎi dào yī qiān èr, zhǔyào pínggū xuéshù nénglì, yánjiū qiánlì, hé gèrén pǐnzhì.", english: "They require English version, 800-1200 words, evaluating academic ability, research potential, and personal qualities.", vi: "Họ yêu cầu bản tiếng Anh, 800-1200 chữ, đánh giá năng lực học thuật, tiềm năng nghiên cứu, và phẩm chất cá nhân." },
      { speaker: "王教授", chinese: "好。你可以先写一个中文初稿, 包含你希望我强调的几个点, 我修改后翻译成英文。这样效率高一些。", pinyin: "Hǎo. Nǐ kěyǐ xiān xiě yī gè zhōngwén chūgǎo, bāohán nǐ xīwàng wǒ qiángdiào de jǐ gè diǎn, wǒ xiūgǎi hòu fānyì chéng yīngwén. Zhèyàng xiàolǜ gāo yīxiē.", english: "Good. You can first draft a Chinese version with points you want me to emphasize, I'll revise then translate to English. More efficient that way.", vi: "Được. Em có thể viết bản nháp tiếng Trung trước, bao gồm những điểm em mong thầy nhấn mạnh, thầy sửa rồi dịch sang tiếng Anh. Hiệu quả hơn." },
      { speaker: "学生", chinese: "真的可以吗? 这是您莫大的帮助! 我会非常认真地准备初稿。", pinyin: "Zhēn de kěyǐ ma? Zhè shì nín mòdà de bāngzhù! Wǒ huì fēicháng rènzhēn de zhǔnbèi chūgǎo.", english: "Really? That's a huge help! I'll prepare the draft very carefully.", vi: "Thật ạ? Đây là sự giúp đỡ to lớn của thầy! Em sẽ chuẩn bị bản nháp thật nghiêm túc." },
      { speaker: "王教授", chinese: "客气什么。不过有一点要说清楚: 推荐信的内容必须真实, 你写的草稿我会按需修改, 不会照搬。", pinyin: "Kèqì shénme. Bùguò yǒu yī diǎn yào shuō qīngchu: tuījiàn xìn de nèiróng bìxū zhēnshí, nǐ xiě de cǎogǎo wǒ huì àn xū xiūgǎi, bù huì zhàobān.", english: "Don't mention it. But one point to clarify: recommendation content must be truthful — I'll modify your draft as needed, not copy it.", vi: "Khách sáo gì chứ. Nhưng có một điểm phải rõ: nội dung thư giới thiệu phải chân thực, thầy sẽ sửa bản nháp em viết theo cần, không bê nguyên." },
      { speaker: "学生", chinese: "完全理解。我只是给您参考, 最终表达由您决定。您的知遇之恩, 我永远铭记在心。", pinyin: "Wánquán lǐjiě. Wǒ zhǐshì gěi nín cānkǎo, zuìzhōng biǎodá yóu nín juédìng. Nín de zhī yù zhī ēn, wǒ yǒngyuǎn míngjì zài xīn.", english: "Completely understood. It's just reference — final expression is yours. Your kindness in recognizing my potential, I'll forever remember.", vi: "Em hoàn toàn hiểu. Em chỉ làm tài liệu tham khảo, cách diễn đạt cuối cùng do thầy quyết định. Ơn tri ngộ của thầy em vĩnh viễn khắc ghi trong lòng." },
      { speaker: "王教授", chinese: "言重了。我帮你也是看好你的发展。希望你将来在清华一切顺利。", pinyin: "Yán zhòng le. Wǒ bāng nǐ yěshì kànhǎo nǐ de fāzhǎn. Xīwàng nǐ jiānglái zài Qīnghuá yīqiè shùnlì.", english: "Don't make it heavy. I help because I see your potential. Hope all goes well for you at Tsinghua in the future.", vi: "Em nói trọng quá rồi. Thầy giúp em cũng vì kỳ vọng vào sự phát triển của em. Mong tương lai em ở Thanh Hoa mọi việc thuận lợi." }
    ],
    roleplay_prompts: [
      "Đóng vai bạn — sinh viên đã tốt nghiệp 2 năm — viết email cho giáo sư cũ chưa liên lạc một thời gian. Hãy mở đầu bằng update ngắn về công việc + lý do liên lạc lại + lời xin viết thư. KHÔNG vào thẳng việc xin — phải có 'warm-up' xã giao trước. Dùng cụm '冒昧打扰您' và '不知道您是否还记得我'.",
      "Giáo sư đồng ý nhưng nói 'em viết bản nháp đi rồi tôi sửa'. Đây là bài kiểm tra. Hãy chuẩn bị bản nháp KHÔNG quá tự khen, KHÔNG quá khiêm tốn — viết về 3 thành tựu cụ thể với số liệu, kèm 1 đặc điểm tính cách. Sau đó email lại với câu '这是我整理的草稿, 请您按需修改'.",
      "Giáo sư từ chối khéo: '最近实在太忙, 怕写不好影响你的申请'. Đây có thể là từ chối mềm hoặc lời thách. Hãy đáp lại nhẹ nhàng: nếu thực sự bận, đề xuất 'nếu thầy cảm thấy không tiện, em hiểu hoàn toàn' (cho lối thoát); nếu cảm thấy có thể thuyết phục, đề xuất giải pháp giảm gánh nặng (cung cấp bản nháp chi tiết, deadline rộng)."
    ],
    register_notes: "Email xin thư giới thiệu là một trong những giao tiếp formal nhất với giáo sư. Mở đầu BẮT BUỘC '尊敬的[姓]教授' kèm cụm '冒昧打扰您' (mạo muội làm phiền) — báo hiệu bạn biết mình đang yêu cầu một việc lớn.\n\nDùng động từ '恳请' (kěnqǐng — khẩn thỉnh) thay vì '请' đơn giản — đây là động từ formal cao cho yêu cầu trang trọng. Khi đề cập sự quan trọng của thư: '您的推荐对我意义重大' (thư của thầy có ý nghĩa to lớn với em) — thể hiện trọng lượng mà không nịnh nọt.\n\nKhi nói về deadline: '推荐信的截止日期是X月X号, 我希望能给您足够时间' — chủ động cho biết bạn tôn trọng thời gian của họ. Tối thiểu 4 TUẦN trước deadline; xin sát ngày = thiếu chuyên nghiệp.\n\nKhi giáo sư đồng ý, đáp lại bằng cụm formal: '您的知遇之恩, 我永远铭记在心' (ơn tri ngộ của thầy em vĩnh viễn khắc ghi). Đây là cụm cổ điển formal nhưng không bị coi là quá cường điệu trong context giáo sư-học trò.\n\nTránh: (a) Xin nhiều giáo sư cùng lúc cho cùng chương trình — bị phát hiện = mất uy tín; (b) Giấu tên các trường khác bạn đang ứng tuyển — nếu thầy hỏi, trả lời thật; (c) Sửa lại nội dung thầy viết — nếu cần điều chỉnh, gửi email xin thầy chỉnh.",
    idiom_glosses: [
      {
        idiom: "知遇之恩",
        literal: "ơn của sự tri ngộ (zhī yù zhī ēn)",
        meaning: "Ơn tri ngộ — ơn của người nhận ra giá trị mình và cho cơ hội. Cụm cổ điển formal dùng khi cảm ơn giáo sư/sếp đã giúp đỡ. Mạnh nhưng không bị coi là cường điệu trong context Trung Quốc.",
        example: "您的知遇之恩, 我永远铭记在心。"
      },
      {
        idiom: "恩重如山",
        literal: "ơn nặng như núi (ēn zhòng rú shān)",
        meaning: "Ơn nặng như núi — biết ơn sâu sắc khó nói hết. Mạnh hơn 知遇之恩, dùng khi giáo sư đã làm việc lớn cho bạn (vd: dành 1 tuần viết thư chi tiết). Tránh dùng cho việc nhỏ — sẽ bị coi là sáo rỗng.",
        example: "老师的帮助恩重如山, 我无以为报。"
      },
      {
        idiom: "铭记在心",
        literal: "khắc ghi vào tim (míng jì zài xīn)",
        meaning: "Khắc ghi trong lòng — nhớ mãi không quên. Cụm formal dùng để cam kết nhớ ơn lâu dài. Đặc biệt phù hợp khi cảm ơn giáo sư cho cơ hội: '您的教诲我会铭记在心'.",
        example: "您的教导我会铭记在心, 终生不忘。"
      },
      {
        idiom: "无以为报",
        literal: "không có gì để báo đáp (wú yǐ wèi bào)",
        meaning: "Không biết lấy gì báo đáp — biết ơn đến mức cảm thấy không xứng đáp lại. Cụm khiêm tốn lý tưởng cho thư cảm ơn cuối cùng. Tránh dùng quá sớm — sẽ bị coi là khách sáo.",
        example: "您的恩情我无以为报, 唯有努力学习。"
      }
    ],
    cultural_notes_vi: "Văn hóa xin thư giới thiệu ở Trung Quốc đại lục có nét đặc thù: (1) Quan hệ giáo sư-học trò tiếp tục SAU khi tốt nghiệp — không như Mỹ (nơi giáo sư có thể bận đến mức quên học trò cũ). Giáo sư Trung Quốc thường nhớ học trò 5-10 năm sau, đặc biệt nếu bạn duy trì liên lạc (Tết gửi tin chúc, kỷ niệm kết quả thi). Đầu tư vào quan hệ này dài hạn. (2) Số lượng thư giới thiệu giáo sư có thể viết: thường giới hạn 5-10 thư/năm cho học bổng top. Nếu bạn xin và biết rằng thầy đã ngoài giới hạn, đề xuất 'nếu thầy không đủ thời gian, em hoàn toàn hiểu' — cho lối thoát. (3) 'Em viết nháp đi' không phải lười — đây là cách giáo sư kiểm tra: bạn có biết tự nhìn nhận điểm mạnh/yếu, có biết viết formal không. Bản nháp tốt = thầy viết nhanh và sâu sắc. Bản nháp kém = thầy phải sửa nhiều, dẫn đến thư không sâu. (4) Sau khi nhận thư, NHỚ cập nhật kết quả: nếu trúng tuyển, gửi tin báo + cảm ơn cụ thể; nếu trượt, vẫn gửi tin báo + cảm ơn (không bao giờ im lặng). Đây là 'closing the loop' quan trọng cho quan hệ tương lai. (5) Quà cảm ơn: KHÔNG bắt buộc nhưng phổ biến. Đặc sản quê (cà phê Việt Nam, trà sen) là lý tưởng — không quá đắt, biểu trưng quê hương. Tránh tiền mặt, voucher đắt tiền — bị nghi hối lộ.\n\nVề số lượng thư: chương trình Mỹ thường yêu cầu 3, Trung Quốc 2-3. KHÔNG xin thêm 'để dự phòng' — mỗi thư phải có lý do.\n\nVề ngôn ngữ thư: nếu chương trình đại học Trung Quốc, thư có thể tiếng Trung; nếu chương trình quốc tế tại Trung Quốc, thường yêu cầu tiếng Anh. Hỏi rõ trước khi giáo sư bắt đầu viết.",
    tip_advice_vi: "(1) HẸN trực tiếp gặp giáo sư trước, không xin qua email lần đầu — thể hiện sự trang trọng. Nếu không thể gặp (đã ra trường), email phải đặc biệt formal. (2) Khoảng cách thời gian xin: TỐI THIỂU 4 tuần trước deadline. Lý tưởng 6-8 tuần. Xin sát ngày = thư viết vội = thư yếu. (3) Cung cấp 'package' đầy đủ cho giáo sư: CV mới nhất, personal statement, research plan, danh sách 3-5 thành tựu cụ thể bạn muốn họ nhấn mạnh, link nộp + mật khẩu (nếu có), deadline rõ ràng. Đặt tất cả vào 1 email với tiêu đề rõ: '关于推荐信材料 — 陈氏梅 — 截止12月15日'. (4) Nếu giáo sư yêu cầu bản nháp, viết theo cấu trúc: (a) tôi biết người này thế nào (trong context nào, bao lâu); (b) 3 điểm mạnh chính với số liệu/ví dụ cụ thể; (c) so sánh với học sinh khác (top 5%, top 1%); (d) cam kết người này sẽ thành công. Tránh adjective trống ('rất giỏi') — thay bằng số liệu ('GPA top 5%'). (5) Một tuần trước deadline, gửi email nhắc nhẹ: '王教授, 关于12月15日截止的推荐信, 不知您方便的话什么时候可以提交?' — nhắc nhưng không thúc giục. (6) Ngay sau khi giáo sư nộp thư, gửi email cảm ơn: '感谢您及时提交了推荐信, 您的支持对我意义重大'. (7) Sau khi có kết quả (đỗ hoặc trượt), update giáo sư trong 1-2 tuần. Đỗ: '感谢您的推荐信, 我已被X录取'. Trượt: '虽然这次未果, 但您的支持我永远感激'. Đừng im lặng — giáo sư sẽ nhớ.",
    exercises: [
      { type: "fill-blank", question: "您的 ___ , 我永远铭记在心。", answer: "知遇之恩" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung thư giới thiệu với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "推荐信", pinyin: "tuī jiàn xìn", english: "thư giới thiệu" },
          { chinese: "恳请", pinyin: "kěn qǐng", english: "khẩn thỉnh (formal)" },
          { chinese: "知遇之恩", pinyin: "zhī yù zhī ēn", english: "ơn tri ngộ" },
          { chinese: "铭记在心", pinyin: "míng jì zài xīn", english: "khắc ghi trong lòng" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em xin khẩn thỉnh thầy viết thư giới thiệu cho em. Ơn tri ngộ của thầy, em vĩnh viễn khắc ghi trong lòng.",
        chinese: "我恳请您为我写一封推荐信。您的知遇之恩, 我永远铭记在心。",
        pinyin: "Wǒ kěn qǐng nín wèi wǒ xiě yī fēng tuī jiàn xìn. Nín de zhī yù zhī ēn, wǒ yǒng yuǎn míng jì zài xīn."
      }
    ]
  },
  {
    id: 61,
    level: "B2",
    category: "study_career",
    title: "学术场合讨论研究兴趣",
    pinyin: "xué shù chǎng hé tǎo lùn yán jiū xìng qù",
    topic: "Discussing research interests in academic context",
    title_vi: "Thảo luận hướng nghiên cứu trong môi trường học thuật",
    title_en: "Discussing research interests in academic context",
    sentences: [
      {
        chinese: "我的研究兴趣主要集中在低资源语言的自然语言处理。",
        pinyin: "Wǒ de yánjiū xìngqù zhǔyào jízhōng zài dī zīyuán yǔyán de zìrán yǔyán chǔlǐ.",
        english: "My research interests mainly focus on NLP for low-resource languages.",
        vi: "Hướng nghiên cứu của em chủ yếu tập trung vào xử lý ngôn ngữ tự nhiên cho các ngôn ngữ ít tài nguyên.",
        pronunciation_focus: ["研究兴趣 → yánjiū xìngqù (hướng/sở thích nghiên cứu)", "集中 → jízhōng (tập trung)", "低资源语言 → dī zīyuán yǔyán", "自然语言处理 → zìrán yǔyán chǔlǐ (NLP)"]
      },
      {
        chinese: "具体来说, 我对越南语-中文跨语言迁移学习特别感兴趣。",
        pinyin: "Jùtǐ lái shuō, wǒ duì Yuènányǔ-zhōngwén kuà yǔyán qiānyí xuéxí tèbié gǎn xìngqù.",
        english: "Specifically, I am particularly interested in Vietnamese-Chinese cross-lingual transfer learning.",
        vi: "Cụ thể, em đặc biệt quan tâm đến học chuyển giao xuyên ngôn ngữ Việt-Trung.",
        pronunciation_focus: ["具体来说 → jùtǐ lái shuō (cụ thể là)", "跨语言 → kuà yǔyán (xuyên ngôn ngữ)", "迁移学习 → qiānyí xuéxí (transfer learning)", "感兴趣 → gǎn xìngqù"]
      },
      {
        chinese: "这一方向的学术价值在于填补越南语处理的数据空白。",
        pinyin: "Zhè yī fāngxiàng de xuéshù jiàzhí zàiyú tiánbǔ Yuènányǔ chǔlǐ de shùjù kòngbái.",
        english: "The academic value of this direction lies in filling the data gap for Vietnamese language processing.",
        vi: "Giá trị học thuật của hướng này nằm ở việc lấp đầy khoảng trống dữ liệu xử lý tiếng Việt.",
        pronunciation_focus: ["学术价值 → xuéshù jiàzhí (giá trị học thuật)", "填补 → tiánbǔ (lấp đầy)", "空白 → kòngbái (khoảng trống)", "在于 → zàiyú (nằm ở)"]
      },
      {
        chinese: "我希望能在博士阶段进一步深化这方面的探索。",
        pinyin: "Wǒ xīwàng néng zài bóshì jiēduàn jìn yī bù shēnhuà zhè fāngmiàn de tànsuǒ.",
        english: "I hope to further deepen exploration in this area during the PhD stage.",
        vi: "Em mong có thể đào sâu thêm hướng này ở giai đoạn tiến sĩ.",
        pronunciation_focus: ["博士阶段 → bóshì jiēduàn (giai đoạn tiến sĩ)", "深化 → shēnhuà (đào sâu)", "探索 → tànsuǒ (khám phá)", "进一步 → jìn yī bù"]
      },
      {
        chinese: "我会以锲而不舍的精神, 在这条学术道路上一以贯之。",
        pinyin: "Wǒ huì yǐ qiè ér bù shě de jīngshén, zài zhè tiáo xuéshù dàolù shàng yī yǐ guàn zhī.",
        english: "I will, with persevering spirit, stay consistent on this academic path.",
        vi: "Em sẽ với tinh thần kiên trì không bỏ cuộc, đi nhất quán trên con đường học thuật này.",
        pronunciation_focus: ["锲而不舍 → qiè ér bù shě (idiom 4 chữ: kiên trì)", "一以贯之 → yī yǐ guàn zhī (nhất quán xuyên suốt)", "学术道路 → xuéshù dàolù (con đường học thuật)", "精神 → jīngshén"]
      }
    ],
    vocab: [
      { chinese: "研究兴趣", pinyin: "yán jiū xìng qù", english: "research interest", vi: "hướng nghiên cứu / sở thích nghiên cứu" },
      { chinese: "学术", pinyin: "xué shù", english: "academic", vi: "học thuật" },
      { chinese: "课题", pinyin: "kè tí", english: "research topic", vi: "đề tài nghiên cứu" },
      { chinese: "前沿", pinyin: "qián yán", english: "frontier / cutting edge", vi: "tiền tuyến / mũi nhọn" },
      { chinese: "跨学科", pinyin: "kuà xué kē", english: "interdisciplinary", vi: "liên ngành" },
      { chinese: "学术道路", pinyin: "xué shù dào lù", english: "academic path", vi: "con đường học thuật" },
      { chinese: "锲而不舍", pinyin: "qiè ér bù shě", english: "persevere without giving up", vi: "kiên trì không bỏ cuộc" },
      { chinese: "一以贯之", pinyin: "yī yǐ guàn zhī", english: "consistent throughout", vi: "nhất quán xuyên suốt" },
      { chinese: "博古通今", pinyin: "bó gǔ tōng jīn", english: "well-versed in ancient and modern", vi: "thông cổ kim" },
      { chinese: "学贯中西", pinyin: "xué guàn zhōng xī", english: "learning spans East and West", vi: "học vấn xuyên Đông Tây" }
    ],
    dialogue: [
      { speaker: "教授", chinese: "请简要介绍一下您的研究兴趣。", pinyin: "Qǐng jiǎnyào jièshào yīxià nín de yánjiū xìngqù.", english: "Please briefly introduce your research interests.", vi: "Xin em giới thiệu ngắn gọn hướng nghiên cứu." },
      { speaker: "学生", chinese: "我的研究兴趣集中在低资源语言NLP, 特别是越南语处理。", pinyin: "Wǒ de yánjiū xìngqù jízhōng zài dī zīyuán yǔyán NLP, tèbié shì Yuènányǔ chǔlǐ.", english: "My research interests focus on low-resource language NLP, especially Vietnamese.", vi: "Hướng nghiên cứu của em tập trung vào NLP ngôn ngữ ít tài nguyên, đặc biệt là tiếng Việt." },
      { speaker: "教授", chinese: "为什么对这个方向感兴趣?", pinyin: "Wèishénme duì zhège fāngxiàng gǎn xìngqù?", english: "Why interested in this direction?", vi: "Sao em lại quan tâm hướng này?" },
      { speaker: "学生", chinese: "因为越南语数据资源稀缺, 这是我作为越南人最有优势的研究方向。", pinyin: "Yīnwèi Yuènányǔ shùjù zīyuán xīquē, zhè shì wǒ zuòwéi Yuènán rén zuì yǒu yōushì de yánjiū fāngxiàng.", english: "Because Vietnamese data is scarce, this is the direction where I have the most advantage as a Vietnamese person.", vi: "Vì tài nguyên dữ liệu tiếng Việt khan hiếm, đây là hướng em có lợi thế nhất với tư cách người Việt." }
    ],
    dialogue_long: [
      { speaker: "教授", chinese: "陈同学, 我想再深入了解一下您的研究兴趣。请详细说说。", pinyin: "Chén tóngxué, wǒ xiǎng zài shēnrù liǎojiě yīxià nín de yánjiū xìngqù. Qǐng xiángxì shuōshuo.", english: "Chen, I'd like to understand your research interests more deeply. Please elaborate.", vi: "Em Trần, thầy muốn tìm hiểu sâu hơn về hướng nghiên cứu của em. Em nói chi tiết đi." },
      { speaker: "学生", chinese: "我的核心兴趣是低资源语言的自然语言处理, 重点是越南语和中文之间的跨语言迁移学习。", pinyin: "Wǒ de héxīn xìngqù shì dī zīyuán yǔyán de zìrán yǔyán chǔlǐ, zhòngdiǎn shì Yuènányǔ hé zhōngwén zhī jiān de kuà yǔyán qiānyí xuéxí.", english: "My core interest is NLP for low-resource languages, focusing on Vietnamese-Chinese cross-lingual transfer learning.", vi: "Hướng cốt lõi của em là NLP ngôn ngữ ít tài nguyên, trọng tâm là học chuyển giao xuyên ngôn ngữ giữa tiếng Việt và tiếng Trung." },
      { speaker: "教授", chinese: "这两种语言虽然不同语系, 但有大量汉源词。您觉得这是优势还是挑战?", pinyin: "Zhè liǎng zhǒng yǔyán suīrán bùtóng yǔ xì, dàn yǒu dàliàng hàn yuán cí. Nín juéde zhè shì yōushì háishì tiǎozhàn?", english: "These two languages are from different families but share many Sino-origin words. Do you see this as advantage or challenge?", vi: "Hai ngôn ngữ này tuy khác hệ nhưng có nhiều từ Hán gốc. Em thấy đây là lợi thế hay thử thách?" },
      { speaker: "学生", chinese: "两者皆有。优势是词汇层面的迁移有锚点; 挑战是语法和语义已经分化, 直接迁移会引入噪声。", pinyin: "Liǎng zhě jiē yǒu. Yōushì shì cíhuì céngmiàn de qiānyí yǒu máodiǎn; tiǎozhàn shì yǔfǎ hé yǔyì yǐjīng fēnhuà, zhíjiē qiānyí huì yǐnrù zàoshēng.", english: "Both. Advantage: lexical-level transfer has anchor points. Challenge: syntax and semantics have diverged — direct transfer introduces noise.", vi: "Cả hai. Lợi thế: chuyển giao ở mức từ vựng có điểm neo. Thử thách: ngữ pháp và ngữ nghĩa đã phân hóa, chuyển trực tiếp sẽ tạo nhiễu." },
      { speaker: "教授", chinese: "好。那您打算用什么方法处理这种分化?", pinyin: "Hǎo. Nà nín dǎsuàn yòng shénme fāngfǎ chǔlǐ zhè zhǒng fēnhuà?", english: "Good. What method will you use to handle this divergence?", vi: "Tốt. Vậy em định dùng phương pháp gì để xử lý sự phân hóa này?" },
      { speaker: "学生", chinese: "我打算结合两个方向: 一是用对比学习对齐表征空间, 二是引入语言学知识做后处理。", pinyin: "Wǒ dǎsuàn jiéhé liǎng gè fāngxiàng: yī shì yòng duìbǐ xuéxí duìqí biǎozhēng kōngjiān, èr shì yǐnrù yǔyánxué zhīshi zuò hòu chǔlǐ.", english: "I plan to combine two directions: contrastive learning to align representation spaces, and linguistic knowledge for post-processing.", vi: "Em định kết hợp hai hướng: dùng đối chiếu học để căn chỉnh không gian biểu diễn, và đưa kiến thức ngôn ngữ học vào hậu xử lý." },
      { speaker: "教授", chinese: "听起来跨学科性比较强。您有语言学背景吗?", pinyin: "Tīng qǐlái kuà xuékē xìng bǐjiào qiáng. Nín yǒu yǔyánxué bèijǐng ma?", english: "Sounds quite interdisciplinary. Do you have a linguistics background?", vi: "Nghe có vẻ tính liên ngành cao. Em có nền tảng ngôn ngữ học không?" },
      { speaker: "学生", chinese: "我本科辅修过普通语言学, 也自学了汉越语言对比研究。这是我跨学科探索的基础。", pinyin: "Wǒ běnkē fǔxiū guò pǔtōng yǔyánxué, yě zìxué le hàn-yuè yǔyán duìbǐ yánjiū. Zhè shì wǒ kuà xuékē tànsuǒ de jīchǔ.", english: "I minored in general linguistics during undergrad and self-studied Sino-Vietnamese comparative research. This is the basis for my interdisciplinary exploration.", vi: "Đại học em phụ chuyên ngành ngôn ngữ học đại cương, cũng tự học nghiên cứu đối chiếu tiếng Việt-Hán. Đây là nền tảng khám phá liên ngành của em." },
      { speaker: "教授", chinese: "很好。您怎么看您这个方向五年之后的发展?", pinyin: "Hěn hǎo. Nín zěnme kàn nín zhège fāngxiàng wǔ nián zhī hòu de fāzhǎn?", english: "Good. How do you see the development of this direction in five years?", vi: "Tốt. Em nhìn nhận hướng này phát triển thế nào trong 5 năm tới?" },
      { speaker: "学生", chinese: "随着大模型时代的到来, 低资源语言会从边缘走到核心。中越合作的语言资源建设是其中关键的一环。", pinyin: "Suízhe dà móxíng shídài de dàolái, dī zīyuán yǔyán huì cóng biānyuán zǒu dào héxīn. Zhōng-yuè hézuò de yǔyán zīyuán jiànshè shì qízhōng guānjiàn de yī huán.", english: "With the era of large models, low-resource languages will move from periphery to core. China-Vietnam language resource construction is a key link.", vi: "Cùng với kỷ nguyên mô hình lớn, ngôn ngữ ít tài nguyên sẽ chuyển từ ngoại vi vào cốt lõi. Xây dựng tài nguyên ngôn ngữ Việt-Trung hợp tác là mắt xích quan trọng." },
      { speaker: "教授", chinese: "您的视野不错。最后一个问题: 如果未来研究遇到瓶颈, 您怎么应对?", pinyin: "Nín de shìyě bùcuò. Zuìhòu yī gè wèntí: rúguǒ wèilái yánjiū yùdào píngjǐng, nín zěnme yìngduì?", english: "Your vision is good. Last question: if your future research hits a bottleneck, how will you respond?", vi: "Tầm nhìn của em không tệ. Câu cuối: nếu nghiên cứu tương lai gặp bế tắc, em sẽ đối phó thế nào?" },
      { speaker: "学生", chinese: "我相信锲而不舍的精神。具体做法: 第一, 反思方法是否有偏差; 第二, 向同行请教; 第三, 必要时换角度从相邻领域寻找灵感。", pinyin: "Wǒ xiāngxìn qiè ér bù shě de jīngshén. Jùtǐ zuòfǎ: dì yī, fǎnsī fāngfǎ shìfǒu yǒu piānchā; dì èr, xiàng tóngháng qǐngjiào; dì sān, bìyào shí huàn jiǎodù cóng xiānglín lǐngyù xúnzhǎo línggǎn.", english: "I believe in persevering spirit. Specifically: first, reflect on whether method has bias; second, seek guidance from peers; third, when necessary change angle to find inspiration from adjacent fields.", vi: "Em tin vào tinh thần kiên trì không bỏ cuộc. Cụ thể: thứ nhất, phản tư xem phương pháp có lệch lạc không; thứ hai, xin ý kiến đồng nghiệp; thứ ba, khi cần đổi góc nhìn tìm cảm hứng từ lĩnh vực lân cận." },
      { speaker: "教授", chinese: "听到您说锲而不舍我很欣慰。学术之路需要的就是这种品质。", pinyin: "Tīng dào nín shuō qiè ér bù shě wǒ hěn xīnwèi. Xuéshù zhī lù xūyào de jiùshì zhè zhǒng pǐnzhì.", english: "Hearing you say 'persevering' makes me pleased. The academic path needs exactly this quality.", vi: "Nghe em nói kiên trì không bỏ cuộc, thầy rất an ủi. Con đường học thuật cần đúng phẩm chất này." },
      { speaker: "学生", chinese: "感谢您的肯定。我会在这条路上一以贯之, 不辜负您和家人的期望。", pinyin: "Gǎnxiè nín de kěndìng. Wǒ huì zài zhè tiáo lù shàng yī yǐ guàn zhī, bù gūfù nín hé jiārén de qīwàng.", english: "Thank you for your affirmation. I'll stay consistent on this path, not disappointing your and my family's expectations.", vi: "Cảm ơn thầy đã ghi nhận. Em sẽ đi nhất quán trên con đường này, không phụ kỳ vọng của thầy và gia đình." },
      { speaker: "教授", chinese: "好。您的研究计划等申请季再细化, 我们到时候再深入讨论。", pinyin: "Hǎo. Nín de yánjiū jìhuà děng shēnqǐng jì zài xìhuà, wǒmen dào shíhou zài shēnrù tǎolùn.", english: "Good. Refine your research plan as application season approaches; we'll discuss in depth then.", vi: "Được. Kế hoạch nghiên cứu của em chờ đến mùa ứng tuyển hãy chi tiết hóa, lúc đó mình thảo luận sâu hơn." },
      { speaker: "学生", chinese: "好的, 我会在两周内发您一份初版研究计划, 请您批评指正。", pinyin: "Hǎo de, wǒ huì zài liǎng zhōu nèi fā nín yī fèn chū bǎn yánjiū jìhuà, qǐng nín pīpíng zhǐzhèng.", english: "Sure, I'll send you an initial research plan within two weeks for your criticism and correction.", vi: "Vâng, em sẽ gửi thầy bản đầu tiên kế hoạch nghiên cứu trong hai tuần, xin thầy phê bình chỉ chính." },
      { speaker: "教授", chinese: "客气了。期待你的草稿。", pinyin: "Kèqì le. Qídài nǐ de cǎogǎo.", english: "Don't be too formal. Looking forward to your draft.", vi: "Khách sáo quá. Mong bản nháp của em." }
    ],
    roleplay_prompts: [
      "Đóng vai sinh viên trao đổi với giáo sư về việc CHUYỂN hướng nghiên cứu (từ NLP sang Computer Vision). Hãy giải thích lý do KHÔNG phải vì 'chán hướng cũ' mà là 'tìm thấy điểm giao thoa thú vị hơn'. Dùng cụm '深入思考之后' và '新的兴趣点'.",
      "Trong một workshop, bạn đứng trình bày 5 phút về hướng nghiên cứu của mình trước 20 nhà nghiên cứu Trung Quốc. Hãy chuẩn bị mở đầu hấp dẫn (1 con số/sự kiện gây chú ý), 3 điểm nội dung chính, kết thúc với câu hỏi mở để khán giả tham gia. Tránh đọc thuộc lòng.",
      "Một giáo sư chuyên ngành khác (vd: kinh tế học) hỏi về hướng nghiên cứu NLP của bạn. Hãy giải thích NLP cho người ngoài ngành — không dùng thuật ngữ chuyên môn, dùng analogy đời sống ('giống như dạy máy tính đọc và hiểu báo'), kết nối với mối quan tâm của họ ('NLP có thể phân tích tâm lý thị trường')."
    ],
    register_notes: "Thảo luận học thuật về hướng nghiên cứu là môi trường formal HỌC THUẬT — register hơi khác formal CÔNG SỞ. Các cụm chuyên môn phải dùng chuẩn xác, không thể paraphrase: 自然语言处理 (NLP), 迁移学习 (transfer learning), 表征空间 (representation space), 跨学科 (interdisciplinary). Sai từ chuyên môn = bị nghi không thực sự làm research.\n\n您 toàn bộ với giáo sư, kể cả nếu thầy bảo gọi 'Lão sư' — sinh viên nước ngoài giữ formal lâu hơn. Khi nói về mình: KHÔNG '我觉得' đơn giản; dùng '我认为' (formal hơn) hoặc '我个人的看法是' (theo quan điểm cá nhân của em là).\n\nCác cụm formal academic: mở đầu '我的研究兴趣主要集中在...' (research interests focus on); cụ thể hóa '具体来说...' (specifically); đánh giá giá trị '这一方向的学术价值在于...' (academic value lies in); kế hoạch dài hạn '我希望能在博士阶段进一步深化...' (deepen in PhD stage); thừa nhận thử thách '当然这一方向也有挑战, 主要是...' (admit challenges); câu kết '我会以X的精神, 在这条道路上一以贯之' (with X spirit, stay consistent).\n\nKhi giáo sư đặt câu hỏi khó/thách thức ('5 năm sau hướng này còn relevant không?'): KHÔNG phòng thủ. Cấu trúc trả lời: thừa nhận khó khăn + đưa ra góc nhìn lạc quan có cơ sở + thừa nhận giới hạn của mình. Đây là 'reasonable optimism' — phẩm chất researcher.",
    idiom_glosses: [
      {
        idiom: "锲而不舍",
        literal: "khắc mà không bỏ (qiè ér bù shě)",
        meaning: "Kiên trì không bỏ cuộc — như khắc đá không ngừng. Cụm cốt lõi cho thái độ research. Khi nói '我以锲而不舍的精神' = cam kết theo đuổi đề tài đến cùng. Đặc biệt phù hợp khi giáo sư hỏi về cách đối phó bottleneck.",
        example: "做研究最重要的是锲而不舍。"
      },
      {
        idiom: "一以贯之",
        literal: "một mà xuyên suốt (yī yǐ guàn zhī)",
        meaning: "Nhất quán xuyên suốt — không thay đổi hướng tùy hứng. Cụm dùng để cam kết theo đuổi một chủ đề lâu dài. Đối lập với 'flighty researcher' (đổi hướng liên tục) — phẩm chất xấu trong văn hóa academic Trung Quốc.",
        example: "我会在这条研究路上一以贯之。"
      },
      {
        idiom: "博古通今",
        literal: "thông cổ thông kim (bó gǔ tōng jīn)",
        meaning: "Hiểu rộng cả cổ kim — kiến thức bao quát cả lịch sử và hiện tại. Cụm khen học giả uyên bác. Có thể dùng để cam kết: '我希望能博古通今, 从经典中找新意'. Tránh tự khen mình bằng cụm này.",
        example: "希望能在学术上博古通今, 不局限于一时一域。"
      },
      {
        idiom: "学贯中西",
        literal: "học vấn xuyên Trung Tây (xué guàn zhōng xī)",
        meaning: "Học vấn xuyên cả phương Đông và phương Tây — kiến thức đa văn hóa. Cụm phù hợp đặc biệt cho sinh viên Việt Nam học ở Trung Quốc — làm cầu nối văn hóa. Cụm khen người giỏi cross-cultural.",
        example: "我希望未来能学贯中西, 把越中两国的语言学传统结合起来。"
      }
    ],
    cultural_notes_vi: "Thảo luận hướng nghiên cứu trong context Trung Quốc khác biệt với phương Tây ở bốn điểm: (1) Người Trung Quốc đặt giá trị cao vào 'long-term consistency' (一以贯之). Đổi hướng nghiên cứu giữa chừng = bị nghi 'không kiên định'. Khác Mỹ (nơi pivot được đánh giá cao). Vì vậy, khi giới thiệu hướng nghiên cứu: trình bày như một 'mạch logic' kéo dài 5-10 năm, không phải 'sở thích hiện tại'. (2) Trọng nguồn gốc kế thừa: hướng nghiên cứu của bạn nên được khung hóa trong dòng chảy học thuật — kế thừa ai, đóng góp gì mới. KHÔNG nói 'em có ý tưởng riêng' — sẽ bị coi là vô ơn. Nói '受X老师启发' (được khơi nguồn từ thầy X) hoặc '在Y研究的基础上' (trên nền tảng nghiên cứu của Y). (3) Tính ứng dụng quan trọng hơn ở Trung Quốc đại lục so với Mỹ. Research thuần lý thuyết khó tài trợ — luôn kết nối với 'ứng dụng thực tế', 'lợi ích quốc gia', 'hợp tác quốc tế'. Với sinh viên Việt Nam: kết nối với 'hợp tác Việt-Trung' = lý lẽ vàng để tài trợ. (4) 'Tính khả thi' (可行性) trọng hơn 'tính sáng tạo' (创新性). Một đề tài cực sáng tạo nhưng không khả thi trong 3-5 năm = bị từ chối. Một đề tài kế thừa nhưng cụ thể, khả thi, có dữ liệu sẵn = được chấp nhận.\n\nVề tính liên ngành (跨学科): Trung Quốc đại lục đang đẩy mạnh interdisciplinary research, đặc biệt 'AI + X' (X = ngành khác). Sinh viên Việt Nam có lợi thế: AI + ngôn ngữ học, AI + văn hóa Á Đông, AI + lịch sử Hán-Việt. Khai thác điều này khi trình bày hướng research.\n\nVề tone: KHÔNG quá mơ mộng ('em muốn thay đổi thế giới') — mộng tưởng. KHÔNG quá thực dụng ('em muốn sau này có việc làm tốt') — xa rời học thuật. Tone đúng: 'có ý nghĩa học thuật rõ + ứng dụng thực tế + bản thân có lợi thế'.",
    tip_advice_vi: "(1) Chuẩn bị 'pitch ladder' — câu trả lời 30 giây / 2 phút / 5 phút / 15 phút cho cùng câu hỏi 'hướng research của bạn là gì'. Tùy đối tượng và ngữ cảnh chọn phiên bản phù hợp. Đầu tư nhiều nhất vào bản 2 phút — dùng nhiều nhất. (2) Khi mô tả hướng research, dùng cấu trúc 'tổ chức kim tự tháp': câu đầu tiên = ý chính (1 câu); câu 2-3 = mở rộng (2-3 câu); câu 4-5 = chi tiết cụ thể (con số, ví dụ). Nói rõ ý chính TRƯỚC chi tiết — người Trung Quốc đặc biệt thích cấu trúc này. (3) Khi giáo sư đặt câu hỏi 'tại sao quan trọng?', LUÔN có 3 lý do trong tay: (a) lý do học thuật (lấp khoảng trống lý thuyết), (b) lý do ứng dụng (giải quyết vấn đề thực tế), (c) lý do cá nhân (lợi thế đặc biệt của bạn). Đừng chỉ có 1. (4) Khi không biết câu trả lời chuyên sâu, KHÔNG bịa. Nói '这个角度我之前没有深入考虑过, 但我可以从X的方向尝试回答' (góc này em chưa nghĩ sâu nhưng em có thể thử từ hướng X). Sự thật + cố gắng > bịa. (5) Sau cuộc trao đổi, gửi email cảm ơn trong 24h kèm 'tiếp theo em sẽ': cụ thể 2-3 việc + deadline. Đây là 'closing the loop' chuẩn academic. (6) Đọc 5-10 paper mới nhất của giáo sư trước khi gặp. Đề cập một paper cụ thể trong cuộc trao đổi: '看了您去年那篇关于X的论文, 我特别认同Y的观点'. Đây là dấu hiệu mạnh nhất bạn nghiêm túc. (7) Mẹo phát âm cuối: '锲而不舍' (qiè ér bù shě) — qiè thanh 4 (xuống), shě thanh 3. Sai thanh = nghe nhầm '切' (cắt), thay đổi nghĩa hoàn toàn. Tập đọc to trước cuộc gặp.",
    exercises: [
      { type: "fill-blank", question: "我会在这条学术道路上 ___ , 不会半途而废。", answer: "一以贯之" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung học thuật với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "研究兴趣", pinyin: "yán jiū xìng qù", english: "hướng nghiên cứu" },
          { chinese: "跨学科", pinyin: "kuà xué kē", english: "liên ngành" },
          { chinese: "锲而不舍", pinyin: "qiè ér bù shě", english: "kiên trì không bỏ cuộc" },
          { chinese: "学贯中西", pinyin: "xué guàn zhōng xī", english: "học vấn xuyên Đông Tây" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Hướng nghiên cứu của em tập trung vào học chuyển giao xuyên ngôn ngữ Việt-Trung. Em sẽ với tinh thần kiên trì không bỏ cuộc, đi nhất quán trên con đường học thuật này.",
        chinese: "我的研究兴趣集中在越南语-中文跨语言迁移学习。我会以锲而不舍的精神, 在这条学术道路上一以贯之。",
        pinyin: "Wǒ de yán jiū xìng qù jí zhōng zài Yuè nán yǔ-zhōng wén kuà yǔ yán qiān yí xué xí. Wǒ huì yǐ qiè ér bù shě de jīng shén, zài zhè tiáo xué shù dào lù shàng yī yǐ guàn zhī."
      }
    ]
  },
  {
    id: 62,
    level: "B2",
    category: "cultural_communication",
    title: "中国老板来越南视察",
    pinyin: "zhōng guó lǎo bǎn lái yuè nán shì chá",
    topic: "Chinese boss visits Vietnam office",
    title_vi: "Sếp Trung Quốc đến thăm văn phòng Việt Nam",
    title_en: "Chinese boss visits Vietnam office",
    sentences: [
      {
        chinese: "李总, 您一路辛苦了, 欢迎您来河内。",
        pinyin: "Lǐ zǒng, nín yī lù xīnkǔ le, huānyíng nín lái Hénèi.",
        english: "Director Li, you've had a long journey — welcome to Hanoi.",
        vi: "Tổng Lý, anh đi đường vất vả rồi, hoan nghênh anh đến Hà Nội.",
        pronunciation_focus: ["李总 → Lǐ zǒng (họ + 总 — chức danh tổng giám đốc)", "一路辛苦 → yī lù xīnkǔ (cụm chuẩn đón khách đi xa)", "欢迎 → huānyíng (hoan nghênh)", "河内 → Hénèi"]
      },
      {
        chinese: "我已经为您安排了酒店, 离办公室步行五分钟。",
        pinyin: "Wǒ yǐjīng wèi nín ānpái le jiǔdiàn, lí bàngōngshì bùxíng wǔ fēnzhōng.",
        english: "I've already arranged a hotel for you, five minutes' walk from the office.",
        vi: "Em đã sắp xếp khách sạn cho anh, cách văn phòng đi bộ năm phút.",
        pronunciation_focus: ["安排 → ānpái (sắp xếp)", "酒店 → jiǔdiàn (khách sạn — formal hơn 旅馆)", "步行 → bùxíng (đi bộ)", "办公室 → bàngōngshì"]
      },
      {
        chinese: "今天晚上我们订了一家越南菜馆, 让您体验地道的越南菜。",
        pinyin: "Jīntiān wǎnshàng wǒmen dìng le yī jiā Yuènán cài guǎn, ràng nín tǐyàn dìdao de Yuènán cài.",
        english: "Tonight we've booked a Vietnamese restaurant for you to experience authentic Vietnamese cuisine.",
        vi: "Tối nay bọn em đã đặt một nhà hàng Việt để anh trải nghiệm món ăn Việt chính gốc.",
        pronunciation_focus: ["地道 → dìdao (chính gốc/đúng kiểu)", "体验 → tǐyàn (trải nghiệm)", "菜馆 → cài guǎn (nhà hàng)", "今天晚上 → jīntiān wǎnshàng"]
      },
      {
        chinese: "如果您有什么需要, 随时联系我, 我手机不关机。",
        pinyin: "Rúguǒ nín yǒu shénme xūyào, suíshí liánxì wǒ, wǒ shǒujī bù guānjī.",
        english: "If you need anything, contact me anytime — my phone stays on.",
        vi: "Nếu anh cần gì, cứ liên hệ em bất cứ lúc nào, điện thoại em không tắt máy.",
        pronunciation_focus: ["随时 → suíshí (bất cứ lúc nào)", "联系 → liánxì (liên hệ)", "手机 → shǒujī (điện thoại)", "关机 → guānjī (tắt máy)"]
      },
      {
        chinese: "希望您这次访问越南办公室一切顺利, 宾至如归。",
        pinyin: "Xīwàng nín zhè cì fǎngwèn Yuènán bàngōngshì yīqiè shùnlì, bīn zhì rú guī.",
        english: "I hope your visit to the Vietnam office goes smoothly and you feel at home.",
        vi: "Mong chuyến thăm văn phòng Việt Nam của anh thuận lợi mọi mặt, như ở nhà.",
        pronunciation_focus: ["访问 → fǎngwèn (thăm/viếng)", "宾至如归 → bīn zhì rú guī (idiom 4 chữ: khách đến như về nhà)", "顺利 → shùnlì (thuận lợi)", "一切 → yīqiè"]
      }
    ],
    vocab: [
      { chinese: "视察", pinyin: "shì chá", english: "to inspect (formal visit)", vi: "thị sát / thăm kiểm tra" },
      { chinese: "接待", pinyin: "jiē dài", english: "to receive (guests)", vi: "tiếp đón" },
      { chinese: "一路辛苦", pinyin: "yī lù xīn kǔ", english: "long journey (greeting)", vi: "vất vả đường xa" },
      { chinese: "酒店", pinyin: "jiǔ diàn", english: "hotel", vi: "khách sạn" },
      { chinese: "行程", pinyin: "xíng chéng", english: "itinerary", vi: "lịch trình" },
      { chinese: "陪同", pinyin: "péi tóng", english: "to accompany", vi: "tháp tùng" },
      { chinese: "翻译", pinyin: "fān yì", english: "translator / to translate", vi: "phiên dịch" },
      { chinese: "宾至如归", pinyin: "bīn zhì rú guī", english: "guests feel at home (4-char idiom)", vi: "khách đến như về nhà" },
      { chinese: "入乡随俗", pinyin: "rù xiāng suí sú", english: "when in Rome (4-char idiom)", vi: "nhập gia tùy tục" },
      { chinese: "远来是客", pinyin: "yuǎn lái shì kè", english: "those who come from afar are guests", vi: "khách phương xa là khách quý" }
    ],
    dialogue: [
      { speaker: "黎", chinese: "李总, 欢迎您来河内! 一路辛苦了。", pinyin: "Lǐ zǒng, huānyíng nín lái Hénèi! Yī lù xīnkǔ le.", english: "Director Li, welcome to Hanoi! Long journey, huh.", vi: "Tổng Lý, hoan nghênh anh đến Hà Nội! Đi đường vất vả rồi." },
      { speaker: "李总", chinese: "谢谢小黎, 终于到了。河内比我想象中还要热闹。", pinyin: "Xièxie Xiǎo Lí, zhōngyú dào le. Hénèi bǐ wǒ xiǎngxiàng zhōng hái yào rènao.", english: "Thanks Little Le, finally here. Hanoi is even livelier than I imagined.", vi: "Cảm ơn Tiểu Lê, cuối cùng đến rồi. Hà Nội còn náo nhiệt hơn anh tưởng." },
      { speaker: "黎", chinese: "您先到酒店休息, 行李我让司机送过去。", pinyin: "Nín xiān dào jiǔdiàn xiūxi, xínglǐ wǒ ràng sījī sòng guòqù.", english: "Please rest at the hotel first; I'll have the driver bring your luggage.", vi: "Anh đến khách sạn nghỉ trước, hành lý em bảo lái xe đưa qua." },
      { speaker: "李总", chinese: "好, 谢谢你的安排。今晚的安排是什么?", pinyin: "Hǎo, xièxie nǐ de ānpái. Jīn wǎn de ānpái shì shénme?", english: "Good, thanks for arranging. What's planned for tonight?", vi: "Được, cảm ơn em đã sắp xếp. Tối nay có chương trình gì?" }
    ],
    dialogue_long: [
      { speaker: "黎", chinese: "李总! 这边请, 我已经在出口等您了。一路辛苦了!", pinyin: "Lǐ zǒng! Zhè biān qǐng, wǒ yǐjīng zài chūkǒu děng nín le. Yī lù xīnkǔ le!", english: "Director Li! This way please, I've been waiting at the exit. Long journey!", vi: "Tổng Lý! Mời anh đi lối này, em đã đợi anh ở lối ra. Đi đường vất vả rồi!" },
      { speaker: "李总", chinese: "小黎, 有劳你来接机。河内的天气比我想象中凉爽。", pinyin: "Xiǎo Lí, yǒuláo nǐ lái jiējī. Hénèi de tiānqì bǐ wǒ xiǎngxiàng zhōng liángshuǎng.", english: "Little Le, sorry to trouble you to pick me up. Hanoi's weather is cooler than I imagined.", vi: "Tiểu Lê, làm phiền em ra đón. Thời tiết Hà Nội mát hơn anh tưởng." },
      { speaker: "黎", chinese: "现在是十一月, 河内已经入秋了, 气温二十多度。司机已经在停车场等我们。", pinyin: "Xiànzài shì shíyī yuè, Hénèi yǐjīng rùqiū le, qìwēn èrshí duō dù. Sījī yǐjīng zài tíngchēchǎng děng wǒmen.", english: "It's November now, Hanoi has entered autumn, around 20-something degrees. Driver's already waiting at the parking lot.", vi: "Tháng 11 rồi, Hà Nội đã vào thu, nhiệt độ hơn 20 độ. Lái xe đã đợi mình ở bãi đậu." },
      { speaker: "李总", chinese: "好的。这次我打算待五天, 重点看一下我们越南办公室的运营。", pinyin: "Hǎo de. Zhè cì wǒ dǎsuàn dāi wǔ tiān, zhòngdiǎn kàn yīxià wǒmen Yuènán bàngōngshì de yùnyíng.", english: "Good. This time I plan to stay five days, focusing on our Vietnam office operations.", vi: "Được. Lần này anh định ở năm ngày, trọng tâm xem vận hành văn phòng Việt Nam." },
      { speaker: "黎", chinese: "我已经把行程发到您微信。明天上午十点办公室开欢迎会, 下午跟客户见面。", pinyin: "Wǒ yǐjīng bǎ xíngchéng fā dào nín wēixìn. Míngtiān shàngwǔ shí diǎn bàngōngshì kāi huānyíng huì, xiàwǔ gēn kèhù jiànmiàn.", english: "I've sent the itinerary to your WeChat. Tomorrow 10am welcome meeting at the office, afternoon meet clients.", vi: "Em đã gửi lịch trình vào WeChat của anh. Mai 10 giờ sáng họp chào mừng tại văn phòng, chiều gặp khách hàng." },
      { speaker: "李总", chinese: "客户是哪几位?", pinyin: "Kèhù shì nǎ jǐ wèi?", english: "Which clients?", vi: "Khách hàng là những vị nào?" },
      { speaker: "黎", chinese: "Vingroup的范总和VNPay的陈总。两位都很期待和您见面。", pinyin: "Vingroup de Fàn zǒng hé VNPay de Chén zǒng. Liǎng wèi dōu hěn qídài hé nín jiànmiàn.", english: "Director Pham of Vingroup and Director Tran of VNPay. Both are looking forward to meeting you.", vi: "Tổng Phạm của Vingroup và Tổng Trần của VNPay. Cả hai đều rất mong gặp anh." },
      { speaker: "李总", chinese: "好。今天晚上是否有安排?", pinyin: "Hǎo. Jīntiān wǎnshàng shìfǒu yǒu ānpái?", english: "Good. Anything planned for tonight?", vi: "Được. Tối nay có lịch không?" },
      { speaker: "黎", chinese: "今晚我们订了一家正宗的越南河粉店, 让您体验地道的越南菜。如果您累了, 我们也可以改去酒店餐厅。", pinyin: "Jīn wǎn wǒmen dìng le yī jiā zhèngzōng de Yuènán héfěn diàn, ràng nín tǐyàn dìdao de Yuènán cài. Rúguǒ nín lèi le, wǒmen yě kěyǐ gǎi qù jiǔdiàn cāntīng.", english: "Tonight we've booked an authentic pho restaurant for you to experience real Vietnamese food. If you're tired, we can switch to the hotel restaurant.", vi: "Tối nay bọn em đã đặt quán phở Việt chính gốc để anh trải nghiệm món Việt thật. Nếu anh mệt, có thể đổi sang nhà hàng khách sạn." },
      { speaker: "李总", chinese: "不累不累, 河粉听起来不错! 中国人来越南就要吃越南河粉嘛。入乡随俗。", pinyin: "Bù lèi bù lèi, héfěn tīng qǐlái bùcuò! Zhōngguó rén lái Yuènán jiùyào chī Yuènán héfěn ma. Rù xiāng suí sú.", english: "Not tired at all, pho sounds great! Chinese coming to Vietnam should eat Vietnamese pho. When in Rome.", vi: "Không mệt, không mệt, phở nghe hay đấy! Người Trung đến Việt Nam phải ăn phở Việt chứ. Nhập gia tùy tục mà." },
      { speaker: "黎", chinese: "您说得对。河粉是越南最有名的菜, 您一定要尝。喝点鱼露和柠檬水, 越南人就是这样吃的。", pinyin: "Nín shuō de duì. Héfěn shì Yuènán zuì yǒumíng de cài, nín yīdìng yào cháng. Hē diǎn yúlù hé níngméng shuǐ, Yuènán rén jiùshì zhèyàng chī de.", english: "You're right. Pho is Vietnam's most famous dish — you must try it. With fish sauce and lime juice, that's how Vietnamese eat it.", vi: "Anh nói đúng. Phở là món nổi tiếng nhất Việt Nam, anh phải nếm. Thêm chút nước mắm và nước chanh, người Việt ăn thế đấy." },
      { speaker: "李总", chinese: "鱼露? 我听说过, 第一次尝试。希望我胃口能适应。", pinyin: "Yúlù? Wǒ tīngshuō guò, dì yī cì chángshì. Xīwàng wǒ wèikǒu néng shìyìng.", english: "Fish sauce? I've heard of it, first time trying. Hope my stomach can adapt.", vi: "Nước mắm? Anh nghe rồi, lần đầu thử. Hy vọng dạ dày anh thích nghi được." },
      { speaker: "黎", chinese: "您放心, 我会让餐厅做得清淡一些。如果不习惯, 我们再点别的。", pinyin: "Nín fàngxīn, wǒ huì ràng cāntīng zuò de qīngdàn yīxiē. Rúguǒ bù xíguàn, wǒmen zài diǎn biéde.", english: "Don't worry, I'll have the restaurant make it lighter. If you can't adapt, we'll order something else.", vi: "Anh yên tâm, em sẽ bảo nhà hàng làm nhẹ hơn. Nếu không quen, mình gọi món khác." },
      { speaker: "李总", chinese: "你想得真周到。明天看完办公室之后, 后天能否安排我们一起去看看Vingroup的VinFast工厂?", pinyin: "Nǐ xiǎng de zhēn zhōudào. Míngtiān kàn wán bàngōngshì zhīhòu, hòutiān néng fǒu ānpái wǒmen yīqǐ qù kànkàn Vingroup de VinFast gōngchǎng?", english: "You think of everything. After tomorrow's office visit, can we arrange to see Vingroup's VinFast factory the day after?", vi: "Em chu đáo thật. Sau khi xem văn phòng mai, ngày kia có thể sắp xếp mình cùng đi xem nhà máy VinFast của Vingroup không?" },
      { speaker: "黎", chinese: "我已经联系范总了, 后天上午九点参观工厂, 中午范总请我们吃饭。", pinyin: "Wǒ yǐjīng liánxì Fàn zǒng le, hòutiān shàngwǔ jiǔ diǎn cānguān gōngchǎng, zhōngwǔ Fàn zǒng qǐng wǒmen chīfàn.", english: "I've already contacted Director Pham — day after tomorrow 9am tour the factory, noon Director Pham hosts us for lunch.", vi: "Em đã liên hệ Tổng Phạm rồi, ngày kia 9 giờ sáng tham quan nhà máy, trưa Tổng Phạm mời mình ăn cơm." },
      { speaker: "李总", chinese: "太好了, 你提前都安排好了。我这次访问肯定会很顺利。希望宾至如归吧!", pinyin: "Tài hǎo le, nǐ tíqián dōu ānpái hǎo le. Wǒ zhè cì fǎngwèn kěndìng huì hěn shùnlì. Xīwàng bīn zhì rú guī ba!", english: "Excellent, you've arranged everything in advance. This visit will definitely go smoothly. Hope to feel at home!", vi: "Tuyệt quá, em đã sắp xếp xong từ trước. Chuyến thăm này chắc chắn thuận lợi. Mong được như ở nhà!" }
    ],
    roleplay_prompts: [
      "Đóng vai bạn — quản lý văn phòng Việt Nam — đón sếp Trung Quốc tại sân bay. Hãy chuẩn bị câu mở đầu '一路辛苦了', tự nhận đồ cho khách, đề xuất lịch trình 5 phút đầu (xe → khách sạn → nghỉ → tối ăn). Tránh câu hỏi mệt mỏi như 'mệt không' — sếp sẽ luôn nói 'không mệt'.",
      "Sếp Trung Quốc bất ngờ muốn đi xem 'phố cổ' (Old Quarter) thay vì lịch họp ban đầu. Hãy điều chỉnh khéo: xác nhận yêu cầu + dời lịch họp (gọi báo bên kia) + đi cùng + giải thích lịch sử Hà Nội đơn giản. Tránh nói 'không thể' — luôn 'để em sắp xếp'.",
      "Trên đường về khách sạn, sếp hỏi 'Việt Nam có giống Trung Quốc không?'. Đây là câu hỏi tế nhị. Hãy trả lời cân bằng: thừa nhận điểm chung văn hóa + đề cao đặc sắc Việt Nam + tránh so sánh hơn-kém. Dùng cụm '同根同源, 各有千秋'."
    ],
    register_notes: "Đón sếp/khách Trung Quốc đến Việt Nam có register đặc biệt — formal nhưng ấm áp, cấp dưới đón cấp trên. 您 toàn bộ với sếp, kể cả nếu thân quen. Cách gọi: '李总' (Lý zǒng — họ + chức danh) là chuẩn nhất; nếu sếp trẻ và đề nghị, có thể '小李' (chỉ khi sếp tự đề nghị) — nhưng sinh viên/nhân viên Việt Nam tốt nhất giữ '总'.\n\nCác cụm chuẩn đón khách: '一路辛苦了' (yī lù xīnkǔ le — đi đường vất vả) — câu đầu tiên BẮT BUỘC, không được bỏ qua, kể cả khách bay 2 tiếng; '欢迎您来X' (huānyíng nín lái X — hoan nghênh anh đến X); '我已经为您安排了...' (wǒ yǐjīng wèi nín ānpái le... — em đã sắp xếp cho anh...); '宾至如归' (bīn zhì rú guī — khách đến như về nhà — câu cuối lý tưởng); '入乡随俗' (rù xiāng suí sú — nhập gia tùy tục — khi giới thiệu món/phong tục Việt).\n\nKhi đề xuất chương trình: KHÔNG dùng '你想做什么' (anh muốn làm gì — quá đẩy việc cho khách). Dùng '我已经为您安排了X, 您看可以吗?' (em đã sắp xếp X cho anh, anh thấy được không?). Sếp Trung Quốc thích chủ nhà chủ động đề xuất, không thích phải tự lên lịch.\n\nKhi sếp yêu cầu thay đổi: KHÔNG '不行, 已经安排好了' (không được, đã sắp xếp rồi). Dùng '没问题, 我马上调整' (không vấn đề, em điều chỉnh ngay). Linh hoạt là phẩm chất số 1 của host Trung Quốc.\n\nTránh: (a) Hỏi 'mệt không' — gây áp lực vô ích; (b) Để khách tự xách hành lý — phản cảm; (c) Quên đặt nước trong xe — chi tiết nhỏ tạo ấn tượng lớn.",
    idiom_glosses: [
      {
        idiom: "宾至如归",
        literal: "khách đến như về nhà (bīn zhì rú guī)",
        meaning: "Khách cảm thấy như đang ở nhà của mình — sự tiếp đãi chu đáo nhất. Cụm chuẩn để host kết thúc lời chào hoặc cam kết: '希望您宾至如归'. Đây là tiêu chuẩn vàng của tiếp khách Trung Quốc.",
        example: "希望您这次访问宾至如归。"
      },
      {
        idiom: "入乡随俗",
        literal: "vào làng theo lệ (rù xiāng suí sú)",
        meaning: "Đến đâu theo phong tục đó — nhập gia tùy tục. Sếp Trung Quốc dùng khi sẵn sàng thử món/phong tục Việt. Bạn dùng khi giới thiệu phong tục Việt Nam: '在越南我们这样做, 入乡随俗嘛'.",
        example: "中国人来越南就要吃越南河粉, 入乡随俗。"
      },
      {
        idiom: "远来是客",
        literal: "đến từ xa là khách (yuǎn lái shì kè)",
        meaning: "Người đến từ xa đều là khách quý — phải tiếp đãi tận tình. Triết lý gốc của tiếp khách Trung Quốc/Việt Nam. Dùng khi giải thích vì sao bạn dành nhiều thời gian/nguồn lực cho khách.",
        example: "远来是客, 您怎么也得让我们好好招待。"
      },
      {
        idiom: "主随客便",
        literal: "chủ tùy theo khách (zhǔ suí kè biàn)",
        meaning: "Chủ nhà tùy theo ý khách — linh hoạt theo mong muốn của khách. Dùng khi đưa ra lựa chọn cho khách: '主随客便, 您喜欢吃什么我们就吃什么'. Đối lập với 'chủ áp đặt khách'.",
        example: "主随客便, 您想去哪里我们就去哪里。"
      }
    ],
    cultural_notes_vi: "Tiếp đón sếp/khách Trung Quốc đến Việt Nam là 'bài kiểm tra' đầu tiên về năng lực quan hệ của bạn trong mắt sếp. Văn hóa hospitality Trung Quốc khác Việt Nam ở năm điểm: (1) HOST CHỦ ĐỘNG, không hỏi khách. Khách Trung Quốc đến Việt Nam mong bạn lên lịch sẵn sàng (giờ ăn, nơi ăn, di chuyển, mua sắm) — không mong họ tự quyết định. Khác Mỹ (nơi 'free time' là điều tốt), Trung Quốc 'free time' = chủ nhà thiếu chuẩn bị. (2) Tần suất check-in cao: gọi/nhắn mỗi sáng để xác nhận lịch, mỗi tối hỏi 'hôm nay thế nào'. Sếp Trung Quốc cảm thấy được quan tâm khi bạn check-in nhiều, không bị làm phiền. (3) Mời ăn trưa + tối là CHUẨN — khác phương Tây (chỉ một bữa). 5 ngày ở Việt Nam = 10 bữa ăn cùng host. Lên kế hoạch trước: bữa pho, bữa bún chả, bữa hải sản, bữa Trung-Việt fusion. (4) Quà chia tay từ phía host (không phải khách): chuẩn bị quà nhỏ đặc sản Việt (cà phê G7, bánh đậu xanh, lụa Vạn Phúc) để gửi sếp khi tạm biệt. Tổng giá trị 200-500 nhân dân tệ là phù hợp. (5) Sau khi sếp về Trung Quốc, nhắn WeChat trong 24 giờ: '李总, 您一路平安到家了吗?' — đây là 'closing the loop' chuẩn quan hệ Trung Quốc.\n\nKhác biệt Việt-Trung trong tiếp khách: ở Việt Nam, host có thể 'thân mật' với khách (dùng 'em', 'anh' nhanh chóng); ở Trung Quốc 'thân mật' phải có quá trình. Đừng vội xưng hô thân với sếp Trung Quốc dù họ tỏ ra dễ tính.\n\nVề lịch trình: sếp Trung Quốc đến công tác thường có nhịp điệu '工作 + 应酬 + 放松' (làm việc + xã giao + thư giãn) — cứ 60% công việc, 30% xã giao (ăn uống), 10% thư giãn (mua sắm/tham quan). Đừng nhồi 100% công việc — sếp sẽ mệt và khó chịu.",
    tip_advice_vi: "(1) ĐÓN tại sân bay — không bao giờ để sếp tự bắt taxi. Đứng ngay tại lối ra arrivals với bảng tên hoặc gọi điện hướng dẫn. Sếp Trung Quốc đặc biệt nhớ chi tiết này. (2) Chuẩn bị 'welcome kit' trong xe: chai nước khoáng, khăn lạnh, kẹo nhỏ, sạc dự phòng. Đây là chi tiết rất ít người Việt làm — gây ấn tượng mạnh. (3) Đặt khách sạn TRƯỚC, gửi check-in confirmation cho sếp qua WeChat 1 ngày trước. KHÔNG để sếp phải hỏi 'tôi ở khách sạn nào'. Khách sạn 4-5 sao gần văn phòng + có dịch vụ tiếng Trung là lý tưởng. (4) Bữa ăn đầu tiên: chọn món Việt có vị nhẹ (phở, bún chả, gỏi cuốn) — KHÔNG mắm tôm/bún đậu (mùi mạnh, sếp Trung Quốc khó chịu lần đầu). Lần 2-3 mới giới thiệu món mạnh hơn. (5) Trong các bữa ăn: ngồi cùng phía với sếp (không đối diện qua bàn lớn), dịch món ăn cho sếp, gọi đồ uống thay sếp (nước trà nóng là an toàn). (6) Tránh chủ đề tế nhị trong bữa ăn: chính trị (Việt-Trung-Mỹ), lịch sử (1979, Hoàng Sa, Trường Sa), tôn giáo. Nếu sếp khơi mào, chuyển chủ đề bằng '这个比较复杂, 我们改天聊'. Tập trung vào: ẩm thực, du lịch, công việc, gia đình (nếu sếp chia sẻ trước). (7) Sau khi sếp về, 24 giờ sau gửi WeChat: '李总, 您一路平安回到中国了吗? 这次访问越南办公室辛苦了!' — kèm 1 ảnh đẹp đã chụp. Đây là follow-up vàng.",
    exercises: [
      { type: "fill-blank", question: "李总, 您一路 ___ 了, 欢迎您来河内。", answer: "辛苦" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung tiếp khách với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "一路辛苦", pinyin: "yī lù xīn kǔ", english: "vất vả đường xa (đón khách)" },
          { chinese: "宾至如归", pinyin: "bīn zhì rú guī", english: "khách đến như về nhà" },
          { chinese: "入乡随俗", pinyin: "rù xiāng suí sú", english: "nhập gia tùy tục" },
          { chinese: "陪同", pinyin: "péi tóng", english: "tháp tùng" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Anh đi đường vất vả rồi, hoan nghênh anh đến Hà Nội. Em đã sắp xếp khách sạn cho anh, mong anh ở Việt Nam như ở nhà.",
        chinese: "您一路辛苦了, 欢迎您来河内。我已经为您安排了酒店, 希望您在越南宾至如归。",
        pinyin: "Nín yī lù xīn kǔ le, huān yíng nín lái Hé nèi. Wǒ yǐ jīng wèi nín ān pái le jiǔ diàn, xī wàng nín zài Yuè nán bīn zhì rú guī."
      }
    ]
  },
  {
    id: 63,
    level: "B2",
    category: "cultural_communication",
    title: "在越南接待中国客户",
    pinyin: "zài yuè nán jiē dài zhōng guó kè hù",
    topic: "Hosting Chinese business client in Vietnam",
    title_vi: "Tiếp khách hàng Trung Quốc tại Việt Nam",
    title_en: "Hosting a Chinese business client in Vietnam",
    sentences: [
      {
        chinese: "王总, 非常感谢您选择我们公司作为合作伙伴。",
        pinyin: "Wáng zǒng, fēicháng gǎnxiè nín xuǎnzé wǒmen gōngsī zuòwéi hézuò huǒbàn.",
        english: "Director Wang, thank you so much for choosing our company as your partner.",
        vi: "Tổng Vương, em vô cùng cảm ơn anh đã chọn công ty chúng em làm đối tác.",
        pronunciation_focus: ["合作伙伴 → hézuò huǒbàn (đối tác)", "选择 → xuǎnzé (chọn)", "作为 → zuòwéi (làm/với tư cách)", "感谢 → gǎnxiè"]
      },
      {
        chinese: "今天我们安排参观工厂, 然后晚上在海鲜餐厅一起用餐。",
        pinyin: "Jīntiān wǒmen ānpái cānguān gōngchǎng, ránhòu wǎnshàng zài hǎixiān cāntīng yīqǐ yòngcān.",
        english: "Today we've arranged a factory tour, then dinner at a seafood restaurant tonight.",
        vi: "Hôm nay bọn em sắp xếp tham quan nhà máy, sau đó tối ăn cùng ở nhà hàng hải sản.",
        pronunciation_focus: ["参观 → cānguān (tham quan)", "工厂 → gōngchǎng (nhà máy)", "海鲜 → hǎixiān (hải sản)", "用餐 → yòngcān (dùng bữa — formal)"]
      },
      {
        chinese: "希望这次合作能让双方都受益, 互利共赢。",
        pinyin: "Xīwàng zhè cì hézuò néng ràng shuāngfāng dōu shòuyì, hùlì gòngyíng.",
        english: "Hope this cooperation benefits both sides — mutual benefit, win-win.",
        vi: "Mong hợp tác này hai bên cùng có lợi.",
        pronunciation_focus: ["双方 → shuāngfāng (hai bên)", "受益 → shòuyì (được lợi)", "互利共赢 → hùlì gòngyíng (đôi bên cùng có lợi)", "合作 → hézuò"]
      },
      {
        chinese: "如果您对我们的产品有任何意见, 请直接告诉我们。",
        pinyin: "Rúguǒ nín duì wǒmen de chǎnpǐn yǒu rènhé yìjiàn, qǐng zhíjiē gàosu wǒmen.",
        english: "If you have any feedback on our products, please tell us directly.",
        vi: "Nếu anh có ý kiến nào về sản phẩm của bọn em, xin nói thẳng với bọn em.",
        pronunciation_focus: ["产品 → chǎnpǐn (sản phẩm)", "意见 → yìjiàn (ý kiến)", "直接 → zhíjiē (trực tiếp)", "告诉 → gàosu"]
      },
      {
        chinese: "礼尚往来, 下次您来河内, 一定让我做东。",
        pinyin: "Lǐ shàng wǎng lái, xià cì nín lái Hénèi, yīdìng ràng wǒ zuò dōng.",
        english: "Courtesy demands reciprocity — next time you come to Hanoi, please let me host.",
        vi: "Có qua có lại, lần sau anh đến Hà Nội, nhất định để em làm chủ.",
        pronunciation_focus: ["礼尚往来 → lǐ shàng wǎng lái (idiom: có qua có lại)", "做东 → zuò dōng (làm chủ — đãi khách)", "下次 → xià cì (lần sau)", "一定 → yīdìng"]
      }
    ],
    vocab: [
      { chinese: "客户", pinyin: "kè hù", english: "client", vi: "khách hàng" },
      { chinese: "合作伙伴", pinyin: "hé zuò huǒ bàn", english: "business partner", vi: "đối tác" },
      { chinese: "做东", pinyin: "zuò dōng", english: "to host (a meal)", vi: "làm chủ tiệc / mời" },
      { chinese: "招待", pinyin: "zhāo dài", english: "to receive / entertain", vi: "tiếp đãi" },
      { chinese: "签合同", pinyin: "qiān hé tóng", english: "to sign contract", vi: "ký hợp đồng" },
      { chinese: "互利共赢", pinyin: "hù lì gòng yíng", english: "win-win", vi: "đôi bên cùng có lợi" },
      { chinese: "礼尚往来", pinyin: "lǐ shàng wǎng lái", english: "courtesy demands reciprocity", vi: "có qua có lại" },
      { chinese: "投桃报李", pinyin: "tóu táo bào lǐ", english: "give peach, return plum (mutual gift)", vi: "ném đào nhận mận — đáp lễ" },
      { chinese: "一视同仁", pinyin: "yī shì tóng rén", english: "treat equally", vi: "đối xử công bằng như nhau" },
      { chinese: "和气生财", pinyin: "hé qì shēng cái", english: "harmony brings wealth", vi: "hòa khí sinh tài" }
    ],
    dialogue: [
      { speaker: "黎", chinese: "王总, 欢迎您来胡志明市! 这是我们的工厂入口。", pinyin: "Wáng zǒng, huānyíng nín lái Húzhìmíng shì! Zhè shì wǒmen de gōngchǎng rùkǒu.", english: "Director Wang, welcome to Ho Chi Minh City! This is our factory entrance.", vi: "Tổng Vương, hoan nghênh anh đến TP HCM! Đây là cổng nhà máy của bọn em." },
      { speaker: "王总", chinese: "工厂规模比我想的大。员工有多少人?", pinyin: "Gōngchǎng guīmó bǐ wǒ xiǎng de dà. Yuángōng yǒu duōshao rén?", english: "Factory's bigger than I thought. How many employees?", vi: "Nhà máy quy mô lớn hơn tôi tưởng. Có bao nhiêu nhân viên?" },
      { speaker: "黎", chinese: "目前八百人, 三班轮替。我们的产品质量符合中国国标。", pinyin: "Mùqián bā bǎi rén, sān bān lúntì. Wǒmen de chǎnpǐn zhìliàng fúhé Zhōngguó guóbiāo.", english: "Currently 800, three rotating shifts. Our product quality meets Chinese national standards.", vi: "Hiện 800 người, ba ca luân phiên. Chất lượng sản phẩm bọn em đạt tiêu chuẩn quốc gia Trung Quốc." },
      { speaker: "王总", chinese: "好, 我们边走边看。", pinyin: "Hǎo, wǒmen biān zǒu biān kàn.", english: "Good, let's walk and look.", vi: "Được, mình vừa đi vừa xem." }
    ],
    dialogue_long: [
      { speaker: "黎", chinese: "王总, 欢迎您来胡志明市! 我是黎文海, 总经理。这是我的名片, 请多多指教。", pinyin: "Wáng zǒng, huānyíng nín lái Húzhìmíng shì! Wǒ shì Lí Wénhǎi, zǒng jīnglǐ. Zhè shì wǒ de míngpiàn, qǐng duōduō zhǐjiào.", english: "Director Wang, welcome to Ho Chi Minh City! I'm Le Van Hai, General Manager. Here's my card, please favor me with guidance.", vi: "Tổng Vương, hoan nghênh anh đến TP HCM! Em là Lê Văn Hải, tổng giám đốc. Đây là danh thiếp của em, xin được chỉ giáo." },
      { speaker: "王总", chinese: "黎总, 久仰大名。这是我的名片。一路下来路上还顺利吧?", pinyin: "Lí zǒng, jiǔ yǎng dà míng. Zhè shì wǒ de míngpiàn. Yī lù xiàlái lùshàng hái shùnlì ba?", english: "Director Le, long admired your name. Here's my card. Was the ride smooth?", vi: "Tổng Lê, lâu nay đã ngưỡng mộ. Đây là danh thiếp tôi. Đường đi có thuận không?" },
      { speaker: "黎", chinese: "很顺利, 谢谢。先请您参观工厂, 然后我们会议室谈合作细节。", pinyin: "Hěn shùnlì, xièxie. Xiān qǐng nín cānguān gōngchǎng, ránhòu wǒmen huìyìshì tán hézuò xìjié.", english: "Very smooth, thanks. Please tour the factory first, then we'll discuss cooperation details in the meeting room.", vi: "Rất thuận lợi, cảm ơn anh. Mời anh tham quan nhà máy trước, sau đó mình thảo luận chi tiết hợp tác ở phòng họp." },
      { speaker: "王总", chinese: "好。你们工厂主要做什么产品?", pinyin: "Hǎo. Nǐmen gōngchǎng zhǔyào zuò shénme chǎnpǐn?", english: "Good. What main products does your factory make?", vi: "Được. Nhà máy chủ yếu sản xuất sản phẩm gì?" },
      { speaker: "黎", chinese: "我们做电子元件, 主要供应华为、小米和VinSmart。月产能两百万件。", pinyin: "Wǒmen zuò diànzǐ yuánjiàn, zhǔyào gōngyìng Huáwèi, Xiǎomǐ hé VinSmart. Yuè chǎnnéng èr bǎi wàn jiàn.", english: "We make electronic components, mainly supplying Huawei, Xiaomi and VinSmart. Monthly capacity 2 million units.", vi: "Bọn em làm linh kiện điện tử, chủ yếu cung cấp cho Huawei, Xiaomi và VinSmart. Sản lượng tháng 2 triệu chiếc." },
      { speaker: "王总", chinese: "两百万不少。质量怎么控制?", pinyin: "Liǎng bǎi wàn bù shǎo. Zhìliàng zěnme kòngzhì?", english: "2 million is not small. How do you control quality?", vi: "2 triệu không ít. Chất lượng kiểm soát thế nào?" },
      { speaker: "黎", chinese: "三道质检: 来料、生产中、成品。我们有ISO 9001认证, 不良率控制在万分之三以下。", pinyin: "Sān dào zhìjiǎn: láiliào, shēngchǎn zhōng, chéngpǐn. Wǒmen yǒu ISO 9001 rènzhèng, bùliáng lǜ kòngzhì zài wàn fēn zhī sān yǐxià.", english: "Three QC stages: incoming materials, in-process, finished goods. We have ISO 9001 certification, defect rate under 0.03%.", vi: "Ba tầng kiểm chất: nguyên liệu nhập, đang sản xuất, thành phẩm. Bọn em có chứng nhận ISO 9001, tỷ lệ lỗi dưới 0.03%." },
      { speaker: "王总", chinese: "数据不错。价格比中国大陆有优势吗?", pinyin: "Shùjù bùcuò. Jiàgé bǐ Zhōngguó dàlù yǒu yōushì ma?", english: "Numbers are decent. Price advantage over mainland China?", vi: "Số liệu ổn. Giá có lợi thế so với Trung Quốc đại lục không?" },
      { speaker: "黎", chinese: "总成本比中国大陆低15-20%, 主要是人工和电费。运输到深圳七天到。", pinyin: "Zǒng chéngběn bǐ Zhōngguó dàlù dī bǎi fēn zhī shíwǔ dào èrshí, zhǔyào shì réngōng hé diànfèi. Yùnshū dào Shēnzhèn qī tiān dào.", english: "Total cost 15-20% lower than mainland China, mainly labor and electricity. Shipping to Shenzhen takes 7 days.", vi: "Tổng chi phí thấp hơn Trung Quốc đại lục 15-20%, chủ yếu nhân công và tiền điện. Vận chuyển đến Thâm Quyến 7 ngày." },
      { speaker: "王总", chinese: "我看你们的样品做得很精细。如果我们合作, 起订量是多少?", pinyin: "Wǒ kàn nǐmen de yàngpǐn zuò de hěn jīngxì. Rúguǒ wǒmen hézuò, qǐdìng liàng shì duōshao?", english: "Your samples look refined. If we cooperate, what's the minimum order quantity?", vi: "Tôi thấy mẫu của em làm rất tinh tế. Nếu mình hợp tác, lượng đặt tối thiểu là bao nhiêu?" },
      { speaker: "黎", chinese: "标准件起订五万, 定制件起订十万。如果年度合作, 价格还可以谈。", pinyin: "Biāozhǔn jiàn qǐdìng wǔ wàn, dìngzhì jiàn qǐdìng shí wàn. Rúguǒ niándù hézuò, jiàgé hái kěyǐ tán.", english: "Standard parts MOQ 50,000, custom parts MOQ 100,000. For yearly partnerships, prices are negotiable.", vi: "Linh kiện tiêu chuẩn MOQ 50 nghìn, đặt riêng MOQ 100 nghìn. Nếu hợp tác hàng năm, giá có thể thương lượng." },
      { speaker: "王总", chinese: "那样好。我们今年预计要十五万, 明年可能翻倍。", pinyin: "Nàyàng hǎo. Wǒmen jīnnián yùjì yào shíwǔ wàn, míngnián kěnéng fān bèi.", english: "Good. We estimate 150,000 this year, possibly double next year.", vi: "Vậy tốt. Năm nay bọn tôi dự kiến cần 150 nghìn, năm sau có thể gấp đôi." },
      { speaker: "黎", chinese: "数量很可观, 我们一定全力配合。互利共赢, 长期合作。今晚我请您吃越南海鲜?", pinyin: "Shùliàng hěn kěguān, wǒmen yīdìng quánlì pèihé. Hùlì gòngyíng, chángqī hézuò. Jīn wǎn wǒ qǐng nín chī Yuènán hǎixiān?", english: "Quantity is significant, we'll fully cooperate. Win-win, long-term partnership. Tonight I'll treat you to Vietnamese seafood?", vi: "Số lượng đáng kể, bọn em sẽ phối hợp toàn lực. Đôi bên cùng có lợi, hợp tác dài hạn. Tối em mời anh ăn hải sản Việt Nam?" },
      { speaker: "王总", chinese: "太破费了, 我自己买单也行。", pinyin: "Tài pòfèi le, wǒ zìjǐ mǎidān yě xíng.", english: "That's too much trouble, I can pay myself.", vi: "Tốn kém quá, tôi tự trả cũng được." },
      { speaker: "黎", chinese: "您客气了。您远来是客, 这次我做东。礼尚往来, 下次我去深圳, 您请我就好。", pinyin: "Nín kèqì le. Nín yuǎn lái shì kè, zhè cì wǒ zuò dōng. Lǐ shàng wǎng lái, xià cì wǒ qù Shēnzhèn, nín qǐng wǒ jiù hǎo.", english: "You're being too polite. You're a guest from afar — this time I host. Reciprocity — next time I go to Shenzhen, you treat me.", vi: "Anh khách sáo quá. Khách phương xa là khách quý, lần này em làm chủ. Có qua có lại, lần sau em đến Thâm Quyến, anh mời em là được." },
      { speaker: "王总", chinese: "好, 那就恭敬不如从命。和你们合作我很有信心, 和气生财嘛。", pinyin: "Hǎo, nà jiù gōngjìng bùrú cóngmìng. Hé nǐmen hézuò wǒ hěn yǒu xìnxīn, héqì shēngcái ma.", english: "Alright, then I'd rather follow your wishes than refuse. I'm confident in cooperating with you — harmony brings wealth.", vi: "Được, vậy cung kính không bằng tuân lệnh. Hợp tác với các em tôi rất tự tin — hòa khí sinh tài mà." }
    ],
    roleplay_prompts: [
      "Đóng vai chủ nhà máy Việt Nam đón khách hàng tiềm năng từ Trung Quốc đến tham quan. Hãy mở đầu bằng tour 5 phút (cổng → khu sản xuất → QC → mẫu sản phẩm → phòng họp), trong đó nhấn mạnh 3 điểm bán hàng (chất lượng, giá, thời gian). Tránh kể quá nhiều — để khách hỏi.",
      "Khách Trung Quốc thắc mắc về 'tại sao Việt Nam rẻ hơn Trung Quốc'. Hãy giải thích chân thực (nhân công, điện, thuế) — KHÔNG so sánh hơn-kém với Trung Quốc, KHÔNG động chạm chính sách. Dùng tone 'lợi thế bổ sung' chứ không 'thay thế'.",
      "Cuối cuộc gặp, khách đề nghị giảm giá 10%. Hãy thương lượng chuyên nghiệp: thừa nhận đề nghị, giải thích cấu trúc giá, đề xuất 'gói deal' (giá + thời gian thanh toán + khối lượng). Kết bằng cụm '互利共赢' — không 'thắng-thua'."
    ],
    register_notes: "Tiếp khách hàng Trung Quốc khác tiếp sếp ở chỗ: bạn là HOST nhưng cũng là BÊN ĐANG THUYẾT PHỤC. Phải cân bằng giữa 'phục vụ chu đáo' và 'thể hiện năng lực'. 您 toàn bộ với khách, kể cả khách trẻ.\n\nCác cụm chuẩn cho hosting business client:\n- Mở đầu: '王总, 久仰大名' (lâu ngưỡng mộ — dùng khi đã biết về họ); '欢迎您莅临' (huānyíng nín lìlín — hoan nghênh anh đến — formal hơn 来)\n- Khi nói về sản phẩm: dùng số liệu cụ thể, không adjective trống. '不良率万分之三' tốt hơn '质量很好'\n- Khi mời ăn: '今晚我做东' (tối em làm chủ); KHÔNG '我请客' (tôi mời) — quá generic. '做东' formal hơn\n- Khi khách từ chối lễ phép: dùng '远来是客' + '礼尚往来' để thuyết phục\n- Khi đề xuất hợp tác: '希望我们能互利共赢, 长期合作' (mong đôi bên cùng có lợi, hợp tác dài hạn)\n\nQuy tắc 关系 (quan hệ): hợp tác lần đầu đầu tư mạnh vào quan hệ — 1 ngày work + 2 bữa ăn + 1 tour văn hóa. Sau lần 1, quan hệ đã established, có thể giảm 'entertainment overhead'. Đừng tiết kiệm ở lần đầu.\n\nTránh: (a) Gọi khách hàng bằng 'em' (em Vương) — quá thân; (b) Hỏi về lương cá nhân của khách — vô lễ; (c) So sánh trực tiếp với đối thủ Trung Quốc khác ('chúng tôi rẻ hơn X công ty') — bị coi là không đẳng cấp.",
    idiom_glosses: [
      {
        idiom: "礼尚往来",
        literal: "lễ là sự qua lại (lǐ shàng wǎng lái)",
        meaning: "Có qua có lại — quy tắc đáp lễ trong văn hóa Trung Quốc/Việt Nam. Khi bạn đãi khách, lần sau khách phải đãi bạn. Cụm dùng để thuyết phục khách đồng ý cho bạn host: '礼尚往来嘛, 这次我做东'.",
        example: "礼尚往来嘛, 下次您来河内一定要让我做东。"
      },
      {
        idiom: "投桃报李",
        literal: "ném đào nhận mận (tóu táo bào lǐ)",
        meaning: "Trao tặng đào nhận lại mận — quà đáp quà, giúp đỡ đáp giúp đỡ. Cụm cổ điển hơn 礼尚往来, dùng trong context formal. Phù hợp khi nói về mối quan hệ hợp tác lâu dài.",
        example: "我们做生意, 讲究投桃报李。"
      },
      {
        idiom: "和气生财",
        literal: "hòa khí sinh tài (hé qì shēng cái)",
        meaning: "Hòa khí sinh ra của cải — quan hệ tốt là cơ sở của làm ăn. Triết lý kinh doanh Trung Quốc cổ điển. Khách Trung Quốc dùng để thể hiện thiện chí: 'cùng nhau hòa khí, tiền sẽ đến'.",
        example: "和气生财, 我们慢慢谈, 不着急。"
      },
      {
        idiom: "一视同仁",
        literal: "một mắt nhìn cùng người (yī shì tóng rén)",
        meaning: "Đối xử công bằng như nhau — không phân biệt khách lớn nhỏ, gần xa. Cụm cam kết phong cách phục vụ: '我们对所有客户一视同仁, 您是我们的VIP'. Dùng để xây niềm tin.",
        example: "我们对所有客户一视同仁。"
      }
    ],
    cultural_notes_vi: "Tiếp khách hàng Trung Quốc tại Việt Nam khác tiếp khách Mỹ/Âu ở năm điểm cốt lõi: (1) 'Quan hệ' (关系) đến TRƯỚC 'business' (生意). Người Trung Quốc thích biết người trước khi biết hợp đồng — họ đầu tư 30-40% thời gian gặp gỡ vào ăn uống/giao lưu, không phải vì lãng phí mà vì xây nền tảng tin cậy. Khác Mỹ (presentation → numbers → contract trong 2 giờ), Trung Quốc cần 2 ngày + 3 bữa ăn để 'cảm nhận' đối tác. (2) 'Mặt' (面子) đan xen: bạn cho mặt khách (đặt khách sạn 5 sao, tour VIP, quà có giá trị), khách trả lại bằng cách quyết định nhanh hoặc giới thiệu thêm khách. KHÔNG cho mặt = không nhận hợp đồng. (3) Bữa ăn QUAN TRỌNG hơn họp văn phòng. Hợp đồng thực sự được 'đàm phán' qua bữa cơm tối với rượu — không phải qua PowerPoint sáng. Đừng tiếc tiền cho bữa ăn. (4) Quyết định cuối cùng KHÔNG được đưa ra trong cuộc gặp đầu tiên. Khách Trung Quốc cần 'tham khảo nội bộ' (内部商量) sau chuyến thăm. Đừng ép quyết định ngay tại Việt Nam — cho khách 1-2 tuần. (5) Sau chuyến thăm, follow-up trong 24h bằng tin nhắn cá nhân (không email): 'Tổng Vương, anh đã về Trung Quốc bình an chứ?' + ảnh đẹp đã chụp. Đây là dấu hiệu bạn coi trọng quan hệ.\n\nVề thanh toán bữa ăn: chiến đấu trả tiền (抢着买单) là phong tục — bạn và khách sẽ giả vờ tranh nhau trả. Người 'thắng' là host. Khi khách giả vờ đòi trả, bạn dùng '远来是客' + 'này lần em mời, lần sau anh đến Trung Quốc anh mời'. Đừng để khách thực sự trả — coi như host thua.\n\nQuà hợp tác lần đầu: từ phía host (Việt Nam) khoảng 500-2000 nhân dân tệ — đặc sản Việt cao cấp (cà phê Trung Nguyên, lụa Vạn Phúc, tranh Đông Hồ). Khách thường mang quà từ Trung Quốc (trà cao cấp, rượu Mao Đài) — đáp lại bằng quà tương đương giá trị. Quá đắt = nhận hối lộ; quá rẻ = không tôn trọng.",
    tip_advice_vi: "(1) GẶP TRƯỚC khi gửi báo giá. Lần đầu hợp tác, KHÔNG gửi quote qua email — mời khách đến Việt Nam hoặc bạn đi Trung Quốc, gặp mặt + tour + ăn cơm + mới thảo luận giá. Email-only deals với khách Trung Quốc thường không thành công. (2) Chuẩn bị 'pitch package' chuyên nghiệp: brochure tiếng Trung (KHÔNG dùng Google Translate — thuê dịch chuyên nghiệp), video sản phẩm 2 phút, mẫu sản phẩm thật, 3 case study khách hàng cũ. (3) Trong tour nhà máy, mời khách CHẠM vào sản phẩm, ngửi nguyên liệu, xem QC test. Sense experience > slide deck. Khách Trung Quốc đặc biệt tin 'thấy tận mắt'. (4) Tránh 4 chủ đề trong tất cả mọi cuộc trò chuyện: chính trị Việt-Trung-Mỹ, lịch sử (1979 border war, Hoàng Sa), tôn giáo, vấn đề người Hoa ở Việt Nam. Nếu khách khơi mào, chuyển khéo bằng '这是个复杂的话题, 我们改天慢慢聊'. (5) Mời 1 phiên dịch chuyên nghiệp cho cuộc thảo luận quan trọng — kể cả nếu bạn HSK 6. Hiểu sai 1 từ chuyên môn (vd: '不良率' nhầm '良率') có thể mất hợp đồng. Phiên dịch chuyên nghiệp 1.5-2 triệu/ngày, đầu tư đáng. (6) Sau cuộc gặp, gửi 'meeting summary' chi tiết qua email TRONG 24h: tóm tắt nội dung, action items, deadline, người chịu trách nhiệm. Đây là chuẩn business Trung Quốc — không gửi = bị coi là thiếu chuyên nghiệp. (7) Cập nhật quan hệ định kỳ: Tết Trung Quốc, Tết Trung Thu, đầu năm mới gửi tin chúc kèm ảnh (không chỉ text). 'Quan hệ' không phải 1 lần đầu tư mà là 'maintain' liên tục.",
    exercises: [
      { type: "fill-blank", question: "希望我们的合作能 ___ , 长期发展。", answer: "互利共赢" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung tiếp khách hàng với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "做东", pinyin: "zuò dōng", english: "làm chủ tiệc / mời ăn" },
          { chinese: "礼尚往来", pinyin: "lǐ shàng wǎng lái", english: "có qua có lại" },
          { chinese: "和气生财", pinyin: "hé qì shēng cái", english: "hòa khí sinh tài" },
          { chinese: "一视同仁", pinyin: "yī shì tóng rén", english: "đối xử công bằng" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Cảm ơn anh đã chọn công ty bọn em. Mong hợp tác đôi bên cùng có lợi, lâu dài. Tối nay em làm chủ.",
        chinese: "感谢您选择我们公司。希望我们的合作能互利共赢, 长期发展。今晚我做东。",
        pinyin: "Gǎn xiè nín xuǎn zé wǒ men gōng sī. Xī wàng wǒ men de hé zuò néng hù lì gòng yíng, cháng qī fā zhǎn. Jīn wǎn wǒ zuò dōng."
      }
    ]
  },
  {
    id: 64,
    level: "B2",
    category: "cultural_communication",
    title: "向中国同事介绍越南文化",
    pinyin: "xiàng zhōng guó tóng shì jiè shào yuè nán wén huà",
    topic: "Explaining Vietnamese culture to Chinese colleague",
    title_vi: "Giới thiệu văn hóa Việt Nam cho đồng nghiệp Trung Quốc",
    title_en: "Explaining Vietnamese culture to a Chinese colleague",
    sentences: [
      {
        chinese: "越南文化和中国文化既有相似之处, 也有自己的特色。",
        pinyin: "Yuènán wénhuà hé Zhōngguó wénhuà jì yǒu xiāngsì zhī chù, yě yǒu zìjǐ de tèsè.",
        english: "Vietnamese and Chinese cultures have similarities and also unique features.",
        vi: "Văn hóa Việt Nam và Trung Quốc vừa có điểm tương đồng, vừa có nét riêng.",
        pronunciation_focus: ["相似之处 → xiāngsì zhī chù (chỗ tương đồng)", "特色 → tèsè (nét đặc sắc)", "既...也... → jì... yě... (vừa... vừa...)", "文化 → wénhuà (văn hóa)"]
      },
      {
        chinese: "我们都重视家庭、教育和孝道, 这是同根同源的儒家文化。",
        pinyin: "Wǒmen dōu zhòngshì jiātíng, jiàoyù hé xiàodào, zhè shì tóng gēn tóng yuán de Rújiā wénhuà.",
        english: "We both value family, education, and filial piety — this is shared-roots Confucian culture.",
        vi: "Cả hai đều coi trọng gia đình, giáo dục và đạo hiếu — đây là văn hóa Nho gia cùng nguồn cùng cội.",
        pronunciation_focus: ["重视 → zhòngshì (coi trọng)", "孝道 → xiàodào (đạo hiếu)", "同根同源 → tóng gēn tóng yuán (cùng gốc cùng nguồn)", "儒家 → Rújiā (Nho gia)"]
      },
      {
        chinese: "但越南也有独特的元素, 比如奥黛、河粉、和咖啡文化。",
        pinyin: "Dàn Yuènán yě yǒu dútè de yuánsù, bǐrú àodài, héfěn, hé kāfēi wénhuà.",
        english: "But Vietnam also has unique elements, like ao dai, pho, and coffee culture.",
        vi: "Nhưng Việt Nam cũng có những yếu tố riêng, ví dụ áo dài, phở, và văn hóa cà phê.",
        pronunciation_focus: ["独特 → dútè (độc đáo)", "元素 → yuánsù (yếu tố)", "奥黛 → àodài (áo dài)", "河粉 → héfěn (phở)"]
      },
      {
        chinese: "越南受过法国殖民, 所以建筑和饮食有法式风情。",
        pinyin: "Yuènán shòu guò Fǎguó zhímín, suǒyǐ jiànzhù hé yǐnshí yǒu Fǎshì fēngqíng.",
        english: "Vietnam was once colonized by France, so the architecture and cuisine have French flavor.",
        vi: "Việt Nam từng là thuộc địa Pháp, nên kiến trúc và ẩm thực mang phong vị Pháp.",
        pronunciation_focus: ["殖民 → zhímín (thực dân/colonization)", "建筑 → jiànzhù (kiến trúc)", "饮食 → yǐnshí (ẩm thực)", "风情 → fēngqíng (phong vị)"]
      },
      {
        chinese: "求同存异, 尊重差异, 我们才能更好地交流。",
        pinyin: "Qiú tóng cún yì, zūnzhòng chāyì, wǒmen cáinéng gèng hǎo de jiāoliú.",
        english: "Seek common ground while preserving differences — we can communicate better.",
        vi: "Cầu đồng tồn dị, tôn trọng khác biệt, mình mới giao lưu tốt được.",
        pronunciation_focus: ["求同存异 → qiú tóng cún yì (idiom: cầu đồng tồn dị)", "尊重 → zūnzhòng (tôn trọng)", "差异 → chāyì (khác biệt)", "交流 → jiāoliú (giao lưu)"]
      }
    ],
    vocab: [
      { chinese: "文化", pinyin: "wén huà", english: "culture", vi: "văn hóa" },
      { chinese: "传统", pinyin: "chuán tǒng", english: "tradition", vi: "truyền thống" },
      { chinese: "儒家", pinyin: "rú jiā", english: "Confucianism", vi: "Nho gia" },
      { chinese: "孝道", pinyin: "xiào dào", english: "filial piety", vi: "đạo hiếu" },
      { chinese: "奥黛", pinyin: "ào dài", english: "ao dai (Vietnamese dress)", vi: "áo dài" },
      { chinese: "殖民", pinyin: "zhí mín", english: "colonization", vi: "thực dân" },
      { chinese: "同根同源", pinyin: "tóng gēn tóng yuán", english: "shared roots", vi: "cùng gốc cùng nguồn" },
      { chinese: "求同存异", pinyin: "qiú tóng cún yì", english: "seek common ground while preserving differences", vi: "cầu đồng tồn dị" },
      { chinese: "各有千秋", pinyin: "gè yǒu qiān qiū", english: "each has its merits", vi: "mỗi bên có nét riêng" },
      { chinese: "海内存知己", pinyin: "hǎi nèi cún zhī jǐ", english: "true friends span seas (Wang Bo's verse)", vi: "trong bốn biển có tri kỷ" }
    ],
    dialogue: [
      { speaker: "李同事", chinese: "小阮, 越南和中国文化是不是很像?", pinyin: "Xiǎo Ruǎn, Yuènán hé Zhōngguó wénhuà shì bù shì hěn xiàng?", english: "Little Nguyen, are Vietnamese and Chinese cultures very similar?", vi: "Tiểu Nguyễn, văn hóa Việt và Trung có giống nhau không?" },
      { speaker: "阮", chinese: "有同有异。我们都过春节, 都用筷子。", pinyin: "Yǒu tóng yǒu yì. Wǒmen dōu guò Chūnjié, dōu yòng kuàizi.", english: "Some same, some different. We both celebrate Spring Festival, both use chopsticks.", vi: "Vừa giống vừa khác. Mình đều ăn Tết, đều dùng đũa." },
      { speaker: "李同事", chinese: "差异在哪里?", pinyin: "Chāyì zài nǎlǐ?", english: "Where are the differences?", vi: "Khác biệt ở đâu?" },
      { speaker: "阮", chinese: "我们说越南语, 不是汉语; 文字用拉丁字母, 不是汉字。还有法式咖啡和奥黛。", pinyin: "Wǒmen shuō Yuènányǔ, bù shì Hànyǔ; wénzì yòng Lādīng zìmǔ, bù shì Hànzì. Hái yǒu Fǎshì kāfēi hé àodài.", english: "We speak Vietnamese, not Chinese; we use Latin script, not Chinese characters. Plus French coffee and ao dai.", vi: "Bọn em nói tiếng Việt, không phải tiếng Trung; chữ viết là chữ La-tinh, không phải Hán tự. Còn cà phê Pháp và áo dài." }
    ],
    dialogue_long: [
      { speaker: "李同事", chinese: "小阮, 你们越南人来中国上班, 我们经常觉得你们很容易适应, 是不是文化太像了?", pinyin: "Xiǎo Ruǎn, nǐmen Yuènán rén lái Zhōngguó shàngbān, wǒmen jīngcháng juéde nǐmen hěn róngyì shìyìng, shì bù shì wénhuà tài xiàng le?", english: "Little Nguyen, when you Vietnamese come to China to work, we often feel you adapt easily — is it because the cultures are too similar?", vi: "Tiểu Nguyễn, người Việt sang Trung Quốc làm việc, bọn anh thường thấy các em thích nghi rất dễ, có phải vì văn hóa quá giống không?" },
      { speaker: "阮", chinese: "确实有相似之处。我们都受儒家文化影响, 都过春节, 都重视家庭和教育。", pinyin: "Quèshí yǒu xiāngsì zhī chù. Wǒmen dōu shòu Rújiā wénhuà yǐngxiǎng, dōu guò Chūnjié, dōu zhòngshì jiātíng hé jiàoyù.", english: "There are indeed similarities. We're both influenced by Confucianism, both celebrate Spring Festival, both value family and education.", vi: "Đúng là có điểm tương đồng. Bọn em đều chịu ảnh hưởng văn hóa Nho gia, đều ăn Tết, đều coi trọng gia đình và giáo dục." },
      { speaker: "李同事", chinese: "那历史上越南是不是中国的一部分?", pinyin: "Nà lìshǐ shàng Yuènán shì bù shì Zhōngguó de yī bùfèn?", english: "Was Vietnam historically part of China?", vi: "Vậy trong lịch sử Việt Nam có phải một phần của Trung Quốc không?" },
      { speaker: "阮", chinese: "这个问题比较复杂。古代越南和中国有很多交流, 但越南一直保持自己的语言和身份。我们说越南语, 不是汉语。", pinyin: "Zhège wèntí bǐjiào fùzá. Gǔdài Yuènán hé Zhōngguó yǒu hěn duō jiāoliú, dàn Yuènán yīzhí bǎochí zìjǐ de yǔyán hé shēnfèn. Wǒmen shuō Yuènányǔ, bù shì Hànyǔ.", english: "That's complex. Ancient Vietnam and China had much interaction, but Vietnam always kept its own language and identity. We speak Vietnamese, not Chinese.", vi: "Câu này khá phức tạp. Việt Nam và Trung Quốc cổ đại giao lưu nhiều, nhưng Việt Nam luôn giữ ngôn ngữ và bản sắc riêng. Bọn em nói tiếng Việt, không phải tiếng Trung." },
      { speaker: "李同事", chinese: "我注意到你们文字是拉丁字母。", pinyin: "Wǒ zhùyì dào nǐmen wénzì shì Lādīng zìmǔ.", english: "I noticed your script is Latin alphabet.", vi: "Anh để ý chữ viết của các em là chữ La-tinh." },
      { speaker: "阮", chinese: "对, 这是法国殖民时期推广的, 叫'国语字'。原来我们用汉字和'喃字' (一种自创汉字), 但现在主要用拉丁字母。", pinyin: "Duì, zhè shì Fǎguó zhímín shíqī tuīguǎng de, jiào 'Guóyǔ zì'. Yuánlái wǒmen yòng Hànzì hé 'Nán zì' (yī zhǒng zìchuàng Hànzì), dàn xiànzài zhǔyào yòng Lādīng zìmǔ.", english: "Yes, this was promoted during French colonial period, called 'Quoc Ngu'. Originally we used Chinese characters and 'Chu Nom' (self-invented Chinese-style characters), but now mainly Latin alphabet.", vi: "Đúng, đây là chữ được phổ biến trong thời thực dân Pháp, gọi là 'Quốc ngữ'. Trước đây bọn em dùng Hán tự và 'chữ Nôm' (tự sáng tạo từ Hán tự), nhưng giờ chủ yếu dùng chữ La-tinh." },
      { speaker: "李同事", chinese: "原来如此。所以越南有点像东南亚和东亚的混合。", pinyin: "Yuánlái rúcǐ. Suǒyǐ Yuènán yǒudiǎn xiàng Dōngnányà hé Dōngyà de hùnhé.", english: "I see. So Vietnam is a bit like a mix of Southeast Asia and East Asia.", vi: "Thì ra thế. Vậy Việt Nam giống như sự pha trộn giữa Đông Nam Á và Đông Á." },
      { speaker: "阮", chinese: "可以这么说。地理上属于东南亚, 文化上有东亚根源, 加上一些法国元素。比如我们的咖啡文化就是法国带来的。", pinyin: "Kěyǐ zhème shuō. Dìlǐ shàng shǔyú Dōngnányà, wénhuà shàng yǒu Dōngyà gēnyuán, jiā shàng yīxiē Fǎguó yuánsù. Bǐrú wǒmen de kāfēi wénhuà jiùshì Fǎguó dài lái de.", english: "You could say so. Geographically Southeast Asia, culturally East Asian roots, plus some French elements. Our coffee culture, for example, was brought by the French.", vi: "Có thể nói vậy. Về địa lý thuộc Đông Nam Á, về văn hóa có gốc Đông Á, thêm một số yếu tố Pháp. Ví dụ văn hóa cà phê của bọn em là do Pháp mang đến." },
      { speaker: "李同事", chinese: "越南人都喜欢喝咖啡? 我以为茶才是亚洲传统。", pinyin: "Yuènán rén dōu xǐhuan hē kāfēi? Wǒ yǐwéi chá cái shì Yàzhōu chuántǒng.", english: "All Vietnamese love coffee? I thought tea was Asian tradition.", vi: "Người Việt đều thích cà phê? Anh tưởng trà mới là truyền thống châu Á." },
      { speaker: "阮", chinese: "我们茶咖都喜欢。但越南是世界第二大咖啡出口国, 仅次于巴西。河内的'蛋咖啡'和'酸奶咖啡'是当地特色。", pinyin: "Wǒmen chá kā dōu xǐhuan. Dàn Yuènán shì shìjiè dì èr dà kāfēi chūkǒu guó, jǐn cì yú Bāxī. Hénèi de 'dàn kāfēi' hé 'suānnǎi kāfēi' shì dāngdì tèsè.", english: "We love both tea and coffee. But Vietnam is the world's second-largest coffee exporter, after Brazil. Hanoi's 'egg coffee' and 'yogurt coffee' are local specialties.", vi: "Bọn em đều thích cả trà và cà phê. Nhưng Việt Nam là nước xuất khẩu cà phê lớn thứ hai thế giới, chỉ sau Brazil. Cà phê trứng và sữa chua của Hà Nội là đặc sản." },
      { speaker: "李同事", chinese: "蛋咖啡? 听起来奇特。下次我去河内一定要尝。", pinyin: "Dàn kāfēi? Tīng qǐlái qítè. Xià cì wǒ qù Hénèi yīdìng yào cháng.", english: "Egg coffee? Sounds peculiar. Next time I go to Hanoi I must try.", vi: "Cà phê trứng? Nghe lạ đấy. Lần sau anh đến Hà Nội nhất định phải thử." },
      { speaker: "阮", chinese: "好啊! 还有奥黛, 我们的传统服装。和中国旗袍很像但又不一样。", pinyin: "Hǎo a! Hái yǒu àodài, wǒmen de chuántǒng fúzhuāng. Hé Zhōngguó qípáo hěn xiàng dàn yòu bù yīyàng.", english: "Sure! Also ao dai, our traditional dress. Similar to Chinese qipao but different.", vi: "Vâng! Còn áo dài, trang phục truyền thống của bọn em. Giống xường xám Trung Quốc nhưng cũng khác." },
      { speaker: "李同事", chinese: "怎么不一样?", pinyin: "Zěnme bù yīyàng?", english: "How different?", vi: "Khác thế nào?" },
      { speaker: "阮", chinese: "奥黛上身紧, 下身是宽松的长裤; 旗袍是连体裙。颜色和图案上越南偏柔和, 中国偏鲜艳。", pinyin: "Àodài shàngshēn jǐn, xiàshēn shì kuānsōng de chángkù; qípáo shì liántǐ qún. Yánsè hé tú'àn shàng Yuènán piān róuhé, Zhōngguó piān xiānyàn.", english: "Ao dai has a tight top with loose long pants; qipao is a one-piece dress. Vietnam tends to soft colors and patterns, China tends to bright.", vi: "Áo dài thân trên ôm, dưới là quần dài rộng; xường xám là váy liền. Màu và hoa văn Việt Nam thiên về dịu, Trung Quốc thiên về rực rỡ." },
      { speaker: "李同事", chinese: "听你这么一介绍, 越南文化真是各有千秋。", pinyin: "Tīng nǐ zhème yī jièshào, Yuènán wénhuà zhēn shì gè yǒu qiān qiū.", english: "After your introduction, Vietnamese culture really has its own merits.", vi: "Nghe em giới thiệu thế này, văn hóa Việt Nam thực sự có nét riêng." },
      { speaker: "阮", chinese: "求同存异, 我们都是亚洲文化的孩子。海内存知己, 天涯若比邻。", pinyin: "Qiú tóng cún yì, wǒmen dōu shì Yàzhōu wénhuà de háizi. Hǎi nèi cún zhī jǐ, tiānyá ruò bǐlín.", english: "Seek common ground while preserving differences — we're all children of Asian culture. True friends span seas, distant horizons feel close.", vi: "Cầu đồng tồn dị, mình đều là con của văn hóa châu Á. Trong bốn biển có tri kỷ, chân trời như cận kề." }
    ],
    roleplay_prompts: [
      "Đồng nghiệp Trung Quốc hỏi 'tại sao Việt Nam viết bằng chữ La-tinh, không phải Hán tự'. Hãy giải thích lịch sử ngắn gọn (chữ Nôm → Quốc ngữ → Pháp phổ biến) — KHÔNG bình luận chính trị, chỉ nêu sự việc. Dùng tone học thuật, không cảm xúc.",
      "Đồng nghiệp Trung Quốc bảo 'Việt Nam là phiên bản nhỏ của Trung Quốc'. Đây là câu thiếu nhạy cảm. Hãy đáp lại không xúc phạm: thừa nhận điểm chung văn hóa + làm rõ tính độc lập của Việt Nam. Dùng cụm '同根同源, 各有千秋'.",
      "Đồng nghiệp Trung Quốc muốn học 5 từ tiếng Việt cơ bản. Hãy chọn 5 từ thực tế: 'xin chào' (chào), 'cảm ơn' (cảm ơn), 'ngon' (ngon), 'đắt' (đắt), 'rẻ' (rẻ). Giải thích pinyin tương đương + ngữ cảnh dùng. Đây là khoảnh khắc xây quan hệ — đầu tư thời gian."
    ],
    register_notes: "Giải thích văn hóa Việt Nam cho đồng nghiệp Trung Quốc là môi trường ASYMMETRIC — bạn là người Việt giải thích về Việt Nam cho người Trung. Phải cân bằng giữa 'tự hào dân tộc' và 'không đối đầu'. 你 với đồng nghiệp ngang cấp; 您 nếu họ lớn tuổi.\n\nKhi đồng nghiệp Trung hỏi câu nhạy cảm (lịch sử, chính trị), KHÔNG trả lời thẳng theo cảm xúc. Dùng cấu trúc 'thừa nhận thông tin + làm rõ + chuyển hướng':\n- '这个问题比较复杂' (câu này khá phức tạp) — thừa nhận\n- '历史上...但现在...' (lịch sử là... nhưng hiện tại...) — đặt sự việc trong ngữ cảnh\n- '我们还是聊文化的具体方面吧' (mình vẫn nói về khía cạnh cụ thể của văn hóa nhé) — chuyển hướng\n\nCác cụm cân bằng văn hóa:\n- '同根同源' (tóng gēn tóng yuán) — cùng gốc cùng nguồn (thừa nhận điểm chung)\n- '各有千秋' (gè yǒu qiān qiū) — mỗi bên có nét riêng (khẳng định khác biệt)\n- '求同存异' (qiú tóng cún yì) — cầu đồng tồn dị (cách tiếp cận đúng)\n- '海内存知己, 天涯若比邻' — câu thơ Vương Bột, dùng cuối cuộc trò chuyện văn hóa\n\nTránh tuyệt đối: (a) So sánh hơn-kém ('Việt Nam tốt hơn Trung Quốc ở X') — kể cả nếu đúng; (b) Đề cập 1979 border war, Hoàng Sa, Trường Sa — chuyển chủ đề ngay; (c) Chế giễu phát âm tiếng Trung của đồng nghiệp; (d) Phủ nhận hoàn toàn ảnh hưởng Trung Quốc đến Việt Nam — không chân thực và mất thiện cảm.",
    idiom_glosses: [
      {
        idiom: "同根同源",
        literal: "cùng gốc cùng nguồn (tóng gēn tóng yuán)",
        meaning: "Cùng gốc, cùng nguồn — chia sẻ nguồn gốc văn hóa/lịch sử. Cụm trung tính dùng để thừa nhận chia sẻ văn hóa Việt-Trung mà không nói 'một quốc gia'. Mở đường cho thảo luận tôn trọng.",
        example: "我们都受儒家影响, 同根同源。"
      },
      {
        idiom: "求同存异",
        literal: "cầu đồng tồn dị (qiú tóng cún yì)",
        meaning: "Cầu cái chung, giữ cái khác — tìm điểm chung nhưng tôn trọng khác biệt. Cụm chuẩn ngoại giao Trung Quốc, áp dụng tuyệt vời cho giao tiếp Việt-Trung. Tránh xung đột vô ích.",
        example: "求同存异, 才能更好地交流。"
      },
      {
        idiom: "各有千秋",
        literal: "mỗi bên có ngàn thu (gè yǒu qiān qiū)",
        meaning: "Mỗi bên có nét riêng đáng giá — không ai hơn ai. Cụm bình đẳng, dùng để khẳng định Việt Nam và Trung Quốc đều có giá trị riêng. Đối lập với 'so sánh hơn kém'.",
        example: "中越文化各有千秋, 都很精彩。"
      },
      {
        idiom: "海内存知己, 天涯若比邻",
        literal: "trong bốn biển có tri kỷ, chân trời như cận kề (Vương Bột)",
        meaning: "Câu thơ nổi tiếng của Vương Bột (đời Đường): nếu trên đời có tri kỷ, dù xa cũng như gần. Dùng để kết nối tình bạn Việt-Trung. Cao cấp về văn hóa — sẽ gây ấn tượng mạnh nếu dùng đúng.",
        example: "海内存知己, 天涯若比邻 — 越中朋友永远不分离。"
      }
    ],
    cultural_notes_vi: "Giao tiếp văn hóa Việt-Trung là khu vực 'đẹp đẽ nhưng nhạy cảm'. Hai nước có 2000+ năm lịch sử giao thoa, cùng nền tảng Nho gia, cùng Tết âm lịch, cùng dùng đũa, cùng coi trọng học vấn và đạo hiếu — tỉ lệ tương đồng văn hóa cao hơn bất kỳ cặp nước nào khác. NHƯNG cũng có lịch sử xung đột (Bắc thuộc 1000 năm, 1979 border war, tranh chấp biển), nên giao tiếp văn hóa cần 'maturity' — không lảng tránh nhưng không khơi mào.\n\nKhi đồng nghiệp Trung Quốc hỏi câu nhạy cảm, có 4 cách phản ứng tốt: (1) Thừa nhận sự thật khách quan: 'lịch sử có giai đoạn X, sau đó Y' — không phán xét. (2) Chuyển sang khía cạnh tích cực: 'nhưng hiện nay quan hệ kinh tế rất tốt'. (3) Đề xuất chủ đề thay thế: 'mình nói về ẩm thực hai nước thì hay hơn'. (4) Dùng cụm 'đây là chủ đề phức tạp, mình từ từ nói sau' — để dành cho lúc thân hơn.\n\nVề 'điểm chung an toàn' nên khai thác: ẩm thực (cả hai có món tương tự — phở/lamian, bún/miến), Tết âm lịch (cùng ngày, cùng phong tục lì xì), đạo hiếu (giống nhau 90%), trà/cà phê, võ thuật (Việt Nam có Vovinam, Trung có wushu). Đây là 'safe zones' để bonding.\n\n'Điểm chung tránh': lịch sử cổ đại (Bắc thuộc), 1979, biển đảo, vấn đề Đài Loan, Tân Cương/Tây Tạng. Người Việt thông minh KHÔNG nêu quan điểm về vấn đề nội bộ Trung Quốc — không phải sợ, mà vì không phải việc của mình.\n\nVề ảnh hưởng Pháp: đề cập tự nhiên (kiến trúc Hà Nội, cà phê, bánh mì), KHÔNG so sánh thuộc địa Pháp với Bắc thuộc Trung Quốc — đó là so sánh sai và sẽ tạo căng thẳng. Pháp = colonial; Trung Quốc cổ đại = phức tạp hơn (vừa colonial vừa cultural exchange).\n\nMột mẹo cuối: học 5-10 cụm tiếng Trung về văn hóa (儒家, 孝道, 同根同源, 求同存异) — khi bạn dùng đúng cụm này, đồng nghiệp Trung sẽ cảm thấy bạn 'thông hiểu' văn hóa của họ và tôn trọng bạn hơn.",
    tip_advice_vi: "(1) Chuẩn bị '5 facts về Việt Nam' để giới thiệu khi được hỏi: (a) dân số 100 triệu, (b) 54 dân tộc, (c) thủ đô Hà Nội 1000 năm, (d) 3000km bờ biển, (e) xuất khẩu cà phê thứ 2 thế giới. Số liệu cụ thể > adjective trống. (2) Mang theo 'cultural ambassador kit': bưu thiếp Hà Nội/Vịnh Hạ Long, mẫu cà phê G7, ảnh áo dài, bản nhạc dân ca. Chia sẻ tự nhiên trong cuộc nói chuyện, không bài bản. (3) KHI ĐƯỢC HỎI câu nhạy cảm (1979, biển đảo), đáp '这个问题比较复杂, 不同人有不同观点。我们还是聊文化吧' (câu này phức tạp, nhiều người có quan điểm khác. Mình nói văn hóa thôi nhé). Lịch sự + chuyển hướng. (4) Dạy đồng nghiệp 5-10 từ tiếng Việt cơ bản: chào, cảm ơn, ngon, đắt, rẻ, một, hai, ba — đây là cử chỉ thân thiện, mọi người đều thích. Chấp nhận họ phát âm sai, không cười. (5) Khi đồng nghiệp Trung Quốc đến Việt Nam, dẫn họ đến: phở (an toàn), cà phê trứng (đặc sản), Văn Miếu (chia sẻ Khổng Tử). Tránh: bún đậu mắm tôm (mùi mạnh lần đầu), nhà thờ (tôn giáo nhạy cảm). (6) Trên WeChat Moments của bạn, đăng ảnh văn hóa Việt Nam với caption tiếng Trung — đây là cách thụ động giáo dục đồng nghiệp. Họ sẽ học được nhiều mà bạn không cần giảng. (7) Cụm văn học 'mạnh': '海内存知己, 天涯若比邻' (Vương Bột) — dùng khi kết thúc cuộc nói chuyện văn hóa hay/sau khi cùng ăn cơm. Đồng nghiệp Trung Quốc sẽ ấn tượng mạnh vì bạn biết thơ Đường — văn hóa của họ.",
    exercises: [
      { type: "fill-blank", question: "中越文化 ___ , 都很精彩。", answer: "各有千秋" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung văn hóa với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "孝道", pinyin: "xiào dào", english: "đạo hiếu" },
          { chinese: "奥黛", pinyin: "ào dài", english: "áo dài (Việt Nam)" },
          { chinese: "同根同源", pinyin: "tóng gēn tóng yuán", english: "cùng gốc cùng nguồn" },
          { chinese: "求同存异", pinyin: "qiú tóng cún yì", english: "cầu đồng tồn dị" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Văn hóa Việt và Trung cùng gốc Nho gia, nhưng mỗi bên có nét riêng. Cầu đồng tồn dị, tôn trọng khác biệt là cách giao lưu tốt nhất.",
        chinese: "中越文化同根同源, 但各有千秋。求同存异, 尊重差异是最好的交流方式。",
        pinyin: "Zhōng yuè wén huà tóng gēn tóng yuán, dàn gè yǒu qiān qiū. Qiú tóng cún yì, zūn zhòng chā yì shì zuì hǎo de jiāo liú fāng shì."
      }
    ]
  },
  {
    id: 65,
    level: "B2",
    category: "cultural_communication",
    title: "中越商务礼仪的差异",
    pinyin: "zhōng yuè shāng wù lǐ yí de chā yì",
    topic: "Chinese-Vietnamese business etiquette differences",
    title_vi: "Khác biệt lễ nghi kinh doanh Việt-Trung",
    title_en: "Chinese-Vietnamese business etiquette differences",
    sentences: [
      {
        chinese: "在中国谈生意, 面子比合同还重要。",
        pinyin: "Zài Zhōngguó tán shēngyi, miànzi bǐ hétong hái zhòngyào.",
        english: "In Chinese business, face is even more important than the contract.",
        vi: "Trong làm ăn Trung Quốc, thể diện còn quan trọng hơn hợp đồng.",
        pronunciation_focus: ["面子 → miànzi (thể diện)", "合同 → hétong (hợp đồng)", "谈生意 → tán shēngyi (đàm phán làm ăn)", "重要 → zhòngyào (quan trọng)"]
      },
      {
        chinese: "饭桌上谈成的生意比会议室里的还多。",
        pinyin: "Fànzhuō shàng tán chéng de shēngyi bǐ huìyìshì lǐ de hái duō.",
        english: "More deals are closed at the dinner table than in the meeting room.",
        vi: "Việc làm ăn chốt được trên bàn ăn còn nhiều hơn trong phòng họp.",
        pronunciation_focus: ["饭桌 → fànzhuō (bàn ăn)", "谈成 → tán chéng (đàm phán thành)", "会议室 → huìyìshì (phòng họp)", "生意 → shēngyi"]
      },
      {
        chinese: "礼物要双数, 不要送钟表 (送终的谐音)。",
        pinyin: "Lǐwù yào shuāngshù, bù yào sòng zhōngbiǎo (sòng zhōng de xiéyīn).",
        english: "Gifts should be in pairs; never give clocks (sounds like 'attending a funeral').",
        vi: "Quà phải là số chẵn, đừng tặng đồng hồ (đồng âm với 'tiễn đưa').",
        pronunciation_focus: ["双数 → shuāngshù (số chẵn)", "钟表 → zhōngbiǎo (đồng hồ)", "送终 → sòng zhōng (tiễn đưa người chết)", "谐音 → xiéyīn (đồng âm)"]
      },
      {
        chinese: "敬酒时, 杯子要比对方的低, 表示尊重。",
        pinyin: "Jìngjiǔ shí, bēizi yào bǐ duìfāng de dī, biǎoshì zūnzhòng.",
        english: "When toasting, your glass should be lower than the other person's to show respect.",
        vi: "Khi mời rượu, ly phải thấp hơn ly đối phương, thể hiện sự tôn trọng.",
        pronunciation_focus: ["敬酒 → jìngjiǔ (mời rượu)", "杯子 → bēizi (ly/cốc)", "对方 → duìfāng (đối phương)", "尊重 → zūnzhòng"]
      },
      {
        chinese: "礼多人不怪, 多一点客套不会错。",
        pinyin: "Lǐ duō rén bù guài, duō yīdiǎn kètào bù huì cuò.",
        english: "Excess courtesy bothers no one — extra politeness never hurts.",
        vi: "Lễ nhiều người không trách, lịch sự thêm chút không sai.",
        pronunciation_focus: ["礼多人不怪 → lǐ duō rén bù guài (idiom)", "客套 → kètào (lịch sự xã giao)", "不会错 → bù huì cuò (không sai)", "礼 → lǐ (lễ)"]
      }
    ],
    vocab: [
      { chinese: "礼仪", pinyin: "lǐ yí", english: "etiquette", vi: "lễ nghi" },
      { chinese: "面子", pinyin: "miàn zi", english: "face / dignity", vi: "thể diện" },
      { chinese: "关系", pinyin: "guān xi", english: "relationship", vi: "quan hệ" },
      { chinese: "敬酒", pinyin: "jìng jiǔ", english: "to propose a toast", vi: "mời rượu" },
      { chinese: "送礼", pinyin: "sòng lǐ", english: "to give a gift", vi: "tặng quà" },
      { chinese: "饭局", pinyin: "fàn jú", english: "dinner gathering (business)", vi: "tiệc ăn cơm (xã giao)" },
      { chinese: "客套", pinyin: "kè tào", english: "polite formality", vi: "khách sáo" },
      { chinese: "面子工程", pinyin: "miàn zi gōng chéng", english: "face project (showy)", vi: "công trình giữ thể diện" },
      { chinese: "礼多人不怪", pinyin: "lǐ duō rén bù guài", english: "excess courtesy bothers no one", vi: "lễ nhiều người không trách" },
      { chinese: "入境问禁", pinyin: "rù jìng wèn jìn", english: "ask about taboos when entering", vi: "vào cõi hỏi cấm kỵ" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "陈先生, 中国和越南的商务礼仪差别大吗?", pinyin: "Chén xiānsheng, Zhōngguó hé Yuènán de shāngwù lǐyí chābié dà ma?", english: "Mr. Chen, are Chinese and Vietnamese business etiquettes very different?", vi: "Anh Trần, lễ nghi kinh doanh Trung-Việt khác nhiều không?" },
      { speaker: "陈先生", chinese: "整体相似, 但细节差很多。比如我们更重视饭局。", pinyin: "Zhěngtǐ xiāngsì, dàn xìjié chā hěn duō. Bǐrú wǒmen gèng zhòngshì fànjú.", english: "Overall similar, but details differ a lot. We value dinner gatherings more.", vi: "Tổng thể giống, nhưng chi tiết khác nhiều. Ví dụ bọn anh coi trọng tiệc ăn cơm hơn." },
      { speaker: "阮", chinese: "送礼有什么讲究?", pinyin: "Sòng lǐ yǒu shénme jiǎngjiu?", english: "Any rules for gift-giving?", vi: "Tặng quà có lưu ý gì không?" },
      { speaker: "陈先生", chinese: "记住三忌: 不送钟、不送伞、不送鞋。这些都有不吉利的谐音。", pinyin: "Jìzhù sān jì: bù sòng zhōng, bù sòng sǎn, bù sòng xié. Zhèxiē dōu yǒu bù jílì de xiéyīn.", english: "Remember three taboos: no clocks, no umbrellas, no shoes. All have unlucky sound-alikes.", vi: "Nhớ ba điều cấm: không tặng đồng hồ, không tặng ô, không tặng giày. Tất cả đều đồng âm xui xẻo." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "陈先生, 我下个月要去深圳谈合作, 想请教您一些中国商务礼仪。", pinyin: "Chén xiānsheng, wǒ xià gè yuè yào qù Shēnzhèn tán hézuò, xiǎng qǐngjiào nín yīxiē Zhōngguó shāngwù lǐyí.", english: "Mr. Chen, next month I'll go to Shenzhen for business — I'd like to learn some Chinese business etiquette from you.", vi: "Anh Trần, tháng sau em đi Thâm Quyến đàm phán hợp tác, em muốn xin ý kiến anh về lễ nghi kinh doanh Trung Quốc." },
      { speaker: "陈先生", chinese: "好啊, 我跟你说几个最重要的。第一, 名片要双手递, 文字朝向对方。", pinyin: "Hǎo a, wǒ gēn nǐ shuō jǐ gè zuì zhòngyào de. Dì yī, míngpiàn yào shuāngshǒu dì, wénzì cháo xiàng duìfāng.", english: "Sure, let me share the most important ones. First, business cards must be passed with both hands, text facing the recipient.", vi: "Được, anh nói em vài điều quan trọng nhất. Thứ nhất, danh thiếp phải đưa bằng hai tay, chữ hướng về người nhận." },
      { speaker: "阮", chinese: "和越南差不多。还有什么?", pinyin: "Hé Yuènán chàbuduō. Hái yǒu shénme?", english: "Similar to Vietnam. What else?", vi: "Giống Việt Nam. Còn gì nữa?" },
      { speaker: "陈先生", chinese: "第二, 座位有讲究。主位是面对门的位置, 留给最重要的人。客人坐主位旁边, 不是对面。", pinyin: "Dì èr, zuòwèi yǒu jiǎngjiu. Zhǔ wèi shì miànduì mén de wèizhì, liú gěi zuì zhòngyào de rén. Kèrén zuò zhǔ wèi pángbiān, bù shì duìmiàn.", english: "Second, seating matters. The main seat faces the door, reserved for the most important person. Guests sit next to the main seat, not opposite.", vi: "Thứ hai, vị trí ngồi có quy tắc. Vị trí chính là chỗ đối diện cửa, dành cho người quan trọng nhất. Khách ngồi cạnh vị trí chính, không phải đối diện." },
      { speaker: "阮", chinese: "原来如此。送礼呢?", pinyin: "Yuánlái rúcǐ. Sòng lǐ ne?", english: "I see. What about gifts?", vi: "Thì ra thế. Còn quà thì sao?" },
      { speaker: "陈先生", chinese: "送礼最容易出错。三忌: 不送钟 (送终), 不送伞 (散), 不送鞋 (邪)。数量要双数, 不要四 (死)。", pinyin: "Sòng lǐ zuì róngyì chūcuò. Sān jì: bù sòng zhōng (sòng zhōng), bù sòng sǎn (sàn), bù sòng xié (xié). Shùliàng yào shuāngshù, bù yào sì (sǐ).", english: "Gifts are easiest to mess up. Three taboos: no clocks (sounds like funeral), no umbrellas (sounds like 'separate'), no shoes (sounds like 'evil'). Quantity should be even, not four (sounds like 'death').", vi: "Tặng quà dễ sai nhất. Ba kỵ: không đồng hồ (送终 tiễn), không ô (散 chia tách), không giày (邪 tà). Số lượng phải chẵn, đừng tặng 4 (死 chết)." },
      { speaker: "阮", chinese: "那送什么合适?", pinyin: "Nà sòng shénme héshì?", english: "Then what's appropriate?", vi: "Vậy tặng gì hợp?" },
      { speaker: "陈先生", chinese: "茶、酒、特产都可以。重点不是贵, 是有心。包装要好, 颜色避免白色和黑色 (丧礼颜色)。", pinyin: "Chá, jiǔ, tèchǎn dōu kěyǐ. Zhòngdiǎn bù shì guì, shì yǒu xīn. Bāozhuāng yào hǎo, yánsè bìmiǎn báisè hé hēisè (sānglǐ yánsè).", english: "Tea, wine, local specialties — all fine. Key isn't expensive, it's thoughtful. Packaging matters; avoid white and black (funeral colors).", vi: "Trà, rượu, đặc sản đều được. Trọng tâm không phải đắt mà là có tâm. Bao bì phải đẹp, tránh trắng và đen (màu tang lễ)." },
      { speaker: "阮", chinese: "敬酒呢? 我听说很复杂。", pinyin: "Jìngjiǔ ne? Wǒ tīngshuō hěn fùzá.", english: "What about toasting? I heard it's complicated.", vi: "Còn mời rượu? Em nghe phức tạp lắm." },
      { speaker: "陈先生", chinese: "敬酒规矩多。第一, 给领导敬酒时, 你的杯子要比他的低, 表示尊重。第二, 一干而尽是诚意, 但不能逼别人喝。第三, 主人先敬, 然后按地位顺时针。", pinyin: "Jìngjiǔ guījǔ duō. Dì yī, gěi lǐngdǎo jìngjiǔ shí, nǐ de bēizi yào bǐ tā de dī, biǎoshì zūnzhòng. Dì èr, yī gān ér jìn shì chéngyì, dàn bùnéng bī biérén hē. Dì sān, zhǔrén xiān jìng, ránhòu àn dìwèi shùn shízhēn.", english: "Many toasting rules. First, when toasting a senior, your glass should be lower than his — shows respect. Second, draining the cup shows sincerity, but don't force others. Third, the host toasts first, then by rank clockwise.", vi: "Quy tắc mời rượu nhiều. Thứ nhất, khi mời sếp, ly em phải thấp hơn ly anh ấy, thể hiện tôn trọng. Thứ hai, cạn ly là chân thành, nhưng không ép người khác uống. Thứ ba, chủ nhà mời trước, sau đó theo cấp bậc thuận chiều kim đồng hồ." },
      { speaker: "阮", chinese: "如果我不能喝酒呢?", pinyin: "Rúguǒ wǒ bùnéng hē jiǔ ne?", english: "What if I can't drink alcohol?", vi: "Nếu em không uống rượu thì sao?" },
      { speaker: "陈先生", chinese: "可以用茶或饮料代替, 说'我开车' 或 '我吃药' 都行。但你要主动敬酒, 表示尊重。不喝可以, 不敬不行。", pinyin: "Kěyǐ yòng chá huò yǐnliào dàitì, shuō 'wǒ kāichē' huò 'wǒ chī yào' dōu xíng. Dàn nǐ yào zhǔdòng jìngjiǔ, biǎoshì zūnzhòng. Bù hē kěyǐ, bù jìng bùxíng.", english: "You can use tea or juice as substitute, say 'I'm driving' or 'I'm on medication' — both work. But you must proactively toast to show respect. Not drinking is fine; not toasting isn't.", vi: "Có thể thay bằng trà hoặc nước, nói 'em lái xe' hoặc 'em đang uống thuốc' đều được. Nhưng em phải chủ động mời rượu, thể hiện tôn trọng. Không uống được, không mời thì không được." },
      { speaker: "阮", chinese: "原来面子工程这么细致。还有什么禁忌?", pinyin: "Yuánlái miànzi gōngchéng zhème xìzhì. Hái yǒu shénme jìnjì?", english: "So 'face project' is this detailed. Any other taboos?", vi: "Hóa ra chuyện thể diện chi tiết thế. Còn cấm kỵ gì nữa?" },
      { speaker: "陈先生", chinese: "不要在饭桌上谈太具体的合同细节, 那是 '杀风景'。先建立关系, 合同细节回会议室再谈。还有一点: 礼多人不怪, 你客套一点, 不会错。", pinyin: "Bù yào zài fànzhuō shàng tán tài jùtǐ de hétong xìjié, nà shì 'shā fēngjǐng'. Xiān jiànlì guānxi, hétong xìjié huí huìyìshì zài tán. Hái yǒu yī diǎn: lǐ duō rén bù guài, nǐ kètào yīdiǎn, bù huì cuò.", english: "Don't discuss contract specifics at the dinner table — that's 'killing the mood'. First build relationship, contract details back in meeting room. One more: excess courtesy bothers no one — being extra polite never hurts.", vi: "Đừng nói chi tiết hợp đồng cụ thể trên bàn ăn, đó là 'phá vibe'. Trước tiên xây quan hệ, chi tiết hợp đồng quay lại phòng họp mới nói. Một điều nữa: lễ nhiều người không trách, em lịch sự hơn một chút, không sai." },
      { speaker: "阮", chinese: "陈先生, 您今天教我的真是太宝贵了。", pinyin: "Chén xiānsheng, nín jīntiān jiāo wǒ de zhēn shì tài bǎoguì le.", english: "Mr. Chen, what you taught me today is truly precious.", vi: "Anh Trần, những điều anh dạy em hôm nay thật quý báu." },
      { speaker: "陈先生", chinese: "客气了。入境问禁, 你下次去深圳一定会顺利的。", pinyin: "Kèqì le. Rù jìng wèn jìn, nǐ xià cì qù Shēnzhèn yīdìng huì shùnlì de.", english: "Don't mention it. 'Ask about taboos when entering' — your Shenzhen trip will definitely go well.", vi: "Khách sáo quá. Vào cõi hỏi cấm kỵ, lần đi Thâm Quyến tới của em chắc chắn sẽ thuận lợi." }
    ],
    roleplay_prompts: [
      "Bạn lần đầu đến Trung Quốc đàm phán, được mời ăn tối với 6 người Trung Quốc trong đó có Tổng Giám đốc. Hãy diễn tập 30 giây đầu: chào hỏi, trao danh thiếp đúng cách, tìm vị trí ngồi (đợi chủ nhà sắp xếp, không tự ngồi vào ghế chính).",
      "Sếp Trung Quốc mời rượu Mao Đài (rượu mạnh) nhưng bạn không uống được. Hãy từ chối khéo: dùng lý do hợp lý ('em đang dùng kháng sinh'), nhưng vẫn nâng ly nước trà mời lại để giữ thể diện. KHÔNG để sếp cảm thấy bạn từ chối thiện chí.",
      "Bạn muốn tặng quà cho đối tác Trung Quốc nhân dịp ký hợp đồng. Hãy chọn quà phù hợp (cà phê G7 hộp 2 gói + lụa Vạn Phúc 2 cuốn) và soạn vài câu trao quà: '小小心意, 不成敬意, 请您笑纳' — câu khiêm tốn chuẩn."
    ],
    register_notes: "Lễ nghi kinh doanh Trung Quốc đặc biệt 'dày' so với Việt Nam — nhiều quy tắc nhỏ chi tiết. Người Việt thường quen với phong cách 'thân thiện, nhanh chóng', người Trung quen với 'chu đáo, có thứ tự'. Bạn phải chuyển sang chế độ Trung khi làm việc với họ.\n\n您 toàn bộ trong context business, kể cả với người ngang cấp lần đầu gặp. Chỉ chuyển sang 你 khi đã thực sự thân (nhiều bữa ăn, đã đi tour cùng nhau).\n\nCác cụm chuẩn lễ nghi:\n- Trao quà: '小小心意, 不成敬意, 请您笑纳' (chút lòng nhỏ, chưa xứng kính trọng, xin anh nhận cười)\n- Nhận quà: '您太客气了, 让您破费了' (anh khách sáo quá, làm anh tốn kém)\n- Mời rượu: '我先干为敬' (em uống cạn trước để tỏ kính); 'jingyige' (敬一个 — kính một ly)\n- Khi không uống được: '我开车不能喝, 以茶代酒' (em lái xe không uống được, dùng trà thay rượu)\n- Cảm ơn host: '让您破费了, 下次我做东' (làm anh tốn kém, lần sau em làm chủ)\n\nTránh tuyệt đối: (a) Tặng đồng hồ, ô, giày, dao, khăn tay (đều có ý xui); (b) Quà số 4 (tử = chết); (c) Bao bì trắng/đen (tang); (d) Tặng quà quá đắt (>1000 nhân dân tệ ở lần đầu = bị nghi hối lộ); (e) Nói số tiền trên quà ('cái này 500 tệ thôi') — vô lễ.",
    idiom_glosses: [
      {
        idiom: "礼多人不怪",
        literal: "lễ nhiều người không trách (lǐ duō rén bù guài)",
        meaning: "Quá lễ độ không ai trách — thà thừa lịch sự còn hơn thiếu. Triết lý dùng cho người mới học etiquette: khi không chắc, chọn cách lịch sự nhất. Sếp Trung Quốc rất thích người tuân theo nguyên tắc này.",
        example: "礼多人不怪, 客套一点没坏处。"
      },
      {
        idiom: "入境问禁",
        literal: "vào cõi hỏi cấm (rù jìng wèn jìn)",
        meaning: "Vào nơi nào nên hỏi điều cấm kỵ ở đó — chủ động tìm hiểu phong tục địa phương trước khi hành động. Cụm khuyến khích sự chuẩn bị, đặc biệt khi đến môi trường mới (Trung Quốc, công ty mới).",
        example: "入境问禁, 我提前问了同事很多礼仪。"
      },
      {
        idiom: "面子工程",
        literal: "công trình thể diện (miàn zi gōng chéng)",
        meaning: "Việc làm vì thể diện — đầu tư vào hình thức để giữ hoặc tạo thể diện. Thường mang nghĩa hơi tiêu cực ('phô trương'), nhưng trong context business là điều cần thiết. Dùng để miêu tả các nghi thức đãi khách trang trọng.",
        example: "中国商务里, 面子工程是必不可少的。"
      },
      {
        idiom: "客随主便",
        literal: "khách theo chủ tiện (kè suí zhǔ biàn)",
        meaning: "Khách tùy theo sự sắp xếp của chủ nhà — không tự đặt yêu cầu. Phẩm chất khách lý tưởng: linh hoạt, không khó tính. Khi bạn là khách ở Trung Quốc, đây là phương châm an toàn.",
        example: "我客随主便, 您安排什么我都行。"
      }
    ],
    cultural_notes_vi: "Lễ nghi kinh doanh Trung Quốc đại lục là 'lớp học' phức tạp nhất mà người Việt phải học khi làm ăn xuyên biên giới. Sáu khu vực dễ sai nhất: (1) DANH THIẾP — hai tay đưa, mặt chữ hướng đối phương, kèm 'qǐng duōduō zhǐjiào'. Nhận xong PHẢI đọc kỹ 5-10 giây, có thể bình luận ('哦, 您是负责...'), sau đó đặt trên bàn TRƯỚC MẶT (không cất ngay). Cất ngay = không tôn trọng. (2) VỊ TRÍ NGỒI — vị trí 'đầu bàn' (主位) đối diện cửa, dành cho người quan trọng nhất (host hoặc khách VIP). Khách quý ngồi BÊN PHẢI host, không đối diện. Người trẻ/cấp thấp ngồi gần cửa (để tiện đi lấy đồ). KHÔNG bao giờ tự chọn vị trí — đợi host sắp xếp. (3) GỌI MÓN — host gọi món, khách KHÔNG nên gọi (kể cả nếu host hỏi). Nếu host nhất định mời gọi, gọi 1 món rẻ tiền nhất. Số món bằng số người + 1 (8 người = 9 món, kèm 1 món súp + 1 món tráng miệng). Đặt mức giá phải xứng tầm khách — quá rẻ làm mất thể diện chính mình. (4) ĐŨA — KHÔNG cắm thẳng vào bát cơm (giống nhang thắp trong tang); KHÔNG để chéo nhau (xui); KHÔNG dùng đũa để chỉ vào người (vô lễ). KHÔNG xoay đĩa Lazy Susan ngược chiều kim đồng hồ. (5) RƯỢU — host mời ly đầu, sau đó cấp dưới đi mời từng cấp trên một. Mời rượu = tay phải cầm ly, tay trái đỡ đáy ly, ly thấp hơn ly đối phương. '我先干为敬' (em cạn trước để tỏ kính) — câu mở chuẩn. Nếu uống Mao Đài hoặc Erguotou (rượu mạnh), mỗi shot 30-50ml. (6) THANH TOÁN — chiến đấu trả tiền là phong tục. Bạn và host sẽ giả vờ tranh nhau. Người 'thắng' là host. Khách không bao giờ thực sự được trả — chỉ giả vờ.\n\nVề face: 'cho mặt' và 'mất mặt' chi phối tất cả. Cho mặt = công nhận giá trị/chức vụ của đối phương trước người khác (gọi đúng chức danh, dành chỗ ngồi tốt, mời rượu trước, khen công khai). Mất mặt = chỉ trích trước mặt người khác, từ chối thẳng đề xuất, để thấy điểm yếu trước số đông.\n\nVề quà: ngân sách lần đầu 200-500 nhân dân tệ; lần thứ 2-3 lên 500-1000; quan hệ thân 1000-2000. Đắt hơn = nghi hối lộ, ảnh hưởng quan hệ. Đặc sản Việt Nam (cà phê G7, lụa, tranh Đông Hồ) là an toàn vì 'lạ' với người Trung.",
    tip_advice_vi: "(1) HỌC THUỘC 10 cụm cứng trước khi đi Trung Quốc: '一路辛苦了', '请多多指教', '我先干为敬', '小小心意请您笑纳', '让您破费了', '客随主便', '入乡随俗', '礼多人不怪', '宾至如归', '后会有期'. Dùng đúng cụm = ấn tượng formal mạnh. (2) Mang theo 'gift kit' Việt Nam: 5-6 hộp quà nhỏ-vừa-lớn để chuẩn bị các tình huống. Gói sẵn bằng giấy đỏ (màu may mắn Trung Quốc), TUYỆT ĐỐI không trắng/đen. (3) Trước cuộc gặp, nghiên cứu cấp bậc của TẤT CẢ người sẽ tham dự + chức danh chính xác. Gọi sai chức danh ('Phó Tổng' thành 'Tổng', hay ngược lại) là lỗi nặng. Giấy ghi chú trong sổ tay là OK. (4) Đến SỚM 10-15 phút cho mọi cuộc hẹn. Trễ = thiếu tôn trọng nghiêm trọng (kể cả 5 phút). Nếu kẹt xe, gọi báo TRƯỚC khi trễ, không sau. (5) Trong bữa ăn, ĂN CHẬM, theo nhịp host. KHÔNG hết đồ trên đĩa của mình (nghĩa là chủ nhà chưa cho đủ). Cứ để lại 10-15% thức ăn = chủ nhà đãi đủ. KHÔNG xin thêm cơm khi sếp chưa xin. (6) Sau bữa ăn, gửi tin WeChat trong 24h: '王总, 昨晚的招待让我深受感动, 谢谢您的盛情' (cảm động vì sự đãi đằng tối qua, cảm ơn anh tận tình). Cụm '盛情' (shèngqíng — thịnh tình) là chuẩn formal. (7) Học thuộc 5 'gift taboos' (đồng hồ, ô, giày, dao, khăn tay) và 3 'số xui' (4, 14, 44). Dán bên trong wallet làm cheat sheet — KHÔNG để bị bắt gặp tặng nhầm.",
    exercises: [
      { type: "fill-blank", question: "礼多人不怪, 客套一点 ___ 错。", answer: "不会" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung lễ nghi với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "面子", pinyin: "miàn zi", english: "thể diện" },
          { chinese: "敬酒", pinyin: "jìng jiǔ", english: "mời rượu" },
          { chinese: "入境问禁", pinyin: "rù jìng wèn jìn", english: "vào cõi hỏi cấm kỵ" },
          { chinese: "客随主便", pinyin: "kè suí zhǔ biàn", english: "khách tùy chủ" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Trong làm ăn Trung Quốc, thể diện và quan hệ quan trọng hơn hợp đồng. Vào cõi hỏi cấm kỵ, em sẽ học hỏi trước khi đi.",
        chinese: "在中国做生意, 面子和关系比合同重要。入境问禁, 我会先了解再去。",
        pinyin: "Zài zhōng guó zuò shēng yi, miàn zi hé guān xi bǐ hé tong zhòng yào. Rù jìng wèn jìn, wǒ huì xiān liǎo jiě zài qù."
      }
    ]
  },
  {
    id: 66,
    level: "B2",
    category: "cultural_communication",
    title: "为文化误解道歉",
    pinyin: "wèi wén huà wù jiě dào qiàn",
    topic: "Apologizing for cultural misunderstanding",
    title_vi: "Xin lỗi vì hiểu lầm văn hóa",
    title_en: "Apologizing for a cultural misunderstanding",
    sentences: [
      {
        chinese: "王总, 昨天的事我深感抱歉, 是我考虑不周。",
        pinyin: "Wáng zǒng, zuótiān de shì wǒ shēn gǎn bàoqiàn, shì wǒ kǎolǜ bù zhōu.",
        english: "Director Wang, I deeply apologize about yesterday — I didn't consider thoroughly.",
        vi: "Tổng Vương, em xin lỗi sâu sắc về việc hôm qua, do em chưa suy nghĩ chu toàn.",
        pronunciation_focus: ["深感抱歉 → shēn gǎn bàoqiàn (xin lỗi sâu sắc)", "考虑不周 → kǎolǜ bù zhōu (suy nghĩ chưa chu toàn)", "昨天 → zuótiān", "事 → shì"]
      },
      {
        chinese: "我不知道送钟在中国是大忌讳, 没有恶意, 请您见谅。",
        pinyin: "Wǒ bù zhīdào sòng zhōng zài Zhōngguó shì dà jìhuì, méiyǒu èyì, qǐng nín jiànliàng.",
        english: "I didn't know giving a clock is a big taboo in China — no malice, please forgive me.",
        vi: "Em không biết tặng đồng hồ là điều đại kỵ ở Trung Quốc, em không có ý xấu, xin anh thông cảm.",
        pronunciation_focus: ["忌讳 → jìhuì (điều cấm kỵ)", "恶意 → èyì (ý xấu)", "见谅 → jiànliàng (thông cảm — formal)", "送钟 → sòng zhōng"]
      },
      {
        chinese: "知错就改, 我以后会更加用心了解贵国文化。",
        pinyin: "Zhī cuò jiù gǎi, wǒ yǐhòu huì gèngjiā yòngxīn liǎojiě guì guó wénhuà.",
        english: "Knowing the mistake, I'll change — from now on I'll more carefully learn about your country's culture.",
        vi: "Biết sai sửa ngay, em sau này sẽ chú tâm hơn để tìm hiểu văn hóa quý quốc.",
        pronunciation_focus: ["知错就改 → zhī cuò jiù gǎi (idiom)", "用心 → yòngxīn (chú tâm)", "贵国 → guì guó (quý quốc — formal)", "了解 → liǎojiě"]
      },
      {
        chinese: "希望这件事不会影响我们的合作关系。",
        pinyin: "Xīwàng zhè jiàn shì bù huì yǐngxiǎng wǒmen de hézuò guānxi.",
        english: "I hope this incident won't affect our cooperation.",
        vi: "Mong việc này không ảnh hưởng đến quan hệ hợp tác của chúng ta.",
        pronunciation_focus: ["影响 → yǐngxiǎng (ảnh hưởng)", "合作关系 → hézuò guānxi (quan hệ hợp tác)", "希望 → xīwàng", "事 → shì"]
      },
      {
        chinese: "化干戈为玉帛, 让我用诚意补救。",
        pinyin: "Huà gāngē wéi yùbó, ràng wǒ yòng chéngyì bǔjiù.",
        english: "Turn weapons into jade and silk — let me make amends with sincerity.",
        vi: "Hóa can qua thành ngọc lụa, để em dùng chân thành chuộc lại.",
        pronunciation_focus: ["化干戈为玉帛 → huà gāngē wéi yùbó (idiom: hóa giải xung đột)", "诚意 → chéngyì (chân thành)", "补救 → bǔjiù (chuộc lại)", "让 → ràng"]
      }
    ],
    vocab: [
      { chinese: "误解", pinyin: "wù jiě", english: "misunderstanding", vi: "hiểu lầm" },
      { chinese: "道歉", pinyin: "dào qiàn", english: "to apologize", vi: "xin lỗi" },
      { chinese: "深感抱歉", pinyin: "shēn gǎn bào qiàn", english: "deeply apologize", vi: "xin lỗi sâu sắc" },
      { chinese: "考虑不周", pinyin: "kǎo lǜ bù zhōu", english: "didn't consider thoroughly", vi: "suy nghĩ chưa chu toàn" },
      { chinese: "忌讳", pinyin: "jì huì", english: "taboo", vi: "điều cấm kỵ" },
      { chinese: "见谅", pinyin: "jiàn liàng", english: "please forgive (formal)", vi: "thông cảm" },
      { chinese: "知错就改", pinyin: "zhī cuò jiù gǎi", english: "know the mistake and change", vi: "biết sai sửa ngay" },
      { chinese: "将心比心", pinyin: "jiāng xīn bǐ xīn", english: "put heart against heart (empathy)", vi: "lấy lòng đo lòng" },
      { chinese: "化干戈为玉帛", pinyin: "huà gān gē wéi yù bó", english: "turn weapons into peace", vi: "hóa can qua thành ngọc lụa" },
      { chinese: "赔礼道歉", pinyin: "péi lǐ dào qiàn", english: "make formal apology", vi: "tạ lỗi xin lỗi" }
    ],
    dialogue: [
      { speaker: "黎", chinese: "王总, 昨天我送您的礼物, 请您先别拆。", pinyin: "Wáng zǒng, zuótiān wǒ sòng nín de lǐwù, qǐng nín xiān bié chāi.", english: "Director Wang, the gift I gave you yesterday — please don't open it yet.", vi: "Tổng Vương, quà em tặng anh hôm qua, xin anh khoan mở." },
      { speaker: "王总", chinese: "怎么了?", pinyin: "Zěnme le?", english: "What's the matter?", vi: "Có chuyện gì?" },
      { speaker: "黎", chinese: "那是个钟表, 我不知道在中国是忌讳。我深感抱歉。", pinyin: "Nà shì gè zhōngbiǎo, wǒ bù zhīdào zài Zhōngguó shì jìhuì. Wǒ shēn gǎn bàoqiàn.", english: "It's a clock — I didn't know it's taboo in China. I deeply apologize.", vi: "Đó là đồng hồ, em không biết ở Trung Quốc là điều kỵ. Em xin lỗi sâu sắc." },
      { speaker: "王总", chinese: "没关系, 你不知道情有可原。我们换个礼物就行。", pinyin: "Méi guānxi, nǐ bù zhīdào qíng yǒu kě yuán. Wǒmen huàn gè lǐwù jiù xíng.", english: "It's fine, your not knowing is understandable. Let's just exchange the gift.", vi: "Không sao, em không biết là có lý do. Mình đổi quà khác là được." }
    ],
    dialogue_long: [
      { speaker: "黎", chinese: "王总, 您好。我想跟您当面道歉。", pinyin: "Wáng zǒng, nín hǎo. Wǒ xiǎng gēn nín dāngmiàn dàoqiàn.", english: "Director Wang, hello. I'd like to apologize to you in person.", vi: "Tổng Vương, em chào anh. Em muốn xin lỗi anh trực tiếp." },
      { speaker: "王总", chinese: "怎么了, 小黎? 这么严肃。", pinyin: "Zěnme le, Xiǎo Lí? Zhème yánsù.", english: "What's wrong, Little Le? So serious.", vi: "Có chuyện gì vậy Tiểu Lê? Nghiêm trọng thế." },
      { speaker: "黎", chinese: "昨天的会议, 我直接当着所有人说您的方案有问题。事后我才意识到, 这在中国文化里是给您'丢面子'。", pinyin: "Zuótiān de huìyì, wǒ zhíjiē dāng zhe suǒyǒu rén shuō nín de fāng'àn yǒu wèntí. Shìhòu wǒ cái yìshí dào, zhè zài Zhōngguó wénhuà lǐ shì gěi nín 'diū miànzi'.", english: "Yesterday's meeting, I directly said your proposal had problems in front of everyone. Only afterward did I realize this caused you to 'lose face' in Chinese culture.", vi: "Cuộc họp hôm qua, em trực tiếp nói trước mặt mọi người rằng phương án của anh có vấn đề. Sau đó em mới nhận ra, trong văn hóa Trung Quốc đây là làm anh 'mất mặt'." },
      { speaker: "王总", chinese: "嗯, 你这样说我老实告诉你, 我当时是不太舒服。但你没意识到也情有可原。", pinyin: "Èn, nǐ zhèyàng shuō wǒ lǎoshi gàosu nǐ, wǒ dāngshí shì bù tài shūfu. Dàn nǐ méi yìshí dào yě qíng yǒu kě yuán.", english: "Hmm, since you ask, honestly I wasn't comfortable at that moment. But your not realizing is understandable.", vi: "Ừm, em hỏi vậy thì tôi thật thà nói, lúc đó tôi cũng không thoải mái. Nhưng em không nhận ra cũng có lý do." },
      { speaker: "黎", chinese: "我深感抱歉, 是我考虑不周。在越南我们直接讨论问题是常态, 但我应该入境问禁。", pinyin: "Wǒ shēn gǎn bàoqiàn, shì wǒ kǎolǜ bù zhōu. Zài Yuènán wǒmen zhíjiē tǎolùn wèntí shì chángtài, dàn wǒ yīnggāi rù jìng wèn jìn.", english: "I deeply apologize, didn't think it through. In Vietnam directly discussing problems is normal, but I should have asked about local taboos.", vi: "Em xin lỗi sâu sắc, em chưa suy nghĩ chu toàn. Ở Việt Nam thảo luận thẳng vấn đề là bình thường, nhưng em nên 'vào cõi hỏi cấm kỵ'." },
      { speaker: "王总", chinese: "你能这么想就很好。文化差异本来就需要时间适应。", pinyin: "Nǐ néng zhème xiǎng jiù hěn hǎo. Wénhuà chāyì běnlái jiù xūyào shíjiān shìyìng.", english: "Your thinking this way is good. Cultural differences naturally need time to adapt.", vi: "Em nghĩ thế là tốt rồi. Khác biệt văn hóa vốn cần thời gian thích nghi." },
      { speaker: "黎", chinese: "下次开会, 如果我对您的方案有不同意见, 我会先私下跟您讨论, 不再当众提。", pinyin: "Xià cì kāihuì, rúguǒ wǒ duì nín de fāng'àn yǒu bùtóng yìjiàn, wǒ huì xiān sīxià gēn nín tǎolùn, bù zài dāngzhòng tí.", english: "Next meeting, if I have different opinions on your proposal, I'll discuss with you privately first, not raise them publicly.", vi: "Cuộc họp tới, nếu em có ý kiến khác về phương án của anh, em sẽ thảo luận riêng với anh trước, không nêu trước mọi người nữa." },
      { speaker: "王总", chinese: "对, 这就是对的方式。我们中国人讲究 '内外有别', 内部讨论再公开决定。", pinyin: "Duì, zhè jiùshì duì de fāngshì. Wǒmen Zhōngguó rén jiǎngjiu 'nèiwài yǒu bié', nèibù tǎolùn zài gōngkāi juédìng.", english: "Yes, that's the right way. We Chinese value 'distinguish inside from outside' — discuss internally then publicly decide.", vi: "Đúng, đó mới là cách đúng. Người Trung Quốc bọn anh coi trọng 'nội ngoại có biệt' — thảo luận nội bộ rồi công khai quyết định." },
      { speaker: "黎", chinese: "我明白了。我也想用诚意补救。我准备了一份小礼物, 也想请您和团队共进晚餐, 让我重新表达诚意。", pinyin: "Wǒ míngbái le. Wǒ yě xiǎng yòng chéngyì bǔjiù. Wǒ zhǔnbèi le yī fèn xiǎo lǐwù, yě xiǎng qǐng nín hé tuánduì gòng jìn wǎncān, ràng wǒ chóngxīn biǎodá chéngyì.", english: "I understand. I'd like to make amends with sincerity. I've prepared a small gift, and would like to invite you and the team to dinner — let me re-express my sincerity.", vi: "Em hiểu rồi. Em cũng muốn dùng chân thành chuộc lại. Em đã chuẩn bị một món quà nhỏ, và mong mời anh và team ăn tối, để em thể hiện lại sự chân thành." },
      { speaker: "王总", chinese: "你不用这么客气。一次小误会不必这么认真。", pinyin: "Nǐ bùyòng zhème kèqì. Yī cì xiǎo wùhuì bù bì zhème rènzhēn.", english: "You don't need to be so formal. One small misunderstanding doesn't need this much seriousness.", vi: "Em không cần khách sáo thế. Một hiểu lầm nhỏ không cần nghiêm trọng vậy." },
      { speaker: "黎", chinese: "知错就改是基本。化干戈为玉帛, 我希望我们的合作能更顺畅。", pinyin: "Zhī cuò jiù gǎi shì jīběn. Huà gāngē wéi yùbó, wǒ xīwàng wǒmen de hézuò néng gèng shùnchàng.", english: "Knowing mistake and changing is basic. Turn weapons into peace — I hope our cooperation can be smoother.", vi: "Biết sai sửa ngay là căn bản. Hóa can qua thành ngọc lụa, em mong hợp tác mình thuận lợi hơn." },
      { speaker: "王总", chinese: "你这态度让我刮目相看。年轻人能这样反思就很难得。", pinyin: "Nǐ zhè tàidu ràng wǒ guāmù xiāngkàn. Niánqīng rén néng zhèyàng fǎnsī jiù hěn nándé.", english: "Your attitude makes me see you in a new light. Young people who can self-reflect like this are rare.", vi: "Thái độ của em khiến tôi nhìn em khác đi. Người trẻ biết phản tư như vậy là hiếm." },
      { speaker: "黎", chinese: "您过奖了。将心比心, 如果是我被人当众批评, 我也会不舒服。", pinyin: "Nín guòjiǎng le. Jiāng xīn bǐ xīn, rúguǒ shì wǒ bèi rén dāngzhòng pīpíng, wǒ yě huì bù shūfu.", english: "You flatter me. Heart compared to heart — if I were publicly criticized, I'd also feel bad.", vi: "Anh quá khen. Lấy lòng đo lòng, nếu em bị phê bình trước mọi người, em cũng sẽ không thoải mái." },
      { speaker: "王总", chinese: "这事就翻篇了。明晚我准时到, 团队一起去。", pinyin: "Zhè shì jiù fān piān le. Míng wǎn wǒ zhǔnshí dào, tuánduì yīqǐ qù.", english: "This matter is closed. Tomorrow night I'll arrive on time, team will go together.", vi: "Việc này coi như khép lại. Tối mai tôi sẽ đến đúng giờ, cả team cùng đi." },
      { speaker: "黎", chinese: "太好了, 谢谢王总的宽容。", pinyin: "Tài hǎo le, xièxie Wáng zǒng de kuānróng.", english: "Wonderful, thank you Director Wang for your tolerance.", vi: "Tuyệt quá, cảm ơn anh Vương đã rộng lòng." },
      { speaker: "王总", chinese: "客气什么。一来二去, 我们就成朋友了。", pinyin: "Kèqì shénme. Yī lái èr qù, wǒmen jiù chéng péngyou le.", english: "Don't mention it. Back and forth, we become friends.", vi: "Khách sáo gì. Qua lại vài lần, mình sẽ thành bạn." }
    ],
    roleplay_prompts: [
      "Bạn vô tình tặng đồng hồ cho khách Trung Quốc làm quà ký hợp đồng. Sau khi biết là điều kỵ, hãy gặp gỡ xin lỗi: thừa nhận lỗi không che giấu, giải thích bạn không có ý xấu, đề xuất đổi quà khác. Dùng cụm '深感抱歉' và '考虑不周'.",
      "Trong buổi tiệc, bạn quên không cụng ly với sếp Trung Quốc cấp cao nhất, gây 'mất mặt'. Sáng hôm sau, gọi cho thư ký sếp xin sắp xếp gặp riêng để xin lỗi. Dùng cụm '将心比心' và '化干戈为玉帛'.",
      "Đồng nghiệp Trung Quốc kể với bạn rằng bạn đã cho họ 'mất mặt' khi sửa lỗi tiếng Trung của họ trước mặt sếp. Bạn không cố ý nhưng đã sai. Hãy xin lỗi: thừa nhận lỗi cụ thể + cam kết thay đổi (sửa lỗi riêng tư) + đề xuất bù đắp (mời ăn trưa)."
    ],
    register_notes: "Xin lỗi qua văn hóa là tình huống nhạy cảm — phải vừa formal đủ để show respect, vừa chân thành để đối phương cảm nhận. Người Trung Quốc đặc biệt nhạy với tone xin lỗi: quá nhẹ = không thật lòng; quá nặng = giả tạo.\n\nThang formal của xin lỗi (từ nhẹ đến nặng):\n- '不好意思' (bù hǎoyìsi) — nhẹ, dùng cho lỗi nhỏ hàng ngày\n- '对不起' (duìbuqǐ) — chuẩn, đủ cho lỗi vừa\n- '抱歉' (bàoqiàn) — formal hơn, cho lỗi business\n- '深感抱歉' (shēn gǎn bàoqiàn) — sâu sắc, cho lỗi gây hậu quả\n- '诚挚地道歉' (chéngzhì de dàoqiàn) — chân thành xin lỗi, cho lỗi nghiêm trọng\n- '负荆请罪' (fù jīng qǐng zuì) — vác cành gai xin tội (cổ điển, chỉ dùng văn nói formal hoặc viết)\n\nCác cụm chuẩn:\n- '我深感抱歉, 是我考虑不周' (xin lỗi sâu sắc, do em chưa chu toàn) — xin lỗi + nhận trách nhiệm\n- '请您见谅' (xin anh thông cảm) — xin được tha thứ\n- '知错就改, 以后不会再犯' (biết sai sửa, sau không tái phạm) — cam kết\n- '我希望这件事不会影响我们的关系' (mong việc này không ảnh hưởng quan hệ) — đặt vấn đề lên bàn\n- '让我用行动补救' (để em dùng hành động chuộc lại) — đề xuất bù đắp cụ thể\n\nTránh: (a) Excuse quá nhiều ('vì A vì B vì C') — bị coi là không thật lòng; (b) 'Tôi không có ý đó' (我没那个意思) — phòng thủ thay vì nhận lỗi; (c) Xin lỗi qua tin nhắn cho lỗi nghiêm trọng — phải gặp trực tiếp.",
    idiom_glosses: [
      {
        idiom: "知错就改",
        literal: "biết sai liền sửa (zhī cuò jiù gǎi)",
        meaning: "Biết sai sửa ngay — phẩm chất quân tử, không che giấu lỗi. Cụm cam kết khi xin lỗi: thừa nhận + cam kết thay đổi. Người Trung Quốc đánh giá rất cao thái độ này.",
        example: "知错就改是基本道德。"
      },
      {
        idiom: "将心比心",
        literal: "lấy lòng đo lòng (jiāng xīn bǐ xīn)",
        meaning: "Lấy tâm mình đo tâm người — đặt mình vào vị trí người khác. Cụm thể hiện đồng cảm khi xin lỗi: 'nếu em là anh, em cũng sẽ buồn'. Tăng tính chân thành.",
        example: "将心比心, 我能理解您的感受。"
      },
      {
        idiom: "化干戈为玉帛",
        literal: "hóa can qua thành ngọc lụa (huà gān gē wéi yù bó)",
        meaning: "Biến vũ khí (干戈 — giáo mác) thành quà tặng (玉帛 — ngọc lụa) — chuyển xung đột thành hòa bình. Cụm cao cấp dùng khi muốn 'lật trang' sau xung đột. Văn vẻ — gây ấn tượng mạnh.",
        example: "希望我们能化干戈为玉帛, 重新合作。"
      },
      {
        idiom: "赔礼道歉",
        literal: "đền lễ xin lỗi (péi lǐ dào qiàn)",
        meaning: "Tạ lỗi xin lỗi — xin lỗi formal kèm hành động bù đắp. Mạnh hơn '道歉' đơn lẻ. Dùng khi lỗi nghiêm trọng cần 'compensation' (quà, mời ăn, dịch vụ).",
        example: "我专程来赔礼道歉, 请您原谅。"
      }
    ],
    cultural_notes_vi: "Xin lỗi qua văn hóa Việt-Trung khác biệt sâu sắc: ở Việt Nam, 'xin lỗi' thường nhanh và nhẹ ('xin lỗi nhé'); ở Trung Quốc, xin lỗi formal là sự kiện QUAN TRỌNG, đòi hỏi nghi thức. Sáu nguyên tắc: (1) GẶP TRỰC TIẾP khi lỗi nghiêm trọng (làm mất mặt, vi phạm taboo lớn). Tin nhắn/email = nửa hiệu lực. Gọi điện tốt hơn tin nhắn nhưng vẫn kém gặp mặt. (2) XIN LỖI RIÊNG nếu lỗi gây mất mặt công khai. KHÔNG xin lỗi trước nhiều người — đó là tự gây thêm mất mặt cho cả hai bên. (3) THỜI ĐIỂM xin lỗi: trong 24-48 giờ sau lỗi. Quá sớm (1-2 giờ) = chưa kịp suy nghĩ thấu đáo, có vẻ phản xạ. Quá muộn (>3 ngày) = đã quên, không quan tâm. 'Sweet spot' là sáng hôm sau. (4) CẤU TRÚC chuẩn: (a) thừa nhận lỗi cụ thể; (b) giải thích nguyên nhân (không bào chữa); (c) thừa nhận hậu quả; (d) cam kết thay đổi; (e) đề xuất bù đắp cụ thể. Thiếu bước nào = không đủ chân thành. (5) 'BÙ ĐẮP' (补救) phải có hành động cụ thể: mời ăn, tặng quà phù hợp, làm việc gì đó cho đối phương. Lời xin lỗi mà không có action = lời rỗng. (6) Sau khi nhận tha thứ, KHÔNG nhắc lại lỗi đó nữa. Người Trung Quốc đã 'lật trang' — bạn cũng phải lật. Nhắc lại = dằn vặt + làm họ khó chịu.\n\nMột số 'lỗi văn hóa' phổ biến của người Việt khi làm với người Trung: tặng đồng hồ/ô/giày (taboo), phê bình công khai (làm mất mặt), gọi sếp bằng nickname trẻ trung (thiếu tôn trọng), từ chối rượu thẳng thừng (không cho mặt host), không trả lời WeChat trong nhiều giờ (xem nhẹ quan hệ), mặc áo trắng/đen tới tiệc (màu tang), tặng quà số 4 (xui).\n\nVề 'face' và xin lỗi: lỗi làm 'mất mặt' (丢面子) là lỗi nặng nhất trong văn hóa Trung Quốc — nặng hơn lỗi tiền/thời gian. Nếu bạn vô tình làm sếp/đối tác mất mặt trước người khác, xin lỗi RIÊNG + bồi thường bằng cách cho họ MẶT lại trong dịp tiếp theo (khen công khai, mời nói trước đoàn, đặt họ ở vị trí trang trọng).\n\nVề tha thứ: người Trung Quốc thường nói 'không sao' (没关系) ngay cả khi vẫn còn buồn — đây là phép lịch sự, không phải tha thứ thật. Quan sát hành vi tiếp theo: họ vẫn mời bạn ăn, vẫn invite bạn vào dự án = đã tha thứ thật. Họ né tránh, không trả lời tin nhắn = chưa tha thứ, cần xin lỗi sâu hơn.",
    tip_advice_vi: "(1) ĐỪNG xin lỗi quá nhanh trên WeChat ngay sau lỗi — bị coi là phản xạ thiếu suy nghĩ. Đợi 12-24 giờ, gọi điện hoặc gặp trực tiếp. (2) Chuẩn bị 4 phần cho lời xin lỗi: thừa nhận cụ thể (lỗi gì) + nguyên nhân (không bào chữa) + cam kết thay đổi + đề xuất bù đắp. Mỗi phần 1-2 câu, tổng 4-8 câu. (3) Ngôn ngữ thân thể: cúi đầu nhẹ khi xin lỗi (15-30 độ), nhìn vào mắt, KHÔNG cười. Nụ cười tự nhiên của người Việt có thể bị hiểu lầm là không nghiêm túc. (4) Nếu lỗi liên quan đến tiền/business loss, phải có 'compensation' cụ thể: trả lại tiền, làm thêm dịch vụ miễn phí, giảm giá lần sau. Lời xin lỗi không + bù đắp = không đủ. (5) KHÔNG kể với người khác về lỗi của bạn (kể cả bạn bè) trước khi đối phương đã tha thứ. Người Trung Quốc rất ghét chuyện riêng bị lan truyền. (6) Sau khi nhận tha thứ, gửi tin WeChat trong 24-48h: '王总, 您的宽容让我深受感动。我会记住这次教训, 以后绝不再犯' (sự rộng lòng của anh khiến em xúc động. Em sẽ ghi nhớ bài học, sẽ không tái phạm). Đóng vòng tròn quan trọng. (7) Tránh '过度补救' (overcompensation) — tặng quà đắt sau khi xin lỗi sẽ bị coi là 'mua chuộc'. Quà nên ngang giá trị thông thường (200-500 tệ), tập trung vào sự chu đáo (đặc sản Việt, thư tay, ảnh cá nhân) thay vì giá tiền.",
    exercises: [
      { type: "fill-blank", question: "知错就改, 我以后会更加 ___ 了解贵国文化。", answer: "用心" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung xin lỗi với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "深感抱歉", pinyin: "shēn gǎn bào qiàn", english: "xin lỗi sâu sắc" },
          { chinese: "考虑不周", pinyin: "kǎo lǜ bù zhōu", english: "suy nghĩ chưa chu toàn" },
          { chinese: "知错就改", pinyin: "zhī cuò jiù gǎi", english: "biết sai sửa ngay" },
          { chinese: "化干戈为玉帛", pinyin: "huà gān gē wéi yù bó", english: "hóa can qua thành ngọc lụa" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em xin lỗi sâu sắc vì việc hôm qua, do em chưa suy nghĩ chu toàn. Em không có ý xấu, xin anh thông cảm.",
        chinese: "我为昨天的事深感抱歉, 是我考虑不周。我没有恶意, 请您见谅。",
        pinyin: "Wǒ wèi zuó tiān de shì shēn gǎn bào qiàn, shì wǒ kǎo lǜ bù zhōu. Wǒ méi yǒu è yì, qǐng nín jiàn liàng."
      }
    ]
  },
  {
    id: 68,
    level: "B2",
    category: "cultural_communication",
    title: "宴请中国客人",
    pinyin: "yàn qǐng zhōng guó kè rén",
    topic: "Banquet etiquette with Chinese guests",
    title_vi: "Đãi tiệc khách Trung Quốc",
    title_en: "Banquet etiquette with Chinese guests",
    sentences: [
      {
        chinese: "王总, 这是您的座位, 主位面对门, 我坐您旁边。",
        pinyin: "Wáng zǒng, zhè shì nín de zuòwèi, zhǔ wèi miàn duì mén, wǒ zuò nín pángbiān.",
        english: "Director Wang, this is your seat — main seat faces the door, I'll sit beside you.",
        vi: "Tổng Vương, đây là chỗ của anh, vị trí chính đối diện cửa, em ngồi bên cạnh anh.",
        pronunciation_focus: ["主位 → zhǔ wèi (vị trí chính)", "面对门 → miàn duì mén (đối diện cửa)", "座位 → zuòwèi (chỗ ngồi)", "旁边 → pángbiān"]
      },
      {
        chinese: "我先敬您一杯, 感谢您一直以来对我们公司的支持。",
        pinyin: "Wǒ xiān jìng nín yī bēi, gǎnxiè nín yīzhí yǐlái duì wǒmen gōngsī de zhīchí.",
        english: "Let me first toast you, thanking you for your continued support of our company.",
        vi: "Em mời anh ly đầu, cảm ơn anh đã luôn ủng hộ công ty bọn em.",
        pronunciation_focus: ["敬您一杯 → jìng nín yī bēi (mời anh một ly)", "一直以来 → yīzhí yǐlái (từ trước đến nay)", "支持 → zhīchí (ủng hộ)", "感谢 → gǎnxiè"]
      },
      {
        chinese: "我先干为敬, 请您随意。",
        pinyin: "Wǒ xiān gān wéi jìng, qǐng nín suíyì.",
        english: "I'll drink up first to show respect — you drink as you wish.",
        vi: "Em cạn trước để tỏ kính, mời anh tùy ý.",
        pronunciation_focus: ["干 → gān (cạn ly)", "为敬 → wéi jìng (làm cho kính)", "随意 → suíyì (tùy ý)", "请您 → qǐng nín"]
      },
      {
        chinese: "这是越南特色菜, 河粉、春卷、和鱼露酱, 您尝尝。",
        pinyin: "Zhè shì Yuènán tèsè cài, héfěn, chūnjuǎn, hé yúlù jiàng, nín chángchang.",
        english: "These are Vietnamese specialties — pho, spring rolls, and fish sauce. Please try.",
        vi: "Đây là món đặc sản Việt Nam — phở, nem rán, và nước mắm, mời anh nếm thử.",
        pronunciation_focus: ["特色菜 → tèsè cài (món đặc sản)", "河粉 → héfěn (phở)", "春卷 → chūnjuǎn (nem rán)", "鱼露 → yúlù (nước mắm)"]
      },
      {
        chinese: "推杯换盏间, 朋友的情谊就建立起来了。",
        pinyin: "Tuī bēi huàn zhǎn jiān, péngyou de qíngyì jiù jiànlì qǐlái le.",
        english: "Through toasts and cups exchanged, friendship is built.",
        vi: "Trong những lúc nâng ly đổi chén, tình bạn được xây dựng.",
        pronunciation_focus: ["推杯换盏 → tuī bēi huàn zhǎn (idiom: nâng ly đổi chén)", "情谊 → qíngyì (tình nghĩa)", "建立 → jiànlì (xây dựng)", "朋友 → péngyou"]
      }
    ],
    vocab: [
      { chinese: "宴请", pinyin: "yàn qǐng", english: "to invite to a banquet", vi: "đãi tiệc" },
      { chinese: "主位", pinyin: "zhǔ wèi", english: "main seat", vi: "vị trí chính" },
      { chinese: "敬酒", pinyin: "jìng jiǔ", english: "to propose a toast", vi: "mời rượu" },
      { chinese: "干杯", pinyin: "gān bēi", english: "cheers / bottoms up", vi: "cạn ly" },
      { chinese: "随意", pinyin: "suí yì", english: "as you wish", vi: "tùy ý" },
      { chinese: "特色菜", pinyin: "tè sè cài", english: "specialty dish", vi: "món đặc sản" },
      { chinese: "买单", pinyin: "mǎi dān", english: "to pay the bill", vi: "thanh toán" },
      { chinese: "推杯换盏", pinyin: "tuī bēi huàn zhǎn", english: "exchange toasts", vi: "nâng ly đổi chén" },
      { chinese: "觥筹交错", pinyin: "gōng chóu jiāo cuò", english: "cups and chopsticks intermingled (lively banquet)", vi: "chén đũa giao thoa (tiệc náo nhiệt)" },
      { chinese: "一干而尽", pinyin: "yī gān ér jìn", english: "drain in one go", vi: "cạn một hơi" }
    ],
    dialogue: [
      { speaker: "黎", chinese: "王总, 请这边坐, 这是主位。", pinyin: "Wáng zǒng, qǐng zhè biān zuò, zhè shì zhǔ wèi.", english: "Director Wang, please sit here — this is the main seat.", vi: "Tổng Vương, mời anh ngồi bên này, đây là vị trí chính." },
      { speaker: "王总", chinese: "我坐主位不合适吧?", pinyin: "Wǒ zuò zhǔ wèi bù héshì ba?", english: "Me at the main seat isn't appropriate, right?", vi: "Tôi ngồi vị trí chính không phù hợp đâu nhỉ?" },
      { speaker: "黎", chinese: "您是远道而来的贵客, 主位非您莫属。我先敬您一杯。", pinyin: "Nín shì yuǎndào ér lái de guìkè, zhǔ wèi fēi nín mò shǔ. Wǒ xiān jìng nín yī bēi.", english: "You're a distinguished guest from afar — the main seat is yours by right. Let me toast you first.", vi: "Anh là khách quý phương xa, vị trí chính không thể không phải anh. Em mời anh ly đầu." },
      { speaker: "王总", chinese: "好, 干杯! 中越友谊!", pinyin: "Hǎo, gānbēi! Zhōng-yuè yǒuyì!", english: "Good, cheers! China-Vietnam friendship!", vi: "Được, cạn ly! Tình hữu nghị Việt-Trung!" }
    ],
    dialogue_long: [
      { speaker: "黎", chinese: "王总, 张总, 各位, 欢迎来到这家越南最有名的海鲜餐厅! 王总, 您是我们今晚的主宾, 请坐主位。", pinyin: "Wáng zǒng, Zhāng zǒng, gè wèi, huānyíng lái dào zhè jiā Yuènán zuì yǒumíng de hǎixiān cāntīng! Wáng zǒng, nín shì wǒmen jīn wǎn de zhǔ bīn, qǐng zuò zhǔ wèi.", english: "Director Wang, Director Zhang, everyone, welcome to Vietnam's most famous seafood restaurant! Director Wang, you're our main guest tonight — please take the main seat.", vi: "Tổng Vương, Tổng Trương, các vị, hoan nghênh đến nhà hàng hải sản nổi tiếng nhất Việt Nam! Tổng Vương, anh là khách chính tối nay, mời anh ngồi vị trí chính." },
      { speaker: "王总", chinese: "黎总, 您太客气了。", pinyin: "Lí zǒng, nín tài kèqì le.", english: "Director Le, you're too polite.", vi: "Tổng Lê, anh khách sáo quá." },
      { speaker: "黎", chinese: "应该的。这边是张总的位置, 这边是李总。我陪坐在王总旁边, 方便给您介绍菜。", pinyin: "Yīnggāi de. Zhè biān shì Zhāng zǒng de wèizhì, zhè biān shì Lǐ zǒng. Wǒ péi zuò zài Wáng zǒng pángbiān, fāngbiàn gěi nín jièshào cài.", english: "It's proper. This side is Director Zhang's seat, this side Director Li. I'll sit next to Director Wang, convenient to introduce the dishes.", vi: "Phải vậy chứ. Bên này là chỗ Tổng Trương, bên này Tổng Lý. Em ngồi cạnh Tổng Vương, tiện giới thiệu món." },
      { speaker: "黎", chinese: "今天我点了越南最经典的菜: 牛肉河粉、春卷、烤虾、和椰汁鸡。请大家慢慢享用!", pinyin: "Jīntiān wǒ diǎn le Yuènán zuì jīngdiǎn de cài: niúròu héfěn, chūnjuǎn, kǎo xiā, hé yēzhī jī. Qǐng dàjiā mànman xiǎngyòng!", english: "Today I ordered Vietnam's most classic dishes: beef pho, spring rolls, grilled shrimp, and coconut chicken. Please enjoy slowly!", vi: "Hôm nay em đã gọi những món Việt kinh điển nhất: phở bò, nem rán, tôm nướng, và gà nấu nước cốt dừa. Mời các vị từ từ thưởng thức!" },
      { speaker: "王总", chinese: "看起来真丰盛! 黎总, 您破费了。", pinyin: "Kàn qǐlái zhēn fēngshèng! Lí zǒng, nín pòfèi le.", english: "Looks really sumptuous! Director Le, you've spent too much.", vi: "Trông thật thịnh soạn! Tổng Lê, anh tốn kém rồi." },
      { speaker: "黎", chinese: "您远道而来, 应该的。我先敬您一杯, 感谢您和团队对我们公司的长期支持! 我先干为敬。", pinyin: "Nín yuǎndào ér lái, yīnggāi de. Wǒ xiān jìng nín yī bēi, gǎnxiè nín hé tuánduì duì wǒmen gōngsī de chángqī zhīchí! Wǒ xiān gān wéi jìng.", english: "You came from afar, it's only right. Let me toast you first, thanking you and your team for long-term support of our company! I'll drain mine first to show respect.", vi: "Anh đến từ xa, là phải vậy. Em mời anh ly đầu, cảm ơn anh và team đã ủng hộ công ty bọn em lâu dài! Em cạn trước để tỏ kính." },
      { speaker: "王总", chinese: "黎总太客气了。我也回敬您一杯, 祝合作长长久久, 互利共赢!", pinyin: "Lí zǒng tài kèqì le. Wǒ yě huí jìng nín yī bēi, zhù hézuò cháng cháng jiǔ jiǔ, hùlì gòngyíng!", english: "Director Le, too polite. I'll toast you back — wishing long-lasting cooperation, win-win!", vi: "Tổng Lê khách sáo quá. Tôi cũng mời lại anh ly nữa, chúc hợp tác dài lâu, đôi bên cùng có lợi!" },
      { speaker: "黎", chinese: "干杯! 王总, 您尝尝这个春卷, 这是河内特色的, 蘸鱼露最好吃。", pinyin: "Gānbēi! Wáng zǒng, nín chángchang zhège chūnjuǎn, zhè shì Hénèi tèsè de, zhàn yúlù zuì hǎochī.", english: "Cheers! Director Wang, try this spring roll — Hanoi specialty, dipping in fish sauce is best.", vi: "Cạn ly! Tổng Vương, anh nếm cái nem này, đặc sản Hà Nội, chấm nước mắm ngon nhất." },
      { speaker: "王总", chinese: "鱼露? 我有点不敢吃, 听说味道很冲。", pinyin: "Yúlù? Wǒ yǒudiǎn bù gǎn chī, tīngshuō wèidao hěn chōng.", english: "Fish sauce? I'm a bit hesitant, heard the taste is strong.", vi: "Nước mắm? Tôi hơi không dám ăn, nghe nói vị mạnh lắm." },
      { speaker: "黎", chinese: "您试一小口, 不喜欢就不吃。我特地让餐厅做了清淡版的鱼露, 加了酸甜的味道。", pinyin: "Nín shì yī xiǎo kǒu, bù xǐhuan jiù bù chī. Wǒ tèdì ràng cāntīng zuò le qīngdàn bǎn de yúlù, jiā le suāntián de wèidao.", english: "Try a small bite, don't eat if you don't like. I specifically asked the restaurant for a light version of fish sauce, with sweet-sour flavor.", vi: "Anh thử một miếng nhỏ, không thích thì thôi. Em đã đặc biệt bảo nhà hàng làm phiên bản nhẹ của nước mắm, thêm vị chua ngọt." },
      { speaker: "王总", chinese: "好... 嗯! 比想象中好吃很多! 你这个心思真细致。", pinyin: "Hǎo... èn! Bǐ xiǎngxiàng zhōng hǎochī hěn duō! Nǐ zhège xīnsi zhēn xìzhì.", english: "Okay... Mmm! Better than I imagined! Your thoughtfulness is really detailed.", vi: "Được... mmm! Ngon hơn tôi tưởng nhiều! Em chu đáo thật." },
      { speaker: "张总", chinese: "黎总确实是好东道主。我也敬您一杯, 谢谢今晚的招待!", pinyin: "Lí zǒng quèshí shì hǎo dōngdào zhǔ. Wǒ yě jìng nín yī bēi, xièxie jīn wǎn de zhāodài!", english: "Director Le is truly a good host. I'll toast you too, thanks for tonight's hospitality!", vi: "Tổng Lê quả thực là chủ nhà tốt. Tôi cũng mời anh ly nữa, cảm ơn sự tiếp đãi tối nay!" },
      { speaker: "黎", chinese: "客气客气! 我陪张总一杯。来, 干!", pinyin: "Kèqi kèqi! Wǒ péi Zhāng zǒng yī bēi. Lái, gān!", english: "Don't be so polite! I'll match Director Zhang's toast. Come, cheers!", vi: "Khách sáo quá! Em cùng Tổng Trương một ly. Nào, cạn!" },
      { speaker: "王总", chinese: "黎总, 您这酒量真不错。", pinyin: "Lí zǒng, nín zhè jiǔliàng zhēn bùcuò.", english: "Director Le, your tolerance is really good.", vi: "Tổng Lê, tửu lượng anh thật khá." },
      { speaker: "黎", chinese: "陪两位喝, 我哪有不尽心的道理。推杯换盏间, 朋友的情谊就深了。来, 我再敬大家最后一杯!", pinyin: "Péi liǎng wèi hē, wǒ nǎ yǒu bù jìnxīn de dàolǐ. Tuī bēi huàn zhǎn jiān, péngyou de qíngyì jiù shēn le. Lái, wǒ zài jìng dàjiā zuìhòu yī bēi!", english: "Drinking with you two, how can I not give my all? Through toasts and cups exchanged, friendship deepens. Come, let me toast everyone one last time!", vi: "Tiếp hai anh uống, em sao có thể không tận tâm. Trong nâng ly đổi chén, tình bạn sâu thêm. Nào, em mời mọi người ly cuối!" },
      { speaker: "王总", chinese: "干! 中越友谊万岁!", pinyin: "Gān! Zhōng-yuè yǒuyì wànsuì!", english: "Cheers! China-Vietnam friendship forever!", vi: "Cạn! Tình hữu nghị Việt-Trung vạn tuế!" }
    ],
    roleplay_prompts: [
      "Bạn host bữa tối với 4 khách Trung Quốc tại nhà hàng cao cấp Hà Nội. Hãy diễn tập phần đầu: dẫn khách vào, sắp xếp chỗ ngồi (chỉ rõ ai ngồi đâu), gọi món đầu tiên (giới thiệu 1-2 món Việt cho khách + để khách chọn 1 món). Tránh hỏi 'gọi gì' chung chung — chủ động đề xuất.",
      "Khách Trung Quốc cấp cao mời bạn uống Mao Đài (rượu trắng cay). Bạn không quen rượu mạnh nhưng phải tỏ thiện chí. Hãy nâng ly cùng (一干而尽 không bắt buộc), uống 1/3 thay vì cạn, dùng cụm '我酒量有限, 但心意一样'. Sau đó mời lại bằng nước trà hoặc bia nhẹ.",
      "Cuối bữa, khách Trung Quốc đòi trả tiền (chiến đấu trả tiền). Hãy 'chiến' để giữ thể diện host: cương quyết nhận hóa đơn, dùng cụm '远来是客, 这次我做东', đề xuất 'lần sau anh đến Trung Quốc anh mời em'. Tránh để khách thực sự trả — host thua = mất mặt."
    ],
    register_notes: "Bữa tiệc business Trung Quốc là sự kiện 'làm ăn dưới dạng ăn'. Mọi quyết định lớn xảy ra ở đây, không phải phòng họp. Phải xử lý cả ngôn ngữ + nghi thức cùng lúc.\n\nCác cụm chuẩn cho host:\n- Dẫn vào ghế: '王总, 这是您的座位, 主位面对门'\n- Mời ăn: '请大家慢慢享用'; '尝尝这个特色菜'\n- Mời rượu lần đầu: '我先敬您一杯, 感谢您...'; '我先干为敬, 请您随意'\n- Đáp lại khi khách mời: '客气客气, 我陪您一杯'\n- Khi khách khen: '哪里哪里, 您过奖了'\n- Cạn ly cuối: '最后一杯, 祝合作圆满成功'\n\nCác cụm chuẩn cho khách:\n- Nhận chỗ chính: '不好意思打扰您们了, 我坐这里合适吗?'\n- Mời lại host: '我也回敬黎总一杯'\n- Khi không uống được: '我酒量有限, 以茶代酒'\n- Khi từ chối nhẹ: '心意我领了, 我自己量力'\n- Cảm ơn cuối: '今晚让黎总破费了, 改天我做东'\n\nQuy tắc rượu chi tiết:\n- 干 (gān) = cạn 100%; 随意 (suíyì) = tùy ý uống; 浅尝 (qiǎncháng) = nếm chút thôi\n- Khi mời sếp/khách quý: ly mình thấp hơn ly họ 2-3cm\n- Mời rượu phải KÈM lý do (cảm ơn, chúc, kỷ niệm) — không mời 'cho có'\n- Một lượt mời: chủ → khách quý → cấp cao → cấp thấp; sau đó khách quý mời lại\n- 一干而尽 chỉ dùng cho ly đầu hoặc ly đặc biệt; không cạn ly mọi lúc\n\nTránh: (a) Mời chéo bàn (mời người ngồi đối diện, qua mặt người bên cạnh); (b) Đổ rượu vào ly đầy của người khác; (c) Để ly mình rỗng quá lâu (mỗi 5-10 phút có lượt mời mới); (d) Đứng dậy đi vệ sinh trong khi sếp đang nói; (e) Bật điện thoại liên tục.",
    idiom_glosses: [
      {
        idiom: "推杯换盏",
        literal: "đẩy ly đổi chén (tuī bēi huàn zhǎn)",
        meaning: "Nâng ly và đổi chén — biểu tượng của bữa tiệc náo nhiệt, mời rượu qua lại. Cụm dùng để mô tả tình bạn xây qua bữa rượu: 'trong nâng ly đổi chén, tình bạn nảy sinh'. Văn vẻ — nâng tầm phát biểu.",
        example: "推杯换盏间, 朋友的情谊就深了。"
      },
      {
        idiom: "觥筹交错",
        literal: "chén đũa giao thoa (gōng chóu jiāo cuò)",
        meaning: "Chén rượu (觥) và thẻ thưởng rượu (筹) giao thoa — tiệc rượu náo nhiệt, vui vẻ. Cụm cao cấp hơn 推杯换盏, dùng trong context formal hoặc văn học để mô tả không khí tiệc.",
        example: "今晚觥筹交错, 大家都很尽兴。"
      },
      {
        idiom: "一干而尽",
        literal: "một cạn hết (yī gān ér jìn)",
        meaning: "Cạn một hơi — uống cạn ly trong một ngụm. Thể hiện thiện chí cao nhất. Tuy nhiên ở Trung Quốc đại lục hiện nay không bắt buộc với khách nước ngoài — bạn có thể uống tùy lượng.",
        example: "我先一干而尽, 请您随意。"
      },
      {
        idiom: "客随主便",
        literal: "khách tùy chủ tiện (kè suí zhǔ biàn)",
        meaning: "Khách tùy theo sự sắp xếp của chủ — không tự ý đặt yêu cầu. Phẩm chất khách lý tưởng. Khi bạn là khách Trung Quốc tại nhà người Việt, dùng cụm này thể hiện sự khiêm tốn.",
        example: "我客随主便, 您安排什么我都喜欢。"
      }
    ],
    cultural_notes_vi: "Bữa tiệc Trung Quốc là môi trường nhiều quy tắc nhất bạn sẽ gặp. Bảy nguyên tắc cốt lõi: (1) VỊ TRÍ NGỒI: chủ nhà ngồi đối diện cửa (giúp ai vào cũng nhìn thấy chủ); khách quý nhất ngồi BÊN PHẢI chủ nhà; thứ tự cấp bậc giảm dần đi xuống vòng tròn theo chiều kim đồng hồ. Cấp thấp nhất ngồi gần cửa (để tiện đi lấy đồ, gọi nhân viên). (2) GỌI MÓN: chủ nhà gọi 100% trong lần đầu. Số món = số người + 1 (8 người = 9 món, kèm súp + tráng miệng). Có cá nguyên con (鱼 ngụ ý 余 = dư dả), gà nguyên con (鸡 ngụ ý 吉 = may mắn), súp cuối bữa (chuẩn bị xong cho 'kết'). (3) ĐŨA: nâng đũa khi chủ nhà đã nâng; KHÔNG cắm đũa thẳng vào cơm; KHÔNG để chéo nhau; KHÔNG dùng đũa chỉ vào người. Đặt đũa ngang trên giá đũa khi nghỉ. (4) RƯỢU: chủ nhà mời ly đầu (开场); cạn 100% ly đầu = thể hiện thiện chí cao nhất. Sau đó cấp dưới đi mời cấp trên từng người một; cấp trên có thể uống ít hơn (随意). Mỗi lượt mời PHẢI có lý do (cảm ơn, chúc, kỷ niệm) — mời 'cho có' bị coi là thiếu chân thành. (5) THANH TOÁN: chiến đấu trả tiền là phong tục — chủ và khách giả vờ tranh nhau. Người 'thắng' = chủ. Cách 'chiến' đúng: gọi nhân viên TRƯỚC khi khách kịp đứng dậy, đưa thẻ riêng, KHÔNG để khách thấy hóa đơn. Tip: 5-10% là chuẩn (Trung Quốc đại lục thấp hơn phương Tây). (6) RỜI BÀN: khách quý đứng dậy trước, các người khác theo sau. KHÔNG đứng dậy giữa bữa khi sếp đang phát biểu. (7) FOLLOW-UP: gửi tin WeChat trong 24h cảm ơn cụ thể: '王总, 昨晚的招待让我深受感动, 谢谢您的盛情'.\n\nVề rượu Mao Đài (茅台): rượu trắng cay 53% cồn, biểu tượng rượu Trung Quốc. Một shot 30-50ml, uống cạn. Nếu bạn không quen: (a) ăn nhiều trước khi uống (cơm, mỡ); (b) uống nước trà giữa các shot; (c) thừa nhận 'em không quen rượu mạnh' từ đầu và xin được uống ít — thật thà tốt hơn say. KHÔNG say tại bữa business — mất uy tín mãi.\n\nVề khách nữ: ở Trung Quốc đại lục hiện nay phụ nữ uống rượu cũng được chấp nhận, nhưng có thể từ chối lịch sự bằng '我酒量不好' hoặc 'with茶代酒' — không bị áp lực như Hàn Quốc/Nhật.\n\nKhác Việt Nam: ở Việt Nam, bữa nhậu thường thoải mái, mọi người tự rót rượu cho mình. Ở Trung Quốc, không bao giờ tự rót — luôn rót cho người bên cạnh, họ rót lại cho bạn. Rót cho mình = thiếu tinh tế.",
    tip_advice_vi: "(1) ĐẶT BÀN trước 1 tuần — phòng riêng (包间) không chung sảnh. Phòng riêng = thể diện cho khách + tiện thảo luận business. Đặt bàn tròn (圆桌) thay vì vuông — mọi người ngồi bình đẳng. (2) CHUẨN BỊ menu trước với restaurant manager: 8-10 món cho 6-8 người, đa dạng (rau, thịt, hải sản, súp, tráng miệng), 1-2 món Việt đặc sản (phở/nem) và 1-2 món gần phong cách Trung (gà nướng, cá hấp). Tránh món 'lạ' (mắm tôm, lươn). (3) MUA RƯỢU phù hợp: khách Trung Quốc cấp cao = Mao Đài (đắt nhưng đáng); cấp trung = rượu Trung Quốc khác (五粮液, 国窖); người không thích rượu mạnh = bia hoặc rượu vang. Đừng tiếc tiền rượu — đây là phần đầu tư quan trọng nhất. (4) CHUẨN BỊ 5-7 toast/lý do cụ thể trước: cảm ơn, chúc sức khỏe, chúc hợp tác, kỷ niệm gặp gỡ, chúc gia đình khách, chúc thành công dự án, chúc về Trung Quốc bình an. Mỗi lý do dùng 1 lần, không lặp. (5) NGỒI BÊN PHẢI khách chính (vị trí 'tay phải' của chủ) — vai trò 'phó host' giúp giới thiệu món, mời rượu, dịch tiếng. KHÔNG để khách phải hỏi 'cái này là gì'. (6) Trong bữa, dành ~70% thời gian cho personal/cultural topics (gia đình, du lịch, ẩm thực, văn hóa), ~30% cho business — đảo ngược tỉ lệ là sai văn hóa Trung Quốc. (7) SAU bữa, đưa khách về khách sạn (kể cả nếu họ tự đi được). Nếu khách say, sắp xếp bữa sáng nhẹ ngày hôm sau (cháo, bánh bao) — đây là chi tiết khách quý nhớ lâu.",
    exercises: [
      { type: "fill-blank", question: "我先 ___ 为敬, 请您随意。", answer: "干" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung tiệc rượu với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "主位", pinyin: "zhǔ wèi", english: "vị trí chính (đối diện cửa)" },
          { chinese: "敬酒", pinyin: "jìng jiǔ", english: "mời rượu" },
          { chinese: "推杯换盏", pinyin: "tuī bēi huàn zhǎn", english: "nâng ly đổi chén" },
          { chinese: "买单", pinyin: "mǎi dān", english: "thanh toán" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Tổng Vương, em mời anh ly đầu, cảm ơn anh đã ủng hộ công ty bọn em. Em cạn trước để tỏ kính, mời anh tùy ý.",
        chinese: "王总, 我先敬您一杯, 感谢您对我们公司的支持。我先干为敬, 请您随意。",
        pinyin: "Wáng zǒng, wǒ xiān jìng nín yī bēi, gǎn xiè nín duì wǒ men gōng sī de zhī chí. Wǒ xiān gān wéi jìng, qǐng nín suí yì."
      }
    ]
  },
  {
    id: 69,
    level: "B2",
    category: "cultural_communication",
    title: "向中国朋友介绍越南春节",
    pinyin: "xiàng zhōng guó péng you jiè shào yuè nán chūn jié",
    topic: "Explaining Vietnamese Tết to Chinese friends",
    title_vi: "Giới thiệu Tết Việt Nam cho bạn Trung Quốc",
    title_en: "Explaining Vietnamese Lunar New Year to Chinese friends",
    sentences: [
      {
        chinese: "我们越南人也过春节, 我们叫'Tết Nguyên Đán'。",
        pinyin: "Wǒmen Yuènán rén yě guò Chūnjié, wǒmen jiào 'Tết Nguyên Đán'.",
        english: "We Vietnamese also celebrate Spring Festival — we call it 'Tết Nguyên Đán'.",
        vi: "Người Việt bọn em cũng ăn Tết, chúng em gọi là 'Tết Nguyên Đán'.",
        pronunciation_focus: ["春节 → Chūnjié (Tết / Spring Festival)", "我们 → wǒmen (chúng tôi)", "越南人 → Yuènán rén (người Việt Nam)", "Tết → âm gốc tiếng Việt"]
      },
      {
        chinese: "中越春节同一天, 因为我们都用农历。",
        pinyin: "Zhōng-yuè Chūnjié tóng yī tiān, yīnwèi wǒmen dōu yòng nónglì.",
        english: "Chinese and Vietnamese Spring Festivals are on the same day, because we both use the lunar calendar.",
        vi: "Tết Việt và Tết Trung cùng một ngày, vì cả hai đều dùng âm lịch.",
        pronunciation_focus: ["同一天 → tóng yī tiān (cùng một ngày)", "农历 → nónglì (âm lịch)", "因为 → yīnwèi (vì)", "都 → dōu (đều)"]
      },
      {
        chinese: "我们的传统食物是粽子, 但和中国粽子不一样, 我们的是方形的。",
        pinyin: "Wǒmen de chuántǒng shíwù shì zòngzi, dàn hé Zhōngguó zòngzi bù yīyàng, wǒmen de shì fāngxíng de.",
        english: "Our traditional food is banh chung — different from Chinese zongzi, ours is square-shaped.",
        vi: "Món truyền thống của bọn em là bánh chưng, khác bánh ú Trung Quốc, bánh em hình vuông.",
        pronunciation_focus: ["传统食物 → chuántǒng shíwù (món truyền thống)", "粽子 → zòngzi (bánh ú/bánh chưng)", "方形 → fāngxíng (hình vuông)", "不一样 → bù yīyàng (không giống)"]
      },
      {
        chinese: "越南北方装饰桃花, 南方装饰梅花, 中国是红灯笼。",
        pinyin: "Yuènán běifāng zhuāngshì táohuā, nánfāng zhuāngshì méihuā, Zhōngguó shì hóng dēnglong.",
        english: "Northern Vietnam decorates with peach blossoms, southern with apricot blossoms, China uses red lanterns.",
        vi: "Miền Bắc Việt Nam trang trí hoa đào, miền Nam hoa mai, Trung Quốc thì đèn lồng đỏ.",
        pronunciation_focus: ["北方 → běifāng (miền Bắc)", "桃花 → táohuā (hoa đào)", "梅花 → méihuā (hoa mai)", "红灯笼 → hóng dēnglong (đèn lồng đỏ)"]
      },
      {
        chinese: "新年快乐! 阖家团圆, 万事如意!",
        pinyin: "Xīnnián kuàilè! Hé jiā tuányuán, wànshì rúyì!",
        english: "Happy New Year! Family reunion, all wishes come true!",
        vi: "Chúc mừng năm mới! Gia đình đoàn tụ, vạn sự như ý!",
        pronunciation_focus: ["新年快乐 → xīnnián kuàilè (chúc mừng năm mới)", "阖家团圆 → hé jiā tuányuán (cả nhà đoàn tụ)", "万事如意 → wànshì rúyì (vạn sự như ý)", "阖 → hé (cả/toàn bộ)"]
      }
    ],
    vocab: [
      { chinese: "春节", pinyin: "chūn jié", english: "Spring Festival / Lunar New Year", vi: "Tết Nguyên Đán" },
      { chinese: "农历", pinyin: "nóng lì", english: "lunar calendar", vi: "âm lịch" },
      { chinese: "粽子", pinyin: "zòng zi", english: "zongzi (rice cake)", vi: "bánh ú / bánh chưng" },
      { chinese: "压岁钱", pinyin: "yā suì qián", english: "lucky money (Chinese)", vi: "tiền lì xì" },
      { chinese: "红包", pinyin: "hóng bāo", english: "red envelope", vi: "phong bao đỏ" },
      { chinese: "桃花", pinyin: "táo huā", english: "peach blossom", vi: "hoa đào" },
      { chinese: "梅花", pinyin: "méi huā", english: "apricot blossom", vi: "hoa mai" },
      { chinese: "阖家团圆", pinyin: "hé jiā tuán yuán", english: "whole family reunion", vi: "cả nhà đoàn tụ" },
      { chinese: "万象更新", pinyin: "wàn xiàng gēng xīn", english: "all things renewed", vi: "vạn vật đổi mới" },
      { chinese: "辞旧迎新", pinyin: "cí jiù yíng xīn", english: "bid farewell to old, welcome new", vi: "tiễn cũ đón mới" }
    ],
    dialogue: [
      { speaker: "王朋友", chinese: "你们越南也过春节吗?", pinyin: "Nǐmen Yuènán yě guò Chūnjié ma?", english: "Vietnam also celebrates Spring Festival?", vi: "Việt Nam cũng ăn Tết à?" },
      { speaker: "阮", chinese: "我们叫'Tết', 和中国春节同一天。", pinyin: "Wǒmen jiào 'Tết', hé Zhōngguó Chūnjié tóng yī tiān.", english: "We call it 'Tết' — same day as Chinese Spring Festival.", vi: "Bọn em gọi là 'Tết', cùng ngày với Tết Trung Quốc." },
      { speaker: "王朋友", chinese: "你们也吃饺子和粽子吗?", pinyin: "Nǐmen yě chī jiǎozi hé zòngzi ma?", english: "Do you also eat dumplings and zongzi?", vi: "Các em cũng ăn sủi cảo và bánh ú không?" },
      { speaker: "阮", chinese: "饺子不吃, 但有越南粽子'bánh chưng', 是方形的, 用糯米和绿豆做。", pinyin: "Jiǎozi bù chī, dàn yǒu Yuènán zòngzi 'bánh chưng', shì fāngxíng de, yòng nuòmǐ hé lǜdòu zuò.", english: "Don't eat dumplings, but have Vietnamese zongzi 'banh chung' — square, made with sticky rice and mung bean.", vi: "Sủi cảo thì không, nhưng có bánh chưng Việt Nam — vuông, làm từ gạo nếp và đậu xanh." }
    ],
    dialogue_long: [
      { speaker: "王朋友", chinese: "小阮, 春节快到了。你们越南春节和中国春节有什么不一样吗?", pinyin: "Xiǎo Ruǎn, Chūnjié kuài dào le. Nǐmen Yuènán Chūnjié hé Zhōngguó Chūnjié yǒu shénme bù yīyàng ma?", english: "Little Nguyen, Spring Festival is coming. Anything different between Vietnamese and Chinese Spring Festivals?", vi: "Tiểu Nguyễn, Tết sắp đến rồi. Tết Việt và Tết Trung có gì khác nhau không?" },
      { speaker: "阮", chinese: "有相似也有不同。我们都是同一天过年, 因为都用农历。这点完全一样。", pinyin: "Yǒu xiāngsì yě yǒu bùtóng. Wǒmen dōu shì tóng yī tiān guònián, yīnwèi dōu yòng nónglì. Zhè diǎn wánquán yīyàng.", english: "Some similar, some different. We celebrate on the same day, both use lunar calendar — this is totally the same.", vi: "Có giống có khác. Mình đều đón Tết cùng ngày, vì cả hai dùng âm lịch — điểm này hoàn toàn giống." },
      { speaker: "王朋友", chinese: "那不一样的呢?", pinyin: "Nà bù yīyàng de ne?", english: "What's different?", vi: "Còn cái khác?" },
      { speaker: "阮", chinese: "首先是食物。中国有饺子、年糕、汤圆。越南有 'bánh chưng' (方粽)、'bánh tét' (圆粽)、和 'thịt kho tàu' (红烧肉)。", pinyin: "Shǒuxiān shì shíwù. Zhōngguó yǒu jiǎozi, niángāo, tāngyuán. Yuènán yǒu 'bánh chưng' (fāng zòng), 'bánh tét' (yuán zòng), hé 'thịt kho tàu' (hóngshāo ròu).", english: "First, food. China has dumplings, sticky rice cake, glutinous rice balls. Vietnam has banh chung (square zongzi), banh tet (round zongzi), and braised pork.", vi: "Đầu tiên là món ăn. Trung Quốc có sủi cảo, bánh tổ, chè trôi nước. Việt Nam có bánh chưng (bánh ú vuông), bánh tét (bánh ú tròn), và thịt kho tàu." },
      { speaker: "王朋友", chinese: "方粽? 我们的粽子都是三角形的。", pinyin: "Fāng zòng? Wǒmen de zòngzi dōu shì sānjiǎo xíng de.", english: "Square zongzi? Ours are all triangular.", vi: "Bánh ú vuông? Bánh ú bọn anh đều hình tam giác." },
      { speaker: "阮", chinese: "对, 越南方粽源自传说: 古时候, 王子用方形代表大地, 圆形代表天。所以bánh chưng是方的, bánh dày是圆的。", pinyin: "Duì, Yuènán fāng zòng yuán zì chuánshuō: gǔ shíhou, wángzǐ yòng fāngxíng dàibiǎo dàdì, yuánxíng dàibiǎo tiān. Suǒyǐ bánh chưng shì fāng de, bánh dày shì yuán de.", english: "Yes, Vietnamese square zongzi comes from a legend: ancient times, a prince used square to represent earth, round to represent sky. So banh chung is square, banh day is round.", vi: "Đúng, bánh chưng Việt Nam có nguồn gốc từ truyền thuyết: thời cổ, hoàng tử dùng hình vuông tượng trưng đất, hình tròn tượng trưng trời. Nên bánh chưng vuông, bánh dày tròn." },
      { speaker: "王朋友", chinese: "原来如此。装饰呢? 我们家里都贴红色对联和'福'字。", pinyin: "Yuánlái rúcǐ. Zhuāngshì ne? Wǒmen jiā lǐ dōu tiē hóngsè duìlián hé 'fú' zì.", english: "I see. Decorations? We put up red couplets and the character 'fu' (fortune).", vi: "Thì ra thế. Trang trí thì sao? Nhà bọn anh đều dán câu đối đỏ và chữ 'phúc'." },
      { speaker: "阮", chinese: "我们也贴对联! 但越南一定要有花。北方人买桃花 (粉红色), 南方人买梅花 (黄色)。家里没有花, 不算过年。", pinyin: "Wǒmen yě tiē duìlián! Dàn Yuènán yīdìng yào yǒu huā. Běifāng rén mǎi táohuā (fěnhóng sè), nánfāng rén mǎi méihuā (huángsè). Jiā lǐ méiyǒu huā, bù suàn guònián.", english: "We also put up couplets! But Vietnam must have flowers. Northerners buy peach blossoms (pink), southerners buy yellow apricot. No flowers at home means no Spring Festival.", vi: "Bọn em cũng dán câu đối! Nhưng Việt Nam phải có hoa. Người miền Bắc mua hoa đào (hồng), miền Nam mua hoa mai (vàng). Nhà không có hoa coi như chưa Tết." },
      { speaker: "王朋友", chinese: "有意思。压岁钱呢?", pinyin: "Yǒu yìsi. Yāsuìqián ne?", english: "Interesting. What about lucky money?", vi: "Hay đấy. Còn tiền lì xì?" },
      { speaker: "阮", chinese: "我们叫'lì xì', 这两个字其实就是中文的'利市'。装在红包里 (越南叫 bao lì xì), 大人给孩子。和中国一样!", pinyin: "Wǒmen jiào 'lì xì', zhè liǎng gè zì qíshí jiùshì zhōngwén de 'lìshì'. Zhuāng zài hóngbāo lǐ (Yuènán jiào bao lì xì), dàrén gěi háizi. Hé Zhōngguó yīyàng!", english: "We call it 'lì xì' — these two words are actually Chinese 'lìshì'. Put in red envelope (Vietnamese: bao lì xì), adults give to children. Same as China!", vi: "Bọn em gọi là 'lì xì', hai chữ này thực ra là từ Hán 'lợi thị'. Đựng trong bao đỏ (tiếng Việt: bao lì xì), người lớn cho trẻ con. Giống Trung Quốc!" },
      { speaker: "王朋友", chinese: "字一样, 太有意思了! 那你们也守岁吗?", pinyin: "Zì yīyàng, tài yǒu yìsi le! Nà nǐmen yě shǒusuì ma?", english: "Same characters, so interesting! Do you also stay up to welcome the new year?", vi: "Chữ giống nhau, thú vị quá! Vậy các em cũng thức đêm đón giao thừa không?" },
      { speaker: "阮", chinese: "守岁! 我们叫 'giao thừa', 也是熬夜到凌晨。然后第一个进家的人, 我们叫 'xông đất' (踩地), 这个人会给家里带来一年运气。", pinyin: "Shǒusuì! Wǒmen jiào 'giao thừa', yěshì áoyè dào língchén. Ránhòu dì yī gè jìn jiā de rén, wǒmen jiào 'xông đất' (cǎi dì), zhège rén huì gěi jiā lǐ dài lái yī nián yùnqi.", english: "Yes! We call it 'giao thừa', also stay up till early morning. Then the first person to enter the house, we call 'xông đất' (stepping on the ground) — this person brings the year's luck.", vi: "Thức giao thừa! Bọn em gọi là 'giao thừa', cũng thức đến sáng sớm. Sau đó người đầu tiên vào nhà, gọi là 'xông đất' — người này sẽ mang vận may cả năm cho nhà." },
      { speaker: "王朋友", chinese: "有讲究! 中国也有 '开门红' 的概念, 但没有具体的人。", pinyin: "Yǒu jiǎngjiu! Zhōngguó yě yǒu 'kāi mén hóng' de gàiniàn, dàn méiyǒu jùtǐ de rén.", english: "Has rules! China also has the concept of 'opening door red' (auspicious start), but no specific person.", vi: "Có quy tắc! Trung Quốc cũng có khái niệm 'khai môn hồng' (mở cửa đỏ — khởi đầu tốt), nhưng không có người cụ thể." },
      { speaker: "阮", chinese: "还有一个有趣的: 越南春节看年龄就大一岁, 不管你的生日是哪一天。中国也是这样吧?", pinyin: "Hái yǒu yī gè yǒuqù de: Yuènán Chūnjié kàn niánlíng jiù dà yī suì, bùguǎn nǐ de shēngrì shì nǎ yī tiān. Zhōngguó yě shì zhèyàng ba?", english: "One more interesting: in Vietnam, on Spring Festival you turn one year older, regardless of birthday. Same in China?", vi: "Còn một điều thú vị: ở Việt Nam Tết là tăng một tuổi, bất kể sinh nhật ngày nào. Trung Quốc cũng thế à?" },
      { speaker: "王朋友", chinese: "中国传统也是, 但现在年轻人多用阳历生日算年龄了。", pinyin: "Zhōngguó chuántǒng yěshì, dàn xiànzài niánqīng rén duō yòng yánglì shēngrì suàn niánlíng le.", english: "Chinese tradition too, but now young people mostly use Gregorian birthday for age.", vi: "Truyền thống Trung Quốc cũng vậy, nhưng giờ người trẻ chủ yếu dùng sinh nhật dương lịch tính tuổi." },
      { speaker: "阮", chinese: "看来我们同根同源, 又各有千秋。今年春节欢迎你来河内做客! 阖家团圆, 万象更新!", pinyin: "Kàn lái wǒmen tóng gēn tóng yuán, yòu gè yǒu qiān qiū. Jīnnián Chūnjié huānyíng nǐ lái Hénèi zuòkè! Hé jiā tuányuán, wànxiàng gēng xīn!", english: "Looks like we share roots, yet each have unique merits. This Spring Festival, welcome to visit me in Hanoi! Family reunion, all things renewed!", vi: "Có vẻ mình cùng gốc cùng nguồn, lại mỗi bên có nét riêng. Tết năm nay hoan nghênh anh đến Hà Nội chơi! Cả nhà đoàn tụ, vạn vật đổi mới!" }
    ],
    roleplay_prompts: [
      "Đồng nghiệp Trung Quốc hỏi 'Việt Nam ăn món gì vào Tết'. Hãy giới thiệu 5 món chính: bánh chưng, thịt kho tàu, dưa món, giò chả, mứt — kèm pinyin tương đương và mô tả ngắn. Tránh nói 'giống Trung Quốc' — mỗi món có lịch sử riêng.",
      "Bạn được mời ăn Tết với gia đình bạn Trung Quốc tại Bắc Kinh. Hãy chuẩn bị quà phù hợp (cà phê G7, bánh chưng đông lạnh, lụa Vạn Phúc), câu chúc Tết tiếng Trung ('恭喜发财, 万事如意'), và phong bao lì xì cho trẻ con (50-100 tệ trong bao đỏ).",
      "Đồng nghiệp Trung Quốc bảo 'Tết Việt là copy của Tết Trung Quốc'. Đây là câu thiếu nhạy cảm. Hãy đáp: thừa nhận chia sẻ nguồn gốc Đông Á + nhấn mạnh đặc thù Việt Nam (bánh chưng vuông, hoa đào/mai, xông đất). Dùng cụm '同根同源, 各有千秋'."
    ],
    register_notes: "Giải thích Tết với người Trung Quốc là 'safe topic' — không nhạy cảm chính trị nhưng vẫn cần khéo léo về văn hóa. 你 (nǐ) trong context bạn bè / đồng nghiệp ngang cấp; 您 nếu lớn tuổi.\n\nCác câu chúc Tết chuẩn (Trung-Việt cùng dùng):\n- '新年快乐' (xīnnián kuàilè) — chúc mừng năm mới\n- '恭喜发财' (gōngxǐ fācái) — chúc phát tài (rất Trung Quốc, ít dùng ở miền Bắc Việt Nam)\n- '万事如意' (wànshì rúyì) — vạn sự như ý\n- '阖家团圆' (hé jiā tuányuán) — cả nhà đoàn tụ\n- '身体健康' (shēntǐ jiànkāng) — sức khỏe dồi dào\n- '心想事成' (xīnxiǎng shìchéng) — tâm nghĩ việc thành\n- '万象更新' (wànxiàng gēngxīn) — vạn vật đổi mới\n- '辞旧迎新' (cíjiù yíngxīn) — tiễn cũ đón mới\n\nKhi giới thiệu món Việt: dùng cấu trúc 'tên Việt + cách viết Hán-Việt + giải thích':\n- '我们叫 bánh chưng (粽子的方形版本), 用糯米、猪肉、绿豆做的'\n- '北方有桃花 (粉红色), 南方有梅花 (黄色)'\n\nKhi gặp khái niệm Việt KHÔNG có ở Trung Quốc (xông đất, mâm ngũ quả): giải thích bằng analogy + dịch chữ — KHÔNG bịa từ Hán không tồn tại.\n\nTránh: (a) Nói 'Tết Việt giống Tết Trung 100%' — sai và xúc phạm; (b) So sánh hơn-kém; (c) Đưa quan điểm chính trị (ai 'tổ tiên' của ai); (d) Tự dịch tên Hán từ tiếng Việt sang nếu không chắc — nhờ chuyên gia.",
    idiom_glosses: [
      {
        idiom: "阖家团圆",
        literal: "cả nhà đoàn tụ (hé jiā tuán yuán)",
        meaning: "Cả gia đình đoàn tụ — ý nghĩa cốt lõi của Tết. Cụm chuẩn dùng để chúc trong dịp Xuân: '阖家团圆, 幸福安康'. Mạnh hơn '一家团圆' đơn giản. Phù hợp với cả văn hóa Việt và Trung.",
        example: "祝您阖家团圆, 万事如意。"
      },
      {
        idiom: "万象更新",
        literal: "vạn vật đổi mới (wàn xiàng gēng xīn)",
        meaning: "Vạn vật được làm mới — biểu tượng đầu năm mới. Cụm dùng trong câu chúc/diễn văn Tết, đặc biệt khi muốn diễn đạt cảm giác 'reset' đầu năm. Cao cấp hơn 'happy new year'.",
        example: "新春到来, 万象更新。"
      },
      {
        idiom: "辞旧迎新",
        literal: "tiễn cũ đón mới (cí jiù yíng xīn)",
        meaning: "Tiễn năm cũ, đón năm mới — biểu tượng chuyển giao thời gian. Cụm dùng trong đêm giao thừa hoặc đầu năm: '辞旧迎新, 万事如意'. Thể hiện tinh thần 'để lại điều xấu, đón điều tốt'.",
        example: "辞旧迎新, 一切重新开始。"
      },
      {
        idiom: "福寿安康",
        literal: "phúc thọ an khang (fú shòu ān kāng)",
        meaning: "Phúc lộc, sống lâu, bình an, khỏe mạnh — bộ chúc 4 chữ kinh điển. Đặc biệt phù hợp khi chúc người lớn tuổi (ông bà, sếp lớn). Mạnh và sâu sắc hơn '身体健康' đơn lẻ.",
        example: "祝您福寿安康, 永远幸福。"
      }
    ],
    cultural_notes_vi: "Tết Việt-Trung là 'điểm chung lớn nhất' giữa hai nước — cùng ngày, cùng âm lịch, cùng nhiều phong tục cốt lõi (đoàn tụ gia đình, lì xì, hoa, dọn nhà). Đây là chủ đề an toàn và phong phú để xây quan hệ. Năm điểm khác biệt then chốt người Việt nên biết khi giải thích cho bạn Trung Quốc:\n\n(1) BÁNH CHƯNG vs. JIAOZI: ở Trung Quốc, sủi cảo (饺子) là món chính đêm 30. Việt Nam KHÔNG ăn sủi cảo Tết — bánh chưng (vuông, gói lá dong) và bánh tét (tròn, gói lá chuối) là món chính. Nguồn gốc bánh chưng từ truyền thuyết Lang Liêu thời Hùng Vương — câu chuyện độc đáo Việt Nam, KHÔNG có ở Trung Quốc.\n\n(2) HOA: Việt Nam BẮT BUỘC có hoa đào (miền Bắc) hoặc hoa mai (miền Nam) — không có hoa = không phải Tết. Trung Quốc thiên về câu đối đỏ, đèn lồng, và hoa thủy tiên (水仙). Khi giới thiệu, chỉ ra rằng hoa đào/mai là TÂM ĐIỂM Tết Việt, trong khi với Trung Quốc đó là phụ.\n\n(3) MÀU SẮC: Trung Quốc gần như chỉ dùng đỏ. Việt Nam dùng đỏ (lì xì, câu đối) NHƯNG cũng vàng (mâm ngũ quả, hoa mai), hồng (hoa đào). Đa dạng màu sắc hơn.\n\n(4) XÔNG ĐẤT (踩地): khái niệm độc đáo Việt Nam — người ĐẦU TIÊN bước vào nhà sau giao thừa được tin sẽ mang vận may cả năm. Gia đình thường chọn người 'tốt vận' (tuổi hợp, làm ăn thuận, gia đình êm ấm) đến xông đất. Trung Quốc không có nghi thức này — chỉ có '开门红' (mở cửa đỏ) khái niệm chung.\n\n(5) MÂM NGŨ QUẢ: 5 loại quả trên bàn thờ tổ tiên, mang ý nghĩa 'đủ đầy'. Miền Nam có công thức 'cầu sung dừa đủ xoài' (cầu — sung — dừa — đủ — xoài → 'cầu cho được sung túc, vừa đủ, xài [tiền]'). Trung Quốc không có concept tương đương — chỉ có 'thờ tổ tiên' chung.\n\nVề từ vựng SHARED: nhiều từ Tết Việt là Hán-Việt từ Trung Quốc — 'lì xì' (利市), 'tân niên' (新年), 'phúc' (福), 'lộc' (禄), 'thọ' (寿), 'tổ tiên' (祖先), 'gia đình' (家庭). Khi nói chuyện với người Trung, chỉ ra điều này = họ sẽ ngạc nhiên thú vị.\n\nVề tuổi: cả Việt Nam và Trung Quốc cổ truyền tăng tuổi vào ngày Tết (không phải sinh nhật). Việt Nam dùng 'tuổi mụ' = tuổi sinh + 1 từ ngày Tết đầu tiên. Hệ thống này đang dần thay bằng tuổi dương, nhưng người lớn tuổi vẫn dùng. Khi giới thiệu, đề cập 'âm lịch tuổi' để bạn Trung Quốc hiểu — họ có khái niệm '虚岁' (hư tuổi) tương tự.\n\nVề kiêng kỵ Tết (chia sẻ Việt-Trung): mùng 1 KHÔNG quét nhà (quét đi vận may), KHÔNG cắt tóc, KHÔNG cho vay tiền, KHÔNG nói chuyện xui (đám tang, bệnh tật). Bạn Trung Quốc cũng theo những kiêng này — bonding point.",
    tip_advice_vi: "(1) HỌC THUỘC 8 câu chúc Tết bằng tiếng Trung trước Tết: '新年快乐', '恭喜发财', '万事如意', '阖家团圆', '身体健康', '心想事成', '万象更新', '福寿安康'. Khi gặp bạn Trung Quốc, dùng đúng cụm theo đối tượng (người lớn tuổi: 福寿安康; bạn ngang cấp: 万事如意; trẻ con: 学业进步). (2) Nếu mời bạn Trung Quốc ăn Tết tại Việt Nam, chuẩn bị TRƯỚC: đặt vé máy bay sớm (Tết là cao điểm), book khách sạn 4-5 sao, lên menu chứa cả món Việt và món Trung quen thuộc (cá, gà nguyên con). Bạn Trung lần đầu ăn bánh chưng có thể lúng túng — chuẩn bị vài món 'quen' để dự phòng. (3) Quà cho bạn Trung Quốc dịp Tết: bánh chưng tươi (đông lạnh chân không, gửi máy bay), mứt Tết (mứt sen, mứt gừng), cà phê Trung Nguyên premium, lụa Vạn Phúc. Tổng giá trị 500-1500 nhân dân tệ. (4) Khi gửi tin chúc Tết qua WeChat, GỬI VỚI ẢNH/EMOJI — không chỉ text. Ảnh hoa đào, lì xì, gia đình ăn Tết. Tin chúc kèm hình ảnh nhân lên hiệu ứng cảm xúc. (5) Lì xì cho bạn Trung Quốc/Trẻ Trung Quốc: dùng phong bao đỏ (NÀY mua trước được ở Hà Nội), số tiền 50, 88, 100, 168, 188 (số có 8 — phát tài). TRÁNH 4, 14, 44, 444 (tử). (6) Trong các năm tiếp theo, gửi tin chúc Tết cho TỪNG quan hệ Trung Quốc bạn có — không chỉ tin nhắn nhóm. Mỗi tin riêng + tên người nhận = thể hiện sự quan tâm cá nhân. Tốn 30 phút nhưng giá trị xây quan hệ lớn. (7) Sau Tết, gửi 'cảm ơn lì xì' nếu bạn nhận từ ai — '谢谢您的红包, 我会把红包里的钱用来 [investment / book / family treat]' — đây là cử chỉ chu đáo ít người Việt làm.",
    exercises: [
      { type: "fill-blank", question: "新年快乐! ___ 团圆, 万事如意!", answer: "阖家" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung Tết với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "春节", pinyin: "chūn jié", english: "Tết Nguyên Đán" },
          { chinese: "压岁钱", pinyin: "yā suì qián", english: "tiền lì xì" },
          { chinese: "桃花", pinyin: "táo huā", english: "hoa đào" },
          { chinese: "辞旧迎新", pinyin: "cí jiù yíng xīn", english: "tiễn cũ đón mới" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Tết Việt và Tết Trung cùng một ngày, vì cả hai đều dùng âm lịch. Nhưng Việt Nam có bánh chưng vuông và hoa đào, khác Trung Quốc.",
        chinese: "中越春节同一天, 因为我们都用农历。但越南有方形的粽子和桃花, 和中国不一样。",
        pinyin: "Zhōng yuè chūn jié tóng yī tiān, yīn wèi wǒ men dōu yòng nóng lì. Dàn yuè nán yǒu fāng xíng de zòng zi hé táo huā, hé zhōng guó bù yī yàng."
      }
    ]
  },
  {
    id: 71,
    level: "B2",
    category: "cultural_communication",
    title: "和在越中国朋友建立友谊",
    pinyin: "hé zài yuè zhōng guó péng you jiàn lì yǒu yì",
    topic: "Building friendship with Chinese friends in Vietnam",
    title_vi: "Xây dựng tình bạn với người Trung Quốc tại Việt Nam",
    title_en: "Building friendship with Chinese friends in Vietnam",
    sentences: [
      {
        chinese: "你来越南这么久了, 周末有什么打算? 一起去咖啡店吧!",
        pinyin: "Nǐ lái Yuènán zhème jiǔ le, zhōumò yǒu shénme dǎsuàn? Yīqǐ qù kāfēi diàn ba!",
        english: "You've been in Vietnam for a while — any plans this weekend? Let's go to a cafe!",
        vi: "Em đến Việt Nam lâu rồi nhỉ, cuối tuần có dự định gì không? Mình đi quán cà phê đi!",
        pronunciation_focus: ["这么久 → zhème jiǔ (lâu thế)", "周末 → zhōumò (cuối tuần)", "打算 → dǎsuàn (dự định)", "咖啡店 → kāfēi diàn (quán cà phê)"]
      },
      {
        chinese: "我们之间不需要客套, 以诚相待就好。",
        pinyin: "Wǒmen zhī jiān bù xūyào kètào, yǐ chéng xiāng dài jiù hǎo.",
        english: "Between us no need for formalities — treating each other sincerely is enough.",
        vi: "Giữa mình không cần khách sáo, lấy chân thành đối đãi là đủ.",
        pronunciation_focus: ["客套 → kètào (khách sáo)", "以诚相待 → yǐ chéng xiāng dài (đối đãi chân thành)", "之间 → zhī jiān (giữa)", "需要 → xūyào"]
      },
      {
        chinese: "你想家了告诉我, 我陪你吃中国菜, 找点家的味道。",
        pinyin: "Nǐ xiǎng jiā le gàosu wǒ, wǒ péi nǐ chī Zhōngguó cài, zhǎo diǎn jiā de wèidao.",
        english: "If you miss home, tell me — I'll go with you for Chinese food, find some taste of home.",
        vi: "Em nhớ nhà thì nói với mình, mình đi cùng em ăn món Trung, tìm chút hương vị quê.",
        pronunciation_focus: ["想家 → xiǎng jiā (nhớ nhà)", "陪 → péi (đi cùng)", "中国菜 → Zhōngguó cài (món Trung)", "家的味道 → jiā de wèidao"]
      },
      {
        chinese: "下次回中国, 我去找你玩, 你做我的导游!",
        pinyin: "Xià cì huí Zhōngguó, wǒ qù zhǎo nǐ wán, nǐ zuò wǒ de dǎoyóu!",
        english: "Next time you go back to China, I'll come visit — you be my tour guide!",
        vi: "Lần sau em về Trung Quốc, mình sang chơi, em làm hướng dẫn viên cho mình!",
        pronunciation_focus: ["下次 → xià cì (lần sau)", "找你玩 → zhǎo nǐ wán (sang chơi)", "导游 → dǎoyóu (hướng dẫn viên)", "做 → zuò"]
      },
      {
        chinese: "肝胆相照, 海内存知己 — 我们就是这样的朋友。",
        pinyin: "Gān dǎn xiāng zhào, hǎi nèi cún zhī jǐ — wǒmen jiùshì zhèyàng de péngyou.",
        english: "Heart-to-heart, true friends span seas — that's the kind of friends we are.",
        vi: "Gan ruột soi nhau, trong bốn biển có tri kỷ — mình là kiểu bạn như thế.",
        pronunciation_focus: ["肝胆相照 → gān dǎn xiāng zhào (idiom)", "海内存知己 → hǎi nèi cún zhī jǐ (Vương Bột)", "朋友 → péngyou (bạn)", "我们 → wǒmen"]
      }
    ],
    vocab: [
      { chinese: "朋友", pinyin: "péng you", english: "friend", vi: "bạn" },
      { chinese: "友谊", pinyin: "yǒu yì", english: "friendship", vi: "tình bạn" },
      { chinese: "想家", pinyin: "xiǎng jiā", english: "to miss home", vi: "nhớ nhà" },
      { chinese: "陪伴", pinyin: "péi bàn", english: "to accompany", vi: "ở bên" },
      { chinese: "聚会", pinyin: "jù huì", english: "gathering", vi: "tụ họp" },
      { chinese: "知心", pinyin: "zhī xīn", english: "intimate / close-hearted", vi: "tri tâm" },
      { chinese: "以诚相待", pinyin: "yǐ chéng xiāng dài", english: "treat with sincerity", vi: "đối đãi chân thành" },
      { chinese: "肝胆相照", pinyin: "gān dǎn xiāng zhào", english: "heart-to-heart, deep trust", vi: "gan ruột soi nhau" },
      { chinese: "患难见真情", pinyin: "huàn nàn jiàn zhēn qíng", english: "hardship reveals true feelings", vi: "hoạn nạn thấy chân tình" },
      { chinese: "海内存知己", pinyin: "hǎi nèi cún zhī jǐ", english: "true friends span seas (Wang Bo)", vi: "trong bốn biển có tri kỷ" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "小李, 你来河内多久了?", pinyin: "Xiǎo Lǐ, nǐ lái Hénèi duō jiǔ le?", english: "Little Li, how long have you been in Hanoi?", vi: "Tiểu Lý, em đến Hà Nội bao lâu rồi?" },
      { speaker: "李", chinese: "三个月了。下班后不知道去哪里, 有点孤单。", pinyin: "Sān gè yuè le. Xiàbān hòu bù zhīdào qù nǎlǐ, yǒudiǎn gūdān.", english: "Three months. Don't know where to go after work, a bit lonely.", vi: "Ba tháng rồi. Tan ca không biết đi đâu, hơi cô đơn." },
      { speaker: "阮", chinese: "周末跟我去咖啡店吧! 河内有好多有意思的小店。", pinyin: "Zhōumò gēn wǒ qù kāfēi diàn ba! Hénèi yǒu hǎo duō yǒu yìsi de xiǎo diàn.", english: "Come with me to cafes this weekend! Hanoi has lots of interesting small shops.", vi: "Cuối tuần đi quán cà phê với mình đi! Hà Nội nhiều quán nhỏ thú vị lắm." },
      { speaker: "李", chinese: "真的吗? 太好了, 谢谢你!", pinyin: "Zhēn de ma? Tài hǎo le, xièxie nǐ!", english: "Really? Wonderful, thank you!", vi: "Thật à? Tuyệt quá, cảm ơn anh!" }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "小李, 周五下班一起去吃饭吗? 我知道一家很正宗的四川火锅店, 你肯定喜欢。", pinyin: "Xiǎo Lǐ, zhōuwǔ xiàbān yīqǐ qù chīfàn ma? Wǒ zhīdào yī jiā hěn zhèngzōng de Sìchuān huǒguō diàn, nǐ kěndìng xǐhuan.", english: "Little Li, want to grab dinner Friday after work? I know an authentic Sichuan hotpot place, you'll love it.", vi: "Tiểu Lý, thứ Sáu tan ca đi ăn cùng nhau không? Mình biết một quán lẩu Tứ Xuyên chính gốc, em chắc chắn thích." },
      { speaker: "李", chinese: "四川火锅?! 在河内? 太想念家乡的味道了!", pinyin: "Sìchuān huǒguō?! Zài Hénèi? Tài xiǎngniàn jiāxiāng de wèidao le!", english: "Sichuan hotpot?! In Hanoi? I miss home's flavor so much!", vi: "Lẩu Tứ Xuyên?! Ở Hà Nội? Em nhớ vị quê quá rồi!" },
      { speaker: "阮", chinese: "我特意找的, 就为了有一天带你去。我猜你来越南三个月, 一定开始想家。", pinyin: "Wǒ tèyì zhǎo de, jiù wèile yǒu yī tiān dài nǐ qù. Wǒ cāi nǐ lái Yuènán sān gè yuè, yīdìng kāishǐ xiǎng jiā.", english: "I deliberately looked for it, just so one day I could take you. I guessed after three months in Vietnam, you'd start missing home.", vi: "Mình tìm có chủ ý, để một ngày dẫn em đi. Mình đoán em đến Việt Nam ba tháng, chắc bắt đầu nhớ nhà." },
      { speaker: "李", chinese: "你太贴心了。我妈每周和我视频, 但听到她的声音我反而更想家。", pinyin: "Nǐ tài tiēxīn le. Wǒ mā měi zhōu hé wǒ shìpín, dàn tīng dào tā de shēngyīn wǒ fǎn'ér gèng xiǎng jiā.", english: "You're so thoughtful. My mom videos me every week, but hearing her voice makes me miss home more.", vi: "Anh chu đáo thật. Mẹ em mỗi tuần gọi video, nhưng nghe giọng mẹ em lại nhớ nhà hơn." },
      { speaker: "阮", chinese: "我懂这种感觉。我大学时去胡志明市读书, 也是这样, 想妈妈想得睡不着。", pinyin: "Wǒ dǒng zhè zhǒng gǎnjué. Wǒ dàxué shí qù Húzhìmíng shì dúshū, yěshì zhèyàng, xiǎng māma xiǎng de shuì bù zháo.", english: "I understand. When I went to Ho Chi Minh City for college, same thing — missing mom to the point of insomnia.", vi: "Mình hiểu cảm giác này. Hồi đại học mình vào TP HCM học, cũng vậy, nhớ mẹ đến mất ngủ." },
      { speaker: "李", chinese: "原来你也经历过。", pinyin: "Yuánlái nǐ yě jīnglì guò.", english: "So you've experienced it too.", vi: "Thì ra anh cũng đã trải qua." },
      { speaker: "阮", chinese: "这就是为什么我想多陪你。我们之间不用客套, 以诚相待就好。你想家了, 想吃中国菜, 想说中文, 都告诉我。", pinyin: "Zhè jiùshì wèishéme wǒ xiǎng duō péi nǐ. Wǒmen zhī jiān bù yòng kètào, yǐ chéng xiāng dài jiù hǎo. Nǐ xiǎng jiā le, xiǎng chī Zhōngguó cài, xiǎng shuō zhōngwén, dōu gàosu wǒ.", english: "That's why I want to spend more time with you. Between us no need for formalities — sincerity is enough. If you miss home, want Chinese food, want to speak Mandarin, tell me.", vi: "Đó là lý do mình muốn ở bên em nhiều hơn. Giữa mình không cần khách sáo, lấy chân thành đối đãi là đủ. Em nhớ nhà, muốn ăn món Trung, muốn nói tiếng Trung, cứ nói với mình." },
      { speaker: "李", chinese: "阮哥, 我太感动了。我在公司虽然工作顺利, 但下班后真的没人说话。", pinyin: "Ruǎn gē, wǒ tài gǎndòng le. Wǒ zài gōngsī suīrán gōngzuò shùnlì, dàn xiàbān hòu zhēn de méi rén shuōhuà.", english: "Brother Nguyen, I'm touched. At company, work goes well, but after hours really nobody to talk to.", vi: "Anh Nguyễn, em xúc động quá. Ở công ty công việc thuận lợi, nhưng tan ca thực sự không ai để nói chuyện." },
      { speaker: "阮", chinese: "以后有我。我家在河内还剑湖旁边, 你随时可以过来吃饭。我妈做的越南菜也很好吃, 让你尝尝。", pinyin: "Yǐhòu yǒu wǒ. Wǒ jiā zài Hénèi Huánjiàn hú pángbiān, nǐ suíshí kěyǐ guòlái chīfàn. Wǒ mā zuò de Yuènán cài yě hěn hǎochī, ràng nǐ chángchang.", english: "From now on, you have me. My home's by Hoan Kiem Lake — come over for dinner anytime. My mom's Vietnamese cooking is great, let you try.", vi: "Sau này có mình. Nhà mình ở cạnh hồ Hoàn Kiếm, em có thể qua ăn cơm bất cứ lúc nào. Mẹ mình nấu món Việt cũng ngon, cho em nếm thử." },
      { speaker: "李", chinese: "我会有点不好意思打扰阮叔阿姨。", pinyin: "Wǒ huì yǒudiǎn bù hǎoyìsi dǎrǎo Ruǎn shū āyí.", english: "I'd feel a bit shy bothering Uncle and Aunt Nguyen.", vi: "Em sẽ hơi ngại làm phiền cô chú Nguyễn." },
      { speaker: "阮", chinese: "不会! 我妈最喜欢有客人。我们越南家庭跟中国一样, 来的都是客人, 多人吃饭才热闹。", pinyin: "Bù huì! Wǒ mā zuì xǐhuan yǒu kèrén. Wǒmen Yuènán jiātíng gēn Zhōngguó yīyàng, lái de dōu shì kèrén, duō rén chīfàn cái rènao.", english: "No way! My mom loves having guests. Vietnamese families are like Chinese — everyone who comes is a guest, more people at dinner is more lively.", vi: "Không đâu! Mẹ mình thích nhất là có khách. Gia đình Việt giống Trung — đến đều là khách, nhiều người ăn cơm mới vui." },
      { speaker: "李", chinese: "下次我回中国, 一定带礼物来。", pinyin: "Xià cì wǒ huí Zhōngguó, yīdìng dài lǐwù lái.", english: "Next time I go back to China, I'll definitely bring gifts.", vi: "Lần sau em về Trung Quốc, nhất định mang quà sang." },
      { speaker: "阮", chinese: "礼物不用太破费, 你心意我们就感动了。倒是, 你下次回成都的话, 我能去看你吗? 我一直想吃正宗的麻婆豆腐和辣火锅。", pinyin: "Lǐwù bùyòng tài pòfèi, nǐ xīnyì wǒmen jiù gǎndòng le. Dào shi, nǐ xià cì huí Chéngdū de huà, wǒ néng qù kàn nǐ ma? Wǒ yīzhí xiǎng chī zhèngzōng de mápó dòufu hé là huǒguō.", english: "No need for expensive gifts — your sincerity touches us. Actually, when you go back to Chengdu next, can I visit? I've always wanted authentic mapo tofu and spicy hotpot.", vi: "Quà không cần tốn kém, tấm lòng em đã cảm động rồi. Thực ra, lần sau em về Thành Đô, mình sang chơi được không? Mình vẫn muốn ăn mapo đậu hũ và lẩu cay chính gốc." },
      { speaker: "李", chinese: "当然可以! 我做你的导游, 带你吃遍成都所有有名的小吃。", pinyin: "Dāngrán kěyǐ! Wǒ zuò nǐ de dǎoyóu, dài nǐ chī biàn Chéngdū suǒyǒu yǒumíng de xiǎochī.", english: "Of course! I'll be your tour guide, take you to taste all famous Chengdu street food.", vi: "Đương nhiên được! Em làm hướng dẫn viên cho anh, dẫn anh ăn hết món đặc sản Thành Đô." },
      { speaker: "阮", chinese: "肝胆相照! 海内存知己, 天涯若比邻 — 我们就是这样的朋友。", pinyin: "Gān dǎn xiāng zhào! Hǎi nèi cún zhī jǐ, tiānyá ruò bǐ lín — wǒmen jiùshì zhèyàng de péngyou.", english: "Heart-to-heart! True friends span seas, distant horizons feel close — that's the kind of friends we are.", vi: "Gan ruột soi nhau! Trong bốn biển có tri kỷ, chân trời như cận kề — mình là kiểu bạn như thế." },
      { speaker: "李", chinese: "阮哥, 我太幸运能在越南遇到你。", pinyin: "Ruǎn gē, wǒ tài xìngyùn néng zài Yuènán yù dào nǐ.", english: "Brother Nguyen, I'm so lucky to meet you in Vietnam.", vi: "Anh Nguyễn, em may mắn quá khi gặp anh ở Việt Nam." }
    ],
    roleplay_prompts: [
      "Đồng nghiệp Trung Quốc mới sang Việt Nam 1 tháng, có vẻ cô đơn cuối tuần. Hãy chủ động kết nối: hẹn họ cuối tuần đi cà phê + đề xuất 'Hà Nội tour' (phố cổ, Văn Miếu, hồ Tây). Dùng 你 (thân mật), không 您 — vì đây là context xây tình bạn.",
      "Bạn Trung Quốc đang ốm và nằm bệnh viện ở Việt Nam, không có người nhà. Hãy chăm sóc: đến thăm + mang đồ ăn nhẹ (cháo, súp gà) + ngồi nói chuyện 30 phút + để lại số WeChat 24/7. Dùng cụm '患难见真情' khi gặp.",
      "Sau 1 năm ở Việt Nam, bạn Trung Quốc về nước. Hãy tổ chức tiệc chia tay: chọn nhà hàng yêu thích của họ + mời 4-5 đồng nghiệp/bạn chung + chuẩn bị quà kỷ niệm (album ảnh, áo dài, video) + viết tay một lá thư bằng tiếng Trung. Tránh khóc lóc — chia tay vui vẻ + hứa 'next time in China'."
    ],
    register_notes: "Tình bạn Việt-Trung là môi trường register linh hoạt — ban đầu formal (您), sau khi thân chuyển sang 你. Khi đã thực sự thân, có thể dùng nickname (小李, 阮哥). Quá trình chuyển từ 您 sang 你 là dấu hiệu thân thiết — đối phương đề xuất là tôn trọng; bạn tự đổi sang 你 quá sớm là vô lễ.\n\nThang thân thiết qua xưng hô:\n- 您 + họ + chức danh (王经理) = mới gặp / business\n- 您 + họ (王先生) = formal nhưng đã quen\n- 你 + họ + 哥/姐 (王哥, 王姐) = thân thiện, ngang cấp\n- 小 + họ (小王) = thân, có chút bề trên\n- Nickname (王王, 小李子) = rất thân, gia đình\n\nCác cụm xây tình bạn:\n- 'Có gì cứ nói với mình' = '有什么事跟我说'\n- 'Mình ở đây vì em' = '我在这里陪你'\n- 'Đừng khách sáo' = '别客气'\n- 'Mình là bạn rồi' = '我们都是朋友了'\n- 'Có việc gì cần giúp gọi mình' = '有事需要帮忙就给我打电话'\n\nKhi mời về nhà: 'Chiều nay rảnh không? Đến nhà mình ăn cơm' = '下午有空吗? 来我家吃饭'. Mời về nhà = bước thân thiết quan trọng trong văn hóa Á Đông.\n\nTránh: (a) Trao đổi quá nhiều quà giá trị cao — bạn thật không cần ấn tượng nhau bằng tiền; (b) Hứa quá nhiều ('mình sẽ dẫn em đi khắp Việt Nam') rồi không thực hiện; (c) Ép bạn Trung Quốc làm điều họ không thoải mái (ăn món lạ, đi chỗ ồn); (d) Để lộ chuyện riêng của bạn qua Wechat group.",
    idiom_glosses: [
      {
        idiom: "以诚相待",
        literal: "lấy chân thành đối đãi (yǐ chéng xiāng dài)",
        meaning: "Đối đãi với nhau bằng sự chân thành — không giả tạo, không tính toán. Triết lý cốt lõi của tình bạn Đông Á. Cụm thể hiện cam kết tình bạn không có hidden agenda.",
        example: "我们之间以诚相待, 不需要客套。"
      },
      {
        idiom: "肝胆相照",
        literal: "gan mật soi nhau (gān dǎn xiāng zhào)",
        meaning: "Lộ gan ruột cho nhau thấy — tin cậy sâu sắc, không giấu giếm. Cụm rất mạnh, dành cho bạn thân nhất. Tránh dùng cho mới quen — sẽ bị coi là cường điệu.",
        example: "我们是肝胆相照的好朋友。"
      },
      {
        idiom: "患难见真情",
        literal: "hoạn nạn thấy chân tình (huàn nàn jiàn zhēn qíng)",
        meaning: "Khi gặp khó khăn mới thấy ai là bạn thật — sự thử thách của tình bạn. Cụm dùng khi đã giúp nhau qua khó khăn cụ thể. Mạnh và chân thực — thể hiện tình bạn đã được kiểm chứng.",
        example: "你这次帮我度过难关, 真是患难见真情。"
      },
      {
        idiom: "海内存知己, 天涯若比邻",
        literal: "trong bốn biển có tri kỷ, chân trời như cận kề (Vương Bột)",
        meaning: "Câu thơ Vương Bột — nếu có tri kỷ, dù xa cũng gần. Cụm cao cấp dùng cho tình bạn vượt khoảng cách. Đặc biệt phù hợp khi bạn về nước hoặc bạn đi xa — khẳng định khoảng cách không chia rẽ.",
        example: "你回中国了, 但海内存知己, 我们永远是朋友。"
      }
    ],
    cultural_notes_vi: "Xây tình bạn với người Trung Quốc tại Việt Nam là cơ hội đặc biệt — họ rời quê hương đến đất khách, cần kết nối, và bạn có lợi thế là 'native + có nền văn hóa gần'. Năm giai đoạn xây tình bạn:\n\nGIAI ĐOẠN 1 (1-3 tháng): SOCIAL EXCHANGE.\n- Mời đi cà phê / ăn trưa\n- Nói chuyện công việc + interests + thành phố\n- Trao đổi WeChat\n- Test compatibility cá nhân\nKey skill: be friendly without overstepping. Đừng hỏi quá personal (tiền lương, tình yêu, chính trị).\n\nGIAI ĐOẠN 2 (3-6 tháng): SHARED EXPERIENCES.\n- Cuối tuần đi chơi cùng (Văn Miếu, Hạ Long, Sapa)\n- Mời về nhà ăn cơm (BƯỚC LỚN — gặp gia đình)\n- Cùng đi nhậu/karaoke\n- Bắt đầu kể chuyện riêng (gia đình, ước mơ)\nKey skill: mời về nhà là bước quan trọng — đảm bảo gia đình bạn welcoming, không hỏi câu khó (lương, tuổi kết hôn).\n\nGIAI ĐOẠN 3 (6-12 tháng): TRUST BUILDING.\n- Giúp họ trong khó khăn (đi bệnh viện, dịch giấy tờ, thuê nhà)\n- Họ giúp bạn (việc, dạy tiếng Trung, kết nối với người Trung khác)\n- Chia sẻ tâm sự cá nhân\n- Tham dự sự kiện quan trọng (sinh nhật, kỷ niệm)\nKey skill: 'patience over performance' — không ép thân thiết, để tự nhiên phát triển.\n\nGIAI ĐOẠN 4 (1-2 năm): LIFE INTEGRATION.\n- Bạn của họ thành bạn của bạn\n- Gia đình hai bên biết nhau qua kể chuyện\n- Kế hoạch dài hạn cùng nhau (du lịch chung, business cooperation)\n- Không cần lý do để gặp\nKey skill: maintain individuality — giữ identity riêng của mình.\n\nGIAI ĐOẠN 5 (2+ năm): LIFELONG FRIENDSHIP.\n- Họ về Trung Quốc, bạn ở Việt Nam, vẫn liên lạc\n- Thăm nhau qua biên giới\n- Hỗ trợ lẫn nhau career/family decisions\n- 'Knowing each other beyond words'\nKey skill: 'invest without expecting return' — tình bạn cấp độ này không có ROI, chỉ có meaning.\n\nVề khác biệt cá nhân: không phải mọi người Trung Quốc đều giống nhau. Người miền Bắc (Bắc Kinh, Hắc Long Giang) có xu hướng formal hơn; miền Nam (Quảng Đông, Phúc Kiến) thân thiện hơn; miền Tây (Tứ Xuyên, Vân Nam) cởi mở và bộc trực; người Thượng Hải sophisticated. Đọc đối phương cẩn thận, đừng generalize.\n\nVề người Trung Quốc Hoa Kiều ở Việt Nam (Chợ Lớn, Q.5 HCMC): họ là 'người Việt gốc Hoa', đã ở Việt Nam nhiều thế hệ. Ngôn ngữ chính có thể là tiếng Việt, tiếng Quảng Đông, không phải Mandarin. Khi kết bạn với họ, chuẩn bị tinh thần khác với 'người Trung mới sang'.\n\nVề tình bạn cross-gender: bạn bè khác giới ở Trung Quốc đại lục được chấp nhận, nhưng vẫn có giới hạn (tránh đi đêm muộn 1-1, tránh tuyên bố 'good friend' công khai khi cả hai đã có gia đình). Xử lý tinh tế.",
    tip_advice_vi: "(1) ĐẦU TƯ THỜI GIAN, không tiền. Tình bạn thật xây qua giờ chất lượng (đi cà phê, đi bộ, nói chuyện) hơn qua tiền (tặng quà đắt, mời nhà hàng sang). (2) CHỦ ĐỘNG mời. Người Trung Quốc mới sang Việt Nam thường e ngại mời người Việt — cảm thấy là 'imposing'. Bạn chủ động = giải tỏa căng thẳng đó. Mỗi tuần 1 lần mời cà phê / ăn trưa cuối tuần đầu tiên. (3) HỌC 5-10 cụm tiếng Trung casual để dùng hàng ngày: '走吧' (đi nào), '加油' (cố lên), '没事' (không sao), '谢了' (cảm ơn nhé), '哥们' (anh em — male only). Sử dụng tự nhiên trong WeChat = thể hiện thân thiết. (4) GIỚI THIỆU bạn Trung Quốc của bạn cho NHÓM bạn Việt của bạn. Họ cần expand network. Mở 1 bữa nhậu nhóm, mix 50% Việt + 50% Trung Quốc — bonding rất mạnh. (5) NHỚ những ngày quan trọng: sinh nhật, ngày họ chuyển đến Việt Nam, ngày họ về Trung Quốc thăm nhà. Gửi tin chúc / quà nhỏ. Mỗi 'kỷ niệm' bạn nhớ = 1 điểm gắn kết sâu. (6) GIẢI THÍCH Việt Nam một cách tự nhiên trong các cuộc đi chơi. Đến phố cổ, kể về lịch sử Hà Nội. Đến hồ Hoàn Kiếm, kể chuyện rùa thần. KHÔNG bài bản, mà như story-telling cá nhân. (7) KHI HỌ VỀ NƯỚC, không 'kết thúc' mối quan hệ. Gửi tin WeChat đều đặn (1 tuần 1 lần), gửi ảnh đời sống, mời họ quay lại Việt Nam, lên kế hoạch sang Trung Quốc thăm họ. Tình bạn lifelong = 'long-distance maintenance' liên tục.",
    exercises: [
      { type: "fill-blank", question: "我们之间不需要客套, ___ 就好。", answer: "以诚相待" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung tình bạn với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "想家", pinyin: "xiǎng jiā", english: "nhớ nhà" },
          { chinese: "以诚相待", pinyin: "yǐ chéng xiāng dài", english: "đối đãi chân thành" },
          { chinese: "肝胆相照", pinyin: "gān dǎn xiāng zhào", english: "gan ruột soi nhau" },
          { chinese: "海内存知己", pinyin: "hǎi nèi cún zhī jǐ", english: "trong bốn biển có tri kỷ" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em nhớ nhà thì nói với mình, mình đi cùng em ăn món Trung. Mình là bạn rồi, không cần khách sáo.",
        chinese: "你想家了告诉我, 我陪你吃中国菜。我们是朋友, 不需要客套。",
        pinyin: "Nǐ xiǎng jiā le gào su wǒ, wǒ péi nǐ chī zhōng guó cài. Wǒ men shì péng you, bù xū yào kè tao."
      }
    ]
  },
  {
    id: 72,
    level: "B2",
    category: "travel_mobility",
    title: "在北京机场过海关",
    pinyin: "zài běi jīng jī chǎng guò hǎi guān",
    topic: "Immigration at Beijing/Shanghai/Guangzhou airport",
    title_vi: "Qua hải quan tại sân bay Bắc Kinh",
    title_en: "Going through immigration at a Chinese airport",
    sentences: [
      {
        chinese: "您好, 这是我的护照和签证。",
        pinyin: "Nín hǎo, zhè shì wǒ de hùzhào hé qiānzhèng.",
        english: "Hello, here is my passport and visa.",
        vi: "Chào anh/chị, đây là hộ chiếu và visa của em.",
        pronunciation_focus: ["护照 → hùzhào (hộ chiếu)", "签证 → qiānzhèng (visa)", "您好 → nín hǎo (chào formal)", "这是 → zhè shì"]
      },
      {
        chinese: "我来中国出差, 待五天。",
        pinyin: "Wǒ lái Zhōngguó chū chāi, dāi wǔ tiān.",
        english: "I'm in China on business, staying five days.",
        vi: "Em đến Trung Quốc công tác, ở năm ngày.",
        pronunciation_focus: ["出差 → chū chāi (đi công tác)", "待 → dāi (ở lại)", "五天 → wǔ tiān (năm ngày)", "中国 → Zhōngguó"]
      },
      {
        chinese: "我住在北京国贸的诺富特酒店。",
        pinyin: "Wǒ zhù zài Běijīng Guómào de Nuòfùtè jiǔdiàn.",
        english: "I'm staying at the Novotel hotel in Beijing Guomao.",
        vi: "Em ở khách sạn Novotel khu Quốc Mậu, Bắc Kinh.",
        pronunciation_focus: ["住在 → zhù zài (ở tại)", "国贸 → Guómào (Quốc Mậu — khu thương mại quốc tế)", "酒店 → jiǔdiàn (khách sạn)", "诺富特 → Nuòfùtè (Novotel)"]
      },
      {
        chinese: "返程机票是下周一上午的, 我可以给您看。",
        pinyin: "Fǎnchéng jīpiào shì xiàzhōu yī shàngwǔ de, wǒ kěyǐ gěi nín kàn.",
        english: "My return flight is next Monday morning — I can show you.",
        vi: "Vé về là sáng thứ Hai tuần sau, em có thể đưa anh/chị xem.",
        pronunciation_focus: ["返程 → fǎnchéng (lượt về)", "机票 → jīpiào (vé máy bay)", "下周一 → xiàzhōu yī (thứ Hai tuần sau)", "上午 → shàngwǔ (buổi sáng)"]
      },
      {
        chinese: "请问行李我去哪里取?",
        pinyin: "Qǐngwèn xíngli wǒ qù nǎlǐ qǔ?",
        english: "Excuse me, where do I pick up my luggage?",
        vi: "Cho em hỏi em lấy hành lý ở đâu?",
        pronunciation_focus: ["请问 → qǐngwèn (cho phép em hỏi)", "行李 → xíngli (hành lý)", "取 → qǔ (lấy)", "哪里 → nǎlǐ"]
      }
    ],
    vocab: [
      { chinese: "海关", pinyin: "hǎi guān", english: "customs", vi: "hải quan" },
      { chinese: "护照", pinyin: "hù zhào", english: "passport", vi: "hộ chiếu" },
      { chinese: "签证", pinyin: "qiān zhèng", english: "visa", vi: "thị thực / visa" },
      { chinese: "入境卡", pinyin: "rù jìng kǎ", english: "arrival card", vi: "tờ khai nhập cảnh" },
      { chinese: "出差", pinyin: "chū chāi", english: "business trip", vi: "đi công tác" },
      { chinese: "返程机票", pinyin: "fǎn chéng jī piào", english: "return ticket", vi: "vé khứ hồi" },
      { chinese: "停留时间", pinyin: "tíng liú shí jiān", english: "length of stay", vi: "thời gian lưu trú" },
      { chinese: "盖章", pinyin: "gài zhāng", english: "to stamp", vi: "đóng dấu" },
      { chinese: "申报", pinyin: "shēn bào", english: "to declare", vi: "khai báo" },
      { chinese: "提取行李", pinyin: "tí qǔ xíng li", english: "claim baggage", vi: "lấy hành lý" }
    ],
    dialogue: [
      { speaker: "海关人员", chinese: "您好, 请把护照和入境卡给我。", pinyin: "Nín hǎo, qǐng bǎ hùzhào hé rùjìngkǎ gěi wǒ.", english: "Hello, please hand me your passport and arrival card.", vi: "Chào anh, xin đưa em hộ chiếu và tờ khai nhập cảnh." },
      { speaker: "阮", chinese: "好的, 给您。", pinyin: "Hǎo de, gěi nín.", english: "Sure, here you go.", vi: "Vâng, em đưa anh." },
      { speaker: "海关人员", chinese: "您来中国做什么?", pinyin: "Nín lái Zhōngguó zuò shénme?", english: "What's the purpose of your visit to China?", vi: "Anh đến Trung Quốc làm gì?" },
      { speaker: "阮", chinese: "我来出差, 待五天。", pinyin: "Wǒ lái chū chāi, dāi wǔ tiān.", english: "Business trip, five days.", vi: "Em đi công tác, ở năm ngày." }
    ],
    dialogue_long: [
      { speaker: "海关人员", chinese: "您好, 把护照、入境卡和签证一起给我。", pinyin: "Nín hǎo, bǎ hùzhào, rùjìngkǎ hé qiānzhèng yīqǐ gěi wǒ.", english: "Hello, please give me your passport, arrival card, and visa together.", vi: "Chào anh, đưa em hộ chiếu, tờ khai nhập cảnh và visa cùng lúc." },
      { speaker: "阮", chinese: "都在这里, 您看。", pinyin: "Dōu zài zhèlǐ, nín kàn.", english: "All here, please check.", vi: "Đều ở đây, anh xem ạ." },
      { speaker: "海关人员", chinese: "您是越南国籍, 第一次来中国吗?", pinyin: "Nín shì Yuènán guójí, dì yī cì lái Zhōngguó ma?", english: "Vietnamese nationality — first time in China?", vi: "Anh quốc tịch Việt Nam, lần đầu đến Trung Quốc à?" },
      { speaker: "阮", chinese: "不是, 这是我第三次。前两次是去上海。", pinyin: "Bù shì, zhè shì wǒ dì sān cì. Qián liǎng cì shì qù Shànghǎi.", english: "No, this is my third time. Previous two were to Shanghai.", vi: "Không phải, đây là lần thứ ba. Hai lần trước em đi Thượng Hải." },
      { speaker: "海关人员", chinese: "这次来做什么?", pinyin: "Zhè cì lái zuò shénme?", english: "What's the purpose this time?", vi: "Lần này đến làm gì?" },
      { speaker: "阮", chinese: "出差, 跟北京的供应商谈合作。我们公司是越南的科技公司。", pinyin: "Chū chāi, gēn Běijīng de gōngyìngshāng tán hézuò. Wǒmen gōngsī shì Yuènán de kējì gōngsī.", english: "Business — meeting suppliers in Beijing to discuss cooperation. Our company is a Vietnamese tech firm.", vi: "Đi công tác, gặp nhà cung cấp Bắc Kinh thảo luận hợp tác. Công ty em là công ty công nghệ Việt Nam." },
      { speaker: "海关人员", chinese: "停留多长时间?", pinyin: "Tíngliú duō cháng shíjiān?", english: "How long is your stay?", vi: "Lưu trú bao lâu?" },
      { speaker: "阮", chinese: "五天, 周一返程。", pinyin: "Wǔ tiān, zhōu yī fǎnchéng.", english: "Five days, returning Monday.", vi: "Năm ngày, thứ Hai về." },
      { speaker: "海关人员", chinese: "返程机票方便看一下吗?", pinyin: "Fǎnchéng jīpiào fāngbiàn kàn yīxià ma?", english: "Could I see your return ticket?", vi: "Tiện cho em xem vé về không?" },
      { speaker: "阮", chinese: "在我手机里, 我打开给您看。", pinyin: "Zài wǒ shǒujī lǐ, wǒ dǎkāi gěi nín kàn.", english: "On my phone — let me open it.", vi: "Trong điện thoại em, em mở ra cho anh xem." },
      { speaker: "海关人员", chinese: "好的, 看到了。住宿地址是哪里?", pinyin: "Hǎo de, kàndào le. Zhùsù dìzhǐ shì nǎlǐ?", english: "Okay, I see it. What's your hotel address?", vi: "Được rồi, em thấy rồi. Địa chỉ nơi ở là đâu?" },
      { speaker: "阮", chinese: "国贸的诺富特酒店, 已经订好了, 入境卡上填了。", pinyin: "Guómào de Nuòfùtè jiǔdiàn, yǐjīng dìnghǎo le, rùjìngkǎ shàng tián le.", english: "Novotel in Guomao, already booked, written on the arrival card.", vi: "Novotel ở Quốc Mậu, đã đặt rồi, ghi trong tờ khai nhập cảnh rồi." },
      { speaker: "海关人员", chinese: "看一下镜头, 拍照。", pinyin: "Kàn yīxià jìngtóu, pāizhào.", english: "Look at the camera, photo time.", vi: "Nhìn vào camera, chụp ảnh." },
      { speaker: "阮", chinese: "好的。", pinyin: "Hǎo de.", english: "Sure.", vi: "Vâng." },
      { speaker: "海关人员", chinese: "好了, 给您盖章。提取行李往这边走, 出口在右手边。", pinyin: "Hǎo le, gěi nín gài zhāng. Tíqǔ xíngli wǎng zhè biān zǒu, chūkǒu zài yòushǒu biān.", english: "Done, stamped. Baggage claim is this way, exit on the right.", vi: "Xong, đóng dấu cho anh. Lấy hành lý đi lối này, lối ra bên phải." },
      { speaker: "阮", chinese: "谢谢您, 辛苦了。", pinyin: "Xièxie nín, xīnkǔ le.", english: "Thank you, you're working hard.", vi: "Cảm ơn anh, vất vả rồi." }
    ],
    roleplay_prompts: [
      "Đóng vai khách Việt qua hải quan Bắc Kinh lần đầu. Tình huống bị hỏi nhiều câu vì hộ chiếu trắng (chưa từng đi đâu). Hãy bình tĩnh trả lời 5 câu hỏi cơ bản: mục đích, thời gian, nơi ở, vé về, công ty. Trả lời ngắn gọn, rõ ràng, không nói thêm chi tiết không cần thiết.",
      "Cán bộ hải quan hỏi 'tại sao lần này ở lâu hơn lần trước'. Hãy giải thích đơn giản: dự án mới, nhiều cuộc họp. Đưa lịch họp trên điện thoại nếu được hỏi. Tránh đi vào chi tiết quá nhiều.",
      "Bạn quên điền tờ khai nhập cảnh trên máy bay. Hãy xin lỗi cán bộ + xin một tờ + điền nhanh tại quầy. Dùng cụm '不好意思, 我能现在填一下吗?' (xin lỗi, em điền bây giờ được không?)."
    ],
    register_notes: "Hải quan Trung Quốc đại lục dùng register formal trung tính — 您 với khách, ngắn gọn không thân mật. Bạn cũng dùng 您 với cán bộ. KHÔNG dùng 你 với cán bộ hải quan dù họ trẻ.\n\nCác cụm chuẩn:\n- '您好, 这是我的护照' (chào anh/chị, đây là hộ chiếu của em)\n- '我来出差/旅游/学习' (em đi công tác/du lịch/học)\n- '待X天/X周/X个月' (ở X ngày/tuần/tháng)\n- '住在X酒店' (ở khách sạn X)\n- '请问行李去哪里取?' (xin hỏi lấy hành lý ở đâu?)\n\nKhi cán bộ yêu cầu: 'Có thể xem...' (方便看一下吗?) → đáp '好的, 给您' (vâng, em đưa anh) hoặc '在我手机里, 我打开给您看' (trong điện thoại em, em mở cho anh xem).\n\nKhi cán bộ chụp ảnh: '看一下镜头' (nhìn vào camera) → đứng yên, không cười rộng. Tóc không che mặt. Kính có thể tháo nếu được yêu cầu.\n\nTránh: (a) Nói tiếng Anh trừ khi cán bộ chuyển sang tiếng Anh trước; (b) Giấu thông tin (giả vờ không hiểu); (c) Đùa cợt — hải quan toàn cầu không khoan dung kiểu này; (d) Mở điện thoại xem nội dung khác khi đang xếp hàng.",
    idiom_glosses: [
      {
        idiom: "通行无阻",
        literal: "đi không bị cản (tōng xíng wú zǔ)",
        meaning: "Đi qua thuận lợi, không gặp trở ngại — dùng để miêu tả việc qua hải quan/cửa khẩu suôn sẻ. 'Hộ chiếu của em qua hải quan thông hành vô trở.'",
        example: "我的护照过海关通行无阻。"
      },
      {
        idiom: "一帆风顺",
        literal: "một cánh buồm thuận gió (yī fán fēng shùn)",
        meaning: "Mọi việc thuận lợi từ đầu đến cuối — chúc người khởi hành. Cụm cao cấp dùng để chúc bạn bè trước chuyến công tác.",
        example: "祝您这次出差一帆风顺。"
      },
      {
        idiom: "有备无患",
        literal: "có chuẩn bị thì không lo (yǒu bèi wú huàn)",
        meaning: "Có chuẩn bị thì không gặp rắc rối — chuẩn bị giấy tờ kỹ trước khi qua hải quan. Cụm dùng để giải thích tại sao bạn mang đầy đủ giấy tờ phụ.",
        example: "我把所有文件都带上, 有备无患。"
      },
      {
        idiom: "万无一失",
        literal: "vạn việc không thất (wàn wú yī shī)",
        meaning: "Hoàn toàn chắc chắn không có sai sót — chuẩn bị rất kỹ. Cụm dùng khi muốn diễn đạt 'em đã kiểm tra mọi thứ rồi'. Mạnh hơn 有备无患.",
        example: "出行前我检查三遍, 万无一失。"
      }
    ],
    cultural_notes_vi: "Hải quan Trung Quốc đại lục có quy trình chặt chẽ — không khó nhưng có vài điểm khác Việt Nam: (1) ĐIỀN TỜ KHAI NHẬP CẢNH (入境卡) trên máy bay, không phải tại sân bay. Tiếp viên phát trước hạ cánh 30-60 phút. Điền BẰNG CHỮ IN HOA + tiếng Anh, KHÔNG tiếng Việt. Nếu quên, có quầy điền tại sân bay (miễn phí). (2) KIỂM TRA SINH TRẮC HỌC: chụp ảnh + lấy vân tay (10 ngón) lần đầu nhập cảnh. Lần 2 trở đi chỉ cần ảnh. Quá trình 2-3 phút. (3) QUYỀN HÀNH LÝ: thường 1 vali xách tay + 1 ký gửi. Nếu mang đồ ăn (mắm, nem, lạp xưởng), khai báo — phần lớn bị tịch thu (Trung Quốc cấm sản phẩm thịt sống/ướp). Trà, cà phê, bánh khô = OK. (4) HỆ THỐNG XANH/ĐỎ: 'Nothing to declare' (绿色通道) hoặc 'Goods to declare' (红色通道). Nếu mang >5,000 USD tiền mặt, máy ảnh DSLR đắt tiền, đồng hồ Rolex — đi đỏ. Đi xanh khi có hàng cấm = phạt nặng. (5) CHỜ ĐỢI: cao điểm (15-22h) có thể chờ 30-90 phút. Có quầy 'Foreign passports' (外国人护照) riêng, thường ngắn hơn quầy Trung Quốc. (6) WIFI SÂN BAY: bắt buộc xác thực bằng số điện thoại + CMND/hộ chiếu. KHÔNG dùng wifi free để xử lý việc nhạy cảm — dùng 4G data Việt Nam (roaming) hoặc mua eSIM Trung Quốc trước khi đi.\n\nVề nhập cảnh khu vực đặc biệt: Hong Kong/Macau dùng giấy thông hành riêng (港澳通行证) cho công dân TQ; người Việt qua bằng hộ chiếu + visa riêng. Đại lục → Hong Kong vẫn phải qua hải quan như nhập nước khác. Đừng nhầm.\n\nVề thời gian visa: visa du lịch Trung Quốc thường 30 ngày, lưu trú đơn lẻ ≤30 ngày, hiệu lực 90 ngày từ ngày cấp. Quá hạn = phạt 500 tệ/ngày + có thể bị từ chối nhập cảnh lần sau.",
    tip_advice_vi: "(1) CHUẨN BỊ giấy tờ trong túi áo trước hạ cánh: hộ chiếu, visa, vé về (in giấy hoặc trong điện thoại), địa chỉ khách sạn (in giấy backup). KHÔNG để trong vali ký gửi — không có thì không qua được hải quan. (2) ĐIỀN TỜ KHAI NHẬP CẢNH cẩn thận trên máy bay: tên VIẾT HOA giống hộ chiếu, ngày tháng theo format DD/MM/YYYY, địa chỉ khách sạn ĐẦY ĐỦ (số nhà, đường, quận, thành phố). Sai = phải làm lại tại sân bay = mất thời gian. (3) BÌNH TĨNH khi bị hỏi nhiều câu — không phải lúc nào cũng có nghĩa là có vấn đề. Cán bộ hải quan có quyền hỏi tự do. Trả lời đúng, ngắn, không thêm thông tin. (4) KHÔNG MANG đồ ăn động vật (lạp xưởng, jerky, mắm tép, nem chua) — bị tịch thu chắc chắn. Cà phê, trà, bánh khô, trái cây sấy = OK. Nếu nghi ngờ, KHAI BÁO. (5) ĐỔI TIỀN trước hoặc tại sân bay (tỷ giá kém ~3-5%) hoặc dùng Alipay/WeChat Pay (cần kết nối với thẻ ngân hàng quốc tế từ trước). KHÔNG mang quá 5,000 USD tiền mặt mà không khai báo. (6) MUA SIM hoặc bật ROAMING: đại lục Trung Quốc chặn Google, Facebook, WhatsApp — dùng VPN nếu cần (nhưng VPN ở đại lục là khu vực xám, dùng thận trọng). Wifi sân bay free cần xác thực bằng số ĐT/hộ chiếu — chấp nhận được. (7) KHI BỊ KÉO RA QUẦY PHỤ (二次检查 — kiểm tra lần hai): không phải dấu hiệu xấu. Cán bộ kiểm tra ngẫu nhiên hoặc do hệ thống flag. Bình tĩnh, hợp tác, mở vali nếu được yêu cầu. Quá trình 5-15 phút. KHÔNG quay phim/chụp ảnh.",
    exercises: [
      { type: "fill-blank", question: "您好, 这是我的护照和 ___ 。", answer: "签证" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung hải quan với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "海关", pinyin: "hǎi guān", english: "hải quan" },
          { chinese: "入境卡", pinyin: "rù jìng kǎ", english: "tờ khai nhập cảnh" },
          { chinese: "盖章", pinyin: "gài zhāng", english: "đóng dấu" },
          { chinese: "提取行李", pinyin: "tí qǔ xíng li", english: "lấy hành lý" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em đến Trung Quốc công tác, ở năm ngày, ở khách sạn Novotel. Vé về là sáng thứ Hai tuần sau.",
        chinese: "我来中国出差, 待五天, 住在诺富特酒店。返程机票是下周一上午的。",
        pinyin: "Wǒ lái zhōng guó chū chāi, dāi wǔ tiān, zhù zài nuò fù tè jiǔ diàn. Fǎn chéng jī piào shì xià zhōu yī shàng wǔ de."
      }
    ]
  },
  {
    id: 73,
    level: "B2",
    category: "travel_mobility",
    title: "护照丢了 — 在越南驻华使馆补办",
    pinyin: "hù zhào diū le — zài yuè nán zhù huá shǐ guǎn bǔ bàn",
    topic: "Lost passport — replacement at Vietnamese embassy in Beijing",
    title_vi: "Mất hộ chiếu — làm lại tại Đại sứ quán Việt Nam ở Bắc Kinh",
    title_en: "Lost passport — replacement at Vietnamese embassy in Beijing",
    sentences: [
      {
        chinese: "您好, 我的护照丢了, 想申请补办。",
        pinyin: "Nín hǎo, wǒ de hùzhào diū le, xiǎng shēnqǐng bǔbàn.",
        english: "Hello, I've lost my passport — I'd like to apply for a replacement.",
        vi: "Em chào anh/chị, hộ chiếu của em bị mất, em muốn xin làm lại.",
        pronunciation_focus: ["丢 → diū (mất / đánh rơi)", "补办 → bǔbàn (làm lại / cấp lại)", "申请 → shēnqǐng (xin)", "护照 → hùzhào"]
      },
      {
        chinese: "我已经在派出所报案了, 这是报案回执。",
        pinyin: "Wǒ yǐjīng zài pàichūsuǒ bào'àn le, zhè shì bào'àn huízhí.",
        english: "I already filed a police report — here's the receipt.",
        vi: "Em đã trình báo công an rồi, đây là biên nhận.",
        pronunciation_focus: ["派出所 → pàichūsuǒ (đồn công an khu vực)", "报案 → bào'àn (trình báo)", "回执 → huízhí (biên nhận)", "已经 → yǐjīng"]
      },
      {
        chinese: "我有护照复印件和身份证电子版。",
        pinyin: "Wǒ yǒu hùzhào fùyìnjiàn hé shēnfènzhèng diànzǐ bǎn.",
        english: "I have a copy of the passport and a digital copy of my ID.",
        vi: "Em có bản sao hộ chiếu và bản số CMND.",
        pronunciation_focus: ["复印件 → fùyìnjiàn (bản sao chụp)", "身份证 → shēnfènzhèng (CMND)", "电子版 → diànzǐ bǎn (bản điện tử)", "有 → yǒu"]
      },
      {
        chinese: "请问补办需要多久? 我的航班是后天的。",
        pinyin: "Qǐngwèn bǔbàn xūyào duō jiǔ? Wǒ de hángbān shì hòutiān de.",
        english: "How long does the replacement take? My flight is in two days.",
        vi: "Cho em hỏi cấp lại mất bao lâu? Vé bay của em hai ngày nữa.",
        pronunciation_focus: ["多久 → duō jiǔ (bao lâu)", "航班 → hángbān (chuyến bay)", "后天 → hòutiān (kia / hai ngày sau)", "需要 → xūyào"]
      },
      {
        chinese: "如果来不及, 是否可以申请临时旅行证件?",
        pinyin: "Rúguǒ láibují, shìfǒu kěyǐ shēnqǐng línshí lǚxíng zhèngjiàn?",
        english: "If there's no time, can I apply for an emergency travel document?",
        vi: "Nếu không kịp, em có thể xin giấy thông hành khẩn cấp được không?",
        pronunciation_focus: ["来不及 → láibují (không kịp)", "临时 → línshí (tạm thời)", "旅行证件 → lǚxíng zhèngjiàn (giấy đi đường)", "是否 → shìfǒu (có thể)"]
      }
    ],
    vocab: [
      { chinese: "丢失", pinyin: "diū shī", english: "to lose (item)", vi: "mất (đồ)" },
      { chinese: "补办", pinyin: "bǔ bàn", english: "to reissue / replace", vi: "cấp lại" },
      { chinese: "使馆", pinyin: "shǐ guǎn", english: "embassy", vi: "đại sứ quán" },
      { chinese: "领事处", pinyin: "lǐng shì chù", english: "consular section", vi: "phòng lãnh sự" },
      { chinese: "报案回执", pinyin: "bào àn huí zhí", english: "police report receipt", vi: "biên nhận trình báo" },
      { chinese: "临时旅行证", pinyin: "lín shí lǚ xíng zhèng", english: "emergency travel document", vi: "giấy thông hành tạm thời" },
      { chinese: "复印件", pinyin: "fù yìn jiàn", english: "photocopy", vi: "bản sao chụp" },
      { chinese: "证件照", pinyin: "zhèng jiàn zhào", english: "ID photo", vi: "ảnh thẻ" },
      { chinese: "费用", pinyin: "fèi yòng", english: "fee", vi: "phí" },
      { chinese: "受理", pinyin: "shòu lǐ", english: "to accept (application)", vi: "tiếp nhận" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "您好, 我的越南护照丢了, 需要补办。", pinyin: "Nín hǎo, wǒ de Yuènán hùzhào diū le, xūyào bǔbàn.", english: "Hello, I lost my Vietnamese passport, I need a replacement.", vi: "Chào anh/chị, hộ chiếu Việt Nam của em bị mất, em cần làm lại." },
      { speaker: "工作人员", chinese: "请提供报案回执、护照复印件和两张证件照。", pinyin: "Qǐng tígōng bào'àn huízhí, hùzhào fùyìnjiàn hé liǎng zhāng zhèngjiànzhào.", english: "Please provide the police report receipt, passport copy, and two ID photos.", vi: "Xin cung cấp biên nhận trình báo, bản sao hộ chiếu và hai ảnh thẻ." },
      { speaker: "阮", chinese: "都准备好了。补办需要多长时间?", pinyin: "Dōu zhǔnbèi hǎo le. Bǔbàn xūyào duō cháng shíjiān?", english: "All ready. How long for the replacement?", vi: "Em đã chuẩn bị hết. Cấp lại mất bao lâu?" },
      { speaker: "工作人员", chinese: "正常需要七到十个工作日。如果紧急, 可以申请临时旅行证, 三个工作日。", pinyin: "Zhèngcháng xūyào qī dào shí gè gōngzuò rì. Rúguǒ jǐnjí, kěyǐ shēnqǐng línshí lǚxíng zhèng, sān gè gōngzuò rì.", english: "Normally 7-10 business days. If urgent, you can apply for emergency travel doc, 3 business days.", vi: "Bình thường 7-10 ngày làm việc. Nếu khẩn, có thể xin giấy thông hành tạm 3 ngày." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "您好, 我是越南公民, 在北京出差时护照丢了。", pinyin: "Nín hǎo, wǒ shì Yuènán gōngmín, zài Běijīng chū chāi shí hùzhào diū le.", english: "Hello, I'm a Vietnamese citizen — I lost my passport during a business trip in Beijing.", vi: "Chào anh, em là công dân Việt Nam, mất hộ chiếu khi đi công tác ở Bắc Kinh." },
      { speaker: "工作人员", chinese: "什么时候发现丢的?", pinyin: "Shénme shíhou fāxiàn diū de?", english: "When did you discover it was lost?", vi: "Khi nào em phát hiện bị mất?" },
      { speaker: "阮", chinese: "昨天晚上回酒店时发现的。我立刻去附近派出所报案了。", pinyin: "Zuótiān wǎnshàng huí jiǔdiàn shí fāxiàn de. Wǒ lìkè qù fùjìn pàichūsuǒ bào'àn le.", english: "Last night when returning to the hotel. I went to the nearest police station immediately.", vi: "Tối qua khi về khách sạn. Em đã đến đồn công an gần đó trình báo ngay." },
      { speaker: "工作人员", chinese: "好, 报案回执给我看一下。", pinyin: "Hǎo, bào'àn huízhí gěi wǒ kàn yīxià.", english: "Good, show me the police report receipt.", vi: "Được, em đưa biên nhận trình báo cho anh xem." },
      { speaker: "阮", chinese: "在这里。还有我护照的复印件、身份证电子版、和两张证件照。", pinyin: "Zài zhèlǐ. Hái yǒu wǒ hùzhào de fùyìnjiàn, shēnfènzhèng diànzǐ bǎn, hé liǎng zhāng zhèngjiànzhào.", english: "Here. Plus a passport copy, digital ID copy, and two ID photos.", vi: "Đây ạ. Còn có bản sao hộ chiếu, bản số CMND, và hai ảnh thẻ." },
      { speaker: "工作人员", chinese: "您准备得很周到。请填这张申请表, 我看一下。", pinyin: "Nín zhǔnbèi de hěn zhōudào. Qǐng tián zhè zhāng shēnqǐng biǎo, wǒ kàn yīxià.", english: "You're well-prepared. Please fill this application form, let me check.", vi: "Em chuẩn bị rất chu đáo. Xin điền đơn này, em xem qua." },
      { speaker: "阮", chinese: "请问补办大概需要多久?", pinyin: "Qǐngwèn bǔbàn dàgài xūyào duō jiǔ?", english: "How long does the replacement take?", vi: "Cho em hỏi cấp lại khoảng bao lâu?" },
      { speaker: "工作人员", chinese: "标准是七到十个工作日, 因为新护照需要从越南本国寄过来。", pinyin: "Biāozhǔn shì qī dào shí gè gōngzuò rì, yīnwèi xīn hùzhào xūyào cóng Yuènán běnguó jì guòlái.", english: "Standard is 7-10 business days, because the new passport ships from Vietnam.", vi: "Tiêu chuẩn 7-10 ngày làm việc, vì hộ chiếu mới phải gửi từ Việt Nam sang." },
      { speaker: "阮", chinese: "可是我后天就要回越南了, 来不及。能否申请临时旅行证件?", pinyin: "Kěshì wǒ hòutiān jiù yào huí Yuènán le, láibují. Néngfǒu shēnqǐng línshí lǚxíng zhèngjiàn?", english: "But my flight back to Vietnam is in two days — won't make it. Can I apply for an emergency travel document?", vi: "Nhưng hai ngày nữa em đã về Việt Nam rồi, không kịp. Em có thể xin giấy thông hành tạm không?" },
      { speaker: "工作人员", chinese: "可以。临时旅行证件三个工作日就能拿到, 但只能用于回越南, 不能用于其他国家。费用一千二百人民币。", pinyin: "Kěyǐ. Línshí lǚxíng zhèngjiàn sān gè gōngzuò rì jiù néng ná dào, dàn zhǐ néng yòng yú huí Yuènán, bù néng yòng yú qítā guójiā. Fèiyòng yīqiān èrbǎi rénmínbì.", english: "Yes. Emergency travel doc takes 3 business days, but only valid for return to Vietnam, not other countries. Fee is 1,200 RMB.", vi: "Được. Giấy thông hành tạm 3 ngày là có, nhưng chỉ dùng để về Việt Nam, không dùng đi nước khác. Phí 1,200 nhân dân tệ." },
      { speaker: "阮", chinese: "够用了, 我只需要回越南。后天上午能取吗?", pinyin: "Gòu yòng le, wǒ zhǐ xūyào huí Yuènán. Hòutiān shàngwǔ néng qǔ ma?", english: "That's enough — I only need to get back. Can I pick up the day after tomorrow morning?", vi: "Đủ rồi, em chỉ cần về Việt Nam. Sáng kia có thể lấy được không?" },
      { speaker: "工作人员", chinese: "今天受理, 后天下午两点以后就能取。建议您改签机票, 改成下午或者晚上的航班。", pinyin: "Jīntiān shòulǐ, hòutiān xiàwǔ liǎng diǎn yǐhòu jiù néng qǔ. Jiànyì nín gǎiqiān jīpiào, gǎi chéng xiàwǔ huòzhě wǎnshàng de hángbān.", english: "Accepted today, picked up after 2pm day after tomorrow. Recommend changing your flight to afternoon or evening.", vi: "Hôm nay tiếp nhận, kia 2 giờ chiều sau là lấy được. Khuyên anh đổi vé sang chuyến chiều hoặc tối." },
      { speaker: "阮", chinese: "好的, 我马上改签。这是费用, 怎么交?", pinyin: "Hǎo de, wǒ mǎshàng gǎiqiān. Zhè shì fèiyòng, zěnme jiāo?", english: "Okay, I'll change the flight now. Here's the fee — how do I pay?", vi: "Vâng, em đổi ngay. Đây là phí, em nộp thế nào?" },
      { speaker: "工作人员", chinese: "现金或微信支付都可以。微信扫这个码。", pinyin: "Xiànjīn huò wēixìn zhīfù dōu kěyǐ. Wēixìn sǎo zhège mǎ.", english: "Cash or WeChat Pay both work. Scan this QR code for WeChat.", vi: "Tiền mặt hoặc WeChat Pay đều được. Quét mã này cho WeChat." },
      { speaker: "阮", chinese: "用微信。扫好了, 谢谢您的帮助!", pinyin: "Yòng wēixìn. Sǎo hǎo le, xièxie nín de bāngzhù!", english: "WeChat. Scanned, thank you for your help!", vi: "Em dùng WeChat. Quét xong, cảm ơn anh đã giúp!" },
      { speaker: "工作人员", chinese: "不客气。后天下午带这张收据来取证件。一路平安。", pinyin: "Bù kèqì. Hòutiān xiàwǔ dài zhè zhāng shōujù lái qǔ zhèngjiàn. Yī lù píng'ān.", english: "You're welcome. Bring this receipt the day after tomorrow afternoon to collect your document. Safe travels.", vi: "Không có gì. Chiều kia mang biên nhận này đến lấy giấy tờ. Đi đường bình an." }
    ],
    roleplay_prompts: [
      "Bạn vừa phát hiện ví và hộ chiếu bị mất tại nhà ga Bắc Kinh. Hãy diễn tập 3 bước trong 10 phút đầu: (a) gọi khách sạn xem có để lại không, (b) gọi đại sứ quán Việt Nam (010-65325410) báo trước, (c) đi đồn công an gần nhất trình báo. Dùng cụm '我护照丢了, 请帮帮我' với từng nơi.",
      "Tại đại sứ quán, bạn quên không mang ảnh thẻ. Hãy hỏi cán bộ có thể chụp tại chỗ không (一些使馆有自助拍照机) — nếu không thì đi đâu chụp gần đó (附近哪里能拍证件照?). Dùng cụm 'sorry, em quên... có cách nào không?'.",
      "Bạn không có đủ tiền nộp phí 1,200 tệ (chỉ còn 800). Hãy đề xuất giải pháp: nộp 800 trước + chuyển thêm 400 từ tài khoản Việt Nam qua chuyển khoản quốc tế. Hỏi rõ deadline."
    ],
    register_notes: "Đại sứ quán Việt Nam tại Bắc Kinh có cán bộ nói tiếng Việt — bạn có thể nói tiếng Việt hoàn toàn. NHƯNG nếu bạn đi nhánh tiếng Trung (do hết người tiếng Việt, hoặc đi văn phòng địa phương), dùng register formal: 您 với cán bộ, ngắn gọn rõ ràng.\n\nCác cụm chuẩn cho trường hợp khẩn:\n- '我护照丢了' (hộ chiếu của em bị mất) — câu mở chuẩn\n- '我已经报案了' (em đã trình báo rồi)\n- '请问补办需要多久' (xin hỏi cấp lại mất bao lâu)\n- '能否申请临时旅行证件' (có thể xin giấy thông hành tạm không)\n- '我后天就要回国' (kia em đã phải về nước)\n\nKhi nói chuyện với công an Trung Quốc trước đó (派出所): cũng dùng 您, kể sự việc theo trật tự thời gian (mất khi nào, ở đâu, làm gì). KHÔNG đoán mò ai lấy. KHÔNG buộc tội người cụ thể không có bằng chứng.\n\nTránh: (a) Khóc lóc tại đại sứ quán — không đẩy nhanh quá trình; (b) Đòi hỏi 'làm hộ em ngay' — quá trình có quy định; (c) Hối lộ — phạm luật cả hai phía; (d) Đăng status mạng xã hội kiểu 'mất hộ chiếu, đang ở Trung Quốc, ai giúp' — kẻ xấu sẽ lợi dụng.",
    idiom_glosses: [
      {
        idiom: "雪上加霜",
        literal: "tuyết trên thêm sương (xuě shàng jiā shuāng)",
        meaning: "Tuyết phủ lại thêm sương — họa vô đơn chí, chuyện xấu chồng chất. Cụm dùng khi mô tả tình huống đã tệ lại càng tệ hơn (mất hộ chiếu + sắp hết visa). Tránh lạm dụng — chỉ dùng khi thực sự nghiêm trọng.",
        example: "本来要赶飞机, 又下大雨, 真是雪上加霜。"
      },
      {
        idiom: "急中生智",
        literal: "trong khẩn cấp sinh trí (jí zhōng shēng zhì)",
        meaning: "Trong tình huống khẩn nảy ra ý hay — phản ứng sáng suốt khi gấp gáp. Cụm dùng để khen người xử lý khôn ngoan trong khẩn cấp: 'em đã 急中生智 đi báo công an ngay.'",
        example: "我急中生智, 立刻打电话给酒店。"
      },
      {
        idiom: "化险为夷",
        literal: "biến nguy thành an (huà xiǎn wéi yí)",
        meaning: "Biến nguy hiểm thành an toàn — vượt qua khủng hoảng thành công. Cụm dùng để cảm ơn người đã giúp giải quyết tình huống khẩn: 'cảm ơn anh đã giúp em 化险为夷'.",
        example: "幸亏您帮忙, 才能化险为夷。"
      },
      {
        idiom: "有惊无险",
        literal: "có sợ nhưng không nguy (yǒu jīng wú xiǎn)",
        meaning: "Hết hồn nhưng không sao — sự việc kết thúc an toàn dù lúc đầu đáng sợ. Cụm an ủi cuối khi mọi việc đã xong: 'lần này 有惊无险, em rút kinh nghiệm rồi.'",
        example: "护照虽然丢了, 但及时补办, 有惊无险。"
      }
    ],
    cultural_notes_vi: "Mất hộ chiếu ở Trung Quốc là tình huống có quy trình rõ — không dễ chịu nhưng giải quyết được trong 3-10 ngày. Bốn nguyên tắc cốt lõi: (1) BÁO CÔNG AN TRƯỚC khi đến đại sứ quán. Đại sứ quán Việt Nam YÊU CẦU biên nhận trình báo (报案回执) — không có = không tiếp nhận đơn. Đến 派出所 khu vực bạn mất (không phải khu khác), kể chi tiết, lấy giấy in dấu đỏ. Quá trình 30-60 phút, miễn phí. (2) GỌI ĐẠI SỨ QUÁN trước khi đến — số 010-65325410 (Bắc Kinh) hoặc Tổng lãnh sự quán TP HCM (021-) ở Thượng Hải. Họ sẽ tư vấn ngày giờ đến, giấy tờ cần. KHÔNG đến không hẹn — có thể phải đợi 2-3 giờ. (3) GIẤY TỜ MANG: (a) biên nhận trình báo; (b) bản sao hộ chiếu (chụp trước khi đi từ Việt Nam — bài học vàng); (c) bản số/sao CMND; (d) 2 ảnh thẻ 4x6 nền trắng (chụp tại studio gần đại sứ quán nếu không có); (e) đơn xin (lấy tại đại sứ quán hoặc download trước); (f) tiền mặt hoặc WeChat Pay (1,200 tệ cho giấy thông hành tạm). (4) HAI LOẠI GIẤY: 'hộ chiếu mới' (7-10 ngày, in từ Việt Nam) hoặc 'giấy thông hành tạm thời' (3 ngày, chỉ về Việt Nam, không đi nước khác). Nếu bay về Việt Nam trực tiếp, giấy thông hành tạm là đủ.\n\nVề bảo hiểm du lịch: nếu bạn có bảo hiểm du lịch (Bảo Việt, BSH, MIC), nó CHI TRẢ phí cấp lại hộ chiếu (~1,200 tệ) + chi phí thay đổi vé bay + thêm đêm khách sạn. Liên hệ hotline ngay sau khi báo công an. Yêu cầu mọi biên nhận (trình báo, đại sứ quán, vé bay đổi, khách sạn) — gửi cho bảo hiểm khi về Việt Nam.\n\nVề lần sau khi đi Trung Quốc: chụp ảnh hộ chiếu + visa LƯU CLOUD (Google Drive, iCloud) — không chỉ trong điện thoại. Mất điện thoại = mất luôn ảnh. Email cho bản thân = backup tốt nhất. In giấy 1 bản để trong vali ký gửi (riêng khỏi hộ chiếu chính).\n\nVề việc đi lại trong Trung Quốc khi không có hộ chiếu: KHÔNG bay nội địa được. KHÔNG mua vé tàu cao tốc được. KHÔNG check-in khách sạn được (cần đăng ký với công an). Nếu cần ở thêm, ở khách sạn nhỏ chấp nhận giấy báo công an (一些客栈) — chuẩn bị tiền mặt vì chuyển khoản cũng cần ID.",
    tip_advice_vi: "(1) PHÒNG HỘ CHIẾU MẤT từ Việt Nam: chụp ảnh hộ chiếu + visa, lưu Google Drive + email cho bản thân + photocopy 2 bản để 1 trong vali ký gửi. Bài học vàng: 80% người mất hộ chiếu mất luôn cách giải quyết nhanh vì không có bản sao. (2) MẤT TẠI KHÁCH SẠN/TAXI/QUÁN ĂN: gọi ngay khách sạn/công ty taxi. 60% trường hợp nhân viên dọn dẹp nhặt được. Để lại số ĐT VN (kèm mã +84). (3) MẤT TẠI ĐÔNG NGƯỜI (chợ, ga, sân bay): xác suất tìm lại thấp. Đi thẳng đồn công an gần nhất, không lãng phí thời gian. (4) ĐỒN CÔNG AN: tìm 派出所 trên Baidu Maps, đến cửa, nói '我护照丢了, 来报案' (hộ chiếu em mất, đến trình báo). Cán bộ sẽ hướng dẫn điền form. KHÔNG đoán/buộc tội ai. KHÔNG nói 'có thể nhân viên khách sạn lấy' nếu không có bằng chứng. (5) CHỜ ĐẠI SỨ QUÁN: thường thứ 2-thứ 6, 8:30-11:30 sáng. Đến SỚM 30 phút, mang theo 2 ảnh thẻ + đầy đủ giấy tờ. Nếu thiếu, có studio chụp ảnh thẻ ngay gần đại sứ quán Việt Nam (Bắc Kinh — Triều Dương quận, Sanlitun phía Đông). (6) ĐỔI VÉ BAY: gọi hãng bay (Vietnam Airlines: 028-3823-2320, Vietjet: 1900-1886) trước khi đến đại sứ quán. Đổi vé thường mất 100-300 USD phí thay đổi + chênh lệch giá. Bảo hiểm du lịch trả phần này. (7) KHI VỀ VIỆT NAM: với giấy thông hành tạm, vào nhập cảnh quầy 'Vietnam citizens'. Cán bộ Việt Nam sẽ giữ giấy này. Sau 30 ngày, đi cảnh sát quận làm hộ chiếu mới (1.500.000 VND, 7-14 ngày). Báo cảnh sát cũ tại Việt Nam về việc mất hộ chiếu (nếu chưa).",
    exercises: [
      { type: "fill-blank", question: "我已经在派出所 ___ 了, 这是回执。", answer: "报案" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung mất hộ chiếu với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "补办", pinyin: "bǔ bàn", english: "cấp lại" },
          { chinese: "使馆", pinyin: "shǐ guǎn", english: "đại sứ quán" },
          { chinese: "报案回执", pinyin: "bào àn huí zhí", english: "biên nhận trình báo" },
          { chinese: "临时旅行证", pinyin: "lín shí lǚ xíng zhèng", english: "giấy thông hành tạm" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Hộ chiếu của em bị mất, em đã trình báo công an. Em hai ngày nữa phải về Việt Nam, có thể xin giấy thông hành tạm không?",
        chinese: "我的护照丢了, 已经报案了。我后天要回越南, 能否申请临时旅行证件?",
        pinyin: "Wǒ de hù zhào diū le, yǐ jīng bào àn le. Wǒ hòu tiān yào huí Yuè nán, néng fǒu shēn qǐng lín shí lǚ xíng zhèng jiàn?"
      }
    ]
  },
  {
    id: 74,
    level: "B2",
    category: "travel_mobility",
    title: "改签高铁车票 — 处理手续费",
    pinyin: "gǎi qiān gāo tiě chē piào — chǔ lǐ shǒu xù fèi",
    topic: "Booking change — high-speed rail, fee dispute",
    title_vi: "Đổi vé tàu cao tốc — xử lý phí thủ tục",
    title_en: "Booking change — high-speed rail, fee dispute",
    sentences: [
      {
        chinese: "您好, 我想改签明天上海到北京的高铁。",
        pinyin: "Nín hǎo, wǒ xiǎng gǎiqiān míngtiān Shànghǎi dào Běijīng de gāotiě.",
        english: "Hello, I'd like to change my Shanghai-Beijing high-speed rail ticket for tomorrow.",
        vi: "Em chào anh/chị, em muốn đổi vé tàu cao tốc Thượng Hải đi Bắc Kinh ngày mai.",
        pronunciation_focus: ["改签 → gǎiqiān (đổi chuyến)", "高铁 → gāotiě (tàu cao tốc)", "上海到北京 → Shànghǎi dào Běijīng", "明天 → míngtiān"]
      },
      {
        chinese: "原本是早上九点的, 想改成下午三点。",
        pinyin: "Yuánběn shì zǎoshang jiǔ diǎn de, xiǎng gǎi chéng xiàwǔ sān diǎn.",
        english: "Originally 9 AM, I want to change it to 3 PM.",
        vi: "Vé gốc là 9 giờ sáng, em muốn đổi sang 3 giờ chiều.",
        pronunciation_focus: ["原本 → yuánběn (vốn dĩ / nguyên gốc)", "九点 → jiǔ diǎn (9 giờ)", "下午三点 → xiàwǔ sān diǎn (3 giờ chiều)", "改成 → gǎi chéng (đổi thành)"]
      },
      {
        chinese: "请问改签需要多少手续费?",
        pinyin: "Qǐngwèn gǎiqiān xūyào duōshao shǒuxùfèi?",
        english: "How much is the change fee?",
        vi: "Cho em hỏi đổi chuyến mất bao nhiêu phí thủ tục?",
        pronunciation_focus: ["手续费 → shǒuxùfèi (phí thủ tục)", "多少 → duōshao (bao nhiêu)", "请问 → qǐngwèn", "改签 → gǎiqiān"]
      },
      {
        chinese: "差额我用微信支付。",
        pinyin: "Chā'é wǒ yòng wēixìn zhīfù.",
        english: "I'll pay the difference via WeChat.",
        vi: "Phần chênh lệch em trả qua WeChat.",
        pronunciation_focus: ["差额 → chā'é (phần chênh lệch)", "微信支付 → wēixìn zhīfù (WeChat Pay)", "用 → yòng (dùng)", "支付 → zhīfù"]
      },
      {
        chinese: "改签后的电子票发到我手机就行。",
        pinyin: "Gǎiqiān hòu de diànzǐ piào fā dào wǒ shǒujī jiùxíng.",
        english: "Send the e-ticket to my phone after the change.",
        vi: "Vé điện tử sau khi đổi gửi vào điện thoại em là được.",
        pronunciation_focus: ["电子票 → diànzǐ piào (vé điện tử)", "发 → fā (gửi)", "手机 → shǒujī (điện thoại)", "就行 → jiùxíng (là được)"]
      }
    ],
    vocab: [
      { chinese: "高铁", pinyin: "gāo tiě", english: "high-speed rail", vi: "tàu cao tốc" },
      { chinese: "改签", pinyin: "gǎi qiān", english: "to change ticket", vi: "đổi chuyến" },
      { chinese: "退票", pinyin: "tuì piào", english: "to refund ticket", vi: "trả vé / hoàn vé" },
      { chinese: "手续费", pinyin: "shǒu xù fèi", english: "service fee", vi: "phí thủ tục" },
      { chinese: "差额", pinyin: "chā é", english: "difference (in price)", vi: "phần chênh lệch" },
      { chinese: "出发时间", pinyin: "chū fā shí jiān", english: "departure time", vi: "giờ khởi hành" },
      { chinese: "车次", pinyin: "chē cì", english: "train number", vi: "số chuyến tàu" },
      { chinese: "二等座", pinyin: "èr děng zuò", english: "second-class seat", vi: "ghế hạng 2" },
      { chinese: "电子票", pinyin: "diàn zǐ piào", english: "e-ticket", vi: "vé điện tử" },
      { chinese: "12306", pinyin: "yāo èr sān líng liù", english: "12306 (China Railway app)", vi: "12306 (app đường sắt TQ)" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "您好, 我想改签车票。", pinyin: "Nín hǎo, wǒ xiǎng gǎiqiān chē piào.", english: "Hello, I'd like to change my ticket.", vi: "Chào anh, em muốn đổi vé." },
      { speaker: "工作人员", chinese: "把身份证或护照给我, 报一下原车次。", pinyin: "Bǎ shēnfènzhèng huò hùzhào gěi wǒ, bào yīxià yuán chēcì.", english: "Hand me your ID or passport, and tell me the original train number.", vi: "Đưa em CMND hoặc hộ chiếu, đọc số chuyến gốc đi." },
      { speaker: "阮", chinese: "G2, 明天上午九点上海虹桥到北京南。我想改成下午三点的。", pinyin: "G èr, míngtiān shàngwǔ jiǔ diǎn Shànghǎi Hóngqiáo dào Běijīng nán. Wǒ xiǎng gǎi chéng xiàwǔ sān diǎn de.", english: "G2, tomorrow 9 AM Shanghai Hongqiao to Beijing South. Want to change to 3 PM.", vi: "G2, mai 9 giờ sáng Thượng Hải Hồng Kiều đi Bắc Kinh Nam. Em muốn đổi sang chiều 3 giờ." },
      { speaker: "工作人员", chinese: "可以, 改签到G14, 三点零五。差额二十块, 不收手续费。", pinyin: "Kěyǐ, gǎiqiān dào G shísì, sān diǎn líng wǔ. Chā'é èrshí kuài, bù shōu shǒuxùfèi.", english: "Sure, change to G14, 3:05. 20 RMB difference, no service fee.", vi: "Được, đổi sang G14, 3 giờ 05. Chênh lệch 20 tệ, không thu phí thủ tục." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "您好, 我想改签车票。原本买的是G2, 明天上海到北京。", pinyin: "Nín hǎo, wǒ xiǎng gǎiqiān chē piào. Yuánběn mǎi de shì G èr, míngtiān Shànghǎi dào Běijīng.", english: "Hello, I'd like to change my ticket. Originally G2, Shanghai to Beijing tomorrow.", vi: "Chào anh, em muốn đổi vé. Vé gốc là G2, mai từ Thượng Hải đi Bắc Kinh." },
      { speaker: "工作人员", chinese: "好的, 把身份证或护照给我。", pinyin: "Hǎo de, bǎ shēnfènzhèng huò hùzhào gěi wǒ.", english: "Sure, give me your ID or passport.", vi: "Được, đưa em CMND hoặc hộ chiếu." },
      { speaker: "阮", chinese: "我是越南国籍, 用护照。", pinyin: "Wǒ shì Yuènán guójí, yòng hùzhào.", english: "I'm Vietnamese, using passport.", vi: "Em quốc tịch Việt Nam, dùng hộ chiếu." },
      { speaker: "工作人员", chinese: "可以。您想改到几点的车次?", pinyin: "Kěyǐ. Nín xiǎng gǎi dào jǐ diǎn de chēcì?", english: "Okay. What time train do you want to change to?", vi: "Được. Anh muốn đổi sang chuyến mấy giờ?" },
      { speaker: "阮", chinese: "下午三点左右, 因为上午有会议。", pinyin: "Xiàwǔ sān diǎn zuǒyòu, yīnwèi shàngwǔ yǒu huìyì.", english: "Around 3 PM, because I have a meeting in the morning.", vi: "Khoảng 3 giờ chiều, vì sáng em có cuộc họp." },
      { speaker: "工作人员", chinese: "我查一下。下午三点零五有G14, 还有座位。三点二十有G18。", pinyin: "Wǒ chá yīxià. Xiàwǔ sān diǎn líng wǔ yǒu G shísì, hái yǒu zuòwèi. Sān diǎn èrshí yǒu G shíbā.", english: "Let me check. 3:05 PM has G14, seats available. 3:20 has G18.", vi: "Em tra cứu. 3 giờ 05 có G14, còn ghế. 3 giờ 20 có G18." },
      { speaker: "阮", chinese: "G14好。还是二等座吗?", pinyin: "G shísì hǎo. Háishi èrděng zuò ma?", english: "G14 is good. Still second-class seat?", vi: "G14 được. Vẫn là ghế hạng 2 chứ?" },
      { speaker: "工作人员", chinese: "二等座G14比G2贵二十块, 因为是周五高峰。改签手续费按规定收车票价的5%。", pinyin: "Èrděng zuò G shísì bǐ G èr guì èrshí kuài, yīnwèi shì zhōu wǔ gāofēng. Gǎiqiān shǒuxùfèi àn guīdìng shōu chēpiào jià de bǎi fēn zhī wǔ.", english: "G14 second-class is 20 RMB more than G2 because it's Friday peak. Change fee is 5% of ticket price by regulation.", vi: "Ghế hạng 2 G14 đắt hơn G2 20 tệ vì là cao điểm thứ Sáu. Phí đổi theo quy định 5% giá vé." },
      { speaker: "阮", chinese: "请问总共多少钱? 我的G2车票是553块。", pinyin: "Qǐngwèn zǒnggòng duōshao qián? Wǒ de G èr chēpiào shì wǔbǎi wǔshí sān kuài.", english: "How much total? My G2 was 553 RMB.", vi: "Cho em hỏi tổng cộng bao nhiêu? Vé G2 của em 553 tệ." },
      { speaker: "工作人员", chinese: "差额20块加手续费27块6, 一共47块6。您看可以吗?", pinyin: "Chā'é èrshí kuài jiā shǒuxùfèi èrshí qī kuài liù, yīgòng sìshí qī kuài liù. Nín kàn kěyǐ ma?", english: "20 difference plus 27.6 service fee, total 47.6. Acceptable?", vi: "Chênh lệch 20 tệ cộng phí 27.6 tệ, tổng 47.6 tệ. Anh thấy được không?" },
      { speaker: "阮", chinese: "等等, 手续费是不是有点高? 我看12306 app上显示开车前24小时之前改签免手续费。", pinyin: "Děngdeng, shǒuxùfèi shì bù shì yǒudiǎn gāo? Wǒ kàn 12306 app shàng xiǎnshì kāichē qián èrshí sì xiǎoshí zhīqián gǎiqiān miǎn shǒuxùfèi.", english: "Wait, isn't the fee a bit high? I saw on 12306 app that changes more than 24 hours before departure are fee-free.", vi: "Khoan, phí có hơi cao không? Em xem app 12306 ghi đổi trước 24 giờ là miễn phí thủ tục." },
      { speaker: "工作人员", chinese: "您说得对, 让我重新查一下。... 哦, 您是对的, 现在还有27个小时, 可以免手续费。只收差额20块。", pinyin: "Nín shuō de duì, ràng wǒ chóngxīn chá yīxià. ... Ò, nín shì duì de, xiànzài hái yǒu èrshí qī gè xiǎoshí, kěyǐ miǎn shǒuxùfèi. Zhǐ shōu chā'é èrshí kuài.", english: "You're right, let me recheck. ... Yes, you're correct — still 27 hours away, no service fee. Only 20 RMB difference.", vi: "Anh nói đúng, để em xem lại. ... À, anh đúng rồi, còn 27 giờ nữa, được miễn phí thủ tục. Chỉ thu 20 tệ chênh lệch." },
      { speaker: "阮", chinese: "好的, 谢谢您的帮助。微信支付吗?", pinyin: "Hǎo de, xièxie nín de bāngzhù. Wēixìn zhīfù ma?", english: "Great, thank you for your help. WeChat Pay?", vi: "Vâng, cảm ơn anh đã giúp. Trả qua WeChat?" },
      { speaker: "工作人员", chinese: "可以。扫这个码就行。", pinyin: "Kěyǐ. Sǎo zhège mǎ jiùxíng.", english: "Yes, scan this QR.", vi: "Được. Quét mã này là xong." },
      { speaker: "阮", chinese: "扫好了, 谢谢!", pinyin: "Sǎo hǎo le, xièxie!", english: "Scanned, thanks!", vi: "Quét rồi, cảm ơn!" },
      { speaker: "工作人员", chinese: "新电子票发到您手机上了。明天G14, 下午三点零五, 七号车厢三B座。一路顺风。", pinyin: "Xīn diànzǐ piào fā dào nín shǒujī shàng le. Míngtiān G shísì, xiàwǔ sān diǎn líng wǔ, qī hào chēxiāng sān B zuò. Yī lù shùnfēng.", english: "New e-ticket sent to your phone. Tomorrow G14, 3:05 PM, car 7, seat 3B. Safe travels.", vi: "Vé điện tử mới đã gửi vào điện thoại. Mai G14, 3 giờ 05, toa 7, ghế 3B. Chúc đi đường thuận buồm." }
    ],
    roleplay_prompts: [
      "Bạn cần đổi vé G42 Quảng Châu - Thượng Hải từ thứ Năm sang thứ Sáu. Quầy nói phải trả phí 50% vì còn 20 giờ. Hãy hỏi rõ + đề xuất hủy vé cũ + mua mới (có thể rẻ hơn không?). Dùng cụm '退票重新买可以吗?'",
      "Đổi vé hạng 1 (一等座) sang hạng 2 (二等座) để rẻ hơn. Hãy hỏi quầy có hoàn lại tiền chênh lệch không. Quầy có thể nói 'không, chỉ trừ vào vé mới' — chấp nhận và hỏi rõ tổng số tiền cuối.",
      "Quầy đề nghị đổi sang chuyến tàu thường (普速) thay vì cao tốc (高铁) để rẻ hơn 200 tệ nhưng mất 8 giờ thay vì 4 giờ. Hãy cân nhắc: thời gian vs tiền — quyết định và giải thích lựa chọn của bạn."
    ],
    register_notes: "Đổi vé tàu cao tốc Trung Quốc tại quầy là môi trường formal nhanh — cán bộ bận, khách xếp hàng dài, nói nhanh và súc tích. Dùng 您 với cán bộ, ngắn gọn.\n\nCác cụm chuẩn:\n- '我想改签车票' (em muốn đổi vé)\n- '原车次是X, 改成Y' (chuyến gốc là X, đổi sang Y)\n- '请问手续费是多少?' (xin hỏi phí thủ tục bao nhiêu)\n- '差额我用微信支付' (chênh lệch em trả WeChat)\n- '电子票发到我手机' (vé điện tử gửi vào điện thoại)\n\nKhi tranh chấp phí (như trong dialogue): KHÔNG cãi nhau. Dùng cụm '请问...' (xin hỏi) và viện dẫn quy định rõ ràng. Quy định 12306: trên 24 giờ trước khởi hành = miễn phí; 0-24 giờ = 5% giá vé; sau khởi hành 30 phút = không đổi được, chỉ hoàn 1 phần.\n\nKhi cán bộ làm sai (tính phí khi không đáng): nói '让我看一下12306 app' (để em xem trên app) — chứng minh bằng quy định in công khai. Cán bộ thường sẽ nhận lỗi và sửa.\n\nTránh: (a) Tranh cãi cảm xúc — cán bộ có quyền từ chối phục vụ; (b) Yêu cầu 'nói chuyện với sếp' — chỉ làm cho dài thêm; (c) Tự ý xếp hàng đầu — bị nhân viên từ chối; (d) Đe dọa khiếu nại — không hữu ích, có hệ thống khiếu nại chính thức nếu thực sự sai.",
    idiom_glosses: [
      {
        idiom: "一分一毫",
        literal: "một phân một hào (yī fēn yī háo)",
        meaning: "Từng đồng từng xu — chính xác đến từng đơn vị nhỏ. Dùng khi cẩn thận tính tiền, không bỏ qua chi tiết phí. 'Em muốn rõ ràng từng đồng từng xu, đừng bị tính nhầm.'",
        example: "请把费用算清楚, 一分一毫都要明白。"
      },
      {
        idiom: "斤斤计较",
        literal: "tính đếm từng cân (jīn jīn jì jiào)",
        meaning: "So đo tính toán quá kỹ — thường mang ý hơi tiêu cực. Tránh tự nhận cụm này: 'em không 斤斤计较, chỉ muốn hiểu rõ phí.' Đối phương dùng cụm này về bạn = họ đang phòng thủ.",
        example: "我不是斤斤计较, 只是想搞清楚费用结构。"
      },
      {
        idiom: "明明白白",
        literal: "rõ ràng minh bạch (míng míng bái bái)",
        meaning: "Rõ ràng minh bạch — yêu cầu thông tin hoàn toàn rõ ràng. 'Em muốn 明明白白biết phí thủ tục bao nhiêu.' Cụm chuẩn khi yêu cầu giải thích kỹ.",
        example: "我希望您把规定明明白白地告诉我。"
      },
      {
        idiom: "公事公办",
        literal: "việc công làm theo công (gōng shì gōng bàn)",
        meaning: "Việc công xử lý theo quy định công — không thiên vị, không du di. Cán bộ dùng cụm này để giải thích vì sao họ tuân thủ quy định: 'em xin lỗi, nhưng 公事公办, anh phải trả phí'. Tôn trọng — đừng đối đầu.",
        example: "不好意思, 公事公办, 我必须按规定收费。"
      }
    ],
    cultural_notes_vi: "Hệ thống đường sắt Trung Quốc (中国铁路 / 12306) là một trong những hệ thống tàu cao tốc lớn nhất và hiệu quả nhất thế giới. Năm điều người Việt cần biết: (1) APP 12306 là chính thức và miễn phí — tải, đăng ký bằng hộ chiếu (KHÔNG cần CMND Trung Quốc nếu là khách nước ngoài). Tất cả thao tác đặt vé/đổi vé/hoàn vé đều có thể qua app, không cần ra quầy. App có tiếng Anh nhưng giới hạn — học cụm tiếng Trung sẽ giúp nhiều. (2) QUY ĐỊNH ĐỔI VÉ (改签 — gǎiqiān): trên 24 giờ trước khởi hành = miễn phí thủ tục; 8-24 giờ = 5% giá vé; <8 giờ và trước khởi hành = 10%; sau khởi hành = không đổi được. Nếu bị cán bộ tính phí sai (như trong dialogue), kiểm tra app và viện dẫn — họ sẽ sửa. (3) HẠNG GHẾ: 商务座 (thương vụ — đắt nhất, ghế ngả 180°), 一等座 (hạng 1, 4 ghế/hàng), 二等座 (hạng 2, 5 ghế/hàng — phổ biến nhất, đủ thoải mái), 无座 (đứng — chỉ cho chuyến ngắn <2 giờ). Du lịch business: hạng 2 đủ; cao cấp đi hạng 1. (4) GA TÀU LỚN: Bắc Kinh có Bắc Kinh Nam (cao tốc đi Thượng Hải), Bắc Kinh Đông (đi Đông Bắc), Bắc Kinh Tây (đi Tây Nam). Thượng Hải có Hồng Kiều (cao tốc, gần sân bay nội địa), Thượng Hải Nam (truyền thống). Quảng Châu có Quảng Châu Nam (cao tốc — KHÔNG nhầm với 'Quảng Châu' truyền thống). Đến NHẦM ga = lỡ tàu. (5) CHECK-IN: vé điện tử dùng hộ chiếu để check-in tại máy tự động. Nếu máy không nhận hộ chiếu nước ngoài, đến quầy '人工窗口' (quầy nhân viên). Đến SỚM 30 phút (an ninh sân bay-style), 1 giờ nếu mua vé hạng 'thương vụ' tại VIP lounge.\n\nVề chậm/hủy chuyến: tàu cao tốc Trung Quốc có tỉ lệ đúng giờ ~95%. Chậm <30 phút = không bồi thường. Chậm >30 phút hoặc hủy = hoàn tiền 100% qua app. KHÔNG cần đến quầy.\n\nVề thanh toán: Alipay/WeChat Pay là chính. Tiền mặt được chấp nhận tại quầy nhưng không phải máy tự động. Visa/Mastercard quốc tế ĐÔI KHI nhận tại quầy (cán bộ phải kiểm tra) — KHÔNG đáng tin. Bài học vàng: kết nối thẻ ngân hàng quốc tế (HSBC, Citibank, Stripe) với Alipay/WeChat trước khi đến Trung Quốc.",
    tip_advice_vi: "(1) ĐẶT VÉ TỪ APP 12306, không qua đại lý du lịch (giá +20-50%). App có giao diện tiếng Anh và tiếng Trung — chuyển đổi qua menu. Đặt 7-15 ngày trước cao điểm (Tết, Tuần Vàng tháng 10). Vé thương vụ luôn còn, hạng 1/2 hết nhanh. (2) HỘ CHIẾU = ID số 1: nhập số hộ chiếu khi đăng ký 12306. Vé in tên + số hộ chiếu. Đến ga, dùng hộ chiếu quét tại cổng — KHÔNG cần in vé giấy. Mất hộ chiếu = không đi tàu được. (3) ĐỔI/HOÀN VÉ qua APP nhanh hơn quầy: vào 'My Orders' → chọn vé → 'Change'/'Refund'. Hệ thống tự động tính phí theo thời gian. Tiền hoàn lại 7-14 ngày qua phương thức thanh toán cũ. (4) TÌM CHUYẾN TÀU: tìm theo 'Departure city' và 'Arrival city' — ví dụ 'Beijing' → Bắc Kinh Nam (BJN), KHÔNG phải Bắc Kinh chung chung. App hiện tất cả ga + giá. Chọn chuyến nhanh nhất (G ký hiệu = cao tốc, D = nhanh, T/K/Z = chậm). (5) NẾU APP KHÔNG VÀO ĐƯỢC khi ở Trung Quốc đại lục: VPN có thể giúp, hoặc dùng số ĐT Trung Quốc (cần ID Trung Quốc đăng ký SIM). Backup: đến quầy 12306 tại các ga lớn — luôn mở 24/7. Quầy 'foreign passport' thường ngắn hàng. (6) CHẬM/HỦY: kiểm tra app 30 phút trước giờ khởi hành. Nếu chậm >30 phút, có quyền hoàn vé miễn phí + đổi sang chuyến khác. Bồi thường thực tế chỉ ~10% giá vé qua coupon — không nhiều. (7) TRÊN TÀU: nước nóng miễn phí, đồ ăn nhẹ ~30-50 tệ/hộp (đắt + bình thường), wifi không có hoặc rất chậm. Mang theo: tai nghe, sạc dự phòng, snack từ siêu thị. Toilet: phương Tây kiểu (西式) ở toa nào cũng có 1, kiểu Trung Quốc (蹲坑) phổ biến hơn — chuẩn bị tâm lý.",
    exercises: [
      { type: "fill-blank", question: "我想改签明天的高铁, 请问 ___ 是多少?", answer: "手续费" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung tàu cao tốc với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "高铁", pinyin: "gāo tiě", english: "tàu cao tốc" },
          { chinese: "改签", pinyin: "gǎi qiān", english: "đổi chuyến" },
          { chinese: "二等座", pinyin: "èr děng zuò", english: "ghế hạng 2" },
          { chinese: "电子票", pinyin: "diàn zǐ piào", english: "vé điện tử" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em muốn đổi chuyến tàu cao tốc sang chiều, phí thủ tục bao nhiêu? Phần chênh lệch em trả qua WeChat.",
        chinese: "我想把高铁改签到下午, 手续费多少? 差额我用微信支付。",
        pinyin: "Wǒ xiǎng bǎ gāo tiě gǎi qiān dào xià wǔ, shǒu xù fèi duō shao? Chā é wǒ yòng wēi xìn zhī fù."
      }
    ]
  },
  {
    id: 75,
    level: "B2",
    category: "travel_mobility",
    title: "在中国医院看急诊",
    pinyin: "zài zhōng guó yī yuàn kàn jí zhěn",
    topic: "Hospital emergency visit — symptoms, insurance, prescription",
    title_vi: "Khám cấp cứu tại bệnh viện Trung Quốc",
    title_en: "Emergency hospital visit in China",
    sentences: [
      {
        chinese: "您好, 我从昨天晚上开始肚子很疼, 还发烧。",
        pinyin: "Nín hǎo, wǒ cóng zuótiān wǎnshàng kāishǐ dùzi hěn téng, hái fāshāo.",
        english: "Hello, since last night my stomach hurts a lot and I have a fever.",
        vi: "Em chào bác sĩ, từ tối qua em đau bụng nhiều, lại bị sốt.",
        pronunciation_focus: ["肚子 → dùzi (bụng)", "疼 → téng (đau)", "发烧 → fāshāo (sốt)", "昨天晚上 → zuótiān wǎnshàng"]
      },
      {
        chinese: "我大概吃错了什么, 一直拉肚子。",
        pinyin: "Wǒ dàgài chī cuò le shénme, yīzhí lā dùzi.",
        english: "I probably ate something wrong — I keep having diarrhea.",
        vi: "Chắc em ăn nhầm gì đó, em bị tiêu chảy liên tục.",
        pronunciation_focus: ["吃错 → chī cuò (ăn nhầm)", "拉肚子 → lā dùzi (tiêu chảy)", "一直 → yīzhí (liên tục)", "大概 → dàgài (chắc)"]
      },
      {
        chinese: "我有越南的旅游保险, 可以报销吗?",
        pinyin: "Wǒ yǒu Yuènán de lǚyóu bǎoxiǎn, kěyǐ bàoxiāo ma?",
        english: "I have Vietnamese travel insurance — can I claim reimbursement?",
        vi: "Em có bảo hiểm du lịch Việt Nam, có thể yêu cầu hoàn tiền không?",
        pronunciation_focus: ["旅游保险 → lǚyóu bǎoxiǎn (bảo hiểm du lịch)", "报销 → bàoxiāo (hoàn tiền / báo cáo chi phí)", "越南 → Yuènán", "可以 → kěyǐ"]
      },
      {
        chinese: "请问医生, 我需要吃什么药?",
        pinyin: "Qǐngwèn yīshēng, wǒ xūyào chī shénme yào?",
        english: "Doctor, what medicine do I need to take?",
        vi: "Cho em hỏi bác sĩ, em cần uống thuốc gì?",
        pronunciation_focus: ["医生 → yīshēng (bác sĩ)", "吃药 → chī yào (uống thuốc — TQ dùng 吃, không phải 喝)", "需要 → xūyào", "请问 → qǐngwèn"]
      },
      {
        chinese: "麻烦您把发票和处方都给我, 我要交保险公司。",
        pinyin: "Máfan nín bǎ fāpiào hé chǔfāng dōu gěi wǒ, wǒ yào jiāo bǎoxiǎn gōngsī.",
        english: "Please give me the invoice and prescription — I need to submit to my insurance.",
        vi: "Phiền bác sĩ đưa em hóa đơn và đơn thuốc, em phải nộp cho công ty bảo hiểm.",
        pronunciation_focus: ["发票 → fāpiào (hóa đơn — quan trọng cho bảo hiểm)", "处方 → chǔfāng (đơn thuốc)", "保险公司 → bǎoxiǎn gōngsī (công ty bảo hiểm)", "麻烦您 → máfan nín"]
      }
    ],
    vocab: [
      { chinese: "急诊", pinyin: "jí zhěn", english: "emergency room", vi: "phòng cấp cứu" },
      { chinese: "挂号", pinyin: "guà hào", english: "register (at hospital)", vi: "đăng ký khám" },
      { chinese: "症状", pinyin: "zhèng zhuàng", english: "symptom", vi: "triệu chứng" },
      { chinese: "发烧", pinyin: "fā shāo", english: "to have a fever", vi: "sốt" },
      { chinese: "拉肚子", pinyin: "lā dù zi", english: "diarrhea", vi: "tiêu chảy" },
      { chinese: "处方", pinyin: "chǔ fāng", english: "prescription", vi: "đơn thuốc" },
      { chinese: "发票", pinyin: "fā piào", english: "invoice / receipt", vi: "hóa đơn" },
      { chinese: "旅游保险", pinyin: "lǚ yóu bǎo xiǎn", english: "travel insurance", vi: "bảo hiểm du lịch" },
      { chinese: "报销", pinyin: "bào xiāo", english: "reimburse / claim", vi: "hoàn tiền / báo phí" },
      { chinese: "化验单", pinyin: "huà yàn dān", english: "lab test report", vi: "kết quả xét nghiệm" }
    ],
    dialogue: [
      { speaker: "护士", chinese: "您好, 哪里不舒服?", pinyin: "Nín hǎo, nǎlǐ bù shūfu?", english: "Hello, what's wrong?", vi: "Chào anh, anh thấy đau ở đâu?" },
      { speaker: "阮", chinese: "肚子疼, 还发烧。", pinyin: "Dùzi téng, hái fāshāo.", english: "Stomach hurts, also have a fever.", vi: "Đau bụng, lại sốt nữa." },
      { speaker: "护士", chinese: "请到二楼急诊挂号, 把护照给我。", pinyin: "Qǐng dào èr lóu jí zhěn guà hào, bǎ hùzhào gěi wǒ.", english: "Go to the second floor for ER registration, give me your passport.", vi: "Lên tầng 2 đăng ký cấp cứu, đưa em hộ chiếu." },
      { speaker: "阮", chinese: "好的, 给您。", pinyin: "Hǎo de, gěi nín.", english: "Sure, here.", vi: "Vâng, đưa anh." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "您好, 我是越南游客, 肚子很疼, 想看急诊。", pinyin: "Nín hǎo, wǒ shì Yuènán yóukè, dùzi hěn téng, xiǎng kàn jí zhěn.", english: "Hello, I'm a Vietnamese tourist, my stomach hurts a lot, want to see ER.", vi: "Chào chị, em là du khách Việt Nam, đau bụng nhiều, muốn khám cấp cứu." },
      { speaker: "护士", chinese: "请把护照给我, 先挂号。挂号费是15块。", pinyin: "Qǐng bǎ hùzhào gěi wǒ, xiān guàhào. Guàhào fèi shì shíwǔ kuài.", english: "Give me your passport, register first. Registration fee is 15 RMB.", vi: "Đưa em hộ chiếu, đăng ký trước. Phí đăng ký 15 tệ." },
      { speaker: "阮", chinese: "微信可以付吗?", pinyin: "Wēixìn kěyǐ fù ma?", english: "Can I pay with WeChat?", vi: "Trả qua WeChat được không?" },
      { speaker: "护士", chinese: "可以, 扫这个码。挂号好了, 您去三号诊室找王医生。", pinyin: "Kěyǐ, sǎo zhège mǎ. Guàhào hǎo le, nín qù sān hào zhěnshì zhǎo Wáng yīshēng.", english: "Yes, scan this code. Registered — go to consultation room 3, see Dr. Wang.", vi: "Được, quét mã này. Đã đăng ký, anh sang phòng khám số 3, gặp bác sĩ Vương." },
      { speaker: "王医生", chinese: "您好, 哪里不舒服? 从什么时候开始的?", pinyin: "Nín hǎo, nǎlǐ bù shūfu? Cóng shénme shíhou kāishǐ de?", english: "Hello, what's wrong? When did it start?", vi: "Chào anh, đau ở đâu? Bắt đầu từ khi nào?" },
      { speaker: "阮", chinese: "肚子疼, 从昨天晚上开始。还发烧, 一直拉肚子。我大概吃错了什么。", pinyin: "Dùzi téng, cóng zuótiān wǎnshàng kāishǐ. Hái fāshāo, yīzhí lā dùzi. Wǒ dàgài chī cuò le shénme.", english: "Stomach hurts since last night. Also fever, constant diarrhea. I probably ate something wrong.", vi: "Đau bụng từ tối qua. Lại sốt, tiêu chảy liên tục. Chắc em ăn nhầm gì đó." },
      { speaker: "王医生", chinese: "昨天晚上吃了什么?", pinyin: "Zuótiān wǎnshàng chī le shénme?", english: "What did you eat last night?", vi: "Tối qua anh ăn gì?" },
      { speaker: "阮", chinese: "在夜市吃了海鲜串和啤酒。", pinyin: "Zài yèshì chī le hǎixiān chuàn hé píjiǔ.", english: "Seafood skewers and beer at the night market.", vi: "Em ăn xiên hải sản và uống bia ở chợ đêm." },
      { speaker: "王医生", chinese: "可能是急性肠胃炎。我先量体温, 您张嘴, 让我看看喉咙。", pinyin: "Kěnéng shì jí xìng cháng wèi yán. Wǒ xiān liáng tǐwēn, nín zhāngzuǐ, ràng wǒ kànkan hóulóng.", english: "Likely acute gastroenteritis. Let me take your temperature first, open mouth, let me check throat.", vi: "Có thể là viêm dạ dày ruột cấp. Em đo thân nhiệt trước, anh há miệng, em xem cổ họng." },
      { speaker: "阮", chinese: "好的。", pinyin: "Hǎo de.", english: "Okay.", vi: "Vâng." },
      { speaker: "王医生", chinese: "体温三十八度三, 喉咙稍微发红。我开点药, 您吃两天, 多喝水。如果两天后没好, 必须做血常规和大便检查。", pinyin: "Tǐwēn sānshí bā dù sān, hóulóng shāowēi fā hóng. Wǒ kāi diǎn yào, nín chī liǎng tiān, duō hē shuǐ. Rúguǒ liǎng tiān hòu méi hǎo, bìxū zuò xuè chángguī hé dàbiàn jiǎnchá.", english: "Temperature 38.3, throat slightly red. I'll prescribe medicine, take for two days, drink lots of water. If not better in two days, need blood test and stool test.", vi: "Thân nhiệt 38.3, cổ họng hơi đỏ. Bác sĩ kê thuốc, anh uống 2 ngày, uống nhiều nước. Nếu 2 ngày không đỡ, phải xét nghiệm máu và phân." },
      { speaker: "阮", chinese: "好的。请问医生, 我有越南旅游保险, 可以报销吗?", pinyin: "Hǎo de. Qǐngwèn yīshēng, wǒ yǒu Yuènán lǚyóu bǎoxiǎn, kěyǐ bàoxiāo ma?", english: "Okay. Doctor, I have Vietnamese travel insurance — can I claim?", vi: "Vâng. Cho em hỏi bác sĩ, em có bảo hiểm du lịch Việt Nam, có thể được hoàn không?" },
      { speaker: "王医生", chinese: "您先付费, 我给您开正规发票和处方单, 还有诊断书。回越南交保险公司就能报销。", pinyin: "Nín xiān fùfèi, wǒ gěi nín kāi zhèngguī fāpiào hé chǔfāng dān, hái yǒu zhěnduàn shū. Huí Yuènán jiāo bǎoxiǎn gōngsī jiù néng bàoxiāo.", english: "You pay first, I'll give you proper invoice, prescription, and diagnosis letter. Submit to insurance back in Vietnam to claim.", vi: "Anh trả phí trước, em sẽ kê hóa đơn chính quy, đơn thuốc, và giấy chẩn đoán. Về Việt Nam nộp công ty bảo hiểm là hoàn được." },
      { speaker: "阮", chinese: "总共多少钱?", pinyin: "Zǒnggòng duōshao qián?", english: "How much total?", vi: "Tổng cộng bao nhiêu?" },
      { speaker: "王医生", chinese: "诊费80块, 药费150块, 一共230块。去一楼药房取药, 收据保留好。", pinyin: "Zhěnfèi bāshí kuài, yàofèi yībǎi wǔshí kuài, yīgòng èrbǎi sānshí kuài. Qù yī lóu yàofáng qǔ yào, shōujù bǎoliú hǎo.", english: "Consultation 80, medicine 150, total 230 RMB. Pick up medicine at first-floor pharmacy, keep the receipt.", vi: "Phí khám 80 tệ, thuốc 150 tệ, tổng 230 tệ. Lấy thuốc ở phòng dược tầng 1, giữ kỹ biên nhận." },
      { speaker: "阮", chinese: "谢谢医生。", pinyin: "Xièxie yīshēng.", english: "Thank you doctor.", vi: "Cảm ơn bác sĩ." },
      { speaker: "王医生", chinese: "好好休息, 注意饮食。如果情况严重, 立刻回来。", pinyin: "Hǎohǎo xiūxi, zhùyì yǐnshí. Rúguǒ qíngkuàng yánzhòng, lìkè huílái.", english: "Rest well, watch your diet. If it gets serious, come back immediately.", vi: "Nghỉ ngơi cho tốt, chú ý ăn uống. Nếu nặng hơn, quay lại ngay." }
    ],
    roleplay_prompts: [
      "Bạn bị đau đầu kèm sốt nhẹ 2 ngày, nghi cảm cúm. Hãy đến khám: mô tả triệu chứng (sốt, đau đầu, mệt), bác sĩ hỏi về tiền sử (có dị ứng thuốc không, có đang uống thuốc gì), bạn yêu cầu hóa đơn để báo bảo hiểm. Dùng cụm '我有过敏史' hoặc '没有过敏史' (có/không có dị ứng).",
      "Bạn bị bong gân chân khi đi bộ. Đến phòng cấp cứu, mô tả vị trí + mức độ đau. Bác sĩ chỉ định chụp X-quang. Hãy hỏi giá X-quang trước khi đồng ý + xin hóa đơn riêng cho mỗi mục (khám, X-quang, thuốc, băng) để bảo hiểm dễ xử lý.",
      "Bạn cần thuốc kê đơn (kháng sinh) nhưng không nhớ tên thuốc bằng tiếng Trung. Hãy mô tả công dụng cho dược sĩ ('thuốc cho viêm họng', '消炎药' = thuốc kháng viêm). Hỏi về cách uống + tác dụng phụ + có thể uống cùng thuốc giảm đau không."
    ],
    register_notes: "Bệnh viện Trung Quốc dùng register chuyên môn nhanh — bác sĩ bận, nói nhanh, không nhiều giải thích. Bạn dùng 您 với bác sĩ và nurse, ngắn gọn rõ ràng.\n\nCác cụm chuẩn mô tả triệu chứng:\n- '我X疼' (em đau X) — dùng '疼' (téng) chứ KHÔNG '痛' (tòng) trong khẩu ngữ. 头疼 (đau đầu), 肚子疼 (đau bụng), 嗓子疼 (đau họng)\n- '从X时候开始' (từ X bắt đầu) — '昨天晚上', '今天早上', '三天前'\n- '一直X' (liên tục X) — 一直拉肚子 (tiêu chảy liên tục), 一直发烧 (sốt liên tục)\n- '我大概X' (em chắc là X) — đoán nguyên nhân nhẹ nhàng\n- '我有过敏史' / '我对X过敏' (em dị ứng X)\n\nCác cụm formal cho hóa đơn/bảo hiểm:\n- '麻烦您把发票给我' (phiền bác sĩ đưa em hóa đơn)\n- '我需要诊断书报保险' (em cần giấy chẩn đoán để báo bảo hiểm)\n- '请开正规发票' (xin kê hóa đơn chính quy — chứ không phải bill thông thường)\n\nQuy trình bệnh viện công Trung Quốc: 挂号 (đăng ký) → 候诊 (chờ khám) → 看医生 (gặp bác sĩ) → 付费 (thanh toán) → 取药 (lấy thuốc). Mỗi bước riêng quầy, có thể chờ 30-60 phút mỗi bước.\n\nTránh: (a) Tự dịch tên thuốc Việt Nam ('panadol' thì OK, '甲砜霉素' khó); (b) Đòi hỏi 'thuốc tốt nhất' — bác sĩ kê theo phác đồ, không phải theo đòi hỏi; (c) Quay phim/livestream trong bệnh viện — vi phạm quy định bảo mật.",
    idiom_glosses: [
      {
        idiom: "对症下药",
        literal: "đối chứng hạ thuốc (duì zhèng xià yào)",
        meaning: "Đúng bệnh kê thuốc — chẩn đoán đúng và điều trị đúng. Cụm khen bác sĩ giỏi: '王医生对症下药, 一吃就好.' Cũng dùng nghĩa rộng (giải pháp đúng cho vấn đề đúng).",
        example: "好医生会对症下药, 不会乱开药。"
      },
      {
        idiom: "病急乱投医",
        literal: "bệnh gấp loạn tìm thầy (bìng jí luàn tóu yī)",
        meaning: "Bệnh nặng tìm thầy bừa — quýnh quáng làm điều không suy nghĩ. Cụm cảnh báo: 'em đừng 病急乱投医, hãy đến bệnh viện công uy tín'. Tránh nói về mình — sẽ tự miêu tả là không sáng suốt.",
        example: "别病急乱投医, 找正规医院最重要。"
      },
      {
        idiom: "防患未然",
        literal: "phòng họa khi chưa xảy ra (fáng huàn wèi rán)",
        meaning: "Phòng bệnh hơn chữa bệnh — chuẩn bị trước rủi ro. Cụm dùng để giải thích vì sao bạn mua bảo hiểm du lịch trước khi đi: '我提前买了旅游保险, 防患未然'.",
        example: "出国前买保险, 防患未然。"
      },
      {
        idiom: "因病施治",
        literal: "theo bệnh chữa trị (yīn bìng shī zhì)",
        meaning: "Tùy bệnh mà chữa — điều trị cá nhân hóa. Cụm dùng khi bác sĩ giải thích phác đồ điều trị cho bạn: 'mình 因病施治, không phải kê đại'. Khi bạn nghe bác sĩ nói cụm này = họ đang cẩn thận, tin được.",
        example: "我们医院讲究因病施治。"
      }
    ],
    cultural_notes_vi: "Bệnh viện Trung Quốc đại lục có hệ thống ba cấp: 三甲医院 (sān jiǎ — top, đại học, đa khoa) > 二甲医院 (sān èr — tỉnh/thành phố) > 社区医院 (community clinic). Du khách nên đi 三甲 hoặc 二甲, không đi clinic nhỏ. Năm điều người Việt cần biết:\n\n(1) PHÒNG CẤP CỨU (急诊) mở 24/7. Đăng ký bằng hộ chiếu — KHÔNG cần CMND Trung Quốc. Phí đăng ký 10-30 tệ. Phí khám 50-200 tệ tùy bệnh viện. Phí thuốc/xét nghiệm tính riêng. Tổng cho ca thường 150-500 tệ.\n\n(2) THANH TOÁN: chấp nhận tiền mặt, WeChat Pay, Alipay. Visa quốc tế CHỈ ở bệnh viện quốc tế (国际医院 — đắt 3-5x). Bảo hiểm sức khỏe Trung Quốc của người dân = bạn không có. Bảo hiểm du lịch Việt Nam = TRẢ TRƯỚC tại bệnh viện, hoàn lại sau khi về Việt Nam.\n\n(3) GIẤY TỜ CẦN GIỮ cho bảo hiểm: (a) hóa đơn chính quy (正规发票 — có dấu đỏ); (b) đơn thuốc (处方); (c) giấy chẩn đoán (诊断书); (d) báo cáo xét nghiệm (化验单/检查报告). Yêu cầu BẢN GIẤY, không phải PDF — bảo hiểm Việt Nam có thể không nhận PDF.\n\n(4) THUỐC: chia hai loại — 西药 (thuốc Tây, kháng sinh, giảm đau, hạ sốt) và 中药 (thuốc bắc, viên/gói thảo dược). Du khách thường được kê thuốc Tây trừ khi yêu cầu. Bác sĩ Trung Quốc đôi khi kê CẢ HAI cùng lúc — đây là phong cách 'tích hợp', không phải lỗi. Nếu bạn không tin thuốc bắc, lịch sự nói '我只要西药就行' (em chỉ cần thuốc Tây là được).\n\n(5) BỆNH VIỆN QUỐC TẾ TẠI TQ (đại lục): Bắc Kinh — Beijing United Family (北京和睦家); Thượng Hải — Shanghai United Family (上海和睦家); Quảng Châu — Guangzhou United Family. Đắt 3-10x bệnh viện công, nhưng có bác sĩ nói tiếng Anh, không phải xếp hàng, môi trường giống quốc tế. Bảo hiểm du lịch cao cấp (Allianz, AXA) có thể chi trả trực tiếp ở đây không cần chờ. Bảo hiểm Việt Nam thường không.\n\nVề số khẩn cấp: 120 (救护车 — xe cứu thương). Cuộc gọi miễn phí. Tổng đài có người nói tiếng Anh ở thành phố lớn. Mô tả: tên bạn, vị trí (đường + tên cửa hàng/landmark), triệu chứng. Xe đến 10-30 phút tùy giao thông. Phí xe cứu thương 50-300 tệ tùy quãng đường, trả tại bệnh viện.\n\nVề bệnh truyền nhiễm/COVID-style: nếu bạn có triệu chứng hô hấp + sốt cao, một số bệnh viện sẽ đưa vào phòng riêng (发热门诊 — fātrè ménzhěn). Bình tĩnh hợp tác — quy trình tiêu chuẩn. KHÔNG bình luận chính trị về quy trình.",
    tip_advice_vi: "(1) MUA BẢO HIỂM DU LỊCH TRƯỚC khi đi — có loại 200,000-500,000 VND/tuần, chi trả ~50,000 USD chi phí y tế. Đọc kỹ điều khoản: tự xử lý/trả trước → hoàn lại (cash advance) hay cấp trực tiếp (direct billing). Direct billing đắt hơn nhưng tiện hơn ở Trung Quốc. (2) TẢI APP GOOGLE TRANSLATE OFFLINE tiếng Trung-tiếng Việt trước khi đi. Trong bệnh viện Trung Quốc, mạng có thể chậm + không VPN, app translation online không chạy. Mode offline tải xuống 100MB, dùng được cho từ vựng y tế cơ bản. (3) HỌC THUỘC 10 cụm cơ bản trước khi đi: 我X疼 (em đau X), 我发烧 (em sốt), 拉肚子 (tiêu chảy), 头晕 (chóng mặt), 想吐 (buồn nôn), 有过敏史 (có dị ứng), 麻烦您 (phiền anh/chị), 发票 (hóa đơn), 处方 (đơn thuốc), 诊断书 (giấy chẩn đoán). (4) KHI BỊ ỐM, ĐI BỆNH VIỆN SỚM, không chờ. Du khách thường chần chừ vì sợ tốn tiền — kết quả là bệnh nặng hơn = chi phí cao hơn 5-10x. (5) NẾU BỊ ỐM NGHIÊM TRỌNG (đau ngực, khó thở, chấn thương đầu): GỌI 120 NGAY, không bắt taxi. Xe cứu thương có thiết bị + đưa vào ER ưu tiên. (6) GIỮ ĐƠN THUỐC + HÓA ĐƠN trong túi nhựa riêng. Bệnh viện in giấy mỏng dễ rách/ướt. Chụp ảnh backup cloud ngay sau khi nhận. (7) KHI BÁC SĨ KÊ ĐƠN BẰNG TIẾNG TRUNG, dùng app dịch để hiểu tên thuốc + cách uống. Hỏi rõ: '一天吃几次?' (uống mấy lần/ngày), '饭前还是饭后?' (trước hay sau ăn), '需要吃几天?' (uống mấy ngày).",
    exercises: [
      { type: "fill-blank", question: "我从昨天晚上开始 ___ 疼, 还发烧。", answer: "肚子" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung y tế với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "急诊", pinyin: "jí zhěn", english: "phòng cấp cứu" },
          { chinese: "处方", pinyin: "chǔ fāng", english: "đơn thuốc" },
          { chinese: "发票", pinyin: "fā piào", english: "hóa đơn" },
          { chinese: "报销", pinyin: "bào xiāo", english: "hoàn tiền (bảo hiểm)" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em đau bụng từ tối qua, lại sốt và tiêu chảy. Em có bảo hiểm du lịch, xin bác sĩ hóa đơn và đơn thuốc.",
        chinese: "我从昨天晚上开始肚子疼, 还发烧拉肚子。我有旅游保险, 请医生开发票和处方。",
        pinyin: "Wǒ cóng zuó tiān wǎn shàng kāi shǐ dù zi téng, hái fā shāo lā dù zi. Wǒ yǒu lǚ yóu bǎo xiǎn, qǐng yī shēng kāi fā piào hé chǔ fāng."
      }
    ]
  },
  {
    id: 76,
    level: "B2",
    category: "travel_mobility",
    title: "酒店投诉 — 房间问题, 要求换房",
    pinyin: "jiǔ diàn tóu sù — fáng jiān wèn tí, yāo qiú huàn fáng",
    topic: "Hotel complaint — room defect, requesting room change",
    title_vi: "Khiếu nại khách sạn — phòng có vấn đề, yêu cầu đổi phòng",
    title_en: "Hotel complaint — room defect, requesting room change",
    sentences: [
      {
        chinese: "您好, 我想反映一下我房间的问题。",
        pinyin: "Nín hǎo, wǒ xiǎng fǎnyìng yīxià wǒ fángjiān de wèntí.",
        english: "Hello, I'd like to report a problem with my room.",
        vi: "Em chào anh/chị, em muốn phản ánh vấn đề phòng của em.",
        pronunciation_focus: ["反映 → fǎnyìng (phản ánh / báo cáo)", "房间 → fángjiān (phòng)", "问题 → wèntí (vấn đề)", "您好 → nín hǎo"]
      },
      {
        chinese: "我住的是805房, 空调一直不冷, 还有声音。",
        pinyin: "Wǒ zhù de shì bā líng wǔ fáng, kōngtiáo yīzhí bù lěng, hái yǒu shēngyīn.",
        english: "I'm in room 805 — the AC isn't cooling and makes noise.",
        vi: "Em ở phòng 805, điều hòa không lạnh, lại có tiếng kêu.",
        pronunciation_focus: ["805房 → bā líng wǔ fáng (số phòng đọc rời)", "空调 → kōngtiáo (điều hòa)", "不冷 → bù lěng (không lạnh)", "声音 → shēngyīn (tiếng kêu)"]
      },
      {
        chinese: "热水也时有时无, 洗澡很不方便。",
        pinyin: "Rèshuǐ yě shí yǒu shí wú, xǐzǎo hěn bù fāngbiàn.",
        english: "The hot water also comes and goes — very inconvenient for showering.",
        vi: "Nước nóng cũng lúc có lúc không, tắm rất bất tiện.",
        pronunciation_focus: ["热水 → rèshuǐ (nước nóng)", "时有时无 → shí yǒu shí wú (lúc có lúc không)", "洗澡 → xǐzǎo (tắm)", "不方便 → bù fāngbiàn"]
      },
      {
        chinese: "请问能不能给我换一个房间?",
        pinyin: "Qǐngwèn néng bù néng gěi wǒ huàn yī gè fángjiān?",
        english: "Can you change me to another room?",
        vi: "Cho em hỏi có thể đổi cho em phòng khác không?",
        pronunciation_focus: ["换房间 → huàn fángjiān (đổi phòng)", "能不能 → néng bù néng (có thể không)", "请问 → qǐngwèn", "给我 → gěi wǒ"]
      },
      {
        chinese: "如果不能换, 是否可以退一晚的房费?",
        pinyin: "Rúguǒ bù néng huàn, shìfǒu kěyǐ tuì yī wǎn de fángfèi?",
        english: "If you can't change, can you refund one night's fee?",
        vi: "Nếu không đổi được, có thể hoàn em một đêm tiền phòng không?",
        pronunciation_focus: ["退房费 → tuì fángfèi (hoàn tiền phòng)", "一晚 → yī wǎn (một đêm)", "是否 → shìfǒu (có thể)", "如果 → rúguǒ"]
      }
    ],
    vocab: [
      { chinese: "投诉", pinyin: "tóu sù", english: "to complain (formal)", vi: "khiếu nại" },
      { chinese: "反映", pinyin: "fǎn yìng", english: "to report (issue)", vi: "phản ánh" },
      { chinese: "前台", pinyin: "qián tái", english: "front desk", vi: "lễ tân" },
      { chinese: "房间", pinyin: "fáng jiān", english: "room", vi: "phòng" },
      { chinese: "空调", pinyin: "kōng tiáo", english: "air conditioning", vi: "điều hòa" },
      { chinese: "热水", pinyin: "rè shuǐ", english: "hot water", vi: "nước nóng" },
      { chinese: "换房", pinyin: "huàn fáng", english: "change room", vi: "đổi phòng" },
      { chinese: "升级", pinyin: "shēng jí", english: "to upgrade", vi: "nâng hạng" },
      { chinese: "房费", pinyin: "fáng fèi", english: "room fee", vi: "tiền phòng" },
      { chinese: "补偿", pinyin: "bǔ cháng", english: "compensation", vi: "đền bù" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "您好, 我想反映805房的问题。", pinyin: "Nín hǎo, wǒ xiǎng fǎnyìng bā líng wǔ fáng de wèntí.", english: "Hello, I want to report an issue with room 805.", vi: "Chào chị, em muốn phản ánh vấn đề phòng 805." },
      { speaker: "前台", chinese: "请说, 是什么问题?", pinyin: "Qǐng shuō, shì shénme wèntí?", english: "Go ahead, what's the problem?", vi: "Mời anh nói, vấn đề gì?" },
      { speaker: "阮", chinese: "空调不冷, 还有热水时有时无。", pinyin: "Kōngtiáo bù lěng, hái yǒu rèshuǐ shí yǒu shí wú.", english: "AC doesn't cool, hot water also intermittent.", vi: "Điều hòa không lạnh, nước nóng lúc có lúc không." },
      { speaker: "前台", chinese: "实在抱歉, 我马上派工程部来检查, 或者给您换一间。", pinyin: "Shízài bàoqiàn, wǒ mǎshàng pài gōngchéng bù lái jiǎnchá, huòzhě gěi nín huàn yī jiān.", english: "Sincerely sorry, I'll send maintenance immediately, or change your room.", vi: "Thực sự xin lỗi, em sẽ phái phòng kỹ thuật đến kiểm tra ngay, hoặc đổi phòng cho anh." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "您好, 我是805房的客人, 我想跟您反映几个问题。", pinyin: "Nín hǎo, wǒ shì bā líng wǔ fáng de kèrén, wǒ xiǎng gēn nín fǎnyìng jǐ gè wèntí.", english: "Hello, I'm the guest in room 805 — I want to report a few issues.", vi: "Chào chị, em là khách phòng 805, em muốn phản ánh vài vấn đề." },
      { speaker: "前台", chinese: "好的, 您说。", pinyin: "Hǎo de, nín shuō.", english: "Sure, please tell me.", vi: "Vâng, anh nói đi." },
      { speaker: "阮", chinese: "第一, 空调声音很大, 我昨天晚上一夜没睡好。第二, 空调好像不太冷, 房间温度二十六度都降不下来。第三, 热水时有时无, 早上洗澡洗到一半就没热水了。", pinyin: "Dì yī, kōngtiáo shēngyīn hěn dà, wǒ zuótiān wǎnshàng yī yè méi shuì hǎo. Dì èr, kōngtiáo hǎoxiàng bù tài lěng, fángjiān wēndù èrshí liù dù dōu jiàng bù xiàlái. Dì sān, rèshuǐ shí yǒu shí wú, zǎoshang xǐzǎo xǐ dào yībàn jiù méi rèshuǐ le.", english: "First, AC is very loud, I couldn't sleep last night. Second, AC doesn't cool well, room won't drop below 26°C. Third, hot water comes and goes — this morning shower stopped halfway.", vi: "Thứ nhất, điều hòa kêu to, tối qua em không ngủ được cả đêm. Thứ hai, điều hòa hình như không lạnh, nhiệt độ phòng 26 độ không xuống được. Thứ ba, nước nóng lúc có lúc không, sáng tắm nửa chừng thì hết." },
      { speaker: "前台", chinese: "实在非常抱歉, 您住了几晚了?", pinyin: "Shízài fēicháng bàoqiàn, nín zhù le jǐ wǎn le?", english: "Truly sorry — how many nights have you stayed?", vi: "Thực sự xin lỗi anh, anh đã ở mấy đêm rồi?" },
      { speaker: "阮", chinese: "今天是第二晚, 还要住三晚。", pinyin: "Jīntiān shì dì èr wǎn, hái yào zhù sān wǎn.", english: "Tonight is the second night, three more to go.", vi: "Hôm nay là đêm thứ hai, còn ba đêm nữa." },
      { speaker: "前台", chinese: "我马上给您换房。我们有同价位的909房空着, 是高层, 安静一些。或者升一级到豪华房, 一晚补差价100元也行。", pinyin: "Wǒ mǎshàng gěi nín huàn fáng. Wǒmen yǒu tóng jiàwèi de jiǔ líng jiǔ fáng kòng zhe, shì gāo céng, ānjìng yīxiē. Huòzhě shēng yī jí dào háohuá fáng, yī wǎn bǔ chājià yībǎi yuán yě xíng.", english: "I'll change your room right away. We have 909 same price, higher floor, quieter. Or upgrade to deluxe, 100 RMB extra per night.", vi: "Em sẽ đổi phòng cho anh ngay. Có phòng 909 cùng giá, tầng cao, yên tĩnh hơn. Hoặc nâng hạng lên phòng deluxe, mỗi đêm bù chênh lệch 100 tệ." },
      { speaker: "阮", chinese: "909就行, 我不需要升级。但昨天晚上没睡好, 是不是可以补偿?", pinyin: "Jiǔ líng jiǔ jiùxíng, wǒ bù xūyào shēngjí. Dàn zuótiān wǎnshàng méi shuì hǎo, shì bù shì kěyǐ bǔcháng?", english: "909 is fine, no upgrade needed. But last night I couldn't sleep — any compensation?", vi: "909 được rồi, em không cần nâng hạng. Nhưng tối qua em không ngủ được, có thể đền bù không?" },
      { speaker: "前台", chinese: "可以理解。我跟经理沟通, 给您减一晚房费, 总共减350块, 直接退到您信用卡。", pinyin: "Kěyǐ lǐjiě. Wǒ gēn jīnglǐ gōutōng, gěi nín jiǎn yī wǎn fángfèi, zǒnggòng jiǎn sānbǎi wǔshí kuài, zhíjiē tuì dào nín xìnyòngkǎ.", english: "Understood. I'll talk to the manager — refund one night's fee, total 350 RMB, back to your credit card.", vi: "Em hiểu. Em sẽ nói với quản lý, hoàn anh một đêm tiền phòng, tổng 350 tệ, trả thẳng về thẻ tín dụng." },
      { speaker: "阮", chinese: "好, 谢谢您的处理。请问什么时候能换房?", pinyin: "Hǎo, xièxie nín de chǔlǐ. Qǐngwèn shénme shíhou néng huàn fáng?", english: "Good, thanks for handling. When can I change rooms?", vi: "Vâng, cảm ơn anh đã xử lý. Cho em hỏi khi nào có thể đổi phòng?" },
      { speaker: "前台", chinese: "马上。我让行李员二十分钟后来您805房帮您搬行李。新房间钥匙在这里。", pinyin: "Mǎshàng. Wǒ ràng xínglǐyuán èrshí fēnzhōng hòu lái nín bā líng wǔ fáng bāng nín bān xíngli. Xīn fángjiān yàoshi zài zhèlǐ.", english: "Right away. I'll send a bellhop to your 805 in 20 minutes to help with luggage. Here's the new room key.", vi: "Ngay lập tức. Em sẽ phái nhân viên hành lý đến phòng 805 trong 20 phút giúp chuyển đồ. Chìa khóa phòng mới đây." },
      { speaker: "阮", chinese: "谢谢, 太感谢您了。", pinyin: "Xièxie, tài gǎnxiè nín le.", english: "Thank you, really appreciate it.", vi: "Cảm ơn, em rất biết ơn chị." },
      { speaker: "前台", chinese: "应该的, 给您带来不便, 是我们的责任。希望您接下来住得愉快。", pinyin: "Yīnggāi de, gěi nín dài lái bù biàn, shì wǒmen de zérèn. Xīwàng nín jiē xiàlái zhù de yúkuài.", english: "It's our responsibility — sorry for the inconvenience. Hope your remaining stay is pleasant.", vi: "Đáng lẽ vậy, gây bất tiện cho anh là trách nhiệm của bọn em. Mong anh ở những ngày tới được vui." }
    ],
    roleplay_prompts: [
      "Phòng bạn có mùi thuốc lá nặng (KHÔNG phải khói cháy). Hãy yêu cầu đổi phòng. Chuẩn bị 2 phương án: (a) đổi phòng same-tier, (b) nếu hết phòng same-tier, được upgrade miễn phí. KHÔNG đe dọa review xấu — đề xuất hợp lý hơn.",
      "Wifi trong phòng không kết nối được, ảnh hưởng cuộc họp công việc. Hãy báo lễ tân + xin password backup + nếu không sửa được trong 30 phút, xin chuyển sang phòng có wifi mạnh. Cụm '我有重要会议' (em có cuộc họp quan trọng).",
      "Tiếng ồn xây dựng từ bên ngoài bắt đầu 7am sáng, làm bạn không ngủ được. Hãy xin lễ tân: (a) đóng cửa sổ + máy lạnh chế độ ngủ, (b) đổi phòng phía khác tòa nhà, (c) xin late checkout 2pm thay vì 12pm để bù lại."
    ],
    register_notes: "Khiếu nại khách sạn ở Trung Quốc: dùng register formal nhưng không leo thang. Nhân viên lễ tân có quyền đổi phòng, miễn phí dịch vụ, trừ tiền phòng — nhưng không có quyền đại diện công ty trừ những việc lớn. Cách tiếp cận:\n\nLAYER 1 — MÔ TẢ vấn đề khách quan:\n- '空调不冷' (điều hòa không lạnh)\n- '热水时有时无' (nước nóng lúc có lúc không)\n- '隔壁太吵' (phòng bên cạnh ồn)\n- '床有问题' (giường có vấn đề)\n\nLAYER 2 — TÁC ĐỘNG cụ thể:\n- '我一夜没睡好' (em không ngủ cả đêm)\n- '影响我明天的工作' (ảnh hưởng công việc ngày mai)\n- '洗澡洗到一半' (tắm nửa chừng)\n\nLAYER 3 — ĐỀ XUẤT giải pháp:\n- '能不能给我换一个房间?' (đổi phòng được không)\n- '是否可以退一晚的房费?' (hoàn một đêm phòng được không)\n- '能不能升级一下?' (nâng hạng được không)\n\nLAYER 4 — CHẤP NHẬN:\n- '好, 谢谢您的处理' (vâng, cảm ơn anh đã xử lý)\n- '太感谢您了' (cảm ơn anh nhiều)\n\nTránh: (a) Đe dọa review xấu trên Trip.com/Booking trừ khi thực sự không xử lý được — bị coi là vũ khí, làm phức tạp; (b) Nói 'tôi muốn nói chuyện với manager' ngay từ đầu — leo thang quá sớm; (c) Quay phim lễ tân trừ khi đã yêu cầu nhiều lần không xử lý.",
    idiom_glosses: [
      {
        idiom: "宾至如归",
        literal: "khách đến như về nhà (bīn zhì rú guī)",
        meaning: "Khách cảm thấy như ở nhà — chuẩn mực dịch vụ khách sạn. Cụm khách hàng dùng để gợi nhắc tiêu chuẩn: '我以为住您们酒店会宾至如归, 但...' (em tưởng ở khách sạn bọn anh sẽ như ở nhà, nhưng...). Mở đầu khiếu nại lịch sự.",
        example: "酒店的服务理念是宾至如归。"
      },
      {
        idiom: "将心比心",
        literal: "lấy lòng đo lòng (jiāng xīn bǐ xīn)",
        meaning: "Đặt mình vào vị trí khách — đồng cảm. Cụm dùng để xin lễ tân thấu hiểu: '将心比心, 您也想睡好觉吧?' (đặt mình vào vị trí em, anh/chị cũng muốn ngủ ngon chứ?). Tránh đối đầu — chuyển sang đồng cảm.",
        example: "将心比心, 我相信您能理解我的感受。"
      },
      {
        idiom: "息事宁人",
        literal: "dập việc làm yên người (xī shì níng rén)",
        meaning: "Dập tắt vấn đề để mọi người yên ổn — giải quyết khiếu nại nhanh chóng. Cụm dùng để gợi ý lễ tân giải quyết nhanh: 'mình 息事宁人, đừng để cao trào'.",
        example: "我希望我们能息事宁人, 把问题解决了。"
      },
      {
        idiom: "妥善处理",
        literal: "thỏa đáng xử lý (tuǒ shàn chǔ lǐ)",
        meaning: "Xử lý chu đáo, hợp lý — yêu cầu nhân viên giải quyết đầy đủ. Cụm formal dùng khi yêu cầu manager xử lý: '请您妥善处理这件事'. Tăng tính nghiêm túc của yêu cầu.",
        example: "希望您能妥善处理我的投诉。"
      }
    ],
    cultural_notes_vi: "Khiếu nại khách sạn ở Trung Quốc đại lục có khung văn hóa và pháp lý khác Việt Nam: (1) NHÂN VIÊN LỄ TÂN có thẩm quyền giải quyết phần lớn vấn đề — đổi phòng, nâng hạng miễn phí, giảm 1-2 đêm tiền phòng. KHÔNG cần gọi manager cho việc nhỏ. Manager chỉ cần khi: yêu cầu hoàn toàn bộ tiền, từ chối thanh toán cuối kỳ, sự cố nghiêm trọng (cháy, mất trộm, xâm phạm). (2) SỰ THỰC TIỄN > SỰ XIN LỖI: khác phương Tây (nơi 'I'm sorry' đủ để xoa dịu), khách sạn Trung Quốc giải quyết bằng HÀNH ĐỘNG (đổi phòng, hoàn tiền, quà). Đừng đòi xin lỗi long-winded — đòi giải pháp cụ thể. (3) BẰNG CHỨNG: chụp ảnh/quay video vấn đề (điều hòa không chạy, vết bẩn, hư hỏng) NGAY khi phát hiện. Gửi cho lễ tân qua WeChat — họ sẽ chuyển sếp xử lý nhanh hơn. KHÔNG đăng ngay lên Weibo/Trip.com — giữ làm leverage. (4) TIÊU CHUẨN BỒI THƯỜNG ngầm hiểu (không có luật cứng): vấn đề nhỏ (thiếu khăn, đèn cháy) = sửa trong 30 phút, không bồi thường; vấn đề trung bình (nước nóng, wifi) = đổi phòng + giảm 1 đêm; vấn đề nặng (sức khỏe, an toàn, thuốc lá nặng) = đổi phòng + giảm 50-100% tổng kỳ ở. Tự hỏi 'mức bồi thường hợp lý' trước khi yêu cầu — đừng đòi quá. (5) HỆ THỐNG REVIEW: Trung Quốc dùng Ctrip (携程), Trip.com (international), Meituan (美团 — local). Người dân + khách quốc tế đọc nhiều. Khách sạn lo review xấu lan ra > lo nhân viên 1 ngày. Đe dọa review xấu = vũ khí mạnh nhưng KHÔNG nên dùng đầu tiên — chỉ khi đã yêu cầu hợp lý mà bị từ chối.\n\nVề ăn cắp/mất đồ: nếu nghi nhân viên dọn dẹp lấy đồ, KHÔNG buộc tội trực tiếp. Báo lễ tân: 'tôi không tìm thấy X, có thể trong quá trình dọn phòng đã bị di chuyển?' (我找不到X, 是否在打扫时移动了?). Khách sạn sẽ kiểm tra camera + hỏi nhân viên. Nếu tìm được, OK. Nếu không, có thể yêu cầu xem báo cáo + làm bản kiểm điểm. Mất đồ giá trị (>500 USD) = báo công an + đại sứ quán.\n\nVề tiền cọc (押金 — yājīn): khách sạn Trung Quốc thường thu cọc 200-500 tệ tiền mặt hoặc giữ trên thẻ khi check-in. Hoàn lại trừ phí khi check-out (kiểm tra phòng 5-10 phút). Đừng quên đòi lại — nhân viên đôi khi 'quên'.",
    tip_advice_vi: "(1) ĐỌC REVIEW TRƯỚC khi đặt — Trip.com, Booking.com có review khách quốc tế. Tránh khách sạn có >10% review nói 'noisy' hoặc 'AC broken'. Mức 4.0+/5 là an toàn. (2) ĐẶT QUA APP CHÍNH THỨC (Trip.com, Booking.com, Agoda) thay vì đại lý du lịch — có policy hoàn tiền/đổi phòng rõ ràng + customer support 24/7 bằng tiếng Anh. (3) KIỂM TRA PHÒNG NGAY khi check-in: bật điều hòa, mở vòi nước nóng (chờ 1 phút), kiểm tra wifi (kết nối + tốc độ), kiểm tra ổ cắm điện, kiểm tra cửa khóa. Tìm vấn đề trong 5-10 phút đầu — báo lễ tân ngay. Báo SAU đêm đầu = bị nghi 'làm tiền'. (4) CHỤP ẢNH VẤN ĐỀ kèm timestamp: dùng app camera mặc định, đảm bảo metadata có ngày giờ. Gửi qua WeChat cho lễ tân (chứng cứ + tốc độ phản hồi nhanh hơn). (5) KHIẾU NẠI KHÉO LÉO, không leo thang. Cấu trúc: mô tả vấn đề (1 câu) → tác động (1 câu) → đề xuất (1 câu). Ví dụ: 'điều hòa không chạy, đêm qua em không ngủ được, có thể đổi phòng không?'. Đừng kéo dài 5 phút mô tả. (6) KHI ĐƯỢC GIẢI QUYẾT, NÓI CẢM ƠN cụ thể: '太感谢您了, 您处理得很专业' (cảm ơn chị nhiều, chị xử lý chuyên nghiệp). Để lại tip 20-50 tệ cho nhân viên giúp đỡ — không bắt buộc nhưng được đánh giá cao. (7) NẾU KHÔNG XỬ LÝ ĐƯỢC: viết review trung thực + có ảnh trên Trip.com/Booking.com (NOT Weibo viral). Giữ tone factual, không cảm xúc — review mạnh nhất là 'fact-based'. Khách sạn có thể liên hệ lại offer hoàn tiền 1 phần để xin xóa/sửa review. Đó là leverage — dùng cẩn thận.",
    exercises: [
      { type: "fill-blank", question: "您好, 我想 ___ 一下我房间的问题。", answer: "反映" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung khách sạn với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "前台", pinyin: "qián tái", english: "lễ tân" },
          { chinese: "换房", pinyin: "huàn fáng", english: "đổi phòng" },
          { chinese: "升级", pinyin: "shēng jí", english: "nâng hạng" },
          { chinese: "补偿", pinyin: "bǔ cháng", english: "đền bù" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em ở phòng 805, điều hòa không lạnh, nước nóng lúc có lúc không. Cho em hỏi có thể đổi cho em phòng khác không?",
        chinese: "我住805房, 空调不冷, 热水时有时无。请问能不能给我换一个房间?",
        pinyin: "Wǒ zhù bā líng wǔ fáng, kōng tiáo bù lěng, rè shuǐ shí yǒu shí wú. Qǐng wèn néng bù néng gěi wǒ huàn yī gè fáng jiān?"
      }
    ]
  },
  {
    id: 77,
    level: "B2",
    category: "travel_mobility",
    title: "行李丢了 — 在航空公司柜台报失",
    pinyin: "xíng li diū le — zài háng kōng gōng sī guì tái bào shī",
    topic: "Lost luggage — China Southern/Eastern/Air China counter claim",
    title_vi: "Mất hành lý — báo mất tại quầy hãng bay Trung Quốc",
    title_en: "Lost luggage — claiming at Chinese airline counter",
    sentences: [
      {
        chinese: "您好, 我的行李没出来, 想报失。",
        pinyin: "Nín hǎo, wǒ de xíngli méi chūlái, xiǎng bào shī.",
        english: "Hello, my luggage didn't come out — I want to report it.",
        vi: "Em chào anh/chị, hành lý của em không ra, em muốn báo mất.",
        pronunciation_focus: ["行李 → xíngli (hành lý)", "没出来 → méi chūlái (không ra)", "报失 → bào shī (báo mất)", "您好 → nín hǎo"]
      },
      {
        chinese: "我从胡志明市飞过来, 转机昆明, 这是登机牌。",
        pinyin: "Wǒ cóng Húzhìmíng shì fēi guòlái, zhuǎnjī Kūnmíng, zhè shì dēngjī pái.",
        english: "I flew from Ho Chi Minh City via Kunming — here's my boarding pass.",
        vi: "Em bay từ TP HCM đến, transit ở Côn Minh, đây là thẻ lên máy bay.",
        pronunciation_focus: ["胡志明市 → Húzhìmíng shì (TP HCM)", "转机 → zhuǎnjī (transit)", "昆明 → Kūnmíng", "登机牌 → dēngjī pái (thẻ lên máy bay)"]
      },
      {
        chinese: "这是行李托运凭条, 编号在这里。",
        pinyin: "Zhè shì xíngli tuōyùn píngtiáo, biānhào zài zhèlǐ.",
        english: "This is the baggage claim tag, the number is here.",
        vi: "Đây là cùi hành lý ký gửi, mã số ở đây.",
        pronunciation_focus: ["托运凭条 → tuōyùn píngtiáo (cùi hành lý)", "编号 → biānhào (mã số)", "在这里 → zài zhèlǐ", "行李 → xíngli"]
      },
      {
        chinese: "行李是黑色硬壳箱, 28寸, 上面有越南国旗贴纸。",
        pinyin: "Xíngli shì hēisè yìngké xiāng, èrshí bā cùn, shàngmiàn yǒu Yuènán guóqí tiēzhǐ.",
        english: "Black hard-shell case, 28-inch, with a Vietnamese flag sticker.",
        vi: "Hành lý vali đen vỏ cứng, 28 inch, có sticker cờ Việt Nam.",
        pronunciation_focus: ["黑色 → hēisè (đen)", "硬壳箱 → yìngké xiāng (vali vỏ cứng)", "28寸 → èrshí bā cùn (28 inch)", "贴纸 → tiēzhǐ (sticker)"]
      },
      {
        chinese: "请问行李找到后, 你们能送到我酒店吗?",
        pinyin: "Qǐngwèn xíngli zhǎodào hòu, nǐmen néng sòng dào wǒ jiǔdiàn ma?",
        english: "Once found, can you deliver it to my hotel?",
        vi: "Cho em hỏi khi tìm thấy hành lý, bên anh có thể gửi đến khách sạn em không?",
        pronunciation_focus: ["送到 → sòng dào (gửi đến)", "酒店 → jiǔdiàn (khách sạn)", "找到 → zhǎodào (tìm thấy)", "请问 → qǐngwèn"]
      }
    ],
    vocab: [
      { chinese: "行李", pinyin: "xíng li", english: "luggage", vi: "hành lý" },
      { chinese: "托运", pinyin: "tuō yùn", english: "to check in (luggage)", vi: "ký gửi" },
      { chinese: "凭条", pinyin: "píng tiáo", english: "claim tag / receipt", vi: "cùi hành lý" },
      { chinese: "报失", pinyin: "bào shī", english: "to report lost", vi: "báo mất" },
      { chinese: "登机牌", pinyin: "dēng jī pái", english: "boarding pass", vi: "thẻ lên máy bay" },
      { chinese: "转机", pinyin: "zhuǎn jī", english: "to transit", vi: "transit / quá cảnh" },
      { chinese: "硬壳箱", pinyin: "yìng ké xiāng", english: "hard-shell case", vi: "vali vỏ cứng" },
      { chinese: "理赔", pinyin: "lǐ péi", english: "to file insurance claim", vi: "yêu cầu bồi thường" },
      { chinese: "联系电话", pinyin: "lián xì diàn huà", english: "contact phone", vi: "số điện thoại liên hệ" },
      { chinese: "送货上门", pinyin: "sòng huò shàng mén", english: "deliver to door", vi: "giao hàng tận nơi" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "您好, 我的行李没出来。", pinyin: "Nín hǎo, wǒ de xíngli méi chūlái.", english: "Hello, my luggage didn't come out.", vi: "Chào chị, hành lý của em không ra." },
      { speaker: "工作人员", chinese: "把登机牌和托运凭条给我。", pinyin: "Bǎ dēngjī pái hé tuōyùn píngtiáo gěi wǒ.", english: "Give me your boarding pass and claim tag.", vi: "Đưa em thẻ lên máy bay và cùi hành lý." },
      { speaker: "阮", chinese: "在这里。", pinyin: "Zài zhèlǐ.", english: "Here.", vi: "Đây ạ." },
      { speaker: "工作人员", chinese: "我登记一下, 请描述行李的样子。", pinyin: "Wǒ dēngjì yīxià, qǐng miáoshù xíngli de yàngzi.", english: "Let me register, please describe the luggage.", vi: "Em đăng ký, xin mô tả hình dáng hành lý." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "您好, 我刚下飞机, 行李带没有我的箱子。", pinyin: "Nín hǎo, wǒ gāng xià fēijī, xíngli dài méiyǒu wǒ de xiāngzi.", english: "Hello, I just got off the plane, my bag isn't on the carousel.", vi: "Chào chị, em vừa xuống máy bay, băng chuyền không có vali của em." },
      { speaker: "工作人员", chinese: "您是哪个航班?", pinyin: "Nín shì nǎ gè hángbān?", english: "Which flight?", vi: "Anh đi chuyến nào?" },
      { speaker: "阮", chinese: "南航CZ8459, 从胡志明市经昆明到北京。", pinyin: "Nán Háng CZ bāsìwǔjiǔ, cóng Húzhìmíng shì jīng Kūnmíng dào Běijīng.", english: "China Southern CZ8459, Ho Chi Minh - Kunming - Beijing.", vi: "Phương Hàng CZ8459, từ TP HCM qua Côn Minh đến Bắc Kinh." },
      { speaker: "工作人员", chinese: "把登机牌、护照和托运凭条都给我。", pinyin: "Bǎ dēngjī pái, hùzhào hé tuōyùn píngtiáo dōu gěi wǒ.", english: "Give me boarding pass, passport, and baggage claim tag.", vi: "Đưa em thẻ lên máy bay, hộ chiếu, và cùi hành lý." },
      { speaker: "阮", chinese: "都在这里。托运凭条编号 cz8459-vn-007。", pinyin: "Dōu zài zhèlǐ. Tuōyùn píngtiáo biānhào CZ-bāsìwǔjiǔ-VN-líng líng qī.", english: "All here. Tag number CZ8459-VN-007.", vi: "Đều đây. Mã cùi CZ8459-VN-007." },
      { speaker: "工作人员", chinese: "我查一下系统。... 看到了, 您的行李在昆明转机时漏装了, 现在还在昆明机场。下一班飞机晚上八点到, 大概九点能取。", pinyin: "Wǒ chá yīxià xìtǒng. ... Kàndào le, nín de xíngli zài Kūnmíng zhuǎnjī shí lòu zhuāng le, xiànzài hái zài Kūnmíng jīchǎng. Xià yī bān fēijī wǎnshàng bā diǎn dào, dàgài jiǔ diǎn néng qǔ.", english: "Let me check the system. ... Found it — your bag missed the transfer in Kunming, still at Kunming airport. Next flight arrives 8 PM, can pick up around 9 PM.", vi: "Em tra hệ thống. ... Thấy rồi, hành lý anh bị sót khi transit ở Côn Minh, hiện vẫn ở sân bay Côn Minh. Chuyến tiếp theo đến 8 giờ tối, khoảng 9 giờ là lấy được." },
      { speaker: "阮", chinese: "今晚我已经预订了酒店, 不方便再来机场。能送到酒店吗?", pinyin: "Jīn wǎn wǒ yǐjīng yùdìng le jiǔdiàn, bù fāngbiàn zài lái jīchǎng. Néng sòng dào jiǔdiàn ma?", english: "Tonight I'm at the hotel, not convenient to come back. Can you deliver to the hotel?", vi: "Tối nay em đã đặt khách sạn, không tiện đến sân bay lại. Có thể gửi đến khách sạn không?" },
      { speaker: "工作人员", chinese: "可以, 我们有送货上门服务, 在北京市区免费, 通常第二天上午到。请填这张单子: 酒店地址、房号、联系电话、和行李描述。", pinyin: "Kěyǐ, wǒmen yǒu sòng huò shàng mén fúwù, zài Běijīng shìqū miǎnfèi, tōngcháng dì èr tiān shàngwǔ dào. Qǐng tián zhè zhāng dānzi: jiǔdiàn dìzhǐ, fángháo, liánxì diànhuà, hé xíngli miáoshù.", english: "Yes, we have door delivery, free within Beijing city, usually arrives next morning. Please fill: hotel address, room number, phone, and luggage description.", vi: "Được, bọn em có dịch vụ giao tận nơi, trong nội thành Bắc Kinh miễn phí, thường sáng hôm sau đến. Xin điền: địa chỉ khách sạn, số phòng, số ĐT, và mô tả hành lý." },
      { speaker: "阮", chinese: "好。行李是黑色硬壳箱, 28寸, 美旅牌, 上面贴了越南国旗的小贴纸。重大概23公斤。", pinyin: "Hǎo. Xíngli shì hēisè yìngké xiāng, èrshí bā cùn, Měilǚ pái, shàngmiàn tiē le Yuènán guóqí de xiǎo tiēzhǐ. Zhòng dàgài èrshí sān gōngjīn.", english: "Okay. Black hard-shell case, 28-inch, American Tourister brand, with a small Vietnamese flag sticker. About 23kg.", vi: "Vâng. Hành lý vali đen vỏ cứng, 28 inch, hiệu American Tourister, có dán sticker nhỏ cờ Việt Nam. Khoảng 23kg." },
      { speaker: "工作人员", chinese: "里面贵重物品有吗? 比如电脑、相机、首饰?", pinyin: "Lǐmiàn guìzhòng wùpǐn yǒu ma? Bǐrú diànnǎo, xiàngjī, shǒushì?", english: "Any valuables inside? Like laptop, camera, jewelry?", vi: "Bên trong có đồ giá trị không? Ví dụ máy tính, máy ảnh, trang sức?" },
      { speaker: "阮", chinese: "没有电脑相机, 都在我手提里。里面是衣服、洗漱用品、和一些礼物 (越南咖啡和巧克力)。", pinyin: "Méiyǒu diànnǎo xiàngjī, dōu zài wǒ shǒutí lǐ. Lǐmiàn shì yīfu, xǐshù yòngpǐn, hé yīxiē lǐwù (Yuènán kāfēi hé qiǎokèlì).", english: "No laptop or camera, all in my carry-on. Inside is clothes, toiletries, and some gifts (Vietnamese coffee and chocolate).", vi: "Không có máy tính máy ảnh, đều trong xách tay. Bên trong là quần áo, đồ vệ sinh, và một ít quà (cà phê Việt Nam và sô-cô-la)." },
      { speaker: "工作人员", chinese: "好。这是您的报失单复印件, 单号写好了。如果明天上午十点之前没收到, 直接打这个电话, 会有专人跟进。", pinyin: "Hǎo. Zhè shì nín de bào shī dān fùyìnjiàn, dānhào xiě hǎo le. Rúguǒ míngtiān shàngwǔ shí diǎn zhīqián méi shōu dào, zhíjiē dǎ zhège diànhuà, huì yǒu zhuānrén gēnjìn.", english: "Okay. Here's your lost report copy, case number written. If not received by 10 AM tomorrow, call this number — a dedicated person will follow up.", vi: "Được. Đây là bản sao báo mất, mã hồ sơ đã ghi. Nếu trước 10 giờ sáng mai chưa nhận được, gọi thẳng số này, sẽ có người theo dõi riêng." },
      { speaker: "阮", chinese: "如果行李不见了, 怎么赔?", pinyin: "Rúguǒ xíngli bù jiàn le, zěnme péi?", english: "If the bag is permanently lost, what's the compensation?", vi: "Nếu hành lý mất luôn thì đền bù thế nào?" },
      { speaker: "工作人员", chinese: "按国际航班规定, 每公斤最多赔偿20美元, 总额不超过1131美元。建议您先看看有没有旅游保险, 通常保险赔得更多。", pinyin: "Àn guójì hángbān guīdìng, měi gōngjīn zuì duō péicháng èrshí měiyuán, zǒng'é bù chāoguò yīqiān yībǎi sānshí yī měiyuán. Jiànyì nín xiān kànkan yǒu méiyǒu lǚyóu bǎoxiǎn, tōngcháng bǎoxiǎn péi de gèng duō.", english: "Per international flight rules, max $20 USD per kg, total no more than $1,131 USD. Recommend checking your travel insurance — usually pays more.", vi: "Theo quy định hãng bay quốc tế, tối đa 20 USD/kg, tổng không quá 1,131 USD. Khuyên anh kiểm tra bảo hiểm du lịch trước, thường bảo hiểm đền nhiều hơn." },
      { speaker: "阮", chinese: "明白了, 谢谢您。希望明天就能拿到行李。", pinyin: "Míngbái le, xièxie nín. Xīwàng míngtiān jiù néng ná dào xíngli.", english: "Understood, thank you. Hope to get my bag tomorrow.", vi: "Em hiểu rồi, cảm ơn anh. Mong mai là nhận được hành lý." },
      { speaker: "工作人员", chinese: "您先注意保管登机牌和报失单, 收到行李时签字就行。给您带来不便, 实在抱歉。", pinyin: "Nín xiān zhùyì bǎoguǎn dēngjī pái hé bào shī dān, shōu dào xíngli shí qiān zì jiùxíng. Gěi nín dài lái bù biàn, shízài bàoqiàn.", english: "Keep boarding pass and lost report safe, sign when you receive the bag. Apologies for the inconvenience.", vi: "Anh giữ kỹ thẻ lên máy bay và biên nhận báo mất, khi nhận hành lý ký tên là xong. Gây bất tiện cho anh, thực sự xin lỗi." }
    ],
    roleplay_prompts: [
      "Hành lý của bạn đến nhưng vali bị MÓP (móp lớn ở góc) hoặc khóa bị PHÁ. Hãy báo ngay tại sân bay (KHÔNG đi về rồi mới quay lại — sẽ khó claim). Yêu cầu: bản báo cáo + ảnh chụp vali bị hư + giấy bồi thường (PIR — Property Irregularity Report).",
      "Hai ngày sau khi báo mất, vali vẫn chưa đến. Hãy gọi số hotline + viết email follow-up. Yêu cầu: cập nhật vị trí cụ thể + thời gian giao dự kiến + nếu chậm hơn 5 ngày, claim bồi thường tạm thời cho đồ thay thế (quần áo, đồ vệ sinh) — bảo hiểm thường chi 100-300 USD.",
      "Vali tìm thấy nhưng MẤT đồ bên trong (sô-cô-la quà tặng, một bộ quần áo). Hãy báo: kê chi tiết đồ mất + giá trị ước tính + xin claim bảo hiểm. KHÔNG buộc tội ai. Cụm '我清点行李后, 发现X件物品不见了'."
    ],
    register_notes: "Quầy báo mất hành lý ở sân bay Trung Quốc dùng register formal nhanh. Mỗi quầy phục vụ 1-2 phút mỗi khách trong giờ cao điểm. Bạn dùng 您 với cán bộ.\n\nCác cụm chuẩn:\n- '我的行李没出来' (hành lý em không ra)\n- '我从X飞过来, 转机Y' (em bay từ X, transit Y)\n- '行李是X颜色, X寸的, 上面有X' (hành lý màu X, X inch, có X)\n- '里面有什么?' (bên trong có gì) → '没有贵重物品' (không có đồ giá trị) hoặc liệt kê cụ thể\n- '能送到酒店吗?' (gửi đến khách sạn được không)\n- '什么时候能拿到?' (khi nào có thể nhận)\n- '如果丢了, 怎么赔?' (nếu mất luôn, đền thế nào)\n\nMÔ TẢ HÀNH LÝ: tone trung tính + chi tiết. Cấu trúc: màu sắc + chất liệu (硬壳/软壳 = vỏ cứng/mềm) + kích cỡ (24/26/28寸) + nhãn hiệu (Samsonite, American Tourister, RIMOWA) + đặc điểm nhận dạng (sticker, dây đeo, nhãn tên). Càng chi tiết = càng dễ tìm.\n\nMÔ TẢ ĐỒ TRONG: liệt kê đại khái + giá trị ước tính. KHÔNG nói 'có máy ảnh' nếu thực sự không có (xếp loại 'gian lận bảo hiểm'). Đồ giá trị thực sự (laptop, máy ảnh, trang sức) → đáng lẽ MANG TRONG XÁCH TAY, không ký gửi. Nếu đã ký gửi và mất, bồi thường rất hạn chế ($20/kg).\n\nTránh: (a) Đe dọa kiện hãng — chuyển sang tone hợp tác; (b) Khóc lóc tại quầy — không tăng tốc xử lý; (c) Nói tiếng Anh trừ khi nhân viên chuyển sang tiếng Anh trước; (d) Đăng status mạng xã hội 'mất hành lý X hãng' — xử lý private trước.",
    idiom_glosses: [
      {
        idiom: "失而复得",
        literal: "mất rồi tìm lại được (shī ér fù dé)",
        meaning: "Mất rồi tìm lại — vui mừng vì lấy lại được vật. Cụm dùng khi vali về sau 1-2 ngày: '行李失而复得, 太好了!'. Tăng tính cảm xúc trong câu cảm ơn.",
        example: "我的行李失而复得, 真是万幸。"
      },
      {
        idiom: "万无一失",
        literal: "vạn vô một thất (wàn wú yī shī)",
        meaning: "Hoàn toàn chắc chắn không có sai sót. Cụm dùng để yêu cầu hệ thống cẩn thận: '请您万无一失地处理我的行李, 别再丢了'. Cũng dùng để cam kết khi đã sửa lỗi.",
        example: "下次我会万无一失, 不会再让行李丢了。"
      },
      {
        idiom: "亡羊补牢",
        literal: "mất dê sửa chuồng (wáng yáng bǔ láo)",
        meaning: "Mất dê rồi mới sửa chuồng — sửa sai sau khi đã sai, vẫn còn kịp. Cụm dùng để giải thích vì sao bạn mua bảo hiểm sau khi từng bị mất hành lý: 'tuy 亡羊补牢, nhưng vẫn còn kịp'.",
        example: "我从那次以后买了行李保险, 算是亡羊补牢。"
      },
      {
        idiom: "心急如焚",
        literal: "lòng nóng như đốt (xīn jí rú fén)",
        meaning: "Lòng nóng như cháy — quá lo lắng, sốt ruột. Cụm cảm xúc dùng để mô tả cảm giác chờ hành lý: '我现在心急如焚, 行李里有重要文件'. Tăng độ khẩn của yêu cầu mà không la mắng.",
        example: "行李里有重要资料, 我心急如焚。"
      }
    ],
    cultural_notes_vi: "Mất hành lý là tình huống phổ biến với chuyến bay quốc tế có transit (transfer). Năm điều người Việt cần biết khi bay Trung Quốc:\n\n(1) HÃNG BAY TRUNG QUỐC: Air China (国航 — CA), China Eastern (东航 — MU), China Southern (南航 — CZ), Hainan Airlines (海航 — HU). Tất cả đều có bộ phận hành lý mất 24/7 tại sân bay lớn. Tỉ lệ mất hành lý: 0.5-1% chuyến quốc tế (trung bình toàn cầu). Phần lớn tìm được trong 24-48 giờ.\n\n(2) NGUYÊN NHÂN PHỔ BIẾN: (a) Transit time quá ngắn (<60 phút) — vali không kịp chuyển; (b) Tag bị rách/dán không đúng tại điểm xuất phát; (c) Sót tại băng chuyền — quá đông, nhân viên không kịp xếp; (d) Nhầm với hành lý khác — ai đó lấy nhầm vali tương tự. CHỤP ẢNH VALI trước khi check-in = bằng chứng nhận diện tốt nhất.\n\n(3) BÁO NGAY TẠI SÂN BAY, không đi về. Quầy 'Lost & Found' (失物招领) hoặc 'Baggage Service' (行李服务) — tìm trên bản đồ sân bay. Giấy báo mất (Property Irregularity Report — PIR) PHẢI làm tại sân bay. Sau khi rời = không thể claim.\n\n(4) BỒI THƯỜNG: theo công ước Montreal (Trung Quốc tham gia): tối đa 1,131 SDR (~$1,500 USD) cho cả vali + đồ bên trong. Hãng bay sẽ yêu cầu hóa đơn/biên nhận để chứng minh giá trị — KHÔNG có hóa đơn = đền theo trọng lượng ($20/kg). Đồ giá trị (laptop, đồ trang sức) — KHÔNG ký gửi, mang xách tay. Nếu đã ký gửi = không được đền đầy đủ.\n\n(5) BẢO HIỂM DU LỊCH thường đền nhiều hơn hãng bay: cho phép kê cả vali + đồ + thiệt hại tinh thần (gọi 'inconvenience compensation'). Sau khi báo PIR tại sân bay, gửi mọi giấy tờ + biên nhận sang công ty bảo hiểm. Bảo Việt, Bảo Minh, MIC, BSH thường đền 5-15 triệu VND cho ca lost luggage.\n\nVề việc 'tip' để được ưu tiên: KHÔNG ở Trung Quốc đại lục. Hệ thống có quy trình + camera giám sát. Tip = phản tác dụng, có thể bị báo cáo. Ở Đông Nam Á (Việt Nam, Thái Lan, Indonesia) có thể tip để xử lý nhanh, nhưng KHÔNG ở Trung Quốc.\n\nVề ngôn ngữ: nhân viên hãng bay Trung Quốc tại sân bay quốc tế thường nói tiếng Anh cơ bản. Nếu bạn không thành thạo tiếng Trung, dùng tiếng Anh — họ chấp nhận. Cụm cứu nguy: 'My luggage didn't arrive, I want to file a report' / 'I need a delayed baggage report'.\n\nVề thời gian: đa số vali bị sót transit về trong 24 giờ qua chuyến tiếp theo. 1-3 ngày = có thể nhân viên đang tìm trong hệ thống. >5 ngày = cần follow up gắt và có khả năng mất luôn. Sau 21 ngày không tìm được = tuyên bố 'hành lý mất' (lost luggage), bắt đầu quá trình bồi thường.",
    tip_advice_vi: "(1) CHỤP ẢNH VALI + ĐỒ BÊN TRONG trước khi check-in: cảnh tổng thể vali + nhãn hiệu + nội dung khi mở ra. Lưu cloud (Google Drive, iCloud). Bằng chứng vàng cho hãng + bảo hiểm. (2) TAG RIÊNG: dán nhãn tên + số ĐT (kèm mã +84) + email cá nhân + tên khách sạn đến BÊN NGOÀI vali. Bên trong cũng để 1 tờ giấy trùng thông tin (phòng trường hợp tag ngoài rách). (3) ĐỒ GIÁ TRỊ → XÁCH TAY: laptop, máy ảnh, kim hoàn, thuốc kê đơn, thiết bị điện tử, hộ chiếu/giấy tờ — KHÔNG ký gửi. Bảo hiểm hãng bay không đền đủ. (4) CHỌN CHUYẾN BAY có TRANSIT TỐI THIỂU 90 PHÚT cho hành lý transfer. Dưới 60 phút = rủi ro cao. Đặc biệt qua sân bay lớn (Bắc Kinh PEK, Thượng Hải PVG, Quảng Châu CAN) cần thêm thời gian. (5) BÁO NGAY TẠI SÂN BAY khi không thấy vali — KHÔNG đợi 1 giờ ở băng chuyền. Sau 30 phút mà chưa ra = đến quầy ngay. Xếp hàng có thể 30-60 phút khi nhiều người cùng báo. (6) GIỮ MỌI GIẤY TỜ trong túi ziplock: thẻ lên máy bay, cùi hành lý, giấy báo mất (PIR), tên + số ĐT nhân viên xử lý. Mất 1 tờ = quá trình claim chậm 1 tuần. (7) NẾU PHẢI MUA ĐỒ THAY THẾ (khi vali chưa đến sau 24 giờ): mua TỐI THIỂU cần thiết (1 bộ quần áo, đồ vệ sinh, sạc điện thoại — tổng 100-200 USD). Giữ HÓA ĐƠN — bảo hiểm sẽ hoàn lại khi nộp. KHÔNG mua hàng hiệu/đồ đắt — bảo hiểm chỉ trả 'reasonable replacement cost', không nâng cấp.",
    exercises: [
      { type: "fill-blank", question: "您好, 我的行李没出来, 想 ___ 。", answer: "报失" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung mất hành lý với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "托运凭条", pinyin: "tuō yùn píng tiáo", english: "cùi hành lý" },
          { chinese: "登机牌", pinyin: "dēng jī pái", english: "thẻ lên máy bay" },
          { chinese: "送货上门", pinyin: "sòng huò shàng mén", english: "giao tận nơi" },
          { chinese: "理赔", pinyin: "lǐ péi", english: "yêu cầu bồi thường" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Hành lý em là vali đen vỏ cứng, 28 inch. Có thể giao đến khách sạn em không?",
        chinese: "我的行李是黑色硬壳箱, 28寸。能送到我酒店吗?",
        pinyin: "Wǒ de xíng li shì hēi sè yìng ké xiāng, èr shí bā cùn. Néng sòng dào wǒ jiǔ diàn ma?"
      }
    ]
  },
  {
    id: 78,
    level: "B2",
    category: "travel_mobility",
    title: "派出所报案 — 钱包被偷",
    pinyin: "pài chū suǒ bào àn — qián bāo bèi tōu",
    topic: "Police report — wallet stolen, insurance claim receipt",
    title_vi: "Báo công an khu vực — ví bị trộm, lấy biên nhận bảo hiểm",
    title_en: "Police report — stolen wallet, getting receipt for insurance",
    sentences: [
      {
        chinese: "您好, 我的钱包被偷了, 想报案。",
        pinyin: "Nín hǎo, wǒ de qiánbāo bèi tōu le, xiǎng bào'àn.",
        english: "Hello, my wallet was stolen — I want to file a report.",
        vi: "Em chào anh/chị, ví của em bị trộm, em muốn trình báo.",
        pronunciation_focus: ["钱包 → qiánbāo (ví tiền)", "被偷 → bèi tōu (bị trộm — passive)", "报案 → bào'àn (trình báo)", "您好 → nín hǎo"]
      },
      {
        chinese: "今天上午在王府井购物时发现钱包不见了。",
        pinyin: "Jīntiān shàngwǔ zài Wángfǔjǐng gòuwù shí fāxiàn qiánbāo bù jiàn le.",
        english: "This morning at Wangfujing while shopping, I noticed my wallet was missing.",
        vi: "Sáng nay khi mua sắm ở Vương Phủ Tỉnh em phát hiện ví không còn.",
        pronunciation_focus: ["王府井 → Wángfǔjǐng (phố mua sắm Bắc Kinh)", "购物 → gòuwù (mua sắm)", "发现 → fāxiàn (phát hiện)", "不见了 → bù jiàn le (không còn)"]
      },
      {
        chinese: "里面有信用卡、身份证复印件和大概两千块人民币。",
        pinyin: "Lǐmiàn yǒu xìnyòngkǎ, shēnfènzhèng fùyìnjiàn hé dàgài liǎngqiān kuài rénmínbì.",
        english: "Inside: credit card, ID photocopy, and about 2,000 RMB.",
        vi: "Trong đó có thẻ tín dụng, bản sao CMND và khoảng 2,000 nhân dân tệ.",
        pronunciation_focus: ["信用卡 → xìnyòngkǎ (thẻ tín dụng)", "身份证复印件 → shēnfènzhèng fùyìnjiàn (bản sao CMND)", "两千块 → liǎngqiān kuài (2,000 tệ)", "里面 → lǐmiàn (bên trong)"]
      },
      {
        chinese: "麻烦您出一份报案回执, 我要交保险公司。",
        pinyin: "Máfan nín chū yī fèn bào'àn huízhí, wǒ yào jiāo bǎoxiǎn gōngsī.",
        english: "Please issue a police report receipt — I need it for my insurance.",
        vi: "Phiền anh/chị xuất biên nhận trình báo, em cần nộp công ty bảo hiểm.",
        pronunciation_focus: ["报案回执 → bào'àn huízhí (biên nhận trình báo — chứng từ chính)", "保险公司 → bǎoxiǎn gōngsī (công ty bảo hiểm)", "出 → chū (xuất / cấp)", "麻烦您 → máfan nín"]
      },
      {
        chinese: "我已经联系信用卡公司挂失了, 现在主要需要回执理赔。",
        pinyin: "Wǒ yǐjīng liánxì xìnyòngkǎ gōngsī guàshī le, xiànzài zhǔyào xūyào huízhí lǐpéi.",
        english: "I already called my credit card company to freeze it — mainly need the receipt for the claim.",
        vi: "Em đã gọi công ty thẻ báo khóa rồi, chủ yếu cần biên nhận để claim bảo hiểm.",
        pronunciation_focus: ["挂失 → guàshī (báo mất / khóa thẻ)", "联系 → liánxì (liên hệ)", "理赔 → lǐpéi (yêu cầu bồi thường)", "已经 → yǐjīng"]
      }
    ],
    vocab: [
      { chinese: "派出所", pinyin: "pài chū suǒ", english: "local police station", vi: "đồn công an khu vực" },
      { chinese: "报案", pinyin: "bào àn", english: "to file a police report", vi: "trình báo" },
      { chinese: "回执", pinyin: "huí zhí", english: "receipt", vi: "biên nhận" },
      { chinese: "钱包", pinyin: "qián bāo", english: "wallet", vi: "ví tiền" },
      { chinese: "被偷", pinyin: "bèi tōu", english: "to be stolen", vi: "bị trộm" },
      { chinese: "丢失", pinyin: "diū shī", english: "to lose", vi: "bị mất" },
      { chinese: "挂失", pinyin: "guà shī", english: "to report (card) lost / freeze", vi: "báo mất / khóa" },
      { chinese: "信用卡", pinyin: "xìn yòng kǎ", english: "credit card", vi: "thẻ tín dụng" },
      { chinese: "身份证", pinyin: "shēn fèn zhèng", english: "ID card", vi: "CMND" },
      { chinese: "理赔", pinyin: "lǐ péi", english: "insurance claim", vi: "yêu cầu bồi thường" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "您好, 我钱包被偷了, 想报案。", pinyin: "Nín hǎo, wǒ qiánbāo bèi tōu le, xiǎng bào'àn.", english: "Hello, my wallet was stolen, want to report.", vi: "Chào anh, ví em bị trộm, em muốn trình báo." },
      { speaker: "民警", chinese: "请把护照给我。在哪里被偷的?", pinyin: "Qǐng bǎ hùzhào gěi wǒ. Zài nǎlǐ bèi tōu de?", english: "Give me your passport. Where was it stolen?", vi: "Đưa em hộ chiếu. Bị trộm ở đâu?" },
      { speaker: "阮", chinese: "今天上午在王府井, 大概十一点左右。", pinyin: "Jīntiān shàngwǔ zài Wángfǔjǐng, dàgài shíyī diǎn zuǒyòu.", english: "This morning at Wangfujing, around 11 AM.", vi: "Sáng nay ở Vương Phủ Tỉnh, khoảng 11 giờ." },
      { speaker: "民警", chinese: "请填这张表, 我办手续。完事我给您出回执。", pinyin: "Qǐng tián zhè zhāng biǎo, wǒ bàn shǒuxù. Wánshì wǒ gěi nín chū huízhí.", english: "Fill this form, I'll process. I'll issue the receipt when done.", vi: "Xin điền đơn này, em làm thủ tục. Xong em sẽ xuất biên nhận." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "您好, 我钱包被偷了, 想报案。", pinyin: "Nín hǎo, wǒ qiánbāo bèi tōu le, xiǎng bào'àn.", english: "Hello, my wallet was stolen, want to file a report.", vi: "Chào anh, ví em bị trộm, em muốn trình báo." },
      { speaker: "民警", chinese: "您好, 请坐。先把护照给我登记一下。", pinyin: "Nín hǎo, qǐng zuò. Xiān bǎ hùzhào gěi wǒ dēngjì yīxià.", english: "Hello, please sit. Hand me your passport for registration.", vi: "Chào anh, mời ngồi. Trước hết đưa hộ chiếu em đăng ký." },
      { speaker: "阮", chinese: "好的, 这是我的护照。", pinyin: "Hǎo de, zhè shì wǒ de hùzhào.", english: "Sure, here's my passport.", vi: "Vâng, đây là hộ chiếu của em." },
      { speaker: "民警", chinese: "您是越南国籍, 来旅游的吗?", pinyin: "Nín shì Yuènán guójí, lái lǚyóu de ma?", english: "Vietnamese national, here for tourism?", vi: "Anh quốc tịch Việt Nam, đến du lịch à?" },
      { speaker: "阮", chinese: "出差, 待一周。", pinyin: "Chū chāi, dāi yī zhōu.", english: "Business trip, one week.", vi: "Đi công tác, ở một tuần." },
      { speaker: "民警", chinese: "什么时候发现钱包不见的?", pinyin: "Shénme shíhou fāxiàn qiánbāo bù jiàn de?", english: "When did you notice the wallet missing?", vi: "Khi nào em phát hiện ví không còn?" },
      { speaker: "阮", chinese: "今天上午十一点左右, 我在王府井大街购物, 想付钱时摸口袋发现钱包不见了。", pinyin: "Jīntiān shàngwǔ shíyī diǎn zuǒyòu, wǒ zài Wángfǔjǐng dàjiē gòuwù, xiǎng fùqián shí mō kǒudài fāxiàn qiánbāo bù jiàn le.", english: "Around 11 AM today, shopping on Wangfujing Street — when I went to pay, felt my pocket and the wallet was gone.", vi: "Khoảng 11 giờ sáng nay, em mua sắm ở phố Vương Phủ Tỉnh, khi định trả tiền sờ túi thì ví không còn." },
      { speaker: "民警", chinese: "钱包是放在哪个口袋的?", pinyin: "Qiánbāo shì fàng zài nǎ gè kǒudài de?", english: "Which pocket was the wallet in?", vi: "Ví em để ở túi nào?" },
      { speaker: "阮", chinese: "外套右边的口袋。早上吃早饭时还在, 因为我付过钱。", pinyin: "Wàitào yòubiān de kǒudài. Zǎoshang chī zǎofàn shí hái zài, yīnwèi wǒ fù guò qián.", english: "Right outer pocket of jacket. Was there at breakfast — I paid with it then.", vi: "Túi bên phải của áo khoác. Sáng ăn sáng vẫn còn, vì em đã dùng để trả tiền." },
      { speaker: "民警", chinese: "里面有什么物品和现金?", pinyin: "Lǐmiàn yǒu shénme wùpǐn hé xiànjīn?", english: "What items and cash were inside?", vi: "Trong đó có vật phẩm gì và tiền mặt bao nhiêu?" },
      { speaker: "阮", chinese: "现金大概两千人民币, 还有一张越南信用卡 (Sacombank Visa), 一张身份证复印件, 和几张名片。", pinyin: "Xiànjīn dàgài liǎngqiān rénmínbì, hái yǒu yī zhāng Yuènán xìnyòngkǎ (Sacombank Visa), yī zhāng shēnfènzhèng fùyìnjiàn, hé jǐ zhāng míngpiàn.", english: "About 2,000 RMB cash, one Vietnamese credit card (Sacombank Visa), an ID photocopy, and a few business cards.", vi: "Tiền mặt khoảng 2,000 nhân dân tệ, một thẻ tín dụng Việt Nam (Sacombank Visa), một bản sao CMND, và vài danh thiếp." },
      { speaker: "民警", chinese: "信用卡挂失了吗?", pinyin: "Xìnyòngkǎ guàshī le ma?", english: "Have you reported the card frozen?", vi: "Thẻ tín dụng đã báo khóa chưa?" },
      { speaker: "阮", chinese: "挂失了, 一发现就立刻打电话给银行。还没有异常消费。", pinyin: "Guàshī le, yī fāxiàn jiù lìkè dǎ diànhuà gěi yínháng. Hái méiyǒu yìcháng xiāofèi.", english: "Yes, called the bank immediately when I noticed. No suspicious charges yet.", vi: "Đã báo, em gọi ngay khi phát hiện. Chưa có giao dịch lạ." },
      { speaker: "民警", chinese: "好。请填这张报案登记表, 把刚才的信息再写一遍。然后我给您出报案回执。", pinyin: "Hǎo. Qǐng tián zhè zhāng bào'àn dēngjì biǎo, bǎ gāngcái de xìnxī zài xiě yī biàn. Ránhòu wǒ gěi nín chū bào'àn huízhí.", english: "Good. Fill this report registration form, rewrite the info. Then I'll issue the police report receipt.", vi: "Được. Xin điền đơn đăng ký trình báo này, viết lại các thông tin vừa rồi. Sau đó em sẽ xuất biên nhận." },
      { speaker: "阮", chinese: "请问回执上有什么内容? 我要交越南的旅游保险公司。", pinyin: "Qǐngwèn huízhí shàng yǒu shénme nèiróng? Wǒ yào jiāo Yuènán de lǚyóu bǎoxiǎn gōngsī.", english: "What's on the receipt? I'll submit to my Vietnamese travel insurance company.", vi: "Cho em hỏi trong biên nhận có nội dung gì? Em phải nộp công ty bảo hiểm du lịch Việt Nam." },
      { speaker: "民警", chinese: "回执上有报案编号、报案时间、被盗物品清单、报案地点和我的章。这是中国警方的正规凭证, 越南保险公司应该认可。", pinyin: "Huízhí shàng yǒu bào'àn biānhào, bào'àn shíjiān, bèi dào wùpǐn qīngdān, bào'àn dìdiǎn hé wǒ de zhāng. Zhè shì Zhōngguó jǐngfāng de zhèngguī píngzhèng, Yuènán bǎoxiǎn gōngsī yīnggāi rènkě.", english: "Receipt has report number, time, list of stolen items, location, and my official stamp. This is an official Chinese document — Vietnamese insurance should accept it.", vi: "Biên nhận có mã hồ sơ, thời gian báo, danh mục đồ bị mất, địa điểm và con dấu của em. Đây là chứng từ chính quy của công an Trung Quốc, công ty bảo hiểm Việt Nam nên chấp nhận." },
      { speaker: "阮", chinese: "如果保险公司需要更多信息, 能给您打电话核实吗?", pinyin: "Rúguǒ bǎoxiǎn gōngsī xūyào gèng duō xìnxī, néng gěi nín dǎ diànhuà héshí ma?", english: "If insurance needs more info, can they call you to verify?", vi: "Nếu công ty bảo hiểm cần thêm thông tin, có thể gọi anh xác nhận không?" },
      { speaker: "民警", chinese: "可以, 派出所的电话在回执上印着。如果他们需要英文翻译, 可以让他们直接联系您本国的领事馆。", pinyin: "Kěyǐ, pàichūsuǒ de diànhuà zài huízhí shàng yìn zhe. Rúguǒ tāmen xūyào yīngwén fānyì, kěyǐ ràng tāmen zhíjiē liánxì nín běnguó de lǐngshìguǎn.", english: "Yes, station phone is printed on receipt. If they need English translation, they can contact your country's consulate.", vi: "Được, số ĐT của đồn in trên biên nhận. Nếu họ cần dịch tiếng Anh, có thể liên hệ thẳng lãnh sự quán Việt Nam." },
      { speaker: "阮", chinese: "明白了, 谢谢您的帮助。", pinyin: "Míngbái le, xièxie nín de bāngzhù.", english: "Understood, thank you.", vi: "Em hiểu rồi, cảm ơn anh đã giúp." },
      { speaker: "民警", chinese: "不客气。出门在外注意保管好财物, 钱包尽量分开放在不同口袋, 别都放一起。", pinyin: "Bù kèqì. Chū mén zài wài zhùyì bǎoguǎn hǎo cáiwù, qiánbāo jǐnliàng fēnkāi fàng zài bùtóng kǒudài, bié dōu fàng yīqǐ.", english: "You're welcome. When traveling, keep valuables safe — split items into different pockets, don't keep everything together.", vi: "Không có gì. Đi xa chú ý bảo quản tài sản, ví nên chia ra các túi khác nhau, đừng để tất cả một chỗ." }
    ],
    roleplay_prompts: [
      "Bạn bị mất túi xách (không phải bị trộm — bạn quên trong taxi). Hãy báo công an và xin biên nhận. Lưu ý: 'mất' (丢失) khác 'bị trộm' (被偷) — chọn từ chính xác. Cụm '我把包忘在出租车上了'.",
      "Công an hỏi 'bạn có nhớ số xe taxi không?'. Bạn không nhớ — nhưng có biên nhận DiDi/taxi qua app. Hãy mở app + đọc số chuyến + đọc tên tài xế cho công an. Đề nghị họ liên hệ với DiDi để tìm tài xế.",
      "Sau khi báo, công an gọi lại 1 ngày sau nói 'tài xế tìm thấy ví, đến đồn lấy'. Hãy đến + xác nhận đồ + ký giấy nhận lại + cảm ơn công an + xin gặp tài xế để cảm ơn (有时候民警会安排) + tip nhỏ cho tài xế."
    ],
    register_notes: "Báo công an khu vực (派出所 — pàichūsuǒ) ở Trung Quốc là quy trình chuẩn, KHÔNG có gì đáng sợ cho khách du lịch khi báo mất đồ. Bạn dùng 您 với cán bộ công an (民警 — mínjǐng).\n\nNguyên tắc tone:\n- Trình bày SỰ KIỆN khách quan: khi nào, ở đâu, làm gì\n- KHÔNG đoán/buộc tội cụ thể (\"chắc chắn nhân viên A lấy\")\n- Mô tả đồ MẤT chi tiết: loại, số tiền, đặc điểm nhận diện\n- Yêu cầu CHỨNG TỪ rõ: '请出报案回执' / '请给我一份回执'\n\nPhân biệt từ vựng:\n- 丢失 (diūshī) = bị mất (do quên/rơi) — không có người gây ra\n- 被偷 (bèi tōu) = bị trộm (có người trộm) — passive, có thủ phạm\n- 抢劫 (qiǎngjié) = bị cướp (dùng vũ lực) — chỉ dùng khi thực sự bị cướp\n\nDùng đúng từ rất quan trọng — báo nhầm '抢劫' khi chỉ là móc túi sẽ kích hoạt quy trình cao hơn (cảnh sát hình sự, có thể giữ bạn lâu hơn).\n\nCác cụm chuẩn:\n- '我钱包被偷了' (ví em bị trộm)\n- '我X东西丢了' (em bị mất X — không có người gây)\n- '请出报案回执' (xin xuất biên nhận)\n- '回执是给保险公司的' (biên nhận là để cho công ty bảo hiểm)\n- '我已经挂失信用卡了' (em đã báo khóa thẻ rồi)\n\nTránh: (a) Chen vào quá nhiều cảm xúc — 'oh tôi quá đau khổ'; (b) Yêu cầu công an 'bắt thủ phạm' — cảnh sát có quy trình riêng; (c) Đăng status mạng xã hội ngay — kẻ trộm có thể theo dõi; (d) Đe dọa kiện — không hữu ích, có thể làm phức tạp.",
    idiom_glosses: [
      {
        idiom: "防不胜防",
        literal: "phòng không kịp phòng (fáng bù shèng fáng)",
        meaning: "Phòng không xuể — kẻ xấu khôn ngoan, dù cẩn thận cũng có thể bị. Cụm dùng để miêu tả tình huống bị móc túi tinh vi: '我已经很小心了, 但小偷防不胜防'.",
        example: "我已经很小心了, 但小偷防不胜防。"
      },
      {
        idiom: "小心驶得万年船",
        literal: "cẩn thận lái thuyền vạn năm (xiǎo xīn shǐ de wàn nián chuán)",
        meaning: "Cẩn thận thì tàu chạy được vạn năm — cẩn thận là biện pháp tốt nhất. Cụm khuyên cẩn thận trong tương lai: 'sau lần này, em sẽ 小心驶得万年船'.",
        example: "出门在外, 小心驶得万年船。"
      },
      {
        idiom: "破财消灾",
        literal: "phá của tan họa (pò cái xiāo zāi)",
        meaning: "Mất tiền tránh được tai họa — an ủi người vừa mất tiền. Cụm cán bộ/người dân dùng để xoa dịu: 'mất tiền chứ không bị thương, 破财消灾, được rồi'. Tránh tự dùng — sẽ bị coi là tự an ủi giả.",
        example: "幸好只丢了钱包, 没受伤, 破财消灾。"
      },
      {
        idiom: "失而复得",
        literal: "mất rồi tìm được (shī ér fù dé)",
        meaning: "Mất rồi tìm lại — vui mừng vì lấy lại được vật. Cụm dùng khi công an báo tìm được ví: '钱包失而复得, 太感谢了!'.",
        example: "钱包失而复得, 太感谢警察了。"
      }
    ],
    cultural_notes_vi: "派出所 (pàichūsuǒ) là đồn công an khu vực (cơ sở) — đơn vị nhỏ nhất trong hệ thống công an Trung Quốc. Mỗi quận/phường có 1-2 派出所. Đây là nơi xử lý: báo mất đồ, đăng ký tạm trú, làm hộ khẩu, hòa giải tranh chấp dân sự nhỏ. KHÔNG phải nơi xử lý hình sự nặng (việc đó của 公安局 — gōng'ānjú, cấp quận).\n\nBốn điều người Việt cần biết khi đến 派出所:\n\n(1) TÌM 派出所 GẦN NHẤT: Baidu Maps gõ '派出所' hoặc hỏi nhân viên khách sạn/lễ tân. Mở 24/7. Vào cửa, nói '我要报案' (em muốn trình báo). Nhân viên hướng dẫn quầy + lấy số.\n\n(2) GIẤY TỜ MANG: hộ chiếu (BẮT BUỘC), bản sao hộ chiếu (tốt), số visa, địa chỉ khách sạn. Nếu mất hộ chiếu, mang biên nhận của khách sạn (酒店登记单) — họ có copy hộ chiếu của bạn.\n\n(3) THỜI GIAN xử lý: báo mất ví/điện thoại = 30-60 phút từ khi vào đồn. Mất hộ chiếu = 1-2 giờ (cần thêm thông tin). Đông người vào cuối tuần — đến giờ làm việc thường (10-16h thứ 2-thứ 6) là nhanh nhất.\n\n(4) BIÊN NHẬN (报案回执 — bào'àn huízhí): bản giấy in dấu đỏ, có mã hồ sơ + thời gian + nội dung + tên cán bộ + số ĐT đồn. Quan trọng cho: bảo hiểm du lịch (claim), đại sứ quán (làm hộ chiếu mới nếu hộ chiếu mất), thẻ tín dụng (chứng minh không phải bạn dùng).\n\nVề ngôn ngữ tại đồn: cán bộ công an Trung Quốc đại lục PHẦN LỚN không nói tiếng Anh. Nếu bạn không thành thạo tiếng Trung: (a) gọi cán bộ tiếng Việt của đại sứ quán Việt Nam (010-65325410) để dịch qua điện thoại; (b) dùng app Google Translate offline (online thường không có VPN ở đại lục); (c) gọi trợ lý tiếng Trung từ khách sạn hoặc bạn Trung Quốc.\n\nVề tâm lý: KHÔNG sợ. Cán bộ công an phục vụ khách du lịch = công việc thường ngày của họ. Họ không có thẩm quyền/lý do gây khó cho bạn. Quy trình chuẩn, mất 30-60 phút, ra về với biên nhận. Đừng để câu chuyện 'cảnh sát Trung Quốc đáng sợ' từ phim ảnh ảnh hưởng — đó là hư cấu, không phải thực tế tại 派出所.\n\nVề tip/tiền: KHÔNG đưa tiền cho cán bộ công an. Đây là phạm pháp cả hai phía. Cảm ơn bằng lời + cúi đầu nhẹ + ra về là đủ.\n\nVề camera giám sát: CCTV phổ biến tại đồn. Đừng quay phim cán bộ — vi phạm quy định. Bạn có thể yêu cầu xem camera khu vực bị mất đồ (王府井 có CCTV mọi phố) — cán bộ sẽ giúp tra nếu mất đồ giá trị cao.\n\nVề mối liên hệ với bảo hiểm Việt Nam: Bảo Việt, Bảo Minh, MIC, BSH chấp nhận biên nhận từ 派出所 Trung Quốc. KHÔNG cần dịch tiếng Việt. Khi nộp về Việt Nam, kèm: (a) biên nhận gốc; (b) ảnh chụp biên nhận; (c) bản sao hộ chiếu; (d) chi tiết thiệt hại + chứng từ (nếu có hóa đơn mua đồ).",
    tip_advice_vi: "(1) PHÒNG TỪ TRƯỚC: chia tiền + thẻ + ID thành 2-3 nơi (ví, túi áo, xách tay, trong khách sạn). Không bao giờ để TẤT CẢ trong một ví. Mất 1 ví = mất 1 phần, không phải tất cả. (2) CHỤP ẢNH ID + THẺ + HỘ CHIẾU lưu cloud TRƯỚC khi đi. Mất bản gốc = vẫn có cách chứng minh danh tính. (3) GHI NHỚ SỐ HOTLINE QUAN TRỌNG: số khẩn cảnh sát 110 (báo trộm cướp), 122 (giao thông), 119 (cứu hỏa), 120 (cứu thương). Số ĐT đại sứ quán Việt Nam Bắc Kinh: 010-65325410. Lưu trong điện thoại + giấy backup. (4) BÁO TRỘM TRONG VÒNG 24 GIỜ: bảo hiểm du lịch yêu cầu báo công an trong 24 giờ kể từ khi mất. Quá hạn = từ chối claim. Đến đồn ngay sau khi: (a) xác nhận thực sự mất, (b) khóa thẻ tín dụng. (5) ĐẾN ĐỒN GẦN NHẤT, không phải đồn nơi mất. Cán bộ ở đồn nào cũng làm được biên nhận. Nếu bạn ở khách sạn, hỏi lễ tân hoặc Baidu Maps để tìm. (6) KHÓA THẺ TÍN DỤNG TRƯỚC KHI ĐẾN ĐỒN: gọi hotline 24/7 của ngân hàng Việt Nam (Vietcombank: 1900-545413, Sacombank: 1900-555588, etc.) — đa số đều có hotline quốc tế miễn phí qua app banking. Khóa thẻ TRƯỚC khi báo công an = khi cán bộ hỏi 'thẻ đã khóa chưa' bạn nói 'rồi'. (7) NẾU CẢM THẤY KHÔNG AN TOÀN: yêu cầu phiên dịch chính thức qua đại sứ quán Việt Nam — họ có dịch vụ này miễn phí. Gọi hotline lãnh sự Việt Nam: 010-65325410 (Bắc Kinh) hoặc 021-62288811 (Thượng Hải). Nói rõ: 'em đang ở đồn công an X, muốn xin phiên dịch tiếng Việt'. Họ sẽ điều phối hoặc cung cấp dịch viên qua điện thoại.",
    exercises: [
      { type: "fill-blank", question: "您好, 我的钱包 ___ 了, 想报案。", answer: "被偷" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung báo công an với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "派出所", pinyin: "pài chū suǒ", english: "đồn công an khu vực" },
          { chinese: "报案回执", pinyin: "bào àn huí zhí", english: "biên nhận trình báo" },
          { chinese: "挂失", pinyin: "guà shī", english: "báo mất / khóa thẻ" },
          { chinese: "理赔", pinyin: "lǐ péi", english: "yêu cầu bồi thường" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em chào anh, ví của em bị trộm, em muốn trình báo. Phiền anh xuất biên nhận, em phải nộp công ty bảo hiểm.",
        chinese: "您好, 我的钱包被偷了, 想报案。麻烦您出一份报案回执, 我要交保险公司。",
        pinyin: "Nín hǎo, wǒ de qián bāo bèi tōu le, xiǎng bào àn. Má fan nín chū yī fèn bào àn huí zhí, wǒ yào jiāo bǎo xiǎn gōng sī."
      }
    ]
  },
  {
    id: 79,
    level: "B2",
    category: "travel_mobility",
    title: "问路 — 正式 (您) 与非正式 (你)",
    pinyin: "wèn lù — zhèng shì (nín) yǔ fēi zhèng shì (nǐ)",
    topic: "Asking directions — formal (您) vs informal (你)",
    title_vi: "Hỏi đường — formal (您) và informal (你)",
    title_en: "Asking directions — formal (您) vs informal (你)",
    sentences: [
      {
        chinese: "您好, 请问故宫怎么走?",
        pinyin: "Nín hǎo, qǐngwèn Gùgōng zěnme zǒu?",
        english: "Hello (formal), how do I get to the Forbidden City?",
        vi: "Em chào anh/chị, cho em hỏi đến Cố Cung đi thế nào?",
        pronunciation_focus: ["您好 → nín hǎo (formal)", "请问 → qǐngwèn (xin hỏi formal)", "怎么走 → zěnme zǒu (đi thế nào)", "故宫 → Gùgōng (Cố Cung)"]
      },
      {
        chinese: "嗨, 你知道这个地铁站在哪里吗?",
        pinyin: "Hāi, nǐ zhīdào zhège dìtiě zhàn zài nǎlǐ ma?",
        english: "Hey (informal), do you know where this metro station is?",
        vi: "Ê, bạn có biết ga tàu điện ngầm này ở đâu không?",
        pronunciation_focus: ["嗨 → hāi (informal hello)", "你知道 → nǐ zhīdào (informal you)", "地铁站 → dìtiě zhàn (ga tàu điện ngầm)", "在哪里 → zài nǎlǐ"]
      },
      {
        chinese: "往前走两百米, 然后右转就到了。",
        pinyin: "Wǎng qián zǒu liǎngbǎi mǐ, ránhòu yòu zhuǎn jiù dào le.",
        english: "Go forward 200 meters, then turn right — you'll be there.",
        vi: "Đi thẳng 200 mét, sau đó rẽ phải là đến.",
        pronunciation_focus: ["往前走 → wǎng qián zǒu (đi thẳng)", "两百米 → liǎngbǎi mǐ (200 mét)", "右转 → yòu zhuǎn (rẽ phải)", "然后 → ránhòu"]
      },
      {
        chinese: "在十字路口左转, 看到一家肯德基就到了。",
        pinyin: "Zài shízì lùkǒu zuǒ zhuǎn, kàn dào yī jiā Kěndéjī jiù dào le.",
        english: "Turn left at the intersection — when you see a KFC, you're there.",
        vi: "Đến ngã tư rẽ trái, thấy KFC là đến.",
        pronunciation_focus: ["十字路口 → shízì lùkǒu (ngã tư)", "左转 → zuǒ zhuǎn (rẽ trái)", "肯德基 → Kěndéjī (KFC)", "就到了 → jiù dào le (là đến)"]
      },
      {
        chinese: "走路的话大概十五分钟, 打车五块钱。",
        pinyin: "Zǒulù de huà dàgài shíwǔ fēnzhōng, dǎchē wǔ kuài qián.",
        english: "Walking takes about 15 minutes, taxi is 5 RMB.",
        vi: "Đi bộ khoảng 15 phút, đi taxi 5 tệ.",
        pronunciation_focus: ["走路 → zǒulù (đi bộ)", "十五分钟 → shíwǔ fēnzhōng (15 phút)", "打车 → dǎchē (đi taxi)", "五块钱 → wǔ kuài qián (5 tệ)"]
      }
    ],
    vocab: [
      { chinese: "请问", pinyin: "qǐng wèn", english: "may I ask (formal)", vi: "cho em hỏi" },
      { chinese: "怎么走", pinyin: "zěn me zǒu", english: "how to get there", vi: "đi thế nào" },
      { chinese: "往前", pinyin: "wǎng qián", english: "forward / straight", vi: "thẳng" },
      { chinese: "右转", pinyin: "yòu zhuǎn", english: "turn right", vi: "rẽ phải" },
      { chinese: "左转", pinyin: "zuǒ zhuǎn", english: "turn left", vi: "rẽ trái" },
      { chinese: "十字路口", pinyin: "shí zì lù kǒu", english: "intersection", vi: "ngã tư" },
      { chinese: "红绿灯", pinyin: "hóng lǜ dēng", english: "traffic light", vi: "đèn giao thông" },
      { chinese: "地铁", pinyin: "dì tiě", english: "subway", vi: "tàu điện ngầm" },
      { chinese: "公交车", pinyin: "gōng jiāo chē", english: "public bus", vi: "xe buýt" },
      { chinese: "出口", pinyin: "chū kǒu", english: "exit", vi: "lối ra" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "您好, 请问王府井大街怎么走?", pinyin: "Nín hǎo, qǐngwèn Wángfǔjǐng dàjiē zěnme zǒu?", english: "Hello, how do I get to Wangfujing Street?", vi: "Em chào anh/chị, đến phố Vương Phủ Tỉnh đi thế nào?" },
      { speaker: "路人", chinese: "往前走, 第二个十字路口右转, 走五百米就到了。", pinyin: "Wǎng qián zǒu, dì èr gè shízì lùkǒu yòu zhuǎn, zǒu wǔbǎi mǐ jiù dào le.", english: "Go forward, second intersection turn right, walk 500 meters.", vi: "Đi thẳng, ngã tư thứ hai rẽ phải, đi 500 mét là đến." },
      { speaker: "阮", chinese: "走路远不远?", pinyin: "Zǒulù yuǎn bù yuǎn?", english: "Far on foot?", vi: "Đi bộ có xa không?" },
      { speaker: "路人", chinese: "不远, 大概十分钟。", pinyin: "Bù yuǎn, dàgài shí fēnzhōng.", english: "Not far, about 10 minutes.", vi: "Không xa, khoảng 10 phút." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "您好, 请问北京站怎么走?", pinyin: "Nín hǎo, qǐngwèn Běijīng zhàn zěnme zǒu?", english: "Hello (formal), how do I get to Beijing station?", vi: "Em chào bác, cho em hỏi ga Bắc Kinh đi thế nào?" },
      { speaker: "老人", chinese: "您是要坐火车吗?", pinyin: "Nín shì yào zuò huǒchē ma?", english: "Are you taking the train?", vi: "Anh đi tàu hỏa à?" },
      { speaker: "阮", chinese: "对, 高铁去上海。", pinyin: "Duì, gāotiě qù Shànghǎi.", english: "Yes, high-speed rail to Shanghai.", vi: "Vâng, tàu cao tốc đi Thượng Hải." },
      { speaker: "老人", chinese: "高铁要去北京南站, 不是北京站。地铁四号线、十四号线都到。从这里走过去要四十分钟, 太远了, 您坐地铁吧。", pinyin: "Gāotiě yào qù Běijīng nán zhàn, bù shì Běijīng zhàn. Dìtiě sì hào xiàn, shísì hào xiàn dōu dào. Cóng zhèlǐ zǒu guòqù yào sìshí fēnzhōng, tài yuǎn le, nín zuò dìtiě ba.", english: "High-speed rail goes from Beijing South, not Beijing station. Subway lines 4 or 14 reach there. From here it's 40 min walk — too far, take the subway.", vi: "Tàu cao tốc phải đến ga Bắc Kinh Nam, không phải ga Bắc Kinh. Tuyến 4 hoặc 14 tàu điện ngầm đều đến. Từ đây đi bộ 40 phút, xa quá, anh đi tàu điện ngầm đi." },
      { speaker: "阮", chinese: "原来不是同一个站, 谢谢您提醒! 最近的地铁站在哪?", pinyin: "Yuánlái bù shì tóng yī gè zhàn, xièxie nín tíxǐng! Zuìjìn de dìtiě zhàn zài nǎ?", english: "Oh they're different stations, thanks for the heads up! Where's the nearest subway?", vi: "Hóa ra không phải cùng ga, cảm ơn bác đã nhắc! Ga tàu điện ngầm gần nhất ở đâu?" },
      { speaker: "老人", chinese: "往前走两百米, 在十字路口右转, 走一百米就看到地铁标志, 那是建国门站, 一号线, 转十号线就能到北京南站。", pinyin: "Wǎng qián zǒu liǎngbǎi mǐ, zài shízì lùkǒu yòu zhuǎn, zǒu yībǎi mǐ jiù kàn dào dìtiě biāozhì, nà shì Jiànguómén zhàn, yī hào xiàn, zhuǎn shí hào xiàn jiù néng dào Běijīng nán zhàn.", english: "Go forward 200m, turn right at intersection, 100m more you'll see subway sign — Jianguomen station, line 1, transfer to line 10 to Beijing South.", vi: "Đi thẳng 200 mét, đến ngã tư rẽ phải, đi tiếp 100 mét sẽ thấy biển tàu điện ngầm — ga Kiến Quốc Môn, tuyến 1, chuyển tuyến 10 là đến ga Bắc Kinh Nam." },
      { speaker: "阮", chinese: "太详细了, 太感谢您了!", pinyin: "Tài xiángxì le, tài gǎnxiè nín le!", english: "So detailed, thank you so much!", vi: "Quá chi tiết, em cảm ơn bác nhiều!" },
      { speaker: "老人", chinese: "不客气, 路上小心。", pinyin: "Bù kèqì, lùshàng xiǎoxīn.", english: "You're welcome, be careful on the way.", vi: "Không có gì, đi đường cẩn thận." },
      { speaker: "阮", chinese: "嗨, 你好, 你知道建国门地铁站怎么走吗?", pinyin: "Hāi, nǐ hǎo, nǐ zhīdào Jiànguómén dìtiě zhàn zěnme zǒu ma?", english: "Hey, hi, know how to get to Jianguomen station?", vi: "Ê, chào bạn, bạn có biết đi ga Kiến Quốc Môn thế nào không?" },
      { speaker: "年轻人", chinese: "知道啊, 就在前面右转, 走两分钟。", pinyin: "Zhīdào a, jiù zài qiánmiàn yòu zhuǎn, zǒu liǎng fēnzhōng.", english: "Yeah, just turn right ahead, 2 min walk.", vi: "Biết chứ, ngay phía trước rẽ phải, đi 2 phút." },
      { speaker: "阮", chinese: "好的, 谢了!", pinyin: "Hǎo de, xiè le!", english: "Got it, thanks!", vi: "Được, cảm ơn!" },
      { speaker: "年轻人", chinese: "你是越南人?口音听得出来。", pinyin: "Nǐ shì Yuènán rén? Kǒuyīn tīng de chū lái.", english: "Vietnamese? I can hear the accent.", vi: "Bạn là người Việt à? Giọng nghe được." },
      { speaker: "阮", chinese: "对啊, 你好厉害, 一下就听出来了!", pinyin: "Duì a, nǐ hǎo lìhai, yīxià jiù tīng chūlái le!", english: "Yeah, you're sharp — caught it right away!", vi: "Đúng rồi, bạn giỏi quá, nghe ra ngay!" },
      { speaker: "年轻人", chinese: "我大学有越南同学。你在北京玩还是工作?", pinyin: "Wǒ dàxué yǒu Yuènán tóngxué. Nǐ zài Běijīng wán háishi gōngzuò?", english: "I had Vietnamese classmates in college. You travelling or working in Beijing?", vi: "Đại học mình có bạn người Việt. Bạn đến Bắc Kinh chơi hay làm việc?" },
      { speaker: "阮", chinese: "出差, 待几天。你呢?", pinyin: "Chū chāi, dāi jǐ tiān. Nǐ ne?", english: "Business, few days. You?", vi: "Đi công tác, ở vài ngày. Bạn thì sao?" },
      { speaker: "年轻人", chinese: "我在这边工作。微信加一下吧, 万一你需要帮忙。", pinyin: "Wǒ zài zhè biān gōngzuò. Wēixìn jiā yīxià ba, wànyī nǐ xūyào bāngmáng.", english: "I work around here. Let's add WeChat in case you need help.", vi: "Mình làm việc ở đây. Kết bạn WeChat đi, lỡ bạn cần giúp." },
      { speaker: "阮", chinese: "好啊, 太感谢了!", pinyin: "Hǎo a, tài gǎnxiè le!", english: "Sure, thanks a lot!", vi: "Được, cảm ơn nhiều!" }
    ],
    roleplay_prompts: [
      "Bạn cần hỏi đường đến bệnh viện gần nhất. Đường lớn, nhiều người. Hãy chọn người có vẻ ngoài sống lâu trong khu vực (cô bán hàng, bác bảo vệ — người trẻ với điện thoại có thể không biết). Dùng formal '您'. Mở đầu '不好意思打扰您一下'.",
      "Bạn lạc trên núi (Núi Hương Sơn, Núi Vũ Đang) khi leo bộ. Gặp đoàn leo trẻ tuổi. Hãy hỏi đường về ga cáp treo bằng tone informal '你' — tạo không khí thân thiện. Hỏi luôn xem họ có app bản đồ offline không (高德/Baidu Maps).",
      "Bạn đến quán cà phê gặp đối tác business nhưng quán nằm trong hẻm phức tạp. Gọi đối tác qua WeChat call hỏi đường. Đối tác = ngang cấp, công việc = formal nhẹ. Dùng cụm '不好意思, 我有点找不到地方' (xin lỗi em hơi không tìm thấy chỗ)."
    ],
    register_notes: "Hỏi đường ở Trung Quốc là cơ hội thực hành register quan trọng nhất. Quy tắc:\n\n您 (formal) — DÙNG khi:\n- Người lớn tuổi (≥35-40 tuổi)\n- Bảo vệ, nhân viên, công an, lái xe\n- Người mặc đồng phục\n- Người có vẻ ngoài uy tín (vest, già)\n- Khi không chắc tuổi đối phương\n\n你 (informal) — DÙNG khi:\n- Người trẻ rõ ràng (sinh viên, dưới 30)\n- Bạn bè/đồng nghiệp ngang cấp\n- Trẻ em\n- Trên app/online (kể cả với người lớn tuổi không gặp mặt)\n\nMở đầu chuẩn:\n- Formal: '您好, 请问...怎么走?' / '不好意思打扰您一下, 请问...'\n- Informal: '嗨' / '你好, 请问...' / '不好意思, 你知道...吗?'\n\nCảm ơn:\n- Formal: '太感谢您了' / '谢谢您'\n- Informal: '谢了' / '好的, 谢谢' / '太感谢了'\n\nTỪ KHÓA HƯỚNG dẫn:\n- 往前走 (đi thẳng) / 往左走 (đi trái) / 往右走 (đi phải)\n- 第一个/第二个十字路口 (ngã tư thứ 1/2)\n- 红绿灯 (đèn giao thông) — landmark phổ biến\n- X米 (X mét) / X分钟 (X phút)\n- 走路 (đi bộ) / 打车 (taxi) / 坐地铁 (tàu ngầm) / 坐公交 (xe buýt)\n- 看到X就到了 (thấy X là đến) — landmark cuối\n\nKhi không hiểu: '不好意思, 您能再说一遍吗?' (xin lỗi, anh/chị nói lại được không?). KHÔNG gật đầu giả vờ hiểu — sẽ đi sai đường.\n\nTránh: (a) Hỏi quá nhiều người liên tiếp — chọn 1 người tin cậy; (b) Hỏi khi đang lạc xa — quay lại điểm gần nhất biết; (c) Tin Google Maps/Waze 100% tại Trung Quốc — bị block, dùng Baidu Maps (百度地图) hoặc 高德地图 (Gaode Maps) thay thế.\n\nCẤU TRÚC DIALOGUE_LONG: dialogue_long bài này gồm hai phân cảnh nối tiếp nhau, cố ý đối chiếu hai register. Phân cảnh 1 (8 lượt đầu) — hỏi đường người lớn tuổi, dùng FORMAL: 您好, 请问, 太感谢您了. Phân cảnh 2 (7 lượt sau) — hỏi đường người trẻ ngang cấp, dùng INFORMAL: 嗨, 你好, 谢了. Khi đọc, chú ý điểm chuyển register ở khoảng giữa — đó là kỹ năng B2 cốt lõi của bài này.",
    idiom_glosses: [
      {
        idiom: "明察秋毫",
        literal: "minh sát thu hào (míng chá qiū háo)",
        meaning: "Quan sát rõ từng sợi lông mùa thu — quan sát tinh tường, nhận xét chính xác. Cụm khen người chỉ đường giỏi, biết landmark cụ thể: 'cô ấy 明察秋毫, chỉ đường rất chi tiết'.",
        example: "这位大爷明察秋毫, 把路线说得清清楚楚。"
      },
      {
        idiom: "迷路",
        literal: "mê lộ (mí lù)",
        meaning: "Lạc đường — khái niệm cơ bản. KHÔNG phải idiom 4 chữ nhưng cần biết. Dùng: '我迷路了, 请问...'.",
        example: "我迷路了, 请问最近的地铁站在哪?"
      },
      {
        idiom: "条条大路通罗马",
        literal: "muôn đường đến La Mã (tiáo tiáo dà lù tōng Luó Mǎ)",
        meaning: "Mọi con đường đều đến La Mã — nhiều cách đến cùng đích. Cụm dùng để nói có nhiều phương án di chuyển: 'đến chỗ đó có 3 cách, 条条大路通罗马'. Đùa nhẹ với người chỉ đường thân thiện.",
        example: "去王府井有好多路, 条条大路通罗马。"
      },
      {
        idiom: "举手之劳",
        literal: "việc của một cánh tay (jǔ shǒu zhī láo)",
        meaning: "Việc rất nhỏ — không đáng cảm ơn. Cụm người chỉ đường dùng để khiêm tốn từ chối lời cảm ơn của bạn: '没什么, 举手之劳'. Đáp lại '太谢谢您了' của bạn.",
        example: "不用谢, 举手之劳而已。"
      }
    ],
    cultural_notes_vi: "Hỏi đường ở Trung Quốc là một trong những hành động thân thiện nhất. Người Trung Quốc thường rất nhiệt tình giúp đỡ người lạ — nhiều khi họ dẫn bạn đến tận nơi thay vì chỉ giải thích.\n\nNăm điều người Việt cần biết:\n\n(1) NGƯỜI HÀ NỘI/HỒ CHÍ MINH có thể quen chỉ đường ngắn gọn ('đi thẳng, rẽ phải, đến nhà cao'). Người Trung Quốc thường chỉ CHI TIẾT HƠN — kèm landmark, số mét, thời gian. Đừng cảm thấy bị 'over-helped' — đó là phong cách thân thiện chuẩn.\n\n(2) CHỌN NGƯỜI HỎI: bảo vệ tòa nhà (保安) > nhân viên cửa hàng (店员) > người trung niên đi bộ > người trẻ với điện thoại > tài xế xe đạp/xe máy đang chạy. Tránh: người mặc đồng phục công an (họ bận, có quy trình) trừ khi thực sự cần.\n\n(3) NGÔN NGỮ: nếu ở thành phố lớn (Bắc Kinh, Thượng Hải, Quảng Châu, Thâm Quyến, Hàng Châu), người trẻ nói tiếng Anh cơ bản. Người trung niên + ở thành phố nhỏ = chỉ tiếng Trung. Học 10 cụm cứng + dùng Baidu Maps để showing tên địa điểm bằng hanzi.\n\n(4) APP BẢN ĐỒ: tại đại lục, Google Maps bị BLOCK. Baidu Maps (百度地图) và Gaode Maps (高德地图) là hai app chính. TẢI TRƯỚC khi đến Trung Quốc — App Store ở đại lục có thể không cho download Google products. Cài tiếng Anh ở Settings để dễ dùng.\n\n(5) TÊN ĐỊA ĐIỂM bằng PINYIN có thể không được hiểu rõ. Ví dụ: 'Wangfujing' nói chậm có thể được hiểu, nhưng 'Tiananmen' phát âm sai (không có '天安门') = người Trung không nhận ra. Tốt nhất: dùng app translate cho đối phương xem hanzi, hoặc thuộc tone marks chính xác.\n\nVề an toàn: Trung Quốc đại lục thành phố lớn AN TOÀN cho khách du lịch. CCTV phổ biến, đường lớn đèn sáng. Đi bộ ban đêm (đến 23h) ở Bắc Kinh/Thượng Hải = OK. Sau 1h sáng, đi taxi/DiDi an toàn hơn.\n\nVề con số đường: 米 (mét) là đơn vị chính. 'Một nửa cây số' = '500米', không '0.5公里'. Chỉ đường: '一直走' (đi thẳng), '往北/南/东/西' (về Bắc/Nam/Đông/Tây — người TQ rất giỏi định hướng theo phương) hoặc '往那边走' kèm tay chỉ.\n\nVề help-and-receive: nếu ai đó dẫn bạn 5-10 phút đến tận nơi, đề nghị tip nhỏ (10-20 tệ) cho 'time'. Họ sẽ thường từ chối — chấp nhận 1-2 lần từ chối là chân thành. Nếu họ thực sự lấy = giúp họ tiền cà phê. Nếu họ thực sự từ chối = cảm ơn lớn + ghi nhớ. Người Trung Quốc đại lục KHÔNG có văn hóa tip mạnh như phương Tây.",
    tip_advice_vi: "(1) TẢI BAIDU MAPS hoặc GAODE MAPS trước khi đi Trung Quốc. Cả hai có offline mode — tải bản đồ thành phố bạn sẽ đến (Bắc Kinh, Thượng Hải) ~500MB mỗi cái. Không cần VPN/internet để xem đường. (2) HỌC THUỘC 10 cụm chỉ đường: 怎么走, 往前走, 左/右转, 十字路口, 红绿灯, 走路, 打车, 地铁, 公交, 米/分钟. Đủ cho 90% tình huống. (3) KHI HỎI, dùng cấu trúc 4 phần: chào (您好) + xin lỗi (打扰一下) + xin hỏi (请问) + đích đến cụ thể (X怎么走?). Người Trung sẽ trả lời rõ ràng và đầy đủ. (4) CHỤP ẢNH BIỂN HIỆU lưu vào điện thoại — Hanzi của khách sạn, văn phòng, nhà hàng. Khi lạc, đưa biển hiệu cho người chỉ đường > đọc tên bằng pinyin. Ảnh = chính xác 100%. (5) DÙNG WECHAT TRANSLATE: trong WeChat có chức năng dịch nhắn tin. Người Trung gõ tiếng Trung, bạn xem dịch tiếng Anh/Việt. Dùng khi không chắc về cụm dài. (6) TIP DI CHUYỂN: tàu điện ngầm Bắc Kinh/Thượng Hải/Quảng Châu = 3-7 tệ/lần, có WeChat/Alipay payment. KHÔNG cần xếp hàng mua thẻ — quẹt mã QR ở cửa. Bus = 1-2 tệ. Taxi = 14 tệ khởi điểm + 2.3/km. DiDi (滴滴) = app gọi xe, có English mode. (7) NẾU LẠC NGHIÊM TRỌNG: đến cảnh sát giao thông (交警), bảo vệ tòa nhà (保安), hoặc cửa hàng tiện lợi (便利店 — 7-Eleven, FamilyMart, Lawson). Nhân viên thường nói tiếng Anh cơ bản và quen giúp người lạ. KHÔNG dừng giữa đường lớn — di chuyển vào lề/vỉa hè trước khi mở app/hỏi.",
    exercises: [
      { type: "fill-blank", question: "您好, ___ 故宫怎么走?", answer: "请问" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung chỉ đường với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "往前走", pinyin: "wǎng qián zǒu", english: "đi thẳng" },
          { chinese: "右转", pinyin: "yòu zhuǎn", english: "rẽ phải" },
          { chinese: "十字路口", pinyin: "shí zì lù kǒu", english: "ngã tư" },
          { chinese: "地铁", pinyin: "dì tiě", english: "tàu điện ngầm" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Em chào bác, cho em hỏi đến ga Bắc Kinh Nam đi thế nào? Đi bộ có xa không?",
        chinese: "您好, 请问北京南站怎么走? 走路远不远?",
        pinyin: "Nín hǎo, qǐng wèn Běi jīng nán zhàn zěn me zǒu? Zǒu lù yuǎn bù yuǎn?"
      }
    ]
  },
  {
    id: 80,
    level: "B2",
    category: "travel_mobility",
    title: "餐厅投诉 — 上错菜, 账单错误",
    pinyin: "cān tīng tóu sù — shàng cuò cài, zhàng dān cuò wù",
    topic: "Restaurant complaint — wrong order, billing error",
    title_vi: "Khiếu nại nhà hàng — sai món, sai hóa đơn",
    title_en: "Restaurant complaint — wrong order, billing error",
    sentences: [
      {
        chinese: "您好, 这道菜不是我点的, 我点的是宫保鸡丁。",
        pinyin: "Nín hǎo, zhè dào cài bù shì wǒ diǎn de, wǒ diǎn de shì gōngbǎo jīdīng.",
        english: "Hello, this isn't what I ordered — I ordered Kung Pao Chicken.",
        vi: "Em chào anh/chị, món này không phải món em gọi, em gọi gà Kung Pao.",
        pronunciation_focus: ["这道菜 → zhè dào cài (món này)", "点 → diǎn (gọi món)", "宫保鸡丁 → gōngbǎo jīdīng (Kung Pao gà)", "不是 → bù shì"]
      },
      {
        chinese: "麻烦您帮我换一下, 这个我没点。",
        pinyin: "Máfan nín bāng wǒ huàn yīxià, zhège wǒ méi diǎn.",
        english: "Please change it for me — I didn't order this.",
        vi: "Phiền anh/chị đổi cho em, cái này em không gọi.",
        pronunciation_focus: ["换 → huàn (đổi)", "麻烦您 → máfan nín (formal request)", "没点 → méi diǎn (không gọi)", "帮我 → bāng wǒ"]
      },
      {
        chinese: "请问账单是不是算错了? 我没点这个酒。",
        pinyin: "Qǐngwèn zhàngdān shì bù shì suàn cuò le? Wǒ méi diǎn zhège jiǔ.",
        english: "Excuse me, is the bill miscalculated? I didn't order this drink.",
        vi: "Cho em hỏi hóa đơn có tính nhầm không? Em không gọi rượu này.",
        pronunciation_focus: ["账单 → zhàngdān (hóa đơn)", "算错 → suàn cuò (tính nhầm)", "酒 → jiǔ (rượu)", "请问 → qǐngwèn"]
      },
      {
        chinese: "我们一共四个人, 但账单上写五个人的服务费。",
        pinyin: "Wǒmen yīgòng sì gè rén, dàn zhàngdān shàng xiě wǔ gè rén de fúwùfèi.",
        english: "We're four people total, but the bill shows service fee for five.",
        vi: "Bọn em tổng 4 người, nhưng hóa đơn ghi phí dịch vụ 5 người.",
        pronunciation_focus: ["一共 → yīgòng (tổng cộng)", "四个人 → sì gè rén (4 người)", "服务费 → fúwùfèi (phí dịch vụ)", "账单 → zhàngdān"]
      },
      {
        chinese: "麻烦您重新打一份正确的账单, 谢谢。",
        pinyin: "Máfan nín chóngxīn dǎ yī fèn zhèngquè de zhàngdān, xièxie.",
        english: "Please print a corrected bill, thank you.",
        vi: "Phiền anh/chị in lại hóa đơn đúng, cảm ơn.",
        pronunciation_focus: ["重新 → chóngxīn (lại từ đầu)", "打 → dǎ (in)", "正确 → zhèngquè (đúng)", "麻烦您 → máfan nín"]
      }
    ],
    vocab: [
      { chinese: "点菜", pinyin: "diǎn cài", english: "to order food", vi: "gọi món" },
      { chinese: "上菜", pinyin: "shàng cài", english: "to serve food", vi: "lên món" },
      { chinese: "上错菜", pinyin: "shàng cuò cài", english: "wrong dish served", vi: "sai món" },
      { chinese: "账单", pinyin: "zhàng dān", english: "bill", vi: "hóa đơn" },
      { chinese: "结账", pinyin: "jié zhàng", english: "to settle bill", vi: "thanh toán" },
      { chinese: "服务费", pinyin: "fú wù fèi", english: "service charge", vi: "phí dịch vụ" },
      { chinese: "退菜", pinyin: "tuì cài", english: "to return dish", vi: "trả món" },
      { chinese: "重新打", pinyin: "chóng xīn dǎ", english: "reprint", vi: "in lại" },
      { chinese: "服务员", pinyin: "fú wù yuán", english: "waiter / server", vi: "phục vụ" },
      { chinese: "菜单", pinyin: "cài dān", english: "menu", vi: "thực đơn" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "服务员, 这道菜不是我点的。", pinyin: "Fúwùyuán, zhè dào cài bù shì wǒ diǎn de.", english: "Server, this isn't what I ordered.", vi: "Anh ơi, món này không phải món em gọi." },
      { speaker: "服务员", chinese: "您点的是哪道?", pinyin: "Nín diǎn de shì nǎ dào?", english: "What did you order?", vi: "Anh gọi món gì?" },
      { speaker: "阮", chinese: "宫保鸡丁。这道是辣子鸡。", pinyin: "Gōngbǎo jīdīng. Zhè dào shì làzi jī.", english: "Kung Pao Chicken. This is Spicy Chicken.", vi: "Gà Kung Pao. Cái này là gà cay khô." },
      { speaker: "服务员", chinese: "实在抱歉, 我马上换。", pinyin: "Shízài bàoqiàn, wǒ mǎshàng huàn.", english: "Sincerely sorry, I'll change it right away.", vi: "Thực sự xin lỗi anh, em đổi ngay." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "服务员, 不好意思, 这道菜不是我点的。", pinyin: "Fúwùyuán, bù hǎoyìsi, zhè dào cài bù shì wǒ diǎn de.", english: "Server, sorry, this isn't what I ordered.", vi: "Anh ơi, xin lỗi, món này không phải món em gọi." },
      { speaker: "服务员", chinese: "您看一下点菜单, 您点的是什么?", pinyin: "Nín kàn yīxià diǎncài dān, nín diǎn de shì shénme?", english: "Look at the order list, what did you order?", vi: "Anh xem giấy ghi món, anh gọi gì?" },
      { speaker: "阮", chinese: "我点的是15号宫保鸡丁。这道是辣子鸡, 是18号。", pinyin: "Wǒ diǎn de shì shíwǔ hào gōngbǎo jīdīng. Zhè dào shì làzi jī, shì shíbā hào.", english: "I ordered #15 Kung Pao Chicken. This is Spicy Chicken, #18.", vi: "Em gọi số 15 gà Kung Pao. Cái này là gà cay khô, số 18." },
      { speaker: "服务员", chinese: "实在抱歉, 我们厨房上错菜了。我马上换。这道辣子鸡您要不要先吃, 还是退掉?", pinyin: "Shízài bàoqiàn, wǒmen chúfáng shàng cuò cài le. Wǒ mǎshàng huàn. Zhè dào làzi jī nín yào bù yào xiān chī, háishi tuì diào?", english: "Sincerely sorry, our kitchen sent the wrong dish. I'll change it. Do you want to eat this Spicy Chicken first, or return it?", vi: "Thực sự xin lỗi, bếp lên nhầm món. Em đổi ngay. Món gà cay khô này anh có muốn ăn trước không, hay trả lại?" },
      { speaker: "阮", chinese: "退掉吧, 我吃不了那么辣的。", pinyin: "Tuì diào ba, wǒ chī bù liǎo nàme là de.", english: "Return it, I can't handle that spicy.", vi: "Trả lại đi, em không ăn cay được vậy." },
      { speaker: "服务员", chinese: "好的, 我去厨房, 大概十分钟上宫保鸡丁。", pinyin: "Hǎo de, wǒ qù chúfáng, dàgài shí fēnzhōng shàng gōngbǎo jīdīng.", english: "Okay, I'll go to kitchen, Kung Pao Chicken in about 10 min.", vi: "Vâng, em xuống bếp, khoảng 10 phút sẽ lên gà Kung Pao." },
      { speaker: "阮", chinese: "(SAU 10 PHÚT) 谢谢, 这次对了。等下结账时记得别算辣子鸡的钱。", pinyin: "(10 fēnzhōng hòu) Xièxie, zhè cì duì le. Děng xià jiézhàng shí jìde bié suàn làzi jī de qián.", english: "(10 min later) Thanks, this is correct. When checking out, remember not to charge for Spicy Chicken.", vi: "(10 phút sau) Cảm ơn, cái này đúng rồi. Lát thanh toán nhớ đừng tính tiền gà cay khô." },
      { speaker: "服务员", chinese: "放心, 我已经在系统里取消了。", pinyin: "Fàngxīn, wǒ yǐjīng zài xìtǒng lǐ qǔxiāo le.", english: "Don't worry, I already canceled it in the system.", vi: "Anh yên tâm, em đã hủy trong hệ thống rồi." },
      { speaker: "阮", chinese: "(吃完, 结账) 服务员, 麻烦结账。", pinyin: "(chī wán, jiézhàng) Fúwùyuán, máfan jiézhàng.", english: "(after eating, checking out) Server, please bill us.", vi: "(ăn xong, thanh toán) Anh ơi, phiền anh thanh toán." },
      { speaker: "服务员", chinese: "好的, 给您账单。", pinyin: "Hǎo de, gěi nín zhàngdān.", english: "Sure, here's the bill.", vi: "Được, đưa anh hóa đơn." },
      { speaker: "阮", chinese: "等等, 这上面写了一瓶啤酒, 我们没点啤酒。", pinyin: "Děngdeng, zhè shàngmiàn xiě le yī píng píjiǔ, wǒmen méi diǎn píjiǔ.", english: "Wait, this lists one beer, we didn't order beer.", vi: "Khoan, trên này ghi một chai bia, bọn em không gọi bia." },
      { speaker: "服务员", chinese: "哦? 让我看一下。... 真的, 系统里串单了, 这是隔壁桌的啤酒。我马上修改。", pinyin: "Ò? Ràng wǒ kàn yīxià. ... Zhēn de, xìtǒng lǐ chuàn dān le, zhè shì gébì zhuō de píjiǔ. Wǒ mǎshàng xiūgǎi.", english: "Oh? Let me check. ... Really, the system mixed up — this is the next table's beer. I'll fix it now.", vi: "Ơ? Để em xem. ... Thật, hệ thống đã trộn — đây là bia của bàn bên. Em sửa ngay." },
      { speaker: "阮", chinese: "另外, 我们一共四个人, 但服务费按五个人收的。", pinyin: "Lìngwài, wǒmen yīgòng sì gè rén, dàn fúwùfèi àn wǔ gè rén shōu de.", english: "Also, we're 4 people, but service charge is for 5.", vi: "Ngoài ra, bọn em 4 người nhưng phí dịch vụ tính 5 người." },
      { speaker: "服务员", chinese: "我重新打一份。... 现在是: 四道菜加米饭, 共380块, 服务费10%是38块, 总共418块。您看对吗?", pinyin: "Wǒ chóngxīn dǎ yī fèn. ... Xiànzài shì: sì dào cài jiā mǐfàn, gòng sānbǎi bāshí kuài, fúwùfèi bǎi fēn zhī shí shì sānshí bā kuài, zǒnggòng sìbǎi yīshí bā kuài. Nín kàn duì ma?", english: "I'll reprint. ... Now: 4 dishes + rice, 380 RMB, service 10% = 38, total 418. Correct?", vi: "Em in lại. ... Bây giờ: 4 món + cơm, 380 tệ, phí dịch vụ 10% = 38 tệ, tổng 418 tệ. Anh thấy đúng không?" },
      { speaker: "阮", chinese: "对了, 微信付。", pinyin: "Duì le, wēixìn fù.", english: "Correct, WeChat Pay.", vi: "Đúng rồi, em trả WeChat." },
      { speaker: "服务员", chinese: "扫这个码就行。今天让您不开心了, 真不好意思。", pinyin: "Sǎo zhège mǎ jiùxíng. Jīntiān ràng nín bù kāixīn le, zhēn bù hǎoyìsi.", english: "Scan this code. Sorry to spoil your day.", vi: "Quét mã này là xong. Hôm nay làm anh không vui, thật xin lỗi." },
      { speaker: "阮", chinese: "没关系, 处理得很及时。下次再来。", pinyin: "Méi guānxi, chǔlǐ de hěn jíshí. Xià cì zài lái.", english: "It's okay, handled promptly. We'll be back.", vi: "Không sao, anh xử lý kịp thời. Lần sau bọn em quay lại." }
    ],
    roleplay_prompts: [
      "Bạn gọi món 'tôm rang muối' (椒盐虾) nhưng lên 'tôm sốt cà chua' (番茄虾). Hãy báo phục vụ + yêu cầu đổi + nếu bếp đang đông không thể đổi nhanh, đề xuất hủy món + hoàn tiền (退掉, 不收钱).",
      "Hóa đơn ghi sai số người (4 → 6) → phí dịch vụ tăng 50%. Hãy chỉ ra lỗi cụ thể + yêu cầu in lại + kiểm tra cẩn thận lần này. Cụm '请重新打一份正确的账单, 我会再核对一遍'.",
      "Phục vụ tính nhầm thẻ giảm giá 20% (chỉ áp dụng cho thành viên VIP, bạn không phải thành viên). Hãy chân thực: nói với phục vụ rằng bạn không phải VIP, đừng giả vờ. Trả đúng giá. Đây là test trung thực — quan trọng cho danh tiếng cá nhân."
    ],
    register_notes: "Khiếu nại nhà hàng Trung Quốc: tone formal nhưng nhanh, không leo thang. Phục vụ Trung Quốc thường thiếu tự chủ — lỗi của bếp/hệ thống không phải của họ. Đối xử nhẹ nhàng = họ giúp bạn nhiều hơn.\n\nCác cụm chuẩn:\n- '这道菜不是我点的' (món này không phải món em gọi)\n- '麻烦您帮我换一下' (phiền anh đổi cho em)\n- '请问账单是不是算错了?' (hóa đơn có tính nhầm không)\n- '我没点这个' (em không gọi cái này)\n- '麻烦重新打一份正确的账单' (phiền in lại hóa đơn đúng)\n\nKhi nhà hàng sai, họ thường:\n- Xin lỗi: '实在抱歉' (thực sự xin lỗi)\n- Đề xuất giải pháp: '我马上换' (em đổi ngay) / '退掉吧' (trả lại nhé)\n- Bonus: free món tráng miệng, giảm % bill, phiếu lần sau\n\nKHÔNG đòi miễn phí toàn bộ bữa ăn vì 1 món sai — quá lớn. Hợp lý: hủy món sai + hoàn tiền món đó + có thể bonus tráng miệng nhỏ.\n\nVề tip: Trung Quốc đại lục KHÔNG có văn hóa tip. Phí dịch vụ (10%) đã include. Nếu bạn để tip mặt bằng (như Mỹ), phục vụ có thể trả lại — họ nghĩ bạn quên tiền thừa.\n\nTránh: (a) La mắng phục vụ trước mặt khách khác — gây mất mặt cho họ, không hữu ích; (b) Đe dọa review xấu — chỉ dùng khi nhà hàng từ chối sửa lỗi rõ ràng; (c) Quay phim phục vụ trừ khi đã yêu cầu nhiều lần không xử lý.",
    idiom_glosses: [
      {
        idiom: "实事求是",
        literal: "thực sự cầu thị (shí shì qiú shì)",
        meaning: "Sự việc đúng như sự việc — báo cáo chân thực, không phóng đại. Cụm dùng để giải thích vì sao bạn báo lỗi cụ thể: 'em 实事求是, không tính nhầm phí.'",
        example: "我实事求是地告诉您, 这道菜真的不是我点的。"
      },
      {
        idiom: "明明白白",
        literal: "rõ ràng minh bạch (míng míng bái bái)",
        meaning: "Rõ ràng, minh bạch — yêu cầu thông tin đầy đủ. 'Em muốn 明明白白biết hóa đơn tính sao.' Cụm chuẩn khi yêu cầu kiểm tra hóa đơn.",
        example: "我希望您把账单算得明明白白。"
      },
      {
        idiom: "得理饶人",
        literal: "được lý nhường người (dé lǐ ráo rén)",
        meaning: "Có lý vẫn nhường người — không lợi dụng khi đối phương sai. Phẩm chất quân tử: dù bạn đúng (nhà hàng sai), không leo thang, vẫn lịch sự. Đối lập với 'kicking when down'.",
        example: "他们错了, 但我得理饶人, 不会闹大。"
      },
      {
        idiom: "皆大欢喜",
        literal: "đều cùng vui (jiē dà huān xǐ)",
        meaning: "Mọi người đều vui — kết quả khiến mọi bên hài lòng. Cụm dùng khi vấn đề được giải quyết: 'họ đổi món, hoàn tiền, 皆大欢喜'. Tích cực để kết thúc khiếu nại.",
        example: "服务员处理得很好, 皆大欢喜。"
      }
    ],
    cultural_notes_vi: "Văn hóa nhà hàng Trung Quốc đại lục có những đặc thù mà người Việt nên biết:\n\n(1) GỌI MÓN: phục vụ thường đứng tại bàn chờ. Bạn xem menu, gọi tên/số món rõ ràng (vì âm thanh nhà hàng ồn). Nếu không chắc tên, chỉ vào ảnh menu. Số người = số món + 1 (rule of thumb). Quá nhiều = lãng phí + đắt; quá ít = không đủ ăn.\n\n(2) ĐỒ ĂN GIA ĐÌNH: khác phương Tây (mỗi người 1 đĩa), Trung Quốc dùng đĩa chung — cả bàn chia sẻ. Lazy Susan (转盘 — zhuànpán) ở giữa bàn tròn. Xoay theo chiều kim đồng hồ. Người ăn lấy bằng đũa của mình từ đĩa chung — KHÔNG dùng đũa cá nhân chấm vào nước chấm chung (dùng 公筷 — đũa công cộng).\n\n(3) MENU: thường có ảnh + giá + tên hanzi + (đôi khi) tiếng Anh dịch. Nhà hàng cao cấp có menu tiếng Anh. Nhà hàng địa phương = chỉ tiếng Trung. Dùng app dịch để xem nguyên liệu (đặc biệt nếu bạn dị ứng).\n\n(4) PHÍ DỊCH VỤ (服务费): 10-15% là chuẩn ở nhà hàng formal/khách sạn. Nhà hàng địa phương thường KHÔNG có phí dịch vụ. Hóa đơn ghi rõ 'service charge X%'. Đây không phải tip — phục vụ vẫn nhận lương, không trông chờ thêm.\n\n(5) THANH TOÁN: WeChat Pay/Alipay là chính (95% nhà hàng nhận). Tiền mặt OK. Visa/Mastercard CHỈ ở chuỗi quốc tế (Hilton, Marriott) hoặc nhà hàng cao cấp (>500 tệ/người). Không nên dựa vào credit card.\n\n(6) HÓA ĐƠN HỢP LỆ (发票 — fāpiào): hóa đơn có dấu đỏ + mã số thuế. Yêu cầu '我要发票' khi cần báo cáo phí công tác. Có thể request 1 ngày sau qua WeChat của nhà hàng.\n\nVề lỗi: nhà hàng Trung Quốc THƯỜNG XUYÊN có lỗi nhỏ (sai món, tính nhầm) vì hệ thống thủ công + giấy tờ tay tại quầy. KHÔNG phải lừa đảo — chỉ là sơ suất. Bình tĩnh chỉ ra, họ sẽ sửa nhanh. Nếu họ từ chối sửa lỗi rõ ràng = vấn đề lớn hơn (gọi 12315 — hotline bảo vệ người tiêu dùng).\n\nVề review: Dianping (大众点评) là Yelp Trung Quốc — review nhiều người đọc. Nhà hàng cực sợ rating <3.5 sao. Đây là leverage MẠNH cho khiếu nại lớn — nhưng chỉ dùng khi đã yêu cầu nhiều lần không sửa.\n\nVề người Việt và món Trung: Trung Quốc có nhiều món rất CAY (Tứ Xuyên 四川, Hồ Nam 湖南) hoặc rất NỒNG (Sơn Đông 山东). Nhiều người Việt không quen — báo trước với phục vụ '不要太辣' (đừng cay quá) hoặc '少油' (ít dầu). Họ sẽ điều chỉnh.\n\nVề kiêng kỵ thực phẩm: nếu Hồi giáo/Halal — tìm nhà hàng có biển '清真' (Halal). Nếu chay — '素食' (chay) hoặc '我吃素' (em ăn chay). Người Việt nói 'ăn chay' = vegetarian; người Trung phân '全素' (vegan, không trứng/sữa) và '蛋奶素' (lacto-ovo). Hỏi rõ.",
    tip_advice_vi: "(1) ĐỌC REVIEW TRƯỚC khi chọn nhà hàng — Dianping (大众点评), Meituan (美团), Trip.com cho khách quốc tế. Tránh nhà hàng có >10% review nói 'sai món' hoặc 'tính nhầm'. Mức 4.0+/5 là an toàn. (2) GỌI MÓN BẰNG SỐ + TÊN: '我要15号宫保鸡丁' (em gọi số 15 gà Kung Pao). Phục vụ ghi cả 2 — khó nhầm hơn. (3) GIỮ GIẤY GHI MÓN (点菜单): phục vụ đưa cho bạn xem trước khi vào bếp. Kiểm tra: đúng số người, đúng món, đúng số lượng. Nếu có sai, sửa NGAY tại bàn — KHÔNG đợi món lên. (4) ẢNH MÀN HÌNH HÓA ĐƠN trước khi thanh toán: chụp ảnh hóa đơn giấy/màn hình. Bằng chứng nếu có tranh chấp sau. (5) KIỂM TRA TỪNG MỤC trên hóa đơn: số món, đơn giá, số lượng, phí dịch vụ. Tổng cộng dùng máy tính trên điện thoại. Sai > 5 tệ = báo. Sai < 5 tệ = bỏ qua (không đáng thời gian). (6) KHIẾU NẠI KHÉO: cấu trúc 3 bước — chỉ ra lỗi (1 câu), yêu cầu sửa (1 câu), kết thúc cảm ơn (1 câu). Không kéo dài 5 phút. (7) NẾU KHÔNG XỬ LÝ: gọi quản lý (经理 — jīnglǐ). Nếu vẫn không, gọi 12315 (hotline bảo vệ người tiêu dùng — miễn phí, có người nói tiếng Anh ở thành phố lớn). Đây là leverage cuối cùng, không lạm dụng.",
    exercises: [
      { type: "fill-blank", question: "您好, 这道菜不是我 ___ 的。", answer: "点" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung khiếu nại nhà hàng với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "上错菜", pinyin: "shàng cuò cài", english: "sai món" },
          { chinese: "账单", pinyin: "zhàng dān", english: "hóa đơn" },
          { chinese: "服务费", pinyin: "fú wù fèi", english: "phí dịch vụ" },
          { chinese: "重新打", pinyin: "chóng xīn dǎ", english: "in lại" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Bọn em 4 người, nhưng phí dịch vụ tính 5 người. Phiền anh in lại hóa đơn đúng.",
        chinese: "我们一共四个人, 但服务费按五个人收。麻烦您重新打一份正确的账单。",
        pinyin: "Wǒ men yī gòng sì gè rén, dàn fú wù fèi àn wǔ gè rén shōu. Má fan nín chóng xīn dǎ yī fèn zhèng què de zhàng dān."
      }
    ]
  },
  {
    id: 81,
    level: "B2",
    category: "travel_mobility",
    title: "出租车/滴滴 — 路线和车费争议",
    pinyin: "chū zū chē / dī dī — lù xiàn hé chē fèi zhēng yì",
    topic: "Taxi/DiDi dispute — wrong route, fare disagreement",
    title_vi: "Taxi/DiDi — tranh chấp đường đi và giá vé",
    title_en: "Taxi/DiDi dispute — wrong route, fare disagreement",
    sentences: [
      {
        chinese: "师傅, 您能走快点吗? 不要绕路。",
        pinyin: "Shīfu, nín néng zǒu kuài diǎn ma? Bù yào rào lù.",
        english: "Driver, can you go faster? Don't take the long way.",
        vi: "Anh tài xế, anh có thể đi nhanh hơn không? Đừng đi vòng.",
        pronunciation_focus: ["师傅 → shīfu (xưng hô tài xế / thợ)", "走快点 → zǒu kuài diǎn (đi nhanh hơn)", "绕路 → rào lù (đi vòng)", "不要 → bù yào"]
      },
      {
        chinese: "请走最短路线, 我赶时间。",
        pinyin: "Qǐng zǒu zuì duǎn lùxiàn, wǒ gǎn shíjiān.",
        english: "Please take the shortest route, I'm in a hurry.",
        vi: "Xin đi đường ngắn nhất, em đang vội.",
        pronunciation_focus: ["最短路线 → zuì duǎn lùxiàn (đường ngắn nhất)", "赶时间 → gǎn shíjiān (vội)", "请走 → qǐng zǒu", "请 → qǐng"]
      },
      {
        chinese: "刚才在地图上看了, 直走只要十五分钟。",
        pinyin: "Gāngcái zài dìtú shàng kàn le, zhí zǒu zhǐ yào shíwǔ fēnzhōng.",
        english: "I just checked the map — straight is only 15 minutes.",
        vi: "Em vừa xem bản đồ, đi thẳng chỉ 15 phút.",
        pronunciation_focus: ["地图 → dìtú (bản đồ)", "直走 → zhí zǒu (đi thẳng)", "十五分钟 → shíwǔ fēnzhōng (15 phút)", "刚才 → gāngcái"]
      },
      {
        chinese: "请问为什么滴滴显示30块, 您要40块?",
        pinyin: "Qǐngwèn wèishéme dīdī xiǎnshì sānshí kuài, nín yào sìshí kuài?",
        english: "Why does DiDi show 30 RMB but you want 40?",
        vi: "Cho em hỏi tại sao DiDi hiển thị 30 tệ, anh đòi 40 tệ?",
        pronunciation_focus: ["显示 → xiǎnshì (hiển thị)", "滴滴 → dīdī (DiDi app)", "30块 → sānshí kuài (30 tệ)", "为什么 → wèishéme"]
      },
      {
        chinese: "我按app上的金额付, 不付额外的。",
        pinyin: "Wǒ àn app shàng de jīn'é fù, bù fù éwài de.",
        english: "I'll pay the app amount, not extra.",
        vi: "Em trả theo số tiền trên app, không trả thêm.",
        pronunciation_focus: ["按 → àn (theo)", "金额 → jīn'é (số tiền)", "额外 → éwài (thêm / extra)", "不付 → bù fù"]
      }
    ],
    vocab: [
      { chinese: "出租车", pinyin: "chū zū chē", english: "taxi", vi: "taxi" },
      { chinese: "滴滴", pinyin: "dī dī", english: "DiDi (ride app)", vi: "DiDi (app gọi xe)" },
      { chinese: "师傅", pinyin: "shī fu", english: "driver (informal)", vi: "tài xế / thợ (xưng hô)" },
      { chinese: "路线", pinyin: "lù xiàn", english: "route", vi: "tuyến đường" },
      { chinese: "绕路", pinyin: "rào lù", english: "to take a detour", vi: "đi vòng" },
      { chinese: "起步价", pinyin: "qǐ bù jià", english: "starting fare", vi: "giá khởi điểm" },
      { chinese: "车费", pinyin: "chē fèi", english: "fare", vi: "tiền xe" },
      { chinese: "打表", pinyin: "dǎ biǎo", english: "use the meter", vi: "bật đồng hồ" },
      { chinese: "投诉", pinyin: "tóu sù", english: "to complain", vi: "khiếu nại" },
      { chinese: "电子发票", pinyin: "diàn zǐ fā piào", english: "e-invoice", vi: "hóa đơn điện tử" }
    ],
    dialogue: [
      { speaker: "阮", chinese: "师傅, 去王府井, 走最近的路。", pinyin: "Shīfu, qù Wángfǔjǐng, zǒu zuì jìn de lù.", english: "Driver, to Wangfujing, take the shortest way.", vi: "Anh ơi, đến Vương Phủ Tỉnh, đi đường gần nhất." },
      { speaker: "司机", chinese: "好, 走二环吧, 不堵。", pinyin: "Hǎo, zǒu èr huán ba, bù dǔ.", english: "Sure, take 2nd ring road, no traffic.", vi: "Được, đi vành đai 2 nhé, không kẹt." },
      { speaker: "阮", chinese: "好的。打表了吗?", pinyin: "Hǎo de. Dǎ biǎo le ma?", english: "Okay. Meter on?", vi: "Vâng. Bật đồng hồ chưa?" },
      { speaker: "司机", chinese: "打了, 起步价14块。", pinyin: "Dǎ le, qǐbùjià shísì kuài.", english: "Yes, start 14 RMB.", vi: "Bật rồi, khởi điểm 14 tệ." }
    ],
    dialogue_long: [
      { speaker: "阮", chinese: "师傅, 您好, 去机场T3航站楼。", pinyin: "Shīfu, nín hǎo, qù jīchǎng T sān hángzhànlóu.", english: "Driver, hello, to airport Terminal 3.", vi: "Anh tài xế, chào anh, đến nhà ga T3 sân bay." },
      { speaker: "司机", chinese: "好, 三环转机场高速。", pinyin: "Hǎo, sān huán zhuǎn jīchǎng gāosù.", english: "Okay, 3rd ring road then airport expressway.", vi: "Được, vành đai 3 rồi cao tốc sân bay." },
      { speaker: "阮", chinese: "我用滴滴叫的车, 显示估价85块。", pinyin: "Wǒ yòng dīdī jiào de chē, xiǎnshì gūjià bāshí wǔ kuài.", english: "I called via DiDi, estimated 85 RMB.", vi: "Em gọi bằng DiDi, ước tính 85 tệ." },
      { speaker: "司机", chinese: "估价是估价, 实际多少要看路况。今天有点堵, 可能要95-100。", pinyin: "Gūjià shì gūjià, shíjì duōshao yào kàn lùkuàng. Jīntiān yǒudiǎn dǔ, kěnéng yào jiǔshí wǔ dào yībǎi.", english: "Estimate is estimate, actual depends on traffic. A bit congested today — maybe 95-100.", vi: "Ước tính là ước tính, thực tế tùy giao thông. Hôm nay hơi kẹt, có thể 95-100 tệ." },
      { speaker: "阮", chinese: "好, 我看导航。... 师傅, 我看高德地图显示直走机场高速最近, 您怎么走五环? 这样多十公里。", pinyin: "Hǎo, wǒ kàn dǎoháng. ... Shīfu, wǒ kàn Gāodé dìtú xiǎnshì zhí zǒu jīchǎng gāosù zuì jìn, nín zěnme zǒu wǔ huán? Zhèyàng duō shí gōnglǐ.", english: "Okay, I'll check navigation. ... Driver, Gaode Maps shows airport expressway is shortest, why are you on 5th ring? That's 10km extra.", vi: "Được, em xem dẫn đường. ... Anh ơi, em xem Gaode Maps thấy cao tốc sân bay gần nhất, sao anh đi vành đai 5? Đi vậy thêm 10km." },
      { speaker: "司机", chinese: "三环今天有事故, 我故意绕一下。", pinyin: "Sān huán jīntiān yǒu shìgù, wǒ gùyì rào yīxià.", english: "3rd ring has an accident today, I'm detouring on purpose.", vi: "Vành đai 3 hôm nay có tai nạn, em cố ý đi vòng." },
      { speaker: "阮", chinese: "我看Gaode地图上, 三环目前是绿色的, 没堵车。能不能调整一下?", pinyin: "Wǒ kàn Gāodé dìtú shàng, sān huán mùqián shì lǜsè de, méi dǔ chē. Néng bù néng tiáozhěng yīxià?", english: "On Gaode, 3rd ring is green now, no traffic. Can you adjust?", vi: "Em xem Gaode, vành đai 3 hiện màu xanh, không kẹt. Có thể điều chỉnh không?" },
      { speaker: "司机", chinese: "(沉默几秒) 好吧, 下个出口我转回去。但车费可能因为这段绕路要多算几块。", pinyin: "(chénmò jǐ miǎo) Hǎo ba, xià gè chūkǒu wǒ zhuǎn huíqù. Dàn chēfèi kěnéng yīnwèi zhè duàn rào lù yào duō suàn jǐ kuài.", english: "(pause) Okay, next exit I'll turn back. But fare might be a few yuan more because of this detour.", vi: "(im lặng vài giây) Được, lối ra tiếp theo em quay lại. Nhưng giá có thể đắt thêm vài tệ vì đoạn vòng này." },
      { speaker: "阮", chinese: "师傅, 这段绕路不是我要的。如果按app计费, 您应该按估价范围付, 不能因为您绕路让我多付。", pinyin: "Shīfu, zhè duàn rào lù bù shì wǒ yào de. Rúguǒ àn app jìfèi, nín yīnggāi àn gūjià fànwéi fù, bù néng yīnwèi nín rào lù ràng wǒ duō fù.", english: "Driver, this detour isn't on me. Per app billing, you should charge within estimate, can't make me pay extra for your detour.", vi: "Anh ơi, đoạn vòng này không phải em yêu cầu. Theo tính phí của app, anh phải tính trong phạm vi ước tính, không thể vì anh đi vòng mà em phải trả thêm." },
      { speaker: "司机", chinese: "(到了机场) 一共112块。", pinyin: "(dào le jīchǎng) Yīgòng yībǎi yī shí èr kuài.", english: "(arrives) Total 112 RMB.", vi: "(đến sân bay) Tổng cộng 112 tệ." },
      { speaker: "阮", chinese: "app显示估价是85, 实际跑了20.5公里, 应该是90块。我按90付。如果您有异议, 我向滴滴投诉, 让平台仲裁。", pinyin: "App xiǎnshì gūjià shì bāshí wǔ, shíjì pǎo le èrshí diǎn wǔ gōnglǐ, yīnggāi shì jiǔshí kuài. Wǒ àn jiǔshí fù. Rúguǒ nín yǒu yìyì, wǒ xiàng dīdī tóusù, ràng píngtái zhòngcái.", english: "App shows estimate 85, actual 20.5km, should be 90. I'll pay 90. If you disagree, I'll complain to DiDi for arbitration.", vi: "App hiển thị ước tính 85, thực tế chạy 20.5km, đáng lẽ 90 tệ. Em trả 90. Nếu anh không đồng ý, em sẽ khiếu nại DiDi để platform phân xử." },
      { speaker: "司机", chinese: "(犹豫) 好吧, 90就90, 用app结账吧。", pinyin: "(yóuyù) Hǎo ba, jiǔshí jiù jiǔshí, yòng app jiézhàng ba.", english: "(hesitates) Fine, 90 it is, settle via app.", vi: "(do dự) Được, 90 thì 90, thanh toán qua app đi." },
      { speaker: "阮", chinese: "app上自动结算, 我已经付了。请发电子发票到我邮箱。", pinyin: "App shàng zìdòng jiésuàn, wǒ yǐjīng fù le. Qǐng fā diànzǐ fāpiào dào wǒ yóuxiāng.", english: "App auto-settled, already paid. Please send e-invoice to my email.", vi: "App tự động thanh toán, em đã trả. Xin gửi hóa đơn điện tử vào email em." },
      { speaker: "司机", chinese: "电子发票app里直接申请就行, 我这边没控制权。", pinyin: "Diànzǐ fāpiào app lǐ zhíjiē shēnqǐng jiùxíng, wǒ zhèbiān méi kòngzhì quán.", english: "Apply for e-invoice in app directly — I have no control.", vi: "Hóa đơn điện tử anh xin trên app trực tiếp, em không có quyền điều khiển." },
      { speaker: "阮", chinese: "好, 谢谢。", pinyin: "Hǎo, xièxie.", english: "Okay, thanks.", vi: "Được, cảm ơn." }
    ],
    roleplay_prompts: [
      "Tài xế DiDi đến đón nhưng nhìn thấy bạn là người nước ngoài + có nhiều vali → từ chối chở. Hãy bình tĩnh: hỏi rõ lý do + nếu không có lý do hợp lệ, báo qua app (Cancel by driver, with photo of license plate). DiDi sẽ phạt tài xế + cấp xe khác miễn phí.",
      "Đi taxi truyền thống (không qua app), lên xe quên kiểm tra đồng hồ. Đi 5 phút thấy đồng hồ chưa bật. Hãy yêu cầu ngay: '师傅, 您还没打表' (anh chưa bật đồng hồ). Nếu tài xế nói 'fixed price 100', xuống xe ngay tại đèn đỏ + báo 12328 (hotline taxi).",
      "Đến nơi, tài xế nói 'tôi không nhận WeChat Pay, chỉ tiền mặt'. Bạn không có tiền mặt. Hãy đề xuất: (a) đến cây ATM gần đó rút tiền, (b) tài xế chở đến bạn rút rồi quay lại, (c) gọi DiDi support. KHÔNG để tài xế giữ điện thoại/đồ làm 'cọc'."
    ],
    register_notes: "Xưng hô tài xế ở Trung Quốc: '师傅' (shīfu — thợ/sư phụ) là chuẩn nhất, không có 师傅 trong tiếng Việt nhưng tương tự 'anh ơi'. Dùng 您 với 师傅, không dùng 你.\n\nDiDi (滴滴出行) là Uber/Grab của Trung Quốc — app chính thức, an toàn, có English mode. KHÔNG dùng taxi đường phố trừ khi cần thiết — dễ bị overcharge.\n\nCác cụm chuẩn:\n- '师傅, 去X' (anh ơi, đi X) — câu mở chuẩn\n- '走最近的路' (đi đường gần nhất)\n- '不要绕路' (đừng đi vòng)\n- '打表了吗?' (bật đồng hồ chưa?)\n- '车费多少?' (giá xe bao nhiêu?)\n- '我用app结账' (em thanh toán qua app)\n- '请发电子发票' (xin gửi hóa đơn điện tử)\n\nKhi tranh chấp:\n- Trên app DiDi: bằng chứng có sẵn (lộ trình, ước tính, GPS) — quay sang DiDi support, KHÔNG cãi với tài xế\n- Taxi truyền thống: bằng chứng yếu hơn — chụp ảnh biển số, ghi nhớ tên tài xế (trên giấy phép treo dashboard), gọi 12328 (hotline taxi quốc gia)\n\nCảm ơn:\n- Tới nơi: '谢谢师傅' (cảm ơn anh tài xế)\n- Cuối hành trình: '一路顺利' (đi thuận lợi — formal) / '辛苦了' (vất vả rồi)\n\nTránh: (a) Trả tiền mặt cho DiDi — app tự thanh toán; (b) Đưa đầy đủ địa chỉ chi tiết bằng tiếng Anh — dùng app set destination; (c) Lên xe không bật biển số đúng app — kiểm tra biển số khớp DiDi trước khi vào.",
    idiom_glosses: [
      {
        idiom: "无奸不商",
        literal: "không gian không thương (wú jiān bù shāng)",
        meaning: "Người buôn không gian thì không kiếm được — câu đùa cũ ngầm chỉ thương nhân hay láu cá. Người Trung Quốc dùng để cảnh báo: '坐出租车要小心, 无奸不商'. Dùng cảnh giác, không phải tự miêu tả.",
        example: "出租车师傅有时候无奸不商, 我们要小心。"
      },
      {
        idiom: "条理清楚",
        literal: "có thứ tự rõ ràng (tiáo lǐ qīng chu)",
        meaning: "Có logic rõ ràng — yêu cầu trình bày có thứ tự. Cụm dùng khi tranh chấp: 'em sẽ nói 条理清楚 lý do'. Tránh nói cảm xúc lung tung.",
        example: "您条理清楚地说出您的理由。"
      },
      {
        idiom: "据理力争",
        literal: "dựa lý tranh giành (jù lǐ lì zhēng)",
        meaning: "Dựa vào lý lẽ tranh đấu — đứng vững trên lập trường có lý. Cụm tích cực, dùng khi bạn đứng đúng nhưng nhẹ nhàng: 'em 据理力争, không phải gây gổ'.",
        example: "我据理力争, 不付额外的钱。"
      },
      {
        idiom: "得不偿失",
        literal: "được không bù mất (dé bù cháng shī)",
        meaning: "Lợi ích không bù được mất mát — không đáng. Cụm dùng để phân tích: 'cãi nhau với tài xế 5 tệ là 得不偿失'. Cảnh báo bản thân khi muốn leo thang vì việc nhỏ.",
        example: "为五块钱跟司机大吵, 得不偿失。"
      }
    ],
    cultural_notes_vi: "Hệ thống di chuyển ở Trung Quốc đại lục có hai loại chính:\n\n(1) DIDI (滴滴出行): app gọi xe lớn nhất Trung Quốc — 600+ triệu user, có English mode. Tải miễn phí trên App Store. Đăng ký bằng số ĐT Trung Quốc HOẶC số quốc tế (cần OTP). Kết nối với Alipay/WeChat Pay HOẶC thẻ Visa/Mastercard quốc tế. Loại xe: 快车 (Express, rẻ nhất, sedan), 优享 (Comfort, sedan tốt hơn), 专车 (Premier, BMW/Mercedes), 拼车 (Carpool, share, rẻ nhất). Đi sân bay 50-150 tệ tùy thành phố.\n\n(2) TAXI ĐƯỜNG PHỐ: ở mọi thành phố. Vẫy tay là dừng. Khởi điểm 10-14 tệ + 2.3 tệ/km. KHÔNG cần app, nhưng:\n- Dễ bị từ chối nếu là người nước ngoài (số ít tài xế ngại communication)\n- Đôi khi đồng hồ 'bị hỏng' = bịa giá\n- Khó chứng minh khiếu nại\nKhuyến nghị: dùng DiDi 90% lúc, taxi đường phố chỉ khi không có DiDi (ngõ nhỏ, mưa to, app sập).\n\nVề bằng chứng: DiDi giữ FULL log: lộ trình GPS, ước tính giá, thời gian đón/trả, đánh giá tài xế. Khi khiếu nại qua app, DiDi nhìn vào log + xử lý 24-48 giờ. Bồi thường có thể là: hoàn tiền, voucher, phạt tài xế (giảm rating của họ — họ rất sợ điều này).\n\nVề ngôn ngữ tài xế: 90% tài xế Trung Quốc đại lục KHÔNG nói tiếng Anh. App DiDi có:\n- Translation function trong chat\n- Voice messages (gửi voice tiếng Anh, app dịch sang tiếng Trung cho tài xế nghe)\n- Pre-set messages: 'Where are you?', 'Please come faster', 'I'm here'\n\nVề an toàn: DiDi sau 'vụ Yueyue 2018' đã tăng cường security: tài xế phải verify danh tính + face recognition trước mỗi shift; có nút SOS trong app gọi 110; có tính năng share GPS với người thân real-time. Đêm khuya 23:00-05:00 có 'safety mode' — chỉ tài xế có rating cao được nhận khách.\n\nVề tip/phụ thu: KHÔNG có tip ở đại lục. Đôi khi tài xế hỏi tip 'làm tròn' (10 tệ → 15 tệ) — đặc biệt với khách nước ngoài. Lịch sự từ chối: '不用了, 谢谢' (không cần, cảm ơn). Nếu tài xế giúp đặc biệt (mang vali, đợi bạn rút tiền), cho 10-20 tệ là phù hợp.\n\nVề khiếu nại: nếu tranh chấp với tài xế:\n- DiDi: phần khiếu nại trong app, thường giải quyết 24h\n- Taxi truyền thống: gọi 12328 (transportation hotline) — có người tiếng Anh ở thành phố lớn\n- Cuối cùng: 110 (cảnh sát) — chỉ khi tài xế có hành vi nguy hiểm hoặc đe dọa\n\nVề thời gian cao điểm: Bắc Kinh + Thượng Hải kẹt khủng khiếp 7-9h sáng, 17-19h tối. Tránh đặt xe khi đó — chuyển sang tàu điện ngầm hoặc đặt sớm hơn.",
    tip_advice_vi: "(1) TẢI DIDI TRƯỚC KHI ĐẾN TQ: cần số ĐT để OTP. Số quốc tế OK nhưng OTP từ Trung Quốc không phải lúc nào cũng đến. Tốt nhất: đăng ký với số ĐT Việt Nam khi bạn đang ở VN, sau khi cài đặt thành công thì bay qua. (2) KẾT NỐI THẺ: Visa/Mastercard quốc tế hoạt động trên DiDi (sau 2023). Setup trong app trước khi đi. KHÔNG dựa vào WeChat Pay nếu chưa có ID Trung Quốc — link thẻ quốc tế đã ổn định hơn. (3) KIỂM TRA BIỂN SỐ trước khi lên xe: app hiển thị biển số tài xế. Khớp với biển số xe thực = OK. Không khớp = HỦY ngay (Cancel + report). Có người giả vờ là DiDi để chở khách nước ngoài. (4) ĐÔ THỊ LỚN HƠN không cần dùng tiếng Trung nhiều: chỉ destination trên app, tài xế dùng GPS. Bạn chỉ cần nói '到了, 谢谢' (đến rồi, cảm ơn). 5 phút trên đường, không bắt buộc nói chuyện. (5) BẢN ĐỒ DỰ PHÒNG: Gaode Maps (高德) hoặc Baidu Maps (百度) — kiểm tra route + giá ước tính TRƯỚC khi đặt xe. Nếu DiDi báo giá quá cao (>50% Gaode estimate) = giờ cao điểm hoặc weather surcharge. Cân nhắc chờ. (6) AN TOÀN CÁ NHÂN: chia GPS với bạn/đồng nghiệp qua DiDi 'Share Trip'. Đến nơi rồi bấm 'I've arrived' để app biết bạn an toàn. Nếu tài xế đi sai đường nhiều >5 phút = SOS button có sẵn (gọi 110 + báo DiDi). (7) GIỮ HÓA ĐƠN ĐIỆN TỬ: trong app DiDi → Trips → trip cụ thể → Get Invoice. Email tự động sau 1-7 ngày. Đối với báo cáo công tác: cần fapiao chính quy với tax ID — thiết lập trong app trước khi đặt xe.",
    exercises: [
      { type: "fill-blank", question: "师傅, 请走 ___ 路线, 不要绕路。", answer: "最短" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung taxi/DiDi với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "师傅", pinyin: "shī fu", english: "tài xế (xưng hô)" },
          { chinese: "绕路", pinyin: "rào lù", english: "đi vòng" },
          { chinese: "打表", pinyin: "dǎ biǎo", english: "bật đồng hồ" },
          { chinese: "电子发票", pinyin: "diàn zǐ fā piào", english: "hóa đơn điện tử" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Anh tài xế, em xem bản đồ thấy đường thẳng chỉ 15 phút, sao anh đi vòng? Em trả theo số tiền trên app, không trả thêm.",
        chinese: "师傅, 我看地图直走只要十五分钟, 您怎么绕路? 我按app上的金额付, 不付额外的。",
        pinyin: "Shī fu, wǒ kàn dì tú zhí zǒu zhǐ yào shí wǔ fēn zhōng, nín zěn me rào lù? Wǒ àn app shàng de jīn é fù, bù fù é wài de."
      }
    ]
  },
  {
    id: 82,
    level: "B2",
    category: "personal_social",
    title: "和中国公婆/岳父母的难谈话",
    pinyin: "hé zhōng guó gōng pó / yuè fù mǔ de nán tán huà",
    topic: "Difficult conversation with Chinese in-laws",
    title_vi: "Cuộc nói chuyện khó với bố mẹ chồng/vợ Trung Quốc",
    title_en: "Difficult conversation with Chinese in-laws",
    sentences: [
      {
        chinese: "妈, 我知道您是为我们好, 但这件事我们想自己决定。",
        pinyin: "Mā, wǒ zhīdào nín shì wèi wǒmen hǎo, dàn zhè jiàn shì wǒmen xiǎng zìjǐ juédìng.",
        english: "Mom, I know you mean well, but this is something we want to decide ourselves.",
        vi: "Mẹ ơi, con biết mẹ vì tốt cho bọn con, nhưng việc này bọn con muốn tự quyết định.",
        pronunciation_focus: ["妈 → mā (gọi mẹ chồng/mẹ vợ — không dùng họ)", "为我们好 → wèi wǒmen hǎo (vì tốt cho bọn con)", "自己决定 → zìjǐ juédìng (tự quyết định)", "您 → nín (formal với mẹ chồng)"]
      },
      {
        chinese: "我们越南的习惯有点不一样, 希望您能理解。",
        pinyin: "Wǒmen Yuènán de xíguàn yǒudiǎn bù yīyàng, xīwàng nín néng lǐjiě.",
        english: "Our Vietnamese customs are a bit different — I hope you can understand.",
        vi: "Phong tục Việt Nam bọn con hơi khác, mong mẹ thông cảm.",
        pronunciation_focus: ["习惯 → xíguàn (phong tục)", "不一样 → bù yīyàng (không giống)", "理解 → lǐjiě (thông cảm)", "希望 → xīwàng"]
      },
      {
        chinese: "我会尊重您的想法, 也希望您尊重我们的选择。",
        pinyin: "Wǒ huì zūnzhòng nín de xiǎngfǎ, yě xīwàng nín zūnzhòng wǒmen de xuǎnzé.",
        english: "I'll respect your thoughts, and hope you'll respect our choice.",
        vi: "Con sẽ tôn trọng ý kiến mẹ, cũng mong mẹ tôn trọng lựa chọn của bọn con.",
        pronunciation_focus: ["尊重 → zūnzhòng (tôn trọng)", "想法 → xiǎngfǎ (ý kiến)", "选择 → xuǎnzé (lựa chọn)", "也希望 → yě xīwàng"]
      },
      {
        chinese: "我们各让一步, 找到一个大家都能接受的办法吧。",
        pinyin: "Wǒmen gè ràng yī bù, zhǎodào yī gè dàjiā dōu néng jiēshòu de bànfǎ ba.",
        english: "Let's each give a little — find a solution everyone can accept.",
        vi: "Mỗi bên nhường một bước, mình tìm cách mà ai cũng chấp nhận được.",
        pronunciation_focus: ["各让一步 → gè ràng yī bù (mỗi bên nhường)", "接受 → jiēshòu (chấp nhận)", "办法 → bànfǎ (cách / phương án)", "大家 → dàjiā"]
      },
      {
        chinese: "妈, 我永远是您的儿媳妇, 这点不会变。",
        pinyin: "Mā, wǒ yǒngyuǎn shì nín de érxífu, zhè diǎn bù huì biàn.",
        english: "Mom, I'll always be your daughter-in-law — that won't change.",
        vi: "Mẹ ơi, con vẫn là con dâu của mẹ mãi mãi, điều này không thay đổi.",
        pronunciation_focus: ["儿媳妇 → érxífu (con dâu)", "永远 → yǒngyuǎn (mãi mãi)", "不会变 → bù huì biàn (không đổi)", "这点 → zhè diǎn"]
      }
    ],
    vocab: [
      { chinese: "公公", pinyin: "gōng gong", english: "father-in-law (husband's father)", vi: "bố chồng" },
      { chinese: "婆婆", pinyin: "pó po", english: "mother-in-law (husband's mother)", vi: "mẹ chồng" },
      { chinese: "岳父", pinyin: "yuè fù", english: "father-in-law (wife's father)", vi: "bố vợ" },
      { chinese: "岳母", pinyin: "yuè mǔ", english: "mother-in-law (wife's mother)", vi: "mẹ vợ" },
      { chinese: "儿媳妇", pinyin: "ér xí fu", english: "daughter-in-law", vi: "con dâu" },
      { chinese: "女婿", pinyin: "nǚ xu", english: "son-in-law", vi: "con rể" },
      { chinese: "尊重", pinyin: "zūn zhòng", english: "to respect", vi: "tôn trọng" },
      { chinese: "理解", pinyin: "lǐ jiě", english: "to understand / sympathize", vi: "thông cảm" },
      { chinese: "习惯", pinyin: "xí guàn", english: "custom / habit", vi: "phong tục" },
      { chinese: "各让一步", pinyin: "gè ràng yī bù", english: "each give a step (compromise)", vi: "mỗi bên nhường một bước" }
    ],
    dialogue: [
      { speaker: "婆婆", chinese: "你们怎么不打算要孩子? 我们这把年纪等不及了。", pinyin: "Nǐmen zěnme bù dǎsuàn yào háizi? Wǒmen zhè bǎ niánjì děng bù jí le.", english: "Why aren't you planning to have kids? We're getting old, can't wait.", vi: "Sao các con không định có con? Bọn ta tuổi này đợi không nổi nữa." },
      { speaker: "梅", chinese: "妈, 我们想再等两年, 工作稳定一些。", pinyin: "Mā, wǒmen xiǎng zài děng liǎng nián, gōngzuò wěndìng yīxiē.", english: "Mom, we want to wait two years, until work is more stable.", vi: "Mẹ ơi, bọn con muốn đợi hai năm nữa, công việc ổn định hơn đã." },
      { speaker: "婆婆", chinese: "工作什么时候才稳定? 越早生越好。", pinyin: "Gōngzuò shénme shíhou cái wěndìng? Yuè zǎo shēng yuè hǎo.", english: "When will work ever be stable? Sooner the better.", vi: "Công việc khi nào mới ổn? Càng sớm sinh càng tốt." },
      { speaker: "梅", chinese: "我理解您的关心, 但这是我和明华一起的决定, 希望您尊重。", pinyin: "Wǒ lǐjiě nín de guānxīn, dàn zhè shì wǒ hé Mínghuá yīqǐ de juédìng, xīwàng nín zūnzhòng.", english: "I understand your concern, but this is our decision, hope you'll respect it.", vi: "Con hiểu mẹ quan tâm, nhưng đây là quyết định của con và Minh Hoa, mong mẹ tôn trọng." }
    ],
    dialogue_long: [
      { speaker: "婆婆", chinese: "小梅, 妈跟你说一件事。我跟你公公商量过了, 你们结婚两年了, 是不是该考虑要孩子?", pinyin: "Xiǎo Méi, mā gēn nǐ shuō yī jiàn shì. Wǒ gēn nǐ gōnggong shāngliang guò le, nǐmen jiéhūn liǎng nián le, shì bù shì gāi kǎolǜ yào háizi?", english: "Little Mei, let me tell you something. I've discussed with your father-in-law — you've been married two years, isn't it time to think about kids?", vi: "Tiểu Mai, mẹ nói con việc này. Mẹ với bố chồng đã bàn rồi, các con cưới hai năm rồi, có nên nghĩ chuyện con cái không?" },
      { speaker: "梅", chinese: "妈, 我和明华讨论过了, 我们想再等两年。", pinyin: "Mā, wǒ hé Mínghuá tǎolùn guò le, wǒmen xiǎng zài děng liǎng nián.", english: "Mom, Minghua and I discussed it — we want to wait two more years.", vi: "Mẹ ơi, con với Minh Hoa đã thảo luận rồi, bọn con muốn đợi thêm hai năm nữa." },
      { speaker: "婆婆", chinese: "为什么要等? 你今年三十了, 越往后越难生。我邻居家的儿媳妇三十二才生, 难产, 在医院躺了一个月。", pinyin: "Wèishénme yào děng? Nǐ jīnnián sānshí le, yuè wǎng hòu yuè nán shēng. Wǒ línjū jiā de érxífu sānshí èr cái shēng, nánchǎn, zài yīyuàn tǎng le yī gè yuè.", english: "Why wait? You're 30 this year — the longer you wait, the harder. My neighbor's daughter-in-law had hers at 32, difficult labor, hospitalized a month.", vi: "Sao phải đợi? Năm nay con 30 rồi, càng để lâu càng khó sinh. Con dâu nhà hàng xóm sinh năm 32 tuổi, khó sinh, nằm viện cả tháng." },
      { speaker: "梅", chinese: "妈, 我知道您是为我好, 担心健康的事。但是我们越南也有一些家庭三十多才生第一个, 大家都好好的。", pinyin: "Mā, wǒ zhīdào nín shì wèi wǒ hǎo, dānxīn jiànkāng de shì. Dànshì wǒmen Yuènán yě yǒu yīxiē jiātíng sānshí duō cái shēng dì yī gè, dàjiā dōu hǎohǎo de.", english: "Mom, I know you mean well, worried about health. But many Vietnamese families have first child after 30, everyone's fine.", vi: "Mẹ ơi, con biết mẹ vì tốt cho con, lo cho sức khỏe. Nhưng ở Việt Nam cũng có nhiều gia đình ngoài 30 mới sinh con đầu, mọi người đều khỏe mạnh." },
      { speaker: "婆婆", chinese: "可是我和你公公等着抱孙子啊。我们这把年纪了, 还能等多久?", pinyin: "Kěshì wǒ hé nǐ gōnggong děngzhe bào sūnzi a. Wǒmen zhè bǎ niánjì le, hái néng děng duō jiǔ?", english: "But we're waiting to hold a grandchild. At our age, how long can we wait?", vi: "Nhưng bố mẹ chồng đợi bế cháu. Tuổi này rồi, còn đợi được bao lâu?" },
      { speaker: "梅", chinese: "妈, 我理解您的心情。但是我想跟您说几个原因, 希望您能理解。", pinyin: "Mā, wǒ lǐjiě nín de xīnqíng. Dànshì wǒ xiǎng gēn nín shuō jǐ gè yuányīn, xīwàng nín néng lǐjiě.", english: "Mom, I understand your feelings. But let me explain a few reasons, hope you'll understand.", vi: "Mẹ ơi, con hiểu tâm trạng mẹ. Nhưng con muốn nói mấy lý do với mẹ, mong mẹ thông cảm." },
      { speaker: "婆婆", chinese: "你说。", pinyin: "Nǐ shuō.", english: "Go ahead.", vi: "Con nói đi." },
      { speaker: "梅", chinese: "第一, 我们刚买房, 房贷压力大, 想再稳定两年。第二, 我刚升职, 工作正在关键期。第三, 我妈在越南身体不好, 我想多陪她两年。", pinyin: "Dì yī, wǒmen gāng mǎi fáng, fángdài yālì dà, xiǎng zài wěndìng liǎng nián. Dì èr, wǒ gāng shēngzhí, gōngzuò zhèngzài guānjiàn qī. Dì sān, wǒ mā zài Yuènán shēntǐ bù hǎo, wǒ xiǎng duō péi tā liǎng nián.", english: "First, we just bought a house, mortgage pressure is big. Second, I just got promoted, work is at a key stage. Third, my mom in Vietnam isn't well, I want to spend more time with her.", vi: "Thứ nhất, bọn con vừa mua nhà, áp lực vay mua nhà lớn, muốn ổn định thêm hai năm. Thứ hai, con vừa được thăng chức, công việc đang vào giai đoạn quan trọng. Thứ ba, mẹ con ở Việt Nam sức khỏe không tốt, con muốn ở bên mẹ thêm hai năm." },
      { speaker: "婆婆", chinese: "你妈妈身体不好? 怎么没听明华说过?", pinyin: "Nǐ māma shēntǐ bù hǎo? Zěnme méi tīng Mínghuá shuō guò?", english: "Your mom isn't well? Why didn't Minghua mention it?", vi: "Mẹ con sức khỏe không tốt à? Sao Minh Hoa không nhắc?" },
      { speaker: "梅", chinese: "她有高血压和糖尿病, 我每个月回去看她一次。如果有了孩子, 怕回去就不那么方便了。", pinyin: "Tā yǒu gāo xuèyā hé tángniàobìng, wǒ měi gè yuè huíqù kàn tā yī cì. Rúguǒ yǒu le háizi, pà huíqù jiù bù nàme fāngbiàn le.", english: "She has high blood pressure and diabetes — I go back monthly. With a child, going back wouldn't be as easy.", vi: "Mẹ có cao huyết áp và tiểu đường, mỗi tháng con về thăm một lần. Nếu có con, sợ đi về không thuận tiện như bây giờ." },
      { speaker: "婆婆", chinese: "原来是这样。妈不知道这些事情, 是妈说话太着急了。", pinyin: "Yuánlái shì zhèyàng. Mā bù zhīdào zhèxiē shìqing, shì mā shuōhuà tài zháojí le.", english: "I see. Mom didn't know all this, mom was too pushy.", vi: "Hóa ra thế. Mẹ không biết những chuyện này, mẹ nói quá nóng vội rồi." },
      { speaker: "梅", chinese: "妈, 您没说错什么, 您也是为我们好。我们各让一步: 两年后我和明华一定要孩子, 您看可以吗?", pinyin: "Mā, nín méi shuō cuò shénme, nín yěshì wèi wǒmen hǎo. Wǒmen gè ràng yī bù: liǎng nián hòu wǒ hé Mínghuá yīdìng yào háizi, nín kàn kěyǐ ma?", english: "Mom, you didn't say anything wrong, you mean well too. Let's each compromise: in two years Minghua and I will definitely have a child, okay?", vi: "Mẹ ơi, mẹ không sai gì, mẹ cũng vì tốt cho bọn con. Mỗi bên nhường một bước: hai năm sau con với Minh Hoa nhất định sẽ có con, mẹ thấy được không?" },
      { speaker: "婆婆", chinese: "好, 那妈就等两年。但是你妈身体的事, 是不是需要我帮忙? 我可以去越南陪她一段时间。", pinyin: "Hǎo, nà mā jiù děng liǎng nián. Dànshì nǐ mā shēntǐ de shì, shì bù shì xūyào wǒ bāngmáng? Wǒ kěyǐ qù Yuènán péi tā yīduàn shíjiān.", english: "Okay, mom will wait two years. But about your mom's health — do you need help? I could go to Vietnam to be with her for a while.", vi: "Được, vậy mẹ đợi hai năm. Nhưng chuyện sức khỏe mẹ con, có cần mẹ giúp không? Mẹ có thể sang Việt Nam ở với mẹ con một thời gian." },
      { speaker: "梅", chinese: "妈, 您真的太好了。我跟我妈说说, 看她意思。", pinyin: "Mā, nín zhēn de tài hǎo le. Wǒ gēn wǒ mā shuōshuo, kàn tā yìsi.", english: "Mom, you're really wonderful. Let me ask my mom what she thinks.", vi: "Mẹ ơi, mẹ tốt quá. Con sẽ hỏi mẹ con xem ý mẹ con thế nào." },
      { speaker: "婆婆", chinese: "和睦相处最重要, 一家人嘛。", pinyin: "Hémù xiāngchǔ zuì zhòngyào, yī jiā rén ma.", english: "Living harmoniously matters most — we're family.", vi: "Hòa thuận với nhau là quan trọng nhất, gia đình mà." },
      { speaker: "梅", chinese: "对, 妈, 谢谢您理解我们。", pinyin: "Duì, mā, xièxie nín lǐjiě wǒmen.", english: "Yes mom, thank you for understanding.", vi: "Đúng rồi mẹ, cảm ơn mẹ đã thông cảm với bọn con." }
    ],
    roleplay_prompts: [
      "Bố chồng/mẹ chồng phê bình cách bạn nấu ăn (cho con) — ví dụ ít muối, không dùng xì dầu Trung Quốc kiểu cũ. Hãy giải thích cách nấu Việt Nam + đề xuất thử kết hợp + KHÔNG nói 'cách của mẹ sai'. Dùng cụm '我们越南这样做也很好吃, 您也可以试试'.",
      "Mẹ chồng nhắc đi nhắc lại 'em phải gọi điện cho bà mỗi ngày'. Bạn cảm thấy quá nhiều. Hãy đặt giới hạn nhẹ nhàng: 'cuối tuần con sẽ gọi đều, ngày thường con bận công việc, mẹ thông cảm'. KHÔNG nói 'mẹ kỳ vọng quá'.",
      "Bố vợ hỏi lương của bạn (chuẩn mực Trung Quốc — gia đình thân biết tiền của nhau). Bạn không muốn tiết lộ chi tiết. Hãy đáp khéo: 'lương con đủ chi tiêu cho gia đình, dư một ít để dành. Cụ thể con không tiện nói'. Lịch sự + không cứng."
    ],
    register_notes: "Quan hệ với bố mẹ chồng/vợ Trung Quốc dùng register CỰC FORMAL ban đầu, dần thân thiện. Xưng hô:\n\n- 妈 (mā) = mẹ chồng (tiếng Trung con dâu/rể đều gọi mẹ chồng/vợ là 妈, không có '婆婆' khi đối thoại trực tiếp — '婆婆' là từ kể về bà)\n- 爸 (bà) = bố chồng/bố vợ (cùng cách)\n- 您 (nín) BẮT BUỘC trong mọi đối thoại, kể cả khi đã thân nhiều năm\n- KHÔNG dùng tên riêng (李阿姨, 王叔叔) — quá xa cách\n- KHÔNG dùng 你 với bố mẹ chồng/vợ — vô lễ trong văn hóa Trung Quốc đại lục\n\nKhi bất đồng:\n- KHÔNG '您说错了' (mẹ nói sai) — leo thang ngay\n- DÙNG '我理解您的关心, 但是...' (con hiểu mẹ quan tâm, nhưng...)\n- DÙNG '我们越南的习惯是...' (phong tục Việt Nam của bọn con là...) — chuyển sang khung 'khác biệt văn hóa', không phải 'mẹ sai'\n- DÙNG '各让一步' (mỗi bên nhường) — đề xuất compromise\n- KẾT THÚC bằng cụm khẳng định quan hệ: '我永远是您的儿媳妇' / '一家人嘛'\n\nKhi mẹ chồng đề xuất giúp đỡ (chăm con, nấu ăn, chuyển đến ở chung):\n- KHÔNG từ chối thẳng — vô ơn trong văn hóa Trung Quốc\n- DÙNG 'mẹ tốt quá, con cảm ơn mẹ' + 'con sẽ thảo luận với chồng/vợ rồi báo lại'\n- Sau đó từ chối qua chồng/vợ với lý do thực tế (nhà nhỏ, công việc bận)\n\nTránh: (a) Tranh cãi trước mặt cả nhà — luôn nói riêng; (b) Kéo chồng/vợ vào tranh chấp công khai — đặt họ vào thế khó; (c) Khoe gia đình nhà mình hơn nhà chồng — gây tổn thương sâu; (d) Nhắn tin gay gắt qua WeChat — viết là bằng chứng, vĩnh viễn.",
    idiom_glosses: [
      {
        idiom: "和睦相处",
        literal: "hòa thuận chung sống (hé mù xiāng chǔ)",
        meaning: "Sống hòa thuận với nhau — mục tiêu cao nhất của gia đình mở rộng. Cụm chuẩn để mẹ chồng/vợ kết thúc bất đồng: '一家人嘛, 和睦相处最重要'. Dùng để nhắc nhau ưu tiên hòa khí.",
        example: "婆媳关系最重要的是和睦相处。"
      },
      {
        idiom: "各让一步",
        literal: "mỗi bên nhường một bước (gè ràng yī bù)",
        meaning: "Mỗi bên lùi một bước — đề xuất compromise công bằng. Cụm dùng khi không thể đồng ý hoàn toàn: '我们各让一步, 找一个折中方案'. Tinh thần thỏa hiệp văn hóa Á Đông.",
        example: "家事难断, 各让一步就好。"
      },
      {
        idiom: "求同存异",
        literal: "cầu đồng tồn dị (qiú tóng cún yì)",
        meaning: "Tìm điểm chung, giữ điểm khác — không cần đồng thuận hoàn toàn. Áp dụng tốt cho khác biệt văn hóa Việt-Trung trong gia đình: 'mình 求同存异, không phải tranh ai đúng'.",
        example: "我们文化不同, 求同存异就好。"
      },
      {
        idiom: "将心比心",
        literal: "lấy lòng đo lòng (jiāng xīn bǐ xīn)",
        meaning: "Đặt mình vào vị trí người khác — đồng cảm. Cụm dùng để xin mẹ chồng/vợ thấu hiểu hoàn cảnh: '将心比心, 您也曾是儿媳妇' (đặt mình vào, mẹ cũng từng là con dâu). Cụm rất mạnh khi dùng đúng lúc.",
        example: "将心比心, 我能理解您的想法。"
      }
    ],
    cultural_notes_vi: "Quan hệ con dâu - mẹ chồng (婆媳关系 — póxí guānxi) là một trong những mối quan hệ phức tạp nhất trong gia đình Trung Quốc. Khác Việt Nam ở vài điểm:\n\n(1) GIA ĐÌNH MỞ RỘNG: ở Trung Quốc đại lục (đặc biệt vùng nông thôn + thành phố nhỏ), bố mẹ chồng kỳ vọng can dự sâu vào đời sống con — lựa chọn nhà, đặt tên cháu, chăm cháu, quyết định khi nào sinh con thứ hai. Vợ chồng trẻ ở thành phố lớn (Bắc Kinh, Thượng Hải) đã thay đổi nhưng quê thì vẫn vậy. Bạn lấy chồng/vợ Trung Quốc cần biết gia đình họ thuộc cấp độ nào.\n\n(2) CON DÂU LÀ 'NGƯỜI NHÀ NHƯNG NGƯỜI NGOÀI': khái niệm '半个外人' (nửa người ngoài) — về mặt pháp luật là vợ con trai, về mặt văn hóa vẫn cần thời gian để được công nhận hoàn toàn. Khác Việt Nam (con dâu nhanh chóng được coi là con). Đầu tư 3-5 năm để xây quan hệ tốt.\n\n(3) MẸ CHỒNG TRUNG QUỐC THƯỜNG NÓI THẲNG: không bóng gió. Khen thì khen công khai, chê cũng chê công khai. Người Việt thường thấy 'thô lỗ' — nhưng đó là phong cách thân mật của họ. Đừng coi mọi lời nhận xét là tấn công cá nhân.\n\n(4) ÁP LỰC SINH CON, CHĂM CON: cao hơn Việt Nam. 'Cháu nội' (孙子) đặc biệt quan trọng cho hệ thống dòng họ Trung Quốc. Nếu vợ chồng bạn không muốn có con sớm hoặc không muốn có con, đây sẽ là điểm xung đột chính. Cách xử lý: đưa lý do CỤ THỂ + thời gian dự kiến + cam kết.\n\n(5) TIỀN BẠC GIA ĐÌNH: bố mẹ chồng có thể hỏi lương, hỏi tiền tiết kiệm, đề xuất bạn đưa tiền về quê hàng tháng. Đây là chuẩn mực 'gia đình một mối'. Cách từ chối khéo: 'bọn con đang trả nợ mua nhà, chưa dư nhiều' — không nói 'không có'.\n\nVề lễ Tết và quà: con dâu Việt Nam lấy chồng Trung Quốc cần học kỹ. Tết âm lịch tặng quà bố mẹ chồng (mỗi bên 200-1,000 tệ). Sinh nhật, Tết Trung Thu, đầu năm — đều có. Đặc sản Việt Nam (cà phê, bánh đậu xanh) là quà lý tưởng — vừa tinh tế vừa thể hiện gốc văn hóa.\n\nVề ngôn ngữ: bố mẹ chồng/vợ thường hơn 50 tuổi → khả năng tiếng Anh rất hạn chế. Bạn PHẢI học tiếng Trung tốt để giao tiếp trực tiếp. Học tiếng địa phương của họ (giọng Bắc Kinh, Thượng Hải, Quảng Đông) là điểm cộng rất lớn — họ sẽ cảm thấy được tôn trọng.\n\nVề mâu thuẫn: ƯU TIÊN giải quyết qua chồng/vợ — họ đóng vai trò trung gian. Đừng đối đầu trực tiếp với mẹ chồng. Nếu bố mẹ chồng làm bạn buồn, NÓI VỚI CHỒNG/VỢ TRƯỚC, để họ truyền đạt — văn hóa 'không trực tiếp' (间接 — jiànjiē).",
    tip_advice_vi: "(1) HỌC GỌI TÊN ĐÚNG ngay từ đầu: 妈 (mẹ chồng/vợ), 爸 (bố chồng/vợ), 哥 (anh chồng), 嫂 (chị dâu)... Sai gọi tên = bị coi là không nghiêm túc. Hỏi chồng/vợ list cách gọi cho cả gia đình và học thuộc trước khi gặp lần đầu. (2) HỌC NẤU 1-2 MÓN TRUNG QUỐC chuẩn (đặc biệt món của bố/mẹ chồng — ví dụ Tứ Xuyên thì học 麻婆豆腐, Bắc Kinh thì 京酱肉丝). Nấu cho họ ăn trong cuộc gặp đầu = bonding mạnh. Học từ video Bilibili + thực tập 5-10 lần trước. (3) MANG QUÀ ĐẶC SẢN VIỆT NAM mỗi lần thăm: cà phê G7 cao cấp, bánh đậu xanh Hải Dương, lụa Vạn Phúc, tranh Đông Hồ. Tổng giá trị 200-500 tệ. Gói gọn gàng, KHÔNG đỏ-đen (màu tang). (4) DÀNH RIÊNG 5-10 PHÚT mỗi lần gặp để TRÒ CHUYỆN với mẹ chồng — về sức khỏe, hàng xóm, trẻ con, công việc. Đừng chỉ làm việc nhà rồi đi. Đầu tư thời gian = đầu tư quan hệ. (5) LƯU SỐ ĐT mẹ chồng + gọi mỗi tuần 1 lần (15-20 phút) — kể cả không có gì cụ thể. Hỏi sức khỏe, kể chuyện công việc nhẹ. Mẹ chồng Trung Quốc cảm thấy được quan tâm khi bạn chủ động liên lạc. (6) KHI BẤT ĐỒNG: KHÔNG cãi trước mặt cả nhà. Rút lui (đi nấu ăn, chăm con, ra ngoài), bình tĩnh lại, sau đó nói RIÊNG với mẹ chồng hoặc qua chồng. Không gây mất mặt mẹ chồng trước người khác. (7) NHỚ NGÀY SINH NHẬT, KỶ NIỆM bố mẹ chồng: đặt nhắc nhở trên điện thoại. Lễ Trung Thu, Tết âm — gọi đầu tiên. Mẹ chồng Trung Quốc nhớ rất kỹ ai đã nhớ ai đã quên.",
    exercises: [
      { type: "fill-blank", question: "妈, 我知道您是 ___ 我们好, 但这件事我们想自己决定。", answer: "为" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung gia đình với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "婆婆", pinyin: "pó po", english: "mẹ chồng" },
          { chinese: "儿媳妇", pinyin: "ér xí fu", english: "con dâu" },
          { chinese: "和睦相处", pinyin: "hé mù xiāng chǔ", english: "hòa thuận chung sống" },
          { chinese: "各让一步", pinyin: "gè ràng yī bù", english: "mỗi bên nhường một bước" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Mẹ ơi, con biết mẹ vì tốt cho bọn con. Phong tục Việt Nam bọn con hơi khác, mong mẹ thông cảm. Mỗi bên nhường một bước nhé.",
        chinese: "妈, 我知道您是为我们好。我们越南的习惯有点不一样, 希望您能理解。我们各让一步吧。",
        pinyin: "Mā, wǒ zhī dào nín shì wèi wǒ men hǎo. Wǒ men Yuè nán de xí guàn yǒu diǎn bù yī yàng, xī wàng nín néng lǐ jiě. Wǒ men gè ràng yī bù ba."
      }
    ]
  },
  {
    id: 83,
    level: "B2",
    category: "personal_social",
    title: "和中国朋友的生活方式分歧",
    pinyin: "hé zhōng guó péng you de shēng huó fāng shì fēn qí",
    topic: "Lifestyle disagreement with Chinese friend (work-life balance, dating, finance)",
    title_vi: "Bất đồng về lối sống với bạn Trung Quốc (work-life balance, hẹn hò, tiền bạc)",
    title_en: "Lifestyle disagreement with Chinese friend",
    sentences: [
      {
        chinese: "我觉得996的工作太累了, 长期下去身体会受不了。",
        pinyin: "Wǒ juéde jiǔjiǔliù de gōngzuò tài lèi le, chángqī xiàqù shēntǐ huì shòu bù liǎo.",
        english: "I think 996 work is too tiring — long-term, the body can't handle it.",
        vi: "Em thấy lịch 996 mệt quá, lâu dài cơ thể không chịu nổi.",
        pronunciation_focus: ["996 → jiǔjiǔliù (9am-9pm 6 days/week)", "工作 → gōngzuò (công việc)", "受不了 → shòu bù liǎo (không chịu nổi)", "长期 → chángqī (lâu dài)"]
      },
      {
        chinese: "我懂你的想法, 但每个人的选择都不一样。",
        pinyin: "Wǒ dǒng nǐ de xiǎngfǎ, dàn měi gè rén de xuǎnzé dōu bù yīyàng.",
        english: "I understand your view, but everyone's choice is different.",
        vi: "Mình hiểu cách nghĩ của bạn, nhưng mỗi người có lựa chọn riêng.",
        pronunciation_focus: ["想法 → xiǎngfǎ (ý kiến / cách nghĩ)", "选择 → xuǎnzé (lựa chọn)", "不一样 → bù yīyàng (không giống)", "每个人 → měi gè rén"]
      },
      {
        chinese: "你喜欢拼事业, 我更喜欢平衡, 这没有对错。",
        pinyin: "Nǐ xǐhuan pīn shìyè, wǒ gèng xǐhuan pínghéng, zhè méiyǒu duì cuò.",
        english: "You like grinding career, I prefer balance — there's no right or wrong.",
        vi: "Bạn thích lao đầu vào sự nghiệp, mình thích cân bằng hơn, không ai đúng sai.",
        pronunciation_focus: ["拼事业 → pīn shìyè (lao vào sự nghiệp)", "平衡 → pínghéng (cân bằng)", "对错 → duì cuò (đúng sai)", "更喜欢 → gèng xǐhuan"]
      },
      {
        chinese: "我们见仁见智, 互相尊重就好。",
        pinyin: "Wǒmen jiàn rén jiàn zhì, hùxiāng zūnzhòng jiùhǎo.",
        english: "We see things differently — mutual respect is enough.",
        vi: "Mỗi người một ý, tôn trọng nhau là được rồi.",
        pronunciation_focus: ["见仁见智 → jiàn rén jiàn zhì (idiom: mỗi người một ý)", "互相 → hùxiāng (lẫn nhau)", "尊重 → zūnzhòng (tôn trọng)", "就好 → jiù hǎo"]
      },
      {
        chinese: "不管选什么, 朋友还是朋友, 别因为这个伤感情。",
        pinyin: "Bùguǎn xuǎn shénme, péngyou háishì péngyou, bié yīnwèi zhège shāng gǎnqíng.",
        english: "Whatever we choose, friends remain friends — don't let this hurt our friendship.",
        vi: "Dù chọn gì đi nữa, bạn bè vẫn là bạn bè, đừng vì việc này mà tổn thương tình cảm.",
        pronunciation_focus: ["不管 → bùguǎn (dù gì)", "伤感情 → shāng gǎnqíng (tổn thương tình cảm)", "朋友 → péngyou", "还是 → háishì"]
      }
    ],
    vocab: [
      { chinese: "生活方式", pinyin: "shēng huó fāng shì", english: "lifestyle", vi: "lối sống" },
      { chinese: "分歧", pinyin: "fēn qí", english: "disagreement", vi: "bất đồng" },
      { chinese: "拼事业", pinyin: "pīn shì yè", english: "to grind career", vi: "lao vào sự nghiệp" },
      { chinese: "平衡", pinyin: "píng héng", english: "balance", vi: "cân bằng" },
      { chinese: "996", pinyin: "jiǔ jiǔ liù", english: "9am-9pm 6 days/week", vi: "lịch 996 (lao động cường độ cao)" },
      { chinese: "对错", pinyin: "duì cuò", english: "right or wrong", vi: "đúng sai" },
      { chinese: "见仁见智", pinyin: "jiàn rén jiàn zhì", english: "different perspectives", vi: "mỗi người một ý" },
      { chinese: "互相尊重", pinyin: "hù xiāng zūn zhòng", english: "mutual respect", vi: "tôn trọng lẫn nhau" },
      { chinese: "伤感情", pinyin: "shāng gǎn qíng", english: "to hurt feelings (friendship)", vi: "tổn thương tình cảm" },
      { chinese: "三观不合", pinyin: "sān guān bù hé", english: "values don't align (worldview)", vi: "ba quan điểm không hợp" }
    ],
    dialogue: [
      { speaker: "李同事", chinese: "你最近怎么早就下班了? 是不是没事做?", pinyin: "Nǐ zuìjìn zěnme zǎo jiù xiàbān le? Shì bù shì méi shì zuò?", english: "Why are you leaving work early lately? No work to do?", vi: "Sao dạo này bạn về sớm thế? Hết việc làm rồi à?" },
      { speaker: "梅", chinese: "工作做完了我就走, 我不喜欢加班。", pinyin: "Gōngzuò zuò wán le wǒ jiù zǒu, wǒ bù xǐhuan jiābān.", english: "Work done, I go. I don't like overtime.", vi: "Mình xong việc thì về, mình không thích tăng ca." },
      { speaker: "李同事", chinese: "在中国不加班怎么升职? 老板不喜欢这种员工。", pinyin: "Zài Zhōngguó bù jiābān zěnme shēngzhí? Lǎobǎn bù xǐhuan zhè zhǒng yuángōng.", english: "In China, no overtime = no promotion. Bosses don't like this kind of employee.", vi: "Ở Trung Quốc không tăng ca thì sao thăng chức? Sếp không thích kiểu nhân viên này." },
      { speaker: "梅", chinese: "我懂, 但我有家人需要陪。我和你的选择不一样, 互相理解就好。", pinyin: "Wǒ dǒng, dàn wǒ yǒu jiārén xūyào péi. Wǒ hé nǐ de xuǎnzé bù yīyàng, hùxiāng lǐjiě jiùhǎo.", english: "I get it, but I have family to spend time with. We choose differently, mutual understanding is enough.", vi: "Mình hiểu, nhưng mình có gia đình cần ở bên. Mình và bạn lựa chọn khác nhau, hiểu nhau là được." }
    ],
    dialogue_long: [
      { speaker: "李同事", chinese: "梅, 我跟你说, 你这样下去事业上很吃亏。同期入职的人都已经升副经理了, 就你还在原地。", pinyin: "Méi, wǒ gēn nǐ shuō, nǐ zhèyàng xiàqù shìyè shàng hěn chīkuī. Tóngqī rùzhí de rén dōu yǐjīng shēng fù jīnglǐ le, jiù nǐ hái zài yuándì.", english: "Mei, let me tell you — your career will suffer this way. Everyone who joined with you is already deputy manager, only you're still in place.", vi: "Mai, mình nói thật, bạn cứ thế này sự nghiệp sẽ thiệt thòi. Người vào cùng đợt với bạn đều đã lên phó giám đốc, chỉ mình bạn còn ở chỗ cũ." },
      { speaker: "梅", chinese: "我知道, 但我有自己的考虑。", pinyin: "Wǒ zhīdào, dàn wǒ yǒu zìjǐ de kǎolǜ.", english: "I know, but I have my own considerations.", vi: "Mình biết, nhưng mình có cân nhắc riêng." },
      { speaker: "李同事", chinese: "什么考虑? 你不想升职吗?", pinyin: "Shénme kǎolǜ? Nǐ bù xiǎng shēngzhí ma?", english: "What considerations? Don't you want a promotion?", vi: "Cân nhắc gì? Bạn không muốn thăng chức à?" },
      { speaker: "梅", chinese: "想啊, 但不想以牺牲健康为代价。我每天工作十二小时, 周末还要加班, 这样下去三年我会得胃病。我看到我前公司的同事就是这样。", pinyin: "Xiǎng a, dàn bù xiǎng yǐ xīshēng jiànkāng wéi dàijià. Wǒ měi tiān gōngzuò shí'èr xiǎoshí, zhōumò hái yào jiābān, zhèyàng xiàqù sān nián wǒ huì dé wèibìng. Wǒ kàndào wǒ qián gōngsī de tóngshì jiùshì zhèyàng.", english: "I do, but not at the cost of health. Working 12 hours daily plus weekends — in 3 years I'd have stomach disease. I saw my old colleagues end up that way.", vi: "Muốn chứ, nhưng không muốn đánh đổi sức khỏe. Làm 12 tiếng mỗi ngày, cuối tuần tăng ca, 3 năm sau sẽ bị đau dạ dày. Mình thấy đồng nghiệp công ty cũ như thế." },
      { speaker: "李同事", chinese: "可是大家都这样啊。我也是, 我老公也是, 我们身边的人都是。你越南人想法不一样吗?", pinyin: "Kěshì dàjiā dōu zhèyàng a. Wǒ yěshì, wǒ lǎogōng yěshì, wǒmen shēnbiān de rén dōu shì. Nǐ Yuènán rén xiǎngfǎ bù yīyàng ma?", english: "But everyone's like this. Me, my husband, everyone around us. Do Vietnamese think differently?", vi: "Nhưng ai cũng vậy mà. Mình cũng thế, chồng mình cũng thế, người xung quanh đều thế. Người Việt suy nghĩ khác à?" },
      { speaker: "梅", chinese: "也不是越南人都这样, 我有越南朋友比中国人更拼。这是我个人的选择, 不代表全部越南人。", pinyin: "Yě bù shì Yuènán rén dōu zhèyàng, wǒ yǒu Yuènán péngyou bǐ Zhōngguó rén gèng pīn. Zhè shì wǒ gèrén de xuǎnzé, bù dàibiǎo quánbù Yuènán rén.", english: "Not all Vietnamese — I have Vietnamese friends more driven than Chinese. This is my personal choice, doesn't represent all Vietnamese.", vi: "Không phải người Việt nào cũng thế, mình có bạn Việt còn cày hơn người Trung. Đây là lựa chọn cá nhân, không đại diện cho người Việt." },
      { speaker: "李同事", chinese: "那你的选择, 你的目标是什么? 不拼事业, 想过什么样的生活?", pinyin: "Nà nǐ de xuǎnzé, nǐ de mùbiāo shì shénme? Bù pīn shìyè, xiǎng guò shénme yàng de shēnghuó?", english: "Then what's your goal? Not chasing career, what kind of life?", vi: "Vậy lựa chọn của bạn, mục tiêu là gì? Không lao vào sự nghiệp, muốn sống thế nào?" },
      { speaker: "梅", chinese: "我想稳稳地工作, 每天有时间运动, 周末跟朋友吃饭, 每年回越南看父母两次。我升职慢一点没关系, 只要我健康、家人健康就好。", pinyin: "Wǒ xiǎng wěnwěn de gōngzuò, měi tiān yǒu shíjiān yùndòng, zhōumò gēn péngyou chīfàn, měi nián huí Yuènán kàn fùmǔ liǎng cì. Wǒ shēngzhí màn yīdiǎn méi guānxi, zhǐyào wǒ jiànkāng, jiārén jiànkāng jiùhǎo.", english: "Steady work, daily exercise time, weekend meals with friends, twice a year visiting parents in Vietnam. Slow promotion's fine if I'm healthy and family is healthy.", vi: "Mình muốn làm ổn định, mỗi ngày có thời gian tập thể dục, cuối tuần ăn cơm với bạn, mỗi năm về Việt Nam thăm bố mẹ hai lần. Thăng chức chậm một chút không sao, miễn là mình và gia đình khỏe mạnh." },
      { speaker: "李同事", chinese: "听起来挺好的, 但我做不到。我有房贷、车贷, 父母在老家等我寄钱。不拼怎么办?", pinyin: "Tīng qǐlái tǐng hǎo de, dàn wǒ zuò bù dào. Wǒ yǒu fángdài, chēdài, fùmǔ zài lǎojiā děng wǒ jì qián. Bù pīn zěnme bàn?", english: "Sounds nice, but I can't. I have mortgage, car loan, parents waiting for money. If not grinding, how?", vi: "Nghe hay đấy, nhưng mình không làm được. Mình có nợ mua nhà, nợ mua xe, bố mẹ ở quê đợi tiền. Không cày thì sao?" },
      { speaker: "梅", chinese: "你的情况和我不一样。你有家庭责任, 你必须拼。我没有那么多压力, 所以我可以选择慢一点。", pinyin: "Nǐ de qíngkuàng hé wǒ bù yīyàng. Nǐ yǒu jiātíng zérèn, nǐ bìxū pīn. Wǒ méiyǒu nàme duō yālì, suǒyǐ wǒ kěyǐ xuǎnzé màn yīdiǎn.", english: "Your situation differs. You have family duties, must grind. I don't have as much pressure, so I can choose slow.", vi: "Hoàn cảnh của bạn khác mình. Bạn có trách nhiệm gia đình, phải cày. Mình không có nhiều áp lực thế, nên có thể chọn chậm hơn." },
      { speaker: "李同事", chinese: "对, 我们的选择都有原因, 都没有错。", pinyin: "Duì, wǒmen de xuǎnzé dōu yǒu yuányīn, dōu méiyǒu cuò.", english: "Right, our choices have reasons, neither wrong.", vi: "Đúng, lựa chọn của mình đều có lý do, đều không sai." },
      { speaker: "梅", chinese: "对啊, 见仁见智嘛。我之前担心你以为我看不起拼事业的人, 其实我很佩服你的努力。", pinyin: "Duì a, jiàn rén jiàn zhì ma. Wǒ zhīqián dānxīn nǐ yǐwéi wǒ kàn bù qǐ pīn shìyè de rén, qíshí wǒ hěn pèifu nǐ de nǔlì.", english: "Yes, see things differently. I was worried you'd think I look down on career grinders — actually I admire your effort.", vi: "Đúng, mỗi người một ý mà. Trước mình lo bạn nghĩ mình coi thường người lao vào sự nghiệp, thực ra mình rất khâm phục nỗ lực của bạn." },
      { speaker: "李同事", chinese: "我也以为你觉得我傻, 这么拼为了什么。其实我跟你说出来反而轻松了。", pinyin: "Wǒ yě yǐwéi nǐ juéde wǒ shǎ, zhème pīn wèile shénme. Qíshí wǒ gēn nǐ shuō chūlái fǎn'ér qīngsōng le.", english: "I also thought you'd think I'm dumb, grinding for what. Actually saying it out loud feels lighter.", vi: "Mình cũng tưởng bạn nghĩ mình ngốc, cày để làm gì. Thực ra nói ra với bạn lại thấy nhẹ nhõm." },
      { speaker: "梅", chinese: "朋友就是这样, 互相尊重不同的选择。咱们改天一起去吃越南菜?", pinyin: "Péngyou jiùshì zhèyàng, hùxiāng zūnzhòng bùtóng de xuǎnzé. Zánmen gǎitiān yīqǐ qù chī Yuènán cài?", english: "That's friendship — respecting different choices. Let's go for Vietnamese food another day?", vi: "Bạn bè là vậy, tôn trọng lựa chọn khác nhau. Hôm khác mình đi ăn món Việt cùng nhau nhé?" },
      { speaker: "李同事", chinese: "好啊! 我也想看看你说的那种'平衡生活'是什么样的。", pinyin: "Hǎo a! Wǒ yě xiǎng kànkan nǐ shuō de nà zhǒng 'pínghéng shēnghuó' shì shénme yàng de.", english: "Great! I want to see this 'balanced life' you talk about.", vi: "Được! Mình cũng muốn xem 'cuộc sống cân bằng' bạn nói thế nào." }
    ],
    roleplay_prompts: [
      "Bạn Trung Quốc thuyết phục bạn đi xem phối hôn nhân (相亲 — xiāngqīn) qua bố mẹ. Bạn người Việt quen tự tìm bạn đời, không qua matchmaking. Hãy giải thích quan điểm của mình + tôn trọng quan điểm bạn + KHÔNG nói cách nào đúng. Dùng cụm '我们越南这边比较倾向于...'.",
      "Bạn Trung Quốc tiết kiệm 80% lương, thấy bạn người Việt chi cho ăn uống và du lịch là 'lãng phí'. Hãy bảo vệ lựa chọn chi tiêu của mình mà không phán xét lựa chọn tiết kiệm của bạn. Dùng cụm '每个人对幸福的定义不一样'.",
      "Bạn Trung Quốc đi tập gym 5 lần/tuần, ép bạn cùng tập. Bạn không thích gym, thích đi bộ + yoga nhẹ. Hãy từ chối lịch sự, đề xuất hoạt động chung khác (đi bộ công viên cuối tuần). Dùng cụm '健身有很多种, 适合自己的最重要'."
    ],
    register_notes: "Bất đồng lối sống với bạn Trung Quốc cần register trung gian — không quá formal (bạn bè), không quá thân thiết (vẫn là chủ đề cần khéo). 你 / 我 với bạn ngang cấp.\n\nNguyên tắc cốt lõi:\n- KHÔNG nói 'cách của bạn sai' (你的方式错了) — leo thang ngay\n- DÙNG '我和你的选择不一样' (mình và bạn lựa chọn khác nhau) — neutral\n- DÙNG '没有对错' (không có đúng sai) — định khung không phán xét\n- DÙNG '每个人有每个人的考虑' (mỗi người có cân nhắc riêng) — tôn trọng độc lập\n\nKhi bạn Trung Quốc đã thúc ép bạn:\n- KHÔNG '别管我' (đừng quản tôi) — vô lễ\n- DÙNG '谢谢你的关心, 但我已经想过了' (cảm ơn bạn quan tâm, nhưng mình đã suy nghĩ rồi)\n- DÙNG '我会考虑你的建议' (mình sẽ cân nhắc gợi ý của bạn) — kết thúc lịch sự dù không định làm theo\n\nKhi giải thích sự khác biệt:\n- KHÔNG '在越南我们这样, 在中国你们那样' (ở Việt Nam thế này, ở Trung Quốc thế kia) — quá generalize, gây cảm giác đối đầu văn hóa\n- DÙNG 'có thể do văn hóa khác, có thể do tính cách' — chia sẻ trách nhiệm giữa cá nhân + văn hóa\n- KHÔNG '我们越南人比较...' (người Việt bọn mình hơi...) — cô lập mình thành nhóm\n- DÙNG '我个人觉得...' (cá nhân mình thấy...) — quan điểm cá nhân, không tổng quát\n\nTránh: (a) Tranh cãi gay gắt về 996, áp lực xã hội Trung Quốc — chủ đề nhạy cảm với người trẻ Trung Quốc; (b) Khuyên bạn 'hãy nghỉ việc' — họ có hoàn cảnh bạn không hiểu; (c) Khoe Việt Nam tốt hơn về work-life balance — không đúng (Việt Nam cũng có overwork), gây phản cảm.",
    idiom_glosses: [
      {
        idiom: "见仁见智",
        literal: "thấy nhân thấy trí (jiàn rén jiàn zhì)",
        meaning: "Nhân giả thấy nhân, trí giả thấy trí — mỗi người nhìn nhận khác nhau. Cụm trung tính tuyệt vời cho bất đồng quan điểm: '这事见仁见智, 没有标准答案'. Khẳng định cả hai góc nhìn đều có giá trị.",
        example: "工作和生活的平衡, 见仁见智。"
      },
      {
        idiom: "各有所好",
        literal: "mỗi người có sở thích riêng (gè yǒu suǒ hào)",
        meaning: "Mỗi người có sở thích/lựa chọn khác nhau. Cụm dùng để chấp nhận khác biệt: '吃辣还是不吃辣, 各有所好'. Đối lập với tâm lý 'phải giống nhau'.",
        example: "拼事业还是要平衡, 各有所好。"
      },
      {
        idiom: "三观不合",
        literal: "ba quan điểm không hợp (sān guān bù hé)",
        meaning: "Ba quan điểm (世界观/人生观/价值观 — thế giới quan / nhân sinh quan / giá trị quan) không hợp — không cùng tần số sống. Cụm phổ biến trong giới trẻ Trung Quốc. Tránh áp đặt cụm này lên bạn — thường dùng để miêu tả người mình KHÔNG muốn thân thiết.",
        example: "我们三观不合, 但还是好朋友。"
      },
      {
        idiom: "互相尊重",
        literal: "lẫn nhau tôn trọng (hù xiāng zūn zhòng)",
        meaning: "Tôn trọng lẫn nhau — KHÔNG là idiom 4 chữ thuần nhưng cụm cốt lõi cho khác biệt. Câu chốt sau khi đã tranh luận: '我们互相尊重就好' (tôn trọng nhau là được rồi).",
        example: "朋友之间最重要的是互相尊重。"
      }
    ],
    cultural_notes_vi: "Bất đồng lối sống Việt-Trung là chủ đề tế nhị nhưng phổ biến trong tình bạn xuyên văn hóa. Năm điểm khác biệt thường gây tranh luận:\n\n(1) WORK CULTURE: Trung Quốc đại lục có '996' (9am-9pm, 6 ngày/tuần) trong tech và một số ngành. Đây là chuẩn mực được chấp nhận, dù bị chỉ trích. Người Việt thường có giờ làm 8-5 + 1-2 lần tăng ca/tuần. Khi bạn Trung Quốc nói '我加班到晚上11点' = không phàn nàn, là báo cáo bình thường. Không thương hại — họ không cảm thấy cần thương hại.\n\n(2) HỆ THỐNG HẸN HÒ / KẾT HÔN: Trung Quốc có truyền thống 相亲 (xiāngqīn — phối hôn nhân qua bố mẹ/người mai mối) vẫn phổ biến ở thành phố nhỏ + thế hệ lớn tuổi. Người trẻ thành phố thoát dần nhưng áp lực 'năm 30 tuổi vẫn chưa lấy chồng' cực mạnh. Khái niệm '剩女' (shèng nǚ — gái ế) là từ phổ biến và buồn. Người Việt không có khái niệm này mạnh đến vậy.\n\n(3) TIẾT KIỆM vs CHI TIÊU: tỷ lệ tiết kiệm hộ gia đình Trung Quốc cao nhất thế giới (~30-40% lương). Người Việt thường tiết kiệm ~15-25%. Nguyên nhân Trung Quốc: hệ thống an sinh xã hội yếu (y tế, hưu trí), văn hóa 'để con cháu', áp lực mua nhà cho con trai. Đừng coi thói tiết kiệm cực đoan của bạn Trung là 'keo kiệt' — đó là chiến lược sinh tồn.\n\n(4) FAMILY OBLIGATIONS: bố mẹ Trung Quốc gửi tiền hàng tháng cho ông bà ở quê là chuẩn mực. Người trẻ Trung Quốc thường gánh tài chính bố mẹ + ông bà 2 bên. Người Việt cũng có nhưng ít cường độ hơn. Khi bạn Trung Quốc nói 'mình phải gửi 5,000 tệ về quê' — đó không phải tự nguyện, là nghĩa vụ văn hóa.\n\n(5) FITNESS / HEALTH CULTURE: gym + tập thể hình rất phổ biến ở Trung Quốc đại lục đô thị (đặc biệt nam giới). Phòng gym 24/7 (Pure Fitness, Will's) ở Bắc Kinh, Thượng Hải. Người Việt thường tập nhẹ hơn — đi bộ, yoga, đạp xe. Khi bạn Trung Quốc đề xuất 'cùng đi gym 5 lần/tuần' = họ đang mời bạn vào hoạt động xã hội của họ. Từ chối nhẹ + đề xuất hoạt động khác.\n\nVỀ LỜI KHUYÊN không cần thiết: bạn bè Trung Quốc thường tự do đưa lời khuyên về lối sống của bạn. Đây không phải 'thô lỗ' mà là 'quan tâm thân tình'. Khác Việt Nam (lời khuyên thường được hỏi mới đưa). Không phật ý — cảm ơn + làm theo cách mình.\n\nVỀ CHỦ ĐỀ NHẠY CẢM riêng cá nhân (không phải chính trị): tiền lương, kế hoạch sinh con, lý do chưa kết hôn — bạn Trung Quốc có thể hỏi thẳng. Người Việt thường giấu. Cách trả lời: 'mình thoải mái với mức hiện tại', 'vẫn đang suy nghĩ', 'chưa gặp đúng người'. Nhẹ nhàng + không tiết lộ chi tiết.\n\nVỀ TỪ '三观' (sān guān — 3 quan điểm): rất phổ biến trong giới trẻ Trung Quốc — chỉ khái niệm tổng hợp về thế giới quan/nhân sinh quan/giá trị quan. '三观一致' = cùng tần số. '三观不合' = không cùng tần số. Khi bạn Trung Quốc nói '我们三观还挺一致的' = tín hiệu tốt cho tình bạn.",
    tip_advice_vi: "(1) NGHE TRƯỚC, NÓI SAU. Khi bạn Trung Quốc bộc lộ lối sống/áp lực, dành 5-10 phút LẮNG NGHE trước khi đưa quan điểm. Hỏi: '你为什么这样选?' (sao bạn chọn thế?) — họ có lý do bạn không biết. (2) CHỌN BATTLE: không phải mọi bất đồng đều cần thảo luận. Bạn Trung Quốc tiết kiệm 80% lương = chuyện riêng của họ, không cần khuyên. Bạn ép bạn cũng thế = cần đặt giới hạn. Phân biệt 'họ làm gì' vs 'họ ép tôi làm gì'. (3) DÙNG NGÔN NGỮ '我' (mình) thay vì '你' (bạn): 'mình thấy 996 mệt' tốt hơn 'bạn làm 996 hại sức khỏe'. Chuyển từ phán xét sang chia sẻ. (4) KHEN ĐIỂM TÍCH CỰC trước khi đưa khác biệt: 'mình rất khâm phục nỗ lực của bạn, nhưng cá nhân mình chọn cách khác'. Cấu trúc compliment-but mềm hóa cuộc nói chuyện. (5) CHỮA LÀNH bằng HOẠT ĐỘNG CHUNG: sau cuộc nói chuyện về bất đồng, đề xuất hoạt động cùng (đi cà phê, ăn món bạn yêu thích). Củng cố tình bạn vượt qua bất đồng. (6) TRÁNH TRANH LUẬN chính trị/tôn giáo/Việt-Trung quan hệ. Bất đồng lối sống = OK, bất đồng chính trị = mất bạn. Nếu bạn Trung Quốc nêu chủ đề chính trị, chuyển hướng nhanh: '这个比较复杂, 我们改天再聊'. (7) CHẤP NHẬN bạn không thể thay đổi bạn Trung Quốc, họ không thể thay đổi bạn. Tình bạn lành mạnh = tôn trọng khác biệt + chia sẻ điểm chung. Sau 1-2 năm, bạn sẽ thấy bạn Trung Quốc dần điều chỉnh (ít gây áp lực hơn) — đó là dấu hiệu tình bạn đang chín.",
    exercises: [
      { type: "fill-blank", question: "你喜欢拼事业, 我更喜欢平衡, 这没有 ___ 错。", answer: "对" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung lối sống với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "996", pinyin: "jiǔ jiǔ liù", english: "9am-9pm 6 ngày/tuần (lao động cường độ)" },
          { chinese: "见仁见智", pinyin: "jiàn rén jiàn zhì", english: "mỗi người một ý" },
          { chinese: "三观不合", pinyin: "sān guān bù hé", english: "ba quan điểm không hợp" },
          { chinese: "互相尊重", pinyin: "hù xiāng zūn zhòng", english: "tôn trọng lẫn nhau" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Mình hiểu cách nghĩ của bạn, nhưng mỗi người có lựa chọn riêng. Bạn thích lao đầu vào sự nghiệp, mình thích cân bằng hơn, không ai đúng sai.",
        chinese: "我懂你的想法, 但每个人的选择都不一样。你喜欢拼事业, 我更喜欢平衡, 这没有对错。",
        pinyin: "Wǒ dǒng nǐ de xiǎng fǎ, dàn měi gè rén de xuǎn zé dōu bù yī yàng. Nǐ xǐ huan pīn shì yè, wǒ gèng xǐ huan píng héng, zhè méi yǒu duì cuò."
      }
    ]
  },
  {
    id: 84,
    level: "B2",
    category: "personal_social",
    title: "安慰失去亲人的朋友",
    pinyin: "ān wèi shī qù qīn rén de péng you",
    topic: "Comforting a friend after a loss (family member or pet)",
    title_vi: "An ủi bạn vừa mất người thân hoặc thú cưng",
    title_en: "Comforting a friend after a loss",
    sentences: [
      {
        chinese: "听到这个消息我很难过, 节哀顺变。",
        pinyin: "Tīngdào zhège xiāoxi wǒ hěn nánguò, jié āi shùn biàn.",
        english: "I'm so sorry to hear this — please bear the grief and accept what happened.",
        vi: "Nghe tin này mình rất buồn, mong bạn nén đau thương vượt qua nghịch cảnh.",
        pronunciation_focus: ["难过 → nánguò (buồn)", "节哀顺变 → jié āi shùn biàn (idiom chuẩn an ủi tang)", "消息 → xiāoxi (tin)", "听到 → tīngdào"]
      },
      {
        chinese: "我能想象你现在有多难, 我陪着你。",
        pinyin: "Wǒ néng xiǎngxiàng nǐ xiànzài yǒu duō nán, wǒ péizhe nǐ.",
        english: "I can imagine how hard this is for you — I'm here with you.",
        vi: "Mình hình dung được lúc này bạn khó khăn thế nào, mình ở bên bạn.",
        pronunciation_focus: ["想象 → xiǎngxiàng (hình dung)", "陪着 → péizhe (ở bên)", "多难 → duō nán (khó thế nào)", "现在 → xiànzài"]
      },
      {
        chinese: "你不用强装坚强, 想哭就哭吧。",
        pinyin: "Nǐ bù yòng qiáng zhuāng jiānqiáng, xiǎng kū jiù kū ba.",
        english: "You don't have to pretend to be strong — cry if you need to.",
        vi: "Bạn không cần gồng lên mạnh mẽ, muốn khóc thì khóc đi.",
        pronunciation_focus: ["强装 → qiáng zhuāng (gồng lên giả)", "坚强 → jiānqiáng (mạnh mẽ)", "想哭就哭 → xiǎng kū jiù kū", "不用 → bù yòng"]
      },
      {
        chinese: "需要什么帮忙, 任何时候打电话给我。",
        pinyin: "Xūyào shénme bāngmáng, rènhé shíhou dǎ diànhuà gěi wǒ.",
        english: "If you need any help, call me anytime.",
        vi: "Cần giúp gì cứ gọi mình bất cứ lúc nào.",
        pronunciation_focus: ["帮忙 → bāngmáng (giúp đỡ)", "任何时候 → rènhé shíhou (bất cứ lúc nào)", "打电话 → dǎ diànhuà (gọi điện)", "需要 → xūyào"]
      },
      {
        chinese: "时间会慢慢治愈, 但思念永远在心里。",
        pinyin: "Shíjiān huì mànman zhìyù, dàn sīniàn yǒngyuǎn zài xīnlǐ.",
        english: "Time will slowly heal, but remembrance will always be in your heart.",
        vi: "Thời gian sẽ từ từ chữa lành, nhưng nhớ nhung mãi trong tim.",
        pronunciation_focus: ["治愈 → zhìyù (chữa lành)", "思念 → sīniàn (nhớ nhung)", "永远 → yǒngyuǎn (mãi mãi)", "心里 → xīnlǐ"]
      }
    ],
    vocab: [
      { chinese: "节哀顺变", pinyin: "jié āi shùn biàn", english: "bear grief, accept change (condolence idiom)", vi: "nén đau thương, vượt qua nghịch cảnh" },
      { chinese: "去世", pinyin: "qù shì", english: "to pass away (formal)", vi: "qua đời" },
      { chinese: "走了", pinyin: "zǒu le", english: "passed away (gentler)", vi: "đã đi rồi" },
      { chinese: "亲人", pinyin: "qīn rén", english: "family member / loved one", vi: "người thân" },
      { chinese: "葬礼", pinyin: "zàng lǐ", english: "funeral", vi: "tang lễ" },
      { chinese: "悼念", pinyin: "dào niàn", english: "to mourn", vi: "tưởng niệm" },
      { chinese: "陪伴", pinyin: "péi bàn", english: "to accompany", vi: "ở bên" },
      { chinese: "治愈", pinyin: "zhì yù", english: "to heal", vi: "chữa lành" },
      { chinese: "思念", pinyin: "sī niàn", english: "to miss / remembrance", vi: "nhớ nhung" },
      { chinese: "白事", pinyin: "bái shì", english: "funeral matters (set phrase)", vi: "việc tang" }
    ],
    dialogue: [
      { speaker: "朋友", chinese: "梅, 我外婆昨天走了。", pinyin: "Méi, wǒ wàipó zuótiān zǒu le.", english: "Mei, my grandma passed yesterday.", vi: "Mai, bà ngoại mình hôm qua mất rồi." },
      { speaker: "梅", chinese: "天啊, 节哀顺变。我能为你做什么吗?", pinyin: "Tiān a, jié āi shùn biàn. Wǒ néng wèi nǐ zuò shénme ma?", english: "Oh no, my deepest condolences. What can I do for you?", vi: "Trời ơi, mong bạn nén đau thương. Mình có thể làm gì cho bạn không?" },
      { speaker: "朋友", chinese: "现在很难受, 不知道说什么。", pinyin: "Xiànzài hěn nánshòu, bù zhīdào shuō shénme.", english: "Hurting now, don't know what to say.", vi: "Bây giờ mình đau lắm, không biết nói gì." },
      { speaker: "梅", chinese: "不需要说什么, 我陪着你就好。我现在过来吗?", pinyin: "Bù xūyào shuō shénme, wǒ péizhe nǐ jiùhǎo. Wǒ xiànzài guòlái ma?", english: "No need to say anything — I'm here. Should I come over now?", vi: "Không cần nói gì cả, mình ở bên bạn là đủ. Mình qua bên bạn ngay nhé?" }
    ],
    dialogue_long: [
      { speaker: "朋友", chinese: "梅... 我家小白今天早上走了。我陪了它十二年。", pinyin: "Méi... wǒ jiā Xiǎobái jīntiān zǎoshang zǒu le. Wǒ péi le tā shí'èr nián.", english: "Mei... our Xiaobai (dog) passed this morning. I had her 12 years.", vi: "Mai... Tiểu Bạch nhà mình sáng nay đi rồi. Mình ở bên nó 12 năm." },
      { speaker: "梅", chinese: "丽丽, 我太难过了。十二年是很深的感情。", pinyin: "Lìli, wǒ tài nánguò le. Shí'èr nián shì hěn shēn de gǎnqíng.", english: "Lili, I'm so sad. 12 years is deep love.", vi: "Lệ Lệ, mình buồn quá. 12 năm là tình cảm rất sâu." },
      { speaker: "朋友", chinese: "我从大学带它回家, 它陪我经历了所有事情, 失业, 分手, 搬家。它就像家人。", pinyin: "Wǒ cóng dàxué dài tā huí jiā, tā péi wǒ jīnglì le suǒyǒu shìqing, shīyè, fēnshǒu, bānjiā. Tā jiùxiàng jiārén.", english: "I brought her home from college — she went through everything with me: job loss, breakups, moves. She was family.", vi: "Mình đem nó về từ đại học, nó ở bên mình qua hết mọi chuyện: thất nghiệp, chia tay, chuyển nhà. Nó giống người nhà." },
      { speaker: "梅", chinese: "宠物就是家人, 失去家人的痛我懂。我去年我家的猫也走了, 那段时间我有时候吃饭都没胃口。", pinyin: "Chǒngwù jiùshì jiārén, shīqù jiārén de tòng wǒ dǒng. Wǒ qùnián wǒ jiā de māo yě zǒu le, nà duàn shíjiān wǒ yǒushíhou chīfàn dōu méi wèikǒu.", english: "Pets are family, the pain of losing family I understand. Last year my cat passed too — for a while I had no appetite.", vi: "Thú cưng cũng là người nhà, mất người nhà mình hiểu nỗi đau. Năm ngoái mèo nhà mình cũng đi, thời gian đó có lúc mình không ăn nổi." },
      { speaker: "朋友", chinese: "今天早上发现的, 我哭了一整天。同事都让我请假, 但我不想一个人呆在家里, 太空了。", pinyin: "Jīntiān zǎoshang fāxiàn de, wǒ kū le yī zhěng tiān. Tóngshì dōu ràng wǒ qǐng jià, dàn wǒ bù xiǎng yī gè rén dāi zài jiā lǐ, tài kōng le.", english: "Found her this morning, cried all day. Colleagues said take leave, but I don't want to be home alone — too empty.", vi: "Sáng nay phát hiện, mình khóc cả ngày. Đồng nghiệp bảo mình nghỉ phép, nhưng mình không muốn ở một mình trong nhà, trống trải quá." },
      { speaker: "梅", chinese: "你今晚来我家吃饭吧, 我做你喜欢的越南河粉。我们不用聊很多, 你想哭就哭, 想说就说, 不想说也没关系。", pinyin: "Nǐ jīn wǎn lái wǒ jiā chīfàn ba, wǒ zuò nǐ xǐhuan de Yuènán héfěn. Wǒmen bùyòng liáo hěn duō, nǐ xiǎng kū jiù kū, xiǎng shuō jiù shuō, bù xiǎng shuō yě méi guānxi.", english: "Come to my place for dinner tonight, I'll make your favorite Vietnamese pho. We don't have to talk much — cry if you want, talk if you want, silence is fine too.", vi: "Tối nay sang nhà mình ăn cơm đi, mình nấu phở Việt bạn thích. Mình không cần nói nhiều, muốn khóc thì khóc, muốn nói thì nói, không nói cũng không sao." },
      { speaker: "朋友", chinese: "好... 我可能会哭很多, 不要嫌烦。", pinyin: "Hǎo... wǒ kěnéng huì kū hěn duō, bù yào xián fán.", english: "Okay... I might cry a lot, don't mind.", vi: "Được... mình có thể khóc nhiều, đừng phiền nhé." },
      { speaker: "梅", chinese: "丽丽, 你怎么想我都不嫌烦。难过是正常的, 不需要假装坚强。", pinyin: "Lìli, nǐ zěnme xiǎng wǒ dōu bù xián fán. Nánguò shì zhèngcháng de, bù xūyào jiǎzhuāng jiānqiáng.", english: "Lili, however you feel doesn't bother me. Sad is normal, no need to pretend strong.", vi: "Lệ Lệ, bạn buồn thế nào mình cũng không phiền. Buồn là bình thường, không cần giả vờ mạnh mẽ." },
      { speaker: "朋友", chinese: "谢谢你。我之前有过几个朋友失去宠物, 我都不知道说什么, 只会说'别哭了'。", pinyin: "Xièxie nǐ. Wǒ zhīqián yǒu guò jǐ gè péngyou shīqù chǒngwù, wǒ dōu bù zhīdào shuō shénme, zhǐ huì shuō 'bié kū le'.", english: "Thanks. Before, when friends lost pets, I didn't know what to say — only 'don't cry'.", vi: "Cảm ơn bạn. Trước đây bạn mình mất thú cưng, mình không biết nói gì, chỉ biết nói 'đừng khóc nữa'." },
      { speaker: "梅", chinese: "其实'别哭了'反而让人不舒服, 因为悲伤是要释放的。最好的安慰就是陪着, 不评价不催促。", pinyin: "Qíshí 'bié kū le' fǎn'ér ràng rén bù shūfu, yīnwèi bēishāng shì yào shìfàng de. Zuì hǎo de ānwèi jiùshì péizhe, bù píngjià bù cuīcù.", english: "Actually 'don't cry' makes people uncomfortable — sadness needs release. Best comfort is being there, no judgment no rushing.", vi: "Thực ra 'đừng khóc nữa' lại làm người ta khó chịu, vì nỗi buồn cần được giải tỏa. An ủi tốt nhất là ở bên, không phán xét không thúc giục." },
      { speaker: "朋友", chinese: "我学到了。下次我朋友失去什么的时候, 我也这样陪她。", pinyin: "Wǒ xué dào le. Xià cì wǒ péngyou shīqù shénme de shíhou, wǒ yě zhèyàng péi tā.", english: "I'll learn from this. Next time a friend loses someone, I'll be there for her this way.", vi: "Mình học được rồi. Lần sau bạn mình mất gì đó, mình cũng sẽ ở bên như thế." },
      { speaker: "梅", chinese: "你要不要把小白埋在公园那边的树下? 我陪你去。明天周末。", pinyin: "Nǐ yào bù yào bǎ Xiǎobái mái zài gōngyuán nà biān de shù xià? Wǒ péi nǐ qù. Míngtiān zhōumò.", english: "Want to bury Xiaobai under the tree in the park? I'll go with you. Tomorrow weekend.", vi: "Bạn có muốn chôn Tiểu Bạch dưới gốc cây bên công viên không? Mình đi cùng bạn. Mai cuối tuần." },
      { speaker: "朋友", chinese: "想, 但我自己一个人做不到。", pinyin: "Xiǎng, dàn wǒ zìjǐ yī gè rén zuò bù dào.", english: "Yes, but I can't do it alone.", vi: "Muốn, nhưng mình một mình không làm được." },
      { speaker: "梅", chinese: "明天上午八点我来接你, 一起去。", pinyin: "Míngtiān shàngwǔ bā diǎn wǒ lái jiē nǐ, yīqǐ qù.", english: "Tomorrow 8 AM I'll pick you up, go together.", vi: "Mai 8 giờ sáng mình đến đón bạn, cùng đi." },
      { speaker: "朋友", chinese: "梅, 谢谢你。时间会慢慢治愈, 但思念永远在心里。", pinyin: "Méi, xièxie nǐ. Shíjiān huì mànman zhìyù, dàn sīniàn yǒngyuǎn zài xīnlǐ.", english: "Mei, thank you. Time will slowly heal, but remembrance stays.", vi: "Mai, cảm ơn bạn. Thời gian sẽ từ từ chữa lành, nhưng nhớ nhung mãi trong tim." },
      { speaker: "梅", chinese: "一直在。", pinyin: "Yīzhí zài.", english: "Always here.", vi: "Luôn ở đây." }
    ],
    roleplay_prompts: [
      "Bạn Trung Quốc nhắn tin báo bố vừa mất. Bạn không thể bay sang dự tang ngay (visa, công việc). Hãy nhắn tin an ủi đầy đủ + đề xuất cách thức cụ thể bạn có thể giúp từ xa (gọi điện hằng ngày, gửi hoa tang qua app, đặt tiền trợ phúng qua WeChat). Dùng cụm '节哀顺变' và '虽然我不能立刻过来, 但...'.",
      "Bạn Trung Quốc đã 1 tháng kể từ khi mẹ mất, vẫn rất buồn. Đồng nghiệp đã ngừng hỏi thăm, nghĩ 'phải bước tiếp'. Bạn (người Việt) thấy bạn ấy vẫn cần. Hãy chủ động: rủ đi cà phê, hỏi thăm, đề nghị nói về mẹ nếu muốn. Tránh nói 'phải mạnh mẽ lên'.",
      "Bạn Trung Quốc mất một người bạn thân (tự sát). Đây là tình huống nhạy cảm — KHÔNG đi sâu vào nguyên nhân/hỏi 'tại sao'. Chỉ ở bên + lắng nghe nếu họ muốn chia sẻ + tránh phán xét. Ưu tiên: sự hiện diện vô điều kiện. Cụm '我在这里' (mình ở đây)."
    ],
    register_notes: "An ủi sau mất mát ở Trung Quốc dùng register CỰC TRANG TRỌNG ban đầu, dần dần mềm. Người Trung Quốc thường ngại nói trực tiếp về cái chết — dùng từ giảm nhẹ.\n\nTừ thay thế '死' (sǐ — chết, quá thẳng):\n- 走了 (zǒu le — đã đi) — nhẹ nhàng, gần\n- 去世 (qù shì — qua đời) — formal, neutral\n- 离世 (lí shì — rời thế) — formal, văn vẻ\n- 不在了 (bù zài le — không còn) — gián tiếp\n- 仙逝 (xiān shì — tiên thệ) — rất formal, dùng cho người lớn tuổi\n\nCác cụm chuẩn an ủi:\n- '节哀顺变' (jié āi shùn biàn) — cụm cổ điển, formal\n- '请您节哀' (xin anh nén đau) — formal hơn\n- '我能想象你有多难' (mình hình dung được bạn khó thế nào)\n- '我陪着你' (mình ở bên bạn)\n- '不需要假装坚强' (không cần giả mạnh mẽ)\n- '需要什么帮忙告诉我' (cần giúp gì nói mình)\n\nTránh:\n- '别哭了' (đừng khóc nữa) — khiến người ta cảm thấy bị từ chối\n- '人都死了, 哭也没用' (chết rồi, khóc vô ích) — vô cảm\n- '你要坚强' (phải mạnh mẽ) — áp lực\n- '想开点' (nghĩ thoáng đi) — coi nhẹ nỗi đau\n- '他在天堂会很好' (họ ở thiên đàng sẽ tốt) — giả định tôn giáo, có thể không phù hợp\n\nVỀ ĐIỆN THOẠI vs GẶP MẶT: tin báo lần đầu thường qua text. Nhưng khi bạn nhận tin, ƯU TIÊN GẶP MẶT trong 24-48 giờ nếu cùng thành phố. Không thể gặp = gọi video, không phải chỉ text.\n\nVỀ VIẾNG THÁNG (吊唁 — diàoyàn): đến nhà tang chủ, mặc đồ tối màu (đen/trắng/xám — KHÔNG đỏ/sặc sỡ), mang phong bao tiền trợ phúng (奠仪 — diànyí, 200-1,000 tệ tùy thân). Đốt 3 nén nhang, cúi đầu 3 lần. Không chụp ảnh. Không cười. Ở 30 phút - 1 giờ rồi rời, không kéo dài.",
    idiom_glosses: [
      {
        idiom: "节哀顺变",
        literal: "tiết bi ai, thuận biến hóa (jié āi shùn biàn)",
        meaning: "Hạn chế đau buồn, thuận theo biến cố — cụm cổ điển formal nhất để an ủi tang. Dùng trực tiếp với người mất thân hoặc trong văn bản chia buồn. Không thay thế tốt — học thuộc.",
        example: "听到您父亲去世, 节哀顺变。"
      },
      {
        idiom: "化悲痛为力量",
        literal: "biến đau buồn thành sức mạnh (huà bēi tòng wéi lì liang)",
        meaning: "Chuyển hóa nỗi đau thành động lực — an ủi giai đoạn 2 (sau lễ tang, khi bạn bắt đầu hồi phục). Cụm tích cực nhưng không vô cảm. Tránh dùng quá sớm — sẽ bị coi là vội vã.",
        example: "我希望你能化悲痛为力量, 好好生活。"
      },
      {
        idiom: "阴阳两隔",
        literal: "âm dương hai cách (yīn yáng liǎng gé)",
        meaning: "Cách trở sống chết — diễn tả nỗi đau xa cách vĩnh viễn. Cụm văn vẻ, dùng để cảm thông cho mất mát đặc biệt sâu (vợ chồng, con cái). Mạnh, không lạm dụng.",
        example: "母亲走了, 我们阴阳两隔, 心里空荡荡的。"
      },
      {
        idiom: "时间会治愈",
        literal: "thời gian sẽ chữa lành (shí jiān huì zhì yù)",
        meaning: "Thời gian là thuốc chữa lành — câu an ủi phổ biến. KHÔNG là idiom 4 chữ thuần nhưng cụm cốt lõi. Dùng giai đoạn 3 (vài tuần sau), không dùng ngay sau khi mất. Thêm '但思念永远在' (nhưng nhớ nhung mãi còn) để không tỏ ra coi nhẹ.",
        example: "时间会慢慢治愈伤痛, 但思念永远在心里。"
      }
    ],
    cultural_notes_vi: "An ủi sau mất mát trong văn hóa Trung Quốc đại lục có những đặc thù khác Việt Nam:\n\n(1) THỜI GIAN TANG: 7 ngày đầu (头七 — tóu qī) là thời gian quan trọng nhất, gia đình tập trung. Bạn bè đến viếng trong 7 ngày này. Sau 49 ngày (七七 — qī qī, theo Phật giáo) là kết thúc 'tang nặng'. 100 ngày + 1 năm là các mốc nhỏ. Người Việt có khái niệm tương tự (49 ngày, 100 ngày, giỗ) — cụm văn hóa shared.\n\n(2) MÀU SẮC TANG: trắng + đen + xám. KHÔNG đỏ tuyệt đối trong 49 ngày. Nếu bạn được mời đến nhà tang chủ, mặc TỐI MÀU. Mang phong bao tiền trợ phúng (奠仪 / 白包) — số lẻ (101, 201, 501, 1001) — KHÔNG số chẵn (200, 500). Khác cưới hỏi (số chẵn), đám tang dùng số lẻ.\n\n(3) NHẮN TIN TRONG TANG: KHÔNG dùng emoji vui (😊😄). Tin nhắn trang trọng, ngắn gọn. Mẫu chuẩn: '惊闻[称呼]噩耗, 万分悲痛。请节哀顺变, 多保重身体。如有需要, 随时找我。' (Đột nhiên nghe tin xấu của [người], vô cùng đau buồn. Xin nén đau thương, giữ gìn sức khỏe. Cần gì cứ tìm em.)\n\n(4) THĂM HỎI SAU 30 NGÀY: nhiều người Trung Quốc cảm thấy bị 'bỏ rơi' sau tuần đầu — bạn bè ngừng hỏi thăm. Là người Việt, BẠN có thể tạo khác biệt: nhắn tin nhẹ tuần thứ 2, thứ 4, tháng thứ 2 — chỉ '想到你了, 你怎么样了?' (mình nghĩ đến bạn, bạn dạo này thế nào). Không cần nhiều.\n\n(5) THÚ CƯNG: mất chó/mèo ở Trung Quốc đại lục đô thị giờ được công nhận là nỗi đau thật sự (giới trẻ + thành phố lớn). Đối xử như mất người thân nhỏ. Tang chôn cất tại 宠物殡仪馆 (pet funeral home) ở Bắc Kinh, Thượng Hải. Người lớn tuổi đôi khi không hiểu nỗi đau này — đừng kể với họ nếu họ không thân.\n\n(6) TỰ TỬ: chủ đề rất nhạy cảm + còn ít thảo luận công khai ở Trung Quốc. Khi bạn mất ai đó vì tự tử, KHÔNG hỏi 'tại sao'. KHÔNG đoán nguyên nhân. KHÔNG bình luận về chứng trầm cảm trừ khi bạn thân biết. Chỉ ở bên + lắng nghe.\n\n(7) NỀN TẢNG TÂM LINH: Trung Quốc đại lục có Phật giáo, Đạo giáo, không tôn giáo (atheist). KHÔNG nói 'họ ở thiên đàng' (天堂) trừ khi bạn biết người mất là Cơ Đốc giáo. Cụm trung tính: '愿他/她安息' (mong họ yên nghỉ), '一路走好' (đi yên — chúc đường về của người chết).\n\nVỀ TỪ '走了' (zǒu le — đã đi): cụm rất phổ biến, gentle. Khi bạn Trung Quốc nhắn '我外婆走了', họ đang nói bà ngoại mất. KHÔNG là 'đã đi đâu đó' theo nghĩa du lịch. Phản ứng đúng: '我很难过' (mình rất buồn) + '节哀顺变'.\n\nVỀ KHÔNG NÓI GÌ (沉默 — chénmò): trong văn hóa Trung Quốc, im lặng đồng cảm là OK. Bạn không cần nói nhiều — chỉ cần ở đó. 'Sự hiện diện > lời an ủi'. Đôi khi câu hay nhất là không nói gì, chỉ đưa khăn giấy và pha trà.",
    tip_advice_vi: "(1) PHẢN HỒI NHANH khi nhận tin (1-2 giờ). Đừng chờ 'tìm câu hay'. Câu đơn giản '我太难过了, 节哀顺变, 我陪你' (mình rất buồn, nén đau thương, mình ở bên bạn) đủ và đúng. (2) ĐỀ XUẤT CỤ THỂ thay vì câu chung 'cần gì gọi mình'. Người đang đau không có năng lực yêu cầu. Hãy đề xuất rõ: 'tối nay sang nhà mình ăn cơm', 'mai mình đi mua đồ tang cùng', 'cuối tuần đi bộ công viên'. (3) MANG ĐỒ ĂN: người đau buồn quên ăn. Mang cơm, súp, đồ ăn dễ tiêu (cháo, súp gà). KHÔNG bánh ngọt sặc sỡ. (4) LẮNG NGHE > NÓI: trong cuộc gặp đầu, nói < 30% thời gian. 70% lắng nghe + đặt câu hỏi mở ('bạn nhớ nhất chuyện gì với bà?'). Để bạn ấy nói về người mất — đó là quá trình chữa lành. (5) ĐỪNG SỢ NƯỚC MẮT — của họ và của bạn. Nếu bạn cũng khóc, đó là chia sẻ chân thành. Đừng giả vờ bình thản. (6) NHẮN TIN ĐỀU 1 LẦN/TUẦN trong 2 tháng đầu. Mẫu '想到你了, 怎么样了?' (mình nghĩ đến bạn, bạn dạo này thế nào). Không cần dài. Chỉ cần đều. Nhiều người ngừng nhắn sau tuần đầu — bạn duy trì = khác biệt. (7) NHỚ NGÀY GIỖ (1 năm): đặt nhắc nhở. Nhắn tin: '今天是X一周年, 我也想她' (hôm nay là 1 năm mất X, mình cũng nhớ cô ấy). Cử chỉ này không bao giờ quên — bạn chứng minh tình bạn dài hạn.",
    exercises: [
      { type: "fill-blank", question: "听到这个消息我很难过, ___ 顺变。", answer: "节哀" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung an ủi tang với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "节哀顺变", pinyin: "jié āi shùn biàn", english: "nén đau thương vượt qua nghịch cảnh" },
          { chinese: "走了", pinyin: "zǒu le", english: "đã đi rồi (mất)" },
          { chinese: "陪伴", pinyin: "péi bàn", english: "ở bên" },
          { chinese: "时间会治愈", pinyin: "shí jiān huì zhì yù", english: "thời gian sẽ chữa lành" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Mình hình dung được lúc này bạn khó khăn thế nào, mình ở bên bạn. Bạn không cần gồng lên mạnh mẽ.",
        chinese: "我能想象你现在有多难, 我陪着你。你不用强装坚强。",
        pinyin: "Wǒ néng xiǎng xiàng nǐ xiàn zài yǒu duō nán, wǒ péi zhe nǐ. Nǐ bù yòng qiáng zhuāng jiān qiáng."
      }
    ]
  },
  {
    id: 85,
    level: "B2",
    category: "personal_social",
    title: "为严重错误道歉",
    pinyin: "wèi yán zhòng cuò wù dào qiàn",
    topic: "Apologizing for a serious mistake you made",
    title_vi: "Xin lỗi vì lỗi nghiêm trọng bạn đã gây ra",
    title_en: "Apologizing for a serious mistake",
    sentences: [
      {
        chinese: "我想跟你当面道歉, 上周我说的话太过分了。",
        pinyin: "Wǒ xiǎng gēn nǐ dāngmiàn dàoqiàn, shàng zhōu wǒ shuō de huà tài guòfèn le.",
        english: "I want to apologize in person — what I said last week was too much.",
        vi: "Mình muốn xin lỗi bạn trực tiếp, tuần trước mình nói quá đáng.",
        pronunciation_focus: ["当面 → dāngmiàn (trực tiếp / mặt đối mặt)", "道歉 → dàoqiàn (xin lỗi)", "过分 → guòfèn (quá đáng)", "上周 → shàng zhōu (tuần trước)"]
      },
      {
        chinese: "我没站在你的角度想, 是我考虑不周。",
        pinyin: "Wǒ méi zhàn zài nǐ de jiǎodù xiǎng, shì wǒ kǎolǜ bù zhōu.",
        english: "I didn't see it from your side — I didn't think it through.",
        vi: "Mình không đặt mình vào góc nhìn của bạn, là mình suy nghĩ chưa chu toàn.",
        pronunciation_focus: ["站在 → zhàn zài (đứng ở / đặt vào)", "角度 → jiǎodù (góc độ)", "考虑不周 → kǎolǜ bù zhōu (suy nghĩ chưa chu toàn)", "我没 → wǒ méi"]
      },
      {
        chinese: "不是为我自己开脱, 是真的想让你知道我意识到了。",
        pinyin: "Bù shì wèi wǒ zìjǐ kāituō, shì zhēn de xiǎng ràng nǐ zhīdào wǒ yìshí dào le.",
        english: "Not to excuse myself — I really want you to know I understand.",
        vi: "Không phải biện hộ cho mình, mình thực sự muốn bạn biết mình đã nhận ra.",
        pronunciation_focus: ["开脱 → kāituō (biện hộ / chối tội)", "意识到 → yìshí dào (nhận ra)", "真的 → zhēn de (thật sự)", "让你知道 → ràng nǐ zhīdào"]
      },
      {
        chinese: "我以后绝对不会再犯, 也希望你能给我一个机会。",
        pinyin: "Wǒ yǐhòu juéduì bù huì zài fàn, yě xīwàng nǐ néng gěi wǒ yī gè jīhuì.",
        english: "I won't do it again — and I hope you'll give me a chance.",
        vi: "Mình sau này tuyệt đối không tái phạm, mong bạn cho mình cơ hội.",
        pronunciation_focus: ["绝对 → juéduì (tuyệt đối)", "再犯 → zài fàn (tái phạm)", "机会 → jīhuì (cơ hội)", "以后 → yǐhòu"]
      },
      {
        chinese: "如果你需要时间, 我等。我们的友谊对我很重要。",
        pinyin: "Rúguǒ nǐ xūyào shíjiān, wǒ děng. Wǒmen de yǒuyì duì wǒ hěn zhòngyào.",
        english: "If you need time, I'll wait. Our friendship matters to me.",
        vi: "Nếu bạn cần thời gian, mình đợi. Tình bạn mình rất quan trọng với mình.",
        pronunciation_focus: ["时间 → shíjiān (thời gian)", "等 → děng (đợi)", "友谊 → yǒuyì (tình bạn)", "重要 → zhòngyào"]
      }
    ],
    vocab: [
      { chinese: "道歉", pinyin: "dào qiàn", english: "to apologize", vi: "xin lỗi" },
      { chinese: "当面", pinyin: "dāng miàn", english: "in person / face-to-face", vi: "trực tiếp" },
      { chinese: "过分", pinyin: "guò fèn", english: "excessive / too much", vi: "quá đáng" },
      { chinese: "考虑不周", pinyin: "kǎo lǜ bù zhōu", english: "didn't think through", vi: "suy nghĩ chưa chu toàn" },
      { chinese: "开脱", pinyin: "kāi tuō", english: "to make excuses", vi: "biện hộ / chối tội" },
      { chinese: "意识到", pinyin: "yì shí dào", english: "to realize", vi: "nhận ra" },
      { chinese: "再犯", pinyin: "zài fàn", english: "to repeat (mistake)", vi: "tái phạm" },
      { chinese: "原谅", pinyin: "yuán liàng", english: "to forgive", vi: "tha thứ" },
      { chinese: "知错就改", pinyin: "zhī cuò jiù gǎi", english: "know wrong, correct it", vi: "biết sai sửa ngay" },
      { chinese: "真心诚意", pinyin: "zhēn xīn chéng yì", english: "with true heart and sincerity", vi: "chân tâm thành ý" }
    ],
    dialogue: [
      { speaker: "梅", chinese: "丽丽, 上周我说的话太过分了, 我想当面道歉。", pinyin: "Lìli, shàng zhōu wǒ shuō de huà tài guòfèn le, wǒ xiǎng dāngmiàn dàoqiàn.", english: "Lili, what I said last week was too much, I want to apologize in person.", vi: "Lệ Lệ, tuần trước mình nói quá đáng, mình muốn xin lỗi trực tiếp." },
      { speaker: "丽丽", chinese: "嗯, 我那天确实很伤心。", pinyin: "Èn, wǒ nà tiān quèshí hěn shāngxīn.", english: "Mm, I was really hurt that day.", vi: "Ừm, hôm đó mình thực sự rất tổn thương." },
      { speaker: "梅", chinese: "我没站在你的角度想, 是我不对。我以后绝对不会再这样。", pinyin: "Wǒ méi zhàn zài nǐ de jiǎodù xiǎng, shì wǒ bù duì. Wǒ yǐhòu juéduì bù huì zài zhèyàng.", english: "I didn't see from your side, I was wrong. Won't happen again.", vi: "Mình không đặt mình vào góc nhìn của bạn, là mình sai. Sau này tuyệt đối không thế nữa." },
      { speaker: "丽丽", chinese: "我需要点时间, 但我看到你的诚意了。", pinyin: "Wǒ xūyào diǎn shíjiān, dàn wǒ kàn dào nǐ de chéngyì le.", english: "I need some time, but I see your sincerity.", vi: "Mình cần chút thời gian, nhưng mình thấy sự chân thành của bạn." }
    ],
    dialogue_long: [
      { speaker: "梅", chinese: "丽丽, 你方便聊一下吗?", pinyin: "Lìli, nǐ fāngbiàn liáo yīxià ma?", english: "Lili, do you have time to chat?", vi: "Lệ Lệ, bạn có tiện nói chuyện chút không?" },
      { speaker: "丽丽", chinese: "怎么了?", pinyin: "Zěnme le?", english: "What is it?", vi: "Có chuyện gì?" },
      { speaker: "梅", chinese: "上周聚会的时候, 我当着大家的面说你的工作'没什么前途'。我回家越想越后悔, 这话太过分, 太伤人了。我想跟你当面道歉。", pinyin: "Shàng zhōu jùhuì de shíhou, wǒ dāngzhe dàjiā de miàn shuō nǐ de gōngzuò 'méishénme qiántú'. Wǒ huíjiā yuè xiǎng yuè hòuhuǐ, zhè huà tài guòfèn, tài shāngrén le. Wǒ xiǎng gēn nǐ dāngmiàn dàoqiàn.", english: "At the gathering last week, in front of everyone I said your job 'has no future'. The more I thought at home, the more I regretted — too much, too hurtful. I want to apologize face-to-face.", vi: "Hôm tụ tập tuần trước, mình trước mặt mọi người nói công việc bạn 'không có tương lai'. Về nhà càng nghĩ càng hối hận, lời đó quá đáng, quá tổn thương. Mình muốn xin lỗi bạn trực tiếp." },
      { speaker: "丽丽", chinese: "那天我的确很难受, 回家哭了。我已经因为这工作压力很大, 你那样说让我更没信心。", pinyin: "Nà tiān wǒ díquè hěn nánshòu, huí jiā kū le. Wǒ yǐjīng yīnwèi zhè gōngzuò yālì hěn dà, nǐ nàyàng shuō ràng wǒ gèng méi xìnxīn.", english: "That day I was really hurt, cried at home. Already stressed about this job, you saying that made me lose more confidence.", vi: "Hôm đó mình thực sự buồn lắm, về nhà khóc. Mình đã căng thẳng vì công việc này rồi, bạn nói thế làm mình mất thêm tự tin." },
      { speaker: "梅", chinese: "对不起, 我不是开玩笑, 我也不是为我自己开脱。我意识到我说话之前没有想你的感受。", pinyin: "Duìbuqǐ, wǒ bù shì kāi wánxiào, wǒ yě bù shì wèi wǒ zìjǐ kāituō. Wǒ yìshí dào wǒ shuōhuà zhīqián méiyǒu xiǎng nǐ de gǎnshòu.", english: "Sorry, not joking, not making excuses. I realize I didn't think of your feelings before speaking.", vi: "Xin lỗi, mình không đùa cợt, cũng không biện hộ. Mình nhận ra trước khi nói mình không nghĩ đến cảm xúc của bạn." },
      { speaker: "丽丽", chinese: "你为什么会那样说?", pinyin: "Nǐ wèishéme huì nàyàng shuō?", english: "Why did you say that?", vi: "Sao bạn lại nói thế?" },
      { speaker: "梅", chinese: "其实那段时间我自己工作也不顺, 心里烦躁, 看到你换工作心里有点羡慕又有点担心你。但我用错了方式, 把担心说成了批评。这是我的错, 跟你的工作没关系。", pinyin: "Qíshí nà duàn shíjiān wǒ zìjǐ gōngzuò yě bù shùn, xīnlǐ fánzào, kàndào nǐ huàn gōngzuò xīnlǐ yǒudiǎn xiànmù yòu yǒudiǎn dānxīn nǐ. Dàn wǒ yòng cuò le fāngshì, bǎ dānxīn shuō chéng le pīpíng. Zhè shì wǒ de cuò, gēn nǐ de gōngzuò méi guānxi.", english: "Actually that period my own work wasn't going well, I was frustrated, saw you change job and felt envious and worried for you. But I expressed it wrong — turned concern into criticism. My fault, nothing to do with your job.", vi: "Thực ra thời gian đó công việc mình cũng không thuận, trong lòng bứt rứt, thấy bạn đổi việc vừa ghen tị vừa lo. Nhưng mình diễn đạt sai, biến lo lắng thành chỉ trích. Là lỗi của mình, không liên quan đến công việc của bạn." },
      { speaker: "丽丽", chinese: "原来你那段时间也不好过, 我都没注意到。", pinyin: "Yuánlái nǐ nà duàn shíjiān yě bù hǎoguò, wǒ dōu méi zhùyì dào.", english: "So you were having a hard time too, I didn't notice.", vi: "Hóa ra thời gian đó bạn cũng khó khăn, mình không để ý." },
      { speaker: "梅", chinese: "这不重要, 我自己的烦躁不是攻击你的理由。我想说三件事: 第一, 我真的很对不起, 我说错了。第二, 我以后会先想再说, 不会再公开评论你的选择。第三, 你换的这个工作其实很有发展空间, 我那天说的根本不对。", pinyin: "Zhè bù zhòngyào, wǒ zìjǐ de fánzào bù shì gōngjī nǐ de lǐyóu. Wǒ xiǎng shuō sān jiàn shì: dì yī, wǒ zhēn de hěn duìbuqǐ, wǒ shuō cuò le. Dì èr, wǒ yǐhòu huì xiān xiǎng zài shuō, bù huì zài gōngkāi pínglùn nǐ de xuǎnzé. Dì sān, nǐ huàn de zhège gōngzuò qíshí hěn yǒu fāzhǎn kōngjiān, wǒ nà tiān shuō de gēnběn bù duì.", english: "That doesn't matter — my frustration isn't a reason to attack you. Three things: first, I'm truly sorry, I was wrong. Second, I'll think before speaking, won't publicly judge your choices again. Third, this new job actually has great room for growth — I was wrong that day.", vi: "Cái đó không quan trọng, sự bứt rứt của mình không phải lý do để công kích bạn. Mình muốn nói ba điều: thứ nhất, mình thực sự xin lỗi, mình đã sai. Thứ hai, sau này mình sẽ nghĩ trước khi nói, không công khai bình luận lựa chọn của bạn nữa. Thứ ba, công việc bạn đổi thực ra có nhiều không gian phát triển, hôm đó mình nói sai hoàn toàn." },
      { speaker: "丽丽", chinese: "你能这么仔细地反思, 我已经看到你的诚意了。", pinyin: "Nǐ néng zhème zǐxì de fǎnsī, wǒ yǐjīng kàn dào nǐ de chéngyì le.", english: "You reflecting this carefully — I see your sincerity.", vi: "Bạn phản tư kỹ thế này, mình đã thấy sự chân thành của bạn rồi." },
      { speaker: "梅", chinese: "我还想做一件事补救: 周六我请你吃你最喜欢的火锅, 还有跟当时听到的朋友说我说错了, 不是真心的。这样可以吗?", pinyin: "Wǒ hái xiǎng zuò yī jiàn shì bǔjiù: zhōu liù wǒ qǐng nǐ chī nǐ zuì xǐhuan de huǒguō, hái yǒu gēn dāngshí tīngdào de péngyou shuō wǒ shuō cuò le, bù shì zhēnxīn de. Zhèyàng kěyǐ ma?", english: "One more thing to make amends: Saturday I'll treat you to your favorite hotpot, and tell the friends who heard that I was wrong, not sincere. Okay?", vi: "Mình muốn làm thêm một việc để chuộc lại: thứ Bảy mình mời bạn ăn lẩu yêu thích, và nói với mấy bạn lúc đó nghe được rằng mình đã nói sai, không phải từ tâm. Được không?" },
      { speaker: "丽丽", chinese: "火锅就免了, 但是跟朋友澄清这个我同意。我不希望他们觉得我工作真的没前途。", pinyin: "Huǒguō jiù miǎn le, dànshì gēn péngyou chéngqīng zhège wǒ tóngyì. Wǒ bù xīwàng tāmen juéde wǒ gōngzuò zhēn de méi qiántú.", english: "Skip the hotpot, but clarifying with friends I agree. Don't want them thinking my job really has no future.", vi: "Lẩu thì thôi, nhưng việc nói rõ với bạn bè mình đồng ý. Không muốn họ nghĩ công việc mình thực sự không có tương lai." },
      { speaker: "梅", chinese: "好, 我明天就跟他们说。丽丽, 我以前说什么伤了你, 你现在告诉我也行, 我都接受。", pinyin: "Hǎo, wǒ míngtiān jiù gēn tāmen shuō. Lìli, wǒ yǐqián shuō shénme shāng le nǐ, nǐ xiànzài gàosu wǒ yě xíng, wǒ dōu jiēshòu.", english: "Okay, I'll tell them tomorrow. Lili, if I've ever hurt you with words before, tell me now — I'll accept it all.", vi: "Được, mai mình sẽ nói với họ. Lệ Lệ, trước đây mình có lời nào làm bạn buồn, giờ bạn nói cũng được, mình tiếp nhận hết." },
      { speaker: "丽丽", chinese: "梅, 你不用这样。每个人都会犯错, 重要的是知错就改。我接受你的道歉。", pinyin: "Méi, nǐ bùyòng zhèyàng. Měi gè rén dōu huì fàn cuò, zhòngyào de shì zhī cuò jiù gǎi. Wǒ jiēshòu nǐ de dàoqiàn.", english: "Mei, you don't need to. Everyone makes mistakes — what matters is knowing and changing. I accept your apology.", vi: "Mai, bạn không cần thế. Ai cũng có lúc sai, quan trọng là biết sai sửa ngay. Mình chấp nhận lời xin lỗi của bạn." },
      { speaker: "梅", chinese: "谢谢丽丽, 真的谢谢。我们的友谊对我太重要了。", pinyin: "Xièxie Lìli, zhēn de xièxie. Wǒmen de yǒuyì duì wǒ tài zhòngyào le.", english: "Thank you Lili, really. Our friendship matters too much to me.", vi: "Cảm ơn Lệ Lệ, thực sự cảm ơn. Tình bạn mình quá quan trọng với mình." }
    ],
    roleplay_prompts: [
      "Bạn quên sinh nhật quan trọng của bạn thân Trung Quốc (sinh nhật 30 tuổi — cột mốc lớn). Họ tổ chức tiệc, bạn không đến + không nhắn. Bạn không có lý do hợp lý (chỉ quên). Hãy xin lỗi: thừa nhận lỗi không bào chữa + đề xuất bù đắp cụ thể (mời ăn riêng + tặng quà sinh nhật muộn) + cam kết không tái phạm.",
      "Bạn vô tình tiết lộ bí mật của bạn cho một người chung. Bạn của bạn rất tổn thương. Hãy xin lỗi qua 3 bước: gặp riêng + thừa nhận đã làm gì cụ thể + đề xuất bù đắp (gọi người kia thanh minh, không bao giờ kể bí mật người khác nữa). Tránh đổ lỗi 'do say rượu nói nhầm'.",
      "Trong lúc cãi nhau, bạn nói câu 'bạn giống mẹ bạn' (mà bạn ấy ghét mẹ mình) — câu cực đau. Sau khi nguội, hãy xin lỗi sâu sắc: gặp trực tiếp + thừa nhận biết tổn thương ở đâu + cam kết không bao giờ chạm vào điểm đau cá nhân. Dùng cụm '我用了你最痛的事来攻击你, 我不可原谅'."
    ],
    register_notes: "Xin lỗi cho lỗi nghiêm trọng giữa bạn bè dùng register thân mật-formal — không có 您 (bạn ngang cấp), nhưng tone NGHIÊM TÚC, không đùa cợt.\n\nCấu trúc 4 phần xin lỗi chuẩn:\n1. THỪA NHẬN cụ thể: '上周我说X' (tuần trước mình nói X) — KHÔNG '我说错话了' chung chung\n2. CÔNG NHẬN tác động: '我知道这让你很伤心' (mình biết điều đó làm bạn rất buồn)\n3. KHÔNG BÀO CHỮA: '不是为我开脱' (không phải biện hộ cho mình)\n4. ĐỀ XUẤT bù đắp + cam kết: '我以后会X' (sau này mình sẽ X)\n\nThiếu 1 trong 4 phần = lời xin lỗi 'có vẻ' nhưng không đầy đủ.\n\nCác cụm xin lỗi từ NHẸ đến NẶNG:\n- 不好意思 (bù hǎoyìsi) — nhẹ, lỗi nhỏ hàng ngày\n- 对不起 (duìbuqǐ) — chuẩn\n- 真的对不起 (zhēn de duìbuqǐ) — chân thành\n- 我跟你道歉 (wǒ gēn nǐ dàoqiàn) — formal, nghiêm túc\n- 我郑重道歉 (wǒ zhèngzhòng dàoqiàn) — long trọng xin lỗi\n- 我向你赔礼道歉 (wǒ xiàng nǐ péi lǐ dàoqiàn) — formal nhất, kèm bù đắp\n\nCụm CỤ THỂ cho lỗi giữa bạn:\n- '我说话太过分了' (mình nói quá đáng)\n- '我没站在你的角度' (mình không đặt mình vào góc nhìn của bạn)\n- '我考虑不周' (mình suy nghĩ chưa chu toàn)\n- '我以后绝对不会再犯' (sau này tuyệt đối không tái phạm)\n- '请你给我一个机会' (xin bạn cho mình cơ hội)\n\nTránh: (a) Bào chữa 'tại lúc đó tôi say', 'tại lúc đó stress' — bị coi là không thật lòng; (b) 'Nếu bạn buồn thì xin lỗi' — xin lỗi có điều kiện, vô nghĩa; (c) Xin lỗi qua tin nhắn ngay sau lỗi — quá nhanh, không suy nghĩ; (d) Hứa quá lớn 'em sẽ làm bất cứ gì để chuộc' — hứa lèo, sẽ thất vọng.\n\nVỀ THỜI ĐIỂM: chờ 12-48 giờ sau lỗi. Quá sớm = phản xạ; quá muộn (>1 tuần) = đã quên + thêm 1 lỗi (không quan tâm). Sweet spot: ngày hôm sau hoặc 2 ngày sau.",
    idiom_glosses: [
      {
        idiom: "知错就改",
        literal: "biết sai liền sửa (zhī cuò jiù gǎi)",
        meaning: "Biết sai sửa ngay — phẩm chất quân tử. Cụm dùng để cam kết khi xin lỗi: 'tôi 知错就改, sau này sẽ khác'. Người Trung Quốc đánh giá rất cao thái độ này — quan trọng hơn cả việc chưa từng sai.",
        example: "知错就改, 善莫大焉。"
      },
      {
        idiom: "真心诚意",
        literal: "chân tâm thành ý (zhēn xīn chéng yì)",
        meaning: "Bằng tấm lòng chân thành — không qua loa, không có tính toán. Cụm khẳng định lời xin lỗi không phải chiếu lệ: '我真心诚意地跟你道歉'. Mạnh và chân thực — chỉ dùng khi thực sự thế.",
        example: "我真心诚意地向你道歉, 请你原谅我。"
      },
      {
        idiom: "痛改前非",
        literal: "đau đớn sửa cái sai trước (tòng gǎi qián fēi)",
        meaning: "Sửa lỗi đến tận tâm — quyết tâm thay đổi triệt để. Mạnh hơn 知错就改, dùng khi sửa lỗi có hệ thống (không phải lỗi nhỏ một lần). Cảnh báo: lạm dụng = bị coi là cường điệu.",
        example: "我会痛改前非, 不会再让你失望。"
      },
      {
        idiom: "将功补过",
        literal: "lấy công bù lỗi (jiāng gōng bǔ guò)",
        meaning: "Dùng việc tốt sau bù lỗi trước — đề xuất bù đắp bằng hành động. Cụm chuyển từ lời xin lỗi sang cam kết hành động: '我会将功补过, 用行动弥补'. Cụ thể hơn lời nói.",
        example: "我会将功补过, 用以后的行动证明。"
      }
    ],
    cultural_notes_vi: "Xin lỗi giữa bạn thân Trung Quốc là một trong những thử thách kỹ năng giao tiếp B2 cao nhất. Bốn nguyên tắc cốt lõi:\n\n(1) FACE (面子) GIỮA BẠN: khác với business/family, bạn thân CÓ THỂ chỉ ra lỗi của nhau. NHƯNG nếu lỗi xảy ra trước mặt người khác (như trong lesson — 'before everyone in the gathering'), việc làm 'mất mặt' đặc biệt nghiêm trọng. Xin lỗi PHẢI bao gồm 'phục hồi mặt' công khai — nói với những người đã chứng kiến rằng bạn sai.\n\n(2) THỜI GIAN: người Trung Quốc thường đợi xem ai 'nói lời đầu' (谁先开口). Người chủ động xin lỗi = thừa nhận lỗi của mình; người đợi = có thể đang dằn dỗi hoặc thực sự bị tổn thương. Bạn là người Việt, bạn nên CHỦ ĐỘNG nếu bạn sai — đừng đợi bạn Trung Quốc 'mở lời' với bạn.\n\n(3) CỤM 'CHO QUA' (放下) vs 'GHI LẠI' (记仇): bạn Trung Quốc có thể nói '没关系' (không sao) ngay khi nhận lời xin lỗi, NHƯNG đó không nghĩa là họ đã quên. Nhiều người Trung Quốc 记仇 (jì chóu — ghi nhớ thù hận, lit. 'remember enmity') nhiều năm. Quan sát hành vi tiếp theo: họ vẫn mời bạn ăn, vẫn nhắn tin = đã thật sự cho qua. Họ tránh, không trả lời = chưa.\n\n(4) BÙ ĐẮP CỤ THỂ (实际行动): lời xin lỗi không có hành động = rỗng. Văn hóa Trung Quốc đặc biệt coi trọng '将功补过' — bù lỗi cũ bằng việc tốt cụ thể: mời ăn món họ thích, làm việc gì cho họ, kỷ niệm ngày quan trọng của họ. Mỗi lỗi nghiêm trọng nên có 1 hành động bù đắp.\n\nVỀ XIN LỖI QUA TIN NHẮN vs GẶP MẶT: lỗi nhỏ qua text OK. Lỗi nghiêm trọng (như trong lesson 85) BẮT BUỘC gặp mặt. Người Trung Quốc đánh giá việc bạn dành thời gian gặp mặt > nội dung cụ thể. Nếu thực sự không thể gặp (xa cách), gọi video — không bao giờ chỉ text cho lỗi nặng.\n\nVỀ XIN LỖI VÀ TIỀN BẠC: nếu lỗi của bạn gây thiệt hại tài chính cho bạn (làm hỏng đồ, mất món bạn cho mượn), KHÔNG chỉ xin lỗi — đề xuất đền bù tiền mặt cụ thể. Bạn Trung Quốc thường từ chối ('不用了') nhưng đợi 2-3 lần đề nghị mới chấp nhận. Văn hóa 客气 (lịch sự đẩy lui) — bạn chân thành = đẩy lại 3 lần.\n\nVỀ TRA LỜI 'TÔI CŨNG CÓ LỖI' (我也有错) của bạn: nhiều bạn Trung Quốc sẽ chia sẻ một phần lỗi của họ để giảm áp lực cho bạn. KHÔNG là 'okay you don't need to apologize' — họ đang nâng đỡ bạn cảm xúc. Vẫn hoàn thành lời xin lỗi của mình + cảm ơn họ chia sẻ lỗi: '谢谢你这么说, 但这次主要是我的错'.\n\nVỀ SAY RƯỢU: bạn say rượu nói/làm tổn thương → KHÔNG dùng làm bào chữa ('我那天喝醉了, 不记得'). 'Đã say' không miễn trách nhiệm trong văn hóa Trung Quốc đại lục. Ngay cả nếu bạn không nhớ, đã làm tổn thương = phải xin lỗi như đã tỉnh táo.",
    tip_advice_vi: "(1) ĐỪNG XIN LỖI NGAY trong 12 giờ đầu sau lỗi. Quá nhanh = phản xạ, không phải suy nghĩ. Cho mình 1 đêm ngủ + 1 ngày suy nghĩ. Viết bản nháp những gì sẽ nói trên giấy. (2) CHUẨN BỊ 4 PHẦN: thừa nhận cụ thể (làm gì), công nhận tác động (làm bạn cảm thấy thế nào), không bào chữa (không 'tại vì'), đề xuất bù đắp (sẽ làm gì để chuộc). Mỗi phần 1-2 câu. Tổng 1-2 phút. (3) GẶP MẶT cho lỗi nghiêm trọng. Hẹn cụ thể: 'tối mai 7 giờ, mình muốn gặp nói chuyện 30 phút'. KHÔNG xin lỗi qua tin nhắn dài lê thê. (4) CHỌN ĐỊA ĐIỂM RIÊNG: quán cà phê yên tĩnh, không nhiều người. KHÔNG quán đông + ồn. Bạn cần không gian để bạn ấy phản ứng (khóc, im lặng, thậm chí giận lại). (5) NGÔN NGỮ THÂN THỂ: nhìn vào mắt khi xin lỗi (không nhìn xuống). Cúi đầu nhẹ. KHÔNG cười (kể cả nụ cười tự nhiên ngại ngùng — bạn Trung sẽ hiểu nhầm là không nghiêm túc). (6) IM LẶNG SAU KHI XIN LỖI: đừng nói thêm. Để bạn ấy có thời gian phản ứng. 30 giây - 1 phút im lặng = OK, đôi khi cần. (7) KHÔNG ÉP THA THỨ NGAY: nếu bạn nói '我需要时间' (mình cần thời gian), CHẤP NHẬN. KHÔNG nói '我们还是朋友吧?' ép xác nhận. Hứa: 'mình đợi, có gì cần cứ nhắn'. Sau đó RÚT LUI — đừng nhắn tin liên tục, cho không gian. (8) KHÔNG NHẮC LẠI lỗi này sau khi đã được tha thứ. Nhắc lại = đào lại vết thương. Người Trung Quốc đặc biệt nhạy với điều này.",
    exercises: [
      { type: "fill-blank", question: "我没站在你的 ___ 想, 是我考虑不周。", answer: "角度" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung xin lỗi với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "当面道歉", pinyin: "dāng miàn dào qiàn", english: "xin lỗi trực tiếp" },
          { chinese: "考虑不周", pinyin: "kǎo lǜ bù zhōu", english: "suy nghĩ chưa chu toàn" },
          { chinese: "知错就改", pinyin: "zhī cuò jiù gǎi", english: "biết sai sửa ngay" },
          { chinese: "真心诚意", pinyin: "zhēn xīn chéng yì", english: "chân tâm thành ý" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Mình muốn xin lỗi bạn trực tiếp. Mình không đặt mình vào góc nhìn của bạn, là mình suy nghĩ chưa chu toàn. Sau này tuyệt đối không tái phạm.",
        chinese: "我想跟你当面道歉。我没站在你的角度想, 是我考虑不周。我以后绝对不会再犯。",
        pinyin: "Wǒ xiǎng gēn nǐ dāng miàn dào qiàn. Wǒ méi zhàn zài nǐ de jiǎo dù xiǎng, shì wǒ kǎo lǜ bù zhōu. Wǒ yǐ hòu jué duì bù huì zài fàn."
      }
    ]
  },
  {
    id: 86,
    level: "B2",
    category: "personal_social",
    title: "永久告别 — 朋友搬到远方",
    pinyin: "yǒng jiǔ gào bié — péng you bān dào yuǎn fāng",
    topic: "Permanent goodbye — friend moving away",
    title_vi: "Tạm biệt vĩnh viễn — bạn chuyển đi xa",
    title_en: "Saying goodbye permanently — friend moving away",
    sentences: [
      {
        chinese: "你下个月真的要去美国了, 我心里还是有点不舍。",
        pinyin: "Nǐ xià gè yuè zhēn de yào qù Měiguó le, wǒ xīnlǐ háishì yǒudiǎn bù shě.",
        english: "You're really going to America next month — I still feel reluctant.",
        vi: "Tháng sau bạn thực sự đi Mỹ rồi, lòng mình vẫn lưu luyến.",
        pronunciation_focus: ["真的 → zhēn de (thực sự)", "美国 → Měiguó", "不舍 → bù shě (lưu luyến)", "心里 → xīnlǐ"]
      },
      {
        chinese: "这十年的友谊, 我一辈子都不会忘。",
        pinyin: "Zhè shí nián de yǒuyì, wǒ yībèizi dōu bù huì wàng.",
        english: "This 10 years of friendship — I'll never forget in my whole life.",
        vi: "Mười năm tình bạn này, mình cả đời không quên.",
        pronunciation_focus: ["友谊 → yǒuyì (tình bạn)", "一辈子 → yībèizi (cả đời)", "忘 → wàng (quên)", "十年 → shí nián"]
      },
      {
        chinese: "海内存知己, 天涯若比邻 — 我们就是这样的朋友。",
        pinyin: "Hǎi nèi cún zhī jǐ, tiānyá ruò bǐlín — wǒmen jiùshì zhèyàng de péngyou.",
        english: "True friends span seas, distant horizons feel close — that's the kind of friends we are.",
        vi: "Trong bốn biển có tri kỷ, chân trời như cận kề — mình là kiểu bạn như thế.",
        pronunciation_focus: ["海内存知己 → hǎi nèi cún zhī jǐ (Vương Bột)", "天涯若比邻 → tiānyá ruò bǐlín", "知己 → zhī jǐ (tri kỷ)", "比邻 → bǐlín (cận kề)"]
      },
      {
        chinese: "保持联系啊, 微信视频随时找我。",
        pinyin: "Bǎochí liánxì a, wēixìn shìpín suíshí zhǎo wǒ.",
        english: "Keep in touch — WeChat video me anytime.",
        vi: "Giữ liên lạc nhé, gọi video WeChat lúc nào cũng được.",
        pronunciation_focus: ["保持联系 → bǎochí liánxì (giữ liên lạc)", "视频 → shìpín (video call)", "随时 → suíshí (bất cứ lúc nào)", "微信 → wēixìn"]
      },
      {
        chinese: "无论你在哪里, 我都为你高兴, 也希望你过得幸福。",
        pinyin: "Wúlùn nǐ zài nǎlǐ, wǒ dōu wèi nǐ gāoxìng, yě xīwàng nǐ guò de xìngfú.",
        english: "Wherever you are, I'm happy for you and wish you a happy life.",
        vi: "Dù bạn ở đâu, mình cũng mừng cho bạn và mong bạn sống hạnh phúc.",
        pronunciation_focus: ["无论 → wúlùn (dù)", "高兴 → gāoxìng (mừng)", "幸福 → xìngfú (hạnh phúc)", "过得 → guò de"]
      }
    ],
    vocab: [
      { chinese: "告别", pinyin: "gào bié", english: "to bid farewell", vi: "tạm biệt" },
      { chinese: "搬家", pinyin: "bān jiā", english: "to move (residence)", vi: "chuyển nhà" },
      { chinese: "移民", pinyin: "yí mín", english: "to immigrate", vi: "di cư" },
      { chinese: "不舍", pinyin: "bù shě", english: "reluctant to part", vi: "lưu luyến" },
      { chinese: "依依不舍", pinyin: "yī yī bù shě", english: "linger reluctantly", vi: "bịn rịn không muốn rời" },
      { chinese: "保持联系", pinyin: "bǎo chí lián xì", english: "stay in touch", vi: "giữ liên lạc" },
      { chinese: "送别", pinyin: "sòng bié", english: "to see off", vi: "tiễn biệt" },
      { chinese: "一辈子", pinyin: "yī bèi zi", english: "whole life", vi: "cả đời" },
      { chinese: "知己", pinyin: "zhī jǐ", english: "true friend / soulmate", vi: "tri kỷ" },
      { chinese: "异地", pinyin: "yì dì", english: "different place / long-distance", vi: "khác nơi / xa cách" }
    ],
    dialogue: [
      { speaker: "梅", chinese: "丽丽, 后天就要走了, 心情怎么样?", pinyin: "Lìli, hòutiān jiù yào zǒu le, xīnqíng zěnmeyàng?", english: "Lili, leaving the day after tomorrow — how do you feel?", vi: "Lệ Lệ, kia là đi rồi, tâm trạng thế nào?" },
      { speaker: "丽丽", chinese: "又激动又难过。激动是新生活, 难过是要离开你们。", pinyin: "Yòu jīdòng yòu nánguò. Jīdòng shì xīn shēnghuó, nánguò shì yào líkāi nǐmen.", english: "Excited and sad. Excited for new life, sad to leave you.", vi: "Vừa hồi hộp vừa buồn. Hồi hộp vì cuộc sống mới, buồn vì phải xa các bạn." },
      { speaker: "梅", chinese: "我也舍不得你, 但是为你高兴。这是好事。", pinyin: "Wǒ yě shěbude nǐ, dànshì wèi nǐ gāoxìng. Zhè shì hǎo shì.", english: "I'll miss you too, but happy for you. This is a good thing.", vi: "Mình cũng tiếc xa bạn, nhưng mừng cho bạn. Đây là việc tốt." },
      { speaker: "丽丽", chinese: "保持联系啊, 我会想你的。", pinyin: "Bǎochí liánxì a, wǒ huì xiǎng nǐ de.", english: "Stay in touch, I'll miss you.", vi: "Giữ liên lạc nhé, mình sẽ nhớ bạn." }
    ],
    dialogue_long: [
      { speaker: "丽丽", chinese: "梅, 后天我就飞了。来你这里再坐一次。", pinyin: "Méi, hòutiān wǒ jiù fēi le. Lái nǐ zhèlǐ zài zuò yī cì.", english: "Mei, I fly the day after tomorrow. Came to sit with you one last time.", vi: "Mai, kia mình bay rồi. Đến nhà bạn ngồi một lần nữa." },
      { speaker: "梅", chinese: "进来, 我泡茶。这个时间正好, 我也快下班了。", pinyin: "Jìnlái, wǒ pào chá. Zhège shíjiān zhènghǎo, wǒ yě kuài xiàbān le.", english: "Come in, I'll make tea. Good timing, I'm getting off work soon.", vi: "Vào đi, mình pha trà. Giờ này vừa đẹp, mình cũng sắp tan ca." },
      { speaker: "丽丽", chinese: "我看着你的客厅, 想起十年前我们一起在大学宿舍喝奶茶的时候。", pinyin: "Wǒ kàn zhe nǐ de kètīng, xiǎng qǐ shí nián qián wǒmen yīqǐ zài dàxué sùshè hē nǎichá de shíhou.", english: "Looking at your living room, I remember 10 years ago we drank milk tea in the dorm.", vi: "Mình nhìn phòng khách bạn, nhớ lại 10 năm trước hai đứa cùng uống trà sữa ở ký túc xá đại học." },
      { speaker: "梅", chinese: "那时候我们刚认识三个月, 谁能想到一起走十年。", pinyin: "Nà shíhou wǒmen gāng rènshi sān gè yuè, shéi néng xiǎngdào yīqǐ zǒu shí nián.", english: "Just three months knowing each other then — who'd think 10 years together.", vi: "Lúc đó mình mới quen nhau 3 tháng, ai nghĩ đi cùng 10 năm." },
      { speaker: "丽丽", chinese: "你陪我经历了所有事: 实习被骂哭, 第一次失恋, 我妈住院, 我换工作。每次我崩溃, 都是你接电话。", pinyin: "Nǐ péi wǒ jīnglì le suǒyǒu shì: shíxí bèi mà kū, dì yī cì shīliàn, wǒ mā zhùyuàn, wǒ huàn gōngzuò. Měi cì wǒ bēngkuì, dōu shì nǐ jiē diànhuà.", english: "You went through everything with me: scolded crying as intern, first heartbreak, mom hospitalized, job change. Every breakdown, you answered.", vi: "Bạn ở bên mình qua hết mọi chuyện: thực tập bị mắng khóc, lần đầu tan vỡ, mẹ mình nhập viện, mình đổi việc. Mỗi lần mình sụp đổ, đều là bạn nghe điện thoại." },
      { speaker: "梅", chinese: "你也是我的人。我搬来上海前两个月一个人住, 没人说话。是你坚持每周来一次, 我才没崩溃。", pinyin: "Nǐ yěshì wǒ de rén. Wǒ bān lái Shànghǎi qián liǎng gè yuè yī gè rén zhù, méi rén shuōhuà. Shì nǐ jiānchí měi zhōu lái yī cì, wǒ cái méi bēngkuì.", english: "You're my person too. First 2 months alone in Shanghai, no one to talk to. You insisted on coming weekly — that's why I didn't break.", vi: "Bạn cũng là người của mình. Hai tháng đầu mình chuyển đến Thượng Hải sống một mình, không có ai nói chuyện. Là bạn kiên trì đến mỗi tuần một lần, mình mới không sụp đổ." },
      { speaker: "丽丽", chinese: "美国去了, 时差12小时, 联系会很难。我有点担心我们慢慢就疏远了。", pinyin: "Měiguó qù le, shíchā shí'èr xiǎoshí, liánxì huì hěn nán. Wǒ yǒudiǎn dānxīn wǒmen mànman jiù shūyuǎn le.", english: "Going to America, 12-hour time difference, hard to keep contact. I worry we'll drift apart slowly.", vi: "Đi Mỹ rồi, lệch 12 giờ, liên lạc sẽ khó. Mình hơi lo mình sẽ từ từ xa cách." },
      { speaker: "梅", chinese: "丽丽, 真朋友不会因为距离就疏远。海内存知己, 天涯若比邻。我们建立的不是地理上的关系, 是心灵上的。", pinyin: "Lìli, zhēn péngyou bù huì yīnwèi jùlí jiù shūyuǎn. Hǎi nèi cún zhī jǐ, tiānyá ruò bǐlín. Wǒmen jiànlì de bù shì dìlǐ shàng de guānxi, shì xīnlíng shàng de.", english: "Lili, true friends don't drift due to distance. 'True friends span seas, distant horizons feel close.' We built a heart connection, not geographical.", vi: "Lệ Lệ, bạn thật không vì khoảng cách mà xa cách. Trong bốn biển có tri kỷ, chân trời như cận kề. Mình xây quan hệ trong lòng, không phải địa lý." },
      { speaker: "丽丽", chinese: "答应我一件事: 一年至少视频通话两次, 一年至少互寄一份生日礼物。再忙也要做。", pinyin: "Dāyìng wǒ yī jiàn shì: yī nián zhìshǎo shìpín tōnghuà liǎng cì, yī nián zhìshǎo hù jì yī fèn shēngrì lǐwù. Zài máng yě yào zuò.", english: "Promise me one thing: at least 2 video calls per year, at least 1 birthday gift exchange yearly. No matter how busy.", vi: "Hứa với mình một điều: mỗi năm ít nhất gọi video 2 lần, ít nhất gửi quà sinh nhật cho nhau 1 lần mỗi năm. Bận thế nào cũng phải làm." },
      { speaker: "梅", chinese: "我答应你。还有, 你回中国的时候, 一定来上海找我, 不能就在北京见父母就走。", pinyin: "Wǒ dāyìng nǐ. Hái yǒu, nǐ huí Zhōngguó de shíhou, yīdìng lái Shànghǎi zhǎo wǒ, bù néng jiù zài Běijīng jiàn fùmǔ jiù zǒu.", english: "I promise. Also, when you come back to China, must come Shanghai to find me — can't just see parents in Beijing and leave.", vi: "Mình hứa. Còn nữa, khi bạn về Trung Quốc, nhất định đến Thượng Hải tìm mình, không được chỉ gặp bố mẹ ở Bắc Kinh rồi đi." },
      { speaker: "丽丽", chinese: "答应。三年内我也要去美国找你一次, 你来接机, 带我吃汉堡。", pinyin: "Dāyìng. Sān nián nèi wǒ yě yào qù Měiguó zhǎo nǐ yī cì, nǐ lái jiējī, dài wǒ chī hànbǎo.", english: "Promise. Within 3 years, I'll come find you in America too, you pick me up at airport, take me for burgers.", vi: "Hứa. Trong 3 năm mình cũng sẽ qua Mỹ tìm bạn một lần, bạn ra sân bay đón, dẫn đi ăn burger." },
      { speaker: "梅", chinese: "好啊, 一定。这个画面太好了。", pinyin: "Hǎo a, yīdìng. Zhège huàmiàn tài hǎo le.", english: "Yes, definitely. That picture is too good.", vi: "Được, nhất định. Cảnh đó đẹp quá." },
      { speaker: "丽丽", chinese: "我准备了一个礼物给你。是这十年来我们一起拍的照片整理成的小相册, 还有一封信。等我走了再看, 现在看你会哭。", pinyin: "Wǒ zhǔnbèi le yī gè lǐwù gěi nǐ. Shì zhè shí nián lái wǒmen yīqǐ pāi de zhàopiàn zhěnglǐ chéng de xiǎo xiàngcè, hái yǒu yī fēng xìn. Děng wǒ zǒu le zài kàn, xiànzài kàn nǐ huì kū.", english: "I prepared a gift. A small photo album from our 10 years together plus a letter. Open after I leave — now you'll cry.", vi: "Mình đã chuẩn bị một món quà. Là album ảnh nhỏ 10 năm mình chụp cùng nhau, kèm một lá thư. Đợi mình đi rồi mở, giờ mở bạn sẽ khóc." },
      { speaker: "梅", chinese: "我也有礼物给你。一个越南红木刻的小盒子, 我妈帮我做的。装你以后想念中国时候的回忆。", pinyin: "Wǒ yěyǒu lǐwù gěi nǐ. Yī gè Yuènán hóngmù kè de xiǎo hézi, wǒ mā bāng wǒ zuò de. Zhuāng nǐ yǐhòu xiǎngniàn Zhōngguó shíhou de huíyì.", english: "I have a gift too. A small carved Vietnamese rosewood box my mom helped me make. To hold memories when you miss China.", vi: "Mình cũng có quà cho bạn. Một hộp nhỏ chạm gỗ trắc Việt Nam, mẹ mình giúp làm. Đựng kỷ niệm khi bạn nhớ Trung Quốc." },
      { speaker: "丽丽", chinese: "梅... (哭了) 我真的舍不得。", pinyin: "Méi... (kū le) wǒ zhēn de shěbude.", english: "Mei... (cries) I really can't bear to leave.", vi: "Mai... (khóc) mình thực sự không nỡ rời." },
      { speaker: "梅", chinese: "我也是。哭吧, 哭完了笑着分别。我们后会有期。", pinyin: "Wǒ yěshì. Kū ba, kū wán le xiàozhe fēnbié. Wǒmen hòu huì yǒu qī.", english: "Me too. Cry it out, then say goodbye smiling. We'll meet again.", vi: "Mình cũng vậy. Khóc đi, khóc xong tạm biệt mỉm cười. Mình sẽ gặp lại." }
    ],
    roleplay_prompts: [
      "Bạn Trung Quốc của bạn vừa quyết định di cư gia đình sang Singapore, không bao giờ trở lại sống ở đại lục. Hãy chuẩn bị bữa ăn tạm biệt: nấu món Việt + món Trung họ thích + làm playlist nhạc cũ. Trong cuộc gặp, hãy thể hiện hỗ trợ quyết định + nhớ kỷ niệm cụ thể + lập kế hoạch giữ liên lạc.",
      "Bạn thân Trung Quốc làm việc ở Việt Nam 5 năm, hết hợp đồng, về Trung Quốc vĩnh viễn. Hãy tổ chức tiệc tiễn nhỏ: mời 3-4 người bạn chung + chuẩn bị quà kỷ niệm (album ảnh, áo dài Việt Nam, cà phê G7) + viết thư tay bằng tiếng Trung. Tránh khóc cả buổi — chia tay vui vẻ + hứa giữ liên lạc.",
      "Bạn Trung Quốc của bạn không di cư mà mất liên lạc dần (3 tháng không trả lời). Hãy nhắn tin cuối cùng: chấp nhận khoảng cách, bày tỏ lời chào trang trọng nhưng không trách móc, mở cửa để họ trở lại liên lạc khi nào sẵn sàng. Cụm '不打扰你了, 但门一直开着'."
    ],
    register_notes: "Tạm biệt vĩnh viễn giữa bạn thân dùng register thân mật cao + cảm xúc — KHÔNG formal, KHÔNG lạnh. Đây là khoảnh khắc lộ tâm.\n\nCác cụm chuẩn từ NHẸ đến NẶNG cảm xúc:\n- 再见 (zàijiàn — tạm biệt) — quá nhẹ cho dịp này\n- 后会有期 (hòu huì yǒu qī — hẹn gặp lại) — lịch sự, có hứa hẹn\n- 保持联系 (bǎochí liánxì — giữ liên lạc) — cụ thể\n- 一路顺风 (yī lù shùn fēng — chúc thuận buồm) — chúc hành trình\n- 一路平安 (yī lù píng'ān — chúc đi đường bình an) — chúc an toàn\n- 我会想你的 (wǒ huì xiǎng nǐ de — mình sẽ nhớ bạn) — cảm xúc cá nhân\n- 我舍不得你 (wǒ shěbude nǐ — mình không nỡ xa bạn) — cảm xúc sâu\n\nKHI BẠN KHÓC: bạn Trung Quốc thường khóc khi tạm biệt thân — đừng giả vờ bình thản. 'Nước mắt đẹp' (美丽的眼泪) là chấp nhận trong văn hóa.\n\nQuà tạm biệt:\n- Album ảnh kỷ niệm chung (làm trước qua app, in hardcopy)\n- Vật kỷ niệm gốc văn hóa (lụa Vạn Phúc, gỗ chạm khắc — đặc biệt nếu bạn Trung Quốc đi nước khác)\n- Thư tay bằng tiếng Trung — nỗ lực + cá nhân\n- KHÔNG quà đắt tiền (đồng hồ Rolex) — bạn thân không cần ấn tượng nhau bằng tiền\n\nTránh: (a) Hứa lèo 'mình sẽ ghé thăm bạn' nếu thực tế không thể; (b) Đăng status lâm li trên mạng xã hội — riêng tư > công khai; (c) Liên hệ quá nhiều trong tuần đầu sau khi họ đi — họ cần ổn định ở nơi mới; (d) Nhắc về quá khứ liên tục — họ cần xây tương lai mới.",
    idiom_glosses: [
      {
        idiom: "海内存知己, 天涯若比邻",
        literal: "trong bốn biển có tri kỷ, chân trời như cận kề (Vương Bột)",
        meaning: "Câu thơ Vương Bột đời Đường — nếu có tri kỷ, dù xa cũng gần. Cụm cao cấp dùng để chia tay bạn thân vĩnh viễn — khẳng định tình bạn vượt khoảng cách. Trích đúng tác giả thể hiện trình độ.",
        example: "海内存知己, 天涯若比邻 — 我们就是这样的朋友。"
      },
      {
        idiom: "依依不舍",
        literal: "y y bất xả (yī yī bù shě)",
        meaning: "Bịn rịn không nỡ rời — cảm giác lưu luyến mạnh. Cụm dùng để miêu tả khoảnh khắc tạm biệt: '我依依不舍地送她走'. Văn vẻ + chân thành.",
        example: "我依依不舍地送她去机场。"
      },
      {
        idiom: "后会有期",
        literal: "lần sau có hẹn (hòu huì yǒu qī)",
        meaning: "Hẹn gặp lại — câu kết tạm biệt chuẩn. Mạnh hơn 'goodbye' đơn giản, ngụ ý 'không kết thúc'. Cụm formal nhưng ấm.",
        example: "今天先这样, 后会有期。"
      },
      {
        idiom: "天涯海角",
        literal: "thiên nhai hải giác (tiān yá hǎi jiǎo)",
        meaning: "Chân trời góc biển — nơi xa xôi nhất. Cụm để khẳng định tình bạn dù xa: '不管你在天涯海角, 我都记得你'. Cảm xúc + thi vị.",
        example: "天涯海角, 我们的友谊不变。"
      }
    ],
    cultural_notes_vi: "Tạm biệt vĩnh viễn (移民, 永别, 长别) là một trong những khoảnh khắc cảm xúc nhất trong văn hóa bạn bè Trung Quốc. Bốn nguyên tắc:\n\n(1) GẶP MẶT TẠM BIỆT trước khi đi: KHÔNG chỉ qua tin nhắn. Người Trung Quốc đại lục coi 'không gặp mặt tạm biệt' là thiếu lòng. Tổ chức bữa ăn tiễn (送行宴 — sòngxíng yàn) hoặc cuộc cà phê riêng, ít nhất 1-2 giờ. Đối với bạn rất thân: nhiều cuộc gặp trong tuần cuối + 1 cuộc tiễn cuối cùng (thường tại sân bay).\n\n(2) RA SÂN BAY TIỄN (送机 — sòngjī): hành động mạnh trong văn hóa Trung Quốc. Bạn ở Việt Nam có thể không tiễn được (visa, công việc), nhưng VIDEO CALL từ check-in counter là thay thế tốt. Cử chỉ này nhớ lâu.\n\n(3) QUÀ TẠM BIỆT (送行礼 — sòngxíng lǐ): không bắt buộc nhưng phổ biến. Quy tắc: cá nhân hóa + có giá trị kỷ niệm > giá trị tiền. Album ảnh chung, thư tay, vật kỷ niệm văn hóa (lụa Vạn Phúc, ấm trà). Tránh: tiền mặt (lạnh), đồng hồ (xui — sòng zhōng = sòng tiễn người chết — đại kỵ).\n\n(4) GIỮ LIÊN LẠC SAU: khoảng 70% tình bạn xuyên biên giới mai một sau 2 năm. NGUYÊN NHÂN: thiếu nỗ lực chủ động. Thiết lập 'quy tắc' cụ thể giúp duy trì:\n- Video call cố định mỗi 2-3 tháng (ghi vào lịch)\n- Gửi quà sinh nhật + Tết qua bưu điện quốc tế\n- WeChat Moments thường xuyên (like, comment ngắn)\n- 1 chuyến thăm trong 3 năm (xen kẽ — một lần bạn sang, một lần họ về)\n\nVỀ DI CƯ TRUNG QUỐC HIỆN ĐẠI: khoảng 100,000 người Trung Quốc đi định cư nước khác mỗi năm (Mỹ, Canada, Úc, Singapore — top 4). Lý do phổ biến: con cái học tập, môi trường, kinh tế. Đây là tâm trạng rất riêng (vừa hy vọng vừa mất mát) — đừng phán xét lựa chọn của bạn.\n\nVỀ THÔNG ĐIỆP TRỞ LẠI: khi bạn Trung Quốc đã ở nước ngoài, tâm lý thường: tháng 1-3 phấn khích thám hiểm; tháng 4-6 sốc văn hóa; tháng 7-12 ổn định; năm 2 nhớ nhà mạnh; năm 3+ ổn định new normal. Hỗ trợ tinh thần đặc biệt cần thiết tháng 4-6 (sốc) và năm 2 (nhớ nhà). Nhắn tin nhiều ở những giai đoạn này.\n\nVỀ CÔNG NGHỆ: WeChat hoạt động ở nước ngoài (không bị Trung Quốc chặn — vì chính TQ làm). Whatsapp, Telegram thì TQ chặn. Khi bạn Trung Quốc đi nước ngoài, có thể họ chuyển sang Whatsapp/Telegram cho bạn bè quốc tế nhưng vẫn giữ WeChat cho gia đình. Bạn có thể giữ WeChat làm kênh chính.",
    tip_advice_vi: "(1) BẮT ĐẦU CHUẨN BỊ TẠM BIỆT từ 1 tháng trước. Đừng chờ tuần cuối. Lên kế hoạch: bữa ăn tiễn nhóm (2 tuần trước), cuộc gặp riêng 1-1 (1 tuần trước), tin nhắn cuối ngày khởi hành. (2) ALBUM ẢNH KỶ NIỆM: dành 2-3 ngày tổng hợp ảnh từ điện thoại + Cloud → app như Photobook (HK) hoặc Albelli — gửi đến địa chỉ trước khi họ đi. ~300-500 tệ. Quà ý nghĩa nhất bạn có thể tặng. (3) THƯ TAY (亲笔信): viết bằng TIẾNG TRUNG (kể cả nếu bạn vụng) — nỗ lực = ấn tượng. 1-2 trang viết tay (không in). Nội dung: 3 kỷ niệm cụ thể bạn nhớ + 3 điều bạn học được từ tình bạn + 1 lời chúc tương lai. Bỏ phong thư đỏ. (4) LIÊN LẠC ĐẦU TIÊN sau khi họ đi: 24 giờ sau khi họ đến nơi mới — '你到了吗? 怎么样?' (đến chưa, thế nào?). Câu hỏi đơn giản, không nói chuyện sâu. Họ đang mệt + thay đổi múi giờ. (5) ĐẶT CALENDAR REMINDER: video call mỗi 2-3 tháng. Sinh nhật + Tết — gửi quà qua bưu điện quốc tế (DHL ~30-60 USD). Lịch cụ thể giúp duy trì khi cuộc sống bận. (6) WECHAT MOMENTS: like + comment ngắn các bài đăng của họ — duy trì 'sự hiện diện' ngay cả khi không nói chuyện sâu. Một câu '看到你在新城市适应得很好' (thấy bạn thích nghi ở thành phố mới rất tốt) đủ. (7) THĂM TRỰC TIẾP: lập kế hoạch 1 chuyến thăm trong 2-3 năm đầu. Cộng visa + vé bay + khách sạn = 1,500-3,000 USD. Đắt nhưng đáng — gặp mặt 5 ngày = giá trị bằng 100 cuộc video call. Bạn Trung Quốc sẽ nhớ nỗ lực này cả đời.",
    exercises: [
      { type: "fill-blank", question: "海内存知己, ___ 若比邻 — 我们就是这样的朋友。", answer: "天涯" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung tạm biệt với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "依依不舍", pinyin: "yī yī bù shě", english: "bịn rịn không muốn rời" },
          { chinese: "保持联系", pinyin: "bǎo chí lián xì", english: "giữ liên lạc" },
          { chinese: "后会有期", pinyin: "hòu huì yǒu qī", english: "hẹn gặp lại" },
          { chinese: "知己", pinyin: "zhī jǐ", english: "tri kỷ" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Mười năm tình bạn này, mình cả đời không quên. Trong bốn biển có tri kỷ, chân trời như cận kề.",
        chinese: "这十年的友谊, 我一辈子都不会忘。海内存知己, 天涯若比邻。",
        pinyin: "Zhè shí nián de yǒu yì, wǒ yī bèi zi dōu bù huì wàng. Hǎi nèi cún zhī jǐ, tiān yá ruò bǐ lín."
      }
    ]
  },
  {
    id: 87,
    level: "B2",
    category: "personal_social",
    title: "支持遇到困难的朋友 — 工作压力, 家庭烦恼",
    pinyin: "zhī chí yù dào kùn nán de péng you — gōng zuò yā lì, jiā tíng fán nǎo",
    topic: "Supporting friend going through hard time — work stress, family pressure",
    title_vi: "Hỗ trợ bạn đang khó khăn — áp lực công việc, lo nghĩ gia đình",
    title_en: "Supporting friend in hard time — work stress, family worries",
    sentences: [
      {
        chinese: "你最近看起来很累, 怎么了? 我陪你聊聊。",
        pinyin: "Nǐ zuìjìn kàn qǐlái hěn lèi, zěnme le? Wǒ péi nǐ liáoliao.",
        english: "You look tired lately — what's going on? I'll listen.",
        vi: "Dạo này bạn trông rất mệt, có chuyện gì vậy? Mình ngồi nghe bạn nói.",
        pronunciation_focus: ["看起来 → kàn qǐlái (trông có vẻ)", "累 → lèi (mệt)", "陪你聊 → péi nǐ liáo (ngồi cùng bạn nói chuyện)", "怎么了 → zěnme le"]
      },
      {
        chinese: "我能听出来你很难, 你不是一个人在面对。",
        pinyin: "Wǒ néng tīng chūlái nǐ hěn nán, nǐ bù shì yī gè rén zài miànduì.",
        english: "I can hear how hard this is — you're not facing it alone.",
        vi: "Mình nghe được bạn khó khăn lắm, bạn không phải đối mặt một mình.",
        pronunciation_focus: ["听出来 → tīng chūlái (nghe ra)", "难 → nán (khó)", "面对 → miànduì (đối mặt)", "一个人 → yī gè rén"]
      },
      {
        chinese: "需要做什么具体的事情, 告诉我, 我帮你分担。",
        pinyin: "Xūyào zuò shénme jùtǐ de shìqing, gàosu wǒ, wǒ bāng nǐ fēndān.",
        english: "What specifically needs doing, tell me — I'll share the load.",
        vi: "Cần làm gì cụ thể, nói mình, mình san sẻ với bạn.",
        pronunciation_focus: ["具体 → jùtǐ (cụ thể)", "分担 → fēndān (san sẻ / cùng gánh)", "需要 → xūyào", "告诉我 → gàosu wǒ"]
      },
      {
        chinese: "你不必一个人扛, 朋友就是用来在这种时候的。",
        pinyin: "Nǐ bù bì yī gè rén káng, péngyou jiùshì yònglái zài zhè zhǒng shíhou de.",
        english: "You don't have to carry it alone — that's what friends are for.",
        vi: "Bạn không phải gánh một mình, bạn bè là để cho những lúc như thế này.",
        pronunciation_focus: ["扛 → káng (gánh)", "朋友 → péngyou (bạn)", "在这种时候 → zài zhè zhǒng shíhou (lúc thế này)", "不必 → bù bì"]
      },
      {
        chinese: "有空我们去散步, 不一定聊重的事, 散散心也好。",
        pinyin: "Yǒu kòng wǒmen qù sànbù, bù yīdìng liáo zhòng de shì, sànsàn xīn yě hǎo.",
        english: "Let's go for a walk when free — don't have to talk heavy stuff, just clear the mind.",
        vi: "Khi rảnh mình đi dạo, không nhất thiết phải nói chuyện nặng, đi cho khuây khỏa cũng được.",
        pronunciation_focus: ["散步 → sànbù (đi dạo)", "重的事 → zhòng de shì (chuyện nặng)", "散散心 → sànsàn xīn (khuây khỏa)", "有空 → yǒu kòng"]
      }
    ],
    vocab: [
      { chinese: "压力", pinyin: "yā lì", english: "pressure / stress", vi: "áp lực" },
      { chinese: "累", pinyin: "lèi", english: "tired / exhausted", vi: "mệt" },
      { chinese: "崩溃", pinyin: "bēng kuì", english: "to break down (emotionally)", vi: "sụp đổ" },
      { chinese: "倾听", pinyin: "qīng tīng", english: "to listen attentively", vi: "lắng nghe" },
      { chinese: "陪伴", pinyin: "péi bàn", english: "to accompany", vi: "ở bên" },
      { chinese: "分担", pinyin: "fēn dān", english: "to share burden", vi: "san sẻ gánh nặng" },
      { chinese: "倒苦水", pinyin: "dào kǔ shuǐ", english: "to vent (lit. pour out bitter water)", vi: "xả nỗi khổ" },
      { chinese: "雪中送炭", pinyin: "xuě zhōng sòng tàn", english: "send charcoal in snow (timely help)", vi: "trong tuyết tặng than (giúp đỡ đúng lúc)" },
      { chinese: "患难见真情", pinyin: "huàn nàn jiàn zhēn qíng", english: "hardship reveals true feelings", vi: "hoạn nạn thấy chân tình" },
      { chinese: "同舟共济", pinyin: "tóng zhōu gòng jì", english: "share boat, share fate", vi: "cùng thuyền cùng vượt" }
    ],
    dialogue: [
      { speaker: "梅", chinese: "丽丽, 你最近脸色不太好, 怎么了?", pinyin: "Lìli, nǐ zuìjìn liǎnsè bù tài hǎo, zěnme le?", english: "Lili, you look pale lately, what's wrong?", vi: "Lệ Lệ, dạo này sắc mặt bạn không tốt, có chuyện gì vậy?" },
      { speaker: "丽丽", chinese: "工作上压力大, 加班到十一点, 还有家里催我相亲, 我快疯了。", pinyin: "Gōngzuò shàng yālì dà, jiābān dào shíyī diǎn, hái yǒu jiā lǐ cuī wǒ xiāngqīn, wǒ kuài fēng le.", english: "Work pressure huge, OT till 11 PM, plus family pushing matchmaking — I'm losing it.", vi: "Áp lực công việc lớn, tăng ca đến 11 giờ, lại bị nhà giục gặp người mai mối, mình sắp điên rồi." },
      { speaker: "梅", chinese: "听起来很多事一起来, 周末来我家吃饭, 不聊重的, 就放松一下。", pinyin: "Tīng qǐlái hěn duō shì yīqǐ lái, zhōumò lái wǒ jiā chīfàn, bù liáo zhòng de, jiù fàngsōng yīxià.", english: "Sounds like everything's hitting at once. Come to my place this weekend, no heavy talk, just relax.", vi: "Nghe như nhiều chuyện cùng đến. Cuối tuần qua nhà mình ăn cơm, không nói chuyện nặng, chỉ thư giãn." },
      { speaker: "丽丽", chinese: "好, 我太需要这个了。", pinyin: "Hǎo, wǒ tài xūyào zhège le.", english: "Yes, I need this so much.", vi: "Vâng, mình cần điều này lắm." }
    ],
    dialogue_long: [
      { speaker: "梅", chinese: "丽丽, 我看你这两周都没发朋友圈, 平常每天都更新。还好吗?", pinyin: "Lìli, wǒ kàn nǐ zhè liǎng zhōu dōu méi fā péngyou quān, píngcháng měi tiān dōu gēngxīn. Hái hǎo ma?", english: "Lili, you haven't posted on Moments for two weeks, usually you update daily. You okay?", vi: "Lệ Lệ, hai tuần nay mình thấy bạn không đăng Moments, bình thường ngày nào cũng update. Bạn ổn không?" },
      { speaker: "丽丽", chinese: "唉, 不太好。最近事情多得想哭。", pinyin: "Āi, bù tài hǎo. Zuìjìn shìqing duō de xiǎng kū.", english: "Sigh, not great. So much going on, I want to cry.", vi: "Hứ, không tốt lắm. Dạo này chuyện nhiều đến mức muốn khóc." },
      { speaker: "梅", chinese: "想说什么吗? 我有时间。要不我现在过来你家?", pinyin: "Xiǎng shuō shénme ma? Wǒ yǒu shíjiān. Yàobù wǒ xiànzài guòlái nǐ jiā?", english: "Want to talk? I have time. Should I come to your place now?", vi: "Có muốn nói gì không? Mình có thời gian. Hay mình đến nhà bạn bây giờ?" },
      { speaker: "丽丽", chinese: "我有点不想见人。可以电话聊吗?", pinyin: "Wǒ yǒudiǎn bù xiǎng jiàn rén. Kěyǐ diànhuà liáo ma?", english: "Don't really want to see anyone. Can we just call?", vi: "Mình hơi không muốn gặp ai. Mình gọi điện được không?" },
      { speaker: "梅", chinese: "当然可以。我打给你。", pinyin: "Dāngrán kěyǐ. Wǒ dǎ gěi nǐ.", english: "Of course. I'll call you.", vi: "Đương nhiên được. Mình gọi cho bạn." },
      { speaker: "丽丽", chinese: "梅, 谢谢你打来。我不知道从哪开始说。", pinyin: "Méi, xièxie nǐ dǎ lái. Wǒ bù zhīdào cóng nǎ kāishǐ shuō.", english: "Mei, thanks for calling. I don't know where to start.", vi: "Mai, cảm ơn bạn gọi. Mình không biết bắt đầu từ đâu." },
      { speaker: "梅", chinese: "不用着急, 你想从哪开始就从哪开始, 我有时间听。", pinyin: "Bùyòng zháojí, nǐ xiǎng cóng nǎ kāishǐ jiù cóng nǎ kāishǐ, wǒ yǒu shíjiān tīng.", english: "No rush — start wherever, I have time to listen.", vi: "Không cần vội, bạn muốn bắt đầu từ đâu thì bắt đầu, mình có thời gian nghe." },
      { speaker: "丽丽", chinese: "工作上我们部门要裁员30%, 老板每天给我们压力, 让我们做更多的项目。我每晚都加班到十一点。", pinyin: "Gōngzuò shàng wǒmen bùmén yào cáiyuán bǎi fēn zhī sānshí, lǎobǎn měi tiān gěi wǒmen yālì, ràng wǒmen zuò gèng duō de xiàngmù. Wǒ měi wǎn dōu jiābān dào shíyī diǎn.", english: "At work my dept laying off 30%, boss pressures daily, makes us do more projects. I OT to 11 every night.", vi: "Công việc, phòng mình sẽ cắt giảm 30%, sếp ngày nào cũng tạo áp lực, bắt làm nhiều dự án hơn. Mỗi tối mình tăng ca đến 11 giờ." },
      { speaker: "梅", chinese: "天哪, 这压力太大了。你每天那么晚才睡, 身体怎么扛得住?", pinyin: "Tiān a, zhè yālì tài dà le. Nǐ měi tiān nàme wǎn cái shuì, shēntǐ zěnme káng de zhù?", english: "Oh god, that's huge pressure. Sleeping that late every night, how does your body handle?", vi: "Trời ơi, áp lực lớn quá. Mỗi ngày bạn ngủ muộn thế, cơ thể chịu sao nổi?" },
      { speaker: "丽丽", chinese: "扛不住, 我已经一个月睡不好了, 头晕想吐, 上周还胃痛。", pinyin: "Káng bù zhù, wǒ yǐjīng yī gè yuè shuì bù hǎo le, tóu yūn xiǎng tù, shàng zhōu hái wèi tòng.", english: "Can't handle, haven't slept well in a month, dizzy nauseous, stomach pain last week.", vi: "Không chịu nổi, mình đã một tháng ngủ không ngon, chóng mặt buồn nôn, tuần trước đau dạ dày." },
      { speaker: "梅", chinese: "丽丽, 你身体在报警。这周末你必须休息, 我陪你去看医生。", pinyin: "Lìli, nǐ shēntǐ zài bàojǐng. Zhè zhōumò nǐ bìxū xiūxi, wǒ péi nǐ qù kàn yīshēng.", english: "Lili, your body is sounding alarms. You MUST rest this weekend — I'll take you to see a doctor.", vi: "Lệ Lệ, cơ thể bạn đang báo động. Cuối tuần này bạn BẮT BUỘC phải nghỉ, mình đưa bạn đi khám bác sĩ." },
      { speaker: "丽丽", chinese: "我妈又一直催我相亲, 说我30岁了再不结婚就剩女了。每周都给我介绍新的, 我都没时间消化。", pinyin: "Wǒ mā yòu yīzhí cuī wǒ xiāngqīn, shuō wǒ sānshí suì le zài bù jiéhūn jiù shèng nǚ le. Měi zhōu dōu gěi wǒ jièshào xīn de, wǒ dōu méi shíjiān xiāohuà.", english: "Mom keeps pushing matchmaking, saying I'm 30 and unmarried = leftover. Weekly new introductions, I don't have time to process.", vi: "Mẹ cứ giục mình đi gặp mai mối, nói mình 30 chưa lấy chồng là 'gái ế'. Mỗi tuần giới thiệu người mới, mình không có thời gian tiêu hóa." },
      { speaker: "梅", chinese: "工作压力 + 家庭压力, 一起来。难怪你撑不住。你妈妈知道你工作这么辛苦吗?", pinyin: "Gōngzuò yālì + jiātíng yālì, yīqǐ lái. Nán guài nǐ chēng bù zhù. Nǐ māma zhīdào nǐ gōngzuò zhème xīnkǔ ma?", english: "Work pressure + family pressure together. No wonder you can't handle. Does your mom know how hard work is?", vi: "Áp lực công việc + áp lực gia đình cùng đến. Trách gì bạn không trụ nổi. Mẹ bạn có biết công việc bạn cực thế không?" },
      { speaker: "丽丽", chinese: "她不在乎, 她只想我嫁人。我说我累, 她说'结了婚有人照顾你'。", pinyin: "Tā bù zàihu, tā zhǐ xiǎng wǒ jià rén. Wǒ shuō wǒ lèi, tā shuō 'jiéle hūn yǒu rén zhàogù nǐ'.", english: "She doesn't care, only wants me married. I say I'm tired, she says 'married = someone cares for you'.", vi: "Mẹ không quan tâm, chỉ muốn mình lấy chồng. Mình nói mệt, mẹ bảo 'cưới rồi có người chăm sóc'." },
      { speaker: "梅", chinese: "丽丽, 听我说三件事。一, 你身体在报警, 必须先看医生, 不能拖。二, 工作的事情你能不能跟HR谈一谈, 申请减少加班? 你都病了, 公司也不希望员工出事。三, 家里的事我帮不上, 但相亲你可以先暂停一两个月, 跟妈说'医生让我休息'。", pinyin: "Lìli, tīng wǒ shuō sān jiàn shì. Yī, nǐ shēntǐ zài bàojǐng, bìxū xiān kàn yīshēng, bù néng tuō. Èr, gōngzuò de shìqing nǐ néng bù néng gēn HR tán yī tán, shēnqǐng jiǎnshǎo jiābān? Nǐ dōu bìng le, gōngsī yě bù xīwàng yuángōng chū shì. Sān, jiā lǐ de shì wǒ bāng bù shàng, dàn xiāngqīn nǐ kěyǐ xiān zàntíng yī liǎng gè yuè, gēn mā shuō 'yīshēng ràng wǒ xiūxi'.", english: "Lili, listen to three things. One, body's alarming, see doctor first, can't delay. Two, can you talk to HR about reducing OT? You're sick, company doesn't want issues. Three, can't help with family, but pause matchmaking 1-2 months — tell mom 'doctor said rest'.", vi: "Lệ Lệ, nghe mình nói ba điều. Một, cơ thể bạn đang báo động, phải đi khám bác sĩ trước, không hoãn được. Hai, chuyện công việc bạn có thể nói với HR xin giảm tăng ca không? Bạn bệnh rồi, công ty cũng không muốn nhân viên có chuyện. Ba, chuyện nhà mình không giúp được, nhưng gặp mai mối có thể tạm dừng 1-2 tháng, nói với mẹ 'bác sĩ bảo nghỉ'." },
      { speaker: "丽丽", chinese: "你说得对, 我都没想过这样安排。我一个人扛着, 觉得只能拼命扛下去。", pinyin: "Nǐ shuō de duì, wǒ dōu méi xiǎng guò zhèyàng ānpái. Wǒ yī gè rén káng zhe, juéde zhǐ néng pīnmìng káng xiàqù.", english: "You're right, I didn't think to organize like this. Carrying alone, felt like just had to push through.", vi: "Bạn nói đúng, mình chưa nghĩ sắp xếp thế này. Một mình gánh, cảm thấy chỉ có cách cố mà gánh tiếp." },
      { speaker: "梅", chinese: "你不必一个人扛。这周末我陪你去医院, 然后我们去公园散散步, 不聊重的。下周你跟HR谈完, 跟妈说完, 我们再约。", pinyin: "Nǐ bù bì yī gè rén káng. Zhè zhōumò wǒ péi nǐ qù yīyuàn, ránhòu wǒmen qù gōngyuán sànsàn bù, bù liáo zhòng de. Xià zhōu nǐ gēn HR tán wán, gēn mā shuō wán, wǒmen zài yuē.", english: "You don't have to. This weekend I take you to hospital, then park walk, no heavy talk. Next week after HR + mom talks, we'll meet again.", vi: "Bạn không phải gánh một mình. Cuối tuần này mình đưa bạn đi viện, sau đó mình đi dạo công viên, không nói chuyện nặng. Tuần sau bạn nói xong với HR + mẹ, mình hẹn nhau lại." },
      { speaker: "丽丽", chinese: "梅, 我能从今晚开始打电话吗? 我需要知道你在。", pinyin: "Méi, wǒ néng cóng jīn wǎn kāishǐ dǎ diànhuà ma? Wǒ xūyào zhīdào nǐ zài.", english: "Mei, can I start calling from tonight? Need to know you're there.", vi: "Mai, từ tối nay mình có thể gọi điện được không? Mình cần biết bạn ở đây." },
      { speaker: "梅", chinese: "随时打。我手机晚上不静音。你不是一个人在面对这件事。", pinyin: "Suíshí dǎ. Wǒ shǒujī wǎnshàng bù jìngyīn. Nǐ bù shì yī gè rén zài miànduì zhè jiàn shì.", english: "Call anytime. Phone won't be on silent at night. You're not facing this alone.", vi: "Lúc nào cũng gọi được. Điện thoại mình tối không để im lặng. Bạn không đối mặt một mình." }
    ],
    roleplay_prompts: [
      "Bạn Trung Quốc vừa thông báo bị sa thải sau 5 năm gắn bó công ty. Họ rất shock + lo về tài chính + lo phải báo gia đình. Hãy lắng nghe trước, không gấp gáp đưa giải pháp. Sau khi họ kể xong, đề xuất 3 việc cụ thể (1 cho bây giờ, 1 cho tuần tới, 1 cho tháng tới). Tránh nói 'tớ biết bạn cảm thấy thế nào' (sẽ bị từ chối).",
      "Bạn Trung Quốc bố vừa đột quỵ, đang ở viện. Bạn ấy phải bay về quê chăm sóc trong khi vẫn giữ công việc Bắc Kinh. Hãy hỗ trợ thực tế: đề xuất giúp đặt vé bay khẩn cấp + nói với sếp họ thay nếu cần + chuyển tiền nhanh nếu họ thiếu. Hành động > lời nói.",
      "Bạn Trung Quốc đang trầm cảm nhẹ (đã đi khám, đang uống thuốc) — không phải khẩn cấp nhưng cần hỗ trợ dài hạn. Hãy duy trì liên lạc đều đặn 2 lần/tuần (không quá nhiều, không quá ít) + đề xuất hoạt động nhẹ cùng nhau (đi bộ, nấu ăn, xem phim). Tránh nói 'cố lên!' — không có ích."
    ],
    register_notes: "Hỗ trợ bạn khó khăn dùng register thân mật cao + ấm + KHÔNG vội vàng. Người Trung Quốc đại lục thường giấu cảm xúc sâu — bạn cần đọc tín hiệu nhỏ.\n\nTÍN HIỆU bạn Trung Quốc đang khó khăn:\n- WeChat Moments giảm/ngừng đăng (rõ nhất)\n- Trả lời tin nhắn chậm/ngắn\n- Hủy hẹn nhiều lần\n- Không chia sẻ chuyện công việc (thường họ chia sẻ)\n- Sút cân hoặc tăng cân nhanh\n- Da xấu, mắt thâm\n\nKHI BẠN NHẬN RA, mở đầu khéo:\n- KHÔNG '你怎么了? 看起来很糟' (bạn sao? trông tệ lắm) — quá thẳng\n- DÙNG '最近忙吗?' (dạo này bận không?) — câu mở chung\n- DÙNG '我想到你了, 怎么样?' (mình nghĩ đến bạn, dạo này thế nào?) — gợi mở\n- DÙNG '你最近朋友圈没发, 是不是有什么事?' (gần đây không đăng Moments, có chuyện gì không?) — quan sát cụ thể\n\nKHI HỌ CHIA SẺ:\n- LẮNG NGHE 70%, NÓI 30%\n- ĐẶT CÂU HỎI MỞ: '什么时候开始的?' / '最难的是什么?'\n- KHÔNG CẮT LỜI để khuyên\n- KHÔNG NÓI 'tôi cũng từng thế' — cướp lời, không phải an ủi\n- DÙNG '我能听出来你很难' (mình nghe được bạn khó khăn thế nào)\n- DÙNG '你不必一个人扛' (bạn không phải gánh một mình)\n\nKHI BẠN ĐƯA LỜI KHUYÊN:\n- HỎI TRƯỚC: '你想听听我的想法吗?' (bạn có muốn nghe ý của mình không?) — không tự cho lời khuyên\n- 3 PHẦN: ngắn hạn (tuần này) + trung hạn (tháng này) + dài hạn (6 tháng)\n- CỤ THỂ: 'em đi khám bác sĩ Y vào thứ 7', không 'em cần chăm sức khỏe'\n- ĐỀ XUẤT GIÚP cụ thể: 'mình đi cùng', 'mình đặt lịch', 'mình gọi cho HR thay'\n\nTránh:\n- '加油!' (cố lên!) — vô nghĩa, người trầm cảm ghét\n- '想开点' (nghĩ thoáng đi) — coi nhẹ\n- '你比很多人好' (bạn còn hơn nhiều người) — so sánh không hữu ích\n- '我都过来了' (mình đã từng vượt qua) — khoe\n- Đẩy đi tâm lý trị liệu nếu chưa hỏi (vẫn còn stigma ở Trung Quốc)\n\nVỀ CRISIS: nếu bạn nói về tự sát, suy nghĩ tự hại, hoặc 'không muốn sống' — KHÔNG xử lý một mình. Khẩn trương: gọi 110 (cảnh sát Trung Quốc), 12320 (hotline tâm lý quốc gia), hoặc đại sứ quán Việt Nam. Đây nằm ngoài phạm vi 'bạn hỗ trợ' — cần chuyên môn.",
    idiom_glosses: [
      {
        idiom: "雪中送炭",
        literal: "trong tuyết tặng than (xuě zhōng sòng tàn)",
        meaning: "Tặng than trong tuyết — giúp đỡ đúng lúc cần nhất. Cụm khen hành động thiết thực: 'bạn 雪中送炭, mình không bao giờ quên'. Đối lập với '锦上添花' (gấm thêm hoa — giúp khi đã đủ).",
        example: "你今天的支持真是雪中送炭。"
      },
      {
        idiom: "患难见真情",
        literal: "hoạn nạn thấy chân tình (huàn nàn jiàn zhēn qíng)",
        meaning: "Khi gặp khó mới biết bạn thật — sự thử thách của tình bạn. Cụm dùng sau khi đã giúp nhau qua khó: '我们经历了这件事, 患难见真情'. Tăng độ thân của tình bạn.",
        example: "经过这次, 我才知道患难见真情。"
      },
      {
        idiom: "同舟共济",
        literal: "đồng thuyền cộng tế (tóng zhōu gòng jì)",
        meaning: "Cùng thuyền cùng vượt — chung số phận, cùng nhau qua khó. Cụm cam kết: 'mình 同舟共济, không bỏ bạn'. Cảm xúc + hành động.",
        example: "朋友之间应该同舟共济。"
      },
      {
        idiom: "互相扶持",
        literal: "lẫn nhau dìu dắt (hù xiāng fú chí)",
        meaning: "Hỗ trợ lẫn nhau — bạn bè dìu dắt qua những lúc yếu. Cụm dùng để cam kết quan hệ: '我们互相扶持, 一起走'. Đặc biệt phù hợp khi cả hai bên cùng có khó khăn.",
        example: "好朋友互相扶持是最重要的。"
      }
    ],
    cultural_notes_vi: "Hỗ trợ bạn Trung Quốc qua khó khăn là một trong những kỹ năng tình bạn quan trọng nhất. Khác văn hóa Việt Nam ở vài điểm:\n\n(1) NGƯỜI TRUNG QUỐC GIẤU CẢM XÚC SÂU: văn hóa 含蓄 (hánxù — kín đáo) coi trọng việc không bộc lộ. Khi bạn Trung Quốc nói '我没事' (mình không sao) sau khi mất việc — họ thường CÓ CHUYỆN. Đọc tín hiệu hành vi (Moments, tin nhắn chậm, hủy hẹn) hơn là nghe lời nói. Người Việt thường nói thẳng cảm xúc hơn — đừng kỳ vọng cùng phong cách.\n\n(2) STIGMA TÂM LÝ: trầm cảm, lo âu vẫn còn stigma ở Trung Quốc đại lục, đặc biệt thế hệ ≥40 tuổi. Người trẻ thành phố lớn đã thoáng hơn (gen Z ở Bắc Kinh, Thượng Hải nói chuyện trầm cảm như chuyện thường). Nhưng đề xuất 'đi khám tâm lý' (看心理医生) cho bạn ≥35 tuổi — họ có thể từ chối. Cách thay thế: 'đi khám sức khỏe tổng quát' (体检) — bác sĩ sẽ nhận ra triệu chứng trầm cảm và refer.\n\n(3) ÁP LỰC GIA ĐÌNH ĐÔNG Á: bố mẹ Trung Quốc có thể can thiệp sâu vào đời sống con (kết hôn, công việc, mua nhà). Khi bạn nói '我妈逼我相亲' — đây là áp lực thực sự, không phải than vãn. Hỗ trợ: KHÔNG nói 'kệ mẹ bạn đi'; DÙNG 'mình hiểu áp lực gia đình lớn, nhưng sức khỏe bạn quan trọng nhất'.\n\n(4) WORK CULTURE 996: làm việc đến kiệt sức là 'bình thường' với nhiều người Trung Quốc. Nhưng cơ thể vẫn có giới hạn. Nếu bạn báo cơ thể đau, đó là KHẨN CẤP — không phải than vãn. Đẩy họ đi khám ngay. Nhiều người Trung Quốc trẻ đột tử (猝死 — cù sǐ) do overwork — đây là vấn đề được nhận biết công khai.\n\n(5) HỖ TRỢ THỰC TẾ > LỜI ĐỘNG VIÊN: văn hóa Trung Quốc đề cao hành động cụ thể (mang đồ ăn, đặt lịch khám, gọi HR thay). 'Tinh thần động viên' kiểu Mỹ ('I believe in you!') sẽ bị coi là rỗng. Hành động có giá trị nhất: nấu cơm cho họ, đến nhà chăm sóc họ, đi cùng họ đến chỗ khó.\n\nVỀ '相亲' (xiāngqīn — phối hôn): áp lực sinh con, kết hôn rất mạnh ở Trung Quốc, đặc biệt với phụ nữ ≥28 tuổi. Khái niệm '剩女' (shèng nǚ — gái ế) tuy bị chỉ trích nhiều ở thành phố lớn nhưng vẫn còn ở quê + thế hệ lớn tuổi. Khi bạn Trung Quốc nói 'mẹ giục mình' = áp lực thực sự, không nói chơi.\n\nVỀ TÀI CHÍNH: nhiều người Trung Quốc trẻ thành phố lớn vay nặng để mua nhà ('房奴' — nô lệ nhà), gửi tiền về quê cho bố mẹ, áp lực có con. Khi bạn mất việc, không chỉ là 'không có lương' — là cả hệ thống tài chính rạn vỡ. Hỗ trợ tài chính (cho mượn, cho không) trong khẩn cấp là cử chỉ rất mạnh — văn hóa '雪中送炭'.\n\nVỀ HOẠT ĐỘNG NHẸ: khi bạn bè đau, đề xuất hoạt động đơn giản — đi bộ công viên, ăn cơm tại nhà, xem phim, nấu ăn cùng. KHÔNG đề xuất 'đi club', 'đi du lịch xa' — quá nhiều. Hoạt động đơn giản giúp họ ra khỏi nhà mà không quá áp lực giao tiếp.",
    tip_advice_vi: "(1) ĐỌC TÍN HIỆU SỚM: theo dõi Moments của bạn Trung Quốc 1 tuần/lần. Họ ngừng đăng = dấu hiệu. Nhắn tin nhẹ '想到你了, 怎么样?'. (2) GỌI ĐIỆN khi bạn nhắn nhưng họ trả lời ngắn. Nhiều người Trung Quốc thấy gọi quá xâm phạm — nhưng KHI HỌ ĐAU, gọi đúng cho họ. Mở đầu: '不打扰你, 就想听听你的声音'. (3) LẮNG NGHE TRƯỚC, KHUYÊN SAU. Trong cuộc gọi đầu, dành 70% thời gian lắng nghe. Câu hỏi mở: '什么时候开始的?', '最难的是哪部分?'. ĐỪNG cắt lời. (4) ĐỀ XUẤT 3 BƯỚC CỤ THỂ chỉ sau khi đã lắng nghe 30+ phút. Cấu trúc: ngắn hạn (tuần này — đi khám/nghỉ) + trung hạn (tháng này — nói với HR/gia đình) + dài hạn (6 tháng — kế hoạch tài chính/sức khỏe). (5) HÀNH ĐỘNG > LỜI: mang đồ ăn (cháo gà, súp Việt) đến nhà bạn. Đặt lịch khám bác sĩ thay. Đi cùng đến viện. KHÔNG chỉ '来我家吃饭' — chủ động đến NHÀ HỌ. (6) THIẾT LẬP NHỊP HỖ TRỢ: 2 lần/tuần gọi ngắn (15-30 phút) trong 1 tháng, sau đó 1 lần/tuần trong 2-3 tháng. Đừng quá nhiều (bạn cũng cần năng lượng), đừng quá ít (họ cảm thấy bị bỏ rơi). (7) BIẾT GIỚI HẠN của mình: nếu bạn nói về tự sát/tự hại — KHÔNG xử lý một mình. Gọi đại sứ quán Việt Nam (010-65325410), 110 (cảnh sát Trung Quốc), 12320 (hotline tâm lý quốc gia). Bạn là bạn, không phải bác sĩ. Hỗ trợ + giới thiệu chuyên gia không phải mâu thuẫn — là cùng một việc tốt.",
    exercises: [
      { type: "fill-blank", question: "你不必一个人 ___ , 朋友就是用来在这种时候的。", answer: "扛" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung hỗ trợ bạn với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "压力", pinyin: "yā lì", english: "áp lực" },
          { chinese: "雪中送炭", pinyin: "xuě zhōng sòng tàn", english: "trong tuyết tặng than (giúp đúng lúc)" },
          { chinese: "患难见真情", pinyin: "huàn nàn jiàn zhēn qíng", english: "hoạn nạn thấy chân tình" },
          { chinese: "倾听", pinyin: "qīng tīng", english: "lắng nghe" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Mình nghe được bạn khó khăn lắm, bạn không phải đối mặt một mình. Cần làm gì cụ thể, nói mình, mình san sẻ với bạn.",
        chinese: "我能听出来你很难, 你不是一个人在面对。需要做什么具体的事情, 告诉我, 我帮你分担。",
        pinyin: "Wǒ néng tīng chū lái nǐ hěn nán, nǐ bù shì yī gè rén zài miàn duì. Xū yào zuò shén me jù tǐ de shì qing, gào su wǒ, wǒ bāng nǐ fēn dān."
      }
    ]
  },
  {
    id: 88,
    level: "B2",
    category: "personal_social",
    title: "和朋友谈钱 — 借钱, 还钱",
    pinyin: "hé péng you tán qián — jiè qián, huán qián",
    topic: "Money/debt conversation with a friend",
    title_vi: "Nói chuyện tiền với bạn — vay, trả",
    title_en: "Money/debt conversation with a friend",
    sentences: [
      {
        chinese: "丽丽, 我有件事不太好开口, 想跟你借点钱。",
        pinyin: "Lìli, wǒ yǒu jiàn shì bù tài hǎo kāikǒu, xiǎng gēn nǐ jiè diǎn qián.",
        english: "Lili, this is hard to say — I want to borrow some money.",
        vi: "Lệ Lệ, mình có chuyện hơi khó mở lời, muốn vay bạn ít tiền.",
        pronunciation_focus: ["开口 → kāikǒu (mở lời)", "借钱 → jiè qián (vay tiền)", "不太好开口 → bù tài hǎo kāikǒu (khó mở lời)", "想跟你 → xiǎng gēn nǐ"]
      },
      {
        chinese: "我妈住院, 一时凑不齐, 能借我一万吗?",
        pinyin: "Wǒ mā zhùyuàn, yīshí còu bù qí, néng jiè wǒ yī wàn ma?",
        english: "Mom's hospitalized, can't gather enough at once — can you lend me 10,000?",
        vi: "Mẹ mình nhập viện, một lúc không gom đủ, bạn cho mình vay 10,000 được không?",
        pronunciation_focus: ["住院 → zhùyuàn (nhập viện)", "一时凑不齐 → yīshí còu bù qí (một lúc không gom đủ)", "一万 → yī wàn (10,000)", "借我 → jiè wǒ"]
      },
      {
        chinese: "三个月内一定还, 我给你打借条。",
        pinyin: "Sān gè yuè nèi yīdìng huán, wǒ gěi nǐ dǎ jiètiáo.",
        english: "Within 3 months for sure — I'll write a loan note.",
        vi: "Trong 3 tháng nhất định trả, mình ghi giấy vay nợ cho bạn.",
        pronunciation_focus: ["三个月 → sān gè yuè", "一定还 → yīdìng huán (chắc chắn trả)", "借条 → jiètiáo (giấy vay nợ)", "打 → dǎ (viết / lập)"]
      },
      {
        chinese: "亲兄弟明算账, 朋友之间也应该。",
        pinyin: "Qīn xiōngdì míng suàn zhàng, péngyou zhījiān yě yīnggāi.",
        english: "Even close brothers settle accounts clearly — friends should too.",
        vi: "Anh em ruột cũng tính sổ rõ, bạn bè cũng nên thế.",
        pronunciation_focus: ["亲兄弟明算账 → qīn xiōngdì míng suàn zhàng (idiom: ruột thịt cũng tính rõ)", "之间 → zhījiān (giữa)", "应该 → yīnggāi (nên)", "明算账 → míng suàn zhàng"]
      },
      {
        chinese: "如果不方便, 直接告诉我没关系, 我们的友谊不受影响。",
        pinyin: "Rúguǒ bù fāngbiàn, zhíjiē gàosu wǒ méi guānxi, wǒmen de yǒuyì bù shòu yǐngxiǎng.",
        english: "If inconvenient, just tell me — our friendship won't be affected.",
        vi: "Nếu không tiện, cứ nói thẳng mình không sao, tình bạn mình không bị ảnh hưởng.",
        pronunciation_focus: ["不方便 → bù fāngbiàn (không tiện)", "受影响 → shòu yǐngxiǎng (bị ảnh hưởng)", "直接告诉 → zhíjiē gàosu", "友谊 → yǒuyì"]
      }
    ],
    vocab: [
      { chinese: "借钱", pinyin: "jiè qián", english: "to borrow money", vi: "vay tiền" },
      { chinese: "还钱", pinyin: "huán qián", english: "to return money", vi: "trả tiền" },
      { chinese: "借条", pinyin: "jiè tiáo", english: "loan note", vi: "giấy vay nợ" },
      { chinese: "凑钱", pinyin: "còu qián", english: "to gather money", vi: "gom tiền" },
      { chinese: "周转", pinyin: "zhōu zhuǎn", english: "cash flow / circulation", vi: "xoay vốn" },
      { chinese: "亲兄弟明算账", pinyin: "qīn xiōng dì míng suàn zhàng", english: "even brothers settle accounts (idiom)", vi: "anh em cũng tính sổ rõ" },
      { chinese: "有借有还", pinyin: "yǒu jiè yǒu huán", english: "borrow and return", vi: "có vay có trả" },
      { chinese: "信誉", pinyin: "xìn yù", english: "credit / reputation", vi: "uy tín" },
      { chinese: "应急", pinyin: "yìng jí", english: "emergency / urgent need", vi: "ứng phó khẩn" },
      { chinese: "方便", pinyin: "fāng biàn", english: "convenient", vi: "tiện" }
    ],
    dialogue: [
      { speaker: "梅", chinese: "丽丽, 我有点事想跟你商量, 不好开口。", pinyin: "Lìli, wǒ yǒu diǎn shì xiǎng gēn nǐ shāngliang, bù hǎo kāikǒu.", english: "Lili, something hard to bring up.", vi: "Lệ Lệ, mình có chút chuyện muốn bàn, khó mở lời." },
      { speaker: "丽丽", chinese: "你说, 朋友嘛, 没什么不好说的。", pinyin: "Nǐ shuō, péngyou ma, méi shénme bù hǎo shuō de.", english: "Tell me — friends, nothing's hard to say.", vi: "Bạn nói đi, bạn bè mà, không có gì khó nói." },
      { speaker: "梅", chinese: "我妈住院, 我急需八千块, 能借给我一个月吗?", pinyin: "Wǒ mā zhùyuàn, wǒ jí xū bāqiān kuài, néng jiè gěi wǒ yī gè yuè ma?", english: "Mom hospitalized, urgently need 8,000, lend me for a month?", vi: "Mẹ mình nhập viện, gấp cần 8,000 tệ, cho mình mượn một tháng được không?" },
      { speaker: "丽丽", chinese: "当然, 现在就转给你, 不用打借条, 朋友的信任。", pinyin: "Dāngrán, xiànzài jiù zhuǎn gěi nǐ, bùyòng dǎ jiètiáo, péngyou de xìnrèn.", english: "Of course, transferring now, no loan note needed — friend trust.", vi: "Đương nhiên, mình chuyển ngay, không cần giấy vay, tin bạn." }
    ],
    dialogue_long: [
      { speaker: "梅", chinese: "丽丽, 你方便接电话吗? 我有件事要跟你商量。", pinyin: "Lìli, nǐ fāngbiàn jiē diànhuà ma? Wǒ yǒu jiàn shì yào gēn nǐ shāngliang.", english: "Lili, can you take a call? Something to discuss.", vi: "Lệ Lệ, bạn tiện nghe điện không? Mình có chuyện muốn bàn." },
      { speaker: "丽丽", chinese: "正好下班, 你说。", pinyin: "Zhènghǎo xiàbān, nǐ shuō.", english: "Just got off work, go ahead.", vi: "Vừa tan ca, bạn nói đi." },
      { speaker: "梅", chinese: "我妈昨天突然中风住院, 今天下午做了手术, ICU三天, 然后转普通病房一周。预估总费用八到十万。", pinyin: "Wǒ mā zuótiān tūrán zhòngfēng zhùyuàn, jīntiān xiàwǔ zuò le shǒushù, ICU sān tiān, ránhòu zhuǎn pǔtōng bìngfáng yī zhōu. Yùgū zǒng fèiyòng bā dào shí wàn.", english: "Mom had a stroke yesterday, hospitalized, surgery this afternoon, ICU 3 days, then regular ward 1 week. Total estimate 80-100k.", vi: "Mẹ mình hôm qua đột quỵ phải nhập viện, chiều nay phẫu thuật, ICU 3 ngày, sau đó chuyển phòng thường 1 tuần. Dự tính tổng phí 80-100 nghìn." },
      { speaker: "丽丽", chinese: "天哪, 你妈现在怎么样? 你还好吗?", pinyin: "Tiān a, nǐ mā xiànzài zěnme yàng? Nǐ hái hǎo ma?", english: "Oh god, how's your mom now? You okay?", vi: "Trời ơi, mẹ bạn bây giờ thế nào? Bạn có ổn không?" },
      { speaker: "梅", chinese: "手术还算成功, 但要观察。我现在最大问题是钱。我有6万存款, 还有越南家里能凑3万, 但还差1-2万周转。", pinyin: "Shǒushù hái suàn chénggōng, dàn yào guānchá. Wǒ xiànzài zuì dà wèntí shì qián. Wǒ yǒu liù wàn cúnkuǎn, hái yǒu Yuènán jiā lǐ néng còu sān wàn, dàn hái chà yī dào liǎng wàn zhōuzhuǎn.", english: "Surgery went okay, observation needed. Biggest problem is money. I have 60k savings, family in Vietnam can gather 30k, still short 10-20k for cash flow.", vi: "Phẫu thuật tạm ổn, nhưng phải theo dõi. Vấn đề lớn nhất bây giờ là tiền. Mình có 60 nghìn tiết kiệm, gia đình Việt Nam gom được 30 nghìn, nhưng còn thiếu 10-20 nghìn xoay vốn." },
      { speaker: "丽丽", chinese: "你需要借多少? 我账上有十几万, 你需要的话立刻转。", pinyin: "Nǐ xūyào jiè duōshao? Wǒ zhàng shàng yǒu shí jǐ wàn, nǐ xūyào de huà lìkè zhuǎn.", english: "How much you need? I have 100k+ in account, transfer immediately if needed.", vi: "Bạn cần vay bao nhiêu? Tài khoản mình có hơn 100 nghìn, cần là chuyển ngay." },
      { speaker: "梅", chinese: "丽丽, 你太够意思了。我借两万, 三个月内一定还。我会写借条给你。", pinyin: "Lìli, nǐ tài gòuyìsi le. Wǒ jiè liǎng wàn, sān gè yuè nèi yīdìng huán. Wǒ huì xiě jiètiáo gěi nǐ.", english: "Lili, you're amazing. Borrow 20k, return within 3 months. I'll write a loan note.", vi: "Lệ Lệ, bạn quá có nghĩa. Mình vay 20 nghìn, trong 3 tháng chắc chắn trả. Mình sẽ viết giấy vay cho bạn." },
      { speaker: "丽丽", chinese: "借条不用了, 我们这么多年朋友。", pinyin: "Jiètiáo bùyòng le, wǒmen zhème duō nián péngyou.", english: "No loan note needed, we've been friends so long.", vi: "Giấy vay không cần, mình bạn bè lâu năm rồi." },
      { speaker: "梅", chinese: "亲兄弟明算账, 朋友之间也应该。借条不是不信任你, 是保护我们的友谊。万一我有什么意外, 我老公也知道这笔钱要还。", pinyin: "Qīn xiōngdì míng suàn zhàng, péngyou zhījiān yě yīnggāi. Jiètiáo bù shì bù xìnrèn nǐ, shì bǎohù wǒmen de yǒuyì. Wànyī wǒ yǒu shénme yìwài, wǒ lǎogōng yě zhīdào zhè bǐ qián yào huán.", english: "Even close brothers settle accounts. Loan note isn't distrust, protects our friendship. If something happens to me, my husband knows this money's owed.", vi: "Anh em ruột cũng tính sổ rõ, bạn bè cũng nên thế. Giấy vay không phải không tin bạn, mà bảo vệ tình bạn. Lỡ mình có chuyện, chồng mình cũng biết khoản này phải trả." },
      { speaker: "丽丽", chinese: "你想得周到。那好, 写吧。要利息吗?", pinyin: "Nǐ xiǎng de zhōudào. Nà hǎo, xiě ba. Yào lìxī ma?", english: "Thoughtful. Okay, write it. Want interest?", vi: "Bạn nghĩ chu đáo. Vậy ghi đi. Có lấy lãi không?" },
      { speaker: "梅", chinese: "丽丽! 朋友之间不要利息, 我又不是去银行贷款。", pinyin: "Lìli! Péngyou zhījiān bù yào lìxī, wǒ yòu bù shì qù yínháng dàikuǎn.", english: "Lili! No interest between friends, I'm not borrowing from a bank.", vi: "Lệ Lệ! Bạn bè không lấy lãi, mình đâu phải vay ngân hàng." },
      { speaker: "丽丽", chinese: "(笑) 我开玩笑的, 测试你的反应。我现在转两万给你, 你妈那边怎么样, 需要什么帮忙?", pinyin: "(xiào) Wǒ kāi wánxiào de, cèshì nǐ de fǎnyìng. Wǒ xiànzài zhuǎn liǎng wàn gěi nǐ, nǐ mā nàbiān zěnme yàng, xūyào shénme bāngmáng?", english: "(laughs) Just joking, testing your reaction. Transferring 20k now — how's your mom, need any other help?", vi: "(cười) Mình đùa thôi, thử phản ứng của bạn. Mình chuyển 20 nghìn cho bạn ngay, mẹ bạn thế nào, cần giúp gì khác?" },
      { speaker: "梅", chinese: "现在最需要钱, 其他后面再说。我马上写借条发给你: '今借丽丽人民币贰万元整, 三个月内归还, 借款人梅, 日期2026年5月X日.' 拍照发你。", pinyin: "Xiànzài zuì xūyào qián, qítā hòumiàn zài shuō. Wǒ mǎshàng xiě jiètiáo fā gěi nǐ: 'jīn jiè Lìli rénmínbì èr wàn yuán zhěng, sān gè yuè nèi guīhuán, jièkuǎn rén Méi, rìqī 2026 nián 5 yuè X rì.' Pāizhào fā nǐ.", english: "Money needed most now, other stuff later. I'll write loan note now: 'Borrow Lili 20,000 RMB, return in 3 months, borrower Mei, date May X 2026.' Photo + send.", vi: "Bây giờ nhất cần tiền, chuyện khác sau. Mình viết giấy vay ngay: 'Nay vay Lệ Lệ hai mươi nghìn nhân dân tệ chẵn, trong 3 tháng hoàn trả, người vay Mai, ngày X tháng 5 năm 2026.' Chụp ảnh gửi bạn." },
      { speaker: "丽丽", chinese: "好, 拍清楚一点。已经转给你了, 看一下到账没。", pinyin: "Hǎo, pāi qīngchǔ yīdiǎn. Yǐjīng zhuǎn gěi nǐ le, kàn yīxià dào zhàng méi.", english: "Good, photo clearly. Transferred — check if received.", vi: "Được, chụp rõ. Đã chuyển rồi, xem đến chưa." },
      { speaker: "梅", chinese: "到了。丽丽, 你这次帮的忙我一辈子记得。", pinyin: "Dào le. Lìli, nǐ zhè cì bāng de máng wǒ yībèizi jìde.", english: "Arrived. Lili, this help I'll remember my whole life.", vi: "Đến rồi. Lệ Lệ, lần giúp này mình cả đời nhớ." },
      { speaker: "丽丽", chinese: "别说这种话, 我们是朋友。你妈快好起来, 这才是最重要的。", pinyin: "Bié shuō zhè zhǒng huà, wǒmen shì péngyou. Nǐ mā kuài hǎo qǐlái, zhè cái shì zuì zhòngyào de.", english: "Don't say that, we're friends. Your mom getting better is what matters most.", vi: "Đừng nói thế, mình là bạn. Mẹ bạn mau khỏe lại, đó mới là quan trọng nhất." },
      { speaker: "梅", chinese: "(SAU 3 THÁNG) 丽丽, 我今天把2万还给你, 加上一千块给你买礼物, 太感谢你那次救急了。", pinyin: "(3 gè yuè hòu) Lìli, wǒ jīntiān bǎ liǎng wàn huán gěi nǐ, jiā shàng yīqiān kuài gěi nǐ mǎi lǐwù, tài gǎnxiè nǐ nà cì jiùjí le.", english: "(3 months later) Lili, returning the 20k today plus 1k to buy you a gift — thank you for the emergency rescue.", vi: "(3 tháng sau) Lệ Lệ, hôm nay mình trả 20 nghìn cho bạn, kèm 1 nghìn để mua quà cho bạn, cảm ơn bạn lần đó cứu nguy." },
      { speaker: "丽丽", chinese: "本金收下, 一千就免了, 朋友帮忙不用谢这么多。", pinyin: "Běnjīn shōu xià, yīqiān jiù miǎn le, péngyou bāngmáng bùyòng xiè zhème duō.", english: "Principal received, skip the 1k — friends help, don't need to thank so much.", vi: "Gốc nhận rồi, 1 nghìn thôi, bạn bè giúp đỡ không cần cảm ơn nhiều thế." }
    ],
    roleplay_prompts: [
      "Bạn Trung Quốc đề nghị mượn 50,000 tệ để đầu tư crypto. Bạn không tin tưởng đầu tư này + cũng không có tiền dư. Hãy từ chối khéo: thừa nhận tin tưởng họ + giải thích tại sao không thể (tài chính cá nhân, không phải nghi ngờ họ) + đề xuất alternative (lời khuyên không phải tiền). Cụm '不是不信任你, 是我自己也...'.",
      "Bạn cho bạn Trung Quốc mượn 5,000 tệ 6 tháng trước, họ chưa trả. Bạn cần tiền, phải đòi. Hãy nhắn tin lịch sự: nhắc nhở không trách móc + đề xuất plan trả nhiều đợt nếu họ khó + giữ tone bạn bè. Tránh '为什么你还没还' (sao bạn chưa trả). Dùng '不知道你那笔钱方便了吗?' (không biết khoản tiền đó đã tiện chưa?).",
      "Bạn vừa thắng giải thưởng 100,000 tệ. Bạn Trung Quốc 'đùa nhẹ' đề nghị bạn cho mượn. Bạn không muốn cho mượn nhưng muốn giữ tình bạn. Hãy đáp lại đùa lại + chuyển chủ đề: '哈哈哈, 这笔钱要还房贷' (ha ha, khoản tiền này phải trả nợ nhà). Nếu họ ép thật, từ chối thẳng nhưng nhẹ."
    ],
    register_notes: "Tiền bạc giữa bạn bè Trung Quốc là chủ đề tế nhị nhưng KHÔNG cấm — văn hóa Trung Quốc thoáng hơn phương Tây. Quy tắc:\n\nKHI VAY (借钱 — jiè qián):\n- KHÔNG mở đầu '你借我钱' (cho mình mượn tiền) — quá thẳng, áp lực\n- DÙNG '我有件事不太好开口' (mình có chuyện hơi khó mở lời) — cảnh báo\n- GIẢI THÍCH lý do CỤ THỂ (mẹ nhập viện, mất việc, chuyển nhà) — không vay không lý do\n- CAM KẾT thời gian trả CỤ THỂ (3 tháng, 6 tháng) — không 'sớm thôi'\n- ĐỀ XUẤT GIẤY VAY (借条 — jiètiáo) — bảo vệ cả hai\n- KẾT bằng cụm 'nếu không tiện cứ nói' — cho lối thoát\n\nKHI ĐƯỢC VAY:\n- KHÔNG hỏi '为什么需要?' (sao cần?) trừ khi thực sự cần biết\n- DÙNG '当然可以' (đương nhiên được) hoặc '我看一下我账上' (để mình xem tài khoản)\n- ĐỀ XUẤT số bạn có thể cho — không cần đáp ứng full số họ xin\n- KHÔNG hỏi 'lãi suất' — bạn bè không lấy lãi\n- ĐỀ XUẤT CÁCH THANH TOÁN: WeChat/Alipay transfer ngay\n\nKHI TỪ CHỐI:\n- KHÔNG '我不借' (mình không cho mượn) — cứng\n- DÙNG '不是不信任你, 是我自己也...' (không phải không tin bạn, mà mình cũng...)\n- DÙNG '我现在自己手头紧' (giờ mình cũng eo hẹp)\n- ĐỀ XUẤT alternative (giúp tìm cách khác, lời khuyên)\n- KẾT bằng cụm khẳng định tình bạn không bị ảnh hưởng\n\nKHI ĐÒI NỢ:\n- KHÔNG '你欠我钱' (bạn nợ tiền tôi) — đối đầu\n- DÙNG '不知道那笔钱方便了吗?' (không biết khoản đó đã tiện chưa?)\n- ĐỀ XUẤT TRẢ TỪNG ĐỢT nếu họ khó: '可以分期还' (có thể trả góp)\n- KIÊN NHẪN: cho 1-2 tuần sau khi nhắc trước khi follow up\n\nVỀ LÃI: bạn bè Trung Quốc KHÔNG lấy lãi. Tiệm cầm đồ, bạn xa, người không thân = có thể có lãi. Bạn thân = không.\n\nVỀ TIỀN MẶT vs TRANSFER: Trung Quốc đại lục dùng WeChat Pay/Alipay 99%. Tiền mặt hiếm. Khi vay/trả, transfer instant + có lịch sử chứng minh.",
    idiom_glosses: [
      {
        idiom: "亲兄弟明算账",
        literal: "anh em ruột tính sổ rõ (qīn xiōng dì míng suàn zhàng)",
        meaning: "Anh em ruột thịt cũng tính tiền rõ ràng — quan hệ gần đến đâu cũng cần minh bạch tài chính. Cụm chuẩn cho việc vay-trả giữa bạn thân: 'mình viết giấy vay không phải không tin, là 亲兄弟明算账'.",
        example: "亲兄弟明算账, 我们之间也要清清楚楚。"
      },
      {
        idiom: "有借有还",
        literal: "có vay có trả (yǒu jiè yǒu huán)",
        meaning: "Có mượn có trả, lần sau dễ mượn (后半句: 再借不难). Triết lý cốt lõi của vay mượn — cam kết uy tín. 'Mình 有借有还, lần sau không ngại nhờ bạn'.",
        example: "有借有还, 再借不难。"
      },
      {
        idiom: "雪中送炭",
        literal: "trong tuyết tặng than (xuě zhōng sòng tàn)",
        meaning: "Tặng than trong tuyết — giúp đúng lúc khẩn. Cụm cảm ơn người cho mượn tiền lúc khẩn: '你这次真是雪中送炭'. Tăng độ thấm của lời cảm ơn.",
        example: "你这次借钱给我, 真是雪中送炭。"
      },
      {
        idiom: "君子爱财取之有道",
        literal: "quân tử yêu của có cách lấy (jūn zǐ ài cái qǔ zhī yǒu dào)",
        meaning: "Người quân tử yêu tiền nhưng kiếm có đạo — không quỵt nợ, không lừa lọc. Cụm cổ điển nhắc nguyên tắc đạo đức trong tiền bạc. Ít dùng hàng ngày, nhưng tốt cho lesson về uy tín.",
        example: "做生意要君子爱财取之有道。"
      }
    ],
    cultural_notes_vi: "Tiền bạc giữa bạn bè Trung Quốc phổ biến hơn người Việt thường nghĩ. Khác biệt văn hóa:\n\n(1) VAY MƯỢN GIỮA BẠN PHỔ BIẾN: ở Trung Quốc đại lục, vay 5,000-50,000 tệ giữa bạn thân là chuyện bình thường. Người Trung Quốc thường có '应急基金' (tiền dự phòng khẩn cấp) cho gia đình + bạn thân nhất. Vay không cần ngân hàng = nhanh + không lãi.\n\n(2) GIẤY VAY (借条) LÀ CHUẨN: kể cả giữa bạn thân, viết giấy vay là dấu hiệu chuyên nghiệp + bảo vệ cả hai. Mẫu chuẩn: '今借[tên người cho vay][tên đầy đủ]人民币X元整, X个月内归还。借款人[tên người vay], 日期[ngày]。' Ký tay + dấu vân tay (nếu formal). Chụp ảnh gửi qua WeChat = đủ giá trị pháp lý.\n\n(3) SỐ TIỀN VÀ MỐI QUAN HỆ:\n- Bạn quen thường (đồng nghiệp, bạn cũ): 500-3,000 tệ, không cần giấy vay (nhưng có lịch sử WeChat transfer = bằng chứng)\n- Bạn thân: 5,000-30,000 tệ, viết giấy vay\n- Bạn rất thân (10+ năm): 30,000+ tệ, viết giấy vay + thảo luận với chồng/vợ trước\n- Trên 100,000 tệ: hiếm giữa bạn — đề nghị họ vay ngân hàng\n\n(4) THỜI GIAN TRẢ TIÊU CHUẨN: 1-3 tháng cho ca nhỏ, 6-12 tháng cho ca lớn. Vượt quá 1 năm = bất thường, có thể là 'không có ý định trả'. Ngày trả CỤ THỂ + có ngày deadline.\n\n(5) KHÔNG LÃI GIỮA BẠN: lấy lãi giữa bạn thân = phá tình bạn. Nếu bạn cần tiền dài hạn (>1 năm) hoặc số lớn (>100k), hãy vay ngân hàng. Bạn bè cho ngắn hạn, không lãi.\n\n(6) QUÀ TRẢ KÈM (返还时的小礼): khi trả nợ, mang quà nhỏ kèm (1-5% giá trị nợ) — văn hóa cảm ơn. Ví dụ: vay 20k → trả 20k + tặng món quà 500-1,000 tệ (rượu vang, trà cao cấp). KHÔNG bắt buộc nhưng được đánh giá cao.\n\n(7) KHI BẠN KHÔNG TRẢ: nếu sau hạn 1 tháng vẫn không trả, vẫn không trả lời tin nhắn — quan hệ đã rạn. Phương án: gọi 1 lần lịch sự nhắc, nếu vẫn không = chấp nhận mất tiền + cắt quan hệ. Ở Trung Quốc đại lục có 'thẻ tín dụng cá nhân' (个人信用) — quỵt nợ bạn có thể bị báo lên hệ thống.\n\nVỀ TIỀN BẠC GIA ĐÌNH: bố mẹ Trung Quốc thường biết tài chính của con (lương, tiết kiệm, nợ). Khác Việt Nam (con thường giấu). Khi vay tiền bạn, họ THƯỜNG hỏi ý kiến chồng/vợ + có thể bố mẹ. Nếu bạn cho mượn, biết rằng cả gia đình họ biết.\n\nVỀ APP TÀI CHÍNH: WeChat Pay (微信支付) + Alipay (支付宝) là 2 ứng dụng chính. Cả hai có lịch sử transfer + chức năng 'nhắc trả'. Khi cho vay, transfer qua app = bằng chứng tự động.",
    tip_advice_vi: "(1) NẾU BẠN VAY: chuẩn bị tinh thần GIẤY VAY (借条) — không phải bạn không tin, là chuẩn mực. Mẫu trên Baidu, copy paste, điền tên + số tiền + ngày + ký. Chụp ảnh gửi WeChat người cho vay. (2) GIỚI HẠN: chỉ vay từ bạn thân (5+ năm). Không vay từ đồng nghiệp mới, bạn FB. Vay sai người = mất bạn + mất uy tín. (3) TRẢ ĐÚNG HẠN: ngày deadline ghi trong giấy vay, trả TRƯỚC ngày đó (1-3 ngày). Trả đúng ngày = OK. Trả muộn dù 1 ngày = phá uy tín. Nếu thực sự không thể, BÁO TRƯỚC 1 tuần + đề xuất ngày mới. (4) NẾU BẠN CHO VAY: chỉ cho vay số tiền BẠN CÓ THỂ MẤT. Coi như 'nếu không trả lại, mình không quá đau'. Đây không phải cynicism — là bảo vệ tình bạn. (5) TRANSFER QUA APP: dùng WeChat hoặc Alipay. Note transfer 'cho mượn 3 tháng' để có lịch sử. Tránh tiền mặt — không bằng chứng. (6) ĐÒI NỢ NHẸ: sau 1 tháng quá hạn không trả, nhắn 'không biết khoản đó đã tiện chưa?'. KHÔNG đòi gay gắt. Nếu họ nói 'sắp', đợi 2 tuần. Vẫn không trả = follow up cứng hơn. (7) TỪ CHỐI VAY KHÉO: '我现在自己手头也紧, 但我可以给你介绍一下X银行的紧急贷款' (mình giờ cũng eo hẹp, nhưng mình có thể giới thiệu khoản vay khẩn của ngân hàng X). Chuyển hướng — không bỏ rơi.",
    exercises: [
      { type: "fill-blank", question: "亲 ___ 明算账, 朋友之间也应该。", answer: "兄弟" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung tiền bạc với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "借条", pinyin: "jiè tiáo", english: "giấy vay nợ" },
          { chinese: "有借有还", pinyin: "yǒu jiè yǒu huán", english: "có vay có trả" },
          { chinese: "雪中送炭", pinyin: "xuě zhōng sòng tàn", english: "trong tuyết tặng than" },
          { chinese: "周转", pinyin: "zhōu zhuǎn", english: "xoay vốn" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Mình có chuyện hơi khó mở lời, muốn vay bạn 10,000. Trong 3 tháng nhất định trả, mình ghi giấy vay nợ.",
        chinese: "我有件事不太好开口, 想跟你借一万。三个月内一定还, 我给你打借条。",
        pinyin: "Wǒ yǒu jiàn shì bù tài hǎo kāi kǒu, xiǎng gēn nǐ jiè yī wàn. Sān gè yuè nèi yī dìng huán, wǒ gěi nǐ dǎ jiè tiáo."
      }
    ]
  },
  {
    id: 89,
    level: "B2",
    category: "personal_social",
    title: "和朋友谈宗教信仰",
    pinyin: "hé péng you tán zōng jiào xìn yǎng",
    topic: "Religion / spiritual beliefs conversation",
    title_vi: "Nói chuyện tín ngưỡng tôn giáo với bạn",
    title_en: "Religion / spiritual beliefs conversation",
    sentences: [
      {
        chinese: "你是佛教徒吗? 我看你戴佛珠很多年了。",
        pinyin: "Nǐ shì Fójiào tú ma? Wǒ kàn nǐ dài fózhū hěn duō nián le.",
        english: "Are you Buddhist? I've seen you wear the prayer beads for years.",
        vi: "Bạn theo đạo Phật à? Mình thấy bạn đeo chuỗi tràng nhiều năm rồi.",
        pronunciation_focus: ["佛教徒 → Fójiào tú (tín đồ Phật giáo)", "佛珠 → fózhū (chuỗi tràng hạt)", "戴 → dài (đeo)", "很多年 → hěn duō nián"]
      },
      {
        chinese: "我家里几代都信佛, 我从小跟外婆去寺庙。",
        pinyin: "Wǒ jiā lǐ jǐ dài dōu xìn Fó, wǒ cóng xiǎo gēn wàipó qù sìmiào.",
        english: "Several generations in my family are Buddhist — I went to temple with grandma since childhood.",
        vi: "Nhà mình nhiều đời theo Phật, từ nhỏ mình đi chùa với bà ngoại.",
        pronunciation_focus: ["几代 → jǐ dài (mấy đời)", "信佛 → xìn Fó (theo Phật)", "寺庙 → sìmiào (chùa)", "外婆 → wàipó (bà ngoại)"]
      },
      {
        chinese: "我没有特定宗教, 但相信善有善报。",
        pinyin: "Wǒ méiyǒu tèdìng zōngjiào, dàn xiāngxìn shàn yǒu shàn bào.",
        english: "I don't have a specific religion, but believe in 'good is rewarded with good'.",
        vi: "Mình không theo tôn giáo cụ thể, nhưng tin rằng làm tốt được báo đáp.",
        pronunciation_focus: ["特定宗教 → tèdìng zōngjiào (tôn giáo cụ thể)", "善有善报 → shàn yǒu shàn bào (làm thiện được thiện báo)", "相信 → xiāngxìn (tin)", "没有 → méiyǒu"]
      },
      {
        chinese: "我尊重你的信仰, 也希望你尊重我的选择。",
        pinyin: "Wǒ zūnzhòng nǐ de xìnyǎng, yě xīwàng nǐ zūnzhòng wǒ de xuǎnzé.",
        english: "I respect your faith, hope you respect my choice.",
        vi: "Mình tôn trọng tín ngưỡng của bạn, mong bạn cũng tôn trọng lựa chọn của mình.",
        pronunciation_focus: ["尊重 → zūnzhòng (tôn trọng)", "信仰 → xìnyǎng (tín ngưỡng)", "选择 → xuǎnzé (lựa chọn)", "希望 → xīwàng"]
      },
      {
        chinese: "宗教是个人的事, 朋友之间不需要一致。",
        pinyin: "Zōngjiào shì gèrén de shì, péngyou zhījiān bù xūyào yīzhì.",
        english: "Religion is personal — friends don't need to agree.",
        vi: "Tôn giáo là chuyện cá nhân, bạn bè không cần phải giống nhau.",
        pronunciation_focus: ["宗教 → zōngjiào (tôn giáo)", "个人 → gèrén (cá nhân)", "一致 → yīzhì (giống nhau)", "不需要 → bù xūyào"]
      }
    ],
    vocab: [
      { chinese: "宗教", pinyin: "zōng jiào", english: "religion", vi: "tôn giáo" },
      { chinese: "信仰", pinyin: "xìn yǎng", english: "faith / belief", vi: "tín ngưỡng" },
      { chinese: "佛教", pinyin: "fó jiào", english: "Buddhism", vi: "Phật giáo" },
      { chinese: "道教", pinyin: "dào jiào", english: "Taoism", vi: "Đạo giáo" },
      { chinese: "基督教", pinyin: "jī dū jiào", english: "Christianity", vi: "Cơ Đốc giáo" },
      { chinese: "天主教", pinyin: "tiān zhǔ jiào", english: "Catholicism", vi: "Công giáo" },
      { chinese: "无神论", pinyin: "wú shén lùn", english: "atheism", vi: "vô thần" },
      { chinese: "祈祷", pinyin: "qí dǎo", english: "to pray", vi: "cầu nguyện" },
      { chinese: "寺庙", pinyin: "sì miào", english: "Buddhist/Taoist temple", vi: "chùa" },
      { chinese: "教堂", pinyin: "jiào táng", english: "church", vi: "nhà thờ" }
    ],
    dialogue: [
      { speaker: "梅", chinese: "你妈妈烧香拜佛, 你也信佛吗?", pinyin: "Nǐ māma shāo xiāng bài Fó, nǐ yě xìn Fó ma?", english: "Your mom burns incense and worships Buddha — are you also Buddhist?", vi: "Mẹ bạn thắp nhang lạy Phật, bạn cũng theo Phật à?" },
      { speaker: "丽丽", chinese: "我家代代信佛, 但我自己更像是文化上的认同, 没有很严格地修行。", pinyin: "Wǒ jiā dài dài xìn Fó, dàn wǒ zìjǐ gèng xiàng shì wénhuà shàng de rèntóng, méiyǒu hěn yángé de xiūxíng.", english: "Family Buddhist for generations, but for me more cultural identification, not strict practice.", vi: "Nhà mình nhiều đời theo Phật, nhưng với mình giống nhận đồng văn hóa, không tu nghiêm." },
      { speaker: "梅", chinese: "我没有特定宗教, 但相信因果。", pinyin: "Wǒ méiyǒu tèdìng zōngjiào, dàn xiāngxìn yīnguǒ.", english: "I'm not specifically religious, but believe in karma.", vi: "Mình không theo tôn giáo cụ thể, nhưng tin nhân quả." },
      { speaker: "丽丽", chinese: "因果其实就是佛教的核心思想之一, 我们其实想得差不多。", pinyin: "Yīnguǒ qíshí jiùshì Fójiào de héxīn sīxiǎng zhī yī, wǒmen qíshí xiǎng de chàbuduō.", english: "Karma is one of Buddhism's core ideas — actually we think similarly.", vi: "Nhân quả thực ra là một trong tư tưởng cốt lõi của Phật giáo, mình suy nghĩ gần giống nhau." }
    ],
    dialogue_long: [
      { speaker: "梅", chinese: "丽丽, 你脖子上的项链是什么? 看起来像是佛珠?", pinyin: "Lìli, nǐ bózi shàng de xiàngliàn shì shénme? Kàn qǐlái xiàng shì fózhū?", english: "Lili, what's the necklace on your neck? Looks like prayer beads?", vi: "Lệ Lệ, vòng cổ bạn đeo là gì? Trông giống chuỗi tràng?" },
      { speaker: "丽丽", chinese: "对, 是佛珠, 我外婆从五台山带回来给我的。我家代代信佛, 我从小跟外婆去寺庙。", pinyin: "Duì, shì fózhū, wǒ wàipó cóng Wǔtáishān dài huílái gěi wǒ de. Wǒ jiā dài dài xìn Fó, wǒ cóng xiǎo gēn wàipó qù sìmiào.", english: "Yes, prayer beads, grandma brought from Wutai Mountain. Family Buddhist for generations, I went to temple with grandma since young.", vi: "Đúng, chuỗi tràng, bà ngoại mang từ Ngũ Đài Sơn về cho mình. Nhà mình nhiều đời theo Phật, từ nhỏ mình đi chùa với bà ngoại." },
      { speaker: "梅", chinese: "你自己也虔诚吗? 平时有什么修行?", pinyin: "Nǐ zìjǐ yě qiánchéng ma? Píngshí yǒu shénme xiūxíng?", english: "Are you devout yourself? Any regular practice?", vi: "Bản thân bạn cũng thành tâm không? Hàng ngày có tu hành gì không?" },
      { speaker: "丽丽", chinese: "不算很虔诚, 我自己更像是文化上的认同。我会拜佛, 但不会念经, 不吃斋。每年清明、佛诞日去寺庙烧香就好。", pinyin: "Bù suàn hěn qiánchéng, wǒ zìjǐ gèng xiàng shì wénhuà shàng de rèntóng. Wǒ huì bài Fó, dàn bù huì niàn jīng, bù chī zhāi. Měi nián Qīngmíng, Fódàn rì qù sìmiào shāo xiāng jiù hǎo.", english: "Not very devout, more cultural identification. I worship but don't chant sutras, don't eat vegetarian. Annual Qingming + Buddha's birthday, go to temple to burn incense.", vi: "Không tính rất thành tâm, với mình giống nhận đồng văn hóa hơn. Mình lạy Phật nhưng không tụng kinh, không ăn chay. Mỗi năm Thanh Minh và ngày Phật đản đi chùa thắp nhang là đủ." },
      { speaker: "梅", chinese: "听起来很自然。我个人没有特定宗教, 但相信善有善报。", pinyin: "Tīng qǐlái hěn zìrán. Wǒ gèrén méiyǒu tèdìng zōngjiào, dàn xiāngxìn shàn yǒu shàn bào.", english: "Sounds natural. I personally don't have specific religion, but believe good actions are rewarded.", vi: "Nghe rất tự nhiên. Cá nhân mình không theo tôn giáo cụ thể, nhưng tin làm tốt được báo." },
      { speaker: "丽丽", chinese: "善有善报其实就是佛教的因果概念。我们想的差不多, 只是表达方式不同。", pinyin: "Shàn yǒu shàn bào qíshí jiùshì Fójiào de yīnguǒ gàiniàn. Wǒmen xiǎng de chàbuduō, zhǐshì biǎodá fāngshì bùtóng.", english: "Good rewarded with good is actually the Buddhist concept of karma. We think similarly, just expressed differently.", vi: "Làm tốt được báo thực ra là khái niệm nhân quả của Phật giáo. Mình suy nghĩ gần giống nhau, chỉ cách diễn đạt khác." },
      { speaker: "梅", chinese: "对啊, 殊途同归。越南也有很多家庭信佛, 但我家是无宗教的, 父母比较实用主义。", pinyin: "Duì a, shū tú tóng guī. Yuènán yě yǒu hěn duō jiātíng xìn Fó, dàn wǒ jiā shì wú zōngjiào de, fùmǔ bǐjiào shíyòng zhǔyì.", english: "Yes, different paths same destination. Vietnam has many Buddhist families too, but mine is non-religious, parents pragmatic.", vi: "Đúng, đường khác nhau cùng đến một đích. Việt Nam cũng có nhiều gia đình theo Phật, nhưng nhà mình vô tôn giáo, bố mẹ thiên thực dụng." },
      { speaker: "丽丽", chinese: "你父母怎么看你信不信什么?", pinyin: "Nǐ fùmǔ zěnme kàn nǐ xìn bù xìn shénme?", english: "How do your parents view your beliefs?", vi: "Bố mẹ bạn nhìn nhận chuyện bạn tin hay không tin thế nào?" },
      { speaker: "梅", chinese: "他们说'你想信什么就信什么, 善良就好'。所以我自由探索。", pinyin: "Tāmen shuō 'nǐ xiǎng xìn shénme jiù xìn shénme, shànliáng jiùhǎo'. Suǒyǐ wǒ zìyóu tànsuǒ.", english: "They say 'believe what you want, just be good'. So I'm free to explore.", vi: "Họ nói 'con muốn tin gì thì tin, lương thiện là được'. Nên mình tự do khám phá." },
      { speaker: "丽丽", chinese: "你会因为我信佛, 觉得我们不一样吗?", pinyin: "Nǐ huì yīnwèi wǒ xìn Fó, juéde wǒmen bù yīyàng ma?", english: "Do you feel different from me because I'm Buddhist?", vi: "Bạn có vì mình theo Phật mà cảm thấy mình khác nhau không?" },
      { speaker: "梅", chinese: "完全不会。宗教是个人的事, 朋友之间不需要一致。我尊重你的信仰, 也希望你尊重我的选择。", pinyin: "Wánquán bù huì. Zōngjiào shì gèrén de shì, péngyou zhījiān bù xūyào yīzhì. Wǒ zūnzhòng nǐ de xìnyǎng, yě xīwàng nǐ zūnzhòng wǒ de xuǎnzé.", english: "Not at all. Religion is personal — friends don't need to agree. I respect your faith, hope you respect my choice.", vi: "Hoàn toàn không. Tôn giáo là chuyện cá nhân, bạn bè không cần phải giống nhau. Mình tôn trọng tín ngưỡng của bạn, mong bạn cũng tôn trọng lựa chọn của mình." },
      { speaker: "丽丽", chinese: "当然尊重。下次清明节我去寺庙, 你想跟我去看看吗? 不是要你信什么, 就是看看文化。", pinyin: "Dāngrán zūnzhòng. Xià cì Qīngmíng jié wǒ qù sìmiào, nǐ xiǎng gēn wǒ qù kànkan ma? Bù shì yào nǐ xìn shénme, jiùshì kànkan wénhuà.", english: "Of course respect. Next Qingming I'll visit temple, want to come see? Not asking you to believe, just see culture.", vi: "Đương nhiên tôn trọng. Thanh Minh tới mình đi chùa, bạn có muốn đi cùng xem không? Không phải bảo bạn tin, chỉ là xem văn hóa." },
      { speaker: "梅", chinese: "好啊, 我很想看, 越南寺庙跟中国的可能不一样。", pinyin: "Hǎo a, wǒ hěn xiǎng kàn, Yuènán sìmiào gēn Zhōngguó de kěnéng bù yīyàng.", english: "Sure, I'd love to see — Vietnam temples might differ from Chinese.", vi: "Được, mình muốn xem, chùa Việt Nam có thể khác chùa Trung Quốc." },
      { speaker: "丽丽", chinese: "中国寺庙规模大, 越南我看朋友们传的图片比较小巧。我下次去越南也想去你们的寺庙。", pinyin: "Zhōngguó sìmiào guīmó dà, Yuènán wǒ kàn péngyou men chuán de túpiàn bǐjiào xiǎoqiǎo. Wǒ xià cì qù Yuènán yě xiǎng qù nǐmen de sìmiào.", english: "Chinese temples are large; from friends' photos Vietnamese ones look more delicate. Next Vietnam trip I want to visit yours.", vi: "Chùa Trung Quốc quy mô lớn, Việt Nam mình xem ảnh bạn bè đăng có vẻ tinh xảo nhỏ hơn. Lần sau mình đi Việt Nam cũng muốn ghé chùa Việt." },
      { speaker: "梅", chinese: "好, 一言为定。我们都尊重对方的, 这是好朋友。", pinyin: "Hǎo, yīyán wéidìng. Wǒmen dōu zūnzhòng duìfāng de, zhè shì hǎo péngyou.", english: "Good, deal. We respect each other — that's good friendship.", vi: "Được, một lời đã định. Mình đều tôn trọng nhau, đây là bạn tốt." },
      { speaker: "丽丽", chinese: "殊途同归, 我们最终都希望成为善良、有意义的人。", pinyin: "Shū tú tóng guī, wǒmen zuìzhōng dōu xīwàng chéngwéi shànliáng, yǒu yìyì de rén.", english: "Different paths same destination — we both want to be kind, meaningful people.", vi: "Đường khác nhau cùng đến một đích — mình cuối cùng đều muốn trở thành người lương thiện, có ý nghĩa." }
    ],
    roleplay_prompts: [
      "Bạn Trung Quốc theo Cơ Đốc giáo (基督教), bạn không theo tôn giáo nào. Bạn ấy mời bạn đi nhà thờ Chủ nhật để 'xem cho biết'. Hãy đáp lại lịch sự: cảm ơn lời mời + nói rõ vị trí cá nhân (không theo tôn giáo) + có thể đi xem một lần như trải nghiệm văn hóa, KHÔNG cam kết thường xuyên + đề xuất chia sẻ lại văn hóa Việt Nam (đi đền/chùa Việt) lần sau.",
      "Bạn theo đạo Phật, bạn Trung Quốc theo đạo Hồi (Hồi giáo Trung Quốc — 回族). Trong bữa ăn chung, có món cuốn thịt heo (món Việt). Hãy chú ý: hỏi trước về kiêng kỵ ẩm thực + đề xuất menu thay thế (cá, gà) + KHÔNG ép người ấy thử món có thịt heo. Cụm '我们换一个清真餐厅吧'.",
      "Bố mẹ bạn người Việt, không theo tôn giáo. Bạn lấy chồng người Trung Quốc theo Phật giáo, gia đình chồng đến thăm và mong dạy cháu (con bạn) theo Phật. Hãy thiết lập ranh giới: cảm ơn ý tốt + thảo luận với chồng về cách dạy con + đề xuất 'tự do tìm hiểu cả hai văn hóa, để con tự chọn khi lớn'."
    ],
    register_notes: "Tôn giáo ở Trung Quốc đại lục là chủ đề CÁ NHÂN — không phải cấm kỵ chính trị (đối với 5 tôn giáo công nhận) nhưng cần khéo léo. Người Trung Quốc thường KÍN ĐÁO về tín ngưỡng, không truyền đạo (proselytize) như văn hóa Cơ Đốc Mỹ.\n\n5 TÔN GIÁO ĐƯỢC CÔNG NHẬN HỢP PHÁP ở Trung Quốc đại lục:\n- 佛教 (Phật giáo) — phổ biến nhất, nhiều dạng (Hán truyền — phổ biến đại đa số, Thượng tọa bộ ở vùng phía Nam, Tạng truyền ở Tây Tạng KHÔNG đi vào lesson này)\n- 道教 (Đạo giáo) — bản địa Trung Quốc\n- 伊斯兰教 (Hồi giáo) — chủ yếu Hồi tộc (回族), Duy Ngô Nhĩ (Uyghur — KHÔNG đi vào lesson)\n- 天主教 (Công giáo) — Hệ thống chính thức của Vatican thông qua Giáo hội Yêu nước Trung Quốc\n- 基督教 (Tin lành / Protestant) — phát triển ở thành phố lớn\n\nNGOÀI ra, NHIỀU NGƯỜI vô tôn giáo (无神论 — wú shén lùn) hoặc 'tín ngưỡng dân gian' (民间信仰 — cúng tổ tiên, thần thành hoàng, không thuộc tôn giáo chính thức).\n\nCác cụm an toàn:\n- '我没有特定宗教' (mình không theo tôn giáo cụ thể) — neutral\n- '我家代代信X' (nhà mình nhiều đời theo X) — văn hóa, không chính trị\n- '我相信善有善报' (mình tin làm tốt được báo) — phổ quát, không tôn giáo cụ thể\n- '宗教是个人的事' (tôn giáo là chuyện cá nhân) — đặt giới hạn lịch sự\n\nKhi không đồng ý:\n- KHÔNG phán xét 'tôn giáo là mê tín'\n- KHÔNG cố thuyết phục họ thay đổi\n- DÙNG '我尊重你的信仰' (mình tôn trọng tín ngưỡng của bạn)\n- DÙNG '殊途同归' (đường khác nhau cùng đến một đích) — chấp nhận đa dạng\n\nTRÁNH TUYỆT ĐỐI:\n- Pháp Luân Công (法轮功) — KHÔNG đề cập, NHẠY CẢM ở Trung Quốc đại lục\n- 'Hội thánh ngầm' / 'underground churches' (家庭教会) — chính trị, không thảo luận với người mới quen\n- Tây Tạng Phật giáo trong context chính trị — chỉ thảo luận như văn hóa nếu bạn rất thân\n- Hồi giáo Duy Ngô Nhĩ trong context chính trị — KHÔNG đề cập\n- So sánh tôn giáo theo kiểu 'X tốt hơn Y' — phá quan hệ ngay\n\nVỀ VIỆT NAM: Phật giáo, Cơ Đốc giáo (Công giáo, Tin lành), Cao Đài, Hòa Hảo, không tôn giáo. Khi bạn Trung Quốc hỏi, có thể chia sẻ tự nhiên — không phải chính trị.",
    idiom_glosses: [
      {
        idiom: "殊途同归",
        literal: "đường khác nhau cùng đến (shū tú tóng guī)",
        meaning: "Đường khác nhau nhưng cùng đến một đích — phương pháp khác, kết quả như nhau. Cụm tuyệt vời để chấp nhận đa dạng tôn giáo: 'mình tin X, bạn tin Y, 殊途同归, mình đều muốn làm người tốt'.",
        example: "信佛和信基督教殊途同归, 都是希望做善良的人。"
      },
      {
        idiom: "善有善报",
        literal: "thiện có thiện báo (shàn yǒu shàn bào)",
        meaning: "Làm thiện được báo đáp thiện — nguyên tắc nhân quả phổ quát. Cụm trung tính, dùng cả khi không theo tôn giáo cụ thể: 'mình tin 善有善报, không cần theo tôn giáo'.",
        example: "我虽然不信教, 但相信善有善报。"
      },
      {
        idiom: "因果报应",
        literal: "nhân quả báo ứng (yīn guǒ bào yìng)",
        meaning: "Nhân quả báo ứng — khái niệm nhân quả Phật giáo. Cụm formal hơn 善有善报, dùng trong context tâm linh: '我们相信因果, 所以做事要有善心'.",
        example: "佛教讲究因果报应, 做坏事会有报应。"
      },
      {
        idiom: "心诚则灵",
        literal: "tâm thành thì linh (xīn chéng zé líng)",
        meaning: "Tâm thành thì linh ứng — đức tin mới quan trọng, không phải hình thức. Cụm tích cực, có thể dùng cả từ người không theo tôn giáo: 'không cần đi chùa nhiều, 心诚则灵'.",
        example: "拜佛不在次数多, 心诚则灵。"
      }
    ],
    cultural_notes_vi: "Tôn giáo ở Trung Quốc đại lục có khung văn hóa và pháp lý riêng. Năm điểm người Việt cần biết:\n\n(1) PHẬT GIÁO ở TRUNG QUỐC: phổ biến rộng, đặc biệt thế hệ ≥40 tuổi và vùng phía Nam (Phúc Kiến, Quảng Đông). Phật giáo Hán truyền (汉传佛教) chủ yếu Đại thừa (Mahayana) — ăn chay, chuỗi tràng, kinh kệ. Khác Phật giáo Việt Nam ít nhiều (Việt Nam có cả Đại thừa miền Bắc và Tiểu thừa miền Nam ở đồng bằng sông Cửu Long với cộng đồng Khmer).\n\n(2) NGÀY LỄ PHẬT GIÁO: Phật đản (佛诞日 — ngày 8 tháng 4 âm lịch), Vu Lan (盂兰盆 — ngày 15 tháng 7 âm lịch). Người Trung Quốc đến chùa thắp nhang, cầu nguyện, ăn chay. Người Việt Nam có ngày tương tự — chia sẻ văn hóa.\n\n(3) ĐẠO GIÁO (道教): bản địa Trung Quốc, ít phổ biến hơn Phật giáo nhưng có ảnh hưởng văn hóa lớn (Đạo gia, Phong thủy, Tử vi đều có gốc từ Đạo giáo). Hầu hết người Trung Quốc trộn lẫn Phật giáo + Đạo giáo + tín ngưỡng dân gian — không phân biệt rõ. Cụm '佛道双修' (theo cả Phật và Đạo) phổ biến.\n\n(4) CƠ ĐỐC GIÁO (基督教): phát triển nhanh ở thành phố lớn (Bắc Kinh, Thượng Hải, Quảng Châu) — đặc biệt giới chuyên nghiệp + thế hệ trẻ. Có Catholic và Protestant chính thức được nhà nước công nhận. Bạn Trung Quốc theo Cơ Đốc thường ổn định + giáo dục cao + xã giao tốt.\n\n(5) VÔ THẦN (无神论): khoảng 60% dân số Trung Quốc tự nhận vô thần hoặc không tôn giáo. Đảng cộng sản chính thức là vô thần. Sinh viên đại học, công chức nhà nước thường không công khai tôn giáo. Người vô thần ở Trung Quốc thường có 'đạo đức thực dụng' — làm tốt, làm phải, không cần khái niệm nguồn từ tôn giáo.\n\nVỀ TÍN NGƯỠNG DÂN GIAN (民间信仰): cúng tổ tiên (拜祖宗), thần Thành Hoàng (城隍神), thần Tài (财神 — đặc biệt trước Tết), thần Bếp (灶王爷). Hầu hết người Trung Quốc có những hoạt động này NGAY CẢ KHI họ tự nhận vô thần. KHÔNG được coi là 'tôn giáo' chính thức — là văn hóa.\n\nVỀ KIÊNG KỴ ẨM THỰC:\n- Phật giáo Đại thừa nghiêm: chay trường, không trứng/sữa\n- Phật giáo bình thường: ăn chay vài ngày/tháng (ngày rằm, mùng 1 âm)\n- Hồi giáo: không thịt heo, không rượu\n- Cơ Đốc giáo: ít hạn chế ẩm thực (một số tránh rượu)\n- Hỏi TRƯỚC khi mời ăn — cụm '你有什么忌口吗?' (bạn có kiêng gì không?)\n\nVỀ TRUYỀN ĐẠO (传教): KHÔNG phổ biến ở Trung Quốc đại lục, đặc biệt từ phía người không phải đạo Cơ Đốc Mỹ. Nếu bạn Trung Quốc rủ đi chùa/nhà thờ, đó là 'mời xem văn hóa', không phải 'cố cải đạo bạn'. Thoải mái đi xem nếu tò mò, không bắt buộc nếu không.\n\nVỀ NGƯỜI VIỆT KHÔNG QUEN TÔN GIÁO TRUNG QUỐC: lễ chùa Trung Quốc và Việt Nam tương tự nhưng có khác biệt. Thắp 3 nén nhang là chuẩn. Quỳ lạy 3 lần. KHÔNG chụp ảnh tượng Phật trong nhà thờ trừ khi được phép. KHÔNG ăn mặc hở (váy ngắn, quần cộc) đến chùa.\n\nVỀ VIỆC PHỤC SINH KHÁC TÔN GIÁO: ở Trung Quốc đại lục, gia đình thường chấp nhận con cái khác tôn giáo, đặc biệt nếu là đến từ văn hóa khác (Việt Nam, đối tác quốc tế). Nhưng tôn giáo có thể là điểm bàn cãi trong việc dạy con. Thảo luận với chồng/vợ trước.",
    tip_advice_vi: "(1) HỎI TRƯỚC khi đề cập tôn giáo: 'cuộc nói chuyện này về tín ngưỡng có thoải mái không?' (聊宗教你方便吗?). Người Trung Quốc thường ngại tôn giáo, không cần ép nói. (2) CHIA SẺ TRƯỚC, hỏi sau: 'mình không theo tôn giáo cụ thể, bạn thì sao?' — bạn chia sẻ vị trí của mình giúp họ thoải mái chia sẻ. (3) DÙNG TỪ TRUNG TÍNH: 'tín ngưỡng' (信仰) thay vì 'tôn giáo' (宗教) khi nói chung. 'Mê tín' (迷信) chỉ dùng cho thực hành không lành mạnh — KHÔNG dùng để miêu tả tôn giáo của bạn. (4) ĐỊNH KHUNG VĂN HÓA: thay vì 'bạn theo gì?', dùng 'gia đình bạn có truyền thống tín ngưỡng nào không?'. Cho phép họ trả lời theo cấp độ thoải mái. (5) THỬ TRẢI NGHIỆM nếu được mời: bạn được mời đi chùa/nhà thờ = cử chỉ tin tưởng. Đi 1 lần như trải nghiệm văn hóa, ăn mặc kín đáo, làm theo chỉ dẫn (thắp nhang, ngồi yên). Sau đó cảm ơn — không cam kết quay lại nếu không muốn. (6) TRÁNH 5 CHỦ ĐỀ: Pháp Luân Công, hội thánh ngầm, Tây Tạng/Đạt Lai Lạt Ma chính trị, Duy Ngô Nhĩ chính trị, lịch sử Cách mạng Văn hóa với tôn giáo. Đây là 'mìn chính trị' không phải 'thảo luận tôn giáo'. (7) NẾU KHÁC TÔN GIÁO TRONG GIA ĐÌNH (chồng theo Phật, vợ theo Cơ Đốc): thảo luận với chồng/vợ TRƯỚC khi gặp gia đình mở rộng. Đặt nguyên tắc cho con: 'cho con tự do khám phá', 'dạy giá trị cốt lõi không phải tôn giáo cụ thể'. Văn hóa Trung Quốc thường chấp nhận điều này nếu gia đình ổn định + có sự thống nhất giữa vợ chồng.",
    exercises: [
      { type: "fill-blank", question: "宗教是个人的事, 朋友之间不需要 ___ 。", answer: "一致" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung tôn giáo với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "佛教", pinyin: "fó jiào", english: "Phật giáo" },
          { chinese: "信仰", pinyin: "xìn yǎng", english: "tín ngưỡng" },
          { chinese: "殊途同归", pinyin: "shū tú tóng guī", english: "đường khác nhau cùng đến đích" },
          { chinese: "善有善报", pinyin: "shàn yǒu shàn bào", english: "làm thiện được thiện báo" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Mình không theo tôn giáo cụ thể, nhưng tin làm tốt được báo. Mình tôn trọng tín ngưỡng của bạn, mong bạn cũng tôn trọng lựa chọn của mình.",
        chinese: "我没有特定宗教, 但相信善有善报。我尊重你的信仰, 也希望你尊重我的选择。",
        pinyin: "Wǒ méi yǒu tè dìng zōng jiào, dàn xiāng xìn shàn yǒu shàn bào. Wǒ zūn zhòng nǐ de xìn yǎng, yě xī wàng nǐ zūn zhòng wǒ de xuǎn zé."
      }
    ]
  },
  {
    id: 90,
    level: "B2",
    category: "personal_social",
    title: "听朋友分享过去的难事 — 倾听者角度",
    pinyin: "tīng péng you fēn xiǎng guò qù de nán shì — qīng tīng zhě jiǎo dù",
    topic: "Hearing a friend share difficult past — listener role",
    title_vi: "Lắng nghe bạn kể chuyện khó khăn trong quá khứ — góc nhìn người nghe",
    title_en: "Listening to friend share difficult past",
    sentences: [
      {
        chinese: "你愿意跟我说这些, 我很感动。",
        pinyin: "Nǐ yuànyì gēn wǒ shuō zhèxiē, wǒ hěn gǎndòng.",
        english: "I'm touched that you're willing to tell me these things.",
        vi: "Bạn sẵn lòng kể với mình những chuyện này, mình rất xúc động.",
        pronunciation_focus: ["愿意 → yuànyì (sẵn lòng)", "跟我说 → gēn wǒ shuō (kể với mình)", "感动 → gǎndòng (xúc động)", "这些 → zhèxiē"]
      },
      {
        chinese: "我没经历过你那样的事, 但我能感受到那有多难。",
        pinyin: "Wǒ méi jīnglì guò nǐ nàyàng de shì, dàn wǒ néng gǎnshòu dào nà yǒu duō nán.",
        english: "I haven't experienced what you did, but I can sense how hard it was.",
        vi: "Mình chưa trải qua chuyện như bạn, nhưng mình cảm nhận được điều đó khó thế nào.",
        pronunciation_focus: ["经历 → jīnglì (trải qua)", "感受到 → gǎnshòu dào (cảm nhận được)", "多难 → duō nán (khó thế nào)", "那样 → nàyàng"]
      },
      {
        chinese: "你不必把所有事都讲, 想停就停。",
        pinyin: "Nǐ bù bì bǎ suǒyǒu shì dōu jiǎng, xiǎng tíng jiù tíng.",
        english: "You don't have to tell me everything — stop whenever you want.",
        vi: "Bạn không cần kể hết, muốn dừng thì dừng.",
        pronunciation_focus: ["不必 → bù bì (không cần)", "想停就停 → xiǎng tíng jiù tíng", "讲 → jiǎng (kể)", "所有 → suǒyǒu"]
      },
      {
        chinese: "经历过这些, 你能走到今天, 我特别佩服你。",
        pinyin: "Jīnglì guò zhèxiē, nǐ néng zǒu dào jīntiān, wǒ tèbié pèifu nǐ.",
        english: "Going through all this and reaching today — I especially admire you.",
        vi: "Trải qua những chuyện này, bạn vẫn đến được hôm nay, mình đặc biệt khâm phục bạn.",
        pronunciation_focus: ["走到今天 → zǒu dào jīntiān (đi đến hôm nay)", "佩服 → pèifu (khâm phục)", "特别 → tèbié (đặc biệt)", "经历过 → jīnglì guò"]
      },
      {
        chinese: "这是你很私人的事, 我不会跟任何人说。",
        pinyin: "Zhè shì nǐ hěn sīrén de shì, wǒ bù huì gēn rènhé rén shuō.",
        english: "This is very personal — I won't tell anyone.",
        vi: "Đây là chuyện rất riêng tư của bạn, mình sẽ không nói với ai.",
        pronunciation_focus: ["私人 → sīrén (riêng tư)", "任何人 → rènhé rén (bất cứ ai)", "不会说 → bù huì shuō (sẽ không nói)", "这是 → zhè shì"]
      }
    ],
    vocab: [
      { chinese: "倾听", pinyin: "qīng tīng", english: "to listen attentively", vi: "lắng nghe" },
      { chinese: "分享", pinyin: "fēn xiǎng", english: "to share", vi: "chia sẻ" },
      { chinese: "经历", pinyin: "jīng lì", english: "experience / to go through", vi: "trải qua" },
      { chinese: "感同身受", pinyin: "gǎn tóng shēn shòu", english: "feel as if I experienced it", vi: "cảm như chính mình trải qua" },
      { chinese: "设身处地", pinyin: "shè shēn chǔ dì", english: "put yourself in others' shoes", vi: "đặt mình vào hoàn cảnh người khác" },
      { chinese: "私人", pinyin: "sī rén", english: "personal / private", vi: "riêng tư" },
      { chinese: "保密", pinyin: "bǎo mì", english: "to keep secret", vi: "giữ bí mật" },
      { chinese: "信任", pinyin: "xìn rèn", english: "trust", vi: "tin tưởng" },
      { chinese: "佩服", pinyin: "pèi fu", english: "to admire", vi: "khâm phục" },
      { chinese: "走到今天", pinyin: "zǒu dào jīn tiān", english: "to reach this point in life", vi: "đi đến hôm nay" }
    ],
    dialogue: [
      { speaker: "丽丽", chinese: "梅, 我想跟你说一件事, 我没跟很多人说过。", pinyin: "Méi, wǒ xiǎng gēn nǐ shuō yī jiàn shì, wǒ méi gēn hěn duō rén shuō guò.", english: "Mei, I want to tell you something I haven't told many people.", vi: "Mai, mình muốn kể bạn một chuyện, mình chưa kể với nhiều người." },
      { speaker: "梅", chinese: "你想说就说, 我会认真听。", pinyin: "Nǐ xiǎng shuō jiù shuō, wǒ huì rènzhēn tīng.", english: "Tell me when you want, I'll listen carefully.", vi: "Bạn muốn kể thì kể, mình sẽ nghe nghiêm túc." },
      { speaker: "丽丽", chinese: "我中学的时候被同学欺负过两年, 那段时间我...", pinyin: "Wǒ zhōngxué de shíhou bèi tóngxué qīfu guò liǎng nián, nà duàn shíjiān wǒ...", english: "In middle school I was bullied by classmates for 2 years, that period I...", vi: "Hồi cấp 2 mình bị bạn học bắt nạt 2 năm, thời gian đó mình..." },
      { speaker: "梅", chinese: "你愿意说我都听。我不会催, 也不会跟别人说。", pinyin: "Nǐ yuànyì shuō wǒ dōu tīng. Wǒ bù huì cuī, yě bù huì gēn biérén shuō.", english: "Whatever you want to say, I'll listen. Won't rush, won't tell anyone.", vi: "Bạn sẵn lòng kể mình nghe hết. Mình không thúc, cũng không kể với ai." }
    ],
    dialogue_long: [
      { speaker: "丽丽", chinese: "梅, 你方便吗? 我有件事想跟你说, 但有点难开口。", pinyin: "Méi, nǐ fāngbiàn ma? Wǒ yǒu jiàn shì xiǎng gēn nǐ shuō, dàn yǒudiǎn nán kāikǒu.", english: "Mei, free? Something hard to say.", vi: "Mai, bạn rảnh không? Mình có chuyện muốn kể, nhưng hơi khó mở lời." },
      { speaker: "梅", chinese: "现在没事, 我泡茶, 我们慢慢聊。", pinyin: "Xiànzài méi shì, wǒ pào chá, wǒmen mànman liáo.", english: "Free now, I'll make tea, let's talk slowly.", vi: "Giờ không bận, mình pha trà, mình từ từ nói chuyện." },
      { speaker: "丽丽", chinese: "我中学的时候, 初二初三那两年, 被几个同学欺负过。她们孤立我, 在班里造谣, 撕我的作业。", pinyin: "Wǒ zhōngxué de shíhou, chū èr chū sān nà liǎng nián, bèi jǐ gè tóngxué qīfu guò. Tāmen gūlì wǒ, zài bān lǐ zàoyáo, sī wǒ de zuòyè.", english: "In grade 8-9, two years, was bullied by some classmates. They isolated me, spread rumors, tore my homework.", vi: "Hồi cấp 2, lớp 8-9 hai năm đó, bị mấy bạn cùng lớp bắt nạt. Họ cô lập mình, đặt điều, xé bài tập mình." },
      { speaker: "梅", chinese: "丽丽... 听到这, 我心里很难受。两年是很长的时间。", pinyin: "Lìli... tīng dào zhè, wǒ xīnlǐ hěn nánshòu. Liǎng nián shì hěn cháng de shíjiān.", english: "Lili... hearing this hurts. Two years is a long time.", vi: "Lệ Lệ... nghe tới đây, lòng mình đau lắm. Hai năm là khoảng thời gian rất dài." },
      { speaker: "丽丽", chinese: "我不敢跟妈妈说, 怕她担心。我每天早上都装病不想去上学, 但我妈逼我去。", pinyin: "Wǒ bù gǎn gēn māma shuō, pà tā dānxīn. Wǒ měi tiān zǎoshang dōu zhuāngbìng bù xiǎng qù shàngxué, dàn wǒ mā bī wǒ qù.", english: "Didn't dare tell mom, feared she'd worry. Every morning I'd fake illness to skip school, but mom forced me.", vi: "Mình không dám kể với mẹ, sợ mẹ lo. Mỗi sáng giả vờ ốm không muốn đi học, nhưng mẹ ép đi." },
      { speaker: "梅", chinese: "你一个人扛了两年... 你那时候才十三四岁。", pinyin: "Nǐ yī gè rén káng le liǎng nián... nǐ nà shíhou cái shí sān sì suì.", english: "You carried it alone two years... you were only 13-14.", vi: "Bạn một mình gánh hai năm... lúc đó bạn mới 13-14 tuổi." },
      { speaker: "丽丽", chinese: "对。直到高一换学校, 才慢慢好起来。但是这件事影响我很多。我现在跟人交朋友还是会很警惕, 怕被人背叛。", pinyin: "Duì. Zhídào gāo yī huàn xuéxiào, cái mànman hǎo qǐlái. Dànshì zhè jiàn shì yǐngxiǎng wǒ hěn duō. Wǒ xiànzài gēn rén jiāo péngyou háishi huì hěn jǐngtì, pà bèi rén bèipàn.", english: "Yeah. Until grade 10 changed schools, slowly got better. But it affected me a lot. Even now making friends I'm cautious, fear betrayal.", vi: "Đúng. Đến lớp 10 đổi trường mới, từ từ khá lên. Nhưng chuyện này ảnh hưởng mình nhiều. Bây giờ kết bạn mình vẫn cảnh giác, sợ bị phản bội." },
      { speaker: "梅", chinese: "我能理解。被信任的人伤害, 修复要很久。", pinyin: "Wǒ néng lǐjiě. Bèi xìnrèn de rén shānghài, xiūfù yào hěn jiǔ.", english: "I understand. Hurt by trusted people takes long to heal.", vi: "Mình hiểu. Bị người tin tưởng làm tổn thương, phục hồi cần lâu lắm." },
      { speaker: "丽丽", chinese: "你是我十年来第二个我跟说这件事的朋友。第一个是我现在的丈夫。", pinyin: "Nǐ shì wǒ shí nián lái dì èr gè wǒ gēn shuō zhè jiàn shì de péngyou. Dì yī gè shì wǒ xiànzài de zhàngfu.", english: "You're the second friend in 10 years I've told. First was my husband.", vi: "Bạn là người bạn thứ hai trong 10 năm mình kể chuyện này. Người đầu là chồng mình bây giờ." },
      { speaker: "梅", chinese: "我特别感动你信任我。这件事我不会跟任何人说, 这是你的事。", pinyin: "Wǒ tèbié gǎndòng nǐ xìnrèn wǒ. Zhè jiàn shì wǒ bù huì gēn rènhé rén shuō, zhè shì nǐ de shì.", english: "I'm very moved you trust me. Won't tell anyone — this is your story.", vi: "Mình đặc biệt xúc động bạn tin tưởng mình. Chuyện này mình sẽ không kể với ai, đây là chuyện của bạn." },
      { speaker: "丽丽", chinese: "为什么我现在跟你说? 因为这周看到一个新闻, 一个14岁孩子被欺负自杀了。我整个晚上没睡, 想到自己当年。", pinyin: "Wèishéme wǒ xiànzài gēn nǐ shuō? Yīnwèi zhè zhōu kàn dào yī gè xīnwén, yī gè shísì suì háizi bèi qīfu zìshā le. Wǒ zhěnggè wǎnshàng méi shuì, xiǎngdào zìjǐ dāngnián.", english: "Why telling now? This week saw news of a 14-year-old who was bullied and ended her life. Stayed up all night thinking of myself back then.", vi: "Sao bây giờ mình kể? Vì tuần này mình thấy tin tức, một đứa trẻ 14 tuổi bị bắt nạt rồi kết thúc cuộc đời. Mình thức cả đêm, nghĩ về mình lúc đó." },
      { speaker: "梅", chinese: "看到那种新闻, 经历过的人会被触发。你现在的感受很正常, 这不是软弱。", pinyin: "Kàn dào nà zhǒng xīnwén, jīnglì guò de rén huì bèi chùfā. Nǐ xiànzài de gǎnshòu hěn zhèngcháng, zhè bù shì ruǎnruò.", english: "Seeing that news triggers people who lived it. What you feel is normal, not weakness.", vi: "Thấy tin đó, người từng trải qua sẽ bị kích hoạt. Cảm xúc bây giờ của bạn rất bình thường, đây không phải yếu đuối." },
      { speaker: "丽丽", chinese: "我之前看心理医生半年, 现在好多了。但是这周这件事让我意识到, 我还是会被影响。", pinyin: "Wǒ zhīqián kàn xīnlǐ yīshēng bànnián, xiànzài hǎo duō le. Dànshì zhè zhōu zhè jiàn shì ràng wǒ yìshí dào, wǒ háishi huì bèi yǐngxiǎng.", english: "I saw a therapist for half a year, much better now. But this week's event made me realize I can still be affected.", vi: "Trước mình đi khám bác sĩ tâm lý nửa năm, bây giờ đã tốt hơn nhiều. Nhưng chuyện tuần này khiến mình nhận ra mình vẫn còn bị ảnh hưởng." },
      { speaker: "梅", chinese: "完全正常。创伤不是一次治愈就消失, 是一个长期管理的过程。你之前去看医生, 这个决定很勇敢。", pinyin: "Wánquán zhèngcháng. Chuāngshāng bù shì yī cì zhìyù jiù xiāoshī, shì yī gè chángqī guǎnlǐ de guòchéng. Nǐ zhīqián qù kàn yīshēng, zhège juédìng hěn yǒnggǎn.", english: "Completely normal. Trauma isn't healed once and gone, it's long-term management. Your decision to see a doctor was brave.", vi: "Hoàn toàn bình thường. Tổn thương không phải chữa một lần là hết, là quá trình quản lý dài hạn. Quyết định đi khám bác sĩ trước đây của bạn rất dũng cảm." },
      { speaker: "丽丽", chinese: "经历过这些, 我能走到今天, 自己也觉得不容易。", pinyin: "Jīnglì guò zhèxiē, wǒ néng zǒu dào jīntiān, zìjǐ yě juéde bù róngyì.", english: "Going through all this and reaching today, I think it wasn't easy.", vi: "Trải qua những chuyện này, mình đến được hôm nay, tự mình cũng thấy không dễ." },
      { speaker: "梅", chinese: "我特别佩服你。如果你以后什么时候又被触发, 想找人聊, 我都在。我不会比心理医生专业, 但我会陪你。", pinyin: "Wǒ tèbié pèifu nǐ. Rúguǒ nǐ yǐhòu shénme shíhou yòu bèi chùfā, xiǎng zhǎo rén liáo, wǒ dōu zài. Wǒ bù huì bǐ xīnlǐ yīshēng zhuānyè, dàn wǒ huì péi nǐ.", english: "I really admire you. If triggered again later, want to talk, I'm here. Not as professional as a therapist, but I'll be with you.", vi: "Mình đặc biệt khâm phục bạn. Nếu sau này bạn lại bị kích hoạt, muốn nói chuyện, mình luôn ở đây. Mình không chuyên nghiệp bằng bác sĩ tâm lý, nhưng mình sẽ ở bên bạn." },
      { speaker: "丽丽", chinese: "梅, 谢谢你。能跟你说出来, 我心里轻松多了。", pinyin: "Méi, xièxie nǐ. Néng gēn nǐ shuō chūlái, wǒ xīnlǐ qīngsōng duō le.", english: "Mei, thanks. Saying it to you, I feel much lighter.", vi: "Mai, cảm ơn bạn. Nói được với bạn, lòng mình nhẹ hơn nhiều." }
    ],
    roleplay_prompts: [
      "Bạn Trung Quốc kể chuyện bố nghiện rượu thời thơ ấu — chưa bao giờ kể với ai trong 15 năm. Bạn ấy bắt đầu khóc nhỏ. Hãy lắng nghe không cắt lời + đề xuất giấy ăn + im lặng đồng cảm + KHÔNG hỏi 'bố giờ ở đâu' vội (để họ tự kể nếu muốn). Cụm '想哭就哭, 我陪你'.",
      "Bạn Trung Quốc kể về nỗi đau ly hôn 5 năm trước (chồng cũ ngoại tình). Họ đã ổn hơn nhưng vẫn cảm thấy 'thất bại'. Hãy phản hồi: KHÔNG đổ lỗi chồng cũ + KHÔNG bảo 'phải mạnh mẽ' + thừa nhận đau đớn + ngầm khen sự dũng cảm tiếp tục. Cụm '走出来不容易, 你做得很好'.",
      "Bạn Trung Quốc kể về việc thi đại học trượt (3 lần) — vết thương tâm lý sâu. Họ vẫn cảm thấy mình 'kém cỏi' so với bạn bè đỗ đại học top. Hãy không an ủi rỗng ('thi cử không quan trọng') + công nhận hệ thống áp lực + chỉ ra điều họ đã đạt được trong 10 năm sau đó."
    ],
    register_notes: "Lắng nghe chuyện khó của bạn dùng register thân + nghiêm túc + KHÔNG vội vàng. Đây là khoảnh khắc tin tưởng cao — phản ứng đúng = củng cố tình bạn cả đời, sai = phá tan.\n\nNGUYÊN TẮC LẮNG NGHE:\n\n70/30: bạn nói 30%, họ nói 70%. Nếu bạn nói nhiều hơn = sai\n\nKHÔNG cắt lời ngay khi bạn nghĩ ra giải pháp. Chờ đến khi họ ngừng tự nhiên\n\nKHÔNG so sánh ('tôi cũng từng...') — cướp lời, không phải đồng cảm\n\nKHÔNG vội đưa giải pháp — họ chưa hỏi xin\n\nKHÔNG nói 'tôi hiểu' nếu thực sự không hiểu — dùng 'tôi nghe ra' (我能听出来)\n\nCác cụm chuẩn cho người nghe:\n\n'你愿意跟我说, 我很感动' (bạn sẵn lòng kể, mình rất xúc động) — mở đầu\n\n'我能感受到那有多难' (mình cảm nhận được điều đó khó thế nào)\n\n'你不必把所有事都讲, 想停就停' (không cần kể hết, muốn dừng thì dừng) — cho không gian\n\n'听到这, 我心里很难受' (nghe đến đây, lòng mình đau)\n\n'你一个人扛了那么久' (bạn một mình gánh lâu thế)\n\n'我特别佩服你' (mình đặc biệt khâm phục bạn) — công nhận sức mạnh của họ\n\n'这是你的事, 我不会跟别人说' (đây là chuyện của bạn, mình sẽ không kể ai) — bảo mật\n\nNGÔN NGỮ THÂN THỂ:\n\nHỏi 'có thể ôm bạn được không?' (我可以抱抱你吗?) — không tự ý ôm\n\nNgồi gần (không quá gần)\n\nĐặt điện thoại xuống, không nhìn\n\nNhìn vào mắt nhưng không trừng quá\n\nLấy giấy ăn nếu họ khóc\n\nKHÔNG vỗ vai cứng — quá generic\n\nVỀ KHÓ KHĂN VỚI VẾT THƯƠNG SÂU (CHILDHOOD ABUSE, BULLYING, DEPRESSION):\n\nKHÔNG so sánh 'còn người khác tệ hơn' — invalidate\n\nKHÔNG đẩy nhanh 'đã qua rồi, tha thứ đi'\n\nNẾU bạn đã gặp psychologist, công nhận quyết định dũng cảm\n\nNẾU họ đang trong khủng hoảng tự sát/tự hại — KHÔNG xử lý một mình. Khẩn trương: 110 (cảnh sát Trung Quốc), 12320 (hotline tâm lý quốc gia), Beijing Suicide Hotline 010-82951332. Đây ngoài 'bạn bè'\n\nVỀ BẢO MẬT: tuyệt đối không kể cho người khác (kể cả chồng/vợ bạn). Nếu họ tin tưởng bạn = họ giao bí mật. Vi phạm = mất quan hệ vĩnh viễn + có thể ảnh hưởng tâm lý họ.",
    idiom_glosses: [
      {
        idiom: "感同身受",
        literal: "cảm như chính mình trải qua (gǎn tóng shēn shòu)",
        meaning: "Cảm như chính mình đã trải qua — đồng cảm sâu sắc. Cụm dùng khi bạn thực sự cảm nhận được nỗi đau của họ, KHÔNG phải so sánh ('tôi cũng từng...'). 'Tôi 感同身受 nỗi đau của bạn'.",
        example: "听到你的故事, 我感同身受。"
      },
      {
        idiom: "设身处地",
        literal: "đặt thân vào nơi (shè shēn chǔ dì)",
        meaning: "Đặt mình vào hoàn cảnh người khác — đồng cảm. Cụm dùng để thể hiện thấu hiểu: '设身处地, 我能理解你那时候有多难'.",
        example: "设身处地想想, 我也会做同样的选择。"
      },
      {
        idiom: "倾听是金",
        literal: "lắng nghe là vàng (qīng tīng shì jīn)",
        meaning: "Lắng nghe quý như vàng — KHÔNG là idiom 4 chữ thuần nhưng cụm phổ biến. Triết lý của người nghe tốt: im lặng chăm chú > nhiều lời.",
        example: "有时候倾听是金, 比说什么都重要。"
      },
      {
        idiom: "时间会治愈一切",
        literal: "thời gian sẽ chữa lành tất cả (shí jiān huì zhì yù yī qiè)",
        meaning: "Thời gian là thuốc — câu phổ biến nhưng cẩn thận. Tránh dùng khi nỗi đau còn TƯƠI — sẽ bị coi là vô cảm. Dùng khi họ đang ở giai đoạn hồi phục, công nhận rằng quá trình tiếp tục.",
        example: "时间会治愈, 但治愈不等于忘记。"
      }
    ],
    cultural_notes_vi: "Lắng nghe chuyện khó là kỹ năng tình bạn cấp cao. Khác văn hóa Việt Nam ở vài điểm:\n\n(1) NGƯỜI TRUNG QUỐC GIẤU SÂU: nỗi đau cá nhân, nhất là chuyện thời thơ ấu (gia đình, bạo lực, bệnh tâm thần) hiếm khi được kể. Khi họ chia sẻ với bạn = họ tin tưởng cao nhất. Đối xử với câu chuyện như 'kho báu được giao'.\n\n(2) STIGMA TÂM LÝ vẫn còn: ở Trung Quốc đại lục thế hệ ≥35 tuổi, đi gặp 心理医生 (psychologist) vẫn có stigma — bị coi là 'có bệnh tâm thần'. Người trẻ thành phố lớn (Bắc Kinh, Thượng Hải, Quảng Châu, Thâm Quyến) đã thoáng hơn. Khi bạn Trung Quốc thừa nhận đã đi khám tâm lý, đó là dấu hiệu họ tin bạn.\n\n(3) BULLYING (校园欺凌 — xiàoyuán qīlíng): vấn đề lớn ở trường học Trung Quốc, đặc biệt cấp 2-3. Những năm gần đây mới được công khai thảo luận sau nhiều vụ tự sát. Nếu bạn Trung Quốc kể về bị bắt nạt, ĐỪNG hỏi 'sao không báo thầy cô' — phần lớn không hiệu quả + có thể tăng bắt nạt.\n\n(4) GIA ĐÌNH RỐI LOẠN (失功能家庭): nghiện rượu, bạo lực gia đình, ly hôn không phổ biến công khai ở Trung Quốc nhưng tồn tại nhiều. Người Trung Quốc thường giấu vì 'thể diện gia đình' (家丑不可外扬 — chuyện xấu trong nhà không nên ra ngoài). Khi họ kể với bạn = vi phạm chuẩn mực gia đình truyền thống vì tin bạn.\n\n(5) THI ĐẠI HỌC (高考 — gāokǎo): áp lực không tưởng. Trượt cao khảo có thể là vết thương tâm lý cả đời. Khi bạn Trung Quốc kể về việc 'thi trượt', không nói 'thi cử không quan trọng' — đó là invalidate. Văn hóa Trung Quốc thực sự 'thi cử quyết định tương lai' với phần lớn người dân.\n\nVỀ THE 12-HOUR RULE: sau khi nghe chuyện khó, KHÔNG để đó. Nhắn lại trong 12-24 giờ: '昨天晚上你说的事我一直在想, 你今天怎么样?' (chuyện tối qua bạn kể mình vẫn đang nghĩ, hôm nay bạn thế nào?). Cử chỉ 'theo dõi' này quan trọng — chứng tỏ bạn thực sự nghe + quan tâm.\n\nVỀ TRIGGERING: tin tức về bạo lực/tự sát/lạm dụng có thể trigger người từng bị. Khi bạn Trung Quốc nói 'tuần này có chuyện trong tin tức làm tôi nhớ lại', đó là dấu hiệu PTSD hoặc trauma. Hỗ trợ thực tế: tránh thảo luận chi tiết tin tức + hỏi 'bạn cần gì bây giờ?'.\n\nVỀ BÍ MẬT: tuyệt đối tuyệt đối không kể cho ai khác. Kể cả chồng/vợ. Kể cả bạn chung. Người Trung Quốc 记仇 (ghi nhớ phản bội) — vi phạm bí mật = mất quan hệ vĩnh viễn + có thể bị họ kể với người khác để 'phản bội ngược'.\n\nVỀ HOTLINE TÂM LÝ tại Trung Quốc đại lục:\n- 12320 (hotline sức khỏe quốc gia, có nhánh tâm lý)\n- Beijing Suicide Hotline 010-82951332 (24/7, tiếng Trung)\n- 北京回龙观医院心理援助热线 010-82951332\n- Mạng lưới WeChat 'Crisis Lines China' có danh sách hotline cập nhật\n\nĐỀ XUẤT chuyên gia khi bạn không đủ năng lực: nếu bạn Trung Quốc nói về tự hại/tự sát, không xử lý một mình. Hỗ trợ + giới thiệu chuyên gia là CÙNG MỘT việc tốt, không phải mâu thuẫn.",
    tip_advice_vi: "(1) ĐẶT ĐIỆN THOẠI XUỐNG, im chuông. Đối tượng cuộc nói chuyện này = bạn ấy. Mọi sự xao nhãng = thiếu tôn trọng. (2) ĐẶT CÂU HỎI MỞ ngắn: '什么时候开始的?', '当时你怎么想的?', '你妈妈知道吗?' — không câu hỏi đóng có-không. Câu hỏi mở giúp họ kể tiếp. (3) IM LẶNG OK: nếu họ ngừng kể 30 giây - 1 phút, KHÔNG vội lấp đầy. Im lặng đồng cảm có giá trị. (4) ĐỪNG CỐ ĐOÁN ('chắc bạn cảm thấy X'). Hỏi: '你那时候是什么感觉?' (lúc đó bạn cảm thấy thế nào?). Để họ định danh cảm xúc. (5) LẶP LẠI KEY POINT để họ biết bạn thực sự nghe: '你说两年没人帮你, 妈妈又不知道...' — không tóm tắt cảm xúc, chỉ phản hồi sự kiện. (6) HỎI TRƯỚC khi đề xuất: '你想听听我的想法吗?' (bạn có muốn nghe ý của mình không?). Nếu họ nói không, tôn trọng. Họ chỉ cần bộc lộ, không cần lời khuyên. (7) CHẶT BẢO MẬT: viết 'không kể với ai' lên giấy + thực sự không kể. Bao gồm chồng/vợ + bạn chung. Sau cuộc nói chuyện, KHÔNG nhắc lại trên WeChat group hay trước người khác. KHÔNG ám chỉ 'có chuyện đặc biệt giữa mình và bạn'. (8) FOLLOW UP 12-24 GIỜ: nhắn ngắn '想到你了, 怎么样?' — không đào sâu lại, chỉ check-in. Tuần sau nhắn lại 1 lần. (9) BIẾT GIỚI HẠN: nếu họ kể về tự hại/tự sát, đó NGOÀI khả năng bạn. Khẩn trương đề xuất chuyên gia + không bỏ một mình + gọi 110 hoặc 12320 nếu nguy hiểm cấp tính. Bạn là bạn, không phải bác sĩ.",
    exercises: [
      { type: "fill-blank", question: "你愿意跟我说这些, 我很 ___ 。", answer: "感动" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung lắng nghe với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "倾听", pinyin: "qīng tīng", english: "lắng nghe" },
          { chinese: "感同身受", pinyin: "gǎn tóng shēn shòu", english: "cảm như chính mình trải qua" },
          { chinese: "保密", pinyin: "bǎo mì", english: "giữ bí mật" },
          { chinese: "走到今天", pinyin: "zǒu dào jīn tiān", english: "đi đến hôm nay" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Bạn sẵn lòng kể với mình những chuyện này, mình rất xúc động. Bạn không cần kể hết, muốn dừng thì dừng. Đây là chuyện rất riêng tư của bạn, mình sẽ không nói với ai.",
        chinese: "你愿意跟我说这些, 我很感动。你不必把所有事都讲, 想停就停。这是你很私人的事, 我不会跟任何人说。",
        pinyin: "Nǐ yuàn yì gēn wǒ shuō zhè xiē, wǒ hěn gǎn dòng. Nǐ bù bì bǎ suǒ yǒu shì dōu jiǎng, xiǎng tíng jiù tíng. Zhè shì nǐ hěn sī rén de shì, wǒ bù huì gēn rèn hé rén shuō."
      }
    ]
  },
  {
    id: 91,
    level: "B2",
    category: "personal_social",
    title: "在友谊中设定界限",
    pinyin: "zài yǒu yì zhōng shè dìng jiè xiàn",
    topic: "Setting boundaries in a friendship",
    title_vi: "Đặt giới hạn trong tình bạn",
    title_en: "Setting boundaries in a friendship",
    sentences: [
      {
        chinese: "丽丽, 我有件事想跟你说, 不是要责备你。",
        pinyin: "Lìli, wǒ yǒu jiàn shì xiǎng gēn nǐ shuō, bù shì yào zébèi nǐ.",
        english: "Lili, I want to discuss something — not to blame you.",
        vi: "Lệ Lệ, mình muốn nói chuyện này, không phải để trách bạn.",
        pronunciation_focus: ["责备 → zébèi (trách)", "想跟你说 → xiǎng gēn nǐ shuō (muốn nói với bạn)", "不是 → bù shì (không phải)", "件事 → jiàn shì"]
      },
      {
        chinese: "你最近经常半夜给我打电话, 我第二天上班很累。",
        pinyin: "Nǐ zuìjìn jīngcháng bànyè gěi wǒ dǎ diànhuà, wǒ dì èr tiān shàngbān hěn lèi.",
        english: "You've been calling me late at night often — next day work is exhausting.",
        vi: "Dạo này bạn hay gọi mình lúc nửa đêm, ngày hôm sau mình đi làm mệt.",
        pronunciation_focus: ["半夜 → bànyè (nửa đêm)", "经常 → jīngcháng (thường xuyên)", "第二天 → dì èr tiān (ngày hôm sau)", "上班 → shàngbān"]
      },
      {
        chinese: "我希望我们调整一下: 紧急事打电话, 不紧急的发微信, 第二天再聊。",
        pinyin: "Wǒ xīwàng wǒmen tiáozhěng yīxià: jǐnjí shì dǎ diànhuà, bù jǐnjí de fā wēixìn, dì èr tiān zài liáo.",
        english: "I want us to adjust: urgent things call, non-urgent WeChat, talk next day.",
        vi: "Mình mong mình điều chỉnh: chuyện khẩn gọi điện, không khẩn nhắn WeChat, hôm sau nói chuyện.",
        pronunciation_focus: ["调整 → tiáozhěng (điều chỉnh)", "紧急 → jǐnjí (khẩn cấp)", "发微信 → fā wēixìn (nhắn WeChat)", "再聊 → zài liáo"]
      },
      {
        chinese: "这不是我不在乎你, 是我希望我们的关系长久。",
        pinyin: "Zhè bù shì wǒ bù zàihu nǐ, shì wǒ xīwàng wǒmen de guānxi chángjiǔ.",
        english: "This isn't that I don't care — I want our relationship to last.",
        vi: "Đây không phải mình không quan tâm bạn, mà là mình mong quan hệ mình lâu dài.",
        pronunciation_focus: ["在乎 → zàihu (quan tâm)", "长久 → chángjiǔ (lâu dài)", "关系 → guānxi (quan hệ)", "希望 → xīwàng"]
      },
      {
        chinese: "君子之交淡如水, 距离产生美, 我们之间也需要一些边界。",
        pinyin: "Jūnzǐ zhī jiāo dàn rú shuǐ, jùlí chǎnshēng měi, wǒmen zhījiān yě xūyào yīxiē biānjiè.",
        english: "Quân tử friendship is plain like water, distance creates beauty — we need boundaries between us too.",
        vi: "Tình bạn quân tử nhạt như nước, khoảng cách sinh ra cái đẹp, mình cũng cần một số ranh giới.",
        pronunciation_focus: ["君子之交淡如水 → jūnzǐ zhī jiāo dàn rú shuǐ (idiom Trang Tử)", "距离产生美 → jùlí chǎnshēng měi", "边界 → biānjiè (ranh giới)", "需要 → xūyào"]
      }
    ],
    vocab: [
      { chinese: "界限", pinyin: "jiè xiàn", english: "boundary / limit", vi: "ranh giới" },
      { chinese: "边界", pinyin: "biān jiè", english: "boundary", vi: "biên giới / ranh giới" },
      { chinese: "调整", pinyin: "tiáo zhěng", english: "to adjust", vi: "điều chỉnh" },
      { chinese: "尊重", pinyin: "zūn zhòng", english: "to respect", vi: "tôn trọng" },
      { chinese: "在乎", pinyin: "zài hu", english: "to care about", vi: "quan tâm" },
      { chinese: "长久", pinyin: "cháng jiǔ", english: "long-lasting", vi: "lâu dài" },
      { chinese: "君子之交淡如水", pinyin: "jūn zǐ zhī jiāo dàn rú shuǐ", english: "noble friendship is plain as water", vi: "tình bạn quân tử nhạt như nước" },
      { chinese: "距离产生美", pinyin: "jù lí chǎn shēng měi", english: "distance creates beauty", vi: "khoảng cách sinh ra cái đẹp" },
      { chinese: "划清界限", pinyin: "huà qīng jiè xiàn", english: "draw a clear line", vi: "vạch rõ ranh giới" },
      { chinese: "互相尊重", pinyin: "hù xiāng zūn zhòng", english: "mutual respect", vi: "tôn trọng lẫn nhau" }
    ],
    dialogue: [
      { speaker: "梅", chinese: "丽丽, 我们聊一下我们最近联系的方式好吗?", pinyin: "Lìli, wǒmen liáo yīxià wǒmen zuìjìn liánxì de fāngshì hǎo ma?", english: "Lili, can we discuss our recent contact patterns?", vi: "Lệ Lệ, mình bàn về cách liên lạc dạo này nhé?" },
      { speaker: "丽丽", chinese: "怎么了? 我做错什么了吗?", pinyin: "Zěnme le? Wǒ zuò cuò shénme le ma?", english: "What? Did I do something wrong?", vi: "Sao? Mình làm gì sai à?" },
      { speaker: "梅", chinese: "不是错, 是节奏问题。你最近半夜打电话, 我第二天上班好累。能不能改成微信留言?", pinyin: "Bù shì cuò, shì jiézòu wèntí. Nǐ zuìjìn bànyè dǎ diànhuà, wǒ dì èr tiān shàngbān hǎo lèi. Néng bù néng gǎi chéng wēixìn liúyán?", english: "Not wrong, rhythm issue. Late-night calls leave me tired next day. Can we switch to WeChat messages?", vi: "Không phải sai, là vấn đề nhịp độ. Bạn gọi nửa đêm, mình ngày hôm sau đi làm mệt. Đổi sang nhắn WeChat được không?" },
      { speaker: "丽丽", chinese: "对不起, 我没意识到。我会注意。", pinyin: "Duìbuqǐ, wǒ méi yìshí dào. Wǒ huì zhùyì.", english: "Sorry, didn't realize. I'll be mindful.", vi: "Xin lỗi, mình không nhận ra. Mình sẽ chú ý." }
    ],
    dialogue_long: [
      { speaker: "梅", chinese: "丽丽, 我有件事想跟你聊一下, 不是要责备你, 是希望我们的友谊更健康。", pinyin: "Lìli, wǒ yǒu jiàn shì xiǎng gēn nǐ liáo yīxià, bù shì yào zébèi nǐ, shì xīwàng wǒmen de yǒuyì gèng jiànkāng.", english: "Lili, want to discuss something — not to blame you, want our friendship healthier.", vi: "Lệ Lệ, mình muốn nói chuyện này, không phải để trách bạn, là mong tình bạn mình lành mạnh hơn." },
      { speaker: "丽丽", chinese: "嗯, 你说。", pinyin: "Èn, nǐ shuō.", english: "Mm, go ahead.", vi: "Ừm, bạn nói." },
      { speaker: "梅", chinese: "这两个月, 你经常半夜两三点给我打电话, 一聊一两个小时。我第二天九点要上班, 经常困得不行。", pinyin: "Zhè liǎng gè yuè, nǐ jīngcháng bànyè liǎng sān diǎn gěi wǒ dǎ diànhuà, yī liáo yī liǎng gè xiǎoshí. Wǒ dì èr tiān jiǔ diǎn yào shàngbān, jīngcháng kùn de bù xíng.", english: "Past 2 months, you often call at 2-3 AM, talk 1-2 hours. I work at 9 next day, often exhausted.", vi: "Hai tháng nay, bạn hay gọi 2-3 giờ sáng, nói 1-2 tiếng. Mình ngày hôm sau 9 giờ phải đi làm, thường mệt rã rời." },
      { speaker: "丽丽", chinese: "我没注意到这个问题。我那时候睡不着, 想找个人说话, 你是我最好的朋友, 就打给你了。", pinyin: "Wǒ méi zhùyì dào zhège wèntí. Wǒ nà shíhou shuì bù zháo, xiǎng zhǎo gè rén shuōhuà, nǐ shì wǒ zuì hǎo de péngyou, jiù dǎ gěi nǐ le.", english: "Didn't notice. I couldn't sleep, wanted someone to talk to, you're my best friend, so called.", vi: "Mình không để ý vấn đề này. Lúc đó mình không ngủ được, muốn tìm người nói chuyện, bạn là bạn tốt nhất, nên gọi bạn." },
      { speaker: "梅", chinese: "我理解你睡不着的感觉, 我之前也有过那种阶段。但是这种节奏对我影响很大, 我上班犯错变多, 也开始失眠。", pinyin: "Wǒ lǐjiě nǐ shuì bù zháo de gǎnjué, wǒ zhīqián yě yǒu guò nà zhǒng jiēduàn. Dànshì zhè zhǒng jiézòu duì wǒ yǐngxiǎng hěn dà, wǒ shàngbān fàn cuò biàn duō, yě kāishǐ shīmián.", english: "I understand can't-sleep feeling, had it before. But this rhythm affects me a lot — work mistakes increased, I started insomnia too.", vi: "Mình hiểu cảm giác không ngủ được, mình cũng từng có giai đoạn đó. Nhưng nhịp độ này ảnh hưởng mình nhiều, đi làm sai nhiều hơn, cũng bắt đầu mất ngủ." },
      { speaker: "丽丽", chinese: "对不起梅, 我没考虑你。我太自私了。", pinyin: "Duìbuqǐ Méi, wǒ méi kǎolǜ nǐ. Wǒ tài zìsī le.", english: "Sorry Mei, didn't consider you. I was too selfish.", vi: "Xin lỗi Mai, mình không nghĩ đến bạn. Mình quá ích kỷ." },
      { speaker: "梅", chinese: "丽丽, 你不是自私, 你是在很难的状态。我也不是要离开你, 是想找到一个对我们都好的方式。我有几个建议, 你听听。", pinyin: "Lìli, nǐ bù shì zìsī, nǐ shì zài hěn nán de zhuàngtài. Wǒ yě bù shì yào líkāi nǐ, shì xiǎng zhǎodào yī gè duì wǒmen dōu hǎo de fāngshì. Wǒ yǒu jǐ gè jiànyì, nǐ tīngting.", english: "Lili, you're not selfish, you're in a hard state. I'm not leaving you — want a way good for both. I have suggestions, listen.", vi: "Lệ Lệ, bạn không ích kỷ, bạn đang trong trạng thái khó. Mình cũng không phải muốn rời xa bạn, mà muốn tìm cách tốt cho cả hai. Mình có vài gợi ý, bạn nghe." },
      { speaker: "丽丽", chinese: "你说。", pinyin: "Nǐ shuō.", english: "Tell me.", vi: "Bạn nói." },
      { speaker: "梅", chinese: "第一: 紧急事 (家人病, 自己安全) 你打电话, 任何时间。第二: 不紧急的事, 半夜想找人说话, 你给我发微信留言, 我第二天早上回。这样你能写下来理顺思路, 我也能好好回应。第三: 我们每周三晚上八点固定视频一小时, 你可以储存一周的事跟我说。", pinyin: "Dì yī: jǐnjí shì (jiārén bìng, zìjǐ ānquán) nǐ dǎ diànhuà, rènhé shíjiān. Dì èr: bù jǐnjí de shì, bànyè xiǎng zhǎo rén shuōhuà, nǐ gěi wǒ fā wēixìn liúyán, wǒ dì èr tiān zǎoshang huí. Zhèyàng nǐ néng xiě xiàlái lǐshùn sīlù, wǒ yě néng hǎohǎo huíyìng. Dì sān: wǒmen měi zhōu sān wǎnshàng bā diǎn gùdìng shìpín yī xiǎoshí, nǐ kěyǐ chǔcún yī zhōu de shì gēn wǒ shuō.", english: "First: emergencies (family illness, your safety), call anytime. Second: non-urgent late-night talk impulse, leave me WeChat message, I reply morning. You can organize thoughts writing, I can respond properly. Third: every Wednesday 8 PM fixed 1-hour video call, you can save week's stuff for me.", vi: "Một: chuyện khẩn (người nhà bệnh, bản thân an toàn) bạn gọi điện, bất cứ lúc nào. Hai: chuyện không khẩn, nửa đêm muốn tìm người nói, bạn nhắn WeChat cho mình, mình sáng hôm sau trả lời. Như thế bạn viết ra giúp sắp xếp suy nghĩ, mình cũng phản hồi tốt được. Ba: mỗi thứ Tư 8 giờ tối mình cố định gọi video 1 tiếng, bạn có thể tích lũy chuyện cả tuần kể với mình." },
      { speaker: "丽丽", chinese: "这个安排听起来很好。我之前没想过这么做。", pinyin: "Zhège ānpái tīng qǐlái hěn hǎo. Wǒ zhīqián méi xiǎng guò zhème zuò.", english: "Sounds good. Hadn't thought to organize like this.", vi: "Sắp xếp này nghe rất hay. Trước mình chưa nghĩ làm thế." },
      { speaker: "梅", chinese: "另外, 你睡不着的事, 我担心你。是不是要看一下医生? 长期失眠不是好事。", pinyin: "Lìngwài, nǐ shuì bù zháo de shì, wǒ dānxīn nǐ. Shì bù shì yào kàn yīxià yīshēng? Chángqī shīmián bù shì hǎo shì.", english: "Also, your insomnia worries me. Should you see a doctor? Long-term insomnia isn't good.", vi: "Ngoài ra, chuyện bạn không ngủ được, mình lo cho bạn. Có nên đi khám bác sĩ không? Mất ngủ lâu dài không tốt." },
      { speaker: "丽丽", chinese: "你说得对, 我应该去看一下。", pinyin: "Nǐ shuō de duì, wǒ yīnggāi qù kàn yīxià.", english: "Right, should see a doctor.", vi: "Bạn nói đúng, mình nên đi khám." },
      { speaker: "梅", chinese: "丽丽, 谢谢你听我说这些。这种话不好开口, 我也很怕你觉得我在嫌弃你。", pinyin: "Lìli, xièxie nǐ tīng wǒ shuō zhèxiē. Zhè zhǒng huà bù hǎo kāikǒu, wǒ yě hěn pà nǐ juéde wǒ zài xiánqì nǐ.", english: "Lili, thanks for hearing me. Hard to bring up — I feared you'd think I'm pushing you away.", vi: "Lệ Lệ, cảm ơn bạn nghe mình nói. Lời này khó mở miệng, mình cũng sợ bạn nghĩ mình đang chán bạn." },
      { speaker: "丽丽", chinese: "梅, 你能开口跟我说真话, 比假装一切都好的朋友珍贵多了。我们的友谊会更长久。", pinyin: "Méi, nǐ néng kāikǒu gēn wǒ shuō zhēnhuà, bǐ jiǎzhuāng yīqiè dōu hǎo de péngyou zhēnguì duō le. Wǒmen de yǒuyì huì gèng chángjiǔ.", english: "Mei, your honesty with me is far more precious than friends who pretend everything's fine. Our friendship will last longer.", vi: "Mai, bạn dám nói thật với mình, quý hơn những người bạn giả vờ mọi thứ ổn nhiều. Tình bạn mình sẽ lâu dài hơn." },
      { speaker: "梅", chinese: "君子之交淡如水, 距离产生美。我们关系健康, 才能走十年, 二十年。", pinyin: "Jūnzǐ zhī jiāo dàn rú shuǐ, jùlí chǎnshēng měi. Wǒmen guānxi jiànkāng, cáinéng zǒu shí nián, èrshí nián.", english: "Quân tử friendship is plain like water, distance creates beauty. Healthy relationship lets us go 10, 20 years.", vi: "Tình bạn quân tử nhạt như nước, khoảng cách sinh ra cái đẹp. Quan hệ mình lành mạnh, mới đi được 10, 20 năm." }
    ],
    roleplay_prompts: [
      "Bạn Trung Quốc thường xuyên mượn xe của bạn không xin phép trước (đến lấy chìa từ chỗ giấu, trả sau vài ngày). Bạn không thoải mái nhưng ngại nói. Hãy đặt giới hạn: thừa nhận tình bạn + nói rõ lần sau cần xin phép trước + đề xuất hệ thống (gửi tin nhắn WeChat trước khi mượn). Tránh '我不喜欢你这样'.",
      "Bạn Trung Quốc tham gia mọi hoạt động của bạn — tiệc gia đình, sinh nhật người thân — không được mời. Bạn cần không gian gia đình. Hãy thiết lập: cảm ơn nhiệt tình của họ + giải thích sự kiện gia đình là riêng tư + đề xuất hoạt động riêng dành cho hai bạn.",
      "Bạn Trung Quốc kể chuyện riêng của bạn cho người khác (vô tình). Bạn rất tổn thương. Hãy đối thoại: chỉ ra hành vi cụ thể + bày tỏ tổn thương (dùng 'I' thay vì 'you accusations') + yêu cầu cam kết tương lai. Cụm '我跟你说的事是私人的, 我希望你能保密'."
    ],
    register_notes: "Đặt giới hạn trong tình bạn là kỹ năng B2-C1 — đòi hỏi tinh tế cao. Nguyên tắc:\n\nFRAME: 'không phải vì không quan tâm, mà vì muốn lâu dài'\n\nCẤU TRÚC NÓI:\n\n1. KHẲNG ĐỊNH tình bạn: '我们是好朋友, 我希望我们的友谊长久'\n2. MÔ TẢ HÀNH VI cụ thể (KHÔNG đánh giá tính cách): '你最近经常半夜打电话' (chứ không 'bạn ích kỷ')\n3. NÓI TÁC ĐỘNG đến mình: '我第二天上班很累, 工作出错' (dùng 'tôi', không 'bạn làm tôi')\n4. ĐỀ XUẤT GIẢI PHÁP cụ thể: '我希望我们调整: 紧急事打电话, 不紧急的发微信'\n5. KẾT bằng KHẲNG ĐỊNH quan hệ: '这不是我不在乎你, 是我希望我们关系长久'\n\nThiếu phần 1 hoặc 5 = lời nói có vẻ tấn công cá nhân.\n\nTránh:\n\n- Cấu trúc 'YOU': '你太烦', '你不尊重我' — leo thang đối đầu\n\n- Phán xét tính cách: '你太黏人' (bạn quá bám), '你自私' — tổn thương sâu\n\n- 'TÔI VÔ ƠN' kiểu mở đầu: 'tôi biết bạn là bạn tốt nhưng...' — quá ngoại giao, mơ hồ\n\n- Thiết lập rồi rút lại: 'không sao, đùa đấy, vẫn gọi như cũ được' — phá nỗ lực\n\nKhi đối phương phản ứng:\n\n- Nếu xin lỗi nhanh: cảm ơn + lặp lại đề xuất cụ thể (đảm bảo họ thực sự hiểu)\n\n- Nếu phòng thủ ('mình không nghĩ thế'): công nhận quan điểm + giữ vững giới hạn\n\n- Nếu giận: cho không gian, gặp lại sau 24-48 giờ\n\n- Nếu cắt đứt: chấp nhận. Đôi khi đặt giới hạn = lọc ai là bạn thật\n\nVỀ CULTURAL PUSH-BACK: người Trung Quốc đại lục thế hệ ≥35 tuổi thường ít quen với khái niệm 'boundary' phương Tây. Họ có thể coi 'đặt giới hạn' = 'lạnh lùng' (冷淡) hoặc 'không thân' (不亲近). Bạn cần GIẢI THÍCH lý do rõ ràng + chứng minh quan hệ vẫn TÍCH CỰC. Người trẻ thành phố lớn (gen Z, millennial Bắc Kinh, Thượng Hải, Quảng Châu) đã tiếp nhận khái niệm boundary tốt hơn.\n\nVỀ FRIENDSHIP IDIOM: '君子之交淡如水' (quân tử chi giao đạm như thủy — Trang Tử) = tình bạn quân tử nhạt như nước. Trang Tử ngụ ý: tình bạn sâu không cần ồn ào, không cần liên lạc 24/7, không cần chia sẻ mọi thứ. Cụm này CỰC HỮU ÍCH để định khung 'distance is healthy'. Người Trung Quốc có học thường biết câu này — bạn dùng đúng = ấn tượng + hiệu quả.\n\nTránh: la mắng, đe dọa cắt bạn ngay lần đầu, đăng status mạng xã hội ám chỉ.",
    idiom_glosses: [
      {
        idiom: "君子之交淡如水",
        literal: "tình bạn quân tử nhạt như nước (jūn zǐ zhī jiāo dàn rú shuǐ)",
        meaning: "Tình bạn của quân tử nhạt như nước — không ồn ào, không bám dính, không kỳ vọng quá. Trang Tử (Zhuangzi). Cụm cao cấp dùng để định khung healthy boundaries: 'mình thân nhưng không cần liên lạc 24/7, đó là 君子之交'.",
        example: "君子之交淡如水, 不需要时时刻刻在一起。"
      },
      {
        idiom: "距离产生美",
        literal: "khoảng cách sinh ra cái đẹp (jù lí chǎn shēng měi)",
        meaning: "Khoảng cách tạo ra cái đẹp — không gian giúp giữ tình cảm. Cụm hiện đại, phổ biến trong giới trẻ. Dùng để giải thích vì sao cần boundary: 'mình không cần gặp mỗi tuần, 距离产生美'.",
        example: "好朋友也需要距离产生美。"
      },
      {
        idiom: "划清界限",
        literal: "vạch rõ ranh giới (huà qīng jiè xiàn)",
        meaning: "Vạch rõ ranh giới — đặt giới hạn rõ ràng. Cụm hành động cụ thể, đôi khi mang nghĩa hơi mạnh (như tách đôi quan hệ). Dùng cẩn thận — '我们要划清一些界限' nhẹ hơn '我要跟你划清界限' (cắt đứt).",
        example: "好朋友之间也需要划清一些界限。"
      },
      {
        idiom: "互相尊重",
        literal: "lẫn nhau tôn trọng (hù xiāng zūn zhòng)",
        meaning: "Tôn trọng lẫn nhau — KHÔNG là idiom 4 chữ thuần nhưng cụm cốt lõi cho boundary. Câu kết sau khi đặt giới hạn: '我们互相尊重就好' (mình tôn trọng nhau là đủ).",
        example: "朋友之间最重要的是互相尊重。"
      }
    ],
    cultural_notes_vi: "Đặt giới hạn (设定界限 — shèdìng jièxiàn) là khái niệm tâm lý phương Tây mới được quan tâm ở Trung Quốc đại lục (đặc biệt từ 2015+). Khác văn hóa Việt Nam ở vài điểm:\n\n(1) FRIENDSHIP TRADITIONAL CHINA: ngày xưa, bạn 'thân' = chia sẻ tất cả, có mặt mọi lúc, can dự sâu vào đời sống nhau. Khái niệm 'boundary' bị coi là 'không thân'. Khi bạn đặt giới hạn với bạn Trung Quốc thế hệ ≥40 tuổi, có thể bị hiểu lầm là 'mình không thân nữa'.\n\n(2) FRIENDSHIP MODERN URBAN: thế hệ trẻ (millennials, gen Z) ở Bắc Kinh, Thượng Hải, Quảng Châu, Thâm Quyến đã chấp nhận boundary. Họ đọc tâm lý học, biết khái niệm 'attachment style', 'codependency'. Đặt giới hạn với họ = OK + được tôn trọng.\n\n(3) CỐT LÕI VĂN HÓA — '君子之交淡如水': Trang Tử (thế kỷ 4 TCN) đã viết về tình bạn 'nhạt như nước' — không ồn ào, không bám. Đây là cơ sở văn hóa Trung Quốc để biện minh cho boundary. Khi bạn dùng cụm này = bạn CÓ truyền thống Trung Quốc ủng hộ — không phải khái niệm 'phương Tây áp đặt'.\n\n(4) KIỂU LẠM DỤNG (over-friendship): bạn Trung Quốc có thể: gọi điện cuối tuần dài giờ, đến nhà không báo trước, đề xuất chia sẻ tài chính (vay không trả), kể chuyện riêng tư của bạn cho người khác, yêu cầu giúp đỡ liên tục, tham gia sự kiện gia đình của bạn không được mời. Đây không phải 'thô lỗ' — là phong cách 'thân' khác. Bạn cần đặt boundary nhẹ nhàng từng bước.\n\n(5) WECHAT BOUNDARIES: WeChat 24/7 → bạn có thể nhắn lúc nào cũng được. Đây là vấn đề boundary cơ bản. Cách giải quyết: tắt notification ban đêm + thông báo cho bạn 'mình không trả lời sau 22h, sáng mai trả lại'. Nếu họ thực sự khẩn, gọi thay vì nhắn.\n\nVỀ STAGES OF BOUNDARY SETTING:\n\nGiai đoạn 1 (1-2 lần): nhẹ nhàng, gián tiếp. 'Hôm nay mình mệt, mai gọi lại'. Họ có thể không nhận ra.\n\nGiai đoạn 2 (3-4 lần): cụ thể. 'Có thể không gọi nửa đêm trừ khi khẩn không?'. Họ có thể xin lỗi nhanh.\n\nGiai đoạn 3 (5+ lần lặp lại): nghiêm túc. Cuộc nói chuyện chính thức như trong dialogue 91. Đặt cấu trúc rõ ràng.\n\nGiai đoạn 4 (vẫn không thay đổi): xét lại quan hệ. Có thể chuyển sang quan hệ 'nhẹ hơn' (không phải bạn thân, chỉ là người quen).\n\nVỀ POST-BOUNDARY: trong 1-2 tháng sau khi đặt giới hạn, theo dõi:\n\n- Nếu họ điều chỉnh hành vi → quan hệ bền vững hơn, lên cấp trưởng thành\n- Nếu họ phớt lờ → lặp lại + nghiêm túc hơn\n- Nếu họ rút lui hoàn toàn → có thể họ không có khả năng quan hệ trưởng thành. Thư giãn, không níu kéo\n\nVỀ GENDER + AGE NORMS: phụ nữ đặt giới hạn với phụ nữ thường khó hơn (cảm xúc cao hơn). Nam đặt giới hạn với nam dễ hơn (ngắn gọn). Đặt giới hạn với người lớn tuổi hơn — đặc biệt khó (văn hóa kính trọng tuổi). Cần dùng cụm formal hơn + thừa nhận họ lớn tuổi.\n\nVỀ COUSIN TOPICS: tình bạn cộng hưởng (codependent friendship) — bạn thấy mình bị consume bởi cảm xúc của bạn → boundary là cứu chữa, không phải lạnh lùng. Tình bạn 'năng lượng âm' (toxic friendship) — bạn cảm thấy tệ sau mỗi cuộc nói chuyện → có thể cần khoảng cách lớn hơn boundary.",
    tip_advice_vi: "(1) BẮT ĐẦU NHẸ trước: nếu vấn đề mới (1-2 lần), thử tín hiệu nhẹ trước. 'Mình hôm nay mệt, mai gọi lại nhé' qua WeChat. Đôi khi đủ. (2) CHỜ KHI BÌNH TĨNH để cuộc nói chuyện chính thức. Đừng đặt giới hạn ngay sau cuộc gọi 3 giờ sáng — bạn đang giận. Đợi 24 giờ, viết bản nháp những gì sẽ nói. (3) CHỌN ĐỊA ĐIỂM RIÊNG: quán cà phê yên tĩnh, không phải WeChat group. Cuộc nói chuyện cá nhân = không gian cá nhân. (4) DÙNG 'TÔI' không 'BẠN': 'Tôi cần nghỉ ngơi sau 10 giờ tối' tốt hơn 'Bạn không nên gọi sau 10 giờ'. Sự khác biệt nhỏ nhưng cảm xúc khác hoàn toàn. (5) ĐỀ XUẤT THAY THẾ cụ thể: không chỉ 'đừng gọi nửa đêm' mà 'gọi giờ X-Y, nửa đêm nhắn WeChat'. Cho họ biết NÊN làm gì, không chỉ KHÔNG nên. (6) DÙNG '君子之交淡如水': nếu bạn Trung Quốc có học thức, dùng cụm này = họ hiểu ngay đây là khái niệm văn hóa Trung Quốc, không phải 'phương Tây áp đặt'. Tăng tỷ lệ chấp nhận lên 50%+. (7) THEO DÕI 1 THÁNG sau khi đặt boundary. Nếu thay đổi tích cực = củng cố relationship. Nếu không = lặp lại nghiêm túc hơn hoặc xét lại bản chất quan hệ. (8) ĐỪNG CÁ NHÂN HÓA SỰ TỪ CHỐI của họ. Một số người không có khả năng quan hệ trưởng thành — không phải lỗi của bạn. Bạn đặt boundary hợp lý + họ không tôn trọng = vấn đề của họ, không phải của bạn.",
    exercises: [
      { type: "fill-blank", question: "君子之交 ___ 如水, 距离产生美。", answer: "淡" },
      {
        type: "matching",
        instruction: "Ghép cụm tiếng Trung đặt giới hạn với nghĩa tiếng Việt.",
        pairs: [
          { chinese: "界限", pinyin: "jiè xiàn", english: "ranh giới" },
          { chinese: "调整", pinyin: "tiáo zhěng", english: "điều chỉnh" },
          { chinese: "君子之交淡如水", pinyin: "jūn zǐ zhī jiāo dàn rú shuǐ", english: "tình bạn quân tử nhạt như nước" },
          { chinese: "距离产生美", pinyin: "jù lí chǎn shēng měi", english: "khoảng cách sinh ra cái đẹp" }
        ]
      },
      {
        type: "translation",
        vietnamese: "Mình muốn nói chuyện này, không phải để trách bạn. Đây không phải mình không quan tâm bạn, mà là mình mong quan hệ mình lâu dài.",
        chinese: "我有件事想跟你说, 不是要责备你。这不是我不在乎你, 是我希望我们的关系长久。",
        pinyin: "Wǒ yǒu jiàn shì xiǎng gēn nǐ shuō, bù shì yào zé bèi nǐ. Zhè bù shì wǒ bù zài hu nǐ, shì wǒ xī wàng wǒ men de guān xi cháng jiǔ."
      }
    ]
  }
];

// Aliases + helpers parallel to FRENCH_LESSONS / GERMAN_LESSONS API.
export const CHINESE_LESSONS: ReadonlyArray<ChineseLesson> = lessons;

export function getLessonsByCategory(
  category: ChineseCategoryId,
): ChineseLesson[] {
  return CHINESE_LESSONS.filter((l) => l.category === category);
}

export function getLessonById(id: number): ChineseLesson | undefined {
  return CHINESE_LESSONS.find((l) => l.id === id);
}

export default lessons;
