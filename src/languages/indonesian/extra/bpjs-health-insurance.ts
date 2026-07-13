// BPJS Health Insurance Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian lesson shape.
// Field convention: sentence `en` is the TARGET-LANGUAGE text (Indonesian), and
// `vi` is the Vietnamese gloss. `pronunciation_focus` gives Vietnamese L1 notes;
// `pronunciation_focus_en` is the English companion in the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_bpjs_health_insurance",
    level: "A2",
    category: "health",
    title_vi: "BPJS Kesehatan: bảo hiểm y tế Indonesia",
    title_en: "BPJS Kesehatan: Indonesian health insurance",
    sentences: [
      {
        en: "Saya pakai BPJS Kesehatan untuk berobat.",
        vi: "Tôi dùng BPJS Kesehatan để đi khám/chữa bệnh.",
        pronunciation_focus: [
          "SA-ya PA-kai be-pe-je-ES ke-SE-ha-tan un-TUK be-RO-bat - `pakai BPJS` = dùng BPJS; `berobat` = đi chữa bệnh.",
          "Lỗi người Việt: đọc `BPJS` như một từ. Đọc từng chữ tiếng Indonesia: be-pe-je-es.",
          "Luyện: `Saya pakai BPJS Kesehatan untuk berobat.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PA-kai bay-pay-jay-ES ke-SE-ha-tan un-TUK be-RO-bat - `pakai BPJS` = use BPJS; `berobat` = get medical treatment.",
          "VN-speaker trap: reading `BPJS` as one word. Spell the Indonesian letter names: be-pe-je-es.",
          "Drill: `Saya pakai BPJS Kesehatan untuk berobat.`",
        ],
      },
      {
        en: "Kartu BPJS saya masih aktif.",
        vi: "Thẻ BPJS của tôi vẫn còn hiệu lực.",
        pronunciation_focus: [
          "KAR-tu be-pe-je-ES SA-ya MA-sih AK-tif - `kartu BPJS` = thẻ BPJS; `masih aktif` = vẫn còn hoạt động/hiệu lực.",
          "Lỗi người Việt: nói `masih hidup` cho thẻ. Với tài khoản/thẻ, nói `aktif`.",
          "Luyện: `Kartu BPJS saya masih aktif.`",
        ],
        pronunciation_focus_en: [
          "KAR-tu bay-pay-jay-ES SA-ya MA-sih AK-tif - `kartu BPJS` = BPJS card; `masih aktif` = still active/valid.",
          "VN-speaker trap: saying `masih hidup` for a card. For cards/accounts, use `aktif`.",
          "Drill: `Kartu BPJS saya masih aktif.`",
        ],
      },
      {
        en: "Iuran BPJS dibayar setiap bulan.",
        vi: "Phí BPJS được đóng hằng tháng.",
        pronunciation_focus: [
          "i-U-ran be-pe-je-ES di-BA-yar se-TI-ap BU-lan - `iuran` = phí đóng định kỳ; `dibayar` = được trả/đóng.",
          "Lỗi người Việt: dùng `biaya` cho mọi khoản. `Iuran` là khoản đóng thành viên/bảo hiểm định kỳ.",
          "Luyện: `Iuran BPJS dibayar setiap bulan.`",
        ],
        pronunciation_focus_en: [
          "ee-U-ran bay-pay-jay-ES di-BA-yar se-TEE-ap BU-lan - `iuran` = recurring contribution/premium; `dibayar` = is paid.",
          "VN-speaker trap: using `biaya` for every cost. `Iuran` is a recurring membership/insurance contribution.",
          "Drill: `Iuran BPJS dibayar setiap bulan.`",
        ],
      },
      {
        en: "Faskes tingkat pertama saya puskesmas dekat rumah.",
        vi: "Cơ sở y tế tuyến đầu của tôi là puskesmas gần nhà.",
        pronunciation_focus: [
          "FAS-kes TING-kat per-TA-ma SA-ya PUS-kes-mas de-KAT RU-mah - `faskes` = fasilitas kesehatan; `tingkat pertama` = tuyến đầu.",
          "Lỗi người Việt: nhầm `faskes` với bệnh viện lớn. BPJS thường bắt đầu từ `faskes tingkat pertama` như puskesmas/klinik.",
          "Luyện: `Faskes tingkat pertama saya puskesmas dekat rumah.`",
        ],
        pronunciation_focus_en: [
          "FAS-kes TING-kat per-TA-ma SA-ya PUS-kes-mas de-KAT RU-mah - `faskes` = healthcare facility; `tingkat pertama` = first level.",
          "VN-speaker trap: assuming `faskes` means a big hospital. BPJS usually starts from a first-level facility like a puskesmas/clinic.",
          "Drill: `Faskes tingkat pertama saya puskesmas dekat rumah.`",
        ],
      },
      {
        en: "Saya perlu rujukan ke dokter spesialis.",
        vi: "Tôi cần giấy chuyển tuyến đến bác sĩ chuyên khoa.",
        pronunciation_focus: [
          "SA-ya per-LU ru-JU-kan ke DOK-ter spe-si-a-LIS - `rujukan` = giấy chuyển tuyến; `ke` = đến.",
          "Lỗi người Việt: dùng `di dokter spesialis`. Khi đi đến chuyên khoa dùng `ke dokter spesialis`.",
          "Luyện: `Saya perlu rujukan ke dokter spesialis.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LU roo-JOO-kan ke DOK-ter spe-see-ah-LIS - `rujukan` = referral; `ke` = to.",
          "VN-speaker trap: using `di dokter spesialis`. Going to a specialist uses `ke dokter spesialis`.",
          "Drill: `Saya perlu rujukan ke dokter spesialis.`",
        ],
      },
      {
        en: "Antrean online sudah penuh hari ini.",
        vi: "Hàng chờ online hôm nay đã đầy.",
        pronunciation_focus: [
          "an-TRE-an ON-lain SU-dah PE-nuh HA-ri I-ni - `antrean online` = hàng chờ/đăng ký lượt online; `penuh` = đầy.",
          "Lỗi người Việt: nói `antrian` vẫn thường thấy, nhưng dạng baku trong nhiều văn bản là `antrean`.",
          "Luyện: `Antrean online sudah penuh hari ini.`",
        ],
        pronunciation_focus_en: [
          "an-TRE-an ON-line SU-dah PE-nuh HA-ri I-ni - `antrean online` = online queue/appointment slot; `penuh` = full.",
          "VN-speaker trap: `antrian` is often seen, but the standard form in many documents is `antrean`.",
          "Drill: `Antrean online sudah penuh hari ini.`",
        ],
      },
      {
        en: "Apakah klaim BPJS untuk obat ini ditanggung?",
        vi: "Yêu cầu/chi trả BPJS cho thuốc này có được bảo hiểm không?",
        pronunciation_focus: [
          "a-pa-KAH klaim be-pe-je-ES un-TUK O-bat I-ni di-TANG-gung - `klaim` = yêu cầu chi trả; `ditanggung` = được bảo hiểm/được bao.",
          "Lỗi người Việt: dịch `claim` dài dòng. Ở bảo hiểm, nói `klaim`; câu bị động hay dùng là `ditanggung`.",
          "Luyện: `Apakah klaim BPJS untuk obat ini ditanggung?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH claim bay-pay-jay-ES un-TUK O-bat I-ni di-TANG-gung - `klaim` = insurance claim; `ditanggung` = covered.",
          "VN-speaker trap: over-translating 'claim'. In insurance, say `klaim`; the common passive is `ditanggung`.",
          "Drill: `Apakah klaim BPJS untuk obat ini ditanggung?`",
        ],
      },
      {
        en: "Kelas perawatan saya kelas dua.",
        vi: "Hạng phòng điều trị của tôi là hạng hai.",
        pronunciation_focus: [
          "KE-las pe-RA-wa-tan SA-ya KE-las DU-a - `kelas perawatan` = hạng điều trị/phòng; `kelas dua` = hạng hai.",
          "Lỗi người Việt: dịch `class` thành lớp học. Trong BPJS/bệnh viện, `kelas` là hạng dịch vụ/phòng.",
          "Luyện: `Kelas perawatan saya kelas dua.`",
        ],
        pronunciation_focus_en: [
          "KE-las pe-RA-wa-tan SA-ya KE-las DOO-a - `kelas perawatan` = treatment/ward class; `kelas dua` = class two.",
          "VN-speaker trap: treating `kelas` as only a school class. In BPJS/hospitals, `kelas` means service/ward class.",
          "Drill: `Kelas perawatan saya kelas dua.`",
        ],
      },
      {
        en: "Kalau data saya salah, bagaimana cara memperbaikinya?",
        vi: "Nếu dữ liệu của tôi sai, làm cách nào để sửa?",
        pronunciation_focus: [
          "KA-lau DA-ta SA-ya SA-lah, ba-GAI-ma-na CA-ra mem-per-BA-i-ki-nya - `data salah` = dữ liệu sai; `memperbaikinya` = sửa nó.",
          "Lỗi người Việt: đọc `cara` như ka-ra. Trong Indonesia, `c` = 'ch': CHA-ra.",
          "Luyện: `Kalau data saya salah, bagaimana cara memperbaikinya?`",
        ],
        pronunciation_focus_en: [
          "KA-lau DA-ta SA-ya SA-lah, ba-GAI-ma-na CHA-ra mem-per-BA-ee-kee-nya - `data salah` = wrong data; `memperbaikinya` = fix it.",
          "VN-speaker trap: reading `cara` as ka-ra. In Indonesian, `c` = 'ch': CHA-ra.",
          "Drill: `Kalau data saya salah, bagaimana cara memperbaikinya?`",
        ],
      },
      {
        en: "Mohon bantu cek status kepesertaan saya.",
        vi: "Xin giúp kiểm tra tình trạng tham gia bảo hiểm của tôi.",
        pronunciation_focus: [
          "MO-hon BAN-tu chek STA-tus ke-pe-ser-TA-an SA-ya - `kepesertaan` = tư cách tham gia/thành viên; `cek` = kiểm tra.",
          "Lỗi người Việt: nói `status peserta saya` vẫn hiểu, nhưng ở văn phòng BPJS thường dùng danh từ `kepesertaan`.",
          "Luyện: `Mohon bantu cek status kepesertaan saya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon BAN-tu chek STA-tus ke-pe-ser-TA-an SA-ya - `kepesertaan` = membership/participant status; `cek` = check.",
          "VN-speaker trap: `status peserta saya` is understood, but BPJS offices often use the noun `kepesertaan`.",
          "Drill: `Mohon bantu cek status kepesertaan saya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "BPJS Kesehatan là hệ thống bảo hiểm y tế quốc gia Indonesia, khác với BPJS Ketenagakerjaan cho lao động. Người dùng thường bắt đầu khám ở `faskes tingkat pertama` như puskesmas hoặc klinik đã đăng ký; nếu cần bác sĩ chuyên khoa, thường phải có `rujukan`. Một số dịch vụ/thuốc được `ditanggung`, một số có thể không. `Kelas perawatan` liên quan đến hạng phòng khi nằm viện. Quy trình thực tế có thể thay đổi theo bệnh viện, tình trạng cấp cứu, dữ liệu thẻ, tình trạng `iuran`, và hệ thống `antrean online`.",
    cultural_notes_en:
      "BPJS Kesehatan is Indonesia's national health insurance system, separate from BPJS Ketenagakerjaan for employment. Users usually start at a registered `faskes tingkat pertama` such as a puskesmas or clinic; seeing a specialist often requires a `rujukan`. Some services/medicines are `ditanggung` (covered), while others may not be. `Kelas perawatan` relates to the ward class for inpatient care. The actual process can vary by hospital, emergency status, card data, `iuran` status, and the `antrean online` system.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm hành chính. `Pakai BPJS`, `kartu BPJS aktif`, `iuran dibayar`, `faskes tingkat pertama`, `minta rujukan`, `antrean online`, `klaim ditanggung`, `kelas perawatan`. Câu BPJS hay dùng bị động `di-`: `dibayar`, `ditanggung`, `diproses`, `didaftarkan`. Nhớ phân biệt `BPJS Kesehatan` với `BPJS Ketenagakerjaan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn administrative chunks. `Pakai BPJS`, `kartu BPJS aktif`, `iuran dibayar`, `faskes tingkat pertama`, `minta rujukan`, `antrean online`, `klaim ditanggung`, `kelas perawatan`. BPJS language often uses the `di-` passive: `dibayar`, `ditanggung`, `diproses`, `didaftarkan`. Keep `BPJS Kesehatan` separate from `BPJS Ketenagakerjaan`.",
    vocabulary: [
      {
        cell_id: "fc86040a-f092-470e-b86a-174b4fdf2cd2",
        word: "BPJS Kesehatan",
        en: "Indonesian national health insurance",
        vi: "bảo hiểm y tế quốc gia Indonesia",
        pos: "proper noun",
        pronunciation_vi: "be-pe-je-ES ke-SE-ha-tan",
        pronunciation_en: "bay-pay-jay-ES ke-SEH-ha-tan",
      },
      {
        cell_id: "ac55f769-cebf-47e4-a876-3fa91c37351f",
        word: "kartu BPJS",
        en: "BPJS card",
        vi: "thẻ BPJS",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu be-pe-je-ES",
        pronunciation_en: "KAR-too bay-pay-jay-ES",
      },
      {
        cell_id: "4c0a09f8-088a-4c18-abf8-7e7825fb0142",
        word: "iuran",
        en: "contribution / monthly premium",
        vi: "phí đóng định kỳ",
        pos: "noun",
        pronunciation_vi: "i-U-ran",
        pronunciation_en: "ee-U-ran",
      },
      {
        cell_id: "b4578944-1083-4858-97f3-76939f148c34",
        word: "faskes",
        en: "healthcare facility",
        vi: "cơ sở y tế",
        pos: "noun",
        pronunciation_vi: "FAS-kes",
        pronunciation_en: "FAS-kes",
      },
      {
        cell_id: "e39c09b8-7066-4ca6-a05d-483e89a0f8f4",
        word: "rujukan",
        en: "referral",
        vi: "giấy chuyển tuyến / giới thiệu",
        pos: "noun",
        pronunciation_vi: "ru-JU-kan",
        pronunciation_en: "roo-JOO-kan",
      },
      {
        cell_id: "4cd4adae-9dcc-4044-afda-20dc295dfe19",
        word: "antrean online",
        en: "online queue / appointment slot",
        vi: "hàng chờ online / lượt đăng ký online",
        pos: "noun phrase",
        pronunciation_vi: "an-TRE-an ON-lain",
        pronunciation_en: "an-TREH-an ON-line",
      },
      {
        cell_id: "e22652c5-6392-4b32-99e1-2f9ef7ed9557",
        word: "klaim",
        en: "insurance claim",
        vi: "yêu cầu chi trả bảo hiểm",
        pos: "noun/verb",
        pronunciation_vi: "klaim",
        pronunciation_en: "claim",
      },
      {
        cell_id: "f42deaad-c6d3-4d26-85ac-c4ba3bf3aec8",
        word: "ditanggung",
        en: "covered",
        vi: "được bảo hiểm chi trả / bao",
        pos: "passive verb",
        pronunciation_vi: "di-TANG-gung",
        pronunciation_en: "dee-TANG-goong",
      },
      {
        cell_id: "e3bdf7cd-98c0-4775-ab65-0b24929a0dbf",
        word: "kelas perawatan",
        en: "ward/treatment class",
        vi: "hạng phòng điều trị",
        pos: "noun phrase",
        pronunciation_vi: "KE-las pe-RA-wa-tan",
        pronunciation_en: "KEH-las pe-RAH-wa-tan",
      },
      {
        cell_id: "a74e63a5-bb3e-4364-ace0-a77fc882f01c",
        word: "kepesertaan",
        en: "membership / participant status",
        vi: "tình trạng tham gia",
        pos: "noun",
        pronunciation_vi: "ke-pe-ser-TA-an",
        pronunciation_en: "ke-pe-ser-TA-an",
      },
    ],
    dialogue: [
      {
        cell_id: "462f7af3-2fc1-474c-88aa-f36ed21c8be9",
        speaker: "Peserta",
        text: "Permisi, saya mau cek status kepesertaan BPJS saya.",
        vi: "Xin phép, tôi muốn kiểm tra tình trạng tham gia BPJS của tôi.",
        en: "Excuse me, I want to check my BPJS membership status.",
      },
      {
        cell_id: "c01e3a2b-a03a-436b-ad8b-c6570c38c994",
        speaker: "Petugas",
        text: "Boleh. Kartu BPJS dan KTP-nya ada?",
        vi: "Được. Anh/chị có thẻ BPJS và KTP không?",
        en: "Sure. Do you have your BPJS card and ID card?",
      },
      {
        cell_id: "358ba889-f41b-4db4-8604-caf88bba1360",
        speaker: "Peserta",
        text: "Ada. Kartu BPJS saya masih aktif, tapi antrean online penuh.",
        vi: "Có. Thẻ BPJS của tôi vẫn hoạt động, nhưng hàng chờ online đã đầy.",
        en: "Yes. My BPJS card is still active, but the online queue is full.",
      },
      {
        cell_id: "ea4c1e3f-48d6-40fd-90c6-ba9e044c3d86",
        speaker: "Petugas",
        text: "Silakan ke faskes tingkat pertama dulu untuk minta rujukan.",
        vi: "Vui lòng đến cơ sở y tế tuyến đầu trước để xin giấy chuyển tuyến.",
        en: "Please go to the first-level healthcare facility first to ask for a referral.",
      },
      {
        cell_id: "a2b937e3-a1b9-4086-b892-8f42c738081a",
        speaker: "Peserta",
        text: "Baik. Kalau rawat inap, kelas perawatan saya kelas berapa?",
        vi: "Được. Nếu nằm viện, hạng phòng điều trị của tôi là hạng mấy?",
        en: "Okay. If I am hospitalized, what ward class do I have?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Iuran BPJS ____ setiap bulan.`",
        prompt_en: "Fill in the blank: `Iuran BPJS ____ setiap bulan.`",
        answer: "dibayar",
        explanation_vi: "`dibayar` = được trả/đóng; dạng bị động `di-` hay gặp trong giấy tờ BPJS.",
        explanation_en: "`dibayar` = is paid; the `di-` passive is common in BPJS paperwork.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Faskes tingkat pertama` thường là gì?",
        prompt_en: "What is a `faskes tingkat pertama` usually?",
        choices: ["puskesmas hoặc klinik", "quầy nhập cảnh", "tiệm kính"],
        answer: "puskesmas hoặc klinik",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Thẻ BPJS của tôi vẫn còn hiệu lực.`",
        prompt_en: "Translate into Indonesian: `My BPJS card is still active.`",
        answer: "Kartu BPJS saya masih aktif.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng các cụm BPJS.",
        prompt_en: "Match the BPJS phrases correctly.",
        pairs: [
          ["rujukan", "referral / giấy chuyển tuyến"],
          ["klaim", "insurance claim / yêu cầu chi trả"],
          ["kelas perawatan", "ward class / hạng phòng điều trị"],
        ],
      },
    ],
  },
];
