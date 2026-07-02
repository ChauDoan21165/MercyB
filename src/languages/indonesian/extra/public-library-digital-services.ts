// Public Library Digital Services Indonesian (Vietnamese -> Indonesian study track).
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
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
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

export const publicLibraryDigitalServicesLessons: IndonesianLesson[] = [
  {
    id: "indonesian_public_library_digital_services",
    level: "B1",
    category: "public_services",
    title_vi: "Thư viện công cộng: e-book, máy tính và dịch vụ số",
    title_en: "Public library digital services: e-books, computers and online access",
    sentences: [
      {
        en: "Saya ingin membuat kartu anggota perpustakaan.",
        vi: "Tôi muốn làm thẻ thành viên thư viện.",
        pronunciation_focus: [
          "`kartu anggota perpustakaan` = thẻ thành viên thư viện; `anggota` đứng sau `kartu` để chỉ loại thẻ.",
          "`membuat kartu` trong dịch vụ công có nghĩa là đăng ký/làm thẻ, không phải tự chế tạo thẻ.",
          "Lỗi người Việt: nói `member card` được hiểu, nhưng ở quầy dịch vụ nên dùng `kartu anggota`.",
        ],
        pronunciation_focus_en: [
          "`kartu anggota perpustakaan` means library membership card; `anggota` follows `kartu` to describe the card type.",
          "`membuat kartu` in public services means apply for/get a card, not physically make one yourself.",
          "VN-speaker note: `member card` may be understood, but at a service desk `kartu anggota` is better.",
        ],
      },
      {
        en: "Apakah kartu anggota ini bisa dipakai untuk meminjam e-book?",
        vi: "Thẻ thành viên này có thể dùng để mượn e-book không?",
        pronunciation_focus: [
          "`bisa dipakai untuk...` = có thể dùng để...; khung rất tự nhiên khi hỏi chức năng của thẻ.",
          "`meminjam e-book` = mượn sách điện tử; `meminjam` vẫn dùng được dù sách ở dạng số.",
          "Lỗi người Việt: dịch `borrow online book` từng chữ. Tiếng Indonesia tự nhiên là `meminjam e-book`.",
        ],
        pronunciation_focus_en: [
          "`bisa dipakai untuk...` means can be used to..., a natural frame for asking what a card can do.",
          "`meminjam e-book` means borrow an e-book; `meminjam` still works for digital books.",
          "VN-speaker trap: translating `borrow online book` word for word. Natural Indonesian is `meminjam e-book`.",
        ],
      },
      {
        en: "Saya belum punya akun perpustakaan digital.",
        vi: "Tôi chưa có tài khoản thư viện số.",
        pronunciation_focus: [
          "`akun perpustakaan digital` = tài khoản thư viện số; `digital` đứng sau danh từ.",
          "`belum punya` = chưa có; khác với `tidak punya` là không có nói chung.",
          "Lỗi người Việt: dùng `tidak punya` cho mọi trường hợp. Khi có thể đăng ký sau, `belum punya` mềm và chính xác hơn.",
        ],
        pronunciation_focus_en: [
          "`akun perpustakaan digital` means digital library account; `digital` follows the noun.",
          "`belum punya` means do not have yet; different from `tidak punya`, which is a general do not have.",
          "VN-speaker trap: using `tidak punya` for everything. If you can register later, `belum punya` is softer and more accurate.",
        ],
      },
      {
        en: "Petugas bisa membantu saya mengaktifkan akses internet?",
        vi: "Nhân viên có thể giúp tôi kích hoạt truy cập internet không?",
        pronunciation_focus: [
          "`petugas` = nhân viên phụ trách/quầy dịch vụ; dùng tốt trong thư viện, ga, bệnh viện, kantor.",
          "`mengaktifkan akses internet` = kích hoạt quyền truy cập internet; nghe rõ hơn `bikin internet`.",
          "Lỗi người Việt: hỏi `staf bisa help?` trong câu Indonesia. Nói gọn và lịch sự: `Petugas bisa membantu...?`.",
        ],
        pronunciation_focus_en: [
          "`petugas` means the staff member on duty; useful in libraries, stations, hospitals, and offices.",
          "`mengaktifkan akses internet` means activate internet access; clearer than `bikin internet`.",
          "VN-speaker trap: asking mixed `staf bisa help?` in Indonesian. A concise polite form is `Petugas bisa membantu...?`.",
        ],
      },
      {
        en: "Komputer umum hanya boleh dipakai selama satu jam.",
        vi: "Máy tính công cộng chỉ được dùng trong một giờ.",
        pronunciation_focus: [
          "`komputer umum` = máy tính dùng chung/công cộng; thường có giới hạn thời gian.",
          "`hanya boleh dipakai` = chỉ được phép dùng; `boleh` nói về quyền/cho phép.",
          "Lỗi người Việt: dùng `bisa` thay cho `boleh`. Khi nói luật thư viện, `boleh` chính xác hơn.",
        ],
        pronunciation_focus_en: [
          "`komputer umum` means shared/public computer; it often has a time limit.",
          "`hanya boleh dipakai` means may only be used; `boleh` is about permission.",
          "VN-speaker trap: using `bisa` instead of `boleh`. For library rules, `boleh` is more precise.",
        ],
      },
      {
        en: "Saya mau reservasi buku yang sedang dipinjam orang lain.",
        vi: "Tôi muốn đặt trước cuốn sách đang được người khác mượn.",
        pronunciation_focus: [
          "`reservasi buku` = đặt trước sách; dùng khi sách chưa có sẵn.",
          "`sedang dipinjam orang lain` = đang được người khác mượn; bị động `di-` rất tự nhiên ở đây.",
          "Lỗi người Việt: nói `buku dipinjam oleh orang lain sedang`. Trạng từ `sedang` đứng trước động từ: `sedang dipinjam`.",
        ],
        pronunciation_focus_en: [
          "`reservasi buku` means reserve a book, used when the book is not available yet.",
          "`sedang dipinjam orang lain` means currently borrowed by someone else; passive `di-` is natural here.",
          "VN-speaker trap: placing `sedang` after the passive phrase. It comes before the verb: `sedang dipinjam`.",
        ],
      },
      {
        en: "Kalau bukunya sudah tersedia, apakah saya akan mendapat notifikasi?",
        vi: "Nếu sách đã có sẵn, tôi có nhận được thông báo không?",
        pronunciation_focus: [
          "`sudah tersedia` = đã có sẵn; dùng cho buku, ruang baca, komputer, atau file digital.",
          "`mendapat notifikasi` = nhận thông báo; trong ứng dụng cũng có thể nói `dapat notifikasi`.",
          "Lỗi người Việt: dùng `ada notifikasi untuk saya?` được hiểu, nhưng `saya akan mendapat notifikasi?` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "`sudah tersedia` means already available; use it for books, reading rooms, computers, or digital files.",
          "`mendapat notifikasi` means receive a notification; in apps, `dapat notifikasi` is also common.",
          "VN-speaker note: `ada notifikasi untuk saya?` is understood, but `saya akan mendapat notifikasi?` is clearer.",
        ],
      },
      {
        en: "Saya tidak bisa login ke aplikasi perpustakaan.",
        vi: "Tôi không đăng nhập được vào ứng dụng thư viện.",
        pronunciation_focus: [
          "`login ke aplikasi` = đăng nhập vào ứng dụng; `ke` đánh dấu hướng vào hệ thống.",
          "`tidak bisa login` = không đăng nhập được; cụm vay mượn này rất phổ biến trong dịch vụ số.",
          "Lỗi người Việt: nói `login di aplikasi` có thể nghe như vị trí. Với hành động vào hệ thống, dùng `ke aplikasi`.",
        ],
        pronunciation_focus_en: [
          "`login ke aplikasi` means log in to the app; `ke` marks movement into the system.",
          "`tidak bisa login` means cannot log in; this borrowed phrase is very common in digital services.",
          "VN-speaker trap: saying `login di aplikasi` can sound like a location. For entering a system, use `ke aplikasi`.",
        ],
      },
      {
        en: "Apakah ada biaya denda kalau e-book terlambat dikembalikan?",
        vi: "Có phí phạt nếu e-book được trả muộn không?",
        pronunciation_focus: [
          "`biaya denda` = phí phạt; một số thư viện số tự động mengembalikan e-book tanpa denda.",
          "`terlambat dikembalikan` = được trả muộn; bị động phù hợp khi nói về sách.",
          "Lỗi người Việt: dịch `late fee` thành `harga terlambat`. Từ đúng trong dịch vụ là `denda` hoặc `biaya denda`.",
        ],
        pronunciation_focus_en: [
          "`biaya denda` means fine/late fee; some digital libraries automatically return e-books without a fine.",
          "`terlambat dikembalikan` means returned late; passive wording fits when talking about books.",
          "VN-speaker trap: translating `late fee` as `harga terlambat`. The service word is `denda` or `biaya denda`.",
        ],
      },
      {
        en: "Saya perlu mencetak dokumen dari komputer umum.",
        vi: "Tôi cần in tài liệu từ máy tính công cộng.",
        pronunciation_focus: [
          "`mencetak dokumen` = in tài liệu; chữ `c` trong `mencetak` đọc như 'ch'.",
          "`dari komputer umum` = từ máy tính công cộng; có thể cần login atau bantuan petugas.",
          "Lỗi người Việt: đọc `cetak` như /k/. Trong tiếng Indonesia, `cetak` đọc gần `che-tak`.",
        ],
        pronunciation_focus_en: [
          "`mencetak dokumen` means print a document; Indonesian `c` in `mencetak` sounds like 'ch'.",
          "`dari komputer umum` means from the public computer; it may require login or staff help.",
          "VN-speaker trap: pronouncing `cetak` with /k/. In Indonesian, `cetak` is close to `che-tak`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, thư viện công cộng hoặc thư viện kampus có thể cung cấp kartu anggota, peminjaman buku fisik, e-book, komputer umum, akses internet, ruang baca, dan bantuan petugas. Dịch vụ số thường cần akun, nomor anggota, email, atau aplikasi perpustakaan. Khi nhờ hỗ trợ, hãy nói rõ vấn đề: tidak bisa login, lupa password, buku belum tersedia, muốn reservasi buku, atau perlu mencetak dokumen.",
    cultural_notes_en:
      "In Indonesia, public or campus libraries may provide membership cards, physical book loans, e-books, public computers, internet access, reading rooms, and staff assistance. Digital services often require an account, member number, email, or library app. When asking for help, state the exact issue: cannot log in, forgot the password, the book is not available yet, want to reserve a book, or need to print a document.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng các khung lịch sự ở quầy thư viện: `Saya ingin membuat kartu anggota`, `Bisa bantu saya login?`, `Saya mau reservasi buku`, `Apakah ada biaya denda?`, `Komputer umum masih tersedia?`. Nhớ phân biệt `bisa` = khả năng và `boleh` = được phép theo quy định.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use polite library-desk frames: `Saya ingin membuat kartu anggota`, `Bisa bantu saya login?`, `Saya mau reservasi buku`, `Apakah ada biaya denda?`, `Komputer umum masih tersedia?`. Remember the difference between `bisa` for ability and `boleh` for permission under rules.",
    vocabulary: [
      {
        word: "perpustakaan digital",
        en: "digital library",
        vi: "thư viện số",
        pos: "noun phrase",
        pronunciation_vi: "per-pus-ta-KA-an DI-gi-tal",
        pronunciation_en: "per-poos-ta-KA-an DEE-gee-tal",
      },
      {
        word: "e-book",
        en: "e-book",
        vi: "sách điện tử",
        pos: "noun",
        pronunciation_vi: "I-buk",
        pronunciation_en: "EE-book",
      },
      {
        word: "komputer umum",
        en: "public computer",
        vi: "máy tính công cộng",
        pos: "noun phrase",
        pronunciation_vi: "kom-PU-ter U-mum",
        pronunciation_en: "kom-POO-ter OO-moom",
      },
      {
        word: "kartu anggota",
        en: "membership card",
        vi: "thẻ thành viên",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu ang-GO-ta",
        pronunciation_en: "KAR-too ang-GO-ta",
      },
      {
        word: "reservasi buku",
        en: "book reservation",
        vi: "đặt trước sách",
        pos: "noun phrase",
        pronunciation_vi: "re-ser-VA-si BU-ku",
        pronunciation_en: "reh-ser-VA-see BOO-koo",
      },
      {
        word: "akses internet",
        en: "internet access",
        vi: "truy cập internet",
        pos: "noun phrase",
        pronunciation_vi: "AK-ses IN-ter-net",
        pronunciation_en: "AK-ses IN-ter-net",
      },
      {
        word: "petugas",
        en: "staff member on duty",
        vi: "nhân viên phụ trách",
        pos: "noun",
        pronunciation_vi: "pe-TU-gas",
        pronunciation_en: "peh-TOO-gas",
      },
      {
        word: "tersedia",
        en: "available",
        vi: "có sẵn",
        pos: "adjective / stative verb",
        pronunciation_vi: "ter-se-DI-a",
        pronunciation_en: "ter-seh-DEE-a",
      },
    ],
    dialogue: [
      {
        speaker: "Pengunjung",
        text: "Selamat pagi, saya ingin membuat kartu anggota perpustakaan.",
        vi: "Chào buổi sáng, tôi muốn làm thẻ thành viên thư viện.",
        en: "Good morning, I would like to get a library membership card.",
      },
      {
        speaker: "Petugas",
        text: "Boleh. Apakah Bapak sudah punya akun perpustakaan digital?",
        vi: "Được ạ. Anh đã có tài khoản thư viện số chưa?",
        en: "Sure. Do you already have a digital library account?",
      },
      {
        speaker: "Pengunjung",
        text: "Belum. Saya juga ingin meminjam e-book dan memakai komputer umum.",
        vi: "Chưa. Tôi cũng muốn mượn e-book và dùng máy tính công cộng.",
        en: "Not yet. I also want to borrow e-books and use a public computer.",
      },
      {
        speaker: "Petugas",
        text: "Nanti saya bantu aktivasi akun. Komputer umum bisa dipakai selama satu jam.",
        vi: "Lát nữa tôi sẽ giúp kích hoạt tài khoản. Máy tính công cộng có thể dùng trong một giờ.",
        en: "I will help activate the account. The public computer can be used for one hour.",
      },
      {
        speaker: "Pengunjung",
        text: "Kalau buku yang saya cari belum tersedia, bisa reservasi?",
        vi: "Nếu sách tôi tìm chưa có sẵn, có thể đặt trước không?",
        en: "If the book I am looking for is not available yet, can I reserve it?",
      },
    ],
    exercises: [
      {
        type: "translation_id",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn làm thẻ thành viên thư viện.",
        prompt_en: "Translate into Indonesian: I want to get a library membership card.",
        answer: "Saya ingin membuat kartu anggota perpustakaan.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ đúng: Komputer umum hanya ___ dipakai selama satu jam.",
        prompt_en: "Fill in the correct word: Komputer umum hanya ___ dipakai selama satu jam.",
        answer: "boleh",
        explanation_vi: "`Boleh` nói về quyền/cho phép theo quy định thư viện.",
        explanation_en: "`Boleh` expresses permission under library rules.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào tự nhiên nhất để nói 'reserve a book'?",
        prompt_en: "Which phrase is most natural for 'reserve a book'?",
        choices: ["reservasi buku", "pesan membaca", "booking halaman", "ambil internet"],
        answer: "reservasi buku",
      },
      {
        type: "mini_dialogue",
        prompt_vi: "Viết 2 câu hỏi lịch sự ở quầy thư viện: một câu về e-book và một câu về komputer umum.",
        prompt_en: "Write two polite questions at the library desk: one about e-books and one about public computers.",
        sample_answer:
          "Apakah kartu anggota ini bisa dipakai untuk meminjam e-book? Komputer umum masih tersedia?",
      },
    ],
  },
];
