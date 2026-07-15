// Job Resignation Workplace Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_job_resignation_workplace",
    level: "B1",
    category: "work",
    title_vi: "Nghỉ việc lịch sự ở công sở Indonesia",
    title_en: "Resigning politely in an Indonesian workplace",
    sentences: [
      {
        en: "Saya ingin resign dari perusahaan ini.",
        vi: "Tôi muốn xin nghỉ việc khỏi công ty này.",
        pronunciation_focus: [
          "SA-ya I-ngin re-SAIN da-ri per-u-sa-HA-an I-ni - `resign` = nghỉ việc/từ chức, mượn tiếng Anh; `ingin` trang trọng hơn `mau`.",
          "Lỗi người Việt: nói `saya mau keluar` nghe đột ngột. Ở công sở, mở bằng `saya ingin resign` lịch sự hơn.",
          "Luyện: `Saya ingin resign dari perusahaan ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin re-SIGN da-ri per-u-sa-HA-an I-ni - `resign` = resign, an English loanword; `ingin` is more formal than `mau`.",
          "VN-speaker trap: saying `saya mau keluar`, which sounds abrupt. At work, `saya ingin resign` is more polite.",
          "Drill: `Saya ingin resign dari perusahaan ini.`",
        ],
      },
      {
        en: "Saya sudah menyiapkan surat pengunduran diri.",
        vi: "Tôi đã chuẩn bị thư xin nghỉ việc.",
        pronunciation_focus: [
          "SA-ya SU-dah me-nyi-AP-kan SU-rat pe-ngun-DU-ran DI-ri - `surat pengunduran diri` = thư xin nghỉ việc.",
          "Lỗi người Việt: dịch từng chữ thành `surat resign` được hiểu nhưng kém trang trọng. Văn bản chính thức là `surat pengunduran diri`.",
          "Luyện: `Saya sudah menyiapkan surat pengunduran diri.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SU-dah me-nyi-AP-kan SU-rat pe-ngun-DU-ran DEE-ree - `surat pengunduran diri` = resignation letter.",
          "VN-speaker trap: `surat resign` is understood but less formal. The official document is `surat pengunduran diri`.",
          "Drill: `Saya sudah menyiapkan surat pengunduran diri.`",
        ],
      },
      {
        en: "Notice period saya tiga puluh hari.",
        vi: "Thời gian báo trước của tôi là ba mươi ngày.",
        pronunciation_focus: [
          "NO-tis PI-ri-ed SA-ya TI-ga PU-luh HA-ri - `notice period` thường dùng nguyên tiếng Anh; `tiga puluh hari` = 30 ngày.",
          "Lỗi người Việt: lẫn `tiga belas` (13) và `tiga puluh` (30). `puluh` = mươi, `belas` = mười mấy.",
          "Luyện: `Notice period saya tiga puluh hari.`",
        ],
        pronunciation_focus_en: [
          "NO-tice PEER-ee-od SA-ya TEE-ga POO-looh HA-ri - `notice period` is often used as an English loan phrase; `tiga puluh hari` = 30 days.",
          "VN-speaker trap: confusing `tiga belas` (13) and `tiga puluh` (30). `puluh` = tens, `belas` = teens.",
          "Drill: `Notice period saya tiga puluh hari.`",
        ],
      },
      {
        en: "Saya akan menyelesaikan handover sebelum hari terakhir.",
        vi: "Tôi sẽ hoàn thành bàn giao trước ngày cuối cùng.",
        pronunciation_focus: [
          "SA-ya A-kan me-nye-le-SAI-kan HEN-do-ver se-BE-lum HA-ri ter-a-KHIR - `handover` = bàn giao; `hari terakhir` = ngày cuối.",
          "Lỗi người Việt: dùng `kasih kerjaan` cho bàn giao. Cách công sở tự nhiên là `menyelesaikan handover`.",
          "Luyện: `Saya akan menyelesaikan handover sebelum hari terakhir.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan me-nye-le-SAI-kan HAN-do-ver se-BE-lum HA-ri ter-a-KHIR - `handover` = work handover; `hari terakhir` = last day.",
          "VN-speaker trap: saying `kasih kerjaan` for handover. Office Indonesian naturally says `menyelesaikan handover`.",
          "Drill: `Saya akan menyelesaikan handover sebelum hari terakhir.`",
        ],
      },
      {
        en: "Saya sudah bicara dengan atasan saya.",
        vi: "Tôi đã nói chuyện với cấp trên của tôi.",
        pronunciation_focus: [
          "SA-ya SU-dah bi-CA-ra de-NGAN a-TA-san SA-ya - `atasan` = cấp trên/sếp; `bicara dengan` = nói chuyện với.",
          "Lỗi người Việt: đọc `bicara` như bi-ka-ra. Chữ `c` trong Indonesia = 'ch': bi-CHA-ra.",
          "Luyện: `Saya sudah bicara dengan atasan saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SU-dah bi-CHA-ra de-NGAN a-TA-san SA-ya - `atasan` = superior/boss; `bicara dengan` = speak with.",
          "VN-speaker trap: reading `bicara` as bi-ka-ra. Indonesian `c` = 'ch': bi-CHA-ra.",
          "Drill: `Saya sudah bicara dengan atasan saya.`",
        ],
      },
      {
        en: "Saya ingin pamit kepada rekan kerja.",
        vi: "Tôi muốn chào tạm biệt đồng nghiệp.",
        pronunciation_focus: [
          "SA-ya I-ngin PA-mit ke-PA-da re-KAN KER-ja - `pamit` = xin phép/chào trước khi đi; `rekan kerja` = đồng nghiệp.",
          "Lỗi người Việt: chỉ nói `selamat tinggal` nghe nặng. Khi nghỉ việc, dùng `pamit` rất tự nhiên và lịch sự.",
          "Luyện: `Saya ingin pamit kepada rekan kerja.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin PA-mit ke-PA-da re-KAN KER-ja - `pamit` = take leave/say goodbye respectfully; `rekan kerja` = coworker.",
          "VN-speaker trap: only saying `selamat tinggal`, which sounds heavy. When leaving a job, `pamit` is natural and polite.",
          "Drill: `Saya ingin pamit kepada rekan kerja.`",
        ],
      },
      {
        en: "Apakah saya berhak mendapat pesangon?",
        vi: "Tôi có quyền nhận trợ cấp thôi việc không?",
        pronunciation_focus: [
          "a-pa-KAH SA-ya ber-HAK men-DA-pat pe-SA-ngon - `berhak mendapat` = có quyền nhận; `pesangon` = trợ cấp thôi việc.",
          "Lỗi người Việt: gọi chung là `uang keluar`. Thuật ngữ lao động là `pesangon`, nhưng điều kiện phụ thuộc hợp đồng/quy định.",
          "Luyện: `Apakah saya berhak mendapat pesangon?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH SA-ya ber-HAK men-DA-pat pe-SA-ngon - `berhak mendapat` = entitled to receive; `pesangon` = severance pay.",
          "VN-speaker trap: using vague `uang keluar`. The labor term is `pesangon`, but eligibility depends on contract/rules.",
          "Drill: `Apakah saya berhak mendapat pesangon?`",
        ],
      },
      {
        en: "HRD meminta saya ikut exit interview.",
        vi: "HR yêu cầu tôi tham gia phỏng vấn nghỉ việc.",
        pronunciation_focus: [
          "ha-er-de me-MIN-ta SA-ya I-kut EK-sit IN-ter-vyu - `HRD` = phòng nhân sự; `exit interview` mượn tiếng Anh.",
          "Lỗi người Việt: đọc HRD kiểu tiếng Anh. Ở Indonesia hay đọc từng chữ: ha-er-de.",
          "Luyện: `HRD meminta saya ikut exit interview.`",
        ],
        pronunciation_focus_en: [
          "ha-er-day me-MIN-ta SA-ya EE-kut EK-sit IN-ter-view - `HRD` = human resources; `exit interview` is an English loan phrase.",
          "VN-speaker trap: reading HRD only English-style. In Indonesian, it is often spelled out: ha-er-de.",
          "Drill: `HRD meminta saya ikut exit interview.`",
        ],
      },
      {
        en: "Saya ingin menjaga hubungan baik setelah resign.",
        vi: "Tôi muốn giữ quan hệ tốt sau khi nghỉ việc.",
        pronunciation_focus: [
          "SA-ya I-ngin men-JA-ga hu-BUNG-an BA-ik se-TE-lah re-SAIN - `menjaga hubungan baik` = giữ quan hệ tốt.",
          "Lỗi người Việt: nói quá thẳng về bất mãn. Văn hóa công sở Indonesia coi trọng giữ `hubungan baik` khi ra đi.",
          "Luyện: `Saya ingin menjaga hubungan baik setelah resign.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin men-JA-ga hoo-BOONG-an BA-ik se-TE-lah re-SIGN - `menjaga hubungan baik` = maintain good relations.",
          "VN-speaker trap: being too blunt about dissatisfaction. Indonesian office culture values keeping `hubungan baik` when leaving.",
          "Drill: `Saya ingin menjaga hubungan baik setelah resign.`",
        ],
      },
      {
        en: "Mohon konfirmasi tanggal terakhir saya bekerja.",
        vi: "Xin xác nhận ngày làm việc cuối cùng của tôi.",
        pronunciation_focus: [
          "MO-hon kon-fir-MA-si TANG-gal ter-a-KHIR SA-ya be-KER-ja - `mohon` = xin vui lòng; `tanggal terakhir` = ngày cuối cùng.",
          "Lỗi người Việt: dùng `tolong` được, nhưng email công sở trang trọng hơn với `mohon konfirmasi`.",
          "Luyện: `Mohon konfirmasi tanggal terakhir saya bekerja.`",
        ],
        pronunciation_focus_en: [
          "MO-hon kon-fir-MA-see TANG-gal ter-a-KHIR SA-ya be-KER-ja - `mohon` = please; `tanggal terakhir` = final date.",
          "VN-speaker trap: `tolong` works, but formal office email is smoother with `mohon konfirmasi`.",
          "Drill: `Mohon konfirmasi tanggal terakhir saya bekerja.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở công sở Indonesia, nghỉ việc nên nói với `atasan` trước, sau đó gửi `surat pengunduran diri` cho HRD. Nhiều công ty có `notice period` trong hợp đồng, thường 30 ngày nhưng tùy nơi. `Handover` rất quan trọng: bàn giao tài liệu, tài khoản, khách hàng, tiến độ công việc và người phụ trách tiếp theo. `Pesangon` thường liên quan đến PHK/chấm dứt từ phía công ty; tự resign có thể khác tùy hợp đồng và luật hiện hành. `Exit interview` là buổi HRD hỏi lý do nghỉ và góp ý. Giữ giọng lịch sự, cảm ơn và `pamit` giúp giữ quan hệ tốt.",
    cultural_notes_en:
      "In Indonesian workplaces, resigning is usually discussed with the `atasan` first, then followed by a `surat pengunduran diri` to HRD. Many companies have a contract `notice period`, often 30 days but not always. `Handover` is important: documents, accounts, customers, work progress, and the next person in charge. `Pesangon` often relates to company-side termination/layoff; voluntary resignation can differ depending on contract and current law. An `exit interview` is HRD's meeting to ask why you are leaving and collect feedback. A polite tone, thanks, and `pamit` help preserve good relations.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong chuyện nghỉ việc, đừng dịch quá thẳng kiểu `tôi bỏ việc`. Dùng cụm công sở: `ingin resign`, `surat pengunduran diri`, `notice period`, `handover`, `pamit kepada rekan kerja`, `mohon konfirmasi`. Với quyền lợi, dùng cấu trúc `berhak mendapat + danh từ`: `berhak mendapat pesangon`. Email nên dùng `saya`, `Bapak/Ibu`, `mohon`, `terima kasih`, tránh `aku/kamu`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: for resignation, avoid blunt translations like 'I quit'. Use office chunks: `ingin resign`, `surat pengunduran diri`, `notice period`, `handover`, `pamit kepada rekan kerja`, `mohon konfirmasi`. For entitlements, use `berhak mendapat + noun`: `berhak mendapat pesangon`. In email use `saya`, `Bapak/Ibu`, `mohon`, `terima kasih`, and avoid `aku/kamu`.",
    vocabulary: [
      {
        cell_id: "68b05b11-7f89-4451-8a9d-1de49e8b2a43",
        word: "resign",
        en: "to resign",
        vi: "xin nghỉ việc",
        pos: "verb",
        pronunciation_vi: "re-SAIN",
        pronunciation_en: "re-SIGN",
      },
      {
        cell_id: "5e062799-6c1a-4add-9710-d062ae44eb2f",
        word: "surat pengunduran diri",
        en: "resignation letter",
        vi: "thư xin nghỉ việc",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat pe-ngun-DU-ran DI-ri",
        pronunciation_en: "SOO-rat pe-ngoon-DOO-ran DEE-ree",
      },
      {
        cell_id: "f46ed51e-1ce2-4b16-99a8-dfe95e636675",
        word: "notice period",
        en: "notice period",
        vi: "thời gian báo trước",
        pos: "noun phrase",
        pronunciation_vi: "NO-tis PI-ri-ed",
        pronunciation_en: "NO-tice PEER-ee-od",
      },
      {
        cell_id: "d3e4de9b-457c-4498-a642-3f5b373bc2d5",
        word: "handover",
        en: "handover",
        vi: "bàn giao",
        pos: "noun/verb",
        pronunciation_vi: "HEN-do-ver",
        pronunciation_en: "HAN-do-ver",
      },
      {
        cell_id: "ae4d6708-6a8e-4aeb-81e8-15e3f7d0498f",
        word: "atasan",
        en: "superior / boss",
        vi: "cấp trên / sếp",
        pos: "noun",
        pronunciation_vi: "a-TA-san",
        pronunciation_en: "a-TA-san",
      },
      {
        cell_id: "1c1f89ff-21c3-4735-aae4-9635cfc18613",
        word: "rekan kerja",
        en: "coworker",
        vi: "đồng nghiệp",
        pos: "noun phrase",
        pronunciation_vi: "re-KAN KER-ja",
        pronunciation_en: "re-KAN KER-ja",
      },
      {
        cell_id: "9a89bb06-ebfc-4abf-b376-42121b9963f9",
        word: "pesangon",
        en: "severance pay",
        vi: "trợ cấp thôi việc",
        pos: "noun",
        pronunciation_vi: "pe-SA-ngon",
        pronunciation_en: "pe-SAH-ngon",
      },
      {
        cell_id: "5c2c1881-63f6-4b85-83ca-7bda5445ddf3",
        word: "exit interview",
        en: "exit interview",
        vi: "phỏng vấn nghỉ việc",
        pos: "noun phrase",
        pronunciation_vi: "EK-sit IN-ter-vyu",
        pronunciation_en: "EK-sit IN-ter-view",
      },
      {
        cell_id: "cf5c28cd-1780-4048-a047-d44e12227629",
        word: "pamit",
        en: "to take leave / say goodbye respectfully",
        vi: "chào/xin phép trước khi đi",
        pos: "verb",
        pronunciation_vi: "PA-mit",
        pronunciation_en: "PAH-mit",
      },
      {
        cell_id: "fd1ce810-d847-4457-bb46-0b8084f45766",
        word: "tanggal terakhir",
        en: "last date",
        vi: "ngày cuối cùng",
        pos: "noun phrase",
        pronunciation_vi: "TANG-gal ter-a-KHIR",
        pronunciation_en: "TANG-gal ter-ah-KHEER",
      },
    ],
    dialogue: [
      {
        cell_id: "39a799e0-02b1-42e8-9f7d-a5eb30aaee13",
        speaker: "Karyawan",
        text: "Pak, saya ingin bicara tentang rencana resign saya.",
        vi: "Anh/chú ơi, tôi muốn nói về kế hoạch nghỉ việc của tôi.",
        en: "Sir, I would like to talk about my plan to resign.",
      },
      {
        cell_id: "2c2bc410-6d60-4dc5-addf-e497707e8488",
        speaker: "Atasan",
        text: "Baik. Apakah Anda sudah menyiapkan surat pengunduran diri?",
        vi: "Được. Anh/chị đã chuẩn bị thư xin nghỉ việc chưa?",
        en: "Okay. Have you prepared a resignation letter?",
      },
      {
        cell_id: "05fefd3b-60ec-4017-998f-916b0d0c17a5",
        speaker: "Karyawan",
        text: "Sudah, Pak. Notice period saya tiga puluh hari.",
        vi: "Rồi ạ. Thời gian báo trước của tôi là ba mươi ngày.",
        en: "Yes, sir. My notice period is thirty days.",
      },
      {
        cell_id: "df856e32-4982-4ad2-bec2-9e52e522b292",
        speaker: "Atasan",
        text: "Tolong selesaikan handover dengan rekan kerja sebelum hari terakhir.",
        vi: "Vui lòng hoàn thành bàn giao với đồng nghiệp trước ngày cuối cùng.",
        en: "Please complete the handover with your coworker before the last day.",
      },
      {
        cell_id: "21248abd-e9dd-4c4b-a798-fd9f9be370d8",
        speaker: "Karyawan",
        text: "Baik. Saya juga akan pamit kepada tim dan ikut exit interview.",
        vi: "Vâng. Tôi cũng sẽ chào tạm biệt nhóm và tham gia phỏng vấn nghỉ việc.",
        en: "Okay. I will also say goodbye to the team and attend the exit interview.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya sudah menyiapkan surat ____ diri.`",
        prompt_en: "Fill in the blank: `Saya sudah menyiapkan surat ____ diri.`",
        answer: "pengunduran",
        explanation_vi: "`surat pengunduran diri` = thư xin nghỉ việc.",
        explanation_en: "`surat pengunduran diri` = resignation letter.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Atasan` nghĩa là gì?",
        prompt_en: "What does `atasan` mean?",
        choices: ["cấp trên / sếp", "đồng nghiệp ngang hàng", "khách hàng"],
        answer: "cấp trên / sếp",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Tôi muốn giữ quan hệ tốt sau khi nghỉ việc.`",
        prompt_en: "Translate into Indonesian: `I want to maintain good relations after resigning.`",
        answer: "Saya ingin menjaga hubungan baik setelah resign.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng các cụm nghỉ việc.",
        prompt_en: "Match the resignation phrases correctly.",
        pairs: [
          ["notice period", "thời gian báo trước / notice period"],
          ["handover", "bàn giao / handover"],
          ["exit interview", "phỏng vấn nghỉ việc / exit interview"],
        ],
      },
    ],
  },
];
