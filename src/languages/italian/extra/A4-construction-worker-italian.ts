// A4 — Construction Worker Italian (Vietnamese → Italian study track).
// Converted from .local/vietnamese-italian-study/A4-construction-worker-italian.md.
//
// NOTE: There is no shared Italian lesson type yet (src/languages/italian has no
// lessons.ts), so this file is self-contained: it declares an inline ItalianLesson
// type that mirrors the French `FrenchLesson` shape in
// src/languages/french/lessons.ts. When the Italian registry lands, swap the
// local types for a shared import.
//
// Field convention (inherited from the French lessons): the `en` field on a
// sentence holds the TARGET-LANGUAGE text (here: Italian), and `vi` holds the
// Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation
// + grammar notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same order.

export type ItalianLessonSentence = {
  /** Target-language (Italian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type ItalianVocabEntry = {
  cell_id?: string;
  /** Italian word/phrase (with article where it teaches gender). */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun (m)", "noun (f)", "verb". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type ItalianDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** Italian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
export type ItalianExercise = Record<string, unknown>;

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ItalianLesson = {
  id: string;
  category: string;
  level: ItalianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: ItalianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: ItalianVocabEntry[];
  dialogue?: ItalianDialogueLine[];
  exercises?: ItalianExercise[];
  content?: string;
};

export const lessons: ItalianLesson[] = [
  {
    id: "italian_construction_worker_a4",
    level: "A2",
    category: "work",
    title_vi: "Tiếng Ý cho thợ xây dựng",
    title_en: "Construction worker Italian",
    sentences: [
      // ── Essential site phrases ──────────────────────────────────────────
      {
        en: "Dove devo andare?",
        vi: "Tôi phải đi đâu?",
        pronunciation_focus: [
          "DEH-vo AN-da-re — `devo` (tôi phải) đi với động từ nguyên thể `andare`.",
          "Lỗi người Việt: nói `io andare dove`. Tiếng Ý đảo trật tự: `Dove devo andare?`",
          "Drill: `Dove devo andare?`",
        ],
        pronunciation_focus_en: [
          "DEH-vo AN-da-re — `devo` ('I must') takes the infinitive `andare`.",
          "VN-speaker trap: saying `io andare dove`. Italian fronts the question word: `Dove devo andare?`",
          "Drill: `Dove devo andare?`",
        ],
      },
      {
        en: "Cosa devo fare adesso?",
        vi: "Bây giờ tôi phải làm gì?",
        pronunciation_focus: [
          "KO-za DEH-vo FA-re — câu hỏi an toàn để xin chỉ dẫn.",
          "Lỗi người Việt: nói `cosa fare io`. Giữ `devo` + nguyên thể.",
          "Drill: `Cosa devo fare adesso?`",
        ],
        pronunciation_focus_en: [
          "KO-za DEH-vo FA-re — the safe 'what should I do' instruction question.",
          "VN-speaker trap: saying `cosa fare io`. Keep `devo` + infinitive.",
          "Drill: `Cosa devo fare adesso?`",
        ],
      },
      {
        en: "Non ho capito. Può ripetere?",
        vi: "Tôi chưa hiểu. Ông/bà nhắc lại được không?",
        pronunciation_focus: [
          "non o ka-PEE-to — dùng SỚM, đừng đợi đến khi làm sai.",
          "Lỗi người Việt: im lặng vì ngại. Nói `Non ho capito` ngay là an toàn hơn.",
          "Drill: `Non ho capito. Può ripetere?`",
        ],
        pronunciation_focus_en: [
          "non o ka-PEE-to — use this EARLY, not after a mistake.",
          "VN-speaker trap: staying silent out of shyness. Saying `Non ho capito` up front is safer.",
          "Drill: `Non ho capito. Può ripetere?`",
        ],
      },
      {
        en: "Può parlare più lentamente?",
        vi: "Ông/bà nói chậm hơn được không?",
        pronunciation_focus: [
          "pwo par-LA-re pyoo len-ta-MEN-te — thể lịch sự (formal).",
          "Lỗi người Việt: chỉ nói `piano`. `Più lentamente` rõ và lịch sự hơn.",
          "Drill: `Può parlare più lentamente?`",
        ],
        pronunciation_focus_en: [
          "pwo par-LA-re pyoo len-ta-MEN-te — the formal/polite form.",
          "VN-speaker trap: saying only `piano`. `Più lentamente` is clearer and politer.",
          "Drill: `Può parlare più lentamente?`",
        ],
      },
      {
        en: "Questo è pericoloso.",
        vi: "Cái này nguy hiểm.",
        pronunciation_focus: [
          "KWES-to eh pe-ri-ko-LO-zo — `pericoloso` là TÍNH TỪ (nguy hiểm).",
          "Lỗi người Việt: dùng `pericolo` (danh từ = mối nguy) làm tính từ.",
          "Drill: `Questo è pericoloso.`",
        ],
        pronunciation_focus_en: [
          "KWES-to eh pe-ri-ko-LO-zo — `pericoloso` is the ADJECTIVE ('dangerous').",
          "VN-speaker trap: using the noun `pericolo` ('danger') as an adjective.",
          "Drill: `Questo è pericoloso.`",
        ],
      },
      {
        en: "Mi serve aiuto subito.",
        vi: "Tôi cần giúp ngay.",
        pronunciation_focus: [
          "mi SER-ve a-YOO-to SOO-bi-to — câu khẩn cấp tự nhiên.",
          "Lỗi người Việt: dịch thẳng `io bisogno aiuto`. Cấu trúc Ý là `mi serve …`.",
          "Drill: `Mi serve aiuto subito.`",
        ],
        pronunciation_focus_en: [
          "mi SER-ve a-YOO-to SOO-bi-to — the natural urgent phrasing.",
          "VN-speaker trap: word-for-word `io bisogno aiuto`. Italian uses `mi serve …`.",
          "Drill: `Mi serve aiuto subito.`",
        ],
      },
      // ── Safety commands ────────────────────────────────────────────────
      {
        en: "Attento alla scala!",
        vi: "Cẩn thận cái thang!",
        pronunciation_focus: [
          "at-TEN-to — nói với nam; `Attenta` khi nói với nữ.",
          "Lỗi người Việt: không đổi theo giống. Nhớ đổi -o/-a theo người nghe.",
          "Drill: `Attento alla scala!`",
        ],
        pronunciation_focus_en: [
          "at-TEN-to — to a man; `Attenta` to a woman.",
          "VN-speaker trap: not changing for gender. Switch -o/-a for the listener.",
          "Drill: `Attento alla scala!`",
        ],
      },
      {
        en: "Fermati subito!",
        vi: "Dừng lại ngay!",
        pronunciation_focus: [
          "FER-ma-ti — mệnh lệnh thân mật (informal), nhấn vào từ cảnh báo.",
          "Lỗi người Việt: chỉ kêu `stop`. Dùng `Fermati!` cho rõ là tiếng Ý.",
          "Drill: `Fermati subito!`",
        ],
        pronunciation_focus_en: [
          "FER-ma-ti — informal command; stress the warning word.",
          "VN-speaker trap: shouting only `stop`. Use `Fermati!`.",
          "Drill: `Fermati subito!`",
        ],
      },
      {
        en: "Metti il casco.",
        vi: "Đội mũ bảo hộ vào.",
        pronunciation_focus: [
          "MET-ti il KAS-ko — dùng `mettere` cho việc đeo/mặc đồ bảo hộ.",
          "Lỗi người Việt: nói `usare casco`. Đeo đồ là `mettere`, không phải `usare`.",
          "Drill: `Metti il casco.`",
        ],
        pronunciation_focus_en: [
          "MET-ti il KAS-ko — use `mettere` ('to put on') for wearing safety gear.",
          "VN-speaker trap: saying `usare casco`. Putting gear on is `mettere`, not `usare`.",
          "Drill: `Metti il casco.`",
        ],
      },
      {
        en: "Non salire lì.",
        vi: "Đừng leo lên đó.",
        pronunciation_focus: [
          "non sa-LEE-re lee — mệnh lệnh phủ định = `non` + nguyên thể.",
          "Lỗi người Việt: nói `no salire`. Phủ định trong tiếng Ý là `non`, không phải `no`.",
          "Drill: `Non salire lì.`",
        ],
        pronunciation_focus_en: [
          "non sa-LEE-re lee — negative command = `non` + infinitive.",
          "VN-speaker trap: saying `no salire`. Italian negation is `non`, not `no`.",
          "Drill: `Non salire lì.`",
        ],
      },
      {
        en: "Chiama il capo cantiere.",
        vi: "Gọi quản lý công trường.",
        pronunciation_focus: [
          "KYA-ma il KA-po kan-TYE-re — `capo` = sếp/quản lý; `cantiere` = công trường.",
          "Lỗi người Việt: dùng từ Anh `boss`. Tiếng Ý là `capo`.",
          "Drill: `Chiama il capo cantiere.`",
        ],
        pronunciation_focus_en: [
          "KYA-ma il KA-po kan-TYE-re — `capo` = boss/supervisor; `cantiere` = building site.",
          "VN-speaker trap: using English 'boss'. Italian is `capo`.",
          "Drill: `Chiama il capo cantiere.`",
        ],
      },
      // ── Reporting problems ─────────────────────────────────────────────
      {
        en: "C'è un problema qui.",
        vi: "Có vấn đề ở đây.",
        pronunciation_focus: [
          "cheh un pro-BLEH-ma kwee — `c'è` = 'có / there is'.",
          "Lỗi người Việt: nói `ha problema`. Dùng `c'è` cho 'có'.",
          "Drill: `C'è un problema qui.`",
        ],
        pronunciation_focus_en: [
          "cheh un pro-BLEH-ma kwee — `c'è` = 'there is'.",
          "VN-speaker trap: saying `ha problema`. Use `c'è` for 'there is'.",
          "Drill: `C'è un problema qui.`",
        ],
      },
      {
        en: "Il trapano si è rotto.",
        vi: "Cái máy khoan bị hỏng.",
        pronunciation_focus: [
          "il TRA-pa-no si eh ROT-to — `si è rotto` (phản thân, quá khứ) = báo SỰ VIỆC vừa hỏng.",
          "Lỗi người Việt: chỉ nói `è rotto`. `è rotto` tả TRẠNG THÁI; muốn báo nó vừa hỏng thì `si è rotto`.",
          "Drill: `Il trapano si è rotto.`",
        ],
        pronunciation_focus_en: [
          "il TRA-pa-no si eh ROT-to — `si è rotto` (reflexive past) reports the EVENT of breaking.",
          "VN-speaker trap: saying only `è rotto`. `è rotto` describes a STATE; to report it just broke, use `si è rotto`.",
          "Drill: `Il trapano si è rotto.`",
        ],
      },
      {
        en: "Manca un pezzo.",
        vi: "Thiếu một bộ phận.",
        pronunciation_focus: [
          "MAN-ka un PET-tso — `manca` = 'thiếu / is missing'.",
          "Lỗi người Việt: nói `non ha pezzo`. Dùng `manca` cho 'thiếu'.",
          "Drill: `Manca un pezzo.`",
        ],
        pronunciation_focus_en: [
          "MAN-ka un PET-tso — `manca` = 'is missing'.",
          "VN-speaker trap: saying `non ha pezzo`. Use `manca` for 'missing'.",
          "Drill: `Manca un pezzo.`",
        ],
      },
      {
        en: "Ho finito il lavoro.",
        vi: "Tôi xong việc rồi.",
        pronunciation_focus: [
          "o fi-NEE-to il la-VO-ro — quá khứ với `avere`: `ho finito`.",
          "Lỗi người Việt: nói `sono finito` — câu này có thể hiểu là 'tôi tiêu rồi/kiệt sức'; tránh ở trình độ A.",
          "Drill: `Ho finito il lavoro.`",
        ],
        pronunciation_focus_en: [
          "o fi-NEE-to il la-VO-ro — past with `avere`: `ho finito`.",
          "VN-speaker trap: `sono finito` can mean 'I'm done for/ruined'; avoid it at A level.",
          "Drill: `Ho finito il lavoro.`",
        ],
      },
      {
        en: "Mi sono fatto male alla mano.",
        vi: "Tôi bị thương ở tay.",
        pronunciation_focus: [
          "mi SO-no FAT-to MA-le AL-la MA-no — câu phản thân báo bị thương.",
          "Lỗi người Việt: nói `ho dolore lavoro`. Câu chuẩn là `mi sono fatto/a male`.",
          "Drill: `Mi sono fatto male alla mano.`",
        ],
        pronunciation_focus_en: [
          "mi SO-no FAT-to MA-le AL-la MA-no — the reflexive injury phrase.",
          "VN-speaker trap: `ho dolore lavoro`. The set phrase is `mi sono fatto/a male`.",
          "Drill: `Mi sono fatto male alla mano.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trên công trường Ý (`cantiere`), an toàn lao động được kiểm tra rất gắt: mũ bảo hộ (`casco`) và giày bảo hộ (`scarpe antinfortunistiche`) là bắt buộc, thiếu là bị đuổi khỏi công trường. `Capo` (hoặc `caposquadra` / `capo cantiere`) là người ra lệnh trực tiếp — gọi đúng chức danh, đừng dùng từ tiếng Anh `boss`. Khi có sự cố nặng, gọi `112` (số cấp cứu chung của châu Âu) và nói `Chiama l'ambulanza`. Người Ý nói nhanh; câu `Non ho capito, può ripetere?` được coi là chuyên nghiệp, không phải dấu hiệu yếu kém.",
    cultural_notes_en:
      "On an Italian building site (`cantiere`), safety is enforced hard: the hard hat (`casco`) and safety boots (`scarpe antinfortunistiche`) are mandatory, and you'll be sent off the site without them. The `capo` (or `caposquadra` / `capo cantiere`) gives orders directly — use the title, not the English 'boss'. For a serious incident, call `112` (Europe-wide emergency number) and say `Chiama l'ambulanza`. Italians speak fast; `Non ho capito, può ripetere?` reads as professional, not as weakness.",
    tip_advice_vi:
      "Học thuộc bốn 'việc sống còn' trước: (1) dừng việc bằng MỘT lệnh ngắn — `Fermati!`; (2) báo cái gì hỏng — `… si è rotto`; (3) xin dụng cụ còn thiếu — `Mi serve … / Manca …`; (4) báo bị thương — `Mi sono fatto male a…`. Phân biệt `è rotto` (trạng thái) với `si è rotto` (vừa hỏng) và đừng bao giờ nói `sono finito` khi ý là 'tôi xong việc' — hãy dùng `ho finito`.",
    tip_advice_en:
      "Drill the four 'survival' jobs first: (1) stop work with ONE short command — `Fermati!`; (2) say what broke — `… si è rotto`; (3) ask for the missing tool — `Mi serve … / Manca …`; (4) report an injury — `Mi sono fatto male a…`. Keep `è rotto` (a state) apart from `si è rotto` (it just broke), and never say `sono finito` for 'I've finished the work' — use `ho finito`.",
    vocabulary: [
      // Tools and materials
      {
        cell_id: "62e02bda-c278-466c-afaf-be503896d62b",
        word: "il martello",
        en: "hammer",
        vi: "búa",
        pos: "noun (m)",
        pronunciation_vi: "il mar-TEL-lo — `ll` đôi giữ hơi lâu; đừng rớt `o` cuối",
        pronunciation_en: "il mar-TEL-lo — hold the double 'll'; don't drop the final 'o'",
      },
      {
        cell_id: "81077647-100a-4bdf-bd9c-0ea7599b0f00",
        word: "il trapano",
        en: "drill",
        vi: "máy khoan",
        pos: "noun (m)",
        pronunciation_vi: "il TRA-pa-no — nhấn `tra-PA-no`; đừng gọi mọi máy là `macchina`",
        pronunciation_en: "il TRA-pa-no — stress `TRA`; don't call every tool `macchina`",
      },
      {
        cell_id: "a79f340f-cb62-425d-a5b3-4fdf8ead7b00",
        word: "la scala",
        en: "ladder",
        vi: "thang",
        pos: "noun (f)",
        pronunciation_vi: "la SKA-la — giống cái, dùng `la`",
        pronunciation_en: "la SKA-la — feminine, takes `la`",
      },
      {
        cell_id: "fe203532-5791-4552-afdb-d92d7b2bdb1b",
        word: "il casco",
        en: "helmet / hard hat",
        vi: "mũ bảo hộ",
        pos: "noun (m)",
        pronunciation_vi: "il KAS-ko — `ca` đọc cứng 'ka'; đừng đọc kiểu tiếng Anh",
        pronunciation_en: "il KAS-ko — hard 'ka'; not like the English word",
      },
      {
        cell_id: "4f5aa206-0fcc-4778-8bce-f4d04ac7cd41",
        word: "i guanti",
        en: "gloves",
        vi: "găng tay",
        pos: "noun (m pl)",
        pronunciation_vi: "i GWAN-ti — số nhiều; đừng nói số ít",
        pronunciation_en: "i GWAN-ti — plural; don't say the singular",
      },
      {
        cell_id: "bd72aff7-cf9e-4c7c-b189-72cb54290f9f",
        word: "il cemento",
        en: "cement",
        vi: "xi măng",
        pos: "noun (m)",
        pronunciation_vi: "il che-MEN-to — `ce` đọc 'che', KHÔNG đọc cứng 'ke'",
        pronunciation_en: "il che-MEN-to — `ce` is 'che', NOT a hard 'ke'",
      },
      {
        cell_id: "1c0d425b-3a7c-4c83-add4-eadec0e2b788",
        word: "il ponteggio",
        en: "scaffolding",
        vi: "giàn giáo",
        pos: "noun (m)",
        pronunciation_vi: "il pon-TED-jo — `ggio` đọc mềm; đừng né từ này",
        pronunciation_en: "il pon-TED-jo — soft `ggio`; don't avoid the word",
      },
      {
        cell_id: "b28c3e9a-9cb5-4d6a-8f5e-103b26248edf",
        word: "le scarpe antinfortunistiche",
        en: "safety boots",
        vi: "giày bảo hộ",
        pos: "noun (f pl)",
        pronunciation_vi: "le SKAR-pe an-tin-for-tu-NIS-ti-ke — từ dài; đừng rút thành `scarpe sicurezza`",
        pronunciation_en: "le SKAR-pe an-tin-for-tu-NIS-ti-ke — long word; don't shorten to `scarpe sicurezza`",
      },
      // Materials and measurement
      {
        cell_id: "1e5f0798-0056-4ef9-b17d-c1fe563b1e89",
        word: "il metro",
        en: "metre / tape measure",
        vi: "thước mét",
        pos: "noun (m)",
        pronunciation_vi: "il ME-tro — dụng cụ đo",
        pronunciation_en: "il ME-tro — measurement / tape measure",
      },
      {
        cell_id: "3823679c-6d60-48c7-b607-2c610c0a65b0",
        word: "il chiodo",
        en: "nail",
        vi: "cái đinh",
        pos: "noun (m)",
        pronunciation_vi: "il KYO-do — `chi` đọc cứng 'ki'",
        pronunciation_en: "il KYO-do — `chi` is a hard 'ki'",
      },
      {
        cell_id: "4740a276-2b8f-4e5b-ac03-3e6d113225ac",
        word: "la vite",
        en: "screw",
        vi: "ốc vít",
        pos: "noun (f)",
        pronunciation_vi: "la VEE-te — giống cái",
        pronunciation_en: "la VEE-te — feminine",
      },
      {
        cell_id: "6584d509-6f7c-498b-9f95-ba98f348511a",
        word: "la vernice",
        en: "paint",
        vi: "sơn",
        pos: "noun (f)",
        pronunciation_vi: "la ver-NEE-che — giống cái; `ce` đọc 'che'",
        pronunciation_en: "la ver-NEE-che — feminine; `ce` is 'che'",
      },
      {
        cell_id: "a8d1ddb1-952c-4ef4-892a-d27863aaedd0",
        word: "il secchio",
        en: "bucket",
        vi: "xô",
        pos: "noun (m)",
        pronunciation_vi: "il SEK-kyo — đồ chứa; `cchio` đọc 'kyo'",
        pronunciation_en: "il SEK-kyo — a container; `cchio` is 'kyo'",
      },
      {
        cell_id: "83bc1763-1411-4646-b04d-52786b180bba",
        word: "il livello",
        en: "(spirit) level",
        vi: "dụng cụ cân bằng / mức",
        pos: "noun (m)",
        pronunciation_vi: "il li-VEL-lo — tùy ngữ cảnh: thước thủy hoặc 'mức/tầng'",
        pronunciation_en: "il li-VEL-lo — context-dependent: spirit level or 'level'",
      },
    ],
    dialogue: [
      // Dialogue: Broken Pipe
      {
        cell_id: "69e9c94c-1710-4615-9748-5989f057f904",
        speaker: "Caposquadra",
        text: "C'è una perdita d'acqua al piano terra.",
        vi: "Có rò rỉ nước ở tầng trệt.",
        en: "There's a water leak on the ground floor.",
      },
      {
        cell_id: "f743d5da-106e-4d78-86fa-43c3d76c0ef6",
        speaker: "Operaio",
        text: "Dove devo andare?",
        vi: "Tôi phải đi đâu?",
        en: "Where do I have to go?",
      },
      {
        cell_id: "79bbe707-6a90-4864-b243-a2abbc586559",
        speaker: "Caposquadra",
        text: "Vai subito giù e chiudi l'acqua principale.",
        vi: "Xuống ngay và khóa van nước chính.",
        en: "Go down right away and shut off the main water.",
      },
      {
        cell_id: "c7430783-4109-4584-93f4-812055f5d671",
        speaker: "Operaio",
        text: "Va bene. Serve anche il trapano?",
        vi: "Được. Có cần cả máy khoan không?",
        en: "Okay. Do I also need the drill?",
      },
      {
        cell_id: "d9fcb358-9dbd-4c02-b412-bf0fd7ddea90",
        speaker: "Caposquadra",
        text: "No, prima controlla il tubo.",
        vi: "Không, kiểm tra ống nước trước đã.",
        en: "No, first check the pipe.",
      },
      {
        cell_id: "d1b56cca-ece5-4eff-a52d-ea0bfe3dde58",
        speaker: "Operaio",
        text: "Ho capito. Se vedo il problema, ti chiamo.",
        vi: "Tôi hiểu rồi. Nếu thấy vấn đề, tôi gọi anh.",
        en: "Got it. If I see the problem, I'll call you.",
      },
      // Dialogue: Missing Material
      {
        cell_id: "2d9a0b46-f03a-4694-bb1d-2230b8c0bccd",
        speaker: "Operaio",
        text: "Mi manca un pezzo per il montaggio.",
        vi: "Tôi thiếu một bộ phận để lắp ráp.",
        en: "I'm missing a part for the assembly.",
      },
      {
        cell_id: "98fa191b-1d29-4cd2-811a-255d018cd674",
        speaker: "Caposquadra",
        text: "Quale pezzo?",
        vi: "Bộ phận nào?",
        en: "Which part?",
      },
      {
        cell_id: "cd9e35a1-2c4f-43d5-8acb-ee7d712f92a7",
        speaker: "Operaio",
        text: "La vite lunga per il supporto.",
        vi: "Con ốc vít dài cho giá đỡ.",
        en: "The long screw for the bracket.",
      },
      {
        cell_id: "02d9b1bf-3475-4d94-8e5d-d51e334c2f95",
        speaker: "Caposquadra",
        text: "Aspetta un momento, la cerco nel furgone.",
        vi: "Chờ một chút, để tôi tìm trong xe tải.",
        en: "Wait a moment, I'll look for it in the van.",
      },
      {
        cell_id: "3de79007-5a4a-4aa1-af53-57726f3907ef",
        speaker: "Operaio",
        text: "Grazie. Intanto preparo la scala.",
        vi: "Cảm ơn. Trong lúc đó tôi chuẩn bị cái thang.",
        en: "Thanks. Meanwhile I'll get the ladder ready.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tôi cần mũ bảo hộ.", answer: "Mi serve il casco." },
          { prompt: "Tôi chưa hiểu.", answer: "Non ho capito." },
          { prompt: "Máy khoan bị hỏng.", answer: "Il trapano si è rotto." },
          { prompt: "Có vấn đề ở đây.", answer: "C'è un problema qui." },
          { prompt: "Tôi bị thương ở tay.", answer: "Mi sono fatto male alla mano." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Ý:",
        instruction_en: "Extra practice — translate into Italian:",
        items: [
          { prompt: "Tôi cần cái thang.", answer: "Mi serve la scala." },
          { prompt: "Tầng hai ở đâu?", answer: "Dov'è il secondo piano?" },
          { prompt: "Sợi dây đó nguy hiểm.", answer: "Quel cavo è pericoloso." },
          { prompt: "Máy khoan bị hỏng.", answer: "Il trapano si è rotto." },
          { prompt: "Tôi bị thương ở tay.", answer: "Mi sono fatto male alla mano." },
          { prompt: "Ông giải thích chậm hơn được không?", answer: "Può spiegare più lentamente?" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung báo cáo sự cố ngắn — điền chỗ trống: `C'è un problema con ___. Manca ___. Si è rotto ___. Ho bisogno di ___.`",
        instruction_en:
          "Short site-report frame — fill the blanks: `C'è un problema con ___. Manca ___. Si è rotto ___. Ho bisogno di ___.`",
        example:
          "C'è un problema con il trapano. Manca una vite. Si è rotto un cavo. Ho bisogno di aiuto subito.",
        example_vi:
          "Có vấn đề với máy khoan. Thiếu một con ốc vít. Một sợi dây bị đứt. Tôi cần giúp ngay.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra an toàn — bạn làm được chưa?",
        instruction_en: "Quick safety self-check — can you do each one?",
        items: [
          {
            vi: "Tôi có thể dừng việc bằng một lệnh ngắn.",
            en: "I can stop work with one short command.",
          },
          { vi: "Tôi có thể nói cái gì bị hỏng.", en: "I can say what is broken." },
          { vi: "Tôi có thể xin dụng cụ còn thiếu.", en: "I can ask for the missing tool." },
          { vi: "Tôi có thể báo bị thương rõ ràng.", en: "I can report an injury clearly." },
          {
            vi: "Tôi có thể nghe theo chỉ dẫn về cầu thang, dây điện và chỗ trống.",
            en: "I can follow instructions about stairs, cables, and openings.",
          },
          {
            vi: "Tôi có thể xin nhắc lại mà không bị coi là bất lịch sự.",
            en: "I can ask for repetition without sounding rude.",
          },
        ],
      },
    ],
  },
];

export default lessons;
