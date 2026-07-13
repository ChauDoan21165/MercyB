// src/languages/russian/lessons-c2-discourse.ts
//
// Batch R7 — C2 discourse lessons converted from the local Vietnamese-Russian archive:
//   c2-academic-discourse.md, c2-advanced-discourse-frames.md, c2-argumentation-academy.md,
//   c2-native-discourse-corpus.md, c2-nuance-corpus.md, c2-pragmatics-masterbook.md,
//   c2-register-style-masterbook.md, c2-writing-mastery.md, c2-speaking-mastery.md.
//
// Focus: nuance, argumentation, register, pragmatics, and native-like discourse.
// Compact and app-ready — not a corpus dump. Native review is deferred (study support only).
//
// NOTE: these lessons are standalone and are NOT wired into the level loader in lessons.ts;
// the foundation loader still reports C2 as unconverted. Kept separate so the loader stays
// unchanged while this discourse batch ships independently.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_c2_discourse_explaining",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Khung giải thích ý khó mà không đơn giản hóa",
    title_en: "C2: Explaining a hard idea without oversimplifying",
    intro_vi:
      "Ở C2, giải thích không phải là dịch nghĩa từ điển. Bạn dựng khung: nêu vấn đề, định nghĩa, tách khái niệm, ví dụ, rồi kết luận.",
    intro_en:
      "At C2, explaining is not dictionary translation. You build a frame: introduce, define, separate concepts, give an example, then conclude.",
    sentences: [
      {
        russian: "Прежде всего, важно понять, что мотивация и дисциплина не совпадают.",
        romanization: "Prezhde vsego, vazhno ponyat, chto motivatsiya i distsiplina ne sovpadayut.",
        en: "First of all, it is important to understand that motivation and discipline are not the same.",
        vi: "Trước hết, điều quan trọng là hiểu rằng động lực và kỷ luật không trùng nhau.",
        pronunciation_focus: ["прежде всего mở khung", "что nối mệnh đề", "не совпадают = không trùng nhau"],
        pronunciation_focus_en: ["прежде всего opens the frame", "что links the clause", "не совпадают = do not coincide"],
      },
      {
        russian: "Под дисциплиной я понимаю способность продолжать действие даже без желания.",
        romanization: "Pod distsiplinoy ya ponimayu sposobnost prodolzhat deystviye dazhe bez zhelaniya.",
        en: "By discipline I mean the ability to keep acting even without the desire.",
        vi: "Tôi hiểu kỷ luật là khả năng tiếp tục hành động ngay cả khi không còn muốn.",
        pronunciation_focus: ["под … я понимаю = tôi hiểu … là", "способность + nguyên mẫu", "без желания là sinh cách"],
        pronunciation_focus_en: ["под … я понимаю = by … I mean", "способность + infinitive", "без желания is genitive"],
      },
      {
        russian: "Иными словами, мотивация помогает начать, а дисциплина — довести дело до конца.",
        romanization: "Inymi slovami, motivatsiya pomogayet nachat, a distsiplina — dovesti delo do kontsa.",
        en: "In other words, motivation helps you start, while discipline helps you finish.",
        vi: "Nói cách khác, động lực giúp bắt đầu, còn kỷ luật giúp hoàn thành việc.",
        pronunciation_focus: ["иными словами = nói cách khác", "а tạo tương phản nhẹ", "довести до конца là cụm cố định"],
        pronunciation_focus_en: ["иными словами = in other words", "а marks a soft contrast", "довести до конца is a fixed phrase"],
      },
      {
        russian: "Поэтому можно сказать, что результат держится на привычке, а не на настроении.",
        romanization: "Poetomu mozhno skazat, chto rezultat derzhitsya na privychke, a ne na nastroyenii.",
        en: "Therefore one can say that the result rests on habit, not on mood.",
        vi: "Vì vậy có thể nói rằng kết quả dựa vào thói quen, không phải tâm trạng.",
        pronunciation_focus: ["поэтому можно сказать đóng khung", "держится на + giới cách", "а не на … nhấn tương phản"],
        pronunciation_focus_en: ["поэтому можно сказать closes the frame", "держится на + prepositional", "а не на … sharpens the contrast"],
      },
    ],
    vocabulary: [
      { cell_id: "90d4eead-c5ca-4aa4-b260-488badd1c5f0", word: "прежде всего", romanization: "prezhde vsego", en: "first of all", vi: "trước hết", pos: "phrase", pronunciation_vi: "PRYEZH-de vsye-VO", pronunciation_en: "PRYEZH-dye vsye-VO" },
      { cell_id: "603f02c7-4edf-4319-92e1-3aa279f4f02d", word: "под … понимать", romanization: "pod … ponimat", en: "to mean by …", vi: "hiểu … là", pos: "verb phrase", pronunciation_vi: "pad … pa-ni-MAT", pronunciation_en: "pod … pa-nee-MAT" },
      { cell_id: "9fa1deb8-9df0-461b-b811-bd1cb9c80a43", word: "иными словами", romanization: "inymi slovami", en: "in other words", vi: "nói cách khác", pos: "phrase", pronunciation_vi: "I-ny-mi sla-VA-mi", pronunciation_en: "EE-ny-mee sla-VA-mee" },
      { cell_id: "e71eb68f-aa3a-45c3-a264-4ff999d3f450", word: "довести до конца", romanization: "dovesti do kontsa", en: "to see through / finish", vi: "hoàn thành đến cùng", pos: "verb phrase", pronunciation_vi: "da-ve-STI da kan-TSA", pronunciation_en: "da-vye-STEE da kon-TSA" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga, giữ đúng khung giải thích.",
        instruction_en: "Translate into Russian, keeping the explaining frame.",
        items: [
          { prompt: "Nói cách khác, vấn đề không nằm ở ý tưởng mà ở cách thực hiện.", answer: "Иными словами, проблема не в идее, а в исполнении." },
          { prompt: "Trước hết, điều quan trọng là hiểu rằng đây là hai khái niệm khác nhau.", answer: "Прежде всего, важно понять, что это два разных понятия." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm mở khung định nghĩa.",
        instruction_en: "Insert the defining frame.",
        items: [{ prompt: "_____ дисциплиной я понимаю способность продолжать.", answer: "Под" }],
      },
    ],
    cultural_notes_vi:
      "Người nghe có học mong bạn tách khái niệm trước khi tranh luận. Một định nghĩa rõ ở đầu thường mạnh hơn nhiều ví dụ rời rạc.",
    cultural_notes_en:
      "Educated listeners expect you to separate concepts before arguing. One clear definition up front usually beats many scattered examples.",
    tip_advice_vi:
      "Khung 4 bước: `Прежде всего…` (nêu) → `Под … я понимаю…` (định nghĩa) → `Иными словами…` (làm rõ) → `Поэтому…` (kết).",
    tip_advice_en:
      "Four-step frame: `Прежде всего…` (introduce) → `Под … я понимаю…` (define) → `Иными словами…` (clarify) → `Поэтому…` (conclude).",
  },
  {
    id: "russian_c2_discourse_analyzing",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Phân tích vấn đề theo tầng và quan hệ",
    title_en: "C2: Analyzing a problem by layers and relationships",
    intro_vi:
      "Phân tích C2 là tách vấn đề thành các tầng, chỉ ra nguyên nhân và quan hệ, rồi rút ra hệ quả — không gộp tất cả vào một câu.",
    intro_en:
      "C2 analysis breaks a problem into layers, names causes and relationships, then draws an inference — instead of collapsing it into one sentence.",
    sentences: [
      {
        russian: "Если рассматривать вопрос в целом, можно выделить три уровня.",
        romanization: "Yesli rassmatrivat vopros v tselom, mozhno vydelit tri urovnya.",
        en: "If we look at the question as a whole, we can single out three levels.",
        vi: "Nếu nhìn toàn bộ vấn đề, có thể phân ra ba tầng.",
        pronunciation_focus: ["если рассматривать … в целом mở khung", "выделить = tách ra", "три уровня = ba tầng"],
        pronunciation_focus_en: ["если рассматривать … в целом opens the frame", "выделить = single out", "три уровня = three levels"],
      },
      {
        russian: "Одна из причин конфликта заключается в том, что правило существует только на бумаге.",
        romanization: "Odna iz prichin konflikta zaklyuchayetsya v tom, chto pravilo sushchestvuyet tolko na bumage.",
        en: "One of the causes of the conflict is that the rule exists only on paper.",
        vi: "Một trong các nguyên nhân của xung đột là quy tắc chỉ tồn tại trên giấy.",
        pronunciation_focus: ["причина заключается в том, что = nguyên nhân là", "только на бумаге là cụm hay gặp", "конфликта là sinh cách"],
        pronunciation_focus_en: ["причина заключается в том, что = the cause is that", "только на бумаге is a common chunk", "конфликта is genitive"],
      },
      {
        russian: "Это напрямую связано с тем, как решение внедряется на практике.",
        romanization: "Eto napryamuyu svyazano s tem, kak resheniye vnedryayetsya na praktike.",
        en: "This is directly connected to how the decision is implemented in practice.",
        vi: "Điều này liên quan trực tiếp đến cách quyết định được triển khai trên thực tế.",
        pronunciation_focus: ["напрямую связано с = liên quan trực tiếp đến", "с тем, как nối mệnh đề", "на практике = trên thực tế"],
        pronunciation_focus_en: ["напрямую связано с = directly connected to", "с тем, как links a clause", "на практике = in practice"],
      },
      {
        russian: "Из этого следует, что проблема не в самом решении, а в способе его реализации.",
        romanization: "Iz etogo sleduyet, chto problema ne v samom reshenii, a v sposobe yego realizatsii.",
        en: "It follows that the problem is not in the decision itself, but in the way it is carried out.",
        vi: "Từ đó suy ra rằng vấn đề không nằm ở quyết định mà ở cách triển khai nó.",
        pronunciation_focus: ["из этого следует = từ đó suy ra", "не в …, а в … nhấn tương phản", "реализации là sinh cách"],
        pronunciation_focus_en: ["из этого следует = it follows that", "не в …, а в … sharpens contrast", "реализации is genitive"],
      },
    ],
    vocabulary: [
      { cell_id: "167b83a0-4773-4c55-80ba-36504daac676", word: "рассматривать в целом", romanization: "rassmatrivat v tselom", en: "to consider as a whole", vi: "xem xét toàn bộ", pos: "verb phrase", pronunciation_vi: "ras-MA-tri-vat f TSE-lam", pronunciation_en: "ras-MA-tree-vat f TSE-lom" },
      { cell_id: "132ce351-fd6e-4330-95c8-b8cf80dfe0ca", word: "заключаться в том, что", romanization: "zaklyuchatsya v tom, chto", en: "to consist in the fact that", vi: "nằm ở chỗ là", pos: "verb phrase", pronunciation_vi: "za-klyu-CHAT-sya f tom shto", pronunciation_en: "za-klyoo-CHAT-sya f tom shto" },
      { cell_id: "39c0c9e6-6043-4d0b-8d7c-2d82f0e8709e", word: "напрямую связано с", romanization: "napryamuyu svyazano s", en: "directly connected to", vi: "liên quan trực tiếp đến", pos: "phrase", pronunciation_vi: "na-prya-MU-yu SVYA-za-na s", pronunciation_en: "na-prya-MOO-yu SVYA-za-no s" },
      { cell_id: "e52ef231-e024-4641-8d63-1c528d610ada", word: "из этого следует", romanization: "iz etogo sleduyet", en: "it follows from this", vi: "từ đó suy ra", pos: "phrase", pronunciation_vi: "iz E-ta-va SLYE-du-yet", pronunciation_en: "eez EH-ta-va SLYE-doo-yet" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Một trong các nguyên nhân là thiếu kiểm soát chất lượng.", answer: "Одна из причин заключается в том, что не хватает контроля качества." },
          { prompt: "Từ đó suy ra rằng vấn đề không chỉ ở dữ liệu.", answer: "Из этого следует, что проблема не только в данных." },
        ],
      },
    ],
    cultural_notes_vi:
      "Tách `что đúng trên giấy` khỏi `что xảy ra thực tế` là một động tác phân tích rất Nga. Nó cho thấy bạn nhìn hệ thống, không chỉ một sự việc.",
    cultural_notes_en:
      "Separating `what is true on paper` from `what happens in practice` is a very Russian analytic move. It shows you see the system, not just one event.",
    tip_advice_vi:
      "Khung phân tích: nêu các tầng → một nguyên nhân → quan hệ → hệ quả (`из этого следует`).",
    tip_advice_en:
      "Analysis frame: name the layers → one cause → the relationship → the inference (`из этого следует`).",
  },
  {
    id: "russian_c2_discourse_criticizing",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Phê bình điểm yếu mà không nghe thù địch",
    title_en: "C2: Criticizing a weakness without sounding hostile",
    intro_vi:
      "Phê bình C2 là chỉ ra điểm yếu một cách chính xác và lịch sự: làm mềm, nêu vấn đề cụ thể, giới hạn, rồi đề xuất phương án mạnh hơn.",
    intro_en:
      "C2 criticism points out a weakness precisely and politely: soften, name the specific problem, set a limit, then offer a stronger option.",
    sentences: [
      {
        russian: "Я бы не сказал, что это решение полностью удачное.",
        romanization: "Ya by ne skazal, chto eto resheniye polnostyu udachnoye.",
        en: "I wouldn't say this decision is entirely successful.",
        vi: "Tôi sẽ không nói rằng quyết định này hoàn toàn tốt.",
        pronunciation_focus: ["я бы не сказал làm mềm phê bình", "полностью = hoàn toàn", "удачное = thành công"],
        pronunciation_focus_en: ["я бы не сказал softens the criticism", "полностью = entirely", "удачное = successful"],
      },
      {
        russian: "Проблема здесь в том, что оно не учитывает реальных условий исполнения.",
        romanization: "Problema zdes v tom, chto ono ne uchityvayet realnykh usloviy ispolneniya.",
        en: "The problem here is that it does not take into account the real conditions of execution.",
        vi: "Vấn đề ở đây là nó không tính đến điều kiện thực thi thực tế.",
        pronunciation_focus: ["проблема … в том, что nêu vấn đề cụ thể", "не учитывает = không tính đến", "условий là sinh cách số nhiều"],
        pronunciation_focus_en: ["проблема … в том, что names the specific issue", "не учитывает = does not account for", "условий is genitive plural"],
      },
      {
        russian: "Это работает только в том случае, если ресурсы выделены заранее.",
        romanization: "Eto rabotayet tolko v tom sluchaye, yesli resursy vydeleny zaranee.",
        en: "This works only in the case where resources are allocated in advance.",
        vi: "Điều này chỉ hiệu quả khi nguồn lực được phân bổ từ trước.",
        pronunciation_focus: ["только в том случае, если = chỉ khi", "выделены là phân từ bị động", "заранее = từ trước"],
        pronunciation_focus_en: ["только в том случае, если = only in the case that", "выделены is a passive participle", "заранее = in advance"],
      },
      {
        russian: "Более убедительным было бы сначала определить критерии успеха.",
        romanization: "Boleye ubeditelnym bylo by snachala opredelit kriterii uspekha.",
        en: "It would be more convincing to first define the criteria for success.",
        vi: "Thuyết phục hơn sẽ là xác định tiêu chí thành công trước.",
        pronunciation_focus: ["более убедительным было бы đề xuất mềm", "сначала = trước tiên", "критерии успеха = tiêu chí thành công"],
        pronunciation_focus_en: ["более убедительным было бы offers a soft alternative", "сначала = first", "критерии успеха = success criteria"],
      },
    ],
    vocabulary: [
      { cell_id: "544aebff-eaea-4f7d-8ee9-a3b4d4188711", word: "я бы не сказал, что", romanization: "ya by ne skazal, chto", en: "I wouldn't say that", vi: "tôi sẽ không nói rằng", pos: "phrase", pronunciation_vi: "ya by ne ska-ZAL shto", pronunciation_en: "ya by nye ska-ZAL shto" },
      { cell_id: "82d8f3cb-f10b-4560-84e8-ac3ba4f210ff", word: "не учитывать", romanization: "ne uchityvat", en: "to not take into account", vi: "không tính đến", pos: "verb", pronunciation_vi: "ne u-CHI-ty-vat", pronunciation_en: "nye oo-CHEE-ty-vat" },
      { cell_id: "e892d706-7daf-4044-818f-8ced1c2ff619", word: "в том случае, если", romanization: "v tom sluchaye, yesli", en: "in the case that / only if", vi: "trong trường hợp / chỉ khi", pos: "phrase", pronunciation_vi: "f tom SLU-cha-ye YES-li", pronunciation_en: "f tom SLOO-cha-ye YES-lee" },
      { cell_id: "806b675f-3f0a-4f61-a4e1-864c52a63dd1", word: "более убедительным было бы", romanization: "boleye ubeditelnym bylo by", en: "it would be more convincing", vi: "thuyết phục hơn sẽ là", pos: "phrase", pronunciation_vi: "BO-le-ye u-be-DI-tel-nym BY-la by", pronunciation_en: "BO-lye-ye oo-bye-DEE-tyel-nym BY-lo by" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga, giữ giọng phê bình lịch sự.",
        instruction_en: "Translate into Russian, keeping a polite critical tone.",
        items: [
          { prompt: "Vấn đề ở đây là kế hoạch không tính đến rủi ro.", answer: "Проблема здесь в том, что план не учитывает риски." },
          { prompt: "Thuyết phục hơn sẽ là kiểm tra dữ liệu trước.", answer: "Более убедительным было бы сначала проверить данные." },
        ],
      },
    ],
    cultural_notes_vi:
      "Phê bình thẳng `это плохо` nghe trẻ con và thù địch. Mẫu `я бы не сказал, что…` + `проблема в том, что…` cho thấy bạn đánh giá lập luận, không tấn công người.",
    cultural_notes_en:
      "Blunt `это плохо` sounds childish and hostile. `я бы не сказал, что…` + `проблема в том, что…` shows you are judging the argument, not attacking the person.",
    tip_advice_vi:
      "Luôn kết phê bình bằng một đề xuất: `более убедительным было бы…`. Phê bình có lối ra dễ được chấp nhận hơn.",
    tip_advice_en:
      "Always end criticism with a proposal: `более убедительным было бы…`. Criticism with an exit is easier to accept.",
  },
  {
    id: "russian_c2_discourse_persuading",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Thuyết phục mà không gây áp lực",
    title_en: "C2: Persuading without pressure",
    intro_vi:
      "Thuyết phục C2 là dẫn người nghe đến kết luận, không ép: công nhận quan điểm họ, nêu lợi ích, thừa nhận đánh đổi, rồi đề xuất.",
    intro_en:
      "C2 persuasion leads the listener to a conclusion without forcing: acknowledge their view, state the benefit, admit the trade-off, then recommend.",
    sentences: [
      {
        russian: "Я понимаю вашу точку зрения, и в ней есть смысл.",
        romanization: "Ya ponimayu vashu tochku zreniya, i v ney yest smysl.",
        en: "I understand your point of view, and there is sense in it.",
        vi: "Tôi hiểu quan điểm của anh/chị, và nó có lý.",
        pronunciation_focus: ["я понимаю вашу точку зрения mở bằng đồng cảm", "в ней есть смысл = nó có lý", "вашу là lịch sự"],
        pronunciation_focus_en: ["я понимаю вашу точку зрения opens with empathy", "в ней есть смысл = there is sense in it", "вашу is polite"],
      },
      {
        russian: "При этом важно учитывать, что краткосрочная экономия ведёт к большим издержкам позже.",
        romanization: "Pri etom vazhno uchityvat, chto kratkosrochnaya ekonomiya vedyot k bolshim izderzhkam pozzhe.",
        en: "At the same time, it is important to consider that short-term saving leads to bigger costs later.",
        vi: "Đồng thời, cần tính đến rằng tiết kiệm ngắn hạn dẫn đến chi phí lớn hơn về sau.",
        pronunciation_focus: ["при этом важно учитывать nối phản đề mềm", "ведёт к + tặng cách", "издержкам = chi phí (số nhiều)"],
        pronunciation_focus_en: ["при этом важно учитывать adds a soft counterpoint", "ведёт к + dative", "издержкам = costs (plural)"],
      },
      {
        russian: "Да, это потребует ресурсов на первом этапе, но избавит от повторной переделки.",
        romanization: "Da, eto potrebuyet resursov na pervom etape, no izbavit ot povtornoy peredelki.",
        en: "Yes, it will require resources at the first stage, but it will save us from redoing the work.",
        vi: "Đúng là sẽ cần nguồn lực ở giai đoạn đầu, nhưng tránh được việc làm lại.",
        pronunciation_focus: ["да, … но … nêu đánh đổi", "потребует + sinh cách", "избавит от = giúp tránh khỏi"],
        pronunciation_focus_en: ["да, … но … states the trade-off", "потребует + genitive", "избавит от = saves from"],
      },
      {
        russian: "Поэтому, на мой взгляд, устойчивое решение разумнее самого быстрого.",
        romanization: "Poetomu, na moy vzglyad, ustoychivoye resheniye razumneye samogo bystrogo.",
        en: "Therefore, in my view, a sustainable solution is wiser than the fastest one.",
        vi: "Vì vậy, theo tôi, phương án bền vững hợp lý hơn phương án nhanh nhất.",
        pronunciation_focus: ["на мой взгляд = theo tôi", "разумнее = hợp lý hơn (so sánh)", "самого быстрого là sinh cách"],
        pronunciation_focus_en: ["на мой взгляд = in my view", "разумнее = wiser (comparative)", "самого быстрого is genitive"],
      },
    ],
    vocabulary: [
      { cell_id: "d621bb31-4cab-4537-bf0a-8e93e0a81907", word: "при этом важно учитывать", romanization: "pri etom vazhno uchityvat", en: "at the same time it is important to consider", vi: "đồng thời cần tính đến", pos: "phrase", pronunciation_vi: "pri E-tam VAZH-na u-CHI-ty-vat", pronunciation_en: "pree EH-tom VAZH-no oo-CHEE-ty-vat" },
      { cell_id: "4eac09b5-d53e-41b6-85dd-4c7b178f0b73", word: "вести к", romanization: "vesti k", en: "to lead to", vi: "dẫn đến", pos: "verb", pronunciation_vi: "ve-STI k", pronunciation_en: "vye-STEE k" },
      { cell_id: "6130b800-cc0b-494e-9b02-2dff3a363449", word: "избавить от", romanization: "izbavit ot", en: "to save / spare from", vi: "giúp tránh khỏi", pos: "verb", pronunciation_vi: "iz-BA-vit at", pronunciation_en: "eez-BA-veet ot" },
      { cell_id: "59432cbc-c91c-4394-8414-2e6c0d8e2f72", word: "на мой взгляд", romanization: "na moy vzglyad", en: "in my view", vi: "theo tôi", pos: "phrase", pronunciation_vi: "na moy VZGLYAT", pronunciation_en: "na moy VZGLYAD" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi hiểu quan điểm của anh/chị, và nó có lý.", answer: "Я понимаю вашу точку зрения, и в ней есть смысл." },
          { prompt: "Đúng là sẽ cần thời gian, nhưng tránh được lỗi lặp lại.", answer: "Да, это потребует времени, но избавит от повторных ошибок." },
        ],
      },
    ],
    cultural_notes_vi:
      "Mở bằng `я понимаю вашу точку зрения` trước khi phản biện không phải là nhượng bộ — đó là chiến thuật giữ thể diện để ý của bạn được nghe.",
    cultural_notes_en:
      "Opening with `я понимаю вашу точку зрения` before countering is not surrender — it is a face-saving tactic so your point gets heard.",
    tip_advice_vi:
      "Khung thuyết phục: đồng cảm → `при этом важно учитывать…` → `да, …, но…` (đánh đổi) → `поэтому, на мой взгляд…`.",
    tip_advice_en:
      "Persuasion frame: empathize → `при этом важно учитывать…` → `да, …, но…` (trade-off) → `поэтому, на мой взгляд…`.",
  },
  {
    id: "russian_c2_discourse_mediating",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Hòa giải và bắc cầu giữa hai quan điểm",
    title_en: "C2: Mediating and bridging two viewpoints",
    intro_vi:
      "Hòa giải C2 là giảm căng thẳng và dịch giữa hai bên: công nhận cả hai, diễn đạt lại, làm rõ chỗ khác biệt, rồi đề xuất phương án trung gian.",
    intro_en:
      "C2 mediation reduces tension and translates between sides: acknowledge both, reframe, clarify the real gap, then propose a middle option.",
    sentences: [
      {
        russian: "Я понимаю обе стороны, и у каждой есть основания.",
        romanization: "Ya ponimayu obe storony, i u kazhdoy yest osnovaniya.",
        en: "I understand both sides, and each has its reasons.",
        vi: "Tôi hiểu cả hai bên, và mỗi bên đều có cơ sở.",
        pronunciation_focus: ["обе стороны = cả hai bên", "у каждой есть основания = mỗi bên có cơ sở", "обе dạng giống cái số ít đặc biệt"],
        pronunciation_focus_en: ["обе стороны = both sides", "у каждой есть основания = each has grounds", "обе is a special feminine numeral"],
      },
      {
        russian: "Возможно, мы говорим об одном и том же разными словами.",
        romanization: "Vozmozhno, my govorim ob odnom i tom zhe raznymi slovami.",
        en: "Perhaps we are talking about the same thing in different words.",
        vi: "Có lẽ chúng ta đang nói cùng một điều bằng cách khác nhau.",
        pronunciation_focus: ["об одном и том же = về cùng một điều", "разными словами là công cụ cách", "возможно làm mềm"],
        pronunciation_focus_en: ["об одном и том же = about the same thing", "разными словами is instrumental", "возможно softens"],
      },
      {
        russian: "Давайте уточним, где именно возникает расхождение.",
        romanization: "Davayte utochnim, gde imenno voznikayet raskhozhdeniye.",
        en: "Let's clarify where exactly the disagreement arises.",
        vi: "Hãy làm rõ chính xác chỗ khác biệt nằm ở đâu.",
        pronunciation_focus: ["давайте уточним = hãy làm rõ", "где именно = chính xác ở đâu", "расхождение = sự khác biệt"],
        pronunciation_focus_en: ["давайте уточним = let's clarify", "где именно = where exactly", "расхождение = divergence"],
      },
      {
        russian: "Тогда можно предложить промежуточный вариант, который сохранит и принцип, и отношения.",
        romanization: "Togda mozhno predlozhit promezhutochnyy variant, kotoryy sokhranit i printsip, i otnosheniya.",
        en: "Then we can propose a middle option that keeps both the principle and the relationship.",
        vi: "Vậy có thể đề xuất một phương án trung gian, giữ được cả nguyên tắc lẫn quan hệ.",
        pronunciation_focus: ["промежуточный вариант = phương án trung gian", "и …, и … = cả … lẫn …", "сохранит là tương lai hoàn thành"],
        pronunciation_focus_en: ["промежуточный вариант = middle option", "и …, и … = both … and …", "сохранит is perfective future"],
      },
    ],
    vocabulary: [
      { cell_id: "b36c86e2-7a4b-4907-8676-a85f314ca683", word: "обе стороны", romanization: "obe storony", en: "both sides", vi: "cả hai bên", pos: "noun phrase", pronunciation_vi: "O-be STO-ra-ny", pronunciation_en: "O-bye STO-ra-ny" },
      { cell_id: "1a35292e-62ea-49ba-b4fe-7c75339f065c", word: "расхождение", romanization: "raskhozhdeniye", en: "divergence / disagreement", vi: "sự khác biệt / bất đồng", pos: "noun", pronunciation_vi: "ras-khazh-DYE-ni-ye", pronunciation_en: "ras-khozh-DYE-nee-ye" },
      { cell_id: "bceddc5f-5f69-46e6-9ff8-d2ef54d2f028", word: "промежуточный вариант", romanization: "promezhutochnyy variant", en: "intermediate option", vi: "phương án trung gian", pos: "noun phrase", pronunciation_vi: "pra-me-ZHU-tach-ny va-ri-ANT", pronunciation_en: "pra-mye-ZHOO-toch-ny va-ree-ANT" },
      { cell_id: "1d9e9338-b516-4b75-8978-d75576f54de1", word: "сохранить", romanization: "sokhranit", en: "to preserve / keep", vi: "giữ được", pos: "verb", pronunciation_vi: "sa-khra-NIT", pronunciation_en: "sa-khra-NEET" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Hãy làm rõ chính xác chỗ khác biệt nằm ở đâu.", answer: "Давайте уточним, где именно возникает расхождение." },
          { prompt: "Có lẽ chúng ta đang nói cùng một điều bằng cách khác nhau.", answer: "Возможно, мы говорим об одном и том же разными словами." },
        ],
      },
    ],
    cultural_notes_vi:
      "Diễn đạt lại (`возможно, мы говорим об одном и том же`) cho phép hai bên giữ thể diện: không ai sai, chỉ là dùng từ khác.",
    cultural_notes_en:
      "Reframing (`возможно, мы говорим об одном и том же`) lets both sides save face: no one is wrong, they just used different words.",
    tip_advice_vi:
      "Người hòa giải nói `и …, и …` chứ không `или … или …`: mục tiêu là giữ cả nguyên tắc lẫn quan hệ.",
    tip_advice_en:
      "A mediator says `и …, и …`, not `или … или …`: the goal is keeping both the principle and the relationship.",
  },
  {
    id: "russian_c2_discourse_irony_nuance",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Đọc mỉa mai và ý ngầm",
    title_en: "C2: Reading irony and implied meaning",
    intro_vi:
      "Ở C2, nghĩa thật thường nằm ngoài từ điển. Cùng một câu có thể khen thật hoặc mỉa, tùy giọng và bối cảnh. Học cách nhận ra trước khi bắt chước.",
    intro_en:
      "At C2, the real meaning often sits outside the dictionary. The same line can be sincere praise or irony, depending on tone and context. Learn to read it before you imitate it.",
    sentences: [
      {
        russian: "Ну отлично. Опять сервер упал.",
        romanization: "Nu otlichno. Opyat server upal.",
        en: "Well, great. The server is down again.",
        vi: "Hay thật. Máy chủ lại sập rồi.",
        pronunciation_focus: ["ну отлично sau tin xấu = mỉa", "опять = lại (lần nữa)", "упал = đã sập"],
        pronunciation_focus_en: ["ну отлично after bad news = ironic", "опять = again", "упал = went down"],
      },
      {
        russian: "Кто бы мог подумать, что без проверки будут ошибки.",
        romanization: "Kto by mog podumat, chto bez proverki budut oshibki.",
        en: "Who could have thought there'd be errors without testing.",
        vi: "Ai mà ngờ được là không kiểm tra thì sẽ có lỗi.",
        pronunciation_focus: ["кто бы мог подумать = câu mỉa khi kết quả quá rõ", "без проверки là sinh cách", "будут ошибки = sẽ có lỗi"],
        pronunciation_focus_en: ["кто бы мог подумать = irony when the result was obvious", "без проверки is genitive", "будут ошибки = there'll be errors"],
      },
      {
        russian: "Формально всё правильно, но на практике это не работает.",
        romanization: "Formalno vsyo pravilno, no na praktike eto ne rabotayet.",
        en: "Formally everything is correct, but in practice it doesn't work.",
        vi: "Trên giấy thì đúng hết, nhưng thực tế lại không chạy.",
        pronunciation_focus: ["формально всё правильно báo hiệu `nhưng`", "на практике = trên thực tế", "tương phản giấy / thực tế"],
        pronunciation_focus_en: ["формально всё правильно signals an upcoming `but`", "на практике = in practice", "paper vs reality contrast"],
      },
      {
        russian: "Если что-то звучит слишком гладко, стоит спросить, что осталось несказанным.",
        romanization: "Yesli chto-to zvuchit slishkom gladko, stoit sprosit, chto ostalos neskazannym.",
        en: "If something sounds too smooth, it's worth asking what was left unsaid.",
        vi: "Nếu điều gì nghe quá mượt, nên hỏi xem điều gì đã không được nói ra.",
        pronunciation_focus: ["слишком гладко = quá mượt (đáng nghi)", "стоит + nguyên mẫu = nên", "осталось несказанным = bị bỏ ngỏ"],
        pronunciation_focus_en: ["слишком гладко = too smooth (suspicious)", "стоит + infinitive = it's worth", "осталось несказанным = left unsaid"],
      },
    ],
    vocabulary: [
      { cell_id: "8cf75846-3c19-41de-a281-c020bd98bf1f", word: "ну отлично", romanization: "nu otlichno", en: "well, great (often ironic)", vi: "hay thật (thường mỉa)", pos: "phrase", pronunciation_vi: "nu at-LICH-na", pronunciation_en: "noo at-LEECH-no" },
      { cell_id: "583a16dc-0a28-44ac-9f69-b7885f073532", word: "кто бы мог подумать", romanization: "kto by mog podumat", en: "who'd have thought (ironic)", vi: "ai mà ngờ được", pos: "phrase", pronunciation_vi: "kto by mok pa-DU-mat", pronunciation_en: "kto by mog pa-DOO-mat" },
      { cell_id: "8c70902b-3321-4d38-9e38-0e08396e6e56", word: "формально", romanization: "formalno", en: "formally / on paper", vi: "trên giấy / về mặt hình thức", pos: "adverb", pronunciation_vi: "for-MAL-na", pronunciation_en: "for-MAL-no" },
      { cell_id: "0dd810ef-0e9f-4704-b2d0-1893fc6d1b43", word: "слишком гладко", romanization: "slishkom gladko", en: "too smooth", vi: "quá mượt", pos: "phrase", pronunciation_vi: "SLISH-kam GLAT-ka", pronunciation_en: "SLEESH-kom GLAD-ko" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn câu trả lời an toàn khi nghe `Ну отлично` sau tin xấu.",
        instruction_en: "Choose the safe reply when you hear `Ну отлично` after bad news.",
        items: [{ prompt: "Ну отлично. — Safe reply: _____ (Спасибо! / Что случилось?)", answer: "Что случилось?" }],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Trên giấy thì đúng, nhưng thực tế lại không chạy.", answer: "Формально всё правильно, но на практике это не работает." },
        ],
      },
    ],
    cultural_notes_vi:
      "Người Việt có thể hiểu nghĩa từ điển nhưng bỏ lỡ nghĩa xã hội. `Ну молодец` có thể khen thật hoặc `làm hỏng rồi` — giọng và bối cảnh quyết định.",
    cultural_notes_en:
      "Vietnamese learners can grasp the dictionary meaning but miss the social one. `Ну молодец` can be real praise or `you messed up` — tone and context decide.",
    tip_advice_vi:
      "Khi không chắc là mỉa hay thật, đừng bắt chước. Hỏi nhẹ: `Что случилось?` hoặc `Вы серьёзно или иронично?`.",
    tip_advice_en:
      "When unsure if it's ironic or sincere, don't imitate it. Ask gently: `Что случилось?` or `Вы серьёзно или иронично?`.",
  },
  {
    id: "russian_c2_pragmatics_soft_refusal",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Từ chối mềm và đọc ý ngầm trong công việc",
    title_en: "C2: Soft refusals and reading subtext at work",
    intro_vi:
      "Ngữ dụng C2: nhiều câu lịch sự thực ra là `không`. `Я вас услышал`, `мы подумаем`, `есть нюансы` cần được đọc đúng để không hiểu nhầm là đồng ý.",
    intro_en:
      "C2 pragmatics: many polite lines are really `no`. `Я вас услышал`, `мы подумаем`, `есть нюансы` must be read correctly so you don't mistake them for agreement.",
    sentences: [
      {
        russian: "Я вас услышал, мы вернёмся к этому вопросу позже.",
        romanization: "Ya vas uslyshal, my vernyomsya k etomu voprosu pozzhe.",
        en: "I've heard you; we'll come back to this question later.",
        vi: "Tôi đã nghe ý anh/chị; chúng tôi sẽ quay lại vấn đề này sau.",
        pronunciation_focus: ["я вас услышал = đã nghe (có thể là khép chủ đề)", "вернёмся к + tặng cách", "позже = sau"],
        pronunciation_focus_en: ["я вас услышал = I heard you (may close the topic)", "вернёмся к + dative", "позже = later"],
      },
      {
        russian: "В принципе можно, но здесь есть нюансы.",
        romanization: "V printsipe mozhno, no zdes yest nyuansy.",
        en: "In principle it's possible, but there are nuances here.",
        vi: "Về nguyên tắc thì được, nhưng ở đây có những điểm tế nhị.",
        pronunciation_focus: ["в принципе можно ≠ `yes` hoàn toàn", "есть нюансы = có vấn đề (mềm)", "но báo điều kiện"],
        pronunciation_focus_en: ["в принципе можно ≠ a full `yes`", "есть нюансы = there are problems (softly)", "но flags conditions"],
      },
      {
        russian: "Чтобы не было недопонимания, уточните, пожалуйста, следующий шаг.",
        romanization: "Chtoby ne bylo nedoponimaniya, utochnite, pozhaluysta, sleduyushchiy shag.",
        en: "To avoid misunderstanding, please clarify the next step.",
        vi: "Để tránh hiểu nhầm, xin hãy làm rõ bước tiếp theo.",
        pronunciation_focus: ["чтобы не было недопонимания là cụm an toàn", "уточните = làm rõ (mệnh lệnh lịch sự)", "следующий шаг = bước tiếp theo"],
        pronunciation_focus_en: ["чтобы не было недопонимания is a safe chunk", "уточните = clarify (polite imperative)", "следующий шаг = next step"],
      },
      {
        russian: "Если это не срочно, я займусь этим завтра.",
        romanization: "Yesli eto ne srochno, ya zaymus etim zavtra.",
        en: "If it's not urgent, I'll deal with it tomorrow.",
        vi: "Nếu không gấp, tôi sẽ làm việc này vào ngày mai.",
        pronunciation_focus: ["не срочно = không gấp (nhưng đừng quên)", "займусь + công cụ cách", "завтра = ngày mai"],
        pronunciation_focus_en: ["не срочно = not urgent (but don't forget it)", "займусь + instrumental", "завтра = tomorrow"],
      },
    ],
    vocabulary: [
      { cell_id: "d80556fd-e68e-4f0a-8944-006f0743f544", word: "я вас услышал", romanization: "ya vas uslyshal", en: "I've heard you (may end the topic)", vi: "tôi đã nghe (có thể khép chủ đề)", pos: "phrase", pronunciation_vi: "ya vas u-SLY-shal", pronunciation_en: "ya vas oo-SLY-shal" },
      { cell_id: "87247640-2830-4fe7-9c85-91239eb8ba9a", word: "есть нюансы", romanization: "yest nyuansy", en: "there are nuances (= problems)", vi: "có điểm tế nhị (= vấn đề)", pos: "phrase", pronunciation_vi: "yest nyu-AN-sy", pronunciation_en: "yest nyoo-AN-sy" },
      { cell_id: "b6002963-4446-49f9-8e3e-54003dea0b85", word: "недопонимание", romanization: "nedoponimaniye", en: "misunderstanding", vi: "sự hiểu nhầm", pos: "noun", pronunciation_vi: "ne-da-pa-ni-MA-ni-ye", pronunciation_en: "nye-da-pa-nee-MA-nee-ye" },
      { cell_id: "d115b7e6-02a7-4402-ba3d-2349811de1ce", word: "уточнить", romanization: "utochnit", en: "to clarify", vi: "làm rõ", pos: "verb", pronunciation_vi: "u-tach-NIT", pronunciation_en: "oo-toch-NEET" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Khi nghe `Мы подумаем`, hỏi tiếp câu nào để có cam kết?",
        instruction_en: "After `Мы подумаем`, which follow-up secures a commitment?",
        items: [{ prompt: "Мы подумаем. — _____ (Спасибо за согласие. / Когда ждать ответ?)", answer: "Когда ждать ответ?" }],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Để tránh hiểu nhầm, xin hãy làm rõ bước tiếp theo.", answer: "Чтобы не было недопонимания, уточните, пожалуйста, следующий шаг." },
        ],
      },
    ],
    cultural_notes_vi:
      "`Я вас услышал` trong công việc thường là cách kết thúc lịch sự, không phải lời hứa. Đừng coi là đồng ý; hãy hỏi `Что будет следующим шагом?`.",
    cultural_notes_en:
      "At work, `Я вас услышал` is often a polite way to close, not a promise. Don't treat it as agreement; ask `Что будет следующим шагом?`.",
    tip_advice_vi:
      "Với từ chối mềm, luôn hỏi một câu cụ thể về thời gian hoặc bước tiếp theo. Câu hỏi cụ thể biến `có thể` thành cam kết hoặc lộ rõ là `không`.",
    tip_advice_en:
      "Against a soft refusal, always ask one concrete question about timing or next steps. A concrete question turns `maybe` into a commitment or exposes the real `no`.",
  },
  {
    id: "russian_c2_register_shifting",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Chuyển register cho cùng một ý",
    title_en: "C2: Shifting register for the same idea",
    intro_vi:
      "Ở C2, câu đúng ngữ pháp vẫn có thể sai ngữ cảnh. Cùng ý `tôi không đồng ý` có nhiều phiên bản: trang trọng, trung tính, thân mật, học thuật.",
    intro_en:
      "At C2, a grammatically correct sentence can still be socially wrong. The same idea `I disagree` has many versions: formal, neutral, colloquial, academic.",
    sentences: [
      {
        russian: "Я не могу согласиться с данной позицией.",
        romanization: "Ya ne mogu soglasitsya s dannoy pozitsiyey.",
        en: "I cannot agree with this position. (formal)",
        vi: "Tôi không thể đồng ý với quan điểm này. (trang trọng)",
        pronunciation_focus: ["не могу согласиться là dạng trang trọng", "с данной позицией = công cụ cách", "данной thay этой trong văn trang trọng"],
        pronunciation_focus_en: ["не могу согласиться is the formal form", "с данной позицией = instrumental", "данной replaces этой in formal style"],
      },
      {
        russian: "Я с этим не согласен.",
        romanization: "Ya s etim ne soglasen.",
        en: "I don't agree with this. (neutral)",
        vi: "Tôi không đồng ý với điều này. (trung tính)",
        pronunciation_focus: ["не согласен dạng nam (nữ: не согласна)", "с этим = công cụ cách", "register trung tính"],
        pronunciation_focus_en: ["не согласен is masculine (fem.: не согласна)", "с этим = instrumental", "neutral register"],
      },
      {
        russian: "Да нет, не думаю.",
        romanization: "Da net, ne dumayu.",
        en: "Nah, I don't think so. (colloquial)",
        vi: "Ờ không, tôi không nghĩ vậy. (thân mật)",
        pronunciation_focus: ["да нет là cụm khẩu ngữ (vẫn nghĩa `không`)", "chỉ dùng với người quen", "не думаю = không nghĩ vậy"],
        pronunciation_focus_en: ["да нет is colloquial (still means `no`)", "use only with familiar people", "не думаю = I don't think so"],
      },
      {
        russian: "Этот тезис требует уточнения.",
        romanization: "Etot tezis trebuyet utochneniya.",
        en: "This thesis requires qualification. (academic)",
        vi: "Luận đề này cần được làm rõ thêm. (học thuật)",
        pronunciation_focus: ["тезис требует уточнения là phản đối học thuật mềm", "требует + sinh cách", "không nói thẳng `sai`"],
        pronunciation_focus_en: ["тезис требует уточнения is a soft academic objection", "требует + genitive", "never says `wrong` directly"],
      },
    ],
    vocabulary: [
      { cell_id: "c1410542-15b9-4645-92f9-0daeae2ec2ea", word: "данная позиция", romanization: "dannaya pozitsiya", en: "this position (formal)", vi: "quan điểm này (trang trọng)", pos: "noun phrase", pronunciation_vi: "DAN-na-ya pa-ZI-tsi-ya", pronunciation_en: "DAN-na-ya pa-ZEE-tsee-ya" },
      { cell_id: "15a2549c-a642-480b-b18d-ce453201bd51", word: "да нет", romanization: "da net", en: "nah / not really (colloquial)", vi: "ờ không (khẩu ngữ)", pos: "phrase", pronunciation_vi: "da NYET", pronunciation_en: "da NYET" },
      { cell_id: "92044811-15fb-46fc-8bc0-1f06d93f6ae1", word: "тезис", romanization: "tezis", en: "thesis / claim", vi: "luận đề", pos: "noun", pronunciation_vi: "TYE-zis", pronunciation_en: "TYE-zees" },
      { cell_id: "3e487d61-246f-4dd3-8493-1df815839f6b", word: "требовать уточнения", romanization: "trebovat utochneniya", en: "to require qualification", vi: "cần được làm rõ", pos: "verb phrase", pronunciation_vi: "TRYE-ba-vat u-tach-NYE-ni-ya", pronunciation_en: "TRYE-ba-vat oo-toch-NYE-nee-ya" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Ghép câu với register đúng.",
        instruction_en: "Match each sentence with its register.",
        items: [
          { prompt: "Я не могу согласиться с данной позицией.", answer: "formal / trang trọng" },
          { prompt: "Да нет, не думаю.", answer: "colloquial / thân mật" },
          { prompt: "Этот тезис требует уточнения.", answer: "academic / học thuật" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Viết lại `Я с этим не согласен` ở register trang trọng.",
        instruction_en: "Rewrite `Я с этим не согласен` in a formal register.",
        items: [{ prompt: "Trang trọng hóa: Tôi không đồng ý với điều này.", answer: "Я не могу согласиться с данной позицией." }],
      },
    ],
    cultural_notes_vi:
      "Dùng `да нет, не думаю` trong cuộc họp chính thức nghe thiếu nghiêm túc; dùng `данная позиция` với bạn bè nghe lạnh lùng. Chọn register theo khoảng cách và rủi ro.",
    cultural_notes_en:
      "Using `да нет, не думаю` in a formal meeting sounds unserious; using `данная позиция` with friends sounds cold. Choose register by distance and risk.",
    tip_advice_vi:
      "Trong tình huống rủi ro (công việc, cơ quan, pháp lý), mặc định register trung tính hoặc trang trọng. Chỉ chuyển sang khẩu ngữ khi bạn chắc về quan hệ.",
    tip_advice_en:
      "In risky settings (work, officialdom, legal), default to neutral or formal register. Only drop to colloquial when you're sure of the relationship.",
  },
  {
    id: "russian_c2_register_formal_bureaucratic",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Văn trang trọng và văn hành chính",
    title_en: "C2: Formal and bureaucratic register",
    intro_vi:
      "Email công việc và công văn Nga có dấu hiệu riêng: `прошу`, `в связи с`, `на основании`, `необходимо`. Biết dùng — và biết khi nào là quá cứng.",
    intro_en:
      "Russian work email and official documents have their own markers: `прошу`, `в связи с`, `на основании`, `необходимо`. Know how to use them — and when they're too stiff.",
    sentences: [
      {
        russian: "В связи с изменением графика прошу подтвердить возможность переноса встречи.",
        romanization: "V svyazi s izmeneniyem grafika proshu podtverdit vozmozhnost perenosa vstrechi.",
        en: "Due to a schedule change, I ask you to confirm the possibility of rescheduling the meeting.",
        vi: "Do thay đổi lịch, tôi đề nghị xác nhận khả năng dời cuộc họp.",
        pronunciation_focus: ["в связи с + công cụ cách = do / liên quan đến", "прошу + nguyên mẫu là dấu trang trọng", "переноса là sinh cách"],
        pronunciation_focus_en: ["в связи с + instrumental = due to", "прошу + infinitive is a formal marker", "переноса is genitive"],
      },
      {
        russian: "На основании представленных документов необходимо принять решение.",
        romanization: "Na osnovanii predstavlennykh dokumentov neobkhodimo prinyat resheniye.",
        en: "On the basis of the submitted documents, a decision must be made.",
        vi: "Trên cơ sở các tài liệu đã nộp, cần đưa ra quyết định.",
        pronunciation_focus: ["на основании + sinh cách = trên cơ sở", "необходимо = cần (hành chính, vô nhân xưng)", "представленных là phân từ"],
        pronunciation_focus_en: ["на основании + genitive = on the basis of", "необходимо = it is necessary (impersonal, bureaucratic)", "представленных is a participle"],
      },
      {
        russian: "Прошу рассмотреть возможность переноса встречи на следующую неделю.",
        romanization: "Proshu rassmotret vozmozhnost perenosa vstrechi na sleduyushchuyu nedelyu.",
        en: "I ask you to consider rescheduling the meeting to next week.",
        vi: "Tôi đề nghị xem xét khả năng dời cuộc họp sang tuần sau.",
        pronunciation_focus: ["прошу рассмотреть возможность là khung lịch sự chuẩn", "на следующую неделю = sang tuần sau", "thay cho `Давайте перенесём?` khẩu ngữ"],
        pronunciation_focus_en: ["прошу рассмотреть возможность is a standard polite frame", "на следующую неделю = to next week", "replaces colloquial `Давайте перенесём?`"],
      },
      {
        russian: "В неформальном письме та же просьба звучит проще: «Можем перенести встречу?»",
        romanization: "V neformalnom pisme ta zhe prosba zvuchit proshche: «Mozhem perenesti vstrechu?»",
        en: "In an informal note the same request sounds simpler: 'Can we move the meeting?'",
        vi: "Trong thư không trang trọng, cùng lời đề nghị nghe đơn giản hơn: «Mình dời cuộc họp được không?»",
        pronunciation_focus: ["та же просьба = cùng lời đề nghị", "звучит проще = nghe đơn giản hơn", "đối chiếu trang trọng / thân mật"],
        pronunciation_focus_en: ["та же просьба = the same request", "звучит проще = sounds simpler", "formal vs informal contrast"],
      },
    ],
    vocabulary: [
      { cell_id: "c69a536d-0fea-491d-b55b-9d3682d1fcad", word: "в связи с", romanization: "v svyazi s", en: "due to / in connection with", vi: "do / liên quan đến", pos: "preposition phrase", pronunciation_vi: "f svya-ZI s", pronunciation_en: "f svya-ZEE s" },
      { cell_id: "a8763cf4-78fc-4290-96d6-8edd6bf3ffd7", word: "прошу", romanization: "proshu", en: "I request / I ask (formal)", vi: "tôi đề nghị (trang trọng)", pos: "verb", pronunciation_vi: "pra-SHU", pronunciation_en: "pra-SHOO" },
      { cell_id: "bdf303b9-cb1a-4357-8492-cbbba372fc48", word: "на основании", romanization: "na osnovanii", en: "on the basis of", vi: "trên cơ sở", pos: "preposition phrase", pronunciation_vi: "na as-na-VA-ni-i", pronunciation_en: "na as-na-VA-nee-ee" },
      { cell_id: "19a68ae9-b8ed-43c4-baba-4d87dc4aa0e3", word: "необходимо", romanization: "neobkhodimo", en: "it is necessary (bureaucratic)", vi: "cần (hành chính)", pos: "predicative", pronunciation_vi: "ne-ab-kha-DI-ma", pronunciation_en: "nye-ob-kha-DEE-mo" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Viết lại `Давайте перенесём встречу?` ở register trang trọng.",
        instruction_en: "Rewrite `Давайте перенесём встречу?` in a formal register.",
        items: [
          { prompt: "Trang trọng hóa lời đề nghị dời họp.", answer: "Прошу рассмотреть возможность переноса встречи на следующую неделю." },
          { prompt: "Do thay đổi lịch, tôi đề nghị xác nhận khả năng dời cuộc họp.", answer: "В связи с изменением графика прошу подтвердить возможность переноса встречи." },
        ],
      },
    ],
    cultural_notes_vi:
      "`прошу`, `в связи с`, `на основании` cho thư uy quyền của thể chế. Nhưng dùng với đồng nghiệp thân thì nghe quá cứng (`слишком бюрократично`).",
    cultural_notes_en:
      "`прошу`, `в связи с`, `на основании` give a letter institutional authority. But with a close colleague they sound too stiff (`слишком бюрократично`).",
    tip_advice_vi:
      "Chọn một mức trang trọng cho cả thư và giữ nhất quán. Trộn `прошу` với khẩu ngữ trong cùng câu làm giọng văn lệch.",
    tip_advice_en:
      "Pick one formality level for the whole letter and keep it consistent. Mixing `прошу` with colloquial wording in one sentence makes the tone wobble.",
  },
  {
    id: "russian_c2_academic_argumentation",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Luận chứng học thuật — luận đề, phản biện, giới hạn",
    title_en: "C2: Academic argumentation — thesis, counterargument, qualification",
    intro_vi:
      "Văn học thuật mạnh không né phản biện. Nó nêu luận đề, dẫn vào phản biện, thừa nhận điểm mạnh của nó, rồi giới hạn kết luận để tránh khái quát quá mức.",
    intro_en:
      "Strong academic writing doesn't dodge objections. It states a thesis, introduces the counterargument, grants its strength, then qualifies the conclusion to avoid overgeneralizing.",
    sentences: [
      {
        russian: "Академическая аргументация начинается с тезиса, но не заканчивается его формулировкой.",
        romanization: "Akademicheskaya argumentatsiya nachinayetsya s tezisa, no ne zakanchivayetsya yego formulirovkoy.",
        en: "Academic argumentation begins with a thesis but does not end with stating it.",
        vi: "Luận chứng học thuật bắt đầu bằng luận đề nhưng không dừng ở việc phát biểu nó.",
        pronunciation_focus: ["начинается с + sinh cách", "не заканчивается + công cụ cách", "формулировкой = việc phát biểu"],
        pronunciation_focus_en: ["начинается с + genitive", "не заканчивается + instrumental", "формулировкой = formulation"],
      },
      {
        russian: "Сильный текст вводит контраргумент и признаёт его силу.",
        romanization: "Silnyy tekst vvodit kontrargument i priznayot yego silu.",
        en: "A strong text introduces the counterargument and acknowledges its strength.",
        vi: "Một bài mạnh trình bày phản biện và thừa nhận điểm mạnh của nó.",
        pronunciation_focus: ["вводит контраргумент = đưa phản biện vào", "признаёт силу = thừa nhận sức mạnh", "его силу là đối cách"],
        pronunciation_focus_en: ["вводит контраргумент = introduces the counterargument", "признаёт силу = acknowledges its strength", "его силу is accusative"],
      },
      {
        russian: "Категорическое утверждение часто звучит слабее, чем аккуратно ограниченный вывод.",
        romanization: "Kategoricheskoye utverzhdeniye chasto zvuchit slabeye, chem akkuratno ogranichennyy vyvod.",
        en: "A categorical statement often sounds weaker than a carefully qualified conclusion.",
        vi: "Khẳng định tuyệt đối thường nghe yếu hơn một kết luận có giới hạn cẩn thận.",
        pronunciation_focus: ["звучит слабее, чем = nghe yếu hơn so với", "ограниченный вывод = kết luận có giới hạn", "слабее là so sánh"],
        pronunciation_focus_en: ["звучит слабее, чем = sounds weaker than", "ограниченный вывод = qualified conclusion", "слабее is comparative"],
      },
      {
        russian: "При определённых условиях этот вывод справедлив, однако его не следует обобщать.",
        romanization: "Pri opredelyonnykh usloviyakh etot vyvod spravedliv, odnako yego ne sleduyet obobshchat.",
        en: "Under certain conditions this conclusion holds, but it should not be generalized.",
        vi: "Trong những điều kiện nhất định, kết luận này đúng, nhưng không nên khái quát hóa nó.",
        pronunciation_focus: ["при определённых условиях = trong điều kiện nhất định", "однако trang trọng hơn `но`", "не следует обобщать = không nên khái quát"],
        pronunciation_focus_en: ["при определённых условиях = under certain conditions", "однако is more formal than `но`", "не следует обобщать = should not be generalized"],
      },
    ],
    vocabulary: [
      { cell_id: "292caf33-450a-46bf-9f4b-e5d39f995566", word: "тезис", romanization: "tezis", en: "thesis", vi: "luận đề", pos: "noun", pronunciation_vi: "TYE-zis", pronunciation_en: "TYE-zees" },
      { cell_id: "e36fb1d8-e31e-4a9a-82d1-3c15cf0a81b4", word: "контраргумент", romanization: "kontrargument", en: "counterargument", vi: "phản biện", pos: "noun", pronunciation_vi: "kon-tr-ar-gu-MYENT", pronunciation_en: "kon-tr-ar-goo-MYENT" },
      { cell_id: "20fba979-5b44-4aaa-a3ce-e9e3484b9657", word: "при определённых условиях", romanization: "pri opredelyonnykh usloviyakh", en: "under certain conditions", vi: "trong điều kiện nhất định", pos: "phrase", pronunciation_vi: "pri a-pre-de-LYON-nykh us-LO-vi-yakh", pronunciation_en: "pree a-pre-dye-LYON-nykh oos-LO-vee-yakh" },
      { cell_id: "b3723bc9-67b6-4615-9da7-d347c202b18d", word: "обобщать", romanization: "obobshchat", en: "to generalize", vi: "khái quát hóa", pos: "verb", pronunciation_vi: "a-bab-SHCHAT", pronunciation_en: "a-bob-SHCHAT" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga học thuật.",
        instruction_en: "Translate into academic Russian.",
        items: [
          { prompt: "Trong những điều kiện nhất định, kết luận này đúng, nhưng không nên khái quát hóa.", answer: "При определённых условиях этот вывод справедлив, однако его не следует обобщать." },
          { prompt: "Một bài mạnh trình bày phản biện và thừa nhận điểm mạnh của nó.", answer: "Сильный текст вводит контраргумент и признаёт его силу." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền liên từ trang trọng thay cho `но`.",
        instruction_en: "Insert the formal connector replacing `но`.",
        items: [{ prompt: "Вывод справедлив, _____ его не следует обобщать.", answer: "однако" }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt cho phép kết luận mềm và vòng ý; tiếng Nga học thuật lại thưởng cho việc giới hạn rõ (`при определённых условиях`). Khẳng định tuyệt đối dễ bị bắt lỗi logic.",
    cultural_notes_en:
      "Vietnamese tolerates soft, circular conclusions; academic Russian rewards explicit qualification (`при определённых условиях`). Categorical claims invite logical objections.",
    tip_advice_vi:
      "Mỗi luận đề mạnh nên có một câu giới hạn đi kèm. `Hedging` không làm lập luận yếu — nó làm lập luận khó phản bác hơn.",
    tip_advice_en:
      "Every strong thesis should carry a qualifying clause. Hedging doesn't weaken the argument — it makes it harder to refute.",
  },
  {
    id: "russian_c2_argumentation_debate",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Dựng và phản bác luận điểm trong tranh luận",
    title_en: "C2: Building and refuting claims in debate",
    intro_vi:
      "Một luận điểm Nga mạnh có: luận đề, lý do, giới hạn, kết luận. Dùng `во-первых`, `однако`, `с одной стороны… с другой стороны`, `следовательно` để giữ mạch.",
    intro_en:
      "A strong Russian claim has thesis, reason, limit, conclusion. Use `во-первых`, `однако`, `с одной стороны… с другой стороны`, `следовательно` to keep the thread.",
    sentences: [
      {
        russian: "Следует поддержать реформу, потому что она снижает административные барьеры.",
        romanization: "Sleduyet podderzhat reformu, potomu chto ona snizhayet administrativnyye baryery.",
        en: "The reform should be supported, because it lowers administrative barriers.",
        vi: "Nên ủng hộ cải cách, vì nó giảm rào cản hành chính.",
        pronunciation_focus: ["следует + nguyên mẫu = nên", "потому что nêu lý do", "снижает барьеры = giảm rào cản"],
        pronunciation_focus_en: ["следует + infinitive = one should", "потому что gives the reason", "снижает барьеры = lowers barriers"],
      },
      {
        russian: "Однако одного упрощения недостаточно: без контроля система ускорит прежние ошибки.",
        romanization: "Odnako odnogo uproshcheniya nedostatochno: bez kontrolya sistema uskorit prezhniye oshibki.",
        en: "However, simplification alone is not enough: without control the system will only speed up old errors.",
        vi: "Tuy nhiên, chỉ đơn giản hóa là chưa đủ: không kiểm soát thì hệ thống sẽ chỉ tăng tốc các lỗi cũ.",
        pronunciation_focus: ["однако = tuy nhiên (trang trọng)", "одного … недостаточно = chỉ … là chưa đủ", "без контроля là sinh cách"],
        pronunciation_focus_en: ["однако = however (formal)", "одного … недостаточно = … alone is not enough", "без контроля is genitive"],
      },
      {
        russian: "С одной стороны, это экономит время, с другой стороны, повышает риск ошибок.",
        romanization: "S odnoy storony, eto ekonomit vremya, s drugoy storony, povyshayet risk oshibok.",
        en: "On one hand it saves time, on the other hand it raises the risk of errors.",
        vi: "Một mặt nó tiết kiệm thời gian, mặt khác nó làm tăng nguy cơ lỗi.",
        pronunciation_focus: ["с одной стороны … с другой стороны = một mặt … mặt khác", "экономит время = tiết kiệm thời gian", "cân bằng hai phía"],
        pronunciation_focus_en: ["с одной стороны … с другой стороны = on one hand … on the other", "экономит время = saves time", "balances two sides"],
      },
      {
        russian: "Следовательно, нужна не только реформа, но и механизм проверки результатов.",
        romanization: "Sledovatelno, nuzhna ne tolko reforma, no i mekhanizm proverki rezultatov.",
        en: "Therefore, not only a reform is needed, but also a mechanism to verify the results.",
        vi: "Do đó, cần không chỉ cải cách mà còn cơ chế kiểm tra kết quả.",
        pronunciation_focus: ["следовательно = do đó (rút kết luận)", "не только …, но и … = không chỉ … mà còn …", "проверки результатов là sinh cách"],
        pronunciation_focus_en: ["следовательно = therefore (draws the conclusion)", "не только …, но и … = not only … but also …", "проверки результатов is genitive"],
      },
    ],
    vocabulary: [
      { cell_id: "b2071867-0add-48fc-8f79-f566d6300fa3", word: "следует", romanization: "sleduyet", en: "one should / it is appropriate", vi: "nên", pos: "predicative verb", pronunciation_vi: "SLYE-du-yet", pronunciation_en: "SLYE-doo-yet" },
      { cell_id: "b8c0d045-4cdc-41de-aab9-395a9106ae94", word: "однако", romanization: "odnako", en: "however", vi: "tuy nhiên", pos: "conjunction", pronunciation_vi: "ad-NA-ka", pronunciation_en: "ad-NA-ko" },
      { cell_id: "97e64e65-d22d-4816-826a-f920f9ae4803", word: "с одной стороны … с другой стороны", romanization: "s odnoy storony … s drugoy storony", en: "on one hand … on the other hand", vi: "một mặt … mặt khác", pos: "phrase", pronunciation_vi: "s ad-NOY sta-ra-NY … s dru-GOY sta-ra-NY", pronunciation_en: "s ad-NOY sta-ra-NY … s droo-GOY sta-ra-NY" },
      { cell_id: "91cba1ca-66f5-42c0-a312-7ae129069efa", word: "следовательно", romanization: "sledovatelno", en: "therefore / consequently", vi: "do đó", pos: "connector", pronunciation_vi: "sle-da-VA-tel-na", pronunciation_en: "sle-da-VA-tyel-no" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga, giữ mạch luận điểm.",
        instruction_en: "Translate into Russian, keeping the argument thread.",
        items: [
          { prompt: "Tuy nhiên, chỉ đơn giản hóa là chưa đủ.", answer: "Однако одного упрощения недостаточно." },
          { prompt: "Do đó, cần không chỉ cải cách mà còn cơ chế kiểm tra.", answer: "Следовательно, нужна не только реформа, но и механизм проверки." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền cặp liên từ cân bằng hai phía.",
        instruction_en: "Insert the connector pair balancing both sides.",
        items: [{ prompt: "_____ это экономит время, _____ повышает риск.", answer: "С одной стороны … с другой стороны" }],
      },
    ],
    cultural_notes_vi:
      "Luận điểm yếu kiểu `это хорошо, потому что это хорошо` (vòng tròn) bị coi nhẹ. Luận điểm mạnh nêu lý do cụ thể và một giới hạn.",
    cultural_notes_en:
      "A circular claim like `это хорошо, потому что это хорошо` is dismissed. A strong claim gives a concrete reason and one limitation.",
    tip_advice_vi:
      "Tránh tuyệt đối hóa một phía. Một nhượng bộ có kiểm soát (`однако…`) làm lập luận đáng tin hơn là khẳng định một chiều.",
    tip_advice_en:
      "Avoid taking one side absolutely. A controlled concession (`однако…`) makes the argument more credible than a one-sided claim.",
  },
  {
    id: "russian_c2_native_abstract_discourse",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Diễn ngôn trừu tượng kiểu người có học",
    title_en: "C2: Educated-native abstract discourse",
    intro_vi:
      "Người Nga có học thường không nói thẳng `tốt/xấu`. Họ tách lớp nghĩa: một từ như `стабильность` có thể là giá trị, đồng thời là công cụ quyền lực.",
    intro_en:
      "Educated Russians rarely say plainly `good/bad`. They split meanings: a word like `стабильность` can be a value and, at the same time, an instrument of power.",
    sentences: [
      {
        russian: "Когда говорят о «стабильности», за этим словом редко стоит просто отсутствие кризиса.",
        romanization: "Kogda govoryat o «stabilnosti», za etim slovom redko stoit prosto otsutstviye krizisa.",
        en: "When people speak of 'stability,' that word rarely stands merely for the absence of crisis.",
        vi: "Khi người ta nói về `ổn định`, đằng sau từ đó hiếm khi chỉ là sự vắng mặt của khủng hoảng.",
        pronunciation_focus: ["за этим словом стоит = đằng sau từ đó là", "отсутствие кризиса = sự vắng mặt khủng hoảng", "стабильность có hàm ý chính trị"],
        pronunciation_focus_en: ["за этим словом стоит = behind that word stands", "отсутствие кризиса = absence of crisis", "стабильность is politically loaded"],
      },
      {
        russian: "Вопрос состоит не в том, нужна ли стабильность, а в том, кто платит за её сохранение.",
        romanization: "Vopros sostoit ne v tom, nuzhna li stabilnost, a v tom, kto platit za yeyo sokhraneniye.",
        en: "The question is not whether stability is needed, but who pays for keeping it.",
        vi: "Câu hỏi không phải là có cần ổn định hay không, mà là ai trả giá để giữ nó.",
        pronunciation_focus: ["вопрос состоит не в том …, а в том … là khung phân tích", "нужна ли = có cần không (nghi vấn)", "за её сохранение = để giữ nó"],
        pronunciation_focus_en: ["вопрос состоит не в том …, а в том … is an analytic frame", "нужна ли = whether it's needed", "за её сохранение = for keeping it"],
      },
      {
        russian: "Легитимность не сводится к формальному наличию закона.",
        romanization: "Legitimnost ne svoditsya k formalnomu nalichiyu zakona.",
        en: "Legitimacy does not reduce to the formal presence of law.",
        vi: "Tính chính danh không thể quy về sự tồn tại hình thức của luật.",
        pronunciation_focus: ["не сводится к + tặng cách = không quy về", "формальное наличие = sự tồn tại hình thức", "phân biệt hợp pháp / chính danh"],
        pronunciation_focus_en: ["не сводится к + dative = does not reduce to", "формальное наличие = formal presence", "distinguishes legality from legitimacy"],
      },
      {
        russian: "Доверие чаще исчезает не из-за одного события, а через повторение мелких несоответствий.",
        romanization: "Doveriye chashche ischezayet ne iz-za odnogo sobytiya, a cherez povtoreniye melkikh nesootvetstviy.",
        en: "Trust more often disappears not from a single event, but through the repetition of small inconsistencies.",
        vi: "Niềm tin thường mất không phải vì một sự kiện, mà qua sự lặp lại của những lệch lạc nhỏ.",
        pronunciation_focus: ["не из-за …, а через … nhấn cơ chế thật", "несоответствий là sinh cách số nhiều", "повторение мелких = sự lặp lại những điều nhỏ"],
        pronunciation_focus_en: ["не из-за …, а через … highlights the real mechanism", "несоответствий is genitive plural", "повторение мелких = repetition of small things"],
      },
    ],
    vocabulary: [
      { cell_id: "2a26db08-aafd-4c94-a0a3-0c660b1169d9", word: "стабильность", romanization: "stabilnost", en: "stability (often politically loaded)", vi: "ổn định (thường mang hàm ý chính trị)", pos: "noun", pronunciation_vi: "sta-BIL-nast", pronunciation_en: "sta-BEEL-nost" },
      { cell_id: "769bfc21-5e73-4679-a848-466e6725a96a", word: "легитимность", romanization: "legitimnost", en: "legitimacy", vi: "tính chính danh", pos: "noun", pronunciation_vi: "le-gi-TIM-nast", pronunciation_en: "le-gee-TEEM-nost" },
      { cell_id: "f1a398e8-dad7-418d-89df-4be08d69006e", word: "сводиться к", romanization: "svoditsya k", en: "to reduce to", vi: "quy về", pos: "verb", pronunciation_vi: "SVO-dit-sya k", pronunciation_en: "SVO-deet-sya k" },
      { cell_id: "f3032214-ec0d-4df2-bd8f-3a359b7c3234", word: "несоответствие", romanization: "nesootvetstviye", en: "inconsistency / mismatch", vi: "sự lệch lạc / không khớp", pos: "noun", pronunciation_vi: "ne-sa-at-VYET-stvi-ye", pronunciation_en: "nye-sa-at-VYET-stvee-ye" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga, giữ giọng phân tích.",
        instruction_en: "Translate into Russian, keeping the analytic tone.",
        items: [
          { prompt: "Câu hỏi không phải là có cần hay không, mà là ai trả giá.", answer: "Вопрос состоит не в том, нужно ли это, а в том, кто за это платит." },
          { prompt: "Tính chính danh không thể quy về sự tồn tại hình thức của luật.", answer: "Легитимность не сводится к формальному наличию закона." },
        ],
      },
    ],
    cultural_notes_vi:
      "Khung `вопрос состоит не в том…, а в том…` là dấu hiệu diễn ngôn người có học: chuyển câu hỏi từ `có/không` sang `ai, bằng giá nào`. Nó tránh tuyệt đối hóa.",
    cultural_notes_en:
      "The frame `вопрос состоит не в том…, а в том…` marks educated discourse: it shifts the question from `yes/no` to `who, at what cost`. It avoids absolutes.",
    tip_advice_vi:
      "Với khái niệm trừu tượng, đừng dịch thẳng. Hỏi: từ này phục vụ cho ai, ai trả giá, đúng trên giấy hay đúng thực tế.",
    tip_advice_en:
      "With abstract concepts, don't translate flatly. Ask: whom does this word serve, who pays, is it true on paper or in practice.",
  },
  {
    id: "russian_c2_writing_essay_moves",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Các động tác viết — đóng khung, giới hạn, kết luận mở rộng",
    title_en: "C2: Essay moves — framing, hedging, widening conclusions",
    intro_vi:
      "Văn viết C2 không chỉ đúng ngữ pháp. Nó đóng khung vấn đề thật, tách sự kiện khỏi đánh giá, giới hạn lời khẳng định, và kết bằng góc nhìn rộng hơn — không lặp lại.",
    intro_en:
      "C2 writing isn't just correct. It frames the real question, separates fact from evaluation, hedges claims, and closes with a wider perspective — not repetition.",
    sentences: [
      {
        russian: "Вопрос не в том, полезны ли технологии, а в том, как они меняют саму задачу.",
        romanization: "Vopros ne v tom, polezny li tekhnologii, a v tom, kak oni menyayut samu zadachu.",
        en: "The question is not whether technologies are useful, but how they change the task itself.",
        vi: "Vấn đề không phải là công nghệ có hữu ích không, mà là chúng thay đổi chính bài toán như thế nào.",
        pronunciation_focus: ["вопрос не в том …, а в том … đóng khung vấn đề thật", "полезны ли = có hữu ích không", "саму задачу = chính bài toán"],
        pronunciation_focus_en: ["вопрос не в том …, а в том … frames the real issue", "полезны ли = whether they're useful", "саму задачу = the task itself"],
      },
      {
        russian: "Следует различать сам факт, его интерпретацию и его оценку.",
        romanization: "Sleduyet razlichat sam fakt, yego interpretatsiyu i yego otsenku.",
        en: "One should distinguish the fact itself, its interpretation, and its evaluation.",
        vi: "Cần phân biệt bản thân sự kiện, cách diễn giải nó, và sự đánh giá nó.",
        pronunciation_focus: ["следует различать = cần phân biệt", "факт / интерпретация / оценка là ba lớp", "сам факт = bản thân sự kiện"],
        pronunciation_focus_en: ["следует различать = one should distinguish", "факт / интерпретация / оценка are three layers", "сам факт = the fact itself"],
      },
      {
        russian: "Скорее всего, эффект зависит от контекста, а не от технологии как таковой.",
        romanization: "Skoreye vsego, effekt zavisit ot konteksta, a ne ot tekhnologii kak takovoy.",
        en: "Most likely, the effect depends on context, not on the technology as such.",
        vi: "Nhiều khả năng, hiệu ứng phụ thuộc vào bối cảnh, chứ không phải bản thân công nghệ.",
        pronunciation_focus: ["скорее всего là cụm giới hạn (hedge)", "зависит от + sinh cách", "как таковой = như bản thân nó"],
        pronunciation_focus_en: ["скорее всего is a hedging chunk", "зависит от + genitive", "как таковой = as such"],
      },
      {
        russian: "В конечном счёте, дело не столько в инструменте, сколько в способности им управлять.",
        romanization: "V konechnom schyote, delo ne stolko v instrumente, skolko v sposobnosti im upravlyat.",
        en: "Ultimately, it is not so much about the tool as about the ability to manage it.",
        vi: "Xét cho cùng, vấn đề không nằm ở công cụ cho bằng ở khả năng điều khiển nó.",
        pronunciation_focus: ["в конечном счёте mở kết luận rộng", "не столько …, сколько … = không … cho bằng …", "им управлять = điều khiển nó (công cụ cách)"],
        pronunciation_focus_en: ["в конечном счёте opens a wide conclusion", "не столько …, сколько … = not so much … as …", "им управлять = to manage it (instrumental)"],
      },
    ],
    vocabulary: [
      { cell_id: "38ac5086-05f3-4d54-83aa-073ab2874ff4", word: "вопрос не в том, … а в том", romanization: "vopros ne v tom, … a v tom", en: "the question is not …, but …", vi: "vấn đề không phải là …, mà là …", pos: "phrase", pronunciation_vi: "va-PROS ne f tom … a f tom", pronunciation_en: "va-PROS nye f tom … a f tom" },
      { cell_id: "5207f031-f1c9-44a3-9829-eaaed9dac6df", word: "различать", romanization: "razlichat", en: "to distinguish", vi: "phân biệt", pos: "verb", pronunciation_vi: "raz-li-CHAT", pronunciation_en: "raz-lee-CHAT" },
      { cell_id: "9b12c37d-c9b0-4a4f-baac-98417fd2d177", word: "скорее всего", romanization: "skoreye vsego", en: "most likely (hedge)", vi: "nhiều khả năng", pos: "phrase", pronunciation_vi: "ska-RYE-ye vsye-VO", pronunciation_en: "ska-RYE-ye vsye-VO" },
      { cell_id: "c14dcf9b-feef-4f22-8e03-c37be0e9963e", word: "не столько …, сколько …", romanization: "ne stolko …, skolko …", en: "not so much … as …", vi: "không … cho bằng …", pos: "phrase", pronunciation_vi: "ne STOL-ka … SKOL-ka", pronunciation_en: "nye STOL-ko … SKOL-ko" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga, giữ động tác viết.",
        instruction_en: "Translate into Russian, keeping the essay move.",
        items: [
          { prompt: "Cần phân biệt sự kiện, cách diễn giải và sự đánh giá.", answer: "Следует различать сам факт, его интерпретацию и его оценку." },
          { prompt: "Xét cho cùng, vấn đề không nằm ở công cụ cho bằng ở khả năng dùng nó.", answer: "В конечном счёте, дело не столько в инструменте, сколько в способности им пользоваться." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm giới hạn (hedge).",
        instruction_en: "Insert the hedging phrase.",
        items: [{ prompt: "_____, эффект зависит от контекста.", answer: "Скорее всего" }],
      },
    ],
    cultural_notes_vi:
      "Kết bài C2 nên mở rộng góc nhìn, không tóm tắt lại thân bài. `В конечном счёте, дело не столько… сколько…` nâng kết luận lên một tầng cao hơn.",
    cultural_notes_en:
      "A C2 conclusion should widen the view, not summarize the body. `В конечном счёте, дело не столько… сколько…` lifts the conclusion to a higher level.",
    tip_advice_vi:
      "Trước khi viết, gán vai cho từng đoạn: đoạn nào đóng khung, đoạn nào nêu phản biện, đoạn nào kết. Đừng chỉ dịch câu tiếng Việt nối nhau.",
    tip_advice_en:
      "Before writing, assign each paragraph a role: which frames, which counters, which concludes. Don't just translate Vietnamese sentences in a row.",
  },
  {
    id: "russian_c2_speaking_debate_concession",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Nói trong tranh luận — nhượng bộ rồi phản bác",
    title_en: "C2: Debate speaking — concede then rebut",
    intro_vi:
      "Người nói C2 không trả lời cực đoan. Họ xác định phạm vi, thừa nhận một phần (`я частично согласен`), rồi phản bác và kết bằng phương án thực tế.",
    intro_en:
      "C2 speakers avoid extreme answers. They set the scope, concede in part (`я частично согласен`), then rebut and close with a practical conclusion.",
    sentences: [
      {
        russian: "Позвольте обозначить рамки вопроса, прежде чем отвечать.",
        romanization: "Pozvolte oboznachit ramki voprosa, prezhde chem otvechat.",
        en: "Let me define the scope of the question before answering.",
        vi: "Cho phép tôi xác định phạm vi vấn đề trước khi trả lời.",
        pronunciation_focus: ["позвольте обозначить рамки là khung mở lịch sự", "прежде чем + nguyên mẫu = trước khi", "рамки вопроса = phạm vi vấn đề"],
        pronunciation_focus_en: ["позвольте обозначить рамки is a polite opening frame", "прежде чем + infinitive = before", "рамки вопроса = the scope of the question"],
      },
      {
        russian: "Я готов признать, что без личных усилий прогресса не будет.",
        romanization: "Ya gotov priznat, chto bez lichnykh usiliy progressa ne budet.",
        en: "I'm ready to admit that without personal effort there will be no progress.",
        vi: "Tôi sẵn sàng thừa nhận rằng không có nỗ lực cá nhân thì sẽ không có tiến bộ.",
        pronunciation_focus: ["я готов признать là nhượng bộ có kiểm soát", "без личных усилий là sinh cách", "прогресса не будет = sẽ không có tiến bộ"],
        pronunciation_focus_en: ["я готов признать is a controlled concession", "без личных усилий is genitive", "прогресса не будет = there'll be no progress"],
      },
      {
        russian: "Однако из этого не следует, что вся ответственность лежит на работнике.",
        romanization: "Odnako iz etogo ne sleduyet, chto vsya otvetstvennost lezhit na rabotnike.",
        en: "However, it does not follow that all responsibility lies with the worker.",
        vi: "Tuy nhiên, từ đó không suy ra rằng toàn bộ trách nhiệm thuộc về người lao động.",
        pronunciation_focus: ["из этого не следует, что là phản bác sắc", "ответственность лежит на + giới cách", "однако trang trọng"],
        pronunciation_focus_en: ["из этого не следует, что is a sharp rebuttal", "ответственность лежит на + prepositional", "однако is formal"],
      },
      {
        russian: "Практический вывод состоит в том, что нужен разумный компромисс.",
        romanization: "Prakticheskiy vyvod sostoit v tom, chto nuzhen razumnyy kompromiss.",
        en: "The practical conclusion is that a reasonable compromise is needed.",
        vi: "Kết luận thực tế là cần một sự thỏa hiệp hợp lý.",
        pronunciation_focus: ["практический вывод состоит в том đóng bài nói", "разумный компромисс = thỏa hiệp hợp lý", "нужен dạng giống đực"],
        pronunciation_focus_en: ["практический вывод состоит в том closes the speech", "разумный компромисс = reasonable compromise", "нужен agrees masculine"],
      },
    ],
    vocabulary: [
      { cell_id: "4893149e-33da-4c82-b64a-b804d153a6bc", word: "обозначить рамки", romanization: "oboznachit ramki", en: "to define the scope", vi: "xác định phạm vi", pos: "verb phrase", pronunciation_vi: "a-baz-NA-chit RAM-ki", pronunciation_en: "a-boz-NA-cheet RAM-kee" },
      { cell_id: "b90c9f89-22a5-476c-87d4-895f0f86e587", word: "я частично согласен", romanization: "ya chastichno soglasen", en: "I partly agree", vi: "tôi đồng ý một phần", pos: "phrase", pronunciation_vi: "ya chas-TICH-na sa-GLA-sen", pronunciation_en: "ya chas-TEECH-no sa-GLA-syen" },
      { cell_id: "b025ac02-c73d-40cf-9080-7c5f87d4520e", word: "из этого не следует, что", romanization: "iz etogo ne sleduyet, chto", en: "it does not follow that", vi: "từ đó không suy ra rằng", pos: "phrase", pronunciation_vi: "iz E-ta-va ne SLYE-du-yet shto", pronunciation_en: "eez EH-ta-va nye SLYE-doo-yet shto" },
      { cell_id: "d33f52e7-5072-4871-ad89-1f9f349eb216", word: "разумный компромисс", romanization: "razumnyy kompromiss", en: "reasonable compromise", vi: "thỏa hiệp hợp lý", pos: "noun phrase", pronunciation_vi: "ra-ZUM-ny kam-pra-MISS", pronunciation_en: "ra-ZOOM-ny kom-pro-MEESS" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga, giữ trật tự nhượng bộ → phản bác.",
        instruction_en: "Translate into Russian, keeping the concession → rebuttal order.",
        items: [
          { prompt: "Tôi sẵn sàng thừa nhận rằng không có nỗ lực thì không có tiến bộ.", answer: "Я готов признать, что без усилий прогресса не будет." },
          { prompt: "Tuy nhiên, từ đó không suy ra rằng mọi trách nhiệm thuộc về người lao động.", answer: "Однако из этого не следует, что вся ответственность лежит на работнике." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phản bác sau nhượng bộ.",
        instruction_en: "Insert the rebuttal phrase after the concession.",
        items: [{ prompt: "Я частично согласен. Однако _____ , что проблема только в этом.", answer: "из этого не следует" }],
      },
    ],
    cultural_notes_vi:
      "Trật tự `nhượng bộ → phản bác → kết luận thực tế` nghe chín chắn hơn là phản đối ngay. Thừa nhận một phần trước khiến phản bác của bạn khó bác lại.",
    cultural_notes_en:
      "The order `concede → rebut → practical conclusion` sounds more mature than immediate disagreement. Granting part first makes your rebuttal harder to dismiss.",
    tip_advice_vi:
      "Dưới áp lực hoặc câu hỏi gây hấn, đừng tuyệt đối hóa. `Я частично согласен, однако…` giữ bình tĩnh và giữ thế.",
    tip_advice_en:
      "Under pressure or hostile questions, don't go absolute. `Я частично согласен, однако…` keeps you calm and keeps your position.",
  },
];

export default lessons;
