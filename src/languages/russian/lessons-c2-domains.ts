// src/languages/russian/lessons-c2-domains.ts
//
// C2 specialized-domain lessons converted from the local Vietnamese-Russian archive:
//   c2-law-academy.md, c2-law-policy-corpus.md, c2-economics-corpus.md,
//   c2-economics-finance-academy.md, c2-history-corpus.md,
//   c2-science-technology-corpus.md, c2-philosophy-corpus.md,
//   c2-psychology-society-corpus.md, c2-medicine-academy.md,
//   c2-computer-science-academy.md.
//
// Compact, app-ready subset. Native review is deferred — study support only.
// This module is standalone and intentionally NOT wired into loadLessonsForLevel
// (lessons.ts still reports C2: 0 for the foundation batch).

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_c2_law_contract_formation",
    level: "C2",
    category: "practical_tasks",
    title_vi: "C2: Hợp đồng — sự hình thành và ý chí các bên",
    title_en: "C2: Contracts — formation and intent of the parties",
    intro_vi:
      "Đọc ngôn ngữ hợp đồng C2: phân biệt đàm phán sơ bộ với chấp thuận cuối cùng, và vì sao ngôn từ mơ hồ làm thỏa thuận không thành.",
    intro_en:
      "C2 contract language: distinguishing preliminary talks from final consent, and why vague wording can prevent a binding agreement.",
    sentences: [
      {
        russian: "Договор возникает из согласованного намерения сторон.",
        romanization: "Dogovor voznikayet iz soglasovannogo namereniya storon.",
        en: "A contract arises from the agreed intention of the parties.",
        vi: "Hợp đồng phát sinh từ ý chí thống nhất của các bên.",
        pronunciation_focus: ["договор nhấn -ГОВ", "согласованного là sinh cách", "сторон là sinh cách số nhiều"],
        pronunciation_focus_en: ["договор stresses -GOV", "согласованного is genitive", "сторон is genitive plural"],
      },
      {
        russian: "Важно отличать предварительное обсуждение от окончательного волеизъявления.",
        romanization: "Vazhno otlichat predvaritelnoye obsuzhdeniye ot okonchatelnogo voleizyavleniya.",
        en: "It is important to distinguish preliminary discussion from a final expression of will.",
        vi: "Cần phân biệt thảo luận sơ bộ với sự thể hiện ý chí cuối cùng.",
        pronunciation_focus: ["отличать + đối cách", "от + sinh cách", "волеизъявление là từ ghép dài"],
        pronunciation_focus_en: ["отличать + accusative", "от + genitive", "волеизъявление is a long compound noun"],
      },
      {
        russian: "Если формулировка остаётся неопределённой, соглашение может быть не достигнуто.",
        romanization: "Yesli formulirovka ostayotsya neopredelyonnoy, soglasheniye mozhet byt ne dostignuto.",
        en: "If the wording remains vague, the agreement may not be reached.",
        vi: "Nếu cách diễn đạt còn mơ hồ, thỏa thuận có thể không đạt được.",
        pronunciation_focus: ["остаётся có ё nhấn", "неопределённой là công cụ cách", "достигнуто là phân từ bị động"],
        pronunciation_focus_en: ["остаётся has stressed ё", "неопределённой is instrumental", "достигнуто is a passive participle"],
      },
      {
        russian: "Существенные условия должны быть согласованы сторонами.",
        romanization: "Sushchestvennye usloviya dolzhny byt soglasovany storonami.",
        en: "The essential terms must be agreed by the parties.",
        vi: "Các điều khoản cốt yếu phải được các bên thống nhất.",
        pronunciation_focus: ["существенные có сущ", "должны быть + phân từ", "сторонами là công cụ cách"],
        pronunciation_focus_en: ["существенные has сущ", "должны быть + participle", "сторонами is instrumental"],
      },
    ],
    vocabulary: [
      { cell_id: "45191b7a-5866-411e-9be0-7363afee4812", word: "договор", romanization: "dogovor", en: "contract", vi: "hợp đồng", pos: "noun", pronunciation_vi: "da-ga-VOR", pronunciation_en: "da-ga-VOR" },
      { cell_id: "6f5b2ead-e5ff-49fa-9f8d-b01767168ffc", word: "намерение", romanization: "namereniye", en: "intention", vi: "ý chí / ý định", pos: "noun", pronunciation_vi: "na-MYE-rye-ni-ye", pronunciation_en: "na-MYE-rye-nee-ye" },
      { cell_id: "66e566a8-2c6a-419a-a340-9f90e2f4afe3", word: "волеизъявление", romanization: "voleizyavleniye", en: "expression of will", vi: "sự thể hiện ý chí", pos: "noun", pronunciation_vi: "vo-le-iz-yav-LYE-ni-ye", pronunciation_en: "vo-le-iz-yav-LYE-nee-ye" },
      { cell_id: "4078721a-8d39-41a6-a440-751969f5b8e2", word: "существенные условия", romanization: "sushchestvennye usloviya", en: "essential terms", vi: "điều khoản cốt yếu", pos: "noun phrase", pronunciation_vi: "su-SHCHEST-ven-nye us-LO-vi-ya", pronunciation_en: "su-SHCHEST-ven-nye us-LO-vee-ya" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Hợp đồng phát sinh từ ý chí thống nhất của các bên.", answer: "Договор возникает из согласованного намерения сторон." },
          { prompt: "Các điều khoản cốt yếu phải được các bên thống nhất.", answer: "Существенные условия должны быть согласованы сторонами." },
        ],
      },
    ],
    cultural_notes_vi:
      "Ngôn ngữ pháp lý Nga ưu tiên danh từ trừu tượng và thể bị động. `волеизъявление` thay cho `người ta muốn`, giúp văn bản trung lập và chính xác hơn.",
    cultural_notes_en:
      "Russian legal style favors abstract nouns and the passive voice. `волеизъявление` replaces `someone wanted`, keeping the text neutral and precise.",
    tip_advice_vi:
      "Khi đọc hợp đồng, hỏi: ý chí có thống nhất không, điều khoản cốt yếu nào đã chốt, chỗ nào còn mơ hồ.",
    tip_advice_en:
      "When reading a contract, ask: is intent aligned, which essential terms are settled, and where is the wording still vague.",
  },
  {
    id: "russian_c2_law_breach_remedies",
    level: "C2",
    category: "practical_tasks",
    title_vi: "C2: Vi phạm hợp đồng và biện pháp khắc phục",
    title_en: "C2: Breach of contract and remedies",
    intro_vi:
      "Không phải vi phạm nào cũng dẫn tới chấm dứt hợp đồng. Học cách nói về phạt vi phạm, bồi thường và nguyên tắc tương xứng.",
    intro_en:
      "Not every breach ends a contract. Learn to talk about penalties, damages, and the principle of proportionality.",
    sentences: [
      {
        russian: "Нарушение договора не всегда ведёт к расторжению.",
        romanization: "Narusheniye dogovora ne vsegda vedyot k rastorzheniyu.",
        en: "A breach of contract does not always lead to termination.",
        vi: "Vi phạm hợp đồng không phải lúc nào cũng dẫn tới chấm dứt.",
        pronunciation_focus: ["нарушение nhấn -ШЕ", "вести к + tặng cách", "расторжению là tặng cách"],
        pronunciation_focus_en: ["нарушение stresses -SHE", "вести к + dative", "расторжению is dative"],
      },
      {
        russian: "Иногда уместны неустойка или возмещение убытков.",
        romanization: "Inogda umestny neustoyka ili vozmeshcheniye ubytkov.",
        en: "Sometimes a penalty or compensation for losses is appropriate.",
        vi: "Đôi khi phạt vi phạm hoặc bồi thường thiệt hại là phù hợp.",
        pronunciation_focus: ["уместны = phù hợp", "неустойка = phạt vi phạm", "убытков là sinh cách số nhiều"],
        pronunciation_focus_en: ["уместны means appropriate", "неустойка is a contractual penalty", "убытков is genitive plural"],
      },
      {
        russian: "Суд выбирает меру, защищающую кредитора.",
        romanization: "Sud vybirayet meru, zashchishchayushchuyu kreditora.",
        en: "The court chooses a measure that protects the creditor.",
        vi: "Tòa chọn biện pháp bảo vệ bên có quyền (chủ nợ).",
        pronunciation_focus: ["меру là đối cách", "защищающую là phân từ chủ động", "кредитора là đối cách"],
        pronunciation_focus_en: ["меру is accusative", "защищающую is an active participle", "кредитора is accusative"],
      },
      {
        russian: "Принцип соразмерности ограничивает санкции.",
        romanization: "Printsip sorazmernosti ogranichivayet sanktsii.",
        en: "The principle of proportionality limits sanctions.",
        vi: "Nguyên tắc tương xứng giới hạn chế tài.",
        pronunciation_focus: ["соразмерности là sinh cách", "ограничивает = giới hạn", "санкции là đối cách số nhiều"],
        pronunciation_focus_en: ["соразмерности is genitive", "ограничивает means limits", "санкции is accusative plural"],
      },
    ],
    vocabulary: [
      { cell_id: "1d1ce00a-96d6-4266-8f68-44d5802e04ca", word: "нарушение", romanization: "narusheniye", en: "breach / violation", vi: "vi phạm", pos: "noun", pronunciation_vi: "na-ru-SHE-ni-ye", pronunciation_en: "na-ru-SHE-nee-ye" },
      { cell_id: "795be8a4-2d74-4392-af41-40a9c30a7215", word: "расторжение", romanization: "rastorzheniye", en: "termination", vi: "chấm dứt hợp đồng", pos: "noun", pronunciation_vi: "ras-tar-ZHE-ni-ye", pronunciation_en: "ras-tar-ZHE-nee-ye" },
      { cell_id: "dfb7e2ce-645e-4812-89bf-82a507e651ed", word: "возмещение убытков", romanization: "vozmeshcheniye ubytkov", en: "damages / compensation for losses", vi: "bồi thường thiệt hại", pos: "noun phrase", pronunciation_vi: "vaz-mye-SHCHE-ni-ye u-BYT-kaf", pronunciation_en: "vaz-mye-SHCHE-nee-ye u-BYT-kaf" },
      { cell_id: "d307d55e-6e5e-4c42-823c-d518b832353e", word: "соразмерность", romanization: "sorazmernost", en: "proportionality", vi: "tính tương xứng", pos: "noun", pronunciation_vi: "sa-raz-MYER-nast", pronunciation_en: "sa-raz-MYER-nast" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Vi phạm hợp đồng không phải lúc nào cũng dẫn tới chấm dứt.", answer: "Нарушение договора не всегда ведёт к расторжению." },
          { prompt: "Nguyên tắc tương xứng giới hạn chế tài.", answer: "Принцип соразмерности ограничивает санкции." },
        ],
      },
    ],
    cultural_notes_vi:
      "Trong luật Nga, biện pháp khắc phục là một thang bậc: phạt vi phạm, bồi thường, buộc thực hiện đúng nghĩa vụ — không mặc định chấm dứt.",
    cultural_notes_en:
      "In Russian law, remedies form a ladder: penalty, damages, specific performance — termination is not the default.",
    tip_advice_vi:
      "Khi bàn về vi phạm, nêu rõ: mức độ vi phạm + biện pháp đề xuất + vì sao nó tương xứng.",
    tip_advice_en:
      "When discussing a breach, state: the severity + the proposed remedy + why it is proportionate.",
  },
  {
    id: "russian_c2_law_policy_legitimacy",
    level: "C2",
    category: "practical_tasks",
    title_vi: "C2: Luật và chính sách — tính hợp pháp và tính chính danh",
    title_en: "C2: Law and policy — legality and legitimacy",
    intro_vi:
      "Một thủ tục đúng hình thức chưa chắc đã chính danh. Học ngôn ngữ về thẩm quyền, kiểm soát và quyền khiếu nại.",
    intro_en:
      "A formally correct procedure is not automatically legitimate. Learn the language of authority, oversight, and the right to appeal.",
    sentences: [
      {
        russian: "Формальная законность не равна легитимности.",
        romanization: "Formalnaya zakonnost ne ravna legitimnosti.",
        en: "Formal legality is not equal to legitimacy.",
        vi: "Tính hợp pháp hình thức không bằng tính chính danh.",
        pronunciation_focus: ["законность nhấn -КОН", "не равна + tặng cách", "легитимности là tặng cách"],
        pronunciation_focus_en: ["законность stresses -KON", "не равна + dative", "легитимности is dative"],
      },
      {
        russian: "Процедура без возможности обжалования остаётся спорной.",
        romanization: "Protsedura bez vozmozhnosti obzhalovaniya ostayotsya spornoy.",
        en: "A procedure without the possibility of appeal remains contestable.",
        vi: "Thủ tục không có khả năng khiếu nại vẫn còn gây tranh cãi.",
        pronunciation_focus: ["без + sinh cách", "обжалования là sinh cách", "спорной là công cụ cách"],
        pronunciation_focus_en: ["без + genitive", "обжалования is genitive", "спорной is instrumental"],
      },
      {
        russian: "Механизмы контроля предотвращают произвол.",
        romanization: "Mekhanizmy kontrolya predotvrashchayut proizvol.",
        en: "Oversight mechanisms prevent arbitrariness.",
        vi: "Các cơ chế kiểm soát ngăn ngừa sự tùy tiện.",
        pronunciation_focus: ["контроля là sinh cách", "предотвращают = ngăn ngừa", "произвол = sự tùy tiện"],
        pronunciation_focus_en: ["контроля is genitive", "предотвращают means prevent", "произвол means arbitrariness"],
      },
      {
        russian: "Решение требует прозрачного основания.",
        romanization: "Resheniye trebuyet prozrachnogo osnovaniya.",
        en: "A decision requires a transparent basis.",
        vi: "Một quyết định cần có cơ sở minh bạch.",
        pronunciation_focus: ["требует + sinh cách", "прозрачного là sinh cách", "основания là sinh cách"],
        pronunciation_focus_en: ["требует + genitive", "прозрачного is genitive", "основания is genitive"],
      },
    ],
    vocabulary: [
      { cell_id: "9fad5625-44ce-4cc3-b13c-adc8293de301", word: "легитимность", romanization: "legitimnost", en: "legitimacy", vi: "tính chính danh", pos: "noun", pronunciation_vi: "le-gi-TIM-nast", pronunciation_en: "le-gee-TEEM-nast" },
      { cell_id: "67d51dff-0885-43f4-9b21-900b6dd7fdf5", word: "обжалование", romanization: "obzhalovaniye", en: "appeal", vi: "khiếu nại / kháng nghị", pos: "noun", pronunciation_vi: "ab-ZHA-la-va-ni-ye", pronunciation_en: "ab-ZHA-la-va-nee-ye" },
      { cell_id: "2f6ddf18-ce8e-4482-aa16-a206c4e473a4", word: "произвол", romanization: "proizvol", en: "arbitrariness / abuse of power", vi: "sự tùy tiện / lạm quyền", pos: "noun", pronunciation_vi: "pra-iz-VOL", pronunciation_en: "pra-eez-VOL" },
      { cell_id: "f1a6b777-2add-4674-b708-3da90833c734", word: "полномочия", romanization: "polnomochiya", en: "powers / authority", vi: "thẩm quyền", pos: "noun", pronunciation_vi: "pal-na-MO-chi-ya", pronunciation_en: "pal-na-MO-chee-ya" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tính hợp pháp hình thức không bằng tính chính danh.", answer: "Формальная законность не равна легитимности." },
          { prompt: "Các cơ chế kiểm soát ngăn ngừa sự tùy tiện.", answer: "Механизмы контроля предотвращают произвол." },
        ],
      },
    ],
    cultural_notes_vi:
      "Lập luận chính sách C2 luôn hỏi: ai quyết định, trên cơ sở nào, ai kiểm soát, và có thể khiếu nại không.",
    cultural_notes_en:
      "C2 policy argument always asks: who decides, on what basis, who provides oversight, and is appeal possible.",
    tip_advice_vi:
      "Tách `законность` (đúng luật) khỏi `легитимность` (được chấp nhận) — đây là khác biệt cốt lõi của văn bản chính sách.",
    tip_advice_en:
      "Separate `законность` (lawful) from `легитимность` (accepted) — this distinction is central to policy writing.",
  },
  {
    id: "russian_c2_economics_inflation_expectations",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Kinh tế — kỳ vọng lạm phát",
    title_en: "C2: Economics — inflation expectations",
    intro_vi:
      "Kỳ vọng lạm phát không chỉ là dự báo bị động; nó tự trở thành lực đẩy giá. Học chuỗi nhân-quả kinh tế bằng tiếng Nga.",
    intro_en:
      "Inflation expectations are not passive forecasts; they become an active force on prices. Learn the economic causal chain in Russian.",
    sentences: [
      {
        russian: "Инфляционные ожидания сами поддерживают рост цен.",
        romanization: "Inflyatsionnye ozhidaniya sami podderzhivayut rost tsen.",
        en: "Inflation expectations themselves sustain the rise in prices.",
        vi: "Kỳ vọng lạm phát tự nó duy trì sự tăng giá.",
        pronunciation_focus: ["инфляционные là tính từ dài", "поддерживают = duy trì", "цен là sinh cách số nhiều"],
        pronunciation_focus_en: ["инфляционные is a long adjective", "поддерживают means sustain", "цен is genitive plural"],
      },
      {
        russian: "Компании заранее повышают цены.",
        romanization: "Kompanii zaranee povyshayut tseny.",
        en: "Companies raise prices in advance.",
        vi: "Doanh nghiệp tăng giá trước.",
        pronunciation_focus: ["заранее = trước", "повышают = nâng lên", "цены là đối cách số nhiều"],
        pronunciation_focus_en: ["заранее means in advance", "повышают means raise", "цены is accusative plural"],
      },
      {
        russian: "Работники требуют компенсации потери дохода.",
        romanization: "Rabotniki trebuyut kompensatsii poteri dokhoda.",
        en: "Workers demand compensation for the loss of income.",
        vi: "Người lao động đòi bù đắp phần thu nhập bị mất.",
        pronunciation_focus: ["требуют + sinh cách", "компенсации là sinh cách", "дохода là sinh cách"],
        pronunciation_focus_en: ["требуют + genitive", "компенсации is genitive", "дохода is genitive"],
      },
      {
        russian: "Прогноз превращается в часть механизма.",
        romanization: "Prognoz prevrashchayetsya v chast mekhanizma.",
        en: "The forecast turns into part of the mechanism.",
        vi: "Dự báo biến thành một phần của cơ chế.",
        pronunciation_focus: ["превращается в + đối cách", "часть = một phần", "механизма là sinh cách"],
        pronunciation_focus_en: ["превращается в + accusative", "часть means part", "механизма is genitive"],
      },
    ],
    vocabulary: [
      { cell_id: "0ee736c3-98c9-4073-815d-7bcc3ad3dad8", word: "инфляционные ожидания", romanization: "inflyatsionnye ozhidaniya", en: "inflation expectations", vi: "kỳ vọng lạm phát", pos: "noun phrase", pronunciation_vi: "in-flya-tsi-ON-nye a-zhi-DA-ni-ya", pronunciation_en: "in-flya-tsi-ON-nye a-zhee-DA-nee-ya" },
      { cell_id: "97d0d417-3ab3-4166-9336-dac775d51907", word: "рост цен", romanization: "rost tsen", en: "price growth", vi: "sự tăng giá", pos: "noun phrase", pronunciation_vi: "rost tsen", pronunciation_en: "rost tsen" },
      { cell_id: "bde3f945-4548-4917-8952-1fd31174d6bb", word: "компенсация", romanization: "kompensatsiya", en: "compensation", vi: "bù đắp", pos: "noun", pronunciation_vi: "kam-pen-SA-tsi-ya", pronunciation_en: "kam-pen-SA-tsee-ya" },
      { cell_id: "f7abcf69-9077-4da1-be45-ce72e9fcca59", word: "механизм", romanization: "mekhanizm", en: "mechanism", vi: "cơ chế", pos: "noun", pronunciation_vi: "mye-kha-NIZM", pronunciation_en: "mye-kha-NEEZM" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Doanh nghiệp tăng giá trước.", answer: "Компании заранее повышают цены." },
          { prompt: "Dự báo biến thành một phần của cơ chế.", answer: "Прогноз превращается в часть механизма." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối nguyên nhân–kết quả.",
        instruction_en: "Fill in the cause–effect connector.",
        items: [{ prompt: "Покупатели ускоряют расходы, _____ цены растут. (в результате / однако)", answer: "в результате" }],
      },
    ],
    cultural_notes_vi:
      "Tiếng Nga kinh tế C2 thích danh từ hóa (`рост`, `замедление`) và liên kết nhân-quả rõ ràng thay vì nhiều câu ngắn.",
    cultural_notes_en:
      "C2 economic Russian prefers nominalization (`рост`, `замедление`) and explicit causal links over many short clauses.",
    tip_advice_vi:
      "Đánh dấu từ nhân-quả khi đọc: `в результате`, `вследствие`, `что приводит к` — chúng là khung lập luận.",
    tip_advice_en:
      "Mark causal words while reading: `в результате`, `вследствие`, `что приводит к` — they frame the argument.",
  },
  {
    id: "russian_c2_economics_monetary_policy",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Kinh tế — chính sách tiền tệ và lãi suất",
    title_en: "C2: Economics — monetary policy and interest rates",
    intro_vi:
      "Tăng lãi suất làm giảm cầu nhưng tác động không đều. Học cách nói chính sách tưởng kỹ thuật nhưng có hệ quả phân phối.",
    intro_en:
      "Raising rates cools demand, but unevenly. Learn to describe a policy that looks technical yet has distributional effects.",
    sentences: [
      {
        russian: "Повышение ключевой ставки охлаждает спрос.",
        romanization: "Povysheniye klyuchevoy stavki okhlazhdayet spros.",
        en: "Raising the key rate cools demand.",
        vi: "Việc tăng lãi suất chính sách làm giảm cầu.",
        pronunciation_focus: ["ключевой ставки là sinh cách", "охлаждает = làm nguội/giảm", "спрос = cầu"],
        pronunciation_focus_en: ["ключевой ставки is genitive", "охлаждает means cools", "спрос means demand"],
      },
      {
        russian: "Эффект распределяется неравномерно.",
        romanization: "Effekt raspredelyayetsya neravnomerno.",
        en: "The effect is distributed unevenly.",
        vi: "Tác động được phân bổ không đều.",
        pronunciation_focus: ["распределяется có -ться", "неравномерно = không đều", "nhấn -МЕР"],
        pronunciation_focus_en: ["распределяется has -ться", "неравномерно means unevenly", "stress on -MER"],
      },
      {
        russian: "Малый бизнес переживает дорогие кредиты тяжелее.",
        romanization: "Malyy biznes perezhivayet dorogiye kredity tyazhelee.",
        en: "Small business endures expensive credit harder.",
        vi: "Doanh nghiệp nhỏ chịu đựng tín dụng đắt đỏ nặng nề hơn.",
        pronunciation_focus: ["переживает = chịu đựng", "дорогие кредиты là đối cách số nhiều", "тяжелее là so sánh hơn"],
        pronunciation_focus_en: ["переживает means endures", "дорогие кредиты is accusative plural", "тяжелее is comparative"],
      },
      {
        russian: "Антиинфляционная политика имеет распределительный эффект.",
        romanization: "Antiinflyatsionnaya politika imeyet raspredelitelnyy effekt.",
        en: "Anti-inflation policy has a distributional effect.",
        vi: "Chính sách chống lạm phát có tác động phân phối.",
        pronunciation_focus: ["антиинфляционная là tính từ rất dài", "имеет = có", "распределительный = phân phối"],
        pronunciation_focus_en: ["антиинфляционная is a very long adjective", "имеет means has", "распределительный means distributional"],
      },
    ],
    vocabulary: [
      { cell_id: "855d3423-44a4-4bfc-b407-deb3aa0662e2", word: "ключевая ставка", romanization: "klyuchevaya stavka", en: "key interest rate", vi: "lãi suất chính sách", pos: "noun phrase", pronunciation_vi: "klyu-che-VA-ya STAV-ka", pronunciation_en: "klyu-che-VA-ya STAV-ka" },
      { cell_id: "6b4ed945-5d2a-440e-abb2-54b39ef7093c", word: "охлаждать спрос", romanization: "okhlazhdat spros", en: "to cool demand", vi: "làm giảm cầu", pos: "verb phrase", pronunciation_vi: "akh-lazh-DAT spros", pronunciation_en: "akh-lazh-DAT spros" },
      { cell_id: "cf5098cd-d945-4745-8426-e65db618342c", word: "ипотека", romanization: "ipoteka", en: "mortgage", vi: "vay mua nhà", pos: "noun", pronunciation_vi: "i-pa-TYE-ka", pronunciation_en: "ee-pa-TYE-ka" },
      { cell_id: "87ecd42c-4235-488f-b36e-f15a00e48eaf", word: "распределительный эффект", romanization: "raspredelitelnyy effekt", en: "distributional effect", vi: "tác động phân phối", pos: "noun phrase", pronunciation_vi: "ras-pre-de-LI-tel-nyy ef-FEKT", pronunciation_en: "ras-pre-de-LEE-tel-nyy ef-FEKT" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Việc tăng lãi suất chính sách làm giảm cầu.", answer: "Повышение ключевой ставки охлаждает спрос." },
          { prompt: "Chính sách chống lạm phát có tác động phân phối.", answer: "Антиинфляционная политика имеет распределительный эффект." },
        ],
      },
    ],
    cultural_notes_vi:
      "Văn bản kinh tế C2 thường mô tả chính sách là `trung lập kỹ thuật` rồi chỉ ra hệ quả xã hội — học cách nhận diện sự đối lập này.",
    cultural_notes_en:
      "C2 economic texts often present policy as `technically neutral` then reveal social consequences — learn to spot this contrast.",
    tip_advice_vi:
      "Khi tóm tắt, nêu hai tầng: cơ chế kỹ thuật + ai gánh chi phí. Đó là dấu hiệu phân tích C2.",
    tip_advice_en:
      "When summarizing, give two layers: the technical mechanism + who bears the cost. That marks C2 analysis.",
  },
  {
    id: "russian_c2_finance_forecasting_hedging",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Tài chính — dự báo thận trọng và cách nói rào đón",
    title_en: "C2: Finance — cautious forecasting and hedging language",
    intro_vi:
      "Tiếng Nga tài chính C2 dự báo một cách thận trọng: `при прочих равных`, `вероятно`, `можно ожидать`. Học các khung rào đón.",
    intro_en:
      "C2 financial Russian forecasts cautiously: `при прочих равных`, `вероятно`, `можно ожидать`. Learn the hedging frames.",
    sentences: [
      {
        russian: "При прочих равных можно ожидать замедления роста.",
        romanization: "Pri prochikh ravnykh mozhno ozhidat zamedleniya rosta.",
        en: "All else being equal, one can expect a slowdown in growth.",
        vi: "Khi các yếu tố khác không đổi, có thể dự kiến tăng trưởng chậm lại.",
        pronunciation_focus: ["при прочих равных là cụm cố định", "ожидать + sinh cách", "замедления là sinh cách"],
        pronunciation_focus_en: ["при прочих равных is a fixed phrase", "ожидать + genitive", "замедления is genitive"],
      },
      {
        russian: "Вследствие шока вероятна краткосрочная нестабильность.",
        romanization: "Vsledstviye shoka veroyatna kratkosrochnaya nestabilnost.",
        en: "Owing to the shock, short-term instability is likely.",
        vi: "Do cú sốc, bất ổn ngắn hạn là điều có khả năng.",
        pronunciation_focus: ["вследствие + sinh cách", "вероятна = có khả năng", "краткосрочная = ngắn hạn"],
        pronunciation_focus_en: ["вследствие + genitive", "вероятна means likely", "краткосрочная means short-term"],
      },
      {
        russian: "Структурные реформы влияют на долгосрочную устойчивость.",
        romanization: "Strukturnye reformy vliyayut na dolgosrochnuyu ustoychivost.",
        en: "Structural reforms affect long-term sustainability.",
        vi: "Các cải cách cơ cấu ảnh hưởng tới sự bền vững dài hạn.",
        pronunciation_focus: ["влиять на + đối cách", "долгосрочную = dài hạn", "устойчивость = sự bền vững"],
        pronunciation_focus_en: ["влиять на + accusative", "долгосрочную means long-term", "устойчивость means sustainability"],
      },
      {
        russian: "Денежно-кредитная политика остаётся осторожной.",
        romanization: "Denezhno-kreditnaya politika ostayotsya ostorozhnoy.",
        en: "Monetary policy remains cautious.",
        vi: "Chính sách tiền tệ vẫn thận trọng.",
        pronunciation_focus: ["денежно-кредитная là cụm ghép", "остаётся có ё", "осторожной là công cụ cách"],
        pronunciation_focus_en: ["денежно-кредитная is a compound", "остаётся has ё", "осторожной is instrumental"],
      },
    ],
    vocabulary: [
      { cell_id: "d8b766f7-6ca9-497b-ac26-e982a96128f2", word: "при прочих равных", romanization: "pri prochikh ravnykh", en: "all else being equal (ceteris paribus)", vi: "khi các yếu tố khác không đổi", pos: "phrase", pronunciation_vi: "pri PRO-chikh RAV-nykh", pronunciation_en: "pri PRO-chikh RAV-nykh" },
      { cell_id: "80a9c7ea-4777-4f39-b49d-461d7ea76eee", word: "денежно-кредитная политика", romanization: "denezhno-kreditnaya politika", en: "monetary policy", vi: "chính sách tiền tệ", pos: "noun phrase", pronunciation_vi: "DYE-nezh-na kre-DIT-na-ya pa-LI-ti-ka", pronunciation_en: "DYE-nezh-na kre-DEET-na-ya pa-LEE-tee-ka" },
      { cell_id: "54e81d38-aaee-4b75-85de-083057c99202", word: "устойчивость", romanization: "ustoychivost", en: "sustainability / stability", vi: "sự bền vững", pos: "noun", pronunciation_vi: "us-TOY-chi-vast", pronunciation_en: "us-TOY-chee-vast" },
      { cell_id: "1c24145a-37b7-40b0-9392-50dad55adfc8", word: "вследствие", romanization: "vsledstviye", en: "owing to / as a result of", vi: "do / vì", pos: "preposition", pronunciation_vi: "FSLYED-stvi-ye", pronunciation_en: "FSLYED-stvee-ye" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Khi các yếu tố khác không đổi, có thể dự kiến tăng trưởng chậm lại.", answer: "При прочих равных можно ожидать замедления роста." },
          { prompt: "Chính sách tiền tệ vẫn thận trọng.", answer: "Денежно-кредитная политика остаётся осторожной." },
        ],
      },
    ],
    cultural_notes_vi:
      "Rào đón không phải sự thiếu chắc chắn mà là chuẩn mực học thuật: dự báo luôn kèm điều kiện. Bỏ rào đón nghe ngây thơ.",
    cultural_notes_en:
      "Hedging is not weakness but an academic norm: forecasts carry conditions. Dropping hedges sounds naive.",
    tip_advice_vi:
      "Học ba khung: điều kiện (`при прочих равных`), xác suất (`вероятно`), thời hạn (`в долгосрочной перспективе`).",
    tip_advice_en:
      "Learn three frames: condition (`при прочих равных`), probability (`вероятно`), horizon (`в долгосрочной перспективе`).",
  },
  {
    id: "russian_c2_history_fact_vs_interpretation",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Lịch sử — sự kiện và diễn giải",
    title_en: "C2: History — fact versus interpretation",
    intro_vi:
      "Quá khứ hiếm khi là danh sách sự kiện trần trụi. Học cách nhận ra ngôn ngữ diễn giải và đặt câu hỏi ai kể, vì sao.",
    intro_en:
      "The past is rarely a bare list of facts. Learn to spot the language of interpretation and ask who narrates, and why.",
    sentences: [
      {
        russian: "Прошлое редко существует как простой список фактов.",
        romanization: "Proshloye redko sushchestvuyet kak prostoy spisok faktov.",
        en: "The past rarely exists as a simple list of facts.",
        vi: "Quá khứ hiếm khi tồn tại như một danh sách sự kiện đơn giản.",
        pronunciation_focus: ["прошлое = quá khứ", "существует = tồn tại", "фактов là sinh cách số nhiều"],
        pronunciation_focus_en: ["прошлое means the past", "существует means exists", "фактов is genitive plural"],
      },
      {
        russian: "Важно видеть язык интерпретации.",
        romanization: "Vazhno videt yazyk interpretatsii.",
        en: "It is important to see the language of interpretation.",
        vi: "Điều quan trọng là thấy được ngôn ngữ của sự diễn giải.",
        pronunciation_focus: ["видеть + đối cách", "язык = ngôn ngữ", "интерпретации là sinh cách"],
        pronunciation_focus_en: ["видеть + accusative", "язык means language", "интерпретации is genitive"],
      },
      {
        russian: "Семейная память и официальная версия не всегда совпадают.",
        romanization: "Semeynaya pamyat i ofitsialnaya versiya ne vsegda sovpadayut.",
        en: "Family memory and the official version do not always coincide.",
        vi: "Ký ức gia đình và phiên bản chính thức không phải lúc nào cũng trùng khớp.",
        pronunciation_focus: ["семейная память là cụm giống cái", "официальная версия", "совпадают = trùng khớp"],
        pronunciation_focus_en: ["семейная память is a feminine phrase", "официальная версия = official version", "совпадают means coincide"],
      },
      {
        russian: "Зрелый читатель спрашивает, кто и зачем описывает событие.",
        romanization: "Zrelyy chitatel sprashivayet, kto i zachem opisyvayet sobytiye.",
        en: "A mature reader asks who describes the event and why.",
        vi: "Người đọc trưởng thành hỏi ai và vì sao mô tả sự kiện đó.",
        pronunciation_focus: ["зрелый = trưởng thành", "зачем = vì mục đích gì", "событие = sự kiện"],
        pronunciation_focus_en: ["зрелый means mature", "зачем means for what purpose", "событие means event"],
      },
    ],
    vocabulary: [
      { cell_id: "07ccb183-ecf1-43f6-a961-43d4067b07fa", word: "интерпретация", romanization: "interpretatsiya", en: "interpretation", vi: "sự diễn giải", pos: "noun", pronunciation_vi: "in-ter-pre-TA-tsi-ya", pronunciation_en: "in-ter-pre-TA-tsee-ya" },
      { cell_id: "b4013322-dacf-4168-9b90-ea6fee1e2945", word: "официальная версия", romanization: "ofitsialnaya versiya", en: "official version", vi: "phiên bản chính thức", pos: "noun phrase", pronunciation_vi: "a-fi-tsi-AL-na-ya VYER-si-ya", pronunciation_en: "a-fee-tsee-AL-na-ya VYER-see-ya" },
      { cell_id: "1007be24-eb5f-4428-a965-95cfd256497d", word: "источник", romanization: "istochnik", en: "source", vi: "nguồn", pos: "noun", pronunciation_vi: "is-TOCH-nik", pronunciation_en: "ees-TOCH-neek" },
      { cell_id: "b2c14282-e166-4fa3-86c6-6aa4b1468e6b", word: "событие", romanization: "sobytiye", en: "event", vi: "sự kiện", pos: "noun", pronunciation_vi: "sa-BY-ti-ye", pronunciation_en: "sa-BY-tee-ye" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Quá khứ hiếm khi tồn tại như một danh sách sự kiện đơn giản.", answer: "Прошлое редко существует как простой список фактов." },
          { prompt: "Người đọc trưởng thành hỏi ai và vì sao mô tả sự kiện đó.", answer: "Зрелый читатель спрашивает, кто и зачем описывает событие." },
        ],
      },
    ],
    cultural_notes_vi:
      "Phân tích lịch sử C2 chú ý tới cách gọi tên: cùng một việc có thể là `cải cách`, `khủng hoảng`, `giải phóng` hay `mất mát`.",
    cultural_notes_en:
      "C2 historical analysis watches the naming: the same event can be called `reform`, `crisis`, `liberation`, or `loss`.",
    tip_advice_vi:
      "Trước khi tin một tường thuật, hỏi: nguồn nào, ai kể, giọng nào bị bỏ ngoài câu chuyện.",
    tip_advice_en:
      "Before trusting a narrative, ask: which source, who narrates, whose voice is left out.",
  },
  {
    id: "russian_c2_science_data_quality",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Khoa học — chất lượng dữ liệu và phương pháp",
    title_en: "C2: Science — data quality and methodology",
    intro_vi:
      "Tiếng Nga khoa học C2 đi từ vấn đề → giới hạn → tiêu chí đánh giá → điều kiện tin cậy. Học chuỗi logic này.",
    intro_en:
      "C2 scientific Russian moves from problem → limitation → evaluation criteria → reliability conditions. Learn this logical chain.",
    sentences: [
      {
        russian: "Качество данных определяет надёжность выводов.",
        romanization: "Kachestvo dannykh opredelyayet nadyozhnost vyvodov.",
        en: "Data quality determines the reliability of conclusions.",
        vi: "Chất lượng dữ liệu quyết định độ tin cậy của các kết luận.",
        pronunciation_focus: ["качество = chất lượng", "надёжность có ё", "выводов là sinh cách số nhiều"],
        pronunciation_focus_en: ["качество means quality", "надёжность has ё", "выводов is genitive plural"],
      },
      {
        russian: "Ошибки измерения искажают результат.",
        romanization: "Oshibki izmereniya iskazhayut rezultat.",
        en: "Measurement errors distort the result.",
        vi: "Sai số đo lường làm sai lệch kết quả.",
        pronunciation_focus: ["ошибки измерения là cụm chuyên ngành", "искажают = làm sai lệch", "результат = kết quả"],
        pronunciation_focus_en: ["ошибки измерения is a technical phrase", "искажают means distort", "результат means result"],
      },
      {
        russian: "Репрезентативность выборки нельзя оценивать изолированно.",
        romanization: "Reprezentativnost vyborki nelzya otsenivat izolirovanno.",
        en: "Sample representativeness cannot be assessed in isolation.",
        vi: "Tính đại diện của mẫu không thể đánh giá tách rời.",
        pronunciation_focus: ["репрезентативность là từ dài", "выборки là sinh cách", "изолированно = một cách tách rời"],
        pronunciation_focus_en: ["репрезентативность is a long word", "выборки is genitive", "изолированно means in isolation"],
      },
      {
        russian: "Зрелый подход требует прозрачности и воспроизводимости.",
        romanization: "Zrelyy podkhod trebuyet prozrachnosti i vosproizvodimosti.",
        en: "A mature approach requires transparency and reproducibility.",
        vi: "Một cách tiếp cận chững chạc đòi hỏi sự minh bạch và khả năng tái lập.",
        pronunciation_focus: ["требует + sinh cách", "прозрачности là sinh cách", "воспроизводимости là từ rất dài"],
        pronunciation_focus_en: ["требует + genitive", "прозрачности is genitive", "воспроизводимости is a very long word"],
      },
    ],
    vocabulary: [
      { cell_id: "b74a80fc-0b8e-448f-a415-c8ae85f295cc", word: "качество данных", romanization: "kachestvo dannykh", en: "data quality", vi: "chất lượng dữ liệu", pos: "noun phrase", pronunciation_vi: "KA-che-stva DAN-nykh", pronunciation_en: "KA-che-stva DAN-nykh" },
      { cell_id: "d68e7867-baa2-4dbd-b1d5-998d0b502345", word: "выборка", romanization: "vyborka", en: "sample", vi: "mẫu", pos: "noun", pronunciation_vi: "VY-bar-ka", pronunciation_en: "VY-bar-ka" },
      { cell_id: "ea7cfb34-8425-4a84-ad16-799b4e2dcb59", word: "воспроизводимость", romanization: "vosproizvodimost", en: "reproducibility", vi: "khả năng tái lập", pos: "noun", pronunciation_vi: "vas-pra-iz-va-DI-mast", pronunciation_en: "vas-pra-eez-va-DEE-mast" },
      { cell_id: "cc6f69a6-56eb-4af7-9908-4c8067c27c61", word: "допущение", romanization: "dopushcheniye", en: "assumption", vi: "giả định", pos: "noun", pronunciation_vi: "da-pu-SHCHE-ni-ye", pronunciation_en: "da-pu-SHCHE-nee-ye" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Chất lượng dữ liệu quyết định độ tin cậy của các kết luận.", answer: "Качество данных определяет надёжность выводов." },
          { prompt: "Sai số đo lường làm sai lệch kết quả.", answer: "Ошибки измерения искажают результат." },
        ],
      },
    ],
    cultural_notes_vi:
      "Văn bản khoa học Nga dùng nhiều danh từ động từ (`измерение`, `оценка`) và giọng vô nhân xưng thay vì nhiều câu `tôi/chúng tôi`.",
    cultural_notes_en:
      "Russian scientific text uses verbal nouns (`измерение`, `оценка`) and an impersonal voice instead of many `I/we` clauses.",
    tip_advice_vi:
      "Khi tóm tắt một nghiên cứu, luôn nêu giới hạn và điều kiện tin cậy — đó là dấu hiệu đọc hiểu C2.",
    tip_advice_en:
      "When summarizing a study, always state the limitations and reliability conditions — a sign of C2 reading.",
  },
  {
    id: "russian_c2_philosophy_responsibility",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Triết học — trách nhiệm và xung đột giá trị",
    title_en: "C2: Philosophy — responsibility and value conflict",
    intro_vi:
      "Trách nhiệm không phải một quy tắc rõ ràng mà là sự căng kéo giữa nhiều giá trị. Học từ vựng trừu tượng và lập luận mở.",
    intro_en:
      "Responsibility is not a clear rule but a tension among several values. Learn abstract vocabulary and open-ended argument.",
    sentences: [
      {
        russian: "Ответственность редко имеет один окончательный ответ.",
        romanization: "Otvetstvennost redko imeyet odin okonchatelnyy otvet.",
        en: "Responsibility rarely has a single final answer.",
        vi: "Trách nhiệm hiếm khi có một câu trả lời cuối cùng.",
        pronunciation_focus: ["ответственность là từ dài", "окончательный = cuối cùng", "ответ = câu trả lời"],
        pronunciation_focus_en: ["ответственность is a long word", "окончательный means final", "ответ means answer"],
      },
      {
        russian: "Человек выбирает между несколькими ценностями.",
        romanization: "Chelovek vybirayet mezhdu neskolkimi tsennostyami.",
        en: "A person chooses among several values.",
        vi: "Con người chọn lựa giữa nhiều giá trị.",
        pronunciation_focus: ["между + công cụ cách", "несколькими là công cụ cách", "ценностями là công cụ cách số nhiều"],
        pronunciation_focus_en: ["между + instrumental", "несколькими is instrumental", "ценностями is instrumental plural"],
      },
      {
        russian: "Привычные слова перестают быть очевидными.",
        romanization: "Privychnye slova perestayut byt ochevidnymi.",
        en: "Familiar words stop being self-evident.",
        vi: "Những từ quen thuộc thôi còn hiển nhiên.",
        pronunciation_focus: ["привычные = quen thuộc", "перестают быть + công cụ cách", "очевидными = hiển nhiên"],
        pronunciation_focus_en: ["привычные means familiar", "перестают быть + instrumental", "очевидными means self-evident"],
      },
      {
        russian: "Философия уточняет, что мы на самом деле защищаем.",
        romanization: "Filosofiya utochnyayet, chto my na samom dele zashchishchayem.",
        en: "Philosophy clarifies what we are actually defending.",
        vi: "Triết học làm rõ điều mà chúng ta thực sự bảo vệ.",
        pronunciation_focus: ["уточняет = làm rõ", "на самом деле = thực ra", "защищаем = bảo vệ"],
        pronunciation_focus_en: ["уточняет means clarifies", "на самом деле means actually", "защищаем means defend"],
      },
    ],
    vocabulary: [
      { cell_id: "28d29ef9-96f4-43af-9d01-f3974e21493b", word: "ответственность", romanization: "otvetstvennost", en: "responsibility", vi: "trách nhiệm", pos: "noun", pronunciation_vi: "at-VYET-stven-nast", pronunciation_en: "at-VYET-stven-nast" },
      { cell_id: "33d31f65-dc2b-44db-bfdf-51d6eb2a5eec", word: "ценность", romanization: "tsennost", en: "value", vi: "giá trị", pos: "noun", pronunciation_vi: "TSEN-nast", pronunciation_en: "TSEN-nast" },
      { cell_id: "6ff76b84-ac2b-4e7f-943d-75434176f1c1", word: "последствия", romanization: "posledstviya", en: "consequences", vi: "hậu quả", pos: "noun", pronunciation_vi: "pas-LYED-stvi-ya", pronunciation_en: "pas-LYED-stvee-ya" },
      { cell_id: "7725c2c0-0ee9-48be-9626-887f1b7aa5e2", word: "напряжение между ценностями", romanization: "napryazheniye mezhdu tsennostyami", en: "tension between values", vi: "sự căng kéo giữa các giá trị", pos: "noun phrase", pronunciation_vi: "na-prya-ZHE-ni-ye MYEZH-du TSEN-nas-tya-mi", pronunciation_en: "na-prya-ZHE-nee-ye MYEZH-du TSEN-nas-tya-mee" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Con người chọn lựa giữa nhiều giá trị.", answer: "Человек выбирает между несколькими ценностями." },
          { prompt: "Triết học làm rõ điều mà chúng ta thực sự bảo vệ.", answer: "Философия уточняет, что мы на самом деле защищаем." },
        ],
      },
    ],
    cultural_notes_vi:
      "Văn bản triết học C2 thường không đưa kết luận dứt khoát mà buộc người đọc phân tích các giá trị đang xung đột.",
    cultural_notes_en:
      "C2 philosophical text often withholds a firm conclusion and forces the reader to analyze conflicting values.",
    tip_advice_vi:
      "Khi phản hồi, nêu giá trị nào đang căng với giá trị nào, thay vì gán đúng/sai tuyệt đối.",
    tip_advice_en:
      "When responding, name which value strains against which, instead of assigning absolute right/wrong.",
  },
  {
    id: "russian_c2_psychology_stress_society",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Tâm lý và xã hội — căng thẳng và cách nói thận trọng",
    title_en: "C2: Psychology and society — stress and careful language",
    intro_vi:
      "Hành vi không chỉ do tính cách. Học cách mô tả căng thẳng mà không dán nhãn thô sơ và tránh ngôn ngữ đổ lỗi.",
    intro_en:
      "Behavior is shaped by more than character. Learn to describe stress without crude labels and avoid blaming language.",
    sentences: [
      {
        russian: "Поведение формируется не только характером.",
        romanization: "Povedeniye formiruyetsya ne tolko kharakterom.",
        en: "Behavior is shaped not only by character.",
        vi: "Hành vi được hình thành không chỉ bởi tính cách.",
        pronunciation_focus: ["поведение = hành vi", "формируется có -ться", "характером là công cụ cách"],
        pronunciation_focus_en: ["поведение means behavior", "формируется has -ться", "характером is instrumental"],
      },
      {
        russian: "Внешне спокойный человек может быть в напряжении.",
        romanization: "Vneshne spokoynyy chelovek mozhet byt v napryazhenii.",
        en: "An outwardly calm person may be under strain.",
        vi: "Một người bề ngoài bình tĩnh có thể đang căng thẳng.",
        pronunciation_focus: ["внешне = bề ngoài", "спокойный = bình tĩnh", "в напряжении là giới cách"],
        pronunciation_focus_en: ["внешне means outwardly", "спокойный means calm", "в напряжении is prepositional"],
      },
      {
        russian: "Молчание не всегда означает согласие.",
        romanization: "Molchaniye ne vsegda oznachayet soglasiye.",
        en: "Silence does not always mean agreement.",
        vi: "Sự im lặng không phải lúc nào cũng có nghĩa là đồng ý.",
        pronunciation_focus: ["молчание = sự im lặng", "означает = có nghĩa là", "согласие = sự đồng ý"],
        pronunciation_focus_en: ["молчание means silence", "означает means signifies", "согласие means agreement"],
      },
      {
        russian: "Хорошее объяснение избегает грубых ярлыков.",
        romanization: "Khorosheye obyasneniye izbegayet grubykh yarlykov.",
        en: "A good explanation avoids crude labels.",
        vi: "Một lời giải thích tốt tránh những nhãn dán thô sơ.",
        pronunciation_focus: ["объяснение có ъ", "избегает + sinh cách", "ярлыков là sinh cách số nhiều"],
        pronunciation_focus_en: ["объяснение has hard sign ъ", "избегает + genitive", "ярлыков is genitive plural"],
      },
    ],
    vocabulary: [
      { cell_id: "524a4d3e-d835-44c8-907d-1f486e2f1eaa", word: "внутреннее напряжение", romanization: "vnutrenneye napryazheniye", en: "inner tension", vi: "căng thẳng bên trong", pos: "noun phrase", pronunciation_vi: "VNU-tren-ne-ye na-prya-ZHE-ni-ye", pronunciation_en: "VNU-tren-ne-ye na-prya-ZHE-nee-ye" },
      { cell_id: "f29568cb-dd0d-4d4b-b1fd-209c3963392e", word: "грубый ярлык", romanization: "grubyy yarlyk", en: "crude label", vi: "nhãn dán thô sơ", pos: "noun phrase", pronunciation_vi: "GRU-byy yar-LYK", pronunciation_en: "GRU-byy yar-LYK" },
      { cell_id: "fd03fc41-327c-4729-944f-9aec8787ed5e", word: "восстановление доверия", romanization: "vosstanovleniye doveriya", en: "rebuilding trust", vi: "khôi phục niềm tin", pos: "noun phrase", pronunciation_vi: "vas-sta-na-VLYE-ni-ye da-VYE-ri-ya", pronunciation_en: "vas-sta-na-VLYE-nee-ye da-VYE-ree-ya" },
      { cell_id: "b2c0d3a4-44a4-4583-b923-a193b28c4c98", word: "согласие", romanization: "soglasiye", en: "agreement / consent", vi: "sự đồng ý", pos: "noun", pronunciation_vi: "sa-GLA-si-ye", pronunciation_en: "sa-GLA-see-ye" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Sự im lặng không phải lúc nào cũng có nghĩa là đồng ý.", answer: "Молчание не всегда означает согласие." },
          { prompt: "Một lời giải thích tốt tránh những nhãn dán thô sơ.", answer: "Хорошее объяснение избегает грубых ярлыков." },
        ],
      },
    ],
    cultural_notes_vi:
      "Ở C2, mô tả con người cần nêu nguyên nhân, ranh giới trách nhiệm và lối thoát, thay vì dán nhãn nhanh.",
    cultural_notes_en:
      "At C2, describing people means naming causes, the limits of responsibility, and a way forward, not quick labeling.",
    tip_advice_vi:
      "Đổi `anh ấy lười` thành `có nhiều yếu tố ảnh hưởng tới hành vi` — giọng phân tích, không phán xét.",
    tip_advice_en:
      "Turn `he is lazy` into `several factors shape the behavior` — analytical, not judgmental.",
  },
  {
    id: "russian_c2_medicine_clinical_language",
    level: "C2",
    category: "practical_tasks",
    title_vi: "C2: Y khoa — ngôn ngữ lâm sàng và khai thác bệnh sử",
    title_en: "C2: Medicine — clinical language and history-taking",
    intro_vi:
      "Y khoa tiếng Nga C2: phân biệt bệnh sử, triệu chứng, chẩn đoán và biến chứng; nói chính xác mà vẫn an toàn, lịch sự. Chỉ là hỗ trợ học, không phải tư vấn y tế.",
    intro_en:
      "C2 medical Russian: distinguishing history, symptoms, diagnosis, and complications; speaking precisely yet safely and politely. Study support only, not medical advice.",
    sentences: [
      {
        russian: "Врач собирает анамнез перед постановкой диагноза.",
        romanization: "Vrach sobirayet anamnez pered postanovkoy diagnoza.",
        en: "The doctor takes the medical history before making a diagnosis.",
        vi: "Bác sĩ khai thác bệnh sử trước khi đưa ra chẩn đoán.",
        pronunciation_focus: ["анамнез là thuật ngữ y khoa", "перед + công cụ cách", "диагноза là sinh cách"],
        pronunciation_focus_en: ["анамнез is a medical term", "перед + instrumental", "диагноза is genitive"],
      },
      {
        russian: "Жалобы пациента описывают основные симптомы.",
        romanization: "Zhaloby patsiyenta opisyvayut osnovnye simptomy.",
        en: "The patient's complaints describe the main symptoms.",
        vi: "Lời than phiền của bệnh nhân mô tả các triệu chứng chính.",
        pronunciation_focus: ["жалобы = than phiền/triệu chứng khai báo", "пациента là sinh cách", "симптомы là đối cách số nhiều"],
        pronunciation_focus_en: ["жалобы means complaints", "пациента is genitive", "симптомы is accusative plural"],
      },
      {
        russian: "Хроническое состояние отличается от острого.",
        romanization: "Khronicheskoye sostoyaniye otlichayetsya ot ostrogo.",
        en: "A chronic condition differs from an acute one.",
        vi: "Tình trạng mạn tính khác với cấp tính.",
        pronunciation_focus: ["хроническое = mạn tính", "отличается от + sinh cách", "острого = cấp tính"],
        pronunciation_focus_en: ["хроническое means chronic", "отличается от + genitive", "острого means acute"],
      },
      {
        russian: "Осложнение требует пересмотра лечения.",
        romanization: "Oslozhneniye trebuyet peresmotra lecheniya.",
        en: "A complication requires revising the treatment.",
        vi: "Biến chứng đòi hỏi xem xét lại phác đồ điều trị.",
        pronunciation_focus: ["осложнение = biến chứng", "требует + sinh cách", "лечения là sinh cách"],
        pronunciation_focus_en: ["осложнение means complication", "требует + genitive", "лечения is genitive"],
      },
    ],
    vocabulary: [
      { cell_id: "768d4e26-ce81-4a0b-ac22-b50b4abe7b87", word: "анамнез", romanization: "anamnez", en: "medical history", vi: "bệnh sử", pos: "noun", pronunciation_vi: "a-NAM-nez", pronunciation_en: "a-NAM-nez" },
      { cell_id: "1d9b0ee8-ab87-4c37-aa5f-ddcbf9e32b63", word: "диагноз", romanization: "diagnoz", en: "diagnosis", vi: "chẩn đoán", pos: "noun", pronunciation_vi: "di-AG-naz", pronunciation_en: "dee-AG-naz" },
      { cell_id: "cb9fa9fe-c05c-472f-8087-f7362804b0e0", word: "осложнение", romanization: "oslozhneniye", en: "complication", vi: "biến chứng", pos: "noun", pronunciation_vi: "as-lazh-NYE-ni-ye", pronunciation_en: "as-lazh-NYE-nee-ye" },
      { cell_id: "a2fb88dd-4e40-4754-a88a-71a1d9d99a15", word: "хронический", romanization: "khronicheskiy", en: "chronic", vi: "mạn tính", pos: "adjective", pronunciation_vi: "khra-NI-che-skiy", pronunciation_en: "khra-NEE-che-skeey" },
    ],
    dialogue: [
      {
        cell_id: "811f15bf-7153-47e8-b8e2-15ce0093ed79",
        speaker: "Врач",
        text: "Расскажите, пожалуйста, на что вы жалуетесь?",
        romanization: "Rasskazhite, pozhaluysta, na chto vy zhaluyetes?",
        vi: "Xin hãy kể, anh/chị than phiền về điều gì?",
        en: "Please tell me, what are you complaining of?",
      },
      {
        cell_id: "fe8191a7-4b34-4a43-9077-a0316fb80bc2",
        speaker: "Пациент",
        text: "У меня хронические боли, и состояние ухудшается.",
        romanization: "U menya khronicheskiye boli, i sostoyaniye ukhudshayetsya.",
        vi: "Tôi bị đau mạn tính, và tình trạng đang xấu đi.",
        en: "I have chronic pain, and the condition is worsening.",
      },
      {
        cell_id: "b7a0c51a-9ec6-4ad7-a4b2-eb1020d33477",
        speaker: "Врач",
        text: "Соберём анамнез, прежде чем поставить диагноз.",
        romanization: "Soberyom anamnez, prezhde chem postavit diagnoz.",
        vi: "Chúng ta sẽ khai thác bệnh sử trước khi đặt chẩn đoán.",
        en: "We will take the history before making a diagnosis.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tình trạng mạn tính khác với cấp tính.", answer: "Хроническое состояние отличается от острого." },
          { prompt: "Biến chứng đòi hỏi xem xét lại phác đồ điều trị.", answer: "Осложнение требует пересмотра лечения." },
        ],
      },
    ],
    cultural_notes_vi:
      "Hồ sơ y khoa Nga phân tầng rõ: жалобы (than phiền) → анамнез (bệnh sử) → диагноз (chẩn đoán). Nhầm tầng làm mất độ chính xác.",
    cultural_notes_en:
      "Russian records are clearly tiered: жалобы (complaints) → анамнез (history) → диагноз (diagnosis). Mixing tiers loses precision.",
    tip_advice_vi:
      "Dùng giọng thận trọng: `состояние ухудшается` thay vì khẳng định tuyệt đối. Đây là hỗ trợ học, không thay tư vấn y tế.",
    tip_advice_en:
      "Use cautious phrasing: `состояние ухудшается` rather than absolute claims. This is study support, not medical advice.",
  },
  {
    id: "russian_c2_computer_science_tradeoffs",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Khoa học máy tính — văn phong kỹ thuật và sự đánh đổi",
    title_en: "C2: Computer science — technical style and trade-offs",
    intro_vi:
      "Văn bản kỹ thuật Nga vô nhân xưng, chính xác và thận trọng. Học cách đọc lập luận, hiểu trade-off và nêu giới hạn.",
    intro_en:
      "Russian technical text is impersonal, precise, and cautious. Learn to read the argument, grasp trade-offs, and state limitations.",
    sentences: [
      {
        russian: "Технический текст обычно безличный и точный.",
        romanization: "Tekhnicheskiy tekst obychno bezlichnyy i tochnyy.",
        en: "Technical text is usually impersonal and precise.",
        vi: "Văn bản kỹ thuật thường vô nhân xưng và chính xác.",
        pronunciation_focus: ["технический = kỹ thuật", "безличный = vô nhân xưng", "точный = chính xác"],
        pronunciation_focus_en: ["технический means technical", "безличный means impersonal", "точный means precise"],
      },
      {
        russian: "Следует учитывать ограничения системы.",
        romanization: "Sleduyet uchityvat ogranicheniya sistemy.",
        en: "One should take into account the system's limitations.",
        vi: "Cần tính đến các giới hạn của hệ thống.",
        pronunciation_focus: ["следует + nguyên mẫu là cấu trúc vô nhân xưng", "учитывать = tính đến", "ограничения là đối cách số nhiều"],
        pronunciation_focus_en: ["следует + infinitive is an impersonal structure", "учитывать means take into account", "ограничения is accusative plural"],
      },
      {
        russian: "Каждое решение имеет компромисс.",
        romanization: "Kazhdoye resheniye imeyet kompromiss.",
        en: "Every decision involves a trade-off.",
        vi: "Mỗi quyết định đều có sự đánh đổi.",
        pronunciation_focus: ["каждое решение = mỗi quyết định", "имеет = có", "компромисс = sự đánh đổi/thỏa hiệp"],
        pronunciation_focus_en: ["каждое решение means every decision", "имеет means has", "компромисс means trade-off"],
      },
      {
        russian: "В большинстве случаев надёжность важнее скорости.",
        romanization: "V bolshinstve sluchayev nadyozhnost vazhnee skorosti.",
        en: "In most cases reliability matters more than speed.",
        vi: "Trong đa số trường hợp, độ tin cậy quan trọng hơn tốc độ.",
        pronunciation_focus: ["в большинстве случаев là cụm cố định", "важнее là so sánh hơn", "скорости là sinh cách"],
        pronunciation_focus_en: ["в большинстве случаев is a fixed phrase", "важнее is comparative", "скорости is genitive"],
      },
    ],
    vocabulary: [
      { cell_id: "d23c7ed7-9f5a-4739-9d54-de207d16d3dc", word: "ограничение", romanization: "ogranicheniye", en: "limitation / constraint", vi: "giới hạn / hạn chế", pos: "noun", pronunciation_vi: "ag-ra-ni-CHE-ni-ye", pronunciation_en: "ag-ra-nee-CHE-nee-ye" },
      { cell_id: "a84ee6ac-25d6-4ad8-ac87-eb2218ee9f11", word: "компромисс", romanization: "kompromiss", en: "trade-off / compromise", vi: "sự đánh đổi", pos: "noun", pronunciation_vi: "kam-pra-MISS", pronunciation_en: "kam-pra-MEESS" },
      { cell_id: "8f231702-5699-4bb6-b782-c672729a0e47", word: "надёжность", romanization: "nadyozhnost", en: "reliability", vi: "độ tin cậy", pos: "noun", pronunciation_vi: "na-DYOZH-nast", pronunciation_en: "na-DYOZH-nast" },
      { cell_id: "7a6797b5-966c-4007-b9e1-864da9857240", word: "производительность", romanization: "proizvoditelnost", en: "performance", vi: "hiệu năng", pos: "noun", pronunciation_vi: "pra-iz-va-DI-tel-nast", pronunciation_en: "pra-eez-va-DEE-tel-nast" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Cần tính đến các giới hạn của hệ thống.", answer: "Следует учитывать ограничения системы." },
          { prompt: "Trong đa số trường hợp, độ tin cậy quan trọng hơn tốc độ.", answer: "В большинстве случаев надёжность важнее скорости." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Hoàn thành cụm vô nhân xưng.",
        instruction_en: "Complete the impersonal phrase.",
        items: [{ prompt: "_____ обеспечить безопасность данных. (необходимо / я хочу)", answer: "необходимо" }],
      },
    ],
    cultural_notes_vi:
      "Văn bản CS Nga tách mô tả hệ thống khỏi kết luận. Cụm `ограничение заключается в том, что...` báo hiệu phần giới hạn.",
    cultural_notes_en:
      "Russian CS text separates system description from conclusion. `ограничение заключается в том, что...` flags the limitation.",
    tip_advice_vi:
      "Dùng cấu trúc vô nhân xưng (`следует`, `необходимо`, `можно рассматривать как`) để viết tự nhiên hơn `я делаю`.",
    tip_advice_en:
      "Use impersonal structures (`следует`, `необходимо`, `можно рассматривать как`) for more natural prose than `я делаю`.",
  },
  {
    id: "russian_c2_finance_public_finance",
    level: "C2",
    category: "connected_speech",
    title_vi: "C2: Tài chính công — ngân sách, nợ công và tái phân phối",
    title_en: "C2: Public finance — budget, public debt, and redistribution",
    intro_vi:
      "Tài chính công C2: nói về thâm hụt, củng cố tài khóa và tác động phân phối với giọng phân tích và thận trọng.",
    intro_en:
      "C2 public finance: discussing deficits, fiscal consolidation, and distributional effects in an analytical, cautious voice.",
    sentences: [
      {
        russian: "Фискальная консолидация сокращает дефицит бюджета.",
        romanization: "Fiskalnaya konsolidatsiya sokrashchayet defitsit byudzheta.",
        en: "Fiscal consolidation reduces the budget deficit.",
        vi: "Củng cố tài khóa làm giảm thâm hụt ngân sách.",
        pronunciation_focus: ["фискальная консолидация là cụm chuyên ngành", "сокращает = làm giảm", "бюджета là sinh cách"],
        pronunciation_focus_en: ["фискальная консолидация is a domain phrase", "сокращает means reduces", "бюджета is genitive"],
      },
      {
        russian: "Государственный долг влияет на доверие инвесторов.",
        romanization: "Gosudarstvennyy dolg vliyayet na doveriye investorov.",
        en: "Public debt affects investor confidence.",
        vi: "Nợ công ảnh hưởng tới niềm tin của nhà đầu tư.",
        pronunciation_focus: ["государственный là tính từ dài", "влиять на + đối cách", "инвесторов là sinh cách số nhiều"],
        pronunciation_focus_en: ["государственный is a long adjective", "влиять на + accusative", "инвесторов is genitive plural"],
      },
      {
        russian: "Перераспределение затрагивает разные социальные группы.",
        romanization: "Pereraspredeleniye zatragivayet raznye sotsialnye gruppy.",
        en: "Redistribution affects different social groups.",
        vi: "Sự tái phân phối tác động tới các nhóm xã hội khác nhau.",
        pronunciation_focus: ["перераспределение là từ rất dài", "затрагивает = tác động tới", "группы là đối cách số nhiều"],
        pronunciation_focus_en: ["перераспределение is a very long word", "затрагивает means affects", "группы is accusative plural"],
      },
      {
        russian: "В долгосрочной перспективе важна устойчивость бюджета.",
        romanization: "V dolgosrochnoy perspektive vazhna ustoychivost byudzheta.",
        en: "In the long run, budget sustainability matters.",
        vi: "Về dài hạn, sự bền vững ngân sách là điều quan trọng.",
        pronunciation_focus: ["в долгосрочной перспективе là cụm cố định", "важна giống cái", "устойчивость = sự bền vững"],
        pronunciation_focus_en: ["в долгосрочной перспективе is a fixed phrase", "важна is feminine", "устойчивость means sustainability"],
      },
    ],
    vocabulary: [
      { cell_id: "4e65a1d4-c387-462c-8147-5e9ba510a12f", word: "фискальная консолидация", romanization: "fiskalnaya konsolidatsiya", en: "fiscal consolidation", vi: "củng cố tài khóa", pos: "noun phrase", pronunciation_vi: "fis-KAL-na-ya kan-sa-li-DA-tsi-ya", pronunciation_en: "fees-KAL-na-ya kan-sa-lee-DA-tsee-ya" },
      { cell_id: "db92aeea-5a70-480b-97ad-fca0ef9e9b2f", word: "государственный долг", romanization: "gosudarstvennyy dolg", en: "public debt", vi: "nợ công", pos: "noun phrase", pronunciation_vi: "ga-su-DAR-stven-nyy dolg", pronunciation_en: "ga-su-DAR-stven-nyy dolg" },
      { cell_id: "f4be44d7-3748-4582-9bf8-cdfc66093305", word: "дефицит бюджета", romanization: "defitsit byudzheta", en: "budget deficit", vi: "thâm hụt ngân sách", pos: "noun phrase", pronunciation_vi: "de-fi-TSIT byu-DZHE-ta", pronunciation_en: "de-fee-TSEET byu-DZHE-ta" },
      { cell_id: "a5f1d901-83cc-4fef-9344-22d0d665f721", word: "перераспределение", romanization: "pereraspredeleniye", en: "redistribution", vi: "tái phân phối", pos: "noun", pronunciation_vi: "pe-re-ras-pre-de-LYE-ni-ye", pronunciation_en: "pe-re-ras-pre-de-LYE-nee-ye" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Nợ công ảnh hưởng tới niềm tin của nhà đầu tư.", answer: "Государственный долг влияет на доверие инвесторов." },
          { prompt: "Về dài hạn, sự bền vững ngân sách là điều quan trọng.", answer: "В долгосрочной перспективе важна устойчивость бюджета." },
        ],
      },
    ],
    cultural_notes_vi:
      "Tài chính công C2 thường gắn con số kỹ thuật (thâm hụt, nợ) với hệ quả xã hội (ai chịu chi phí) — đó là tầng lập luận cao hơn.",
    cultural_notes_en:
      "C2 public finance links technical figures (deficit, debt) to social consequences (who bears the cost) — a higher layer of argument.",
    tip_advice_vi:
      "Khung tóm tắt: biện pháp tài khóa + mục tiêu + nhóm chịu tác động + rủi ro dài hạn.",
    tip_advice_en:
      "Summary frame: the fiscal measure + its goal + the affected group + the long-term risk.",
  },
];

export default lessons;
