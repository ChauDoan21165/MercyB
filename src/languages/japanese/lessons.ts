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
},
{
  id: 62,
  title: "Meeting your Japanese boss when they visit Vietnam",
  title_vi: "Đón sếp Nhật sang thăm Việt Nam",
  title_en: "Meeting your Japanese boss when they visit Vietnam",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "ご出張 (ごしゅっちょう)", english: "business trip (sonkeigo — for boss's trip)" },
    { japanese: "遠路はるばる (えんろはるばる)", english: "from far away (set greeting for long-distance arrival)" },
    { japanese: "お疲れ様でございます", english: "thank you for your effort (max-formal greeting at arrival)" },
    { japanese: "現地スタッフ (げんちスタッフ)", english: "local (Vietnamese) staff" },
    { japanese: "視察 (しさつ)", english: "inspection / observation (formal factory visit)" },
    { japanese: "工場見学 (こうじょうけんがく)", english: "factory tour" },
    { japanese: "ご案内 (ごあんない)", english: "guidance / showing around (sonkeigo)" },
    { japanese: "時差ぼけ (じさぼけ)", english: "jet lag" },
    { japanese: "現地時間 (げんちじかん)", english: "local time (Vietnam)" },
    { japanese: "おもてなし", english: "hospitality (Japanese-specific concept of guest care)" }
  ],
  examples: [
    { japanese: "山田部長、遠路はるばるベトナムまでお越しいただき、誠にありがとうございます。", english: "Manager Yamada, thank you sincerely for coming all the way to Vietnam from afar." },
    { japanese: "長旅でお疲れのことと存じます。お荷物はこちらでお預かりいたします。", english: "I imagine you must be tired from the long journey. We will take care of your luggage here." },
    { japanese: "本日のスケジュールにつきまして、ホテルでご説明させていただきます。", english: "Regarding today's schedule, I will explain at the hotel." },
    { japanese: "ベトナム滞在中、何か不便がございましたら、いつでもお申し付けください。", english: "During your stay in Vietnam, if anything is inconvenient, please let me know any time." },
    { japanese: "現地スタッフ一同、心よりお迎え申し上げます。", english: "All of us local staff sincerely welcome you." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "山田部長、お疲れ様でございます。遠路はるばるありがとうございます。", english: "Manager Yamada, thank you for your effort. Thank you for coming from afar." },
    { speaker: "山田部長", japanese: "グエンさん、お迎えありがとうございます。空港まで来てくださって。", english: "Nguyen-san, thank you for the welcome. Coming all the way to the airport." },
    { speaker: "チャウ", japanese: "とんでもございません。お車をご用意しております。こちらへどうぞ。", english: "Not at all. We have a car prepared. This way please." },
    { speaker: "山田部長", japanese: "ホーチミンは初めてなので、楽しみにしています。", english: "It's my first time in Ho Chi Minh, so I'm looking forward to it." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "(到着ロビーで)山田部長、こちらでございます。お疲れ様でございます。", english: "(at arrivals lobby) Manager Yamada, over here. Thank you for your effort." },
    { speaker: "山田部長", japanese: "ああ、グエンさん。お迎えありがとうございます。空港まで来ていただいて、申し訳ない。", english: "Ah, Nguyen-san. Thank you for the welcome. I'm sorry you came all the way to the airport." },
    { speaker: "チャウ", japanese: "とんでもございません。遠路はるばるベトナムまでお越しいただき、誠にありがとうございます。フライトはいかがでしたか。", english: "Not at all. Thank you sincerely for coming all the way to Vietnam from afar. How was the flight?" },
    { speaker: "山田部長", japanese: "六時間でしたから、思ったより早く着きました。少し時差ぼけがありますが、大丈夫です。", english: "It was six hours, so I arrived faster than expected. I have a bit of jet lag, but I'm fine." },
    { speaker: "チャウ", japanese: "それは何よりでございます。お荷物はこちらでお預かりいたします。お車をご用意しておりますので、こちらへどうぞ。", english: "That's a relief. We will take your luggage here. We have a car ready; this way please." },
    { speaker: "山田部長", japanese: "ありがとうございます。ホテルまでどのくらいかかりますか。", english: "Thank you. How long to the hotel?" },
    { speaker: "チャウ", japanese: "通常ですと四十分程度でございますが、現在夕方のラッシュアワーに入りますので、一時間ほど見ていただければと存じます。", english: "Normally about forty minutes, but we are entering rush hour now, so please allow about an hour." },
    { speaker: "山田部長", japanese: "なるほど、ベトナムのバイクは噂で聞いています。すごい数だそうですね。", english: "I see — I've heard the rumors about Vietnam's motorbikes. They say there's a huge number." },
    { speaker: "チャウ", japanese: "はい、車窓からご覧いただけるかと存じます。ホーチミンらしい光景の一つでございます。途中、サイゴン川もご覧いただけます。", english: "Yes, you'll be able to see them from the window. It's one of the iconic scenes of Ho Chi Minh. You'll also see the Saigon River along the way." },
    { speaker: "山田部長", japanese: "それは楽しみです。明日の予定はどうなっていますか。", english: "I'm looking forward to that. What's the schedule for tomorrow?" },
    { speaker: "チャウ", japanese: "明日は午前九時にホテルにお迎えに上がります。十時から工場視察、十二時から現地スタッフとの昼食、午後は経営会議の予定でございます。詳細はホテルチェックイン後、改めてご説明させていただきます。", english: "Tomorrow I will pick you up at the hotel at 9am. Factory inspection from 10, lunch with local staff from 12, management meeting in the afternoon. I'll explain in detail after hotel check-in." },
    { speaker: "山田部長", japanese: "わかりました。今日は早めに休んだほうが良さそうですね。", english: "Understood. It seems I'd better rest early today." },
    { speaker: "チャウ", japanese: "ぜひそうなさってください。ホテルのレストランは二十二時まで開いております。お食事に関しまして、何かご希望はございますでしょうか。", english: "Please do. The hotel restaurant is open until 10pm. Regarding meals, do you have any preferences?" },
    { speaker: "山田部長", japanese: "今日は軽く済ませたいので、ルームサービスにします。明日からベトナム料理を楽しみにしています。", english: "I'd like something light today, so room service. Looking forward to Vietnamese food from tomorrow." },
    { speaker: "チャウ", japanese: "承知いたしました。明日のランチでフォーをご用意しております。きっとお口に合うかと存じます。", english: "Understood. We have prepared pho for tomorrow's lunch. I believe it will suit your palate." },
    { speaker: "山田部長", japanese: "ありがとうございます。一期一会の気持ちで、ベトナム滞在を大切にしたいと思います。", english: "Thank you. I want to value this Vietnam stay with the spirit of ichigo-ichie." },
    { speaker: "チャウ", japanese: "現地スタッフ一同、心よりお迎えしております。何か不便がございましたら、いつでもお申し付けください。", english: "All of our local staff welcome you sincerely. If anything is inconvenient, please tell me any time." },
    { speaker: "山田部長", japanese: "頼りにしています。三日間、よろしくお願いします。", english: "I'm counting on you. Three days — looking forward to it." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn đón sếp Nhật ở sân bay Tân Sơn Nhất. Hãy mở đầu cuộc gặp với cụm o-tsukaresama de gozaimasu cộng enro harubaru. Cảm ơn sếp đã đến, hỏi về flight, đề xuất lấy hành lý. Tone: kenjougo cho hành động của mình, sonkeigo cho hành động của sếp.",
    "Sếp Nhật than phiền về tiếng ồn xe máy ngoài đường. Hãy phản hồi MÀ KHÔNG biện hộ — thừa nhận, giải thích context văn hóa ngắn gọn (đây là đặc trưng HCM), đề xuất tuyến đường ít kẹt. KHÔNG nói VN tốt hơn nơi khác. Dùng cụm shitsurei wo o-kake shi, moushiwake gozaimasen.",
    "Cuối ngày, sếp hỏi muốn ăn tối ở đâu. Đề xuất nhà hàng Nhật chuẩn HCM (như Sushi Hokkaido, Hokkien) MÀ không áp đặt — đề xuất 2 lựa chọn (Nhật / Việt) và để sếp chọn. Dùng o-kosomi ni o-makase itashimasu (em xin để theo ý thích của sếp)."
  ],
  register_notes: "Khi VN là host và sếp Nhật là khách, register có 4 đặc trưng. (1) BẢO QUẢN KEIGO MẶC DÙ Ở NHÀ MÌNH — VN là host nhưng sếp vẫn là sếp. KHÔNG nới keigo vì lý do địa lý. Cụm chuẩn arrival: o-tsukaresama de gozaimasu (cảm ơn sếp đã nỗ lực). (2) CỤM ĐÓN TIẾP CỐ ĐỊNH: enro harubaru o-koshi itadaki, makoto ni arigatou gozaimasu (cảm ơn sếp đã đến từ xa). enro harubaru là cụm cố định cho khách đến từ nước khác — bỏ cụm này bằng chào không đầy đủ. (3) KHIÊM TỐN VỀ BẢN THÂN VÀ ĐẤT NƯỚC: KHÔNG khoe HCM/VN. Khi sếp khen, dùng osore irimasu (em không xứng) hoặc tonde mo gozaimasen (không có gì). Khi sếp than phiền, KHÔNG biện hộ — thừa nhận và đề xuất giải pháp. (4) CỤM CHỦ ĐỘNG SERVICE: nani-ka go-fuben ga gozaimashitara, itsudemo o-mooshitsuke kudasai (nếu có gì bất tiện, xin sếp cứ bảo) — câu nên nói LẶP LẠI mỗi 2-3 giờ trong cuộc thăm. Cụm hỏi nhu cầu: o-kosomi wa go-zaimasu deshou ka (sếp có sở thích gì không?). // TODO: native review — enro harubaru phrasing for short flights (6h Tokyo-HCM); some prefer just toui michinori for shorter distances.",
  idiom_glosses: [
    { idiom: "一期一会", literal: "Một đời một lần gặp", meaning: "Mỗi cuộc gặp là duy nhất — gốc trà đạo Sen no Rikyu. Khi sếp Nhật đến VN lần đầu, dùng cụm này để bày tỏ sự trân trọng cuộc thăm.", example: "山田部長のベトナムご訪問を一期一会の機会と捉え、誠心誠意ご対応させていただきます。" },
    { idiom: "おもてなし", literal: "Hospitality (lòng tiếp khách kiểu Nhật)", meaning: "Khái niệm hospitality đặc trưng Nhật — chăm lo cho khách không cần nói ra (proactive hospitality). VN khi host nên bày tỏ omotenashi spirit dù khái niệm gốc Nhật.", example: "ベトナム流のおもてなしの心で、山田部長をお迎えいたします。" },
    { idiom: "遠路はるばる", literal: "Đường xa lê thê", meaning: "Cụm cố định chào khách đến từ xa — không phải idiom truyền thống nhưng là chuẩn mực bắt buộc khi đón khách international. Bỏ qua bằng thiếu lễ.", example: "遠路はるばるベトナムまでお越しいただき、誠にありがとうございます。" },
    { idiom: "袖振り合うも他生の縁", literal: "Tay áo chạm nhau cũng là duyên kiếp khác", meaning: "Mỗi cuộc gặp dù nhỏ cũng là duyên — gốc Phật giáo. Trong context business, dùng để diễn tả tâm trạng cảm kích khi sếp đến thăm.", example: "袖振り合うも他生の縁と申しますが、ベトナムでお会いできること、大変光栄に存じます。" }
  ],
  cultural_notes_vi: "Đón sếp Nhật ở VN khác đón đối tác phương Tây ở năm điểm. (1) ĐẾN SÂN BAY: BẮT BUỘC. Dù sếp tự đặt khách sạn, dù sếp nói không cần, VN host phải đến sân bay đón. KHÔNG cử taxi đi đón — phải MẶT BẠN ở cửa ra. Đứng ở cửa ra với bảng tên tiếng Nhật (romaji không đủ). Cúi 30 độ khi gặp. (2) KÉO HÀNH LÝ: BẮT BUỘC offer kéo hành lý. Sếp sẽ từ chối lần đầu — vẫn đề xuất lần thứ hai mạnh hơn. Sau lần thứ hai, nếu vẫn từ chối, cầm 1 cái nhỏ thôi (laptop bag). KHÔNG để sếp tự kéo nhiều hành lý. (3) THỜI GIAN BIỂU IN SẴN: chuẩn bị schedule song ngữ (Nhật-Anh) với thời gian cộng địa điểm cộng tên người gặp. Đưa cho sếp khi vào xe. Sếp Nhật thích biết trước MỌI thứ — surprise bằng stress. (4) KHÔNG ĐỀ XUẤT QUÁ NHIỀU LỰA CHỌN cho ăn: hỏi 2 lựa chọn (Nhật / Việt) thì đủ. Hỏi 5 lựa chọn bằng không quyết định bằng stress cho sếp jetlag. Default an toàn: ngày 1 bằng Nhật (sếp jetlag), ngày 2 bằng VN. (5) GIẤY VIỆC PHẢI IN: KHÔNG show iPad/laptop slides ở quán cafe — nhiều sếp Nhật vẫn thích giấy. In schedule, factory map, attendance list. Khác biệt với VN: ở VN host thường welcoming bằng food và alcohol; ở Nhật, host welcoming bằng PROCESS và ATTENTION TO DETAIL. Hỏi sếp cảm thấy thế nào mỗi vài giờ là tốt; im lặng và assume sếp ổn là không tốt. Ngày cuối, BẮT BUỘC tiễn ra sân bay — ngay cả khi sếp tự gọi taxi được. Tiễn ra sân bay là dấu cuối của omotenashi.",
  tip_advice_vi: "Một tuần trước khi sếp đến: gửi email xác nhận lịch trình cộng thời tiết HCM (sếp Nhật sẽ chuẩn bị quần áo theo) cộng visa requirement (Nhật được miễn 15 ngày, không cần xin visa nhưng phải có hộ chiếu 6 tháng) cộng emergency contact (số WhatsApp của bạn). Ngày sếp đến: đến sân bay TRƯỚC 30 phút khi flight land (kiểm tra flight status real-time). Đứng ở cửa ra với bảng tên tiếng Nhật in to. Khi gặp, cúi 30 độ TRƯỚC khi nói. Câu mở thuộc lòng: o-tsukaresama de gozaimasu. Nguyen de gozaimasu. Enro harubaru, makoto ni arigatou gozaimasu (sếp đã nỗ lực, em là Nguyen, cảm ơn sếp đã đến từ xa). Trong xe: KHÔNG nói chuyện công việc (sếp jetlag). Hỏi flight, hỏi family, hỏi sở thích (golf, sake brand). Luôn có nước lạnh và khăn ướt sẵn. Đến hotel: PHẢI giúp check-in (đem hộ chiếu cho receptionist), kiểm tra phòng (giường king/twin theo confirm), chỉ wifi password, restaurant hours. Trao welcome kit chứa: schedule song ngữ, danh thiếp tất cả người sẽ gặp, bản đồ HCM với điểm đặc biệt được đánh dấu, một món quà nhỏ chào mừng (cà phê G7 hoặc bánh phồng tôm — không quá đắt, không quá rẻ — 200K-500K VND). Trước khi rời sếp ngày đầu: xác nhận giờ đón sáng mai cộng cách liên lạc. Mỗi sáng trước cuộc đón, gọi reception phòng sếp trước 30 phút (kakunin — xác nhận sếp đã thức). KHÔNG gõ cửa phòng sếp trừ emergency. Mẹo cuối: chuẩn bị plan B cho mỗi điểm — nếu nhà hàng đóng cửa, nếu kẹt xe, nếu sếp ốm đột ngột (biết clinic Nhật ở HCM: Family Medical Practice, FV Hospital). Sếp sẽ không bao giờ biết bạn có plan B — đó là omotenashi đỉnh.",
  exercises: [
    { type: "fill-blank", question: "山田部長、___はるばるベトナムまでお越しいただき、誠にありがとうございます。", answer: "遠路" },
    { type: "matching", instruction: "Ghép cụm Nhật host với tình huống.", pairs: [
      { japanese: "お疲れ様でございます", english: "chào sếp khi vừa gặp ở sân bay (cảm ơn sự nỗ lực)" },
      { japanese: "お預かりいたします", english: "đề xuất giữ hành lý cho sếp (kenjougo)" },
      { japanese: "お申し付けください", english: "mời sếp cứ yêu cầu nếu cần (sonkeigo)" },
      { japanese: "ご案内させていただきます", english: "xin được dẫn sếp đi (kenjougo)" }
    ] },
    { type: "translation", vietnamese: "Trong thời gian sếp ở Việt Nam, nếu có gì bất tiện, xin sếp cứ bảo em.", japanese: "ベトナム滞在中、何か不便がございましたら、いつでもお申し付けください。" }
  ]
},
{
  id: 63,
  title: "Hosting a Japanese business client in Vietnam",
  title_vi: "Tiếp khách kinh doanh Nhật tại Việt Nam",
  title_en: "Hosting a Japanese business client in Vietnam",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "お客様 (おきゃくさま)", english: "client / customer (sacred concept in JP business)" },
    { japanese: "ご訪問 (ごほうもん)", english: "visit (sonkeigo for client's visit)" },
    { japanese: "工場見学 (こうじょうけんがく)", english: "factory tour" },
    { japanese: "生産ライン (せいさんライン)", english: "production line" },
    { japanese: "品質管理 (ひんしつかんり)", english: "quality control" },
    { japanese: "お土産 (おみやげ)", english: "souvenir / gift (mandatory for visitors)" },
    { japanese: "ご贔屓に (ごひいきに)", english: "favor / patronage (used in business closing)" },
    { japanese: "懇親 (こんしん)", english: "friendly relations / informal bonding" },
    { japanese: "乾杯 (かんぱい)", english: "cheers / toast (drinking culture)" },
    { japanese: "お見送り (おみおくり)", english: "seeing someone off (here: literal — to airport)" }
  ],
  examples: [
    { japanese: "本日は弊社工場へお越しいただき、誠にありがとうございます。", english: "Thank you sincerely for coming to our factory today." },
    { japanese: "まずは生産ラインをご案内させていただきます。", english: "First, I will guide you through the production line." },
    { japanese: "ご質問がございましたら、いつでもお申し付けください。", english: "If you have any questions, please ask at any time." },
    { japanese: "夕方は懇親会をご用意しております。お時間が許せばご参加いただけますと幸いです。", english: "We have prepared a social dinner for the evening. We would be grateful if your schedule allows you to join." },
    { japanese: "今後とも変わらぬご贔屓のほど、何卒よろしくお願い申し上げます。", english: "We respectfully ask for your continued patronage." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "佐藤様、本日は弊社工場へお越しいただき、誠にありがとうございます。", english: "Mr. Sato, thank you sincerely for coming to our factory today." },
    { speaker: "佐藤", japanese: "こちらこそ、お時間を頂戴し、ありがとうございます。", english: "On the contrary, thank you for the time." },
    { speaker: "チャウ", japanese: "まずは応接室で会社概要をご説明させていただいた後、生産ラインをご案内いたします。", english: "First we'll explain company overview in the reception room, then guide you through the production line." },
    { speaker: "佐藤", japanese: "よろしくお願いします。", english: "Thank you, looking forward to it." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "佐藤様、お疲れ様でございます。本日は遠方からお越しいただき、誠にありがとうございます。", english: "Mr. Sato, thank you for your effort. Thank you sincerely for coming from afar today." },
    { speaker: "佐藤", japanese: "グエンさん、こちらこそお招きいただき、ありがとうございます。", english: "Nguyen-san, on the contrary, thank you for inviting me." },
    { speaker: "チャウ", japanese: "本日のスケジュールでございますが、まず応接室で会社概要のご説明、その後工場の生産ラインをご案内、お昼は社員食堂で軽くお召し上がりいただき、午後は品質管理部門との打ち合わせ、夕方は懇親会の予定でございます。", english: "Today's schedule — first company overview in the reception room, then factory production-line tour, lunch lightly at the staff cafeteria, afternoon meeting with quality control, social dinner in the evening." },
    { speaker: "佐藤", japanese: "充実したスケジュールですね。よろしくお願いします。", english: "Quite a full schedule. Thank you, looking forward to it." },
    { speaker: "チャウ", japanese: "(応接室で)弊社は二〇〇五年にホーチミンに設立され、現在従業員は三百名でございます。御社向けの部品は、第二ラインで生産しております。", english: "(in reception room) Our company was established in Ho Chi Minh in 2005; we currently have 300 employees. Parts for your company are produced on Line 2." },
    { speaker: "佐藤", japanese: "なるほど。第二ラインの稼働率はいかがですか。", english: "I see. How is the utilization rate of Line 2?" },
    { speaker: "チャウ", japanese: "現在は八十五パーセントの稼働率でございます。御社からのご注文増加に対応するため、来月からシフトを増やす予定でございます。", english: "Currently 85 percent utilization. To handle the increase in orders from your company, we plan to add a shift from next month." },
    { speaker: "佐藤", japanese: "それは心強いですね。実際のラインを拝見させていただけますか。", english: "That's reassuring. May I see the actual line?" },
    { speaker: "チャウ", japanese: "もちろんでございます。安全のため、ヘルメットと安全靴をご着用いただきますので、こちらでお着替えくださいませ。", english: "Of course. For safety, please wear a helmet and safety shoes; please change here." },
    { speaker: "佐藤", japanese: "(ライン視察後)印象的でしたね。特に5S活動が徹底されている点に感心しました。", english: "(after line tour) Impressive. I was particularly struck by how thoroughly 5S is implemented." },
    { speaker: "チャウ", japanese: "恐れ入ります。月一回の改善発表会を行っており、現場の意見を反映させております。一期一会の精神で、お一人お一人のお客様に最高の品質をお届けしたく存じます。", english: "I am humbled. We hold monthly improvement-presentation meetings, reflecting the floor's opinions. With the spirit of ichigo-ichie, we humbly wish to deliver the highest quality to each and every client." },
    { speaker: "佐藤", japanese: "良い言葉ですね。お客様は神様、というあの精神に通じるところがあります。", english: "Beautiful words. It connects to that spirit of the customer is god." },
    { speaker: "チャウ", japanese: "光栄でございます。お昼は社員食堂で、ベトナム料理と和食、両方ご用意しております。", english: "I am honored. For lunch at the cafeteria, we have prepared both Vietnamese food and Japanese food." },
    { speaker: "佐藤", japanese: "気を遣っていただいて。せっかくですから、ベトナム料理をいただきます。", english: "Thank you for the consideration. Since I'm here, I'll have Vietnamese food." },
    { speaker: "チャウ", japanese: "ありがとうございます。フォーがおすすめでございます。夜の懇親会は、川沿いのレストランをご予約しております。サイゴン川の夜景もお楽しみいただけるかと存じます。", english: "Thank you. We recommend pho. For the evening social, we've reserved a restaurant by the river. You'll be able to enjoy the night view of the Saigon River." },
    { speaker: "佐藤", japanese: "それは素敵ですね。今日は本当に充実した一日になりそうです。", english: "How lovely. Today is going to be a truly fulfilling day." },
    { speaker: "チャウ", japanese: "こちらこそ、ご贔屓に感謝申し上げます。お帰りの際は、些細ではございますが、お土産をご用意しております。", english: "On the contrary, thank you for your patronage. For your departure, we have prepared a small souvenir." },
    { speaker: "佐藤", japanese: "お気遣いありがとうございます。今後とも、変わらずよろしくお願いいたします。", english: "Thank you for the kind thought. Looking forward to continued partnership." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn dẫn khách Nhật đi factory tour. Hãy giới thiệu line sản xuất bằng tiếng Nhật B2 — tên line, sản phẩm, capacity, quality control. Khi khách hỏi câu kỹ thuật, KHÔNG giả vờ biết — dùng kakunin shite mairimasu (em xin xác nhận và quay lại trả lời).",
    "Bữa tối, khách Nhật đề xuất uống sake nhưng bạn không uống được. Hãy từ chối khéo trong văn hóa Nhật — KHÔNG nói thẳng iie. Dùng o-sake wa yowai mono desu kara, jusu de kanpai sasete itadaite mo yoroshii deshou ka (em rượu yếu, xin được cụng ly bằng nước trái cây).",
    "Cuối ngày, đưa khách ra sân bay tiễn về Nhật. Hãy nói lời tạm biệt với cụm honjitsu wa makoto ni arigatou gozaimashita cộng lời chúc chuyến bay an toàn cộng cụm closing kongo to mo, kawaranu go-hiiki no hodo, nanitozo yoroshiku onegai moushiagemasu (xin được hoan nghênh sự ưu ái không đổi của khách trong tương lai)."
  ],
  register_notes: "Khi tiếp khách Nhật business, register cao hơn cả khi tiếp sếp — vì khách bằng REVENUE bằng trên cả hierarchy nội bộ. Năm patterns: (1) GỌI KHÁCH BẰNG TÊN cộng sama, KHÔNG san. Lặp tên trong câu chuyện: sato-sama no go-iken wo o-kikase itadakemasu deshou ka. Nhắc tên bằng thể hiện tôn trọng cá nhân. (2) DÙNG ONSHA cho công ty khách trong lúc nói (heisha cho công ty mình). Nhầm bằng lỗi cấp 0. (3) CỤM CỐ ĐỊNH KẾT THÚC: kongo to mo, kawaranu go-hiiki no hodo, nanitozo yoroshiku onegai moushiagemasu (xin được hoan nghênh sự ưu ái không đổi trong tương lai) — go-hiiki là từ business cổ điển không thể bỏ. Bỏ qua bằng quan hệ business kết thúc. (4) APOLOGY PATTERNS đặc biệt cho khách: dù không có lỗi cụ thể, dùng o-tesuu wo o-kake itashimashite, makoto ni moushiwake gozaimasen (em đã làm phiền khách, xin lỗi). Đây là apologize cho situation, không phải fault. (5) ĐỀ XUẤT KHÔNG ÉP: dùng moshi go-tsugou ga yoroshikereba (nếu thuận tiện) hoặc go-jikan ga yurusebe (nếu thời gian cho phép) — báo hiệu bạn không ép. Nhật ghét feeling phải làm gì. // TODO: native review — okyakusama wa kamisama desu phrasing — câu cũ của Mihohashi Haruo (1960s), một số người Nhật trẻ thấy outdated; nên dùng cẩn thận, có thể dùng okyakusama wo daiichi ni thay thế.",
  idiom_glosses: [
    { idiom: "お客様は神様です", literal: "Khách là thần linh", meaning: "Khách hàng quan trọng nhất — gốc câu hát của Mihohashi Haruo 1960s. Đã thành phương châm business Nhật. Trong context này, có thể nhắc đến nhưng KHÔNG nên áp đặt vì một số người Nhật trẻ đã chuyển sang thấy câu này outdated.", example: "お客様は神様という精神で、最高の品質をお届けいたします。" },
    { idiom: "一期一会", literal: "Một đời một lần gặp", meaning: "Mỗi cuộc gặp duy nhất — gốc trà đạo. Áp dụng vào business client interaction: mỗi đơn hàng, mỗi cuộc gặp với khách hàng quan trọng đều phải dồn 100 phần trăm.", example: "一期一会の精神で、お一人お一人のお客様に最高のサービスをお届けしたく存じます。" },
    { idiom: "ご贔屓に", literal: "Sự ưu ái / favoritism", meaning: "Cụm business cố điển — biểu thị mong muốn khách hàng tiếp tục ủng hộ. Từ thời Edo, gốc kabuki theater. Cụm chuẩn closing trong mọi business interaction.", example: "今後とも変わらぬご贔屓のほど、何卒よろしくお願い申し上げます。" },
    { idiom: "袖振り合うも他生の縁", literal: "Tay áo chạm nhau cũng là duyên kiếp khác", meaning: "Mỗi mqh, dù bắt đầu nhỏ, đều là karma. Dùng khi muốn nâng tầm relationship business từ transaction lên kết nối có ý nghĩa.", example: "袖振り合うも他生の縁と申します。今回のお取引を、ぜひ長いお付き合いに発展させていただきたく存じます。" }
  ],
  cultural_notes_vi: "Tiếp khách business Nhật ở VN khác tiếp khách Tây ở 6 điểm. (1) THỜI GIAN: đến SỚM 15 phút (không 5, không 30) ở nơi gặp đầu. Khi đón ở sân bay/khách sạn, đứng ở vị trí đầu của cửa ra. KHÔNG ngồi cafe gần đó vừa đợi vừa chờ — phải ĐỨNG eye-contact với cửa ra. (2) FACTORY TOUR: in trước briefing 2 trang (tiếng Nhật) gồm: lịch sử công ty, sản phẩm, vai trò khách trong business, các số liệu. Đưa vào tay khách lúc bắt đầu, KHÔNG đợi khách hỏi. Đeo helmet và safety shoes — đưa khách thật đẹp (mới, sạch). Trên line, giải thích bằng cách CHỈ TRỰC TIẾP, không qua bảng — Nhật trọng evidence visible. (3) BỮA TRƯA: KHÔNG dẫn khách Nhật đến quán đường phố ngày đầu — dù bạn nghĩ ngon. Dẫn nhà hàng có air-conditioning, menu tiếng Anh/Nhật, vệ sinh rõ ràng. Nếu khách CHỦ ĐỘNG xin đi quán đường phố từ ngày 2, OK — nhưng ngày 1 không bao giờ. (4) ALCOHOL: bữa tối có rượu là tiêu chuẩn. KHÔNG tự rót rượu cho mình — luôn rót cho khách trước, để khách rót lại. Cụm khi rót: o-tsugi shimasu. Cụm khi nhận: itadakimasu. Cụng ly: kanpai (KHÔNG chichin chichin). Nếu bạn không uống rượu được, từ chối lần đầu được — lần thứ hai từ chối nếu khách insist sẽ awkward. Cách out: jusu de kanpai sasete itadakimasu (xin được cụng ly bằng nước trái cây). (5) GIFT: cuối visit đưa o-miyage (souvenir). Không quá đắt (300K-1M VND), không cá nhân hóa quá (không có tên khách khắc lên). Lựa chọn an toàn: cà phê G7, đặc sản địa phương đóng hộp đẹp, lụa Bao Loc. Đưa với hai tay, nói tsumaranai mono desu ga (đây là món không đáng kể). (6) SEEING OFF: BẮT BUỘC tiễn ra sân bay ngày cuối. Đưa đến counter check-in, đợi đến khi khách qua security, THẬM CHÍ vẫy tay từ kính. Nhật để ý chi tiết này — tiễn nửa chừng bằng quan hệ nửa chừng. Khác biệt với VN: ở VN khách đến hôm nay đi tomorrow là OK; ở Nhật, mỗi cuộc thăm là ichigo-ichie moment đáng đầu tư cao nhất. Một khách hài lòng bằng đơn đặt hàng kéo dài 10 năm. Tỷ suất ROI của omotenashi với khách Nhật cao nhất trong tất cả nationalities.",
  tip_advice_vi: "Trước khi khách đến, gửi email xác nhận chi tiết: (1) flight info (số flight, giờ đáp), (2) hotel (đã book chưa, ai pay), (3) lịch trình giờ-by-giờ song ngữ, (4) thời tiết HCM, (5) emergency contact. Nếu khách lần đầu đến HCM, gửi thêm: bản đồ HCM, thông tin về SIM card / wifi, currency exchange. Một ngày trước, gửi reminder kèm mong gặp khách. Ngày khách đến: PHẢI có business cards (in mới, song ngữ Nhật-Anh) sẵn sàng. Mỗi cuộc giới thiệu, đưa card hai tay với chữ hướng về khách. Trong factory tour, đeo BADGE rõ tên cộng chức vụ tiếng Nhật cho khách dễ nhớ. Lunch với khách: ngồi BẠN bên trái khách (vị trí kohai), khách ngồi vị trí kamiza (vinh dự). Nếu khách nhìn bối rối khi vào nhà hàng, đề xuất ngồi cụ thể: kochira no o-seki ni o-kake kudasai. Order thức ăn: gọi thức ăn DỄ ĂN cho khách (không quá cay, không quá mới). Nếu khách Nhật lần đầu ăn pho, hỏi WHO suggest (chỉ cách ăn — bỏ rau húng, vắt chanh, không bỏ ớt nhiều). Khi chụp ảnh kỷ niệm, KHÔNG đứng giữa khách và sếp công ty mình — vị trí of bạn là cuối hoặc bên cạnh. Phía Nhật rất chú ý photo composition — nó sẽ được đưa vào company newsletter. Cuối visit, kiểm tra hotel checkout, mua o-miyage (chuẩn bị từ trước tốt hơn mua ngày cuối), đưa khách qua security ở sân bay với tâm lý chu đáo. Trong vòng 24 giờ sau khách về, gửi email cảm ơn (tiếng Nhật) với tóm tắt 3 điểm thảo luận chính cộng cam kết theo dõi specific items cộng đính kèm photo collage cuộc thăm. Email này bằng tài liệu lưu trong file của khách bằng quyết định liệu năm sau khách có quay lại không.",
  exercises: [
    { type: "fill-blank", question: "今後とも変わらぬご___のほど、何卒よろしくお願い申し上げます。", answer: "贔屓" },
    { type: "matching", instruction: "Ghép tình huống với cụm cho đúng.", pairs: [
      { japanese: "tsumaranai mono desu ga", english: "đưa quà cuối visit (đây là món không đáng kể)" },
      { japanese: "go-jikan ga yurusebe", english: "đề xuất activity (nếu thời gian cho phép)" },
      { japanese: "o-tesuu wo o-kake shite", english: "xin lỗi proactive (đã làm phiền khách)" },
      { japanese: "go-hiiki no hodo", english: "kết thúc business meeting (xin sự ưu ái)" }
    ] },
    { type: "translation", vietnamese: "Nếu khách có câu hỏi gì, xin cứ bảo em bất cứ lúc nào.", japanese: "ご質問がございましたら、いつでもお申し付けください。" }
  ]
},
{
  id: 64,
  title: "Explaining Vietnamese culture to a Japanese colleague",
  title_vi: "Giải thích văn hóa Việt Nam với đồng nghiệp Nhật",
  title_en: "Explaining Vietnamese culture to a Japanese colleague",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "文化の違い (ぶんかのちがい)", english: "cultural difference" },
    { japanese: "なるほど", english: "I see / makes sense (key listener-feedback word)" },
    { japanese: "そうなんですね", english: "is that so (acknowledging cultural info)" },
    { japanese: "意外と (いがいと)", english: "unexpectedly / contrary to expectation" },
    { japanese: "実は (じつは)", english: "actually / in truth (signals interesting fact)" },
    { japanese: "家族中心 (かぞくちゅうしん)", english: "family-centered (Vietnamese cultural trait)" },
    { japanese: "バイク文化 (バイクぶんか)", english: "motorbike culture" },
    { japanese: "カフェ文化 (カフェぶんか)", english: "café culture" },
    { japanese: "気さく (きさく)", english: "friendly / approachable (positive trait)" },
    { japanese: "おおらか", english: "easy-going / relaxed (often used for Vietnamese vs Japanese)" }
  ],
  examples: [
    { japanese: "ベトナムでは、家族で集まることがとても大切なんです。", english: "In Vietnam, gathering as a family is very important." },
    { japanese: "コーヒー文化は、フランスの影響で発展しました。", english: "Coffee culture developed under French influence." },
    { japanese: "バイクは「足」というより、生活の一部です。", english: "Motorbikes are less like feet and more part of daily life." },
    { japanese: "日本の方からよく「忙しそう」と言われますが、実はリラックスしている時間も多いです。", english: "Japanese people often say we look busy, but actually we have a lot of relaxed time too." },
    { japanese: "もしご興味があれば、今度ローカルの市場へご案内しますよ。", english: "If you're interested, next time I'll show you a local market." }
  ],
  dialogue: [
    { speaker: "田中さん", japanese: "ベトナムのバイク、本当に多いですね。皆さん、危なくないんですか。", english: "Vietnam has so many motorbikes. Aren't they dangerous?" },
    { speaker: "チャウ", japanese: "慣れですね。実は、私たちにとってバイクは生活の一部なんです。", english: "It's habit. Actually, motorbikes are part of life for us." },
    { speaker: "田中さん", japanese: "なるほど。一家に何台くらいあるんですか。", english: "I see. About how many per household?" },
    { speaker: "チャウ", japanese: "都市部だと、家族一人に一台が普通ですね。", english: "In cities, one per family member is normal." }
  ],
  dialogue_long: [
    { speaker: "田中さん", japanese: "グエンさん、ベトナムに来てもう一週間ですが、いろいろ不思議なことがあって。教えてもらえますか。", english: "Nguyen-san, I've been in Vietnam a week now, and there are lots of curious things. Could you tell me about them?" },
    { speaker: "チャウ", japanese: "はい、もちろんです。何でも聞いてください。", english: "Yes, of course. Ask me anything." },
    { speaker: "田中さん", japanese: "まず、バイクの数。日本人にとっては衝撃です。一家に何台くらいあるんですか。", english: "First, the number of motorbikes. It's shocking for Japanese. How many per household?" },
    { speaker: "チャウ", japanese: "都市部ですと、家族一人に一台が普通です。地方ですと、一家に二、三台で共有することもあります。", english: "In urban areas, one per family member is normal. In rural areas, two or three per household, shared." },
    { speaker: "田中さん", japanese: "ええ、すごい数ですね。ヘルメットは皆さん被っていますね。", english: "Wow, that's a huge number. Everyone wears helmets, I see." },
    { speaker: "チャウ", japanese: "二〇〇七年から法律で義務化されました。それまでは少なかったんですが、罰金がかなり高くて。実は、子供のヘルメットも今年から義務化されたんです。", english: "It became legally mandatory in 2007. Before that, few wore them, but the fine is quite high. Actually, helmets for children also became mandatory this year." },
    { speaker: "田中さん", japanese: "そうなんですね。次に、コーヒー。すごく濃いですよね。日本のコーヒーと全然違います。", english: "Is that so. Next, the coffee. It's very strong, isn't it? Completely different from Japanese coffee." },
    { speaker: "チャウ", japanese: "ベトナムコーヒーはフランスの影響で、ロブスタ豆を使うんです。日本やヨーロッパでよく飲まれるアラビカ豆より、苦みとコクが強いです。コンデンスミルクと合わせるのが定番なんですが、田中さん、お試しになりましたか。", english: "Vietnamese coffee uses Robusta beans, due to French influence. It has stronger bitterness and body than Arabica, which Japan and Europe typically drink. Mixing with condensed milk is the standard — Tanaka-san, have you tried it?" },
    { speaker: "田中さん", japanese: "はい、二日目に。あれは美味しかったです。それから、家族で集まる文化。日曜日に大家族で食事する場面をよく見ます。", english: "Yes, on day two. It was delicious. Also, the gathering culture — I often see large families eating together on Sundays." },
    { speaker: "チャウ", japanese: "ベトナムでは、家族中心の文化なんです。日本ですと核家族化が進んでいると伺いますが、ベトナムは三世代同居も珍しくありません。日曜日は祖父母を訪ねるのが普通です。", english: "In Vietnam, the culture is family-centered. I hear Japan has progressed toward nuclear families, but in Vietnam three-generation living is not unusual. Visiting grandparents on Sunday is normal." },
    { speaker: "田中さん", japanese: "それは羨ましいですね。日本では、年に数回しか会えない家族も多いです。", english: "That's enviable. In Japan, many families only meet a few times a year." },
    { speaker: "チャウ", japanese: "実は、お互いに学ぶところがあると思います。日本の方は時間の使い方が上手で、効率的。ベトナム人は、おおらかで人との時間を大切にします。両方とも良い面があります。", english: "Actually, I think we have things to learn from each other. Japanese are good at using time and being efficient. Vietnamese are easy-going and value time with people. Both sides have merits." },
    { speaker: "田中さん", japanese: "おおらか、いい言葉ですね。ベトナムの方は本当に気さくで、街で道を聞いても親切に教えてくれます。", english: "Easy-going — beautiful word. Vietnamese people are truly friendly; even when I ask directions on the street, they explain kindly." },
    { speaker: "チャウ", japanese: "ありがとうございます。そう言っていただけると嬉しいです。もし興味があれば、今週末、ローカルの市場へご案内しますよ。日本のスーパーと全然違いますから、面白いと思います。", english: "Thank you. I'm glad to hear that. If you're interested, this weekend I'll guide you to a local market. It's completely different from Japanese supermarkets, so I think it'll be interesting." },
    { speaker: "田中さん", japanese: "ぜひお願いします。文化の違いを体験するのが、海外赴任の醍醐味ですから。", english: "Please, by all means. Experiencing cultural differences is the joy of overseas postings." },
    { speaker: "チャウ", japanese: "では、土曜日の朝にホテルにお迎えに上がります。早朝のほうが涼しくて、品揃えも豊富ですから。", english: "Then I'll pick you up at the hotel Saturday morning. Mornings are cooler, and selection is richer." },
    { speaker: "田中さん", japanese: "ありがとう、楽しみにしています。", english: "Thanks, looking forward to it." },
    { speaker: "チャウ", japanese: "こちらこそ。一期一会の精神で、ベトナム滞在を一緒に楽しみましょう。", english: "On the contrary. With the spirit of ichigo-ichie, let's enjoy your Vietnam stay together." }
  ],
  roleplay_prompts: [
    "Đồng nghiệp Nhật hỏi vì sao đi xe máy ở VN nhiều người không đội mũ bảo hiểm cho trẻ em. Hãy trả lời TRUNG THỰC — không bịa, không bào chữa. Dùng cụm jitsu wa, kotoshi kara giteki ni narimashita và giải thích context lịch sử. Tone: cởi mở, cảm ơn câu hỏi.",
    "Đồng nghiệp Nhật khen người VN luôn có thời gian cho gia đình. Hãy phản hồi cân bằng — đừng over-claim, đừng under-claim. Dùng cụm o-machigai mo aru ka to zonjimasu ga (có thể có misunderstanding) và đưa nuance — không phải VN nào cũng thế.",
    "Đồng nghiệp Nhật hỏi sao trên đường VN nhiều người dắt em bé không đội mũ bằng xe máy. Đây là câu KHÓ — VN có vấn đề thật. KHÔNG bào chữa. Hãy thừa nhận, giải thích context, đề xuất câu chuyện bạn cá nhân làm gì khác."
  ],
  register_notes: "Nói chuyện với đồng nghiệp Nhật về văn hóa VN, register tùy mức quen: ban đầu desu/masu, sau khi quen có thể giảm xuống casual nhưng vẫn polite. Bốn patterns đặc biệt: (1) AIZUCHI (đáp lời) — Nhật expect bạn đáp naruhodo, sou nan desu ne, hee liên tục khi nghe. KHÔNG im lặng nghe — Nhật sẽ tưởng bạn không đồng ý hoặc không hiểu. Đáp mỗi 5-10 giây. (2) JITSU WA (thực ra) — câu mở đầu chuẩn khi bạn đưa thông tin cultural mới: jitsu wa, betonamu de wa (thực ra ở VN). Báo hiệu có điều thú vị bạn không biết. (3) HAI BÊN ĐỀU CÓ ĐIỂM TỐT: KHÔNG nói VN tốt hơn hoặc Nhật tốt hơn — luôn dùng oogami ni manabu tokoro ga aru to omoimasu (hai bên đều có chỗ học của nhau). Đây là chuẩn xã giao Nhật — comparison không kẻ thắng kẻ thua. (4) GIẢI THÍCH BẰNG NUMBER cộng REASON: Nhật ưa fact-based. KHÔNG người Việt thân thiện (vague), nói theo khảo sát X năm 2023, 75 phần trăm người VN sẵn sàng giúp người lạ (specific). Khi không có data, dùng watashi no shuukan dewa (theo cảm quan của em). // TODO: native review — bunka chuushin (family-centered) phrasing; some sources prefer kazoku juushi (family-emphasizing) which is closer to Japanese collocation.",
  idiom_glosses: [
    { idiom: "以心伝心", literal: "Lòng truyền lòng", meaning: "Thông hiểu không cần nói — gốc Phật giáo Zen. Đây là ESSENCE của giao tiếp Nhật. Khác với VN explicit. Dùng cụm này để giải thích RIÊNG cho VN học giao tiếp Nhật: hiểu Nhật cần đọc ngầm.", example: "日本では以心伝心という考えがあり、言葉にしないことも多いです。ベトナムは逆に、はっきり言うのが普通ですね。" },
    { idiom: "郷に入っては郷に従え", literal: "Vào làng nào theo làng đó", meaning: "When in Rome, do as Romans do — gốc cổ Nhật. Phù hợp khi giải thích cho đồng nghiệp Nhật rằng họ ở VN nên thử làm theo VN cách.", example: "郷に入っては郷に従えと申しますので、ぜひベトナムのカフェ文化を体験してみてください。" },
    { idiom: "お互い様", literal: "Bên kia cũng vậy / cùng nhau", meaning: "Cả hai bên đều vậy — biểu thị sự tương đối, không có ai trên ai. Cụm cốt lõi của giao tiếp Nhật khi tránh comparison thắng/thua.", example: "日本もベトナムも、文化の違いはお互い様。学び合いながら理解を深めたいです。" },
    { idiom: "百聞は一見に如かず", literal: "Trăm nghe không bằng một thấy", meaning: "Tự thấy tốt hơn nghe — phù hợp khi mời đồng nghiệp Nhật trải nghiệm thực tế (đi chợ, ăn quán đường phố) thay vì chỉ giải thích.", example: "百聞は一見に如かずと申します。今度ぜひローカルの市場へご案内させていただきます。" }
  ],
  cultural_notes_vi: "Khi giải thích văn hóa VN cho người Nhật, có 5 traps cần tránh. (1) ĐỪNG over-explain — người Nhật ngại làm bạn nói nhiều. Mỗi câu hỏi của họ, trả lời CỤ THỂ trong 30-60 giây, đợi aizuchi của họ, rồi nói tiếp nếu họ muốn nghe nữa. Độc thoại 5 phút bằng họ thoải mái nhưng đầu họ overload. (2) ĐỪNG so sánh thắng/thua — KHÔNG VN có thiên nhiên đẹp hơn Nhật hoặc Nhật giàu hơn VN. Dùng oogami ni manabu (mỗi bên có chỗ học) hoặc context nuance: betonamu wa kotonatte imashite (VN khác đi một cách). (3) ĐỪNG giấu vấn đề — Nhật rất nhạy với spin. Nếu họ hỏi về tham nhũng, ô nhiễm, traffic deaths — KHÔNG bào chữa, KHÔNG nói VN cũng có chỗ tốt. Thừa nhận, giải thích context, kể bạn cá nhân làm gì khác. Honesty về vấn đề thực bằng bạn được respect. (4) ĐỪNG dùng quá nhiều VN words không giải thích — dù đồng nghiệp Nhật học VN có thể khá, đừng dùng pho, banh mi, ao dai mà không gloss. Cụm chuẩn: pho to iu betonamu no men ryouri (mì pho — món mì VN). (5) BÀN VỀ POLITICS, RELIGION, MISTAKES OF VN: tránh trừ khi họ chủ động hỏi. Nếu họ hỏi về chiến tranh VN, hãy trả lời ngắn gọn FACTUAL, KHÔNG cảm xúc. Nhật rất careful với các topic nhạy cảm. Mẹo cuối: VN host có UNIQUE ADVANTAGE — đồng nghiệp Nhật ở VN cô đơn (không tiếng Nhật xung quanh, không gia đình ở đây), bạn là người mở cửa văn hóa của họ. Đây là long-term relationship cơ hội — nếu xử lý tốt, đồng nghiệp Nhật sẽ là cầu nối của bạn vào Nhật trong 10-20 năm tới. Đầu tư.",
  tip_advice_vi: "Khi đồng nghiệp Nhật hỏi câu về VN, ĐỪNG trả lời ngay. Đợi 1-2 giây (Nhật trọng pause), rồi sou desu ne (đúng nhỉ) trước khi đi vào nội dung. Đây là tín hiệu bạn ĐANG CÂN NHẮC — Nhật ghét answer too fast (sounds prepared/scripted). Dùng cấu trúc 3-tầng: (1) acknowledge: jitsu wa, sore wa yoku kikareru shitsumon desu (thực ra đây là câu hỏi thường được hỏi); (2) explain: 1-2 câu cụ thể với data nếu có; (3) invite: moshi go-kyoumi ga arereba, jissai ni go-annai shimasu (nếu thích, em đưa đi xem thực tế). Đề xuất experience together tốt hơn explanation alone — Nhật trọng trải nghiệm trực tiếp. Khi đề xuất activity, ĐỪNG ép — moshi go-tsugou ga yoroshikereba (nếu thuận tiện) là chuẩn. Cho đồng nghiệp Nhật cơ hội iya, kondo (lần khác) một cách lịch sự. KHÔNG ép họ ăn quán đường phố nếu họ ngại — sức khỏe quan trọng. Default an toàn: cafe có air-con, cuối tuần đi chợ, bánh mì làm tại nhà bạn (nếu họ accept invitation về home). Khi nói về VN, dùng watashi-tachi (chúng tôi) chứ không betonamu-jin (người Việt nói chung) — gần gũi và humble hơn. Sau cuộc nói chuyện văn hóa kéo dài 1-2 giờ, đồng nghiệp Nhật sẽ mệt mental — đề xuất nghỉ với o-tsukaresama deshita. Dochira-ka issho ni o-cha demo dou desu ka (mệt rồi, đi uống trà nhé). Đó là cú hích nhẹ thay đổi tone từ cultural lecture sang friendship. Long term: đồng nghiệp Nhật sẽ tin bạn là cultural bridge của họ — họ sẽ mời bạn về Nhật, giới thiệu bạn với boss của họ, viết letter cho bạn nếu cần. Mqh này có ROI cao nhất trong cả career.",
  exercises: [
    { type: "fill-blank", question: "実は、ベトナムでは家族___の文化なんです。", answer: "中心" },
    { type: "matching", instruction: "Ghép aizuchi (đáp lời) với tình huống.", pairs: [
      { japanese: "なるほど", english: "đáp khi người ta giải thích logic / lý do" },
      { japanese: "そうなんですね", english: "đáp khi nhận được info mới (bất ngờ nhẹ)" },
      { japanese: "へえ", english: "đáp khi rất bất ngờ (informal hơn)" },
      { japanese: "確かに", english: "đáp khi đồng ý mạnh (đúng vậy)" }
    ] },
    { type: "translation", vietnamese: "Người Nhật và người Việt đều có những điểm hay. Mình học hỏi lẫn nhau.", japanese: "日本とベトナムはお互い様、両方とも学ぶところがたくさんあります。" }
  ]
},
{
  id: 65,
  title: "Business etiquette differences (sempai/kohai, meishi, group decisions)",
  title_vi: "Sự khác biệt trong lễ tiết business (sempai/kohai, meishi, ra quyết định nhóm)",
  title_en: "Business etiquette differences (sempai/kohai, meishi, group decisions)",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "先輩・後輩 (せんぱい・こうはい)", english: "senior / junior (hierarchical pair)" },
    { japanese: "礼儀 (れいぎ)", english: "etiquette / manners" },
    { japanese: "上下関係 (じょうげかんけい)", english: "vertical (hierarchical) relationship" },
    { japanese: "稟議 (りんぎ)", english: "ringi — bottom-up document-circulation decision" },
    { japanese: "根回し (ねまわし)", english: "groundwork / pre-consensus building" },
    { japanese: "和を以て貴しとなす", english: "harmony is to be valued (Prince Shotoku, 604 AD)" },
    { japanese: "集団主義 (しゅうだんしゅぎ)", english: "collectivism" },
    { japanese: "個人主義 (こじんしゅぎ)", english: "individualism" },
    { japanese: "意思決定 (いしけってい)", english: "decision-making" },
    { japanese: "合意形成 (ごういけいせい)", english: "consensus-building" }
  ],
  examples: [
    { japanese: "日本の会社では、上下関係がとても重視されます。", english: "In Japanese companies, hierarchical relationships are highly valued." },
    { japanese: "「先輩」というのは、年齢ではなく入社年で決まります。", english: "Sempai is determined not by age but by year of joining." },
    { japanese: "意思決定は、根回しを経てから会議で確認するのが一般的です。", english: "Decision-making generally goes through nemawashi before being confirmed in meetings." },
    { japanese: "ベトナムでは、もう少しフラットなのではないでしょうか。", english: "In Vietnam, isn't it a bit more flat?" },
    { japanese: "和を以て貴しとなすという考えが、日本のチームワークの基盤です。", english: "The idea of valuing harmony is the foundation of Japanese teamwork." }
  ],
  dialogue: [
    { speaker: "ベトナム同僚", japanese: "なんで日本の会議って、決まる前に皆もう答え知ってるの?", english: "Why do Japanese meetings have everyone already knowing the answer before deciding?" },
    { speaker: "チャウ", japanese: "それが「根回し」って文化なんです。会議は確認の場で、決定の場じゃないんですよ。", english: "That's the nemawashi culture. Meetings are for confirmation, not decision." },
    { speaker: "ベトナム同僚", japanese: "じゃあ、いつ本当に話し合うの?", english: "Then when do they really discuss?" },
    { speaker: "チャウ", japanese: "会議の前に、一対一で。これが一番重要なステップ。", english: "Before the meeting, one-on-one. That's the most important step." }
  ],
  dialogue_long: [
    { speaker: "ベトナム同僚 (ハー)", japanese: "チャウさん、日本人の同僚と仕事して三ヶ月だけど、まだ分からないことがあって。", english: "Chau-san, I've worked with Japanese colleagues for three months and there are still things I don't understand." },
    { speaker: "チャウ", japanese: "何でも聞いて。私も最初すごく戸惑ったから。", english: "Ask anything. I was very confused at first too." },
    { speaker: "ハー", japanese: "「先輩」って言葉。年齢上の人を呼ぶの?それとも会社で長い人?", english: "The word sempai. Is it for older people? Or those who've been at the company longer?" },
    { speaker: "チャウ", japanese: "会社では、入社年で決まる。例えば、二十五歳の田中さんは、入社三年目。三十歳のグエンさんは、入社一年目。この場合、田中さんが先輩、グエンさんが後輩。", english: "At companies, it's by year of joining. For example, 25-year-old Tanaka is in their 3rd year. 30-year-old Nguyen is in their 1st year. In this case, Tanaka is sempai, Nguyen is kohai." },
    { speaker: "ハー", japanese: "え、年齢関係ないの?ベトナムだと年齢順なのに。", english: "Eh, age doesn't matter? In Vietnam it's by age." },
    { speaker: "チャウ", japanese: "そう、ここがベトナム人にとって一番混乱するところ。年齢じゃなくて「会社の年功」なの。だから、年下の先輩に敬語使わないといけない。", english: "Yes, that's the most confusing part for Vietnamese. It's not age, but company seniority. So you have to use keigo with younger sempai." },
    { speaker: "ハー", japanese: "なるほど。次に「根回し」。会議で決まることが、なぜか会議前に決まってる感じがする。", english: "I see. Next, nemawashi. It feels like things decided in meetings are somehow already decided before the meeting." },
    { speaker: "チャウ", japanese: "いい観察!まさにそれ。日本では、会議は「決定の場」じゃなくて「確認の場」なの。本当の議論は、会議の前に一対一で行われる。これを「根回し」って呼ぶ。", english: "Good observation! Exactly that. In Japan, meetings are not for deciding but for confirming. Real discussion happens one-on-one before the meeting. This is called nemawashi." },
    { speaker: "ハー", japanese: "じゃあ、会議で反対意見を言ったら?", english: "Then what if you voice opposing opinions in the meeting?" },
    { speaker: "チャウ", japanese: "それは大失敗。和を乱すと見られる。「和を以て貴しとなす」という考えが基盤だから、会議で和を壊すのはタブー。反対なら、根回しの段階で個別に伝える。", english: "That's a big failure. You'd be seen as disturbing harmony. The idea of harmony is to be valued is the foundation, so breaking harmony at meetings is taboo. If you disagree, communicate individually during the nemawashi stage." },
    { speaker: "ハー", japanese: "じゃあ、本当に意見が違ったらどうするの?", english: "Then what if you genuinely disagree?" },
    { speaker: "チャウ", japanese: "個別に「私としては別の見方もあるかと存じます」って伝える。直接「反対です」じゃなくて、「もう一つの視点」として提案。和を保ちながら、内容は伝える。", english: "Tell them individually: I believe there is also another viewpoint. Not directly I disagree, but propose another perspective. Maintain harmony while conveying content." },
    { speaker: "ハー", japanese: "難しいなあ。ベトナム人は普段、もっとはっきり言うから。", english: "That's hard. Vietnamese normally speak more directly." },
    { speaker: "チャウ", japanese: "そう、ベトナムでは「集団主義」と言いつつも、個人の意見をはっきり言うことは普通。日本は「集団主義」が深いから、個人意見を抑える文化がある。慣れるのに半年は必要。", english: "Yes, in Vietnam we say collectivism but stating personal opinions clearly is normal. In Japan, collectivism runs deeper, so there's a culture of suppressing personal opinions. It takes about half a year to get used to." },
    { speaker: "ハー", japanese: "もう一個聞いていい?名刺交換。すごい大げさに見えるけど、本当に必要なの?", english: "One more — meishi exchange. It looks really exaggerated, but is it really necessary?" },
    { speaker: "チャウ", japanese: "ものすごく必要。名刺は「第二の自分」って言われる。両手で渡す、両手で受け取る、ポケットに入れない、書き込まない。これだけで「日本の礼儀を理解している人」と見られる。逆に、これができないと第一印象で大きく損する。", english: "Crucially necessary. The card is called your second self. Give with both hands, receive with both hands, don't put in pocket, don't write on it. Just doing this gets you seen as someone who understands Japanese etiquette. Conversely, failing to do this hurts first impressions a lot." },
    { speaker: "ハー", japanese: "覚えることたくさんあるねえ。", english: "There's a lot to remember." },
    { speaker: "チャウ", japanese: "全部覚えなくていい。最低限「先輩を立てる」「会議の前に根回しする」「名刺は両手で」、この三つだけで日本の同僚から信頼される。一期一会の精神で、毎日の細かい所作に気を配る、それが鍵。", english: "You don't need to remember everything. Just the minimum — respect sempai, do nemawashi before meetings, meishi with both hands — these three alone earn trust from Japanese colleagues. With the spirit of ichigo-ichie, paying attention to small daily gestures is the key." }
  ],
  roleplay_prompts: [
    "Đồng nghiệp Nhật trẻ hơn (input 5 năm ở công ty cũ trước khi join lại) là sempai của bạn. Hãy diễn tả cách giao tiếp với họ — keigo đầy đủ MÀ KHÔNG awkward. Dùng cụm o-tsukaresama desu cộng XX-senpai trong câu chuyện. KHÔNG dùng san với sempai.",
    "Bạn không đồng ý với plan dự án nhưng đang trong meeting công khai. Hãy KHÔNG phản đối trực tiếp. Sau meeting, đến chỗ leader lúc đi cafe, dùng cụm betsu no mikata mo aru ka to zonjimasu (em nghĩ có cách nhìn khác) để truyền message. Mô tả cách thực hiện nemawashi này.",
    "Đồng nghiệp Nhật mới trẻ (kohai) hỏi bạn — sempai — về cách làm việc. Hãy trả lời với register sempai (KHÔNG kenjougo, dùng casual desu/masu hoặc thậm chí da/dearu cho tương tác này). Cảm ơn họ vì câu hỏi nhưng không quá khúm núm — bạn là sempai, role là dạy dỗ với sự tự tin."
  ],
  register_notes: "Khi giải thích business etiquette Nhật cho người VN, register có 3 layers. (1) NÓI VỀ VĂN HÓA NHẬT: dùng desu/masu chuẩn, KHÔNG kenjougo (vì đồng nghiệp VN, không phải cấp trên). Khi nhắc đến hành vi của người Nhật, dùng dạng người ta general: nihon-jin wa XX shimasu hoặc XX no bunka ga arimasu. (2) NÓI VỀ SEMPAI/KOHAI: khi mình nói chuyện với sempai cụ thể, register chuyển sang keigo nhẹ (desu/masu thấp nhất, sometimes kenjougo cho hành động của mình). KHÔNG sonkeigo cho sempai trong giao tiếp hàng ngày — chỉ dành cho buchou/kachou level. Cụm gọi: XX-sempai (KHÔNG XX-san). (3) NÓI VỀ RINGI/NEMAWASHI: dùng thuật ngữ Nhật KHÔNG dịch sang VN. ringi nghĩa là circulating decision document, nemawashi là pre-consensus, nemu (gốc của nemawashi) là rễ — biểu tượng đào rễ xung quanh cây trước khi di chuyển nó. Đồng nghiệp VN có thể không hiểu — giải thích bằng analogy như đào rễ trước khi trồng cây sang chỗ khác — chuẩn bị soil/đường (one-on-one chats) trước khi formal decision (transplant). // TODO: native review — ringi vs ringi-sho phrasing; ringi là quy trình, ringi-sho là document — đồng nghiệp VN nên biết phân biệt.",
  idiom_glosses: [
    { idiom: "和を以て貴しとなす", literal: "Lấy hòa làm quý", meaning: "Hòa hợp là điều cao quý nhất — gốc Hiến pháp 17 điều của Hoàng Thái tử Shotoku năm 604. Nguyên tắc nền tảng cho consensus-building Nhật. Trong meeting, harmony trên opinion clarity.", example: "和を以て貴しとなすという考えが、日本のチームワークの基盤です。" },
    { idiom: "出る杭は打たれる", literal: "Cọc nhô ra sẽ bị đóng xuống", meaning: "Người nổi bật sẽ bị đè xuống — văn hóa không khuyến khích cá nhân nổi trội. Khác với VN nơi cá nhân được khuyến khích thể hiện. Hiểu cụm này bằng hiểu vì sao Nhật ngại phát biểu trong meeting.", example: "出る杭は打たれる文化ですから、会議で目立つ反対意見は避けられがちです。" },
    { idiom: "以心伝心", literal: "Lòng truyền lòng", meaning: "Hiểu nhau không cần lời — gốc Phật giáo Zen. Trong business Nhật, sếp mong nhân viên đọc tâm — không phải mọi thứ phải nói ra. Điểm khó nhất với người VN.", example: "日本では以心伝心で察する文化があり、言葉にしないことも多いです。ベトナム人にとって、これが一番の壁かもしれません。" },
    { idiom: "石の上にも三年", literal: "Trên đá cũng phải ba năm", meaning: "Kiên trì sẽ được đền đáp — phù hợp khi nói về việc làm quen với business etiquette Nhật cần ít nhất 3 năm để thấm.", example: "日本の礼儀に慣れるには、石の上にも三年と言うように、時間が必要です。" }
  ],
  cultural_notes_vi: "Sự khác biệt sâu sắc nhất giữa business VN và Nhật KHÔNG phải ở keigo (đó chỉ là bề mặt) — mà ở 4 cấu trúc xã hội đằng sau. (1) HIERARCHY THEO 入社年 (NHẬP CÔNG NIÊN): Nhật rank theo NĂM JOIN công ty, không theo tuổi/title/skill. Một người 25 tuổi vào công ty trước 5 năm có thể là sempai của một người 35 tuổi mới vào. Người VN khó accept — ở VN tuổi tác là tiêu chí số 1. Quy tắc thực hành: trong meeting, hỏi XX-san wa nyuusha sannen-me desu yo ne (anh là năm thứ 3 đúng không?) — biết hierarchy ngay. (2) RINGI (稟議) DECISION-MAKING: ở Nhật, decision đi BOTTOM-UP qua document gọi là ringi-sho. Mỗi level circle, đóng dấu (印鑑/hanko), thêm comment, gửi up. Đến khi tới CEO, đã có 8-15 dấu. Quyết định không một-mình. Khác với VN nơi sếp quyết định và push xuống. Quy tắc thực hành: KHÔNG đề xuất gì big trong meeting — viết ringi-sho gửi qua chain. Chuẩn bị, đợi 2-3 tuần. (3) NEMAWASHI (根回し) PRE-CONSENSUS: trước khi ringi-sho gửi, người đề xuất phải đi GẶP TỪNG người trong chain riêng (cafe break, lunch, sau giờ làm) để giải thích, lấy ý kiến, điều chỉnh. Đến khi document ringi đến mỗi người, họ ALREADY agree. Đây là 80 phần trăm communication thực sự — meeting chỉ là 20 phần trăm. Người VN miss point này, gọi nemawashi là gossip hoặc lobbying — sai. Đó là DUE PROCESS. (4) WA (和) HARMONY trên TRUTH: Nhật ưu tiên không gây xáo trộn nhóm trên việc nói thật. Nếu một plan có lỗ hổng nhưng team đã đồng ý, KHÔNG nên public expose lỗ hổng. Approach đúng: gặp riêng leader, dùng cụm betsu no mikata mo aru ka to zonjimasu (có cách nhìn khác). Leader sau đó re-do nemawashi nếu thấy concern hợp lý. Người VN đặt truth trên harmony — cấu trúc xã hội phương Đông hơi khác hẳn nhau ở điểm này. Khi giải thích cho đồng nghiệp VN: nói rằng đây không phải Nhật giấu vấn đề — mà là Nhật xử lý vấn đề qua kênh không công khai để bảo vệ social bond. Khác cấu trúc, không phải khác đạo đức. Mẹo cuối: VN đang ở giai đoạn corporatize theo Nhật/Hàn (chaebol-style hierarchy), nhiều công ty large-scale ở VN (Vingroup, Viettel, FPT) đã adopt một phần Nhật-style. Hiểu Nhật etiquette bằng competitive advantage cho career VN trong 10 năm tới.",
  tip_advice_vi: "Khi đồng nghiệp VN mới hỏi về business etiquette Nhật, ĐỪNG over-explain. Dạy họ 3 quy tắc thực hành cơ bản: (1) Sempai/kohai theo nyuusha-nen (năm join), không theo tuổi. Trước cuộc gặp Nhật, hỏi HR ai là ai. (2) Trước meeting quan trọng, đi gặp riêng từng key person — nemawashi. Không phải gossip, đây là due process. (3) Meishi: hai tay. Đọc to. Để bàn. Cất vào case. Đừng ghi lên. Đừng bỏ túi quần. Ba quy tắc này, thực hiện đúng bằng 80 phần trăm Japanese trust. Còn 20 phần trăm là chi tiết khác (ngồi đúng vị trí, rót rượu đúng cách, tiễn ra cửa đúng), nhưng không cần dạy ngay — học theo quan sát. Mẹo riêng cho đồng nghiệp VN: nói tiếng Nhật KHÔNG phải skill quan trọng nhất — sempai-kohai awareness và nemawashi mindset là quan trọng hơn. Người VN tiếng Nhật N1 mà không hiểu nemawashi vẫn fail. Người VN tiếng Nhật N3 mà thực hiện nemawashi đúng được thăng chức. Khi đồng nghiệp VN sai (ví dụ phát biểu phản đối trong meeting), KHÔNG sửa họ trong meeting (sẽ làm họ mất mặt) — sau meeting đến cafe nói riêng. Một mistake cultural không quá nghiêm trọng nếu được fix nhanh. Một mistake không được fix 6 tháng sẽ thành reputation. Long term: nếu bạn hiểu Nhật etiquette tốt, mentor đồng nghiệp VN trẻ — đây là giá trị bạn không thể outsource. Trong 5 năm, bạn trở thành cultural bridge của team — vai trò này có salary premium 20-30 phần trăm so với cùng level.",
  exercises: [
    { type: "fill-blank", question: "和を以て___となすという考えが、日本のチームワークの基盤です。", answer: "貴し" },
    { type: "matching", instruction: "Ghép thuật ngữ Nhật với khái niệm tương ứng.", pairs: [
      { japanese: "先輩", english: "người vào công ty trước (không liên quan tuổi)" },
      { japanese: "稟議", english: "document circulation cho decision (bottom-up)" },
      { japanese: "根回し", english: "nói riêng từng người trước meeting (pre-consensus)" },
      { japanese: "和", english: "hài hòa nhóm — giá trị cao hơn truth công khai" }
    ] },
    { type: "translation", vietnamese: "Trong công ty Nhật, sempai được quyết định bằng năm vào công ty, không phải tuổi.", japanese: "日本の会社では、先輩は入社年で決まり、年齢ではありません。" }
  ]
},
{
  id: 66,
  title: "Apologizing for a cultural misunderstanding",
  title_vi: "Xin lỗi vì hiểu lầm văn hóa",
  title_en: "Apologizing for a cultural misunderstanding",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "申し訳ございません", english: "I am very sorry (kenjougo of すみません — for serious situations)" },
    { japanese: "認識不足 (にんしきぶそく)", english: "lack of awareness (admitting one's own gap)" },
    { japanese: "配慮 (はいりょ)", english: "consideration / thoughtfulness" },
    { japanese: "失礼 (しつれい)", english: "rudeness / impoliteness" },
    { japanese: "ご無礼 (ごぶれい)", english: "rudeness (formal — used by self about own action)" },
    { japanese: "心よりお詫び申し上げます", english: "I sincerely apologize from the heart (highest apology register)" },
    { japanese: "二度とこのようなことがないよう", english: "so that this never happens again (pledge phrase)" },
    { japanese: "深く反省 (ふかくはんせい)", english: "deeply self-reflect" },
    { japanese: "弁解 (べんかい)", english: "excuse / justification (avoid in apology)" },
    { japanese: "再発防止 (さいはつぼうし)", english: "prevention of recurrence" }
  ],
  examples: [
    { japanese: "先日の件、私の認識不足により、ご無礼を働いてしまいました。誠に申し訳ございませんでした。", english: "Regarding the matter the other day, due to my lack of awareness, I committed rudeness. I am truly sorry." },
    { japanese: "弁解の余地もございません。心よりお詫び申し上げます。", english: "There is no room for excuse. I sincerely apologize from the heart." },
    { japanese: "二度とこのようなことがないよう、深く反省しております。", english: "I am deeply reflecting so that this never happens again." },
    { japanese: "今後は、文化の違いについてさらに学ばせていただきます。", english: "Going forward, I will study cultural differences further." },
    { japanese: "ご寛容なご対応をいただき、重ねて感謝申し上げます。", english: "Thank you again for your magnanimous response." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "山田部長、先日の食事会の件で、お詫びに参りました。", english: "Manager Yamada, I have come to apologize regarding the dinner the other day." },
    { speaker: "山田部長", japanese: "ああ、グエンさん。座ってください。", english: "Ah, Nguyen-san. Please sit." },
    { speaker: "チャウ", japanese: "私の文化に対する認識不足で、ご無礼を働いてしまいました。", english: "Due to my lack of cultural awareness, I committed rudeness." },
    { speaker: "山田部長", japanese: "気にしすぎですよ。学びの過程ですから。", english: "You're worrying too much. It's part of learning." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "山田部長、お時間を頂戴し、誠にありがとうございます。本日は先日の食事会の件で、お詫びに伺いました。", english: "Manager Yamada, thank you sincerely for the time. Today I have come to apologize regarding the dinner the other day." },
    { speaker: "山田部長", japanese: "あの件ですか。座ってください。気になっていたなら、なおさらでしょう。", english: "That matter? Please sit. If it's been on your mind, all the more reason." },
    { speaker: "チャウ", japanese: "はい。先日の田中部長との会食で、私から先にお酒を注いでしまいました。後で先輩から、日本では目上の方からお酒を注いでいただくのが礼儀だと教えていただき、私の認識不足を痛感いたしました。", english: "Yes. At the dinner with Manager Tanaka the other day, I poured sake first. Later my sempai taught me that in Japan, etiquette is to receive sake from the senior first; I deeply realized my lack of awareness." },
    { speaker: "山田部長", japanese: "なるほど。それで気になっていたんですね。", english: "I see. So that's been bothering you." },
    { speaker: "チャウ", japanese: "弁解の余地もございません。田中部長に対しまして、大変なご無礼を働いてしまいました。心よりお詫び申し上げます。", english: "There is no room for excuse. I committed serious rudeness toward Manager Tanaka. I sincerely apologize from the heart." },
    { speaker: "山田部長", japanese: "顔を上げてください。あなたの誠意は十分伝わっています。", english: "Please raise your head. Your sincerity is fully conveyed." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。今後は、日本の食事マナー全般について、さらに学ばせていただきます。具体的には、来週から日本人の同僚と一緒に毎週金曜日に食事会に参加させていただくことを、ご相談したく存じます。", english: "Thank you sincerely. Going forward, I will study Japanese dining manners generally. Specifically, I would humbly like to consult about joining a dinner gathering with Japanese colleagues every Friday from next week." },
    { speaker: "山田部長", japanese: "良い心がけですね。ただ、一つお伝えしたいのは、文化を学ぶことは大切だけれど、過剰に自分を責めないこと。私たち日本人も、ベトナムで知らずに失礼をしているかもしれません。お互い様です。", english: "A good attitude. But one thing I want to convey — learning culture is important, but don't blame yourself excessively. We Japanese also probably commit rudeness in Vietnam without knowing. It's mutual." },
    { speaker: "チャウ", japanese: "そのお言葉、深く心に刻みます。ただ、今回の件につきましては、田中部長にも改めてお詫びの言葉をお伝えしたく存じますが、いかがでしょうか。", english: "I will deeply engrave those words. However, regarding this matter, I would like to convey my apologies to Manager Tanaka again — what do you think?" },
    { speaker: "山田部長", japanese: "それはご丁寧に。田中部長は明日からまたベトナムに来ますから、その時に直接お話しすると良いでしょう。私から田中部長にも、あなたが気にしていたことは伝えておきます。", english: "How polite of you. Manager Tanaka comes back to Vietnam from tomorrow, so it'd be good to speak directly then. I will also tell Manager Tanaka that you've been thinking about it." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。明日、田中部長がいらっしゃいましたら、改めてお詫びいたします。再発防止のため、文化マナー研修にも自主的に参加させていただきます。", english: "Thank you sincerely. When Manager Tanaka arrives tomorrow, I will apologize again. For prevention of recurrence, I will voluntarily attend cultural-manner training." },
    { speaker: "山田部長", japanese: "そこまでしなくても、と言いたいところですが、あなたの真摯な姿勢は素晴らしい。一つだけ。お酒を注ぐ時の順番は文化の違いです。失敗ではなく、学びの機会と捉えてください。", english: "I'd say you don't need to go that far, but your sincere attitude is wonderful. Just one thing — the order for pouring sake is a cultural difference. Take it not as a failure but as a learning opportunity." },
    { speaker: "チャウ", japanese: "ご寛容なお言葉、誠にありがとうございます。過ちては改むるに憚ること勿れと申しますので、しっかりと改善してまいります。", english: "Thank you sincerely for your magnanimous words. As they say do not hesitate to correct your mistakes, I will improve solidly." },
    { speaker: "山田部長", japanese: "良い言葉を知っていますね。じゃあ、明日、田中部長と一緒に三人で昼食でもどうですか。一区切りつけましょう。", english: "You know good phrases. Then how about lunch together tomorrow with Manager Tanaka, the three of us? Let's bring this to a close." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。お招きに与れますこと、心より光栄に存じます。", english: "Thank you sincerely. I am sincerely honored to be invited." },
    { speaker: "山田部長", japanese: "では、明日の十二時に。気をつけて帰ってくださいね。", english: "Then tomorrow at noon. Take care going home." },
    { speaker: "チャウ", japanese: "本日は貴重なお時間を頂戴し、誠にありがとうございました。重ねて、お詫び申し上げます。失礼いたします。", english: "Thank you sincerely for your valuable time today. I again offer my apologies. Excusing myself." }
  ],
  roleplay_prompts: [
    "Bạn vô tình gọi sếp Nhật bằng san thay vì buchou trước mặt khách hàng. Sếp im lặng nhưng bạn biết là awkward. Hãy đến phòng sếp xin lỗi NGAY trong ngày — KHÔNG đợi tuần sau. Dùng cụm watashi no ninshiki busoku ni yori, go-burei wo hatarakimashite cộng moushiwake gozaimasen deshita.",
    "Tại bữa tối với khách Nhật, bạn cắt ngang đối tác cấp cao của họ giữa câu (theo phản xạ VN). Sếp Nhật báo cho bạn sau bữa ăn. Hãy chuẩn bị apology cho cuộc gặp NGÀY MAI với khách — bao gồm: thừa nhận lỗi cụ thể, không bào chữa, đề xuất cách ngừa, đề xuất action remedial.",
    "Bạn từ chối invitation đến nhà đồng nghiệp Nhật vào dịp Obon (rất quan trọng) vì lý do bận. Đồng nghiệp im lặng đột ngột sau đó. Hãy tiếp cận lại — gửi handwritten note xin lỗi, giải thích bạn không hiểu Obon là gia đình tụ họp đặc biệt, đề xuất gặp dịp khác. Tone: deep, không quá long-winded."
  ],
  register_notes: "Apology Nhật KHÔNG giống western I'm sorry, my bad. Bốn cấu trúc bắt buộc: (1) MOUSHIWAKE GOZAIMASEN cho lỗi nhẹ, MOUSHIWAKE GOZAIMASEN DESHITA cho lỗi quá khứ, KOKORO YORI O-WABI MOUSHIAGEMASU cho lỗi nghiêm trọng. KHÔNG dùng sumimasen cho cultural mistake — quá nhẹ. (2) THỪA NHẬN ROOT CAUSE: watashi no ninshiki busoku ni yori (do em thiếu nhận thức), watashi no fuiki ni yori (do em không cẩn thận) — cụ thể về NGUYÊN NHÂN từ phía mình. KHÔNG dùng culture barrier / misunderstanding — bị xem là đổ lỗi cho khái niệm. (3) NO EXCUSES: BENKAI NO YOCHI MO GOZAIMASEN (không có chỗ biện hộ). Sau cụm này, KHÔNG được giải thích tại vì. Apology Nhật là pure ownership, không kèm context. (4) PLEDGE cộng ACTION: nidoto kono youna koto ga nai you, fukaku hansei shite orimasu (em sâu sắc tự kiểm để chuyện này không lặp lại) cộng cụ thể action: saihatsu boushi no tame, XX itashimasu (để ngừa tái phát, em sẽ làm XX). KHÔNG vague pledge — phải có bước concrete. Ngoài ra 4 điều TRÁNH: (a) KHÔNG nói tôi tưởng là (sounds like blaming the other for not clarifying); (b) KHÔNG cười nhẹ trong câu chuyện apology (cười bằng không serious); (c) KHÔNG nhìn xuống đất quá lâu (eye contact intermittent là chuẩn); (d) KHÔNG say thank you khi họ accept apology — say jouken yorishihai itashimasu (em xin được tiếp tục cố gắng thêm). // TODO: native review — ninshiki busoku phrasing — cụm chuẩn business; alternative haien ga itarazu (lack of consideration) cũng dùng được, hơi formal hơn.",
  idiom_glosses: [
    { idiom: "過ちては改むるに憚ること勿れ", literal: "Đã lỗi thì đừng ngại sửa", meaning: "Khi sai thì đừng ngại sửa — gốc Luận Ngữ Khổng Tử. Cụm cao cấp dùng khi cam kết cải thiện sau apology. Show bạn có literacy classical — Nhật rất trọng.", example: "過ちては改むるに憚ること勿れと申しますので、しっかりと改善してまいります。" },
    { idiom: "弁解の余地もございません", literal: "Không có chỗ để biện hộ", meaning: "Cụm cố định trong apology Nhật — biểu thị bạn không có ý bào chữa. Cụm này đẩy weight của apology lên cao — phải dùng cẩn thận, không dùng cho lỗi nhỏ.", example: "弁解の余地もございません。心よりお詫び申し上げます。" },
    { idiom: "深く反省", literal: "Sâu sắc tự kiểm", meaning: "Pledge phrase — biểu thị bạn đã reflect deeply. Khác với I'm sorry phương Tây ở chỗ Nhật mong actual reflection process, không chỉ verbal apology.", example: "二度とこのようなことがないよう、深く反省しております。" },
    { idiom: "石の上にも三年", literal: "Trên đá cũng phải ba năm", meaning: "Kiên trì cải thiện sẽ được đền đáp — phù hợp khi đề xuất quá trình learn cultural manner kéo dài. Show bạn understand đây là long process, không phải one-time fix.", example: "石の上にも三年と申します。日本のマナーを身につけるには時間が必要だと存じます。" }
  ],
  cultural_notes_vi: "Apology Nhật khác phương Tây ở 6 tầng cấu trúc. (1) APOLOGY VÌ SITUATION TỒN TẠI, KHÔNG PHẢI VÌ FAULT. Người Nhật xin lỗi vì tôi đã làm cho bạn khó xử — kể cả khi không có lỗi cụ thể. Câu chuẩn: o-tesuu wo o-kake shimashite (em đã làm phiền), go-meiwaku wo o-kake shimashite (em đã gây phiền). Người VN nghe apology không có lỗi thấy lạ — nhưng đây là proactive apology văn hóa Nhật. (2) APOLOGY DEPTH MATCHES CRIME WEIGHT. Lỗi nhẹ: sumimasen. Lỗi vừa: moushiwake gozaimasen. Lỗi nặng: kokoro yori o-wabi moushiagemasu. Lỗi đặc biệt nghiêm trọng (ảnh hưởng business): saiken (sau khi xác minh) cộng dogeza (quỳ xuống — chỉ trong context xấu nhất). Dùng sai level bằng tệ hơn không xin lỗi. (3) IN-PERSON KHÔNG EMAIL. Apology nghiêm trọng PHẢI in-person. Nếu khoảng cách xa, gọi điện trước, sau đó in-person khi có thể. KHÔNG email/text apology cho lỗi nghiêm trọng — bị xem là cowardice. Bằng chứng bạn sẵn sàng đối mặt bằng serious apology. (4) NO PUBLIC SPECTACLE. Apology in-person nhưng PRIVATE. Đến phòng sếp riêng, KHÔNG xin lỗi giữa văn phòng. Public apology bằng làm sếp mất mặt vì phải xử lý tình huống công khai. (5) ACCEPTANCE BY OTHER PARTY bằng OBLIGATION FOR YOU. Sau khi sếp/đối tác nhận apology, bạn phải show change. Nếu lặp lại lỗi cũ trong 6 tháng, apology lần đầu bị xem như insincere — relationship damaged permanent. Vì vậy, đừng apologize cho điều bạn không sẵn sàng cải thiện. (6) THIRD-PARTY APOLOGY chain. Đôi khi apology phải đi qua sếp của bạn xin lỗi sếp của họ — không xin lỗi trực tiếp peer-to-peer. Đây là face-saving protocol. Hỏi sếp trước về cách correct. Khác biệt với VN: ở VN apology thường ngắn, casual, đi kèm explanation tại vì; ở Nhật apology dài, formal, KHÔNG kèm explanation. Apology là về ownership, không về context. Mẹo cuối: nếu là VN host và làm sai với khách Nhật, KHÔNG đợi đến cuối ngày để xin lỗi — xin lỗi ngay khi nhận ra (nếu trong cùng phòng) hoặc đến phòng họ trong 1-2 giờ. Nhật trọng tốc độ phản ứng — slow apology bằng không nghiêm túc. Một apology kịp thời và chân thành có thể turn incident thành positive memory of integrity — paradox của văn hóa Nhật.",
  tip_advice_vi: "Khi nhận ra mình làm sai cultural, làm 4 bước trong cùng ngày. (1) ASSESS WEIGHT trong 30 phút: lỗi nhẹ (gọi sai title), vừa (cắt ngang sếp), nặng (làm khách mất mặt trước sếp họ). Mỗi level register khác. KHÔNG over-apologize cho lỗi nhẹ (sounds dramatic). KHÔNG under-apologize cho lỗi nặng (sounds dismissive). (2) CONSULT SEMPAI: tìm sempai Nhật / VN-experienced trong công ty, kể tình huống, hỏi cách correct. Đây không phải gossip — đây là due diligence trước khi apologize. (3) PREPARE SPEECH: viết speech ra giấy, đọc thành tiếng. Phải có 4 yếu tố: cụ thể về lỗi, thừa nhận root cause TỪ PHÍA MÌNH, no excuses, pledge action. Speech khoảng 60-90 giây — không quá dài (sounds like manipulation), không quá ngắn (sounds dismissive). (4) DELIVER IN-PERSON: đến phòng sếp/đồng nghiệp, gõ cửa 3 lần, hỏi shoushou o-jikan, yoroshii deshou ka. Đứng cạnh ghế, không ngồi cho đến khi được mời. Cúi 30 độ trước khi nói. Speech với tốc độ chậm hơn bình thường 20 phần trăm — show bạn đã suy nghĩ. Eye contact 70 phần trăm thời gian (nhìn xuống quá lâu bằng không sincerity, nhìn thẳng quá nhiều bằng aggressive). Sau speech, đợi response. KHÔNG fill silence. Người Nhật cần 5-10 giây để absorb. Khi họ accept, dùng cụm jouken yorishihai itashimasu cộng cúi 30 độ lần nữa khi rời. Sau apology, theo dõi 7 ngày: thay đổi behavior MUST visible. Sau 1 tháng, gặp riêng họ thank you cho patience and guidance (đây là follow-up apology — thấp hơn nhưng quan trọng). Sau 3 tháng, lỗi đó chính thức closed nếu không tái phát. Mẹo cuối: KHÔNG giấu mistake hoping nó pass — Nhật rất nhạy với pattern. Nếu họ nhận ra bạn đang giấu, trust drop sâu hơn cả lỗi gốc. Proactive apology gain trust; reactive defense lose trust. Long-term, một apology xử lý tốt bằng relationship deeper than no incident at all. Nghịch lý Nhật.",
  exercises: [
    { type: "fill-blank", question: "弁解の余地も___ません。心よりお詫び申し上げます。", answer: "ござい" },
    { type: "matching", instruction: "Ghép apology level với situation.", pairs: [
      { japanese: "すみません", english: "lỗi nhẹ (đụng nhẹ, đến muộn 5 phút)" },
      { japanese: "申し訳ございません", english: "lỗi vừa (sai email recipient, miss small deadline)" },
      { japanese: "心よりお詫び申し上げます", english: "lỗi nặng (làm khách mất mặt, miss big deadline)" },
      { japanese: "弁解の余地もございません", english: "tự nhận trách nhiệm hoàn toàn (lỗi nghiêm trọng, không có phía nào khác để chia)" }
    ] },
    { type: "translation", vietnamese: "Do em thiếu nhận thức về văn hóa, em đã làm điều thất lễ. Em xin chân thành xin lỗi.", japanese: "私の文化に対する認識不足により、ご無礼を働いてしまいました。心よりお詫び申し上げます。" }
  ]
},
{
  id: 67,
  title: "Conversation at an international conference (Vietnam delegate)",
  title_vi: "Trao đổi tại hội nghị quốc tế (đại diện Việt Nam)",
  title_en: "Conversation at an international conference (Vietnam delegate)",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "国際会議 (こくさいかいぎ)", english: "international conference" },
    { japanese: "代表 (だいひょう)", english: "representative / delegate" },
    { japanese: "発表 (はっぴょう)", english: "presentation" },
    { japanese: "質疑応答 (しつぎおうとう)", english: "Q&A session" },
    { japanese: "ご清聴 (ごせいちょう)", english: "your kind attention (closing presentation phrase)" },
    { japanese: "登壇 (とうだん)", english: "taking the stage / standing at podium" },
    { japanese: "セッション", english: "session" },
    { japanese: "パネリスト", english: "panelist" },
    { japanese: "懇親会 (こんしんかい)", english: "social mixer / networking reception" },
    { japanese: "切磋琢磨 (せっさたくま)", english: "mutual diligent improvement (idiom for academic/professional exchange)" }
  ],
  examples: [
    { japanese: "ベトナム代表団のグエン・ティ・チャウと申します。本日は登壇の機会をいただき、誠にありがとうございます。", english: "I am Nguyen Thi Chau from the Vietnam delegation. Thank you sincerely for the opportunity to take the stage today." },
    { japanese: "本発表では、ベトナムにおける環境工学の最新動向についてご報告いたします。", english: "In this presentation, I will report on the latest trends in environmental engineering in Vietnam." },
    { japanese: "ご質問がございましたら、後ほど質疑応答の時間にお願いいたします。", english: "If you have questions, please save them for the Q&A session." },
    { japanese: "ご清聴、誠にありがとうございました。", english: "Thank you sincerely for your kind attention." },
    { japanese: "懇親会で、ぜひ皆様と切磋琢磨できる機会を持ちたく存じます。", english: "At the social, I humbly wish to have the opportunity to mutually improve with everyone." }
  ],
  dialogue: [
    { speaker: "司会", japanese: "次の発表者は、ベトナムからお越しのグエン・ティ・チャウさんです。", english: "Our next presenter is Ms. Nguyen Thi Chau, who has come from Vietnam." },
    { speaker: "チャウ", japanese: "ご紹介ありがとうございます。本日はよろしくお願いいたします。", english: "Thank you for the introduction. I look forward to today." },
    { speaker: "司会", japanese: "では、十五分間でお願いします。", english: "Then please proceed for fifteen minutes." },
    { speaker: "チャウ", japanese: "承知いたしました。それでは、始めさせていただきます。", english: "Understood. Then I will begin." }
  ],
  dialogue_long: [
    { speaker: "司会", japanese: "皆様、本日はお集まりいただき、ありがとうございます。次のセッションは、東南アジア環境工学の最新動向。最初の発表者は、ベトナム代表団のグエン・ティ・チャウさんです。グエンさんはハノイ工科大学を卒業され、現在トヨタベトナムで品質管理に従事されています。それでは、グエンさん、お願いいたします。", english: "Everyone, thank you for gathering today. The next session is Latest Trends in Southeast Asian Environmental Engineering. Our first presenter is Ms. Nguyen Thi Chau from the Vietnam delegation. Ms. Nguyen graduated from Hanoi University of Science and Technology and currently works in quality control at Toyota Vietnam. Then, Ms. Nguyen, please." },
    { speaker: "チャウ", japanese: "ご紹介、誠にありがとうございます。皆様、こんにちは。ベトナム代表団のグエン・ティ・チャウと申します。本日は登壇の機会をいただき、心より光栄に存じます。", english: "Thank you sincerely for the introduction. Hello everyone. I am Nguyen Thi Chau from the Vietnam delegation. I am sincerely honored to have the opportunity to take the stage today." },
    { speaker: "チャウ", japanese: "本発表では、ベトナム、特にメコンデルタにおける塩害対策の現状と、日本の技術を応用した実証実験の中間報告をいたします。発表は十五分、その後五分間の質疑応答を予定しております。", english: "In this presentation, I will report on the current state of salinization countermeasures in Vietnam, particularly the Mekong Delta, and an interim report on field experiments applying Japanese technology. The presentation is 15 minutes, with 5 minutes of Q&A planned after." },
    { speaker: "チャウ", japanese: "(発表後)以上が私からの報告でございます。ご清聴、誠にありがとうございました。", english: "(after presentation) That concludes my report. Thank you sincerely for your kind attention." },
    { speaker: "司会", japanese: "ありがとうございました。それでは、質疑応答の時間に移ります。ご質問のある方は、挙手をお願いいたします。", english: "Thank you. Now we move to the Q&A session. Those with questions, please raise your hand." },
    { speaker: "質問者A", japanese: "京都大学の中村と申します。興味深いご発表、ありがとうございました。膜分離技術の長期安定性について、現地特有の課題はございますか。", english: "I am Nakamura from Kyoto University. Thank you for the interesting presentation. Regarding long-term stability of membrane separation, are there challenges specific to the local environment?" },
    { speaker: "チャウ", japanese: "ご質問、ありがとうございます。三点ございます。一つ目、年間温度差が日本の二倍以上あるため、膜の熱劣化が早いこと。二つ目、雨季の濁度変動が激しく、前処理が重要であること。三つ目、メンテナンス人材の育成が課題であることでございます。", english: "Thank you for the question. Three points. First, annual temperature swings are over twice Japan's, so thermal degradation of membranes is faster. Second, turbidity variation in rainy season is severe, so pre-treatment is important. Third, training maintenance personnel is a challenge." },
    { speaker: "質問者A", japanese: "なるほど。三つ目について、もう少し詳しくお聞かせください。", english: "I see. On the third point, could you tell me a bit more?" },
    { speaker: "チャウ", japanese: "現地の技術者は、膜技術の基礎研修は受けておりますが、長期運用における異常検知のスキルが不足しております。日本の専門家を招いた一週間の集中研修を年二回実施しておりますが、より体系的な育成プログラムが必要だと考えております。もしよろしければ、後ほど懇親会でも詳しくお話しさせていただきたく存じます。", english: "Local engineers have received basic training in membrane technology, but they lack skills in anomaly detection during long-term operation. We hold one-week intensive training with Japanese experts twice a year, but a more systematic development program is needed. If you don't mind, I would humbly like to discuss in more detail at the social later." },
    { speaker: "質問者A", japanese: "ぜひ、お話しさせてください。私の研究室では、まさにそのような遠隔モニタリングシステムを開発中ですから。", english: "Please, by all means. My lab is developing exactly such a remote monitoring system." },
    { speaker: "チャウ", japanese: "それは大変興味深いお話でございます。一期一会の機会と捉え、ぜひお時間を頂戴させていただきたく存じます。", english: "That's a fascinating topic. Taking it as an ichigo-ichie opportunity, I humbly wish to receive your time." },
    { speaker: "質問者B", japanese: "東京大学の佐藤と申します。実証実験のスケジュールはどのようになっておりますか。", english: "I am Sato from the University of Tokyo. What is the schedule for the field experiments?" },
    { speaker: "チャウ", japanese: "二〇二六年四月から二〇二八年三月までの二年間で、三段階に分けて実施いたします。第一段階は装置設置と初期データ収集、第二段階は乾季・雨季双方での運用検証、第三段階は地元住民を含めた持続可能性評価でございます。", english: "Two years from April 2026 to March 2028, divided into three stages. Stage 1: installation and initial data collection. Stage 2: operation verification in both dry and rainy seasons. Stage 3: sustainability evaluation including local residents." },
    { speaker: "司会", japanese: "残念ながら、お時間となりました。続きは懇親会でお願いいたします。グエンさん、素晴らしい発表をありがとうございました。", english: "Unfortunately, we are out of time. Continue at the social. Ms. Nguyen, thank you for the wonderful presentation." },
    { speaker: "チャウ", japanese: "皆様、貴重なご質問をいただき、誠にありがとうございました。切磋琢磨の場としての本会議に参加できましたこと、心より感謝申し上げます。後ほど、懇親会でお会いできますことを楽しみにしております。", english: "Everyone, thank you sincerely for the valuable questions. I am sincerely grateful to have participated in this conference as a venue for mutual improvement. I look forward to meeting at the social later." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn lên bục presentation lần đầu trước 200 người Nhật. Hãy mở đầu speech với 90 giây tự giới thiệu — tên, đoàn, lý do tham dự conference. Dùng cụm honjitsu wa toudan no kikai wo itadaki, kokoro yori kouei ni zonjimasu (em vô cùng vinh dự được phát biểu hôm nay).",
    "Trong Q&A, một người hỏi câu khó mà bạn không biết câu trả lời cụ thể. KHÔNG fake. Dùng cụm makoto ni moushiwake gozaimasen, sono ten ni tsuite wa, mochi-kaette kakunin sasete itadakimasu (em xin lỗi, em sẽ về xác nhận và liên lạc lại). Đề xuất follow up qua email với business card exchange.",
    "Sau presentation, một giáo sư top university tiếp cận và đề xuất collaboration. Hãy phản hồi NGHIÊM TÚC nhưng không over-commit ngay tại event — dùng cụm zehi maemuki ni go-soudan sasete itadaite mo yoroshii deshou ka cộng đề xuất gặp follow up tại research lab khi có thể."
  ],
  register_notes: "International conference register là public formal — khác business 1-on-1 ở 4 điểm. (1) GREETING TO AUDIENCE: minasama, konnichi wa hoặc minasama, hajimemashite tùy lần đầu hay lặp. KHÔNG dùng yorosiku onegaishimasu mở đầu — câu này là kết thúc, không phải mở. (2) SELF-INTRO IN-FORMAL: KHÔNG dùng kenjougo nặng kiểu watakushi — dùng watashi (formal trung). watakushi reserved cho ceremonial occasions kiểu sokui (enthronement). Public conference dùng watashi đủ. (3) PRESENTATION OPENING-CLOSING CỐ ĐỊNH: mở: honjitsu wa toudan no kikai wo itadaki, kokoro yori kouei ni zonjimasu (vô cùng vinh dự). Đóng: ijou ga watashi kara no houkoku de gozaimasu. Go-seichou, makoto ni arigatou gozaimashita (kết thúc báo cáo, cảm ơn quý vị đã lắng nghe). go-seichou (kính nghe) là từ formal cho audience listening — KHÔNG dùng kiku no koto. (4) Q&A REGISTER: trả lời câu hỏi: go-shitsumon, arigatou gozaimasu cộng câu trả lời. KHÔNG bắt đầu trả lời trước khi xác nhận hiểu câu hỏi. Nếu không nghe rõ: osore irimasu ga, mou ichido go-shitsumon wo o-ukagai shite mo yoroshii deshou ka. Nếu không biết: mochi-kaette kakunin sasete itadakimasu cộng đề xuất follow up. KHÔNG bịa câu trả lời — Nhật đánh giá honesty trên seemingly-knowing. // TODO: native review — sessa-takuma usage in modern academic conference; classical phrase, có thể outdated cho younger academic generations; alternative kenkyuu kouryuu more modern.",
  idiom_glosses: [
    { idiom: "切磋琢磨", literal: "Cắt giũa, mài giũa", meaning: "Cùng nhau cải thiện qua tương tác — gốc Kinh Thi (Trung Quốc cổ). Cụm chuẩn cho academic exchange. Khi networking ở conference, dùng để bày tỏ tinh thần học hỏi lẫn nhau, không cạnh tranh.", example: "懇親会で、ぜひ皆様と切磋琢磨できる機会を持ちたく存じます。" },
    { idiom: "一期一会", literal: "Một đời một lần gặp", meaning: "Mỗi cuộc gặp duy nhất — trong conference context, ý nghĩa là cuộc gặp này đặc biệt — researchers từ nhiều nước về cùng một phòng, có thể không lặp. Dùng để add depth vào networking conversation.", example: "国際会議は一期一会の場でございますので、皆様とのご縁を大切にしたく存じます。" },
    { idiom: "ご清聴", literal: "Nghe trong sự thanh nhã", meaning: "Cụm formal cho sự lắng nghe của quý vị — dùng kết thúc presentation. KHÔNG dùng okiki itadaite arigatou (quá casual). Bỏ qua bằng kết thúc thiếu lễ.", example: "ご清聴、誠にありがとうございました。" },
    { idiom: "三人寄れば文殊の知恵", literal: "Ba người tụ lại có trí tuệ Văn Thù", meaning: "Trí tuệ tập thể — khi networking, dùng để gợi ý collaborative research. Bày tỏ rằng một mình bạn không giải pháp được, cần collaboration.", example: "三人寄れば文殊の知恵と申します。日越共同研究の可能性を探ってまいりたく存じます。" }
  ],
  cultural_notes_vi: "International conference Nhật khác phương Tây ở 6 điểm. (1) THỜI GIAN: cực kỳ chính xác. Slot 15 phút bằng 15 phút, không 16. Người vượt thời gian bị thấy rất tệ. Mang theo timer đặt trên bục, nhìn liên tục. Slide cuối nên là thank you slide để có thể wrap nhanh nếu hết giờ. (2) SLIDE DESIGN: Nhật ưa minimalist — KHÔNG slide với 10 bullet points và images. Mỗi slide 1 ý chính, max 30 chữ. Background trắng, font sans-serif. Animation tối thiểu — KHÔNG slide-in effects, KHÔNG sound effects (làm Nhật khó chịu). (3) Q&A ETIQUETTE: người hỏi thường giới thiệu mình trước (tên cộng university), sau đó hỏi. Bạn cảm ơn câu hỏi trước khi trả lời. Trả lời CỤ THỂ — Nhật ghét vague answers. Nếu không biết, nói thật cộng đề xuất follow up. (4) NETWORKING SAU PRESENTATION: tại konshinkai (mixer), người ta tiếp cận presenter để complement và networking. Bạn cần có business cards (50 cộng) và elevator pitch 30 giây về nghiên cứu. Khi nhận card từ giáo sư top university, treat như sacred — đọc to tên, lưu cẩn thận. (5) DRESS CODE: business formal. Vest đen/navy, áo trắng, giày da. Nữ buộc tóc, makeup nhẹ. KHÔNG dress local (áo dài) trừ khi conference yêu cầu cultural showcase. (6) PHOTO/SOCIAL MEDIA: trước khi chụp ảnh, hỏi permission (shashin wo tora-sete itadaite mo yoroshii deshou ka). KHÔNG post photo lên LinkedIn/Twitter mà không hỏi. Conference thường có official photographer — wait for their photos để post. Khác biệt với VN: ở VN conference thường relaxed, có thể đến muộn 5 phút, presenter có thể chuẩn bị tại chỗ; ở Nhật, mỗi giây trên stage được đo lường kỹ. Investment vào conference Nhật trả ROI dài hạn — một presentation tốt có thể mở 5-10 collaboration opportunity trong 5 năm. Mẹo: chuẩn bị 3 killer slides — slide có insight unique sẽ được people nhắc đến trong networking. Một insight unique trên một presentation hoàn hảo nhưng generic.",
  tip_advice_vi: "Trước conference 1 tháng: nộp abstract chính xác (1 trang Nhật cộng 1 trang Anh), check biographical info trên program (sai tên bằng thảm họa), confirm travel cộng hotel. Trước conference 1 tuần: rehearse presentation 5 lần, đo thời gian từng slide. Mục tiêu: 13 phút (để có 2 phút buffer). In handout — copy slide black-and-white in cứng cho 50 người (phòng khi audience thiếu in trước). Mang USB drive backup cho slides (không trust internet). Ngày conference: đến venue 1 giờ trước session của bạn. Test laptop tại bục với staff. Confirm microphone, projector working. Walk on stage trước 1 lần để feel space. Trong presentation: nói CHẬM HƠN bình thường 15 phần trăm — Nhật cần thời gian xử lý English/Japanese accent. Eye contact: chia phòng làm 3 zone (trái, giữa, phải), mỗi zone 1/3 thời gian. KHÔNG đọc từ slide — chỉ glance. Sau session, ở quanh stage 5 phút để người tiếp cận hỏi/networking — KHÔNG rời ngay. Tại konshinkai (social): mang 50 business cards, target gặp 10 people quality (không 30 people superficial). Mỗi cuộc nói 5-7 phút, exchange card, write 1 note ở mặt sau card về cuộc nói. Sau conference 24 giờ: gửi email cảm ơn cho mỗi người bạn exchange card (10 emails). Email format: cảm ơn cuộc gặp tại conference (tên cộng ngày), nhắc 1 điểm cụ thể họ nói, đề xuất follow up. Cá nhân hóa MỖI email — KHÔNG copy-paste. Email này biến card từ inert paper thành active connection. Long-term: lưu connection trên LinkedIn (chỉ sau email cảm ơn), gửi New Year card hand-written tháng 1 mỗi năm. Conference Nhật là long game — connection 5 năm sau có thể giới thiệu bạn vào lab top, vào job MNC. Đầu tư presentation quality và networking discipline.",
  exercises: [
    { type: "fill-blank", question: "ご___、誠にありがとうございました。", answer: "清聴" },
    { type: "matching", instruction: "Ghép cụm conference với tình huống.", pairs: [
      { japanese: "ご紹介ありがとうございます", english: "đáp lại MC giới thiệu mình lên bục" },
      { japanese: "ご清聴ありがとうございました", english: "kết thúc presentation (cảm ơn lắng nghe)" },
      { japanese: "ご質問ありがとうございます", english: "mở đầu trả lời câu hỏi từ audience" },
      { japanese: "切磋琢磨", english: "tinh thần học hỏi lẫn nhau (đặc biệt cho academic networking)" }
    ] },
    { type: "translation", vietnamese: "Em xin lỗi, về điểm đó, em sẽ về xác nhận và liên lạc lại.", japanese: "誠に申し訳ございません、その点につきましては、持ち帰って確認させていただきます。" }
  ]
},
{
  id: 68,
  title: "Dinner with a Japanese guest discussing food and customs",
  title_vi: "Bữa tối với khách Nhật bàn về ẩm thực và phong tục",
  title_en: "Dinner with a Japanese guest discussing food and customs",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "お食事 (おしょくじ)", english: "meal (sonkeigo of meshi)" },
    { japanese: "いただきます", english: "I humbly receive (said before eating — ritual)" },
    { japanese: "ごちそうさまでした", english: "thanks for the feast (said after eating)" },
    { japanese: "お口に合う (おくちにあう)", english: "to suit one's palate (asking if guest likes food)" },
    { japanese: "辛い (からい)", english: "spicy" },
    { japanese: "薄味 (うすあじ)", english: "lightly seasoned (Japanese preference)" },
    { japanese: "濃い味 (こいあじ)", english: "strongly seasoned" },
    { japanese: "お酒 (おさけ)", english: "alcoholic beverage / sake" },
    { japanese: "苦手 (にがて)", english: "not good with / can't handle (used to politely decline food/drink)" },
    { japanese: "同じ釜の飯 (おなじかまのめし)", english: "rice from the same pot (idiom: bonding through shared meals)" }
  ],
  examples: [
    { japanese: "お口に合うかどうか分かりませんが、ぜひ召し上がってみてください。", english: "I'm not sure if it suits your palate, but please try it." },
    { japanese: "ベトナム料理は、ハーブを多く使うのが特徴でございます。", english: "Vietnamese cuisine is characterized by abundant use of herbs." },
    { japanese: "辛さは、お好みで調整いただけます。", english: "Spice level can be adjusted to your preference." },
    { japanese: "お酒、いかがですか。お注ぎいたします。", english: "How about a drink? Let me pour for you." },
    { japanese: "同じ釜の飯を食う仲、と申しますが、本日のお食事を通じて、より親しくなれましたら幸いでございます。", english: "As they say eating from the same pot, I would be glad if today's meal brings us closer." }
  ],
  dialogue: [
    { speaker: "山田部長", japanese: "わあ、これは綺麗な料理ですね。何という料理ですか。", english: "Wow, this is a beautiful dish. What is it called?" },
    { speaker: "チャウ", japanese: "これは「生春巻き」、ベトナム語で「ゴイ・クオン」と申します。エビと豚肉、野菜を米紙で巻いたものでございます。", english: "This is summer roll — goi cuon in Vietnamese. Shrimp, pork, and vegetables wrapped in rice paper." },
    { speaker: "山田部長", japanese: "ヘルシーで美味しそうですね。タレは何ですか。", english: "Healthy and delicious-looking. What's the sauce?" },
    { speaker: "チャウ", japanese: "ピーナッツソースでございます。お口に合えばよろしいのですが。", english: "Peanut sauce. I hope it suits your palate." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "山田部長、お席はこちらでございます。サイゴン川が見える窓側のお席をご用意いたしました。", english: "Manager Yamada, your seat is here. We've prepared a window seat overlooking the Saigon River." },
    { speaker: "山田部長", japanese: "わあ、素敵な眺めですね。気を遣っていただいて。", english: "Wow, lovely view. Thank you for the consideration." },
    { speaker: "チャウ", japanese: "本日は本場のベトナム料理をお楽しみいただきたく存じます。お酒は何になさいますか。ベトナムビール、フランスワイン、それとも日本酒もご用意がございます。", english: "Today I hope you enjoy authentic Vietnamese cuisine. What will you have to drink? We have Vietnamese beer, French wine, and Japanese sake too." },
    { speaker: "山田部長", japanese: "せっかくですから、ベトナムビールを。ベトナムらしい銘柄はありますか。", english: "Since I'm here, Vietnamese beer. Is there a Vietnamese brand?" },
    { speaker: "チャウ", japanese: "「サイゴンビール」と「333(バーバーバー)」が有名でございます。サイゴンビールは少し甘め、333は辛口でございます。", english: "Saigon Beer and 333 (ba-ba-ba) are famous. Saigon Beer is a bit sweet, 333 is dry." },
    { speaker: "山田部長", japanese: "じゃあ、サイゴンビールで。グエンさんは?", english: "Then Saigon Beer. And you?" },
    { speaker: "チャウ", japanese: "私もご一緒させていただきます。乾杯の前に、お一つお注ぎいたします。", english: "I'll have the same. Before the toast, let me pour for you." },
    { speaker: "山田部長", japanese: "(乾杯)それでは、グエンさん、本日もありがとうございました。乾杯。", english: "(toast) Then, Nguyen-san, thank you for today. Cheers." },
    { speaker: "チャウ", japanese: "乾杯。お料理を順番にお持ちいたします。まずは前菜の生春巻き、続きまして、フォーボー、そして主菜にバインセオをご用意しております。", english: "Cheers. The food will come in order. First, summer rolls as appetizer; then, beef pho; for the main, banh xeo." },
    { speaker: "山田部長", japanese: "バインセオって何ですか。", english: "What's banh xeo?" },
    { speaker: "チャウ", japanese: "ベトナム風お好み焼きと申しますか、米粉で作った薄いクレープに、エビと豚肉、もやしを包んだ料理でございます。レタスに巻いて、ヌクマムというお魚のソースでお召し上がりいただきます。", english: "It's like a Vietnamese okonomiyaki — a thin crepe made of rice flour, with shrimp, pork, and bean sprouts inside. Wrapped in lettuce and eaten with nuoc mam, a fish sauce." },
    { speaker: "山田部長", japanese: "面白そうですね。日本のお好み焼きと違うんですね。", english: "Sounds interesting. Different from Japanese okonomiyaki." },
    { speaker: "チャウ", japanese: "全く違うのですが、似た発想がございます。日本では「お互い様」と申しますが、ベトナムでも「同じ釜の飯」のような考えがございまして、家族で大皿を分け合って食べることが多いです。", english: "Completely different, but similar thinking exists. In Japan you say oogami (mutual), and in Vietnam there's a similar idea of eating from the same pot — often sharing large plates as family." },
    { speaker: "山田部長", japanese: "なるほど。日本では一人前ずつ盛りつけることが多いですが、シェアして食べると会話も弾みそうですね。ところで、辛さはどのくらいですか。私、辛いのは少し苦手で。", english: "I see. In Japan we often serve individual portions, but sharing must liven up conversation. By the way, how spicy? I'm not great with spicy." },
    { speaker: "チャウ", japanese: "ご安心ください。事前にシェフに、辛さは控えめにとお伝えしております。テーブルのチリソースで、お好みで調整いただけます。", english: "Please don't worry. I told the chef in advance to keep spice mild. You can adjust with chili sauce on the table to your taste." },
    { speaker: "山田部長", japanese: "それは助かります。ところで、ヌクマム、独特の香りですね。", english: "That helps. By the way, nuoc mam has a unique aroma." },
    { speaker: "チャウ", japanese: "発酵させた魚から作るので、最初は匂いに驚かれる方が多いです。日本の魚醤、しょっつるに似ていると言われます。鼻ではなく口で味わっていただくと、奥深い旨味がございます。", english: "Made from fermented fish, so many are surprised by the smell at first. People say it's similar to Japanese shottsuru fish sauce. If you taste with your mouth instead of nose, there's deep umami." },
    { speaker: "山田部長", japanese: "なるほど、しょっつるの仲間ですね。それなら日本人の口にも合いますね。", english: "I see, related to shottsuru. Then it'll suit Japanese palates." },
    { speaker: "チャウ", japanese: "はい、多くの日本の方が、二度目以降は好きになられます。一期一会のお食事でございますから、ぜひお楽しみいただきたく存じます。", english: "Yes, many Japanese come to love it after the second time. This is an ichigo-ichie meal, so please enjoy it." },
    { speaker: "山田部長", japanese: "ありがとう、グエンさん。今日のおもてなし、本当に嬉しいです。", english: "Thank you, Nguyen-san. Today's hospitality is truly delightful." },
    { speaker: "チャウ", japanese: "こちらこそ、お時間を共にできること、心より光栄に存じます。同じ釜の飯を食う仲、これからも長くお付き合いいただければ幸いでございます。", english: "On the contrary, I am sincerely honored to share this time. As fellows of the same rice pot, I would be grateful for our continued long association." }
  ],
  roleplay_prompts: [
    "Khách Nhật đang ngại không dám thử nuoc mam vì mùi mạnh. Hãy giải thích nguồn gốc của nuoc mam (lên men cá), kết nối với shottsuru (Nhật fish sauce), đề xuất cách thử (taste với miệng không phải mũi). KHÔNG ép họ ăn — kanou deshitara cộng o-shimi ni narareru kata mo irasshaimasu yo.",
    "Khách Nhật từ chối uống thêm rượu (đã uống 2 ly). Hãy KHÔNG ép thêm — văn hóa Nhật chấp nhận từ chối lần đầu. Đề xuất alternative: trà, nước hoa quả. Dùng cụm o-cha demo o-mochi shimashou ka cộng đảm bảo họ feel comfortable.",
    "Khách Nhật hỏi tại sao VN ăn family-style (chung đĩa) thay vì individual portions. Hãy giải thích từ góc cultural — connection và gia đình ở VN, nuôi dưỡng qua bữa ăn chung. Dùng cụm onaji kama no meshi và contrast với JP individual portion mà KHÔNG so sánh thắng/thua."
  ],
  register_notes: "Bữa tối với khách Nhật, register hơi thấp hơn meeting (vì food relaxes mood) NHƯNG vẫn keigo nếu khách là sếp/business client. Ba điểm điều chỉnh: (1) DRINK ETIQUETTE: rót cho khách trước, để khách rót cho mình. KHÔNG tự rót. Khi nhận, cầm cốc bằng hai tay, hơi cúi đầu. Câu khi rót: o-tsugi shimasu hoặc dou-zo. Câu khi nhận: itadakimasu cộng cảm ơn. Toast: kanpai (KHÔNG chichin). (2) FOOD INTRODUCTION: giới thiệu món với 3 phần: (a) tên Nhật / Anh, (b) tên VN, (c) ingredients chính cộng cách ăn. Cụm: kochira wa XX (tên Nhật) — betonamu de wa YY to moushimasu (tên VN). Mỗi món max 30 giây giới thiệu — KHÔNG lecture food history (nhàm). (3) SPICE/INGREDIENT WARNING: trước khi món đến, warn nếu spicy/funky: kochira no ryouri wa, sukoshi karame de gozaimasu (món này hơi cay). Đề xuất tự tune. KHÔNG để khách shock. Cụm khi khách ngại: muri ni mesh-iagaranakute, daijoubu de gozaimasu (không cần ép, không sao). Nói cụm này cho khách feel comfortable từ chối — Nhật ngại từ chối, bạn pre-empt cho họ. Khi khách thử và thích, dùng o-kuchi ni atte saiwai de gozaimasu (vui vì hợp khẩu vị). Khi khách thử nhưng không thích, KHÔNG hỏi tại sao — chuyển topic: betsu no ryouri mo go-junbi shite orimasu node, dochira ka o-meshi-agari kudasai (có món khác, mời thử). // TODO: native review — onaji kama no meshi cụm hơi formal/old, nhiều người Nhật trẻ không dùng; có thể thay bằng oogami sama hoặc shoku-taku wo kakomu nakama mềm mại hơn.",
  idiom_glosses: [
    { idiom: "同じ釜の飯を食う", literal: "Ăn cơm cùng nồi", meaning: "Cùng ăn cơm cùng nồi bằng chia sẻ cuộc sống thân mật bằng bạn bè/đồng đội thân thiết. Cụm thường dùng giữa đồng nghiệp lâu năm hoặc samurai cùng đoàn. Trong context VN-JP dinner, dùng để bày tỏ mong muốn deepen relationship.", example: "同じ釜の飯を食う仲、これからも長くお付き合いいただければ幸いでございます。" },
    { idiom: "腹を割って話す", literal: "Mổ bụng ra mà nói chuyện", meaning: "Nói chuyện thẳng thắn, không che giấu — thường xảy ra sau vài ly rượu. Trong dinner culture Nhật, đây là moment chuyển từ formal sang real conversation. Bạn không khởi xướng — đợi khách Nhật.", example: "お酒も入りましたから、腹を割ってお話ししましょうか。" },
    { idiom: "酒は百薬の長", literal: "Rượu là vị thuốc đầu trong trăm vị thuốc", meaning: "Rượu uống vừa phải là tốt cho sức khỏe — gốc Hán cổ. Cụm classical dùng để justify uống rượu xã giao. KHÔNG dùng để encourage uống nhiều.", example: "酒は百薬の長と申しますが、お一杯だけでもいかがでしょうか。" },
    { idiom: "一期一会", literal: "Một đời một lần gặp", meaning: "Mỗi cuộc gặp duy nhất — gốc trà đạo. Trong dinner context, dùng để nâng tầm bữa ăn từ meal lên memorable shared experience. Phù hợp khi cảm ơn end of dinner.", example: "本日のお食事は一期一会の機会でございます。心より光栄に存じます。" }
  ],
  cultural_notes_vi: "Dinner với khách Nhật khác Western dinner ở 7 điểm. (1) SEAT POSITIONING: khách ngồi vị trí KAMIZA (vị trí xa cửa, có view tốt nhất). Bạn ngồi vị trí SHIMOZA (gần cửa, để dễ ra ngoài giao thiệp với staff). KHÔNG để khách phải tự chọn ghế. (2) BIA TRƯỚC SAKE: nguyên tắc japanese dinner: bia là first drink (toripiizu — beer first), sau đó switch sang rượu (sake/wine). Hỏi khách first drink: toriaezu nan ni sasete itadakimashou ka. (3) FOOD ORDERING: bạn order cho cả bàn — KHÔNG để khách tự order (lúng túng với menu VN). Hỏi preference (thịt, hải sản, vegetarian, allergy) trước khi đến nhà hàng, order based on info. (4) CHOPSTICK ETIQUETTE: KHÔNG cắm đũa vào cơm thẳng đứng (như nghi lễ tang). KHÔNG chuyền thức ăn từ đũa sang đũa (cũng nghi lễ tang). KHÔNG chỉ trỏ bằng đũa. KHÔNG đặt đũa ngang trên cốc/đĩa khi nói chuyện — đặt trên hashioki (gác đũa). Người Nhật để ý chi tiết này. (5) NUOC MAM CONCERN: nhiều người Nhật ngại fish sauce vì mùi. Pre-empt warn về mùi, kết nối với shottsuru (fish sauce JP), đề xuất thử cách taste với miệng (không mũi). KHÔNG offer cho khách dạng riêng — bring small dish bạn dùng minh họa. (6) LEFTOVERS: ở VN để leftover là OK; ở Nhật hơi waste. Nếu khách không ăn hết, KHÔNG hỏi tại sao — assume họ no. Order lượng vừa đủ (3-4 món cho 2 người), không over-order. (7) PAYMENT: bạn (host) trả ALL. KHÔNG split bill. Khi khách offer trả, từ chối lịch sự nhiều lần (3 lần): douzo, watashitachi no obanrou de gozaimasu (đây là trách nhiệm của em phía bên này). Sau lần thứ 3, khách sẽ accept. (8) TIMING: dinner Nhật lý tưởng 90-120 phút — KHÔNG kéo dài 3-4 giờ. Sau khi món chính xong, đề xuất dessert/coffee. Sau dessert, signal end với o-saki ni shitsurei sasete itadaite mo yoroshii deshou ka. Cuối bữa, gọi taxi cho khách về hotel — KHÔNG để khách tự đi. Khác biệt với VN: ở VN dinner là bonding, có thể kéo dài nhiều giờ với uống nhiều; ở Nhật, dinner là structured event với quy tắc. Khi khách Nhật thoải mái và muốn nijikai (afterparty), bạn host nijikai (bar/karaoke). Đây là moment quan hệ thực sự sâu thêm.",
  tip_advice_vi: "Trước dinner: confirm dietary restrictions (allergy, vegetarian, religious — Nhật có thể có kosher Buddhist không ăn thịt). Reserve table window-side với view tốt. Order omakase style với chef trước — pre-set 5 courses tránh khách lúng túng menu. Mua sake/whisky thật tốt (1-2M VND) cho dinner — show value to guest. Ngày dinner: đến nhà hàng 15 phút trước khách. Confirm bàn, kiểm tra menu, gặp chef (giải thích spice level cho khách Nhật). Đặt menu English/Japanese trên bàn (in trước nếu nhà hàng không có). Khi khách arrive, đứng dậy chào, hai tay chỉ ghế kamiza. Order drinks ngay — toriaezu beer là default an toàn. Khi khách ngồi xuống, giới thiệu menu trong 30 giây mỗi món — biết tên Nhật/Anh/VN, ingredients chính, cách ăn. Trong bữa: rót drink khi cốc khách dưới 1/3 đầy. Eat slowly — match speed with khách (KHÔNG ăn nhanh hơn). Conversation 70 phần trăm về non-business (food, travel, family) ở khúc đầu, 30 phần trăm business cuối bữa nếu khách bring up. KHÔNG bring up business sensitive trong bữa — Nhật xem food sacred, không nên mix với khó khăn business. Cuối bữa: order dessert cộng tea (không coffee — sleep disruption cho khách jetlag). Khi check arrive, tự ký tên BẰNG cách lén lúc khách vào toilet — KHÔNG drama tranh trả tiền. Sau dinner: walk khách ra cửa, đợi taxi, mở cửa taxi cho khách. Vẫy tay đến khi taxi khuất tầm nhìn (kakubetsu no aisatsu - chuẩn mực Nhật). Trong vòng 30 phút, gửi tin nhắn ngắn: honjitsu wa makoto ni arigatou gozaimashita. O-yasumi nasaimase. Mai ngày, gửi email cảm ơn formal hơn với 1 reference đến cuộc nói chuyện cụ thể trong bữa. Long-term: ghi note về preference của khách (khẩu vị, dị ứng, brand bia thích) — lần sau khách đến VN, replicate experience ở level cao hơn. Memory of preferences bằng highest form of omotenashi.",
  exercises: [
    { type: "fill-blank", question: "お口に___かどうか分かりませんが、ぜひ召し上がってみてください。", answer: "合う" },
    { type: "matching", instruction: "Ghép cụm dinner với tình huống.", pairs: [
      { japanese: "お注ぎいたします", english: "đề xuất rót đồ uống cho khách (host's role)" },
      { japanese: "お口に合う", english: "hỏi/diễn tả thức ăn có hợp khẩu vị không" },
      { japanese: "苦手", english: "khách diễn tả không thích/không hợp món gì" },
      { japanese: "同じ釜の飯", english: "biểu thị bonding qua bữa ăn chung (idiom)" }
    ] },
    { type: "translation", vietnamese: "Em đã nói trước với đầu bếp giảm độ cay rồi. Anh có thể tự điều chỉnh bằng nước sốt ớt trên bàn.", japanese: "事前にシェフに、辛さは控えめにとお伝えしております。テーブルのチリソースで、お好みで調整いただけます。" }
  ]
},
{
  id: 69,
  title: "Explaining Tết to a Japanese person",
  title_vi: "Giải thích Tết với người Nhật",
  title_en: "Explaining Tết to a Japanese person",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "旧正月 (きゅうしょうがつ)", english: "Lunar New Year (the term Japanese use for Tết)" },
    { japanese: "ベトナム正月 (ベトナムしょうがつ)", english: "Vietnamese New Year (alternative term)" },
    { japanese: "お年玉 (おとしだま)", english: "New Year money gift (Japan's equivalent of li xi)" },
    { japanese: "親戚 (しんせき)", english: "relatives" },
    { japanese: "一族 (いちぞく)", english: "extended family / clan" },
    { japanese: "祖先 (そせん)", english: "ancestors" },
    { japanese: "供える (そなえる)", english: "to offer (food/incense to ancestors)" },
    { japanese: "初詣 (はつもうで)", english: "first shrine visit of the year (Japanese parallel)" },
    { japanese: "縁起 (えんぎ)", english: "auspiciousness / luck-omen" },
    { japanese: "新年 (しんねん)", english: "new year" }
  ],
  examples: [
    { japanese: "ベトナムのテトは、日本のお正月とお盆を合わせたような大きなお祭りでございます。", english: "Vietnam's Tet is a major festival like Japan's New Year and Obon combined." },
    { japanese: "旧暦に従いますので、毎年一月下旬から二月中旬の間に変わります。", english: "It follows the lunar calendar, so it shifts annually between late January and mid-February." },
    { japanese: "家族・親戚で集まり、祖先にお供えをするのが中心でございます。", english: "Gathering with family and relatives and making offerings to ancestors is the core." },
    { japanese: "「リーシー」と呼ばれるお年玉のような風習もございます。", english: "There's also a custom like otoshidama called li xi." },
    { japanese: "もしご興味があれば、来年のテトに、ベトナム人のご家庭にお招きすることもできますよ。", english: "If you're interested, next Tet, I could invite you to a Vietnamese household." }
  ],
  dialogue: [
    { speaker: "田中さん", japanese: "ベトナムの「テト」って、いつですか。", english: "When is Vietnam's Tet?" },
    { speaker: "チャウ", japanese: "旧暦の一月一日でございます。今年は二月十日でした。", english: "The 1st of the lunar new year. This year it was February 10." },
    { speaker: "田中さん", japanese: "中国のお正月と一緒ですね。", english: "Same as Chinese New Year, then." },
    { speaker: "チャウ", japanese: "はい、暦は同じですが、過ごし方には違いがございます。", english: "Yes, same calendar, but different ways of celebrating." }
  ],
  dialogue_long: [
    { speaker: "田中さん", japanese: "グエンさん、来週から会社が一週間休みって聞いて、びっくりしました。テト、ですよね。", english: "Nguyen-san, I heard the company is closed for a week from next week — surprised. It's Tet, right?" },
    { speaker: "チャウ", japanese: "はい、テトでございます。日本の方には一週間が長く感じられるかもしれませんが、ベトナムでは一年で一番大切なお祭りなんです。", english: "Yes, Tet. A week may feel long for Japanese, but in Vietnam it's the most important festival of the year." },
    { speaker: "田中さん", japanese: "中国のお正月と同じ日ですよね。具体的に、何をするんですか。", english: "Same date as Chinese New Year, right? Specifically, what do you do?" },
    { speaker: "チャウ", japanese: "はい、暦は中国と同じです。ただ、過ごし方には違いがございます。ベトナムのテトは、家族と祖先を中心とした行事でございます。日本のお正月とお盆を合わせたようなイメージかもしれません。", english: "Yes, same calendar as China. But the way of spending it differs. Vietnam's Tet is centered on family and ancestors. Maybe like combining Japan's New Year with Obon." },
    { speaker: "田中さん", japanese: "なるほど、お盆も含むんですね。具体的に、家族で何をするんですか。", english: "I see, includes Obon too. Concretely, what does the family do?" },
    { speaker: "チャウ", japanese: "テトの前日は大晦日のように、家族全員が実家に集まります。多くの場合、都会で働く子供たちが田舎の親元に戻ります。これを「帰省」と日本語で言いますね。", english: "The day before Tet is like New Year's Eve — the whole family gathers at the parental home. In many cases, children working in cities return to parents in the countryside. This is kisei in Japanese." },
    { speaker: "田中さん", japanese: "日本のお盆や正月の帰省ラッシュと同じですね。新幹線とか飛行機が混雑するんでしょうね。", english: "Same as Japan's Obon or New Year homecoming rush. Trains and planes must be crowded." },
    { speaker: "チャウ", japanese: "全くその通りでございます。テトの一週間前から空港、バスターミナルが大混雑です。航空券は半年前から予約しないと取れません。", english: "Exactly. From a week before Tet, airports and bus terminals are extremely crowded. You need to book flights half a year in advance or you can't get them." },
    { speaker: "田中さん", japanese: "それで、家族が集まったら、何をするんですか。", english: "So once family gathers, what do you do?" },
    { speaker: "チャウ", japanese: "三つの中心的な活動がございます。一つ目、お墓参りと祖先への供物。家系の祭壇に、果物、お花、お線香、そして「バインチュン」というもち米のお餅をお供えします。", english: "Three central activities. First, grave visits and offerings to ancestors. We place fruits, flowers, incense, and banh chung — sticky-rice cakes — on the family altar." },
    { speaker: "田中さん", japanese: "バインチュン、緑色の四角いお餅ですよね。スーパーで見ました。", english: "Banh chung — green square cakes? I saw them in the supermarket." },
    { speaker: "チャウ", japanese: "はい、バナナの葉で包んでありますので、緑色になります。中には豚肉と緑豆が入っております。テトに必ず食べる伝統のお菓子でございます。", english: "Yes, wrapped in banana leaves so they're green. Pork and mung beans inside. A traditional food eaten without fail at Tet." },
    { speaker: "田中さん", japanese: "なるほど、食文化も大切なんですね。あと二つの活動は?", english: "I see, food culture matters too. And the other two activities?" },
    { speaker: "チャウ", japanese: "二つ目は、年配の方への挨拶回り。子供は祖父母、両親、おじおばに挨拶し、健康と長寿を祝います。日本の「お正月のお年玉」と似た「リーシー」という風習がございまして、年配の方が子供に赤い封筒に入れたお金を渡します。", english: "Second, greetings to elders. Children visit grandparents, parents, uncles and aunts, wishing them health and longevity. There's a custom called li xi, similar to Japan's otoshidama — elders give children money in red envelopes." },
    { speaker: "田中さん", japanese: "お年玉と同じですね。金額もだいたい決まっているんですか。", english: "Same as otoshidama. Are amounts roughly fixed too?" },
    { speaker: "チャウ", japanese: "新札を入れることが大切でございます。古いお札はテトに使いません。金額は子供の年齢と関係性によりますが、一万ドンから百万ドン、日本円ですと数十円から数千円程度です。", english: "Putting in new bills is important. Old bills aren't used for Tet. The amount depends on the child's age and relationship — from 10,000 dong to 1 million dong, roughly tens to thousands of yen." },
    { speaker: "田中さん", japanese: "三つ目は?", english: "And the third?" },
    { speaker: "チャウ", japanese: "三つ目は、初日のお客様を迎える「初客」の習慣でございます。新年最初に家に入る人によって、その家の一年の運勢が決まると信じられております。ですから、縁起の良い人物、健康で成功している人を初客に招くのが習慣でございます。", english: "Third is the first guest custom. It's believed the first person to enter the house in the new year determines the household's fortune for the year. So inviting an auspicious person — healthy, successful — as first guest is the custom." },
    { speaker: "田中さん", japanese: "面白い習慣ですね。日本の「初詣」と少し似ているかもしれません。新年の運勢を祈るところが。", english: "Interesting custom. Maybe a bit like Japan's hatsumode — praying for new year's fortune." },
    { speaker: "チャウ", japanese: "全くその通りでございます。文化は違っても、新年に運勢を願う気持ちは共通でございますね。もしご興味があれば、来年のテトに、私の家にお招きしますよ。本物のバインチュンを母が作っていますので、ぜひ召し上がっていただきたいです。", english: "Exactly. Even with cultural differences, the wish for fortune at new year is shared. If you're interested, next Tet I'll invite you to my home. My mother makes real banh chung — I'd like you to try it." },
    { speaker: "田中さん", japanese: "本当ですか。それは光栄です。ぜひお願いします。", english: "Really? That's an honor. Please." },
    { speaker: "チャウ", japanese: "袖振り合うも他生の縁と申します。来年のテトに、ぜひ。", english: "As they say, even a brushed sleeve is a karmic bond. Definitely next Tet." }
  ],
  roleplay_prompts: [
    "Đồng nghiệp Nhật hỏi Tết có phải là Chinese New Year không. Hãy trả lời TINH TẾ — KHÔNG nói không phải Trung Quốc (defensive), KHÔNG nói giống Trung Quốc (loss of identity). Dùng cụm koyomi wa onaji desu ga, sugoshi-kata wa kotonatte orimasu (lịch giống nhau, nhưng cách sống khác nhau) và giải thích 1-2 nét đặc trưng VN.",
    "Đồng nghiệp Nhật xin nghỉ làm để celebrate Tet với bạn (không phải kì nghỉ chính thức, đó là tuần làm việc của bạn). Hãy giải thích politely — Tết là FAMILY-only event, không invite outsiders trong những ngày đầu tiên (kiêng người lạ). Đề xuất gặp họ ngày thứ 5-6 sau Tết (an toàn để invite).",
    "Sếp Nhật hỏi Có nên gửi New Year card cho đối tác VN dịp Tết không. Trả lời: KHÔNG dịp 1/1 (vì VN dùng lịch âm), DỊP Tết âm là tốt nhưng phải gửi VN card với hình hoa mai/hoa đào, không phải nengajou Nhật. Đề xuất pre-translate message tiếng VN."
  ],
  register_notes: "Khi giải thích Tết cho người Nhật, register lựa cẩn thận — đây là cultural identity moment. Bốn patterns: (1) PARALLEL HÓA QUA JP CONCEPT: nói Tết là kết hợp oshougatsu cộng obon giúp người Nhật understand. KHÔNG explain abstract — họ cần concrete reference. Cụm chuẩn: nihon no oshougatsu to obon wo awaseta you na (giống combine New Year và Obon). (2) DIFFERENTIATE FROM CHINESE: nhiều người Nhật assume Tết bằng Chinese New Year. Dùng cụm koyomi wa chuugoku to onaji desu ga, sugoshi-kata wa kotonatte orimasu (lịch giống Trung Quốc nhưng cách sống khác nhau). Sau đó nêu 1-2 đặc trưng VN cụ thể: bánh chưng, lì xì, thờ cúng tổ tiên, hoa mai/hoa đào. KHÔNG defensive nationalism — chỉ neutral facts. (3) TERMINOLOGY: dùng katakana テト (Tet) cho từ riêng. KHÔNG dịch sang kyuushougatsu trừ khi cần generalize. Bánh chưng giữ là バインチュン. Lì xì giữ là リーシー. Đây là vocabulary loanwords — Nhật thích chuẩn xác trong dịch tên riêng. (4) INVITATION ETIQUETTE: nếu mời đồng nghiệp Nhật về nhà dịp Tết, KHÔNG mời 3 ngày đầu (mồng 1-3, family-only). Mời từ mồng 5-6 hoặc sau khi hết Tết. Cụm: moshi go-kyoumi ga oari deshitara, raishuu no testo no ato hambun ni nara, watakushi no jitaku ni o-shoutai shitai to zonjimasu (nếu thích, nửa sau Tết em xin được mời về nhà). // TODO: native review — banh chung phonetic in katakana — チュン vs チョン both used; banh chong is older transliteration; banh chung mới hơn nhưng katakana không có nasal vowel chuẩn.",
  idiom_glosses: [
    { idiom: "一年の計は元旦にあり", literal: "Kế hoạch một năm bắt đầu ở ngày đầu năm", meaning: "Plan cho cả năm đặt vào New Year — gốc Trung Quốc cổ. Áp dụng cả ở Nhật và VN. Cụm chuẩn dùng để giải thích vì sao Tết quan trọng — không chỉ celebration mà là planning moment.", example: "一年の計は元旦にあり、と申します。テトは家族と一年の計画を立てる大切な時間でございます。" },
    { idiom: "初心忘るべからず", literal: "Đừng quên tâm ban đầu", meaning: "Đừng quên động lực ban đầu — gốc Zeami. Phù hợp khi nói về tâm trạng đón Tết — refresh tinh thần, nhớ về root values.", example: "テトの時期は、初心忘るべからずの気持ちで、一年を振り返る機会でございます。" },
    { idiom: "縁起がいい", literal: "May mắn / điềm tốt", meaning: "Auspicious — không phải idiom mà là khái niệm cốt lõi của Tết và Nhật New Year. Mọi quyết định Tết (first guest, first food, first activity) liên quan đến engi.", example: "新年最初に家に入る人は、縁起がいい人物を選ぶのが習慣でございます。" },
    { idiom: "袖振り合うも他生の縁", literal: "Tay áo chạm nhau cũng là duyên kiếp khác", meaning: "Mỗi mqh dù nhỏ đều là karma. Phù hợp khi mời đồng nghiệp Nhật về nhà dịp Tết — bày tỏ rằng cuộc gặp này không tình cờ.", example: "袖振り合うも他生の縁と申します。来年のテトに、ぜひお越しいただきたく存じます。" }
  ],
  cultural_notes_vi: "Khi giải thích Tết cho người Nhật, có 6 điểm tinh tế. (1) TÊN GỌI TET: trong tiếng Nhật, dùng テト (katakana, từ riêng) hoặc ベトナム正月. Tránh kyuushougatsu vì từ này chung cho Lunar New Year (China, Korea). VN identity yêu cầu name-specific. (2) THỜI GIAN: VN có 7-9 ngày nghỉ chính thức (cộng cuối tuần). Dài gấp 2-3 lần oshougatsu Nhật (3 ngày). Nhiều khách Nhật shock vì office shut down — báo trước MỘT THÁNG về schedule, đề xuất họ schedule no-meeting period. (3) GIA ĐÌNH bằng CORE: Tết là family time, không networking. Đồng nghiệp Nhật mong VN colleague invite — nhưng QUY TẮC: không invite 3 ngày đầu (kiêng người lạ vào nhà). Ngày 4-6 OK invite. Cuối Tết bayer (mồng 7-10) là thời điểm tốt cho casual hangout với colleagues. (4) FOOD: bánh chưng (bắc) hoặc bánh tét (nam) là central. Khi invite Nhật về nhà, luôn serve bánh chưng. Giải thích cách ăn (cắt thành miếng vuông, ăn với dưa hành, có thể chấm nước mắm). KHÔNG ép họ ăn nhiều — họ rice culture nhưng glutinous rice với pork cộng mung bean nhiều cho 1 người Nhật. (5) LÌ XÌ: nếu khách Nhật ngẫu nhiên có mặt khi cha mẹ bạn give lì xì cho trẻ con, đừng để khách Nhật ngại. Giải thích custom trước. KHÔNG để khách Nhật cảm thấy obligated phải lì xì lại — đây là trad VN, họ là khách. (6) HOA MAI / HOA ĐÀO: nếu nhà có cây mai/đào, giới thiệu — đây là biểu tượng Tết. Mai (vàng) ở Nam, đào (hồng) ở Bắc. Khác biệt với JP sakura (hoa anh đào không liên quan New Year). Mỗi cây mua chợ Tết tốn 500K-2M VND, bạn có thể giải thích economics nếu khách hỏi. Khác biệt với JP New Year: oshougatsu Nhật là 1/1 (lịch dương), Tết VN âm lịch. Nhật có hatsumode (đi đền/chùa); VN có thờ cúng TỔ TIÊN at home altar. Nhật có osechi ryouri (lunch box of preserved food); VN có bữa ăn lớn home-cooked. Nhật có otoshidama trong phong bì trắng/nhỏ; VN có lì xì trong phong bì đỏ to. Mỗi country có own rhythm — KHÔNG so sánh thắng/thua. Mẹo: nếu invite được Nhật về nhà dịp Tết, đó là MOMENT relationship transform from colleague to family friend. ROI 10-năm.",
  tip_advice_vi: "Trước Tết 1 tháng, gửi email cho đồng nghiệp Nhật báo schedule: Vietnam will be closed from (ngày bắt đầu) to (ngày kết thúc). I will be unreachable for (ngày) for family obligations. Please send urgent matters before (ngày trước Tết). After Tet, I will reply within 48 hours. Email này không phải courtesy — mandatory. Nhật cần plan around bạn. Trong tuần Tết: KHÔNG check email công việc trừ emergency. Nhật respect switch off khi family time. Nếu bạn check email và reply nhanh, Nhật sẽ assume bạn rảnh — tiếp theo họ expect 24/7. Sau Tết, ngày đầu trở lại văn phòng: chào mỗi colleague Nhật bằng cụm akemashite omedetou gozaimasu. Honnen mo douzo yoroshiku onegai itashimasu (chúc mừng năm mới, năm nay cũng nhờ anh chị). Đem một ít bánh chưng/mứt Tết chia cho team — symbol of share new year energy. Nếu invite đồng nghiệp Nhật về nhà dịp Tết, làm 4 việc trước. (1) Brief gia đình: who is coming, không nói tiếng Nhật, what they will eat (allergy?). Brief khách: dress code (smart casual), no shoes inside, sit on floor at altar may be required (depends home). (2) Gift exchange protocol: bạn đưa gift trước cho khách (lì xì symbolic 50K VND in red envelope) — Nhật không expect, surprise positive. Khách có thể bring omiyage (sweets/fruit) — accept với hai tay, bày lên bàn. (3) Tour the altar: dẫn khách đến altar, giải thích offerings (banh chung, fruit, incense), invite họ nhang (light incense) — Nhật familiar với this from butsudan. (4) Photo: chụp ảnh GIA ĐÌNH với khách Nhật (KHÔNG selfie). Photo này quan trọng: sẽ được khách share với family Nhật, become memory. In ra 1 copy đưa khách trước họ về Nhật. Cuối ngày, walk khách ra cửa, đưa hộp bánh chưng/mứt nhỏ cho họ mang về. Cụm: o-miyage to shite, dou-zo (xin tặng làm souvenir). Long-term: sau Tết bao gồm khách Nhật, relationship sẽ deeper than 100 hours of work meetings. Nhật report về Tết experience cho colleagues của họ ở Tokyo — bạn become cultural ambassador VN trong network của họ. Mọi connection sau đó qua bạn.",
  exercises: [
    { type: "fill-blank", question: "ベトナムのテトは、日本のお正月とお盆を___たような大きなお祭りでございます。", answer: "合わせ" },
    { type: "matching", instruction: "Ghép thuật ngữ Tết với khái niệm tương ứng trong văn hóa Nhật.", pairs: [
      { japanese: "テト", english: "Tết — name riêng (katakana, không nên dịch kyuushougatsu)" },
      { japanese: "リーシー", english: "lì xì — phong bì đỏ tiền (parallel to otoshidama)" },
      { japanese: "バインチュン", english: "bánh chưng — bánh nếp gói lá chuối, có thịt và đậu xanh" },
      { japanese: "初客", english: "first guest — vị khách đầu năm quyết định vận may cả năm" }
    ] },
    { type: "translation", vietnamese: "Lịch giống Trung Quốc, nhưng cách đón Tết của Việt Nam khác.", japanese: "暦は中国と同じですが、ベトナムのテトの過ごし方は違います。" }
  ]
},
{
  id: 70,
  title: "Difficult cross-cultural conversation",
  title_vi: "Cuộc hội thoại khó về văn hóa",
  title_en: "Difficult cross-cultural conversation",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "誤解 (ごかい)", english: "misunderstanding" },
    { japanese: "齟齬 (そご)", english: "discrepancy / misalignment (formal)" },
    { japanese: "認識の違い (にんしきのちがい)", english: "difference in perception" },
    { japanese: "立場 (たちば)", english: "standpoint / position" },
    { japanese: "歩み寄る (あゆみよる)", english: "to meet halfway / approach each other" },
    { japanese: "落ち着いて (おちついて)", english: "calmly (defusing tense moment)" },
    { japanese: "一旦 (いったん)", english: "momentarily / for a moment (used in pause-and-reset)" },
    { japanese: "腹を割って (はらをわって)", english: "openly / without holding back (idiom-derived)" },
    { japanese: "建設的 (けんせつてき)", english: "constructive" },
    { japanese: "柔軟に (じゅうなんに)", english: "flexibly" }
  ],
  examples: [
    { japanese: "山田部長、今のお話、私の認識と少し違うように感じました。一旦整理させていただいてもよろしいでしょうか。", english: "Manager Yamada, the conversation just now feels slightly different from my perception. May I take a moment to organize it?" },
    { japanese: "決して反対する意図ではございません。立場の違いから生じる認識の差かと存じます。", english: "I have no intention of opposing. I believe it's a perceptual gap arising from different standpoints." },
    { japanese: "建設的にお話を進めるため、それぞれの立場を確認させていただけますでしょうか。", english: "To move the discussion constructively, may we confirm each side's standpoint?" },
    { japanese: "柔軟にお互いに歩み寄ることで、最善の道が見えてくるかと存じます。", english: "I believe by flexibly meeting halfway, we will see the best path." },
    { japanese: "腹を割ってお話しいただいたこと、心より感謝申し上げます。", english: "I sincerely thank you for speaking openly with me." }
  ],
  dialogue: [
    { speaker: "山田部長", japanese: "グエンさん、率直に言って、先週の対応に問題があったと感じています。", english: "Nguyen-san, frankly, I feel there was a problem with last week's handling." },
    { speaker: "チャウ", japanese: "ご指摘、ありがとうございます。具体的にどの点でございましょうか。", english: "Thank you for the feedback. Specifically which point?" },
    { speaker: "山田部長", japanese: "顧客への返信が遅すぎました。", english: "The reply to the client was too late." },
    { speaker: "チャウ", japanese: "なるほど。一旦整理させていただいて、状況をご説明してもよろしいでしょうか。", english: "I see. May I take a moment to organize and explain the situation?" }
  ],
  dialogue_long: [
    { speaker: "山田部長", japanese: "グエンさん、率直に言って、先週の佐藤商事への対応に問題があったと感じています。少しお時間いいですか。", english: "Nguyen-san, frankly, I feel there was a problem with last week's handling of Sato Trading. Do you have a moment?" },
    { speaker: "チャウ", japanese: "もちろんでございます。お話を伺います。", english: "Of course. I'll listen." },
    { speaker: "山田部長", japanese: "顧客からの問い合わせに、返信が三日遅れた件です。佐藤商事は当社の重要顧客ですから、対応の遅れはあってはならないと考えています。", english: "The matter of the three-day delay in replying to a client inquiry. Sato Trading is a key client; delays should never happen." },
    { speaker: "チャウ", japanese: "ご指摘、誠にありがとうございます。一旦、私の立場から状況を整理させていただいてもよろしいでしょうか。決して反対する意図ではございません。", english: "Thank you for the feedback. May I take a moment to organize the situation from my position? I have no intention of opposing." },
    { speaker: "山田部長", japanese: "もちろん、お聞きしますよ。", english: "Of course, I'll listen." },
    { speaker: "チャウ", japanese: "問い合わせは火曜日に届きました。内容が技術的に複雑でしたので、技術部に確認を依頼いたしました。技術部からの回答が金曜日となりましたので、私からの返信もそのタイミングになった次第でございます。", english: "The inquiry arrived Tuesday. As the content was technically complex, I asked the technical department for confirmation. Their answer came Friday, so my reply was on that timing." },
    { speaker: "山田部長", japanese: "なるほど、内部で確認していたのですね。それは私が知らなかった情報です。", english: "I see, you were confirming internally. That's information I didn't know." },
    { speaker: "チャウ", japanese: "誠に申し訳ございません。途中で経過のご報告を差し上げるべきでした。「途中経過のご連絡」という配慮が足りなかったことは、私の認識不足でございました。", english: "I am truly sorry. I should have given an interim progress report. The consideration of interim communication was insufficient — that was my lack of awareness." },
    { speaker: "山田部長", japanese: "なるほど、それは貴重な気づきです。日本の顧客は、回答そのものよりも「対応している様子が見える」ことを重視します。", english: "I see, that's a valuable realization. Japanese clients value visible signs of being attended to more than the answer itself." },
    { speaker: "チャウ", japanese: "心に刻みます。今後は、複雑な案件については、二日以内に「現在確認中、回答は金曜日になる予定」という途中経過を必ずお送りいたします。", english: "I will engrave this on my heart. From now on, for complex matters, I will always send interim progress within two days — currently verifying, answer expected Friday." },
    { speaker: "山田部長", japanese: "それで十分です。あと一つ。今回、佐藤商事から電話で苦情が入りました。私が直接対応しましたが、グエンさんからも改めて謝罪のお電話をしていただけませんか。", english: "That's enough. One more thing — this time Sato Trading complained by phone. I handled it directly, but could you call to apologize separately?" },
    { speaker: "チャウ", japanese: "もちろんでございます。本日中にお電話いたします。お電話の前に、何をどのようにお伝えすべきか、ご助言を頂戴できますでしょうか。", english: "Of course. I will call today. Before the call, may I receive your advice on what to convey and how?" },
    { speaker: "山田部長", japanese: "良い姿勢です。三つお伝えしてください。一、対応が遅れたことへの率直な謝罪。二、原因の説明。ただし、技術部のせいにしないこと。三、再発防止策。具体的に、二日以内の途中報告ルールを設けたとお伝えください。", english: "Good attitude. Convey three things. One, frank apology for the delay. Two, cause explanation — but don't blame the technical department. Three, prevention measures. Specifically, tell them you've set a rule of interim reports within two days." },
    { speaker: "チャウ", japanese: "承知いたしました。柔軟に建設的にお話ができるよう、心がけます。本件は私の認識不足から生じたものでございますので、責任を持って対応いたします。", english: "Understood. I will keep in mind to converse flexibly and constructively. This matter arose from my lack of awareness, so I will handle it with full responsibility." },
    { speaker: "山田部長", japanese: "ありがとう、グエンさん。腹を割ってお話しできて良かったです。文化の違いから生じる認識の差は、こうして話し合うしかありません。お互い様です。", english: "Thank you, Nguyen-san. I'm glad we spoke openly. Perceptual gaps from cultural differences can only be solved by talking like this. It's mutual." },
    { speaker: "チャウ", japanese: "山田部長、ご寛容なご対応、誠にありがとうございます。今回の経験を糧に、より建設的な業務運営を目指してまいります。", english: "Manager Yamada, thank you for your magnanimous handling. Using this experience as nourishment, I will aim for more constructive operations." }
  ],
  roleplay_prompts: [
    "Sếp Nhật chỉ trích bạn ngay trước team. Bạn cảm thấy bị mất mặt nhưng KHÔNG ngắt lời sếp. Sau meeting, đề nghị gặp riêng — dùng cụm shoushou o-jikan, yoroshii deshou ka cộng nói riêng tâm tư. Đề xuất in private next time MÀ KHÔNG sound critical.",
    "Khách Nhật nhận hàng VN chậm 1 tuần. Họ gọi điện angry. Hãy KHÔNG defensive, KHÔNG đổ lỗi (logistics, weather). Dùng cụm watashi no kanrifuyuki ni yori (do em quản lý không tới) cộng take ownership cộng đề xuất concrete remedy (overnight ship cộng 5 phần trăm discount).",
    "Đồng nghiệp Nhật nói chào hỏi của VN không đủ formal. Bạn cảm thấy đây là cultural superiority. Hãy phản hồi MÀ KHÔNG tranh cãi — dùng cụm go-shisa, arigatou gozaimasu. Issho ni manabasete itadakimasu (cảm ơn ý kiến, em sẽ cùng học) cộng nhẹ nhàng đề xuất reverse: cũng có VN customs Nhật có thể học."
  ],
  register_notes: "Khi xảy ra cuộc hội thoại khó với người Nhật, register cao hơn bình thường để DEFUSE tension. Năm patterns: (1) PAUSE-RESET CỤM: khi cảm thấy tension building, dùng ittan, seiri sasete itadaite mo yoroshii deshou ka (xin được tạm dừng tổ chức lại) hoặc shoushou, ochitsuite kangaesasete itadakemasu deshou ka (xin được suy nghĩ bình tĩnh chút). Cụm này signal bạn không emotional react — gain time. (2) DISTINGUISH POSITION FROM PERSON: dùng tachiba no chigai kara shoujiru ninshiki no sa (sự khác biệt nhận thức xuất phát từ vị trí khác nhau). Cụm này tách opinion khỏi person — không phải personal attack. (3) ACKNOWLEDGE BEFORE COUNTER: KHÔNG bắt đầu phản hồi với demo (nhưng) hay shikashi (tuy nhiên) — dùng go-shiteki, arigatou gozaimasu (cảm ơn feedback) trước, rồi mới explain. Acknowledge first bằng lower defenses. (4) SOFT COUNTER: thay vì I don't agree, dùng watashi no ninshiki to sukoshi kotonatte iru you ni kanjimashita (em cảm thấy hơi khác với nhận thức của em) — hơn nhẹ. Hoặc betsu no mikata mo aru ka to zonjimasu (cũng có cách nhìn khác). (5) CLOSE WITH GRATITUDE: cuối cuộc nói (kể cả khi không reach agreement), dùng harawhotekitagi to o-hanashi sasete itadaki, kokoro yori kansha shimasu (cảm ơn đã được nói chuyện thẳng thắn). Cụm này frame cuộc nói khó như positive bonding moment — Nhật rất appreciated. // TODO: native review — sogo phrasing hơi formal/old; alternative ninshiki no zure (lệch nhận thức) modern hơn cho casual office.",
  idiom_glosses: [
    { idiom: "腹を割って話す", literal: "Mổ bụng ra mà nói chuyện", meaning: "Nói chuyện thẳng thắn, không che giấu — gốc samurai era. Trong cuộc nói khó, bạn KHÔNG khởi xướng (audacious cho non-Japanese), nhưng có thể dùng để cảm ơn khi sếp Nhật khởi xướng: hara wo watte o-hanashi itadaki, arigatou gozaimasu.", example: "腹を割ってお話しできて良かったです。これからも建設的に進められます。" },
    { idiom: "歩み寄る", literal: "Tiến bước gặp nhau", meaning: "Meet halfway — không phải idiom mà là verb phổ biến. Cụm chuẩn cho conflict resolution Nhật. Dùng để frame disagreement không phải win-lose mà là cùng tiến.", example: "柔軟にお互いに歩み寄ることで、最善の道が見えてくるかと存じます。" },
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau mưa to, đất chặt hơn — sau khó khăn, mọi thứ vững hơn. Phù hợp cuối cuộc nói khó để frame disagreement như growth opportunity.", example: "雨降って地固まると申します。今回のお話を経て、より良い関係になれると確信しております。" },
    { idiom: "和をもって尊しとなす", literal: "Lấy hòa làm quý", meaning: "Hòa hợp là cao quý — gốc Hiến pháp 17 điều của Hoàng Thái tử Shotoku. Trong cuộc nói khó, dùng để remind về shared value, không phải để stop conversation mà để frame nó.", example: "和をもって尊しとなすという考えを大切に、お話を進めさせていただきます。" }
  ],
  cultural_notes_vi: "Cuộc hội thoại khó với người Nhật có cấu trúc khác phương Tây ở 6 điểm. (1) NEVER PUBLIC: Nhật disagreement không bao giờ ở public. Nếu sếp Nhật chỉ trích bạn trước team, không phải vì họ thiếu tế nhị — là vì họ đã FAIL nemawashi trước đó. Bạn không nên fight back công khai — chỉ acknowledge ngắn, rồi đề xuất gặp riêng để discuss thêm (hai te koso, kochira wa ato hodo go-soudan ni mairitai zonjimasu). (2) INDIRECT BEFORE DIRECT: Nhật thường indirect trước. Nếu sếp nói chotto muzukashii desu ne (hơi khó nhỉ), đó KHÔNG phải mild concern — đó là strong NO. Học đọc indirectness. Cụm Nhật indirect bằng no: muzukashii (khó), kentou itashimasu (em sẽ xem xét — không actually làm), kangae sasete kudasai (xin để em suy nghĩ — soft no). (3) NO RAISED VOICE: Nhật không raise voice trong disagreement. Nếu họ raise voice, đã là EXTREMELY upset — beyond fixable. Nếu bạn raise voice trước, relationship damaged 100 phần trăm. Học breathe trước phản hồi. (4) APOLOGIZE FIRST, EXPLAIN SECOND: bất kể context, apology đầu (kể cả khi bạn nghĩ không sai). Sau apology, mới explain. Cụm: makoto ni moushiwake gozaimasen. Ittan, jouhou wo seiri sasete itadakemasu deshou ka cộng explanation. KHÔNG explain trước apology — sounds defensive. (5) THIRD-PARTY MEDIATION: nếu disagreement không resolve direct, dùng third-party (sếp chung, HR, sempai). Đây không phải escalation — đây là face-saving protocol. Cụm: moshi yoroshikereba, XX-buchou nimo dou-zo jouhou wo o-tsutae itadaite, sangawa de seiri sasete itadakitaku zonjimasu (nếu được, xin báo sếp XX cùng dàn xếp 3 bên). (6) RECOVERY POST-CONFLICT: sau cuộc nói khó, KHÔNG act như nothing happened (sounds dismissive) và KHÔNG over-apologize lặp đi lặp lại (sounds insincere). Dùng pattern dignified continuity — gặp họ next day, chào normal, dần dần mention 1 lần kế thừa lesson learned. Cụm: senjitsu no o-hanashi, kokoro ni kizamasete itadaki, jissen ni utsushite orimasu (lời nói hôm trước em đã khắc ghi và đang thực hiện). Khác biệt với VN: ở VN disagreement có thể loud, public, immediate; ở Nhật, mọi thing là private, indirect, slow. KHÔNG phải Nhật avoid conflict — họ resolve conflict qua kênh khác. Hiểu khác biệt này bằng bạn không bị mất points trong cuộc nói khó. Long-term: một cuộc nói khó được handled tốt bằng relationship deeper than no-conflict. Trust by fire.",
  tip_advice_vi: "Khi vào cuộc nói khó với người Nhật, làm 4 bước. (1) PREPARE EMOTIONAL: trước cuộc nói, breathe 4-7-8 (inhale 4, hold 7, exhale 8) 3 lần. Mục tiêu: không emotional reactivity. Nhật detect emotion trong giọng nói rất nhạy. (2) ENTER WITH SEAT POSITION: nếu là cuộc nói riêng ở phòng sếp, bạn ngồi shimoza (gần cửa). Nếu họ chỉ định ghế khác, ngồi đó. KHÔNG đứng — đứng bằng aggressive. (3) USE PHRASE TEMPLATE: 4-step template: (a) acknowledgment — gokujo arigatou gozaimasu cộng go-shiteki, ari-mashite kansha shimasu; (b) clarification — ittan, watashi no ninshiki wo seiri sasete itadakitaku zonjimasu cộng give your side calmly; (c) ownership — moshi watashi no fuiki ni yoru bubun ga aremashitara, makoto ni moushiwake gozaimasen cộng take part-ownership even if not 100 phần trăm fault; (d) resolution — saigai boushi to shite, kongo wa XX itashimasu cộng concrete action. Mỗi step 30-60 giây. Total 2-4 phút. KHÔNG over 5 phút (sounds defensive). (4) END WITH GRATITUDE: cụm chuẩn close: harawhotekitagi to o-hanashi sasete itadaki, kokoro yori kansha shimasu. Kongo to mo go-shidou no hodo, nanitozo yoroshiku onegai itashimasu (cảm ơn cuộc nói thẳng thắn, mong tiếp tục được chỉ dẫn). Sau cuộc nói: trong 24 giờ, gửi email tóm tắt 3 điểm key cộng cam kết action cộng thank you. Email này đóng vai trò RECORD — đảm bảo không mis-remember. Sau 1 tuần, gửi update progress on action items (kể cả nhỏ). Sau 1 tháng, cuộc nói coi như closed nếu action visible. KHÔNG nhắc lại issue trong meeting hay public — đó là dead matter unless họ bring up. Mẹo cuối: nếu cuộc nói khó với Nhật KHÔNG resolve được, đừng escalate ngay. Để 1-2 tuần (Nhật cần thời gian process), rồi gặp lại với perspective mới. Time is friend trong Japanese conflict resolution. Người VN hay impatient — học patient với Nhật. Một relationship survive cuộc nói khó bằng relationship đã passed real test bằng trust deeper than 5 năm casual interaction.",
  exercises: [
    { type: "fill-blank", question: "決して反対する意図ではございません。立場の___から生じる認識の差かと存じます。", answer: "違い" },
    { type: "matching", instruction: "Ghép cụm Nhật indirect với meaning thực.", pairs: [
      { japanese: "ちょっと難しいですね", english: "no (mềm — nhưng quyết định)" },
      { japanese: "検討いたします", english: "no (không thực sự sẽ xem xét)" },
      { japanese: "考えさせてください", english: "soft no (xin chút thời gian — nhưng không yes)" },
      { japanese: "前向きに検討します", english: "yes có khả năng (positive sign)" }
    ] },
    { type: "translation", vietnamese: "Em xin lỗi, em xin được tổ chức lại nhận thức của em trước đã. Tuyệt đối không có ý phản đối.", japanese: "誠に申し訳ございません、一旦、私の認識を整理させていただきたく存じます。決して反対する意図ではございません。" }
  ]
},
{
  id: 71,
  title: "Building friendship with a Japanese person in Vietnam",
  title_vi: "Xây dựng tình bạn với người Nhật ở Việt Nam",
  title_en: "Building friendship with a Japanese person in Vietnam",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "慣れる (なれる)", english: "to get used to (key word for cultural adaptation)" },
    { japanese: "親しくなる (したしくなる)", english: "to grow close" },
    { japanese: "気が合う (きがあう)", english: "to click / to be on the same wavelength" },
    { japanese: "本音 (ほんね)", english: "true feelings (vs. tatemae — public face)" },
    { japanese: "建前 (たてまえ)", english: "public-face / surface position" },
    { japanese: "心を開く (こころをひらく)", english: "to open one's heart" },
    { japanese: "気を遣わない (きをつかわない)", english: "to not be on guard / be at ease" },
    { japanese: "ざっくばらん", english: "frank / unreserved (positive informal trait)" },
    { japanese: "誘う (さそう)", english: "to invite (key for friendship escalation)" },
    { japanese: "馴染む (なじむ)", english: "to settle in / become familiar" }
  ],
  examples: [
    { japanese: "田中さん、もしよかったら、今度の週末、一緒にコーヒーでもいかがですか。", english: "Tanaka-san, if you'd like, how about coffee together next weekend?" },
    { japanese: "ベトナム生活、もう三ヶ月ですね。少し慣れましたか。", english: "Three months in Vietnam already, isn't it. Have you settled in a bit?" },
    { japanese: "気を遣わなくて大丈夫ですよ。普段着でいいですから。", english: "No need to be on guard. Casual clothes are fine." },
    { japanese: "ざっくばらんに、本音でお話しできると嬉しいです。", english: "I'd be glad if we could speak frankly, with our real feelings." },
    { japanese: "雨降って地固まると言いますし、今回の出来事を経て、もっと親しくなれた気がします。", english: "As they say after rain, the ground hardens — I feel we've grown closer through this." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "田中さん、明日の夜、もしお時間あれば、一緒にビールでもどうですか。", english: "Tanaka-san, if you have time tomorrow night, how about a beer together?" },
    { speaker: "田中さん", japanese: "ぜひ。実は誘ってもらえると嬉しいなと思っていました。", english: "Sure. Actually I was hoping for an invitation." },
    { speaker: "チャウ", japanese: "良かったです。じゃあ、19時にロビーで。", english: "Glad. Then 7pm at the lobby." },
    { speaker: "田中さん", japanese: "楽しみにしています。", english: "Looking forward to it." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "田中さん、お疲れ様です。ベトナム生活、もう三ヶ月ですね。少しは慣れましたか。", english: "Tanaka-san, thanks for your work. Three months in Vietnam already. Have you settled a bit?" },
    { speaker: "田中さん", japanese: "おかげさまで、少しずつ。最初の一ヶ月は本当に大変でしたが、最近は通勤路のバイクの数も気にならなくなってきました。", english: "Thanks to your help, little by little. The first month was really tough, but lately even the motorbikes on the commute don't bother me." },
    { speaker: "チャウ", japanese: "それは何よりです。実は、もしお時間あれば、明日の夜、一緒にビールでもどうかと思いまして。仕事の話じゃなくて、雑談ですけど。", english: "That's the best. Actually, if you have time, I was wondering about a beer tomorrow night. Not work talk — just chatting." },
    { speaker: "田中さん", japanese: "ぜひぜひ。実は、こちらから誘いたかったんですが、なかなかタイミングがなくて。グエンさんからお声かけしてもらえて嬉しいです。", english: "Definitely. Actually I wanted to invite you, but couldn't find the timing. I'm glad you reached out." },
    { speaker: "チャウ", japanese: "ありがとうございます。良いお店があるんですよ。グエン・フエ通りの近くで、川沿いのテラス席がある居酒屋風のところです。日本人の方も時々いらっしゃいます。", english: "Thank you. There's a great place — near Nguyen Hue Street, with riverside terrace seating, izakaya-style. Japanese people sometimes come there too." },
    { speaker: "田中さん", japanese: "それは楽しみですね。ドレスコードはありますか。", english: "Looking forward to it. Any dress code?" },
    { speaker: "チャウ", japanese: "全然気を遣わなくて大丈夫ですよ。普段着でいいですから。Tシャツでもいいくらいカジュアルなお店です。", english: "No need to worry at all. Casual clothes are fine. Casual enough that even a T-shirt is OK." },
    { speaker: "田中さん", japanese: "助かります。仕事の後にスーツのままだと、堅苦しいなと思っていたので。", english: "That helps. I was worried about being stiff in a suit after work." },
    { speaker: "チャウ", japanese: "(翌日、お店で)じゃあ、改めて、ベトナム生活お疲れ様です。乾杯。", english: "(the next day, at the shop) Well then, again, thanks for your effort with Vietnam life. Cheers." },
    { speaker: "田中さん", japanese: "乾杯。仕事から離れて飲むのは久しぶりです。", english: "Cheers. It's been a while since I drank away from work." },
    { speaker: "チャウ", japanese: "実は、田中さん、ベトナムに来た時、何が一番びっくりしましたか。本音を聞かせていただけたら嬉しいです。", english: "Actually, Tanaka-san, when you came to Vietnam, what surprised you most? I'd love to hear your real feelings." },
    { speaker: "田中さん", japanese: "本音で言うと、人との距離の近さですね。日本だと、隣の席の人にも一週間挨拶しないことも普通ですが、ベトナムは初日から「お昼一緒に行きましょう」って誘ってくれた。最初は戸惑いましたが、今は感謝しています。", english: "Honestly, the closeness between people. In Japan, not greeting your neighbor at work for a week is normal. But in Vietnam, from day one, people invited me to lunch together. I was confused at first, but now I'm grateful." },
    { speaker: "チャウ", japanese: "ベトナム人にとっては自然なことですが、日本の方には驚きでしょうね。逆に、私が日本人の同僚と接する時、戸惑うことがあります。日本では「気を遣う」ことが多いので、何が本音なのかわかりにくくて。", english: "It's natural for Vietnamese, but must be surprising for Japanese. Conversely, when I interact with Japanese colleagues, I get confused too. Japanese consider others a lot, so it's hard to tell what's real feeling." },
    { speaker: "田中さん", japanese: "あ、それはよく言われます。「本音と建前」の文化ですから。仕事では建前、プライベートでは本音、っていう使い分けが日本人にはあって。", english: "Ah, that's often said. It's the real-feeling and surface culture. At work tatemae, in private honne — Japanese have that distinction." },
    { speaker: "チャウ", japanese: "なるほど、そういうことだったんですね。だから、こうしてお酒の場でリラックスして話すと、田中さんも少し変わって見えます。会社では「いつも丁寧」なのに、今は「ざっくばらん」って感じで。", english: "I see, that's what it was. So when we relax over drinks like this, you also seem a bit different, Tanaka-san. At the company you're always polite, but now you feel frank." },
    { speaker: "田中さん", japanese: "そうなんです。日本の会社員は、お酒の場が「本音の場」なんですよ。「飲みニケーション」って言葉があるくらい、お酒で本音を語り合うのが伝統です。", english: "That's right. For Japanese workers, the drinking place is the real-feeling place. There's even a word nominication — talking real feelings through drinks is tradition." },
    { speaker: "チャウ", japanese: "「飲みニケーション」、面白い言葉ですね。ベトナム人も飲み会は好きですけど、日本ほど「本音を語り合う場」っていう特別な意味はないかもしれません。むしろ、仕事中でも本音を言うことが多いですね。", english: "Nominication — fun word. Vietnamese also like drinking gatherings, but maybe not with the special meaning of real-feelings venue as in Japan. Rather, we often say real feelings even during work." },
    { speaker: "田中さん", japanese: "それが羨ましいなと思うこともあります。日本のシステムは効率的だけど、心が疲れることもあって。", english: "I sometimes envy that. Japan's system is efficient, but it's also mentally tiring." },
    { speaker: "チャウ", japanese: "お互い様ですね。私もベトナムのおおらかさで日本の同僚に「時間にルーズ」って思われることもあります。両方の良さを学べたら一番ですね。", english: "It's mutual. Sometimes Japanese colleagues think I'm time-loose due to Vietnamese easy-going-ness. The best is to learn from both." },
    { speaker: "田中さん", japanese: "本当にそうですね。今日は本音で話せて良かったです。今後ともよろしくお願いします。", english: "Truly. Glad we spoke honestly today. Looking forward to continued friendship." },
    { speaker: "チャウ", japanese: "こちらこそ。雨降って地固まると申しますが、こうやって少しずつお互いを理解できていくのが、本当の友情だと思います。次は、私の家にもお招きしますね。母のフォーは絶品ですから。", english: "Likewise. As they say after rain, the ground hardens — gradually understanding each other like this is real friendship. Next time, I'll invite you to my home. My mother's pho is exquisite." },
    { speaker: "田中さん", japanese: "それは嬉しいです。楽しみにしています。", english: "That's wonderful. I look forward to it." }
  ],
  roleplay_prompts: [
    "Đồng nghiệp Nhật ở VN 6 tháng. Bạn muốn invite về nhà ăn cơm nhưng họ ngại quá. Hãy invite trong 3 đợt — mỗi đợt nhẹ hơn đợt trước: (1) lần đầu casual cafe (an toàn nhất); (2) lần hai bữa trưa quán quen; (3) lần ba bữa tối ở nhà. Mỗi lần đợi 2-3 tuần giữa, dùng dou-zo go-muri no nai han'i de (xin trong phạm vi không phiền).",
    "Tại quán bia, đồng nghiệp Nhật bắt đầu kể problem cá nhân (mqh xa với gia đình ở Nhật, lonely). Bạn nhận ra đây là honne moment hiếm. Hãy KHÔNG đẩy advice, KHÔNG dramatize. Chỉ aizuchi (sou desu ka, naruhodo, taihen deshita ne), uống chậm, để họ talk. Cuối: bày tỏ trân trọng cuộc nói chuyện.",
    "Sau 6 tháng friendship, đồng nghiệp Nhật gửi tin nhắn about to leave Vietnam, transfer back Tokyo. Hãy phản hồi — KHÔNG dramatic, KHÔNG cliché. Đề xuất last meal cùng (ở quán đầu tiên cả hai đến), gift một món có ý nghĩa cá nhân (album ảnh chung, không vật chất). Long-term: hứa giữ contact via Tết card hand-written."
  ],
  register_notes: "Friendship với Nhật cần register switching, không như casual VN friend. Năm phases: (1) PHASE 1 (TUẦN 1-4): chỉ desu/masu polite. KHÔNG joke. KHÔNG personal questions. Chỉ shared work topics. Bắt đầu với Tanaka-san, otsukaresama desu mỗi sáng, nhưng KHÔNG more. Phase này test cultural literacy của bạn. (2) PHASE 2 (THÁNG 2-3): vẫn desu/masu nhưng có thể small talk: weather, food, weekend. Đề xuất lunch invitation đầu tiên — bữa trưa, không bữa tối. Cụm: moshi yoroshikereba, kondo issho ni o-hiru demo dou desu ka. Light dose. (3) PHASE 3 (THÁNG 4-6): có thể casual desu/masu (drop thiêu), share more personal (family, hobbies). Đề xuất bia evening — bia là bonding ritual ở Nhật. Phase này họ sẽ test bạn — kể câu thoại nhẹ về Japan/VN, xem reaction. (4) PHASE 4 (THÁNG 7-12): có thể plain form (da/dearu) trong CASUAL conversation, nhưng SWITCH back desu/masu khi sếp/khách hiện diện. Giai đoạn này họ share honne. Bạn có thể kể về VN problem (traffic, corruption) — không spin. (5) PHASE 5 (NĂM 2 cộng): true friendship. Casual constantly. Gọi nhau bằng tên (KHÔNG san giữa close friends sau 1 năm cộng — tùy individual). Có thể tease nhẹ. Có thể không reply tin nhắn 1 tuần mà không hard feelings. KHÔNG rush phases. Người VN hay rush — invite về nhà tuần 2 bằng scare họ. Học chờ. Mẹo: dùng cụm noni-kee-shon (nominication — drinking communication) khi thân hơn Phase 3 — show bạn understand cultural concept. Cụm honne wo kikasete itadaite, arigatou (cảm ơn vì share honne) sau khi họ open up. Đây là validation họ trust bạn. // TODO: native review — nominication phrasing — modern slang, 1990s gốc; some senior Japanese (60 cộng) think outdated; safer alternative is just nomi-kai (drinking party).",
  idiom_glosses: [
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau khó khăn, mọi thứ vững hơn — rain compacts the soil. Phù hợp khi friendship deepen sau initial misunderstanding hoặc cuộc nói khó. Cụm này frame conflict not as problem but as relationship-strengthener.", example: "雨降って地固まると申します。今回の出来事を経て、もっと親しくなれた気がします。" },
    { idiom: "三度目の正直", literal: "Lần thứ ba mới thật", meaning: "Third time's the charm — gốc Nhật cổ. Phù hợp khi invite Nhật bạn nhiều lần (hai lần đầu họ từ chối, lần thứ ba accept). Đừng give up sau 1-2 từ chối.", example: "三度目の正直と言いますが、今回こそご自宅にお招きしたく存じます。" },
    { idiom: "以心伝心", literal: "Lòng truyền lòng", meaning: "Hiểu nhau không cần lời — gốc Phật giáo Zen. Trong friendship matured, dùng để bày tỏ sự thông hiểu sâu. Bạn nhận ra một silent moment hai người cùng nghĩ same thing.", example: "もう何年も一緒に仕事してきましたから、ほとんど以心伝心ですね。" },
    { idiom: "馴染みの店", literal: "Quán quen / quán mình thường lui tới", meaning: "Familiar shop — biểu thị mqh long-term với một place. Dùng khi friendship has our regular spot. Show shared history.", example: "ここはもう馴染みの店ですね。マスターも私たちの顔を覚えてくれて。" }
  ],
  cultural_notes_vi: "Friendship với Nhật ở VN khác friendship với Tây hoặc với Việt khác ở 7 điểm. (1) THỜI GIAN: trung bình 1 năm để reach Phase 4 (true honne sharing). KHÔNG phải Nhật slow — họ careful. Người VN hay quick (1 tháng đã best friend). Học chờ. (2) GROUP BEFORE INDIVIDUAL: ban đầu invite Nhật vào group hangout (3-4 người), không 1-on-1. Group là safer cho Nhật. Sau 2-3 group sessions, Nhật sẽ tự gợi ý 1-on-1. (3) ALCOHOL AS BRIDGE: nominication (nomi-cation bằng drinking communication) là chuẩn ở Nhật. Trong VN, có thể adapt — bia tươi quán địa phương là default. KHÔNG tự rót cho mình, luôn rót cho bạn trước. Khi say lightly, Nhật sẽ open up — đây là expected, không weakness. (4) HONNE/TATEMAE: bạn nghe nhiều về 2 layer này, nhưng thực ra ở friendship phase Nhật vẫn dùng. Khác là honne layer được unlock dần. Ban đầu họ chỉ tatemae (polite, professional, agree với bạn). Sau drinks, một số honne lộ. Sau 1 năm, full honne — bao gồm complaint về Japan, lonely abroad, marriage troubles. Bạn KHÔNG advice — chỉ listen và acknowledge. (5) GIFT GIVING: chuẩn mực Nhật là khi visit nhà, mang temiyage (gift). Khi đi du lịch, mang omiyage cho friends. Bạn cũng adopt — VN customs: mang trái cây hoặc bánh tươi khi visit. KHÔNG đắt — symbolic value matter. (6) PHYSICAL CONTACT: KHÔNG hug, KHÔNG kiss má, KHÔNG vai. Nhật personal space lớn hơn VN. Maximum: handshake (chỉ first meeting), bow. Sau nhiều năm có thể light pat on shoulder cho male-male — male-female còn cẩn thận hơn. (7) SOCIAL MEDIA: Nhật ít share trên FB/Instagram. Đừng tag họ photo nếu họ không hỏi. LINE messages OK 1-on-1, nhưng KHÔNG group chat random. Email vẫn là kênh business primary cho Japanese của thế hệ 30 cộng. Khác biệt với VN: ở VN friendship all in or all out — share mọi thứ, hangout nhiều, post FB. Ở Nhật, friendship vô hạn về depth nhưng có boundaries rất rõ về time/space/sharing. Mẹo cuối: nếu friendship survive khi bạn của Nhật transfer về Tokyo — kept up qua Tết card, occasional visit khi họ về VN, qua Christmas/New Year LINE — đây là LIFETIME friendship. Người VN có thể có nhiều friends; người Nhật có ít friends nhưng deeply lasting. Quality on quantity. Một người Nhật bạn keep 10 năm bằng giá trị bằng 50 acquaintances bình thường.",
  tip_advice_vi: "Phase 1 (Tháng 1): mỗi sáng chào colleague Nhật bằng Tanaka-san, otsukaresama desu đứng dậy nhẹ. Eye contact 2 giây. KHÔNG more. Mỗi tuần làm 1 việc small để help họ (chỉ vị trí ATM, dịch sign tiếng Việt, gợi ý quán). KHÔNG ép cuộc nói chuyện. Phase 2 (Tháng 2-3): khi họ đã accept presence của bạn, đề xuất ăn trưa. Cụm: moshi yoroshikereba, kondo issho ni hiru-meshi demo dou desu ka. Đề xuất quán có air-con, menu English/Nhật, vệ sinh rõ ràng (KHÔNG quán đường phố ngày đầu). Bữa trưa 60 phút max. Trong bữa, hỏi về work life ở Japan, family ở Tokyo, hobby. KHÔNG dùng ngôn ngữ thân tình quá sớm. Phase 3 (Tháng 4-6): đề xuất after-work drink. Cụm: kondo no kin-youbi no yoru, biiru demo ikaga desu ka. Quán riverside hoặc rooftop với view. 1-2 cốc bia. Match speed của họ. Trong drink, share honest opinion về VN-Japan differences. KHÔNG defend VN khi họ critical light. Listen first. Nếu họ start sharing personal, just aizuchi — sou desu ka, naruhodo, taihen deshita ne. KHÔNG offer advice unless asked. Phase 4 (Tháng 7-12): invite về nhà bạn cho bữa tối với gia đình. Brief gia đình: who is coming, basic Japanese phrases (irasshaimase, ohashi, gochisousama deshita), no pressure to entertain. Mẹ bạn nấu món signature (pho, banh xeo). Khoảng 2-3 giờ. Cuối, đưa o-miyage (mứt Tết, cà phê G7). Phase 5 (Năm 2 cộng): friendship has its rhythm. Có lúc weekly drinks, có lúc 2 tháng không gặp — both OK. Không pressure. Khi họ transfer về Tokyo: tổ chức farewell dinner (nhỏ, intimate, ở quán đầu tiên cả hai đến). Tặng album ảnh chung (in cứng — Nhật trọng physical). Trao đổi LINE/email. Hứa Tết card hand-written hàng năm. KHÔNG hứa lớn (visit Tokyo year). Long-term: gửi Tết card mỗi năm tháng 1 — 3 dòng update về life. 5 năm, 10 năm sau, khi bạn cần Job ở Tokyo, họ là đầu tiên introduce. Khi họ về VN visit family, bạn là đầu tiên họ liên lạc. Friendship Nhật ít maintenance work nhưng cao value when activated. Đầu tư patience.",
  exercises: [
    { type: "fill-blank", question: "気を___なくて大丈夫ですよ。普段着でいいですから。", answer: "遣わ" },
    { type: "matching", instruction: "Ghép phase friendship với behavior phù hợp.", pairs: [
      { japanese: "Phase 1 (Tháng 1)", english: "morning greeting only, no extra; help small things silently" },
      { japanese: "Phase 2 (Tháng 2-3)", english: "lunch invitation, group setting safer than 1-on-1" },
      { japanese: "Phase 3 (Tháng 4-6)", english: "evening drinks; honne can begin to surface" },
      { japanese: "Phase 4 (Tháng 7-12)", english: "invite home for family dinner; deep trust phase" }
    ] },
    { type: "translation", vietnamese: "Em nói thẳng nhé, anh có thể chia sẻ tâm sự thật với em được không.", japanese: "ざっくばらんに、本音でお話しできると嬉しいです。" }
  ]
},
{
  id: 72,
  title: "Immigration officer at Narita/Haneda",
  title_vi: "Cán bộ nhập cảnh tại Narita/Haneda",
  title_en: "Immigration officer at Narita/Haneda",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "入国審査 (にゅうこくしんさ)", english: "immigration inspection" },
    { japanese: "入国カード (にゅうこくカード)", english: "landing card / disembarkation card" },
    { japanese: "滞在目的 (たいざいもくてき)", english: "purpose of stay" },
    { japanese: "滞在期間 (たいざいきかん)", english: "duration of stay" },
    { japanese: "滞在先 (たいざいさき)", english: "place of stay (hotel/host address)" },
    { japanese: "観光 (かんこう)", english: "tourism / sightseeing" },
    { japanese: "商用 (しょうよう)", english: "business purpose" },
    { japanese: "短期滞在 (たんきたいざい)", english: "short-term stay (90-day visa-free)" },
    { japanese: "旅券 (りょけん)", english: "passport (formal — used by officials)" },
    { japanese: "復路便 (ふくろびん)", english: "return flight (proof of departure)" }
  ],
  examples: [
    { japanese: "ベトナムから観光で参りました。", english: "I came from Vietnam for tourism." },
    { japanese: "滞在期間は二週間でございます。", english: "My stay duration is two weeks." },
    { japanese: "滞在先は東京の新宿京王プラザホテルでございます。", english: "My place of stay is the Keio Plaza Hotel in Shinjuku, Tokyo." },
    { japanese: "復路便のチケットも持参しております。", english: "I also have my return-flight ticket with me." },
    { japanese: "ご確認のほど、よろしくお願いいたします。", english: "I respectfully ask for your verification." }
  ],
  dialogue: [
    { speaker: "審査官", japanese: "パスポートと入国カードをお願いします。滞在の目的は?", english: "Passport and landing card, please. Purpose of stay?" },
    { speaker: "チャウ", japanese: "観光で参りました。二週間の滞在予定でございます。", english: "I came for tourism. Planning a two-week stay." },
    { speaker: "審査官", japanese: "宿泊先はどちらですか。", english: "Where are you staying?" },
    { speaker: "チャウ", japanese: "新宿の京王プラザホテルでございます。", english: "Keio Plaza Hotel in Shinjuku." }
  ],
  dialogue_long: [
    { speaker: "審査官", japanese: "次の方、どうぞ。パスポートと入国カードをお願いします。", english: "Next person, please. Passport and landing card, please." },
    { speaker: "チャウ", japanese: "はい、こちらでございます。よろしくお願いいたします。", english: "Yes, here you are. Thank you in advance." },
    { speaker: "審査官", japanese: "ベトナムからですね。滞在の目的は何ですか。", english: "From Vietnam. What's the purpose of your stay?" },
    { speaker: "チャウ", japanese: "観光でございます。京都と大阪も訪れる予定です。", english: "Tourism. I plan to visit Kyoto and Osaka too." },
    { speaker: "審査官", japanese: "滞在期間はどれくらいですか。", english: "How long is your stay?" },
    { speaker: "チャウ", japanese: "二週間でございます。三月五日に帰国予定でございます。", english: "Two weeks. I plan to return home on March 5." },
    { speaker: "審査官", japanese: "復路便のチケットはお持ちですか。", english: "Do you have your return ticket?" },
    { speaker: "チャウ", japanese: "はい、こちらに印刷したものを持参しております。お見せいたします。", english: "Yes, I have a printed copy here. Let me show you." },
    { speaker: "審査官", japanese: "ありがとうございます。宿泊先のご住所は入国カードに書かれているとおりですか。", english: "Thank you. Is the lodging address as written on the landing card?" },
    { speaker: "チャウ", japanese: "はい、新宿の京王プラザホテルでございます。予約確認書もお見せできます。", english: "Yes, Keio Plaza Hotel in Shinjuku. I can show the booking confirmation." },
    { speaker: "審査官", japanese: "結構です。日本へのご訪問は初めてですか。", english: "That's fine. Is this your first visit to Japan?" },
    { speaker: "チャウ", japanese: "はい、初めてでございます。", english: "Yes, my first time." },
    { speaker: "審査官", japanese: "それでは、指紋と顔写真をお願いします。両人差し指をスキャナーに置いてください。", english: "Then please give fingerprints and face photo. Place both index fingers on the scanner." },
    { speaker: "チャウ", japanese: "はい、承知いたしました。", english: "Yes, understood." },
    { speaker: "審査官", japanese: "正面のカメラを見てください。はい、結構です。", english: "Look at the camera in front. Yes, fine." },
    { speaker: "審査官", japanese: "九十日間の短期滞在で許可します。良いご旅行を。", english: "Approved for 90-day short-term stay. Have a good trip." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。失礼いたします。", english: "Thank you sincerely. Excusing myself." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn vừa xuống máy bay tại Narita lần đầu. Hãy diễn tập phần trả lời 5 câu hỏi chuẩn của 入国審査官: (1) mục đích, (2) thời gian ở, (3) nơi ở, (4) vé về, (5) lần đầu/lần thứ mấy. Mỗi câu trả lời 5-10 giây, dùng kenjougo (de gozaimasu, mairimashita).",
    "Cán bộ hỏi câu khó: anata no shokugyou wa nan desu ka (nghề của bạn?). Bạn là sinh viên VN du lịch — KHÔNG nói daigakusei desu (sinh viên đại học) cộc lốc; dùng cụm gakusei de, genzai betonamu kokka daigaku ni zaiseki shite orimasu (em đang học tại ĐH Quốc gia VN).",
    "Cán bộ thấy nghi ngờ vì bạn không có hotel booking confirmation in giấy (chỉ có trên điện thoại). Hãy xin phép xem trên điện thoại — dùng cụm sumahō ni hokan shite orimasu, gokakunin itadaite mo yoroshii deshou ka (em lưu trên điện thoại, xin được cho xem). KHÔNG panic; KHÔNG offer tiền."
  ],
  register_notes: "Cán bộ nhập cảnh tại Narita/Haneda mong khách trả lời CỤ THỂ và NGẮN GỌN trong keigo. Bốn patterns bắt buộc: (1) DÙNG -mairimashita THAY -kimashita: kankou de mairimashita (em đến vì du lịch — kenjougo của 来る). Đây là dấu hiệu bạn hiểu register; cán bộ Nhật chú ý ngay. (2) DÙNG -de gozaimasu THAY -desu: ni-shuukan de gozaimasu thay vì ni-shuukan desu. Hơi formal nhưng phù hợp situation. (3) NÓI ĐỊA CHỈ ĐẦY ĐỦ: KHÔNG nói shinjuku no hoteru (khách sạn ở Shinjuku) — quá vague. Nói cụ thể: Shinjuku no Keio Plaza Hotel de gozaimasu. Cán bộ cần verify với landing card. (4) ANSWER ONLY WHAT'S ASKED: KHÔNG over-explain. Nếu họ hỏi mục đích, trả lời mục đích thôi — đừng kể luôn lịch trình. Nhật trọng efficiency trong officer interactions. Câu mở đầu chuẩn khi đến counter: yoroshiku onegai itashimasu (đặt landing card xuống). Câu kết thúc khi qua: arigatou gozaimashita. Shitsurei itashimasu (cảm ơn, em xin phép). // TODO native review — fukurobin (復路便) phrasing — alternative kikoku-bin (帰国便) more common in spoken contexts; passport-ese vs ticket-ese.",
  idiom_glosses: [
    { idiom: "一期一会", literal: "Một đời một lần gặp", meaning: "Mỗi cuộc gặp duy nhất — gốc trà đạo. Tại immigration, không dùng trực tiếp với cán bộ (out of place), nhưng là tinh thần khi đến Nhật lần đầu — mỗi tương tác đều đáng trân trọng.", example: "初めての日本訪問、一期一会の気持ちで臨ませていただきます。" },
    { idiom: "郷に入っては郷に従え", literal: "Vào làng nào theo làng đó", meaning: "When in Rome, do as Romans do — gốc Nhật cổ. Tinh thần khi qua immigration: theo procedure Nhật, không phàn nàn waiting time, không tranh cãi questions.", example: "郷に入っては郷に従え、入国審査の手続きにきちんと従います。" },
    { idiom: "急がば回れ", literal: "Vội thì đi vòng", meaning: "Vội vã hỏng việc — phù hợp khi cán bộ hỏi nhiều câu, đừng rush trả lời. Nhật cảnh giác với traveler trả lời quá nhanh (= scripted, suspicious).", example: "急がば回れ、慎重に質問にお答えいたします。" },
    { idiom: "備えあれば憂いなし", literal: "Có chuẩn bị thì không lo", meaning: "Better safe than sorry — gốc Trung Quốc cổ. Phù hợp khi mang đầy đủ giấy tờ (passport, return ticket, hotel booking, cash). Cán bộ thấy bạn có document = bạn được trust.", example: "備えあれば憂いなしで、必要な書類はすべて持参しております。" }
  ],
  cultural_notes_vi: "Nhập cảnh Narita/Haneda khác phương Tây ở 5 điểm. (1) THỜI GIAN: peak hours (sáng 6-9, chiều 14-17) có thể chờ 60-90 phút. KHÔNG complain với cán bộ về wait time — bị xem là disrespect. Pre-fill landing card trên máy bay (tiếp viên đưa form 30 phút trước landing) để khi xuống máy bay đi thẳng đến lane. (2) BIẾT LANE NÀO: foreign passport có 2 lanes — automated gate (nếu là registered traveler) và manual counter. Lần đầu Nhật, dùng manual. Đứng sau line màu vàng, đợi cán bộ vẫy tay. KHÔNG đi tới counter trước khi được vẫy. (3) DOCUMENT ORDER: chuẩn bị TRƯỚC khi đến counter: passport mở ở photo page, landing card on top, return ticket in giấy ở dưới. Đưa cùng lúc bằng HAI TAY (Nhật quan sát chi tiết này). KHÔNG đưa từng tờ một. (4) PHONE: KHÔNG dùng phone tại counter (không nghe nhạc, không chụp ảnh, không quay). Nếu họ ask phone access (rare), unlock và đưa face-up. KHÔNG resist. (5) FINGERPRINT cộng PHOTO: bắt buộc mọi visitor 16+ kể từ 2007. Đặt cả hai ngón trỏ ĐỒNG THỜI lên scanner — không tuần tự. Nhìn camera ngang tầm mắt, KHÔNG mỉm cười (passport-style). Khác biệt với VN: ở VN immigration thường formal nhưng cán bộ có thể chat nhỏ; ở Nhật, immigration là pure procedure — không small talk, không cảm xúc. Nếu họ ask câu phụ (sao đến Nhật, có biết người Nhật không), trả lời ngắn POSITIVE — kể về interest in văn hóa, food, anime. KHÔNG nói lý do tiêu cực (avoid VN food, escape weather). Một câu trả lời thân thiện kéo dài 5 giây, không 30 giây.",
  tip_advice_vi: "Trên máy bay, fill landing card với BÚT MỰC TỐI (đen/xanh). KHÔNG bút chì. Viết bằng kanji nếu biết, nếu không thì romaji ALL CAPS. Trường name phải KHỚP PASSPORT chính xác — Nguyen Thi Chau (không Chau Nguyen, không Nguyễn Thị Châu với dấu). Nghề nghiệp: ngắn gọn (Engineer / Student / Teacher), KHÔNG dài (Software Engineer specialized in AI tại Toyota). Address tại Nhật: ĐẦY ĐỦ với postal code. Mang theo bản in confirmation booking hotel (KHÔNG chỉ trên phone). Tiền mặt: chứng minh có ít nhất 50,000 yen cho 2 tuần (ATM card cũng OK nếu được hỏi). Khi đến counter, đứng SỰA THẲNG, eye contact 70 phần trăm, mỉm cười nhẹ. Đặt passport mở trên counter, KHÔNG đưa thẳng vào tay cán bộ trừ khi họ với tay nhận. Nói passport-clear Japanese — clear consonants, slow pace. Nếu cán bộ nói tiếng Anh, OK theo English; nếu họ nói Nhật, ráng theo Nhật. KHÔNG mix Anh-Nhật trong cùng câu. Sau khi qua, immediate next step là baggage claim (đi theo signs 手荷物受取所). KHÔNG đứng quá gần immigration counter (security sensitive area). Nếu bạn bị secondary screening (cán bộ vẫy bạn vào phòng phụ), KHÔNG panic — bring tất cả documents, trả lời các câu hỏi tiếp theo, average wait 15-30 phút. Mang theo tên + số điện thoại liên lạc tại VN trong vali (in trên giấy) — phòng bag thất lạc. Mẹo cuối: thẻ MyJPass (đăng ký trước khi đi) cho phép thông qua automated gate nhanh hơn 50 phần trăm — register online tại Japan immigration site tuần trước departure.",
  exercises: [
    { type: "fill-blank", question: "ベトナムから観光で___ました。", answer: "参り" },
    { type: "matching", instruction: "Ghép cụm với situation tại immigration.", pairs: [
      { japanese: "観光で参りました", english: "trả lời purpose: tourism" },
      { japanese: "二週間でございます", english: "trả lời stay duration" },
      { japanese: "復路便を持参しております", english: "show return ticket proactively" },
      { japanese: "短期滞在で許可します", english: "officer's approval phrase (nghe và confirm)" }
    ] },
    { type: "translation", vietnamese: "Em đến từ Việt Nam để du lịch. Thời gian ở là hai tuần.", japanese: "ベトナムから観光で参りました。滞在期間は二週間でございます。" }
  ]
},
{
  id: 73,
  title: "Lost passport — replacement at Vietnamese embassy in Tokyo",
  title_vi: "Mất hộ chiếu — xin cấp lại tại đại sứ quán Việt Nam tại Tokyo",
  title_en: "Lost passport — replacement at Vietnamese embassy in Tokyo",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "紛失 (ふんしつ)", english: "loss (of object)" },
    { japanese: "紛失届 (ふんしつとどけ)", english: "lost-item report (filed at police)" },
    { japanese: "再発行 (さいはっこう)", english: "re-issuance" },
    { japanese: "大使館 (たいしかん)", english: "embassy" },
    { japanese: "領事部 (りょうじぶ)", english: "consular section" },
    { japanese: "申請 (しんせい)", english: "application" },
    { japanese: "緊急 (きんきゅう)", english: "emergency" },
    { japanese: "本人確認 (ほんにんかくにん)", english: "identity verification" },
    { japanese: "渡航書 (とこうしょ)", english: "emergency travel document (interim)" },
    { japanese: "手数料 (てすうりょう)", english: "processing fee" }
  ],
  examples: [
    { japanese: "パスポートを紛失してしまいました。再発行をお願いしたく存じます。", english: "I have lost my passport. I would humbly like to request re-issuance." },
    { japanese: "昨日、警察に紛失届を提出してまいりました。", english: "Yesterday I submitted a lost-item report at the police station." },
    { japanese: "緊急で帰国する必要があり、渡航書も必要かと存じます。", english: "I need to return home urgently, so I believe an emergency travel document is also needed." },
    { japanese: "手数料はおいくらでございますでしょうか。", english: "How much is the processing fee?" },
    { japanese: "ご対応いただき、誠にありがとうございます。", english: "Thank you sincerely for handling this." }
  ],
  dialogue: [
    { speaker: "領事館スタッフ", japanese: "ベトナム大使館領事部です。どのようなご用件でしょうか。", english: "Vietnamese Embassy Consular Section. How may I help?" },
    { speaker: "チャウ", japanese: "パスポートを紛失してしまい、再発行をお願いしたく参りました。", english: "I lost my passport and have come to request re-issuance." },
    { speaker: "領事館スタッフ", japanese: "警察での紛失届はお済みですか。", english: "Have you completed the lost-item report at the police?" },
    { speaker: "チャウ", japanese: "はい、昨日、新宿警察署で済ませてまいりました。", english: "Yes, I completed it yesterday at Shinjuku Police Station." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "失礼いたします。グエン・ティ・チャウと申します。本日はパスポートの紛失の件でお伺いしました。", english: "Excuse me. I am Nguyen Thi Chau. I came today regarding a lost passport." },
    { speaker: "領事館スタッフ", japanese: "それは大変でしたね。落ち着いてお話を聞かせてください。いつ、どこで紛失されたかご存知ですか。", english: "That must have been difficult. Please calmly tell me about it. Do you know when and where you lost it?" },
    { speaker: "チャウ", japanese: "一昨日の夜、新宿駅近くのレストランで食事をした際、その後で気づきました。気づいた時にはすでに見つかりませんでした。", english: "The night before last at a restaurant near Shinjuku Station; I noticed afterward. When I noticed, I couldn't find it anymore." },
    { speaker: "領事館スタッフ", japanese: "わかりました。再発行のお手続きを始める前に、二点確認させていただきます。一点目、警察での紛失届はお済みですか。", english: "Understood. Before starting re-issuance, two confirmations. First, have you completed the police lost-item report?" },
    { speaker: "チャウ", japanese: "はい、昨日、新宿警察署で紛失届を提出いたしました。受理番号もこちらに控えております。", english: "Yes, yesterday I submitted the report at Shinjuku Police. I have the receipt number here." },
    { speaker: "領事館スタッフ", japanese: "結構です。二点目、本人確認のため、何か身分証明書をお持ちですか。運転免許証、保険証、または以前のパスポートのコピーなどございますか。", english: "Good. Second, for identity verification, do you have any ID? Driver's license, insurance card, or a copy of your old passport?" },
    { speaker: "チャウ", japanese: "ベトナムの身分証明書(CMND)とパスポートのコピーを携帯のメールに保存してございます。お見せできます。", english: "I have a Vietnamese ID card (CMND) and a passport copy saved in my phone email. I can show you." },
    { speaker: "領事館スタッフ", japanese: "それで結構です。プリントアウトもこちらでできますので。それから、写真は六枚必要です。背景白、四・五センチ × 三・五センチ。近くに証明写真機ございますか。", english: "That's fine. We can print out here. Also, six photos needed. White background, 4.5cm × 3.5cm. Do you know a photo booth nearby?" },
    { speaker: "チャウ", japanese: "申し訳ございません、近くの場所がわかりません。教えていただけますでしょうか。", english: "I'm sorry, I don't know a nearby place. Could you tell me?" },
    { speaker: "領事館スタッフ", japanese: "大使館を出て右へ二百メートル、コンビニ横に証明写真機がございます。十分程度で六枚ご用意できます。", english: "Out of the embassy, 200m to the right, there's a photo booth next to the convenience store. About 10 minutes for 6 photos." },
    { speaker: "チャウ", japanese: "ありがとうございます。手続きにかかる期間と手数料はいかがでしょうか。", english: "Thank you. How long does the process take, and what's the fee?" },
    { speaker: "領事館スタッフ", japanese: "通常は十営業日程度、料金は約二千円相当です。お急ぎの場合、緊急渡航書を発行することも可能です。緊急渡航書は当日発行で、一回限りの帰国専用となります。", english: "Normally about 10 business days; fee around 2000 yen equivalent. If urgent, we can issue an emergency travel document — same-day, single-use for return only." },
    { speaker: "チャウ", japanese: "実は来週の水曜日に帰国予定でございます。緊急渡航書をお願いしたく存じます。", english: "Actually I plan to return next Wednesday. I would humbly like the emergency travel document." },
    { speaker: "領事館スタッフ", japanese: "わかりました。それでは、写真撮影と申請書記入をお願いいたします。書類が整い次第、本日中にお渡しできるよう手配いたします。", english: "Understood. Then please take photos and fill out the application. Once documents are ready, I'll arrange to give it to you today." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。本当に助かります。雨降って地固まると申しますが、今回の経験を教訓にいたします。", english: "Thank you sincerely. You're truly helping me. As they say after rain the ground hardens — I'll take this as a lesson." },
    { speaker: "領事館スタッフ", japanese: "良いお考えですね。次回は、パスポートのコピーを別の場所に保管されることをお勧めします。", english: "Good thinking. Next time, I recommend keeping a passport copy in a separate location." },
    { speaker: "チャウ", japanese: "肝に銘じます。重ねて、ご丁寧なご対応をいただき、誠にありがとうございました。失礼いたします。", english: "I'll engrave it in my heart. Again, thank you sincerely for your courteous handling. Excusing myself." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn vừa đến đại sứ quán VN tại Tokyo (Akasaka). Hãy mở đầu cuộc nói chuyện với staff tiếng Nhật — KHÔNG dùng tiếng Việt vì staff cũng có thể là người Nhật. Dùng cụm pasupooto wo funshitsu shite shimaimashite, saihakkou wo onegai itashitaku mairimashita.",
    "Staff hỏi bạn đã có 紛失届 chưa. Bạn CHƯA đi cảnh sát. Hãy KHÔNG nói dối — thừa nhận chưa làm và xin hướng dẫn. Dùng cụm mada irashitemashita ga, dochira no keisatsusho ni ireba yoroshii deshou ka (em chưa làm, xin hỏi nên đến đồn cảnh sát nào).",
    "Bạn cần 緊急渡航書 (emergency travel document) vì bay về VN trong 3 ngày. Hãy giải thích urgency MÀ KHÔNG panic, MÀ KHÔNG demand. Dùng cụm makoto ni katte na onegai de gozaimasu ga (em xin lỗi vì yêu cầu đột ngột) cộng giải thích lý do."
  ],
  register_notes: "Tại đại sứ quán VN ở Tokyo, register tùy staff bạn gặp. Staff Việt: có thể tiếng Việt. Staff Nhật (consular section thường có): tiếng Nhật trang trọng. An toàn: bắt đầu bằng tiếng Nhật, switch sang Việt nếu staff đáp Việt. Bốn patterns đặc biệt: (1) MỞ ĐẦU KHIÊM TỐN: KHÔNG vào reception nói pasupooto kudasai (give me passport — kiểu demand). Dùng pasupooto wo funshitsu shite shimaimashite, saihakkou wo onegai itashitaku mairimashita (em đã lỡ làm mất hộ chiếu, em xin được nhờ cấp lại). 'Shimatte' = lỡ làm — show ownership. (2) ADMIT WHEN YOU DON'T KNOW: nếu chưa làm 紛失届 hoặc thiếu giấy tờ, KHÔNG bịa. Dùng moushiwake gozaimasen, mada XX wo shite orimasen (xin lỗi, em chưa làm XX). Honesty earns trust hơn fake competency. (3) URGENCY VS DEMAND: nếu cần 緊急渡航書, FRAME ở dạng request, không demand. Cụm: makoto ni katte na onegai de gozaimasu ga, raishuu suiyoubi ni kikoku no yotei de gozaimashite (em xin lỗi vì yêu cầu đột ngột, em định bay về thứ tư tuần sau). KHÔNG isoide kudasai (please hurry — sounds bossy). (4) GRATITUDE THROUGHOUT: cảm ơn nhiều lần — khi nhận hướng dẫn, khi nhận paperwork, cuối cuộc nói. Đặc biệt câu cuối: kasanete, go-teinei na go-taiou wo itadaki, makoto ni arigatou gozaimashita. Staff đại sứ quán xử lý nhiều cases khó — gratitude làm họ remember bạn trong positive light. // TODO native review — sai-hakkou (再発行) phrasing — alternative re-shinsei (再申請) hơi khác nghĩa nhưng đôi khi staff dùng; emergency document có thể là 渡航書 hoặc 緊急パスポート tùy thời điểm.",
  idiom_glosses: [
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau mưa to, đất chặt hơn — sau khó khăn, mọi thứ vững hơn. Phù hợp khi mất passport — frame incident as growth opportunity, không là drama.", example: "雨降って地固まると申します。今回の経験を教訓にいたします。" },
    { idiom: "備えあれば憂いなし", literal: "Có chuẩn bị thì không lo", meaning: "Better safe than sorry. Phù hợp cho lesson learned — luôn có copy passport ở chỗ khác (cloud, suitcase, friend).", example: "今後は備えあれば憂いなしで、コピーを別の場所にも保管いたします。" },
    { idiom: "肝に銘じる", literal: "Khắc sâu vào gan", meaning: "Khắc cốt ghi tâm. Câu chuẩn để đáp lời khuyên của staff về việc giữ giấy tờ trong tương lai.", example: "ご助言を肝に銘じ、二度と紛失しないよう注意いたします。" },
    { idiom: "七転び八起き", literal: "Bảy lần ngã, tám lần đứng dậy", meaning: "Kiên cường — ngã bao nhiêu cũng đứng dậy thêm một lần. Phù hợp cho mindset khi xử lý emergency abroad — không panic, methodical recovery.", example: "七転び八起きの精神で、落ち着いて手続きを進めてまいります。" }
  ],
  cultural_notes_vi: "Mất passport ở Nhật là crisis cá nhân nhưng có procedure rõ ràng. 6 bước theo thứ tự PHẢI đúng. (1) RETRACE: trong 24 giờ đầu, gọi mọi nơi đã đến (hotel reception, restaurant, tàu lost-and-found). Tỉ lệ recovery ở Nhật cao bất thường — Nhật trả lại đồ bị mất với rate 80 phần trăm trong Tokyo (theo Tokyo Metropolitan Police 2023 data). (2) POLICE 紛失届: trong 48 giờ, đến đồn cảnh sát gần nhất (KHÔNG cần đến nơi mất). Mang theo bất kỳ ID nào (CMND, passport copy trên phone, driver's license). Staff sẽ điền form, đưa số receipt — KHÔNG mất phí. KHÔNG bỏ qua bước này — đại sứ quán YÊU CẦU receipt này. (3) EMBASSY APPOINTMENT: gọi đại sứ quán VN trước (số: 03-3466-3311). Có thể cần appointment, hoặc walk-in tùy ngày. Hours: 9-12, 14-17 thứ 2-6. Đóng cửa ngày lễ Nhật cộng VN. (4) BRING DOCUMENTS: passport copy (digital OK), CMND copy, 6 photos chuẩn 4.5x3.5cm white background, application form (lấy tại embassy hoặc download trước), tiền mặt fee. (5) WAIT TIME: passport mới: 10 ngày làm việc. Emergency travel document (TPHS — thông phận hồi sang): same-day hoặc 1-2 ngày, một lần dùng cho return only, không re-enter Japan. Phải có vé về VN đã booked để qualify. (6) RETURN TO VN: với TPHS, immigration VN có thể ask thêm questions tại sân bay — bring police report receipt + embassy issuance letter. Khác biệt với phương Tây: ở Nhật, passport là sacred — mất passport không bị xem như fault của bạn (Nhật biết phải mất rất lâu để phục hồi). Police và embassy đối xử professional, không judgment. Nhưng ở VN, một số cán bộ có thể stigmatize. Mang đủ documents để minimize friction. Mẹo cuối: nếu mất tại tourist area (Asakusa, Akihabara, Shibuya), có lost-and-found dedicated cho tourists — Tokyo Metropolitan Police Lost Property Center (Iidabashi station). Online database tra cứu các đồ đã turn-in trong 30 ngày qua.",
  tip_advice_vi: "Trước khi sang Nhật, làm 4 việc. (1) Photocopy passport (color, 2 bản): 1 ở vali, 1 gửi về email cá nhân + email gia đình. (2) Cài app embassy — Đại sứ quán VN tại Tokyo có app đăng ký công dân (mocard) để embassy biết bạn đang ở Nhật. (3) Save số khẩn cấp trong phone: 03-3466-3311 (embassy), 110 (police), 119 (ambulance). (4) Lưu PDF của passport trên Google Drive / iCloud — KHÔNG chỉ trên phone (mất phone = mất tất cả). Khi đến Nhật, ngày đầu register WiFi và confirm có thể access cloud từ Nhật. Trong sinh hoạt hằng ngày, KHÔNG mang passport gốc trừ khi bắt buộc (đi tỉnh, đổi tiền lớn). Chỉ mang RESIDENCE CARD nếu là long-term, hoặc copy passport nếu là tourist. Để passport gốc trong hotel safe. Khi giao tiếp với cảnh sát hoặc embassy, chuẩn bị 4 thông tin: tên đầy đủ (theo passport), DOB, passport number cũ (từ copy), VN address. Mang theo bút (Nhật rất nhiều bureaucracy đòi viết — máy không phổ biến). Khi điền form Nhật, viết SLOWLY và CLEARLY. Tên family name viết HẾT BẰNG katakana hoặc romaji ALL CAPS. Address VN dịch sang romaji theo đúng hành chính (Quận → Quan, không District). Sau khi nhận passport mới hoặc TPHS, trong 24 giờ chụp ảnh và lưu cloud. Nếu được TPHS, planar bay về NGAY trong validity window (thường 1-2 tuần). KHÔNG plan transit qua nước thứ ba — TPHS chỉ valid VN-Japan direct. Nếu transit Korea/HK, có thể bị stuck — confirm với airline trước. Sau khi về VN, làm passport mới chính thức tại Cục Quản lý xuất nhập cảnh (P. An Đông, P.A08, Bộ Công An) — TPHS chỉ là interim. Trong tương lai, lesson rút ra: luôn có 2 bản passport copy ở 2 nơi khác nhau. Cost của lesson: 2000 yen + 2 ngày stress + có thể phải pay rebooking fee airline.",
  exercises: [
    { type: "fill-blank", question: "パスポートを紛失してしまい、___をお願いしたく存じます。", answer: "再発行" },
    { type: "matching", instruction: "Ghép thuật ngữ với function.", pairs: [
      { japanese: "紛失届", english: "đơn báo mất tại đồn cảnh sát" },
      { japanese: "再発行", english: "cấp lại passport (10 ngày)" },
      { japanese: "渡航書", english: "giấy thông hành khẩn cấp (same-day, 1 lần dùng)" },
      { japanese: "本人確認", english: "xác minh nhân thân (CMND, passport copy)" }
    ] },
    { type: "translation", vietnamese: "Em đã làm đơn báo mất tại đồn cảnh sát Shinjuku hôm qua.", japanese: "昨日、新宿警察署で紛失届を提出してまいりました。" }
  ]
},
{
  id: 74,
  title: "Booking change — Shinkansen/JR ticket change and fee dispute",
  title_vi: "Đổi vé — đổi vé Shinkansen/JR và tranh chấp phí",
  title_en: "Booking change — Shinkansen/JR ticket change and fee dispute",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "切符 (きっぷ)", english: "ticket" },
    { japanese: "変更 (へんこう)", english: "change / modification" },
    { japanese: "払い戻し (はらいもどし)", english: "refund" },
    { japanese: "手数料 (てすうりょう)", english: "processing fee" },
    { japanese: "指定席 (していせき)", english: "reserved seat" },
    { japanese: "自由席 (じゆうせき)", english: "non-reserved seat" },
    { japanese: "新幹線 (しんかんせん)", english: "bullet train" },
    { japanese: "みどりの窓口 (みどりのまどぐち)", english: "JR ticket office (Green Window)" },
    { japanese: "発車 (はっしゃ)", english: "departure (of train)" },
    { japanese: "ご利用 (ごりよう)", english: "your use (sonkeigo for using a service)" }
  ],
  examples: [
    { japanese: "新幹線の切符を変更したく、お伺いいたしました。", english: "I came to change a Shinkansen ticket." },
    { japanese: "明日の十時発を、明後日の十四時発に変更できますでしょうか。", english: "Can I change tomorrow's 10am departure to the day after at 2pm?" },
    { japanese: "変更手数料はおいくらでございますか。", english: "How much is the change fee?" },
    { japanese: "発車前であれば、無料での変更は可能でしょうか。", english: "If before departure, is free change possible?" },
    { japanese: "ご対応いただき、ありがとうございました。", english: "Thank you for handling this." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "すみません、新幹線の切符を変更したいのですが。", english: "Excuse me, I'd like to change a Shinkansen ticket." },
    { speaker: "駅員", japanese: "切符を拝見します。元の予約はいつのですか。", english: "Let me see the ticket. When was the original booking?" },
    { speaker: "チャウ", japanese: "明日の朝十時、東京発、京都行きでございます。", english: "Tomorrow morning 10am, from Tokyo to Kyoto." },
    { speaker: "駅員", japanese: "明後日に変更ですね。少々お待ちください。", english: "Change to the day after, then. One moment please." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "失礼いたします。新幹線の切符の変更をお願いしたく、伺いました。", english: "Excuse me. I came to request a Shinkansen ticket change." },
    { speaker: "駅員", japanese: "はい、切符を拝見します。どちらの便をどう変更ご希望ですか。", english: "Yes, let me see the ticket. Which booking, how do you want to change?" },
    { speaker: "チャウ", japanese: "明日の朝十時、東京発、京都行きの指定席です。これを明後日の十四時発に変更したく存じます。", english: "Tomorrow morning 10am, Tokyo to Kyoto, reserved seat. I'd like to change to the day after at 2pm." },
    { speaker: "駅員", japanese: "わかりました。お調べいたします。少々お待ちください。", english: "Understood. Let me check. One moment." },
    { speaker: "駅員", japanese: "明後日の十四時発、空席ございます。ただし、変更には手数料が発生いたします。", english: "Day after at 2pm, there's availability. However, there's a change fee." },
    { speaker: "チャウ", japanese: "手数料はおいくらでしょうか。", english: "How much is the fee?" },
    { speaker: "駅員", japanese: "発車二日前ですと、三十パーセントです。お切符の額が一万二千円ですので、三千六百円となります。", english: "Two days before departure, 30 percent. Your ticket is 12,000 yen, so 3,600 yen." },
    { speaker: "チャウ", japanese: "三千六百円ですか。少しお伺いしたいのですが、ホームページでは「乗車前ならいつでも一度は無料変更可能」と書いてございました。確認させていただけますでしょうか。", english: "3,600 yen? I'd like to ask — the website says one free change anytime before boarding. Could we verify?" },
    { speaker: "駅員", japanese: "ああ、それは「えきねっと」予約の場合ですね。お切符が紙の場合は、規定が異なります。発車一日前から手数料が発生いたします。", english: "Ah, that's for Eki-net online reservations. For paper tickets, rules differ. Fee applies starting one day before departure." },
    { speaker: "チャウ", japanese: "なるほど、規定の違いですね。承知いたしました。ただ、一点確認させていただきたいのですが、二日前は「発車一日前」に該当するのでしょうか。", english: "I see, different rules. Understood. But one clarification — is two days before considered 'one day before' departure?" },
    { speaker: "駅員", japanese: "申し訳ございません、確認させていただきます。お時間をいただいてもよろしいでしょうか。", english: "I apologize, let me check. May I take a moment?" },
    { speaker: "駅員", japanese: "お待たせいたしました。確認したところ、紙切符は「発車前日まで」が無料変更期間でございました。本日は変更日の前日にあたりますので、無料変更が可能でございます。先ほどの説明は誤りでした、申し訳ございません。", english: "Sorry to keep you waiting. Upon checking, paper tickets allow free change 'up to the day before departure.' Today is the day before the departure date, so free change is possible. My earlier explanation was wrong. I apologize." },
    { speaker: "チャウ", japanese: "ご丁寧に確認いただき、ありがとうございます。それでは、無料での変更でお願いいたします。", english: "Thank you for verifying carefully. Then please make the free change." },
    { speaker: "駅員", japanese: "承知いたしました。新しいお切符を発行いたします。明後日十四時発、東京発京都行き、指定席となります。お席は十二号車三A席でよろしいでしょうか。", english: "Understood. I'll issue a new ticket. Day after, 2pm, Tokyo to Kyoto, reserved seat. Is car 12, seat 3A acceptable?" },
    { speaker: "チャウ", japanese: "結構でございます。ありがとうございます。", english: "Yes, that's fine. Thank you." },
    { speaker: "駅員", japanese: "こちらが新しいお切符でございます。古い切符は破棄させていただきます。当日、十分前にホームへお越しください。", english: "Here is your new ticket. I'll dispose of the old one. Please arrive at the platform 10 minutes before on the day." },
    { speaker: "チャウ", japanese: "誠にありがとうございました。先ほどの確認で正しい情報をいただけて、本当に助かりました。失礼いたします。", english: "Thank you sincerely. Getting accurate info from your verification really helped. Excusing myself." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn tại みどりの窓口. Hãy mở đầu request đổi vé — KHÔNG phàn nàn về giá ngay. Dùng cụm shinkansen no kippu wo henkou itashitaku, ukagaimashita và đợi staff hỏi từng câu thay vì over-explain.",
    "Staff nói phí 30 phần trăm nhưng bạn nhớ thấy quy định khác trên website. Hãy KHÔNG cãi thẳng — dùng cụm hommepe-ji ni wa XX to kakarete orimashita ga, kakunin sasete itadakemasu deshou ka (website ghi XX, xin được kiểm tra). Nhật accept polite challenge nếu có evidence cụ thể.",
    "Staff nhận sai và xin lỗi. Bạn đã chờ thêm 10 phút. Hãy phản hồi khen ngợi sự cẩn thận — go-teinei ni kakunin itadaki, arigatou gozaimasu. KHÔNG say it's no problem (tonde mo nai) qua nhanh — Nhật appreciate khi acknowledge effort của staff."
  ],
  register_notes: "Tại みどりの窓口 (JR Green Window), staff được train về Q&A với customer trong keigo cao. Bạn match register họ. Năm patterns: (1) MỞ ĐẦU: kippu no henkou wo onegai shitaku, ukagaimashita (em đến nhờ đổi vé). 'Ukagaimashita' (đã đến — kenjougo) — hơn shaa khi nói 'kimashita'. (2) PARSE STAFF SPEED: staff nói nhanh khi list rules (rules là scripted speech). KHÔNG ngại xin lặp: osore irimasu ga, mou ichido o-negai dekimasu deshou ka. Nhật staff KHÔNG annoyed bởi this — họ scripted phải nói lại. (3) POLITE CHALLENGE WITH EVIDENCE: nếu staff sai (rare nhưng happens), KHÔNG cãi thẳng. Frame như 'em có thể nhầm, xin được verify': watashi no rikai ga matchigatte iru ka mo shiremasen ga, hommepe-ji ni wa XX to kakarete orimashita (em có thể hiểu sai, nhưng website ghi XX). Show evidence nếu có (screenshot trên phone). (4) ACCEPT CORRECTION GRACEFULLY: nếu họ correct lỗi (như dialogue trên), KHÔNG over-celebrate. Cụm: go-teinei ni kakunin itadaki, arigatou gozaimasu (cảm ơn sự xác minh cẩn thận). Maintain dignity for staff. (5) NEVER ARGUE OVER FEE: nếu fee đúng nhưng đắt, KHÔNG argue. Pay hoặc không đổi. Nhật staff không có authority discount. Trying to negotiate fee = make staff lose face = bad reputation. // TODO native review — eki-net (えきねっと) phrasing — tên service JR online; spelling capitalize hay không tùy context, paper ticket vs e-ticket rules thay đổi sau 2024 reform.",
  idiom_glosses: [
    { idiom: "急がば回れ", literal: "Vội thì đi vòng", meaning: "Vội vã hỏng việc — phù hợp khi đổi vé. Đừng rush, hỏi staff verify rules trước khi pay fee.", example: "急がば回れと申します。手数料を支払う前に、念のため確認させていただきます。" },
    { idiom: "石橋を叩いて渡る", literal: "Gõ cầu đá rồi mới qua", meaning: "Cẩn thận tối đa — verify trước khi commit. Phù hợp khi staff quote fee mà bạn nghi ngờ.", example: "石橋を叩いて渡るで、手数料の規定を再度確認させていただけますでしょうか。" },
    { idiom: "三人寄れば文殊の知恵", literal: "Ba người tụ lại có trí tuệ Văn Thù", meaning: "Trí tuệ tập thể — phù hợp khi staff cần consult với supervisor về một edge case rule.", example: "三人寄れば文殊の知恵で、上司に確認していただいてもよろしいでしょうか。" },
    { idiom: "一期一会", literal: "Một đời một lần gặp", meaning: "Mỗi cuộc gặp duy nhất — phù hợp cuối cuộc nói khi cảm ơn staff đã xử lý cẩn thận. Frame customer-service interaction như meaningful, không transactional.", example: "本日のご対応、一期一会と感じております。誠にありがとうございました。" }
  ],
  cultural_notes_vi: "JR ticket change ở Nhật có 5 đặc điểm khác phương Tây. (1) RULES VARY BY CHANNEL: vé giấy mua tại みどりの窓口 vs vé Eki-net online vs vé qua agency có rules KHÁC nhau. Eki-net thường nhẹ nhất (nhiều free changes), agency strict nhất. Khi mua vé, hỏi rõ về change/refund rules. (2) FEE STRUCTURE: tiêu chuẩn 30 phần trăm nếu trong 2 ngày trước departure. Free trước đó. Nhưng có exception: ngày trước departure cũng có thể free cho một số ticket types. STAFF có thể không know mọi exception — đừng ngại verify. (3) CASH PRICING: nhiều JR offices vẫn cash-only cho refunds. Mang đủ tiền mặt phòng khi cần pay fee. Card OK cho new ticket nhưng refund thường cash. (4) TIMING SENSITIVITY: nếu vé là cùng ngày departure, change rules khác — có thể paid full nếu không có vé thay thế trong cùng category. Đến office EARLY (ít nhất 30 phút trước departure ban đầu) để có flexibility. (5) GUI DI RULES: nếu vé là return-trip combo, change một chiều có thể affect chiều kia. Hỏi staff verify total impact trước khi confirm. Khác biệt với VN: ở VN ticket change thường flexible negotiate, có thể beg staff giảm fee; ở Nhật, fee là hard rule, không negotiable. Argue về fee = mất face cho staff = bị nhớ negative. Nhưng ASKING TO VERIFY rule là OK — staff Japanese rất hỗ trợ với verification request, sometimes find exception cho bạn. Mẹo: Eki-net registration tại nhà trước trip cho phép online changes (no office visit) cho most tickets. Free first change online. App download trước departure save thời gian. Nếu missed train completely (departure passed), KHÔNG bao giờ refund — chỉ option là buy mới ticket. Đến office trong 30 phút sau missed time có thể qualify cho 'late change' với một số fee thay vì buy mới — phụ thuộc staff discretion.",
  tip_advice_vi: "Khi đổi vé Shinkansen, làm 3 việc trước khi đến window. (1) CHỤP MÀN HÌNH RULE từ JR website (English version đầy đủ enough). Đặc biệt section về free-change deadline. Nếu có discrepancy, show staff. (2) BIẾT TICKET TYPE: là Hayabusa, Hikari, Kodama, Nozomi? Reserved hay non-reserved? Single hay round-trip? Mỗi type có rules khác. Nhìn ticket carefully trước. (3) HAVE BOTH OPTIONS: chuẩn bị plan A (preferred new time) và plan B (acceptable alternative) — vì plan A có thể full. Khi đến window: stand in line at green-line marker, đợi staff vẫy. Không vượt line. Đặt ticket on counter face-up, KHÔNG đưa vào tay staff. Câu mở đầu: kippu no henkou wo onegai shimasu cộng đề xuất new time. Để staff process — usually 2-3 phút. Trong khi chờ, KHÔNG hỏi câu khác (làm staff distract). Nếu staff quote fee, viết number xuống trên scrap paper (mang theo) — tránh hiểu sai. Nếu fee có vẻ wrong, dùng cụm verify (xem register notes). KHÔNG raise voice, KHÔNG fold arms (defensive). Stand calm, eye contact 60 phần trăm. Nếu staff confirm fee đúng, decision: pay hoặc cancel. Nếu pay: cash-only sometimes. Nếu cancel and walk away: politely thank staff, không express frustration. Sau khi nhận new ticket, IMMEDIATELY check: ngày, giờ, train number, car/seat, station. Nếu sai gì, return ngay (cùng staff, cùng line) — sau khi rời window, fix khó hơn. Trên platform: arrive 10 phút trước, find car number on platform marker (vẽ trên ground). Đợi behind yellow line. Khi train arrive, đứng bên cạnh door, để passengers xuống trước, rồi step in. Không rush. Mẹo cuối: download JR Pass app nếu có pass — track changes, see real-time delays, find alternative trains nếu missed. Eki-net account (free register) gives 5 phần trăm discount + free first change online.",
  exercises: [
    { type: "fill-blank", question: "ホームページでは「乗車前ならいつでも一度は無料変更可能」と書かれて___ました。", answer: "おり" },
    { type: "matching", instruction: "Ghép thuật ngữ JR với meaning.", pairs: [
      { japanese: "指定席", english: "ghế đặt trước (booked seat)" },
      { japanese: "自由席", english: "ghế tự do (first-come basis)" },
      { japanese: "みどりの窓口", english: "JR ticket office in person" },
      { japanese: "えきねっと", english: "JR online booking system (Eki-net)" }
    ] },
    { type: "translation", vietnamese: "Em xin được kiểm tra — về điểm này, có thể là em hiểu sai.", japanese: "確認させていただけますでしょうか。私の理解が間違っているかもしれません。" }
  ]
},
{
  id: 75,
  title: "Hospital visit (病院/救急外来)",
  title_vi: "Khám bệnh tại bệnh viện (病院/救急外来)",
  title_en: "Hospital visit (病院/救急外来)",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "病院 (びょういん)", english: "hospital" },
    { japanese: "救急外来 (きゅうきゅうがいらい)", english: "emergency outpatient ward" },
    { japanese: "診察 (しんさつ)", english: "medical examination" },
    { japanese: "症状 (しょうじょう)", english: "symptoms" },
    { japanese: "保険証 (ほけんしょう)", english: "insurance card" },
    { japanese: "処方箋 (しょほうせん)", english: "prescription" },
    { japanese: "薬 (くすり)", english: "medicine" },
    { japanese: "アレルギー", english: "allergy" },
    { japanese: "発熱 (はつねつ)", english: "fever" },
    { japanese: "問診票 (もんしんひょう)", english: "medical questionnaire (filled before exam)" }
  ],
  examples: [
    { japanese: "昨日から発熱と頭痛がございます。", english: "I have had fever and headache since yesterday." },
    { japanese: "保険証はこちらでございます。", english: "Here is my insurance card." },
    { japanese: "薬のアレルギーはペニシリンでございます。", english: "My medicine allergy is penicillin." },
    { japanese: "処方箋はどちらの薬局でいただけますでしょうか。", english: "At which pharmacy can I get the prescription filled?" },
    { japanese: "ご診察、誠にありがとうございました。", english: "Thank you sincerely for the examination." }
  ],
  dialogue: [
    { speaker: "受付", japanese: "保険証をお願いします。今日はどうされましたか。", english: "Insurance card, please. What brings you here today?" },
    { speaker: "チャウ", japanese: "昨日から発熱と頭痛がございまして、診察をお願いしたく参りました。", english: "Since yesterday I have fever and headache, so I came for examination." },
    { speaker: "受付", japanese: "問診票にご記入ください。受付番号は二十三番です。", english: "Please fill out the questionnaire. Your number is 23." },
    { speaker: "チャウ", japanese: "承知いたしました。ありがとうございます。", english: "Understood. Thank you." }
  ],
  dialogue_long: [
    { speaker: "受付", japanese: "こんにちは、初めての方でしょうか。", english: "Hello, is this your first visit?" },
    { speaker: "チャウ", japanese: "はい、初めてでございます。実は昨日の夜から発熱がございまして、本日診察をお願いしたく参りました。", english: "Yes, my first visit. Actually, I've had fever since last night, so I came today for examination." },
    { speaker: "受付", japanese: "わかりました。保険証はお持ちですか。", english: "Understood. Do you have your insurance card?" },
    { speaker: "チャウ", japanese: "はい、こちらでございます。在留カードもお見せいたします。", english: "Yes, here it is. I'll also show my residence card." },
    { speaker: "受付", japanese: "ありがとうございます。それでは、こちらの問診票にご記入ください。日本語でご記入が難しい場合、英語版もございます。", english: "Thank you. Then please fill out this questionnaire. If Japanese is difficult, we have an English version." },
    { speaker: "チャウ", japanese: "ありがとうございます。日本語版で挑戦してみますが、わからない箇所は英語版を参考にさせていただきます。", english: "Thank you. I'll try the Japanese version but reference the English one for what I don't understand." },
    { speaker: "受付", japanese: "結構です。書き終わったら、待合室でお待ちください。お名前を呼ばれましたら、第二診察室へお越しください。", english: "Fine. After filling out, wait in the waiting area. When your name is called, please come to Exam Room 2." },
    { speaker: "看護師", japanese: "グエン・ティ・チャウさん、第二診察室へどうぞ。", english: "Ms. Nguyen Thi Chau, Exam Room 2 please." },
    { speaker: "医師", japanese: "こんにちは、内科医の田中です。今日はどうされましたか。", english: "Hello, I'm Dr. Tanaka from internal medicine. What's the issue today?" },
    { speaker: "チャウ", japanese: "昨日の夜九時頃から、急に三十八度の発熱と頭痛がございます。喉も少し痛みます。食欲はありますが、寒気がいたします。", english: "Around 9pm last night, I suddenly got 38-degree fever and headache. My throat also hurts a bit. I have appetite but feel chills." },
    { speaker: "医師", japanese: "なるほど、典型的な風邪の症状ですね。インフルエンザの可能性もありますので、念のため検査いたします。", english: "I see, typical cold symptoms. There's also flu possibility, so I'll test just in case." },
    { speaker: "チャウ", japanese: "承知いたしました。検査の結果、インフルエンザの場合、何日くらい仕事を休む必要がございますでしょうか。", english: "Understood. If the test shows flu, about how many days do I need to rest from work?" },
    { speaker: "医師", japanese: "インフルエンザの場合、発症から五日間、かつ解熱後二日間は出勤を控えていただくのが一般的です。診断書もお出しできます。", english: "For flu, generally rest 5 days from onset, plus 2 days after fever subsides. I can issue a medical certificate." },
    { speaker: "チャウ", japanese: "ありがとうございます。診断書をいただけますと、会社に提出するのに大変助かります。", english: "Thank you. A medical certificate would help a lot for submitting to my company." },
    { speaker: "医師", japanese: "では、検査いたします。鼻に綿棒を入れますが、少し違和感があるかもしれません。", english: "Then let's test. I'll insert a swab in your nose; you may feel some discomfort." },
    { speaker: "チャウ", japanese: "はい、お願いいたします。", english: "Yes, please proceed." },
    { speaker: "医師", japanese: "(検査後)結果はインフルエンザA型で陽性です。タミフルを五日分処方いたします。アレルギーはございますか。", english: "(after test) Result: positive for influenza A. I'll prescribe Tamiflu for 5 days. Any allergies?" },
    { speaker: "チャウ", japanese: "ペニシリンにアレルギーがございます。それ以外はございません。", english: "I have a penicillin allergy. Nothing else." },
    { speaker: "医師", japanese: "タミフルはペニシリン系ではないので、問題ございません。十分な水分と休養をお取りください。お大事に。", english: "Tamiflu is not penicillin-based, so no issue. Please get plenty of fluids and rest. Take care." },
    { speaker: "チャウ", japanese: "ご丁寧な診察、誠にありがとうございました。失礼いたします。", english: "Thank you sincerely for the careful examination. Excusing myself." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn lần đầu đến bệnh viện ở Tokyo. Hãy mở đầu với reception — cụm hajimete de gozaimasu cộng cụ thể symptoms từ khi nào, đâu đau. KHÔNG dùng casual sukoshi guai ga warui (hơi không khỏe) — Nhật cần specific timeline và body parts.",
    "Bác sĩ hỏi alergi. Bạn có dị ứng penicillin nhưng không nhớ tiếng Nhật của penicillin. Hãy KHÔNG fake — dùng cụm peniciilin to iu kusuri ni areriguii ga gozaimasu (em dị ứng với thuốc tên penicillin) cộng spell ra nếu bác sĩ ask. Nhật accept English drug names.",
    "Bạn cần 診断書 (medical certificate) cho công ty Nhật vì phải nghỉ 5 ngày. Hãy request explicitly — KHÔNG ngại — diagnostic certificate là routine ở Nhật. Cụm: shindansho wo o-negai shitaku zonjimasu, kaisha ni teishutsu suru hitsuyou ga gozaimasu node."
  ],
  register_notes: "Hospital ở Nhật uses teineigo cao (desu/masu+) cho tất cả interactions. Bốn patterns đặc biệt: (1) SYMPTOM REPORTING: dùng -ga gozaimasu thay -ga arimasu cho bệnh: hatsunetsu to zutsuu ga gozaimasu (em có sốt và đau đầu). 'Gozaimasu' show humility với bác sĩ. Cụm timeline cụ thể: kinou no yoru kuji-goro kara (từ 9 giờ tối qua), KHÔNG vague kinou kara (từ hôm qua). (2) DESCRIBE PAIN PRECISELY: Nhật cần specifics về pain location + intensity. nodo (cổ họng), atama (đầu), onaka (bụng), mune (ngực). Intensity: sukoshi (nhẹ), kanari (đáng kể), hidoi (nặng). Type: zukinzukin (đập đập), kirikiri (nhói). (3) MEDICAL HISTORY: dùng bigieni-teki na byouki (chronic disease), genzai fukuyou-chuu no kusuri (current medications). Cẩn thận: dị ứng = areriguii (アレルギー), KHÔNG dị ứng = areriguii wa gozaimasen. (4) FOLLOW DOCTOR'S DIRECTION: khi bác sĩ ask move/breathe/etc, dùng hai (yes) cộng tuân theo. KHÔNG ask why during procedure — wait until end. Câu cuối khi rời: o-daiji ni (take care — bác sĩ Nhật) — bạn đáp: arigatou gozaimashita. Shitsurei itashimasu. // TODO native review — tamifuru (タミフル) brand name vs generic oseltamivir; some hospitals dùng generic name now post-2023; medical certificate có thể là 診断書 hoặc 病気証明書 tùy hospital.",
  idiom_glosses: [
    { idiom: "お大事に", literal: "Hãy giữ gìn (sức khỏe)", meaning: "Take care of yourself — câu chuẩn bác sĩ/nurse nói khi bạn rời. Không phải idiom truyền thống nhưng là cụm cố định trong medical context. Bạn KHÔNG nói lại 'o-daiji ni' với bác sĩ (out of place); đáp arigatou gozaimashita.", example: "十分な水分と休養をお取りください。お大事に。" },
    { idiom: "備えあれば憂いなし", literal: "Có chuẩn bị thì không lo", meaning: "Better safe than sorry — phù hợp khi bác sĩ test cho cả flu khi bạn nghĩ là common cold. Frame test like preparedness, không over-treatment.", example: "備えあれば憂いなし、念のため検査いたしましょう。" },
    { idiom: "病は気から", literal: "Bệnh phát từ tinh thần", meaning: "Stress affects health — gốc Nhật cổ. Phù hợp khi nói về work stress contributing to illness. Bác sĩ Nhật accept như factor.", example: "病は気からと申します。最近、お仕事のストレスが多かったかもしれません。" },
    { idiom: "急がば回れ", literal: "Vội thì đi vòng", meaning: "Vội vã hỏng việc — phù hợp khi bạn muốn rush back to work nhưng bác sĩ recommend rest 5 ngày. Take rest properly để phục hồi đầy đủ.", example: "急がば回れ、しっかり休んで早く治すよう心がけます。" }
  ],
  cultural_notes_vi: "Bệnh viện Nhật khác phương Tây ở 6 điểm. (1) INSURANCE EVERYTHING: bắt buộc 国民健康保険 (national health insurance) hoặc 社会保険 (employer insurance) trước khi đến. Nếu là tourist, mang travel insurance. KHÔNG có insurance = pay 100 phần trăm cash (often 30,000-50,000 yen cho consultation). (2) APPOINTMENT VS WALK-IN: bệnh viện lớn (大学病院) cần referral từ clinic nhỏ. Walk-in tại 大学病院 không có referral charge thêm 5,000 yen 'selection fee'. Cách tốt: đến clinic nhỏ (クリニック) trước, get referral nếu cần specialist. (3) LANGUAGE BARRIER: ít bác sĩ Nhật fluent English. Mang theo translation app, hoặc đến bệnh viện International (Tokyo: St. Luke's, Akasaka International Clinic) where staff English-speaking. Một số ward có volunteer interpreters — gọi trước hỏi. (4) PRESCRIPTION SEPARATE: Nhật tách medical exam và pharmacy. Bác sĩ khám, prescribe trên paper 処方箋. Bạn cầm processhei đến 薬局 (drugstore với green cross sign) — usually within walk distance. Pharmacy hơn 100m từ hospital là norm. (5) WAIT TIME: bệnh viện công thường wait 1-2 giờ. Mang sách/laptop, không có WiFi reliable ở nhiều hospital. Lunch break 12-13 không khám — schedule around. (6) PAYMENT: cuối visit, đến 会計 (cashier) pay. Card OK ở major hospital, cash-only ở clinic nhỏ. Mang đủ 5,000-15,000 yen cash cho first visit. Khác biệt với VN: ở VN bạn chọn bác sĩ specific trước; ở Nhật, được assigned theo schedule. Ở VN có thể tip extra cho tốt hơn; ở Nhật, KHÔNG tip — illegal trong medical context, đẳng cấp insult bác sĩ. Mẹo cuối: học 5 từ medical key thuộc lòng trước khi đi: 痛い (đau), 熱 (sốt), 咳 (ho), 吐き気 (buồn nôn), 頭痛 (đau đầu). Pattern symptom + ga arimasu là reliable. Cho emergency: 119 cho ambulance, English available 24/7. Không hesitate to call — Nhật ambulance free at point of service.",
  tip_advice_vi: "Trước khi sang Nhật long-term: đăng ký 国民健康保険 tại city hall (市役所) trong 14 ngày kể từ khi nhận residence card. Bring residence card và pay first month fee (3,000-15,000 yen tùy income). Insurance card sẽ mailed trong 1-2 tuần. Trong waiting period, KHÔNG có insurance, nếu khẩn cấp pay full upfront và claim back sau khi insurance issued. Nếu là tourist, mua travel insurance trước departure (NEVER skip — Japan medical đắt, simple ER visit có thể 300,000+ yen without insurance). Khi đến hospital: arrive 30 phút sớm cho first visit. Bring: insurance card, residence card or passport, list current medications (write on paper, English OK), allergy list. Reception sẽ ask làm 問診票 (medical questionnaire) — 2-3 trang covering: chief complaint, duration, severity, previous illnesses, family history, current meds. Fill carefully — bác sĩ uses this. Nếu Japanese khó, ask English version (most major hospitals have). Trong cuộc khám: KHÔNG remove clothing unless asked — Nhật minimize physical exposure. Bác sĩ dùng stethoscope qua áo OK. Nếu cần thoroughly check, bác sĩ sẽ provide gown. KHÔNG joke about symptoms (Nhật medical context taken seriously). Symptoms exaggeration thua underplay. Sau exam, bác sĩ sẽ explain diagnosis. Nếu không hiểu, ask: kakunin sasete itadakemasu deshou ka cộng repeat back (em xác nhận lại — XX bị YY, đúng không?). Bác sĩ Nhật appreciate verification step. Khi nhận processhei, mang đến 薬局 IMMEDIATELY (valid 4 ngày only). Pharmacy sẽ ask thêm questions about dosage timing, food restrictions. Đáp truthful. Sau pay, nhận medicine + 薬剤情報提供書 (drug info sheet) — keep cho future reference. Common follow-up: nếu được prescribed antibiotic, finish FULL course (Nhật strict about this), không stop khi feel better. Sau visit, nếu cần medical certificate cho work, ask trước khi rời: shindansho wo o-negai shitaku zonjimasu (em xin diagnostic certificate). 1,000-3,000 yen extra. Nếu emergency outside hospital hours: 119 ambulance hoặc 救急外来 (24h ER) at major hospitals. Không hesitate. Nếu mental health crisis: TELL Lifeline Tokyo English support (03-5774-0992), miễn phí.",
  exercises: [
    { type: "fill-blank", question: "昨日から発熱と頭痛が___ます。", answer: "ござい" },
    { type: "matching", instruction: "Ghép symptom với cụm reporting đúng.", pairs: [
      { japanese: "発熱があります", english: "có sốt" },
      { japanese: "喉が痛みます", english: "đau cổ họng" },
      { japanese: "吐き気がします", english: "buồn nôn" },
      { japanese: "寒気がいたします", english: "lạnh / rùng mình (formal)" }
    ] },
    { type: "translation", vietnamese: "Em dị ứng với penicillin. Ngoài ra không có dị ứng nào khác.", japanese: "ペニシリンにアレルギーがございます。それ以外はございません。" }
  ]
},
{
  id: 76,
  title: "Hotel/ryokan complaint — room defect, requesting room change",
  title_vi: "Khiếu nại khách sạn/ryokan — phòng có sự cố, xin đổi phòng",
  title_en: "Hotel/ryokan complaint — room defect, requesting room change",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "ホテル", english: "hotel (Western style)" },
    { japanese: "旅館 (りょかん)", english: "ryokan (traditional Japanese inn)" },
    { japanese: "フロント", english: "front desk" },
    { japanese: "客室 (きゃくしつ)", english: "guest room" },
    { japanese: "故障 (こしょう)", english: "malfunction / broken" },
    { japanese: "不具合 (ふぐあい)", english: "defect / problem (general)" },
    { japanese: "お部屋の変更 (おへやのへんこう)", english: "room change" },
    { japanese: "騒音 (そうおん)", english: "noise" },
    { japanese: "エアコン", english: "air conditioner" },
    { japanese: "浴室 (よくしつ)", english: "bathroom" }
  ],
  examples: [
    { japanese: "お部屋のエアコンが故障しているようでございます。", english: "The room's air conditioner seems to be broken." },
    { japanese: "可能でしたら、お部屋の変更をお願いしたく存じます。", english: "If possible, I would humbly like to request a room change." },
    { japanese: "上の階からの騒音で、なかなか眠れません。", english: "Due to noise from the floor above, I can't sleep well." },
    { japanese: "ご対応いただけますと幸いでございます。", english: "I would be grateful for your handling." },
    { japanese: "お忙しいところ、申し訳ございません。", english: "I apologize for troubling you when you're busy." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "失礼いたします。三〇五号室のグエンと申します。お部屋について、ご相談がございます。", english: "Excuse me. I'm Nguyen from room 305. I have a request about my room." },
    { speaker: "フロント", japanese: "はい、グエン様、どうされましたか。", english: "Yes, Ms. Nguyen, what's the issue?" },
    { speaker: "チャウ", japanese: "エアコンが故障しているようでして、室温が下がりません。", english: "The air conditioner seems broken; the temperature isn't dropping." },
    { speaker: "フロント", japanese: "それは申し訳ございません。すぐに技術スタッフをお部屋に派遣いたします。", english: "I'm so sorry. I'll send technical staff to your room immediately." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "失礼いたします。三〇五号室のグエン・ティ・チャウと申します。お部屋についてご相談がございまして、フロントへ参りました。", english: "Excuse me. I'm Nguyen Thi Chau from room 305. I have a matter about my room, so I came to the front desk." },
    { speaker: "フロント", japanese: "グエン様、いつもご利用いただきありがとうございます。どのようなことでしょうか。", english: "Ms. Nguyen, thank you for your continued patronage. What's the matter?" },
    { speaker: "チャウ", japanese: "二点ございます。一点目、エアコンが故障しているようでして、設定を二十二度にしても室温が下がりません。今夜は外が三十度を超えると伺いまして、少し心配でございます。", english: "Two points. First, the AC seems broken — I set it to 22 degrees but the room temperature won't drop. I heard tonight will be over 30 outside, so I'm a bit worried." },
    { speaker: "フロント", japanese: "それは大変申し訳ございません。もう一点はいかがでしょうか。", english: "I'm so sorry. And the other point?" },
    { speaker: "チャウ", japanese: "二点目、上の階からの足音と話し声が大きく、昨夜あまり眠れませんでした。本日も同じようでしたら、明日の業務に差し支えがあるかと心配しております。", english: "Second, footsteps and voices from the floor above are loud — I couldn't sleep much last night. If tonight is similar, I'm worried it'll affect tomorrow's work." },
    { speaker: "フロント", japanese: "二件とも承知いたしました。エアコンに関しましては、今すぐ技術スタッフを派遣して点検いたします。修理が難しい場合、お部屋の変更も検討いたします。", english: "Understood on both. For the AC, I'll send technical staff immediately. If repair is difficult, we'll consider a room change." },
    { speaker: "チャウ", japanese: "ありがとうございます。お部屋の変更も可能でしたら、ぜひご検討いただきたく存じます。", english: "Thank you. If room change is possible, please consider it." },
    { speaker: "フロント", japanese: "本日のお部屋状況を確認いたします。少々お待ちください。", english: "Let me check today's room availability. One moment please." },
    { speaker: "フロント", japanese: "お待たせいたしました。同じカテゴリーで、最上階のお部屋が空いてございます。最上階ですと、上階からの騒音はございません。エアコンも別系統でございますので、両方の問題が解決できるかと存じます。", english: "Sorry to keep you waiting. A same-category room on the top floor is available. Top floor means no noise from above. AC is separate system, so both issues can be resolved." },
    { speaker: "チャウ", japanese: "それは大変ありがたいご提案でございます。お部屋の変更にかかる料金はいかがでしょうか。", english: "That's a wonderful suggestion. Is there any fee for the room change?" },
    { speaker: "フロント", japanese: "今回は当ホテル側の不具合によるご移動ですので、追加料金は一切いただきません。お荷物の移動も、当方のスタッフが対応させていただきます。", english: "Since this move is due to our hotel's defect, no additional charge. Our staff will handle moving your luggage." },
    { speaker: "チャウ", japanese: "ご丁寧なご対応、誠にありがとうございます。今、お部屋に荷物がございますので、一度戻ってから移動の手続きをお願いしてもよろしいでしょうか。", english: "Thank you sincerely for the courteous handling. My luggage is in the room now; may I return briefly before the move?" },
    { speaker: "フロント", japanese: "もちろんでございます。お部屋にお戻りいただき、十分ほどでフロントへお越しください。新しいお部屋へご案内させていただきます。", english: "Of course. Please return to your room, then come to the front desk in about 10 minutes. We'll guide you to the new room." },
    { speaker: "チャウ", japanese: "誠にありがとうございました。お忙しいところお手数をおかけいたしまして、申し訳ございませんでした。", english: "Thank you sincerely. I apologize for the trouble during your busy time." },
    { speaker: "フロント", japanese: "とんでもございません。お客様にご不便をおかけしたのは当ホテルの責任です。雨降って地固まると申しますが、本日のご対応を機に、より良いサービスをお届けできるよう努めてまいります。", english: "Not at all. It's our hotel's responsibility for inconveniencing you. As they say after rain the ground hardens — we'll strive to deliver better service through today's handling." },
    { speaker: "チャウ", japanese: "ご丁寧にありがとうございます。それでは、十分後にお伺いいたします。", english: "Thank you for your courtesy. Then I'll come back in 10 minutes." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn ở khách sạn Tokyo, AC phòng hỏng. Hãy đến reception KHÔNG complain hostile — frame as 'consult' (go-soudan). Dùng cụm o-heya ni tsuite go-soudan ga gozaimasu (em có việc xin tham vấn về phòng). Nhật staff response tốt với polite frame.",
    "Hotel staff đề xuất technical fix nhưng bạn muốn đổi phòng. Hãy KHÔNG ép — request softly với kanou deshitara, o-heya no henkou mo go-kentou itadakitaku zonjimasu (nếu có thể, em xin được xem xét đổi phòng). Cho staff option để decide.",
    "Khách sạn đề xuất phòng thay thế nhưng có thêm phí 5,000 yen vì upgrade category. Hãy thương lượng — KHÔNG demand phải free. Cụm: kanou deshitara, dou itta gokentou itadakemasu deshou ka (nếu có thể, xin được xem xét) cộng đề xuất compromise (downgrade category để no fee)."
  ],
  register_notes: "Khiếu nại tại hotel Nhật cần frame as 'consultation' (go-soudan), không 'complaint' (kujo). Bốn patterns: (1) MỞ ĐẦU MỀM: o-heya ni tsuite go-soudan ga gozaimasu (em có việc xin tham vấn về phòng) — frame như cooperative problem-solving, không adversarial. KHÔNG dùng kujo wo iitai (muốn complain) — quá direct. (2) STATE FACTS, NOT FEELINGS: KHÔNG urusai desu (ồn quá!) — dùng ue no kai kara no oto-oto to hanashi-goe ga ookiku, nakanaka nemuremasen deshita (tiếng bước chân và nói chuyện từ tầng trên to, em không ngủ được). Specific facts trên emotional reaction. (3) PROPOSE SOLUTION: KHÔNG để hotel decide alone. Dùng kanou deshitara, o-heya no henkou wo o-negai shitaku zonjimasu (nếu có thể, em xin đổi phòng). Show bạn thinking constructively. (4) CỬA SAU CHO HOTEL FACE: nếu hotel admit fault, KHÔNG over-celebrate. Dùng cụm o-tesuu wo o-kake itashimashite, moushiwake gozaimasen (em đã làm phiền, xin lỗi) — even when hotel is at fault. Maintain mutual respect. // TODO native review — fugu-ai (不具合) phrasing — alternative koshou (故障) more specific to mechanical break vs vague problem; neighborhood noise complaint may need 騒音問題 phrasing tùy intensity.",
  idiom_glosses: [
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau khó khăn, mọi thứ vững hơn — phù hợp khi staff respond well to complaint, frame interaction như growth opportunity for hotel.", example: "雨降って地固まると申しますが、本日のご対応を機に、より良いサービスをお届けできるよう努めてまいります。" },
    { idiom: "急がば回れ", literal: "Vội thì đi vòng", meaning: "Vội vã hỏng việc — phù hợp khi đề xuất hotel take time để properly fix issue thay vì band-aid solution.", example: "急がば回れで、しっかり原因を確認いただけますと幸いでございます。" },
    { idiom: "おもてなし", literal: "Hospitality", meaning: "Khái niệm hospitality Nhật — proactive guest care. Khi staff handle complaint well, dùng để complement: omotenashi no kokoro ga kanjirаremashita (em cảm nhận được tinh thần omotenashi).", example: "本日のご対応に、おもてなしの心が感じられました。" },
    { idiom: "お互い様", literal: "Cả hai bên cùng vậy", meaning: "Mutual — phù hợp khi defuse tension. Frame complaint như shared interest (hotel muốn satisfied customer, you muốn good stay) — KHÔNG zero-sum.", example: "お客様もホテルも満足する形が一番ですね。お互い様で解決策を考えましょう。" }
  ],
  cultural_notes_vi: "Khiếu nại hotel ở Nhật khác phương Tây ở 5 điểm. (1) FRAME MATTERS: complaint trong VN có thể direct, ở Nhật MUST frame như 'consultation' (go-soudan). Cùng content nhưng cách trình bày quyết định kết quả. Direct complaint = staff defensive = no flexibility. Soft consult = staff find creative solution. (2) DOCUMENT WITH PHOTOS: nếu có visible defect (mold, broken lamp, dirty bathroom), chụp ảnh trước. Khi present, dùng kochira no shashin wo go-ran kudasai (mời xem ảnh). Photo evidence prevents he-said-she-said. (3) NEVER YELL: bất kể frustrated, KHÔNG raise voice. Một lần shout = mất hết good will + có thể bị politely asked to leave. Maintain calm dignified tone. Nếu thực sự upset, đi back đến phòng cool down 10 phút trước khi đến reception. (4) ESCALATION PATH: nếu front desk staff không resolve, ask to speak with 支配人 (manager). Cụm: shihainin san to o-hanashi sasete itadakemasu deshou ka. KHÔNG escalate via TripAdvisor/social media trước — Nhật xem public shaming as ultimate insult, will ruin relationship and reputation hotel needs. Internal resolution first, public review only if internal fails completely. (5) COMPENSATION EXPECTATION: trong VN, complaint thường = expect refund. Ở Nhật, primary expectation là PROBLEM SOLVED, not compensation. Một số hotels offer voluntary discount/upgrade as goodwill, KHÔNG demand. Refund đầy đủ chỉ khi service không delivered (room not available). Khác biệt với VN: ở VN có thể leverage 1-star Google review threat; ở Nhật, threat-based negotiation = enemy created. Cooperative-frame negotiation = ally created. Long term, second visit có discount + better room nếu first complaint handled cooperatively. Mẹo: ryokan (traditional inn) khác hotel ở point: ryokan owner thường family business, complaint = personal hurt to family. Be EXTRA gentle. Frame như feedback to help them improve, không complaint. Họ sẽ go above-and-beyond để fix.",
  tip_advice_vi: "Trước khi check-in: research hotel reviews (TripAdvisor, Google) để biết common issues (noise, AC, parking). Book through reputable platform (Booking.com, JR-East travel) — họ có support if hotel không respond. Lưu booking confirmation + cancellation policy on phone. Khi check-in: ask about Wi-Fi password, breakfast time, checkout time. Brief inspection room ngay khi enter — kiểm tra: AC works (set 20°C, đợi 5 phút), bath water hot, all lights working, no smell. Nếu có issue, return reception WITHIN 30 PHÚT — sau đó harder để claim it was pre-existing. Khi complaint: bring room key + booking confirmation to reception. Stand to one side (not center) — cho other guests check-in space. Speak softly, polite. Show evidence (phone photo, video). Listen to staff propose solution before pushing your own. Nếu propose room change, ask if same category (no upgrade fee). Nếu they offer upgrade, ask if free hoặc additional charge. Decide based on budget. Nếu issue not fixable, ask compensation forms: free breakfast tomorrow, discount on extension, lounge access, late checkout. Nhật hotel thường có discretion để offer one of these. KHÔNG demand cash refund unless service completely failed. Khi room changed: walk with staff to new room, brief inspection, accept key, rời cũ key with staff. Confirm Wi-Fi password if changed. Move luggage yourself or accept staff help (bellhop service). Sau visit: gửi feedback survey if hotel sends. Honest but constructive — rate based on resolution quality, not initial issue. Nếu issue handled WELL, mention staff name positively. This goes in their HR file, helps them. Nếu issue handled poorly: detailed feedback to hotel directly first (allow 7 days response). Only if no response, post review. Always factual, không emotional. Nếu hotel chain (Marriott, Hyatt, JR Hotel), have option to escalate to corporate via app — they take seriously. Mẹo cuối: ryokan complaints handled differently. Ryokan often family-owned, owner's grandmother might be the okami (proprietress). Be EXTRA gentle, frame as 'helping us improve', not complaint. Return next year as repeat guest = significant goodwill investment.",
  exercises: [
    { type: "fill-blank", question: "お部屋のエアコンが___しているようでございます。", answer: "故障" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "ご相談がございます", english: "frame complaint mềm như tham vấn" },
      { japanese: "お部屋の変更", english: "đề xuất giải pháp đổi phòng" },
      { japanese: "ご対応いただけますと幸いでございます", english: "kết thúc request lịch sự" },
      { japanese: "お手数をおかけいたします", english: "xin lỗi đã làm phiền dù không phải lỗi mình" }
    ] },
    { type: "translation", vietnamese: "Nếu có thể, em xin được xem xét đổi phòng.", japanese: "可能でしたら、お部屋の変更をご検討いただきたく存じます。" }
  ]
},
{
  id: 77,
  title: "Lost luggage — ANA/JAL counter claim",
  title_vi: "Mất hành lý — khiếu nại tại quầy ANA/JAL",
  title_en: "Lost luggage — ANA/JAL counter claim",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "手荷物 (てにもつ)", english: "carry-on / hand luggage" },
    { japanese: "預け荷物 (あずけにもつ)", english: "checked luggage" },
    { japanese: "荷物紛失 (にもつふんしつ)", english: "luggage loss" },
    { japanese: "ロスト・バゲージ・カウンター", english: "lost baggage counter" },
    { japanese: "便名 (びんめい)", english: "flight number" },
    { japanese: "出発地 (しゅっぱつち)", english: "departure point" },
    { japanese: "経由地 (けいゆち)", english: "transit point" },
    { japanese: "受取証 (うけとりしょう)", english: "receipt (luggage tag stub)" },
    { japanese: "賠償 (ばいしょう)", english: "compensation" },
    { japanese: "配送 (はいそう)", english: "delivery (sending lost luggage to your address)" }
  ],
  examples: [
    { japanese: "預け荷物が見つからないようでして、こちらに参りました。", english: "My checked luggage seems missing, so I came here." },
    { japanese: "便名はANA二〇八便、ハノイ発成田着でございます。", english: "Flight is ANA 208, Hanoi to Narita." },
    { japanese: "受取証はこちらでございます。", english: "Here is my luggage tag stub." },
    { japanese: "ホテルへの配送をお願いできますでしょうか。", english: "Could you arrange delivery to my hotel?" },
    { japanese: "緊急で必要な物の購入費用も、賠償の対象になりますでしょうか。", english: "Are emergency purchases also covered by compensation?" }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "失礼いたします。預け荷物が見つからず、こちらにお伺いしました。", english: "Excuse me. My checked luggage isn't found, so I came here." },
    { speaker: "ANAスタッフ", japanese: "それは大変申し訳ございません。便名と受取証をお見せいただけますか。", english: "I'm so sorry. May I see your flight number and luggage stub?" },
    { speaker: "チャウ", japanese: "ANA二〇八便、ハノイ発成田着でございます。受取証はこちらです。", english: "ANA 208, Hanoi to Narita. Stub is here." },
    { speaker: "ANAスタッフ", japanese: "確認いたします。少々お待ちください。", english: "Let me check. One moment please." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "失礼いたします。先ほど成田に着いたのですが、預け荷物が一つ、ベルトコンベアに出てこないようでして、こちらにお伺いしました。", english: "Excuse me. I just arrived at Narita, but one of my checked bags didn't come on the conveyor, so I came here." },
    { speaker: "ANAスタッフ", japanese: "それは大変申し訳ございません。お客様、まずは便名と出発地を教えていただけますか。", english: "I'm so sorry. First, could you tell me the flight number and departure point?" },
    { speaker: "チャウ", japanese: "ANA二〇八便、本日朝七時ハノイ発、十三時三十分成田着でございます。", english: "ANA 208, departed Hanoi at 7am today, arrived Narita at 1:30pm." },
    { speaker: "ANAスタッフ", japanese: "ありがとうございます。受取証をお見せいただけますか。", english: "Thank you. May I see your luggage stub?" },
    { speaker: "チャウ", japanese: "はい、こちらでございます。ハノイ空港でいただきました。", english: "Yes, here. I received it at Hanoi airport." },
    { speaker: "ANAスタッフ", japanese: "拝見いたします。すぐにシステムで荷物の位置を確認いたします。", english: "Let me see. I'll immediately check the bag's location in the system." },
    { speaker: "ANAスタッフ", japanese: "確認したところ、お荷物はハノイ空港でロードされず、まだ現地にあることがわかりました。次のANA二一二便で本日二十時四十分成田着で到着予定でございます。", english: "Upon checking, your bag wasn't loaded at Hanoi and is still there. It's expected on the next flight ANA 212, arriving Narita at 8:40pm today." },
    { speaker: "チャウ", japanese: "そうでございましたか。承知いたしました。ホテルにチェックインしてしまっているので、空港まで取りに戻るのは難しいのですが、配送のお願いはできますでしょうか。", english: "I see, understood. I've already checked into my hotel, so returning to the airport is difficult — can I request delivery?" },
    { speaker: "ANAスタッフ", japanese: "もちろんでございます。お荷物が到着次第、ホテルへの無料配送を手配いたします。配送はおおよそ二十一時から二十三時の間に到着いたします。お受け取りいただける時間でしょうか。", english: "Of course. Once the bag arrives, we'll arrange free delivery to your hotel. Delivery between approximately 9pm and 11pm. Will you be available?" },
    { speaker: "チャウ", japanese: "はい、ホテルでお待ちいたします。ホテルの住所と部屋番号をお伝えいたします。", english: "Yes, I'll wait at the hotel. Let me give you the hotel address and room number." },
    { speaker: "ANAスタッフ", japanese: "ありがとうございます。それから、お荷物が到着するまでの間、緊急で必要な日用品(歯ブラシ、下着、洗面用具など)を購入される場合、レシートを保管していただければ、後日賠償の対象となります。", english: "Thank you. Also, while waiting for the bag, if you purchase essentials (toothbrush, underwear, toiletries), keep receipts — they'll be eligible for compensation later." },
    { speaker: "チャウ", japanese: "それは大変ありがたいです。賠償の上限額はおいくらでございますか。", english: "That's very helpful. What's the compensation limit?" },
    { speaker: "ANAスタッフ", japanese: "緊急購入品は一日五千円相当までが目安でございます。詳細は後日メールでお送りする申請書にてご確認ください。", english: "Emergency purchases up to about 5,000 yen per day. Details will be in the application form we'll email you later." },
    { speaker: "チャウ", japanese: "承知いたしました。本当に助かります。配送先のホテル住所とお電話番号、こちらに記入してもよろしいでしょうか。", english: "Understood. Truly helpful. May I write the hotel address and phone here?" },
    { speaker: "ANAスタッフ", japanese: "はい、こちらの用紙にご記入ください。記入後、控えをお渡しいたします。配送の追跡番号もお送りいたしますので、進捗をご確認いただけます。", english: "Yes, please fill out this form. After completing, I'll give you a copy. I'll also send a tracking number to monitor progress." },
    { speaker: "チャウ", japanese: "ご丁寧なご対応、誠にありがとうございました。雨降って地固まると申しますが、本日のご対応で、ANAへの信頼がさらに深まりました。", english: "Thank you sincerely for the courteous handling. As they say after rain the ground hardens — today's handling deepened my trust in ANA further." },
    { speaker: "ANAスタッフ", japanese: "ご寛容なお言葉、誠にありがとうございます。ご不便をおかけして本当に申し訳ございませんでした。お荷物が無事に到着するよう、責任を持って手配いたします。", english: "Thank you sincerely for your magnanimous words. I'm truly sorry for the inconvenience. I'll handle this responsibly to ensure your bag arrives safely." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn vừa đến Narita, bag không xuất hiện trên belt. Hãy đến lost baggage counter — KHÔNG panic. Cụm: azuke nimotsu ga mitsukarazu, kochira ni ukagaimashita (em không tìm thấy hành lý ký gửi, nên đến đây). Bring receipt stub sẵn sàng.",
    "Staff ANA xin lỗi nhiều lần. Hãy KHÔNG over-reassure (sounds dismissive of their apology). Dùng cụm go-teinei na go-taiou, arigatou gozaimasu (cảm ơn xử lý chu đáo) một lần đủ. Họ appreciate acknowledgment of their effort.",
    "Sau khi staff offer free delivery + compensation cho emergency purchases, bạn hỏi thêm về possible compensation cho stress / delay. Hãy KHÔNG escalate to demand — Nhật airline không offer cash for emotional damages. Accept what offered gracefully."
  ],
  register_notes: "Lost luggage counter của ANA/JAL trained for keigo cao. Bốn patterns: (1) MỞ ĐẦU CALM: KHÔNG panic, KHÔNG demand. Frame như 'investigation' (kakunin): azuke nimotsu ga mitsukarazu, kochira ni ukagaimashita. Staff response cao hơn với calm guests. (2) PROVIDE FACTS UPFRONT: flight number, departure, arrival time, receipt stub — all on first sentence if possible. Save staff investigation time = faster resolution. (3) ACCEPT APOLOGY GRACEFULLY: Nhật airline staff được train apologize EVEN khi không phải lỗi của họ specifically. KHÔNG over-reassure (daijoubu desu repeated = dismissive). Nói arigatou gozaimasu cộng move to next step. (4) ASK ABOUT COMPENSATION POLITELY: KHÔNG demand money. Frame như verification: bishou no joukensaikou wa ikaga deshou ka (em xin hỏi về compensation criteria). Nhật airline có set policies — staff sẽ explain. Dùng amount limits (5,000 yen/day for emergencies) như reasonable expectation, KHÔNG try to inflate. // TODO native review — bishou (賠償) phrasing — alternative o-mimai-kin (お見舞金) softer for goodwill payment vs hard compensation; tùy airline policy.",
  idiom_glosses: [
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau khó khăn, mọi thứ vững hơn — phù hợp khi airline handle issue well, frame như trust-deepening moment.", example: "雨降って地固まると申しますが、本日のご対応で、ANAへの信頼がさらに深まりました。" },
    { idiom: "備えあれば憂いなし", literal: "Có chuẩn bị thì không lo", meaning: "Better safe than sorry — phù hợp khi nói về việc luôn pack essentials in carry-on (toothbrush, change of clothes) phòng khi bag thất lạc.", example: "備えあれば憂いなし、貴重品と必需品は手荷物に入れておくべきでございました。" },
    { idiom: "急がば回れ", literal: "Vội thì đi vòng", meaning: "Vội vã hỏng việc — phù hợp khi staff cần thời gian xử lý paperwork. Đừng rush họ. Quality processing > speed.", example: "急がば回れで、慎重に手続きをお願いいたします。" },
    { idiom: "ご縁", literal: "Mối duyên", meaning: "Duyên / fated connection — Nhật concept. Phù hợp khi airline goes above expectations to help. Express gratitude khái niệm tinh tế.", example: "本日のご縁、感謝申し上げます。" }
  ],
  cultural_notes_vi: "Lost luggage ở Nhật khác phương Tây ở 5 điểm. (1) RECOVERY RATE HIGH: airline Nhật có recovery rate >95 phần trăm trong 24-48 giờ. KHÔNG panic — usually flights connecting Asia, bag chỉ on next flight. (2) FREE DELIVERY: ANA/JAL/Skymark đều offer free delivery to hotel/home. KHÔNG cần tự đi airport pick up. Delivery thường within 12 giờ sau bag arrival. (3) COMPENSATION POLICY: emergency purchases (toothbrush, underwear, toiletries) covered up to 5,000-10,000 yen/day. Lưu mọi receipt. Submit qua email form trong 7 ngày. Reimbursement bằng bank transfer trong 2-4 tuần. (4) ESCALATION: nếu bag MISSING (not delayed) — sau 21 ngày declared lost. Compensation cho contents up to ~$1,500 USD per bag (Montreal Convention) cho international flights. Domestic Japan: lower limits. Mua additional insurance trước flight nếu carry valuable items. (5) DOCUMENTATION: lưu mọi paperwork (claim form, tracking number, email receipts). Nếu cần escalate tới corporate, paper trail là evidence. Khác biệt với VN/phương Tây: ở phương Tây, demand compensation aggressive là normal; ở Nhật, polite request gets MORE — staff has discretion to offer extras (extra meal voucher, lounge access, free upgrade) for cooperative customers. Threat-based negotiation = staff stick to minimum. (6) FOLLOW UP: nếu bag arrives damaged (not just delayed), report DAMAGE within 24 hours of delivery — sau đó claim might be denied. Bring damaged item to airline office hoặc photograph and email với reference number. Mẹo: nếu travel often, register frequent flyer programs (ANA Mileage Club, JAL Mileage Bank) — status members get priority handling, faster resolution, sometimes auto-compensation. Pre-emptive: pack 1 day's clothes + toiletries + medications + valuables in CARRY-ON. Check-in only what you can survive without 24-48 hours.",
  tip_advice_vi: "Trước khi fly: photograph contents of checked bag (insurance evidence). Take photo of luggage tag stub + receipt right after check-in (in case stub lost). Pack carry-on với 24-48 hour survival kit: 1 set clothes, underwear (2-3 pieces), toothbrush, toothpaste, deodorant, prescription meds, valuables (laptop, camera, jewelry, important documents). Khi đến Narita, đợi ALL bags from your flight on belt (some bags come last). Nếu bag không xuất hiện sau 30 phút từ khi belt starts: đến lost baggage counter (signs say 'Lost & Found' hoặc '手荷物カウンター'). Bring receipt stub. Khi staff process: verify EVERY detail of contact info — phone (with country code), email, hotel address (English + Japanese version nếu có), check-in date and check-out date. Mistake here = bag delivered to wrong place = 24 hour delay. Get tracking number + claim reference in writing (paper or screenshot). Save in 2 places (email + phone notes). Khi rời airport: keep receipts of EVERY emergency purchase — tax invoice (領収書) preferred over generic receipt. Eligible items: clothes, toiletries, basic electronics. NOT eligible: sightseeing tickets, restaurant meals (unless replacing mealtime missed due to delay). Limit ~5,000 yen/day for first 2 days. Khi bag arrive: check contents IMMEDIATELY — verify nothing missing, nothing damaged. Take photo if anything off. Sign delivery slip CAREFULLY — signature confirms receipt OK. Nếu damage: refuse signing or write 'received with visible damage' trên slip. Sau 24 giờ from delivery, hard to claim damage. Submit compensation form within 7 ngày — most airlines have email PDF form. Attach receipts + tracking numbers. Patience: 2-4 tuần for processing. Nếu no response after 4 tuần, escalate via airline corporate (ANA: 0570-029-555, JAL: 0570-025-031). Không hesitate — Nhật airline take complaints seriously. Long-term: consider 'Apple AirTag' trong checked bag — cost 5,000 yen, can locate bag in real-time. Nhật airline accept this practice. Mẹo cuối: nếu flight is round-trip and outbound bag delayed, return flight handling MIGHT include extra accommodation. Worth asking ground staff about return flight implications. Document everything.",
  exercises: [
    { type: "fill-blank", question: "預け荷物が見つから___、こちらに参りました。", answer: "ず" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "受取証", english: "stub vé tag — bằng chứng bag đã được check-in" },
      { japanese: "便名", english: "số hiệu chuyến bay (e.g. ANA208)" },
      { japanese: "配送", english: "giao hàng đến hotel/nhà sau khi tìm thấy" },
      { japanese: "賠償", english: "bồi thường cho emergency purchases" }
    ] },
    { type: "translation", vietnamese: "Khi mua đồ khẩn cấp, có thể giữ hóa đơn để được bồi thường không?", japanese: "緊急で必要な物の購入費用も、賠償の対象になりますでしょうか。" }
  ]
},
{
  id: 78,
  title: "Police report (交番/警察署) — wallet/phone stolen, formal report (盗難届)",
  title_vi: "Báo cảnh sát (交番/警察署) — bị trộm ví/điện thoại, lập biên bản (盗難届)",
  title_en: "Police report (交番/警察署) — wallet/phone stolen, formal report (盗難届)",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "交番 (こうばん)", english: "neighborhood police box" },
    { japanese: "警察署 (けいさつしょ)", english: "police station (full)" },
    { japanese: "盗難 (とうなん)", english: "theft" },
    { japanese: "盗難届 (とうなんとどけ)", english: "theft report" },
    { japanese: "被害届 (ひがいとどけ)", english: "victim report (formal)" },
    { japanese: "事情聴取 (じじょうちょうしゅ)", english: "questioning / statement-taking" },
    { japanese: "現金 (げんきん)", english: "cash" },
    { japanese: "クレジットカード", english: "credit card" },
    { japanese: "受理番号 (じゅりばんごう)", english: "case receipt number" },
    { japanese: "防犯カメラ (ぼうはんカメラ)", english: "security camera" }
  ],
  examples: [
    { japanese: "財布を盗まれてしまいまして、盗難届を提出したく参りました。", english: "I had my wallet stolen, so I came to file a theft report." },
    { japanese: "盗難に気づいたのは、本日午後三時頃でございます。", english: "I noticed the theft around 3pm today." },
    { japanese: "クレジットカード会社にはすでに連絡し、停止しております。", english: "I have already contacted the credit card company and frozen the cards." },
    { japanese: "受理番号をいただけますでしょうか。保険申請に必要でございます。", english: "May I receive a case receipt number? It's needed for insurance claim." },
    { japanese: "ご対応、誠にありがとうございました。", english: "Thank you sincerely for handling this." }
  ],
  dialogue: [
    { speaker: "警察官", japanese: "こんにちは、何かありましたか。", english: "Hello, is something wrong?" },
    { speaker: "チャウ", japanese: "失礼いたします。財布を盗まれてしまいまして、盗難届を出したく参りました。", english: "Excuse me. My wallet was stolen, so I came to file a theft report." },
    { speaker: "警察官", japanese: "それは大変でしたね。中へどうぞ。落ち着いてお話を聞かせてください。", english: "That's terrible. Please come in. Calmly tell me what happened." },
    { speaker: "チャウ", japanese: "ありがとうございます。", english: "Thank you." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "失礼いたします。盗難の件で参りました。財布を盗まれたようでして、被害届を出したく存じます。", english: "Excuse me. I came regarding theft. My wallet seems to have been stolen, and I'd like to file a victim report." },
    { speaker: "警察官", japanese: "わかりました。中へどうぞ。お名前と国籍を教えていただけますか。", english: "Understood. Please come in. May I have your name and nationality?" },
    { speaker: "チャウ", japanese: "グエン・ティ・チャウと申します。ベトナム国籍でございます。在留カードもお見せいたします。", english: "I am Nguyen Thi Chau, Vietnamese national. I'll also show my residence card." },
    { speaker: "警察官", japanese: "ありがとうございます。それでは、いつ、どこで、どのような状況で盗難に気づかれましたか。詳しくお話しください。", english: "Thank you. Then please tell me in detail when, where, and how you noticed the theft." },
    { speaker: "チャウ", japanese: "本日午後一時頃、新宿駅東口の喫茶店「ドトールコーヒー」で食事をいたしました。財布をテーブルに置いて、お手洗いに席を立ちました。約五分後に戻りましたら、財布がなくなっておりました。", english: "Around 1pm today, I ate at Doutor Coffee at Shinjuku Station east exit. I left my wallet on the table and went to the restroom. About 5 minutes later when I returned, the wallet was gone." },
    { speaker: "警察官", japanese: "なるほど。財布の中身は、現金やカードなど、何が入っておりましたか。", english: "I see. What was inside the wallet — cash, cards, etc.?" },
    { speaker: "チャウ", japanese: "現金約三万円、クレジットカード二枚(VisaとMastercard)、運転免許証、それからベトナムの身分証明書(CMND)でございます。", english: "Approximately 30,000 yen cash, 2 credit cards (Visa and Mastercard), driver's license, and Vietnamese ID card (CMND)." },
    { speaker: "警察官", japanese: "クレジットカード会社へのご連絡はお済みですか。", english: "Have you contacted the credit card companies?" },
    { speaker: "チャウ", japanese: "はい、十四時頃に両社へ電話し、カードの利用停止をお願いいたしました。受付番号も控えてございます。", english: "Yes, I called both companies around 2pm and froze the cards. I have the case numbers." },
    { speaker: "警察官", japanese: "それは適切な対応でした。喫茶店の防犯カメラを確認することは可能ですか。", english: "That was the appropriate response. Is checking the cafe's security camera possible?" },
    { speaker: "チャウ", japanese: "店員さんに尋ねたところ、本社に確認が必要とのことでした。警察からのご連絡があれば対応するそうでございます。", english: "When I asked the staff, they said they need to check with HQ. They said they'd respond if police contact them." },
    { speaker: "警察官", japanese: "わかりました。本件につきましては、防犯カメラの確認、周辺の聞き込みを進めてまいります。被害届を提出いたしますので、こちらの用紙にご記入ください。日本語でのご記入が難しい場合、私が代筆いたしますので、お話しください。", english: "Understood. For this case, I'll proceed with camera review and interviews. I'll file the victim report. Please fill out this form. If Japanese is difficult, I can write for you — just tell me." },
    { speaker: "チャウ", japanese: "ありがとうございます。基本情報は日本語で書けますが、状況説明は代筆をお願いしたく存じます。", english: "Thank you. Basic info I can write in Japanese, but for the situation description, please write for me." },
    { speaker: "警察官", japanese: "承知いたしました。ところで、ご保険の関係で受理番号が必要でございますか。", english: "Understood. By the way, do you need a case receipt number for insurance?" },
    { speaker: "チャウ", japanese: "はい、海外旅行保険の請求に必要でございます。お願いできますでしょうか。", english: "Yes, needed for travel insurance claim. May I have one?" },
    { speaker: "警察官", japanese: "もちろんでございます。手続きが完了次第、受理番号入りの控えをお渡しいたします。本件、見つかる可能性がゼロではございませんので、進展がありましたら登録いただいた電話番号にご連絡いたします。", english: "Of course. Once processing is complete, I'll give you a copy with the case number. There's some chance of recovery; if there's progress, I'll call the phone number you registered." },
    { speaker: "チャウ", japanese: "誠にありがとうございます。お忙しいところ、お手数をおかけいたしまして申し訳ございませんでした。", english: "Thank you sincerely. Sorry for the trouble during your busy time." },
    { speaker: "警察官", japanese: "とんでもございません。ベトナムから来られた方が日本で安心して過ごせるよう、警察として責任を持って対応いたします。これからもお気をつけてお過ごしください。", english: "Not at all. We police take responsibility for ensuring visitors from Vietnam can stay safely in Japan. Please continue to take care." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn vào koban (police box) ở Shinjuku báo bị mất ví. Hãy KHÔNG vào nói cụt ngủn 'wallet stolen' tiếng Anh — open với cụm tiếng Nhật shitsurei itashimasu cộng tounan no ken de mairimashita. Cảnh sát nhận thấy effort = treat seriously.",
    "Cảnh sát hỏi chi tiết — bao nhiêu tiền, thẻ gì, mất ở đâu. Hãy give SPECIFIC info: số tiền (xấp xỉ OK), tên brand of card, tên cụ thể địa điểm (Doutor Coffee Shinjuku east exit, KHÔNG vague 'gần Shinjuku'). Specifics = cảnh sát có thể action.",
    "Cảnh sát đề xuất bạn fill form bằng tiếng Nhật. Bạn không tự tin viết đầy đủ. Hãy KHÔNG fake — admit và xin assistance: kihon jouhou wa nihongo de kakemasu ga, joukyou setsumei wa daihitsu wo o-negai shitaku zonjimasu. Cảnh sát Nhật được trained help foreigners."
  ],
  register_notes: "Tại 交番 (koban) hoặc 警察署 (police station), register là teineigo cao plus kenjougo cho hành động của mình. Cảnh sát Nhật uses keigo formal ngay cả với citizens — bạn match. Bốn patterns: (1) MỞ ĐẦU: shitsurei itashimasu cộng tounan no ken de mairimashita (em đến vì việc bị trộm). KHÔNG hung hốt rush in. (2) PROVIDE ID FIRST: trước khi cảnh sát ask, offer residence card hoặc passport. zairyuu kado wo o-mise itashimasu (em xin trình thẻ cư trú). Show cooperative attitude. (3) PRECISE FACTS: timeline (bao nhiêu giờ, đâu cụ thể), monetary value (estimate OK), card details (brand + last 4 digits if known). Vague answers waste time. (4) ACCEPT POLICE PACE: Nhật police thorough, cuộc nói có thể 30-60 phút cho theft report. KHÔNG rush police. Bring water + phone charger nếu bạn jet-lagged. Câu cuối: kasanete, go-teinei na go-taiou wo itadaki, makoto ni arigatou gozaimashita. Cảnh sát Nhật appreciate gratitude từ foreigners — có thể lead to extra effort recovering items. // TODO native review — daihitsu (代筆) phrasing — alternative tasukete itadaku (xin được giúp đỡ) hơi soft hơn but less specific; daihitsu là legal/admin term Nhật accept.",
  idiom_glosses: [
    { idiom: "備えあれば憂いなし", literal: "Có chuẩn bị thì không lo", meaning: "Better safe than sorry — phù hợp lesson sau theft: split tiền/cards giữa 2 wallets, photo cards trước khi đi.", example: "備えあれば憂いなし、今後はカードと現金を分けて持ち歩きます。" },
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau khó khăn, mọi thứ vững hơn — phù hợp khi police handle case professionally, frame như growth experience.", example: "雨降って地固まると申します。今回の経験を教訓にいたします。" },
    { idiom: "渡る世間に鬼はなし", literal: "Đi qua thế gian không gặp quỷ", meaning: "Trên đời này luôn có người tốt sẵn sàng giúp đỡ. Phù hợp khi cảm ơn cảnh sát cho thorough help.", example: "渡る世間に鬼はなしと申しますが、警察の方の親切に感謝しております。" },
    { idiom: "一期一会", literal: "Một đời một lần gặp", meaning: "Mỗi cuộc gặp duy nhất — police interaction này có thể là one-time, nhưng matter của trust với Japanese institutions.", example: "本日のご対応を一期一会と感じております。" }
  ],
  cultural_notes_vi: "Báo cảnh sát ở Nhật khác phương Tây ở 6 điểm. (1) RECOVERY RATE HIGH: Nhật theft recovery rate ~60-80 phần trăm trong Tokyo (theo Tokyo Metropolitan Police 2023). Cảnh sát Nhật actively investigate even small thefts (lost iPhone, wallet). KHÔNG dismiss your case as too small. (2) KOBAN CULTURE: 交番 (neighborhood police box) handles initial report. Maps online show locations — most train stations have one nearby. KHÔNG drive to main precinct first; koban first. Koban officer may escalate to precinct if needed. (3) PAPERWORK MATTERS: cảnh sát Nhật love documentation. 被害届 (victim report) tạo case number, kích hoạt investigation. KHÔNG skip này — không paperwork = no investigation. Bring time để fill out properly. (4) NO BRIBES, NO TIPS: KHÔNG offer money to officers — illegal Nhật, will offend severely. Nhật police strict on integrity. Thank you words enough. (5) FOLLOW UP: cảnh sát call bạn nếu có progress (recovery, suspect identified). Trong 30 ngày, nếu no update, OK to call koban back asking. Cụm: senjitsu no tounan no ken, sono go ikaga deshou ka (về vụ trộm hôm trước, sau đó như thế nào). (6) INSURANCE PROCESS: travel insurance / homeowner insurance VN cần Japanese police case number. Receipt với 受理番号 là proof. Email scan đến insurance company within 30 days for claim. Khác biệt với VN: ở VN có thể bribe officer nhanh hơn; ở Nhật, KHÔNG. Honest cooperation = thorough investigation. Cảnh sát Nhật accept rằng foreigners có language barrier — họ patience với English/Vietnamese mixed in. Mẹo: nếu phone stolen, register 'Find My iPhone' trước khi đi Nhật. Police sẽ check device tracking trong investigation. AirTag in wallet (popular trend) — police accept this evidence. iPhone screen lock + bio-metric prevents thieves access.",
  tip_advice_vi: "Phòng ngừa: KHÔNG để wallet/phone trên bàn quán cafe khi đi vệ sinh. Nhật có theft rate thấp, nhưng tourist areas (Shinjuku, Akihabara, Asakusa) là target. Cẩn thận tại izakaya (sake bar) — busy, dim, drinking → easy target. Split tiền: 70 phần trăm trong wallet chính, 30 phần trăm trong second wallet/money belt. Photograph mọi cards trước trip (lưu trên cloud). Khi happens: STAY CALM. Trong 1 giờ đầu, làm 4 việc: (1) Trace lại — quay lại location cuối cùng nhìn thấy. Hỏi staff/witnesses. (2) Call credit card companies (Visa: 0120-991-666 24/7 Nhật; Mastercard: 0034-811-005). Freeze cards immediately. (3) Đến gần koban (Google Maps: 'koban') với mọi documents bạn có (passport, residence card). (4) Document timeline trên phone (when, where, what was inside). Khi tại koban: greeting tiếng Nhật, present residence card, briefly state issue, wait for officer to lead. Officer sẽ ask details — answer specifically. Nếu language barrier, dùng Google Translate (ok ở Nhật police), hoặc ask if interpreter available (some kobans have phone interpreters). Process takes 30-90 phút. Sau khi nhận 受理番号: photograph receipt (paper receipt may fade). Save digital copies on cloud. Email một copy cho mình để có timestamped record. Within 7 ngày: contact insurance company với case number. Most need: police receipt, list of items lost, estimated values, original purchase receipts if available. VN travel insurance thường cover 5-10 triệu VND for cash + cards lost. Card replacement: VN bank issue replacement card, mailed to VN address (3-7 ngày). Trong Japan, có thể use ATM với passport at Seven Bank, Japan Post Bank for emergency cash withdrawal up to ~50,000 yen với international card. Long-term lessons: AirTag in wallet (cost 5,000 yen). Apple Watch with Walking Wake. Money belt under clothes for cash + cards in tourist areas. Photograph EVERY card (front + back) before trip. Mẹo cuối: nếu có time before flight back, follow-up call police — 30 phần trăm chance items recovered, especially if tourist forgot wallet (not actual theft) at restaurant.",
  exercises: [
    { type: "fill-blank", question: "財布を盗まれてしまいまして、盗難届を___たく参りました。", answer: "提出し" },
    { type: "matching", instruction: "Ghép thuật ngữ với function.", pairs: [
      { japanese: "交番", english: "police box (mỗi neighborhood có 1)" },
      { japanese: "被害届", english: "victim report (kích hoạt investigation)" },
      { japanese: "受理番号", english: "case number (cần cho insurance)" },
      { japanese: "代筆", english: "officer help write form for foreigner" }
    ] },
    { type: "translation", vietnamese: "Em xin được số case để gửi cho công ty bảo hiểm.", japanese: "受理番号をいただけますでしょうか。保険申請に必要でございます。" }
  ]
},
{
  id: 79,
  title: "Asking directions — keigo (formal stranger) vs casual (peer)",
  title_vi: "Hỏi đường — keigo (người lạ formal) vs casual (đồng trang lứa)",
  title_en: "Asking directions — keigo (formal stranger) vs casual (peer)",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "道 (みち)", english: "road / way / directions" },
    { japanese: "方向 (ほうこう)", english: "direction" },
    { japanese: "目的地 (もくてきち)", english: "destination" },
    { japanese: "右 (みぎ)", english: "right" },
    { japanese: "左 (ひだり)", english: "left" },
    { japanese: "まっすぐ", english: "straight ahead" },
    { japanese: "信号 (しんごう)", english: "traffic light" },
    { japanese: "交差点 (こうさてん)", english: "intersection" },
    { japanese: "駅 (えき)", english: "station" },
    { japanese: "出口 (でぐち)", english: "exit" }
  ],
  examples: [
    { japanese: "失礼ですが、新宿駅の東口はどちらでしょうか。", english: "Excuse me, which way is Shinjuku Station's east exit?" },
    { japanese: "この近くに、コンビニはございますでしょうか。", english: "Is there a convenience store near here?" },
    { japanese: "二つ目の信号を右に曲がってください。", english: "Please turn right at the second traffic light." },
    { japanese: "歩いて十分くらいかかります。", english: "It takes about 10 minutes on foot." },
    { japanese: "ご親切に、ありがとうございました。", english: "Thank you for your kindness." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "(formal — older stranger) すみません、新宿駅の東口はどちらでしょうか。", english: "Excuse me, which way is Shinjuku Station's east exit?" },
    { speaker: "高齢者", japanese: "東口ですね。この道をまっすぐ二百メートル、信号を右に曲がってください。", english: "East exit. This street straight 200m, turn right at the traffic light." },
    { speaker: "チャウ", japanese: "ありがとうございます。歩いてどのくらいでしょうか。", english: "Thank you. About how long walking?" },
    { speaker: "高齢者", japanese: "五分程度ですよ。", english: "About 5 minutes." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "(formal — middle-aged businessman) 失礼いたします、お忙しいところ恐れ入りますが、東京タワーの方向を教えていただけますでしょうか。", english: "Excuse me, sorry to bother you when busy, but could you tell me the direction to Tokyo Tower?" },
    { speaker: "サラリーマン", japanese: "東京タワーですか。今、神谷町駅にいらっしゃいますね。地上に出て、桜田通りを北に向かってまっすぐ歩いてください。", english: "Tokyo Tower? You're at Kamiyacho Station now. Go up to street level and walk straight north along Sakurada-dori." },
    { speaker: "チャウ", japanese: "桜田通りはどちらの方向でございますでしょうか。", english: "Which direction is Sakurada-dori?" },
    { speaker: "サラリーマン", japanese: "ええと、こちらの出口を出ますと、目の前の大通りでございます。北はあちらの方向、コンビニのある側です。約十分歩きますと、東京タワーが右手に見えてまいります。", english: "Um, when you exit here, the big street right in front is it. North is that way, the side with the convenience store. About 10 minutes walking, Tokyo Tower comes into view on your right." },
    { speaker: "チャウ", japanese: "途中、目印になるものはございますか。", english: "Are there any landmarks along the way?" },
    { speaker: "サラリーマン", japanese: "そうですね。最初の交差点に「飯倉」という看板がございます。そこをまっすぐ進んでいただきますと、坂道になりまして、登りきったところに東京タワーがございます。", english: "Yes. At the first intersection there's a sign 'Iikura.' Going straight there, you'll come to a slope; at the top is Tokyo Tower." },
    { speaker: "チャウ", japanese: "ご丁寧にありがとうございます。最後に確認させていただきたいのですが、現在地から徒歩で約十分、桜田通り北方向、飯倉交差点を通過、坂道を登る、で間違いございませんか。", english: "Thank you kindly. Lastly, let me confirm — from current location, about 10 minutes on foot, north along Sakurada-dori, passing Iikura intersection, climb the slope. Is that correct?" },
    { speaker: "サラリーマン", japanese: "完璧です。気をつけて行ってきてくださいね。", english: "Perfect. Take care going." },
    { speaker: "チャウ", japanese: "誠にありがとうございました。失礼いたします。", english: "Thank you sincerely. Excusing myself." },
    { speaker: "チャウ", japanese: "(later, casual — young student same age) すみません、ちょっと聞いてもいいですか。秋葉原のメイド喫茶ってどっちにあるか分かりますか。", english: "(later, casual — young student same age) Sorry, can I ask something? Do you know which way the maid cafes in Akihabara are?" },
    { speaker: "学生", japanese: "メイド喫茶?中央通りの方ですよ。電気街口を出て、右に行くとすぐ見つかります。", english: "Maid cafes? Toward Chuo-dori. Exit from Electric Town exit, go right, you'll find them right away." },
    { speaker: "チャウ", japanese: "ありがとうございます。複数あるんですか?", english: "Thanks. Are there multiple?" },
    { speaker: "学生", japanese: "もう、めっちゃありますよ。@ほーむカフェが有名で、初めてなら一番おすすめ。", english: "Tons. @Home Cafe is famous, best for first-timers." },
    { speaker: "チャウ", japanese: "そうなんですね、行ってみます!ありがとうございます。", english: "Oh really, I'll check it out! Thank you." },
    { speaker: "学生", japanese: "楽しんできてくださいね!", english: "Have fun!" },
    { speaker: "チャウ", japanese: "(internal note) 同じ「道を聞く」でも、相手によって言葉遣いが全然違う。", english: "(internal note) Even for the same 'asking directions,' speech differs entirely depending on partner." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn ở Shibuya Station — bị lạc, cần hỏi 50-something businessman đang đi vội. Hãy mở đầu với cụm formal: shitsurei itashimasu, o-isogashii tokoro osore irimasu ga (em xin lỗi đã làm phiền lúc anh bận). Đây là correct register cho stranger formal.",
    "Ở Akihabara, bạn hỏi student cùng tuổi (20-30 tuổi) đường đến quán cafe. Hãy switch sang casual: sumimasen, chotto kiite mo ii desu ka (xin lỗi, hỏi chút được không?). KHÔNG dùng kenjougo (sasete itadaku) với peer — sounds quá formal, awkward.",
    "Sau khi nhận hướng dẫn phức tạp 5-step, hãy XÁC NHẬN bằng cách lặp lại đầy đủ. Nhật appreciate verification step. Cụm: saigo ni kakunin sasete itadakitai no desu ga (cuối cùng em xin được xác nhận) cộng repeat instructions back theo trình tự."
  ],
  register_notes: "Hỏi đường ở Nhật REQUIRES register matching to person + situation. Năm patterns: (1) ELDERLY/BUSINESSMAN/AUTHORITY: cao keigo. shitsurei itashimasu cộng o-tazune shitai no desu ga (em xin được hỏi). KHÔNG dùng casual sumimasen với người 50+. (2) PEER (20-30 tuổi student/casual worker): mid-formal. sumimasen, chotto ii desu ka cộng casual question. KHÔNG cao keigo (sounds patronizing). (3) STAFF (station, store, koban): mid-formal teineigo. shitsurei shimasu cộng question với desu/masu. Staff được trained respond keigo back. (4) RESPONSE LANGUAGE: match speed của họ. Nếu họ slow + careful, response slow + verify. Nếu họ rapid + casual, you keep up. (5) THANK YOU LEVEL: cao formal: makoto ni arigatou gozaimashita (cúi 30 độ). Mid: arigatou gozaimasu. Casual: arigatou. KHÔNG mixing — cao greeting + casual thanks = inconsistent = awkward. Một thực tập: trước khi hỏi, observe person 5 giây — judge their register based on age, dress, body language. Errors common: dùng quá formal với peer (sounds robotic), dùng casual với elderly (sounds disrespectful). // TODO native review — chotto kiite mo ii desu ka phrasing — alternative chotto sumimasen lighter but less specific to question framing; regional differences (Kansai dialect uses ii ya naa instead).",
  idiom_glosses: [
    { idiom: "渡る世間に鬼はなし", literal: "Đi qua thế gian không gặp quỷ", meaning: "Trên đời này luôn có người tốt sẵn sàng giúp đỡ. Phù hợp khi cảm ơn stranger giúp đỡ chu đáo.", example: "渡る世間に鬼はなしと申しますが、皆様のご親切に感謝しております。" },
    { idiom: "急がば回れ", literal: "Vội thì đi vòng", meaning: "Vội vã hỏng việc — phù hợp khi xác minh đường đi cẩn thận trước khi rush.", example: "急がば回れで、念のため確認させていただきます。" },
    { idiom: "ご縁", literal: "Mối duyên", meaning: "Duyên / fated connection — Nhật concept. Stranger interaction casual nhưng có ý nghĩa nhỏ. Express gratitude tinh tế.", example: "本日のご縁に感謝申し上げます。" },
    { idiom: "備えあれば憂いなし", literal: "Có chuẩn bị thì không lo", meaning: "Better safe than sorry — phù hợp với tình huống cẩn thận hỏi đường thay vì lạc tiếp.", example: "備えあれば憂いなし、念のため道を聞いてから行きます。" }
  ],
  cultural_notes_vi: "Hỏi đường ở Nhật khác phương Tây ở 5 điểm. (1) NHẬT GENUINELY HELP: stranger Nhật help with directions ở rate cao bất thường — including walking 5-10 phút với bạn nếu directions phức tạp. KHÔNG ngại nhận help. (2) BODY LANGUAGE: khi hỏi, cúi nhẹ 15 độ + eye contact. KHÔNG approach quá close (Nhật personal space lớn ~1m). Stand to side, không in front blocking path. (3) ASKING WHERE: dùng 'doko' cho location, 'dochira' (formal) cho direction. dochira polite hơn doko khi hỏi stranger. (4) MAP FAILURE: nếu show map trên phone, hold phone steady, không thrust into their face. Họ sẽ point trên map nếu helpful, không point in air. (5) WHEN GRATEFUL: nếu họ went out of way (walked you to destination), mua small gift cho họ as thank-you là lovely gesture (drink from konbini), nhưng KHÔNG offer money. Insulting. Khác biệt với VN: ở VN có thể stop random person at intersection với 'Em ơi, X ở đâu?' rồi tiếp tục di chuyển. Ở Nhật, full stop, full attention, full keigo (or appropriate register). Mẹo: railway staff (driver style, blue uniform) at major stations là experts on directions to anywhere. Always reliable. Ở koban, officer có map, sẽ print directions cho bạn nếu cần. Free service. Long-term: học 5 phrases thuộc lòng cho tourist mode: shitsurei desu ga (excuse me), kono chizu de docchi desu ka (which way on this map?), hidari/migi/massugu (left/right/straight), arigatou gozaimasu, gomennasai (sorry — universal apology nếu mistake). Five phrases cover 90 phần trăm interactions.",
  tip_advice_vi: "Trước khi hỏi: try Google Maps first (works ở Nhật). Save offline maps for areas without good signal. Lưu địa chỉ destination both Romaji + Japanese (kanji + hiragana) trên phone. Khi cần ask: choose target carefully. Best targets: middle-aged businesswoman (50 phần trăm Eng OK), railway staff (highest reliability), shop staff (helpful but less English). Worst: rushing salaryman (will give brief answer, not detailed). Approach: walk closer, NOT calling from across street. Sebagai approach, slight bow. Câu mở thuộc lòng: shitsurei itashimasu, o-tazune shitai no desu ga. Show map on phone or paper. Point to destination. Nếu họ explain quickly, ask politely: mou ichido onegai dekimasen ka (could you say once more?). KHÔNG embarrassed — Nhật accept this. Nếu directions complex: ask them to write trên paper. Most carry pen. Cụm: ki ni nara nai n desu kedo, kono kami ni kaite itadakemasu ka (sorry, could you write on this paper?). Sau khi nhận directions: VERIFY by repeating back. Nếu họ correct mistake, OK. Mistake at this step better than wrong walk 20 phút. Cụm: kakunin sasete itadakitai no desu ga, X de Y de Z de yoroshii desu ka. Cuối cùng, thank LIBERALLY: makoto ni arigatou gozaimashita cộng cúi 20 độ. Nếu họ helped extensively (walked với bạn), express thêm: o-tesuu wo o-kake itashimashite, sumimasen deshita (em đã làm phiền, xin lỗi). Nhật response well to gratitude. Common scenarios: (1) Train station: staff at fare gates always helpful. (2) Tourist info booth: at major stations, English available, free maps. (3) Police box: 24/7 available, will look up address in their book. (4) Convenience store: staff have local knowledge, will point. (5) Restaurant during off-peak: server helpful if not busy. Long-term: learn local landmarks (大手町 - Otemachi, 渋谷 - Shibuya, 浅草 - Asakusa). Naming destination với Japanese name = response 50 phần trăm faster than English version. Mẹo cuối: download Hyperdia app (free) — Japanese train guide includes walking directions to/from stations.",
  exercises: [
    { type: "fill-blank", question: "失礼ですが、新宿駅の東口は___でしょうか。", answer: "どちら" },
    { type: "matching", instruction: "Ghép register với situation.", pairs: [
      { japanese: "失礼いたします、お尋ねしたい", english: "stranger formal (elderly, businessman, authority)" },
      { japanese: "すみません、ちょっと", english: "peer casual (student, same-age)" },
      { japanese: "失礼します、お伺いしますが", english: "staff (station, store, police)" },
      { japanese: "あの〜", english: "very casual (close friend — không dùng cho stranger)" }
    ] },
    { type: "translation", vietnamese: "Em xin được xác nhận lại cuối cùng — đường đó đúng không?", japanese: "最後に確認させていただきたいのですが、その道で間違いございませんか。" }
  ]
},
{
  id: 80,
  title: "Restaurant complaint — wrong order, billing error",
  title_vi: "Khiếu nại nhà hàng — gọi sai món, sai hóa đơn",
  title_en: "Restaurant complaint — wrong order, billing error",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "注文 (ちゅうもん)", english: "order" },
    { japanese: "違う (ちがう)", english: "to differ / be wrong" },
    { japanese: "確認 (かくにん)", english: "confirmation / verification" },
    { japanese: "お会計 (おかいけい)", english: "bill / check" },
    { japanese: "間違い (まちがい)", english: "mistake / error" },
    { japanese: "領収書 (りょうしゅうしょ)", english: "receipt (formal — for tax/expense)" },
    { japanese: "メニュー", english: "menu" },
    { japanese: "店員 (てんいん)", english: "store/restaurant staff" },
    { japanese: "サービス料 (サービスりょう)", english: "service charge" },
    { japanese: "再確認 (さいかくにん)", english: "re-verification" }
  ],
  examples: [
    { japanese: "失礼ですが、注文した料理と少し違うようでして、ご確認いただけますでしょうか。", english: "Excuse me, the dish seems slightly different from what I ordered — could you please verify?" },
    { japanese: "お会計に間違いがあるかもしれません。再度ご確認をお願いいたします。", english: "There might be an error on the bill. Please verify again." },
    { japanese: "メニュー表に書かれていた価格と少し異なるようでございます。", english: "It seems slightly different from the price on the menu." },
    { japanese: "領収書をいただけますでしょうか。", english: "May I have a receipt?" },
    { japanese: "ご対応、ありがとうございました。", english: "Thank you for handling this." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "すみません、ちょっとお伺いしたいのですが、こちらの料理、注文と違うように見えるのですが。", english: "Excuse me, I'd like to ask — this dish seems different from what I ordered." },
    { speaker: "店員", japanese: "申し訳ございません、ご注文を確認させていただきます。", english: "I apologize, let me verify your order." },
    { speaker: "チャウ", japanese: "私はチキンカツを注文したと思うのですが、こちらは豚カツのようでして。", english: "I think I ordered chicken katsu, but this looks like pork katsu." },
    { speaker: "店員", japanese: "大変申し訳ございません、すぐに作り直してまいります。", english: "I'm so sorry, I'll remake it immediately." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "すみません、ちょっとよろしいでしょうか。", english: "Excuse me, could I get your attention?" },
    { speaker: "店員", japanese: "はい、何かございましたか。", english: "Yes, was something the matter?" },
    { speaker: "チャウ", japanese: "こちらの料理、私が注文した料理と少し違うように思いまして、ご確認いただけますでしょうか。", english: "This dish seems slightly different from what I ordered — could you please verify?" },
    { speaker: "店員", japanese: "失礼いたします。注文票を確認いたします。少々お待ちください。", english: "Excuse me. Let me check the order slip. One moment please." },
    { speaker: "チャウ", japanese: "私はメニューの「特製チキンカツ定食」を注文したと思うのですが、こちらは豚カツに見えます。", english: "I think I ordered the special chicken katsu set from the menu, but this looks like pork katsu." },
    { speaker: "店員", japanese: "確認したところ、お客様のおっしゃる通り、チキンカツのご注文でした。当店の手違いで、豚カツをお持ちしてしまいまして、誠に申し訳ございません。", english: "Upon checking, you're correct — it was a chicken katsu order. We mistakenly brought pork katsu — I'm truly sorry." },
    { speaker: "チャウ", japanese: "ご確認いただき、ありがとうございます。それでは、チキンカツに作り直していただけますでしょうか。", english: "Thank you for verifying. Then could you remake it as chicken katsu?" },
    { speaker: "店員", japanese: "もちろんでございます。すぐに調理場に伝えてまいります。お時間は約十分かかりますが、よろしいでしょうか。", english: "Of course. I'll tell the kitchen right away. It'll take about 10 minutes — is that OK?" },
    { speaker: "チャウ", japanese: "はい、結構でございます。お忙しいところ、お手数をおかけいたしまして申し訳ございません。", english: "Yes, that's fine. I'm sorry for the trouble during your busy time." },
    { speaker: "店員", japanese: "とんでもございません。当店のミスでございます。お待ちいただいているお時間に、サービスでドリンクをお持ちしてもよろしいでしょうか。", english: "Not at all, our mistake. While you wait, may I bring you a complimentary drink?" },
    { speaker: "チャウ", japanese: "ご親切にありがとうございます。それでは、お言葉に甘えてオレンジジュースをいただきたく存じます。", english: "Thank you for your kindness. I'll take you up on that — orange juice please." },
    { speaker: "店員", japanese: "(後ほど、お会計の際) お会計はチキンカツ定食一名様、千二百円でございます。", english: "(later, at billing) Bill is one chicken katsu set, 1,200 yen." },
    { speaker: "チャウ", japanese: "失礼ですが、メニューに千百円と表示されていたかと思うのですが。", english: "Excuse me, I think the menu showed 1,100 yen." },
    { speaker: "店員", japanese: "確認いたします。少々お待ちください。", english: "Let me verify. One moment." },
    { speaker: "店員", japanese: "おっしゃる通り、メニューは千百円でございました。本日メニュー改定の前後でして、システムが更新されておらず、千二百円が表示されておりました。お客様のおっしゃる千百円が正しい価格でございます。重ねて申し訳ございません。", english: "You're right, menu showed 1,100 yen. We had a menu revision today; the system wasn't updated and showed 1,200 yen. The 1,100 yen you mentioned is the correct price. Again I apologize." },
    { speaker: "チャウ", japanese: "ご確認、ありがとうございます。それでは、千百円でお願いいたします。それから、領収書もいただけますでしょうか。", english: "Thank you for verifying. Then 1,100 yen please. Also, may I have a receipt?" },
    { speaker: "店員", japanese: "もちろんでございます。本日は二度もご迷惑をおかけしてしまいまして、誠に申し訳ございませんでした。次回ご来店時にお使いいただけるサービス券もお渡しいたしますので、何卒ご活用いただければと存じます。", english: "Of course. We caused you trouble twice today — I'm truly sorry. I'll also give you a service voucher for your next visit; please use it." },
    { speaker: "チャウ", japanese: "ご丁寧なご対応、誠にありがとうございました。お料理も美味しくいただきました。また伺わせていただきます。", english: "Thank you sincerely for the courteous handling. The food was delicious. I'll come again." }
  ],
  roleplay_prompts: [
    "Đóng vai chính bạn ở quán cơm Tokyo, được mang nhầm món. Hãy POLITELY raise issue — KHÔNG immediately demand new dish. Cụm: chotto, kakunin shite itadakemasu deshou ka (xin được xác minh chút). Frame như 'maybe tôi nhầm', không 'restaurant sai'.",
    "Staff xác nhận bạn đúng và xin lỗi lần thứ ba. Hãy KHÔNG over-reassure (tonde mo nai = dismissive). Một lần response polite đủ: o-isogashii tokoro o-tesuu wo o-kake shite, koehrazu sumimasen. Maintain dignity for staff.",
    "Khi check bill, có sai 100 yen (charge nhiều hơn). Hãy KHÔNG ignore vì small amount — Nhật appreciate accuracy. Cụm: shitsurei desu ga, mainyu hyou ni hyaku-en hikui kakaku ga hyouji sarete imashita ga, kakunin itadakemasu deshou ka (xin lỗi nhưng menu show giá thấp hơn 100 yen, xác minh được không?)."
  ],
  register_notes: "Restaurant complaint Nhật khác hotel/business — staff is service-tier, register hơi nhẹ hơn. Bốn patterns: (1) FRAME AS QUESTION: KHÔNG declare error. Frame như 'I might be wrong, can we check'. Cụm: chigatte iru you na ki ga shimasu (em cảm thấy có thể khác). Soft frame = staff không defensive. (2) THANK FOR VERIFICATION: ngay cả khi staff confirms YOUR error (you ordered wrong), thank verification: kakunin itadaki, arigatou gozaimasu. KHÔNG complain that they took time. (3) ACCEPT APOLOGY GRACEFULLY: staff Nhật apologize MULTIPLE TIMES. Một lần response đủ. tonde mo gozaimasen cộng smile. Đừng repeat 'no problem' nhiều lần — staff feel awkward. (4) LEAVE GOOD: nếu staff offer goodwill (drink free, voucher), accept GRACEFULLY. Decline = insult. Cụm: o-kotoba ni amaeて, dou itashimashite (xin nhận lời mời). Future visits welcomed. // TODO native review — saidai-kau (再確認) phrasing — alternative kakunin wo o-negai shimasu mềm hơn for verification request; mainyu kaitei (menu revision) is restaurant-specific timing.",
  idiom_glosses: [
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau khó khăn, mọi thứ vững hơn — phù hợp khi restaurant handle complaint with grace, frame interaction như relationship-building.", example: "雨降って地固まると申しますが、本日のご対応で、より良いお店だと感じました。" },
    { idiom: "お互い様", literal: "Cả hai bên cùng vậy", meaning: "Mutual — khi cả 2 bên có thể nhầm. Frame restaurant complaint không adversarial.", example: "お互い様、人間ですから誰でも間違えます。" },
    { idiom: "急がば回れ", literal: "Vội thì đi vòng", meaning: "Vội vã hỏng việc — phù hợp khi cho restaurant time để fix without rush.", example: "急がば回れ、慎重にご確認いただいて構いません。" },
    { idiom: "おもてなし", literal: "Hospitality", meaning: "Khái niệm hospitality Nhật — proactive customer care. Khi staff offer drink free as goodwill, đó là omotenashi spirit.", example: "おもてなしの心、ありがとうございます。" }
  ],
  cultural_notes_vi: "Restaurant complaint Nhật khác phương Tây ở 5 điểm. (1) STAFF EMPOWERMENT: server Nhật có authority decide rebuild dish, offer free drinks, voucher. KHÔNG cần escalate to manager cho most issues. Họ resolve in seconds. (2) FACE-SAVING: complaint resolved primary trong cùng cuộc nói. KHÔNG public spectacle. Restaurant won't shame you, you don't shame them. Mutual respect throughout. (3) NO TIPPING: KHÔNG tip extra để 'make up' for trouble. Staff không expect — illegal in many establishments. Thank you words enough. Service charge (10 phần trăm) at high-end restaurants automatic, không additional. (4) APOLOGY DEPTH: server xin lỗi multiple times for any mistake — including if YOU ordered wrong. Don't be confused — họ taking responsibility for any confusion. Accept once đủ. (5) GOODWILL OFFERS: nhiều restaurant offer voucher/free drink for next visit khi mistake happens. Decline = insult. Accept với gratitude — và do return. Restaurant remember repeat customers. Khác biệt với VN: ở VN restaurant complaint có thể loud/public if not resolved; ở Nhật, soft and resolved trong cuộc nói đầu. Một quiet polite request ở Nhật = same outcome như loud demand ở VN, with much better feeling for both sides. Mẹo: payment phương thức Nhật thường: cash hoặc card, KHÔNG cash + card splits. Một số izakaya ngừng cards entirely — bring cash backup. Receipt 領収書 critical for business expense — nếu ko có, ask shouhi-zei (consumption tax) breakdown explicitly. Check bill carefully BEFORE pay — một số khá strict about no refunds after pay. Nếu chần chừ, ask kakunin sasete itadakitai (xin được verify) trước khi commit.",
  tip_advice_vi: "Khi vào restaurant: confirm seat/reservation. Wait staff bring menu. Nếu có English menu, ask: ego no menyuu mo arimasu ka. Nhiều quán có. Khi order: speak slowly và clearly, point at menu nếu cần. Confirm key items: dorinku wa nan ni nasaimasu ka (drink choice?). Asparagus or piclkles? Spice level? KHÔNG assume — ask. Khi food arrives: BRIEF check before eating. Right dish? Right portions? Nếu wrong, raise issue NGAY (within 1-2 phút of arrival, before eating much). Easier to remake then. Nếu eaten significant portion before noticing wrong: still raise but accept partial resolution (some restaurants charge partial, especially if eaten>50 phần trăm). Khi raising issue: catch waiter's attention — KHÔNG snap fingers, KHÔNG yell. Light eye contact + raise hand slightly. Server come over within 30 giây. Frame issue softly: chotto, kakunin shite itadakemasu deshou ka (could we verify a bit). Show item, explain difference. Nếu có receipt of order, point. Nếu staff confirm error: thank them, accept their solution. Most will offer remake (10 phút wait) + free drink. Accept gracefully. Nếu staff insist YOU were wrong: nếu unsure, accept và pay. Nếu sure, calmly explain again. KHÔNG escalate to shouting. Nếu still disputed, ask for manager: tencho-san to o-hanashi sasete itadakitai (would like to speak with store manager). Tencho can override decision. Bill check: BEFORE payment, calculate roughly từ menu. Common errors: wrong item count, wrong price, missing discount. If error found, raise politely as in dialogue. Verify menu price, show on phone if needed. Nếu paid và later realize error: return within 30 phút if possible. Sau khi rời, harder to claim. Always keep receipt! Long-term: regular customer benefits in Japan are real. Visit same restaurant 3-5 times within month, staff begin remember you, give better service, sometimes free dish. Friendship economy. Mẹo cuối: nếu allergic / restriction (vegetarian, no pork, gluten-free), TELL UPFRONT before ordering. Cụm: peniciilin ni areriguii ga arimasu (penicillin allergy) hoặc niku wa tabemasen (I don't eat meat). Nhật chefs accommodate when informed early; surprise mid-meal hard to fix.",
  exercises: [
    { type: "fill-blank", question: "注文した料理と少し違うようでして、ご___いただけますでしょうか。", answer: "確認" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "確認させていただきたい", english: "frame complaint as verification (mềm)" },
      { japanese: "メニュー表に書かれていた", english: "reference menu evidence cho bill dispute" },
      { japanese: "作り直してまいります", english: "staff response: will remake dish" },
      { japanese: "サービス券", english: "voucher restaurant offer như goodwill" }
    ] },
    { type: "translation", vietnamese: "Trên menu hiển thị giá là 1100 yen, xin được kiểm tra lại.", japanese: "メニュー表に千百円と表示されておりましたが、再度ご確認いただけますでしょうか。" }
  ]
},
{
  id: 81,
  title: "Taxi dispute — wrong route, fare disagreement",
  title_vi: "Tranh chấp taxi — đi sai đường, không đồng ý giá cước",
  title_en: "Taxi dispute — wrong route, fare disagreement",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "タクシー", english: "taxi" },
    { japanese: "運転手 (うんてんしゅ)", english: "driver" },
    { japanese: "目的地 (もくてきち)", english: "destination" },
    { japanese: "経路 (けいろ)", english: "route" },
    { japanese: "回り道 (まわりみち)", english: "detour / longer route" },
    { japanese: "メーター", english: "meter (taxi fare meter)" },
    { japanese: "料金 (りょうきん)", english: "fare" },
    { japanese: "領収書 (りょうしゅうしょ)", english: "receipt" },
    { japanese: "苦情 (くじょう)", english: "complaint (formal)" },
    { japanese: "タクシーセンター", english: "taxi industry oversight center" }
  ],
  examples: [
    { japanese: "失礼ですが、この経路は少し遠回りではないでしょうか。", english: "Excuse me, isn't this route a bit of a detour?" },
    { japanese: "通常の料金とは少し異なるように思いますが、確認させていただけますでしょうか。", english: "It seems slightly different from the usual fare — could we verify?" },
    { japanese: "領収書をいただきたく存じます。", english: "I'd humbly like a receipt." },
    { japanese: "タクシーセンターに問い合わせをさせていただきます。", english: "I'll inquire with the taxi center." },
    { japanese: "ご対応、よろしくお願いいたします。", english: "I respectfully ask for your handling." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "すみません、運転手さん、この経路は通常より少し遠回りのように思うのですが。", english: "Excuse me, driver, this route seems a bit longer than usual." },
    { speaker: "運転手", japanese: "渋滞を避けるため、こちらの経路を選びました。", english: "To avoid traffic, I chose this route." },
    { speaker: "チャウ", japanese: "なるほど。料金は通常と同じくらいでしょうか。", english: "I see. Is the fare similar to normal?" },
    { speaker: "運転手", japanese: "メーター通りでございます。", english: "As per the meter." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "(車内、目的地まで残り十分) すみません、運転手さん、ちょっと伺ってもよろしいでしょうか。", english: "(in car, 10 min from destination) Excuse me, driver, may I ask something?" },
    { speaker: "運転手", japanese: "はい、何でしょうか。", english: "Yes, what is it?" },
    { speaker: "チャウ", japanese: "今の経路ですが、グーグルマップで確認しましたところ、通常の経路より少し遠回りになっているようでして、ご確認いただけますでしょうか。", english: "Regarding the current route — when I checked Google Maps, it seems a bit longer than usual. Could we verify?" },
    { speaker: "運転手", japanese: "ええ、これは私の判断で選んだ経路です。今、首都高に渋滞がありまして、こちらの方が早く着くと思いまして。", english: "Yes, this is the route I chose. There's traffic on the expressway, and I thought this would arrive faster." },
    { speaker: "チャウ", japanese: "そうでございましたか。承知いたしました。お聞きしたいのですが、通常の料金よりどのくらい上がりますでしょうか。", english: "I see, understood. I'd like to ask — about how much more than the usual fare?" },
    { speaker: "運転手", japanese: "正直に申し上げますと、約三百円程度多くなる可能性がございます。ただし、所要時間は十分以上短くなるかと存じます。", english: "Honestly, about 300 yen possibly more. However, travel time should be more than 10 minutes shorter." },
    { speaker: "チャウ", japanese: "ありがとうございます。次回からは、最初に経路をご相談いただけますと、ありがたく存じます。", english: "Thank you. Going forward, if you could consult on the route at the start, I'd appreciate it." },
    { speaker: "運転手", japanese: "おっしゃる通りでございます。私の配慮不足でした。お客様にご相談する前に判断してしまいました。申し訳ございません。", english: "You're right. My consideration was lacking. I made the decision without consulting you. I apologize." },
    { speaker: "チャウ", japanese: "(目的地着、料金二千八百円) ありがとうございます。料金の内訳を確認させていただいてもよろしいでしょうか。", english: "(arrived at destination, fare 2,800 yen) Thank you. May I verify the fare breakdown?" },
    { speaker: "運転手", japanese: "はい、メーター料金は二千八百円です。深夜料金二割増しの時間帯ではないので、純粋にメーター通りでございます。", english: "Yes, meter fare is 2,800 yen. Not late-night surcharge time, so purely as meter." },
    { speaker: "チャウ", japanese: "通常の料金は二千五百円程度と伺っていたのですが、今回は遠回りの経路ですので、その差額三百円分は私が負担すべきとは思えません。如何でございましょうか。", english: "I heard the usual fare is around 2,500 yen, and since this was a detour route, I don't think I should bear the 300 yen difference. What do you think?" },
    { speaker: "運転手", japanese: "おっしゃる通りでございます。今回、私の判断ミスでお客様にご負担をおかけしてしまいました。差額三百円は私が負担いたしますので、二千五百円でお願いいたします。領収書もお出しいたします。", english: "You're right. My judgment error caused you a burden. I'll cover the 300 yen difference; please pay 2,500 yen. I'll issue a receipt as well." },
    { speaker: "チャウ", japanese: "ご対応、誠にありがとうございます。今回の経験を機に、次回はより良いサービスをお願いできるかと存じます。", english: "Thank you sincerely for the handling. With this experience, I trust next time will have better service." },
    { speaker: "運転手", japanese: "雨降って地固まるとも申します。お客様のご指摘で、自分の業務を見直す機会になりました。今後ともよろしくお願いいたします。", english: "As they say after rain the ground hardens. Your feedback gave me a chance to review my work. Looking forward to next time." },
    { speaker: "チャウ", japanese: "こちらこそ、ご丁寧な対応に感謝申し上げます。失礼いたします。", english: "On the contrary, I appreciate your courteous handling. Excusing myself." }
  ],
  roleplay_prompts: [
    "Trên xe taxi Nhật, bạn nhận thấy driver đi đường vòng. Hãy KHÔNG accuse — frame như 'verify together'. Cụm: kakunin sasete itadakemasen deshou ka cộng show Google Maps trên phone. Driver có thể có lý do hợp lý (avoid construction, traffic).",
    "Driver giải thích lý do detour nhưng bạn vẫn nghĩ extra fare unfair. Hãy negotiate firm-but-polite: KHÔNG demand discount, frame như shared concern. Cụm: sashitsukae nakereba, sagaku no go-soudan wo sasete itadakitaku zonjimasu (nếu không phiền, em xin tham vấn về chênh lệch).",
    "Driver xin lỗi và agree to absorb 300 yen difference. Hãy accept gracefully — KHÔNG over-thank (sounds patronizing) hoặc rush. Cụm: go-taiou, makoto ni arigatou gozaimasu cộng nhận change cộng nhận receipt. Maintain mutual respect."
  ],
  register_notes: "Taxi dispute Nhật khác hotel/restaurant ở 1 critical point: driver KHÔNG là service-tier như waiter — họ là independent professional. Register: firm-but-polite, KHÔNG over-deferential. Bốn patterns: (1) RAISE ISSUE EARLY: nếu thấy detour, raise WITHIN 5 phút of noticing — KHÔNG wait until destination. Mid-route fix possible, post-arrival hard. (2) FRAME AS COLLABORATION: kakunin sasete itadakemasen deshou ka (xin được kiểm tra). Show evidence (Google Maps). KHÔNG accuse. Driver might have legit reason. (3) NEGOTIATE LIKE EQUALS: KHÔNG ask discount kiểu pleading — request fair settlement: o-kyaku-sama no go-futan ni naru bun wa, watakushi ga futanru beki dato omoimasu (em nghĩ phần burden của khách thì khách không nên trả). Frame logic, không emotion. (4) TAXI CENTER ESCALATION: nếu driver refuse fairness, mention タクシーセンター (Taxi Center) — Tokyo Hire-Taxi Association. Driver lose license sau multiple complaints. Mention this politely, không threaten. // TODO native review — sagaku (差額) phrasing — alternative kingaku no chigai (different amount) more casual; some passengers prefer mawa-michi-bun (detour-portion) to specify what's disputed.",
  idiom_glosses: [
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau khó khăn, mọi thứ vững hơn — phù hợp khi driver accept feedback gracefully, frame như learning opportunity for them.", example: "雨降って地固まると申します。今回の経験で、より良いサービスができるようになります。" },
    { idiom: "急がば回れ", literal: "Vội thì đi vòng", meaning: "Vội vã hỏng việc — ironic context: driver chose detour to be 'faster', nhưng confused customer. Lesson: communicate first.", example: "急がば回れ、最初に経路をご相談いただければ、お互い明確でした。" },
    { idiom: "お互い様", literal: "Cả hai bên cùng vậy", meaning: "Mutual — frame dispute như shared learning. Both passenger and driver có expectations về clear comms.", example: "お互い様で、コミュニケーションが大切でございます。" },
    { idiom: "備えあれば憂いなし", literal: "Có chuẩn bị thì không lo", meaning: "Better safe than sorry — phù hợp lesson sau dispute: confirm route + price BEFORE departure.", example: "備えあれば憂いなし、次回は乗車前に経路と料金を確認いたします。" }
  ],
  cultural_notes_vi: "Taxi disputes Nhật khác phương Tây ở 5 điểm. (1) METER LAW: Tokyo taxi must use meter except long-distance fixed routes. KHÔNG meter = illegal. Always confirm meter at start: meeta de o-negai shimasu (please use meter). (2) BASIC ROUTE EXPECTATION: driver expected to take 'reasonable shortest route'. Detour OK only if (a) traffic genuine, (b) construction, (c) PASSENGER ASKED. Without reason, detour = bad service possible refund. (3) RECEIPT MANDATORY: 領収書 (receipt) required when asked. Driver MUST provide. Save it — number on receipt is taxi company ID for complaints. (4) TAXI CENTER OVERSIGHT: Tokyo Hire-Taxi Association investigates complaints. Driver fault after 3-5 complaints can lose license. Companies discipline drivers based on complaints. (5) NIGHT SURCHARGE: 22:00-05:00 = 20 phần trăm extra. Built into meter. Confirm time on receipt — discrepancy = error. Khác biệt với VN: ở VN taxi có thể negotiate fare freely; ở Nhật, meter là law. KHÔNG offer cash discount — driver may decline if it violates meter. Negotiate trên LEGITIMATE grounds (detour, error) chỉ. Mẹo: airport taxi có flat rate options (Narita-Tokyo: ~24,000 yen flat). Confirm flat OR meter at start. Train là cheaper for solo travel. Foreigners often defaulted to taxi — train often better. Long-term: app-based taxi (GO, S.RIDE) eliminate route disputes — fare estimated upfront, route shown trên app. Pay digital, automatic receipt. Recommend over street-hail taxi for foreigners. Mẹo cuối: dù dispute resolved positively, gửi feedback to taxi company qua online form (most major companies — Nihon Kotsu, Daiwa Taxi). Companies use feedback for driver training. Constructive feedback > revenge.",
  tip_advice_vi: "Trước boarding: take photo of taxi ID number (in front, license plate). Nếu app-based, screenshot booking. Confirm destination với driver: tên cụ thể + address. Nếu hotel name, OK. Nếu obscure address, write/show kanji on phone. Confirm meter usage: meeta de o-negai shimasu. Watch driver hit meter button. Nếu driver hesitate or quote flat rate (no meter), DECLINE và pick another taxi. During ride: monitor route on Google Maps periodically (every 5 phút). Nếu detour suspected, photo current location + planned route on phone. Khi raise issue: do it CALMLY. Driver mid-driving không want argue, but easier to discuss now than at destination. Cụm: kakunin sasete itadakemasen deshou ka cộng show map. Listen to explanation. Nếu legit (construction, traffic), OK accept. Nếu vague hoặc evasive, note for end-of-ride. Khi arrived: BEFORE pay, verify total: meter reading correct, no surcharge surprises. Nếu dispute total: state clearly your view, listen to driver. Most drivers Nhật resolve fairly. Nếu refuse to budge: PAY full amount (KHÔNG escalate at scene), get receipt, take photo of taxi info. Sau exit: file complaint với taxi company within 24 giờ. Required info: receipt, photo, time of ride, departure/destination, dispute description. Most companies have online form (English available cho major like Nihon Kotsu). Within 7-14 ngày, company contact bạn với resolution. Often partial refund for legit complaint. Tokyo Taxi Center (タクシーセンター) escalation if company unresponsive: 03-3648-0300, English support available. They mediate, can fine driver. Long-term: register Japan Taxi app (free) — eliminates most disputes via fixed-route fare estimation. Receipts auto-generated. Driver rating system pushes better service. Mẹo nhỏ: Japanese taxi drivers thường older (50-65), conservative, value respect. Một quick polite greeting (yoroshiku onegai shimasu) at boarding + thank-you (arigatou gozaimashita) at exit go a long way. Even with dispute, maintain dignity. Aggressive customer creates aggressive driver. Calm professional customer creates calm professional driver. Default to calm.",
  exercises: [
    { type: "fill-blank", question: "失礼ですが、この経路は少し___ではないでしょうか。", answer: "遠回り" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "メーターでお願いします", english: "request meter usage at boarding" },
      { japanese: "回り道", english: "detour route (longer than usual)" },
      { japanese: "差額", english: "fare difference (dispute amount)" },
      { japanese: "タクシーセンター", english: "taxi industry oversight (escalation)" }
    ] },
    { type: "translation", vietnamese: "Phần chênh lệch do đi đường vòng, em không nên trả.", japanese: "遠回りの経路ですので、その差額分は私が負担すべきとは思えません。" }
  ]
},
{
  id: 82,
  title: "Difficult conversation with Japanese in-laws — cultural expectations",
  title_vi: "Trò chuyện khó với gia đình chồng/vợ Nhật — kỳ vọng văn hóa",
  title_en: "Difficult conversation with Japanese in-laws — cultural expectations",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "義両親 (ぎりょうしん)", english: "parents-in-law" },
    { japanese: "義理 (ぎり)", english: "duty / obligation (in-law / social)" },
    { japanese: "価値観 (かちかん)", english: "values / outlook" },
    { japanese: "文化の違い (ぶんかのちがい)", english: "cultural difference" },
    { japanese: "期待 (きたい)", english: "expectation" },
    { japanese: "思いやり (おもいやり)", english: "consideration / empathy" },
    { japanese: "距離感 (きょりかん)", english: "sense of closeness/distance" },
    { japanese: "お盆 (おぼん)", english: "Obon — summer ancestor festival" },
    { japanese: "帰省 (きせい)", english: "returning to one's family home" },
    { japanese: "歩み寄る (あゆみよる)", english: "to meet halfway / mutually adjust" }
  ],
  examples: [
    { japanese: "私たちの家庭の事情も、少しご理解いただけますと幸いに存じます。", english: "I'd be grateful if you could understand a little of our household's circumstances." },
    { japanese: "文化の違いから、誤解が生じることもあるかと存じます。", english: "Cultural differences may at times give rise to misunderstandings." },
    { japanese: "ベトナムでは少し違う習慣がございまして、ご相談させていただきたく存じます。", english: "Customs in Vietnam differ slightly — I'd humbly like to consult you." },
    { japanese: "ご期待に沿えない部分もございますが、心からお詫び申し上げます。", english: "There are areas where I cannot meet your expectations — I sincerely apologize." },
    { japanese: "お互い、少しずつ歩み寄れればと願っております。", english: "I hope we can gradually meet each other halfway." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "お義母さま、少しお話しさせていただいてもよろしいでしょうか。", english: "Mother-in-law, may I take a little of your time to talk?" },
    { speaker: "義母", japanese: "ええ、何かしら。", english: "Yes, what is it?" },
    { speaker: "チャウ", japanese: "今年のお盆ですが、ベトナムの家族の事情がございまして、帰省が短めになりそうでして。ご理解いただけますと幸いです。", english: "About Obon this year — there are circumstances on my Vietnamese family's side; my stay may be shorter. I'd appreciate your understanding." },
    { speaker: "義母", japanese: "そうでしたか。事情があるのね。少し残念だけれど、大丈夫よ。", english: "I see. You have your reasons. A little disappointing, but it's all right." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "お義母さま、お時間少しよろしいでしょうか。お話ししたいことがございまして。", english: "Mother-in-law, do you have a moment? There's something I'd like to talk about." },
    { speaker: "義母", japanese: "あら、改まって。何かあったの。", english: "Oh, this is formal. Did something happen?" },
    { speaker: "チャウ", japanese: "実は、今度のお盆のことなのですが、ベトナムの家族の都合と重なってしまいまして、ご相談させていただきたく存じます。", english: "Actually, about Obon this time — it overlaps with my Vietnamese family's plans, and I'd like to consult you." },
    { speaker: "義母", japanese: "ベトナムの方のご事情ね。どんな状況なのかしら。", english: "Your family in Vietnam, then. What's the situation?" },
    { speaker: "チャウ", japanese: "母が少し体調を崩しておりまして、早めに顔を見せに帰国したいと考えておりまして。お盆の最終日には間に合わないかもしれません。", english: "My mother's health is a little unwell, and I'd like to go back early to see her. I may not make it back by the last day of Obon." },
    { speaker: "義母", japanese: "それはご心配でしょう。お母さまの体調が一番大切ね。", english: "That must be worrying. Your mother's health comes first." },
    { speaker: "チャウ", japanese: "ご理解、ありがとうございます。実は、もう一つご相談したいことがございまして。", english: "Thank you for understanding. There's one more thing I'd like to consult about." },
    { speaker: "義母", japanese: "何かしら、遠慮せず言って。", english: "What is it? Don't hold back — go ahead." },
    { speaker: "チャウ", japanese: "去年のお盆の際、お墓参りの作法に不慣れで、ご迷惑をおかけしてしまったのではないかと、ずっと気にかかっておりました。", english: "Last Obon, I was unfamiliar with the manners for visiting the grave; I've been worried I might have caused trouble." },
    { speaker: "義母", japanese: "あら、そんなこと気にしていたの。慣れていなくて当然よ。私たちも、もっと丁寧に教えればよかったわね。", english: "Oh, you were worrying about that? It's natural not to be used to it. We should have explained more carefully too." },
    { speaker: "チャウ", japanese: "いえ、私の方こそ、もっと事前に伺うべきでした。今年は、可能であれば、参拝の前に少しご説明いただけますと、心を込めて手を合わせられるかと存じます。", english: "No, I should have asked beforehand. If possible, this year, if you'd explain a little before we visit, I think I could pray with all my heart." },
    { speaker: "義母", japanese: "ええ、もちろん。むしろ、聞いてくれると嬉しいわ。文化の違いは、お互い少しずつ知っていけばいいの。", english: "Of course. I'm actually glad you asked. Cultural differences — we just learn each other's bit by bit." },
    { speaker: "チャウ", japanese: "ありがとうございます。実は、ベトナムでも先祖を大切にする習慣がございまして、お盆と似た行事もございます。", english: "Thank you. In fact, Vietnam too has the custom of honoring ancestors, with rituals similar to Obon." },
    { speaker: "義母", japanese: "そうなの。それは知らなかったわ。今度詳しく教えてくれる?", english: "Really? I didn't know. Will you tell me more about it some time?" },
    { speaker: "チャウ", japanese: "もちろんです。お互いの文化を共有できれば、より深く理解し合えるかと存じます。", english: "Of course. If we can share each other's cultures, I think we can understand each other more deeply." },
    { speaker: "義母", japanese: "本当にそうね。家族って、血のつながりだけじゃなくて、こうして話し合って作っていくものなのよ。", english: "That's truly so. Family isn't only blood — it's something we build by talking like this." },
    { speaker: "チャウ", japanese: "お義母さまにそう言っていただけて、心が軽くなりました。本当にありがとうございます。", english: "Hearing you say that, my heart feels lighter. Truly, thank you." },
    { speaker: "義母", japanese: "こちらこそ、話してくれてありがとう。これからも、何かあれば遠慮なく言ってちょうだいね。", english: "And thank you for telling me. From now on, whenever something comes up, don't hesitate to say so." }
  ],
  roleplay_prompts: [
    "Đóng vai bạn ở phòng khách nhà chồng/vợ Nhật, sau bữa tối. Bạn cần nói rằng năm nay không thể về quê chồng dài như mọi năm. Hãy KHÔNG bắt đầu với 'sumimasen ga' (sounds defensive) — frame như tham vấn (gosoudan). Cụm: okaa-sama, sukoshi o-hanashi sasete itadaite mo yoroshii desu ka. Đặt context (lý do bên VN) TRƯỚC khi đưa request.",
    "Mẹ chồng nhắc một việc bạn làm sai năm ngoái (cách dâng cơm tổ tiên / cách thắp hương). Hãy KHÔNG over-apologize, KHÔNG defensive — acknowledge + ask học cách đúng. Cụm: jizen ni o-kiki suru beki deshita (em nên hỏi trước). Frame như cơ hội học hỏi, không như lỗi cần xóa.",
    "Mẹ chồng tỏ ra hơi thất vọng nhưng KHÔNG nói thẳng — khoảng dừng dài, ánh mắt rời đi (察する moment). Hãy đọc ý — KHÔNG ép bà giải thích. Acknowledge: o-kimochi, juubun ni rikai shite orimasu (con hiểu được tâm trạng của mẹ). Sau đó offer một compromise nhỏ (ngày khác về phụ, gọi video Obon ngày đầu) để giữ relationship."
  ],
  register_notes: "Trò chuyện với 義両親 KHÁC trò chuyện công việc dù cùng register cao. Năm patterns: (1) FRAME AS CONSULTATION, NOT ANNOUNCEMENT: KHÔNG declare 'em sẽ về sớm' — frame 'em xin được tham vấn'. Cụm: go-soudan sasete itadakitaku zonjimasu. In-law có face — họ phải feel consulted, không thông báo. (2) CONTEXT BEFORE REQUEST: Vietnamese instinct là apologize first; Japanese in-law instinct là hear context. Đặt lý do (mẹ ốm, em gái cưới) TRƯỚC, request ngắn sau. Reverse order = sounds entitled. (3) READ 察する MOMENTS: in-law thường KHÔNG nói thẳng nếu thất vọng — biểu hiện qua silent pause, eye-aversion, tone shift. Khi thấy, KHÔNG ép giải thích. Acknowledge softly: o-kimochi rikai shite orimasu. (4) ENRYO BALANCE: trong gia đình chồng, dùng polite forms KHÔNG quá deferential (sounds như khách lạ). Mid-keigo (desu/masu + occasional itadaku) phù hợp daughter/son-in-law. Quá keigo = họ nói 'kazoku nan da kara, sonnani katai koto wa nai yo' (nhà mình mà, không cần khách sáo) — đó là gentle correction. (5) HONNE OPENING: nếu bạn share một tình cảm thật (con cũng nhớ ba mẹ ở VN), in-law thường đáp lại bằng honne của họ. Mutual vulnerability builds connection. // TODO native review — gosoudan sasete itadakitaku zonjimasu phrasing — alternative chotto gosoudan ga arimasu ít formal hơn cho closer in-law relationships; one Japanese reviewer suggested 'osore-irimasu ga' opening for first serious conversation.",
  idiom_glosses: [
    { idiom: "親しき仲にも礼儀あり", literal: "Trong quan hệ thân thiết cũng có lễ nghi", meaning: "Dù gia đình thân, vẫn cần lịch sự — phù hợp khi nhắc nhở chính bản thân không quá casual với mẹ chồng.", example: "親しき仲にも礼儀ありと申しますし、お義母さまには丁寧にお話ししたく存じます。" },
    { idiom: "縁は異なもの", literal: "Duyên là điều kỳ lạ", meaning: "Duyên kết nối những con người không tưởng — phù hợp frame xuyên-văn-hóa marriage như duyên định.", example: "縁は異なものと申します。文化が違っても、こうして家族になれましたこと、感謝しております。" },
    { idiom: "雨降って地固まる", literal: "Mưa rơi đất rắn lại", meaning: "Sau mâu thuẫn, quan hệ vững hơn — phù hợp đóng cuộc trò chuyện khó với in-laws bằng note tích cực.", example: "雨降って地固まると申しますし、今日のお話で、より理解が深まったかと存じます。" },
    { idiom: "以心伝心", literal: "Truyền tâm bằng tâm", meaning: "Hiểu nhau không cần lời — Nhật value khả năng đọc tâm tư mà không phải nói. In-law đánh giá cao khi bạn 察する được.", example: "以心伝心と申しますが、お義母さまのお気持ち、少しでも汲み取れていれば幸いです。" }
  ],
  cultural_notes_vi: "Quan hệ với 義両親 ở Nhật khác hẳn VN ở 6 điểm. (1) HOUSEHOLD HEAD CONCEPT: dù 'ie' (家) system đã abolished sau 1947, văn hóa vẫn deep — eldest son's gia đình expected to honor ancestors, take care of parents in old age. Nếu chồng/vợ bạn là chōnan (長男, eldest son) hoặc chōjo (長女, eldest daughter, especially nếu không có nam), expectations về visiting + ritual cao. Discussing this UPFRONT before marriage saves grief. (2) OBON + NEW YEAR ARE NON-NEGOTIABLE: hai dịp này — お盆 (mid-August) và お正月 (New Year, Jan 1-3) — gia đình expected to gather. Skip lần đầu OK với good reason; skip nhiều năm = serious damage relationship. Nếu phải skip, GỌI ngay từ tháng trước, KHÔNG sát ngày. (3) GIFT CULTURE NUANCES: お中元 (ochuugen, July gift), お歳暮 (oseibo, December gift) — nhiều gia đình modern đã skip, nhưng nếu in-laws traditional, mỗi năm bỏ không gửi = noticed. Hỏi chồng/vợ verify expectations. Gift KHÔNG cần đắt (3,000-5,000 yen typical), nhưng phải có. (4) YOME VS MUKO: con dâu (yome, 嫁) historically có nghĩa vụ heavier hơn con rể (muko, 婿), nhưng gen Z+ in-laws relaxed nhiều. Tuy nhiên, ngay cả modern in-laws still appreciate khi yome remember birthdays, anniversaries của họ. (5) DIRECTNESS LEVEL: in-laws rarely tell you directly họ unhappy — họ tell con của họ (chồng/vợ bạn), người này tell bạn. Đây không phải gossip — là protocol. Nếu chồng/vợ bring up 'ba mẹ nhắc...', listen carefully. (6) NEVER COMPLAIN ABOUT IN-LAWS TO YOUR OWN PARENTS: ở VN ok đôi khi nhắc khó khăn với ba mẹ — at Nhật, in-laws hearing this gián tiếp là big betrayal. Khác biệt với VN: ở VN con dâu thường visit chợ với mẹ chồng, cùng nấu ăn, build relationship qua daily acts; ở Nhật, in-law relationship build qua structured events (festivals, gifts, formal visits) hơn casual time together. Mẹo: khi visit lần đầu, mang gift từ Vietnam (specialty trà, cà phê, snacks) — tạo ấn tượng tốt + cultural exchange. Một bộ tea set Bát Tràng, một hộp bánh đậu xanh, một hộp cà phê Trung Nguyên — all welcomed.",
  tip_advice_vi: "Trước cuộc trò chuyện khó: prepare 3 things. (a) WHAT exactly bạn cần communicate — viết ra 1-2 câu cốt lõi. (b) WHY context — chuẩn bị 2-3 câu giải thích lý do. (c) WHAT bạn offer in compromise — đừng chỉ nói 'em không thể', cũng nói 'em sẽ làm X bù'. Choose timing carefully: KHÔNG bring up serious topic when in-law just woke up, just before sleep, or in middle of family event. Best: after dinner, sitting at low table (kotatsu hoặc dining), no TV, chồng/vợ bạn either present (supportive) OR completely absent (privacy). Confirm với chồng/vợ: which configuration their parents prefer. Open the talk: ask permission first. Cụm: o-jikan sukoshi yoroshii deshou ka cộng o-hanashi shitai koto ga gozaimashite (có thời gian một chút không, có việc muốn thưa). KHÔNG dive in. During the talk: speak slowly. Pauses OK. Don't fill silence — Nhật uses silence to process. Eye contact moderate (khoảng 60 phần trăm — staring = aggressive). Body posture calm, hands visible. Khi in-law respond: LISTEN FULLY before defending. Common in-law habit: bring up related concern bạn không expect. Don't dismiss — acknowledge: oshatte iru koto, juubun ni rikai dekimasu (em hiểu mẹ nói gì). Nếu disagree: KHÔNG argue thẳng. Cụm: ossharu tooride gozaimasu ga, watakushi-domo no koto mo sukoshi go-hairyo itadakemasu deshou ka (mẹ nói đúng, nhưng xin mẹ hiểu hoàn cảnh chúng con). Frame disagreement như request for empathy, KHÔNG counter-attack. After the talk: thank them. Cụm: o-hanashi sasete itadaki, arigatou gozaimashita. Within 3-5 ngày, send thank-you message via your spouse OR direct (depending closeness). Reinforce điểm tích cực conversation. Long-term: learn one cultural practice per year — ikebana, tea ceremony basics, calligraphy, regional dish. KHÔNG để impress, để genuinely engage culture. In-laws notice authentic interest. Mẹo cuối: nếu major disagreement không resolve trong 1 cuộc trò chuyện, KHÔNG force resolution. Cụm: kondo, mou ichido yukkuri o-hanashi sasete kudasai (lần tới, xin được trò chuyện kỹ hơn). Nhật resolve qua nhiều cuộc trò chuyện small, không one big confrontation. Patience là asset.",
  exercises: [
    { type: "fill-blank", question: "お互い、少しずつ___寄れればと願っております。", answer: "歩み" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "ご相談させていただきたく存じます", english: "frame difficult topic as consultation, not announcement" },
      { japanese: "お気持ち、十分に理解しております", english: "acknowledge in-law's feelings without forcing them to explain" },
      { japanese: "お互い少しずつ歩み寄れれば", english: "frame relationship as mutual adjustment, not one-side compromise" },
      { japanese: "事前にお伺いすべきでした", english: "graceful self-correction without over-apology" }
    ] },
    { type: "translation", vietnamese: "Có sự khác biệt văn hóa, đôi khi sinh hiểu lầm — em mong mẹ thông cảm.", japanese: "文化の違いから、誤解が生じることもございます。ご理解いただけますと幸いに存じます。" }
  ]
},
{
  id: 83,
  title: "Political disagreement with a Japanese friend — holding ground respectfully",
  title_vi: "Bất đồng chính trị với bạn Nhật — giữ quan điểm mà không làm rạn",
  title_en: "Political disagreement with a Japanese friend — holding ground respectfully",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "意見 (いけん)", english: "opinion" },
    { japanese: "立場 (たちば)", english: "position / standpoint" },
    { japanese: "考え方 (かんがえかた)", english: "way of thinking" },
    { japanese: "賛成 (さんせい)", english: "agreement / approval" },
    { japanese: "反対 (はんたい)", english: "opposition / disagreement" },
    { japanese: "尊重する (そんちょうする)", english: "to respect" },
    { japanese: "議論 (ぎろん)", english: "debate / discussion" },
    { japanese: "視点 (してん)", english: "viewpoint / perspective" },
    { japanese: "前提 (ぜんてい)", english: "premise / assumption" },
    { japanese: "気を悪くする (きをわるくする)", english: "to take offense / feel bad" }
  ],
  examples: [
    { japanese: "立場は違いますが、お考えは尊重しております。", english: "Our positions differ, but I respect your way of thinking." },
    { japanese: "私の見方は少し異なるのですが、お話を伺ってもよろしいでしょうか。", english: "My view differs a little — may I hear yours first?" },
    { japanese: "気を悪くされたら申し訳ないのですが、別の視点もございまして。", english: "Forgive me if this gives offense — there's another perspective." },
    { japanese: "ご意見は理解できますが、私としては賛同いたしかねます。", english: "I understand your opinion, but I cannot agree with it personally." },
    { japanese: "この話題で関係が壊れるのは、私の本意ではございません。", english: "It's not my intention for our relationship to break over this topic." }
  ],
  dialogue: [
    { speaker: "友人", japanese: "あの政策、けっこういいと思うんだよね。チャウさんはどう思う?", english: "I think that policy is pretty good. What do you think, Chau?" },
    { speaker: "チャウ", japanese: "正直に申し上げますと、私は少し違う見方をしております。", english: "Honestly, I see it a little differently." },
    { speaker: "友人", japanese: "へえ、どんなところが気になるの?", english: "Oh, what bothers you about it?" },
    { speaker: "チャウ", japanese: "立場の違いはあるかもしれませんが、まずお考えを聞かせていただいてもよろしいですか。", english: "Our positions may differ — first, may I hear your thinking?" }
  ],
  dialogue_long: [
    { speaker: "友人", japanese: "ねえチャウさん、最近のあのニュース見た? 政府の新しい移民政策の話。", english: "Hey Chau, did you see the recent news? The government's new immigration policy." },
    { speaker: "チャウ", japanese: "見ました。賛否が分かれているようですね。", english: "I saw it. Opinions seem divided." },
    { speaker: "友人", japanese: "私はけっこう賛成なんだけど。日本の経済を考えると必要だと思うし。チャウさんはどう?", english: "I'm rather in favor. Thinking about Japan's economy, I think it's necessary. How about you?" },
    { speaker: "チャウ", japanese: "正直に申し上げると、私は少し違う見方をしておりまして。", english: "Honestly, I see it a little differently." },
    { speaker: "友人", japanese: "へえ、どんなところが気になるの?", english: "Oh, what's bothering you about it?" },
    { speaker: "チャウ", japanese: "気を悪くされたら申し訳ないのですが、まずあなたのお考えをもう少し詳しく聞かせていただいてもよろしいでしょうか。立場が違うかもしれませんので、まず理解したいと思いまして。", english: "Forgive me if this offends — could I hear your reasoning a bit more first? Since our positions may differ, I'd like to understand first." },
    { speaker: "友人", japanese: "うん、私は労働力不足が深刻だと感じていて、外国人労働者の受け入れを広げる方が日本の将来にいいと思うの。", english: "Sure. I feel the labor shortage is severe, and I think widening acceptance of foreign workers is better for Japan's future." },
    { speaker: "チャウ", japanese: "なるほど、そのお考えはよく理解できます。実は私も、受け入れ自体には反対しておりません。ただ、受け入れる側の制度が整っていない部分が気になっておりまして。", english: "I see — I understand that thinking well. Actually, I'm not opposed to acceptance itself. What concerns me is that the receiving-side system isn't fully in place." },
    { speaker: "友人", japanese: "制度というと、具体的に?", english: "By system, you mean specifically?" },
    { speaker: "チャウ", japanese: "外国人として日本で働いた経験から申し上げると、言語サポート、住居の保証人制度、医療の手続きなど、現場では難しさを感じる場面が多くあります。受け入れを広げる前に、その部分を整えていただけたらと、個人的に願っております。", english: "Speaking from my experience working in Japan as a foreigner — language support, housing-guarantor system, medical procedures — there are many points where the on-the-ground experience is hard. Personally, I hope those areas could be put in order before broadening acceptance." },
    { speaker: "友人", japanese: "そっか、当事者としての視点だね。私はそこまで考えていなかった。", english: "I see — the perspective of someone who actually goes through it. I hadn't thought that far." },
    { speaker: "チャウ", japanese: "立場が違いますので、見えるものも違うかと存じます。私もあなたの労働力不足のご指摘、確かにその通りだと思います。両方とも本当のことかと。", english: "Our positions differ, so what's visible differs too. Your point about labor shortage — I think it's truly so. Both things are true." },
    { speaker: "友人", japanese: "うん、対立じゃなくて、両方大事ってことだよね。", english: "Yeah, not opposition — both matter, right?" },
    { speaker: "チャウ", japanese: "そう思います。同じ問題でも、見る場所によって違って見えるのは自然なことかと。", english: "I think so. With the same issue, what we see depends on where we stand — that's natural." },
    { speaker: "友人", japanese: "こういう話、率直にしてくれて嬉しい。普段、外国人の友達とこういう深い話、なかなかしないから。", english: "I'm glad you spoke frankly about this. I rarely have these deep talks with foreign friends." },
    { speaker: "チャウ", japanese: "こちらこそ、聞いてくださって感謝しております。意見が違っても、こうして話せる関係はとても貴重です。", english: "Thank you for listening. Even when we disagree, a relationship where we can talk like this is very precious." },
    { speaker: "友人", japanese: "また今度、ゆっくり話そうよ。違う意見、聞かせて。", english: "Let's talk slowly again sometime. Tell me your different opinions." },
    { speaker: "チャウ", japanese: "ぜひ。お互いの視点を交換できる時間を、これからも大切にしたく存じます。", english: "Gladly. I'd like to keep treasuring the time we can exchange perspectives." }
  ],
  roleplay_prompts: [
    "Bạn đang ăn trưa với đồng nghiệp Nhật, người này nêu chính kiến (chính sách lao động nước ngoài / quan hệ Nhật-VN / một issue social). Bạn không đồng ý nhưng KHÔNG muốn rạn quan hệ. Hãy MỞ bằng cách hỏi rõ quan điểm của họ TRƯỚC: mazu o-kangae wo kikasete itadaite mo yoroshii desu ka. KHÔNG counter-attack ngay.",
    "Đồng nghiệp giải thích xong, bạn cần đưa quan điểm khác. Hãy frame như experiential perspective (tôi nói từ trải nghiệm cá nhân), KHÔNG abstract debate. Cụm: gaikokujin to shite Nihon de hataraita keiken kara moushiagemasu to. Phần personal lived experience khó để counter mà không rude — đây là Japanese cách giữ disagreement trong civility.",
    "Đồng nghiệp tỏ ra hơi defensive. Hãy NHẬN chỗ họ đúng — KHÔNG rút lui hoàn toàn (yields-too-much), nhưng acknowledge điểm tốt: anata no shiteki, tashika ni sono toori dato omoimasu. Sau đó re-state your view một cách softer: kojin-teki ni wa, mada kininaru tokoro ga gozaimasu (cá nhân con vẫn còn điểm băn khoăn)."
  ],
  register_notes: "Bất đồng chính trị với người Nhật khác Mỹ/VN ở core: Nhật value WA (和, harmony) — direct counter-argument bị coi rude dù logic đúng. Năm patterns: (1) ASK FIRST, ANSWER SECOND: nguyên tắc bất di dịch. Khi friend bring up political topic, KHÔNG immediately give your view. Ask theirs first: o-kangae wo kikasete itadaite mo yoroshii deshou ka. Lý do: (a) thể hiện respect, (b) cho bạn time to calibrate response, (c) nếu họ có nuance bạn miss, bạn có thể tránh straw-man. (2) FRAME AS EXPERIENCE, NOT ABSTRACT: Nhật accept personal lived experience hơn abstract argument. Cụm: gaikokujin to shite (với tư cách người nước ngoài), watakushi no keiken kara (từ trải nghiệm cá nhân). Đây là conversational shield — họ không thể counter your lived experience một cách rude. (3) ACKNOWLEDGE BEFORE DISAGREE: 'I understand X, but Y' pattern. Cụm: oshatte iru koto wa rikai dekimasu ga (hiểu được điều bạn nói, nhưng). Without acknowledgment, disagreement bị nghe như dismissal. (4) PERSONAL OPINION FRAME: dùng watakushi to shite wa (riêng tôi thì), kojin-teki ni wa (cá nhân thì). Tránh universal claims (must, should, all Japanese). Frame như cá nhân = họ không cần defend cả nhóm. (5) CLOSE WITH RELATIONSHIP NOT POSITION: dù không reach agreement, kết thúc bằng affirmation về relationship: i-ken ga chigatte mo, kou shite hanaseru kankei wa kichou desu (dù khác ý kiến, mối quan hệ trò chuyện thế này quý lắm). Friend nhớ lại closing tone hơn debate detail. // TODO native review — sandou itashikanemasu phrasing — alternative kanari muzukashii kamoshiremasen mềm hơn cho strong disagreement; some natives caution that 'kanemasu' form sounds bureaucratic in casual political talk.",
  idiom_glosses: [
    { idiom: "和をもって貴しとなす", literal: "Coi sự hòa làm điều quý", meaning: "Lời của Thái tử Shōtoku — harmony cao hơn debate. Phù hợp khi đặt khung dialogue: dù bất đồng, mục tiêu vẫn là harmony.", example: "和をもって貴しとなすと申しますし、意見が違っても、対話を大切にしたいと存じます。" },
    { idiom: "十人十色", literal: "Mười người mười màu", meaning: "Mỗi người mỗi ý — frame disagreement như tự nhiên, không bất thường.", example: "十人十色と申します。立場が違えば、見方も違って当然かと。" },
    { idiom: "鶴の一声", literal: "Một tiếng kêu của hạc", meaning: "Lời quyết định từ người có quyền — context: disagreement không cần ai quyết, mỗi người giữ ý mình.", example: "鶴の一声で結論を出す必要はないかと。お互いの意見を持ち続けて構わないと存じます。" },
    { idiom: "腹を割って話す", literal: "Mổ bụng ra mà nói", meaning: "Nói thẳng từ tim — phù hợp khi friendship đủ thân để chia sẻ honest view.", example: "腹を割って話せる関係は、本当に貴重だと感じております。" }
  ],
  cultural_notes_vi: "Bất đồng chính trị với bạn Nhật đặc biệt khó vì 6 yếu tố. (1) POLITICS = TABOO IN MOST SETTINGS: tại Nhật, politics rarely discussed at workplace, KHÔNG ở family dinner, KHÔNG with new friends. Nếu friend bring up, đó là sign of trust — họ test bạn có civilly handle được không. Disrespect = friendship damage permanent. (2) NUCLEAR / CONSTITUTION / U.S. BASES / IMMIGRATION = HOT TOPICS: bốn chủ đề có deep emotional layers. Nhiều Nhật không có strong opinion (silent majority); minority có very strong opinion (cả hai phía). Khi friend share, họ thường thuộc minority engaged — calibrate accordingly. (3) RELATIVITY OF FOREIGN OPINION: dù bạn ở Nhật 5 năm, người Nhật vẫn perceive bạn như outside observer. Strong opinion về Nhật politics sometimes nghe rude (như tourist phán nhà chủ). FRAME experiential ('với tư cách người nước ngoài sống ở Nhật') giúp legitimize. (4) DON'T COMPARE NEGATIVELY VS VIETNAM: tránh 'ở VN tốt hơn / xấu hơn'. Comparisons feel competitive. Dùng 'differently' thay 'better/worse'. (5) JAPANESE CONSERVATISM ≠ U.S. CONSERVATISM: spectrum chính trị Nhật khác hẳn Mỹ. Ngay center-left Nhật strict immigration hơn center-right Mỹ. Đừng map onto familiar frames. (6) AGREEMENT PRESSURE IS REAL: friend có thể continue press đồng ý. Bạn KHÔNG cần. Cụm: i-ken wa wakaremasu ga (ý kiến chia rẽ rồi) closes graceful. KHÔNG cần convert. Khác biệt với VN: ở VN bạn bè debate politics over rượu thường nóng, nhưng quan hệ thường survive vì văn hóa expressive forgive bigger; ở Nhật, một harsh political comment có thể end friendship — không recovery vì face damage permanent. Tone matters more than content. Mẹo: nếu chủ đề getting heated, deflect grace: kono hanashi, mata kondo yukkuri shimashou (chủ đề này hôm khác bàn từ tốn). Nhật accept time-out. KHÔNG insist resolve trong cùng buổi. Long-term: learn vài cụm shield: nhom — sou kamo shiremasen ga (có thể vậy nhưng), naruhodo (à ra vậy — neutral acknowledge), watakushi ni wa muzukashii topikku desu (chủ đề này khó với tôi). Last shield: humour. Nếu pressed too hard: politics no hanashi de, biiru ga oishiku naranaku narimashita (chuyện chính trị rồi bia thấy nhạt) — laugh + change subject.",
  tip_advice_vi: "Trước khi tham gia chủ đề chính trị: đánh giá relationship + setting. Quan hệ <6 tháng + workplace setting: politely defer (sou desu ne, watakushi wa amari kuwashiku nai node — em không rành lắm). Quan hệ >1 năm + private setting: có thể engage. KHÔNG engage tại dinner table, family event, work nomikai (drink party) — even nếu được hỏi. Cụm safe defer: ima wa o-shokuji wo tanoshimimashou (giờ thưởng thức bữa ăn đã). Khi engage thật: rule 1, ask first. Listen 70 phần trăm, talk 30 phần trăm. Take notes mentally về reasons họ given. Khi reply: bắt đầu với 1 acknowledgment + 1 personal frame + 1 specific point. KHÔNG list 5 reasons. Một câu well-placed > năm câu rambling. Body language: voice level same, pace SLOW, eye contact 50 phần trăm. Avoid finger-pointing, leaning forward, table tap. Pace + posture signal civility hơn lời. Khi disagreement reach plateau (3-4 exchanges, neither convinced): close graceful. Cụm: rikai ga fukamarimashita. arigatou gozaimasu (em hiểu sâu hơn rồi, cảm ơn). Closing thanks acknowledges they shared, KHÔNG implies bạn agree. After conversation: don't bring up again next meeting. Move on. Nếu họ bring up again, brief acknowledge và pivot. Persistence on disagreement signals rudeness. Long-term: build reputation 'foreigner who can discuss thoughtfully' — bạn Nhật sẽ trust hơn, bring up serious topics more, deeper friendship grow. Biggest mistake: foreigners who 'win' political debate against Japanese friend. Friend then feels ambushed, withdraws future invitations. Goal KHÔNG là win — goal là understand each other deeper. Nếu sau cuộc trò chuyện, bạn HIỂU thêm họ một chút và họ HIỂU thêm bạn một chút, đó là success — dù nobody changed mind. Mẹo cuối: nếu sai (e.g., bạn nói factually wrong), correct yourself sớm: aa, sumimasen, watakushi no rikai ga machigatte imashita (xin lỗi, em hiểu sai). Self-correction = strong sign of integrity, friend respect tăng — KHÔNG giảm.",
  exercises: [
    { type: "fill-blank", question: "立場は違いますが、お考えは___しております。", answer: "尊重" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "まずお考えを聞かせていただいてもよろしいでしょうか", english: "ask their view before stating yours" },
      { japanese: "外国人としての経験から申し上げますと", english: "frame opinion as personal experience, harder to counter" },
      { japanese: "おっしゃっていることは理解できますが", english: "acknowledge before disagreeing" },
      { japanese: "意見が違っても、こうして話せる関係は貴重です", english: "close with affirmation of relationship" }
    ] },
    { type: "translation", vietnamese: "Em nói thẳng — em có cách nhìn hơi khác.", japanese: "正直に申し上げますと、私は少し違う見方をしております。" }
  ]
},
{
  id: 84,
  title: "Comforting a friend after a loss — death of a family member",
  title_vi: "An ủi bạn sau mất mát — qua đời người thân",
  title_en: "Comforting a friend after a loss — death of a family member",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "ご愁傷さま (ごしゅうしょうさま)", english: "my condolences (formal, funeral context)" },
    { japanese: "お悔やみ (おくやみ)", english: "condolences" },
    { japanese: "悲しみ (かなしみ)", english: "sadness / grief" },
    { japanese: "気持ち (きもち)", english: "feeling / mood" },
    { japanese: "寄り添う (よりそう)", english: "to stay close beside / accompany" },
    { japanese: "無理しないで (むりしないで)", english: "don't push yourself" },
    { japanese: "支える (ささえる)", english: "to support" },
    { japanese: "言葉が見つからない (ことばがみつからない)", english: "I can't find the words" },
    { japanese: "そっと", english: "softly / quietly" },
    { japanese: "回復 (かいふく)", english: "recovery" }
  ],
  examples: [
    { japanese: "この度は、心よりお悔やみ申し上げます。", english: "My deepest condolences at this time." },
    { japanese: "なんとお声をかけていいか、言葉が見つかりません。", english: "I cannot find the right words to say." },
    { japanese: "無理せず、ご自分の気持ちを大切になさってください。", english: "Don't push yourself; please honor your own feelings." },
    { japanese: "私で良ければ、いつでもそばにおります。", english: "If I'm of any help, I'm here for you anytime." },
    { japanese: "今は何もしなくて大丈夫です。ただ、ここにおります。", english: "Right now you don't have to do anything. I'm just here." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "この度は、本当に...言葉になりません。心よりお悔やみ申し上げます。", english: "About this... I can't put it into words. My deepest condolences." },
    { speaker: "友人", japanese: "ありがとう。来てくれて、本当に助かる。", english: "Thank you. You came — it really helps." },
    { speaker: "チャウ", japanese: "話したいときも、話さなくていいときも、私はここにいます。", english: "Whether you want to talk or not, I'll be here." },
    { speaker: "友人", japanese: "今は、ただ誰かそばにいてくれるだけで、ありがたい。", english: "Right now, just having someone close — that's a help." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "(玄関にて、静かに) 連絡を受けて、すぐに伺いました。この度は、本当に、言葉が見つかりません。心よりお悔やみ申し上げます。", english: "(at the entrance, quietly) I came as soon as I heard. About this — I truly cannot find the words. My deepest condolences." },
    { speaker: "友人", japanese: "チャウさん...ありがとう。入って。", english: "Chau... thank you. Come in." },
    { speaker: "チャウ", japanese: "失礼します。何かお持ちした方がよかったのですが、急なことで。", english: "Excuse me. I should have brought something, but it was so sudden." },
    { speaker: "友人", japanese: "気にしないで。来てくれただけで十分よ。", english: "Don't worry. Just coming is enough." },
    { speaker: "チャウ", japanese: "(部屋に座って、しばらく沈黙) ...お父さま、突然のことだったと聞きました。", english: "(sits in the room, silence for a while) ...I heard about your father — that it was sudden." },
    { speaker: "友人", japanese: "うん。先週まで普通に話していたのに。まだ実感がわかなくて。", english: "Yeah. Last week we were talking normally. It still doesn't feel real." },
    { speaker: "チャウ", japanese: "お気持ち、想像することもできません。ただ、無理にお話しいただかなくて大丈夫です。", english: "I can't even imagine how you feel. Please — you don't have to force yourself to talk." },
    { speaker: "友人", japanese: "ありがとう。でも、誰かに話したい気持ちもあって。", english: "Thanks. But part of me wants to talk to someone too." },
    { speaker: "チャウ", japanese: "もちろんです。話したいだけ、お聞きします。", english: "Of course. I'll listen for as long as you want to talk." },
    { speaker: "友人", japanese: "父はね、最後まで仕事のことを気にしていたの。会社に迷惑かけないかって。最後の言葉が、母じゃなくて、職場のことだったの。", english: "Dad — until the end, he was worried about work. Whether he'd cause trouble for the company. His last words weren't to mom — they were about the workplace." },
    { speaker: "チャウ", japanese: "...そうでしたか。それは、お父さまらしいご性格だったのでしょうね。", english: "...I see. That sounds like the kind of person your father was." },
    { speaker: "友人", japanese: "うん。最後まで、人のことを考える人だった。", english: "Yeah. Until the end, he thought about others." },
    { speaker: "チャウ", japanese: "(少し間を置いて) お父さまの生き方、誰かに話せる方がいるとしたら、それも大切な追悼かと存じます。", english: "(after a pause) Your father's way of living — if there's someone you can tell about it, that too is a precious form of remembering." },
    { speaker: "友人", japanese: "ありがとう。チャウさんに話せてよかった。", english: "Thank you. I'm glad I could tell you." },
    { speaker: "チャウ", japanese: "これから、お通夜やお葬式の準備で大変な日々が続くかと思います。何かお手伝いできることがあれば、いつでも遠慮なくおっしゃってください。買い物、食事の用意、お子さまの送り迎え、何でも構いません。", english: "From now, the wake and funeral preparations will keep you busy. If there's anything I can help with — shopping, meals, picking up your kids — anything, please don't hesitate." },
    { speaker: "友人", japanese: "本当にありがとう。たぶん、来週、お願いしたいことが出てくると思う。", english: "Thank you truly. Probably next week, things I'll need help with will come up." },
    { speaker: "チャウ", japanese: "はい、いつでもお声がけください。今夜は、ゆっくり休まれてください。睡眠だけでも、少しでも取れるよう願っております。", english: "Yes, please reach out anytime. Tonight — please rest slowly. Even just sleep, I hope you can get a little." },
    { speaker: "友人", japanese: "うん、頑張ってみる。来てくれて、本当にありがとう。", english: "Yeah, I'll try. Thank you so much for coming." },
    { speaker: "チャウ", japanese: "また明日、メッセージを送らせていただきます。返信は不要ですので、ご自分のペースでお過ごしください。", english: "I'll send a message tomorrow. No need to reply — please go at your own pace." }
  ],
  roleplay_prompts: [
    "Bạn đang đến nhà bạn Nhật vừa mất ba. Tại cửa, bạn cần CHÀO không quá tươi (joy = inappropriate) cũng KHÔNG quá lệ (drama = burden cho bạn). Cụm: kono tabi wa, makoto ni go-shuushou-sama de gozaimasu cộng cúi đầu nhẹ. KHÔNG ôm, KHÔNG nắm tay (Nhật ít physical touch even ở moments emotional này).",
    "Vào phòng, bạn ngồi xuống. Bạn của bạn có thể nói hoặc lặng thinh. Hãy KHÔNG chủ động hỏi 'do you want to talk' — đó là pressure. Đợi. Nếu họ nói, lắng nghe. Nếu họ im, ngồi với họ trong im lặng. Cụm khi cần phá im lặng: muri ni o-hanashi itadakanakute daijoubu desu (không cần cố nói).",
    "Bạn của bạn share một kỷ niệm về người mất (e.g., câu nói cuối, một đặc điểm tính cách). Hãy KHÔNG immediately reply 'I understand' — chưa hiểu được. Cụm: sou deshita ka cộng pause cộng o-tou-sama rashii go-seikaku datta no deshou ne (chắc đó là tính cách của ba). Reflect lại điều họ said, KHÔNG generic comfort."
  ],
  register_notes: "An ủi sau mất mát ở Nhật khác hẳn nhiều văn hóa. Mục tiêu KHÔNG là cheer them up — là 寄り添う (yorisou, ngồi cạnh). Năm patterns: (1) USE 申し上げる FORMS: condolences dùng formal gozaimasu / moushiagemasu — không casual. Cụm chuẩn: kono tabi wa, makoto ni go-shuushou-sama de gozaimasu (lần này, thực sự xin chia buồn). KHÔNG dùng 'sumimasen' (sorry) — đó là apology, không phải condolence. (2) AVOID 大変 IN OPENING: nhiều người nước ngoài say 'taihen desu ne' (it must be hard). Trong context tử thi, sounds dismissive — minimize their grief. Tránh. Dùng 'go-shinpai no koto to omoimasu' (you must be worried/troubled) hoặc 'osasshi shimasu' (I imagine deeply). (3) FUNERAL VOCABULARY: お通夜 (otsuya, wake), お葬式 (osoushiki, funeral), 告別式 (kokubetsushiki, farewell ceremony), 香典 (kouden, condolence money), 喪主 (moshu, chief mourner). Biết minimum để không hỏi kỳ. Kouden ~5,000-10,000 yen for friend, in special envelope (不祝儀袋, bushuugibukuro). (4) NEVER SAY '元気を出して': Western 'cheer up' direct translation = genki wo dashite. Trong grief context Nhật = sounds like they shouldn't grieve. Tránh. Dùng: muri sezu, go-jibun no kimochi wo taisetsu ni nasatte kudasai (đừng cố, hãy quý trọng cảm xúc của bạn). (5) PRACTICAL HELP > EMOTIONAL WORDS: lời nhiều nhiều khi vô dụng. Offer concrete: cooking, kid pickup, errand, paperwork help. Cụm: gohan no junbi, kaimono nado, dou ka go-enryo naku. Practical help = thật sự chia tải. // TODO native review — sou deshita ka after share phrasing — alternative oshatte iru go-kimochi wakarimasu KHÔNG nên dùng (claim hiểu when bạn không thật sự hiểu — sounds presumptuous). Native reviewer suggested 'sou de gozaimashita ka' as more reverent variant.",
  idiom_glosses: [
    { idiom: "寄り添う", literal: "Đứng/ngồi sát bên", meaning: "Khái niệm Nhật về an ủi: không cố sửa, chỉ ở bên. Cốt lõi văn hóa grief support.", example: "言葉ではなく、ただ寄り添うだけで十分なときもございます。" },
    { idiom: "故人を偲ぶ", literal: "Tưởng nhớ người quá cố", meaning: "Cụm formal cho 'remembering the deceased' — dùng tại funeral, anniversary, conversation về người mất.", example: "お父さまを偲びながら、これからもご家族で支え合っていただければと存じます。" },
    { idiom: "時が薬", literal: "Thời gian là thuốc", meaning: "Thời gian chữa lành — phù hợp khi nói về quá trình hồi phục dần dần, KHÔNG quick fix.", example: "時が薬と申しますが、無理なさらず、少しずつで構いません。" },
    { idiom: "ご冥福をお祈りいたします", literal: "Cầu nguyện cho an nghỉ ở thế giới bên kia", meaning: "Cụm chuẩn cho condolence cards, formal expressions. Phật giáo origin nhưng dùng broadly.", example: "心よりご冥福をお祈りいたします。" }
  ],
  cultural_notes_vi: "Văn hóa tang lễ Nhật khác VN ở 7 điểm. (1) NOTIFICATION TIMING: bạn có thể được thông báo qua SMS/LINE, không call. Đáp ngay với short message: kono tabi wa, makoto ni go-shuushou-sama desu. Sugu ni go-renraku itadaki, arigatou gozaimasu. Sau đó, ask về otsuya (wake) timing. (2) OTSUYA VS OSOUSHIKI: otsuya thường tối ngày sau passing (or sau several ngày nếu prep). Osoushiki ngày sau. Friends thường attend otsuya, not osoushiki (osoushiki cho close family + formal acquaintances). Confirm với chief mourner (or via họ family member). (3) DRESS CODE: black mourning suit/dress (喪服, mofuku). Black tie cho nam. Black or pearl earrings only cho nữ. KHÔNG colored jewelry, KHÔNG bright watch. White shirt only. Closed-toe black shoes. Không có outfit này: black formal wear acceptable as substitute, never colored. (4) KOUDEN: condolence money in special black-and-white envelope (不祝儀袋, bushuugibukuro available at convenience store, write 御霊前 (go-reizen) or 御香典 (go-kouden) trên outside). Amount varies by relationship: friend 5,000-10,000 yen; close friend 10,000-30,000 yen; coworker 3,000-5,000 yen. New bills KHÔNG used (only old bills, opposite of wedding). (5) CEREMONIAL ACTIONS: tại otsuya/osoushiki, bạn sẽ 焼香 (shoukou, incense offering). Steps: bow to family (1 cúi), bow to deceased's photo (1 cúi), pinch incense powder, raise to forehead (depending sect 1-3 times), drop in burner, hands together prayer, bow again. Watch person trước bạn nếu unsure — copy. (6) NO PHOTOS: tại funeral home, KHÔNG photo. KHÔNG video. Phone silent always. (7) POST-FUNERAL FOOD: nhiều nơi serve light meal (otoki) sau ceremony. Eat modestly, KHÔNG drink heavily even if alcohol available. Khác biệt với VN: ở VN funeral có thể có cười nói chia sẻ kỷ niệm; Nhật funerals quiet, somber, formal throughout. Speech only when invited. Mẹo: nếu bạn không thể attend (out of country, work emergency), gửi telegram (弔電, chouden) qua post office hoặc online — service tới in vài giờ. Plus follow-up handwritten condolence note. KHÔNG chỉ text. Long-term: 49 ngày sau (49日, shijuukunichi) là ceremony quan trọng — Buddhist belief soul transitions. Reach out around then with brief message. Sau đó, anniversary (一周忌, isshuuki) ngày 1 năm — small reach-out OK. Tránh major holidays (Obon, year-end) for grief check-in — quá heavy load thời gian đó. Chọn ordinary morning, simple message: o-genki ni o-sugoshi desu ka (mong bạn ổn).",
  tip_advice_vi: "Khi nghe tin: respond NGAY (within 30 phút nếu awake). Short message OK. Cụm: kono tabi wa, makoto ni go-shuushou-sama desu. nani ka watakushi ni dekiru koto ga areba, dou ka o-mooshitsuke kudasai (xin chia buồn sâu sắc, có việc gì giúp được xin nói). Then: ask về otsuya / osoushiki timing + location, mà KHÔNG hỏi cause of death (nhạy cảm — họ tell nếu họ muốn). Trước khi đi: prepare kouden (condolence money) — convenience store có envelope. Pre-write outside (浄土真宗 use 御仏前, others use 御霊前 — ask shop staff if unsure). Inside, write your full name + amount in clean handwriting. Black ink only. Bring: kouden, business cards (some funeral receivers collect for thank-you list), simple black bag. KHÔNG bring flowers (family handles arrangement) unless explicitly asked. KHÔNG bring food. Tại địa điểm: arrive 10-15 phút sớm. Sign register (会葬御芳名, kaisou go-houmei) carefully — your name + address. Follow staff direction. Trong ceremony: phone silent. Sit quietly. Cry OK but KHÔNG audible sobbing. Khi 焼香: stand calmly, walk slowly, don't fumble. After ceremony: brief condolence to family. Cụm at receiving line: kono tabi wa, makoto ni go-shuushou-sama de gozaimasu cộng cúi 30 độ. KHÔNG long conversation. Family overwhelmed. Sau funeral: send card 1-2 weeks sau với handwritten note. Brief: simple thanks for being included, brief memory of deceased nếu bạn met them, offer continued support. KHÔNG long letter — adds emotional load. Visit friend riêng 2-3 weeks sau — alone time, casual, KHÔNG mention loss directly unless họ bring up. Bring small gift (food, simple practical item). Cụm khi gặp: o-tsukare-sama desu cộng o-genki ni o-sugoshi desu ka. Listen if họ want to talk. Long-term: anniversary remember. Ngày 1 tháng (月命日, tsukimeinichi), ngày 49日, 1 năm (一周忌) — brief message OK. KHÔNG forget completely — that hurts more than awkward acknowledgment. Mẹo cuối: nếu bạn lose someone of your own during this time và bạn cần support, vẫn reach out to your friend who lost — sharing parallel grief actually helps both. Cụm: watakushi mo saikin... (em cũng gần đây...) cộng share briefly. Mutual grief = mutual support.",
  exercises: [
    { type: "fill-blank", question: "この度は、心よりお___申し上げます。", answer: "悔やみ" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "言葉が見つかりません", english: "honest acknowledgment that no words fit (not silence)" },
      { japanese: "無理せず、ご自分のペースで", english: "release pressure to perform recovery" },
      { japanese: "私で良ければ、いつでもそばにおります", english: "offer presence without conditions" },
      { japanese: "お父さまらしいご性格", english: "reflect deceased's character — affirms their life" }
    ] },
    { type: "translation", vietnamese: "Lúc này không cần làm gì cả — em chỉ ở đây thôi.", japanese: "今は何もしなくて大丈夫です。ただ、ここにおります。" }
  ]
},
{
  id: 85,
  title: "Apologizing for a serious mistake — repairing a friendship",
  title_vi: "Xin lỗi vì sai lầm nghiêm trọng — hàn gắn tình bạn",
  title_en: "Apologizing for a serious mistake — repairing a friendship",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "お詫び (おわび)", english: "apology (formal noun)" },
    { japanese: "申し訳ない (もうしわけない)", english: "inexcusable / I'm so sorry" },
    { japanese: "反省 (はんせい)", english: "self-reflection / accountability" },
    { japanese: "責任 (せきにん)", english: "responsibility" },
    { japanese: "言い訳 (いいわけ)", english: "excuse" },
    { japanese: "信頼 (しんらい)", english: "trust" },
    { japanese: "裏切る (うらぎる)", english: "to betray" },
    { japanese: "取り戻す (とりもどす)", english: "to recover / regain" },
    { japanese: "誠意 (せいい)", english: "sincerity" },
    { japanese: "二度と (にどと)", english: "never again" }
  ],
  examples: [
    { japanese: "今回の件、本当に申し訳ございませんでした。", english: "About this matter — I am truly sorry." },
    { japanese: "言い訳はいたしません。すべて私の責任です。", english: "I won't make excuses. The responsibility is entirely mine." },
    { japanese: "どうお詫びしてよいか、言葉が見つかりません。", english: "I don't know how to apologize — I can't find the words." },
    { japanese: "二度とこのようなことを繰り返さぬよう、深く反省しております。", english: "I am deeply reflecting so this never happens again." },
    { japanese: "信頼を取り戻せるよう、誠意を持って向き合ってまいります。", english: "I'll face this with sincerity so that I can earn back your trust." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "今日はお時間いただいて、ありがとうございます。先日の件で、直接お詫びがしたくて参りました。", english: "Thank you for the time today. I came in person to apologize for the other day." },
    { speaker: "友人", japanese: "うん、座って。", english: "Mm, sit down." },
    { speaker: "チャウ", japanese: "本当に申し訳ございませんでした。言い訳のしようもありません。", english: "I am truly sorry. There's no excuse I can offer." },
    { speaker: "友人", japanese: "正直、傷ついた。でも、来てくれたこと、まずは聞かせて。", english: "Honestly, I was hurt. But — first, you came. Let me hear you." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "今日は急にお時間をいただいて、本当にありがとうございます。", english: "Thank you for making time on short notice today." },
    { speaker: "友人", japanese: "うん。何度かメッセージが来てたから、会わなきゃとは思ってた。座って。", english: "Mm. You'd messaged a few times, so I thought we should meet. Sit." },
    { speaker: "チャウ", japanese: "(深く頭を下げて) 先日の私の発言、本当に申し訳ございませんでした。あなたを傷つけてしまいました。", english: "(bows deeply) My remark the other day — I am truly sorry. I hurt you." },
    { speaker: "友人", japanese: "頭、上げて。話しましょう。", english: "Raise your head. Let's talk." },
    { speaker: "チャウ", japanese: "ありがとうございます。あの場で、私はあなたの仕事のことについて、軽い気持ちで話してしまいました。他の方の前で、しかも、あなたの努力を知らないかのように。本当にひどいことをしました。", english: "Thank you. At that moment, I spoke about your work lightly. In front of others, as if I didn't know your efforts. I did something truly awful." },
    { speaker: "友人", japanese: "...あの場で、何で言ったの? 普段のチャウさんと違ったから、私もびっくりしてた。", english: "...why did you say it there? It wasn't like the Chau I know — I was startled." },
    { speaker: "チャウ", japanese: "言い訳になりますので、長くは申しません。ただ、当日、私自身、別の場所で叱られたばかりで、気持ちが乱れておりまして。それを、あろうことか、あなたに向けてしまいました。完全に私の弱さです。", english: "It would be an excuse, so I won't go on. But that day, I had just been scolded elsewhere, and my emotions were disturbed. I — unforgivably — directed it at you. Entirely my own weakness." },
    { speaker: "友人", japanese: "そうだったんだ。でも、それを聞いたから許せるとは限らないよ。", english: "I see. But hearing that doesn't necessarily mean I can forgive." },
    { speaker: "チャウ", japanese: "おっしゃる通りでございます。理解いただきたくてお話ししたわけではございません。理由は、私の責任を軽くするものではございません。", english: "You're absolutely right. I'm not telling you in order to be understood. The reason doesn't lighten my responsibility." },
    { speaker: "友人", japanese: "うん。それを、最初から、わかっててくれてるなら、話せる。", english: "Mm. If you understand that from the start, then I can talk." },
    { speaker: "チャウ", japanese: "あなたが受けた痛みを、完全には想像できないかと思います。ただ、私自身、過去に同じような扱いを受けた経験がございますので、少しでも近づけたいと思っております。あの日以来、毎日、自分の発言を振り返っております。", english: "I don't think I can fully imagine the pain you felt. But I myself have experienced something similar in the past, so I want to come even a little closer to understanding. Since that day, I've reviewed my own words every day." },
    { speaker: "友人", japanese: "私が一番つらかったのは、信頼してた人だったから、ってこと。", english: "What hurt me most was that it was someone I trusted." },
    { speaker: "チャウ", japanese: "...そうですよね。信頼を裏切ってしまいました。それが、最も深い罪かと存じます。", english: "...yes. I betrayed your trust. That, I believe, is the deepest fault." },
    { speaker: "友人", japanese: "言葉だけだったら、たぶん、もうチャウさんとは距離を置いてた。来てくれたから、話してる。", english: "If it had only been words, I'd probably already have distanced myself. You came — that's why we're talking." },
    { speaker: "チャウ", japanese: "ありがとうございます。今日、お許しをいただきたいというお願いはいたしません。それは、私が決めることではございません。ただ、私としてできることをお伝えしたく存じます。", english: "Thank you. I won't ask for forgiveness today. That isn't for me to decide. But I'd like to share what I can do." },
    { speaker: "友人", japanese: "うん、聞かせて。", english: "Yes, tell me." },
    { speaker: "チャウ", japanese: "あの場にいた方々に、後日、私の発言が不当だったことをお伝えします。あなたが補修する必要のないようにしたく存じます。それから、二度とあのような場面で誰かを軽んじる発言をしないよう、自分に約束いたしました。それでも、許せないと感じられたら、それも当然のことかと存じます。", english: "I'll tell those who were there, later, that my remark was unjust. I want to make sure you don't have to repair anything. And I've promised myself never to make a remark belittling anyone in such a setting again. Even so — if you feel you can't forgive me, that, too, is natural." },
    { speaker: "友人", japanese: "...わかった。今日のところは、それでいい。時間が必要かもしれないけど、また話せると思う。", english: "...all right. For today, that's enough. I may need time, but I think we can talk again." },
    { speaker: "チャウ", japanese: "ありがとうございます。いつでも、ご連絡をお待ちしております。私から催促することはいたしません。", english: "Thank you. I'll await contact whenever. I won't push from my side." }
  ],
  roleplay_prompts: [
    "Đóng vai bạn ngồi xuống trước người bạn Nhật bạn đã làm tổn thương. Bạn cần OPEN với deep apology — KHÔNG explanation trước, KHÔNG context. Cụm: makoto ni moushiwake gozaimasen deshita cộng cúi 30-45 độ. Đợi họ phản ứng. KHÔNG lift head until họ said 'atama wo agete' (nâng đầu lên).",
    "Bạn đưa lý do (tâm trạng rối, vừa bị mắng nơi khác). Hãy KHÔNG dùng lý do để excuse — frame như explanation MÀ đồng thời accept là không xóa được lỗi. Cụm: iiwake ni narimasu node, nagaku wa moushimasen cộng riyuu wa, watakushi no sekinin wo karuku suru mono dewa gozaimasen.",
    "Bạn KHÔNG ask forgiveness today. Hãy show concrete actions bạn sẽ làm — KHÔNG vague promises. Cụm: o-yurushi wo itadakitai to iu o-negai wa itashimasen. Liệt kê 2-3 việc cụ thể (e.g., correct misinformation với nhóm, change behavior pattern). Frame như bạn earn trust trở lại, KHÔNG demand it."
  ],
  register_notes: "Apology nghiêm trọng ở Nhật là craft. Năm patterns: (1) BOW DEPTH SIGNALS DEPTH: 15 độ = light apology (bumping into someone); 30 độ = medium (forgetting appointment); 45 độ = deep (hurt feelings, broken trust); 90 độ + holding 5 giây = serious wrongdoing. KHÔNG over-bow — 90 độ for forgotten lunch sounds melodramatic. Friend-level deep apology = 30-45 độ, hold 3-5 giây. (2) APOLOGY VERB STAGE: makoto ni moushiwake gozaimasen deshita (truly inexcusable) > moushiwake gozaimasen (apologetic) > sumimasen deshita (sorry — too light for serious). For meaningful break, dùng moushiwake gozaimasen deshita stage. (3) NO EXCUSE BEFORE APOLOGY: cardinal rule. KHÔNG 'I'm sorry but...' Open với apology raw. Reason ONLY if asked, AFTER apology accepted at least partially. Even then, frame: iiwake ni narimasu ga (this will become an excuse). Acknowledging excuse-status preempts criticism. (4) ACCOUNTABILITY OWNS THE FAULT: KHÔNG say 'misunderstanding' (gokai), 'I didn't mean it' (sou iu tsumori dewa nakatta) — sounds như deflecting. Use: subete watakushi no sekinin desu (entirely my responsibility). Even if shared blame realistic, in apology moment, take 100 phần trăm. (5) DON'T DEMAND FORGIVENESS: 'I hope you can forgive me' = subtle pressure. Better: o-yurushi wo itadakitai to iu o-negai wa itashimasen. sore wa, watakushi ga kimeru koto dewa gozaimasen (I'm not asking for forgiveness — that isn't mine to decide). Releases pressure, paradoxically increases forgiveness chance. // TODO native review — ano hi no hatsugen phrasing — alternative ano toki no kotoba feels more relational; native reviewers split on whether 'fukaku hansei shite orimasu' sounds sincere or formulaic in friend context — context-dependent.",
  idiom_glosses: [
    { idiom: "覆水盆に返らず", literal: "Nước đổ không thể về khay", meaning: "Việc đã làm không thể hoàn lại — phù hợp acknowledge mistake không thể undo, chỉ làm gì đó từ đây trở đi.", example: "覆水盆に返らずと申しますが、これからの行動でお返しできればと存じます。" },
    { idiom: "禊を済ます", literal: "Hoàn thành lễ tẩy uế", meaning: "Trong context apology, frame act of apology như ritual cleansing — không erase error, mà mark willingness to begin again.", example: "今日のお詫びで全てが済むとは思っておりません。これは始まりに過ぎません。" },
    { idiom: "立つ鳥跡を濁さず", literal: "Chim bay đi không làm đục nước", meaning: "Đi mà không để lại vết bẩn — phù hợp frame commitment không tái phạm, để lại quan hệ sạch.", example: "立つ鳥跡を濁さずと申しますし、今後は一切、同じ過ちを繰り返さぬよう努めます。" },
    { idiom: "誠心誠意", literal: "Hết lòng hết dạ", meaning: "Cụm 4 chữ về sincerity tuyệt đối — nhấn rằng apology không formality.", example: "誠心誠意、向き合わせていただきます。" }
  ],
  cultural_notes_vi: "Apology văn hóa Nhật khác VN ở 7 điểm. (1) APOLOGY = ACT, NOT WORD: Nhật phân biệt 言葉のお詫び (lời apology) vs 行動のお詫び (apology bằng hành động). Word alone không đủ for serious wrong. Action: in-person visit, gift (omiyage), follow-up commitment, behavior change. Foreigners thường stop at words — Nhật wait for action. (2) IN-PERSON > MESSAGE: serious apology phải in-person. Text/call đầu OK để request meeting, KHÔNG là apology itself. Nếu khoảng cách lớn (overseas), video call > text. (3) GIFT IF APPROPRIATE: cho serious apology, mang omiyage nhỏ — KHÔNG expensive (sounds như bribe). Một hộp wagashi (Japanese sweets, 2,000-3,000 yen), một chai sake nice (3,000-5,000 yen). Wrap trong simple paper, white not flashy. Present after apology accepted, KHÔNG before. (4) TIME GAP MATTERS: apology 1-2 ngày after offense better than 1 tuần. Delay = perceived indifference. Nếu cần time để cool down (yours), brief acknowledgment + request meeting trong 48 hours: hansei shite orimasu. mou sukoshi shitara, jikan wo itadaitemo yoroshii deshou ka (đang reflecting, sau ít hôm xin được thời gian). (5) WITNESS MATTERS: nếu offense was public, apology nên có public component (correction in same group, public retraction). Nếu offense private, apology stay private. Mismatch = noted as awkward. (6) DOGEZA IS RARE: 土下座 (full prostration) extreme apology — appropriate for major wrongs (financial damage, public dishonor). KHÔNG cho friend hurt feelings. Over-doing đó = melodrama, friend uncomfortable. (7) FORGIVENESS NOT GUARANTEED: dù apology perfect, friend có thể không forgive. Accept gracefully. Cụm: o-yurushi itadakenakute mo, sore mo touzen no koto kato zonjimasu (dù không được tha thứ, đó cũng tự nhiên). Don't double down. Khác biệt với VN: ở VN apology thường over-emotional, immediate makeup, nhanh chóng moving on; Nhật apology measured, formal, KHÔNG rush. Process slow, but resolution thường stronger. Mẹo: practice apology speech 1-2 lần before delivery. Ghi out keypoints: (a) what bạn did, (b) what consequence, (c) what bạn understand of their pain, (d) what bạn'll do từ đây, (e) bạn không expect forgiveness today. Năm phần này, mỗi phần 2-3 câu. Total ~5 phút. Long-term: friend recovery takes 3-6 tháng even sau perfect apology. Patient. Don't withdraw if họ cool. Don't push if họ silent. Just stay available. Most relationships heal nếu offender stays consistent.",
  tip_advice_vi: "Khi nhận ra mình sai: STOP làm anything else cho đến khi address. Reach out within 24 hours với short message: senjitsu no ken de, chokusetsu o-wabi sasete itadakitaku zonjimasu. o-jikan, kyousei shite mo yoroshii deshou ka (về việc hôm trước, em xin được trực tiếp xin lỗi — xin được thời gian). KHÔNG include apology trong text — save for in-person. Họ có thể respond cool hoặc delay — accept. Khi họ agree to meet: chọn neutral location (cafe, restaurant private corner, KHÔNG bar — alcohol làm conversation messy). Arrive 10 phút sớm. Wear neat clean clothing — KHÔNG flashy, KHÔNG sloppy. KHÔNG smell of alcohol. Cell phone silent. Bring small gift (3,000-5,000 yen) wrapped simple, ready to present at end. Khi gặp: don't hug, don't physical touch. Bow at greeting. Find seat. Order drinks if cafe — water OK. Khi sit down: đợi họ settle. KHÔNG dive in. Cụm khi ready: kyou wa, o-jikan wo itadaki, makoto ni arigatou gozaimasu cộng deep bow 30-45 độ. Hold 3 giây. Then start apology. Apology structure: (a) acknowledge what happened — concrete (KHÔNG 'what I did wrong' — say SPECIFIC: 'when I said X in front of Y'). (b) acknowledge their pain — KHÔNG 'sorry if you were hurt' (conditional = excuse). Say: 'anata wo kizutsukete shimaimashita' (I hurt you). (c) accept responsibility — entirely yours. (d) explain only if asked, briefly. (e) state actions you'll take. (f) explicitly release them from forgiveness obligation. Total 3-5 phút. Speak slowly, voice low, eye contact 50 phần trăm — too much = pressuring, too little = evasive. Pauses OK — let them process. Khi họ respond: LISTEN FULLY. Don't defend. Don't add. Just absorb. If họ cry, hand tissue silently, KHÔNG hug. If họ angry, accept the anger — Cụm: sou iwarete touzen desu (you're right to say that). If họ silent long, accept: ima, kotoba ga nai no mo touzen kato (silence is natural now too). Closing the meeting: don't ask for forgiveness verdict. Cụm: kyou wa, kiite itadaki, arigatou gozaimasu. mata, dou ka go-renraku no oki ni meshimase (thank you for listening today; please contact me at your convenience). Stand, bow again, leave. Don't look back at door. After meeting: send brief follow-up message within 24 hours. KHÔNG repeat apology. Brief: kyou wa, o-jikan wo itadaki, arigatou gozaimashita. go-renraku, o-machi shite orimasu. Then SILENCE. Don't message again. Don't post on social media. Wait. Họ contact bạn when ready — could be 1 week, 1 month, 6 months. Honor their pace. Long-term: nếu họ resume contact gradual, follow their lead. KHÔNG act like nothing happened (sounds dismissive). KHÔNG dwell on past offense (guilt-burden). Move forward but reference khi appropriate: ano koto wo wasurete imasen (I haven't forgotten that). Mẹo cuối: nếu họ KHÔNG resume contact in 6 months, accept it. Một final message OK: o-genki ni o-sugoshi de irassharu koto wo, negatte orimasu (wishing you well). Then truly let go. Some relationships don't recover. That's a lesson, not a failure.",
  exercises: [
    { type: "fill-blank", question: "言い訳はいたしません。すべて私の___です。", answer: "責任" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "誠に申し訳ございませんでした", english: "deepest formal apology — used for serious offenses" },
      { japanese: "言い訳になりますので、長くは申しません", english: "preempt excuse-status when giving context" },
      { japanese: "信頼を取り戻せるよう", english: "frame goal as earning back trust, not demanding forgiveness" },
      { japanese: "お許しいただけなくても、当然のことかと", english: "release the other person from forgiveness pressure" }
    ] },
    { type: "translation", vietnamese: "Em không xin tha thứ — đó không phải điều em quyết được.", japanese: "お許しをいただきたいというお願いはいたしません。それは私が決めることではございません。" }
  ]
},
{
  id: 86,
  title: "Saying goodbye permanently — friend moving away, end of a relationship",
  title_vi: "Lời tạm biệt vĩnh viễn — bạn chuyển đi xa, kết thúc một mối quan hệ",
  title_en: "Saying goodbye permanently — friend moving away, end of a relationship",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "別れ (わかれ)", english: "parting / farewell" },
    { japanese: "再会 (さいかい)", english: "reunion" },
    { japanese: "思い出 (おもいで)", english: "memory" },
    { japanese: "感謝 (かんしゃ)", english: "gratitude" },
    { japanese: "寂しい (さびしい)", english: "lonely / wistful" },
    { japanese: "縁 (えん)", english: "fate / connection" },
    { japanese: "見送る (みおくる)", english: "to see (someone) off" },
    { japanese: "前向き (まえむき)", english: "forward-looking / positive" },
    { japanese: "新しい門出 (あたらしいかどで)", english: "new departure (for someone starting over)" },
    { japanese: "心の中 (こころのなか)", english: "in one's heart" }
  ],
  examples: [
    { japanese: "今日まで、本当にありがとうございました。", english: "Until today — truly thank you." },
    { japanese: "離れていても、心の中ではいつもつながっております。", english: "Even apart, in our hearts we'll always be connected." },
    { japanese: "一緒に過ごした日々は、私の宝物でございます。", english: "The days we spent together are my treasure." },
    { japanese: "新しい門出に、心からエールを送らせていただきます。", english: "I send my heartfelt cheer for your new departure." },
    { japanese: "またいつか、どこかでお会いできる日を楽しみにしております。", english: "I look forward to the day we meet again, somewhere, sometime." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "本当に、明日出発なんですね。", english: "You're really leaving tomorrow." },
    { speaker: "友人", japanese: "うん。長かったような、短かったような。", english: "Yeah. Felt long, felt short." },
    { speaker: "チャウ", japanese: "今日まで、本当にありがとうございました。あなたと過ごした時間は、私の宝物です。", english: "Until today — thank you truly. The time with you is my treasure." },
    { speaker: "友人", japanese: "こちらこそ。離れても、つながっていようね。", english: "Same here. Even apart, let's stay connected." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "(送別の食事の席にて) 今日は、お時間を作っていただいて、本当にありがとうございます。", english: "(at a farewell meal) Thank you for making time today." },
    { speaker: "友人", japanese: "むしろ、こちらこそ。チャウさんが企画してくれて嬉しい。", english: "I should thank you. I'm glad you arranged this." },
    { speaker: "チャウ", japanese: "明日、いよいよドイツに発たれるんですね。実感がまだ湧きません。", english: "Tomorrow you really leave for Germany. It hasn't sunk in." },
    { speaker: "友人", japanese: "私もまだ。荷物は全部送ったのに、なんだか夢みたい。", english: "Me neither. All my things are shipped, but it feels like a dream." },
    { speaker: "チャウ", japanese: "三年前、初めてお会いしたとき、まさかこんな深い友達になれるとは思ってもいませんでした。", english: "Three years ago when we first met, I never thought we'd become such close friends." },
    { speaker: "友人", japanese: "私も。日本語の教室で、隣の席だっただけだったのにね。", english: "Me too. We were just neighbors in Japanese class." },
    { speaker: "チャウ", japanese: "あの頃、私はまだ日本語が拙くて、よく助けていただきました。あなたが教えてくださった「察する」という言葉、今でも忘れません。", english: "Back then my Japanese was clumsy; you helped me often. The word 'sassuru' you taught me — I still haven't forgotten." },
    { speaker: "友人", japanese: "覚えてたんだ。あれは、私が「察すること、難しい」って言った日だったよね。", english: "You remembered. That was the day I said 'reading the unsaid is hard,' wasn't it." },
    { speaker: "チャウ", japanese: "そうです。あの言葉から、文化を超えた心の通い方を学ばせていただきました。", english: "Yes. From that word, I learned a way hearts connect across cultures." },
    { speaker: "友人", japanese: "嬉しい。そう言ってもらえると、私もこの三年、無駄じゃなかったと思える。", english: "I'm glad. Hearing that, I feel these three years weren't wasted." },
    { speaker: "チャウ", japanese: "無駄なんて、とんでもございません。あなたが私の人生に与えてくださったものは、計り知れません。", english: "Wasted? Far from it. What you've given my life is immeasurable." },
    { speaker: "友人", japanese: "ありがとう。チャウさんも、私にいっぱいくれた。日本にいる外国人としての視点、私の視野を広げてくれた。", english: "Thank you. You gave me a lot too. The view of a foreigner in Japan widened mine." },
    { speaker: "チャウ", japanese: "(少し沈黙) ドイツに行かれて、お元気でいてください。", english: "(brief silence) In Germany — please stay well." },
    { speaker: "友人", japanese: "うん。チャウさんも。家族のこと、大切にね。", english: "Mm. You too. Take care of your family." },
    { speaker: "チャウ", japanese: "離れていても、心の中では、いつもつながっております。私にとって、あなたとの縁は一生のものです。", english: "Even apart, in my heart we'll always be connected. For me, our connection is for life." },
    { speaker: "友人", japanese: "私もそう思う。一年に一回、メッセージじゃなくて、ちゃんと電話しよう。声を聞こう。", english: "I feel the same. Once a year, not just a message — let's actually call. Hear each other's voices." },
    { speaker: "チャウ", japanese: "ぜひ。それから、いつか、どちらの国でもいいので、再会できる日を楽しみにしております。", english: "Yes please. And someday — in either country — I look forward to the day we meet again." },
    { speaker: "友人", japanese: "うん、約束。じゃあ、次の乾杯、再会の日に。", english: "Yes — promise. Then our next toast — for the day we meet again." },
    { speaker: "チャウ", japanese: "ありがとうございます。あなたの新しい門出に、心からエールを送らせていただきます。お元気で。", english: "Thank you. I send my heartfelt cheer for your new departure. Stay well." }
  ],
  roleplay_prompts: [
    "Đóng vai bạn ở bữa tối tiễn đưa bạn Nhật chuyển đi định cư ở Đức. Hãy KHÔNG khóc to (Nhật restraint), KHÔNG over-promise tương lai. Cụm chính: kyou made, makoto ni arigatou gozaimashita cộng share một kỷ niệm cụ thể (KHÔNG generic 'good times'). Specific = sincere.",
    "Bạn của bạn nói 'I'm sad to leave'. Hãy KHÔNG say 'don't be sad' (dismisses feeling). Cụm: o-kimochi, juubun ni rikai dekimasu cộng share lại sự sad của chính bạn — mutual vulnerability. Sau đó frame như chuyến đi mới, KHÔNG kết thúc.",
    "Cuối bữa, bạn cần đóng cuộc gặp với gì hơn 'see you later'. Cụm phù hợp: anata to no en wa, isshou no mono desu (mối duyên với bạn là cả đời). Plus một concrete plan reconnection (call once a year, visit specific year). Reality > vague promise."
  ],
  register_notes: "Lời tạm biệt vĩnh viễn ở Nhật là restraint + specificity. Năm patterns: (1) GRATITUDE BEFORE SADNESS: open với thanks, not sad. Cụm: kyou made, makoto ni arigatou gozaimashita. Lý do: Nhật value gratitude làm anchor; sadness allowed but secondary frame. Khác Western style 'I'm so sad you're leaving' direct opener. (2) SPECIFIC MEMORIES > GENERAL: dùng 1-2 specific memory references — câu họ said, một meal cụ thể, một moment shared. Generic 'good times' sounds rote. Specific shows you valued the relationship deeply. (3) RESTRAINT IN CRYING: tears OK quietly, KHÔNG sobbing. Một single tear with a smile = poetic Nhật image. Loud emotion makes Nhật uncomfortable, perceived as performative. (4) KHÔNG OVER-PROMISE FUTURE: instead of 'we'll talk every week!' (likely false), use realistic: ichinen ni ikkai, denwa shimashou (let's call once a year). Realistic promise more likely kept = more meaningful. (5) FRAME AS NEW BEGINNING THEIR SIDE: shift focus to their atarashii kadode (new departure). Send energy outward. Cụm: anata no atarashii kadode ni, kokoro kara ehru wo okurasete itadakimasu. KHÔNG self-focus on your own loss. // TODO native review — 'isshou no mono' phrasing — alternative kekko fukai en mềm hơn cho close-but-not-romantic friendship; native reviewer suggested 'kako no fubuki' for permanent end of romantic relationship to avoid implications.",
  idiom_glosses: [
    { idiom: "袖振り合うも他生の縁", literal: "Vạt áo chạm nhau cũng là duyên kiếp trước", meaning: "Cuộc gặp gỡ tưởng tình cờ thực ra có duyên — phù hợp frame friendship như có ý nghĩa hơn ngẫu nhiên.", example: "袖振り合うも他生の縁と申しますが、あなたとの出会いは、私にとって特別なものでした。" },
    { idiom: "会うは別れの始め", literal: "Gặp gỡ là khởi đầu của chia ly", meaning: "Triết lý vô thường (mujou) Phật giáo — cuộc gặp ẩn chứa cuộc chia. Thừa nhận parting là không tránh được.", example: "会うは別れの始めと申しますが、それでも、共に過ごせた日々に感謝しております。" },
    { idiom: "去る者日々に疎し", literal: "Người đi xa ngày càng nhạt", meaning: "Câu cảnh báo: người đi xa thường nhạt dần — phù hợp khi commit chống lại trend này, mà KHÔNG over-promise.", example: "去る者日々に疎しと申しますが、私たちはそうならないよう、お互い努力したく存じます。" },
    { idiom: "一期一会", literal: "Một thời, một gặp", meaning: "Mỗi cuộc gặp duy nhất — tea ceremony origin, khái niệm rằng từng moment với người là không thể lặp lại. Phù hợp closing toast.", example: "一期一会の精神で、今日の時間を心に刻みたく存じます。" }
  ],
  cultural_notes_vi: "Lời tạm biệt văn hóa Nhật khác VN ở 6 điểm. (1) GIFT EXCHANGE TRADITION: tại tiệc tiễn (送別会, soubetsukai), người ra đi thường nhận gifts — book about Japan để nhớ, photo album, regional specialties. Bạn cho người đi gift KHÔNG quá expensive (5,000-10,000 yen) hoặc bulky (họ phải pack). Light, meaningful: book of haiku, simple ceramic, photo printed nicely. Họ thường give gift back (memorabilia from soon-to-be-far place). Mutual exchange. (2) LETTER OVER SPEECH: at parting, brief handwritten letter (tegami) treasured more than long verbal speech. Letter survives years. Verbal speech forgotten. Write letter beforehand — even 1 page handwritten Japanese (or English với careful translation). Present at closing of meal. (3) NO HUGGING: dù emotional moment, hug KHÔNG là default. Bow at parting, perhaps light touch on shoulder. Hug only if individual relationship has established touch. Forced hug = awkward. (4) RAILWAY STATION FAREWELL: nếu seeing off at train station, classical pattern: walk to ticket gate, exchange final words on outside, watch them pass through, wave qua glass barrier until train pulls out. Don't leave first — let them disappear from view. Powerful imagery in Japanese culture — many films showcase this. (5) NEW YEAR CARD COMMITMENT: New Year cards (年賀状, nengajou) traditional way maintain long-distance friendship. Even loose ties survive via annual card. Commit to nengajou exchange — write address ngay. Continues decades. (6) RECONNECTION WHEN VISITING: nếu họ về Japan visit, expectation = họ contact bạn. Reverse same. Don't assume — explicit promise: kondo nihon ni kaette kuru toki wa, kanarazu o-shirase kudasai (next time you come back, please tell me). KHÔNG passive 'maybe see you'. Khác biệt với VN: ở VN tiệc chia tay thường rộn ràng, nhiều speech, nhiều rượu, late-night karaoke; Nhật quieter, deeper. Vietnamese might find Japanese parting feels 'cold' — đó không phải cold, là restraint với heaviness underneath. Mẹo: nếu mất relationship qua break-up rather than physical move, văn hóa Nhật thường ngừng contact hoàn toàn (ghosting). Foreigners có thể find this jarring. KHÔNG read như rejection of you — là Nhật cách closing emotional chapter. Don't push to reconnect. Long-term: track key dates — họ birthday, năm họ moved, anniversary của một moment shared. Brief contact một trong những ngày này per year keeps thread alive. Không phải over-contact, một thread thin mạnh hơn cuộc gọi forced không đều.",
  tip_advice_vi: "Trước farewell event: prepare 3 things. (a) WRITE LETTER: 1 page, handwritten if possible. Structure: thanks for specific things, one shared memory in detail, your hope for their future, your commitment to stay in touch (realistic). KHÔNG generic. Một specific thing họ taught bạn, một meal that moved bạn. (b) GIFT: small, meaningful, transportable. Book in your language of authors they like. Photo printed nicely với simple frame. Hand-made craft. (c) CONCRETE FUTURE PLAN: KHÔNG vague. Plan như 'nengajou yearly + một call ngày X mỗi năm + nếu họ về Japan, dinner cụm này'. Realistic so probable kept. Day of event: arrive 10 phút sớm. Wear nice but not too formal (normal nice clothes — too formal sounds funeral). KHÔNG bring all friends — small group (3-5) better than large (10+). Quality conversation impossible với 10. Khi gặp: light greeting, hug only if relationship history. Find seat. Order food. Đừng rush to emotion — let conversation flow naturally first 30-60 phút. Khoảng 60-90 phút mark, naturally turn deep. Cụm transition: kyou made, makoto ni arigatou gozaimashita. Hold short pause. Then share specific. Rest of group có thể follow. Khi họ respond: listen fully. KHÔNG defend nếu họ critique (gentle), KHÔNG dismiss nếu họ thanks (over-modesty). Just receive. Tears OK quiet. Smile through tears. Nhật image. Closing the event: don't drag — set time end. Cụm: o-tsukare-sama de gozaimasu. souyousou aru kara, kyou wa kono atari de (you have early morning, let's wrap here). Walk together to station/parking. At parting point: brief final words, bow, wave. KHÔNG long extended goodbye — getas more painful. After event: send brief follow-up message within 24 hours. KHÔNG repeat what said in person. Brief: kyou wa, ureshikattai desu cộng safe travels message. Then begin distance phase. Long-term distance maintenance: nengajou commitment first January. Họ birthday brief message. One scheduled video call yearly. Anniversary of một shared event optional. KHÔNG try replicate frequency của in-person — distance friendship has different rhythm. Quality > frequency. Mẹo nếu họ ngừng responding: 1-2 unanswered nengajou OK — họ busy. 3+ silent years = họ moved on. Accept gracefully. Một final brief message OK: o-genki ni o-sugoshi de irassharu koto wo, kokoro kara negatte orimasu. Then truly let go. Some friendships have season. Mẹo cuối nếu farewell là end-of-relationship (break-up, falling-out không recoverable): rules different. Less ceremony, more dignity. Brief, no shared meal, no gift. Cụm: kyou made no jikan, kansha shite imasu. dou ka, o-genki de (thanks for time we had, take care). Then no contact — respect cleanness của ending.",
  exercises: [
    { type: "fill-blank", question: "離れていても、心の中ではいつも___っております。", answer: "つなが" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "今日まで、本当にありがとうございました", english: "open farewell with gratitude before sadness" },
      { japanese: "あなたが教えてくださった「察する」という言葉", english: "specific memory beats generic appreciation" },
      { japanese: "新しい門出にエールを送らせていただきます", english: "shift focus to their forward journey" },
      { japanese: "一年に一回、ちゃんと電話しよう", english: "realistic promise outlives vague commitment" }
    ] },
    { type: "translation", vietnamese: "Em mong ngày nào đó, ở đâu đó, lại được gặp bạn.", japanese: "またいつか、どこかでお会いできる日を楽しみにしております。" }
  ]
},
{
  id: 87,
  title: "Supporting a friend through a hard time — work stress, family troubles",
  title_vi: "Hỗ trợ bạn đang khó khăn — căng thẳng công việc, vấn đề gia đình",
  title_en: "Supporting a friend through a hard time — work stress, family troubles",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "辛い (つらい)", english: "tough / painful (emotionally)" },
    { japanese: "大変 (たいへん)", english: "rough / a lot to handle" },
    { japanese: "頑張る (がんばる)", english: "to do one's best / endure" },
    { japanese: "無理しないで (むりしないで)", english: "don't push yourself" },
    { japanese: "肩の荷 (かたのに)", english: "burden on one's shoulders" },
    { japanese: "話を聞く (はなしをきく)", english: "to listen (to someone's story)" },
    { japanese: "心配 (しんぱい)", english: "worry / concern" },
    { japanese: "応援 (おうえん)", english: "cheering / support" },
    { japanese: "休む (やすむ)", english: "to rest" },
    { japanese: "そばにいる (そばにいる)", english: "to be by someone's side" }
  ],
  examples: [
    { japanese: "最近、お疲れのご様子ですが、大丈夫でいらっしゃいますか。", english: "You seem tired lately — are you all right?" },
    { japanese: "話したくなければ、無理に話さなくて大丈夫です。", english: "If you don't feel like talking, you don't have to force it." },
    { japanese: "私で良ければ、いつでも話を聞きます。", english: "If I'm useful, I'll listen anytime." },
    { japanese: "一人で抱え込まないでくださいね。", english: "Please don't carry it alone." },
    { japanese: "ゆっくり、無理せず、ご自分のペースで。", english: "Slowly, without pushing, at your own pace." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "最近、お元気ですか。少しお疲れのご様子で、心配しております。", english: "How have you been lately? You seem tired — I'm worried." },
    { speaker: "友人", japanese: "うん...仕事と家のことで、ちょっと参ってる。", english: "Yeah... between work and home, I'm a bit worn out." },
    { speaker: "チャウ", japanese: "話したくなければ、無理になさらなくて大丈夫です。ただ、一人で抱え込まないでくださいね。", english: "You don't have to force yourself to talk. Just — don't carry it alone." },
    { speaker: "友人", japanese: "ありがとう。少し聞いてもらってもいい?", english: "Thank you. May I share a little?" }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "今日、お時間いただいて、ありがとうございます。お疲れのところ、お呼び立てしてすみません。", english: "Thank you for the time today. Sorry to call you out when you're tired." },
    { speaker: "友人", japanese: "ううん、むしろ呼んでくれて助かった。家にいると、ぼーっと考え込んでしまって。", english: "No — I'm glad you called. At home, I just blank out and ruminate." },
    { speaker: "チャウ", japanese: "そうでしたか。最近、お会いするたびに、少しお疲れのご様子で、ずっと気になっておりまして。", english: "I see. Each time we've met lately, you've seemed tired — I've been concerned." },
    { speaker: "友人", japanese: "気づいてくれてたんだ。実は、仕事と母のことで、ちょっと参ってて。", english: "You noticed. Actually, work and mom's situation — I've been worn out." },
    { speaker: "チャウ", japanese: "話せる範囲で構いません。ご無理には、お聞きしません。", english: "Only what you can share. I won't ask beyond your comfort." },
    { speaker: "友人", japanese: "ありがとう。仕事は、半年前にプロジェクトリーダーになって、責任が一気に増えて。残業が続いてて、家に帰ると母のことが待ってる。母、最近認知症の症状が出始めて。", english: "Thanks. Work — I became project lead six months ago, responsibility shot up. Overtime is constant, and at home, mom's situation waits. She's recently started showing dementia symptoms." },
    { speaker: "チャウ", japanese: "...それは、本当に、肩の荷が重いですね。職場でも家でも、休まる場所がない。", english: "...that is truly a heavy burden. No place to rest, neither at work nor at home." },
    { speaker: "友人", japanese: "うん。最近、自分が誰のために生きてるのか、わからなくなる時があって。", english: "Yeah. Lately there are times I don't know who I'm living for." },
    { speaker: "チャウ", japanese: "(少し沈黙) ...そう感じてしまう瞬間、ありますよね。気持ち、想像できないかもしれませんが、お話聞かせていただけて、ありがたく思います。", english: "(brief silence) ...there are moments one feels that way. I may not fully imagine it, but I'm grateful you're sharing." },
    { speaker: "友人", japanese: "ごめんね、重い話して。", english: "Sorry to dump heavy talk on you." },
    { speaker: "チャウ", japanese: "重いなんて、とんでもございません。むしろ、聞かせていただいて、私の方こそありがたいです。一つ、伺ってもよろしいですか。", english: "Heavy? Not at all. If anything, I'm grateful to hear. May I ask one thing?" },
    { speaker: "友人", japanese: "うん、何?", english: "Sure, what?" },
    { speaker: "チャウ", japanese: "お母さまのケアで、デイサービスや、ヘルパーさんの手は借りていらっしゃいますか。", english: "For your mother's care — are you using day services, or helper support?" },
    { speaker: "友人", japanese: "まだ申請してない。手続きがめんどうで、後回しに。", english: "Haven't applied yet. The paperwork's a hassle — kept putting it off." },
    { speaker: "チャウ", japanese: "お一人で全部抱えると、ご自身が倒れてしまいます。地域の包括支援センターが手続きをサポートしてくださるので、ご一緒に伺ってもよろしいでしょうか。", english: "Carrying everything alone — you yourself will collapse. The local comprehensive support center helps with paperwork. May I go with you?" },
    { speaker: "友人", japanese: "...一緒に行ってくれるの?", english: "...you'd come with me?" },
    { speaker: "チャウ", japanese: "もちろんです。週末、空いておりますので、ご都合が合えば、一緒に申請の予約を取りましょう。それから、お仕事も、職場で介護休暇制度があるか、人事の方に伺うのも一つの手かと存じます。", english: "Of course. I'm free this weekend; if your schedule fits, let's book an application together. Also, at work — asking HR if family-care leave is available is one option." },
    { speaker: "友人", japanese: "そっか。一人で全部、考えてた。誰かに聞けばよかったんだ。", english: "I see. I was figuring it all out alone. I should have asked someone." },
    { speaker: "チャウ", japanese: "頑張りすぎる方ほど、人に頼ることを忘れてしまわれます。今日、話してくださって、本当にありがとうございます。週末、ご連絡しますね。それまで、無理せず、ご自分のペースで。", english: "Those who try hardest tend to forget to lean on others. Thank you for talking today. I'll reach out before the weekend. Until then — without pushing, at your own pace." }
  ],
  roleplay_prompts: [
    "Đóng vai bạn nhận thấy bạn Nhật mệt mỏi nhiều tuần. Open conversation KHÔNG bằng 'are you OK?' (yes/no closes door) — bằng observation specific. Cụm: saikin, o-tsukare no go-yousu de, shinpai shite orimasu (gần đây thấy bạn mệt, em lo). Sau đó pause để họ choose share hoặc deflect.",
    "Bạn của bạn share work + family stress. Hãy KHÔNG offer solutions immediately — first acknowledge weight. Cụm: kata no ni, omoi desu ne. shokuba demo ie demo, yasumaru basho ga nai (gánh nặng đè vai. ở work hay home không có chỗ nghỉ). Reflect lại. Solution-mode quá sớm = họ feel unheard.",
    "Sau khi listen, bạn move to practical help — KHÔNG generic 'let me know if you need anything' (họ never ask). Specific: 'cuối tuần em đi cùng bạn lên trung tâm hỗ trợ điều thủ tục cho mẹ'. Cụm: go-issho ni ukagatte mo yoroshii deshou ka. Specific + concrete + you-going = thật sự share burden."
  ],
  register_notes: "Hỗ trợ bạn khó khăn ở Nhật cần balance enryo (không xâm phạm) và sasshi (đọc tâm). Năm patterns: (1) OPEN WITH SPECIFIC OBSERVATION, NOT QUESTION: 'are you OK' yes/no closes door. 'You've seemed tired' opens. Cụm: o-tsukare no go-yousu de cộng shinpai. Họ có agency to deflect (sou desu ne, jissai ni wa heiki desu) hoặc share. Both responses valid. (2) RESPECT THEIR PACE: nếu họ deflect, accept. KHÔNG push. Cụm: hai, kashikomarimashita. mata, o-itsudemo, o-koe gake itashimasu (vâng, lúc nào cũng có thể nhắn). Ý: door open. Họ come back when ready. (3) NO 'TAIHEN DESU NE' AS DISMISSAL: 'taihen' OK in light context. In serious sharing, sounds dismissive ('that sounds rough') — close conversation. Use heavier acknowledgment: kata no ni, omoi desu ne (the burden is heavy, isn't it) hoặc o-kimochi, juubun ni rikai dekimasu. (4) ASK PERMISSION TO ASK: nếu nghi gì cụ thể (đã apply support? đã talk to HR?), ASK PERMISSION first. Cụm: hitotsu, ukagatte mo yoroshii deshou ka. Then ask. Direct probing without permission = invasive. (5) OFFER SPECIFIC HELP, NOT GENERIC: KHÔNG 'let me know if anything I can do' (Japanese never ask — burdens you = they avoid). Cụm specific: konshuumatsu, go-issho ni X ni ukagaitemo yoroshii deshou ka. Concrete time + concrete action. Họ accept hoặc decline cụ thể. // TODO native review — 'kata no ni, omoi desu ne' phrasing — alternative go-fudan ga ookii desu ne sounds slightly more formal; some natives prefer 'tsurai desu ne' for emotional weight; never use 'oyousu yo' as closing — sounds dismissive in this register.",
  idiom_glosses: [
    { idiom: "肩の荷が下りる", literal: "Gánh nặng rời vai", meaning: "Cảm giác nhẹ vai sau khi share — phù hợp closing: thank họ for trusting you with the burden.", example: "今日、お話しいただいて、少しでも肩の荷が下りていれば嬉しく存じます。" },
    { idiom: "親しき仲にも礼儀あり", literal: "Gần thân cũng cần lễ nghi", meaning: "Trong friendship sâu, vẫn ask permission trước khi probe — respect maintained.", example: "親しき仲にも礼儀ありと申しますし、立ち入ったことを伺う前に、一言お断りさせていただきます。" },
    { idiom: "情けは人の為ならず", literal: "Lòng tốt không vì người khác", meaning: "Thực ra: lòng tốt cuối cùng quay lại với chính mình — KHÔNG misread như 'don't be kind'. Phù hợp khi friend nói 'sorry to bother you'.", example: "情けは人の為ならずと申します。私もいつかお世話になりますので、お互い様です。" },
    { idiom: "腹を割って話す", literal: "Mổ bụng ra mà nói", meaning: "Nói thẳng từ tim — phù hợp acknowledge friend đã honne với bạn, đó là big trust.", example: "腹を割って話してくださって、こちらこそ感謝しております。" }
  ],
  cultural_notes_vi: "Văn hóa hỗ trợ ở Nhật khác VN ở 6 điểm. (1) ENRYO BARRIER: Nhật value KHÔNG burden others (meiwaku wo kakenai). Họ tự nhiên hide stress, decline help. Bạn có thể ask 5 lần, mỗi lần họ say 'daijoubu' before họ accept once. KHÔNG read 'daijoubu' literal — read context (body language, tone). (2) SOLUTION FATIGUE: Nhật stressed thường KHÔNG want solutions — họ already considered them. Want sasshi (acknowledgment), không advice. Don't jump to solutions. Listen 80 phần trăm, suggest 20 phần trăm. (3) PROFESSIONAL HELP STIGMA: mental health professional consultation in Japan increasing nhưng still stigma. Friend may resist 'see a counselor'. Better frame: chiiki no soudan madoguchi (community consultation desk) hoặc hokenfu-san (public health nurse) — feels less 'mental health' và more 'general support'. (4) FAMILY CARE INSURANCE (介護保険): nếu friend caring for elderly parent với dementia/disability, Japan has comprehensive family-care insurance system (kaigo hoken). Most Japanese KHÔNG aware of full benefits. Encourage application via 地域包括支援センター (chiiki houkatsu shien sentaa, community comprehensive support center) — every neighborhood has one. Free consultation. (5) WORKPLACE LEAVE OPTIONS: 介護休暇 (family-care leave) entitlement là legally protected. Most employees KHÔNG know. Up to 93 days unpaid leave protected from termination. Encourage friend ask HR. KHÔNG forced — just inform. (6) PHYSICAL CONTACT MINIMAL: comfort instinct ôm = KHÔNG culturally normal. Light pat on shoulder OK with established close friend. Better comfort: physically present, listen, follow-up message. Khác biệt với VN: ở VN bạn bè khó khăn thường gather to drink, eat heavy, share loud — collective release. Ở Nhật, support quieter, more individual, more practical infrastructure. Vietnamese instinct 'come over right now, let's drink' may feel intrusive to Japanese friend stressed. Adjust: brief specific offer (one tea, 1 hour), KHÔNG long open-ended. Mẹo: nếu friend có nguy cơ burnout cụ thể (suicidal speech, long isolation, severe physical symptoms), gọi 24h hotline TELL Hotline (03-5774-0992 — TELL Tokyo English/Japanese support) hoặc local hokenfu-san. Don't carry alone. Long-term: support is marathon, not sprint. Friend khó khăn typically 6-18 tháng để stabilize. Bạn role: maintain consistent presence ở thấp intensity (weekly brief message), KHÔNG burst high-intensity 1 month then disappear. Sustainable > intense.",
  tip_advice_vi: "Khi nhận tín hiệu friend đang khó khăn (mệt, im lặng nhiều, cancel plans, complaint về work/family): MỞ door, KHÔNG force entry. First contact via channel họ comfortable (LINE message, brief call). Cụm safe opener: saikin, o-tsukare no go-yousu de, shinpai shite orimasu. nani ka, o-yaku ni tateru koto wa nai deshou ka (gần đây thấy bạn mệt, lo lắng. có gì giúp được không). Họ có 3 possible responses: (a) deflect (no, fine) — accept gracefully, kashikomarimashita, mata o-itsudemo o-koe gake shimasu. (b) brief share (yeah, work busy) — light support, muri sezu, gohan ka cha de mo go-issho dekireba. (c) deep share (long talk) — proceed with conversation. Khi họ deep share: setting matters. Public cafe OK cho moderate. Private (their home, your home, quiet park bench) for deep. Phone if distance. KHÔNG group setting (other people present = họ filtered). During listen: 80 phần trăm listen, 20 phần trăm reflect. Mirror back what they say in slightly different words. Cụm: shokuba mo ie mo, yasumaru basho ga nai. sou iu kanji desu ne (work and home, no resting place — that's how it is). Light reflection = họ feel heard. KHÔNG advise yet. Sau 30-60 phút of listening, ask permission to ask: hitotsu, ukagatte mo yoroshii deshou ka. They consent or deflect. Nếu consent, ask SPECIFIC, action-oriented question. Practical resources known? Workplace policy explored? Family help available? Keep one question per conversation. Multiple = interrogation feel. Khi propose help: SPECIFIC. Kongetsu no doyoubi, o-jikan ga areba, X ni go-issho ni ikemasen ka (Saturday this month, if you have time, can we go to X together). Họ accept or decline cụ thể. Don't insist if decline. Closing: Acknowledge their trust. Cụm: kyou, hanashite kudasatte, arigatou gozaimasu. konna fuu ni kikasete itadakeru kankei wo, kichou ni omotte orimasu. Brief follow-up message within 24h. Cụm: kyou wa hanasete kudasatte, arigatou gozaimashita. mata, o-itsudemo o-koe gake shimasu. Long-term presence: weekly brief contact (1-2 short messages, can be just 'thinking of you'). Monthly meet-up if possible. Họ wave cancellation OK; reschedule, không drop. Hold thread. Self-care for you: supporting someone in deep stress drains. Manage your own energy. Don't try be sole support — encourage friend connect với others (family, professional, community). Bạn one of 5 supports, không 5/5. Mẹo: nếu friend show signs of severe distress (specific suicidal language, social withdrawal complete, severe physical symptoms not eating sleeping for week+), reach out to a professional resource. TELL Hotline 03-5774-0992 (English/Japanese, 24h). Yorisoi Hotline 0120-279-338 (Japanese, free). Local hokenfu-san accessible via city hall. Don't carry alone. Mẹo cuối: bạn yourself need support. Talk to one trusted person (your spouse, your own friend, your therapist) about being a support. Carrying friend's pain heavy. Process it. Long-distance support sustainable only if you're sustainable.",
  exercises: [
    { type: "fill-blank", question: "一人で抱え___ないでくださいね。", answer: "込ま" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "お疲れのご様子で、心配しております", english: "open with specific observation rather than yes/no question" },
      { japanese: "ご無理には、お聞きしません", english: "respect their pace; let them set the depth" },
      { japanese: "肩の荷が重いですね", english: "acknowledge weight before suggesting solutions" },
      { japanese: "ご一緒に伺ってもよろしいでしょうか", english: "specific concrete help offer (you go with them)" }
    ] },
    { type: "translation", vietnamese: "Người càng cố quá thường càng quên dựa vào người khác.", japanese: "頑張りすぎる方ほど、人に頼ることを忘れてしまわれます。" }
  ]
},
{
  id: 88,
  title: "Money and debt conversation with a friend — asking back, being asked",
  title_vi: "Trò chuyện về tiền/nợ với bạn — đòi lại, được hỏi vay, động lực khó xử",
  title_en: "Money and debt conversation with a friend — asking back, being asked",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "貸し借り (かしかり)", english: "lending and borrowing" },
    { japanese: "立て替える (たてかえる)", english: "to pay temporarily on behalf of" },
    { japanese: "返済 (へんさい)", english: "repayment" },
    { japanese: "金銭 (きんせん)", english: "money (formal noun)" },
    { japanese: "お金のやり取り (おかねのやりとり)", english: "money exchange / transaction" },
    { japanese: "気まずい (きまずい)", english: "awkward / uncomfortable" },
    { japanese: "切り出す (きりだす)", english: "to bring up (a difficult topic)" },
    { japanese: "都合 (つごう)", english: "circumstances / convenience" },
    { japanese: "正直に申し上げると (しょうじきにもうしあげると)", english: "honestly speaking (formal frame)" },
    { japanese: "関係に響く (かんけいにひびく)", english: "to affect the relationship" }
  ],
  examples: [
    { japanese: "少しお金のことでお話があるのですが、お時間よろしいでしょうか。", english: "I have something to discuss about money — do you have time?" },
    { japanese: "先月立て替えた分のことなのですが、ご記憶でいらっしゃいますか。", english: "About what I paid on your behalf last month — do you recall?" },
    { japanese: "急ぎませんので、ご都合のよい時にお返しいただければ幸いです。", english: "There's no rush; if you could repay at your convenience, I'd appreciate it." },
    { japanese: "こちらこそ、こんな話を切り出して、申し訳ございません。", english: "I'm the one who's sorry to bring up such a topic." },
    { japanese: "金銭で関係に響くのは、私の本意ではございません。", english: "It's not my intention for our relationship to be affected by money." }
  ],
  dialogue: [
    { speaker: "チャウ", japanese: "ちょっとお話があるのですが、お時間よろしいでしょうか。", english: "I have a bit to discuss — do you have time?" },
    { speaker: "友人", japanese: "うん、なに?", english: "Sure, what is it?" },
    { speaker: "チャウ", japanese: "先月の旅行で、立て替えさせていただいた分のことなのですが。", english: "About the amount I covered for you during last month's trip." },
    { speaker: "友人", japanese: "ああ、ごめん、すっかり忘れてた。明日中に振り込むね。", english: "Ah, sorry — completely forgot. I'll transfer it by tomorrow." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "今日は、ちょっとお話があって、お呼び立てしました。", english: "I called you out today because there's something to discuss." },
    { speaker: "友人", japanese: "うん、改まって。何かあった?", english: "Sure — formal of you. Did something happen?" },
    { speaker: "チャウ", japanese: "実は、お金のことなのですが、切り出しにくくて、ずっと迷っておりました。", english: "Actually, it's about money — hard to bring up, and I've been hesitating." },
    { speaker: "友人", japanese: "お金? なんだろう。気にせず、言ってよ。", english: "Money? What is it? Don't hold back, tell me." },
    { speaker: "チャウ", japanese: "先月の温泉旅行のときに、宿泊代を私が立て替えさせていただいた分があったんです。三万円ほどでした。", english: "During the hot-spring trip last month, I covered your share of the lodging — about 30,000 yen." },
    { speaker: "友人", japanese: "...あ、そうだった。ごめん、本当に忘れてた。なんでもっと早く言ってくれなかったの。", english: "...ah, that's right. Sorry — I really did forget. Why didn't you say sooner?" },
    { speaker: "チャウ", japanese: "言いそびれてしまって、それから時間が経つほど、切り出しにくくなりまして。今日、思い切ってお話しすることにしました。", english: "I missed the moment, and the more time passed, the harder it got. Today I decided to bring it up." },
    { speaker: "友人", japanese: "そんな、こちらこそごめんなさい。あの後、私もバタバタしてて、すっかり忘れてた。今夜中に振り込むね。", english: "No, I'm the one to apologize. I was busy after that and completely forgot. I'll transfer it tonight." },
    { speaker: "チャウ", japanese: "ありがとうございます。急ぎませんので、ご都合のよい時で構いません。それから、こちらこそ、こんな話を切り出して、申し訳ございません。", english: "Thank you. No rush — at your convenience. And — I'm the one who's sorry to bring this up." },
    { speaker: "友人", japanese: "謝ることないよ。お金のこと、はっきり言ってくれた方が、お互い気持ちいい。", english: "No need to apologize. With money, saying it clearly feels better for both." },
    { speaker: "チャウ", japanese: "そう言っていただけて、心が軽くなりました。実は、こちらにもう一つ、ご相談したいことがありまして。", english: "Hearing that, my heart feels lighter. Actually, there's one more thing I'd like to discuss." },
    { speaker: "友人", japanese: "どうぞ。", english: "Go ahead." },
    { speaker: "チャウ", japanese: "今後、共に旅行や食事に行く際に、私が立て替える形ではなく、その場で精算する形にさせていただけたらと思いまして。", english: "Going forward, when we travel or dine together, rather than me covering and settling later, I'd like us to split on the spot." },
    { speaker: "友人", japanese: "もちろん、それでいい。むしろ、その方がいい。最近、PayPayや割り勘アプリで、その場で送れるしね。", english: "Of course, that's fine. Better, in fact. With PayPay and split apps, you can send on the spot now." },
    { speaker: "チャウ", japanese: "ありがとうございます。私も、立て替えるのが嫌なわけではないのですが、後で切り出すのが、毎回少し心の負担になっておりまして。", english: "Thank you. It's not that I dislike fronting — but bringing it up later, each time, is a little burden on my heart." },
    { speaker: "友人", japanese: "そっか。それ、私が気づかなかった。これからは、その場で精算で行こう。", english: "I see. I hadn't noticed that. From now on, let's settle on the spot." },
    { speaker: "チャウ", japanese: "ありがとうございます。お金の話で、関係に響くのは、私の本意ではございませんので、こうしてお話できて、本当に助かりました。", english: "Thank you. Money affecting our relationship isn't my intention — being able to talk this through really helps." },
    { speaker: "友人", japanese: "むしろ、こうやって話せる関係って、いい関係だよね。お金、ちゃんと話せない関係こそ、危ない。", english: "Actually, a relationship where we can talk like this — that's a good one. Relationships that can't talk money clearly — those are risky." }
  ],
  roleplay_prompts: [
    "Đóng vai bạn cần đòi lại 30,000 yen bạn đã trả hộ trong chuyến du lịch. Đã 3 tuần. Hãy KHÔNG vague hint, KHÔNG dramatic — frame thẳng nhưng nhẹ. Cụm: kiridashi nikukute, mayotte orimashita ga (do dự khó nói nhưng) cộng senjitsu no ryokou de, tatekaesete itadaita bun ga arimashita (hôm trước em trả hộ phần). Specific amount + context. Họ apologize, accept gracefully — KHÔNG over-reassure ('it's nothing').",
    "Bạn của bạn ASK YOU vay tiền (200,000 yen, hoàn trong 6 tháng). Bạn không thoải mái nhưng không muốn từ chối thô lỗ. Hãy KHÔNG immediately yes, KHÔNG immediately no — request time to think. Cụm: o-kimochi wa juubun ni rikai dekimasu. tada, kingaku ga ookii node, sukoshi kangae sasete itadakitaku zonjimasu (em hiểu — nhưng số tiền lớn, xin được suy nghĩ ít hôm). Avoid yes/no in moment.",
    "Sau 2 ngày suy nghĩ, bạn quyết định decline. Cụm: kongo no jibun no keikaku to terashite, kondo wa o-yaku ni tatemasen (đối chiếu kế hoạch của em sắp tới, lần này em không giúp được). Suggest alternative: kingaku ga chiisakute mo, sukoshi nara kinougatta jibun de tasukerareru tokoro ga arimasu (số nhỏ thì em có thể). Maintain dignity for both."
  ],
  register_notes: "Tiền với bạn ở Nhật là minefield. Năm patterns: (1) BRING UP EARLIEST POSSIBLE: nếu tatekae (cover for friend), say in moment hoặc ngay sau (within 2-3 days). Wait > 2 weeks và conversation gets harder. Cụm in-moment: kyou no bun, ato de seisan deki masu ka. Modern apps (PayPay, LINE Pay, Kyash) make on-spot split easy — encourage. (2) FRAME AS SHARED PROBLEM: KHÔNG accuse 'you forgot' (kashi-tana). Frame như communication issue. Cụm: itai sobirete shimatte (tôi miss the moment), kiridashi nikukute (hard to bring up). Self-attribute hesitancy = preserves face. (3) NEVER ANGRY TONE: dù họ delay months, voice stay calm. Anger over money = friendship damage permanent. Calm clarity = friendship survives. Một câu firm-but-warm > mười câu emotional. (4) DECLINING LOAN REQUEST: KHÔNG immediate no (sounds dismissive of trust they showed). Buy time. Cụm: o-kimochi rikai dekimasu. sukoshi kangae sasete itadakitaku zonjimasu. 1-3 ngày sau, decline với reason concrete (kongo no shukyou ga, ima koukai ga genjitsu-teki dewa nai — current plans don't make this realistic). Specific reason > vague no. (5) KEEP RECORDS: dù trust friend, record dates + amounts in phone (private). Fading memory = source of friction. Có record = both can verify, không argue. Friendship transparency tools, không suspicion. // TODO native review — 'kiridashi nikukute, mayotte orimashita' phrasing — alternative iidashi nikukute mềm hơn cho closer friends; native reviewer noted 'kanjo nin' awkwardness in dialogue context — replaced with 'tatekaesase' which works for casual situations.",
  idiom_glosses: [
    { idiom: "親しき仲にも礼儀あり", literal: "Trong gần thân vẫn có lễ", meaning: "Bạn thân vẫn cần clarity về tiền — context apply directly here.", example: "親しき仲にも礼儀ありと申しますし、お金のことは曖昧にせず、はっきりさせたく存じます。" },
    { idiom: "金の切れ目が縁の切れ目", literal: "Tiền hết là duyên hết", meaning: "Cảnh báo: friendship can break over money — phù hợp explain why bạn want to be clear NOW.", example: "金の切れ目が縁の切れ目と申しますので、関係を大切にするためにも、お金のことはきちんと話したく存じます。" },
    { idiom: "立つ鳥跡を濁さず", literal: "Chim bay đi không làm đục nước", meaning: "Đi mà không để vết — phù hợp cho khi paying back: settle clean leave no residue.", example: "立つ鳥跡を濁さずと申しますし、今夜中に振り込ませていただきます。" },
    { idiom: "貸した金は忘れろ、借りた金は忘れるな", literal: "Tiền cho mượn thì quên, tiền mượn thì nhớ", meaning: "Lời khuyên cũ: lender forgets, borrower remembers — câu hỏi đạo đức trao cho cả 2 phía.", example: "「貸した金は忘れろ、借りた金は忘れるな」と申します。私も、お返しすべきものは、必ず覚えております。" }
  ],
  cultural_notes_vi: "Văn hóa tiền-bạn ở Nhật khác VN ở 6 điểm. (1) WARIKAN DEFAULT: 割り勘 (split bill) là standard, even between close friends. Nhật rarely 'I'll get this one' as habit — exceptions: senpai treating kohai (workplace), or special occasion. Foreigners may default to alternating treats. Disclose preference upfront: warikan ga ii desu — itsumo (let's always split). (2) CASH STILL DOMINANT: dù IT advanced, cash still common. Khi splitting, exact amount expected — bring small bills. KHÔNG round up. Apps Solving this — encourage friend uses PayPay/LINE Pay if possible. (3) LOANS BETWEEN FRIENDS RARE: borrow significant from Japanese friend = reduce relationship to acquaintance level. Most Japanese have family/bank for big needs. Foreigner asking JP friend for loan = potentially severs friendship. Try alternative routes (employer advance, regional bank, family) before asking friend. (4) SHARED EXPENSES BUDGET: nếu group plan trip, often 1 person designated kanjou-gakari (treasury role). Họ collect, settle, distribute. Volunteer this role builds reputation, KHÔNG burden. (5) GIFT RECIPROCITY ECONOMY: nếu họ give expensive gift (omiyage worth 5,000+), reciprocity expected within 1-3 events together. KHÔNG necessarily money — comparable gift value. Foreigners sometimes don't track — Nhật notice. (6) BIRTHDAY EXPENSES: at restaurant for friend's birthday, friend whose birthday IS often expected to be treated by group, but friend pays back equivalent gift. Loose rule. Khác biệt với VN: ở VN bạn thân thay phiên trả luôn (turn-based treat economy), forgetting OK; ở Nhật, exact split or measured reciprocity. Vietnamese instinct 'I'll get this, you get next time' Japanese friend may feel awkward — feels like hidden ledger. Prefer warikan upfront. Mẹo: nếu bạn thấy friend never offer to pay (always you), brief observation can fix. Cụm: kondo, warikan demo daijoubu desu yo (next time, splitting is fine). Họ may not realize cultural mismatch. Long-term: keep friendship money-clean. Money confusion is one of top 3 reasons cross-cultural friendships in Japan dissolve. Worth bringing up early than late.",
  tip_advice_vi: "Trước khi bring up money với friend: prepare 4 things. (a) AMOUNT — exact, không vague (35,000 yen, không 'a few tens of thousands'). (b) CONTEXT — what occasion, when, what for (last month's trip, lodging coverage). (c) URGENCY — bạn really need by date X, hoặc just want clarity? (d) ALTERNATIVE OFFER — if họ can't pay full now, OK monthly? Plan having gives friend escape route. Choose timing: KHÔNG over text (impersonal for serious topic), KHÔNG over phone (lacks visual). In-person, private setting, sit-down meeting. Send message ahead: chotto o-hanashi ga atte, jikan ga aru toki ni o-cha demo dou desu ka. KHÔNG specify topic in advance (creates anxiety). Tại meeting: warm-up first 10-15 phút normal conversation. Then transition naturally: jitsu wa, sukoshi o-hanashi shitai koto ga arimashite. Pause. Họ ready. Then state — concrete, calm. Watch face. Họ likely apology immediate (forgot, sorry). Accept gracefully without over-reassuring. Cụm: ki ni shinaide kudasai — hai, mou kekkou desu. Set repayment expectation: kongetsu-chuu ni, dou ka go-fubin no nai you ni o-negai shimasu (within this month, please). Specific deadline > vague. Sau khi họ commit timing: pivot to LARGER conversation. Future structure. Cụm: kongo, isshouni ryokou ya gohan ni iku toki, sono ba de seisan no katachi wa, ikaga deshou ka. Họ likely agree. Set new norm. Long-term protocols: trip planning together, always set kanjou-gakari (treasury role) upfront. Khi book hotel, restaurant, train tickets, designated person uses one card, others send share immediately via PayPay/LINE Pay. Total transparency. KHÔNG cumulative debt. Khi being asked to lend significant: PAUSE. KHÔNG yes/no in moment. Cụm: o-kimochi, juubun ni rikai dekimasu. tada, kingaku ga ookii node, sukoshi kangae sasete itadakitaku zonjimasu. Take 2-3 ngày. Honestly assess: would denial damage friendship beyond repair? Can bạn afford to lose this money entirely (loans to friends often become gifts)? Suggest alternative routes (his bank, his family, your introduction to someone with capital). Decline gracefully. Cụm: kongo no jibun no keikaku to terashite, kondo wa o-yaku ni tatemasen ga, kingaku ga chiisakute mo, sukoshi nara — (current plans don't allow, but smaller amount is OK if helpful). Khi being thanked for past help: don't make big deal. Cụm: dou itashimashite. otagai-sama desu (you're welcome — we're equals). Brief acknowledgment. Mẹo: nếu friend repeatedly slow on repayment (multiple times after multiple reminders), consider relationship recalibration. KHÔNG dramatic break — but do reduce financial entanglement. Going forward, only same-day-split situations. Cumulative trust slowly rebuilds với consistent behavior. Mẹo cuối: track everything in private (phone notes, simple spreadsheet). Friend who is loose with money typically also loose with other commitments (time, plans). Pattern data informs how much you invest. Healthy friendships have money in light, not in shadows.",
  exercises: [
    { type: "fill-blank", question: "金銭で関係に___のは、私の本意ではございません。", answer: "響く" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "立て替えさせていただいた分", english: "amount I covered on your behalf — neutral framing" },
      { japanese: "切り出しにくくて、迷っておりました", english: "self-attribute hesitancy, preserves their face" },
      { japanese: "ご都合のよい時にお返しいただければ", english: "remove urgency pressure when receiving repayment" },
      { japanese: "その場で精算する形に", english: "propose on-spot split as new norm" }
    ] },
    { type: "translation", vietnamese: "Nói chuyện tiền với bạn không phải để làm khó — mà để giữ tình cảm rõ.", japanese: "金銭の話を切り出すのは、関係を難しくするためではなく、はっきりさせて、関係を大切にするためでございます。" }
  ]
},
{
  id: 89,
  title: "Religion and spiritual practice — across different beliefs",
  title_vi: "Tôn giáo và thực hành tâm linh — giữa người khác niềm tin",
  title_en: "Religion and spiritual practice — across different beliefs",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "信仰 (しんこう)", english: "religious belief / faith" },
    { japanese: "宗教 (しゅうきょう)", english: "religion (broad term)" },
    { japanese: "神社 (じんじゃ)", english: "Shinto shrine" },
    { japanese: "お寺 (おてら)", english: "Buddhist temple" },
    { japanese: "参拝 (さんぱい)", english: "visit / worship at shrine or temple" },
    { japanese: "初詣 (はつもうで)", english: "first shrine visit of the new year" },
    { japanese: "お墓参り (おはかまいり)", english: "visiting ancestors' grave" },
    { japanese: "祈る (いのる)", english: "to pray" },
    { japanese: "尊重 (そんちょう)", english: "respect (for others' beliefs)" },
    { japanese: "価値観 (かちかん)", english: "values" }
  ],
  examples: [
    { japanese: "ベトナムでは、家庭で先祖を祀る習慣がございまして。", english: "In Vietnam we have the custom of honoring ancestors at home." },
    { japanese: "日本の初詣は、お寺と神社、両方に伺うのですか。", english: "For Japanese hatsumode, do people visit both temples and shrines?" },
    { japanese: "信仰は人それぞれですので、お互いの考えを尊重したく存じます。", english: "Faith varies person to person; I'd like us to respect each other's thinking." },
    { japanese: "宗派について、深くは存じませんが、興味を持っております。", english: "I don't know the sects deeply, but I'm interested." },
    { japanese: "お墓参りに、ご一緒させていただいてもよろしいでしょうか。", english: "May I accompany you to visit the grave?" }
  ],
  dialogue: [
    { speaker: "友人", japanese: "正月、初詣行く?", english: "You doing hatsumode for New Year?" },
    { speaker: "チャウ", japanese: "ぜひ伺いたいのですが、作法をきちんと存じませんで。", english: "I'd like to — but I don't really know the proper manners." },
    { speaker: "友人", japanese: "簡単だよ。ご一緒しよう。", english: "It's simple. Let's go together." },
    { speaker: "チャウ", japanese: "ありがとうございます。ベトナムでも先祖を大切にする習慣がございますので、似たお気持ちで参拝できれば。", english: "Thank you. We honor ancestors in Vietnam too, so I can approach it with a similar feeling." }
  ],
  dialogue_long: [
    { speaker: "友人", japanese: "もうすぐお正月だね。チャウさん、初詣はどうするの?", english: "New Year's coming. Chau, what about hatsumode?" },
    { speaker: "チャウ", japanese: "実は、まだ一度も伺ったことがなくて。ベトナムにいた頃は、家でTet(旧正月)の儀式が中心でしたので。", english: "Actually, I've never been once. In Vietnam, Tet rituals at home were the main thing." },
    { speaker: "友人", japanese: "へえ、そうなんだ。ベトナムでは、お正月にお寺や神社みたいなところには行かないの?", english: "Oh, really? In Vietnam, you don't go to a temple or shrine kind of place at New Year?" },
    { speaker: "チャウ", japanese: "お寺に伺うこともございます。ただ、家庭の先祖を祀る場所が中心でして、玄関の祭壇や、家族が集まって祈る形が多いです。", english: "We do visit pagodas. But the home altar for ancestors is central — a shrine at the entrance, family gathered to pray." },
    { speaker: "友人", japanese: "なるほど。日本も、家に仏壇がある家は同じような感じだよ。家族のご先祖を祀って、毎日手を合わせる。", english: "I see. In Japan too, homes with butsudan altars are similar — honoring family ancestors, praying daily." },
    { speaker: "チャウ", japanese: "そうなのですね。共通点があるのが嬉しいです。ところで、初詣について、お聞きしたいのですが、お寺と神社、両方に伺うのですか。", english: "I see — it's nice we share a thread. About hatsumode, may I ask — do people go to both temples and shrines?" },
    { speaker: "友人", japanese: "人によるかな。両方行く人もいるし、近所の神社一つだけって人も多い。私の家は、家の近くの神社と、お寺で祖父のお墓参りも兼ねる感じ。", english: "Depends on the person. Some go to both, many just to the neighborhood shrine. My family goes to the local shrine, plus the temple for my grandfather's grave." },
    { speaker: "チャウ", japanese: "そうなのですね。一つお伺いしてもよろしいですか。日本の方は、ご自分の宗教を「私は仏教徒」とか「私は神道です」と意識されているのでしょうか。", english: "I see. May I ask — do Japanese people think of their religion as 'I am Buddhist' or 'I am Shinto'?" },
    { speaker: "友人", japanese: "いい質問。実は、はっきり「私は何々教徒」って思ってる人は少数派なんだよね。多くの日本人は、神社にも行くし、お寺にも行くし、クリスマスも祝うし、お盆もする。実践はするけど、信仰の宣言はあまりしない。", english: "Good question. Honestly, those who think clearly 'I am X believer' are a minority. Many Japanese visit both shrines and temples, celebrate Christmas, observe Obon. We practice but rarely declare belief." },
    { speaker: "チャウ", japanese: "なるほど、それは面白いですね。実践と信仰宣言が分かれているのですね。", english: "I see — that's interesting. Practice and belief declaration are separate." },
    { speaker: "友人", japanese: "そうそう。チャウさんはベトナムで仏教の家庭で育った?", english: "Right. Chau, did you grow up in a Buddhist family in Vietnam?" },
    { speaker: "チャウ", japanese: "両親は仏教の影響が強い家庭で育ちましたが、私自身は、特定の宗教に強く属しているという意識は薄くて。先祖への敬意は深く感じておりますが、信仰の形は柔らかいかと存じます。", english: "My parents grew up in homes strongly influenced by Buddhism, but I myself don't feel strongly attached to a specific religion. I feel deep reverence for ancestors, but my faith form is soft." },
    { speaker: "友人", japanese: "それ、日本人の多くと近いかも。形はあるけど、教義に縛られない感じ。", english: "That might be close to many Japanese. There's a form, but not bound by doctrine." },
    { speaker: "チャウ", japanese: "そう感じます。文化と信仰が、分かちがたく溶け合っている感じが。", english: "Yes, that's how I feel. A sense that culture and faith are inseparably blended." },
    { speaker: "友人", japanese: "それじゃあ、初詣、ご一緒しようよ。作法は当日教えるから、心配しないで。", english: "Then let's do hatsumode together. I'll teach you the manners on the day; don't worry." },
    { speaker: "チャウ", japanese: "ぜひ、お願いいたします。それから、可能であれば、おじいさまのお墓参りにも、一緒に伺ってよろしいでしょうか。先祖を敬うお気持ちは、私にも自然なものですので。", english: "Yes please. And if possible — may I also accompany you to your grandfather's grave? Reverence for ancestors feels natural to me too." },
    { speaker: "友人", japanese: "もちろん。むしろ、そういう気持ちで一緒に来てくれるなら、祖父も喜ぶと思う。", english: "Of course. If anything, going together in that spirit — my grandfather would be glad." },
    { speaker: "チャウ", japanese: "ありがとうございます。来年、お互いの文化を少しずつ学べる年にできれば、嬉しく存じます。", english: "Thank you. If next year can be one where we learn each other's cultures bit by bit, I'd be glad." }
  ],
  roleplay_prompts: [
    "Bạn Nhật rủ bạn đi 初詣 (hatsumode) lần đầu. Hãy KHÔNG say 'I'm not religious' (sounds dismissive of their invitation). Cụm: zehi ukagaitai no desu ga, sahou wo kichinto zonjimasen de (rất muốn đi nhưng em không rành cách thức). Frame như willingness to participate respectfully, not declaration of belief.",
    "Bạn Nhật hỏi 'are you Buddhist?' Hãy KHÔNG declare definitively. Frame như practice-oriented identity. Cụm: sosen e no keii wa fukaku kanjite orimasu ga, shinkou no katachi wa yawarakai kato zonjimasu (em cảm reverence sâu với tổ tiên, nhưng tín ngưỡng dạng mềm). Avoid both 'yes I am' and 'no I'm not' — Japanese register prefers ambiguous middle.",
    "Bạn Nhật có grandfather đã mất, đang đi viếng mộ. Bạn xin được đi cùng. Hãy frame như continuation của cultural value bạn cũng share, không như religious tourism. Cụm: sosen wo uyamau o-kimochi wa, watakushi ni mo shizen na mono desu node, ojiisama no o-haka mairi ni, go-issho sasete itadaite mo yoroshii deshou ka. Reverent, brief, sincere."
  ],
  register_notes: "Tôn giáo Nhật khác phương Tây ở core. Năm patterns: (1) PRACTICE > DECLARATION: Nhật define religious identity through practice (visit shrine, observe Obon, do hatsumode), không through belief statement ('I am Christian'). KHÔNG ask 'what's your religion' bluntly — ask 'do you visit shrine at New Year' or 'do you observe Obon'. Practice-question là culturally fluent. (2) MULTI-PRACTICE NORMAL: nhiều Nhật visit shrine, temple, celebrate Christmas, marry Christian-style chapel. Foreigners may find logical contradiction; Japanese see như multiple cultural participations. KHÔNG point out 'inconsistency' — sounds insulting. (3) AVOID DOCTRINAL DEPTH: don't ask deep theology (which sect of Buddhism, which kami). Most Japanese don't know detail. Like asking American 'which exact Christianity'. Họ probably can't answer. Stay surface: practice questions, festival meanings broadly. (4) RESPECT ANCESTRAL PRACTICE: お墓参り (grave visit), お盆 ancestor festival — these resonate cross-culturally. Vietnamese ancestor reverence frames overlap. Lean into shared reverence, KHÔNG try to convert frame. (5) NEVER EVANGELIZE OR CRITIQUE: dù bạn deeply religious (Christian missionary background, Buddhist devotee), tránh sharing belief unless asked. Critiquing Japanese practices (Shinto as 'pagan', Buddhism as 'idolatrous') = serious offense. KHÔNG. // TODO native review — 'shinkou no katachi wa yawarakai' phrasing — alternative shinkou ga yuruyaka clearer cho some natives; one reviewer suggested 'shinkou-shin wa dansei ni atte' for personal frame though feels overly philosophical for casual register.",
  idiom_glosses: [
    { idiom: "苦しい時の神頼み", literal: "Khi khổ thì cầu thần", meaning: "Cầu khẩn chỉ khi cần — câu hơi tự châm biếm về cách nhiều Nhật engage tôn giáo, casual, KHÔNG sâu doctrine.", example: "苦しい時の神頼みと申しますが、平時から手を合わせる気持ちは大切にしたく存じます。" },
    { idiom: "和をもって貴しとなす", literal: "Coi sự hòa làm điều quý", meaning: "Lời Thái tử Shotoku — harmony between beliefs cao hơn doctrinal correctness.", example: "和をもって貴しとなすと申しますし、信仰が違っても、お互いを尊重したく存じます。" },
    { idiom: "袖振り合うも他生の縁", literal: "Vạt áo chạm nhau cũng là duyên kiếp", meaning: "Phật giáo nhân quả — encounter là karma. Phù hợp frame cross-cultural friendship as meaningful.", example: "袖振り合うも他生の縁と申しますが、文化を共有できる縁を、ありがたく感じております。" },
    { idiom: "ご縁", literal: "Mối duyên", meaning: "Cụm Phật giáo gốc nhưng broadly used cho any meaningful connection — comfortably bridges religious vs secular.", example: "ご縁があって、お互いの文化を学べる関係になれましたこと、心より感謝しております。" }
  ],
  cultural_notes_vi: "Tôn giáo Nhật khác hẳn nhiều quốc gia ở 6 điểm. (1) RELIGIOUS POPULATION FIGURES MISLEADING: surveys show ~70 phần trăm Japanese 'Buddhist', ~70 phần trăm 'Shinto' — overlaps because most practice both. Census doesn't capture 'declared belief' meaningfully. Don't take official statistics as identity statements. (2) TWO RELIGIONS COEXIST IN ONE LIFE: typical Japanese pattern — born blessed at Shinto shrine, married Christian-chapel style, funeral Buddhist. Each life event has dominant tradition. KHÔNG contradiction — different traditions for different roles. (3) SHINTO IS NATURE-BASED: 神社 (shrine) honors kami, often nature-related (mountains, trees, water). Worship is connection-with-nature ritual. KHÔNG comparable to monotheistic concept of god. Visiting shrine is more like visiting sacred park than 'house of god'. (4) BUDDHISM IS ANCESTOR-BASED PRIMARILY: most Japanese Buddhism practice là centered on ancestor remembrance (お盆, お彼岸 ohigan, お墓参り). Doctrinal depth (which sect, which sutra) rarely engaged. Funerals dominantly Buddhist. (5) CHRISTIANITY IS WEDDING/AESTHETIC: ~1-2 phần trăm Japanese identify Christian. But ~50 phần trăm of weddings have Christian-style chapel ceremony. Kitch role, không faith. KHÔNG conflate. (6) NEW RELIGIOUS MOVEMENTS (新興宗教): groups like Soka Gakkai, Tenrikyo, smaller — sometimes politically active. Mention of 新興宗教 thường carries skeptical tone. Don't bring up. Khác biệt với VN: ở VN tôn giáo thường declared (Phật giáo, Công giáo, Cao Đài, Hòa Hảo); ở Nhật, identity diffuse, practice-based. Vietnamese instinct 'I'm Buddhist therefore I do A, B, C' may feel rigid to Japanese friend. Họ practice without label. Mẹo: nếu bạn deeply Catholic (or other declared faith), share that fact gently, KHÔNG as identity claim. Cụm: watakushi wa katorikku no katei de sodachimashita node, kazoku no kankei de mai-shu kyoukai ni mairimasu (em lớn lên trong gia đình Công giáo, vì gia đình em đi nhà thờ hàng tuần). Frame qua practice and family, không belief statement. Long-term: many Japanese friends grateful when foreigner show interest in their festival practices (matsuri, hatsumode, Obon). Genuine engagement honors. Tour-guide engagement (ask 'Which exact deity is enshrined here?') feels academic. Engagement-mode (light prayer, follow customs, eat festival food, stay quiet at solemn moments) more meaningful. Mẹo cuối: khi at temple/shrine/funeral, observe trước, copy. KHÔNG ask 'what should I do' loud. Watch one or two people, follow. Nếu unsure of one specific (cuối nào, hands clap mấy lần), ask whisper to friend beside you. Quiet observation is honored.",
  tip_advice_vi: "Lần đầu hatsumode (sau Tết Tây): plan ahead. Friend Nhật có thể invite — nếu không, ask. Cụm: konno o-shougatsu, hatsumode ni go-issho sasete itadaite mo yoroshii deshou ka. Họ likely glad. Nếu bạn solo first time: chọn neighborhood shrine over Meiji Jingu (Tokyo's most famous, 3 million visitors first 3 days, 4-hour wait). Local shrines quieter, more authentic feel. Dress: nice clean clothes, KHÔNG too casual (ripped jeans inappropriate). Black or dark formal acceptable. Some Japanese wear kimono — không required for foreigner. Bring 5-yen coin (五円, go-en — homophone with 'fortune') hoặc 10-yen, 50-yen. Avoid 4-yen, 9-yen (homonyms with death/suffering). Khi tại shrine: line up at temizuya (water purification basin) first. Steps: pick up ladle right hand, water on left hand, switch, water on right hand, mouth rinse from cupped left hand (KHÔNG drink directly from ladle), tip ladle vertical to wash handle, return. Walk to main hall on side path (center belongs to kami). At offering box: bow once, ring bell if present, throw coin in box, bow twice deep, clap hands twice, prayer (silent — wish for year), bow once more. Khi tại temple (Buddhist): similar but no clapping. Just incense if offered, bows, palms together. Watch others, copy. Nếu friend present, follow them. After ceremony: many shrines/temples sell omamori (charm), omikuji (fortune slip). Light experience. KHÔNG mandatory. Khi friend invites đến funeral (Buddhist osoushiki): different protocol, see lesson 84. Don't conflate. Khi friend mentions kazoku no o-tera (family temple) — common among Japanese with butsudan home altar. Family temple ties go generations. If invited, attend respectfully. Đây is significant gesture — họ trust bạn with deep family heritage. Wear dark formal, bring small gift for family (KHÔNG flowers — temples have own arrangements). Bow at altar entrance. Pray briefly. Speak quiet throughout. Long-term: nếu seriously interested, study one tradition lightly. Read Heart Sutra English translation, visit famous temple in Kyoto, attend small matsuri. KHÔNG fake depth — surface honest engagement honored. Mẹo về Vietnamese identity: nếu chia sẻ Vietnamese ancestor practice với Japanese friend, frame như cousin practice, không alternative practice. Cụm: shaba mo nihon mo, sosen wo uyamau katachi ga aru tokoro ga, ureshii desu (Vietnam và Japan đều có cách tôn kính tổ tiên, mừng vì điểm chung). Builds bridge, không separation. Mẹo cuối: never debate religion sau alcohol. Drinks party + religion talk = no good outcome. Save serious religion conversation for sober daytime, private setting.",
  exercises: [
    { type: "fill-blank", question: "信仰は人それぞれですので、お互いの考えを___したく存じます。", answer: "尊重" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "ご縁", english: "Buddhist-origin term broadly bridging religious/secular connection" },
      { japanese: "信仰の形は柔らかい", english: "soft, practice-based identity frame (Japanese-friendly)" },
      { japanese: "先祖を敬うお気持ち", english: "shared ancestor reverence frame (cross-cultural bridge)" },
      { japanese: "実践と信仰宣言が分かれている", english: "Japan's separation of practice from belief declaration" }
    ] },
    { type: "translation", vietnamese: "Em rất muốn đi cùng — chỉ là chưa rành cách thức.", japanese: "ぜひ伺いたいのですが、作法をきちんと存じませんで。" }
  ]
},
{
  id: 90,
  title: "Hearing a friend share a difficult past — being a good listener",
  title_vi: "Lắng nghe bạn chia sẻ trải nghiệm quá khứ khó khăn",
  title_en: "Hearing a friend share a difficult past — being a good listener",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "過去 (かこ)", english: "past" },
    { japanese: "経験 (けいけん)", english: "experience" },
    { japanese: "打ち明ける (うちあける)", english: "to confide / open up" },
    { japanese: "聞き手 (ききて)", english: "listener" },
    { japanese: "相づち (あいづち)", english: "verbal cues acknowledging the speaker" },
    { japanese: "共感 (きょうかん)", english: "empathy" },
    { japanese: "詮索 (せんさく)", english: "prying / probing" },
    { japanese: "信頼 (しんらい)", english: "trust" },
    { japanese: "受け止める (うけとめる)", english: "to receive / take in (a heavy thing)" },
    { japanese: "そっと", english: "softly / quietly" }
  ],
  examples: [
    { japanese: "話してくださって、ありがとうございます。", english: "Thank you for telling me." },
    { japanese: "詳しくお聞きしてもよろしいですか、ご無理であれば、もちろん結構です。", english: "May I ask more, if it's OK — if it's hard, of course not." },
    { japanese: "お気持ち、想像することしかできませんが、お聞きしております。", english: "I can only imagine your feelings, but I'm listening." },
    { japanese: "あなたが今ここにいてくださること、それ自体が貴重に感じます。", english: "Just your being here now — that itself feels precious." },
    { japanese: "今日伺ったお話は、私の中だけにとどめておきます。", english: "What I heard today, I'll keep within me." }
  ],
  dialogue: [
    { speaker: "友人", japanese: "実は、誰にもあまり話してこなかったことがあって。", english: "Actually, there's something I've barely told anyone." },
    { speaker: "チャウ", japanese: "...伺ってもよろしいですか。話したくなければ、もちろん大丈夫です。", english: "...may I hear? If you don't want to tell me, of course that's fine too." },
    { speaker: "友人", japanese: "ううん、聞いてもらえるなら、聞いてほしい。", english: "No — if you'll listen, I want you to." },
    { speaker: "チャウ", japanese: "ゆっくりで、大丈夫です。", english: "Slowly — it's all right." }
  ],
  dialogue_long: [
    { speaker: "友人", japanese: "今日、変な話、いいかな。", english: "Today — is it OK if I say something a bit unusual?" },
    { speaker: "チャウ", japanese: "もちろんです。どうされましたか。", english: "Of course. What is it?" },
    { speaker: "友人", japanese: "実は、誰にもあまり話してこなかったことが、あるの。チャウさんなら、聞いてくれるかもしれないと思って。", english: "Actually — there's something I haven't really told anyone. I thought you might be one who'd listen." },
    { speaker: "チャウ", japanese: "信頼していただいて、ありがとうございます。話していただける範囲で構いません。途中でやめてくださっても、大丈夫です。", english: "Thank you for the trust. Only what you can share. It's fine to stop midway." },
    { speaker: "友人", japanese: "ありがとう。十年くらい前に、ちょっと辛い経験があって。詳細は、まだ話せないんだけど、それから、人を信じるのが難しくなった時期があって。", english: "Thanks. About ten years ago, I had a difficult experience. I can't speak the details yet, but after that, there was a period when trusting people became hard." },
    { speaker: "チャウ", japanese: "...そうでしたか。話していただいて、ありがとうございます。詳細を伺うつもりはございません。", english: "...I see. Thank you for sharing. I don't intend to ask details." },
    { speaker: "友人", japanese: "うん。ただ、知ってほしかった。私が時々距離を取るのは、その経験から来てて、チャウさんに対する気持ちじゃない、ってこと。", english: "Yeah. I just wanted you to know. When I sometimes pull back, it's from that experience — not feelings about you." },
    { speaker: "チャウ", japanese: "ご本人がそう感じていらっしゃることだけで、十分理解できます。距離を取られる時、私のせいかと思ったこともございましたが、これからはそう感じずにいられます。", english: "Just knowing how you feel — that's enough understanding. When you pulled back, sometimes I wondered if it was me; from now I won't feel that way." },
    { speaker: "友人", japanese: "ごめんね、心配かけてた。", english: "Sorry — I'd worried you." },
    { speaker: "チャウ", japanese: "とんでもございません。話すか話さないか、それを決められるのはあなたです。私はどちらでも構わない、ということだけ、お伝えしたく存じます。", english: "Not at all. To speak or not — that's yours to decide. Whichever, I'm here — I just wanted to convey that." },
    { speaker: "友人", japanese: "...ありがとう。実は、誰かにそう言ってもらえて、すごく楽になった。多くの人は、聞いた瞬間、詳細を聞きたがる。", english: "...thank you. Hearing someone say that, I feel really lighter. Most people — the moment they hear, they want details." },
    { speaker: "チャウ", japanese: "詳細は、今日の核心ではないかと存じます。あなたが今ここにいて、こうして話してくださっていること、それ自体が貴重に感じております。", english: "Details aren't today's core, I think. Your being here, talking like this — that itself feels precious." },
    { speaker: "友人", japanese: "そういう聞き方をしてくれる人、本当に少ない。チャウさんに話せて、よかった。", english: "People who listen this way — really rare. I'm glad I could tell you." },
    { speaker: "チャウ", japanese: "信頼していただいて、こちらこそ感謝しております。一つだけ、お聞きしてもよろしいですか。今、その経験について、専門のサポートを受けていらっしゃいますか。差し支えなければ。", english: "Thank you for the trust. May I ask one thing? About that experience — are you receiving any professional support now? If it doesn't trouble you." },
    { speaker: "友人", japanese: "うん、五年くらい前から、定期的にカウンセリングに通ってる。今は落ち着いてる。ありがとう、聞いてくれて。", english: "Yes — I've been going to regular counseling for about five years. I'm settled now. Thank you for asking." },
    { speaker: "チャウ", japanese: "それは、本当に、心強く伺いました。サポートを受けていらっしゃること、ご自分のために選ばれた強さだと感じております。", english: "That's truly reassuring to hear. Receiving support — that's a strength you chose for yourself, I feel." },
    { speaker: "友人", japanese: "そう言ってもらえると嬉しい。普段、こういう話する機会、ほぼないから。", english: "Hearing that makes me glad. I rarely get to talk this way." },
    { speaker: "チャウ", japanese: "今日伺ったお話は、私の中だけにとどめておきます。これからも、お話したい時、伺いたくない時、あなたのペースで構いません。", english: "What I heard today, I'll keep within me. From now on — when you want to talk, when you don't — at your pace." },
    { speaker: "友人", japanese: "ありがとう。本当に、聞いてくれて、ありがとう。", english: "Thank you. Truly, thank you for listening." }
  ],
  roleplay_prompts: [
    "Bạn Nhật mở miệng nói 'có chuyện em chưa kể với ai'. Hãy KHÔNG bắt đầu interview. Cụm safe response: ukagatte mo yoroshii desu ka. hanashitakunakereba, mochiron daijoubu desu (xin được nghe — nếu không muốn cũng OK). Họ get full agency to start, pause, stop.",
    "Bạn Nhật share một event broad strokes ('tough experience 10 năm trước'). Hãy KHÔNG ask 'what happened'. Cụm: shousai wo ukagau tsumori wa gozaimasen (em không có ý hỏi chi tiết). Receive what they offered, không probe. Detail belongs to them — bạn không có right.",
    "Sau khi listen, bạn ask gentle về current support. Hãy KHÔNG sound clinical, KHÔNG suggest counseling như judgment. Cụm: senmon no sapooto wo ukete irassharu masu ka. sashi-tsukae nakereba (đang nhận support chuyên nghiệp không, nếu không phiền). Frame như care, không as 'you should get help'."
  ],
  register_notes: "Listen to past trauma in Nhật cần extreme restraint. Mục tiêu: nhận, không xử lý. Năm patterns: (1) ASK PERMISSION TO HEAR: dù họ initiate share, ask permission to receive: ukagatte mo yoroshii desu ka cộng remind họ can stop: hanashitakunakereba, mochiron daijoubu desu. Đây không là rejection — là respect for agency. They feel safer. (2) NEVER PROBE FOR DETAILS: dù curiosity nature, KHÔNG ask 'what happened'. Họ already chose how much to share. Probing = retraumatize. Cụm explicit: shousai wo ukagau tsumori wa gozaimasen (don't intend to ask details). Họ feel safe. (3) AIZUCHI DURING LISTEN: Nhật conversational rhythm needs verbal cues — soft 'sou desu ka', 'naruhodo', 'hai'. Without them, sounds như bạn không listening. Use them often, low volume, neutral tone. KHÔNG say 'wakarimasu' (I understand) — bạn KHÔNG fully understand, sounds dismissive. (4) DON'T COMPARE: KHÔNG share parallel story unless họ explicitly invite ('have you experienced something like that'). Otherwise feels like bạn making it about you. Nhật value fully receiving, không exchanging. (5) CONFIDENTIALITY VERBAL COMMITMENT: explicit say bạn'll keep it. Cụm: kyou ukagatta o-hanashi wa, watakushi no naka dake ni todomete okimasu. Đây signals safety. Without it, họ wonder if họ shared too much. // TODO native review — 'shousai wa kyou no kakushin de wa nai kato' phrasing — alternative shousai yori, kotoba ni shitai koto wo o-machi shimasu mềm hơn cho some natives; reviewer cautioned 'soredemo' as opener might sound too soft, suggested 'tatoe so dewa nakute mo'.",
  idiom_glosses: [
    { idiom: "胸に秘める", literal: "Giữ trong lòng", meaning: "Giữ điều gì kín — phù hợp commit confidentiality after hearing past.", example: "今日伺ったお話は、胸に秘めておきます。" },
    { idiom: "沈黙は金", literal: "Im lặng là vàng", meaning: "Đôi lúc im lặng quý hơn lời — phù hợp resist urge to fill space khi friend share painful.", example: "沈黙は金と申しますが、相手の方がお話しになる時は、ただ静かに伺うのが、いちばんの応援かと存じます。" },
    { idiom: "察する", literal: "Đọc, cảm nhận", meaning: "Khái niệm core Japan — read what's not said. Phù hợp listen nuance, không demand explicit.", example: "察するという言葉、お話を伺いながら、改めて深さを感じております。" },
    { idiom: "そっと寄り添う", literal: "Nhẹ nhàng kề bên", meaning: "Stay close softly — Nhật ideal cho support without intrusion.", example: "言葉ではなく、そっと寄り添うことが、いちばん大切なときかと存じます。" }
  ],
  cultural_notes_vi: "Lắng nghe đau thương quá khứ ở Nhật khác phương Tây ở 6 điểm. (1) DETAIL HIERARCHY: Nhật value tóm tắt high-level over detail. 'Tough experience 10 years ago' đủ. KHÔNG follow-up với 'tell me what happened'. Foreigner instinct là understand fully — Nhật give safe abstraction. (2) SILENCE SUPPORTS: Western instinct fill silence với supportive words. Nhật silence as support. Sit with friend in quiet 30 giây sau they finish a hard sentence — that silence acknowledges weight. Words too quick = minimize. (3) NO COMPARISON: KHÔNG 'I had something similar'. Even if true. Họ chose to bring story to you, không to invite mutual exchange. Wait until they explicitly invite. (4) CONFIDENTIALITY ABSOLUTE: don't tell anyone, even spouse, even subtle hint. Nhật small social circles — leak gets back. Once trust violated, never recovered. (5) PROFESSIONAL HELP STIGMA SHIFTING: counseling/therapy stigma reducing in Japan, but still exist. If friend mention they're in therapy, treat as positive (not concerning). Cụm: senmon no sapooto wo erabareta, sore jitai ga go-jishin no tame no tsuyosa kato zonjimasu (choosing professional support is itself strength chosen for self). Affirms strength, không pathologize. (6) NOT YOUR JOB TO FIX: foreigner instinct là solve. Nhật instinct là witness. Mục tiêu: họ feel less alone, không họ healed. Healing belongs to them + therapist. Bạn role: be one trustworthy witness. Khác biệt với VN: ở VN trauma sharing thường includes group support, family-wide knowledge, public emotional release; ở Nhật, intensely private, often confided to one or two people max. Vietnamese 'let me tell my mother so she can also support you' = breach of trust to Japanese friend. Confidentiality stricter than VN expects. Mẹo: nếu friend's share suggest current safety risk (active danger from someone, suicidal ideation, severe symptoms not getting help), gently inform crisis resources — TELL Hotline 03-5774-0992 (Japanese/English 24h), Yorisoi Hotline 0120-279-338. Don't insist. Plant seed. Long-term: chỉ vì họ shared, đừng treat họ như fragile. Day after, tomorrow, next week — treat normal. Bring up only if họ initiate. Forced check-ins ('how are you doing with that thing') makes them feel defined by trauma. They trusted you to receive AND move on normally. Hold both. Mẹo cuối: process your own response. Hearing friend's pain heavy. Talk with your own support (your spouse, your own therapist). KHÔNG share friend's specifics — share your own emotional response. Self-care protects your capacity to be there long-term.",
  tip_advice_vi: "Khi friend signal họ might share something heavy: setting matters. Confirm private space (home, your home, isolated cafe corner — KHÔNG group setting, KHÔNG public restaurant where overheard). Time generous (allow 2+ hours, KHÔNG slot meeting). Devices off or silent. Khi họ open: don't react big. Calm face. Soft 'hai'. Wait for them to continue. KHÔNG immediate questions. Body language: lean slightly toward, hands visible, KHÔNG cross-armed. Eye contact 50-60 phần trăm — break occasionally so họ don't feel pressured. Khi họ pause mid-share: don't fill. Silence supports. Wait 5-10 giây. Often họ continue. Nếu họ truly stuck, soft prompt: dou ka, yukkuri de daijoubu desu (slowly is fine). Khi họ finish broad-strokes: thank them. Cụm: hanashite kudasatte, arigatou gozaimasu cộng acknowledge weight: o-kimochi, souzou suru koto shika dekimasen ga, ukagatte orimasu. KHÔNG say 'I understand'. KHÔNG offer solutions. KHÔNG share parallel. Khi consider asking probe: ASK PERMISSION first. Cụm: hitotsu, ukagatte mo yoroshii desu ka. Họ consent or deflect. Nếu deflect, accept. Khi consider mention professional support: gentle, low-pressure. Cụm: senmon no sapooto wo ukete irassharu masu ka. sashi-tsukae nakereba (receiving professional support, if not too prying). If yes, affirm choice. If no, KHÔNG push. Just plant: ima dekiru sapooto wa, takusan arimasu (current support options are many) cộng quietly mention TELL Hotline numbers in casual context (later, không this conversation). Closing the share: explicit confidentiality commitment. Cụm: kyou ukagatta o-hanashi wa, watakushi no naka dake ni todomete okimasu. Releases their anxiety. Then offer continuity: korekara, hanashitai toki, hanashitakunai toki, anata no peisu de kamaimasen. Sau conversation: don't bring up next time họ see you. Treat normal. Họ initiate continuation if họ want. Maintain otherwise normal interaction patterns. Self-care for you: process within 24-48 hours với your own support. Friend's pain you absorbed needs your own outlet — your own therapist, journal, spouse (general only, không specifics). Maintaining your container essential for long-term capacity. Mẹo nếu họ check after: bạn don't volunteer 'I'm still thinking about what you told me'. Acknowledge quietly: ano hi no o-hanashi, watakushi no naka de ikitsuzukete imasu. arigatou gozaimasu (what you shared lives on inside me — thank you). Brief. Then back to normal life. Long-term: nếu over years they slowly share more, receive each layer with same care. KHÔNG accumulate as 'now I know full story'. Each layer is gift. Treat individually. Mẹo cuối nếu họ revoke share ('I shouldn't have told you'): respond with calm reassurance. Cụm: dou ka, go-anjin nasatte kudasai. wasureru wake dewa arimasen ga, anata no go-zonjite no o-hanashi de gozaimasu (please rest assured — won't forget but it's yours to dictate). Họ may push trust limit; calm response stabilizes. KHÔNG abandon. KHÔNG over-reassure either.",
  exercises: [
    { type: "fill-blank", question: "話してくださって、ありがとう___ます。", answer: "ござい" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "詳細を伺うつもりはございません", english: "explicitly remove pressure to share details" },
      { japanese: "胸に秘めておきます", english: "verbal confidentiality commitment" },
      { japanese: "ご自分のために選ばれた強さ", english: "affirm choice to seek professional support, not pathologize" },
      { japanese: "あなたのペースで構いません", english: "release them from obligation to revisit" }
    ] },
    { type: "translation", vietnamese: "Cảm xúc của bạn em chỉ có thể tưởng tượng — em đang lắng nghe.", japanese: "お気持ち、想像することしかできませんが、お聞きしております。" }
  ]
},
{
  id: 91,
  title: "Setting boundaries in a friendship — when too much is asked",
  title_vi: "Đặt giới hạn trong tình bạn — khi ai đó đòi quá, nói quá, hỏi quá",
  title_en: "Setting boundaries in a friendship — when too much is asked",
  category: "fluency",
  level: "B2",
  vocabulary: [
    { japanese: "境界 (きょうかい)", english: "boundary" },
    { japanese: "距離感 (きょりかん)", english: "sense of closeness/distance" },
    { japanese: "余裕 (よゆう)", english: "capacity / room (emotional)" },
    { japanese: "限界 (げんかい)", english: "limit" },
    { japanese: "断る (ことわる)", english: "to decline" },
    { japanese: "踏み込む (ふみこむ)", english: "to step too far in / overreach" },
    { japanese: "プライベート", english: "private (life)" },
    { japanese: "尊重 (そんちょう)", english: "respect" },
    { japanese: "心地よい (ここちよい)", english: "comfortable" },
    { japanese: "わきまえる", english: "to know one's place / observe propriety" }
  ],
  examples: [
    { japanese: "今、少し余裕がございませんで、申し訳ございません。", english: "I don't quite have the capacity right now — I apologize." },
    { japanese: "そのお話は、私の中で少し抱えるのが難しいかと存じます。", english: "That topic is a little hard for me to hold in." },
    { japanese: "プライベートに関わる質問は、申し訳ないのですが、お答えしかねます。", english: "Regarding private matters, I'm sorry but I can't answer." },
    { japanese: "頻度を少し落とさせていただいてもよろしいでしょうか。", english: "May I reduce the frequency a little?" },
    { japanese: "関係を大切にするためにも、距離感を見直したく存じます。", english: "Precisely because I value the relationship, I'd like to reconsider the closeness." }
  ],
  dialogue: [
    { speaker: "友人", japanese: "また土曜、家に来て、夜まで話そうよ。", english: "Come over Saturday again, talk till night." },
    { speaker: "チャウ", japanese: "お誘い、ありがとうございます。今月、少し余裕がなくて、ご連絡を控えさせていただいておりました。", english: "Thanks for inviting. This month I don't have much capacity; I've been holding back." },
    { speaker: "友人", japanese: "あ、忙しい? 来月でもいい?", english: "Oh, busy? Next month OK?" },
    { speaker: "チャウ", japanese: "はい、来月、少し余裕が出てきたら、こちらからご連絡させていただきます。", english: "Yes — when I have more capacity next month, I'll reach out." }
  ],
  dialogue_long: [
    { speaker: "チャウ", japanese: "今日は、少しお話ししたいことがあって。", english: "Today, there's something I'd like to discuss." },
    { speaker: "友人", japanese: "うん、なに?", english: "Sure, what?" },
    { speaker: "チャウ", japanese: "実は、ここ数ヶ月、お互いの距離感について、少し考えていることがありまして。", english: "Actually, the past few months, I've been thinking a bit about the closeness between us." },
    { speaker: "友人", japanese: "距離感? 何か嫌なことしちゃったかな。", english: "Closeness? Did I do something unwelcome?" },
    { speaker: "チャウ", japanese: "とんでもございません。むしろ、関係を大切にしたいからこそ、お話ししておきたいことなのです。", english: "Not at all. It's precisely because I want to value the relationship that I want to bring it up." },
    { speaker: "友人", japanese: "うん、聞かせて。", english: "OK, tell me." },
    { speaker: "チャウ", japanese: "最近、毎週末ご一緒する機会が多くて、私としても嬉しい時間なのですが、平日のメッセージのやり取りも頻繁になってきて、少し息切れを感じる瞬間がございまして。", english: "Recently we've been together most weekends, which I cherish — but with frequent weekday messages too, I've felt out of breath at times." },
    { speaker: "友人", japanese: "...そうだったんだ。私、気づかなかった。", english: "...I see. I didn't notice." },
    { speaker: "チャウ", japanese: "お互い様なのですが、私の家族や仕事の状況もあって、最近少し余裕がなくて。それを、頻度に出さずに対応していたのですが、自分の中で抱えるのが少し難しくなってきました。", english: "It's mutual — but with family and work, I've had less capacity. I tried to handle it without changing frequency, but it's getting hard to hold inside." },
    { speaker: "友人", japanese: "そっか。もっと早く言ってくれたらよかったのに。", english: "I see. You could have said sooner." },
    { speaker: "チャウ", japanese: "言いそびれてしまって、申し訳ございません。今日、思い切ってお話ししたく、お時間いただきました。", english: "I missed the moment — I'm sorry. Today I steeled myself to bring it up." },
    { speaker: "友人", japanese: "ううん、話してくれてありがとう。具体的には、どんな感じにしたい?", english: "No, thanks for telling me. Specifically, how would you like it?" },
    { speaker: "チャウ", japanese: "毎週末ではなく、二週間に一度くらいにさせていただいて、メッセージも、急ぎでないものは即返信ではなく、翌日になることもあること、ご理解いただけたら嬉しく存じます。", english: "Rather than every weekend, perhaps once every two weeks, and for messages that aren't urgent, I might reply the next day instead of immediately — if you'd understand." },
    { speaker: "友人", japanese: "もちろん。むしろ、私の方が、頼りすぎてたかもしれない。気をつける。", english: "Of course. If anything, I might have been leaning on you too much. I'll be mindful." },
    { speaker: "チャウ", japanese: "頼っていただくこと自体は、嬉しく思っております。ただ、少しペースを調整させていただけたら、長く心地よい関係でいられるかと存じまして。", english: "Being relied on itself I welcome. Just adjusting pace a little — so we can stay in a comfortable relationship long-term." },
    { speaker: "友人", japanese: "それ、すごくいいこと言ってくれた。長く続く関係って、お互いの呼吸が合ってこそだもんね。", english: "That's a really good thing you said. Long-lasting relationships need the breathing to match." },
    { speaker: "チャウ", japanese: "そう感じております。それから、もう一つだけ、お話ししたいことがありまして。", english: "I feel that way. And one more thing I'd like to mention." },
    { speaker: "友人", japanese: "うん、何でも。", english: "Sure, anything." },
    { speaker: "チャウ", japanese: "プライベートな話題、特に家族のお金のことや夫婦のことについて、最近よくお聞きいただくのですが、その辺りは、私の中で、まだ言葉にしにくい部分がございまして。", english: "Private topics — especially family finances or my relationship with my spouse — you often ask about lately, but those parts I'm still finding hard to put into words." },
    { speaker: "友人", japanese: "あ、ごめん、踏み込みすぎてた。気をつける。", english: "Ah, sorry — I was overstepping. I'll be mindful." },
    { speaker: "チャウ", japanese: "悪気がないことは、十分に存じております。ただ、お互いに踏み込まない領域を少し意識いただけると、長く心地よい関係を保てるかと。今日、お話しできてよかったです。", english: "I know there's no ill intent. Just a little awareness of areas not to step into helps us keep a comfortable relationship long-term. I'm glad we could talk today." },
    { speaker: "友人", japanese: "私こそ、教えてくれてありがとう。チャウさんの言いたいこと、ちゃんと聞けた。", english: "I'm the one to thank for telling me. I heard what you wanted to say." }
  ],
  roleplay_prompts: [
    "Bạn cần giảm tần suất gặp bạn Nhật từ weekly to bi-weekly. Hãy KHÔNG accuse họ ('you ask too much'), KHÔNG vague ('busy'). Cụm: kankei wo taisetsu ni shitai kara koso (vì muốn quý mối quan hệ) cộng kongo, ni-shuukan ni ichido kurai ni sasete itadaite. Frame như preserve relationship, KHÔNG avoid them.",
    "Bạn Nhật ask về money/partner relationship details bạn không muốn share. Hãy KHÔNG harsh refuse. Cụm: puraibeeto ni kakawaru shitsumon wa, moushiwake nai no desu ga, o-kotae shikaaemasu cộng remind tình cảm. KHÔNG explain why — explanation invites debate.",
    "Bạn Nhật understand and apologize for overstepping. Hãy KHÔNG over-reassure (sounds insincere). Brief acceptance: warugi ga nai koto wa, juubun ni zonjite orimasu (em hiểu bạn không có ý xấu). Then move forward — KHÔNG dwell. Quick reset preserves dignity for both."
  ],
  register_notes: "Setting boundaries với bạn thân ở Nhật cần frame as preservation, không rejection. Năm patterns: (1) FRAME PROTECTS RELATIONSHIP: open với 'because I value you'. Cụm: kankei wo taisetsu ni shitai kara koso, kyou kono o-hanashi wo sasete itadaite imasu. KHÔNG sound like complaint — sound như mutual investment in long-term. (2) SELF-ATTRIBUTE LIMITATION: KHÔNG accuse họ ('you ask too much'). Self-attribute: jibun no naka de kakaeru no ga muzukashiku natte (becoming hard for me to hold). Họ save face; bạn don't accuse. Both walk away clean. (3) BE SPECIFIC ABOUT CHANGE: KHÔNG vague 'less often'. Specific: ni-shuukan ni ichido (every two weeks). Số rõ. Allows họ adjust expectations precisely. Vague invites repeated boundary testing. (4) PROTECT PRIVATE TOPICS WITHOUT EXPLANATION: KHÔNG justify why a topic off-limits. Cụm: sono atari wa, watakushi no naka de mada kotoba ni shi nikui bubun ga gozaimashite (those parts I'm finding hard to put in words). Genuine, không argumentative. Họ accept without debate. (5) RESET QUICK: sau họ acknowledge và apologize, KHÔNG dwell. Brief acceptance + move on. Cụm: warugi ga nai koto wa juubun zonjite orimasu cộng pivot to lighter topic. Long apology dwell = makes them feel defective. // TODO native review — 'kazoku no o-kane no koto ya fuufu no koto' phrasing — alternative kazoku no jijou (family circumstances) more general; native reviewer suggested 'kojin teki na koto' for cleaner private-frame; some natives uncomfortable with 'fuufu no koto' as it implies marital trouble — alternative go-katei no naijou.",
  idiom_glosses: [
    { idiom: "親しき仲にも礼儀あり", literal: "Trong gần thân vẫn có lễ", meaning: "Bài học core cho lesson này — ngay cả friendship sâu cần boundary respect.", example: "親しき仲にも礼儀ありと申しますし、お互いの領域を少し意識することで、長くいい関係でいられるかと。" },
    { idiom: "腹八分に医者いらず", literal: "Bụng tám phần thì không cần bác sĩ", meaning: "Không tham, ăn 80 phần trăm — phù hợp metaphor cho friendship: 80 phần trăm closeness sustainable, 100 phần trăm burns out.", example: "腹八分に医者いらずと申しますが、関係も同じで、適度な距離感が長続きの秘訣かと存じます。" },
    { idiom: "立つ鳥跡を濁さず", literal: "Chim bay đi không làm đục nước", meaning: "Để không vết bẩn — phù hợp khi reset friendship dynamic, mỗi side leaves clean.", example: "立つ鳥跡を濁さずと申しますし、今日のお話で、お互い気持ちよく次の段階に進めればと存じます。" },
    { idiom: "わきまえる", literal: "Biết phận mình", meaning: "Khái niệm Nhật về biết giới hạn của mình + người khác. Apply both ways here.", example: "お互いに、わきまえるべきところはわきまえる、それが大人の友情かと存じます。" }
  ],
  cultural_notes_vi: "Boundaries trong friendship Nhật khác phương Tây ở 6 điểm. (1) BOUNDARIES IMPLIED, NOT NAMED: phương Tây openly discuss 'boundaries'. Nhật rarely use word 境界 trong personal context — too clinical. Frame qua action ('reduce frequency') rather than concept ('I'm setting a boundary'). Verbal directness tự nó gây awkward. (2) ENRYO PROTECTS BOTH SIDES: Nhật default đã có hidden boundary qua enryo (politely holding back). Foreigners may feel Japanese 'cold' in early friendship — actually Nhật protecting both. As friendship deepens, less enryo, more access. Trip line is mutual signal. (3) FREQUENCY HAS NORMS: weekend friendship contact: monthly meet for casual friendship, bi-weekly for close, weekly for very close (but rare). Daily messaging unusual outside romantic relationships. If your friend started weekly + daily messages quickly, đó intensity outside Japanese norm. Pulling back to bi-weekly = realigning to norm, không rejection. (4) PRIVATE TOPICS ARE NOT-DISCUSSED LIST: salary, debt, marital issues, parent health, fertility — most Nhật don't discuss with friends. Even close. Pháp gia keeps these. Foreign friends may bring openness from home culture — Japanese friend may quietly retreat. (5) ASKING ABOUT INCOME = SERIOUS BREACH: Western 'how much do you make' = perceived as deeply rude, even between close friends. KHÔNG ask. Even joking. Flag as boundary instantly if friend asks bạn — gentle redirect. (6) FAMILY MATTERS MOSTLY OFF-LIMITS: parents, siblings, marital — most Nhật share little. Foreigners trained sharing as bonding may overshare and confuse. Calibrate to friend's level. Khác biệt với VN: ở VN bạn thân chia sẻ rộng rãi family, money, romance — bonding qua disclosure; ở Nhật, bonding qua shared activity, time, restraint. Vietnamese 'tell me about your husband' may startle Japanese friend. Adjust questions. Mẹo: nếu bạn want share khía cạnh personal, share YOUR side first — họ may reciprocate or may not. KHÔNG demand reciprocity. Nếu họ don't reciprocate, accept as preference. Long-term: Nhật friendships build slowly, last decades. Boundary respect early prevents burnout. Friend who pushes too fast often loses Japanese friend permanently — họ withdraw silent, no second chance. Better: maintain measured pace, expand slowly. Mẹo cuối: nếu boundary conversation goes badly (họ defensive, không accept), give space. KHÔNG escalate. 1-2 weeks of less contact often resets. Họ may reach out với accommodation. Nếu họ truly don't accommodate, friendship may not be compatible long-term — accept gracefully.",
  tip_advice_vi: "Trước khi raise boundary: clarify within yourself. (a) WHAT specifically over-line — frequency, topic depth, time of day, type of request. Be precise. (b) WHY problematic — bạn capacity, bạn values, bạn other commitments. Self-knowledge needed. (c) WHAT alternative bạn propose — not just 'less'. Specific alternative ('every two weeks' / 'reply next day'). Choose timing: KHÔNG mid-event, KHÔNG over text. In-person, private, sit-down. Brief preview message: chotto o-hanashi shitai koto ga atte, kondo ocha demo dou desu ka. Họ may anxiously imagine worse — that's OK, urgency communicates importance. Tại meeting: warm-up first 10 phút. Then transition naturally. KHÔNG dive in. Cụm: jitsu wa, sukoshi o-hanashi shitai koto ga atte cộng pause. Họ ready. State your frame first: kankei wo taisetsu ni shitai kara koso (because I value the relationship). Đây removes defensive armor. State specific issue + specific proposal. Calm voice. KHÔNG list grievances — focus on going forward. Họ likely respond apologetic. Accept gracefully. Brief acknowledgment of their non-fault intent. Cụm: warugi ga nai koto wa, juubun zonjite orimasu. Pivot to confirmation: kongo, X to iu katachi de kamaimasen ka (going forward, X format OK?). Họ confirm. Move to lighter topic. End meeting normal — KHÔNG awkward early exit. Kéo dài để the boundary conversation đặt trong relationship continuity, không là sự kiện isolated. Sau meeting: brief follow-up message within 24 hours. KHÔNG repeat boundary. Brief: kyou wa, hanashite kudasatte, arigatou gozaimashita. Hold thread normal. Long-term test: 2-4 weeks later, do họ respect new pattern? Nếu yes, friendship strengthens. Nếu họ test boundary repeatedly (revert to old frequency, push private topic again), reinforce calmly. Cụm reinforcement: senjitsu o-hanashi shita to oori, kongo wa kono peisu de o-negai shimasu (as we discussed, please continue at this pace). Friendly firm. Patient. Đây pattern điều chỉnh thường takes 2-3 cycles. Mẹo về tự-monitor: bạn bản thân have responsibility to communicate before resentment builds. Nhật don't read foreign-mind well — họ honest don't know unless told. Speak up early. Mẹo nếu bạn của bạn bị overstepping pattern: assess if it's friendship-fixable or pattern-of-personality. Một honest person làm well-meaning mistake fixable. Người ta không respect after told 2-3 lần probably won't ever. Walk away gracefully thì fine. Cụm soft retreat: sukoshi peisu wo ochitose-tu (slowing pace a bit) cộng gradually reduce. Họ may take notice and self-correct, hoặc gradually fade. Both acceptable. Mẹo về protecting yourself: maintain other friendships outside Japanese friend. Diverse network = không depend on one. Multiple shallow ties + 2-3 deep > one all-encompassing. Healthier for everyone. Mẹo cuối: học một câu safe deflection cho prying questions. Cụm 'sono atari wa, jibun no naka de mada kotoba ni dekinai bubun de gozaimashite' (those parts I'm finding hard to put in words yet) — vague, polite, non-debatable. Use khi unwanted intimate question. Họ accept without push.",
  exercises: [
    { type: "fill-blank", question: "関係を大切にするためにも、___感を見直したく存じます。", answer: "距離" },
    { type: "matching", instruction: "Ghép cụm với function.", pairs: [
      { japanese: "関係を大切にしたいからこそ", english: "frame boundary as preserving the relationship" },
      { japanese: "自分の中で抱えるのが難しくなって", english: "self-attribute limitation, no accusation" },
      { japanese: "二週間に一度くらいに", english: "specific number — clearer than 'less often'" },
      { japanese: "言葉にしにくい部分", english: "off-limits topic frame without justification" }
    ] },
    { type: "translation", vietnamese: "Câu hỏi về chuyện riêng tư — em xin lỗi nhưng không trả lời được.", japanese: "プライベートに関わる質問は、申し訳ないのですが、お答えしかねます。" }
  ]
},
{
  id: 92,
  title: "Academic discourse — presenting a thesis / hypothesis",
  title_vi: "Diễn ngôn học thuật — Trình bày luận điểm / giả thuyết",
  title_en: "Academic discourse — presenting a thesis / hypothesis",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "仮説 (かせつ)", english: "hypothesis" },
    { japanese: "主張 (しゅちょう)", english: "claim / assertion" },
    { japanese: "論旨 (ろんし)", english: "thesis / line of argument" },
    { japanese: "立場 (たちば)", english: "position / stance" },
    { japanese: "前提 (ぜんてい)", english: "premise" },
    { japanese: "検証 (けんしょう)", english: "verification" },
    { japanese: "妥当性 (だとうせい)", english: "validity" },
    { japanese: "提唱する (ていしょうする)", english: "to advocate / propose" },
    { japanese: "暫定的 (ざんていてき)", english: "tentative / provisional" },
    { japanese: "蓋然性 (がいぜんせい)", english: "probability / likelihood (formal)" }
  ],
  examples: [
    { japanese: "本研究は、X が Y に有意な影響を及ぼすという仮説を提示するものである。", english: "This study presents the hypothesis that X exerts a significant influence on Y." },
    { japanese: "本稿の論旨は、従来の解釈に再考を促す点に他ならない。", english: "The thesis of this paper is nothing other than to prompt a reconsideration of the conventional interpretation." },
    { japanese: "仮にこの前提が成立するならば、結論は次のように導かれる。", english: "If this premise holds, the conclusion is derived as follows." },
    { japanese: "本研究は、X と Y との間に相関関係が存在する可能性を示唆するものである。", english: "This study suggests the possibility that a correlation exists between X and Y." },
    { japanese: "以下では、まず仮説の理論的背景を概観したうえで、検証の方法を述べる。", english: "Below, after first surveying the theoretical background of the hypothesis, the verification method will be described." },
    { japanese: "換言すれば、本仮説は、従来の枠組みでは捉えきれない側面を補完するものと位置づけられる。", english: "In other words, this hypothesis is positioned as complementing aspects that the conventional framework could not fully capture." }
  ],
  dialogue: [
    { speaker: "院生", japanese: "本日は、修士論文の中間報告として、仮説の枠組みについてご説明させていただきます。", english: "Today, as an interim report on my master's thesis, I would like to explain the framework of my hypothesis." },
    { speaker: "指導教員", japanese: "では、まず提唱されている仮説の核心からお願いできますか。", english: "Then, could you start with the core of the hypothesis you are advocating?" },
    { speaker: "院生", japanese: "はい。本研究は、ベトナム人日本語学習者の語用論的能力が、滞在期間よりも対話量に依存するという仮説を提示するものでございます。", english: "Yes. This study presents the hypothesis that the pragmatic competence of Vietnamese learners of Japanese depends on volume of interaction rather than length of residence." },
    { speaker: "指導教員", japanese: "なるほど。先行研究との差異は、どの点に求められるのでしょうか。", english: "I see. In what respect would you locate the difference from prior research?" }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "本研究の出発点は、語用論的能力の獲得を、単なる時間関数として捉える従来のモデルに対する疑念にございます。", english: "The starting point of this study lies in a doubt regarding the conventional model that treats the acquisition of pragmatic competence as a mere function of time." },
    { speaker: "指導教員", japanese: "つまり、滞在期間の長さだけでは説明がつかないという立場ですね。", english: "In other words, you take the position that length of residence alone cannot account for it." },
    { speaker: "院生", japanese: "さようでございます。先行研究におきましても、滞在年数と語用論的正確性との相関は、必ずしも一貫した結果を示していないことが報告されております。", english: "That is so. Even in prior research, it has been reported that the correlation between years of residence and pragmatic accuracy does not necessarily show consistent results." },
    { speaker: "指導教員", japanese: "それで、対話量という変数を独立変数として導入されたわけですか。", english: "And so you introduced the variable of interaction volume as an independent variable?" },
    { speaker: "院生", japanese: "はい。具体的には、週あたりの実質的対話時間を指標とし、これが語用論的選択の妥当性に与える影響を検証するものでございます。", english: "Yes. Specifically, taking weekly substantive interaction hours as the indicator, I verify the effect this has on the validity of pragmatic choices." },
    { speaker: "指導教員", japanese: "妥当性の判定は、どのような基準で行われますか。", english: "On what criteria will the judgment of validity be made?" },
    { speaker: "院生", japanese: "母語話者三名による評定を主軸とし、評定者間信頼性を確保したうえで、五段階尺度による評価を行う予定でございます。", english: "I plan to make assessments by three native speakers the primary axis, secure inter-rater reliability, and then conduct evaluations on a five-point scale." },
    { speaker: "指導教員", japanese: "仮説が支持されなかった場合の解釈の余地は、どの程度確保されていますか。", english: "To what extent is interpretive room secured in case the hypothesis is not supported?" },
    { speaker: "院生", japanese: "ご指摘のとおり、対話量が説明変数として有意でなかった場合には、対話の質的側面、すなわち話題の多様性や役割の非対称性といった要因の関与が示唆される可能性がございます。", english: "As you point out, should interaction volume not prove significant as an explanatory variable, the involvement of qualitative aspects of interaction — namely, topic diversity and role asymmetry — may be suggested." },
    { speaker: "指導教員", japanese: "結論を急がず、暫定的な位置づけにとどめておくのが賢明かと思います。", english: "It would be wise to refrain from hasty conclusions and keep them at a tentative positioning." },
    { speaker: "院生", japanese: "肝に銘じます。本仮説は、あくまで一つの可能性として提示するに留め、過度の一般化は慎みたく存じます。", english: "I will take that to heart. I will present this hypothesis only as one possibility and refrain from excessive generalization." },
    { speaker: "指導教員", japanese: "それで結構です。次回は、検証手続きの詳細を伺いましょう。", english: "That will do. Next time, let us hear the details of the verification procedure." }
  ],
  roleplay_prompts: [
    "Bạn trình bày giả thuyết tại buổi báo cáo giữa kỳ. Mở đầu bằng 本研究は…という仮説を提示するものである. KHÔNG dùng 思います hay trộn です/ます trong phần luận điểm — giữ register である. Kết bằng câu định vị giả thuyết là 暫定的 (tentative).",
    "Giáo sư hỏi 'điểm khác biệt với nghiên cứu trước là gì?'. Trả lời bằng 先行研究におきましては〜と報告されておりますが、本研究では… (acknowledge prior, then differentiate). KHÔNG dismiss tiền bối — Nhật academic norm là 敬意 (respect) cho prior work.",
    "Giáo sư cảnh báo về over-generalization. Đáp lại bằng 過度の一般化は慎みたく存じます hoặc 結論を急がず、暫定的な位置づけにとどめます. Đây là academic humility — vẫn nghe confident nhưng có hedge."
  ],
  register_notes: "C1 academic Japanese yêu cầu shift hoàn toàn sang である-style trong luận văn / phát biểu chính thức; ます-style chỉ giữ trong dialogue Q&A. Năm pattern cốt lõi: (1) 提示動詞 — '〜を提示する/〜を提唱する/〜を主張する' thay cho 'I think'. KHÔNG dùng 思います ở luận điểm chính. (2) NOMINALIZATION — biến động từ thành 〜こと/〜もの: 仮説を提示するものである thay vì 仮説を提示する. Suffix 〜性 (妥当性, 蓋然性) và 〜化 (一般化, 体系化) là dấu hiệu C1 prose. (3) HEDGING TIERS — strong: 〜と考えられる; medium: 〜可能性が示唆される; soft: 〜と言えなくもない. Chọn theo strength of evidence. (4) DISCOURSE MARKERS — しかしながら (however, formal), 換言すれば (in other words), さらに言えば (moreover), とはいえ (that said). Tránh でも, だから ở văn viết. (5) HUMBLE-CLAIM — academic Japanese frame claim qua 〜に他ならない (nothing other than) hoặc 〜と位置づけられる (is positioned as) thay vì assertive 'is X'. Cẩn thận: 牽強付会 — đừng đẩy claim quá xa data. Reviewer Nhật rất nhạy với over-claim; hedging không phải yếu mà là dấu hiệu trưởng thành học thuật.",
  idiom_glosses: [
    { idiom: "一石を投じる (いっせきをとうじる)", literal: "Ném một viên đá", meaning: "[書き言葉] Đặt vấn đề mới gây thảo luận trong giới — phù hợp khi giả thuyết của bạn challenge consensus.", example: "本研究は、従来の通説に対し、一石を投じる試みとして位置づけられる。" },
    { idiom: "牽強付会 (けんきょうふかい)", literal: "Cố ép kéo, gò gắn", meaning: "[硬い・書き言葉] Diễn giải gượng ép, đẩy data quá xa — điều cần TRÁNH khi trình bày giả thuyết.", example: "本仮説は、データを牽強付会に解釈することなく、慎重な検証を要するものである。" },
    { idiom: "試金石 (しきんせき)", literal: "Đá thử vàng", meaning: "[書き言葉] Phép thử quyết định — dùng khi nói thí nghiệm/data là bài kiểm tra cho giả thuyết.", example: "本実験の結果は、提唱する仮説の妥当性を測る試金石となる。" },
    { idiom: "我田引水 (がでんいんすい)", literal: "Dẫn nước về ruộng nhà mình", meaning: "[硬い・書き言葉] Diễn giải có lợi cho mình một cách thiên vị — phải tránh trong academic writing.", example: "解釈が我田引水に陥らぬよう、対立仮説の検討も併せて行う必要がある。" }
  ],
  cultural_notes_vi: "Trình bày giả thuyết trong giới học thuật Nhật khác phương Tây ở 4 điểm. (1) 控えめさ (khiêm tốn) cốt lõi — không claim 'chứng minh', chỉ 'gợi ý / cho thấy khả năng'. Câu kết của paper Nhật thường hedged. (2) 先行研究への敬意 — ngay cả khi bạn challenge tiền bối, phải acknowledge họ trước, không bao giờ dismiss. Cụm 〜の知見を踏まえつつ (kế thừa hiểu biết của...) là lễ. (3) 結論の暫定性 — gọi giả thuyết là 暫定的 (tentative) là dấu hiệu trưởng thành học thuật, KHÔNG yếu kém. Reviewer Nhật bonus điểm cho honest hedging. (4) 私 → 本研究/本稿 — chuyển từ ngôi 1 sang 'bài viết này / nghiên cứu này' làm chủ ngữ. 'I argue' = 本稿は〜を主張するものである. Khác VN: ở VN giả thuyết thường viết với 'tôi cho rằng', ở Nhật học thuật, depersonalize hoàn toàn. Mẹo: nếu bí, cụm 〜と考えられる là an toàn nhất — đủ academic, đủ hedge.",
  tip_advice_vi: "Khi bạn trình bày giả thuyết ở 学会 hoặc 中間報告, dùng cấu trúc 4 phần. (a) FRAMING — 1 câu nói 'bài này đề xuất giả thuyết X'. KHÔNG kể lể context dài. Nhật academic value đi thẳng. (b) PRIOR ART — 2-3 câu acknowledge tiền bối + chỉ ra gap. Cụm: 先行研究におきましては〜が報告されているが、〜については十分な検討がなされていない. (c) HYPOTHESIS — phát biểu rõ giả thuyết, dùng 〜という仮説を提示する. Avoid 'tôi nghĩ'. (d) HEDGE — kết bằng 1 câu giới hạn phạm vi: 本仮説は暫定的なものであり、検証を要する. Mẹo Q&A: nếu giáo sư hỏi 'có phản chứng không?', KHÔNG defensive. Cụm: ご指摘のとおり、〜という反例の可能性も否定できません. Acknowledge trước, sau đó nói cách bạn xử lý. Mẹo cuối: tránh 絶対 (absolute), 必ず (definitely), 完全に (completely) trong hypothesis statements — ngay lập tức bị reviewer flag là over-claim.",
  exercises: [
    { type: "fill-blank", question: "本研究は、X が Y に有意な影響を及ぼすという___を提示するものである。", answer: "仮説" },
    { type: "matching", instruction: "Ghép cụm với chức năng học thuật.", pairs: [
      { japanese: "〜を提示するものである", english: "frame paper's main hypothesis impersonally" },
      { japanese: "〜可能性が示唆される", english: "medium-strength hedge for findings" },
      { japanese: "換言すれば", english: "formal discourse marker for restatement" },
      { japanese: "暫定的な位置づけにとどめる", english: "academic humility — keep claim tentative" }
    ] },
    { type: "translation", vietnamese: "Bài viết này không gì khác hơn là thúc đẩy sự xem xét lại cách giải thích truyền thống.", japanese: "本稿は、従来の解釈に再考を促すものに他ならない。" }
  ]
},
{
  id: 93,
  title: "Academic discourse — citing sources & attribution",
  title_vi: "Diễn ngôn học thuật — Trích dẫn và ghi nguồn",
  title_en: "Academic discourse — citing sources & attribution",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "引用 (いんよう)", english: "citation / quotation" },
    { japanese: "出典 (しゅってん)", english: "source / attribution" },
    { japanese: "先行研究 (せんこうけんきゅう)", english: "prior research / literature" },
    { japanese: "脚注 (きゃくちゅう)", english: "footnote" },
    { japanese: "参考文献 (さんこうぶんけん)", english: "references / bibliography" },
    { japanese: "孫引き (まごびき)", english: "secondary citation (citing a citation)" },
    { japanese: "盗用 (とうよう)", english: "plagiarism" },
    { japanese: "踏まえる (ふまえる)", english: "to build upon / take into account" },
    { japanese: "依拠する (いきょする)", english: "to rely on / draw upon (formal)" },
    { japanese: "改変 (かいへん)", english: "alteration (of cited text)" }
  ],
  examples: [
    { japanese: "山田 (二〇一九) によれば、X と Y との関係は、文脈依存的であるとされる。", english: "According to Yamada (2019), the relationship between X and Y is said to be context-dependent." },
    { japanese: "本稿は、田中 (二〇二〇) の枠組みに依拠しつつ、新たな観点を加えるものである。", english: "This paper, while drawing on the framework of Tanaka (2020), adds a new perspective." },
    { japanese: "佐藤 (二〇一八: 四五) は、この点を「制度的慣性」と呼んでいる。", english: "Sato (2018: 45) calls this point 'institutional inertia.'" },
    { japanese: "孫引きを避けるため、可能な限り原典に当たることが望ましい。", english: "In order to avoid secondary citation, consulting the original source whenever possible is desirable." },
    { japanese: "引用に際しては、原文の改変を加えず、出典を明示しなければならない。", english: "When citing, the original text must not be altered, and the source must be made explicit." },
    { japanese: "本研究は、これら一連の知見を踏まえたうえで、新たな仮説を提示するものである。", english: "Building upon this series of findings, this study presents a new hypothesis." }
  ],
  dialogue: [
    { speaker: "院生", japanese: "先生、引用形式について一点ご相談がございます。", english: "Professor, I have one matter to consult about citation format." },
    { speaker: "指導教員", japanese: "どうぞ。何でしょう。", english: "Go ahead. What is it?" },
    { speaker: "院生", japanese: "原典が入手できない場合、孫引きをしてもよろしいでしょうか。", english: "If the original source cannot be obtained, would secondary citation be acceptable?" },
    { speaker: "指導教員", japanese: "原則として避けるべきですが、やむを得ない場合は『〜による』と明記する必要があります。", english: "In principle it should be avoided, but in unavoidable cases, you must clearly state 'as cited in〜.'" }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "実は、田中 (一九九五) で引用されている Smith (一九八〇) の議論を、本論で用いたいのですが、Smith の原典が国内では入手困難でございまして。", english: "Actually, I would like to use the argument of Smith (1980) cited in Tanaka (1995) in my paper, but Smith's original source is difficult to obtain domestically." },
    { speaker: "指導教員", japanese: "なるほど。海外の図書館相互貸借や電子版での入手は試みましたか。", english: "I see. Have you tried interlibrary loan from abroad or obtaining an electronic version?" },
    { speaker: "院生", japanese: "はい。CiNii および国会図書館のデジタルコレクションでも見当たらず、海外の機関にも問い合わせ中でございます。", english: "Yes. It is not in CiNii or the National Diet Library digital collection, and I am also currently inquiring with overseas institutions." },
    { speaker: "指導教員", japanese: "結構な努力です。それでも入手できない場合は、孫引きせざるを得ませんが、その際は明示が肝要です。", english: "That is admirable effort. If still unobtainable, secondary citation cannot be helped, but in that case, explicit notation is essential." },
    { speaker: "院生", japanese: "具体的には、どのように記述すべきでしょうか。", english: "Specifically, how should I write it?" },
    { speaker: "指導教員", japanese: "本文中では「Smith (一九八〇、田中 一九九五による)」と記し、参考文献欄では田中 (一九九五) のみを挙げるのが一般的です。", english: "In the body, write 'Smith (1980, as cited in Tanaka 1995),' and in the references section, list only Tanaka (1995) — that is the general practice." },
    { speaker: "院生", japanese: "承知いたしました。原典に依拠していないことを読者に明示するわけですね。", english: "Understood. So we make it explicit to the reader that we are not drawing on the original source." },
    { speaker: "指導教員", japanese: "そのとおりです。出典の透明性は、研究倫理の根幹にほかなりません。", english: "Exactly so. Transparency of sources is nothing other than the foundation of research ethics." },
    { speaker: "院生", japanese: "もう一点、原文の一部を省略する際の表記についても伺ってよろしいでしょうか。", english: "May I also ask about the notation when omitting part of the original text?" },
    { speaker: "指導教員", japanese: "省略箇所は三点リーダー、すなわち「…」で示し、文意が変わらぬよう細心の注意を払う必要があります。", english: "Omitted portions should be indicated with an ellipsis '…,' and the utmost care must be taken so that the meaning of the sentence does not change." },
    { speaker: "院生", japanese: "原文の趣旨を損なう恐れがある場合は、引用そのものを再検討すべきということですね。", english: "So if there is a risk of impairing the original intent, the citation itself should be reconsidered." },
    { speaker: "指導教員", japanese: "ご認識のとおりです。引用は便利な道具ですが、誤用は盗用と紙一重ですので、慎重に。", english: "As you understand. Citation is a convenient tool, but misuse is paper-thin from plagiarism, so be careful." }
  ],
  roleplay_prompts: [
    "Bạn cần dẫn một nguồn không tìm được bản gốc. Hỏi advisor về format孫引き. Mở bằng 一点ご相談がございます. KHÔNG tự quyết định format mà không hỏi — Nhật academic format strict, sai bị reviewer flag.",
    "Reviewer chỉ ra rằng bạn đã paraphrase mà không attribute. Đáp lại bằng ご指摘ありがとうございます。出典の明示が不十分でございました cộng cách bạn fix. KHÔNG defensive — citation lapse là serious, acknowledge cleanly.",
    "Bạn dẫn Yamada (2019) nhưng diễn giải hơi khác ý gốc. Phrase bằng 山田 (二〇一九) は…と論じているが、本研究はこれを発展させ… (acknowledge phần Yamada nói + chỉ ra phần bạn extend). KHÔNG misrepresent — Nhật reviewer kiểm tra original."
  ],
  register_notes: "Citation register tiers ở C1 academic Japanese: (1) NEUTRAL — '〜によれば' (according to), '〜は〜と述べている' (X states that). Standard, dùng cho đa số. (2) FORMAL — '〜に依拠しつつ' (drawing upon), '〜の知見を踏まえ' (building on findings of). Dùng khi heavy reliance. (3) DISTANCING — '〜とされる' (it is said), '〜と指摘されている' (it has been pointed out). Đánh dấu thông tin received, không tự bạn vouch. Hữu ích khi report claim nhưng chưa chắc. (4) CRITICAL — '〜は…と論じているが、本稿はこの解釈に異を唱える' (X argues, but this paper takes issue with that interpretation). C1 phải biết phân biệt 4 tiers. Số academic Japanese dùng kanji number: 二〇一九年 (2019) chứ không 2019年 trong 縦書き formal papers; 横書き modern paper thì cả hai chấp nhận. Trong dấu ngoặc citation, format Nhật: 山田 (二〇一九) hoặc (山田 二〇一九) — không có dấu phẩy như APA. Trang số: (山田 二〇一九: 四五). Quote ngắn: 「」 ngoặc. Quote dài: indented block. 改変 (alteration) gồm cả thay từ, đổi trật tự, gộp câu — phải mark. Chỉ acceptable change: 旧字体→新字体, full-width→half-width punctuation, [...] cho omission rõ ràng.",
  idiom_glosses: [
    { idiom: "鵜呑みにする (うのみにする)", literal: "Nuốt chửng như con chim cốc nuốt cá", meaning: "[書き言葉・話し言葉] Tin hoặc trích dẫn mà không kiểm tra critically — điều cần tránh khi dùng prior research.", example: "先行研究の主張を鵜呑みにせず、原典に当たって検証することが求められる。" },
    { idiom: "玉石混淆 (ぎょくせきこんこう)", literal: "Ngọc và đá lẫn lộn", meaning: "[書き言葉] Tài liệu hỗn tạp — nguồn tốt và nguồn kém lẫn lộn; phù hợp khi đánh giá literature.", example: "近年のオンライン文献は玉石混淆であり、引用に際しては選別が肝要となる。" },
    { idiom: "孫引き (まごびき)", literal: "Cháu kéo (dẫn từ dẫn)", meaning: "[学術用語] Trích dẫn từ nguồn thứ cấp thay vì bản gốc — chỉ acceptable khi không thể access nguồn gốc.", example: "孫引きは原則として避け、やむを得ない場合は出典を二重に明記する。" },
    { idiom: "出典を明らかにする (しゅってんをあきらかにする)", literal: "Làm rõ nguồn", meaning: "[書き言葉] Set phrase chuẩn cho 'cite the source explicitly' — bắt buộc trong academic prose.", example: "他者の見解を援用する際は、必ず出典を明らかにしなければならない。" }
  ],
  cultural_notes_vi: "Văn hóa trích dẫn Nhật khác VN ở 4 điểm. (1) ATTRIBUTION CHẶT HƠN VN — ngay cả idea chung (general claim) cũng cite. VN academic thường acceptable không cite nếu là 'kiến thức phổ biến'; Nhật C1 academic require cite nhiều hơn. Khi nghi ngờ, cite. (2) ORDER CỦA NAME — Nhật references list dùng họ trước, không initial first name (山田太郎 chứ không 太郎・山田 hoặc T. Yamada trong paper Nhật). Khi cite tác giả nước ngoài: dùng full Romanized name hoặc katakana phiên âm tùy field. (3) 二重投稿 (double submission) là vi phạm nặng — đừng cite paper của chính bạn vào paper khác mà không declare. Self-citation phải mark rõ. (4) PARAPHRASE TIÊU CHUẨN CAO — paraphrase mà giữ structure câu gốc bị coi như 'patchwriting' = gần với 盗用. C1 phải hoàn toàn tái cấu trúc, hoặc quote thẳng. Khác VN: ở VN paraphrase loose hơn được chấp nhận; ở Nhật reviewer kiểm tra strict. Mẹo: nếu bạn không thể paraphrase đủ khác, quote trực tiếp + 「」 + cite trang. An toàn hơn paraphrase nửa vời.",
  tip_advice_vi: "Workflow trích dẫn an toàn cho luận văn Nhật C1. (a) MỖI lần đọc paper, ghi ngay full citation + page numbers vào notes — đừng để 'sẽ tìm lại sau'. Sau 30 paper bạn không nhớ ai nói gì. (b) PHÂN BIỆT 3 mức ghi chú: 直接引用 (direct quote, nguyên văn) → 「」 + page; 言い換え (paraphrase) → no quote marks nhưng cite; 自分の解釈 (your synthesis) → no cite, mark với memo 'mine'. Trộn lẫn = nguy cơ 盗用. (c) TRƯỚC submit, double-check mỗi cite: tác giả + năm khớp với references list không? Page number chính xác không? Reviewer Nhật kiểm tra random sample — cite sai 1 chỗ làm reviewer mất tin tưởng cả paper. (d) KHI dùng 〜とされる (it is said), reviewer có thể hỏi 'ai nói?' — phải có cite ngay sau, hoặc đổi thành 'tôi giả định' với hedge khác. (e) KHI cite tiếng Việt source trong paper Nhật, theo convention: Romanized author name + year, references list ghi cả tựa gốc tiếng Việt + dịch tiếng Nhật trong [括弧]. Mẹo cuối: nếu phát hiện đã paraphrase thiếu attribution sau khi nộp, báo cáo chủ động cho biên tập viên — tự sửa được dù muộn vẫn nhẹ hơn nhiều so với bị phát hiện.",
  exercises: [
    { type: "fill-blank", question: "山田 (二〇一九) ___、X と Y との関係は、文脈依存的であるとされる。", answer: "によれば" },
    { type: "matching", instruction: "Ghép cụm với citation function.", pairs: [
      { japanese: "〜に依拠しつつ", english: "acknowledge heavy reliance on a framework" },
      { japanese: "〜とされる", english: "distancing — report a claim without vouching" },
      { japanese: "〜による", english: "mark a secondary citation (cited via X)" },
      { japanese: "出典を明らかにする", english: "set phrase: explicitly state the source" }
    ] },
    { type: "translation", vietnamese: "Bài này, trong khi kế thừa khung phân tích của Tanaka (2020), bổ sung một góc nhìn mới.", japanese: "本稿は、田中 (二〇二〇) の枠組みに依拠しつつ、新たな観点を加えるものである。" }
  ]
},
{
  id: 94,
  title: "Academic discourse — arguing and counter-arguing",
  title_vi: "Diễn ngôn học thuật — Lập luận và phản biện",
  title_en: "Academic discourse — arguing and counter-arguing",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "論証 (ろんしょう)", english: "argumentation / proof" },
    { japanese: "反論 (はんろん)", english: "counter-argument" },
    { japanese: "反駁 (はんばく)", english: "rebuttal (formal)" },
    { japanese: "異論 (いろん)", english: "dissenting view" },
    { japanese: "根拠 (こんきょ)", english: "grounds / basis" },
    { japanese: "論拠 (ろんきょ)", english: "warrant for an argument" },
    { japanese: "誤謬 (ごびゅう)", english: "fallacy / error in reasoning" },
    { japanese: "妥当 (だとう)", english: "valid / appropriate" },
    { japanese: "前提条件 (ぜんていじょうけん)", english: "precondition" },
    { japanese: "覆す (くつがえす)", english: "to overturn / refute" }
  ],
  examples: [
    { japanese: "本稿の議論は、以下の三つの根拠に基づくものである。", english: "The argument of this paper rests on the following three grounds." },
    { japanese: "しかしながら、この主張には看過しがたい論理的な飛躍が含まれている。", english: "However, this claim contains a logical leap that cannot be overlooked." },
    { japanese: "確かに〜という見方も成り立つが、本稿はこれに対して異論を提示する。", english: "Certainly the view that 〜 also holds, but this paper presents a dissenting view to that." },
    { japanese: "氏の論拠は、前提そのものの妥当性が問われない限り成立しない。", english: "The author's warrant does not hold unless the validity of the premise itself is questioned." },
    { japanese: "とはいえ、この反論は本研究の中核的主張を覆すには至らない。", english: "That said, this counter-argument does not go so far as to overturn the central claim of this study." },
    { japanese: "さらに言えば、対立する見解の双方を統合する第三の枠組みも考えられよう。", english: "Furthermore, a third framework integrating both opposing views may also be conceivable." }
  ],
  dialogue: [
    { speaker: "発表者", japanese: "本稿の主張に対しては、当然ながら反論も予想されるところでございます。", english: "Naturally, counter-arguments to this paper's claim are to be anticipated." },
    { speaker: "討論者", japanese: "そうですね。最も強い反論は、サンプルの偏りに関するものではないでしょうか。", english: "Indeed. The strongest counter-argument would seem to be one concerning sample bias, would it not?" },
    { speaker: "発表者", japanese: "ご指摘の点は、本稿でも限界として明示しております。ただし、結論の頑健性は別途検討いたしました。", english: "The point you raise is one I have made explicit as a limitation in the paper. However, the robustness of the conclusion has been examined separately." },
    { speaker: "討論者", japanese: "なるほど。その検討の結果が、本稿の核心的な強みとなっているわけですね。", english: "I see. So the result of that examination forms the core strength of this paper." }
  ],
  dialogue_long: [
    { speaker: "発表者", japanese: "本稿の中心的な主張は、教師の言語選択が学習者の動機づけを左右するという点にございます。", english: "The central claim of this paper is that the teacher's language choice determines learner motivation." },
    { speaker: "討論者", japanese: "興味深い主張ですが、因果の方向性については、別の解釈も成り立つように思われます。", english: "An interesting claim, but with respect to the direction of causality, an alternative interpretation also seems to hold." },
    { speaker: "発表者", japanese: "ご指摘ありがとうございます。具体的には、いかなる解釈をご想定でしょうか。", english: "Thank you for the comment. Specifically, what interpretation do you have in mind?" },
    { speaker: "討論者", japanese: "すなわち、動機づけの高い学習者ほど、教師の言語選択を肯定的に解釈する、という逆方向の因果も否定できないかと存じます。", english: "Namely, the reverse causality — that more highly motivated learners interpret the teacher's language choice more positively — also cannot be denied." },
    { speaker: "発表者", japanese: "誠にもっともなご指摘でございます。本研究では、時系列データを用いることで、動機づけの変化が言語選択への評価に先行しないことを確認しております。", english: "A truly reasonable point. In this study, by using time-series data, we have confirmed that changes in motivation do not precede the evaluation of language choice." },
    { speaker: "討論者", japanese: "なるほど。とはいえ、観察期間が三か月と短いため、長期的な相互作用については依然として不明瞭ではないでしょうか。", english: "I see. That said, given that the observation period is as short as three months, long-term interactions remain unclear, would they not?" },
    { speaker: "発表者", japanese: "ご指摘のとおりでございます。長期効果については、本研究の射程外であることを明示しており、今後の課題として残しております。", english: "As you point out. With respect to long-term effects, I have made explicit that they fall outside the scope of this study and have left them as a future task." },
    { speaker: "討論者", japanese: "もう一点、よろしいでしょうか。教師の言語選択を「肯定的・否定的」の二項で捉えること自体、過度の単純化ではないかと感じました。", english: "One more point, if I may. Capturing the teacher's language choice itself in the binary of 'positive/negative' — I felt this might be excessive simplification." },
    { speaker: "発表者", japanese: "鋭いご指摘です。確かに二項分類は分析の便宜上のものであり、現実には連続体として捉えるべき側面がございます。", english: "An incisive point. Indeed, the binary classification is one of analytical convenience, and in reality there are aspects that should be grasped as a continuum." },
    { speaker: "討論者", japanese: "とすれば、本稿の結論は、あくまで二項分類の枠内での暫定的な知見と理解してよろしいわけですね。", english: "If so, the conclusion of this paper should be understood as merely a tentative finding within the framework of binary classification, correct?" },
    { speaker: "発表者", japanese: "そのご理解で結構でございます。本稿は、より精緻な分析への足がかりとして位置づけられるものと考えております。", english: "That understanding is correct. I consider this paper to be positioned as a stepping stone toward more refined analysis." },
    { speaker: "討論者", japanese: "明快なご回答、ありがとうございました。", english: "Thank you for the clear responses." }
  ],
  roleplay_prompts: [
    "Reviewer raises a counter-argument về sample bias. Đáp lại bằng ご指摘の点は、本稿でも限界として明示しております cộng nói robustness check. KHÔNG defensive ('but my data is good') — Nhật Q&A norm là acknowledge first, then explain.",
    "Bạn raise reverse causality concern cho 1 paper. Phrase bằng 因果の方向性については、別の解釈も成り立つように思われます. KHÔNG accusatory — frame như tentative observation, để presenter giữ face.",
    "Presenter accept partial criticism của bạn. Acknowledge bằng 鋭いご指摘です hoặc 誠にもっともなご指摘でございます. KHÔNG over-bow ('I was completely wrong') — graceful partial acceptance preserves cả hai sides."
  ],
  register_notes: "C1 academic argumentation tuân theo 4 nguyên tắc cốt lõi. (1) ACKNOWLEDGE BEFORE REBUT — luôn mở counter-argument bằng phrase công nhận: 確かに〜が, ご指摘のとおり, ご想定はもっともながら. Tiếng Nhật academic culture coi đi thẳng vào phản đối là thô lỗ và làm yếu argument của bạn. (2) HEDGE THE REBUTTAL — sau acknowledge, dùng とはいえ / しかしながら / そうは言うものの cộng hedged claim: 〜には至らない (does not go so far as to), 〜とは限らない (not necessarily). Strong rebuttal direct hiếm gặp ngoài 反駁論文 chuyên biệt. (3) GROUND-WARRANT-CLAIM STRUCTURE — Toulmin model adapted: 根拠 (data/grounds) → 論拠 (warrant) → 主張 (claim). C1 reviewer kiểm tra cả ba; missing 論拠 là weakness phổ biến nhất. (4) FALLACY VOCABULARY — 論理的飛躍 (logical leap), 循環論法 (circular reasoning), 過度の一般化 (over-generalization), 偽の二分法 (false dichotomy). Biết tên các fallacies bằng tiếng Nhật cho phép bạn phản biện chính xác mà không thô. Discourse markers: 一方 (on the other hand), 他方 (on the other), 反面 (conversely), これに対し (in contrast). Cẩn thận với 絶対に〜ない (absolutely not) trong phản biện — sound đầy aggressive; thay bằng 必ずしも〜とは言えない. Quan trọng: phản biện ở Nhật academic không phải zero-sum win/lose mà là 共同の真理探求 (joint pursuit of truth) — tone hợp tác làm phản biện effective hơn.",
  idiom_glosses: [
    { idiom: "矛盾 (むじゅん)", literal: "Mâu (giáo) + thuẫn (khiên) — từ điển tích Hàn Phi Tử", meaning: "[書き言葉・話し言葉] Mâu thuẫn nội tại trong lập luận — từ chuẩn cho self-contradiction trong reasoning.", example: "氏の論には、前提と結論との間に矛盾が認められる。" },
    { idiom: "詭弁 (きべん)", literal: "Lời ngụy biện", meaning: "[硬い・書き言葉] Sophistry — lập luận có vẻ hợp lý nhưng sai logic; dùng cẩn thận, có nghĩa accusatory.", example: "氏の主張は、一見もっともらしいが、詭弁の域を出ない。" },
    { idiom: "玉に瑕 (たまにきず)", literal: "Vết trên viên ngọc", meaning: "[書き言葉] Khen tổng thể nhưng chỉ ra khuyết điểm nhỏ — diplomatic critique format trong Nhật academic.", example: "本研究は優れた成果であるが、サンプル規模の小ささが玉に瑕と言えよう。" },
    { idiom: "百家争鳴 (ひゃっかそうめい)", literal: "Trăm nhà tranh luận sôi nổi", meaning: "[硬い・書き言葉] Diễn đàn học thuật sôi nổi với nhiều quan điểm — dùng khi mô tả debate đa chiều.", example: "この問題をめぐっては、近年百家争鳴の様相を呈している。" }
  ],
  cultural_notes_vi: "Phản biện ở học thuật Nhật khác phương Tây và VN ở 4 điểm. (1) WIN-LOSE → JOINT INQUIRY — Western debate culture có khuynh hướng zero-sum: ai 'thắng' argument. Nhật academic frame là 共同の真理探求 — cả presenter và discussant đang join để tìm truth. Tone phản biện hợp tác làm critique effective hơn, không yếu hơn. (2) ATTACK IDEA, NOT PERSON — không bao giờ 'X氏の認識不足' (X's lack of understanding). Thay bằng 'この点については、別解釈の余地がある' (regarding this point, there is room for alternative interpretation). Personal attack ngay lập tức discredit bạn. (3) PUBLIC CRITIQUE LIMITS — ở 学会, harsh critique của junior với senior là vi phạm nghiêm trọng dù argument đúng. Nếu bạn (junior) phải phản biện senior, dùng full hedge: ご教示いただければ幸いでございます (it would be gracious if you could enlighten me) thay vì assertive. (4) SILENCE = DISAGREEMENT — sau phản biện, presenter im lặng vài giây không phải agreeing — họ đang điều chỉnh response. Đừng fill silence bằng cách restate phản biện. Wait. Khác VN: ở VN seminar, debate sôi nổi với raised voice OK; ở Nhật học thuật, raised voice đọc là loss of control = loss of argument. Mẹo: học cụm 興味深いご指摘です (an interesting observation) làm filler khi cần thời gian suy nghĩ — buys 3 giây mà sound polished.",
  tip_advice_vi: "Cấu trúc một phản biện C1 ở 質疑応答. (a) PHRASE BUFFER — mở bằng ご発表ありがとうございました cộng 一点伺ってもよろしいでしょうか. KHÔNG đi thẳng vào 'I disagree'. (b) ACKNOWLEDGE — 1 câu công nhận điểm mạnh: 〜という分析、大変興味深く拝聴いたしました. Genuine, không sycophantic. (c) RAISE — phrase phản biện như observation chứ không attack: 〜については、〜という解釈も成り立つように思われますが、いかがでしょうか. Câu hỏi mở (どうお考えでしょうか) thay vì statement. (d) EXIT — sau presenter trả lời, đáp 明快なご回答、ありがとうございました dù bạn vẫn không thuyết phục. Long-form debate move sang offline tea/email. Mẹo response khi BẠN bị phản biện: 4 phrases an toàn. (1) ご指摘のとおりでございます (as you point out — accept). (2) 鋭いご指摘でございます (incisive observation — flatter while thinking). (3) その点は本稿の射程外でございます (that point falls outside the scope — defer). (4) 今後の課題として承ります (I will receive that as a future task — graceful deferral). Tránh: 'いえ、それは違います' (no, that's wrong) — too direct, gây offense. Mẹo cuối: ghi xuống mọi critique nhận được. Sau seminar, follow-up email với discussant: 本日は貴重なご指摘ありがとうございました cộng 1 paragraph cách bạn sẽ address. Đây builds long-term relationship — Nhật academic depends heavily trên các quan hệ này.",
  exercises: [
    { type: "fill-blank", question: "確かに〜という見方も成り立つが、本稿はこれに対して___を提示する。", answer: "異論" },
    { type: "matching", instruction: "Ghép cụm với chức năng phản biện.", pairs: [
      { japanese: "ご指摘のとおりでございます", english: "graceful acceptance of a valid criticism" },
      { japanese: "〜には至らない", english: "hedged rebuttal — does not go so far as to" },
      { japanese: "別の解釈も成り立つように思われます", english: "raise alternative interpretation tentatively" },
      { japanese: "今後の課題として承ります", english: "deferral — accept as future work" }
    ] },
    { type: "translation", vietnamese: "Tuy vậy, phản biện này không đi xa đến mức lật đổ luận điểm trung tâm của nghiên cứu này.", japanese: "とはいえ、この反論は本研究の中核的主張を覆すには至らない。" }
  ]
},
{
  id: 95,
  title: "Academic discourse — hedging and academic uncertainty",
  title_vi: "Diễn ngôn học thuật — Hedging và sự bất định học thuật",
  title_en: "Academic discourse — hedging and academic uncertainty",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "推測 (すいそく)", english: "inference / conjecture" },
    { japanese: "示唆 (しさ)", english: "suggestion / implication" },
    { japanese: "可能性 (かのうせい)", english: "possibility" },
    { japanese: "蓋然性 (がいぜんせい)", english: "probability (formal)" },
    { japanese: "断定 (だんてい)", english: "definitive assertion" },
    { japanese: "限定的 (げんていてき)", english: "limited / restricted" },
    { japanese: "傾向 (けいこう)", english: "tendency" },
    { japanese: "留保 (りゅうほ)", english: "reservation / caveat" },
    { japanese: "概ね (おおむね)", english: "broadly / on the whole" },
    { japanese: "厳密に言えば (げんみつにいえば)", english: "strictly speaking" }
  ],
  examples: [
    { japanese: "本研究の知見は、X が Y に影響を及ぼす可能性が示唆されることを示している。", english: "The findings of this study indicate that the possibility of X exerting an influence on Y is suggested." },
    { japanese: "厳密に言えば、本結果は限定された条件下でのみ妥当するものと考えられる。", english: "Strictly speaking, this result is considered valid only under limited conditions." },
    { japanese: "現段階では、両者の関係は相関の域を出ず、因果関係を断定するには至らない。", english: "At the present stage, the relationship between the two does not exceed correlation and does not reach a definitive assertion of causality." },
    { japanese: "概ね先行研究の知見と整合的であるが、いくつかの留保が必要である。", english: "It is broadly consistent with prior findings, but several reservations are necessary." },
    { japanese: "本傾向は、サンプルの特性に起因する可能性も否定できない。", english: "The possibility that this tendency originates from sample characteristics also cannot be denied." },
    { japanese: "そうとは言えなくもないが、現時点での結論は留保が望ましい。", english: "It cannot be said that this is not so, yet at the present time, reservation of conclusion is desirable." }
  ],
  dialogue: [
    { speaker: "編集者", japanese: "結論部の表現が、やや断定的に過ぎるという査読意見が寄せられました。", english: "We received a peer-review comment that the wording in the conclusion is somewhat overly definitive." },
    { speaker: "著者", japanese: "ご指摘を踏まえ、「証明する」を「示唆する」に改め、留保の一文を加える所存でございます。", english: "In light of the comment, I intend to revise 'prove' to 'suggest' and add a sentence of reservation." },
    { speaker: "編集者", japanese: "結構です。あわせて、適用範囲についても明示していただけますと助かります。", english: "That will do. It would also be helpful if you could make the scope of applicability explicit." },
    { speaker: "著者", japanese: "承知いたしました。「本知見は調査対象群に限定される可能性がある」という一文を加筆いたします。", english: "Understood. I will add the sentence 'this finding may be limited to the surveyed group.'" }
  ],
  dialogue_long: [
    { speaker: "編集者", japanese: "今回の改稿、全体としては査読者からも高い評価をいただいております。", english: "Regarding this revision, on the whole, we have received high evaluation from the reviewers as well." },
    { speaker: "著者", japanese: "ありがとうございます。残された懸念事項はございますでしょうか。", english: "Thank you. Are there any remaining concerns?" },
    { speaker: "編集者", japanese: "一点ございます。第四節の「明らかになった」という表現が、やや踏み込みすぎではないかとのご意見でございます。", english: "There is one point. There is the view that the expression 'has become clear' in section four may go somewhat too far." },
    { speaker: "著者", japanese: "ご指摘ごもっともです。「明らかになった」を「示唆された」に改め、データの限界を併記することにいたします。", english: "The comment is entirely reasonable. I will revise 'has become clear' to 'has been suggested' and append the limitations of the data alongside." },
    { speaker: "編集者", japanese: "そのご対応で十分かと存じます。なお、結論部での一般化についても、適用条件を再確認いただけますでしょうか。", english: "That response should be sufficient. Additionally, regarding the generalization in the conclusion, could you reconfirm the conditions of applicability?" },
    { speaker: "著者", japanese: "本知見は調査対象とした地域および年齢層に限定されるものであり、その旨を明記いたします。", english: "These findings are limited to the surveyed region and age group; I will state that explicitly." },
    { speaker: "編集者", japanese: "助かります。査読者の懸念は、結論の射程が読者に誤解されることを恐れての指摘かと存じます。", english: "That helps. The reviewer's concern is, I believe, the apprehension that the scope of the conclusion may be misunderstood by readers." },
    { speaker: "著者", japanese: "断定的な記述が誤読を招く危険性は、肝に銘じております。今後とも留意いたします。", english: "I take to heart the danger that definitive descriptions invite misreading. I will continue to be mindful." },
    { speaker: "編集者", japanese: "なお、抄録においても、「示唆する」または「可能性が高い」程度の表現が望ましいかと存じます。", english: "Furthermore, in the abstract as well, expressions on the level of 'suggest' or 'is likely' would be desirable." },
    { speaker: "著者", japanese: "抄録についても、断定形を避けた表現に統一いたします。一週間以内に再提出させていただきます。", english: "For the abstract as well, I will unify the wording to avoid definitive forms. I will resubmit within one week." },
    { speaker: "編集者", japanese: "お手数をおかけしますが、よろしくお願い申し上げます。", english: "I am sorry to trouble you, but please proceed accordingly." },
    { speaker: "著者", japanese: "とんでもございません。査読のおかげで、論旨がより精緻になったものと感じております。", english: "Not at all. Thanks to the peer review, I feel the line of argument has become more refined." }
  ],
  roleplay_prompts: [
    "Bạn revise một đoạn quá assertive. Thay 'X が Y を引き起こす' bằng 'X が Y を引き起こす可能性が示唆される'. KHÔNG hedge tất cả mọi thứ — over-hedging cũng làm paper yếu. Hedge claim, không hedge data description.",
    "Reviewer chỉ ra '断定的すぎる'. Đáp lại bằng ご指摘ごもっともです cộng cụ thể cách bạn sẽ soften — 「証明する」→「示唆する」. KHÔNG cãi rằng claim của bạn có evidence — accept formatting feedback gracefully.",
    "Bạn cần state limitation mà không undermine paper. Cụm 本知見は〜に限定されるものである, sau đó pivot 本稿の貢献は〜にある (the contribution lies in〜). Acknowledge limit + reframe contribution."
  ],
  register_notes: "Hedging ở C1 academic Japanese tổ chức theo 5 tiers từ strong đến soft. (1) STRONG (= 'is') — 〜である, 〜となる. Chỉ dùng cho định nghĩa, sự kiện thiết lập, kết quả thống kê chính xác. (2) MEDIUM-STRONG — 〜と考えられる (is considered), 〜と判断される (is judged). Dùng cho diễn giải có support mạnh từ data. (3) MEDIUM — 〜可能性が示唆される (the possibility is suggested), 〜と推察される (is inferred). Default cho hầu hết findings. (4) SOFT — 〜と言えなくもない (it cannot not be said that), 〜の余地がある (there is room for). Dùng khi evidence yếu hoặc preliminary. (5) VERY SOFT — 〜かもしれない (may, only in dialogue, NEVER in formal writing). Discourse marker hedges: 厳密に言えば (strictly), 概ね (broadly), 一般に (generally), 場合によっては (in some cases), 状況次第では (depending on circumstances). Scope hedges (限定詞): 〜に限定される, 〜の範囲内では, 〜という条件下では. Counter-hedges (KHÔNG over-hedge): nếu data thực sự chứng minh, dùng 〜ことが確認された (was confirmed) — over-hedging clear results sound như bạn không tự tin trong work của mình. Quy tắc 90 phần trăm: 90 phần trăm content claim trong C1 academic paper nên là tier 2-4. Tier 1 chỉ cho data/method, tier 5 chỉ cho preliminary discussion. Cẩn thận: 必ずしも〜とは限らない (not necessarily) là hedge yêu thích nhưng overuse làm prose nặng — limit 1-2 lần per section.",
  idiom_glosses: [
    { idiom: "十中八九 (じっちゅうはっく)", literal: "Tám hoặc chín phần trên mười", meaning: "[書き言葉・話し言葉] Hầu như chắc chắn, 80-90 phần trăm — high-probability hedge phù hợp khi evidence rất mạnh nhưng chưa absolute.", example: "十中八九、観察された相関は偶然ではないと考えられる。" },
    { idiom: "断じて〜ない (だんじて〜ない)", literal: "Tuyệt đối không", meaning: "[硬い・書き言葉] Anti-hedge — strong negation; chỉ dùng khi data hoàn toàn rule out something, hiếm trong empirical work.", example: "本データに基づく限り、両者に因果関係があると断じて言うことはできない。" },
    { idiom: "一概に言えない (いちがいにいえない)", literal: "Không thể nói một cách đơn giản", meaning: "[書き言葉] Hedge cho generalization — phù hợp khi nuance quan trọng và một-size-fits-all không apply.", example: "教育効果の有無は、文脈に依存するため、一概に論じることはできない。" },
    { idiom: "灰色 (はいいろ)", literal: "Màu xám", meaning: "[書き言葉] Vùng không-đen-không-trắng — dùng để mô tả findings nằm giữa two clear categories.", example: "本結果は、明確な肯定とも否定ともつかぬ、いわば灰色の領域に属するものと言えよう。" }
  ],
  cultural_notes_vi: "Hedging ở Nhật academic culture có 3 đặc điểm cần hiểu. (1) HEDGE = COMPETENCE — phương Tây có thể hiểu 'Tôi không chắc' là yếu kém; Nhật academic ngược lại — over-confident claim đọc là naïve hoặc thiếu trải nghiệm. Reviewer Nhật chấm điểm cao cho appropriate hedging. Senior researchers thường hedge nhiều HƠN junior, không ít hơn. (2) HEDGE PROTECTS PEER RELATIONSHIPS — strong claim implicitly nói 'những ai bất đồng với tôi đều sai'. Hedge giữ space cho ý kiến khác, bảo vệ collegial relationships. Trong giới học thuật Nhật nhỏ và liên kết chặt, sustained relationships > single paper victory. (3) HEDGE BÁO HIỆU MEMBERSHIP — cách đúng để hedge là cách bạn báo hiệu 'tôi biết các quy ước của giới này'. Học sinh dùng 〜と思います (I think) thay vì 〜と考えられる ngay lập tức bị flag là chưa initiated. Cụm 〜可能性が示唆される là một membership marker. Khác VN: VN academic prose có khuynh hướng more assertive, especially trong soft sciences; Nhật C1 paper hedge dày hơn. Khi dịch paper VN sang Nhật, gần như luôn cần thêm 1-2 hedges per paragraph. Mẹo: nếu draft của bạn có 0 hedges trong 1 đoạn discussion, có thể bạn đang over-claim. Đọc lại với mindset 'reviewer đang tìm chỗ over-claim' và soften ở chỗ data thực sự không support strong version.",
  tip_advice_vi: "Hedging hiệu quả ở C1 cần balance, không spam. Quy tắc thực hành. (a) HEDGE CLAIM, KHÔNG HEDGE DATA — 'X が Y を増加させた' (data) → KHÔNG hedge nếu thực sự increased; 'X が Y の増加を引き起こした' (causal claim) → HEDGE thành 〜の可能性が示唆される. Phân biệt observation vs interpretation. (b) PICK HEDGE STRENGTH MATCHING EVIDENCE STRENGTH — 1 case study → soft hedge (〜の余地がある); meta-analysis với p<0.001 → minimal hedge (〜と考えられる). Mismatch hedge với evidence làm reader skeptical. (c) CLUSTER HEDGES, KHÔNG SPRINKLE — 1 well-placed hedge ở claim chính > 5 small hedges scattered. Reader đếm hedges; quá nhiều = paper sound uncertain about everything. (d) USE SCOPE HEDGES TO BOUND CLAIM — thay vì soften 'X causes Y' thành 'X may cause Y', tốt hơn bound: '本研究の対象群においては、X が Y を引き起こしたことが示唆される' (within the surveyed group, X is suggested to have caused Y). Scope-bound = strong-within-scope, an toàn hơn. (e) IN ABSTRACT — hedge thấp hơn body, vì abstract đọc standalone. Reviewer không đọc body sẽ judge từ abstract; over-hedged abstract đọc như 'we found nothing'. Mẹo cuối: trước khi submit, do hedge audit — đếm số 'は〜である' câu vs số hedged câu trong discussion. Tỷ lệ healthy là 1:3 (1 strong claim per 3 hedged). Nếu 1:1, paper quá bold; nếu 1:10, paper quá timid.",
  exercises: [
    { type: "fill-blank", question: "本研究の知見は、X が Y に影響を及ぼす___が示唆されることを示している。", answer: "可能性" },
    { type: "matching", instruction: "Ghép hedge với strength tier.", pairs: [
      { japanese: "〜と考えられる", english: "medium-strong — interpretation with solid support" },
      { japanese: "〜可能性が示唆される", english: "medium — default for most findings" },
      { japanese: "〜と言えなくもない", english: "soft — preliminary, weak evidence" },
      { japanese: "〜に限定される", english: "scope hedge — bound the claim" }
    ] },
    { type: "translation", vietnamese: "Nói nghiêm ngặt, kết quả này được cho là chỉ có giá trị trong điều kiện hạn chế.", japanese: "厳密に言えば、本結果は限定された条件下でのみ妥当するものと考えられる。" }
  ]
},
{
  id: 96,
  title: "Academic discourse — defining technical terms",
  title_vi: "Diễn ngôn học thuật — Định nghĩa thuật ngữ chuyên ngành",
  title_en: "Academic discourse — defining technical terms",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "定義 (ていぎ)", english: "definition" },
    { japanese: "概念 (がいねん)", english: "concept" },
    { japanese: "用語 (ようご)", english: "term / terminology" },
    { japanese: "操作的定義 (そうさてきていぎ)", english: "operational definition" },
    { japanese: "外延 (がいえん)", english: "extension (of a concept)" },
    { japanese: "内包 (ないほう)", english: "intension (of a concept)" },
    { japanese: "区別する (くべつする)", english: "to distinguish" },
    { japanese: "厳密化 (げんみつか)", english: "operationalization / making strict" },
    { japanese: "曖昧さ (あいまいさ)", english: "ambiguity" },
    { japanese: "便宜上 (べんぎじょう)", english: "for convenience / pro tem" }
  ],
  examples: [
    { japanese: "本稿では、「学習動機」を以下のように定義する。", english: "In this paper, 'learning motivation' is defined as follows." },
    { japanese: "ここで言う「適応」とは、環境変化に対する行動上の調整を指すものとする。", english: "What is here referred to as 'adaptation' shall denote behavioral adjustment in response to environmental change." },
    { japanese: "本概念の外延と内包を区別したうえで、議論を進める必要がある。", english: "It is necessary to proceed with the discussion after distinguishing the extension and intension of this concept." },
    { japanese: "「言語接触」という用語は、論者によって含意が異なるため、本稿では暫定的に次のように限定する。", english: "Since the term 'language contact' carries differing implications among scholars, this paper provisionally restricts it as follows." },
    { japanese: "本研究における「成功」とは、操作的に「テスト得点八割以上」と定義される。", english: "'Success' in this study is operationally defined as 'a test score of 80 percent or higher.'" },
    { japanese: "用語の曖昧さは、議論の前提を不明瞭にし、結論の妥当性をも揺るがしかねない。", english: "Ambiguity in terminology obscures the premises of the argument and may even shake the validity of the conclusion." }
  ],
  dialogue: [
    { speaker: "院生", japanese: "「成功」という語の定義について、ご相談させていただきたく存じます。", english: "I would like to consult you regarding the definition of the word 'success.'" },
    { speaker: "指導教員", japanese: "どのような曖昧さが生じていますか。", english: "What kind of ambiguity has arisen?" },
    { speaker: "院生", japanese: "テスト得点を基準とすべきか、自己評価を基準とすべきか、定まらずにおります。", english: "Whether to take test scores as the criterion or self-evaluation — I have not settled this." },
    { speaker: "指導教員", japanese: "両立は困難です。本稿では便宜上いずれか一方に限定し、その旨を明記するのが筋でしょう。", english: "Reconciling both is difficult. In this paper, restricting it to one for convenience and stating that explicitly would be the proper course." }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "本日は、用語定義についてご教示いただきたく、お時間頂戴いたしました。", english: "Today, I have asked for your time to receive guidance on terminology definition." },
    { speaker: "指導教員", japanese: "どの用語が問題となっていますか。", english: "Which term has become problematic?" },
    { speaker: "院生", japanese: "「文化的能力」という概念でございます。先行研究を概観いたしましたが、論者ごとに含意が大きく異なっておりまして。", english: "It is the concept of 'cultural competence.' I have surveyed prior research, but the implications differ greatly from scholar to scholar." },
    { speaker: "指導教員", japanese: "代表的な定義を、いくつか挙げてみてください。", english: "Try listing a few representative definitions." },
    { speaker: "院生", japanese: "Byram (一九九七) は知識・技能・態度の三要素から構成されるとし、Kramsch (一九九八) はこれを動的な交渉過程として捉えております。", english: "Byram (1997) takes it as composed of the three elements of knowledge, skills, and attitudes, while Kramsch (1998) grasps it as a dynamic process of negotiation." },
    { speaker: "指導教員", japanese: "両者の定義には、能力を静的に捉えるか動的に捉えるかという点で根本的な相違があります。本研究では、いずれの立場を採るのですか。", english: "There is a fundamental difference between the two — whether to grasp competence statically or dynamically. Which position does this study take?" },
    { speaker: "院生", japanese: "本研究は、教室内インタラクションを対象とするため、Kramsch の動的概念に依拠することが妥当かと存じます。", english: "Since this study targets in-classroom interaction, drawing on Kramsch's dynamic concept seems appropriate." },
    { speaker: "指導教員", japanese: "結構です。ただし、依拠する定義を選ぶだけでは不十分です。本稿独自の操作的定義を併せて示す必要があります。", english: "Very well. However, merely selecting the definition to draw upon is insufficient. You also need to present an operational definition of your own." },
    { speaker: "院生", japanese: "操作的定義の組み立て方について、ご示唆いただけますでしょうか。", english: "Could you give me suggestions on how to construct the operational definition?" },
    { speaker: "指導教員", japanese: "概念の核となる二、三の要素を抽出し、それぞれを観察可能な指標に翻訳することです。曖昧な抽象概念を、データで測れる形に厳密化するのです。", english: "Extract two or three elements that form the core of the concept, and translate each into observable indicators. You make the ambiguous abstract concept strict in a form measurable by data." },
    { speaker: "院生", japanese: "なるほど。たとえば「他者視点取得の頻度」と「文化的差異への明示的言及」を指標とする、といった具合でしょうか。", english: "I see. For example, taking 'frequency of perspective-taking' and 'explicit mention of cultural difference' as indicators — is that the sort of thing?" },
    { speaker: "指導教員", japanese: "そのような方向で結構です。指標が概念の全体像を捉えていない可能性についても、留保として明記しておくのが望ましい。", english: "That sort of direction will do. The possibility that the indicators do not capture the entirety of the concept should also be made explicit as a reservation." },
    { speaker: "院生", japanese: "肝に銘じます。定義の節、加筆して再度ご確認いただけますでしょうか。", english: "I will take that to heart. Could you check the definition section again after I have added to it?" },
    { speaker: "指導教員", japanese: "もちろんです。来週までにお持ちください。", english: "Of course. Please bring it by next week." }
  ],
  roleplay_prompts: [
    "Bạn cần introduce một term mới trong paper. Mở bằng 本稿では、「X」を以下のように定義する cộng định nghĩa cụ thể. KHÔNG dùng term mà không định nghĩa — reviewer Nhật ngay lập tức flag undefined terms.",
    "Bạn dùng term mà literature có 2 conflicting definitions. Phrase bằng 「X」という用語は、論者によって含意が異なるため、本稿では暫定的に〜と限定する. Acknowledge conflict + state your choice + mark provisional.",
    "Bạn đang convert abstract concept sang operational definition. Cụm 操作的に「〜」と定義される cộng nói indicators bạn sẽ dùng. KHÔNG để abstract — reviewer Nhật C1 expect operationalization."
  ],
  register_notes: "Định nghĩa thuật ngữ ở C1 academic Japanese theo 4 patterns. (1) STIPULATIVE DEFINITION (定義) — '本稿では「X」を〜と定義する'. Bạn declare ý nghĩa cho purposes của paper, không claim universal definition. Pattern an toàn nhất khi field có disagreement. (2) OPERATIONAL DEFINITION (操作的定義) — '操作的に〜と定義される' cộng observable indicators. Required cho empirical work; missing operational def = paper bị desk reject ở quantitative journals. (3) RESTRICTIVE DEFINITION (限定) — '本稿では便宜上〜に限定する'. Acknowledge term broader nhưng bound scope. 便宜上 (for convenience) signal honest scope reduction. (4) NEGATIVE DEFINITION (区別) — 'ここで言う「X」は〜を含まない' (X as referred to here does not include〜). Useful khi concept dễ bị confused với related terms. Definition syntax: subject-marker は, copula である, hoặc とは…のことである / とは…を指す. 「X」とは〜を指す là formal classroom-textbook style; 「X」を〜と定義する là journal style. Avoid 「X」って〜のことだよね (spoken). 外延 (extension — set of things term applies to) vs 内包 (intension — defining attributes) — C1 phải biết cả hai. Definition placement: ngay sau lần đầu term xuất hiện, hoặc trong subsection 「用語の定義」 ở đầu method section. KHÔNG để reader đợi đến results để biết term nghĩa gì.",
  idiom_glosses: [
    { idiom: "言葉を厳密に用いる (ことばをげんみつにもちいる)", literal: "Sử dụng từ ngữ chặt chẽ", meaning: "[書き言葉] Set phrase cho 'use words strictly/precisely' — academic virtue được expected ở C1.", example: "学術的議論においては、言葉を厳密に用いることが、論旨の明晰さを支える基盤となる。" },
    { idiom: "玉虫色 (たまむしいろ)", literal: "Màu của bọ ngọc — đổi màu theo góc nhìn", meaning: "[書き言葉] Mơ hồ một cách cố ý — diễn giải khác nhau tùy người đọc; CRITIQUE term, không phải khen.", example: "玉虫色の定義は、議論を曖昧にし、結論の検証を困難にする。" },
    { idiom: "百人百様 (ひゃくにんひゃくよう)", literal: "Trăm người trăm vẻ", meaning: "[書き言葉] Mỗi người định nghĩa khác — phù hợp khi mô tả disagreement trong literature về một concept.", example: "「グローバル化」の定義は百人百様であり、まずは本稿の用法を明示する必要がある。" },
    { idiom: "言は意を尽くさず (げんはいをつくさず)", literal: "Lời không nói hết ý", meaning: "[硬い・書き言葉] Cổ ngữ — ngôn ngữ không bao giờ truyền đạt hết khái niệm; phù hợp khi acknowledge limit của definition.", example: "言は意を尽くさずと申すように、いかなる定義も対象の全体像を完全に捉え得るものではない。" }
  ],
  cultural_notes_vi: "Văn hóa định nghĩa trong giới học thuật Nhật khác phương Tây ở 3 điểm. (1) STIPULATIVE > UNIVERSAL — phương Tây philosophy có khuynh hướng tìm 'true definition'; Nhật academic pragmatic hơn — 'cho paper này, term này nghĩa gì'. Cụm 本稿では là cốt lõi. KHÔNG claim definition của bạn là universally correct. (2) ETYMOLOGY MATTERS — Nhật scholars thường giải thích nguồn gốc kanji của term. 「適応」とは、「適」と「応」から成り、〜 (the term 'tekiou' is composed of 'teki' and 'ou', meaning〜). Mức độ etymology phụ thuộc field — humanities / linguistics nhiều, hard sciences ít. (3) BORROW WORDS REQUIRE EXTRA CARE — terms từ tiếng Anh transliterated katakana (アイデンティティ, グローバル化) đặc biệt cần định nghĩa vì meanings drift trong Japanese context khác source language. Cụm: 「アイデンティティ」という語は、英語の identity と必ずしも一致しないため、本稿では〜と限定する. Khác VN: VN academic accept loanwords thoải mái không cần định nghĩa lại; Nhật C1 expect bạn flag drift. Mẹo: tạo 用語一覧 (glossary) ở appendix nếu paper dùng > 5 specialized terms. Reviewer thanks. Đọc viên ESL student thanks even more. Mẹo cuối: trước submit, list mọi term unusual và check — đã có definition chưa, có consistent với định nghĩa của bạn xuyên suốt paper không? Concept drift mid-paper là weakness phổ biến.",
  tip_advice_vi: "Workflow định nghĩa term ở luận văn C1 Nhật. (a) IDENTIFY TERMS NEEDING DEFINITION — gồm: technical terms (jargon ngành), borrowed terms (từ ngoại), contested terms (literature disagree), neologisms (term mới của bạn). Skip: từ tiếng Nhật hàng ngày, terms định nghĩa rộng rãi và undisputed. (b) FOR EACH, CHỌN STYLE — stipulative (most general), operational (empirical work), restrictive (when field is broad), negative (when confusion likely). Mỗi term có thể cần combination. (c) PLACE STRATEGICALLY — first occurrence: short inline definition trong dấu ngoặc. Method section: full operational definition. Glossary: complete list. (d) CHECK CONSISTENCY — sau drafting, search mỗi term xuyên suốt paper, đảm bảo usage match definition. Drift là common — bạn có thể start với strict definition và slowly broaden khi viết. (e) CITE EXISTING DEFINITIONS RESPECTFULLY — nếu bạn modify Byram (1997)'s definition, frame như: Byram (一九九七) の定義を踏まえつつ、本稿では〜の点で修正を加え、〜とする. KHÔNG present modified version như nguyên bản của bạn — reviewer biết literature. Mẹo về negotiated meanings: nếu term bạn dùng có heavy political/cultural baggage (e.g. 「外国人」, 「日本語学習者」), acknowledge briefly. Cụm: 「X」という語は社会的含意を伴うことを承知しつつ、本稿では分析上の便宜から用いる. Mẹo cuối: nếu peer review push back trên definition, đừng cứng đầu. Nếu reviewer expert hiểu sai term, có nghĩa định nghĩa của bạn không clear enough cho audience rộng hơn. Revise để đỡ ambiguity, không argue rằng reviewer wrong.",
  exercises: [
    { type: "fill-blank", question: "本研究における「成功」とは、___的に「テスト得点八割以上」と定義される。", answer: "操作" },
    { type: "matching", instruction: "Ghép cụm với chức năng định nghĩa.", pairs: [
      { japanese: "本稿では〜と定義する", english: "stipulative — defines for paper's purposes" },
      { japanese: "操作的に〜と定義される", english: "operational — observable indicators" },
      { japanese: "便宜上〜に限定する", english: "restrictive — bound scope honestly" },
      { japanese: "ここで言う〜は〜を含まない", english: "negative — exclude likely confusions" }
    ] },
    { type: "translation", vietnamese: "Sự mơ hồ của thuật ngữ làm tiền đề lập luận trở nên không rõ, có thể làm lung lay cả tính giá trị của kết luận.", japanese: "用語の曖昧さは、議論の前提を不明瞭にし、結論の妥当性をも揺るがしかねない。" }
  ]
},
{
  id: 97,
  title: "Academic discourse — comparing methodologies",
  title_vi: "Diễn ngôn học thuật — So sánh các phương pháp luận",
  title_en: "Academic discourse — comparing methodologies",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "方法論 (ほうほうろん)", english: "methodology" },
    { japanese: "手法 (しゅほう)", english: "method / technique" },
    { japanese: "質的 (しつてき)", english: "qualitative" },
    { japanese: "量的 (りょうてき)", english: "quantitative" },
    { japanese: "実証的 (じっしょうてき)", english: "empirical" },
    { japanese: "比較対照 (ひかくたいしょう)", english: "comparative contrast" },
    { japanese: "長所 (ちょうしょ)", english: "strength / merit" },
    { japanese: "短所 (たんしょ)", english: "weakness / drawback" },
    { japanese: "適合性 (てきごうせい)", english: "suitability / fit" },
    { japanese: "相補的 (そうほてき)", english: "complementary" }
  ],
  examples: [
    { japanese: "本節では、二つの方法論を比較対照したうえで、本研究における選択を正当化する。", english: "In this section, after comparatively contrasting the two methodologies, the choice made in this study is justified." },
    { japanese: "質的手法は文脈の深い理解を可能にする一方、結果の一般化には制約を伴う。", english: "While qualitative methods enable deep understanding of context, generalization of results involves constraints." },
    { japanese: "量的アプローチは統計的検定を通じた一般化に資するが、現象の機微を捉えにくい。", english: "Quantitative approaches contribute to generalization through statistical testing but struggle to capture the subtleties of phenomena." },
    { japanese: "両者は対立的というよりも、相補的に位置づけられるべきものと考えられる。", english: "The two should be positioned not as oppositional but as complementary." },
    { japanese: "本研究の問いの性質に鑑みれば、混合研究法の採用が最も適合的である。", english: "In light of the nature of the research question of this study, the adoption of mixed methods is most appropriate." },
    { japanese: "いずれの手法を採るにせよ、選択の根拠を明示することが肝要である。", english: "Whichever method one adopts, making the grounds for the selection explicit is essential." }
  ],
  dialogue: [
    { speaker: "院生", japanese: "本研究の方法論について、量的か質的か、決めかねております。", english: "Regarding the methodology of this study, I am unable to decide between quantitative and qualitative." },
    { speaker: "指導教員", japanese: "問いの性質に立ち返ってみてください。何を明らかにしたいのですか。", english: "Try returning to the nature of the question. What do you wish to clarify?" },
    { speaker: "院生", japanese: "学習者がどのような過程を経て表現を習得するのか、その内的プロセスを捉えたいと考えております。", english: "I wish to capture the internal process — what kind of process learners go through to acquire expressions." },
    { speaker: "指導教員", japanese: "プロセスの解明であれば、質的手法に分があります。量的データは補強として位置づけてはいかがですか。", english: "For elucidating processes, qualitative methods have the advantage. How about positioning quantitative data as reinforcement?" }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "本日は、方法論の選択についてご相談させていただきたく存じます。", english: "Today, I would like to consult about the choice of methodology." },
    { speaker: "指導教員", japanese: "現在、どのような選択肢を比較されていますか。", english: "What options are you currently comparing?" },
    { speaker: "院生", japanese: "実験デザインによる量的検証と、エスノグラフィーに基づく質的記述、この二つでございます。", english: "Quantitative verification by experimental design and qualitative description based on ethnography — these two." },
    { speaker: "指導教員", japanese: "それぞれの長所と短所を、ご自身の言葉で整理してみてください。", english: "Try organizing the strengths and weaknesses of each in your own words." },
    { speaker: "院生", japanese: "実験法は変数統制が可能で因果推論に強みがございますが、生態的妥当性に乏しいと指摘されます。エスノグラフィーは現場の文脈を保持できる反面、結果の一般化が困難となります。", english: "The experimental method allows variable control and has strength in causal inference but is pointed out as lacking in ecological validity. Ethnography can preserve the context of the field but on the other hand, generalization of results becomes difficult." },
    { speaker: "指導教員", japanese: "両者の対比、的確に把握されています。本研究の問いは、何を明らかにすることを目指していますか。", english: "Your grasp of the contrast is accurate. What does the research question of this study aim to clarify?" },
    { speaker: "院生", japanese: "教室における学習者の表現選択が、教師の介入によってどのように変容するかでございます。", english: "How learners' expression choices in the classroom transform under teacher intervention." },
    { speaker: "指導教員", japanese: "因果と文脈の双方が問われていますね。一方の手法のみでは、片面しか照らし出せません。", english: "Both causality and context are at stake. With only one method, you can illuminate only one side." },
    { speaker: "院生", japanese: "ということは、混合研究法のほうが、本研究の問いには適合的でしょうか。", english: "Then, would mixed methods be more appropriate for this study's question?" },
    { speaker: "指導教員", japanese: "私もそう考えます。ただし、混合研究法は、二つの手法を並列するだけでは不十分です。両者の知見をいかに統合するかという論理が必須となります。", english: "I think so as well. However, mixed methods are not sufficient by merely placing two methods in parallel. The logic of how to integrate the findings of both becomes essential." },
    { speaker: "院生", japanese: "統合の論理について、参考となる先行研究はございますでしょうか。", english: "Are there prior studies that would serve as reference regarding the logic of integration?" },
    { speaker: "指導教員", japanese: "Creswell の枠組みが定評ありますが、近年の批判的検討も併せて押さえておくべきです。書誌は別途送ります。", english: "Creswell's framework is well-established, but you should also keep in view recent critical examinations. I will send the bibliography separately." },
    { speaker: "院生", japanese: "ありがとうございます。方法論の節、書き直してまいります。", english: "Thank you. I will rewrite the methodology section." }
  ],
  roleplay_prompts: [
    "Bạn justify chọn qualitative cho paper. Phrase bằng 本研究の問いの性質に鑑みれば、質的手法の採用が最も適合的である cộng nói trade-offs. KHÔNG dismiss quantitative — frame như 適合性 (fit) cho problem cụ thể này.",
    "Reviewer chỉ trích bạn 'không generalize'. Đáp lại bằng 本研究の方法論的選択は、文脈の深い理解を優先したものであり、一般化は今後の量的検証に委ねたく存じます. Acknowledge limit + reframe scope.",
    "Bạn proposing mixed methods. Cần justify integration logic. Phrase bằng 質的知見は量的検証の前提を提供し、量的結果は質的解釈の妥当性を支える、相互補完的な関係を想定している. Articulate WHY hai methods together > sum of parts."
  ],
  register_notes: "So sánh phương pháp ở C1 academic Japanese theo 4 nguyên tắc. (1) BALANCE BEFORE PREFERENCE — luôn present strengths của BOTH methods trước khi declare lựa chọn của bạn. Một-sided comparison ngay lập tức flag là biased. Cụm: 一方〜、他方〜 (on one hand, on the other), 〜の長所は〜にあるが、短所として〜が指摘される. (2) FRAME AS FIT, NOT QUALITY — KHÔNG nói method A 'better than' B; nói method A 'more 適合的 (suited)' to your specific question. 適合性 (fit) > 優劣 (superiority) là academic norm. Method A cho question X, method B cho question Y; both legitimate. (3) ACKNOWLEDGE TRADE-OFFS — every choice có cost. Cụm: 〜を採用することに伴い、〜の側面については別途の検討を要する. Show bạn understand trade-off, không pretend chosen method có no weakness. (4) INTEGRATION LOGIC FOR MIXED METHODS — nếu propose mixed methods, MUST articulate how qualitative + quantitative integrate. Sequential? Parallel? Embedded? Reviewer Nhật particularly strict về điểm này. Cụm: 質的知見は〜を提供し、量的結果は〜を裏付ける、相補的関係を想定する. Comparison structure templates: '〜は〜である一方、〜は〜である' (parallel), '〜と異なり、〜は〜' (contrast), '〜と共通する点として〜が挙げられる' (similarity), '〜と〜との相違は、〜という点に求められる' (locating difference). Avoid: 'A は B より良い' (A is better than B) — too absolute, no fit-frame. Use 'A は本研究の目的に照らし、B より適合的である' (A, in light of this study's aim, is more suited than B). Cẩn thận: trong field debates về method (quant vs qual wars), maintain neutral stance. Partisan tone gây alienate reviewers từ phía đối lập.",
  idiom_glosses: [
    { idiom: "適材適所 (てきざいてきしょ)", literal: "Đúng tài, đúng chỗ", meaning: "[書き言葉] Method phù hợp với problem phù hợp — core principle khi chọn methodology.", example: "研究方法の選択は、適材適所の原則に基づき、問いの性質に応じて行われるべきである。" },
    { idiom: "二兎を追う者は一兎をも得ず (にとをおうものはいっとをもえず)", literal: "Đuổi hai con thỏ thì không bắt được cả hai", meaning: "[書き言葉] Cẩn báo against poorly-integrated mixed methods — chasing both ends up grasping neither.", example: "混合研究法は強力であるが、統合の論理を欠けば、二兎を追う者は一兎をも得ずとなりかねない。" },
    { idiom: "一長一短 (いっちょういったん)", literal: "Một cái dài, một cái ngắn", meaning: "[書き言葉・話し言葉] Mỗi cái có long-and-short — set phrase neutral cho 'each has merits and demerits'.", example: "両手法は一長一短であり、研究目的に応じた選択が求められる。" },
    { idiom: "車の両輪 (くるまのりょうりん)", literal: "Hai bánh xe của xe ngựa", meaning: "[書き言葉] Hai elements thiết yếu, không tách rời — phù hợp khi mô tả qual và quant như mutually necessary.", example: "質的研究と量的研究は、社会科学の車の両輪と言うべき関係にある。" }
  ],
  cultural_notes_vi: "So sánh methodology ở Nhật academic culture có 3 đặc điểm. (1) METHODOLOGICAL PLURALISM — Nhật academia, đặc biệt trong social sciences và humanities, tolerant với nhiều paradigms. Khác US/UK fields có method wars (quant vs qual conflict), Nhật default là 共存 (coexistence). Bạn có thể đề xuất qualitative trong field thường quant mà không bị dismissed nếu justification mạnh. (2) HIERARCHY OF METHODS BY FIELD — biology/chemistry: quant default; sociology/anthropology: qual respected equally; education: mixed methods phổ biến; psychology: quant dominant nhưng qual subfield tồn tại. Biết hierarchy của field bạn trước khi chọn. (3) METHOD AS APPRENTICESHIP — Nhật academic culture train methods qua 師弟関係 (master-apprentice relationship). Method choice của bạn often phản ánh advisor's tradition. Switching method đột ngột mà không thảo luận với advisor là institutional misstep, không chỉ academic. Cụm: 先生のご指導を仰ぎたく (would like to receive your guidance) khi propose method change. Khác VN: ở VN methodology section thường ngắn gọn formulaic; ở Nhật C1 paper, methodology rationale có thể chiếm 15-20 phần trăm paper, especially trong PhD theses. Đầu tư thời gian. Mẹo: tham khảo 3-5 papers gần đây trong target journal, xem họ structure methodology section như thế nào. Convention dày đặc và journal-specific. Mẹo cuối: nếu reviewer push back trên method choice, KHÔNG đổi method ở revision — defend choice với better articulated rationale. Switching methods mid-revision = signal bạn không thoughtful về choice ban đầu.",
  tip_advice_vi: "Cấu trúc method-comparison section ở C1 Nhật. (a) PROBLEM-FRAMED OPENING — mở bằng research question, không bằng method list. Cụm: 本研究の問い、すなわち〜を明らかにするためには、いかなる方法論が適合的であろうか. Đặt vấn đề trước khi present options. (b) PRESENT 2-3 OPTIONS NEUTRALLY — mỗi option 1 paragraph: brief description, primary strength, primary weakness, prior usage trong field. KHÔNG editorialize ở stage này. Reader cần thấy bạn fair-minded. (c) APPLY FIT CRITERIA — explicit list 3-4 criteria từ research question (e.g., causal inference vs descriptive understanding, generalizability priority, sample size feasibility). Score mỗi option chống lại criteria. (d) DECLARE CHOICE WITH EXPLICIT RATIONALE — '以上の比較に基づき、本研究は〜を採用する。その理由は、第一に〜、第二に〜である'. Numbered rationale > vague gesture. (e) ACKNOWLEDGE TRADE-OFFS COMPLETELY — '本選択に伴う制約として、〜が挙げられる。これに対し、〜により補完を試みる'. Show bạn aware of cost + plan compensation. Mẹo về citation choice: cite methodologists (Creswell, Yin, Flick, Glaser & Strauss for qual; Cohen, Tabachnick for quant) là expected ở C1. Methodology paragraph với 0 method citations đọc như amateur. Mẹo về Japanese-specific: nếu method được developed bởi Nhật scholar (e.g., 状況的学習論), cite original Nhật source — reviewer Nhật value local intellectual lineage. Mẹo cuối: đọc lại comparison section asking 'reviewer của paradigm đối lập đọc cái này có cảm thấy fairly represented không?'. Nếu không, revise. Fairness của comparison là test of academic maturity.",
  exercises: [
    { type: "fill-blank", question: "両者は対立的というよりも、___的に位置づけられるべきものと考えられる。", answer: "相補" },
    { type: "matching", instruction: "Ghép cụm với chức năng so sánh.", pairs: [
      { japanese: "〜の長所は〜にあるが、短所として〜が指摘される", english: "balanced presentation of one method" },
      { japanese: "本研究の問いの性質に鑑みれば", english: "ground choice in research question, not preference" },
      { japanese: "適合性", english: "fit-frame replaces superiority-frame" },
      { japanese: "相補的に位置づけられる", english: "frame methods as complementary, not oppositional" }
    ] },
    { type: "translation", vietnamese: "Dù áp dụng phương pháp nào, việc làm rõ căn cứ của lựa chọn là điều cốt yếu.", japanese: "いずれの手法を採るにせよ、選択の根拠を明示することが肝要である。" }
  ]
},
{
  id: 98,
  title: "Academic discourse — critiquing a study",
  title_vi: "Diễn ngôn học thuật — Phê bình một nghiên cứu",
  title_en: "Academic discourse — critiquing a study",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "批評 (ひひょう)", english: "critique" },
    { japanese: "評価 (ひょうか)", english: "evaluation" },
    { japanese: "限界 (げんかい)", english: "limitation" },
    { japanese: "課題 (かだい)", english: "issue / outstanding task" },
    { japanese: "示唆に富む (しさにとむ)", english: "rich in implications" },
    { japanese: "不備 (ふび)", english: "deficiency / shortcoming" },
    { japanese: "再現性 (さいげんせい)", english: "reproducibility" },
    { japanese: "意義 (いぎ)", english: "significance" },
    { japanese: "貢献 (こうけん)", english: "contribution" },
    { japanese: "改善の余地 (かいぜんのよち)", english: "room for improvement" }
  ],
  examples: [
    { japanese: "本書評は、〇〇 (二〇二三) の意義と課題を併せて検討するものである。", english: "This book review examines both the significance and the issues of XX (2023)." },
    { japanese: "本書は示唆に富む知見を多数提示しており、当該領域への貢献は大きい。", english: "This book presents numerous findings rich in implications, and its contribution to the field is substantial." },
    { japanese: "ただし、サンプル選定の妥当性については、なお検討の余地が残されている。", english: "However, regarding the validity of sample selection, room for examination still remains." },
    { japanese: "分析手法の透明性が十分に確保されておらず、再現性の点で課題が指摘されよう。", english: "The transparency of the analytical method is not sufficiently secured, and an issue may be pointed out regarding reproducibility." },
    { japanese: "結論部における一般化の射程が、データの裏付けを超えているように思われる。", english: "The scope of generalization in the conclusion appears to exceed what the data supports." },
    { japanese: "とはいえ、これらの限界は本書の意義を損なうものではなく、むしろ今後の研究の足がかりとなろう。", english: "That said, these limitations do not detract from the significance of this book; rather, they will serve as a foothold for future research." }
  ],
  dialogue: [
    { speaker: "編集者", japanese: "次号の書評欄に、田中氏の新著の批評をお願いできますでしょうか。", english: "Could we ask you for a critique of Mr. Tanaka's new book for the next issue's book review section?" },
    { speaker: "評者", japanese: "謹んでお引き受けいたします。意義と課題を併せて論じる方向でよろしいでしょうか。", english: "I will respectfully accept. Would the direction of discussing both significance and issues be acceptable?" },
    { speaker: "編集者", japanese: "結構です。批判は建設的にお願いいたします。当該分野の発展に資する形で。", english: "That will do. Please make the criticism constructive — in a form that contributes to the development of the field." },
    { speaker: "評者", japanese: "承知いたしました。長所を十分に評価したうえで、改善の余地を指摘するよう心がけます。", english: "Understood. I will take care to fully evaluate the strengths first, then point out room for improvement." }
  ],
  dialogue_long: [
    { speaker: "評者", japanese: "本書評の執筆にあたり、まず本書の貢献を整理いたしましたので、ご報告させていただきます。", english: "In writing this book review, I first organized the contributions of the book; allow me to report on it." },
    { speaker: "編集者", japanese: "お聞かせください。", english: "Please tell me." },
    { speaker: "評者", japanese: "本書の最大の貢献は、これまで断片的に論じられてきた言語接触現象を、一貫した理論的枠組みのもとに体系化した点にございます。", english: "The greatest contribution of this book is having systematized, under a coherent theoretical framework, language contact phenomena that have hitherto been discussed in fragmented fashion." },
    { speaker: "編集者", japanese: "なるほど。逆に、課題と感じられた点はいかがでしょうか。", english: "I see. Conversely, what about the points you felt to be issues?" },
    { speaker: "評者", japanese: "三点ございます。第一に、提示された事例が東アジア圏に偏っており、理論の一般化可能性に留保が必要な点でございます。", english: "There are three. First, the cases presented are biased toward the East Asian sphere, and reservations are necessary regarding the generalizability of the theory." },
    { speaker: "編集者", japanese: "重要なご指摘です。第二点はいかがですか。", english: "An important point. What about the second?" },
    { speaker: "評者", japanese: "第二に、引用されているデータの一部について、出典の追跡が困難であり、再現性の観点から疑問が残ります。", english: "Second, regarding part of the data cited, tracking the source is difficult, and doubt remains from the perspective of reproducibility." },
    { speaker: "編集者", japanese: "それは深刻な指摘になりかねません。慎重な書きぶりをお願いいたします。", english: "That could become a serious indication. Please write with caution." },
    { speaker: "評者", japanese: "肝に銘じます。事実関係を確認したうえで、断定を避け、「読者にとって追跡が困難である」と限定的に記す予定でございます。", english: "I take that to heart. After confirming the facts, I plan to avoid definitive statements and write in a limited manner as 'difficult for the reader to trace.'" },
    { speaker: "編集者", japanese: "結構です。第三点は。", english: "Very well. The third point?" },
    { speaker: "評者", japanese: "第三に、結論部で示される政策提言が、本書の実証部分から論理的に必然と言えるかについては、なお検討の余地がございます。", english: "Third, regarding whether the policy recommendations shown in the conclusion can be said to be logically necessary from the empirical portion of the book, room for examination still remains." },
    { speaker: "編集者", japanese: "全体として、批評の枠組みは整っているように思われます。長所評価とのバランスも忘れずに。", english: "Overall, the framework of the critique appears well-organized. Don't forget the balance with the evaluation of strengths." },
    { speaker: "評者", japanese: "承知いたしました。批判が長所を覆い隠すことのないよう、構成を吟味いたします。", english: "Understood. I will scrutinize the composition so that the criticism does not obscure the strengths." }
  ],
  roleplay_prompts: [
    "Bạn viết book review. Mở bằng evaluation of contribution: 本書の最大の貢献は〜にある, sau đó 1-2 paragraphs về strengths. CHỈ SAU ĐÓ critique. Nhật review norm: praise > critique trong tỉ lệ ít nhất 1:1.",
    "Bạn cần raise serious concern về data sourcing. KHÔNG accuse fabrication. Cụm: 〜の出典追跡が困難であり、再現性の観点から疑問が残る. Frame như reader experience, không như author misconduct.",
    "Closing critique. Cụm: これらの限界は本書の意義を損なうものではなく、むしろ今後の研究の足がかりとなろう. Reframe limitations như opportunities — softens critique, preserves author's standing."
  ],
  register_notes: "Book/study critique ở C1 academic Japanese theo quy ước 評価-課題-展望 (evaluation-issues-prospects). (1) STRUCTURE — opening: situate book trong field (3-5 câu); contribution: strengths với specifics (2-3 paragraphs); critique: 2-4 issues, mỗi cái 1 paragraph; conclusion: reframe limitations như opportunities cho future work. KHÔNG mở bằng critique — taboo. (2) CRITIQUE LANGUAGE TIERS — gentle: 〜の余地が残されている (room remains for), 〜について再検討が望まれる (re-examination is desired). Medium: 〜には不備が認められる (deficiency is recognized in), 〜の点で課題が指摘されよう (an issue may be pointed out). Strong: 〜は妥当性を欠くと言わざるを得ない (it must be said that〜lacks validity), 〜は誤りであると思われる (appears to be erroneous). Strong tier hiếm khi dùng cho whole book; reserve cho specific factual errors. (3) ATTRIBUTE TO TEXT, NOT AUTHOR — '本書は〜' (this book〜) ✓; '田中氏は〜という誤りを犯している' (Mr. Tanaka commits the error of〜) ✗. Critique work, không person. (4) NUMBERED CONCERNS — '第一に〜、第二に〜、第三に〜' makes critique scannable và signals organized thought, không emotional reaction. (5) BALANCE CLOSE — kết luận book review nên reaffirm overall value. Cụm: これらの限界は本書の意義を損なうものではない / 当該分野への貢献は大きい. Critique without closing balance đọc như hatchet job. Avoid: 'つまらない' (boring), '間違っている' (wrong) — too direct; '駄作' (worthless work) — never. Đặc biệt nguy hiểm: critiquing senior scholar (大家). Extra hedge required, public critique nên ít nhất 70 phần trăm appreciation. Direct critique thường handled qua personal correspondence hoặc 私信, không public review.",
  idiom_glosses: [
    { idiom: "賛否両論 (さんぴりょうろん)", literal: "Cả khen và chê", meaning: "[書き言葉・話し言葉] Vừa có ủng hộ vừa có phản đối — phù hợp khi mô tả mixed reception của work.", example: "本書の主張は学界において賛否両論を呼んでおり、本書評もその議論への一寄稿となろう。" },
    { idiom: "瑕瑾 (かきん)", literal: "Vết và lỗi nhỏ", meaning: "[硬い・書き言葉] Khuyết điểm nhỏ trong tổng thể tốt — diplomatic critique vocabulary.", example: "本書は優れた成果であり、指摘した二、三の瑕瑾は、その価値を損なうものではない。" },
    { idiom: "片手落ち (かたておち)", literal: "Một tay rơi (mất cân bằng)", meaning: "[書き言葉・話し言葉] Bias một chiều, không đầy đủ — cảnh báo critique của bạn không nên trở thành片手落ち.", example: "長所のみを論じ、課題に触れないのでは、書評として片手落ちと言わざるを得ない。" },
    { idiom: "敬意を払う (けいいをはらう)", literal: "Tỏ kính ý", meaning: "[書き言葉] Tôn trọng — pair với critique để frame như respectful disagreement, không attack.", example: "著者の長年にわたる研鑽に敬意を払いつつ、以下の三点について再考を提起したい。" }
  ],
  cultural_notes_vi: "Văn hóa critique trong academia Nhật khác phương Tây ở 4 điểm. (1) PRAISE-FIRST RULE NGHIÊM NGẶT — phương Tây critique có thể balanced 50/50; Nhật academic critique strongly skews positive (70/30 minimum). Critique heavy without praise foundation đọc như mean-spirited. (2) SENIORITY HIERARCHY MATTERS — critiquing 大家 (eminent senior scholar) requires 99 phần trăm appreciation, 1 phần trăm issue. Critiquing peer cho phép more balance. Critiquing junior shouldn't be done in public — handle privately. Học senior status của author trước khi viết review. (3) FACE-PRESERVING LANGUAGE — direct disagreement gây loss of face cho author và reflects badly trên reviewer. Hedge dày: 〜という解釈もあり得よう (interpretation〜 might also be possible) thay vì 〜は誤っている (〜is wrong). (4) PUBLIC vs PRIVATE CRITIQUE — serious concerns thường handled qua personal correspondence (私信) hoặc closed seminars. Public review reserved cho mild observations. Western 'destruction' reviews (e.g. some major journals) effectively không tồn tại trong Nhật academic culture. Khác VN: VN critique culture variable, hơi giống Nhật nhưng với less rigid hierarchy. Việc transplant Western 'tough love' review style vào Nhật context có thể end careers. Mẹo: nếu bạn có serious concern về paper, FIRST send personal email gợi ý, gauge response, then quyết định public review tone. Mẹo cuối: post-critique relationship matters. Authors remember reviewers cho decades. Critique mà bạn không thể defend mặt-đối-mặt với author tại 学会 next year là critique không nên publish.",
  tip_advice_vi: "Workflow viết một book review C1 Nhật hiệu quả. (a) READ TWICE — first read cho overall impression, second read cho specific evidence để cite. KHÔNG viết review từ first reading — bias dễ bias cao. (b) NOTE STRENGTHS 그 EQUALLY VỚI ISSUES — habit của critic là note flaws; counterbalance by explicitly noting strengths trong notes. Aim 5 strength notes : 3 issue notes ratio. (c) CHỌN 2-4 ISSUES MAXIMUM — 1 issue review đọc shallow; 6+ đọc petty. 3 well-developed issues là sweet spot. (d) FOR EACH ISSUE, FOLLOW 4-PART STRUCTURE — describe what book does (1-2 sentences) → identify the gap or concern (1-2 sentences) → explain why it matters (1-2 sentences) → suggest direction (1 sentence). Without (d), critique đọc như complaint. (e) DRAFT, COOL, REVISE — sau first draft, chờ 48 hours, đọc lại askind 'does this read like a fair-minded reviewer? Or a frustrated one?'. Revise tone-only ở second pass. (f) HEDGE STRENGTH MATCHING SEVERITY — typo / minor inaccuracy: gentle hedge. Methodological concern: medium. Factual error: strong but specific. Calibrate. Mẹo về citation — review nên cite 5-15 secondary sources tự nó: prior reviews của same book (nếu có), comparable works, frameworks bạn invoke. Review with 0 outside citations đọc như opinion piece, không academic critique. Mẹo về length — Nhật academic book reviews typically 2,000-4,000 字 (Japanese characters). Lá thư ngắn impression piece OK ở popular venues; refereed journals expect substantial review. Mẹo cuối: KHÔNG WRITE REVIEW IF BẠN COULD NOT WRITE A BOOK ON SAME TOPIC — phương châm Nhật academic. Nếu bạn không có competence để critique, decline review request. Reviewer competence phải match author competence cho review để có giá trị.",
  exercises: [
    { type: "fill-blank", question: "とはいえ、これらの限界は本書の意義を___ものではなく、むしろ今後の研究の足がかりとなろう。", answer: "損なう" },
    { type: "matching", instruction: "Ghép cụm với chức năng phê bình.", pairs: [
      { japanese: "示唆に富む知見", english: "praise — substantive contribution" },
      { japanese: "再現性の観点から疑問が残る", english: "medium critique — methodological concern" },
      { japanese: "なお検討の余地が残されている", english: "gentle critique — opportunity for refinement" },
      { japanese: "今後の研究の足がかりとなろう", english: "reframe limitation as future-research seed" }
    ] },
    { type: "translation", vietnamese: "Phạm vi tổng quát hóa trong phần kết luận dường như vượt quá những gì dữ liệu cho phép.", japanese: "結論部における一般化の射程が、データの裏付けを超えているように思われる。" }
  ]
},
{
  id: 99,
  title: "Academic discourse — conference Q&A register",
  title_vi: "Diễn ngôn học thuật — Ngữ vực hỏi đáp tại hội thảo",
  title_en: "Academic discourse — conference Q&A register",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "質疑応答 (しつぎおうとう)", english: "Q&A session" },
    { japanese: "発表者 (はっぴょうしゃ)", english: "presenter" },
    { japanese: "司会者 (しかいしゃ)", english: "chair / moderator" },
    { japanese: "フロア", english: "floor (audience)" },
    { japanese: "ご教示 (ごきょうじ)", english: "instruction / enlightenment (humble)" },
    { japanese: "ご清聴 (ごせいちょう)", english: "kind attention (closing phrase)" },
    { japanese: "差し支えなければ (さしつかえなければ)", english: "if it does not inconvenience you" },
    { japanese: "失礼ながら (しつれいながら)", english: "if I may be so impolite" },
    { japanese: "持ち時間 (もちじかん)", english: "allotted time" },
    { japanese: "趣旨 (しゅし)", english: "intent / gist" }
  ],
  examples: [
    { japanese: "ご清聴ありがとうございました。ご質問、ご意見をお願いいたします。", english: "Thank you for your kind attention. I welcome your questions and comments." },
    { japanese: "貴重なご発表、ありがとうございました。一点、ご教示いただきたく存じます。", english: "Thank you for the valuable presentation. I would like to receive instruction on one point." },
    { japanese: "ご質問の趣旨を、私なりに確認させていただいてもよろしいでしょうか。", english: "May I confirm the intent of your question in my own words?" },
    { japanese: "失礼ながら、その点については本研究の射程外でございます。", english: "If I may be impolite, that point falls outside the scope of this study." },
    { japanese: "差し支えなければ、ご質問の背景についてもう少しお聞かせいただけますか。", english: "If it does not inconvenience you, could you tell me a little more about the background of your question?" },
    { japanese: "持ち時間の関係上、簡潔にお答えさせていただきます。", english: "Due to time constraints, allow me to answer concisely." }
  ],
  dialogue: [
    { speaker: "司会者", japanese: "それでは、フロアからご質問を承ります。挙手にてお願いいたします。", english: "Now then, we will receive questions from the floor. Please raise your hand." },
    { speaker: "質問者", japanese: "貴重なご発表、ありがとうございました。所属は〇〇大学の田中と申します。一点、ご教示いただきたく存じます。", english: "Thank you for the valuable presentation. I am Tanaka from XX University. I would like to receive instruction on one point." },
    { speaker: "発表者", japanese: "田中先生、ご質問ありがとうございます。どうぞお願いいたします。", english: "Professor Tanaka, thank you for the question. Please go ahead." },
    { speaker: "質問者", japanese: "サンプル選定の基準について、もう少し詳しくご説明いただけますでしょうか。", english: "Regarding the criteria for sample selection, could you explain in a little more detail?" }
  ],
  dialogue_long: [
    { speaker: "司会者", japanese: "ご発表、お疲れ様でした。質疑応答に移らせていただきます。フロアの皆様、いかがでしょうか。", english: "Thank you for your presentation. We will move to the Q&A. Audience members, how about you?" },
    { speaker: "質問者A", japanese: "貴重なご発表ありがとうございました。所属は〇〇研究所の山田と申します。二点伺ってもよろしいでしょうか。", english: "Thank you for the valuable presentation. I am Yamada from the XX Institute. May I ask two points?" },
    { speaker: "発表者", japanese: "山田先生、よろしくお願いいたします。", english: "Professor Yamada, please go ahead." },
    { speaker: "質問者A", japanese: "第一に、対照群の設定について、サンプル間の同質性をいかに確保されたのか、ご教示いただけますでしょうか。", english: "First, regarding the establishment of the control group, could you explain how you secured homogeneity between samples?" },
    { speaker: "発表者", japanese: "ご質問ありがとうございます。年齢、学習歴、母語の三変数について、群間で統計的に有意な差がないことを事前に確認いたしました。詳細は配布資料の三ページに記載しております。", english: "Thank you for the question. Regarding the three variables of age, learning history, and native language, I confirmed in advance that there were no statistically significant differences between the groups. Details are noted on page three of the handout." },
    { speaker: "質問者A", japanese: "承知いたしました。第二点は、結論部の一般化についてでございます。本研究の知見は、他の言語圏の学習者にも適用可能とお考えでしょうか。", english: "Understood. The second point is about the generalization in the conclusion. Do you think the findings of this study are also applicable to learners of other language spheres?" },
    { speaker: "発表者", japanese: "鋭いご指摘でございます。本研究は東アジア圏の学習者を対象としており、他言語圏への適用には別途の検証が必要と考えております。この点、結論部に明記すべきでございました。", english: "An incisive point. This study targeted learners of the East Asian sphere, and application to other language spheres requires separate verification. I should have made this explicit in the conclusion." },
    { speaker: "質問者A", japanese: "丁寧なご回答、ありがとうございました。", english: "Thank you for the careful response." },
    { speaker: "司会者", japanese: "次のご質問、いかがでしょうか。", english: "How about the next question?" },
    { speaker: "質問者B", japanese: "失礼いたします。所属は△△大学の鈴木と申します。発表の趣旨を確認させていただきたいのですが、X と Y の関係について、因果と解釈してよろしいのでしょうか。", english: "Excuse me. I am Suzuki from Triangle University. I would like to confirm the intent of the presentation — is it acceptable to interpret the relationship between X and Y as causal?" },
    { speaker: "発表者", japanese: "鈴木先生、重要な確認をありがとうございます。本研究では、相関を確認したにとどまり、因果の主張は控えております。表現が紛らわしかったとすれば、お詫び申し上げます。", english: "Professor Suzuki, thank you for the important confirmation. In this study, we have only confirmed correlation and have refrained from claims of causality. If the expression was misleading, I apologize." },
    { speaker: "質問者B", japanese: "明確になりました。ありがとうございました。", english: "It has become clear. Thank you." },
    { speaker: "司会者", japanese: "持ち時間が押しております。最後の質問とさせていただきます。", english: "Time is pressing. Let us make this the last question." }
  ],
  roleplay_prompts: [
    "Bạn presenter mở Q&A. Cụm: ご清聴ありがとうございました。ご質問、ご意見をお願いいたします. Sau câu hỏi đầu tiên, repeat thanks: ご質問ありがとうございます. KHÔNG skip thanks — bare 'はい' sound brusque.",
    "Bạn ask question từ floor. Mandatory format: greet (失礼いたします hoặc 貴重なご発表ありがとうございました) cộng identify (所属は〇〇大学の〜と申します) cộng question. KHÔNG bỏ identify — Nhật conference convention.",
    "Bạn không biết câu trả lời. KHÔNG bịa. Cụm: ご質問の点については、現時点で十分に検討できておりません。今後の課題として承ります. Honest deferral được respected hơn pretend-knowledge."
  ],
  register_notes: "Q&A register ở Nhật conference theo strict choreography. (1) OPENING SEQUENCE — presenter kết bằng ご清聴ありがとうございました. Chair (司会者) opens floor: フロアからご質問を承ります. Questioner waits to be recognized, đứng lên (nếu microphone), đầu tiên identify: 失礼いたします hoặc greet, sau đó 所属は〇〇の〜と申します. Skip identify = breach of etiquette. (2) QUESTION FRAMING — gentle prelude required: 貴重なご発表ありがとうございました cộng 一点ご教示いただきたく hoặc 二点伺ってもよろしいでしょうか. Pure question without prelude đọc aggressive. Number questions nếu multiple. (3) PRESENTER RESPONSE — start với thank: ご質問ありがとうございます. Confirm understanding nếu unclear: ご質問の趣旨を確認させていただいてもよろしいでしょうか. Answer organized: 結論を申し上げますと cho concise; 三点に分けてお答えします cho complex. End với お答えになっておりますでしょうか (does this answer your question?) — invites follow-up. (4) HONORIFIC ASYMMETRY — questioner uses humble forms toward presenter (お聞かせいただけますか, ご教示いただけますか); presenter uses humble toward questioner (お答えさせていただきます, 承知いたしました). Equal-equal humility, neither dominates. (5) HANDLING DIFFICULT QUESTIONS — defer: 今後の課題として承ります (I receive as future task). Scope-out: 本研究の射程外でございます. Acknowledge limit: 現時点で十分に検討できておりません. KHÔNG fake answer — caught easily, reputational damage permanent. (6) CHAIR'S ROLE — manages time (持ち時間が押しております), prevents single questioner monopoly, closes session. Đừng challenge chair's calls. Vocabulary forbidden in Q&A: それは違います (that's wrong), わかりません (don't know — too bare; use 検討不足でございます), 関係ない (irrelevant — never). Time discipline: questions 30-60 sec, answers 60-120 sec. Long monologue questions ('actually what I want to comment is...') breach etiquette — chair will cut.",
  idiom_glosses: [
    { idiom: "釈迦に説法 (しゃかにせっぽう)", literal: "Giảng đạo cho Phật Thích Ca", meaning: "[書き言葉・話し言葉] Dạy expert thứ họ đã biết — humble disclaimer khi raise question to senior: 釈迦に説法かもしれませんが.", example: "釈迦に説法かもしれませんが、〇〇 (二〇二〇) においても同様の論点が指摘されているかと存じます。" },
    { idiom: "蛇足 (だそく)", literal: "Vẽ rắn thêm chân", meaning: "[書き言葉・話し言葉] Thêm thừa, không cần thiết — humble disclaimer ở cuối comment: 蛇足ながら.", example: "蛇足ながら一言申し添えますと、本論点は次回学会でも継続して議論されるものと伺っております。" },
    { idiom: "問うは一旦の恥、問わぬは末代の恥 (とうはいったんのはじ、とわぬはまつだいのはじ)", literal: "Hỏi là xấu hổ một lúc, không hỏi là xấu hổ cả đời", meaning: "[書き言葉] Better ask now than wonder forever — encouragement để raise basic question without shame.", example: "問うは一旦の恥と申しますし、初歩的な点ですがお伺いさせてください。" },
    { idiom: "ご教示を賜る (ごきょうじをたまわる)", literal: "Nhận sự chỉ dạy", meaning: "[硬い・書き言葉] Most humble form cho 'receive instruction' — deploy khi questioning a senior.", example: "本件につきましては、先生のご教示を賜れれば幸甚に存じます。" }
  ],
  cultural_notes_vi: "Q&A culture ở Nhật conference khác phương Tây ở 4 điểm. (1) THANKS RITUAL — Western Q&A có thể skip thanks, đi thẳng vào question. Nhật mandatory mở bằng thanks. Skip = read as rude regardless of question quality. (2) IDENTIFY SELF — Nhật convention: 所属 + last name. Western có thể just ask without identify. Trong Nhật, anonymous question seen as cowardly. Even nếu chair already mới bạn lên, repeat self-identify in your opening. (3) NO 'GOTCHA' QUESTIONS — Western academic culture sometimes celebrates question designed to expose flaw publicly. Nhật strongly disapprove — gây loss of face cho presenter, reflects badly on questioner. Critique style: 'I'd like to learn more about how you addressed〜' rather than 'You didn't address〜'. (4) AUDIENCE-MEMBER COMMENTS THAY VÌ QUESTIONS — Western Q&A allows extended comments masquerading as questions ('I'd like to add to your point...'). Nhật convention: questions only, save extended comments cho networking break. Chair may cut long-comment-question politely. Khác VN: VN seminar Q&A typically informal hơn, less choreographed; chuyển sang Nhật context cần học chính xác sequence. Mẹo: trước first conference Nhật, attend 2-3 sessions chỉ để observe Q&A choreography. Memorize phrases. Practice một identify-question-thank sequence trước khi attempt. Mẹo: nếu bạn presenter và Q&A run dry (silence), KHÔNG awkwardly fill. Chair handles. Nếu muốn solicit specific feedback, prepare 1 question planted với colleague trước. Mẹo cuối: post-Q&A networking quan trọng. Approach questioners afterward: 先ほどはご質問ありがとうございました. Initiates relationship. Many career opportunities trong Nhật academia start với post-Q&A coffee.",
  tip_advice_vi: "Pre-conference Q&A preparation cho presenter ở C1. (a) PREDICT QUESTIONS — list 5-7 likely questions trước presentation. For each, prepare 60-second answer. Cover: methodology choice, sample limitation, generalization scope, alternative interpretation, future direction. (b) PREPARE 'I DON'T KNOW' VERSIONS — practice 3 graceful deferrals: その点は今後の課題として承ります / 現時点で十分に検討できておりません / 本研究の射程外でございます. Có sẵn lúc panic. (c) BRING HANDOUT (配布資料) — 1-2 page sheet với data details. Refer trong Q&A: 詳細は配布資料の〜ページに記載しております. Saves time, demonstrates preparation. (d) WATER NEARBY — speaking dries throat; pause để uống signals composure, not weakness. Đối với questioner ở C1: (a) LISTEN ENTIRE PRESENTATION — taking notes throughout, không formulate question từ first 5 phút then mentally check out. Best questions reflect comprehensive listening. (b) WAIT YOUR TURN — Nhật convention: chair recognizes hand-raised order. Don't bypass. (c) SHORT QUESTIONS WIN — 30-second focused question > 2-minute meandering preamble. Chair và audience appreciate. (d) ONE QUESTION PER TURN — nếu bạn really need 2-3, ask one, wait response, raise hand again later. Chain-questioning hogs time. (e) FOLLOW UP OFFLINE — extended exchange, technical detail, criticism — handle qua email post-conference. Cụm follow-up: 先日の学会では貴重なご発表をありがとうございました cộng your detailed point. Mẹo về Q&A note-taking: presenter nên ghi xuống mọi câu hỏi nhận được, regardless of answer chất lượng. Sau conference, 24-hour-rule: review notes, identify weakest answers, strengthen cho next conference hoặc paper revision. Conference Q&A là live peer review — value the data. Mẹo cuối: post-presentation, send formal thanks cho chair: 本日は座長の労、誠にありがとうございました. Maintain relationship, opens future invitation.",
  exercises: [
    { type: "fill-blank", question: "貴重なご発表、ありがとうございました。一点、ご___いただきたく存じます。", answer: "教示" },
    { type: "matching", instruction: "Ghép cụm với chức năng Q&A.", pairs: [
      { japanese: "ご質問の趣旨を確認させていただいてもよろしいでしょうか", english: "presenter — verify question before answering" },
      { japanese: "今後の課題として承ります", english: "presenter — graceful deferral when unsure" },
      { japanese: "失礼ながら、その点は本研究の射程外でございます", english: "presenter — scope-out gracefully" },
      { japanese: "差し支えなければ、もう少しお聞かせいただけますか", english: "presenter — invite questioner to elaborate" }
    ] },
    { type: "translation", vietnamese: "Do giới hạn thời gian, cho phép tôi trả lời ngắn gọn.", japanese: "持ち時間の関係上、簡潔にお答えさせていただきます。" }
  ]
},
{
  id: 100,
  title: "Academic discourse — abstract and summary writing",
  title_vi: "Diễn ngôn học thuật — Viết tóm tắt (abstract) và tổng kết",
  title_en: "Academic discourse — abstract and summary writing",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "抄録 (しょうろく)", english: "abstract" },
    { japanese: "要旨 (ようし)", english: "summary / gist" },
    { japanese: "概要 (がいよう)", english: "overview" },
    { japanese: "目的 (もくてき)", english: "purpose" },
    { japanese: "方法 (ほうほう)", english: "method" },
    { japanese: "結果 (けっか)", english: "result" },
    { japanese: "結論 (けつろん)", english: "conclusion" },
    { japanese: "字数制限 (じすうせいげん)", english: "word/character limit" },
    { japanese: "キーワード", english: "keywords" },
    { japanese: "簡潔 (かんけつ)", english: "concise" }
  ],
  examples: [
    { japanese: "本稿は、ベトナム人日本語学習者の語用論的能力に関する実証研究である。", english: "This paper is an empirical study concerning the pragmatic competence of Vietnamese learners of Japanese." },
    { japanese: "六十名の学習者を対象とし、ロールプレイ課題により対話データを収集した。", english: "Targeting sixty learners, dialogue data was collected through a role-play task." },
    { japanese: "分析の結果、対話量と語用論的選択の妥当性との間に正の相関が確認された。", english: "As a result of analysis, a positive correlation between interaction volume and the validity of pragmatic choices was confirmed." },
    { japanese: "本知見は、日本語教育における対話機会の確保の重要性を示唆するものである。", english: "These findings suggest the importance of securing opportunities for interaction in Japanese language education." },
    { japanese: "本研究の限界として、サンプルが特定の地域に偏っていることが挙げられる。", english: "As a limitation of this study, the sample being biased toward a specific region can be mentioned." },
    { japanese: "キーワード:語用論、日本語学習者、ロールプレイ、対話量", english: "Keywords: pragmatics, Japanese learners, role-play, interaction volume" }
  ],
  dialogue: [
    { speaker: "院生", japanese: "抄録の字数制限が四百字でございますが、現状で六百字に達しております。", english: "The character limit for the abstract is four hundred, but I have currently reached six hundred." },
    { speaker: "指導教員", japanese: "削るべきは背景の記述です。本研究の目的・方法・結果・結論の四要素に絞ってください。", english: "What should be cut is the background description. Restrict yourself to the four elements: purpose, method, results, and conclusion of this study." },
    { speaker: "院生", japanese: "背景を一文に圧縮し、各要素を百字程度に収める方針でよろしいでしょうか。", english: "Would the policy of compressing the background into one sentence and fitting each element into around one hundred characters be acceptable?" },
    { speaker: "指導教員", japanese: "結構です。抄録は本文の地図ですから、無駄を削ぎ落とすほど読まれます。", english: "Very well. An abstract is a map of the body, so the more waste you trim, the more it gets read." }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "抄録の構成について、ご指導いただけますでしょうか。何度書き直しても焦点が定まらず、難渋しております。", english: "Could you guide me on the composition of the abstract? No matter how many times I rewrite it, the focus does not settle, and I am struggling." },
    { speaker: "指導教員", japanese: "現在の草稿を、声に出して読んでみてください。どこで読者が迷子になるかが分かります。", english: "Try reading your current draft aloud. You will see where the reader gets lost." },
    { speaker: "院生", japanese: "「本研究は、ベトナムにおける日本語教育の現状を踏まえ、学習者の語用論的能力の発達過程を探索的に検討するものであり…」", english: "'This study, taking into account the current state of Japanese language education in Vietnam, exploratorily examines the developmental process of learners' pragmatic competence...'" },
    { speaker: "指導教員", japanese: "そこです。第一文で「踏まえ」が要りません。読者は背景を聞きに来ているのではなく、何を明らかにしたかを知りたいのです。", english: "There it is. In the first sentence, 'taking into account' is unnecessary. The reader has not come to hear the background but wants to know what you clarified." },
    { speaker: "院生", japanese: "つまり、第一文は本研究の目的そのものを述べるべき、ということでございますね。", english: "In other words, the first sentence should state the purpose of the study itself." },
    { speaker: "指導教員", japanese: "そのとおりです。「本研究は〜を明らかにすることを目的とする」が定型です。背景は第二文に短く回せます。", english: "Exactly. 'This study aims to clarify〜' is the standard form. The background can be shifted briefly to the second sentence." },
    { speaker: "院生", japanese: "なるほど。続いて方法・結果・結論を、それぞれ二、三文ずつでまとめる、という構成でよろしいでしょうか。", english: "I see. Then would the composition of summarizing method, results, and conclusion in two or three sentences each be acceptable?" },
    { speaker: "指導教員", japanese: "結構です。重要なのは、結果を抽象的にぼかさず、数値や主要な発見を具体的に示すことです。「有意な差が認められた」だけでは弱い。", english: "Very well. What is important is not blurring the results in the abstract but showing numerical values and main findings concretely. Just 'a significant difference was recognized' is weak." },
    { speaker: "院生", japanese: "「対話量と語用論的妥当性との間に r=〇.六二の正の相関が確認された」のような具体性が必要、ということでございますね。", english: "So concreteness like 'a positive correlation of r=0.62 between interaction volume and pragmatic validity was confirmed' is necessary." },
    { speaker: "指導教員", japanese: "そのとおりです。読者は抄録のみで論文の核心を判断します。具体的な発見が抄録にあるか否かが、本文を読まれるか否かを左右します。", english: "Exactly. Readers judge the core of the paper from the abstract alone. Whether or not concrete findings are in the abstract determines whether or not the body gets read." },
    { speaker: "院生", japanese: "結論部については、いかがでしょうか。", english: "What about the conclusion section?" },
    { speaker: "指導教員", japanese: "結論は、結果が何を意味するかを一文で述べ、限界を一文添えてください。新しい主張を導入してはいけません。", english: "For the conclusion, state in one sentence what the result means, and add one sentence on limitations. You must not introduce new claims." },
    { speaker: "院生", japanese: "肝に銘じます。本日中に書き直し、明日再度ご確認をお願いできればと存じます。", english: "I take that to heart. I will rewrite it by today and would appreciate confirmation again tomorrow." },
    { speaker: "指導教員", japanese: "結構です。声に出して、読者になったつもりで読み返すことを忘れずに。", english: "Very well. Don't forget to read it aloud as if becoming the reader." }
  ],
  roleplay_prompts: [
    "Bạn viết abstract 400-字 limit. Cấu trúc 5 câu: (1) purpose, (2) brief background, (3) method với specifics, (4) result với numbers, (5) conclusion + limitation. KHÔNG mở bằng background — Nhật academic abstract opens với purpose.",
    "Reviewer chỉ ra abstract của bạn quá vague: '結果の記述が抽象的'. Đáp lại bằng concrete numbers / findings, không general claims. Cụm: 〜の関係に r=〇.六二 の正の相関が確認された thay cho 'significant correlation observed'.",
    "Bạn viết tổng kết kết luận. Cụm 本知見は〜を示唆するものである cho impact, sau đó 本研究の限界として〜が挙げられる. KHÔNG introduce new claims trong summary — chỉ recap + limit + future."
  ],
  register_notes: "Abstract writing ở C1 Japanese tuân theo cấu trúc IMRaC (Introduction-Methods-Results-Conclusion) compressed. (1) WORD-LIMIT TIERS — Nhật academic abstracts: 国際学会 200-300 từ tiếng Anh, 国内学会 300-600 字 tiếng Nhật, journal articles 400-800 字. Strict — over-limit auto-reject. (2) FIVE-SENTENCE TEMPLATE — câu 1: purpose ('本研究は〜を明らかにすることを目的とする'); câu 2: background ('〜については先行研究で〜が指摘されているが、〜については検討されていない'); câu 3-4: method + results với specifics ('〜名を対象とし〜を行い、〜が確認された'); câu 5: implication + limit ('本知見は〜を示唆するが、〜の制約がある'). Strict 5-sentence makes abstract scannable. (3) TENSE — methods và results past tense (〜した、〜が確認された); conclusion present (〜を示唆する); purpose can be either (〜を目的とする / 〜を目的とした). Consistency within each function. (4) AVOID — citations (abstract tự đứng độc lập), undefined acronyms (define hoặc skip), figures/tables (text only), forward references ('see Section 3' cấm). (5) KEYWORDS — 3-5 chuẩn, ordered từ specific (concept của bạn) đến general (field). Keywords là search-engine targeting; chọn carefully. (6) ABSTRACT VS SUMMARY VS OVERVIEW — 抄録 = formal abstract (front of paper). 要旨 = summary (often longer, presentation/proposal context). 概要 = overview (less structured, intro material). C1 phải distinguish. Common mistakes: opening với background (Western style sometimes does this; Nhật convention opens với purpose), vague results ('有意な結果が得られた' không đủ — need numbers), introducing new ideas in conclusion. Avoid: 思う (too soft), 〜と感じる (subjective). Use 〜と考えられる, 〜が示唆される.",
  idiom_glosses: [
    { idiom: "簡にして要を得る (かんにしてようをえる)", literal: "Đơn giản nhưng nắm được điểm chính", meaning: "[硬い・書き言葉] Concise yet capturing essence — virtue tối cao trong abstract writing.", example: "優れた抄録とは、簡にして要を得るものであり、読者を本文へと自然に導く。" },
    { idiom: "言を尽くす (げんをつくす)", literal: "Dùng hết lời", meaning: "[書き言葉] Diễn đạt đầy đủ — anti-ideal cho abstract; warning against verbosity.", example: "抄録において言を尽くそうとすれば、かえって焦点が定まらない。" },
    { idiom: "肝心要 (かんじんかなめ)", literal: "Gan + tim + then chốt — phần thiết yếu nhất", meaning: "[書き言葉・話し言葉] Core essential — abstract phải capture 肝心要 của paper.", example: "抄録には、本研究の肝心要のみを抽出して記すべきである。" },
    { idiom: "読者の地図となる (どくしゃのちずとなる)", literal: "Trở thành bản đồ cho người đọc", meaning: "[書き言葉] Set phrase metaphor — abstract = map của paper, guide reader's navigation.", example: "良い抄録は、読者の地図となり、本文のいかなる節を読むべきかを示唆する。" }
  ],
  cultural_notes_vi: "Abstract conventions ở Nhật academic khác phương Tây ở 4 điểm. (1) PURPOSE FIRST, NOT BACKGROUND — Western abstracts (đặc biệt humanities) often mở bằng broad context; Nhật mở thẳng với research purpose ở câu 1. Trong tiếng Nhật, default reader assumed to know background; trong tiếng Anh international, có thể cần thêm 1 sentence context. Adjust theo target venue. (2) HUMBLE TONE EVEN IN ABSTRACT — Nhật abstract retain academic humility: 〜と考えられる > 〜である for interpretation; 〜の可能性が示唆される > 〜が証明された. Western abstract có thể bolder; Nhật reviewer có thể bị đẩy lùi bởi over-confident abstract. (3) NUMBERS DENSITY — Nhật C1 abstracts (especially STEM) dày đặc với specifics: sample sizes, effect sizes, p-values, percentages. Vague abstracts đọc weak. Humanities có thể less numerical nhưng vẫn cần concrete categories thay vì general claims. (4) BILINGUAL ABSTRACTS — nhiều Nhật journals require 和文抄録 (Japanese abstract) cộng English abstract. KHÔNG dịch direct — adjust mỗi version cho audience. English abstract có thể cần thêm context (international readers don't know Japan-specific terms); Japanese version assume more shared context. Khác VN: VN abstract conventions variable theo journal; nhiều VN journals chấp nhận longer narrative abstracts. Nhật C1 strictly structured. Adjust khi submit qua biên giới. Mẹo: collect 10 abstracts từ target journal, study structure. Mỗi journal có conventions riêng (some allow first-person, some don't; some require explicit headings 'Purpose:', 'Method:'). Match exactly. Mẹo: keywords trong tiếng Nhật KHÔNG được dùng spaces giữa terms — comma-separated với readings (kanji compounds typically). Mẹo cuối: nếu paper bị desk-reject từ abstract, KHÔNG giải thích hay protest — abstract is paper's elevator pitch; nếu fails, paper fails. Rewrite, resubmit elsewhere với better abstract.",
  tip_advice_vi: "Workflow viết abstract C1 hiệu quả. (a) WRITE LAST — KHÔNG viết abstract trước paper. Write paper completely, sau đó distill. Pre-written abstracts thường drift away from final paper content. (b) REVERSE OUTLINE — sau hoàn thiện paper, viết 1-sentence summary mỗi section. Combine those sentences = first abstract draft. Often coherent enough cần ít revision. (c) MEASURE COMPRESSION RATIO — paper 8000 字 → abstract 400 字 = 5 phần trăm compression. Anything ratio under 3 phần trăm → abstract underwritten; over 8 phần trăm → paper undertight or abstract wordy. Sweet spot 4-6 phần trăm. (d) TRIM IN PASSES — pass 1: cut every 'などの', 'において', 'について' that doesn't change meaning. Pass 2: replace verbose forms với compressed (〜することができる → 〜できる). Pass 3: combine related sentences với 〜し、〜. Each pass typically saves 10-15 phần trăm. (e) TEST SCANNABILITY — show abstract to colleague không trong field. Hỏi: trong 30 giây, bạn nắm được purpose, method, finding chính? Nếu không, abstract still vague. Mẹo về số lượng — nếu paper có nhiều findings, list 2 chính trong abstract, mention 'その他の知見については本文を参照されたい'. Không cần dump tất cả. Mẹo về limitations — 1 limitation câu trong abstract acceptable; 3+ limitations nghe defensive. Hold rest cho discussion. Mẹo về keywords — dùng terms reviewer sẽ search. Nếu field có jargon Anh-Nhật parallel (e.g., プラグマティクス vs 語用論), include both. Maximize discoverability. Mẹo về 和文 vs English abstracts — write Japanese first nếu primary audience là Japanese; English first nếu primary là international. Direct translation often awkward; rewrite với target audience in mind. Mẹo cuối: revise abstract ít nhất 5 lần. Abstract chính là phần được đọc most và judge most. Time investment 5x rate-per-word so với body justified.",
  exercises: [
    { type: "fill-blank", question: "本知見は、日本語教育における対話機会の確保の重要性を___するものである。", answer: "示唆" },
    { type: "matching", instruction: "Ghép cụm với chức năng abstract.", pairs: [
      { japanese: "本研究は〜を明らかにすることを目的とする", english: "purpose statement — abstract sentence 1" },
      { japanese: "〜を対象とし、〜を行った", english: "method statement — abstract sentence 3" },
      { japanese: "〜が確認された", english: "result statement — past tense, concrete" },
      { japanese: "本研究の限界として〜が挙げられる", english: "limitation note — abstract sentence 5" }
    ] },
    { type: "translation", vietnamese: "Là giới hạn của nghiên cứu này, có thể nêu ra việc mẫu thiên về một khu vực cụ thể.", japanese: "本研究の限界として、サンプルが特定の地域に偏っていることが挙げられる。" }
  ]
},
{
  id: 101,
  title: "Academic discourse — peer review feedback",
  title_vi: "Diễn ngôn học thuật — Phản hồi peer review",
  title_en: "Academic discourse — peer review feedback",
  category: "academic-discourse",
  level: "C1",
  vocabulary: [
    { japanese: "査読 (さどく)", english: "peer review" },
    { japanese: "査読者 (さどくしゃ)", english: "peer reviewer" },
    { japanese: "コメント", english: "comment" },
    { japanese: "修正 (しゅうせい)", english: "revision" },
    { japanese: "対応 (たいおう)", english: "response / handling" },
    { japanese: "再投稿 (さいとうこう)", english: "resubmission" },
    { japanese: "採択 (さいたく)", english: "acceptance" },
    { japanese: "不採択 (ふさいたく)", english: "rejection" },
    { japanese: "条件付き採択 (じょうけんつきさいたく)", english: "conditional acceptance" },
    { japanese: "応答書 (おうとうしょ)", english: "response letter" }
  ],
  examples: [
    { japanese: "査読者各位のご指摘に深く感謝申し上げます。", english: "I deeply appreciate the indications of each reviewer." },
    { japanese: "ご指摘の点につきましては、本文〇ページにて修正いたしました。", english: "Regarding the point you indicated, I have revised it on page X of the body." },
    { japanese: "ご懸念の点について、以下のとおり対応いたしましたので、ご確認いただけますと幸いです。", english: "Regarding the point of concern, I have handled it as follows; I would be grateful if you could confirm." },
    { japanese: "ご指摘は誠にもっともでございますが、紙幅の都合により、本稿では取り扱いを限定いたしました。", english: "The indication is entirely reasonable, but due to space constraints, this paper has limited the treatment." },
    { japanese: "本論点については、改稿時に新たに節を設けて対応いたしました。", english: "Regarding this issue, in the revision I have set up a new section to address it." },
    { japanese: "貴重なお時間を賜り、ご査読いただきましたこと、重ねて御礼申し上げます。", english: "I extend my gratitude once again for receiving your valuable time and your peer review." }
  ],
  dialogue: [
    { speaker: "著者", japanese: "査読結果を拝見いたしました。条件付き採択とのことで、応答書の作成に取り掛かっております。", english: "I have reviewed the peer review result. As it is conditional acceptance, I am beginning preparation of the response letter." },
    { speaker: "共著者", japanese: "査読者AとBで指摘が一部対立していますが、どう対応しましょうか。", english: "Reviewers A and B have partially conflicting indications — how shall we handle that?" },
    { speaker: "著者", japanese: "対立点については、両者の指摘を併記したうえで、本稿の立場を改めて説明する方針でよろしいかと存じます。", english: "Regarding points of conflict, I think the policy of presenting both indications side by side and then re-explaining this paper's position would be acceptable." },
    { speaker: "共著者", japanese: "それが穏当かと存じます。応答書の草稿、私のほうでも目を通します。", english: "That seems sound. I will also look over the draft of the response letter." }
  ],
  dialogue_long: [
    { speaker: "著者", japanese: "査読コメントが二名分、計十七点ございます。応答書をどう構成すべきか、ご相談させていただけますでしょうか。", english: "There are review comments from two reviewers, seventeen points in total. May I consult on how to structure the response letter?" },
    { speaker: "指導教員", japanese: "まず、コメントを四区分に整理してください。受け入れて修正、部分的に受け入れ、留保つきで応答、お断り。", english: "First, organize the comments into four categories: accepted and revised, partially accepted, responded to with reservation, and declined." },
    { speaker: "著者", japanese: "受け入れが十二点、部分的が三点、留保つきが一点、お断りが一点でございます。", english: "Twelve are accepted, three partial, one with reservation, one declined." },
    { speaker: "指導教員", japanese: "お断りの一点、内容を伺ってもよろしいでしょうか。", english: "May I hear the content of the one decline?" },
    { speaker: "著者", japanese: "査読者Aより、「分析対象を中級学習者にも拡張すべき」とのご指摘ですが、本研究は上級学習者の特性に焦点を絞っており、拡張は本稿の射程外でございます。", english: "Reviewer A indicated 'the analysis target should be extended to intermediate learners as well,' but this study focuses on the characteristics of advanced learners, and extension falls outside the scope of this paper." },
    { speaker: "指導教員", japanese: "妥当な判断です。応答書では、お断りの理由を丁寧に説明し、今後の課題として残す旨を明記してください。", english: "A reasonable judgment. In the response letter, carefully explain the reason for declining, and make clear that you leave it as a future task." },
    { speaker: "著者", japanese: "承知いたしました。文面の例といたしましては、「ご指摘の通り、中級学習者を含めることにより知見の射程は広がりますが、本研究では上級学習者の特性を深く掘り下げることを優先いたしました。中級学習者への拡張は、今後の研究課題として承りたく存じます」のような形でいかがでしょうか。", english: "Understood. As an example of the wording: 'As you indicate, including intermediate learners would broaden the scope of findings, but in this study, deeply delving into the characteristics of advanced learners was prioritized. Extension to intermediate learners, I would receive as a future research task' — would something like this be acceptable?" },
    { speaker: "指導教員", japanese: "結構です。お断りの場合でも、必ず査読者の指摘の妥当性を認め、感謝を表する。これが応答書の鉄則です。", english: "Very well. Even when declining, always acknowledge the validity of the reviewer's indication and express gratitude. This is the iron rule of the response letter." },
    { speaker: "著者", japanese: "肝に銘じます。受け入れた点については、修正後の本文ページ数も併記すべきでしょうか。", english: "I take that to heart. For accepted points, should I also note the body page numbers after revision?" },
    { speaker: "指導教員", japanese: "もちろんです。査読者は、自分の指摘がどう反映されたか、本文と応答書を往復して確認します。ページ番号があれば、その手間が省け、印象が良くなります。", english: "Of course. Reviewers go back and forth between body and response letter to confirm how their indication was reflected. With page numbers, that effort is saved, and the impression improves." },
    { speaker: "著者", japanese: "なるほど。応答書は単なる説明ではなく、査読者への配慮の表現でもあるわけですね。", english: "I see. So the response letter is not merely an explanation but also an expression of consideration for the reviewers." },
    { speaker: "指導教員", japanese: "そのとおりです。応答書の質が、再査読の結果を左右することも少なくありません。", english: "Exactly so. It is not uncommon for the quality of the response letter to influence the result of the re-review." },
    { speaker: "著者", japanese: "心して取り組みます。草稿が出来ましたら、再度ご確認をお願いいたします。", english: "I will work on it in earnest. When the draft is ready, I will request your confirmation again." }
  ],
  roleplay_prompts: [
    "Bạn nhận conditional acceptance với 10 reviewer comments. Mở response letter bằng 査読者各位のご指摘に深く感謝申し上げます. Sau đó list mỗi point: comment summary → response → page number của revision. KHÔNG defensive — accept hoặc explain gracefully.",
    "Bạn cần decline 1 reviewer suggestion (out of scope). Cụm: ご指摘の通り、〜により知見の射程は広がりますが、本研究では〜を優先いたしました。〜への拡張は、今後の研究課題として承りたく存じます. Acknowledge merit + explain priority + defer.",
    "Reviewer A và B mâu thuẫn nhau. Phrase: 査読者A様のご指摘とB様のご指摘とは部分的に対立しておりますが、本稿としては〜の立場を取らせていただきたく存じます. KHÔNG side với một reviewer aggressively — explain choice với balance."
  ],
  register_notes: "Peer review response letter ở C1 Japanese tuân theo strict format. (1) STRUCTURE — opening: thank reviewers ('査読者各位のご指摘に深く感謝申し上げます'); body: numbered response cho each comment; closing: 重ねて御礼申し上げます. (2) PER-COMMENT FORMAT — '査読者A様、ご指摘1: [paraphrase comment]. ご対応: [explain change], 修正箇所: 本文〇ページ〇行目'. Numbered, paraphrased (shows you understood), explicit page reference. (3) FOUR RESPONSE CATEGORIES — accept and revise (most common, simplest): 'ご指摘を踏まえ、〜のとおり修正いたしました'. Partial accept: 'ご指摘を踏まえ、〜の点については修正いたしましたが、〜については〜の理由により従来通りといたしました'. Reservation: 'ご指摘の点、誠にもっともながら、〜の制約により本稿では〜にとどめざるを得ませんでした'. Decline: ALWAYS acknowledge merit first, then explain why declined, then offer future-work framing. KHÔNG flat 'no'. (4) HONORIFICS — toward reviewer: 査読者A様 (formal), ご指摘 (honorific), ご教示 (humble request). Toward yourself/paper: 本稿, 当方, いたしました (humble). Maintain throughout — slipping into casual mid-letter signals carelessness. (5) CONFLICT HANDLING — when reviewers disagree, NEVER take sides ('A is right, B is wrong'). Cụm: '査読者A様とB様のご指摘は部分的に対立しておりますが、本稿としては〜の立場を取らせていただきたく存じます。これは、〜という理由によるものでございます'. Show bạn weighed both. (6) EDITOR-VS-REVIEWER — response letter addressed to editor, but content responds to reviewers. Editor reads first, decides re-review. Pro tip: short cover note to editor summarizing major changes, separate from detailed point-by-point. Forbidden vocabulary: わかりません, それは違います, 不要です. Required cushioning: 誠にもっともながら, ご指摘を踏まえ, 重ねて御礼申し上げます. Tone calibration: even when reviewer is wrong (rare but happens — factual error), respond gentle: 'ご指摘の点について改めて確認いたしましたところ、〇〇に関する記述は本文〇ページに既に明記しておりました' (rather than 'you missed page X'). Save face for reviewer.",
  idiom_glosses: [
    { idiom: "鉄は熱いうちに打て (てつはあついうちにうて)", literal: "Đập sắt khi còn nóng", meaning: "[書き言葉・話し言葉] Strike while iron hot — submit response letter trong window editor expects, không delay momentum.", example: "査読結果を受領した後は、鉄は熱いうちに打てと申しますし、速やかに応答書の作成に取り掛かるべきでございます。" },
    { idiom: "謙虚に受け止める (けんきょにうけとめる)", literal: "Tiếp nhận một cách khiêm tốn", meaning: "[書き言葉] Accept feedback humbly — set phrase showing reviewer's comments accepted constructively.", example: "査読者各位のご指摘を謙虚に受け止め、改稿に反映いたしました。" },
    { idiom: "慎重を期す (しんちょうをきす)", literal: "Cố gắng cẩn trọng", meaning: "[書き言葉] Take utmost care — phù hợp khi explaining bạn revised carefully theo comment.", example: "本箇所については、ご指摘を踏まえ、慎重を期して再検討いたしました。" },
    { idiom: "再考の上、〜とした (さいこうのうえ、〜とした)", literal: "Sau khi xem xét lại, làm〜", meaning: "[硬い・書き言葉] After reconsideration, did X — formal phrase signaling thoughtful revision, not knee-jerk.", example: "ご指摘を踏まえ、再考の上、本節の構成を全面的に見直すこととした。" }
  ],
  cultural_notes_vi: "Peer review culture ở Nhật academia khác phương Tây ở 4 điểm. (1) GRATITUDE NORM — Nhật response letter không thể skip thanks. Mở thanks, đóng thanks, scattered thanks throughout cho specific suggestions. Western response letters đôi khi terse và transactional; Nhật reads as cold without thanks. Không phải sycophantic — đó là baseline civility. (2) DECLINE-ALWAYS-WITH-CARE — flat decline ('we disagree') hiếm khi acceptable. Even nếu reviewer's suggestion impossible, frame: acknowledge → explain constraint → defer to future work. Reviewer nhớ cách bạn declined; ungraceful decline reflects long-term. (3) REVIEWER ANONYMITY OFTEN BREACHED INFORMALLY — Nhật academic field nhỏ, tight network. Reviewers thường identifiable từ writing style, comment specifics. Treat response giả định reviewer sẽ biết identity của bạn (and you của họ) post-publication. Long-term relationship management. (4) RE-REVIEW EXPECTATIONS — sau revision, same reviewers thường được asked re-review. Nếu response letter aggressive hoặc dismissive, second-round verdict often harsher. Quality của response letter often determines accept/reject as much as quality of revisions. Khác VN: VN academic peer review culture variable; some journals casual. Nhật C1 journals strict format expectations. Khi submit qua biên giới, học specific journal conventions. Mẹo: collect 3-5 published response letters (some journals publish them) trong target journal, study tone. Mẹo về timing — Nhật reviewers thường complete trong 4-8 tuần. Sau bạn nhận feedback, ideal turnaround 2-4 tuần cho revision. Longer = signal not taking seriously. Mẹo: nếu cần thêm time, request extension early với polite email tới editor. Mẹo cuối: appreciation post-acceptance — sau paper accepted, send brief thanks tới editor (reviewers anonymous nhưng thanks reaches them indirectly). Cụm: 採択のご通知、誠にありがとうございました。査読者各位、編集委員会の皆様に重ねて御礼申し上げます. Maintains relationship cho future submissions.",
  tip_advice_vi: "Peer review response workflow C1 Japanese. (a) READ ALL COMMENTS THRICE — first read: emotional reaction (let it pass, không respond ngay). Second read 24 hours later: classify mỗi comment (accept/partial/reservation/decline). Third read: identify specific revisions needed. KHÔNG draft response trong 24 hours đầu — emotional residue contaminates tone. (b) CREATE COMMENT TABLE — spreadsheet với columns: reviewer/number, comment paraphrase, your response category, specific revision (page/line), draft response text. Forces systematic handling. (c) REVISE PAPER FIRST, THEN WRITE LETTER — sequence matters. Revise body, sau đó letter references actual page numbers. Revising letter và body simultaneously creates inconsistencies. (d) FORMAT CHO READER — single-spaced response letter với clear hierarchy: Reviewer A heading > comment 1 > response > page reference. Bold reviewer comments, normal text response. Reviewer scans nhanh khi format clean. (e) ACCEPT MORE THAN BẠN INSTINCTIVELY WANT TO — first instinct often defensive: 'I already addressed that'. Second look thường shows reviewer nắm point bạn missed. Accept generously khi defensible — ratio 80 phần trăm accept : 20 phần trăm decline thường wise. (f) FOR DECLINES, OVER-EXPLAIN — accepted points cần ngắn ('修正済み, 本文5ページ参照'); declined points cần long explanation. Show bạn engaged seriously, không dismissed. Mẹo về scope — nếu reviewer asks expansion ('add intermediate learners'): graceful decline + future-work framing OK if scope clearly defined ahead. Nếu reviewer asks deeper analysis on existing scope: usually must accept. Mẹo về emotional management — store harsh comment 24-48 hours trước responding. Initial draft với 'unfortunately the reviewer misunderstands' bắt buộc phải đổi sang 'thank you for the comment, perhaps the original wording was unclear' trong final. Mẹo về co-authors — circulate response letter draft tới mọi co-authors trước submit. One co-author khilling final tone catches misjudged sentences. Mẹo cuối: lưu response letter mỗi paper. Pattern recognition (which comments recur, which language works best) builds skill across submissions. Sau 5-10 papers, response letter quality dramatically improves và becomes career asset.",
  exercises: [
    { type: "fill-blank", question: "ご指摘の点につきましては、本文〇ページにて___いたしました。", answer: "修正" },
    { type: "matching", instruction: "Ghép cụm với chức năng response letter.", pairs: [
      { japanese: "査読者各位のご指摘に深く感謝申し上げます", english: "opening — required gratitude" },
      { japanese: "ご指摘を踏まえ、〜のとおり修正いたしました", english: "accept-and-revise — most common pattern" },
      { japanese: "誠にもっともながら、紙幅の都合により〜にとどめざるを得ませんでした", english: "partial accept with reservation" },
      { japanese: "今後の研究課題として承りたく存じます", english: "graceful decline — defer to future work" }
    ] },
    { type: "translation", vietnamese: "Cám ơn quý vị đã dành thời gian quý báu để bình duyệt; xin được gửi lời cảm ơn một lần nữa.", japanese: "貴重なお時間を賜り、ご査読いただきましたこと、重ねて御礼申し上げます。" }
  ]
},
{
  id: 102,
  title: "Literary criticism — close reading of a passage",
  title_vi: "Phê bình văn học — Tinh đọc một đoạn văn",
  title_en: "Literary criticism — close reading of a passage",
  category: "literary-criticism",
  level: "C2",
  vocabulary: [
    { japanese: "精読 (せいどく)", english: "close reading" },
    { japanese: "文体 (ぶんたい)", english: "style / register" },
    { japanese: "修辞 (しゅうじ)", english: "rhetoric" },
    { japanese: "語彙選択 (ごいせんたく)", english: "lexical choice" },
    { japanese: "構文 (こうぶん)", english: "syntax" },
    { japanese: "反復 (はんぷく)", english: "repetition" },
    { japanese: "韻律 (いんりつ)", english: "prosody" },
    { japanese: "句読法 (くとうほう)", english: "punctuation usage" },
    { japanese: "余白 (よはく)", english: "blank / unsaid space" },
    { japanese: "含意 (がんい)", english: "implication / connotation" }
  ],
  examples: [
    { japanese: "精読においては、一字一句の選択がいかなる効果を生むかを精査することが肝要である。", english: "In close reading, scrutinizing what effect the choice of each word and phrase produces is essential." },
    { japanese: "漱石の文体は、漢文訓読体の硬質さと口語の柔らかさとを巧みに織り交ぜていると言えよう。", english: "Sōseki's style, it can be said, skillfully interweaves the hardness of kanbun-kundoku register with the softness of colloquial speech." },
    { japanese: "川端の散文は、語の経済性と余白の力学とによって成り立っている。", english: "Kawabata's prose is built upon the economy of words and the dynamics of blank space." },
    { japanese: "谷崎の長文は、その息の長さそのものが、官能的時間の表象たり得るのである。", english: "Tanizaki's long sentences — the very length of their breath itself can serve as a figuration of sensual time." },
    { japanese: "蓮實重彦の表層批評は、深層に沈潜することなく、テクストの表面に現れる細部に徹底的に立ち止まることを要請する。", english: "Hasumi Shigehiko's surface criticism demands that one not sink into depths but rather dwell exhaustively on the details that surface on the text." },
    { japanese: "句読点ひとつの位置によって、語り手の呼吸も、読者の呼吸も変わるのである。", english: "By the position of a single punctuation mark, both the narrator's breathing and the reader's breathing change." }
  ],
  dialogue: [
    { speaker: "院生", japanese: "本日は、川端「雪国」冒頭の精読を試みたく存じます。", english: "Today I would like to attempt a close reading of the opening of Kawabata's 'Snow Country.'" },
    { speaker: "指導教員", japanese: "あの一文ですね。「国境」「トンネル」「雪国」、三つの名詞の並びだけで、空間が転換する。", english: "That one sentence. With just the arrangement of the three nouns — 'border,' 'tunnel,' 'snow country' — space itself transforms." },
    { speaker: "院生", japanese: "助詞の選択にも、留意すべき点が多々ございます。「と」「であった」、いずれも淡々とした文字面が、かえって衝撃を増幅させております。", english: "There are many points to attend to in the choice of particles as well. 'When' and 'was' — the very plainness of the surface intensifies, paradoxically, the impact." },
    { speaker: "指導教員", japanese: "その「淡々」を支えているのが過去形の選択でしょう。現在形なら速度が消えてしまう。", english: "What sustains that 'plainness,' I would say, is the choice of past tense. With present tense, the velocity would vanish." }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "精読の方法について、ご教示いただきたく存じます。何から手をつければよろしいか、いまだ手探りの状態でございまして。", english: "I would like to receive instruction on the method of close reading. As to where to begin, I remain in a state of groping." },
    { speaker: "指導教員", japanese: "まず、テクストを声に出して読みなさい。黙読では捉えきれぬ韻律が、音読によって初めて立ち現れます。", english: "First, read the text aloud. The prosody that silent reading cannot apprehend appears for the first time only through vocal reading." },
    { speaker: "院生", japanese: "音読の後、いかなる観点から分析に入るべきでしょうか。", english: "After reading aloud, from what standpoint should one enter into analysis?" },
    { speaker: "指導教員", japanese: "四層に分けて考えるとよい。語彙、構文、修辞、句読法。それぞれに作家固有の「癖」があり、その癖こそが文体を成す。", english: "Think in four layers: lexis, syntax, rhetoric, punctuation. Each has a writer-specific 'habit,' and that very habit is what constitutes style." },
    { speaker: "院生", japanese: "たとえば、漱石と鴎外を比較する際、いずれの層に着目するのが有効でしょうか。", english: "For instance, when comparing Sōseki and Ōgai, on which layer is it effective to focus?" },
    { speaker: "指導教員", japanese: "両者の差は、構文の長短よりも、漢語と和語の配合比に最も鮮明に現れます。鴎外は漢語を骨格とし、漱石は漢語と和語の振幅を意図的に揺らす。", english: "The difference between the two appears most vividly not in the length of syntax but in the proportion of mixing kango and wago. Ōgai takes kango as skeleton; Sōseki intentionally oscillates the amplitude between kango and wago." },
    { speaker: "院生", japanese: "なるほど。比較の軸が定まりました。次に、修辞の分析については、いかなる手順を踏むべきでしょうか。", english: "I see. The axis of comparison is fixed. Next, regarding the analysis of rhetoric, what procedure should one follow?" },
    { speaker: "指導教員", japanese: "比喩、反復、対比、倒置——これらを機械的に列挙するのではなく、その修辞が「なぜ、ここで、この形で」用いられたかを問いなさい。修辞は装飾ではなく、意味の生成装置です。", english: "Metaphor, repetition, contrast, inversion — do not enumerate these mechanically; ask 'why, here, in this form' the rhetoric is used. Rhetoric is not ornament but a device for the generation of meaning." },
    { speaker: "院生", japanese: "句読法について、もう少し詳しく伺ってもよろしいでしょうか。読点の位置など、軽視されがちかと存じます。", english: "May I hear in slightly more detail about punctuation? Things like the position of commas, I believe, tend to be slighted." },
    { speaker: "指導教員", japanese: "句読法は呼吸である、とまで申せましょう。志賀直哉の極端な短文と、円地文子の屈曲する長文とを比較すれば、句読の差が思想の差であることが見えてくる。", english: "One might even say that punctuation is breathing. If you compare Shiga Naoya's extreme short sentences with the meandering long sentences of Enchi Fumiko, you come to see that the difference in punctuation is the difference in thought." },
    { speaker: "院生", japanese: "余白についても、重要な観点と承りました。書かれていないことを読むとは、いかなる作業でしょうか。", english: "I have heard that blank space is also an important standpoint. What kind of work is it to read what is not written?" },
    { speaker: "指導教員", japanese: "省略された主語、語られなかった出来事、書き手が触れることを避けた領域——これらの「不在」が、テクストの輪郭を逆照射するのです。蓮實重彦の表層批評は、この不在の輪郭をなぞる作業に他ならない。", english: "Omitted subjects, events not narrated, domains the writer avoids touching — these 'absences' illuminate, by reverse projection, the contour of the text. Hasumi Shigehiko's surface criticism is nothing other than the work of tracing this contour of absence." },
    { speaker: "院生", japanese: "肝に銘じます。一篇の短編から始めて、四層と余白の観点で精読を試みてまいります。", english: "I take that to heart. I will begin with one short story and attempt close reading from the standpoints of the four layers and blank space." },
    { speaker: "指導教員", japanese: "結構です。最初は時間を要しますが、習熟すれば、テクストが自ずと語り出すようになります。", english: "Very well. At first it requires time, but once you become accustomed, the text comes to speak of itself." }
  ],
  roleplay_prompts: [
    "Bạn close-read 5 dòng đầu của một short story. Phương pháp: (1) đọc to, (2) phân lớp 4 tầng (語彙/構文/修辞/句読法), (3) hỏi 'tại sao tác giả chọn từ này, không phải từ đồng nghĩa?'. KHÔNG enumerate devices mechanically — luôn hỏi 'effect là gì?'.",
    "Bạn so sánh prose của 漱石 và 鴎外. Trục so sánh: 漢語/和語 ratio, 構文 length, 句読 density. Cụm: 両者の差は、〜よりも、〜に最も鮮明に現れる. KHÔNG generic 'A is heavier than B' — chỉ ra layer cụ thể.",
    "Bạn defend reading được based on absent text (省略された主語). Cụm: 〜の不在こそが、テクストの輪郭を逆照射している. KHÔNG over-claim — frame như one possible reading shaped by absence, dùng 〜と読み得よう."
  ],
  register_notes: "C2 literary criticism Japanese yêu cầu shift sang 評論文体 (critical-essay register), khác hoàn toàn với C1 academic prose. Năm đặc trưng cốt lõi. (1) 文語的余韻 — sentence endings 〜と言えよう (it may be said), 〜と考えられよう (may be thought), 〜と断ぜざるを得まい (one cannot but conclude). 'よう/まい' modal endings là dấu hiệu critical register; thay cho C1's neutral 〜と考えられる. (2) 漢文訓読体 echoes — 〜たり (be), 〜なり (is), 〜べし (should), 〜ざるを得ない (cannot but), 〜にほかならない (is nothing other than). Không cần dùng dày đặc nhưng selective deployment elevates register. (3) 雅文体 lexis — chọn 〜性 nominalizations với literary weight: 含意性, 反復性, 文体性, 表象性. Tránh transliterated katakana terms khi có Japanese equivalent (情景描写 thay vì シーン description). (4) 一字一句 LEVEL ATTENTION — claims phải reference specific textual features: '〜という助詞の選択が', '〜の句読点の位置が'. Vague impressionistic claims đọc amateur. (5) CRITICAL TRADITION CITATION — invoke Japanese critics: 蓮實重彦 (surface criticism), 柄谷行人 (transcendental critique), 加藤周一 (cultural history), 江藤淳 (cultural conservative), 吉本隆明 (poetics + politics). Western theory citations OK nhưng pair với Japanese reception (e.g., バルト → 蓮實's reception). KHÔNG fabricate quotes. Discourse markers cho close reading: 〜に着目すれば (focusing on〜), 〜を仔細に検すれば (examining〜in detail), 〜という細部が、〜を逆照射する (the detail of〜illuminates by reverse projection〜). Avoid: 〜と思います (subjective, low register), 美しい (beautiful — too vague), 素晴らしい (wonderful — fan-talk, not criticism). C2 critic doesn't praise; C2 critic analyzes effect. Cần nhớ: Japanese literary criticism tradition vẫn ảnh hưởng bởi 漢文 rhetoric, classical 古文 precedent, và post-war Western theory absorption. C2 register reflects all three layers.",
  idiom_glosses: [
    { idiom: "一字一句 (いちじいっく)", literal: "Một chữ, một câu", meaning: "[文語・書き言葉] Từng chữ từng câu — close reading principle: precision down to single character.", example: "精読とは、一字一句を疎かにせぬ読みの態度に他ならない。" },
    { idiom: "行間を読む (ぎょうかんをよむ)", literal: "Đọc giữa các dòng", meaning: "[書き言葉・話し言葉] Đọc ý ngầm — phù hợp khi phân tích 余白 / 含意 / unstated meaning.", example: "テクストの真意は字面ではなく、行間を読むことで初めて立ち現れる。" },
    { idiom: "文質彬彬 (ぶんしつひんぴん)", literal: "Văn vẻ và thực chất hài hòa", meaning: "[文語・硬い] 論語起源 — form và substance balanced; ideal phrase cho mature literary style.", example: "漱石の後期作品は、文質彬彬たる風格を帯びるに至っている。" },
    { idiom: "余韻嫋々 (よいんじょうじょう)", literal: "Dư âm vương vấn dài lâu", meaning: "[文語] Lingering reverberation — đặc thù literary effect khi prose ends mà ý vẫn vang vọng.", example: "川端の短編は、しばしば余韻嫋々として、読み終えた後の沈黙にこそ作品の核心が宿る。" }
  ],
  cultural_notes_vi: "Văn hóa close reading ở Nhật academia khác Anh-Mỹ ở 4 điểm. (1) NEW CRITICISM CHỈ LÀ MỘT NGUỒN — Western close reading (Brooks, Empson) là một influence; nhưng Japanese tradition cũng kế thừa 注釈学 (annotation scholarship) cho 古典 như 源氏物語. Combined heritage: Western new criticism + Japanese textual annotation. C2 critic biết cả hai. (2) SURFACE > DEPTH — 蓮實重彦 (Hasumi Shigehiko) institutionalized 表層批評 (surface criticism) trong Japanese academy: stay với what's visible on text, resist hermeneutic descent into 'deep meaning'. Influential against psychoanalytic / biographical reading. (3) 一字一句 PRECISION — Japanese language allows extraordinarily fine distinctions (〜は vs 〜が, 〜だ vs 〜である, kanji choice 寂しい vs 淋しい). Close reading exploits these distinctions — particle changes between drafts of 漱石 manuscripts là entire dissertations. C2 reader notices drafts, variants, manuscript choices. (4) CRITIC AS WRITER — Japanese tradition: top critics often themselves accomplished writers (三島 as 評論家, 谷崎 as 評論家, 江藤淳 as essayist). Critical prose itself is literary object. Reading critic's prose for its own style is part of training. Khác VN: VN literary criticism heavily influenced bởi French structuralism via Soviet-era translation pipeline; Japanese pipeline draws directly from German philology, French theory, American new criticism. Reference frames different. Mẹo: học các Japanese 評論家' opening paragraphs by heart — 蓮實's 'まず〜' openings, 柄谷's hypothetical conditionals. Style absorbs through imitation. Mẹo cuối: nếu bạn chỉ biết Western theory frames, Japanese senpai sẽ subtly mark you as outsider. Knowledge of 古典注釈学 lineage và post-war Japanese critic genealogy (吉本-江藤-柄谷-蓮實-...) signals membership.",
  tip_advice_vi: "Workflow close reading C2 Japanese cho luận văn / book review. (a) CHỌN PASSAGE NGẮN — 5-15 dòng max cho intensive close reading. Nếu passage dài hơn, bạn đang làm 構造分析 (structural analysis), không phải 精読. Distinguish purposes. (b) TYPE PASSAGE OUT BY HAND — physically retype text into your notes. Manual transcription forces attention to every character, every kana/kanji choice. Reveals patterns invisible khi just reading. (c) ANNOTATE 4 LAYERS — pass 1: 語彙 (lexis) — circle unusual word choices, mark kango/wago shifts. Pass 2: 構文 (syntax) — diagram clause structure, note inversions. Pass 3: 修辞 (rhetoric) — identify metaphor, metonymy, parallelism, anaphora. Pass 4: 句読法 (punctuation) — note unusual mark deployment. Each pass takes ~30 min cho 10 lines. (d) WRITE 'WHY' QUESTIONS — for each marked feature, write một question: 'tại sao tác giả chọn 寂しい thay vì 淋しい ở đây?'. Questions > assertions ở phase early. (e) SYNTHESIS — sau gathering features, identify pattern. Cụm: 〜という細部の集積が、〜という効果を生んでいる. Pattern claim must reference 3+ specific textual evidence points. Mẹo về citation — close reading paper cần dày critic citations: 蓮實 cho surface analysis, 柄谷 cho structural insight, 加藤 cho cultural-historical placement. Citation pattern signals which 学派 (school) bạn thuộc. Mẹo về quotes — when quoting passage, use 縦書き indented block ngoặc 「」 cho dialogue trong passage; reference page number của edition. ALWAYS cite specific edition (出版社, 年). 漱石 復刻版 và 全集版 có wording differences. Mẹo về length — close reading published essays thường 5,000-15,000 字. Shorter = surface impressionism. Longer thường loses focus. Sweet spot 8,000-12,000 字 cho one passage analysis. Mẹo cuối: read three close readings của same passage by different critics. Pattern of disagreement reveals what aspects của text are genuinely contested vs settled. Trains your own critical judgment.",
  exercises: [
    { type: "fill-blank", question: "精読においては、___一句の選択がいかなる効果を生むかを精査することが肝要である。", answer: "一字" },
    { type: "matching", instruction: "Ghép cụm với chức năng phê bình.", pairs: [
      { japanese: "〜と言えよう", english: "C2 critical register — hedged assertion" },
      { japanese: "〜にほかならない", english: "literary register — emphatic identification" },
      { japanese: "余白の力学", english: "analytic concept — dynamics of blank space" },
      { japanese: "表層批評", english: "Hasumi's surface-criticism approach" }
    ] },
    { type: "translation", vietnamese: "Văn của Tanizaki — chính độ dài của hơi văn cũng có thể trở thành biểu tượng của thời gian khoái cảm.", japanese: "谷崎の長文は、その息の長さそのものが、官能的時間の表象たり得るのである。" }
  ]
},
{
  id: 103,
  title: "Literary criticism — analyzing narrative voice and POV",
  title_vi: "Phê bình văn học — Phân tích giọng kể và điểm nhìn",
  title_en: "Literary criticism — analyzing narrative voice and POV",
  category: "literary-criticism",
  level: "C2",
  vocabulary: [
    { japanese: "語り手 (かたりて)", english: "narrator" },
    { japanese: "視点 (してん)", english: "point of view" },
    { japanese: "焦点化 (しょうてんか)", english: "focalization" },
    { japanese: "一人称 (いちにんしょう)", english: "first-person" },
    { japanese: "三人称 (さんにんしょう)", english: "third-person" },
    { japanese: "全知視点 (ぜんちしてん)", english: "omniscient POV" },
    { japanese: "限定視点 (げんていしてん)", english: "limited POV" },
    { japanese: "自由間接話法 (じゆうかんせつわほう)", english: "free indirect discourse" },
    { japanese: "信頼できない語り手 (しんらいできないかたりて)", english: "unreliable narrator" },
    { japanese: "内的独白 (ないてきどくはく)", english: "interior monologue" }
  ],
  examples: [
    { japanese: "「こゝろ」における三層構造の語りは、視点の重層化が真理の到達不能性そのものを表象している。", english: "The triple-layered narration in 'Kokoro' — the layering of viewpoints itself figures the very unreachability of truth." },
    { japanese: "芥川「藪の中」は、複数の一人称証言の齟齬を通じて、客観的真実の不可能性を主題化する。", english: "Akutagawa's 'In a Grove' thematizes, through the contradictions among multiple first-person testimonies, the impossibility of objective truth." },
    { japanese: "自由間接話法は、語り手と人物との境界を意図的に溶解させる手法であり、近代小説の根幹をなす。", english: "Free indirect discourse is a technique that intentionally dissolves the boundary between narrator and character, forming the foundation of the modern novel." },
    { japanese: "信頼できない語り手は、読者に語りの背後を読み解く能動的姿勢を要請する。", english: "The unreliable narrator demands of the reader an active stance of decoding what lies behind the narration." },
    { japanese: "大江健三郎の一人称は、私小説的伝統と西欧的告白体との接合点に位置する。", english: "Ōe Kenzaburō's first-person is positioned at the juncture of the I-novel tradition and Western confessional form." },
    { japanese: "焦点化の概念は、ジュネット以降の物語論において不可欠の分析装置となっている。", english: "The concept of focalization has become an indispensable analytical device in narratology since Genette." }
  ],
  dialogue: [
    { speaker: "院生", japanese: "「こゝろ」の三層構造について、論文を書いておりますが、視点の分析が定まりません。", english: "I am writing a paper on the triple-layer structure of 'Kokoro,' but my analysis of viewpoint will not settle." },
    { speaker: "指導教員", japanese: "三層を、誰が誰に語っているか、まずそこから整理しなさい。「私」が「先生」を語る上巻、「私」が「両親」を語る中巻、「先生」が「私」に書く下巻。", english: "First organize from there: who is narrating to whom in the three layers. Volume one, 'I' narrates Sensei; volume two, 'I' narrates the parents; volume three, Sensei writes to 'I.'" },
    { speaker: "院生", japanese: "下巻のみが手紙体——書かれたテクストとして読者に到達するわけですね。", english: "Only the third volume is in epistolary form — it reaches the reader as a written text." },
    { speaker: "指導教員", japanese: "そのとおり。語りの媒体の差異が、認識の不可能性を構造化している。これが「こゝろ」の核心です。", english: "Exactly. The difference in narrative medium structures the impossibility of cognition. This is the core of 'Kokoro.'" }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "本日は、自由間接話法について伺いたく存じます。日本近代文学における導入の経緯と、現代作家への影響について、整理が及んでおりません。", english: "Today I would like to ask about free indirect discourse. The circumstances of its introduction into modern Japanese literature, and its influence on contemporary writers — my organization has not reached there." },
    { speaker: "指導教員", japanese: "良い問いです。日本における自由間接話法の本格的展開は、二葉亭四迷の言文一致体実験以降、徐々に深化していきました。", english: "A good question. The full-scale development of free indirect discourse in Japan deepened gradually following Futabatei Shimei's experiments in genbun-itchi style." },
    { speaker: "院生", japanese: "とは申せ、漱石においては、なお地の文と人物の意識との境界が比較的明確であったように思われますが。", english: "That said, in Sōseki, the boundary between the ground text and the character's consciousness still seems to have been relatively clear." },
    { speaker: "指導教員", japanese: "鋭いご指摘です。漱石の三人称小説——「それから」「門」など——では、地の文と人物意識の往還は見られますが、完全な溶解には至っていない。完全な自由間接話法的散文は、戦後の安部公房や大江において結実すると申せましょう。", english: "An incisive observation. In Sōseki's third-person novels — 'And Then,' 'The Gate' and others — there is to-and-fro between ground text and character consciousness, but it does not reach complete dissolution. Fully free-indirect-discourse prose, one might say, comes to fruition in the postwar Abe Kōbō and Ōe." },
    { speaker: "院生", japanese: "現代作家においては、いかがでしょうか。村上春樹の一人称は、自由間接話法とどう関わるのでしょうか。", english: "What about in contemporary writers? How does Murakami Haruki's first-person relate to free indirect discourse?" },
    { speaker: "指導教員", japanese: "村上は基本的に一人称を用い、自由間接話法そのものは多用しません。しかし、第三者の意識への接近を、対話と独白の境界を曖昧にすることで実現している。手法としては別ですが、効果には類似性があります。", english: "Murakami fundamentally uses the first person and does not employ free indirect discourse itself frequently. However, he realizes approach to the consciousness of third parties by blurring the boundary between dialogue and monologue. The technique differs, but there is similarity in effect." },
    { speaker: "院生", japanese: "多和田葉子の二言語的実験との関連は、いかがでしょうか。", english: "What about the connection with Tawada Yōko's bilingual experiments?" },
    { speaker: "指導教員", japanese: "多和田は、語り手の言語そのものを揺るがす作家です。日本語とドイツ語の間隙に立つ語り手は、いずれの言語に対しても外部者的視点を取り得る。これは従来の物語論が想定する焦点化の枠を逸脱しています。", english: "Tawada is a writer who shakes the language of the narrator itself. A narrator standing in the interstice between Japanese and German can take an outsider's viewpoint with respect to either language. This deviates from the framework of focalization assumed by conventional narratology." },
    { speaker: "院生", japanese: "従来の物語論——ジュネットの枠組みでは、十分に分析しきれないということでしょうか。", english: "So conventional narratology — the Genette framework — cannot fully analyze this?" },
    { speaker: "指導教員", japanese: "そうとも申せましょう。ジュネット理論は単一言語内での視点を前提としており、二言語間の視点移動には別の概念装置が要請される。最近では、エミリー・アプターらの翻訳論的アプローチが、この空白を埋めつつあります。", english: "One might say so. Genette's theory presupposes viewpoint within a single language, and movement of viewpoint between two languages demands different conceptual apparatus. Recently, the translation-theoretic approaches of Emily Apter and others are filling this lacuna." },
    { speaker: "院生", japanese: "信頼できない語り手の概念についても、伺ってもよろしいでしょうか。日本文学における系譜を、整理しきれずにおります。", english: "May I also ask about the concept of the unreliable narrator? I have not been able to organize the genealogy in Japanese literature." },
    { speaker: "指導教員", japanese: "起源としては、芥川「藪の中」「羅生門」が嚆矢と申せましょう。複数証言の齟齬という形式が、語りの信頼性そのものを問題化します。戦後では、安部「砂の女」、大江初期作品、近年では村田沙耶香「コンビニ人間」の語り手も、別種の不信頼性を示しております。", english: "As an origin, one might say Akutagawa's 'In a Grove' and 'Rashōmon' were the harbingers. The form of contradicting multiple testimonies problematizes the very reliability of narration. In the postwar period, Abe's 'The Woman in the Dunes,' early Ōe; in recent years, the narrator of Murata Sayaka's 'Convenience Store Woman' also displays a different sort of unreliability." },
    { speaker: "院生", japanese: "幅広いご教示、誠にありがとうございました。系譜を踏まえて、論文の枠組みを再構築してまいります。", english: "Thank you most sincerely for the wide-ranging instruction. Taking the genealogy into account, I will reconstruct the framework of my paper." }
  ],
  roleplay_prompts: [
    "Bạn analyze narrative voice của một short story trong seminar. Phương pháp: identify (1) ngôi (一/三人称), (2) focalization (全知/限定), (3) reliability cues, (4) free-indirect markers (helping verb slips, tense shifts). Dùng cụm 〜の視点は〜に焦点化されている cho specific claims.",
    "Bạn defend reading rằng narrator của 'Kokoro' Sensei is unreliable. Cụm: 下巻の手紙体という形式自体が、語りの完結性に疑念を喚起する. KHÔNG generic 'unreliable narrator' — chỉ ra textual signals (gaps, contradictions, stylistic shifts).",
    "Bạn compare 漱石's 三人称 và 大江's 一人称. Trục: distance giữa narrator và character consciousness, deployment của free indirect discourse. Cụm: 両者は人物意識への接近の度合いにおいて根本的に異なる. Chỉ specific scenes, không generic claims."
  ],
  register_notes: "Narrative voice analysis ở C2 Japanese requires fluent deployment của 物語論 vocabulary từ Genette tradition cộng Japanese-specific concepts. Năm key tools. (1) GENETTE-DERIVED TERMS (now Japanese standard) — 語り手 (narrator), 視点 (POV), 焦点化 (focalization), 全知視点 / 限定視点 (omniscient/limited), 内的焦点化 / 外的焦点化 (internal/external focalization), 自由間接話法 (free indirect discourse). Used khắp Japanese narratology since 1980s. (2) JAPANESE-SPECIFIC CONCEPTS — 私小説 (I-novel) tradition shapes how 一人称 reads in Japanese context — semi-autobiographical assumption. Distinct từ Western confessional. 言文一致 (genbun-itchi) movement của Meiji creates the modern Japanese narrative voice; understand pre/post-genbun-itchi distinction. (3) RELIABILITY ANALYSIS LEXICON — 信頼できない語り手 (unreliable narrator, Booth-derived), nhưng Japanese tradition has older homegrown form: 「藪の中」型構造 (Rashōmon-effect — multiple contradictory testimonies). Both vocab necessary. (4) FREE INDIRECT DISCOURSE MARKERS IN JAPANESE — 〜であった as past-tense narrative; sudden shift to 〜だ (present) signals character consciousness intrusion; 〜のだ / 〜のである (explanatory) often marks narrator's moralizing voice; honorifics on character action descriptions can mark narrator's ironic distance. C2 critic identifies these markers fluently. (5) DISCOURSE MARKERS FOR ANALYSIS — 語りの位相 (the phase of narration), 視点の往還 (oscillation of viewpoint), 焦点化の重層性 (layering of focalization), 語り手の介入 (narratorial intervention), 地の文と人物意識の境界 (boundary between ground text and character consciousness). Vocabulary forbidden ở C2 narratology: 'narrator's voice' bare — too general; '視点' without specifying internal/external/omniscient — imprecise; 'unreliable' without specific textual evidence — assertion without analysis. Critic to study: 兵藤裕己 (orality và narrative), 前田愛 (reading as event), 蓮實重彦 (against narratological depth-reading). 蓮實 actually argues against systematic narratological apparatus — knowing this debate là C2 marker.",
  idiom_glosses: [
    { idiom: "藪の中 (やぶのなか)", literal: "Trong bụi rậm — title của Akutagawa story", meaning: "[書き言葉] Set phrase trong critical Japanese cho irreducible multi-perspective narrative — cite when describing similar structures.", example: "本作の語りの構造は、まさに「藪の中」的多声性を現代に蘇らせるものと申せよう。" },
    { idiom: "表裏一体 (ひょうりいったい)", literal: "Mặt và trái là một thân", meaning: "[書き言葉] Two faces of one body — narrator + author không thể tách rời trong I-novel; phù hợp khi analyzing 私小説.", example: "私小説における作者と語り手は、表裏一体の関係にあると見なされてきた。" },
    { idiom: "言外の意 (げんがいのい)", literal: "Ý ngoài lời", meaning: "[文語・書き言葉] Ý nghĩa ngoài lời — phù hợp khi analyzing free indirect discourse / unreliable narrator implications.", example: "信頼できない語り手の独白は、言外の意を読者に汲ませることで効力を発揮する。" },
    { idiom: "嚆矢 (こうし)", literal: "Mũi tên rít — tín hiệu khởi chiến", meaning: "[文語・硬い] First sign / pioneer — formal phrase cho 'first instance of'; deploy khi tracing genealogy.", example: "近代日本における信頼できない語り手の嚆矢は、芥川「藪の中」に求められよう。" }
  ],
  cultural_notes_vi: "Narrative theory ở Japanese academia có 4 đặc điểm differentiating từ Anglophone narratology. (1) GENETTE'S DOMINANCE — Japanese narratology (物語論) heavily Genette-influenced, more so than US/UK academy where post-classical narratology (Fludernik, Phelan) là dominant. C2 critic biết Genette terminology fluently bằng tiếng Nhật. Recent Fludernik reception starting nhưng vẫn niche. (2) 私小説 PROBLEM — Western narratology assumes clean separation author/narrator; Japanese 私小説 tradition troubles this distinction. Reading Dazai 'No Longer Human' với strict author/narrator separation feels artificial; reading với full identification feels naïve. C2 critic navigates this tension explicitly. (3) ORAL-WRITTEN HYBRIDITY — 兵藤裕己 và others trace Japanese narrative back to oral 語り (storytelling) tradition: 平家物語, 説経節, 講談. Modern novel still bears oral residues — narrator-to-listener address structures. Anglophone narratology less attentive. (4) HONORIFICS AS NARRATIVE TOOL — Japanese 敬語 deployment in narration (e.g., honorifics on character action) carries narratorial stance information impossible in non-honorific languages. 漱石 use of subtle honorific shifts on Sensei character signals narratorial respect; absence signals critical distance. Untranslatable layer, requires C2 sensitivity. Khác VN: Vietnamese narrative theory primarily through Russian/French routes (Bakhtin via translation, Genette directly); Japanese tradition layers Genette với pre-existing 語り tradition theorization. Reading frame quite different. Mẹo: nếu bạn analyze Japanese novel, MUST address how 敬語 deployment shapes narrative voice. Skipping this signals reading-as-translated-text-only. Mẹo cuối: Japanese narratology debates about 私小説 (autobiographical I-novel) authenticity vs fiction status are field-defining. Read 平野謙, 中村光夫, 加藤典洋 cho positions. Knowing genealogy of 私小説 debate signals C2 membership.",
  tip_advice_vi: "Workflow analyzing narrative voice C2 Japanese. (a) FIRST PASS — IDENTIFY GRAMMATICAL VOICE — câu first 5 paragraphs: ngôi (一/三人称), tense (past 〜た / present 〜る), particle markedness (〜は establishing context vs 〜が introducing). Establishes baseline. (b) SECOND PASS — TRACK FOCALIZATION SHIFTS — mark every instance where narrative consciousness shifts: into character X's mind, out, into Y's mind, out. Diagram chronologically. Pattern reveals focalization strategy: stable (single character), variable (multiple), zero (omniscient). (c) THIRD PASS — RELIABILITY MARKERS — list any contradictions, gaps, hesitations, reframings. Self-correction by narrator? Information narrator should know but doesn't share? These are reliability cues. (d) FOURTH PASS — FREE INDIRECT MARKERS — circle every sentence where bạn cannot definitively say 'this is narrator speaking' OR 'this is character thinking'. Ambiguity zones = free indirect territory. Map density. (e) SYNTHESIS — claim what narrative voice DOES (not just what it IS): does it position reader as confidant? Judge? Participant in interpretive labor? Function > taxonomy. Mẹo về 漢字 awareness — narrator's choice of 寂しい vs 淋しい (both 'lonely'), 暗い vs 闇い, 美しい vs 麗しい carries register information that signals education / class / era của the narrator's voice. C2 reader notices. Mẹo về citation pattern — narrative voice paper cite Genette (essential), then Japanese narratologists: 兵藤裕己, 前田愛, 中村三春, 内田樹 (for popular criticism bridge). 0 Genette citations = paper feels untheorized; only Genette = paper feels imported. Balance. Mẹo về length — narrative voice analysis published essays typically 10,000-20,000 字. Allows 2-3 passes through key passages. Shorter = surface taxonomy without analysis. Mẹo về controversial readings — claiming a canonical narrator is 'unreliable' (e.g., Sensei in Kokoro, watashi in 'Sanshirō') is publishable IF bạn marshal textual evidence carefully. Reviewer will challenge — be ready to defend với specific passages, page numbers, prior critic positions you accept/reject. Mẹo cuối: avoid systematic application of single theory framework. Mature C2 analysis deploys Genette where useful, abandons where not, supplements với Japanese-specific concepts. Theoretical eclecticism, properly justified, signals intellectual maturity.",
  exercises: [
    { type: "fill-blank", question: "「こゝろ」における三層構造の語りは、視点の重層化が真理の___性そのものを表象している。", answer: "到達不能" },
    { type: "matching", instruction: "Ghép concept với critic / source.", pairs: [
      { japanese: "焦点化", english: "Genette — narratological term standard in Japanese 物語論" },
      { japanese: "「藪の中」型構造", english: "Akutagawa — irreducible multi-perspective narrative" },
      { japanese: "私小説", english: "Japanese tradition troubling author/narrator separation" },
      { japanese: "言文一致", english: "Meiji movement creating modern Japanese narrative voice" }
    ] },
    { type: "translation", vietnamese: "Người kể không đáng tin cậy đòi hỏi ở người đọc một thái độ chủ động giải mã những gì nằm sau lời kể.", japanese: "信頼できない語り手は、読者に語りの背後を読み解く能動的姿勢を要請する。" }
  ]
},
{
  id: 104,
  title: "Literary criticism — symbol and metaphor analysis",
  title_vi: "Phê bình văn học — Phân tích biểu tượng và ẩn dụ",
  title_en: "Literary criticism — symbol and metaphor analysis",
  category: "literary-criticism",
  level: "C2",
  vocabulary: [
    { japanese: "象徴 (しょうちょう)", english: "symbol" },
    { japanese: "比喩 (ひゆ)", english: "metaphor / figurative" },
    { japanese: "隠喩 (いんゆ)", english: "metaphor (proper)" },
    { japanese: "直喩 (ちょくゆ)", english: "simile" },
    { japanese: "換喩 (かんゆ)", english: "metonymy" },
    { japanese: "提喩 (ていゆ)", english: "synecdoche" },
    { japanese: "イメージ", english: "image" },
    { japanese: "モチーフ", english: "motif" },
    { japanese: "表象 (ひょうしょう)", english: "representation / figuration" },
    { japanese: "アレゴリー", english: "allegory" }
  ],
  examples: [
    { japanese: "谷崎「陰翳礼讃」における「陰翳」は、単なる視覚的概念ではなく、日本的美意識の核を表象する象徴である。", english: "The 'shadow' in Tanizaki's 'In Praise of Shadows' is not a mere visual concept but a symbol that figures the very core of Japanese aesthetics." },
    { japanese: "三島「金閣寺」における金閣は、美の絶対性と、その絶対性が主人公を圧殺する暴力性とを同時に体現している。", english: "The Kinkaku in Mishima's 'Temple of the Golden Pavilion' simultaneously embodies the absoluteness of beauty and the violence by which that absoluteness crushes the protagonist." },
    { japanese: "村上春樹の「井戸」モチーフは、初期作品から長編に至るまで、無意識への垂直的下降の比喩として反復されてきた。", english: "The 'well' motif in Murakami Haruki has been repeated, from early works through to the long novels, as a metaphor for vertical descent into the unconscious." },
    { japanese: "象徴と寓意との区別は、近代詩学において最も基本的な弁別の一つを成す。", english: "The distinction between symbol and allegory constitutes one of the most fundamental discriminations in modern poetics." },
    { japanese: "比喩は装飾ではない。それは認識の様式そのものを規定する装置である。", english: "Metaphor is not ornament. It is a device that determines the very mode of cognition itself." },
    { japanese: "川端「雪国」の「鏡」は、視線の向こう側にもう一つの現実を開示する装置として機能する。", english: "The 'mirror' in Kawabata's 'Snow Country' functions as a device that discloses another reality on the far side of the gaze." }
  ],
  dialogue: [
    { speaker: "院生", japanese: "三島の金閣を、単なる美の象徴と読むだけでは、不十分でしょうか。", english: "Reading the Kinkaku in Mishima as merely a symbol of beauty — would that be insufficient?" },
    { speaker: "指導教員", japanese: "不十分ですね。象徴は、何かを「指す」だけでなく、何かを「行う」のです。金閣は美を指すと同時に、主人公の認識を規定し、最後には焼却の対象となる。", english: "Insufficient, yes. A symbol does not merely 'point to' something but also 'does' something. The Kinkaku points to beauty and at the same time regulates the protagonist's cognition, ultimately becoming the object of incineration." },
    { speaker: "院生", japanese: "つまり、象徴自体が物語を駆動する力を持つ、ということですね。", english: "In other words, the symbol itself possesses the power to drive the narrative." },
    { speaker: "指導教員", japanese: "そのとおり。静的な意味付与の対象ではなく、動的な力学の中心として読むべきなのです。", english: "Exactly. It should be read not as the object of static meaning-attribution but as the center of dynamic force." }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "本日は、村上春樹の井戸モチーフについて、論文の構想を伺っていただきたく存じます。", english: "Today I would like to have you hear my conception for a paper on Murakami Haruki's well-motif." },
    { speaker: "指導教員", japanese: "井戸——「ねじまき鳥クロニクル」の象徴的核ですね。どのような枠組みで論じる予定ですか。", english: "The well — the symbolic core of 'The Wind-Up Bird Chronicle.' Within what framework do you plan to discuss it?" },
    { speaker: "院生", japanese: "現状では、井戸を「無意識への下降」の比喩として読み、ユング心理学的解釈を試みる方向でございます。", english: "At present, the direction is to read the well as a metaphor for 'descent into the unconscious' and attempt a Jungian psychological interpretation." },
    { speaker: "指導教員", japanese: "ユング的読みは可能ですが、それのみでは陳腐化する危険があります。村上自身が公言している河合隼雄との対話を踏まえてはいるが、それを超える視点が要請されます。", english: "A Jungian reading is possible, but with that alone there is the danger of becoming hackneyed. Murakami's own publicly stated dialogue with Kawai Hayao is being taken into account, but a viewpoint that exceeds it is demanded." },
    { speaker: "院生", japanese: "超える視点とは、いかなるものでしょうか。", english: "What kind of viewpoint would exceed it?" },
    { speaker: "指導教員", japanese: "三つの方向が考えられます。第一に、井戸の通時的展開——初期短編「中国行きのスロウ・ボート」から「ねじまき鳥」を経て近作に至るまでの変容を追う系譜論的読み。第二に、戦争記憶との結節——井戸の底で語られるノモンハンの記憶という構造そのものの分析。第三に、井戸という形象のジェンダー的読解。", english: "Three directions are conceivable. First, the diachronic development of the well — a genealogical reading tracing the transformations from the early short story 'A Slow Boat to China,' through 'Wind-Up Bird,' to recent works. Second, the nexus with war memory — analysis of the very structure of 'memory of Nomonhan narrated at the bottom of the well.' Third, a gendered reading of the figuration of the well." },
    { speaker: "院生", japanese: "戦争記憶との結節、興味深いご指摘でございます。井戸という形象が、なぜ戦争語りの場として選ばれているのか、その必然性を問う形でしょうか。", english: "The nexus with war memory — an interesting indication. Would it take the form of asking why the figuration of the well was chosen as the site of war-narration, that necessity itself?" },
    { speaker: "指導教員", japanese: "そのとおり。垂直性、暗闇、孤立、地下水脈との接続——これらの形象的特徴が、なぜ戦争記憶の語りに対して特権的場所として機能するのか。比喩の必然性を問うとは、そういう作業です。", english: "Exactly. Verticality, darkness, isolation, connection with subterranean water veins — why these figural features function as a privileged site for the narration of war memory. Questioning the necessity of metaphor is that kind of work." },
    { speaker: "院生", japanese: "比喩を「装飾」としてではなく、「認識の様式」として捉え直す——リクール的な視座でございますね。", english: "To re-grasp metaphor not as 'ornament' but as 'mode of cognition' — that is a Ricoeurian standpoint." },
    { speaker: "指導教員", japanese: "リクールも援用できますが、村上を論じる場合は、より具体的に、村上が文化的記憶の特定の領域——戦争、暴力、性、家族——を扱う際に、なぜ常に井戸的形象に回帰するか、その反復強迫的構造を問うことが肝要です。", english: "Ricoeur can also be invoked, but in discussing Murakami, more concretely, when Murakami treats specific domains of cultural memory — war, violence, sexuality, family — why he always returns to well-like figurations, questioning that compulsion-to-repeat structure is essential." },
    { speaker: "院生", japanese: "反復強迫——フロイトの概念でございますね。井戸モチーフを反復強迫的徴候として読むことは、可能でございますか。", english: "Compulsion to repeat — Freud's concept. Is it possible to read the well-motif as a symptomology of compulsion to repeat?" },
    { speaker: "指導教員", japanese: "可能ですが、慎重を要します。作家個人の心理に還元せず、作品テクストの内部における反復構造として論じる必要があります。蓮實重彦が表層批評で警告している通り、深層心理学的還元は、テクストの具体性を消去する危険を孕んでいる。", english: "Possible, but caution is required. There is a need to discuss it as a repetition structure within the work-text, without reducing it to the writer's individual psychology. As Hasumi Shigehiko warned in his surface criticism, depth-psychological reduction harbors the danger of erasing the concreteness of the text." },
    { speaker: "院生", japanese: "肝に銘じます。テクスト内部の形象論的分析を主軸に、心理学的概念は補助的な位置づけにとどめる方針で、構想を再整理してまいります。", english: "I take that to heart. Taking figural analysis within the text as the main axis and keeping psychological concepts in an auxiliary position, I will reorganize the conception." },
    { speaker: "指導教員", japanese: "結構です。一週間後に、章立ての草案をお持ちください。", english: "Very well. In one week, please bring a draft of the chapter outline." }
  ],
  roleplay_prompts: [
    "Bạn analyze một symbol trong canonical work. Phương pháp: (1) identify symbol's surface referent, (2) trace its repetition trong work, (3) ask 'what does symbol DO, not just MEAN', (4) compare với related symbols trong author's other works. Cụm: 〜は単に〜を指すのみならず、〜を駆動する装置として機能する.",
    "Bạn distinguish symbol vs allegory cho seminar. Cụm chính: 象徴は意味の余剰を孕み、寓意は一対一の対応関係に依拠する. KHÔNG conflate hai khái niệm — Coleridge-derived distinction nền tảng of modern poetics.",
    "Bạn warning rằng Jungian/Freudian reading của Murakami well risks becoming hackneyed. Cụm: 深層心理学的還元は、テクストの具体性を消去する危険を孕む — invoke 蓮實's 表層批評 caution. Propose alternative: figural analysis within text."
  ],
  register_notes: "Symbol và metaphor analysis ở C2 Japanese requires distinguishing 4-tier figurative taxonomy. (1) FIGURE TYPES — 隠喩 (hidden = metaphor), 直喩 (direct = simile), 換喩 (replacing = metonymy), 提喩 (offering = synecdoche). C2 critic deploys these precisely; 比喩 alone là too general. Knowing 換喩 vs 提喩 distinction (part-for-whole vs related-thing-for-thing) marks training. (2) SYMBOL TAXONOMY — 象徴 (symbol — surplus of meaning, indeterminate), 寓意 (allegory — fixed correspondence), 表象 (representation — broader figuration), モチーフ (motif — recurring element), アレゴリー (allegory — Western-influenced term, sometimes overlaps 寓意). Distinction symbol/allegory traces back to Coleridge, deployed centrally in Japanese 詩学 since Romantic reception. (3) ANALYTIC MOVES — không enumerate symbols, analyze function. Cụm: 〜は〜を駆動する装置 (drives), 〜を構造化する形象 (structures), 〜を逆照射する (illuminates by reverse projection), 〜の必然性を問う (question the necessity of). C2 critic asks WHY this symbol HERE in THIS form. (4) GENEALOGICAL READING — track symbol across author's oeuvre: 'Murakami の井戸' từ 1980s short stories đến recent novels. Genealogy reveals what the symbol DOES for the author across career. (5) THEORETICAL FRAMES (deploy carefully) — Jakobson (metaphor = paradigmatic, metonymy = syntagmatic), Lakoff-Johnson (conceptual metaphor), Ricoeur (metaphor as cognition), Bachelard (poetics of space — important cho井戸/家/地下室 analysis). Japanese reception: 蓮實's anti-depth caution, 柄谷's structural approach, 中沢新一 (mythopoetic). KHÔNG mechanically apply theory — invoke when illuminating, abandon when forced. Forbidden moves: 'symbol = X' equation form (reductive); biographical reduction ('author had unconscious wound, hence symbol Y'); enumeration without analysis ('the work contains many symbols: A, B, C...'). Required: every symbol claim grounded in 3+ specific textual instances với page references. Critic to read: バシュラール『空間の詩学』(translated), リクール『生きた隠喩』, 中沢新一『カイエ・ソバージュ』, 蓮實重彦『「ボヴァリー夫人」論』(model of detail-attentive non-symbolic reading).",
  idiom_glosses: [
    { idiom: "一葉知秋 (いちようちしゅう)", literal: "Một chiếc lá rơi biết mùa thu", meaning: "[文語・硬い] 提喩 (synecdoche) cổ điển — một dấu hiệu nhỏ tiết lộ tổng thể; meta-phrase cho symbolic reading.", example: "一葉知秋と申すように、一つの細部が作品全体の構造を逆照射することがある。" },
    { idiom: "意味深長 (いみしんちょう)", literal: "Ý nghĩa sâu xa", meaning: "[書き言葉] Significance-laden — phrase cho symbol/passage carrying surplus meaning beyond surface.", example: "結末部の沈黙の長さは、意味深長と申すほかない。" },
    { idiom: "氷山の一角 (ひょうざんのいっかく)", literal: "Một góc của tảng băng", meaning: "[書き言葉・話し言葉] Tip of iceberg — visible symbol pointing to massive submerged structure; useful cho deep-symbol reading.", example: "テクストに現れる「鏡」のモチーフは、作品全体を貫く視線の構造の氷山の一角に過ぎない。" },
    { idiom: "言わぬが花 (いわぬがはな)", literal: "Không nói mới đẹp", meaning: "[文語・話し言葉] Better unspoken — Japanese aesthetic principle privileging suggestion over statement; tied to 余白 và symbolic indirection.", example: "言わぬが花の美学は、川端文学における象徴使用の根底をなしている。" }
  ],
  cultural_notes_vi: "Symbol analysis ở Japanese literary tradition có 4 đặc thù distinguishing từ Western allegorical tradition. (1) MA / 間 AS SYMBOL — Japanese aesthetic concept 間 (negative space, interval, pause) functions như symbol-bearer. Western symbol theory rarely accounts cho space-as-symbol. C2 critic analyzing Japanese text must address 間 deployment. (2) NATURE-IMAGES NOT INTERCHANGEABLE — Western Romantic tradition treats nature-images như universal symbols (rose, moon, river); Japanese tradition has dense seasonal codification (季語 system của haiku) where each natural image carries specific seasonal/emotional code. 桜 không phải 'spring flower' generally — nó carries entire complex của 物の哀れ, transience, samurai death. C2 reader knows 季語 codes. (3) CLASSICAL ALLUSION DENSITY — modern Japanese literary text often allude tới classical works (源氏物語 echoes trong 谷崎; 平家物語 trong 三島; haiku tradition trong 川端). Detecting và analyzing these inter-textual allusions là mandatory C2 work. Western reader may miss; Japanese reader must catch. (4) BUDDHIST VS WESTERN SYMBOL ECONOMIES — Buddhist concepts 無常 (impermanence), 空 (emptiness), 縁 (causation/connection) provide symbolic vocabulary distinct from Christian/classical Western. Reading 川端 với only Western symbol theory misses Buddhist substrate. Khác VN: Vietnamese literary criticism inherited French structuralism's symbol theory (mostly Saussurean signifier/signified mapping); Japanese tradition layers Western theory on pre-existing Buddhist + classical Japanese aesthetic vocabulary. Adjustment requires substantial reading. Mẹo: trước khi analyze symbol trong canonical Japanese work, read 1-2 standard 注釈 (commentaries) trên work — they catalog established symbolic readings. Argue against established readings consciously, không out of ignorance. Mẹo cuối: contemporary 比較文学 (comparative literature) departments in Japan train students bilingually trong Western theory + Japanese tradition. Reading both 西洋詩学 và 国文学 perspectives signals C2 sophistication.",
  tip_advice_vi: "Workflow symbol/metaphor analysis C2 Japanese. (a) IDENTIFY SYMBOL CANDIDATE — usually concrete object/image recurring across work (mirror, well, snow, golden pavilion, bird, water). Initial criterion: appears 5+ times trong significant scenes. (b) MAP OCCURRENCES — list every appearance với page reference, brief context. Diagram chronological position trong narrative. Reveals pattern: clustered in specific scenes? Spread evenly? Bookending opening và closing? (c) DETERMINE FIGURE TYPE — is the recurring element 隠喩 (full metaphor — vehicle replaces tenor)? 換喩 (metonymic — physical adjacency)? 提喩 (synecdochic — part-whole)? 象徴 (symbolic — surplus indeterminate meaning)? Precise taxonomy required. (d) ASK FUNCTION QUESTIONS — what does symbol DO at each occurrence? (1) drives plot? (2) reveals character? (3) structures theme? (4) bridges to other texts? Function shifts across occurrences = sophisticated reading. (e) GENEALOGICAL EXPANSION — does same symbol appear in author's other works? Trace genealogy: 谷崎's mother-figure across novels, 三島's body-as-art, 村上's elevator/well/cat triad. Cross-work analysis multiplies analytic depth. (f) THEORETICAL FRAMING (last) — only after textual mapping, invoke theory. Bachelard cho spatial symbols, Lakoff cho conceptual metaphor, 蓮實 cho anti-symbolic warning. Theory illuminates pattern bạn already mapped, không substitutes mapping. Mẹo về citation pattern — symbol analysis published essays cite (1) one framing theorist (Bachelard / Ricoeur / Lakoff), (2) Japanese critic on same author (e.g., 加藤典洋 cho 村上, 三島 by 松本徹), (3) edition note (which version of text). Three-tier citation. Mẹo về controversial readings — claim a symbol in canonical work hidden meaning chưa noticed before requires marshalling evidence carefully. Reviewer skeptic by default — over-prepare evidence. Mẹo về 反復 (repetition) detection — use computational text-analysis tools (MeCab + frequency count) cho long works. Catches patterns invisible to manual reading. Hybrid digital + close reading methodology cutting-edge ở contemporary 国文学. Mẹo cuối: avoid two trap modes — (1) symbol-hunter mode (every object = symbol, paper feels obsessive); (2) anti-symbol mode (refusing to read symbolically, paper feels reductive). Calibrate: not every recurring object is symbol; not every symbol carries deep meaning. Judgment.",
  exercises: [
    { type: "fill-blank", question: "比喩は装飾ではない。それは認識の___そのものを規定する装置である。", answer: "様式" },
    { type: "matching", instruction: "Ghép term với critic / source.", pairs: [
      { japanese: "認識の様式としての隠喩", english: "Ricoeur — metaphor as cognition" },
      { japanese: "表層批評", english: "Hasumi — anti-depth-symbolic reading" },
      { japanese: "空間の詩学", english: "Bachelard — poetics of intimate space" },
      { japanese: "提喩", english: "synecdoche — part-whole figure" }
    ] },
    { type: "translation", vietnamese: "Mô-típ 'giếng' của Murakami Haruki, từ tác phẩm sơ kỳ đến tiểu thuyết dài, đã được lặp lại như ẩn dụ cho sự hạ giáng theo trục thẳng đứng vào vô thức.", japanese: "村上春樹の「井戸」モチーフは、初期作品から長編に至るまで、無意識への垂直的下降の比喩として反復されてきた。" }
  ]
},
{
  id: 105,
  title: "Literary criticism — genre conventions and subversion",
  title_vi: "Phê bình văn học — Quy ước thể loại và sự lật đổ",
  title_en: "Literary criticism — genre conventions and subversion",
  category: "literary-criticism",
  level: "C2",
  vocabulary: [
    { japanese: "ジャンル", english: "genre" },
    { japanese: "様式 (ようしき)", english: "form / style" },
    { japanese: "型 (かた)", english: "established form / mold" },
    { japanese: "規範 (きはん)", english: "norm / convention" },
    { japanese: "逸脱 (いつだつ)", english: "deviation / departure" },
    { japanese: "撹乱 (かくらん)", english: "disruption" },
    { japanese: "反転 (はんてん)", english: "inversion / reversal" },
    { japanese: "脱構築 (だつこうちく)", english: "deconstruction" },
    { japanese: "境界横断 (きょうかいおうだん)", english: "boundary-crossing" },
    { japanese: "ハイブリッド", english: "hybrid" }
  ],
  examples: [
    { japanese: "ジャンルとは、作家が依拠しつつ同時に逸脱する規範の総体である。", english: "Genre is the totality of norms upon which a writer relies and simultaneously departs from." },
    { japanese: "私小説の形式を逆手に取った村田沙耶香「コンビニ人間」は、ジャンルの自己言及的撹乱を体現している。", english: "Murata Sayaka's 'Convenience Store Woman,' which turns the form of the I-novel against itself, embodies the genre's self-referential disruption." },
    { japanese: "安部公房の小説は、SF・寓話・実存主義小説の境界を意図的に横断する。", english: "Abe Kōbō's novels intentionally cross the boundaries among SF, parable, and existentialist novel." },
    { japanese: "三島由紀夫における歌舞伎・能の様式の引用は、近代小説の枠組みそのものへの内的批判として機能する。", english: "Mishima Yukio's citation of kabuki and noh forms functions as an internal critique of the very framework of the modern novel." },
    { japanese: "ジャンルの規範を完全に無視する作品は、読者にとって読解不能となる。逸脱は、規範の認識を前提としてのみ成立する。", english: "A work that completely ignores generic norms becomes unreadable for the reader. Deviation is constituted only on the premise of recognition of the norm." },
    { japanese: "多和田葉子の二言語的散文は、国民文学という近代的ジャンル概念そのものを脱構築する試みと読み得る。", english: "Tawada Yōko's bilingual prose may be read as an attempt to deconstruct the very modern generic concept of 'national literature.'" }
  ],
  dialogue: [
    { speaker: "院生", japanese: "「コンビニ人間」を私小説の系譜で読むことは、可能でしょうか。", english: "Would it be possible to read 'Convenience Store Woman' within the genealogy of the I-novel?" },
    { speaker: "指導教員", japanese: "可能ですが、単純な継承ではなく、私小説形式を「擬態」する作品として読むのが妥当でしょう。", english: "Possible, but reading it not as simple inheritance but as a work that 'mimics' the I-novel form would be appropriate." },
    { speaker: "院生", japanese: "擬態——つまり、形式を踏襲しつつ、その内側から規範を撹乱しているわけですね。", english: "Mimicry — in other words, while following the form, it disrupts the norm from inside it." },
    { speaker: "指導教員", japanese: "そのとおり。ジャンルの逸脱は、規範への完全な依拠を前提としてのみ可能となる。これが、ジャンル研究の逆説です。", english: "Exactly. Generic deviation becomes possible only on the premise of complete reliance on the norm. This is the paradox of genre studies." }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "本日は、安部公房のジャンル横断性について論じたく存じます。「砂の女」をどのジャンルに位置づけるか、論者によって解釈が大きく分かれております。", english: "Today I would like to discuss Abe Kōbō's genre-crossing character. How to position 'The Woman in the Dunes' within genre — interpretations among scholars diverge greatly." },
    { speaker: "指導教員", japanese: "「砂の女」のジャンル不確定性こそが、本作の中心的問題系を成しています。SFとして読むか、寓話として読むか、実存主義小説として読むか——いずれの読みも部分的に正当であり、いずれも単独では十全ではない。", english: "The very generic indeterminacy of 'The Woman in the Dunes' constitutes the central problematic of this work. Whether to read it as SF, as parable, or as existentialist novel — each reading is partially valid, and none alone is fully adequate." },
    { speaker: "院生", japanese: "ジャンル不確定性そのものが分析対象となる、ということですね。", english: "So generic indeterminacy itself becomes the object of analysis." },
    { speaker: "指導教員", japanese: "そのとおり。「ジャンル横断」という事実を超えて、なぜ本作品が、特定のジャンルへの帰属を拒否する形式を採ったのか、その必然性を問う必要があります。", english: "Exactly. Beyond the fact of 'genre-crossing,' there is a need to ask why this work adopted a form that refuses belonging to a specific genre — that necessity itself." },
    { speaker: "院生", japanese: "戦後日本の社会構造との関連でしょうか。確立されたジャンルが現実を捉えられなくなった、という認識ゆえの形式革新——とでも申しましょうか。", english: "Is it related to postwar Japanese social structure? Should we call it formal innovation born of the recognition that established genres could no longer grasp reality?" },
    { speaker: "指導教員", japanese: "良い仮説です。ただし、安部の戦中・戦後の経験——満州体験、引揚げ——を踏まえると、より具体的な歴史的契機が見えてきます。「故郷」という近代小説の前提そのものが安部にとっては成り立たなかった。だからこそ、寓話的・抽象的形式を選ばざるを得なかった、と読み得る。", english: "A good hypothesis. However, taking into account Abe's wartime and postwar experience — Manchurian experience, repatriation — more concrete historical occasions come into view. The very premise of 'native land' assumed by the modern novel did not hold for Abe. Precisely for that reason, he could be read as having had no choice but to choose parabolic, abstract forms." },
    { speaker: "院生", japanese: "歴史的経験が、ジャンル選択の必然性を生み出す、というご指摘ですね。", english: "Your indication is that historical experience generates the necessity of genre choice." },
    { speaker: "指導教員", japanese: "そう。形式は中立ではない。形式自体が歴史的・思想的負荷を担っている。ジャンル研究の真の対象は、ジャンル選択の歴史的・思想的必然性を解明することです。", english: "Yes. Form is not neutral. Form itself bears historical and ideological loading. The true object of genre studies is to elucidate the historical and ideological necessity of generic choice." },
    { speaker: "院生", japanese: "近年の作家——多和田葉子、川上未映子——の場合は、いかがでしょうか。彼女らのジャンル横断は、また別の必然性を担っているように思われます。", english: "What about recent writers — Tawada Yōko, Kawakami Mieko? Their genre-crossing seems to bear yet another necessity." },
    { speaker: "指導教員", japanese: "鋭い観察です。多和田は二言語的経験ゆえに「日本語小説」というジャンル枠そのものを問題化する。川上は身体性・性差の言語化において、既存の小説ジャンルが提供する語彙では不十分であった、という認識から出発している。両者とも、ジャンル枠の不適合を内側から告発する作家と言えましょう。", english: "An incisive observation. Tawada problematizes the very generic frame of 'Japanese novel' precisely because of bilingual experience. Kawakami departs from the recognition that the vocabulary provided by existing novelistic genres was insufficient for the linguification of the body and gender difference. Both, one might say, are writers who indict the unsuitability of generic frames from within." },
    { speaker: "院生", japanese: "ジャンル研究を、形式の歴史社会学として位置づけ直す——これが本論文の理論的主張になりそうでございます。", english: "To re-position genre studies as a historical sociology of form — this seems likely to become the theoretical claim of my paper." },
    { speaker: "指導教員", japanese: "結構です。バフチンの「ジャンルは固定された型ではなく、歴史的に蓄積された世界観の沈澱物である」という命題が、出発点として有効でしょう。", english: "Very well. Bakhtin's proposition that 'genre is not a fixed mold but a sediment of historically accumulated worldview' would be effective as a starting point." },
    { speaker: "院生", japanese: "肝に銘じます。バフチン受容と、日本における安部・多和田・川上の系譜を接合する形で、論を進めてまいります。", english: "I take that to heart. Connecting the reception of Bakhtin with the Japanese genealogy of Abe-Tawada-Kawakami, I will advance the argument." }
  ],
  roleplay_prompts: [
    "Bạn analyze how a contemporary novel subverts genre. Phương pháp: (1) identify which genre conventions work invokes (mystery? romance? I-novel? family saga?), (2) trace where conventions are followed, (3) trace where deviated, (4) ask 'WHY this deviation HERE?'. Cụm: ジャンル規範の引用と逸脱の往還が、〜という効果を生む.",
    "Bạn defend rằng experimental form is necessary, không gimmick. Cụm: 形式の選択は、歴史的・思想的必然性を担っている — invoke specific historical/social context driving form. KHÔNG art-for-art's-sake — anchor trong material/historical conditions.",
    "Bạn position Tawada hoặc Kawakami within genre studies. Frame như critique từ within — họ deploy genre awareness để problematize genre. Cụm: 既存のジャンル枠の不適合を内側から告発する. KHÔNG dismiss như mere experimentation — emphasize critique-function."
  ],
  register_notes: "Genre criticism ở C2 Japanese requires distinguishing 3 different concept levels của 'genre'. (1) JAPANESE TRADITIONAL CATEGORIES — 物語 (tale), 随筆 (essay), 日記 (diary), 軍記 (war chronicle), 私小説 (I-novel). Pre-modern và modern Japanese specific. (2) WESTERN-IMPORTED CATEGORIES — 小説 (novel — itself imported concept), SF, 探偵小説 (detective), ロマンス (romance), 寓話 (allegory/parable). Imported but now naturalized. (3) THEORETICAL META-CATEGORIES — Bakhtin's 'ジャンル', Genette's 'アルキテクスト' (architext), Todorov's 'fantastique'. Used for higher-order analysis. C2 critic distinguishes which level operating at. Key analytical moves. (1) GENRE AS SEDIMENTED WORLDVIEW — Bakhtinian approach treating genre không as fixed mold mà as historical accumulation. Cụm: ジャンルは歴史的に蓄積された世界観の沈澱物である. Allows analyzing genre choice như historical statement. (2) DEVIATION REQUIRES NORM — paradox of subversion: complete ignorance of genre norm makes work unreadable, not subversive. Subversion requires deep knowledge. Cụm: 逸脱は規範の認識を前提としてのみ成立する. (3) FORMAL CHOICE BEARS IDEOLOGY — refuse formalist/political separation. Cụm: 形式は中立ではない / 形式自体が歴史的・思想的負荷を担っている. Choice of haiku vs novel vs essay carries ideological weight. (4) HYBRIDITY VS BOUNDARY-CROSSING — distinguish ハイブリッド (synthesis of multiple genres into new form) từ 境界横断 (movement across boundaries while maintaining distinctness). Different analytic objects. (5) META-GENERIC AWARENESS — modern works often display awareness of own generic positioning. 自己言及的 (self-referential) genre play characterizes much postmodern Japanese fiction (高橋源一郎, 島田雅彦). Analysis must address self-reference layer. Vocabulary forbidden ở genre criticism: 'simple genre fiction' (categorizing without analyzing), 'transcends genre' (bypasses analytic work), 'pure literature vs popular' bare opposition (純文学/大衆文学 distinction itself historically constructed, requires problematization). Critic to read: バフチン『ジャンルの問題』, トドロフ『幻想文学論序説』, ジュネット『パランプセスト』, 中沢新一 cho mythogenetic genre theory, 大塚英志 cho postmodern Japanese genre theory (otaku critique). Bakhtin reception in Japan particularly important — 桑野隆 translation tradition.",
  idiom_glosses: [
    { idiom: "型破り (かたやぶり)", literal: "Phá vỡ khuôn mẫu", meaning: "[書き言葉・話し言葉] Breaking the mold — phrase cho genre subversion; positive valence khi mature work, negative khi amateur.", example: "型破りな作品が真に評価されるためには、まず型を熟知していることが前提となる。" },
    { idiom: "守破離 (しゅはり)", literal: "Giữ — phá — rời", meaning: "[文語・硬い] Traditional 道 mastery progression: keep form, break form, transcend form. Apply analogically to genre mastery in literature.", example: "ジャンル習得の過程は、武道や芸道における守破離の三段階に擬えて考えることができる。" },
    { idiom: "新旧交替 (しんきゅうこうたい)", literal: "Mới và cũ thay phiên", meaning: "[書き言葉] Old-new replacement — phrase cho generational genre shift; useful describing genre evolution.", example: "戦後文学における私小説からポストモダン小説への新旧交替は、単なる流行ではなく深い必然性を持つ。" },
    { idiom: "和魂洋才 (わこんようさい)", literal: "Hồn Nhật, tài Tây", meaning: "[文語・硬い] Meiji concept — Japanese spirit + Western technique; applicable to hybrid genre forms borrowing Western structure with Japanese substance.", example: "明治の小説家たちは、和魂洋才の理念のもと、西欧小説の形式を移植しながらも日本的主題を保持しようとした。" }
  ],
  cultural_notes_vi: "Genre criticism ở Japanese literary tradition có 4 đặc thù. (1) 純文学/大衆文学 DIVIDE — Japanese tradition strongly maintains distinction giữa 'pure literature' và 'popular literature' through institutional mechanisms (芥川賞 vs 直木賞). C2 critic must address this distinction is itself historically constructed (postwar institutionalization), không natural. Recent erosion (村上 ambiguous status; 川上 crossing both) is critical topic. (2) 私小説 AS NATIONAL FORM — 私小説 (I-novel) treated như uniquely Japanese genre, distinguishing Japanese modern literature từ Western. Recent scholarship (鈴木登美 trong English) problematizes this nationalist framing — 私小説 institutional construction, not natural form. C2 reader engages with critique. (3) GENRE TRANSLATION ASYMMETRY — when Japanese SF (筒井康隆, 小松左京) translated to English, often reframed as 'literary fiction' losing genre signature; reverse rarely happens. Genre boundaries are translation-dependent. International reception transforms genre classification. (4) MEDIA HYBRIDITY — Japanese literature exists trong ecosystem với manga, anime, light novel, video game narrative. Genre boundaries cross media (light novel ↔ anime ↔ manga adaptations). Pure literary genre analysis ignoring media context misses contemporary reality. 大塚英志, 東浩紀 theorize this media-genre interaction. Khác VN: VN literary criticism still primarily works within stable genre categories inherited từ French tradition (poésie / roman / nouvelle / essai); Japanese tradition more fluid và self-reflexively contests its own categories. Mẹo: nếu bạn analyze Japanese work, address 賞 (literary prize) reception — 芥川賞 vs 直木賞 reception positions work generically và ideologically. Skipping this misses institutional layer. Mẹo về translated genre studies — read both Japanese-original genre theory (大塚英志, 東浩紀) và Anglophone Japanese studies (Suzuki Tomi, Karatani Kojin trong English) parallel. Comparative perspective signals C2 sophistication. Mẹo cuối: genre debates in Japanese academia often become polemical (純文学 defenders vs popular-genre defenders). Critic must navigate without taking partisan position prematurely. Map debate before claiming side.",
  tip_advice_vi: "Workflow genre criticism C2 Japanese cho luận văn / book review. (a) IDENTIFY WHICH GENRES WORK INVOKES — most modern works invoke multiple. List explicitly: this work cites X (mystery), Y (romance), Z (I-novel) conventions. Identify primary frame và secondary citations. (b) MAP CONVENTIONS — for each invoked genre, list 5-10 conventional features (mystery: corpse, detective, red herrings, solution; romance: meeting, obstacle, resolution, etc.). Mark which work follows, which deviates. (c) WHERE FOLLOWS, ASK WHY — generic compliance không trivial. Why does work follow this convention here? Genre-fluency? Reader-management? Setting up subversion? (d) WHERE DEVIATES, ASK NECESSITY — every deviation should pass test: 'is deviation arbitrary or necessitated?'. Arbitrary = gimmick, weak. Necessitated by what work needs to do = genuine subversion. (e) HISTORICIZE — situate generic choice trong author's context (career stage, contemporary literary scene, broader social moment). Bakhtinian historicization. Cụm: 〜の形式選択は、〜という歴史的契機を背景としてのみ理解可能となる. (f) THEORIZE — only after textual analysis, deploy theoretical frame (Bakhtin / Todorov / Genette / 大塚 / 東). Theory illuminates pattern bạn already mapped. Mẹo về citation pattern — genre criticism essay needs (1) one or two genre theorists, (2) Japanese genre-history study (e.g., 鈴木貞美 cho 純文学 history, 大塚英志 cho otaku culture genres), (3) other critic on same author. Triangulation. Mẹo về controversial readings — claiming canonical literary work is 'genre fiction' (e.g., Murakami as fantasy) hoặc claiming popular work is 'literary' (e.g., Murata as Kafka-equivalent) is publishable IF marshaled carefully. Reviewer skeptical — over-prepare. Mẹo về 純文学/大衆文学 boundary — never assume distinction natural. Always historicize và problematize. Reading Murakami as 純文学 vs 大衆文学 is itself critical position requiring defense. Mẹo về cross-media genre — if work has manga/anime adaptation, address adaptation as part of genre analysis. Adaptation reveals what genre features survive translation, what don't. Diagnostic. Mẹo cuối: genre criticism risks taxonomic exhaustion (paper devolves to listing conventions). Resist. Goal là functional analysis (what genre choice DOES), không cataloguing. Always return to: 'why this generic positioning, here, by this author?'.",
  exercises: [
    { type: "fill-blank", question: "ジャンルの規範を完全に無視する作品は、読者にとって読解不能となる。___は、規範の認識を前提としてのみ成立する。", answer: "逸脱" },
    { type: "matching", instruction: "Ghép concept với theorist / Japanese critic.", pairs: [
      { japanese: "ジャンルは世界観の沈澱物である", english: "Bakhtin — genre as sedimented worldview" },
      { japanese: "純文学/大衆文学", english: "Japanese institutional distinction (Akutagawa/Naoki prizes)" },
      { japanese: "オタク文化のジャンル論", english: "Ōtsuka Eiji / Azuma Hiroki — postmodern genre theory" },
      { japanese: "私小説の制度性", english: "Suzuki Tomi — I-novel as constructed institution" }
    ] },
    { type: "translation", vietnamese: "Trong tiểu thuyết của Mishima Yukio, việc trích dẫn các hình thức kabuki và noh có chức năng như một sự phê phán nội tại đối với chính khung của tiểu thuyết hiện đại.", japanese: "三島由紀夫における歌舞伎・能の様式の引用は、近代小説の枠組みそのものへの内的批判として機能する。" }
  ]
},
{
  id: 106,
  title: "Literary criticism — comparing translations",
  title_vi: "Phê bình văn học — So sánh các bản dịch",
  title_en: "Literary criticism — comparing translations",
  category: "literary-criticism",
  level: "C2",
  vocabulary: [
    { japanese: "翻訳論 (ほんやくろん)", english: "translation theory" },
    { japanese: "原文 (げんぶん)", english: "source text" },
    { japanese: "訳文 (やくぶん)", english: "translation text" },
    { japanese: "等価 (とうか)", english: "equivalence" },
    { japanese: "可訳性 (かやくせい)", english: "translatability" },
    { japanese: "不可訳性 (ふかやくせい)", english: "untranslatability" },
    { japanese: "直訳 (ちょくやく)", english: "literal translation" },
    { japanese: "意訳 (いやく)", english: "free translation" },
    { japanese: "翻訳者の介入 (ほんやくしゃのかいにゅう)", english: "translator's intervention" },
    { japanese: "受容文化 (じゅようぶんか)", english: "receiving culture" }
  ],
  examples: [
    { japanese: "翻訳の比較は、原文の解釈の多様性と、受容文化の制約とを同時に照らし出す作業である。", english: "Comparing translations is a work that simultaneously illuminates both the diversity of interpretation of the source text and the constraints of the receiving culture." },
    { japanese: "「源氏物語」の英訳——ウェイリー、サイデンステッカー、タイラーの三訳を比較することで、各時代の翻訳規範の変遷が浮かび上がる。", english: "Comparing the three English translations of 'The Tale of Genji' by Waley, Seidensticker, and Tyler brings to the surface the transformations of translation norms in each era." },
    { japanese: "ベルマンが論じたように、翻訳は常に「他者の試練」であり、自言語の自明性を撹乱する力を持つ。", english: "As Berman argued, translation is always a 'trial of the other' and possesses the power to disrupt the self-evidence of one's own language." },
    { japanese: "ヴェヌティが対比した「ドメスティケーション」と「フォリナイゼーション」は、翻訳戦略の根本的な二極を示す。", english: "Venuti's contrast between 'domestication' and 'foreignization' indicates the fundamental two poles of translation strategy." },
    { japanese: "村上春樹の英訳——ルービン訳とゲイブリエル訳——においては、文体の選択そのものが村上像の構築を左右している。", english: "In Murakami Haruki's English translations — by Rubin and by Gabriel — the choice of style itself influences the construction of the image of Murakami." },
    { japanese: "翻訳者の不可視性を批判するヴェヌティの議論は、文学翻訳の倫理的次元を再構築するものであった。", english: "Venuti's argument criticizing the invisibility of the translator was one that reconstructed the ethical dimension of literary translation." }
  ],
  dialogue: [
    { speaker: "院生", japanese: "「源氏物語」の三英訳を比較する論文を書きたいのですが、比較の軸がまだ定まっておりません。", english: "I want to write a paper comparing the three English translations of 'The Tale of Genji,' but the axis of comparison has not yet settled." },
    { speaker: "指導教員", japanese: "三軸を設定するのが定石でしょう。第一に、敬語表現の処理。第二に、和歌の翻訳方針。第三に、原文の曖昧性に対する解釈の度合い。", english: "Setting up three axes would be the standard approach. First, the handling of honorific expressions. Second, the policy on translating waka poems. Third, the degree of interpretation of the source text's ambiguity." },
    { speaker: "院生", japanese: "敬語処理について、三者の方針はかなり異なっておりますね。ウェイリーは大胆に意訳し、サイデンステッカーは中庸を取り、タイラーは原文への忠実性を徹底した、と整理してよろしいでしょうか。", english: "Regarding honorific handling, the three policies differ considerably. Waley translated freely and boldly, Seidensticker took the middle way, Tyler thoroughly insisted on fidelity to the source — would that organization be acceptable?" },
    { speaker: "指導教員", japanese: "概ね妥当な整理です。ただし、各翻訳者の方針を、翻訳が行われた歴史的文脈と接続することが肝要です。文体的選択の背後には、当該時代の受容文化の期待が常に作用しています。", english: "A broadly valid organization. However, connecting each translator's policy with the historical context in which the translation was carried out is essential. Behind stylistic choices, the expectations of the receiving culture of that era are always at work." }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "本日は、村上春樹の英訳比較について、論文の構想を伺っていただきたく存じます。ルービン訳とゲイブリエル訳とで、村上像が大きく変容していると感じておりますが、これをいかに論じ得るか。", english: "Today I would like to have you hear my conception for a paper comparing translations of Murakami Haruki. I feel that the image of Murakami transforms greatly between Rubin's translation and Gabriel's, but how can this be argued?" },
    { speaker: "指導教員", japanese: "重要な問題系です。村上の場合、翻訳者の選択そのものが村上の国際的受容を構築してきたと申せましょう。具体的に、いずれの作品の比較を予定していますか。", english: "An important problematic. In Murakami's case, one might say that the very choice of translators has constructed Murakami's international reception. Specifically, which works are you planning to compare?" },
    { speaker: "院生", japanese: "「ノルウェイの森」のアルフレッド・バーンバウム旧訳とジェイ・ルービン新訳、それに「色彩を持たない多崎つくる」のフィリップ・ゲイブリエル訳——これら三訳の文体を、原文と照合する形で。", english: "Alfred Birnbaum's old translation and Jay Rubin's new translation of 'Norwegian Wood,' and Philip Gabriel's translation of 'Colorless Tsukuru Tazaki' — comparing the styles of these three translations against the source text." },
    { speaker: "指導教員", japanese: "意欲的な構想です。ただし、比較の単位を絞らないと収拾がつかなくなります。私の提案としては、三つの観点に絞ること。第一に、語り手の声の処理。第二に、文化固有要素——食、地名、固有名詞——の翻訳戦略。第三に、原文の文体的特徴——反復、省略、独特の比喩——の英訳における変容。", english: "An ambitious conception. However, unless you narrow down the unit of comparison, it will become uncontainable. My proposal is to focus on three viewpoints. First, the handling of the narrator's voice. Second, the translation strategy for culture-specific elements — food, place names, proper nouns. Third, the transformations in English translation of the source text's stylistic features — repetition, omission, distinctive metaphor." },
    { speaker: "院生", japanese: "三観点、誠に的確でございます。語り手の声について申しますと、村上の一人称「僕」の英訳における「I」への変換は、それ自体が一つの翻訳的決断を含んでおりますね。", english: "The three viewpoints are indeed precise. To speak of the narrator's voice, the conversion of Murakami's first-person 'boku' to 'I' in English translation itself contains a single translational decision." },
    { speaker: "指導教員", japanese: "そのとおり。日本語の一人称体系——僕、私、俺、わたくし——は英語の単一の「I」では捉えきれない。翻訳者は、別の手段——文体、語彙、文の長さ——によって、原文の「僕」性を再構築せざるを得ない。これは「不可訳性」の典型例です。", english: "Exactly. The Japanese first-person system — boku, watashi, ore, watakushi — cannot be captured by English's single 'I.' The translator has no choice but to reconstruct the source text's 'boku-ness' by other means — style, vocabulary, sentence length. This is a typical case of 'untranslatability.'" },
    { speaker: "院生", japanese: "不可訳性を、翻訳の失敗としてではなく、翻訳者の創造的介入の場として捉え直す——ベルマン的視座でございますね。", english: "To re-grasp untranslatability not as the failure of translation but as a site of the translator's creative intervention — that is a Bermanian standpoint." },
    { speaker: "指導教員", japanese: "ベルマンも援用できますが、村上論の場合、より具体的にヴェヌティの「フォリナイゼーション」——受容言語の自明性を意図的に撹乱する翻訳——との対比が有効です。ルービンは比較的ドメスティケーション寄り、近年のゲイブリエルはやや異化的——とも整理できる。", english: "Berman can also be invoked, but in the case of a Murakami study, more concretely, contrast with Venuti's 'foreignization' — translation that intentionally disrupts the self-evidence of the receiving language — is effective. Rubin is comparatively domestication-oriented; recent Gabriel is somewhat alienating — one might organize it that way." },
    { speaker: "院生", japanese: "比較の枠組みが見えてまいりました。文化固有要素の処理についても、伺ってよろしいでしょうか。コンビニ、立ち食いそば、自動販売機など、日本固有の生活空間の翻訳戦略は、各訳者で大きく異なっております。", english: "The framework for comparison is coming into view. May I also ask about the handling of culture-specific elements? The translation strategies for Japan-specific living spaces — convenience stores, standing soba shops, vending machines — differ greatly among translators." },
    { speaker: "指導教員", japanese: "重要な観点です。これらの要素の処理は、翻訳が「日本性」をいかに構築または抹消するか、という問題に直結します。バーンバウム旧訳は文化的説明を最小化し、ルービンはやや解説的、ゲイブリエルはほぼ原語のローマ字表記を保持する傾向がある。これは単なる方針の差ではなく、各時代の英語圏読者の「日本」への期待値の変遷を反映しています。", english: "An important standpoint. The handling of these elements directly connects to the question of how translation constructs or erases 'Japaneseness.' Birnbaum's old translation minimizes cultural explanation; Rubin is somewhat more explanatory; Gabriel tends to nearly preserve romanized representation of the original language. This is not merely a difference in policy but reflects the transformations in the expectation of 'Japan' on the part of Anglophone readers of each era." },
    { speaker: "院生", japanese: "受容文化の歴史性そのものが、翻訳分析の対象となる、ということですね。", english: "So the historicity of the receiving culture itself becomes the object of translation analysis." },
    { speaker: "指導教員", japanese: "そう。翻訳論の本質は、翻訳行為を孤立した出来事として捉えるのではなく、原文文化と受容文化との歴史的接触の場として捉え直すことにあります。", english: "Yes. The essence of translation theory lies in re-grasping the act of translation not as an isolated event but as a site of historical contact between source-text culture and receiving culture." },
    { speaker: "院生", japanese: "肝に銘じます。ベルマン、ヴェヌティを理論的支柱としつつ、各訳者の歴史的文脈を踏まえた具体的比較を中軸にして、論文を構築してまいります。", english: "I take that to heart. Taking Berman and Venuti as theoretical pillars, while making concrete comparison grounded in each translator's historical context the central axis, I will construct the paper." }
  ],
  roleplay_prompts: [
    "Bạn compare 2-3 translations của một famous opening passage. Phương pháp: (1) original text + each translation lined up, (2) micro-analyze divergences (lexical, syntactic, register), (3) ask 'what does each translator's choice produce in receiving language?', (4) historicize choices. Cụm: 各訳者の選択は、当該時代の受容文化の期待を反映する.",
    "Bạn defend rằng untranslatability is creative opportunity, không failure. Cụm: 不可訳性を翻訳の失敗としてではなく、翻訳者の創造的介入の場として捉え直す. Invoke Berman's 'trial of the other'. KHÔNG dismiss translation as inferior — frame as transformation.",
    "Bạn analyze how translation constructs author's image internationally. Cụm: 翻訳者の選択そのものが〜の国際的受容を構築してきた. Specific example: Murakami's 'boku' → English 'I' loses Japanese first-person nuance. Translator must reconstruct via style."
  ],
  register_notes: "Translation criticism ở C2 Japanese requires fluent deployment của 翻訳論 vocabulary từ both German hermeneutic và French/American post-structural traditions. (1) GERMAN HERMENEUTIC LINEAGE — シュライエルマッハー (Schleiermacher) original distinction: 著者を読者に近づける (bring author to reader = domestication) vs 読者を著者に近づける (bring reader to author = foreignization). Foundation für all subsequent debate. ベンヤミン「翻訳者の課題」(Benjamin's 'Task of the Translator') 純粋言語 (pure language) concept — translation reveals language's potential beyond either source or target. (2) FRENCH-AMERICAN POST-STRUCTURAL — ベルマン (Berman) 他者の試練 (trial of the other) ethical critique của 'invisible' translation; ヴェヌティ (Venuti) ドメスティケーション/フォリナイゼーション (domestication/foreignization) explicit politicized restatement. ジャクソン-ペリー (Lawrence Jenkins, Susan Bassnett) cultural turn frame translation as cultural negotiation. (3) JAPANESE TRANSLATION DISCOURSE — 柳父章 (Yanabu Akira) 翻訳語成立事情 (formation of translation vocabulary) traces how Meiji translators created modern Japanese vocabulary by inventing kanji compounds (社会, 個人, 文化, 自然) — translation invented modern Japan. 加藤周一 multilingual essays. 池澤夏樹 contemporary translation editor. C2 critic knows this lineage. (4) ANALYTIC MOVES — micro-comparison (line by line), strategy identification (literal/free, dom/foreignizing), historical contextualization (era's translation norms), reception analysis (how each translation shaped author's image abroad). All four required cho substantive translation paper. (5) UNTRANSLATABILITY DISCOURSE — 不可訳性 không nghĩa là cannot translate; nghĩa là translation requires creative reconstruction. Japanese-specific: 敬語 system, 一人称 multiplicity (僕/私/俺/わたくし), 季語 cultural codes — all 'untranslatable' yet routinely translated through reconstruction strategies. C2 analysis identifies specific reconstructions. Forbidden moves: 'this translation is inaccurate' bare claim — accuracy assumes single correct version, naive. 'Lost in translation' bare invocation — stops analysis where it should start. Required: every translation comparison anchored in specific text, specific edition, specific page. Critic to study: ベンヤミン (in Japanese trans.), ベルマン『翻訳の批判に向けて』, ヴェヌティ『翻訳者の不可視性』, 柳父章, 池澤夏樹.",
  idiom_glosses: [
    { idiom: "他者の試練 (たしゃのしれん)", literal: "Thử thách của tha nhân", meaning: "[書き言葉] Berman's term in Japanese reception — translation as ethical confrontation với otherness; standard phrase trong Japanese translation theory.", example: "翻訳とはベルマンが申すところの「他者の試練」であり、自言語の自明性を不断に撹乱する作業である。" },
    { idiom: "似て非なる (にてひなる)", literal: "Giống mà khác", meaning: "[文語・書き言葉] Resembling but not identical — phrase precise cho translations that surface-resemble but fundamentally differ.", example: "二つの英訳は似て非なるものであり、表面的類似の下に対極的翻訳哲学が潜んでいる。" },
    { idiom: "意訳 vs 直訳 (いやく / ちょくやく)", literal: "Dịch ý vs dịch chữ", meaning: "[書き言葉] Standard Japanese opposition trong translation discourse — though now problematized as oversimplifying.", example: "意訳と直訳の二項対立は、現代翻訳論においてはもはや有効な分析枠ではないと言えよう。" },
    { idiom: "翻訳調 (ほんやくちょう)", literal: "Giọng văn dịch", meaning: "[書き言葉] 'Translationese' — distinctive prose style marked as translated; either weakness or aesthetic choice; can be analyzed both ways.", example: "村上春樹自身が、初期作品における翻訳調を意図的に採用したことを公言している。" }
  ],
  cultural_notes_vi: "Translation discourse ở Japan có 4 đặc thù distinguishing từ Western theory. (1) MEIJI INVENTION OF VOCABULARY — Japanese modernity literally invented through translation: kanji compounds 社会, 個人, 文化, 自由, 権利, 哲学 invented by Meiji translators (西周, 福沢諭吉, 中村正直). 柳父章 documents how translation shaped thought itself. C2 critic understands modern Japanese language is partly translation-residue. (2) MURAKAMI EFFECT — single contemporary writer reshapes how Japanese-to-English translation conceived. Murakami self-translates, edits his own English versions, has long-term relationships với specific translators. Translation đã become explicit subject của his fiction. International Murakami không identical với Japanese Murakami — phenomenon worth analytic attention. (3) ANIME/MANGA TRANSLATION — massive scale translation industry (manga, anime subbing/dubbing, light novel translation) creates parallel translation discourse outside academic 文学翻訳. Fan translation (scanlation, fansub) competes với official translation. C2 critic biết both ecosystems exist. (4) JAPANESE INTO ENGLISH ASYMMETRY — far more Japanese works translated into English than English into Japanese (literarily). Yet Japanese translation pedagogy still emphasizes English-into-Japanese (university courses train this direction). Asymmetry rarely problematized. Khác VN: VN translation pedagogy heavily French + Russian via Soviet era, recently English. Japanese translation theory primarily German philology + French theory + American cultural studies. Theoretical reference frames different. Mẹo: nếu bạn analyze translation, ALWAYS specify edition + translator + year. 'The English translation' ambiguous — there may be 2-3 different ones. Mẹo về self-translation — Murakami, Tawada, Mizumura write trong multiple languages và self-translate / co-translate. Self-translation problematizes author/translator distinction. Critical topic. Mẹo về translation theory in Japanese reception — German tradition (Schleiermacher, Benjamin) deeply absorbed. French (Berman, Meschonnic) more recent. American (Venuti) primary contemporary reference. Lawrence Venuti's books all translated trong Japanese; major 翻訳論 references. Mẹo cuối: translation criticism essays in Japan often address single author across multiple translators. Less common: comparing multiple authors' translations into one language. Either approach valid; choose based on research question.",
  tip_advice_vi: "Workflow translation comparison C2 cho seminar / luận văn. (a) ASSEMBLE CORPUS — gather (1) source text in original, (2) all available translations với edition info, (3) any translator's prefaces / afterwords / interviews. Translator paratexts often reveal philosophy. (b) SELECT PASSAGES — choose 3-5 passages strategically: opening (sets reader expectation), one culturally-loaded scene, one stylistically-distinctive scene (heavy metaphor / unusual syntax), closing. ~500 từ each. Aligned passages enable line-by-line. (c) MICRO-COMPARE — line by line table: source / translation A / translation B / your annotation. Mark every divergence: lexical (word choice), syntactic (sentence structure), register (formal/informal shift), addition (translator inserted), omission (translator dropped). (d) PATTERN-IDENTIFY — across passages, do divergences cluster? Translator A consistently raises register; B consistently shortens sentences. Pattern reveals strategy. (e) HISTORICIZE — what era was translation produced? What were dominant translation norms then? What was reception culture's expectation of source culture? Berman/Venuti theoretical anchors. (f) STAKES-ARTICULATE — what does this translation difference DO? Constructs different author-image? Different reading experience? Reaches different audience? Stakes claim makes paper substantive. Mẹo về translator paratexts — translators' prefaces are gold mine. Modern translators (Rubin, Tyler, Gabriel, Goldstein, Powell) write substantially về their philosophy. Cite. Reveals self-understanding. Mẹo về citation — translation paper cite (1) translator paratexts, (2) one translation theorist (Berman / Venuti / Benjamin), (3) one Japanese translation history work (柳父章), (4) original-text scholar. Quadruple anchoring. Mẹo về controversial readings — claiming một celebrated translation 'distorts' source text is publishable IF carefully evidenced. Translation community defensive về established translators. Reviewer scrutiny intense. Mẹo về self-translation case — analyzing Tawada's bilingual writing or Murakami's self-translation requires bilingual analysis showing both versions. Single-language analysis insufficient. Mẹo cuối: read recently published translation criticism trong target Japanese journal (e.g., 翻訳研究, 比較文学研究) trước viết. Convention dày đặc. Mismatch convention = desk reject regardless of insight quality.",
  exercises: [
    { type: "fill-blank", question: "翻訳とはベルマンが申すところの「他者の___」であり、自言語の自明性を不断に撹乱する作業である。", answer: "試練" },
    { type: "matching", instruction: "Ghép term với theorist.", pairs: [
      { japanese: "ドメスティケーション/フォリナイゼーション", english: "Venuti — domestication / foreignization opposition" },
      { japanese: "純粋言語", english: "Benjamin — pure language" },
      { japanese: "他者の試練", english: "Berman — trial of the other" },
      { japanese: "翻訳語成立事情", english: "Yanabu Akira — Meiji translation invented modern Japanese" }
    ] },
    { type: "translation", vietnamese: "Trong các bản dịch tiếng Anh của Murakami Haruki — bản của Rubin và bản của Gabriel — chính lựa chọn về văn phong đã chi phối sự kiến tạo hình ảnh Murakami.", japanese: "村上春樹の英訳——ルービン訳とゲイブリエル訳——においては、文体の選択そのものが村上像の構築を左右している。" }
  ]
},
{
  id: 107,
  title: "Literary criticism — biographical context vs the text",
  title_vi: "Phê bình văn học — Bối cảnh tiểu sử tác giả đối lại văn bản",
  title_en: "Literary criticism — biographical context vs the text",
  category: "literary-criticism",
  level: "C2",
  vocabulary: [
    { japanese: "伝記 (でんき)", english: "biography" },
    { japanese: "伝記的読解 (でんきてきどっかい)", english: "biographical reading" },
    { japanese: "作者の死 (さくしゃのし)", english: "death of the author" },
    { japanese: "作家論 (さっかろん)", english: "author-study" },
    { japanese: "作品論 (さくひんろん)", english: "work-study" },
    { japanese: "意図 (いと)", english: "intention" },
    { japanese: "意図主義の誤謬 (いとしゅぎのごびゅう)", english: "intentional fallacy" },
    { japanese: "テクスト論 (てくすとろん)", english: "text-theory / textualism" },
    { japanese: "実証主義 (じっしょうしゅぎ)", english: "positivism" },
    { japanese: "私小説性 (ししょうせつせい)", english: "I-novel-ness" }
  ],
  examples: [
    { japanese: "バルトの「作者の死」以降、作家の伝記をテクスト解釈の根拠とする手法は、原則として批判の対象となってきた。", english: "Since Barthes's 'Death of the Author,' the method of grounding text interpretation in the writer's biography has, in principle, become an object of criticism." },
    { japanese: "とはいえ、私小説の伝統が根強い日本文学においては、作家論の問題系は完全には消滅していない。", english: "That said, in Japanese literature, where the tradition of the I-novel runs deep, the problematic of author-study has not completely disappeared." },
    { japanese: "三島由紀夫の自決と作品との関連は、伝記的読解の最も鋭い問題例を提示する。", english: "The connection between Mishima Yukio's suicide and his works presents the sharpest problematic case of biographical reading." },
    { japanese: "意図主義の誤謬とは、作家の意図を作品の意味の唯一の決定者と見なす立場の批判的呼称である。", english: "The intentional fallacy is the critical designation for the position that regards the writer's intention as the sole determinant of the work's meaning." },
    { japanese: "作家の伝記的事実を完全に括弧に入れることは、必ずしも知的に誠実な態度とは言えない。", english: "To completely bracket the writer's biographical facts cannot necessarily be called an intellectually sincere stance." },
    { japanese: "問題は、伝記をいかに用いるかであって、伝記を用いるか否かではない。", english: "The question is how to use biography, not whether to use it." }
  ],
  dialogue: [
    { speaker: "院生", japanese: "三島の「豊饒の海」を分析する際、自決という伝記的事実を、いかに取り扱うべきでしょうか。", english: "When analyzing Mishima's 'Sea of Fertility,' how should one handle the biographical fact of his suicide?" },
    { speaker: "指導教員", japanese: "完全に無視することも、過度に依拠することも、いずれも誤りでしょう。自決は作品解釈の鍵ではなく、作品が提起する問題の一つの帰結として位置づけるべきです。", english: "Both completely ignoring it and excessively relying on it would be errors. The suicide should be positioned not as the key to interpreting the works but as one consequence of the questions the works raise." },
    { speaker: "院生", japanese: "つまり、伝記が作品を説明するのではなく、作品が伝記を説明する——という方向の読みも可能、ということでしょうか。", english: "In other words, not biography explaining the works but a reading in the direction of works explaining biography is also possible?" },
    { speaker: "指導教員", japanese: "そのとおり。両者の関係を一方向的因果として捉えるのではなく、相互照射の場として捉え直す必要があります。", english: "Exactly. There is a need to re-grasp the relationship between the two not as one-directional causality but as a site of mutual illumination." }
  ],
  dialogue_long: [
    { speaker: "院生", japanese: "本日は、太宰治の作品解釈における伝記的読解の問題について、ご相談させていただきたく存じます。「人間失格」を太宰の自伝的告白として読む立場と、純粋にフィクションとして読む立場との間で、いまだ立場を定められずにおります。", english: "Today I would like to consult about the problem of biographical reading in interpreting the works of Dazai Osamu. Between the position of reading 'No Longer Human' as Dazai's autobiographical confession and the position of reading it purely as fiction, I have not yet been able to settle on a stance." },
    { speaker: "指導教員", japanese: "二項対立そのものが問題かもしれません。太宰の場合、作品と伝記は意図的に重ね合わされるよう構築されている。完全な分離も完全な同一視も、テクストの構造的特徴を取り逃がしてしまう。", english: "The very binary opposition may be the problem. In Dazai's case, the work and the biography are intentionally constructed to be overlaid. Both complete separation and complete identification let slip the structural features of the text." },
    { speaker: "院生", japanese: "つまり、作品自体が、自伝的読みを誘発する形式として書かれている、ということですね。", english: "In other words, the work itself is written in a form that induces autobiographical reading." },
    { speaker: "指導教員", japanese: "そうです。「人間失格」の手記体形式、序文と後記の額縁構造、主人公「葉蔵」と作家「太宰」の表面的類似——これらすべてが、読者に伝記的同一視を誘導する装置として機能しています。", english: "Yes. The memoir-form of 'No Longer Human,' the frame structure of preface and afterword, the surface resemblance between the protagonist 'Yōzō' and the author 'Dazai' — all of these function as devices inducing the reader to biographical identification." },
    { speaker: "院生", japanese: "とすれば、伝記的読解を全否定する立場は、作品が仕掛けた読みの誘導装置を見落とすことになる、と。", english: "If so, the position of completely denying biographical reading ends up missing the reading-inducement devices that the work has set up." },
    { speaker: "指導教員", japanese: "そのとおり。バルトの「作者の死」は理論的には正当ですが、私小説伝統の中で書かれた日本近代文学のテクストに機械的に適用すれば、テクストの内的構造を逆に見えなくしてしまう。バルト的テクスト論を踏まえつつ、私小説性そのものの分析装置に転化する必要があります。", english: "Exactly. Barthes's 'Death of the Author' is theoretically justified, but mechanically applying it to texts of modern Japanese literature written within the I-novel tradition paradoxically renders the internal structure of the text invisible. Building on Barthes's textual theory, there is a need to transform it into an analytical apparatus for I-novel-ness itself." },
    { speaker: "院生", japanese: "私小説性を、作家の真実性の問題ではなく、テクストの形式的特徴として再定義する——という方向でしょうか。", english: "To redefine I-novel-ness not as a question of the writer's authenticity but as a formal feature of the text — is that the direction?" },
    { speaker: "指導教員", japanese: "そう。鈴木登美の「物語られた自己」研究が、この方向を切り開きました。私小説を「真正な告白」として読むのでも、「単なるフィクション」として読むのでもなく、「自伝性を構築する形式装置」として分析する。これが、二項対立を超える第三の道です。", english: "Yes. Suzuki Tomi's study 'Narrating the Self' opened up this direction. Reading the I-novel neither as 'authentic confession' nor as 'mere fiction' but analyzing it as 'a formal device that constructs autobiographicality.' This is the third way that exceeds the binary opposition." },
    { speaker: "院生", japanese: "誠に有益なご教示でございます。鈴木登美の研究を起点に、太宰の手記体形式を詳細に分析する形で、論を再構築してまいります。", english: "Most beneficial instruction. Taking Suzuki Tomi's study as the starting point, I will reconstruct the argument in the form of detailed analysis of Dazai's memoir-form." },
    { speaker: "指導教員", japanese: "鈴木の他、加藤典洋の太宰論、奥野健男の伝記研究も並行して読まれることを推奨します。各立場の系譜を踏まえた上で、自身の立場を構築できるはずです。", english: "Besides Suzuki, I recommend reading in parallel Katō Norihiro's Dazai study and Okuno Takeo's biographical research. Building on the genealogy of each position, you should be able to construct your own stance." },
    { speaker: "院生", japanese: "肝に銘じます。三者の系譜を整理し、自身の理論的立場を明示した上で、テクスト分析に入る構成といたします。", english: "I take that to heart. Organizing the genealogy of the three, after explicitly stating my own theoretical stance, I will proceed to textual analysis." }
  ],
  roleplay_prompts: [
    "Bạn navigate biography vs text question cho thesis defense. Cụm: 問題は、伝記をいかに用いるかであって、伝記を用いるか否かではない. KHÔNG flat reject biography (naive Barthean) hay flat accept (naive positivist) — articulate third position.",
    "Bạn defend rằng I-novel form itself induces biographical reading. Phương pháp: identify formal devices (memoir form, preface frames, name overlap) làm work that inducement. Cụm: 作品自体が伝記的読解を誘発する装置として書かれている. Form-functional analysis.",
    "Bạn invoke Suzuki Tomi to escape author/work binary. Cụm: 私小説を真正な告白でもフィクションでもなく、自伝性を構築する形式装置として分析する. Frame as third way beyond positivism/textualism."
  ],
  register_notes: "Author-text relation criticism ở C2 Japanese requires navigating 4-way debate. (1) 実証主義的伝記研究 — older generation positivist biography (奥野健男 cho 太宰, 江藤淳 cho 漱石). Hunts archives, letters, diaries. Treats biography as explaining work. Now considered methodologically naive but historically essential — provides factual foundation. (2) フランス現代思想由来テクスト論 — Barthes 「作者の死」, Foucault 「作者とは何か」, Derrida 'differance'. Brackets biography entirely. Imported into Japan 1980s primarily through 蓮實重彦, 柄谷行人. Methodological purity but risks losing texts that themselves invoke biography. (3) 新歴史主義 (New Historicism, Greenblatt) — re-introduces context không as biography but as cultural-historical formation. Less prominent in Japan than in US, but growing. 渡部直己, 高橋源一郎 essays adjacent. (4) 私小説形式論 — Japanese-specific third way developed Suzuki Tomi (鈴木登美) 'Narrating the Self', 安藤宏 私小説 studies. Analyzes I-novel form's autobiographicality-construction as object, không takes side trên author/text binary. C2 critic must position self vis-à-vis all four. Complete neutrality impossible; explicit stance required. Analytical moves. (1) BIOGRAPHICAL FACT VS BIOGRAPHICAL READING — distinguish: facts (X was born Y, married Z) vs reading (work means X because author experienced Y). Latter contestable; former usually not. (2) FRAMING DEVICES — when work itself invokes biography (preface signed by author claiming authenticity, memoir form, names overlapping), treat invocation itself as analytic object — not as license for biographical equation. (3) DIRECTION OF EXPLANATION — usually assumed: biography → work. C2 critic considers reverse: work → biographical interpretation, work → biographical action (Mishima case). Bidirectionality. (4) HISTORICITY OF AUTHOR-FUNCTION — Foucault's argument: 'author' historically constituted role, varies by era / culture / genre. Japanese case: 19th century 'author' construction differs from Heian-era anonymous tale-writers, differs from contemporary multi-platform writer. C2 historicizes. Vocabulary forbidden ở author-criticism: 'the author meant' bare claim — assumes intentionalist position uncritically; 'the author's life shows' bare claim — direct biographical reading without methodological warrant; 'we can't know what author meant' bare disclaimer — refuses analytic engagement. Required: explicit methodological position trên author/text relation, sustained throughout analysis. Critic to read: バルト「作者の死」, フーコー「作者とは何か」, 鈴木登美『物語られた自己』, 安藤宏 私小説 studies, 加藤典洋 (essays on author-text), 蓮實重彦 (anti-biographical reading), 江藤淳 (biographical research, methodologically older but historically important).",
  idiom_glosses: [
    { idiom: "意図せざる結果 (いとせざるけっか)", literal: "Hậu quả không định trước", meaning: "[書き言葉] Unintended consequence — useful phrase challenging strict intentionalist reading; works may mean beyond author's stated intent.", example: "テクストの意味は、作家の意図せざる結果として読者の読みの中で生成される側面を持つ。" },
    { idiom: "巨匠 (きょしょう)", literal: "Đại sư phụ", meaning: "[書き言葉] Master / great figure — institutional designation; analyzing how authors achieve 巨匠 status is itself critical project.", example: "三島が「巨匠」として確立される過程は、作品の質のみならず、自決という伝記的事件によっても媒介されている。" },
    { idiom: "私小説 (ししょうせつ)", literal: "Tiểu thuyết tôi", meaning: "[書き言葉] I-novel — Japanese genre; institutional construction problematized by Suzuki Tomi but still operative as critical category.", example: "私小説の伝統は、日本近代文学における作者と作品の関係を西欧と異なる形で構造化してきた。" },
    { idiom: "三つ子の魂百まで (みつごのたましいひゃくまで)", literal: "Hồn của trẻ ba tuổi đến trăm tuổi", meaning: "[書き言葉・話し言葉] Childhood character lasts a lifetime — phrase often invoked trong biographical criticism, itself worth interrogating.", example: "三つ子の魂百までと申すが、作家の幼年体験を作品解釈の決定要因とする読みには、慎重を期する必要がある。" }
  ],
  cultural_notes_vi: "Author-text question ở Japanese tradition has 4 distinguishing features. (1) 私小説 INSTITUTIONAL FORCE — Japanese modern literary criticism developed concurrently với 私小説 emergence. Biographical reading not imported error but constitutive of Japanese literary criticism's origin. Reading Dazai purely textually feels artificial; reading 漱石 purely biographically feels naive. Calibration required. (2) AUTHOR-AS-PUBLIC-FIGURE — Japanese authors traditionally maintained public personas through essays, public statements, scandals. 三島's body-building, public political statements, ritualistic suicide make text-only reading nearly impossible. 太宰's suicide attempts, drug use, family dramas recursively shape work reception. Authors were/are public spectacles. (3) ANONYMOUS CLASSICAL TRADITION — pre-modern Japanese literature largely anonymous (源氏物語, 平家物語 attributed but contested). Modern 'author' concept itself imported. C2 critic understands historical specificity của author-function. (4) DAZAI/MISHIMA EXTREMES — these two authors so heavily biographized that pure text-reading practically requires explicit methodological argument. Most other authors permit more flexible approaches. Genre-author specific calibration needed. Khác VN: VN literary criticism heavily biographical (especially trong educational context), often equating authors với works. Japanese tradition contains both poles và sophisticated middle positions. Mẹo: nếu bạn analyze Dazai/Mishima/三島, MUST address biographical question explicitly trong introduction. Cannot ignore. Mẹo: nếu bạn analyze younger contemporary authors (Kawakami, Murata), biographical reading less established — more interpretive freedom. Mẹo về author interviews — contemporary Japanese authors give substantial interviews. Citing interviews methodologically distinct from citing biographical facts. Author interview = author's authorized self-interpretation, itself critical object. Mẹo về 全集 (collected works) editions — Japanese tradition publishes extensive 全集 với letters, diaries, drafts, marginalia. Goldmine cho biographical research. But — methodological caution: drafts ≠ final intent. Mẹo cuối: position vis-à-vis Suzuki Tomi's 私小説 critique trong any Dazai/Shiga/Tayama paper. Suzuki's intervention so influential rằng ignoring her position signals methodological gap. Either accept, modify, hoặc dispute — but engage.",
  tip_advice_vi: "Workflow author-text criticism C2 Japanese cho luận văn / book review. (a) STATE METHODOLOGICAL POSITION EARLY — opening section explicitly: 'In this paper I take position X regarding the author-text relation, on grounds Y'. Methodological transparency mandatory at C2. (b) DISTINGUISH FACT FROM READING — biographical facts (when uncontested) usable as background. Biographical readings (claims about meaning) require methodological warrant. Don't conflate. (c) IDENTIFY WORK'S BIOGRAPHICAL FRAMING DEVICES — does work invoke author? (preface signed by author claiming authenticity, memoir form, character named after author, real-named historical figures appearing). Analyze framing as device, không as license. (d) HISTORICIZE AUTHOR-FUNCTION — what was 'author' status in this work's historical moment? 太宰 1948 differs from 村上 2024. Different author-roles, different reader-expectations. (e) BIDIRECTIONAL ANALYSIS — usually biography → work. Sometimes more revealing: work → biography (work generates author's later life trajectory: Mishima case), work → reading-of-biography (work reshapes how readers understand biography retrospectively). Asymmetric directions illuminating. (f) AVOID INTENTIONAL CLAIMS — không 'author intended X' claims unless documented (author statement). Replace với 'work performs X' claims, structural rather than intentional. Mẹo về citation pattern — author-text paper cite (1) one French theorist (Barthes / Foucault / Derrida — usually Barthes 'Death of the Author' Japanese translation), (2) one Japanese intervention (鈴木登美, 安藤宏, 加藤典洋), (3) author's own essays / interviews as primary material, (4) at least one biographical study (even if to disagree). Quadruple grounding. Mẹo về controversial readings — argue against established biographical reading is publishable IF marshal evidence. E.g., arguing Mishima's suicide không 'explains' Sea of Fertility — work has independent meaning structure. Defensible với care. Mẹo về author interviews — citing as evidence requires care. Author may dissemble, change position, perform persona. Treat author interviews as themselves texts requiring interpretation, không as transparent windows on intent. Mẹo về 全集 use — collected works' apparatus (footnotes, headnotes by editors) often contain valuable biographical contextualization. Cite editor's apparatus separately từ author's text. Mẹo cuối: in author-text criticism, eclecticism methodologically defensible IF justified. Pure Bartheanism rare; pure positivism rarer; most mature work navigates between. Articulate where you stand without absolutism.",
  exercises: [
    { type: "fill-blank", question: "問題は、伝記をいかに用いるかであって、伝記を用いるか___ではない。", answer: "否か" },
    { type: "matching", instruction: "Ghép concept với theorist / Japanese critic.", pairs: [
      { japanese: "作者の死", english: "Barthes — Death of the Author" },
      { japanese: "作者とは何か", english: "Foucault — author-function essay" },
      { japanese: "物語られた自己", english: "Suzuki Tomi — I-novel as constructed form" },
      { japanese: "意図主義の誤謬", english: "Wimsatt-Beardsley — intentional fallacy" }
    ] },
    { type: "translation", vietnamese: "Việc đặt hoàn toàn các sự kiện tiểu sử của tác giả vào ngoặc đơn không nhất thiết là một thái độ trí tuệ thành thực.", japanese: "作家の伝記的事実を完全に括弧に入れることは、必ずしも知的に誠実な態度とは言えない。" }
  ]
}
];
export default lessons;
