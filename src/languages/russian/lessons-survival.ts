// src/languages/russian/lessons-survival.ts
//
// Survival Russian lesson batch for Vietnamese learners in urgent, real-life
// situations (emergency, food/money, doctor/pharmacy, police/legal, housing,
// first week at work, immigration, phone calls).
//
// Converted from the local Vietnamese-Russian survival archive:
//   first-72-hours-russian.md, survival-russian-priority-pack.md,
//   survival-phrases.md, survival-dialogue-drills.md,
//   survival-phone-call-scripts.md, survival-sentence-patterns.md,
//   emergency-cards.md, food-and-money-survival.md,
//   doctor-pharmacy-survival.md, police-legal-survival.md,
//   housing-survival-russian.md, workplace-survival-first-week.md,
//   immigration-simulator.md
//
// These are language-support phrases, not legal/medical advice. Native review
// is deferred (owner in survival mode); critical phrases should be verified
// before high-stakes use. Lessons reuse the shared RussianLesson shape so they
// normalize through the existing renderer with no schema changes.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_survival_first_72h",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Sống còn: 72 giờ đầu và câu cứu nguy",
    title_en: "A1 Survival: first 72 hours and rescue phrases",
    intro_vi:
      "Khi vừa đến và chưa hiểu gì, chỉ cần vài câu ngắn để hạ tốc độ hội thoại và xin giúp đỡ. Mục tiêu là an toàn, không phải nói hay.",
    intro_en:
      "When you just arrived and understand little, a few short lines slow the conversation and get help. The goal is safety, not fluent Russian.",
    sentences: [
      {
        russian: "Здравствуйте.",
        romanization: "Zdravstvuyte.",
        en: "Hello. (polite)",
        vi: "Xin chào. (lịch sự)",
        pronunciation_focus: ["в đầu thường lặng", "trọng âm -стуй"],
        pronunciation_focus_en: ["the first в is often silent", "stress on -стуй"],
      },
      {
        russian: "Я не понимаю.",
        romanization: "Ya ne ponimayu.",
        en: "I do not understand.",
        vi: "Tôi không hiểu.",
        pronunciation_focus: ["не đọc gọn nhẹ", "trọng âm -ма-"],
        pronunciation_focus_en: ["не is light and quick", "stress on -ма-"],
      },
      {
        russian: "Говорите медленнее, пожалуйста.",
        romanization: "Govorite medlenneye, pozhaluysta.",
        en: "Please speak slower.",
        vi: "Làm ơn nói chậm hơn.",
        pronunciation_focus: ["о không nhấn nghe gần a", "пожалуйста rút gọn pa-ZHAL-sta"],
        pronunciation_focus_en: ["unstressed о sounds near a", "пожалуйста reduces to pa-ZHAL-sta"],
      },
      {
        russian: "Напишите, пожалуйста.",
        romanization: "Napishite, pozhaluysta.",
        en: "Please write it down.",
        vi: "Làm ơn viết ra.",
        pronunciation_focus: ["trọng âm -ши-", "ш cứng"],
        pronunciation_focus_en: ["stress on -ши-", "ш is a hard sh"],
      },
      {
        russian: "Мне нужна помощь.",
        romanization: "Mne nuzhna pomoshch.",
        en: "I need help.",
        vi: "Tôi cần giúp đỡ.",
        pronunciation_focus: ["щ mềm và dài", "нужна giống cái"],
        pronunciation_focus_en: ["щ is soft and long", "нужна matches a feminine noun"],
      },
      {
        russian: "Мне нужен переводчик.",
        romanization: "Mne nuzhen perevodchik.",
        en: "I need an interpreter.",
        vi: "Tôi cần phiên dịch.",
        pronunciation_focus: ["нужен giống đực", "trọng âm -вод-"],
        pronunciation_focus_en: ["нужен matches a masculine noun", "stress on -вод-"],
      },
    ],
    vocabulary: [
      { cell_id: "1c6612a9-06f8-4ad7-8a6b-5b71d9b0c068", word: "помощь", romanization: "pomoshch", en: "help", vi: "sự giúp đỡ", pos: "noun", pronunciation_vi: "PO-mosh", pronunciation_en: "PO-moshch" },
      { cell_id: "a72adca0-61d2-4c8b-9e37-b947dfc21b90", word: "переводчик", romanization: "perevodchik", en: "interpreter", vi: "phiên dịch", pos: "noun", pronunciation_vi: "pe-re-VOD-chik", pronunciation_en: "pe-re-VOD-chik" },
      { cell_id: "4a96bfd3-3de1-45e5-87f4-10b208c461e2", word: "медленнее", romanization: "medlenneye", en: "slower", vi: "chậm hơn", pos: "adverb", pronunciation_vi: "MYED-le-ne-ye", pronunciation_en: "MED-len-ne-ye" },
      { cell_id: "813b4534-1895-4d34-b9ed-759f09470cce", word: "понимать", romanization: "ponimat", en: "to understand", vi: "hiểu", pos: "verb", pronunciation_vi: "pa-ni-MAT", pronunciation_en: "pa-nee-MAT" },
      { cell_id: "20d24b23-4437-4a98-b015-4c2edaca4e1b", word: "написать", romanization: "napisat", en: "to write down", vi: "viết ra", pos: "verb", pronunciation_vi: "na-pi-SAT", pronunciation_en: "na-pee-SAT" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi không hiểu.", answer: "Я не понимаю." },
          { prompt: "Tôi cần phiên dịch.", answer: "Мне нужен переводчик." },
          { prompt: "Làm ơn viết ra.", answer: "Напишите, пожалуйста." },
        ],
      },
    ],
    cultural_notes_vi:
      "Nói `Я плохо говорю по-русски` sớm để người ta tự động nói chậm và đơn giản hơn. Người Nga thường tôn trọng người chủ động xin giúp một cách lịch sự.",
    cultural_notes_en:
      "Saying `Я плохо говорю по-русски` early prompts people to slow down and simplify. Asking politely for help is respected.",
    tip_advice_vi:
      "Học thuộc 6 câu này trước. Khi căng thẳng, lặp lại cùng một câu thay vì cố ghép câu dài.",
    tip_advice_en:
      "Memorize these six lines first. Under stress, repeat the same line instead of building long sentences.",
  },
  {
    id: "russian_survival_emergency",
    level: "A1",
    category: "practical_tasks",
    title_vi: "A1 Sống còn: khẩn cấp và nguy hiểm",
    title_en: "A1 Survival: emergency and danger",
    intro_vi:
      "Khi có nguy hiểm thật, gọi dịch vụ khẩn cấp trước, sau đó dùng câu ngắn để báo tình huống. Nói to, rõ, và lặp lại.",
    intro_en:
      "In real danger, call emergency services first, then use short lines to state the situation. Speak loudly, clearly, and repeat.",
    sentences: [
      {
        russian: "Помогите, пожалуйста!",
        romanization: "Pomogite, pozhaluysta!",
        en: "Help, please!",
        vi: "Làm ơn giúp tôi!",
        pronunciation_focus: ["г = g", "trọng âm -ги-"],
        pronunciation_focus_en: ["г is g", "stress on -ги-"],
      },
      {
        russian: "Вызовите скорую.",
        romanization: "Vyzovite skoruyu.",
        en: "Call an ambulance.",
        vi: "Hãy gọi cấp cứu.",
        pronunciation_focus: ["ы sâu trong cổ", "скорую = xe cứu thương"],
        pronunciation_focus_en: ["ы is a deep back vowel", "скорую means the ambulance"],
      },
      {
        russian: "Вызовите полицию.",
        romanization: "Vyzovite politsiyu.",
        en: "Call the police.",
        vi: "Hãy gọi cảnh sát.",
        pronunciation_focus: ["ц = ts", "trọng âm -ли-"],
        pronunciation_focus_en: ["ц is ts", "stress on -ли-"],
      },
      {
        russian: "Это срочно.",
        romanization: "Eto srochno.",
        en: "This is urgent.",
        vi: "Việc này khẩn cấp.",
        pronunciation_focus: ["cụm ср nói liền, không thêm nguyên âm", "ч = ch"],
        pronunciation_focus_en: ["say ср as one cluster, no extra vowel", "ч is ch"],
      },
      {
        russian: "Я в опасности.",
        romanization: "Ya v opasnosti.",
        en: "I am in danger.",
        vi: "Tôi đang gặp nguy hiểm.",
        pronunciation_focus: ["в dính vào từ sau", "trọng âm -пас-"],
        pronunciation_focus_en: ["в attaches to the next word", "stress on -пас-"],
      },
      {
        russian: "Не трогайте меня.",
        romanization: "Ne trogayte menya.",
        en: "Do not touch me.",
        vi: "Đừng chạm vào tôi.",
        pronunciation_focus: ["cụm тр nói liền", "câu ranh giới, nói dứt khoát"],
        pronunciation_focus_en: ["say тр as one cluster", "a boundary line; say it firmly"],
      },
    ],
    vocabulary: [
      { cell_id: "a4c84786-703f-4943-bd8b-6610c2110919", word: "скорая", romanization: "skoraya", en: "ambulance", vi: "xe cấp cứu", pos: "noun", pronunciation_vi: "SKO-ra-ya", pronunciation_en: "SKO-ra-ya" },
      { cell_id: "a08898b4-77aa-4d02-9d7b-87225f81cad6", word: "полиция", romanization: "politsiya", en: "police", vi: "cảnh sát", pos: "noun", pronunciation_vi: "pa-LI-tsi-ya", pronunciation_en: "pa-LEE-tsi-ya" },
      { cell_id: "c949ea92-f7b3-46ee-a982-99c29d0c6985", word: "срочно", romanization: "srochno", en: "urgent", vi: "khẩn cấp", pos: "adverb", pronunciation_vi: "SROCH-na", pronunciation_en: "SROCH-na" },
      { cell_id: "aedb15be-3ca3-4617-b642-766b9761dd06", word: "опасность", romanization: "opasnost", en: "danger", vi: "nguy hiểm", pos: "noun", pronunciation_vi: "a-PAS-nast", pronunciation_en: "a-PAS-nost" },
      { cell_id: "a32d0ad1-15fe-4deb-8e13-d1ace6a1514b", word: "помогите", romanization: "pomogite", en: "help! (request)", vi: "giúp với!", pos: "verb", pronunciation_vi: "pa-ma-GHI-te", pronunciation_en: "pa-ma-GHEE-te" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối câu tiếng Nga với tình huống.",
        instruction_en: "Match each Russian line with its situation.",
        items: [
          { prompt: "Вызовите скорую.", answer: "cần cấp cứu" },
          { prompt: "Вызовите полицию.", answer: "cần cảnh sát" },
          { prompt: "Это срочно.", answer: "khẩn cấp" },
          { prompt: "Не трогайте меня.", answer: "đặt ranh giới" },
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Nga, số khẩn cấp chung là 112. Hãy biết trước số này và địa chỉ nơi mình đang ở để đọc cho tổng đài.",
    cultural_notes_en:
      "In Russia the general emergency number is 112. Know it in advance and be ready to read your current address to the operator.",
    tip_advice_vi:
      "Trong nguy hiểm, gọi 112 trước, nói tình huống bằng một câu, rồi đọc địa chỉ. Đừng cố giải thích dài.",
    tip_advice_en:
      "In danger, dial 112 first, state the situation in one line, then read your address. Do not over-explain.",
  },
  {
    id: "russian_survival_food_shopping",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Sống còn: mua đồ ăn và hỏi giá",
    title_en: "A1 Survival: food and asking prices",
    intro_vi:
      "Để mua đồ ăn khi ngân sách ít, bạn cần hỏi giá, hỏi rẻ hơn, và báo dị ứng. Vài câu ngắn là đủ để mua an toàn.",
    intro_en:
      "To buy food on a tight budget you must ask prices, ask for cheaper, and state allergies. A few short lines are enough to shop safely.",
    sentences: [
      {
        russian: "Сколько это стоит?",
        romanization: "Skolko eto stoit?",
        en: "How much is this?",
        vi: "Cái này giá bao nhiêu?",
        pronunciation_focus: ["л cứng trong сколько", "trọng âm SKOL-"],
        pronunciation_focus_en: ["hard л in сколько", "stress on SKOL-"],
      },
      {
        russian: "Это слишком дорого.",
        romanization: "Eto slishkom dorogo.",
        en: "This is too expensive.",
        vi: "Cái này quá đắt.",
        pronunciation_focus: ["ш cứng", "trọng âm DO-ro-go"],
        pronunciation_focus_en: ["hard ш", "stress on DO-ro-go"],
      },
      {
        russian: "Можно дешевле?",
        romanization: "Mozhno deshevle?",
        en: "Can it be cheaper?",
        vi: "Có thể rẻ hơn không?",
        pronunciation_focus: ["ж = âm zh", "trọng âm -шев-"],
        pronunciation_focus_en: ["ж is the zh sound", "stress on -шев-"],
      },
      {
        russian: "У меня аллергия.",
        romanization: "U menya allergiya.",
        en: "I have an allergy.",
        vi: "Tôi bị dị ứng.",
        pronunciation_focus: ["ll đọc một âm l dài", "trọng âm -ги-"],
        pronunciation_focus_en: ["ll is one long l", "stress on -ги-"],
      },
      {
        russian: "Мне нужна вода.",
        romanization: "Mne nuzhna voda.",
        en: "I need water.",
        vi: "Tôi cần nước.",
        pronunciation_focus: ["о đầu không nhấn nghe gần a", "нужна giống cái"],
        pronunciation_focus_en: ["unstressed о sounds near a", "нужна matches a feminine noun"],
      },
      {
        russian: "Дайте чек, пожалуйста.",
        romanization: "Dayte chek, pozhaluysta.",
        en: "Please give me the receipt.",
        vi: "Làm ơn cho hóa đơn.",
        pronunciation_focus: ["ч = ch", "чек = biên lai/hóa đơn"],
        pronunciation_focus_en: ["ч is ch", "чек means receipt"],
      },
    ],
    vocabulary: [
      { cell_id: "e98334de-eced-4ec3-be9b-2ac95c7b7410", word: "цена", romanization: "tsena", en: "price", vi: "giá", pos: "noun", pronunciation_vi: "tsi-NA", pronunciation_en: "tsee-NA" },
      { cell_id: "1f72811b-198c-4bcc-944d-da0d21f0e6e9", word: "дорого", romanization: "dorogo", en: "expensive", vi: "đắt", pos: "adverb", pronunciation_vi: "DO-ra-ga", pronunciation_en: "DO-ra-ga" },
      { cell_id: "1cbcfa89-5ca6-46c0-9745-2fd744836fd4", word: "дешевле", romanization: "deshevle", en: "cheaper", vi: "rẻ hơn", pos: "adverb", pronunciation_vi: "de-SHEV-le", pronunciation_en: "de-SHEV-le" },
      { cell_id: "8abf79b8-3392-474e-8cfb-2c9fad3d3898", word: "вода", romanization: "voda", en: "water", vi: "nước", pos: "noun", pronunciation_vi: "va-DA", pronunciation_en: "va-DA" },
      { cell_id: "793ae112-75dd-48cc-a030-3cf5b467dc89", word: "чек", romanization: "chek", en: "receipt", vi: "biên lai", pos: "noun", pronunciation_vi: "chek", pronunciation_en: "chek" },
      { cell_id: "b8cc6a25-ce0a-40c0-8bdd-415c3989c5e9", word: "скидка", romanization: "skidka", en: "discount", vi: "giảm giá", pos: "noun", pronunciation_vi: "SKID-ka", pronunciation_en: "SKEED-ka" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Cái này giá bao nhiêu?", answer: "Сколько это стоит?" },
          { prompt: "Có thể rẻ hơn không?", answer: "Можно дешевле?" },
          { prompt: "Làm ơn cho hóa đơn.", answer: "Дайте чек, пожалуйста." },
        ],
      },
    ],
    cultural_notes_vi:
      "Biển `Скидка` = giảm giá, `Акция` = khuyến mãi, `Распродажа` = thanh lý. Hãy hỏi `Это цена за килограмм?` vì nhiều giá là theo kg.",
    cultural_notes_en:
      "Signs: `Скидка` = discount, `Акция` = promotion, `Распродажа` = sale. Ask `Это цена за килограмм?` because many prices are per kilogram.",
    tip_advice_vi:
      "Khi tiền ít, hỏi giá trước khi mua, hỏi xem theo cái hay theo kg, và luôn giữ hóa đơn.",
    tip_advice_en:
      "When money is tight, ask the price before buying, check per item vs per kilogram, and keep receipts.",
  },
  {
    id: "russian_survival_money_bank",
    level: "A1",
    category: "practical_tasks",
    title_vi: "A1 Sống còn: tiền và ngân hàng",
    title_en: "A1 Survival: money and banking",
    intro_vi:
      "Để trả tiền, rút tiền, và tránh phí bất ngờ, bạn cần vài câu về thẻ, tiền mặt, và máy ATM. Lỗi về tiền khó sửa nên hãy hỏi trước.",
    intro_en:
      "To pay, withdraw cash, and avoid surprise fees you need a few lines about cards, cash, and ATMs. Money mistakes are hard to undo, so ask first.",
    sentences: [
      {
        russian: "Можно оплатить картой?",
        romanization: "Mozhno oplatit kartoy?",
        en: "Can I pay by card?",
        vi: "Có thể trả bằng thẻ không?",
        pronunciation_focus: ["trọng âm -ла-tit", "карта = thẻ"],
        pronunciation_focus_en: ["stress on -ла-tit", "карта means card"],
      },
      {
        russian: "У меня только наличные.",
        romanization: "U menya tolko nalichnye.",
        en: "I only have cash.",
        vi: "Tôi chỉ có tiền mặt.",
        pronunciation_focus: ["ч = ch", "л cứng trong только"],
        pronunciation_focus_en: ["ч is ch", "hard л in только"],
      },
      {
        russian: "Где банкомат?",
        romanization: "Gde bankomat?",
        en: "Where is the ATM?",
        vi: "ATM ở đâu?",
        pronunciation_focus: ["cụm гд nói liền", "trọng âm cuối -МАТ"],
        pronunciation_focus_en: ["say гд as one cluster", "final stress -МАТ"],
      },
      {
        russian: "Карта не работает.",
        romanization: "Karta ne rabotayet.",
        en: "The card does not work.",
        vi: "Thẻ không hoạt động.",
        pronunciation_focus: ["о không nhấn nghe gần a", "trọng âm -бо-"],
        pronunciation_focus_en: ["unstressed о sounds near a", "stress on -бо-"],
      },
      {
        russian: "Какая комиссия?",
        romanization: "Kakaya komissiya?",
        en: "What is the fee?",
        vi: "Phí là bao nhiêu?",
        pronunciation_focus: ["комиссия = phí", "trọng âm -ми-"],
        pronunciation_focus_en: ["комиссия means fee", "stress on -ми-"],
      },
      {
        russian: "Я хочу снять деньги.",
        romanization: "Ya khochu snyat dengi.",
        en: "I want to withdraw money.",
        vi: "Tôi muốn rút tiền.",
        pronunciation_focus: ["х gần kh", "cụm сн nói liền"],
        pronunciation_focus_en: ["х is close to kh", "say сн as one cluster"],
      },
    ],
    vocabulary: [
      { cell_id: "798c035f-e11d-4b2c-890c-115ea88799cd", word: "наличные", romanization: "nalichnye", en: "cash", vi: "tiền mặt", pos: "noun", pronunciation_vi: "na-LICH-nye", pronunciation_en: "na-LEECH-nye" },
      { cell_id: "a13206cb-e043-442b-93eb-0f0d65148129", word: "карта", romanization: "karta", en: "card", vi: "thẻ", pos: "noun", pronunciation_vi: "KAR-ta", pronunciation_en: "KAR-ta" },
      { cell_id: "9fd94a19-80e6-4481-8cd8-e7b40221889b", word: "банкомат", romanization: "bankomat", en: "ATM", vi: "máy ATM", pos: "noun", pronunciation_vi: "ban-ka-MAT", pronunciation_en: "ban-ka-MAT" },
      { cell_id: "6b68ff15-ff3e-4e24-bfef-e5e5fa838487", word: "комиссия", romanization: "komissiya", en: "fee / commission", vi: "phí", pos: "noun", pronunciation_vi: "ka-MI-si-ya", pronunciation_en: "ka-MEE-si-ya" },
      { cell_id: "bb2c998a-fe50-4881-acd9-e20934ebff43", word: "деньги", romanization: "dengi", en: "money", vi: "tiền", pos: "noun", pronunciation_vi: "DYEN-ghi", pronunciation_en: "DEN-ghee" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Có thể trả bằng thẻ không?", answer: "Можно оплатить картой?" },
          { prompt: "ATM ở đâu?", answer: "Где банкомат?" },
          { prompt: "Phí là bao nhiêu?", answer: "Какая комиссия?" },
        ],
      },
    ],
    cultural_notes_vi:
      "`комиссия` nghĩa là phí. Khi tiền eo hẹp, luôn hỏi `Какая комиссия?` trước khi rút ở ATM lạ.",
    cultural_notes_en:
      "`комиссия` means a fee. When money is tight, always ask `Какая комиссия?` before withdrawing at an unfamiliar ATM.",
    tip_advice_vi:
      "Mang theo cả tiền mặt và thẻ. Nếu thẻ lỗi, nói `Можно наличными?` để chuyển sang tiền mặt.",
    tip_advice_en:
      "Carry both cash and card. If the card fails, say `Можно наличными?` to switch to cash.",
  },
  {
    id: "russian_survival_doctor_symptoms",
    level: "A1",
    category: "practical_tasks",
    title_vi: "A1 Sống còn: bác sĩ và triệu chứng",
    title_en: "A1 Survival: doctor and symptoms",
    intro_vi:
      "Khi bị bệnh, hãy nói triệu chứng chính trước, rồi báo dị ứng. Với y tế, đừng đoán; nếu không hiểu, xin viết ra.",
    intro_en:
      "When sick, state your main symptom first, then your allergy. With health, do not guess; if you do not understand, ask for it in writing.",
    sentences: [
      {
        russian: "Мне нужен врач.",
        romanization: "Mne nuzhen vrach.",
        en: "I need a doctor.",
        vi: "Tôi cần bác sĩ.",
        pronunciation_focus: ["cụm вр nói liền", "ч = ch"],
        pronunciation_focus_en: ["say вр as one cluster", "ч is ch"],
      },
      {
        russian: "Мне плохо.",
        romanization: "Mne plokho.",
        en: "I feel unwell.",
        vi: "Tôi thấy không khỏe.",
        pronunciation_focus: ["х gần kh", "câu ngắn báo mệt"],
        pronunciation_focus_en: ["х is close to kh", "a short line to report feeling ill"],
      },
      {
        russian: "У меня температура.",
        romanization: "U menya temperatura.",
        en: "I have a fever.",
        vi: "Tôi bị sốt.",
        pronunciation_focus: ["trong y tế температура thường nghĩa là sốt", "trọng âm -ту-ра"],
        pronunciation_focus_en: ["in clinics температура usually means fever", "stress on -ту-ra"],
      },
      {
        russian: "У меня болит голова.",
        romanization: "U menya bolit golova.",
        en: "My head hurts.",
        vi: "Tôi đau đầu.",
        pronunciation_focus: ["mẫu болит + bộ phận", "trọng âm -ва cuối голова"],
        pronunciation_focus_en: ["pattern болит + body part", "final stress on голова"],
      },
      {
        russian: "Мне трудно дышать.",
        romanization: "Mne trudno dyshat.",
        en: "I have trouble breathing.",
        vi: "Tôi khó thở.",
        pronunciation_focus: ["câu nghiêm trọng, cần hỗ trợ ngay", "ы sâu trong dышать"],
        pronunciation_focus_en: ["a serious line; get help immediately", "ы is a deep vowel in дышать"],
      },
      {
        russian: "У меня аллергия на это.",
        romanization: "U menya allergiya na eto.",
        en: "I am allergic to this.",
        vi: "Tôi dị ứng với cái này.",
        pronunciation_focus: ["nói trước khi nhận thuốc/đồ ăn", "trọng âm -ги-"],
        pronunciation_focus_en: ["say this before taking medicine or food", "stress on -ги-"],
      },
    ],
    vocabulary: [
      { cell_id: "c2fde819-d726-43e7-85ff-4f4acbfdd370", word: "врач", romanization: "vrach", en: "doctor", vi: "bác sĩ", pos: "noun", pronunciation_vi: "vrach", pronunciation_en: "vrahch" },
      { cell_id: "1b3f522e-1635-46fd-8b02-9839f77283c3", word: "температура", romanization: "temperatura", en: "fever / temperature", vi: "sốt", pos: "noun", pronunciation_vi: "tem-pe-ra-TU-ra", pronunciation_en: "tem-pe-ra-TOO-ra" },
      { cell_id: "898f9668-ab51-483e-857f-5b352410bdf9", word: "болит", romanization: "bolit", en: "hurts", vi: "đau", pos: "verb", pronunciation_vi: "ba-LIT", pronunciation_en: "ba-LEET" },
      { cell_id: "3043c600-0a4a-49a0-a369-89c0ffe3d1e5", word: "голова", romanization: "golova", en: "head", vi: "đầu", pos: "noun", pronunciation_vi: "ga-la-VA", pronunciation_en: "ga-la-VA" },
      { cell_id: "be11b9c0-4ddc-4dad-8f72-46e7c06044dc", word: "аллергия", romanization: "allergiya", en: "allergy", vi: "dị ứng", pos: "noun", pronunciation_vi: "a-ler-GHI-ya", pronunciation_en: "a-ler-GHEE-ya" },
    ],
    dialogue: [
      { cell_id: "5189d18d-d848-43d2-b622-b9efb9dcd919", speaker: "Bác sĩ", text: "Где болит?", romanization: "Gde bolit?", vi: "Đau ở đâu?", en: "Where does it hurt?" },
      { cell_id: "c122b919-fe6e-40bd-ad00-2b1a1f97ab2e", speaker: "Bạn", text: "Болит здесь.", romanization: "Bolit zdes.", vi: "Đau ở đây.", en: "It hurts here." },
      { cell_id: "8fcbbf3a-54ff-4a13-a2ca-2f21307287e3", speaker: "Bác sĩ", text: "Как давно болит?", romanization: "Kak davno bolit?", vi: "Đau lâu chưa?", en: "How long has it hurt?" },
      { cell_id: "ffcb866a-f449-411a-885c-8ae88d025f47", speaker: "Bạn", text: "С сегодняшнего утра.", romanization: "S segodnyashnego utra.", vi: "Từ sáng nay.", en: "Since this morning." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối triệu chứng với câu tiếng Nga.",
        instruction_en: "Match each symptom with its Russian line.",
        items: [
          { prompt: "đau đầu", answer: "У меня болит голова." },
          { prompt: "bị sốt", answer: "У меня температура." },
          { prompt: "khó thở", answer: "Мне трудно дышать." },
          { prompt: "không khỏe", answer: "Мне плохо." },
        ],
      },
    ],
    cultural_notes_vi:
      "Mang theo giấy viết sẵn: dị ứng, thuốc đang dùng, liên hệ khẩn cấp. Khi triệu chứng nặng (đau ngực, khó thở), tìm trợ giúp y tế trước, học sau.",
    cultural_notes_en:
      "Carry a written note: allergies, current medicines, emergency contact. For serious symptoms (chest pain, breathing trouble), get medical help first and study later.",
    tip_advice_vi:
      "Dùng mẫu `У меня болит + bộ phận` để chỉ vị trí đau: голова, живот, горло, спина.",
    tip_advice_en:
      "Use the pattern `У меня болит + body part` to point to pain: head, stomach, throat, back.",
  },
  {
    id: "russian_survival_pharmacy_medicine",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2 Sống còn: nhà thuốc và cách dùng thuốc",
    title_en: "A2 Survival: pharmacy and how to take medicine",
    intro_vi:
      "Ở nhà thuốc, hỏi thuốc cho triệu chứng, hỏi cách dùng, và luôn xin hướng dẫn viết ra nếu không chắc.",
    intro_en:
      "At the pharmacy, ask for medicine by symptom, ask how to take it, and always ask for written instructions when unsure.",
    sentences: [
      {
        russian: "Мне нужно лекарство от боли.",
        romanization: "Mne nuzhno lekarstvo ot boli.",
        en: "I need medicine for pain.",
        vi: "Tôi cần thuốc giảm đau.",
        pronunciation_focus: ["mẫu лекарство от + bệnh", "boли = đau ở dạng sau от"],
        pronunciation_focus_en: ["pattern лекарство от + ailment", "боль becomes боли after от"],
      },
      {
        russian: "Как принимать это?",
        romanization: "Kak prinimat eto?",
        en: "How do I take this?",
        vi: "Dùng thuốc này thế nào?",
        pronunciation_focus: ["принимать dùng cho uống thuốc", "trọng âm -ма-"],
        pronunciation_focus_en: ["принимать is used for taking medicine", "stress on -ма-"],
      },
      {
        russian: "Сколько раз в день?",
        romanization: "Skolko raz v den?",
        en: "How many times a day?",
        vi: "Mỗi ngày mấy lần?",
        pronunciation_focus: ["в dính vào день", "câu hỏi liều theo ngày"],
        pronunciation_focus_en: ["в attaches to день", "asks the daily dose"],
      },
      {
        russian: "До еды или после еды?",
        romanization: "Do yedy ili posle yedy?",
        en: "Before food or after food?",
        vi: "Trước ăn hay sau ăn?",
        pronunciation_focus: ["câu rất quan trọng với thuốc", "еды = (của) đồ ăn"],
        pronunciation_focus_en: ["a very important medicine question", "еды means of food"],
      },
      {
        russian: "Есть побочные эффекты?",
        romanization: "Yest pobochnye effekty?",
        en: "Are there side effects?",
        vi: "Có tác dụng phụ không?",
        pronunciation_focus: ["ч = ch", "trọng âm -боч-"],
        pronunciation_focus_en: ["ч is ch", "stress on -боч-"],
      },
      {
        russian: "У меня есть рецепт.",
        romanization: "U menya yest retsept.",
        en: "I have a prescription.",
        vi: "Tôi có toa thuốc.",
        pronunciation_focus: ["ц = ts", "рецепт = toa thuốc"],
        pronunciation_focus_en: ["ц is ts", "рецепт means prescription"],
      },
    ],
    vocabulary: [
      { cell_id: "826ff4b1-1b25-45a4-8958-b11524af450c", word: "лекарство", romanization: "lekarstvo", en: "medicine", vi: "thuốc", pos: "noun", pronunciation_vi: "le-KAR-stva", pronunciation_en: "le-KAR-stva" },
      { cell_id: "8e26037d-df03-4a62-a284-f9551e87d5b4", word: "рецепт", romanization: "retsept", en: "prescription", vi: "toa thuốc", pos: "noun", pronunciation_vi: "re-TSEPT", pronunciation_en: "re-TSEPT" },
      { cell_id: "c3de8446-3831-402c-b9a6-b8e5350d59a5", word: "принимать", romanization: "prinimat", en: "to take (medicine)", vi: "uống / dùng thuốc", pos: "verb", pronunciation_vi: "pri-ni-MAT", pronunciation_en: "pree-nee-MAT" },
      { cell_id: "46a9fd6e-5073-4426-a61f-95868470033f", word: "доза", romanization: "doza", en: "dose", vi: "liều", pos: "noun", pronunciation_vi: "DO-za", pronunciation_en: "DO-za" },
      { cell_id: "0fa470c2-b927-45b2-af74-bf9f123300d4", word: "аптека", romanization: "apteka", en: "pharmacy", vi: "nhà thuốc", pos: "noun", pronunciation_vi: "ap-TYE-ka", pronunciation_en: "ap-TEH-ka" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Мне нужно ______ от боли. (thuốc)", answer: "лекарство" },
          { prompt: "Как ______ это? (dùng/uống)", answer: "принимать" },
          { prompt: "У меня есть ______. (toa thuốc)", answer: "рецепт" },
        ],
      },
    ],
    cultural_notes_vi:
      "Nếu dược sĩ khuyên gặp bác sĩ (`Вам лучше обратиться к врачу`), đừng cố tự mua. Hỏi `Где врач?` hoặc `Где клиника?`.",
    cultural_notes_en:
      "If the pharmacist says see a doctor (`Вам лучше обратиться к врачу`), do not self-medicate. Ask `Где врач?` or `Где клиника?`.",
    tip_advice_vi:
      "Với tên thuốc hoặc thành phần khó, hãy xin `Напишите инструкцию, пожалуйста` thay vì chỉ phát âm.",
    tip_advice_en:
      "For hard drug or ingredient names, ask `Напишите инструкцию, пожалуйста` instead of only pronouncing them.",
  },
  {
    id: "russian_survival_police_id_docs",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2 Sống còn: kiểm tra giấy tờ và mất giấy tờ",
    title_en: "A2 Survival: ID checks and lost documents",
    intro_vi:
      "Khi cảnh sát kiểm tra giấy tờ, hãy bình tĩnh, chỉ đưa giấy khi được yêu cầu, và xin phiên dịch. Đừng ký khi chưa hiểu.",
    intro_en:
      "In an ID check, stay calm, show documents only when asked, and request an interpreter. Do not sign what you do not understand.",
    sentences: [
      {
        russian: "Вот мой паспорт.",
        romanization: "Vot moy pasport.",
        en: "Here is my passport.",
        vi: "Đây là hộ chiếu của tôi.",
        pronunciation_focus: ["паспорт gần giống tiếng Việt", "trọng âm PAS-"],
        pronunciation_focus_en: ["паспорт is close to the English word", "stress on PAS-"],
      },
      {
        russian: "У меня есть регистрация.",
        romanization: "U menya yest registratsiya.",
        en: "I have a registration.",
        vi: "Tôi có đăng ký cư trú.",
        pronunciation_focus: ["ц = ts", "регистрация = đăng ký cư trú"],
        pronunciation_focus_en: ["ц is ts", "регистрация means residence registration"],
      },
      {
        russian: "Можно я достану документы?",
        romanization: "Mozhno ya dostanu dokumenty?",
        en: "May I take out my documents?",
        vi: "Tôi có thể lấy giấy tờ ra không?",
        pronunciation_focus: ["xin phép trước khi với tay vào túi", "trọng âm -та-"],
        pronunciation_focus_en: ["ask permission before reaching into a bag", "stress on -та-"],
      },
      {
        russian: "Я потерял паспорт.",
        romanization: "Ya poteryal pasport.",
        en: "I lost my passport. (male speaker)",
        vi: "Tôi làm mất hộ chiếu. (nam nói)",
        pronunciation_focus: ["nữ nói потеряла", "trọng âm -ря-"],
        pronunciation_focus_en: ["a female speaker says потеряла", "stress on -ря-"],
      },
      {
        russian: "У меня украли телефон.",
        romanization: "U menya ukrali telefon.",
        en: "My phone was stolen.",
        vi: "Điện thoại của tôi bị trộm.",
        pronunciation_focus: ["украли = bị (họ) trộm", "trọng âm -кра-"],
        pronunciation_focus_en: ["украли means they stole", "stress on -кра-"],
      },
      {
        russian: "Я не буду подписывать без перевода.",
        romanization: "Ya ne budu podpisyvat bez perevoda.",
        en: "I will not sign without a translation.",
        vi: "Tôi sẽ không ký nếu không có bản dịch.",
        pronunciation_focus: ["câu bảo vệ bản thân", "trọng âm -пи-"],
        pronunciation_focus_en: ["a self-protection line", "stress on -пи-"],
      },
    ],
    vocabulary: [
      { cell_id: "4d7000a6-2e6a-4ac9-8472-8d44c0ad2807", word: "паспорт", romanization: "pasport", en: "passport", vi: "hộ chiếu", pos: "noun", pronunciation_vi: "PAS-part", pronunciation_en: "PAS-port" },
      { cell_id: "5895479a-c592-4e3c-acfa-64d6d8bb4cd7", word: "регистрация", romanization: "registratsiya", en: "registration", vi: "đăng ký cư trú", pos: "noun", pronunciation_vi: "re-ghi-STRA-tsi-ya", pronunciation_en: "re-ghee-STRA-tsi-ya" },
      { cell_id: "46b1fde6-9d39-4a5d-aeb7-7fd4054094e8", word: "документы", romanization: "dokumenty", en: "documents", vi: "giấy tờ", pos: "noun", pronunciation_vi: "da-ku-MYEN-ty", pronunciation_en: "da-koo-MEN-ty" },
      { cell_id: "00aaa784-e106-43d7-9a25-7a01f077e5d9", word: "украли", romanization: "ukrali", en: "(they) stole", vi: "đã bị trộm", pos: "verb", pronunciation_vi: "u-KRA-li", pronunciation_en: "oo-KRA-lee" },
      { cell_id: "d555f456-a01c-43f5-b9c2-0f409f6bbdeb", word: "перевод", romanization: "perevod", en: "translation", vi: "bản dịch", pos: "noun", pronunciation_vi: "pe-re-VOT", pronunciation_en: "pe-re-VOT" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Đây là hộ chiếu của tôi.", answer: "Вот мой паспорт." },
          { prompt: "Điện thoại của tôi bị trộm.", answer: "У меня украли телефон." },
          { prompt: "Tôi sẽ không ký nếu không có bản dịch.", answer: "Я не буду подписывать без перевода." },
        ],
      },
    ],
    cultural_notes_vi:
      "Nam dùng `потерял`, nữ dùng `потеряла`; quá khứ tiếng Nga đổi theo giới tính. Hãy giữ bản sao/ảnh chụp giấy tờ riêng.",
    cultural_notes_en:
      "Men say `потерял`, women say `потеряла`; Russian past tense changes by gender. Keep copies or photos of your documents separately.",
    tip_advice_vi:
      "Ghi lại tên, ngày, giờ, địa điểm. Trong tình huống nghiêm trọng, xin gọi người tin cậy hoặc lãnh sự quán.",
    tip_advice_en:
      "Write down names, dates, times, and the place. In serious cases, ask to call a trusted person or your consulate.",
  },
  {
    id: "russian_survival_police_victim_witness",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2 Sống còn: nạn nhân và nhân chứng",
    title_en: "A2 Survival: victim and witness",
    intro_vi:
      "Khi bạn là nạn nhân hoặc nhân chứng, hãy nói rõ vai trò, mô tả ngắn điều đã xảy ra, và xin phiên dịch trước khi khai chính thức.",
    intro_en:
      "As a victim or witness, state your role clearly, briefly describe what happened, and ask for an interpreter before any formal statement.",
    sentences: [
      {
        russian: "Я свидетель.",
        romanization: "Ya svidetel.",
        en: "I am a witness.",
        vi: "Tôi là nhân chứng.",
        pronunciation_focus: ["cụm св nói liền", "ь cuối làm л mềm"],
        pronunciation_focus_en: ["say св as one cluster", "final ь softens the л"],
      },
      {
        russian: "Я видел аварию.",
        romanization: "Ya videl avariyu.",
        en: "I saw the accident. (male speaker)",
        vi: "Tôi đã thấy tai nạn. (nam nói)",
        pronunciation_focus: ["nữ nói видела", "авария = tai nạn"],
        pronunciation_focus_en: ["a female speaker says видела", "авария means accident"],
      },
      {
        russian: "Я потерпевший.",
        romanization: "Ya poterpevshiy.",
        en: "I am the victim. (male speaker)",
        vi: "Tôi là nạn nhân. (nam nói)",
        pronunciation_focus: ["nữ nói потерпевшая", "trọng âm -пев-"],
        pronunciation_focus_en: ["a female speaker says потерпевшая", "stress on -пев-"],
      },
      {
        russian: "Меня ударили.",
        romanization: "Menya udarili.",
        en: "I was hit.",
        vi: "Tôi bị đánh.",
        pronunciation_focus: ["ударили = (họ) đã đánh", "trọng âm -да-"],
        pronunciation_focus_en: ["ударили means they hit", "stress on -да-"],
      },
      {
        russian: "Мне угрожали.",
        romanization: "Mne ugrozhali.",
        en: "I was threatened.",
        vi: "Tôi bị đe dọa.",
        pronunciation_focus: ["ж = zh", "trọng âm -жа-"],
        pronunciation_focus_en: ["ж is zh", "stress on -жа-"],
      },
      {
        russian: "Мне нужен адвокат.",
        romanization: "Mne nuzhen advokat.",
        en: "I need a lawyer.",
        vi: "Tôi cần luật sư.",
        pronunciation_focus: ["адвокат = luật sư", "trọng âm cuối -КАТ"],
        pronunciation_focus_en: ["адвокат means lawyer", "final stress -КАТ"],
      },
    ],
    vocabulary: [
      { cell_id: "a54a2353-581a-4f93-adc7-ae8d8f58f0e0", word: "свидетель", romanization: "svidetel", en: "witness", vi: "nhân chứng", pos: "noun", pronunciation_vi: "svi-DYE-tel", pronunciation_en: "svee-DEH-tel" },
      { cell_id: "3c5e8e33-50f3-4f16-9f2f-5cc335af04eb", word: "потерпевший", romanization: "poterpevshiy", en: "victim (male)", vi: "nạn nhân (nam)", pos: "noun", pronunciation_vi: "pa-ter-PYEV-shiy", pronunciation_en: "pa-ter-PEV-shiy" },
      { cell_id: "7dd698bb-854e-43fd-87be-e13523def4b6", word: "авария", romanization: "avariya", en: "accident", vi: "tai nạn", pos: "noun", pronunciation_vi: "a-VA-ri-ya", pronunciation_en: "a-VA-ree-ya" },
      { cell_id: "37c94d31-5912-450a-9202-5e71445a3b4f", word: "адвокат", romanization: "advokat", en: "lawyer", vi: "luật sư", pos: "noun", pronunciation_vi: "ad-va-KAT", pronunciation_en: "ad-va-KAT" },
      { cell_id: "43764eff-e7e6-41f3-9db5-3b95cd2e2975", word: "угрожать", romanization: "ugrozhat", en: "to threaten", vi: "đe dọa", pos: "verb", pronunciation_vi: "u-gra-ZHAT", pronunciation_en: "oo-gra-ZHAT" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối vai trò/việc với câu tiếng Nga.",
        instruction_en: "Match each role or event with its Russian line.",
        items: [
          { prompt: "nhân chứng", answer: "Я свидетель." },
          { prompt: "nạn nhân (nam)", answer: "Я потерпевший." },
          { prompt: "bị đánh", answer: "Меня ударили." },
          { prompt: "cần luật sư", answer: "Мне нужен адвокат." },
        ],
      },
    ],
    cultural_notes_vi:
      "Nếu là nữ, đổi `потерпевший` thành `потерпевшая`, `видел` thành `видела`. Nói chậm và đừng ký khi chưa hiểu.",
    cultural_notes_en:
      "If you are female, change `потерпевший` to `потерпевшая` and `видел` to `видела`. Speak slowly and never sign without understanding.",
    tip_advice_vi:
      "Trong tình huống nghiêm trọng, xin phiên dịch và trợ giúp pháp lý có chuyên môn. Đây là hỗ trợ ngôn ngữ, không phải tư vấn pháp luật.",
    tip_advice_en:
      "In serious situations, request a translator and qualified legal help. This is language support, not legal advice.",
  },
  {
    id: "russian_survival_housing_rent",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2 Sống còn: thuê nhà và tiền cọc",
    title_en: "A2 Survival: renting and deposits",
    intro_vi:
      "Rủi ro lớn nhất khi thuê nhà là đồng ý quá nhanh. Hỏi giá thuê, tiền cọc, và ngày trả bằng văn bản; đừng ký khi chưa hiểu.",
    intro_en:
      "The biggest renting risk is agreeing too fast. Ask rent, deposit, and due dates in writing; do not sign until you understand.",
    sentences: [
      {
        russian: "Сколько стоит аренда?",
        romanization: "Skolko stoit arenda?",
        en: "How much is the rent?",
        vi: "Tiền thuê bao nhiêu?",
        pronunciation_focus: ["аренда = tiền thuê", "trọng âm -РЕН-"],
        pronunciation_focus_en: ["аренда means rent", "stress on -РЕН-"],
      },
      {
        russian: "Сколько депозит?",
        romanization: "Skolko depozit?",
        en: "How much is the deposit?",
        vi: "Tiền cọc bao nhiêu?",
        pronunciation_focus: ["депозит = tiền cọc", "trọng âm -по-"],
        pronunciation_focus_en: ["депозит means deposit", "stress on -по-"],
      },
      {
        russian: "Аренда включает коммунальные услуги?",
        romanization: "Arenda vklyuchayet kommunalnye uslugi?",
        en: "Does the rent include utilities?",
        vi: "Tiền thuê có bao gồm tiện ích không?",
        pronunciation_focus: ["cụm вкл nói liền", "коммунальные услуги = tiện ích"],
        pronunciation_focus_en: ["say вкл as one cluster", "коммунальные услуги means utilities"],
      },
      {
        russian: "Мне нужен договор.",
        romanization: "Mne nuzhen dogovor.",
        en: "I need a contract.",
        vi: "Tôi cần hợp đồng.",
        pronunciation_focus: ["договор = hợp đồng", "trọng âm cuối -ВОР"],
        pronunciation_focus_en: ["договор means contract", "final stress -ВОР"],
      },
      {
        russian: "Я не понимаю договор.",
        romanization: "Ya ne ponimayu dogovor.",
        en: "I do not understand the contract.",
        vi: "Tôi không hiểu hợp đồng.",
        pronunciation_focus: ["dùng trước khi ký", "trọng âm -ма-"],
        pronunciation_focus_en: ["use before signing", "stress on -ма-"],
      },
      {
        russian: "Я не буду подписывать сейчас.",
        romanization: "Ya ne budu podpisyvat seychas.",
        en: "I will not sign now.",
        vi: "Tôi sẽ không ký bây giờ.",
        pronunciation_focus: ["сейчас = bây giờ", "câu giữ an toàn"],
        pronunciation_focus_en: ["сейчас means now", "a safety line"],
      },
    ],
    vocabulary: [
      { cell_id: "9c1f0b14-a22f-4051-a6d8-f34e2cab1645", word: "аренда", romanization: "arenda", en: "rent", vi: "tiền thuê", pos: "noun", pronunciation_vi: "a-RYEN-da", pronunciation_en: "a-REN-da" },
      { cell_id: "03f91064-f1ed-4914-bc7f-471c4c16f313", word: "депозит", romanization: "depozit", en: "deposit", vi: "tiền cọc", pos: "noun", pronunciation_vi: "de-PO-zit", pronunciation_en: "de-PO-zeet" },
      { cell_id: "3383f477-b269-4494-a904-71df7cf845aa", word: "договор", romanization: "dogovor", en: "contract", vi: "hợp đồng", pos: "noun", pronunciation_vi: "da-ga-VOR", pronunciation_en: "da-ga-VOR" },
      { cell_id: "9b87188a-0340-4d52-acb3-0753927a5cd1", word: "коммунальные", romanization: "kommunalnye", en: "utilities (adj.)", vi: "tiện ích", pos: "adjective", pronunciation_vi: "ka-mu-NAL-nye", pronunciation_en: "ka-moo-NAL-nye" },
      { cell_id: "cb2927d2-2e57-4dc6-bec6-32fe1c343ce8", word: "квартира", romanization: "kvartira", en: "apartment", vi: "căn hộ", pos: "noun", pronunciation_vi: "kvar-TI-ra", pronunciation_en: "kvar-TEE-ra" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tiền thuê bao nhiêu?", answer: "Сколько стоит аренда?" },
          { prompt: "Tôi cần hợp đồng.", answer: "Мне нужен договор." },
          { prompt: "Tôi sẽ không ký bây giờ.", answer: "Я не буду подписывать сейчас." },
        ],
      },
    ],
    cultural_notes_vi:
      "Hỏi rõ `Это депозит или аренда?` để không trả nhầm. Xin biên lai cho mọi khoản: `Мне нужен чек за оплату.`",
    cultural_notes_en:
      "Ask `Это депозит или аренда?` so you do not pay the wrong thing. Get a receipt for every payment: `Мне нужен чек за оплату.`",
    tip_advice_vi:
      "Trao đổi quan trọng bằng tin nhắn để có bằng chứng: `Можно всё написать в сообщении?`",
    tip_advice_en:
      "Keep key terms in text messages for proof: `Можно всё написать в сообщении?`",
  },
  {
    id: "russian_survival_housing_repairs",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2 Sống còn: sửa chữa và tiện ích trong nhà",
    title_en: "A2 Survival: repairs and utilities at home",
    intro_vi:
      "Khi có hỏng hóc hoặc mất điện/nước, hãy báo ngắn gọn vấn đề và hỏi khi nào thợ đến. Chụp ảnh sự cố trước khi nhắn.",
    intro_en:
      "When something breaks or power/water is out, report the problem briefly and ask when a repairman will come. Photograph the issue before messaging.",
    sentences: [
      {
        russian: "Горячей воды нет.",
        romanization: "Goryachey vody net.",
        en: "There is no hot water.",
        vi: "Không có nước nóng.",
        pronunciation_focus: ["ч = ch", "нет ở cuối phủ định"],
        pronunciation_focus_en: ["ч is ch", "final нет marks the negative"],
      },
      {
        russian: "Отопление не работает.",
        romanization: "Otopleniye ne rabotayet.",
        en: "The heating does not work.",
        vi: "Hệ thống sưởi không hoạt động.",
        pronunciation_focus: ["mẫu ... не работает", "trọng âm -пле-"],
        pronunciation_focus_en: ["pattern ... не работает", "stress on -пле-"],
      },
      {
        russian: "Это сломано.",
        romanization: "Eto slomano.",
        en: "This is broken.",
        vi: "Cái này bị hỏng.",
        pronunciation_focus: ["cụm сл nói liền", "trọng âm -ло-"],
        pronunciation_focus_en: ["say сл as one cluster", "stress on -ло-"],
      },
      {
        russian: "Когда придёт мастер?",
        romanization: "Kogda pridyot master?",
        en: "When will the repairman come?",
        vi: "Khi nào thợ đến?",
        pronunciation_focus: ["ё luôn mang trọng âm", "мастер = thợ"],
        pronunciation_focus_en: ["ё is always stressed", "мастер means repairman"],
      },
      {
        russian: "Нет электричества.",
        romanization: "Net elektrichestva.",
        en: "There is no electricity.",
        vi: "Không có điện.",
        pronunciation_focus: ["ч = ch", "trọng âm -три-"],
        pronunciation_focus_en: ["ч is ch", "stress on -три-"],
      },
      {
        russian: "Соседи шумят.",
        romanization: "Sosedi shumyat.",
        en: "The neighbors are noisy.",
        vi: "Hàng xóm làm ồn.",
        pronunciation_focus: ["ш cứng", "trọng âm cuối -МЯТ"],
        pronunciation_focus_en: ["hard ш", "final stress -МЯТ"],
      },
    ],
    vocabulary: [
      { cell_id: "bacbcf68-6024-4387-8c87-71d257211ea3", word: "ремонт", romanization: "remont", en: "repair", vi: "sửa chữa", pos: "noun", pronunciation_vi: "re-MONT", pronunciation_en: "re-MONT" },
      { cell_id: "f7ab7712-d03a-49ed-95c6-fe04075cf09b", word: "отопление", romanization: "otopleniye", en: "heating", vi: "hệ thống sưởi", pos: "noun", pronunciation_vi: "a-ta-PLYE-ni-ye", pronunciation_en: "a-ta-PLEH-ni-ye" },
      { cell_id: "063bcc7f-8dde-4900-8d31-06171bc5b3b3", word: "электричество", romanization: "elektrichestvo", en: "electricity", vi: "điện", pos: "noun", pronunciation_vi: "e-lek-TRI-che-stva", pronunciation_en: "e-lek-TREE-che-stva" },
      { cell_id: "1673b3b4-60b2-4c70-8dce-ed019aaa5d59", word: "мастер", romanization: "master", en: "repairman", vi: "thợ", pos: "noun", pronunciation_vi: "MA-ster", pronunciation_en: "MA-ster" },
      { cell_id: "728da22a-2646-4bda-bb50-66b34bdcdabe", word: "сломано", romanization: "slomano", en: "broken", vi: "bị hỏng", pos: "adjective", pronunciation_vi: "SLO-ma-na", pronunciation_en: "SLO-ma-na" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Отопление не ______. (hoạt động)", answer: "работает" },
          { prompt: "Когда придёт ______? (thợ)", answer: "мастер" },
          { prompt: "Нет ______. (điện)", answer: "электричества" },
        ],
      },
    ],
    cultural_notes_vi:
      "Dùng mẫu `... не работает` cho hầu hết sự cố: свет, душ, розетка, интернет. Gửi tin nhắn kèm ảnh để chủ nhà xử lý nhanh.",
    cultural_notes_en:
      "Use `... не работает` for most faults: light, shower, outlet, internet. Send a message with a photo so the landlord acts fast.",
    tip_advice_vi:
      "Mẫu tin nhắn: `Здравствуйте. В квартире проблема: ___. Нужен ремонт. Когда может прийти мастер?`",
    tip_advice_en:
      "Message template: `Здравствуйте. В квартире проблема: ___. Нужен ремонт. Когда может прийти мастер?`",
  },
  {
    id: "russian_survival_work_instructions_safety",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2 Sống còn: tuần đầu đi làm — hướng dẫn và an toàn",
    title_en: "A2 Survival: first work week — instructions and safety",
    intro_vi:
      "Tuần đầu, mục tiêu là hiểu chỉ dẫn và giữ an toàn. Nói ngắn, hỏi từng việc một, và không đoán trong tình huống an toàn.",
    intro_en:
      "In the first week, the goal is to understand instructions and stay safe. Keep it short, ask one thing at a time, and never guess on safety.",
    sentences: [
      {
        russian: "Я новый сотрудник.",
        romanization: "Ya novyy sotrudnik.",
        en: "I am a new employee. (male speaker)",
        vi: "Tôi là nhân viên mới. (nam nói)",
        pronunciation_focus: ["nữ nói новая сотрудница", "trọng âm -руд-"],
        pronunciation_focus_en: ["a female speaker says новая сотрудница", "stress on -руд-"],
      },
      {
        russian: "Покажите, пожалуйста.",
        romanization: "Pokazhite, pozhaluysta.",
        en: "Please show me.",
        vi: "Xin chỉ cho tôi xem.",
        pronunciation_focus: ["ж = zh", "trọng âm -жи-"],
        pronunciation_focus_en: ["ж is zh", "stress on -жи-"],
      },
      {
        russian: "Я не понимаю задачу.",
        romanization: "Ya ne ponimayu zadachu.",
        en: "I do not understand the task.",
        vi: "Tôi không hiểu nhiệm vụ.",
        pronunciation_focus: ["ч = ch", "задача = nhiệm vụ"],
        pronunciation_focus_en: ["ч is ch", "задача means task"],
      },
      {
        russian: "Здесь опасно.",
        romanization: "Zdes opasno.",
        en: "It is dangerous here.",
        vi: "Ở đây nguy hiểm.",
        pronunciation_focus: ["cụm зд nói liền", "trọng âm -ПАС-"],
        pronunciation_focus_en: ["say зд as one cluster", "stress on -ПАС-"],
      },
      {
        russian: "Мне нужны перчатки.",
        romanization: "Mne nuzhny perchatki.",
        en: "I need gloves.",
        vi: "Tôi cần găng tay.",
        pronunciation_focus: ["нужны cho danh từ số nhiều", "ч = ch"],
        pronunciation_focus_en: ["нужны for plural nouns", "ч is ch"],
      },
      {
        russian: "Я не буду это делать без инструкции.",
        romanization: "Ya ne budu eto delat bez instruktsii.",
        en: "I will not do this without instructions.",
        vi: "Tôi sẽ không làm việc này nếu không có hướng dẫn.",
        pronunciation_focus: ["câu giữ an toàn lao động", "ц = ts"],
        pronunciation_focus_en: ["a workplace safety line", "ц is ts"],
      },
    ],
    vocabulary: [
      { cell_id: "cabc982c-288d-47ba-9168-2467afa4d5c6", word: "сотрудник", romanization: "sotrudnik", en: "employee", vi: "nhân viên", pos: "noun", pronunciation_vi: "sa-TRUD-nik", pronunciation_en: "sa-TROOD-nik" },
      { cell_id: "ca0c4542-a2a4-4a57-9215-45177de2959a", word: "задача", romanization: "zadacha", en: "task", vi: "nhiệm vụ", pos: "noun", pronunciation_vi: "za-DA-cha", pronunciation_en: "za-DA-cha" },
      { cell_id: "8954c7bc-8d89-4500-a60b-881a6b50f5a3", word: "опасно", romanization: "opasno", en: "dangerous", vi: "nguy hiểm", pos: "adverb", pronunciation_vi: "a-PAS-na", pronunciation_en: "a-PAS-na" },
      { cell_id: "53dc7c4c-c173-4be1-adab-ad866accbf9c", word: "перчатки", romanization: "perchatki", en: "gloves", vi: "găng tay", pos: "noun", pronunciation_vi: "per-CHAT-ki", pronunciation_en: "per-CHAT-kee" },
      { cell_id: "8fa2ad47-1a0d-47ff-92c8-1430c688d2d7", word: "инструкция", romanization: "instruktsiya", en: "instruction", vi: "hướng dẫn", pos: "noun", pronunciation_vi: "in-STRUK-tsi-ya", pronunciation_en: "in-STROOK-tsi-ya" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối nhu cầu với câu tiếng Nga.",
        instruction_en: "Match each need with its Russian line.",
        items: [
          { prompt: "nhờ chỉ cách làm", answer: "Покажите, пожалуйста." },
          { prompt: "không hiểu việc", answer: "Я не понимаю задачу." },
          { prompt: "cảnh báo nguy hiểm", answer: "Здесь опасно." },
          { prompt: "cần đồ bảo hộ", answer: "Мне нужны перчатки." },
        ],
      },
    ],
    cultural_notes_vi:
      "Trong công việc, dùng `вы` và câu lịch sự. Người Việt hay im lặng vì ngại, nhưng im lặng khi không hiểu có thể gây lỗi hoặc nguy hiểm.",
    cultural_notes_en:
      "At work use `вы` and polite phrasing. Vietnamese learners often stay silent out of shyness, but silence when you do not understand causes errors or danger.",
    tip_advice_vi:
      "Khi không chắc về an toàn, nói `Я не понимаю инструкцию. Покажите, пожалуйста.` Đừng đoán.",
    tip_advice_en:
      "When unsure about safety, say `Я не понимаю инструкцию. Покажите, пожалуйста.` Do not guess.",
  },
  {
    id: "russian_survival_work_schedule_pay",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2 Sống còn: lịch làm, ca và lương",
    title_en: "A2 Survival: schedule, shifts, and pay",
    intro_vi:
      "Hỏi lịch làm, giờ nghỉ, và lương một cách lịch sự. Khi lương có vẻ sai, dùng câu hỏi nhẹ trước, đừng buộc tội.",
    intro_en:
      "Ask about your schedule, breaks, and pay politely. If pay looks wrong, start with a soft question, not an accusation.",
    sentences: [
      {
        russian: "Когда начинается смена?",
        romanization: "Kogda nachinayetsya smena?",
        en: "When does the shift start?",
        vi: "Ca bắt đầu lúc nào?",
        pronunciation_focus: ["смена = ca làm", "trọng âm -на-"],
        pronunciation_focus_en: ["смена means shift", "stress on -на-"],
      },
      {
        russian: "Когда перерыв?",
        romanization: "Kogda pereryv?",
        en: "When is the break?",
        vi: "Khi nào nghỉ giải lao?",
        pronunciation_focus: ["перерыв = giờ nghỉ", "trọng âm cuối -РЫВ"],
        pronunciation_focus_en: ["перерыв means break", "final stress -РЫВ"],
      },
      {
        russian: "Какой у меня график?",
        romanization: "Kakoy u menya grafik?",
        en: "What is my schedule?",
        vi: "Lịch làm của tôi thế nào?",
        pronunciation_focus: ["график = lịch làm", "trọng âm GRA-"],
        pronunciation_focus_en: ["график means schedule", "stress on GRA-"],
      },
      {
        russian: "Когда выплачивают зарплату?",
        romanization: "Kogda vyplachivayut zarplatu?",
        en: "When is the salary paid?",
        vi: "Khi nào trả lương?",
        pronunciation_focus: ["зарплата = lương", "ч = ch"],
        pronunciation_focus_en: ["зарплата means salary", "ч is ch"],
      },
      {
        russian: "У меня вопрос по зарплате.",
        romanization: "U menya vopros po zarplate.",
        en: "I have a question about my pay.",
        vi: "Tôi có câu hỏi về lương.",
        pronunciation_focus: ["mở đầu lịch sự, không buộc tội", "trọng âm -РОС"],
        pronunciation_focus_en: ["a polite, non-accusatory opener", "stress on -РОС"],
      },
      {
        russian: "Извините, я опоздал.",
        romanization: "Izvinite, ya opozdal.",
        en: "Sorry, I am late. (male speaker)",
        vi: "Xin lỗi, tôi đến trễ. (nam nói)",
        pronunciation_focus: ["nữ nói опоздала", "trọng âm -ЗДАЛ"],
        pronunciation_focus_en: ["a female speaker says опоздала", "stress on -ЗДАЛ"],
      },
    ],
    vocabulary: [
      { cell_id: "b5d83e4e-811b-482a-a61b-af51034560ae", word: "смена", romanization: "smena", en: "shift", vi: "ca làm", pos: "noun", pronunciation_vi: "SMYE-na", pronunciation_en: "SMEH-na" },
      { cell_id: "9755ae5e-4192-4bda-85f0-67fd213e1577", word: "график", romanization: "grafik", en: "schedule", vi: "lịch làm", pos: "noun", pronunciation_vi: "GRA-fik", pronunciation_en: "GRA-feek" },
      { cell_id: "fe17047d-6a02-4db4-9e1e-18212212dbbe", word: "перерыв", romanization: "pereryv", en: "break", vi: "giờ nghỉ", pos: "noun", pronunciation_vi: "pe-re-RYV", pronunciation_en: "pe-re-RYV" },
      { cell_id: "92467111-6581-485a-997a-7e52fe3c4b73", word: "зарплата", romanization: "zarplata", en: "salary", vi: "lương", pos: "noun", pronunciation_vi: "zar-PLA-ta", pronunciation_en: "zar-PLA-ta" },
      { cell_id: "9fbe3692-b917-46fc-82b7-2b152fe917b9", word: "опоздать", romanization: "opozdat", en: "to be late", vi: "đến trễ", pos: "verb", pronunciation_vi: "a-paz-DAT", pronunciation_en: "a-paz-DAT" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Ca bắt đầu lúc nào?", answer: "Когда начинается смена?" },
          { prompt: "Khi nào trả lương?", answer: "Когда выплачивают зарплату?" },
          { prompt: "Tôi có câu hỏi về lương.", answer: "У меня вопрос по зарплате." },
        ],
      },
    ],
    cultural_notes_vi:
      "`опоздал` cho nam, `опоздала` cho nữ. Khi lương có vẻ sai, nói `Можно проверить мои часы?` thay vì `Вы ошиблись`.",
    cultural_notes_en:
      "`опоздал` for men, `опоздала` for women. If pay looks wrong, say `Можно проверить мои часы?` instead of `Вы ошиблись`.",
    tip_advice_vi:
      "Dùng mẫu `У меня вопрос по ...` cho mọi thắc mắc: по графику, по зарплате, по задаче. Lịch sự và ít căng thẳng.",
    tip_advice_en:
      "Use `У меня вопрос по ...` for any concern: schedule, pay, task. It is polite and low-tension.",
  },
  {
    id: "russian_survival_immigration_documents",
    level: "A2",
    category: "practical_tasks",
    title_vi: "A2 Sống còn: giấy tờ ở văn phòng nhập cư",
    title_en: "A2 Survival: documents at the immigration office",
    intro_vi:
      "Ở quầy văn phòng, hỏi cần giấy nào, xin bản sao, và đừng ký khi chưa hiểu. Nếu thiếu giấy, hỏi có thể nộp bổ sung sau không.",
    intro_en:
      "At the office counter, ask which documents are needed, request a copy, and do not sign without understanding. If a document is missing, ask if you can submit it later.",
    sentences: [
      {
        russian: "Какие документы нужны?",
        romanization: "Kakiye dokumenty nuzhny?",
        en: "Which documents are needed?",
        vi: "Cần giấy tờ nào?",
        pronunciation_focus: ["нужны cho số nhiều", "trọng âm cuối -НЫ"],
        pronunciation_focus_en: ["нужны for plural", "final stress -НЫ"],
      },
      {
        russian: "Мне нужна копия.",
        romanization: "Mne nuzhna kopiya.",
        en: "I need a copy.",
        vi: "Tôi cần bản sao.",
        pronunciation_focus: ["копия = bản sao", "trọng âm KO-"],
        pronunciation_focus_en: ["копия means copy", "stress on KO-"],
      },
      {
        russian: "Где подписать?",
        romanization: "Gde podpisat?",
        en: "Where do I sign?",
        vi: "Ký ở đâu?",
        pronunciation_focus: ["cụm дп nói liền", "trọng âm cuối -САТ"],
        pronunciation_focus_en: ["say дп as one cluster", "final stress -САТ"],
      },
      {
        russian: "Я не понимаю этот документ.",
        romanization: "Ya ne ponimayu etot dokument.",
        en: "I do not understand this document.",
        vi: "Tôi không hiểu tài liệu này.",
        pronunciation_focus: ["dùng trước khi ký", "trọng âm -МЕНТ"],
        pronunciation_focus_en: ["use before signing", "stress on -МЕНТ"],
      },
      {
        russian: "Можно донести документ позже?",
        romanization: "Mozhno donesti dokument pozzhe?",
        en: "Can I bring the document later?",
        vi: "Tôi nộp giấy tờ bổ sung sau được không?",
        pronunciation_focus: ["позже = muộn hơn/sau", "зж nói gần một âm dài"],
        pronunciation_focus_en: ["позже means later", "зж blends into one long sound"],
      },
      {
        russian: "Когда последний срок?",
        romanization: "Kogda posledniy srok?",
        en: "When is the deadline?",
        vi: "Hạn cuối là khi nào?",
        pronunciation_focus: ["срок = hạn", "cụm ср nói liền"],
        pronunciation_focus_en: ["срок means deadline", "say ср as one cluster"],
      },
    ],
    vocabulary: [
      { cell_id: "20658b02-0220-4038-a031-4ea6e3ab1891", word: "документ", romanization: "dokument", en: "document", vi: "tài liệu/giấy tờ", pos: "noun", pronunciation_vi: "da-ku-MYENT", pronunciation_en: "da-koo-MENT" },
      { cell_id: "e6e7632f-0127-4a24-b304-dd2dd336c0af", word: "копия", romanization: "kopiya", en: "copy", vi: "bản sao", pos: "noun", pronunciation_vi: "KO-pi-ya", pronunciation_en: "KO-pee-ya" },
      { cell_id: "eed08f8a-6874-44da-8f76-bd5bdb44a5ed", word: "подписать", romanization: "podpisat", en: "to sign", vi: "ký", pos: "verb", pronunciation_vi: "pad-pi-SAT", pronunciation_en: "pad-pee-SAT" },
      { cell_id: "7f32e7db-fb3d-43f0-aa86-29b1c4296ce7", word: "срок", romanization: "srok", en: "deadline", vi: "hạn", pos: "noun", pronunciation_vi: "srok", pronunciation_en: "srok" },
      { cell_id: "b6ad1520-27a7-4688-a232-b3a72491724e", word: "справка", romanization: "spravka", en: "certificate", vi: "giấy xác nhận", pos: "noun", pronunciation_vi: "SPRAV-ka", pronunciation_en: "SPRAV-ka" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Cần giấy tờ nào?", answer: "Какие документы нужны?" },
          { prompt: "Tôi cần bản sao.", answer: "Мне нужна копия." },
          { prompt: "Hạn cuối là khi nào?", answer: "Когда последний срок?" },
        ],
      },
    ],
    cultural_notes_vi:
      "Quy định nhập cư khác nhau theo nơi và tình trạng. Tài liệu này là hỗ trợ ngôn ngữ; hãy xác nhận mọi yêu cầu chính thức riêng.",
    cultural_notes_en:
      "Immigration rules vary by place and status. This is language support; confirm every official requirement separately.",
    tip_advice_vi:
      "Câu khai mẫu ở quầy: `Вот мой паспорт. Какие документы нужны? Мне нужна копия. Я не буду подписывать без перевода.`",
    tip_advice_en:
      "A model counter script: `Вот мой паспорт. Какие документы нужны? Мне нужна копия. Я не буду подписывать без перевода.`",
  },
  {
    id: "russian_survival_phone_calls",
    level: "A2",
    category: "daily_survival",
    title_vi: "A2 Sống còn: gọi điện thoại ngắn",
    title_en: "A2 Survival: short phone calls",
    intro_vi:
      "Trên điện thoại bạn không thấy mặt người nói, nên hãy theo trình tự: chào, nói bạn là ai, nói vấn đề, hỏi bước tiếp theo.",
    intro_en:
      "On the phone you cannot read faces, so follow a flow: greet, say who you are, state the problem, ask the next step.",
    sentences: [
      {
        russian: "Здравствуйте, я хочу записаться к врачу.",
        romanization: "Zdravstvuyte, ya khochu zapisatsya k vrachu.",
        en: "Hello, I want to book a doctor appointment.",
        vi: "Xin chào, tôi muốn đặt lịch bác sĩ.",
        pronunciation_focus: ["записаться = đặt lịch", "ться nghe gần -tsa"],
        pronunciation_focus_en: ["записаться means to book", "ться sounds like -tsa"],
      },
      {
        russian: "Мне нужно срочно к врачу.",
        romanization: "Mne nuzhno srochno k vrachu.",
        en: "I need a doctor urgently.",
        vi: "Tôi cần gặp bác sĩ gấp.",
        pronunciation_focus: ["срочно = gấp", "к vrachу = đến bác sĩ"],
        pronunciation_focus_en: ["срочно means urgently", "к врачу means to the doctor"],
      },
      {
        russian: "Можно перенести запись?",
        romanization: "Mozhno perenesti zapis?",
        en: "Can I reschedule the appointment?",
        vi: "Có thể đổi lịch không?",
        pronunciation_focus: ["перенести = dời lịch", "запись = lịch hẹn"],
        pronunciation_focus_en: ["перенести means to reschedule", "запись means appointment"],
      },
      {
        russian: "Скажите адрес, пожалуйста.",
        romanization: "Skazhite adres, pozhaluysta.",
        en: "Please tell me the address.",
        vi: "Xin cho tôi địa chỉ.",
        pronunciation_focus: ["ж = zh", "адрес = địa chỉ"],
        pronunciation_focus_en: ["ж is zh", "адрес means address"],
      },
      {
        russian: "Можно отправить адрес сообщением?",
        romanization: "Mozhno otpravit adres soobshcheniyem?",
        en: "Can you send the address by message?",
        vi: "Có thể gửi địa chỉ bằng tin nhắn không?",
        pronunciation_focus: ["щ mềm và dài trong сообщением", "hữu ích khi nghe không rõ"],
        pronunciation_focus_en: ["soft long щ in сообщением", "useful when you cannot hear well"],
      },
      {
        russian: "Я плохо говорю по-русски.",
        romanization: "Ya plokho govoryu po-russki.",
        en: "I speak Russian poorly.",
        vi: "Tôi nói tiếng Nga kém.",
        pronunciation_focus: ["nói sớm để người ta nói chậm", "х gần kh"],
        pronunciation_focus_en: ["say it early so they slow down", "х is close to kh"],
      },
    ],
    vocabulary: [
      { cell_id: "012fd8d6-82fb-49ef-a4b8-1b172485bb63", word: "записаться", romanization: "zapisatsya", en: "to book / sign up", vi: "đặt lịch", pos: "verb", pronunciation_vi: "za-pi-SA-tsa", pronunciation_en: "za-pee-SA-tsa" },
      { cell_id: "1c17e63f-fc80-4d69-afde-4c3e2b64a8c1", word: "запись", romanization: "zapis", en: "appointment", vi: "lịch hẹn", pos: "noun", pronunciation_vi: "ZA-pis", pronunciation_en: "ZA-pees" },
      { cell_id: "f20532c9-ee22-45f4-9c7e-3786904a9c6b", word: "адрес", romanization: "adres", en: "address", vi: "địa chỉ", pos: "noun", pronunciation_vi: "A-dres", pronunciation_en: "A-dres" },
      { cell_id: "0a42662a-0489-4e76-9bb0-825cfc02c367", word: "сообщение", romanization: "soobshcheniye", en: "message", vi: "tin nhắn", pos: "noun", pronunciation_vi: "sa-ap-SHCHE-ni-ye", pronunciation_en: "sa-ap-SHCHE-ni-ye" },
      { cell_id: "3a6021e1-7957-4472-b288-15b12553bf90", word: "перенести", romanization: "perenesti", en: "to reschedule / move", vi: "dời lịch", pos: "verb", pronunciation_vi: "pe-re-ne-STI", pronunciation_en: "pe-re-ne-STEE" },
    ],
    dialogue: [
      { cell_id: "470036c0-cf2e-4d6f-b5f9-25a1855e0052", speaker: "Bạn", text: "Здравствуйте, я хочу записаться к врачу.", romanization: "Zdravstvuyte, ya khochu zapisatsya k vrachu.", vi: "Xin chào, tôi muốn đặt lịch bác sĩ.", en: "Hello, I want to book a doctor appointment." },
      { cell_id: "692879c6-8dee-479f-9054-a8af58f2a500", speaker: "Tổng đài", text: "Когда вам удобно?", romanization: "Kogda vam udobno?", vi: "Khi nào tiện cho bạn?", en: "When is convenient for you?" },
      { cell_id: "8f05e1c8-f893-479c-9478-78697906861d", speaker: "Bạn", text: "Можно сегодня? Это срочно.", romanization: "Mozhno segodnya? Eto srochno.", vi: "Hôm nay được không? Việc này gấp.", en: "Is today possible? It is urgent." },
      { cell_id: "7cf4627a-828d-4089-8e58-332f8fb1b183", speaker: "Tổng đài", text: "Скажите вашу фамилию.", romanization: "Skazhite vashu familiyu.", vi: "Cho biết họ của bạn.", en: "Tell me your last name." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Я хочу ______ к врачу. (đặt lịch)", answer: "записаться" },
          { prompt: "Можно ______ запись? (dời lịch)", answer: "перенести" },
          { prompt: "Скажите ______, пожалуйста. (địa chỉ)", answer: "адрес" },
        ],
      },
    ],
    cultural_notes_vi:
      "Trình tự gọi: chào lịch sự, nói bạn là ai, nói vấn đề, hỏi bước tiếp theo. Nếu nghe không rõ, xin gửi địa chỉ/thông tin bằng tin nhắn.",
    cultural_notes_en:
      "Call flow: greet politely, say who you are, state the problem, ask the next step. If you cannot hear, ask for the address or details by message.",
    tip_advice_vi:
      "Chuẩn bị sẵn họ tên và một câu vấn đề trước khi gọi. Nói `Я плохо говорю по-русски` ngay đầu cuộc gọi.",
    tip_advice_en:
      "Have your name and a one-line problem ready before calling. Say `Я плохо говорю по-русски` at the very start.",
  },
  {
    id: "russian_survival_core_patterns",
    level: "A1",
    category: "daily_survival",
    title_vi: "A1 Sống còn: mẫu câu lõi để ghép nhanh",
    title_en: "A1 Survival: core patterns to build fast",
    intro_vi:
      "Năm mẫu câu này giải quyết phần lớn nhu cầu hàng ngày. Thay từ trong ngoặc bằng thông tin thật của bạn.",
    intro_en:
      "These five patterns cover most daily needs. Replace the bracketed word with your real information.",
    sentences: [
      {
        russian: "Мне нужно такси.",
        romanization: "Mne nuzhno taksi.",
        en: "I need a taxi. (pattern: Мне нужно + thing)",
        vi: "Tôi cần taxi. (mẫu: Мне нужно + đồ vật)",
        pronunciation_focus: ["dùng dative мне, không phải я", "đổi нужен/нужна/нужно/нужны theo danh từ"],
        pronunciation_focus_en: ["uses dative мне, not я", "switch нужен/нужна/нужно/нужны to match the noun"],
      },
      {
        russian: "Где туалет?",
        romanization: "Gde tualet?",
        en: "Where is the toilet? (pattern: Где + place)",
        vi: "Nhà vệ sinh ở đâu? (mẫu: Где + nơi chốn)",
        pronunciation_focus: ["Где hỏi vị trí", "Куда hỏi hướng đi"],
        pronunciation_focus_en: ["Где asks location", "Куда asks direction"],
      },
      {
        russian: "Сколько стоит билет?",
        romanization: "Skolko stoit bilet?",
        en: "How much is the ticket? (pattern: Сколько стоит + thing)",
        vi: "Vé giá bao nhiêu? (mẫu: Сколько стоит + đồ vật)",
        pronunciation_focus: ["mẫu hỏi giá", "билет = vé"],
        pronunciation_focus_en: ["the price-asking pattern", "билет means ticket"],
      },
      {
        russian: "Можно меню?",
        romanization: "Mozhno menyu?",
        en: "May I have the menu? (pattern: Можно + thing)",
        vi: "Cho tôi thực đơn được không? (mẫu: Можно + đồ vật)",
        pronunciation_focus: ["Можно xin phép rất gọn", "thêm пожалуйста cho lịch sự"],
        pronunciation_focus_en: ["Можно is a compact permission word", "add пожалуйста to be polite"],
      },
      {
        russian: "Я не понимаю вопрос.",
        romanization: "Ya ne ponimayu vopros.",
        en: "I do not understand the question. (pattern: Я не понимаю + thing)",
        vi: "Tôi không hiểu câu hỏi. (mẫu: Я не понимаю + đối tượng)",
        pronunciation_focus: ["ghép với вопрос, документ, форму, цену", "trọng âm -ма-"],
        pronunciation_focus_en: ["combine with question, document, form, price", "stress on -ма-"],
      },
    ],
    vocabulary: [
      { cell_id: "6a18f7c4-02c4-4df6-a7ea-df7b822cc173", word: "нужно", romanization: "nuzhno", en: "need (neuter)", vi: "cần (trung tính)", pos: "predicate", pronunciation_vi: "NUZH-na", pronunciation_en: "NOOZH-na" },
      { cell_id: "af71655a-82b5-49a1-8b87-e4531ac05947", word: "где", romanization: "gde", en: "where", vi: "ở đâu", pos: "adverb", pronunciation_vi: "gdye", pronunciation_en: "gdeh" },
      { cell_id: "406e8f32-3bb2-49ba-94ec-3e5716f9d180", word: "сколько", romanization: "skolko", en: "how much", vi: "bao nhiêu", pos: "adverb", pronunciation_vi: "SKOL-ka", pronunciation_en: "SKOL-ka" },
      { cell_id: "a148d430-fcf1-45df-9533-73c41148cf70", word: "можно", romanization: "mozhno", en: "may / is it allowed", vi: "có được không", pos: "predicate", pronunciation_vi: "MOZH-na", pronunciation_en: "MOZH-na" },
      { cell_id: "66b5016a-25a7-409d-bc6c-b7cf09639e8b", word: "билет", romanization: "bilet", en: "ticket", vi: "vé", pos: "noun", pronunciation_vi: "bi-LYET", pronunciation_en: "bee-LET" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền mẫu câu phù hợp.",
        instruction_en: "Fill in the right pattern word.",
        items: [
          { prompt: "______ туалет? (ở đâu)", answer: "Где" },
          { prompt: "______ стоит билет? (bao nhiêu)", answer: "Сколько" },
          { prompt: "______ меню? (được không)", answer: "Можно" },
        ],
      },
    ],
    cultural_notes_vi:
      "`Мне нужно...` dùng dative `мне`, không dùng `я`. `Мне нужен/нужна/нужно/нужны` đổi theo danh từ đi sau.",
    cultural_notes_en:
      "`Мне нужно...` uses dative `мне`, not `я`. `Мне нужен/нужна/нужно/нужны` changes to match the following noun.",
    tip_advice_vi:
      "Học mẫu, không học từng câu rời. Nắm 5 mẫu này là bạn tự ghép được hàng trăm câu sống còn.",
    tip_advice_en:
      "Learn the patterns, not isolated lines. With these five you can build hundreds of survival sentences yourself.",
  },
  {
    id: "russian_survival_emergency_cards",
    level: "A1",
    category: "practical_tasks",
    title_vi: "A1 Sống còn: thẻ khẩn cấp viết sẵn",
    title_en: "A1 Survival: written emergency cards",
    intro_vi:
      "Hãy viết sẵn vài câu ra giấy hoặc lưu trong điện thoại. Khi không nói được, chỉ vào dòng chữ tiếng Nga cho người ta đọc.",
    intro_en:
      "Write a few lines on paper or save them on your phone. When you cannot speak, point to the Russian line for others to read.",
    sentences: [
      {
        russian: "Я говорю по-вьетнамски.",
        romanization: "Ya govoryu po-vyetnamski.",
        en: "I speak Vietnamese.",
        vi: "Tôi nói tiếng Việt.",
        pronunciation_focus: ["xác định ngôn ngữ của bạn", "trọng âm -РЮ"],
        pronunciation_focus_en: ["identifies your language", "stress on -РЮ"],
      },
      {
        russian: "Я плохо говорю по-русски.",
        romanization: "Ya plokho govoryu po-russki.",
        en: "I speak Russian poorly.",
        vi: "Tôi nói tiếng Nga kém.",
        pronunciation_focus: ["х gần kh", "câu hạ tốc độ hội thoại"],
        pronunciation_focus_en: ["х is close to kh", "this line slows the conversation"],
      },
      {
        russian: "Мне нужна медицинская помощь.",
        romanization: "Mne nuzhna meditsinskaya pomoshch.",
        en: "I need medical help.",
        vi: "Tôi cần hỗ trợ y tế.",
        pronunciation_focus: ["ц = ts", "щ mềm và dài"],
        pronunciation_focus_en: ["ц is ts", "щ is soft and long"],
      },
      {
        russian: "У меня аллергия на:",
        romanization: "U menya allergiya na:",
        en: "I am allergic to:",
        vi: "Tôi dị ứng với:",
        pronunciation_focus: ["để trống điền sau на", "viết rõ tên chất gây dị ứng"],
        pronunciation_focus_en: ["leave a blank after на", "write the allergen clearly"],
      },
      {
        russian: "Позвоните моему другу.",
        romanization: "Pozvonite moyemu drugu.",
        en: "Call my friend.",
        vi: "Hãy gọi cho bạn tôi.",
        pronunciation_focus: ["kèm số điện thoại viết sẵn", "trọng âm -НИ-"],
        pronunciation_focus_en: ["include a written phone number", "stress on -НИ-"],
      },
      {
        russian: "Мне нужна помощь полиции.",
        romanization: "Mne nuzhna pomoshch politsii.",
        en: "I need police help.",
        vi: "Tôi cần cảnh sát giúp.",
        pronunciation_focus: ["ц = ts", "dùng cho thẻ cảnh sát"],
        pronunciation_focus_en: ["ц is ts", "use this on the police card"],
      },
    ],
    vocabulary: [
      { cell_id: "06c93729-93ec-46e2-8f95-a8fb05ca960f", word: "помощь", romanization: "pomoshch", en: "help", vi: "sự giúp đỡ", pos: "noun", pronunciation_vi: "PO-mosh", pronunciation_en: "PO-moshch" },
      { cell_id: "2623a3af-7494-42c6-bcfb-72d331137a48", word: "медицинская", romanization: "meditsinskaya", en: "medical", vi: "(thuộc) y tế", pos: "adjective", pronunciation_vi: "me-di-TSIN-ska-ya", pronunciation_en: "me-dee-TSIN-ska-ya" },
      { cell_id: "0b42eb32-7549-457d-90ea-4f8ec6021517", word: "имя", romanization: "imya", en: "name", vi: "tên", pos: "noun", pronunciation_vi: "I-mya", pronunciation_en: "EE-mya" },
      { cell_id: "bc72ec77-b8f0-4c6d-8269-0d03054a3055", word: "телефон", romanization: "telefon", en: "phone / phone number", vi: "điện thoại / số điện thoại", pos: "noun", pronunciation_vi: "te-le-FON", pronunciation_en: "te-le-FON" },
      { cell_id: "fd5907b2-459f-4d3b-ad01-7708bfa80ed5", word: "друг", romanization: "drug", en: "friend", vi: "bạn", pos: "noun", pronunciation_vi: "druk", pronunciation_en: "drook" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi nói tiếng Việt.", answer: "Я говорю по-вьетнамски." },
          { prompt: "Tôi cần hỗ trợ y tế.", answer: "Мне нужна медицинская помощь." },
          { prompt: "Hãy gọi cho bạn tôi.", answer: "Позвоните моему другу." },
        ],
      },
    ],
    cultural_notes_vi:
      "Mẫu thẻ liên hệ: `Меня зовут: ___. Я говорю по-вьетнамски. Я плохо говорю по-русски. Позвоните, пожалуйста: ___.` Mang theo bên người.",
    cultural_notes_en:
      "Contact card template: `Меня зовут: ___. Я говорю по-вьетнамски. Я плохо говорю по-русски. Позвоните, пожалуйста: ___.` Keep it on you.",
    tip_advice_vi:
      "Thẻ viết sẵn đáng giá nhất khi hoảng loạn. Điền sẵn dị ứng, thuốc đang dùng, và số liên hệ khẩn cấp bằng tiếng Nga.",
    tip_advice_en:
      "Pre-written cards matter most when you panic. Fill in allergies, current medicines, and an emergency number in Russian ahead of time.",
  },
];

export const SURVIVAL_LESSON_COUNT = lessons.length;
