// Tech Support Password Recovery Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for account recovery: forgotten passwords,
// email verification, OTP codes, security checks, login again, new devices, and
// asking tech support for help. Indonesian target text lives in `en`,
// Vietnamese glosses in `vi`, Vietnamese L1 notes in `pronunciation_focus`,
// and English companions in `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech. */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
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

export const techSupportPasswordRecoveryLessons: IndonesianLesson[] = [
  {
    id: "indonesian_tech_support_password_recovery",
    level: "B1",
    category: "technology_support",
    title_vi: "Khôi phục password và truy cập tài khoản",
    title_en: "Password recovery and account access",
    sentences: [
      {
        en: "Saya lupa password akun saya.",
        vi: "Tôi quên mật khẩu tài khoản của tôi.",
        pronunciation_focus: [
          "lu-pa PASS-word / ka-ta SAN-di - `lupa password` = quên mật khẩu; `kata sandi` là từ Indonesia tự nhiên hơn.",
          "Lỗi người Việt: nói `lupa sandi` vẫn hiểu, nhưng trong hỗ trợ kỹ thuật thường nghe `password` hoặc `kata sandi`.",
          "Luyện: `Saya lupa password akun saya.`",
        ],
        pronunciation_focus_en: [
          "LOO-pah PASS-word / KA-tah SAN-dee - `lupa password` = forgot the password; `kata sandi` is the natural Indonesian term.",
          "VN-speaker trap: `lupa sandi` may be understood, but support staff often say `password` or `kata sandi`.",
          "Drill: `Saya lupa password akun saya.`",
        ],
      },
      {
        en: "Saya mau reset akun ini.",
        vi: "Tôi muốn đặt lại tài khoản này.",
        pronunciation_focus: [
          "RE-set A-kun - `reset akun` = đặt lại tài khoản; thường dùng khi quên mật khẩu.",
          "`mau` = muốn; ngắn gọn và tự nhiên trong chat hỗ trợ.",
          "Lỗi người Việt: nói `re-set` kiểu tiếng Anh rất nặng. Trong câu Indonesia vẫn hiểu, nhưng đọc nhẹ và đều sẽ tự nhiên hơn.",
          "Luyện: `Saya mau reset akun ini.`",
        ],
        pronunciation_focus_en: [
          "REH-set AH-koon - `reset akun` = reset the account; common when you forget a password.",
          "`mau` = want; short and natural in support chat.",
          "VN-speaker trap: over-English `re-set`. It is understood, but a lighter, even pronunciation sounds more natural.",
          "Drill: `Saya mau reset akun ini.`",
        ],
      },
      {
        en: "Bisa kirim verifikasi email ke alamat yang lama?",
        vi: "Có thể gửi xác minh email đến địa chỉ cũ không?",
        pronunciation_focus: [
          "ve-ri-fi-KA-si E-mail - `verifikasi email` = xác minh email.",
          "`alamat yang lama` = địa chỉ cũ; `yang` nối cụm danh từ rất tự nhiên.",
          "Lỗi người Việt: dùng `konfirmasi email` cũng hiểu, nhưng khi đăng nhập lại, `verifikasi email` rõ hơn.",
          "Luyện: `Kirim verifikasi email, ya.`",
        ],
        pronunciation_focus_en: [
          "veh-ree-fee-KA-see EE-mail - `verifikasi email` = email verification.",
          "`alamat yang lama` = the old address; `yang` naturally links the noun phrase.",
          "VN-speaker trap: `konfirmasi email` can work, but for login recovery `verifikasi email` is clearer.",
          "Drill: `Kirim verifikasi email, ya.`",
        ],
      },
      {
        en: "Kode OTP saya belum masuk.",
        vi: "Mã OTP của tôi vẫn chưa vào tới.",
        pronunciation_focus: [
          "KO-de o-te-pe - `kode OTP` = mã xác minh một lần; thường đọc từng chữ hoặc theo tiếng Anh.",
          "`belum masuk` = chưa tới/chưa vào; dùng khi chờ tin nhắn hoặc email.",
          "Lỗi người Việt: nói `belum datang` với mã OTP. Mã không `đến` như người; `masuk` tự nhiên hơn.",
          "Luyện: `Kode OTP belum masuk.`",
        ],
        pronunciation_focus_en: [
          "KO-deh OH-tee-PEE - `kode OTP` = one-time verification code; often read letter by letter or in English style.",
          "`belum masuk` = has not come in yet; used when waiting for SMS or email.",
          "VN-speaker trap: `belum datang` for an OTP code. A code does not really 'come'; `masuk` is more natural.",
          "Drill: `Kode OTP belum masuk.`",
        ],
      },
      {
        en: "Silakan cek folder spam atau junk.",
        vi: "Hãy kiểm tra thư mục spam hoặc junk.",
        pronunciation_focus: [
          "si-la-KAN cek - `silakan` = xin hãy; lịch sự khi hướng dẫn.",
          "`folder spam` và `junk` là từ mượn rất phổ biến trong hỗ trợ email.",
          "Lỗi người Việt: hỏi `spam folder ada?` không tự nhiên. Câu đúng là `cek folder spam`.",
          "Luyện: `Silakan cek folder spam.`",
        ],
        pronunciation_focus_en: [
          "see-lah-KAN chek - `silakan` = please/go ahead; polite guidance.",
          "`folder spam` and `junk` are common loanwords in email support.",
          "VN-speaker trap: `spam folder ada?` sounds unnatural. Use `cek folder spam`.",
          "Drill: `Silakan cek folder spam.`",
        ],
      },
      {
        en: "Saya login dari perangkat baru hari ini.",
        vi: "Hôm nay tôi đăng nhập từ thiết bị mới.",
        pronunciation_focus: [
          "LO-gin da-ri pe-RANG-kat BA-ru - `login` = đăng nhập; `perangkat baru` = thiết bị mới.",
          "`dari` = từ; dipakai untuk sumber/nguồn đăng nhập.",
          "Lỗi người Việt: nói `masuk akun` vẫn hiểu, nhưng `login` là từ kỹ thuật phổ biến trong app.",
          "Luyện: `Saya login dari perangkat baru.`",
        ],
        pronunciation_focus_en: [
          "LO-gin da-ree pe-RANG-kat BA-roo - `login` = log in; `perangkat baru` = new device.",
          "`dari` = from; used for the source of the login.",
          "VN-speaker trap: `masuk akun` is understood, but `login` is common technical wording in apps.",
          "Drill: `Saya login dari perangkat baru.`",
        ],
      },
      {
        en: "Apakah akun saya aman setelah reset password?",
        vi: "Sau khi đặt lại mật khẩu thì tài khoản của tôi có an toàn không?",
        pronunciation_focus: [
          "A-kun SA-ya A-man se-TE-lah RE-set PASS-word - `aman` = an toàn; `setelah` = sau khi.",
          "`setelah reset password` dùng rất tự nhiên trong hỗ trợ tài khoản.",
          "Lỗi người Việt: hỏi `sudah aman?` quá ngắn nếu muốn kiểm tra trạng thái sau thao tác.",
          "Luyện: `Apakah akun saya aman?`",
        ],
        pronunciation_focus_en: [
          "AH-koon SA-yah AH-mahn seh-TEH-lah REH-set PASS-word - `aman` = safe; `setelah` = after.",
          "`setelah reset password` is natural support wording.",
          "VN-speaker trap: asking only `sudah aman?` can be too vague for a status check after a reset.",
          "Drill: `Apakah akun saya aman?`",
        ],
      },
      {
        en: "Saya perlu bantuan teknis untuk masuk lagi.",
        vi: "Tôi cần hỗ trợ kỹ thuật để đăng nhập lại.",
        pronunciation_focus: [
          "ban-TU-an TEK-nis - `bantuan teknis` = hỗ trợ kỹ thuật.",
          "`masuk lagi` = vào lại/đăng nhập lại; câu ngắn tự nhiên trong chat hỗ trợ.",
          "Lỗi người Việt: dịch `technical help` thành `help teknikal`. Từ chuẩn là `bantuan teknis`.",
          "Luyện: `Saya perlu bantuan teknis.`",
        ],
        pronunciation_focus_en: [
          "bahn-TOO-ahn TEK-nees - `bantuan teknis` = technical support.",
          "`masuk lagi` = log in again; a short natural support-chat phrase.",
          "VN-speaker trap: translating `technical help` as `help teknikal`. The standard phrase is `bantuan teknis`.",
          "Drill: `Saya perlu bantuan teknis.`",
        ],
      },
      {
        en: "Tolong keluarkan semua sesi dari perangkat lama.",
        vi: "Làm ơn đăng xuất hết tất cả phiên khỏi thiết bị cũ.",
        pronunciation_focus: [
          "KE-lu-ar-kan se-MU-a SE-si - `keluarkan` = xuất/thoát ra; `sesi` = phiên đăng nhập.",
          "`dari perangkat lama` = khỏi thiết bị cũ; câu này rất quan trọng khi thiết bị bị mất.",
          "Lỗi người Việt: nói `hapus akun` quá nặng nếu chỉ muốn đăng xuất. `Keluarkan sesi` đúng hơn.",
          "Luyện: `Tolong keluarkan semua sesi.`",
        ],
        pronunciation_focus_en: [
          "keh-loo-AR-kan seh-MOO-ah SEH-see - `keluarkan` = remove/log out; `sesi` = session.",
          "`dari perangkat lama` = from the old device; important if the device is lost.",
          "VN-speaker trap: saying `hapus akun` when you only want to log out. `Keluarkan sesi` is more precise.",
          "Drill: `Tolong keluarkan semua sesi.`",
        ],
      },
      {
        en: "Saya akan ganti kata sandi setelah login ulang berhasil.",
        vi: "Tôi sẽ đổi mật khẩu sau khi đăng nhập lại thành công.",
        pronunciation_focus: [
          "ka-ta SAN-di - `kata sandi` = mật khẩu; từ Indonesia tự nhiên và trang trọng.",
          "`login ulang` = đăng nhập lại; `berhasil` = thành công.",
          "Lỗi người Việt: dùng `password baru` trong mọi ngữ cảnh. `Kata sandi` nghe chuẩn hơn trong hướng dẫn.",
          "Luyện: `Saya akan ganti kata sandi.`",
        ],
        pronunciation_focus_en: [
          "KA-tah SAN-dee - `kata sandi` = password; the natural Indonesian term for guidance.",
          "`login ulang` = log in again; `berhasil` = successful.",
          "VN-speaker trap: using `password baru` in every context. `Kata sandi` sounds more standard in instructions.",
          "Drill: `Saya akan ganti kata sandi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong hỗ trợ kỹ thuật ở Indonesia, người dùng thường nói ngắn và nêu đúng lỗi: `lupa password`, `kode OTP belum masuk`, `akun aman tidak`, `login dari perangkat baru`, `reset akun`. Từ `kata sandi`, `verifikasi`, `sesi`, `perangkat`, `bantuan teknis` rất tự nhiên trong email, chat, và help center. Khi nghi vấn bảo mật, người ta thường yêu cầu keluar dari semua sesi rồi ganti kata sandi.",
    cultural_notes_en:
      "In Indonesian tech support, users usually speak briefly and state the exact issue: `lupa password`, `kode OTP belum masuk`, `akun aman tidak`, `login dari perangkat baru`, `reset akun`. Terms like `kata sandi`, `verifikasi`, `sesi`, `perangkat`, and `bantuan teknis` are natural in email, chat, and help centers. When security is in question, people often ask to log out of all sessions and then change the password.",
    tip_advice_vi:
      "Mẫu câu hữu ích: `Saya lupa password`, `Kode OTP belum masuk`, `Saya perlu bantuan teknis`, `Tolong keluarkan semua sesi`, `Saya akan ganti kata sandi`. Với hỗ trợ tài khoản, `silakan` và `tolong` giữ câu lịch sự; `belum` dùng khi bạn vẫn đang chờ.",
    tip_advice_en:
      "Useful patterns: `Saya lupa password`, `Kode OTP belum masuk`, `Saya perlu bantuan teknis`, `Tolong keluarkan semua sesi`, `Saya akan ganti kata sandi`. In account support, `silakan` and `tolong` keep the tone polite; `belum` is for something you are still waiting on.",
    vocabulary: [
      {
        cell_id: "7196f763-e305-4e01-8bd7-ec468c77328e",
        word: "kata sandi",
        en: "password",
        vi: "mật khẩu",
        pos: "noun phrase",
        pronunciation_vi: "ka-ta SAN-di",
        pronunciation_en: "KA-tah SAN-dee",
      },
      {
        cell_id: "3d3b1c12-2b0c-443f-8839-7b53cde080b7",
        word: "reset akun",
        en: "reset account",
        vi: "đặt lại tài khoản",
        pos: "verb phrase",
        pronunciation_vi: "RE-set A-kun",
        pronunciation_en: "REH-set AH-koon",
      },
      {
        cell_id: "ffccb812-6cd0-4c8a-8cc6-62a8931c946c",
        word: "verifikasi email",
        en: "email verification",
        vi: "xác minh email",
        pos: "noun phrase",
        pronunciation_vi: "ve-ri-fi-KA-si E-mail",
        pronunciation_en: "veh-ree-fee-KA-see EE-mail",
      },
      {
        cell_id: "3f1282c2-34c9-4e34-8ceb-393644bbd903",
        word: "kode OTP",
        en: "OTP code",
        vi: "mã OTP",
        pos: "noun phrase",
        pronunciation_vi: "KO-de o-te-pe",
        pronunciation_en: "KO-de OH-tee-PEE",
      },
      {
        cell_id: "d7082eba-2b1a-4c67-bfd7-0c62a27de171",
        word: "keamanan akun",
        en: "account security",
        vi: "bảo mật tài khoản",
        pos: "noun phrase",
        pronunciation_vi: "ke-a-MA-nan A-kun",
        pronunciation_en: "keh-ah-MAH-nahn AH-koon",
      },
      {
        cell_id: "7c684bef-8a70-4001-87f5-a3345a4365b9",
        word: "bantuan teknis",
        en: "technical support",
        vi: "hỗ trợ kỹ thuật",
        pos: "noun phrase",
        pronunciation_vi: "ban-TU-an TEK-nis",
        pronunciation_en: "bahn-TOO-ahn TEK-nees",
      },
      {
        cell_id: "76846834-bd01-401e-bbff-fee136303b62",
        word: "login ulang",
        en: "log in again",
        vi: "đăng nhập lại",
        pos: "verb phrase",
        pronunciation_vi: "LO-gin U-lang",
        pronunciation_en: "LOH-gin OO-lang",
      },
      {
        cell_id: "ae1d6a0b-5d1b-429b-a5c2-fcf14759c741",
        word: "perangkat baru",
        en: "new device",
        vi: "thiết bị mới",
        pos: "noun phrase",
        pronunciation_vi: "pe-RANG-kat BA-ru",
        pronunciation_en: "peh-RANG-kat BAH-roo",
      },
      {
        cell_id: "e3d350e7-a748-4de4-b53e-8f6e73b0005a",
        word: "sesi",
        en: "session",
        vi: "phiên",
        pos: "noun",
        pronunciation_vi: "SE-si",
        pronunciation_en: "SEH-see",
      },
      {
        cell_id: "a95c85af-24bc-4b0e-99dc-a916825df9a7",
        word: "silakan",
        en: "please / go ahead",
        vi: "xin hãy / cứ tự nhiên",
        pos: "particle",
        pronunciation_vi: "si-la-KAN",
        pronunciation_en: "see-lah-KAN",
      },
    ],
    dialogue: [
      {
        cell_id: "bcfa50d3-5aea-429d-b4fc-a99be2b3deba",
        speaker: "Pengguna",
        text: "Halo, saya lupa password akun saya.",
        vi: "Xin chào, tôi quên mật khẩu tài khoản của tôi.",
        en: "Hello, I forgot my account password.",
      },
      {
        cell_id: "8932e5d0-5255-4934-b8ca-94d21cf81926",
        speaker: "CS",
        text: "Baik, silakan cek email Anda untuk verifikasi.",
        vi: "Vâng, vui lòng kiểm tra email của bạn để xác minh.",
        en: "Okay, please check your email for verification.",
      },
      {
        cell_id: "809278e3-3b3e-4948-9406-bc16e2de61fc",
        speaker: "Pengguna",
        text: "Kode OTP saya belum masuk.",
        vi: "Mã OTP của tôi vẫn chưa vào tới.",
        en: "My OTP code has not arrived yet.",
      },
      {
        cell_id: "1961009a-5616-4631-ac9c-e7dec189fb19",
        speaker: "CS",
        text: "Mohon cek folder spam atau coba login ulang dari perangkat baru.",
        vi: "Xin kiểm tra thư mục spam hoặc thử đăng nhập lại từ thiết bị mới.",
        en: "Please check the spam folder or try logging in again from a new device.",
      },
      {
        cell_id: "7907ceea-ae82-4cd0-8b92-7569063a0df2",
        speaker: "Pengguna",
        text: "Bisa bantu reset akun dan keluarkan semua sesi?",
        vi: "Có thể giúp đặt lại tài khoản và đăng xuất hết tất cả phiên không?",
        en: "Can you help reset the account and log out all sessions?",
      },
      {
        cell_id: "b83addb7-0339-4696-990b-be9732822fcd",
        speaker: "CS",
        text: "Bisa. Setelah itu, saya sarankan ganti kata sandi dan aktifkan keamanan akun.",
        vi: "Được. Sau đó, tôi khuyên anh/chị đổi mật khẩu và bật bảo mật tài khoản.",
        en: "Yes. After that, I recommend changing the password and enabling account security.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Translate into Indonesian: Tôi quên mật khẩu tài khoản của tôi.",
        answer: "Saya lupa password akun saya.",
      },
      {
        type: "translation",
        prompt: "Translate into Vietnamese: Saya perlu bantuan teknis untuk masuk lagi.",
        answer: "Tôi cần hỗ trợ kỹ thuật để đăng nhập lại.",
      },
      {
        type: "fill_blank",
        prompt: "Kode ____ saya belum masuk.",
        answer: "OTP",
      },
      {
        type: "fill_blank",
        prompt: "Tolong keluarkan semua ____ dari perangkat lama.",
        answer: "sesi",
      },
      {
        type: "matching",
        prompt: "Match the Indonesian phrase to the meaning.",
        pairs: [
          ["kata sandi", "password / mật khẩu"],
          ["verifikasi email", "email verification / xác minh email"],
          ["bantuan teknis", "technical support / hỗ trợ kỹ thuật"],
          ["login ulang", "log in again / đăng nhập lại"],
        ],
      },
    ],
  },
];

export default techSupportPasswordRecoveryLessons;
