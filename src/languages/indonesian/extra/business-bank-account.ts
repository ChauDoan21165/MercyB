// Business Bank Account Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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

export const businessBankAccountLessons: IndonesianLesson[] = [
  {
    id: "indonesian_business_bank_account",
    level: "B1",
    category: "business_finance",
    title_vi: "Tai khoan ngan hang cho doanh nghiep: ten usaha, dokumen, dan internet banking",
    title_en: "Business bank account: business name, documents, and internet banking",
    sentences: [
      {
        en: "Saya ingin membuka rekening bisnis atas nama usaha saya.",
        vi: "Tôi muốn mở tài khoản doanh nghiệp đứng tên cơ sở kinh doanh của tôi.",
        pronunciation_focus: [
          "`membuka rekening bisnis` = mở tài khoản doanh nghiệp; `membuka` dipakai untuk layanan bank.",
          "`atas nama usaha saya` = đứng tên cơ sở kinh doanh của tôi; formula ini sering dipakai di bank.",
          "Loi nguoi Viet: noi `account business` chen tieng Anh. Trong giao dich ngan hang, `rekening bisnis` va `usaha` ro hon.",
        ],
        pronunciation_focus_en: [
          "`membuka rekening bisnis` means open a business account; `membuka` is the natural verb for bank services.",
          "`atas nama usaha saya` means in the name of my business; a common bank formula.",
          "VN-speaker trap: mixing in `account business` English. In banking, `rekening bisnis` and `usaha` are clearer.",
        ],
      },
      {
        en: "Apakah saya bisa memakai nama usaha yang berbeda dari nama pribadi?",
        vi: "Tôi có thể dùng tên doanh nghiệp khác với tên cá nhân không?",
        pronunciation_focus: [
          "`bisa memakai` = có thể dùng; `memakai` là từ trung tính, hợp với tên và dokumen.",
          "`nama usaha` = tên doanh nghiệp/cơ sở kinh doanh; khác với `nama pribadi`.",
          "Loi nguoi Viet: hoi `beda name` qua khau nguu. Nho dung cap doi `nama usaha` va `nama pribadi`.",
        ],
        pronunciation_focus_en: [
          "`bisa memakai` means can use; `memakai` is neutral and fits names and documents.",
          "`nama usaha` means business name; different from `nama pribadi`, personal name.",
          "VN-speaker trap: casual `beda name`. Use the pair `nama usaha` and `nama pribadi`.",
        ],
      },
      {
        en: "Bank meminta dokumen perusahaan dan identitas pemilik.",
        vi: "Ngân hàng yêu cầu giấy tờ công ty và giấy tờ tùy thân của chủ sở hữu.",
        pronunciation_focus: [
          "`dokumen perusahaan` = giấy tờ công ty; digunakan untuk data usaha resmi.",
          "`identitas pemilik` = giấy tờ tùy thân của chủ; bank perlu tahu siapa pemilik usahanya.",
          "Loi nguoi Viet: noi `sertifikat company` khong tu nhien. `dokumen perusahaan` la from Indonesia chuan hon.",
        ],
        pronunciation_focus_en: [
          "`dokumen perusahaan` means company documents; used for official business data.",
          "`identitas pemilik` means the owner's ID; banks need to know who owns the business.",
          "VN-speaker trap: `sertifikat company` sounds unnatural. `dokumen perusahaan` is the standard Indonesian phrase.",
        ],
      },
      {
        en: "Setoran awal untuk rekening ini cukup ringan.",
        vi: "Khoản tiền nạp ban đầu cho tài khoản này khá thấp.",
        pronunciation_focus: [
          "`setoran awal` = tiền nạp ban đầu; cụm rất hay khi mở tài khoản.",
          "`cukup ringan` = khá thấp/không nặng; ở đây nói về số tiền ban đầu.",
          "Loi nguoi Viet: dung `deposit` trong moi cau. `setoran awal` ro rang hon trong van phong ngan hang.",
        ],
        pronunciation_focus_en: [
          "`setoran awal` means initial deposit; common when opening an account.",
          "`cukup ringan` means fairly low/light; here it refers to the opening amount.",
          "VN-speaker trap: overusing `deposit` in every sentence. `setoran awal` is clearer in bank language.",
        ],
      },
      {
        en: "Saya perlu rekening koran untuk laporan keuangan.",
        vi: "Tôi cần sao kê tài khoản để làm báo cáo tài chính.",
        pronunciation_focus: [
          "`rekening koran` = sao kê tài khoản; thuật ngữ ngân hàng rất quan trọng.",
          "`laporan keuangan` = báo cáo tài chính; dùng cho pajak, audit, atau pembukuan.",
          "Loi nguoi Viet: dich thang `bank statement` hon la `statement bank`. Trong tieng Indonesia, `rekening koran` la tu dung.",
        ],
        pronunciation_focus_en: [
          "`rekening koran` means bank statement; a very important banking term.",
          "`laporan keuangan` means financial report; useful for tax, audit, or bookkeeping.",
          "VN-speaker trap: translating `bank statement` too literally. In Indonesian, the fixed term is `rekening koran`.",
        ],
      },
      {
        en: "Apakah internet banking bisa diaktifkan untuk dua tanda tangan?",
        vi: "Internet banking có thể được kích hoạt cho hai chữ ký không?",
        pronunciation_focus: [
          "`internet banking` = internet banking; di bank Indonesia, istilah Inggris ini lazim dipakai.",
          "`diaktifkan` = được kích hoạt; bentuk pasif sangat umum untuk layanan bank.",
          "`dua tanda tangan` = hai chữ ký; bank bisnis sering meminta otorisasi ganda untuk transaksi.",
        ],
        pronunciation_focus_en: [
          "`internet banking` is commonly used as-is in Indonesian banks.",
          "`diaktifkan` means activated; passive form is common for banking services.",
          "`dua tanda tangan` means two signatures; business banks often require dual authorization for transactions.",
        ],
      },
      {
        en: "Biaya admin per bulan berapa, ya?",
        vi: "Phí quản lý hàng tháng là bao nhiêu ạ?",
        pronunciation_focus: [
          "`biaya admin` = phí quản lý/phí dịch vụ; sering muncul pada rekening bisnis.",
          "`per bulan` = mỗi tháng; pola ini sangat umum untuk biaya rutin.",
          "Loi nguoi Viet: hoi `berapa month fee` camp tieng Anh. Cukup dung `per bulan berapa`.",
        ],
        pronunciation_focus_en: [
          "`biaya admin` means administrative/service fee; common for business accounts.",
          "`per bulan` means per month; a very common pattern for recurring costs.",
          "VN-speaker trap: asking with mixed `month fee` English. Just use `per bulan berapa`.",
        ],
      },
      {
        en: "Mohon kirim formulir dan jadwal tanda tangannya.",
        vi: "Xin gửi cho tôi mẫu đơn và lịch ký tên nhé.",
        pronunciation_focus: [
          "`mohon kirim` = xin gửi; sangat umum dalam permintaan sopan.",
          "`jadwal tanda tangannya` = lịch ký; `-nya` menunjuk ke proses yang sudah dibicarakan.",
          "Loi nguoi Viet: noi `schedule sign` qua sat cua tieng Anh. `jadwal tanda tangan` la cach tu nhien hon.",
        ],
        pronunciation_focus_en: [
          "`mohon kirim` means please send; very common in polite requests.",
          "`jadwal tanda tangannya` means the signing schedule; `-nya` points back to the known process.",
          "VN-speaker trap: literal `schedule sign`. `jadwal tanda tangan` is the natural Indonesian phrase.",
        ],
      },
      {
        en: "Saya ingin memastikan rekening ini bisa dipakai untuk transaksi online.",
        vi: "Tôi muốn xác nhận tài khoản này có thể dùng cho giao dịch online không.",
        pronunciation_focus: [
          "`memastikan` = xác nhận/đảm bảo; dùng khi kiểm tra chức năng trước khi dùng.",
          "`transaksi online` = giao dịch trực tuyến; thường liên quan pembayaran, transfer, dan belanja.",
          "Loi nguoi Viet: hoi `bisa online transaction?` nghe lai tieng Anh. Chuyen sang `transaksi online` se ro rang hon.",
        ],
        pronunciation_focus_en: [
          "`memastikan` means confirm/ensure; useful before using a service.",
          "`transaksi online` means online transaction; usually tied to payments, transfers, and shopping.",
          "VN-speaker trap: `bisa online transaction?` mixes too much English. `transaksi online` is clearer.",
        ],
      },
      {
        en: "Kalau ada perubahan data, apakah saya perlu tanda tangan ulang?",
        vi: "Nếu có thay đổi dữ liệu, tôi có cần ký lại không?",
        pronunciation_focus: [
          "`perubahan data` = thay đổi dữ liệu/thong tin; `data` thường dùng cho info nasabah.",
          "`tanda tangan ulang` = ký lại; `ulang` nhấn mạnh làm lại từ đầu.",
          "Loi nguoi Viet: dung `sign again` theo mot cach nguyen van. Cau nay nen giu ngu phap Indonesia: `tanda tangan ulang`.",
        ],
        pronunciation_focus_en: [
          "`perubahan data` means changes to data/information; common for customer records.",
          "`tanda tangan ulang` means sign again; `ulang` emphasizes doing it again from the start.",
          "VN-speaker trap: using `sign again` too literally. Indonesian uses `tanda tangan ulang`.",
        ],
      },
    ],
    cultural_notes_vi:
      "O Indonesia, rekening bisnis thuong can nama usaha, dokumen perusahaan, NPWP atau identitas pemilik, dan sometimes tanda tangan ganda untuk transaksi tertentu. Ngan hang co the yeu cau setoran awal, rekening koran, atau penjelasan ve jenis usaha. Khi lam viec voi bank, nguoi noi thuong phan biet ro giữa rekening pribadi dan rekening bisnis, va hay hoi ve biaya admin, internet banking, serta ai duoc phep ký.",
    cultural_notes_en:
      "In Indonesia, business bank accounts often require a business name, company documents, tax or owner ID, and sometimes dual signatures for certain transactions. Banks may ask for an initial deposit, bank statements, or details about the type of business. When dealing with banks, speakers clearly distinguish personal and business accounts, and they usually ask about admin fees, internet banking, and who is allowed to sign.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng khung hỏi ngân hàng rất thực tế: `Saya ingin membuka rekening bisnis`, `Dokumen apa yang diperlukan?`, `Setoran awal berapa?`, `Biaya admin per bulan berapa?`, `Apakah internet banking bisa diaktifkan?`. Nhớ rằng `rekening koran` là sao kê và `tanda tangan ulang` là ký lại.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use practical banking question frames: `Saya ingin membuka rekening bisnis`, `Dokumen apa yang diperlukan?`, `Setoran awal berapa?`, `Biaya admin per bulan berapa?`, `Apakah internet banking bisa diaktifkan?`. Remember that `rekening koran` means bank statement and `tanda tangan ulang` means sign again.",
    vocabulary: [
      {
        cell_id: "62881082-2719-4d3e-ace7-8cc1f81d7550",
        word: "rekening bisnis",
        en: "business account",
        vi: "tai khoan doanh nghiep",
        pos: "noun phrase",
        pronunciation_vi: "re-ke-NING BI-snis",
        pronunciation_en: "reh-keh-NEENG BIZ-nis",
      },
      {
        cell_id: "8b910f6f-fa88-4675-ae3f-49f3d4e68865",
        word: "nama usaha",
        en: "business name",
        vi: "ten doanh nghiep/cua hang",
        pos: "noun phrase",
        pronunciation_vi: "NA-ma u-SA-ha",
        pronunciation_en: "NAH-mah oo-SAH-hah",
      },
      {
        cell_id: "59f76e00-9e6f-42c9-8ec7-b15e122b24cb",
        word: "dokumen perusahaan",
        en: "company documents",
        vi: "giay to cong ty",
        pos: "noun phrase",
        pronunciation_vi: "dok-u-men per-u-sa-HA-an",
        pronunciation_en: "do-KOO-men per-oo-sah-HAH-an",
      },
      {
        cell_id: "f422ce6e-aa44-484a-9732-cdd31401e8be",
        word: "setoran awal",
        en: "initial deposit",
        vi: "so tien nap ban dau",
        pos: "noun phrase",
        pronunciation_vi: "se-TO-ran A-wal",
        pronunciation_en: "seh-TOH-ran AH-wal",
      },
      {
        cell_id: "bb4c7ac9-e7b6-416a-93c2-b9e611930ba3",
        word: "internet banking",
        en: "internet banking",
        vi: "ngan hang truc tuyen",
        pos: "noun phrase",
        pronunciation_vi: "in-ter-NET BAN-king",
        pronunciation_en: "IN-ter-net BAN-king",
      },
      {
        cell_id: "6501aa4f-89d8-4a46-938f-179ca02e3d81",
        word: "rekening koran",
        en: "bank statement",
        vi: "sao ke tai khoan",
        pos: "noun phrase",
        pronunciation_vi: "re-ke-NING KO-ran",
        pronunciation_en: "reh-keh-NEENG KOH-ran",
      },
      {
        cell_id: "66beef70-ff3a-4693-a017-3a708bc672f6",
        word: "biaya admin",
        en: "service fee",
        vi: "phi dich vu",
        pos: "noun phrase",
        pronunciation_vi: "bi-A-ya AD-min",
        pronunciation_en: "bee-AH-yah AHD-min",
      },
      {
        cell_id: "eedb8160-2413-4f33-8273-06a581591e24",
        word: "tanda tangan",
        en: "signature",
        vi: "chu ky",
        pos: "noun phrase",
        pronunciation_vi: "TAN-da TA-ngan",
        pronunciation_en: "TAHN-dah TAH-ngan",
      },
    ],
    dialogue: [
      {
        cell_id: "29ff775b-988a-4423-bd9c-4ba6f09f8af8",
        speaker: "Nasabah",
        text: "Selamat pagi, saya ingin membuka rekening bisnis atas nama usaha saya.",
        vi: "Chao buoi sang, toi muon mo tai khoan doanh nghiep dung ten co so kinh doanh cua toi.",
        en: "Good morning, I would like to open a business account under my business name.",
      },
      {
        cell_id: "eb7e59f6-32c9-4fe6-b1f8-60fe25a43055",
        speaker: "Petugas Bank",
        text: "Tentu. Apakah Bapak sudah membawa dokumen perusahaan dan identitas pemilik?",
        vi: "Tat nhien. Anh da mang giay to cong ty va giay to cua chu so huu chua?",
        en: "Of course. Have you brought the company documents and the owner's ID?",
      },
      {
        cell_id: "f62e96ef-f714-454a-81da-6882642786e7",
        speaker: "Nasabah",
        text: "Sudah, dan saya juga ingin tahu biaya admin per bulan.",
        vi: "Roi, va toi cung muon biet phi quan ly moi thang.",
        en: "Yes, and I also want to know the monthly admin fee.",
      },
      {
        cell_id: "10bc6b30-18c4-48f1-8d3b-422c3e516e57",
        speaker: "Petugas Bank",
        text: "Baik, rekening ini bisa dipakai untuk transaksi online dan internet banking.",
        vi: "Duoc, tai khoan nay co the dung cho giao dich online va internet banking.",
        en: "Alright, this account can be used for online transactions and internet banking.",
      },
      {
        cell_id: "f0d36292-e135-4668-8107-2ae776a80355",
        speaker: "Nasabah",
        text: "Kalau ada perubahan data, apakah saya perlu tanda tangan ulang?",
        vi: "Neu co thay doi thong tin, toi co can ky lai khong?",
        en: "If there are changes to the data, do I need to sign again?",
      },
    ],
    exercises: [
      {
        type: "translation_id",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn mở tài khoản doanh nghiệp đứng tên cơ sở kinh doanh của tôi.",
        prompt_en: "Translate into Indonesian: I want to open a business account under my business name.",
        answer: "Saya ingin membuka rekening bisnis atas nama usaha saya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ đúng: Saya perlu ___ koran untuk laporan keuangan.",
        prompt_en: "Fill in the correct word: Saya perlu ___ koran untuk laporan keuangan.",
        answer: "rekening",
        explanation_vi: "`rekening koran` = sao kê tài khoản.",
        explanation_en: "`rekening koran` means bank statement.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào tự nhiên nhất để nói 'initial deposit'?",
        prompt_en: "Which phrase is the most natural way to say 'initial deposit'?",
        choices: ["setoran awal", "uang pembuka", "deposit pertama", "saldo masuk"],
        answer: "setoran awal",
      },
      {
        type: "short_answer",
        prompt_vi: "Viết một câu lịch sự hỏi ngân hàng về phí quản lý hàng tháng.",
        prompt_en: "Write one polite sentence asking the bank about the monthly admin fee.",
        sample_answer: "Biaya admin per bulan berapa, ya?",
      },
    ],
  },
];
