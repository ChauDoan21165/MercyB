export const lessons = [
  {
    id: 1,
    title: "Hiragana Introduction",
    level: "beginner",
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
    ]
  },
  {
    id: 2,
    title: "Katakana Introduction",
    level: "beginner",
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
    ]
  },
  {
    id: 3,
    title: "Basic Greetings",
    level: "beginner",
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
    ]
  },
  {
    id: 4,
    title: "Self Introduction",
    level: "beginner",
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
    ]
  },
  {
    id: 5,
    title: "Numbers 1–10",
    level: "beginner",
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
    ]
  },
  {
    id: 6,
    title: "Counting Objects",
    level: "beginner",
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
    ]
  },
  {
    id: 7,
    title: "Days of the Week",
    level: "beginner",
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
    ]
  },
  {
    id: 8,
    title: "Months of the Year",
    level: "beginner",
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
    ]
  },
  {
    id: 9,
    title: "Telling Time",
    level: "beginner",
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
    ]
  },
  {
    id: 10,
    title: "Asking for Directions",
    level: "beginner",
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
    ]
  },
  {
    id: 11,
    title: "Ordering Food",
    level: "beginner",
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
    ]
  },
  {
    id: 12,
    title: "Shopping Phrases",
    level: "beginner",
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
    ]
  },
  {
    id: 13,
    title: "Family Members",
    level: "beginner",
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
    ]
  },
  {
    id: 14,
    title: "Colors",
    level: "beginner",
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
    ]
  },
  {
    id: 15,
    title: "I-Adjectives (Present Tense)",
    level: "beginner",
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
    ]
  },
  {
    id: 16,
    title: "Na-Adjectives (Present Tense)",
    level: "beginner",
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
    ]
  },
  {
    id: 17,
    title: "Verbs: Present Tense (Masu-form)",
    level: "beginner",
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
    ]
  },
  {
    id: 18,
    title: "Verbs: Past Tense (Masu-form)",
    level: "beginner",
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
    ]
  },
  {
    id: 19,
    title: "Particles: は, が, を",
    level: "beginner",
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
    ]
  },
  {
    id: 20,
    title: "Te-Form Basics",
    level: "beginner",
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
    ]
  },
{
    "id": 21,
    "title": "Making phone calls (でんわをかける)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "でんわ", "english": "telephone", "vietnamese": "điện thoại" },
      { "japanese": "でんわばんごう", "english": "phone number", "vietnamese": "số điện thoại" },
      { "japanese": "かけなおす", "english": "to call again", "vietnamese": "gọi lại" },
      { "japanese": "りゅうご", "english": "answering machine/message", "vietnamese": "thư thoại" },
      { "japanese": "しょうしょうおまちください", "english": "please hold on", "vietnamese": "xin vui lòng chờ một chút" },
      { "japanese": "せきにんしゃ", "english": "person in charge", "vietnamese": "người phụ trách" },
      { "japanese": "でんわをきる", "english": "to hang up", "vietnamese": "gác máy" },
      { "japanese": "でんわをかける", "english": "to make a phone call", "vietnamese": "gọi điện thoại" },
      { "japanese": "まちがえる", "english": "to make a mistake", "vietnamese": "nhầm lẫn" },
      { "japanese": "でんわちょう", "english": "telephone directory", "vietnamese": "danh bạ điện thoại" }
    ],
    "grammar": [
      { "point": "～ていただけますか", "explanation": "Polite request form: 'Could you please do ~ for me?' Used in phone conversations to ask someone to do something politely." },
      { "point": "～と申します", "explanation": "Humble form of '～と言います' (I am called ~). Used on the phone when introducing yourself." }
    ],
    "examples": [
      { "japanese": "すみません、もう一度お願いできますか。", "english": "Excuse me, could you say that again?", "vietnamese": "Xin lỗi, bạn có thể nói lại một lần nữa được không?" },
      { "japanese": "田中と申しますが、山田さんはいらっしゃいますか。", "english": "My name is Tanaka. Is Mr. Yamada available?", "vietnamese": "Tôi là Tanaka. Anh Yamada có ở đó không ạ?" },
      { "japanese": "少々お待ちください。", "english": "Please hold on a moment.", "vietnamese": "Xin vui lòng chờ một chút." },
      { "japanese": "電車の中なので、後でかけなおします。", "english": "I'm on the train, so I'll call you back later.", "vietnamese": "Tôi đang ở trên tàu, nên tôi sẽ gọi lại sau." },
      { "japanese": "間違えました、すみません。", "english": "I made a mistake, I'm sorry.", "vietnamese": "Tôi đã nhầm, xin lỗi." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "もしもし、田中ですが、山田さんをお願いします。", "english": "Hello, this is Tanaka. May I speak to Mr. Yamada?" },
      { "speaker": "B", "japanese": "少々お待ちください。代わります。", "english": "Please hold on. I'll put you through." },
      { "speaker": "A", "japanese": "ありがとうございます。", "english": "Thank you." },
      { "speaker": "B", "japanese": "申し訳ございません、ただいま席を外しております。", "english": "I'm sorry, he's not at his desk right now." }
    ],
    "exercises": [
      "Fill-blank: もしもし、____と申しますが、鈴木さんはいらっしゃいますか。",
      "Matching: Match the Japanese phrases: 1. 代わります 2. 席を外す a. to be away from desk b. to put through",
      "Translation: Translate 'Could you please call me back?' into Japanese."
    ]
  },
  {
    "id": 22,
    "title": "Writing emails (メールをかく)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "メール", "english": "email", "vietnamese": "thư điện tử" },
      { "japanese": "けんめい", "english": "subject line", "vietnamese": "tiêu đề" },
      { "japanese": "さくせいする", "english": "to compose", "vietnamese": "soạn thảo" },
      { "japanese": "そうしんする", "english": "to send", "vietnamese": "gửi" },
      { "japanese": "じゅしんする", "english": "to receive", "vietnamese": "nhận" },
      { "japanese": "へんしん", "english": "reply", "vietnamese": "hồi âm" },
      { "japanese": "てんぷファイル", "english": "attached file", "vietnamese": "tệp đính kèm" },
      { "japanese": "かくにん", "english": "confirmation", "vietnamese": "xác nhận" },
      { "japanese": "おそれいりますが", "english": "I'm sorry to trouble you, but", "vietnamese": "xin lỗi vì đã làm phiền" },
      { "japanese": "よろしくおねがいします", "english": "best regards / thank you in advance", "vietnamese": "xin cảm ơn / mong được giúp đỡ" }
    ],
    "grammar": [
      { "point": "～させていただきます", "explanation": "Humble expression meaning 'I will humbly do ~'. Used in formal emails to politely announce an action." },
      { "point": "～ております", "explanation": "Polite continuous form of '～ている'. Used in formal writing to describe ongoing states." }
    ],
    "examples": [
      { "japanese": "件名：会議の日程について", "english": "Subject: Regarding the meeting schedule", "vietnamese": "Tiêu đề: Về lịch họp" },
      { "japanese": "先日はお世話になりました。", "english": "Thank you for your help the other day.", "vietnamese": "Cảm ơn sự giúp đỡ của bạn hôm trước." },
      { "japanese": "資料を添付させていただきます。", "english": "I am enclosing the document.", "vietnamese": "Tôi xin gửi kèm tài liệu." },
      { "japanese": "ご確認のほど、よろしくお願いいたします。", "english": "I would appreciate your confirmation.", "vietnamese": "Kính mong quý vị xác nhận." },
      { "japanese": "以上、よろしくお願い申し上げます。", "english": "That is all. Best regards.", "vietnamese": "Trên đây là nội dung, trân trọng cảm ơn." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "メールが届きましたか。", "english": "Did you receive my email?" },
      { "speaker": "B", "japanese": "はい、さっき確認しました。件名が分かりやすかったです。", "english": "Yes, I just checked it. The subject line was clear." },
      { "speaker": "A", "japanese": "添付ファイルは見られましたか。", "english": "Could you see the attached file?" },
      { "speaker": "B", "japanese": "はい、大丈夫でした。ありがとうございます。", "english": "Yes, it was fine. Thank you." }
    ],
    "exercises": [
      "Fill-blank: 件名：来週の____について（日程）",
      "Matching: Match the email sections: 1. 宛先 2. 件名 3. 本文 a. body b. recipient c. subject",
      "Translation: Translate 'I will send you the report by tomorrow.' into Japanese."
    ]
  },
  {
    "id": 23,
    "title": "At the bank (ぎんこうで)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "ぎんこう", "english": "bank", "vietnamese": "ngân hàng" },
      { "japanese": "こうざ", "english": "account", "vietnamese": "tài khoản" },
      { "japanese": "こうざをひらく", "english": "to open an account", "vietnamese": "mở tài khoản" },
      { "japanese": "おろす", "english": "to withdraw (money)", "vietnamese": "rút tiền" },
      { "japanese": "あずける", "english": "to deposit (money)", "vietnamese": "gửi tiền" },
      { "japanese": "つうちょう", "english": "bankbook", "vietnamese": "sổ ngân hàng" },
      { "japanese": "キャッシュカード", "english": "cash card", "vietnamese": "thẻ ATM" },
      { "japanese": "りそく", "english": "interest", "vietnamese": "lãi suất" },
      { "japanese": "てすうりょう", "english": "fee / commission", "vietnamese": "phí giao dịch" },
      { "japanese": "そうだんする", "english": "to consult / discuss", "vietnamese": "tư vấn" }
    ],
    "grammar": [
      { "point": "～たいのですが", "explanation": "Expression of desire: 'I want to do ~'. Commonly used at a bank to state your purpose politely." },
      { "point": "～ていただけますか", "explanation": "Polite request: 'Could you please do ~ for me?' Used to ask the bank staff for service." }
    ],
    "examples": [
      { "japanese": "口座を開きたいのですが。", "english": "I'd like to open an account.", "vietnamese": "Tôi muốn mở một tài khoản." },
      { "japanese": "お金を下ろしたいです。", "english": "I want to withdraw money.", "vietnamese": "Tôi muốn rút tiền." },
      { "japanese": "キャッシュカードを作りたいのですが。", "english": "I'd like to get a cash card.", "vietnamese": "Tôi muốn làm thẻ ATM." },
      { "japanese": "通帳をなくしました。再発行できますか。", "english": "I lost my bankbook. Can you reissue it?", "vietnamese": "Tôi bị mất sổ ngân hàng. Có thể cấp lại được không?" },
      { "japanese": "手数料はいくらですか。", "english": "How much is the fee?", "vietnamese": "Phí giao dịch là bao nhiêu?" }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "すみません、口座を開きたいのですが。", "english": "Excuse me, I'd like to open an account." },
      { "speaker": "B", "japanese": "かしこまりました。身分証明書をお持ちですか。", "english": "Certainly. Do you have ID?" },
      { "speaker": "A", "japanese": "はい、パスポートです。", "english": "Yes, here is my passport." },
      { "speaker": "B", "japanese": "ありがとうございます。少々お待ちください。", "english": "Thank you. Please wait a moment." }
    ],
    "exercises": [
      "Fill-blank: お金を____たいのですが（あずける）。",
      "Matching: Match bank terms: 1. 利息 2. 手数料 3. 残高 a. balance b. interest c. fee",
      "Translation: Translate 'I want to transfer money to another account.' into Japanese."
    ]
  },
  {
    "id": 24,
    "title": "At the post office (ゆうびんきょくで)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "ゆうびんきょく", "english": "post office", "vietnamese": "bưu điện" },
      { "japanese": "きって", "english": "stamp", "vietnamese": "tem" },
      { "japanese": "はがき", "english": "postcard", "vietnamese": "bưu thiếp" },
      { "japanese": "こづつみ", "english": "parcel", "vietnamese": "bưu kiện" },
      { "japanese": "かきとめ", "english": "registered mail", "vietnamese": "thư bảo đảm" },
      { "japanese": "ゆうそうりょう", "english": "postage", "vietnamese": "cước phí" },
      { "japanese": "くにつき", "english": "by airmail", "vietnamese": "gửi hàng không" },
      { "japanese": "ふなづみ", "english": "by sea mail", "vietnamese": "gửi đường biển" },
      { "japanese": "おもさ", "english": "weight", "vietnamese": "trọng lượng" },
      { "japanese": "おくる", "english": "to send", "vietnamese": "gửi" }
    ],
    "grammar": [
      { "point": "～でお願いします", "explanation": "'Please do it by ~'. Used to specify the method (airmail, registered, etc.) when sending mail." },
      { "point": "～はいくらですか", "explanation": "'How much is ~?' Useful for asking postage or the price of stamps/postcards." }
    ],
    "examples": [
      { "japanese": "この手紙を航空便でお願いします。", "english": "Please send this letter by airmail.", "vietnamese": "Làm ơn gửi bức thư này bằng đường hàng không." },
      { "japanese": "小包をアメリカに送りたいです。", "english": "I want to send a parcel to the USA.", "vietnamese": "Tôi muốn gửi một bưu kiện sang Mỹ." },
      { "japanese": "切手を5枚ください。", "english": "Please give me five stamps.", "vietnamese": "Làm ơn cho tôi 5 con tem." },
      { "japanese": "書留にすると料金はいくらですか。", "english": "How much is it if I send it registered?", "vietnamese": "Nếu gửi bảo đảm thì phí là bao nhiêu?" },
      { "japanese": "重さを測ってもらえますか。", "english": "Can you weigh it for me?", "vietnamese": "Bạn có thể cân nó giúp tôi được không?" }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "すみません、この小包をベトナムに送りたいです。", "english": "Excuse me, I want to send this parcel to Vietnam." },
      { "speaker": "B", "japanese": "航空便と船便がありますが、どちらになさいますか。", "english": "We have airmail and sea mail. Which would you like?" },
      { "speaker": "A", "japanese": "航空便でお願いします。料金はいくらですか。", "english": "Airmail, please. How much is it?" },
      { "speaker": "B", "japanese": "1500円です。こちらに宛先をご記入ください。", "english": "It's 1500 yen. Please write the address here." }
    ],
    "exercises": [
      "Fill-blank: この手紙を____便でお願いします（ふな）。",
      "Matching: Match mail types: 1. 速達 2. 書留 3. 普通 a. regular b. express c. registered",
      "Translation: Translate 'I need to buy stamps for a postcard.' into Japanese."
    ]
  },
  {
    "id": 25,
    "title": "Renting an apartment (アパートをかりる)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "アパート", "english": "apartment", "vietnamese": "căn hộ" },
      { "japanese": "やちん", "english": "rent", "vietnamese": "tiền thuê nhà" },
      { "japanese": "まんしょん", "english": "condominium / mansion", "vietnamese": "chung cư cao cấp" },
      { "japanese": "しききん", "english": "deposit (key money)", "vietnamese": "tiền đặt cọc" },
      { "japanese": "れいきん", "english": "gratuity money (non-refundable)", "vietnamese": "tiền cảm ơn (không hoàn lại)" },
      { "japanese": "かいやく", "english": "cancellation of contract", "vietnamese": "hủy hợp đồng" },
      { "japanese": "ふろ", "english": "bath", "vietnamese": "phòng tắm" },
      { "japanese": "だんぼう", "english": "heating", "vietnamese": "hệ thống sưởi" },
      { "japanese": "いんかん", "english": "personal seal / stamp", "vietnamese": "con dấu cá nhân" },
      { "japanese": "ほしょうにん", "english": "guarantor", "vietnamese": "người bảo lãnh" }
    ],
    "grammar": [
      { "point": "～たいのですが", "explanation": "'I would like to ~'. Used to express desire when beginning the rental process." },
      { "point": "～なければならない", "explanation": "'Must do ~'. Used to talk about necessary procedures such as contract signing or paying deposit." }
    ],
    "examples": [
      { "japanese": "アパートを借りたいのですが。", "english": "I'd like to rent an apartment.", "vietnamese": "Tôi muốn thuê một căn hộ." },
      { "japanese": "家賃はいくらですか。", "english": "How much is the rent?", "vietnamese": "Tiền thuê nhà là bao nhiêu?" },
      { "japanese": "敷金と礼金が必要ですか。", "english": "Are deposit and key money required?", "vietnamese": "Có cần tiền đặt cọc và tiền cảm ơn không?" },
      { "japanese": "保証人がいなければなりません。", "english": "You must have a guarantor.", "vietnamese": "Bạn phải có người bảo lãnh." },
      { "japanese": "契約は日本語でいいですか。", "english": "Is the contract in Japanese okay?", "vietnamese": "Hợp đồng bằng tiếng Nhật có được không?" }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "アパートを探しているんですが、空き室はありますか。", "english": "I'm looking for an apartment. Do you have any vacancies?" },
      { "speaker": "B", "japanese": "はい、いくつかあります。予算はどのくらいですか。", "english": "Yes, there are several. What's your budget?" },
      { "speaker": "A", "japanese": "6万円以下でお願いします。", "english": "Under 60,000 yen, please." },
      { "speaker": "B", "japanese": "こちらは5万8千円です。駅から徒歩5分です。", "english": "This one is 58,000 yen. It's a 5-minute walk from the station." }
    ],
    "exercises": [
      "Fill-blank: このアパートは____が高いですか（家賃）。",
      "Matching: Match rental terms: 1. 敷金 2. 礼金 3. 仲介手数料 a. agency fee b. deposit c. gratuity",
      "Translation: Translate 'I want to see the apartment first.' into Japanese."
    ]
  },
  {
    "id": 26,
    "title": "Complaints and returns (クレームとへんぴん)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "クレーム", "english": "complaint", "vietnamese": "khiếu nại" },
      { "japanese": "へんぴん", "english": "return (product)", "vietnamese": "trả hàng" },
      { "japanese": "こうかん", "english": "exchange", "vietnamese": "đổi hàng" },
      { "japanese": "しょうひん", "english": "product / merchandise", "vietnamese": "hàng hóa" },
      { "japanese": "きず", "english": "scratch / damage", "vietnamese": "vết xước" },
      { "japanese": "ふりょうひん", "english": "defective product", "vietnamese": "hàng lỗi" },
      { "japanese": "レシート", "english": "receipt", "vietnamese": "hóa đơn" },
      { "japanese": "ほしょうきかん", "english": "warranty period", "vietnamese": "thời hạn bảo hành" },
      { "japanese": "とりかえる", "english": "to replace", "vietnamese": "thay thế" },
      { "japanese": "あやまる", "english": "to apologize", "vietnamese": "xin lỗi" }
    ],
    "grammar": [
      { "point": "～ていただけませんか", "explanation": "Polite negative question: 'Could you not do ~?' or here more often 'Could you please do ~ for me?' Used to make requests in complaint situations." },
      { "point": "～てしまう", "explanation": "Expresses completion or regret. Used to say an action happened unfortunately, e.g., 'I ended up breaking it.'" }
    ],
    "examples": [
      { "japanese": "この商品、壊れています。交換していただけませんか。", "english": "This product is broken. Could you exchange it?", "vietnamese": "Sản phẩm này bị hỏng. Bạn có thể đổi cho tôi được không?" },
      { "japanese": "レシートをなくしてしまったんですが。", "english": "I lost the receipt, unfortunately.", "vietnamese": "Tôi đã làm mất hóa đơn mất rồi." },
      { "japanese": "傷があったので返品したいです。", "english": "There is a scratch, so I want to return it.", "vietnamese": "Có vết xước, nên tôi muốn trả hàng." },
      { "japanese": "保証期間中ですから無料で修理できます。", "english": "It's within the warranty period, so it can be repaired for free.", "vietnamese": "Vì còn trong thời hạn bảo hành nên có thể sửa miễn phí." },
      { "japanese": "大変申し訳ございません。すぐに新しいものとお取り替えします。", "english": "We are very sorry. We will replace it with a new one immediately.", "vietnamese": "Chúng tôi rất xin lỗi. Sẽ thay ngay bằng cái mới." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "すみません、先週買ったパソコンが動かないんです。", "english": "Excuse me, the computer I bought last week doesn't work." },
      { "speaker": "B", "japanese": "それは大変ですね。レシートはお持ちですか。", "english": "That's terrible. Do you have the receipt?" },
      { "speaker": "A", "japanese": "はい、あります。交換できますか。", "english": "Yes, I do. Can you exchange it?" },
      { "speaker": "B", "japanese": "保証期間内ですので、無料で交換いたします。", "english": "It's within the warranty, so we will exchange it free of charge." }
    ],
    "exercises": [
      "Fill-blank: この商品は____です。返品したいです（不良品）。",
      "Matching: Match complaint actions: 1. 返品 2. 交換 3. 修理 a. repair b. return c. exchange",
      "Translation: Translate 'I accidentally broke the glass. Can I get a refund?' into Japanese."
    ]
  },
  {
    "id": 27,
    "title": "Giving directions (みちあんない)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "みちあんない", "english": "giving directions", "vietnamese": "chỉ đường" },
      { "japanese": "まっすぐ", "english": "straight", "vietnamese": "thẳng" },
      { "japanese": "まがる", "english": "to turn", "vietnamese": "rẽ" },
      { "japanese": "こうさてん", "english": "intersection / crossing", "vietnamese": "ngã tư" },
      { "japanese": "しんごう", "english": "traffic light", "vietnamese": "đèn giao thông" },
      { "japanese": "かど", "english": "corner", "vietnamese": "góc phố" },
      { "japanese": "めじるし", "english": "landmark", "vietnamese": "điểm mốc" },
      { "japanese": "あるく", "english": "to walk", "vietnamese": "đi bộ" },
      { "japanese": "～ちゅう", "english": "on the way / on ~ street", "vietnamese": "trên đường ~" },
      { "japanese": "つく", "english": "to arrive", "vietnamese": "đến" }
    ],
    "grammar": [
      { "point": "～と～の間", "explanation": "'Between ~ and ~'. Used to describe location between two landmarks, e.g., 'between the station and the bank'." },
      { "point": "～を～てください", "explanation": "Polite command: 'Please do ~'. Used to give step-by-step directions." }
    ],
    "examples": [
      { "japanese": "まっすぐ行って、二つ目の信号を右に曲がってください。", "english": "Go straight, and turn right at the second traffic light.", "vietnamese": "Đi thẳng, rẽ phải ở đèn giao thông thứ hai." },
      { "japanese": "この道をまっすぐ行くと、左に郵便局があります。", "english": "If you go straight down this street, there is a post office on the left.", "vietnamese": "Đi thẳng đường này, bạn sẽ thấy bưu điện bên trái." },
      { "japanese": "交差点を渡ってください。", "english": "Please cross the intersection.", "vietnamese": "Hãy băng qua ngã tư." },
      { "japanese": "駅と銀行の間にあります。", "english": "It's between the station and the bank.", "vietnamese": "Nó nằm giữa ga và ngân hàng." },
      { "japanese": "あの青いビルが目印です。", "english": "That blue building is the landmark.", "vietnamese": "Tòa nhà màu xanh đó là điểm mốc." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "すみません、この近くにコンビニはありますか。", "english": "Excuse me, is there a convenience store near here?" },
      { "speaker": "B", "japanese": "ええと、この道をまっすぐ行って、最初の角を右に曲がってください。", "english": "Well, go straight down this road and turn right at the first corner." },
      { "speaker": "A", "japanese": "右に曲がってからどのくらいですか。", "english": "How far after turning right?" },
      { "speaker": "B", "japanese": "50メートルほど行くと、右手にあります。", "english": "After about 50 meters, it will be on your right." }
    ],
    "exercises": [
      "Fill-blank: 次の____を左に曲がってください（交差点）。",
      "Matching: Match direction phrases: 1. まっすぐ 2. 曲がる 3. 渡る a. to cross b. straight c. to turn",
      "Translation: Translate 'Turn left at the second corner.' into Japanese."
    ]
  },
  {
    "id": 28,
    "title": "Discussing news (ニュースをはなす)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "ニュース", "english": "news", "vietnamese": "tin tức" },
      { "japanese": "じけん", "english": "incident / accident", "vietnamese": "sự việc" },
      { "japanese": "さいがい", "english": "disaster", "vietnamese": "thảm họa" },
      { "japanese": "せいじ", "english": "politics", "vietnamese": "chính trị" },
      { "japanese": "けいざい", "english": "economy", "vietnamese": "kinh tế" },
      { "japanese": "いけん", "english": "opinion", "vietnamese": "ý kiến" },
      { "japanese": "はんだんする", "english": "to judge / decide", "vietnamese": "đánh giá" },
      { "japanese": "えいきょう", "english": "influence / effect", "vietnamese": "ảnh hưởng" },
      { "japanese": "ぎろんする", "english": "to discuss / debate", "vietnamese": "thảo luận" },
      { "japanese": "しんぽ", "english": "progress / improvement", "vietnamese": "tiến bộ" }
    ],
    "grammar": [
      { "point": "～によると", "explanation": "'According to ~'. Used to cite sources when discussing news. E.g., 'ニュースによると' (according to the news)." },
      { "point": "～はずだ", "explanation": "'It should be ~ / I expect that ~ '. Used to express expectation based on information." }
    ],
    "examples": [
      { "japanese": "ニュースによると、明日雨が降るそうです。", "english": "According to the news, it will rain tomorrow.", "vietnamese": "Theo tin tức, ngày mai trời sẽ mưa." },
      { "japanese": "この事件についてどう思いますか。", "english": "What do you think about this incident?", "vietnamese": "Bạn nghĩ gì về sự việc này?" },
      { "japanese": "経済は少しずつ良くなっているはずです。", "english": "The economy should be improving little by little.", "vietnamese": "Kinh tế lẽ ra đang dần tốt lên." },
      { "japanese": "政治のニュースは難しいです。", "english": "Political news is difficult.", "vietnamese": "Tin tức chính trị thì khó." },
      { "japanese": "あなたの意見を聞かせてください。", "english": "Please tell me your opinion.", "vietnamese": "Hãy cho tôi biết ý kiến của bạn." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "今日のニュースを見ましたか。", "english": "Did you watch the news today?" },
      { "speaker": "B", "japanese": "はい、大きな地震があったそうですね。", "english": "Yes, I heard there was a big earthquake." },
      { "speaker": "A", "japanese": "とても怖かったです。ベトナムではあまり地震がないので驚きました。", "english": "It was very scary. I was surprised because there aren't many earthquakes in Vietnam." },
      { "speaker": "B", "japanese": "日本は地震が多いので、準備が大切ですね。", "english": "Japan has many earthquakes, so preparation is important." }
    ],
    "exercises": [
      "Fill-blank: _____によると、台風が近づいているそうです（ニュース）。",
      "Matching: Match news categories: 1. 政治 2. 経済 3. 天気 a. economy b. politics c. weather",
      "Translation: Translate 'According to the newspaper, the election results were surprising.' into Japanese."
    ]
  },
  {
    "id": 29,
    "title": "Cultural differences (ぶんかのちがい)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "ぶんか", "english": "culture", "vietnamese": "văn hóa" },
      { "japanese": "ちがい", "english": "difference", "vietnamese": "sự khác biệt" },
      { "japanese": "しゅうかん", "english": "custom / habit", "vietnamese": "phong tục" },
      { "japanese": "マナー", "english": "manners", "vietnamese": "phép lịch sự" },
      { "japanese": "あいさつ", "english": "greeting", "vietnamese": "lời chào" },
      { "japanese": "げんかん", "english": "entrance / genkan", "vietnamese": "hành lang / cửa ra vào" },
      { "japanese": "くつをぬぐ", "english": "to take off shoes", "vietnamese": "cởi giày" },
      { "japanese": "めうえ", "english": "superior / older person", "vietnamese": "người trên" },
      { "japanese": "けいご", "english": "honorific language", "vietnamese": "kính ngữ" },
      { "japanese": "てきとう", "english": "appropriate / suitable", "vietnamese": "phù hợp" }
    ],
    "grammar": [
      { "point": "～と違う", "explanation": "'Different from ~'. Used to compare Japanese customs with the learner's own culture." },
      { "point": "～なければならない", "explanation": "'Must do ~'. Used to explain cultural obligations, e.g., 'you must take off shoes'." }
    ],
    "examples": [
      { "japanese": "日本では家に入る前に靴を脱がなければなりません。", "english": "In Japan, you must take off your shoes before entering a house.", "vietnamese": "Ở Nhật, trước khi vào nhà bạn phải cởi giày." },
      { "japanese": "ベトナムと日本の文化はとても違います。", "english": "Vietnamese and Japanese cultures are very different.", "vietnamese": "Văn hóa Việt Nam và Nhật Bản rất khác nhau." },
      { "japanese": "目上の人には敬語を使うのがマナーです。", "english": "It is good manners to use keigo with superiors.", "vietnamese": "Đối với người trên thì dùng kính ngữ là phép lịch sự." },
      { "japanese": "お辞儀をするのが日本の習慣です。", "english": "Bowing is a Japanese custom.", "vietnamese": "Cúi chào là phong tục của Nhật Bản." },
      { "japanese": "食事の前に「いただきます」と言います。", "english": "We say 'Itadakimasu' before eating.", "vietnamese": "Trước bữa ăn chúng tôi nói 'Itadakimasu'." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "日本で一番驚いた文化の違いは何ですか。", "english": "What cultural difference surprised you the most in Japan?" },
      { "speaker": "B", "japanese": "靴を脱ぐ習慣です。ベトナムでは外でも家でも靴を履いていますから。", "english": "The custom of taking off shoes. In Vietnam, we wear shoes both outside and inside." },
      { "speaker": "A", "japanese": "それは確かに違いますね。それに、お辞儀もよくしますね。", "english": "That's certainly different. Also, you bow a lot." },
      { "speaker": "B", "japanese": "そうですね。だんだん慣れてきました。", "english": "Yes. I'm gradually getting used to it." }
    ],
    "exercises": [
      "Fill-blank: 日本では＿＿を脱ぐのが習慣です（靴）。",
      "Matching: Match Japanese customs: 1. お辞儀 2. 靴を脱ぐ 3. 「いただきます」 a. take off shoes b. bow c. say before meal",
      "Translation: Translate 'In Vietnam, we usually greet by shaking hands.' into Japanese."
    ]
  },
  {
    "id": 30,
    "title": "Job interviews (めんせつ)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "めんせつ", "english": "job interview", "vietnamese": "phỏng vấn xin việc" },
      { "japanese": "しゅうしょく", "english": "job hunting / employment", "vietnamese": "tìm việc" },
      { "japanese": "りれきしょ", "english": "resume / CV", "vietnamese": "sơ yếu lý lịch" },
      { "japanese": "しょくけい", "english": "job type / occupation", "vietnamese": "loại công việc" },
      { "japanese": "じこしょうかい", "english": "self-introduction", "vietnamese": "tự giới thiệu" },
      { "japanese": "ちから", "english": "ability / strength", "vietnamese": "khả năng" },
      { "japanese": "けいけん", "english": "experience", "vietnamese": "kinh nghiệm" },
      { "japanese": "じゅんび", "english": "preparation", "vietnamese": "chuẩn bị" },
      { "japanese": "しつもん", "english": "question", "vietnamese": "câu hỏi" },
      { "japanese": "にゅうしゃ", "english": "joining a company", "vietnamese": "vào công ty" }
    ],
    "grammar": [
      { "point": "～を活かす", "explanation": "'To make use of ~'. Used in interviews to talk about how you will apply your skills or experience." },
      { "point": "～になれるように", "explanation": "'In order to become ~'. Used to express goals or aspirations in an interview context." }
    ],
    "examples": [
      { "japanese": "自己紹介をお願いします。", "english": "Please introduce yourself.", "vietnamese": "Xin hãy tự giới thiệu." },
      { "japanese": "私は大学で経済を勉強しました。", "english": "I studied economics at university.", "vietnamese": "Tôi đã học kinh tế ở đại học." },
      { "japanese": "前の仕事で得た経験を活かしたいです。", "english": "I want to make use of the experience I gained in my previous job.", "vietnamese": "Tôi muốn vận dụng kinh nghiệm có được từ công việc trước." },
      { "japanese": "御社の一員になれるように頑張ります。", "english": "I will do my best to become a member of your company.", "vietnamese": "Tôi sẽ cố gắng để trở thành thành viên của quý công ty." },
      { "japanese": "志望動機を教えてください。", "english": "Please tell me your motivation for applying.", "vietnamese": "Hãy cho tôi biết động lực ứng tuyển của bạn." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "それでは、自己紹介をお願いします。", "english": "Then, please introduce yourself." },
      { "speaker": "B", "japanese": "はい。私はベトナム人のトゥと申します。日本で3年働いていました。", "english": "Yes. My name is Tu, I'm Vietnamese. I worked in Japan for three years." },
      { "speaker": "A", "japanese": "なぜ当社を志望したのですか。", "english": "Why did you apply to our company?" },
      { "speaker": "B", "japanese": "御社の国際的な事業に魅力を感じました。私の語学力を活かしたいです。", "english": "I was attracted by your company's international business. I want to use my language skills." }
    ],
    "exercises": [
      "Fill-blank: ＿＿を活かして働きたいです（経験）。",
      "Matching: Match interview terms: 1. 志望動機 2. 自己PR 3. 逆質問 a. self-promotion b. motivation c. question to interviewer",
      "Translation: Translate 'I will prepare well for the interview.' into Japanese."
    ]
  },
  {
    "id": 31,
    "title": "Business meetings (かいぎ)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "かいぎ", "english": "meeting", "vietnamese": "cuộc họp" },
      { "japanese": "ぎじろく", "english": "minutes", "vietnamese": "biên bản" },
      { "japanese": "しりょう", "english": "materials", "vietnamese": "tài liệu" },
      { "japanese": "ぎだい", "english": "agenda", "vietnamese": "chương trình nghị sự" },
      { "japanese": "さんかする", "english": "to participate", "vietnamese": "tham gia" },
      { "japanese": "ていあんする", "english": "to propose", "vietnamese": "đề xuất" },
      { "japanese": "ごういする", "english": "to agree", "vietnamese": "đồng ý" },
      { "japanese": "はっせきする", "english": "to speak up", "vietnamese": "phát biểu" },
      { "japanese": "しかい", "english": "chairperson", "vietnamese": "chủ tọa" },
      { "japanese": "けつろん", "english": "conclusion", "vietnamese": "kết luận" }
    ],
    "grammar": [
      { "point": "～なければならない", "explanation": "Must do something; used to express obligation in a formal context." },
      { "point": "～たほうがいい", "explanation": "Should do something; giving advice or recommendation." }
    ],
    "examples": [
      { "japanese": "かいぎにさんかしなければなりません。", "english": "I must participate in the meeting.", "vietnamese": "Tôi phải tham gia cuộc họp." },
      { "japanese": "しりょうをじゅんびしたほうがいいです。", "english": "You should prepare the materials.", "vietnamese": "Bạn nên chuẩn bị tài liệu." },
      { "japanese": "ぎじろくをとるのはだれですか。", "english": "Who takes the minutes?", "vietnamese": "Ai ghi biên bản?" },
      { "japanese": "ぎだいについてていあんします。", "english": "I will propose an agenda item.", "vietnamese": "Tôi sẽ đề xuất một mục chương trình." },
      { "japanese": "けつろんにごういしました。", "english": "We agreed on the conclusion.", "vietnamese": "Chúng tôi đã đồng ý về kết luận." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "こんかいのかいぎのぎだいはなんですか。", "english": "What is the agenda for this meeting?" },
      { "speaker": "B", "japanese": "あたらしいプロジェクトのけいかくについてです。", "english": "It's about the plan for the new project." },
      { "speaker": "A", "japanese": "わたしはパートナーシップのていあんをしたいです。", "english": "I would like to propose a partnership." },
      { "speaker": "B", "japanese": "わかりました。ぎじろくにのせておきます。", "english": "Understood. I will include it in the minutes." }
    ],
    "exercises": [
      "Fill-blank: かいぎに（　）しなければなりません。（さんかする）",
      "Matching: Match the Japanese words with their Vietnamese meanings: ぎじろく, ていあんする, ごういする",
      "Translation: Translate 'You should prepare the agenda before the meeting.' into Japanese."
    ]
  },
  {
    "id": 32,
    "title": "Giving presentations (プレゼンテーション)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "プレゼンテーション", "english": "presentation", "vietnamese": "bài thuyết trình" },
      { "japanese": "スライド", "english": "slide", "vietnamese": "slide" },
      { "japanese": "せつめいする", "english": "to explain", "vietnamese": "giải thích" },
      { "japanese": "しつもん", "english": "question", "vietnamese": "câu hỏi" },
      { "japanese": "しちょう", "english": "audience", "vietnamese": "khán giả" },
      { "japanese": "ポイント", "english": "point / key point", "vietnamese": "điểm chính" },
      { "japanese": "グラフ", "english": "graph", "vietnamese": "biểu đồ" },
      { "japanese": "データ", "english": "data", "vietnamese": "dữ liệu" },
      { "japanese": "はっぴょうする", "english": "to present", "vietnamese": "trình bày" },
      { "japanese": "まとめる", "english": "to summarize", "vietnamese": "tóm tắt" }
    ],
    "grammar": [
      { "point": "～について", "explanation": "About something; used to indicate the topic." },
      { "point": "～ことになる", "explanation": "It has been decided that / it turns out that." }
    ],
    "examples": [
      { "japanese": "しんせいひんについてプレゼンします。", "english": "I will present about the new product.", "vietnamese": "Tôi sẽ thuyết trình về sản phẩm mới." },
      { "japanese": "グラフをつかってデータをせつめいします。", "english": "I will explain the data using a graph.", "vietnamese": "Tôi sẽ giải thích dữ liệu bằng biểu đồ." },
      { "japanese": "さいごにポイントをまとめることになります。", "english": "Finally, I will summarize the key points.", "vietnamese": "Cuối cùng, tôi sẽ tóm tắt các điểm chính." },
      { "japanese": "しつもんがあるひとはてをあげてください。", "english": "If you have questions, please raise your hand.", "vietnamese": "Ai có câu hỏi hãy giơ tay." },
      { "japanese": "しちょうのげんごうはよかったです。", "english": "The audience's reaction was good.", "vietnamese": "Phản ứng của khán giả tốt." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "つぎのじゅんびはできていますか。", "english": "Are you ready for the next step?" },
      { "speaker": "B", "japanese": "はい、スライドはもうできました。", "english": "Yes, the slides are already done." },
      { "speaker": "A", "japanese": "では、データのぶぶんをもうすこしくわしくせつめいしてください。", "english": "Then, please explain the data part a little more in detail." },
      { "speaker": "B", "japanese": "わかりました。かならずしつもんにもこたえます。", "english": "Understood. I will definitely answer questions too." }
    ],
    "exercises": [
      "Fill-blank: しんせいひん（　）プレゼンテーションをします。（について）",
      "Matching: Match the Japanese with Vietnamese: スライド, せつめいする, まとめる",
      "Translation: Translate 'Please summarize the key points at the end.' into Japanese."
    ]
  },
  {
    "id": 33,
    "title": "Negotiating (こうしょう)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "こうしょう", "english": "negotiation", "vietnamese": "đàm phán" },
      { "japanese": "じょうけん", "english": "condition / term", "vietnamese": "điều kiện" },
      { "japanese": "ていあん", "english": "proposal", "vietnamese": "đề xuất" },
      { "japanese": "せいとう", "english": "fair / legitimate", "vietnamese": "công bằng" },
      { "japanese": "ゆずる", "english": "to concede", "vietnamese": "nhượng bộ" },
      { "japanese": "ごうりてき", "english": "reasonable", "vietnamese": "hợp lý" },
      { "japanese": "だんかい", "english": "stage / phase", "vietnamese": "giai đoạn" },
      { "japanese": "こうしょうだん", "english": "negotiation table", "vietnamese": "bàn đàm phán" },
      { "japanese": "まんぞくする", "english": "to be satisfied", "vietnamese": "hài lòng" },
      { "japanese": "ごういをみる", "english": "to reach an agreement", "vietnamese": "đạt được thỏa thuận" }
    ],
    "grammar": [
      { "point": "～なければならない", "explanation": "Must do something (necessity)." },
      { "point": "～てもいい", "explanation": "May do something (permission)." }
    ],
    "examples": [
      { "japanese": "こうしょうではおたがいにゆずらなければならないこともあります。", "english": "In negotiations, sometimes both sides must concede.", "vietnamese": "Trong đàm phán, đôi khi cả hai bên phải nhượng bộ." },
      { "japanese": "このじょうけんはごうりてきですか。", "english": "Is this condition reasonable?", "vietnamese": "Điều kiện này có hợp lý không?" },
      { "japanese": "もうすこしかんがえてもいいですか。", "english": "May I think about it a little more?", "vietnamese": "Tôi có thể suy nghĩ thêm một chút không?" },
      { "japanese": "つぎのだんかいにすすめましょう。", "english": "Let's move to the next stage.", "vietnamese": "Hãy chuyển sang giai đoạn tiếp theo." },
      { "japanese": "わたしたちはこのていあんでまんぞくしています。", "english": "We are satisfied with this proposal.", "vietnamese": "Chúng tôi hài lòng với đề xuất này." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "はじめにわたしたちのていあんをせつめいします。", "english": "First, I will explain our proposal." },
      { "speaker": "B", "japanese": "はい、でもかぶんのじょうけんについてぎもんがあります。", "english": "Yes, but I have a question about the price condition." },
      { "speaker": "A", "japanese": "かぶんについてはもうすこしごうりてきにできます。", "english": "We can make the price a little more reasonable." },
      { "speaker": "B", "japanese": "では、それでこうしょうをつづけましょう。", "english": "Then, let's continue the negotiation with that." }
    ],
    "exercises": [
      "Fill-blank: このじょうけんは（　）ですか。（ごうりてき）",
      "Matching: Match Japanese with Vietnamese: ゆずる, こうしょう, ごういをみる",
      "Translation: Translate 'May we think about your proposal until next week?' into Japanese."
    ]
  },
  {
    "id": 34,
    "title": "Social media (SNS)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "SNS（ソーシャルネットワーキングサービス）", "english": "social media", "vietnamese": "mạng xã hội" },
      { "japanese": "とうこうする", "english": "to post", "vietnamese": "đăng bài" },
      { "japanese": "フォローする", "english": "to follow", "vietnamese": "theo dõi" },
      { "japanese": "いいね", "english": "like", "vietnamese": "thích" },
      { "japanese": "コメントする", "english": "to comment", "vietnamese": "bình luận" },
      { "japanese": "シェアする", "english": "to share", "vietnamese": "chia sẻ" },
      { "japanese": "プロフィール", "english": "profile", "vietnamese": "hồ sơ" },
      { "japanese": "プライバシー", "english": "privacy", "vietnamese": "riêng tư" },
      { "japanese": "ネットいじめ", "english": "cyberbullying", "vietnamese": "bắt nạt trên mạng" },
      { "japanese": "インフルエンサー", "english": "influencer", "vietnamese": "người có ảnh hưởng" }
    ],
    "grammar": [
      { "point": "～すぎる", "explanation": "Too much / excessive; attached to stem of verbs or adjectives." },
      { "point": "～たほうがいい", "explanation": "Should do something; advice or recommendation." }
    ],
    "examples": [
      { "japanese": "SNSにしゃしんをとうこうしすぎないほうがいいです。", "english": "You shouldn't post too many photos on social media.", "vietnamese": "Bạn không nên đăng quá nhiều ảnh lên mạng xã hội." },
      { "japanese": "フォローしているインフルエンサーがいいねをくれました。", "english": "The influencer I follow gave me a like.", "vietnamese": "Người có ảnh hưởng mà tôi theo dõi đã thích bài của tôi." },
      { "japanese": "プライバシーせっていをかくにんしたほうがいいです。", "english": "You should check your privacy settings.", "vietnamese": "Bạn nên kiểm tra cài đặt riêng tư." },
      { "japanese": "ネットいじめはこくさいできなもんだいです。", "english": "Cyberbullying is an international problem.", "vietnamese": "Bắt nạt trên mạng là vấn đề quốc tế." },
      { "japanese": "コメントをかきすぎると、あとにのこりますよ。", "english": "If you write too many comments, they remain afterward.", "vietnamese": "Nếu bạn viết quá nhiều bình luận, chúng sẽ còn lại sau đó." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "SNSになにをとうこうしましたか。", "english": "What did you post on social media?" },
      { "speaker": "B", "japanese": "きょうのりょこうのしゃしんをシェアしました。", "english": "I shared photos from today's trip." },
      { "speaker": "A", "japanese": "いいねがたくさんきていますね。", "english": "You're getting many likes." },
      { "speaker": "B", "japanese": "でも、プライバシーにきをつけないと。", "english": "But I have to be careful about privacy." }
    ],
    "exercises": [
      "Fill-blank: SNSにしゃしんを（　）しないでください。（とうこう）",
      "Matching: Match Japanese with Vietnamese: フォローする, コメントする, ネットいじめ",
      "Translation: Translate 'You should not share too much personal information on social media.' into Japanese."
    ]
  },
  {
    "id": 35,
    "title": "Environmental issues (かんきょうもんだい)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "かんきょうもんだい", "english": "environmental issues", "vietnamese": "vấn đề môi trường" },
      { "japanese": "ちきゅうおんだんか", "english": "global warming", "vietnamese": "sự nóng lên toàn cầu" },
      { "japanese": "はいきぶつ", "english": "waste", "vietnamese": "chất thải" },
      { "japanese": "リサイクル", "english": "recycling", "vietnamese": "tái chế" },
      { "japanese": "エコ", "english": "eco-friendly", "vietnamese": "thân thiện với môi trường" },
      { "japanese": "でんき", "english": "electricity", "vietnamese": "điện" },
      { "japanese": "しょうエネルギー", "english": "energy saving", "vietnamese": "tiết kiệm năng lượng" },
      { "japanese": "しんりん", "english": "forest", "vietnamese": "rừng" },
      { "japanese": "せいたいけい", "english": "ecosystem", "vietnamese": "hệ sinh thái" },
      { "japanese": "ほぜんする", "english": "to preserve", "vietnamese": "bảo tồn" }
    ],
    "grammar": [
      { "point": "～ために", "explanation": "For the sake of / in order to; shows purpose." },
      { "point": "～なければならない", "explanation": "Must do something (obligation)." }
    ],
    "examples": [
      { "japanese": "かんきょうのためにリサイクルしなければなりません。", "english": "We must recycle for the environment.", "vietnamese": "Chúng ta phải tái chế vì môi trường." },
      { "japanese": "でんきをけすのはエコのためにいいです。", "english": "Turning off electricity is good for being eco-friendly.", "vietnamese": "Tắt điện là tốt cho môi trường." },
      { "japanese": "しんりんをほぜんするために、きをうえましょう。", "english": "Let's plant trees to preserve forests.", "vietnamese": "Hãy trồng cây để bảo tồn rừng." },
      { "japanese": "はいきぶつをへらすことがたいせつです。", "english": "Reducing waste is important.", "vietnamese": "Giảm chất thải là quan trọng." },
      { "japanese": "ちきゅうおんだんかはせいたいけいにおおきなえいきょうをあたえます。", "english": "Global warming has a big impact on ecosystems.", "vietnamese": "Sự nóng lên toàn cầu có tác động lớn đến hệ sinh thái." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "さいきんエコかつどうにさんかしていますか。", "english": "Have you been participating in eco-activities recently?" },
      { "speaker": "B", "japanese": "はい、リサイクルセンターでボランティアをしています。", "english": "Yes, I volunteer at a recycling center." },
      { "speaker": "A", "japanese": "いいですね。じぶんでもかんきょうのためにできることがありますね。", "english": "That's nice. There are things we can do ourselves for the environment." },
      { "speaker": "B", "japanese": "そうですね。まずはしょうエネルギーからはじめましょう。", "english": "That's right. Let's start with energy saving first." }
    ],
    "exercises": [
      "Fill-blank: かんきょう（　）リサイクルをします。（ために）",
      "Matching: Match Japanese with Vietnamese: はいきぶつ, ほぜんする, せいたいけい",
      "Translation: Translate 'We must preserve forests for future generations.' into Japanese."
    ]
  },
  {
    "id": 36,
    "title": "Expressing opinions (いけんをのべる)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "いけん", "english": "opinion", "vietnamese": "ý kiến" },
      { "japanese": "のべる", "english": "to express / to state", "vietnamese": "bày tỏ" },
      { "japanese": "はんたいする", "english": "to oppose", "vietnamese": "phản đối" },
      { "japanese": "さんせいする", "english": "to agree", "vietnamese": "đồng ý" },
      { "japanese": "りゆう", "english": "reason", "vietnamese": "lý do" },
      { "japanese": "てん", "english": "point", "vietnamese": "điểm" },
      { "japanese": "しじする", "english": "to support", "vietnamese": "ủng hộ" },
      { "japanese": "けんかい", "english": "viewpoint / standpoint", "vietnamese": "quan điểm" },
      { "japanese": "ぎろん", "english": "argument / discussion", "vietnamese": "tranh luận" },
      { "japanese": "まとめる", "english": "to summarize", "vietnamese": "tóm tắt" }
    ],
    "grammar": [
      { "point": "～とおもう", "explanation": "I think that...; used to express personal opinion." },
      { "point": "～については", "explanation": "Regarding / concerning...; used to introduce a topic." }
    ],
    "examples": [
      { "japanese": "わたしはこのけいかくにさんせいだとおもいます。", "english": "I think I agree with this plan.", "vietnamese": "Tôi nghĩ tôi đồng ý với kế hoạch này." },
      { "japanese": "かんきょうもんだいについては、こうどうがひつようだとおもいます。", "english": "Regarding environmental issues, I think action is necessary.", "vietnamese": "Về vấn đề môi trường, tôi nghĩ hành động là cần thiết." },
      { "japanese": "はんたいするりゆうをのべてください。", "english": "Please state the reason for opposing.", "vietnamese": "Hãy nêu lý do phản đối." },
      { "japanese": "わたしのけんかいからは、もうすこしじかんがかかります。", "english": "From my viewpoint, it will take a little more time.", "vietnamese": "Từ quan điểm của tôi, sẽ mất thêm một chút thời gian." },
      { "japanese": "ぎろんのあとでけんかいをまとめましょう。", "english": "After the argument, let's summarize the viewpoints.", "vietnamese": "Sau khi tranh luận, hãy tóm tắt các quan điểm." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "このていあんについてどうおもいますか。", "english": "What do you think about this proposal?" },
      { "speaker": "B", "japanese": "わたしはさんせいです。でも、いいくつかてんをくわえたほうがいいとおもいます。", "english": "I agree. But I think a few points should be added." },
      { "speaker": "A", "japanese": "どんなてんですか。", "english": "What points?" },
      { "speaker": "B", "japanese": "せいさんコストについてもはなすべきだとおもいます。", "english": "I think we should also talk about production costs." }
    ],
    "exercises": [
      "Fill-blank: わたしはこのけいかくに（　）だとおもいます。（はんたい）",
      "Matching: Match Japanese with Vietnamese: のべる, しじする, けんかい",
      "Translation: Translate 'I think we should support this viewpoint.' into Japanese."
    ]
  },
  {
    "id": 37,
    "title": "Making suggestions (ていあんする)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "ていあんする", "english": "to suggest / propose", "vietnamese": "đề xuất" },
      { "japanese": "かんがえる", "english": "to think / consider", "vietnamese": "suy nghĩ" },
      { "japanese": "べつの", "english": "another / different", "vietnamese": "khác" },
      { "japanese": "ほうほう", "english": "method / way", "vietnamese": "phương pháp" },
      { "japanese": "こうかてき", "english": "effective", "vietnamese": "hiệu quả" },
      { "japanese": "シミュレーション", "english": "simulation", "vietnamese": "mô phỏng" },
      { "japanese": "じつげんする", "english": "to realize / achieve", "vietnamese": "thực hiện" },
      { "japanese": "オプション", "english": "option", "vietnamese": "lựa chọn" },
      { "japanese": "ひかくする", "english": "to compare", "vietnamese": "so sánh" },
      { "japanese": "さいようする", "english": "to adopt", "vietnamese": "áp dụng" }
    ],
    "grammar": [
      { "point": "～てみる", "explanation": "To try doing something; suggests trying an action." },
      { "point": "～たほうがいい", "explanation": "Should do something; giving advice indirectly." }
    ],
    "examples": [
      { "japanese": "このほうほうをためしてみてください。", "english": "Please try this method.", "vietnamese": "Hãy thử phương pháp này." },
      { "japanese": "ほかのオプションとひかくしたほうがいいとおもいます。", "english": "I think you should compare with other options.", "vietnamese": "Tôi nghĩ bạn nên so sánh với các lựa chọn khác." },
      { "japanese": "シミュレーションをやってみましょう。", "english": "Let's try doing a simulation.", "vietnamese": "Hãy thử làm mô phỏng." },
      { "japanese": "このていあんはこうかてきだとおもいます。", "english": "I think this suggestion is effective.", "vietnamese": "Tôi nghĩ đề xuất này hiệu quả." },
      { "japanese": "あたらしいせいどをさいようしてみてはどうですか。", "english": "How about trying to adopt a new system?", "vietnamese": "Thử áp dụng hệ thống mới thì sao?" }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "かいぎのじかんをみじかくするほうほうはないですか。", "english": "Isn't there a way to shorten meeting time?" },
      { "speaker": "B", "japanese": "ぎだいをせんもんごとにわけて、へやをわけてみてはどうですか。", "english": "How about dividing the agenda by specialty and using separate rooms?" },
      { "speaker": "A", "japanese": "それはいいアイデアですね。やってみます。", "english": "That's a good idea. I'll try it." },
      { "speaker": "B", "japanese": "まずはテストとしてすこしずつじつげんしてみましょう。", "english": "Let's first try implementing it little by little as a test." }
    ],
    "exercises": [
      "Fill-blank: このせいひんを（　）みてください。（つかう）",
      "Matching: Match Japanese with Vietnamese: ていあんする, ほうほう, さいようする",
      "Translation: Translate 'Why don't you try comparing the two options?' into Japanese."
    ]
  },
  {
    "id": 38,
    "title": "Apologizing and excuses (しゃざいとわけ)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "しゃざいする", "english": "to apologize", "vietnamese": "xin lỗi" },
      { "japanese": "わけ", "english": "excuse / reason", "vietnamese": "lý do / cái cớ" },
      { "japanese": "あやまる", "english": "to apologize (casual)", "vietnamese": "xin lỗi" },
      { "japanese": "ゆるす", "english": "to forgive", "vietnamese": "tha thứ" },
      { "japanese": "しつれいする", "english": "to be rude", "vietnamese": "thô lỗ" },
      { "japanese": "ごめいわくをかける", "english": "to cause trouble", "vietnamese": "gây phiền hà" },
      { "japanese": "てちがい", "english": "mistake / error", "vietnamese": "sai sót" },
      { "japanese": "わけをせつめいする", "english": "to explain the reason", "vietnamese": "giải thích lý do" },
      { "japanese": "しょうじき", "english": "honest", "vietnamese": "thành thật" },
      { "japanese": "つぐないをする", "english": "to make amends", "vietnamese": "đền bù" }
    ],
    "grammar": [
      { "point": "～てすみません", "explanation": "I'm sorry for...; apologizing for an action." },
      { "point": "～という意味", "explanation": "Meaning that...; used to explain the meaning of a word or reason." }
    ],
    "examples": [
      { "japanese": "おくれてすみません。", "english": "I'm sorry for being late.", "vietnamese": "Xin lỗi vì đã đến muộn." },
      { "japanese": "てちがいをしてごめいわくをかけてすみません。", "english": "I'm sorry for causing trouble by making a mistake.", "vietnamese": "Xin lỗi vì đã gây phiền hà do sai sót." },
      { "japanese": "これはしつれいという意味ですか。", "english": "Does this mean 'rude'?", "vietnamese": "Điều này có nghĩa là thô lỗ không?" },
      { "japanese": "しょうじきにわけをせつめいしたほうがいいです。", "english": "You should honestly explain the reason.", "vietnamese": "Bạn nên thành thật giải thích lý do." },
      { "japanese": "つぐないをするつもりです。ゆるしてください。", "english": "I intend to make amends. Please forgive me.", "vietnamese": "Tôi định sẽ đền bù. Hãy tha thứ cho tôi." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "きのうのしごとでミスをしてしまいました。", "english": "I made a mistake at work yesterday." },
      { "speaker": "B", "japanese": "それはいけませんね。わけをきかせてください。", "english": "That's not good. Please tell me the reason." },
      { "speaker": "A", "japanese": "データのチェックをわすれたためです。もうしわけありません。", "english": "It's because I forgot to check the data. I'm very sorry." },
      { "speaker": "B", "japanese": "わかりました。こんどからきをつけてください。", "english": "I understand. Please be careful from now on." }
    ],
    "exercises": [
      "Fill-blank: おくれて（　）。（すみません）",
      "Matching: Match Japanese with Vietnamese: しゃざいする, ゆるす, つぐないをする",
      "Translation: Translate 'I apologize for the mistake. I will be more careful.' into Japanese."
    ]
  },
  {
    "id": 39,
    "title": "Giving advice (アドバイスをする)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "アドバイス", "english": "advice", "vietnamese": "lời khuyên" },
      { "japanese": "はげます", "english": "to encourage", "vietnamese": "khích lệ" },
      { "japanese": "きをつける", "english": "to be careful", "vietnamese": "cẩn thận" },
      { "japanese": "ちゅういする", "english": "to warn", "vietnamese": "cảnh báo" },
      { "japanese": "べんきょうになる", "english": "to be instructive / educational", "vietnamese": "bổ ích" },
      { "japanese": "さんこうにする", "english": "to refer to / use as reference", "vietnamese": "tham khảo" },
      { "japanese": "そっくり", "english": "exactly like / whole", "vietnamese": "giống hệt" },
      { "japanese": "かんがえなおす", "english": "to reconsider", "vietnamese": "xem xét lại" },
      { "japanese": "はんだんする", "english": "to judge", "vietnamese": "đánh giá" },
      { "japanese": "せいこうする", "english": "to succeed", "vietnamese": "thành công" }
    ],
    "grammar": [
      { "point": "～たほうがいい", "explanation": "Should do something; giving advice." },
      { "point": "～ないほうがいい", "explanation": "Should not do something; advising against." }
    ],
    "examples": [
      { "japanese": "もうすこしれんしゅうしたほうがいいですよ。", "english": "You should practice a little more.", "vietnamese": "Bạn nên luyện tập thêm một chút." },
      { "japanese": "むりをしないほうがいいです。", "english": "You shouldn't overdo it.", "vietnamese": "Bạn không nên làm quá sức." },
      { "japanese": "このほんはべんきょうになりますよ。", "english": "This book will be instructive.", "vietnamese": "Cuốn sách này rất bổ ích đấy." },
      { "japanese": "じぶんではんだんしないで、せんもんかにきいたほうがいいです。", "english": "You should ask a specialist rather than judging yourself.", "vietnamese": "Bạn nên hỏi chuyên gia thay vì tự đánh giá." },
      { "japanese": "せいこうしたいなら、かんがえなおしたほうがいいかもしれません。", "english": "If you want to succeed, you might want to reconsider.", "vietnamese": "Nếu muốn thành công, bạn có thể nên xem xét lại." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "にほんごのべんきょうでつまづいています。アドバイスをください。", "english": "I'm stuck in Japanese study. Please give me advice." },
      { "speaker": "B", "japanese": "まいにちちょっとずつでもれんしゅうしたほうがいいですよ。", "english": "You should practice a little every day." },
      { "speaker": "A", "japanese": "でも、もっとはやくできるほうほうはありませんか。", "english": "But isn't there a way to do it faster?" },
      { "speaker": "B", "japanese": "むりをしないほうがいいです。じっくりやればしぜんにじょうたつします。", "english": "You shouldn't overdo it. If you do it steadily, you'll improve naturally." }
    ],
    "exercises": [
      "Fill-blank: むりを（　）ほうがいいです。（しない）",
      "Matching: Match Japanese with Vietnamese: はげます, ちゅういする, さんこうにする",
      "Translation: Translate 'You should refer to this website for more information.' into Japanese."
    ]
  },
  {
    "id": 40,
    "title": "Describing experiences (けいけんをのべる)",
    "level": "intermediate",
    "vocabulary": [
      { "japanese": "けいけん", "english": "experience", "vietnamese": "kinh nghiệm" },
      { "japanese": "のべる", "english": "to describe / to state", "vietnamese": "miêu tả" },
      { "japanese": "かつどう", "english": "activity", "vietnamese": "hoạt động" },
      { "japanese": "わすれられない", "english": "unforgettable", "vietnamese": "không thể quên" },
      { "japanese": "はじめて", "english": "first time", "vietnamese": "lần đầu" },
      { "japanese": "おどろく", "english": "to be surprised", "vietnamese": "ngạc nhiên" },
      { "japanese": "かんどうする", "english": "to be moved / impressed", "vietnamese": "xúc động" },
      { "japanese": "たいけんする", "english": "to experience", "vietnamese": "trải nghiệm" },
      { "japanese": "くりかえす", "english": "to repeat", "vietnamese": "lặp lại" },
      { "japanese": "きおく", "english": "memory", "vietnamese": "ký ức" }
    ],
    "grammar": [
      { "point": "～たことがある", "explanation": "Have done something before; expresses past experience." },
      { "point": "～たり～たりする", "explanation": "Doing various things; listing actions." }
    ],
    "examples": [
      { "japanese": "ふじさんにのぼったことがあります。", "english": "I have climbed Mount Fuji before.", "vietnamese": "Tôi đã từng leo núi Phú Sĩ." },
      { "japanese": "りょこうでたべたり、みたり、たくさんたいけんしました。", "english": "During the trip, I experienced many things like eating and seeing.", "vietnamese": "Trong chuyến đi, tôi đã trải nghiệm nhiều thứ như ăn uống, ngắm cảnh." },
      { "japanese": "はじめてすしをたべたとき、とてもおどろきました。", "english": "When I ate sushi for the first time, I was very surprised.", "vietnamese": "Khi lần đầu ăn sushi, tôi rất ngạc nhiên." },
      { "japanese": "そのけいけんはわすれられないきおくになりました。", "english": "That experience became an unforgettable memory.", "vietnamese": "Trải nghiệm đó đã trở thành ký ức không thể quên." },
      { "japanese": "かれのスピーチにかんどうしました。", "english": "I was moved by his speech.", "vietnamese": "Tôi đã xúc động trước bài phát biểu của anh ấy." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "にほんでいちばんかんどうしたけいけんはなんですか。", "english": "What is the most impressive experience you had in Japan?" },
      { "speaker": "B", "japanese": "おまつりにさんかしたことです。", "english": "It's having participated in a festival." },
      { "speaker": "A", "japanese": "それはいいけいけんですね。なにをしましたか。", "english": "That's a good experience. What did you do?" },
      { "speaker": "B", "japanese": "みこしをかついだり、おどったりしました。", "english": "I carried a mikoshi and danced." }
    ],
    "exercises": [
      "Fill-blank: にほんで（　）ことがありますか。（すしをたべる）",
      "Matching: Match Japanese with Vietnamese: けいけん, かんどうする, わすれられない",
      "Translation: Translate 'I have never experienced such a beautiful sunset.' into Japanese."
    ]
  },
  {
    "id": 41,
    "title": "Comparing options (オプションをくらべる)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "比較する", "english": "to compare", "vietnamese": "so sánh" },
      { "japanese": "選択肢", "english": "option/choice", "vietnamese": "lựa chọn" },
      { "japanese": "利点", "english": "advantage", "vietnamese": "lợi điểm" },
      { "japanese": "欠点", "english": "disadvantage", "vietnamese": "nhược điểm" },
      { "japanese": "〜より", "english": "than", "vietnamese": "hơn" },
      { "japanese": "〜ほど", "english": "as ~ as (with negation)", "vietnamese": "bằng (dạng phủ định)" },
      { "japanese": "どちらも", "english": "both", "vietnamese": "cả hai" },
      { "japanese": "結局", "english": "after all", "vietnamese": "cuối cùng" },
      { "japanese": "決める", "english": "to decide", "vietnamese": "quyết định" },
      { "japanese": "迷う", "english": "to be undecided", "vietnamese": "phân vân" }
    ],
    "grammar": [
      { "point": "AはBより〜", "explanation": "Used to compare that A is more ~ than B." },
      { "point": "AとBとどちらが〜か", "explanation": "Asking which one (A or B) is more ~." },
      { "point": "AはBほど〜ない", "explanation": "Used to say A is not as ~ as B." }
    ],
    "examples": [
      { "japanese": "飛行機は電車より速いです。", "english": "Airplanes are faster than trains.", "vietnamese": "Máy bay nhanh hơn tàu điện." },
      { "japanese": "東京と大阪とどちらが大きいですか。", "english": "Which is bigger, Tokyo or Osaka?", "vietnamese": "Tokyo và Osaka, cái nào lớn hơn?" },
      { "japanese": "このカフェはあのカフェほど静かじゃない。", "english": "This cafe is not as quiet as that cafe.", "vietnamese": "Quán cà phê này không yên tĩnh bằng quán kia." },
      { "japanese": "どちらもいい選択肢ですね。", "english": "Both are good options.", "vietnamese": "Cả hai đều là lựa chọn tốt." },
      { "japanese": "結局、新幹線に決めました。", "english": "After all, I decided on the Shinkansen.", "vietnamese": "Cuối cùng tôi đã quyết định đi tàu cao tốc." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "A社とB社のプラン、どちらがいいと思う？", "english": "Which plan do you think is better, company A or company B?" },
      { "speaker": "B", "japanese": "値段はA社のほうが安いけど、サービスはB社のほうが充実しているよ。", "english": "Company A is cheaper, but company B has more comprehensive service." },
      { "speaker": "A", "japanese": "じゃあ、どちらを選ぶ？", "english": "Then which one will you choose?" },
      { "speaker": "B", "japanese": "迷うけど、長期的に見ればB社のほうがいいかな。", "english": "I'm undecided, but looking long-term, company B might be better." }
    ],
    "exercises": [
      "Fill-blank: 車は自転車（ ）速い。（より／ほど）",
      "Matching: Match each comparison expression (より, ほど〜ない, どちら) with its English equivalent.",
      "Translation: Translate 'This smartphone is not as expensive as that one' into Japanese."
    ]
  },
  {
    "id": 42,
    "title": "Hypothetical situations (かていのばあい)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "もし", "english": "if", "vietnamese": "nếu" },
      { "japanese": "〜たら", "english": "if (conditional)", "vietnamese": "nếu (thì)" },
      { "japanese": "〜ば", "english": "if (conditional)", "vietnamese": "nếu (mà)" },
      { "japanese": "〜なら", "english": "if (topic/condition)", "vietnamese": "nếu (về)" },
      { "japanese": "可能性", "english": "possibility", "vietnamese": "khả năng" },
      { "japanese": "仮定", "english": "assumption/hypothesis", "vietnamese": "giả định" },
      { "japanese": "現実的", "english": "realistic", "vietnamese": "thực tế" },
      { "japanese": "想像する", "english": "to imagine", "vietnamese": "tưởng tượng" },
      { "japanese": "もしもの場合", "english": "in case of emergency", "vietnamese": "trường hợp khẩn cấp" },
      { "japanese": "現実には", "english": "in reality", "vietnamese": "trong thực tế" }
    ],
    "grammar": [
      { "point": "〜たら", "explanation": "Conditional form: if (after verb た form). Used for hypothetical or future conditions." },
      { "point": "〜ば", "explanation": "Conditional form: if (after verb ば form, adjective stem + ければ). Emphasizes result." },
      { "point": "〜なら", "explanation": "Conditional: if it is the case that. Often used to give advice based on a hypothetical." }
    ],
    "examples": [
      { "japanese": "もしお金があったら、世界旅行をしたい。", "english": "If I had money, I would like to travel the world.", "vietnamese": "Nếu có tiền, tôi muốn đi du lịch vòng quanh thế giới." },
      { "japanese": "雨が降れば、試合は中止になります。", "english": "If it rains, the match will be canceled.", "vietnamese": "Nếu mưa, trận đấu sẽ bị hủy." },
      { "japanese": "日本に行くなら、まず京都を訪ねてください。", "english": "If you go to Japan, please visit Kyoto first.", "vietnamese": "Nếu đi Nhật, hãy ghé thăm Kyoto trước." },
      { "japanese": "もっと勉強すれば、合格できたのに。", "english": "If I had studied more, I could have passed.", "vietnamese": "Nếu học chăm hơn, tôi đã có thể đỗ." },
      { "japanese": "もしもの場合に備えて、保険に入っておこう。", "english": "Let's get insurance just in case of emergency.", "vietnamese": "Hãy mua bảo hiểm để phòng trường hợp khẩn cấp." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "もし宝くじに当たったら、どうする？", "english": "If you won the lottery, what would you do?" },
      { "speaker": "B", "japanese": "まずは家を買って、それから世界一周旅行に行くよ。", "english": "First I'd buy a house, then go on a round-the-world trip." },
      { "speaker": "A", "japanese": "現実的じゃないけど、想像するのは楽しいね。", "english": "It's not realistic, but it's fun to imagine." },
      { "speaker": "B", "japanese": "そうだね。でも、もし本当に当たったらどうするか考えておくのも大事だよ。", "english": "Yeah. But it's also important to think about what you'd do if you really won." }
    ],
    "exercises": [
      "Fill-blank: 明日天気が（ ）、散歩に行こう。（よかったら／よければ）",
      "Matching: Match each conditional (たら, ば, なら) with its most common usage scenario.",
      "Translation: Translate 'If I were you, I would not do that' into Japanese."
    ]
  },
  {
    "id": 43,
    "title": "Reporting speech (でんごん・いんよう)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "伝言", "english": "message", "vietnamese": "lời nhắn" },
      { "japanese": "引用する", "english": "to quote", "vietnamese": "trích dẫn" },
      { "japanese": "〜と言う", "english": "to say that", "vietnamese": "nói rằng" },
      { "japanese": "〜と伝える", "english": "to convey that", "vietnamese": "truyền đạt rằng" },
      { "japanese": "〜そうだ(伝聞)", "english": "I hear that; it is said that", "vietnamese": "nghe nói rằng" },
      { "japanese": "〜とのことだ", "english": "I hear that (formal)", "vietnamese": "nghe nói rằng (trang trọng)" },
      { "japanese": "直接話法", "english": "direct speech", "vietnamese": "lời nói trực tiếp" },
      { "japanese": "間接話法", "english": "indirect speech", "vietnamese": "lời nói gián tiếp" },
      { "japanese": "要約する", "english": "to summarize", "vietnamese": "tóm tắt" },
      { "japanese": "そのまま", "english": "as is; exactly", "vietnamese": "nguyên văn" }
    ],
    "grammar": [
      { "point": "〜と言う / 〜と伝える", "explanation": "Used to report what someone said. と言う is neutral, と伝える implies passing on a message." },
      { "point": "〜そうだ (伝聞)", "explanation": "Attached to the plain form of a verb/adjective to indicate hearsay (I heard that…)." },
      { "point": "〜とのことだ", "explanation": "More formal hearsay expression, often used in announcements or reports." }
    ],
    "examples": [
      { "japanese": "彼は「明日来ます」と言いました。", "english": "He said, 'I will come tomorrow.' (direct)", "vietnamese": "Anh ấy nói 'Ngày mai tôi sẽ đến'." },
      { "japanese": "彼は明日来ると言いました。", "english": "He said he would come tomorrow. (indirect)", "vietnamese": "Anh ấy nói rằng ngày mai sẽ đến." },
      { "japanese": "田中さんから伝言です。今日は遅くなると伝えてください。", "english": "There is a message from Tanaka. Please tell him that he will be late today.", "vietnamese": "Có tin nhắn từ Tanaka. Hãy nhắn rằng hôm nay anh ấy sẽ đến muộn." },
      { "japanese": "天気予報によると、明日は雨だそうです。", "english": "According to the weather forecast, it will rain tomorrow.", "vietnamese": "Theo dự báo thời tiết, ngày mai trời sẽ mưa." },
      { "japanese": "社長は来週の会議は延期とのことです。", "english": "I hear that the president said the meeting next week will be postponed.", "vietnamese": "Tôi nghe nói chủ tịch nói cuộc họp tuần sau sẽ bị hoãn." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "山田先生は何とおっしゃっていましたか。", "english": "What did Mr. Yamada say?" },
      { "speaker": "B", "japanese": "明日の授業は休みだと伝えてくださいとのことです。", "english": "He said to tell everyone that tomorrow's class is off." },
      { "speaker": "A", "japanese": "わかりました。学生たちに連絡します。", "english": "Understood. I'll contact the students." },
      { "speaker": "B", "japanese": "あと、レポートの締め切りは来週の金曜日だそうです。", "english": "Also, I hear the report deadline is next Friday." }
    ],
    "exercises": [
      "Fill-blank: 彼女は「私はベトナム人です」（ ）言った。（と／そう）",
      "Matching: Match each reporting verb (と言う, と伝える, そうだ) with its nuance.",
      "Translation: Translate 'I heard that the restaurant is very popular' into Japanese using そうだ."
    ]
  },
  {
    "id": 44,
    "title": "Passive voice (うけみ)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "受身形", "english": "passive form", "vietnamese": "thể bị động" },
      { "japanese": "作られる", "english": "to be made", "vietnamese": "được làm" },
      { "japanese": "書かれる", "english": "to be written", "vietnamese": "được viết" },
      { "japanese": "食べられる", "english": "to be eaten", "vietnamese": "bị ăn" },
      { "japanese": "盗まれる", "english": "to be stolen", "vietnamese": "bị đánh cắp" },
      { "japanese": "～によって", "english": "by (agent in passive)", "vietnamese": "bởi" },
      { "japanese": "被害", "english": "damage/harm", "vietnamese": "thiệt hại" },
      { "japanese": "恩恵", "english": "benefit", "vietnamese": "ân huệ" },
      { "japanese": "迷惑", "english": "trouble/nuisance", "vietnamese": "phiền phức" },
      { "japanese": "気づかれる", "english": "to be noticed", "vietnamese": "bị phát hiện" }
    ],
    "grammar": [
      { "point": "受身形 (Group I U→A+れる, Group II る→られる, Group III する→される, 来る→来られる)", "explanation": "Conjugation to form passive voice. The agent is often marked with に or によって." },
      { "point": "受け身の意味と用法", "explanation": "Used when the subject is acted upon. Can express direct passive (e.g., 食べられる) or indirect passive (suffering passive, e.g., 雨に降られる)." }
    ],
    "examples": [
      { "japanese": "このケーキは母によって作られました。", "english": "This cake was made by my mother.", "vietnamese": "Cái bánh này được làm bởi mẹ tôi." },
      { "japanese": "財布が盗まれました。", "english": "My wallet was stolen.", "vietnamese": "Ví của tôi đã bị đánh cắp." },
      { "japanese": "彼はみんなに好かれています。", "english": "He is liked by everyone.", "vietnamese": "Anh ấy được mọi người yêu quý." },
      { "japanese": "友達に約束を忘れられてしまった。", "english": "I was let down by my friend forgetting the promise. (indirect passive)", "vietnamese": "Tôi đã bị bạn quên lời hẹn." },
      { "japanese": "この本は世界中で読まれている。", "english": "This book is read all over the world.", "vietnamese": "Cuốn sách này được đọc trên khắp thế giới." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "あれ？自転車がない！", "english": "Huh? My bike is gone!" },
      { "speaker": "B", "japanese": "どうしたの？", "english": "What happened?" },
      { "speaker": "A", "japanese": "盗まれたみたい。昨日駐輪場に置いたのに。", "english": "It looks like it was stolen. I parked it in the bicycle parking lot yesterday." },
      { "speaker": "B", "japanese": "それは大変だね。警察に届けたほうがいいよ。", "english": "That's terrible. You should report it to the police." }
    ],
    "exercises": [
      "Fill-blank: そのニュースは多くの人（ ）知られています。（に／を）",
      "Matching: Match each passive verb (作られる, 書かれる, 盗まれる) with its base form.",
      "Translation: Translate 'The window was broken by the child' into Japanese."
    ]
  },
  {
    "id": 45,
    "title": "Relative clauses (かんけいせつ)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "関係節", "english": "relative clause", "vietnamese": "mệnh đề quan hệ" },
      { "japanese": "〜人", "english": "person who ~", "vietnamese": "người mà" },
      { "japanese": "〜もの", "english": "thing that ~", "vietnamese": "thứ mà" },
      { "japanese": "〜ところ", "english": "place where ~", "vietnamese": "nơi mà" },
      { "japanese": "修飾する", "english": "to modify", "vietnamese": "bổ nghĩa" },
      { "japanese": "主語", "english": "subject", "vietnamese": "chủ ngữ" },
      { "japanese": "目的語", "english": "object", "vietnamese": "tân ngữ" },
      { "japanese": "動詞の連体形", "english": "attributive form of verb", "vietnamese": "dạng thuộc từ của động từ" },
      { "japanese": "関係代名詞なし", "english": "no relative pronoun", "vietnamese": "không có đại từ quan hệ" },
      { "japanese": "複雑な文", "english": "complex sentence", "vietnamese": "câu phức" }
    ],
    "grammar": [
      { "point": "動詞・い形容詞・な形容詞の連体形＋名詞", "explanation": "In Japanese, relative clauses precede the noun they modify. No relative pronouns used. The verb takes plain form (present/past, affirmative/negative) directly before the noun." },
      { "point": "名詞を修飾する節", "explanation": "The relative clause can be used with any noun. The noun can be the subject, object, or other element of the clause." }
    ],
    "examples": [
      { "japanese": "昨日買った本はとても面白いです。", "english": "The book I bought yesterday is very interesting.", "vietnamese": "Cuốn sách tôi đã mua hôm qua rất thú vị." },
      { "japanese": "日本語を勉強している人は友達です。", "english": "The person who is studying Japanese is my friend.", "vietnamese": "Người đang học tiếng Nhật là bạn tôi." },
      { "japanese": "ここは有名な寺があるところです。", "english": "This is the place where there is a famous temple.", "vietnamese": "Đây là nơi có ngôi chùa nổi tiếng." },
      { "japanese": "背が高い女の人が田中さんです。", "english": "The woman who is tall is Ms. Tanaka.", "vietnamese": "Người phụ nữ cao là cô Tanaka." },
      { "japanese": "私が作った料理を食べてください。", "english": "Please eat the dish (that) I made.", "vietnamese": "Hãy ăn món tôi đã nấu." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "先週行ったレストラン、覚えてる？", "english": "Do you remember the restaurant we went to last week?" },
      { "speaker": "B", "japanese": "うん、あのラーメンがすごくおいしかった店でしょう？", "english": "Yeah, the one where the ramen was really delicious, right?" },
      { "speaker": "A", "japanese": "そう。あそこにもう一度行かない？", "english": "That's right. Want to go there again?" },
      { "speaker": "B", "japanese": "いいね。でも今日は別の店を探してみよう。", "english": "Sounds good. But today let's try looking for a different place." }
    ],
    "exercises": [
      "Fill-blank: （ ）人が田中さんですか。（本を読んでいる／本を読んでいる人）",
      "Matching: Match each Japanese relative clause with the correct meaning.",
      "Translation: Translate 'The movie that I watched last night was scary' into Japanese."
    ]
  },
  {
    "id": 46,
    "title": "Conditional sentences (じょうけんぶん)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "条件文", "english": "conditional sentence", "vietnamese": "câu điều kiện" },
      { "japanese": "〜と", "english": "if/when (inevitable result)", "vietnamese": "nếu/thì (kết quả tất yếu)" },
      { "japanese": "〜たら", "english": "if (after action/state)", "vietnamese": "nếu (sau hành động)" },
      { "japanese": "〜ば", "english": "if (general condition)", "vietnamese": "nếu (điều kiện chung)" },
      { "japanese": "〜なら", "english": "if (topic condition)", "vietnamese": "nếu (về chủ đề)" },
      { "japanese": "条件", "english": "condition", "vietnamese": "điều kiện" },
      { "japanese": "結果", "english": "result", "vietnamese": "kết quả" },
      { "japanese": "仮定条件", "english": "hypothetical condition", "vietnamese": "điều kiện giả định" },
      { "japanese": "確定条件", "english": "certain condition", "vietnamese": "điều kiện chắc chắn" },
      { "japanese": "逆接", "english": "adversative/contrast", "vietnamese": "tương phản" }
    ],
    "grammar": [
      { "point": "〜と", "explanation": "Used when the result is natural or inevitable. Cannot be used with volitional, request, etc." },
      { "point": "〜たら", "explanation": "Versatile conditional; can be used for hypothetical, future, or past conditions. Can express result with volition." },
      { "point": "〜ば", "explanation": "Focuses on the condition itself; often used for general truths, advice, or potential." },
      { "point": "〜なら", "explanation": "Used when the condition is already established or assumed; often for giving advice." }
    ],
    "examples": [
      { "japanese": "春になると、桜が咲きます。", "english": "When spring comes, cherry blossoms bloom.", "vietnamese": "Khi mùa xuân đến, hoa anh đào nở." },
      { "japanese": "お金があったら、何を買いますか。", "english": "If you had money, what would you buy?", "vietnamese": "Nếu có tiền, bạn sẽ mua gì?" },
      { "japanese": "安ければ、買います。", "english": "If it's cheap, I'll buy it.", "vietnamese": "Nếu rẻ, tôi sẽ mua." },
      { "japanese": "日本に行くなら、富士山を見てください。", "english": "If you go to Japan, please see Mt. Fuji.", "vietnamese": "Nếu đi Nhật, hãy xem núi Phú Sĩ." },
      { "japanese": "雨が降ったら、試合は中止です。", "english": "If it rains, the game will be canceled.", "vietnamese": "Nếu mưa, trận đấu sẽ bị hủy." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "明日ハイキングに行くけど、もし雨が降ったらどうする？", "english": "We're going hiking tomorrow, but what if it rains?" },
      { "speaker": "B", "japanese": "雨なら、博物館に行こうよ。", "english": "If it rains, let's go to the museum." },
      { "speaker": "A", "japanese": "いいね。天気予報を見てみよう。", "english": "Good idea. Let's check the weather forecast." },
      { "speaker": "B", "japanese": "晴れれば最高だけどね。", "english": "It would be best if it's sunny, though." }
    ],
    "exercises": [
      "Fill-blank: 時間が（ ）、手伝ってください。（あれば／あったら）",
      "Matching: Match each conditional form (と, たら, ば, なら) with its most appropriate sentence context.",
      "Translation: Translate 'If you study hard, you will pass the exam' into Japanese using ば."
    ]
  },
  {
    "id": 47,
    "title": "Idiomatic expressions (かんようく)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "慣用句", "english": "idiom", "vietnamese": "thành ngữ" },
      { "japanese": "足を引っ張る", "english": "to hold someone back", "vietnamese": "kéo chân ai (cản trở)" },
      { "japanese": "顔が広い", "english": "to have many connections", "vietnamese": "có nhiều mối quan hệ" },
      { "japanese": "口が重い", "english": "to be taciturn", "vietnamese": "ít nói" },
      { "japanese": "目が高い", "english": "to have good taste", "vietnamese": "có con mắt tinh tường" },
      { "japanese": "手が離せない", "english": "to be tied up (unavailable)", "vietnamese": "bận không rảnh" },
      { "japanese": "耳が痛い", "english": "harsh to hear (but true)", "vietnamese": "chói tai (nhưng đúng)" },
      { "japanese": "頭が切れる", "english": "to be sharp-minded", "vietnamese": "đầu óc sắc sảo" },
      { "japanese": "腹が立つ", "english": "to get angry", "vietnamese": "tức giận" },
      { "japanese": "気が利く", "english": "to be considerate/smart", "vietnamese": "tinh tế, chu đáo" }
    ],
    "grammar": [
      { "point": "Body part + が +  adjective/verb idioms", "explanation": "Many Japanese idioms use body parts (足, 顔, 口, 目, etc.) followed by が and an adjective or verb. They express personality, emotions, or situations." },
      { "point": "Idioms with 腹 (はら)", "explanation": "腹が立つ (angry), 腹が決まる (decide), etc. These are common in daily speech." }
    ],
    "examples": [
      { "japanese": "彼はいつも足を引っ張るようなことばかりする。", "english": "He always does things that hold others back.", "vietnamese": "Anh ta lúc nào cũng làm những việc cản trở người khác." },
      { "japanese": "田中さんは顔が広いから、いろいろな情報が入ってくる。", "english": "Tanaka has many connections, so he gets all kinds of information.", "vietnamese": "Anh Tanaka có nhiều quan hệ nên nhận được nhiều thông tin." },
      { "japanese": "彼女は口が重いけど、信頼できる人だ。", "english": "She is taciturn but trustworthy.", "vietnamese": "Cô ấy ít nói nhưng là người đáng tin." },
      { "japanese": "この店のセンスはさすがだね。君は目が高いね。", "english": "This store's taste is indeed good. You have good taste.", "vietnamese": "Gu của cửa hàng này đúng là tốt. Bạn có con mắt tinh tường." },
      { "japanese": "今手が離せないので、後で連絡します。", "english": "I'm tied up right now, so I'll contact you later.", "vietnamese": "Bây giờ tôi đang bận, nên sẽ liên lạc sau." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "新しい部長、どう思う？", "english": "What do you think of the new department head?" },
      { "speaker": "B", "japanese": "頭が切れるし、気が利く人だね。でも、たまに耳が痛いことを言うよ。", "english": "He's sharp-minded and considerate. But sometimes he says things that are hard to hear." },
      { "speaker": "A", "japanese": "それはいいことじゃない？成長できるから。", "english": "Isn't that good? Because you can grow." },
      { "speaker": "B", "japanese": "そうだけど、腹が立つ時もあるよ。", "english": "That's true, but sometimes I get angry." }
    ],
    "exercises": [
      "Fill-blank: 彼女は（ ）が広いから、パーティーにたくさん人が来た。（顔／手）",
      "Matching: Match each idiom (足を引っ張る, 口が重い, 目が高い, 頭が切れる) with its meaning.",
      "Translation: Translate 'I can't leave now because I'm tied up with work' into Japanese using an appropriate idiom."
    ]
  },
  {
    "id": 48,
    "title": "Slang and colloquial (スラングとこうご)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "スラング", "english": "slang", "vietnamese": "tiếng lóng" },
      { "japanese": "めっちゃ", "english": "very (Kansai dialect, used nationwide)", "vietnamese": "rất, siêu" },
      { "japanese": "やばい", "english": "awesome/terrible (slang)", "vietnamese": "ngầu/tệ hại" },
      { "japanese": "ウケる", "english": "hilarious (slang)", "vietnamese": "buồn cười" },
      { "japanese": "ガチ", "english": "serious (slang)", "vietnamese": "thật sự, nghiêm túc" },
      { "japanese": "マジ", "english": "really? (slang)", "vietnamese": "thật á?" },
      { "japanese": "超（ちょう）", "english": "super (colloquial)", "vietnamese": "siêu" },
      { "japanese": "だるい", "english": "troublesome/lazy (slang)", "vietnamese": "mệt mỏi, lười" },
      { "japanese": "きもい", "english": "gross/disgusting (slang)", "vietnamese": "ghê" },
      { "japanese": "うざい", "english": "annoying (slang)", "vietnamese": "phiền phức" }
    ],
    "grammar": [
      { "point": "Colloquial contractions", "explanation": "In casual speech, full forms are often shortened (e.g., ている→てる, でしょう→でしょ, のか→の). Slang words replace standard adjectives." },
      { "point": "引用の「って」", "explanation": "In casual speech, と is often replaced by って to indicate what someone said (e.g., 彼は行くって言ってた)." }
    ],
    "examples": [
      { "japanese": "このラーメン、めっちゃうまい！", "english": "This ramen is super delicious!", "vietnamese": "Mì ramen này siêu ngon!" },
      { "japanese": "昨日の映画、やばかったよ。", "english": "Yesterday's movie was awesome (or terrible depending on context).", "vietnamese": "Bộ phim hôm qua tuyệt vời/tệ quá." },
      { "japanese": "あのジョーク、ウケる！", "english": "That joke is hilarious!", "vietnamese": "Câu đùa đó buồn cười quá!" },
      { "japanese": "マジで？それは信じられない。", "english": "Really? That's unbelievable.", "vietnamese": "Thật á? Không thể tin được." },
      { "japanese": "彼の話はだるいから聞きたくない。", "english": "His talk is troublesome, I don't want to listen.", "vietnamese": "Câu chuyện của anh ấy mệt mỏi, tôi không muốn nghe." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "昨日のライブ、超最高だった！", "english": "Yesterday's live show was super amazing!" },
      { "speaker": "B", "japanese": "マジで？行けばよかった！", "english": "Really? I should have gone!" },
      { "speaker": "A", "japanese": "うん、でも最後の曲はちょっときもかったかも。", "english": "Yeah, but the last song might have been a bit gross." },
      { "speaker": "B", "japanese": "えー、何それ。ウケる。", "english": "Huh, what's that? Hilarious." }
    ],
    "exercises": [
      "Fill-blank: 今日の宿題、量が（ ）多い。（めっちゃ／だるい）",
      "Matching: Match each slang word (やばい, ウケる, ガチ, うざい) with its appropriate usage scenario.",
      "Translation: Translate 'He's seriously annoying' into Japanese using slang."
    ]
  },
  {
    "id": 49,
    "title": "Debating skills (ディベート)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "ディベート", "english": "debate", "vietnamese": "tranh luận" },
      { "japanese": "賛成", "english": "agreement", "vietnamese": "đồng ý" },
      { "japanese": "反対", "english": "opposition", "vietnamese": "phản đối" },
      { "japanese": "主張する", "english": "to assert", "vietnamese": "khẳng định" },
      { "japanese": "論点", "english": "point of argument", "vietnamese": "luận điểm" },
      { "japanese": "証拠", "english": "evidence", "vietnamese": "bằng chứng" },
      { "japanese": "反論する", "english": "to rebut", "vietnamese": "phản biện" },
      { "japanese": "譲歩する", "english": "to concede", "vietnamese": "nhượng bộ" },
      { "japanese": "要約する", "english": "to summarize", "vietnamese": "tóm tắt" },
      { "japanese": "結論", "english": "conclusion", "vietnamese": "kết luận" }
    ],
    "grammar": [
      { "point": "〜という観点から", "explanation": "From the perspective of ~. Useful when presenting a side of an argument." },
      { "point": "〜にもかかわらず", "explanation": "In spite of ~. Used to introduce a counterargument." },
      { "point": "〜というわけではない", "explanation": "It's not that ~. Used to clarify or soften a statement." }
    ],
    "examples": [
      { "japanese": "経済的な観点から言えば、この政策は有効です。", "english": "From an economic perspective, this policy is effective.", "vietnamese": "Từ góc độ kinh tế, chính sách này có hiệu quả." },
      { "japanese": "反対意見もありますが、私の主張は変わりません。", "english": "There are opposing opinions, but my assertion remains unchanged.", "vietnamese": "Có ý kiến phản đối, nhưng tôi vẫn giữ quan điểm." },
      { "japanese": "環境への影響が大きいにもかかわらず、その計画は進められています。", "english": "In spite of the large environmental impact, the plan is proceeding.", "vietnamese": "Mặc dù có tác động lớn đến môi trường, kế hoạch vẫn được tiến hành." },
      { "japanese": "すべての人が賛成しているというわけではありません。", "english": "It's not that everyone agrees.", "vietnamese": "Không phải tất cả mọi người đều đồng ý." },
      { "japanese": "結論として、私はこの提案に賛成します。", "english": "In conclusion, I agree with this proposal.", "vietnamese": "Kết luận, tôi đồng ý với đề xuất này." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "では、最初に賛成側の意見をお願いします。", "english": "Then, first let's hear from the affirmative side." },
      { "speaker": "B", "japanese": "私はマスク着用の義務化に賛成です。その理由は、感染リスクを減らせるからです。", "english": "I am in favor of mandatory mask-wearing because it reduces the risk of infection." },
      { "speaker": "A", "japanese": "反対側、反論はありますか。", "english": "Opposition, do you have a rebuttal?" },
      { "speaker": "B", "japanese": "はい。自由の制限になるという観点から反対します。また、証拠も不十分です。", "english": "Yes. From the perspective of restricting freedom, I oppose it. Also, the evidence is insufficient." }
    ],
    "exercises": [
      "Fill-blank: 環境保護の（ ）から、この法案は重要だ。（観点／結論）",
      "Matching: Match each debate phrase (賛成する, 反論する, 譲歩する, 要約する) with its meaning.",
      "Translation: Translate 'There are pros and cons, but I think the pros outweigh the cons' into Japanese."
    ]
  },
  {
    "id": 50,
    "title": "Final comprehensive review (そうごうふくしゅう)",
    "level": "upper-intermediate",
    "vocabulary": [
      { "japanese": "総合", "english": "comprehensive", "vietnamese": "tổng hợp" },
      { "japanese": "復習", "english": "review", "vietnamese": "ôn tập" },
      { "japanese": "応用", "english": "application", "vietnamese": "ứng dụng" },
      { "japanese": "まとめる", "english": "to summarize", "vietnamese": "tổng kết" },
      { "japanese": "弱点", "english": "weak point", "vietnamese": "điểm yếu" },
      { "japanese": "強化する", "english": "to strengthen", "vietnamese": "củng cố" },
      { "japanese": "実践", "english": "practice", "vietnamese": "thực hành" },
      { "japanese": "テスト", "english": "test", "vietnamese": "bài kiểm tra" },
      { "japanese": "達成感", "english": "sense of achievement", "vietnamese": "cảm giác hoàn thành" },
      { "japanese": "次のステップ", "english": "next step", "vietnamese": "bước tiếp theo" }
    ],
    "grammar": [
      { "point": "復習と応用", "explanation": "This lesson reviews key grammar points from lessons 41-49: comparisons, hypotheticals, reported speech, passive, relative clauses, conditionals, idioms, slang, and debating expressions. Practice using them in context." },
      { "point": "自由会話と作文", "explanation": "Learners should create sentences and short paragraphs using a mix of structures. Focus on accuracy and natural flow." }
    ],
    "examples": [
      { "japanese": "もし時間があったら、日本語の勉強をもっとしたいです。でも、現実にはなかなか時間が取れません。", "english": "If I had time, I would like to study Japanese more. But in reality, I can't easily find time.", "vietnamese": "Nếu có thời gian, tôi muốn học tiếng Nhật nhiều hơn. Nhưng thực tế khó có thời gian." },
      { "japanese": "彼が言っていたことは、必ずしも正しいというわけではない。", "english": "What he said is not necessarily correct.", "vietnamese": "Điều anh ấy nói không nhất thiết đúng." },
      { "japanese": "この問題は難しいけれど、君ならできると信じている。", "english": "This problem is difficult, but I believe you can do it.", "vietnamese": "Bài toán này khó, nhưng tôi tin bạn làm được." },
      { "japanese": "あの店のラーメン、めちゃくちゃおいしいって友達が言ってた。", "english": "My friend said that ramen at that shop is super delicious.", "vietnamese": "Bạn tôi nói mì ramen ở quán đó siêu ngon." },
      { "japanese": "結論として、この計画には賛成できません。理由はいくつかあります。", "english": "In conclusion, I cannot agree with this plan. There are several reasons.", "vietnamese": "Kết luận, tôi không thể đồng ý với kế hoạch này. Có một vài lý do." }
    ],
    "dialogue": [
      { "speaker": "A", "japanese": "今学期の日本語の授業、どうだった？", "english": "How was this semester's Japanese class?" },
      { "speaker": "B", "japanese": "とても勉強になったよ。特に関係節と条件文がしっかり理解できた。", "english": "I learned a lot. Especially I could understand relative clauses and conditional sentences well." },
      { "speaker": "A", "japanese": "じゃあ、次のレベルに進む準備はできてるね。", "english": "Then you're ready to move to the next level." },
      { "speaker": "B", "japanese": "うん、でもまだ弱点もあるから、復習を続けたい。", "english": "Yeah, but I still have weak points, so I want to keep reviewing." }
    ],
    "exercises": [
      "Fill-blank: 彼女は日本語が上手だ（ ）聞いた。（そう／と）",
      "Matching: Match each sentence pattern from previous lessons (comparison, passive, conditional, idiom) with its example.",
      "Translation: Translate a short paragraph: 'Although I was busy, I went to the party because my friend said he would be there. If I hadn't gone, I would have missed a great time.' into Japanese, using at least two different conditionals and reported speech."
    ]
  }
];