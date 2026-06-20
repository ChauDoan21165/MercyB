// Childcare emergency contact Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 31 file. Covers kontak darurat, orang tua, guru, pengasuh, izin
// menjemput, anak sakit, nomor telepon, and prosedur sekolah.
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
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
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
    id: "indonesian_childcare_emergency_contact",
    level: "A2",
    category: "childcare_parenting",
    title_vi: "Liên hệ khẩn cấp và đón trẻ",
    title_en: "Childcare emergency contacts and pickup permission",
    sentences: [
      {
        en: "Tolong catat kontak darurat untuk anak saya.",
        vi: "Làm ơn ghi lại liên hệ khẩn cấp cho con tôi.",
        pronunciation_focus: [
          "TO-long CA-tat KON-tak da-RU-rat UN-tuk A-nak SA-ya - `kontak darurat` = liên hệ khẩn cấp; `catat` = ghi lại.",
          "`darurat` dùng cho tình huống khẩn cấp. Cụm chuẩn là `kontak darurat`, không phải `telepon cepat`.",
          "Lỗi người Việt: dịch 'contact' thành `hubungan`. Trong hồ sơ trường/daycare, dùng `kontak`.",
        ],
        pronunciation_focus_en: [
          "TO-long CHA-tat KON-tak da-ROO-rat OON-took A-nak SA-ya - `kontak darurat` = emergency contact; `catat` = write down.",
          "`Darurat` is for emergencies. The standard phrase is `kontak darurat`, not `telepon cepat`.",
          "VN-speaker trap: translating 'contact' as `hubungan`. In school/daycare forms, use `kontak`.",
        ],
      },
      {
        en: "Nomor telepon orang tua sudah saya tulis di formulir.",
        vi: "Số điện thoại của phụ huynh tôi đã viết trong mẫu đơn.",
        pronunciation_focus: [
          "NO-mor te-le-PON O-rang TU-a SU-dah SA-ya TU-lis di for-mu-LIR - `nomor telepon` = số điện thoại; `orang tua` = phụ huynh/cha mẹ.",
          "`orang tua` trong trường học thường nghĩa là phụ huynh, không phải người già.",
          "Lỗi người Việt: nói `nomor HP orang tua` được trong nói thường, nhưng trong mẫu đơn `nomor telepon orang tua` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "NO-mor teh-leh-PON O-rang TOO-a SOO-dah SA-ya TOO-lis dee for-moo-LEER - `nomor telepon` = phone number; `orang tua` = parent/guardian.",
          "`Orang tua` in school contexts usually means parents/guardians, not elderly people.",
          "VN-speaker note: `nomor HP orang tua` works casually, but forms are clearer with `nomor telepon orang tua`.",
        ],
      },
      {
        en: "Kalau anak saya sakit, guru bisa menghubungi saya dulu.",
        vi: "Nếu con tôi bị bệnh, giáo viên có thể liên hệ tôi trước.",
        pronunciation_focus: [
          "KA-lau A-nak SA-ya SA-kit, GU-ru BI-sa meng-hu-BUNG-i SA-ya DU-lu - `anak sakit` = trẻ bị bệnh; `menghubungi` = liên hệ.",
          "`dulu` ở cuối nghĩa là trước tiên/trước đã. Câu này đặt phụ huynh làm người liên hệ đầu tiên.",
          "Lỗi người Việt: dùng `kontak saya` được, nhưng `menghubungi saya` đầy đủ và lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-nak SA-ya SA-kit, GOO-roo BEE-sa meng-hoo-BOONG-ee SA-ya DOO-loo - `anak sakit` = sick child; `menghubungi` = contact.",
          "`Dulu` at the end means first. This makes the parent the first person to contact.",
          "VN-speaker note: `kontak saya` works, but `menghubungi saya` is fuller and more polite.",
        ],
      },
      {
        en: "Pengasuh anak saya menjadi kontak kedua.",
        vi: "Người trông con của tôi là liên hệ thứ hai.",
        pronunciation_focus: [
          "pe-NGA-suh A-nak SA-ya men-JA-di KON-tak KE-du-a - `pengasuh` = người chăm/trông trẻ; `kontak kedua` = liên hệ thứ hai.",
          "`menjadi` = trở thành/là trong vai trò. Dùng khi giải thích thứ tự liên hệ.",
          "Lỗi người Việt: dịch nanny thành `nani`. Từ Indonesia tự nhiên là `pengasuh`.",
        ],
        pronunciation_focus_en: [
          "pe-NGA-sooh A-nak SA-ya men-JA-dee KON-tak keh-DOO-a - `pengasuh` = caregiver/nanny; `kontak kedua` = second contact.",
          "`Menjadi` = become/serve as. Use it when explaining contact order.",
          "VN-speaker trap: translating nanny as `nani`. Natural Indonesian is `pengasuh`.",
        ],
      },
      {
        en: "Siapa yang boleh menjemput anak saya dari sekolah?",
        vi: "Ai được phép đón con tôi từ trường?",
        pronunciation_focus: [
          "SI-a-pa yang BO-leh men-JEM-put A-nak SA-ya da-ri se-KO-lah - `boleh menjemput` = được phép đón; `dari sekolah` = từ trường.",
          "`boleh` hỏi quyền/cho phép, khác `bisa` chỉ khả năng.",
          "Lỗi người Việt: dùng `bisa jemput` khi hỏi quy định. Với quyền đón trẻ, dùng `boleh menjemput`.",
        ],
        pronunciation_focus_en: [
          "SEE-a-pa yang BO-leh men-JEM-poot A-nak SA-ya da-ree seh-KO-lah - `boleh menjemput` = allowed to pick up; `dari sekolah` = from school.",
          "`Boleh` asks permission/authorization, unlike `bisa`, which asks ability.",
          "VN-speaker trap: using `bisa jemput` when asking rules. For child pickup authorization, use `boleh menjemput`.",
        ],
      },
      {
        en: "Saya memberi izin menjemput kepada tante anak saya.",
        vi: "Tôi cho phép dì/cô của bé đón bé.",
        pronunciation_focus: [
          "SA-ya mem-BE-ri I-zin men-JEM-put ke-PA-da TAN-te A-nak SA-ya - `izin menjemput` = quyền/phép đón; `tante` = dì/cô/bác gái.",
          "`kepada` đánh dấu người nhận quyền. Trong nói thường có thể nói `untuk tante anak saya`.",
          "Lỗi người Việt: nói `kasih izin jemput tante` nghe cụt. Câu rõ: `memberi izin menjemput kepada...`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-BE-ree EE-zin men-JEM-poot keh-PA-da TAN-teh A-nak SA-ya - `izin menjemput` = pickup permission; `tante` = aunt.",
          "`Kepada` marks the person receiving permission. Casually, `untuk tante anak saya` may be used.",
          "VN-speaker note: `kasih izin jemput tante` sounds clipped. Clear version: `memberi izin menjemput kepada...`.",
        ],
      },
      {
        en: "Tolong cek KTP orang yang menjemput.",
        vi: "Làm ơn kiểm tra căn cước của người đến đón.",
        pronunciation_focus: [
          "TO-long cek KA-TE-PE O-rang yang men-JEM-put - `KTP` = thẻ căn cước Indonesia; `orang yang menjemput` = người đến đón.",
          "`KTP` thường đọc từng chữ: ka-te-pe. Với người nước ngoài có thể dùng paspor/ID lain.",
          "Lỗi người Việt: nói `cek kartu` quá chung. Nếu quy trình an toàn, hỏi rõ `cek KTP`.",
        ],
        pronunciation_focus_en: [
          "TO-long chek KA-TE-PE O-rang yang men-JEM-poot - `KTP` = Indonesian ID card; `orang yang menjemput` = the pickup person.",
          "`KTP` is usually spelled out ka-te-pe. Foreigners may use passport/other ID.",
          "VN-speaker note: `cek kartu` is too general. For safety procedure, specify `cek KTP`.",
        ],
      },
      {
        en: "Apa prosedur sekolah kalau anak demam?",
        vi: "Quy trình của trường là gì nếu trẻ bị sốt?",
        pronunciation_focus: [
          "A-pa pro-se-DUR se-KO-lah KA-lau A-nak de-MAM - `prosedur sekolah` = quy trình của trường; `demam` = sốt.",
          "`kalau anak demam` là cách hỏi tình huống giả định rất thực tế.",
          "Lỗi người Việt: dùng `aturan` cho mọi quy trình. `Aturan` là quy định; `prosedur` là các bước xử lý.",
        ],
        pronunciation_focus_en: [
          "A-pa pro-seh-DOOR seh-KO-lah KA-lau A-nak deh-MAM - `prosedur sekolah` = school procedure; `demam` = fever.",
          "`Kalau anak demam` is a practical way to ask about a hypothetical situation.",
          "VN-speaker trap: using `aturan` for every procedure. `Aturan` = rule; `prosedur` = handling steps.",
        ],
      },
      {
        en: "Apakah guru akan membawa anak ke UKS dulu?",
        vi: "Giáo viên có đưa trẻ đến phòng y tế trường trước không?",
        pronunciation_focus: [
          "a-PA-kah GU-ru A-kan mem-BA-wa A-nak ke U-KA-ES DU-lu - `UKS` = phòng/chương trình y tế trường; đọc u-ka-es.",
          "`membawa anak ke...` = đưa trẻ đến...; `dulu` = trước tiên.",
          "Lỗi người Việt: dịch phòng y tế là `kamar dokter`. Ở trường Indonesia thường nói `UKS`.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah GOO-roo A-kan mem-BA-wa A-nak keh OO-KA-ES DOO-loo - `UKS` = school health room/program; read u-ka-es.",
          "`Membawa anak ke...` = take the child to...; `dulu` = first.",
          "VN-speaker trap: translating health room as `kamar dokter`. Indonesian schools commonly say `UKS`.",
        ],
      },
      {
        en: "Kalau saya tidak bisa dihubungi, tolong telepon nomor suami saya.",
        vi: "Nếu không liên lạc được với tôi, làm ơn gọi số của chồng tôi.",
        pronunciation_focus: [
          "KA-lau SA-ya ti-DAK BI-sa di-hu-BUNG-i, TO-long te-le-PON NO-mor SU-a-mi SA-ya - `tidak bisa dihubungi` = không liên lạc được; `suami` = chồng.",
          "`dihubungi` là bị động tự nhiên: tôi không thể được liên hệ.",
          "Lỗi người Việt: nói `tidak bisa kontak saya` nghe hơi lộn. Câu tự nhiên: `saya tidak bisa dihubungi`.",
        ],
        pronunciation_focus_en: [
          "KA-lau SA-ya tee-DAK BEE-sa dee-hoo-BOONG-ee, TO-long teh-leh-PON NO-mor SOO-a-mee SA-ya - `tidak bisa dihubungi` = cannot be reached; `suami` = husband.",
          "`Dihubungi` is the natural passive: I cannot be contacted.",
          "VN-speaker trap: saying `tidak bisa kontak saya`, which sounds reversed. Natural: `saya tidak bisa dihubungi`.",
        ],
      },
      {
        en: "Mohon beri tahu saya sebelum anak diberi obat.",
        vi: "Xin báo cho tôi trước khi trẻ được cho uống thuốc.",
        pronunciation_focus: [
          "MO-hon BE-ri TA-hu SA-ya se-BE-lum A-nak di-BE-ri O-bat - `mohon beri tahu` = xin báo cho; `diberi obat` = được cho thuốc.",
          "`mohon` lịch sự hơn `tolong` trong yêu cầu chính thức với trường/daycare.",
          "Lỗi người Việt: nói `kasih tahu saya sebelum kasih obat` được trong nói thường, nhưng văn bản nên dùng `beri tahu` và `diberi obat`.",
        ],
        pronunciation_focus_en: [
          "MO-hon BE-ree TA-hoo SA-ya seh-BE-loom A-nak dee-BE-ree O-bat - `mohon beri tahu` = please inform; `diberi obat` = be given medicine.",
          "`Mohon` is more formal than `tolong` for school/daycare requests.",
          "VN-speaker note: `kasih tahu saya sebelum kasih obat` works casually, but writing should use `beri tahu` and `diberi obat`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở trường hoặc daycare Indonesia, thông tin `kontak darurat` và `izin menjemput` thường rất quan trọng. Phụ huynh nên ghi rõ nomor telepon orang tua, kontak kedua như pengasuh hoặc keluarga, ai được phép menjemput, và prosedur nếu anak sakit. Với thuốc hoặc tình huống y tế, cách an toàn là yêu cầu trường liên hệ phụ huynh trước: `Mohon beri tahu saya sebelum anak diberi obat.`",
    cultural_notes_en:
      "At Indonesian schools or daycare centers, emergency contact and pickup authorization details are important. Parents should clearly write parent phone numbers, a second contact such as a caregiver or family member, who is allowed to pick up the child, and the procedure if the child becomes sick. For medicine or medical situations, a safe request is: `Mohon beri tahu saya sebelum anak diberi obat.`",
    tip_advice_vi:
      "Mẫu an toàn: `Tolong catat kontak darurat untuk anak saya. Kalau anak saya sakit, hubungi saya dulu. Kalau saya tidak bisa dihubungi, telepon nomor suami saya. Saya memberi izin menjemput kepada tante anak saya.`",
    tip_advice_en:
      "Safe template: `Tolong catat kontak darurat untuk anak saya. Kalau anak saya sakit, hubungi saya dulu. Kalau saya tidak bisa dihubungi, telepon nomor suami saya. Saya memberi izin menjemput kepada tante anak saya.`",
    vocabulary: [
      {
        word: "kontak darurat",
        en: "emergency contact",
        vi: "liên hệ khẩn cấp",
        pos: "noun",
        pronunciation_vi: "KON-tak da-RU-rat",
        pronunciation_en: "KON-tak da-ROO-rat",
      },
      {
        word: "orang tua",
        en: "parents; guardians",
        vi: "phụ huynh/cha mẹ",
        pos: "noun",
        pronunciation_vi: "O-rang TU-a",
        pronunciation_en: "O-rang TOO-a",
      },
      {
        word: "guru",
        en: "teacher",
        vi: "giáo viên",
        pos: "noun",
        pronunciation_vi: "GU-ru",
        pronunciation_en: "GOO-roo",
      },
      {
        word: "pengasuh",
        en: "caregiver; nanny",
        vi: "người trông/chăm trẻ",
        pos: "noun",
        pronunciation_vi: "pe-NGA-suh",
        pronunciation_en: "pe-NGA-sooh",
      },
      {
        word: "izin menjemput",
        en: "pickup permission",
        vi: "quyền/phép đón trẻ",
        pos: "noun",
        pronunciation_vi: "I-zin men-JEM-put",
        pronunciation_en: "EE-zin men-JEM-poot",
      },
      {
        word: "anak sakit",
        en: "sick child",
        vi: "trẻ bị bệnh",
        pos: "phrase",
        pronunciation_vi: "A-nak SA-kit",
        pronunciation_en: "A-nak SA-kit",
      },
      {
        word: "nomor telepon",
        en: "phone number",
        vi: "số điện thoại",
        pos: "noun",
        pronunciation_vi: "NO-mor te-le-PON",
        pronunciation_en: "NO-mor teh-leh-PON",
      },
      {
        word: "prosedur sekolah",
        en: "school procedure",
        vi: "quy trình của trường",
        pos: "noun",
        pronunciation_vi: "pro-se-DUR se-KO-lah",
        pronunciation_en: "pro-seh-DOOR seh-KO-lah",
      },
      {
        word: "tidak bisa dihubungi",
        en: "cannot be reached",
        vi: "không liên lạc được",
        pos: "phrase",
        pronunciation_vi: "ti-DAK BI-sa di-hu-BUNG-i",
        pronunciation_en: "tee-DAK BEE-sa dee-hoo-BOONG-ee",
      },
      {
        word: "UKS",
        en: "school health room/program",
        vi: "phòng/chương trình y tế trường",
        pos: "noun",
        pronunciation_vi: "U-KA-ES",
        pronunciation_en: "OO-KA-ES",
      },
    ],
    dialogue: [
      {
        speaker: "Orang tua",
        text: "Selamat pagi, saya mau memperbarui kontak darurat anak saya.",
        vi: "Chào buổi sáng, tôi muốn cập nhật liên hệ khẩn cấp của con tôi.",
        en: "Good morning, I would like to update my child's emergency contact.",
      },
      {
        speaker: "Guru",
        text: "Baik, nomor telepon orang tua yang utama nomor berapa?",
        vi: "Được, số điện thoại chính của phụ huynh là số nào?",
        en: "All right, what is the main parent phone number?",
      },
      {
        speaker: "Orang tua",
        text: "Nomor saya yang utama. Kalau saya tidak bisa dihubungi, telepon suami saya.",
        vi: "Số của tôi là số chính. Nếu không liên lạc được với tôi, hãy gọi chồng tôi.",
        en: "My number is the main one. If I cannot be reached, call my husband.",
      },
      {
        speaker: "Guru",
        text: "Siapa yang boleh menjemput anak dari sekolah?",
        vi: "Ai được phép đón trẻ từ trường?",
        en: "Who is allowed to pick the child up from school?",
      },
      {
        speaker: "Orang tua",
        text: "Saya memberi izin menjemput kepada tante anak saya. Tolong cek KTP-nya.",
        vi: "Tôi cho phép dì/cô của bé đón bé. Làm ơn kiểm tra căn cước của cô ấy.",
        en: "I give pickup permission to my child's aunt. Please check her ID card.",
      },
      {
        speaker: "Guru",
        text: "Baik, kalau anak sakit kami hubungi orang tua dulu.",
        vi: "Được, nếu trẻ bị bệnh chúng tôi sẽ liên hệ phụ huynh trước.",
        en: "All right, if the child is sick we will contact the parents first.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Làm ơn ghi lại liên hệ khẩn cấp cho con tôi.",
        prompt_en: "Translate into Indonesian: Please write down the emergency contact for my child.",
        answer: "Tolong catat kontak darurat untuk anak saya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Saya memberi ___ menjemput kepada tante anak saya.",
        prompt_en: "Fill in the blank: Saya memberi ___ menjemput kepada tante anak saya.",
        answer: "izin",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào tự nhiên nhất khi hỏi quy trình nếu trẻ bị sốt?",
        prompt_en: "Which sentence is most natural for asking the procedure if a child has a fever?",
        options: [
          "Apa prosedur sekolah kalau anak demam?",
          "Apa aturan panas anak?",
          "Sekolah bagaimana anak panas cepat?",
        ],
        answer: "Apa prosedur sekolah kalau anak demam?",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["kontak darurat", "liên hệ khẩn cấp"],
          ["izin menjemput", "quyền đón trẻ"],
          ["tidak bisa dihubungi", "không liên lạc được"],
        ],
      },
    ],
    content:
      "Use this lesson for school and daycare safety communication: emergency contacts, parent and caregiver phone numbers, authorized pickup, sick-child procedures, school health room steps, and permission before giving medicine.",
  },
];
