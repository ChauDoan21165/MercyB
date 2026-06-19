// B6 — Healthcare & Emergency Italian (Vietnamese → Italian study track).
// Converted from .local/vietnamese-italian-study/B6-healthcare-emergency-italian.md.
//
// NOTE: There is no shared Italian lesson type yet (src/languages/italian has no
// lessons.ts), so this file is self-contained: it declares an inline ItalianLesson
// type that mirrors the French `FrenchLesson` shape in
// src/languages/french/lessons.ts (and matches the sibling A4 extra file). When
// the Italian registry lands, swap the local types for a shared import.
//
// Field convention (inherited from the French lessons): the `en` field on a
// sentence holds the TARGET-LANGUAGE text (here: Italian), and `vi` holds the
// Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation
// + grammar notes (incl. the common Vietnamese-speaker mistake = L1 note + a
// correction drill); `pronunciation_focus_en` is the English-speaker companion,
// same order.

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
  /** Italian word/phrase (with article where it teaches gender). */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun (m)", "noun (f)", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type ItalianDialogueLine = {
  speaker: string;
  /** Italian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, checklist, rubric) can vary.
export type ItalianExercise = Record<string, any>;

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
    id: "italian_healthcare_emergency_b6",
    level: "B1",
    category: "health",
    title_vi: "Tiếng Ý cho y tế và cấp cứu",
    title_en: "Healthcare and emergency Italian",
    sentences: [
      // ── Emergency first ────────────────────────────────────────────────
      {
        en: "Ho bisogno di aiuto subito.",
        vi: "Tôi cần giúp ngay.",
        pronunciation_focus: [
          "o bee-ZON-yo dee a-YOO-to SOO-bee-to — `avere bisogno` BẮT BUỘC có `di`.",
          "Lỗi người Việt: nói `ho bisogno aiuto` (thiếu `di`).",
          "Drill: `Ho bisogno di aiuto subito.`",
        ],
        pronunciation_focus_en: [
          "o bee-ZON-yo dee a-YOO-to SOO-bee-to — `avere bisogno` REQUIRES `di`.",
          "VN-speaker trap: saying `ho bisogno aiuto` (dropping `di`).",
          "Drill: `Ho bisogno di aiuto subito.`",
        ],
      },
      {
        en: "Chiami un'ambulanza, per favore.",
        vi: "Làm ơn gọi xe cấp cứu.",
        pronunciation_focus: [
          "KYA-mee un am-boo-LAN-tsa — `chiami` là mệnh lệnh lịch sự (formal).",
          "Lỗi người Việt: chỉ hét `ambulanza`. Phải có động từ: `Chiami…`.",
          "Drill: `Chiami un'ambulanza, per favore.`",
        ],
        pronunciation_focus_en: [
          "KYA-mee un am-boo-LAN-tsa — `chiami` is the polite/formal command.",
          "VN-speaker trap: shouting only `ambulanza`. You need the verb: `Chiami…`.",
          "Drill: `Chiami un'ambulanza, per favore.`",
        ],
      },
      {
        en: "Non riesco a respirare bene.",
        vi: "Tôi không thở tốt được.",
        pronunciation_focus: [
          "non RYES-ko a res-pee-RA-re — `riuscire a` + động từ nguyên thể.",
          "Lỗi người Việt: nói `non posso respiro`. Dùng `non riesco a respirare`.",
          "Drill: `Non riesco a respirare bene.`",
        ],
        pronunciation_focus_en: [
          "non RYES-ko a res-pee-RA-re — `riuscire a` + infinitive.",
          "VN-speaker trap: saying `non posso respiro`. Use `non riesco a respirare`.",
          "Drill: `Non riesco a respirare bene.`",
        ],
      },
      {
        en: "Mi fa male il petto.",
        vi: "Tôi đau ngực.",
        pronunciation_focus: [
          "mee fa MA-le il PET-to — cấu trúc đau: `mi fa male` + bộ phận (có mạo từ).",
          "Lỗi người Việt: nói `petto dolore`. Tiếng Ý là `Mi fa male il petto`.",
          "Drill: `Mi fa male il petto.`",
        ],
        pronunciation_focus_en: [
          "mee fa MA-le il PET-to — pain frame: `mi fa male` + body part (with article).",
          "VN-speaker trap: saying `petto dolore`. Italian is `Mi fa male il petto`.",
          "Drill: `Mi fa male il petto.`",
        ],
      },
      {
        en: "Mi gira la testa.",
        vi: "Tôi chóng mặt.",
        pronunciation_focus: [
          "mee JEE-ra la TES-ta — thành ngữ; nghĩa đen 'đầu tôi đang quay'.",
          "Lỗi người Việt: dịch thẳng từ tiếng Việt. Đây là idiom cố định.",
          "Drill: `Mi gira la testa.`",
        ],
        pronunciation_focus_en: [
          "mee JEE-ra la TES-ta — idiom; literally 'my head is spinning'.",
          "VN-speaker trap: translating literally from Vietnamese. This is a fixed idiom.",
          "Drill: `Mi gira la testa.`",
        ],
      },
      // ── Symptoms ───────────────────────────────────────────────────────
      {
        en: "Ho mal di testa da ieri.",
        vi: "Tôi đau đầu từ hôm qua.",
        pronunciation_focus: [
          "o mal dee TES-ta — `mal di` + bộ phận (KHÔNG có mạo từ ở đây).",
          "Lỗi người Việt: nói `testa dolore`. Cụm cố định là `mal di testa`.",
          "Drill: `Ho mal di testa da ieri.`",
        ],
        pronunciation_focus_en: [
          "o mal dee TES-ta — `mal di` + body part (no article here).",
          "VN-speaker trap: saying `testa dolore`. The set phrase is `mal di testa`.",
          "Drill: `Ho mal di testa da ieri.`",
        ],
      },
      {
        en: "Ho mal di schiena.",
        vi: "Tôi đau lưng.",
        pronunciation_focus: [
          "o mal dee SKYE-na — `schiena` đọc 'SKYE-na' (sch = sk).",
          "Lỗi người Việt: nói `male schiena`. Trong cụm này dùng `mal di`.",
          "Drill: `Ho mal di schiena.`",
        ],
        pronunciation_focus_en: [
          "o mal dee SKYE-na — `schiena` is 'SKYE-na' (sch = sk).",
          "VN-speaker trap: saying `male schiena`. In this phrase use `mal di`.",
          "Drill: `Ho mal di schiena.`",
        ],
      },
      {
        en: "Ho la febbre alta.",
        vi: "Tôi sốt cao.",
        pronunciation_focus: [
          "o la FEB-bre — BẮT BUỘC có mạo từ `la`.",
          "Lỗi người Việt: nói `ho febbre` (thiếu `la`).",
          "Drill: `Ho la febbre alta.`",
        ],
        pronunciation_focus_en: [
          "o la FEB-bre — the article `la` is REQUIRED.",
          "VN-speaker trap: saying `ho febbre` (dropping `la`).",
          "Drill: `Ho la febbre alta.`",
        ],
      },
      {
        en: "Ho la tosse da tre giorni.",
        vi: "Tôi bị ho ba ngày rồi.",
        pronunciation_focus: [
          "o la TOS-se — lại cần mạo từ `la`; `da` = 'được/từ (bao lâu)'.",
          "Lỗi người Việt: nói `ho tosse` (thiếu `la`).",
          "Drill: `Ho la tosse da tre giorni.`",
        ],
        pronunciation_focus_en: [
          "o la TOS-se — again the article `la`; `da` = 'for/since (a duration)'.",
          "VN-speaker trap: saying `ho tosse` (dropping `la`).",
          "Drill: `Ho la tosse da tre giorni.`",
        ],
      },
      {
        en: "Mi fa male lo stomaco.",
        vi: "Tôi đau bụng / đau dạ dày.",
        pronunciation_focus: [
          "mee fa MA-le lo STO-ma-ko — dùng `lo` (không phải `il`) trước `st-`.",
          "Lỗi người Việt: nói `il stomaco`. Trước `s + phụ âm` phải là `lo`.",
          "Drill: `Mi fa male lo stomaco.`",
        ],
        pronunciation_focus_en: [
          "mee fa MA-le lo STO-ma-ko — use `lo` (not `il`) before `st-`.",
          "VN-speaker trap: saying `il stomaco`. Before `s + consonant` it must be `lo`.",
          "Drill: `Mi fa male lo stomaco.`",
        ],
      },
      {
        en: "Mi sono tagliato un dito.",
        vi: "Tôi bị đứt một ngón tay.",
        pronunciation_focus: [
          "mee SO-no ta-LYA-to — phản thân, hợp giống: nam `tagliato`, nữ `tagliata`.",
          "Lỗi người Việt: nói `ho tagliato me`. Câu chuẩn là `mi sono tagliato/a`.",
          "Drill: `Mi sono tagliato un dito.`",
        ],
        pronunciation_focus_en: [
          "mee SO-no ta-LYA-to — reflexive, agrees in gender: male `tagliato`, female `tagliata`.",
          "VN-speaker trap: saying `ho tagliato me`. The set phrase is `mi sono tagliato/a`.",
          "Drill: `Mi sono tagliato un dito.`",
        ],
      },
      // ── Doctor and pharmacy ────────────────────────────────────────────
      {
        en: "Vorrei prenotare una visita.",
        vi: "Tôi muốn đặt lịch khám.",
        pronunciation_focus: [
          "vor-RAY pre-no-TA-re — `vorrei` (điều kiện) lịch sự hơn `voglio`.",
          "Lỗi người Việt: nói `voglio vedere dottore` (nghe như ra lệnh).",
          "Drill: `Vorrei prenotare una visita.`",
        ],
        pronunciation_focus_en: [
          "vor-RAY pre-no-TA-re — `vorrei` (conditional) is politer than `voglio`.",
          "VN-speaker trap: saying `voglio vedere dottore` (sounds like an order).",
          "Drill: `Vorrei prenotare una visita.`",
        ],
      },
      {
        en: "Prendo questa medicina dopo cena?",
        vi: "Tôi uống thuốc này sau bữa tối phải không?",
        pronunciation_focus: [
          "PREN-do KWES-ta me-dee-CHEE-na — thuốc thì dùng `prendere`, không phải `bere`.",
          "Lỗi người Việt: nói `bere medicina`. Uống thuốc là `prendere la medicina`.",
          "Drill: `Prendo questa medicina dopo cena?`",
        ],
        pronunciation_focus_en: [
          "PREN-do KWES-ta me-dee-CHEE-na — for medicine use `prendere`, not `bere`.",
          "VN-speaker trap: saying `bere medicina`. Taking medicine is `prendere la medicina`.",
          "Drill: `Prendo questa medicina dopo cena?`",
        ],
      },
      {
        en: "Sono allergico a questo farmaco.",
        vi: "Tôi dị ứng với thuốc này.",
        pronunciation_focus: [
          "SO-no al-LER-jee-ko — `allergico a …`; nữ nói `allergica`.",
          "Lỗi người Việt: bỏ `a` sau `allergico`. Phải có `a`.",
          "Drill: `Sono allergico/a a questo farmaco.`",
        ],
        pronunciation_focus_en: [
          "SO-no al-LER-jee-ko — `allergico a …`; female speaker says `allergica`.",
          "VN-speaker trap: dropping the `a` after `allergico`. The `a` is required.",
          "Drill: `Sono allergico/a a questo farmaco.`",
        ],
      },
      {
        en: "Ho la tessera sanitaria.",
        vi: "Tôi có thẻ y tế.",
        pronunciation_focus: [
          "o la TES-se-ra sa-nee-TA-rya — lại cần mạo từ `la`.",
          "Lỗi người Việt: nói `ho tessera` (thiếu `la`).",
          "Drill: `Ho la tessera sanitaria.`",
        ],
        pronunciation_focus_en: [
          "o la TES-se-ra sa-nee-TA-rya — again the article `la` is needed.",
          "VN-speaker trap: saying `ho tessera` (dropping `la`).",
          "Drill: `Ho la tessera sanitaria.`",
        ],
      },
      {
        en: "Devo fare un esame del sangue.",
        vi: "Tôi phải xét nghiệm máu.",
        pronunciation_focus: [
          "DEH-vo FA-re un e-ZA-me del SAN-gwe — cụm cố định `fare un esame del sangue`.",
          "Lỗi người Việt: nói `test sangue` (dịch kiểu tiếng Anh).",
          "Drill: `Devo fare un esame del sangue.`",
        ],
        pronunciation_focus_en: [
          "DEH-vo FA-re un e-ZA-me del SAN-gwe — fixed phrase `fare un esame del sangue`.",
          "VN-speaker trap: saying `test sangue` (English-style).",
          "Drill: `Devo fare un esame del sangue.`",
        ],
      },
      // ── Triage and severity ────────────────────────────────────────────
      {
        en: "È un'emergenza.",
        vi: "Đây là tình huống khẩn cấp.",
        pronunciation_focus: [
          "eh un e-mer-JEN-tsa — dùng khi cần gọi cấp cứu NGAY.",
          "Lỗi người Việt: bỏ trọng âm `È` (= 'là'). Câu phải có động từ `è`.",
          "Drill: `È un'emergenza.`",
        ],
        pronunciation_focus_en: [
          "eh un e-mer-JEN-tsa — use it when you must call for help NOW.",
          "VN-speaker trap: dropping `È` (= 'is'). The clause needs the verb `è`.",
          "Drill: `È un'emergenza.`",
        ],
      },
      {
        en: "È urgente, ma non immediatamente vitale.",
        vi: "Khẩn, nhưng không nguy hiểm tức thì.",
        pronunciation_focus: [
          "eh oor-JEN-te — câu phân loại ưu tiên cao mà không nguy kịch.",
          "Lỗi người Việt: lẫn `urgente` với `emergenza`. `urgente` = khẩn nhưng chưa chí mạng.",
          "Drill: `È urgente, ma non immediatamente vitale.`",
        ],
        pronunciation_focus_en: [
          "eh oor-JEN-te — flags high priority without being life-threatening.",
          "VN-speaker trap: confusing `urgente` with `emergenza`. `urgente` = pressing but not yet life-or-death.",
          "Drill: `È urgente, ma non immediatamente vitale.`",
        ],
      },
      {
        en: "Posso aspettare un appuntamento.",
        vi: "Tôi có thể chờ lịch hẹn.",
        pronunciation_focus: [
          "POS-so as-pet-TA-re un ap-poon-ta-MEN-to — báo đây là chăm sóc thường quy.",
          "Lỗi người Việt: nói `aspetto appuntamento` thiếu mạo từ `un`.",
          "Drill: `Posso aspettare un appuntamento.`",
        ],
        pronunciation_focus_en: [
          "POS-so as-pet-TA-re un ap-poon-ta-MEN-to — signals this is routine care.",
          "VN-speaker trap: saying `aspetto appuntamento` without the article `un`.",
          "Drill: `Posso aspettare un appuntamento.`",
        ],
      },
      {
        en: "Devo andare al pronto soccorso?",
        vi: "Tôi có phải đến phòng cấp cứu không?",
        pronunciation_focus: [
          "DEH-vo an-DA-re al PRON-to so-KOR-so — `pronto soccorso` = phòng cấp cứu (A&E/ER).",
          "Lỗi người Việt: dùng `emergenza` cho địa điểm. Địa điểm là `pronto soccorso`.",
          "Drill: `Devo andare al pronto soccorso?`",
        ],
        pronunciation_focus_en: [
          "DEH-vo an-DA-re al PRON-to so-KOR-so — `pronto soccorso` = the emergency room (A&E/ER).",
          "VN-speaker trap: using `emergenza` for the place. The place is `pronto soccorso`.",
          "Drill: `Devo andare al pronto soccorso?`",
        ],
      },
      // ── Useful short phrases ───────────────────────────────────────────
      {
        en: "Mi aiuti, per favore.",
        vi: "Làm ơn giúp tôi.",
        pronunciation_focus: [
          "mee a-YOO-tee — khẩn nhưng vẫn lịch sự (formal).",
          "Lỗi người Việt: nói `aiuto me`. Mệnh lệnh lịch sự là `mi aiuti`.",
          "Drill: `Mi aiuti, per favore.`",
        ],
        pronunciation_focus_en: [
          "mee a-YOO-tee — urgent but still polite (formal).",
          "VN-speaker trap: saying `aiuto me`. The polite command is `mi aiuti`.",
          "Drill: `Mi aiuti, per favore.`",
        ],
      },
      {
        en: "Ho un forte dolore.",
        vi: "Tôi đau rất nhiều.",
        pronunciation_focus: [
          "o un FOR-te do-LO-re — `forte` = mạnh/dữ dội; dùng để tả mức độ.",
          "Lỗi người Việt: nói `molto dolore` (vẫn hiểu nhưng `un forte dolore` tự nhiên hơn).",
          "Drill: `Ho un forte dolore.`",
        ],
        pronunciation_focus_en: [
          "o un FOR-te do-LO-re — `forte` = strong/severe; used to rate intensity.",
          "VN-speaker trap: saying `molto dolore` (understood, but `un forte dolore` is more natural).",
          "Drill: `Ho un forte dolore.`",
        ],
      },
      {
        en: "È iniziato stamattina.",
        vi: "Nó bắt đầu từ sáng nay.",
        pronunciation_focus: [
          "eh ee-nee-TSYA-to sta-mat-TEE-na — cho mốc thời gian bắt đầu triệu chứng.",
          "Lỗi người Việt: bỏ trợ động từ `è` ở thì quá khứ gần.",
          "Drill: `È iniziato stamattina.`",
        ],
        pronunciation_focus_en: [
          "eh ee-nee-TSYA-to sta-mat-TEE-na — gives the onset time of the symptom.",
          "VN-speaker trap: dropping the auxiliary `è` in the present-perfect.",
          "Drill: `È iniziato stamattina.`",
        ],
      },
      {
        en: "Mi sento meglio. / Mi sento peggio.",
        vi: "Tôi thấy đỡ hơn. / Tôi thấy tệ hơn.",
        pronunciation_focus: [
          "mee SEN-to MEL-yo / PED-jo — `meglio` (đỡ hơn) vs `peggio` (tệ hơn).",
          "Lỗi người Việt: dùng `buono/cattivo` cho cảm giác. Trạng từ đúng là `meglio/peggio`.",
          "Drill: `Mi sento meglio.` / `Mi sento peggio.`",
        ],
        pronunciation_focus_en: [
          "mee SEN-to MEL-yo / PED-jo — `meglio` (better) vs `peggio` (worse).",
          "VN-speaker trap: using `buono/cattivo` for how you feel. The correct adverbs are `meglio/peggio`.",
          "Drill: `Mi sento meglio.` / `Mi sento peggio.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Ý, số cấp cứu chung của châu Âu là `112` (cảnh sát/cứu thương/cứu hỏa); số y tế truyền thống `118` vẫn còn ở nhiều vùng nhưng `112` luôn dùng được. Khi gọi, điều phối viên hỏi địa chỉ TRƯỚC (`Dove si trova?`) rồi mới hỏi vấn đề — hãy nói địa chỉ trước, một câu ngắn, và đừng cúp máy cho đến khi được phép. Hệ thống y tế công (`SSN`) yêu cầu `tessera sanitaria` (thẻ y tế) và `codice fiscale` (mã số thuế cá nhân) — luôn mang theo. Hiệu thuốc (`farmacia`) bán thuốc theo `ricetta` (đơn), nay thường là `ricetta elettronica`; nhiều thuốc cần đơn mới mua được. Đến `pronto soccorso` (phòng cấp cứu) bạn sẽ được phân loại theo mã màu (`codice bianco/verde/giallo/rosso`).",
    cultural_notes_en:
      "In Italy the Europe-wide emergency number is `112` (police/ambulance/fire); the legacy medical number `118` still works in many regions, but `112` always does. On the call, the operator asks for the ADDRESS first (`Dove si trova?`) and only then the problem — give the address first, in one short sentence, and don't hang up until told. The public health system (`SSN`) wants your `tessera sanitaria` (health card) and `codice fiscale` (personal tax code) — always carry them. A pharmacy (`farmacia`) dispenses against a `ricetta` (prescription), now usually a `ricetta elettronica`; many drugs are prescription-only. At the `pronto soccorso` (ER) you're triaged by colour code (`codice bianco/verde/giallo/rosso`).",
    tip_advice_vi:
      "Học chắc cấu trúc đau trước: `Mi fa male + il/la/lo + bộ phận` (có mạo từ) HOẶC `Ho mal di + bộ phận` (không mạo từ) — đừng nói `bộ phận + dolore` kiểu tiếng Việt. Triệu chứng bệnh hầu hết cần mạo từ: `ho LA febbre`, `ho LA tosse`. Thuốc thì `prendere`, không `bere`. Trong tình huống khẩn cấp, nói NGẮN và CHÍNH XÁC: địa chỉ → một câu mô tả vấn đề → trả lời câu hỏi của điều phối viên. Đừng kể dài dòng — thời gian là vàng.",
    tip_advice_en:
      "Lock in the pain frames first: `Mi fa male + il/la/lo + body part` (with article) OR `Ho mal di + body part` (no article) — never the Vietnamese-style `body part + dolore`. Most illness symptoms need the article: `ho LA febbre`, `ho LA tosse`. For medicine it's `prendere`, not `bere`. In an emergency, keep it SHORT and EXACT: address → one sentence on the problem → answer the operator's questions. Don't tell a long story — time matters.",
    vocabulary: [
      // Body parts and pain
      {
        word: "la gola",
        en: "throat",
        vi: "cổ họng",
        pos: "noun (f)",
        pronunciation_vi: "la GO-la — dùng trong `mal di gola`",
        pronunciation_en: "la GO-la — used in `mal di gola`",
      },
      {
        word: "la pancia",
        en: "belly / tummy",
        vi: "bụng",
        pos: "noun (f)",
        pronunciation_vi: "la PAN-cha — từ thông dụng hằng ngày",
        pronunciation_en: "la PAN-cha — the common everyday word",
      },
      {
        word: "la gamba",
        en: "leg",
        vi: "chân",
        pos: "noun (f)",
        pronunciation_vi: "la GAM-ba — giống cái, dùng `la`; đừng nói `il gamba`",
        pronunciation_en: "la GAM-ba — feminine, takes `la`; not `il gamba`",
      },
      {
        word: "il braccio",
        en: "arm",
        vi: "cánh tay",
        pos: "noun (m)",
        pronunciation_vi: "il BRAT-cho — giống đực, dùng `il`; đừng nói `la braccio`",
        pronunciation_en: "il BRAT-cho — masculine, takes `il`; not `la braccio`",
      },
      {
        word: "l'orecchio",
        en: "ear",
        vi: "tai",
        pos: "noun (m)",
        pronunciation_vi: "lo-REK-kyo — nối mạo từ apostrophe; `mal d'orecchio`",
        pronunciation_en: "lo-REK-kyo — apostrophe elision; `mal d'orecchio`",
      },
      {
        word: "il dente",
        en: "tooth",
        vi: "răng",
        pos: "noun (m)",
        pronunciation_vi: "il DEN-te — bối cảnh nha sĩ; đừng nói `dente dolore`",
        pronunciation_en: "il DEN-te — dentist context; not `dente dolore`",
      },
      {
        word: "il petto",
        en: "chest",
        vi: "ngực",
        pos: "noun (m)",
        pronunciation_vi: "il PET-to — `Mi fa male il petto`",
        pronunciation_en: "il PET-to — `Mi fa male il petto`",
      },
      // Pharmacy and medicine labels
      {
        word: "una compressa",
        en: "a tablet",
        vi: "một viên nén",
        pos: "noun (f)",
        pronunciation_vi: "OO-na kom-PRES-sa — đừng dùng từ Anh `tablet`",
        pronunciation_en: "OO-na kom-PRES-sa — don't use the English `tablet`",
      },
      {
        word: "una capsula",
        en: "a capsule",
        vi: "một viên nang",
        pos: "noun (f)",
        pronunciation_vi: "OO-na KAP-soo-la — viên nang (khác viên nén)",
        pronunciation_en: "OO-na KAP-soo-la — a capsule (not the same as a tablet)",
      },
      {
        word: "ogni 8 ore",
        en: "every 8 hours",
        vi: "mỗi 8 giờ",
        pos: "phrase",
        pronunciation_vi: "ON-yee OT-to O-re — tần suất; đừng lẫn với `per 8 ore`",
        pronunciation_en: "ON-yee OT-to O-re — frequency; don't confuse with `per 8 ore`",
      },
      {
        word: "prima dei pasti",
        en: "before meals",
        vi: "trước bữa ăn",
        pos: "phrase",
        pronunciation_vi: "PREE-ma day PAS-tee — thời điểm uống thuốc",
        pronunciation_en: "PREE-ma day PAS-tee — medication timing",
      },
      {
        word: "dopo i pasti",
        en: "after meals",
        vi: "sau bữa ăn",
        pos: "phrase",
        pronunciation_vi: "DO-po ee PAS-tee — thời điểm uống thuốc",
        pronunciation_en: "DO-po ee PAS-tee — medication timing",
      },
      {
        word: "per 5 giorni",
        en: "for 5 days",
        vi: "trong 5 ngày",
        pos: "phrase",
        pronunciation_vi: "per CHIN-kwe JOR-nee — `per` chỉ thời lượng",
        pronunciation_en: "per CHIN-kwe JOR-nee — `per` marks the duration",
      },
      {
        word: "la ricetta",
        en: "prescription",
        vi: "đơn thuốc",
        pos: "noun (f)",
        pronunciation_vi: "la ree-CHET-ta — nay thường là `ricetta elettronica`",
        pronunciation_en: "la ree-CHET-ta — now usually a `ricetta elettronica`",
      },
      {
        word: "il pronto soccorso",
        en: "emergency room (A&E/ER)",
        vi: "phòng cấp cứu",
        pos: "noun (m)",
        pronunciation_vi: "il PRON-to so-KOR-so — địa điểm, KHÁC với `emergenza` (tình huống)",
        pronunciation_en: "il PRON-to so-KOR-so — the place, NOT `emergenza` (the situation)",
      },
    ],
    dialogue: [
      // Dialogue: At the pharmacy
      {
        speaker: "Cliente",
        text: "Buongiorno, ho la ricetta elettronica.",
        vi: "Xin chào, tôi có đơn thuốc điện tử.",
        en: "Good morning, I have the electronic prescription.",
      },
      {
        speaker: "Farmacista",
        text: "Certo, mi dice il codice fiscale?",
        vi: "Được, anh/chị cho tôi mã số thuế được không?",
        en: "Of course, can you tell me your tax code?",
      },
      {
        speaker: "Cliente",
        text: "Sì, ecco. Vorrei anche sapere come si prende questa medicina.",
        vi: "Vâng, đây ạ. Tôi cũng muốn biết cách dùng thuốc này.",
        en: "Yes, here it is. I'd also like to know how to take this medicine.",
      },
      {
        speaker: "Farmacista",
        text: "Una compressa dopo i pasti, per 5 giorni.",
        vi: "Một viên sau bữa ăn, trong 5 ngày.",
        en: "One tablet after meals, for 5 days.",
      },
      {
        speaker: "Cliente",
        text: "Posso prenderla la sera?",
        vi: "Tôi có thể uống vào buổi tối không?",
        en: "Can I take it in the evening?",
      },
      {
        speaker: "Farmacista",
        text: "Sì, ma sempre dopo cena.",
        vi: "Có, nhưng luôn sau bữa tối.",
        en: "Yes, but always after dinner.",
      },
      // Dialogue: Medical appointment
      {
        speaker: "Paziente",
        text: "Buongiorno, vorrei prenotare una visita.",
        vi: "Xin chào, tôi muốn đặt lịch khám.",
        en: "Good morning, I'd like to book an appointment.",
      },
      {
        speaker: "Segreteria",
        text: "Che tipo di visita le serve?",
        vi: "Anh/chị cần khám loại gì?",
        en: "What kind of appointment do you need?",
      },
      {
        speaker: "Paziente",
        text: "Ho mal di gola e febbre da due giorni.",
        vi: "Tôi đau họng và sốt hai ngày rồi.",
        en: "I've had a sore throat and a fever for two days.",
      },
      {
        speaker: "Segreteria",
        text: "Abbiamo posto domani pomeriggio.",
        vi: "Chúng tôi có chỗ vào chiều mai.",
        en: "We have a slot tomorrow afternoon.",
      },
      {
        speaker: "Paziente",
        text: "Va bene. Devo portare la tessera sanitaria?",
        vi: "Được. Tôi cần mang thẻ y tế không?",
        en: "Okay. Do I need to bring my health card?",
      },
      {
        speaker: "Segreteria",
        text: "Sì, e un documento d'identità.",
        vi: "Có, và giấy tờ tùy thân.",
        en: "Yes, and an ID document.",
      },
      // Dialogue: Emergency call
      {
        speaker: "Operatore",
        text: "Pronto, emergenza. Dove si trova?",
        vi: "Xin chào, cấp cứu. Anh/chị đang ở đâu?",
        en: "Hello, emergency services. Where are you?",
      },
      {
        speaker: "Chiamante",
        text: "Sono in via Garibaldi 15. Ho bisogno di un'ambulanza.",
        vi: "Tôi ở số 15 đường Garibaldi. Tôi cần xe cấp cứu.",
        en: "I'm at 15 Via Garibaldi. I need an ambulance.",
      },
      {
        speaker: "Operatore",
        text: "Che succede?",
        vi: "Có chuyện gì?",
        en: "What's happening?",
      },
      {
        speaker: "Chiamante",
        text: "Una persona non riesce a respirare bene.",
        vi: "Một người không thở tốt được.",
        en: "Someone can't breathe well.",
      },
      {
        speaker: "Operatore",
        text: "Resti al telefono. L'ambulanza sta arrivando.",
        vi: "Giữ máy. Xe cấp cứu đang đến.",
        en: "Stay on the line. The ambulance is on its way.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          { prompt: "Tôi bị sốt từ hôm qua.", answer: "Ho la febbre da ieri." },
          { prompt: "Tôi không thở tốt được.", answer: "Non riesco a respirare bene." },
          { prompt: "Tôi dị ứng với thuốc này.", answer: "Sono allergico/a a questo farmaco." },
          { prompt: "Tôi muốn đặt lịch khám.", answer: "Vorrei prenotare una visita." },
          { prompt: "Làm ơn gọi xe cấp cứu.", answer: "Chiami un'ambulanza, per favore." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Ý:",
        instruction_en: "Extra practice — translate into Italian:",
        items: [
          { prompt: "Tôi cần giúp ngay.", answer: "Ho bisogno di aiuto subito." },
          { prompt: "Tôi bị đau đầu và sốt.", answer: "Ho mal di testa e la febbre." },
          { prompt: "Tôi muốn đặt lịch khám ngày mai.", answer: "Vorrei prenotare una visita per domani." },
          { prompt: "Tôi có thể uống thuốc này sau bữa tối không?", answer: "Posso prendere questa medicina dopo cena?" },
          { prompt: "Tôi có phải đến phòng cấp cứu không?", answer: "Devo andare al pronto soccorso?" },
          { prompt: "Đau bắt đầu từ sáng nay.", answer: "Il dolore è iniziato stamattina." },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung gọi cấp cứu — điền chỗ trống theo đúng thứ tự: `Sono in via ___. C'è ___. La persona ___. Ho bisogno di un'ambulanza.`",
        instruction_en:
          "Emergency-call frame — fill the blanks in order: `Sono in via ___. C'è ___. La persona ___. Ho bisogno di un'ambulanza.`",
        example:
          "Sono in via Garibaldi 15. C'è un'emergenza. La persona non riesce a respirare. Ho bisogno di un'ambulanza.",
        example_vi:
          "Tôi ở số 15 đường Garibaldi. Có tình huống khẩn cấp. Người đó không thở được. Tôi cần xe cấp cứu.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Self-check — can you do each one?",
        items: [
          {
            vi: "Tôi có thể tả triệu chứng đúng mạo từ và đúng cụm 'mal di / mi fa male'.",
            en: "I can state symptoms with the right article and body-part phrase.",
          },
          {
            vi: "Tôi có thể hỏi hiệu thuốc cách dùng thuốc.",
            en: "I can ask a pharmacy how to take a medicine.",
          },
          {
            vi: "Tôi có thể đặt lịch khám một cách lịch sự.",
            en: "I can book a medical appointment politely.",
          },
          {
            vi: "Tôi có thể gọi cấp cứu với địa chỉ và vấn đề.",
            en: "I can make an emergency call with address and problem.",
          },
          {
            vi: "Tôi có thể phân biệt cấp cứu khẩn với chăm sóc thường quy.",
            en: "I can distinguish urgent care from routine care.",
          },
          {
            vi: "Tôi có thể sửa trật tự từ kiểu tiếng Việt thành tiếng Ý tự nhiên.",
            en: "I can repair Vietnamese-style word order into natural Italian.",
          },
        ],
      },
      {
        type: "rubric",
        instruction_vi: "Thang tự đánh giá (1–5):",
        instruction_en: "Self-assessment scale (1–5):",
        items: [
          { score: 1, vi: "Chưa nói rõ được triệu chứng.", en: "Cannot state symptoms clearly." },
          {
            score: 2,
            vi: "Nói được một triệu chứng nhưng chưa nêu được bước tiếp theo.",
            en: "Can state a symptom but not a next step.",
          },
          {
            score: 3,
            vi: "Có thể xin giúp đỡ hoặc đặt lịch hẹn.",
            en: "Can ask for help or an appointment.",
          },
          {
            score: 4,
            vi: "Xử lý ngôn ngữ hiệu thuốc/phòng khám chính xác.",
            en: "Can handle pharmacy/clinic language accurately.",
          },
          {
            score: 5,
            vi: "Xử lý hội thoại cấp cứu hoặc y tế bình tĩnh và chính xác.",
            en: "Can manage an emergency or medical conversation calmly and precisely.",
          },
        ],
      },
    ],
  },
];

export default lessons;
