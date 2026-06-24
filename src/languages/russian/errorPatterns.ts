// src/languages/russian/errorPatterns.ts
//
// Curated Vietnamese-learner Russian error patterns (R10 batch).
// Converted from the local Vietnamese-Russian study archive:
//   vietnamese-russian-error-corpus-v2.md, error-corpus-v3.md, error-corpus-v4.md,
//   error-pattern-intelligence.md, grammar-map-vn-to-ru.md.
// Compact, app-ready data only — a curated cross-section of the most common
// Vietnamese-speaker mistakes, not the full multi-thousand-row corpora.
// Each pattern carries a Vietnamese (vi) and an English (en) explanation plus a
// Vietnamese correction strategy (fixVi), so a future `native_language = vi | en`
// toggle can switch explanation language without changing the examples.
//
// The six operating buckets follow error-pattern-intelligence.md:
//   cases, aspect, word_order, agreement, verb_government, pronouns, register,
//   pronunciation.

export type RussianErrorBucket =
  | "agreement"
  | "cases"
  | "verb_government"
  | "aspect"
  | "motion"
  | "word_order"
  | "pronouns"
  | "register"
  | "pronunciation";

export type RussianErrorPattern = {
  /** Stable id for this batch. */
  id: string;
  bucket: RussianErrorBucket;
  /** Fine-grained category label from the source corpora. */
  category: string;
  /** The incorrect form a Vietnamese learner typically produces. */
  wrong: string;
  /** The correct Russian. */
  correct: string;
  /** Why the mistake happens / the rule, in Vietnamese. */
  vi: string;
  /** Same explanation in English. */
  en: string;
  /** Concrete correction strategy, in Vietnamese. */
  fixVi: string;
};

export const RUSSIAN_ERROR_PATTERNS: ReadonlyArray<RussianErrorPattern> = [
  // ── agreement (gender / number) ──────────────────────────────────────────
  {
    id: "R10-E001",
    bucket: "agreement",
    category: "Gender and agreement",
    wrong: "Это мой мама.",
    correct: "Это моя мама.",
    vi: "Tiếng Việt không có giống danh từ, nhưng tiếng Nga bắt buộc мой/моя/моё/мои phải khớp với danh từ.",
    en: "Vietnamese has no grammatical gender, but Russian possessives must agree with the noun's gender and number.",
    fixVi: "Học mỗi danh từ kèm một cụm mẫu: мой брат, моя книга, это окно.",
  },
  {
    id: "R10-E002",
    bucket: "agreement",
    category: "Gender and agreement",
    wrong: "Это старший сестра.",
    correct: "Это старшая сестра.",
    vi: "Tính từ tiếng Nga đổi đuôi theo giống/số; tiếng Việt không đổi tính từ.",
    en: "Russian adjective endings change with the noun's gender and number; Vietnamese adjectives never inflect.",
    fixVi: "Trước khi nói tính từ, kiểm tra danh từ là giống đực, cái, trung hay số nhiều.",
  },
  {
    id: "R10-E003",
    bucket: "agreement",
    category: "Gender and agreement",
    wrong: "Вот мой подруга.",
    correct: "Вот моя подруга.",
    vi: "Sau вот vẫn phải dùng cụm danh từ đúng giống và số.",
    en: "After вот the whole noun phrase must still match the noun's gender and number.",
    fixVi: "Đọc cả cụm, không chỉ nhớ nghĩa của từng từ.",
  },
  {
    id: "R10-E004",
    bucket: "agreement",
    category: "Register and lexical transfer",
    wrong: "Ты можете помочь?",
    correct: "Вы можете помочь?",
    vi: "Đại từ phải khớp với dạng động từ: ты можешь, вы можете.",
    en: "Subject pronoun and verb form must match: ты можешь vs вы можете.",
    fixVi: "Khớp đại từ với động từ: ты можешь, вы можете.",
  },

  // ── cases: nominative subject ────────────────────────────────────────────
  {
    id: "R10-E005",
    bucket: "cases",
    category: "Nominative subject",
    wrong: "маму здесь.",
    correct: "мама здесь.",
    vi: "Chủ ngữ trong tiếng Nga dùng nominative; tiếng Việt không đánh dấu nên dễ dùng nhầm dạng tân ngữ.",
    en: "The subject takes the nominative case; Vietnamese marks no case, so learners often reuse the object form.",
    fixVi: "Hỏi ai/cái gì đang được nói đến? Dùng nominative.",
  },
  {
    id: "R10-E006",
    bucket: "cases",
    category: "Nominative subject",
    wrong: "подруге работает.",
    correct: "подруга работает.",
    vi: "Dative là người nhận/trải nghiệm, không phải chủ ngữ hành động bình thường.",
    en: "The dative marks a recipient or experiencer, not an ordinary acting subject.",
    fixVi: "Nếu người đó tự làm hành động, dùng nominative.",
  },

  // ── cases: accusative object ─────────────────────────────────────────────
  {
    id: "R10-E007",
    bucket: "cases",
    category: "Accusative object",
    wrong: "Я вижу мама.",
    correct: "Я вижу маму.",
    vi: "Tân ngữ trực tiếp trong tiếng Nga thường dùng accusative; tiếng Việt để nguyên danh từ.",
    en: "The direct object usually takes the accusative; Vietnamese leaves the noun unchanged.",
    fixVi: "Sau видеть/знать/ждать/любить, hỏi кого/что.",
  },
  {
    id: "R10-E008",
    bucket: "cases",
    category: "Animate accusative",
    wrong: "Я встретил мама.",
    correct: "Я встретил маму.",
    vi: "Người/động vật làm tân ngữ thường đổi sang dạng animate accusative.",
    en: "Animate objects (people, animals) take a special animate-accusative form.",
    fixVi: "Với người giống đực/số nhiều, accusative thường giống genitive.",
  },
  {
    id: "R10-E009",
    bucket: "cases",
    category: "Motion versus location",
    wrong: "Я иду в комнате.",
    correct: "Я иду в комнату.",
    vi: "Đi vào/đến nơi nào dùng accusative (có chuyển động hướng tới).",
    en: "Movement toward a place uses в/на + accusative, not the prepositional.",
    fixVi: "Chuyển động hướng tới = в/на + accusative.",
  },

  // ── cases: genitive ──────────────────────────────────────────────────────
  {
    id: "R10-E010",
    bucket: "cases",
    category: "Genitive absence",
    wrong: "У меня нет мама.",
    correct: "У меня нет мамы.",
    vi: "Cấu trúc нет (không có) luôn đi với genitive.",
    en: "The 'there is no' construction нет always takes the genitive.",
    fixVi: "Mỗi khi thấy нет, đổi danh từ thiếu sang genitive.",
  },
  {
    id: "R10-E011",
    bucket: "cases",
    category: "Genitive quantity",
    wrong: "Много книга.",
    correct: "Много книг.",
    vi: "Từ chỉ số lượng như много/мало/несколько kéo theo genitive.",
    en: "Quantity words like много/мало/несколько govern the genitive.",
    fixVi: "Sau много/мало/несколько, kiểm tra genitive.",
  },
  {
    id: "R10-E012",
    bucket: "cases",
    category: "Genitive possession and source",
    wrong: "Ключ мама.",
    correct: "Ключ мамы.",
    vi: "Quan hệ “của” (sở hữu) thường dùng genitive cho người/vật sở hữu.",
    en: "Possession ('of') is expressed by putting the owner in the genitive.",
    fixVi: "Sau danh từ sở hữu, đặt chủ sở hữu ở genitive.",
  },
  {
    id: "R10-E013",
    bucket: "cases",
    category: "Genitive possession and source",
    wrong: "Я из сестра.",
    correct: "Я из сестры.",
    vi: "Giới từ из luôn đi với genitive.",
    en: "The preposition из ('from / out of') always takes the genitive.",
    fixVi: "Học giới từ theo cách: из + genitive.",
  },
  {
    id: "R10-E014",
    bucket: "cases",
    category: "Genitive possession and source",
    wrong: "Он без подруга.",
    correct: "Он без подруги.",
    vi: "Без (không có/không mang theo) luôn dùng genitive.",
    en: "The preposition без ('without') always takes the genitive.",
    fixVi: "Gặp без thì đổi cụm sau nó sang genitive.",
  },

  // ── cases: dative ─────────────────────────────────────────────────────────
  {
    id: "R10-E015",
    bucket: "cases",
    category: "Dative recipient",
    wrong: "Я дал книгу мама.",
    correct: "Я дал книгу маме.",
    vi: "Người nhận dùng dative, tương đương “cho ai”.",
    en: "The recipient ('to whom') takes the dative.",
    fixVi: "Hỏi кому? cho người nhận.",
  },
  {
    id: "R10-E016",
    bucket: "cases",
    category: "Dative recipient",
    wrong: "Мы помогаем подруга.",
    correct: "Мы помогаем подруге.",
    vi: "Động từ помогать bắt buộc dùng dative.",
    en: "The verb помогать ('to help') requires the dative, not the accusative.",
    fixVi: "Ghi nhớ помогать кому, không dùng accusative.",
  },
  {
    id: "R10-E017",
    bucket: "cases",
    category: "Dative experiencer",
    wrong: "мама нравится русский язык.",
    correct: "маме нравится русский язык.",
    vi: "Người thích trong cấu trúc нравиться dùng dative.",
    en: "With нравиться ('to like'), the person who likes is in the dative.",
    fixVi: "Dùng мне/ему/маме нравится, không dùng я нравится.",
  },
  {
    id: "R10-E018",
    bucket: "cases",
    category: "Dative experiencer",
    wrong: "сестра холодно.",
    correct: "сестре холодно.",
    vi: "Cảm giác lạnh/nóng/chán dùng dative cho người trải nghiệm.",
    en: "States like cold/hot/bored put the experiencer in the dative.",
    fixVi: "Mẫu: мне холодно, детям скучно.",
  },

  // ── cases: instrumental ───────────────────────────────────────────────────
  {
    id: "R10-E019",
    bucket: "cases",
    category: "Instrumental tool and companion",
    wrong: "Я занимаюсь подруга.",
    correct: "Я занимаюсь подругой.",
    vi: "Заниматься dùng instrumental cho hoạt động/môn học.",
    en: "The verb заниматься ('to study / be busy with') takes the instrumental.",
    fixVi: "Không dùng accusative sau заниматься.",
  },
  {
    id: "R10-E020",
    bucket: "cases",
    category: "Instrumental roles",
    wrong: "Она работает сестра.",
    correct: "Она работает сестрой.",
    vi: "Làm nghề gì / đóng vai trò gì dùng instrumental.",
    en: "Working as / being in a role uses the instrumental.",
    fixVi: "Работать кем: врачом, учителем, водителем.",
  },
  {
    id: "R10-E021",
    bucket: "cases",
    category: "Instrumental roles",
    wrong: "Он стал учитель.",
    correct: "Он стал учителем.",
    vi: "Vai trò sau стать dùng instrumental.",
    en: "The role after стать ('to become') goes in the instrumental.",
    fixVi: "Стать кем/чем: стал инженером, стала врачом.",
  },

  // ── cases: prepositional location ─────────────────────────────────────────
  {
    id: "R10-E022",
    bucket: "cases",
    category: "Prepositional location",
    wrong: "Я живу в Москву.",
    correct: "Я живу в Москве.",
    vi: "Vị trí tĩnh (ở đâu) sau в/на dùng prepositional.",
    en: "Static location ('where') after в/на uses the prepositional case.",
    fixVi: "Hỏi где? thì dùng в/на + prepositional.",
  },
  {
    id: "R10-E023",
    bucket: "cases",
    category: "Motion versus location",
    wrong: "Я нахожусь в улицу.",
    correct: "Я нахожусь на улице.",
    vi: "Đang ở đâu dùng prepositional; với улица dùng на.",
    en: "Where you currently are uses the prepositional; улица takes на.",
    fixVi: "Vị trí tĩnh = в/на + prepositional; nhớ на улице, на работе.",
  },

  // ── verb_government ───────────────────────────────────────────────────────
  {
    id: "R10-E024",
    bucket: "verb_government",
    category: "Verb government and prepositions",
    wrong: "Я жду для тебя.",
    correct: "Я жду тебя.",
    vi: "Ждать không cần для khi nghĩa là đợi ai/cái gì.",
    en: "ждать ('to wait for') needs no preposition for its object — no для.",
    fixVi: "Học verb pattern, không dịch giới từ từng chữ.",
  },
  {
    id: "R10-E025",
    bucket: "verb_government",
    category: "Verb government and prepositions",
    wrong: "Я боюсь экзамен.",
    correct: "Я боюсь экзамена.",
    vi: "Бояться yêu cầu genitive.",
    en: "бояться ('to be afraid of') governs the genitive.",
    fixVi: "Бояться кого/чего: боюсь собаки, боюсь ошибки.",
  },
  {
    id: "R10-E026",
    bucket: "verb_government",
    category: "Verb government and prepositions",
    wrong: "Он зависит от погода.",
    correct: "Он зависит от погоды.",
    vi: "Giới từ от yêu cầu genitive.",
    en: "The preposition от ('depends on / from') requires the genitive.",
    fixVi: "Зависеть от чего: от погоды, от тебя.",
  },
  {
    id: "R10-E027",
    bucket: "verb_government",
    category: "Pronouns by case",
    wrong: "Я звоню он.",
    correct: "Я звоню ему.",
    vi: "Звонить dùng dative cho người được gọi.",
    en: "звонить ('to call') puts the person called in the dative.",
    fixVi: "Gọi cho ai = звонить кому: звоню маме, звоню ему.",
  },

  // ── aspect ────────────────────────────────────────────────────────────────
  {
    id: "R10-E028",
    bucket: "aspect",
    category: "Verb aspect",
    wrong: "Я буду прочитать книгу каждый день.",
    correct: "Я буду читать книгу каждый день.",
    vi: "Hành động lặp lại trong tương lai dùng imperfective.",
    en: "Repeated future actions use the imperfective aspect.",
    fixVi: "Từ каждый день / часто là tín hiệu imperfective.",
  },
  {
    id: "R10-E029",
    bucket: "aspect",
    category: "Verb aspect",
    wrong: "Я уже делал работу, можно идти.",
    correct: "Я уже сделал работу, можно идти.",
    vi: "Уже + kết quả đã hoàn thành thường dùng perfective.",
    en: "уже with a completed result usually calls for the perfective.",
    fixVi: "Nếu muốn nói đã hoàn thành, dùng perfective: сделал, написал.",
  },
  {
    id: "R10-E030",
    bucket: "aspect",
    category: "Verb aspect",
    wrong: "Я долго написал письмо.",
    correct: "Я долго писал письмо.",
    vi: "Nhấn mạnh quá trình kéo dài dùng imperfective.",
    en: "Emphasising a drawn-out process uses the imperfective.",
    fixVi: "Với долго, ưu tiên imperfective.",
  },

  // ── motion ────────────────────────────────────────────────────────────────
  {
    id: "R10-E031",
    bucket: "motion",
    category: "Motion verbs",
    wrong: "Я сейчас хожу домой.",
    correct: "Я сейчас иду домой.",
    vi: "Đang đi một hướng (đi bộ) dùng идти.",
    en: "Going on foot in one direction right now uses идти (not ходить).",
    fixVi: "Hiện tại, một hướng, đi bộ = идти.",
  },
  {
    id: "R10-E032",
    bucket: "motion",
    category: "Motion verbs",
    wrong: "Я каждый день иду на работу пешком.",
    correct: "Я каждый день хожу на работу пешком.",
    vi: "Thói quen đi bộ lặp lại dùng ходить.",
    en: "A repeated, habitual walk uses ходить (not идти).",
    fixVi: "Mỗi ngày/thường xuyên = ходить.",
  },
  {
    id: "R10-E033",
    bucket: "motion",
    category: "Motion verbs",
    wrong: "Мы сейчас ездим в аэропорт.",
    correct: "Мы сейчас едем в аэропорт.",
    vi: "Đang đi xe một hướng dùng ехать.",
    en: "Going by vehicle in one direction right now uses ехать (not ездить).",
    fixVi: "Hiện tại, một hướng, bằng xe = ехать.",
  },

  // ── word_order / negation ─────────────────────────────────────────────────
  {
    id: "R10-E034",
    bucket: "word_order",
    category: "Negation and word order",
    wrong: "Я имею книгу.",
    correct: "У меня есть книга.",
    vi: "Sở hữu đời thường dùng у меня есть thay vì иметь.",
    en: "Everyday possession uses у меня есть, not the verb иметь.",
    fixVi: "Dùng у меня есть/нет thay vì dịch “have”.",
  },
  {
    id: "R10-E035",
    bucket: "word_order",
    category: "Negation and word order",
    wrong: "Я не имею книгу.",
    correct: "У меня нет книги.",
    vi: "Không có thường nói bằng у меня нет + genitive.",
    en: "'Not having' is normally у меня нет + genitive.",
    fixVi: "Phủ định sở hữu: у меня нет + genitive.",
  },
  {
    id: "R10-E036",
    bucket: "word_order",
    category: "Negation and word order",
    wrong: "Никто пришёл.",
    correct: "Никто не пришёл.",
    vi: "Đại từ phủ định cần đi kèm не với động từ (phủ định kép).",
    en: "Negative pronouns require не on the verb (double negation is mandatory).",
    fixVi: "Mẫu: никто не…, ничего не…, никогда не…",
  },
  {
    id: "R10-E037",
    bucket: "word_order",
    category: "Negation and word order",
    wrong: "Я ничего знаю.",
    correct: "Я ничего не знаю.",
    vi: "Ничего phải đi với не; tiếng Nga bắt buộc phủ định kép.",
    en: "ничего must pair with не — Russian requires double negation.",
    fixVi: "Luôn thêm не trước động từ khi có ничего/никто/никогда.",
  },

  // ── pronouns ──────────────────────────────────────────────────────────────
  {
    id: "R10-E038",
    bucket: "pronouns",
    category: "Pronouns by case",
    wrong: "Я вижу я.",
    correct: "Я вижу меня… (Он видит меня.)",
    vi: "Đại từ làm tân ngữ phải đổi dạng: я → меня.",
    en: "Object pronouns change form: я (subject) → меня (object).",
    fixVi: "Học riêng bảng я/меня/мне/мной/обо мне.",
  },
  {
    id: "R10-E039",
    bucket: "pronouns",
    category: "Pronouns by case",
    wrong: "Без ты трудно.",
    correct: "Без тебя трудно.",
    vi: "Без yêu cầu genitive; ты → тебя.",
    en: "без takes the genitive; ты becomes тебя.",
    fixVi: "Học без тебя / без него / без них như cụm cố định.",
  },
  {
    id: "R10-E040",
    bucket: "pronouns",
    category: "Pronouns by case",
    wrong: "Я думаю о ты.",
    correct: "Я думаю о тебе.",
    vi: "Sau giới từ о dùng prepositional; ты → тебе.",
    en: "After the preposition о the prepositional case is used; ты → тебе.",
    fixVi: "Думать о ком: о тебе, о нём, о них.",
  },

  // ── register / politeness (culture) ───────────────────────────────────────
  {
    id: "R10-E041",
    bucket: "register",
    category: "Register and lexical transfer",
    wrong: "Дай мне паспорт, пожалуйста. (с незнакомцем)",
    correct: "Дайте мне паспорт, пожалуйста.",
    vi: "Tình huống lịch sự/với người lạ cần mệnh lệnh -те.",
    en: "Polite or stranger-facing requests need the -те imperative form.",
    fixVi: "Dùng дайте/скажите/покажите với người lạ.",
  },
  {
    id: "R10-E042",
    bucket: "register",
    category: "Register and lexical transfer",
    wrong: "Вы можешь повторить?",
    correct: "Вы можете повторить?",
    vi: "Вы dùng dạng động từ số nhiều/lịch sự можете.",
    en: "Вы pairs with the plural/polite verb form можете.",
    fixVi: "Với người lạ dùng вы + можете.",
  },
  {
    id: "R10-E043",
    bucket: "register",
    category: "Register and lexical transfer",
    wrong: "Привет! (начальнику на работе)",
    correct: "Здравствуйте!",
    vi: "Với cấp trên/người lạ dùng chào trang trọng Здравствуйте.",
    en: "With a superior or stranger use the formal greeting Здравствуйте, not Привет.",
    fixVi: "Привет chỉ dùng với bạn bè; còn lại dùng Здравствуйте.",
  },

  // ── pronunciation / stress (textual error patterns) ──────────────────────
  {
    id: "R10-E044",
    bucket: "pronunciation",
    category: "Pronunciation and stress",
    wrong: "сир (вместо сыр)",
    correct: "сыр",
    vi: "Ы không phải i tiếng Việt; phát âm sai làm đổi nghĩa từ.",
    en: "ы is not Vietnamese 'i'; confusing them changes the word's meaning.",
    fixVi: "Kéo lưỡi lùi, luyện cặp сыр / сир, ты / ти.",
  },
  {
    id: "R10-E045",
    bucket: "pronunciation",
    category: "Pronunciation and stress",
    wrong: "ВО-да (ударение на первый слог)",
    correct: "во-ДА",
    vi: "Tiếng Nga có trọng âm, không có thanh điệu; đặt sai trọng âm gây khó hiểu.",
    en: "Russian has stress, not tone; misplacing the stress makes words hard to understand.",
    fixVi: "Học mỗi từ kèm vị trí trọng âm; đừng đọc đều mọi âm tiết.",
  },

  // ── extra high-frequency case mixes ──────────────────────────────────────
  {
    id: "R10-E046",
    bucket: "cases",
    category: "Genitive quantity",
    wrong: "У меня два книга.",
    correct: "У меня две книги.",
    vi: "Sau два/три/четыре dùng genitive số ít; số đếm cũng khớp giống (два/две).",
    en: "After два/три/четыре use the genitive singular; the numeral also agrees in gender (два/две).",
    fixVi: "Hai = два (đực/trung), две (cái) + genitive số ít.",
  },
  {
    id: "R10-E047",
    bucket: "cases",
    category: "Accusative object",
    wrong: "Я люблю кофе и чай. (нет ошибки в неизменяемых)",
    correct: "Я пью чёрный чай.",
    vi: "Tính từ bổ nghĩa cho tân ngữ cũng phải ở accusative khớp với danh từ.",
    en: "An adjective modifying the object must also be in the accusative, agreeing with the noun.",
    fixVi: "Đổi cả cụm tính từ + danh từ sang accusative, không chỉ danh từ.",
  },
  {
    id: "R10-E048",
    bucket: "verb_government",
    category: "Verb government and prepositions",
    wrong: "Я играю футбол.",
    correct: "Я играю в футбол.",
    vi: "Chơi môn thể thao/trò chơi dùng играть в + accusative.",
    en: "Playing a sport or game uses играть в + accusative.",
    fixVi: "Играть в футбол, в шахматы; играть на + nhạc cụ (на гитаре).",
  },
  {
    id: "R10-E049",
    bucket: "aspect",
    category: "Verb aspect",
    wrong: "Вчера я читаю книгу два часа.",
    correct: "Вчера я читал книгу два часа.",
    vi: "Quá trình trong quá khứ kéo dài dùng imperfective ở thì quá khứ.",
    en: "A lasting past process uses the imperfective past tense.",
    fixVi: "Thời gian kéo dài (два часа, долго) → imperfective.",
  },
  {
    id: "R10-E050",
    bucket: "word_order",
    category: "Negation and word order",
    wrong: "Я не люблю не работать.",
    correct: "Я не люблю работать.",
    vi: "Đừng dịch máy móc; chỉ cần một не cho ý phủ định đơn giản.",
    en: "Do not over-translate — a simple negative needs only one не.",
    fixVi: "Phủ định kép chỉ bắt buộc với никто/ничего/никогда, không phải mọi câu.",
  },
];

/** Total curated error patterns. */
export const RUSSIAN_ERROR_PATTERN_COUNT = RUSSIAN_ERROR_PATTERNS.length;

/** Buckets covered by the batch (per error-pattern-intelligence.md). */
export const RUSSIAN_ERROR_BUCKETS: ReadonlyArray<RussianErrorBucket> = [
  "agreement",
  "cases",
  "verb_government",
  "aspect",
  "motion",
  "word_order",
  "pronouns",
  "register",
  "pronunciation",
];

export function getRussianErrorPatternsByBucket(
  bucket: RussianErrorBucket,
): RussianErrorPattern[] {
  return RUSSIAN_ERROR_PATTERNS.filter((pattern) => pattern.bucket === bucket);
}
