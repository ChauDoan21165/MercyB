// Office IT Support Indonesian (Vietnamese -> Indonesian study track).
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

type IndonesianExercise = Record<string, any>;

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

export const officeItSupportLessons: IndonesianLesson[] = [
  {
    id: "indonesian_office_it_support",
    level: "B1",
    category: "work_technology",
    title_vi: "Hỗ trợ IT văn phòng: laptop, password, printer và tiket IT",
    title_en: "Office IT support: laptop, password, printer and IT tickets",
    sentences: [
      {
        en: "Laptop kantor saya tidak bisa menyala sejak pagi.",
        vi: "Laptop công ty của tôi không bật lên được từ sáng.",
        pronunciation_focus: [
          "`laptop kantor` = laptop công ty/văn phòng; `kantor` đứng sau danh từ để chỉ của công ty.",
          "`tidak bisa menyala` = không bật/sáng lên được; dùng cho laptop, monitor, lampu.",
          "Lỗi người Việt: nói `laptop saya mati` được, nhưng khi báo IT nên thêm hành vi cụ thể: `tidak bisa menyala`.",
        ],
        pronunciation_focus_en: [
          "`laptop kantor` means office/company laptop; `kantor` follows the noun to mark office/company use.",
          "`tidak bisa menyala` means cannot turn on/light up; use it for laptops, monitors, or lights.",
          "VN-speaker trap: `laptop saya mati` is understood, but for IT reports add the exact behavior: `tidak bisa menyala`.",
        ],
      },
      {
        en: "Saya lupa password email kantor.",
        vi: "Tôi quên mật khẩu email công ty.",
        pronunciation_focus: [
          "`lupa password` = quên mật khẩu; từ mượn `password` rất phổ biến ở văn phòng.",
          "`email kantor` = email công ty; khác với email pribadi.",
          "Lỗi người Việt: dịch `password` thành `kata sandi` không sai, nhưng trong chat IT hằng ngày `password` nghe tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`lupa password` means forgot the password; the loanword `password` is very common at work.",
          "`email kantor` means office/company email, different from personal email.",
          "VN-speaker note: `kata sandi` is correct, but in daily IT chat `password` often sounds more natural.",
        ],
      },
      {
        en: "Bisa bantu reset password saya?",
        vi: "Có thể giúp đặt lại mật khẩu của tôi không?",
        pronunciation_focus: [
          "`reset password` = đặt lại mật khẩu; từ `reset` thường dùng nguyên dạng.",
          "`bisa bantu ...?` = có thể giúp ... không; mềm và tự nhiên khi nhờ IT.",
          "Lỗi người Việt: nói `buat password baru` khi tài khoản bị khóa. Quy trình IT thường là `reset password`.",
        ],
        pronunciation_focus_en: [
          "`reset password` means reset the password; `reset` is commonly used as a loanword.",
          "`bisa bantu ...?` means can you help ..., a soft natural request to IT.",
          "VN-speaker trap: saying `buat password baru` when an account is locked. IT process language is usually `reset password`.",
        ],
      },
      {
        en: "Printer di lantai tiga bermasalah dan tidak bisa mencetak.",
        vi: "Máy in ở tầng ba bị lỗi và không in được.",
        pronunciation_focus: [
          "`printer bermasalah` = máy in có vấn đề; cụm rộng, dùng khi chưa biết lỗi cụ thể.",
          "`mencetak` = in; trong nói nhanh cũng nghe `print`, nhưng `mencetak` rõ hơn trong laporan.",
          "Lỗi người Việt: dùng `cetak` với âm k. Chữ `c` Indonesia đọc 'ch': men-CHE-tak.",
        ],
        pronunciation_focus_en: [
          "`printer bermasalah` means the printer has a problem; broad enough when the exact issue is unknown.",
          "`mencetak` means to print; casual speech may use `print`, but `mencetak` is clearer in reports.",
          "VN-speaker trap: reading `cetak` with a k sound. Indonesian `c` = 'ch': men-CHE-tak.",
        ],
      },
      {
        en: "Saya sudah membuat tiket IT untuk masalah jaringan lambat.",
        vi: "Tôi đã tạo ticket IT cho vấn đề mạng chậm.",
        pronunciation_focus: [
          "`membuat tiket IT` = tạo ticket/yêu cầu hỗ trợ IT; đọc IT là i-te hoặc ai-ti tùy văn phòng.",
          "`jaringan lambat` = mạng chậm; `jaringan` rộng hơn `Wi-Fi` vì có thể gồm LAN/VPN.",
          "Lỗi người Việt: nói `internet pelan` được hiểu, nhưng trong văn phòng `jaringan lambat` chuyên nghiệp hơn.",
        ],
        pronunciation_focus_en: [
          "`membuat tiket IT` means create an IT support ticket; IT may be read i-te or ai-ti depending on office habit.",
          "`jaringan lambat` means slow network; `jaringan` is broader than Wi-Fi because it may include LAN/VPN.",
          "VN-speaker trap: `internet pelan` is understood, but in an office `jaringan lambat` sounds more professional.",
        ],
      },
      {
        en: "Akses email saya terkunci setelah salah password beberapa kali.",
        vi: "Quyền truy cập email của tôi bị khóa sau khi nhập sai mật khẩu vài lần.",
        pronunciation_focus: [
          "`akses email` = quyền truy cập email; dùng trong ngữ cảnh hệ thống.",
          "`terkunci` = bị khóa; tiền tố `ter-` diễn tả trạng thái đã xảy ra.",
          "Lỗi người Việt: nói `email saya dikunci` nghe như ai đó khóa thủ công. `Terkunci` tự nhiên hơn cho trạng thái hệ thống.",
        ],
        pronunciation_focus_en: [
          "`akses email` means email access, used in system contexts.",
          "`terkunci` means locked; prefix `ter-` marks a resulting state.",
          "VN-speaker trap: `email saya dikunci` sounds like someone manually locked it. `Terkunci` is more natural for a system state.",
        ],
      },
      {
        en: "Saya perlu instal aplikasi desain di laptop kantor.",
        vi: "Tôi cần cài ứng dụng thiết kế trên laptop công ty.",
        pronunciation_focus: [
          "`instal aplikasi` = cài ứng dụng; cũng viết `install`, nhưng `instal` sering dipakai trong Indonesia.",
          "`aplikasi desain` = ứng dụng thiết kế; tính từ/miêu tả đứng sau danh từ.",
          "Lỗi người Việt: nói `desain aplikasi` có thể hiểu là thiết kế ứng dụng. Phần mềm thiết kế là `aplikasi desain`.",
        ],
        pronunciation_focus_en: [
          "`instal aplikasi` means install an application; `install` is also seen, but `instal` is common in Indonesian.",
          "`aplikasi desain` means design application; the descriptor follows the noun.",
          "VN-speaker trap: `desain aplikasi` may mean designing an app. Design software is `aplikasi desain`.",
        ],
      },
      {
        en: "Apakah saya perlu akses admin untuk instal aplikasi ini?",
        vi: "Tôi có cần quyền admin để cài ứng dụng này không?",
        pronunciation_focus: [
          "`akses admin` = quyền admin; văn phòng thường dùng từ mượn `admin`.",
          "`perlu akses admin` = cần quyền admin; không phải cần người admin trực tiếp.",
          "Lỗi người Việt: hỏi `perlu admin?` quá cụt. Nói rõ `akses admin` để tránh hiểu nhầm.",
        ],
        pronunciation_focus_en: [
          "`akses admin` means admin access; offices commonly use the loanword `admin`.",
          "`perlu akses admin` means need admin privileges, not necessarily need the administrator person.",
          "VN-speaker trap: asking clipped `perlu admin?`. Say `akses admin` clearly to avoid confusion.",
        ],
      },
      {
        en: "Mohon update status tiket saya kalau sudah diproses.",
        vi: "Xin cập nhật trạng thái ticket của tôi nếu đã được xử lý.",
        pronunciation_focus: [
          "`status tiket` = trạng thái ticket; `diproses` = được xử lý.",
          "`mohon update` nghe tự nhiên trong chat công sở; trang trọng hơn có thể nói `mohon diperbarui`.",
          "Lỗi người Việt: dùng `tolong` được, nhưng email/chat công sở với IT thường mềm hơn bằng `mohon`.",
        ],
        pronunciation_focus_en: [
          "`status tiket` means ticket status; `diproses` means processed.",
          "`mohon update` sounds natural in office chat; a more formal version is `mohon diperbarui`.",
          "VN-speaker note: `tolong` works, but office chat/email to IT is often smoother with `mohon`.",
        ],
      },
      {
        en: "Setelah diperbaiki, printer sudah bisa dipakai lagi.",
        vi: "Sau khi được sửa, máy in đã dùng lại được.",
        pronunciation_focus: [
          "`setelah diperbaiki` = sau khi được sửa; bị động `di-` tự nhiên khi nói về thiết bị.",
          "`sudah bisa dipakai lagi` = đã có thể dùng lại; khung báo kết quả rất thực tế.",
          "Lỗi người Việt: nói `sudah baik` cho thiết bị. Với máy móc, nói `sudah bisa dipakai lagi` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "`setelah diperbaiki` means after being fixed; passive `di-` is natural for devices.",
          "`sudah bisa dipakai lagi` means can be used again; a practical result-report frame.",
          "VN-speaker trap: saying `sudah baik` for devices. For machines, `sudah bisa dipakai lagi` is clearer.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở văn phòng Indonesia, hỗ trợ IT thường đi qua `tiket IT` hoặc helpdesk. Khi báo lỗi, nói rõ thiết bị, lokasi, gejala, sejak kapan, và tác động đến công việc: laptop tidak menyala, printer tidak bisa mencetak, jaringan lambat, akses email terkunci. Với vấn đề quyền truy cập hoặc instal aplikasi, công ty có thể yêu cầu persetujuan atasan hoặc akses admin. Không nên gửi password qua chat; yêu cầu reset password qua prosedur IT resmi.",
    cultural_notes_en:
      "In Indonesian offices, IT support often goes through an `IT ticket` or helpdesk. When reporting a problem, state the device, location, symptom, since when it started, and work impact: laptop will not turn on, printer cannot print, network is slow, email access is locked. For access or app installation, the company may require manager approval or admin privileges. Do not send passwords through chat; request password reset through the official IT procedure.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng khung báo lỗi rõ ràng: `Perangkatnya...`, `Masalahnya...`, `Sejak...`, `Saya sudah membuat tiket...`, `Mohon update status...`. Phân biệt `lupa password`, `reset password`, `akses terkunci`, `jaringan lambat`, và `printer bermasalah`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use a clear issue-report frame: `Perangkatnya...`, `Masalahnya...`, `Sejak...`, `Saya sudah membuat tiket...`, `Mohon update status...`. Distinguish `lupa password`, `reset password`, `akses terkunci`, `jaringan lambat`, and `printer bermasalah`.",
    vocabulary: [
      {
        word: "laptop kantor",
        en: "office/company laptop",
        vi: "laptop công ty",
        pos: "noun phrase",
        pronunciation_vi: "LAP-top KAN-tor",
        pronunciation_en: "LAP-top KAN-tor",
      },
      {
        word: "lupa password",
        en: "forgot password",
        vi: "quên mật khẩu",
        pos: "verb phrase",
        pronunciation_vi: "LU-pa PAS-word",
        pronunciation_en: "LOO-pa PASS-word",
      },
      {
        word: "printer bermasalah",
        en: "printer has a problem",
        vi: "máy in bị lỗi",
        pos: "phrase",
        pronunciation_vi: "PRIN-ter ber-ma-SA-lah",
        pronunciation_en: "PRIN-ter ber-ma-SA-lah",
      },
      {
        word: "tiket IT",
        en: "IT ticket",
        vi: "ticket hỗ trợ IT",
        pos: "noun phrase",
        pronunciation_vi: "TI-ket i-TE",
        pronunciation_en: "TEE-ket eye-TEE",
      },
      {
        word: "jaringan lambat",
        en: "slow network",
        vi: "mạng chậm",
        pos: "noun phrase",
        pronunciation_vi: "ja-RI-ngan LAM-bat",
        pronunciation_en: "ja-REE-ngan LAM-bat",
      },
      {
        word: "akses email",
        en: "email access",
        vi: "quyền truy cập email",
        pos: "noun phrase",
        pronunciation_vi: "AK-ses I-mel",
        pronunciation_en: "AK-ses EE-mail",
      },
      {
        word: "instal aplikasi",
        en: "install an application",
        vi: "cài ứng dụng",
        pos: "verb phrase",
        pronunciation_vi: "IN-stal a-pli-KA-si",
        pronunciation_en: "IN-stal ap-lee-KA-see",
      },
      {
        word: "akses admin",
        en: "admin access",
        vi: "quyền admin",
        pos: "noun phrase",
        pronunciation_vi: "AK-ses AD-min",
        pronunciation_en: "AK-ses AD-min",
      },
    ],
    dialogue: [
      {
        speaker: "Karyawan",
        text: "Pagi, saya sudah membuat tiket IT. Laptop kantor saya tidak bisa menyala.",
        vi: "Chào buổi sáng, tôi đã tạo ticket IT. Laptop công ty của tôi không bật lên được.",
        en: "Morning, I have created an IT ticket. My office laptop cannot turn on.",
      },
      {
        speaker: "IT Support",
        text: "Baik. Sejak kapan masalahnya terjadi?",
        vi: "Vâng. Vấn đề xảy ra từ khi nào?",
        en: "Okay. Since when has the issue been happening?",
      },
      {
        speaker: "Karyawan",
        text: "Sejak pagi. Selain itu, akses email saya juga terkunci.",
        vi: "Từ sáng. Ngoài ra, quyền truy cập email của tôi cũng bị khóa.",
        en: "Since this morning. Also, my email access is locked.",
      },
      {
        speaker: "IT Support",
        text: "Kami reset password dulu, lalu cek laptopnya.",
        vi: "Chúng tôi đặt lại mật khẩu trước, rồi kiểm tra laptop.",
        en: "We will reset the password first, then check the laptop.",
      },
      {
        speaker: "Karyawan",
        text: "Terima kasih. Mohon update status tiket saya kalau sudah diproses.",
        vi: "Cảm ơn. Xin cập nhật trạng thái ticket của tôi nếu đã được xử lý.",
        en: "Thank you. Please update my ticket status once it has been processed.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi quên mật khẩu email công ty.",
        prompt_en: "Translate into Indonesian: I forgot my office email password.",
        answer: "Saya lupa password email kantor.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Saya sudah membuat ___ IT untuk masalah jaringan lambat.",
        prompt_en: "Fill in the blank: Saya sudah membuat ___ IT untuk masalah jaringan lambat.",
        answer: "tiket",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Máy in ở tầng ba bị lỗi.",
        prompt_en: "Translate into Indonesian: The printer on the third floor has a problem.",
        answer: "Printer di lantai tiga bermasalah.",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn nhờ IT cài ứng dụng. Hỏi liệu có cần quyền admin không.",
        prompt_en: "You ask IT to install an app. Ask whether admin access is needed.",
        answer: "Apakah saya perlu akses admin untuk instal aplikasi ini?",
      },
    ],
  },
];
