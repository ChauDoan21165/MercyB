// src/languages/indonesian/extra/household-helper-contract.ts
//
// Indonesian household helper agreement pack for Vietnamese learners.
// Covers: ART, pembantu rumah tangga, jadwal kerja, gaji, libur, tugas rumah,
// izin pulang, kesepakatan, and respectful employer-helper conversations.
//
// Shape mirrors the sibling Indonesian extra files. This file is self-contained:
// it declares inline types and exports one uniquely named lesson array.
//
// Field convention: sentence `en` holds TARGET-LANGUAGE Indonesian; `vi` holds
// Vietnamese. `pronunciation_focus` carries Vietnamese-facing pronunciation and
// grammar notes, including L1 traps; `pronunciation_focus_en` is the English
// companion in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, any>;

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
};

export const householdHelperContractLessons: IndonesianLesson[] = [
  {
    id: "indonesian_household_helper_basic_agreement",
    level: "B1",
    category: "home_work",
    title_vi: "Thuê người giúp việc — lịch làm, lương và nhiệm vụ",
    title_en: "Hiring a household helper — schedule, salary and duties",
    sentences: [
      {
        en: "Kami mencari ART untuk membantu pekerjaan rumah.",
        vi: "Chúng tôi đang tìm người giúp việc gia đình để hỗ trợ việc nhà.",
        pronunciation_focus: [
          "ART → a-er-te, viết tắt của `asisten rumah tangga`.",
          "membantu pekerjaan rumah → hỗ trợ việc nhà; `membantu` trang trọng hơn `bantu`.",
          "Lỗi người Việt: nói `pembantu` trống có thể nghe kém tế nhị. `ART` hoặc `asisten rumah tangga` lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "ART → a-er-te, short for `asisten rumah tangga`.",
          "membantu pekerjaan rumah → help with housework; `membantu` is more formal than `bantu`.",
          "VN-speaker trap: bare `pembantu` can sound less tactful. `ART` or `asisten rumah tangga` is more respectful.",
        ],
      },
      {
        en: "Jadwal kerjanya dari Senin sampai Sabtu.",
        vi: "Lịch làm việc là từ thứ Hai đến thứ Bảy.",
        pronunciation_focus: [
          "jadwal kerja → lịch làm việc; `jadwal` khác `jam`.",
          "dari Senin sampai Sabtu → từ thứ Hai đến thứ Bảy.",
          "Lỗi người Việt: nói `di Senin sampai Sabtu`. Khoảng thời gian dùng `dari ... sampai ...`.",
        ],
        pronunciation_focus_en: [
          "jadwal kerja → work schedule; `jadwal` is not the same as `jam`.",
          "dari Senin sampai Sabtu → from Monday to Saturday.",
          "VN-speaker trap: saying `di Senin sampai Sabtu`. Time ranges use `dari ... sampai ...`.",
        ],
      },
      {
        en: "Jam kerja mulai jam tujuh pagi sampai jam empat sore.",
        vi: "Giờ làm bắt đầu từ bảy giờ sáng đến bốn giờ chiều.",
        pronunciation_focus: [
          "jam kerja → giờ làm việc.",
          "mulai jam tujuh pagi → bắt đầu lúc bảy giờ sáng; không dùng `di jam`.",
          "sampai jam empat sore → đến bốn giờ chiều.",
        ],
        pronunciation_focus_en: [
          "jam kerja → working hours.",
          "mulai jam tujuh pagi → starts at seven in the morning; do not use `di jam`.",
          "sampai jam empat sore → until four in the afternoon.",
        ],
      },
      {
        en: "Gajinya dibayar setiap akhir bulan.",
        vi: "Lương được trả vào cuối mỗi tháng.",
        pronunciation_focus: [
          "gajinya → lương đó/lương của vị trí đó; `-nya` làm câu tự nhiên.",
          "dibayar → được trả; bị động `di-` thường dùng trong thỏa thuận.",
          "setiap akhir bulan → mỗi cuối tháng.",
        ],
        pronunciation_focus_en: [
          "gajinya → the salary / that salary; `-nya` makes it natural.",
          "dibayar → is paid; passive `di-` is common in agreements.",
          "setiap akhir bulan → at the end of each month.",
        ],
      },
      {
        en: "Tugas utamanya memasak, menyapu, dan mencuci pakaian.",
        vi: "Nhiệm vụ chính là nấu ăn, quét nhà và giặt quần áo.",
        pronunciation_focus: [
          "tugas utama → nhiệm vụ chính; tính từ `utama` đứng sau danh từ.",
          "memasak, menyapu, mencuci → nấu, quét, giặt; các động từ meN- tự nhiên trong danh sách việc.",
          "Lỗi người Việt: bỏ tiền tố trong văn bản thỏa thuận. Viết rõ `memasak/menyapu/mencuci`.",
        ],
        pronunciation_focus_en: [
          "tugas utama → main duty; adjective `utama` follows the noun.",
          "memasak, menyapu, mencuci → cook, sweep, wash; meN- verbs are natural in duty lists.",
          "VN-speaker trap: dropping prefixes in an agreement. Write clear forms: `memasak/menyapu/mencuci`.",
        ],
      },
      {
        en: "Hari Minggu adalah hari libur.",
        vi: "Chủ nhật là ngày nghỉ.",
        pronunciation_focus: [
          "Hari Minggu → Chủ nhật; viết hoa khi là tên ngày.",
          "hari libur → ngày nghỉ; `libur` = nghỉ.",
          "Câu này nên ghi rõ trong kesepakatan để tránh hiểu nhầm.",
        ],
        pronunciation_focus_en: [
          "Hari Minggu → Sunday; capitalize weekday names.",
          "hari libur → day off/holiday; `libur` = off/free.",
          "This should be stated clearly in the agreement to avoid misunderstanding.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, người giúp việc gia đình thường được gọi là `ART` (asisten rumah tangga). Từ `pembantu rumah tangga` vẫn nghe thấy, nhưng `ART` lịch sự và hiện đại hơn. Khi thuê ART, nên nói rõ jadwal kerja, jam kerja, gaji, hari libur, tugas rumah, makan/tinggal di rumah hay pulang pergi, dan aturan izin pulang. Thỏa thuận bằng văn bản giúp cả hai bên tránh hiểu nhầm.",
    cultural_notes_en:
      "In Indonesia, household helpers are often called `ART` (asisten rumah tangga). `Pembantu rumah tangga` is still heard, but `ART` is more respectful and modern. When hiring an ART, clarify work schedule, hours, salary, days off, household duties, meals/live-in vs. commute, and permission to go home. A written agreement helps both sides avoid misunderstandings.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng `ART` hoặc `asisten rumah tangga` để lịch sự. Khi nói thỏa thuận, dùng cấu trúc rõ: `jadwal kerjanya ...`, `gajinya dibayar ...`, `tugas utamanya ...`, `hari libur ...`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use `ART` or `asisten rumah tangga` for a respectful tone. For agreements, use clear frames: `jadwal kerjanya ...`, `gajinya dibayar ...`, `tugas utamanya ...`, `hari libur ...`.",
    vocabulary: [
      {
        word: "ART (asisten rumah tangga)",
        en: "household helper",
        vi: "người giúp việc gia đình",
        pos: "noun",
        pronunciation_vi: "a-er-te / a-SIS-ten RU-mah TANG-ga",
        pronunciation_en: "a-er-te / a-SIS-ten ROO-mah TANG-ga",
      },
      {
        word: "pembantu rumah tangga",
        en: "domestic helper",
        vi: "người giúp việc nhà",
        pos: "noun phrase",
        pronunciation_vi: "pem-BAN-tu RU-mah TANG-ga",
        pronunciation_en: "pem-BAN-too ROO-mah TANG-ga",
      },
      {
        word: "jadwal kerja",
        en: "work schedule",
        vi: "lịch làm việc",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal KER-ja",
        pronunciation_en: "JAD-wal KER-ja",
      },
      {
        word: "gaji",
        en: "salary / wage",
        vi: "lương",
        pos: "noun",
        pronunciation_vi: "GA-ji",
        pronunciation_en: "GA-jee",
      },
      {
        word: "hari libur",
        en: "day off",
        vi: "ngày nghỉ",
        pos: "noun phrase",
        pronunciation_vi: "HA-ri LI-bur",
        pronunciation_en: "HA-ree LEE-boor",
      },
      {
        word: "tugas rumah",
        en: "household duties",
        vi: "việc nhà / nhiệm vụ trong nhà",
        pos: "noun phrase",
        pronunciation_vi: "TU-gas RU-mah",
        pronunciation_en: "TOO-gas ROO-mah",
      },
    ],
    dialogue: [
      {
        speaker: "Majikan",
        text: "Kami mencari ART untuk membantu pekerjaan rumah.",
        vi: "Chúng tôi đang tìm người giúp việc gia đình để hỗ trợ việc nhà.",
        en: "We are looking for a household helper to help with housework.",
      },
      {
        speaker: "Calon ART",
        text: "Jadwal kerjanya dari hari apa sampai hari apa?",
        vi: "Lịch làm việc từ ngày nào đến ngày nào?",
        en: "What days is the work schedule from and to?",
      },
      {
        speaker: "Majikan",
        text: "Dari Senin sampai Sabtu, dan Minggu libur.",
        vi: "Từ thứ Hai đến thứ Bảy, và Chủ nhật nghỉ.",
        en: "From Monday to Saturday, and Sunday is off.",
      },
      {
        speaker: "Calon ART",
        text: "Baik. Tugas utamanya apa saja?",
        vi: "Vâng. Nhiệm vụ chính gồm những gì?",
        en: "Okay. What are the main duties?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ thỏa thuận giúp việc còn thiếu:",
        instruction_en: "Fill in the missing household-helper word:",
        items: [
          {
            prompt: "Kami mencari ___ untuk membantu pekerjaan rumah. (người giúp việc)",
            answer: "ART",
            options: ["ART", "ATM", "RT"],
          },
          {
            prompt: "___ kerjanya dari Senin sampai Sabtu. (lịch)",
            answer: "Jadwal",
            options: ["Jadwal", "Jalan", "Jawaban"],
          },
          {
            prompt: "Hari Minggu adalah hari ___. (nghỉ)",
            answer: "libur",
            options: ["libur", "lembur", "lapar"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "gaji", answer: "lương" },
          { prompt: "tugas rumah", answer: "việc nhà" },
          { prompt: "hari libur", answer: "ngày nghỉ" },
          { prompt: "jadwal kerja", answer: "lịch làm việc" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Lịch làm việc là từ thứ Hai đến thứ Bảy.", answer: "Jadwal kerjanya dari Senin sampai Sabtu." },
          { prompt: "Lương được trả vào cuối mỗi tháng.", answer: "Gajinya dibayar setiap akhir bulan." },
          { prompt: "Nhiệm vụ chính là nấu ăn, quét nhà và giặt quần áo.", answer: "Tugas utamanya memasak, menyapu, dan mencuci pakaian." },
        ],
      },
    ],
  },
  {
    id: "indonesian_household_helper_permission_agreement",
    level: "B1",
    category: "home_work",
    title_vi: "Thỏa thuận rõ ràng — xin về, nghỉ và quy định trong nhà",
    title_en: "Clear agreement — going home, leave and house rules",
    sentences: [
      {
        en: "Kalau perlu izin pulang, tolong beri tahu sehari sebelumnya.",
        vi: "Nếu cần xin phép về, vui lòng báo trước một ngày.",
        pronunciation_focus: [
          "izin pulang → xin phép về nhà; cụm quan trọng với ART tinggal trong nhà.",
          "beri tahu → báo cho biết; tự nhiên hơn `kasih tahu` trong thỏa thuận.",
          "sehari sebelumnya → trước một ngày.",
        ],
        pronunciation_focus_en: [
          "izin pulang → permission to go home; important for live-in helpers.",
          "beri tahu → inform/let someone know; more formal than `kasih tahu` in agreements.",
          "sehari sebelumnya → one day beforehand.",
        ],
      },
      {
        en: "Kesepakatan ini sebaiknya ditulis supaya jelas.",
        vi: "Thỏa thuận này nên được viết ra để rõ ràng.",
        pronunciation_focus: [
          "kesepakatan → thỏa thuận; từ gốc `sepakat` = đồng ý.",
          "sebaiknya ditulis → nên được viết ra; bị động `di-` phù hợp văn phong.",
          "supaya jelas → để rõ ràng; `supaya` = để/nhằm.",
        ],
        pronunciation_focus_en: [
          "kesepakatan → agreement; root `sepakat` = agree.",
          "sebaiknya ditulis → should be written down; passive `di-` fits the register.",
          "supaya jelas → so that it is clear; `supaya` = so that.",
        ],
      },
      {
        en: "Apakah gaji sudah termasuk makan siang dan uang transport?",
        vi: "Lương đã bao gồm bữa trưa và tiền đi lại chưa?",
        pronunciation_focus: [
          "sudah termasuk → đã bao gồm; dùng để hỏi quyền lợi/phần bao gồm.",
          "makan siang → bữa trưa; `siang` = trưa/ban ngày.",
          "uang transport → tiền đi lại; từ `transport` rất thường dùng.",
        ],
        pronunciation_focus_en: [
          "sudah termasuk → already includes; used to ask what is included.",
          "makan siang → lunch; `siang` = midday/daytime.",
          "uang transport → transport allowance; `transport` is commonly used.",
        ],
      },
      {
        en: "Kalau lembur, hitungannya bagaimana?",
        vi: "Nếu làm thêm giờ thì cách tính như thế nào?",
        pronunciation_focus: [
          "lembur → làm thêm giờ/tăng ca.",
          "hitungannya bagaimana → cách tính thế nào; hỏi tiền công rất tự nhiên.",
          "Lỗi người Việt: hỏi cộc `lembur bayar berapa?`. `Hitungannya bagaimana?` mềm hơn.",
        ],
        pronunciation_focus_en: [
          "lembur → overtime.",
          "hitungannya bagaimana → how is it calculated; natural for pay questions.",
          "VN-speaker trap: blunt `lembur bayar berapa?`. `Hitungannya bagaimana?` is softer.",
        ],
      },
      {
        en: "Mohon jaga privasi keluarga kami.",
        vi: "Vui lòng giữ sự riêng tư của gia đình chúng tôi.",
        pronunciation_focus: [
          "mohon → vui lòng; trang trọng hơn `tolong` trong quy định.",
          "jaga privasi → giữ sự riêng tư; `privasi` là từ mượn.",
          "keluarga kami → gia đình chúng tôi; `kami` không gồm người nghe.",
        ],
        pronunciation_focus_en: [
          "mohon → please; more formal than `tolong` for rules.",
          "jaga privasi → protect privacy; `privasi` is a loanword.",
          "keluarga kami → our family; `kami` excludes the listener.",
        ],
      },
      {
        en: "Kalau ada masalah, kita bicarakan baik-baik.",
        vi: "Nếu có vấn đề, chúng ta nói chuyện tử tế với nhau.",
        pronunciation_focus: [
          "kalau ada masalah → nếu có vấn đề.",
          "kita bicarakan → chúng ta bàn/nói về việc đó; `kita` gồm cả hai bên.",
          "baik-baik → tử tế/êm đẹp; lặp từ tạo sắc thái mềm.",
        ],
        pronunciation_focus_en: [
          "kalau ada masalah → if there is a problem.",
          "kita bicarakan → we discuss it; `kita` includes both sides.",
          "baik-baik → properly/kindly/peacefully; reduplication softens the tone.",
        ],
      },
    ],
    cultural_notes_vi:
      "Quan hệ với ART trong gia đình Indonesia thường gần gũi nhưng vẫn cần ranh giới rõ. Các điểm nên ghi trong `kesepakatan`: gaji, jadwal kerja, hari libur, tugas rumah, uang makan/transport, aturan lembur, izin pulang, privasi keluarga, dan cara menyelesaikan masalah. Dùng giọng tôn trọng giúp tránh cảm giác ra lệnh hoặc coi thường.",
    cultural_notes_en:
      "The relationship with an ART in an Indonesian household can be close, but clear boundaries still matter. Points to write in the `kesepakatan`: salary, work schedule, day off, duties, meal/transport allowance, overtime rules, permission to go home, family privacy, and how to resolve problems. Respectful wording avoids sounding bossy or dismissive.",
    tip_advice_vi:
      "Mẹo cho người Việt: `kami` = chúng tôi không gồm người nghe; `kita` = chúng ta gồm người nghe. Trong quy định riêng của gia đình dùng `keluarga kami`; khi cùng giải quyết vấn đề dùng `kita bicarakan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `kami` = we excluding the listener; `kita` = we including the listener. For private family rules use `keluarga kami`; for solving problems together use `kita bicarakan`.",
    vocabulary: [
      {
        word: "izin pulang",
        en: "permission to go home",
        vi: "xin phép về nhà",
        pos: "noun phrase",
        pronunciation_vi: "I-zin PU-lang",
        pronunciation_en: "EE-zin POO-lang",
      },
      {
        word: "kesepakatan",
        en: "agreement",
        vi: "thỏa thuận",
        pos: "noun",
        pronunciation_vi: "ke-se-PA-ka-tan",
        pronunciation_en: "keh-seh-PA-ka-tan",
      },
      {
        word: "uang transport",
        en: "transport allowance",
        vi: "tiền đi lại",
        pos: "noun phrase",
        pronunciation_vi: "U-ang TRANS-port",
        pronunciation_en: "OO-ang TRANS-port",
      },
      {
        word: "lembur",
        en: "overtime",
        vi: "tăng ca / làm thêm giờ",
        pos: "noun / verb",
        pronunciation_vi: "LEM-bur",
        pronunciation_en: "LEM-boor",
      },
      {
        word: "privasi",
        en: "privacy",
        vi: "sự riêng tư",
        pos: "noun",
        pronunciation_vi: "pri-VA-si",
        pronunciation_en: "pree-VA-see",
      },
      {
        word: "baik-baik",
        en: "properly / peacefully",
        vi: "tử tế / êm đẹp",
        pos: "adverb",
        pronunciation_vi: "BA-ik BA-ik",
        pronunciation_en: "BA-ik BA-ik",
      },
    ],
    dialogue: [
      {
        speaker: "Calon ART",
        text: "Apakah gaji sudah termasuk makan siang dan uang transport?",
        vi: "Lương đã bao gồm bữa trưa và tiền đi lại chưa?",
        en: "Does the salary include lunch and transport allowance?",
      },
      {
        speaker: "Majikan",
        text: "Makan siang sudah termasuk, tapi uang transport dibayar terpisah.",
        vi: "Bữa trưa đã bao gồm, nhưng tiền đi lại trả riêng.",
        en: "Lunch is included, but transport allowance is paid separately.",
      },
      {
        speaker: "Calon ART",
        text: "Kalau saya perlu izin pulang, bagaimana aturannya?",
        vi: "Nếu tôi cần xin phép về nhà, quy định thế nào?",
        en: "If I need permission to go home, what is the rule?",
      },
      {
        speaker: "Majikan",
        text: "Tolong beri tahu sehari sebelumnya, supaya jadwalnya jelas.",
        vi: "Vui lòng báo trước một ngày để lịch rõ ràng.",
        en: "Please tell us one day beforehand so the schedule is clear.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ thỏa thuận còn thiếu:",
        instruction_en: "Fill in the missing agreement word:",
        items: [
          {
            prompt: "Kalau perlu ___ pulang, tolong beri tahu. (xin phép)",
            answer: "izin",
            options: ["izin", "isi", "ikan"],
          },
          {
            prompt: "___ ini sebaiknya ditulis supaya jelas. (thỏa thuận)",
            answer: "Kesepakatan",
            options: ["Kesepakatan", "Kesempatan", "Kesehatan"],
          },
          {
            prompt: "Kalau ___, hitungannya bagaimana? (tăng ca)",
            answer: "lembur",
            options: ["lembur", "libur", "lapar"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "izin pulang", answer: "xin phép về nhà" },
          { prompt: "uang transport", answer: "tiền đi lại" },
          { prompt: "privasi", answer: "sự riêng tư" },
          { prompt: "baik-baik", answer: "tử tế / êm đẹp" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Thỏa thuận này nên được viết ra để rõ ràng.", answer: "Kesepakatan ini sebaiknya ditulis supaya jelas." },
          { prompt: "Nếu làm thêm giờ thì cách tính như thế nào?", answer: "Kalau lembur, hitungannya bagaimana?" },
          { prompt: "Nếu có vấn đề, chúng ta nói chuyện tử tế với nhau.", answer: "Kalau ada masalah, kita bicarakan baik-baik." },
        ],
      },
    ],
  },
];
