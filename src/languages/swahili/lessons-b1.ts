// Swahili B1 lessons — Kiswahili Sanifu in Latin script.
// B1 focus: work, health, public services, opinions, and past narration.
//
// Swahili B1 grammar covered across these lessons:
//   - Past tense (-li-), future (-ta-), perfect (-me-), present (-na-)
//   - Object infixes (-ni-, -ku-, -m-, -wa-)
//   - Common noun classes (m/wa, ki/vi, n/n, ji/ma, m/mi, u/n)
//   - Verb extensions: applicative (-ia/-ea), passive (-wa), causative (-isha/-esha)
//   - Connectors: kwa sababu, lakini, kisha, baada ya, mwishowe
//   - Conditional -nge- / -ngali- (recognition only at B1)

import type { SwahiliCategoryId } from "./lessons";

type SwahiliSentence = {
  sw: string;
  vi: string;
  en: string;
  note_vi?: string;
  note_en?: string;
};

type SwahiliVocabEntry = {
  cell_id?: string;
  sw: string;
  vi: string;
  en: string;
  pos?: string;
  ngeli?: string;
};

type SwahiliExercise =
  | {
      type: "fill-blank";
      question: string;
      answer: string;
      accepted_answers?: string[];
      hint_vi?: string;
      hint_en?: string;
    }
  | {
      type: "translation";
      vi: string;
      en: string;
      sw: string;
      accepted_answers?: string[];
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
  exercises?: SwahiliExercise[];
  cultural_notes_vi: string;
  cultural_notes_en: string;
  tip_advice_vi: string;
  tip_advice_en: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export const lessons: SwahiliLesson[] = [
  {
    id: "swahili_b1_work_tasks_deadlines",
    level: "B1",
    category: "work_tasks",
    title_vi: "Công việc: nhiệm vụ, hạn chót và tiến độ",
    title_en: "Work: tasks, deadlines, and progress",
    intro_vi:
      "Bài này luyện cách nói về việc cần làm, hạn chót và tiến độ bằng tiếng Swahili chuẩn, gần với môi trường công sở Đông Phi.",
    intro_en:
      "This lesson practices talking about tasks, deadlines, and progress in standard workplace Swahili.",
    sentences: [
      {
        sw: "Lazima nimalize kazi hii kabla ya Ijumaa.",
        vi: "Tôi phải hoàn thành công việc này trước thứ Sáu.",
        en: "I must finish this work before Friday.",
        note_vi:
          "lazima + subjunctive (nimalize, không phải ninamaliza) = 'phải làm gì'. Đây là cấu trúc bắt buộc trong Swahili.",
        note_en:
          "lazima + subjunctive (nimalize, not ninamaliza) = 'must do'. This is the obligation structure in Swahili.",
      },
      {
        sw: "Timu imekwisha fanya nusu ya kazi.",
        vi: "Nhóm đã hoàn thành một nửa công việc.",
        en: "The team has already done half of the work.",
        note_vi:
          "-me- (imekwisha) = thì hoàn thành. -kwisha- (đã... rồi) nhấn mạnh hành động đã kết thúc.",
        note_en:
          "-me- (imekwisha) = perfect tense. -kwisha- (already) emphasizes completion.",
      },
      {
        sw: "Nikipata muda, nitatuma ripoti leo.",
        vi: "Nếu có thời gian, tôi sẽ gửi báo cáo hôm nay.",
        en: "If I get time, I will send the report today.",
        note_vi:
          "niki- (conditional 'nếu') + -ta- (future). niki- dùng cho điều kiện có thật ở hiện tại/tương lai.",
        note_en:
          "niki- (conditional 'if') + -ta- (future). niki- is for real conditions in present/future.",
      },
    ],
    vocabulary: [
      { cell_id: "978879ae-0687-423a-bf8b-8d01340fa925", sw: "kazi", vi: "công việc", en: "work", pos: "n.", ngeli: "n/n" },
      { cell_id: "b2148e1e-222b-4d42-a7c3-23658aff4a77", sw: "tarehe ya mwisho", vi: "hạn chót", en: "deadline", pos: "n.", ngeli: "n/n" },
      { cell_id: "4830084a-070d-43f7-b5be-6de3453bfc53", sw: "ripoti", vi: "báo cáo", en: "report", pos: "n.", ngeli: "n/n" },
      { cell_id: "9098189c-1cab-4cd2-8dd2-9d158da0124e", sw: "kumaliza", vi: "hoàn thành", en: "to finish", pos: "v." },
      { cell_id: "fd35f81b-b904-43c0-987a-dfaceb01b33d", sw: "kutuma", vi: "gửi", en: "to send", pos: "v." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Lazima nimalize kazi hii _____ ya Ijumaa.",
        answer: "kabla",
        hint_vi: "giới từ nghĩa là 'trước khi'",
        hint_en: "preposition meaning 'before'",
      },
      {
        type: "translation",
        vi: "Nhóm đã hoàn thành một nửa công việc.",
        en: "The team has already done half of the work.",
        sw: "Timu imekwisha fanya nusu ya kazi.",
      },
    ],
    cultural_notes_vi:
      "Tại văn phòng Đông Phi, Swahili thường được dùng xen kẽ với tiếng Anh. Từ như 'timu' và 'ripoti' là từ mượn phổ biến. Người Tanzania thường dùng Swahili thuần hơn (kikosi thay vì timu) còn Kenya dùng nhiều từ mượn Anh hơn.",
    cultural_notes_en:
      "In East African offices, Swahili is often mixed with English. Words like 'timu' and 'ripoti' are common borrowings. Tanzanians tend toward purer Swahili (kikosi instead of timu) while Kenyans use more English loans.",
    tip_advice_vi:
      "Học cấu trúc lazima + subjunctive như một khối. Người Việt dễ quên chia động từ sau lazima về dạng subjunctive (bỏ -na- và đổi đuôi -a thành -e nếu cần).",
    tip_advice_en:
      "Learn lazima + subjunctive as a chunk. Don't forget that the verb after lazima takes the subjunctive form (drop the tense marker, change final -a to -e where applicable).",
  },
  {
    id: "swahili_b1_health_pharmacy_followup",
    level: "B1",
    category: "health_pharmacy",
    title_vi: "Sức khỏe: tái khám và nhà thuốc",
    title_en: "Health: follow-up visit and pharmacy",
    intro_vi:
      "Bài này chỉ luyện ngôn ngữ mô tả triệu chứng, thay đổi và hướng dẫn thuốc; không đưa lời khuyên y tế.",
    intro_en:
      "This lesson only practices language for symptoms, changes, and medicine instructions; it gives no medical advice.",
    sentences: [
      {
        sw: "Maumivu yamepungua kidogo tangu jana.",
        vi: "Cơn đau đã giảm một chút từ hôm qua.",
        en: "The pain has decreased a little since yesterday.",
        note_vi:
          "yamepungua: chủ ngữ maumivu (lớp ma-, số nhiều của ji-) → tiền tố ya- + -me- + -pungua.",
        note_en:
          "yamepungua: subject maumivu (ma- class, plural of ji-) → prefix ya- + -me- + -pungua.",
      },
      {
        sw: "Lazima ninywe dawa mara mbili kwa siku.",
        vi: "Tôi phải uống thuốc hai lần một ngày.",
        en: "I must take the medicine twice a day.",
        note_vi:
          "ninywe (subjunctive của -nywa 'uống'). mara mbili kwa siku = hai lần mỗi ngày.",
        note_en:
          "ninywe (subjunctive of -nywa 'drink/take'). mara mbili kwa siku = twice per day.",
      },
      {
        sw: "Je, dawa hii inaweza kusababisha usingizi?",
        vi: "Thuốc này có thể gây buồn ngủ không?",
        en: "Can this medicine cause sleepiness?",
        note_vi:
          "Je, ...? = mở đầu câu hỏi có/không. inaweza + kusababisha = 'có thể gây ra'.",
        note_en:
          "Je, ...? = yes/no question opener. inaweza + kusababisha = 'can cause'.",
      },
    ],
    vocabulary: [
      { cell_id: "451472f3-7a63-4731-b269-e8ed540a0c5d", sw: "maumivu", vi: "đau, cơn đau", en: "pain", pos: "n.", ngeli: "ma-" },
      { cell_id: "b2f86390-84a4-45df-be2e-95ae1a28ed49", sw: "dawa", vi: "thuốc", en: "medicine", pos: "n.", ngeli: "n/n" },
      { cell_id: "e2899b1c-cfbe-4476-8511-1c7aebe1b390", sw: "kupungua", vi: "giảm bớt", en: "to decrease", pos: "v." },
      { cell_id: "47b0ae59-cd94-4fa6-afa0-a35fe6f4f60d", sw: "mara mbili kwa siku", vi: "hai lần một ngày", en: "twice a day", pos: "phr." },
      { cell_id: "f479093d-c227-4e3b-a78e-e7838811bdd7", sw: "usingizi", vi: "buồn ngủ, giấc ngủ", en: "sleepiness, sleep", pos: "n.", ngeli: "u-" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Lazima _____ dawa mara mbili kwa siku.",
        answer: "ninywe",
        accepted_answers: ["ninywe"],
        hint_vi: "dạng subjunctive của -nywa (uống)",
        hint_en: "subjunctive form of -nywa (to drink/take)",
      },
    ],
    cultural_notes_vi:
      "Khi đi khám ở Tanzania hay Kenya, bác sĩ thường hỏi 'Unaumwa wapi?' (Bạn đau ở đâu?). Ở hiệu thuốc, dược sĩ sẽ nói 'Chukua dawa hii mara ... kwa siku' (Uống thuốc này ... lần mỗi ngày). Học các mẫu câu này giúp bạn tự tin khi cần dùng Swahili trong tình huống y tế.",
    cultural_notes_en:
      "At clinics in Tanzania or Kenya, doctors commonly ask 'Unaumwa wapi?' (Where does it hurt?). At the pharmacy, the pharmacist says 'Chukua dawa hii mara ... kwa siku' (Take this medicine ... times a day). These patterns are essential for medical situations.",
    tip_advice_vi:
      "Trong Swahili, chủ ngữ và động từ luôn hòa hợp theo lớp danh từ. maumivu (lớp ma-) → yamepungua (chủ ngữ ya-). Hãy học theo cặp danh từ + tiền tố chủ ngữ.",
    tip_advice_en:
      "In Swahili, subject and verb always agree by noun class. maumivu (ma- class) → yamepungua (subject prefix ya-). Learn noun + subject prefix pairs together.",
  },
  {
    id: "swahili_b1_public_services_documents",
    level: "B1",
    category: "public_services",
    title_vi: "Dịch vụ công: giấy tờ và biểu mẫu",
    title_en: "Public services: documents and forms",
    intro_vi:
      "Bài này luyện cách hỏi về giấy tờ, biểu mẫu, địa chỉ và thời hạn tại văn phòng dịch vụ công.",
    intro_en:
      "This lesson practices asking about documents, forms, addresses, and deadlines at a public service office.",
    sentences: [
      {
        sw: "Ninapeleka wapi fomu hii?",
        vi: "Tôi nộp mẫu đơn này ở đâu?",
        en: "Where do I submit this form?",
        note_vi:
          "ninapeleka wapi = 'tôi gửi/nộp ở đâu'. fomu là từ mượn từ tiếng Anh 'form'.",
        note_en:
          "ninapeleka wapi = 'where do I send/submit'. fomu is borrowed from English 'form'.",
      },
      {
        sw: "Tafadhali nipatie orodha ya nyaraka zinazohitajika.",
        vi: "Vui lòng cho tôi danh sách các giấy tờ cần thiết.",
        en: "Please give me the list of required documents.",
        note_vi:
          "nipatie (subjunctive, applicative -ia của -pata) = 'cho tôi'. zinazohitajika = 'được yêu cầu' (relative + passive).",
        note_en:
          "nipatie (subjunctive, applicative -ia of -pata) = 'give me'. zinazohitajika = 'that are required' (relative + passive).",
      },
      {
        sw: "Ofisi inafunguliwa Jumatatu hadi Ijumaa.",
        vi: "Văn phòng mở cửa từ thứ Hai đến thứ Sáu.",
        en: "The office is open Monday to Friday.",
        note_vi:
          "inafunguliwa = passive (-wa) của -fungua. hadi = 'cho đến'.",
        note_en:
          "inafunguliwa = passive (-wa) of -fungua. hadi = 'until'.",
      },
    ],
    vocabulary: [
      { cell_id: "872df1bb-28c6-4964-bd41-b3a4f20c3508", sw: "fomu", vi: "biểu mẫu, mẫu đơn", en: "form", pos: "n.", ngeli: "n/n" },
      { cell_id: "5bf0aaed-56d7-4ee8-8d1e-1a02ea0be0f4", sw: "nyaraka", vi: "giấy tờ, tài liệu", en: "documents", pos: "n.", ngeli: "n/n" },
      { cell_id: "d71bfbc8-5043-429d-88d0-62278d16713f", sw: "orodha", vi: "danh sách", en: "list", pos: "n.", ngeli: "n/n" },
      { cell_id: "abf9ef2c-3fe8-482f-b1c2-d78c848d62d3", sw: "kuhitajika", vi: "được yêu cầu, cần thiết", en: "to be required", pos: "v." },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Tôi nộp mẫu đơn này ở đâu?",
        en: "Where do I submit this form?",
        sw: "Ninapeleka wapi fomu hii?",
      },
    ],
    cultural_notes_vi:
      "Ở Tanzania, các văn phòng chính phủ dùng Swahili là ngôn ngữ chính. Biển hiệu và biểu mẫu đều bằng Swahili. Ở Kenya, cả Swahili và tiếng Anh đều được dùng. Học các từ như fomu, nyaraka, cheti (chứng chỉ), kibali (giấy phép) rất hữu ích khi làm thủ tục hành chính.",
    cultural_notes_en:
      "In Tanzania, government offices use Swahili as the primary language. Signs and forms are in Swahili. In Kenya, both Swahili and English are used. Learning words like fomu, nyaraka, cheti (certificate), kibali (permit) is very useful for administrative tasks.",
    tip_advice_vi:
      "Học cặp ninapeleka wapi (tôi nộp ở đâu) và zinazohitajika (được yêu cầu). Đây là hai khối rất hữu ích tại quầy dịch vụ công.",
    tip_advice_en:
      "Learn ninapeleka wapi (where do I submit) and zinazohitajika (that are required) as service-counter chunks.",
  },
  {
    id: "swahili_b1_opinions_reasons_preferences",
    level: "B1",
    category: "opinions_reasons",
    title_vi: "Ý kiến, lý do và sở thích",
    title_en: "Opinions, reasons, and preferences",
    intro_vi:
      "Bài này luyện cách nói quan điểm đơn giản, đưa lý do và so sánh lựa chọn trong cuộc trò chuyện trung cấp.",
    intro_en:
      "This lesson practices simple opinions, reasons, and comparing choices in intermediate conversation.",
    sentences: [
      {
        sw: "Nadhani mpango huu ni bora zaidi.",
        vi: "Tôi nghĩ kế hoạch này tốt hơn.",
        en: "I think this plan is better.",
        note_vi:
          "nadhani = 'tôi nghĩ' (từ -dhani). bora zaidi = 'tốt hơn' (bora = tốt, zaidi = hơn).",
        note_en:
          "nadhani = 'I think' (from -dhani). bora zaidi = 'better' (bora = good, zaidi = more).",
      },
      {
        sw: "Kwa sababu njia hii itachukua muda mfupi.",
        vi: "Bởi vì cách này sẽ mất ít thời gian hơn.",
        en: "Because this way will take less time.",
        note_vi:
          "kwa sababu = 'bởi vì'. -ta- (itachukua) = thì tương lai. muda mfupi = 'thời gian ngắn'.",
        note_en:
          "kwa sababu = 'because'. -ta- (itachukua) = future tense. muda mfupi = 'short time'.",
      },
      {
        sw: "Napenda kuishi mjini, lakini kodi ya nyumba ni ghali.",
        vi: "Tôi thích sống trong thành phố, nhưng tiền thuê nhà đắt.",
        en: "I like living in the city, but rent is expensive.",
        note_vi:
          "napenda = 'tôi thích'. lakini = 'nhưng'. kodi ya nyumba = 'tiền thuê nhà' (kodi + ya + nyumba, sở hữu cách).",
        note_en:
          "napenda = 'I like'. lakini = 'but'. kodi ya nyumba = 'house rent' (kodi + ya + nyumba, possessive).",
      },
    ],
    vocabulary: [
      { cell_id: "fbc667ef-7152-4577-a11d-740105661c14", sw: "nadhani", vi: "tôi nghĩ", en: "I think", pos: "v." },
      { cell_id: "e05bdf74-2c8e-4132-b79a-9db262bf889a", sw: "bora", vi: "tốt hơn, tốt nhất", en: "better, best", pos: "adj." },
      { cell_id: "0bef4e05-cc02-4b56-96fd-b88cbef727d8", sw: "kwa sababu", vi: "bởi vì", en: "because", pos: "conj." },
      { cell_id: "65c077b9-987e-423c-96b0-71d23c3f6239", sw: "kupenda", vi: "thích, yêu", en: "to like, to love", pos: "v." },
      { cell_id: "b54a0369-a2e0-4fd2-bc37-3dca84992f1d", sw: "ghali", vi: "đắt", en: "expensive", pos: "adj." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Nadhani mpango huu ni _____ zaidi.",
        answer: "bora",
        hint_vi: "tính từ nghĩa là 'tốt'",
        hint_en: "adjective meaning 'good'",
      },
    ],
    cultural_notes_vi:
      "Trong văn hóa Đông Phi, nói thẳng ý kiến có thể bị coi là thô lỗ. Người Swahili thường dùng nadhani (tôi nghĩ) hoặc labda (có lẽ) để làm mềm câu nói. Học cách diễn đạt ý kiến nhẹ nhàng là kỹ năng quan trọng ở B1.",
    cultural_notes_en:
      "In East African culture, direct opinions can be seen as rude. Swahili speakers often use nadhani (I think) or labda (maybe) to soften statements. Learning to express opinions gently is an important B1 skill.",
    tip_advice_vi:
      "Người Việt dễ đặt lý do ở đầu câu theo thói quen. Swahili B1 nên luyện khối ý kiến + kwa sababu + lý do. Dùng nadhani và labda để làm mềm câu nói.",
    tip_advice_en:
      "Practice the chunk opinion + kwa sababu + reason instead of translating word for word. Use nadhani and labda to soften statements.",
  },
  {
    id: "swahili_b1_past_narration_events",
    level: "B1",
    category: "past_narration",
    title_vi: "Kể chuyện quá khứ và giải thích sự cố",
    title_en: "Past narration and explaining what happened",
    intro_vi:
      "Bài này luyện kể chuỗi sự kiện ngắn trong quá khứ, dùng kisha, baada ya và hatimaye.",
    intro_en:
      "This lesson practices narrating short past event sequences with kisha, baada ya, and hatimaye.",
    sentences: [
      {
        sw: "Jana nilichelewa kufika kwa basi.",
        vi: "Hôm qua tôi đến trễ bằng xe buýt.",
        en: "Yesterday I arrived late by bus.",
        note_vi:
          "-li- (nilichelewa) = thì quá khứ. kwa basi = 'bằng xe buýt'.",
        note_en:
          "-li- (nilichelewa) = past tense. kwa basi = 'by bus'.",
      },
      {
        sw: "Kisha nikatuma ujumbe ofisini.",
        vi: "Sau đó tôi đã gửi tin nhắn cho văn phòng.",
        en: "Then I sent a message to the office.",
        note_vi:
          "kisha + -ka- (nikatuma) = 'và sau đó' (thì tự sự nối tiếp). -ka- thay cho -li- khi kể chuỗi sự kiện.",
        note_en:
          "kisha + -ka- (nikatuma) = 'and then' (narrative consecutive tense). -ka- replaces -li- when narrating a sequence.",
      },
      {
        sw: "Hatimaye mkutano ulifanyika mtandaoni.",
        vi: "Cuối cùng cuộc họp diễn ra trực tuyến.",
        en: "In the end, the meeting took place online.",
        note_vi:
          "hatimaye = 'cuối cùng'. ulifanyika = 'đã diễn ra' (passive của -fanya). mtandaoni = 'trên mạng/trực tuyến'.",
        note_en:
          "hatimaye = 'finally/in the end'. ulifanyika = 'took place' (passive of -fanya). mtandaoni = 'online'.",
      },
    ],
    vocabulary: [
      { cell_id: "ecbfab6f-7424-4059-b1ee-b27d11aef0f0", sw: "kuchelewa", vi: "đến trễ, bị trễ", en: "to be late", pos: "v." },
      { cell_id: "0f6d5815-7869-496e-8cf9-ab54e051bb40", sw: "kisha", vi: "sau đó, rồi thì", en: "then, afterwards", pos: "conj." },
      { cell_id: "f74a84c6-1b62-4a84-bb7e-cba74b818d60", sw: "ujumbe", vi: "tin nhắn", en: "message", pos: "n.", ngeli: "u-" },
      { cell_id: "83d07683-377a-4978-b083-173deb224747", sw: "hatimaye", vi: "cuối cùng", en: "finally, in the end", pos: "adv." },
      { cell_id: "96cc2de8-f22e-486e-8ae4-b9793bf38f78", sw: "mtandaoni", vi: "trực tuyến, trên mạng", en: "online", pos: "adv." },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Sau đó tôi đã gửi tin nhắn cho văn phòng.",
        en: "Then I sent a message to the office.",
        sw: "Kisha nikatuma ujumbe ofisini.",
      },
    ],
    cultural_notes_vi:
      "Khi kể chuyện bằng Swahili, thì -ka- (nối tiếp) rất quan trọng. Sau động từ đầu tiên ở -li- (quá khứ), các động từ tiếp theo thường dùng -ka- để kể chuỗi sự kiện. Đây là đặc điểm riêng của Swahili mà người học B1 cần làm quen.",
    cultural_notes_en:
      "When narrating in Swahili, the -ka- (consecutive) tense is key. After the first verb in -li- (past), subsequent verbs typically use -ka- to continue the story. This is a distinctive Swahili feature that B1 learners should get comfortable with.",
    tip_advice_vi:
      "Dùng ba mốc thời gian: kisha (sau đó), baada ya hapo (sau đó nữa), hatimaye (cuối cùng) để câu chuyện không rời rạc. Luyện chuyển từ -li- sang -ka- sau từ nối đầu tiên.",
    tip_advice_en:
      "Use three time markers: kisha (then), baada ya hapo (after that), hatimaye (finally) to keep a story connected. Practice switching from -li- to -ka- after the first connector.",
  },
];

export default lessons;
