// src/languages/russian/lessons-c1-reading-listening.ts
//
// C1 Russian reading + listening batch, converted from the local
// Vietnamese-Russian archive:
//   c1-academic-reading-course.md, c1-listening-course.md,
//   academic-journal-reader.md, advanced-dialogues-001-100.md,
//   advanced-dialogues-101-200.md, native-speed-news-academy.md.
//
// Focus: academic texts, news, interviews/lectures/podcasts, discourse
// markers, and inference. Vietnamese is the default learner support layer;
// English explanations sit alongside for a future native_language toggle.
//
// Native review is deferred — this ships as study support, not final
// authority. `pronunciation_focus` carries reading/listening focus cues at
// this level (discourse function, inference, stance), not phonics drills.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_c1_reading_scientific_method",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Đọc học thuật — phương pháp khoa học (luận điểm/bằng chứng/giới hạn)",
    title_en: "C1: Academic reading — the scientific method (claim/evidence/limitation)",
    intro_vi:
      "Đọc C1 không phải là tra từ khó, mà là nhận ra chức năng từng câu: câu nào nêu luận điểm, câu nào đưa bằng chứng, câu nào giới hạn kết luận.",
    intro_en:
      "C1 reading is not about hunting hard words; it is about tracking each sentence's function: which states the claim, which gives evidence, which narrows the conclusion.",
    sentences: [
      {
        russian: "Современная наука строится не только на фактах, но и на проверяемых гипотезах.",
        romanization: "Sovremennaya nauka stroitsya ne tolko na faktakh, no i na proveryayemykh gipotezakh.",
        en: "Modern science is built not only on facts but also on testable hypotheses.",
        vi: "Khoa học hiện đại không chỉ dựa trên sự kiện mà còn trên các giả thuyết có thể kiểm chứng.",
        pronunciation_focus: ["luận điểm chính của đoạn", "не только… но и… = không chỉ… mà còn", "khung tương phản fact ↔ hypothesis"],
        pronunciation_focus_en: ["the paragraph's main claim", "не только… но и… = not only… but also", "fact ↔ hypothesis contrast frame"],
      },
      {
        russian: "Исследователь формулирует вопрос, собирает данные и признаёт ограничения своего метода.",
        romanization: "Issledovatel formuliruyet vopros, sobirayet dannye i priznayot ogranicheniya svoyego metoda.",
        en: "The researcher formulates a question, gathers data, and acknowledges the limits of the method.",
        vi: "Nhà nghiên cứu đặt câu hỏi, thu thập dữ liệu và thừa nhận giới hạn của phương pháp.",
        pronunciation_focus: ["câu mô tả quy trình (evidence)", "признаёт ограничения = thừa nhận giới hạn", "chuỗi động từ liệt kê các bước"],
        pronunciation_focus_en: ["a process sentence (evidence)", "признаёт ограничения = acknowledges limits", "verb chain listing steps"],
      },
      {
        russian: "Однако следует учитывать, что новые доказательства могут изменить выводы.",
        romanization: "Odnako sleduyet uchityvat, chto novye dokazatelstva mogut izmenit vyvody.",
        en: "However, one must consider that new evidence can change the conclusions.",
        vi: "Tuy nhiên cần lưu ý rằng bằng chứng mới có thể thay đổi kết luận.",
        pronunciation_focus: ["однако báo hiệu giới hạn/đối lập", "следует учитывать = cần lưu ý", "đây là câu caveat, không phải luận điểm"],
        pronunciation_focus_en: ["однако signals a limit/contrast", "следует учитывать = one must consider", "this is the caveat sentence, not the claim"],
      },
      {
        russian: "Из этого следует, что наука — это процесс, а не набор готовых истин.",
        romanization: "Iz etogo sleduyet, chto nauka — eto protsess, a ne nabor gotovykh istin.",
        en: "From this it follows that science is a process, not a set of ready-made truths.",
        vi: "Từ đó suy ra rằng khoa học là một quá trình, không phải tập hợp các chân lý có sẵn.",
        pronunciation_focus: ["из этого следует = câu kết luận", "а не… đặt tương phản cuối cùng", "đây là câu nên diễn đạt lại bằng lời mình"],
        pronunciation_focus_en: ["из этого следует = the concluding sentence", "а не… sets the final contrast", "this is the sentence to paraphrase"],
      },
    ],
    vocabulary: [
      { cell_id: "7591cb60-151f-47a0-b983-5bc380771722", word: "проверяемая гипотеза", romanization: "proveryayemaya gipoteza", en: "testable hypothesis", vi: "giả thuyết có thể kiểm chứng", pos: "noun phrase", pronunciation_vi: "pra-vye-RYA-ye-ma-ya gi-PO-te-za", pronunciation_en: "pra-vye-RYA-ye-ma-ya gee-PO-te-za" },
      { cell_id: "81f9de84-1247-40a4-a146-a0720af845bd", word: "ограничения метода", romanization: "ogranicheniya metoda", en: "limits of the method", vi: "giới hạn của phương pháp", pos: "noun phrase", pronunciation_vi: "a-gra-ni-CHE-ni-ya ME-ta-da", pronunciation_en: "a-gra-nee-CHE-nee-ya ME-ta-da" },
      { cell_id: "07ded539-458b-42f1-a2de-f28e09a7e518", word: "доказательства", romanization: "dokazatelstva", en: "evidence / proof", vi: "bằng chứng", pos: "noun (pl.)", pronunciation_vi: "da-ka-ZA-tel-stva", pronunciation_en: "da-ka-ZA-tel-stva" },
      { cell_id: "b510d818-2dc2-4397-b265-ea147f42e017", word: "однако", romanization: "odnako", en: "however", vi: "tuy nhiên", pos: "discourse marker", pronunciation_vi: "ad-NA-ka", pronunciation_en: "ad-NA-ka" },
      { cell_id: "1fa7eef5-e9b8-4394-b1d4-e27601b84dd4", word: "из этого следует", romanization: "iz etogo sleduyet", en: "from this it follows", vi: "từ đó suy ra", pos: "phrase", pronunciation_vi: "iz E-ta-va SLE-du-yet", pronunciation_en: "iz E-ta-va SLE-doo-yet" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối khung học thuật với chức năng của nó.",
        instruction_en: "Match the academic frame with its function.",
        items: [
          { prompt: "Автор утверждает, что…", answer: "nêu luận điểm chính" },
          { prompt: "Данные показывают…", answer: "đưa bằng chứng" },
          { prompt: "Однако следует учитывать, что…", answer: "đánh dấu giới hạn" },
          { prompt: "Из этого следует, что…", answer: "rút ra kết luận" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối báo hiệu giới hạn của lập luận.",
        instruction_en: "Fill in the connector that signals a limitation.",
        items: [{ prompt: "Наука полезна, _____ её выводы могут меняться.", answer: "однако" }],
      },
    ],
    cultural_notes_vi:
      "Văn bản học thuật Nga thường đặt giới hạn ngay sau khi nêu luận điểm. Nhận diện `однако`, `следует учитывать`, `из этого следует` giúp bạn theo dõi lập luận thay vì sa vào từng từ.",
    cultural_notes_en:
      "Russian academic texts often place the limitation right after the claim. Spotting `однако`, `следует учитывать`, `из этого следует` lets you follow the argument instead of getting lost word by word.",
    tip_advice_vi:
      "Đọc theo khung 4 câu: luận điểm → bằng chứng → giới hạn → kết luận. Trước khi trả lời, hãy tóm tắt mỗi câu bằng một động từ học thuật.",
    tip_advice_en:
      "Read in a four-move frame: claim → evidence → limitation → conclusion. Before answering, label each sentence with one academic verb.",
  },
  {
    id: "russian_c1_reading_weather_vs_climate",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Đọc suy luận — phân biệt thời tiết và khí hậu",
    title_en: "C1: Inference reading — distinguishing weather from climate",
    intro_vi:
      "Tác giả không nói trực tiếp 'đừng vội kết luận', mà gợi ý qua tương phản ngắn hạn / dài hạn. Đọc C1 là đọc được hàm ý đó.",
    intro_en:
      "The author never says 'do not rush to conclusions' outright; the warning lives in a short-term vs long-term contrast. C1 reading means catching that implication.",
    sentences: [
      {
        russian: "Климатические исследования требуют долгосрочных наблюдений.",
        romanization: "Klimaticheskiye issledovaniya trebuyut dolgosrochnykh nablyudeniy.",
        en: "Climate research requires long-term observation.",
        vi: "Nghiên cứu khí hậu đòi hỏi quan sát dài hạn.",
        pronunciation_focus: ["câu nền tảng đặt điều kiện", "долгосрочные = dài hạn", "наблюдения = quan sát"],
        pronunciation_focus_en: ["a framing sentence setting the condition", "долгосрочные = long-term", "наблюдения = observation"],
      },
      {
        russian: "Один год аномальной погоды не доказывает глобальную тенденцию.",
        romanization: "Odin god anomalnoy pogody ne dokazyvayet globalnuyu tendentsiyu.",
        en: "One year of abnormal weather does not prove a global trend.",
        vi: "Một năm thời tiết bất thường không chứng minh được xu hướng toàn cầu.",
        pronunciation_focus: ["hàm ý: cẩn trọng với kết luận vội", "не доказывает = không chứng minh", "погода ≠ тенденция"],
        pronunciation_focus_en: ["implication: be wary of hasty conclusions", "не доказывает = does not prove", "погода ≠ тенденция"],
      },
      {
        russian: "Десятилетия данных позволяют увидеть устойчивые изменения.",
        romanization: "Desyatiletiya dannykh pozvolyayut uvidet ustoychivye izmeneniya.",
        en: "Decades of data make it possible to see stable changes.",
        vi: "Dữ liệu hàng thập kỷ cho phép nhìn thấy những thay đổi bền vững.",
        pronunciation_focus: ["câu đối lập với câu trước", "устойчивые изменения = thay đổi ổn định", "позволяют увидеть = cho phép thấy"],
        pronunciation_focus_en: ["contrasts with the previous sentence", "устойчивые изменения = stable changes", "позволяют увидеть = make it possible to see"],
      },
      {
        russian: "Поэтому учёные различают погоду и климат.",
        romanization: "Poetomu uchyonye razlichayut pogodu i klimat.",
        en: "Therefore scientists distinguish weather from climate.",
        vi: "Vì vậy các nhà khoa học phân biệt thời tiết và khí hậu.",
        pronunciation_focus: ["поэтому = câu kết luận logic", "различают = phân biệt", "đây là ý chính cần paraphrase"],
        pronunciation_focus_en: ["поэтому = a logical conclusion", "различают = distinguish", "this is the key point to paraphrase"],
      },
    ],
    vocabulary: [
      { cell_id: "c4e074e1-d31e-40bc-822c-792dba6d9141", word: "долгосрочные наблюдения", romanization: "dolgosrochnye nablyudeniya", en: "long-term observation", vi: "quan sát dài hạn", pos: "noun phrase", pronunciation_vi: "dal-ga-SROCH-nye nab-lyu-DE-ni-ya", pronunciation_en: "dal-ga-SROCH-nye nab-lyoo-DE-nee-ya" },
      { cell_id: "1c303e7c-e4f6-4eda-b711-8294d3e38012", word: "тенденция", romanization: "tendentsiya", en: "trend", vi: "xu hướng", pos: "noun", pronunciation_vi: "ten-DEN-tsi-ya", pronunciation_en: "ten-DEN-tsee-ya" },
      { cell_id: "0f1c819b-acce-449e-8447-0bd5e9184e87", word: "устойчивые изменения", romanization: "ustoychivye izmeneniya", en: "stable changes", vi: "thay đổi bền vững", pos: "noun phrase", pronunciation_vi: "us-TOY-chi-vye iz-me-NE-ni-ya", pronunciation_en: "us-TOY-chee-vye iz-me-NE-nee-ya" },
      { cell_id: "9baae525-628b-4461-a396-c0ce679967fd", word: "различать", romanization: "razlichat", en: "to distinguish", vi: "phân biệt", pos: "verb", pronunciation_vi: "raz-li-CHAT", pronunciation_en: "raz-lee-CHAT" },
      { cell_id: "9dfbc4df-bd7a-4abe-b1df-426f74ab9b25", word: "поэтому", romanization: "poetomu", en: "therefore", vi: "vì vậy", pos: "discourse marker", pronunciation_vi: "pa-E-ta-mu", pronunciation_en: "pa-E-ta-moo" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Suy luận: câu nào nêu cảnh báo ngầm về kết luận vội vàng?",
        instruction_en: "Inference: which sentence carries the implicit warning against hasty conclusions?",
        items: [{ prompt: "Câu khóa: «Один год … не _____ глобальную тенденцию.»", answer: "доказывает" }],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Vì vậy các nhà khoa học phân biệt thời tiết và khí hậu.", answer: "Поэтому учёные различают погоду и климат." },
        ],
      },
    ],
    cultural_notes_vi:
      "Văn học thuật thường cảnh báo gián tiếp bằng cách đặt một ví dụ ngắn hạn cạnh dữ liệu dài hạn. Hàm ý nằm ở tương phản, không ở một câu mệnh lệnh.",
    cultural_notes_en:
      "Academic writing often warns indirectly by placing a short-term example beside long-term data. The implication lives in the contrast, not in a command.",
    tip_advice_vi:
      "Khi gặp một con số hoặc ví dụ đơn lẻ, hỏi: tác giả dùng nó để chứng minh hay để cảnh báo? `не доказывает` thường là dấu hiệu cảnh báo.",
    tip_advice_en:
      "When you meet a single figure or example, ask: is the author proving or cautioning with it? `не доказывает` is usually a cautioning signal.",
  },
  {
    id: "russian_c1_reading_inflation_households",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Đọc kinh tế — lạm phát và sức mua hộ gia đình",
    title_en: "C1: Economics reading — inflation and household purchasing power",
    intro_vi:
      "Bài đọc kinh tế C1 nối nguyên nhân với hệ quả qua nhiều chủ thể (hộ gia đình, nhà nước). Theo dõi chuỗi nhân–quả là kỹ năng chính.",
    intro_en:
      "C1 economics reading links cause to consequence across actors (households, the state). Following the cause–effect chain is the core skill.",
    sentences: [
      {
        russian: "Инфляция означает устойчивый рост общего уровня цен.",
        romanization: "Inflyatsiya oznachayet ustoychivy rost obshchego urovnya tsen.",
        en: "Inflation means a sustained rise in the general price level.",
        vi: "Lạm phát nghĩa là sự gia tăng bền vững của mặt bằng giá chung.",
        pronunciation_focus: ["câu định nghĩa thuật ngữ", "устойчивый рост = tăng bền vững", "уровень цен = mặt bằng giá"],
        pronunciation_focus_en: ["a term-definition sentence", "устойчивый рост = sustained rise", "уровень цен = price level"],
      },
      {
        russian: "Для домохозяйств она снижает покупательную способность доходов.",
        romanization: "Dlya domokhozyaystv ona snizhayet pokupatelnuyu sposobnost dokhodov.",
        en: "For households it reduces the purchasing power of incomes.",
        vi: "Đối với hộ gia đình, nó làm giảm sức mua của thu nhập.",
        pronunciation_focus: ["hệ quả #1, theo chủ thể", "покупательная способность = sức mua", "для + sinh cách (домохозяйств)"],
        pronunciation_focus_en: ["consequence #1, by actor", "покупательная способность = purchasing power", "для + genitive (домохозяйств)"],
      },
      {
        russian: "Особенно если зарплаты растут медленнее цен.",
        romanization: "Osobenno yesli zarplaty rastut medlenneye tsen.",
        en: "Especially if wages grow more slowly than prices.",
        vi: "Nhất là khi lương tăng chậm hơn giá.",
        pronunciation_focus: ["điều kiện làm hệ quả nặng hơn", "медленнее цен = chậm hơn giá (so sánh)", "особенно если = nhất là khi"],
        pronunciation_focus_en: ["a condition that worsens the effect", "медленнее цен = slower than prices (comparison)", "особенно если = especially if"],
      },
      {
        russian: "Для государства инфляция создаёт сложный выбор между поддержкой экономики и ограничением спроса.",
        romanization: "Dlya gosudarstva inflyatsiya sozdayot slozhny vybor mezhdu podderzhkoy ekonomiki i ogranicheniyem sprosa.",
        en: "For the state, inflation creates a difficult choice between supporting the economy and restraining demand.",
        vi: "Đối với nhà nước, lạm phát tạo ra lựa chọn khó giữa hỗ trợ kinh tế và hạn chế nhu cầu.",
        pronunciation_focus: ["hệ quả #2, chủ thể khác (nhà nước)", "выбор между… и… = lựa chọn giữa… và…", "ограничение спроса = hạn chế cầu"],
        pronunciation_focus_en: ["consequence #2, a different actor (the state)", "выбор между… и… = a choice between… and…", "ограничение спроса = restraining demand"],
      },
    ],
    vocabulary: [
      { cell_id: "2e97b89e-83c2-4b25-acc1-85d6c7befb3b", word: "покупательная способность", romanization: "pokupatelnaya sposobnost", en: "purchasing power", vi: "sức mua", pos: "noun phrase", pronunciation_vi: "pa-ku-PA-tel-na-ya spa-SOB-nast", pronunciation_en: "pa-ku-PA-tel-na-ya spa-SOB-nast" },
      { cell_id: "1de4bf16-958e-4d4a-8b3c-597d8be5573f", word: "домохозяйство", romanization: "domokhozyaystvo", en: "household", vi: "hộ gia đình", pos: "noun", pronunciation_vi: "da-ma-kha-ZYAY-stva", pronunciation_en: "da-ma-kha-ZYAY-stva" },
      { cell_id: "a6176a1d-b515-4f44-a4a9-183bcafd22d7", word: "ограничение спроса", romanization: "ogranicheniye sprosa", en: "restraining demand", vi: "hạn chế nhu cầu", pos: "noun phrase", pronunciation_vi: "a-gra-ni-CHE-ni-ye SPRO-sa", pronunciation_en: "a-gra-nee-CHE-nee-ye SPRO-sa" },
      { cell_id: "1839ecce-80b3-43f3-83c2-c2ec04d9e4a0", word: "уровень цен", romanization: "uroven tsen", en: "price level", vi: "mặt bằng giá", pos: "noun phrase", pronunciation_vi: "U-ra-ven tsen", pronunciation_en: "OO-ra-ven tsen" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối chủ thể với hệ quả của lạm phát.",
        instruction_en: "Match each actor with the consequence of inflation.",
        items: [
          { prompt: "домохозяйства", answer: "снижение покупательной способности" },
          { prompt: "государство", answer: "сложный выбор политики" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Lạm phát làm giảm sức mua của thu nhập.", answer: "Инфляция снижает покупательную способность доходов." },
        ],
      },
    ],
    cultural_notes_vi:
      "Bài đọc kinh tế thường tách hệ quả theo từng chủ thể. Đừng gộp tất cả thành 'lạm phát xấu' — hãy ghi rõ ai chịu hệ quả gì.",
    cultural_notes_en:
      "Economics passages usually split consequences by actor. Don't collapse everything into 'inflation is bad' — note who bears which effect.",
    tip_advice_vi:
      "Vẽ một bảng hai cột: chủ thể | hệ quả. Cấu trúc `для + chủ thể` thường mở đầu mỗi hệ quả.",
    tip_advice_en:
      "Sketch a two-column table: actor | consequence. The `для + actor` structure usually opens each consequence.",
  },
  {
    id: "russian_c1_reading_employment_quality",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Đọc phản biện — số lượng việc làm và chất lượng việc làm",
    title_en: "C1: Critical reading — quantity vs quality of employment",
    intro_vi:
      "Tác giả thách thức một giả định phổ biến: 'có việc là tốt'. Đọc C1 cần nhận ra khi tác giả lật ngược một niềm tin quen thuộc.",
    intro_en:
      "The author challenges a common assumption: 'having a job is good.' C1 reading means noticing when the author overturns a familiar belief.",
    sentences: [
      {
        russian: "Рынок труда отражает не только количество рабочих мест, но и качество занятости.",
        romanization: "Rynok truda otrazhayet ne tolko kolichestvo rabochikh mest, no i kachestvo zanyatosti.",
        en: "The labor market reflects not only the number of jobs but also the quality of employment.",
        vi: "Thị trường lao động phản ánh không chỉ số lượng việc làm mà còn chất lượng việc làm.",
        pronunciation_focus: ["luận điểm: mở rộng tiêu chí đánh giá", "количество ↔ качество = số lượng ↔ chất lượng", "не только… но и…"],
        pronunciation_focus_en: ["claim: it widens the criterion", "количество ↔ качество = quantity ↔ quality", "не только… но и…"],
      },
      {
        russian: "Высокая занятость может скрывать низкие зарплаты и нестабильные контракты.",
        romanization: "Vysokaya zanyatost mozhet skryvat nizkiye zarplaty i nestabilnye kontrakty.",
        en: "High employment can hide low wages and unstable contracts.",
        vi: "Tỷ lệ có việc cao có thể che giấu lương thấp và hợp đồng bấp bênh.",
        pronunciation_focus: ["может скрывать = dấu hiệu phản biện", "đảo ngược giả định 'việc nhiều là tốt'", "нестабильные контракты = hợp đồng không ổn định"],
        pronunciation_focus_en: ["может скрывать = a counter-claim signal", "overturns 'more jobs = good'", "нестабильные контракты = unstable contracts"],
      },
      {
        russian: "Поэтому экономисты анализируют не просто наличие работы, а её устойчивость.",
        romanization: "Poetomu ekonomisty analiziruyut ne prosto nalichiye raboty, a yeyo ustoychivost.",
        en: "Therefore economists analyze not merely the existence of work, but its stability.",
        vi: "Vì vậy các nhà kinh tế phân tích không chỉ việc có việc làm, mà sự ổn định của nó.",
        pronunciation_focus: ["не просто… а… = không phải… mà là…", "câu kết luận chuyển trọng tâm", "устойчивость = tính bền vững"],
        pronunciation_focus_en: ["не просто… а… = not merely… but…", "the conclusion shifts the focus", "устойчивость = stability"],
      },
      {
        russian: "Иными словами, важно не только иметь работу, но и не терять защиту.",
        romanization: "Inymi slovami, vazhno ne tolko imet rabotu, no i ne teryat zashchitu.",
        en: "In other words, it matters not only to have work but also not to lose protection.",
        vi: "Nói cách khác, quan trọng không chỉ là có việc mà còn là không mất sự bảo vệ.",
        pronunciation_focus: ["иными словами = diễn giải lại ý", "câu này tóm tắt cho người đọc", "защита = bảo trợ/bảo vệ"],
        pronunciation_focus_en: ["иными словами = a restatement marker", "this sentence summarizes for the reader", "защита = protection"],
      },
    ],
    vocabulary: [
      { cell_id: "9a447c0e-d2b7-41b2-b5f1-32009f2f72ad", word: "качество занятости", romanization: "kachestvo zanyatosti", en: "quality of employment", vi: "chất lượng việc làm", pos: "noun phrase", pronunciation_vi: "KA-che-stva za-NYA-ta-sti", pronunciation_en: "KA-che-stva za-NYA-ta-stee" },
      { cell_id: "26ed77e4-ca65-44ff-a851-0abdeb411182", word: "нестабильный контракт", romanization: "nestabilny kontrakt", en: "unstable contract", vi: "hợp đồng bấp bênh", pos: "noun phrase", pronunciation_vi: "ne-sta-BIL-ny kan-TRAKT", pronunciation_en: "ne-sta-BEEL-ny kan-TRAKT" },
      { cell_id: "368a2f89-2eb2-4468-9dbb-f1487c328aba", word: "устойчивость", romanization: "ustoychivost", en: "stability / resilience", vi: "tính bền vững", pos: "noun", pronunciation_vi: "us-TOY-chi-vast", pronunciation_en: "us-TOY-chee-vast" },
      { cell_id: "379b9a7a-bc1c-43a5-82d7-2d7bcf96eb05", word: "иными словами", romanization: "inymi slovami", en: "in other words", vi: "nói cách khác", pos: "discourse marker", pronunciation_vi: "I-ny-mi sla-VA-mi", pronunciation_en: "EE-ny-mee sla-VA-mee" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối báo hiệu tác giả đang diễn giải lại ý chính.",
        instruction_en: "Fill in the marker that signals the author is restating the main point.",
        items: [{ prompt: "_____ словами, важно не только иметь работу.", answer: "Иными" }],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tỷ lệ có việc cao có thể che giấu lương thấp.", answer: "Высокая занятость может скрывать низкие зарплаты." },
        ],
      },
    ],
    cultural_notes_vi:
      "Cụm `может скрывать` và `не просто… а…` là tín hiệu tác giả đang phản biện một niềm tin quen thuộc, không chỉ mô tả.",
    cultural_notes_en:
      "`может скрывать` and `не просто… а…` signal the author is challenging a familiar belief, not just describing.",
    tip_advice_vi:
      "Khi thấy `может скрывать`, hỏi: tác giả đang lật ngược giả định nào? Câu sau thường nêu tiêu chí mới.",
    tip_advice_en:
      "When you see `может скрывать`, ask: which assumption is being overturned? The next sentence usually names the new criterion.",
  },
  {
    id: "russian_c1_reading_inequality_multidimensional",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Đọc học thuật — bất bình đẳng đa chiều",
    title_en: "C1: Academic reading — multidimensional inequality",
    intro_vi:
      "Đoạn này định nghĩa lại một khái niệm: bất bình đẳng không chỉ là tiền. Theo dõi cách tác giả mở rộng khái niệm và nêu hệ quả dây chuyền.",
    intro_en:
      "This passage redefines a concept: inequality is not only money. Track how the author broadens the concept and states a chain of consequences.",
    sentences: [
      {
        russian: "Экономическое неравенство проявляется не только в доходах.",
        romanization: "Ekonomicheskoye neravenstvo proyavlyayetsya ne tolko v dokhodakh.",
        en: "Economic inequality shows up not only in incomes.",
        vi: "Bất bình đẳng kinh tế không chỉ biểu hiện ở thu nhập.",
        pronunciation_focus: ["mở rộng khái niệm (không chỉ thu nhập)", "проявляется = biểu hiện", "chuẩn bị cho danh sách phía sau"],
        pronunciation_focus_en: ["broadening the concept (not only income)", "проявляется = manifests", "sets up the list that follows"],
      },
      {
        russian: "Оно связано с доступом к образованию, жилью и медицине.",
        romanization: "Ono svyazano s dostupom k obrazovaniyu, zhilyu i meditsine.",
        en: "It is linked to access to education, housing, and healthcare.",
        vi: "Nó gắn với khả năng tiếp cận giáo dục, nhà ở và y tế.",
        pronunciation_focus: ["danh sách các chiều của khái niệm", "связано с + công cụ cách", "доступ к + tặng cách"],
        pronunciation_focus_en: ["the list of the concept's dimensions", "связано с + instrumental", "доступ к + dative"],
      },
      {
        russian: "Если неравенство становится наследуемым, общественная мобильность снижается.",
        romanization: "Yesli neravenstvo stanovitsya nasleduyemym, obshchestvennaya mobilnost snizhayetsya.",
        en: "If inequality becomes inherited, social mobility declines.",
        vi: "Nếu bất bình đẳng trở nên có tính kế thừa, dịch chuyển xã hội suy giảm.",
        pronunciation_focus: ["câu điều kiện → hệ quả", "наследуемое = mang tính thừa kế", "общественная мобильность = dịch chuyển xã hội"],
        pronunciation_focus_en: ["a condition → consequence sentence", "наследуемое = inherited", "общественная мобильность = social mobility"],
      },
      {
        russian: "В результате доверие к институтам ослабевает.",
        romanization: "V rezultate doverie k institutam oslabevayet.",
        en: "As a result, trust in institutions weakens.",
        vi: "Kết quả là niềm tin vào các thiết chế suy yếu.",
        pronunciation_focus: ["в результате = mắt xích cuối của chuỗi", "доверие к институтам = niềm tin vào thiết chế", "ослабевает = suy yếu"],
        pronunciation_focus_en: ["в результате = the final link of the chain", "доверие к институтам = trust in institutions", "ослабевает = weakens"],
      },
    ],
    vocabulary: [
      { cell_id: "2703740d-7ded-42de-8296-53715a6bbb16", word: "неравенство", romanization: "neravenstvo", en: "inequality", vi: "bất bình đẳng", pos: "noun", pronunciation_vi: "ne-RA-ven-stva", pronunciation_en: "ne-RA-ven-stva" },
      { cell_id: "3baa645a-94be-4c7c-b6c5-6a9b8a4eaa00", word: "общественная мобильность", romanization: "obshchestvennaya mobilnost", en: "social mobility", vi: "dịch chuyển xã hội", pos: "noun phrase", pronunciation_vi: "ab-shchest-VEN-na-ya ma-BIL-nast", pronunciation_en: "ab-shchest-VEN-na-ya ma-BEEL-nast" },
      { cell_id: "15ec6606-af51-4be6-933c-35606151b239", word: "доверие к институтам", romanization: "doverie k institutam", en: "trust in institutions", vi: "niềm tin vào thiết chế", pos: "noun phrase", pronunciation_vi: "da-VE-ri-ye k in-sti-TU-tam", pronunciation_en: "da-VE-ree-ye k in-stee-TOO-tam" },
      { cell_id: "5863b331-1fc8-4ccc-87e1-474cf06ab41e", word: "в результате", romanization: "v rezultate", en: "as a result", vi: "kết quả là", pos: "discourse marker", pronunciation_vi: "v re-zul-TA-te", pronunciation_en: "v re-zool-TA-te" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Sắp xếp chuỗi nhân–quả theo thứ tự lập luận.",
        instruction_en: "Match each step of the cause–effect chain to its order.",
        items: [
          { prompt: "неравенство становится наследуемым", answer: "bước 1: nguyên nhân" },
          { prompt: "мобильность снижается", answer: "bước 2: hệ quả trực tiếp" },
          { prompt: "доверие к институтам ослабевает", answer: "bước 3: hệ quả cuối" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối báo hiệu hệ quả cuối của chuỗi.",
        instruction_en: "Fill in the connector that signals the chain's final result.",
        items: [{ prompt: "_____ доверие к институтам ослабевает.", answer: "В результате" }],
      },
    ],
    cultural_notes_vi:
      "Văn học thuật Nga thích chuỗi `если… → снижается → в результате…`. Đọc được chuỗi này quan trọng hơn dịch từng từ.",
    cultural_notes_en:
      "Russian academic prose favors chains like `если… → снижается → в результате…`. Reading the chain matters more than translating each word.",
    tip_advice_vi:
      "Gạch chân các mốc `если`, `снижается`, `в результате` để dựng lại lập luận thành 3 bước: điều kiện → hệ quả → hệ quả cuối.",
    tip_advice_en:
      "Underline the markers `если`, `снижается`, `в результате` to rebuild the argument as three steps: condition → effect → final effect.",
  },
  {
    id: "russian_c1_reading_journal_argument_frames",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Đọc bài báo khoa học — tách luận điểm, cơ chế và giới hạn",
    title_en: "C1: Reading a journal article — separating claim, mechanism, and limitation",
    intro_vi:
      "Bài báo khoa học dùng khung cố định: 'Bài viết xem xét… Tác giả xuất phát từ giả định… Phân tích cho thấy… Kết luận chính là…'. Nhận diện khung giúp đọc nhanh và chính xác.",
    intro_en:
      "Journal articles use fixed frames: 'This article examines… The author proceeds from the assumption… The analysis shows… The main conclusion is…'. Recognizing the frame makes reading fast and accurate.",
    sentences: [
      {
        russian: "В данной статье рассматривается мобильность труда как фактор устойчивости институтов.",
        romanization: "V dannoy state rassmatrivayetsya mobilnost truda kak faktor ustoychivosti institutov.",
        en: "This article examines labor mobility as a factor in institutional resilience.",
        vi: "Bài viết này xem xét tính lưu động lao động như một yếu tố của tính bền vững thể chế.",
        pronunciation_focus: ["в данной статье рассматривается = khung mở bài", "как фактор = với tư cách yếu tố", "đây là câu nêu chủ đề, chưa phải luận điểm"],
        pronunciation_focus_en: ["в данной статье рассматривается = an opening frame", "как фактор = as a factor", "this states the topic, not yet the claim"],
      },
      {
        russian: "Автор исходит из предположения, что решения нельзя понять вне контекста.",
        romanization: "Avtor iskhodit iz predpolozheniya, chto resheniya nelzya ponyat vne konteksta.",
        en: "The author proceeds from the assumption that decisions cannot be understood outside context.",
        vi: "Tác giả xuất phát từ giả định rằng không thể hiểu các quyết định bên ngoài bối cảnh.",
        pronunciation_focus: ["исходит из предположения = nêu giả định nền", "вне контекста = ngoài bối cảnh", "đây là tiền đề, cần phân biệt với kết luận"],
        pronunciation_focus_en: ["исходит из предположения = states the underlying assumption", "вне контекста = outside context", "this is the premise, distinct from the conclusion"],
      },
      {
        russian: "Анализ показывает долгосрочные эффекты через доступ к ресурсам и доверие.",
        romanization: "Analiz pokazyvayet dolgosrochnye effekty cherez dostup k resursam i doverie.",
        en: "The analysis shows long-term effects through access to resources and trust.",
        vi: "Phân tích cho thấy các tác động dài hạn thông qua khả năng tiếp cận nguồn lực và niềm tin.",
        pronunciation_focus: ["анализ показывает = phần cơ chế/bằng chứng", "через = thông qua (cơ chế)", "phân biệt cơ chế với luận điểm"],
        pronunciation_focus_en: ["анализ показывает = the mechanism/evidence part", "через = through (mechanism)", "separate mechanism from claim"],
      },
      {
        russian: "Главный вывод состоит в том, что простые объяснения недостаточны.",
        romanization: "Glavny vyvod sostoit v tom, chto prostye obyasneniya nedostatochny.",
        en: "The main conclusion is that simple explanations are insufficient.",
        vi: "Kết luận chính là những lời giải thích đơn giản là chưa đủ.",
        pronunciation_focus: ["главный вывод состоит в том, что… = khung kết luận", "недостаточны = không đủ (giới hạn)", "đây là câu cần paraphrase"],
        pronunciation_focus_en: ["главный вывод состоит в том, что… = the conclusion frame", "недостаточны = insufficient (limitation)", "this is the sentence to paraphrase"],
      },
    ],
    vocabulary: [
      { cell_id: "a9303aec-602c-43ae-a577-c1a795811869", word: "в данной статье рассматривается", romanization: "v dannoy state rassmatrivayetsya", en: "this article examines", vi: "bài viết này xem xét", pos: "phrase", pronunciation_vi: "v DAN-noy sta-TYE ras-MA-tri-va-yet-sya", pronunciation_en: "v DAN-noy sta-TYE ras-MA-tree-va-yet-sya" },
      { cell_id: "31721f1a-e269-4441-a462-7cbf5f44bfac", word: "исходить из предположения", romanization: "iskhodit iz predpolozheniya", en: "to proceed from an assumption", vi: "xuất phát từ giả định", pos: "verb phrase", pronunciation_vi: "is-kha-DIT iz pred-pa-la-ZHE-ni-ya", pronunciation_en: "is-kha-DEET iz pred-pa-la-ZHE-nee-ya" },
      { cell_id: "26c37851-38d0-453d-9508-6ec6aa818441", word: "главный вывод", romanization: "glavny vyvod", en: "main conclusion", vi: "kết luận chính", pos: "noun phrase", pronunciation_vi: "GLAV-ny VY-vad", pronunciation_en: "GLAV-ny VY-vad" },
      { cell_id: "eff0272d-3c0e-4638-9ac1-78c9b504295b", word: "недостаточный", romanization: "nedostatochny", en: "insufficient", vi: "không đủ", pos: "adjective", pronunciation_vi: "ne-da-STA-tach-ny", pronunciation_en: "ne-da-STA-tach-ny" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối khung bài báo với chức năng lập luận.",
        instruction_en: "Match the journal frame with its argumentative function.",
        items: [
          { prompt: "В данной статье рассматривается…", answer: "nêu chủ đề" },
          { prompt: "Автор исходит из предположения…", answer: "nêu tiền đề/giả định" },
          { prompt: "Анализ показывает…", answer: "cơ chế / bằng chứng" },
          { prompt: "Главный вывод состоит в том, что…", answer: "kết luận chính" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Kết luận chính là những lời giải thích đơn giản là chưa đủ.", answer: "Главный вывод состоит в том, что простые объяснения недостаточны." },
        ],
      },
    ],
    cultural_notes_vi:
      "Bài báo Nga thường tách rõ chủ đề / giả định / cơ chế / kết luận. Đừng nhầm câu 'xem xét…' (chủ đề) với câu 'kết luận chính là…' (luận điểm).",
    cultural_notes_en:
      "Russian articles keep topic / assumption / mechanism / conclusion distinct. Don't confuse the 'examines…' sentence (topic) with the 'main conclusion is…' sentence (claim).",
    tip_advice_vi:
      "Đọc một bài báo bằng cách điền 4 ô: chủ đề, giả định, cơ chế, kết luận. Nếu thiếu dữ liệu thực nghiệm, đó là một giới hạn cần ghi lại.",
    tip_advice_en:
      "Read an article by filling four boxes: topic, assumption, mechanism, conclusion. If empirical data is missing, note it as a limitation.",
  },
  {
    id: "russian_c1_listening_news_transport_reform",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Nghe bản tin — cải cách giao thông (tách sự kiện và phê phán)",
    title_en: "C1: News listening — transport reform (separating event from criticism)",
    intro_vi:
      "Bản tin C1 trộn thông báo chính thức với tiếng nói phê phán. Mục tiêu: nêu ý chính + 2–4 chi tiết, và tách 'điều được công bố' khỏi 'điều bị phê phán'.",
    intro_en:
      "C1 news mixes the official announcement with critical voices. Goal: state the main point + 2–4 details, and split 'what was announced' from 'what is criticized'.",
    sentences: [
      {
        russian: "Городская администрация представила обновлённый план транспортной реформы.",
        romanization: "Gorodskaya administratsiya predstavila obnovlyonny plan transportnoy reformy.",
        en: "The city administration presented an updated transport-reform plan.",
        vi: "Chính quyền thành phố đã trình bày kế hoạch cải cách giao thông được cập nhật.",
        pronunciation_focus: ["câu nêu sự kiện (nguồn chính thức)", "представила = đã trình bày/giới thiệu", "обновлённый = được cập nhật"],
        pronunciation_focus_en: ["the event sentence (official source)", "представила = presented", "обновлённый = updated"],
      },
      {
        russian: "План должен сократить время поездок и сделать пересадки более предсказуемыми.",
        romanization: "Plan dolzhen sokratit vremya poyezdok i sdelat peresadki bolee predskazuyemymi.",
        en: "The plan should cut travel time and make transfers more predictable.",
        vi: "Kế hoạch nhằm rút ngắn thời gian di chuyển và làm cho việc chuyển tuyến dễ dự đoán hơn.",
        pronunciation_focus: ["mục tiêu được tuyên bố", "должен сократить = lẽ ra sẽ rút ngắn (kỳ vọng)", "более предсказуемыми = dễ dự đoán hơn"],
        pronunciation_focus_en: ["the stated goal", "должен сократить = is meant to reduce (expectation)", "более предсказуемыми = more predictable"],
      },
      {
        russian: "Критики, однако, указывают на отсутствие контроля за парковкой в центре.",
        romanization: "Kritiki, odnako, ukazyvayut na otsutstvie kontrolya za parkovkoy v tsentre.",
        en: "Critics, however, point to the lack of parking control in the center.",
        vi: "Tuy nhiên, giới phê phán chỉ ra việc thiếu kiểm soát đỗ xe ở trung tâm.",
        pronunciation_focus: ["однако = chuyển sang tiếng nói phê phán", "критики указывают = phê phán chỉ ra", "đây là ý kiến, không phải sự kiện"],
        pronunciation_focus_en: ["однако = switch to the critical voice", "критики указывают = critics point out", "this is opinion, not fact"],
      },
      {
        russian: "Представители мэрии отвечают, что первые результаты можно оценить через три месяца.",
        romanization: "Predstaviteli merii otvechayut, chto pervye rezultaty mozhno otsenit cherez tri mesyatsa.",
        en: "City-hall representatives reply that the first results can be assessed in three months.",
        vi: "Đại diện tòa thị chính đáp rằng có thể đánh giá kết quả đầu tiên sau ba tháng.",
        pronunciation_focus: ["phản hồi của một bên (stance)", "отвечают, что… = đáp rằng", "через три месяца = sau ba tháng"],
        pronunciation_focus_en: ["one side's response (stance)", "отвечают, что… = reply that", "через три месяца = in three months"],
      },
    ],
    vocabulary: [
      { cell_id: "e0616fa7-5bac-4b03-815c-50e17cfb6be0", word: "транспортная реформа", romanization: "transportnaya reforma", en: "transport reform", vi: "cải cách giao thông", pos: "noun phrase", pronunciation_vi: "trans-PORT-na-ya re-FOR-ma", pronunciation_en: "trans-PORT-na-ya re-FOR-ma" },
      { cell_id: "618a5de0-e55f-4ba9-b4dc-610ba516da1c", word: "сократить", romanization: "sokratit", en: "to reduce / cut", vi: "rút ngắn / giảm", pos: "verb", pronunciation_vi: "sa-kra-TIT", pronunciation_en: "sa-kra-TEET" },
      { cell_id: "a274599e-6b4c-42ec-9ec3-22a61f5237cb", word: "критики указывают", romanization: "kritiki ukazyvayut", en: "critics point out", vi: "giới phê phán chỉ ra", pos: "phrase", pronunciation_vi: "KRI-ti-ki u-KA-zy-va-yut", pronunciation_en: "KREE-tee-kee oo-KA-zy-va-yoot" },
      { cell_id: "73f65ec7-0587-4973-8039-777cfe4dca70", word: "представители мэрии", romanization: "predstaviteli merii", en: "city-hall representatives", vi: "đại diện tòa thị chính", pos: "noun phrase", pronunciation_vi: "pred-sta-VI-te-li ME-ri-i", pronunciation_en: "pred-sta-VEE-te-lee ME-ree-ee" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Phân loại từng phát biểu: sự kiện hay ý kiến.",
        instruction_en: "Label each statement: fact or opinion.",
        items: [
          { prompt: "Администрация представила план.", answer: "сự kiện" },
          { prompt: "Реформа рискует остаться обещанием.", answer: "ý kiến (phê phán)" },
          { prompt: "Результаты можно оценить через три месяца.", answer: "phản hồi của mэрия" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối báo hiệu chuyển sang tiếng nói phê phán.",
        instruction_en: "Fill in the marker that signals a shift to the critical voice.",
        items: [{ prompt: "Критики, _____, указывают на проблемы.", answer: "однако" }],
      },
    ],
    cultural_notes_vi:
      "Bản tin Nga thường theo trình tự: nguồn chính thức → mục tiêu → phê phán → phản hồi. `однако`, `критики указывают`, `представители отвечают` đánh dấu từng giọng nói.",
    cultural_notes_en:
      "Russian news usually runs: official source → goal → criticism → response. `однако`, `критики указывают`, `представители отвечают` mark each voice.",
    tip_advice_vi:
      "Khi nghe tin, ghi nhanh 3 cột: ai công bố gì, ai phê phán gì, ai phản hồi gì. Đừng dịch từng từ — bám vào giọng nói.",
    tip_advice_en:
      "While listening to news, jot three columns: who announced what, who criticized what, who responded. Don't translate word by word — track the voices.",
  },
  {
    id: "russian_c1_listening_interview_remote_work",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Nghe phỏng vấn — làm việc từ xa và mô hình lai",
    title_en: "C1: Interview listening — remote work and the hybrid model",
    intro_vi:
      "Trong phỏng vấn, chuyên gia hiếm khi trả lời 'có/không'. Họ phân biệt sắc thái: vấn đề được giải quyết vs vấn đề mới lộ ra. Nghe được lập trường là kỹ năng C1.",
    intro_en:
      "In interviews an expert rarely answers yes/no. They split nuance: a problem solved vs a new one exposed. Catching the stance is a C1 skill.",
    sentences: [
      {
        russian: "Удалённая работа решила одну проблему, но обнажила другую.",
        romanization: "Udalyonnaya rabota reshila odnu problemu, no obnazhila druguyu.",
        en: "Remote work solved one problem but exposed another.",
        vi: "Làm việc từ xa giải quyết một vấn đề nhưng làm lộ ra một vấn đề khác.",
        pronunciation_focus: ["câu định khung sắc thái (không phải có/không)", "решила… но обнажила… = giải quyết… nhưng làm lộ…", "but-balance là dấu hiệu C1"],
        pronunciation_focus_en: ["the nuance-framing sentence (not yes/no)", "решила… но обнажила… = solved… but exposed…", "the but-balance is a C1 signal"],
      },
      {
        russian: "Производительность у многих сотрудников не упала, а иногда даже выросла.",
        romanization: "Proizvoditelnost u mnogikh sotrudnikov ne upala, a inogda dazhe vyrosla.",
        en: "Productivity for many employees did not fall, and sometimes even rose.",
        vi: "Năng suất của nhiều nhân viên không giảm, mà đôi khi còn tăng.",
        pronunciation_focus: ["bác bỏ một giả định phổ biến", "не упала, а… даже выросла = không giảm, mà còn tăng", "iногда = đôi khi (giới hạn)"],
        pronunciation_focus_en: ["rebuts a common assumption", "не упала, а… даже выросла = did not fall, but even rose", "иногда = sometimes (hedge)"],
      },
      {
        russian: "Руководители жалуются на слабую командную динамику и сложность обучения новичков.",
        romanization: "Rukovoditeli zhaluyutsya na slabuyu komandnuyu dinamiku i slozhnost obucheniya novichkov.",
        en: "Managers complain about weak team dynamics and the difficulty of training newcomers.",
        vi: "Lãnh đạo phàn nàn về động lực nhóm yếu và việc khó đào tạo người mới.",
        pronunciation_focus: ["chi tiết hỗ trợ cho 'vấn đề mới'", "жалуются на + đối cách", "командная динамика = động lực nhóm"],
        pronunciation_focus_en: ["details supporting the 'new problem'", "жалуются на + accusative", "командная динамика = team dynamics"],
      },
      {
        russian: "Важно не противопоставлять офис и дом, а проектировать гибридную модель.",
        romanization: "Vazhno ne protivopostavlyat ofis i dom, a proektirovat gibridnuyu model.",
        en: "It is important not to oppose office and home, but to design a hybrid model.",
        vi: "Quan trọng là không đối lập văn phòng với nhà, mà thiết kế một mô hình lai.",
        pronunciation_focus: ["khuyến nghị (lập trường của chuyên gia)", "не… а… = không… mà…", "гибридная модель = mô hình lai"],
        pronunciation_focus_en: ["the recommendation (expert's stance)", "не… а… = not… but…", "гибридная модель = hybrid model"],
      },
    ],
    vocabulary: [
      { cell_id: "6442885f-271a-43ef-a52e-afbf2cd45823", word: "удалённая работа", romanization: "udalyonnaya rabota", en: "remote work", vi: "làm việc từ xa", pos: "noun phrase", pronunciation_vi: "u-da-LYON-na-ya ra-BO-ta", pronunciation_en: "oo-da-LYON-na-ya ra-BO-ta" },
      { cell_id: "7cbcaf7c-ee3b-4757-9635-020ca47efe98", word: "производительность", romanization: "proizvoditelnost", en: "productivity", vi: "năng suất", pos: "noun", pronunciation_vi: "pra-iz-va-DI-tel-nast", pronunciation_en: "pra-eez-va-DEE-tel-nast" },
      { cell_id: "3e727503-9e3c-4282-be0b-88fe02656417", word: "командная динамика", romanization: "komandnaya dinamika", en: "team dynamics", vi: "động lực nhóm", pos: "noun phrase", pronunciation_vi: "ka-MAND-na-ya di-NA-mi-ka", pronunciation_en: "ka-MAND-na-ya dee-NA-mee-ka" },
      { cell_id: "057ad8e1-523c-41eb-a629-2e1775078043", word: "гибридная модель", romanization: "gibridnaya model", en: "hybrid model", vi: "mô hình lai", pos: "noun phrase", pronunciation_vi: "gi-BRID-na-ya ma-DEL", pronunciation_en: "gee-BREED-na-ya ma-DEL" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Suy luận: chuyên gia khuyên gì? Điền cụm còn thiếu.",
        instruction_en: "Inference: what does the expert recommend? Fill the missing phrase.",
        items: [{ prompt: "Важно не противопоставлять офис и дом, а проектировать _____ модель.", answer: "гибридную" }],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Năng suất không giảm, mà đôi khi còn tăng.", answer: "Производительность не упала, а иногда даже выросла." },
        ],
      },
    ],
    dialogue: [
      {
        cell_id: "b279acd2-3b02-480e-8c5b-c6586a1bf9f4",
        speaker: "Журналист",
        text: "Почему часть работодателей снова требует возвращения в офис?",
        romanization: "Pochemu chast rabotodateley snova trebuyet vozvrashcheniya v ofis?",
        vi: "Vì sao một bộ phận nhà tuyển dụng lại yêu cầu quay lại văn phòng?",
        en: "Why are some employers again demanding a return to the office?",
      },
      {
        cell_id: "27af9596-2761-4486-b14c-1cde51111658",
        speaker: "Эксперт",
        text: "Не потому что упала производительность, а из-за слабой командной динамики.",
        romanization: "Ne potomu chto upala proizvoditelnost, a iz-za slaboy komandnoy dinamiki.",
        vi: "Không phải vì năng suất giảm, mà vì động lực nhóm yếu.",
        en: "Not because productivity fell, but because of weak team dynamics.",
      },
    ],
    cultural_notes_vi:
      "Chuyên gia Nga thường trả lời bằng cấu trúc cân bằng `не… а…` và `решила одну…, но обнажила другую…`. Đó là tín hiệu của lập luận có sắc thái, không phải né tránh.",
    cultural_notes_en:
      "Russian experts often answer with balanced structures `не… а…` and `solved one…, but exposed another…`. That signals a nuanced argument, not evasion.",
    tip_advice_vi:
      "Khi nghe phỏng vấn, hỏi: vấn đề nào được giải quyết, vấn đề nào mới lộ ra, và khuyến nghị cuối là gì. Đáp án C1 cần cả ba.",
    tip_advice_en:
      "While listening to an interview, ask: which problem is solved, which is newly exposed, and what is the final recommendation. A C1 answer needs all three.",
  },
  {
    id: "russian_c1_listening_lecture_climate_adaptation",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Nghe bài giảng — giảm thiểu và thích ứng khí hậu",
    title_en: "C1: Lecture listening — climate mitigation vs adaptation",
    intro_vi:
      "Bài giảng thường mở bằng một phân biệt khái niệm rồi sửa một hiểu lầm. Theo dõi cặp đối lập và câu 'на самом деле' (thật ra).",
    intro_en:
      "Lectures often open with a conceptual distinction and then correct a misconception. Track the contrast pair and the 'на самом деле' (in fact) sentence.",
    sentences: [
      {
        russian: "Важно различать смягчение и адаптацию.",
        romanization: "Vazhno razlichat smyagcheniye i adaptatsiyu.",
        en: "It is important to distinguish mitigation from adaptation.",
        vi: "Quan trọng là phân biệt giảm thiểu và thích ứng.",
        pronunciation_focus: ["câu nêu cặp đối lập then chốt", "различать = phân biệt", "смягчение ↔ адаптация"],
        pronunciation_focus_en: ["the key contrast pair sentence", "различать = distinguish", "смягчение ↔ адаптация"],
      },
      {
        russian: "Смягчение означает сокращение выбросов, то есть работу с причиной.",
        romanization: "Smyagcheniye oznachayet sokrashcheniye vybrosov, to yest rabotu s prichinoy.",
        en: "Mitigation means cutting emissions, that is, working on the cause.",
        vi: "Giảm thiểu nghĩa là cắt giảm khí thải, tức là tác động vào nguyên nhân.",
        pronunciation_focus: ["то есть = diễn giải lại định nghĩa", "сокращение выбросов = cắt giảm khí thải", "работа с причиной = xử lý nguyên nhân"],
        pronunciation_focus_en: ["то есть = restates the definition", "сокращение выбросов = cutting emissions", "работа с причиной = working on the cause"],
      },
      {
        russian: "Адаптация означает подготовку к последствиям, которые уже неизбежны.",
        romanization: "Adaptatsiya oznachayet podgotovku k posledstviyam, kotorye uzhe neizbezhny.",
        en: "Adaptation means preparing for consequences that are already unavoidable.",
        vi: "Thích ứng nghĩa là chuẩn bị cho những hệ quả vốn đã không thể tránh.",
        pronunciation_focus: ["định nghĩa nửa kia của cặp", "подготовка к + tặng cách", "неизбежны = không thể tránh"],
        pronunciation_focus_en: ["defines the other half of the pair", "подготовка к + dative", "неизбежны = unavoidable"],
      },
      {
        russian: "На самом деле адаптация — не отказ от борьбы, а вторая линия защиты.",
        romanization: "Na samom dele adaptatsiya — ne otkaz ot borby, a vtoraya liniya zashchity.",
        en: "In fact, adaptation is not giving up the fight, but a second line of defense.",
        vi: "Thực ra, thích ứng không phải là từ bỏ cuộc chiến, mà là tuyến phòng thủ thứ hai.",
        pronunciation_focus: ["на самом деле = sửa hiểu lầm", "не… а… = không phải… mà là…", "đây là ý chính cần nắm"],
        pronunciation_focus_en: ["на самом деле = corrects a misconception", "не… а… = not… but…", "this is the key point to grasp"],
      },
    ],
    vocabulary: [
      { cell_id: "080b688d-b518-4915-b7ce-6a3c36ec11d1", word: "смягчение", romanization: "smyagcheniye", en: "mitigation", vi: "giảm thiểu", pos: "noun", pronunciation_vi: "smyag-CHE-ni-ye", pronunciation_en: "smyag-CHE-nee-ye" },
      { cell_id: "6c03f300-147e-45e4-a391-3b12e40a98c1", word: "адаптация", romanization: "adaptatsiya", en: "adaptation", vi: "thích ứng", pos: "noun", pronunciation_vi: "a-dap-TA-tsi-ya", pronunciation_en: "a-dap-TA-tsee-ya" },
      { cell_id: "804381a1-927a-48cf-a6b0-620f5fdbc1a6", word: "неизбежный", romanization: "neizbezhny", en: "unavoidable", vi: "không thể tránh", pos: "adjective", pronunciation_vi: "ne-iz-BEZH-ny", pronunciation_en: "ne-eez-BEZH-ny" },
      { cell_id: "46aa1b71-4ad5-48c0-92d2-29a23b940015", word: "на самом деле", romanization: "na samom dele", en: "in fact / actually", vi: "thực ra", pos: "discourse marker", pronunciation_vi: "na SA-mom DE-le", pronunciation_en: "na SA-mom DE-le" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối khái niệm với định nghĩa.",
        instruction_en: "Match each concept with its definition.",
        items: [
          { prompt: "смягчение", answer: "работа с причиной (сокращение выбросов)" },
          { prompt: "адаптация", answer: "подготовка к неизбежным последствиям" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm báo hiệu giảng viên đang sửa một hiểu lầm.",
        instruction_en: "Fill in the phrase that signals the lecturer is correcting a misconception.",
        items: [{ prompt: "_____ адаптация — не отказ от борьбы.", answer: "На самом деле" }],
      },
    ],
    cultural_notes_vi:
      "Bài giảng học thuật Nga dùng `то есть` để diễn giải và `на самом деле` để sửa hiểu lầm. Hai cụm này chỉ ra câu nào là định nghĩa, câu nào là điều chỉnh.",
    cultural_notes_en:
      "Russian lectures use `то есть` to paraphrase and `на самом деле` to correct a misconception. These two phrases flag which sentence defines and which one corrects.",
    tip_advice_vi:
      "Khi nghe giảng, lập một bảng đối lập hai cột và đánh dấu câu `на самом деле` — đó thường là kết luận sửa lỗi.",
    tip_advice_en:
      "While listening to a lecture, build a two-column contrast table and flag the `на самом деле` sentence — it is usually the corrective conclusion.",
  },
  {
    id: "russian_c1_listening_podcast_media_literacy",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Nghe podcast — năng lực truyền thông và phân biệt thể loại",
    title_en: "C1: Podcast listening — media literacy and distinguishing genres",
    intro_vi:
      "Podcast độc thoại C1 định nghĩa một khái niệm bằng cách nói nó KHÔNG phải là gì trước. Nghe để phân biệt tin, bình luận, phân tích, quảng cáo.",
    intro_en:
      "A C1 monologue podcast often defines a concept by first saying what it is NOT. Listen to separate news, opinion, analysis, and advertising.",
    sentences: [
      {
        russian: "Медиаграмотность — это не привычка никому не верить.",
        romanization: "Mediagramotnost — eto ne privychka nikomu ne verit.",
        en: "Media literacy is not the habit of trusting no one.",
        vi: "Năng lực truyền thông không phải là thói quen không tin ai cả.",
        pronunciation_focus: ["định nghĩa bằng phủ định trước", "это не… = nó không phải là…", "chuẩn bị cho định nghĩa khẳng định sau"],
        pronunciation_focus_en: ["definition by negation first", "это не… = it is not…", "sets up the positive definition next"],
      },
      {
        russian: "Это умение различать жанры, источники, интересы и степень доказанности.",
        romanization: "Eto umeniye razlichat zhanry, istochniki, interesy i stepen dokazannosti.",
        en: "It is the skill of distinguishing genres, sources, interests, and degree of proof.",
        vi: "Đó là khả năng phân biệt thể loại, nguồn, lợi ích và mức độ được chứng minh.",
        pronunciation_focus: ["định nghĩa khẳng định (đối lập câu trước)", "различать = phân biệt", "степень доказанности = mức độ được chứng minh"],
        pronunciation_focus_en: ["the positive definition (contrasts the prior sentence)", "различать = distinguish", "степень доказанности = degree of proof"],
      },
      {
        russian: "Новость сообщает факт, а реклама пытается изменить поведение.",
        romanization: "Novost soobshchayet fakt, a reklama pytayetsya izmenit povedeniye.",
        en: "News reports a fact, whereas advertising tries to change behavior.",
        vi: "Tin tức thông báo sự kiện, còn quảng cáo cố thay đổi hành vi.",
        pronunciation_focus: ["а = đối lập hai thể loại", "сообщает факт ↔ изменить поведение", "phân biệt chức năng văn bản"],
        pronunciation_focus_en: ["а = contrasts two genres", "сообщает факт ↔ изменить поведение", "separates text functions"],
      },
      {
        russian: "Зрелый читатель спрашивает, кто говорит, зачем и что осталось за кадром.",
        romanization: "Zrely chitatel sprashivayet, kto govorit, zachem i chto ostalos za kadrom.",
        en: "A mature reader asks who is speaking, why, and what was left off-screen.",
        vi: "Người đọc trưởng thành hỏi: ai nói, vì sao, và điều gì bị bỏ ngoài khung.",
        pronunciation_focus: ["khung câu hỏi suy luận", "что осталось за кадром = điều gì bị bỏ sót", "vượt qua câu hỏi đúng/sai"],
        pronunciation_focus_en: ["an inference question frame", "что осталось за кадром = what was omitted", "goes beyond true/false"],
      },
    ],
    vocabulary: [
      { cell_id: "a39f3f48-45be-4510-8985-93f9b0f09019", word: "медиаграмотность", romanization: "mediagramotnost", en: "media literacy", vi: "năng lực truyền thông", pos: "noun", pronunciation_vi: "me-di-a-GRA-mat-nast", pronunciation_en: "me-dee-a-GRA-mat-nast" },
      { cell_id: "9011b8a9-f22c-42ed-b36d-76abc2077d7b", word: "источник", romanization: "istochnik", en: "source", vi: "nguồn (tin)", pos: "noun", pronunciation_vi: "is-TOCH-nik", pronunciation_en: "ees-TOCH-neek" },
      { cell_id: "36a7aa21-efe9-4f63-b2ba-488a7b591587", word: "степень доказанности", romanization: "stepen dokazannosti", en: "degree of proof", vi: "mức độ được chứng minh", pos: "noun phrase", pronunciation_vi: "STE-pen da-ka-ZAN-nas-ti", pronunciation_en: "STE-pen da-ka-ZAN-nas-tee" },
      { cell_id: "8dfc91d7-7659-4750-be03-2898bd6ae24d", word: "за кадром", romanization: "za kadrom", en: "off-screen / left out", vi: "ngoài khung / bị bỏ sót", pos: "phrase", pronunciation_vi: "za KAD-ram", pronunciation_en: "za KAD-ram" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối thể loại với chức năng của nó.",
        instruction_en: "Match each genre with its function.",
        items: [
          { prompt: "новость", answer: "сообщает факт" },
          { prompt: "колонка", answer: "выражает позицию" },
          { prompt: "аналитика", answer: "объясняет причины" },
          { prompt: "реклама", answer: "меняет поведение" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Suy luận: câu hỏi nào của người đọc trưởng thành chỉ ra thông tin bị bỏ sót?",
        instruction_en: "Inference: which mature-reader question points at omitted information?",
        items: [{ prompt: "…что осталось за _____?", answer: "кадром" }],
      },
    ],
    cultural_notes_vi:
      "Podcast Nga hay định nghĩa khái niệm theo kiểu 'không phải X, mà là Y'. Câu phủ định mở đầu giúp loại bỏ hiểu lầm trước khi nêu định nghĩa thật.",
    cultural_notes_en:
      "Russian podcasts often define a concept as 'not X, but Y'. The opening negation clears a misunderstanding before the real definition.",
    tip_advice_vi:
      "Tập hỏi bốn câu của người đọc trưởng thành: ai nói, vì sao, dựa trên dữ liệu nào, và điều gì bị bỏ sót.",
    tip_advice_en:
      "Practice the mature reader's four questions: who speaks, why, on what data, and what was left out.",
  },
  {
    id: "russian_c1_listening_lecture_argumentation",
    level: "C1",
    category: "practical_tasks",
    title_vi: "C1: Nghe bài giảng — phân biệt quan điểm và lập luận",
    title_en: "C1: Lecture listening — distinguishing position from argument",
    intro_vi:
      "Một quan điểm trả lời 'bạn nghĩ gì?'; một lập luận trả lời 'vì sao người khác có thể đồng ý?'. Bài giảng C1 dạy nhận ra khi nào một câu chỉ là quan điểm.",
    intro_en:
      "A position answers 'what do you think?'; an argument answers 'why might others agree?'. A C1 lecture teaches you to spot when a sentence is only a position.",
    sentences: [
      {
        russian: "Важно отличать позицию от аргумента.",
        romanization: "Vazhno otlichat pozitsiyu ot argumenta.",
        en: "It is important to distinguish a position from an argument.",
        vi: "Quan trọng là phân biệt quan điểm với lập luận.",
        pronunciation_focus: ["câu nêu cặp khái niệm đối lập", "отличать… от… = phân biệt… với…", "позиция ↔ аргумент"],
        pronunciation_focus_en: ["sets up the contrast pair", "отличать… от… = distinguish… from…", "позиция ↔ аргумент"],
      },
      {
        russian: "Фраза «я считаю, что это плохо» — позиция, но не аргумент.",
        romanization: "Fraza «ya schitayu, chto eto plokho» — pozitsiya, no ne argument.",
        en: "The phrase 'I think this is bad' is a position, but not an argument.",
        vi: "Câu «tôi cho rằng điều này tệ» là quan điểm, nhưng không phải lập luận.",
        pronunciation_focus: ["ví dụ minh họa khái niệm", "позиция, но не аргумент = quan điểm chứ không phải lập luận", "я считаю = tôi cho rằng"],
        pronunciation_focus_en: ["an example illustrating the concept", "позиция, но не аргумент = a position, but not an argument", "я считаю = I think"],
      },
      {
        russian: "Аргумент требует основания, примера, механизма или сравнения.",
        romanization: "Argument trebuyet osnovaniya, primera, mekhanizma ili sravneniya.",
        en: "An argument requires grounds, an example, a mechanism, or a comparison.",
        vi: "Lập luận đòi hỏi căn cứ, ví dụ, cơ chế hoặc sự so sánh.",
        pronunciation_focus: ["liệt kê điều kiện của một lập luận", "требует + sinh cách (основания…)", "основание = căn cứ"],
        pronunciation_focus_en: ["lists what an argument needs", "требует + genitive (основания…)", "основание = grounds"],
      },
      {
        russian: "Сильный аргумент предвидит возражение и объясняет, почему оно не разрушает вывод.",
        romanization: "Silny argument predvidit vozrazheniye i obyasnyayet, pochemu ono ne razrushayet vyvod.",
        en: "A strong argument anticipates the objection and explains why it does not destroy the conclusion.",
        vi: "Một lập luận mạnh dự đoán phản bác và giải thích vì sao nó không phá vỡ kết luận.",
        pronunciation_focus: ["dấu hiệu của lập luận trưởng thành", "предвидит возражение = lường trước phản bác", "đây là ý chốt"],
        pronunciation_focus_en: ["the mark of a mature argument", "предвидит возражение = anticipates the objection", "this is the closing point"],
      },
    ],
    vocabulary: [
      { cell_id: "d2584404-ef1b-4086-949f-b9aadf5212e6", word: "позиция", romanization: "pozitsiya", en: "position / stance", vi: "quan điểm", pos: "noun", pronunciation_vi: "pa-ZI-tsi-ya", pronunciation_en: "pa-ZEE-tsee-ya" },
      { cell_id: "c8584bd8-12cb-4833-8247-6f46cc7e87fe", word: "аргумент", romanization: "argument", en: "argument", vi: "lập luận", pos: "noun", pronunciation_vi: "ar-gu-MENT", pronunciation_en: "ar-goo-MENT" },
      { cell_id: "6cd8fe9b-bf78-4c82-aa0a-713fdffe04ed", word: "основание", romanization: "osnovaniye", en: "grounds / basis", vi: "căn cứ", pos: "noun", pronunciation_vi: "as-na-VA-ni-ye", pronunciation_en: "as-na-VA-nee-ye" },
      { cell_id: "330773ad-796f-429d-897e-cd3810809af5", word: "возражение", romanization: "vozrazheniye", en: "objection", vi: "phản bác", pos: "noun", pronunciation_vi: "va-zra-ZHE-ni-ye", pronunciation_en: "va-zra-ZHE-nee-ye" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Phân loại từng câu: quan điểm hay lập luận.",
        instruction_en: "Classify each sentence: position or argument.",
        items: [
          { prompt: "Я считаю, что это плохо.", answer: "quan điểm" },
          { prompt: "Это плохо, потому что данные показывают рост ошибок.", answer: "lập luận" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền danh từ: lập luận mạnh phải lường trước điều gì?",
        instruction_en: "Fill the noun: a strong argument anticipates what?",
        items: [{ prompt: "Сильный аргумент предвидит _____.", answer: "возражение" }],
      },
    ],
    cultural_notes_vi:
      "Trong kỳ thi vấn đáp Nga, người chấm phân biệt rõ quan điểm và lập luận. Nói `я считаю` mà không có căn cứ thường bị coi là chưa đủ ở C1.",
    cultural_notes_en:
      "In Russian oral exams, examiners clearly separate position from argument. Saying `я считаю` without grounds usually counts as insufficient at C1.",
    tip_advice_vi:
      "Sau mỗi quan điểm, tự thêm `потому что…` kèm căn cứ/ví dụ/cơ chế, rồi nêu một phản bác và phản hồi nó.",
    tip_advice_en:
      "After each position, add `потому что…` with grounds/example/mechanism, then raise one objection and answer it.",
  },
  {
    id: "russian_c1_discourse_markers_toolkit",
    level: "C1",
    category: "connected_speech",
    title_vi: "C1: Bộ từ nối diễn ngôn — однако, при этом, по сути, с одной стороны",
    title_en: "C1: Discourse-marker toolkit — однако, при этом, по сути, с одной стороны",
    intro_vi:
      "Từ nối diễn ngôn là 'biển chỉ đường' của văn bản C1: chúng báo trước đối lập, tóm tắt, nhượng bộ hay bản chất. Nắm chúng giúp đọc và nghe nhanh hơn nhiều.",
    intro_en:
      "Discourse markers are the road signs of C1 text: they pre-announce contrast, summary, concession, or essence. Mastering them speeds up reading and listening a lot.",
    sentences: [
      {
        russian: "С одной стороны, реформа полезна; с другой стороны, она требует денег.",
        romanization: "S odnoy storony, reforma polezna; s drugoy storony, ona trebuyet deneg.",
        en: "On the one hand, the reform is useful; on the other hand, it requires money.",
        vi: "Một mặt, cải cách có ích; mặt khác, nó cần tiền.",
        pronunciation_focus: ["khung lập luận cân bằng hai mặt", "с одной стороны… с другой стороны…", "báo trước hai vế đối lập"],
        pronunciation_focus_en: ["a balanced two-sided frame", "с одной стороны… с другой стороны…", "pre-announces two contrasting sides"],
      },
      {
        russian: "При этом важно помнить, что данные ограничены.",
        romanization: "Pri etom vazhno pomnit, chto dannye ogranicheny.",
        en: "At the same time, it is important to remember that the data are limited.",
        vi: "Đồng thời, cần nhớ rằng dữ liệu là hạn chế.",
        pronunciation_focus: ["при этом = thêm sắc thái đồng thời/nhượng bộ", "không phải đối lập gắt như однако", "báo một caveat đi kèm"],
        pronunciation_focus_en: ["при этом = adds a simultaneous/concessive nuance", "softer than a hard однако contrast", "flags an accompanying caveat"],
      },
      {
        russian: "По сути, вопрос не в скорости, а в надёжности.",
        romanization: "Po suti, vopros ne v skorosti, a v nadyozhnosti.",
        en: "In essence, the question is not about speed, but about reliability.",
        vi: "Về bản chất, vấn đề không nằm ở tốc độ, mà ở độ tin cậy.",
        pronunciation_focus: ["по сути = đưa về bản chất/ý cốt lõi", "не в… а в… = không phải ở… mà ở…", "câu này thường là điểm chốt"],
        pronunciation_focus_en: ["по сути = reduces to the essence", "не в… а в… = not in… but in…", "this is often the crux"],
      },
      {
        russian: "В целом результаты обнадёживают, хотя выводы делать рано.",
        romanization: "V tselom rezultaty obnadyozhivayut, khotya vyvody delat rano.",
        en: "Overall the results are encouraging, although it is too early to draw conclusions.",
        vi: "Nhìn chung kết quả đáng khích lệ, dù còn quá sớm để kết luận.",
        pronunciation_focus: ["в целом = câu tóm tắt", "хотя = nhượng bộ (giới hạn)", "kết hợp tổng kết + caveat"],
        pronunciation_focus_en: ["в целом = a summarizing sentence", "хотя = concession (limitation)", "combines summary + caveat"],
      },
    ],
    vocabulary: [
      { cell_id: "70f0e9c1-3eb2-46c8-b490-0d6c56fa9db8", word: "однако", romanization: "odnako", en: "however", vi: "tuy nhiên", pos: "discourse marker", pronunciation_vi: "ad-NA-ka", pronunciation_en: "ad-NA-ka" },
      { cell_id: "762a5ef1-1ef4-4312-b2b8-bdfc75213b00", word: "при этом", romanization: "pri etom", en: "at the same time / yet", vi: "đồng thời / dù vậy", pos: "discourse marker", pronunciation_vi: "pri E-tam", pronunciation_en: "pree E-tam" },
      { cell_id: "b342f42c-0e52-4a82-83c1-8948d477ef17", word: "по сути", romanization: "po suti", en: "in essence", vi: "về bản chất", pos: "discourse marker", pronunciation_vi: "pa SU-ti", pronunciation_en: "pa SOO-tee" },
      { cell_id: "e0471d9f-4ff5-4b3a-b473-f2214839a2f0", word: "в целом", romanization: "v tselom", en: "overall / on the whole", vi: "nhìn chung", pos: "discourse marker", pronunciation_vi: "v TSE-lam", pronunciation_en: "v TSE-lam" },
      { cell_id: "35514c8f-b606-466a-b637-c0ed3b472c37", word: "хотя", romanization: "khotya", en: "although", vi: "mặc dù", pos: "conjunction", pronunciation_vi: "kha-TYA", pronunciation_en: "kha-TYA" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ nối diễn ngôn với chức năng của nó.",
        instruction_en: "Match each discourse marker with its function.",
        items: [
          { prompt: "однако", answer: "đối lập / tuy nhiên" },
          { prompt: "при этом", answer: "đồng thời / nhượng bộ" },
          { prompt: "по сути", answer: "đưa về bản chất" },
          { prompt: "с одной стороны … с другой стороны", answer: "lập luận hai mặt" },
          { prompt: "в целом", answer: "tóm tắt chung" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối đưa câu về ý cốt lõi.",
        instruction_en: "Fill the marker that reduces the sentence to its core point.",
        items: [{ prompt: "_____, вопрос не в скорости, а в надёжности.", answer: "По сути" }],
      },
    ],
    cultural_notes_vi:
      "Trong văn bản C1, từ nối thường xuất hiện đầu câu và báo trước chức năng của cả câu. Nghe/đọc thấy `однако` là biết sắp có đối lập trước khi hiểu hết từ vựng.",
    cultural_notes_en:
      "In C1 texts, markers usually sit at the start of a sentence and pre-announce its function. Hearing `однако` tells you a contrast is coming before you parse every word.",
    tip_advice_vi:
      "Học từ nối theo nhóm chức năng: đối lập (однако, при этом), bản chất (по сути), tổng kết (в целом), nhượng bộ (хотя). Dự đoán câu tiếp theo dựa trên từ nối.",
    tip_advice_en:
      "Learn markers by function group: contrast (однако, при этом), essence (по сути), summary (в целом), concession (хотя). Predict the next sentence from the marker.",
  },
];

export default lessons;
