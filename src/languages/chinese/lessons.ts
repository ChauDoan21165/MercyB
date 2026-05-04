export const lessons = [
  {
    id: 1,
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
  }
];
export default lessons;
