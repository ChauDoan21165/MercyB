// Daycare enrollment Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 24 file. Covers daycare, pendaftaran anak, jam penitipan,
// biaya bulanan, makan siang, tidur siang, and kontak darurat.
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
    id: "indonesian_daycare_enrollment",
    level: "A2",
    category: "childcare_parenting",
    title_vi: "Đăng ký gửi trẻ ở daycare",
    title_en: "Daycare enrollment",
    sentences: [
      {
        en: "Saya mau mendaftarkan anak saya ke daycare.",
        vi: "Tôi muốn đăng ký cho con tôi vào daycare.",
        pronunciation_focus: [
          "SA-ya mau men-DAF-tar-kan A-nak SA-ya ke DE-ker - `mendaftarkan anak` = đăng ký cho con; `daycare` = nơi giữ trẻ tư.",
          "`mendaftarkan` là đăng ký cho người khác; `mendaftar` là tự mình đăng ký.",
          "Lỗi người Việt: nói `daftar anak saya` trống. Ở văn phòng, dùng `mendaftarkan anak saya` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau men-DAF-tar-kan A-nak SA-ya ke DAY-care - `mendaftarkan anak` = enroll/register a child; `daycare` = private childcare.",
          "`mendaftarkan` means register someone else; `mendaftar` means register yourself.",
          "VN-speaker trap: saying bare `daftar anak saya`. In office language, `mendaftarkan anak saya` is more natural.",
        ],
      },
      {
        en: "Apa saja syarat pendaftaran anak?",
        vi: "Cần những điều kiện/giấy tờ nào để đăng ký cho trẻ?",
        pronunciation_focus: [
          "A-pa SA-ja SYA-rat pen-DAF-tar-an A-nak - `apa saja` = những gì; `syarat pendaftaran` = điều kiện/hồ sơ đăng ký.",
          "Câu `Apa saja syarat...?` rất hữu ích khi hỏi thủ tục ở trường, daycare, hoặc cơ quan.",
          "Lỗi người Việt: hỏi `dokumen apa?` quá hẹp. `Syarat` bao gồm giấy tờ, tuổi, phí, và quy định.",
        ],
        pronunciation_focus_en: [
          "A-pa SA-ja SYA-rat pen-DAF-tar-an A-nak - `apa saja` = what items; `syarat pendaftaran` = enrollment requirements.",
          "`Apa saja syarat...?` is very useful for school, daycare, or office procedures.",
          "VN-speaker trap: asking only `dokumen apa?`, which is narrow. `Syarat` includes documents, age, fees, and rules.",
        ],
      },
      {
        en: "Jam penitipan mulai dari jam tujuh pagi sampai jam lima sore.",
        vi: "Giờ gửi trẻ bắt đầu từ bảy giờ sáng đến năm giờ chiều.",
        pronunciation_focus: [
          "jam pe-ni-TIP-an mu-LAI da-ri jam TU-juh PA-gi SAM-pai jam LI-ma SO-re - `jam penitipan` = giờ gửi/trông trẻ.",
          "`dari... sampai...` = từ... đến...; dùng cho giờ mở cửa và lịch trông trẻ.",
          "Lỗi người Việt: nói `jam titip` nghe quá rút gọn. Cụm rõ hơn là `jam penitipan`.",
        ],
        pronunciation_focus_en: [
          "jam pe-ni-TEE-pan moo-LAI da-ree jam TOO-jooh PA-gee SAM-pai jam LEE-ma SO-re - `jam penitipan` = childcare/drop-off hours.",
          "`dari... sampai...` = from... to...; used for opening hours and childcare schedules.",
          "VN-speaker trap: saying shortened `jam titip`. Clearer phrase: `jam penitipan`.",
        ],
      },
      {
        en: "Biaya bulanannya sudah termasuk makan siang?",
        vi: "Phí hằng tháng đã bao gồm bữa trưa chưa?",
        pronunciation_focus: [
          "BI-a-ya bu-LA-nan-nya SU-dah ter-MA-suk MA-kan SI-ang - `biaya bulanan` = phí hằng tháng; `makan siang` = bữa trưa.",
          "`sudah termasuk...?` = đã bao gồm chưa, rất hữu ích khi hỏi giá dịch vụ.",
          "Lỗi người Việt: nói `uang bulan` thay cho phí tháng. Cụm tự nhiên là `biaya bulanan`.",
        ],
        pronunciation_focus_en: [
          "BEE-a-ya boo-LA-nan-nya SOO-dah ter-MA-suk MA-kan SEE-ang - `biaya bulanan` = monthly fee; `makan siang` = lunch.",
          "`sudah termasuk...?` = is it already included, very useful for service pricing.",
          "VN-speaker trap: saying `uang bulan` for monthly fee. Natural phrase: `biaya bulanan`.",
        ],
      },
      {
        en: "Apakah anak-anak tidur siang setelah makan?",
        vi: "Các bé có ngủ trưa sau khi ăn không?",
        pronunciation_focus: [
          "a-pa-KAH A-nak A-nak TI-dur SI-ang se-TE-lah MA-kan - `tidur siang` = ngủ trưa; `setelah makan` = sau khi ăn.",
          "`anak-anak` = trẻ em/các bé; dạng lặp chỉ số nhiều hoặc nhóm trẻ.",
          "Lỗi người Việt: nói `tidur trưa` theo tiếng Việt. Tiếng Indonesia dùng `tidur siang`.",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-nak A-nak TEE-door SEE-ang se-TE-lah MA-kan - `tidur siang` = nap; `setelah makan` = after eating.",
          "`anak-anak` = children; reduplication marks plural or a child group.",
          "VN-speaker trap: saying `tidur trưa` from Vietnamese. Indonesian uses `tidur siang`.",
        ],
      },
      {
        en: "Anak saya punya alergi telur dan susu sapi.",
        vi: "Con tôi bị dị ứng trứng và sữa bò.",
        pronunciation_focus: [
          "A-nak SA-ya PU-nya a-LER-gi TE-lur dan SU-su SA-pi - `alergi` = dị ứng; `susu sapi` = sữa bò.",
          "`punya alergi` là cách nói tự nhiên trong giao tiếp hằng ngày; trang trọng hơn có thể nói `alergi terhadap`.",
          "Lỗi người Việt: nói `alergi dengan telur`. Hiểu được, nhưng chính xác hơn là `alergi telur` hoặc `alergi terhadap telur`.",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya POO-nya a-LER-gee TE-loor dan SOO-soo SA-pee - `alergi` = allergy; `susu sapi` = cow's milk.",
          "`punya alergi` is natural in daily speech; more formal is `alergi terhadap`.",
          "VN-speaker trap: saying `alergi dengan telur`. Understood, but better: `alergi telur` or `alergi terhadap telur`.",
        ],
      },
      {
        en: "Tolong catat nomor kontak darurat saya dan suami.",
        vi: "Làm ơn ghi số liên hệ khẩn cấp của tôi và chồng tôi.",
        pronunciation_focus: [
          "TO-long CA-tat NO-mor KON-tak da-RU-rat SA-ya dan SU-a-mi - `kontak darurat` = liên hệ khẩn cấp; `catat` = ghi lại.",
          "`suami` = chồng; nếu là vợ, dùng `istri`. Có thể nói `orang tua` nếu muốn trung tính là phụ huynh.",
          "Lỗi người Việt: dịch `liên hệ khẩn cấp` thành `telepon cepat`. Cụm chuẩn là `kontak darurat`.",
        ],
        pronunciation_focus_en: [
          "TO-long CHA-tat NO-mor KON-tak da-ROO-rat SA-ya dan SOO-a-mee - `kontak darurat` = emergency contact; `catat` = write down.",
          "`suami` = husband; for wife use `istri`. You can say `orang tua` if you want neutral parent/guardian.",
          "VN-speaker trap: translating emergency contact as `telepon cepat`. Standard phrase: `kontak darurat`.",
        ],
      },
      {
        en: "Kalau anak saya demam, tolong hubungi saya segera.",
        vi: "Nếu con tôi bị sốt, làm ơn liên hệ tôi ngay.",
        pronunciation_focus: [
          "KA-lau A-nak SA-ya de-MAM, TO-long hu-BUNG-i SA-ya se-GE-ra - `demam` = sốt; `segera` = ngay lập tức.",
          "`kalau` dùng tự nhiên trong hướng dẫn cho tình huống có thể xảy ra.",
          "Lỗi người Việt: dùng `panas` cho sốt trong hồ sơ chăm sóc trẻ. `Demam` rõ và y tế hơn.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-nak SA-ya de-MAM, TO-long hoo-BOONG-i SA-ya se-GE-ra - `demam` = fever; `segera` = immediately.",
          "`kalau` is natural for instructions about possible situations.",
          "VN-speaker trap: using `panas` for fever in childcare records. `Demam` is clearer and more medical.",
        ],
      },
      {
        en: "Siapa pengasuh yang menjaga anak-anak di kelas balita?",
        vi: "Ai là người trông trẻ chăm các bé trong lớp trẻ nhỏ?",
        pronunciation_focus: [
          "SI-a-pa pe-NGA-suh yang men-JA-ga A-nak A-nak di KE-las ba-LI-ta - `pengasuh` = người chăm/trông trẻ; `balita` = trẻ dưới năm tuổi.",
          "`yang menjaga` = người chăm/giữ. `Yang + động từ` giúp xác định người làm việc đó.",
          "Lỗi người Việt: dịch `người giữ trẻ` thành `orang jaga anak`. Từ tự nhiên là `pengasuh`.",
        ],
        pronunciation_focus_en: [
          "SEE-a-pa pe-NGA-sooh yang men-JA-ga A-nak A-nak di KE-las ba-LEE-ta - `pengasuh` = caregiver; `balita` = under-five child.",
          "`yang menjaga` = the one who watches/cares for. `Yang + verb` identifies the person doing that action.",
          "VN-speaker trap: translating child minder as `orang jaga anak`. Natural word: `pengasuh`.",
        ],
      },
      {
        en: "Kami ingin coba satu hari dulu sebelum daftar bulanan.",
        vi: "Chúng tôi muốn thử một ngày trước khi đăng ký theo tháng.",
        pronunciation_focus: [
          "KA-mi I-ngin CO-ba SA-tu HA-ri DU-lu se-BE-lum DAF-tar bu-LA-nan - `coba satu hari` = thử một ngày; `daftar bulanan` = đăng ký theo tháng.",
          "`dulu` làm câu mềm hơn: thử trước đã rồi quyết định.",
          "Lỗi người Việt: nói `daftar bulan` thiếu hậu tố. Theo tháng là `bulanan`.",
        ],
        pronunciation_focus_en: [
          "KA-mi EE-ngin CHO-ba SA-too HA-ree DOO-loo se-BE-lum DAF-tar boo-LA-nan - `coba satu hari` = try for one day; `daftar bulanan` = monthly enrollment.",
          "`dulu` softens the sentence: try first before deciding.",
          "VN-speaker trap: saying `daftar bulan` without the suffix. Monthly is `bulanan`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `daycare` tư nhân thường phục vụ phụ huynh đi làm, với giờ gửi trẻ theo ngày, nửa ngày, hoặc tháng. Khi đăng ký, phụ huynh thường hỏi `jam penitipan`, `biaya bulanan`, bữa ăn, ngủ trưa, số lượng `pengasuh`, quy định đưa đón, và `kontak darurat`. Nếu trẻ có dị ứng, thuốc cần uống, hoặc thói quen ngủ/ăn đặc biệt, nên nói rõ ngay từ lúc đăng ký.",
    cultural_notes_en:
      "In Indonesia, private `daycare` often serves working parents, with daily, half-day, or monthly childcare hours. During enrollment, parents commonly ask about `jam penitipan`, `biaya bulanan`, meals, nap time, number of `pengasuh`, pickup rules, and `kontak darurat`. If a child has allergies, medicine needs, or specific sleep/eating habits, state them clearly during enrollment.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `antar` = đưa đi, `jemput` = đón về, `penitipan` = việc gửi/trông trẻ, `pengasuh` = người chăm trẻ. Hỏi thủ tục bằng `Apa saja syarat pendaftaran anak?` và hỏi giá bằng `Biaya bulanannya sudah termasuk apa saja?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `antar` = drop off, `jemput` = pick up, `penitipan` = childcare/care arrangement, and `pengasuh` = caregiver. Ask requirements with `Apa saja syarat pendaftaran anak?` and pricing with `Biaya bulanannya sudah termasuk apa saja?`.",
    vocabulary: [
      { word: "daycare", en: "daycare", vi: "nhà trẻ/daycare", pos: "noun", pronunciation_vi: "DE-ker", pronunciation_en: "DAY-care" },
      { word: "pendaftaran anak", en: "child enrollment", vi: "đăng ký cho trẻ", pos: "noun phrase", pronunciation_vi: "pen-DAF-tar-an A-nak", pronunciation_en: "pen-DAF-tar-an A-nak" },
      { word: "jam penitipan", en: "childcare hours", vi: "giờ gửi/trông trẻ", pos: "noun phrase", pronunciation_vi: "jam pe-ni-TIP-an", pronunciation_en: "jam pe-ni-TEE-pan" },
      { word: "biaya bulanan", en: "monthly fee", vi: "phí hằng tháng", pos: "noun phrase", pronunciation_vi: "BI-a-ya bu-LA-nan", pronunciation_en: "BEE-a-ya boo-LA-nan" },
      { word: "makan siang", en: "lunch", vi: "bữa trưa", pos: "noun phrase", pronunciation_vi: "MA-kan SI-ang", pronunciation_en: "MA-kan SEE-ang" },
      { word: "tidur siang", en: "nap", vi: "ngủ trưa", pos: "verb/noun phrase", pronunciation_vi: "TI-dur SI-ang", pronunciation_en: "TEE-door SEE-ang" },
      { word: "kontak darurat", en: "emergency contact", vi: "liên hệ khẩn cấp", pos: "noun phrase", pronunciation_vi: "KON-tak da-RU-rat", pronunciation_en: "KON-tak da-ROO-rat" },
      { word: "pengasuh", en: "caregiver", vi: "người chăm/trông trẻ", pos: "noun", pronunciation_vi: "pe-NGA-suh", pronunciation_en: "pe-NGA-sooh" },
      { word: "balita", en: "child under five", vi: "trẻ dưới 5 tuổi", pos: "noun", pronunciation_vi: "ba-LI-ta", pronunciation_en: "ba-LEE-ta" },
      { word: "alergi", en: "allergy", vi: "dị ứng", pos: "noun", pronunciation_vi: "a-LER-gi", pronunciation_en: "a-LER-gee" },
    ],
    dialogue: [
      {
        speaker: "Orang tua",
        text: "Saya mau mendaftarkan anak saya ke daycare.",
        vi: "Tôi muốn đăng ký cho con tôi vào daycare.",
        en: "I want to enroll my child in daycare.",
      },
      {
        speaker: "Staf daycare",
        text: "Baik. Usia anaknya berapa tahun?",
        vi: "Vâng. Bé mấy tuổi rồi ạ?",
        en: "Sure. How old is your child?",
      },
      {
        speaker: "Orang tua",
        text: "Dua tahun. Saya mau tanya jam penitipan dan biaya bulanan.",
        vi: "Hai tuổi. Tôi muốn hỏi giờ gửi trẻ và phí hằng tháng.",
        en: "Two years old. I want to ask about childcare hours and the monthly fee.",
      },
      {
        speaker: "Staf daycare",
        text: "Biaya bulanan sudah termasuk makan siang dan tidur siang.",
        vi: "Phí hằng tháng đã bao gồm bữa trưa và giờ ngủ trưa.",
        en: "The monthly fee includes lunch and nap time.",
      },
      {
        speaker: "Orang tua",
        text: "Ini nomor kontak darurat saya. Anak saya punya alergi telur.",
        vi: "Đây là số liên hệ khẩn cấp của tôi. Con tôi bị dị ứng trứng.",
        en: "Here is my emergency contact number. My child has an egg allergy.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "jam penitipan", answer: "giờ gửi/trông trẻ" },
          { prompt: "biaya bulanan", answer: "phí hằng tháng" },
          { prompt: "tidur siang", answer: "ngủ trưa" },
          { prompt: "kontak darurat", answer: "liên hệ khẩn cấp" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn đăng ký cho con tôi vào daycare.", answer: "Saya mau mendaftarkan anak saya ke daycare." },
          { prompt: "Phí hằng tháng đã bao gồm bữa trưa chưa?", answer: "Biaya bulanannya sudah termasuk makan siang?" },
          { prompt: "Nếu con tôi bị sốt, làm ơn liên hệ tôi ngay.", answer: "Kalau anak saya demam, tolong hubungi saya segera." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Apa saja syarat ___ anak?", answer: "pendaftaran" },
          { prompt: "Anak-anak tidur ___ setelah makan.", answer: "siang" },
          { prompt: "Tolong catat nomor kontak ___.", answer: "darurat" },
        ],
      },
    ],
  },
];
