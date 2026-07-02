// Labor Rights Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Labor-rights Indonesian is formal/legal: full `saya`, the passive `di-` (`saya
// di-PHK`, `hak yang harus dibayar`), bureaucratic nouns (`pesangon`, `perjanjian`,
// `tunjangan`), and a wall of acronyms (UMR/UMP/UMK, PHK, THR, BPJS). Vietnamese
// WIN: still no conjugation/gender/tone. Trap: the heavy affixation and not
// reaching for English when a precise term exists.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
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

// Loosely typed so per-type fields (translation, fill-blank, checklist) can vary.
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
    id: "indonesian_labor_rights",
    level: "B2",
    category: "work",
    title_vi: "Tiếng Indonesia về quyền lao động",
    title_en: "Labor rights Indonesian",
    sentences: [
      // ── Contract & wage basics ─────────────────────────────────────────
      {
        en: "Saya ingin tahu isi kontrak kerja saya.",
        vi: "Tôi muốn biết nội dung hợp đồng lao động của tôi.",
        pronunciation_focus: [
          "SA-ya I-ngin TA-hu I-si KON-trak KER-ja — `ingin` = muốn (trang trọng hơn `mau`); `isi` = nội dung; `kontrak kerja` = hợp đồng lao động.",
          "Lỗi người Việt: dùng `mau` trong ngữ cảnh pháp lý. Văn phong trang trọng nên dùng `ingin`.",
          "Luyện: `Saya ingin tahu isi kontrak kerja saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin TA-hu I-si KON-trak KER-ja — `ingin` = wish/want (more formal than `mau`); `isi` = content; `kontrak kerja` = work contract.",
          "VN-speaker trap: casual `mau` in a legal context. The formal register prefers `ingin`.",
          "Drill: `Saya ingin tahu isi kontrak kerja saya.`",
        ],
      },
      {
        en: "Apakah ini kontrak tetap atau kontrak sementara?",
        vi: "Đây là hợp đồng dài hạn hay hợp đồng tạm thời ạ?",
        pronunciation_focus: [
          "a-pa-KAH I-ni KON-trak TE-tap A-tau ... se-men-TA-ra — `tetap` = cố định/dài hạn (PKWTT); `sementara` = tạm thời (PKWT).",
          "Lỗi người Việt: nói `kontrak lama`. 'Hợp đồng dài hạn/không thời hạn' là `tetap`, không `lama` (cũ).",
          "Luyện: `Apakah ini kontrak tetap atau kontrak sementara?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH I-ni KON-trak TE-tap A-tau ... se-men-TA-ra — `tetap` = permanent (PKWTT); `sementara` = temporary (PKWT).",
          "VN-speaker trap: `kontrak lama`. A permanent contract is `tetap`, not `lama` (= old).",
          "Drill: `Apakah ini kontrak tetap atau kontrak sementara?`",
        ],
      },
      {
        en: "Gaji saya di bawah UMR daerah ini.",
        vi: "Lương của tôi dưới mức lương tối thiểu vùng này.",
        pronunciation_focus: [
          "GA-ji SA-ya di BA-wah u-em-er DA-e-rah — `gaji` = lương; `di bawah` = dưới; `UMR` đọc 'u-em-er' = lương tối thiểu vùng.",
          "Lỗi người Việt: nói `gaji rendah` chung chung. Để khiếu nại pháp lý nói rõ `di bawah UMR` (dưới mức tối thiểu).",
          "Luyện: `Gaji saya di bawah UMR daerah ini.`",
        ],
        pronunciation_focus_en: [
          "GA-ji SA-ya di BA-wah u-em-er DA-e-rah — `gaji` = wage/salary; `di bawah` = below; `UMR` ('u-em-er') = regional minimum wage.",
          "VN-speaker trap: vague `gaji rendah`. For a legal complaint say precisely `di bawah UMR` (below minimum).",
          "Drill: `Gaji saya di bawah UMR daerah ini.`",
        ],
      },
      // ── Overtime, hours, benefits ──────────────────────────────────────
      {
        en: "Lembur saya belum dibayar bulan ini.",
        vi: "Tiền tăng ca của tôi tháng này chưa được trả.",
        pronunciation_focus: [
          "LEM-bur SA-ya be-LUM di-BA-yar — `lembur` = làm thêm giờ/tăng ca; `belum dibayar` (bị động) = chưa được trả.",
          "Lỗi người Việt: né bị động. 'Chưa được trả' chuẩn là `belum dibayar`, không `tidak bayar`.",
          "Luyện: `Lembur saya belum dibayar bulan ini.`",
        ],
        pronunciation_focus_en: [
          "LEM-bur SA-ya be-LUM di-BA-yar — `lembur` = overtime; `belum dibayar` (passive) = not yet paid.",
          "VN-speaker trap: avoiding the passive. 'Not yet paid' is `belum dibayar`, not `tidak bayar`.",
          "Drill: `Lembur saya belum dibayar bulan ini.`",
        ],
      },
      {
        en: "Saya berhak atas cuti tahunan dan THR.",
        vi: "Tôi có quyền nghỉ phép năm và thưởng lễ (THR).",
        pronunciation_focus: [
          "SA-ya ber-HAK A-tas CHU-ti ta-HU-nan dan te-ha-er — `berhak atas` = có quyền hưởng; `cuti` = nghỉ phép ('chu-ti'); `THR` = thưởng dịp lễ.",
          "Lỗi người Việt: nói `saya punya hak`. Cấu trúc chuẩn là `berhak atas` + danh từ.",
          "Luyện: `Saya berhak atas cuti tahunan dan THR.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ber-HAK A-tas CHU-ti ta-HU-nan dan te-ha-er — `berhak atas` = entitled to; `cuti` = leave ('chu-ti'); `THR` = religious-holiday bonus.",
          "VN-speaker trap: `saya punya hak`. The set structure is `berhak atas` + noun.",
          "Drill: `Saya berhak atas cuti tahunan dan THR.`",
        ],
      },
      {
        en: "Perusahaan wajib mendaftarkan saya ke BPJS Ketenagakerjaan.",
        vi: "Công ty bắt buộc đăng ký tôi vào BHXH nghề nghiệp (BPJS lao động).",
        pronunciation_focus: [
          "pe-ru-sa-HA-an WA-jib men-daf-TAR-kan ... ke-te-na-ga-ker-JA-an — `wajib` = bắt buộc; `mendaftarkan` = đăng ký (ai đó); `BPJS Ketenagakerjaan` = quỹ BHXH lao động.",
          "Lỗi người Việt: nói `harus daftar`. 'Có nghĩa vụ pháp lý' dùng `wajib` + `mendaftarkan`.",
          "Luyện: `Perusahaan wajib mendaftarkan saya ke BPJS Ketenagakerjaan.`",
        ],
        pronunciation_focus_en: [
          "pe-ru-sa-HA-an WA-jib men-daf-TAR-kan ... ke-te-na-ga-ker-JA-an — `wajib` = obligated; `mendaftarkan` = to register (someone); `BPJS Ketenagakerjaan` = the labor social-security fund.",
          "VN-speaker trap: `harus daftar`. A legal duty uses `wajib` + `mendaftarkan`.",
          "Drill: `Perusahaan wajib mendaftarkan saya ke BPJS Ketenagakerjaan.`",
        ],
      },
      // ── Termination (PHK) & severance ──────────────────────────────────
      {
        en: "Saya di-PHK tanpa pemberitahuan.",
        vi: "Tôi bị sa thải mà không có thông báo.",
        pronunciation_focus: [
          "SA-ya di-pe-ha-ka TAN-pa pem-be-ri-ta-HU-an — `di-PHK` (bị động) = bị cho thôi việc; `tanpa` = không có; `pemberitahuan` = sự thông báo.",
          "Lỗi người Việt: nói `saya dipecat` (= bị đuổi, sắc thái nặng/cá nhân). `di-PHK` là chấm dứt HĐLĐ chính thức.",
          "Luyện: `Saya di-PHK tanpa pemberitahuan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya di-pe-ha-ka TAN-pa pem-be-ri-ta-HU-an — `di-PHK` (passive) = laid off / terminated; `tanpa` = without; `pemberitahuan` = notice/notification.",
          "VN-speaker trap: `saya dipecat` (= fired, harsher/personal). `di-PHK` is the formal employment termination.",
          "Drill: `Saya di-PHK tanpa pemberitahuan.`",
        ],
      },
      {
        en: "Saya berhak mendapat pesangon sesuai aturan.",
        vi: "Tôi có quyền nhận trợ cấp thôi việc theo quy định.",
        pronunciation_focus: [
          "SA-ya ber-HAK men-DA-pat pe-SA-ngon se-SU-ai a-TU-ran — `pesangon` = trợ cấp thôi việc; `sesuai aturan` = theo đúng quy định.",
          "Lỗi người Việt: nói `uang keluar`. Khoản trợ cấp khi PHK đúng tên là `pesangon`.",
          "Luyện: `Saya berhak mendapat pesangon sesuai aturan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ber-HAK men-DA-pat pe-SA-ngon se-SU-ai a-TU-ran — `pesangon` = severance pay; `sesuai aturan` = as per the rules.",
          "VN-speaker trap: `uang keluar`. The legal severance payment is named `pesangon`.",
          "Drill: `Saya berhak mendapat pesangon sesuai aturan.`",
        ],
      },
      {
        en: "Berapa besar pesangon yang seharusnya saya terima?",
        vi: "Khoản trợ cấp thôi việc tôi đáng lẽ phải nhận là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa be-SAR pe-SA-ngon yang se-ha-RUS-nya SA-ya te-RI-ma — `seharusnya` = đáng lẽ/lẽ ra; `yang … saya terima` = cái mà tôi nhận.",
          "Lỗi người Việt: nói `harus` trống. `seharusnya` (lẽ ra, theo đúng quyền) tinh tế và đúng pháp lý hơn.",
          "Luyện: `Berapa besar pesangon yang seharusnya saya terima?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa be-SAR pe-SA-ngon yang se-ha-RUS-nya SA-ya te-RI-ma — `seharusnya` = ought to / rightfully; `yang … saya terima` = the one I receive.",
          "VN-speaker trap: bare `harus`. `seharusnya` ('rightfully due') is subtler and legally apt.",
          "Drill: `Berapa besar pesangon yang seharusnya saya terima?`",
        ],
      },
      // ── Asserting rights, union, dispute ───────────────────────────────
      {
        en: "Saya ingin menuntut hak saya secara baik-baik.",
        vi: "Tôi muốn đòi quyền lợi của mình một cách ôn hòa.",
        pronunciation_focus: [
          "SA-ya I-ngin me-NUN-tut HAK SA-ya se-CHA-ra BA-ik-BA-ik — `menuntut` = đòi/yêu cầu (quyền); `secara baik-baik` = một cách ôn hòa.",
          "Lỗi người Việt: nói `minta hak` (= xin). 'Đòi quyền chính đáng' là `menuntut hak`, mạnh và đúng hơn.",
          "Luyện: `Saya ingin menuntut hak saya secara baik-baik.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin me-NUN-tut HAK SA-ya se-CHA-ra BA-ik-BA-ik — `menuntut` = to claim/demand (a right); `secara baik-baik` = amicably.",
          "VN-speaker trap: `minta hak` (= to ask/beg). 'To claim a rightful entitlement' is `menuntut hak`, stronger and apt.",
          "Drill: `Saya ingin menuntut hak saya secara baik-baik.`",
        ],
      },
      {
        en: "Saya akan berkonsultasi dengan serikat pekerja.",
        vi: "Tôi sẽ tham khảo công đoàn.",
        pronunciation_focus: [
          "SA-ya A-kan ber-kon-sul-TA-si DE-ngan se-ri-KAT pe-KER-ja — `berkonsultasi dengan` = tham khảo/hỏi ý kiến; `serikat pekerja` = công đoàn/nghiệp đoàn.",
          "Lỗi người Việt: nói `union` (chêm Anh). Công đoàn là `serikat pekerja` (hoặc `serikat buruh`).",
          "Luyện: `Saya akan berkonsultasi dengan serikat pekerja.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan ber-kon-sul-TA-si DE-ngan se-ri-KAT pe-KER-ja — `berkonsultasi dengan` = to consult with; `serikat pekerja` = labor union.",
          "VN-speaker trap: English `union`. The union is `serikat pekerja` (or `serikat buruh`).",
          "Drill: `Saya akan berkonsultasi dengan serikat pekerja.`",
        ],
      },
      {
        en: "Kalau tidak selesai, saya akan lapor ke Disnaker.",
        vi: "Nếu không giải quyết được, tôi sẽ báo lên Sở Lao động.",
        pronunciation_focus: [
          "KA-lau TI-dak se-le-SAI, SA-ya A-kan LA-por ke dis-NA-ker — `lapor ke` = báo cáo/khiếu nại lên; `Disnaker` = Sở Lao động (Dinas Tenaga Kerja).",
          "Lỗi người Việt: nói `kasih tahu`. Khiếu nại chính thức lên cơ quan dùng `lapor ke`.",
          "Luyện: `Kalau tidak selesai, saya akan lapor ke Disnaker.`",
        ],
        pronunciation_focus_en: [
          "KA-lau TI-dak se-le-SAI, SA-ya A-kan LA-por ke dis-NA-ker — `lapor ke` = to report/file with; `Disnaker` = the labor office (Dinas Tenaga Kerja).",
          "VN-speaker trap: `kasih tahu`. A formal complaint to an agency uses `lapor ke`.",
          "Drill: `Kalau tidak selesai, saya akan lapor ke Disnaker.`",
        ],
      },
      {
        en: "Tolong berikan bukti tertulis, ya, Pak.",
        vi: "Làm ơn cho tôi bằng chứng bằng văn bản, ạ.",
        pronunciation_focus: [
          "TO-long be-ri-KAN BUK-ti ter-TU-lis — `bukti tertulis` = bằng chứng bằng văn bản; `berikan` (gốc `beri` + `-kan`) = hãy đưa/cấp.",
          "Lỗi người Việt: nói `tulis bukti`. Xin tài liệu chính thức dùng `bukti tertulis` (`ter-` = ở dạng đã viết).",
          "Luyện: `Tolong berikan bukti tertulis, ya, Pak.`",
        ],
        pronunciation_focus_en: [
          "TO-long be-ri-KAN BUK-ti ter-TU-lis — `bukti tertulis` = written evidence; `berikan` (root `beri` + `-kan`) = please give/issue.",
          "VN-speaker trap: `tulis bukti`. Requesting formal documentation uses `bukti tertulis` (`ter-` = in written form).",
          "Drill: `Tolong berikan bukti tertulis, ya, Pak.`",
        ],
      },
      {
        en: "Saya hanya menuntut yang menjadi hak saya.",
        vi: "Tôi chỉ đòi những gì thuộc về quyền của tôi.",
        pronunciation_focus: [
          "SA-ya HA-nya me-NUN-tut yang men-JA-di HAK SA-ya — `hanya` = chỉ; `yang menjadi hak saya` = cái trở thành/thuộc quyền của tôi.",
          "Lưu ý: câu này thể hiện thái độ ôn hòa nhưng kiên định — rất hữu ích khi thương lượng với chủ.",
          "Luyện: `Saya hanya menuntut yang menjadi hak saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-nya me-NUN-tut yang men-JA-di HAK SA-ya — `hanya` = only; `yang menjadi hak saya` = what is rightfully mine.",
          "VN-speaker note: this line is amicable but firm — very useful when negotiating with an employer.",
          "Drill: `Saya hanya menuntut yang menjadi hak saya.`",
        ],
      },
      {
        en: "Mari kita selesaikan ini secara musyawarah.",
        vi: "Chúng ta hãy giải quyết việc này bằng thương lượng/đối thoại.",
        pronunciation_focus: [
          "MA-ri KI-ta se-le-SAI-kan I-ni se-CHA-ra mu-sya-WA-rah — `musyawarah` = bàn bạc/đối thoại đồng thuận (giá trị văn hóa Indonesia); `kita` đúng (gồm cả người nghe).",
          "Lưu ý người Việt: `kita` (gồm cả chủ — cùng giải quyết) đúng ở đây; `musyawarah` là cách giải quyết được ưa chuộng.",
          "Luyện: `Mari kita selesaikan ini secara musyawarah.`",
        ],
        pronunciation_focus_en: [
          "MA-ri KI-ta se-le-SAI-kan I-ni se-CHA-ra mu-sya-WA-rah — `musyawarah` = consensus deliberation (a core Indonesian value); `kita` is right (includes the listener).",
          "VN-speaker note: `kita` (incl. the employer — solving together) is correct here; `musyawarah` is the preferred path.",
          "Drill: `Mari kita selesaikan ini secara musyawarah.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Quan hệ lao động ở Indonesia chịu sự điều chỉnh của Luật Lao động (UU Ketenagakerjaan) và Luật Cipta Kerja (Omnibus). Vài viết tắt phải nhớ: `UMR`/`UMP` (lương tối thiểu cấp tỉnh) và `UMK` (cấp huyện/thành) — trả dưới mức này là vi phạm; `PHK` (Pemutusan Hubungan Kerja — chấm dứt HĐLĐ); `THR` (Tunjangan Hari Raya — thưởng bắt buộc trước dịp lễ tôn giáo, thường một tháng lương); `BPJS Ketenagakerjaan` (BHXH lao động: tai nạn, hưu, tử tuất) và `BPJS Kesehatan` (BHYT). Hợp đồng có hai loại: `PKWT` (xác định thời hạn — kontrak) và `PKWTT` (không xác định thời hạn — karyawan tetap). Khi bị `PHK`, người lao động thường được hưởng `pesangon` (trợ cấp thôi việc), `uang penghargaan masa kerja` (thâm niên) và `uang penggantian hak`. Văn hóa giải quyết tranh chấp ưu tiên `musyawarah` (đối thoại đồng thuận) trước; nếu bế tắc thì hòa giải `bipartit`/`tripartit`, rồi `lapor ke Disnaker` (Sở Lao động), cuối cùng là Tòa Quan hệ Lao động (`Pengadilan Hubungan Industrial`). Công đoàn (`serikat pekerja`/`serikat buruh`) hỗ trợ pháp lý. Lưu ý phân biệt `di-PHK` (chấm dứt HĐLĐ chính thức) với `dipecat` (đuổi việc, sắc thái cá nhân/kỷ luật).",
    cultural_notes_en:
      "Employment in Indonesia is governed by the Manpower Law (UU Ketenagakerjaan) and the Job Creation (Omnibus) Law. Key acronyms: `UMR`/`UMP` (provincial minimum wage) and `UMK` (district/city) — paying below them is a violation; `PHK` (Pemutusan Hubungan Kerja — employment termination); `THR` (Tunjangan Hari Raya — a mandatory pre-holiday bonus, usually one month's wage); `BPJS Ketenagakerjaan` (labor social security: accident, pension, death) and `BPJS Kesehatan` (health insurance). Contracts come in two kinds: `PKWT` (fixed-term — a kontrak) and `PKWTT` (indefinite — a permanent `karyawan tetap`). On `PHK`, workers are typically owed `pesangon` (severance), `uang penghargaan masa kerja` (long-service pay), and `uang penggantian hak`. Dispute culture favors `musyawarah` (consensus dialogue) first; if stuck, `bipartit`/`tripartit` mediation, then `lapor ke Disnaker` (the labor office), and finally the Industrial Relations Court (`Pengadilan Hubungan Industrial`). Unions (`serikat pekerja`/`serikat buruh`) provide legal support. Note the difference between `di-PHK` (a formal termination) and `dipecat` (being fired, a personal/disciplinary nuance).",
    tip_advice_vi:
      "Nắm bộ acronym trước — chúng là 80% bài này: `UMR/UMP/UMK` (lương tối thiểu), `PHK` (chấm dứt HĐLĐ), `THR` (thưởng lễ), `BPJS` (BHXH/BHYT), `Disnaker` (Sở Lao động), `PKWT`/`PKWTT` (HĐ xác định/không xác định thời hạn). Năm câu xương sống khi bảo vệ quyền: (1) `Saya ingin tahu isi kontrak kerja saya.`; (2) nêu vi phạm cụ thể — `Gaji saya di bawah UMR` / `Lembur saya belum dibayar` / `Saya di-PHK tanpa pemberitahuan`; (3) khẳng định quyền — `Saya berhak atas ___` / `Saya berhak mendapat pesangon sesuai aturan`; (4) leo thang ôn hòa — `Saya akan berkonsultasi dengan serikat pekerja` → `lapor ke Disnaker`; (5) giữ thái độ — `Saya hanya menuntut yang menjadi hak saya. Mari kita selesaikan secara musyawarah.` Ba điểm ngữ pháp cho người Việt: dùng thể bị động `di-` (`dibayar`, `di-PHK`, `didaftarkan`) — giọng pháp lý; cấu trúc `berhak atas` + danh từ; và `c`='ch' nên `cuti`='chu-ti', `secara`='se-cha-ra'. Phân biệt `di-PHK` (chấm dứt HĐLĐ) với `dipecat` (đuổi, nặng hơn), và `menuntut` (đòi quyền) với `minta` (xin).",
    tip_advice_en:
      "Lock the acronyms first — they're 80% of this lesson: `UMR/UMP/UMK` (minimum wage), `PHK` (termination), `THR` (holiday bonus), `BPJS` (social security/health), `Disnaker` (labor office), `PKWT`/`PKWTT` (fixed/indefinite contract). Five backbone lines for asserting rights: (1) `Saya ingin tahu isi kontrak kerja saya.`; (2) name the specific violation — `Gaji saya di bawah UMR` / `Lembur saya belum dibayar` / `Saya di-PHK tanpa pemberitahuan`; (3) assert the right — `Saya berhak atas ___` / `Saya berhak mendapat pesangon sesuai aturan`; (4) escalate amicably — `Saya akan berkonsultasi dengan serikat pekerja` → `lapor ke Disnaker`; (5) hold the stance — `Saya hanya menuntut yang menjadi hak saya. Mari kita selesaikan secara musyawarah.` Three grammar points for VN speakers: use the `di-` passive (`dibayar`, `di-PHK`, `didaftarkan`) — the legal voice; the `berhak atas` + noun structure; and `c`='ch', so `cuti`='chu-ti', `secara`='se-cha-ra'. Tell `di-PHK` (termination) from `dipecat` (fired, harsher), and `menuntut` (claim a right) from `minta` (to ask/beg).",
    vocabulary: [
      // Contract & wage
      {
        word: "kontrak kerja",
        en: "employment contract",
        vi: "hợp đồng lao động",
        pos: "noun",
        pronunciation_vi: "KON-trak KER-ja — `tetap` (dài hạn) vs `sementara` (tạm thời)",
        pronunciation_en: "KON-trak KER-ja — `tetap` (permanent) vs `sementara` (temporary)",
      },
      {
        word: "UMR / UMP / UMK",
        en: "regional / provincial / city minimum wage",
        vi: "lương tối thiểu vùng/tỉnh/thành",
        pos: "noun (acronym)",
        pronunciation_vi: "u-em-er — trả dưới mức này là vi phạm",
        pronunciation_en: "u-em-er — paying below it is a violation",
      },
      {
        word: "gaji",
        en: "wage / salary",
        vi: "lương",
        pos: "noun",
        pronunciation_vi: "GA-ji — `slip gaji` = phiếu lương",
        pronunciation_en: "GA-ji — `slip gaji` = payslip",
      },
      {
        word: "lembur",
        en: "overtime",
        vi: "tăng ca / làm thêm giờ",
        pos: "noun",
        pronunciation_vi: "LEM-bur — `uang lembur` = tiền tăng ca",
        pronunciation_en: "LEM-bur — `uang lembur` = overtime pay",
      },
      // Benefits & rights
      {
        word: "berhak atas",
        en: "entitled to",
        vi: "có quyền hưởng",
        pos: "phrase",
        pronunciation_vi: "ber-HAK A-tas — `berhak atas cuti` = có quyền nghỉ phép",
        pronunciation_en: "ber-HAK A-tas — `berhak atas cuti` = entitled to leave",
      },
      {
        word: "cuti",
        en: "leave (time off)",
        vi: "nghỉ phép",
        pos: "noun",
        pronunciation_vi: "CHU-ti — `c`='ch'; `cuti tahunan` = nghỉ phép năm",
        pronunciation_en: "CHU-ti — `c`='ch'; `cuti tahunan` = annual leave",
      },
      {
        word: "THR",
        en: "religious-holiday bonus",
        vi: "thưởng dịp lễ (bắt buộc)",
        pos: "noun (acronym)",
        pronunciation_vi: "te-ha-er — Tunjangan Hari Raya; thường một tháng lương",
        pronunciation_en: "te-ha-er — Tunjangan Hari Raya; usually one month's wage",
      },
      {
        word: "BPJS Ketenagakerjaan",
        en: "labor social-security fund",
        vi: "BHXH lao động",
        pos: "noun",
        pronunciation_vi: "be-pe-je-es ke-te-na-ga-ker-JA-an — tai nạn, hưu, tử tuất",
        pronunciation_en: "be-pe-je-es ke-te-na-ga-ker-JA-an — accident, pension, death cover",
      },
      // Termination
      {
        word: "PHK",
        en: "employment termination / layoff",
        vi: "chấm dứt HĐLĐ / cho thôi việc",
        pos: "noun (acronym)",
        pronunciation_vi: "pe-ha-ka — `di-PHK` (bị động); KHÁC `dipecat` (đuổi)",
        pronunciation_en: "pe-ha-ka — `di-PHK` (passive); NOT `dipecat` (fired)",
      },
      {
        word: "pesangon",
        en: "severance pay",
        vi: "trợ cấp thôi việc",
        pos: "noun",
        pronunciation_vi: "pe-SA-ngon — `sesuai aturan` = theo quy định",
        pronunciation_en: "pe-SA-ngon — `sesuai aturan` = per the rules",
      },
      {
        word: "pemberitahuan",
        en: "notice / notification",
        vi: "sự thông báo (trước)",
        pos: "noun",
        pronunciation_vi: "pem-be-ri-ta-HU-an — `tanpa pemberitahuan` = không báo trước",
        pronunciation_en: "pem-be-ri-ta-HU-an — `tanpa pemberitahuan` = without notice",
      },
      // Dispute & enforcement
      {
        word: "serikat pekerja",
        en: "labor union",
        vi: "công đoàn",
        pos: "noun",
        pronunciation_vi: "se-ri-KAT pe-KER-ja — cũng `serikat buruh`; KHÔNG chêm `union`",
        pronunciation_en: "se-ri-KAT pe-KER-ja — also `serikat buruh`; don't say `union`",
      },
      {
        word: "Disnaker",
        en: "local labor office (Dinas Tenaga Kerja)",
        vi: "Sở Lao động",
        pos: "noun",
        pronunciation_vi: "dis-NA-ker — `lapor ke Disnaker` = khiếu nại lên Sở",
        pronunciation_en: "dis-NA-ker — `lapor ke Disnaker` = file with the office",
      },
      {
        word: "menuntut",
        en: "to claim / demand (a right)",
        vi: "đòi / yêu cầu (quyền)",
        pos: "verb",
        pronunciation_vi: "me-NUN-tut — mạnh hơn `minta` (xin); `menuntut hak`",
        pronunciation_en: "me-NUN-tut — stronger than `minta` (ask); `menuntut hak`",
      },
      {
        word: "musyawarah",
        en: "consensus deliberation",
        vi: "thương lượng / đối thoại đồng thuận",
        pos: "noun",
        pronunciation_vi: "mu-sya-WA-rah — cách giải quyết tranh chấp được ưa chuộng",
        pronunciation_en: "mu-sya-WA-rah — the preferred dispute-resolution path",
      },
    ],
    dialogue: [
      // Dialogue: a worker raises unpaid overtime, a PHK without notice, and severance
      {
        speaker: "Pekerja",
        text: "Pak, saya ingin bicara soal hak saya. Lembur saya belum dibayar bulan ini.",
        vi: "Anh ơi, em muốn nói về quyền lợi của em. Tiền tăng ca tháng này chưa được trả.",
        en: "Sir, I'd like to talk about my rights. My overtime hasn't been paid this month.",
      },
      {
        speaker: "HRD",
        text: "Oh, akan kami cek. Ada hal lain?",
        vi: "À, để bên tôi kiểm tra. Còn việc gì khác không?",
        en: "Oh, we'll check that. Anything else?",
      },
      {
        speaker: "Pekerja",
        text: "Iya. Saya dengar saya akan di-PHK, tapi tanpa pemberitahuan tertulis.",
        vi: "Có ạ. Em nghe nói em sẽ bị cho thôi việc, nhưng không có thông báo bằng văn bản.",
        en: "Yes. I heard I'll be laid off, but without written notice.",
      },
      {
        speaker: "HRD",
        text: "Memang ada efisiensi, tapi kami akan ikuti prosedur.",
        vi: "Đúng là có cắt giảm, nhưng bên tôi sẽ theo đúng quy trình.",
        en: "There is downsizing, but we'll follow procedure.",
      },
      {
        speaker: "Pekerja",
        text: "Kalau di-PHK, saya berhak mendapat pesangon sesuai aturan. Berapa besar yang seharusnya saya terima?",
        vi: "Nếu bị thôi việc, em có quyền nhận trợ cấp theo quy định. Khoản em đáng lẽ nhận là bao nhiêu?",
        en: "If I'm laid off, I'm entitled to severance per the rules. How much should I rightfully receive?",
      },
      {
        speaker: "HRD",
        text: "Akan kami hitung sesuai masa kerja. Nanti kami berikan rinciannya.",
        vi: "Bên tôi sẽ tính theo thâm niên. Sẽ đưa anh bảng chi tiết sau.",
        en: "We'll calculate it by length of service. We'll give you the breakdown.",
      },
      {
        speaker: "Pekerja",
        text: "Tolong berikan bukti tertulis, ya, Pak. Saya hanya menuntut yang menjadi hak saya. Mari kita selesaikan secara musyawarah.",
        vi: "Làm ơn cho em bằng chứng bằng văn bản ạ. Em chỉ đòi những gì thuộc quyền của em. Mình giải quyết bằng đối thoại nhé.",
        en: "Please provide written evidence, sir. I only claim what's rightfully mine. Let's settle this through dialogue.",
      },
      {
        speaker: "HRD",
        text: "Baik. Kalau perlu, silakan juga berkonsultasi dengan serikat pekerja.",
        vi: "Được. Nếu cần, anh cứ tham khảo cả công đoàn.",
        en: "Alright. If needed, feel free to also consult the union.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn biết nội dung hợp đồng lao động của tôi.", answer: "Saya ingin tahu isi kontrak kerja saya." },
          { prompt: "Lương của tôi dưới mức lương tối thiểu vùng này.", answer: "Gaji saya di bawah UMR daerah ini." },
          { prompt: "Tiền tăng ca của tôi tháng này chưa được trả.", answer: "Lembur saya belum dibayar bulan ini." },
          { prompt: "Tôi bị cho thôi việc mà không có thông báo.", answer: "Saya di-PHK tanpa pemberitahuan." },
          { prompt: "Tôi có quyền nhận trợ cấp thôi việc theo quy định.", answer: "Saya berhak mendapat pesangon sesuai aturan." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Tôi có quyền nghỉ phép năm và thưởng lễ.", answer: "Saya berhak atas cuti tahunan dan THR." },
          { prompt: "Công ty bắt buộc đăng ký tôi vào BPJS lao động.", answer: "Perusahaan wajib mendaftarkan saya ke BPJS Ketenagakerjaan." },
          { prompt: "Tôi sẽ tham khảo công đoàn.", answer: "Saya akan berkonsultasi dengan serikat pekerja." },
          { prompt: "Nếu không giải quyết được, tôi sẽ báo lên Sở Lao động.", answer: "Kalau tidak selesai, saya akan lapor ke Disnaker." },
          { prompt: "Chúng ta hãy giải quyết việc này bằng đối thoại.", answer: "Mari kita selesaikan ini secara musyawarah." },
        ],
      },
      {
        type: "acronym_match",
        instruction_vi: "Ghép viết tắt lao động với nghĩa:",
        instruction_en: "Match the labor acronym to its meaning:",
        items: [
          { prompt: "UMR / UMP / UMK", answer: "lương tối thiểu vùng/tỉnh/thành (minimum wage)" },
          { prompt: "PHK", answer: "chấm dứt HĐLĐ / cho thôi việc (termination)" },
          { prompt: "THR", answer: "thưởng dịp lễ bắt buộc (holiday bonus)" },
          { prompt: "Disnaker", answer: "Sở Lao động (local labor office)" },
          { prompt: "BPJS Ketenagakerjaan", answer: "BHXH lao động (labor social security)" },
        ],
      },
      {
        type: "word_choice",
        instruction_vi:
          "Chọn từ ĐÚNG sắc thái pháp lý:",
        instruction_en:
          "Pick the word with the right legal nuance:",
        items: [
          { prompt: "chấm dứt HĐLĐ chính thức (không phải đuổi việc cá nhân):", answer: "di-PHK (không phải dipecat)" },
          { prompt: "đòi quyền chính đáng (không phải xin):", answer: "menuntut (không phải minta)" },
          { prompt: "đáng lẽ phải nhận (theo quyền):", answer: "seharusnya (không phải harus trống)" },
          { prompt: "bằng chứng bằng văn bản:", answer: "bukti tertulis" },
        ],
      },
      {
        type: "passive_drill",
        instruction_vi:
          "Đổi sang thể bị động `di-` (giọng pháp lý): `bayar` → ___, `daftar(kan)` → ___, `PHK` → ___, `beri(kan)` → ___.",
        instruction_en:
          "Make the `di-` passive (legal voice): `bayar` → ___, `daftar(kan)` → ___, `PHK` → ___, `beri(kan)` → ___.",
        items: [
          { prompt: "bayar (trả) →", answer: "dibayar" },
          { prompt: "daftarkan (đăng ký) →", answer: "didaftarkan" },
          { prompt: "PHK (cho thôi việc) →", answer: "di-PHK" },
          { prompt: "berikan (đưa/cấp) →", answer: "diberikan" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung bảo vệ quyền — điền chỗ trống: `Saya ingin tahu isi kontrak kerja saya. ___ saya belum dibayar / Gaji saya di bawah ___. Saya berhak atas ___. Kalau tidak selesai, saya akan lapor ke ___. Mari kita selesaikan secara ___.`",
        instruction_en:
          "Rights-assertion frame — fill the blanks: `Saya ingin tahu isi kontrak kerja saya. ___ saya belum dibayar / Gaji saya di bawah ___. Saya berhak atas ___. Kalau tidak selesai, saya akan lapor ke ___. Mari kita selesaikan secara ___.`",
        example:
          "Saya ingin tahu isi kontrak kerja saya. Lembur saya belum dibayar dan gaji saya di bawah UMR. Saya berhak atas cuti tahunan dan THR. Kalau tidak selesai, saya akan lapor ke Disnaker. Mari kita selesaikan secara musyawarah.",
        example_vi:
          "Tôi muốn biết nội dung hợp đồng. Tiền tăng ca chưa được trả và lương dưới mức tối thiểu. Tôi có quyền nghỉ phép năm và thưởng lễ. Nếu không xong, tôi sẽ báo lên Sở Lao động. Mình giải quyết bằng đối thoại.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra quyền lao động — bạn làm được chưa?",
        instruction_en: "Quick labor-rights self-check — can you do each one?",
        items: [
          { vi: "Tôi hiểu các viết tắt UMR/PHK/THR/BPJS/Disnaker.", en: "I understand UMR/PHK/THR/BPJS/Disnaker." },
          { vi: "Tôi có thể nêu vi phạm cụ thể (lương, tăng ca, PHK).", en: "I can name a specific violation (wage, overtime, PHK)." },
          { vi: "Tôi có thể khẳng định quyền bằng `berhak atas` / `menuntut`.", en: "I can assert a right with `berhak atas` / `menuntut`." },
          { vi: "Tôi biết leo thang: công đoàn → Disnaker.", en: "I know the escalation: union → Disnaker." },
          { vi: "Tôi dùng thể bị động `di-` (dibayar, di-PHK, didaftarkan).", en: "I use the `di-` passive (dibayar, di-PHK, didaftarkan)." },
          { vi: "Tôi phân biệt `di-PHK` và `dipecat`, `menuntut` và `minta`.", en: "I tell `di-PHK` from `dipecat`, `menuntut` from `minta`." },
        ],
      },
    ],
  },
];

export default lessons;
