// src/languages/indonesian/extra/ramadan-lebaran.ts
//
// Indonesian Ramadan & Lebaran pack for Vietnamese learners.
// Covers: fasting basics (puasa, sahur, buka puasa), the Idul Fitri holiday
// (mudik, THR, ketupat, baju baru), and greetings/etiquette (mohon maaf lahir
// batin, silaturahmi, halal bihalal). Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts so the
// page UI stays consistent across language verticals. The types are defined
// inline because the per-file shapes diverge slightly between authoring waves —
// this file is self-contained on purpose. Types are NOT exported and the lesson
// array uses a unique name so a future barrel `export *` cannot collide with the
// sibling extra packs.
//
// Field convention (inherited from the Portuguese pack): a sentence's `en` slot
// holds the TARGET-LANGUAGE text (here: Indonesian), `vi` holds the Vietnamese
// gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation/grammar
// notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// Indonesian uses the Latin alphabet — no special script rendering needed.

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

export const ramadanLebaranLessons: IndonesianLesson[] = [
  {
    id: "indonesian_ramadan_puasa_basics",
    level: "A1",
    category: "culture",
    title_vi: "Tháng Ramadan — nhịn ăn, sahur, mở chay",
    title_en: "Ramadan — fasting, sahur, breaking the fast",
    sentences: [
      {
        en: "Bulan ini umat Islam menjalankan puasa.",
        vi: "Tháng này người Hồi giáo thực hiện việc nhịn chay.",
        pronunciation_focus: [
          "bulan → BU-lan, 'tháng' (cũng nghĩa 'mặt trăng')",
          "umat Islam → 'cộng đồng/tín đồ Hồi giáo'",
          "puasa → pu-A-sa, 'nhịn ăn chay (theo đạo)'",
        ],
        pronunciation_focus_en: [
          "bulan → 'BOO-lan' — month (also 'moon')",
          "umat Islam → 'the Muslim community/believers'",
          "puasa → 'poo-A-sa' — (religious) fasting",
        ],
      },
      {
        en: "Saya bangun pagi untuk makan sahur.",
        vi: "Tôi dậy sớm để ăn bữa sahur (trước bình minh).",
        pronunciation_focus: [
          "bangun → BA-ngun, 'thức dậy'",
          "untuk → UN-tuk, 'để (mục đích)'",
          "sahur → sa-HUR, 'bữa ăn trước rạng đông' trong Ramadan",
        ],
        pronunciation_focus_en: [
          "bangun → 'BA-ngoon' — to wake up",
          "untuk → 'OON-took' — for/in order to",
          "sahur → 'sa-HOOR' — the pre-dawn meal during Ramadan",
        ],
      },
      {
        en: "Kami berbuka puasa saat azan magrib.",
        vi: "Chúng tôi mở chay khi có tiếng gọi cầu nguyện lúc chiều tối.",
        pronunciation_focus: [
          "berbuka puasa → 'mở chay/kết thúc nhịn trong ngày' (buka = mở)",
          "saat → SA-at, 'lúc/khi'",
          "azan magrib → 'tiếng gọi cầu nguyện buổi hoàng hôn' — dấu hiệu mở chay",
        ],
        pronunciation_focus_en: [
          "berbuka puasa → 'to break the fast' (buka = to open)",
          "saat → 'SA-at' — when/at the moment",
          "azan magrib → 'the sunset call to prayer' — the cue to break the fast",
        ],
      },
      {
        en: "Selama puasa, kami tidak makan dan minum di siang hari.",
        vi: "Trong lúc nhịn chay, chúng tôi không ăn uống vào ban ngày.",
        pronunciation_focus: [
          "selama → seu-LA-ma, 'trong suốt (khoảng thời gian)'",
          "tidak makan dan minum → 'không ăn và uống'",
          "siang hari → 'ban ngày' (siang = giữa trưa/ban ngày)",
        ],
        pronunciation_focus_en: [
          "selama → 'se-LA-ma' — during/throughout",
          "tidak makan dan minum → 'do not eat and drink'",
          "siang hari → 'daytime' (siang = midday/daytime)",
        ],
      },
      {
        en: "Setelah berbuka, banyak orang salat tarawih.",
        vi: "Sau khi mở chay, nhiều người cầu nguyện tarawih.",
        pronunciation_focus: [
          "setelah → seu-teu-LAH, 'sau khi'",
          "salat → SA-lat, 'cầu nguyện (theo nghi thức Hồi giáo)'",
          "tarawih → ta-ra-WIH, buổi cầu nguyện ban đêm đặc trưng của Ramadan",
        ],
        pronunciation_focus_en: [
          "setelah → 'se-te-LAH' — after",
          "salat → 'SA-lat' — (Islamic ritual) prayer",
          "tarawih → 'ta-ra-WEEH' — the special nightly Ramadan prayer",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia là quốc gia Hồi giáo đông dân nhất thế giới, nên 'bulan Ramadan' (tháng Ramadan) chi phối nhịp sống cả nước trong một tháng. 'Puasa' (nhịn chay) nghĩa là không ăn, uống từ rạng đông đến hoàng hôn. Bữa 'sahur' ăn trước bình minh; 'berbuka puasa' (mở chay) khi nghe 'azan magrib' lúc chiều tối — thường bắt đầu bằng quả chà là và nước. Buổi tối có cầu nguyện 'tarawih'. Giờ làm việc, hàng quán đều điều chỉnh theo. Người không theo đạo nên tế nhị, tránh ăn uống phô trương nơi công cộng vào ban ngày.",
    cultural_notes_en:
      "Indonesia is the world's most populous Muslim-majority country, so 'bulan Ramadan' (the month of Ramadan) shapes the national rhythm for a month. 'Puasa' (fasting) means no food or drink from dawn to sunset. The 'sahur' meal is eaten before dawn; 'berbuka puasa' (breaking the fast) happens at the 'azan magrib' sunset call — usually started with dates and water. Evenings feature 'tarawih' prayers. Working hours and shops adjust accordingly. Non-Muslims should be considerate and avoid eating/drinking conspicuously in public during the day.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'puasa' = nhịn chay; 'berpuasa' (có tiền tố ber-) = đang nhịn chay. Hai mốc cố định: 'sahur' (ăn trước rạng đông) và 'berbuka' (mở chay lúc hoàng hôn). Cấu trúc thời gian quen thuộc: 'sebelum + …' (trước khi), 'setelah + …' (sau khi), 'selama + …' (trong suốt). Lời chào lịch sự đầu tháng: 'Selamat menunaikan ibadah puasa' (Chúc nhịn chay tốt lành).",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'puasa' = fasting; 'berpuasa' (with the 'ber-' prefix) = to be fasting. Two fixed anchors: 'sahur' (eat before dawn) and 'berbuka' (break the fast at sunset). Familiar time frames: 'sebelum + …' (before), 'setelah + …' (after), 'selama + …' (during). A polite greeting at the start of the month: 'Selamat menunaikan ibadah puasa' (Have a blessed fast).",
    vocabulary: [
      {
        cell_id: "fb4ec56f-4712-47b0-9543-a76cacca0795",
        word: "puasa",
        en: "fasting",
        vi: "nhịn chay",
        pos: "noun / verb",
        pronunciation_vi: "pu-A-sa",
        pronunciation_en: "poo-A-sa",
      },
      {
        cell_id: "4f17841a-9f8d-44b7-ba8a-b18bcbf20d5f",
        word: "sahur",
        en: "pre-dawn meal",
        vi: "bữa ăn trước rạng đông",
        pos: "noun",
        pronunciation_vi: "sa-HUR",
        pronunciation_en: "sa-HOOR",
      },
      {
        cell_id: "f9b59601-59d3-41b1-8bc8-a82e754eecec",
        word: "berbuka puasa",
        en: "to break the fast",
        vi: "mở chay",
        pos: "verb phrase",
        pronunciation_vi: "ber-BU-ka pu-A-sa",
        pronunciation_en: "ber-BOO-ka poo-A-sa",
      },
      {
        cell_id: "54dc22ed-2a15-4f69-8585-ffe52b1ac78d",
        word: "bulan",
        en: "month / moon",
        vi: "tháng / mặt trăng",
        pos: "noun",
        pronunciation_vi: "BU-lan",
        pronunciation_en: "BOO-lan",
      },
      {
        cell_id: "16dc58b5-04d8-4259-a301-a55f8621eace",
        word: "salat",
        en: "(Islamic) prayer",
        vi: "lễ cầu nguyện",
        pos: "noun / verb",
        pronunciation_vi: "SA-lat",
        pronunciation_en: "SA-lat",
      },
      {
        cell_id: "91b205e7-d347-44d1-ab93-efbed875fd14",
        word: "bangun",
        en: "to wake up",
        vi: "thức dậy",
        pos: "verb",
        pronunciation_vi: "BA-ngun",
        pronunciation_en: "BA-ngoon",
      },
      {
        cell_id: "2349ffe6-0c42-4582-ac9f-d8cd45d64fed",
        word: "siang hari",
        en: "daytime",
        vi: "ban ngày",
        pos: "noun phrase",
        pronunciation_vi: "SI-ang HA-ri",
        pronunciation_en: "SEE-ang HA-ree",
      },
    ],
    dialogue: [
      {
        cell_id: "2820a8fc-6ff2-48ff-a712-70e602b023ae",
        speaker: "Budi",
        text: "Kamu sudah makan sahur tadi pagi?",
        vi: "Sáng nay bạn đã ăn sahur chưa?",
        en: "Did you have your sahur meal this morning?",
      },
      {
        cell_id: "f8a21466-b635-42d6-8460-3c4d641cc369",
        speaker: "Sinta",
        text: "Sudah. Saya bangun jam tiga untuk sahur.",
        vi: "Rồi. Mình dậy lúc ba giờ để ăn sahur.",
        en: "Yes. I woke up at three for sahur.",
      },
      {
        cell_id: "c96bf75f-4350-488d-92e9-1e6ea476d0e0",
        speaker: "Budi",
        text: "Kita berbuka puasa bareng nanti, yuk. Saat azan magrib.",
        vi: "Lát nữa mình mở chay chung nhé. Lúc nghe azan chiều.",
        en: "Let's break the fast together later. At the sunset call to prayer.",
      },
      {
        cell_id: "884bdc33-d912-4765-92ba-3be1d7ffba5e",
        speaker: "Sinta",
        text: "Boleh! Setelah berbuka, saya mau salat tarawih di masjid.",
        vi: "Được! Sau khi mở chay, mình muốn cầu nguyện tarawih ở nhà thờ Hồi giáo.",
        en: "Sure! After breaking the fast, I want to do tarawih prayers at the mosque.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về Ramadan còn thiếu:",
        instruction_en: "Fill in the missing Ramadan word:",
        items: [
          {
            prompt: "Bulan ini umat Islam menjalankan ___. (nhịn chay)",
            answer: "puasa",
            options: ["puasa", "pasar", "pulau"],
          },
          {
            prompt: "Saya bangun pagi untuk makan ___. (bữa trước rạng đông)",
            answer: "sahur",
            options: ["sahur", "sayur", "salju"],
          },
          {
            prompt: "Kami ___ saat azan magrib. (mở chay)",
            answer: "berbuka puasa",
            options: ["berbuka puasa", "berangkat kerja", "berbicara"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "puasa", answer: "nhịn chay" },
          { prompt: "sahur", answer: "bữa trước rạng đông" },
          { prompt: "salat", answer: "lễ cầu nguyện" },
          { prompt: "bangun", answer: "thức dậy" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi dậy sớm để ăn bữa sahur.", answer: "Saya bangun pagi untuk makan sahur." },
          { prompt: "Chúng tôi mở chay khi nghe azan chiều tối.", answer: "Kami berbuka puasa saat azan magrib." },
          { prompt: "Trong lúc nhịn chay, chúng tôi không ăn uống ban ngày.", answer: "Selama puasa, kami tidak makan dan minum di siang hari." },
        ],
      },
    ],
  },
  {
    id: "indonesian_lebaran_idul_fitri",
    level: "A2",
    category: "culture",
    title_vi: "Lễ Lebaran — về quê, THR, ketupat",
    title_en: "Lebaran — homecoming, THR, ketupat",
    sentences: [
      {
        en: "Setelah sebulan puasa, kita merayakan Lebaran.",
        vi: "Sau một tháng nhịn chay, chúng ta mừng lễ Lebaran.",
        pronunciation_focus: [
          "sebulan → 'một tháng' (se- = một + bulan)",
          "merayakan → meu-ra-YA-kan, 'tổ chức/ăn mừng' (gốc raya + meN-…-kan)",
          "Lebaran → leu-BA-ran, tên dân gian của lễ Idul Fitri",
        ],
        pronunciation_focus_en: [
          "sebulan → 'a month' (se- = one + bulan)",
          "merayakan → 'me-ra-YA-kan' — to celebrate (root 'raya' + 'meN-…-kan')",
          "Lebaran → 'le-BA-ran' — the colloquial name for Idul Fitri",
        ],
      },
      {
        en: "Banyak orang mudik ke kampung halaman.",
        vi: "Nhiều người về quê (đoàn tụ gia đình).",
        pronunciation_focus: [
          "mudik → MU-dik, 'về quê dịp lễ' (cuộc di cư lớn nhất trong năm)",
          "kampung halaman → 'quê hương/quê nhà'",
          "L1 note: 'mudik' rất giống cảnh người Việt về quê ăn Tết",
        ],
        pronunciation_focus_en: [
          "mudik → 'MOO-deek' — to travel home for the holiday (the year's biggest exodus)",
          "kampung halaman → 'hometown/native village'",
          "note: 'mudik' is much like Vietnamese going home for Tết",
        ],
      },
      {
        en: "Karyawan biasanya mendapat THR sebelum Lebaran.",
        vi: "Nhân viên thường nhận THR (thưởng lễ) trước Lebaran.",
        pronunciation_focus: [
          "karyawan → kar-ya-WAN, 'nhân viên/người lao động'",
          "mendapat → men-DA-pat, 'nhận được'",
          "THR → 'té-ha-ér', Tunjangan Hari Raya = tiền thưởng dịp lễ (như thưởng Tết)",
        ],
        pronunciation_focus_en: [
          "karyawan → 'kar-ya-WAN' — employee/worker",
          "mendapat → 'men-DA-pat' — to receive/get",
          "THR → 'teh-ha-er', Tunjangan Hari Raya = holiday bonus (like a Tết bonus)",
        ],
      },
      {
        en: "Di rumah, kami makan ketupat dan opor ayam.",
        vi: "Ở nhà, chúng tôi ăn ketupat và gà nấu nước cốt dừa.",
        pronunciation_focus: [
          "ketupat → keu-TU-pat, bánh gạo gói lá dừa hình thoi — món biểu tượng Lebaran",
          "opor ayam → 'gà nấu nước cốt dừa' (món ăn kèm ketupat)",
          "dan → 'và'",
        ],
        pronunciation_focus_en: [
          "ketupat → 'ke-TOO-pat' — diamond-shaped rice cake woven in coconut leaves — the iconic Lebaran dish",
          "opor ayam → 'chicken in coconut-milk curry' (eaten with ketupat)",
          "dan → 'and'",
        ],
      },
      {
        en: "Anak-anak memakai baju baru saat Lebaran.",
        vi: "Trẻ con mặc quần áo mới vào dịp Lebaran.",
        pronunciation_focus: [
          "anak-anak → 'trẻ con/lũ trẻ' (từ lặp = số nhiều)",
          "memakai → meu-MA-kai, 'mặc/dùng' (gốc pakai + meN-…)",
          "baju baru → 'quần áo mới' (baju = áo, baru = mới)",
        ],
        pronunciation_focus_en: [
          "anak-anak → 'children' (reduplication = plural)",
          "memakai → 'me-MA-kai' — to wear/use (root 'pakai' + 'meN-…')",
          "baju baru → 'new clothes' (baju = clothes, baru = new)",
        ],
      },
    ],
    cultural_notes_vi:
      "'Lebaran' (tên dân gian của 'Idul Fitri') là lễ lớn nhất Indonesia — đánh dấu kết thúc tháng nhịn chay. 'Mudik' là cuộc về quê khổng lồ: hàng chục triệu người rời thành phố về 'kampung halaman' — giống hệt người Việt về quê ăn Tết, kẹt xe và vé tàu xe cháy hàng. Trước lễ, người lao động nhận 'THR' (Tunjangan Hari Raya — thưởng lễ, luật bắt buộc). Món biểu tượng: 'ketupat' (bánh gạo gói lá dừa) ăn với 'opor ayam'. Trẻ con mặc 'baju baru' và được người lớn lì xì ('uang/angpao Lebaran').",
    cultural_notes_en:
      "'Lebaran' (the popular name for 'Idul Fitri') is Indonesia's biggest holiday — marking the end of the fasting month. 'Mudik' is the colossal homecoming: tens of millions leave the cities for their 'kampung halaman' — exactly like Vietnamese going home for Tết, with gridlock and sold-out tickets. Before the holiday, workers receive 'THR' (Tunjangan Hari Raya — a legally mandated holiday bonus). The iconic dish: 'ketupat' (rice cakes in woven coconut leaves) with 'opor ayam'. Children wear 'baju baru' and get cash gifts from elders ('uang/angpao Lebaran').",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng chính trải nghiệm Tết để nhớ — 'mudik' = về quê ăn Tết, 'THR' = thưởng Tết, 'baju baru' = quần áo mới, lì xì = 'uang Lebaran'. Tiền tố 'meN-…(-kan)' tạo động từ: raya→merayakan (ăn mừng), pakai→memakai (mặc), dapat→mendapat (nhận). 'se- + danh từ' = một (sebulan = một tháng, seminggu = một tuần). Từ lặp 'anak-anak' = số nhiều (lũ trẻ).",
    tip_advice_en:
      "Tip for Vietnamese speakers: use your own Tết experience as a memory hook — 'mudik' = going home for the new year, 'THR' = holiday bonus, 'baju baru' = new clothes, the cash gift = 'uang Lebaran'. The 'meN-…(-kan)' prefix forms verbs: raya→merayakan (celebrate), pakai→memakai (wear), dapat→mendapat (receive). 'se- + noun' = one (sebulan = one month, seminggu = one week). Reduplicated 'anak-anak' = plural (children).",
    vocabulary: [
      {
        cell_id: "88dfcb8e-bd57-454f-bf58-2c71cfad69bf",
        word: "Lebaran",
        en: "Idul Fitri holiday",
        vi: "lễ Lebaran",
        pos: "noun",
        pronunciation_vi: "leu-BA-ran",
        pronunciation_en: "le-BA-ran",
      },
      {
        cell_id: "e1a37d56-3440-421d-abaa-ab2a70f60266",
        word: "mudik",
        en: "to travel home for the holiday",
        vi: "về quê dịp lễ",
        pos: "verb",
        pronunciation_vi: "MU-dik",
        pronunciation_en: "MOO-deek",
      },
      {
        cell_id: "85cce20f-1aa1-4805-8465-b9d4afb1d5a5",
        word: "kampung halaman",
        en: "hometown / native village",
        vi: "quê hương",
        pos: "noun phrase",
        pronunciation_vi: "KAM-pung ha-LA-man",
        pronunciation_en: "KAM-poong ha-LA-man",
      },
      {
        cell_id: "3624ee11-b975-4d06-83d3-c9ef546e2514",
        word: "THR",
        en: "holiday bonus (Tunjangan Hari Raya)",
        vi: "thưởng lễ (như thưởng Tết)",
        pos: "noun (abbreviation)",
        pronunciation_vi: "té-ha-ér",
        pronunciation_en: "teh-ha-er",
      },
      {
        cell_id: "0b267798-a955-4d4d-b558-2e41f0e4390c",
        word: "ketupat",
        en: "woven-leaf rice cake (Lebaran dish)",
        vi: "bánh gạo gói lá dừa",
        pos: "noun",
        pronunciation_vi: "keu-TU-pat",
        pronunciation_en: "ke-TOO-pat",
      },
      {
        cell_id: "bf430166-f375-4691-92d4-d73474c5f03d",
        word: "merayakan",
        en: "to celebrate",
        vi: "ăn mừng / tổ chức (lễ)",
        pos: "verb",
        pronunciation_vi: "meu-ra-YA-kan",
        pronunciation_en: "me-ra-YA-kan",
      },
      {
        cell_id: "a5d817cf-3ac3-4d22-9b69-270c49136247",
        word: "baju baru",
        en: "new clothes",
        vi: "quần áo mới",
        pos: "noun phrase",
        pronunciation_vi: "BA-ju BA-ru",
        pronunciation_en: "BA-joo BA-roo",
      },
    ],
    dialogue: [
      {
        cell_id: "197c1736-11e2-4754-b99f-b8afac8cd456",
        speaker: "Dewi",
        text: "Lebaran ini kamu mudik ke mana?",
        vi: "Lebaran này bạn về quê ở đâu?",
        en: "Where are you traveling home to for Lebaran?",
      },
      {
        cell_id: "2aba5f07-27ef-47f3-a2e4-b1f2c9251bab",
        speaker: "Arif",
        text: "Ke kampung halaman di Solo. Untung sudah dapat THR untuk tiket.",
        vi: "Về quê ở Solo. May là đã nhận thưởng lễ để mua vé.",
        en: "To my hometown in Solo. Lucky I already got my THR for the tickets.",
      },
      {
        cell_id: "a15e98ef-49f7-4fdf-ad1b-8de83b42f222",
        speaker: "Dewi",
        text: "Di sana nanti makan ketupat dan opor ayam, kan?",
        vi: "Ở đó sẽ ăn ketupat với gà nước cốt dừa nhỉ?",
        en: "You'll have ketupat and opor ayam there, right?",
      },
      {
        cell_id: "b7ec25d4-d486-4c16-a840-743adb65dcdd",
        speaker: "Arif",
        text: "Pasti! Keponakan-keponakan juga pakai baju baru, ramai sekali.",
        vi: "Chắc chắn rồi! Mấy đứa cháu cũng mặc đồ mới, vui lắm.",
        en: "Definitely! The nieces and nephews wear new clothes too, it's so lively.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về Lebaran còn thiếu:",
        instruction_en: "Fill in the missing Lebaran word:",
        items: [
          {
            prompt: "Banyak orang ___ ke kampung halaman. (về quê)",
            answer: "mudik",
            options: ["mudik", "masuk", "mandi"],
          },
          {
            prompt: "Karyawan biasanya mendapat ___ sebelum Lebaran. (thưởng lễ)",
            answer: "THR",
            options: ["THR", "KTP", "SIM"],
          },
          {
            prompt: "Anak-anak memakai ___ saat Lebaran. (quần áo mới)",
            answer: "baju baru",
            options: ["baju baru", "buku baru", "rumah baru"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "mudik", answer: "về quê dịp lễ" },
          { prompt: "THR", answer: "thưởng lễ" },
          { prompt: "ketupat", answer: "bánh gạo gói lá dừa" },
          { prompt: "merayakan", answer: "ăn mừng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Sau một tháng nhịn chay, chúng ta mừng lễ Lebaran.", answer: "Setelah sebulan puasa, kita merayakan Lebaran." },
          { prompt: "Nhiều người về quê.", answer: "Banyak orang mudik ke kampung halaman." },
          { prompt: "Nhân viên thường nhận THR trước Lebaran.", answer: "Karyawan biasanya mendapat THR sebelum Lebaran." },
        ],
      },
    ],
  },
  {
    id: "indonesian_lebaran_greetings_etiquette",
    level: "B1",
    category: "culture",
    title_vi: "Chào hỏi và phép tắc Lebaran — xin lỗi, sum họp",
    title_en: "Lebaran greetings & etiquette — apology, reunion",
    sentences: [
      {
        en: "Selamat Idul Fitri, mohon maaf lahir dan batin.",
        vi: "Chúc mừng Idul Fitri, xin tha thứ mọi lỗi lầm trong ngoài.",
        pronunciation_focus: [
          "Selamat Idul Fitri → lời chúc mừng lễ chuẩn",
          "mohon maaf → 'xin tha lỗi/xin lỗi' (mohon = thỉnh cầu, lịch sự hơn 'minta')",
          "lahir dan batin → 'cả phần xác lẫn phần tâm' — xin lỗi mọi lỗi hữu ý và vô ý",
        ],
        pronunciation_focus_en: [
          "Selamat Idul Fitri → the standard holiday greeting",
          "mohon maaf → 'I beg forgiveness/sorry' (mohon = to request, politer than 'minta')",
          "lahir dan batin → 'in body and in spirit' — apology for all wrongs, intended or not",
        ],
      },
      {
        en: "Saat Lebaran, kami bersilaturahmi ke rumah saudara.",
        vi: "Dịp Lebaran, chúng tôi đi thăm hỏi họ hàng để gắn kết tình thân.",
        pronunciation_focus: [
          "bersilaturahmi → 'thăm viếng để gắn kết tình thân' (gốc Ả Rập, gắn liền văn hóa lễ)",
          "saudara → sau-DA-ra, 'họ hàng/anh chị em'",
          "L1 note: 'silaturahmi' ≈ tục đi chúc Tết, thăm họ hàng của người Việt",
        ],
        pronunciation_focus_en: [
          "bersilaturahmi → 'to visit and strengthen family/social ties' (Arabic root, central to the holiday)",
          "saudara → 'sau-DA-ra' — relatives/siblings",
          "note: 'silaturahmi' ≈ the Vietnamese custom of New-Year visiting of relatives",
        ],
      },
      {
        en: "Yang muda biasanya meminta maaf kepada yang tua.",
        vi: "Người trẻ thường xin lỗi người lớn tuổi.",
        pronunciation_focus: [
          "yang muda → 'người trẻ'; yang tua → 'người lớn tuổi' (yang = (người) mà)",
          "meminta maaf → 'xin lỗi' (gốc minta + meN-…)",
          "kepada → keu-pa-DA, 'đến/cho (người)' — giới từ chỉ đối tượng nhận",
        ],
        pronunciation_focus_en: [
          "yang muda → 'the young'; yang tua → 'the elders' (yang = the one who)",
          "meminta maaf → 'to apologize' (root 'minta' + 'meN-…')",
          "kepada → 'ke-pa-DA' — to (a person) — preposition marking the recipient",
        ],
      },
      {
        en: "Setelah Lebaran, kantor mengadakan halal bihalal.",
        vi: "Sau Lebaran, công ty tổ chức buổi halal bihalal (gặp mặt tha thứ).",
        pronunciation_focus: [
          "mengadakan → meu-nga-DA-kan, 'tổ chức (sự kiện)' (gốc ada + meN-…-kan)",
          "halal bihalal → buổi tụ họp tha thứ lẫn nhau sau lễ (nét riêng Indonesia)",
          "kantor → KAN-tor, 'văn phòng/công ty'",
        ],
        pronunciation_focus_en: [
          "mengadakan → 'me-nga-DA-kan' — to hold/organize (an event) (root 'ada' + 'meN-…-kan')",
          "halal bihalal → a post-holiday gathering of mutual forgiveness (uniquely Indonesian)",
          "kantor → 'KAN-tor' — office",
        ],
      },
      {
        en: "Semoga kita semua kembali suci seperti bayi.",
        vi: "Mong rằng tất cả chúng ta trở lại thanh khiết như trẻ sơ sinh.",
        pronunciation_focus: [
          "semoga → seu-MÔ-ga, 'mong rằng/cầu chúc' (mở đầu lời chúc)",
          "kembali → kem-BA-li, 'trở lại'",
          "suci seperti bayi → 'thanh khiết như em bé' (ý niệm được gột sạch lỗi lầm)",
        ],
        pronunciation_focus_en: [
          "semoga → 'se-MOH-ga' — may it be that / hopefully (blessing opener)",
          "kembali → 'kem-BA-lee' — to return",
          "suci seperti bayi → 'pure as a baby' (the idea of being cleansed of past wrongs)",
        ],
      },
    ],
    cultural_notes_vi:
      "Cốt lõi tinh thần của Lebaran là THA THỨ. Câu chúc kinh điển: 'Mohon maaf lahir dan batin' — xin tha thứ mọi lỗi lầm (cả thấy được lẫn trong lòng). Người trẻ chủ động 'meminta maaf' (xin lỗi) và 'sungkem' (cúi chào, hôn tay) trước ông bà cha mẹ. 'Silaturahmi' (đi thăm họ hàng, hàng xóm) giống hệt tục chúc Tết của người Việt. Sau lễ, cơ quan và cộng đồng tổ chức 'halal bihalal' — buổi gặp mặt tha thứ lẫn nhau, một sáng tạo riêng của Indonesia. Lời chúc thường mở đầu bằng 'Semoga…' (Mong rằng…).",
    cultural_notes_en:
      "The spiritual core of Lebaran is FORGIVENESS. The classic greeting: 'Mohon maaf lahir dan batin' — begging pardon for all wrongs (both visible and inner). The young actively 'meminta maaf' (apologize) and do 'sungkem' (a bow, kissing the hand) before grandparents and parents. 'Silaturahmi' (visiting relatives and neighbors) is just like the Vietnamese New-Year visiting custom. After the holiday, offices and communities hold 'halal bihalal' — a mutual-forgiveness gathering, a uniquely Indonesian invention. Blessings often open with 'Semoga…' (May…).",
    tip_advice_vi:
      "Mẹo cho người Việt: thuộc nguyên câu 'Mohon maaf lahir dan batin' — dùng được với bất kỳ ai dịp lễ. 'mohon' lịch sự hơn 'minta'; 'meminta maaf kepada + người' = xin lỗi ai. Giới từ 'kepada' chỉ người nhận (khác 'ke' chỉ nơi chốn). 'yang + tính từ' biến tính từ thành danh từ: yang muda (người trẻ), yang tua (người già). Mở lời chúc bằng 'Semoga + mệnh đề' (Mong rằng…). Liên hệ với tục chúc Tết để nhớ 'silaturahmi'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: memorize the whole line 'Mohon maaf lahir dan batin' — usable with anyone during the holiday. 'mohon' is politer than 'minta'; 'meminta maaf kepada + person' = to apologize to someone. The preposition 'kepada' marks a person recipient (vs 'ke' for places). 'yang + adjective' nominalizes it: yang muda (the young), yang tua (the elders). Open a blessing with 'Semoga + clause' (May…). Tie it to your Tết-visiting custom to remember 'silaturahmi'.",
    vocabulary: [
      {
        cell_id: "ceb64eed-0286-4f2e-8052-a03216897924",
        word: "mohon maaf",
        en: "to beg forgiveness / sorry",
        vi: "xin tha lỗi",
        pos: "phrase",
        pronunciation_vi: "MÔ-hon MA-af",
        pronunciation_en: "MOH-hon MA-af",
      },
      {
        cell_id: "4c3b6c59-b503-4eea-ba02-f879c3abae50",
        word: "lahir dan batin",
        en: "in body and spirit (fully)",
        vi: "cả phần xác lẫn phần tâm",
        pos: "phrase",
        pronunciation_vi: "LA-hir dan BA-tin",
        pronunciation_en: "LA-heer dan BA-teen",
      },
      {
        cell_id: "96b7b85b-c63f-47f6-9cd9-fd6a1628048b",
        word: "silaturahmi",
        en: "strengthening family/social ties (visiting)",
        vi: "thăm hỏi gắn kết tình thân",
        pos: "noun",
        pronunciation_vi: "si-la-tu-RAH-mi",
        pronunciation_en: "see-la-too-RAH-mee",
      },
      {
        cell_id: "a3975a4f-1339-4070-a3f3-f9a29f0e2b44",
        word: "meminta maaf",
        en: "to apologize",
        vi: "xin lỗi",
        pos: "verb phrase",
        pronunciation_vi: "meu-MIN-ta MA-af",
        pronunciation_en: "me-MIN-ta MA-af",
      },
      {
        cell_id: "9c23ad37-43b5-4060-9064-68b5b952ba5f",
        word: "halal bihalal",
        en: "post-holiday mutual-forgiveness gathering",
        vi: "buổi gặp mặt tha thứ sau lễ",
        pos: "noun",
        pronunciation_vi: "ha-LAL bi-ha-LAL",
        pronunciation_en: "ha-LAL bee-ha-LAL",
      },
      {
        cell_id: "25ff2aae-bb0a-46aa-bb5b-2f98e89b2ceb",
        word: "saudara",
        en: "relative / sibling",
        vi: "họ hàng / anh chị em",
        pos: "noun",
        pronunciation_vi: "sau-DA-ra",
        pronunciation_en: "sau-DA-ra",
      },
      {
        cell_id: "20ae0db2-f58c-45ee-8f08-5bc9707e2ff3",
        word: "semoga",
        en: "may / hopefully (blessing)",
        vi: "mong rằng / cầu chúc",
        pos: "adverb",
        pronunciation_vi: "seu-MÔ-ga",
        pronunciation_en: "se-MOH-ga",
      },
    ],
    dialogue: [
      {
        cell_id: "a2186ae8-4021-4261-9c71-68e08231bd80",
        speaker: "Tamu",
        text: "Selamat Idul Fitri, Pak. Mohon maaf lahir dan batin.",
        vi: "Chúc mừng Idul Fitri, bác. Xin tha thứ mọi lỗi lầm.",
        en: "Happy Idul Fitri, sir. Please forgive my every wrong.",
      },
      {
        cell_id: "3007a5e8-4113-4c58-98a7-411314c87967",
        speaker: "Tuan rumah",
        text: "Sama-sama, saya juga minta maaf. Ayo masuk, kita silaturahmi.",
        vi: "Tôi cũng vậy, tôi cũng xin lỗi. Vào đi, mình hàn huyên (gắn kết tình thân).",
        en: "Likewise, I ask your pardon too. Come in, let's catch up.",
      },
      {
        cell_id: "cc5372e5-5e9e-4284-9c20-0013aa86a3da",
        speaker: "Tamu",
        text: "Terima kasih. Semoga kita semua kembali suci seperti bayi.",
        vi: "Cảm ơn bác. Mong tất cả chúng ta trở lại thanh khiết như trẻ sơ sinh.",
        en: "Thank you. May we all return as pure as newborns.",
      },
      {
        cell_id: "08c8945c-0182-407d-b3d1-810a67606dcf",
        speaker: "Tuan rumah",
        text: "Aamiin. Minggu depan kantor juga mengadakan halal bihalal, lho.",
        vi: "A-min. Tuần sau công ty cũng tổ chức halal bihalal đó.",
        en: "Amen. Next week the office is holding a halal bihalal too.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ/cụm về phép tắc Lebaran còn thiếu:",
        instruction_en: "Fill in the missing Lebaran-etiquette word/phrase:",
        items: [
          {
            prompt: "Selamat Idul Fitri, mohon maaf ___. (cả trong lẫn ngoài)",
            answer: "lahir dan batin",
            options: ["lahir dan batin", "siang dan malam", "dulu dan kini"],
          },
          {
            prompt: "Saat Lebaran, kami ___ ke rumah saudara. (thăm hỏi gắn kết)",
            answer: "bersilaturahmi",
            options: ["bersilaturahmi", "berolahraga", "berbelanja"],
          },
          {
            prompt: "Setelah Lebaran, kantor mengadakan ___. (gặp mặt tha thứ)",
            answer: "halal bihalal",
            options: ["halal bihalal", "rapat kerja", "pesta ulang tahun"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm với nghĩa tiếng Việt:",
        instruction_en: "Match each word/phrase with its Vietnamese meaning:",
        items: [
          { prompt: "mohon maaf", answer: "xin tha lỗi" },
          { prompt: "silaturahmi", answer: "thăm hỏi gắn kết tình thân" },
          { prompt: "saudara", answer: "họ hàng" },
          { prompt: "semoga", answer: "mong rằng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chúc mừng Idul Fitri, xin tha thứ mọi lỗi lầm trong ngoài.", answer: "Selamat Idul Fitri, mohon maaf lahir dan batin." },
          { prompt: "Người trẻ thường xin lỗi người lớn tuổi.", answer: "Yang muda biasanya meminta maaf kepada yang tua." },
          { prompt: "Mong rằng tất cả chúng ta trở lại thanh khiết như trẻ sơ sinh.", answer: "Semoga kita semua kembali suci seperti bayi." },
        ],
      },
    ],
  },
];

export default ramadanLebaranLessons;
