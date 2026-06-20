// Hospital Visitor Etiquette Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
export type IndonesianExercise = Record<string, any>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_hospital_visitor_etiquette",
    level: "A2",
    category: "health",
    title_vi: "Lịch sự khi thăm bệnh trong bệnh viện",
    title_en: "Hospital visitor etiquette",
    sentences: [
      {
        en: "Saya mau menjenguk pasien di ruang rawat.",
        vi: "Tôi muốn vào thăm bệnh nhân ở phòng điều trị.",
        pronunciation_focus: [
          "SA-ya mau men-JE-nguk PA-sien di RU-ang RA-wat -- `menjenguk pasien` = thăm bệnh nhân; `ruang rawat` = phòng/khu điều trị.",
          "Lỗi người Việt: dùng `mengunjungi` được, nhưng với người bệnh tự nhiên hơn là `menjenguk`.",
          "Luyện: `Saya mau menjenguk pasien.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau men-JE-nguk PA-sien di ROO-ang RA-wat -- `menjenguk pasien` = visit a patient; `ruang rawat` = ward/treatment room.",
          "VN-speaker trap: `mengunjungi` works, but for visiting a sick person `menjenguk` is more natural.",
          "Drill: `Saya mau menjenguk pasien.`",
        ],
      },
      {
        en: "Jam besuknya mulai jam empat sore.",
        vi: "Giờ thăm bệnh bắt đầu lúc bốn giờ chiều.",
        pronunciation_focus: [
          "jam BE-suk-nya MU-lai jam EM-pat SO-re -- `jam besuk` = giờ thăm bệnh; `mulai` = bắt đầu.",
          "`besuk` trong `jam besuk` khác `besok` = ngày mai. Âm cuối vẫn rõ: BE-suk.",
          "Luyện: `Jam besuk mulai jam empat sore.`",
        ],
        pronunciation_focus_en: [
          "jam BE-suk-nya MOO-lai jam EM-pat SO-re -- `jam besuk` = visiting hours; `mulai` = starts.",
          "`Besuk` in `jam besuk` is different from `besok` = tomorrow. Keep the final sound clear: BE-suk.",
          "Drill: `Jam besuk mulai jam empat sore.`",
        ],
      },
      {
        en: "Boleh saya membawa buah untuk pasien?",
        vi: "Tôi có thể mang trái cây cho bệnh nhân không?",
        pronunciation_focus: [
          "BO-leh SA-ya mem-BA-wa BU-ah UN-tuk PA-sien -- `membawa buah` = mang trái cây; `boleh saya...` = tôi có được phép... không.",
          "Mẹo: hỏi trước vì một số bệnh nhân có pantangan makanan hoặc aturan dari dokter.",
          "Luyện: `Boleh saya membawa buah?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya mem-BA-wa BOO-ah OON-tuk PA-sien -- `membawa buah` = bring fruit; `boleh saya...` = may I...",
          "Tip: ask first because some patients have food restrictions or doctor's rules.",
          "Drill: `Boleh saya membawa buah?`",
        ],
      },
      {
        en: "Tolong bicara dengan suara pelan di ruang rawat.",
        vi: "Làm ơn nói nhỏ trong phòng điều trị.",
        pronunciation_focus: [
          "TO-long bi-CA-ra DE-ngan SU-a-ra pe-LAN di RU-ang RA-wat -- `suara pelan` = giọng nhỏ/âm lượng thấp.",
          "`pelan` có thể nghĩa là chậm hoặc nhỏ; trong cụm `suara pelan` là nói nhỏ.",
          "Luyện: `Bicara dengan suara pelan.`",
        ],
        pronunciation_focus_en: [
          "TO-long bi-CHA-ra DE-ngan SOO-a-ra pe-LAN di ROO-ang RA-wat -- `suara pelan` = quiet voice/low volume.",
          "`Pelan` can mean slow or quiet; in `suara pelan` it means quiet.",
          "Drill: `Bicara dengan suara pelan.`",
        ],
      },
      {
        en: "Saya ingin bertemu keluarga pasien dulu.",
        vi: "Tôi muốn gặp gia đình bệnh nhân trước.",
        pronunciation_focus: [
          "SA-ya I-ngin ber-TE-mu ke-LU-ar-ga PA-sien DU-lu -- `keluarga pasien` = gia đình/người nhà bệnh nhân.",
          "Ở bệnh viện, hỏi keluarga pasien trước thường lịch sự hơn vào thẳng gặp pasien.",
          "Luyện: `Saya ingin bertemu keluarga pasien.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin ber-TE-mu ke-LOO-ar-ga PA-sien DOO-lu -- `keluarga pasien` = patient's family.",
          "At a hospital, asking the family first is often more polite than going straight to the patient.",
          "Drill: `Saya ingin bertemu keluarga pasien.`",
        ],
      },
      {
        en: "Pasien sedang istirahat, jadi kunjungannya sebentar saja.",
        vi: "Bệnh nhân đang nghỉ, nên chuyến thăm chỉ ngắn thôi.",
        pronunciation_focus: [
          "PA-sien se-DANG is-ti-RA-hat, JA-di kun-JUNG-an-nya se-ben-TAR SA-ja -- `istirahat` = nghỉ ngơi; `sebentar saja` = chỉ một lát.",
          "`jadi` nối lý do và hành động lịch sự: bệnh nhân nghỉ, nên mình thăm ngắn.",
          "Luyện: `Kunjungannya sebentar saja.`",
        ],
        pronunciation_focus_en: [
          "PA-sien se-DANG is-ti-RA-hat, JA-di kun-JOONG-an-nya se-ben-TAR SA-ja -- `istirahat` = resting; `sebentar saja` = just briefly.",
          "`Jadi` links reason and polite action: the patient is resting, so keep the visit short.",
          "Drill: `Kunjungannya sebentar saja.`",
        ],
      },
      {
        en: "Semoga cepat sembuh, kami doakan yang terbaik.",
        vi: "Mong anh/chị mau khỏe lại, chúng tôi cầu chúc điều tốt đẹp nhất.",
        pronunciation_focus: [
          "se-MO-ga CE-pat SEM-buh, KA-mi do-A-kan yang ter-BA-ik -- `semoga cepat sembuh` = mong sớm khỏe; `doakan` = cầu nguyện/chúc.",
          "Lỗi người Việt: dịch quá trực tiếp `mudah-mudahan kamu sehat`. Cụm cố định tự nhiên là `semoga cepat sembuh`.",
          "Luyện: `Semoga cepat sembuh.`",
        ],
        pronunciation_focus_en: [
          "se-MO-ga CHE-pat SEM-buh, KA-mi do-A-kan yang ter-BA-ik -- `semoga cepat sembuh` = hope you recover soon; `doakan` = pray/wish.",
          "VN-speaker trap: translating too literally as `mudah-mudahan kamu sehat`. The natural fixed phrase is `semoga cepat sembuh`.",
          "Drill: `Semoga cepat sembuh.`",
        ],
      },
      {
        en: "Kami akan pamit supaya pasien bisa beristirahat.",
        vi: "Chúng tôi xin phép về để bệnh nhân có thể nghỉ ngơi.",
        pronunciation_focus: [
          "KA-mi A-kan PA-mit su-PA-ya PA-sien BI-sa ber-is-ti-RA-hat -- `pamit` = xin phép rời đi; `supaya` = để.",
          "Mẹo văn hóa: khi rời phòng, nói `pamit` nghe lịch sự hơn chỉ đứng dậy đi.",
          "Luyện: `Kami pamit dulu.`",
        ],
        pronunciation_focus_en: [
          "KA-mi A-kan PA-mit soo-PA-ya PA-sien BEE-sa ber-is-ti-RA-hat -- `pamit` = take leave/say goodbye politely; `supaya` = so that.",
          "Culture tip: when leaving the room, saying `pamit` is more polite than simply walking out.",
          "Drill: `Kami pamit dulu.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, thăm bệnh nhân thường gọi là `menjenguk`. Người thăm nên hỏi `jam besuk`, giữ `suara pelan`, không ở quá lâu, và hỏi keluarga pasien trước nếu bệnh nhân đang lelah hoặc tidur. Mang buah là phổ biến, nhưng nên hỏi trước vì một số pasien có aturan makanan. Lời chúc `semoga cepat sembuh` rất tự nhiên và an toàn trong hầu hết tình huống.",
    cultural_notes_en:
      "In Indonesia, visiting a patient is commonly called `menjenguk`. Visitors should check visiting hours, keep a quiet voice, avoid staying too long, and ask the patient's family first if the patient is tired or sleeping. Bringing fruit is common, but ask first because some patients have food restrictions. The wish `semoga cepat sembuh` is natural and safe in most situations.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm lịch sự: `menjenguk pasien`, `jam besuk`, `suara pelan`, `keluarga pasien`, `ruang rawat`, `semoga cepat sembuh`, `kami pamit dulu`. Khi không chắc được vào hay mang đồ ăn không, dùng `boleh saya...?` để hỏi xin phép.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn polite chunks: `menjenguk pasien`, `jam besuk`, `suara pelan`, `keluarga pasien`, `ruang rawat`, `semoga cepat sembuh`, `kami pamit dulu`. When unsure whether you may enter or bring food, use `boleh saya...?` to ask permission.",
    vocabulary: [
      {
        word: "menjenguk pasien",
        en: "visit a patient",
        vi: "thăm bệnh nhân",
        pos: "verb phrase",
        pronunciation_vi: "men-JE-nguk PA-sien",
        pronunciation_en: "men-JE-nguk PA-sien",
      },
      {
        word: "jam besuk",
        en: "visiting hours",
        vi: "giờ thăm bệnh",
        pos: "noun phrase",
        pronunciation_vi: "jam BE-suk",
        pronunciation_en: "jam BE-suk",
      },
      {
        word: "membawa buah",
        en: "bring fruit",
        vi: "mang trái cây",
        pos: "verb phrase",
        pronunciation_vi: "mem-BA-wa BU-ah",
        pronunciation_en: "mem-BA-wa BOO-ah",
      },
      {
        word: "suara pelan",
        en: "quiet voice",
        vi: "giọng nhỏ",
        pos: "noun phrase",
        pronunciation_vi: "SU-a-ra pe-LAN",
        pronunciation_en: "SOO-a-ra pe-LAN",
      },
      {
        word: "keluarga pasien",
        en: "patient's family",
        vi: "người nhà bệnh nhân",
        pos: "noun phrase",
        pronunciation_vi: "ke-LU-ar-ga PA-sien",
        pronunciation_en: "ke-LOO-ar-ga PA-sien",
      },
      {
        word: "ruang rawat",
        en: "ward / treatment room",
        vi: "phòng/khu điều trị",
        pos: "noun phrase",
        pronunciation_vi: "RU-ang RA-wat",
        pronunciation_en: "ROO-ang RA-wat",
      },
      {
        word: "doa",
        en: "prayer / good wish",
        vi: "lời cầu nguyện / lời chúc",
        pos: "noun",
        pronunciation_vi: "do-A",
        pronunciation_en: "do-A",
      },
      {
        word: "sopan santun",
        en: "manners / etiquette",
        vi: "phép lịch sự / lễ nghĩa",
        pos: "noun phrase",
        pronunciation_vi: "SO-pan SAN-tun",
        pronunciation_en: "SO-pan SAN-toon",
      },
    ],
    dialogue: [
      {
        speaker: "Pengunjung",
        text: "Permisi, jam besuk untuk ruang rawat ini mulai jam berapa?",
        vi: "Xin phép, giờ thăm bệnh cho khu điều trị này bắt đầu lúc mấy giờ?",
        en: "Excuse me, what time do visiting hours for this ward start?",
      },
      {
        speaker: "Perawat",
        text: "Mulai jam empat sore. Tolong bicara dengan suara pelan.",
        vi: "Bắt đầu lúc bốn giờ chiều. Xin nói nhỏ.",
        en: "They start at 4 p.m. Please speak quietly.",
      },
      {
        speaker: "Pengunjung",
        text: "Baik. Boleh saya membawa buah untuk pasien?",
        vi: "Vâng. Tôi có thể mang trái cây cho bệnh nhân không?",
        en: "Okay. May I bring fruit for the patient?",
      },
      {
        speaker: "Perawat",
        text: "Tolong tanya keluarga pasien dulu, karena pasien sedang diet khusus.",
        vi: "Xin hỏi người nhà bệnh nhân trước, vì bệnh nhân đang ăn theo chế độ đặc biệt.",
        en: "Please ask the patient's family first because the patient is on a special diet.",
      },
      {
        speaker: "Pengunjung",
        text: "Mengerti. Kami hanya menjenguk sebentar dan akan pamit kalau pasien lelah.",
        vi: "Tôi hiểu. Chúng tôi chỉ thăm một lát và sẽ xin phép về nếu bệnh nhân mệt.",
        en: "Understood. We will only visit briefly and take leave if the patient is tired.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Tôi muốn thăm bệnh nhân.'",
        prompt_en: "Translate into Indonesian: 'I want to visit the patient.'",
        answer: "Saya mau menjenguk pasien.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Tolong bicara dengan suara ____ di ruang rawat.`",
        prompt_en: "Fill in the blank: `Tolong bicara dengan suara ____ di ruang rawat.`",
        answer: "pelan",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["jam besuk", "giờ thăm bệnh"],
          ["keluarga pasien", "người nhà bệnh nhân"],
          ["semoga cepat sembuh", "mong sớm khỏe lại"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn đến bệnh viện. Hỏi jam besuk, xin phép membawa buah, nói sẽ giữ suara pelan, và chúc pasien semoga cepat sembuh.",
        prompt_en:
          "You arrive at a hospital. Ask about visiting hours, ask permission to bring fruit, say you will keep your voice quiet, and wish the patient a quick recovery.",
      },
    ],
    content:
      "Use this lesson for polite Indonesian when visiting a patient in hospital: checking visiting hours, speaking quietly, bringing fruit, talking with the patient's family, respecting the ward, offering good wishes, and leaving politely.",
  },
];
