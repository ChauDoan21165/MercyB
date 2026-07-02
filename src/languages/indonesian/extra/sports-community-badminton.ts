// Sports community badminton Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 27 file. Covers bulu tangkis, sewa lapangan, raket, kok,
// pasangan main, latihan, turnamen kecil, and iuran klub.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
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
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
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
export type IndonesianExercise = Record<string, unknown>;

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
    id: "indonesian_sports_community_badminton",
    level: "A2",
    category: "sports",
    title_vi: "Cộng đồng chơi cầu lông",
    title_en: "Badminton community play",
    sentences: [
      {
        en: "Saya mau ikut main bulu tangkis malam ini.",
        vi: "Tối nay tôi muốn tham gia chơi cầu lông.",
        pronunciation_focus: [
          "SA-ya MAU I-kut MA-in BU-lu TANG-kis MA-lam I-ni - `bulu tangkis` = cầu lông; `ikut main` = tham gia chơi.",
          "`ikut` rất tự nhiên khi xin tham gia một nhóm chơi thể thao.",
          "Lỗi người Việt: chỉ nói `saya main badminton` trong mọi ngữ cảnh. Người Indonesia hiểu `badminton`, nhưng tên Indonesia là `bulu tangkis`.",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU EE-koot MA-in BOO-loo TANG-kis MA-lam EE-nee - `bulu tangkis` = badminton; `ikut main` = join the game.",
          "`ikut` is natural when asking to join a sports group.",
          "VN-speaker trap: only saying `saya main badminton` everywhere. Indonesians understand `badminton`, but the Indonesian term is `bulu tangkis`.",
        ],
      },
      {
        en: "Kita sewa lapangan selama dua jam.",
        vi: "Chúng ta thuê sân trong hai giờ.",
        pronunciation_focus: [
          "KI-ta SE-wa la-PANG-an se-LA-ma DU-a jam - `sewa lapangan` = thuê sân; `selama dua jam` = trong hai giờ.",
          "`kita` gồm người nghe, hợp khi nói với nhóm đi chơi cùng.",
          "Lỗi người Việt: nói `sewa sân` hoặc `sewa tempat`. Từ sân thể thao là `lapangan`.",
        ],
        pronunciation_focus_en: [
          "KI-ta SE-wa la-PANG-an se-LA-ma DOO-a jam - `sewa lapangan` = rent a court/field; `selama dua jam` = for two hours.",
          "`kita` includes the listener, right when speaking to the group playing together.",
          "VN-speaker trap: saying mixed `sewa sân` or generic `sewa tempat`. A sports court/field is `lapangan`.",
        ],
      },
      {
        en: "Harga sewa lapangan dibagi rata per orang.",
        vi: "Giá thuê sân được chia đều theo đầu người.",
        pronunciation_focus: [
          "HAR-ga SE-wa la-PANG-an di-BA-gi RA-ta per O-rang - `dibagi rata` = được chia đều; `per orang` = mỗi người.",
          "`di-` bị động rất tự nhiên khi nói chi phí được chia cho nhóm.",
          "Lỗi người Việt: nói `bagi sama-sama` được hiểu thân mật, nhưng `dibagi rata` rõ và gọn hơn.",
        ],
        pronunciation_focus_en: [
          "HAR-ga SE-wa la-PANG-an di-BA-gee RA-ta per O-rang - `dibagi rata` = split evenly; `per orang` = per person.",
          "Passive `di-` is natural when the cost is divided among a group.",
          "VN-speaker trap: saying casual `bagi sama-sama`. `Dibagi rata` is clearer and cleaner.",
        ],
      },
      {
        en: "Saya bawa raket sendiri, tapi lupa bawa kok.",
        vi: "Tôi mang vợt riêng, nhưng quên mang quả cầu.",
        pronunciation_focus: [
          "SA-ya BA-wa RA-ket sen-DI-ri, TA-pi LU-pa BA-wa kok - `raket` = vợt; `kok` = quả cầu lông.",
          "`sendiri` ở đây nghĩa là của riêng mình/tự mang theo.",
          "Lỗi người Việt: dịch `quả cầu` thành `bola`. Trong cầu lông Indonesia nói `kok`, không phải `bola`.",
        ],
        pronunciation_focus_en: [
          "SA-ya BA-wa RA-ket sen-DEE-ree, TA-pee LOO-pa BA-wa kok - `raket` = racket; `kok` = shuttlecock.",
          "`sendiri` here means one's own/brought personally.",
          "VN-speaker trap: translating the shuttle as `bola`. In Indonesian badminton, use `kok`, not `bola`.",
        ],
      },
      {
        en: "Ada pasangan main untuk ganda campuran?",
        vi: "Có bạn đánh cặp cho đôi nam nữ không?",
        pronunciation_focus: [
          "A-da pa-SA-ngan MA-in UN-tuk GAN-da cam-PU-ran - `pasangan main` = bạn đánh cặp; `ganda campuran` = đôi nam nữ.",
          "`pasangan` không chỉ là người yêu/vợ chồng; trong thể thao là người đánh đôi/cặp.",
          "Lỗi người Việt: hiểu `pasangan` chỉ là bạn đời. Trong cầu lông, `pasangan main` rất tự nhiên.",
        ],
        pronunciation_focus_en: [
          "A-da pa-SA-ngan MA-in UN-tuk GAN-da cham-POO-ran - `pasangan main` = playing partner; `ganda campuran` = mixed doubles.",
          "`pasangan` is not only romantic/spouse; in sports it means doubles partner/pair.",
          "VN-speaker trap: reading `pasangan` only as life partner. In badminton, `pasangan main` is natural.",
        ],
      },
      {
        en: "Latihan hari ini fokus pada servis pendek.",
        vi: "Buổi tập hôm nay tập trung vào giao cầu ngắn.",
        pronunciation_focus: [
          "LA-tih-an HA-ri I-ni FO-kus PA-da SER-vis PEN-dek - `latihan` = buổi tập/bài tập; `servis pendek` = giao cầu ngắn.",
          "`fokus pada` = tập trung vào; dùng được trong thể thao và công việc.",
          "Lỗi người Việt: nói `service` kiểu Anh. Trong tiếng Indonesia thường viết/đọc `servis`.",
        ],
        pronunciation_focus_en: [
          "LA-tih-an HA-ree EE-nee FO-kus PA-da SER-vis PEN-dek - `latihan` = practice/training; `servis pendek` = short serve.",
          "`fokus pada` = focus on; useful in sports and work.",
          "VN-speaker trap: saying English-style `service`. Indonesian usually writes/says `servis`.",
        ],
      },
      {
        en: "Kalau capek, kita istirahat sebentar di pinggir lapangan.",
        vi: "Nếu mệt, chúng ta nghỉ một chút bên cạnh sân.",
        pronunciation_focus: [
          "KA-lau CA-pek, KI-ta is-ti-RA-hat se-BEN-tar di PING-gir la-PANG-an - `capek` = mệt; `pinggir lapangan` = bên cạnh sân.",
          "`sebentar` = một lát/một chút thời gian; rất hay dùng khi nghỉ tạm.",
          "Lỗi người Việt: nói `nghỉ chút` nửa Việt nửa Indo. Cụm Indonesia là `istirahat sebentar`.",
        ],
        pronunciation_focus_en: [
          "KA-lau CHA-pek, KI-ta is-ti-RA-hat se-BEN-tar di PING-gir la-PANG-an - `capek` = tired; `pinggir lapangan` = side of the court.",
          "`sebentar` = for a short while; common for taking a quick break.",
          "VN-speaker trap: saying mixed `nghỉ chút`. Indonesian phrase: `istirahat sebentar`.",
        ],
      },
      {
        en: "Klub kami mengadakan turnamen kecil bulan depan.",
        vi: "Câu lạc bộ của chúng tôi tổ chức giải đấu nhỏ vào tháng sau.",
        pronunciation_focus: [
          "klub KA-mi meng-a-DA-kan tur-na-MEN KE-cil BU-lan de-PAN - `mengadakan` = tổ chức; `turnamen kecil` = giải đấu nhỏ.",
          "`bulan depan` = tháng sau; không cần giới từ trước cụm thời gian này.",
          "Lỗi người Việt: dùng `membuat turnamen` theo nghĩa tổ chức. Tự nhiên hơn: `mengadakan turnamen`.",
        ],
        pronunciation_focus_en: [
          "klub KA-mi meng-a-DA-kan toor-na-MEN KE-chil BOO-lan de-PAN - `mengadakan` = hold/organize; `turnamen kecil` = small tournament.",
          "`bulan depan` = next month; no preposition needed before this time phrase.",
          "VN-speaker trap: using `membuat turnamen` for organizing. More natural: `mengadakan turnamen`.",
        ],
      },
      {
        en: "Iuran klub dibayar setiap awal bulan.",
        vi: "Phí câu lạc bộ được đóng vào đầu mỗi tháng.",
        pronunciation_focus: [
          "I-u-ran klub di-BA-yar se-TI-ap A-wal BU-lan - `iuran klub` = phí/quỹ câu lạc bộ; `awal bulan` = đầu tháng.",
          "`dibayar` là bị động: được trả/đóng. Dùng tự nhiên cho phí định kỳ.",
          "Lỗi người Việt: nói `uang klub` quá chung. Nếu là khoản đóng góp định kỳ, dùng `iuran klub`.",
        ],
        pronunciation_focus_en: [
          "EE-oo-ran klub di-BA-yar se-TEE-ap A-wal BOO-lan - `iuran klub` = club dues; `awal bulan` = beginning of the month.",
          "`dibayar` is passive: paid. Natural for recurring fees.",
          "VN-speaker trap: saying generic `uang klub`. For recurring contributions, use `iuran klub`.",
        ],
      },
      {
        en: "Setelah main, kita biasanya makan bersama di warung dekat GOR.",
        vi: "Sau khi chơi, chúng ta thường ăn cùng nhau ở quán gần nhà thi đấu.",
        pronunciation_focus: [
          "se-TE-lah MA-in, KI-ta bi-A-sa-nya MA-kan ber-SA-ma di WA-rung de-KAT ge-o-er - `GOR` = nhà thi đấu; `makan bersama` = ăn cùng nhau.",
          "`GOR` đọc từng chữ ge-o-er; viết tắt của gedung olahraga.",
          "Lỗi người Việt: gọi mọi sân là `stadion`. Cầu lông trong nhà thường ở `GOR` hoặc `lapangan badminton`.",
        ],
        pronunciation_focus_en: [
          "se-TE-lah MA-in, KI-ta bi-A-sa-nya MA-kan ber-SA-ma di WA-roong de-KAT ge-o-er - `GOR` = sports hall; `makan bersama` = eat together.",
          "`GOR` is spelled ge-o-er; it abbreviates gedung olahraga.",
          "VN-speaker trap: calling every sports venue `stadion`. Indoor badminton is often at a `GOR` or `lapangan badminton`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Cầu lông là môn thể thao rất phổ biến ở Indonesia, từ sân trong khu dân cư đến GOR và câu lạc bộ nhỏ. Người chơi thường chia tiền `sewa lapangan`, mua `kok` chung, tìm `pasangan main`, và đóng `iuran klub` để thuê sân hoặc tổ chức `turnamen kecil`. Sau buổi chơi, nhóm thường đi ăn ở `warung` gần sân, nên cầu lông cũng là hoạt động xã giao chứ không chỉ là thể thao.",
    cultural_notes_en:
      "Badminton is very popular in Indonesia, from neighborhood courts to sports halls and small clubs. Players often split `sewa lapangan`, buy shuttlecocks together, find a `pasangan main`, and pay `iuran klub` to rent courts or hold a `turnamen kecil`. After playing, groups often eat at a nearby `warung`, so badminton is also a social activity, not only a sport.",
    tip_advice_vi:
      "Mẹo cho người Việt: `bulu tangkis` là tên Indonesia của cầu lông; `raket` là vợt; `kok` là quả cầu; `lapangan` là sân; `ganda` là đánh đôi. Khi xin tham gia, nói nhẹ: `Boleh saya ikut main?` Khi hỏi chi phí, dùng `sewa lapangannya berapa?` và `iuran klubnya berapa?`",
    tip_advice_en:
      "Tip for Vietnamese speakers: `bulu tangkis` is Indonesian for badminton; `raket` is racket; `kok` is shuttlecock; `lapangan` is court; `ganda` is doubles. To join, say gently: `Boleh saya ikut main?` To ask costs, use `sewa lapangannya berapa?` and `iuran klubnya berapa?`",
    vocabulary: [
      { word: "bulu tangkis", en: "badminton", vi: "cầu lông", pos: "noun", pronunciation_vi: "BU-lu TANG-kis", pronunciation_en: "BOO-loo TANG-kis" },
      { word: "sewa lapangan", en: "rent a court", vi: "thuê sân", pos: "verb/noun phrase", pronunciation_vi: "SE-wa la-PANG-an", pronunciation_en: "SE-wa la-PANG-an" },
      { word: "raket", en: "racket", vi: "vợt", pos: "noun", pronunciation_vi: "RA-ket", pronunciation_en: "RA-ket" },
      { word: "kok", en: "shuttlecock", vi: "quả cầu lông", pos: "noun", pronunciation_vi: "kok", pronunciation_en: "kok" },
      { word: "pasangan main", en: "playing partner", vi: "bạn đánh cặp", pos: "noun phrase", pronunciation_vi: "pa-SA-ngan MA-in", pronunciation_en: "pa-SA-ngan MA-in" },
      { word: "latihan", en: "practice / training", vi: "buổi tập/bài tập", pos: "noun", pronunciation_vi: "LA-tih-an", pronunciation_en: "LA-tih-an" },
      { word: "turnamen kecil", en: "small tournament", vi: "giải đấu nhỏ", pos: "noun phrase", pronunciation_vi: "tur-na-MEN KE-cil", pronunciation_en: "toor-na-MEN KE-chil" },
      { word: "iuran klub", en: "club dues", vi: "phí/quỹ câu lạc bộ", pos: "noun phrase", pronunciation_vi: "I-u-ran klub", pronunciation_en: "EE-oo-ran klub" },
      { word: "ganda campuran", en: "mixed doubles", vi: "đôi nam nữ", pos: "noun phrase", pronunciation_vi: "GAN-da cam-PU-ran", pronunciation_en: "GAN-da cham-POO-ran" },
      { word: "GOR", en: "sports hall", vi: "nhà thi đấu", pos: "noun", pronunciation_vi: "ge-o-er", pronunciation_en: "geh-oh-er" },
    ],
    dialogue: [
      {
        speaker: "Dina",
        text: "Malam ini ada jadwal bulu tangkis di GOR?",
        vi: "Tối nay có lịch cầu lông ở nhà thi đấu không?",
        en: "Is there a badminton schedule at the sports hall tonight?",
      },
      {
        speaker: "Rafi",
        text: "Ada. Kita sewa lapangan dari jam tujuh sampai jam sembilan.",
        vi: "Có. Chúng ta thuê sân từ bảy giờ đến chín giờ.",
        en: "Yes. We rent the court from seven to nine.",
      },
      {
        speaker: "Dina",
        text: "Saya bawa raket sendiri. Perlu bawa kok juga?",
        vi: "Tôi mang vợt riêng. Có cần mang quả cầu nữa không?",
        en: "I will bring my own racket. Should I bring shuttlecocks too?",
      },
      {
        speaker: "Rafi",
        text: "Kok sudah ada. Nanti biaya lapangan dibagi rata.",
        vi: "Quả cầu có rồi. Lát nữa tiền sân chia đều.",
        en: "We already have shuttlecocks. Later the court fee will be split evenly.",
      },
      {
        speaker: "Dina",
        text: "Baik. Kalau ada pasangan main untuk ganda campuran, saya ikut.",
        vi: "Được. Nếu có bạn đánh cặp cho đôi nam nữ, tôi tham gia.",
        en: "Okay. If there is a partner for mixed doubles, I will join.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "bulu tangkis", answer: "cầu lông" },
          { prompt: "kok", answer: "quả cầu lông" },
          { prompt: "pasangan main", answer: "bạn đánh cặp" },
          { prompt: "iuran klub", answer: "phí câu lạc bộ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Chúng ta thuê sân trong hai giờ.", answer: "Kita sewa lapangan selama dua jam." },
          { prompt: "Tôi mang vợt riêng, nhưng quên mang quả cầu.", answer: "Saya bawa raket sendiri, tapi lupa bawa kok." },
          { prompt: "Câu lạc bộ của chúng tôi tổ chức giải đấu nhỏ vào tháng sau.", answer: "Klub kami mengadakan turnamen kecil bulan depan." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Harga sewa lapangan ___ rata per orang.", answer: "dibagi" },
          { prompt: "Latihan hari ini fokus pada servis ___.", answer: "pendek" },
          { prompt: "Iuran klub dibayar setiap ___ bulan.", answer: "awal" },
        ],
      },
    ],
  },
];
