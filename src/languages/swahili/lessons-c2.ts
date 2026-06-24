// src/languages/swahili/lessons-c2.ts
//
// Swahili C2 lessons — Vietnamese-first pedagogy, English companion fields.
// 10 lessons across the full C2 domain: academic, literary, political,
// legal, editorial, advanced grammar, idioms, register, philosophy, debate.

import type { SwahiliLesson } from "./lessons";

export const lessons: SwahiliLesson[] = [
  // ── 1. Academic discourse ────────────────────────────────────────────
  {
    id: "swahili_c2_academic_discourse",
    level: "C2",
    category: "academic_discourse",
    title_vi: "Diễn ngôn học thuật: lập luận, trích dẫn và giới hạn",
    title_en: "Academic discourse: argument, citation, and limitation",
    intro_vi:
      "Viết và nói học thuật trong tiếng Swahili: đặt luận điểm vào khoảng trống nghiên cứu, nêu giới hạn và đóng góp mà không phóng đại. Nắm các cấu trúc then chốt: kwa mujibu wa… (theo…), inaweza kusemwa kwamba… (có thể nói rằng…), uchunguzi huu unajikita katika… (nghiên cứu này tập trung vào…).",
    intro_en:
      "Academic Swahili writing and speaking: position an argument in a research gap, state limitations, and frame contribution without overclaiming. Master key structures: kwa mujibu wa… (according to…), inaweza kusemwa kwamba… (it can be said that…), uchunguzi huu unajikita katika… (this study focuses on…).",
    sentences: [
      {
        sw: "Uchunguzi huu unajikita katika pengo ambalo halijashughulikiwa vya kutosha katika fasihi iliyopo.",
        en: "This study focuses on a gap that has not been sufficiently addressed in the existing literature.",
        vi: "Nghiên cứu này tập trung vào một khoảng trống chưa được xử lý đầy đủ trong tài liệu hiện có.",
        pronunciation_focus: [
          "uchunguzi → u-chu-NGU-zi (u- abstract noun class 11)",
          "unajikita → u-na-ji-KI-ta (-ji- reflexive + -kita 'sink/delve')",
          "halijashughulikiwa → ha-li-ja-shughuliki-w-a (neg + class 5 + 'not yet' + passive)",
          "fasihi → fa-SI-hi (Arabic loan: literature)",
        ],
        pronunciation_focus_en: [
          "uchunguzi = u-chu-NGU-zi (class 11 abstract noun: investigation/study)",
          "unajikita = it focuses itself (-ji- reflexive; -kita = sink deep)",
          "halijashughulikiwa = it has not yet been addressed (-ja- 'not yet' + passive -w-)",
          "fasihi = literature (Arabic origin, stressed on SI)",
        ],
      },
      {
        sw: "Matokeo haya yanapaswa kutathminiwa kwa uangalifu kuhusiana na ujumlishaji wake.",
        en: "These findings should be evaluated carefully in terms of their generalizability.",
        vi: "Những kết quả này cần được đánh giá cẩn thận về khả năng khái quát hóa.",
        pronunciation_focus: [
          "matokeo → ma-to-KE-o (class 6 plural of tokeo 'result')",
          "yanapaswa → ya-na-PA-swa (class 6 agreement + 'should' passive)",
          "kutathminiwa → ku-ta-thmi-ni-w-a (infinitive + evaluate + passive)",
          "ujumlishaji → u-ju-mli-SHA-ji (u- abstract + nominalized 'generalize')",
        ],
        pronunciation_focus_en: [
          "matokeo = results (ma- class 6; sing. tokeo, pl. matokeo)",
          "yanapaswa = they should be (-paswa = 'ought to', passive of -pasa)",
          "ujumlishaji = generalizability (u- abstract noun class; -ji- agentive)",
        ],
      },
      {
        sw: "Kwa mujibu wa watafiti kadhaa, nadharia hii ina mapungufu yanayoonekana.",
        en: "According to several researchers, this theory has visible shortcomings.",
        vi: "Theo một số nhà nghiên cứu, lý thuyết này có những thiếu sót rõ ràng.",
        pronunciation_focus: [
          "kwa mujibu wa → theo / according to (Arabic: mujibu)",
          "watafiti → wa-ta-FI-ti (class 2 plural; mtafiti = researcher)",
          "mapungufu → ma-pu-NGU-fu (class 6: shortcomings/deficiencies)",
          "yanayoonekana → ya-na-yo-o-ne-KA-na (class 6 + present + relative + visible)",
        ],
        pronunciation_focus_en: [
          "kwa mujibu wa = according to (Arabic mujibu, formal register)",
          "watafiti = researchers (mtafiti > watafiti, class 1/2)",
          "mapungufu = shortcomings (-pungufu = deficient, ma- class 6 abstract)",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Swahili học thuật chịu ảnh hưởng sâu sắc từ tiếng Ả Rập (khoảng 30% từ vựng chính thức) và ngày càng nhiều từ tiếng Anh trong khoa học. Ở cấp C2, người nói cần phân biệt ba lớp từ: (1) Bantu gốc (ví dụ: uchunguzi = nghiên cứu), (2) Ả Rập (ví dụ: fasihi = văn học, nadharia = lý thuyết, taarifa = báo cáo), (3) Anh vay mượn (ví dụ: data, ripoti). Người nói C2 dùng từ gốc và Ả Rập trong văn bản chính thức; từ Anh vay mượn chỉ nên dùng khi không có từ thay thế.\n\nKHÁC BIỆT VĂN HÓA: học thuật Swahili coi trọng sự khiêm tốn (unyenyekevu). Người viết thường mở đầu bằng thừa nhận hạn chế (mapungufu) trước khi nêu đóng góp. Việc tự khẳng định quá mức bị coi là majivuno (kiêu ngạo). Đây là điểm khác biệt lớn với văn phong học thuật phương Tây. Ở Tanzania, luận văn thường mở đầu bằng shukurani (lời cảm ơn) dài, phản ánh giá trị văn hóa ushirikiano (tinh thần cộng đồng).",
    cultural_notes_en:
      "Academic Swahili is deeply influenced by Arabic (≈30% of formal vocabulary) and increasingly by English in the sciences. At C2, speakers must distinguish three lexical strata: (1) native Bantu (e.g. uchunguzi = investigation), (2) Arabic loans (e.g. fasihi = literature, nadharia = theory, taarifa = report), (3) English borrowings (e.g. data, ripoti). C2 speakers use native and Arabic lexis in formal writing; English borrowings only when no substitute exists. A key cultural difference: Swahili academic writing prizes unyenyekevu (humility). Authors typically acknowledge mapungufu (limitations) before stating contributions. Over-claiming reads as majivuno (arrogance). In Tanzania, theses often open with an extended shukurani (acknowledgments), reflecting the cultural value of ushirikiano (communal spirit).",
    tip_advice_vi:
      "LUYỆN C2 HÀNG NGÀY: Đọc một đoạn taarifa (báo cáo) từ gazeti (báo) Tanzania như Mwananchi au HabariLeo, gạch chân mọi từ gốc Ả Rập, tra từ điển Kamusi ya Kiswahili Sanifu (TUKI). Viết lại đoạn đó bằng tiếng Swahili đơn giản hơn, rồi nâng cấp ngược lên C2.\n\nCÔNG THỨC ĐOẠN HỌC THUẬT:\n1. Mở: Uchunguzi huu unachunguza… (nghiên cứu này khảo sát…)\n2. Khoảng trống: …pengo ambalo halijashughulikiwa… (khoảng trống chưa được xử lý)\n3. Phương pháp: Kwa kutumia mbinu za… (sử dụng phương pháp…)\n4. Kết quả: Matokeo yanaonyesha kwamba… (kết quả cho thấy rằng…)\n5. Giới hạn: Hata hivyo, uchunguzi huu una mapungufu kadhaa… (tuy nhiên, nghiên cứu này có vài hạn chế…)\n6. Đóng góp: Pamoja na mapungufu hayo, utafiti huu unachangia… (dù có hạn chế đó, nghiên cứu này đóng góp…)",
    tip_advice_en:
      "DAILY C2 DRILL: Read a paragraph of taarifa (report) from a Tanzanian gazeti (newspaper) like Mwananchi or HabariLeo, underline every Arabic-origin word, and look them up in Kamusi ya Kiswahili Sanifu (TUKI). Rewrite the paragraph in simpler Swahili, then upgrade it back to C2.\n\nACADEMIC PARAGRAPH TEMPLATE:\n1. Open: Uchunguzi huu unachunguza… (this study examines…)\n2. Gap: …pengo ambalo halijashughulikiwa… (a gap not yet addressed)\n3. Method: Kwa kutumia mbinu za… (using methods of…)\n4. Results: Matokeo yanaonyesha kwamba… (results show that…)\n5. Limits: Hata hivyo, uchunguzi huu una mapungufu kadhaa… (however, this study has several limitations…)\n6. Contribution: Pamoja na mapungufu hayo, utafiti huu unachangia… (despite those limitations, this research contributes…)",
    vocabulary: [
      {
        word: "uchunguzi",
        en: "investigation / study",
        vi: "nghiên cứu / khảo sát",
        pos: "noun (cl. 11)",
        pronunciation_vi: "u-chu-NGU-zi",
        pronunciation_en: "oo-choo-NGOO-zee",
      },
      {
        word: "pengo",
        en: "gap / lacuna",
        vi: "khoảng trống",
        pos: "noun (cl. 5/6)",
        pronunciation_vi: "PE-ngo",
        pronunciation_en: "PEH-ngoh (mapengo = gaps)",
      },
      {
        word: "fasihi",
        en: "literature (scholarly)",
        vi: "tài liệu học thuật",
        pos: "noun (cl. 9)",
        pronunciation_vi: "fa-SI-hi",
        pronunciation_en: "fah-SEE-hee (Arabic loan)",
      },
      {
        word: "kuhusiana",
        en: "in relation to / regarding",
        vi: "liên quan đến",
        pos: "adverb / conjunction",
        pronunciation_vi: "ku-hu-si-A-na",
        pronunciation_en: "koo-hoo-see-AH-nah (reciprocal -ana)",
      },
      {
        word: "mapungufu",
        en: "shortcomings / limitations",
        vi: "thiếu sót / hạn chế",
        pos: "noun (cl. 6)",
        pronunciation_vi: "ma-pu-NGU-fu",
        pronunciation_en: "mah-poo-NGOO-foo",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Uchunguzi huu unajikita katika ____ ambalo halijashughulikiwa.",
        answer: "pengo",
        hint_vi: "khoảng trống",
        hint_en: "gap",
      },
      {
        type: "fill_blank",
        question: "____ mujibu wa wataalamu, hali ya hewa inabadilika kwa kasi.",
        answer: "Kwa",
        hint_vi: "theo (cụm cố định Kwa mujibu wa…)",
        hint_en: "according to (fixed phrase Kwa mujibu wa…)",
      },
    ],
  },

  // ── 2. Literary analysis & rhetoric ─────────────────────────────────
  {
    id: "swahili_c2_literary_analysis",
    level: "C2",
    category: "literary_analysis",
    title_vi: "Phân tích văn học: ẩn dụ, giọng điệu và hàm ý",
    title_en: "Literary analysis: metaphor, tone, and subtext",
    intro_vi:
      "Đọc văn học Swahili ở cấp C2: nhận diện tashbihi (ẩn dụ), tashihisi (nhân hóa), tanakali sauti (từ tượng thanh) và mafumbo (hàm ngôn). Phân biệt giọng điệu (sauti) của tác giả với giọng của nhân vật. Văn học Swahili có truyền thống thơ đồ sộ (ushairi) và văn xuôi hiện đại phát triển mạnh từ thập niên 1960.",
    intro_en:
      "Reading Swahili literature at C2: identify tashbihi (metaphor), tashihisi (personification), tanakali sauti (ideophones), and mafumbo (implicature). Distinguish the author's sauti (voice) from character voice. Swahili literature has a vast poetic tradition (ushairi) and a modern prose tradition flourishing since the 1960s.",
    sentences: [
      {
        sw: "Mwandishi anatumia tashbihi ya bahari kuwakilisha hali ya kutokuwa na uhakika wa maisha ya mhusika mkuu.",
        en: "The author uses the metaphor of the ocean to represent the protagonist's existential uncertainty.",
        vi: "Tác giả dùng ẩn dụ biển cả để thể hiện sự bất định hiện sinh của nhân vật chính.",
        pronunciation_focus: [
          "mwandishi → mwa-NDI-shi (class 1: writer, from -andika 'write')",
          "tashbihi → ta-SHBI-hi (Arabic: simile/metaphor)",
          "kuwakilisha → ku-wa-ki-LI-sha (infinitive + class 2 obj + represent)",
          "mhusika mkuu → mhu-SI-ka m-KU-u (character + main)",
        ],
        pronunciation_focus_en: [
          "mwandishi = writer (m- agent class 1; from -andika 'write')",
          "tashbihi = metaphor (Arabic تَشْبِيه, formal literary term)",
          "kuwakilisha = to represent them (ku- inf. + -wa- class 2 obj. + -lisha causative)",
        ],
      },
      {
        sw: "Sauti ya msimulizi inabadilika polepole kutoka sauti ya matumaini hadi sauti ya kukata tamaa.",
        en: "The narrator's voice shifts gradually from a voice of hope to one of despair.",
        vi: "Giọng của người kể chuyện chuyển dần từ giọng hy vọng sang giọng tuyệt vọng.",
        pronunciation_focus: [
          "msimulizi → m-si-mu-LI-zi (class 1: narrator, from -simulia 'narrate')",
          "inabadilika → i-na-ba-di-LI-ka (class 9 + present + change + stative)",
          "matumaini → ma-tu-ma-I-ni (class 6: hope, Arabic تمني)",
          "kukata tamaa → ku-KA-ta ta-MA-a (infinitive + 'cut' + 'hope/desire' = despair)",
        ],
        pronunciation_focus_en: [
          "msimulizi = narrator (-simulia = tell a story; msimulizi = storyteller)",
          "kukata tamaa = despair (lit. 'to cut hope/desire', idiomatic compound)",
          "matumaini = hope (ma- class 6 abstract; Arabic origin)",
        ],
      },
      {
        sw: "Kati ya mistari, msomaji anapaswa kutambua mafumbo yanayodokeza ukweli mchungu kuhusu jamii.",
        en: "Between the lines, the reader must discern the implicatures that hint at a bitter truth about society.",
        vi: "Giữa những dòng chữ, người đọc phải nhận ra những hàm ngôn gợi lên sự thật cay đắng về xã hội.",
        pronunciation_focus: [
          "kati ya mistari → between the lines (lit. 'between lines')",
          "mafumbo → ma-FU-mbo (class 6: riddles/implicatures, sing. fumbo)",
          "yanayodokeza → ya-na-yo-do-KE-za (class 6 + rel + 'hint at')",
          "ukweli mchungu → u-KWE-li m-CHU-ngu (truth + bitter)",
        ],
        pronunciation_focus_en: [
          "mafumbo = implicatures / riddles (fumbo = puzzle; mafumbo is used for subtext)",
          "yanayodokeza = which hint at (-dokeza = imply/hint; relative -yo- class 6)",
          "ukweli mchungu = bitter truth (mchungu = bitter, also 'painful')",
        ],
      },
    ],
    cultural_notes_vi:
      "Văn học Swahili có ba dòng chính: (1) ushairi (thơ) — truyền thống lâu đời nhất với vần và nhịp nghiêm ngặt, tiêu biểu: mashairi, tenzi (trường ca tôn giáo), (2) riwaya (tiểu thuyết) — phát triển mạnh từ thập niên 1960 với các tác giả như Shaaban Robert (''baba wa fasihi ya Kiswahili'' — cha đẻ văn học Swahili), Euphrase Kezilahabi (tiểu thuyết hiện sinh), (3) tamthilia (kịch) — phát triển cùng sân khấu đại học Dar es Salaam.\n\nTHỦ PHÁP ĐẶC TRƯNG SWAHILI: tashbihi (ẩn dụ) thường mượn hình ảnh thiên nhiên — bahari (biển), jangwa (sa mạc), mto (sông), mwitu (rừng). Tashihisi (nhân hóa) hay gán cảm xúc con người cho thiên nhiên. Tanakali sauti (từ tượng thanh/hình) là lớp từ thuần Bantu không dịch được, cần học thuộc: e.g. kipya (lặng thinh), jia (tối sầm).\n\nNGHỊCH LÝ THÚ VỊ: văn học Swahili hiện đại thường viết bằng thứ tiếng Swahili ''chuẩn'' (Sanifu) mà hầu như không ai nói ngoài đời — người Tanzania bản xứ nói các phương ngữ (Kingwana, Kimrima, Kiamu…) và dùng Kiswahili Sanifu như ngôn ngữ viết chính thức.",
    cultural_notes_en:
      "Swahili literature has three main streams: (1) ushairi (poetry) — the oldest tradition, with strict meter and rhyme; key forms: mashairi, tenzi (religious epics), (2) riwaya (the novel) — flourishing since the 1960s with authors like Shaaban Robert ('father of Swahili literature'), Euphrase Kezilahabi (existentialist novels), (3) tamthilia (drama) — developed alongside the University of Dar es Salaam theatre. Swahili metaphors draw heavily on nature (bahari = ocean, jangwa = desert, mto = river, mwitu = forest). Tanakali sauti (ideophones) are a purely Bantu word class that defies translation — learn them by heart. Paradox: modern Swahili literature is written in 'standard' Swahili (Sanifu), which virtually nobody speaks at home — native Tanzanians speak regional dialects (Kingwana, Kimrima, Kiamu…) and use Kiswahili Sanifu as a formal written code, much like fusha Arabic.",
    tip_advice_vi:
      "LUYỆN ĐỌC C2: Đọc truyện ngắn của Shaaban Robert (''Adili na Nduguze'' là tác phẩm nhập môn lý tưởng) — gạch dưới mọi tashbihi (ẩn dụ), viết ra nghĩa đen và nghĩa bóng. Sau đó đọc Kezilahabi (''Rosa Mistika'' hoặc ''Kichwamaji'') để thấy văn phong hiện đại, hiện sinh.\n\nBÀI TẬP VIẾT C2:\n1. Đọc một đoạn thơ (shairi) — xác định vần (vina) và nhịp (mizani).\n2. Viết lại một đoạn văn xuôi thành thơ (turned prose → mashairi).\n3. Phân biệt sauti (giọng) của msimulizi và sauti ya mhusika (giọng nhân vật).\n4. Xác định mafumbo — điều tác giả KHÔNG nói thẳng.\n5. Tự viết một đoạn văn C2 dùng ít nhất ba tashbihi nguyên gốc (không dịch từ tiếng Việt/Anh).",
    tip_advice_en:
      "C2 READING DRILL: Read a short story by Shaaban Robert (''Adili na Nduguze'' is the ideal entry point) — underline every tashbihi (metaphor) and write out both literal and figurative meanings. Then move on to Kezilahabi (''Rosa Mistika'' or ''Kichwamaji'') for the modern, existential register.\n\nC2 WRITING EXERCISE: read a shairi (poem), identify vina (rhyme) and mizani (meter); rewrite a prose passage as mashairi; distinguish the narrator's sauti from character voice; identify mafumbo — what the author does NOT say explicitly; compose an original C2 paragraph using at least three original tashbihi (not translated from English/Vietnamese).",
    vocabulary: [
      {
        word: "tashbihi",
        en: "metaphor / simile",
        vi: "ẩn dụ",
        pos: "noun (cl. 9)",
        pronunciation_vi: "ta-SHBI-hi",
        pronunciation_en: "tah-SHBEE-hee (Arabic تَشْبِيه)",
      },
      {
        word: "msimulizi",
        en: "narrator",
        vi: "người kể chuyện",
        pos: "noun (cl. 1/2)",
        pronunciation_vi: "m-si-mu-LI-zi",
        pronunciation_en: "m-see-moo-LEE-zee",
      },
      {
        word: "mafumbo",
        en: "riddles / implicatures / subtext",
        vi: "hàm ngôn / ẩn ý",
        pos: "noun (cl. 6)",
        pronunciation_vi: "ma-FU-mbo",
        pronunciation_en: "mah-FOOM-boh (sing. fumbo = puzzle)",
      },
      {
        word: "sauti",
        en: "voice / tone",
        vi: "giọng điệu",
        pos: "noun (cl. 9)",
        pronunciation_vi: "sa-U-ti",
        pronunciation_en: "sah-OO-tee (Arabic صَوْت)",
      },
      {
        word: "kukata tamaa",
        en: "to despair (lit. 'to cut hope')",
        vi: "tuyệt vọng (nghĩa đen: cắt hy vọng)",
        pos: "idiom (verb phrase)",
        pronunciation_vi: "ku-KA-ta ta-MA-a",
        pronunciation_en: "koo-KAH-tah tah-MAH-ah",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Mwandishi anatumia ____ ya bahari kuwakilisha hali ya mhusika.",
        answer: "tashbihi",
        hint_vi: "ẩn dụ (từ gốc Ả Rập)",
        hint_en: "metaphor (Arabic loanword)",
      },
    ],
  },

  // ── 3. Political and diplomatic language ────────────────────────────
  {
    id: "swahili_c2_political_diplomacy",
    level: "C2",
    category: "political_diplomacy",
    title_vi: "Ngôn ngữ chính trị và ngoại giao",
    title_en: "Political and diplomatic language",
    intro_vi:
      "Đọc và viết các văn kiện chính trị, nghị quyết, hiệp định và phát biểu ngoại giao bằng tiếng Swahili. Ở cấp C2, cần nắm vững cấu trúc hội đồng (baraza), ngôn ngữ nghị trường (bunge) và nghệ thuật tránh né ngoại giao (kuzungumza kwa hadhari).",
    intro_en:
      "Read and write political documents, resolutions, treaties, and diplomatic speeches in Swahili. At C2, master council structures (baraza), parliamentary language (bunge), and the art of diplomatic circumlocution (kuzungumza kwa hadhari).",
    sentences: [
      {
        sw: "Serikali inasisitiza umuhimu wa ushirikiano wa kikanda katika kukabiliana na changamoto za usalama.",
        en: "The government emphasizes the importance of regional cooperation in addressing security challenges.",
        vi: "Chính phủ nhấn mạnh tầm quan trọng của hợp tác khu vực trong việc đối phó với các thách thức an ninh.",
        pronunciation_focus: [
          "serikali → se-ri-KA-li (Arabic: government)",
          "inasisitiza → i-na-si-si-TI-za (class 9 + present + intensive + emphasize)",
          "ushirikiano → u-shi-ri-ki-A-no (u- abstract + reciprocal + -ana)",
          "kukabiliana → ku-ka-bi-li-A-na (infinitive + confront + reciprocal)",
        ],
        pronunciation_focus_en: [
          "serikali = government (Arabic سُلْطَان, via historical shift)",
          "ushirikiano = cooperation (-shiriki = participate; -ana = reciprocal; u- = abstract noun)",
          "kukabiliana = to confront each other / address together (-kabili = face + -ana reciprocal)",
        ],
      },
      {
        sw: "Wajumbe wa baraza kuu walipitisha azimio hilo kwa kura nyingi, ingawa kulikuwa na upinzani kutoka kwa baadhi ya wanachama.",
        en: "The delegates of the general assembly passed the resolution by majority vote, although there was opposition from some members.",
        vi: "Các đại biểu của đại hội đồng đã thông qua nghị quyết với đa số phiếu, mặc dù có sự phản đối từ một số thành viên.",
        pronunciation_focus: [
          "wajumbe → wa-JU-mbe (class 2: delegates; sing. mjumbe)",
          "baraza kuu → ba-RA-za KU-u (council + main/general)",
          "walipitisha → wa-li-pi-TI-sha (class 2 + past + causative 'cause to pass')",
          "upinzani → u-pi-NZA-ni (u- abstract + -pinza 'oppose' + -ni locative/nominal)",
        ],
        pronunciation_focus_en: [
          "wajumbe = delegates (mjumbe < Arabic مُجِيب via Swahili adaptation)",
          "baraza = council/assembly (Arabic بَرَاز, deeply entrenched in EA political vocab)",
          "walipitisha = they passed (causative -isha: 'cause to pass' → 'adopt')",
          "ingawa = although (standard concessive conjunction)",
        ],
      },
      {
        sw: "Taarifa ya pamoja ilisisitiza haja ya kuheshimu mipaka iliyokubaliwa kimataifa bila ya masharti.",
        en: "The joint communiqué emphasized the need to respect internationally recognized borders without preconditions.",
        vi: "Thông cáo chung nhấn mạnh sự cần thiết phải tôn trọng biên giới được quốc tế công nhận mà không có điều kiện tiên quyết.",
        pronunciation_focus: [
          "taarifa ya pamoja → ta-a-RI-fa ya pa-MO-ja (communiqué + of + together)",
          "kuheshimu → ku-he-SHI-mu (infinitive + Arabic احترام: respect)",
          "mipaka → mi-PA-ka (class 4: borders, sing. mpaka)",
          "bila ya masharti → BI-la ya ma-SHAR-ti (without + conditions)",
        ],
        pronunciation_focus_en: [
          "taarifa ya pamoja = joint communiqué (Arabic تعارف + Bantu ya + pamoja)",
          "bila ya masharti = without preconditions (bila = without; sharti < Arabic شَرْط)",
        ],
      },
    ],
    cultural_notes_vi:
      "EAST AFRICAN POLITICAL SWAHILI: Tiếng Swahili là ngôn ngữ chính thức của Liên minh châu Phi (AU), EAC (Cộng đồng Đông Phi) và là một trong các ngôn ngữ làm việc của SADC. Các văn kiện AU thường có bản Swahili song song với Anh/Pháp/Ả Rập/Bồ Đào Nha. Đây là đăng ký C2 thực thụ — người học cần quen với kuzungumza kwa hadhari (nói một cách thận trọng) — nghệ thuật tránh cam kết cụ thể trong khi VẪN thể hiện thiện chí. Cấu trúc then chốt: ''tunatambua… hata hivyo…'' (chúng tôi công nhận… tuy nhiên…), ''tunatoa wito kwa…'' (chúng tôi kêu gọi…), ''tunasisitiza umuhimu wa…'' (chúng tôi nhấn mạnh tầm quan trọng của…).\n\nTANZANIA SPECIFICS: Bunge (quốc hội Tanzania) họp hoàn toàn bằng tiếng Swahili. Các bài phát biểu tại bunge dùng văn phong trang trọng: mheshimiwa spika (kính thưa ngài chủ tịch), mheshimiwa waziri (kính thưa bộ trưởng). Kính ngữ mheshimiwa (nghĩa đen: người được kính trọng) là từ bắt buộc trong mọi phát ngôn nghị trường.",
    cultural_notes_en:
      "EAST AFRICAN POLITICAL SWAHILI: Swahili is an official language of the African Union, the East African Community, and a working language of SADC. AU documents routinely carry Swahili alongside English/French/Arabic/Portuguese. This is real C2 register — learners must master kuzungumza kwa hadhari (speaking with circumspection), the art of avoiding concrete commitments while projecting goodwill. Key phrases: ''tunatambua… hata hivyo…'' (we recognize… however…), ''tunatoa wito kwa…'' (we call upon…), ''tunasisitiza umuhimu wa…'' (we emphasize the importance of…). In Tanzania, Bunge (parliament) operates entirely in Swahili. All speeches use the honorific mheshimiwa (lit. 'the honored one') — mandatory when addressing the Speaker or any minister. No English is spoken on the floor.",
    tip_advice_vi:
      "LUYỆN C2 CHÍNH TRỊ: Đọc taarifa ya pamoja (thông cáo chung) từ trang web AU (au.int/sw) hoặc EAC (eac.int). So sánh bản Swahili với bản tiếng Anh để thấy những chỗ bản Swahili CỐ Ý mơ hồ hơn (đây là kỹ năng ngoại giao, không phải lỗi dịch).\n\nBÀI TẬP VIẾT: Viết một azimio (nghị quyết) ngắn gồm ba phần: (1) utangulizi (lời mở — nhận định tình hình), (2) maazimio (các điều khoản quyết định — dùng ''inaazimia kwamba…''), (3) wito (lời kêu gọi — dùng ''inatoa wito kwa…'').\n\nTỪ VỰNG NGOẠI GIAO CỐT LÕI: baraza (hội đồng), bunge (quốc hội), azimio (nghị quyết), taarifa (thông cáo), mkataba (hiệp định), kura (phiếu bầu), ridhaa (đồng thuận), upinzani (phe đối lập).",
    tip_advice_en:
      "C2 POLITICAL DRILL: Read a taarifa ya pamoja (joint communiqué) from the AU website (au.int/sw) or EAC. Compare the Swahili version with the English one — notice where the Swahili is deliberately vaguer (this is diplomatic skill, not translation error).\n\nWRITING EXERCISE: Draft a short azimio (resolution) in three parts: (1) utangulizi (preamble — note the situation), (2) maazimio (operative clauses — use ''inaazimia kwamba…''), (3) wito (call to action — use ''inatoa wito kwa…'').\n\nCORE DIPLOMATIC LEXICON: baraza (council), bunge (parliament), azimio (resolution), taarifa (communiqué), mkataba (treaty), kura (vote), ridhaa (consensus), upinzani (opposition).",
    vocabulary: [
      {
        word: "baraza",
        en: "council / assembly",
        vi: "hội đồng",
        pos: "noun (cl. 5/6)",
        pronunciation_vi: "ba-RA-za",
        pronunciation_en: "bah-RAH-zah (Arabic origin, 'open court')",
      },
      {
        word: "azimio",
        en: "resolution (formal decision)",
        vi: "nghị quyết",
        pos: "noun (cl. 5/6)",
        pronunciation_vi: "a-zi-MI-o",
        pronunciation_en: "ah-zee-MEE-oh (from -azimia 'resolve')",
      },
      {
        word: "upinzani",
        en: "opposition",
        vi: "phe đối lập",
        pos: "noun (cl. 11)",
        pronunciation_vi: "u-pi-NZA-ni",
        pronunciation_en: "oo-pee-NZAH-nee",
      },
      {
        word: "kukabiliana",
        en: "to confront / address (together)",
        vi: "đối phó (cùng nhau)",
        pos: "verb (reciprocal)",
        pronunciation_vi: "ku-ka-bi-li-A-na",
        pronunciation_en: "koo-kah-bee-lee-AH-nah",
      },
      {
        word: "mkataba",
        en: "treaty / agreement",
        vi: "hiệp định",
        pos: "noun (cl. 3/4)",
        pronunciation_vi: "m-ka-TA-ba",
        pronunciation_en: "m-kah-TAH-bah (Arabic كِتَابَة via -kataba 'write a contract')",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Wajumbe wa ____ kuu walipitisha azimio hilo kwa kura nyingi.",
        answer: "baraza",
        hint_vi: "hội đồng (baraza)",
        hint_en: "council (baraza)",
      },
    ],
  },

  // ── 4. Legal and administrative language ────────────────────────────
  {
    id: "swahili_c2_legal_admin",
    level: "C2",
    category: "legal_admin",
    title_vi: "Ngôn ngữ pháp lý và hành chính",
    title_en: "Legal and administrative language",
    intro_vi:
      "Đọc và soạn thảo các văn bản pháp lý và hành chính bằng tiếng Swahili: sheria (luật), kanuni (quy định), nyaraka (hồ sơ), hati (chứng thư). Ở cấp C2, phân biệt chính xác giữa: lazima (bắt buộc), inapasa (nên), inaruhusiwa (được phép), hairuhusiwi (bị cấm).",
    intro_en:
      "Read and draft legal and administrative documents in Swahili: sheria (law), kanuni (regulations), nyaraka (documents), hati (deeds). At C2, distinguish precisely between: lazima (mandatory), inapasa (should), inaruhusiwa (permitted), hairuhusiwi (prohibited).",
    sentences: [
      {
        sw: "Kwa mujibu wa sheria ya kazi, mwajiriwa ana haki ya kupokea malipo ya ziada kwa saa zote alizofanya kazi zaidi ya saa nane kwa siku.",
        en: "According to the labor law, the employee has the right to receive overtime pay for all hours worked beyond eight hours per day.",
        vi: "Theo luật lao động, người lao động có quyền nhận thêm lương ngoài giờ cho tất cả số giờ làm việc quá tám giờ mỗi ngày.",
        pronunciation_focus: [
          "sheria ya kazi → SHE-ri-a ya KA-zi (law + of + work)",
          "mwajiriwa → mwa-ji-RI-wa (class 1: employee, passive of -ajiri 'employ')",
          "malipo ya ziada → ma-LI-po ya zi-A-da (payments + of + extra)",
          "anastahili → a-na-sta-HI-li (class 1 + present + deserve, Arabic اِسْتَحَقَّ)",
        ],
        pronunciation_focus_en: [
          "sheria = law (Arabic شَرِيعَة, now secularized in EA usage)",
          "mwajiriwa = employee (passive -wa: 'one who is employed')",
          "malipo ya ziada = overtime pay (ziada = extra/additional, Arabic زِيَادَة)",
        ],
      },
      {
        sw: "Mkataba huu unaweza kuvunjwa iwapo mmoja wa wahusika atashindwa kutimiza wajibu wake kama ulivyoelezwa katika kifungu cha nne.",
        en: "This agreement may be terminated if one of the parties fails to fulfill their obligation as stipulated in article four.",
        vi: "Thỏa thuận này có thể bị hủy bỏ nếu một trong các bên không hoàn thành nghĩa vụ như đã nêu tại điều bốn.",
        pronunciation_focus: [
          "unaweza kuvunjwa → u-na-WE-za ku-VU-njwa (class 3 + can + be broken [passive])",
          "iwapo → i-WA-po (if/when, lit. 'if it is that')",
          "wahusika → wa-hu-SI-ka (class 2: parties, lit. 'those involved')",
          "kifungu → ki-FU-ngu (class 7: article/clause, lit. 'small section')",
        ],
        pronunciation_focus_en: [
          "kuvunjwa = to be terminated (passive of -vunja 'break')",
          "iwapo = if / in the event that (conditional conjunction)",
          "kifungu = article/clause (ki- diminutive class 7; -fungu 'section')",
        ],
      },
      {
        sw: "Maombi yote yanapaswa kuwasilishwa kwa maandishi ndani ya siku thelathini tangu tarehe ya tangazo hili.",
        en: "All applications must be submitted in writing within thirty days from the date of this notice.",
        vi: "Tất cả đơn đăng ký phải được nộp bằng văn bản trong vòng ba mươi ngày kể từ ngày ra thông báo này.",
        pronunciation_focus: [
          "maombi → ma-O-mbi (class 6: applications, from -omba 'request')",
          "kuwasilishwa → ku-wa-si-li-shwa (infinitive + class 2 obj + arrive-CAUS-PASS)",
          "kwa maandishi → kwa ma-a-NDI-shi (by means of writings)",
          "tangazo → ta-NGA-zo (class 5: announcement/notice, from -tangaza 'announce')",
        ],
        pronunciation_focus_en: [
          "kuwasilishwa = to be submitted (-wasilisha = deliver/submit; -wa passive)",
          "kwa maandishi = in writing (maandishi < -andika 'write'; instrumental kwa)",
          "ndani ya siku thelathini = within thirty days (thelathini < Arabic ثَلَاثِين)",
        ],
      },
    ],
    cultural_notes_vi:
      "HỆ THỐNG PHÁP LUẬT SWAHILI: Hệ thống tòa án Tanzania dùng tiếng Swahili ở mọi cấp (Mahakama ya Mwanzo → Mahakama ya Wilaya → Mahakama Kuu → Mahakama ya Rufaa). Luật sư (mawakili) tranh tụng trước thẩm phán (hakimu / jaji) hoàn toàn bằng tiếng Swahili. Kenya dùng tiếng Anh trong tòa cấp cao nhưng Swahili ở tòa cấp thấp (kadhi).\n\nPHÂN BIỆT MỨC ĐỘ BẮT BUỘC:\n- lazima / ni wajibu — bắt buộc tuyệt đối (phải)\n- inapasa / inatakiwa — nên / cần (khuyến nghị mạnh)\n- inashauriwa — được khuyến nghị (không bắt buộc)\n- inaruhusiwa — được phép\n- hairuhusiwi — bị cấm\n- inakatazwa — bị nghiêm cấm (mức mạnh nhất)",
    cultural_notes_en:
      "SWAHILI LEGAL SYSTEM: Tanzania's court system operates entirely in Swahili at every level (Primary Court → District Court → High Court → Court of Appeal). Lawyers (mawakili) argue before judges (hakimu / jaji) in Swahili. Kenya uses English in higher courts but Swahili in lower (kadhi) courts.\n\nDEGREES OF OBLIGATION (critical C2 distinction): lazima / ni wajibu = absolute obligation; inapasa / inatakiwa = should (strong recommendation); inashauriwa = advised (non-binding); inaruhusiwa = permitted; hairuhusiwi = prohibited; inakatazwa = strictly forbidden (strongest level). Using the wrong one in a contract or regulation changes the legal force — this is a genuine C2 discriminator.",
    tip_advice_vi:
      "LUYỆN DỊCH PHÁP LÝ: Lấy một điều khoản ngắn của bộ luật Việt Nam (ví dụ Bộ luật Lao động), tự dịch sang tiếng Swahili, rồi kiểm tra lại nghĩa vụ pháp lý — mức bắt buộc có được bảo toàn không?\n\nLỖI THƯỜNG GẶP: Dùng lazima khi chỉ cần inapasa (quá cứng), hoặc ngược lại (quá yếu cho câu lệnh). Trong văn bản C2, từng từ mang hiệu lực pháp lý.\n\nCẤU TRÚC PHỔ BIẾN: ''Kwa mujibu wa kifungu cha…'' (theo điều khoản…), ''isipokuwa kama itakavyoelezwa vinginevyo…'' (trừ khi có quy định khác…), ''bila ya kuathiri…'' (không ảnh hưởng đến…).",
    tip_advice_en:
      "LEGAL TRANSLATION DRILL: Take a short article from a Vietnamese law (e.g. Labor Code), translate it into Swahili, then check whether the legal obligation level survived. Common error: using lazima where inapasa suffices (too rigid), or vice versa (too weak for a command). In C2 legal texts, every word carries legal force. Key structures: ''Kwa mujibu wa kifungu cha…'' (pursuant to article…), ''isipokuwa kama itakavyoelezwa vinginevyo'' (unless otherwise provided), ''bila ya kuathiri…'' (without prejudice to…).",
    vocabulary: [
      {
        word: "sheria",
        en: "law",
        vi: "luật",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "SHE-ri-a",
        pronunciation_en: "SHEH-ree-ah (Arabic شَرِيعَة)",
      },
      {
        word: "kifungu",
        en: "article / clause / section (of law)",
        vi: "điều khoản",
        pos: "noun (cl. 7/8)",
        pronunciation_vi: "ki-FU-ngu",
        pronunciation_en: "kee-FOON-goo (ki- diminutive: 'small section')",
      },
      {
        word: "mkataba",
        en: "contract / agreement",
        vi: "hợp đồng / thỏa thuận",
        pos: "noun (cl. 3/4)",
        pronunciation_vi: "m-ka-TA-ba",
        pronunciation_en: "m-kah-TAH-bah",
      },
      {
        word: "wajibu",
        en: "obligation / duty",
        vi: "nghĩa vụ",
        pos: "noun (cl. 11)",
        pronunciation_vi: "wa-JI-bu",
        pronunciation_en: "wah-JEE-boo (Arabic وَاجِب)",
      },
      {
        word: "iwapo",
        en: "if / in the event that",
        vi: "nếu / trong trường hợp",
        pos: "conjunction",
        pronunciation_vi: "i-WA-po",
        pronunciation_en: "ee-WAH-poh (lit. 'if it is there')",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Mkataba huu unaweza kuvunjwa ____ mmoja wa wahusika atashindwa kutimiza wajibu wake.",
        answer: "iwapo",
        hint_vi: "nếu / trong trường hợp",
        hint_en: "if / in the event that",
      },
    ],
  },

  // ── 5. News analysis and editorials ─────────────────────────────────
  {
    id: "swahili_c2_news_editorial",
    level: "C2",
    category: "news_editorial",
    title_vi: "Phân tích tin tức và xã luận",
    title_en: "News analysis and editorials",
    intro_vi:
      "Đọc, phân tích và viết xã luận (uhariri) bằng tiếng Swahili. Phân biệt tin tức khách quan (habari) với bình luận chủ quan (maoni). Ở cấp C2, nhận diện lập trường ngầm của tờ báo qua lựa chọn từ ngữ: ''alikiri'' (thừa nhận — có thể mang nghĩa miễn cưỡng) vs. ''alisema'' (nói — trung tính).",
    intro_en:
      "Read, analyze, and write editorials (uhariri) in Swahili. Distinguish objective news (habari) from subjective commentary (maoni). At C2, identify a newspaper's implicit stance through word choice: ''alikiri'' (admitted — can imply reluctance) vs. ''alisema'' (said — neutral).",
    sentences: [
      {
        sw: "Gazeti hilo lilidai kwamba serikali imeshindwa kushughulikia mgogoro wa ajira kwa vijana, madai ambayo wizara ilikanusha vikali.",
        en: "The newspaper claimed that the government has failed to address the youth employment crisis, an allegation the ministry vigorously denied.",
        vi: "Tờ báo đó tuyên bố rằng chính phủ đã thất bại trong việc giải quyết khủng hoảng việc làm cho thanh niên, cáo buộc mà bộ đã phủ nhận mạnh mẽ.",
        pronunciation_focus: [
          "lilidai → li-li-DA-i (class 5 + past + claim, lit. 'made a claim')",
          "imeshindwa → i-me-SHI-ndwa (class 9 + perfect + fail-PASS)",
          "mgogoro → m-go-GO-ro (class 3: crisis/conflict)",
          "ilikanusha → i-li-ka-NU-sha (class 9 + past + deny, causative of -kana 'deny')",
        ],
        pronunciation_focus_en: [
          "lilidai = it claimed (-dai = claim, Arabic اِدَّعَى)",
          "imeshindwa = it has failed (-shinda = win/overcome; -shindwa = be defeated/fail)",
          "mgogoro = crisis/conflict (class 3)",
          "ilikanusha = it denied (-kana = deny; -sha causative: 'cause to deny' → formally reject)",
        ],
      },
      {
        sw: "Uhariri wa leo unachambua kwa kina athari za sera mpya ya uchumi kwa wananchi wa kipato cha chini.",
        en: "Today's editorial analyzes in depth the impact of the new economic policy on low-income citizens.",
        vi: "Xã luận hôm nay phân tích sâu tác động của chính sách kinh tế mới đối với người dân thu nhập thấp.",
        pronunciation_focus: [
          "uhariri → u-ha-RI-ri (class 11: editorial, Arabic تَحْرِير)",
          "unachambua → u-na-cha-MBU-a (class 11 + present + analyze/dissect)",
          "athari → a-THA-ri (class 9: impact/effect, Arabic أَثَر)",
          "kipato cha chini → ki-PA-to cha CHI-ni (income + of + low)",
        ],
        pronunciation_focus_en: [
          "uhariri = editorial (Arabic تَحْرِير 'editing'; u- class 11 abstract)",
          "kwa kina = in depth (kina = depth, class 7)",
          "athari = impact/effect (Arabic, distinct from matokeo 'results')",
        ],
      },
      {
        sw: "Wachambuzi wanaonya kwamba hali hiyo inaweza kusababisha mgawanyiko wa kisiasa iwapo haitashughulikiwa mapema.",
        en: "Analysts warn that the situation may cause political division if it is not addressed early.",
        vi: "Các nhà phân tích cảnh báo rằng tình hình có thể gây ra chia rẽ chính trị nếu không được xử lý sớm.",
        pronunciation_focus: [
          "wachambuzi → wa-cha-MBU-zi (class 2: analysts, from -chambua 'analyze')",
          "wanaonya → wa-na-O-nya (class 2 + present + warn)",
          "mgawanyiko → m-ga-wa-NYI-ko (class 3: division/split, from -gawanya 'divide')",
          "mapema → ma-PE-ma (early, class 6 adverbial)",
        ],
        pronunciation_focus_en: [
          "wachambuzi = analysts (-chambua = dissect/analyze; -i agentive suffix)",
          "mgawanyiko = division/polarization (-gawanya = divide; -iko stative nominalizer)",
          "mapema = early (adverbial use of class 6 ma-)",
        ],
      },
    ],
    cultural_notes_vi:
      "BÁO CHÍ SWAHILI: Các tờ báo lớn bằng tiếng Swahili: Mwananchi (Tanzania — ''người dân''), HabariLeo (Tanzania — ''tin tức hôm nay''), Taifa Leo (Kenya — ''quốc gia hôm nay''), Rai (Kenya — ''ý kiến''), Nipashe (Tanzania — ''thông báo cho tôi'').\n\nĐẶC TRƯNG XÃ LUẬN SWAHILI: Uhariri (xã luận) trong báo Swahili thường dùng văn phong trung gian giữa trang trọng và bình dân — không quá hàn lâm như báo Anh nhưng vẫn giữ được sức nặng lập luận. Các tờ báo Tanzania thường thiên về lập trường ủng hộ chính phủ (CCM — đảng cầm quyền từ độc lập); báo Kenya có phổ quan điểm rộng hơn.\n\nTỪ VỰNG ''CHẤT'' TRONG TIN TỨC: kudai (tuyên bố / cáo buộc — có sắc thái chưa được xác minh), kukiri (thừa nhận — có thể mang ý miễn cưỡng), kudokeza (ám chỉ), kukanusha (phủ nhận), kutilia shaka (đặt nghi vấn). Mỗi từ cho thấy lập trường của người viết.",
    cultural_notes_en:
      "SWAHILI MEDIA LANDSCAPE: Major Swahili-language newspapers: Mwananchi (Tanzania — 'the citizen'), HabariLeo (Tanzania — 'news today'), Taifa Leo (Kenya — 'nation today'), Rai (Kenya — 'opinion'), Nipashe (Tanzania — 'inform me'). Editorials in Swahili papers occupy a middle register — more formal than colloquial speech but more accessible than English broadsheets. Tanzanian papers lean pro-government (CCM has ruled since independence); Kenyan papers span a wider spectrum.\n\nCHARGED VOCABULARY: kudai (claim/allege — carries unverified nuance), kukiri (admit — can imply reluctance), kudokeza (hint/imply), kukanusha (deny), kutilia shaka (cast doubt). Every verb choice signals the writer's stance — this is the difference between reading at C1 and C2.",
    tip_advice_vi:
      "LUYỆN ĐỌC TIN C2: Mỗi ngày đọc một bài uhariri trên Mwananchi (mwananchi.co.tz) hoặc HabariLeo. Tạo bảng hai cột: từ trung tính (alisema, alitangaza) vs. từ mang sắc thái (alidai, alikiri, alidokeza). Qua một tuần, bạn sẽ thấy đường biên tập của từng tờ.\n\nBÀI TẬP VIẾT: Chọn một sự kiện thời sự Đông Phi — viết một đoạn habari (tin khách quan) và một đoạn uhariri (bình luận) về cùng sự kiện đó. So sánh cách chọn từ khác nhau.",
    tip_advice_en:
      "C2 NEWS READING DRILL: Every day, read one uhariri (editorial) on Mwananchi or HabariLeo. Make a two-column table: neutral verbs (alisema, alitangaza) vs. charged ones (alidai, alikiri, alidokeza). After a week, you'll see each paper's editorial line.\n\nWRITING EXERCISE: Pick a current East African event — write one habari (objective news) paragraph and one uhariri (editorial) paragraph about the same event. Compare the word choices.",
    vocabulary: [
      {
        word: "uhariri",
        en: "editorial",
        vi: "xã luận",
        pos: "noun (cl. 11)",
        pronunciation_vi: "u-ha-RI-ri",
        pronunciation_en: "oo-hah-REE-ree (Arabic تَحْرِير)",
      },
      {
        word: "kudai",
        en: "to claim / allege (unverified nuance)",
        vi: "tuyên bố / cáo buộc",
        pos: "verb",
        pronunciation_vi: "ku-DA-i",
        pronunciation_en: "koo-DAH-ee (Arabic اِدَّعَى)",
      },
      {
        word: "kukanusha",
        en: "to deny / refute",
        vi: "phủ nhận / bác bỏ",
        pos: "verb",
        pronunciation_vi: "ku-ka-NU-sha",
        pronunciation_en: "koo-kah-NOO-shah (-kan- = deny; -sha = causative)",
      },
      {
        word: "mgogoro",
        en: "crisis / conflict / standoff",
        vi: "khủng hoảng / xung đột",
        pos: "noun (cl. 3/4)",
        pronunciation_vi: "m-go-GO-ro",
        pronunciation_en: "m-goh-GOH-roh",
      },
      {
        word: "wachambuzi",
        en: "analysts / commentators",
        vi: "nhà phân tích",
        pos: "noun (cl. 2)",
        pronunciation_vi: "wa-cha-MBU-zi",
        pronunciation_en: "wah-chah-MBOO-zee (sing. mchambuzi)",
      },
    ],
    exercises: [
      {
        type: "translation",
        vietnamese: "Tờ báo tuyên bố rằng chính phủ đã thất bại.",
        english: "The newspaper claimed that the government has failed.",
        swahili: "Gazeti lilidai kwamba serikali imeshindwa.",
      },
    ],
  },

  // ── 6. Advanced grammar: noun class chains ──────────────────────────
  {
    id: "swahili_c2_advanced_grammar",
    level: "C2",
    category: "advanced_grammar",
    title_vi: "Ngữ pháp nâng cao: chuỗi hòa hợp lớp danh từ",
    title_en: "Advanced grammar: noun class agreement chains",
    intro_vi:
      "Tiếng Swahili có 15+ lớp danh từ (ngeli) — cốt lõi của mọi câu. Ở cấp C2, bạn cần duy trì hòa hợp qua các chuỗi phụ thuộc dài: mạo từ → tính từ → động từ → tân ngữ → quan hệ từ → sở hữu. Một câu C2 tiêu biểu có thể chứa 5-7 điểm hòa hợp liên tiếp — mỗi điểm phải khớp với lớp danh từ gốc.",
    intro_en:
      "Swahili has 15+ noun classes (ngeli) — the spine of every sentence. At C2, you must maintain agreement across long dependency chains: determiner → adjective → verb → object → relative → possessive. A typical C2 sentence may contain 5-7 consecutive agreement points — each must match the head noun's class.",
    sentences: [
      {
        sw: "Kitabu kile kikubwa ambacho nilikisoma jana kina maelezo yanayoeleweka vizuri kuhusu historia ya biashara ya watumwa.",
        en: "That big book which I read yesterday contains well-explained information about the history of the slave trade.",
        vi: "Cuốn sách to đó mà tôi đã đọc hôm qua chứa những thông tin được giải thích rõ ràng về lịch sử buôn bán nô lệ.",
        pronunciation_focus: [
          "kitabu kile kikubwa → ki-TA-bu KI-le ki-KU-bwa (book + that + big; all ki/ki/ki)",
          "ambacho nilikisoma → a-mba-CHO ni-li-KI-so-ma (which [cl.7] + I-past-CL7-read)",
          "kina maelezo → KI-na ma-e-LE-zo (CL7-has + class-6-explanations; class switch!)",
          "yanayoeleweka → YA-na-YO-e-le-WE-ka (CL6-present-CL6.REL-understand-able-STATIVE)",
        ],
        pronunciation_focus_en: [
          "kitabu kile kikubwa: ki/ki/ki chain = class 7 (ki-/vi-) book",
          "ambacho = which (class 7 relative; amba- + -cho class 7)",
          "nilikisoma: ni-li-KI-soma; -ki- object infix MUST match class 7 of kitabu",
          "maelezo yanayoeleweka: NOW class 6 (ma-); ya-na-YO- chain shifts",
        ],
      },
      {
        sw: "Wanafunzi wale wachache waliofaulu mtihani wao wa mwisho watapewa nafasi za kujiunga na vyuo vikuu vilivyochaguliwa.",
        en: "Those few students who passed their final examination will be given opportunities to join selected universities.",
        vi: "Những sinh viên ít ỏi đó đã vượt qua kỳ thi cuối cùng của họ sẽ được trao cơ hội vào các trường đại học được chọn.",
        pronunciation_focus: [
          "wanafunzi wale wachache → wa-na-FU-nzi WA-le wa-CHA-che (students + those + few; wa/wa/wa)",
          "waliofaulu → WA-li-o-fa-U-lu (CL2-past-CL2.REL-succeed)",
          "watapewa → WA-ta-PE-wa (CL2-future-give-PASS: they will be given)",
          "vilivyochaguliwa → VI-li-VYO-cha-gu-LI-wa (CL8-past-CL8.REL-choose-APPL-PASS)",
        ],
        pronunciation_focus_en: [
          "wanafunzi wale wachache: class 2 (wa-) triple agreement chain",
          "waliofaulu: wa-li-o-faulu; -o- relative infix MUST match class 2",
          "vyuo vikuu vilivyochaguliwa: class 8 (vi-) triple chain; note -vyo- relative",
        ],
      },
      {
        sw: "Miti hii mirefu iliyoota kando ya mto ilikuwa ikitumiwa na ndege wakubwa kama viota vyao.",
        en: "These tall trees that grew along the river were being used by large birds as their nests.",
        vi: "Những cây cao này mọc dọc bờ sông đã được những con chim lớn dùng làm tổ của chúng.",
        pronunciation_focus: [
          "miti hii mirefu → MI-ti HI-i mi-RE-fu (trees + these + tall; mi/hi/mi chain, cl.4)",
          "iliyoota → I-li-YO-o-ta (CL4-past-CL4.REL-grow)",
          "ilitumiwa → i-li-TU-mi-wa (CL4-past-use-PASS; -i- subject = miti)",
          "viota vyao → vi-O-ta VYA-o (nests + CL8-of + CL2-their; another class shift)",
        ],
        pronunciation_focus_en: [
          "miti hii mirefu: class 4 (mi-) triple chain; all must agree with mti/miti",
          "ndege wakubwa: class 2 agreement with ndege (birds, animate override)",
          "viota vyao: class 8 (ki-/vi-); vyao = vi- + -ao (class 2 possessive on class 8 head)",
        ],
      },
    ],
    cultural_notes_vi:
      "NGELI (LỚP DANH TỪ) — HỆ THỐNG PHÂN LOẠI CỦA SWAHILI:\n\nHệ thống ngeli là trái tim ngữ pháp Swahili và là ranh giới rõ nhất giữa C1 và C2. Không giống như ''giống'' trong tiếng Pháp (chỉ 2), Swahili có 15+ lớp, mỗi lớp có tiền tố riêng cho: chủ ngữ, tân ngữ, tính từ, số đếm, sở hữu, chỉ định từ (this/that), quan hệ từ (which/that), và liên từ -a (of).\n\nCÁC LỚP CHÍNH:\n- Lớp 1/2 (M/Wa): người — mtu/watu, mwalimu/walimu\n- Lớp 3/4 (M/Mi): cây cối, vật thể tự nhiên — mti/miti, mto/mito\n- Lớp 5/6 (Ji/Ma): vật lớn, tập hợp — tunda/matunda, jina/majina\n- Lớp 7/8 (Ki/Vi): vật nhỏ, ngôn ngữ — kitabu/vitabu, Kiswahili\n- Lớp 9/10 (N/N): vay mượn, động vật — nyumba/nyumba, simba/simba (số ít và số nhiều giống nhau!)\n- Lớp 11 (U): trừu tượng, khối — uzuri (vẻ đẹp), uhuru (tự do)\n- Lớp 15 (Ku): động từ nguyên thể dùng như danh từ — kusoma (việc đọc)\n- Lớp 16/17/18 (Pa/Ku/Mu): vị trí — mahali (nơi chốn)\n\nBẪY LỚN NHẤT CHO NGƯỜI VIỆT: Trong một câu Swahili, lớp danh từ thay đổi theo TỪNG danh từ — không có chuyện cả câu dùng một bộ hòa hợp. Câu ví dụ đầu tiên (kitabu → maelezo) chuyển từ lớp 7 sang lớp 6 trong cùng một câu!",
    cultural_notes_en:
      "NGELI (NOUN CLASSES) — THE SWAHILI CLASSIFICATION SYSTEM:\n\nThe ngeli system is the heart of Swahili grammar and the clearest boundary between C1 and C2. Unlike 'gender' in French (only 2), Swahili has 15+ classes, each with its own prefix set for: subject, object, adjective, numeral, possessive, demonstrative (this/that), relative (which/that), and the associative -a (of).\n\nKEY CLASSES: 1/2 (M/Wa) = people; 3/4 (M/Mi) = trees, natural objects; 5/6 (Ji/Ma) = large objects, collectives; 7/8 (Ki/Vi) = small objects, languages; 9/10 (N/N) = borrowings, animals (singular and plural IDENTICAL — a huge trap); 11 (U) = abstracts, masses; 15 (Ku) = infinitives as nouns; 16/17/18 (Pa/Ku/Mu) = locatives.\n\nBIGGEST TRAP FOR LEARNERS: In one Swahili sentence, the noun class changes per NOUN — there's no sentence-wide agreement. The first example sentence shifts from class 7 (kitabu) to class 6 (maelezo) mid-sentence!",
    tip_advice_vi:
      "LUYỆN CHUỖI HÒA HỢP C2:\n\nBÀI TẬP 1 — PHÂN TÍCH: Lấy một câu Swahili dài (~20 từ), gạch dưới MỌI tiền tố hòa hợp. Vẽ mũi tên từ mỗi tiền tố về danh từ gốc của nó. Nếu bạn không vẽ được mũi tên rõ ràng, bạn chưa thực sự hiểu câu đó.\n\nBÀI TẬP 2 — VIẾT CHUỖI: Chọn ngẫu nhiên một danh từ và một lớp khác. Viết một câu có ít nhất 5 điểm hòa hợp — tất cả đều đúng. Ví dụ: chọn kitabu (lớp 7) và wanafunzi (lớp 2).\n\nBÀI TẬP 3 — SỬA LỖI: Cố ý viết sai một hòa hợp trong chuỗi. Người học C2 phải PHÁT HIỆN lỗi đó NGAY LẬP TỨC — như người Việt nghe ''cái bàn này là đẹp quá'' thì biết sai ngay.\n\nMẸO: Học thuộc bảng hòa hợp cho 8 cặp lớp chính. Dán lên tường. Đọc to mỗi ngày trong 2 tuần.",
    tip_advice_en:
      "C2 AGREEMENT CHAIN DRILL:\n\nEXERCISE 1 — PARSE: Take a long Swahili sentence (~20 words), underline EVERY agreement prefix. Draw an arrow from each prefix to its head noun. If you can't draw a clear arrow, you don't truly understand the sentence.\n\nEXERCISE 2 — COMPOSE: Pick a random noun and a different random class. Write a sentence with at least 5 agreement points — all correct. Example: pair kitabu (class 7) with wanafunzi (class 2).\n\nEXERCISE 3 — ERROR SPOT: Deliberately mis-agree one prefix in a chain. A C2 learner must spot it INSTANTLY — the way a native Vietnamese speaker instantly hears ''cái bàn này là đẹp quá'' as wrong.\n\nTIP: Memorize the full agreement table for the 8 core class pairs. Put it on your wall. Read it aloud every day for two weeks.",
    vocabulary: [
      {
        word: "ngeli",
        en: "noun class",
        vi: "lớp danh từ",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "NGE-li",
        pronunciation_en: "NGEH-lee",
      },
      {
        word: "ambacho",
        en: "which (class 7 relative pronoun)",
        vi: "cái mà (đại từ quan hệ lớp 7)",
        pos: "relative pronoun",
        pronunciation_vi: "a-mba-CHO",
        pronunciation_en: "ah-mbah-CHOH (amba- + -cho class 7)",
      },
      {
        word: "hii",
        en: "these (class 4, 9, 10 demonstrative)",
        vi: "những… này (chỉ định từ)",
        pos: "demonstrative",
        pronunciation_vi: "HI-i",
        pronunciation_en: "HEE-ee",
      },
      {
        word: "waliofaulu",
        en: "who succeeded (class 2 past relative)",
        vi: "những người đã thành công",
        pos: "relative verb form",
        pronunciation_vi: "wa-li-o-fa-U-lu",
        pronunciation_en: "wah-lee-oh-fah-OO-loo",
      },
      {
        word: "vilivyochaguliwa",
        en: "which were selected (class 8 past relative passive)",
        vi: "những cái đã được chọn (lớp 8)",
        pos: "relative verb form (passive)",
        pronunciation_vi: "vi-li-VYO-cha-gu-LI-wa",
        pronunciation_en: "vee-lee-VYOH-chah-goo-LEE-wah",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Kitabu kile ____ nilikisoma jana kina maelezo mazuri.",
        answer: "ambacho",
        hint_vi: "cái mà (đại từ quan hệ lớp 7)",
        hint_en: "which (class 7 relative pronoun)",
      },
      {
        type: "matching",
        instruction_vi: "Ghép lớp danh từ với tiền tố hòa hợp tương ứng cho chủ ngữ:",
        instruction_en: "Match noun class to its subject agreement prefix:",
        pairs: [
          { a: "Lớp 1 (M- số ít)", b: "a-" },
          { a: "Lớp 2 (Wa- số nhiều)", b: "wa-" },
          { a: "Lớp 7 (Ki- số ít)", b: "ki-" },
          { a: "Lớp 4 (Mi- số nhiều)", b: "i-" },
          { a: "Lớp 6 (Ma- số nhiều)", b: "ya-" },
        ],
      },
    ],
  },

  // ── 7. Idioms and proverbs (methali) ────────────────────────────────
  {
    id: "swahili_c2_idioms_proverbs",
    level: "C2",
    category: "idioms_proverbs",
    title_vi: "Thành ngữ và tục ngữ (methali)",
    title_en: "Idioms and proverbs (methali)",
    intro_vi:
      "Methali (tục ngữ) và nahau (thành ngữ) là cửa sổ vào tư duy văn hóa Swahili. Ở cấp C2, bạn không chỉ HIỂU methali mà còn BIẾT KHI NÀO nên dùng — và khi nào dùng methali là sáo rỗng. Ở Tanzania, một methali đúng lúc trong bài phát biểu có sức nặng ngang với trích dẫn Shakespeare trong tiếng Anh.",
    intro_en:
      "Methali (proverbs) and nahau (idioms) are windows into Swahili cultural thought. At C2, you don't just UNDERSTAND methali — you know WHEN to deploy them and when they'd sound clichéd. In Tanzania, a well-timed methali in a speech carries the weight of a Shakespeare quote in English.",
    sentences: [
      {
        sw: "Alipotaka kusisitiza umuhimu wa umoja, mzungumzaji alinukuu methali isemayo: ''Umoja ni nguvu, utengano ni udhaifu.''",
        en: "Wanting to emphasize the importance of unity, the speaker quoted the proverb: 'Unity is strength, division is weakness.'",
        vi: "Muốn nhấn mạnh tầm quan trọng của đoàn kết, diễn giả đã trích câu tục ngữ: 'Đoàn kết là sức mạnh, chia rẽ là yếu đuối.'",
        pronunciation_focus: [
          "mzungumzaji → m-zu-ngu-MZA-ji (speaker/orator, class 1, from -zungumza 'speak')",
          "alinukuu → a-li-nu-KU-u (class 1 + past + quote, Arabic نَقَلَ)",
          "umoja ni nguvu → u-MO-ja ni NGU-vu (unity + is + strength)",
          "utengano ni udhaifu → u-te-NGA-no ni u-dha-I-fu (division + is + weakness)",
        ],
        pronunciation_focus_en: [
          "mzungumzaji = speaker/orator (-zungumza = converse; -aji = agentive 'one who does')",
          "alinukuu = he/she quoted (Arabic n-q-l root, same as 'naql')",
          "udhaifu = weakness (Arabic ضَعِيف, u- abstract class 11)",
        ],
      },
      {
        sw: "Methali ''Mpanda farasi wawili hupasuka msamba'' inatukumbusha kwamba mtu hawezi kufanikiwa akifuata malengo mawili yanayokinzana.",
        en: "The proverb 'One who rides two horses splits at the crotch' reminds us that one cannot succeed pursuing two contradictory goals.",
        vi: "Tục ngữ 'Kẻ cưỡi hai con ngựa bị rách háng' nhắc chúng ta rằng không thể thành công khi theo đuổi hai mục tiêu mâu thuẫn.",
        pronunciation_focus: [
          "mpanda farasi → MPA-nda fa-RA-si (rider + horses; -panda = ride/climb)",
          "hupasuka msamba → hu-pa-SU-ka m-SA-mba (habitual-split-STATIVE + crotch)",
          "inatukumbusha → i-na-tu-ku-MBU-sha (CL9-present-us-remind-CAUS)",
          "yanayokinzana → ya-na-YO-ki-NZA-na (CL6-present-CL6.REL-contradict-RECIP)",
        ],
        pronunciation_focus_en: [
          "mpanda farasi wawili = rider of two horses (mpanda = one who rides/mounts)",
          "hupasuka msamba = splits at the crotch (vivid, bodily imagery — very Bantu)",
          "yanayokinzana = which contradict each other (-kinzana = be mutually contradictory)",
        ],
      },
      {
        sw: "Alipoulizwa kuhusu uamuzi mgumu, mkurugenzi alijibu kwa nahau: ''Tunavuka mto kwa mawe — hatua kwa hatua.''",
        en: "When asked about the difficult decision, the director replied with the idiom: 'We cross the river on stones — step by step.'",
        vi: "Khi được hỏi về quyết định khó khăn, giám đốc trả lời bằng thành ngữ: 'Chúng ta qua sông trên đá — từng bước một.'",
        pronunciation_focus: [
          "tunavuka mto → tu-na-VU-ka M-to (we-present-cross + river; -vuka = cross)",
          "kwa mawe → kwa MA-we (by means of stones; jiwe/mawe class 5/6)",
          "hatua kwa hatua → ha-TU-a kwa ha-TU-a (step + by + step)",
        ],
        pronunciation_focus_en: [
          "tunavuka mto kwa mawe = we cross the river on stepping stones",
          "hatua kwa hatua = step by step (hatua = step/stage; reduplication for gradualness)",
        ],
      },
    ],
    cultural_notes_vi:
      "METHALI — NGHỆ THUẬT GIAO TIẾP SWAHILI:\n\nTrong văn hóa Swahili, methali không phải là ''câu nói hay'' để trang trí — chúng là CÔNG CỤ LẬP LUẬN. Một methali đúng chỗ có thể: (1) kết thúc tranh luận, (2) an ủi người đau khổ, (3) đưa ra lời khuyên mà không trực diện (quan trọng trong văn hóa tránh đối đầu), (4) thể hiện học thức và sự từng trải.\n\nPHÂN LOẠI METHALI:\n- Methali za hekima (tục ngữ triết lý): ''Haraka haraka haina baraka'' (Vội vàng không có phước lành)\n- Methali za maonyo (tục ngữ cảnh báo): ''Asiyesikia la mkuu huvunjika guu'' (Kẻ không nghe lời người lớn sẽ gãy chân)\n- Methali za matumaini (tục ngữ hy vọng): ''Baada ya dhiki faraja'' (Sau khó khăn là niềm vui)\n- Methali za mapenzi (tục ngữ tình yêu): ''Penye nia pana njia'' (Nơi có ý chí, nơi đó có con đường)\n\nBẪY C2: Dùng methali quá nhiều nghe như đang giảng đạo. Dùng sai ngữ cảnh (ví dụ methali tình yêu trong cuộc họp kinh doanh) gây khó xử. C2 = biết BAO NHIÊU methali + biết KHI NÀO dùng.",
    cultural_notes_en:
      "METHALI — THE ART OF SWAHILI COMMUNICATION: In Swahili culture, methali aren't decorative 'nice sayings' — they're ARGUMENTATIVE TOOLS. A well-placed methali can: (1) settle a debate, (2) comfort someone grieving, (3) deliver advice without confrontation (crucial in an indirect-communication culture), (4) signal education and life experience. Categories: Methali za hekima (wisdom proverbs — ''Haraka haraka haina baraka'' / Haste has no blessing); Methali za maonyo (warning proverbs); Methali za matumaini (hope proverbs — ''Baada ya dhiki faraja'' / After hardship comes relief); Methali za mapenzi (love proverbs). The C2 trap: using too many methali sounds preachy; using the wrong category (e.g. a love proverb in a business meeting) is awkward. C2 = knowing WHICH methali + WHEN.",
    tip_advice_vi:
      "LUYỆN METHALI C2:\n\nBƯỚC 1 — HỌC 10 METHALI CỐT LÕI (học thuộc cả chữ Swahili + nghĩa đen + nghĩa bóng):\n1. Haraka haraka haina baraka. (Vội vàng không có phước lành.)\n2. Baada ya dhiki faraja. (Sau khó khăn là niềm vui.)\n3. Penye nia pana njia. (Nơi có ý chí, nơi đó có đường.)\n4. Mpanda farasi wawili hupasuka msamba. (Cưỡi hai ngựa thì rách háng.)\n5. Asiyejua hakuthamini. (Kẻ không biết thì không trân trọng.)\n6. Maji ukiyavulia nguo huna budi kuyaoga. (Nước bạn cởi đồ để tắm thì phải tắm thôi.)\n7. Mtaka cha mvunguni sharti ainame. (Muốn lấy đồ dưới gầm giường phải cúi xuống.)\n8. Dalili ya mvua ni mawingu. (Dấu hiệu của mưa là mây.)\n9. Samaki mkunje angali mbichi. (Uốn cá khi nó còn tươi.)\n10. Umoja ni nguvu, utengano ni udhaifu. (Đoàn kết là sức mạnh.)\n\nBƯỚC 2 — Mỗi ngày chọn một methali, viết một đoạn văn ~100 từ trong đó methali xuất hiện TỰ NHIÊN (không gượng ép, không giảng giải).\n\nBƯỚC 3 — Xem video hotuba (bài phát biểu) của các chính trị gia Tanzania trên YouTube — ghi lại mỗi methali họ dùng và phân tích TẠI SAO họ chọn methali đó ở thời điểm đó.",
    tip_advice_en:
      "C2 METHALI DRILL:\n\nSTEP 1 — Memorize 10 core methali (Swahili text + literal meaning + figurative meaning — all three): see the Vietnamese list above for the core set.\n\nSTEP 2 — Each day, pick one methali and write a ~100-word paragraph where the methali appears NATURALLY (not forced, not explained).\n\nSTEP 3 — Watch hotuba (speech) videos by Tanzanian politicians on YouTube — note every methali they use and analyze WHY they chose that particular proverb at that particular moment.",
    vocabulary: [
      {
        word: "methali",
        en: "proverb",
        vi: "tục ngữ",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "me-THA-li",
        pronunciation_en: "meh-THAH-lee (Arabic مَثَل)",
      },
      {
        word: "nahau",
        en: "idiom",
        vi: "thành ngữ",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "na-HA-u",
        pronunciation_en: "nah-HAH-oo (Arabic نَحْو)",
      },
      {
        word: "kunukuu",
        en: "to quote / cite",
        vi: "trích dẫn",
        pos: "verb",
        pronunciation_vi: "ku-nu-KU-u",
        pronunciation_en: "koo-noo-KOO-oo (Arabic نَقَلَ)",
      },
      {
        word: "msamba",
        en: "crotch / inner thigh (in proverb)",
        vi: "háng (trong tục ngữ)",
        pos: "noun (cl. 3/4)",
        pronunciation_vi: "m-SA-mba",
        pronunciation_en: "m-SAHM-bah",
      },
      {
        word: "farasi",
        en: "horse",
        vi: "ngựa",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "fa-RA-si",
        pronunciation_en: "fah-RAH-see (Arabic فَرَس)",
      },
    ],
    idiom_glosses: [
      {
        idiom: "Haraka haraka haina baraka.",
        literal: "Vội vội không có phước.",
        literal_en: "Hurry hurry has no blessing.",
        meaning: "Làm việc gì quá vội vàng thường không đem lại kết quả tốt. Tương đương: 'Dục tốc bất đạt.'",
        meaning_en: "Rushing things usually leads to poor results. Equivalent to: 'Haste makes waste.'",
        example: "Usikimbilie kuoa. Haraka haraka haina baraka.",
        example_en: "Don't rush into marriage. Haste makes waste.",
      },
      {
        idiom: "Baada ya dhiki faraja.",
        literal: "Sau khó khăn là niềm vui.",
        literal_en: "After hardship comes relief.",
        meaning: "Mọi khó khăn rồi sẽ qua. Dùng để an ủi người đang đau khổ.",
        meaning_en: "All hardship eventually passes. Used to comfort someone suffering.",
        example: "Tutaondoka kwenye mgogoro huu. Baada ya dhiki faraja.",
        example_en: "We will emerge from this crisis. After hardship comes relief.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "____ haraka haina baraka.",
        answer: "Haraka",
        hint_vi: "bắt đầu của methali 'vội vàng không có phước'",
        hint_en: "start of the proverb 'haste has no blessing'",
      },
    ],
  },

  // ── 8. Formal register and honorifics ───────────────────────────────
  {
    id: "swahili_c2_formal_register",
    level: "C2",
    category: "formal_register",
    title_vi: "Văn phong trang trọng và kính ngữ",
    title_en: "Formal register and honorifics",
    intro_vi:
      "Kiểm soát cấp độ ngôn ngữ trong tiếng Swahili: khi nào dùng wewe (bạn) vs. weye (trang trọng, cổ), khi nào thêm tiền tố kính ngữ mheshimiwa (ngài), bwana/bibi (ông/bà), ndugu (đồng chí/anh/chị). Ở cấp C2, chọn sai kính ngữ có thể gây mất mặt (aibu) — không chỉ cho bạn mà cho cả người đối diện.",
    intro_en:
      "Control register in Swahili: when to use wewe (you, neutral) vs. weye (formal, archaic), when to add the honorific mheshimiwa (honorable), bwana/bibi (sir/madam), ndugu (comrade/sibling). At C2, choosing the wrong honorific can cause aibu (loss of face) — not just for you, but for the person you're addressing.",
    sentences: [
      {
        sw: "Mheshimiwa Spika, naomba ruhusa yako ili niweze kuchangia hoja iliyowasilishwa na mheshimiwa waziri.",
        en: "Honorable Speaker, I request your permission so that I may contribute to the motion presented by the honorable minister.",
        vi: "Kính thưa Ngài Chủ tịch, tôi xin phép ngài để được đóng góp ý kiến về đề xuất do ngài bộ trưởng trình bày.",
        pronunciation_focus: [
          "mheshimiwa → m-he-shi-MI-wa (honorable, lit. 'one who is respected')",
          "naomba ruhusa → na-O-mba ru-HU-sa (I request + permission, Arabic رُخْصَة)",
          "kuchangia → ku-cha-NGI-a (infinitive + contribute, applicative of -changa)",
          "hoja → HO-ja (argument/motion, Arabic حُجَّة)",
        ],
        pronunciation_focus_en: [
          "mheshimiwa = honorable (passive of -heshimu 'respect'; mandatory in Tanzanian parliament)",
          "naomba ruhusa = I beg your permission (stronger than 'request'; -omba = beg/plead)",
          "hoja = motion/argument (Arabic حُجَّة 'proof'; distinct from swali 'question')",
        ],
      },
      {
        sw: "Kwa heshima kubwa, tunapenda kumshukuru mzee wetu kwa mawaidha yake yenye busara na uzoefu wa miaka mingi.",
        en: "With great respect, we wish to thank our elder for his advice, full of wisdom and many years of experience.",
        vi: "Với lòng kính trọng sâu sắc, chúng tôi xin cảm ơn bậc trưởng lão của chúng tôi vì những lời khuyên đầy khôn ngoan và kinh nghiệm nhiều năm.",
        pronunciation_focus: [
          "kwa heshima kubwa → kwa he-SHI-ma KU-bwa (with respect + great; heshima = Arabic اِحْتِرَام)",
          "mzee wetu → m-ZE-e WE-tu (elder + our; mzee = respected older person)",
          "mawaidha → ma-wa-I-dha (advice/counsel, class 6, Arabic مَوَاعِظ)",
          "busara → bu-SA-ra (wisdom/prudence, Arabic بَصَارَة)",
        ],
        pronunciation_focus_en: [
          "mzee = elder (core honorific, class 1; can mean 'old person' in neutral context, but 'respected elder' in formal)",
          "mawaidha = counsel (Arabic, connotes religious/moral guidance)",
          "busara = wisdom (Arabic, distinct from hekima 'wisdom' — busara = practical prudence)",
        ],
      },
      {
        sw: "Ndugu mwenyekiti, tunapendekeza kwamba kamati hii iundwe upya ili kutafakari hali halisi ya utekelezaji wa sera zetu.",
        en: "Comrade Chairperson, we recommend that this committee be reconstituted to reflect the actual state of our policy implementation.",
        vi: "Thưa đồng chí chủ tịch, chúng tôi đề nghị rằng ủy ban này nên được tái lập để phản ánh đúng tình hình thực tế của việc triển khai chính sách.",
        pronunciation_focus: [
          "ndugu mwenyekiti → NDU-gu mwe-nye-KI-ti (comrade/sibling + chairperson)",
          "tunapendekeza → tu-na-pe-nde-KE-za (we-present-recommend-CAUS)",
          "iundwe upya → i-U-ndwe U-pya (CL9-be formed-SUBJUNCTIVE + anew)",
          "utekelezaji → u-te-ke-le-ZA-ji (implementation, u- abstract + -aji agentive)",
        ],
        pronunciation_focus_en: [
          "ndugu = comrade/sibling (the default address in Tanzanian political meetings; egalitarian)",
          "mwenyekiti = chairperson (mwenye 'one who has' + kiti 'chair')",
          "iundwe upya = be reconstituted (subjunctive passive of -unda 'form/create')",
        ],
      },
    ],
    cultural_notes_vi:
      "HỆ THỐNG KÍNH NGỮ SWAHILI — PHÂN BIỆT TINH TẾ:\n\nTiếng Swahili KHÔNG có hệ thống kính ngữ phức tạp như tiếng Nhật hay tiếng Hàn. Thay vào đó, sự tôn trọng được thể hiện qua:\n1. TỪ XƯNG HÔ (hơn 10 lựa chọn): mheshimiwa (ngài — chính trị), bwana/bibi (ông/bà — lịch sự), ndugu (đồng chí/anh/chị — bình đẳng, Tanzania), kaka/dada (anh/chị — thân mật), mzee (bậc trưởng lão — kính trọng tuổi tác), baba/mama (cha/mẹ — thân kính), mwalimu (thầy/cô — nghề giáo).\n2. ĐỘNG TỪ CẦU KHIẾN: naomba (tôi xin — lịch sự nhất) > naombaji (tôi tha thiết xin) > ningependa (tôi muốn) > nataka (tôi muốn — thẳng, kém lịch sự).\n3. ÂM ĐIỆU: Không có thanh điệu, nhưng tốc độ và độ ngân giọng thể hiện sự tôn trọng.\n\nĐẶC TRƯNG TANZANIA vs KENYA: Ở Tanzania, ndugu (đồng chí) được dùng rộng rãi do ảnh hưởng của ujamaa (chủ nghĩa xã hội Nyerere). Ở Kenya, bwana/bibi được ưa chuộng hơn. Dùng ndugu ở Nairobi có thể bị coi là ''cổ hủ kiểu Tanzania.''",
    cultural_notes_en:
      "SWAHILI HONORIFIC SYSTEM — SUBTLE DISTINCTIONS: Swahili does NOT have a complex honorific system like Japanese or Korean. Instead, respect is conveyed through: (1) ADDRESS TERMS (10+ choices): mheshimiwa (honorable — political), bwana/bibi (sir/madam — polite), ndugu (comrade — egalitarian, Tanzania), kaka/dada (brother/sister — familiar), mzee (elder — age respect), baba/mama (father/mother — affectionate), mwalimu (teacher — professional); (2) REQUEST VERBS: naomba (I beg — most polite) > ningependa (I would like) > nataka (I want — blunt); (3) PROSODY: no tones, but speed and elongation signal respect. Tanzania vs Kenya: ndugu is widespread in Tanzania (legacy of ujamaa / Nyerere's socialism); bwana/bibi is preferred in Kenya. Using ndugu in Nairobi can read as 'quaintly Tanzanian.'",
    tip_advice_vi:
      "LUYỆN KÍNH NGỮ C2:\n\nBÀI TẬP 1 — THANG ĐỘ XƯNG HÔ: Viết CÙNG MỘT CÂU (''Tôi muốn hỏi ông một câu'') ở 5 mức độ kính trọng khác nhau, từ thân mật đến cực kỳ trang trọng. So sánh sự khác biệt.\n\nBÀI TẬP 2 — ĐỌC HANSARD: Đọc biên bản quốc hội Tanzania (Bunge — có trên parliament.go.tz) và gạch dưới mọi kính ngữ. Đếm tần suất của mheshimiwa — thường xuất hiện 2-3 lần trong MỘT CÂU!\n\nBÀI TẬP 3 — PHÂN BIỆT VÙNG MIỀN: Tìm một video chính trị Kenya và một video chính trị Tanzania. So sánh cách dùng kính ngữ.\n\nLỖI C2 NGƯỜI VIỆT: Dùng ndugu với người Kenya (nghe ''Tanzania quá''). Dùng mheshimiwa ngoài bối cảnh chính trị (nghe trịnh trọng thái quá). Dùng wewe (bạn) thay vì kính ngữ phù hợp trong tình huống trang trọng.",
    tip_advice_en:
      "C2 HONORIFIC DRILL: (1) Write the SAME request ('I'd like to ask you something') at 5 different respect levels, from intimate to ultra-formal. (2) Read the Tanzanian parliamentary Hansard (parliament.go.tz) and underline every honorific — mheshimiwa often appears 2-3 times in a SINGLE sentence. (3) Find a Kenyan political speech and a Tanzanian one; compare honorific usage. Vietnamese-speaker traps: using ndugu with Kenyans (sounds 'too Tanzanian'); using mheshimiwa outside political contexts (sounds comically over-formal); defaulting to wewe where an honorific is expected.",
    vocabulary: [
      {
        word: "mheshimiwa",
        en: "honorable (formal address)",
        vi: "ngài / quý ngài (kính ngữ chính trị)",
        pos: "noun (cl. 1/2)",
        pronunciation_vi: "m-he-shi-MI-wa",
        pronunciation_en: "m-heh-shee-MEE-wah (passive of -heshimu 'honor')",
      },
      {
        word: "ndugu",
        en: "comrade / sibling / brother/sister",
        vi: "đồng chí / anh / chị",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "NDU-gu",
        pronunciation_en: "NDOO-goo",
      },
      {
        word: "mzee",
        en: "elder / respected older person",
        vi: "bậc trưởng lão",
        pos: "noun (cl. 1/2)",
        pronunciation_vi: "m-ZE-e",
        pronunciation_en: "m-ZEH-eh (two syllables)",
      },
      {
        word: "ruhusa",
        en: "permission",
        vi: "sự cho phép",
        pos: "noun (cl. 9)",
        pronunciation_vi: "ru-HU-sa",
        pronunciation_en: "roo-HOO-sah (Arabic رُخْصَة)",
      },
      {
        word: "mwenyekiti",
        en: "chairperson",
        vi: "chủ tịch (ủy ban/hội đồng)",
        pos: "noun (cl. 1/2)",
        pronunciation_vi: "mwe-nye-KI-ti",
        pronunciation_en: "mweh-nyeh-KEE-tee (mwenye 'one who has' + kiti 'chair')",
      },
    ],
    exercises: [
      {
        type: "translation",
        vietnamese: "Kính thưa Ngài Chủ tịch, tôi xin phép được phát biểu.",
        english: "Honorable Speaker, I request permission to speak.",
        swahili: "Mheshimiwa Spika, naomba ruhusa ya kuzungumza.",
      },
    ],
  },

  // ── 9. Philosophical and abstract discourse ────────────────────────
  {
    id: "swahili_c2_philosophical",
    level: "C2",
    category: "philosophical",
    title_vi: "Diễn ngôn triết học và trừu tượng",
    title_en: "Philosophical and abstract discourse",
    intro_vi:
      "Thảo luận các khái niệm trừu tượng: uhuru (tự do), haki (công lý), utu (nhân tính), dhamira (ý thức/ý định), maadili (đạo đức), fahamu (nhận thức). Tiếng Swahili có một truyền thống triết học phong phú — từ Nyerere (Ujamaa) đến các nhà tư tưởng đương đại. Ở cấp C2, phân biệt các lớp từ trừu tượng Ả Rập và Bantu.",
    intro_en:
      "Discuss abstract concepts: uhuru (freedom), haki (justice), utu (humanity), dhamira (consciousness/intention), maadili (ethics), fahamu (awareness). Swahili has a rich philosophical tradition — from Nyerere (Ujamaa) to contemporary thinkers. At C2, distinguish between Arabic-origin and Bantu-origin abstract vocabulary.",
    sentences: [
      {
        sw: "Dhana ya utu inasisitiza kwamba thamani ya binadamu haipimwi kwa mali alizonazo, bali kwa jinsi anavyochangia ustawi wa jamii yake.",
        en: "The concept of utu (humanity/humanness) emphasizes that a person's worth is not measured by the wealth they possess, but by how they contribute to the well-being of their community.",
        vi: "Khái niệm utu (nhân tính) nhấn mạnh rằng giá trị của con người không được đo bằng tài sản họ có, mà bằng cách họ đóng góp vào sự thịnh vượng của cộng đồng.",
        pronunciation_focus: [
          "dhana → DHA-na (concept, Arabic ظَنّ)",
          "utu → U-tu (humanity/humanness, Bantu u- abstract + -tu 'person')",
          "haipimwi → ha-i-PI-mwi (NEG-CL9-measure-PASS; 'it is not measured')",
          "anavyochangia → a-na-VYO-cha-NGI-a (CL1-present-CL8.REL-contribute-APPL)",
        ],
        pronunciation_focus_en: [
          "utu = humanity (core Bantu concept; u- class 11 abstract + ntu 'person')",
          "dhana = concept/notion (Arabic ظَنّ; distinct from wazo 'idea' which is Bantu)",
          "haipimwi = it is not measured (passive of -pima 'measure/weigh')",
        ],
      },
      {
        sw: "Uhuru wa kweli haumaanishi tu kukosekana kwa minyororo, bali pia uwepo wa fursa halisi za kujitegemea na kujiamulia mambo yanayohusu maisha ya mtu binafsi.",
        en: "True freedom does not mean only the absence of chains, but also the existence of real opportunities for self-reliance and self-determination in matters concerning one's personal life.",
        vi: "Tự do thực sự không chỉ có nghĩa là không có xiềng xích, mà còn là sự tồn tại của những cơ hội thực tế để tự lực và tự quyết định những vấn đề liên quan đến cuộc sống cá nhân.",
        pronunciation_focus: [
          "uhuru → u-HU-ru (freedom, Arabic حُرِّيَّة via Bantu u- prefix)",
          "haumaanishi → ha-u-ma-a-NI-shi (NEG-CL11-mean-CAUS; 'it does not mean')",
          "minyororo → mi-NYO-ro-ro (chains, class 4; sing. mnyororo, Arabic origin?)",
          "kujitegemea → ku-ji-te-ge-ME-a (infinitive + reflexive + lean on + applicative = 'self-reliance')",
        ],
        pronunciation_focus_en: [
          "uhuru = freedom (Bantu u- abstract + Arabic حر; foundational to Nyerere's philosophy)",
          "kujitegemea = self-reliance (-ji- reflexive + -tegemea 'depend on'; core Nyerere concept)",
          "kujiamulia = self-determination (-ji- reflexive + -amua 'decide' + applicative -ia)",
        ],
      },
      {
        sw: "Falsafa ya Kiafrika, tofauti na falsafa ya Kimagharibi, haitenganishi mtu binafsi na jamii yake, wala haitenganishi akili na hisia.",
        en: "African philosophy, unlike Western philosophy, does not separate the individual from their community, nor does it separate reason from emotion.",
        vi: "Triết học châu Phi, khác với triết học phương Tây, không tách rời cá nhân khỏi cộng đồng, cũng không tách rời lý trí khỏi cảm xúc.",
        pronunciation_focus: [
          "falsafa → fal-SA-fa (philosophy, Arabic فَلْسَفَة via Greek)",
          "haitenganishi → ha-i-te-nga-NI-shi (NEG-CL9-separate-RECIP-CAUS)",
          "wala → WA-la (nor; Arabic وَلَا — elegant negation pair: si... wala...)",
          "hisia → hi-SI-a (feelings/emotions, Arabic حِسّ + abstract -ia)",
        ],
        pronunciation_focus_en: [
          "falsafa = philosophy (Arabic فَلْسَفَة < Greek φιλοσοφία)",
          "haitenganishi... wala... = it does not separate... nor... (si... wala... = neither... nor)",
          "akili = reason/intellect (Arabic عَقْل; distinct from busara 'practical wisdom')",
        ],
      },
    ],
    cultural_notes_vi:
      "TRIẾT HỌC SWAHILI — BA TRỤ CỘT:\n\n1. UTU (NHÂN TÍNH): Khái niệm Bantu cổ: một người trở thành ''người'' thông qua quan hệ với người khác. Có liên hệ với Ubuntu ở Nam Phi. Câu nói kinh điển: ''Mtu ni watu'' (Một người là nhờ mọi người).\n\n2. UJAMAA (CHỦ NGHĨA GIA ĐÌNH MỞ RỘNG): Triết lý của Julius Nyerere (Tanzania) — xã hội chủ nghĩa dựa trên nền tảng đại gia đình châu Phi. Ba trụ cột: kujitegemea (tự lực), usawa (bình đẳng), umoja (đoàn kết). Tuyên ngôn Arusha (Azimio la Arusha, 1967) là văn kiện triết học — chính trị quan trọng nhất viết bằng tiếng Swahili.\n\n3. HEKIMA (SỰ KHÔN NGOAN): Không chỉ là kiến thức (maarifa) mà là sự hiểu biết áp dụng được vào đời sống. Người có hekima được gọi là mwenye hekima (người khôn ngoan) — một danh hiệu xã hội quan trọng.",
    cultural_notes_en:
      "SWAHILI PHILOSOPHY — THREE PILLARS: (1) UTU (HUMANENESS): The ancient Bantu concept: a person becomes 'human' through relationships with others. Related to Ubuntu in Southern Africa. Classic saying: ''Mtu ni watu'' (A person is people). (2) UJAMAA (EXTENDED-FAMILY SOCIALISM): Julius Nyerere's philosophy — African socialism built on the extended-family foundation. Three pillars: kujitegemea (self-reliance), usawa (equality), umoja (unity). The Arusha Declaration (Azimio la Arusha, 1967) is the most important philosophical-political document ever written in Swahili. (3) HEKIMA (WISDOM): Not just knowledge (maarifa) but applied understanding. A person of hekima is called mwenye hekima — a significant social title.",
    tip_advice_vi:
      "LUYỆN TRIẾT HỌC C2:\n\nĐỌC: Azimio la Arusha (có bản PDF miễn phí) — đây là bài tập đọc C2 hoàn hảo vì nó được VIẾT BẰNG SWAHILI (không dịch từ tiếng Anh). Phân tích: (1) những từ Bantu nào được dùng thay vì từ Ả Rập? (Nyerere CHỦ TRƯƠNG dùng Bantu.) (2) Cấu trúc lặp để nhấn mạnh? (3) Sự kết hợp giữa political (chính trị) và philosophical (triết học)?\n\nVIẾT: Chọn một khái niệm (uhuru, haki, utu, hekima) và viết một đoạn 150 từ giải thích khái niệm đó bằng SWAHILI mà KHÔNG dùng từ tiếng Anh vay mượn nào.",
    tip_advice_en:
      "C2 PHILOSOPHICAL DRILL: READ the Arusha Declaration (free PDF) — it's the perfect C2 text because it was THOUGHT IN SWAHILI (not translated from English). Analyze: which Bantu words replace Arabic loans? (Nyerere deliberately preferred Bantu.) What repetition structures create emphasis? How does it blend political and philosophical registers? WRITE: Pick one concept (uhuru, haki, utu, hekima) and write 150 words explaining it in Swahili using NO English borrowings.",
    vocabulary: [
      {
        word: "utu",
        en: "humanity / humanness",
        vi: "nhân tính",
        pos: "noun (cl. 11)",
        pronunciation_vi: "U-tu",
        pronunciation_en: "OO-too (Bantu; cf. Ubuntu)",
      },
      {
        word: "uhuru",
        en: "freedom / independence",
        vi: "tự do",
        pos: "noun (cl. 11)",
        pronunciation_vi: "u-HU-ru",
        pronunciation_en: "oo-HOO-roo",
      },
      {
        word: "dhamira",
        en: "intention / consciousness / conscience",
        vi: "ý thức / ý định",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "dha-MI-ra",
        pronunciation_en: "dhah-MEE-rah (Arabic ضَمِير)",
      },
      {
        word: "kujitegemea",
        en: "self-reliance",
        vi: "tự lực",
        pos: "verb (infinitive, reflexive)",
        pronunciation_vi: "ku-ji-te-ge-ME-a",
        pronunciation_en: "koo-jee-teh-geh-MEH-ah",
      },
      {
        word: "falsafa",
        en: "philosophy",
        vi: "triết học",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "fal-SA-fa",
        pronunciation_en: "fahl-SAH-fah (Arabic < Greek)",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Dhana ya ____ inasisitiza kwamba thamani ya binadamu haipimwi kwa mali.",
        answer: "utu",
        hint_vi: "nhân tính (khái niệm triết học Bantu)",
        hint_en: "humanity/humanness (Bantu philosophical concept)",
      },
    ],
  },

  // ── 10. Debate and persuasion ──────────────────────────────────────
  {
    id: "swahili_c2_debate",
    level: "C2",
    category: "debate",
    title_vi: "Tranh luận và thuyết phục",
    title_en: "Debate and persuasion",
    intro_vi:
      "Xây dựng lập luận thuyết phục trong tiếng Swahili: cấu trúc nhượng bộ trước — phản bác sau (ingawa… hata hivyo…), kỹ thuật đặt câu hỏi tu từ, và cách dùng takwimu (số liệu) và mifano (ví dụ) để củng cố lập luận. Ở cấp C2, bạn phân biệt được tranh luận học thuật (mjadala) với tranh cãi chính trị (mahojiano makali).",
    intro_en:
      "Build persuasive arguments in Swahili: the concede-first-then-rebut structure (ingawa… hata hivyo…), rhetorical questioning techniques, and the use of takwimu (statistics) and mifano (examples) to strengthen arguments. At C2, distinguish between academic debate (mjadala) and political sparring (mahojiano makali).",
    sentences: [
      {
        sw: "Ingawa hoja ya upinzani ina msingi wake, hatuwezi kupuuza ukweli kwamba takwimu za hivi karibuni zinaonyesha mwelekeo tofauti kabisa.",
        en: "Although the opposition's argument has its basis, we cannot ignore the fact that recent statistics show a completely different trend.",
        vi: "Mặc dù lập luận của phe đối lập có cơ sở của nó, chúng ta không thể phớt lờ sự thật rằng số liệu gần đây cho thấy một xu hướng hoàn toàn khác.",
        pronunciation_focus: [
          "ingawa → i-NGA-wa (although)",
          "hoja ya upinzani → HO-ja ya u-pi-NZA-ni (argument + of + opposition)",
          "hatuwezi kupuuza → ha-tu-WE-zi ku-pu-U-za (NEG-we-can + ignore/dismiss)",
          "takwimu → ta-KWI-mu (statistics, Arabic تَقْوِيم)",
        ],
        pronunciation_focus_en: [
          "ingawa = although (standard concessive; ingawa… hata hivyo = concede… rebut)",
          "kupuuza = to ignore/dismiss (causative of -puuza 'be negligent')",
          "mwelekeo = trend/direction (m- class 3; -elekea = head toward)",
        ],
      },
      {
        sw: "Swali la msingi siyo kama tunakubaliana, bali ni kama tuna ushahidi wa kutosha kuthibitisha madai yetu.",
        en: "The fundamental question is not whether we agree, but whether we have sufficient evidence to substantiate our claims.",
        vi: "Câu hỏi cốt lõi không phải là chúng ta có đồng ý hay không, mà là chúng ta có đủ bằng chứng để chứng minh những tuyên bố của mình hay không.",
        pronunciation_focus: [
          "siyo… bali… → SI-yo… BA-li… (not… but rather…)",
          "ushahidi → u-sha-HI-di (evidence, Arabic شَهِيد)",
          "kuthibitisha → ku-thi-bi-TI-sha (infinitive + prove-CAUS, Arabic ثَبَتَ)",
          "madai → ma-DA-i (claims/allegations, class 6 plural of dai, Arabic اِدِّعَاء)",
        ],
        pronunciation_focus_en: [
          "siyo… bali… = not X but rather Y (siyo negative copula + bali 'rather')",
          "kuthibitisha = to prove/substantiate (-thibiti 'be firm' + causative -isha)",
          "ushahidi = evidence/testimony (Arabic شَهِيد, formal/forensic register)",
        ],
      },
      {
        sw: "Tunapaswa kutofautisha kati ya yale yanayowezekana kiufundi na yale yanayofaa kimaadili.",
        en: "We must distinguish between what is technically possible and what is ethically appropriate.",
        vi: "Chúng ta phải phân biệt giữa điều khả thi về mặt kỹ thuật và điều phù hợp về mặt đạo đức.",
        pronunciation_focus: [
          "kutofautisha → ku-to-fa-u-TI-sha (infinitive + differ-CAUS = distinguish)",
          "yanayowezekana → ya-na-YO-we-ze-KA-na (CL6-present-CL6.REL-possible-STATIVE-HABITUAL)",
          "kiufundi → ki-u-FU-ndi (ki- adverbial + ufundi 'technique'; 'technically')",
          "kimaadili → ki-ma-a-DI-li (ki- adverbial + maadili 'ethics'; 'ethically')",
        ],
        pronunciation_focus_en: [
          "kutofautisha = to distinguish (causative of -tofauti 'differ'; Arabic اِخْتِلَاف)",
          "kiufundi… kimaadili = technically… ethically (ki- adverbial prefix pair)",
          "yanayowezekana = which are possible (long relative chain, habitual -ana)",
        ],
      },
    ],
    cultural_notes_vi:
      "TRANH LUẬN TRONG VĂN HÓA SWAHILI:\n\nTrong văn hóa Swahili (đặc biệt Tanzania), tranh luận công khai tuân theo các quy tắc lịch sự nghiêm ngặt:\n\n1. KHÔNG BAO GIỜ CÔNG KÍCH CÁ NHÂN: Kukanusha hoja siyo kukanusha mtu (bác bỏ luận điểm, không bác bỏ con người). Đây là nguyên tắc vàng.\n\n2. NHƯỢNG BỘ TRƯỚC, PHẢN BÁC SAU: Giống với văn hóa Ý C2 — luôn thừa nhận điểm đúng của đối phương trước khi nêu bất đồng. Vào thẳng phản bác bị coi là ukorofi (thô lỗ).\n\n3. DÙNG METHALI ĐÚNG CHỖ: Một methali có thể thay thế cả một đoạn lập luận — nhưng sai methali làm hỏng toàn bộ lập luận.\n\n4. NGÔN NGỮ CƠ THỂ: Ở Tanzania, người tranh luận thường vung nhẹ tay với lòng bàn tay hướng lên (dấu hiệu của sự chân thành, không đe dọa). Tay nắm đấm bị coi là hung hăng.\n\n5. KHÔNG NGẮT LỜI: Swahili có câu ''Msemaji ana haki ya kumaliza'' (Người nói có quyền nói hết). Ngắt lời là kosa kubwa (lỗi lớn).",
    cultural_notes_en:
      "DEBATE IN SWAHILI CULTURE: In Swahili culture (especially Tanzania), public debate follows strict politeness rules: (1) NEVER ATTACK THE PERSON: Kukanusha hoja siyo kukanusha mtu (refute the argument, not the person) — the golden rule. (2) CONCEDE FIRST, REBUT SECOND: Like Italian C2 culture — always acknowledge the other side's valid point before disagreeing. Jumping straight to rebuttal is ukorofi (rudeness). (3) DEPLOY METHALI: A well-placed proverb can replace a whole paragraph of argument — but the wrong one can sink your credibility. (4) BODY LANGUAGE: Tanzanian debaters gesture with palm-up hands (signals sincerity, non-threat). A closed fist reads as aggressive. (5) NO INTERRUPTING: ''Msemaji ana haki ya kumaliza'' (The speaker has the right to finish). Interrupting is kosa kubwa (a grave error).",
    tip_advice_vi:
      "LUYỆN TRANH LUẬN C2:\n\nBƯỚC 1 — XEM: Tìm video ''Mjadala wa Bunge'' (Tranh luận Quốc hội) Tanzania trên YouTube. Quan sát cấu trúc: mheshimiwa → nhượng bộ → số liệu → methali (tùy chọn) → kết luận.\n\nBƯỚC 2 — VIẾT: Chọn một chủ đề nóng ở Đông Phi (ví dụ: usafirishaji haramu wa pembe za ndovu — buôn lậu ngà voi). Viết hai đoạn: A — ủng hộ hành động mạnh tay, B — phản đối. Mỗi đoạn phải có nhượng bộ TRƯỚC KHI phản bác.\n\nBƯỚC 3 — CÔNG THỨC CÂU C2:\n- Mở nhượng bộ: ''Ninakubali kwamba… hata hivyo…'' (Tôi đồng ý rằng… tuy nhiên…)\n- Đưa bằng chứng: ''Kulingana na takwimu za…'' (Theo số liệu của…)\n- Đặt câu hỏi tu từ: ''Je, inawezekana kweli kwamba…?'' (Liệu có thực sự khả thi rằng…?)\n- Phản bác: ''Hoja hii ina mapungufu kadhaa. Kwanza…'' (Lập luận này có vài thiếu sót. Thứ nhất…)\n- Kết: ''Kwa kumalizia, ninasisitiza kwamba…'' (Để kết luận, tôi nhấn mạnh rằng…)",
    tip_advice_en:
      "C2 DEBATE DRILL: (1) WATCH Tanzanian ''Mjadala wa Bunge'' (Parliamentary Debate) on YouTube — observe the structure: mheshimiwa → concession → statistics → optional methali → conclusion. (2) WRITE: pick a hot East African topic (e.g. ivory poaching). Write two paragraphs: pro-intervention and anti-intervention. Each MUST concede before rebutting. (3) MASTER C2 SENTENCE TEMPLATES: concede (''Ninakubali kwamba… hata hivyo…''), evidence (''Kulingana na takwimu za…''), rhetorical question (''Je, inawezekana kweli kwamba…?''), rebut (''Hoja hii ina mapungufu kadhaa. Kwanza…''), conclude (''Kwa kumalizia, ninasisitiza kwamba…'').",
    vocabulary: [
      {
        word: "mjadala",
        en: "debate / deliberation",
        vi: "tranh luận",
        pos: "noun (cl. 3/4)",
        pronunciation_vi: "m-ja-DA-la",
        pronunciation_en: "m-jah-DAH-lah (Arabic جَدَل)",
      },
      {
        word: "hoja",
        en: "argument / point / motion",
        vi: "luận điểm / lập luận",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "HO-ja",
        pronunciation_en: "HOH-jah (Arabic حُجَّة)",
      },
      {
        word: "takwimu",
        en: "statistics / data",
        vi: "số liệu thống kê",
        pos: "noun (cl. 9/10)",
        pronunciation_vi: "ta-KWI-mu",
        pronunciation_en: "tah-KWEE-moo (Arabic تَقْوِيم)",
      },
      {
        word: "ushahidi",
        en: "evidence / testimony",
        vi: "bằng chứng",
        pos: "noun (cl. 11)",
        pronunciation_vi: "u-sha-HI-di",
        pronunciation_en: "oo-shah-HEE-dee (Arabic شَهِيد)",
      },
      {
        word: "kukanusha",
        en: "to refute / deny",
        vi: "bác bỏ / phủ nhận",
        pos: "verb",
        pronunciation_vi: "ku-ka-NU-sha",
        pronunciation_en: "koo-kah-NOO-shah",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "____ hoja ya upinzani ina msingi wake, hatuwezi kupuuza ukweli wa takwimu.",
        answer: "Ingawa",
        hint_vi: "mặc dù (liên từ nhượng bộ)",
        hint_en: "although (concessive conjunction)",
      },
      {
        type: "fill_blank",
        question: "Swali la msingi siyo kama tunakubaliana, ____ ni kama tuna ushahidi wa kutosha.",
        answer: "bali",
        hint_vi: "mà là… (siyo… bali… = không phải… mà là…)",
        hint_en: "but rather (siyo… bali… = not… but rather…)",
      },
    ],
  },
];

export default lessons;
