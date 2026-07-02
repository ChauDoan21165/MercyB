// Performance Review & Promotion Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. Field convention follows the Indonesian extra
// pack: sentence `en` holds TARGET-LANGUAGE Indonesian, `vi` holds Vietnamese,
// Vietnamese L1 notes live in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en` with the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
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

export const performanceReviewPromotionLessons: IndonesianLesson[] = [
  {
    id: "indonesian_performance_review_feedback_kpi",
    level: "B1",
    category: "workplace",
    title_vi: "Đánh giá hiệu suất: KPI, mục tiêu và góp ý",
    title_en: "Performance review: KPI, targets and feedback",
    sentences: [
      {
        en: "Minggu depan ada evaluasi kerja dengan atasan saya.",
        vi: "Tuần sau có buổi đánh giá công việc với cấp trên của tôi.",
        pronunciation_focus: [
          "MING-gu de-PAN A-da e-va-lu-A-si KER-ja de-NGAN a-TA-san SA-ya - `evaluasi kerja` = đánh giá công việc; `atasan` = cấp trên.",
          "Lỗi người Việt: dịch 'sếp' thành `bos` trong mọi bối cảnh. Khi nói chính thức ở công ty, `atasan` lịch sự hơn.",
          "Luyện: `Ada evaluasi kerja dengan atasan saya.`",
        ],
        pronunciation_focus_en: [
          "MING-goo de-PAN A-da e-va-loo-A-si KER-ja de-NGAN a-TA-san SA-ya - `evaluasi kerja` = work performance review; `atasan` = superior/manager.",
          "VN-speaker trap: translating 'boss' as `bos` everywhere. In formal office talk, `atasan` is more polite.",
          "Drill: `Ada evaluasi kerja dengan atasan saya.`",
        ],
      },
      {
        en: "Saya sudah mencapai target penjualan kuartal ini.",
        vi: "Tôi đã đạt mục tiêu doanh số quý này.",
        pronunciation_focus: [
          "SA-ya SU-dah men-CA-pai TAR-get pen-JU-al-an ku-AR-tal I-ni - `mencapai target` = đạt mục tiêu; `penjualan` = doanh số/bán hàng.",
          "Lỗi người Việt: nói `dapat target` khi muốn nói đạt mục tiêu. Cụm tự nhiên là `mencapai target`.",
          "Luyện: `Saya sudah mencapai target.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah men-CHA-pai TAR-get pen-JOO-al-an ku-AR-tal EE-ni - `mencapai target` = achieve a target; `penjualan` = sales.",
          "VN-speaker trap: saying `dapat target` when you mean achieve the target. Natural phrase: `mencapai target`.",
          "Drill: `Saya sudah mencapai target.`",
        ],
      },
      {
        en: "KPI saya naik karena proyek selesai tepat waktu.",
        vi: "KPI của tôi tăng vì dự án hoàn thành đúng hạn.",
        pronunciation_focus: [
          "ka-pe-I SA-ya NAIK ka-RE-na PRO-yek se-LE-sai te-PAT WAK-tu - `KPI` đọc từng chữ; `tepat waktu` = đúng giờ/đúng hạn.",
          "Lỗi người Việt: dùng `jam tepat` cho đúng hạn. Cụm chuẩn trong công việc là `tepat waktu`.",
          "Luyện: `Proyek selesai tepat waktu.`",
        ],
        pronunciation_focus_en: [
          "ka-pe-EE SA-ya NAIK ka-RE-na PRO-yek se-LE-sai te-PAT WAK-tu - `KPI` is read letter by letter; `tepat waktu` = on time.",
          "VN-speaker trap: using `jam tepat` for on time. The work phrase is `tepat waktu`.",
          "Drill: `Proyek selesai tepat waktu.`",
        ],
      },
      {
        en: "Saya ingin meminta masukan atasan untuk pengembangan diri.",
        vi: "Tôi muốn xin góp ý từ cấp trên để phát triển bản thân.",
        pronunciation_focus: [
          "SA-ya I-ngin me-MIN-ta ma-SU-kan a-TA-san un-TUK pe-ngem-BANG-an DI-ri - `masukan atasan` = góp ý từ cấp trên.",
          "Lỗi người Việt: dịch 'feedback' thành `kritik` quá nặng. `Masukan` mềm và chuyên nghiệp hơn.",
          "Luyện: `Saya ingin meminta masukan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin me-MIN-ta ma-SOO-kan a-TA-san un-TOOK pe-ngem-BANG-an DEE-ri - `masukan atasan` = manager feedback.",
          "VN-speaker trap: translating feedback as heavy `kritik`. `Masukan` is softer and more professional.",
          "Drill: `Saya ingin meminta masukan.`",
        ],
      },
      {
        en: "Rencana karier saya adalah menjadi supervisor tahun depan.",
        vi: "Kế hoạch nghề nghiệp của tôi là trở thành supervisor năm sau.",
        pronunciation_focus: [
          "ren-CA-na ka-RI-er SA-ya a-DA-lah men-JA-di su-per-VAI-sor TA-hun de-PAN - `rencana karier` = kế hoạch nghề nghiệp.",
          "Lỗi người Việt: dùng `karir` và `karier` lẫn nhau. Cả hai gặp trong thực tế; trong văn bản chính thức, `karier` thường được dùng.",
          "Luyện: `Rencana karier saya jelas.`",
        ],
        pronunciation_focus_en: [
          "ren-CHA-na ka-REE-er SA-ya a-DA-lah men-JA-di su-per-VY-sor TA-hoon de-PAN - `rencana karier` = career plan.",
          "VN-speaker trap: mixing `karir` and `karier`. Both appear, but formal writing often uses `karier`.",
          "Drill: `Rencana karier saya jelas.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhiều công ty Indonesia, `evaluasi kerja` có thể diễn ra hằng quý hoặc hằng năm. Nhân viên thường nói về target, KPI, hasil kerja, masukan atasan, và rencana pengembangan. Giọng nên cụ thể và khiêm tốn: nêu kết quả, nêu bằng chứng, rồi hỏi bước cải thiện tiếp theo.",
    cultural_notes_en:
      "In many Indonesian companies, performance reviews may happen quarterly or annually. Employees often discuss targets, KPIs, work results, manager feedback, and development plans. Keep the tone specific and modest: state results, provide evidence, then ask about next improvement steps.",
    tip_advice_vi:
      "Khung hữu ích: `mencapai target`, `selesai tepat waktu`, `meminta masukan`, `rencana karier`. Tránh nói quá chung như `saya kerja bagus`; hãy nói kết quả cụ thể.",
    tip_advice_en:
      "Useful frames: `mencapai target`, `selesai tepat waktu`, `meminta masukan`, `rencana karier`. Avoid vague claims like `saya kerja bagus`; state concrete results.",
    vocabulary: [
      {
        word: "evaluasi kerja",
        en: "performance review / work evaluation",
        vi: "đánh giá công việc",
        pos: "noun phrase",
        pronunciation_vi: "e-va-lu-A-si KER-ja",
        pronunciation_en: "e-va-loo-A-si KER-ja",
      },
      {
        word: "target",
        en: "target",
        vi: "mục tiêu",
        pos: "noun",
        pronunciation_vi: "TAR-get",
        pronunciation_en: "TAR-get",
      },
      {
        word: "KPI",
        en: "KPI",
        vi: "KPI / chỉ số hiệu suất",
        pos: "noun",
        pronunciation_vi: "ka-pe-I",
        pronunciation_en: "ka-pe-EE",
      },
      {
        word: "masukan atasan",
        en: "manager feedback",
        vi: "góp ý từ cấp trên",
        pos: "noun phrase",
        pronunciation_vi: "ma-SU-kan a-TA-san",
        pronunciation_en: "ma-SOO-kan a-TA-san",
      },
      {
        word: "rencana karier",
        en: "career plan",
        vi: "kế hoạch nghề nghiệp",
        pos: "noun phrase",
        pronunciation_vi: "ren-CA-na ka-RI-er",
        pronunciation_en: "ren-CHA-na ka-REE-er",
      },
      {
        word: "tepat waktu",
        en: "on time",
        vi: "đúng hạn / đúng giờ",
        pos: "adverb phrase",
        pronunciation_vi: "te-PAT WAK-tu",
        pronunciation_en: "te-PAT WAK-tu",
      },
    ],
    dialogue: [
      {
        speaker: "Karyawan",
        text: "Pak, saya ingin membahas hasil evaluasi kerja saya.",
        vi: "Anh/chú ơi, tôi muốn trao đổi về kết quả đánh giá công việc của tôi.",
        en: "Sir, I would like to discuss my performance review results.",
      },
      {
        speaker: "Atasan",
        text: "Baik. Target kuartal ini sudah tercapai dengan baik.",
        vi: "Được. Mục tiêu quý này đã được đạt tốt.",
        en: "Okay. This quarter's target has been achieved well.",
      },
      {
        speaker: "Karyawan",
        text: "Terima kasih. Saya juga ingin meminta masukan untuk rencana karier saya.",
        vi: "Cảm ơn. Tôi cũng muốn xin góp ý cho kế hoạch nghề nghiệp của tôi.",
        en: "Thank you. I would also like feedback on my career plan.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya sudah mencapai ___ penjualan.`",
        prompt_en: "Fill in: `Saya sudah mencapai ___ penjualan.`",
        answer: "target",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi muốn xin góp ý từ cấp trên.",
        prompt_en: "Translate to Indonesian: I want to ask for feedback from my manager.",
        answer: "Saya ingin meminta masukan atasan.",
      },
      {
        type: "choice",
        prompt_vi: "Cụm nào nghĩa là kế hoạch nghề nghiệp?",
        prompt_en: "Which phrase means career plan?",
        options: ["rencana karier", "masukan atasan", "tepat waktu"],
        answer: "rencana karier",
      },
    ],
  },
  {
    id: "indonesian_promotion_raise_achievement",
    level: "B1",
    category: "workplace",
    title_vi: "Thăng chức, tăng lương và thành tích",
    title_en: "Promotion, raise and achievements",
    sentences: [
      {
        en: "Saya ingin berdiskusi tentang peluang promosi.",
        vi: "Tôi muốn thảo luận về cơ hội thăng chức.",
        pronunciation_focus: [
          "SA-ya I-ngin ber-dis-KU-si ten-TANG pe-LU-ang pro-MO-si - `peluang promosi` = cơ hội thăng chức.",
          "Lỗi người Việt: nói `naik jabatan` được, nhưng khi mở đầu với HR/atasan, `peluang promosi` nghe mềm hơn.",
          "Luyện: `Saya ingin berdiskusi tentang peluang promosi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin ber-dis-KOO-si ten-TANG pe-LOO-ang pro-MO-si - `peluang promosi` = promotion opportunity.",
          "VN-speaker trap: `naik jabatan` works, but when opening with HR/manager, `peluang promosi` sounds softer.",
          "Drill: `Saya ingin berdiskusi tentang peluang promosi.`",
        ],
      },
      {
        en: "Saya sudah memimpin tim dalam tiga proyek besar.",
        vi: "Tôi đã dẫn dắt đội trong ba dự án lớn.",
        pronunciation_focus: [
          "SA-ya SU-dah me-MIM-pin tim da-LAM TI-ga PRO-yek be-SAR - `memimpin tim` = dẫn dắt đội; `proyek besar` = dự án lớn.",
          "Lỗi người Việt: dịch 'lead team' thành `lead tim`. Trong tiếng Indonesia chuẩn, dùng `memimpin tim`.",
          "Luyện: `Saya memimpin tim proyek.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah me-MIM-pin tim da-LAM TEE-ga PRO-yek be-SAR - `memimpin tim` = lead a team; `proyek besar` = major project.",
          "VN-speaker trap: translating 'lead team' as `lead tim`. In standard Indonesian, use `memimpin tim`.",
          "Drill: `Saya memimpin tim proyek.`",
        ],
      },
      {
        en: "Prestasi saya bisa dilihat dari laporan KPI tahun ini.",
        vi: "Thành tích của tôi có thể thấy từ báo cáo KPI năm nay.",
        pronunciation_focus: [
          "pres-TA-si SA-ya BI-sa di-LI-hat da-ri la-PO-ran ka-pe-I TA-hun I-ni - `prestasi` = thành tích; `laporan KPI` = báo cáo KPI.",
          "Lỗi người Việt: dùng `hasil` cho mọi loại thành tích. `Prestasi` nhấn mạnh thành tựu đáng ghi nhận.",
          "Luyện: `Prestasi saya bisa dilihat dari laporan.`",
        ],
        pronunciation_focus_en: [
          "pres-TA-si SA-ya BEE-sa di-LEE-hat da-ri la-PO-ran ka-pe-EE TA-hoon EE-ni - `prestasi` = achievement; `laporan KPI` = KPI report.",
          "VN-speaker trap: using `hasil` for every achievement. `Prestasi` emphasizes a notable accomplishment.",
          "Drill: `Prestasi saya bisa dilihat dari laporan.`",
        ],
      },
      {
        en: "Apakah perusahaan membuka kesempatan kenaikan gaji tahun ini?",
        vi: "Công ty có mở cơ hội tăng lương năm nay không?",
        pronunciation_focus: [
          "a-PA-kah per-u-sa-HA-an mem-BU-ka ke-sem-PA-tan ke-NAI-kan GA-ji TA-hun I-ni - `kenaikan gaji` = tăng lương.",
          "Lỗi người Việt: hỏi quá trực tiếp `gaji saya naik?`. Câu `membuka kesempatan kenaikan gaji` lịch sự hơn.",
          "Luyện: `Apakah ada kesempatan kenaikan gaji?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah per-u-sa-HA-an mem-BOO-ka ke-sem-PA-tan ke-NAI-kan GA-ji TA-hoon EE-ni - `kenaikan gaji` = salary raise.",
          "VN-speaker trap: asking too directly `gaji saya naik?`. `Membuka kesempatan kenaikan gaji` is more polite.",
          "Drill: `Apakah ada kesempatan kenaikan gaji?`",
        ],
      },
      {
        en: "Saya siap menerima tanggung jawab yang lebih besar.",
        vi: "Tôi sẵn sàng nhận trách nhiệm lớn hơn.",
        pronunciation_focus: [
          "SA-ya SI-ap me-ne-RI-ma tang-GUNG ja-WAB yang le-BIH be-SAR - `tanggung jawab` = trách nhiệm; `lebih besar` = lớn hơn.",
          "Lỗi người Việt: viết `tanggungjawab` liền. Trong chính tả chuẩn, viết tách: `tanggung jawab`.",
          "Luyện: `Saya siap menerima tanggung jawab.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SEE-ap me-ne-REE-ma tang-GOONG ja-WAB yang le-BIH be-SAR - `tanggung jawab` = responsibility; `lebih besar` = bigger/greater.",
          "VN-speaker trap: writing `tanggungjawab` as one word. Standard spelling separates it: `tanggung jawab`.",
          "Drill: `Saya siap menerima tanggung jawab.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi nói về promosi hoặc kenaikan gaji ở Indonesia, cách nói thường không nên quá đòi hỏi. Nêu prestasi, target yang tercapai, kontribusi tim, lalu hỏi proses atau kriteria. Từ như `peluang`, `kesempatan`, `berdiskusi`, và `tanggung jawab` giúp câu nghe chuyên nghiệp.",
    cultural_notes_en:
      "When discussing promotion or salary raises in Indonesia, the tone should usually not sound demanding. State achievements, achieved targets, team contribution, then ask about the process or criteria. Words like `peluang`, `kesempatan`, `berdiskusi`, and `tanggung jawab` make the conversation sound professional.",
    tip_advice_vi:
      "Cách mở đầu an toàn: `Saya ingin berdiskusi tentang...`, rồi đưa bằng chứng: `prestasi`, `laporan KPI`, `proyek`, `target`. Kết thúc bằng sẵn sàng nhận trách nhiệm, không chỉ nói muốn tiền hoặc chức danh.",
    tip_advice_en:
      "A safe opening: `Saya ingin berdiskusi tentang...`, then give evidence: `prestasi`, `laporan KPI`, `proyek`, `target`. Close by showing readiness for responsibility, not only wanting money or title.",
    vocabulary: [
      {
        word: "promosi",
        en: "promotion",
        vi: "thăng chức",
        pos: "noun",
        pronunciation_vi: "pro-MO-si",
        pronunciation_en: "pro-MO-si",
      },
      {
        word: "peluang promosi",
        en: "promotion opportunity",
        vi: "cơ hội thăng chức",
        pos: "noun phrase",
        pronunciation_vi: "pe-LU-ang pro-MO-si",
        pronunciation_en: "pe-LOO-ang pro-MO-si",
      },
      {
        word: "prestasi",
        en: "achievement",
        vi: "thành tích",
        pos: "noun",
        pronunciation_vi: "pres-TA-si",
        pronunciation_en: "pres-TA-si",
      },
      {
        word: "kenaikan gaji",
        en: "salary raise",
        vi: "tăng lương",
        pos: "noun phrase",
        pronunciation_vi: "ke-NAI-kan GA-ji",
        pronunciation_en: "ke-NAI-kan GA-ji",
      },
      {
        word: "memimpin tim",
        en: "lead a team",
        vi: "dẫn dắt đội",
        pos: "verb phrase",
        pronunciation_vi: "me-MIM-pin tim",
        pronunciation_en: "me-MIM-pin tim",
      },
      {
        word: "tanggung jawab",
        en: "responsibility",
        vi: "trách nhiệm",
        pos: "noun",
        pronunciation_vi: "tang-GUNG ja-WAB",
        pronunciation_en: "tang-GOONG ja-WAB",
      },
    ],
    dialogue: [
      {
        speaker: "Karyawan",
        text: "Bu, saya ingin berdiskusi tentang peluang promosi.",
        vi: "Chị/cô ơi, tôi muốn thảo luận về cơ hội thăng chức.",
        en: "Ma'am, I would like to discuss promotion opportunities.",
      },
      {
        speaker: "Atasan",
        text: "Baik. Apa pencapaian utama Anda tahun ini?",
        vi: "Được. Thành tựu chính của bạn năm nay là gì?",
        en: "Okay. What are your main achievements this year?",
      },
      {
        speaker: "Karyawan",
        text: "Saya mencapai target, memimpin tiga proyek, dan siap menerima tanggung jawab lebih besar.",
        vi: "Tôi đã đạt mục tiêu, dẫn dắt ba dự án, và sẵn sàng nhận trách nhiệm lớn hơn.",
        en: "I achieved the target, led three projects, and am ready to take on greater responsibility.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya ingin berdiskusi tentang peluang ___.`",
        prompt_en: "Fill in: `Saya ingin berdiskusi tentang peluang ___.`",
        answer: "promosi",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi sẵn sàng nhận trách nhiệm lớn hơn.",
        prompt_en: "Translate to Indonesian: I am ready to accept greater responsibility.",
        answer: "Saya siap menerima tanggung jawab yang lebih besar.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `prestasi`, `kenaikan gaji`, `memimpin tim`.",
        prompt_en: "Match meanings: `prestasi`, `kenaikan gaji`, `memimpin tim`.",
        pairs: [
          ["prestasi", "thành tích / achievement"],
          ["kenaikan gaji", "tăng lương / salary raise"],
          ["memimpin tim", "dẫn dắt đội / lead a team"],
        ],
      },
    ],
  },
];
