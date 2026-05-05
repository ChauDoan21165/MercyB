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
}
];
export default lessons;
