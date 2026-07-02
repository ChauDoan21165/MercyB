// Local government permit Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_local_government_permit",
    level: "B1",
    category: "public_services",
    title_vi: "Xin giấy phép ở kantor kelurahan",
    title_en: "Getting a permit at the local government office",
    sentences: [
      {
        en: "Saya mau mengurus izin usaha di kantor kelurahan.",
        vi: "Tôi muốn làm giấy phép kinh doanh ở văn phòng phường.",
        pronunciation_focus: [
          "`mengurus izin usaha` = làm/xử lý giấy phép kinh doanh.",
          "`kantor kelurahan` = văn phòng phường/xã hành chính; trong đời sống kota, từ này rất phổ biến.",
          "Lỗi người Việt: nói `buat izin` theo kiểu trực tiếp. Trong hành chính, `mengurus izin` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`mengurus izin usaha` means to handle/apply for a business permit.",
          "`kantor kelurahan` = local ward office; very common in city life.",
          "VN-speaker trap: saying `buat izin` too directly. In administration, `mengurus izin` sounds more natural.",
        ],
      },
      {
        en: "Apakah saya perlu surat pengantar dari RT atau RW?",
        vi: "Tôi có cần giấy giới thiệu từ RT hoặc RW không?",
        pronunciation_focus: [
          "`surat pengantar` = giấy giới thiệu/giấy xác nhận ban đầu; rất hay dùng trong thủ tục địa phương.",
          "`RT` dan `RW` dibaca `er-te` dan `er-we`, bukan kiểu tiếng Anh.",
          "Lỗi người Việt: quên hỏi từ `dari`. Trong hành chính, `dari RT atau RW` chỉ nguồn giấy tờ.",
        ],
        pronunciation_focus_en: [
          "`surat pengantar` = introductory letter/cover letter for local procedures.",
          "`RT` and `RW` are read `er-te` and `er-we`, not English-style.",
          "VN-speaker trap: forgetting `dari`. In administration, `dari RT atau RW` shows the document source.",
        ],
      },
      {
        en: "Formulir ini harus diisi lengkap dan jelas.",
        vi: "Mẫu này phải được điền đầy đủ và rõ ràng.",
        pronunciation_focus: [
          "`harus diisi` = phải được điền; dạng bị động rất thường gặp trong giấy tờ.",
          "`lengkap dan jelas` = đầy đủ và rõ ràng; mô tả yêu cầu rất chuẩn.",
          "Lỗi người Việt: nói `tulis form` nửa Anh nửa Indo. Cách tự nhiên là `mengisi formulir` hoặc `formulir diisi`.",
        ],
        pronunciation_focus_en: [
          "`harus diisi` = must be filled in; passive form is very common in paperwork.",
          "`lengkap dan jelas` = complete and clear; a very standard requirement phrase.",
          "VN-speaker trap: mixed `tulis form`. Natural Indonesian is `mengisi formulir` or `formulir diisi`.",
        ],
      },
      {
        en: "Tolong tanda tangan di bagian bawah.",
        vi: "Làm ơn ký tên ở phần bên dưới.",
        pronunciation_focus: [
          "`tanda tangan` = chữ ký / ký tên.",
          "`bagian bawah` = phần dưới; rất thường dùng trong hướng dẫn hành chính.",
          "Lỗi người Việt: chỉ nói `sign here`. Trong tiếng Indonesia, `tanda tangan di bagian bawah` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "`tanda tangan` = signature / to sign.",
          "`bagian bawah` = bottom section; very common in admin instructions.",
          "VN-speaker trap: only saying `sign here`. In Indonesian, `tanda tangan di bagian bawah` is clearer.",
        ],
      },
      {
        en: "Surat ini perlu stempel kelurahan.",
        vi: "Giấy này cần đóng dấu của phường.",
        pronunciation_focus: [
          "`stempel` = con dấu / đóng dấu.",
          "`kelurahan` adalah unit administrasi cấp phường/xã ở Indonesia; dalam konteks ini, dấu resmi rất penting.",
          "Lỗi người Việt: dùng `cap` theo tiếng Việt. Tiếng Indonesia văn phòng thường nói `stempel`.",
        ],
        pronunciation_focus_en: [
          "`stempel` = official stamp / to stamp.",
          "`kelurahan` is an Indonesian local administrative unit; in this context, the official stamp matters.",
          "VN-speaker trap: borrowing Vietnamese `cap`. Office Indonesian usually says `stempel`.",
        ],
      },
      {
        en: "Apa saja persyaratan untuk izin ini?",
        vi: "Những yêu cầu nào cần cho giấy phép này?",
        pronunciation_focus: [
          "`apa saja` = những gì / gồm những gì; dùng để hỏi danh sách.",
          "`persyaratan` = yêu cầu / điều kiện / hồ sơ cần có.",
          "Lỗi người Việt: hỏi `syarat apa?` hiểu được, nhưng `Apa saja persyaratan...` đầy đủ và lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "`apa saja` = which items / what are the requirements; used for lists.",
          "`persyaratan` = requirements / conditions / needed documents.",
          "VN-speaker trap: `syarat apa?` is understood, but `Apa saja persyaratan...` is more complete and polite.",
        ],
      },
      {
        en: "Saya sudah menunggu antrean cukup lama.",
        vi: "Tôi đã đợi xếp hàng khá lâu rồi.",
        pronunciation_focus: [
          "`menunggu antrean` = chờ trong hàng; `antrean` là hàng chờ/thứ tự xếp hàng.",
          "`cukup lama` = khá lâu; câu than phiền nhưng vẫn lịch sự.",
          "Lỗi người Việt: dùng `antri` như động từ mọi lúc. Cụm an toàn là `menunggu antrean` hoặc `nomor antrean`.",
        ],
        pronunciation_focus_en: [
          "`menunggu antrean` = wait in line; `antrean` means queue/line.",
          "`cukup lama` = quite a long time; a complaint that still sounds polite.",
          "VN-speaker trap: using `antri` as the verb every time. Safe frames are `menunggu antrean` or `nomor antrean`.",
        ],
      },
      {
        en: "Nomor antrean saya berapa sekarang?",
        vi: "Số thứ tự của tôi bây giờ là bao nhiêu?",
        pronunciation_focus: [
          "`nomor antrean` = số thứ tự xếp hàng.",
          "`berapa sekarang` = bây giờ là bao nhiêu; dùng khi muốn biết thứ tự hiện tại.",
          "Lỗi người Việt: bỏ `nomor` và chỉ nói `antrean saya berapa`. Có thể hiểu, nhưng `nomor antrean` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "`nomor antrean` = queue number.",
          "`berapa sekarang` = what is it now; used when asking the current position.",
          "VN-speaker trap: dropping `nomor` and saying only `antrean saya berapa`. Understood, but `nomor antrean` is clearer.",
        ],
      },
      {
        en: "Kalau dokumen kurang, saya harus kembali lagi besok.",
        vi: "Nếu thiếu giấy tờ thì tôi phải quay lại vào ngày mai.",
        pronunciation_focus: [
          "`dokumen kurang` = thiếu giấy tờ; `kurang` ở đây là không đủ.",
          "`harus kembali lagi` = phải quay lại; `lagi` nhấn mạnh làm lại một lần nữa.",
          "Lỗi người Việt: dịch `back again` thành `balik ulang`. `Kembali lagi` là cụm tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`dokumen kurang` = documents are missing / incomplete; `kurang` here means not enough.",
          "`harus kembali lagi` = must come back again; `lagi` emphasizes doing it once more.",
          "VN-speaker trap: translating `back again` as `balik ulang`. `Kembali lagi` is more natural.",
        ],
      },
      {
        en: "Boleh saya minta salinan surat yang sudah disetujui?",
        vi: "Tôi có thể xin bản sao của giấy đã được phê duyệt không?",
        pronunciation_focus: [
          "`salinan` = bản sao; `surat yang sudah disetujui` = giấy đã được chấp thuận.",
          "`boleh saya minta...` là cách xin lịch sự, rất hợp với quầy hành chính.",
          "Lỗi người Việt: nói `copy surat` được hiểu, nhưng `salinan surat` hoặc `fotokopi surat` chuẩn hơn.",
        ],
        pronunciation_focus_en: [
          "`salinan` = copy; `surat yang sudah disetujui` = the approved letter.",
          "`boleh saya minta...` is a polite request, ideal for an office counter.",
          "VN-speaker trap: `copy surat` is understandable, but `salinan surat` or `fotokopi surat` is more standard.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di kantor kelurahan, alur biasa adalah ambil nomor antrean, serahkan formulir, lampirkan dokumen, minta surat pengantar bila perlu, lalu tunggu stempel atau tanda tangan. Dalam beberapa daerah, RT/RW masih sangat penting untuk surat pengantar, domisili, atau izin usaha kecil. Menyebut `Pak`, `Bu`, `Mas`, atau `Mbak` membuat nada lebih sopan.",
    cultural_notes_en:
      "At a kelurahan office, the usual flow is to take a queue number, submit the form, attach documents, get a surat pengantar if needed, then wait for a stamp or signature. In some areas, RT/RW is still very important for introductory letters, domicile letters, or small business permits. Using `Pak`, `Bu`, `Mas`, or `Mbak` makes the tone more polite.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong hành chính, học theo khung cố định là tốt nhất: `mengurus izin`, `surat pengantar`, `nomor antrean`, `persyaratan`, `tanda tangan`, `stempel`. `Boleh saya...` mềm hơn `saya mau...` khi nói với nhân viên quầy.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in administration, fixed frames work best: `mengurus izin`, `surat pengantar`, `nomor antrean`, `persyaratan`, `tanda tangan`, `stempel`. `Boleh saya...` sounds softer than `saya mau...` when speaking to a counter staff member.",
    vocabulary: [
      {
        word: "izin usaha",
        en: "business permit",
        vi: "giấy phép kinh doanh",
        pos: "noun phrase",
        pronunciation_vi: "I-zin u-SA-ha",
        pronunciation_en: "EE-zin oo-SA-ha",
      },
      {
        word: "kantor kelurahan",
        en: "local ward office",
        vi: "văn phòng phường/xã",
        pos: "noun phrase",
        pronunciation_vi: "KAN-tor ke-lu-RA-han",
        pronunciation_en: "KAN-tor keh-loo-RA-han",
      },
      {
        word: "surat pengantar",
        en: "introductory letter; referral letter",
        vi: "giấy giới thiệu",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat pe-ngaN-tar",
        pronunciation_en: "SOO-rat peh-ngan-TAR",
      },
      {
        word: "formulir",
        en: "form",
        vi: "mẫu đơn",
        pos: "noun",
        pronunciation_vi: "for-mu-LIR",
        pronunciation_en: "for-my-LEER",
      },
      {
        word: "tanda tangan",
        en: "signature; to sign",
        vi: "chữ ký; ký tên",
        pos: "noun phrase",
        pronunciation_vi: "TAN-da TA-ngan",
        pronunciation_en: "TAN-da TA-ngan",
      },
      {
        word: "stempel",
        en: "stamp; to stamp",
        vi: "con dấu; đóng dấu",
        pos: "noun",
        pronunciation_vi: "STEM-pel",
        pronunciation_en: "STEM-pel",
      },
      {
        word: "persyaratan",
        en: "requirements",
        vi: "yêu cầu; điều kiện; hồ sơ cần có",
        pos: "noun",
        pronunciation_vi: "per-sya-RA-tan",
        pronunciation_en: "per-sha-RAH-tan",
      },
      {
        word: "antrean",
        en: "queue; line",
        vi: "hàng chờ; xếp hàng",
        pos: "noun",
        pronunciation_vi: "an-TRE-an",
        pronunciation_en: "an-TRAY-an",
      },
      {
        word: "nomor antrean",
        en: "queue number",
        vi: "số thứ tự xếp hàng",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor an-TRE-an",
        pronunciation_en: "NO-mor an-TRAY-an",
      },
      {
        word: "salinan",
        en: "copy",
        vi: "bản sao",
        pos: "noun",
        pronunciation_vi: "sa-li-NAN",
        pronunciation_en: "sa-lee-NAN",
      },
    ],
    dialogue: [
      {
        speaker: "Warga",
        text: "Selamat pagi, saya mau mengurus izin usaha di kantor kelurahan.",
        vi: "Chào buổi sáng, tôi muốn làm giấy phép kinh doanh ở văn phòng phường.",
        en: "Good morning, I want to handle a business permit at the kelurahan office.",
      },
      {
        speaker: "Petugas",
        text: "Silakan ambil nomor antrean dulu dan isi formulir ini.",
        vi: "Xin hãy lấy số thứ tự trước và điền mẫu này.",
        en: "Please take a queue number first and fill out this form.",
      },
      {
        speaker: "Warga",
        text: "Apakah saya perlu surat pengantar dari RT atau RW?",
        vi: "Tôi có cần giấy giới thiệu từ RT hoặc RW không?",
        en: "Do I need a referral letter from the RT or RW?",
      },
      {
        speaker: "Petugas",
        text: "Untuk izin ini, ya. Setelah itu, tanda tangan dan stempel akan diproses.",
        vi: "Đối với giấy phép này thì có. Sau đó chữ ký và con dấu sẽ được xử lý.",
        en: "For this permit, yes. After that, the signature and stamp will be processed.",
      },
      {
        speaker: "Warga",
        text: "Kalau dokumen kurang, saya harus kembali lagi besok, ya?",
        vi: "Nếu thiếu giấy tờ thì tôi phải quay lại vào ngày mai, đúng không?",
        en: "If documents are missing, I have to come back tomorrow, right?",
      },
      {
        speaker: "Petugas",
        text: "Benar. Mohon cek persyaratan dulu supaya tidak bolak-balik.",
        vi: "Đúng rồi. Vui lòng kiểm tra yêu cầu trước để khỏi phải đi lại nhiều lần.",
        en: "That is correct. Please check the requirements first so you do not have to make repeated trips.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Dich sang tieng Indonesia: 'Tôi có cần giấy giới thiệu từ RT hoặc RW không?'",
        answer: "Apakah saya perlu surat pengantar dari RT atau RW?",
        explanation_vi: "Dung `surat pengantar` cho giay gioi thieu va `perlu` cho can.",
        explanation_en: "Use `surat pengantar` for the letter and `perlu` for need.",
      },
      {
        type: "fill_blank",
        prompt: "Dien tu dung: Tolong tanda ____ di bagian bawah.",
        answer: "tangan",
        explanation_vi: "Cum co dinh la `tanda tangan`.",
        explanation_en: "The fixed phrase is `tanda tangan`.",
      },
      {
        type: "choice",
        prompt: "Cau nao tu nhien hon khi hoi ve ho so can co?",
        answer: "Apa saja persyaratan untuk izin ini?",
        explanation_vi: "Dung `apa saja` de hoi danh sach nhieu muc.",
        explanation_en: "Use `apa saja` when asking for a list of requirements.",
      },
      {
        type: "roleplay",
        prompt: "Dong vai nguoi dan den kantor kelurahan xin izin usaha, hoi ve surat pengantar, formulir, stempel, va nomor antrean.",
        answer: "Selamat pagi, saya mau mengurus izin usaha. Apakah saya perlu surat pengantar dari RT atau RW? Nomor antrean saya berapa sekarang? Formulir ini harus diisi lengkap, ya?",
        explanation_vi: "Giu giong lich su va noi tung buoc ro rang.",
        explanation_en: "Keep the tone polite and make each step clear.",
      },
    ],
  },
];
