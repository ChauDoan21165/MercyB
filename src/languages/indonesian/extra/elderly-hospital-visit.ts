// Elderly Hospital Visit Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for visiting elderly parents in hospital:
// inpatient care, visiting hours, medicine, nurses, wheelchairs, family rotation,
// and improving condition. Indonesian target text lives in `en`, Vietnamese
// glosses in `vi`, Vietnamese L1 notes in `pronunciation_focus`, and English
// companions in `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
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
  /** Part of speech. */
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

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
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

export const elderlyHospitalVisitLessons: IndonesianLesson[] = [
  {
    id: "indonesian_elderly_hospital_visit",
    level: "A2",
    category: "health_family",
    title_vi: "Menjenguk orang tua ở bệnh viện",
    title_en: "Visiting an elderly parent in hospital",
    sentences: [
      {
        en: "Saya mau menjenguk ayah saya yang sedang rawat inap.",
        vi: "Tôi muốn vào thăm bố tôi đang điều trị nội trú.",
        pronunciation_focus: [
          "men-JENG-uk - `menjenguk` = đi thăm người bệnh/người lớn tuổi.",
          "`rawat inap` = điều trị nội trú/nằm viện; khác `rawat jalan` là ngoại trú.",
          "Lỗi người Việt: dùng `mengunjungi` vẫn hiểu, nhưng với người bệnh tự nhiên hơn là `menjenguk`.",
          "Luyện: `Saya mau menjenguk ayah saya.`",
        ],
        pronunciation_focus_en: [
          "men-JENG-uk - `menjenguk` = visit someone who is sick or elderly.",
          "`rawat inap` = inpatient care / staying overnight; different from outpatient `rawat jalan`.",
          "VN-speaker trap: `mengunjungi` is understood, but for a sick person `menjenguk` is more natural.",
          "Drill: `Saya mau menjenguk ayah saya.`",
        ],
      },
      {
        en: "Jam besuk rumah sakit mulai pukul empat sore.",
        vi: "Giờ thăm bệnh của bệnh viện bắt đầu lúc bốn giờ chiều.",
        pronunciation_focus: [
          "JAM be-SUK - `jam besuk` = giờ thăm bệnh.",
          "`pukul empat sore` = 4 giờ chiều; `pukul` trang trọng hơn `jam` khi nói giờ chính xác.",
          "Lỗi người Việt: nói `jam lihat sakit` là dịch chữ. Cụm đúng là `jam besuk`.",
          "Luyện: `Jam besuk mulai pukul empat sore.`",
        ],
        pronunciation_focus_en: [
          "JAM be-SUK - `jam besuk` = hospital visiting hours.",
          "`pukul empat sore` = 4 p.m.; `pukul` is more formal than `jam` for clock time.",
          "VN-speaker trap: saying translated `jam lihat sakit`. The fixed phrase is `jam besuk`.",
          "Drill: `Jam besuk mulai pukul empat sore.`",
        ],
      },
      {
        en: "Kami harus lapor dulu ke perawat di meja jaga.",
        vi: "Chúng tôi phải báo trước với y tá ở bàn trực.",
        pronunciation_focus: [
          "LA-por DU-lu - `lapor dulu` = báo/đăng ký trước đã.",
          "`perawat` = y tá/điều dưỡng; `meja jaga` = bàn trực của nhân viên.",
          "`dulu` cuối câu/cụm = trước đã, rất hay dùng khi làm thủ tục.",
          "Luyện: `Kami lapor dulu ke perawat.`",
        ],
        pronunciation_focus_en: [
          "LA-por DOO-loo - `lapor dulu` = report/check in first.",
          "`perawat` = nurse; `meja jaga` = staff/nurse station.",
          "Sentence-final `dulu` = first/for now, very common in procedures.",
          "Drill: `Kami lapor dulu ke perawat.`",
        ],
      },
      {
        en: "Boleh pinjam kursi roda untuk membawa Ibu ke ruang periksa?",
        vi: "Có thể mượn xe lăn để đưa mẹ đến phòng khám không?",
        pronunciation_focus: [
          "KUR-si RO-da - `kursi roda` = xe lăn.",
          "`boleh pinjam` = có thể mượn được không; lịch sự và ngắn gọn.",
          "`membawa Ibu ke ruang periksa` = đưa mẹ đến phòng khám/kiểm tra.",
          "Luyện: `Boleh pinjam kursi roda?`",
        ],
        pronunciation_focus_en: [
          "KUR-see RO-da - `kursi roda` = wheelchair.",
          "`boleh pinjam` = may I borrow; polite and concise.",
          "`membawa Ibu ke ruang periksa` = take Mother to the examination room.",
          "Drill: `Boleh pinjam kursi roda?`",
        ],
      },
      {
        en: "Obat malam sudah diberikan oleh perawat.",
        vi: "Thuốc buổi tối đã được y tá cho uống/phát rồi.",
        pronunciation_focus: [
          "O-bat MA-lam - `obat malam` = thuốc buổi tối.",
          "`sudah diberikan` = đã được đưa/cho; bị động `di-` rất quan trọng trong bệnh viện.",
          "Lỗi người Việt: nói `perawat kasih obat sudah` nghe khẩu ngữ. Câu hồ sơ: `obat sudah diberikan`.",
          "Luyện: `Obat sudah diberikan oleh perawat.`",
        ],
        pronunciation_focus_en: [
          "O-bat MA-lam - `obat malam` = evening medicine.",
          "`sudah diberikan` = has been given; passive `di-` is important in hospital contexts.",
          "VN-speaker trap: casual `perawat kasih obat sudah`. Chart-style wording: `obat sudah diberikan`.",
          "Drill: `Obat sudah diberikan oleh perawat.`",
        ],
      },
      {
        en: "Keluarga kami bergiliran menemani nenek di kamar rawat.",
        vi: "Gia đình chúng tôi thay phiên nhau ở cùng bà trong phòng bệnh.",
        pronunciation_focus: [
          "ber-gi-LIR-an - `bergiliran` = luân phiên/thay phiên nhau.",
          "`menemani nenek` = ở cạnh/làm bạn với bà; mềm hơn chỉ nói `jaga`.",
          "`kamar rawat` = phòng điều trị/phòng bệnh; khác `kamar tidur` ở nhà.",
          "Luyện: `Keluarga kami bergiliran menemani nenek.`",
        ],
        pronunciation_focus_en: [
          "ber-gi-LEE-ran - `bergiliran` = take turns.",
          "`menemani nenek` = accompany grandmother; softer than only saying `jaga`.",
          "`kamar rawat` = patient room/ward room; different from a bedroom at home.",
          "Drill: `Keluarga kami bergiliran menemani nenek.`",
        ],
      },
      {
        en: "Dokter bilang kondisi beliau sudah membaik.",
        vi: "Bác sĩ nói tình trạng của cụ/bố mẹ đã tốt lên.",
        pronunciation_focus: [
          "kon-DI-si be-LI-au - `kondisi beliau` = tình trạng của ông/bà/người đáng kính.",
          "`membaik` = tốt lên/cải thiện; gốc `baik` = tốt.",
          "`beliau` lịch sự hơn `dia` khi nói về cha mẹ/người lớn tuổi.",
          "Luyện: `Kondisi beliau sudah membaik.`",
        ],
        pronunciation_focus_en: [
          "kon-DEE-see be-LEE-au - `kondisi beliau` = his/her condition, respectfully.",
          "`membaik` = improve/get better; root `baik` = good.",
          "`beliau` is more respectful than `dia` for parents or elders.",
          "Drill: `Kondisi beliau sudah membaik.`",
        ],
      },
      {
        en: "Apakah pasien boleh makan makanan dari rumah?",
        vi: "Bệnh nhân có được ăn đồ ăn từ nhà mang vào không?",
        pronunciation_focus: [
          "PA-sien BO-leh MA-kan - `pasien` = bệnh nhân; `boleh` hỏi được phép.",
          "`makanan dari rumah` = đồ ăn từ nhà; cần hỏi vì bệnh viện có aturan diet.",
          "Lỗi người Việt: hỏi quá ngắn `boleh bawa makanan?` được, nhưng rõ hơn là `pasien boleh makan... ?`.",
          "Luyện: `Apakah pasien boleh makan makanan dari rumah?`",
        ],
        pronunciation_focus_en: [
          "PA-sien BOH-leh MA-kan - `pasien` = patient; `boleh` asks permission.",
          "`makanan dari rumah` = food from home; ask because hospitals may have diet rules.",
          "VN-speaker trap: short `boleh bawa makanan?` works, but clearer is `pasien boleh makan... ?`.",
          "Drill: `Apakah pasien boleh makan makanan dari rumah?`",
        ],
      },
      {
        en: "Tolong kabari kami kalau ada perubahan kondisi.",
        vi: "Xin báo cho chúng tôi nếu có thay đổi tình trạng.",
        pronunciation_focus: [
          "ka-BA-ri KA-mi - `kabari kami` = báo tin cho chúng tôi.",
          "`perubahan kondisi` = thay đổi tình trạng; cụm bệnh viện rất tự nhiên.",
          "`kalau ada...` = nếu có...; dùng linh hoạt trong yêu cầu với perawat.",
          "Luyện: `Tolong kabari kami.`",
        ],
        pronunciation_focus_en: [
          "ka-BA-ree KA-mee - `kabari kami` = let us know / inform us.",
          "`perubahan kondisi` = change in condition; natural hospital wording.",
          "`kalau ada...` = if there is...; flexible in requests to nurses.",
          "Drill: `Tolong kabari kami.`",
        ],
      },
      {
        en: "Kami berharap beliau bisa pulang minggu ini.",
        vi: "Chúng tôi hy vọng cụ/bố mẹ có thể xuất viện về nhà trong tuần này.",
        pronunciation_focus: [
          "ber-HA-rap be-LI-au BI-sa PU-lang - `berharap` = hy vọng; `pulang` = về nhà/xuất viện tùy ngữ cảnh.",
          "`minggu ini` = tuần này; `minggu` có thể là tuần hoặc Chủ nhật, tùy câu.",
          "Mẹo: nói `bisa pulang` ở bệnh viện thường hiểu là được về nhà sau điều trị.",
          "Luyện: `Kami berharap beliau bisa pulang.`",
        ],
        pronunciation_focus_en: [
          "ber-HA-rap be-LEE-au BEE-sa POO-lang - `berharap` = hope; `pulang` = go home / be discharged by context.",
          "`minggu ini` = this week; `minggu` can mean week or Sunday depending on context.",
          "Tip: in a hospital, `bisa pulang` usually means allowed to go home after treatment.",
          "Drill: `Kami berharap beliau bisa pulang.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi `menjenguk` người thân lớn tuổi ở bệnh viện Indonesia, luôn kiểm tra `jam besuk`, số người được vào, và aturan phòng bệnh. Gia đình thường `bergiliran` menemani pasien, nhất là với orang tua lanjut usia. Nên hỏi perawat trước khi đưa makanan dari rumah, mượn kursi roda, hoặc đưa pasien ra khỏi kamar rawat. Khi nói về cha mẹ/người cao tuổi, `beliau` nghe kính trọng hơn `dia`.",
    cultural_notes_en:
      "When visiting an elderly relative in an Indonesian hospital, always check `jam besuk`, the number of visitors allowed, and ward rules. Families often take turns accompanying the patient, especially for elderly parents. Ask the nurse before bringing food from home, borrowing a wheelchair, or taking the patient out of the ward room. For parents and elders, `beliau` sounds more respectful than `dia`.",
    tip_advice_vi:
      "Mẹo cho người Việt: `menjenguk` là từ rất đúng cho thăm người bệnh, không chỉ là `mengunjungi`. Cần phân biệt `rawat inap` (nội trú) và `rawat jalan` (ngoại trú). Với bệnh viện, các cụm an toàn là `jam besuk`, `lapor ke perawat`, `kursi roda`, `kamar rawat`, `obat sudah diberikan`, `kondisi membaik`, `tolong kabari kami`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `menjenguk` is the right word for visiting someone who is sick, not just generic `mengunjungi`. Distinguish `rawat inap` (inpatient) from `rawat jalan` (outpatient). In hospital settings, useful chunks are `jam besuk`, `lapor ke perawat`, `kursi roda`, `kamar rawat`, `obat sudah diberikan`, `kondisi membaik`, and `tolong kabari kami`.",
    vocabulary: [
      {
        word: "menjenguk",
        en: "to visit a sick person",
        vi: "thăm người bệnh",
        pos: "verb",
        pronunciation_vi: "men-JENG-uk",
        pronunciation_en: "men-JENG-uk",
      },
      {
        word: "rawat inap",
        en: "inpatient care",
        vi: "điều trị nội trú",
        pos: "noun phrase",
        pronunciation_vi: "RA-wat I-nap",
        pronunciation_en: "RA-wat EE-nap",
      },
      {
        word: "jam besuk",
        en: "visiting hours",
        vi: "giờ thăm bệnh",
        pos: "noun phrase",
        pronunciation_vi: "JAM be-SUK",
        pronunciation_en: "JAM be-SOOK",
      },
      {
        word: "perawat",
        en: "nurse",
        vi: "y tá / điều dưỡng",
        pos: "noun",
        pronunciation_vi: "pe-RA-wat",
        pronunciation_en: "pe-RA-wat",
      },
      {
        word: "kursi roda",
        en: "wheelchair",
        vi: "xe lăn",
        pos: "noun",
        pronunciation_vi: "KUR-si RO-da",
        pronunciation_en: "KUR-see RO-da",
      },
      {
        word: "bergiliran",
        en: "taking turns",
        vi: "luân phiên / thay phiên",
        pos: "adverb / verb",
        pronunciation_vi: "ber-gi-LIR-an",
        pronunciation_en: "ber-gi-LEER-an",
      },
      {
        word: "kamar rawat",
        en: "patient room / ward room",
        vi: "phòng bệnh",
        pos: "noun phrase",
        pronunciation_vi: "KA-mar RA-wat",
        pronunciation_en: "KA-mar RA-wat",
      },
      {
        word: "kondisi membaik",
        en: "condition is improving",
        vi: "tình trạng tốt lên",
        pos: "phrase",
        pronunciation_vi: "kon-DI-si mem-BA-ik",
        pronunciation_en: "kon-DEE-see mem-BA-ik",
      },
      {
        word: "beliau",
        en: "he/she, respectfully",
        vi: "ông/bà/người ấy (kính trọng)",
        pos: "pronoun",
        pronunciation_vi: "be-LI-au",
        pronunciation_en: "be-LEE-au",
      },
      {
        word: "kabari kami",
        en: "let us know",
        vi: "báo cho chúng tôi",
        pos: "verb phrase",
        pronunciation_vi: "ka-BA-ri KA-mi",
        pronunciation_en: "ka-BA-ree KA-mee",
      },
    ],
    dialogue: [
      {
        speaker: "Keluarga",
        text: "Selamat sore, Bu. Kami mau menjenguk ayah yang rawat inap.",
        vi: "Chào buổi chiều chị. Chúng tôi muốn thăm bố đang điều trị nội trú.",
        en: "Good afternoon, ma'am. We want to visit our father who is an inpatient.",
      },
      {
        speaker: "Perawat",
        text: "Baik. Jam besuk sampai pukul enam sore. Mohon lapor di meja jaga dulu.",
        vi: "Được. Giờ thăm bệnh đến sáu giờ chiều. Vui lòng báo ở bàn trực trước.",
        en: "All right. Visiting hours are until 6 p.m. Please check in at the nurse station first.",
      },
      {
        speaker: "Keluarga",
        text: "Boleh pinjam kursi roda kalau Ayah perlu ke ruang periksa?",
        vi: "Có thể mượn xe lăn nếu bố cần đến phòng khám không?",
        en: "May we borrow a wheelchair if Dad needs to go to the examination room?",
      },
      {
        speaker: "Perawat",
        text: "Boleh. Obat malam juga sudah diberikan, dan kondisi beliau mulai membaik.",
        vi: "Được. Thuốc buổi tối cũng đã được cho rồi, và tình trạng của bác bắt đầu tốt lên.",
        en: "Yes. The evening medicine has also been given, and his condition is starting to improve.",
      },
      {
        speaker: "Keluarga",
        text: "Terima kasih. Tolong kabari kami kalau ada perubahan kondisi.",
        vi: "Cảm ơn. Xin báo cho chúng tôi nếu có thay đổi tình trạng.",
        en: "Thank you. Please let us know if there is any change in condition.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ bệnh viện còn thiếu:",
        instruction_en: "Fill in the missing hospital phrase:",
        items: [
          {
            prompt: "Saya mau ___ ayah saya yang sedang rawat inap.",
            answer: "menjenguk",
            options: ["menjenguk", "menjual", "menunggu"],
          },
          {
            prompt: "Jam ___ mulai pukul empat sore.",
            answer: "besuk",
            options: ["besuk", "besok", "buka"],
          },
          {
            prompt: "Dokter bilang kondisi beliau sudah ___.",
            answer: "membaik",
            options: ["membaik", "membayar", "membawa"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "rawat inap", answer: "điều trị nội trú" },
          { prompt: "jam besuk", answer: "giờ thăm bệnh" },
          { prompt: "perawat", answer: "y tá / điều dưỡng" },
          { prompt: "kursi roda", answer: "xe lăn" },
          { prompt: "kondisi membaik", answer: "tình trạng tốt lên" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi muốn thăm bố tôi đang nằm viện.",
            answer: "Saya mau menjenguk ayah saya yang sedang rawat inap.",
          },
          {
            prompt: "Gia đình chúng tôi thay phiên nhau ở cùng bà trong phòng bệnh.",
            answer: "Keluarga kami bergiliran menemani nenek di kamar rawat.",
          },
          {
            prompt: "Xin báo cho chúng tôi nếu có thay đổi tình trạng.",
            answer: "Tolong kabari kami kalau ada perubahan kondisi.",
          },
        ],
      },
    ],
  },
];

export default elderlyHospitalVisitLessons;
