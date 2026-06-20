// Advanced Summarizing Data Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// notes with English companions in pronunciation_focus_en.
//
// Topic: simple charts (`grafik sederhana`), key numbers (`angka utama`), upward
// trends (`tren naik`), downward trends (`tren turun`), comparing data
// (`perbandingan data`), summarizing findings (`ringkasan temuan`), and cautious
// conclusions (`kesimpulan hati-hati`). For Vietnamese speakers, the wins are
// familiar: you already summarize with phrases like `nhìn chung`, `số liệu chính`,
// or `xu hướng tăng/giảm`. The traps: over-claiming from small data, confusing
// `naik`/`turun` with personal opinion, and forgetting to say whether the result
// is only a trend or a firm conclusion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
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
    id: "indonesian_advanced_summarizing_data",
    level: "B2",
    category: "analysis",
    title_vi: "Tóm tắt dữ liệu và nêu xu hướng",
    title_en: "Advanced summarizing data",
    sentences: [
      {
        en: "Grafik ini menunjukkan tren naik yang stabil selama tiga bulan terakhir.",
        vi: "Biểu đồ này cho thấy xu hướng tăng ổn định trong ba tháng gần đây.",
        pronunciation_focus: [
          "gra-FIK i-NI me-nun-JUK-kan tren NA-ik yang STA-bil se-la-ma ti-GA bu-lan ter-AK-hir — `menunjukkan` = cho thấy; `tren naik` = xu hướng tăng.",
          "Mẹo: khi tóm tắt data, nói `menunjukkan` / `terlihat` / `tampak` nghe khách quan hơn `saya rasa`.",
          "Lỗi người Việt: nói `grafik ini naik` quá ngắn. `Menunjukkan tren naik` là cách mô tả dữ liệu chuyên nghiệp hơn.",
        ],
        pronunciation_focus_en: [
          "grah-FEEK ee-NEE meh-noon-JOOK-kahn tren NIGHK yang STAH-beel seh-LAH-mah TEE-gah BOO-lan ter-AK-heer — `menunjukkan` = shows; `tren naik` = upward trend.",
          "Tip: when summarizing data, `menunjukkan` / `terlihat` / `tampak` sound more objective than `saya rasa`.",
          "VN-speaker trap: saying only `grafik ini naik`. `Menunjukkan tren naik` is a more professional data description.",
        ],
      },
      {
        en: "Angka utama yang perlu diperhatikan adalah jumlah pelanggan baru.",
        vi: "Con số chính cần chú ý là số lượng khách hàng mới.",
        pronunciation_focus: [
          "ANG-ka u-TA-ma yang per-LU di-per-ha-ti-KAN A-da-lah jum-LAH pe-lang-GAN BA-ru — `angka utama` = con số chính; `perlu diperhatikan` = cần chú ý.",
          "Mẹo: `angka utama` giúp người nghe biết dữ liệu nào quan trọng nhất.",
          "Lỗi người Việt: liệt kê quá nhiều số cùng lúc. Chọn `angka utama` trước rồi mới giải thích sau.",
        ],
        pronunciation_focus_en: [
          "AHNG-kah oo-TAH-mah yang per-LOO dee-per-hah-tee-KAHN AH-dah-lah JOOM-lah pe-LAHNG-gan BAH-roo — `angka utama` = key number; `perlu diperhatikan` = should be noted.",
          "Tip: `angka utama` tells the listener which data point matters most.",
          "VN-speaker trap: listing too many numbers at once. Pick the `angka utama` first, then explain later.",
        ],
      },
      {
        en: "Dibandingkan bulan lalu, penjualan turun sedikit tetapi masih wajar.",
        vi: "So với tháng trước, doanh số giảm nhẹ nhưng vẫn hợp lý.",
        pronunciation_focus: [
          "di-ban-DING-kan bu-LAN LA-lu, pen-jual-AN TUR-un se-DI-kit te-TA-pi MA-sih WA-jar — `dibandingkan` = so với; `turun sedikit` = giảm nhẹ.",
          "Mẹo: thêm `tetapi masih wajar` làm câu tóm tắt có cân bằng, không quá bi quan.",
          "Lỗi người Việt: nhìn `turun` là kết luận xấu ngay. Trong data, giảm nhẹ belum tentu masalah.",
        ],
        pronunciation_focus_en: [
          "di-ban-DING-kahn boo-LAHN LAH-loo, pen-joo-AHL-an TOOR-oon seh-DEE-kit teh-TAH-pee MAH-seeh WAH-jar — `dibandingkan` = compared to; `turun sedikit` = decreased slightly.",
          "Tip: adding `tetapi masih wajar` makes the summary balanced, not overly negative.",
          "VN-speaker trap: seeing `turun` and immediately judging it as bad. In data, a slight decrease is not always a problem.",
        ],
      },
      {
        en: "Secara umum, hasilnya positif meski ada fluktuasi kecil.",
        vi: "Nhìn chung, kết quả là tích cực dù có dao động nhỏ.",
        pronunciation_focus: [
          "se-ca-ra u-MUM, ha-SIL-nya po-si-TIF mes-KI A-da fluk-tu-A-si KE-cil — `secara umum` = nhìn chung; `fluktuasi` = dao động lên xuống.",
          "Mẹo: `secara umum` rất hữu ích để mở phần ringkasan trước khi masuk detail.",
          "Lỗi người Việt: bỏ mất từ trung tính rồi chỉ nêu cảm tính. `Secara umum` giữ phần mở đầu khách quan.",
        ],
        pronunciation_focus_en: [
          "seh-cha-RAH oo-MOOM, hah-SEEL-nyah poh-see-TEEF mess-KEE AH-dah flook-too-AH-see KEH-chil — `secara umum` = in general; `fluktuasi` = fluctuation.",
          "Tip: `secara umum` is very useful to open a summary before moving into details.",
          "VN-speaker trap: skipping the neutral framing and jumping into feelings. `Secara umum` keeps the opening objective.",
        ],
      },
      {
        en: "Ada perbedaan data antara wilayah kota dan pinggiran.",
        vi: "Có sự khác biệt dữ liệu giữa khu vực trung tâm và ngoại ô.",
        pronunciation_focus: [
          "A-da per-be-DA-an DA-ta an-TA-ra wi-la-YAH ko-TA dan piNG-gi-ran — `perbedaan data` = khác biệt dữ liệu; `antara` = giữa.",
          "Mẹo: `antara A dan B` adalah pola dasar saat membandingkan dua kelompok.",
          "Lỗi người Việt: dùng `perbedaan dari kota dan pinggiran`. Với dua nhóm, `antara` lebih natural.",
        ],
        pronunciation_focus_en: [
          "AH-dah pehr-beh-DAH-an DAH-tah ahn-TAH-rah wee-lah-YAH koh-TAH dahn peeng-gee-RAHN — `perbedaan data` = data difference; `antara` = between.",
          "Tip: `antara A dan B` is the basic pattern when comparing two groups.",
          "VN-speaker trap: saying `perbedaan dari kota dan pinggiran`. With two groups, `antara` is more natural.",
        ],
      },
      {
        en: "Ringkasan temuan ini harus singkat, jelas, dan tidak berlebihan.",
        vi: "Bản tóm tắt phát hiện này phải ngắn gọn, rõ ràng, và không phóng đại.",
        pronunciation_focus: [
          "ring-KAS-an te-MU-an i-NI ha-RUS sing-KAT, JE-las, dan ti-DAK ber-le-BI-han — `ringkasan temuan` = tóm tắt phát hiện.",
          "Mẹo: ringkasan data harus menyebut hasil utama, bukan semua angka mentah.",
          "Lỗi người Việt: menyalin seluruh tabel menjadi ringkasan. `Ringkasan` harus memilih poin paling penting.",
        ],
        pronunciation_focus_en: [
          "ring-KAH-san teh-MOO-an ee-NEE hah-ROOS sing-KAHT, JEH-las, dahn tee-DAK ber-leh-BEE-han — `ringkasan temuan` = summary of findings.",
          "Tip: a data summary should mention the main result, not every raw number.",
          "VN-speaker trap: copying the whole table into the summary. A `ringkasan` must select the most important points.",
        ],
      },
      {
        en: "Kesimpulan sementara menunjukkan arah yang cukup konsisten.",
        vi: "Kết luận tạm thời cho thấy hướng đi khá nhất quán.",
        pronunciation_focus: [
          "ke-sim-PU-lan se-menta-RA me-nun-JUK-kan A-rah yang cu-KUP kon-SIS-ten — `kesimpulan sementara` = kết luận tạm thời; `konsisten` = nhất quán.",
          "Mẹo: kalau datanya belum penuh, pakai `sementara` hoặc `awal` để menghindari overclaim.",
          "Lỗi người Việt: nói `kesimpulan final` dari data kecil. `Sementara` menjaga kehati-hatian.",
        ],
        pronunciation_focus_en: [
          "keh-seem-POO-lahn seh-men-tah-RAH meh-noon-JOOK-kahn AH-rah yang koo-KOOP kon-SEES-ten — `kesimpulan sementara` = preliminary conclusion; `konsisten` = consistent.",
          "Tip: if the data is not complete yet, use `sementara` or `awal` to avoid overclaiming.",
          "VN-speaker trap: calling a small dataset a `kesimpulan final`. `Sementara` keeps you cautious.",
        ],
      },
      {
        en: "Namun, kita perlu hati-hati karena sampelnya masih kecil.",
        vi: "Tuy nhiên, chúng ta cần thận trọng vì mẫu vẫn còn nhỏ.",
        pronunciation_focus: [
          "NA-mun KI-ta per-LU ha-ti-HA-ti ka-RE-na SAM-pel-nya MA-sih ke-CIL — `hati-hati` = thận trọng; `sampel` = mẫu.",
          "Mẹo: `namun` memberi kunci nuansa. Ini cara paling aman để menghindari kesan terlalu pasti.",
          "Lỗi người Việt: kết thúc data summary bằng klaim mạnh. Jika sampelnya kecil, selalu beri peringatan.",
        ],
        pronunciation_focus_en: [
          "NAH-moon KEE-tah per-LOO hah-tee-HAH-tee kah-REH-nah SAHM-pel-nyah MAH-seeh keh-CHIL — `hati-hati` = careful/cautious; `sampel` = sample.",
          "Tip: `namun` gives you nuance. It is the safest way to avoid sounding too certain.",
          "VN-speaker trap: ending a data summary with a strong claim. If the sample is small, always add a caution.",
        ],
      },
      {
        en: "Kalau datanya bertambah, kita bisa revisi kesimpulannya.",
        vi: "Nếu dữ liệu tăng thêm, chúng ta có thể sửa lại kết luận.",
        pronunciation_focus: [
          "KA-lau DA-ta-nya ber-TAM-bah, KI-ta BI-sa re-VI-si ke-sim-PU-lan-nya — `revisi` = chỉnh sửa lại; `bertambah` = tăng thêm.",
          "Mẹo: data work sering bersifat sementara. `Bisa revisi` menunjukkan sikap ilmiah dan fleksibel.",
          "Lỗi người Việt: bảo vệ kesimpulan lama dù datanya berubah. Dalam analisis, revisi itu normal.",
        ],
        pronunciation_focus_en: [
          "KAH-low DAH-tah-nyah ber-TAM-bah, KEE-tah BEE-sah reh-VEE-see keh-seem-POO-lahn-nyah — `revisi` = revise; `bertambah` = increase/add more.",
          "Tip: data work is often temporary. `Bisa revisi` shows a scientific and flexible attitude.",
          "VN-speaker trap: defending an old conclusion even when the data changes. In analysis, revision is normal.",
        ],
      },
      {
        en: "Saya akan menyebut angka utama sebelum menjelaskan detailnya.",
        vi: "Tôi sẽ nêu con số chính trước khi giải thích chi tiết.",
        pronunciation_focus: [
          "SA-ya A-kan me-nyE-but ANG-ka u-TA-ma se-be-LUM men-je-las-KAN de-TAIL-nya — `menyebut angka utama` = nêu con số chính.",
          "Mẹo: mulai dari angka utama dulu, baru detail. Ini sangat membantu saat presentasi singkat.",
          "Lỗi người Việt: mulai dengan detail terlalu banyak. Dalam ringkasan data, angka utama harus muncul lebih dulu.",
        ],
        pronunciation_focus_en: [
          "SAH-yah AH-kahn me-nyeh-BOOT AHNG-kah oo-TAH-mah seh-beh-LOOM men-jeh-LAHS-kahn deh-TAIL-nyah — `menyebut angka utama` = mention the key number.",
          "Tip: start with the key number first, then detail. This helps a lot in short presentations.",
          "VN-speaker trap: starting with too many details. In data summaries, the key number should come first.",
        ],
      },
    ],
    cultural_notes_vi:
      "Dalam laporan, rapat, atau presentasi di Indonesia, ringkasan data biasanya bergerak dari `angka utama` ke `tren`, lalu ke `kesimpulan`. Nada yang baik adalah hati-hati, bukan terlalu bombastis. Orang sering memakai kata seperti `secara umum`, `namun`, `cenderung`, `terlihat`, dan `sementara` untuk menandai tingkat kepastian. Jika datanya kecil atau masih berubah, lebih aman menyebutnya sebagai `kesimpulan sementara` daripada kesimpulan final. Ini membuat laporan terasa profesional dan jujur.",
    cultural_notes_en:
      "In Indonesian reports, meetings, or presentations, data summaries usually move from `angka utama` to `tren` and then to `kesimpulan`. A good tone is cautious, not overly dramatic. People often use words like `secara umum`, `namun`, `cenderung`, `terlihat`, and `sementara` to mark the level of certainty. If the dataset is small or still changing, it is safer to call it `kesimpulan sementara` rather than a final conclusion. This makes the report feel professional and honest.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng đọc lại bảng số liệu như robot. Hãy dùng khung 4 bước: (1) `Secara umum...`; (2) `Angka utama...`; (3) `Dibandingkan dengan...` atau `trennya naik/turun...`; (4) `Namun...` nếu cần thận trọng. Sau đó mới chốt bằng `kesimpulan sementara` nếu dữ liệu chưa đủ mạnh.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not read the table like a robot. Use a 4-step frame: (1) `Secara umum...`; (2) `Angka utama...`; (3) `Dibandingkan dengan...` or `the trend is up/down...`; (4) `Namun...` if caution is needed. Then close with `kesimpulan sementara` if the data is not strong enough yet.",
    vocabulary: [
      {
        word: "grafik",
        en: "chart / graph",
        vi: "biểu đồ",
        pos: "noun",
        pronunciation_vi: "gra-FIK",
        pronunciation_en: "GRAF-ik",
      },
      {
        word: "angka utama",
        en: "key number",
        vi: "con số chính",
        pos: "noun phrase",
        pronunciation_vi: "ANG-ka u-TA-ma",
        pronunciation_en: "ANG-kah oo-TAH-mah",
      },
      {
        word: "tren naik",
        en: "upward trend",
        vi: "xu hướng tăng",
        pos: "noun phrase",
        pronunciation_vi: "tren NA-ik",
        pronunciation_en: "tren NIGHK",
      },
      {
        word: "tren turun",
        en: "downward trend",
        vi: "xu hướng giảm",
        pos: "noun phrase",
        pronunciation_vi: "tren TUR-un",
        pronunciation_en: "tren TOOR-oon",
      },
      {
        word: "perbandingan data",
        en: "data comparison",
        vi: "so sánh dữ liệu",
        pos: "noun phrase",
        pronunciation_vi: "per-ban-DING-an DA-ta",
        pronunciation_en: "per-ban-DING-an DAH-tah",
      },
      {
        word: "ringkasan temuan",
        en: "summary of findings",
        vi: "tóm tắt phát hiện",
        pos: "noun phrase",
        pronunciation_vi: "ring-KAS-an te-MU-an",
        pronunciation_en: "ring-KAH-san teh-MOO-an",
      },
      {
        word: "kesimpulan sementara",
        en: "preliminary conclusion",
        vi: "kết luận tạm thời",
        pos: "noun phrase",
        pronunciation_vi: "ke-sim-PU-lan se-men-ta-RA",
        pronunciation_en: "keh-seem-POO-lahn seh-men-tah-RAH",
      },
      {
        word: "hati-hati",
        en: "careful / cautious",
        vi: "thận trọng",
        pos: "adjective",
        pronunciation_vi: "ha-ti-HA-ti",
        pronunciation_en: "hah-tee-HAH-tee",
      },
    ],
    dialogue: [
      {
        speaker: "Anisa",
        text: "Secara umum, grafik ini menunjukkan tren naik yang stabil.",
        vi: "Nhìn chung, biểu đồ này cho thấy xu hướng tăng ổn định.",
        en: "In general, this chart shows a stable upward trend.",
      },
      {
        speaker: "Budi",
        text: "Benar, tetapi kita perlu hati-hati karena sampelnya masih kecil.",
        vi: "Đúng, nhưng chúng ta cần thận trọng vì mẫu vẫn còn nhỏ.",
        en: "True, but we need to be careful because the sample is still small.",
      },
      {
        speaker: "Anisa",
        text: "Kalau datanya bertambah, kita bisa revisi kesimpulannya.",
        vi: "Nếu dữ liệu tăng thêm, chúng ta có thể sửa lại kết luận.",
        en: "If more data comes in, we can revise the conclusion.",
      },
      {
        speaker: "Budi",
        text: "Setuju. Untuk sekarang, ini baru kesimpulan sementara.",
        vi: "Đồng ý. Hiện tại, đây mới chỉ là kết luận tạm thời.",
        en: "Agreed. For now, this is only a preliminary conclusion.",
      },
      {
        speaker: "Anisa",
        text: "Saya akan menyebut angka utama dulu sebelum detailnya.",
        vi: "Tôi sẽ nêu con số chính trước khi vào chi tiết.",
        en: "I will mention the key numbers first before the details.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Biểu đồ này cho thấy xu hướng tăng ổn định.", answer: "Grafik ini menunjukkan tren naik yang stabil." },
          { prompt: "Nhìn chung, kết quả là tích cực dù có dao động nhỏ.", answer: "Secara umum, hasilnya positif meski ada fluktuasi kecil." },
          { prompt: "Nếu dữ liệu tăng thêm, chúng ta có thể sửa lại kết luận.", answer: "Kalau datanya bertambah, kita bisa revisi kesimpulannya." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu để tóm tắt dữ liệu tự nhiên hơn:",
        instruction_en: "Fill in the missing word to make the data summary natural:",
        items: [
          {
            prompt: "___ umum, hasilnya positif. (nhìn chung)",
            answer: "Secara",
            options: ["Secara", "Sangat", "Selalu"],
          },
          {
            prompt: "Angka ___ yang perlu diperhatikan adalah jumlah pelanggan baru. (chính)",
            answer: "utama",
            options: ["utama", "utamaan", "utuh"],
          },
          {
            prompt: "Ini baru kesimpulan ___. (tạm thời)",
            answer: "sementara",
            options: ["sementara", "selamanya", "segera"],
          },
        ],
      },
      {
        type: "ordering",
        instruction_vi: "Sắp xếp thành câu đúng:",
        instruction_en: "Put the words in the correct order:",
        items: [
          {
            words: ["Grafik", "ini", "menunjukkan", "tren", "naik", "yang", "stabil"],
            answer: "Grafik ini menunjukkan tren naik yang stabil.",
          },
          {
            words: ["Namun", "kita", "perlu", "hati-hati", "karena", "sampelnya", "masih", "kecil"],
            answer: "Namun kita perlu hati-hati karena sampelnya masih kecil.",
          },
          {
            words: ["Saya", "akan", "menyebut", "angka", "utama", "dulu", "sebelum", "detailnya"],
            answer: "Saya akan menyebut angka utama dulu sebelum detailnya.",
          },
        ],
      },
    ],
  },
];
