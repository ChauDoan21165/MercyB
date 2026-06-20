// Wedding Guest Etiquette Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_wedding_guest_etiquette",
    level: "A2",
    category: "culture",
    title_vi: "Làm khách dự đám cưới Indonesia",
    title_en: "Indonesian wedding guest etiquette",
    sentences: [
      {
        en: "Saya datang ke resepsi pernikahan teman saya.",
        vi: "Tôi đến dự tiệc cưới của bạn tôi.",
        pronunciation_focus: [
          "SA-ya DA-tang ke re-SEP-si per-ni-KA-han TE-man SA-ya -- `resepsi pernikahan` = tiệc cưới/lễ tiếp khách.",
          "Lỗi người Việt: dùng `di resepsi` khi nói hướng đi. Đi đến tiệc dùng `ke resepsi`; ở tiệc dùng `di resepsi`.",
          "Luyện: `Saya datang ke resepsi pernikahan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya DA-tang ke re-SEP-si per-ni-KA-han TE-man SA-ya -- `resepsi pernikahan` = wedding reception.",
          "VN-speaker trap: using `di resepsi` for movement. Going to the reception takes `ke`; being there takes `di`.",
          "Drill: `Saya datang ke resepsi pernikahan.`",
        ],
      },
      {
        en: "Saya bawa amplop untuk pengantin.",
        vi: "Tôi mang phong bì cho cô dâu chú rể.",
        pronunciation_focus: [
          "SA-ya BA-wa AM-plop UN-tuk pe-NGAN-tin -- `amplop` = phong bì tiền mừng; `pengantin` = cô dâu chú rể.",
          "Mẹo: `amplop` ở ngữ cảnh đám cưới thường hiểu là tiền mừng trong phong bì, giống văn hóa Việt.",
          "Luyện: `Saya bawa amplop untuk pengantin.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BA-wa AM-plop OON-tuk pe-NGAN-tin -- `amplop` = wedding envelope; `pengantin` = bride and groom/newlyweds.",
          "Tip: in a wedding context, `amplop` usually means gift money in an envelope, similar to Vietnamese practice.",
          "Drill: `Saya bawa amplop untuk pengantin.`",
        ],
      },
      {
        en: "Selamat menempuh hidup baru.",
        vi: "Chúc mừng bắt đầu cuộc sống mới.",
        pronunciation_focus: [
          "se-LA-mat me-NEM-puh HI-dup BA-ru -- lời chúc cưới trang trọng, rất phổ biến.",
          "`selamat` dùng cho lời chúc: `selamat ulang tahun`, `selamat datang`, `selamat menempuh hidup baru`.",
          "Luyện: `Selamat menempuh hidup baru.`",
        ],
        pronunciation_focus_en: [
          "se-LA-mat me-NEM-puh HI-dup BA-roo -- a formal wedding wish, very common.",
          "`Selamat` is used for wishes: `selamat ulang tahun`, `selamat datang`, `selamat menempuh hidup baru`.",
          "Drill: `Selamat menempuh hidup baru.`",
        ],
      },
      {
        en: "Pakaian saya harus sopan untuk acara keluarga.",
        vi: "Trang phục của tôi phải lịch sự/kín đáo cho sự kiện gia đình.",
        pronunciation_focus: [
          "pa-KAI-an SA-ya HA-rus SO-pan UN-tuk a-CA-ra ke-LU-ar-ga -- `pakaian sopan` = trang phục lịch sự/kín đáo.",
          "Lỗi người Việt: dịch 'đẹp' là đủ. Ở đám cưới gia đình, tiêu chí quan trọng là `sopan`, không chỉ `bagus`.",
          "Luyện: `Pakaian saya harus sopan.`",
        ],
        pronunciation_focus_en: [
          "pa-KAI-an SA-ya HA-rus SO-pan OON-tuk a-CHA-ra ke-LOO-ar-ga -- `pakaian sopan` = modest/respectful clothing.",
          "VN-speaker trap: thinking 'nice' is enough. At a family wedding, `sopan` matters, not only `bagus`.",
          "Drill: `Pakaian saya harus sopan.`",
        ],
      },
      {
        en: "Boleh foto bersama pengantin?",
        vi: "Có thể chụp ảnh cùng cô dâu chú rể không?",
        pronunciation_focus: [
          "BO-leh FO-to ber-SA-ma pe-NGAN-tin -- `foto bersama` = chụp ảnh cùng nhau.",
          "`boleh` hỏi xin phép. Đừng dùng `bisa` nếu ý chính là phép lịch sự trước khi chụp.",
          "Luyện: `Boleh foto bersama pengantin?`",
        ],
        pronunciation_focus_en: [
          "BO-leh FO-to ber-SA-ma pe-NGAN-tin -- `foto bersama` = take a photo together.",
          "`Boleh` asks permission. Do not use `bisa` if the main point is polite permission before taking a photo.",
          "Drill: `Boleh foto bersama pengantin?`",
        ],
      },
      {
        en: "Prasmanannya sudah dibuka?",
        vi: "Quầy buffet đã mở chưa?",
        pronunciation_focus: [
          "pras-MA-nan-nya SU-dah di-BU-ka -- `prasmanan` = buffet/tiệc tự chọn; `dibuka` = được mở.",
          "Mẹo: ở nhiều resepsi Indonesia, khách ăn `prasmanan`; nên đợi quầy mở hoặc theo dòng khách.",
          "Luyện: `Prasmanannya sudah dibuka?`",
        ],
        pronunciation_focus_en: [
          "pras-MA-nan-nya SOO-dah di-BOO-ka -- `prasmanan` = buffet; `dibuka` = opened.",
          "Tip: at many Indonesian receptions, guests eat buffet-style; wait until the buffet opens or follow the guest flow.",
          "Drill: `Prasmanannya sudah dibuka?`",
        ],
      },
      {
        en: "Saya ikut salam pengantin dulu sebelum makan.",
        vi: "Tôi chào cô dâu chú rể trước rồi mới ăn.",
        pronunciation_focus: [
          "SA-ya I-kut SA-lam pe-NGAN-tin DU-lu se-BE-lum MA-kan -- `salam pengantin` = chào/chúc mừng cô dâu chú rể.",
          "`dulu` ở cuối cụm nghĩa là 'trước đã'. Rất tự nhiên trong câu lịch sự: `salam dulu`, `makan dulu`.",
          "Luyện: `Saya salam pengantin dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-kut SA-lam pe-NGAN-tin DOO-loo se-BE-lum MA-kan -- `salam pengantin` = greet/congratulate the newlyweds.",
          "`Dulu` after the phrase means 'first/for now'. It is natural in polite chunks: `salam dulu`, `makan dulu`.",
          "Drill: `Saya salam pengantin dulu.`",
        ],
      },
      {
        en: "Adat keluarga pengantin harus dihormati.",
        vi: "Phong tục của gia đình cô dâu chú rể phải được tôn trọng.",
        pronunciation_focus: [
          "A-dat ke-LU-ar-ga pe-NGAN-tin HA-rus di-hor-MA-ti -- `adat` = phong tục; `dihormati` = được tôn trọng.",
          "Lỗi người Việt: nói `harus hormat adat` nghe thiếu tự nhiên. Câu chuẩn: `adat ... harus dihormati`.",
          "Luyện: `Adat keluarga harus dihormati.`",
        ],
        pronunciation_focus_en: [
          "A-dat ke-LOO-ar-ga pe-NGAN-tin HA-rus di-hor-MA-ti -- `adat` = custom; `dihormati` = respected.",
          "VN-speaker trap: saying `harus hormat adat`, which sounds incomplete. Standard: `adat ... harus dihormati`.",
          "Drill: `Adat keluarga harus dihormati.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khách dự cưới Indonesia thường đến `resepsi`, ký sổ khách, bỏ `amplop`, chào gia đình và `pengantin`, chụp ảnh nếu có hàng chờ, rồi ăn `prasmanan`. Trang phục nên `sopan`: kín đáo, gọn gàng, tránh quá nổi bật hơn cô dâu chú rể. Mỗi vùng và mỗi gia đình có `adat` riêng; nếu không chắc, hãy quan sát người địa phương hoặc hỏi nhẹ `Biasanya bagaimana di sini?`",
    cultural_notes_en:
      "Indonesian wedding guests often attend the reception, sign the guest book, place an envelope, greet the family and newlyweds, take photos if there is a queue, then eat at the buffet. Clothing should be `sopan`: modest, neat, and not more attention-grabbing than the couple. Each region and family may have its own customs; when unsure, observe local guests or ask gently, `Biasanya bagaimana di sini?`",
    tip_advice_vi:
      "Mẹo cho người Việt: văn hóa phong bì và chào cô dâu chú rể khá giống Việt Nam, nên phần khó là từ vựng: `resepsi`, `amplop`, `pengantin`, `pakaian sopan`, `foto bersama`, `prasmanan`, `adat keluarga`. Khi cần lịch sự, dùng `boleh... ?` để xin phép và `selamat...` để chúc mừng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: envelope gifts and greeting the couple feel similar to Vietnam, so the hard part is vocabulary: `resepsi`, `amplop`, `pengantin`, `pakaian sopan`, `foto bersama`, `prasmanan`, `adat keluarga`. Use `boleh... ?` for polite permission and `selamat...` for congratulations.",
    vocabulary: [
      {
        word: "resepsi",
        en: "reception",
        vi: "tiệc cưới / lễ tiếp khách",
        pos: "noun",
        pronunciation_vi: "re-SEP-si",
        pronunciation_en: "re-SEP-see",
      },
      {
        word: "amplop",
        en: "envelope gift",
        vi: "phong bì tiền mừng",
        pos: "noun",
        pronunciation_vi: "AM-plop",
        pronunciation_en: "AM-plop",
      },
      {
        word: "pengantin",
        en: "bride and groom / newlyweds",
        vi: "cô dâu chú rể",
        pos: "noun",
        pronunciation_vi: "pe-NGAN-tin",
        pronunciation_en: "pe-NGAN-tin",
      },
      {
        word: "pakaian sopan",
        en: "modest/respectful clothing",
        vi: "trang phục lịch sự/kín đáo",
        pos: "noun phrase",
        pronunciation_vi: "pa-KAI-an SO-pan",
        pronunciation_en: "pa-KAI-an SO-pan",
      },
      {
        word: "foto bersama",
        en: "photo together",
        vi: "chụp ảnh cùng nhau",
        pos: "noun / verb phrase",
        pronunciation_vi: "FO-to ber-SA-ma",
        pronunciation_en: "FO-to ber-SA-ma",
      },
      {
        word: "prasmanan",
        en: "buffet",
        vi: "tiệc tự chọn / buffet",
        pos: "noun",
        pronunciation_vi: "pras-MA-nan",
        pronunciation_en: "pras-MA-nan",
      },
      {
        word: "adat keluarga",
        en: "family custom",
        vi: "phong tục gia đình",
        pos: "noun phrase",
        pronunciation_vi: "A-dat ke-LU-ar-ga",
        pronunciation_en: "A-dat ke-LOO-ar-ga",
      },
      {
        word: "salam pengantin",
        en: "greet/congratulate the newlyweds",
        vi: "chào/chúc mừng cô dâu chú rể",
        pos: "verb phrase",
        pronunciation_vi: "SA-lam pe-NGAN-tin",
        pronunciation_en: "SA-lam pe-NGAN-tin",
      },
      {
        word: "selamat menempuh hidup baru",
        en: "wedding congratulations",
        vi: "chúc mừng cuộc sống mới",
        pos: "phrase",
        pronunciation_vi: "se-LA-mat me-NEM-puh HI-dup BA-ru",
        pronunciation_en: "se-LA-mat me-NEM-puh HI-dup BA-roo",
      },
      {
        word: "tamu undangan",
        en: "invited guest",
        vi: "khách được mời",
        pos: "noun phrase",
        pronunciation_vi: "TA-mu un-DANG-an",
        pronunciation_en: "TA-moo oon-DANG-an",
      },
    ],
    dialogue: [
      {
        speaker: "Tamu",
        text: "Permisi, amplopnya ditaruh di mana?",
        vi: "Xin lỗi, phong bì đặt ở đâu ạ?",
        en: "Excuse me, where should the envelope be placed?",
      },
      {
        speaker: "Panitia",
        text: "Di kotak depan, lalu silakan salam pengantin.",
        vi: "Ở hộp phía trước, rồi mời chào cô dâu chú rể.",
        en: "In the box at the front, then please greet the newlyweds.",
      },
      {
        speaker: "Tamu",
        text: "Boleh foto bersama setelah salam?",
        vi: "Sau khi chào có thể chụp ảnh cùng không?",
        en: "May we take a photo together after greeting them?",
      },
      {
        speaker: "Panitia",
        text: "Boleh, tapi mohon antre sebentar.",
        vi: "Được, nhưng xin xếp hàng một chút.",
        en: "Yes, but please queue for a moment.",
      },
      {
        speaker: "Tamu",
        text: "Baik. Selamat menempuh hidup baru untuk pengantin.",
        vi: "Vâng. Chúc cô dâu chú rể bắt đầu cuộc sống mới hạnh phúc.",
        en: "Okay. Congratulations to the newlyweds on their new life.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi mang phong bì cho cô dâu chú rể.",
        prompt_en: "Translate into Indonesian: I bring an envelope for the newlyweds.",
        answer: "Saya bawa amplop untuk pengantin.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Boleh foto bersama ____?",
        prompt_en: "Fill in the blank: Boleh foto bersama ____?",
        answer: "pengantin",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["resepsi", "tiệc cưới / reception"],
          ["amplop", "phong bì / envelope gift"],
          ["prasmanan", "buffet / tiệc tự chọn"],
          ["adat keluarga", "phong tục gia đình / family custom"],
        ],
      },
    ],
    content:
      "Useful wedding-guest chunks: `Saya datang ke resepsi` (I come to the reception), `Saya bawa amplop` (I bring an envelope), `Selamat menempuh hidup baru` (wedding congratulations), `Boleh foto bersama?` (may we take a photo together?), `Prasmanannya sudah dibuka?` (is the buffet open?), and `Adat keluarga harus dihormati` (family customs must be respected).",
  },
];
