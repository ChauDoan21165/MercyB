// Type definitions for Japanese lesson data.
// Lessons 1-20 have vocabulary + grammar + examples only.
// Lessons 21-50 add dialogue + exercises.

export type JapaneseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type JapaneseVocabEntry = {
  japanese: string;
  english: string;
};

export type JapaneseGrammarPoint = {
  point: string;
  explanation: string;
};

export type JapaneseExample = {
  japanese: string;
  english: string;
};

export type JapaneseDialogueLine = {
  speaker: string;
  japanese: string;
  english: string;
};

export type JapaneseExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
};

export type JapaneseExerciseMatching = {
  type: "matching";
  pairs: { japanese: string; english: string }[];
  instruction: string;
};

export type JapaneseExerciseTranslation = {
  type: "translation";
  vietnamese: string;
  japanese: string;
};

export type JapaneseExercise =
  | JapaneseExerciseFillBlank
  | JapaneseExerciseMatching
  | JapaneseExerciseTranslation;

export type JapaneseLesson = {
  id: number;
  title: string;
  // Optional bilingual title fields (added for B2 calibration samples)
  title_vi?: string;
  title_en?: string;
  category?: string;
  level: JapaneseCefrLevel;
  vocabulary: JapaneseVocabEntry[];
  // Grammar is present on lessons 1-50 but optional on B2 calibration samples
  grammar?: JapaneseGrammarPoint[];
  examples: JapaneseExample[];
  dialogue?: JapaneseDialogueLine[];
  exercises?: JapaneseExercise[];
  cultural_notes_vi?: string;
  tip_advice_vi?: string;
  // B2 calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: JapaneseDialogueLine[];
  roleplay_prompts?: string[];
  register_notes?: string;
  idiom_glosses?: { idiom: string; literal: string; meaning: string; example: string }[];
};

export const lessons: JapaneseLesson[] = [
  {
    id: 1,
    title: "Hiragana Introduction",
    level: "A1",
    vocabulary: [
      { japanese: "あ", english: "a" },
      { japanese: "い", english: "i" },
      { japanese: "う", english: "u" },
      { japanese: "え", english: "e" },
      { japanese: "お", english: "o" }
    ],

    grammar: [
      { point: "Hiragana", explanation: "Hiragana is the basic phonetic script used for native Japanese words and grammatical elements." }
    ],

    examples: [
      { japanese: "あい", english: "love" },
      { japanese: "うえ", english: "above" },
      { japanese: "えいご", english: "English language" }
    ],
  },
  {
    id: 2,
    title: "Katakana Introduction",
    level: "A1",
    vocabulary: [
      { japanese: "カ", english: "ka" },
      { japanese: "キ", english: "ki" },
      { japanese: "ク", english: "ku" },
      { japanese: "ケ", english: "ke" },
      { japanese: "コ", english: "ko" }
    ],

    grammar: [
      { point: "Katakana", explanation: "Katakana is used for foreign loanwords, onomatopoeia, and emphasis." }
    ],

    examples: [
      { japanese: "カメラ", english: "camera" },
      { japanese: "コーヒー", english: "coffee" },
      { japanese: "アメリカ", english: "America" }
    ],
  },
  {
    id: 3,
    title: "Basic Greetings",
    level: "A1",
    vocabulary: [
      { japanese: "こんにちは", english: "hello / good afternoon" },
      { japanese: "おはようございます", english: "good morning" },
      { japanese: "こんばんは", english: "good evening" },
      { japanese: "さようなら", english: "goodbye" },
      { japanese: "ありがとうございます", english: "thank you" }
    ],

    grammar: [
      { point: "Greeting time frames", explanation: "Use おはようございます until around 10 AM, こんにちは in the afternoon, こんばんは in the evening." }
    ],

    examples: [
      { japanese: "こんにちは、元気ですか？", english: "Hello, how are you?" },
      { japanese: "ありがとうございます、お元気で。", english: "Thank you, take care." }
    ],
  },
  {
    id: 4,
    title: "Self Introduction",
    level: "A1",
    vocabulary: [
      { japanese: "わたし", english: "I" },
      { japanese: "名前 (なまえ)", english: "name" },
      { japanese: "出身 (しゅっしん)", english: "hometown / origin" },
      { japanese: "～です", english: "am / is / are" }
    ],

    grammar: [
      { point: "です (desu)", explanation: "です is a polite copula used to equate two nouns: A is B." }
    ],

    examples: [
      { japanese: "わたしは田中です。", english: "I am Tanaka." },
      { japanese: "出身は東京です。", english: "I am from Tokyo." }
    ],
  },
  {
    id: 5,
    title: "Numbers 1–10",
    level: "A1",
    vocabulary: [
      { japanese: "いち", english: "1" },
      { japanese: "に", english: "2" },
      { japanese: "さん", english: "3" },
      { japanese: "し / よん", english: "4" },
      { japanese: "ご", english: "5" },
      { japanese: "ろく", english: "6" },
      { japanese: "しち / なな", english: "7" },
      { japanese: "はち", english: "8" },
      { japanese: "きゅう / く", english: "9" },
      { japanese: "じゅう", english: "10" }
    ],

    grammar: [
      { point: "Number variations", explanation: "4 can be ‘し’ or ‘よん’, 7 can be ‘しち’ or ‘なな’, 9 can be ‘きゅう’ or ‘く’. よん and なな are more common in modern speech." }
    ],

    examples: [
      { japanese: "りんごが三つあります。", english: "There are three apples." },
      { japanese: "時は四時です。", english: "It is 4 o'clock." }
    ],
  },
  {
    id: 6,
    title: "Counting Objects",
    level: "A1",
    vocabulary: [
      { japanese: "一つ (ひとつ)", english: "one (general counter)" },
      { japanese: "二つ (ふたつ)", english: "two" },
      { japanese: "三つ (みっつ)", english: "three" },
      { japanese: "人 (ひと)", english: "person" },
      { japanese: "〜人 (〜にん)", english: "counter for people" }
    ],

    grammar: [
      { point: "Japanese counters", explanation: "Japanese uses different counters for objects, people, animals, etc. つ is for general small objects; 人 is for people." }
    ],

    examples: [
      { japanese: "本が一冊あります。", english: "There is one book." },
      { japanese: "友達が二人います。", english: "I have two friends." }
    ],
  },
  {
    id: 7,
    title: "Days of the Week",
    level: "A1",
    vocabulary: [
      { japanese: "月曜日 (げつようび)", english: "Monday" },
      { japanese: "火曜日 (かようび)", english: "Tuesday" },
      { japanese: "水曜日 (すいようび)", english: "Wednesday" },
      { japanese: "木曜日 (もくようび)", english: "Thursday" },
      { japanese: "金曜日 (きんようび)", english: "Friday" },
      { japanese: "土曜日 (どようび)", english: "Saturday" },
      { japanese: "日曜日 (にちようび)", english: "Sunday" }
    ],

    grammar: [
      { point: "曜日 (youbi)", explanation: "The days are named after celestial bodies: 月(moon), 火(mars), 水(mercury), 木(jupiter), 金(venus), 土(saturn), 日(sun)." }
    ],

    examples: [
      { japanese: "今日は金曜日です。", english: "Today is Friday." },
      { japanese: "日曜日に映画を見ます。", english: "I will watch a movie on Sunday." }
    ],
  },
  {
    id: 8,
    title: "Months of the Year",
    level: "A1",
    vocabulary: [
      { japanese: "一月 (いちがつ)", english: "January" },
      { japanese: "二月 (にがつ)", english: "February" },
      { japanese: "三月 (さんがつ)", english: "March" },
      { japanese: "四月 (しがつ)", english: "April" },
      { japanese: "五月 (ごがつ)", english: "May" },
      { japanese: "六月 (ろくがつ)", english: "June" },
      { japanese: "七月 (しちがつ)", english: "July" },
      { japanese: "八月 (はちがつ)", english: "August" },
      { japanese: "九月 (くがつ)", english: "September" },
      { japanese: "十月 (じゅうがつ)", english: "October" },
      { japanese: "十一月 (じゅういちがつ)", english: "November" },
      { japanese: "十二月 (じゅうにがつ)", english: "December" }
    ],

    grammar: [
      { point: "Month formation", explanation: "Simply add がつ to the number (1–12). Note April (4), July (7), September (9) have irregular readings." }
    ],

    examples: [
      { japanese: "誕生日は五月です。", english: "My birthday is in May." },
      { japanese: "十二月に日本へ行きます。", english: "I will go to Japan in December." }
    ],
  },
  {
    id: 9,
    title: "Telling Time",
    level: "A1",
    vocabulary: [
      { japanese: "時 (じ)", english: "hour / o'clock" },
      { japanese: "分 (ふん / ぷん)", english: "minute" },
      { japanese: "半 (はん)", english: "half (half past)" },
      { japanese: "今 (いま)", english: "now" }
    ],

    grammar: [
      { point: "Time structure", explanation: "Use [number]時[number]分. For half past, add 半 after hour. Minutes have irregular pronunciations for 1,3,4,6,8,10, etc." }
    ],

    examples: [
      { japanese: "今、三時です。", english: "It is 3 o'clock now." },
      { japanese: "七時半に起きます。", english: "I wake up at half past seven." }
    ],
  },
  {
    id: 10,
    title: "Asking for Directions",
    level: "A1",
    vocabulary: [
      { japanese: "どこ", english: "where" },
      { japanese: "駅 (えき)", english: "station" },
      { japanese: "交番 (こうばん)", english: "police box" },
      { japanese: "右 (みぎ)", english: "right" },
      { japanese: "左 (ひだり)", english: "left" },
      { japanese: "まっすぐ", english: "straight" }
    ],

    grammar: [
      { point: "～はどこですか？", explanation: "Use ～はどこですか to ask 'Where is ~?'." }
    ],

    examples: [
      { japanese: "駅はどこですか？", english: "Where is the station?" },
      { japanese: "まっすぐ行って、右です。", english: "Go straight, then it's on the right." }
    ],
  },
  {
    id: 11,
    title: "Ordering Food",
    level: "A1",
    vocabulary: [
      { japanese: "メニュー", english: "menu" },
      { japanese: "注文 (ちゅうもん)", english: "order" },
      { japanese: "ください", english: "please (give me)" },
      { japanese: "お願いします (おねがいします)", english: "please (request)" },
      { japanese: "お会計 (おかいけい)", english: "bill / check" }
    ],

    grammar: [
      { point: "～をください", explanation: "Use ～をください to order something. ～をお願いします is a polite alternative." }
    ],

    examples: [
      { japanese: "ラーメンをください。", english: "Ramen, please." },
      { japanese: "コーヒーをお願いします。", english: "Coffee, please." },
      { japanese: "お会計お願いします。", english: "Check, please." }
    ],
  },
  {
    id: 12,
    title: "Shopping Phrases",
    level: "A1",
    vocabulary: [
      { japanese: "いくら", english: "how much" },
      { japanese: "高い (たかい)", english: "expensive / high" },
      { japanese: "安い (やすい)", english: "cheap" },
      { japanese: "これをください", english: "I'll take this" },
      { japanese: "袋 (ふくろ)", english: "bag" }
    ],

    grammar: [
      { point: "いくらですか", explanation: "Use いくらですか to ask the price. これをください to purchase." }
    ],

    examples: [
      { japanese: "これはいくらですか？", english: "How much is this?" },
      { japanese: "もう少し安いのはありますか？", english: "Do you have something a bit cheaper?" }
    ],
  },
  {
    id: 13,
    title: "Family Members",
    level: "A1",
    vocabulary: [
      { japanese: "お父さん (おとうさん)", english: "father" },
      { japanese: "お母さん (おかあさん)", english: "mother" },
      { japanese: "お兄さん (おにいさん)", english: "older brother" },
      { japanese: "お姉さん (おねえさん)", english: "older sister" },
      { japanese: "弟 (おとうと)", english: "younger brother" },
      { japanese: "妹 (いもうと)", english: "younger sister" }
    ],

    grammar: [
      { point: "Honorific family terms", explanation: "When speaking about your own family, use humble forms (e.g., 父, 母). When speaking about someone else's family, use respectful forms (お父さん, お母さん)." }
    ],

    examples: [
      { japanese: "私の父は医者です。", english: "My father is a doctor." },
      { japanese: "お母さんは元気ですか？", english: "How is your mother?" }
    ],
  },
  {
    id: 14,
    title: "Colors",
    level: "A1",
    vocabulary: [
      { japanese: "赤 (あか)", english: "red" },
      { japanese: "青 (あお)", english: "blue" },
      { japanese: "黄色 (きいろ)", english: "yellow" },
      { japanese: "白 (しろ)", english: "white" },
      { japanese: "黒 (くろ)", english: "black" },
      { japanese: "緑 (みどり)", english: "green" }
    ],

    grammar: [
      { point: "Color adjectives", explanation: "Colors can be nouns or い-adjectives. Add い to form adjective: 赤い, 青い, 白い, 黒い, 黄色い. 緑 is a noun only." }
    ],

    examples: [
      { japanese: "赤い花が好きです。", english: "I like red flowers." },
      { japanese: "青い空がきれいです。", english: "The blue sky is beautiful." }
    ],
  },
  {
    id: 15,
    title: "I-Adjectives (Present Tense)",
    level: "A1",
    vocabulary: [
      { japanese: "大きい (おおきい)", english: "big" },
      { japanese: "小さい (ちいさい)", english: "small" },
      { japanese: "新しい (あたらしい)", english: "new" },
      { japanese: "古い (ふるい)", english: "old" },
      { japanese: "美味しい (おいしい)", english: "delicious" }
    ],

    grammar: [
      { point: "I-adjective conjugation", explanation: "I-adjectives end in い. To make a polite non-past affirmative, attach です: 大きいです. To make negative, change い to くないです: 大きくないです." }
    ],

    examples: [
      { japanese: "このケーキは美味しいです。", english: "This cake is delicious." },
      { japanese: "そのスマホは高くないです。", english: "That smartphone is not expensive." }
    ],
  },
  {
    id: 16,
    title: "Na-Adjectives (Present Tense)",
    level: "A2",
    vocabulary: [
      { japanese: "静か (しずか)", english: "quiet" },
      { japanese: "賑やか (にぎやか)", english: "lively" },
      { japanese: "綺麗 (きれい)", english: "beautiful / clean" },
      { japanese: "元気 (げんき)", english: "healthy / energetic" }
    ],

    grammar: [
      { point: "Na-adjective usage", explanation: "Na-adjectives require な before a noun, and take です for polite predicate. Negative: add ではありません or じゃないです." }
    ],

    examples: [
      { japanese: "図書館は静かです。", english: "The library is quiet." },
      { japanese: "彼女は元気な人です。", english: "She is an energetic person." }
    ],
  },
  {
    id: 17,
    title: "Verbs: Present Tense (Masu-form)",
    level: "A2",
    vocabulary: [
      { japanese: "食べます (たべます)", english: "eat" },
      { japanese: "飲みます (のみます)", english: "drink" },
      { japanese: "行きます (いきます)", english: "go" },
      { japanese: "来ます (きます)", english: "come" },
      { japanese: "見ます (みます)", english: "see / watch" }
    ],

    grammar: [
      { point: "Masu-form polite present", explanation: "Add ます to verb stem. Stem of 食べる is 食べ-, so 食べます. Negative: ません." }
    ],

    examples: [
      { japanese: "毎日コーヒーを飲みます。", english: "I drink coffee every day." },
      { japanese: "明日学校へ行きます。", english: "I will go to school tomorrow." }
    ],
  },
  {
    id: 18,
    title: "Verbs: Past Tense (Masu-form)",
    level: "A2",
    vocabulary: [
      { japanese: "食べました (たべました)", english: "ate" },
      { japanese: "飲みました (のみました)", english: "drank" },
      { japanese: "行きました (いきました)", english: "went" },
      { japanese: "来ました (きました)", english: "came" },
      { japanese: "見ました (みました)", english: "saw / watched" }
    ],

    grammar: [
      { point: "Past tense masu-form", explanation: "Change ます to ました for affirmative past. Negative past: ませんでした." }
    ],

    examples: [
      { japanese: "昨日すしを食べました。", english: "I ate sushi yesterday." },
      { japanese: "映画を見ませんでした。", english: "I did not watch a movie." }
    ],
  },
  {
    id: 19,
    title: "Particles: は, が, を",
    level: "A2",
    vocabulary: [
      { japanese: "は (wa)", english: "topic marker" },
      { japanese: "が (ga)", english: "subject marker" },
      { japanese: "を (o)", english: "object marker" }
    ],

    grammar: [
      { point: "Particle functions", explanation: "は marks the topic (what you are talking about). が marks the grammatical subject. を marks the direct object. は can contrast, が is used for new information." }
    ],

    examples: [
      { japanese: "私は学生です。", english: "I am a student (topic)." },
      { japanese: "猫がいます。", english: "There is a cat (subject)." },
      { japanese: "本を読みます。", english: "I read a book (object)." }
    ],
  },
  {
    id: 20,
    title: "Te-Form Basics",
    level: "A2",
    vocabulary: [
      { japanese: "食べて (たべて)", english: "eating / please eat" },
      { japanese: "飲んで (のんで)", english: "drinking / please drink" },
      { japanese: "行って (いって)", english: "going / please go" },
      { japanese: "見て (みて)", english: "seeing / please see" },
      { japanese: "読んで (よんで)", english: "reading / please read" }
    ],

    grammar: [
      { point: "Te-form formation & uses", explanation: "Te-form connects verbs, makes requests (~てください), and forms progressive (~ている). Formation rules: る→て, う/つ/る→って, む/ぬ/ぶ→んで, etc." }
    ],

    examples: [
      { japanese: "窓を開けてください。", english: "Please open the window." },
      { japanese: "今、勉強しています。", english: "I am studying now." }
    ],
  }
,
{
  id: 21,
  title: "Making Phone Calls",
  level: "A2",
  vocabulary: [
    { japanese: "もしもし", english: "hello (on phone)" },
    { japanese: "電話番号", english: "phone number" },
    { japanese: "電話をかける", english: "to make a phone call" },
    { japanese: "電話に出る", english: "to answer the phone" },
    { japanese: "切る", english: "to hang up" },
    { japanese: "伝言", english: "message" },
    { japanese: "折り返し", english: "call back" },
    { japanese: "話し中", english: "busy (line)" },
    { japanese: "留守番電話", english: "answering machine" },
    { japanese: "間違い電話", english: "wrong number" }
  ],

  grammar: [
    { point: "～てもいいですか", explanation: "May I...? Polite request form." },
    { point: "～んですが", explanation: "Used to softly introduce a request or reason." }
  ],

  examples: [
    { japanese: "田中さんはいらっしゃいますか。", english: "Is Mr./Ms. Tanaka there?" },
    { japanese: "山田と申しますが、田中さんをお願いします。", english: "My name is Yamada, may I speak to Tanaka?" },
    { japanese: "すみません、今電話に出られません。", english: "Sorry, I can't answer the phone right now." },
    { japanese: "折り返しお電話いただけますか。", english: "Could you call me back?" },
    { japanese: "伝言をお願いできますか。", english: "Can I leave a message?" }
  ],

  dialogue: [
    { speaker: "A", japanese: "はい、田中です。", english: "Yes, this is Tanaka." },
    { speaker: "B", japanese: "もしもし、山田ですが。", english: "Hello, this is Yamada." },
    { speaker: "A", japanese: "あ、山田さん、こんにちは。", english: "Oh, Yamada-san, hello." },
    { speaker: "B", japanese: "明日の会議について話したいんですが。", english: "I wanted to talk about tomorrow's meeting." },
  ],

  exercises: [
    { type: "fill-blank", question: "もしもし、田中さんは___か。", answer: "いらっしゃいます" },
    { type: "matching", pairs: [{ japanese: "電話をかける", english: "to make a phone call" }, { japanese: "電話に出る", english: "to answer the phone" }],
 instruction: "Match the Japanese phrases with their English meanings" },
    { type: "translation", vietnamese: "Xin chào, tôi có thể nói chuyện với anh Tanaka được không?", japanese: "もしもし、田中さんと話してもいいですか。" }
  ],
},
{
  id: 22,
  title: "Writing Emails",
  level: "A2",
  vocabulary: [
    { japanese: "メール", english: "email" },
    { japanese: "件名", english: "subject line" },
    { japanese: "本文", english: "body (of email)" },
    { japanese: "送信する", english: "to send" },
    { japanese: "受信する", english: "to receive" },
    { japanese: "返信する", english: "to reply" },
    { japanese: "添付ファイル", english: "attachment" },
    { japanese: "宛先", english: "recipient" },
    { japanese: "CC", english: "CC (carbon copy)" },
    { japanese: "拝啓", english: "Dear (formal opening)" }
  ],

  grammar: [
    { point: "～ていただけますか", explanation: "Could you please...? Very polite request." },
    { point: "～させていただきます", explanation: "Humble form meaning 'allow me to...'." }
  ],

  examples: [
    { japanese: "件名：来週の打ち合わせについて", english: "Subject: Regarding next week's meeting" },
    { japanese: "お世話になっております。", english: "Thank you for your continued support (standard opening)." },
    { japanese: "資料を添付いたしました。", english: "I have attached the documents." },
    { japanese: "ご確認のほど、よろしくお願いいたします。", english: "Please review it. (formal request)" },
    { japanese: "以上、よろしくお願い申し上げます。", english: "That is all, thank you. (formal closing)" }
  ],

  dialogue: [
    { speaker: "A", japanese: "添付ファイルが開けません。", english: "I can't open the attachment." },
    { speaker: "B", japanese: "申し訳ありません。PDF形式で再送します。", english: "I'm sorry. I'll resend it as a PDF." },
    { speaker: "A", japanese: "ありがとうございます。確認します。", english: "Thank you. I'll check it." },
    { speaker: "B", japanese: "何か問題があれば、またご連絡ください。", english: "If you have any issues, please let me know." },
  ],

  exercises: [
    { type: "fill-blank", question: "___、田中でございます。", answer: "お世話になっております" },
    { type: "matching", pairs: [{ japanese: "件名", english: "subject" }, { japanese: "添付", english: "attachment" }],
 instruction: "Match the Japanese email terms with English" },
    { type: "translation", vietnamese: "Tôi đã gửi email cho bạn. Bạn đã nhận được chưa?", japanese: "メールを送りました。受信されましたか。" }
  ],
},
{
  id: 23,
  title: "At the Bank",
  level: "A2",
  vocabulary: [
    { japanese: "銀行", english: "bank" },
    { japanese: "口座", english: "account" },
    { japanese: "預ける", english: "to deposit" },
    { japanese: "引き出す", english: "to withdraw" },
    { japanese: "振り込み", english: "bank transfer" },
    { japanese: "残高", english: "balance" },
    { japanese: "通帳", english: "bank book" },
    { japanese: "キャッシュカード", english: "cash card" },
    { japanese: "窓口", english: "teller window" },
    { japanese: "手数料", english: "fee" }
  ],

  grammar: [
    { point: "～たいんですけど", explanation: "I'd like to... (soft request pattern)." },
    { point: "～ていただけませんか", explanation: "Could you do... for me? Polite request." }
  ],

  examples: [
    { japanese: "口座を開きたいんですが。", english: "I'd like to open an account." },
    { japanese: "お金を預けたいです。", english: "I want to deposit money." },
    { japanese: "残高を確認してください。", english: "Please check the balance." },
    { japanese: "振り込みをお願いします。", english: "I'd like to make a transfer." },
    { japanese: "キャッシュカードをなくしました。", english: "I lost my cash card." }
  ],

  dialogue: [
    { speaker: "A", japanese: "すみません、口座を開きたいんですが。", english: "Excuse me, I'd like to open an account." },
    { speaker: "B", japanese: "かしこまりました。こちらに必要事項をご記入ください。", english: "Certainly. Please fill in the necessary information here." },
    { speaker: "A", japanese: "はい。身分証明書は必要ですか。", english: "Yes. Do I need identification?" },
    { speaker: "B", japanese: "パスポートか運転免許証をお願いします。", english: "Your passport or driver's license, please." },
  ],

  exercises: [
    { type: "fill-blank", question: "口座を___たいんですが。", answer: "開き" },
    { type: "matching", pairs: [{ japanese: "預ける", english: "to deposit" }, { japanese: "引き出す", english: "to withdraw" }],
 instruction: "Match the Japanese verbs with their meanings" },
    { type: "translation", vietnamese: "Tôi muốn chuyển khoản đến ngân hàng này.", japanese: "この銀行に振り込みたいです。" }
  ],
},
{
  id: 24,
  title: "At the Post Office",
  level: "A2",
  vocabulary: [
    { japanese: "郵便局", english: "post office" },
    { japanese: "切手", english: "stamp" },
    { japanese: "はがき", english: "postcard" },
    { japanese: "速達", english: "express mail" },
    { japanese: "書留", english: "registered mail" },
    { japanese: "小包", english: "parcel" },
    { japanese: "航空便", english: "airmail" },
    { japanese: "船便", english: "surface mail" },
    { japanese: "送料", english: "shipping fee" },
    { japanese: "追跡", english: "tracking" }
  ],

  grammar: [
    { point: "～ていただけますか", explanation: "Polite request: 'Could you...?'" },
    { point: "～でお願いします", explanation: "I'd like it by... (method)." }
  ],

  examples: [
    { japanese: "この手紙を航空便で送りたいです。", english: "I want to send this letter by airmail." },
    { japanese: "切手を五枚ください。", english: "Please give me five stamps." },
    { japanese: "小包を海外に送りたいんですが。", english: "I'd like to send a parcel overseas." },
    { japanese: "書留にしてください。", english: "Please make it registered mail." },
    { japanese: "追跡番号を教えてください。", english: "Please tell me the tracking number." }
  ],

  dialogue: [
    { speaker: "A", japanese: "すみません、この小包をベトナムに送りたいです。", english: "Excuse me, I'd like to send this parcel to Vietnam." },
    { speaker: "B", japanese: "航空便と船便がありますが、どちらになさいますか。", english: "We have airmail and surface mail. Which would you like?" },
    { speaker: "A", japanese: "航空便でお願いします。いくらですか。", english: "Airmail, please. How much is it?" },
    { speaker: "B", japanese: "二千五百円です。", english: "It's 2,500 yen." },
  ],

  exercises: [
    { type: "fill-blank", question: "この手紙を___で送りたいです。", answer: "航空便" },
    { type: "matching", pairs: [{ japanese: "速達", english: "express mail" }, { japanese: "書留", english: "registered mail" }],
 instruction: "Match the Japanese mail services with English" },
    { type: "translation", vietnamese: "Tôi muốn mua vài con tem để gửi bưu thiếp.", japanese: "はがきを送るための切手を何枚か買いたいです。" }
  ],
},
{
  id: 25,
  title: "Renting an Apartment",
  level: "A2",
  vocabulary: [
    { japanese: "アパート", english: "apartment" },
    { japanese: "賃貸", english: "rental" },
    { japanese: "家賃", english: "rent" },
    { japanese: "敷金", english: "deposit" },
    { japanese: "礼金", english: "key money" },
    { japanese: "契約", english: "contract" },
    { japanese: "保証人", english: "guarantor" },
    { japanese: "間取り", english: "floor plan" },
    { japanese: "駅から徒歩", english: "walk from station" },
    { japanese: "更新料", english: "renewal fee" }
  ],

  grammar: [
    { point: "～たいんですが", explanation: "I'd like to... (polite request)." },
    { point: "～なければならない", explanation: "must / have to" }
  ],

  examples: [
    { japanese: "駅から徒歩五分以内のアパートを探しています。", english: "I'm looking for an apartment within a 5-minute walk from the station." },
    { japanese: "家賃はいくらですか。", english: "How much is the rent?" },
    { japanese: "敷金と礼金はそれぞれ一か月分です。", english: "Deposit and key money are each one month's rent." },
    { japanese: "保証人が必要ですか。", english: "Is a guarantor necessary?" },
    { japanese: "契約期間は二年です。", english: "The contract period is two years." }
  ],

  dialogue: [
    { speaker: "A", japanese: "このアパートの家賃はいくらですか。", english: "How much is the rent for this apartment?" },
    { speaker: "B", japanese: "月額八万円です。敷金と礼金が別にかかります。", english: "80,000 yen per month. Deposit and key money are separate." },
    { speaker: "A", japanese: "敷金はいくらですか。", english: "How much is the deposit?" },
    { speaker: "B", japanese: "家賃一か月分です。", english: "It's one month's rent." },
  ],

  exercises: [
    { type: "fill-blank", question: "保証人が___。", answer: "必要です" },
    { type: "matching", pairs: [{ japanese: "敷金", english: "deposit" }, { japanese: "礼金", english: "key money" }],
 instruction: "Match the Japanese rental terms" },
    { type: "translation", vietnamese: "Tôi muốn tìm một căn hộ gần nhà ga.", japanese: "駅の近くのアパートを探したいです。" }
  ],
},
{
  id: 26,
  title: "Complaints and Returns",
  level: "A2",
  vocabulary: [
    { japanese: "苦情", english: "complaint" },
    { japanese: "返品", english: "return (product)" },
    { japanese: "交換", english: "exchange" },
    { japanese: "不良品", english: "defective product" },
    { japanese: "レシート", english: "receipt" },
    { japanese: "返金", english: "refund" },
    { japanese: "対応", english: "response / handling" },
    { japanese: "申し訳ありません", english: "I'm very sorry" },
    { japanese: "確認する", english: "to check" },
    { japanese: "交換していただけますか", english: "Could you exchange it?" }
  ],

  grammar: [
    { point: "～ていただけますか", explanation: "Could you...? Polite request." },
    { point: "～てしまいました", explanation: "I accidentally did (regretful)." }
  ],

  examples: [
    { japanese: "この商品は不良品です。", english: "This product is defective." },
    { japanese: "レシートをなくしてしまいました。", english: "I lost the receipt." },
    { japanese: "返金していただけますか。", english: "Could you give me a refund?" },
    { japanese: "交換してもらえますか。", english: "Can I exchange it?" },
    { japanese: "大変申し訳ございません。すぐに対応いたします。", english: "We apologize sincerely. We'll handle it immediately." }
  ],

  dialogue: [
    { speaker: "A", japanese: "すみません、昨日買ったこのシャツ、サイズが合わないんですが。", english: "Excuse me, this shirt I bought yesterday doesn't fit." },
    { speaker: "B", japanese: "レシートはお持ちですか。", english: "Do you have the receipt?" },
    { speaker: "A", japanese: "はい、これです。交換できますか。", english: "Yes, here it is. Can I exchange it?" },
    { speaker: "B", japanese: "かしこまりました。お好きなサイズと交換いたします。", english: "Certainly. We'll exchange it for your preferred size." },
  ],

  exercises: [
    { type: "fill-blank", question: "この製品は___です。", answer: "不良品" },
    { type: "matching", pairs: [{ japanese: "返品", english: "return" }, { japanese: "交換", english: "exchange" }],
 instruction: "Match the Japanese words with English" },
    { type: "translation", vietnamese: "Tôi muốn trả lại cái áo này vì nó bị lỗi.", japanese: "このシャツは不良品なので返品したいです。" }
  ],
},
{
  id: 27,
  title: "Giving Detailed Directions",
  level: "A2",
  vocabulary: [
    { japanese: "交差点", english: "intersection" },
    { japanese: "信号", english: "traffic light" },
    { japanese: "曲がる", english: "to turn" },
    { japanese: "まっすぐ", english: "straight" },
    { japanese: "～つ目の", english: "the (number)th" },
    { japanese: "角", english: "corner" },
    { japanese: "看板", english: "signboard" },
    { japanese: "目印", english: "landmark" },
    { japanese: "徒歩", english: "on foot" },
    { japanese: "～分", english: "minutes" }
  ],

  grammar: [
    { point: "～と（条件）", explanation: "If you do ~, then... (conditional)" },
    { point: "～てから", explanation: "After doing ~" }
  ],

  examples: [
    { japanese: "次の信号を右に曲がってください。", english: "Please turn right at the next traffic light." },
    { japanese: "まっすぐ行って、三つ目の角を左です。", english: "Go straight and it's the third corner on the left." },
    { japanese: "駅を出て、右に行くと銀行があります。", english: "After leaving the station, go right and there's a bank." },
    { japanese: "この道をまっすぐ五分歩いてください。", english: "Walk straight on this road for five minutes." },
    { japanese: "コンビニが目印です。その隣です。", english: "The convenience store is the landmark. It's next to it." }
  ],

  dialogue: [
    { speaker: "A", japanese: "すみません、駅への道を教えてください。", english: "Excuse me, could you tell me the way to the station?" },
    { speaker: "B", japanese: "この道をまっすぐ行って、最初の交差点を左に曲がってください。", english: "Go straight on this road and turn left at the first intersection." },
    { speaker: "A", japanese: "左ですね。どのくらいかかりますか。", english: "Left, right? How long does it take?" },
    { speaker: "B", japanese: "徒歩で十分くらいです。", english: "About ten minutes on foot." },
  ],

  exercises: [
    { type: "fill-blank", question: "次の___を右に曲がってください。", answer: "信号" },
    { type: "matching", pairs: [{ japanese: "曲がる", english: "to turn" }, { japanese: "まっすぐ", english: "straight" }],
 instruction: "Match the Japanese direction words" },
    { type: "translation", vietnamese: "Đi thẳng và rẽ trái ở ngã tư thứ hai.", japanese: "まっすぐ行って、二つ目の交差点を左に曲がってください。" }
  ],
},
{
  id: 28,
  title: "Discussing News",
  level: "A2",
  vocabulary: [
    { japanese: "ニュース", english: "news" },
    { japanese: "記事", english: "article" },
    { japanese: "見出し", english: "headline" },
    { japanese: "話題", english: "topic" },
    { japanese: "政治", english: "politics" },
    { japanese: "経済", english: "economy" },
    { japanese: "事件", english: "incident" },
    { japanese: "報道", english: "reporting" },
    { japanese: "影響", english: "influence" },
    { japanese: "意見", english: "opinion" }
  ],

  grammar: [
    { point: "～によると", explanation: "According to ~" },
    { point: "～らしい", explanation: "It seems that ~ (hearsay/evidential)" }
  ],

  examples: [
    { japanese: "ニュースによると、明日は雨らしいです。", english: "According to the news, it seems it will rain tomorrow." },
    { japanese: "この事件についてどう思いますか。", english: "What do you think about this incident?" },
    { japanese: "経済のニュースはあまり詳しくないです。", english: "I'm not very familiar with economic news." },
    { japanese: "今日の見出しを見ましたか。", english: "Did you see today's headlines?" },
    { japanese: "その話題はとても重要だと思います。", english: "I think that topic is very important." }
  ],

  dialogue: [
    { speaker: "A", japanese: "今日のニュースを見ましたか。大きな地震があったそうです。", english: "Did you see today's news? There was a big earthquake, apparently." },
    { speaker: "B", japanese: "えっ、本当ですか。どこですか。", english: "What? Really? Where?" },
    { speaker: "A", japanese: "北海道らしいです。", english: "It seems it was in Hokkaido." },
    { speaker: "B", japanese: "それは大変ですね。被害は大きくないといいですが。", english: "That's terrible. I hope the damage isn't severe." },
  ],

  exercises: [
    { type: "fill-blank", question: "ニュース___、明日は雪が降るそうです。", answer: "によると" },
    { type: "matching", pairs: [{ japanese: "見出し", english: "headline" }, { japanese: "記事", english: "article" }],
 instruction: "Match the Japanese news vocabulary" },
    { type: "translation", vietnamese: "Theo tin tức, ngày mai sẽ có mưa lớn.", japanese: "ニュースによると、明日大雨が降るそうです。" }
  ],
},
{
  id: 29,
  title: "Cultural Differences",
  level: "A2",
  vocabulary: [
    { japanese: "文化", english: "culture" },
    { japanese: "習慣", english: "custom" },
    { japanese: "違い", english: "difference" },
    { japanese: "マナー", english: "manners" },
    { japanese: "礼儀", english: "etiquette" },
    { japanese: "交流", english: "exchange" },
    { japanese: "理解する", english: "to understand" },
    { japanese: "驚く", english: "to be surprised" },
    { japanese: "失礼", english: "rude" },
    { japanese: "適応する", english: "to adapt" }
  ],

  grammar: [
    { point: "～と比べて", explanation: "Compared to ~" },
    { point: "～というのは", explanation: "Speaking of ~, (explanation)" }
  ],

  examples: [
    { japanese: "日本とベトナムでは習慣が違います。", english: "Customs differ between Japan and Vietnam." },
    { japanese: "初めての時はとても驚きました。", english: "I was very surprised the first time." },
    { japanese: "靴を脱ぐ習慣は日本の文化です。", english: "The custom of taking off shoes is Japanese culture." },
    { japanese: "ベトナムと比べて、日本は時間に厳しいです。", english: "Compared to Vietnam, Japan is strict about time." },
    { japanese: "異文化を理解するのは大切です。", english: "Understanding different cultures is important." }
  ],

  dialogue: [
    { speaker: "A", japanese: "日本では、電車の中で電話をしないんですね。", english: "In Japan, you don't make phone calls on the train, right?" },
    { speaker: "B", japanese: "そうです。マナーとして静かにするのが普通です。", english: "Yes, it's common to be quiet as a manner." },
    { speaker: "A", japanese: "ベトナムではよく電話をします。それが普通です。", english: "In Vietnam, we often make calls. It's normal." },
    { speaker: "B", japanese: "文化の違いですね。面白いです。", english: "That's a cultural difference. Interesting." },
  ],

  exercises: [
    { type: "fill-blank", question: "日本とベトナムでは___が違います。", answer: "習慣" },
    { type: "matching", pairs: [{ japanese: "マナー", english: "manners" }, { japanese: "礼儀", english: "etiquette" }],
 instruction: "Match the Japanese words with English" },
    { type: "translation", vietnamese: "So với Việt Nam, Nhật Bản có nhiều quy tắc hơn.", japanese: "ベトナムと比べて、日本はルールが多いです。" }
  ],
},
{
  id: 30,
  title: "Job Interviews",
  level: "A2",
  vocabulary: [
    { japanese: "面接", english: "interview" },
    { japanese: "志望動機", english: "motivation for applying" },
    { japanese: "自己紹介", english: "self-introduction" },
    { japanese: "長所", english: "strength" },
    { japanese: "短所", english: "weakness" },
    { japanese: "経験", english: "experience" },
    { japanese: "資格", english: "qualification" },
    { japanese: "採用", english: "hiring" },
    { japanese: "応募する", english: "to apply" },
    { japanese: "履歴書", english: "resume" }
  ],

  grammar: [
    { point: "～させていただきます", explanation: "Humble form: 'I will do (for you)'." },
    { point: "～ていただけませんか", explanation: "Could you please...? (polite request in interview context)" }
  ],

  examples: [
    { japanese: "私の長所は責任感が強いことです。", english: "My strength is a strong sense of responsibility." },
    { japanese: "志望動機を教えてください。", english: "Please tell me your motivation for applying." },
    { japanese: "この業界での経験は一年です。", english: "I have one year of experience in this industry." },
    { japanese: "どうぞよろしくお願いいたします。", english: "I look forward to working with you. (humble)" },
    { japanese: "短所は、細かいところに気を使いすぎることです。", english: "My weakness is paying too much attention to details." }
  ],

  dialogue: [
    { speaker: "A", japanese: "自己紹介をお願いします。", english: "Please introduce yourself." },
    { speaker: "B", japanese: "はい、私はベトナムから参りましたチャンと申します。", english: "Yes, I'm Tran from Vietnam." },
    { speaker: "A", japanese: "なぜこの会社を志望したのですか。", english: "Why did you apply to this company?" },
    { speaker: "B", japanese: "御社のグローバルな事業に魅力を感じました。", english: "I was attracted to your company's global business." },
  ],

  exercises: [
    { type: "fill-blank", question: "私の___は責任感が強いことです。", answer: "長所" },
    { type: "matching", pairs: [{ japanese: "志望動機", english: "motivation" }, { japanese: "履歴書", english: "resume" }],
 instruction: "Match the Japanese interview terms" },
    { type: "translation", vietnamese: "Tôi muốn giới thiệu bản thân. Tôi tốt nghiệp đại học năm ngoái.", japanese: "自己紹介させていただきます。去年大学を卒業しました。" }
  ],
},
{
  id: 31,
  title: "Business Meetings",
  level: "B1",
  vocabulary: [
    { japanese: "会議", english: "meeting" },
    { japanese: "議題", english: "agenda" },
    { japanese: "進行", english: "facilitation" },
    { japanese: "発言", english: "speaking / remark" },
    { japanese: "賛成", english: "agree" },
    { japanese: "反対", english: "oppose" },
    { japanese: "意見", english: "opinion" },
    { japanese: "決める", english: "to decide" },
    { japanese: "確認する", english: "to confirm" },
    { japanese: "資料", english: "documents" }
  ],

  grammar: [
    { point: "～たほうがいい", explanation: "It's better to ~ (suggestion)" },
    { point: "～べきだ", explanation: "Should / ought to (obligation)" }
  ],

  examples: [
    { japanese: "議題について意見があります。", english: "I have an opinion about the agenda." },
    { japanese: "私はその提案に賛成です。", english: "I agree with that proposal." },
    { japanese: "もう一度確認したほうがいいと思います。", english: "I think we should check once more." },
    { japanese: "会議は三時からです。", english: "The meeting is from 3 o'clock." },
    { japanese: "次の議題に移りましょう。", english: "Let's move on to the next agenda item." }
  ],

  dialogue: [
    { speaker: "A", japanese: "今日の議題は来月のプロジェクトについてです。", english: "Today's agenda is about next month's project." },
    { speaker: "B", japanese: "はい、まずスケジュールを確認しましょう。", english: "Yes, let's first confirm the schedule." },
    { speaker: "A", japanese: "それでは、資料の二ページをご覧ください。", english: "Then, please look at page 2 of the handout." },
    { speaker: "B", japanese: "この計画は少し無理があると思います。", english: "I think this plan is a bit unrealistic." },
  ],

  exercises: [
    { type: "fill-blank", question: "私はその提案に___です。", answer: "賛成" },
    { type: "matching", pairs: [{ japanese: "議題", english: "agenda" }, { japanese: "資料", english: "handout" }],
 instruction: "Match the Japanese meeting vocabulary" },
    { type: "translation", vietnamese: "Tôi nghĩ chúng ta nên thảo luận vấn đề này trước.", japanese: "この問題を先に議論したほうがいいと思います。" }
  ],
},
{
  id: 32,
  title: "Giving Presentations",
  level: "B1",
  vocabulary: [
    { japanese: "プレゼンテーション", english: "presentation" },
    { japanese: "スライド", english: "slide" },
    { japanese: "グラフ", english: "graph" },
    { japanese: "データ", english: "data" },
    { japanese: "説明する", english: "to explain" },
    { japanese: "質問", english: "question" },
    { japanese: "要約する", english: "to summarize" },
    { japanese: "導入", english: "introduction" },
    { japanese: "結論", english: "conclusion" },
    { japanese: "強調する", english: "to emphasize" }
  ],

  grammar: [
    { point: "～について", explanation: "Regarding / about ~" },
    { point: "～のです（説明）", explanation: "Used for explanation / emphasis." }
  ],

  examples: [
    { japanese: "本日は市場動向について発表します。", english: "Today I will present about market trends." },
    { japanese: "次のスライドをご覧ください。", english: "Please look at the next slide." },
    { japanese: "このグラフは売上の推移を示しています。", english: "This graph shows the sales trend." },
    { japanese: "質問がありますか。", english: "Are there any questions?" },
    { japanese: "結論として、この戦略は有効です。", english: "In conclusion, this strategy is effective." }
  ],

  dialogue: [
    { speaker: "A", japanese: "本日はお忙しい中お集まりいただきありがとうございます。", english: "Thank you for taking time to gather today." },
    { speaker: "B", japanese: "最初に自己紹介をお願いします。", english: "Please start with a self-introduction." },
    { speaker: "A", japanese: "はい、私は営業部の田中と申します。本日は新製品についてご説明します。", english: "Yes, I'm Tanaka from Sales. Today I'll explain about the new product." },
    { speaker: "B", japanese: "それでは、お願いします。", english: "Then, please go ahead." },
  ],

  exercises: [
    { type: "fill-blank", question: "次の___をご覧ください。", answer: "スライド" },
    { type: "matching", pairs: [{ japanese: "グラフ", english: "graph" }, { japanese: "データ", english: "data" }],
 instruction: "Match the Japanese presentation terms" },
    { type: "translation", vietnamese: "Tôi sẽ giải thích về chiến lược tiếp thị mới.", japanese: "新しいマーケティング戦略について説明します。" }
  ],
},
{
  id: 33,
  title: "Negotiating",
  level: "B1",
  vocabulary: [
    { japanese: "交渉", english: "negotiation" },
    { japanese: "条件", english: "condition" },
    { japanese: "妥協", english: "compromise" },
    { japanese: "譲歩", english: "concession" },
    { japanese: "提案", english: "proposal" },
    { japanese: "合意", english: "agreement" },
    { japanese: "値引き", english: "discount" },
    { japanese: "期限", english: "deadline" },
    { japanese: "見積もり", english: "quotation" },
    { japanese: "契約", english: "contract" }
  ],

  grammar: [
    { point: "～なければならない", explanation: "must / have to" },
    { point: "～てほしい", explanation: "I want you to ~" }
  ],

  examples: [
    { japanese: "もう少し値引きしていただけませんか。", english: "Could you give us a little more discount?" },
    { japanese: "この条件では合意できません。", english: "We cannot agree on these conditions." },
    { japanese: "お互いに譲歩する必要があります。", english: "We need to make mutual concessions." },
    { japanese: "この提案はいかがですか。", english: "How about this proposal?" },
    { japanese: "契約の期限は来週です。", english: "The contract deadline is next week." }
  ],

  dialogue: [
    { speaker: "A", japanese: "この価格では厳しいです。もう少し安くできませんか。", english: "This price is difficult. Can you make it a bit cheaper?" },
    { speaker: "B", japanese: "そうですね…では、一割引きなら可能です。", english: "Let's see... Well, I can offer a 10% discount." },
    { speaker: "A", japanese: "一割引きではまだ厳しいです。二割はいかがですか。", english: "10% is still tough. How about 20%?" },
    { speaker: "B", japanese: "二割は難しいです。一割五分でどうでしょうか。", english: "20% is difficult. How about 15%?" },
  ],

  exercises: [
    { type: "fill-blank", question: "この___では合意できません。", answer: "条件" },
    { type: "matching", pairs: [{ japanese: "妥協", english: "compromise" }, { japanese: "譲歩", english: "concession" }],
 instruction: "Match the Japanese negotiation terms" },
    { type: "translation", vietnamese: "Chúng tôi muốn yêu cầu giảm giá thêm.", japanese: "さらなる値引きをお願いしたいです。" }
  ],
},
{
  id: 34,
  title: "Social Media",
  level: "B1",
  vocabulary: [
    { japanese: "SNS", english: "social media" },
    { japanese: "投稿する", english: "to post" },
    { japanese: "フォローする", english: "to follow" },
    { japanese: "いいね", english: "like" },
    { japanese: "シェア", english: "share" },
    { japanese: "コメント", english: "comment" },
    { japanese: "プロフィール", english: "profile" },
    { japanese: "ハッシュタグ", english: "hashtag" },
    { japanese: "拡散", english: "spread / viral" },
    { japanese: "プライバシー", english: "privacy" }
  ],

  grammar: [
    { point: "～たらどう？", explanation: "How about if ~? (casual suggestion)" },
    { point: "～みたいな", explanation: "Like / similar to (casual)" }
  ],

  examples: [
    { japanese: "今日の写真をインスタに投稿しました。", english: "I posted today's photo on Instagram." },
    { japanese: "その投稿にいいねを押しました。", english: "I liked that post." },
    { japanese: "ハッシュタグをつけると見つけやすいです。", english: "Adding hashtags makes it easier to find." },
    { japanese: "SNSで拡散されたニュースを見ました。", english: "I saw news that went viral on social media." },
    { japanese: "プライバシー設定を確認したほうがいいよ。", english: "You should check your privacy settings." }
  ],

  dialogue: [
    { speaker: "A", japanese: "今朝、面白いツイートを見たよ。", english: "I saw an interesting tweet this morning." },
    { speaker: "B", japanese: "どんな内容？シェアしてくれる？", english: "What was it about? Can you share it?" },
    { speaker: "A", japanese: "いいよ。このリンクを送るね。", english: "Sure. I'll send you the link." },
    { speaker: "B", japanese: "ありがとう。後で見てみる。", english: "Thanks. I'll check it out later." },
  ],

  exercises: [
    { type: "fill-blank", question: "その投稿に___を押しました。", answer: "いいね" },
    { type: "matching", pairs: [{ japanese: "フォロー", english: "follow" }, { japanese: "拡散", english: "viral" }],
 instruction: "Match the Japanese social media terms" },
    { type: "translation", vietnamese: "Bạn có thể gửi cho tôi đường dẫn đến bài viết đó không?", japanese: "その投稿のリンクを送っていただけますか。" }
  ],
},
{
  id: 35,
  title: "Environmental Issues",
  level: "B1",
  vocabulary: [
    { japanese: "環境", english: "environment" },
    { japanese: "問題", english: "issue" },
    { japanese: "温暖化", english: "global warming" },
    { japanese: "リサイクル", english: "recycling" },
    { japanese: "省エネ", english: "energy saving" },
    { japanese: "ごみ", english: "garbage" },
    { japanese: "汚染", english: "pollution" },
    { japanese: "再生可能エネルギー", english: "renewable energy" },
    { japanese: "自然", english: "nature" },
    { japanese: "保護する", english: "to protect" }
  ],

  grammar: [
    { point: "～なければならない", explanation: "must / have to (obligation)" },
    { point: "～べきだ", explanation: "should (moral obligation)" }
  ],

  examples: [
    { japanese: "環境問題について話し合いましょう。", english: "Let's discuss environmental issues." },
    { japanese: "温暖化を防ぐために何ができますか。", english: "What can we do to prevent global warming?" },
    { japanese: "リサイクルをもっと積極的にするべきです。", english: "We should recycle more actively." },
    { japanese: "省エネ製品を使うことは重要です。", english: "Using energy-saving products is important." },
    { japanese: "自然を保護しなければなりません。", english: "We must protect nature." }
  ],

  dialogue: [
    { speaker: "A", japanese: "最近、環境問題に関心がありますか。", english: "Are you interested in environmental issues lately?" },
    { speaker: "B", japanese: "はい、特にプラスチックごみの問題について勉強しています。", english: "Yes, I'm studying the plastic waste problem." },
    { speaker: "A", japanese: "私もエコバッグを使うようにしています。", english: "I also try to use eco-bags." },
    { speaker: "B", japanese: "それはいいですね。みんなで取り組むべきです。", english: "That's great. We should all work on it." },
  ],

  exercises: [
    { type: "fill-blank", question: "___を防ぐために何ができますか。", answer: "温暖化" },
    { type: "matching", pairs: [{ japanese: "リサイクル", english: "recycling" }, { japanese: "省エネ", english: "energy saving" }],
 instruction: "Match the Japanese environment terms" },
    { type: "translation", vietnamese: "Chúng ta cần bảo vệ môi trường cho thế hệ tương lai.", japanese: "将来の世代のために環境を保護しなければなりません。" }
  ],
},
{
  id: 36,
  title: "Expressing Opinions",
  level: "B1",
  vocabulary: [
    { japanese: "意見", english: "opinion" },
    { japanese: "主張する", english: "to assert" },
    { japanese: "反論する", english: "to counterargue" },
    { japanese: "賛成", english: "agreement" },
    { japanese: "反対", english: "opposition" },
    { japanese: "根拠", english: "evidence" },
    { japanese: "観点", english: "perspective" },
    { japanese: "論点", english: "point of discussion" },
    { japanese: "明確にする", english: "to clarify" },
    { japanese: "納得する", english: "to be convinced" }
  ],

  grammar: [
    { point: "～という観点から", explanation: "From the perspective of ~" },
    { point: "～とは言えない", explanation: "Cannot say that ~ (negating a claim)" }
  ],

  examples: [
    { japanese: "私の意見を述べさせていただきます。", english: "Allow me to state my opinion." },
    { japanese: "その主張には根拠があるとは言えません。", english: "Cannot say that claim has evidence." },
    { japanese: "経済の観点から見ると、この政策は有効です。", english: "From an economic perspective, this policy is effective." },
    { japanese: "私はその意見に反対です。", english: "I oppose that opinion." },
    { japanese: "もう一度説明していただければ納得します。", english: "If you explain again, I'll be convinced." }
  ],

  dialogue: [
    { speaker: "A", japanese: "教育費を無料にするべきだと思います。", english: "I think education should be free." },
    { speaker: "B", japanese: "その意見には一部賛成ですが、財源の問題があります。", english: "I partly agree, but there's the issue of funding." },
    { speaker: "A", japanese: "税金を増やせば解決できるのでは？", english: "Couldn't we solve it by raising taxes?" },
    { speaker: "B", japanese: "しかし、国民の負担も考慮すべきです。", english: "But we should also consider the burden on citizens." },
  ],

  exercises: [
    { type: "fill-blank", question: "その___には根拠がありません。", answer: "主張" },
    { type: "matching", pairs: [{ japanese: "論点", english: "point of discussion" }, { japanese: "根拠", english: "evidence" }],
 instruction: "Match the Japanese discussion terms" },
    { type: "translation", vietnamese: "Theo quan điểm của tôi, vấn đề này cần được xem xét lại.", japanese: "私の観点からすると、この問題は再検討すべきです。" }
  ],
},
{
  id: 37,
  title: "Making Suggestions",
  level: "B1",
  vocabulary: [
    { japanese: "提案する", english: "to suggest" },
    { japanese: "勧める", english: "to recommend" },
    { japanese: "選択肢", english: "option" },
    { japanese: "代替案", english: "alternative" },
    { japanese: "考慮する", english: "to consider" },
    { japanese: "採用する", english: "to adopt" },
    { japanese: "メリット", english: "merit" },
    { japanese: "デメリット", english: "demerit" },
    { japanese: "優先順位", english: "priority" },
    { japanese: "試す", english: "to try" }
  ],

  grammar: [
    { point: "～てはいかがですか", explanation: "How about ~? (polite suggestion)" },
    { point: "～たほうがいい", explanation: "It would be better to ~" }
  ],

  examples: [
    { japanese: "新しいシステムを導入してはいかがですか。", english: "How about introducing a new system?" },
    { japanese: "まずは小規模で試したほうがいいでしょう。", english: "It would be better to try it on a small scale first." },
    { japanese: "代替案として、オンライン会議を提案します。", english: "As an alternative, I propose an online meeting." },
    { japanese: "このプランにはいくつかのメリットがあります。", english: "This plan has several merits." },
    { japanese: "優先順位を決める必要があります。", english: "We need to set priorities." }
  ],

  dialogue: [
    { speaker: "A", japanese: "来月のイベント、どうしますか。", english: "What shall we do about next month's event?" },
    { speaker: "B", japanese: "屋外でバーベキューをしてはいかがですか。", english: "How about having a BBQ outdoors?" },
    { speaker: "A", japanese: "いいアイデアですね。でも天気が心配です。", english: "Good idea. But I'm worried about the weather." },
    { speaker: "B", japanese: "では、室内と室外の両方のプランを準備しましょう。", english: "Then, let's prepare both indoor and outdoor plans." },
  ],

  exercises: [
    { type: "fill-blank", question: "新しい方法を___してはいかがですか。", answer: "試し" },
    { type: "matching", pairs: [{ japanese: "提案", english: "proposal" }, { japanese: "勧める", english: "recommend" }],
 instruction: "Match the Japanese suggestion verbs" },
    { type: "translation", vietnamese: "Tôi đề nghị chúng ta nên họp vào thứ Sáu.", japanese: "金曜日に会議をすることを提案します。" }
  ],
},
{
  id: 38,
  title: "Apologizing and Making Excuses",
  level: "B1",
  vocabulary: [
    { japanese: "謝る", english: "to apologize" },
    { japanese: "お詫び", english: "apology (formal)" },
    { japanese: "申し訳ない", english: "I'm sorry (strong)" },
    { japanese: "言い訳", english: "excuse" },
    { japanese: "理由", english: "reason" },
    { japanese: "不注意", english: "carelessness" },
    { japanese: "誤解", english: "misunderstanding" },
    { japanese: "謝罪する", english: "to apologize (formal)" },
    { japanese: "許す", english: "to forgive" },
    { japanese: "反省する", english: "to reflect / regret" }
  ],

  grammar: [
    { point: "～てしまいました", explanation: "I accidentally did (regret)" },
    { point: "～せいで", explanation: "because of ~ (blame)" }
  ],

  examples: [
    { japanese: "大変申し訳ございません。私の不注意でした。", english: "I am very sorry. It was my carelessness." },
    { japanese: "約束を忘れてしまいました。", english: "I accidentally forgot the appointment." },
    { japanese: "電車の遅れのせいで遅刻しました。", english: "I was late because of the train delay." },
    { japanese: "言い訳をするつもりはありません。", english: "I don't intend to make excuses." },
    { japanese: "どうかお許しください。", english: "Please forgive me." }
  ],

  dialogue: [
    { speaker: "A", japanese: "すみません、約束の時間に遅れてしまいました。", english: "I'm sorry, I was late for our appointment." },
    { speaker: "B", japanese: "どうしたんですか。", english: "What happened?" },
    { speaker: "A", japanese: "電車が止まってしまって。本当に申し訳ありません。", english: "The train stopped. I am truly sorry." },
    { speaker: "B", japanese: "次回から気をつけてくださいね。", english: "Please be careful next time." },
  ],

  exercises: [
    { type: "fill-blank", question: "私の___でミスをしました。", answer: "不注意" },
    { type: "matching", pairs: [{ japanese: "謝罪", english: "apology" }, { japanese: "言い訳", english: "excuse" }],
 instruction: "Match the Japanese apology terms" },
    { type: "translation", vietnamese: "Tôi xin lỗi vì đã làm vỡ cốc của bạn. Đó là do sơ suất của tôi.", japanese: "コップを割ってしまい申し訳ありません。私の不注意でした。" }
  ],
},
{
  id: 39,
  title: "Giving Advice",
  level: "B1",
  vocabulary: [
    { japanese: "アドバイス", english: "advice" },
    { japanese: "勧める", english: "to recommend" },
    { japanese: "忠告", english: "warning / admonition" },
    { japanese: "提案", english: "proposal" },
    { japanese: "助言", english: "suggestion" },
    { japanese: "役立つ", english: "useful" },
    { japanese: "経験談", english: "story of experience" },
    { japanese: "対策", english: "countermeasure" },
    { japanese: "～したらどうですか", english: "How about doing ~?" },
    { japanese: "～たほうがいい", english: "You'd better ~" }
  ],

  grammar: [
    { point: "～といいですよ", explanation: "It would be good if you ~ (advice)" },
    { point: "～したほうがいい", explanation: "You should ~ (stronger advice)" }
  ],

  examples: [
    { japanese: "早めに予約したほうがいいですよ。", english: "You should make a reservation early." },
    { japanese: "日本語の勉強にはアニメを見るといいですよ。", english: "For studying Japanese, it's good to watch anime." },
    { japanese: "一度専門家に相談してみてはいかがですか。", english: "How about consulting an expert?" },
    { japanese: "私の経験から言うと、無理をしないことです。", english: "From my experience, don't overdo it." },
    { japanese: "もっと休息を取ることをお勧めします。", english: "I recommend taking more rest." }
  ],

  dialogue: [
    { speaker: "A", japanese: "最近仕事が忙しくて疲れています。", english: "I've been busy with work lately and I'm tired." },
    { speaker: "B", japanese: "それは大変ですね。休暇を取ったらどうですか。", english: "That's tough. How about taking a vacation?" },
    { speaker: "A", japanese: "でも仕事が溜まっていて…", english: "But work is piling up..." },
    { speaker: "B", japanese: "一度リセットすることも大事ですよ。", english: "It's also important to reset once in a while." },
  ],

  exercises: [
    { type: "fill-blank", question: "もっと休息を___ことをお勧めします。", answer: "取る" },
    { type: "matching", pairs: [{ japanese: "忠告", english: "warning" }, { japanese: "助言", english: "advice" }],
 instruction: "Match the Japanese advice terms" },
    { type: "translation", vietnamese: "Tôi khuyên bạn nên học tiếng Nhật mỗi ngày một chút.", japanese: "毎日少しずつ日本語を勉強したほうがいいですよ。" }
  ],
},
{
  id: 40,
  title: "Describing Experiences",
  level: "B1",
  vocabulary: [
    { japanese: "経験", english: "experience" },
    { japanese: "体験", english: "hands-on experience" },
    { japanese: "印象", english: "impression" },
    { japanese: "感動する", english: "to be moved" },
    { japanese: "記憶", english: "memory" },
    { japanese: "思い出", english: "recollection" },
    { japanese: "詳細", english: "details" },
    { japanese: "語る", english: "to tell / narrate" },
    { japanese: "振り返る", english: "to look back" },
    { japanese: "貴重", english: "valuable" }
  ],

  grammar: [
    { point: "～たことがある", explanation: "have done ~ (experience)" },
    { point: "～時（とき）", explanation: "when / during the time of ~" }
  ],

  examples: [
    { japanese: "富士山に登ったことがありますか。", english: "Have you ever climbed Mt. Fuji?" },
    { japanese: "去年、日本に留学した時のことを話します。", english: "I'll talk about when I studied in Japan last year." },
    { japanese: "その経験は私にとって貴重なものでした。", english: "That experience was valuable to me." },
    { japanese: "初めての海外旅行はとても感動的でした。", english: "My first overseas trip was very moving." },
    { japanese: "子どもの頃の記憶をよく覚えています。", english: "I remember my childhood memories well." }
  ],

  dialogue: [
    { speaker: "A", japanese: "日本に行ったことがありますか。", english: "Have you ever been to Japan?" },
    { speaker: "B", japanese: "はい、二年前に旅行しました。", english: "Yes, I traveled there two years ago." },
    { speaker: "A", japanese: "どこが一番印象に残っていますか。", english: "What left the strongest impression?" },
    { speaker: "B", japanese: "京都の寺院がとても美しかったです。", english: "The temples in Kyoto were very beautiful." },
  ],

  exercises: [
    { type: "fill-blank", question: "その___は私にとって貴重でした。", answer: "経験" },
    { type: "matching", pairs: [{ japanese: "思い出", english: "memory" }, { japanese: "感動", english: "being moved" }],
 instruction: "Match the Japanese experience-related words" },
    { type: "translation", vietnamese: "Tôi chưa bao giờ ăn sushi ở Nhật Bản.", japanese: "日本でお寿司を食べたことがありません。" }
  ],
},
{
  id: 41,
  title: "Comparing Options",
  level: "B1",
  vocabulary: [
    { japanese: "比較する", english: "to compare" },
    { japanese: "選択", english: "choice" },
    { japanese: "違い", english: "difference" },
    { japanese: "共通点", english: "common point" },
    { japanese: "優れている", english: "superior" },
    { japanese: "劣る", english: "inferior" },
    { japanese: "同様に", english: "similarly" },
    { japanese: "一方で", english: "on the other hand" },
    { japanese: "どちらかと言えば", english: "if I had to choose" },
    { japanese: "対比", english: "contrast" }
  ],

  grammar: [
    { point: "～より～のほうが", explanation: "Compared to A, B is more ~" },
    { point: "～に比べて", explanation: "Compared to ~" }
  ],

  examples: [
    { japanese: "電車よりバスのほうが安いです。", english: "The bus is cheaper than the train." },
    { japanese: "A社とB社を比べてみましょう。", english: "Let's compare Company A and Company B." },
    { japanese: "両者には多くの共通点があります。", english: "Both have many common points." },
    { japanese: "品質ではA社が優れていますが、価格ではB社が劣ります。", english: "Company A is superior in quality, but Company B is inferior in price." },
    { japanese: "どちらかと言えば、私は都市より田舎が好きです。", english: "If I had to choose, I prefer the countryside over the city." }
  ],

  dialogue: [
    { speaker: "A", japanese: "この二つのスマホ、どちらがいいと思う？", english: "These two smartphones, which one do you think is better?" },
    { speaker: "B", japanese: "カメラの性能ではこちらのほうが優れているよ。", english: "In terms of camera performance, this one is superior." },
    { speaker: "A", japanese: "でもバッテリーはあっちのほうが長持ちするね。", english: "But the battery lasts longer on that one." },
    { speaker: "B", japanese: "そうだね。用途によって選ぶといいね。", english: "Yeah. It's good to choose based on usage." },
  ],

  exercises: [
    { type: "fill-blank", question: "電車___バスのほうが安いです。", answer: "より" },
    { type: "matching", pairs: [{ japanese: "比較", english: "comparison" }, { japanese: "対比", english: "contrast" }],
 instruction: "Match the Japanese comparison terms" },
    { type: "translation", vietnamese: "So với xe đạp, xe máy nhanh hơn nhưng đắt hơn.", japanese: "自転車に比べて、バイクのほうが速いですが高いです。" }
  ],
},
{
  id: 42,
  title: "Hypothetical Situations",
  level: "B1",
  vocabulary: [
    { japanese: "仮定", english: "assumption" },
    { japanese: "もし", english: "if" },
    { japanese: "条件", english: "condition" },
    { japanese: "可能性", english: "possibility" },
    { japanese: "～たら", english: "if (conditional)" },
    { japanese: "～ば", english: "if (conditional)" },
    { japanese: "～なら", english: "if (conditional)" },
    { japanese: "現実的", english: "realistic" },
    { japanese: "想像する", english: "to imagine" },
    { japanese: "願望", english: "desire" }
  ],

  grammar: [
    { point: "～たら、～のに", explanation: "If ~, then ~ (counterfactual wish)" },
    { point: "～ばいいのに", explanation: "I wish ~ would happen (if only)" }
  ],

  examples: [
    { japanese: "もし宝くじが当たったら、世界旅行をしたいです。", english: "If I won the lottery, I'd want to travel the world." },
    { japanese: "もっと時間があれば、もっと勉強できるのに。", english: "If I had more time, I could study more." },
    { japanese: "雨が降らなければ、ピクニックに行けたのに。", english: "If it hadn't rained, we could have gone on a picnic." },
    { japanese: "日本語がもっと上手なら、日本人と友達になれるのに。", english: "If I were better at Japanese, I could make friends with Japanese people." },
    { japanese: "彼が来ればいいのに。", english: "I wish he would come." }
  ],

  dialogue: [
    { speaker: "A", japanese: "もし一億円あったら、何をする？", english: "If you had 100 million yen, what would you do?" },
    { speaker: "B", japanese: "家を買って、世界旅行に行くかな。", english: "Maybe buy a house and travel the world." },
    { speaker: "A", japanese: "私は投資をして、将来のために使いたい。", english: "I'd invest and use it for the future." },
    { speaker: "B", japanese: "現実的だね。でも夢を見るのは楽しいね。", english: "You're realistic. But it's fun to dream." },
  ],

  exercises: [
    { type: "fill-blank", question: "もし時間が___、手伝ってあげられるのに。", answer: "あれば" },
    { type: "matching", pairs: [{ japanese: "仮定", english: "assumption" }, { japanese: "可能性", english: "possibility" }],
 instruction: "Match the Japanese hypothetical terms" },
    { type: "translation", vietnamese: "Nếu tôi biết sớm hơn, tôi đã có thể giúp bạn.", japanese: "もっと早く知っていれば、あなたを助けられたのに。" }
  ],
},
{
  id: 43,
  title: "Reporting Speech",
  level: "B1",
  vocabulary: [
    { japanese: "伝聞", english: "hearsay" },
    { japanese: "引用", english: "quotation" },
    { japanese: "～そうだ", english: "I heard that ~" },
    { japanese: "～と言う", english: "say that ~" },
    { japanese: "～と聞く", english: "hear that ~" },
    { japanese: "～と述べる", english: "state that ~" },
    { japanese: "～と説明する", english: "explain that ~" },
    { japanese: "～と報告する", english: "report that ~" },
    { japanese: "要約", english: "summary" },
    { japanese: "直接話法", english: "direct speech" }
  ],

  grammar: [
    { point: "～と言っている", explanation: "He/she says that ~ (reporting)" },
    { point: "～とのことだ", explanation: "I understand that ~ (hearsay, formal)" }
  ],

  examples: [
    { japanese: "彼は明日来ると言っていました。", english: "He said he would come tomorrow." },
    { japanese: "田中さんは来月結婚するそうです。", english: "I heard that Tanaka-san is getting married next month." },
    { japanese: "社長は新しいプロジェクトを始めると発表しました。", english: "The president announced that he would start a new project." },
    { japanese: "天気予報によると、明日は雨とのことです。", english: "According to the weather forecast, it will rain tomorrow." },
    { japanese: "彼女は「今日は忙しい」と言いました。", english: "She said, 'I'm busy today.'" }
  ],

  dialogue: [
    { speaker: "A", japanese: "山田さんが転職するって知ってる？", english: "Did you know Yamada-san is changing jobs?" },
    { speaker: "B", japanese: "えっ、本当？誰から聞いたの？", english: "What? Really? Who told you?" },
    { speaker: "A", japanese: "本人から直接聞いたんだ。来月から新しい会社だって。", english: "I heard it directly from him. He said he'll start at a new company next month." },
    { speaker: "B", japanese: "そうなんだ。ビックリした。", english: "I see. I'm surprised." },
  ],

  exercises: [
    { type: "fill-blank", question: "彼は今日は休むと___。", answer: "言っていました" },
    { type: "matching", pairs: [{ japanese: "伝聞", english: "hearsay" }, { japanese: "引用", english: "quotation" }],
 instruction: "Match the Japanese reporting terms" },
    { type: "translation", vietnamese: "Cô ấy nói rằng cô ấy sẽ đến muộn.", japanese: "彼女は遅れると言っていました。" }
  ],
},
{
  id: 44,
  title: "Passive Voice",
  level: "B1",
  vocabulary: [
    { japanese: "受身形", english: "passive voice" },
    { japanese: "作られる", english: "is made" },
    { japanese: "書かれる", english: "is written" },
    { japanese: "食べられる", english: "is eaten" },
    { japanese: "呼ばれる", english: "is called" },
    { japanese: "使われる", english: "is used" },
    { japanese: "建てられる", english: "is built" },
    { japanese: "知られる", english: "is known" },
    { japanese: "見られる", english: "is seen" },
    { japanese: "考えられる", english: "is considered" }
  ],

  grammar: [
    { point: "～（ら）れる", explanation: "Passive form (infinitive) – ru-verbs add られる, u-verbs change to ～れる" },
    { point: "～によって", explanation: "by (agent marker in passive)" }
  ],

  examples: [
    { japanese: "この寺は何世紀に建てられましたか。", english: "In what century was this temple built?" },
    { japanese: "日本のアニメは世界中で見られています。", english: "Japanese anime is watched all over the world." },
    { japanese: "この言葉はあまり使われません。", english: "This word is not used much." },
    { japanese: "その本は多くの人に読まれています。", english: "That book is read by many people." },
    { japanese: "彼はクラスで一番賢いと考えられています。", english: "He is considered the smartest in the class." }
  ],

  dialogue: [
    { speaker: "A", japanese: "このお寺はいつ建てられたんですか。", english: "When was this temple built?" },
    { speaker: "B", japanese: "八世紀に建てられたと言われています。", english: "It is said to have been built in the 8th century." },
    { speaker: "A", japanese: "へえ、そんなに古いんですね。", english: "Wow, that old, huh." },
    { speaker: "B", japanese: "はい、国の重要文化財に指定されています。", english: "Yes, it is designated as an Important Cultural Property." },
  ],

  exercises: [
    { type: "fill-blank", question: "この映画は多くの人に___。", answer: "見られています" },
    { type: "matching", pairs: [{ japanese: "作られる", english: "is made" }, { japanese: "使われる", english: "is used" }],
 instruction: "Match the Japanese passive forms" },
    { type: "translation", vietnamese: "Bức tranh này được vẽ bởi một họa sĩ nổi tiếng.", japanese: "この絵は有名な画家によって描かれました。" }
  ],
},
{
  id: 45,
  title: "Relative Clauses",
  level: "B1",
  vocabulary: [
    { japanese: "連体修飾節", english: "relative clause" },
    { japanese: "～がいる", english: "there is ~" },
    { japanese: "～という", english: "called/named ~" },
    { japanese: "場所", english: "place" },
    { japanese: "人", english: "person" },
    { japanese: "物", english: "thing" },
    { japanese: "こと", english: "event" },
    { japanese: "～をしている", english: "wearing / doing ~" },
    { japanese: "～だった", english: "was ~" },
    { japanese: "～な", english: "attribute (na-adj)" }
  ],

  grammar: [
    { point: "Noun + が/を/に + Verb + Noun (relative clause)", explanation: "A clause modifying a noun directly before it." },
    { point: "～ている + Noun", explanation: "Present continuous or state as modifier." }
  ],

  examples: [
    { japanese: "昨日食べたラーメンはとても美味しかった。", english: "The ramen I ate yesterday was very delicious." },
    { japanese: "あそこに立っている人は田中さんです。", english: "The person standing over there is Tanaka-san." },
    { japanese: "私が買いたい本はどこですか。", english: "Where is the book I want to buy?" },
    { japanese: "これは日本語の勉強に使うテキストです。", english: "This is the textbook used for studying Japanese." },
    { japanese: "彼女が作ったケーキを食べました。", english: "I ate the cake she made." }
  ],

  dialogue: [
    { speaker: "A", japanese: "あの赤いコートを着ている人は誰？", english: "Who is that person wearing the red coat?" },
    { speaker: "B", japanese: "ああ、彼女は私の高校の同級生です。", english: "Oh, she is my high school classmate." },
    { speaker: "A", japanese: "そうなんだ。彼女が話していた内容は面白かった？", english: "I see. Was the content she was talking about interesting?" },
    { speaker: "B", japanese: "うん、旅行の話だったよ。", english: "Yeah, it was about travel." },
  ],

  exercises: [
    { type: "fill-blank", question: "昨日___映画はとても感動的でした。", answer: "見た" },
    { type: "matching", pairs: [{ japanese: "連体修飾節", english: "relative clause" }, { japanese: "先行詞", english: "antecedent" }],
 instruction: "Match the Japanese grammar terms" },
    { type: "translation", vietnamese: "Người đang đọc sách kia là giáo viên của tôi.", japanese: "本を読んでいる人は私の先生です。" }
  ],
},
{
  id: 46,
  title: "Conditional Sentences",
  level: "B2",
  vocabulary: [
    { japanese: "条件文", english: "conditional sentence" },
    { japanese: "～ば", english: "if (conditional -ba form)" },
    { japanese: "～たら", english: "if (conditional -tara)" },
    { japanese: "～なら", english: "if (conditional -nara)" },
    { japanese: "～と", english: "when / if (natural consequence)" },
    { japanese: "仮定", english: "hypothesis" },
    { japanese: "結果", english: "result" },
    { japanese: "現実", english: "reality" },
    { japanese: "非現実", english: "unreal" },
    { japanese: "逆説", english: "paradox" }
  ],

  grammar: [
    { point: "～ば、～", explanation: "If (general condition) – ば form" },
    { point: "～たら、～", explanation: "If/When (specific condition) – たら form" },
    { point: "～なら、～", explanation: "If (topic condition) – なら form" }
  ],

  examples: [
    { japanese: "春になれば、桜が咲きます。", english: "If spring comes, cherry blossoms bloom." },
    { japanese: "東京に行ったら、スカイツリーに登りたい。", english: "If I go to Tokyo, I want to climb the Sky Tree." },
    { japanese: "勉強するなら、図書館のほうがいいです。", english: "If you study, the library is better." },
    { japanese: "このスイッチを押すと、ドアが開きます。", english: "If you press this switch, the door opens." },
    { japanese: "来週時間があったら、映画を見に行きませんか。", english: "If you have time next week, shall we go see a movie?" }
  ],

  dialogue: [
    { speaker: "A", japanese: "もし雨が降ったら、ピクニックは中止？", english: "If it rains, will the picnic be canceled?" },
    { speaker: "B", japanese: "そうですね。雨なら屋内でゲームをしましょう。", english: "Well, if it rains, let's play indoor games." },
    { speaker: "A", japanese: "晴れたら、何をする？", english: "If it's sunny, what will we do?" },
    { speaker: "B", japanese: "バーベキューをしようよ。", english: "Let's have a barbecue." },
  ],

  exercises: [
    { type: "fill-blank", question: "時間が___、手伝ってください。", answer: "あれば" },
    { type: "matching", pairs: [{ japanese: "～ば", english: "if (general)" }, { japanese: "～たら", english: "if (specific)" }],
 instruction: "Match the Japanese conditional forms with their usage" },
    { type: "translation", vietnamese: "Nếu tôi giàu, tôi sẽ mua một ngôi nhà lớn.", japanese: "お金持ちなら、大きな家を買います。" }
  ],
},
{
  id: 47,
  title: "Idiomatic Expressions",
  level: "B2",
  vocabulary: [
    { japanese: "慣用句", english: "idiomatic expression" },
    { japanese: "猫の手も借りたい", english: "very busy (lit. want even a cat's paw)" },
    { japanese: "猿も木から落ちる", english: "even experts make mistakes" },
    { japanese: "花より団子", english: "substance over style" },
    { japanese: "泣きっ面に蜂", english: "adding insult to injury" },
    { japanese: "石橋を叩いて渡る", english: "to be extremely cautious" },
    { japanese: "口が滑る", english: "to slip of the tongue" },
    { japanese: "足を引っ張る", english: "to hold someone back" },
    { japanese: "肩を持つ", english: "to take sides" },
    { japanese: "手を焼く", english: "to have trouble dealing with" }
  ],

  grammar: [
    { point: "～という意味", explanation: "It means ~ (explaining meaning)" },
    { point: "～で表す", explanation: "to express as ~" }
  ],

  examples: [
    { japanese: "今、猫の手も借りたいほど忙しい。", english: "I'm so busy I could use a cat's paw." },
    { japanese: "彼もあんなミスをするなんて、猿も木から落ちるね。", english: "Even he makes a mistake like that – even monkeys fall from trees." },
    { japanese: "値段より味のほうが大事だよ。花より団子だ。", english: "Taste is more important than price – substance over style." },
    { japanese: "事故った上に財布をなくした。泣きっ面に蜂だ。", english: "I had an accident and lost my wallet – adding insult to injury." },
    { japanese: "彼はいつも石橋を叩いて渡るタイプだ。", english: "He's the type to tap the stone bridge before crossing – very cautious." }
  ],

  dialogue: [
    { speaker: "A", japanese: "試験に落ちてしまった。しかも彼女に振られた。", english: "I failed the exam. And my girlfriend dumped me." },
    { speaker: "B", japanese: "泣きっ面に蜂だね。でも次があるさ。", english: "Adding insult to injury. But there will be a next time." },
    { speaker: "A", japanese: "そう言ってもらえると助かるよ。", english: "It helps to hear you say that." },
    { speaker: "B", japanese: "頑張って！石橋を叩いて渡るくらい慎重にね。", english: "Do your best! Be as cautious as tapping the stone bridge." },
  ],

  exercises: [
    { type: "fill-blank", question: "彼はいつも___。とても慎重な人だ。", answer: "石橋を叩いて渡る" },
    { type: "matching", pairs: [{ japanese: "猫の手も借りたい", english: "very busy" }, { japanese: "猿も木から落ちる", english: "even experts make mistakes" }],
 instruction: "Match the Japanese idioms with their meanings" },
    { type: "translation", vietnamese: "Anh ấy rất cẩn thận, giống như 'dò đá trước khi qua cầu' vậy.", japanese: "彼はとても慎重で、石橋を叩いて渡るような人です。" }
  ],
},
{
  id: 48,
  title: "Slang and Colloquial",
  level: "B2",
  vocabulary: [
    { japanese: "やばい", english: "awesome/bad (slang)" },
    { japanese: "めっちゃ", english: "very (slang)" },
    { japanese: "超", english: "super ~" },
    { japanese: "マジで", english: "seriously/for real" },
    { japanese: "すげえ", english: "amazing (slang)" },
    { japanese: "うざい", english: "annoying" },
    { japanese: "きもい", english: "gross/creepy" },
    { japanese: "だるい", english: "tiresome/lazy" },
    { japanese: "～じゃん", english: "isn't it? (colloquial)" },
    { japanese: "～てる", english: "contraction of ている" }
  ],

  grammar: [
    { point: "省略形", explanation: "Contractions in casual speech: してる→してる, てしまう→ちゃう, etc." },
    { point: "終助詞", explanation: "Sentence-ending particles like ね、よ、さ、etc., used for nuance." }
  ],

  examples: [
    { japanese: "このラーメン、めっちゃ美味しい！", english: "This ramen is super delicious!" },
    { japanese: "マジで？信じられない。", english: "Seriously? I can't believe it." },
    { japanese: "あの映画、やばかったよ。", english: "That movie was awesome / terrible. (context)" },
    { japanese: "宿題が多すぎてだるい。", english: "Too much homework, so tiresome." },
    { japanese: "今日、学校行ってないの？ – 行ってるよ。", english: "You didn't go to school today? – I did go." }
  ],

  dialogue: [
    { speaker: "A", japanese: "昨日のライブ、すげえ楽しかった！", english: "Yesterday's live concert was super fun!" },
    { speaker: "B", japanese: "え、マジ？行けばよかった。", english: "What, seriously? I wish I had gone." },
    { speaker: "A", japanese: "めっちゃ盛り上がったよ。次は一緒に行こう！", english: "It was super lively. Let's go together next time!" },
    { speaker: "B", japanese: "いいね。絶対行く！", english: "Sounds good. I'll definitely go!" },
  ],

  exercises: [
    { type: "fill-blank", question: "このゲーム、___面白い！", answer: "めっちゃ" },
    { type: "matching", pairs: [{ japanese: "やばい", english: "awesome/bad" }, { japanese: "うざい", english: "annoying" }],
 instruction: "Match the Japanese slang with their meanings" },
    { type: "translation", vietnamese: "Cái này thật tuyệt vời! (slang)", japanese: "これ、超やばい！" }
  ],
},
{
  id: 49,
  title: "Debating Skills",
  level: "B2",
  vocabulary: [
    { japanese: "討論", english: "debate" },
    { japanese: "論点", english: "argument point" },
    { japanese: "主張", english: "claim" },
    { japanese: "反論", english: "rebuttal" },
    { japanese: "立証", english: "proof" },
    { japanese: "データ", english: "data" },
    { japanese: "論理的", english: "logical" },
    { japanese: "感情論", english: "emotional argument" },
    { japanese: "妥協点", english: "common ground" },
    { japanese: "結論", english: "conclusion" }
  ],

  grammar: [
    { point: "～という理由で", explanation: "For the reason that ~" },
    { point: "～にもかかわらず", explanation: "Despite ~ / although" }
  ],

  examples: [
    { japanese: "第一に、コスト削減の観点から反対します。", english: "First, I oppose from a cost reduction perspective." },
    { japanese: "その主張にはデータの裏付けがありません。", english: "That claim has no data support." },
    { japanese: "感情論ではなく、論理的に話しましょう。", english: "Let's speak logically, not emotionally." },
    { japanese: "多くの反対意見にもかかわらず、この法案は可決されました。", english: "Despite much opposition, the bill was passed." },
    { japanese: "両者の妥協点を探すべきです。", english: "We should find common ground between both sides." }
  ],

  dialogue: [
    { speaker: "A", japanese: "私はリモートワークを推進すべきだと思います。", english: "I think we should promote remote work." },
    { speaker: "B", japanese: "しかし、チームのコミュニケーションが難しくなります。", english: "But team communication becomes difficult." },
    { speaker: "A", japanese: "オンラインツールを使えば解決できます。", english: "We can solve it with online tools." },
    { speaker: "B", japanese: "確かにそうですが、対面のメリットも無視できません。", english: "That's true, but we can't ignore the benefits of face-to-face." },
  ],

  exercises: [
    { type: "fill-blank", question: "その___には根拠がありません。", answer: "主張" },
    { type: "matching", pairs: [{ japanese: "反論", english: "rebuttal" }, { japanese: "妥協点", english: "common ground" }],
 instruction: "Match the Japanese debate terms" },
    { type: "translation", vietnamese: "Mặc dù có nhiều khó khăn, chúng ta vẫn phải tiếp tục.", japanese: "多くの困難にもかかわらず、続けなければなりません。" }
  ],
},
{
  id: 50,
  title: "Final Comprehensive Review",
  level: "B2",
  vocabulary: [
    { japanese: "復習", english: "review" },
    { japanese: "総合", english: "comprehensive" },
    { japanese: "応用", english: "application" },
    { japanese: "まとめる", english: "to summarize" },
    { japanese: "確認", english: "confirmation" },
    { japanese: "達成", english: "achievement" },
    { japanese: "成長", english: "growth" },
    { japanese: "目標", english: "goal" },
    { japanese: "挑戦", english: "challenge" },
    { japanese: "継続", english: "continuation" }
  ],

  grammar: [
    { point: "～を振り返って", explanation: "Looking back at ~" },
    { point: "～てきた", explanation: "Has been doing ~ up to now" }
  ],

  examples: [
    { japanese: "この一年間、日本語の勉強を続けてきました。", english: "I have continued studying Japanese this past year." },
    { japanese: "学んだことを実際の会話で使えるようになりました。", english: "I can now use what I learned in real conversations." },
    { japanese: "今までの復習をして、理解を深めましょう。", english: "Let's review what we've covered and deepen our understanding." },
    { japanese: "新しい目標を立てて、さらに上を目指しましょう。", english: "Set new goals and aim even higher." },
    { japanese: "日本語を学ぶ旅はまだ続きます。頑張りましょう！", english: "The journey of learning Japanese continues. Let's do our best!" }
  ],

  dialogue: [
    { speaker: "A", japanese: "このコースが終わりましたね。お疲れさまでした。", english: "This course is over. You've worked hard." },
    { speaker: "B", japanese: "ありがとうございます。本当にたくさんのことを学びました。", english: "Thank you. I really learned a lot." },
    { speaker: "A", japanese: "これからも日本語の勉強を続けますか。", english: "Will you continue studying Japanese from now on?" },
    { speaker: "B", japanese: "はい、もっと上達できるように頑張ります！", english: "Yes, I'll do my best to improve even more!" },
  ],

  exercises: [
    { type: "fill-blank", question: "今までの復習をして、___を深めましょう。", answer: "理解" },
    { type: "matching", pairs: [{ japanese: "達成", english: "achievement" }, { japanese: "挑戦", english: "challenge" }],
 instruction: "Match the Japanese review terms" },
    { type: "translation", vietnamese: "Tôi đã học tiếng Nhật được ba năm. Nhìn lại, tôi đã tiến bộ rất nhiều.", japanese: "日本語を三年間勉強してきました。振り返ると、とても上達しました。" }
  ],
},
{
  id: 51,
  title: "Telling your boss you're resigning",
  title_vi: "Nói với sếp về việc xin nghỉ việc",
  title_en: "Telling your boss you're resigning",
  category: "fluency",
  level: "B2",
  examples: [
    { japanese: "お忙しいところ恐れ入りますが、少しお時間をいただけませんでしょうか。", english: "I'm sorry to interrupt when you're busy — could I please have a moment of your time?" },
    { japanese: "退職のことで、ご相談させていただきたく存じます。", english: "I would humbly like to consult with you regarding my resignation." },
    { japanese: "三年間、本当にお世話になりました。", english: "For three years, I have truly been in your care. (set farewell phrase)" },
    { japanese: "後任の方への引き継ぎは責任を持って行います。", english: "I will take full responsibility for the handover to my successor." },
    { japanese: "皆様にご迷惑をおかけしますことを、深くお詫び申し上げます。", english: "I deeply apologize for the inconvenience this causes everyone." }
  ],
  vocabulary: [
    { japanese: "退職 (たいしょく)", english: "resignation / leaving a job" },
    { japanese: "退職届 (たいしょくとどけ)", english: "letter of resignation (handwritten, paper)" },
    { japanese: "お世話になりました", english: "thank you for your kindness (set farewell to colleagues / managers)" },
    { japanese: "申し訳ございません", english: "I am very sorry (kenjougo of すみません)" },
    { japanese: "引き継ぎ (ひきつぎ)", english: "handover / transition of duties" },
    { japanese: "後任 (こうにん)", english: "successor / replacement hire" },
    { japanese: "慰留 (いりゅう)", english: "persuasion to stay; the boss's counter-offer" },
    { japanese: "最終出勤日 (さいしゅうしゅっきんび)", english: "last working day" },
    { japanese: "～させていただきます", english: "humbly do — kenjougo construction for one's own action" },
    { japanese: "～ていただけませんでしょうか", english: "could I possibly ~? (maximum-polite request form)" }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "田中部長、退職のことで、ご相談させていただきたく存じます。", english: "Manager Tanaka, I would humbly like to consult with you regarding my resignation." },
    { speaker: "田中部長", japanese: "退職ですか。差し支えなければ、理由を聞かせてもらえますか。", english: "Resignation? If you don't mind, may I hear the reason?" },
    { speaker: "チャウ", japanese: "家族の事情で、ベトナムに戻ることになりました。", english: "Due to family circumstances, I've decided to return to Vietnam." },
    { speaker: "田中部長", japanese: "わかりました。立つ鳥跡を濁さず、引き継ぎを丁寧にお願いします。", english: "Understood. Please leave things in good order — handle the handover carefully." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "田中部長、お忙しいところ恐れ入ります。少しお時間をいただけませんでしょうか。", english: "Manager Tanaka, I'm sorry to bother you when you're busy. Could I please have a moment of your time?" },
    { speaker: "田中部長", japanese: "ああ、チャウさん、どうしました。座ってください。", english: "Ah, Chau-san, what is it? Please have a seat." },
    { speaker: "チャウ", japanese: "実は、退職のことで、ご相談させていただきたく存じます。", english: "Actually, I would humbly like to consult with you regarding my resignation." },
    { speaker: "田中部長", japanese: "退職ですか。それは突然ですね。差し支えなければ、理由を聞かせてもらえますか。", english: "Resignation? That's sudden. If you don't mind, may I hear the reason?" },
    { speaker: "チャウ", japanese: "はい。家族の事情で、ベトナムに戻ることになりました。", english: "Yes. Due to family circumstances, I've decided to return to Vietnam." },
    { speaker: "田中部長", japanese: "ご家族のためですか。決心は固いんですか。", english: "For your family? Is your decision firm?" },
    { speaker: "チャウ", japanese: "申し訳ございません。何度も考えましたが、これが最善だと思っております。", english: "I'm very sorry. I've thought about it many times, but I believe this is the best choice." },
    { speaker: "田中部長", japanese: "うちの会社で何か問題でも？腹を割って話してください。", english: "Is there some problem at our company? Please speak with complete honesty." },
    { speaker: "チャウ", japanese: "いえ、皆様には本当にお世話になりました。会社への不満ではございません。", english: "No, everyone has been so kind to me. This is not from any dissatisfaction with the company." },
    { speaker: "田中部長", japanese: "そうですか。給与や待遇の見直しも検討できますが、それでも難しいですか。", english: "I see. We could review your salary or working conditions. Even so, is it difficult?" },
    { speaker: "チャウ", japanese: "お気持ちはありがたく頂戴いたしますが、この件は譲ることができません。", english: "I gratefully accept your kindness, but on this matter I cannot bend." },
    { speaker: "田中部長", japanese: "わかりました。残念ですが、ご家族のことは尊重します。最終出勤日はいつをお考えですか。", english: "Understood. It's regrettable, but I respect your family situation. When are you thinking of as your last working day?" },
    { speaker: "チャウ", japanese: "二か月後を希望しております。引き継ぎ期間として十分かと存じます。", english: "I would like it to be two months from now. I believe that's enough time for the handover." },
    { speaker: "田中部長", japanese: "そうですね。後任の選定と教育に必要な時間です。立つ鳥跡を濁さず、丁寧にお願いします。", english: "Yes, that's the time needed to select and train a successor. Please leave things clean — don't muddy the water as you go." },
    { speaker: "チャウ", japanese: "もちろんでございます。三年間お世話になりました。石の上にも三年と申しますが、本当にいい経験をさせていただきました。", english: "Of course. You've taken care of me for three years. As they say, persistence pays off — it has truly been a wonderful experience for me." },
    { speaker: "田中部長", japanese: "こちらこそ、よく頑張ってくれました。退職届は来週までに人事部へ提出してください。", english: "On the contrary — you've worked very hard. Please submit your resignation letter to HR by next week." },
    { speaker: "チャウ", japanese: "承知いたしました。重ねてお礼申し上げます。", english: "Understood. Thank you again, sincerely." },
    { speaker: "田中部長", japanese: "送別会も計画しましょう。最後まで気持ちよく送り出したいですからね。", english: "Let's plan a farewell party too. I want to send you off properly, right to the end." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn xin nghỉ việc để về Việt Nam chăm sóc bố mẹ già. Sếp Nhật hỏi lý do — hãy giải thích lịch sự, dùng kenjougo (申し上げる, 存じる, させていただく). Mở đầu PHẢI bằng cụm xin thời gian, không nói thẳng 'tôi nghỉ'.",
    "Sếp đề nghị tăng lương 20% và đổi phòng ban để giữ bạn lại (慰留). Hãy từ chối khéo léo trong 3 lượt nói, vẫn giữ thiện cảm — dùng cụm 'お気持ちはありがたく頂戴いたしますが、この件は譲ることができません'. Không để cuộc thương lượng kéo dài quá 3 lượt.",
    "Bạn muốn nghỉ trong 1 tháng, sếp xin 3 tháng để tìm người thay thế. Thương lượng và đi đến thỏa thuận 2 tháng. Kết thúc bằng cam kết 'tatsu tori ato wo nigosazu' — bàn giao sạch sẽ, viết tài liệu hướng dẫn, đào tạo người kế nhiệm."
  ],
  register_notes: "Tiếng Nhật có ba tầng kính ngữ (敬語 keigo) — trong cuộc nói chuyện xin nghỉ này BẮT BUỘC dùng cả ba, và lẫn lộn sẽ làm hỏng cuộc nói chuyện trước cả khi nội dung được lắng nghe. (1) Teineigo (丁寧語) là dạng lịch sự cơ bản — kết câu bằng です/ます. Đây là sàn tối thiểu khi nói với sếp, không bao giờ tụt xuống plain form. (2) Sonkeigo (尊敬語) là dạng tôn kính dùng cho HÀNH ĐỘNG CỦA SẾP — nâng người nghe lên: いらっしゃる (đến/có mặt), おっしゃる (nói), ご検討ください (xin xem xét), なさる (làm). KHÔNG dùng sonkeigo cho hành động của chính mình — đó là tự đề cao, rất khiếm nhã. (3) Kenjougo (謙譲語) là dạng khiêm nhường dùng cho HÀNH ĐỘNG CỦA MÌNH — hạ mình xuống: 申し上げる (thưa/nói), 伺う (đến/hỏi), させていただく (xin được làm), 存じる (biết/nghĩ), 頂戴いたす (xin nhận). KHÔNG dùng kenjougo cho sếp — đó là hạ thấp người nghe. Nguyên tắc: teineigo làm nền, sonkeigo phủ lên hành động của sếp, kenjougo phủ lên hành động của mình. Khi xin nghỉ việc, cụm chuẩn 'させていただきたく存じます' là kenjougo bậc cao — gộp させていただく (xin được) với 存じる (nghĩ/biết khiêm nhường) — sếp Nhật mong đợi cụm này từ một nhân viên có ý thức trách nhiệm. Cụm 'お時間をいただけませんでしょうか' chồng ba lớp lịch sự (いただける + ません + でしょうか) để báo hiệu bạn biết mình đang làm phiền — đây là cách mở đầu chuẩn cho mọi cuộc nói chuyện khó.",
  idiom_glosses: [
    {
      idiom: "腹を割って話す",
      literal: "Mổ bụng ra mà nói chuyện",
      meaning: "Nói chuyện thẳng thắn, không che giấu, để mọi suy nghĩ thật lên bàn. Trong cuộc xin nghỉ, sếp dùng cụm này khi mời bạn nói thật lý do — không dùng để mở lời mà dùng để PHẢN ỨNG khi cảm thấy bạn đang giấu điều gì.",
      example: "うちの会社で何か問題でも？腹を割って話してください。"
    },
    {
      idiom: "石の上にも三年",
      literal: "Trên hòn đá cũng phải ba năm",
      meaning: "Kiên trì sẽ được đền đáp — ngồi trên đá lạnh ba năm thì đá cũng ấm. Dùng để thừa nhận quãng thời gian khó khăn nhưng có ý nghĩa, phù hợp khi nói lời cảm ơn về thời gian làm việc đã qua.",
      example: "三年間お世話になりました。石の上にも三年と申しますが、本当にいい経験をさせていただきました。"
    },
    {
      idiom: "立つ鳥跡を濁さず",
      literal: "Con chim bay đi không làm đục nước phía sau",
      meaning: "Khi rời đi phải để lại mọi thứ sạch sẽ, gọn gàng — không để rắc rối cho người ở lại. Đây là chuẩn mực đạo đức Nhật khi nghỉ việc: bàn giao đầy đủ, viết tài liệu, không nói xấu công ty, kết thúc êm đẹp. Sếp dùng cụm này để nhắc bạn về kỳ vọng văn hóa.",
      example: "立つ鳥跡を濁さず、丁寧に引き継ぎをお願いします。"
    },
    {
      idiom: "後足で砂をかける",
      literal: "Hất cát bằng chân sau",
      meaning: "Rời đi trong sự bất hòa, vong ơn — như con vật hất cát vào người vừa cho ăn. Đây là điều CẦN TRÁNH khi nghỉ việc: đừng nói xấu công ty cũ, đừng cãi nhau, đừng kéo đồng nghiệp đi theo mình. Giới làm việc Nhật rất nhỏ — tiếng xấu sẽ theo bạn cả đời nghề.",
      example: "辞めるときは後足で砂をかけるようなことをしてはいけない。"
    }
  ],
  cultural_notes_vi: "Người Nhật xem việc xin nghỉ là sự kiện trang trọng, KHÔNG phải giao dịch. Khác hẳn Việt Nam (nơi có thể nhắn tin báo sếp, nói qua điện thoại, hoặc báo trước 2 tuần), ở Nhật bạn PHẢI tuân thủ bảy quy tắc: (1) Xin một cuộc gặp riêng — không nói trong giờ họp, không nói khi sếp đang vội. Mở đầu bằng 'お忙しいところ恐れ入りますが、少しお時間をいただけませんでしょうか'. (2) Báo TRỰC TIẾP cho sếp TRƯỚC tiên, không báo đồng nghiệp trước. Nếu lộ ra ngoài qua người khác sẽ bị coi là phản bội niềm tin và làm sếp mất mặt. (3) Đưa thời gian bàn giao 2-3 tháng. Đưa 2 tuần như ở Việt Nam là KHÔNG ĐỦ — sẽ bị nhớ lâu trong nghề và ảnh hưởng đến reference cho công việc tiếp theo. (4) Nộp 退職届 (đơn xin nghỉ) bằng giấy, viết tay, đưa cho phòng nhân sự — không gửi email. Định dạng có sẵn, dùng từ chuẩn '一身上の都合により' (vì lý do cá nhân). (5) Cuộc nói chuyện đầu tiên KHÔNG được nói thẳng 'tôi nghỉ việc' — phải mở bằng cụm xin tham vấn ('ご相談させていただきたく…') để sếp có không gian phản hồi. Đây là 根回し (nemawashi) — chuẩn bị tâm lý cho người nghe trước khi đưa quyết định chính. (6) Nếu sếp đề nghị tăng lương để giữ bạn lại (慰留 iryuu), từ chối phải khéo: cảm ơn nhưng giữ vững quyết định, KHÔNG để cuộc thương lượng kéo dài qua nhiều buổi vì sẽ bị coi là mặc cả. Một lần từ chối là đủ; ba lần là quá. (7) Sau khi xin nghỉ, vẫn phải giữ thái độ chuyên nghiệp 100% đến ngày cuối. Nếu lười biếng tuần cuối, hoặc rút lui khỏi dự án, danh tiếng sẽ theo bạn cả đời — giới làm việc Nhật rất nhỏ, người ta sẽ hỏi tham khảo. Quy tắc 立つ鳥跡を濁さず áp dụng nghiêm ngặt. Khác biệt văn hóa lớn nhất với Việt Nam: ở VN nghỉ việc là chuyện cá nhân; ở Nhật nó là sự kiện ảnh hưởng đến cả nhóm, và cách bạn xử lý nó là báo cáo cuối cùng về tư cách của bạn.",
  tip_advice_vi: "Câu mở đầu KHÔNG được nói 'tôi muốn nghỉ việc'. Bắt đầu bằng 'お忙しいところ恐れ入りますが、少しお時間をいただけませんでしょうか' (Xin lỗi đã làm phiền lúc anh bận, em có thể xin một chút thời gian không?) — sau khi sếp đồng ý mới nói chuyện chính. Khi nói lý do, dùng '家族の事情' (lý do gia đình) hoặc 'キャリアの方向性' (định hướng nghề nghiệp) — đây là hai lý do được CHẤP NHẬN và không cần giải thích sâu. KHÔNG nói lý do tiêu cực về công ty (lương thấp, sếp khó chịu, đồng nghiệp xấu) dù có đúng — sẽ bị coi là vong ơn và làm khó cho người giới thiệu sau này. Khi từ chối lời đề nghị giữ lại, không nói 'いいえ' thẳng — dùng 'お気持ちはありがたく頂戴いたしますが、この件は譲ることができません' (Em xin trân trọng cảm ơn tấm lòng, nhưng việc này em không thể nhượng bộ). Câu PHẢI nói trong cuộc gặp: 'お世話になりました' (em đã được anh chị giúp đỡ rất nhiều) — nó là câu cảm ơn chính thức trong văn hóa Nhật, thiếu nó sẽ bị coi là vô lễ. Mẹo cuối cho người Việt: tập đọc to cụm 'させていただきたく存じます' và 'いただけませんでしょうか' nhiều lần trước cuộc gặp — phát âm sai một chữ trong cụm kính ngữ là rất dễ và sẽ phá hỏng ấn tượng trang trọng cần có.",
  exercises: [
    { type: "fill-blank", question: "退職のことで、ご相談___たく存じます。", answer: "させていただき" },
    { type: "matching", instruction: "Ghép mỗi tầng kính ngữ hoặc thành ngữ với ý nghĩa của nó.", pairs: [
      { japanese: "尊敬語", english: "tôn kính — nâng hành động của người nghe lên" },
      { japanese: "謙譲語", english: "khiêm nhường — hạ hành động của mình xuống" },
      { japanese: "丁寧語", english: "lịch sự cơ bản — dạng です/ます" },
      { japanese: "立つ鳥跡を濁さず", english: "rời đi sạch sẽ, không để lại rắc rối" }
    ] },
    { type: "translation", vietnamese: "Vì lý do gia đình, em xin được thôi việc. Ba năm qua em thực sự được anh chị giúp đỡ rất nhiều.", japanese: "家族の事情により、退職させていただきたく存じます。三年間、本当にお世話になりました。" }
  ]
},
{
  id: 52,
  title: "Job interview at a Japanese company",
  title_vi: "Phỏng vấn xin việc tại công ty Nhật",
  title_en: "Job interview at a Japanese company",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "面接 (めんせつ)", english: "job interview" },
    { japanese: "履歴書 (りれきしょ)", english: "résumé / CV (Japanese format with photo)" },
    { japanese: "職務経歴書 (しょくむけいれきしょ)", english: "work-history document (separate from résumé in Japan)" },
    { japanese: "志望動機 (しぼうどうき)", english: "motivation for applying (mandatory interview question)" },
    { japanese: "自己PR (じこピーアール)", english: "self-promotion / strengths pitch" },
    { japanese: "御社 (おんしゃ)", english: "your company (spoken — used by candidate to interviewer)" },
    { japanese: "貴社 (きしゃ)", english: "your company (written — used in cover letters)" },
    { japanese: "弊社 (へいしゃ)", english: "our company (humble — used by interviewer about own firm)" },
    { japanese: "内定 (ないてい)", english: "informal job offer (binding in practice)" },
    { japanese: "入社 (にゅうしゃ)", english: "joining the company / first day" }
  ],
  examples: [
    { japanese: "本日はお忙しいところ、貴重なお時間を頂戴し、誠にありがとうございます。", english: "Thank you sincerely for taking your valuable time today out of your busy schedule." },
    { japanese: "ベトナムのハノイ工科大学を卒業し、現在トヨタベトナムで品質管理を担当しております。", english: "I graduated from Hanoi University of Science and Technology and currently handle quality control at Toyota Vietnam." },
    { japanese: "御社のものづくりの精神に深く共感し、ぜひ貢献させていただきたく、応募いたしました。", english: "I deeply resonate with your company's monozukuri spirit, and I applied with the wish to contribute." },
    { japanese: "私の強みは、現場で課題を発見し、改善策まで落とし込む実行力でございます。", english: "My strength is execution — finding issues on the floor and following through to concrete countermeasures." },
    { japanese: "本日伺ったお話を踏まえ、改めて志望度が高まりました。引き続きよろしくお願い申し上げます。", english: "Based on what I heard today, my motivation has risen further. I respectfully ask for your continued consideration." }
  ],
  dialogue: [
    { speaker: "面接官", japanese: "本日はお越しいただき、ありがとうございます。まず自己紹介をお願いします。", english: "Thank you for coming today. First, please introduce yourself." },
    { speaker: "チャウ", japanese: "ベトナムから参りました、グエン・ティ・チャウと申します。本日はよろしくお願いいたします。", english: "I am Nguyen Thi Chau, from Vietnam. Thank you for having me today." },
    { speaker: "面接官", japanese: "弊社を志望された理由をお聞かせいただけますか。", english: "Could you tell us your reason for applying to our company?" },
    { speaker: "チャウ", japanese: "御社のベトナム工場での品質改善活動に深く共感したからでございます。", english: "It is because I deeply resonate with your company's quality-improvement activities at the Vietnam plant." }
  ],
  dialogue_long: [
    { speaker: "面接官", japanese: "本日はお越しいただき、ありがとうございます。まずは簡単に自己紹介をお願いいたします。", english: "Thank you for coming today. First, please give us a brief self-introduction." },
    { speaker: "チャウ", japanese: "本日はお忙しいところお時間を頂戴し、誠にありがとうございます。ベトナムから参りました、グエン・ティ・チャウと申します。ハノイ工科大学を卒業後、トヨタベトナムにて三年間、品質管理に従事しております。", english: "Thank you sincerely for your time today. I am Nguyen Thi Chau, from Vietnam. After graduating from Hanoi University of Science and Technology, I have worked in quality control at Toyota Vietnam for three years." },
    { speaker: "面接官", japanese: "ありがとうございます。それでは、当社を志望された動機を教えてください。", english: "Thank you. Now please tell us your motivation for applying to our company." },
    { speaker: "チャウ", japanese: "はい。御社が掲げる「現地・現物・現実」の三現主義に強く惹かれたためでございます。ベトナム工場での生産改善事例を拝読し、ぜひ本社で実際のものづくりを学びたいと考えました。", english: "Yes. I was strongly drawn to the genchi-genbutsu-genjitsu three-reality principle your company upholds. I read your improvement case studies from the Vietnam plant and wished to learn manufacturing first-hand at headquarters." },
    { speaker: "面接官", japanese: "なるほど。では、ご自身の強みと弱みをそれぞれ一つずつ教えていただけますか。", english: "I see. Could you tell us one strength and one weakness of yours?" },
    { speaker: "チャウ", japanese: "強みは、現場で課題を発見し、改善策の実行まで責任を持つ点でございます。弱みは、慎重に検討するあまり、判断にやや時間をかけてしまう傾向があることでございます。これは現在、優先順位を明確にすることで改善に努めております。", english: "My strength is finding issues on the floor and seeing improvements through to execution with full responsibility. My weakness is a tendency to take time on decisions due to careful deliberation; I am working on this by clarifying priorities." },
    { speaker: "面接官", japanese: "ベトナムから日本への赴任になりますが、生活面で不安はございませんか。", english: "This would mean relocating from Vietnam to Japan — do you have any concerns on the living side?" },
    { speaker: "チャウ", japanese: "覚悟はできております。学生時代に半年間、京都で交換留学を経験しており、日本の生活には一定の慣れがございます。家族の理解も得ております。", english: "I am prepared. I spent half a year on exchange in Kyoto as a student, so I have a degree of familiarity with life in Japan. I also have my family's understanding." },
    { speaker: "面接官", japanese: "失敗から学んだ経験について、具体的にお話しいただけますか。", english: "Could you give us a concrete story of something you learned from a failure?" },
    { speaker: "チャウ", japanese: "入社二年目の際、ライン停止の判断を遅らせた結果、不良品を多数流出させてしまいました。先輩の「七転び八起き」という言葉に支えられ、判断基準を文書化し、再発防止の標準作業書を作成いたしました。", english: "In my second year, I delayed a line-stop decision and let many defective parts through. Supported by my senior's words seven falls eight rises, I documented the decision criteria and created a standard work procedure to prevent recurrence." },
    { speaker: "面接官", japanese: "素晴らしい姿勢ですね。ご希望の年収はどのくらいでお考えですか。", english: "An excellent attitude. What is your desired annual salary?" },
    { speaker: "チャウ", japanese: "御社の規定に従わせていただきたく存じます。事前に拝見した募集要項の範囲内であれば、納得しております。", english: "I would humbly defer to your company's standard. If it falls within the range I saw in the posting, I am satisfied." },
    { speaker: "面接官", japanese: "わかりました。最後に、こちらから何かご質問はございますか。", english: "Understood. Finally — do you have any questions for us?" },
    { speaker: "チャウ", japanese: "二点ございます。一点目、入社後一年間の研修内容について教えていただけますでしょうか。二点目、ベトナム工場との連携プロジェクトに関わる機会はございますでしょうか。", english: "Two points. First, could you tell me about the first-year training content after joining? Second, are there opportunities to be involved in projects connecting to the Vietnam plant?" },
    { speaker: "面接官", japanese: "良いご質問ですね。研修は三ヶ月の集合研修と九ヶ月の現場OJTがございます。ベトナム連携案件も、入社二年目以降であれば希望を出せます。", english: "Good questions. Training is three months of group training plus nine months of on-the-job rotation. Vietnam-linked projects can be requested from your second year onward." },
    { speaker: "チャウ", japanese: "詳しくご説明いただき、ありがとうございます。本日伺ったお話で、より一層志望度が高まりました。", english: "Thank you for the detailed explanation. What I heard today raised my motivation further." },
    { speaker: "面接官", japanese: "こちらこそ、本日はありがとうございました。結果は一週間以内に人事部よりご連絡いたします。", english: "Thank you as well. HR will contact you with the result within one week." },
    { speaker: "チャウ", japanese: "承知いたしました。本日は誠にありがとうございました。引き続きよろしくお願い申し上げます。", english: "Understood. Thank you sincerely for today. I respectfully ask for your continued consideration." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn vừa bước vào phòng phỏng vấn. Hãy chào và tự giới thiệu trong 60 giây bằng kenjougo — bao gồm tên, trường, công ty hiện tại, và một câu chốt về lý do ứng tuyển. KHÔNG dùng casual form, KHÔNG nói desu kết câu cộc lốc.",
    "Người phỏng vấn hỏi naze nihon de hatarakitai no desu ka (sao bạn muốn làm việc ở Nhật?). Trả lời trong 90 giây — phải gắn với CỤ THỂ công ty này, không nói chung chung về thích văn hóa Nhật. Dùng cụm onsha no ni kyoukan shi và kouken sasete itadakitaku.",
    "Người phỏng vấn hỏi mức lương kỳ vọng (kibou nenshuu). Hãy trả lời mà KHÔNG đưa con số — dùng cụm onsha no kitei ni shitagawasete itadakitaku zonjimasu và xác nhận đã đọc range trong job posting. Đây là chuẩn mực Nhật cho fresh hire."
  ],
  register_notes: "Phỏng vấn ở Nhật yêu cầu kenjougo (謙譲語) đặc trưng nhất trong tất cả các tình huống công việc. Năm cụm bắt buộc thuộc lòng: (1) to moushimasu (tôi tên là) — kenjougo của 言う khi tự giới thiệu, KHÔNG dùng desu cho tên. (2) mairimashita (tôi đã đến) — kenjougo của 来る khi nói mình đã đến công ty. (3) sasete itadakitaku zonjimasu (xin được làm) — chồng させていただく cộng 存じる, dùng khi đề cập điều mình muốn làm. (4) chodai itashimasu (xin nhận) — kenjougo cao của もらう. (5) ukagaimasu (tôi đến/hỏi) — kenjougo của 行く và 聞く. Bên cạnh đó, đại từ chỉ công ty CỰC KỲ quan trọng: 御社 (onsha — nói) hoặc 貴社 (kisha — viết) cho công ty bên kia; 弊社 (heisha) cho công ty của mình (kể cả công ty cũ). Nhầm 御社 và 弊社 là lỗi cấp 0 — có thể loại ngay vòng phỏng vấn. // TODO: native review — go-kitei ni shitagawasete itadakitaku zonjimasu phrasing cho câu lương; có nguồn dùng o-makase itashimasu thay thế.",
  idiom_glosses: [
    { idiom: "一期一会", literal: "Một đời một lần gặp", meaning: "Mỗi cuộc gặp là duy nhất trong đời — phải dồn hết tâm sức như thể không có lần thứ hai. Dùng trong văn cảnh phỏng vấn để bày tỏ sự trân trọng cơ hội này; cũng là tinh thần omotenashi của trà đạo.", example: "本日のご面接を一期一会の機会と捉え、誠心誠意お話しさせていただきます。" },
    { idiom: "七転び八起き", literal: "Bảy lần ngã, tám lần đứng dậy", meaning: "Kiên cường — ngã bao nhiêu lần cũng đứng dậy thêm một lần. Cụm vàng để dùng khi kể chuyện thất bại trong phỏng vấn: thừa nhận thất bại nhưng cho thấy đã đứng dậy.", example: "失敗を経験するたびに、七転び八起きの精神で立ち上がってまいりました。" },
    { idiom: "千里の道も一歩から", literal: "Đường nghìn dặm cũng bắt đầu từ một bước", meaning: "Việc lớn bắt đầu từ bước nhỏ — bày tỏ sự khiêm tốn và sẵn sàng học từ đầu. Phù hợp khi nói về kế hoạch nghề nghiệp dài hạn ở công ty mới.", example: "千里の道も一歩からと申します。まずは現場でしっかりと学ばせていただきたく存じます。" },
    { idiom: "初心忘るべからず", literal: "Đừng quên tâm ban đầu", meaning: "Đừng quên động lực ban đầu khi mới bắt đầu — câu này từ Zeami (zen, kịch Noh). Trong phỏng vấn, dùng để cho thấy mình hiểu giá trị của sự bền bỉ với mục tiêu.", example: "入社後も初心忘るべからずの気持ちで、謙虚に学んでまいります。" }
  ],
  cultural_notes_vi: "Phỏng vấn ở công ty Nhật khác Việt Nam ở năm điểm cốt lõi. (1) THỜI ĐIỂM: đến SỚM 10 phút, KHÔNG sớm hơn (sớm hơn làm phiền lễ tân) và KHÔNG đúng giờ (đúng giờ ở Nhật là muộn). Vào sảnh, nói shamei no Nguyen to moushimasu, bu no Tanaka-sama to N-ji ni o-yakusoku wo itadaite orimasu với lễ tân. (2) NGOẠI HÌNH: vest đen hoặc xanh navy, áo trắng, tóc gọn, không nước hoa nồng. Phụ nữ tóc buộc, móng tay không sơn nổi. Đây không phải cá nhân hóa — đây là tín hiệu tôi hiểu chuẩn mực. (3) CHÀO HỎI VÀ GHẾ NGỒI: gõ cửa 3 lần (KHÔNG 2 lần — 2 lần là gõ toilet), đợi douzo, vào nói shitsurei itashimasu, đứng cạnh ghế cho đến khi được mời ngồi bằng o-kake kudasai. Túi đặt cạnh ghế trên sàn, không trên bàn. (4) NỘI DUNG: không nói tôi muốn học hỏi rồi rời đi — công ty Nhật trao tin tưởng thông qua giả định bạn ở lâu dài (shuushin koyou vẫn là tinh thần ngầm). Nói về 5 năm, 10 năm tới ở công ty này là điểm cộng, không phải red flag. (5) ĐẠI TỪ NHÂN XƯNG: tôi bằng watashi hoặc watakushi (formal hơn); KHÔNG dùng boku hoặc ore. Ngôi họ: ano kata lịch sự hơn ano hito. Khác biệt lớn với Việt Nam: ở VN người ta đánh giá kỹ năng và tính cách trong phỏng vấn; ở Nhật, 70 phần trăm đánh giá là VỀ CÁCH bạn nói (keigo, lễ tiết, ánh mắt) — tức là về văn hóa fit. Một ứng viên giỏi nhưng dùng sai keigo sẽ thua một ứng viên khá nhưng nhuần nhuyễn lễ tiết.",
  tip_advice_vi: "Tập THUỘC LÒNG cụm honjitsu wa o-isogashii tokoro o-jikan wo chodai shi, makoto ni arigatou gozaimasu — đây là câu mở đầu phổ quát, dùng được mọi tình huống công việc trang trọng (phỏng vấn, gặp khách hàng, gặp giáo sư). Khi nói tên, luôn nói to moushimasu KHÔNG desu. Khi nói lý do ứng tuyển, công thức: Câu cụ thể về công ty này (onsha no) cộng Câu kết nối với năng lực của bạn cộng Câu mong muốn đóng góp (kouken sasete itadakitaku). KHÔNG nói tôi muốn học — nghe như sinh viên thực tập, không phải fresh hire. Khi được hỏi điểm yếu, KHÔNG nói tôi không có điểm yếu (vô lễ) và KHÔNG nói điểm yếu chí mạng (lười, không đúng giờ). Công thức an toàn: điểm yếu nhỏ nhưng đang cải thiện. Khi không hiểu câu hỏi, dùng osore irimasu ga, mou ichido o-ukagai shite mo yoroshii deshou ka — KHÔNG nan desu ka. Cuối phỏng vấn, BẮT BUỘC có ít nhất một câu hỏi cho người phỏng vấn — không hỏi gì bằng không quan tâm bằng trượt. Sau phỏng vấn, gửi orei mail trong vòng 24 giờ — đây không phải tùy chọn, đây là chuẩn mực.",
  exercises: [
    { type: "fill-blank", question: "本日はお忙しいところ、貴重なお時間を___し、誠にありがとうございます。", answer: "頂戴" },
    { type: "matching", instruction: "Ghép mỗi đại từ nhân xưng công ty với cách dùng đúng.", pairs: [
      { japanese: "御社", english: "công ty bên kia (NÓI — phỏng vấn, điện thoại)" },
      { japanese: "貴社", english: "công ty bên kia (VIẾT — cover letter, email)" },
      { japanese: "弊社", english: "công ty của mình (khiêm nhường — kể cả công ty cũ)" },
      { japanese: "当社", english: "công ty của mình (nội bộ, không khiêm nhường — sếp dùng với nhân viên)" }
    ] },
    { type: "translation", vietnamese: "Em rất đồng cảm với tinh thần monozukuri của quý công ty và xin được đóng góp.", japanese: "御社のものづくりの精神に深く共感し、ぜひ貢献させていただきたく存じます。" }
  ]
},
{
  id: 53,
  title: "MEXT scholarship interview",
  title_vi: "Phỏng vấn học bổng MEXT",
  title_en: "MEXT scholarship interview",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "国費留学生 (こくひりゅうがくせい)", english: "MEXT-funded foreign student" },
    { japanese: "研究計画書 (けんきゅうけいかくしょ)", english: "research-plan document (heart of MEXT app)" },
    { japanese: "指導教官 (しどうきょうかん)", english: "supervising professor" },
    { japanese: "研究室 (けんきゅうしつ)", english: "research lab (the unit, not the room)" },
    { japanese: "修士課程 (しゅうしかてい)", english: "master's program" },
    { japanese: "博士課程 (はかせかてい)", english: "doctoral program" },
    { japanese: "学位 (がくい)", english: "academic degree" },
    { japanese: "教鞭を執る (きょうべんをとる)", english: "to teach (literary — used in formal aspirations)" },
    { japanese: "後進の育成 (こうしんのいくせい)", english: "nurturing future generations (signals giving back)" },
    { japanese: "研鑽を積む (けんさんをつむ)", english: "to accumulate diligent study (set phrase for academic effort)" }
  ],
  examples: [
    { japanese: "本日は面接の機会をいただき、誠にありがとうございます。", english: "Thank you sincerely for the opportunity of this interview today." },
    { japanese: "ベトナムにおける環境工学の発展に、日本の知見を持ち帰りたいと考えております。", english: "I wish to bring back Japanese expertise to advance environmental engineering in Vietnam." },
    { japanese: "京都大学の山田研究室で、水質浄化の研究を希望しております。", english: "I wish to pursue water-purification research at Professor Yamada's lab at Kyoto University." },
    { japanese: "帰国後は、ハノイ工科大学で教鞭を執り、後進の育成に尽力したく存じます。", english: "After returning, I humbly wish to teach at Hanoi University of Science and Technology and devote myself to nurturing the next generation." },
    { japanese: "学問に王道なしと申しますが、日本での三年間、研鑽を積む覚悟でおります。", english: "As they say, there is no royal road to learning — I am prepared to apply myself diligently for three years in Japan." }
  ],
  dialogue: [
    { speaker: "面接官", japanese: "それでは、研究計画について、簡潔にお話しください。", english: "Now, please briefly tell us about your research plan." },
    { speaker: "チャウ", japanese: "はい。京都大学で水質浄化技術の研究を希望しております。", english: "Yes. I wish to research water-purification technology at Kyoto University." },
    { speaker: "面接官", japanese: "なぜ日本で、その研究をしたいのですか。", english: "Why do you want to do that research in Japan, specifically?" },
    { speaker: "チャウ", japanese: "山田教授の論文を拝読し、ぜひご指導を仰ぎたいと考えたためでございます。", english: "Because I read Professor Yamada's papers and wish to seek his guidance." }
  ],
  dialogue_long: [
    { speaker: "面接官", japanese: "本日はお越しいただき、ありがとうございます。まずはご自身について、簡単にお話しください。", english: "Thank you for coming today. First, please tell us briefly about yourself." },
    { speaker: "チャウ", japanese: "本日は面接の機会をいただき、誠にありがとうございます。グエン・ティ・チャウと申します。ハノイ工科大学環境工学科を本年三月に卒業予定でございます。", english: "Thank you sincerely for this interview opportunity. I am Nguyen Thi Chau. I will graduate from the Department of Environmental Engineering at Hanoi University of Science and Technology this March." },
    { speaker: "面接官", japanese: "なぜ日本への留学を希望されたのですか。", english: "Why do you wish to study in Japan?" },
    { speaker: "チャウ", japanese: "日本は水処理技術の世界的先進国であり、特に京都大学の山田研究室は膜分離技術の研究で著名でございます。ベトナムのメコンデルタが直面する塩害問題に、この技術を応用したいと考えたためでございます。", english: "Japan is a world leader in water-treatment technology, and Professor Yamada's lab at Kyoto University is renowned for membrane-separation research. I wish to apply this technology to the salinization problem facing Vietnam's Mekong Delta." },
    { speaker: "面接官", japanese: "他の国、例えばアメリカやドイツでも同様の研究はできますね。なぜ日本なのでしょうか。", english: "Similar research is available in the US or Germany. Why specifically Japan?" },
    { speaker: "チャウ", japanese: "三点ございます。一つ目、日本は東南アジアの気候条件と類似する研究蓄積がございます。二つ目、山田教授がベトナムでの実証実験経験をお持ちでございます。三つ目、温故知新の精神で、日本の伝統的な水管理技術にも学ぶことが多いと考えております。", english: "Three reasons. First, Japan has research accumulated under climate conditions similar to Southeast Asia's. Second, Professor Yamada has experience with field experiments in Vietnam. Third, in the spirit of learning the new through the old, I believe there is much to learn from Japan's traditional water-management techniques as well." },
    { speaker: "面接官", japanese: "山田教授とは既に連絡を取っていますか。", english: "Have you already contacted Professor Yamada?" },
    { speaker: "チャウ", japanese: "はい。三回メールでやり取りをさせていただき、研究計画についてもご助言をいただいております。受け入れの内諾もいただいております。", english: "Yes. I have exchanged three emails with him, received guidance on my research plan, and have his informal acceptance." },
    { speaker: "面接官", japanese: "素晴らしいですね。日本語のレベルはいかがですか。今日の面接はかなりお上手ですが。", english: "Excellent. How is your Japanese level? Today's interview is quite skilled." },
    { speaker: "チャウ", japanese: "恐れ入ります。日本語能力試験N2を取得しております。研究室での発表を想定し、現在N1合格に向けて学習を続けております。", english: "I am humbled. I hold JLPT N2. Anticipating presentations at the lab, I am currently studying toward N1." },
    { speaker: "面接官", japanese: "三年間の留学後、ベトナムに戻る計画ですか。それとも日本に残りたいですか。", english: "Do you plan to return to Vietnam after the three years, or do you want to stay in Japan?" },
    { speaker: "チャウ", japanese: "必ず帰国いたします。ハノイ工科大学で教鞭を執り、日本で学んだことをベトナムの後進に伝えることが私の使命でございます。これは奨学金をいただく上で、研究計画書にも明記しております。", english: "I will definitely return. Teaching at Hanoi University and conveying what I learned in Japan to Vietnam's next generation is my mission. I have stated this clearly in my research plan as part of the scholarship application." },
    { speaker: "面接官", japanese: "研究で困難に直面したとき、どう対応されますか。", english: "How will you cope when you face difficulty in your research?" },
    { speaker: "チャウ", japanese: "一人で抱え込まず、まず指導教官と先輩方に相談いたします。学問に王道なしと申しますが、研究室の知の蓄積を活用させていただくのが最善と考えております。", english: "Rather than carrying it alone, I will consult my supervisor and seniors first. As they say, there is no royal road to learning — the best path is to draw on the lab's accumulated knowledge." },
    { speaker: "面接官", japanese: "最後に、何かこちらにご質問はございますか。", english: "Finally, do you have any questions for us?" },
    { speaker: "チャウ", japanese: "一点ございます。採用後、日本到着前にオンラインで研究準備を進めることは可能でございますでしょうか。", english: "One question. After acceptance, would it be possible to begin research preparation online before arriving in Japan?" },
    { speaker: "面接官", japanese: "はい、可能です。受け入れ大学と相談いただければ進められます。本日はありがとうございました。", english: "Yes, it's possible. Coordinate with your host university. Thank you for today." },
    { speaker: "チャウ", japanese: "貴重なお時間を頂戴し、誠にありがとうございました。良いお返事をお待ちしております。", english: "Thank you sincerely for your precious time. I look forward to good news." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn trong phỏng vấn MEXT tại Đại sứ quán Nhật. Hãy trình bày kế hoạch nghiên cứu trong 3 phút — phải bao gồm: vấn đề ở Việt Nam, lý do chọn ĐH/giáo sư cụ thể, kế hoạch 3 năm, đóng góp sau khi về nước. Dùng cụm to kangaete orimasu và shitaku zonjimasu.",
    "Người phỏng vấn hỏi naze amerika ya doitsu dewa naku nihon na no ka (sao không phải Mỹ hay Đức?). Trả lời với 3 lý do CỤ THỂ — không nói chung tôi thích văn hóa Nhật. Dùng số đếm hitotsume futatsume mittsume để có cấu trúc rõ ràng.",
    "Người phỏng vấn lo bạn sẽ ở lại Nhật sau khi học xong (đây là red flag với MEXT — họ muốn bạn về nước). Hãy thuyết phục họ bạn sẽ về VN, đề cập nghĩa vụ với koushin no ikusei, gắn với research plan."
  ],
  register_notes: "Phỏng vấn MEXT khác phỏng vấn doanh nghiệp ở ba điểm về register. (1) ĐỘNG TỪ HÀN LÂM: dùng động từ tầng cao như haidoku suru (đọc — kenjougo của 読む), haiken suru (xem — kenjougo của 見る), aogu (xin — như go-shidou wo aogu), tamawaru (được trao — kenjougo cao của もらう). Đây là dấu hiệu bạn đã quen môi trường học thuật. (2) CỤM CỐ ĐỊNH HỌC THUẬT: kensan wo tsumu (tích lũy nghiên cứu), gakuon wo ukeru (nhận ơn giáo dục), kyouben wo toru (cầm bút giảng dạy) — những cụm này không dùng trong văn nói thường nhưng phải có trong phỏng vấn học bổng. (3) CHỈ TÊN GIÁO SƯ: sensei BẮT BUỘC, không bao giờ san với giáo sư. Khi nhắc đến research lab: kenkyuushitsu chứ không rabo (quá casual). Khi nói về luận văn: ronbun — không pe-pa-. Khác với phỏng vấn doanh nghiệp, MEXT panel ưa chuộng cách diễn đạt cổ điển/văn chương; trộn vào idiom kiểu onko chishin hoặc gakumon ni oudou nashi tăng điểm rõ rệt. // TODO: native review — naidaku wo itadaite orimasu phrasing for informal acceptance from prof; alt is uke-ire no shoudaku.",
  idiom_glosses: [
    { idiom: "学問に王道なし", literal: "Học vấn không có đường vương đạo", meaning: "Không có đường tắt trong học tập — phải đi từng bước. Cụm cổ điển từ Euclid (gốc Hy Lạp), được dịch sang tiếng Nhật và trở thành kinh điển trong giáo dục. Dùng để thừa nhận khó khăn của con đường học thuật.", example: "学問に王道なしと申しますが、三年間、地道に研鑽を積む覚悟でおります。" },
    { idiom: "温故知新", literal: "Ôn cũ biết mới", meaning: "Học từ quá khứ để hiểu hiện tại — gốc Khổng Tử, du nhập từ Trung Quốc. Trong nghiên cứu, dùng để bày tỏ lòng kính trọng với thành tựu trước và sự tiếp nối.", example: "山田教授の従来の研究を温故知新の精神で学ばせていただきたく存じます。" },
    { idiom: "三人寄れば文殊の知恵", literal: "Ba người tụ lại có trí tuệ Bồ Tát Văn Thù", meaning: "Ba cái đầu hơn một — trí tuệ tập thể vượt trí tuệ cá nhân. Phù hợp khi nói về làm việc nhóm trong lab, không khoe cá nhân.", example: "研究室の皆様と三人寄れば文殊の知恵で、課題を解決していきたいと存じます。" },
    { idiom: "井の中の蛙大海を知らず", literal: "Ếch trong giếng không biết biển lớn", meaning: "Người chỉ biết thế giới hẹp của mình thì không hiểu cái rộng lớn ngoài kia. Trong phỏng vấn học bổng, dùng để giải thích vì sao bạn cần đi du học — để thoát khỏi cái giếng của hiểu biết hiện tại.", example: "ベトナム国内に留まれば井の中の蛙となります。日本での経験を通じ、視野を広げたく存じます。" }
  ],
  cultural_notes_vi: "MEXT (文部科学省 — Bộ Giáo dục Nhật) xét cấp học bổng theo bốn tiêu chí, theo thứ tự ưu tiên: (1) RESEARCH PLAN cụ thể và khả thi — không phải GPA, không phải điểm tiếng Nhật. Một sinh viên N3 với research plan rõ ràng được ưu tiên hơn N1 với plan mơ hồ. Plan phải nêu vấn đề CỤ THỂ ở VN, lý do CHỌN CHÍNH XÁC giáo sư đó (đã đọc bài báo nào, lý thuyết nào ăn khớp), kế hoạch 3 năm chia theo học kỳ, output dự kiến (số bài báo, hội nghị). (2) KẾT NỐI TRƯỚC với giáo sư người Nhật — gửi email research proposal, đợi giáo sư trả lời tôi quan tâm, xin naidaku (informal acceptance). KHÔNG vào phỏng vấn mà chưa kết nối với prof — 90 phần trăm rớt. (3) LỜI HỨA VỀ NƯỚC: MEXT không muốn cấp tiền cho người sẽ ở lại Nhật. Phải giải thích RÕ RÀNG vai trò bạn sẽ đóng ở VN sau khi tốt nghiệp — giảng dạy, nghiên cứu, làm policy. (4) TIẾNG NHẬT: N2 là sàn để phỏng vấn được tiến hành bằng tiếng Nhật; N1 là điểm cộng, không bắt buộc. Khác biệt với học bổng phương Tây: MEXT KHÔNG đặt nặng research output cá nhân (publications, awards) — họ đặt nặng FIT với một lab cụ thể và CAM KẾT đóng góp lại cho VN. Không khoe khoang thành tích cá nhân; khoe sự khiêm nhường và sự kết nối với thế hệ trước-sau. Nếu bạn là người đầu tiên trong gia đình đi du học, hãy nói — đây là điểm cộng (story of nurturing potential).",
  tip_advice_vi: "Cá nhân hóa câu trả lời cho TỪNG giáo sư bạn nhắm. Trước phỏng vấn, đọc ít nhất 3 bài báo của giáo sư mục tiêu — không cần hiểu hết, nhưng phải biết tựa đề, abstract, và một câu hỏi cụ thể. Trong phỏng vấn, khi nhắc giáo sư, dùng sensei no XX ni kansuru ronbun wo haidoku shi (em đã đọc bài báo của thầy về XX). KHÔNG nói chung chung professor's work is excellent — panel phỏng vấn nhận ra trong 5 giây. Câu trả lời cho sao chọn Nhật phải có ít nhất MỘT yếu tố không thể thay thế bởi nước khác (cụ thể về môi trường học, phương pháp, lab, vị trí địa lý). Tiếng Nhật: chuẩn bị TUYỆT ĐỐI hai phần: (a) jiko shoukai 60 giây thuộc lòng (phát âm khớp metronome — đừng đứng đực ra giữa câu); (b) trình bày research plan 3 phút — chia thành vấn đề, phương pháp, đóng góp. Ngoài hai phần đó, có thể vận động chậm và xin shoushou o-machi kudasai khi cần nghĩ. Trang phục: vest đen đúng kiểu Nhật (box silhouette), tóc gọn, không đeo phụ kiện ngoài đồng hồ. Mang theo bản in research plan và transcript để lúc nhắc đến tiện chỉ. Email cảm ơn trong 24 giờ là BẮT BUỘC — sẽ được lưu trong hồ sơ.",
  exercises: [
    { type: "fill-blank", question: "山田教授の論文を___し、ぜひご指導を仰ぎたいと考えております。", answer: "拝読" },
    { type: "matching", instruction: "Ghép động từ học thuật kenjougo với nghĩa.", pairs: [
      { japanese: "拝読する", english: "đọc (kenjougo của 読む — dùng cho luận văn, sách của giáo sư)" },
      { japanese: "拝見する", english: "xem (kenjougo của 見る — dùng cho tài liệu, slide)" },
      { japanese: "仰ぐ", english: "xin/nhận (như ご指導を仰ぐ — xin sự chỉ dạy)" },
      { japanese: "賜る", english: "được trao (kenjougo cao của もらう — dùng với ơn lớn, học bổng)" }
    ] },
    { type: "translation", vietnamese: "Học vấn không có đường tắt — em đã sẵn sàng tích lũy nghiên cứu trong ba năm tại Nhật.", japanese: "学問に王道なしと申しますが、日本で三年間、研鑽を積む覚悟でおります。" }
  ]
},
{
  id: 54,
  title: "Discussing graduation thesis topic with professor",
  title_vi: "Thảo luận đề tài luận văn với giáo sư",
  title_en: "Discussing graduation thesis topic with professor",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "卒業研究 (そつぎょうけんきゅう)", english: "graduation research / undergraduate thesis" },
    { japanese: "テーマ", english: "topic / theme (research subject)" },
    { japanese: "先行研究 (せんこうけんきゅう)", english: "prior literature / precedent studies" },
    { japanese: "問題意識 (もんだいいしき)", english: "problem awareness — the why this matters core" },
    { japanese: "アプローチ", english: "approach / methodology" },
    { japanese: "ご指導 (ごしどう)", english: "guidance (sonkeigo for sensei's teaching)" },
    { japanese: "ゼミ", english: "seminar (small-group lab meeting)" },
    { japanese: "中間発表 (ちゅうかんはっぴょう)", english: "mid-progress presentation" },
    { japanese: "考察 (こうさつ)", english: "discussion / interpretation (thesis section)" },
    { japanese: "妥当性 (だとうせい)", english: "validity / appropriateness (of method or argument)" }
  ],
  examples: [
    { japanese: "卒業研究のテーマについて、ご相談させていただきたく存じます。", english: "I would humbly like to consult with you regarding my graduation-research topic." },
    { japanese: "現時点では、二つのテーマで迷っております。", english: "At present, I am torn between two topics." },
    { japanese: "先生のお考えをお聞かせいただけますでしょうか。", english: "Could I please hear your thinking on this?" },
    { japanese: "先行研究を整理した上で、改めてご報告に伺います。", english: "After organizing the prior literature, I will visit again to report." },
    { japanese: "ご指導のほど、何卒よろしくお願い申し上げます。", english: "I respectfully ask for your guidance." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "山田先生、卒業研究のことでご相談させていただきたく存じます。", english: "Professor Yamada, I would humbly like to consult with you about my graduation research." },
    { speaker: "山田先生", japanese: "ああ、グエンさん、どうぞ。今、考えているテーマはありますか。", english: "Ah, Nguyen-san, please. Do you have a topic in mind right now?" },
    { speaker: "チャウ", japanese: "はい、二つございます。一つは膜分離、もう一つは生物処理でございます。", english: "Yes, two. One is membrane separation, the other is biological treatment." },
    { speaker: "山田先生", japanese: "なるほど。それぞれの問題意識を聞かせてください。", english: "I see. Tell me the problem awareness behind each." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "山田先生、お忙しいところ恐れ入ります。卒業研究のテーマについて、ご相談させていただきたく、お時間を頂戴いたしました。", english: "Professor Yamada, sorry to disturb you when busy. I have requested time today to consult about my graduation-research topic." },
    { speaker: "山田先生", japanese: "はいはい、座ってください。テーマで迷っているんですか。", english: "Yes, yes, please sit. You're torn on the topic?" },
    { speaker: "チャウ", japanese: "はい。現時点では、二つのテーマで迷っております。一つ目は逆浸透膜による塩害水の浄化、二つ目は微生物による工業排水処理でございます。", english: "Yes. At present I am torn between two. First, salt-affected water purification using reverse-osmosis membranes; second, biological treatment of industrial wastewater using microorganisms." },
    { speaker: "山田先生", japanese: "両方ともうちの研究室の専門ですね。それぞれ、なぜ興味を持ったんですか。", english: "Both are our lab's specialties. Why are you drawn to each?" },
    { speaker: "チャウ", japanese: "膜分離は、ベトナムのメコンデルタの塩害が深刻化しており、実装可能な技術として注目しております。一方、生物処理はランニングコストが低く、地方の中小工場でも導入しやすい点に魅力を感じております。", english: "Membrane separation — the Mekong Delta salinization is worsening, and I see it as deployable technology. Biological treatment — its low running cost makes it adoptable even by small rural factories." },
    { speaker: "山田先生", japanese: "問題意識は両方とも明確ですね。先行研究はどのくらい読みましたか。", english: "Problem awareness is clear for both. How much prior literature have you read?" },
    { speaker: "チャウ", japanese: "膜分離につきましては、英語論文を二十本、日本語論文を五本、拝読いたしました。生物処理につきましては、まだ十本程度でございます。", english: "On membrane separation, I have read 20 English papers and 5 Japanese papers. On biological treatment, only about 10 so far." },
    { speaker: "山田先生", japanese: "正直に言ってくれてありがとう。先行研究の量だけで判断するわけじゃないけど、膜分離の方が準備が進んでいる感じはしますね。", english: "Thank you for being honest. We don't decide on prior-research volume alone, but membrane separation does feel further along in preparation." },
    { speaker: "チャウ", japanese: "はい。実は、もう一点ご相談がございます。膜分離の場合、実験装置は研究室にございますが、生物処理の場合、新たに微生物の培養設備が必要になるかと存じます。", english: "Yes. Actually, one more point — for membrane separation the experimental setup exists in the lab, but for biological treatment, new microbial culturing equipment may be needed." },
    { speaker: "山田先生", japanese: "それは大事な視点です。卒業研究は一年で形にしないといけないから、装置の有無は決め手の一つになりますね。", english: "That's an important angle. Since graduation research has to be shaped within a year, equipment availability is a deciding factor." },
    { speaker: "チャウ", japanese: "先生のお考えをお聞かせいただけますでしょうか。", english: "Could I please hear your thinking on this?" },
    { speaker: "山田先生", japanese: "私としては、膜分離をお勧めします。ベトナムでの実用化という出口も明確ですし、研究室の蓄積も活かせます。ただし、最終的に決めるのはあなたですよ。", english: "Personally, I recommend membrane separation. The path to practical use in Vietnam is clear, and you can leverage the lab's accumulated work. But the final decision is yours." },
    { speaker: "チャウ", japanese: "ありがとうございます。先生のご助言を踏まえ、もう少し考えさせていただいてもよろしいでしょうか。", english: "Thank you. May I take a little more time to think, based on your advice?" },
    { speaker: "山田先生", japanese: "もちろんです。来週のゼミまでに、研究計画書のドラフトを持ってきてください。一緒に磨きましょう。", english: "Of course. Please bring a draft research plan to next week's seminar. Let's polish it together." },
    { speaker: "チャウ", japanese: "承知いたしました。膜分離の方向で、先行研究の整理と研究目的の明確化を進めてまいります。中間発表までのスケジュールも、ドラフトに含めさせていただきます。", english: "Understood. I will proceed with membrane separation — organizing prior literature and clarifying research aims. I will include a schedule through to the mid-progress presentation in the draft." },
    { speaker: "山田先生", japanese: "良いですね。一つアドバイスを。問題意識は深く掘り下げて、研究目的は具体的に絞ること。これが卒業研究の鍵です。", english: "Good. One piece of advice — dig deep on problem awareness, but narrow research aims to something concrete. That's the key to a graduation thesis." },
    { speaker: "チャウ", japanese: "肝に銘じます。三人寄れば文殊の知恵と申しますので、ゼミでも先輩方からご助言をいただきながら進めてまいります。", english: "I will engrave that on my heart. As they say three heads are wiser than one, I'll progress while seeking advice from seniors at the seminar too." },
    { speaker: "山田先生", japanese: "頑張ってください。何かあればいつでも研究室に来てください。", english: "Do your best. If anything comes up, come to the lab any time." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn vào phòng giáo sư xin tư vấn đề tài. Bạn có 2 ý tưởng nhưng chưa biết chọn cái nào. Hãy trình bày trong 90 giây — phải có problem awareness cho cả hai và lý do bạn đang phân vân. Dùng cụm go-soudan sasete itadakitaku và o-kangae wo o-kikase itadakemasu deshou ka.",
    "Giáo sư khuyên bạn chọn đề tài A nhưng bạn nghiêng về B. Hãy bày tỏ sự cân nhắc lại MÀ KHÔNG bác lời khuyên — dùng go-jogen wo fumae, mou sukoshi kangaesasete itadaite mo yoroshii deshou ka. Tuyệt đối không nói ie watashi wa.",
    "Giáo sư hỏi bạn đã đọc bao nhiêu paper. Bạn mới đọc 5 cái nhưng định nói rất nhiều. Hãy nói THẬT — đây là lúc Honest Uncertainty quan trọng hơn impression management. Dùng shoujiki ni moushiagemasu to, mada gohon teido de gozaimasu và đề xuất kế hoạch đọc thêm."
  ],
  register_notes: "Khi nói chuyện với giáo sư về luận văn, register hơi khác phỏng vấn doanh nghiệp ở chỗ MỀM HƠN nhưng VẪN keigo đầy đủ. Năm điểm: (1) Gọi giáo sư bằng XX-sensei BẮT BUỘC — không anata, không yamada-san. Ngay cả khi giáo sư bảo gọi tên, vẫn giữ sensei. (2) Khi không đồng ý, KHÔNG dùng iie hay demo — dùng ossharu toori de gozaimasu ga, XX to iu kangae mo aru ka to zonjimasu (đúng như thầy nói, nhưng cũng có cách nghĩ là XX). (3) Khi xin tư vấn, ni tsuite, go-soudan sasete itadakitaku zonjimasu (về đó, em xin được tham vấn) — không dùng tasukete kudasai (giúp em). (4) Khi nhận lời khuyên, dùng kimo ni meijimasu (em sẽ khắc sâu) hoặc go-jogen wo fumaemashite (dựa trên lời khuyên của thầy) — KHÔNG wakarimashita đơn giản, hơi quá ngang. (5) Khi rời phòng, kichou na o-jikan wo chodai shi, arigatou gozaimashita và shitsurei itashimasu khi đóng cửa. Phong cách hội thoại với giáo sư cũng có sắc thái tự kiểm tra — nói to zonjimasu ga, ikaga deshou ka (em nghĩ vậy, nhưng thầy thấy thế nào?) thay vì khẳng định mạnh. Đây là cách thể hiện kohai đúng chuẩn.",
  idiom_glosses: [
    { idiom: "三人寄れば文殊の知恵", literal: "Ba người tụ lại có trí tuệ Bồ Tát Văn Thù", meaning: "Trí tuệ tập thể vượt cá nhân — Văn Thù là Bồ Tát của trí tuệ trong Phật giáo. Trong nghiên cứu, dùng để bày tỏ sự sẵn sàng học từ ゼミ và đồng môn.", example: "ゼミの皆様と三人寄れば文殊の知恵で、テーマを磨いてまいります。" },
    { idiom: "肝に銘じる", literal: "Khắc sâu vào gan", meaning: "Khắc cốt ghi tâm — tiếp nhận lời dạy với sự nghiêm túc tối đa. Câu chuẩn để đáp lời khuyên của giáo sư.", example: "先生のご助言を肝に銘じ、研究を進めてまいります。" },
    { idiom: "急がば回れ", literal: "Nếu vội thì đi vòng", meaning: "Vội vã thì hỏng việc — nên chọn con đường an toàn dù có vẻ chậm hơn. Phù hợp khi bàn về việc làm research carefully thay vì rush.", example: "急がば回れと申します。先行研究をしっかり読んでから方法を決めたく存じます。" },
    { idiom: "百聞は一見に如かず", literal: "Trăm nghe không bằng một thấy", meaning: "Tự mình quan sát hơn nghe người khác kể — phù hợp khi đề xuất đi field trip, làm thí nghiệm thực tế thay vì chỉ đọc paper.", example: "百聞は一見に如かずと申しますので、現地調査もぜひ計画したく存じます。" }
  ],
  cultural_notes_vi: "Trong văn hóa nghiên cứu Nhật, giáo sư là sensei theo nghĩa đầy đủ — không chỉ teacher, mà người sinh ra trước (saki ni umareta hito). Đây là khái niệm sempai/kouhai cấp đặc biệt. Khác với phương Tây nơi mqh giáo sư-sinh viên ngang hơn, ở Nhật: (1) BẠN ĐẾN giáo sư, không ngược lại. Đặt lịch qua email với chủ đề rõ ràng (ví dụ: go-soudan: sotsugyou kenkyuu te-ma ni tsuite), KHÔNG nhắn LINE/messenger. (2) Trước khi đến, chuẩn bị TÀI LIỆU cụ thể: research plan draft, danh sách paper đã đọc, câu hỏi cụ thể. Đến tay không bằng phí thời gian giáo sư bằng mất điểm. (3) Trong cuộc nói, giáo sư đặt câu hỏi và bạn TRẢ LỜI — đừng độc thoại 10 phút. Cấu trúc: bạn nói 1 phút, giáo sư phản hồi, bạn nói tiếp 1 phút, cycle. (4) KHÔNG cãi giáo sư trực diện. Nếu không đồng ý, chấp nhận lời khuyên trên bề mặt và đem về suy nghĩ — nếu vẫn muốn theo hướng khác, lần sau quay lại với LÝ DO MỚI và dữ liệu MỚI. (5) Sau cuộc gặp, gửi email cảm ơn trong 12 giờ — tóm tắt lời khuyên giáo sư đã cho và bước tiếp theo bạn sẽ làm. Đây không phải nghi thức — đây là cách giáo sư biết bạn ĐÃ NGHE. (6) Seminar (zemi) là nơi presentation hàng tuần. Đến muộn 5 phút bằng đến muộn nửa ngày — coi như xúc phạm cả lab. Khác biệt văn hóa với VN: ở VN sinh viên có thể coi giáo sư là người chỉ chấm điểm; ở Nhật, giáo sư là người sẽ viết suisenjou cho cả nghề nghiệp của bạn — quan hệ kéo dài 30-40 năm. Đầu tư vào quan hệ này cẩn thận hơn bất kỳ networking nào khác.",
  tip_advice_vi: "Trước khi đến phòng giáo sư, viết RA GIẤY 3 câu hỏi cụ thể bạn muốn được tư vấn. Đến tay không bằng không tôn trọng. Khi vào phòng, gõ cửa 3 lần, đợi hai hoặc douzo, vào nói o-isogashii tokoro osore irimasu, XX de gozaimasu (xin lỗi đã làm phiền lúc thầy bận, em là XX). KHÔNG ngồi cho đến khi được mời — đứng cạnh ghế, nói chủ đề, rồi o-kake shite mo yoroshii deshou ka. Khi giáo sư đưa lời khuyên, GHI CHÉP TRỰC TIẾP vào sổ. Nhật xem chuyện không ghi chép bằng không nghiêm túc. Nếu không nhớ kịp, xin itten, kakunin sasete itadaite mo yoroshii deshou ka và nhắc lại để xác nhận. Nếu không hiểu thuật ngữ giáo sư dùng, KHÔNG giả vờ hiểu — XX to iu kotoba, benkyou busoku de moushiwake gozaimasen. Oshiete itadakemasu deshou ka. Cuối cuộc gặp, TÓM TẮT lời khuyên trong 30 giây để xác nhận đã hiểu đúng: tsumari, XX to iu houkou de, XX made ni XX wo junbi suru to iu koto de yoroshii deshou ka. Đây là kỹ thuật fukushou chuẩn của Nhật. Sau cuộc gặp, trong vòng 12 giờ gửi email với 3 phần: (1) cảm ơn cụ thể, (2) tóm tắt lời khuyên, (3) bước tiếp theo và deadline tự đặt. Email này tích lũy thành profile bạn trong mắt giáo sư — sau 1 năm, profile này quyết định suisenjou bạn nhận được.",
  exercises: [
    { type: "fill-blank", question: "卒業研究のテーマについて、ご相談___たく存じます。", answer: "させていただき" },
    { type: "matching", instruction: "Ghép cụm phản hồi với nghĩa.", pairs: [
      { japanese: "肝に銘じます", english: "em sẽ khắc sâu (đáp lời khuyên giáo sư)" },
      { japanese: "ご助言を踏まえまして", english: "dựa trên lời khuyên của thầy" },
      { japanese: "おっしゃる通りでございます", english: "đúng như thầy nói (đồng ý lịch sự)" },
      { japanese: "もう少し考えさせていただきます", english: "em xin suy nghĩ thêm (không đồng ý ngay nhưng không bác)" }
    ] },
    { type: "translation", vietnamese: "Em đã đọc 20 bài báo về phương pháp này. Em xin được nghe ý kiến của thầy.", japanese: "この手法について、論文を二十本拝読いたしました。先生のお考えをお聞かせいただけますでしょうか。" }
  ]
},
{
  id: 55,
  title: "Negotiating internship terms",
  title_vi: "Đàm phán điều khoản thực tập",
  title_en: "Negotiating internship terms",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "インターンシップ", english: "internship" },
    { japanese: "受け入れ先 (うけいれさき)", english: "host company / receiving organization" },
    { japanese: "業務内容 (ぎょうむないよう)", english: "work content / scope of duties" },
    { japanese: "勤務時間 (きんむじかん)", english: "working hours" },
    { japanese: "報酬 (ほうしゅう)", english: "compensation / pay (often unpaid in Japan)" },
    { japanese: "交通費 (こうつうひ)", english: "transportation expenses" },
    { japanese: "守秘義務 (しゅひぎむ)", english: "non-disclosure obligation (NDA)" },
    { japanese: "メンター", english: "mentor (assigned supervisor during internship)" },
    { japanese: "成果物 (せいかぶつ)", english: "deliverable / output" },
    { japanese: "学業との両立 (がくぎょうとのりょうりつ)", english: "balance with studies (frame for declining over-work)" }
  ],
  examples: [
    { japanese: "インターンシップの件で、ご相談させていただきたく存じます。", english: "I would humbly like to consult about the internship matter." },
    { japanese: "期間について、可能でしたら二週間延長させていただけませんでしょうか。", english: "Regarding the period, if possible could I please be allowed to extend by two weeks?" },
    { japanese: "業務内容に関しまして、一点確認させていただきたい点がございます。", english: "Regarding the work content, there is one point I would like to confirm." },
    { japanese: "学業との両立を考慮し、週四日勤務を希望しております。", english: "Considering the balance with my studies, I hope for four-day-per-week attendance." },
    { japanese: "ご検討のほど、何卒よろしくお願い申し上げます。", english: "I respectfully ask for your consideration." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "人事の佐藤様、インターンシップの件で、一点ご相談がございます。", english: "Sato-san from HR, I have one point of consultation about the internship." },
    { speaker: "佐藤", japanese: "はい、どうしました。", english: "Yes, what is it?" },
    { speaker: "チャウ", japanese: "期間について、二週間の延長は可能でございますでしょうか。", english: "Regarding the period — would a two-week extension be possible?" },
    { speaker: "佐藤", japanese: "理由をお聞かせいただけますか。", english: "Could you tell me the reason?" }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "人事の佐藤様、お忙しいところ恐れ入ります。インターンシップの条件につきまして、ご相談させていただきたく存じます。", english: "Sato-san from HR, sorry to disturb you when busy. I would humbly like to consult about the internship terms." },
    { speaker: "佐藤", japanese: "はい、グエンさん、どうぞ。何点ありますか。", english: "Yes, Nguyen-san, please. How many points?" },
    { speaker: "チャウ", japanese: "三点ございます。期間、業務内容、勤務日数の三点でございます。順にお話しさせていただいてもよろしいでしょうか。", english: "Three points — period, work content, and number of working days. May I go through them in order?" },
    { speaker: "佐藤", japanese: "もちろんです。どうぞ。", english: "Of course. Please go ahead." },
    { speaker: "チャウ", japanese: "まず期間でございますが、当初は六週間と伺っておりました。可能でしたら、八週間に延長させていただけませんでしょうか。研究室の中間発表が八月末にございまして、その後の期間を有効活用したく存じます。", english: "First, the period — I was told initially six weeks. If possible, could it be extended to eight weeks? My lab's mid-progress presentation is end of August, and I'd like to use the period after that effectively." },
    { speaker: "佐藤", japanese: "なるほど、学業との関係ですね。受け入れ部署と確認しないといけませんが、おそらく可能だと思います。一旦持ち帰らせてください。", english: "I see, related to your studies. I'd need to check with the host department, but it should likely be possible. Let me take it back to discuss." },
    { speaker: "チャウ", japanese: "ありがとうございます。次に業務内容でございますが、求人票には「データ分析業務」とのみ記載されておりました。具体的にどのようなプロジェクトに関わらせていただくか、事前に伺ってもよろしいでしょうか。", english: "Thank you. Next, work content — the listing said only data analysis duties. May I ask in advance which specific project I'd be involved with?" },
    { speaker: "佐藤", japanese: "良い質問です。受け入れ部署のメンターから後ほどメールで詳細をお送りします。守秘義務契約を結んだ後で、もう少し踏み込んだ情報もお伝えできます。", english: "Good question. The mentor at the host department will email you details. After the NDA is signed, we can share more in-depth information." },
    { speaker: "チャウ", japanese: "承知いたしました。三点目、勤務日数でございます。求人票では週五日となっておりますが、学業との両立を考慮し、可能でしたら週四日勤務をご検討いただけませんでしょうか。", english: "Understood. Third point — working days. The listing says five days a week; considering balance with my studies, could you please consider four days a week if possible?" },
    { speaker: "佐藤", japanese: "週四日ですか。給与は日割りで計算されますが、それでもよろしいですか。", english: "Four days? Pay would be calculated pro-rated; is that still acceptable?" },
    { speaker: "チャウ", japanese: "はい、承知しております。学業を優先したく、その点は納得しております。", english: "Yes, I am aware. I want to prioritize my studies, so I am satisfied on that point." },
    { speaker: "佐藤", japanese: "わかりました。週四日でも、業務量を調整すれば対応可能だと思います。受け入れ部署と相談します。", english: "Understood. With four days, by adjusting workload it should still be workable. I'll discuss with the host department." },
    { speaker: "チャウ", japanese: "ありがとうございます。最後に、念のため一点確認させていただきたいのですが、インターンシップ修了後に成果物を学会発表に活用させていただくことは可能でございますでしょうか。", english: "Thank you. Lastly, just to confirm — after the internship, would it be possible to use the deliverables for academic conference presentation?" },
    { speaker: "佐藤", japanese: "それは守秘義務との兼ね合いですね。基本的には会社の許可が必要です。具体的に発表したい内容が決まったら、改めてご相談ください。", english: "That hinges on the NDA. In principle, company permission is required. When you have a specific topic in mind, please consult again." },
    { speaker: "チャウ", japanese: "承知いたしました。急がば回れと申しますので、慎重に進めさせていただきます。", english: "Understood. As they say, haste makes waste — I'll proceed carefully." },
    { speaker: "佐藤", japanese: "では、整理しますね。期間延長と週四日勤務、それから業務内容の事前共有。一週間以内に正式回答をいたします。", english: "Let me summarize — period extension, four-day work, and advance sharing of work content. I'll give a formal answer within a week." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。ご検討のほど、何卒よろしくお願い申し上げます。", english: "Thank you sincerely. I respectfully ask for your consideration." },
    { speaker: "佐藤", japanese: "こちらこそ。良いインターンシップになるよう、調整します。", english: "Likewise. I'll coordinate to make it a good internship." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn gọi điện cho phòng nhân sự công ty Nhật. Bạn muốn xin gia hạn internship 2 tuần. Hãy mở đầu cuộc nói chuyện với cụm o-isogashii tokoro osore irimasu, nêu lý do CỤ THỂ liên quan đến lịch học, và dùng go-kentou itadakemasen deshou ka khi đề xuất.",
    "Mentor giao bạn việc ngoài scope job description (làm việc của full-time staff). Hãy từ chối khéo trong 2-3 câu — bảo vệ việc cốt lõi mà không xúc phạm. Dùng o-yaku ni tatereba ureshii no desu ga, genzai XX no gyoumu ni shuuchuu sasete itadaite orimashite (em rất muốn giúp, nhưng hiện đang tập trung vào…).",
    "Sau internship, bạn muốn dùng dữ liệu cho luận văn tốt nghiệp. Hãy viết email xin phép — gồm: cảm ơn về internship, lý do dùng data, cam kết bảo mật (anonymize, no client name), thời gian bạn cần phản hồi. Tone trang trọng tối đa."
  ],
  register_notes: "Đàm phán internship khác đàm phán việc full-time ở chỗ vị thế của bạn YẾU HƠN — bạn là sinh viên xin cơ hội học, không phải candidate có giá trị thị trường. Vì vậy register cần MỀM hơn: (1) Mở đầu mỗi yêu cầu với kanou deshitara (nếu có thể) hoặc sashitsukae nakereba (nếu không phiền) — báo hiệu bạn hiểu đây là favor, không phải right. (2) Dùng sasete itadakemasen deshou ka (xin được làm không?) — đây là dạng yêu cầu lịch sự nhất, chồng させていただく cộng ません cộng でしょうか. (3) Khi giải thích lý do, ưu tiên gakugyou to no ryouritsu (cân bằng học) hơn lý do cá nhân — Nhật chấp nhận cao priorities học thuật. (4) KHÔNG nói về tiền/lương trừ khi họ hỏi trước — internship Nhật phần lớn không lương hoặc lương rất thấp, đòi hỏi compensation đầu tiên là red flag. (5) Khi đồng ý điều bất lợi (như pro-rated pay), nói shouchi shite orimasu (em hiểu) cộng nattoku shite orimasu (em chấp nhận) — không ii desu (cộc lốc). Khác với đàm phán salary B2 (nơi bạn có thể đẩy ngược pushback), với internship: nhận push back lần đầu bằng chấp nhận hoặc rút lui, KHÔNG đẩy lần hai. // TODO: native review — higari de keisan phrasing vs nissuu anbun.",
  idiom_glosses: [
    { idiom: "急がば回れ", literal: "Nếu vội thì đi vòng", meaning: "Vội vã thì hỏng việc — chọn đường an toàn dù chậm hơn. Phù hợp khi giải thích vì sao bạn không muốn rush một quyết định về internship.", example: "急がば回れと申します。慎重に契約内容を確認させていただきます。" },
    { idiom: "石橋を叩いて渡る", literal: "Gõ cầu đá rồi mới qua", meaning: "Cẩn thận đến mức gõ thử cả cầu đá để chắc chắn không sập — sự thận trọng tối đa. Dùng khi nói về việc đọc kỹ hợp đồng hoặc NDA.", example: "守秘義務契約は石橋を叩いて渡る思いで、慎重に確認させていただきます。" },
    { idiom: "二兎を追う者は一兎をも得ず", literal: "Người đuổi hai thỏ không bắt được con nào", meaning: "Tham nhiều thì mất hết — nên tập trung vào một mục tiêu. Dùng khi từ chối thêm việc ngoài scope ban đầu.", example: "二兎を追う者は一兎をも得ずと申しますので、まずは現在の業務に集中させていただきたく存じます。" },
    { idiom: "ご縁", literal: "Mối duyên (gắn kết bởi định mệnh)", meaning: "Khái niệm duyên đặc trưng của Nhật — sự kết nối có ý nghĩa mà không thể giải thích bằng lý trí. Dùng để diễn tả niềm trân trọng cơ hội internship.", example: "今回のインターンシップのご縁を大切にし、誠心誠意取り組ませていただきます。" }
  ],
  cultural_notes_vi: "Internship ở Nhật khác Việt Nam và phương Tây ở năm điểm. (1) THƯỜNG KHÔNG LƯƠNG hoặc lương thấp (3000-5000 yên/ngày bằng 500K-800K VND/ngày). Đây là opportunity to learn, không phải paid work. Đòi lương đầu tiên bằng mất cơ hội. (2) NGẮN — phổ biến 1-2 tuần (tanki intern), 1-3 tháng là dài (chouki intern). 6 tháng cộng là rất hiếm và thường có chuyển đổi sang full-time hire ngầm. (3) RẤT CHÍNH THỨC — bạn ký shuhi gimu keiyaku (NDA), tuân thủ giờ giấc tuyệt đối, mặc đồng phục/business casual, không ăn ở bàn làm việc, dọn cốc của mình, chào hỏi otsukaresama desu khi gặp đồng nghiệp. (4) NHIỆM VỤ THƯỜNG NHỎ — đừng kỳ vọng được giao project lớn. Bạn sẽ làm data entry, dịch tài liệu, phân tích reports đơn giản. Giá trị KHÔNG ở task quy mô — giá trị ở việc bạn được quan sát môi trường công ty Nhật bên trong. (5) CHUYỂN SANG NỘI ĐỊNH (naitei): nhiều internship có ẩn ý chuyển sang internship dẫn đến naitei. Nếu công ty thích bạn, mentor sẽ giới thiệu HR cho phỏng vấn full-time. Bạn cũng nên mượn cơ hội này để xem có muốn làm full-time không — không hứa hẹn ngầm nếu không chắc. Khác văn hóa với VN: ở VN internship thường freelance-style, đến lúc nào cũng được; ở Nhật, đến muộn 5 phút đầu tiên đã bị nhớ. Cuối ngày làm việc, viết nippou (báo cáo ngày) ngắn gửi mentor — không phải tùy chọn. Sau internship, gửi thư cảm ơn (oreijou) viết tay đến mentor và HR — đây là chuẩn mực Nhật, đừng bỏ qua dù coi là old school.",
  tip_advice_vi: "Trước internship, đọc trang web công ty 100 phần trăm — biết tên CEO, lịch sử thành lập, sản phẩm chính. Đến phỏng vấn/orientation mà không biết bằng không tôn trọng cơ hội. Mặc business casual ngày đầu (vest đen, áo trắng) — quan sát đồng nghiệp ngày 1-2 rồi điều chỉnh dần xuống smart casual nếu phù hợp. Đến SỚM 15 phút mỗi ngày, KHÔNG đến đúng giờ. Khi mentor chỉ việc, nghi chép NGAY, nhắc lại để xác nhận hiểu đúng (fukushou — tsumari, XX to iu ninshiki de yoroshii deshou ka). Nếu không hiểu task, hỏi NGAY — không tự đoán. Câu vàng: osore irimasu ga, XX ni tsuite mou ichido oshiete itadakemasu deshou ka. KHÔNG dùng smartphone trên bàn làm việc — kể cả check giờ. Để smartphone trong túi xách. Giờ ăn trưa: ăn cùng đồng nghiệp nếu được mời, nhưng nói ít hơn nghe — quan sát động lực nhóm. Nếu ăn một mình, đừng ngồi bàn của full-time staff. Cuối ngày, viết nippou (báo cáo ngắn) gửi mentor — 3 dòng: việc đã làm, kết quả, câu hỏi cho ngày mai. Cuối internship, viết oreijou BẰNG TAY (handwritten thank-you note) gửi mentor cộng HR — đây là dấu ấn cuối cùng, sẽ được chuyền tay xem trong công ty. Sau khi rời, giữ liên lạc bằng email vào dịp Tết Nhật (nenshi) và sinh nhật mentor — networking dài hạn ở Nhật bắt đầu từ những điểm chạm nhỏ này.",
  exercises: [
    { type: "fill-blank", question: "可能でしたら、二週間延長___ませんでしょうか。", answer: "させていただけ" },
    { type: "matching", instruction: "Ghép cụm yêu cầu lịch sự với mức độ.", pairs: [
      { japanese: "していただけますか", english: "lịch sự cơ bản (đồng nghiệp)" },
      { japanese: "していただけませんか", english: "lịch sự hơn (mentor / cấp trên gần)" },
      { japanese: "していただけませんでしょうか", english: "lịch sự cao (HR / sếp)" },
      { japanese: "させていただけませんでしょうか", english: "lịch sự cao nhất (xin được làm — internship/HR)" }
    ] },
    { type: "translation", vietnamese: "Cân nhắc việc cân bằng với học hành, em xin được làm việc 4 ngày một tuần.", japanese: "学業との両立を考慮し、週四日勤務を希望させていただきたく存じます。" }
  ]
},
{
  id: 56,
  title: "Email to study-abroad office about visa issues",
  title_vi: "Email gửi văn phòng du học về vấn đề visa",
  title_en: "Email to study-abroad office about visa issues",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "在留資格認定証明書 (ざいりゅうしかくにんていしょうめいしょ)", english: "Certificate of Eligibility (COE) — required for student visa" },
    { japanese: "国際交流課 (こくさいこうりゅうか)", english: "International Exchange Office" },
    { japanese: "件名 (けんめい)", english: "subject line (of email)" },
    { japanese: "ご担当者様 (ごたんとうしゃさま)", english: "[To the] person in charge (used when name unknown)" },
    { japanese: "進捗状況 (しんちょくじょうきょう)", english: "progress status" },
    { japanese: "ご教示 (ごきょうじ)", english: "instruction / informing me (sonkeigo)" },
    { japanese: "添付 (てんぷ)", english: "attachment (of file)" },
    { japanese: "重ねて (かさねて)", english: "again / repeatedly (used in thanks again)" },
    { japanese: "ご対応 (ごたいおう)", english: "your handling / response (sonkeigo)" },
    { japanese: "お力添え (おちからぞえ)", english: "your support / assistance (humble)" }
  ],
  examples: [
    { japanese: "件名:【お問い合わせ】在留資格認定証明書の発行遅延について", english: "Subject: [Inquiry] Regarding the delay in issuing the Certificate of Eligibility" },
    { japanese: "国際交流課 ご担当者様", english: "To the responsible staff member, International Exchange Office" },
    { japanese: "現在、ベトナムから来年四月の入学に向けて、在留資格の手続きを進めております。", english: "I am currently advancing residency-status procedures from Vietnam toward enrollment next April." },
    { japanese: "つきましては、現状の進捗状況をご教示いただけますでしょうか。", english: "Therefore, could you please inform me of the current progress status?" },
    { japanese: "ご多忙のところ恐縮ではございますが、何卒ご対応のほどよろしくお願い申し上げます。", english: "I am sorry to trouble you when busy, but I respectfully ask for your handling of this matter." }
  ],
  dialogue: [
    { speaker: "本人(独白)", japanese: "ビザの書類が三週間届かない。問い合わせメールを書こう。", english: "The visa document hasn't arrived for three weeks. Let me write an inquiry email. (internal monologue)" },
    { speaker: "本人(独白)", japanese: "件名を最初に明確にして、状況、依頼、感謝の順で書く。", english: "Subject line clear first, then situation, request, gratitude — in that order. (internal)" },
    { speaker: "本人(独白)", japanese: "添付ファイルは申請書のコピー。重さは1MB以内に。", english: "Attachment is a copy of the application form. Keep size under 1MB. (internal)" },
    { speaker: "本人(独白)", japanese: "返信が来なかったら一週間後に丁寧に再送する。", english: "If no reply comes, politely resend after a week. (internal)" }
  ],
  dialogue_long: [
    { speaker: "件名", japanese: "【お問い合わせ】在留資格認定証明書の発行状況について(Nguyen Thi Chau)", english: "Subject: [Inquiry] Regarding the issuance status of the Certificate of Eligibility (Nguyen Thi Chau)" },
    { speaker: "本文", japanese: "京都大学 国際交流課 ご担当者様", english: "Body: To the responsible staff member, International Exchange Office, Kyoto University" },
    { speaker: "本文", japanese: "突然のご連絡失礼いたします。", english: "Body: I apologize for the sudden contact." },
    { speaker: "本文", japanese: "二〇二六年四月入学予定の、ベトナム出身グエン・ティ・チャウと申します。学籍番号は2026-0123でございます。", english: "Body: I am Nguyen Thi Chau, from Vietnam, scheduled for April 2026 enrollment. Student ID is 2026-0123." },
    { speaker: "本文", japanese: "在留資格認定証明書の発行につきまして、お問い合わせがございます。", english: "Body: I have an inquiry regarding issuance of the Certificate of Eligibility." },
    { speaker: "本文", japanese: "貴校より申請手続きが完了したとのご連絡を一月十日に頂戴いたしました。その後三週間が経過しておりますが、現時点で証明書の発送のご連絡をいただいておりません。", english: "Body: I received notice from your university on January 10 that the application process was complete. Three weeks have since passed, and at present I have not received notice of the certificate's dispatch." },
    { speaker: "本文", japanese: "ベトナム大使館でのビザ申請に二週間程度を要するため、入学日までの猶予を考慮いたしますと、二月中旬までに証明書を受領する必要がございます。", english: "Body: Visa application at the Vietnamese embassy requires roughly two weeks; given the buffer until enrollment, I need to receive the certificate by mid-February." },
    { speaker: "本文", japanese: "つきましては、以下の二点につきまして、ご教示いただけますでしょうか。", english: "Body: Therefore, could you please inform me on the following two points?" },
    { speaker: "本文", japanese: "一、現時点での発行および発送の進捗状況", english: "Body: 1. Current status of issuance and dispatch" },
    { speaker: "本文", japanese: "二、想定される到着予定日", english: "Body: 2. Expected arrival date" },
    { speaker: "本文", japanese: "なお、こちらの不手際で何か不足書類等がございましたら、即座に対応いたしますので、併せてご教示いただけますと幸いでございます。", english: "Body: Also, if there is any documentation missing on my side, I will respond immediately, so I would be grateful to be informed of that as well." },
    { speaker: "本文", japanese: "添付ファイルにて、これまでにご提出した申請書類一覧を共有させていただきます。ご確認のほど、よろしくお願い申し上げます。", english: "Body: As attachment, I share a list of application documents submitted so far. I respectfully ask for your verification." },
    { speaker: "本文", japanese: "ご多忙のところ恐縮ではございますが、何卒ご対応のほどよろしくお願い申し上げます。", english: "Body: I am sorry to trouble you when busy, but I respectfully ask for your handling of this matter." },
    { speaker: "署名", japanese: "グエン・ティ・チャウ", english: "Signature: Nguyen Thi Chau" },
    { speaker: "署名", japanese: "二〇二六年四月入学予定 / 工学研究科環境工学専攻", english: "Signature: April 2026 enrollment / Graduate School of Engineering, Environmental Engineering" },
    { speaker: "署名", japanese: "メールアドレス: chau.nguyen@example.com", english: "Signature: Email: chau.nguyen@example.com" },
    { speaker: "署名", japanese: "電話番号(ベトナム):+84-90-1234-5678", english: "Signature: Phone (Vietnam): +84-90-1234-5678" }
  ],
  roleplay_prompts: [
    "Hãy viết email gửi kokusai kouryuu-ka báo bạn đã nhận được Certificate of Eligibility (CoE). Phải có: (1) chủ đề rõ, (2) cảm ơn cụ thể, (3) báo bước tiếp theo (đã đặt lịch phỏng vấn visa tại đại sứ quán), (4) câu hỏi nếu có. Tone trang trọng tối đa.",
    "Bạn nhận được email từ giáo sư hướng dẫn báo lab full, không thể nhận thêm sinh viên. Hãy viết email phản hồi xin gặp trao đổi — KHÔNG bác lời, KHÔNG van xin, đề xuất khả năng học kỳ sau hoặc lab khác trong cùng khoa.",
    "Giả sử bạn cần gửi email cho HR công ty Nhật xin hoãn ngày bắt đầu internship 2 tuần (do visa delay). Hãy viết email — bao gồm: lý do (visa), bằng chứng (số đơn nộp cộng ngày), đề xuất ngày mới, cam kết bù task thiếu hụt nếu có."
  ],
  register_notes: "Email tiếng Nhật trang trọng có cấu trúc cố định, lệch cấu trúc bằng bị coi là không tôn trọng. Bảy phần bắt buộc theo thứ tự: (1) kenmei (subject) phải có 【...】 prefix biểu thị loại email: o-toiawase (inquiry), go-houkoku (report), go-soudan (consultation), o-rei (thanks). Subject phải đủ ngắn (40 chữ), có tên bạn cuối nếu thuộc cá nhân. (2) Greeting: sama với người cụ thể, go-tantou-sha-sama nếu chưa biết tên. KHÔNG san trong email công việc. (3) totsuzen no go-renraku shitsurei itashimasu (xin lỗi đã bất ngờ liên hệ) — chuẩn cho lần đầu email, bỏ qua nếu đã trao đổi trước. (4) Tự giới thiệu lại MỖI EMAIL: tên cộng tư cách (sinh viên, công ty, năm). (5) Mục đích email — câu thứ ba từ trên xuống. (6) Nội dung: dùng đánh số ichi ni san hoặc dấu chấm tròn cho list. KHÔNG dùng emoji, KHÔNG dùng chấm than hoặc chấm hỏi. (7) Closing: nanitozo yoroshiku onegai moushiagemasu (formal cao nhất) hoặc yoroshiku onegai itashimasu (formal trung). Sau closing là shomei — tên cộng tư cách cộng contact info. Email không có shomei bằng không chuyên nghiệp. Văn phong động từ: dùng gozaimasu thay desu, itashimasu thay shimasu, sasete itadakimasu thay shimasu khi liên quan hành động của mình. Tránh omoimasu — quá yếu trong email business; dùng zonjimasu (kenjougo của 思う). // TODO: native review — futegiwa usage; some prefer kochira no kakunin more for milder tone.",
  idiom_glosses: [
    { idiom: "急がば回れ", literal: "Vội thì đi vòng", meaning: "Vội vã hỏng việc — trong email business dùng để giải thích vì sao bạn muốn chuẩn bị kỹ trước khi action.", example: "急がば回れと申しますので、念のため書類を再度ご確認いただけますと幸いでございます。" },
    { idiom: "言葉を選ぶ", literal: "Chọn từ ngữ", meaning: "Cẩn thận với cách diễn đạt — đặc biệt quan trọng trong email vì người nhận không thấy giọng nói. Câu này không phải để dùng trực tiếp, mà là nguyên tắc.", example: "メールでは言葉を選ぶ必要があるため、慎重に表現を確認いたします。" },
    { idiom: "ご多忙のところ恐縮ですが", literal: "Xin lỗi đã làm phiền lúc đang bận", meaning: "Cụm cố định mở đầu yêu cầu trong email business. Không phải idiom truyền thống nhưng là chuẩn mực không thể thiếu — bỏ qua bị coi là vô lễ.", example: "ご多忙のところ恐縮ではございますが、ご確認のほどお願い申し上げます。" },
    { idiom: "拝啓・敬具", literal: "Kính khải / Kính thượng", meaning: "Cụm mở-đóng cho thư trang trọng kiểu cũ (handwritten letter, formal business letter). Trong email thường KHÔNG dùng — quá cổ. Nhưng phải biết tồn tại để không bị shock khi nhận thư từ giáo sư già.", example: "拝啓 時下ますますご清祥のこととお慶び申し上げます。... 敬具" }
  ],
  cultural_notes_vi: "Email tiếng Nhật khác email phương Tây ở năm điểm. (1) ĐỘ DÀI: dài hơn — một email request đơn giản dễ thành 200-300 chữ. Gắn vào: chào hỏi, xin lỗi đã làm phiền, tự giới thiệu, lý do, request, cảm ơn, ký tên. KHÔNG cắt ngắn — bị coi là cộc lốc. (2) THỜI GIAN PHẢN HỒI: kỳ vọng phản hồi trong 24 giờ vào ngày làm việc, không bao giờ vào tối/cuối tuần. Nếu bạn cần thời gian, gửi email ittan go-renraku made (gửi tạm) trong 4 giờ và phản hồi đầy đủ sau. (3) CHỦ ĐỀ EMAIL: phải cực kỳ rõ. o-toiawase, go-soudan, go-houkoku prefix là chuẩn — giúp người nhận filter inbox. KHÔNG có prefix bằng email yếu. Cuối subject thêm tên bạn (Nguyen Thi Chau) để nhận diện ngay. (4) TỪ XƯNG HÔ: watashi trong email professional, watakushi formal hơn cho email gửi giáo sư già/CEO. KHÔNG boku hoặc ore. Khi nhắc đến công ty/trường mình: heisha, shoushoku (humble). Bên kia: kisha (viết), kidaigaku (quy đại học). (5) CC/BCC: dùng cẩn thận. CC sếp của bạn vào email phàn nàn bằng leo thang xung đột; ở Nhật điều này được coi là khiêu khích. Chỉ CC khi có lý do procedural (như HR cần thấy email request). Khác biệt với VN: ở VN email business thường ngắn, prompt; ở Nhật, email NGẮN bị coi là không quan trọng đối với người gửi. Đầu tư thời gian viết email bằng dấu hiệu bạn coi trọng quan hệ. Mẹo: nếu phải gửi email khó (apology, complaint, bad news), viết draft, để 2 tiếng, đọc lại, gửi. Nhật cực kỳ nhạy với tone email; một câu khó nghe sẽ được nhớ rất lâu.",
  tip_advice_vi: "Cài subject template trong inbox để không quên prefix. Bốn subject phổ biến nhất: o-toiawase (hỏi), go-houkoku (báo cáo kết quả), go-soudan (xin tư vấn), o-rei (cảm ơn sau cuộc gặp). Nếu là phản hồi (Re:), giữ Re: nguyên — đừng đổi subject. Khi viết email, mở đầu LUÔN bằng tự giới thiệu lại — kể cả với người bạn đã email 10 lần, vì họ có thể không nhớ context giữa nhiều inbox. Khi list nhiều điểm, dùng đánh số ichi ni san hoặc bullet — KHÔNG dùng số Latin trong email Nhật trang trọng. Khi attach file, đặt tên file rõ ràng kiểu 20260204_NguyenThiChau_shinseishorui_ichiran.pdf — file IMG_001.jpg bị xem là không chuyên nghiệp. Closing: nếu không chắc dùng gì, mặc định nanitozo yoroshiku onegai moushiagemasu — luôn an toàn. Sau khi gửi email quan trọng, KHÔNG nhắc/follow up trong 48 giờ — Nhật không thích bị giục. Sau 1 tuần không phản hồi, gửi follow up RẤT NHẸ NHÀNG: nen no tame, XX ni tsuite no go-renraku wo saisou sasete itadakimasu. Nếu vẫn không phản hồi sau 2 tuần, gọi điện thay vì gửi email lần ba. Mẹo cuối: nếu sai sót đã gửi (sai tên, sai số, sai file), gửi email correction NGAY trong 30 phút với subject 【teisei】XX no ken ni tsuite — không đợi người ta phát hiện. Nhanh chóng correct bằng chuyên nghiệp; im lặng bằng không tôn trọng.",
  exercises: [
    { type: "fill-blank", question: "ご多忙のところ恐縮ではございますが、何卒ご対応のほど___申し上げます。", answer: "よろしくお願い" },
    { type: "matching", instruction: "Ghép subject prefix với loại email.", pairs: [
      { japanese: "【お問い合わせ】", english: "Inquiry — hỏi thông tin / status" },
      { japanese: "【ご報告】", english: "Report — báo cáo kết quả / cập nhật" },
      { japanese: "【ご相談】", english: "Consultation — xin tư vấn / lời khuyên" },
      { japanese: "【お礼】", english: "Thanks — cảm ơn sau cuộc gặp / sự giúp đỡ" }
    ] },
    { type: "translation", vietnamese: "Em xin được hỏi tình trạng phát hành Certificate of Eligibility hiện tại.", japanese: "在留資格認定証明書の現時点での発行状況について、ご教示いただけますでしょうか。" }
  ]
},
{
  id: 57,
  title: "Phone interview from Vietnam to Japanese employer",
  title_vi: "Phỏng vấn qua điện thoại từ Việt Nam với công ty Nhật",
  title_en: "Phone interview from Vietnam to Japanese employer",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "電話面接 (でんわめんせつ)", english: "phone interview" },
    { japanese: "オンライン面接 (オンラインめんせつ)", english: "online (video) interview" },
    { japanese: "音声 (おんせい)", english: "audio / voice" },
    { japanese: "聞き取りにくい (ききとりにくい)", english: "hard to make out (audio)" },
    { japanese: "時差 (じさ)", english: "time difference (Japan-Vietnam: Japan +2 hours)" },
    { japanese: "都合 (つごう)", english: "convenience / availability" },
    { japanese: "電波 (でんぱ)", english: "signal / reception" },
    { japanese: "切れる (きれる)", english: "to be cut off (call dropping)" },
    { japanese: "おかけ直し (おかけなおし)", english: "calling back (you re-call them)" },
    { japanese: "折り返し (おりかえし)", english: "callback (they call you back)" }
  ],
  examples: [
    { japanese: "お電話ありがとうございます。グエン・ティ・チャウでございます。", english: "Thank you for your call. This is Nguyen Thi Chau speaking." },
    { japanese: "お時間を頂戴し、誠にありがとうございます。", english: "Thank you sincerely for granting me your time." },
    { japanese: "恐れ入りますが、お電話の音声が少し聞き取りにくいようでございます。", english: "I am sorry, but the audio of your call seems slightly hard to hear." },
    { japanese: "もう一度おっしゃっていただけますでしょうか。", english: "Could you please say that one more time?" },
    { japanese: "本日は貴重なお時間をいただき、誠にありがとうございました。", english: "Thank you sincerely for your valuable time today." }
  ],
  dialogue: [
    { speaker: "面接官", japanese: "もしもし、グエン・ティ・チャウさんのお電話でしょうか。", english: "Hello, is this Nguyen Thi Chau's phone?" },
    { speaker: "チャウ", japanese: "はい、グエンでございます。お世話になっております。", english: "Yes, this is Nguyen. Thank you for your continued kindness." },
    { speaker: "面接官", japanese: "ABC商事の田中と申します。本日は面接のお電話でございます。", english: "I am Tanaka from ABC Trading. This is the call for the interview today." },
    { speaker: "チャウ", japanese: "お電話ありがとうございます。よろしくお願いいたします。", english: "Thank you for your call. I look forward to it." }
  ],
  dialogue_long: [
    { speaker: "面接官", japanese: "もしもし、ABC商事人事部の田中と申します。グエン・ティ・チャウさんでいらっしゃいますか。", english: "Hello, this is Tanaka from ABC Trading HR. Is this Ms. Nguyen Thi Chau?" },
    { speaker: "チャウ", japanese: "はい、グエン・ティ・チャウでございます。お電話ありがとうございます。お世話になっております。", english: "Yes, this is Nguyen Thi Chau. Thank you for your call. Thank you for your continued kindness." },
    { speaker: "面接官", japanese: "本日はお時間をいただき、ありがとうございます。電話面接、これより始めさせていただきます。よろしいでしょうか。", english: "Thank you for your time today. I will now begin the phone interview. Is that all right?" },
    { speaker: "チャウ", japanese: "はい、お願いいたします。なお、こちらは現在ベトナム時間の午後三時でございます。", english: "Yes, please proceed. For your reference, it is currently 3pm Vietnam time on my side." },
    { speaker: "面接官", japanese: "ありがとうございます。日本では午後五時でございますね。それでは、まず簡単に職務経歴をお話しください。", english: "Thank you. That's 5pm in Japan, then. First, please briefly describe your work history." },
    { speaker: "チャウ", japanese: "はい。ハノイ工科大学を卒業後、トヨタベトナムにて三年間、品質管理に従事してまいりました。現在は係長として、現場改善のチームを率いております。", english: "Yes. After graduating from Hanoi University of Science and Technology, I worked in quality control at Toyota Vietnam for three years. Currently I serve as section chief, leading a floor-improvement team." },
    { speaker: "面接官", japanese: "なるほど。日本での勤務経験はございますか。", english: "I see. Do you have work experience in Japan?" },
    { speaker: "チャウ", japanese: "ございません。ただ、トヨタベトナムでは日本人駐在員の方々と日常的に協働しており、日本式の業務進行には慣れております。", english: "No, but at Toyota Vietnam I work with Japanese expatriates daily, so I am accustomed to Japanese-style work flow." },
    { speaker: "面接官", japanese: "(雑音) ・・・申し訳ございません、少しこちらの音声が途切れたようです。", english: "(static) ... I'm sorry, the audio on our end seems to have cut briefly." },
    { speaker: "チャウ", japanese: "恐れ入ります。私の方も少し聞き取りにくく感じております。電波が不安定なようでございますので、一度お切りいただき、おかけ直しいただいてもよろしいでしょうか。", english: "I'm sorry. I find it slightly hard to hear on my side too. The signal seems unstable; would you mind ending and calling back?" },
    { speaker: "面接官", japanese: "わかりました。三分後におかけ直しいたします。", english: "Understood. I'll call back in three minutes." },
    { speaker: "チャウ", japanese: "(三分後)もしもし、お待たせいたしました。グエンでございます。", english: "(three minutes later) Hello, sorry to keep you waiting. This is Nguyen." },
    { speaker: "面接官", japanese: "音声、いかがでしょうか。", english: "How is the audio now?" },
    { speaker: "チャウ", japanese: "はい、はっきりと聞こえております。お手数をおかけして申し訳ございません。", english: "Yes, I can hear clearly. I apologize for the inconvenience." },
    { speaker: "面接官", japanese: "とんでもございません。それでは続きまして、なぜ日本で働きたいのか、お聞かせください。", english: "Not at all. Now please tell me why you want to work in Japan." },
    { speaker: "チャウ", japanese: "御社が掲げる「現地・現物」の精神に深く共感しております。ベトナム工場での三年間の経験を、本社の業務改善に活かしたく存じます。日本に赴任することで、ものづくりの源流を学べると確信しております。", english: "I deeply resonate with the genchi-genbutsu principle your company upholds. I wish to apply my three years' experience at the Vietnam plant to improvement at headquarters. By relocating to Japan, I am confident I can learn the source of monozukuri." },
    { speaker: "面接官", japanese: "ご家族のご理解はいただいていますか。海外赴任は大きな決断ですから。", english: "Do you have your family's understanding? Overseas relocation is a major decision." },
    { speaker: "チャウ", japanese: "はい、家族とは何度も話し合っており、全面的に応援してくれております。私の決意も固いものでございます。", english: "Yes, I have discussed with my family many times; they fully support me. My resolve is firm." },
    { speaker: "面接官", japanese: "ありがとうございました。最後に、何かご質問はございますか。", english: "Thank you. Finally, do you have any questions?" },
    { speaker: "チャウ", japanese: "二点ございます。一点目、入社後の語学研修制度について。二点目、ベトナム工場との連携プロジェクトの頻度についてでございます。", english: "Two points. First, the language-training system after joining. Second, the frequency of projects linking to the Vietnam plant." },
    { speaker: "面接官", japanese: "良いご質問ですね。詳細は本日この後メールでお送りいたします。本日は遠方からありがとうございました。", english: "Good questions. I will email details after this. Thank you for joining from afar today." },
    { speaker: "チャウ", japanese: "貴重なお時間を頂戴し、誠にありがとうございました。引き続きよろしくお願い申し上げます。失礼いたします。", english: "Thank you sincerely for your valuable time. I respectfully ask for your continued consideration. Goodbye." }
  ],
  roleplay_prompts: [
    "Bạn nhận điện thoại bất ngờ lúc đang ăn trưa, không đủ thời gian phỏng vấn (15 phút sắp phải làm việc). Hãy đề xuất gọi lại lúc khác MÀ KHÔNG mất ấn tượng — dùng cụm makoto ni moushiwake gozaimasen ga, genzai gaishutsu-chuu de gozaimashite và đề xuất 2 khung giờ cụ thể.",
    "Giữa cuộc phỏng vấn, đường truyền yếu và bạn nghe không rõ câu hỏi. Hãy yêu cầu lặp lại MÀ KHÔNG thừa nhận lỗi tại bạn — dùng o-denwa no onsei ga sukoshi kikitorinikui you de gozaimasu. Đề xuất gọi lại nếu vấn đề kéo dài.",
    "Người phỏng vấn hỏi naze toyota wo yameru no desu ka (sao bạn nghỉ Toyota?). Trả lời tích cực — KHÔNG nói xấu Toyota. Dùng cụm kore made no keiken wo ikashi, arata na chousen wo shitaku (em muốn ứng dụng kinh nghiệm và thách thức mới)."
  ],
  register_notes: "Phỏng vấn điện thoại có 4 patterns keigo riêng khác phỏng vấn trực tiếp. (1) MỞ ĐẦU: KHÔNG nói desu khi nhận máy — nói hai, Nguyen de gozaimasu (vâng, Nguyen đây). moshi moshi chỉ dùng KHI BẠN GỌI và hỏi xác nhận; người NHẬN máy thường KHÔNG nói moshi moshi. (2) XÁC NHẬN ĐỐI PHƯƠNG: itsumo o-sewa ni natte orimasu (em luôn được anh/chị giúp đỡ) — câu mở đầu chuẩn của business call ở Nhật, dùng kể cả khi mới gọi LẦN ĐẦU. Đây là tatemae — thừa nhận quan hệ kể cả khi chưa có. (3) KHI ÂM THANH KHÔNG TỐT: KHÔNG đổ tại đường truyền của bên kia — dùng cấu trúc kochira no XX no sei ka (có thể do XX bên em) hoặc o-denwa no onsei ga sukoshi kikitorinikui you de gozaimasu (âm thanh có vẻ hơi khó nghe — KHÔNG khẳng định ai gây). Đề xuất gọi lại bằng o-kakenaoshi itadaite mo yoroshii deshou ka (xin anh gọi lại) nếu họ gọi cho bạn; o-kakenaoshi itashimasu (em xin gọi lại) nếu bạn gọi cho họ. (4) KẾT THÚC: sore dewa, shitsurei itashimasu rồi ĐỢI bên kia gác máy trước. KHÔNG gác máy đột ngột. Người Nhật chú ý cả tiếng gác máy — gác máy mạnh bằng thô lỗ. Đặt máy nhẹ nhàng. // TODO: native review — jisa phrasing for Vietnam: betonamu jikan de gogo san-ji vs kochira genchi jikan de; second is more standard.",
  idiom_glosses: [
    { idiom: "声色を読む", literal: "Đọc sắc giọng nói", meaning: "Cảm nhận cảm xúc qua giọng nói — đặc biệt quan trọng trong phỏng vấn điện thoại nơi không có biểu cảm gương mặt. Không phải cụm dùng trực tiếp, mà là kỹ năng cần có.", example: "電話面接では声色を読むことが重要でございます。" },
    { idiom: "電話越し", literal: "Qua điện thoại", meaning: "Sự kết nối qua đường điện — dùng để diễn tả khoảng cách giảm nhờ công nghệ. Phù hợp khi mở đầu cảm ơn cuộc gọi từ xa.", example: "電話越しではございますが、誠意を持ってお話しさせていただきます。" },
    { idiom: "間 (ま) を取る", literal: "Lấy khoảng nghỉ", meaning: "Để khoảng lặng có chủ ý — không vội vã trả lời. Trong phỏng vấn điện thoại, ma là vũ khí: nó cho thấy bạn suy nghĩ thay vì lảm nhảm.", example: "電話面接では適切に間を取ることで、落ち着いた印象を与えられます。" },
    { idiom: "聞き上手", literal: "Người giỏi lắng nghe", meaning: "Người nghe tốt — biết khi nào lặng, biết khi nào hỏi. Quan trọng hơn hanashi-jouzu (người giỏi nói) trong phỏng vấn Nhật.", example: "面接では話し上手より聞き上手であることが評価されます。" }
  ],
  cultural_notes_vi: "Phỏng vấn điện thoại ở Nhật khác phương Tây ở năm điểm. (1) THỜI GIAN: phỏng vấn từ VN đến Nhật thường vào sáng sớm hoặc chiều VN (tương đương giờ làm việc Nhật). KHÔNG đề xuất giờ tối Nhật — bị coi là không hiểu múi giờ. Khi đề xuất giờ, luôn nói cả múi giờ: betonamu jikan de gozen juu-ji (nihon jikan de gozen juu-ni-ji). (2) MÔI TRƯỜNG: phải im lặng tuyệt đối. KHÔNG ngồi quán cafe, KHÔNG có tiếng xe ngoài phố, KHÔNG có chó sủa. Nhật rất nhạy với background noise; tiếng ồn nhẹ nhất bị nghe thấy bằng không chuẩn bị. Tốt nhất ngồi phòng đóng cửa với cửa sổ kín. (3) GIỌNG NÓI: nói CHẬM HƠN bình thường 20 phần trăm. Phỏng vấn điện thoại không có visual cues, nên người nghe cần thêm thời gian xử lý. Tốc độ thường: tầm 150 từ/phút. KHÔNG ăn, không uống, không hắt hơi vào điện thoại. (4) GIẤY TỜ: bày sẵn trước mặt: CV, research plan, bảng tính time-zone, danh sách câu hỏi. Phỏng vấn điện thoại bằng bạn được phép có cheat sheet. Tận dụng. (5) GHI CHÉP: ghi chép DUY trong cuộc gọi. Nếu bạn không nghe rõ tên người phỏng vấn, hỏi NGAY ở đầu — không phỏng vấn cả 30 phút mà không biết tên người ta. Tên ghi vào sổ kèm chức vụ — sẽ dùng trong email cảm ơn sau. Khác biệt với VN: ở VN phỏng vấn điện thoại thường casual hơn; ở Nhật, công ty đánh giá phỏng vấn điện thoại NGHIÊM TÚC như phỏng vấn trực tiếp. Nhiều khi đây là vòng đầu lọc 80 phần trăm candidate. Mặc đồ trang trọng kể cả khi họ không thấy — giọng nói thay đổi khi bạn mặc vest và ngồi thẳng (nguyên tắc tâm thân nhất như). Nếu cuộc gọi kết thúc tốt, gửi email cảm ơn trong 24 giờ với tóm tắt 3 điểm thảo luận chính.",
  tip_advice_vi: "Đêm trước phỏng vấn, kiểm tra: (1) sạc đầy điện thoại cộng có sạc dự phòng; (2) signal mạnh trong phòng đó (test gọi WhatsApp với bạn); (3) tai nghe có mic chất lượng; (4) phòng yên (gửi gia đình thông báo không vào trong 1 giờ); (5) ánh sáng tự nhiên (giúp giọng nói tự tin); (6) bày giấy tờ trước mặt: CV, research plan, time-zone reference, danh sách câu hỏi; (7) một cốc nước (uống ít, đừng uống lúc đang nói). Đến 15 phút trước giờ hẹn, NGỒI YÊN trong phòng — không di chuyển, không stretch. Để não chuyển sang chế độ phỏng vấn. Khi điện thoại reo, đợi 2 hồi rồi nhận máy (không quá nhanh để tránh có vẻ desperate, không quá chậm để không vô lễ). Câu mở đầu thuộc lòng: hai, Nguyen de gozaimasu. O-denwa arigatou gozaimasu. Trong phỏng vấn, NGỒI THẲNG — giọng nói khi ngồi thẳng khác khi ngồi gập 30 phần trăm. Mỉm cười khi nói — nghe được qua phone. Khi nghĩ, KHÔNG nói eeto liên tục — dùng shoushou o-machi kudasai (xin chờ chút) nếu cần thời gian. Kết thúc cuộc gọi, ĐỢI 3 giây sau khi họ nói shitsurei itashimasu rồi mới gác máy — gác trước thường nghe như thiếu tôn trọng. Trong vòng 24 giờ, gửi email cảm ơn với 3 điểm: cảm ơn cụ thể, tóm tắt một điểm thảo luận đặc biệt thú vị, xác nhận bước tiếp theo. Email này sẽ được forward trong nội bộ HR — nó là tài liệu vĩnh viễn về candidacy của bạn.",
  exercises: [
    { type: "fill-blank", question: "お電話の音声が少し___にくいようでございます。", answer: "聞き取り" },
    { type: "matching", instruction: "Ghép cụm tiếng Nhật với tình huống điện thoại.", pairs: [
      { japanese: "もしもし", english: "khi GỌI và xác nhận đối phương (không dùng khi nhận máy business)" },
      { japanese: "お電話ありがとうございます", english: "khi NHẬN máy business — câu mở chuẩn" },
      { japanese: "お切りいただき、おかけ直し", english: "đường truyền tệ — xin họ gác và gọi lại" },
      { japanese: "失礼いたします", english: "kết thúc cuộc gọi — đợi họ gác trước" }
    ] },
    { type: "translation", vietnamese: "Em xin lỗi, tín hiệu có vẻ không ổn định. Anh có thể gọi lại sau 3 phút được không?", japanese: "恐れ入ります、電波が不安定なようでございます。三分後におかけ直しいただいてもよろしいでしょうか。" }
  ]
},
{
  id: 58,
  title: "Networking event introduction",
  title_vi: "Tự giới thiệu tại sự kiện networking",
  title_en: "Networking event introduction",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "異業種交流会 (いぎょうしゅこうりゅうかい)", english: "cross-industry networking event" },
    { japanese: "名刺 (めいし)", english: "business card (sacred object in Japan)" },
    { japanese: "名刺交換 (めいしこうかん)", english: "business-card exchange (formal ritual)" },
    { japanese: "頂戴する (ちょうだいする)", english: "to receive (kenjougo of もらう — used for cards, time)" },
    { japanese: "拝見する (はいけんする)", english: "to look at (kenjougo of 見る — used when receiving card)" },
    { japanese: "ご縁 (ごえん)", english: "fated connection / good fortune of meeting" },
    { japanese: "つなぎ役 (つなぎやく)", english: "bridging role / introducer" },
    { japanese: "業界 (ぎょうかい)", english: "industry / sector" },
    { japanese: "ご紹介 (ごしょうかい)", english: "introduction (used when introducing one party to another)" },
    { japanese: "懇親会 (こんしんかい)", english: "informal social mixer (often after main event)" }
  ],
  examples: [
    { japanese: "初めまして。ABC商事のグエン・ティ・チャウと申します。", english: "Nice to meet you. I am Nguyen Thi Chau from ABC Trading." },
    { japanese: "本日はこのような場にお招きいただき、ありがとうございます。", english: "Thank you for inviting me to a venue such as this today." },
    { japanese: "ベトナムで品質管理を担当しております。", english: "I handle quality control in Vietnam." },
    { japanese: "もしよろしければ、お名刺を頂戴できますでしょうか。", english: "If it's all right, may I please receive your business card?" },
    { japanese: "本日は誠にありがとうございました。今後ともよろしくお願い申し上げます。", english: "Thank you sincerely for today. I respectfully ask for your continued kindness going forward." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "初めまして。ABC商事のグエンと申します。お名刺を頂戴できますでしょうか。", english: "Nice to meet you. I am Nguyen from ABC Trading. May I please receive your business card?" },
    { speaker: "佐藤", japanese: "佐藤と申します。XYZ製造の海外事業部でございます。", english: "I am Sato, from the overseas business division of XYZ Manufacturing." },
    { speaker: "チャウ", japanese: "佐藤様、頂戴いたします。ありがとうございます。", english: "Mr. Sato, I receive this. Thank you." },
    { speaker: "佐藤", japanese: "ベトナムからいらっしゃったんですか。お珍しいですね。", english: "You came from Vietnam? That's unusual." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "失礼いたします。初めまして、ABC商事のグエン・ティ・チャウと申します。ベトナムから参りました。", english: "Excuse me. Nice to meet you. I am Nguyen Thi Chau from ABC Trading. I've come from Vietnam." },
    { speaker: "佐藤", japanese: "ああ、佐藤と申します。XYZ製造でございます。ベトナムからですか。それはお疲れさまでございます。", english: "Ah, I am Sato from XYZ Manufacturing. From Vietnam? That must have been tiring." },
    { speaker: "チャウ", japanese: "もしよろしければ、お名刺を頂戴できますでしょうか。", english: "If it's all right, may I please receive your business card?" },
    { speaker: "佐藤", japanese: "もちろんでございます。どうぞ。", english: "Of course. Here you are." },
    { speaker: "チャウ", japanese: "頂戴いたします。(両手で受け取り、軽く一礼)佐藤雄一様、海外事業部の部長でいらっしゃるのですね。お名前を拝見させていただきます。", english: "I receive this. (receives with both hands, slight bow) Mr. Yuichi Sato — you are head of the overseas business division, I see. May I look at your name." },
    { speaker: "佐藤", japanese: "はい、東南アジア向けの製造装置を担当しております。グエンさんのお名刺もいただけますか。", english: "Yes, I handle manufacturing equipment for Southeast Asia. May I have your card too?" },
    { speaker: "チャウ", japanese: "申し訳ございません、お渡しが遅れまして。私の名刺でございます。(両手で差し出す)", english: "I apologize, I was slow to hand mine over. This is my card. (hands over with both hands)" },
    { speaker: "佐藤", japanese: "ありがとうございます。グエン・ティ・チャウ様。ベトナム工場の品質管理係長でいらっしゃるんですね。", english: "Thank you. Ms. Nguyen Thi Chau — you are section chief of quality control at the Vietnam plant, I see." },
    { speaker: "チャウ", japanese: "はい。本日はトヨタ系列の交流会と伺い、ぜひお越しの皆様とご挨拶させていただきたく、参加いたしました。", english: "Yes. I heard today's event is for the Toyota group, and I wished to greet everyone in attendance, so I joined." },
    { speaker: "佐藤", japanese: "弊社もトヨタさんとは長いお付き合いでして、ベトナム工場には何度かお邪魔したことがございます。", english: "Our company has a long relationship with Toyota; I've visited the Vietnam plant several times." },
    { speaker: "チャウ", japanese: "あ、それはご縁でございますね。実は、弊社のレーザー溶接装置の更新を検討しておりまして、貴社の製品にも興味を持っております。", english: "Ah, that is fated indeed. Actually, our company is considering updating laser-welding equipment, and I am interested in your products." },
    { speaker: "佐藤", japanese: "それは嬉しいお話でございます。本日は名刺交換だけになりますが、後日改めてご連絡させていただいてもよろしいでしょうか。", english: "That's a delightful matter. Today will be just card exchange, but may I contact you later separately?" },
    { speaker: "チャウ", japanese: "もちろんでございます。来週の月曜日以降でしたら、いつでもご連絡いただいて構いません。メールが確実かと存じます。", english: "Of course. From next Monday onward, please contact me any time. Email would be reliable." },
    { speaker: "佐藤", japanese: "承知いたしました。実は、弊社の海外事業部にベトナム駐在経験がある人間がもう一人おりまして、後ほどご紹介させていただきます。", english: "Understood. Actually, our overseas division has another person with Vietnam-stationing experience; let me introduce them later." },
    { speaker: "チャウ", japanese: "ありがとうございます。お言葉に甘えて、ぜひお願いいたします。袖触れ合うも他生の縁と申しますし、本日のご縁を大切にさせていただきます。", english: "Thank you. I'll take you up on that — please, by all means. As they say, even brushing sleeves is a karmic bond — I will value today's connection." },
    { speaker: "佐藤", japanese: "良い言葉ですね。それでは、後ほど懇親会の方でまたお会いしましょう。", english: "Beautiful words. Let's meet again at the social later." },
    { speaker: "チャウ", japanese: "はい、お料理も楽しみにしております。一旦失礼いたします。", english: "Yes, I'm looking forward to the food. Excusing myself for now." },
    { speaker: "佐藤", japanese: "ええ、また後ほど。", english: "Yes, see you later." }
  ],
  roleplay_prompts: [
    "Bạn ở igyoushu kouryuukai (cross-industry networking) ở Tokyo. Hãy tiếp cận một CEO Nhật bằng cụm tự giới thiệu 30 giây — tên, công ty, chức vụ, lý do đến event này. KHÔNG xin business card vội — đợi conversation tự nhiên dẫn đến đó.",
    "Bạn nhận business card từ người Nhật. Hãy thực hiện đầy đủ nghi lễ: nhận hai tay, đọc to tên, xác nhận chức vụ, đặt cẩn thận trên bàn (KHÔNG bỏ vào túi quần). Mô tả từng bước bằng tiếng Nhật khi thực hiện.",
    "Bạn quên mang business card đến event. Hãy xin lỗi MÀ KHÔNG mất mặt — dùng o-watashi dekiru mono wo o-mochi shite orazu, makoto ni moushiwake gozaimasen. Đề xuất gửi email với thông tin liên lạc thay thế, kèm chú thích về dự án bạn quan tâm."
  ],
  register_notes: "meishi koukan là nghi lễ trang trọng nhất trong business networking Nhật. Bảy quy tắc: (1) ĐƯA NHẬN HAI TAY — đưa với chữ hướng về phía người nhận, ngón cái không che tên/logo. Một tay bằng vô lễ. (2) KHI NHẬN: dùng nó nhỏ ngữ chodai itashimasu hoặc o-meishi, arigatou gozaimasu. KHÔNG thank you tiếng Anh, KHÔNG moraimasu (cộc lốc). (3) ĐỌC NGAY tên cộng chức vụ trên card to — Sato Yuuichi-sama, kaigai jigyou-bu no buchou de irasshu no desu ne. Nếu không biết đọc kanji tên, hỏi: o-namae wa nan to o-yomi sureba yoroshii deshou ka. KHÔNG nhét card vào túi mà không đọc. (4) ĐẶT CARD TRÊN BÀN cẩn thận trong cuộc nói chuyện — không bỏ vào túi quần (thô tục), không dùng làm gạt tàn (cấm tuyệt đối), không viết lên card. Sau cuộc nói, cất vào danh thiếp dụng cụ (meishi-ire). (5) THỨ TỰ ĐƯA: junior đưa trước, senior đưa sau. Trong VN bạn không biết rank của họ, an toàn là đưa TRƯỚC khi họ đưa — biểu thị sự khiêm nhường. (6) NÓI VỚI HỌ trong câu chuyện sau đó, dùng TÊN cộng sama — Sato-sama. KHÔNG Sato-san trong networking event với người mới gặp. (7) SAU EVENT: trong 24 giờ gửi email theo format: cảm ơn cuộc gặp cộng nhắc một điểm cụ thể họ nói cộng đề xuất next step. Email này kích hoạt card — không có email bằng card bị xếp xó. // TODO: native review — sode furiau mo tashou no en usage in modern Tokyo business setting; kept for cultural depth but some find it old-fashioned.",
  idiom_glosses: [
    { idiom: "袖触れ合うも他生の縁", literal: "Tay áo chạm nhau cũng là duyên kiếp khác", meaning: "Ngay cả chuyện nhỏ như chạm tay áo người lạ cũng là karma từ kiếp trước. Trong networking, dùng để bày tỏ sự trân trọng cuộc gặp tình cờ. Cụm cổ điển, gốc Phật giáo.", example: "袖触れ合うも他生の縁と申しますので、本日のご縁を大切にさせていただきます。" },
    { idiom: "一期一会", literal: "Một đời một lần gặp", meaning: "Mỗi cuộc gặp là duy nhất — phải dồn hết tâm sức như không có lần thứ hai. Gốc trà đạo Sen no Rikyu. Trong networking, bày tỏ sự nghiêm túc với cuộc gặp dù ngắn.", example: "本日のお出会いを一期一会と捉え、誠意を持って交流させていただきます。" },
    { idiom: "縁の下の力持ち", literal: "Người gánh sức dưới hiên nhà", meaning: "Người làm việc không ai thấy nhưng nâng đỡ mọi thứ — biểu tượng sự khiêm nhường Nhật. Trong networking, dùng khi giới thiệu vai trò behind-the-scenes của mình.", example: "私の業務は縁の下の力持ちでございますが、現場改善に貢献できればと存じます。" },
    { idiom: "渡る世間に鬼はなし", literal: "Đi qua thế gian không gặp quỷ", meaning: "Trên đời này luôn có người tốt sẵn sàng giúp đỡ. Phù hợp khi bày tỏ lòng biết ơn về sự giúp đỡ bất ngờ ở event.", example: "渡る世間に鬼はなしと申しますが、本日皆様に親切にしていただき感謝しております。" }
  ],
  cultural_notes_vi: "Networking ở Nhật khác phương Tây ở năm điểm. (1) RẤT CÓ CẤU TRÚC — không phải small talk ngẫu nhiên. Có agenda, danh sách người tham dự, thường có MC giới thiệu chính. Đến lễ tân, ký tên, nhận tag tên, lấy chương trình. (2) MOJUSUUKAN (jisan-kan) — bạn mang công ty mình theo, không phải là chính bạn. Khi nói, bạn nói nhân danh công ty: heisha de wa, wareware wa. KHÔNG nói watashi wa XX ga suki desu (tôi thích) — quá cá nhân. (3) NAME CARD HOLDER (meishi-ire): bắt buộc có. Mua loại da đen, không lòe loẹt. Đến event mà cầm card lẻ trong ví/túi quần bằng không chuyên nghiệp. (4) UỐNG RƯỢU (osake): nếu là mixer (konshinkai) sau event, có rượu sake/beer. Quy tắc: rót cho người khác trước (KHÔNG tự rót cho mình), nhận rượu cầm cốc HAI TAY, uống ít — không say. Nếu không uống được, nói o-sake wa yowai mono desu kara (em uống rượu yếu) — chấp nhận được. (5) RỜI EVENT: KHÔNG rời sớm trừ khi báo trước với người mời. Đi tìm host nói honjitsu wa makoto ni arigatou gozaimashita. Hitoashi saki ni shitsurei itashimasu (cảm ơn rất nhiều, em xin phép về trước). Rời lén bằng không lễ tiết. Khác biệt với VN: ở VN networking thường thân mật ngay từ đầu; ở Nhật, giai đoạn làm quen dài (3-5 cuộc gặp), rồi mới đến giai đoạn thân thiết. KHÔNG vội vàng đề xuất hợp tác kinh doanh trong cuộc gặp đầu — bị xem là pushy. Chiến lược chuẩn: cuộc gặp 1 — name card cộng small talk; cuộc 2 — email theo dõi cộng lunch nhẹ; cuộc 3 — discuss potential collaboration; cuộc 4 cộng — concrete proposal. Mỗi cuộc cách nhau 2-4 tuần.",
  tip_advice_vi: "Trước event, in 50 business cards — Nhật người ta thoải mái đưa cards, đừng để hết. Card phải song ngữ Nhật-Anh. Đến event 15 phút sớm để xem layout phòng và nhận tag. Mặc business formal — vest đen, áo trắng, tóc gọn. Nữ buộc tóc, móng tay không sơn nổi. Khi vào phòng, KHÔNG đứng một mình ở góc — đi vòng quanh, mỉm cười nhẹ. Tiếp cận một nhóm: đứng ngoài rìa với eye contact, đợi 30 giây để có pause trong cuộc nói, rồi o-hanashi no tochuu, shitsurei itashimasu. Hajimemashite. Khi nói chuyện, đừng độc thoại — nói 30 giây rồi hỏi câu mở: go-gyoukai no saikin no doukou wa ikaga deshou ka. Thời gian lý tưởng cho mỗi cuộc nói: 5-7 phút. Sau đó nhẹ nhàng tách: o-hanashi itadaki, arigatou gozaimashita. Hoka no kata ni mo go-aisatsu sasete itadakimasu ne (cảm ơn câu chuyện, em xin chào người khác nữa). Trong cuộc nói, ghi chú nhanh trên CARD của họ (mặt sau, ở gốc): nội dung họ quan tâm, ngày gặp, event tên. KHÔNG ghi trước mặt họ — chờ đi ra góc. Sau event, MỌI card phải có email follow up trong 24 giờ. Email format: (1) chào cộng tên đầy đủ cộng công ty bạn, (2) cảm ơn cuộc gặp tại event vào ngày, (3) một điểm cụ thể họ nói mà bạn nhớ, (4) đề xuất next step (cuộc gặp ngắn 30 phút), (5) signature đầy đủ. Email không có 1-3 bằng email zombie, sẽ bị họ ignore. Tỉ lệ chuyển đổi networking dẫn đến relationship ở Nhật thấp (tầm 10 phần trăm) nhưng relationship khi đã thiết lập kéo dài 10-20 năm. Đầu tư.",
  exercises: [
    { type: "fill-blank", question: "もしよろしければ、お名刺を___できますでしょうか。", answer: "頂戴" },
    { type: "matching", instruction: "Ghép bước trong nghi lễ 名刺交換 với hành động.", pairs: [
      { japanese: "両手で受け取る", english: "nhận card bằng hai tay (không một tay)" },
      { japanese: "拝見する", english: "đọc to tên cộng chức vụ trên card" },
      { japanese: "テーブルに置く", english: "đặt cẩn thận trên bàn trong cuộc nói chuyện" },
      { japanese: "名刺入れにしまう", english: "cất vào case sau khi cuộc nói chuyện kết thúc" }
    ] },
    { type: "translation", vietnamese: "Nay ta có duyên gặp nhau, em xin trân trọng cuộc gặp này.", japanese: "本日のご縁を大切にさせていただきます。" }
  ]
},
{
  id: 59,
  title: "Following up on a rejected application",
  title_vi: "Theo dõi sau khi đơn ứng tuyển bị từ chối",
  title_en: "Following up on a rejected application",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "選考結果 (せんこうけっか)", english: "selection result (interview outcome)" },
    { japanese: "お見送り (おみおくり)", english: "polite term for rejection (literally sending off)" },
    { japanese: "不採用 (ふさいよう)", english: "non-hire / rejection (more direct)" },
    { japanese: "ご縁 (ごえん)", english: "fated connection (also used as soft fit euphemism)" },
    { japanese: "真摯に (しんしに)", english: "sincerely / earnestly" },
    { japanese: "受け止める (うけとめる)", english: "to accept (a difficult result)" },
    { japanese: "ご助言 (ごじょげん)", english: "advice (sonkeigo for someone giving you advice)" },
    { japanese: "糧 (かて)", english: "nourishment / sustenance (figurative — for growth)" },
    { japanese: "精進 (しょうじん)", english: "diligent application / self-improvement (Buddhist root)" },
    { japanese: "末筆ながら (まっぴつながら)", english: "in closing / at the end of the brush (formal letter close)" }
  ],
  examples: [
    { japanese: "この度は、選考結果のご連絡をいただき、誠にありがとうございました。", english: "Thank you sincerely for the notice of selection result this time." },
    { japanese: "ご縁がなかったとのこと、残念ではございますが、ご縁を結べなかったことを真摯に受け止めております。", english: "Although it is regrettable that there was no fated connection, I sincerely accept this." },
    { japanese: "差し支えなければ、今後のために、ご助言を頂戴できますでしょうか。", english: "If it's not inconvenient, for my future, may I receive your advice?" },
    { japanese: "今回の経験を糧に、引き続き精進してまいります。", english: "I will use this experience as nourishment and continue to apply myself." },
    { japanese: "末筆ながら、貴社のますますのご発展を心よりお祈り申し上げます。", english: "In closing, I sincerely pray for your company's ever-greater prosperity." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "(メールを書きながら)残念だが、礼儀正しく返信しよう。", english: "(while writing email) Disappointed, but I will reply politely. (internal)" },
    { speaker: "チャウ", japanese: "件名は「選考結果のご連絡につきまして」にする。", english: "Subject will be Regarding the notice of selection result. (internal)" },
    { speaker: "チャウ", japanese: "ご助言をお願いするのは失礼ではない。むしろ意欲を示せる。", english: "Asking for advice is not impolite — actually it shows motivation. (internal)" },
    { speaker: "チャウ", japanese: "感情的な言葉は避け、感謝と前向きさを伝える。", english: "Avoid emotional words; convey gratitude and forward-looking attitude. (internal)" }
  ],
  dialogue_long: [
    { speaker: "件名", japanese: "選考結果のご連絡につきまして(Nguyen Thi Chau)", english: "Subject: Regarding the notice of selection result (Nguyen Thi Chau)" },
    { speaker: "本文", japanese: "ABC商事株式会社 人事部 田中様", english: "Body: ABC Trading Co., HR Department, Mr. Tanaka" },
    { speaker: "本文", japanese: "いつもお世話になっております。先日二次面接にお呼びいただきました、グエン・ティ・チャウでございます。", english: "Body: Thank you for your continued kindness. I am Nguyen Thi Chau, who was called for the second-round interview the other day." },
    { speaker: "本文", japanese: "この度は、選考結果のご連絡をいただき、誠にありがとうございました。ご縁がなかったとのこと、残念な気持ちはございますが、貴社の決定を真摯に受け止めております。", english: "Body: Thank you sincerely for the notice of selection result this time. Although there is regret that no fated connection arose, I sincerely accept your company's decision." },
    { speaker: "本文", japanese: "面接の機会を頂戴したこと、また貴社の業務について深くお話を伺えたことは、私にとって大変貴重な経験でございました。お忙しい中、丁寧にご対応くださった田中様および面接官の皆様に、改めて御礼申し上げます。", english: "Body: Receiving the interview opportunity and hearing in depth about your work were very valuable experiences for me. I again give thanks to Mr. Tanaka and the interviewers for their courteous handling despite their busyness." },
    { speaker: "本文", japanese: "誠に勝手なお願いではございますが、今後の自己研鑽のため、もし差し支えなければ、選考過程において私に不足していた点や改善の余地のある点について、ご助言を頂戴できますでしょうか。", english: "Body: This is a presumptuous request, but for my future self-cultivation, if it is not an inconvenience, may I receive advice on points where I was lacking or have room for improvement in the selection process?" },
    { speaker: "本文", japanese: "もちろん、お時間が許す範囲で構いません。形式は、メールでも、改めてお電話を頂戴する形でも、貴社のご都合のよろしい方法で結構でございます。", english: "Body: Of course, only within what your time allows. The format — email, or a return call — whatever is convenient for your company is fine." },
    { speaker: "本文", japanese: "今回の経験を糧に、引き続き精進してまいります。七転び八起きの精神で、新たな機会に挑戦してまいる所存でございます。", english: "Body: I will use this experience as nourishment and continue to apply myself. With the spirit of seven falls, eight rises, I intend to challenge new opportunities." },
    { speaker: "本文", japanese: "また、もし将来的に貴社にてご縁がございましたら、ぜひ再度応募させていただきたく存じます。その際は、何卒よろしくお願い申し上げます。", english: "Body: Also, should there be a fated connection with your company in the future, I would humbly wish to apply again. At that time, I respectfully ask for your kindness." },
    { speaker: "本文", japanese: "末筆ながら、貴社のますますのご発展、ならびに田中様のご健勝とご活躍を、心よりお祈り申し上げます。", english: "Body: In closing, I sincerely pray for your company's ever-greater prosperity and for Mr. Tanaka's good health and continued success." },
    { speaker: "本文", japanese: "今後とも、何卒よろしくお願い申し上げます。", english: "Body: I respectfully ask for your continued kindness going forward." },
    { speaker: "署名", japanese: "グエン・ティ・チャウ", english: "Signature: Nguyen Thi Chau" },
    { speaker: "署名", japanese: "メールアドレス: chau.nguyen@example.com", english: "Signature: Email: chau.nguyen@example.com" },
    { speaker: "署名", japanese: "電話番号:+84-90-1234-5678", english: "Signature: Phone: +84-90-1234-5678" },
    { speaker: "返信(田中)", japanese: "グエン様、ご丁寧なご連絡ありがとうございます。", english: "Reply (Tanaka): Ms. Nguyen, thank you for your courteous message." },
    { speaker: "返信(田中)", japanese: "今回はご縁がなく心苦しいのですが、ご助言の件、私も大変貴重なご質問と感じました。", english: "Reply (Tanaka): I am sorry there was no connection this time, but on the matter of advice, I find this a very valuable question." },
    { speaker: "返信(田中)", japanese: "二次面接では、業務知識は十分でしたが、当社の中期戦略についてのご認識がもう一歩深いとさらに良かったかと存じます。次の機会、ぜひお目にかかれますことを楽しみにしております。", english: "Reply (Tanaka): In the second interview, your work knowledge was sufficient; if your understanding of our company's mid-term strategy had been one step deeper, it would have been even better. I look forward to meeting you again." },
    { speaker: "返信(田中)", japanese: "今後のご活躍を心よりお祈りしております。", english: "Reply (Tanaka): I sincerely wish you continued success." }
  ],
  roleplay_prompts: [
    "Bạn vừa nhận email báo bị từ chối (omiokuri). Hãy phản hồi trong 24 giờ — cảm ơn cụ thể, KHÔNG xin lỗi vì đã nộp đơn, KHÔNG cố thuyết phục họ đổi quyết định. Đề xuất xin feedback cụ thể về điểm yếu để cải thiện. Tone trang trọng, tích cực.",
    "Bạn xin feedback từ HR công ty đã từ chối, họ phản hồi: mid-term strategy understanding could be deeper. Hãy phản hồi cảm ơn — xác nhận đã hiểu, cam kết cải thiện cụ thể (đọc IR reports, tìm hiểu industry trends), giữ cửa mở cho cơ hội tương lai.",
    "Sau 6 tháng, công ty đã từ chối có vị trí mở mới khớp profile bạn. Hãy viết email re-apply — nhắc về lần phỏng vấn trước, kể những gì bạn đã cải thiện từ feedback, ứng tuyển vị trí mới."
  ],
  register_notes: "Phản hồi sau bị từ chối là test register cao nhất — đây là moment người Nhật ĐÁNH GIÁ tư cách. Năm patterns bắt buộc: (1) KHÔNG nói rejection hoặc rejected trong tiếng Nhật — dùng euphemism go-en ga nakatta (không có duyên) hoặc o-miokuri (đưa tiễn — của họ với bạn). KHÔNG dùng fusaiyou (non-hire) tự gọi mình. (2) KHÔNG xin lỗi đã nộp đơn — oubo shite sumimasen là sai. Cảm ơn cơ hội thay vì xin lỗi. (3) XIN FEEDBACK với cụm khiêm tốn makoto ni katte na o-negai dewa gozaimasu ga (đây là yêu cầu vô lễ, nhưng…) cộng sashitsukae nakereba (nếu không phiền) — báo hiệu bạn biết đây là favor. KHÔNG demand feedback. Khoảng 30-50 phần trăm công ty Nhật sẽ phản hồi nếu được hỏi đúng cách; demanding sẽ bị 0 phần trăm phản hồi. (4) KẾT EMAIL với mappitsu nagara, kisha no masumasu no go-hatten wo kokoro yori o-inori moushiagemasu — cụm cố định cuối thư formal, biểu thị lòng tốt với công ty kể cả sau từ chối. (5) MỞ CỬA TƯƠNG LAI: shourai-teki ni go-en ga gozaimashitara, zehi saido oubo sasete itadakitaku — không hứa nhưng để mở khả năng. Một số công ty giữ pool reapply candidates và 30 phần trăm được hire vòng 2. Tránh: jikai mo zehi saiyou shite kudasai (please hire next time — quá demanding), konkai no kettei ni nattoku dekimasen (I don't accept this decision — combat). // TODO: native review — go-jogen is direct; some prefer o-kizuki no ten (something you noticed) for milder ask.",
  idiom_glosses: [
    { idiom: "七転び八起き", literal: "Bảy lần ngã, tám lần đứng dậy", meaning: "Kiên cường — ngã bao nhiêu cũng đứng dậy thêm một lần. Cụm vàng cho phản hồi từ chối: thừa nhận thất bại nhưng cho thấy resilience.", example: "今回は残念な結果でしたが、七転び八起きの精神で、新たな機会に挑戦してまいります。" },
    { idiom: "失敗は成功のもと", literal: "Thất bại là gốc của thành công", meaning: "Mọi thất bại chứa hạt giống của thành công — học từ thất bại sẽ dẫn đến thành tựu sau. Phù hợp khi xin feedback để cải thiện.", example: "失敗は成功のもとと申しますので、今回の経験を糧に精進してまいります。" },
    { idiom: "捨てる神あれば拾う神あり", literal: "Có thần bỏ thì có thần nhặt", meaning: "Nếu một cánh cửa đóng thì cánh khác mở — không nên thất vọng quá. Cụm an ủi cổ điển; có thể dùng tự nhủ với chính mình hoặc trong context informal.", example: "捨てる神あれば拾う神ありと申します。次のご縁を信じて前進してまいります。" },
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau mưa to, đất chặt hơn — sau khó khăn, mọi thứ vững hơn. Nguyên tắc: thất bại làm bạn mạnh hơn. Phù hợp khi nói về growth từ rejection.", example: "雨降って地固まると申します。今回の経験で、より強い自分になれるよう努めてまいります。" }
  ],
  cultural_notes_vi: "Văn hóa rejection ở Nhật khác phương Tây ở năm điểm. (1) NGÔN NGỮ ÁM CHỈ — công ty Nhật không nói we rejected you thẳng. Thay vào đó: go-en ga nakatta (không có duyên), o-miokuri (đưa tiễn), konkai wa saiyou wo miokurasete itadaku (lần này xin được không tuyển). Bạn phải hiểu ngầm. (2) HỒI ĐÁP LÀ BẮT BUỘC — KHÔNG im lặng sau email từ chối. Im lặng bằng thô lỗ cộng không chuyên nghiệp cộng không bao giờ được xét tuyển lại. Hồi đáp trong 24-48 giờ. (3) FEEDBACK CÓ ĐƯỢC — khoảng 30-50 phần trăm công ty sẽ cho feedback nếu được hỏi đúng cách. Email phải khiêm tốn (makoto ni katte na o-negai), không demanding, không phòng thủ. (4) RE-APPLY: nhiều công ty Nhật KHÔNG cấm reapply — sau 1-2 năm, với cải tiến rõ rệt, có thể nộp lại. Nhưng phải có CONTEXT trong email reapply: Lần trước em nhận được feedback rằng X. Trong 1 năm qua em đã cải thiện X bằng Y, Z. Nay em xin được nộp đơn lại. Reapply mà không tham chiếu lần trước bằng không nhớ history bằng candidate yếu. (5) NETWORK GIỮ NGUYÊN: nếu người phỏng vấn bạn (interviewer) là cá nhân ấn tượng, có thể connect LinkedIn (cẩn trọng — chỉ sau email cảm ơn) hoặc giữ liên lạc qua email Tết Nhật (nenga mail). Đây là chiến thuật long game — sau 5 năm họ chuyển công ty khác, có thể thành recruiter cho bạn ở công ty mới. Khác biệt với VN: ở VN bị từ chối thường có pháp cắt đứt với công ty đó; ở Nhật, từ chối là pause chứ không end của relationship. Quản lý tốt sau-từ-chối có thể quan trọng hơn ấn tượng trong phỏng vấn.",
  tip_advice_vi: "Trước khi viết email phản hồi, cho phép mình BUỒN trong 1-2 giờ. KHÔNG viết email khi đang upset — sẽ lộ tone trong câu chữ dù bạn cố giấu. Để 1 đêm, sáng hôm sau viết với đầu lạnh. Email có 4 phần BẮT BUỘC: (1) cảm ơn cộng tự giới thiệu lại, (2) chấp nhận quyết định cộng cảm ơn cơ hội phỏng vấn, (3) xin feedback (optional nhưng được khuyến khích), (4) closing tích cực cộng giữ cửa mở. KHÔNG: phòng thủ (em nghĩ em đã trả lời tốt), năn nỉ (xin xem xét lại), chê bai công ty (thật ra em cũng không thích lắm), bịa lý do (em sẽ học thêm Nhật ngữ). Khi xin feedback, đặt câu hỏi MỞ (go-jogen itadakeru ten) chứ không CÂU HỎI ĐÓNG (em phỏng vấn có sai gì không?). Câu mở dễ trả lời hơn cho HR. Nếu nhận được feedback cụ thể (như mid-term strategy chưa sâu), TRẢ LỜI lại trong 24 giờ — cảm ơn cụ thể, kể bạn sẽ làm gì để cải thiện. Email feedback round 2 này để lại ấn tượng cuối cùng — nó được forward trong nội bộ. Nếu công ty là DREAM company, sau 6-12 tháng (không sớm hơn) gửi check-in email — ichinen mae ni kisha no nijimensetsu ni ukagaimashita Nguyen to moushimasu. Sono setsu wa makoto ni arigatou gozaimashita. Sono go, go-jogen wo fumae, XX wo manabi, XX no keiken wo tsumimashita. Moshi arata na saiyou waku ga gozaimashitara, saido go-kentou itadakemasu to saiwai de gozaimasu. Email này có 30 phần trăm khả năng dẫn đến phỏng vấn vòng 2. Quản lý rejection tốt là kỹ năng giá trị nhất trong hệ sinh thái việc làm Nhật.",
  exercises: [
    { type: "fill-blank", question: "今回は___がなかったとのこと、残念ではございますが、真摯に受け止めております。", answer: "ご縁" },
    { type: "matching", instruction: "Ghép cụm tiếng Nhật với ý nghĩa khi từ chối.", pairs: [
      { japanese: "ご縁がなかった", english: "không có duyên (uyển ngữ — của candidate dùng)" },
      { japanese: "お見送り", english: "tiễn đưa (uyển ngữ — của HR dùng)" },
      { japanese: "見送らせていただく", english: "công ty xin được dừng (formal)" },
      { japanese: "不採用", english: "không tuyển (trực tiếp — ít dùng trong email)" }
    ] },
    { type: "translation", vietnamese: "Em sẽ dùng kinh nghiệm lần này làm tâm thực, tiếp tục tu dưỡng bản thân.", japanese: "今回の経験を糧に、引き続き精進してまいります。" }
  ]
},
{
  id: 60,
  title: "Asking professor for a letter of recommendation",
  title_vi: "Xin giáo sư viết thư giới thiệu",
  title_en: "Asking professor for a letter of recommendation",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "推薦状 (すいせんじょう)", english: "letter of recommendation" },
    { japanese: "推薦書 (すいせんしょ)", english: "recommendation document (interchangeable with 推薦状)" },
    { japanese: "提出期限 (ていしゅつきげん)", english: "submission deadline" },
    { japanese: "応募先 (おうぼさき)", english: "where you are applying to" },
    { japanese: "研究計画書 (けんきゅうけいかくしょ)", english: "research plan / study proposal" },
    { japanese: "成績証明書 (せいせきしょうめいしょ)", english: "transcript / grades certificate" },
    { japanese: "封筒 (ふうとう)", english: "envelope (recommendation often in sealed envelope)" },
    { japanese: "厳封 (げんぷう)", english: "sealed (envelope sealed by professor — never opened by candidate)" },
    { japanese: "学恩 (がくおん)", english: "academic indebtedness / debt of teaching" },
    { japanese: "三顧の礼 (さんこのれい)", english: "courtesy of three visits (going to ask multiple times respectfully)" }
  ],
  examples: [
    { japanese: "誠に恐縮ではございますが、推薦状の件で、ご相談させていただきたく存じます。", english: "I am very sorry to trouble you, but I would humbly like to consult about a letter of recommendation." },
    { japanese: "提出期限は来月二十日でございまして、二週間前までに頂戴できれば幸いでございます。", english: "The submission deadline is the 20th of next month; I would be grateful to receive it by two weeks before." },
    { japanese: "応募する大学院は、京都大学工学研究科でございます。", english: "The graduate school I am applying to is the Graduate School of Engineering, Kyoto University." },
    { japanese: "私の研究計画書は、添付のとおりでございます。", english: "My research plan is as attached." },
    { japanese: "お忙しい中、誠に申し訳ございませんが、何卒よろしくお願い申し上げます。", english: "Despite your busyness, I am truly sorry, but I respectfully ask for your kindness." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "山田先生、お忙しいところ恐れ入ります。少しお時間を頂戴できますでしょうか。", english: "Professor Yamada, sorry to disturb you when busy. Could I please have a moment of your time?" },
    { speaker: "山田先生", japanese: "はいはい、グエンさん、どうしました。", english: "Yes, yes, Nguyen-san, what is it?" },
    { speaker: "チャウ", japanese: "推薦状の件で、ご相談させていただきたく存じます。", english: "I would humbly like to consult about a letter of recommendation." },
    { speaker: "山田先生", japanese: "推薦状ですね。何の応募ですか。", english: "A recommendation, then. What application?" }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "山田先生、お忙しいところ恐れ入ります。本日は推薦状の件で、ご相談させていただきたく、お時間を頂戴いたしました。", english: "Professor Yamada, sorry to disturb when busy. Today I would humbly like to consult about a letter of recommendation; I have requested your time." },
    { speaker: "山田先生", japanese: "推薦状ですか。座ってください。何の応募でしょうか。", english: "A recommendation? Please sit. What application?" },
    { speaker: "チャウ", japanese: "京都大学大学院工学研究科への応募でございます。文部科学省の国費留学生としても併せて出願する予定でございます。", english: "An application to the Graduate School of Engineering at Kyoto University. I plan to apply concurrently as a MEXT-funded student." },
    { speaker: "山田先生", japanese: "なるほど、それは大きな挑戦ですね。希望する研究室は決まっていますか。", english: "I see, that's a big challenge. Have you decided on your target lab?" },
    { speaker: "チャウ", japanese: "はい、京都大学の中村教授の研究室を第一志望としております。先生が以前ご紹介くださった、水処理分野の権威でいらっしゃる先生でございます。", english: "Yes, I have Professor Nakamura's lab at Kyoto University as my top choice — the authority in water treatment whom you previously introduced me to." },
    { speaker: "山田先生", japanese: "ああ、中村くんね。よく覚えていますよ。彼にはあなたを推薦できる十分な理由があります。", english: "Ah, Nakamura. I remember well. I have plenty of reasons to recommend you to him." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。提出期限は来月二十日でございまして、もし可能でしたら、二週間前の六日までに頂戴できれば、余裕を持って書類を整えられるかと存じます。", english: "Thank you sincerely. The submission deadline is the 20th of next month; if possible, receiving it by the 6th — two weeks prior — would let me organize documents with some buffer." },
    { speaker: "山田先生", japanese: "了解しました。一ヶ月以上ありますから、十分間に合います。何か参考資料を持ってきましたか。", english: "Understood. With over a month, that's plenty. Did you bring reference materials?" },
    { speaker: "チャウ", japanese: "はい、四点ご用意いたしました。一、研究計画書、二、これまでの成績証明書、三、これまでの研究実績の一覧、四、応募先大学の推薦状フォーマットでございます。", english: "Yes, I prepared four items. 1. Research plan. 2. Transcripts to date. 3. List of research achievements. 4. The destination university's recommendation form." },
    { speaker: "山田先生", japanese: "準備が良いですね。フォーマットがあるんですか、それとも自由形式ですか。", english: "Well prepared. Is there a fixed format, or is it free-form?" },
    { speaker: "チャウ", japanese: "京都大学のフォーマットがございます。英語でA4一枚、特定の項目に沿ってご記入いただく形式でございます。", english: "There is a Kyoto University format. In English, one A4 page, filled in along specific items." },
    { speaker: "山田先生", japanese: "なるほど、英語ですね。私の英語ですみませんが、書きましょう。提出は厳封でしょうか。", english: "I see, English. Apologies for my English, but I'll write it. Is submission sealed?" },
    { speaker: "チャウ", japanese: "はい、厳封でございます。先生に封筒の封をしていただいた状態で、私が大学に提出する形でございます。封筒は私からお渡しいたします。", english: "Yes, sealed. The envelope sealed by you, then I submit it to the university. I will provide the envelope." },
    { speaker: "山田先生", japanese: "わかりました。それでは、一週間後に取りに来てください。それまでに研究計画書をしっかり読んでおきます。", english: "Understood. Then come pick it up in one week. I'll read the research plan thoroughly by then." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。ご無理を承知でお願い申し上げまして、本当に恐縮でございます。", english: "Thank you sincerely. I apologize for asking despite your busyness." },
    { speaker: "山田先生", japanese: "とんでもない。学生の挑戦を応援するのは私の役目です。良い結果を期待していますよ。", english: "Not at all. Supporting student challenges is my role. I expect good results." },
    { speaker: "チャウ", japanese: "学恩は決して忘れません。合格しましたら、必ずご報告に伺います。本日は貴重なお時間を頂戴し、誠にありがとうございました。失礼いたします。", english: "I will never forget the academic debt I owe you. If I succeed, I will visit to report. Thank you sincerely for your valuable time today. Excusing myself." },
    { speaker: "山田先生", japanese: "頑張ってくださいね。応援しています。", english: "Do your best. I'm cheering for you." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn vào phòng giáo sư xin thư giới thiệu cho MEXT scholarship. Hãy chuẩn bị FOUR ITEMS bằng tiếng Nhật trước khi vào phòng (research plan, transcript, achievement list, university format). Khi vào, mở đầu bằng o-isogashii tokoro osore irimasu và đưa rõ deadline.",
    "Giáo sư đồng ý viết nhưng nói thường tôi cần 3 tuần — bạn chỉ có 2 tuần. Hãy thương lượng MÀ KHÔNG ép — đề xuất giúp giáo sư bằng cách cung cấp draft điểm chính (đặc điểm bạn, dự án bạn đã làm với prof) để giảm workload. Dùng go-futan wo karuku suru tame.",
    "Sau khi nhận thư giới thiệu (genpuu envelope), bạn KHÔNG được mở. Hãy diễn tả lời cảm ơn nhận thư cộng cam kết báo cáo kết quả cộng đề xuất nani-ka o-rei (món quà nhỏ cảm ơn — phong tục VN/Nhật). Đặc biệt nói itadaita suisenjou wa sekinin wo motte teishutsu itashimasu."
  ],
  register_notes: "Xin thư giới thiệu là test register cao nhất với giáo sư — bạn đang xin một favor LỚN, kéo dài hàng giờ làm việc của họ. Sáu patterns: (1) ĐẶT LỊCH TRƯỚC qua email — KHÔNG lao vào phòng giáo sư xin. Email với subject 【go-soudan】suisenjou no ken ni tsuite. (2) CHUẨN BỊ FOUR ITEMS không thiếu: research plan/SOP, transcript, achievement list (CV), university recommendation form. Đến tay không bằng thiếu chuyên nghiệp. (3) DEADLINE ĐỀ XUẤT ÍT NHẤT 1 tháng — yêu cầu giáo sư trong 2 tuần là disrespectful. Cụm: teishutsu kigen wa XX de gozaimashite, moshi kanou deshitara, ni-shuukan mae made ni chodai dekireba saiwai de gozaimasu (deadline là XX, nếu có thể, em xin được nhận trước 2 tuần). (4) NHẮC ĐẾN TIỀN/QUÀ THẾ NÀO: trong nhiều khoa Nhật, sau khi giáo sư viết thư, sinh viên đưa món quà nhỏ (orei no shina — bánh kẹo cao cấp, không quá 5000 yên bằng 800K VND). KHÔNG đưa tiền mặt — bị coi là xúc phạm. (5) THƯ KHÔNG ĐƯỢC MỞ: thư giới thiệu thường ở genpuu (sealed envelope) — KHÔNG được mở để xem. Nhật xem việc mở thư đã sealed bằng phá vỡ trust bằng sẽ bị nhớ cả nghề. (6) BÁO CÁO KẾT QUẢ: khi có kết quả (đỗ hay trượt), QUAY LẠI báo cáo — XX ni goukaku itashimashita. Sensei no o-kage de gozaimasu (em đã đỗ XX. Nhờ thầy cả). Đây không phải tùy chọn. Giáo sư đã đầu tư vào bạn; bạn nợ họ kết quả. Cụm gakuon wa kesshite wasuremasen (em sẽ không quên học ơn) là cao điểm thứ tự kính ngữ với giáo sư. // TODO: native review — genpuu is correct; alternate mippuu is for general sealing, not academic context.",
  idiom_glosses: [
    { idiom: "学恩", literal: "Học ơn — ơn giáo dục", meaning: "Sự biết ơn sâu sắc với người dạy — concept Nho giáo nhập vào Nhật. Khác với gratitude phương Tây ở chỗ là MÓN NỢ kéo dài cả đời. Cụm chuẩn dùng với giáo sư hướng dẫn.", example: "学恩は決して忘れません。合格しましたら、必ずご報告に伺います。" },
    { idiom: "三顧の礼", literal: "Lễ ba lần thăm hỏi", meaning: "Đi ba lần để xin sự giúp đỡ — gốc Tam Quốc Diễn Nghĩa (Lưu Bị xin Khổng Minh ba lần). Biểu tượng sự kiên nhẫn và kính trọng tối đa khi xin favor lớn.", example: "三顧の礼を尽くす覚悟で、推薦状をお願い申し上げます。" },
    { idiom: "石の上にも三年", literal: "Trên đá cũng phải ba năm", meaning: "Kiên trì — ngồi trên đá lạnh ba năm thì đá cũng ấm. Phù hợp khi nói về quãng thời gian học cùng giáo sư trước khi xin recommendation.", example: "三年間ご指導いただき、石の上にも三年と申すように、今ようやく次の段階に進めるかと存じます。" },
    { idiom: "恩を仇で返す", literal: "Lấy thù trả ơn", meaning: "Phản bội ân huệ — điều cấm kỵ tuyệt đối. KHÔNG dùng trực tiếp trong email/cuộc nói; chỉ là nguyên tắc tránh né. Sau khi nhận recommendation, nếu im lặng không báo cáo kết quả bằng behavior gần với cụm này.", example: "推薦状を頂戴した後、結果をご報告しないことは恩を仇で返すような行為でございますので、必ずお伺いいたします。" }
  ],
  cultural_notes_vi: "Recommendation letter ở Nhật khác phương Tây ở năm điểm. (1) GIÁO SƯ VIẾT THỰC SỰ — không phải bạn draft rồi giáo sư ký. Giáo sư Nhật đọc kỹ research plan, suy nghĩ về quan hệ với bạn, viết letter cá nhân. KHÔNG được đề xuất em viết draft rồi thầy chỉnh — bị coi là không tôn trọng. (2) THƯ DÀI VÀ CỤ THỂ — 1-2 trang A4, kể detailed về dự án bạn đã làm, traits cá nhân quan sát, comparison với students khác. Khác recommendation generic phương Tây kiểu XX is a good student. (3) THƯƠNG MẠI HÓA NGẦM — nếu giáo sư viết thư cho bạn vào trường top, đó là PHIẾU BẦU CỦA HỌ với reputation cá nhân. Họ chỉ làm cho student họ TIN sẽ đại diện họ tốt. Vì vậy, sau khi vào trường top, bạn KHÔNG ĐƯỢC làm gì gây mất mặt giáo sư cũ — drop out, scandal, etc. Hành vi của bạn ở trường mới ảnh hưởng đến reputation của giáo sư cũ trong cộng đồng học thuật. (4) THƯỜNG ĐƯỢC TRẢ LỜI YES — giáo sư Nhật rất ít từ chối viết recommendation cho student của mình. Nhưng nếu họ DO-DỰ trong câu trả lời (kangaesasete kudasai), đó là red flag — họ đang muốn từ chối nhưng không nói thẳng. Đừng push. (5) BÁO CÁO KẾT QUẢ: BẮT BUỘC quay lại báo dù đỗ hay trượt. Đỗ — đem cake thank-you và báo. Trượt — báo cộng cảm ơn cộng chia sẻ kế hoạch tiếp theo. Im lặng bằng nợ tích lũy không trả bằng sẽ KHÔNG được viết letter lần thứ 2. Khác biệt với VN: ở VN sinh viên có thể có nhiều người viết recommendation casual; ở Nhật, 1-2 giáo sư viết recommendation official và serious. Quan hệ thầy-trò Nhật là quan hệ KÉO DÀI — giáo sư là người sẽ viết recommendation cho bạn ở 5 năm, 10 năm, 20 năm sau. Đầu tư vào quan hệ này nghiêm túc hơn bất kỳ networking nào.",
  tip_advice_vi: "Trước khi xin, đảm bảo bạn đã CÓ QUAN HỆ THỰC với giáo sư — đã làm research/dự án/seminar với họ ít nhất 1 năm. Xin recommendation từ giáo sư chỉ dạy bạn 1 lớp bằng câu trả lời sẽ generic (hoặc bị từ chối). Đặt lịch trước qua email với subject 【go-soudan】suisenjou no ken ni tsuite, không xông vào phòng. Trong cuộc gặp, đem theo BỐN TÀI LIỆU in cứng (không digital): (1) research plan / SOP — bản tiếng Anh cộng tóm tắt tiếng Nhật 1 trang; (2) transcript chính thức; (3) CV liệt kê thành tích; (4) form recommendation của trường ứng tuyển. Nói rõ deadline cộng đề xuất nộp trước 2 tuần để có buffer. Sau cuộc gặp, gửi email confirmation trong 2 giờ với attachment các tài liệu kỹ thuật cộng recap deadline. Trước ngày deadline 1 tuần, gửi reminder NHẸ NHÀNG: nen no tame, suisenjou no shinchoku wo o-ukagai sasete itadakimashita (xin được hỏi thăm tiến độ thư giới thiệu để chắc chắn). Khi nhận thư (envelope sealed), KHÔNG mở, KHÔNG kiểm tra nội dung. Tin tưởng. Đem bánh kẹo cao cấp (3000-5000 yên) — Toraya yokan, Yoku Moku, hoặc fruit cao cấp — gói lịch sự trong housoushi (giấy gói chuyên dụng) đến cảm ơn. KHÔNG đưa tiền. Khi có kết quả (1-3 tháng sau), QUAY LẠI báo: nếu đỗ, đem một món nhỏ hơn (1500-2000 yên) cộng báo cáo cộng bài viết tay. Nếu trượt, vẫn quay lại báo cộng cảm ơn cộng chia sẻ kế hoạch B. Im lặng sau nhận letter bằng burning bridge with that professor forever. Sau 1-2 năm, gửi nengajou (thiệp năm mới) hand-written với cập nhật ngắn về cuộc sống — giữ kết nối dài hạn. Recommendation đầu tiên dễ; recommendation thứ HAI từ cùng giáo sư phụ thuộc bạn đã quản lý mqh sau letter đầu thế nào.",
  exercises: [
    { type: "fill-blank", question: "提出期限は来月二十日でございまして、二週間前までに___できれば幸いでございます。", answer: "頂戴" },
    { type: "matching", instruction: "Ghép thuật ngữ với nghĩa.", pairs: [
      { japanese: "推薦状", english: "thư giới thiệu (object)" },
      { japanese: "厳封", english: "phong bì niêm phong (KHÔNG mở)" },
      { japanese: "学恩", english: "học ơn — món nợ với người dạy" },
      { japanese: "三顧の礼", english: "lễ ba lần thăm — kiên nhẫn xin favor lớn" }
    ] },
    { type: "translation", vietnamese: "Học ơn em không bao giờ quên. Nếu đỗ, em nhất định sẽ đến báo cáo.", japanese: "学恩は決して忘れません。合格しましたら、必ずご報告に伺います。" }
  ]
},
{
  id: 61,
  title: "Discussing research interests in an academic context",
  title_vi: "Thảo luận hướng nghiên cứu trong bối cảnh học thuật",
  title_en: "Discussing research interests in an academic context",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "研究関心 (けんきゅうかんしん)", english: "research interest" },
    { japanese: "研究分野 (けんきゅうぶんや)", english: "research field / discipline" },
    { japanese: "アプローチ", english: "approach / methodology" },
    { japanese: "仮説 (かせつ)", english: "hypothesis" },
    { japanese: "実験データ (じっけんデータ)", english: "experimental data" },
    { japanese: "再現性 (さいげんせい)", english: "reproducibility (key research virtue)" },
    { japanese: "学会 (がっかい)", english: "academic society / conference body" },
    { japanese: "査読 (さどく)", english: "peer review" },
    { japanese: "共同研究 (きょうどうけんきゅう)", english: "collaborative research" },
    { japanese: "知見 (ちけん)", english: "insight / finding (academic register, not idea)" }
  ],
  examples: [
    { japanese: "私の研究関心は、東南アジアにおける水質汚染対策に関するものでございます。", english: "My research interest concerns countermeasures to water pollution in Southeast Asia." },
    { japanese: "現在は、逆浸透膜の長期運用における目詰まり現象に注目しております。", english: "Currently I focus on the fouling phenomenon in long-term reverse-osmosis membrane operation." },
    { japanese: "先生の二〇二三年の論文を拝読し、深く感銘を受けました。", english: "I read your 2023 paper and was deeply moved by it." },
    { japanese: "もしお差し支えなければ、現在進行中のプロジェクトについて、お聞かせいただけますでしょうか。", english: "If it's not inconvenient, could I please hear about the currently ongoing project?" },
    { japanese: "本日のお話を踏まえ、改めて研究計画を練り直したく存じます。", english: "Based on today's discussion, I would humbly like to revise my research plan." }
  ],
  dialogue: [
    { speaker: "中村教授", japanese: "グエンさん、研究室にようこそ。今、関心のあるテーマは何ですか。", english: "Nguyen-san, welcome to my lab. What topic are you interested in now?" },
    { speaker: "チャウ", japanese: "メコンデルタの塩害対策に関心がございます。先生のご研究と接点があるかと存じます。", english: "I'm interested in salinization countermeasures in the Mekong Delta. I believe there is overlap with your research." },
    { speaker: "中村教授", japanese: "なるほど。具体的にはどの段階の研究ですか。", english: "I see. At what stage is your research specifically?" },
    { speaker: "チャウ", japanese: "現在は文献レビューと、現地データの整理を進めている段階でございます。", english: "Currently at the stage of literature review and organizing field data." }
  ],
  dialogue_long: [
    { speaker: "中村教授", japanese: "グエンさん、お越しいただきありがとうございます。山田先生からご紹介をいただいておりました。", english: "Nguyen-san, thank you for coming. I had received an introduction from Professor Yamada." },
    { speaker: "チャウ", japanese: "本日はお忙しいところお時間を頂戴し、誠にありがとうございます。グエン・ティ・チャウと申します。山田先生にも大変お世話になっております。", english: "Thank you sincerely for taking time today out of your busy schedule. I am Nguyen Thi Chau. I am deeply indebted to Professor Yamada as well." },
    { speaker: "中村教授", japanese: "では早速ですが、現在のご研究関心について、お聞かせください。", english: "Then, getting right to it — please tell me about your current research interest." },
    { speaker: "チャウ", japanese: "はい。私の研究関心は、東南アジア、特にメコンデルタにおける塩害水の浄化技術に関するものでございます。具体的には、逆浸透膜を用いた処理プロセスの長期安定性に注目しております。", english: "Yes. My research interest concerns purification technology for salt-affected water in Southeast Asia, particularly the Mekong Delta. Specifically, I focus on long-term stability of reverse-osmosis-based treatment." },
    { speaker: "中村教授", japanese: "ほう、長期安定性ですか。具体的には何が問題と考えていますか。", english: "Oh, long-term stability? Specifically what do you see as the problem?" },
    { speaker: "チャウ", japanese: "膜の目詰まり現象、いわゆるファウリングでございます。先生の二〇二三年の論文で、シリカ系ファウリングの新たなメカニズムをご提案されておりましたが、深く感銘を受けました。", english: "Membrane fouling. In your 2023 paper, you proposed a new mechanism for silica-based fouling — I was deeply moved by it." },
    { speaker: "中村教授", japanese: "あの論文を読んでくれましたか。嬉しいですね。具体的にどの部分が興味深かったですか。", english: "You read that paper? I'm pleased. Which part specifically did you find interesting?" },
    { speaker: "チャウ", japanese: "従来のモデルでは説明できなかった、温度依存性の挙動を、表面化学の観点から整理されていた点でございます。メコンデルタは年間温度差が大きく、この知見を現地条件に適用できないかと考えております。", english: "The point that you organized — from a surface-chemistry perspective — temperature-dependent behavior that conventional models couldn't explain. The Mekong has large annual temperature swings, and I wonder if this insight can be applied to field conditions there." },
    { speaker: "中村教授", japanese: "鋭い視点ですね。実は、東南アジアの実フィールドでの検証は、まだ手をつけていないんです。研究室としても関心がある領域です。", english: "A sharp angle. Actually, real-field verification in Southeast Asia is something we haven't tackled yet. It's an area our lab is also interested in." },
    { speaker: "チャウ", japanese: "それは光栄でございます。もしお差し支えなければ、現在進行中のプロジェクトについて、もう少しお聞かせいただけますでしょうか。", english: "I am honored. If it's not inconvenient, could I please hear a bit more about the currently ongoing project?" },
    { speaker: "中村教授", japanese: "今は、低エネルギーで運用できる新しい膜素材の開発に取り組んでいます。三年計画の二年目で、来年度には実証実験を始める予定です。", english: "Right now we're working on developing a new low-energy membrane material. Year two of a three-year plan; we plan to start field trials next year." },
    { speaker: "チャウ", japanese: "実証実験の場所は、どちらをご検討されておりますか。", english: "Where are you considering for field trials?" },
    { speaker: "中村教授", japanese: "国内が中心ですが、海外連携も視野に入れています。グエンさんが入れば、ベトナムでの共同研究の可能性も開けるかもしれませんね。", english: "Mainly domestic, but overseas collaboration is in our sights. If Nguyen-san joins us, the possibility of joint research in Vietnam may open up too." },
    { speaker: "チャウ", japanese: "誠にありがたいお言葉でございます。一つ確認させていただきたいのですが、研究室のミーティングは英語と日本語、どちらが基本でございますでしょうか。", english: "Truly grateful words. One thing I'd like to confirm — are lab meetings primarily in English or Japanese?" },
    { speaker: "中村教授", japanese: "基本は日本語ですが、留学生がいる時は英語にすることもあります。あなたの日本語、十分通じますよ。", english: "Basically Japanese, but when there are international students we sometimes use English. Your Japanese communicates plenty well." },
    { speaker: "チャウ", japanese: "恐れ入ります。千里の道も一歩からと申しますので、入学までにさらに研鑽を積んでまいります。本日のお話を踏まえ、研究計画書を練り直したく存じます。", english: "I am humbled. As they say the journey of a thousand ri begins with one step, I will accumulate further study before entering. Based on today's discussion, I would humbly like to refine my research plan." },
    { speaker: "中村教授", japanese: "良いですね。改訂版ができたら、メールで送ってください。コメントをお返しします。", english: "Good. When the revision is ready, send it by email. I'll return comments." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。学恩を忘れず、誠心誠意取り組ませていただきます。本日は貴重なお時間を、誠にありがとうございました。", english: "Thank you sincerely. I will not forget the academic debt, and will engage with full sincerity. Thank you sincerely for your valuable time today." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn vào phòng giáo sư mục tiêu (kenkyuushitsu houmon). Hãy giới thiệu hướng nghiên cứu trong 2 phút — phải gắn cụ thể với một bài báo của giáo sư đó (tựa đề cộng năm cộng điểm bạn thấy thú vị). KHÔNG nói chung chung em thích nghiên cứu của thầy.",
    "Giáo sư hỏi naze kono kenkyuu ga juuyou na no ka (sao nghiên cứu này quan trọng?). Hãy trả lời với CẤU TRÚC 3 tầng: vấn đề thực tế ở VN, khoảng trống trong literature, cách bạn đề xuất lấp khoảng trống. Dùng cụm to iu kanten kara (từ góc nhìn).",
    "Giáo sư đề xuất bạn xem xét hướng khác (X) thay vì hướng bạn đang theo (Y). Hãy phản hồi cởi mở MÀ KHÔNG bỏ ngay hướng Y — kichou na go-shisa wo arigatou gozaimasu. X to iu houkou mo kyoumibukaku zonjimasu. Ichido ryouhou no kanousei wo seiri sasete itadaite mo yoroshii deshou ka."
  ],
  register_notes: "Trao đổi học thuật với giáo sư mục tiêu (chưa phải supervisor) khác trao đổi với supervisor đang dạy bạn ở chỗ register CAO HƠN MỘT BẬC. Năm patterns: (1) Mở đầu ALWAYS bằng tự giới thiệu cộng ai giới thiệu bạn (yamada-sensei kara go-shoukai wo itadakimashita) — networking ở Nhật chạy qua introducer; nói tên introducer làm giáo sư mới đặt bạn vào context. (2) Dùng động từ học thuật kenjougo: haidoku suru (đọc — của bài báo của giáo sư), haichou suru (nghe — bài thuyết trình của họ), ukagau (hỏi/đến). KHÔNG yomimashita với bài báo của giáo sư — phải haidoku itashimashita. (3) Khi nói research interest, dùng cấu trúc watashi no kenkyuu kanshin wa, ni kansuru mono de gozaimasu — KHÔNG kenkyuu shitai desu (quá yếu/sinh viên). (4) Khi đặt câu hỏi về research của giáo sư, dùng o-sashitsukae nakereba (nếu không phiền) hoặc sashitsukae nai han'i de (trong phạm vi không phiền) — báo hiệu bạn biết một số research là confidential. KHÔNG hỏi về kinh phí hoặc collaborator names trừ khi giáo sư mở đề. (5) Khi đồng ý hoặc cảm ơn ý kiến, dùng kichou na go-shisa wo arigatou gozaimasu (cảm ơn ý kiến quý báu — thay yoi adobaisu desu bằng register chuẩn). go-shisa là thuật ngữ học thuật cao hơn adobaisu. // TODO: native review — kenkyuu kanshin phrasing; some labs prefer kenkyuu te-ma or risa-chi intaresuto (loanword in academic context).",
  idiom_glosses: [
    { idiom: "温故知新", literal: "Ôn cũ biết mới", meaning: "Học từ quá khứ để hiểu hiện tại — gốc Khổng Tử. Trong research, dùng để bày tỏ sự kính trọng với literature trước đó và sự tiếp nối nghiêm túc.", example: "先生のこれまでのご研究を温故知新の精神で学ばせていただきたく存じます。" },
    { idiom: "千里の道も一歩から", literal: "Đường nghìn dặm bắt đầu từ một bước", meaning: "Việc lớn từ bước nhỏ — bày tỏ khiêm tốn và sẵn sàng học từ đầu. Phù hợp khi giáo sư khen tiếng Nhật của bạn (đáp khiêm nhường).", example: "千里の道も一歩からと申しますので、入学までにさらに研鑽を積んでまいります。" },
    { idiom: "啐啄同時", literal: "Mổ trứng cùng lúc", meaning: "Khoảnh khắc gà mẹ và gà con cùng mổ vỏ trứng — gốc Zen. Biểu thị sự đồng điệu hoàn hảo giữa thầy-trò: trò sẵn sàng học, thầy sẵn sàng dạy. Cụm cao cấp dùng khi xác lập mối quan hệ học trò mới.", example: "啐啄同時の機を捉え、先生のご指導を仰ぎたく存じます。" },
    { idiom: "井の中の蛙大海を知らず", literal: "Ếch trong giếng không biết biển lớn", meaning: "Người chỉ biết thế giới hẹp không hiểu rộng lớn ngoài kia. Dùng để giải thích vì sao bạn cần ra ngoài VN học — không bằng lòng với cái giếng hiện tại.", example: "ベトナム国内の研究のみでは井の中の蛙となります。日本での研鑽を通じ、視野を広げたく存じます。" }
  ],
  cultural_notes_vi: "kenkyuushitsu houmon (lab visit) là nghi lễ quan trọng nhất trong việc xin vào lab tiến sĩ ở Nhật. Khác phương Tây ở năm điểm. (1) ĐÒI HỎI INTRODUCER — không tự dưng email cold giáo sư xin gặp. Phải có người Nhật quen biết (giáo sư hiện tại, alumni, contact qua MEXT) giới thiệu trước. Email mở đầu: XX-sensei yori go-shoukai itadakimashita, to moushimasu. Cold email vào prof Nhật top tier có rate phản hồi dưới 5 phần trăm. (2) ĐỌC SÂU 3-5 BÀI BÁO GẦN NHẤT của giáo sư trước cuộc gặp — biết tựa đề, methodology, kết luận. Khi vào phòng, nhắc bài cụ thể với năm và điểm thú vị: sensei's 2023 paper on XX — particularly the section. KHÔNG biết bài nào bằng câu trả lời generic bằng giáo sư đánh giá thấp ngay. (3) RESEARCH FIT trên GPA trên NGÔN NGỮ. Giáo sư Nhật chọn student bằng research fit chính, không bằng điểm số. Một N3 student với research fit perfect được ưu tiên hơn N1 student với fit yếu. (4) KHIÊM TỐN VỀ THÀNH TÍCH MÌNH — không khoe publications, awards, GPA top. Phong cách Nhật là để giáo sư PHÁT HIỆN ra điểm mạnh của bạn, không phải bạn pitch chúng. Nếu giáo sư hỏi cụ thể về achievement, mới trả lời ngắn gọn. (5) FOLLOW UP TRONG 24 GIỜ — email cảm ơn với tóm tắt thảo luận cộng research plan v2 (đã refine theo feedback của giáo sư trong cuộc gặp). Email này là real interview — giáo sư đánh giá tốc độ phản hồi, chất lượng refine, và sự nhạy cảm với feedback của họ. Khác biệt với VN: ở VN sinh viên thường tiếp cận giáo sư đẳng cấp ngang hàng hơn; ở Nhật, vai trò deshi (đệ tử) vẫn còn — bạn không phải consumer của education, bạn enter the lineage của giáo sư. Khi giáo sư đồng ý nhận bạn, đó là cam kết kéo dài cuộc đời nghề nghiệp — họ sẽ viết recommendation cho bạn ở năm thứ 5, 10, 20 sau khi tốt nghiệp. Đầu tư tỷ lệ thuận với weight của decision.",
  tip_advice_vi: "Trước cuộc gặp 1 tuần, làm 5 việc. (1) Đọc kỹ 5 bài báo gần nhất của giáo sư — print, ghi chú, đánh dấu 3 điểm thú vị/thắc mắc cho mỗi bài. (2) Xem website lab — ghi tên các student hiện tại, các project ongoing, equipment list. (3) Chuẩn bị research plan v1 (3-5 trang tiếng Nhật cộng tiếng Anh) — nêu vấn đề, methodology, expected output, schedule 3 năm. (4) Chuẩn bị 5 câu hỏi cho giáo sư — KHÔNG hỏi về funding, về post-graduation employment (quá thực dụng), về việc lab có dễ không. Hỏi về intellectual core: Trong 5 năm tới, hướng research lab thầy sẽ đi về đâu?, Methodology X có giới hạn gì khi áp dụng vào điều kiện Y?. (5) Chuẩn bị OUTFIT: vest đen, áo trắng, giày da đen, tóc gọn, không phụ kiện ngoài đồng hồ. Nữ búi tóc, không trang điểm đậm. Đến lab 15 phút sớm — KHÔNG sớm hơn (làm phiền). Vào sảnh, gọi giáo sư qua điện thoại nội bộ hoặc đợi assistant dẫn vào. Khi vào phòng giáo sư, gõ 3 lần, đợi hai, vào nói shitsurei itashimasu và CÚI CHÀO 30 độ. Đứng cạnh ghế cho đến khi được mời ngồi. Trong cuộc nói, GHI CHÉP TRỰC TIẾP — không ghi bằng không nghiêm túc. Khi giáo sư đề xuất hướng research khác, KHÔNG cắt lời để bảo vệ hướng của bạn — nói kichou na go-shisa wo arigatou gozaimasu. Ichido mochi-kaette seiri sasete itadakimasu. Sau cuộc gặp, trong 24 giờ gửi email với 4 phần: (a) cảm ơn cụ thể (nhắc 1 điểm thảo luận đặc biệt), (b) tóm tắt 3 takeaways chính, (c) research plan v2 attached (đã refine theo feedback), (d) đề xuất next step (xin permission cho lần gặp thứ 2 hoặc xin connect với 1 student trong lab để hỏi thêm). Email này tốt hơn cả CV — giáo sư đọc kỹ, lưu vào folder candidate, mang ra khi quyết định ai vào lab.",
  exercises: [
    { type: "fill-blank", question: "先生の二〇二三年の論文を___し、深く感銘を受けました。", answer: "拝読" },
    { type: "matching", instruction: "Ghép thuật ngữ học thuật với nghĩa.", pairs: [
      { japanese: "知見", english: "insight / finding (academic register, not idea)" },
      { japanese: "再現性", english: "reproducibility — tính lặp lại của thí nghiệm" },
      { japanese: "査読", english: "peer review" },
      { japanese: "共同研究", english: "joint research / collaboration" }
    ] },
    { type: "translation", vietnamese: "Em quan tâm đến công nghệ xử lý nước nhiễm mặn ở Đông Nam Á.", japanese: "東南アジアにおける塩害水の浄化技術に関心を持っております。" }
  ]
}
];
export default lessons;
