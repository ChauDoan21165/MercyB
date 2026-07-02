// Medical specialist referral Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: specialist-referral Indonesian is polite and document-focused:
// `dokter spesialis`, `surat rujukan`, `jadwal kontrol`, `hasil pemeriksaan`,
// `penyakit kronis`, and `biaya konsultasi`.

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
    id: "indonesian_medical_specialist_referral",
    level: "B1",
    category: "health",
    title_vi: "Giấy chuyển tuyến và bác sĩ chuyên khoa",
    title_en: "Specialist referrals and follow-up care",
    sentences: [
      {
        en: "Saya perlu surat rujukan ke dokter spesialis.",
        vi: "Tôi cần giấy chuyển tuyến đến bác sĩ chuyên khoa.",
        pronunciation_focus: [
          "SA-ya PER-lu SU-rat ru-JU-kan ke DOK-ter spe-si-a-LIS - `surat rujukan` = giấy chuyển tuyến; `dokter spesialis` = bác sĩ chuyên khoa.",
          "Lỗi người Việt: nói `surat pindah dokter`. Thuật ngữ y tế tự nhiên là `surat rujukan` hoặc ngắn là `rujukan`.",
          "Luyện: `Saya perlu surat rujukan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo SOO-rat roo-JOO-kan keh DOK-ter speh-see-a-LIS - `surat rujukan` = referral letter; `dokter spesialis` = specialist doctor.",
          "VN-speaker trap: saying `surat pindah dokter`. The natural medical term is `surat rujukan`, or simply `rujukan`.",
          "Drill: `Saya perlu surat rujukan.`",
        ],
      },
      {
        en: "Rujukan ini untuk dokter spesialis penyakit dalam.",
        vi: "Giấy chuyển tuyến này dành cho bác sĩ chuyên khoa nội.",
        pronunciation_focus: [
          "ru-JU-kan I-ni UN-tuk DOK-ter spe-si-a-LIS pe-NYA-kit DA-lam - `penyakit dalam` = nội khoa.",
          "Lỗi người Việt: dịch nội khoa thành `dalam tubuh`. Tên chuyên khoa là `penyakit dalam`.",
          "Luyện: `Spesialis penyakit dalam.`",
        ],
        pronunciation_focus_en: [
          "roo-JOO-kan EE-nee OON-took DOK-ter speh-see-a-LIS peh-NYA-kit DA-lam - `penyakit dalam` = internal medicine.",
          "VN-speaker trap: translating internal medicine as `dalam tubuh`. The specialty name is `penyakit dalam`.",
          "Drill: `Spesialis penyakit dalam.`",
        ],
      },
      {
        en: "Apakah surat rujukan ini masih berlaku?",
        vi: "Giấy chuyển tuyến này còn hiệu lực không?",
        pronunciation_focus: [
          "a-PA-kah SU-rat ru-JU-kan I-ni MA-sih ber-LA-ku - `masih berlaku` = còn hiệu lực.",
          "Lỗi người Việt: dùng `masih hidup` cho giấy tờ. Với giấy tờ/thẻ, nói `masih berlaku`.",
          "Luyện: `Rujukan masih berlaku?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SOO-rat roo-JOO-kan EE-nee MA-see ber-LA-koo - `masih berlaku` = still valid.",
          "VN-speaker trap: using `masih hidup` for documents. For documents/cards, say `masih berlaku`.",
          "Drill: `Rujukan masih berlaku?`",
        ],
      },
      {
        en: "Saya ingin membuat jadwal kontrol dengan dokter spesialis.",
        vi: "Tôi muốn đặt lịch tái khám với bác sĩ chuyên khoa.",
        pronunciation_focus: [
          "SA-ya I-ngin mem-BU-at JAD-wal kon-TROL de-NGAN DOK-ter spe-si-a-LIS - `jadwal kontrol` = lịch tái khám.",
          "Lỗi người Việt: nói `janji kontrol` được hiểu, nhưng ở quầy bệnh viện `membuat jadwal kontrol` rõ hơn.",
          "Luyện: `Membuat jadwal kontrol.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin mem-BOO-at JAD-wal kon-TROL deh-NGAN DOK-ter speh-see-a-LIS - `jadwal kontrol` = follow-up schedule.",
          "VN-speaker note: `janji kontrol` may be understood, but at hospital counters `membuat jadwal kontrol` is clearer.",
          "Drill: `Membuat jadwal kontrol.`",
        ],
      },
      {
        en: "Kapan jadwal kontrol berikutnya?",
        vi: "Lịch tái khám tiếp theo là khi nào?",
        pronunciation_focus: [
          "KA-pan JAD-wal kon-TROL be-RI-kut-nya - `berikutnya` = tiếp theo.",
          "Lỗi người Việt: hỏi `jam berapa` khi cần cả ngày/lịch. `Kapan` rộng hơn và tự nhiên cho lịch tái khám.",
          "Luyện: `Kapan kontrol berikutnya?`",
        ],
        pronunciation_focus_en: [
          "KA-pan JAD-wal kon-TROL beh-REE-koot-nya - `berikutnya` = next.",
          "VN-speaker trap: asking `jam berapa` when you need the whole date/schedule. `Kapan` is broader and natural for follow-up timing.",
          "Drill: `Kapan kontrol berikutnya?`",
        ],
      },
      {
        en: "Saya membawa hasil pemeriksaan dari dokter umum.",
        vi: "Tôi mang kết quả khám từ bác sĩ đa khoa.",
        pronunciation_focus: [
          "SA-ya mem-BA-wa HA-sil pe-me-RIK-sa-an DA-ri DOK-ter U-mum - `hasil pemeriksaan` = kết quả khám/kiểm tra; `dokter umum` = bác sĩ đa khoa.",
          "Lỗi người Việt: nói `hasil periksa` trong văn bệnh viện hơi cụt. Cụm đầy đủ là `hasil pemeriksaan`.",
          "Luyện: `Hasil pemeriksaan dari dokter umum.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-BA-wa HA-sil peh-meh-RIK-sa-an DA-ree DOK-ter OO-moom - `hasil pemeriksaan` = examination results; `dokter umum` = general practitioner.",
          "VN-speaker trap: `hasil periksa` sounds clipped in hospital speech. The full phrase is `hasil pemeriksaan`.",
          "Drill: `Hasil pemeriksaan dari dokter umum.`",
        ],
      },
      {
        en: "Penyakit kronis saya perlu dipantau rutin.",
        vi: "Bệnh mãn tính của tôi cần được theo dõi định kỳ.",
        pronunciation_focus: [
          "pe-NYA-kit KRO-nis SA-ya PER-lu di-PAN-tau ru-TIN - `penyakit kronis` = bệnh mãn tính; `dipantau rutin` = được theo dõi định kỳ.",
          "Lỗi người Việt: dùng `sakit lama` nghe không chuyên nghiệp. Trong y tế dùng `penyakit kronis`.",
          "Luyện: `Perlu dipantau rutin.`",
        ],
        pronunciation_focus_en: [
          "peh-NYA-kit KRO-nis SA-ya PER-loo dee-PAN-tau roo-TEEN - `penyakit kronis` = chronic illness; `dipantau rutin` = monitored regularly.",
          "VN-speaker trap: `sakit lama` sounds non-medical. In healthcare, use `penyakit kronis`.",
          "Drill: `Perlu dipantau rutin.`",
        ],
      },
      {
        en: "Biaya konsultasi dokter spesialis berapa?",
        vi: "Phí tư vấn/khám bác sĩ chuyên khoa là bao nhiêu?",
        pronunciation_focus: [
          "BI-a-ya kon-sul-TA-si DOK-ter spe-si-a-LIS be-RA-pa - `biaya konsultasi` = phí tư vấn/khám; `berapa` = bao nhiêu.",
          "Lỗi người Việt: hỏi giá bằng `apa`. Giá/phí luôn hỏi bằng `berapa`.",
          "Luyện: `Biaya konsultasi berapa?`",
        ],
        pronunciation_focus_en: [
          "BEE-a-ya kon-sool-TA-see DOK-ter speh-see-a-LIS beh-RA-pa - `biaya konsultasi` = consultation fee; `berapa` = how much.",
          "VN-speaker trap: asking prices with `apa`. Prices/fees use `berapa`.",
          "Drill: `Biaya konsultasi berapa?`",
        ],
      },
      {
        en: "Apakah biaya konsultasi ditanggung asuransi?",
        vi: "Phí khám/tư vấn có được bảo hiểm chi trả không?",
        pronunciation_focus: [
          "a-PA-kah BI-a-ya kon-sul-TA-si di-TANG-gung a-su-RAN-si - `ditanggung asuransi` = được bảo hiểm chi trả.",
          "Lỗi người Việt: dịch `cover` thành `cover` trong câu Indonesia. Cụm tự nhiên là `ditanggung asuransi`.",
          "Luyện: `Ditanggung asuransi?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah BEE-a-ya kon-sool-TA-see dee-TANG-goong a-soo-RAN-see - `ditanggung asuransi` = covered by insurance.",
          "VN-speaker trap: using English `cover` inside Indonesian. Natural phrasing is `ditanggung asuransi`.",
          "Drill: `Ditanggung asuransi?`",
        ],
      },
      {
        en: "Dokter meminta saya membawa hasil lab saat kontrol.",
        vi: "Bác sĩ yêu cầu tôi mang kết quả xét nghiệm khi tái khám.",
        pronunciation_focus: [
          "DOK-ter me-MIN-ta SA-ya mem-BA-wa HA-sil lab SA-at kon-TROL - `hasil lab` = kết quả xét nghiệm; `saat kontrol` = khi tái khám.",
          "Lỗi người Việt: `saat` dùng tốt cho thời điểm trong quy trình; đừng chỉ dùng `waktu` cho mọi trường hợp.",
          "Luyện: `Bawa hasil lab saat kontrol.`",
        ],
        pronunciation_focus_en: [
          "DOK-ter meh-MIN-ta SA-ya mem-BA-wa HA-sil lab SA-at kon-TROL - `hasil lab` = lab results; `saat kontrol` = during follow-up.",
          "VN-speaker note: `saat` works well for a point in a procedure; do not rely on `waktu` for every case.",
          "Drill: `Bawa hasil lab saat kontrol.`",
        ],
      },
      {
        en: "Saya perlu klarifikasi hasil pemeriksaan ini.",
        vi: "Tôi cần làm rõ kết quả khám/kiểm tra này.",
        pronunciation_focus: [
          "SA-ya PER-lu kla-ri-fi-KA-si HA-sil pe-me-RIK-sa-an I-ni - `klarifikasi` = làm rõ; `hasil pemeriksaan` = kết quả khám.",
          "Lỗi người Việt: nói `saya tidak mengerti` được, nhưng với bác sĩ có thể hỏi cụ thể hơn: `perlu klarifikasi`.",
          "Luyện: `Perlu klarifikasi hasil pemeriksaan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo kla-ree-fee-KA-see HA-sil peh-meh-RIK-sa-an EE-nee - `klarifikasi` = clarification; `hasil pemeriksaan` = examination results.",
          "VN-speaker note: `saya tidak mengerti` works, but with a doctor you can be more specific: `perlu klarifikasi`.",
          "Drill: `Perlu klarifikasi hasil pemeriksaan.`",
        ],
      },
      {
        en: "Kalau gejala memburuk, saya harus kembali lebih cepat.",
        vi: "Nếu triệu chứng nặng hơn, tôi phải quay lại sớm hơn.",
        pronunciation_focus: [
          "KA-lau ge-JA-la mem-BU-ruk, SA-ya HA-rus kem-BA-li LE-bih CE-pat - `gejala memburuk` = triệu chứng nặng hơn.",
          "Lỗi người Việt: nói `sakit naik` không tự nhiên. Triệu chứng xấu đi là `gejala memburuk`.",
          "Luyện: `Gejala memburuk.`",
        ],
        pronunciation_focus_en: [
          "KA-lau geh-JA-la mem-BOO-rook, SA-ya HA-roos kem-BA-lee LEH-bih CHEH-pat - `gejala memburuk` = symptoms worsen.",
          "VN-speaker trap: `sakit naik` is not natural. Worsening symptoms are `gejala memburuk`.",
          "Drill: `Gejala memburuk.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, bệnh nhân thường cần `surat rujukan` từ `dokter umum` hoặc fasilitas kesehatan trước khi gặp `dokter spesialis`, đặc biệt khi dùng BPJS. Khi đi khám chuyên khoa, nên mang `hasil pemeriksaan`, `hasil lab`, danh sách thuốc, và hỏi rõ `jadwal kontrol` cũng như `biaya konsultasi`. Bài này dạy ngôn ngữ thực tế, không thay thế tư vấn y tế.",
    cultural_notes_en:
      "In Indonesia, patients often need a `surat rujukan` from a general doctor or health facility before seeing a `dokter spesialis`, especially when using BPJS. For specialist visits, bring `hasil pemeriksaan`, lab results, a medicine list, and ask clearly about the follow-up schedule and consultation fee. This lesson teaches practical language, not medical advice.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `dokter umum` = bác sĩ đa khoa, `dokter spesialis` = bác sĩ chuyên khoa, `surat rujukan` = giấy chuyển tuyến, `jadwal kontrol` = lịch tái khám. Khi hỏi phí, dùng `berapa`; khi hỏi bảo hiểm chi trả, dùng `ditanggung asuransi`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `dokter umum` = general practitioner, `dokter spesialis` = specialist, `surat rujukan` = referral letter, and `jadwal kontrol` = follow-up schedule. Ask fees with `berapa`; ask insurance coverage with `ditanggung asuransi`.",
    vocabulary: [
      {
        word: "dokter spesialis",
        en: "specialist doctor",
        vi: "bác sĩ chuyên khoa",
        pos: "noun phrase",
        pronunciation_vi: "DOK-ter spe-si-a-LIS",
        pronunciation_en: "DOK-ter speh-see-a-LIS",
      },
      {
        word: "surat rujukan",
        en: "referral letter",
        vi: "giấy chuyển tuyến",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat ru-JU-kan",
        pronunciation_en: "SOO-rat roo-JOO-kan",
      },
      {
        word: "jadwal kontrol",
        en: "follow-up schedule",
        vi: "lịch tái khám",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal kon-TROL",
        pronunciation_en: "JAD-wal kon-TROL",
      },
      {
        word: "hasil pemeriksaan",
        en: "examination results",
        vi: "kết quả khám/kiểm tra",
        pos: "noun phrase",
        pronunciation_vi: "HA-sil pe-me-RIK-sa-an",
        pronunciation_en: "HA-sil peh-meh-RIK-sa-an",
      },
      {
        word: "penyakit kronis",
        en: "chronic illness",
        vi: "bệnh mãn tính",
        pos: "noun phrase",
        pronunciation_vi: "pe-NYA-kit KRO-nis",
        pronunciation_en: "peh-NYA-kit KRO-nis",
      },
      {
        word: "biaya konsultasi",
        en: "consultation fee",
        vi: "phí tư vấn/khám",
        pos: "noun phrase",
        pronunciation_vi: "BI-a-ya kon-sul-TA-si",
        pronunciation_en: "BEE-a-ya kon-sool-TA-see",
      },
      {
        word: "dokter umum",
        en: "general practitioner",
        vi: "bác sĩ đa khoa",
        pos: "noun phrase",
        pronunciation_vi: "DOK-ter U-mum",
        pronunciation_en: "DOK-ter OO-moom",
      },
      {
        word: "ditanggung asuransi",
        en: "covered by insurance",
        vi: "được bảo hiểm chi trả",
        pos: "verb phrase",
        pronunciation_vi: "di-TANG-gung a-su-RAN-si",
        pronunciation_en: "dee-TANG-goong a-soo-RAN-see",
      },
      {
        word: "hasil lab",
        en: "lab results",
        vi: "kết quả xét nghiệm",
        pos: "noun phrase",
        pronunciation_vi: "HA-sil lab",
        pronunciation_en: "HA-sil lab",
      },
      {
        word: "gejala memburuk",
        en: "symptoms worsen",
        vi: "triệu chứng nặng hơn",
        pos: "verb phrase",
        pronunciation_vi: "ge-JA-la mem-BU-ruk",
        pronunciation_en: "geh-JA-la mem-BOO-rook",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Saya perlu surat rujukan ke dokter spesialis penyakit dalam.",
        vi: "Tôi cần giấy chuyển tuyến đến bác sĩ chuyên khoa nội.",
        en: "I need a referral letter to an internal medicine specialist.",
      },
      {
        speaker: "Petugas Klinik",
        text: "Baik. Tolong bawa hasil pemeriksaan dan kartu asuransi.",
        vi: "Được. Vui lòng mang kết quả khám và thẻ bảo hiểm.",
        en: "All right. Please bring the examination results and insurance card.",
      },
      {
        speaker: "Pasien",
        text: "Biaya konsultasi ditanggung asuransi atau bayar sendiri?",
        vi: "Phí khám được bảo hiểm chi trả hay tự trả?",
        en: "Is the consultation fee covered by insurance or self-paid?",
      },
      {
        speaker: "Petugas Klinik",
        text: "Kalau rujukannya masih berlaku, biasanya ditanggung sesuai ketentuan.",
        vi: "Nếu giấy chuyển tuyến còn hiệu lực, thường được chi trả theo quy định.",
        en: "If the referral is still valid, it is usually covered according to the rules.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Tôi cần giấy chuyển tuyến.”",
        prompt_en: "Translate into Indonesian: “I need a referral letter.”",
        answer: "Saya perlu surat rujukan.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Biaya konsultasi dokter spesialis ____?",
        prompt_en: "Fill in the blank: Biaya konsultasi dokter spesialis ____?",
        answer: "berapa",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “bệnh mãn tính”?",
        prompt_en: "Which phrase means “chronic illness”?",
        choices: ["penyakit kronis", "surat rujukan", "jadwal kontrol"],
        answer: "penyakit kronis",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `hasil pemeriksaan` = ?",
        prompt_en: "Match the meaning: `hasil pemeriksaan` = ?",
        answer: "examination results",
      },
    ],
  },
];

export default lessons;
