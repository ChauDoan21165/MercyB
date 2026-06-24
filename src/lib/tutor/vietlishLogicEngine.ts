// Lane A conversation engine (ConversationMode → vietlishLogicEngine) draws on
// the curated Vietlish seed corpus to detect and correct calques, word-order,
// register, collocation, false-friend, and literal-translation errors. The
// corpus is data-only; re-exported here so the engine has a single import home.
//
// Step 007: Explanations deepened with Vietnamese linguistic-contrast context
// that a skilled human teacher would provide — consistently in Vietnamese so
// the learner understands the *why* in their native language, not just the *what*.
export {
  VIETLISH_CORPUS,
  type VietlishCorpusEntry,
  type VietlishCorpusCategory,
  type VietlishCorpusFrequency,
} from "./vietlishCorpus";

export type VietlishInterferenceCategory =
  | "missing_word"       // English requires a word Vietnamese omits (articles, prepositions, auxiliaries)
  | "extra_word"         // Vietnamese calque adds a word English doesn't need
  | "word_order"         // Vietnamese topic-comment vs English SVO
  | "verb_form"          // Vietnamese no-inflection vs English tense/aspect
  | "word_choice"        // Vietnamese one-word-many-uses vs English precise words
  | "noun_form"          // Vietnamese no plural marking vs English countability
  | "other";

export type VietlishLogicDiagnosis = {
  originalPattern: string;
  correctedExample: string;
  vietnameseThinking: string;
  englishLogic: string;
  rememberRule: string;
  retryPrompt: string;
  /** Step 007: The linguistic root-cause category for analytics + teacher adaptation. */
  category?: VietlishInterferenceCategory;
};

export type VietlishLogicDiagnosisResult = VietlishLogicDiagnosis & {
  patternId: string | null;
  isKnownPattern: boolean;
  fallbackMessage?: string;
};

type VietlishPattern = {
  id: string;
  match: RegExp;
  category: VietlishInterferenceCategory;
  diagnosis: VietlishLogicDiagnosis;
};

// ─── Fallback ──────────────────────────────────────────────────────────────

const UNKNOWN_FALLBACK_MESSAGE =
  "Mercy vẫn có thể giải thích logic tiếng Anh cho bạn. " +
  "Thử một câu ngắn như: I go school, I very like English, hoặc I buy hat yesterday.";

const UNKNOWN_DIAGNOSIS: VietlishLogicDiagnosis = {
  originalPattern: "Mẫu câu chưa có trong thư viện logic của Mercy",
  correctedExample:
    "Thử viết lại câu với một chủ ngữ rõ ràng, một động từ chính, và dấu hiệu thời gian nếu có.",
  vietnameseThinking:
    "Tiếng Việt là ngôn ngữ đơn lập — từ không biến đổi hình thái, quan hệ ngữ pháp được thể hiện qua trật tự từ và ngữ cảnh. " +
    "Vì vậy, khi chuyển sang tiếng Anh (ngôn ngữ biến hình), người Việt thường bỏ sót các yếu tố như thì của động từ, mạo từ, giới từ, và dạng số nhiều — " +
    "những thứ tiếng Việt không cần nhưng tiếng Anh bắt buộc phải có.",
  englishLogic:
    "Tiếng Anh yêu cầu mỗi câu phải thể hiện rõ: ai làm (chủ ngữ), làm gì (động từ chia theo thì), " +
    "với cái gì/ai (tân ngữ), ở đâu/khi nào (giới từ + thời gian). " +
    "Những mối quan hệ này phải được 'nhìn thấy' trong câu — không thể dựa vào ngữ cảnh như tiếng Việt.",
  rememberRule:
    "Kiểm tra 4 thứ: (1) có chủ ngữ không? (2) động từ đã chia thì chưa? " +
    "(3) danh từ đếm được số ít có a/an không? (4) có giới từ cho nơi chốn/thời gian không?",
  retryPrompt:
    "Viết lại một câu thật ngắn. Bạn muốn nói ai làm gì, ở đâu, khi nào?",
};

// ─── Pattern library ───────────────────────────────────────────────────────
//
// Each pattern explains a specific Vietnamese→English transfer error.
// Explanations are in Vietnamese (the learner's native language) so the
// learner grasps the *linguistic reason* behind the error, not just the
// surface correction. A real teacher explains why — not just what.
//
// Category guide:
//   missing_word  — English needs a word Vietnamese grammar omits
//   extra_word    — Vietnamese calque adds a word English doesn't need
//   word_order    — Vietnamese topic-comment structure transferred to English
//   verb_form     — Vietnamese no-inflection vs English tense marking
//   word_choice   — Vietnamese one-word-fits-many vs English distinct words
//   noun_form     — Vietnamese no plural/countability marking

const PATTERNS: VietlishPattern[] = [
  // ── missing_word ──────────────────────────────────────────────────────
  {
    id: "go-school",
    match: /\b(?:i|you|we|they|he|she)\s+(?:go|goes|went|come|comes|came|walk|walks|walked|run|runs|ran)\s+(?:school|work|home|hospital|market|store|shop|park)\b(?!\s+(?:to|toward|into|from|at|in|on|every|today|yesterday|tomorrow|with|and|because|but|so|or))\b/i,
    category: "missing_word",
    diagnosis: {
      originalPattern: "I go school.",
      correctedExample: "I go to school.",
      vietnameseThinking:
        "Trong tiếng Việt, điểm đến có thể đứng ngay sau động từ chuyển động mà không cần từ nối: " +
        "'Tôi đi học', 'Em đến trường'. Tiếng Việt dùng trật tự từ để thể hiện mối quan hệ — " +
        "động từ + đích đến là đủ rõ nghĩa. Nhưng tiếng Anh cần một từ nối (giới từ) để đánh dấu " +
        "mối quan hệ giữa hành động và điểm đến.",
      englishLogic:
        "Trong tiếng Anh, động từ chuyển động (go, come, walk, run) cần giới từ 'to' " +
        "để chỉ hướng đến một nơi cụ thể. Không có 'to', câu nghe như đang thiếu một phần — " +
        "giống như nói 'Tôi đang đi...' rồi dừng giữa chừng.",
      rememberRule: "Động từ di chuyển + to + nơi đến. Ngoại lệ: go home (không có to).",
      retryPrompt: "Viết một câu với go to + một nơi bạn thường đến.",
      category: "missing_word",
    },
  },
  {
    id: "missing-article",
    match: /\b(?:i|you|we|they|he|she|it)\s+(?:am|is|are|was|were|have|has|had|buy|buys|bought|want|wants|wanted|need|needs|needed|see|sees|saw|like|likes|liked|get|gets|got|make|makes|made)\s+(?:hat|teacher|book|car|apple|job|doctor|student|dog|cat|house|phone|computer|friend|movie|song|shirt|bag|pen|cup|chair|table)(?:\s|$)(?!\s*(?:a|an|the|my|your|his|her|our|their|this|that|these|those|some|any|many|much|more|most|each|every|one|two|three))\b/i,
    category: "missing_word",
    diagnosis: {
      originalPattern: "I bought hat yesterday. / She is teacher.",
      correctedExample: "I bought a hat yesterday. / She is a teacher.",
      vietnameseThinking:
        "Tiếng Việt không có hệ thống mạo từ (a/an/the). Khi nói 'Tôi mua mũ' hay 'Cô ấy là giáo viên', " +
        "danh từ đứng một mình vẫn đủ nghĩa. Người Việt dùng bộ phân loại (classifier) như 'cái', 'chiếc', 'con' " +
        "để chỉ định danh từ, nhưng đây không phải mạo từ — chúng chỉ phân loại, không đánh dấu xác định/bất định. " +
        "Vì vậy, khi chuyển sang tiếng Anh, người Việt thường quên thêm a/an/the vì não không quen 'nhìn thấy' chúng.",
      englishLogic:
        "Trong tiếng Anh, danh từ đếm được số ít hầu như luôn cần a/an/the đứng trước. " +
        "Nếu không có, câu nghe như đang thiếu một mảnh ghép — giống như nói 'mình mua... mũ' " +
        "mà không rõ là cái mũ nào, mũ gì. A/an/the là 'đèn tín hiệu' cho người nghe biết " +
        "danh từ đó là mới (a/an) hay đã biết (the).",
      rememberRule: "Một vật đếm được số ít → thêm a/an trước danh từ. A đứng trước phụ âm, an đứng trước nguyên âm.",
      retryPrompt: "Viết một câu với a/an + một đồ vật hoặc nghề nghiệp.",
      category: "missing_word",
    },
  },
  // ── verb_form ──────────────────────────────────────────────────────────
  {
    id: "yesterday-present",
    match: /\b(?:i|you|we|they|he|she)\s+(?:buy|go|eat|have|do|see|come|take|give|make|get|drink|write|speak|run|sing|swim|drive|fly|read|sit|stand|sleep|wake|meet)\s+.*\b(?:yesterday|last\s+(?:night|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/i,
    category: "verb_form",
    diagnosis: {
      originalPattern: "I buy a hat yesterday.",
      correctedExample: "I bought a hat yesterday.",
      vietnameseThinking:
        "Tiếng Việt là ngôn ngữ đơn lập, không biến hình: động từ giữ nguyên một dạng bất kể thời gian. " +
        "'Hôm qua tôi mua' và 'Ngày mai tôi mua' dùng cùng một từ 'mua'. Thời gian được thể hiện qua " +
        "từ chỉ thời gian (hôm qua, ngày mai), không qua động từ. Vì vậy, người Việt học tiếng Anh " +
        "thường quên chia động từ ở thì quá khứ vì não không có thói quen 'biến đổi từ theo thời gian'.",
      englishLogic:
        "Tiếng Anh là ngôn ngữ biến hình: động từ thay đổi hình thái để báo hiệu thời gian. " +
        "Khi có 'yesterday', động từ PHẢI ở dạng quá khứ. Từ chỉ thời gian và dạng động từ " +
        "phải khớp nhau — đây là quy tắc bắt buộc, không phải tùy chọn. " +
        "Giống như một ổ khóa: yesterday là chìa, và động từ quá khứ là ổ — phải khớp thì mới mở được.",
      rememberRule: "Thấy dấu hiệu quá khứ (yesterday, last week, ago) → động từ phải ở dạng quá khứ (V2/V-ed).",
      retryPrompt: "Viết một câu với 'yesterday' và một động từ ở thì quá khứ.",
      category: "verb_form",
    },
  },
  {
    id: "unmarked-past-common",
    match: /\b(?:i|you|we|they|he|she)\s+(?:go|eat|have|do|see|come|take|give|make|get|drink|write|speak|run|sing)\s+.*\b(?:ago|in\s+(?:202|201)\d|this\s+morning|just\s+now)\b/i,
    category: "verb_form",
    diagnosis: {
      originalPattern: "I go to the market this morning.",
      correctedExample: "I went to the market this morning.",
      vietnameseThinking:
        "Giống như lỗi 'yesterday + hiện tại', người Việt thường quên chia quá khứ khi có các từ như ago, " +
        "this morning (nếu buổi sáng đã qua), in 2020... Vì tiếng Việt không biến đổi động từ, " +
        "não người Việt không tự động 'kích hoạt' việc chia thì khi thấy từ chỉ thời gian.",
      englishLogic:
        "Ago, last ____, in [năm đã qua], this morning (khi đã qua) đều là tín hiệu quá khứ. " +
        "Động từ phải ở dạng quá khứ để khớp với tín hiệu này. Đây là quy tắc cứng — không có ngoại lệ.",
      rememberRule: "Ago = quá khứ. This morning (đã qua) = quá khứ. Luôn kiểm tra thì của động từ.",
      retryPrompt: "Viết một câu với 'ago' hoặc 'this morning' và động từ quá khứ.",
      category: "verb_form",
    },
  },
  // ── noun_form ──────────────────────────────────────────────────────────
  {
    id: "plural-after-quantity",
    match: /\b(?:two|three|four|five|six|seven|eight|nine|ten|many|some|several|a few|a couple of|a lot of|lots of|a number of)\s+(?:book|student|friend|day|hour|question|person|child|woman|man|apple|car|house|dog|cat|pen|cup|bag|shoe|shirt|table|chair|phone|computer|movie|song|idea|problem|mistake|lesson|class|teacher|doctor|job|task|project|skill|word|sentence|page|picture|photo|game|toy|gift|card|letter|number|color|country|city|language|animal|plant|flower|tree)\b(?!\s*(?:s|es|ies|ren|en|'s))\b/i,
    category: "noun_form",
    diagnosis: {
      originalPattern: "I have two book. / Many student like English.",
      correctedExample: "I have two books. / Many students like English.",
      vietnameseThinking:
        "Tiếng Việt không có phạm trù số nhiều trên danh từ. 'Hai quyển sách' hay 'nhiều học sinh' — " +
        "danh từ vẫn giữ nguyên một dạng. Số lượng được thể hiện qua từ chỉ số lượng (hai, nhiều) " +
        "và bộ phân loại (quyển, người), không qua biến đổi hình thái của danh từ. " +
        "Vì vậy, người Việt học tiếng Anh thường quên thêm -s/-es vì não không quen 'đánh dấu số nhiều trên từ'.",
      englishLogic:
        "Trong tiếng Anh, danh từ đếm được số nhiều PHẢI có -s/-es (hoặc dạng bất quy tắc). " +
        "Khi có từ chỉ số lượng (two, many, some), danh từ bắt buộc phải ở dạng số nhiều — " +
        "đây là sự hòa hợp (agreement) giữa từ chỉ lượng và danh từ. " +
        "Giống như một cặp đôi: từ chỉ lượng và danh từ số nhiều phải đi cùng nhau.",
      rememberRule: "Có số từ 2 trở lên hoặc many/some/several → danh từ đếm được thêm -s/-es.",
      retryPrompt: "Viết một câu với two hoặc many + danh từ số nhiều.",
      category: "noun_form",
    },
  },
  {
    id: "countable-uncountable",
    match: /\b(?:an?\s+advice|advices|an?\s+information|informations|an?\s+furniture|furnitures|an?\s+homework|homeworks|an?\s+luggage|luggages|an?\s+equipment|equipments|an?\s+news\b|an?\s+progress|progresses\b)\b/i,
    category: "noun_form",
    diagnosis: {
      originalPattern: "She gave me an advice.",
      correctedExample: "She gave me some advice. / She gave me a piece of advice.",
      vietnameseThinking:
        "Tiếng Việt không phân biệt danh từ đếm được và không đếm được. 'Một lời khuyên' hay 'một thông tin' " +
        "đều dùng từ 'một' như nhau. Nhưng trong tiếng Anh, advice, information, furniture, homework, luggage, " +
        "equipment, news, progress là những danh từ KHÔNG đếm được — không thể dùng a/an hoặc thêm -s. " +
        "Đây là một khái niệm không tồn tại trong tiếng Việt, nên người học cần ghi nhớ từng từ.",
      englishLogic:
        "Danh từ không đếm được trong tiếng Anh không đi với a/an và không có dạng số nhiều. " +
        "Để nói về số lượng, dùng some, a lot of, a piece of, hoặc một đơn vị đo lường. " +
        "Ví dụ: some advice (không phải an advice), a piece of furniture (không phải a furniture).",
      rememberRule: "Advice, information, furniture, homework, luggage, equipment: không a/an, không -s. Dùng some hoặc a piece of.",
      retryPrompt: "Viết một câu dùng 'some advice' hoặc 'a piece of advice'.",
      category: "noun_form",
    },
  },
  // ── word_order ─────────────────────────────────────────────────────────
  {
    id: "topic-comment-word-order",
    match: /\b(?:this\s+(?:book|movie|song|lesson|problem|idea|food|place|city|job|car|phone|computer|shirt|bag|story|game|question)\s+(?:i|you|we|they|he|she)\s+(?:like|love|hate|want|need|study|learn|watch|read|eat|drink|play|use|enjoy|prefer|choose|remember|understand|know|see|hear))\b/i,
    category: "word_order",
    diagnosis: {
      originalPattern: "This book I like. / English I study every day.",
      correctedExample: "I like this book. / I study English every day.",
      vietnameseThinking:
        "Tiếng Việt là ngôn ngữ 'chủ đề nổi bật' (topic-prominent): có thể đưa chủ đề lên đầu câu " +
        "rồi mới nói về nó. 'Cuốn sách này tôi thích' là câu hoàn toàn tự nhiên trong tiếng Việt — " +
        "chủ đề (cuốn sách) đứng trước, bình luận (tôi thích) đứng sau. Nhưng tiếng Anh là ngôn ngữ " +
        "'chủ ngữ nổi bật' (subject-prominent): câu cơ bản luôn theo trật tự Chủ ngữ + Động từ + Tân ngữ.",
      englishLogic:
        "Trong tiếng Anh cơ bản, chủ ngữ (người/vật thực hiện hành động) phải đứng đầu câu, " +
        "rồi đến động từ, rồi đến tân ngữ (người/vật nhận hành động). Nếu đưa tân ngữ lên đầu, " +
        "câu sẽ nghe lạ hoặc sai ngữ pháp — giống như nói 'Cái bánh tôi ăn' thay vì 'Tôi ăn cái bánh'. " +
        "(Tiếng Anh CÓ thể đảo để nhấn mạnh, nhưng cần cấu trúc đặc biệt — không áp dụng cho câu cơ bản.)",
      rememberRule: "Câu cơ bản tiếng Anh: Chủ ngữ (ai) + Động từ (làm gì) + Tân ngữ (cái gì/ai).",
      retryPrompt: "Viết lại một câu theo thứ tự: I + verb + object.",
      category: "word_order",
    },
  },
  {
    id: "adverb-placement",
    match: /\b(?:i|you|we|they|he|she)\s+(?:in\s+the\s+morning|every\s+day|yesterday|always|usually|sometimes|never|often|rarely)\s+(?:usually\s+)?(?:drink|study|go|eat|play|work|read|watch|sleep|wake|run|walk)\b/i,
    category: "word_order",
    diagnosis: {
      originalPattern: "I in the morning usually drink coffee.",
      correctedExample: "I usually drink coffee in the morning.",
      vietnameseThinking:
        "Tiếng Việt có trật tự từ khá linh hoạt. 'Sáng nào tôi cũng uống cà phê' hay 'Tôi sáng nào cũng uống cà phê' " +
        "đều tự nhiên. Trạng từ thời gian có thể đứng đầu câu hoặc gần cuối câu. " +
        "Nhưng tiếng Anh có quy tắc vị trí trạng từ khá cứng — đặc biệt là trạng từ tần suất (usually, always, sometimes).",
      englishLogic:
        "Trong tiếng Anh, trạng từ tần suất (usually, always, sometimes, never, often) đứng TRƯỚC động từ chính " +
        "nhưng SAU động từ 'to be'. Trạng từ thời gian (in the morning, every day) thường đứng CUỐI câu. " +
        "Thứ tự đúng: Chủ ngữ + trạng từ tần suất + động từ + tân ngữ + trạng từ thời gian.",
      rememberRule: "Trạng từ tần suất (always, usually) đứng trước động từ thường. Trạng từ thời gian đứng cuối câu.",
      retryPrompt: "Viết một câu theo thứ tự: I usually + verb + ... + time.",
      category: "word_order",
    },
  },
  // ── word_choice ────────────────────────────────────────────────────────
  {
    id: "very-like",
    match: /\b(?:i|you|we|they|he|she)\s+very\s+(?:like|love|hate|want|need|enjoy|prefer|miss|remember|forget|understand|believe|know|think|feel|wish|hope)\b/i,
    category: "word_choice",
    diagnosis: {
      originalPattern: "I very like English.",
      correctedExample: "I really like English. / I like English very much.",
      vietnameseThinking:
        "Trong tiếng Việt, 'rất' có thể đứng trước cả tính từ (rất đẹp) lẫn động từ chỉ cảm xúc (rất thích, rất yêu, rất nhớ). " +
        "Vì vậy, người Việt dịch thẳng 'rất thích' → 'very like'. Nhưng trong tiếng Anh, 'very' CHỈ bổ nghĩa cho tính từ " +
        "và trạng từ, KHÔNG bổ nghĩa cho động từ. Đây là một trong những lỗi 'dịch từng chữ' phổ biến nhất.",
      englishLogic:
        "Trong tiếng Anh, 'very' chỉ đứng trước tính từ/trạng từ (very good, very quickly). " +
        "Để nhấn mạnh động từ, dùng 'really' (really like) hoặc '...very much' (like...very much). " +
        "Phân biệt: very + adj/adv, really + verb/adj, ...very much đứng cuối câu sau tân ngữ.",
      rememberRule: "Rất + động từ → really + verb (đứng trước) hoặc verb + ... very much (đứng sau tân ngữ).",
      retryPrompt: "Viết một câu với really + một động từ bạn thích.",
      category: "word_choice",
    },
  },
  {
    id: "interesting-interested",
    match: /\b(?:i|you|we|they|he|she|it)\s+(?:am|is|are|was|were|feel|feels|felt|feeling)\s+interesting\s+(?:in|about|with|by|at|to)\b/i,
    category: "word_choice",
    diagnosis: {
      originalPattern: "I am interesting in English.",
      correctedExample: "I am interested in English.",
      vietnameseThinking:
        "Tiếng Việt dùng một từ 'thú vị' hoặc 'hứng thú' cho cả hai nghĩa: (1) thứ gây hứng thú, (2) cảm giác hứng thú. " +
        "'Tôi thấy thú vị' và 'Bộ phim này thú vị' dùng chung một từ. Nhưng tiếng Anh phân biệt rõ: " +
        "-ing (interesting, boring, exciting) mô tả TÍNH CHẤT của sự vật; " +
        "-ed (interested, bored, excited) mô tả CẢM GIÁC của con người.",
      englishLogic:
        "Quy tắc: -ing = tính chất của vật/việc (The movie is interesting). " +
        "-ed = cảm giác của người (I am interested in the movie). " +
        "Đây là quy tắc áp dụng cho nhiều cặp tính từ: boring/bored, exciting/excited, tiring/tired, surprising/surprised...",
      rememberRule: "Người → -ed (I'm interested). Vật/sự việc → -ing (It's interesting). Học theo cặp: bored/boring, excited/exciting...",
      retryPrompt: "Viết một câu với 'I am interested in' + một chủ đề bạn thích.",
      category: "word_choice",
    },
  },
  {
    id: "say-tell-confusion",
    match: /\b(?:say|says|said|saying)\s+(?:me|you|him|her|us|them)\s+(?:the|this|that|a|an|why|how|what|when|where|about|to)\b/i,
    category: "word_choice",
    diagnosis: {
      originalPattern: "She said me the truth.",
      correctedExample: "She told me the truth.",
      vietnameseThinking:
        "Tiếng Việt dùng 'nói' cho hầu hết các tình huống giao tiếp: nói với ai, nói điều gì, nói rằng... " +
        "Nhưng tiếng Anh phân biệt: say (nói ra lời — tập trung vào nội dung lời nói) và tell (kể cho ai — " +
        "tập trung vào người nghe). Say + to + person; Tell + person (không cần to).",
      englishLogic:
        "Say: nhấn mạnh NỘI DUNG lời nói. Khi có người nghe, phải thêm 'to': say to me. " +
        "Tell: nhấn mạnh NGƯỜI NGHE. Người nghe đứng ngay sau tell: tell me. Cấu trúc: tell + person + something.",
      rememberRule: "Say + to + person. Tell + person (+ something). 'Nói với tôi' = tell me (không phải say me).",
      retryPrompt: "Viết một câu với 'tell me' hoặc 'told me'.",
      category: "word_choice",
    },
  },
  {
    id: "age-have-be",
    match: /\b(?:i|you|we|they)\s+have\s+\d{1,3}\s+years?\s+old\b|\b(?:he|she|it)\s+has\s+\d{1,3}\s+years?\s+old\b/i,
    category: "word_choice",
    diagnosis: {
      originalPattern: "I have 20 years old.",
      correctedExample: "I am 20 years old.",
      vietnameseThinking:
        "Trong tiếng Việt, tuổi tác được diễn đạt bằng động từ 'có': 'Tôi có 20 tuổi'. " +
        "Người Việt dịch thẳng 'có' → 'have', tạo ra 'I have 20 years old'. " +
        "Nhưng tiếng Anh dùng động từ 'to be' (thì, là, ở) để nói về tuổi: I am 20 (years old). " +
        "Đây là lỗi dịch từng chữ từ Tiếng Việt — 'có' không phải lúc nào cũng là 'have'.",
      englishLogic:
        "Tuổi tác trong tiếng Anh được xem như một TRẠNG THÁI (giống như 'Tôi cao', 'Tôi béo'), " +
        "nên dùng động từ 'to be'. Cấu trúc: I am + [số] + (years old). Có thể bỏ 'years old' trong văn nói: I am 20.",
      rememberRule: "Tuổi → dùng 'be' (am/is/are), không dùng 'have'. I am 20. She is 25 years old.",
      retryPrompt: "Viết một câu giới thiệu tuổi của bạn dùng 'I am ... years old'.",
      category: "word_choice",
    },
  },
  {
    id: "open-turn-on",
    match: /\b(?:open|opens|opened|opening)\s+(?:the\s+)?(?:light|lights|fan|fans?|air\s*conditioner|computer|television|tv|radio|heater|stove|oven|machine)\b(?!\s+(?:the\s+)?(?:door|window|box|bag|book|bottle|case))\b/i,
    category: "word_choice",
    diagnosis: {
      originalPattern: "Can you open the light?",
      correctedExample: "Can you turn on the light?",
      vietnameseThinking:
        "Tiếng Việt dùng từ 'mở' cho rất nhiều hành động: mở cửa, mở đèn, mở quạt, mở máy lạnh, mở TV... " +
        "'Mở' là một từ đa năng bao phủ cả open (mở vật lý) lẫn turn on (bật thiết bị điện). " +
        "Vì vậy, người Việt thường dịch 'mở' → 'open' cho mọi thứ, kể cả thiết bị điện.",
      englishLogic:
        "Tiếng Anh phân biệt rõ: 'Open' = mở vật lý (cửa, hộp, sách, chai). " +
        "'Turn on' = bật/kích hoạt thiết bị điện/điện tử (đèn, quạt, TV, máy lạnh). " +
        "'Open the light' nghe rất lạ với người bản xứ — giống như bạn đang mở cái bóng đèn ra vậy!",
      rememberRule: "Thiết bị điện/điện tử → turn on / turn off. Vật lý (cửa, hộp, sách) → open / close.",
      retryPrompt: "Viết một câu với 'turn on' hoặc 'turn off' + một thiết bị điện.",
      category: "word_choice",
    },
  },
  // ── extra_word ─────────────────────────────────────────────────────────
  {
    id: "discuss-about",
    match: /\b(?:discuss|discusses|discussed|discussing)\s+about\b/i,
    category: "extra_word",
    diagnosis: {
      originalPattern: "We discussed about the plan.",
      correctedExample: "We discussed the plan.",
      vietnameseThinking:
        "Tiếng Việt nói 'thảo luận về' — có giới từ 'về' sau động từ. Người Việt dịch thẳng: " +
        "thảo luận = discuss, về = about → discuss about. Nhưng 'discuss' trong tiếng Anh " +
        "đã bao hàm nghĩa 'về' trong chính nó, nên không cần thêm 'about'. " +
        "Đây là lỗi thêm từ thừa do dịch từng thành phần từ tiếng Việt.",
      englishLogic:
        "Discuss là ngoại động từ (transitive verb) — nó nhận tân ngữ trực tiếp, không cần giới từ. " +
        "Cấu trúc đúng: discuss + topic (KHÔNG có about). Tuy nhiên, danh từ 'discussion' thì dùng với about: " +
        "have a discussion about something.",
      rememberRule: "Discuss + chủ đề (không about). Nhưng: a discussion about + chủ đề (có about).",
      retryPrompt: "Viết một câu với 'discuss' + một chủ đề (không dùng about).",
      category: "extra_word",
    },
  },
  {
    id: "mention-about",
    match: /\b(?:mention|mentions|mentioned|mentioning)\s+about\b/i,
    category: "extra_word",
    diagnosis: {
      originalPattern: "She mentioned about the schedule.",
      correctedExample: "She mentioned the schedule.",
      vietnameseThinking:
        "Giống như discuss, 'mention' (đề cập đến) đã bao hàm nghĩa 'về/đến' trong chính nó. " +
        "Người Việt thêm 'about' vì thói quen dịch 'đề cập VỀ' → 'mention ABOUT'. " +
        "Nhưng mention là ngoại động từ, nhận tân ngữ trực tiếp.",
      englishLogic:
        "Mention + something (trực tiếp, không có about). Nếu muốn dùng about, nói: talk about, speak about. " +
        "Phân biệt: She mentioned the problem. vs She talked about the problem.",
      rememberRule: "Mention + chủ đề (không about). Talk/Speak + about + chủ đề.",
      retryPrompt: "Viết một câu với 'mentioned' + một điều gì đó (không dùng about).",
      category: "extra_word",
    },
  },
  {
    id: "go-to-home",
    match: /\b(?:go|goes|went|going|come|comes|came|coming|get|gets|got|getting|arrive|arrives|arrived|arriving)\s+to\s+home\b(?!\s*(?:town|country|village|city|state|planet|base|plate|run|school|game|work|office))\b/i,
    category: "extra_word",
    diagnosis: {
      originalPattern: "I went to home after class.",
      correctedExample: "I went home after class.",
      vietnameseThinking:
        "Trong tiếng Việt, 'về nhà' dùng 'về' + 'nhà' — không có giới từ. Nhưng khi học tiếng Anh, " +
        "người Việt học quy tắc 'go to + nơi chốn' và áp dụng cho mọi nơi, kể cả home. " +
        "Tuy nhiên, 'home' là một trường hợp đặc biệt: nó là trạng từ (adverb) chỉ hướng, không phải danh từ chỉ nơi chốn thông thường.",
      englishLogic:
        "'Home' trong 'go home', 'come home', 'get home' là TRẠNG TỪ (adverb) — giống như 'here', 'there'. " +
        "Trạng từ chỉ hướng không cần giới từ. Nhưng nếu 'home' có từ bổ nghĩa (my home, his home), " +
        "nó trở thành danh từ và CẦN giới từ: go to my home.",
      rememberRule: "Go home, come home, get home: không 'to'. Nhưng: go to my/his/her home (có 'to').",
      retryPrompt: "Viết một câu với 'go home' hoặc 'went home'.",
      category: "extra_word",
    },
  },
  {
    id: "marry-with",
    match: /\b(?:marry|marries|married|marrying)\s+with\b/i,
    category: "extra_word",
    diagnosis: {
      originalPattern: "She married with her classmate.",
      correctedExample: "She married her classmate.",
      vietnameseThinking:
        "Tiếng Việt nói 'kết hôn VỚI ai' — có giới từ 'với'. Người Việt dịch: kết hôn = marry, với = with → marry with. " +
        "Nhưng 'marry' là ngoại động từ, nhận tân ngữ trực tiếp (người mình cưới). 'With' là thừa.",
      englishLogic:
        "Marry + person (cưới ai đó — trực tiếp, không có with). " +
        "Get married TO + person (cũng có nghĩa tương tự, nhưng dùng 'to', không dùng 'with'). " +
        "Phân biệt: She married him. / She got married to him.",
      rememberRule: "Marry + người (không with). Get married to + người (không with).",
      retryPrompt: "Viết một câu với 'married' + một người (không dùng with).",
      category: "extra_word",
    },
  },
  {
    id: "contact-with",
    match: /\b(?:contact|contacts|contacted|contacting)\s+with\b/i,
    category: "extra_word",
    diagnosis: {
      originalPattern: "Please contact with the manager.",
      correctedExample: "Please contact the manager.",
      vietnameseThinking:
        "Tiếng Việt nói 'liên hệ VỚI ai' — có giới từ 'với'. Người Việt dịch: liên hệ = contact, với = with → contact with. " +
        "Nhưng 'contact' khi là động từ nhận tân ngữ trực tiếp, không cần 'with'.",
      englishLogic:
        "Contact + person/place (trực tiếp, không có with). Nếu muốn dùng with, dùng cụm: get in contact with someone. " +
        "Phân biệt: Please contact me. / Please get in contact with me.",
      rememberRule: "Contact + người/nơi (không with). Nhưng: get in contact with + người (có with).",
      retryPrompt: "Viết một câu với 'contact' + một người (không dùng with).",
      category: "extra_word",
    },
  },
  {
    id: "double-comparative",
    match: /\bmore\s+(?:easier|harder|faster|slower|cheaper|older|younger|taller|shorter|bigger|smaller|stronger|weaker|richer|poorer|colder|hotter|warmer|closer|quicker|better|worse|longer|newer|cleaner|darker|lighter|softer|louder|quieter|busier|happier|prettier|uglier|safer|nicer)\s+than\b/i,
    category: "extra_word",
    diagnosis: {
      originalPattern: "This exercise is more easier than the last one.",
      correctedExample: "This exercise is easier than the last one.",
      vietnameseThinking:
        "Tiếng Việt tạo so sánh hơn bằng cách thêm 'hơn' sau tính từ: đẹp → đẹp hơn. " +
        "Khi học tiếng Anh, người Việt học hai cách: (1) thêm -er, (2) thêm more. " +
        "Vì sợ thiếu, nhiều người dùng CẢ HAI: more + easier. Nhưng đây là lỗi 'đúp' — chỉ cần MỘT trong hai.",
      englishLogic:
        "Tiếng Anh có HAI cách tạo so sánh hơn, và CHỈ ĐƯỢC DÙNG MỘT: " +
        "(1) Tính từ ngắn (1 âm tiết): thêm -er (easy → easier). " +
        "(2) Tính từ dài (2+ âm tiết): thêm more (beautiful → more beautiful). " +
        "Không bao giờ dùng cả hai cùng lúc.",
      rememberRule: "So sánh hơn: hoặc -er, hoặc more — chọn MỘT. Không dùng cả hai.",
      retryPrompt: "Viết một câu so sánh hơn, dùng -er hoặc more (không dùng cả hai).",
      category: "extra_word",
    },
  },
  // ── L4 pronunciation nudge (unchanged — serves its specific purpose) ──
  {
    id: "l4-pronunciation-final-sound-nudge",
    match: /\b(i\s+bought\s+a\s+hat|i\s+want\s+\w{3,8}|i\s+went\b|a\s+hat\b)\b/i,
    category: "other",
    diagnosis: {
      originalPattern: "Final sound practice: bought / hat / want / went",
      correctedExample: "Practice the final sound in 'bought' / 'hat'.",
      vietnameseThinking:
        "Tiếng Việt là ngôn ngữ có âm tiết mở — phần lớn các từ kết thúc bằng nguyên âm, " +
        "và phụ âm cuối thường được phát âm rất nhẹ hoặc không bật hơi. Ngược lại, tiếng Anh " +
        "có nhiều từ kết thúc bằng phụ âm cần được phát âm rõ: -t, -d, -s, -k, -p... " +
        "Người Việt thường 'nuốt' các âm cuối này, khiến từ bị nghe sai (hat → ha, went → wen).",
      englishLogic:
        "Trong tiếng Anh, âm cuối có thể phân biệt nghĩa: hat ≠ had ≠ has, bought ≠ bow, went ≠ when. " +
        "Người bản xứ dựa vào âm cuối để hiểu đúng từ — nếu thiếu âm cuối, họ có thể hiểu sai hoặc không hiểu.",
      rememberRule: "Đây là gợi ý luyện phát âm qua văn bản, không phải chấm điểm âm thanh.",
      retryPrompt:
        "Đọc chậm một câu ngắn và chạm vào âm cuối: bought, hat, want, hoặc went — cảm nhận lưỡi chạm răng khi nói -t.",
      category: "other",
    },
  },
  // ── explain-to-me (extra_word / wrong word order) ─────────────────────
  {
    id: "explain-to-me",
    match: /\b(?:explain|explains|explained|explaining)\s+(?:me|you|him|her|us|them)\s+(?:the|this|that|why|how|what|when|where|a|an)\b/i,
    category: "extra_word",
    diagnosis: {
      originalPattern: "Can you explain me the rule?",
      correctedExample: "Can you explain the rule to me?",
      vietnameseThinking:
        "Tiếng Việt nói 'giải thích CHO tôi' — người nghe đứng ngay sau động từ. Người Việt dịch thẳng: " +
        "giải thích = explain, cho tôi = me → explain me. Nhưng explain không nhận người nghe làm tân ngữ trực tiếp. " +
        "Cấu trúc của explain khác với tell (tell me something) — đây là điểm dễ nhầm.",
      englishLogic:
        "Explain + something + to + someone: nội dung giải thích đứng trước, người nghe đứng sau 'to'. " +
        "Không nói 'explain me something'. Có thể nói 'explain to me why/how...' nếu bắt đầu bằng mệnh đề. " +
        "So sánh: Tell me something. (đúng) / Explain me something. (sai).",
      rememberRule: "Explain + nội dung + to + người nghe. KHÔNG nói explain me/him/her something.",
      retryPrompt: "Viết một câu với 'explain ... to me'.",
      category: "extra_word",
    },
  },
  // ── since-for-duration ────────────────────────────────────────────────
  {
    id: "since-for-duration",
    match: /\bsince\s+(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(?:second|minute|hour|day|week|month|year|decade)s?\b(?!\s+ago)\b/i,
    category: "word_choice",
    diagnosis: {
      originalPattern: "I have lived here since two years.",
      correctedExample: "I have lived here for two years.",
      vietnameseThinking:
        "Tiếng Việt dùng 'từ' hoặc 'được' cho cả khoảng thời gian dài và mốc thời gian: " +
        "'Tôi sống ở đây được 2 năm' và 'Tôi sống ở đây từ 2020'. Tiếng Anh phân biệt: " +
        "for + khoảng thời gian (two years, three months), since + mốc thời gian (2020, Monday, last week). " +
        "Người Việt hay nhầm since và for vì tiếng Việt không có sự phân biệt này.",
      englishLogic:
        "For = trong khoảng (đo thời gian kéo dài bao lâu): for two years, for a long time. " +
        "Since = từ mốc (đánh dấu thời điểm bắt đầu): since 2020, since Monday, since I was a child. " +
        "Mẹo: nếu sau nó là một CON SỐ + đơn vị thời gian → dùng for. Nếu sau nó là một MỐC CỤ THỂ → dùng since.",
      rememberRule: "For + khoảng thời gian (two years). Since + mốc thời gian (2020, Monday). Mẹo: có số + đơn vị → for.",
      retryPrompt: "Viết một câu với 'for' + khoảng thời gian, hoặc 'since' + mốc thời gian.",
      category: "word_choice",
    },
  },
];

// ─── Core functions ────────────────────────────────────────────────────────

function normalizeInput(value: string): string {
  return String(value ?? "")
    .replace(/[.!?。！？]+$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function diagnoseVietlishLogic(input: string): VietlishLogicDiagnosis {
  const result = diagnoseVietlishLogicWithMatch(input);
  return {
    originalPattern: result.originalPattern,
    correctedExample: result.correctedExample,
    vietnameseThinking: result.vietnameseThinking,
    englishLogic: result.englishLogic,
    rememberRule: result.rememberRule,
    retryPrompt: result.retryPrompt,
    category: result.category,
  };
}

export function diagnoseVietlishLogicWithMatch(input: string): VietlishLogicDiagnosisResult {
  const normalized = normalizeInput(input);
  const pattern = PATTERNS.find((candidate) => candidate.match.test(normalized));
  if (pattern) {
    return {
      ...pattern.diagnosis,
      patternId: pattern.id,
      isKnownPattern: true,
      category: pattern.category,
    };
  }

  return {
    ...UNKNOWN_DIAGNOSIS,
    patternId: null,
    isKnownPattern: false,
    fallbackMessage: UNKNOWN_FALLBACK_MESSAGE,
    category: "other",
  };
}

export function getSupportedVietlishLogicPatterns(): string[] {
  return PATTERNS.map((pattern) => pattern.id);
}

/**
 * Step 007: Returns all patterns grouped by interference category.
 * Useful for analytics dashboards and teacher-adaptation logic
 * that wants to know which *type* of interference a learner struggles with.
 */
export function getPatternsByCategory(): Record<VietlishInterferenceCategory, string[]> {
  const map: Record<VietlishInterferenceCategory, string[]> = {
    missing_word: [],
    extra_word: [],
    word_order: [],
    verb_form: [],
    word_choice: [],
    noun_form: [],
    other: [],
  };
  for (const p of PATTERNS) {
    map[p.category].push(p.id);
  }
  return map;
}
