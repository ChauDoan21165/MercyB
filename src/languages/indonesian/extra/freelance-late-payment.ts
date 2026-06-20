// Freelance late payment Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. It follows the established Indonesian extra
// lesson format: Indonesian target text in `en`, Vietnamese glosses in `vi`,
// Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

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
    id: "indonesian_freelance_late_payment",
    level: "B1",
    category: "work",
    title_vi: "Thanh toán trễ cho công việc freelance",
    title_en: "Late freelance payment",
    sentences: [
      {
        en: "Maaf, saya mau follow up soal invoice yang jatuh tempo kemarin.",
        vi: "Xin lỗi, tôi muốn nhắc về hóa đơn đến hạn hôm qua.",
        pronunciation_focus: [
          "MA-af, SA-ya mau FO-lou ap so-al IN-voys yang JA-tuh TEM-po ke-MA-rin - `follow up` sering dipakai dalam kerja, dan `jatuh tempo` = đến hạn.",
          "Lỗi người Việt: nói `invoice ini sudah lewat tanggal` quá dài. Cách tự nhiên là `jatuh tempo`.",
          "Luyện: `Saya mau follow up soal invoice.`",
        ],
        pronunciation_focus_en: [
          "MAH-af, SAH-yah mow FOH-loh oop soh-AL IN-voys yahng JAH-tooh TEM-poh keh-MAH-reen - `follow up` is common in work, and `jatuh tempo` = due date passed.",
          "VN-speaker trap: saying a long sentence like `invoice ini sudah lewat tanggal`. The natural chunk is `jatuh tempo`.",
          "Drill: `Saya mau follow up soal invoice.`",
        ],
      },
      {
        en: "Apakah pembayaran saya sudah masuk?",
        vi: "Thanh toán của tôi đã vào chưa?",
        pronunciation_focus: [
          "a-pa-KAH pem-ba-yar-AN SA-ya SU-dah MA-suk - `pembayaran` = việc thanh toán; `sudah masuk` = đã vào/đã nhận.",
          "Lỗi người Việt: hỏi `sudah transfer belum?` vẫn hiểu, tapi `sudah masuk` lebih rapi untuk konfirmasi penerimaan.",
          "Luyện: `Pembayaran saya sudah masuk?`",
        ],
        pronunciation_focus_en: [
          "ah-pah-KAH pehm-bah-yar-AHN SAH-yah SOO-dah MAH-sook - `pembayaran` = payment; `sudah masuk` = has been received.",
          "VN-speaker trap: asking only `sudah transfer belum?` is understandable, but `sudah masuk` is cleaner for confirming receipt.",
          "Drill: `Pembayaran saya sudah masuk?`",
        ],
      },
      {
        en: "Klien bilang dananya belum cair.",
        vi: "Khách hàng nói tiền vẫn chưa được giải ngân.",
        pronunciation_focus: [
          "KLI-en bi-LANG DA-na-nya be-LUM CA-IR - `belum cair` = chưa giải ngân/chưa chuyển thành tiền thực nhận.",
          "Lỗi người Việt: dùng `keluar` cho mọi khoản tiền. Dalam konteks kerja, `belum cair` lebih natural.",
          "Luyện: `Dananya belum cair.`",
        ],
        pronunciation_focus_en: [
          "KLEE-en bee-LAHNG DAH-nah-nyah beh-LOOM CHAH-eer - `belum cair` = not yet disbursed/cleared.",
          "VN-speaker trap: using `keluar` for every money flow. In work/payment contexts, `belum cair` is more natural.",
          "Drill: `Dananya belum cair.`",
        ],
      },
      {
        en: "Saya sudah kirim reminder sebelum jatuh tempo.",
        vi: "Tôi đã gửi lời nhắc trước khi đến hạn.",
        pronunciation_focus: [
          "SA-ya SU-dah KI-rim ri-MAI-nder se-BE-lum JA-tuh TEM-po - `reminder` là từ vay, rất thường dùng dalam kerja.",
          "Lỗi người Việt: dịch quá sát thành `peringatan`. `Reminder` trong chat kerja sering lebih natural.",
          "Luyện: `Saya sudah kirim reminder.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah SOO-dah KEE-reem ri-MAIN-der seh-BEH-loom JAH-tooh TEM-poh - `reminder` is a loanword and very common at work.",
          "VN-speaker trap: translating too literally as `peringatan`. In work chat, `reminder` is often more natural.",
          "Drill: `Saya sudah kirim reminder.`",
        ],
      },
      {
        en: "Apakah ada DP atau termin untuk proyek ini?",
        vi: "Dự án này có đặt cọc hay chia đợt thanh toán không?",
        pronunciation_focus: [
          "a-pa-KAH A-da DE-pe a-tau TER-min un-TUK PRO-yek I-ni - `DP` = down payment / uang muka; `termin` = đợt thanh toán.",
          "Lỗi người Việt: nói `deposit awal` trong mọi kasus. Trong kerja freelance, `DP` dan `termin` sangat umum.",
          "Luyện: `Ada DP atau termin?`",
        ],
        pronunciation_focus_en: [
          "ah-pah-KAH AH-dah DEH-peh ah-toh TER-meen oon-TOOK PROY-ek EE-nee - `DP` = down payment / advance payment; `termin` = installment stage.",
          "VN-speaker trap: using `deposit awal` in every case. For freelance work, `DP` and `termin` are very common.",
          "Drill: `Ada DP atau termin?`",
        ],
      },
      {
        en: "Kontrak kita menyebutkan pembayaran dua minggu setelah serah terima.",
        vi: "Hợp đồng của chúng ta quy định thanh toán hai tuần sau khi bàn giao.",
        pronunciation_focus: [
          "kon-TRAK ki-TA me-nye-BUT-kan pem-ba-yar-AN DU-a MING-gu se-TE-lah se-RAH te-RI-ma - `serah terima` = bàn giao.",
          "Lỗi người Việt: chỉ nói `setelah selesai`. Trong kontrak, `serah terima` lebih spesifik dan profesional.",
          "Luyện: `Pembayaran setelah serah terima.`",
        ],
        pronunciation_focus_en: [
          "kon-TRAK kee-TA mehn-yeh-BOOT-kan pehm-bah-yar-AHN DOO-ah MEENG-goo seh-TEH-lah seh-RAH teh-REE-mah - `serah terima` = handover.",
          "VN-speaker trap: only saying `setelah selesai`. In contracts, `serah terima` is more specific and professional.",
          "Drill: `Pembayaran setelah serah terima.`",
        ],
      },
      {
        en: "Saya ingin menagih dengan bahasa yang sopan.",
        vi: "Tôi muốn đòi thanh toán bằng ngôn ngữ lịch sự.",
        pronunciation_focus: [
          "SA-ya I-ngin me-NA-gih de-NGAN ba-HA-sa yang SO-pan - `menagih` = đòi nợ/nhắc thanh toán; `sopan` = lịch sự.",
          "Lỗi người Việt: dùng `marah` khi follow up tagihan. `Menagih dengan sopan` menjaga hubungan kerja.",
          "Luyện: `Menagih dengan sopan.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah EEN-geen meh-NAH-geeh deh-NGAN bah-HAH-sah yahng SOH-pahn - `menagih` = to collect payment; `sopan` = polite.",
          "VN-speaker trap: using `marah` when following up on payment. `Menagih dengan sopan` preserves working relationships.",
          "Drill: `Menagih dengan sopan.`",
        ],
      },
      {
        en: "Kalau belum bisa bayar, tolong beri kabar kapan transfernya.",
        vi: "Nếu chưa thể thanh toán, làm ơn báo tôi biết khi nào sẽ chuyển khoản.",
        pronunciation_focus: [
          "KA-lau be-LUM BI-sa BA-yar, TO-long be-RI KA-bar KA-pan trans-FER-nya - `beri kabar` = báo tin; `transfernya` = việc chuyển khoản đó.",
          "Lỗi người Việt: hỏi quá cứng `kenapa belum bayar?`. Cách này mềm hơn dan tetap jelas.",
          "Luyện: `Tolong beri kabar kapan transfernya.`",
        ],
        pronunciation_focus_en: [
          "KAH-low beh-LOOM BEE-sah BAH-yar, TOH-long beh-REE KAH-bar KAH-pahn trans-FER-nyah - `beri kabar` = let me know; `transfernya` = the transfer.",
          "VN-speaker trap: asking too harshly `kenapa belum bayar?`. This version is softer and still clear.",
          "Drill: `Tolong beri kabar kapan transfernya.`",
        ],
      },
      {
        en: "Saya bisa kirim invoice revisi kalau diperlukan.",
        vi: "Tôi có thể gửi hóa đơn sửa lại nếu cần.",
        pronunciation_focus: [
          "SA-ya BI-sa KI-rim IN-voys re-VI-si KA-lau di-per-lu-KAN - `invoice revisi` = hóa đơn chỉnh sửa.",
          "Lỗi người Việt: chỉ nói `invoice baru` khi thật ra cần sửa detail. `Revisi` lebih tepat jika ada perubahan data.",
          "Luyện: `Kirim invoice revisi.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah BEE-sah KEE-reem IN-voys reh-VEE-see KAH-low dee-pehr-loo-KAHN - `invoice revisi` = revised invoice.",
          "VN-speaker trap: saying `invoice baru` when you actually need to correct details. `Revisi` is more accurate when data changes.",
          "Drill: `Kirim invoice revisi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong kerja freelance ở Indonesia, follow up payment thường dilakukan lewat chat yang sopan, singkat, dan jelas. Người làm freelance hay menyebut `invoice`, `jatuh tempo`, `DP`, `termin`, dan `serah terima`. Nếu klien terlambat, fokus pada jadwal pembayaran dan status invoice, bukan menuduh. Kalimat mềm seperti `maaf, saya mau follow up` atau `tolong beri kabar kapan transfernya` biasanya lebih aman.",
    cultural_notes_en:
      "In Indonesian freelance work, payment follow-up is usually done through a polite, short, and clear chat message. Freelancers often mention `invoice`, `jatuh tempo`, `DP`, `termin`, and `serah terima`. If the client is late, focus on the payment schedule and invoice status, not accusations. Soft lines like `maaf, saya mau follow up` or `tolong beri kabar kapan transfernya` are usually safer.",
    tip_advice_vi:
      "Khung an toàn: `Maaf, saya mau follow up soal invoice`, `Apakah pembayaran saya sudah masuk?`, `Tolong beri kabar kapan transfernya`. Nếu cần cứng hơn sedikit, vẫn giữ sopan dan sebutkan tanggal jatuh tempo.",
    tip_advice_en:
      "Safe frames: `Maaf, saya mau follow up soal invoice`, `Apakah pembayaran saya sudah masuk?`, `Tolong beri kabar kapan transfernya`. If you need to be firmer, stay polite and mention the due date.",
    vocabulary: [
      {
        word: "invoice",
        en: "invoice",
        vi: "hóa đơn",
        pos: "noun",
        pronunciation_vi: "IN-voys",
        pronunciation_en: "IN-voys",
      },
      {
        word: "jatuh tempo",
        en: "due date",
        vi: "đến hạn",
        pos: "noun phrase",
        pronunciation_vi: "JA-tuh TEM-po",
        pronunciation_en: "JAH-tooh TEM-poh",
      },
      {
        word: "follow up",
        en: "follow up",
        vi: "nhắc/đòi thông tin",
        pos: "verb phrase",
        pronunciation_vi: "fo-lo-UP",
        pronunciation_en: "FOL-oh up",
      },
      {
        word: "DP",
        en: "down payment / advance payment",
        vi: "đặt cọc / tiền ứng trước",
        pos: "noun",
        pronunciation_vi: "DE-pe",
        pronunciation_en: "DEE-pee",
      },
      {
        word: "termin",
        en: "installment / payment stage",
        vi: "đợt thanh toán",
        pos: "noun",
        pronunciation_vi: "TER-min",
        pronunciation_en: "TER-meen",
      },
      {
        word: "serah terima",
        en: "handover",
        vi: "bàn giao",
        pos: "noun phrase",
        pronunciation_vi: "se-RAH te-RI-ma",
        pronunciation_en: "seh-RAH teh-REE-mah",
      },
      {
        word: "menagih",
        en: "to collect payment",
        vi: "đòi thanh toán",
        pos: "verb",
        pronunciation_vi: "me-NA-gih",
        pronunciation_en: "meh-NAH-geeh",
      },
      {
        word: "sopan",
        en: "polite",
        vi: "lịch sự",
        pos: "adjective",
        pronunciation_vi: "SO-pan",
        pronunciation_en: "SOH-pahn",
      },
    ],
    dialogue: [
      {
        speaker: "Freelancer",
        text: "Maaf, saya mau follow up soal invoice yang jatuh tempo kemarin.",
        vi: "Xin lỗi, tôi muốn nhắc về hóa đơn đến hạn hôm qua.",
        en: "Sorry, I want to follow up about the invoice that was due yesterday.",
      },
      {
        speaker: "Klien",
        text: "Maaf, pembayaran belum masuk karena dana kami belum cair.",
        vi: "Xin lỗi, thanh toán chưa vào vì tiền bên tôi هنوز chưa giải ngân.",
        en: "Sorry, the payment has not come in because our funds have not cleared yet.",
      },
      {
        speaker: "Freelancer",
        text: "Baik, tolong beri kabar kapan transfernya bisa dilakukan.",
        vi: "Vâng, làm ơn báo tôi biết khi nào có thể chuyển khoản.",
        en: "Okay, please let me know when the transfer can be made.",
      },
      {
        speaker: "Klien",
        text: "Tentu. Kami targetkan minggu ini, sesuai termin di kontrak.",
        vi: "Chắc chắn rồi. Chúng tôi dự kiến trong tuần này, theo đợt thanh toán trong hợp đồng.",
        en: "Of course. We are targeting this week, according to the installment stage in the contract.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn nhắc về hóa đơn đến hạn.",
        prompt_en: "Translate into Indonesian: I want to follow up about the due invoice.",
        answer: "Saya mau follow up soal invoice yang jatuh tempo.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Apakah pembayaran saya sudah ____?",
        prompt_en: "Fill in the blank: Apakah pembayaran saya sudah ____?",
        answer: "masuk",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “đến hạn”?",
        prompt_en: "Which phrase means “due date”?",
        choices: ["jatuh tempo", "serah terima", "menagih"],
        answer: "jatuh tempo",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `termin` = ?",
        prompt_en: "Match the meaning: `termin` = ?",
        answer: "installment / payment stage",
      },
    ],
  },
];

export default lessons;
