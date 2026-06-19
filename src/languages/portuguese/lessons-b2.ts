// src/languages/portuguese/lessons-b2.ts
//
// Brazilian Portuguese B2 lessons for Vietnamese learners.
// Topics: arguments/debating, meetings, formal complaints, the subjunctive,
// and professional writing.
//
// Shape mirrors the French pack (src/languages/french/lessons.ts) so the page
// UI stays consistent across verticals. Because the Portuguese pack does not yet
// ship a shared `lessons.ts`, the type surface is declared inline here and kept
// structurally compatible — when a registry is added, swap this for
// `import type { PortugueseLesson } from "./lessons";`.
//
// Brazilian (não europeu) Portuguese throughout: você / a gente, future
// subjunctive (se eu puder…), and the tu/você register notes a VN learner needs.
//
// Hand-crafted; no AI-generated filler. Vietnamese L1 notes + English companions.

// ── Inline type surface (mirrors FrenchLesson) ──────────────────────────────

export type PortugueseLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type PortugueseVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  // English-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type PortugueseDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields can vary. Known optional fields:
//   fill-blank:  question, answer, hint_vi?, hint_en?
//   matching:    pairs, instruction, instruction_en?
//   translation: vietnamese, portuguese, english?, hint_vi?, hint_en?
export type PortugueseExercise = Record<string, any>;

export type PortugueseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PortugueseLesson = {
  id: string;
  category: string;
  level: PortugueseCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: PortugueseLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: PortugueseVocabEntry[];
  dialogue?: PortugueseDialogueLine[];
  exercises?: PortugueseExercise[];
  content?: string;
  // B2 calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: PortugueseDialogueLine[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
  idiom_glosses?: {
    idiom: string;
    literal: string;
    literal_en?: string;
    meaning: string;
    meaning_en?: string;
    example: string;
    example_en?: string;
  }[];
};

// ── Lessons ─────────────────────────────────────────────────────────────────

export const lessons: PortugueseLesson[] = [
  // ── 1. Arguments / debating ───────────────────────────────────────────────
  {
    id: "portuguese_arguments_disagreeing_politely",
    level: "B2",
    category: "arguments",
    title_vi: "Tranh luận và bất đồng lịch sự",
    title_en: "Arguing and disagreeing politely",
    sentences: [
      {
        en: "Com todo o respeito, eu vejo as coisas de outra forma.",
        vi: "Với tất cả sự tôn trọng, tôi nhìn nhận vấn đề theo cách khác.",
        pronunciation_focus: ["respeito→rê-xpêi-tu", "forma→FOR-ma"],
        pronunciation_focus_en: ["respeito→heh-SPAY-too", "forma→FOR-ma"],
      },
      {
        en: "Entendo o seu ponto, mas não concordo totalmente.",
        vi: "Tôi hiểu quan điểm của bạn, nhưng tôi không hoàn toàn đồng ý.",
        pronunciation_focus: ["entendo→en-TÊN-du", "concordo→côn-COR-du"],
        pronunciation_focus_en: ["entendo→en-TEN-doo", "concordo→kong-KOR-doo"],
      },
      {
        en: "Pelo contrário, acho que os dados mostram o oposto.",
        vi: "Ngược lại, tôi cho rằng dữ liệu cho thấy điều trái ngược.",
        pronunciation_focus: ["contrário→côn-TRA-riu", "oposto→ô-POS-tu"],
        pronunciation_focus_en: ["contrário→kong-TRAH-ree-oo", "oposto→oh-POS-too"],
      },
      {
        en: "Vamos combinar: você apresenta os números e eu, a proposta.",
        vi: "Hãy thống nhất thế này: bạn trình bày con số, còn tôi trình bày đề xuất.",
        pronunciation_focus: ["combinar→côm-bi-NAR", "proposta→prô-POS-ta"],
        pronunciation_focus_en: ["combinar→kohm-bee-NAR", "proposta→pro-POS-ta"],
      },
      {
        en: "Na verdade, o seu argumento reforça o meu.",
        vi: "Thật ra, lập luận của bạn lại củng cố cho ý của tôi.",
        pronunciation_focus: ["verdade→vér-DA-dji", "argumento→ar-gu-MEN-tu"],
        pronunciation_focus_en: ["verdade→ver-DAH-jee", "argumento→ar-goo-MEN-too"],
      },
    ],
    cultural_notes_vi:
      "Người Brazil tranh luận sôi nổi nhưng giữ vẻ thân thiện: mở đầu bằng 'Com todo o respeito' hoặc 'Entendo o seu ponto' để hạ nhiệt trước khi phản bác. Tránh nói 'Você está errado' (Bạn sai) thẳng thừng — nghe rất nặng. Dùng 'Não concordo' hoặc 'Vejo de outra forma'.",
    cultural_notes_en:
      "Brazilians debate warmly but keep it friendly: open with 'Com todo o respeito' or 'Entendo o seu ponto' to soften before pushing back. Avoid a blunt 'Você está errado' (You're wrong) — it lands harshly. Prefer 'Não concordo' or 'Vejo de outra forma'.",
    tip_advice_vi:
      "Để phản bác lịch sự, dùng công thức: [thừa nhận] + 'mas' + [quan điểm của bạn]. VD: 'Entendo, mas…'. 'Pelo contrário' = ngược lại; 'Na verdade' = thật ra (dùng để chỉnh nhẹ, không phải để cãi).",
    tip_advice_en:
      "For a polite rebuttal use: [acknowledge] + 'mas' (but) + [your view]. E.g. 'Entendo, mas…'. 'Pelo contrário' = on the contrary; 'Na verdade' = actually (a gentle correction, not a fight-starter).",
    vocabulary: [
      { word: "concordar", en: "to agree", vi: "đồng ý", pos: "v.", pronunciation_vi: "côn-cor-DAR", pronunciation_en: "kong-kor-DAR" },
      { word: "discordar", en: "to disagree", vi: "không đồng ý", pos: "v.", pronunciation_vi: "djis-cor-DAR", pronunciation_en: "jees-kor-DAR" },
      { word: "o argumento", en: "the argument (point)", vi: "lập luận", pos: "n.m.", pronunciation_vi: "ar-gu-MEN-tu", pronunciation_en: "ar-goo-MEN-too" },
      { word: "o ponto de vista", en: "point of view", vi: "quan điểm", pos: "n.m.", pronunciation_vi: "PON-tu dji VIS-ta", pronunciation_en: "PON-too jee VEES-ta" },
      { word: "pelo contrário", en: "on the contrary", vi: "ngược lại", pos: "expr.", pronunciation_vi: "PÊ-lu côn-TRA-riu", pronunciation_en: "PAY-loo kong-TRAH-ree-oo" },
      { word: "na verdade", en: "actually", vi: "thật ra", pos: "expr.", pronunciation_vi: "na vér-DA-dji", pronunciation_en: "na ver-DAH-jee" },
      { word: "rebater", en: "to rebut", vi: "phản bác", pos: "v.", pronunciation_vi: "rê-ba-TER", pronunciation_en: "heh-ba-TER" },
      { word: "convencer", en: "to convince", vi: "thuyết phục", pos: "v.", pronunciation_vi: "côn-ven-SER", pronunciation_en: "kong-ven-SER" },
      { word: "o respeito", en: "respect", vi: "sự tôn trọng", pos: "n.m.", pronunciation_vi: "rê-XPÊI-tu", pronunciation_en: "heh-SPAY-too" },
      { word: "fazer sentido", en: "to make sense", vi: "hợp lý", pos: "expr.", pronunciation_vi: "fa-ZER sen-TJI-du", pronunciation_en: "fa-ZER sen-JEE-doo" },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Eu acho que devíamos cortar o orçamento de marketing.",
        vi: "Tôi nghĩ ta nên cắt ngân sách marketing.",
        en: "I think we should cut the marketing budget.",
      },
      {
        speaker: "B",
        text: "Entendo o seu ponto, mas, pelo contrário, os números mostram que ele traz retorno.",
        vi: "Tôi hiểu ý bạn, nhưng ngược lại, các con số cho thấy nó mang lại lợi nhuận.",
        en: "I see your point, but on the contrary, the numbers show it brings a return.",
      },
      {
        speaker: "A",
        text: "Pode ser, mas a verba está apertada este trimestre.",
        vi: "Có thể, nhưng quý này ngân sách eo hẹp.",
        en: "Maybe, but funds are tight this quarter.",
      },
      {
        speaker: "B",
        text: "Vamos combinar: cortamos 10% e reavaliamos em junho. Faz sentido?",
        vi: "Hãy thống nhất: cắt 10% rồi đánh giá lại vào tháng sáu. Hợp lý chứ?",
        en: "Let's agree: we cut 10% and reassess in June. Does that make sense?",
      },
    ],
    roleplay_prompts: [
      "Bạn của bạn muốn mở quán cà phê; bạn không tin ý tưởng đó. Hãy bất đồng một cách lịch sự, dùng 'Entendo, mas…' và 'Pelo contrário'.",
      "Trong lớp, bạn phản bác ý kiến của giáo viên một cách tôn trọng bằng 'Com todo o respeito…'.",
    ],
    roleplay_prompts_en: [
      "A friend wants to open a café; you doubt the idea. Disagree politely using 'Entendo, mas…' and 'Pelo contrário'.",
      "In class, you respectfully push back on the teacher's opinion with 'Com todo o respeito…'.",
    ],
    register_notes_vi:
      "'Com todo o respeito' là trang trọng; với bạn bè dùng 'Olha, eu não sei não…' (Ờ, tôi không chắc đâu). 'Cara, discordo' rất thân mật (cara = ông/bạn).",
    register_notes_en:
      "'Com todo o respeito' is formal; among friends use 'Olha, eu não sei não…' (Hmm, I'm not so sure). 'Cara, discordo' is very casual (cara = dude/man).",
    exercises: [
      {
        type: "fill-blank",
        question: "Entendo o seu ponto, ___ não concordo totalmente.",
        answer: "mas",
        hint_vi: "liên từ 'nhưng'",
        hint_en: "the conjunction 'but'",
      },
      {
        type: "matching",
        pairs: [
          ["pelo contrário", "ngược lại"],
          ["na verdade", "thật ra"],
          ["fazer sentido", "hợp lý"],
        ],
        instruction: "Nối cụm từ với nghĩa tiếng Việt",
        instruction_en: "Match each phrase with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Tôi hiểu ý bạn, nhưng dữ liệu cho thấy điều ngược lại.",
        portuguese: "Entendo o seu ponto, mas os dados mostram o contrário.",
        english: "I see your point, but the data shows the opposite.",
        hint_vi: "dùng 'mas' để nối; 'o contrário' = điều ngược lại",
        hint_en: "use 'mas' to connect; 'o contrário' = the opposite",
      },
    ],
  },

  // ── 2. Meetings ───────────────────────────────────────────────────────────
  {
    id: "portuguese_meetings_running_a_meeting",
    level: "B2",
    category: "meetings",
    title_vi: "Điều hành cuộc họp",
    title_en: "Running a meeting",
    sentences: [
      {
        en: "Vamos começar? Acho que já estão todos presentes.",
        vi: "Chúng ta bắt đầu nhé? Tôi nghĩ mọi người đã có mặt đủ.",
        pronunciation_focus: ["começar→cô-me-SAR", "presentes→prê-ZEN-tjis"],
        pronunciation_focus_en: ["começar→koh-meh-SAR", "presentes→preh-ZEN-chees"],
      },
      {
        en: "O primeiro item da pauta é o cronograma do projeto.",
        vi: "Mục đầu tiên trong chương trình họp là tiến độ dự án.",
        pronunciation_focus: ["pauta→PAU-ta", "cronograma→crô-nô-GRA-ma"],
        pronunciation_focus_en: ["pauta→POW-ta", "cronograma→kroh-noh-GRA-ma"],
      },
      {
        en: "Desculpe interromper, mas será que podemos voltar ao ponto anterior?",
        vi: "Xin lỗi đã ngắt lời, nhưng liệu ta có thể quay lại mục trước không?",
        pronunciation_focus: ["interromper→in-te-rrôm-PER", "anterior→an-te-ri-OR"],
        pronunciation_focus_en: ["interromper→een-teh-hohm-PER", "anterior→an-teh-ree-OR"],
      },
      {
        en: "Ficou decidido que a Ana cuida do relatório até sexta.",
        vi: "Đã quyết định Ana phụ trách báo cáo trước thứ Sáu.",
        pronunciation_focus: ["decidido→de-si-DJI-du", "relatório→re-la-TÓ-riu"],
        pronunciation_focus_en: ["decidido→deh-see-JEE-doo", "relatório→heh-la-TOH-ree-oo"],
      },
      {
        en: "Para encerrar, vou enviar a ata por e-mail ainda hoje.",
        vi: "Để kết thúc, tôi sẽ gửi biên bản qua email ngay hôm nay.",
        pronunciation_focus: ["encerrar→en-se-RRAR", "ata→A-ta"],
        pronunciation_focus_en: ["encerrar→en-seh-HAR", "ata→AH-ta"],
      },
    ],
    cultural_notes_vi:
      "Họp ở Brazil thường bắt đầu trễ vài phút và có vài câu xã giao trước khi vào việc — đừng nóng vội. 'A pauta' = chương trình họp, 'a ata' = biên bản. Người chủ trì hay dùng câu hỏi mềm 'Será que podemos…?' thay vì ra lệnh.",
    cultural_notes_en:
      "Brazilian meetings often start a few minutes late and open with small talk before business — don't rush it. 'A pauta' = the agenda, 'a ata' = the minutes. The chair often softens requests with 'Será que podemos…?' instead of commanding.",
    tip_advice_vi:
      "Ngắt lời lịch sự: 'Desculpe interromper, mas…'. Giao việc: 'Ficou decidido que [người] + [động từ]'. Kết thúc: 'Para encerrar…'. 'Será que…?' làm câu hỏi/yêu cầu nghe nhẹ hơn nhiều.",
    tip_advice_en:
      "Interrupt politely: 'Desculpe interromper, mas…'. Assign actions: 'Ficou decidido que [person] + [verb]'. Wrap up: 'Para encerrar…'. 'Será que…?' softens any question or request considerably.",
    vocabulary: [
      { word: "a pauta", en: "the agenda", vi: "chương trình họp", pos: "n.f.", pronunciation_vi: "PAU-ta", pronunciation_en: "POW-ta" },
      { word: "a ata", en: "the minutes", vi: "biên bản", pos: "n.f.", pronunciation_vi: "A-ta", pronunciation_en: "AH-ta" },
      { word: "a reunião", en: "the meeting", vi: "cuộc họp", pos: "n.f.", pronunciation_vi: "rê-u-ni-ÃU", pronunciation_en: "heh-oo-nee-OWN" },
      { word: "o prazo", en: "the deadline", vi: "thời hạn", pos: "n.m.", pronunciation_vi: "PRA-zu", pronunciation_en: "PRAH-zoo" },
      { word: "o cronograma", en: "the schedule", vi: "tiến độ/lịch trình", pos: "n.m.", pronunciation_vi: "crô-nô-GRA-ma", pronunciation_en: "kroh-noh-GRA-ma" },
      { word: "encerrar", en: "to close/end", vi: "kết thúc", pos: "v.", pronunciation_vi: "en-se-RRAR", pronunciation_en: "en-seh-HAR" },
      { word: "interromper", en: "to interrupt", vi: "ngắt lời", pos: "v.", pronunciation_vi: "in-te-rrôm-PER", pronunciation_en: "een-teh-hohm-PER" },
      { word: "esclarecer", en: "to clarify", vi: "làm rõ", pos: "v.", pronunciation_vi: "es-cla-re-SER", pronunciation_en: "es-kla-reh-SER" },
      { word: "o item da pauta", en: "agenda item", vi: "mục họp", pos: "n.m.", pronunciation_vi: "I-tem da PAU-ta", pronunciation_en: "EE-teng da POW-ta" },
      { word: "ficar decidido", en: "to be decided", vi: "được quyết định", pos: "expr.", pronunciation_vi: "fi-CAR de-si-DJI-du", pronunciation_en: "fee-KAR deh-see-JEE-doo" },
    ],
    dialogue: [
      {
        speaker: "Líder",
        text: "Bom dia a todos. Vamos começar pela pauta de hoje: o cronograma e o orçamento.",
        vi: "Chào buổi sáng mọi người. Ta bắt đầu với chương trình hôm nay: tiến độ và ngân sách.",
        en: "Good morning, everyone. Let's start with today's agenda: the schedule and the budget.",
      },
      {
        speaker: "Carla",
        text: "Desculpe interromper, mas será que podemos confirmar o prazo antes?",
        vi: "Xin lỗi đã ngắt lời, nhưng liệu ta xác nhận thời hạn trước được không?",
        en: "Sorry to interrupt, but could we confirm the deadline first?",
      },
      {
        speaker: "Líder",
        text: "Claro. Ficou decidido que entregamos até dia 20. Todos de acordo?",
        vi: "Tất nhiên. Đã quyết định ta giao trước ngày 20. Mọi người đồng ý chứ?",
        en: "Of course. It's been decided we deliver by the 20th. Everyone agreed?",
      },
      {
        speaker: "Carla",
        text: "De acordo. Para encerrar, você envia a ata depois?",
        vi: "Đồng ý. Để kết thúc, anh sẽ gửi biên bản sau chứ?",
        en: "Agreed. To wrap up, will you send the minutes afterwards?",
      },
    ],
    roleplay_prompts: [
      "Bạn chủ trì một cuộc họp nhóm 3 người. Mở đầu, đi qua hai mục họp, giao một việc, rồi kết thúc.",
      "Trong cuộc họp, bạn cần ngắt lời để làm rõ một con số. Dùng 'Desculpe interromper, mas…' và 'esclarecer'.",
    ],
    roleplay_prompts_en: [
      "You chair a 3-person team meeting. Open it, go through two agenda items, assign one action, then close.",
      "In a meeting you need to interrupt to clarify a figure. Use 'Desculpe interromper, mas…' and 'esclarecer'.",
    ],
    register_notes_vi:
      "Trong họp trang trọng dùng 'os senhores / as senhoras' với cấp trên/khách; nội bộ thân thiện thì 'pessoal' (mọi người) hoặc 'gente'. 'Vamos lá?' = bắt đầu nhé (thân mật).",
    register_notes_en:
      "In formal meetings use 'os senhores / as senhoras' with superiors/clients; internally 'pessoal' (folks) or 'gente' is friendly. 'Vamos lá?' = shall we get going? (casual).",
    exercises: [
      {
        type: "fill-blank",
        question: "O primeiro item da ___ é o cronograma.",
        answer: "pauta",
        hint_vi: "chương trình họp",
        hint_en: "the agenda",
      },
      {
        type: "matching",
        pairs: [
          ["a ata", "biên bản"],
          ["o prazo", "thời hạn"],
          ["encerrar", "kết thúc"],
        ],
        instruction: "Nối từ với nghĩa tiếng Việt",
        instruction_en: "Match each word with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Xin lỗi đã ngắt lời, nhưng ta có thể xác nhận thời hạn không?",
        portuguese: "Desculpe interromper, mas podemos confirmar o prazo?",
        english: "Sorry to interrupt, but can we confirm the deadline?",
        hint_vi: "'Desculpe interromper' mở đầu lịch sự",
        hint_en: "'Desculpe interromper' is the polite opener",
      },
    ],
  },

  // ── 3. Formal complaints ──────────────────────────────────────────────────
  {
    id: "portuguese_complaints_formal_complaint",
    level: "B2",
    category: "complaints",
    title_vi: "Khiếu nại trang trọng",
    title_en: "Making a formal complaint",
    sentences: [
      {
        en: "Venho por meio desta registrar uma reclamação formal.",
        vi: "Bằng văn bản này, tôi xin đăng ký một khiếu nại chính thức.",
        pronunciation_focus: ["reclamação→re-cla-ma-SÃU", "formal→for-MAU"],
        pronunciation_focus_en: ["reclamação→heh-kla-ma-SOWN", "formal→for-MOW"],
      },
      {
        en: "O produto chegou com defeito e fora do prazo combinado.",
        vi: "Sản phẩm đến bị lỗi và trễ so với thời hạn đã thỏa thuận.",
        pronunciation_focus: ["defeito→de-FEI-tu", "prazo→PRA-zu"],
        pronunciation_focus_en: ["defeito→deh-FAY-too", "prazo→PRAH-zoo"],
      },
      {
        en: "Gostaria de solicitar a troca ou o reembolso integral.",
        vi: "Tôi muốn yêu cầu đổi hàng hoặc hoàn tiền toàn bộ.",
        pronunciation_focus: ["solicitar→sô-li-si-TAR", "reembolso→re-em-BOL-su"],
        pronunciation_focus_en: ["solicitar→soh-lee-see-TAR", "reembolso→heh-em-BOL-soo"],
      },
      {
        en: "Caso o problema não seja resolvido, acionarei o Procon.",
        vi: "Nếu vấn đề không được giải quyết, tôi sẽ liên hệ Procon.",
        pronunciation_focus: ["resolvido→re-zol-VI-du", "acionarei→a-si-ô-na-REI"],
        pronunciation_focus_en: ["resolvido→heh-zol-VEE-doo", "acionarei→a-see-oh-na-RAY"],
      },
      {
        en: "Aguardo um retorno no prazo de cinco dias úteis.",
        vi: "Tôi chờ phản hồi trong vòng năm ngày làm việc.",
        pronunciation_focus: ["aguardo→a-GUAR-du", "úteis→Ú-teis"],
        pronunciation_focus_en: ["aguardo→a-GWAR-doo", "úteis→OO-tays"],
      },
    ],
    cultural_notes_vi:
      "Ở Brazil, khiếu nại tiêu dùng có cơ quan bảo vệ riêng tên 'Procon' — nhắc tên này cho thấy bạn biết quyền của mình. 'Venho por meio desta…' là cụm mở đầu thư trang trọng cố định. 'dias úteis' = ngày làm việc (không tính cuối tuần/lễ).",
    cultural_notes_en:
      "In Brazil, consumer complaints have a dedicated agency called 'Procon' — naming it signals you know your rights. 'Venho por meio desta…' is the fixed formal letter opener. 'dias úteis' = business days (weekends/holidays excluded).",
    tip_advice_vi:
      "Cấu trúc thư khiếu nại: (1) mở đầu 'Venho por meio desta…' (2) nêu sự việc + bằng chứng (3) 'Gostaria de solicitar…' (yêu cầu) (4) hạn chót 'Aguardo retorno…'. Giữ giọng lịch sự, dùng condicional 'gostaria' thay vì 'quero'.",
    tip_advice_en:
      "Complaint-letter structure: (1) open with 'Venho por meio desta…' (2) state facts + evidence (3) 'Gostaria de solicitar…' (your request) (4) a deadline 'Aguardo retorno…'. Keep it polite — use the conditional 'gostaria' rather than 'quero'.",
    vocabulary: [
      { word: "a reclamação", en: "the complaint", vi: "lời khiếu nại", pos: "n.f.", pronunciation_vi: "re-cla-ma-SÃU", pronunciation_en: "heh-kla-ma-SOWN" },
      { word: "o defeito", en: "the defect", vi: "lỗi/khuyết tật", pos: "n.m.", pronunciation_vi: "de-FEI-tu", pronunciation_en: "deh-FAY-too" },
      { word: "o reembolso", en: "the refund", vi: "việc hoàn tiền", pos: "n.m.", pronunciation_vi: "re-em-BOL-su", pronunciation_en: "heh-em-BOL-soo" },
      { word: "a troca", en: "the exchange", vi: "đổi hàng", pos: "n.f.", pronunciation_vi: "TRÔ-ca", pronunciation_en: "TROH-ka" },
      { word: "solicitar", en: "to request (formal)", vi: "yêu cầu", pos: "v.", pronunciation_vi: "sô-li-si-TAR", pronunciation_en: "soh-lee-see-TAR" },
      { word: "exigir", en: "to demand", vi: "đòi hỏi", pos: "v.", pronunciation_vi: "e-zi-JIR", pronunciation_en: "eh-zee-ZHEER" },
      { word: "o prazo", en: "the deadline", vi: "thời hạn", pos: "n.m.", pronunciation_vi: "PRA-zu", pronunciation_en: "PRAH-zoo" },
      { word: "dias úteis", en: "business days", vi: "ngày làm việc", pos: "n.m.pl.", pronunciation_vi: "DJI-as Ú-teis", pronunciation_en: "JEE-as OO-tays" },
      { word: "o atendimento", en: "customer service", vi: "dịch vụ chăm sóc KH", pos: "n.m.", pronunciation_vi: "a-ten-dji-MEN-tu", pronunciation_en: "a-ten-jee-MEN-too" },
      { word: "providenciar", en: "to arrange/see to", vi: "thu xếp/giải quyết", pos: "v.", pronunciation_vi: "prô-vi-den-si-AR", pronunciation_en: "pro-vee-den-see-AR" },
    ],
    dialogue: [
      {
        speaker: "Cliente",
        text: "Boa tarde. Venho registrar uma reclamação: o produto chegou com defeito.",
        vi: "Chào buổi chiều. Tôi đến để khiếu nại: sản phẩm đến bị lỗi.",
        en: "Good afternoon. I'm here to file a complaint: the product arrived defective.",
      },
      {
        speaker: "Atendente",
        text: "Sinto muito pelo transtorno. O senhor tem a nota fiscal?",
        vi: "Tôi rất tiếc vì sự bất tiện. Quý khách có hóa đơn không?",
        en: "I'm sorry for the trouble. Do you have the receipt?",
      },
      {
        speaker: "Cliente",
        text: "Tenho. Gostaria de solicitar a troca ou o reembolso integral.",
        vi: "Có. Tôi muốn yêu cầu đổi hàng hoặc hoàn tiền toàn bộ.",
        en: "I do. I'd like to request an exchange or a full refund.",
      },
      {
        speaker: "Atendente",
        text: "Vou providenciar. Caso não resolvamos em cinco dias úteis, o senhor pode acionar o Procon.",
        vi: "Tôi sẽ thu xếp. Nếu không giải quyết trong năm ngày làm việc, quý khách có thể liên hệ Procon.",
        en: "I'll see to it. If we don't resolve it within five business days, you may contact Procon.",
      },
    ],
    roleplay_prompts: [
      "Viết một email khiếu nại ngắn về dịch vụ internet bị lỗi: mở đầu trang trọng, nêu sự việc, yêu cầu, đặt hạn 5 ngày.",
      "Đóng vai khách hàng đòi hoàn tiền cho một chuyến bay bị hủy; dùng 'gostaria de solicitar' và 'dias úteis'.",
    ],
    roleplay_prompts_en: [
      "Write a short complaint email about a faulty internet service: formal opener, the facts, your request, a 5-day deadline.",
      "Play a customer demanding a refund for a cancelled flight; use 'gostaria de solicitar' and 'dias úteis'.",
    ],
    register_notes_vi:
      "'Venho por meio desta', 'solicitar', 'aguardo retorno' là rất trang trọng (thư/email chính thức). Khi nói chuyện trực tiếp thân thiện hơn: 'Eu queria resolver um problema com…'. Gọi nhân viên là 'o senhor / a senhora' để giữ phép lịch sự.",
    register_notes_en:
      "'Venho por meio desta', 'solicitar', 'aguardo retorno' are highly formal (letters/emails). Spoken and softer: 'Eu queria resolver um problema com…'. Address staff as 'o senhor / a senhora' to stay polite.",
    exercises: [
      {
        type: "fill-blank",
        question: "Gostaria de ___ a troca ou o reembolso integral.",
        answer: "solicitar",
        hint_vi: "động từ trang trọng nghĩa 'yêu cầu'",
        hint_en: "the formal verb for 'to request'",
      },
      {
        type: "matching",
        pairs: [
          ["o reembolso", "hoàn tiền"],
          ["o defeito", "lỗi"],
          ["dias úteis", "ngày làm việc"],
        ],
        instruction: "Nối từ với nghĩa tiếng Việt",
        instruction_en: "Match each word with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Nếu vấn đề không được giải quyết, tôi sẽ liên hệ Procon.",
        portuguese: "Caso o problema não seja resolvido, acionarei o Procon.",
        english: "If the problem isn't resolved, I'll contact Procon.",
        hint_vi: "'caso' + subjuntivo ('seja resolvido')",
        hint_en: "'caso' takes the subjunctive ('seja resolvido')",
      },
    ],
  },

  // ── 4. The subjunctive ────────────────────────────────────────────────────
  {
    id: "portuguese_subjunctive_present_and_future",
    level: "B2",
    category: "subjunctive",
    title_vi: "Thức giả định (presente và futuro)",
    title_en: "The subjunctive (present and future)",
    sentences: [
      {
        en: "Espero que você consiga terminar o relatório a tempo.",
        vi: "Tôi hy vọng bạn kịp hoàn thành báo cáo đúng giờ.",
        pronunciation_focus: ["espero→es-PÊ-ru", "consiga→côn-SI-ga"],
        pronunciation_focus_en: ["espero→es-PEH-roo", "consiga→kong-SEE-ga"],
      },
      {
        en: "É importante que todos cheguem cedo amanhã.",
        vi: "Quan trọng là mọi người đến sớm vào ngày mai.",
        pronunciation_focus: ["importante→im-por-TAN-tji", "cheguem→XÊ-guem"],
        pronunciation_focus_en: ["importante→eem-por-TAN-chee", "cheguem→SHEH-geng"],
      },
      {
        en: "Quando eu tiver tempo, eu te ligo.",
        vi: "Khi nào tôi có thời gian, tôi sẽ gọi cho bạn.",
        pronunciation_focus: ["tiver→tji-VER", "ligo→LI-gu"],
        pronunciation_focus_en: ["tiver→chee-VER", "ligo→LEE-goo"],
      },
      {
        en: "Se você puder, me avise antes da reunião.",
        vi: "Nếu có thể, hãy báo tôi trước cuộc họp.",
        pronunciation_focus: ["puder→pu-DER", "avise→a-VI-zi"],
        pronunciation_focus_en: ["puder→poo-DER", "avise→a-VEE-zee"],
      },
      {
        en: "Talvez ele não venha, mas vamos esperar mais um pouco.",
        vi: "Có lẽ anh ấy không đến, nhưng ta cứ chờ thêm chút.",
        pronunciation_focus: ["talvez→tau-VES", "venha→VÊ-nha"],
        pronunciation_focus_en: ["talvez→tow-VES", "venha→VEH-nya"],
      },
    ],
    cultural_notes_vi:
      "Tiếng Bồ Đào Nha Brazil dùng FUTURO DO SUBJUNTIVO rất nhiều — điều mà tiếng Pháp/Tây Ban Nha hầu như không còn. 'Quando/Se/Assim que + futuro do subjuntivo' để nói về điều chưa chắc xảy ra: 'quando eu tiver', 'se você puder', 'assim que chegar'. Đây là điểm khó nhất với người mới.",
    cultural_notes_en:
      "Brazilian Portuguese uses the FUTURE SUBJUNCTIVE heavily — something French/Spanish have nearly lost. 'Quando/Se/Assim que + future subjunctive' for things not yet certain: 'quando eu tiver', 'se você puder', 'assim que chegar'. This is the hardest piece for beginners.",
    tip_advice_vi:
      "Hai thức cần phân biệt: PRESENTE do subjuntivo sau cảm xúc/mong muốn/đánh giá ('Espero que…', 'É importante que…', 'Talvez…'). FUTURO do subjuntivo sau 'quando/se/enquanto/assim que' khi nói về tương lai. Mẹo: futuro do subjuntivo thường giống dạng nguyên thể đối với động từ đều (falar→falar, comer→comer) nhưng khác ở động từ bất quy tắc (ter→tiver, poder→puder, fazer→fizer).",
    tip_advice_en:
      "Two moods to keep apart: the PRESENT subjunctive after emotion/wish/judgment ('Espero que…', 'É importante que…', 'Talvez…'). The FUTURE subjunctive after 'quando/se/enquanto/assim que' for the future. Tip: the future subjunctive looks like the infinitive for regular verbs (falar→falar, comer→comer) but differs for irregulars (ter→tiver, poder→puder, fazer→fizer).",
    vocabulary: [
      { word: "espero que", en: "I hope that", vi: "tôi hy vọng rằng", pos: "expr.", pronunciation_vi: "es-PÊ-ru ki", pronunciation_en: "es-PEH-roo kee" },
      { word: "é importante que", en: "it's important that", vi: "quan trọng là", pos: "expr.", pronunciation_vi: "é im-por-TAN-tji ki", pronunciation_en: "eh eem-por-TAN-chee kee" },
      { word: "talvez", en: "maybe (+ subj.)", vi: "có lẽ", pos: "adv.", pronunciation_vi: "tau-VES", pronunciation_en: "tow-VES" },
      { word: "quando (+ fut. subj.)", en: "when (future)", vi: "khi nào (tương lai)", pos: "conj.", pronunciation_vi: "QUAN-du", pronunciation_en: "KWAN-doo" },
      { word: "assim que", en: "as soon as", vi: "ngay khi", pos: "conj.", pronunciation_vi: "a-SIM ki", pronunciation_en: "a-SEENG kee" },
      { word: "caso", en: "in case (+ subj.)", vi: "phòng khi", pos: "conj.", pronunciation_vi: "CA-zu", pronunciation_en: "KAH-zoo" },
      { word: "tiver", en: "(I/he) have — fut. subj. of ter", vi: "có (giả định tương lai)", pos: "v.", pronunciation_vi: "tji-VER", pronunciation_en: "chee-VER" },
      { word: "puder", en: "(I/he) can — fut. subj. of poder", vi: "có thể (giả định tương lai)", pos: "v.", pronunciation_vi: "pu-DER", pronunciation_en: "poo-DER" },
      { word: "fizer", en: "(I/he) do — fut. subj. of fazer", vi: "làm (giả định tương lai)", pos: "v.", pronunciation_vi: "fi-ZER", pronunciation_en: "fee-ZER" },
      { word: "venha", en: "(he) come — pres. subj. of vir", vi: "đến (giả định hiện tại)", pos: "v.", pronunciation_vi: "VÊ-nha", pronunciation_en: "VEH-nya" },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Você acha que o cliente assina hoje?",
        vi: "Bạn nghĩ khách sẽ ký hôm nay chứ?",
        en: "Do you think the client will sign today?",
      },
      {
        speaker: "B",
        text: "Talvez ele assine, mas é importante que a gente mande o contrato cedo.",
        vi: "Có lẽ ông ấy sẽ ký, nhưng quan trọng là ta gửi hợp đồng sớm.",
        en: "Maybe he'll sign, but it's important that we send the contract early.",
      },
      {
        speaker: "A",
        text: "Combinado. Assim que eu tiver a versão final, te aviso.",
        vi: "Nhất trí. Ngay khi tôi có bản cuối, tôi báo bạn.",
        en: "Agreed. As soon as I have the final version, I'll let you know.",
      },
      {
        speaker: "B",
        text: "Perfeito. E se ele pedir mudanças, a gente negocia.",
        vi: "Tuyệt. Và nếu ông ấy yêu cầu sửa, ta sẽ thương lượng.",
        en: "Perfect. And if he asks for changes, we'll negotiate.",
      },
    ],
    roleplay_prompts: [
      "Nói về kế hoạch cuối tuần dùng 'quando eu tiver tempo' và 'se fizer sol' (nếu trời nắng).",
      "Đưa lời khuyên cho đồng nghiệp dùng 'É importante que você…' và 'Espero que…'.",
    ],
    roleplay_prompts_en: [
      "Talk about weekend plans using 'quando eu tiver tempo' and 'se fizer sol' (if it's sunny).",
      "Give a colleague advice using 'É importante que você…' and 'Espero que…'.",
    ],
    register_notes_vi:
      "Trong văn nói thân mật, người Brazil đôi khi 'lười' và thay subjuntivo bằng presente do indicativo ('se você pode' thay vì 'se você puder') — nhưng trong viết và nói chuẩn, futuro do subjuntivo là bắt buộc. Học cho chắc để viết chuyên nghiệp.",
    register_notes_en:
      "In casual speech Brazilians sometimes 'cheat' and use the present indicative instead ('se você pode' for 'se você puder') — but in writing and standard speech the future subjunctive is required. Master it for professional writing.",
    exercises: [
      {
        type: "fill-blank",
        question: "Quando eu ___ tempo, eu te ligo. (ter — futuro do subjuntivo)",
        answer: "tiver",
        hint_vi: "futuro do subjuntivo của 'ter'",
        hint_en: "future subjunctive of 'ter'",
      },
      {
        type: "fill-blank",
        question: "Espero que você ___ terminar a tempo. (conseguir — presente do subjuntivo)",
        answer: "consiga",
        hint_vi: "presente do subjuntivo của 'conseguir'",
        hint_en: "present subjunctive of 'conseguir'",
      },
      {
        type: "matching",
        pairs: [
          ["se você puder", "nếu bạn có thể"],
          ["assim que chegar", "ngay khi đến"],
          ["talvez ele venha", "có lẽ anh ấy đến"],
        ],
        instruction: "Nối câu giả định với nghĩa tiếng Việt",
        instruction_en: "Match each subjunctive clause with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Nếu có thể, hãy báo tôi trước cuộc họp.",
        portuguese: "Se você puder, me avise antes da reunião.",
        english: "If you can, let me know before the meeting.",
        hint_vi: "'se' + futuro do subjuntivo ('puder'), không phải 'pode'",
        hint_en: "'se' + future subjunctive ('puder'), not 'pode'",
      },
    ],
  },

  // ── 5. Professional writing ───────────────────────────────────────────────
  {
    id: "portuguese_professional_writing_emails",
    level: "B2",
    category: "professional_writing",
    title_vi: "Viết email và văn bản chuyên nghiệp",
    title_en: "Professional emails and writing",
    sentences: [
      {
        en: "Prezado Senhor Silva, espero que esteja bem.",
        vi: "Kính gửi ông Silva, mong ông vẫn khỏe.",
        pronunciation_focus: ["prezado→prê-ZA-du", "esteja→es-TÊ-ja"],
        pronunciation_focus_en: ["prezado→preh-ZAH-doo", "esteja→es-TAY-zha"],
      },
      {
        en: "Escrevo para dar seguimento à nossa conversa de ontem.",
        vi: "Tôi viết thư để tiếp nối cuộc trò chuyện hôm qua của chúng ta.",
        pronunciation_focus: ["seguimento→se-gui-MEN-tu", "conversa→côn-VER-sa"],
        pronunciation_focus_en: ["seguimento→seh-gee-MEN-too", "conversa→kong-VER-sa"],
      },
      {
        en: "Segue em anexo o relatório solicitado.",
        vi: "Đính kèm theo đây là báo cáo đã được yêu cầu.",
        pronunciation_focus: ["segue→SÊ-gui", "anexo→a-NE-csu"],
        pronunciation_focus_en: ["segue→SEH-gee", "anexo→a-NEK-soo"],
      },
      {
        en: "Fico à disposição para quaisquer esclarecimentos.",
        vi: "Tôi luôn sẵn sàng để giải đáp mọi thắc mắc.",
        pronunciation_focus: ["disposição→djis-pô-zi-SÃU", "esclarecimentos→es-cla-re-si-MEN-tus"],
        pronunciation_focus_en: ["disposição→jees-poh-zee-SOWN", "esclarecimentos→es-kla-reh-see-MEN-toos"],
      },
      {
        en: "Atenciosamente, Mariana Costa.",
        vi: "Trân trọng, Mariana Costa.",
        pronunciation_focus: ["atenciosamente→a-ten-si-ô-za-MEN-tji"],
        pronunciation_focus_en: ["atenciosamente→a-ten-see-oh-za-MEN-chee"],
      },
    ],
    cultural_notes_vi:
      "Email công sở Brazil có khung cố định: mở đầu 'Prezado(a) + chức danh/tên', câu chúc 'espero que esteja bem', thân bài, rồi đóng bằng 'Atenciosamente' (trang trọng) hoặc 'Abraços' (thân mật, với đồng nghiệp quen). 'Segue em anexo' là cụm chuẩn cho 'đính kèm'. Đừng dịch word-by-word từ tiếng Anh 'Dear' = 'Querido' — 'Querido' nghe quá tình cảm.",
    cultural_notes_en:
      "Brazilian work email has a fixed frame: open with 'Prezado(a) + title/name', a courtesy 'espero que esteja bem', the body, then close with 'Atenciosamente' (formal) or 'Abraços' (warm, for familiar colleagues). 'Segue em anexo' is the standard 'please find attached'. Don't word-for-word translate English 'Dear' as 'Querido' — that sounds romantic.",
    tip_advice_vi:
      "Khung email an toàn: (1) 'Prezado(a) Sr./Sra. [Tên]' (2) 'Espero que esteja bem.' (3) 'Escrevo para…' (mục đích) (4) nội dung (5) 'Fico à disposição…' (6) 'Atenciosamente, [Tên]'. Dùng 'gostaria', 'poderia', 'seria possível' để lịch sự thay vì ra lệnh.",
    tip_advice_en:
      "Safe email frame: (1) 'Prezado(a) Sr./Sra. [Name]' (2) 'Espero que esteja bem.' (3) 'Escrevo para…' (purpose) (4) the body (5) 'Fico à disposição…' (6) 'Atenciosamente, [Name]'. Use 'gostaria', 'poderia', 'seria possível' to be polite instead of commanding.",
    vocabulary: [
      { word: "prezado(a)", en: "dear (formal)", vi: "kính gửi", pos: "adj.", pronunciation_vi: "prê-ZA-du", pronunciation_en: "preh-ZAH-doo" },
      { word: "atenciosamente", en: "sincerely/best regards", vi: "trân trọng", pos: "adv.", pronunciation_vi: "a-ten-si-ô-za-MEN-tji", pronunciation_en: "a-ten-see-oh-za-MEN-chee" },
      { word: "em anexo", en: "attached", vi: "đính kèm", pos: "expr.", pronunciation_vi: "em a-NE-csu", pronunciation_en: "eng a-NEK-soo" },
      { word: "dar seguimento", en: "to follow up", vi: "tiếp nối/theo dõi", pos: "expr.", pronunciation_vi: "dar se-gui-MEN-tu", pronunciation_en: "dar seh-gee-MEN-too" },
      { word: "ficar à disposição", en: "to remain available", vi: "luôn sẵn sàng", pos: "expr.", pronunciation_vi: "fi-CAR a djis-pô-zi-SÃU", pronunciation_en: "fee-KAR ah jees-poh-zee-SOWN" },
      { word: "o esclarecimento", en: "clarification", vi: "sự giải đáp", pos: "n.m.", pronunciation_vi: "es-cla-re-si-MEN-tu", pronunciation_en: "es-kla-reh-see-MEN-too" },
      { word: "encaminhar", en: "to forward", vi: "chuyển tiếp", pos: "v.", pronunciation_vi: "en-ca-mi-NHAR", pronunciation_en: "en-ka-mee-NYAR" },
      { word: "o prazo de entrega", en: "delivery deadline", vi: "hạn giao", pos: "n.m.", pronunciation_vi: "PRA-zu dji en-TRÊ-ga", pronunciation_en: "PRAH-zoo jee en-TREH-ga" },
      { word: "conforme combinado", en: "as agreed", vi: "như đã thỏa thuận", pos: "expr.", pronunciation_vi: "côn-FOR-mi côm-bi-NA-du", pronunciation_en: "kong-FOR-mee kohm-bee-NAH-doo" },
      { word: "aguardo seu retorno", en: "I await your reply", vi: "tôi chờ phản hồi", pos: "expr.", pronunciation_vi: "a-GUAR-du seu rê-TOR-nu", pronunciation_en: "a-GWAR-doo say-oo heh-TOR-noo" },
    ],
    dialogue: [
      {
        speaker: "E-mail",
        text: "Prezada Sra. Lima, espero que esteja bem.",
        vi: "Kính gửi bà Lima, mong bà vẫn khỏe.",
        en: "Dear Ms. Lima, I hope you are well.",
      },
      {
        speaker: "E-mail",
        text: "Escrevo para dar seguimento à reunião e enviar a proposta. Segue em anexo.",
        vi: "Tôi viết để tiếp nối cuộc họp và gửi đề xuất. Đính kèm theo đây.",
        en: "I'm writing to follow up on the meeting and send the proposal. Please find it attached.",
      },
      {
        speaker: "E-mail",
        text: "Conforme combinado, o prazo de entrega é dia 30. Fico à disposição para dúvidas.",
        vi: "Như đã thỏa thuận, hạn giao là ngày 30. Tôi luôn sẵn sàng giải đáp.",
        en: "As agreed, the delivery deadline is the 30th. I'm available for any questions.",
      },
      {
        speaker: "E-mail",
        text: "Atenciosamente, Mariana Costa.",
        vi: "Trân trọng, Mariana Costa.",
        en: "Sincerely, Mariana Costa.",
      },
    ],
    roleplay_prompts: [
      "Viết một email theo dõi (follow-up) gửi khách hàng sau cuộc họp, đính kèm báo cáo, dùng đủ 6 bước khung email.",
      "Viết email từ chối lịch sự một lời mời họp vì trùng lịch; dùng 'gostaria' và 'fico à disposição'.",
    ],
    roleplay_prompts_en: [
      "Write a follow-up email to a client after a meeting, attaching a report, using all 6 steps of the email frame.",
      "Write an email politely declining a meeting invite due to a clash; use 'gostaria' and 'fico à disposição'.",
    ],
    register_notes_vi:
      "'Prezado(a)' + 'Atenciosamente' = trang trọng (khách, cấp trên). Với đồng nghiệp quen: mở 'Oi, [tên]!' và đóng 'Abraço' / 'Att.' (viết tắt của Atenciosamente, bán trang trọng). Tránh emoji và viết tắt kiểu chat trong email công việc lần đầu.",
    register_notes_en:
      "'Prezado(a)' + 'Atenciosamente' = formal (clients, superiors). With familiar colleagues: open 'Oi, [name]!' and close 'Abraço' / 'Att.' (abbreviation of Atenciosamente, semi-formal). Avoid emojis and chat abbreviations in a first work email.",
    exercises: [
      {
        type: "fill-blank",
        question: "Segue em ___ o relatório solicitado.",
        answer: "anexo",
        hint_vi: "cụm chuẩn nghĩa 'đính kèm'",
        hint_en: "the standard word for 'attached'",
      },
      {
        type: "matching",
        pairs: [
          ["atenciosamente", "trân trọng"],
          ["em anexo", "đính kèm"],
          ["conforme combinado", "như đã thỏa thuận"],
        ],
        instruction: "Nối cụm từ email với nghĩa tiếng Việt",
        instruction_en: "Match each email phrase with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Tôi luôn sẵn sàng để giải đáp mọi thắc mắc.",
        portuguese: "Fico à disposição para quaisquer esclarecimentos.",
        english: "I'm available for any clarifications.",
        hint_vi: "'à disposição' = sẵn sàng; 'quaisquer' = bất kỳ (số nhiều)",
        hint_en: "'à disposição' = available; 'quaisquer' = any (plural of qualquer)",
      },
    ],
  },
];

export default lessons;
