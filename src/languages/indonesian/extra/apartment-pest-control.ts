// Apartment Pest Control Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
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
  content?: string;
};

export const apartmentPestControlLessons: IndonesianLesson[] = [
  {
    id: "indonesian_apartment_pest_control",
    level: "B1",
    category: "housing",
    title_vi: "Căn hộ và diệt côn trùng: gián, muỗi, chuột và lịch pest control",
    title_en: "Apartment pest control: cockroaches, mosquitoes, rats and scheduled treatment",
    sentences: [
      {
        en: "Saya mau melapor ada hama di unit saya.",
        vi: "Tôi muốn báo có côn trùng/động vật gây hại trong căn hộ của tôi.",
        pronunciation_focus: [
          "`melapor` = báo cáo/trình báo; dùng với pengelola apartemen hoặc security.",
          "`hama` là từ chung cho sinh vật gây hại như kecoa, nyamuk, tikus; không chỉ là sâu bệnh cây.",
          "Lỗi người Việt: nói `ada serangga` cho mọi trường hợp. Nếu có chuột hoặc vấn đề chung, dùng `hama` rộng hơn.",
        ],
        pronunciation_focus_en: [
          "`melapor` means report; use it with apartment management or security.",
          "`hama` is a broad word for pests such as cockroaches, mosquitoes, and rats, not only crop pests.",
          "VN-speaker trap: saying `ada serangga` for everything. If rats are involved or the issue is general, `hama` is broader.",
        ],
      },
      {
        en: "Ada banyak kecoa kecil di dapur dan dekat tempat sampah.",
        vi: "Có nhiều gián nhỏ trong bếp và gần thùng rác.",
        pronunciation_focus: [
          "`kecoa` = gián; ở Indonesia cũng nghe `kecoak` trong nói chuyện hằng ngày.",
          "`di dapur` và `dekat tempat sampah` chỉ vị trí cố định nên dùng `di/dekat`, không dùng `ke`.",
          "Lỗi người Việt: đọc `c` như /k/. Trong Indonesia, `c` đọc như 'ch': ke-CHO-a.",
        ],
        pronunciation_focus_en: [
          "`kecoa` means cockroach; you may also hear `kecoak` in everyday speech.",
          "`di dapur` and `dekat tempat sampah` describe fixed locations, so use `di/dekat`, not `ke`.",
          "VN-speaker trap: reading `c` as /k/. In Indonesian, `c` sounds like 'ch': ke-CHO-a.",
        ],
      },
      {
        en: "Nyamuknya banyak sekali setelah hujan.",
        vi: "Muỗi rất nhiều sau khi mưa.",
        pronunciation_focus: [
          "`nyamuk` = muỗi; âm `ny` giống 'nh' trong tiếng Việt, đọc liền: NYA-muk.",
          "`setelah hujan` = sau khi mưa; cụm này hữu ích vì muỗi thường tăng sau mưa.",
          "Lỗi người Việt: tách `nyamuk` thành n-y. `ny` là một âm duy nhất.",
        ],
        pronunciation_focus_en: [
          "`nyamuk` means mosquito; `ny` is one sound, like Vietnamese 'nh': NYA-muk.",
          "`setelah hujan` means after the rain; useful because mosquitoes often increase after rain.",
          "VN-speaker trap: splitting `nyamuk` into n-y. `ny` is a single sound.",
        ],
      },
      {
        en: "Saya melihat tikus di area parkir basement.",
        vi: "Tôi thấy chuột ở khu vực bãi xe tầng hầm.",
        pronunciation_focus: [
          "`tikus` = chuột; dùng cho chuột trong nhà hoặc khu chung cư.",
          "`area parkir basement` là cụm lai Indonesia-Anh rất thường nghe ở apartemen.",
          "Lỗi người Việt: nói `saya lihat tikus ke basement`. Thấy ở đâu là `di basement`, không phải `ke`.",
        ],
        pronunciation_focus_en: [
          "`tikus` means rat or mouse; use it for rodents in a home or apartment complex.",
          "`area parkir basement` is a common Indonesian-English mixed phrase in apartment settings.",
          "VN-speaker trap: saying `saya lihat tikus ke basement`. Seeing something at a place uses `di basement`, not `ke`.",
        ],
      },
      {
        en: "Kapan jadwal pest control untuk lantai ini?",
        vi: "Lịch diệt côn trùng cho tầng này là khi nào?",
        pronunciation_focus: [
          "`jadwal pest control` = lịch pest control; từ tiếng Anh này rất phổ biến trong apartemen.",
          "`lantai ini` = tầng này; `lantai` cũng có nghĩa là sàn, nên ngữ cảnh quyết định.",
          "Lỗi người Việt: hỏi `jam pest control kapan` khi muốn nói lịch. Dùng `jadwal` cho ngày/khung lịch.",
        ],
        pronunciation_focus_en: [
          "`jadwal pest control` means pest-control schedule; the English term is common in apartments.",
          "`lantai ini` means this floor; `lantai` can also mean the floor surface, so context matters.",
          "VN-speaker trap: asking `jam pest control kapan` when you mean schedule. Use `jadwal` for date or schedule.",
        ],
      },
      {
        en: "Petugas akan semprot obat di koridor dan ruang sampah.",
        vi: "Nhân viên sẽ phun thuốc ở hành lang và phòng rác.",
        pronunciation_focus: [
          "`semprot obat` = phun thuốc; trong ngữ cảnh này là thuốc diệt côn trùng.",
          "`koridor` = hành lang; `ruang sampah` = phòng/khu rác của tầng hoặc tòa nhà.",
          "Lỗi người Việt: nói `semprot medicine`. Trong cụm này, `obat` có thể là hóa chất/xịt diệt côn trùng.",
        ],
        pronunciation_focus_en: [
          "`semprot obat` means spray chemicals; in this context, pest-control spray.",
          "`koridor` means corridor; `ruang sampah` is the trash room or waste room.",
          "VN-speaker trap: translating `obat` only as medicine. Here it can mean pest-control chemical.",
        ],
      },
      {
        en: "Bau obatnya cukup kuat, apakah aman untuk anak kecil?",
        vi: "Mùi thuốc khá mạnh, có an toàn cho trẻ nhỏ không?",
        pronunciation_focus: [
          "`bau obat` = mùi thuốc/hóa chất; `baunya` hoặc `bau obatnya` đều tự nhiên.",
          "`cukup kuat` = khá mạnh; cách nói mềm hơn `terlalu menyengat`.",
          "Lỗi người Việt: nói `bau kuat aman?` quá cụt. Câu đầy đủ: `apakah aman untuk anak kecil?`.",
        ],
        pronunciation_focus_en: [
          "`bau obat` means chemical smell; both `baunya` and `bau obatnya` sound natural.",
          "`cukup kuat` means fairly strong; it is softer than `terlalu menyengat`.",
          "VN-speaker trap: saying clipped `bau kuat aman?`. Full polite form: `apakah aman untuk anak kecil?`.",
        ],
      },
      {
        en: "Pengelola apartemen meminta penghuni menutup makanan sebelum penyemprotan.",
        vi: "Ban quản lý căn hộ yêu cầu cư dân đậy thức ăn trước khi phun thuốc.",
        pronunciation_focus: [
          "`pengelola apartemen` = ban quản lý căn hộ/tòa nhà; lịch sự và chính thức hơn `orang apartemen`.",
          "`penghuni` = cư dân/người ở; khác `tamu` là khách.",
          "Lỗi người Việt: dùng `penduduk` cho cư dân căn hộ. Trong tòa nhà, `penghuni` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`pengelola apartemen` means apartment management; it is more official than `orang apartemen`.",
          "`penghuni` means resident or occupant; different from `tamu`, a guest.",
          "VN-speaker trap: using `penduduk` for apartment residents. In a building, `penghuni` is more natural.",
        ],
      },
      {
        en: "Setelah disemprot, tolong buka jendela supaya baunya cepat hilang.",
        vi: "Sau khi phun thuốc, vui lòng mở cửa sổ để mùi nhanh bay đi.",
        pronunciation_focus: [
          "`setelah disemprot` = sau khi được phun; thể bị động `di-` hợp với phòng/khu vực được xử lý.",
          "`supaya baunya cepat hilang` = để mùi nhanh biến mất/bay đi; khung mục đích dùng `supaya`.",
          "Lỗi người Việt: dịch `bay mùi` thành `terbang`. Với mùi, dùng `hilang`.",
        ],
        pronunciation_focus_en: [
          "`setelah disemprot` means after it has been sprayed; passive `di-` fits the treated room or area.",
          "`supaya baunya cepat hilang` means so the smell disappears quickly; `supaya` marks purpose.",
          "VN-speaker trap: translating 'smell flies away' with `terbang`. For smell, use `hilang`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở apartemen Indonesia, pest control thường do pengelola apartemen thông báo theo jadwal, nhất là ở koridor, ruang sampah, basement, và area umum. Trong unit riêng, cư dân thường phải đăng ký jadwal hoặc meminta petugas datang. Khi có kecoa, nyamuk, hoặc tikus, báo vị trí cụ thể và mức độ vấn đề. Sau penyemprotan, nên đậy thức ăn, cất dụng cụ ăn uống, đưa trẻ nhỏ/thú cưng ra khỏi khu vực nếu cần, và mở jendela khi an toàn để giảm bau obat.",
    cultural_notes_en:
      "In Indonesian apartments, pest control is often announced by apartment management on a schedule, especially for corridors, trash rooms, basements, and common areas. For a private unit, residents usually register a slot or ask staff to come. When there are cockroaches, mosquitoes, or rats, report the exact location and severity. After spraying, cover food, put away eating utensils, keep children or pets away if needed, and open windows when safe to reduce the chemical smell.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi báo sự cố, dùng khung rõ: `Saya mau melapor...`, `Ada banyak... di...`, `Kapan jadwal...?`, `Apakah aman untuk...?`. Nhớ `di` cho vị trí (`di dapur`, `di basement`) và `ke` cho hướng đi (`ke lobby`, `ke kantor pengelola`).",
    tip_advice_en:
      "Tip for Vietnamese speakers: when reporting a problem, use clear frames: `Saya mau melapor...`, `Ada banyak... di...`, `Kapan jadwal...?`, `Apakah aman untuk...?`. Remember `di` for location (`di dapur`, `di basement`) and `ke` for direction (`ke lobby`, `ke kantor pengelola`).",
    vocabulary: [
      {
        word: "hama",
        en: "pest",
        vi: "sinh vật gây hại",
        pos: "noun",
        pronunciation_vi: "HA-ma",
        pronunciation_en: "HA-ma",
      },
      {
        word: "kecoa",
        en: "cockroach",
        vi: "gián",
        pos: "noun",
        pronunciation_vi: "ke-CHO-a",
        pronunciation_en: "keh-CHO-ah",
      },
      {
        word: "nyamuk",
        en: "mosquito",
        vi: "muỗi",
        pos: "noun",
        pronunciation_vi: "NYA-muk",
        pronunciation_en: "NYA-mook",
      },
      {
        word: "tikus",
        en: "rat / mouse",
        vi: "chuột",
        pos: "noun",
        pronunciation_vi: "TI-kus",
        pronunciation_en: "TEE-koos",
      },
      {
        word: "semprot obat",
        en: "spray pest-control chemical",
        vi: "phun thuốc",
        pos: "verb phrase",
        pronunciation_vi: "SEM-prot O-bat",
        pronunciation_en: "SEM-prot OH-bat",
      },
      {
        word: "jadwal pest control",
        en: "pest-control schedule",
        vi: "lịch diệt côn trùng",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal pest kon-TROL",
        pronunciation_en: "JAD-wal pest kon-TROL",
      },
      {
        word: "pengelola apartemen",
        en: "apartment management",
        vi: "ban quản lý căn hộ",
        pos: "noun phrase",
        pronunciation_vi: "pe-nge-LO-la a-par-te-MEN",
        pronunciation_en: "pe-nge-LO-la a-par-te-MEN",
      },
      {
        word: "bau obat",
        en: "chemical smell",
        vi: "mùi thuốc / mùi hóa chất",
        pos: "noun phrase",
        pronunciation_vi: "BAU O-bat",
        pronunciation_en: "BAU OH-bat",
      },
    ],
    dialogue: [
      {
        speaker: "Penghuni",
        text: "Selamat siang, saya mau melapor ada banyak kecoa di dapur unit saya.",
        vi: "Chào buổi trưa, tôi muốn báo có nhiều gián trong bếp căn hộ của tôi.",
        en: "Good afternoon, I want to report many cockroaches in my unit's kitchen.",
      },
      {
        speaker: "Pengelola",
        text: "Baik, Bu. Apakah kecoanya muncul setiap hari?",
        vi: "Vâng, chị. Gián xuất hiện mỗi ngày không ạ?",
        en: "Okay, ma'am. Do the cockroaches appear every day?",
      },
      {
        speaker: "Penghuni",
        text: "Iya, terutama dekat tempat sampah. Kapan jadwal pest control?",
        vi: "Có, nhất là gần thùng rác. Lịch pest control là khi nào?",
        en: "Yes, especially near the trash bin. When is the pest-control schedule?",
      },
      {
        speaker: "Pengelola",
        text: "Besok pagi petugas akan semprot obat di lantai Ibu.",
        vi: "Sáng mai nhân viên sẽ phun thuốc ở tầng của chị.",
        en: "Tomorrow morning the staff will spray pesticide on your floor.",
      },
      {
        speaker: "Penghuni",
        text: "Baik. Setelah disemprot, saya akan buka jendela supaya baunya cepat hilang.",
        vi: "Vâng. Sau khi phun thuốc, tôi sẽ mở cửa sổ để mùi nhanh bay đi.",
        en: "Okay. After spraying, I will open the window so the smell disappears quickly.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn báo có côn trùng gây hại trong căn hộ của tôi.",
        prompt_en: "Translate into Indonesian: I want to report pests in my unit.",
        answer: "Saya mau melapor ada hama di unit saya.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Ada banyak ___ kecil di dapur.",
        prompt_en: "Fill in the blank: Ada banyak ___ kecil di dapur.",
        answer: "kecoa",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Lịch pest control cho tầng này là khi nào?",
        prompt_en: "Translate into Indonesian: When is the pest-control schedule for this floor?",
        answer: "Kapan jadwal pest control untuk lantai ini?",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn gọi ban quản lý căn hộ. Hỏi mùi thuốc có an toàn cho trẻ nhỏ không.",
        prompt_en: "You call apartment management. Ask whether the chemical smell is safe for small children.",
        answer: "Bau obatnya cukup kuat, apakah aman untuk anak kecil?",
      },
    ],
  },
];
