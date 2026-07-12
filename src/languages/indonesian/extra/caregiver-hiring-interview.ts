// Indonesian caregiver hiring interview lesson pack for Vietnamese learners.
//
// Self-contained extra lesson file following the established Indonesian format.
// The `en` field holds TARGET-LANGUAGE Indonesian; `vi` holds the Vietnamese
// gloss. Pronunciation notes include Vietnamese L1 traps plus English companions.

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
};

export const caregiverHiringInterviewLessons: IndonesianLesson[] = [
  {
    id: "indonesian_caregiver_interview_experience",
    level: "B1",
    category: "home_work",
    title_vi: "Phỏng vấn pengasuh: kinh nghiệm và kepercayaan",
    title_en: "Caregiver interview: experience and trust",
    sentences: [
      {
        en: "Kami sedang mencari pengasuh untuk ibu saya.",
        vi: "Chúng tôi đang tìm người chăm sóc cho mẹ tôi.",
        pronunciation_focus: [
          "KA-mi se-DANG men-CA-ri pe-NGA-suh UN-tuk I-bu SA-ya.",
          "`pengasuh` = người chăm sóc; có thể dùng cho trẻ em hoặc người cần hỗ trợ tại nhà.",
          "L1 Việt: đừng dùng `pembantu` cho mọi vai trò. Với chăm sóc cá nhân, `pengasuh` hoặc `perawat` lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "KA-mi se-DANG men-CHA-ri pe-NGA-suh UN-tuk I-bu SA-ya.",
          "`pengasuh` = caregiver; it can refer to care for children or someone needing home support.",
          "VN-speaker trap: do not use `pembantu` for every helper role. For personal care, `pengasuh` or `perawat` is more respectful.",
        ],
      },
      {
        en: "Apakah Ibu punya pengalaman merawat orang lanjut usia?",
        vi: "Cô/chị có kinh nghiệm chăm sóc người cao tuổi không?",
        pronunciation_focus: [
          "a-PA-kah I-bu PU-nya pe-nga-LA-man me-RA-wat O-rang lan-JUT U-si-a.",
          "`pengalaman merawat` = kinh nghiệm chăm sóc; `orang lanjut usia` = người cao tuổi.",
          "L1 Việt: `Ibu` trong phỏng vấn là cách gọi lịch sự cho phụ nữ trưởng thành, không nhất thiết là mẹ.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah I-bu PU-nya pe-nga-LA-man me-RA-wat O-rang lan-JUT U-si-a.",
          "`pengalaman merawat` = caregiving experience; `orang lanjut usia` = elderly person.",
          "VN-speaker note: `Ibu` in an interview is polite address for an adult woman, not necessarily mother.",
        ],
      },
      {
        en: "Tugas hariannya membantu makan, mandi, dan minum obat.",
        vi: "Nhiệm vụ hằng ngày là hỗ trợ ăn, tắm và uống thuốc.",
        pronunciation_focus: [
          "TU-gas ha-ri-AN-nya mem-BAN-tu MA-kan, MAN-di, dan MI-num O-bat.",
          "`tugas harian` = nhiệm vụ hằng ngày; `membantu` = hỗ trợ, không nhất thiết làm thay hoàn toàn.",
          "L1 Việt: tính từ/cụm mô tả đứng sau danh từ: `tugas harian`, không nói `harian tugas`.",
        ],
        pronunciation_focus_en: [
          "TU-gas ha-ree-AN-nya mem-BAN-tu MA-kan, MAN-dee, dan MI-num O-bat.",
          "`tugas harian` = daily duties; `membantu` = help/assist, not necessarily do everything for someone.",
          "VN-speaker note: descriptive words follow nouns: `tugas harian`, not `harian tugas`.",
        ],
      },
      {
        en: "Kami perlu orang yang sabar dan bisa dipercaya.",
        vi: "Chúng tôi cần người kiên nhẫn và đáng tin cậy.",
        pronunciation_focus: [
          "KA-mi per-LU O-rang yang SA-bar dan BI-sa di-per-CA-ya.",
          "`bisa dipercaya` = có thể tin được/đáng tin; từ khóa khi thuê người chăm sóc.",
          "L1 Việt: chữ `c` trong `dipercaya` đọc như 'ch': di-per-CA-ya, không phải /k/.",
        ],
        pronunciation_focus_en: [
          "KA-mi per-LU O-rang yang SA-bar dan BI-sa di-per-CHA-ya.",
          "`bisa dipercaya` = trustworthy; key wording when hiring care help.",
          "VN-speaker trap: Indonesian `c` in `dipercaya` sounds like 'ch': di-per-CHA-ya, not /k/.",
        ],
      },
      {
        en: "Boleh saya hubungi referensi dari pekerjaan sebelumnya?",
        vi: "Tôi có thể liên hệ người tham khảo từ công việc trước đây không?",
        pronunciation_focus: [
          "BO-leh SA-ya hu-BUNG-i re-fe-REN-si da-ri pe-KER-ja-an se-be-LUM-nya.",
          "`referensi` = người/thông tin tham khảo; `pekerjaan sebelumnya` = công việc trước đây.",
          "L1 Việt: `hubungi referensi` = liên hệ người tham khảo. `Hubungi` cần đối tượng trực tiếp.",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya hu-BOONG-i re-fe-REN-si da-ri pe-KER-ja-an se-be-LOOM-nya.",
          "`referensi` = reference; `pekerjaan sebelumnya` = previous job.",
          "VN-speaker note: `hubungi referensi` = contact a reference. `Hubungi` takes a direct object.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi mewawancarai pengasuh di Indonesia, keluarga thường bertanya tentang pengalaman merawat, tugas harian, jadwal, gaji, libur, kemampuan memberi obat, dan referensi. Vì công việc diễn ra trong rumah dan menyangkut anggota keluarga, `kepercayaan` sangat penting. Gunakan bahasa sopan: `Ibu/Bapak`, `boleh saya tanya`, `mohon jelaskan`, dan hindari nada menuduh.",
    cultural_notes_en:
      "When interviewing a caregiver in Indonesia, families often ask about care experience, daily duties, schedule, salary, days off, ability to give medicine, and references. Because the work happens inside the home and concerns a family member, trust is crucial. Use polite language: `Ibu/Bapak`, `boleh saya tanya`, `mohon jelaskan`, and avoid an accusatory tone.",
    tip_advice_vi:
      "Mẫu phỏng vấn an toàn: `Apakah Ibu punya pengalaman...?`, `Tugas hariannya...`, `Kami perlu orang yang...`, `Boleh saya hubungi referensi?`. Người Việt nên phân biệt `pengasuh` (người chăm sóc) với `perawat` (điều dưỡng/người chăm sóc có kỹ năng y tế hơn).",
    tip_advice_en:
      "Safe interview frames: `Apakah Ibu punya pengalaman...?`, `Tugas hariannya...`, `Kami perlu orang yang...`, `Boleh saya hubungi referensi?`. Vietnamese speakers should distinguish `pengasuh` (caregiver) from `perawat` (nurse/caregiver with more medical skill).",
    vocabulary: [
      {
        cell_id: "99a1918f-7726-4c6c-955a-51e55cd0ff21",
        word: "pengasuh",
        en: "caregiver",
        vi: "người chăm sóc",
        pos: "noun",
        pronunciation_vi: "pe-NGA-suh",
        pronunciation_en: "pe-NGA-sooh",
      },
      {
        cell_id: "eae92e0c-4149-4568-915b-903e857aca02",
        word: "wawancara kerja",
        en: "job interview",
        vi: "phỏng vấn việc làm",
        pos: "noun phrase",
        pronunciation_vi: "wa-WAN-ca-ra KER-ja",
        pronunciation_en: "wa-WAN-cha-ra KER-ja",
      },
      {
        cell_id: "7b6bb7b6-4094-4966-9679-1118c3a27f19",
        word: "pengalaman merawat",
        en: "caregiving experience",
        vi: "kinh nghiệm chăm sóc",
        pos: "noun phrase",
        pronunciation_vi: "pe-nga-LA-man me-RA-wat",
        pronunciation_en: "pe-nga-LA-man me-RA-wat",
      },
      {
        cell_id: "ba62b6c9-112a-41ee-87cc-15b2aefc2ab5",
        word: "tugas harian",
        en: "daily duties",
        vi: "nhiệm vụ hằng ngày",
        pos: "noun phrase",
        pronunciation_vi: "TU-gas ha-ri-AN",
        pronunciation_en: "TOO-gas ha-ree-AN",
      },
      {
        cell_id: "eb8e4511-84f0-4637-a2e8-e416b6f6622a",
        word: "referensi",
        en: "reference",
        vi: "người/thông tin tham khảo",
        pos: "noun",
        pronunciation_vi: "re-fe-REN-si",
        pronunciation_en: "re-fe-REN-see",
      },
      {
        cell_id: "0daf0acf-8834-4f02-b445-fc5724958076",
        word: "bisa dipercaya",
        en: "trustworthy",
        vi: "đáng tin cậy",
        pos: "phrase",
        pronunciation_vi: "BI-sa di-per-CA-ya",
        pronunciation_en: "BEE-sa dee-per-CHA-ya",
      },
    ],
    dialogue: [
      {
        cell_id: "f3fd7d9d-6cd8-4eee-a932-e973efd0fecd",
        speaker: "Keluarga",
        text: "Terima kasih sudah datang untuk wawancara kerja.",
        vi: "Cảm ơn cô/chị đã đến phỏng vấn việc làm.",
        en: "Thank you for coming for the job interview.",
      },
      {
        cell_id: "155857e4-810a-4452-a0c8-c863d49884ec",
        speaker: "Calon Pengasuh",
        text: "Sama-sama. Saya pernah merawat nenek selama dua tahun.",
        vi: "Không có gì. Tôi từng chăm sóc bà trong hai năm.",
        en: "You're welcome. I cared for an elderly grandmother for two years.",
      },
      {
        cell_id: "0d81f71a-2b48-454b-be9d-4fb90e8c7368",
        speaker: "Keluarga",
        text: "Apakah kami boleh menghubungi referensi dari pekerjaan sebelumnya?",
        vi: "Chúng tôi có thể liên hệ người tham khảo từ công việc trước đây không?",
        en: "May we contact references from your previous job?",
      },
      {
        cell_id: "94c64e9a-bba0-4846-a301-9ebf141941eb",
        speaker: "Calon Pengasuh",
        text: "Boleh. Saya akan kirim nomor keluarga lama saya.",
        vi: "Được. Tôi sẽ gửi số của gia đình cũ tôi từng làm.",
        en: "Yes. I will send the number of my previous employer family.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về phỏng vấn pengasuh:",
        instruction_en: "Fill in the suitable caregiver interview word:",
        items: [
          {
            prompt: "Kami sedang mencari ___ untuk ibu saya. (người chăm sóc)",
            answer: "pengasuh",
            options: ["pengasuh", "penjual", "penumpang"],
          },
          {
            prompt: "Apakah Ibu punya pengalaman ___ orang lanjut usia? (chăm sóc)",
            answer: "merawat",
            options: ["merawat", "membayar", "menunggu"],
          },
          {
            prompt: "Kami perlu orang yang sabar dan bisa ___. (tin cậy)",
            answer: "dipercaya",
            options: ["dipercaya", "ditutup", "dijual"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chúng tôi đang tìm người chăm sóc cho mẹ tôi.", answer: "Kami sedang mencari pengasuh untuk ibu saya." },
          { prompt: "Cô/chị có kinh nghiệm chăm sóc người cao tuổi không?", answer: "Apakah Ibu punya pengalaman merawat orang lanjut usia?" },
          { prompt: "Tôi có thể liên hệ người tham khảo không?", answer: "Boleh saya hubungi referensi?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_caregiver_schedule_salary_agreement",
    level: "B1",
    category: "home_work",
    title_vi: "Thỏa thuận jadwal, gaji và tugas harian",
    title_en: "Agreeing on schedule, salary, and daily duties",
    sentences: [
      {
        en: "Jadwal kerjanya dari Senin sampai Jumat.",
        vi: "Lịch làm việc là từ thứ Hai đến thứ Sáu.",
        pronunciation_focus: [
          "JAD-wal KER-ja-nya da-ri SE-nin SAM-pai JUM-at.",
          "`dari ... sampai ...` = từ ... đến ...; dùng cho khoảng ngày/giờ.",
          "L1 Việt: đừng nói `di Senin sampai Jumat`; khoảng thời gian cần `dari ... sampai ...`.",
        ],
        pronunciation_focus_en: [
          "JAD-wal KER-ja-nya da-ri SE-nin SAM-pai JUM-at.",
          "`dari ... sampai ...` = from ... to ...; use it for day/time ranges.",
          "VN-speaker trap: do not say `di Senin sampai Jumat`; time spans need `dari ... sampai ...`.",
        ],
      },
      {
        en: "Jam kerja mulai jam tujuh pagi sampai jam lima sore.",
        vi: "Giờ làm bắt đầu từ bảy giờ sáng đến năm giờ chiều.",
        pronunciation_focus: [
          "jam KER-ja mu-LAI jam TU-juh PA-gi SAM-pai jam LI-ma SO-re.",
          "`mulai jam... sampai jam...` = bắt đầu lúc... đến lúc...",
          "L1 Việt: với giờ, nói `jam tujuh`, không cần `pukul` trong hội thoại thường ngày.",
        ],
        pronunciation_focus_en: [
          "jam KER-ja mu-LAI jam TU-juh PA-gi SAM-pai jam LI-ma SO-re.",
          "`mulai jam... sampai jam...` = starts at... until...",
          "VN-speaker note: for time, `jam tujuh` is natural in daily conversation; formal `pukul` is optional.",
        ],
      },
      {
        en: "Gaji dibayar setiap akhir bulan melalui transfer bank.",
        vi: "Lương được trả vào cuối mỗi tháng qua chuyển khoản ngân hàng.",
        pronunciation_focus: [
          "GA-ji di-BA-yar se-TI-ap A-khir BU-lan me-LA-lui TRANS-fer bank.",
          "`gaji dibayar` = lương được trả; bị động `di-` rất tự nhiên trong thỏa thuận.",
          "L1 Việt: `melalui transfer bank` = qua chuyển khoản ngân hàng; cũng có thể nói `lewat transfer bank`.",
        ],
        pronunciation_focus_en: [
          "GA-jee di-BA-yar se-TEE-ap A-khir BU-lan me-LA-lui TRANS-fer bank.",
          "`gaji dibayar` = salary is paid; passive `di-` is natural in agreements.",
          "VN-speaker note: `melalui transfer bank` = via bank transfer; `lewat transfer bank` is also common.",
        ],
      },
      {
        en: "Tugas harian perlu ditulis supaya jelas.",
        vi: "Nhiệm vụ hằng ngày cần được viết ra để rõ ràng.",
        pronunciation_focus: [
          "TU-gas ha-ri-AN per-LU di-TU-lis su-PA-ya JE-las.",
          "`perlu ditulis` = cần được viết ra; `supaya jelas` = để rõ ràng.",
          "L1 Việt: trong thỏa thuận, câu bị động như `ditulis` nghe tự nhiên và chuyên nghiệp.",
        ],
        pronunciation_focus_en: [
          "TOO-gas ha-ree-AN per-LOO di-TOO-lis su-PA-ya JE-las.",
          "`perlu ditulis` = needs to be written down; `supaya jelas` = so it is clear.",
          "VN-speaker note: in agreements, passive forms like `ditulis` sound natural and professional.",
        ],
      },
      {
        en: "Kalau ada perubahan jadwal, mohon beri tahu lebih awal.",
        vi: "Nếu có thay đổi lịch, xin báo trước sớm hơn.",
        pronunciation_focus: [
          "KA-lau A-da pe-ru-BA-han JAD-wal, MO-hon BE-ri TA-hu LE-bih A-wal.",
          "`perubahan jadwal` = thay đổi lịch; `beri tahu lebih awal` = báo sớm/báo trước.",
          "L1 Việt: `mohon` làm yêu cầu mềm và lịch sự hơn `tolong` trong thỏa thuận công việc.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da pe-ru-BA-han JAD-wal, MO-hon BE-ri TA-hu LE-bih A-wal.",
          "`perubahan jadwal` = schedule change; `beri tahu lebih awal` = inform earlier/in advance.",
          "VN-speaker note: `mohon` makes a request softer and more formal than `tolong` in work agreements.",
        ],
      },
    ],
    cultural_notes_vi:
      "Dalam pekerjaan pengasuh, kesepakatan tertulis giúp giảm salah paham: jadwal, jam kerja, gaji, hari libur, tugas harian, makanan/transport, dan cara memberi kabar jika berhalangan. Karena pekerjaan ini menyangkut keluarga dan rumah, banyak keluarga juga meminta referensi dan masa percobaan. Tetap gunakan bahasa sopan dan hormati batas kerja pengasuh.",
    cultural_notes_en:
      "For caregiver work, a written agreement helps reduce misunderstanding: schedule, working hours, salary, days off, daily duties, meals/transport, and how to notify if unavailable. Because this work involves family and the home, many families also request references and a trial period. Keep language respectful and respect the caregiver's work boundaries.",
    tip_advice_vi:
      "Cụm nên dùng trong thỏa thuận: `jadwal kerjanya`, `jam kerja mulai...`, `gaji dibayar...`, `tugas harian perlu ditulis`, `mohon beri tahu lebih awal`. Người Việt nên chú ý `jadwal` là lịch, còn `jam` là giờ.",
    tip_advice_en:
      "Agreement chunks to use: `jadwal kerjanya`, `jam kerja mulai...`, `gaji dibayar...`, `tugas harian perlu ditulis`, `mohon beri tahu lebih awal`. Vietnamese speakers should note that `jadwal` is schedule, while `jam` is hour/time.",
    vocabulary: [
      {
        cell_id: "3177b977-dc66-480a-bb92-3688b7ebc4a0",
        word: "jadwal",
        en: "schedule",
        vi: "lịch",
        pos: "noun",
        pronunciation_vi: "JAD-wal",
        pronunciation_en: "JAD-wal",
      },
      {
        cell_id: "91cd1888-9f7e-49a2-81bf-c04d1365ba4d",
        word: "gaji",
        en: "salary / wage",
        vi: "lương",
        pos: "noun",
        pronunciation_vi: "GA-ji",
        pronunciation_en: "GA-jee",
      },
      {
        cell_id: "30e3a735-294c-4fb4-bcaa-59040e2041e4",
        word: "akhir bulan",
        en: "end of the month",
        vi: "cuối tháng",
        pos: "noun phrase",
        pronunciation_vi: "A-khir BU-lan",
        pronunciation_en: "A-khir BOO-lan",
      },
      {
        cell_id: "3c545bf0-cf48-483e-968b-eac58a44240f",
        word: "transfer bank",
        en: "bank transfer",
        vi: "chuyển khoản ngân hàng",
        pos: "noun phrase",
        pronunciation_vi: "TRANS-fer bank",
        pronunciation_en: "TRANS-fer bank",
      },
      {
        cell_id: "bdae7232-775a-459c-9cc7-154088bbe013",
        word: "perubahan jadwal",
        en: "schedule change",
        vi: "thay đổi lịch",
        pos: "noun phrase",
        pronunciation_vi: "pe-ru-BA-han JAD-wal",
        pronunciation_en: "pe-ru-BA-han JAD-wal",
      },
      {
        cell_id: "db561d82-50e6-4a9b-9cfc-0604427d9569",
        word: "masa percobaan",
        en: "trial period",
        vi: "thời gian thử việc",
        pos: "noun phrase",
        pronunciation_vi: "MA-sa per-co-BA-an",
        pronunciation_en: "MA-sa per-cho-BA-an",
      },
    ],
    dialogue: [
      {
        cell_id: "7164e988-ac50-497f-9250-4783b56e0731",
        speaker: "Keluarga",
        text: "Jadwal kerjanya dari Senin sampai Jumat.",
        vi: "Lịch làm việc là từ thứ Hai đến thứ Sáu.",
        en: "The work schedule is from Monday to Friday.",
      },
      {
        cell_id: "16f50fb8-d97e-4dfa-9f90-7eea45c20a55",
        speaker: "Calon Pengasuh",
        text: "Jam kerjanya mulai jam berapa?",
        vi: "Giờ làm bắt đầu lúc mấy giờ?",
        en: "What time do the working hours start?",
      },
      {
        cell_id: "12916462-423c-4ec2-8307-bb9e661da67e",
        speaker: "Keluarga",
        text: "Mulai jam tujuh pagi sampai jam lima sore.",
        vi: "Bắt đầu lúc bảy giờ sáng đến năm giờ chiều.",
        en: "From seven in the morning until five in the afternoon.",
      },
      {
        cell_id: "686faf2e-f995-4a00-83de-fa27d05a3b70",
        speaker: "Calon Pengasuh",
        text: "Baik. Mohon tugas hariannya ditulis supaya jelas.",
        vi: "Vâng. Xin viết rõ nhiệm vụ hằng ngày để rõ ràng.",
        en: "Okay. Please write down the daily duties so they are clear.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "jadwal kerja", answer: "lịch làm việc" },
          { prompt: "gaji", answer: "lương" },
          { prompt: "tugas harian", answer: "nhiệm vụ hằng ngày" },
          { prompt: "masa percobaan", answer: "thời gian thử việc" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Jadwal kerjanya dari Senin ___ Jumat. (đến)",
            answer: "sampai",
            options: ["sampai", "supaya", "sambil"],
          },
          {
            prompt: "Gaji dibayar setiap akhir ___. (tháng)",
            answer: "bulan",
            options: ["bulan", "bukan", "badan"],
          },
          {
            prompt: "Kalau ada perubahan jadwal, mohon beri tahu lebih ___. (sớm)",
            answer: "awal",
            options: ["awal", "aman", "asing"],
          },
        ],
      },
    ],
  },
];
