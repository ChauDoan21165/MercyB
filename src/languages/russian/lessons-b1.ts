// src/languages/russian/lessons-b1.ts
//
// Batch 1 B1 lessons converted from:
// course-b1-foundation.md, course-b1-intermediate.md,
// dialogues-beginner-051-100.md, writing-practice-book.md,
// writing-corrections-corpus.md, russian-exam-preparation.md.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_b1_connected_sentence_building",
    level: "B1",
    category: "connected_speech",
    title_vi: "B1: Nối ý bằng что, потому что, поэтому",
    title_en: "B1: Connecting ideas with что, потому что, поэтому",
    intro_vi:
      "B1 không chỉ là câu ngắn. Mục tiêu là nối ý rõ ràng: nói điều mình nghĩ, lý do, kết quả, và điều sẽ làm tiếp.",
    intro_en:
      "B1 is no longer only short sentences. The goal is clear linking: what you think, the reason, the result, and the next action.",
    sentences: [
      {
        russian: "Я думаю, что это важно.",
        romanization: "Ya dumayu, chto eto vazhno.",
        en: "I think this is important.",
        vi: "Tôi nghĩ rằng điều này quan trọng.",
        pronunciation_focus: ["что thường đọc chto/shto", "важно có ж", "думать + что"],
        pronunciation_focus_en: ["что is often pronounced chto/shto", "важно has ж", "думать + что"],
      },
      {
        russian: "Я не уверен, но попробую.",
        romanization: "Ya ne uveren, no poprobuyu.",
        en: "I am not sure, but I will try.",
        vi: "Tôi không chắc, nhưng tôi sẽ thử.",
        pronunciation_focus: ["не уверен là cụm mềm", "но = nhưng", "попробую là tương lai hoàn thành"],
        pronunciation_focus_en: ["не уверен is a useful chunk", "но means but", "попробую is perfective future"],
      },
      {
        russian: "Это трудно, потому что нужно время.",
        romanization: "Eto trudno, potomu chto nuzhno vremya.",
        en: "This is difficult because time is needed.",
        vi: "Việc này khó vì cần thời gian.",
        pronunciation_focus: ["потому что = bởi vì", "нужно + danh từ", "время không đổi ở đây"],
        pronunciation_focus_en: ["потому что means because", "нужно + noun", "время stays nominative here"],
      },
      {
        russian: "Поэтому я хочу подготовиться.",
        romanization: "Poetomu ya khochu podgotovitsya.",
        en: "Therefore I want to prepare.",
        vi: "Vì vậy tôi muốn chuẩn bị.",
        pronunciation_focus: ["поэтому = vì vậy", "хочу + nguyên mẫu", "подготовиться có -ться"],
        pronunciation_focus_en: ["поэтому means therefore", "хочу + infinitive", "подготовиться has -ться"],
      },
    ],
    vocabulary: [
      {
        word: "что",
        romanization: "chto",
        en: "that / what",
        vi: "rằng / cái gì",
        pos: "conjunction/question word",
        pronunciation_vi: "chto",
        pronunciation_en: "shto",
      },
      {
        word: "потому что",
        romanization: "potomu chto",
        en: "because",
        vi: "bởi vì",
        pos: "conjunction",
        pronunciation_vi: "pa-ta-MU shto",
        pronunciation_en: "pa-ta-MOO shto",
      },
      {
        word: "поэтому",
        romanization: "poetomu",
        en: "therefore",
        vi: "vì vậy",
        pos: "connector",
        pronunciation_vi: "pa-E-ta-mu",
        pronunciation_en: "pa-EH-ta-moo",
      },
      {
        word: "подготовиться",
        romanization: "podgotovitsya",
        en: "to prepare",
        vi: "chuẩn bị",
        pos: "verb",
        pronunciation_vi: "pad-ga-TO-vit-sya",
        pronunciation_en: "pad-ga-TO-veet-sya",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi nghĩ rằng điều này khó.", answer: "Я думаю, что это трудно." },
          { prompt: "Việc này quan trọng vì cần thời gian.", answer: "Это важно, потому что нужно время." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Hoàn thành câu nối ý.",
        instruction_en: "Complete the connector sentence.",
        items: [{ prompt: "Я не уверен, но _____.", answer: "попробую" }],
      },
    ],
    cultural_notes_vi:
      "Ở B1, người nghe mong bạn giải thích lý do và kết quả, không chỉ trả lời một câu. Các từ nối giúp câu tiếng Nga nghe trưởng thành hơn.",
    cultural_notes_en:
      "At B1, listeners expect reasons and results, not just one-sentence answers. Connectors make Russian sound more mature.",
    tip_advice_vi:
      "Tập khung 4 câu: ý kiến + sự không chắc + lý do + kế hoạch tiếp theo.",
    tip_advice_en:
      "Practice a four-sentence frame: opinion + uncertainty + reason + next plan.",
  },
  {
    id: "russian_b1_opinions_disagreement",
    level: "B1",
    category: "connected_speech",
    title_vi: "B1: Nói ý kiến và bất đồng lịch sự",
    title_en: "B1: Giving opinions and disagreeing politely",
    intro_vi:
      "B1 cần nói ý kiến mềm hơn: theo tôi, tôi cho rằng, tôi hiểu quan điểm của anh/chị, nhưng tôi có ý khác.",
    intro_en:
      "B1 needs softer opinion language: in my view, I believe, I understand your point, but I have another opinion.",
    sentences: [
      {
        russian: "По-моему, это хорошая идея.",
        romanization: "Po-moyemu, eto khoroshaya ideya.",
        en: "In my opinion, this is a good idea.",
        vi: "Theo tôi, đây là ý tưởng hay.",
        pronunciation_focus: ["по-моему là cụm ý kiến mềm", "хорошая giống cái", "идея giống cái"],
        pronunciation_focus_en: ["по-моему is a soft opinion chunk", "хорошая is feminine", "идея is feminine"],
      },
      {
        russian: "Я считаю, что это полезно.",
        romanization: "Ya schitayu, chto eto polezno.",
        en: "I believe this is useful.",
        vi: "Tôi cho rằng điều này hữu ích.",
        pronunciation_focus: ["считаю có сч", "что nối mệnh đề", "полезно = hữu ích"],
        pronunciation_focus_en: ["считаю has сч", "что links the clause", "полезно means useful"],
      },
      {
        russian: "Я понимаю вашу точку зрения.",
        romanization: "Ya ponimayu vashu tochku zreniya.",
        en: "I understand your point of view.",
        vi: "Tôi hiểu quan điểm của anh/chị.",
        pronunciation_focus: ["вашу là lịch sự", "точку зрения là cụm cố định", "понимаю nhấn -маю"],
        pronunciation_focus_en: ["вашу is polite", "точку зрения is a fixed phrase", "понимаю stresses -маю"],
      },
      {
        russian: "Но у меня другое мнение.",
        romanization: "No u menya drugoye mneniye.",
        en: "But I have a different opinion.",
        vi: "Nhưng tôi có ý kiến khác.",
        pronunciation_focus: ["но = nhưng", "другое мнение = ý kiến khác", "không cần động từ có"],
        pronunciation_focus_en: ["но means but", "другое мнение means another opinion", "no have-verb is needed"],
      },
    ],
    vocabulary: [
      {
        word: "по-моему",
        romanization: "po-moyemu",
        en: "in my opinion",
        vi: "theo tôi",
        pos: "phrase",
        pronunciation_vi: "pa-MO-ye-mu",
        pronunciation_en: "pa-MO-yeh-moo",
      },
      {
        word: "считать",
        romanization: "schitat",
        en: "to consider / believe",
        vi: "cho rằng",
        pos: "verb",
        pronunciation_vi: "shchi-TAT",
        pronunciation_en: "shchee-TAT",
      },
      {
        word: "точка зрения",
        romanization: "tochka zreniya",
        en: "point of view",
        vi: "quan điểm",
        pos: "noun phrase",
        pronunciation_vi: "TOCH-ka ZRYE-ni-ya",
        pronunciation_en: "TOCH-ka ZRYE-nee-ya",
      },
      {
        word: "мнение",
        romanization: "mneniye",
        en: "opinion",
        vi: "ý kiến",
        pos: "noun",
        pronunciation_vi: "MNYE-ni-ye",
        pronunciation_en: "MNYEH-nee-yeh",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Theo tôi, đây là ý tưởng hay.", answer: "По-моему, это хорошая идея." },
          { prompt: "Tôi hiểu quan điểm của anh/chị.", answer: "Я понимаю вашу точку зрения." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn dạng đúng theo người nói.",
        instruction_en: "Choose the correct speaker form.",
        items: [{ prompt: "Female speaker: Я ___. (согласен / согласна)", answer: "согласна" }],
      },
    ],
    cultural_notes_vi:
      "Không đồng ý trực tiếp có thể nghe cứng. Mẫu `Я понимаю вашу точку зрения, но...` giúp giữ lịch sự trước khi nêu ý khác.",
    cultural_notes_en:
      "Direct disagreement can sound abrupt. `Я понимаю вашу точку зрения, но...` keeps the tone polite before giving another view.",
    tip_advice_vi:
      "Luôn có một câu đệm trước khi phản đối: hiểu quan điểm, công nhận một phần, rồi nói ý của mình.",
    tip_advice_en:
      "Use a buffer before disagreeing: understand the point, acknowledge part of it, then give your view.",
  },
  {
    id: "russian_b1_workplace_tasks",
    level: "B1",
    category: "practical_tasks",
    title_vi: "B1: Giải thích nhiệm vụ và vấn đề ở nơi làm việc",
    title_en: "B1: Explaining workplace tasks and problems",
    intro_vi:
      "B1 công việc cần nói rõ trách nhiệm, việc đã làm, vấn đề đang có, và điều cần hỗ trợ.",
    intro_en:
      "B1 workplace Russian needs clear responsibility, completed actions, current problems, and needed support.",
    sentences: [
      {
        russian: "Я отвечаю за этот проект.",
        romanization: "Ya otvechayu za etot proyekt.",
        en: "I am responsible for this project.",
        vi: "Tôi phụ trách dự án này.",
        pronunciation_focus: ["отвечаю за = phụ trách", "этот giống đực", "проект có cụm pr"],
        pronunciation_focus_en: ["отвечаю за means responsible for", "этот is masculine", "проект has pr cluster"],
      },
      {
        russian: "У нас есть проблема с документами.",
        romanization: "U nas yest problema s dokumentami.",
        en: "We have a problem with the documents.",
        vi: "Chúng tôi có vấn đề với tài liệu.",
        pronunciation_focus: ["у нас есть = chúng tôi có", "с + công cụ cách", "документами kết thúc -ами"],
        pronunciation_focus_en: ["у нас есть means we have", "с takes instrumental", "документами ends in -ами"],
      },
      {
        russian: "Мне нужно уточнить задачу.",
        romanization: "Mne nuzhno utochnit zadachu.",
        en: "I need to clarify the task.",
        vi: "Tôi cần làm rõ nhiệm vụ.",
        pronunciation_focus: ["мне нужно + nguyên mẫu", "уточнить = làm rõ", "задачу là đối cách"],
        pronunciation_focus_en: ["мне нужно + infinitive", "уточнить means clarify", "задачу is accusative"],
      },
      {
        russian: "Я сообщу, когда всё будет готово.",
        romanization: "Ya soobshchu, kogda vsyo budet gotovo.",
        en: "I will report when everything is ready.",
        vi: "Tôi sẽ báo khi mọi thứ sẵn sàng.",
        pronunciation_focus: ["сообщу là tương lai", "когда nối mệnh đề", "всё будет готово là mẫu hữu ích"],
        pronunciation_focus_en: ["сообщу is future", "когда links a clause", "всё будет готово is a useful frame"],
      },
    ],
    vocabulary: [
      {
        word: "отвечать за",
        romanization: "otvechat za",
        en: "to be responsible for",
        vi: "phụ trách",
        pos: "verb phrase",
        pronunciation_vi: "at-ve-CHAT za",
        pronunciation_en: "at-vyeh-CHAT za",
      },
      {
        word: "уточнить",
        romanization: "utochnit",
        en: "to clarify",
        vi: "làm rõ",
        pos: "verb",
        pronunciation_vi: "u-toch-NIT",
        pronunciation_en: "oo-toch-NEET",
      },
      {
        word: "задача",
        romanization: "zadacha",
        en: "task",
        vi: "nhiệm vụ",
        pos: "noun",
        pronunciation_vi: "za-DA-cha",
        pronunciation_en: "za-DA-cha",
      },
      {
        word: "готово",
        romanization: "gotovo",
        en: "ready",
        vi: "sẵn sàng / xong",
        pos: "adjective/adverb",
        pronunciation_vi: "ga-TO-va",
        pronunciation_en: "ga-TO-va",
      },
    ],
    dialogue: [
      {
        speaker: "Менеджер",
        text: "Вы отвечаете за этот проект?",
        romanization: "Vy otvechayete za etot proyekt?",
        vi: "Bạn phụ trách dự án này à?",
        en: "Are you responsible for this project?",
      },
      {
        speaker: "Нам",
        text: "Да, но мне нужно уточнить задачу.",
        romanization: "Da, no mne nuzhno utochnit zadachu.",
        vi: "Vâng, nhưng tôi cần làm rõ nhiệm vụ.",
        en: "Yes, but I need to clarify the task.",
      },
      {
        speaker: "Менеджер",
        text: "Хорошо. Сообщите, когда всё будет готово.",
        romanization: "Khorosho. Soobshchite, kogda vsyo budet gotovo.",
        vi: "Được. Hãy báo khi mọi thứ xong.",
        en: "Good. Report when everything is ready.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi cần làm rõ nhiệm vụ.", answer: "Мне нужно уточнить задачу." },
          { prompt: "Chúng tôi có vấn đề với tài liệu.", answer: "У нас есть проблема с документами." },
        ],
      },
    ],
    cultural_notes_vi:
      "Trong môi trường công việc, nói `мне нужно уточнить` thường an toàn hơn im lặng hoặc đoán. Nó thể hiện trách nhiệm và tránh hiểu sai.",
    cultural_notes_en:
      "At work, `мне нужно уточнить` is safer than staying silent or guessing. It shows responsibility and prevents misunderstanding.",
    tip_advice_vi:
      "Khi bí, dùng mẫu: vấn đề là gì + cần gì + khi nào sẽ báo lại.",
    tip_advice_en:
      "When stuck, use this frame: what the problem is + what you need + when you will report back.",
  },
  {
    id: "russian_b1_exam_writing_summary",
    level: "B1",
    category: "practical_tasks",
    title_vi: "B1: Tóm tắt ngắn và viết có lý do",
    title_en: "B1: Short summaries and reasoned writing",
    intro_vi:
      "B1 thi và viết cần đoạn ngắn có cấu trúc: tình huống, ý chính, lý do, đề xuất hoặc kế hoạch.",
    intro_en:
      "B1 exam and writing tasks need a short structured paragraph: situation, main point, reason, suggestion or plan.",
    sentences: [
      {
        russian: "В тексте говорится о работе и учёбе.",
        romanization: "V tekste govoritsya o rabote i uchyobe.",
        en: "The text talks about work and study.",
        vi: "Bài đọc nói về công việc và học tập.",
        pronunciation_focus: ["говорится о + giới cách", "работе và учёбе là giới cách", "ё trong учёбе nhấn"],
        pronunciation_focus_en: ["говорится о + prepositional", "работе and учёбе are prepositional", "ё in учёбе is stressed"],
      },
      {
        russian: "Главная проблема в том, что не хватает времени.",
        romanization: "Glavnaya problema v tom, chto ne khvatayet vremeni.",
        en: "The main problem is that there is not enough time.",
        vi: "Vấn đề chính là không đủ thời gian.",
        pronunciation_focus: ["главная проблема = vấn đề chính", "не хватает + sinh cách", "времени là sinh cách"],
        pronunciation_focus_en: ["главная проблема means main problem", "не хватает + genitive", "времени is genitive"],
      },
      {
        russian: "Я бы посоветовал готовиться заранее.",
        romanization: "Ya by posovetoval gotovitsya zaranee.",
        en: "I would advise preparing in advance. (male speaker)",
        vi: "Tôi khuyên nên chuẩn bị trước. (người nói nam)",
        pronunciation_focus: ["я бы làm lời khuyên mềm", "посоветовал dạng nam", "заранее = trước"],
        pronunciation_focus_en: ["я бы softens advice", "посоветовал is masculine", "заранее means in advance"],
      },
      {
        russian: "После этого можно проверить ошибки.",
        romanization: "Posle etogo mozhno proverit oshibki.",
        en: "After that, you can check mistakes.",
        vi: "Sau đó có thể kiểm tra lỗi.",
        pronunciation_focus: ["после этого = sau đó", "можно + nguyên mẫu", "ошибки là số nhiều"],
        pronunciation_focus_en: ["после этого means after that", "можно + infinitive", "ошибки is plural"],
      },
    ],
    vocabulary: [
      {
        word: "в тексте говорится",
        romanization: "v tekste govoritsya",
        en: "the text says / talks about",
        vi: "bài đọc nói rằng / nói về",
        pos: "phrase",
        pronunciation_vi: "f TEK-ste ga-va-RIT-sya",
        pronunciation_en: "f TEK-stye ga-va-REET-sya",
      },
      {
        word: "главная проблема",
        romanization: "glavnaya problema",
        en: "main problem",
        vi: "vấn đề chính",
        pos: "noun phrase",
        pronunciation_vi: "GLAV-na-ya pra-BLYE-ma",
        pronunciation_en: "GLAHV-na-ya pra-BLYEH-ma",
      },
      {
        word: "советовать",
        romanization: "sovetovat",
        en: "to advise",
        vi: "khuyên",
        pos: "verb",
        pronunciation_vi: "sa-VYE-ta-vat",
        pronunciation_en: "sa-VYE-ta-vat",
      },
      {
        word: "ошибка",
        romanization: "oshibka",
        en: "mistake",
        vi: "lỗi",
        pos: "noun",
        pronunciation_vi: "a-SHIB-ka",
        pronunciation_en: "a-SHIB-ka",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Vấn đề chính là không đủ thời gian.", answer: "Главная проблема в том, что не хватает времени." },
          { prompt: "Sau đó có thể kiểm tra lỗi.", answer: "После этого можно проверить ошибки." },
        ],
      },
    ],
    cultural_notes_vi:
      "B1 không yêu cầu văn phong học thuật. Một đoạn rõ với từ nối đúng thường tốt hơn câu dài nhưng sai cách và thể.",
    cultural_notes_en:
      "B1 does not require academic style. A clear paragraph with correct connectors is usually better than long sentences with case and aspect errors.",
    tip_advice_vi:
      "Khung viết B1: `В тексте говорится...` + `Главная проблема...` + `Я бы посоветовал...` + bước kiểm tra lỗi.",
    tip_advice_en:
      "B1 writing frame: `В тексте говорится...` + `Главная проблема...` + `Я бы посоветовал...` + an error-checking step.",
  },
];

export default lessons;
