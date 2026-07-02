// Factory Shift Work Indonesian (Vietnamese -> Indonesian study track).
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_factory_shift_work",
    level: "A2",
    category: "work",
    title_vi: "Làm ca trong nhà máy Indonesia",
    title_en: "Factory shift work in Indonesian",
    sentences: [
      {
        en: "Saya bekerja di pabrik tekstil.",
        vi: "Tôi làm việc ở nhà máy dệt.",
        pronunciation_focus: [
          "SA-ya be-KER-ja di PAB-rik TEK-stil - `pabrik` = nhà máy; `bekerja di` = làm việc ở.",
          "Lỗi người Việt: dùng `ke pabrik` khi nói nơi làm việc cố định. Ở đâu dùng `di pabrik`; đi đến đâu dùng `ke pabrik`.",
          "Luyện: `Saya bekerja di pabrik tekstil.`",
        ],
        pronunciation_focus_en: [
          "SA-ya be-KER-ja di PAB-rik TEK-stil - `pabrik` = factory; `bekerja di` = work at/in.",
          "VN-speaker trap: using `ke pabrik` for a fixed workplace. Location uses `di pabrik`; movement uses `ke pabrik`.",
          "Drill: `Saya bekerja di pabrik tekstil.`",
        ],
      },
      {
        en: "Minggu ini saya masuk shift pagi.",
        vi: "Tuần này tôi vào ca sáng.",
        pronunciation_focus: [
          "MING-gu I-ni SA-ya MA-suk shift PA-gi - `masuk shift` = vào ca; `shift pagi` = ca sáng.",
          "Lỗi người Việt: dịch `ca` thành `jam kerja` mọi lúc. Lịch ca nói `shift pagi/malam`.",
          "Luyện: `Minggu ini saya masuk shift pagi.`",
        ],
        pronunciation_focus_en: [
          "MING-goo I-ni SA-ya MA-suk shift PA-gi - `masuk shift` = start/be on a shift; `shift pagi` = morning shift.",
          "VN-speaker trap: translating every 'shift' as `jam kerja`. Shift schedules use `shift pagi/malam`.",
          "Drill: `Minggu ini saya masuk shift pagi.`",
        ],
      },
      {
        en: "Besok saya pindah ke shift malam.",
        vi: "Ngày mai tôi chuyển sang ca đêm.",
        pronunciation_focus: [
          "BE-sok SA-ya PIN-dah ke shift MA-lam - `pindah ke` = chuyển sang; `shift malam` = ca đêm.",
          "Lỗi người Việt: dùng `di shift malam` cho chuyển động. Chuyển sang ca khác dùng `ke shift malam`.",
          "Luyện: `Besok saya pindah ke shift malam.`",
        ],
        pronunciation_focus_en: [
          "BE-sok SA-ya PIN-dah ke shift MA-lam - `pindah ke` = move/switch to; `shift malam` = night shift.",
          "VN-speaker trap: using `di shift malam` for switching. Moving to another shift uses `ke shift malam`.",
          "Drill: `Besok saya pindah ke shift malam.`",
        ],
      },
      {
        en: "Jangan lupa absensi sebelum mulai kerja.",
        vi: "Đừng quên chấm công trước khi bắt đầu làm.",
        pronunciation_focus: [
          "JA-ngan LU-pa ab-SEN-si se-BE-lum MU-lai KER-ja - `absensi` = chấm công/điểm danh; `sebelum` = trước khi.",
          "Lỗi người Việt: dùng `tidak lupa` để nhắc nhở. Lệnh 'đừng quên' dùng `jangan lupa`.",
          "Luyện: `Jangan lupa absensi sebelum mulai kerja.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan LU-pa ab-SEN-see se-BE-lum MU-lai KER-ja - `absensi` = attendance/time clock; `sebelum` = before.",
          "VN-speaker trap: using `tidak lupa` for a reminder. 'Don't forget' is `jangan lupa`.",
          "Drill: `Jangan lupa absensi sebelum mulai kerja.`",
        ],
      },
      {
        en: "Hari ini ada lembur dua jam.",
        vi: "Hôm nay có tăng ca hai tiếng.",
        pronunciation_focus: [
          "HA-ri I-ni A-da LEM-bur DU-a jam - `lembur` = tăng ca; `dua jam` = hai tiếng.",
          "Lỗi người Việt: nói `kerja tambah` cho tăng ca. Từ công sở/nhà máy chuẩn là `lembur`.",
          "Luyện: `Hari ini ada lembur dua jam.`",
        ],
        pronunciation_focus_en: [
          "HA-ri I-ni A-da LEM-bur DU-a jam - `lembur` = overtime; `dua jam` = two hours.",
          "VN-speaker trap: saying `kerja tambah` for overtime. The workplace word is `lembur`.",
          "Drill: `Hari ini ada lembur dua jam.`",
        ],
      },
      {
        en: "Supervisor meminta laporan target produksi.",
        vi: "Giám sát yêu cầu báo cáo chỉ tiêu sản xuất.",
        pronunciation_focus: [
          "SU-per-vai-zor me-MIN-ta la-PO-ran TAR-get pro-DUK-si - `supervisor` = giám sát; `target produksi` = chỉ tiêu sản xuất.",
          "Lỗi người Việt: dịch supervisor thành `bos` trong ngữ cảnh nhà máy. Chức danh trên sàn thường là `supervisor`.",
          "Luyện: `Supervisor meminta laporan target produksi.`",
        ],
        pronunciation_focus_en: [
          "SOO-per-vai-zor me-MIN-ta la-PO-ran TAR-get pro-DUK-see - `supervisor` = supervisor; `target produksi` = production target.",
          "VN-speaker trap: translating supervisor as `bos` in a factory context. The floor role is usually `supervisor`.",
          "Drill: `Supervisor meminta laporan target produksi.`",
        ],
      },
      {
        en: "Target produksi hari ini belum tercapai.",
        vi: "Chỉ tiêu sản xuất hôm nay chưa đạt.",
        pronunciation_focus: [
          "TAR-get pro-DUK-si HA-ri I-ni be-LUM ter-CA-pai - `tercapai` = đạt được; `belum` = chưa.",
          "Lỗi người Việt: dùng `tidak tercapai` khi ý là chưa đạt nhưng còn có thể đạt. Dùng `belum tercapai`.",
          "Luyện: `Target produksi hari ini belum tercapai.`",
        ],
        pronunciation_focus_en: [
          "TAR-get pro-DUK-see HA-ri I-ni be-LUM ter-CHA-pai - `tercapai` = achieved/reached; `belum` = not yet.",
          "VN-speaker trap: using `tidak tercapai` when you mean not yet but still possible. Use `belum tercapai`.",
          "Drill: `Target produksi hari ini belum tercapai.`",
        ],
      },
      {
        en: "Saya harus pakai seragam kerja dan sepatu safety.",
        vi: "Tôi phải mặc đồng phục làm việc và mang giày bảo hộ.",
        pronunciation_focus: [
          "SA-ya HA-rus PA-kai se-RA-gam KER-ja dan se-PA-tu SEF-ti - `seragam kerja` = đồng phục làm việc; `sepatu safety` = giày bảo hộ.",
          "Lỗi người Việt: `pakai` dùng cho mặc/đội/mang/dùng, không cần đổi động từ như tiếng Việt.",
          "Luyện: `Saya harus pakai seragam kerja dan sepatu safety.`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-rus PA-kai se-RA-gam KER-ja dan se-PA-tu SAFE-tee - `seragam kerja` = work uniform; `sepatu safety` = safety shoes.",
          "VN-speaker trap: `pakai` covers wear/put on/use; no need to switch verbs like Vietnamese.",
          "Drill: `Saya harus pakai seragam kerja dan sepatu safety.`",
        ],
      },
      {
        en: "Mesin produksi berhenti karena gangguan.",
        vi: "Máy sản xuất dừng vì sự cố.",
        pronunciation_focus: [
          "ME-sin pro-DUK-si ber-HEN-ti ka-RE-na gang-GU-an - `mesin produksi` = máy sản xuất; `gangguan` = sự cố/trục trặc.",
          "Lỗi người Việt: dùng `rusak` cho mọi sự cố. `Gangguan` rộng hơn: trục trặc có thể tạm thời.",
          "Luyện: `Mesin produksi berhenti karena gangguan.`",
        ],
        pronunciation_focus_en: [
          "ME-sin pro-DUK-see ber-HEN-ti ka-RE-na gang-GU-an - `mesin produksi` = production machine; `gangguan` = disruption/fault.",
          "VN-speaker trap: using `rusak` for every issue. `Gangguan` is broader: a disruption may be temporary.",
          "Drill: `Mesin produksi berhenti karena gangguan.`",
        ],
      },
      {
        en: "Saya lapor ke supervisor kalau ada masalah di line.",
        vi: "Tôi báo cho giám sát nếu có vấn đề ở dây chuyền.",
        pronunciation_focus: [
          "SA-ya LA-por ke SU-per-vai-zor KA-lau A-da ma-SA-lah di lain - `lapor ke` = báo cho; `line` = dây chuyền/khu vực sản xuất.",
          "Lỗi người Việt: nói `lapor supervisor` thiếu giới từ. Tự nhiên hơn: `lapor ke supervisor`.",
          "Luyện: `Saya lapor ke supervisor kalau ada masalah di line.`",
        ],
        pronunciation_focus_en: [
          "SA-ya LA-por ke SOO-per-vai-zor KA-lau A-da ma-SA-lah di line - `lapor ke` = report to; `line` = production line/area.",
          "VN-speaker trap: saying `lapor supervisor` without a preposition. More natural: `lapor ke supervisor`.",
          "Drill: `Saya lapor ke supervisor kalau ada masalah di line.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong nhà máy Indonesia, lịch làm việc thường chia `shift pagi`, `shift siang`, và `shift malam`. Công nhân phải `absensi` khi vào/ra ca, mặc `seragam kerja`, và tuân thủ quy định K3 như giày bảo hộ, mũ bảo hộ hoặc khẩu trang tùy ngành. `Supervisor` thường theo dõi `target produksi`, chất lượng, an toàn và kỷ luật ca. `Lembur` cần được ghi rõ vì liên quan đến tiền lương và quyền lao động. Khi có sự cố máy, tai nạn hoặc vấn đề ở line, báo ngay cho supervisor.",
    cultural_notes_en:
      "In Indonesian factories, work schedules often use `shift pagi`, `shift siang`, and `shift malam`. Workers clock in/out with `absensi`, wear `seragam kerja`, and follow K3 safety rules such as safety shoes, helmets, or masks depending on the industry. A `supervisor` usually tracks `target produksi`, quality, safety, and shift discipline. `Lembur` should be recorded because it affects pay and labor rights. If there is a machine issue, accident, or production-line problem, report it to the supervisor immediately.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm nhà máy: `masuk shift`, `shift pagi`, `shift malam`, `absensi`, `lembur`, `target produksi`, `seragam kerja`, `lapor ke supervisor`. Phân biệt `di` = ở (`di pabrik`, `di line`) và `ke` = đến/báo cho (`ke pabrik`, `lapor ke supervisor`). Với việc chưa xong, dùng `belum`, không dùng `tidak`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn factory chunks: `masuk shift`, `shift pagi`, `shift malam`, `absensi`, `lembur`, `target produksi`, `seragam kerja`, `lapor ke supervisor`. Keep `di` = at/in (`di pabrik`, `di line`) separate from `ke` = to/report to (`ke pabrik`, `lapor ke supervisor`). For work not yet done, use `belum`, not `tidak`.",
    vocabulary: [
      {
        word: "pabrik",
        en: "factory",
        vi: "nhà máy",
        pos: "noun",
        pronunciation_vi: "PAB-rik",
        pronunciation_en: "PAB-rik",
      },
      {
        word: "shift pagi",
        en: "morning shift",
        vi: "ca sáng",
        pos: "noun phrase",
        pronunciation_vi: "shift PA-gi",
        pronunciation_en: "shift PAH-gi",
      },
      {
        word: "shift malam",
        en: "night shift",
        vi: "ca đêm",
        pos: "noun phrase",
        pronunciation_vi: "shift MA-lam",
        pronunciation_en: "shift MAH-lam",
      },
      {
        word: "absensi",
        en: "attendance / clock-in record",
        vi: "chấm công / điểm danh",
        pos: "noun",
        pronunciation_vi: "ab-SEN-si",
        pronunciation_en: "ab-SEN-see",
      },
      {
        word: "lembur",
        en: "overtime",
        vi: "tăng ca",
        pos: "noun/verb",
        pronunciation_vi: "LEM-bur",
        pronunciation_en: "LEM-boor",
      },
      {
        word: "supervisor",
        en: "supervisor",
        vi: "giám sát",
        pos: "noun",
        pronunciation_vi: "SU-per-vai-zor",
        pronunciation_en: "SOO-per-vai-zor",
      },
      {
        word: "seragam kerja",
        en: "work uniform",
        vi: "đồng phục làm việc",
        pos: "noun phrase",
        pronunciation_vi: "se-RA-gam KER-ja",
        pronunciation_en: "se-RAH-gam KER-ja",
      },
      {
        word: "target produksi",
        en: "production target",
        vi: "chỉ tiêu sản xuất",
        pos: "noun phrase",
        pronunciation_vi: "TAR-get pro-DUK-si",
        pronunciation_en: "TAR-get pro-DUK-see",
      },
      {
        word: "line produksi",
        en: "production line",
        vi: "dây chuyền sản xuất",
        pos: "noun phrase",
        pronunciation_vi: "lain pro-DUK-si",
        pronunciation_en: "line pro-DUK-see",
      },
      {
        word: "gangguan mesin",
        en: "machine disruption/fault",
        vi: "sự cố máy",
        pos: "noun phrase",
        pronunciation_vi: "gang-GU-an ME-sin",
        pronunciation_en: "gang-GOO-an MEH-sin",
      },
    ],
    dialogue: [
      {
        speaker: "Supervisor",
        text: "Hari ini kamu masuk shift pagi, ya?",
        vi: "Hôm nay bạn vào ca sáng đúng không?",
        en: "Today you are on the morning shift, right?",
      },
      {
        speaker: "Karyawan",
        text: "Iya, Pak. Saya sudah absensi dan pakai seragam kerja.",
        vi: "Vâng anh/chú. Tôi đã chấm công và mặc đồng phục làm việc.",
        en: "Yes, sir. I have clocked in and put on the work uniform.",
      },
      {
        speaker: "Supervisor",
        text: "Target produksi hari ini tinggi, mungkin ada lembur dua jam.",
        vi: "Chỉ tiêu sản xuất hôm nay cao, có thể tăng ca hai tiếng.",
        en: "Today's production target is high, so there may be two hours of overtime.",
      },
      {
        speaker: "Karyawan",
        text: "Baik. Kalau ada gangguan mesin, saya lapor ke Bapak.",
        vi: "Vâng. Nếu có sự cố máy, tôi báo cho anh/chú.",
        en: "Okay. If there is a machine fault, I will report to you.",
      },
      {
        speaker: "Supervisor",
        text: "Bagus. Jangan lupa cek kualitas barang di line.",
        vi: "Tốt. Đừng quên kiểm tra chất lượng hàng ở dây chuyền.",
        en: "Good. Do not forget to check product quality on the line.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Minggu ini saya masuk shift ____.`",
        prompt_en: "Fill in the blank: `Minggu ini saya masuk shift ____.`",
        answer: "pagi",
        explanation_vi: "`shift pagi` = ca sáng.",
        explanation_en: "`shift pagi` = morning shift.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Lembur` nghĩa là gì?",
        prompt_en: "What does `lembur` mean?",
        choices: ["tăng ca", "đồng phục", "nhà máy"],
        answer: "tăng ca",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Chỉ tiêu sản xuất hôm nay chưa đạt.`",
        prompt_en: "Translate into Indonesian: `Today's production target has not been achieved yet.`",
        answer: "Target produksi hari ini belum tercapai.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng các cụm nhà máy.",
        prompt_en: "Match the factory phrases correctly.",
        pairs: [
          ["absensi", "attendance / chấm công"],
          ["seragam kerja", "work uniform / đồng phục"],
          ["supervisor", "supervisor / giám sát"],
        ],
      },
    ],
  },
];
