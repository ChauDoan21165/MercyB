// Student boarding costs Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 30 file. Covers anak kos, uang bulanan, makan hemat, bayar kos,
// laundry, transport kampus, kiriman orang tua, and tabungan.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
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
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
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
    id: "indonesian_student_boarding_costs",
    level: "A2",
    category: "money",
    title_vi: "Chi phí sinh viên ở kos",
    title_en: "Student boarding-house costs",
    sentences: [
      {
        en: "Saya anak kos dekat kampus.",
        vi: "Tôi là sinh viên/người ở trọ gần trường đại học.",
        pronunciation_focus: [
          "SA-ya A-nak KOS de-KAT KAM-pus - `anak kos` = người sống ở kos/nhà trọ, thường là sinh viên hoặc người đi làm xa nhà.",
          "`kos` là nhà trọ/phòng trọ kiểu Indonesia. `Anak kos` không có nghĩa là trẻ con.",
          "Lỗi người Việt: dịch `anak` lúc nào cũng là em bé/trẻ em. Trong cụm này, `anak kos` = dân ở trọ.",
        ],
        pronunciation_focus_en: [
          "SA-ya A-nak KOS deh-KAT KAM-poos - `anak kos` = someone living in a boarding room, often a student or worker away from home.",
          "`Kos` is an Indonesian boarding room/boarding house. `Anak kos` does not mean a child.",
          "VN-speaker trap: translating `anak` only as child. In this phrase, `anak kos` = boarding-house resident.",
        ],
      },
      {
        en: "Uang bulanan saya harus cukup sampai akhir bulan.",
        vi: "Tiền sinh hoạt hằng tháng của tôi phải đủ đến cuối tháng.",
        pronunciation_focus: [
          "U-ang bu-LA-nan SA-ya HA-rus CU-kup SAM-pai A-khir BU-lan - `uang bulanan` = tiền hằng tháng/tiền sinh hoạt; `akhir bulan` = cuối tháng.",
          "`cukup sampai` = đủ đến. Cụm này rất tự nhiên khi nói ngân sách sinh viên.",
          "Lỗi người Việt: nói `uang bulan` thiếu hậu tố. Cụm tự nhiên là `uang bulanan`.",
        ],
        pronunciation_focus_en: [
          "OO-ang boo-LA-nan SA-ya HA-roos CHOO-koom SAM-pai A-khir BOO-lan - `uang bulanan` = monthly allowance/living money; `akhir bulan` = end of the month.",
          "`Cukup sampai` = enough until. This is natural for student budgets.",
          "VN-speaker trap: saying `uang bulan` without the suffix. Natural phrase: `uang bulanan`.",
        ],
      },
      {
        en: "Saya harus bayar kos sebelum tanggal lima.",
        vi: "Tôi phải trả tiền phòng trọ trước ngày mùng năm.",
        pronunciation_focus: [
          "SA-ya HA-rus BA-yar KOS se-BE-lum TANG-gal LI-ma - `bayar kos` = trả tiền phòng trọ; `tanggal lima` = ngày mùng năm.",
          "`bayar kos` thường đã ngầm hiểu là tiền thuê phòng, không cần luôn nói `uang sewa kos`.",
          "Lỗi người Việt: nói `bayar rumah kos` có thể nghe như mua cả nhà. Nói `bayar kos` hoặc `bayar sewa kos`.",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-roos BA-yar KOS seh-BE-loom TANG-gal LEE-ma - `bayar kos` = pay boarding-room rent; `tanggal lima` = the fifth date.",
          "`Bayar kos` usually already means paying boarding-room rent; no need to always say `uang sewa kos`.",
          "VN-speaker trap: `bayar rumah kos` may sound like paying for the whole building. Say `bayar kos` or `bayar sewa kos`.",
        ],
      },
      {
        en: "Saya makan hemat di warteg dekat kos.",
        vi: "Tôi ăn tiết kiệm ở quán warteg gần phòng trọ.",
        pronunciation_focus: [
          "SA-ya MA-kan HE-mat di WAR-teg de-KAT KOS - `makan hemat` = ăn tiết kiệm; `warteg` = quán cơm bình dân kiểu Tegal.",
          "`hemat` = tiết kiệm, không phải nghèo. Cụm này trung tính và thực tế.",
          "Lỗi người Việt: dịch 'ăn rẻ' thành `makan murah` nghe hơi lạ. Nói `makan hemat` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-kan HEH-mat dee WAR-teg deh-KAT KOS - `makan hemat` = eat frugally; `warteg` = inexpensive Tegal-style food stall.",
          "`Hemat` means economical/frugal, not poor. The phrase is neutral and practical.",
          "VN-speaker note: translating 'eat cheap' as `makan murah` sounds odd. `Makan hemat` is more natural.",
        ],
      },
      {
        en: "Laundry kiloan lebih praktis, tapi biayanya cepat terasa.",
        vi: "Giặt ủi tính ký tiện hơn, nhưng chi phí nhanh chóng cảm thấy đáng kể.",
        pronunciation_focus: [
          "LAUN-dry ki-LO-an le-BIH PRAK-tis, TA-pi BI-a-ya-nya CE-pat te-RA-sa - `laundry kiloan` = giặt ủi tính theo ký; `biayanya terasa` = chi phí thấy rõ/cảm thấy nặng.",
          "`kiloan` là tính theo kilogram, rất phổ biến quanh kos và kampus.",
          "Lỗi người Việt: nói `laundry kilogram` nghe ít tự nhiên hơn `laundry kiloan`.",
        ],
        pronunciation_focus_en: [
          "LAUN-dry kee-LO-an leh-BIH PRAK-tis, TA-pee BEE-a-ya-nya CHEH-pat teh-RA-sa - `laundry kiloan` = laundry charged by the kilogram; `biayanya terasa` = the cost becomes noticeable.",
          "`Kiloan` means by the kilogram, very common around boarding houses and campuses.",
          "VN-speaker note: `laundry kilogram` sounds less natural than `laundry kiloan`.",
        ],
      },
      {
        en: "Transport kampus paling murah naik bus kampus.",
        vi: "Phương tiện đến trường rẻ nhất là đi xe buýt của trường.",
        pronunciation_focus: [
          "trans-PORT KAM-pus PA-ling MU-rah NAIK bus KAM-pus - `transport kampus` = phương tiện đi lại đến/trong trường; `paling murah` = rẻ nhất.",
          "`naik bus` = đi xe buýt. Dùng `naik` cho phương tiện.",
          "Lỗi người Việt: nói `pergi bus`. Với phương tiện, dùng `naik bus`, không phải `pergi bus`.",
        ],
        pronunciation_focus_en: [
          "trans-PORT KAM-poos PA-ling MOO-rah NAIK boos KAM-poos - `transport kampus` = campus transport; `paling murah` = cheapest.",
          "`Naik bus` = take a bus. Use `naik` for transport.",
          "VN-speaker trap: saying `pergi bus`. For vehicles, use `naik bus`, not `pergi bus`.",
        ],
      },
      {
        en: "Kiriman orang tua biasanya masuk awal bulan.",
        vi: "Tiền gửi từ bố mẹ thường vào đầu tháng.",
        pronunciation_focus: [
          "ki-RI-man O-rang TU-a bi-A-sa-nya MA-suk A-wal BU-lan - `kiriman orang tua` = tiền/đồ bố mẹ gửi; `awal bulan` = đầu tháng.",
          "`masuk` trong ngữ cảnh tiền nghĩa là tiền đã vào tài khoản/đã nhận được.",
          "Lỗi người Việt: hiểu `orang tua` là người già. Trong ngữ cảnh sinh viên, `orang tua` thường là bố mẹ.",
        ],
        pronunciation_focus_en: [
          "kee-REE-man O-rang TOO-a bee-A-sa-nya MA-sook A-wal BOO-lan - `kiriman orang tua` = money/items sent by parents; `awal bulan` = beginning of the month.",
          "`Masuk` for money means it has come into the account/been received.",
          "VN-speaker trap: reading `orang tua` as elderly people. In student contexts, it usually means parents.",
        ],
      },
      {
        en: "Kalau kiriman terlambat, saya harus mengurangi jajan.",
        vi: "Nếu tiền gửi đến muộn, tôi phải giảm ăn vặt/chi tiêu linh tinh.",
        pronunciation_focus: [
          "KA-lau ki-RI-man ter-LAM-bat, SA-ya HA-rus me-ngu-RA-ngi JA-jan - `terlambat` = muộn; `mengurangi jajan` = giảm ăn vặt/chi tiêu vặt.",
          "`jajan` có thể là mua đồ ăn vặt hoặc chi tiêu nhỏ ngoài bữa chính.",
          "Lỗi người Việt: dịch `ăn vặt` thành `makan kecil` nghe lạ. Tiếng Indonesia dùng `jajan`.",
        ],
        pronunciation_focus_en: [
          "KA-lau kee-REE-man ter-LAM-bat, SA-ya HA-roos meh-ngoo-RA-ngi JA-jan - `terlambat` = late; `mengurangi jajan` = reduce snacks/small spending.",
          "`Jajan` can mean buying snacks or small nonessential spending.",
          "VN-speaker trap: translating snacks as `makan kecil`, which sounds odd. Indonesian uses `jajan`.",
        ],
      },
      {
        en: "Saya sisihkan sedikit uang untuk tabungan.",
        vi: "Tôi để riêng một ít tiền để tiết kiệm.",
        pronunciation_focus: [
          "SA-ya si-SIH-kan se-DI-kit U-ang UN-tuk ta-BU-ngan - `sisihkan` = để riêng; `tabungan` = tiền tiết kiệm.",
          "`sedikit uang` = một ít tiền. Câu này tự nhiên cho thói quen tiết kiệm nhỏ.",
          "Lỗi người Việt: nói `simpan uang tabungan` không sai, nhưng `sisihkan uang untuk tabungan` rõ hành động hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya see-SIH-kan seh-DEE-kit OO-ang OON-took ta-BOO-ngan - `sisihkan` = set aside; `tabungan` = savings.",
          "`Sedikit uang` = a little money. This is natural for small saving habits.",
          "VN-speaker note: `simpan uang tabungan` is not wrong, but `sisihkan uang untuk tabungan` shows the action more clearly.",
        ],
      },
      {
        en: "Saya catat pengeluaran harian di aplikasi.",
        vi: "Tôi ghi lại chi tiêu hằng ngày trong ứng dụng.",
        pronunciation_focus: [
          "SA-ya CA-tat pe-nge-LU-ar-an ha-RI-an di ap-li-KA-si - `pengeluaran harian` = chi tiêu hằng ngày; `catat` = ghi lại.",
          "`pengeluaran` là danh từ cho khoản chi, rất hữu ích khi lập ngân sách.",
          "Lỗi người Việt: nói `uang keluar harian` hiểu được nhưng thô. Từ tự nhiên là `pengeluaran harian`.",
        ],
        pronunciation_focus_en: [
          "SA-ya CHA-tat peh-ngeh-LOO-ar-an ha-REE-an dee ap-lee-KA-see - `pengeluaran harian` = daily expenses; `catat` = record.",
          "`Pengeluaran` is the noun for expenses, useful for budgeting.",
          "VN-speaker note: `uang keluar harian` is understandable but rough. Natural phrase: `pengeluaran harian`.",
        ],
      },
      {
        en: "Akhir bulan biasanya paling berat untuk anak kos.",
        vi: "Cuối tháng thường là lúc nặng nhất đối với dân ở trọ.",
        pronunciation_focus: [
          "A-khir BU-lan bi-A-sa-nya PA-ling BE-rat UN-tuk A-nak KOS - `akhir bulan` = cuối tháng; `paling berat` = nặng/khó nhất.",
          "`berat` ở đây nghĩa là khó khăn về tài chính, không phải nặng cân.",
          "Lỗi người Việt: dịch `khó khăn` lúc nào cũng là `susah`. `Paling berat` rất tự nhiên trong chuyện tiền cuối tháng.",
        ],
        pronunciation_focus_en: [
          "A-khir BOO-lan bee-A-sa-nya PA-ling BEH-rat OON-took A-nak KOS - `akhir bulan` = end of the month; `paling berat` = hardest/heaviest.",
          "`Berat` here means financially difficult, not physically heavy.",
          "VN-speaker note: not every 'difficult' needs `susah`. `Paling berat` is natural for end-of-month money pressure.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `anak kos` thường phải tự quản lý uang bulanan: bayar kos, makan, laundry, transport kampus, pulsa/data, jajan, và tabungan kecil. Nhiều sinh viên ăn ở warteg hoặc masak đơn giản để `makan hemat`. Tiền từ bố mẹ thường gọi là `kiriman orang tua`; nếu đến muộn, câu nói về giảm jajan hoặc catat pengeluaran nghe tự nhiên và không quá bi kịch.",
    cultural_notes_en:
      "In Indonesia, `anak kos` often manage their own monthly allowance: boarding rent, food, laundry, campus transport, phone/data credit, snacks, and small savings. Many students eat at warteg or cook simply to save money. Money from parents is commonly called `kiriman orang tua`; if it arrives late, talking about reducing snacks or tracking expenses sounds natural and not overly dramatic.",
    tip_advice_vi:
      "Mẫu câu thực tế: `Uang bulanan saya harus cukup sampai akhir bulan. Saya bayar kos sebelum tanggal lima, makan hemat di warteg, dan sisihkan sedikit uang untuk tabungan.`",
    tip_advice_en:
      "Practical template: `Uang bulanan saya harus cukup sampai akhir bulan. Saya bayar kos sebelum tanggal lima, makan hemat di warteg, dan sisihkan sedikit uang untuk tabungan.`",
    vocabulary: [
      {
        cell_id: "5e47cc4f-4677-494e-b86d-3687ff3344a3",
        word: "anak kos",
        en: "boarding-house resident; student renter",
        vi: "dân ở trọ/sinh viên ở kos",
        pos: "noun",
        pronunciation_vi: "A-nak KOS",
        pronunciation_en: "A-nak KOS",
      },
      {
        cell_id: "7f863cb3-38b9-436a-9189-f0ff1ac83800",
        word: "uang bulanan",
        en: "monthly allowance",
        vi: "tiền sinh hoạt hằng tháng",
        pos: "noun",
        pronunciation_vi: "U-ang bu-LA-nan",
        pronunciation_en: "OO-ang boo-LA-nan",
      },
      {
        cell_id: "12bb59d9-f721-4a6a-8f2d-74a7aabe127e",
        word: "makan hemat",
        en: "eat frugally",
        vi: "ăn tiết kiệm",
        pos: "verb phrase",
        pronunciation_vi: "MA-kan HE-mat",
        pronunciation_en: "MA-kan HEH-mat",
      },
      {
        cell_id: "d30fca78-f6cf-4e53-b84c-a9057f9187da",
        word: "bayar kos",
        en: "pay boarding-room rent",
        vi: "trả tiền phòng trọ",
        pos: "verb phrase",
        pronunciation_vi: "BA-yar KOS",
        pronunciation_en: "BA-yar KOS",
      },
      {
        cell_id: "078a2f25-c742-4653-87c7-882d3c35fd0b",
        word: "laundry kiloan",
        en: "laundry by the kilogram",
        vi: "giặt ủi tính ký",
        pos: "noun",
        pronunciation_vi: "LAUN-dry ki-LO-an",
        pronunciation_en: "LAUN-dry kee-LO-an",
      },
      {
        cell_id: "ddf02cb7-84c3-4bb4-a339-cac1dd1724e9",
        word: "transport kampus",
        en: "campus transport",
        vi: "phương tiện đi lại đến/trong trường",
        pos: "noun",
        pronunciation_vi: "trans-PORT KAM-pus",
        pronunciation_en: "trans-PORT KAM-poos",
      },
      {
        cell_id: "54710fbd-d352-480d-a25b-494b64670343",
        word: "kiriman orang tua",
        en: "money/items sent by parents",
        vi: "tiền/đồ bố mẹ gửi",
        pos: "noun",
        pronunciation_vi: "ki-RI-man O-rang TU-a",
        pronunciation_en: "kee-REE-man O-rang TOO-a",
      },
      {
        cell_id: "8859ce18-d6f5-45ac-9be4-a5ba008d6b82",
        word: "tabungan",
        en: "savings",
        vi: "tiền tiết kiệm",
        pos: "noun",
        pronunciation_vi: "ta-BU-ngan",
        pronunciation_en: "ta-BOO-ngan",
      },
      {
        cell_id: "2e0b033a-f3d2-4d3e-9761-89633d7b6169",
        word: "pengeluaran harian",
        en: "daily expenses",
        vi: "chi tiêu hằng ngày",
        pos: "noun",
        pronunciation_vi: "pe-nge-LU-ar-an ha-RI-an",
        pronunciation_en: "peh-ngeh-LOO-ar-an ha-REE-an",
      },
      {
        cell_id: "18785de0-bab1-4b3e-9591-373f889f78e6",
        word: "mengurangi jajan",
        en: "reduce snacks/small spending",
        vi: "giảm ăn vặt/chi tiêu vặt",
        pos: "verb phrase",
        pronunciation_vi: "me-ngu-RA-ngi JA-jan",
        pronunciation_en: "meh-ngoo-RA-ngi JA-jan",
      },
    ],
    dialogue: [
      {
        cell_id: "ed561484-4bf1-41a0-83a4-89a581ac7fb8",
        speaker: "Mahasiswa",
        text: "Bulan ini uang bulanan saya agak ketat.",
        vi: "Tháng này tiền sinh hoạt của tôi hơi eo hẹp.",
        en: "This month my allowance is a bit tight.",
      },
      {
        cell_id: "1f929b75-c077-4299-bcdf-77e6cfb01e62",
        speaker: "Teman kos",
        text: "Kamu sudah bayar kos?",
        vi: "Bạn đã trả tiền phòng trọ chưa?",
        en: "Have you paid the boarding rent?",
      },
      {
        cell_id: "e395ae59-9ec3-4988-9bf0-41054d49cae9",
        speaker: "Mahasiswa",
        text: "Sudah, sebelum tanggal lima. Sekarang saya harus makan hemat.",
        vi: "Rồi, trước ngày mùng năm. Bây giờ tôi phải ăn tiết kiệm.",
        en: "Yes, before the fifth. Now I have to eat frugally.",
      },
      {
        cell_id: "dedb3404-639a-462b-972d-fdee1186b12c",
        speaker: "Teman kos",
        text: "Warteg dekat kampus lumayan murah.",
        vi: "Quán warteg gần trường khá rẻ.",
        en: "The warteg near campus is fairly cheap.",
      },
      {
        cell_id: "76c7f142-9a0a-43eb-88ea-2e43335e0dd2",
        speaker: "Mahasiswa",
        text: "Iya, saya juga mau mengurangi jajan dan catat pengeluaran harian.",
        vi: "Ừ, tôi cũng muốn giảm ăn vặt/chi tiêu vặt và ghi lại chi tiêu hằng ngày.",
        en: "Yes, I also want to reduce small spending and record daily expenses.",
      },
      {
        cell_id: "83a43f5b-ecb7-4639-8159-f1a424402e02",
        speaker: "Teman kos",
        text: "Kalau bisa, sisihkan sedikit untuk tabungan.",
        vi: "Nếu được, hãy để riêng một ít để tiết kiệm.",
        en: "If possible, set aside a little for savings.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi phải trả tiền phòng trọ trước ngày mùng năm.",
        prompt_en: "Translate into Indonesian: I have to pay boarding rent before the fifth.",
        answer: "Saya harus bayar kos sebelum tanggal lima.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Saya sisihkan sedikit uang untuk ___.",
        prompt_en: "Fill in the blank: Saya sisihkan sedikit uang untuk ___.",
        answer: "tabungan",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào tự nhiên nhất khi nói ăn tiết kiệm?",
        prompt_en: "Which sentence is most natural for eating frugally?",
        options: [
          "Saya makan hemat di warteg dekat kos.",
          "Saya makan murah diri sendiri.",
          "Saya makan uang sedikit saja selalu.",
        ],
        answer: "Saya makan hemat di warteg dekat kos.",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["anak kos", "dân ở trọ"],
          ["uang bulanan", "tiền sinh hoạt hằng tháng"],
          ["laundry kiloan", "giặt ủi tính ký"],
        ],
      },
    ],
    content:
      "Use this lesson for student boarding-house budgeting: talking about monthly allowance, rent, cheap meals, laundry, campus transport, parent transfers, daily expenses, and small savings.",
  },
];
