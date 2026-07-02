// NGO and community project Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: NGO/project Indonesian is polite, accountable, and report-heavy:
// `LSM`, `proyek komunitas`, `proposal`, `donatur`, `laporan kegiatan`,
// `penerima manfaat`, `koordinasi`, and `relawan`.

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
    id: "indonesian_ngo_community_project",
    level: "B1",
    category: "community",
    title_vi: "LSM và dự án cộng đồng",
    title_en: "NGOs and community projects",
    sentences: [
      {
        en: "LSM kami sedang menjalankan proyek komunitas di desa ini.",
        vi: "Tổ chức phi chính phủ của chúng tôi đang triển khai dự án cộng đồng ở làng này.",
        pronunciation_focus: [
          "el-es-EM KA-mi se-DANG men-ja-LAN-kan PRO-yek ko-mu-ni-TAS di DE-sa I-ni - `LSM` = tổ chức phi chính phủ; `proyek komunitas` = dự án cộng đồng.",
          "Lỗi người Việt: đọc `LSM` theo tiếng Anh. Trong tiếng Indonesia, đánh vần `el-es-em`.",
          "Luyện: `LSM kami menjalankan proyek komunitas.`",
        ],
        pronunciation_focus_en: [
          "el-es-EM KA-mee seh-DANG men-ja-LAN-kan PRO-yek ko-moo-nee-TAS dee DEH-sa EE-nee - `LSM` = NGO; `proyek komunitas` = community project.",
          "VN-speaker trap: spelling `LSM` with English letter names. Indonesian says `el-es-em`.",
          "Drill: `LSM kami menjalankan proyek komunitas.`",
        ],
      },
      {
        en: "Kami perlu menyusun proposal sebelum bertemu donatur.",
        vi: "Chúng tôi cần soạn đề xuất trước khi gặp nhà tài trợ.",
        pronunciation_focus: [
          "KA-mi PER-lu me-NYU-sun pro-PO-sal se-BE-lum ber-TE-mu do-NA-tur - `menyusun proposal` = soạn/lập đề xuất; `donatur` = nhà tài trợ.",
          "Lỗi người Việt: dùng `membuat proposal` được, nhưng văn dự án thường dùng `menyusun proposal`.",
          "Luyện: `Menyusun proposal untuk donatur.`",
        ],
        pronunciation_focus_en: [
          "KA-mee PER-loo meh-NYOO-soon pro-PO-sal seh-BEH-loom ber-TEH-moo do-NA-toor - `menyusun proposal` = prepare a proposal; `donatur` = donor.",
          "VN-speaker note: `membuat proposal` works, but project language often uses `menyusun proposal`.",
          "Drill: `Menyusun proposal untuk donatur.`",
        ],
      },
      {
        en: "Tujuan program ini adalah meningkatkan akses pendidikan anak.",
        vi: "Mục tiêu của chương trình này là nâng cao tiếp cận giáo dục cho trẻ em.",
        pronunciation_focus: [
          "TU-ju-an PRO-gram I-ni A-da-lah me-ning-KAT-kan AK-ses pen-di-DIK-an A-nak - `tujuan program` = mục tiêu chương trình; `meningkatkan` = nâng cao.",
          "Lỗi người Việt: nói `menaikkan akses` nghe lạ. Với chất lượng/tiếp cận, dùng `meningkatkan`.",
          "Luyện: `Meningkatkan akses pendidikan.`",
        ],
        pronunciation_focus_en: [
          "TOO-joo-an PRO-gram EE-nee A-da-lah meh-ning-KAT-kan AK-ses pen-dee-DEEK-an A-nak - `tujuan program` = program objective; `meningkatkan` = improve/increase.",
          "VN-speaker trap: `menaikkan akses` sounds odd. For quality/access, use `meningkatkan`.",
          "Drill: `Meningkatkan akses pendidikan.`",
        ],
      },
      {
        en: "Siapa saja penerima manfaat dari proyek ini?",
        vi: "Những ai là người hưởng lợi từ dự án này?",
        pronunciation_focus: [
          "SI-a-pa SA-ja pe-ne-RI-ma MAN-fa-at DA-ri PRO-yek I-ni - `penerima manfaat` = người hưởng lợi; `siapa saja` = những ai.",
          "Lỗi người Việt: chỉ hỏi `siapa penerima` có thể nghe như một người. `Siapa saja` hỏi toàn bộ nhóm.",
          "Luyện: `Penerima manfaat proyek ini.`",
        ],
        pronunciation_focus_en: [
          "SEE-a-pa SA-ja peh-neh-REE-ma MAN-fa-at DA-ree PRO-yek EE-nee - `penerima manfaat` = beneficiaries; `siapa saja` = who all.",
          "VN-speaker trap: asking only `siapa penerima` can sound like one person. `Siapa saja` asks for the full group.",
          "Drill: `Penerima manfaat proyek ini.`",
        ],
      },
      {
        en: "Kami harus membuat laporan kegiatan setiap bulan.",
        vi: "Chúng tôi phải làm báo cáo hoạt động mỗi tháng.",
        pronunciation_focus: [
          "KA-mi HA-rus mem-BU-at la-PO-ran ke-GI-a-tan se-TI-ap BU-lan - `laporan kegiatan` = báo cáo hoạt động.",
          "Lỗi người Việt: dùng `lapor kegiatan` thiếu dạng danh từ. Tài liệu chính thức là `laporan kegiatan`.",
          "Luyện: `Membuat laporan kegiatan.`",
        ],
        pronunciation_focus_en: [
          "KA-mee HA-roos mem-BOO-at la-PO-ran keh-GEE-a-tan seh-TEE-ap BOO-lan - `laporan kegiatan` = activity report.",
          "VN-speaker trap: saying `lapor kegiatan` without the noun form. Official documents use `laporan kegiatan`.",
          "Drill: `Membuat laporan kegiatan.`",
        ],
      },
      {
        en: "Koordinasi dengan relawan dilakukan lewat grup WhatsApp.",
        vi: "Việc phối hợp với tình nguyện viên được thực hiện qua nhóm WhatsApp.",
        pronunciation_focus: [
          "ko-or-di-NA-si de-NGAN re-LA-wan di-LA-ku-kan LE-wat grup WATS-ap - `koordinasi dengan` = phối hợp với; `relawan` = tình nguyện viên.",
          "Lỗi người Việt: bỏ `dengan` sau `koordinasi`. Cặp tự nhiên là `koordinasi dengan relawan`.",
          "Luyện: `Koordinasi dengan relawan.`",
        ],
        pronunciation_focus_en: [
          "ko-or-dee-NA-see deh-NGAN reh-LA-wan dee-LA-koo-kan LEH-wat grup WATS-ap - `koordinasi dengan` = coordination with; `relawan` = volunteers.",
          "VN-speaker trap: dropping `dengan` after `koordinasi`. Natural phrasing is `koordinasi dengan relawan`.",
          "Drill: `Koordinasi dengan relawan.`",
        ],
      },
      {
        en: "Dana dari donatur harus dicatat secara transparan.",
        vi: "Nguồn tiền từ nhà tài trợ phải được ghi chép minh bạch.",
        pronunciation_focus: [
          "DA-na DA-ri do-NA-tur HA-rus di-CA-tat se-CA-ra trans-pa-RAN - `dana` = quỹ/nguồn tiền; `transparan` = minh bạch.",
          "Lỗi người Việt: dùng `uang` cho mọi ngữ cảnh. Trong dự án/tài trợ, `dana` chuyên nghiệp hơn.",
          "Luyện: `Dana harus dicatat secara transparan.`",
        ],
        pronunciation_focus_en: [
          "DA-na DA-ree do-NA-toor HA-roos dee-CHA-tat seh-CHA-ra trans-pa-RAN - `dana` = funds; `transparan` = transparent.",
          "VN-speaker note: `uang` is broad. In grants/projects, `dana` sounds more professional.",
          "Drill: `Dana harus dicatat secara transparan.`",
        ],
      },
      {
        en: "Kami mengundang warga untuk ikut diskusi kebutuhan komunitas.",
        vi: "Chúng tôi mời người dân tham gia thảo luận về nhu cầu cộng đồng.",
        pronunciation_focus: [
          "KA-mi me-NGUN-dang WAR-ga UN-tuk I-kut dis-KU-si ke-bu-TUH-an ko-mu-ni-TAS - `kebutuhan komunitas` = nhu cầu cộng đồng.",
          "Lỗi người Việt: dịch `need` thành `perlu` trong mọi chỗ. Danh từ `nhu cầu` là `kebutuhan`.",
          "Luyện: `Diskusi kebutuhan komunitas.`",
        ],
        pronunciation_focus_en: [
          "KA-mee meh-NGOON-dang WAR-ga OON-took EE-koot dis-KOO-see keh-boo-TOO-han ko-moo-nee-TAS - `kebutuhan komunitas` = community needs.",
          "VN-speaker trap: translating every `need` as `perlu`. The noun `need` is `kebutuhan`.",
          "Drill: `Diskusi kebutuhan komunitas.`",
        ],
      },
      {
        en: "Jadwal pelatihan relawan akan diumumkan minggu depan.",
        vi: "Lịch tập huấn tình nguyện viên sẽ được thông báo vào tuần sau.",
        pronunciation_focus: [
          "JAD-wal pe-LA-tih-an re-LA-wan A-kan di-u-MUM-kan MING-gu de-PAN - `pelatihan relawan` = tập huấn tình nguyện viên; `diumumkan` = được thông báo.",
          "Lỗi người Việt: bỏ bị động `di-` trong thông báo. Văn tổ chức thường dùng `akan diumumkan`.",
          "Luyện: `Jadwal akan diumumkan.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal peh-LA-tee-han reh-LA-wan A-kan dee-oo-MOOM-kan MING-goo deh-PAN - `pelatihan relawan` = volunteer training; `diumumkan` = announced.",
          "VN-speaker trap: dropping passive `di-` in announcements. Organization notices commonly use `akan diumumkan`.",
          "Drill: `Jadwal akan diumumkan.`",
        ],
      },
      {
        en: "Setelah kegiatan selesai, kita perlu evaluasi bersama.",
        vi: "Sau khi hoạt động kết thúc, chúng ta cần đánh giá cùng nhau.",
        pronunciation_focus: [
          "se-TE-lah ke-GI-a-tan se-LE-sai, KI-ta PER-lu e-va-lu-A-si ber-SA-ma - `evaluasi bersama` = đánh giá chung/cùng nhau.",
          "Lỗi người Việt: `evaluasi` trong Indonesia vừa là danh từ vừa hay dùng như động từ thực tế.",
          "Luyện: `Kita perlu evaluasi bersama.`",
        ],
        pronunciation_focus_en: [
          "seh-TEH-lah keh-GEE-a-tan seh-LEH-sai, KEE-ta PER-loo eh-va-loo-A-see ber-SA-ma - `evaluasi bersama` = joint evaluation.",
          "VN-speaker note: in Indonesian, `evaluasi` is a noun but is also commonly used verb-like in practical speech.",
          "Drill: `Kita perlu evaluasi bersama.`",
        ],
      },
      {
        en: "Mohon kirim dokumentasi kegiatan untuk laporan akhir.",
        vi: "Xin gửi tư liệu/hình ảnh hoạt động cho báo cáo cuối kỳ.",
        pronunciation_focus: [
          "MO-hon KI-rim do-ku-men-TA-si ke-GI-a-tan UN-tuk la-PO-ran A-khir - `dokumentasi kegiatan` = tư liệu/hình ảnh hoạt động; `laporan akhir` = báo cáo cuối kỳ.",
          "Lỗi người Việt: `dokumentasi` không chỉ là tài liệu giấy; trong dự án thường gồm ảnh, video, biên bản.",
          "Luyện: `Dokumentasi untuk laporan akhir.`",
        ],
        pronunciation_focus_en: [
          "MO-hon KEE-rim do-koo-men-TA-see keh-GEE-a-tan OON-took la-PO-ran A-khir - `dokumentasi kegiatan` = activity documentation; `laporan akhir` = final report.",
          "VN-speaker note: `dokumentasi` is not only paper documents; in projects it often includes photos, videos, and minutes.",
          "Drill: `Dokumentasi untuk laporan akhir.`",
        ],
      },
      {
        en: "Kami ingin memastikan proyek ini benar-benar bermanfaat.",
        vi: "Chúng tôi muốn đảm bảo dự án này thật sự có ích.",
        pronunciation_focus: [
          "KA-mi I-ngin me-mas-TI-kan PRO-yek I-ni be-NAR-be-NAR ber-man-FA-at - `memastikan` = đảm bảo; `bermanfaat` = có ích.",
          "Lỗi người Việt: dùng `manfaat` như tính từ. Tính từ/động từ trạng thái là `bermanfaat`.",
          "Luyện: `Proyek ini bermanfaat.`",
        ],
        pronunciation_focus_en: [
          "KA-mee EE-ngin meh-mas-TEE-kan PRO-yek EE-nee beh-NAR-beh-NAR ber-man-FA-at - `memastikan` = ensure; `bermanfaat` = useful/beneficial.",
          "VN-speaker trap: using `manfaat` as an adjective. The adjective/state verb is `bermanfaat`.",
          "Drill: `Proyek ini bermanfaat.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong bối cảnh LSM/NGO ở Indonesia, cách nói chuyên nghiệp thường nhấn mạnh minh bạch, koordinasi, laporan, penerima manfaat và kerja sama dengan warga. Khi nói với donatur hoặc pihak desa, dùng giọng lịch sự, cụ thể, và tránh hứa kết quả nếu chưa có dữ liệu.",
    cultural_notes_en:
      "In Indonesian NGO contexts, professional language often emphasizes transparency, coordination, reports, beneficiaries, and cooperation with residents. When speaking with donors or village stakeholders, stay polite and specific, and avoid promising outcomes without data.",
    tip_advice_vi:
      "Dùng `kami` khi nói thay mặt tổ chức, `kita` khi muốn bao gồm người nghe. Với tài trợ, hãy ưu tiên cụm rõ ràng như `menyusun proposal`, `membuat laporan kegiatan`, `mencatat dana`, và `evaluasi bersama`.",
    tip_advice_en:
      "Use `kami` when speaking for your organization, and `kita` when including the listener. For funding contexts, prefer clear phrases like `menyusun proposal`, `membuat laporan kegiatan`, `mencatat dana`, and `evaluasi bersama`.",
    vocabulary: [
      {
        word: "LSM",
        en: "NGO",
        vi: "tổ chức phi chính phủ",
        pos: "noun",
        pronunciation_vi: "el-es-EM",
        pronunciation_en: "el-es-EM",
      },
      {
        word: "proyek komunitas",
        en: "community project",
        vi: "dự án cộng đồng",
        pos: "noun phrase",
        pronunciation_vi: "PRO-yek ko-mu-ni-TAS",
        pronunciation_en: "PRO-yek ko-moo-nee-TAS",
      },
      {
        word: "proposal",
        en: "proposal",
        vi: "đề xuất/dự án đề xuất",
        pos: "noun",
        pronunciation_vi: "pro-PO-sal",
        pronunciation_en: "pro-PO-sal",
      },
      {
        word: "donatur",
        en: "donor",
        vi: "nhà tài trợ",
        pos: "noun",
        pronunciation_vi: "do-NA-tur",
        pronunciation_en: "do-NA-toor",
      },
      {
        word: "laporan kegiatan",
        en: "activity report",
        vi: "báo cáo hoạt động",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran ke-GI-a-tan",
        pronunciation_en: "la-PO-ran keh-GEE-a-tan",
      },
      {
        word: "penerima manfaat",
        en: "beneficiary",
        vi: "người hưởng lợi",
        pos: "noun phrase",
        pronunciation_vi: "pe-ne-RI-ma MAN-fa-at",
        pronunciation_en: "peh-neh-REE-ma MAN-fa-at",
      },
      {
        word: "koordinasi",
        en: "coordination",
        vi: "phối hợp",
        pos: "noun",
        pronunciation_vi: "ko-or-di-NA-si",
        pronunciation_en: "ko-or-dee-NA-see",
      },
      {
        word: "relawan",
        en: "volunteer",
        vi: "tình nguyện viên",
        pos: "noun",
        pronunciation_vi: "re-LA-wan",
        pronunciation_en: "reh-LA-wan",
      },
      {
        word: "dana",
        en: "funds",
        vi: "quỹ/nguồn tiền",
        pos: "noun",
        pronunciation_vi: "DA-na",
        pronunciation_en: "DA-na",
      },
      {
        word: "laporan akhir",
        en: "final report",
        vi: "báo cáo cuối kỳ",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran A-khir",
        pronunciation_en: "la-PO-ran A-khir",
      },
    ],
    dialogue: [
      {
        speaker: "Koordinator LSM",
        text: "Kami sedang menyusun proposal untuk proyek komunitas di desa ini.",
        vi: "Chúng tôi đang soạn đề xuất cho dự án cộng đồng ở làng này.",
        en: "We are preparing a proposal for a community project in this village.",
      },
      {
        speaker: "Donatur",
        text: "Siapa penerima manfaatnya, dan bagaimana laporan kegiatannya?",
        vi: "Ai là người hưởng lợi, và báo cáo hoạt động như thế nào?",
        en: "Who are the beneficiaries, and how will the activity report work?",
      },
      {
        speaker: "Koordinator LSM",
        text: "Penerima manfaatnya adalah anak-anak sekolah. Laporan kegiatan akan kami kirim setiap bulan.",
        vi: "Người hưởng lợi là trẻ em đi học. Báo cáo hoạt động chúng tôi sẽ gửi mỗi tháng.",
        en: "The beneficiaries are school children. We will send the activity report every month.",
      },
      {
        speaker: "Donatur",
        text: "Baik, pastikan dana dicatat secara transparan dan ada dokumentasi kegiatan.",
        vi: "Được, hãy đảm bảo quỹ được ghi chép minh bạch và có tư liệu hoạt động.",
        en: "Good, make sure the funds are recorded transparently and there is activity documentation.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Chúng tôi cần soạn proposal.”",
        prompt_en: "Translate into Indonesian: “We need to prepare a proposal.”",
        answer: "Kami perlu menyusun proposal.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Siapa saja penerima ____ dari proyek ini?",
        prompt_en: "Fill in the blank: Siapa saja penerima ____ dari proyek ini?",
        answer: "manfaat",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “báo cáo hoạt động”?",
        prompt_en: "Which phrase means “activity report”?",
        choices: ["laporan kegiatan", "proposal donatur", "jadwal relawan"],
        answer: "laporan kegiatan",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `LSM` = ?",
        prompt_en: "Match the meaning: `LSM` = ?",
        answer: "NGO",
      },
    ],
  },
];

export default lessons;
