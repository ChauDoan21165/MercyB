// Hospital Insurance Claim Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_hospital_insurance_claim",
    level: "B1",
    category: "health",
    title_vi: "Klaim bảo hiểm bệnh viện",
    title_en: "Hospital insurance claims",
    sentences: [
      {
        en: "Saya mau mengajukan klaim asuransi rumah sakit.",
        vi: "Tôi muốn nộp yêu cầu bồi thường bảo hiểm bệnh viện.",
        pronunciation_focus: [
          "SA-ya mau me-nga-JU-kan klaim a-su-RAN-si RU-mah SA-kit -- `mengajukan klaim` = nộp hồ sơ/yêu cầu bồi thường.",
          "Lỗi người Việt: nói `minta uang asuransi` nghe thiếu chính thức. Ở bệnh viện/bảo hiểm, dùng `mengajukan klaim`.",
          "Luyện: `Saya mau mengajukan klaim asuransi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-nga-JOO-kan claim a-su-RAN-si ROO-mah SA-kit -- `mengajukan klaim` = file an insurance claim.",
          "VN-speaker trap: saying `minta uang asuransi`, which sounds unofficial. In hospital/insurance contexts, use `mengajukan klaim`.",
          "Drill: `Saya mau mengajukan klaim asuransi.`",
        ],
      },
      {
        en: "Pasien rawat inap selama tiga malam.",
        vi: "Bệnh nhân nằm viện nội trú trong ba đêm.",
        pronunciation_focus: [
          "PA-sien RA-wat I-nap se-LA-ma TI-ga MA-lam -- `rawat inap` = điều trị nội trú/nằm viện; `selama` = trong thời gian.",
          "Lỗi người Việt: dùng `tinggal di rumah sakit`. Thuật ngữ bệnh viện đúng là `rawat inap`.",
          "Luyện: `Pasien rawat inap selama tiga malam.`",
        ],
        pronunciation_focus_en: [
          "PA-sien RA-wat EE-nap se-LA-ma TEE-ga MA-lam -- `rawat inap` = inpatient care/hospitalization; `selama` = for/during.",
          "VN-speaker trap: using `tinggal di rumah sakit`. The hospital term is `rawat inap`.",
          "Drill: `Pasien rawat inap selama tiga malam.`",
        ],
      },
      {
        en: "Tolong simpan kuitansi asli dari rumah sakit.",
        vi: "Làm ơn giữ biên lai gốc từ bệnh viện.",
        pronunciation_focus: [
          "TO-long SIM-pan kui-TAN-si AS-li da-ri RU-mah SA-kit -- `kuitansi asli` = biên lai gốc.",
          "Mẹo: nhiều klaim cần `kuitansi asli`, không chỉ ảnh chụp hoặc bản fotokopi.",
          "Luyện: `Simpan kuitansi asli.`",
        ],
        pronunciation_focus_en: [
          "TO-long SIM-pan kwee-TAN-si AS-li da-ri ROO-mah SA-kit -- `kuitansi asli` = original receipt.",
          "Tip: many claims require the `kuitansi asli`, not only a photo or photocopy.",
          "Drill: `Simpan kuitansi asli.`",
        ],
      },
      {
        en: "Saya perlu surat dokter untuk dokumen pendukung.",
        vi: "Tôi cần giấy của bác sĩ làm tài liệu hỗ trợ.",
        pronunciation_focus: [
          "SA-ya per-LU SU-rat DOK-ter UN-tuk DO-ku-men pen-DU-kung -- `surat dokter` = giấy/chứng nhận của bác sĩ; `dokumen pendukung` = tài liệu hỗ trợ.",
          "`pendukung` từ gốc `dukung` = hỗ trợ. Trong hồ sơ, cụm này rất hay gặp.",
          "Luyện: `Saya perlu surat dokter.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO SOO-rat DOK-ter OON-tuk DO-ku-men pen-DOO-kung -- `surat dokter` = doctor's letter/certificate; `dokumen pendukung` = supporting documents.",
          "`Pendukung` comes from `dukung` = support. This chunk is common in paperwork.",
          "Drill: `Saya perlu surat dokter.`",
        ],
      },
      {
        en: "Plafon kamar saya hanya sampai satu juta per malam.",
        vi: "Hạn mức phòng của tôi chỉ đến một triệu mỗi đêm.",
        pronunciation_focus: [
          "pla-FON KA-mar SA-ya HA-nya SAM-pai SA-tu JU-ta per MA-lam -- `plafon` = hạn mức chi trả; `per malam` = mỗi đêm.",
          "Lỗi người Việt: hiểu `plafon` là trần nhà. Trong bảo hiểm, `plafon` = hạn mức tối đa.",
          "Luyện: `Plafon kamar saya satu juta per malam.`",
        ],
        pronunciation_focus_en: [
          "pla-FON KA-mar SA-ya HA-nya SAM-pai SA-too JOO-ta per MA-lam -- `plafon` = coverage limit; `per malam` = per night.",
          "VN-speaker trap: reading `plafon` only as ceiling. In insurance, it means maximum coverage limit.",
          "Drill: `Plafon kamar saya satu juta per malam.`",
        ],
      },
      {
        en: "Biaya obat bisa direimburs setelah dokumen lengkap.",
        vi: "Chi phí thuốc có thể được hoàn lại sau khi hồ sơ đầy đủ.",
        pronunciation_focus: [
          "bi-A-ya O-bat BI-sa di-re-im-BURS se-TE-lah DO-ku-men LENG-kap -- `reimburs` = hoàn tiền/hoàn phí.",
          "`direimburs` là vay mượn Anh-Indo rất thường trong bảo hiểm tư nhân; văn bản cũng có thể dùng `diganti`.",
          "Luyện: `Biaya obat bisa direimburs.`",
        ],
        pronunciation_focus_en: [
          "bee-A-ya O-bat BEE-sa di-re-im-BURS se-TE-lah DO-ku-men LENG-kap -- `reimburs` = reimburse.",
          "`Direimburs` is common English-Indonesian insurance language; documents may also use `diganti`.",
          "Drill: `Biaya obat bisa direimburs.`",
        ],
      },
      {
        en: "Kenapa klaim saya ditolak?",
        vi: "Tại sao yêu cầu bồi thường của tôi bị từ chối?",
        pronunciation_focus: [
          "ke-NA-pa klaim SA-ya di-TO-lak -- `ditolak` = bị từ chối; `kenapa` = tại sao.",
          "Bị động `di-` rất quan trọng: `tolak` = từ chối, `ditolak` = bị từ chối.",
          "Luyện: `Kenapa klaim saya ditolak?`",
        ],
        pronunciation_focus_en: [
          "ke-NA-pa claim SA-ya di-TO-lak -- `ditolak` = rejected; `kenapa` = why.",
          "Passive `di-` matters: `tolak` = reject, `ditolak` = be rejected.",
          "Drill: `Kenapa klaim saya ditolak?`",
        ],
      },
      {
        en: "Dokumen pendukung apa saja yang masih kurang?",
        vi: "Còn thiếu những tài liệu hỗ trợ nào?",
        pronunciation_focus: [
          "DO-ku-men pen-DU-kung A-pa SA-ja yang MA-sih KU-rang -- `apa saja` = những gì; `masih kurang` = vẫn còn thiếu.",
          "Lỗi người Việt: hỏi `dokumen apa` nghe như một món. Thêm `saja` để hỏi cả danh sách.",
          "Luyện: `Dokumen apa saja yang masih kurang?`",
        ],
        pronunciation_focus_en: [
          "DO-ku-men pen-DOO-kung A-pa SA-ja yang MA-sih KOO-rang -- `apa saja` = what items; `masih kurang` = still missing.",
          "VN-speaker trap: `dokumen apa` sounds like one item. Add `saja` to ask for the full list.",
          "Drill: `Dokumen apa saja yang masih kurang?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Klaim bảo hiểm bệnh viện ở Indonesia có thể theo hai kiểu: cashless (bệnh viện liên kết xử lý trực tiếp) hoặc reimburs/reimbursement (bạn trả trước rồi nộp hồ sơ hoàn tiền). Hồ sơ thường cần kuitansi asli, rincian biaya, surat dokter, ringkasan rawat inap, hasil lab nếu có, fotokopi kartu asuransi, dan formulir klaim. Hỏi rõ `plafon`, pengecualian, batas waktu pengajuan, và lý do nếu `klaim ditolak`.",
    cultural_notes_en:
      "Hospital insurance claims in Indonesia may be cashless, where a partner hospital handles billing directly, or reimbursement, where you pay first and submit documents later. Files often require original receipts, cost details, a doctor's letter, inpatient summary, lab results if any, insurance-card copy, and a claim form. Ask clearly about coverage limits, exclusions, submission deadline, and the reason if a claim is rejected.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm hồ sơ: `klaim asuransi`, `rawat inap`, `kuitansi asli`, `surat dokter`, `plafon`, `direimburs`, `klaim ditolak`, `dokumen pendukung`. Trong ngữ cảnh bảo hiểm, bị động `di-` xuất hiện nhiều: `ditanggung`, `direimburs`, `ditolak`, `dilengkapi`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn paperwork chunks: `klaim asuransi`, `rawat inap`, `kuitansi asli`, `surat dokter`, `plafon`, `direimburs`, `klaim ditolak`, `dokumen pendukung`. Insurance language uses many `di-` passives: `ditanggung`, `direimburs`, `ditolak`, `dilengkapi`.",
    vocabulary: [
      {
        word: "klaim asuransi",
        en: "insurance claim",
        vi: "yêu cầu bồi thường bảo hiểm",
        pos: "noun phrase",
        pronunciation_vi: "klaim a-su-RAN-si",
        pronunciation_en: "claim a-su-RAN-see",
      },
      {
        word: "rawat inap",
        en: "inpatient care",
        vi: "điều trị nội trú / nằm viện",
        pos: "noun / verb phrase",
        pronunciation_vi: "RA-wat I-nap",
        pronunciation_en: "RA-wat EE-nap",
      },
      {
        word: "kuitansi",
        en: "receipt",
        vi: "biên lai",
        pos: "noun",
        pronunciation_vi: "kui-TAN-si",
        pronunciation_en: "kwee-TAN-see",
      },
      {
        word: "surat dokter",
        en: "doctor's letter",
        vi: "giấy/chứng nhận của bác sĩ",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat DOK-ter",
        pronunciation_en: "SOO-rat DOK-ter",
      },
      {
        word: "plafon",
        en: "coverage limit",
        vi: "hạn mức chi trả",
        pos: "noun",
        pronunciation_vi: "pla-FON",
        pronunciation_en: "pla-FON",
      },
      {
        word: "reimburs",
        en: "reimburse",
        vi: "hoàn tiền / hoàn phí",
        pos: "verb",
        pronunciation_vi: "re-im-BURS",
        pronunciation_en: "re-im-BURS",
      },
      {
        word: "penolakan klaim",
        en: "claim rejection",
        vi: "việc từ chối klaim",
        pos: "noun phrase",
        pronunciation_vi: "pe-no-LAK-an klaim",
        pronunciation_en: "pe-no-LAK-an claim",
      },
      {
        word: "dokumen pendukung",
        en: "supporting documents",
        vi: "tài liệu hỗ trợ hồ sơ",
        pos: "noun phrase",
        pronunciation_vi: "DO-ku-men pen-DU-kung",
        pronunciation_en: "DO-ku-men pen-DOO-kung",
      },
      {
        word: "ditanggung",
        en: "covered",
        vi: "được bảo hiểm chi trả",
        pos: "verb",
        pronunciation_vi: "di-TANG-gung",
        pronunciation_en: "di-TANG-goong",
      },
      {
        word: "ditolak",
        en: "rejected",
        vi: "bị từ chối",
        pos: "verb",
        pronunciation_vi: "di-TO-lak",
        pronunciation_en: "di-TO-lak",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Saya mau mengajukan klaim asuransi untuk rawat inap.",
        vi: "Tôi muốn nộp klaim bảo hiểm cho điều trị nội trú.",
        en: "I want to file an insurance claim for inpatient care.",
      },
      {
        speaker: "Petugas",
        text: "Mohon siapkan kuitansi asli, surat dokter, dan dokumen pendukung.",
        vi: "Vui lòng chuẩn bị biên lai gốc, giấy bác sĩ, và tài liệu hỗ trợ.",
        en: "Please prepare the original receipt, doctor's letter, and supporting documents.",
      },
      {
        speaker: "Pasien",
        text: "Apakah biaya obat bisa direimburs?",
        vi: "Chi phí thuốc có thể được hoàn lại không?",
        en: "Can the medicine cost be reimbursed?",
      },
      {
        speaker: "Petugas",
        text: "Bisa, kalau masih masuk plafon polis.",
        vi: "Có thể, nếu vẫn nằm trong hạn mức hợp đồng bảo hiểm.",
        en: "Yes, if it is still within the policy coverage limit.",
      },
      {
        speaker: "Pasien",
        text: "Kalau klaim ditolak, saya harus melengkapi apa?",
        vi: "Nếu klaim bị từ chối, tôi phải bổ sung gì?",
        en: "If the claim is rejected, what must I complete?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi cần biên lai gốc và giấy của bác sĩ.",
        prompt_en: "Translate into Indonesian: I need the original receipt and doctor's letter.",
        answer: "Saya perlu kuitansi asli dan surat dokter.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Kenapa klaim saya ____?",
        prompt_en: "Fill in the blank: Kenapa klaim saya ____?",
        answer: "ditolak",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["rawat inap", "điều trị nội trú / inpatient care"],
          ["kuitansi asli", "biên lai gốc / original receipt"],
          ["plafon", "hạn mức chi trả / coverage limit"],
          ["dokumen pendukung", "tài liệu hỗ trợ / supporting documents"],
        ],
      },
    ],
    content:
      "Useful claim chunks: `Saya mau mengajukan klaim asuransi` (I want to file an insurance claim), `Pasien rawat inap` (the patient is inpatient), `Simpan kuitansi asli` (keep the original receipt), `Saya perlu surat dokter` (I need a doctor's letter), `Biaya obat bisa direimburs?` (can medicine costs be reimbursed?), and `Kenapa klaim saya ditolak?` (why was my claim rejected?).",
  },
];
