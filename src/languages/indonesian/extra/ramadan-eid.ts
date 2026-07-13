// src/languages/indonesian/extra/ramadan-eid.ts
//
// Indonesian Ramadan and Eid practical pack for Vietnamese learners.
// Covers: puasa, sahur, buka puasa, tarawih, Lebaran, mudik, halal bihalal,
// THR, and ketupat. Vietnamese-first with English companions, following the
// established Indonesian extra lesson shape.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
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
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
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
};

export const ramadanEidLessons: IndonesianLesson[] = [
  {
    id: "indonesian_ramadan_daily_routine",
    level: "A2",
    category: "culture",
    title_vi: "Ramadan hằng ngày - sahur, puasa, buka puasa",
    title_en: "Daily Ramadan - sahur, fasting, breaking the fast",
    sentences: [
      {
        en: "Saya bangun jam empat untuk sahur bersama keluarga.",
        vi: "Tôi dậy lúc bốn giờ để ăn sahur cùng gia đình.",
        pronunciation_focus: [
          "bangun → BA-ngun, 'thức dậy'; ng cuối giữ rõ, không đọc thành 'n'",
          "sahur → sa-HUR, bữa ăn trước rạng đông trong Ramadan",
          "bersama keluarga → cùng gia đình; bersama = cùng/với",
        ],
        pronunciation_focus_en: [
          "bangun → 'BA-ngoon' — wake up; keep the final ng sound",
          "sahur → 'sa-HOOR' — pre-dawn meal during Ramadan",
          "bersama keluarga → with family; bersama = together/with",
        ],
      },
      {
        en: "Selama puasa, saya tidak makan dan tidak minum sampai magrib.",
        vi: "Trong lúc nhịn chay, tôi không ăn và không uống cho đến giờ magrib.",
        pronunciation_focus: [
          "selama → se-LA-ma, 'trong suốt' một khoảng thời gian",
          "puasa → pu-A-sa, 'nhịn chay'; người Việt đừng nhầm với ăn chay",
          "sampai magrib → cho đến giờ cầu nguyện hoàng hôn",
        ],
        pronunciation_focus_en: [
          "selama → 'se-LA-ma' — during/throughout a period",
          "puasa → 'poo-A-sa' — fasting; not the same as vegetarian eating",
          "sampai magrib → until the sunset prayer time",
        ],
      },
      {
        en: "Kami buka puasa dengan kurma dan air putih.",
        vi: "Chúng tôi mở chay bằng chà là và nước lọc.",
        pronunciation_focus: [
          "buka puasa → 'mở chay/kết thúc nhịn trong ngày'",
          "dengan → DE-ngan, 'bằng/với'; ng giữa từ cần rõ",
          "air putih → nước lọc, không phải 'nước màu trắng'",
        ],
        pronunciation_focus_en: [
          "buka puasa → 'break the fast' for that day",
          "dengan → 'DE-ngan' — with/by; keep the medial ng clear",
          "air putih → plain water, not literally 'white water'",
        ],
      },
      {
        en: "Setelah berbuka, banyak orang pergi salat tarawih di masjid.",
        vi: "Sau khi mở chay, nhiều người đi cầu nguyện tarawih ở nhà thờ Hồi giáo.",
        pronunciation_focus: [
          "setelah → se-te-LAH, 'sau khi'",
          "berbuka → ber-BU-ka, dạng ber- của buka puasa",
          "tarawih → ta-ra-WIH, lễ cầu nguyện đêm đặc trưng Ramadan",
        ],
        pronunciation_focus_en: [
          "setelah → 'se-te-LAH' — after",
          "berbuka → 'ber-BOO-ka' — ber- form of breaking the fast",
          "tarawih → 'ta-ra-WEEH' — special nightly Ramadan prayer",
        ],
      },
      {
        en: "Warung dekat rumah lebih ramai menjelang buka puasa.",
        vi: "Quán gần nhà đông hơn trước giờ mở chay.",
        pronunciation_focus: [
          "warung → WA-rung, quán nhỏ; ng cuối như trong 'đang'",
          "lebih ramai → đông hơn/nhộn nhịp hơn",
          "menjelang → men-JE-lang, 'sắp đến/trước thời điểm'",
        ],
        pronunciation_focus_en: [
          "warung → 'WA-roong' — small food stall/shop; final ng",
          "lebih ramai → busier/more crowded",
          "menjelang → 'men-JEH-lang' — approaching/right before a time",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong Ramadan ở Indonesia, nhịp ngày thay đổi rõ: nhiều gia đình dậy rất sớm để 'sahur', nhịn ăn uống ban ngày ('puasa'), rồi 'buka puasa' lúc magrib. Trước giờ mở chay, chợ và warung thường rất đông vì mọi người mua takjil - đồ ăn nhẹ để mở chay. Sau đó nhiều người đi 'salat tarawih' ở masjid. Người không theo đạo nên tế nhị: có thể ăn riêng, tránh ăn uống phô trương trước người đang nhịn chay.",
    cultural_notes_en:
      "During Ramadan in Indonesia, the daily rhythm changes clearly: families wake very early for 'sahur', fast during the day ('puasa'), then 'buka puasa' at sunset. Before the fast-breaking time, markets and warung are often busy because people buy takjil - light snacks for breaking the fast. Afterward, many people go to 'salat tarawih' at the mosque. Non-Muslims should be considerate: eating privately is fine, but avoid eating or drinking conspicuously in front of people who are fasting.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'puasa' trong Ramadan là nhịn ăn uống từ rạng đông đến hoàng hôn, không phải 'ăn chay' kiểu không ăn thịt. Cặp mốc cần nhớ: 'sahur' = ăn trước bình minh, 'buka puasa/berbuka' = mở chay lúc magrib. 'Selama' đi với khoảng thời gian; 'sampai' đi với điểm kết thúc.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Ramadan 'puasa' means abstaining from food and drink from dawn to sunset, not vegetarian eating. Remember the two anchors: 'sahur' = pre-dawn meal, 'buka puasa/berbuka' = breaking the fast at sunset. 'Selama' marks a duration; 'sampai' marks the endpoint.",
    vocabulary: [
      {
        cell_id: "96cfccd5-8fbe-432e-bdc6-e8109c9ca2f5",
        word: "puasa",
        en: "fasting",
        vi: "nhịn chay",
        pos: "noun / verb",
        pronunciation_vi: "pu-A-sa",
        pronunciation_en: "poo-A-sa",
      },
      {
        cell_id: "4f23514a-842b-4f83-806f-bde05482c412",
        word: "sahur",
        en: "pre-dawn meal",
        vi: "bữa ăn trước rạng đông",
        pos: "noun",
        pronunciation_vi: "sa-HUR",
        pronunciation_en: "sa-HOOR",
      },
      {
        cell_id: "2509dc3e-13f0-4628-b202-2a75dc0eb41c",
        word: "buka puasa",
        en: "to break the fast",
        vi: "mở chay",
        pos: "verb phrase",
        pronunciation_vi: "BU-ka pu-A-sa",
        pronunciation_en: "BOO-ka poo-A-sa",
      },
      {
        cell_id: "8da93023-0d4d-4cbb-9d73-d506ccc137ac",
        word: "tarawih",
        en: "nightly Ramadan prayer",
        vi: "lễ cầu nguyện tarawih buổi tối",
        pos: "noun",
        pronunciation_vi: "ta-ra-WIH",
        pronunciation_en: "ta-ra-WEEH",
      },
      {
        cell_id: "5e37ba92-b20b-4103-af2d-9b506893c45f",
        word: "magrib",
        en: "sunset prayer time",
        vi: "giờ cầu nguyện hoàng hôn",
        pos: "noun",
        pronunciation_vi: "MAG-rib",
        pronunciation_en: "MAG-rib",
      },
      {
        cell_id: "e4b91127-8912-43c0-83ee-e6d14ff3836c",
        word: "takjil",
        en: "snacks for breaking the fast",
        vi: "đồ ăn nhẹ để mở chay",
        pos: "noun",
        pronunciation_vi: "TAK-jil",
        pronunciation_en: "TAK-jil",
      },
      {
        cell_id: "24f8bdd1-bf28-4680-af12-22954d714f6b",
        word: "air putih",
        en: "plain water",
        vi: "nước lọc",
        pos: "noun phrase",
        pronunciation_vi: "AIR PU-tih",
        pronunciation_en: "AH-eer POO-tih",
      },
    ],
    dialogue: [
      {
        cell_id: "35f0b272-330c-4a8e-8bd9-7cc2d390b111",
        speaker: "Linh",
        text: "Kamu sahur jam berapa tadi pagi?",
        vi: "Sáng nay bạn ăn sahur lúc mấy giờ?",
        en: "What time did you have sahur this morning?",
      },
      {
        cell_id: "6fd2c97c-cfbd-4f24-b362-954b25fede0b",
        speaker: "Raka",
        text: "Jam empat. Sekarang saya puasa sampai magrib.",
        vi: "Bốn giờ. Bây giờ tôi nhịn chay đến giờ magrib.",
        en: "At four. Now I am fasting until sunset prayer time.",
      },
      {
        cell_id: "c4b16fae-8414-4732-8854-79f23bd8f1ef",
        speaker: "Linh",
        text: "Nanti buka puasa di rumah atau di masjid?",
        vi: "Lát nữa bạn mở chay ở nhà hay ở nhà thờ Hồi giáo?",
        en: "Later will you break the fast at home or at the mosque?",
      },
      {
        cell_id: "1e34fb07-3e74-4d76-8209-e34abb7a0fb7",
        speaker: "Raka",
        text: "Di rumah dulu, lalu salat tarawih di masjid.",
        vi: "Ở nhà trước, rồi cầu nguyện tarawih ở nhà thờ Hồi giáo.",
        en: "At home first, then tarawih prayer at the mosque.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ Ramadan còn thiếu:",
        instruction_en: "Fill in the missing Ramadan word:",
        items: [
          {
            prompt: "Saya bangun jam empat untuk ___. (bữa trước bình minh)",
            answer: "sahur",
            options: ["sahur", "siang", "sehat"],
          },
          {
            prompt: "Kami ___ puasa dengan kurma. (mở chay)",
            answer: "buka",
            options: ["buka", "bawa", "beli"],
          },
          {
            prompt: "Setelah berbuka, banyak orang salat ___. (cầu nguyện đêm Ramadan)",
            answer: "tarawih",
            options: ["tarawih", "terima", "tawar"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "puasa", answer: "nhịn chay" },
          { prompt: "sahur", answer: "bữa ăn trước rạng đông" },
          { prompt: "magrib", answer: "giờ cầu nguyện hoàng hôn" },
          { prompt: "takjil", answer: "đồ ăn nhẹ để mở chay" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi dậy lúc bốn giờ để ăn sahur.", answer: "Saya bangun jam empat untuk sahur." },
          { prompt: "Chúng tôi mở chay bằng chà là và nước lọc.", answer: "Kami buka puasa dengan kurma dan air putih." },
          { prompt: "Sau khi mở chay, nhiều người đi cầu nguyện tarawih.", answer: "Setelah berbuka, banyak orang pergi salat tarawih." },
        ],
      },
    ],
  },
  {
    id: "indonesian_eid_lebaran_family_work",
    level: "B1",
    category: "culture",
    title_vi: "Lebaran - mudik, THR, halal bihalal",
    title_en: "Lebaran - homecoming, THR, halal bihalal",
    sentences: [
      {
        en: "Menjelang Lebaran, banyak orang mudik ke kampung halaman.",
        vi: "Trước Lebaran, nhiều người về quê.",
        pronunciation_focus: [
          "menjelang Lebaran → gần đến dịp Lebaran/Idul Fitri",
          "mudik → MU-dik, về quê dịp lễ; rất đặc trưng Indonesia",
          "kampung halaman → quê nhà/nơi gốc gác",
        ],
        pronunciation_focus_en: [
          "menjelang Lebaran → approaching Lebaran/Eid al-Fitr",
          "mudik → 'MOO-dik' — holiday homecoming; very Indonesian",
          "kampung halaman → hometown/place of origin",
        ],
      },
      {
        en: "Perusahaan biasanya membayar THR sebelum hari raya.",
        vi: "Công ty thường trả THR trước ngày lễ.",
        pronunciation_focus: [
          "perusahaan → pe-ru-SA-ha-an, 'công ty'",
          "membayar → mem-BA-yar, 'trả/thanh toán'",
          "THR → té-ha-ér, tiền thưởng lễ Tunjangan Hari Raya",
        ],
        pronunciation_focus_en: [
          "perusahaan → 'pe-roo-SA-ha-an' — company",
          "membayar → 'mem-BA-yar' — pay",
          "THR → 'teh-ha-er' — holiday allowance, Tunjangan Hari Raya",
        ],
      },
      {
        en: "Di hari Lebaran, keluarga makan ketupat dan opor ayam.",
        vi: "Vào ngày Lebaran, gia đình ăn ketupat và cà ri gà opor.",
        pronunciation_focus: [
          "di hari Lebaran → vào ngày Lebaran; di + thời điểm cũng gặp trong văn nói",
          "ketupat → ke-TU-pat, bánh gạo gói lá dừa",
          "opor ayam → O-por A-yam, món gà nước cốt dừa",
        ],
        pronunciation_focus_en: [
          "di hari Lebaran → on Lebaran day; di + time appears in speech",
          "ketupat → 'ke-TOO-pat' — rice cake in woven coconut leaves",
          "opor ayam → 'OH-por A-yam' — chicken in coconut milk sauce",
        ],
      },
      {
        en: "Kami saling meminta maaf dan bersilaturahmi ke rumah saudara.",
        vi: "Chúng tôi xin lỗi nhau và đi thăm họ hàng để giữ tình thân.",
        pronunciation_focus: [
          "saling meminta maaf → xin lỗi lẫn nhau",
          "bersilaturahmi → ber-si-la-tu-RAH-mi, thăm hỏi/giữ quan hệ thân tộc",
          "saudara → sau-DA-ra, họ hàng/anh chị em tùy ngữ cảnh",
        ],
        pronunciation_focus_en: [
          "saling meminta maaf → ask forgiveness from one another",
          "bersilaturahmi → 'ber-see-la-too-RAH-mee' — visit/maintain kinship ties",
          "saudara → 'sau-DA-ra' — relatives/siblings depending on context",
        ],
      },
      {
        en: "Minggu depan kantor mengadakan halal bihalal untuk semua karyawan.",
        vi: "Tuần sau văn phòng tổ chức buổi halal bihalal cho tất cả nhân viên.",
        pronunciation_focus: [
          "mengadakan → me-NGA-da-kan, 'tổ chức'; nga là một âm",
          "halal bihalal → ha-LAL bi-ha-LAL, buổi gặp mặt xin lỗi/chúc mừng sau Lebaran",
          "karyawan → kar-YA-wan, nhân viên",
        ],
        pronunciation_focus_en: [
          "mengadakan → 'me-NGA-da-kan' — hold/organize; nga is one sound",
          "halal bihalal → 'ha-LAL bee-ha-LAL' — post-Eid gathering for greetings/forgiveness",
          "karyawan → 'kar-YA-wan' — employee",
        ],
      },
    ],
    cultural_notes_vi:
      "'Lebaran' là tên rất phổ biến ở Indonesia cho Idul Fitri, ngày kết thúc Ramadan. 'Mudik' là cuộc về quê khổng lồ trước lễ, khiến vé tàu, máy bay và đường cao tốc rất đông. Người lao động thường nhận 'THR' - Tunjangan Hari Raya, khoản tiền lễ bắt buộc trong nhiều bối cảnh việc làm chính thức. Món biểu tượng là 'ketupat' ăn với opor ayam, rendang hoặc sambal goreng. Sau lễ, gia đình, hàng xóm và công ty tổ chức 'halal bihalal' để gặp nhau, bắt tay, xin lỗi và nối lại quan hệ.",
    cultural_notes_en:
      "'Lebaran' is the common Indonesian name for Idul Fitri, the holiday ending Ramadan. 'Mudik' is the massive homecoming before the holiday, making train tickets, flights, and highways extremely busy. Workers often receive 'THR' - Tunjangan Hari Raya, a holiday allowance required in many formal employment contexts. The symbolic food is 'ketupat', eaten with opor ayam, rendang, or sambal goreng. After the holiday, families, neighbors, and offices hold 'halal bihalal' gatherings to meet, shake hands, ask forgiveness, and renew relationships.",
    tip_advice_vi:
      "Mẹo cho người Việt: câu chúc trang trọng là 'Selamat Idul Fitri, mohon maaf lahir dan batin' - xin lỗi cả lỗi bên ngoài lẫn trong lòng. Trong văn nói, 'Lebaran' thường tự nhiên hơn 'Idul Fitri'. 'Mudik' không chỉ là 'pulang kampung' thông thường; nó là về quê dịp lễ lớn với sắc thái văn hóa rất mạnh.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the formal greeting is 'Selamat Idul Fitri, mohon maaf lahir dan batin' - asking forgiveness outwardly and inwardly. In everyday speech, 'Lebaran' often sounds more natural than 'Idul Fitri'. 'Mudik' is not just ordinary 'pulang kampung'; it is culturally loaded holiday homecoming.",
    vocabulary: [
      {
        cell_id: "791bceae-8b25-42d9-a36e-32e945d4172e",
        word: "Lebaran",
        en: "Eid al-Fitr holiday in Indonesian usage",
        vi: "lễ kết thúc Ramadan ở Indonesia",
        pos: "noun",
        pronunciation_vi: "le-BA-ran",
        pronunciation_en: "le-BA-ran",
      },
      {
        cell_id: "888834cf-20b7-4abe-9e8e-cde4ee220c1b",
        word: "mudik",
        en: "holiday homecoming",
        vi: "về quê dịp lễ",
        pos: "verb / noun",
        pronunciation_vi: "MU-dik",
        pronunciation_en: "MOO-dik",
      },
      {
        cell_id: "a699c170-f4e9-4ff4-8de4-43089b04340d",
        word: "THR",
        en: "holiday allowance",
        vi: "tiền thưởng lễ",
        pos: "noun",
        pronunciation_vi: "té-ha-ér",
        pronunciation_en: "teh-ha-er",
      },
      {
        cell_id: "ffffd22e-7acb-4f6d-84f5-861ba6ab9f45",
        word: "ketupat",
        en: "rice cake in woven coconut leaves",
        vi: "bánh gạo gói lá dừa",
        pos: "noun",
        pronunciation_vi: "ke-TU-pat",
        pronunciation_en: "ke-TOO-pat",
      },
      {
        cell_id: "049c9981-e4a5-4803-ae76-584bef78f1be",
        word: "halal bihalal",
        en: "post-Eid gathering for greetings and forgiveness",
        vi: "buổi gặp mặt sau Lebaran để chúc mừng/xin lỗi",
        pos: "noun phrase",
        pronunciation_vi: "ha-LAL bi-ha-LAL",
        pronunciation_en: "ha-LAL bee-ha-LAL",
      },
      {
        cell_id: "5d24e1aa-32fc-4cd1-9d5e-85b9c6a2394e",
        word: "bersilaturahmi",
        en: "to visit and maintain social/family ties",
        vi: "thăm hỏi/giữ tình thân",
        pos: "verb",
        pronunciation_vi: "ber-si-la-tu-RAH-mi",
        pronunciation_en: "ber-see-la-too-RAH-mee",
      },
      {
        cell_id: "1bc9ff75-8aa7-4166-a12d-d4dfec5da9e0",
        word: "mohon maaf lahir dan batin",
        en: "please forgive me outwardly and inwardly",
        vi: "xin tha lỗi cả ngoài mặt lẫn trong lòng",
        pos: "set phrase",
        pronunciation_vi: "MO-hon ma-AF LA-hir dan BA-tin",
        pronunciation_en: "MOH-hon ma-AF LA-hir dan BA-tin",
      },
    ],
    dialogue: [
      {
        cell_id: "08c12d68-216c-4438-bbe9-37b6d5ad9d47",
        speaker: "Sari",
        text: "Kamu mudik ke mana tahun ini?",
        vi: "Năm nay bạn về quê ở đâu?",
        en: "Where are you going for mudik this year?",
      },
      {
        cell_id: "4014655c-03df-4505-9007-3a0ba06b5f31",
        speaker: "Dimas",
        text: "Saya mudik ke Solo. Tiket kereta sudah habis cepat sekali.",
        vi: "Tôi về Solo. Vé tàu đã hết rất nhanh.",
        en: "I'm going home to Solo. Train tickets sold out very quickly.",
      },
      {
        cell_id: "e1fa5383-e2cb-49d1-ba07-2196bb5c34ad",
        speaker: "Sari",
        text: "Semoga THR segera cair sebelum Lebaran.",
        vi: "Mong là THR sớm được trả trước Lebaran.",
        en: "Hopefully the THR is paid out soon before Lebaran.",
      },
      {
        cell_id: "50dc16ef-b63f-4576-9c1e-61f7dbd0478b",
        speaker: "Dimas",
        text: "Amin. Setelah Lebaran, kantor ada halal bihalal.",
        vi: "Amin. Sau Lebaran, văn phòng có buổi halal bihalal.",
        en: "Amen. After Lebaran, the office has a halal bihalal gathering.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ Lebaran còn thiếu:",
        instruction_en: "Fill in the missing Lebaran word:",
        items: [
          {
            prompt: "Menjelang Lebaran, banyak orang ___ ke kampung halaman. (về quê dịp lễ)",
            answer: "mudik",
            options: ["mudik", "masuk", "mandi"],
          },
          {
            prompt: "Perusahaan biasanya membayar ___ sebelum hari raya. (tiền thưởng lễ)",
            answer: "THR",
            options: ["THR", "KTP", "SIM"],
          },
          {
            prompt: "Keluarga makan ___ dan opor ayam. (bánh gạo gói lá dừa)",
            answer: "ketupat",
            options: ["ketupat", "kerupuk", "kelapa"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "Lebaran", answer: "lễ kết thúc Ramadan" },
          { prompt: "mudik", answer: "về quê dịp lễ" },
          { prompt: "THR", answer: "tiền thưởng lễ" },
          { prompt: "halal bihalal", answer: "buổi gặp mặt sau Lebaran" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Trước Lebaran, nhiều người về quê.", answer: "Menjelang Lebaran, banyak orang mudik." },
          { prompt: "Công ty thường trả THR trước ngày lễ.", answer: "Perusahaan biasanya membayar THR sebelum hari raya." },
          { prompt: "Tuần sau văn phòng tổ chức halal bihalal.", answer: "Minggu depan kantor mengadakan halal bihalal." },
        ],
      },
    ],
  },
];
