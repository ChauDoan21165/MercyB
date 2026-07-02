// src/languages/swahili/lessons-a2.ts
//
// Swahili (Kiswahili) A2 lessons for Vietnamese learners.
// Elementary daily-life pack: routines, shopping, transport, time,
// weather, and housing.
//
// Fresh scaffold — A2 authoring wave failed; this file provides
// six minimal-viable lessons using the same sentence/vocab/exercise
// shape as B1/B2/C2 so the normalizer handles them uniformly.
//
// Swahili A2 grammar focus:
//   - Present habitual (-na-) and present continuous (-na-)
//   - Future tense (-ta-)
//   - Simple commands (imperative singular/plural)
//   - Numbers beyond 100, prices, haggling
//   - Telling time (saa system: Swahili counts from dawn)
//   - Locative suffixes -ni and basic prepositions

import type { SwahiliCategoryId } from "./lessons";

type SwahiliSentence = {
  sw: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

type SwahiliVocabEntry = {
  sw: string;
  en: string;
  vi: string;
  pos?: string;
  ngeli?: string;
};

type SwahiliLesson = {
  id: string;
  level: string;
  category: SwahiliCategoryId;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  sentences: SwahiliSentence[];
  vocabulary: SwahiliVocabEntry[];
  exercises?: Array<Record<string, unknown>>;
  cultural_notes_vi: string;
  cultural_notes_en: string;
  tip_advice_vi: string;
  tip_advice_en: string;
};

export const lessons: SwahiliLesson[] = [
  // ── 1. Daily routine ──────────────────────────────────────────────
  {
    id: "swahili_a2_daily_routine",
    level: "A2",
    category: "daily_routine",
    title_vi: "Sinh hoạt hàng ngày",
    title_en: "Daily routine",
    intro_vi:
      "Bài này dạy cách mô tả một ngày bình thường bằng tiếng Swahili — từ thức dậy, ăn sáng, đi làm, đến đi ngủ.",
    intro_en:
      "This lesson teaches how to describe a typical day in Swahili — from waking up, eating breakfast, going to work, to going to bed.",
    sentences: [
      {
        sw: "Mimi huamka saa kumi na mbili asubuhi.",
        en: "I wake up at six in the morning.",
        vi: "Tôi thức dậy lúc sáu giờ sáng.",
        pronunciation_focus: [
          "huamka → hu-AM-ka (thói quen hiện tại)",
          "saa kumi na mbili → SAA ku-mi na m-BI-li (6 giờ sáng trong hệ saa Swahili)",
        ],
        pronunciation_focus_en: [
          "huamka = habitual present of -amka (wake up)",
          "saa kumi na mbili = literally 'hour twelve', i.e. 6am in Swahili time",
        ],
        note_vi:
          "Swahili dùng hệ giờ riêng: 6 giờ sáng dương lịch = saa kumi na mbili (giờ thứ 12). Đồng hồ Swahili bắt đầu từ lúc mặt trời mọc (~6h sáng).",
        note_en:
          "Swahili uses its own clock: 6am = saa kumi na mbili (the 12th hour). The Swahili clock starts at sunrise (~6am).",
      },
      {
        sw: "Kisha napiga mswaki na kuoga.",
        en: "Then I brush my teeth and shower.",
        vi: "Sau đó tôi đánh răng và tắm.",
        pronunciation_focus: [
          "napiga mswaki → na-PI-ga m-SWA-ki",
          "kuoga → ku-O-ga",
        ],
        note_vi:
          "kisha = sau đó. napiga mswaki = 'tôi đánh răng' (piga = đánh/gõ, mswaki = bàn chải).",
      },
      {
        sw: "Baada ya kazi, mimi hupumzika na kusoma kitabu.",
        en: "After work, I rest and read a book.",
        vi: "Sau giờ làm, tôi nghỉ ngơi và đọc sách.",
        note_vi:
          "baada ya = sau khi. hupumzika = thói quen nghỉ ngơi (hu- + -pumzika). kusoma = đọc/học.",
      },
    ],
    vocabulary: [
      { sw: "kuamka", en: "to wake up", vi: "thức dậy", pos: "v." },
      { sw: "asubuhi", en: "morning", vi: "buổi sáng", pos: "n.", ngeli: "n/n" },
      { sw: "mswaki", en: "toothbrush", vi: "bàn chải đánh răng", pos: "n.", ngeli: "m/mi" },
      { sw: "kuoga", en: "to shower/bathe", vi: "tắm", pos: "v." },
      { sw: "kupumzika", en: "to rest", vi: "nghỉ ngơi", pos: "v." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Mimi _____ saa kumi na mbili asubuhi.",
        answer: "huamka",
        hint_vi: "động từ 'thức dậy' ở thì thói quen",
        hint_en: "verb 'wake up' in habitual tense",
      },
      {
        type: "translation",
        vi: "Sau đó tôi đánh răng và tắm.",
        en: "Then I brush my teeth and shower.",
        sw: "Kisha napiga mswaki na kuoga.",
      },
    ],
    cultural_notes_vi:
      "Người Đông Phi thường dậy sớm, đặc biệt ở vùng nông thôn nơi ngày bắt đầu lúc mặt trời mọc. 'Saa kumi na mbili asubuhi' là 6 giờ sáng — hệ giờ Swahili tính từ lúc mặt trời mọc, không phải nửa đêm.",
    cultural_notes_en:
      "East Africans typically rise early, especially in rural areas where the day starts at sunrise. 'Saa kumi na mbili asubuhi' is 6am — Swahili time counts from sunrise, not midnight.",
    tip_advice_vi:
      "Học thì thói quen hu- như một khối: hu- + gốc động từ. Ví dụ: huamka (thức dậy), hula (ăn), hunywa (uống). Đây là thì dùng để nói về việc làm thường xuyên.",
    tip_advice_en:
      "Learn the habitual hu- as a chunk: hu- + verb root. Examples: huamka (wakes up), hula (eats), hunywa (drinks). This tense is for regular activities.",
  },

  // ── 2. Shopping and bargaining ────────────────────────────────────
  {
    id: "swahili_a2_shopping_bargaining",
    level: "A2",
    category: "shopping",
    title_vi: "Mua sắm và trả giá ở chợ",
    title_en: "Shopping and bargaining at the market",
    intro_vi:
      "Học cách hỏi giá, trả giá và mua hàng ở chợ Đông Phi — một kỹ năng thiết yếu cho bất kỳ ai sống hoặc du lịch trong vùng.",
    intro_en:
      "Learn to ask prices, bargain, and shop at East African markets — an essential skill for anyone living or traveling in the region.",
    sentences: [
      {
        sw: "Samaki hii ni shilingi ngapi?",
        en: "How much is this fish?",
        vi: "Con cá này bao nhiêu shilling?",
        note_vi:
          "ngapi = bao nhiêu (dùng với danh từ lớp n/n). shilingi = shilling (tiền Tanzania/Kenya).",
      },
      {
        sw: "Bei ni ghali sana. Unaweza kupunguza?",
        en: "The price is too expensive. Can you reduce it?",
        vi: "Giá đắt quá. Bạn có thể bớt không?",
        note_vi:
          "ghali sana = rất đắt. kupunguza = giảm bớt. Đây là mẫu câu trả giá phổ biến nhất.",
      },
      {
        sw: "Nitachukua kilo mbili za nyanya.",
        en: "I'll take two kilos of tomatoes.",
        vi: "Tôi sẽ lấy hai ký cà chua.",
        note_vi:
          "nitachukua = tôi sẽ lấy (tương lai -ta-). kilo mbili = hai ký.",
      },
    ],
    vocabulary: [
      { sw: "bei", en: "price", vi: "giá cả", pos: "n.", ngeli: "n/n" },
      { sw: "ghali", en: "expensive", vi: "đắt", pos: "adj." },
      { sw: "kupunguza", en: "to reduce", vi: "giảm bớt", pos: "v." },
      { sw: "shilingi", en: "shilling", vi: "đồng shilling", pos: "n.", ngeli: "n/n" },
      { sw: "nyanya", en: "tomatoes", vi: "cà chua", pos: "n.", ngeli: "n/n" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Bei ni ghali sana. Unaweza _____?",
        answer: "kupunguza",
        hint_vi: "động từ nghĩa là 'giảm bớt'",
        hint_en: "verb meaning 'to reduce'",
      },
    ],
    cultural_notes_vi:
      "Trả giá là một phần bình thường của việc mua sắm ở chợ Đông Phi. Người bán thường nói giá cao hơn, mong người mua trả giá xuống. Câu 'Unaweza kupunguza?' là cách lịch sự để bắt đầu thương lượng.",
    cultural_notes_en:
      "Bargaining is a normal part of shopping at East African markets. Sellers typically quote higher prices, expecting buyers to negotiate down. 'Unaweza kupunguza?' is the polite way to start haggling.",
    tip_advice_vi:
      "Học các con số Swahili từ 1-1000 và các đơn vị (kilo, kipande/miếng, rundo/đống) để tự tin khi mua sắm. Luôn bắt đầu bằng câu hỏi giá, rồi mới trả giá.",
    tip_advice_en:
      "Learn Swahili numbers 1-1000 and units (kilo, kipande/piece, rundo/heap) to shop confidently. Always start with the price question, then bargain.",
  },

  // ── 3. Transport ──────────────────────────────────────────────────
  {
    id: "swahili_a2_transport_travel",
    level: "A2",
    category: "transport",
    title_vi: "Đi lại: xe buýt, daladala và taxi",
    title_en: "Getting around: bus, daladala, and taxi",
    intro_vi:
      "Học cách hỏi đường, mua vé và đi các phương tiện công cộng phổ biến ở Đông Phi như daladala (minibus), boda boda (xe ôm) và basi (xe buýt).",
    intro_en:
      "Learn to ask for directions, buy tickets, and use popular East African transport like daladala (minibus), boda boda (motorbike taxi), and basi (bus).",
    sentences: [
      {
        sw: "Daladala kwenda mjini inapita wapi?",
        en: "Where does the daladala to town pass?",
        vi: "Xe daladala đi vào trung tâm chạy qua đâu?",
        note_vi:
          "daladala = xe buýt nhỏ/minibus (phổ biến ở Tanzania). kwenda = đi đến. inapita wapi = nó đi qua đâu.",
      },
      {
        sw: "Nauli ni shilingi ngapi mpaka Kariakoo?",
        en: "How much is the fare to Kariakoo?",
        vi: "Tiền vé đến Kariakoo bao nhiêu?",
        note_vi:
          "nauli = tiền vé, giá vé. mpaka = cho đến (điểm đến).",
      },
      {
        sw: "Nishushe hapa, tafadhali.",
        en: "Drop me here, please.",
        vi: "Cho tôi xuống ở đây, làm ơn.",
        note_vi:
          "nishushe = cho tôi xuống (subjunctive, causative của -shuka). Đây là câu cực kỳ hữu ích trên daladala.",
      },
    ],
    vocabulary: [
      { sw: "daladala", en: "minibus", vi: "xe buýt nhỏ", pos: "n.", ngeli: "n/n" },
      { sw: "nauli", en: "fare", vi: "tiền vé", pos: "n.", ngeli: "n/n" },
      { sw: "kushuka", en: "to get off/descend", vi: "xuống xe", pos: "v." },
      { sw: "kusimama", en: "to stop/stand", vi: "dừng lại", pos: "v." },
      { sw: "mpaka", en: "until/up to", vi: "cho đến", pos: "prep." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Nishushe _____, tafadhali.",
        answer: "hapa",
        hint_vi: "trạng từ nghĩa là 'ở đây'",
        hint_en: "adverb meaning 'here'",
      },
    ],
    cultural_notes_vi:
      "Daladala là phương tiện công cộng chính ở Tanzania. Tài xế và phụ xe (konda) thu tiền trong lúc xe chạy. Để xuống xe, bạn nói với konda: 'Nishushe hapa' hoặc 'Shusha hapa'. Hành khách thường ngồi sát nhau — đây là trải nghiệm văn hóa thật sự!",
    cultural_notes_en:
      "Daladala is the main public transport in Tanzania. The driver and conductor (konda) collect fares while moving. To get off, tell the konda: 'Nishushe hapa' or 'Shusha hapa'. Passengers sit very close together — it's a real cultural experience!",
    tip_advice_vi:
      "Học thuộc lòng câu 'Nishushe hapa' — bạn sẽ dùng nó mỗi ngày. Ở Kenya, matatu là tên gọi khác của daladala; từ vựng giống nhau.",
    tip_advice_en:
      "Memorize 'Nishushe hapa' — you'll use it every day. In Kenya, matatu is another name for daladala; the vocabulary is the same.",
  },

  // ── 4. Time and calendar ──────────────────────────────────────────
  {
    id: "swahili_a2_time_calendar",
    level: "A2",
    category: "time",
    title_vi: "Thời gian và lịch: ngày, giờ, tháng",
    title_en: "Time and calendar: days, hours, months",
    intro_vi:
      "Nắm vững cách nói giờ theo hệ Swahili, các ngày trong tuần, tháng trong năm, và cách đặt lịch hẹn.",
    intro_en:
      "Master telling time in the Swahili system, days of the week, months of the year, and making appointments.",
    sentences: [
      {
        sw: "Leo ni Jumanne, tarehe kumi na tano.",
        en: "Today is Tuesday, the 15th.",
        vi: "Hôm nay là thứ Ba, ngày 15.",
        note_vi:
          "Jumanne = thứ Ba. tarehe = ngày (trong tháng). Các ngày: Jumatatu (T2), Jumanne (T3), Jumatano (T4), Alhamisi (T5), Ijumaa (T6), Jumamosi (T7), Jumapili (CN).",
      },
      {
        sw: "Tutakutana kesho saa nne asubuhi.",
        en: "We'll meet tomorrow at ten in the morning.",
        vi: "Chúng ta sẽ gặp nhau ngày mai lúc 10 giờ sáng.",
        note_vi:
          "tutakutana = chúng ta sẽ gặp nhau (tu- + -ta- + -kutana). kesho = ngày mai. saa nne asubuhi = 10 giờ sáng (giờ thứ 4 theo hệ Swahili).",
      },
      {
        sw: "Mwezi ujao nitasafiri kwenda Zanzibar.",
        en: "Next month I will travel to Zanzibar.",
        vi: "Tháng tới tôi sẽ đi du lịch Zanzibar.",
        note_vi:
          "mwezi ujao = tháng tới (uja-o = sẽ đến). nitasafiri = tôi sẽ đi du lịch.",
      },
    ],
    vocabulary: [
      { sw: "kesho", en: "tomorrow", vi: "ngày mai", pos: "adv." },
      { sw: "jana", en: "yesterday", vi: "hôm qua", pos: "adv." },
      { sw: "tarehe", en: "date", vi: "ngày (trong tháng)", pos: "n.", ngeli: "n/n" },
      { sw: "kukutana", en: "to meet", vi: "gặp nhau", pos: "v." },
      { sw: "mwezi", en: "month / moon", vi: "tháng / mặt trăng", pos: "n.", ngeli: "m/mi" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Tutakutana _____ saa nne asubuhi.",
        answer: "kesho",
        hint_vi: "trạng từ nghĩa là 'ngày mai'",
        hint_en: "adverb meaning 'tomorrow'",
      },
    ],
    cultural_notes_vi:
      "Hệ giờ Swahili bắt đầu từ lúc mặt trời mọc (~6h sáng). Vì vậy 7h sáng = saa moja (giờ thứ 1), 8h = saa mbili (giờ thứ 2), v.v. Khi đặt lịch hẹn với người địa phương, luôn xác nhận bạn đang dùng hệ nào để tránh nhầm lẫn 6 tiếng!",
    cultural_notes_en:
      "Swahili time starts at sunrise (~6am). So 7am = saa moja (1st hour), 8am = saa mbili (2nd hour), etc. When making appointments with locals, always confirm which system you're using to avoid a 6-hour mix-up!",
    tip_advice_vi:
      "Để chuyển đổi nhanh: giờ Swahili = giờ thường - 6 (nếu sáng) hoặc + 6 (nếu chiều). Ví dụ: 10h sáng → 10-6 = saa nne. Luôn thêm asubuhi (sáng), mchana (trưa/chiều), hoặc usiku (tối) sau số giờ.",
    tip_advice_en:
      "Quick conversion: Swahili hour = regular hour - 6 (morning) or + 6 (afternoon). Example: 10am → 10-6 = saa nne. Always add asubuhi (morning), mchana (afternoon), or usiku (night) after the hour.",
  },

  // ── 5. Weather ────────────────────────────────────────────────────
  {
    id: "swahili_a2_weather_seasons",
    level: "A2",
    category: "weather",
    title_vi: "Thời tiết và mùa",
    title_en: "Weather and seasons",
    intro_vi:
      "Học cách nói về thời tiết ở Đông Phi — nắng, mưa, mùa khô và mùa mưa. Chủ đề thời tiết rất phổ biến trong giao tiếp hàng ngày.",
    intro_en:
      "Learn to talk about weather in East Africa — sun, rain, dry season and rainy season. Weather is a very common everyday conversation topic.",
    sentences: [
      {
        sw: "Leo kuna jua kali sana.",
        en: "Today there is very strong sun.",
        vi: "Hôm nay trời nắng gắt.",
        note_vi:
          "kuna = có (there is/are). jua kali = nắng gắt (jua = mặt trời, kali = mạnh/dữ).",
      },
      {
        sw: "Mvua itanyesha jioni.",
        en: "It will rain in the evening.",
        vi: "Trời sẽ mưa vào buổi tối.",
        note_vi:
          "mvua = mưa. itanyesha = nó sẽ rơi/mưa (chủ ngữ lớp n- + -ta- + -nyesha).",
      },
      {
        sw: "Msimu wa mvua umeanza mwezi huu.",
        en: "The rainy season has started this month.",
        vi: "Mùa mưa đã bắt đầu tháng này.",
        note_vi:
          "msimu = mùa. umeanza = đã bắt đầu (-me- hoàn thành).",
      },
    ],
    vocabulary: [
      { sw: "jua", en: "sun", vi: "mặt trời", pos: "n.", ngeli: "ji/ma" },
      { sw: "mvua", en: "rain", vi: "mưa", pos: "n.", ngeli: "n/n" },
      { sw: "kali", en: "strong / fierce", vi: "mạnh / dữ dội", pos: "adj." },
      { sw: "msimu", en: "season", vi: "mùa", pos: "n.", ngeli: "m/mi" },
      { sw: "kunyesha", en: "to rain / fall (rain)", vi: "mưa / rơi", pos: "v." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Mvua _____ jioni.",
        answer: "itanyesha",
        hint_vi: "động từ 'mưa' ở thì tương lai",
        hint_en: "verb 'rain' in future tense",
      },
    ],
    cultural_notes_vi:
      "Đông Phi có hai mùa mưa chính: masika (mưa lớn, tháng 3-5) và vuli (mưa nhỏ, tháng 10-12). Mùa khô gọi là kiangazi. Người dân địa phương thường mở đầu cuộc trò chuyện bằng câu về thời tiết — giống như người Việt!",
    cultural_notes_en:
      "East Africa has two main rainy seasons: masika (long rains, March-May) and vuli (short rains, October-December). The dry season is called kiangazi. Locals often open conversations with a weather comment — just like Vietnamese people!",
    tip_advice_vi:
      "Học cấu trúc 'kuna + danh từ' (có...): kuna jua (có nắng), kuna mvua (có mưa), kuna upepo (có gió). Đây là cách đơn giản nhất để nói về thời tiết.",
    tip_advice_en:
      "Learn 'kuna + noun' (there is...): kuna jua (it's sunny), kuna mvua (it's rainy), kuna upepo (it's windy). This is the simplest way to talk about weather.",
  },

  // ── 6. Housing ────────────────────────────────────────────────────
  {
    id: "swahili_a2_housing_renting",
    level: "A2",
    category: "housing",
    title_vi: "Nhà ở và thuê nhà",
    title_en: "Housing and renting",
    intro_vi:
      "Học từ vựng và mẫu câu để mô tả nhà ở, hỏi về tiền thuê, tiện ích và hàng xóm — thiết yếu cho người mới đến sống ở Đông Phi.",
    intro_en:
      "Learn vocabulary and phrases to describe housing, ask about rent, utilities, and neighbors — essential for newcomers settling in East Africa.",
    sentences: [
      {
        sw: "Nyumba hii ina vyumba vitatu na bafu moja.",
        en: "This house has three rooms and one bathroom.",
        vi: "Nhà này có ba phòng và một phòng tắm.",
        note_vi:
          "vyumba = phòng (số nhiều của chumba, lớp ki-/vi-). vitatu = ba. bafu = phòng tắm (từ mượn).",
      },
      {
        sw: "Kodi ya nyumba ni shilingi ngapi kwa mwezi?",
        en: "How much is the rent per month?",
        vi: "Tiền thuê nhà bao nhiêu một tháng?",
        note_vi:
          "kodi ya nyumba = tiền thuê nhà. kwa mwezi = mỗi tháng.",
      },
      {
        sw: "Jirani zangu ni wema sana.",
        en: "My neighbors are very nice.",
        vi: "Hàng xóm của tôi rất tốt.",
        note_vi:
          "jirani = hàng xóm (từ gốc Ả Rập). wema = tốt (số nhiều của -ema, hòa hợp với jirani lớp wa-).",
      },
    ],
    vocabulary: [
      { sw: "nyumba", en: "house", vi: "nhà", pos: "n.", ngeli: "n/n" },
      { sw: "chumba", en: "room", vi: "phòng", pos: "n.", ngeli: "ki/vi" },
      { sw: "kodi", en: "rent / tax", vi: "tiền thuê / thuế", pos: "n.", ngeli: "n/n" },
      { sw: "bafu", en: "bathroom", vi: "phòng tắm", pos: "n.", ngeli: "n/n" },
      { sw: "jirani", en: "neighbor", vi: "hàng xóm", pos: "n.", ngeli: "ma-" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Nyumba hii ina _____ vitatu.",
        answer: "vyumba",
        hint_vi: "số nhiều của 'chumba' (phòng)",
        hint_en: "plural of 'chumba' (room)",
      },
    ],
    cultural_notes_vi:
      "Khi thuê nhà ở Tanzania hay Kenya, chủ nhà thường yêu cầu trả trước vài tháng. Hợp đồng thuê thường bằng tiếng Anh ở thành phố lớn, nhưng thương lượng bằng Swahili sẽ giúp bạn có giá tốt hơn và mối quan hệ tốt hơn với chủ nhà.",
    cultural_notes_en:
      "When renting in Tanzania or Kenya, landlords often ask for several months' rent upfront. Lease agreements are usually in English in big cities, but negotiating in Swahili gets you better prices and better relationships with landlords.",
    tip_advice_vi:
      "Học các tiền tố lớp danh từ: ki-/vi- (chumba/vyumba), m-/mi- (mlango/milango). Khi bạn biết lớp danh từ, bạn sẽ biết cách tạo số nhiều đúng.",
    tip_advice_en:
      "Learn noun class prefixes: ki-/vi- (chumba/vyumba), m-/mi- (mlango/milango). When you know the noun class, you know the correct plural.",
  },
];

export default lessons;
