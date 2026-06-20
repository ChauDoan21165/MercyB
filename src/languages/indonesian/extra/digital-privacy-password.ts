type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation?: string;
  pronunciation_vi?: string;
};

type VocabEntry = {
  word: string;
  meaning_vi: string;
  meaning_en: string;
  example: string;
  example_vi: string;
};

type DialogueLine = {
  speaker: string;
  line: string;
  vi: string;
  en: string;
};

type Exercise = {
  type: 'fill_blank' | 'translate' | 'choice' | 'roleplay';
  prompt: string;
  answer: string;
  explanation_vi: string;
  explanation_en: string;
};

type IndonesianCefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

type IndonesianLesson = {
  id: string;
  title: string;
  level: IndonesianCefrLevel;
  topic: string;
  vietnamese_title: string;
  english_title: string;
  pronunciation_focus: string[];
  pronunciation_focus_en: string[];
  sentences: IndonesianLessonSentence[];
  vocabulary: VocabEntry[];
  dialogue: DialogueLine[];
  cultural_notes_vi: string[];
  cultural_notes_en: string[];
  tip_advice_vi: string[];
  tip_advice_en: string[];
  exercises: Exercise[];
};

export const lessons: IndonesianLesson[] = [
  {
    id: 'digital-privacy-password',
    title: 'Privasi digital dan keamanan akun',
    level: 'B1',
    topic: 'passwords, two-step verification, personal data, leaked accounts, fake emails, online privacy, account security',
    vietnamese_title: 'Quyền riêng tư số và bảo mật tài khoản',
    english_title: 'Digital Privacy and Passwords',
    pronunciation_focus: [
      'Kata sandi nghĩa là mật khẩu. Password cũng được hiểu, nhưng kata sandi tự nhiên hơn trong hướng dẫn resmi.',
      'Verifikasi dua langkah nghĩa là xác minh hai bước. Dua langkah là "hai bước", không phải "hai lần".',
      'Data pribadi là dữ liệu cá nhân. Pribadi đọc pri-BA-di và dùng nhiều trong cảnh báo privasi online.',
      'Akun bocor nghĩa là tài khoản bị rò rỉ/lộ dữ liệu. Bocor nghĩa gốc là "rò", rất tự nhiên cho data leak.',
      'Email palsu là email giả/mạo. Palsu khác salah: palsu = giả, salah = sai.',
      'Keamanan akun nghĩa là bảo mật tài khoản. Keamanan đến từ aman, nghĩa là an toàn.',
    ],
    pronunciation_focus_en: [
      'Kata sandi means password. Password is understood, but kata sandi is more natural in official guidance.',
      'Verifikasi dua langkah means two-step verification. Dua langkah means "two steps," not "twice."',
      'Data pribadi means personal data. Pribadi is pronounced pri-BA-di and is common in online privacy warnings.',
      'Akun bocor means an account or its data has leaked. Bocor literally means leaking and is natural for data leaks.',
      'Email palsu means fake or spoofed email. Palsu means fake, while salah means wrong.',
      'Keamanan akun means account security. Keamanan comes from aman, meaning safe or secure.',
    ],
    sentences: [
      {
        en: 'Saya perlu mengganti kata sandi akun saya.',
        vi: 'Tôi cần đổi mật khẩu tài khoản của tôi.',
        pronunciation: 'SA-ya PER-lu meng-GAN-ti KA-ta SAN-di A-kun SA-ya',
      },
      {
        en: 'Aktifkan verifikasi dua langkah untuk keamanan akun.',
        vi: 'Hãy bật xác minh hai bước để bảo mật tài khoản.',
        pronunciation: 'ak-TIF-kan ve-ri-fi-KA-si DU-a LANG-kah UN-tuk ke-a-MA-nan A-kun',
      },
      {
        en: 'Jangan bagikan data pribadi kepada orang yang tidak dikenal.',
        vi: 'Đừng chia sẻ dữ liệu cá nhân cho người không quen biết.',
        pronunciation: 'JA-ngan ba-GI-kan DA-ta pri-BA-di ke-PA-da O-rang yang TI-dak di-ke-NAL',
      },
      {
        en: 'Saya menerima email palsu yang meminta kode OTP.',
        vi: 'Tôi nhận được email giả yêu cầu mã OTP.',
        pronunciation: 'SA-ya me-ne-RI-ma E-mail PAL-su yang me-MIN-ta KO-de o-te-pe',
      },
      {
        en: 'Sepertinya akun saya bocor karena ada login dari perangkat asing.',
        vi: 'Có vẻ tài khoản của tôi bị lộ vì có đăng nhập từ thiết bị lạ.',
        pronunciation: 'se-PER-ti-nya A-kun SA-ya BO-cor ka-RE-na A-da LO-gin DA-ri pe-RANG-kat A-sing',
      },
      {
        en: 'Saya mau cek pengaturan privasi online.',
        vi: 'Tôi muốn kiểm tra cài đặt quyền riêng tư online.',
        pronunciation: 'SA-ya mau cek pe-nga-TUR-an pri-VA-si ON-lain',
      },
      {
        en: 'Tolong keluar dari semua perangkat.',
        vi: 'Vui lòng đăng xuất khỏi tất cả thiết bị.',
        pronunciation: 'TO-long KE-lu-ar DA-ri se-MU-a pe-RANG-kat',
      },
      {
        en: 'Kalau ada aktivitas mencurigakan, segera laporkan ke layanan resmi.',
        vi: 'Nếu có hoạt động đáng ngờ, hãy báo ngay cho dịch vụ chính thức.',
        pronunciation: 'KA-lau A-da ak-ti-vi-TAS men-cu-ri-GA-kan se-GE-ra la-POR-kan ke la-YA-nan res-MI',
      },
    ],
    vocabulary: [
      {
        word: 'kata sandi',
        meaning_vi: 'mật khẩu',
        meaning_en: 'password',
        example: 'Kata sandi saya harus diganti sekarang.',
        example_vi: 'Mật khẩu của tôi phải được đổi ngay bây giờ.',
      },
      {
        word: 'verifikasi dua langkah',
        meaning_vi: 'xác minh hai bước',
        meaning_en: 'two-step verification',
        example: 'Verifikasi dua langkah membuat akun lebih aman.',
        example_vi: 'Xác minh hai bước làm tài khoản an toàn hơn.',
      },
      {
        word: 'data pribadi',
        meaning_vi: 'dữ liệu cá nhân',
        meaning_en: 'personal data',
        example: 'Jangan kirim data pribadi lewat chat umum.',
        example_vi: 'Đừng gửi dữ liệu cá nhân qua chat công khai/chung.',
      },
      {
        word: 'akun bocor',
        meaning_vi: 'tài khoản bị rò rỉ/lộ dữ liệu',
        meaning_en: 'leaked account or compromised account data',
        example: 'Saya khawatir akun saya bocor.',
        example_vi: 'Tôi lo tài khoản của tôi bị lộ dữ liệu.',
      },
      {
        word: 'email palsu',
        meaning_vi: 'email giả/mạo',
        meaning_en: 'fake or spoofed email',
        example: 'Email palsu itu terlihat seperti email resmi.',
        example_vi: 'Email giả đó trông giống email chính thức.',
      },
      {
        word: 'privasi online',
        meaning_vi: 'quyền riêng tư online',
        meaning_en: 'online privacy',
        example: 'Saya ingin memperbaiki privasi online saya.',
        example_vi: 'Tôi muốn cải thiện quyền riêng tư online của tôi.',
      },
      {
        word: 'keamanan akun',
        meaning_vi: 'bảo mật tài khoản',
        meaning_en: 'account security',
        example: 'Keamanan akun penting untuk mencegah penipuan.',
        example_vi: 'Bảo mật tài khoản quan trọng để ngăn lừa lừa đảo.',
      },
      {
        word: 'perangkat asing',
        meaning_vi: 'thiết bị lạ',
        meaning_en: 'unknown device',
        example: 'Ada login dari perangkat asing tadi malam.',
        example_vi: 'Tối qua có đăng nhập từ thiết bị lạ.',
      },
    ],
    dialogue: [
      {
        speaker: 'Pengguna',
        line: 'Halo, saya menerima email palsu yang meminta kode OTP.',
        vi: 'Xin chào, tôi nhận được email giả yêu cầu mã OTP.',
        en: 'Hello, I received a fake email asking for an OTP code.',
      },
      {
        speaker: 'Customer Service',
        line: 'Jangan bagikan kode OTP atau kata sandi kepada siapa pun.',
        vi: 'Đừng chia sẻ mã OTP hoặc mật khẩu cho bất kỳ ai.',
        en: 'Do not share the OTP code or password with anyone.',
      },
      {
        speaker: 'Pengguna',
        line: 'Sepertinya akun saya bocor. Ada login dari perangkat asing.',
        vi: 'Có vẻ tài khoản của tôi bị lộ. Có đăng nhập từ thiết bị lạ.',
        en: 'It seems my account has been compromised. There is a login from an unknown device.',
      },
      {
        speaker: 'Customer Service',
        line: 'Silakan ganti kata sandi dan aktifkan verifikasi dua langkah.',
        vi: 'Vui lòng đổi mật khẩu và bật xác minh hai bước.',
        en: 'Please change your password and enable two-step verification.',
      },
      {
        speaker: 'Pengguna',
        line: 'Bisa bantu keluar dari semua perangkat?',
        vi: 'Có thể giúp đăng xuất khỏi tất cả thiết bị không?',
        en: 'Can you help log out from all devices?',
      },
      {
        speaker: 'Customer Service',
        line: 'Bisa. Setelah itu, cek lagi pengaturan privasi online Anda.',
        vi: 'Có thể. Sau đó, hãy kiểm tra lại cài đặt quyền riêng tư online của bạn.',
        en: 'Yes. After that, check your online privacy settings again.',
      },
    ],
    cultural_notes_vi: [
      'Ở Indonesia, hướng dẫn bảo mật thường dùng kata sandi cho mật khẩu, akun cho tài khoản app/mạng xã hội, và rekening cho tài khoản ngân hàng.',
      'Không chia sẻ OTP, PIN, kata sandi, NIK, ảnh KTP, hoặc data pribadi qua link/chat không rõ nguồn gốc.',
      'Email palsu hoặc pesan palsu thường mengatasnamakan bank, kurir, marketplace, hoặc kantor pemerintah. Khi ragu, hubungi layanan resmi lewat aplikasi hoặc website resmi.',
      'Nếu thấy login từ perangkat asing, langkah aman là ganti kata sandi, aktifkan verifikasi dua langkah, keluar dari semua perangkat, rồi simpan bukti seperti tangkapan layar.',
    ],
    cultural_notes_en: [
      'In Indonesia, security guidance often uses kata sandi for password, akun for app/social media accounts, and rekening for bank accounts.',
      'Do not share OTP, PIN, passwords, NIK, KTP photos, or personal data through unclear links or chats.',
      'Fake emails or messages often impersonate banks, couriers, marketplaces, or government offices. When unsure, contact official support through the official app or website.',
      'If you see a login from an unknown device, safe steps are to change the password, enable two-step verification, log out from all devices, and keep evidence such as screenshots.',
    ],
    tip_advice_vi: [
      'Câu cảnh báo nên nhớ: Jangan bagikan kata sandi kepada siapa pun. Nghĩa là đừng chia sẻ mật khẩu cho bất kỳ ai.',
      'Khi báo sự cố, nói rõ: akun saya bocor, ada login dari perangkat asing, atau saya menerima email palsu.',
      'Untuk bảo mật tài khoản, cụm hành động quan trọng là ganti kata sandi, aktifkan verifikasi dua langkah, dan keluar dari semua perangkat.',
      'Data pribadi là cụm chuẩn cho thông tin cá nhân. Đừng dùng data private trong câu tiếng Indonesia trang trọng.',
    ],
    tip_advice_en: [
      'Memorize this warning: Jangan bagikan kata sandi kepada siapa pun. It means do not share your password with anyone.',
      'When reporting a problem, be specific: akun saya bocor, ada login dari perangkat asing, or saya menerima email palsu.',
      'For account security, key action phrases are ganti kata sandi, aktifkan verifikasi dua langkah, and keluar dari semua perangkat.',
      'Data pribadi is the standard phrase for personal information. Avoid data private in formal Indonesian.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Aktifkan verifikasi dua ____ untuk keamanan akun.',
        answer: 'langkah',
        explanation_vi: 'Cụm đúng là verifikasi dua langkah, nghĩa là xác minh hai bước.',
        explanation_en: 'The correct phrase is verifikasi dua langkah, meaning two-step verification.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “fake email”?',
        answer: 'email palsu',
        explanation_vi: 'Palsu nghĩa là giả/mạo. Salah chỉ nghĩa là sai.',
        explanation_en: 'Palsu means fake or forged. Salah only means wrong.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: Do not share personal data with anyone.',
        answer: 'Jangan bagikan data pribadi kepada siapa pun.',
        explanation_vi: 'Jangan dùng cho câu cấm; data pribadi là dữ liệu cá nhân; siapa pun là bất kỳ ai.',
        explanation_en: 'Jangan is used for prohibitions; data pribadi means personal data; siapa pun means anyone at all.',
      },
      {
        type: 'roleplay',
        prompt: 'Tell customer service that your account may have leaked and there is a login from an unknown device.',
        answer: 'Sepertinya akun saya bocor. Ada login dari perangkat asing.',
        explanation_vi: 'Sepertinya làm câu mềm hơn: "có vẻ". Akun bocor là tài khoản bị lộ/rò rỉ, perangkat asing là thiết bị lạ.',
        explanation_en: 'Sepertinya softens the report: "it seems." Akun bocor means leaked/compromised account, and perangkat asing means unknown device.',
      },
    ],
  },
];
