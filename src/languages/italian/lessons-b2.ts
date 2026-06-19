// src/languages/italian/lessons-b2.ts
//
// Italian B2 lessons for Vietnamese learners.
//
// Shape mirrors the French B2 pack (src/languages/french/lessons-b2.ts) and the
// sibling Italian A1/B1 files so the shared lesson page UI stays consistent
// across language verticals. Types are declared INLINE here because the Italian
// vertical does not yet ship a shared `./lessons` registry — this module is
// intentionally self-contained: it exports its own types plus the B2 data array.
//
// Source content: hand-derived from the local Vietnamese→Italian study track
// (.local/vietnamese-italian-study/ — S4/T7/T8 B2 course maps, K9 error bank for
// Vietnamese speakers). Vietnamese-first: every lesson carries L1 notes — the
// specific mistakes a Vietnamese speaker makes — under `l1_notes_vi`.
// Hand-crafted; no AI-generated filler.
//
// B2 = "tranh luận / trôi chảy" (debate / fluency): structured argument, work
// meetings, news summary, polite negotiation, formal email, and the
// conditional + subjunctive chunks that make Italian sound professional.
//
// Pronunciation conventions for Vietnamese readers:
//   - c/g before e,i → "ch"/"gi"; before a,o,u → "k"/"g" (chiaro → "ki", gente → "gien")
//   - gli → soft "li" (≈ ly);  gn → "nh";  z → "ts"/"dz";  r → tapped/trilled
//   - sce/sci → "shê"/"shi";  qu → "kw";  gu before vowel → "gw"
//   - double consonants (ll, tt, mm, ss…) are HELD longer — load-bearing in Italian
//   - every final vowel is pronounced; never clip the ending the way Vietnamese does
//   - stressed syllable in CAPS

// ── Types (inline — Italian vertical has no shared ./lessons yet) ────────────

export type ItalianCategoryId =
  | "society"
  | "life_admin"
  | "house"
  | "work"
  | "health"
  | "expressions";

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ItalianLessonSentence = {
  /** The Italian target sentence (this is the line the learner speaks). */
  it: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Literal English gloss, for the secondary EN audience. */
  en?: string;
  /** Pronunciation / grammar focus points, written for a Vietnamese ear. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type ItalianVocabEntry = {
  /** Italian word, with article where gender matters (e.g. "il vantaggio"). */
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Pronunciation respelled for a Vietnamese reader; stressed syllable CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint with the stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type ItalianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

/** A Vietnamese-speaker L1-interference note: the mistake + the fix. */
export type ItalianL1Note = {
  /** The wrong form a Vietnamese learner tends to produce. */
  mistake: string;
  /** Why it happens / what the correct form is, in Vietnamese. */
  fix_vi: string;
};

// Loosely typed so per-type exercise fields can vary (fill-blank / matching /
// translation), matching the French pack's Exercise contract.
export type ItalianExercise = Record<string, unknown>;

export type ItalianLesson = {
  id: string;
  category: ItalianCategoryId;
  level: ItalianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: ItalianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  /** Vietnamese-first L1 interference notes — the heart of this pack. */
  l1_notes_vi?: ItalianL1Note[];
  vocabulary?: ItalianVocabEntry[];
  dialogue?: ItalianDialogueLine[];
  exercises?: ItalianExercise[];
};

// ── B2 lessons ───────────────────────────────────────────────────────────────

export const lessons: ItalianLesson[] = [
  // ── 1. Argument structure (society) ─────────────────────────────────────────
  {
    id: "italian_society_argument_structure",
    level: "B2",
    category: "society",
    title_vi: "Lập luận hai mặt: lợi và hại",
    title_en: "Two-sided argument: pros and cons",
    sentences: [
      {
        it: "Da un lato, il lavoro da remoto fa risparmiare tempo.",
        vi: "Một mặt, làm việc từ xa giúp tiết kiệm thời gian.",
        en: "On one hand, remote work saves time.",
        pronunciation_focus: [
          "remoto → rê-MÔ-tô",
          "risparmiare → ri-xpar-MI-a-rê",
        ],
        pronunciation_focus_en: [
          "remoto → 'reh-MOH-toh' — stress 'MOH'; every vowel pronounced",
          "risparmiare → 'ree-spar-MYAH-reh' — 'sp' blends, '-iare' glides to one syllable",
        ],
      },
      {
        it: "Dall'altro, riduce il contatto con i colleghi.",
        vi: "Mặt khác, nó giảm tiếp xúc với đồng nghiệp.",
        en: "On the other, it reduces contact with colleagues.",
        pronunciation_focus: [
          "dall'altro → đal-LAL-trô",
          "colleghi → côl-LÊ-ghi",
        ],
        pronunciation_focus_en: [
          "dall'altro → 'dahl-LAHL-troh' — hold the double-l (one beat of silence)",
          "colleghi → 'kol-LEH-gee' — 'gh' keeps a hard 'g' before i (not 'j')",
        ],
      },
      {
        it: "Tuttavia, con regole chiare i vantaggi superano i limiti.",
        vi: "Tuy nhiên, với quy định rõ ràng thì lợi ích vượt qua hạn chế.",
        en: "However, with clear rules the advantages outweigh the drawbacks.",
        pronunciation_focus: [
          "tuttavia → tut-ta-VI-a",
          "vantaggi → van-TÁT-gi",
        ],
        pronunciation_focus_en: [
          "tuttavia → 'toot-tah-VEE-ah' — hold the double-t; stress 'VEE'",
          "vantaggi → 'van-TAHD-jee' — double-g is 'dj' and held; -ggi is one beat",
        ],
      },
      {
        it: "Un esempio concreto è la riduzione dei tempi di viaggio.",
        vi: "Một ví dụ cụ thể là việc giảm thời gian di chuyển.",
        en: "A concrete example is the reduction in commute time.",
        pronunciation_focus: [
          "concreto → côn-CRÊ-tô",
          "viaggio → VI-át-giô",
        ],
        pronunciation_focus_en: [
          "concreto → 'kon-KREH-toh' — hard 'c' before e here? no: 'kreh'; stress 'KREH'",
          "viaggio → 'VYAHD-joh' — double-g 'dj' held; -ggio is one syllable",
        ],
      },
      {
        it: "Per questo motivo, secondo me, è una buona soluzione.",
        vi: "Vì lý do này, theo tôi, đó là một giải pháp tốt.",
        en: "For this reason, in my opinion, it's a good solution.",
        pronunciation_focus: [
          "motivo → mô-TI-vô",
          "soluzione → xô-lu-DZI-ô-nê",
        ],
        pronunciation_focus_en: [
          "motivo → 'moh-TEE-voh' — stress 'TEE'; clean tapped feel",
          "soluzione → 'soh-loo-TSYOH-neh' — '-zione' is 'TSYOH-neh', final -e said",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở trình độ B2, người Ý chờ đợi MỘT CẤU TRÚC, không chỉ ý kiến rời rạc. Khung chuẩn: luận điểm → 'Da un lato…' (một mặt) → 'Dall'altro…' (mặt khác) → ví dụ cụ thể → kết luận. Tránh nói trắng-đen ('luôn luôn', 'không bao giờ'); người nghe coi đó là thiếu chín chắn. Thay 'ma' (nói thường) bằng 'tuttavia' khi tranh luận trang trọng.",
    cultural_notes_en:
      "At B2, Italians expect STRUCTURE, not scattered opinions. The standard frame: thesis → 'Da un lato…' (on one hand) → 'Dall'altro…' (on the other) → concrete example → conclusion. Avoid black-and-white claims ('always', 'never') — they read as unsophisticated. Upgrade conversational 'ma' to 'tuttavia' in formal debate.",
    tip_advice_vi:
      "Học thuộc khung 5 bước: 'Secondo me… Da un lato… Dall'altro… Un esempio concreto è… Per questo motivo…'. Mỗi luận điểm phải có BẰNG CHỨNG (ví dụ hoặc số liệu), nếu không nó chỉ là cảm tính. Luân phiên các từ nối 'inoltre / tuttavia / di conseguenza' để không lặp lại 'e' và 'ma'.",
    tip_advice_en:
      "Memorize the 5-step frame: 'Secondo me… Da un lato… Dall'altro… Un esempio concreto è… Per questo motivo…'. Every claim needs EVIDENCE (an example or data) or it's just a feeling. Rotate the connectors 'inoltre / tuttavia / di conseguenza' so you stop leaning on 'e' and 'ma'.",
    l1_notes_vi: [
      {
        mistake: "Penso che è utile.",
        fix_vi:
          "Sau động từ ý kiến ('penso che', 'credo che') tiếng Ý dùng thể giả định (congiuntivo): 'Penso che sia utile'. Tiếng Việt không chia động từ nên người học hay quên — đây là lỗi B2 phổ biến nhất.",
      },
      {
        mistake: "C'è problema.",
        fix_vi:
          "Danh từ đếm được số ít cần mạo từ: 'C'è UN problema'. Tiếng Việt bỏ mạo từ ('có vấn đề'), nên hãy tự nhắc: gần như mọi danh từ trong câu đều cần 'il/la/un/una'.",
      },
      {
        mistake: "È sempre meglio / Non è mai vero.",
        fix_vi:
          "Tránh khẳng định tuyệt đối ở B2. Dùng sắc thái: 'in parte' (một phần), 'spesso' (thường), 'in molti casi' (trong nhiều trường hợp). Nói có chừng mực nghe trưởng thành hơn.",
      },
    ],
    vocabulary: [
      { word: "da un lato", en: "on one hand", vi: "một mặt", pos: "espr.", pronunciation_vi: "đa un LA-tô", pronunciation_en: "dah oon LAH-toh — opens the first side of an argument" },
      { word: "dall'altro", en: "on the other hand", vi: "mặt khác", pos: "espr.", pronunciation_vi: "đal-LAL-trô", pronunciation_en: "dahl-LAHL-troh — hold the double-l; the matching second side" },
      { word: "il vantaggio", en: "advantage", vi: "lợi ích", pos: "n.m.", pronunciation_vi: "il van-TÁT-giô", pronunciation_en: "eel van-TAHD-joh — double-g 'dj', held" },
      { word: "lo svantaggio", en: "disadvantage", vi: "bất lợi", pos: "n.m.", pronunciation_vi: "lô dvan-TÁT-giô", pronunciation_en: "loh zvan-TAHD-joh — 'lo' before s+consonant; sv- → 'zv'" },
      { word: "tuttavia", en: "however", vi: "tuy nhiên", pos: "cong.", pronunciation_vi: "tut-ta-VI-a", pronunciation_en: "toot-tah-VEE-ah — formal upgrade of 'ma'" },
      { word: "inoltre", en: "moreover / furthermore", vi: "hơn nữa", pos: "avv.", pronunciation_vi: "i-NOL-trê", pronunciation_en: "ee-NOHL-treh — adds a supporting point" },
      { word: "di conseguenza", en: "consequently", vi: "do đó", pos: "espr.", pronunciation_vi: "đi côn-xê-GUEN-tsa", pronunciation_en: "dee kon-seh-GWEN-tsah — 'gue' is 'gweh'; introduces a result" },
      { word: "la tesi", en: "thesis / claim", vi: "luận điểm", pos: "n.f.", pronunciation_vi: "la TÊ-zi", pronunciation_en: "lah TEH-zee — s→'z' between vowels" },
      { word: "il limite", en: "limit / drawback", vi: "hạn chế", pos: "n.m.", pronunciation_vi: "il LI-mi-tê", pronunciation_en: "eel LEE-mee-teh — stress the first syllable" },
      { word: "l'alternativa", en: "alternative", vi: "phương án khác", pos: "n.f.", pronunciation_vi: "lal-ter-na-TI-va", pronunciation_en: "lal-ter-nah-TEE-vah — stress 'TEE'" },
    ],
    dialogue: [
      { speaker: "A", text: "Secondo te, conviene lavorare da casa?", en: "Do you think working from home is worth it?", vi: "Theo bạn, làm việc ở nhà có đáng không?" },
      { speaker: "B", text: "Da un lato sì, perché risparmi tempo. Dall'altro, però, perdi il contatto con il team.", en: "On one hand yes, because you save time. On the other, though, you lose contact with the team.", vi: "Một mặt thì có, vì tiết kiệm thời gian. Nhưng mặt khác, bạn mất kết nối với cả nhóm." },
      { speaker: "A", text: "Quindi non sei del tutto convinto.", en: "So you're not fully convinced.", vi: "Vậy là bạn chưa hoàn toàn bị thuyết phục." },
      { speaker: "B", text: "Sono favorevole, tuttavia penso che serva una regola chiara sugli orari.", en: "I'm in favor, however I think a clear rule on hours is needed.", vi: "Tôi ủng hộ, tuy nhiên tôi nghĩ cần một quy định rõ về giờ giấc." },
    ],
    exercises: [
      { type: "fill-blank", question: "Penso che ___ una buona idea. (thể giả định của 'essere')", answer: "sia", hint_vi: "sau 'penso che' dùng congiuntivo, không dùng 'è'", hint_en: "after 'penso che' use the subjunctive 'sia', not 'è'" },
      { type: "matching", pairs: [["da un lato", "một mặt (on one hand)"], ["tuttavia", "tuy nhiên (however)"], ["di conseguenza", "do đó (consequently)"]], instruction: "Nối từ nối với nghĩa tiếng Việt", instruction_en: "Match each connector with its Vietnamese meaning" },
      { type: "translation", vietnamese: "Một mặt nó tiết kiệm tiền, mặt khác nó tốn thời gian, tuy nhiên theo tôi lợi ích vẫn lớn hơn.", english: "On one hand it saves money, on the other it costs time, however in my opinion the advantages still outweigh.", italian: "Da un lato fa risparmiare denaro, dall'altro richiede tempo, tuttavia secondo me i vantaggi sono comunque maggiori." },
    ],
  },

  // ── 2. Participating in a work meeting (work) ───────────────────────────────
  {
    id: "italian_work_meeting_participation",
    level: "B2",
    category: "work",
    title_vi: "Phát biểu trong cuộc họp công việc",
    title_en: "Speaking up in a work meeting",
    sentences: [
      {
        it: "Vorrei chiarire un punto, se posso.",
        vi: "Tôi muốn làm rõ một điểm, nếu được.",
        en: "I'd like to clarify a point, if I may.",
        pronunciation_focus: [
          "vorrei → vôr-RÊi",
          "chiarire → ki-a-RI-rê",
        ],
        pronunciation_focus_en: [
          "vorrei → 'vor-RAY' — hold the double-r; conditional, politer than 'voglio'",
          "chiarire → 'kyah-REE-reh' — 'chi' is a hard 'ky', not English 'ch'",
        ],
      },
      {
        it: "In generale sono d'accordo, tuttavia vedo una criticità.",
        vi: "Nhìn chung tôi đồng ý, tuy nhiên tôi thấy một điểm rủi ro.",
        en: "Overall I agree, however I see a problem area.",
        pronunciation_focus: [
          "generale → gê-nê-RA-lê",
          "criticità → cri-ti-chi-TÀ",
        ],
        pronunciation_focus_en: [
          "generale → 'jeh-neh-RAH-leh' — 'ge' is a soft 'j'",
          "criticità → 'kree-tee-chee-TAH' — final stress; the 'ci' is 'chee'",
        ],
      },
      {
        it: "Mi sembra che la procedura richieda troppo tempo.",
        vi: "Tôi thấy hình như quy trình đòi hỏi quá nhiều thời gian.",
        en: "It seems to me the procedure takes too long.",
        pronunciation_focus: [
          "procedura → prô-chê-DU-ra",
          "richieda → ri-KI-ê-da",
        ],
        pronunciation_focus_en: [
          "procedura → 'proh-cheh-DOO-rah' — 'ce' is 'cheh'",
          "richieda → 'ree-KYEH-dah' — subjunctive after 'mi sembra che'; 'chi' = 'ky'",
        ],
      },
      {
        it: "Potremmo fare una prova di una settimana e poi valutare i dati.",
        vi: "Chúng ta có thể thử trong một tuần rồi đánh giá dữ liệu.",
        en: "We could run a one-week trial and then assess the data.",
        pronunciation_focus: [
          "potremmo → pô-TRÉM-mô",
          "settimana → xet-ti-MA-na",
        ],
        pronunciation_focus_en: [
          "potremmo → 'poh-TREM-moh' — conditional 'we could'; hold the double-m",
          "settimana → 'set-tee-MAH-nah' — hold the double-t; stress 'MAH'",
        ],
      },
      {
        it: "Sono favorevole, ma solo se ci sono regole chiare.",
        vi: "Tôi ủng hộ, nhưng chỉ khi có quy định rõ ràng.",
        en: "I'm in favor, but only if there are clear rules.",
        pronunciation_focus: [
          "favorevole → fa-vô-RÊ-vô-lê",
          "regole → RÊ-gô-lê",
        ],
        pronunciation_focus_en: [
          "favorevole → 'fah-voh-REH-voh-leh' — five syllables, stress 'REH'",
          "regole → 'REH-goh-leh' — hard 'g'; stress the first syllable",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong họp ở Ý, ngắt lời lịch sự được chấp nhận nhưng phải có 'đệm': 'Scusi, posso aggiungere una cosa?' (Xin lỗi, tôi thêm một ý được không?) hoặc 'Vorrei chiarire un punto.'. Khi không đồng ý, KHÔNG nói thẳng 'No, sbagliato'. Hãy công nhận trước rồi mới nêu ý: 'Capisco, tuttavia…'. Đề xuất bằng thể điều kiện ('potremmo', 'sarebbe meglio') nghe chuyên nghiệp hơn mệnh lệnh.",
    cultural_notes_en:
      "In Italian meetings, polite interruption is accepted but needs a cushion: 'Scusi, posso aggiungere una cosa?' (may I add something?) or 'Vorrei chiarire un punto.'. To disagree, never say a blunt 'No, sbagliato'. Acknowledge first, then state your view: 'Capisco, tuttavia…'. Proposing with the conditional ('potremmo', 'sarebbe meglio') sounds more professional than a command.",
    tip_advice_vi:
      "Ba câu 'cứu nguy' cho cuộc họp: (1) câu giờ — 'Mi faccia pensare un attimo.' (Cho tôi nghĩ một chút.); (2) làm rõ — 'Può ripetere, per favore?'; (3) phản biện mềm — 'Capisco, tuttavia vedo una criticità.'. Học thuộc để không bị 'đơ' khi bị hỏi bất ngờ.",
    tip_advice_en:
      "Three meeting-rescue lines: (1) buy time — 'Mi faccia pensare un attimo.' (let me think a second); (2) clarify — 'Può ripetere, per favore?'; (3) soft pushback — 'Capisco, tuttavia vedo una criticità.'. Memorize them so a surprise question never freezes you.",
    l1_notes_vi: [
      {
        mistake: "Mi sembra che richiede troppo tempo.",
        fix_vi:
          "Sau 'mi sembra che' / 'penso che' phải dùng giả định: 'richieda', không phải 'richiede'. Đây là dấu hiệu B2 — người chấm thi để ý ngay khi bạn dùng đúng congiuntivo.",
      },
      {
        mistake: "Voglio chiarire un punto.",
        fix_vi:
          "Trong họp, 'voglio' (tôi muốn) nghe hơi áp đặt. Dùng thể điều kiện 'vorrei' (tôi muốn — lịch sự). Tiếng Việt không có dạng này nên dễ quên; coi 'vorrei' là mặc định nơi công sở.",
      },
      {
        mistake: "Sono d'accordo, ma tu hai torto.",
        fix_vi:
          "Đừng nói thẳng 'bạn sai' (hai torto). Người Ý giữ thể diện: 'Capisco il suo punto, tuttavia…' (Tôi hiểu ý anh/chị, tuy nhiên…). Phản biện gắn vào ý kiến, không gắn vào con người.",
      },
    ],
    vocabulary: [
      { word: "chiarire", en: "to clarify", vi: "làm rõ", pos: "v.", pronunciation_vi: "ki-a-RI-rê", pronunciation_en: "kyah-REE-reh — 'chi' hard 'ky'" },
      { word: "la criticità", en: "issue / problem area", vi: "điểm rủi ro", pos: "n.f.", pronunciation_vi: "la cri-ti-chi-TÀ", pronunciation_en: "lah kree-tee-chee-TAH — final stress; softer than 'problema'" },
      { word: "la procedura", en: "procedure", vi: "quy trình", pos: "n.f.", pronunciation_vi: "la prô-chê-DU-ra", pronunciation_en: "lah proh-cheh-DOO-rah — 'ce' → 'cheh'" },
      { word: "potremmo", en: "we could", vi: "chúng ta có thể", pos: "v.", pronunciation_vi: "pô-TRÉM-mô", pronunciation_en: "poh-TREM-moh — conditional of 'potere'; hold double-m" },
      { word: "valutare", en: "to assess / evaluate", vi: "đánh giá", pos: "v.", pronunciation_vi: "va-lu-TA-rê", pronunciation_en: "vah-loo-TAH-reh — 'valutare i dati' = assess the data" },
      { word: "i dati", en: "data", vi: "dữ liệu", pos: "n.m.pl.", pronunciation_vi: "i DA-ti", pronunciation_en: "ee DAH-tee — plural; 'i dati mostrano' = the data show" },
      { word: "la prova", en: "trial / test", vi: "lần thử", pos: "n.f.", pronunciation_vi: "la PRÔ-va", pronunciation_en: "lah PROH-vah — 'una prova di una settimana' = a one-week trial" },
      { word: "l'obiettivo", en: "objective / goal", vi: "mục tiêu", pos: "n.m.", pronunciation_vi: "lô-bi-et-TI-vô", pronunciation_en: "loh-byet-TEE-voh — hold the double-t" },
      { word: "favorevole", en: "in favor", vi: "ủng hộ", pos: "agg.", pronunciation_vi: "fa-vô-RÊ-vô-lê", pronunciation_en: "fah-voh-REH-voh-leh — 'sono favorevole a…' = I'm in favor of…" },
    ],
    dialogue: [
      { speaker: "Responsabile", text: "La nuova procedura vi sembra chiara?", en: "Does the new procedure seem clear to you?", vi: "Quy trình mới các bạn thấy có rõ không?" },
      { speaker: "Mai", text: "In generale sì, tuttavia vedo una criticità nei tempi.", en: "Overall yes, however I see a problem with the timing.", vi: "Nhìn chung là rõ, tuy nhiên em thấy một rủi ro về thời gian." },
      { speaker: "Responsabile", text: "Quale criticità, di preciso?", en: "Which issue, exactly?", vi: "Cụ thể là rủi ro nào?" },
      { speaker: "Mai", text: "Il controllo richiede dieci minuti in più e può creare ritardi nel turno serale.", en: "The check takes ten extra minutes and can cause delays in the evening shift.", vi: "Khâu kiểm tra mất thêm mười phút và có thể gây trễ ca tối." },
      { speaker: "Responsabile", text: "Che soluzione propone?", en: "What solution do you propose?", vi: "Chị đề xuất giải pháp gì?" },
      { speaker: "Mai", text: "Potremmo fare una prova di una settimana e poi valutare i dati.", en: "We could run a one-week trial and then assess the data.", vi: "Chúng ta có thể thử một tuần rồi đánh giá dữ liệu." },
    ],
    exercises: [
      { type: "fill-blank", question: "___ chiarire un punto, se posso. (lịch sự, từ 'volere')", answer: "Vorrei", hint_vi: "thể điều kiện của 'volere' — lịch sự hơn 'voglio'", hint_en: "the conditional of 'volere' — politer than 'voglio'" },
      { type: "matching", pairs: [["la criticità", "điểm rủi ro (issue)"], ["valutare", "đánh giá (to assess)"], ["potremmo", "chúng ta có thể (we could)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Nhìn chung tôi đồng ý, nhưng chúng ta có thể thử một tuần rồi đánh giá dữ liệu.", english: "Overall I agree, but we could run a one-week trial and then assess the data.", italian: "In generale sono d'accordo, ma potremmo fare una prova di una settimana e poi valutare i dati." },
    ],
  },

  // ── 3. Summarizing the news (society) ───────────────────────────────────────
  {
    id: "italian_society_news_summary",
    level: "B2",
    category: "society",
    title_vi: "Tóm tắt và bình luận tin tức",
    title_en: "Summarizing and commenting on the news",
    sentences: [
      {
        it: "L'articolo sostiene che i prezzi sono aumentati del dieci per cento.",
        vi: "Bài báo cho rằng giá đã tăng mười phần trăm.",
        en: "The article claims that prices have risen by ten percent.",
        pronunciation_focus: [
          "articolo → ar-TI-cô-lô",
          "aumentati → au-men-TA-ti",
        ],
        pronunciation_focus_en: [
          "articolo → 'ar-TEE-koh-loh' — stress 'TEE'; hard 'c' before o",
          "aumentati → 'ow-men-TAH-tee' — 'au' is one glide 'ow'",
        ],
      },
      {
        it: "Secondo i dati, la disoccupazione è in calo.",
        vi: "Theo số liệu, tỉ lệ thất nghiệp đang giảm.",
        en: "According to the data, unemployment is falling.",
        pronunciation_focus: [
          "disoccupazione → di-zôc-cu-pa-DZI-ô-nê",
          "calo → CA-lô",
        ],
        pronunciation_focus_en: [
          "disoccupazione → 'dee-zok-koo-pah-TSYOH-neh' — hold double-c; '-zione' → 'TSYOH-neh'",
          "calo → 'KAH-loh' — 'in calo' = falling/declining",
        ],
      },
      {
        it: "La riforma riguarda soprattutto il settore sanitario.",
        vi: "Cuộc cải cách chủ yếu liên quan đến ngành y tế.",
        en: "The reform mainly concerns the healthcare sector.",
        pronunciation_focus: [
          "riforma → ri-FOR-ma",
          "settore → xet-TÔ-rê",
        ],
        pronunciation_focus_en: [
          "riforma → 'ree-FOR-mah' — stress 'FOR'",
          "settore → 'set-TOH-reh' — hold the double-t",
        ],
      },
      {
        it: "Di conseguenza, molte famiglie dovranno cambiare abitudini.",
        vi: "Do đó, nhiều gia đình sẽ phải thay đổi thói quen.",
        en: "Consequently, many families will have to change habits.",
        pronunciation_focus: [
          "conseguenza → côn-xê-GUEN-tsa",
          "abitudini → a-bi-TU-di-ni",
        ],
        pronunciation_focus_en: [
          "conseguenza → 'kon-seh-GWEN-tsah' — 'gue' is 'gweh'; 'z' → 'ts'",
          "abitudini → 'ah-bee-TOO-dee-nee' — stress 'TOO'",
        ],
      },
      {
        it: "In sintesi, la situazione resta incerta.",
        vi: "Tóm lại, tình hình vẫn còn bất định.",
        en: "In short, the situation remains uncertain.",
        pronunciation_focus: [
          "sintesi → SIN-tê-zi",
          "incerta → in-CHER-ta",
        ],
        pronunciation_focus_en: [
          "sintesi → 'SEEN-teh-zee' — stress first syllable; 'in sintesi' = in short",
          "incerta → 'een-CHER-tah' — 'ce' is 'cheh', here 'cher'",
        ],
      },
    ],
    cultural_notes_vi:
      "Tóm tắt tin ở B2 cần tách BÀI BÁO NÓI GÌ khỏi BẠN NGHĨ GÌ. Dùng động từ tường thuật: 'L'articolo sostiene/afferma/riporta che…' (Bài báo cho rằng/khẳng định/đưa tin rằng…). Khi nêu số liệu, dùng 'secondo i dati / secondo la fonte' (theo số liệu / theo nguồn). Chỉ sau đó mới nêu ý kiến cá nhân: 'Personalmente, ritengo che…'.",
    cultural_notes_en:
      "A B2 news summary separates WHAT THE ARTICLE SAYS from WHAT YOU THINK. Use reporting verbs: 'L'articolo sostiene/afferma/riporta che…' (the article claims/states/reports that…). For figures, use 'secondo i dati / secondo la fonte' (according to the data / source). Only then give your view: 'Personalmente, ritengo che…'.",
    tip_advice_vi:
      "Khung 5 dòng tóm tắt tin: (1) chủ đề — 'L'articolo parla di…'; (2) luận điểm chính — 'sostiene che…'; (3) số liệu — 'secondo i dati…'; (4) hệ quả — 'di conseguenza…'; (5) kết — 'in sintesi…'. Đây cũng là dàn ý đạt điểm trong phần thi nói CILS/CELI B2.",
    tip_advice_en:
      "A 5-line news-summary frame: (1) topic — 'L'articolo parla di…'; (2) main claim — 'sostiene che…'; (3) figures — 'secondo i dati…'; (4) consequence — 'di conseguenza…'; (5) wrap-up — 'in sintesi…'. This is also a scoring outline for the CILS/CELI B2 speaking task.",
    l1_notes_vi: [
      {
        mistake: "L'articolo dice i prezzi sono aumentati.",
        fix_vi:
          "Mệnh đề tường thuật cần 'che': 'L'articolo dice CHE i prezzi sono aumentati.'. Tiếng Việt bỏ liên từ ('bài báo nói giá tăng'), nên người học hay quên 'che'.",
      },
      {
        mistake: "aumentato del 10 per cento → 'aumentato di 10 per cento'",
        fix_vi:
          "Tỉ lệ phần trăm thay đổi dùng 'del/dell'': 'è aumentato DEL dieci per cento'. Còn 'in aumento / in calo' để nói xu hướng (đang tăng / đang giảm).",
      },
      {
        mistake: "la sistema sanitaria",
        fix_vi:
          "'il sistema' là GIỐNG ĐỰC dù kết thúc bằng -ma (gốc Hy Lạp): 'il sistema sanitario'. Tương tự: 'il problema', 'il tema', 'il programma'. Đừng theo phản xạ -a = giống cái.",
      },
    ],
    vocabulary: [
      { word: "sostenere", en: "to claim / argue", vi: "cho rằng", pos: "v.", pronunciation_vi: "xôs-tê-NÊ-rê", pronunciation_en: "sos-teh-NEH-reh — reporting verb: 'sostiene che…'" },
      { word: "la fonte", en: "source", vi: "nguồn", pos: "n.f.", pronunciation_vi: "la FON-tê", pronunciation_en: "lah FON-teh — 'secondo la fonte' = according to the source" },
      { word: "l'aumento", en: "increase", vi: "sự tăng", pos: "n.m.", pronunciation_vi: "lau-MEN-tô", pronunciation_en: "low-MEN-toh — opposite of 'la riduzione'" },
      { word: "la riduzione", en: "reduction", vi: "sự giảm", pos: "n.f.", pronunciation_vi: "la ri-du-DZI-ô-nê", pronunciation_en: "lah ree-doo-TSYOH-neh — '-zione' → 'TSYOH-neh'" },
      { word: "la riforma", en: "reform", vi: "cải cách", pos: "n.f.", pronunciation_vi: "la ri-FOR-ma", pronunciation_en: "lah ree-FOR-mah — common news word" },
      { word: "il settore", en: "sector", vi: "ngành / lĩnh vực", pos: "n.m.", pronunciation_vi: "il xet-TÔ-rê", pronunciation_en: "eel set-TOH-reh — 'il settore sanitario' = healthcare sector" },
      { word: "la tendenza", en: "trend", vi: "xu hướng", pos: "n.f.", pronunciation_vi: "la ten-DEN-tsa", pronunciation_en: "lah ten-DEN-tsah — 'z' → 'ts'; 'una tendenza chiara' = a clear trend" },
      { word: "in sintesi", en: "in short", vi: "tóm lại", pos: "espr.", pronunciation_vi: "in SIN-tê-zi", pronunciation_en: "een SEEN-teh-zee — wraps up a summary" },
      { word: "incerto", en: "uncertain", vi: "bất định", pos: "agg.", pronunciation_vi: "in-CHER-tô", pronunciation_en: "een-CHER-toh — 'ce' → 'cher'; agrees: incerta/incerti" },
    ],
    dialogue: [
      { speaker: "A", text: "Hai letto l'articolo sull'aumento dei prezzi?", en: "Did you read the article on the price increase?", vi: "Bạn đã đọc bài báo về việc tăng giá chưa?" },
      { speaker: "B", text: "Sì. Sostiene che i prezzi sono aumentati del dieci per cento in un anno.", en: "Yes. It claims prices rose ten percent in a year.", vi: "Rồi. Bài báo cho rằng giá đã tăng mười phần trăm trong một năm." },
      { speaker: "A", text: "E qual è la conseguenza, secondo l'articolo?", en: "And what's the consequence, according to the article?", vi: "Và hệ quả là gì, theo bài báo?" },
      { speaker: "B", text: "Di conseguenza molte famiglie dovranno tagliare le spese. In sintesi, la situazione resta incerta.", en: "Consequently many families will have to cut spending. In short, the situation stays uncertain.", vi: "Do đó nhiều gia đình sẽ phải cắt giảm chi tiêu. Tóm lại, tình hình vẫn bất định." },
    ],
    exercises: [
      { type: "fill-blank", question: "L'articolo sostiene ___ i prezzi sono aumentati. (liên từ tường thuật)", answer: "che", hint_vi: "mệnh đề tường thuật cần 'che', đừng bỏ", hint_en: "the reported clause needs 'che' — don't drop it" },
      { type: "matching", pairs: [["sostenere", "cho rằng (to claim)"], ["la fonte", "nguồn (source)"], ["in sintesi", "tóm lại (in short)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Theo số liệu, tỉ lệ thất nghiệp đang giảm; do đó tình hình có vẻ khả quan hơn.", english: "According to the data, unemployment is falling; consequently the situation seems more positive.", italian: "Secondo i dati, la disoccupazione è in calo; di conseguenza la situazione sembra più positiva." },
    ],
  },

  // ── 4. Polite negotiation (work) ────────────────────────────────────────────
  {
    id: "italian_work_negotiation",
    level: "B2",
    category: "work",
    title_vi: "Thương lượng lịch sự",
    title_en: "Negotiating politely",
    sentences: [
      {
        it: "Sarebbe possibile valutare un orario più flessibile?",
        vi: "Liệu có thể cân nhắc một lịch làm linh hoạt hơn không?",
        en: "Would it be possible to consider more flexible hours?",
        pronunciation_focus: [
          "sarebbe → xa-RÉB-bê",
          "flessibile → fles-XI-bi-lê",
        ],
        pronunciation_focus_en: [
          "sarebbe → 'sah-REB-beh' — conditional 'would be'; hold the double-b",
          "flessibile → 'fles-SEE-bee-leh' — hold the double-s; stress 'SEE'",
        ],
      },
      {
        it: "Capisco la sua posizione, ma vorrei proporre un compromesso.",
        vi: "Tôi hiểu lập trường của anh/chị, nhưng tôi muốn đề xuất một thỏa hiệp.",
        en: "I understand your position, but I'd like to propose a compromise.",
        pronunciation_focus: [
          "posizione → pô-zi-DZI-ô-nê",
          "compromesso → côm-prô-MÉS-sô",
        ],
        pronunciation_focus_en: [
          "posizione → 'poh-zee-TSYOH-neh' — '-zione' → 'TSYOH-neh'",
          "compromesso → 'kom-proh-MES-soh' — hold the double-s",
        ],
      },
      {
        it: "Se accettaste questa condizione, potremmo firmare subito.",
        vi: "Nếu anh/chị chấp nhận điều kiện này, chúng ta có thể ký ngay.",
        en: "If you accepted this condition, we could sign right away.",
        pronunciation_focus: [
          "accettaste → ac-chet-TAS-tê",
          "potremmo → pô-TRÉM-mô",
        ],
        pronunciation_focus_en: [
          "accettaste → 'ach-chet-TAHS-teh' — subjunctive; 'cc' before e = 'ch', then double-t",
          "potremmo → 'poh-TREM-moh' — conditional pairs with the subjunctive 'if' clause",
        ],
      },
      {
        it: "C'è un margine di trattativa sul prezzo?",
        vi: "Có khoảng thương lượng nào về giá không?",
        en: "Is there room for negotiation on the price?",
        pronunciation_focus: [
          "margine → MAR-gi-nê",
          "trattativa → trat-ta-TI-va",
        ],
        pronunciation_focus_en: [
          "margine → 'MAR-jee-neh' — 'gi' is a soft 'j'; stress first syllable",
          "trattativa → 'trat-tah-TEE-vah' — hold the double-t; stress 'TEE'",
        ],
      },
      {
        it: "Cerchiamo una soluzione che vada bene per entrambi.",
        vi: "Hãy tìm một giải pháp phù hợp cho cả hai bên.",
        en: "Let's find a solution that works for both sides.",
        pronunciation_focus: [
          "cerchiamo → cher-KI-a-mô",
          "entrambi → en-TRAM-bi",
        ],
        pronunciation_focus_en: [
          "cerchiamo → 'cher-KYAH-moh' — 'ce' → 'cher', 'chi' → 'ky'",
          "entrambi → 'en-TRAHM-bee' — 'che vada' = subjunctive after an indefinite 'una soluzione'",
        ],
      },
    ],
    cultural_notes_vi:
      "Thương lượng kiểu Ý đề cao quan hệ và thể diện. Mở bằng câu hỏi điều kiện gián tiếp: 'Sarebbe possibile…?' nghe mềm hơn 'Può…?'. Luôn công nhận phía bên kia ('Capisco la sua posizione') trước khi đưa yêu cầu. Từ khóa là 'compromesso' (thỏa hiệp) và 'margine' (khoảng linh động) — người Ý hiếm khi nói 'không' dứt khoát; họ để ngỏ chỗ điều chỉnh.",
    cultural_notes_en:
      "Italian negotiation values relationship and face. Open with an indirect conditional question: 'Sarebbe possibile…?' sounds softer than 'Può…?'. Always acknowledge the other side ('Capisco la sua posizione') before your ask. Key words are 'compromesso' (compromise) and 'margine' (room to move) — Italians rarely give a flat 'no'; they leave space to adjust.",
    tip_advice_vi:
      "Công thức thương lượng: công nhận + thể điều kiện + thỏa hiệp. Ví dụ: 'Capisco… (công nhận). Sarebbe possibile…? (đề nghị mềm). Se accettaste…, potremmo… (trao đổi điều kiện)'. Cặp câu điều kiện loại 2: 'Se + congiuntivo imperfetto (accettaste), conditional (potremmo)'. Học cặp này để nghe chuyên nghiệp.",
    tip_advice_en:
      "Negotiation formula: acknowledge + conditional + compromise. E.g. 'Capisco… (acknowledge). Sarebbe possibile…? (soft ask). Se accettaste…, potremmo… (trade a condition)'. The type-2 conditional pairs 'Se + imperfect subjunctive (accettaste)' with the present conditional (potremmo). Drill this pair to sound professional.",
    l1_notes_vi: [
      {
        mistake: "Voglio uno sconto.",
        fix_vi:
          "'Voglio' (tôi muốn) trong thương lượng nghe thô. Dùng câu hỏi điều kiện: 'Sarebbe possibile uno sconto?' hoặc 'C'è un margine sul prezzo?'. Hỏi gián tiếp giữ thể diện cho cả hai.",
      },
      {
        mistake: "Se accetti, potremmo firmare. (trộn thì)",
        fix_vi:
          "Câu điều kiện loại 2 phải khớp: 'Se accettaste (congiuntivo imperfetto), potremmo (condizionale)'. Đừng trộn hiện tại 'accetti' với điều kiện 'potremmo'. Tiếng Việt không chia thì nên rất dễ lệch.",
      },
      {
        mistake: "una soluzione che va bene",
        fix_vi:
          "Sau danh từ chưa xác định ('una soluzione') mệnh đề quan hệ thường dùng giả định: 'che VADA bene'. Khi đã xác định ('la soluzione che va bene') thì dùng chỉ định. Khác biệt tinh tế nhưng là dấu hiệu B2.",
      },
    ],
    vocabulary: [
      { word: "sarebbe possibile", en: "would it be possible", vi: "liệu có thể", pos: "espr.", pronunciation_vi: "xa-RÉB-bê pôs-XI-bi-lê", pronunciation_en: "sah-REB-beh pos-SEE-bee-leh — the polite opener for a request" },
      { word: "il compromesso", en: "compromise", vi: "sự thỏa hiệp", pos: "n.m.", pronunciation_vi: "il côm-prô-MÉS-sô", pronunciation_en: "eel kom-proh-MES-soh — 'trovare un compromesso' = reach a compromise" },
      { word: "la condizione", en: "condition / term", vi: "điều kiện", pos: "n.f.", pronunciation_vi: "la côn-di-DZI-ô-nê", pronunciation_en: "lah kon-dee-TSYOH-neh — 'a una condizione' = on one condition" },
      { word: "il margine", en: "margin / room to move", vi: "khoảng linh động", pos: "n.m.", pronunciation_vi: "il MAR-gi-nê", pronunciation_en: "eel MAR-jee-neh — 'margine di trattativa' = negotiating room" },
      { word: "la trattativa", en: "negotiation", vi: "cuộc thương lượng", pos: "n.f.", pronunciation_vi: "la trat-ta-TI-va", pronunciation_en: "lah trat-tah-TEE-vah — hold the double-t" },
      { word: "la proposta", en: "proposal", vi: "đề xuất", pos: "n.f.", pronunciation_vi: "la prô-PÔS-ta", pronunciation_en: "lah proh-POS-tah — 'fare una proposta' = make a proposal" },
      { word: "l'accordo", en: "agreement / deal", vi: "thỏa thuận", pos: "n.m.", pronunciation_vi: "lac-COR-đô", pronunciation_en: "lak-KOR-doh — hold the double-c; 'raggiungere un accordo' = reach a deal" },
      { word: "entrambi", en: "both", vi: "cả hai", pos: "pron.", pronunciation_vi: "en-TRAM-bi", pronunciation_en: "en-TRAHM-bee — 'per entrambi' = for both sides" },
      { word: "valutare", en: "to consider / weigh", vi: "cân nhắc", pos: "v.", pronunciation_vi: "va-lu-TA-rê", pronunciation_en: "vah-loo-TAH-reh — softer than 'decidere' in a negotiation" },
    ],
    dialogue: [
      { speaker: "Cliente", text: "Il prezzo è un po' alto. C'è un margine di trattativa?", en: "The price is a bit high. Is there room to negotiate?", vi: "Giá hơi cao. Có khoảng thương lượng không ạ?" },
      { speaker: "Fornitore", text: "Capisco. Sarebbe possibile uno sconto se ordinaste una quantità maggiore.", en: "I understand. A discount would be possible if you ordered a larger quantity.", vi: "Tôi hiểu. Có thể giảm giá nếu anh/chị đặt số lượng lớn hơn." },
      { speaker: "Cliente", text: "Se accettaste la consegna in due volte, potremmo aumentare l'ordine.", en: "If you accepted delivery in two batches, we could increase the order.", vi: "Nếu bên anh chấp nhận giao thành hai lần, chúng tôi có thể tăng đơn hàng." },
      { speaker: "Fornitore", text: "Mi sembra un buon compromesso. Cerchiamo una soluzione che vada bene per entrambi.", en: "That sounds like a good compromise. Let's find a solution that works for both.", vi: "Tôi thấy đó là một thỏa hiệp tốt. Hãy tìm giải pháp phù hợp cho cả hai." },
    ],
    exercises: [
      { type: "fill-blank", question: "Se ___ questa condizione, potremmo firmare. (congiuntivo imperfetto của 'accettare')", answer: "accettaste", hint_vi: "câu điều kiện loại 2: Se + giả định quá khứ + điều kiện", hint_en: "type-2 conditional: Se + imperfect subjunctive + conditional" },
      { type: "matching", pairs: [["il compromesso", "thỏa hiệp (compromise)"], ["il margine", "khoảng linh động (room to move)"], ["l'accordo", "thỏa thuận (agreement)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Tôi hiểu lập trường của anh, nhưng liệu có thể cân nhắc một thỏa hiệp phù hợp cho cả hai không?", english: "I understand your position, but would it be possible to consider a compromise that works for both?", italian: "Capisco la sua posizione, ma sarebbe possibile valutare un compromesso che vada bene per entrambi?" },
    ],
  },

  // ── 5. Formal complaint email (life_admin) ──────────────────────────────────
  {
    id: "italian_life_admin_formal_complaint",
    level: "B2",
    category: "life_admin",
    title_vi: "Email khiếu nại trang trọng",
    title_en: "Writing a formal complaint email",
    sentences: [
      {
        it: "Gentili Signori, vi scrivo per segnalare un problema.",
        vi: "Kính gửi Quý vị, tôi viết thư để báo một vấn đề.",
        en: "Dear Sir/Madam, I'm writing to report a problem.",
        pronunciation_focus: [
          "Gentili → gen-TI-li",
          "segnalare → xê-nha-LA-rê",
        ],
        pronunciation_focus_en: [
          "Gentili → 'jen-TEE-lee' — 'ge' is a soft 'j'; standard formal salutation",
          "segnalare → 'seh-nyah-LAH-reh' — 'gn' is 'ny' as in canyon",
        ],
      },
      {
        it: "L'importo indicato non corrisponde al preventivo.",
        vi: "Số tiền ghi trên không khớp với báo giá.",
        en: "The amount stated doesn't match the quote.",
        pronunciation_focus: [
          "importo → im-POR-tô",
          "corrisponde → côr-ri-XPON-dê",
        ],
        pronunciation_focus_en: [
          "importo → 'eem-POR-toh' — stress 'POR'; '-o' fully said",
          "corrisponde → 'kor-ree-SPON-deh' — hold the double-r",
        ],
      },
      {
        it: "Vi chiedo cortesemente di verificare la fattura.",
        vi: "Tôi kính nhờ Quý vị vui lòng kiểm tra hóa đơn.",
        en: "I kindly ask you to check the invoice.",
        pronunciation_focus: [
          "cortesemente → cor-tê-zê-MEN-tê",
          "fattura → fat-TU-ra",
        ],
        pronunciation_focus_en: [
          "cortesemente → 'kor-teh-zeh-MEN-teh' — s→'z' between vowels; stress 'MEN'",
          "fattura → 'fat-TOO-rah' — hold the double-t; means 'invoice'",
        ],
      },
      {
        it: "Resto in attesa di un vostro riscontro.",
        vi: "Tôi mong nhận được phản hồi của Quý vị.",
        en: "I look forward to your reply.",
        pronunciation_focus: [
          "attesa → at-TÊ-za",
          "riscontro → ri-XCON-trô",
        ],
        pronunciation_focus_en: [
          "attesa → 'at-TEH-zah' — hold the double-t; 'in attesa di' = awaiting",
          "riscontro → 'ree-SKON-troh' — formal word for 'reply/response'",
        ],
      },
      {
        it: "Cordiali saluti, Mai Nguyen.",
        vi: "Trân trọng, Mai Nguyễn.",
        en: "Kind regards, Mai Nguyen.",
        pronunciation_focus: [
          "Cordiali → cor-DI-a-li",
          "saluti → xa-LU-ti",
        ],
        pronunciation_focus_en: [
          "Cordiali → 'kor-DYAH-lee' — standard formal sign-off",
          "saluti → 'sah-LOO-tee' — 'cordiali saluti' = kind regards",
        ],
      },
    ],
    cultural_notes_vi:
      "Email trang trọng Ý có khung cố định: mở 'Gentili Signori,' (hoặc 'Gentile Dottoressa,' nếu biết tên) → lý do 'Vi scrivo per…' → sự việc → yêu cầu lịch sự 'Vi chiedo cortesemente di…' → 'Resto in attesa di un vostro riscontro.' → 'Cordiali saluti,' + tên. Dùng 'Lei/Voi' (ngôi trang trọng), KHÔNG dùng 'tu'. Khiếu nại nêu SỰ VIỆC + YÊU CẦU, đừng trút cảm xúc.",
    cultural_notes_en:
      "A formal Italian email follows a fixed frame: open 'Gentili Signori,' (or 'Gentile Dottoressa,' if you know the name) → reason 'Vi scrivo per…' → the facts → polite request 'Vi chiedo cortesemente di…' → 'Resto in attesa di un vostro riscontro.' → 'Cordiali saluti,' + name. Use formal 'Lei/Voi', never 'tu'. A complaint states FACTS + a REQUEST — don't vent emotion.",
    tip_advice_vi:
      "Đừng dịch thẳng văn nói. 'Voglio una risposta' → 'Vi chiedo cortesemente un riscontro'. 'È colpa vostra' → 'Credo ci sia stato un errore'. Khiếu nại mạnh nhưng lịch sự: nêu fact (số hóa đơn, ngày, số tiền) + yêu cầu cụ thể (kiểm tra / hoàn tiền / gửi bản mới). Văn phong danh từ hóa nghe trang trọng: 'la verifica', 'la modifica', 'il rimborso'.",
    tip_advice_en:
      "Don't translate speech directly. 'Voglio una risposta' → 'Vi chiedo cortesemente un riscontro'. 'È colpa vostra' → 'Credo ci sia stato un errore'. A complaint is firm but polite: state facts (invoice number, date, amount) + a concrete request (check / refund / send a new copy). A nominal style sounds formal: 'la verifica', 'la modifica', 'il rimborso'.",
    l1_notes_vi: [
      {
        mistake: "Voglio risposta subito.",
        fix_vi:
          "Trong văn viết trang trọng dùng thể điều kiện + danh từ hóa: 'Vi chiedo cortesemente un riscontro al più presto'. 'Voglio' và thiếu mạo từ ('risposta') nghe thô và sai ngữ pháp.",
      },
      {
        mistake: "Ho mandato email ieri.",
        fix_vi:
          "Danh từ đếm được cần mạo từ: 'Ho mandato UN'email ieri'. ('un'email' với dấu lược vì 'email' bắt đầu bằng nguyên âm.) Tiếng Việt bỏ mạo từ nên đây là lỗi kinh điển.",
      },
      {
        mistake: "Caro Signore (khi không quen biết)",
        fix_vi:
          "'Caro' (thân mến) chỉ dùng với người quen. Trong email khiếu nại/công việc dùng 'Gentile' (kính) hoặc 'Gentili Signori'. Kết bằng 'Cordiali saluti', không phải 'Ciao' hay 'Baci'.",
      },
    ],
    vocabulary: [
      { word: "Gentili Signori", en: "Dear Sir/Madam (plural)", vi: "Kính gửi Quý vị", pos: "espr.", pronunciation_vi: "gen-TI-li xi-NHÔ-ri", pronunciation_en: "jen-TEE-lee see-NYOH-ree — formal opener; 'gn' → 'ny'" },
      { word: "segnalare", en: "to report / flag", vi: "báo / nêu", pos: "v.", pronunciation_vi: "xê-nha-LA-rê", pronunciation_en: "seh-nyah-LAH-reh — neutral, formal verb for raising an issue" },
      { word: "l'importo", en: "amount / sum", vi: "số tiền", pos: "n.m.", pronunciation_vi: "lim-POR-tô", pronunciation_en: "leem-POR-toh — 'l'importo indicato' = the stated amount" },
      { word: "il preventivo", en: "quote / estimate", vi: "báo giá", pos: "n.m.", pronunciation_vi: "il prê-ven-TI-vô", pronunciation_en: "eel preh-ven-TEE-voh — vs 'la fattura' (the invoice)" },
      { word: "la fattura", en: "invoice", vi: "hóa đơn", pos: "n.f.", pronunciation_vi: "la fat-TU-ra", pronunciation_en: "lah fat-TOO-rah — hold the double-t" },
      { word: "cortesemente", en: "kindly / courteously", vi: "vui lòng", pos: "avv.", pronunciation_vi: "cor-tê-zê-MEN-tê", pronunciation_en: "kor-teh-zeh-MEN-teh — 'vi chiedo cortesemente di…' softens a request" },
      { word: "il riscontro", en: "reply / feedback", vi: "phản hồi", pos: "n.m.", pronunciation_vi: "il ri-XCON-trô", pronunciation_en: "eel ree-SKON-troh — formal; 'in attesa di un riscontro'" },
      { word: "il rimborso", en: "refund", vi: "sự hoàn tiền", pos: "n.m.", pronunciation_vi: "il rim-BOR-zô", pronunciation_en: "eel reem-BOR-soh — 'chiedere il rimborso' = request a refund" },
      { word: "Cordiali saluti", en: "Kind regards", vi: "Trân trọng", pos: "espr.", pronunciation_vi: "cor-DI-a-li xa-LU-ti", pronunciation_en: "kor-DYAH-lee sah-LOO-tee — standard formal sign-off" },
    ],
    dialogue: [
      { speaker: "Email", text: "Gentili Signori, vi scrivo per segnalare un errore nella fattura n. 245.", en: "Dear Sir/Madam, I'm writing to report an error in invoice no. 245.", vi: "Kính gửi Quý vị, tôi viết để báo một lỗi trên hóa đơn số 245." },
      { speaker: "Email", text: "L'importo indicato è di 300 euro, ma il preventivo era di 250 euro.", en: "The stated amount is 300 euros, but the quote was 250 euros.", vi: "Số tiền ghi là 300 euro, nhưng báo giá là 250 euro." },
      { speaker: "Email", text: "Vi chiedo cortesemente di verificare e di inviarmi una fattura corretta.", en: "I kindly ask you to check and send me a corrected invoice.", vi: "Tôi kính nhờ Quý vị kiểm tra và gửi lại hóa đơn đã sửa." },
      { speaker: "Email", text: "Resto in attesa di un vostro riscontro. Cordiali saluti, Mai Nguyen.", en: "I look forward to your reply. Kind regards, Mai Nguyen.", vi: "Tôi mong nhận được phản hồi. Trân trọng, Mai Nguyễn." },
    ],
    exercises: [
      { type: "fill-blank", question: "Vi chiedo ___ di verificare la fattura. (trạng từ 'lịch sự')", answer: "cortesemente", hint_vi: "trạng từ làm mềm lời yêu cầu trong email trang trọng", hint_en: "the adverb that softens a request in a formal email" },
      { type: "matching", pairs: [["il preventivo", "báo giá (quote)"], ["la fattura", "hóa đơn (invoice)"], ["il riscontro", "phản hồi (reply)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Kính gửi Quý vị, tôi viết để báo rằng số tiền không khớp với báo giá; tôi kính nhờ kiểm tra hóa đơn.", english: "Dear Sir/Madam, I'm writing to report that the amount doesn't match the quote; I kindly ask you to check the invoice.", italian: "Gentili Signori, vi scrivo per segnalare che l'importo non corrisponde al preventivo; vi chiedo cortesemente di verificare la fattura." },
    ],
  },

  // ── 6. Conditional & subjunctive polish (expressions) ───────────────────────
  {
    id: "italian_expressions_conditional_subjunctive",
    level: "B2",
    category: "expressions",
    title_vi: "Trau chuốt: điều kiện và giả định",
    title_en: "Polish: conditional and subjunctive chunks",
    sentences: [
      {
        it: "Vorrei sapere se è ancora disponibile.",
        vi: "Tôi muốn biết nó còn không.",
        en: "I'd like to know if it's still available.",
        pronunciation_focus: [
          "vorrei → vôr-RÊi",
          "disponibile → di-xpô-NI-bi-lê",
        ],
        pronunciation_focus_en: [
          "vorrei → 'vor-RAY' — conditional softener; hold the double-r",
          "disponibile → 'dees-poh-NEE-bee-leh' — stress 'NEE'; every vowel said",
        ],
      },
      {
        it: "Penso che sia la scelta migliore.",
        vi: "Tôi nghĩ đó là lựa chọn tốt nhất.",
        en: "I think it's the best choice.",
        pronunciation_focus: [
          "scelta → XEL-ta",
          "migliore → mi-LY-ô-rê",
        ],
        pronunciation_focus_en: [
          "scelta → 'SHEL-tah' — 'sce' is 'sheh'; 'sia' = subjunctive after 'penso che'",
          "migliore → 'mee-LYOH-reh' — 'gli' is the soft 'ly' sound",
        ],
      },
      {
        it: "È importante che tutti rispettino le regole.",
        vi: "Điều quan trọng là mọi người tôn trọng quy định.",
        en: "It's important that everyone respects the rules.",
        pronunciation_focus: [
          "importante → im-pôr-TAN-tê",
          "rispettino → ri-xpet-TI-nô",
        ],
        pronunciation_focus_en: [
          "importante → 'eem-por-TAHN-teh' — stress 'TAHN'",
          "rispettino → 'rees-pet-TEE-noh' — subjunctive after 'è importante che'; hold double-t",
        ],
      },
      {
        it: "Dovremmo decidere insieme entro venerdì.",
        vi: "Chúng ta nên quyết định cùng nhau trước thứ Sáu.",
        en: "We should decide together by Friday.",
        pronunciation_focus: [
          "dovremmo → đô-VRÉM-mô",
          "decidere → đê-CI-đê-rê",
        ],
        pronunciation_focus_en: [
          "dovremmo → 'doh-VREM-moh' — conditional 'we should'; hold the double-m",
          "decidere → 'deh-CHEE-deh-reh' — 'ci' is 'chee'; stress 'CHEE'",
        ],
      },
      {
        it: "Magari potremmo riparlarne domani.",
        vi: "Hay là mai chúng ta nói lại chuyện này nhé.",
        en: "Maybe we could talk about it again tomorrow.",
        pronunciation_focus: [
          "magari → ma-GA-ri",
          "riparlarne → ri-par-LAR-nê",
        ],
        pronunciation_focus_en: [
          "magari → 'mah-GAH-ree' — 'maybe / I wish'; stress 'GAH'",
          "riparlarne → 'ree-par-LAR-neh' — '-ne' = 'about it', attached to the infinitive",
        ],
      },
    ],
    cultural_notes_vi:
      "Hai 'vũ khí' khiến tiếng Ý nghe trưởng thành: (1) ĐIỀU KIỆN (condizionale) để lịch sự và giả định — 'vorrei', 'potremmo', 'dovremmo', 'sarebbe'; (2) GIẢ ĐỊNH (congiuntivo) sau các cụm cảm xúc/ý kiến/cần thiết — 'penso che', 'è importante che', 'credo che', 'sembra che', 'benché'. Người Việt thường bỏ qua cả hai vì tiếng Việt không chia động từ — nhưng ở B2 chúng là yếu tố phân biệt 'biết tiếng' với 'nói trôi chảy'.",
    cultural_notes_en:
      "Two devices make Italian sound mature: (1) the CONDITIONAL for politeness and hypotheticals — 'vorrei', 'potremmo', 'dovremmo', 'sarebbe'; (2) the SUBJUNCTIVE after emotion/opinion/necessity triggers — 'penso che', 'è importante che', 'credo che', 'sembra che', 'benché'. Vietnamese speakers tend to skip both because Vietnamese doesn't conjugate — but at B2 they separate 'knows the language' from 'fluent'.",
    tip_advice_vi:
      "Học theo CỤM, đừng học bảng chia. Thuộc lòng vài 'mồi' kéo theo congiuntivo: 'Penso che SIA…', 'È importante che SIA…', 'Credo che ABBIA…', 'Benché SIA…'. Và vài cụm điều kiện: 'Vorrei…', 'Mi piacerebbe…', 'Potremmo…', 'Sarebbe meglio…'. Lắp nội dung vào khung có sẵn nhanh hơn nhiều so với chia từng động từ.",
    tip_advice_en:
      "Learn by CHUNK, not by conjugation table. Memorize a few subjunctive triggers: 'Penso che SIA…', 'È importante che SIA…', 'Credo che ABBIA…', 'Benché SIA…'. And a few conditional frames: 'Vorrei…', 'Mi piacerebbe…', 'Potremmo…', 'Sarebbe meglio…'. Slotting content into ready frames is far faster than conjugating each verb on the fly.",
    l1_notes_vi: [
      {
        mistake: "Penso che è la scelta migliore.",
        fix_vi:
          "Sau 'penso che' / 'credo che' luôn là giả định: 'Penso che SIA…'. Dùng 'è' (chỉ định) ở đây là lỗi B2 bị trừ điểm nhiều nhất. Mẹo: 'che' + ý kiến → 'sia/abbia'.",
      },
      {
        mistake: "Voglio sapere se è disponibile.",
        fix_vi:
          "'Voglio sapere' đúng ngữ pháp nhưng hơi cộc. Dùng điều kiện 'Vorrei sapere…' để lịch sự. Trong hỏi đáp dịch vụ/công việc, gần như luôn chọn 'vorrei' thay 'voglio'.",
      },
      {
        mistake: "Dobbiamo decidere → khi muốn nói 'nên'",
        fix_vi:
          "'Dobbiamo' = 'phải' (bắt buộc). Khi ý là 'nên' (gợi ý nhẹ) dùng điều kiện 'Dovremmo decidere'. Tiếng Việt 'nên/phải' khác nhau rõ — hãy ánh xạ: nên → dovremmo, phải → dobbiamo.",
      },
    ],
    vocabulary: [
      { word: "vorrei", en: "I would like", vi: "tôi muốn (lịch sự)", pos: "v.", pronunciation_vi: "vôr-RÊi", pronunciation_en: "vor-RAY — conditional of 'volere'; the everyday politeness verb" },
      { word: "potremmo", en: "we could", vi: "chúng ta có thể", pos: "v.", pronunciation_vi: "pô-TRÉM-mô", pronunciation_en: "poh-TREM-moh — conditional of 'potere'; soft suggestion" },
      { word: "dovremmo", en: "we should", vi: "chúng ta nên", pos: "v.", pronunciation_vi: "đô-VRÉM-mô", pronunciation_en: "doh-VREM-moh — conditional of 'dovere'; 'should', not 'must'" },
      { word: "sarebbe meglio", en: "it would be better", vi: "sẽ tốt hơn nếu", pos: "espr.", pronunciation_vi: "xa-RÉB-bê MÊ-lyô", pronunciation_en: "sah-REB-beh MEH-lyoh — soft advice frame" },
      { word: "penso che sia", en: "I think it is", vi: "tôi nghĩ rằng", pos: "espr.", pronunciation_vi: "PEN-xô kê XI-a", pronunciation_en: "PEN-soh keh SEE-ah — the model subjunctive chunk; memorize whole" },
      { word: "è importante che", en: "it's important that", vi: "điều quan trọng là", pos: "espr.", pronunciation_vi: "ê im-pôr-TAN-tê kê", pronunciation_en: "eh eem-por-TAHN-teh keh — triggers the subjunctive" },
      { word: "benché", en: "although", vi: "mặc dù", pos: "cong.", pronunciation_vi: "ben-CHÊ", pronunciation_en: "ben-KEH — final stress; always takes the subjunctive" },
      { word: "magari", en: "maybe / I wish", vi: "hay là / ước gì", pos: "avv.", pronunciation_vi: "ma-GA-ri", pronunciation_en: "mah-GAH-ree — versatile: 'maybe' or wistful 'if only'" },
      { word: "la scelta", en: "choice", vi: "lựa chọn", pos: "n.f.", pronunciation_vi: "la XEL-ta", pronunciation_en: "lah SHEL-tah — 'sce' is 'sheh'; 'la scelta migliore' = the best choice" },
    ],
    dialogue: [
      { speaker: "A", text: "Vorrei sapere se possiamo cambiare la data della riunione.", en: "I'd like to know if we can change the meeting date.", vi: "Tôi muốn biết liệu chúng ta có đổi ngày họp được không." },
      { speaker: "B", text: "Penso che sia possibile, ma è importante che lo decidiamo oggi.", en: "I think it's possible, but it's important that we decide it today.", vi: "Tôi nghĩ là được, nhưng điều quan trọng là chúng ta quyết hôm nay." },
      { speaker: "A", text: "Dovremmo avvisare tutti entro stasera, allora.", en: "We should let everyone know by tonight, then.", vi: "Vậy chúng ta nên báo mọi người trước tối nay." },
      { speaker: "B", text: "Sì. Magari potremmo proporre venerdì mattina.", en: "Yes. Maybe we could suggest Friday morning.", vi: "Ừ. Hay là chúng ta đề xuất sáng thứ Sáu." },
    ],
    exercises: [
      { type: "fill-blank", question: "Penso che ___ la scelta migliore. (giả định của 'essere')", answer: "sia", hint_vi: "sau 'penso che' dùng 'sia', không dùng 'è'", hint_en: "after 'penso che' use 'sia', not 'è'" },
      { type: "matching", pairs: [["dovremmo", "chúng ta nên (we should)"], ["benché", "mặc dù (although)"], ["magari", "hay là (maybe)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Tôi nghĩ đó là lựa chọn tốt nhất, nhưng chúng ta nên quyết định cùng nhau trước thứ Sáu.", english: "I think it's the best choice, but we should decide together by Friday.", italian: "Penso che sia la scelta migliore, ma dovremmo decidere insieme entro venerdì." },
    ],
  },
];

export default lessons;
