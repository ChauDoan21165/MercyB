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
  category?: string;
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
  }
];
export default lessons;
