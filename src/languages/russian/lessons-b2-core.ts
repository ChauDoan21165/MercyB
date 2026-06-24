// src/languages/russian/lessons-b2-core.ts
//
// B2 core lesson batch converted from the local Vietnamese-Russian archive:
// b2-standard-audit.md, b2-readiness-audit.md, conversation-mastery.md,
// writing-practice-book.md, writing-corrections-corpus.md, advanced-grammar-cases.md.
//
// Focus per the B2 audit: argument structure, professional/work + travel
// situations, writing correction, advanced cases, and natural phrasing.
// Compact and app-ready — not a dump of the source files.
//
// This batch ships as a standalone, self-validated module. The shared loader in
// `lessons.ts` is intentionally left untouched (B2 stays at 0 there) so the
// foundation batch and its tests are unaffected.

import type { RussianLesson } from "./lessons";

export const lessons: RussianLesson[] = [
  {
    id: "russian_b2_argument_structure",
    level: "B2",
    category: "connected_speech",
    title_vi: "B2: Dựng lập luận — quan điểm, lý do, bằng chứng, kết luận",
    title_en: "B2: Building an argument — claim, reason, evidence, conclusion",
    intro_vi:
      "Ở B2, trả lời một câu là chưa đủ. Người nghe mong một lập luận: nêu quan điểm, đưa lý do, dẫn bằng chứng, rồi chốt kết luận.",
    intro_en:
      "At B2 a one-line answer is not enough. Listeners expect an argument: state a claim, give a reason, cite evidence, then close with a conclusion.",
    sentences: [
      {
        russian: "Я убеждён, что удалённая работа эффективнее для многих задач.",
        romanization: "Ya ubezhdyon, chto udalyonnaya rabota effektivneye dlya mnogikh zadach.",
        en: "I am convinced that remote work is more effective for many tasks.",
        vi: "Tôi tin rằng làm việc từ xa hiệu quả hơn cho nhiều công việc.",
        pronunciation_focus: ["я убеждён = tôi tin chắc (nam)", "что mở mệnh đề quan điểm", "эффективнее là so sánh hơn"],
        pronunciation_focus_en: ["я убеждён states a firm claim (male)", "что opens the claim clause", "эффективнее is comparative"],
      },
      {
        russian: "Во-первых, люди тратят меньше времени на дорогу.",
        romanization: "Vo-pervykh, lyudi tratyat menshe vremeni na dorogu.",
        en: "Firstly, people spend less time commuting.",
        vi: "Thứ nhất, người ta mất ít thời gian đi lại hơn.",
        pronunciation_focus: ["во-первых mở lý do thứ nhất", "меньше времени + sinh cách", "на дорогу = cho việc đi lại"],
        pronunciation_focus_en: ["во-первых opens the first reason", "меньше времени + genitive", "на дорогу means on commuting"],
      },
      {
        russian: "Например, исследования показывают рост продуктивности.",
        romanization: "Naprimer, issledovaniya pokazyvayut rost produktivnosti.",
        en: "For example, studies show a rise in productivity.",
        vi: "Ví dụ, các nghiên cứu cho thấy năng suất tăng.",
        pronunciation_focus: ["например dẫn bằng chứng", "исследования показывают = nghiên cứu cho thấy", "рост продуктивности = sự tăng năng suất"],
        pronunciation_focus_en: ["например introduces evidence", "исследования показывают means studies show", "рост продуктивности means rise in productivity"],
      },
      {
        russian: "Поэтому я считаю, что компаниям стоит сохранить этот формат.",
        romanization: "Poetomu ya schitayu, chto kompaniyam stoit sokhranit etot format.",
        en: "Therefore I believe companies should keep this format.",
        vi: "Vì vậy tôi cho rằng các công ty nên giữ hình thức này.",
        pronunciation_focus: ["поэтому chốt kết luận", "компаниям là tặng cách", "стоит + nguyên mẫu = nên"],
        pronunciation_focus_en: ["поэтому closes the conclusion", "компаниям is dative", "стоит + infinitive means should"],
      },
    ],
    vocabulary: [
      {
        word: "я убеждён / убеждена",
        romanization: "ya ubezhdyon / ubezhdena",
        en: "I am convinced",
        vi: "tôi tin chắc",
        pos: "phrase",
        pronunciation_vi: "ya u-bezh-DYON / u-bezh-de-NA",
        pronunciation_en: "ya oo-bezh-DYON / oo-bezh-deh-NA",
      },
      {
        word: "во-первых",
        romanization: "vo-pervykh",
        en: "firstly",
        vi: "thứ nhất",
        pos: "connector",
        pronunciation_vi: "va-PYER-vykh",
        pronunciation_en: "va-PYER-vykh",
      },
      {
        word: "например",
        romanization: "naprimer",
        en: "for example",
        vi: "ví dụ",
        pos: "connector",
        pronunciation_vi: "na-pri-MYER",
        pronunciation_en: "na-pree-MYER",
      },
      {
        word: "стоит",
        romanization: "stoit",
        en: "it is worth / one should",
        vi: "nên / đáng",
        pos: "verb (impersonal)",
        pronunciation_vi: "STO-it",
        pronunciation_en: "STOH-eet",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Thứ nhất, người ta mất ít thời gian đi lại hơn.", answer: "Во-первых, люди тратят меньше времени на дорогу." },
          { prompt: "Vì vậy tôi cho rằng các công ty nên giữ hình thức này.", answer: "Поэтому я считаю, что компаниям стоит сохранить этот формат." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối dẫn bằng chứng.",
        instruction_en: "Fill in the connector that introduces evidence.",
        items: [{ prompt: "_____, исследования показывают рост продуктивности.", answer: "Например" }],
      },
    ],
    cultural_notes_vi:
      "Khung B2 chuẩn: quan điểm → во-первых/во-вторых (lý do) → например (bằng chứng) → поэтому (kết luận). Có khung này, lập luận nghe trưởng thành dù từ vựng còn đơn giản.",
    cultural_notes_en:
      "The standard B2 frame: claim → во-первых/во-вторых (reasons) → например (evidence) → поэтому (conclusion). With this frame your argument sounds mature even with simple vocabulary.",
    tip_advice_vi:
      "Luôn dán nhãn từng bước. Một bằng chứng cụ thể (`например...`) thuyết phục hơn ba câu chung chung.",
    tip_advice_en:
      "Always label each step. One concrete piece of evidence (`например...`) persuades more than three vague sentences.",
  },
  {
    id: "russian_b2_polite_disagreement",
    level: "B2",
    category: "connected_speech",
    title_vi: "B2: Phản biện và nhượng bộ lịch sự trong tranh luận",
    title_en: "B2: Polite disagreement and concession in debate",
    intro_vi:
      "B2 cần phản biện mà không gây va chạm: công nhận một phần ý đối phương, rồi nêu phản đề bằng giọng mềm.",
    intro_en:
      "B2 needs disagreement without friction: concede part of the other view, then raise a counterpoint in a soft tone.",
    sentences: [
      {
        russian: "Я отчасти согласен, но вижу проблему иначе.",
        romanization: "Ya otchasti soglasen, no vizhu problemu inache.",
        en: "I partly agree, but I see the problem differently.",
        vi: "Tôi đồng ý một phần, nhưng tôi nhìn vấn đề khác đi.",
        pronunciation_focus: ["отчасти = một phần (nhượng bộ)", "согласен dạng nam", "иначе = theo cách khác"],
        pronunciation_focus_en: ["отчасти means partly (concession)", "согласен is masculine", "иначе means differently"],
      },
      {
        russian: "С одной стороны, это удобно, но с другой — это дорого.",
        romanization: "S odnoy storony, eto udobno, no s drugoy — eto dorogo.",
        en: "On one hand it is convenient, but on the other it is expensive.",
        vi: "Một mặt thì tiện, nhưng mặt khác thì đắt.",
        pronunciation_focus: ["с одной стороны / с другой = một mặt / mặt khác", "но nối tương phản", "удобно vs дорого"],
        pronunciation_focus_en: ["с одной стороны / с другой = on one hand / the other", "но links the contrast", "удобно vs дорого"],
      },
      {
        russian: "Тем не менее, у меня есть серьёзные возражения.",
        romanization: "Tem ne meneye, u menya yest seryoznyye vozrazheniya.",
        en: "Nevertheless, I have serious objections.",
        vi: "Tuy vậy, tôi có những phản đối nghiêm túc.",
        pronunciation_focus: ["тем не менее = tuy vậy (văn viết/trang trọng)", "серьёзные có ё nhấn", "возражения = sự phản đối"],
        pronunciation_focus_en: ["тем не менее means nevertheless (formal)", "серьёзные stresses ё", "возражения means objections"],
      },
      {
        russian: "Давайте найдём решение, которое устроит обе стороны.",
        romanization: "Davayte naydyom resheniye, kotoroye ustroit obe storony.",
        en: "Let's find a solution that suits both sides.",
        vi: "Hãy tìm một giải pháp làm hài lòng cả hai bên.",
        pronunciation_focus: ["давайте найдём = hãy cùng tìm", "которое nối mệnh đề", "устроит обе стороны = làm vừa lòng hai bên"],
        pronunciation_focus_en: ["давайте найдём means let's find", "которое links the clause", "устроит обе стороны means suits both sides"],
      },
    ],
    vocabulary: [
      {
        word: "отчасти",
        romanization: "otchasti",
        en: "partly",
        vi: "một phần",
        pos: "adverb",
        pronunciation_vi: "at-CHAS-ti",
        pronunciation_en: "at-CHAS-tee",
      },
      {
        word: "с одной стороны",
        romanization: "s odnoy storony",
        en: "on one hand",
        vi: "một mặt",
        pos: "phrase",
        pronunciation_vi: "s ad-NOY sta-ra-NY",
        pronunciation_en: "s ad-NOY sta-ra-NY",
      },
      {
        word: "тем не менее",
        romanization: "tem ne meneye",
        en: "nevertheless",
        vi: "tuy vậy",
        pos: "connector",
        pronunciation_vi: "tyem ne MYE-ne-ye",
        pronunciation_en: "tyem ne MYE-ne-yeh",
      },
      {
        word: "возражение",
        romanization: "vozrazheniye",
        en: "objection",
        vi: "sự phản đối",
        pos: "noun",
        pronunciation_vi: "va-zra-ZHE-ni-ye",
        pronunciation_en: "va-zra-ZHE-nee-yeh",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi đồng ý một phần, nhưng tôi nhìn vấn đề khác đi.", answer: "Я отчасти согласен, но вижу проблему иначе." },
          { prompt: "Hãy tìm một giải pháp làm hài lòng cả hai bên.", answer: "Давайте найдём решение, которое устроит обе стороны." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm tương phản trang trọng.",
        instruction_en: "Fill in the formal contrast connector.",
        items: [{ prompt: "_____, у меня есть серьёзные возражения.", answer: "Тем не менее" }],
      },
    ],
    cultural_notes_vi:
      "Phản đối thẳng (`Вы не правы`) nghe gay gắt. Mẫu `Я отчасти согласен, но...` và `с одной стороны... с другой...` giữ lịch sự mà vẫn nêu được ý.",
    cultural_notes_en:
      "Blunt disagreement (`Вы не правы`) sounds harsh. `Я отчасти согласен, но...` and `с одной стороны... с другой...` stay polite while still making your point.",
    tip_advice_vi:
      "Luôn nhượng bộ một câu trước khi phản đối. Kết bằng đề xuất chung để cuộc tranh luận không thành đối đầu.",
    tip_advice_en:
      "Concede one sentence before you object. End with a shared proposal so the debate does not turn into a standoff.",
  },
  {
    id: "russian_b2_stance_and_implication",
    level: "B2",
    category: "connected_speech",
    title_vi: "B2: Thái độ, hàm ý và sắc thái tự nhiên",
    title_en: "B2: Stance, implication, and natural nuance",
    intro_vi:
      "B2 không chỉ nói sự thật mà còn nói thái độ: nghi ngờ, dè dặt, nhấn mạnh, hàm ý. Các cụm đệm giúp câu nghe như người bản xứ.",
    intro_en:
      "B2 conveys not just facts but stance: doubt, caution, emphasis, implication. Hedging chunks make speech sound native.",
    sentences: [
      {
        russian: "Честно говоря, я сомневаюсь, что это сработает.",
        romanization: "Chestno govorya, ya somnevayus, chto eto srabotayet.",
        en: "Honestly, I doubt this will work.",
        vi: "Thành thật mà nói, tôi nghi ngờ điều này sẽ hiệu quả.",
        pronunciation_focus: ["честно говоря = thành thật mà nói", "сомневаюсь, что = nghi ngờ rằng", "сработает là tương lai hoàn thành"],
        pronunciation_focus_en: ["честно говоря means honestly", "сомневаюсь, что means I doubt that", "сработает is perfective future"],
      },
      {
        russian: "Похоже, что решение приняли слишком быстро.",
        romanization: "Pokhozhe, chto resheniye prinyali slishkom bystro.",
        en: "It seems the decision was made too quickly.",
        vi: "Có vẻ như quyết định đã được đưa ra quá nhanh.",
        pronunciation_focus: ["похоже, что = có vẻ như", "приняли = người ta đã quyết (chủ thể ẩn)", "слишком быстро = quá nhanh"],
        pronunciation_focus_en: ["похоже, что means it seems", "приняли = they decided (impersonal)", "слишком быстро means too quickly"],
      },
      {
        russian: "На самом деле проблема гораздо глубже.",
        romanization: "Na samom dele problema gorazdo glubzhe.",
        en: "In fact the problem is much deeper.",
        vi: "Thực ra vấn đề sâu hơn nhiều.",
        pronunciation_focus: ["на самом деле = thực ra", "гораздо + so sánh = ... hơn nhiều", "глубже = sâu hơn"],
        pronunciation_focus_en: ["на самом деле means in fact", "гораздо + comparative = much more", "глубже means deeper"],
      },
      {
        russian: "Скорее всего, нам придётся пересмотреть план.",
        romanization: "Skoree vsego, nam pridyotsya peresmotret plan.",
        en: "Most likely we will have to reconsider the plan.",
        vi: "Nhiều khả năng chúng ta sẽ phải xem lại kế hoạch.",
        pronunciation_focus: ["скорее всего = nhiều khả năng", "нам придётся + nguyên mẫu = chúng ta sẽ phải", "пересмотреть = xem lại"],
        pronunciation_focus_en: ["скорее всего means most likely", "нам придётся + infinitive = we will have to", "пересмотреть means reconsider"],
      },
    ],
    vocabulary: [
      {
        word: "честно говоря",
        romanization: "chestno govorya",
        en: "honestly speaking",
        vi: "thành thật mà nói",
        pos: "phrase",
        pronunciation_vi: "CHES-na ga-va-RYA",
        pronunciation_en: "CHES-na ga-va-RYA",
      },
      {
        word: "похоже",
        romanization: "pokhozhe",
        en: "it seems",
        vi: "có vẻ như",
        pos: "adverb/phrase",
        pronunciation_vi: "pa-KHO-zhe",
        pronunciation_en: "pa-KHO-zheh",
      },
      {
        word: "на самом деле",
        romanization: "na samom dele",
        en: "in fact / actually",
        vi: "thực ra",
        pos: "phrase",
        pronunciation_vi: "na SA-mam DYE-le",
        pronunciation_en: "na SA-mam DYE-leh",
      },
      {
        word: "скорее всего",
        romanization: "skoree vsego",
        en: "most likely",
        vi: "nhiều khả năng",
        pos: "phrase",
        pronunciation_vi: "ska-RYE-ye fse-VO",
        pronunciation_en: "ska-RYE-ye fse-VO",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Thành thật mà nói, tôi nghi ngờ điều này sẽ hiệu quả.", answer: "Честно говоря, я сомневаюсь, что это сработает." },
          { prompt: "Thực ra vấn đề sâu hơn nhiều.", answer: "На самом деле проблема гораздо глубже." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm đệm chỉ khả năng.",
        instruction_en: "Fill in the likelihood hedge.",
        items: [{ prompt: "_____, нам придётся пересмотреть план.", answer: "Скорее всего" }],
      },
    ],
    cultural_notes_vi:
      "Người Nga dùng nhiều cụm đệm (`честно говоря`, `на самом деле`, `скорее всего`) để báo thái độ. Bỏ chúng đi, câu đúng ngữ pháp nhưng nghe cứng và thẳng.",
    cultural_notes_en:
      "Russians use many hedges (`честно говоря`, `на самом деле`, `скорее всего`) to signal stance. Drop them and the sentence is grammatical but blunt.",
    tip_advice_vi:
      "Học các cụm đệm theo cặp với sắc thái: nghi ngờ, dè dặt, nhấn mạnh. Mỗi câu ý kiến nên có ít nhất một cụm.",
    tip_advice_en:
      "Learn hedges paired with their nuance: doubt, caution, emphasis. Every opinion sentence should carry at least one.",
  },
  {
    id: "russian_b2_workplace_handoff",
    level: "B2",
    category: "practical_tasks",
    title_vi: "B2: Bàn giao, leo thang và cập nhật ở nơi làm việc",
    title_en: "B2: Workplace handoff, escalation, and updates",
    intro_vi:
      "B2 công việc cần chuỗi rõ: tình huống, vấn đề, bằng chứng, đề xuất, xác nhận bước tiếp theo — đặc biệt khi bàn giao ca hoặc leo thang.",
    intro_en:
      "B2 workplace Russian needs a clear chain: situation, problem, evidence, proposal, confirm next step — especially for shift handoff or escalation.",
    sentences: [
      {
        russian: "Я передаю смену: заказ готов, но две позиции ещё не проверены.",
        romanization: "Ya peredayu smenu: zakaz gotov, no dve pozitsii yeshchyo ne provereny.",
        en: "I'm handing over the shift: the order is ready, but two items are not checked yet.",
        vi: "Tôi bàn giao ca: đơn hàng đã xong, nhưng hai mục chưa được kiểm.",
        pronunciation_focus: ["передаю смену = bàn giao ca", "две позиции = hai mục (số đếm + sinh cách số ít)", "не проверены = chưa được kiểm (bị động ngắn)"],
        pronunciation_focus_en: ["передаю смену means hand over the shift", "две позиции = two items (count + genitive sg.)", "не проверены = not checked (short passive)"],
      },
      {
        russian: "Возникла проблема, и я хочу её зафиксировать письменно.",
        romanization: "Voznikla problema, i ya khochu yeyo zafiksirovat pismenno.",
        en: "A problem has come up, and I want to record it in writing.",
        vi: "Có một vấn đề phát sinh, và tôi muốn ghi lại bằng văn bản.",
        pronunciation_focus: ["возникла проблема = vấn đề phát sinh (giống cái)", "зафиксировать = ghi nhận lại", "письменно = bằng văn bản"],
        pronunciation_focus_en: ["возникла проблема = a problem arose (feminine)", "зафиксировать means to record", "письменно means in writing"],
      },
      {
        russian: "Предлагаю передать вопрос руководителю до конца дня.",
        romanization: "Predlagayu peredat vopros rukovoditelyu do kontsa dnya.",
        en: "I suggest passing the issue to the manager by the end of the day.",
        vi: "Tôi đề nghị chuyển vấn đề cho quản lý trước cuối ngày.",
        pronunciation_focus: ["предлагаю = tôi đề nghị", "руководителю là tặng cách", "до конца дня = trước cuối ngày (sinh cách)"],
        pronunciation_focus_en: ["предлагаю means I suggest", "руководителю is dative", "до конца дня = by end of day (genitive)"],
      },
      {
        russian: "Подтвердите, пожалуйста, что вы приняли информацию.",
        romanization: "Podtverdite, pozhaluysta, chto vy prinyali informatsiyu.",
        en: "Please confirm that you received the information.",
        vi: "Xin xác nhận rằng anh/chị đã nhận thông tin.",
        pronunciation_focus: ["подтвердите = hãy xác nhận (lịch sự)", "что mở mệnh đề", "приняли информацию = đã nhận thông tin"],
        pronunciation_focus_en: ["подтвердите means please confirm", "что opens the clause", "приняли информацию = received the information"],
      },
    ],
    vocabulary: [
      {
        word: "передавать смену",
        romanization: "peredavat smenu",
        en: "to hand over a shift",
        vi: "bàn giao ca",
        pos: "verb phrase",
        pronunciation_vi: "pe-re-da-VAT SMYE-nu",
        pronunciation_en: "pe-re-da-VAT SMYE-noo",
      },
      {
        word: "зафиксировать",
        romanization: "zafiksirovat",
        en: "to record / log",
        vi: "ghi nhận lại",
        pos: "verb",
        pronunciation_vi: "za-fik-SI-ra-vat",
        pronunciation_en: "za-feek-SEE-ra-vat",
      },
      {
        word: "руководитель",
        romanization: "rukovoditel",
        en: "manager / supervisor",
        vi: "người quản lý",
        pos: "noun",
        pronunciation_vi: "ru-ka-va-DI-tel",
        pronunciation_en: "roo-ka-va-DEE-tel",
      },
      {
        word: "подтвердить",
        romanization: "podtverdit",
        en: "to confirm",
        vi: "xác nhận",
        pos: "verb",
        pronunciation_vi: "pad-tver-DIT",
        pronunciation_en: "pad-tver-DEET",
      },
    ],
    dialogue: [
      {
        speaker: "Сменщик",
        text: "Что осталось от прошлой смены?",
        romanization: "Chto ostalos ot proshloy smeny?",
        vi: "Ca trước còn lại việc gì?",
        en: "What is left from the previous shift?",
      },
      {
        speaker: "Вы",
        text: "Заказ готов, но две позиции не проверены. Я зафиксировал это письменно.",
        romanization: "Zakaz gotov, no dve pozitsii ne provereny. Ya zafiksiroval eto pismenno.",
        vi: "Đơn đã xong, nhưng hai mục chưa kiểm. Tôi đã ghi lại bằng văn bản.",
        en: "The order is ready, but two items are unchecked. I logged it in writing.",
      },
      {
        speaker: "Сменщик",
        text: "Понял. Я приму информацию и проверю позиции.",
        romanization: "Ponyal. Ya primu informatsiyu i proveryu pozitsii.",
        vi: "Hiểu rồi. Tôi sẽ nhận thông tin và kiểm các mục.",
        en: "Understood. I'll take the information and check the items.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi đề nghị chuyển vấn đề cho quản lý trước cuối ngày.", answer: "Предлагаю передать вопрос руководителю до конца дня." },
          { prompt: "Xin xác nhận rằng anh/chị đã nhận thông tin.", answer: "Подтвердите, пожалуйста, что вы приняли информацию." },
        ],
      },
    ],
    cultural_notes_vi:
      "Ở môi trường công nghiệp/kho/bán lẻ, bàn giao mơ hồ gây lỗi và đổ trách nhiệm. Ghi `письменно` và xin `подтвердите` bảo vệ cả bạn lẫn ca sau.",
    cultural_notes_en:
      "In industrial/warehouse/retail settings, a vague handoff causes errors and blame. Logging it `письменно` and asking for `подтвердите` protects both you and the next shift.",
    tip_advice_vi:
      "Khung bàn giao: việc đã xong + việc còn lại + vấn đề + đề xuất + xin xác nhận. Đừng leo thang khi đang nóng giận; nêu sự việc, đề xuất bước tiếp.",
    tip_advice_en:
      "Handoff frame: done + remaining + problem + proposal + ask for confirmation. Don't escalate while angry; state the facts and propose the next step.",
  },
  {
    id: "russian_b2_explaining_mistakes",
    level: "B2",
    category: "practical_tasks",
    title_vi: "B2: Giải thích lỗi và đề xuất khắc phục chuyên nghiệp",
    title_en: "B2: Explaining a mistake and proposing a fix professionally",
    intro_vi:
      "B2 nơi làm việc cần nhận lỗi mà không hoảng: nói rõ chuyện gì xảy ra, nhận trách nhiệm vừa đủ, đề xuất cách sửa và cách phòng ngừa.",
    intro_en:
      "Workplace B2 needs owning a mistake without panic: state what happened, take measured responsibility, propose a fix and a prevention step.",
    sentences: [
      {
        russian: "Произошла ошибка: я отправил отчёт не тому клиенту.",
        romanization: "Proizoshla oshibka: ya otpravil otchyot ne tomu kliyentu.",
        en: "A mistake happened: I sent the report to the wrong client.",
        vi: "Đã xảy ra một lỗi: tôi gửi báo cáo nhầm khách hàng.",
        pronunciation_focus: ["произошла ошибка = lỗi đã xảy ra", "не тому клиенту = nhầm khách (tặng cách)", "отчёт có ё nhấn"],
        pronunciation_focus_en: ["произошла ошибка = a mistake happened", "не тому клиенту = to the wrong client (dative)", "отчёт stresses ё"],
      },
      {
        russian: "Я беру на себя ответственность и уже исправляю ситуацию.",
        romanization: "Ya beru na sebya otvetstvennost i uzhe ispravlyayu situatsiyu.",
        en: "I take responsibility and am already fixing the situation.",
        vi: "Tôi nhận trách nhiệm và đang khắc phục tình huống.",
        pronunciation_focus: ["беру на себя ответственность = nhận trách nhiệm", "уже исправляю = đang sửa rồi", "ситуацию là đối cách"],
        pronunciation_focus_en: ["беру на себя ответственность = take responsibility", "уже исправляю = already fixing", "ситуацию is accusative"],
      },
      {
        russian: "Чтобы это не повторилось, я добавлю проверку перед отправкой.",
        romanization: "Chtoby eto ne povtorilos, ya dobavlyu proverku pered otpravkoy.",
        en: "So this doesn't happen again, I'll add a check before sending.",
        vi: "Để việc này không lặp lại, tôi sẽ thêm bước kiểm trước khi gửi.",
        pronunciation_focus: ["чтобы + quá khứ = để (mục đích)", "не повторилось = không lặp lại", "перед отправкой = trước khi gửi (công cụ cách)"],
        pronunciation_focus_en: ["чтобы + past = so that (purpose)", "не повторилось = not happen again", "перед отправкой = before sending (instrumental)"],
      },
      {
        russian: "Если вы не против, я сообщу клиенту лично.",
        romanization: "Yesli vy ne protiv, ya soobshchu kliyentu lichno.",
        en: "If you don't mind, I'll inform the client personally.",
        vi: "Nếu anh/chị không phản đối, tôi sẽ báo khách hàng trực tiếp.",
        pronunciation_focus: ["если вы не против = nếu anh/chị không phản đối", "сообщу клиенту = sẽ báo cho khách", "лично = đích thân"],
        pronunciation_focus_en: ["если вы не против = if you don't mind", "сообщу клиенту = will inform the client", "лично means personally"],
      },
    ],
    vocabulary: [
      {
        word: "произошла ошибка",
        romanization: "proizoshla oshibka",
        en: "a mistake happened",
        vi: "đã xảy ra một lỗi",
        pos: "phrase",
        pronunciation_vi: "pra-i-za-SHLA a-SHIB-ka",
        pronunciation_en: "pra-ee-za-SHLA a-SHIB-ka",
      },
      {
        word: "брать на себя ответственность",
        romanization: "brat na sebya otvetstvennost",
        en: "to take responsibility",
        vi: "nhận trách nhiệm",
        pos: "verb phrase",
        pronunciation_vi: "brat na se-BYA at-VYET-stven-nast",
        pronunciation_en: "brat na se-BYA at-VYET-stven-nast",
      },
      {
        word: "исправить",
        romanization: "ispravit",
        en: "to fix / correct",
        vi: "khắc phục / sửa",
        pos: "verb",
        pronunciation_vi: "is-PRA-vit",
        pronunciation_en: "ees-PRA-veet",
      },
      {
        word: "чтобы это не повторилось",
        romanization: "chtoby eto ne povtorilos",
        en: "so it doesn't happen again",
        vi: "để việc này không lặp lại",
        pos: "phrase",
        pronunciation_vi: "SHTO-by e-ta ne pa-fta-RI-las",
        pronunciation_en: "SHTO-by e-ta ne pa-fta-REE-las",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Tôi nhận trách nhiệm và đang khắc phục tình huống.", answer: "Я беру на себя ответственность и уже исправляю ситуацию." },
          { prompt: "Để việc này không lặp lại, tôi sẽ thêm bước kiểm trước khi gửi.", answer: "Чтобы это не повторилось, я добавлю проверку перед отправкой." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn liên từ mục đích đúng.",
        instruction_en: "Choose the correct purpose conjunction.",
        items: [{ prompt: "_____ это не повторилось, я добавлю проверку. (чтобы / потому что)", answer: "чтобы" }],
      },
    ],
    cultural_notes_vi:
      "Ở Nga, nhận lỗi gọn rồi đề xuất cách phòng ngừa được đánh giá cao hơn xin lỗi dài dòng. Tránh đổ lỗi cho người khác trong câu đầu tiên.",
    cultural_notes_en:
      "In Russia, a brief admission plus a prevention step is valued more than a long apology. Avoid blaming others in your first sentence.",
    tip_advice_vi:
      "Khung nhận lỗi: chuyện gì xảy ra + nhận trách nhiệm + đang sửa + bước phòng ngừa (`чтобы это не повторилось...`).",
    tip_advice_en:
      "Mistake frame: what happened + take responsibility + fixing now + prevention step (`чтобы это не повторилось...`).",
  },
  {
    id: "russian_b2_travel_complaints",
    level: "B2",
    category: "practical_tasks",
    title_vi: "B2: Khiếu nại và thương lượng lịch sự khi đi lại",
    title_en: "B2: Polite complaints and negotiation while traveling",
    intro_vi:
      "B2 du lịch/dịch vụ cần khiếu nại mà không gây gổ: nêu sự việc, nói tác động lên mình, đề xuất giải pháp, và đòi xác nhận bằng văn bản khi cần.",
    intro_en:
      "B2 travel/service Russian needs complaining without a fight: state the facts, name the impact, propose a solution, and ask for written confirmation when needed.",
    sentences: [
      {
        russian: "Я бронировал номер с видом на море, но мне дали другой.",
        romanization: "Ya broniroval nomer s vidom na more, no mne dali drugoy.",
        en: "I booked a room with a sea view, but I was given a different one.",
        vi: "Tôi đã đặt phòng nhìn ra biển, nhưng người ta đưa tôi phòng khác.",
        pronunciation_focus: ["бронировал = đã đặt (nam)", "с видом на море = nhìn ra biển (công cụ cách)", "мне дали другой = họ đưa tôi phòng khác"],
        pronunciation_focus_en: ["бронировал = booked (male)", "с видом на море = with a sea view (instrumental)", "мне дали другой = I was given a different one"],
      },
      {
        russian: "Из-за этого я не могу нормально работать в поездке.",
        romanization: "Iz-za etogo ya ne mogu normalno rabotat v poyezdke.",
        en: "Because of this I can't work properly on the trip.",
        vi: "Vì việc này tôi không thể làm việc bình thường trong chuyến đi.",
        pronunciation_focus: ["из-за этого = vì việc này (lý do tiêu cực)", "не могу + nguyên mẫu = không thể", "в поездке = trong chuyến đi (giới cách)"],
        pronunciation_focus_en: ["из-за этого = because of this (negative cause)", "не могу + infinitive = cannot", "в поездке = on the trip (prepositional)"],
      },
      {
        russian: "Будьте добры, переселите меня или сделайте скидку.",
        romanization: "Budte dobry, pereselite menya ili sdelayte skidku.",
        en: "Please be so kind: move me or give a discount.",
        vi: "Làm ơn, chuyển phòng cho tôi hoặc giảm giá.",
        pronunciation_focus: ["будьте добры = làm ơn (rất lịch sự)", "переселите меня = chuyển phòng cho tôi", "сделайте скидку = giảm giá"],
        pronunciation_focus_en: ["будьте добры = be so kind (very polite)", "переселите меня = move me", "сделайте скидку = give a discount"],
      },
      {
        russian: "Я бы хотел получить подтверждение в письменном виде.",
        romanization: "Ya by khotel poluchit podtverzhdeniye v pismennom vide.",
        en: "I would like to get confirmation in writing.",
        vi: "Tôi muốn nhận xác nhận bằng văn bản.",
        pronunciation_focus: ["я бы хотел = tôi muốn (lịch sự, giả định)", "подтверждение = sự xác nhận", "в письменном виде = bằng văn bản"],
        pronunciation_focus_en: ["я бы хотел = I would like (polite conditional)", "подтверждение means confirmation", "в письменном виде = in written form"],
      },
    ],
    vocabulary: [
      {
        word: "из-за",
        romanization: "iz-za",
        en: "because of (negative)",
        vi: "vì / do (nghĩa tiêu cực)",
        pos: "preposition",
        pronunciation_vi: "iz-ZA",
        pronunciation_en: "eez-ZA",
      },
      {
        word: "будьте добры",
        romanization: "budte dobry",
        en: "be so kind",
        vi: "làm ơn",
        pos: "phrase",
        pronunciation_vi: "BUT-te da-BRY",
        pronunciation_en: "BOOT-te da-BRY",
      },
      {
        word: "скидка",
        romanization: "skidka",
        en: "discount",
        vi: "giảm giá",
        pos: "noun",
        pronunciation_vi: "SKID-ka",
        pronunciation_en: "SKEED-ka",
      },
      {
        word: "подтверждение",
        romanization: "podtverzhdeniye",
        en: "confirmation",
        vi: "sự xác nhận",
        pos: "noun",
        pronunciation_vi: "pat-tver-ZHDYE-ni-ye",
        pronunciation_en: "pat-tver-ZHDYE-nee-yeh",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Vì việc này tôi không thể làm việc bình thường trong chuyến đi.", answer: "Из-за этого я не могу нормально работать в поездке." },
          { prompt: "Tôi muốn nhận xác nhận bằng văn bản.", answer: "Я бы хотел получить подтверждение в письменном виде." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền giới từ chỉ lý do tiêu cực.",
        instruction_en: "Fill in the preposition for a negative cause.",
        items: [{ prompt: "_____ этого я не могу работать.", answer: "Из-за" }],
      },
    ],
    cultural_notes_vi:
      "`из-за` mang nghĩa lý do tiêu cực (khác `благодаря` = nhờ có). Giọng bình tĩnh + đề xuất cụ thể (chuyển phòng hoặc giảm giá) thường hiệu quả hơn lớn tiếng.",
    cultural_notes_en:
      "`из-за` marks a negative cause (vs `благодаря` = thanks to). A calm tone plus a concrete proposal (re-room or discount) usually works better than raising your voice.",
    tip_advice_vi:
      "Khung khiếu nại: sự việc + tác động (`из-за этого...`) + đề xuất + xin xác nhận văn bản. Dùng `будьте добры` và `я бы хотел` để giữ lịch sự.",
    tip_advice_en:
      "Complaint frame: facts + impact (`из-за этого...`) + proposal + ask for written confirmation. Use `будьте добры` and `я бы хотел` to stay polite.",
  },
  {
    id: "russian_b2_writing_correction_cases",
    level: "B2",
    category: "practical_tasks",
    title_vi: "B2: Sửa lỗi viết — giới từ và cách",
    title_en: "B2: Writing correction — prepositions and cases",
    intro_vi:
      "Lỗi viết phổ biến nhất của người Việt là chọn sai cách sau giới từ. Bài này tập phát hiện và sửa: из/в/на/до + cách đúng.",
    intro_en:
      "The most common Vietnamese writing error is the wrong case after a preposition. This lesson drills spotting and fixing из/в/на/до + the correct case.",
    sentences: [
      {
        russian: "Я приехал из Вьетнама, а сейчас живу в Москве.",
        romanization: "Ya priyekhal iz Vyetnama, a seychas zhivu v Moskve.",
        en: "I came from Vietnam, and now I live in Moscow.",
        vi: "Tôi đến từ Việt Nam, và bây giờ sống ở Moscow.",
        pronunciation_focus: ["из + sinh cách: Вьетнама", "в + giới cách (nơi chốn): Москве", "lỗi hay gặp: из Вьетнам, в Москва"],
        pronunciation_focus_en: ["из + genitive: Вьетнама", "в + prepositional (location): Москве", "common error: из Вьетнам, в Москва"],
      },
      {
        russian: "Магазин работает до девяти, а не до девять.",
        romanization: "Magazin rabotayet do devyati, a ne do devyat.",
        en: "The shop is open until nine, not 'until nine' (wrong form).",
        vi: "Cửa hàng mở đến chín giờ, không phải 'до девять'.",
        pronunciation_focus: ["до + sinh cách: девяти", "số đếm sau до đổi đuôi", "lỗi hay gặp: до девять"],
        pronunciation_focus_en: ["до + genitive: девяти", "numbers after до decline", "common error: до девять"],
      },
      {
        russian: "Я еду на работу на метро, а живу на пятом этаже.",
        romanization: "Ya yedu na rabotu na metro, a zhivu na pyatom etazhe.",
        en: "I go to work by metro, and I live on the fifth floor.",
        vi: "Tôi đi làm bằng tàu điện ngầm, và sống ở tầng năm.",
        pronunciation_focus: ["на работу = đối cách (hướng tới)", "на пятом этаже = giới cách (vị trí)", "cùng на nhưng hai cách khác nhau"],
        pronunciation_focus_en: ["на работу = accusative (direction)", "на пятом этаже = prepositional (location)", "same на, two different cases"],
      },
      {
        russian: "Без словаря я не понимаю текст, поэтому я ищу хороший словарь.",
        romanization: "Bez slovarya ya ne ponimayu tekst, poetomu ya ishchu khoroshiy slovar.",
        en: "Without a dictionary I don't understand the text, so I'm looking for a good dictionary.",
        vi: "Không có từ điển tôi không hiểu văn bản, vì vậy tôi đang tìm một cuốn từ điển tốt.",
        pronunciation_focus: ["без + sinh cách: словаря", "ищу + đối cách: словарь", "phân biệt без словаря vs ищу словарь"],
        pronunciation_focus_en: ["без + genitive: словаря", "ищу + accusative: словарь", "contrast без словаря vs ищу словарь"],
      },
    ],
    vocabulary: [
      {
        word: "из + родительный",
        romanization: "iz + roditelnyy",
        en: "from + genitive",
        vi: "từ + sinh cách",
        pos: "grammar pattern",
        pronunciation_vi: "iz + sinh cách",
        pronunciation_en: "iz + genitive",
      },
      {
        word: "до + родительный",
        romanization: "do + roditelnyy",
        en: "until / up to + genitive",
        vi: "đến / cho tới + sinh cách",
        pos: "grammar pattern",
        pronunciation_vi: "do + sinh cách",
        pronunciation_en: "do + genitive",
      },
      {
        word: "без + родительный",
        romanization: "bez + roditelnyy",
        en: "without + genitive",
        vi: "không có + sinh cách",
        pos: "grammar pattern",
        pronunciation_vi: "bez + sinh cách",
        pronunciation_en: "bez + genitive",
      },
      {
        word: "на + предложный / винительный",
        romanization: "na + predlozhnyy / vinitelnyy",
        en: "на + prepositional (location) / accusative (direction)",
        vi: "на + giới cách (vị trí) / đối cách (hướng)",
        pos: "grammar pattern",
        pronunciation_vi: "na + giới/đối cách",
        pronunciation_en: "na + prep./acc.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Sửa lỗi cách sau giới từ.",
        instruction_en: "Fix the case after the preposition.",
        items: [
          { prompt: "Я из Вьетнам. → Я из _____.", answer: "Вьетнама" },
          { prompt: "Магазин работает до девять. → ... до _____.", answer: "девяти" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga, chú ý giới cách.",
        instruction_en: "Translate into Russian, watching the prepositional case.",
        items: [
          { prompt: "Bây giờ tôi sống ở Moscow.", answer: "Сейчас я живу в Москве." },
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Việt không đổi đuôi từ, nên người học hay quên đổi cách sau giới từ. Nhớ theo cặp giới từ + cách: из/до/без/у → sinh cách; в/на (vị trí) → giới cách.",
    cultural_notes_en:
      "Vietnamese has no case endings, so learners often forget to decline after prepositions. Memorize preposition + case pairs: из/до/без/у → genitive; в/на (location) → prepositional.",
    tip_advice_vi:
      "Khi viết, kiểm câu hai lần: lần một cho ý, lần hai chỉ soi giới từ và đuôi cách. `в` + nơi chốn luôn là giới cách, không phải tên gốc.",
    tip_advice_en:
      "When writing, proofread twice: once for meaning, once only for prepositions and case endings. `в` + a place is always prepositional, not the base form.",
  },
  {
    id: "russian_b2_writing_correction_agreement",
    level: "B2",
    category: "practical_tasks",
    title_vi: "B2: Sửa lỗi viết — hợp giống, thể và dạng quá khứ",
    title_en: "B2: Writing correction — agreement, aspect, and past forms",
    intro_vi:
      "Lỗi viết B2 thường gặp: sai sở hữu theo giống, chia động từ theo chủ ngữ, và chọn dạng quá khứ nam/nữ. Bài này tập sửa nhanh.",
    intro_en:
      "Common B2 writing errors: wrong possessive gender, conjugating to the subject, and choosing male/female past forms. This lesson drills quick fixes.",
    sentences: [
      {
        russian: "Моё имя сложное, но моя фамилия простая.",
        romanization: "Moyo imya slozhnoye, no moya familiya prostaya.",
        en: "My first name is complex, but my surname is simple.",
        vi: "Tên tôi khó, nhưng họ tôi đơn giản.",
        pronunciation_focus: ["имя giống trung → моё", "фамилия giống cái → моя", "lỗi hay gặp: мой имя, мой фамилия"],
        pronunciation_focus_en: ["имя is neuter → моё", "фамилия is feminine → моя", "common error: мой имя, мой фамилия"],
      },
      {
        russian: "Вчера я закончил отчёт, а моя коллега закончила свой.",
        romanization: "Vchera ya zakonchil otchyot, a moya kollega zakonchila svoy.",
        en: "Yesterday I (m.) finished the report, and my (f.) colleague finished hers.",
        vi: "Hôm qua tôi (nam) làm xong báo cáo, còn đồng nghiệp nữ làm xong của cô ấy.",
        pronunciation_focus: ["nam quá khứ: закончил", "nữ quá khứ: закончила", "dạng quá khứ hợp giống chủ ngữ"],
        pronunciation_focus_en: ["male past: закончил", "female past: закончила", "past form agrees with subject gender"],
      },
      {
        russian: "Мы изучаем русский каждый день, а не каждый дни.",
        romanization: "My izuchayem russkiy kazhdyy den, a ne kazhdyy dni.",
        en: "We study Russian every day, not 'every days' (wrong form).",
        vi: "Chúng tôi học tiếng Nga mỗi ngày, không phải 'каждый дни'.",
        pronunciation_focus: ["изучаем hợp với мы", "каждый день là cụm cố định số ít", "lỗi hay gặp: каждый дни"],
        pronunciation_focus_en: ["изучаем agrees with мы", "каждый день is a fixed singular chunk", "common error: каждый дни"],
      },
      {
        russian: "Эта задача трудная, но интересная, и я её уже решил.",
        romanization: "Eta zadacha trudnaya, no interesnaya, i ya yeyo uzhe reshil.",
        en: "This task is hard but interesting, and I have already solved it.",
        vi: "Nhiệm vụ này khó nhưng thú vị, và tôi đã giải xong rồi.",
        pronunciation_focus: ["задача giống cái → трудная, интересная", "её = nó (đối cách giống cái)", "решил là thể hoàn thành"],
        pronunciation_focus_en: ["задача is feminine → трудная, интересная", "её = it (feminine accusative)", "решил is perfective"],
      },
    ],
    vocabulary: [
      {
        word: "моё / моя / мой",
        romanization: "moyo / moya / moy",
        en: "my (neuter / feminine / masculine)",
        vi: "của tôi (trung / cái / đực)",
        pos: "possessive",
        pronunciation_vi: "ma-YO / ma-YA / moy",
        pronunciation_en: "ma-YO / ma-YA / moy",
      },
      {
        word: "закончил / закончила",
        romanization: "zakonchil / zakonchila",
        en: "finished (male / female)",
        vi: "đã xong (nam / nữ)",
        pos: "verb (past)",
        pronunciation_vi: "za-KON-chil / za-KON-chi-la",
        pronunciation_en: "za-KON-cheel / za-KON-chee-la",
      },
      {
        word: "каждый день",
        romanization: "kazhdyy den",
        en: "every day",
        vi: "mỗi ngày",
        pos: "phrase",
        pronunciation_vi: "KAZH-dyy dyen",
        pronunciation_en: "KAZH-dyy dyen",
      },
      {
        word: "решить",
        romanization: "reshit",
        en: "to solve (perfective)",
        vi: "giải quyết (hoàn thành)",
        pos: "verb",
        pronunciation_vi: "re-SHIT",
        pronunciation_en: "re-SHEET",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn dạng đúng.",
        instruction_en: "Choose the correct form.",
        items: [
          { prompt: "_____ имя сложное. (мой / моё)", answer: "моё" },
          { prompt: "Female speaker: Вчера я _____ отчёт. (закончил / закончила)", answer: "закончила" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Chúng tôi học tiếng Nga mỗi ngày.", answer: "Мы изучаем русский каждый день." },
        ],
      },
    ],
    cultural_notes_vi:
      "Ba câu hỏi tự kiểm khi viết: (1) Sở hữu hợp giống danh từ chưa? (2) Động từ hợp chủ ngữ chưa? (3) Quá khứ đúng nam/nữ chưa? Ba câu này bắt phần lớn lỗi B1–B2.",
    cultural_notes_en:
      "Three self-check questions when writing: (1) Does the possessive match the noun's gender? (2) Does the verb agree with the subject? (3) Is the past form correct for male/female? These catch most B1–B2 errors.",
    tip_advice_vi:
      "`имя` là giống trung (моё), `время` cũng vậy — nhớ nhóm danh từ -мя. Người nói nữ luôn dùng đuôi quá khứ -ла.",
    tip_advice_en:
      "`имя` is neuter (моё), and so is `время` — remember the -мя noun group. A female speaker always uses the -ла past ending.",
  },
  {
    id: "russian_b2_participles_recognition",
    level: "B2",
    category: "case_control",
    title_vi: "B2: Nhận biết phân từ và đổi sang который",
    title_en: "B2: Recognizing participles and converting to который",
    intro_vi:
      "B2 cần đọc hiểu phân từ trong tin tức và tài liệu, rồi đổi sang `который` khi nói cho tự nhiên. Bài này tập cả hai chiều.",
    intro_en:
      "B2 needs to read participles in news and documents, then convert them to `который` to sound natural when speaking. This lesson drills both directions.",
    sentences: [
      {
        russian: "Студент, читающий доклад, — мой коллега.",
        romanization: "Student, chitayushchiy doklad, — moy kollega.",
        en: "The student reading the report is my colleague.",
        vi: "Sinh viên đang đọc báo cáo là đồng nghiệp của tôi.",
        pronunciation_focus: ["читающий = phân từ chủ động hiện tại", "= который читает", "hợp giống/số/cách với студент"],
        pronunciation_focus_en: ["читающий = present active participle", "= который читает", "agrees with студент in gender/number/case"],
      },
      {
        russian: "Письмо, написанное вчера, уже отправлено.",
        romanization: "Pismo, napisannoye vchera, uzhe otpravleno.",
        en: "The letter written yesterday has already been sent.",
        vi: "Lá thư được viết hôm qua đã được gửi đi.",
        pronunciation_focus: ["написанное = phân từ bị động quá khứ", "= которое написали", "отправлено là dạng bị động ngắn"],
        pronunciation_focus_en: ["написанное = past passive participle", "= которое написали", "отправлено is short passive"],
      },
      {
        russian: "Метод, используемый в компании, очень эффективен.",
        romanization: "Metod, ispolzuyemyy v kompanii, ochen effektiven.",
        en: "The method used in the company is very effective.",
        vi: "Phương pháp được dùng trong công ty rất hiệu quả.",
        pronunciation_focus: ["используемый = phân từ bị động hiện tại", "= который используют", "thường gặp trong văn viết"],
        pronunciation_focus_en: ["используемый = present passive participle", "= который используют", "common in written style"],
      },
      {
        russian: "В разговоре лучше сказать: человек, который работает здесь.",
        romanization: "V razgovore luchshe skazat: chelovek, kotoryy rabotayet zdes.",
        en: "In conversation it's better to say: the person who works here.",
        vi: "Trong hội thoại nên nói: người mà làm việc ở đây.",
        pronunciation_focus: ["в разговоре = trong hội thoại", "который tự nhiên hơn phân từ khi nói", "работающий nghe văn viết hơn"],
        pronunciation_focus_en: ["в разговоре means in conversation", "который is more natural than a participle in speech", "работающий sounds more written"],
      },
    ],
    vocabulary: [
      {
        word: "читающий",
        romanization: "chitayushchiy",
        en: "reading (present active participle)",
        vi: "đang đọc (phân từ chủ động hiện tại)",
        pos: "participle",
        pronunciation_vi: "chi-TA-yu-shchiy",
        pronunciation_en: "chee-TA-yoo-shchiy",
      },
      {
        word: "написанный",
        romanization: "napisannyy",
        en: "written (past passive participle)",
        vi: "đã được viết (phân từ bị động quá khứ)",
        pos: "participle",
        pronunciation_vi: "na-PI-san-nyy",
        pronunciation_en: "na-PEE-san-nyy",
      },
      {
        word: "используемый",
        romanization: "ispolzuyemyy",
        en: "used (present passive participle)",
        vi: "được sử dụng (phân từ bị động hiện tại)",
        pos: "participle",
        pronunciation_vi: "is-POL-zu-ye-myy",
        pronunciation_en: "ees-POL-zoo-ye-myy",
      },
      {
        word: "который",
        romanization: "kotoryy",
        en: "which / who (relative)",
        vi: "mà / cái mà",
        pos: "relative pronoun",
        pronunciation_vi: "ka-TO-ryy",
        pronunciation_en: "ka-TO-ryy",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Ghép phân từ với mệnh đề `который` tương đương.",
        instruction_en: "Match each participle to its equivalent `который` clause.",
        items: [
          { prompt: "читающий", answer: "который читает" },
          { prompt: "написанное", answer: "которое написали" },
          { prompt: "используемый", answer: "который используют" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga (dùng phân từ).",
        instruction_en: "Translate into Russian (use a participle).",
        items: [
          { prompt: "Lá thư được viết hôm qua đã được gửi đi.", answer: "Письмо, написанное вчера, уже отправлено." },
        ],
      },
    ],
    cultural_notes_vi:
      "Quy tắc thực dụng: khi nói, dùng `который` cho tự nhiên; khi viết hoặc đọc tài liệu, phải nhận ra phân từ. Đừng cố nhồi phân từ vào hội thoại đơn giản.",
    cultural_notes_en:
      "Practical rule: when speaking, use `который` to sound natural; when writing or reading documents, you must recognize participles. Don't force participles into simple conversation.",
    tip_advice_vi:
      "Học nhận diện đuôi: -ущий/-ющий (chủ động hiện tại), -нный/-тый (bị động quá khứ), -емый/-имый (bị động hiện tại). Đổi sang `который` để kiểm nghĩa.",
    tip_advice_en:
      "Learn to spot endings: -ущий/-ющий (present active), -нный/-тый (past passive), -емый/-имый (present passive). Convert to `который` to check the meaning.",
  },
  {
    id: "russian_b2_verbal_adverbs",
    level: "B2",
    category: "connected_speech",
    title_vi: "B2: Trạng động từ (деепричастия) cho câu gọn",
    title_en: "B2: Verbal adverbs (деепричастия) for compact sentences",
    intro_vi:
      "Trạng động từ nén hai hành động cùng chủ thể vào một câu gọn. B2 cần biết dùng và biết khi nào phải tránh (khi đổi chủ thể).",
    intro_en:
      "Verbal adverbs compress two actions of the same subject into one compact sentence. B2 needs to use them and to know when to avoid them (when the subject changes).",
    sentences: [
      {
        russian: "Читая отчёт, я заметил ошибку.",
        romanization: "Chitaya otchyot, ya zametil oshibku.",
        en: "While reading the report, I noticed a mistake.",
        vi: "Khi đang đọc báo cáo, tôi thấy một lỗi.",
        pronunciation_focus: ["читая = trạng động từ chưa hoàn thành (cùng lúc)", "cùng chủ thể: я đọc, я thấy", "= когда я читал"],
        pronunciation_focus_en: ["читая = imperfective verbal adverb (simultaneous)", "same subject: я reads, я notices", "= когда я читал"],
      },
      {
        russian: "Закончив работу, мы пошли домой.",
        romanization: "Zakonchiv rabotu, my poshli domoy.",
        en: "Having finished the work, we went home.",
        vi: "Sau khi làm xong việc, chúng tôi đi về nhà.",
        pronunciation_focus: ["закончив = trạng động từ hoàn thành (xong trước)", "= после того как мы закончили", "cùng chủ thể мы"],
        pronunciation_focus_en: ["закончив = perfective verbal adverb (completed first)", "= после того как мы закончили", "same subject мы"],
      },
      {
        russian: "Готовясь к встрече, она составила список вопросов.",
        romanization: "Gotovyas k vstreche, ona sostavila spisok voprosov.",
        en: "While preparing for the meeting, she made a list of questions.",
        vi: "Trong khi chuẩn bị cho buổi họp, cô ấy lập danh sách câu hỏi.",
        pronunciation_focus: ["готовясь có -ясь (phản thân)", "cùng chủ thể она", "к встрече = cho buổi họp (tặng cách)"],
        pronunciation_focus_en: ["готовясь has -ясь (reflexive)", "same subject она", "к встрече = for the meeting (dative)"],
      },
      {
        russian: "Если у действий разные субъекты, нужно сказать: когда я шёл домой, мама позвонила.",
        romanization: "Yesli u deystviy raznyye subyekty, nuzhno skazat: kogda ya shyol domoy, mama pozvonila.",
        en: "If the actions have different subjects, you must say: when I was walking home, mom called.",
        vi: "Nếu hai hành động khác chủ thể, phải nói: khi tôi đang đi về nhà, mẹ gọi điện.",
        pronunciation_focus: ["разные субъекты = khác chủ thể → tránh trạng động từ", "dùng когда thay thế", "lỗi: Идя домой, мама позвонила"],
        pronunciation_focus_en: ["разные субъекты = different subjects → avoid the verbal adverb", "use когда instead", "error: Идя домой, мама позвонила"],
      },
    ],
    vocabulary: [
      {
        word: "читая",
        romanization: "chitaya",
        en: "while reading",
        vi: "khi đang đọc",
        pos: "verbal adverb (imperfective)",
        pronunciation_vi: "chi-TA-ya",
        pronunciation_en: "chee-TA-ya",
      },
      {
        word: "закончив",
        romanization: "zakonchiv",
        en: "having finished",
        vi: "sau khi làm xong",
        pos: "verbal adverb (perfective)",
        pronunciation_vi: "za-KON-chiv",
        pronunciation_en: "za-KON-cheev",
      },
      {
        word: "готовясь",
        romanization: "gotovyas",
        en: "while preparing",
        vi: "trong khi chuẩn bị",
        pos: "verbal adverb (reflexive)",
        pronunciation_vi: "ga-TO-vyas",
        pronunciation_en: "ga-TO-vyas",
      },
      {
        word: "разные субъекты",
        romanization: "raznyye subyekty",
        en: "different subjects",
        vi: "khác chủ thể",
        pos: "phrase",
        pronunciation_vi: "RAZ-ny-ye sub-YEK-ty",
        pronunciation_en: "RAZ-ny-ye soob-YEK-ty",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Ghép trạng động từ với mệnh đề tương đương.",
        instruction_en: "Match each verbal adverb to its equivalent clause.",
        items: [
          { prompt: "читая отчёт", answer: "когда я читал отчёт" },
          { prompt: "закончив работу", answer: "после того как мы закончили работу" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Câu nào sai? Sửa bằng `когда`.",
        instruction_en: "Which is wrong? Fix it with `когда`.",
        items: [{ prompt: "Идя домой, мама позвонила мне. → _____ я шёл домой, мама позвонила мне.", answer: "Когда" }],
      },
    ],
    cultural_notes_vi:
      "Quy tắc vàng: trạng động từ và động từ chính phải cùng chủ thể. Khác chủ thể → dùng `когда`, `после того как`, `потому что`. Đây là lỗi B2 kinh điển của người Việt.",
    cultural_notes_en:
      "Golden rule: the verbal adverb and the main verb must share the subject. Different subjects → use `когда`, `после того как`, `потому что`. This is a classic B2 error for Vietnamese learners.",
    tip_advice_vi:
      "Trước khi dùng trạng động từ, hỏi: ai làm hành động phụ? ai làm hành động chính? Nếu khác nhau, đừng dùng — chuyển sang mệnh đề `когда`.",
    tip_advice_en:
      "Before using a verbal adverb, ask: who does the side action? who does the main action? If they differ, don't use it — switch to a `когда` clause.",
  },
  {
    id: "russian_b2_advanced_conditionals",
    level: "B2",
    category: "case_control",
    title_vi: "B2: Câu điều kiện nâng cao và giọng lịch sự với бы",
    title_en: "B2: Advanced conditionals and polite tone with бы",
    intro_vi:
      "B2 phân biệt điều kiện thật (`если`) với giả định (`если бы`), và dùng `бы` để nói lịch sự, dè dặt. Có cả mức trang trọng `при условии что`.",
    intro_en:
      "B2 separates real conditions (`если`) from hypothetical ones (`если бы`), and uses `бы` for polite, tentative speech. It also covers the formal `при условии что`.",
    sentences: [
      {
        russian: "Если будет время, я помогу тебе с отчётом.",
        romanization: "Yesli budet vremya, ya pomogu tebe s otchyotom.",
        en: "If there is time, I'll help you with the report.",
        vi: "Nếu có thời gian, tôi sẽ giúp bạn làm báo cáo.",
        pronunciation_focus: ["если будет = điều kiện thật, dùng tương lai", "помогу + tặng cách тебе", "с отчётом = với báo cáo (công cụ cách)"],
        pronunciation_focus_en: ["если будет = real condition, uses future", "помогу + dative тебе", "с отчётом = with the report (instrumental)"],
      },
      {
        russian: "Если бы я знал раньше, я бы предупредил вас.",
        romanization: "Yesli by ya znal ranshe, ya by predupredil vas.",
        en: "If I had known earlier, I would have warned you.",
        vi: "Nếu tôi biết sớm hơn, tôi đã báo trước cho anh/chị.",
        pronunciation_focus: ["если бы + quá khứ = giả định trái thực tế", "я бы + quá khứ ở mệnh đề chính", "cả hai vế đều dùng бы + quá khứ"],
        pronunciation_focus_en: ["если бы + past = counterfactual hypothetical", "я бы + past in the main clause", "both clauses use бы + past"],
      },
      {
        russian: "Вы не могли бы повторить вопрос?",
        romanization: "Vy ne mogli by povtorit vopros?",
        en: "Could you repeat the question?",
        vi: "Anh/chị có thể nhắc lại câu hỏi không?",
        pronunciation_focus: ["не могли бы = giọng lịch sự, dè dặt", "бы làm yêu cầu mềm hơn", "повторить вопрос = nhắc lại câu hỏi"],
        pronunciation_focus_en: ["не могли бы = polite, tentative tone", "бы softens the request", "повторить вопрос = repeat the question"],
      },
      {
        russian: "Мы подпишем договор при условии, что цена не изменится.",
        romanization: "My podpishem dogovor pri uslovii, chto tsena ne izmenitsya.",
        en: "We'll sign the contract provided that the price doesn't change.",
        vi: "Chúng tôi sẽ ký hợp đồng với điều kiện là giá không thay đổi.",
        pronunciation_focus: ["при условии, что = với điều kiện là (trang trọng)", "договор = hợp đồng", "не изменится = sẽ không đổi"],
        pronunciation_focus_en: ["при условии, что = provided that (formal)", "договор means contract", "не изменится = will not change"],
      },
    ],
    vocabulary: [
      {
        word: "если",
        romanization: "yesli",
        en: "if (real condition)",
        vi: "nếu (điều kiện thật)",
        pos: "conjunction",
        pronunciation_vi: "YES-li",
        pronunciation_en: "YES-lee",
      },
      {
        word: "если бы",
        romanization: "yesli by",
        en: "if (hypothetical)",
        vi: "nếu (giả định)",
        pos: "conjunction",
        pronunciation_vi: "YES-li by",
        pronunciation_en: "YES-lee by",
      },
      {
        word: "не могли бы вы",
        romanization: "ne mogli by vy",
        en: "could you (polite)",
        vi: "anh/chị có thể... không (lịch sự)",
        pos: "phrase",
        pronunciation_vi: "ne ma-GLI by vy",
        pronunciation_en: "ne ma-GLEE by vy",
      },
      {
        word: "при условии что",
        romanization: "pri uslovii chto",
        en: "provided that (formal)",
        vi: "với điều kiện là",
        pos: "connector",
        pronunciation_vi: "pri us-LO-vi-i shto",
        pronunciation_en: "pree oos-LO-vee-ee shto",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Nếu tôi biết sớm hơn, tôi đã báo trước cho anh/chị.", answer: "Если бы я знал раньше, я бы предупредил вас." },
          { prompt: "Anh/chị có thể nhắc lại câu hỏi không?", answer: "Вы не могли бы повторить вопрос?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn `если` hay `если бы`.",
        instruction_en: "Choose `если` or `если бы`.",
        items: [{ prompt: "_____ будет время, я помогу. (если / если бы)", answer: "если" }],
      },
    ],
    cultural_notes_vi:
      "`если` + tương lai = điều kiện có thật; `если бы` + quá khứ = giả định/trái thực tế. `бы` còn là công cụ lịch sự mạnh: `я бы хотел`, `вы не могли бы` nghe nhã hơn nhiều câu mệnh lệnh.",
    cultural_notes_en:
      "`если` + future = real condition; `если бы` + past = hypothetical/counterfactual. `бы` is also a strong politeness tool: `я бы хотел`, `вы не могли бы` sound far softer than a command.",
    tip_advice_vi:
      "Mẹo nhớ: thấy `бы` thì cả câu chuyển sang quá khứ, kể cả khi nói về tương lai. Dùng `бы` để xin, đề nghị, và phản hồi lịch sự.",
    tip_advice_en:
      "Memory hook: when you see `бы`, the whole clause shifts to past, even about the future. Use `бы` for requests, suggestions, and polite responses.",
  },
  {
    id: "russian_b2_reported_speech",
    level: "B2",
    category: "connected_speech",
    title_vi: "B2: Lời nói gián tiếp — что, ли, чтобы",
    title_en: "B2: Reported speech — что, ли, чтобы",
    intro_vi:
      "B2 cần thuật lại lời người khác: câu kể với `что`, câu hỏi có/không với `ли`, và mệnh lệnh gián tiếp với `чтобы`. Tiếng Nga không lùi thì bắt buộc.",
    intro_en:
      "B2 needs to relay others' words: statements with `что`, yes/no questions with `ли`, and indirect commands with `чтобы`. Russian has no obligatory tense backshift.",
    sentences: [
      {
        russian: "Коллега сказал, что он живёт в Москве.",
        romanization: "Kollega skazal, chto on zhivyot v Moskve.",
        en: "The colleague said that he lives in Moscow.",
        vi: "Đồng nghiệp nói rằng anh ấy sống ở Moscow.",
        pronunciation_focus: ["сказал, что = nói rằng", "живёт giữ hiện tại (không lùi thì)", "khác tiếng Anh: không đổi thành lived"],
        pronunciation_focus_en: ["сказал, что = said that", "живёт stays present (no backshift)", "unlike English: not changed to lived"],
      },
      {
        russian: "Она спросила, понимаю ли я задание.",
        romanization: "Ona sprosila, ponimayu li ya zadaniye.",
        en: "She asked whether I understand the task.",
        vi: "Cô ấy hỏi tôi có hiểu nhiệm vụ không.",
        pronunciation_focus: ["câu hỏi có/không → dùng ли", "trật tự: động từ + ли + chủ ngữ", "понимаю ли я = tôi có hiểu không"],
        pronunciation_focus_en: ["yes/no question → use ли", "order: verb + ли + subject", "понимаю ли я = whether I understand"],
      },
      {
        russian: "Менеджер попросил, чтобы мы пришли раньше.",
        romanization: "Menedzher poprosil, chtoby my prishli ranshe.",
        en: "The manager asked us to come earlier.",
        vi: "Quản lý yêu cầu chúng tôi đến sớm hơn.",
        pronunciation_focus: ["попросил, чтобы = yêu cầu (mệnh lệnh gián tiếp)", "чтобы + quá khứ: пришли", "= xin/bảo ai làm gì"],
        pronunciation_focus_en: ["попросил, чтобы = asked (indirect command)", "чтобы + past: пришли", "= ask/tell someone to do"],
      },
      {
        russian: "Я не знаю, придёт ли он завтра.",
        romanization: "Ya ne znayu, pridyot li on zavtra.",
        en: "I don't know whether he will come tomorrow.",
        vi: "Tôi không biết liệu anh ấy có đến mai không.",
        pronunciation_focus: ["не знаю, ... ли = không biết liệu... không", "придёт ли он = liệu anh ấy có đến", "ли đứng sau từ trọng tâm"],
        pronunciation_focus_en: ["не знаю, ... ли = I don't know whether", "придёт ли он = whether he will come", "ли follows the focus word"],
      },
    ],
    vocabulary: [
      {
        word: "сказать, что",
        romanization: "skazat, chto",
        en: "to say that",
        vi: "nói rằng",
        pos: "phrase",
        pronunciation_vi: "ska-ZAT shto",
        pronunciation_en: "ska-ZAT shto",
      },
      {
        word: "ли",
        romanization: "li",
        en: "whether / if (yes-no)",
        vi: "có... không / liệu",
        pos: "particle",
        pronunciation_vi: "li",
        pronunciation_en: "lee",
      },
      {
        word: "чтобы",
        romanization: "chtoby",
        en: "so that / to (indirect command)",
        vi: "rằng hãy / để",
        pos: "conjunction",
        pronunciation_vi: "SHTO-by",
        pronunciation_en: "SHTO-by",
      },
      {
        word: "спросить",
        romanization: "sprosit",
        en: "to ask (a question)",
        vi: "hỏi",
        pos: "verb",
        pronunciation_vi: "spra-SIT",
        pronunciation_en: "spra-SEET",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Nga.",
        instruction_en: "Translate into Russian.",
        items: [
          { prompt: "Đồng nghiệp nói rằng anh ấy sống ở Moscow.", answer: "Коллега сказал, что он живёт в Москве." },
          { prompt: "Quản lý yêu cầu chúng tôi đến sớm hơn.", answer: "Менеджер попросил, чтобы мы пришли раньше." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ nối: что, ли hay чтобы.",
        instruction_en: "Choose the linker: что, ли, or чтобы.",
        items: [{ prompt: "Она спросила, понимаю _____ я задание.", answer: "ли" }],
      },
    ],
    cultural_notes_vi:
      "Ba mẫu cốt lõi: kể → `что`; hỏi có/không → `ли`; mệnh lệnh/yêu cầu → `чтобы` + quá khứ. Tiếng Nga không bắt lùi thì như tiếng Anh; thì theo nghĩa thực.",
    cultural_notes_en:
      "Three core patterns: statement → `что`; yes/no question → `ли`; command/request → `чтобы` + past. Russian doesn't force backshift like English; tense follows the real meaning.",
    tip_advice_vi:
      "Câu hỏi có từ hỏi (где, когда, почему) giữ nguyên từ hỏi, không cần `ли`. Chỉ câu hỏi có/không mới dùng `ли`.",
    tip_advice_en:
      "Questions with a question word (где, когда, почему) keep that word and need no `ли`. Only yes/no questions use `ли`.",
  },
];

export default lessons;
