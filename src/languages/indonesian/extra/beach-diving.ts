// src/languages/indonesian/extra/beach-diving.ts
//
// Indonesian beach & diving pack for Vietnamese learners.
// Covers: the beach and swimming (pantai, berenang, pasir, ombak, sunblock),
// snorkeling & scuba diving (snorkeling, menyelam, terumbu karang, alat selam),
// and Indonesia's famous marine destinations (Bali, Raja Ampat, Komodo, Bunaken)
// with conservation vocabulary. Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts and the
// sibling extra packs so the page UI stays consistent across language verticals.
// The types are defined inline because the Indonesian pack has no sibling
// lessons.ts registry yet (A7 owns it) — this file is self-contained on purpose.
// Types are NOT exported and the lesson array uses a unique name so a future
// barrel `export *` cannot collide with the sibling extra packs.
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

export const beachDivingLessons: IndonesianLesson[] = [
  {
    id: "indonesian_beach_basics",
    level: "A1",
    category: "beach-diving",
    title_vi: "Ra biển — bãi cát, sóng và bơi lội",
    title_en: "At the beach — sand, waves and swimming",
    sentences: [
      {
        en: "Hari ini saya mau pergi ke pantai.",
        vi: "Hôm nay tôi muốn đi ra biển.",
        pronunciation_focus: [
          "pantai → PAN-tai, 'bãi biển/biển'",
          "pergi ke → 'đi đến' (ke = đến, hướng)",
          "hari ini → 'hôm nay'",
        ],
        pronunciation_focus_en: [
          "pantai → 'PAN-tai' — beach",
          "pergi ke → 'go to' (ke = to, directional)",
          "hari ini → 'today'",
        ],
      },
      {
        en: "Pasirnya putih dan ombaknya tenang.",
        vi: "Cát trắng và sóng êm.",
        pronunciation_focus: [
          "pasir → PA-sir, 'cát'; pasirnya = cát của nó (+ -nya)",
          "ombak → OM-bak, 'sóng'",
          "tenang → te-NANG, 'êm/yên/lặng'",
        ],
        pronunciation_focus_en: [
          "pasir → 'PA-seer' — sand; pasirnya = its sand (+ '-nya')",
          "ombak → 'OM-bak' — wave",
          "tenang → 'te-NANG' — calm / still",
        ],
      },
      {
        en: "Saya suka berenang di laut.",
        vi: "Tôi thích bơi ở biển.",
        pronunciation_focus: [
          "berenang → be-re-NANG, 'bơi' (gốc renang + ber-)",
          "laut → LA-ut, 'biển/đại dương'",
          "di laut → 'ở biển' (di = ở, tĩnh)",
        ],
        pronunciation_focus_en: [
          "berenang → 'be-re-NANG' — to swim (root 'renang' + 'ber-')",
          "laut → 'LA-oot' — sea / ocean",
          "di laut → 'in the sea' (di = static 'in/at')",
        ],
      },
      {
        en: "Jangan lupa pakai tabir surya.",
        vi: "Đừng quên bôi kem chống nắng.",
        pronunciation_focus: [
          "jangan lupa → 'đừng quên'",
          "pakai → PA-kai, 'dùng/bôi/đeo'",
          "tabir surya → 'kem chống nắng' (cũng gọi 'sunblock', 'sunscreen')",
        ],
        pronunciation_focus_en: [
          "jangan lupa → 'don't forget'",
          "pakai → 'PA-kai' — to use / apply / wear",
          "tabir surya → 'sunscreen' (also called 'sunblock')",
        ],
      },
      {
        en: "Matahari sangat panas siang ini.",
        vi: "Trời nắng rất gắt trưa nay.",
        pronunciation_focus: [
          "matahari → ma-ta-HA-ri, 'mặt trời' (mata = mắt, hari = ngày)",
          "sangat → SA-ngat, 'rất' (đứng TRƯỚC tính từ)",
          "panas → PA-nas, 'nóng'; siang = trưa",
        ],
        pronunciation_focus_en: [
          "matahari → 'ma-ta-HA-ree' — sun (mata = eye, hari = day)",
          "sangat → 'SA-ngat' — very (placed BEFORE the adjective)",
          "panas → 'PA-nas' — hot; siang = midday",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia là quốc gia quần đảo với hơn 17.000 đảo, nên 'pantai' (bãi biển) có ở khắp nơi. Bãi nổi tiếng: Kuta, Sanur, Nusa Dua (Bali), Pink Beach (Lombok/Komodo), Pangandaran (Java). Từ vựng nền: pasir (cát), ombak (sóng), laut (biển), karang (đá ngầm/san hô), pulau (đảo). Nắng nhiệt đới rất gắt nên 'tabir surya' (kem chống nắng) là bắt buộc. Lưu ý an toàn: nhiều bãi Nam Java/Bali có 'ombak besar' (sóng lớn) và dòng chảy xa bờ (arus); để ý cờ cảnh báo và biển 'dilarang berenang' (cấm bơi).",
    cultural_notes_en:
      "Indonesia is an archipelago of over 17,000 islands, so 'pantai' (beaches) are everywhere. Famous ones: Kuta, Sanur, Nusa Dua (Bali), Pink Beach (Lombok/Komodo), Pangandaran (Java). Core vocabulary: pasir (sand), ombak (wave), laut (sea), karang (reef/coral), pulau (island). Tropical sun is fierce, so 'tabir surya' (sunscreen) is a must. Safety note: many South Java/Bali beaches have 'ombak besar' (big waves) and rip currents ('arus'); watch for warning flags and 'dilarang berenang' (no swimming) signs.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'sangat' (rất) đứng TRƯỚC tính từ ('sangat panas' = rất nóng), còn 'sekali' đứng SAU ('panas sekali' = nóng lắm) — hai cách nhấn, đừng dùng cùng lúc. 'Matahari' = mặt trời, từ ghép trong suốt 'mata + hari' (mắt của ngày). 'Berenang' (bơi) dùng tiền tố ber-, gốc là 'renang'. Phân biệt 'di laut' (ở biển — vị trí) với 'ke laut' (ra biển — hướng) và 'dari laut' (từ biển). 'Jangan + động từ' = đừng làm gì. Cặp đối nghĩa: tenang (êm) ↔ besar/ganas (sóng lớn/dữ).",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'sangat' (very) goes BEFORE the adjective ('sangat panas' = very hot), while 'sekali' goes AFTER ('panas sekali' = very hot) — two emphasis options, don't use both at once. 'Matahari' = sun, a transparent compound 'mata + hari' (eye of the day). 'Berenang' (swim) uses the 'ber-' prefix on the root 'renang'. Distinguish 'di laut' (in the sea — location), 'ke laut' (to the sea — direction), 'dari laut' (from the sea). 'Jangan + verb' = don't do something. Antonym pair: tenang (calm) ↔ besar/ganas (big/fierce waves).",
    vocabulary: [
      { word: "pantai", en: "beach", vi: "bãi biển", pos: "noun", pronunciation_vi: "PAN-tai", pronunciation_en: "PAN-tai" },
      { word: "laut", en: "sea / ocean", vi: "biển", pos: "noun", pronunciation_vi: "LA-ut", pronunciation_en: "LA-oot" },
      { word: "pasir", en: "sand", vi: "cát", pos: "noun", pronunciation_vi: "PA-sir", pronunciation_en: "PA-seer" },
      { word: "ombak", en: "wave", vi: "sóng", pos: "noun", pronunciation_vi: "OM-bak", pronunciation_en: "OM-bak" },
      { word: "berenang", en: "to swim", vi: "bơi", pos: "verb", pronunciation_vi: "be-re-NANG", pronunciation_en: "be-re-NANG" },
      { word: "tabir surya", en: "sunscreen", vi: "kem chống nắng", pos: "noun", pronunciation_vi: "TA-bir SUR-ya", pronunciation_en: "TA-beer SOOR-ya" },
      { word: "matahari", en: "sun", vi: "mặt trời", pos: "noun", pronunciation_vi: "ma-ta-HA-ri", pronunciation_en: "ma-ta-HA-ree" },
      { word: "pulau", en: "island", vi: "đảo", pos: "noun", pronunciation_vi: "PU-lau", pronunciation_en: "POO-lau" },
      { word: "tenang", en: "calm / still", vi: "êm / lặng", pos: "adj.", pronunciation_vi: "te-NANG", pronunciation_en: "te-NANG" },
    ],
    dialogue: [
      { speaker: "Maya", text: "Hari ini cuaca cerah. Mau ke pantai, yuk?", vi: "Hôm nay trời nắng đẹp. Đi biển nhé?", en: "It's sunny today. Shall we go to the beach?" },
      { speaker: "Reza", text: "Ayo! Pasirnya putih dan ombaknya tenang, cocok buat berenang.", vi: "Đi thôi! Cát trắng, sóng êm, hợp để bơi.", en: "Let's go! White sand and calm waves, perfect for swimming." },
      { speaker: "Maya", text: "Tapi mataharinya panas sekali. Jangan lupa pakai tabir surya.", vi: "Nhưng nắng gắt lắm. Đừng quên bôi kem chống nắng.", en: "But the sun is very hot. Don't forget the sunscreen." },
      { speaker: "Reza", text: "Sudah bawa. Nanti kita santai di pasir dulu, baru berenang.", vi: "Mang theo rồi. Lát mình thư giãn trên cát trước, rồi bơi.", en: "Already brought it. Let's relax on the sand first, then swim." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về biển còn thiếu:",
        instruction_en: "Fill in the missing beach word:",
        items: [
          { prompt: "Hari ini saya mau pergi ke ___. (bãi biển)", answer: "pantai", options: ["pantai", "pasar", "pabrik"] },
          { prompt: "Saya suka ___ di laut. (bơi)", answer: "berenang", options: ["berenang", "berbicara", "berhenti"] },
          { prompt: "Jangan lupa pakai ___. (kem chống nắng)", answer: "tabir surya", options: ["tabir surya", "tempat tidur", "tukang cat"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "pantai", answer: "bãi biển" },
          { prompt: "pasir", answer: "cát" },
          { prompt: "ombak", answer: "sóng" },
          { prompt: "matahari", answer: "mặt trời" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Hôm nay tôi muốn đi ra biển.", answer: "Hari ini saya mau pergi ke pantai." },
          { prompt: "Cát trắng và sóng êm.", answer: "Pasirnya putih dan ombaknya tenang." },
          { prompt: "Tôi thích bơi ở biển.", answer: "Saya suka berenang di laut." },
        ],
      },
    ],
  },
  {
    id: "indonesian_beach_snorkel_dive",
    level: "A2",
    category: "beach-diving",
    title_vi: "Lặn ống thở và lặn bình — ngắm san hô",
    title_en: "Snorkeling and scuba diving — exploring the reef",
    sentences: [
      {
        en: "Saya ingin mencoba snorkeling besok.",
        vi: "Tôi muốn thử lặn ống thở vào ngày mai.",
        pronunciation_focus: [
          "mencoba → men-CHO-ba, 'thử' (gốc coba, 'c' đọc 'ch')",
          "snorkeling → đọc như tiếng Anh, dùng phổ biến",
          "besok → BE-sok, 'ngày mai'",
        ],
        pronunciation_focus_en: [
          "mencoba → 'men-CHOH-ba' — to try (root 'coba', 'c' = 'ch')",
          "snorkeling → said as in English; widely used",
          "besok → 'BE-sok' — tomorrow",
        ],
      },
      {
        en: "Di sini ada banyak terumbu karang yang indah.",
        vi: "Ở đây có nhiều rạn san hô đẹp.",
        pronunciation_focus: [
          "terumbu karang → 'rạn san hô' (terumbu = rạn, karang = san hô)",
          "banyak → BA-nyak, 'nhiều' (đứng TRƯỚC danh từ)",
          "indah → IN-dah, 'đẹp (cảnh)'",
        ],
        pronunciation_focus_en: [
          "terumbu karang → 'coral reef' (terumbu = reef, karang = coral)",
          "banyak → 'BA-nyak' — many (placed BEFORE the noun)",
          "indah → 'EEN-dah' — beautiful (scenery)",
        ],
      },
      {
        en: "Saya bisa menyelam, tapi belum punya sertifikat.",
        vi: "Tôi biết lặn, nhưng chưa có chứng chỉ.",
        pronunciation_focus: [
          "menyelam → me-nye-LAM, 'lặn (sâu)' (gốc selam)",
          "belum → be-LUM, 'chưa'; tidak = không (khác nhau!)",
          "sertifikat → ser-ti-fi-KAT, 'chứng chỉ' (vd PADI/SSI)",
        ],
        pronunciation_focus_en: [
          "menyelam → 'me-nye-LAM' — to dive (deep) (root 'selam')",
          "belum → 'be-LOOM' — not yet; tidak = not (different!)",
          "sertifikat → 'ser-tee-fee-KAT' — certificate (e.g. PADI/SSI)",
        ],
      },
      {
        en: "Tolong sewakan saya alat selam dan pelampung.",
        vi: "Làm ơn cho tôi thuê đồ lặn và phao.",
        pronunciation_focus: [
          "sewakan → SE-wa-kan, 'cho thuê' (gốc sewa = thuê)",
          "alat selam → 'thiết bị lặn' (alat = dụng cụ)",
          "pelampung → pe-lam-PUNG, 'phao/áo phao'",
        ],
        pronunciation_focus_en: [
          "sewakan → 'SE-wa-kan' — to rent out (root 'sewa' = to rent)",
          "alat selam → 'diving gear' (alat = equipment)",
          "pelampung → 'pe-lam-POONG' — float / life vest",
        ],
      },
      {
        en: "Jangan menyentuh karang karena bisa rusak.",
        vi: "Đừng chạm vào san hô vì có thể làm hỏng.",
        pronunciation_focus: [
          "menyentuh → me-nyen-TUH, 'chạm/sờ' (gốc sentuh)",
          "karena → KA-re-na, 'vì/bởi vì'",
          "rusak → RU-sak, 'hỏng/hư hại'",
        ],
        pronunciation_focus_en: [
          "menyentuh → 'me-nyen-TOOH' — to touch (root 'sentuh')",
          "karena → 'KA-re-na' — because",
          "rusak → 'ROO-sak' — broken / damaged",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia nằm trong 'Tam giác San hô' (Coral Triangle) — vùng đa dạng sinh học biển cao nhất hành tinh. 'Snorkeling' (lặn ống thở) và 'menyelam'/'diving' (lặn bình khí) là hoạt động du lịch chủ lực. Muốn lặn bình cần 'sertifikat' (chứng chỉ PADI/SSI); chưa có thì học 'kursus selam' hoặc thử 'discover scuba'. Thuê 'alat selam' (đồ lặn: mask/kính, fin/chân vịt, tabung/bình khí) ở 'dive center'. QUY TẮC BẢO TỒN cực kỳ quan trọng: 'jangan menyentuh karang' (đừng chạm san hô) và 'jangan ambil apa pun' (đừng lấy bất cứ thứ gì) — san hô rất dễ tổn thương. Từ vựng sinh vật: ikan (cá), penyu (rùa biển), pari (cá đuối), hiu (cá mập).",
    cultural_notes_en:
      "Indonesia sits in the 'Coral Triangle' — the planet's highest marine biodiversity. 'Snorkeling' and 'menyelam'/'diving' (scuba) are major tourism activities. Scuba needs a 'sertifikat' (PADI/SSI certificate); without one, take a 'kursus selam' (dive course) or try a 'discover scuba'. Rent 'alat selam' (gear: mask, fins, tank) at a dive center. CONSERVATION RULES matter a lot: 'jangan menyentuh karang' (don't touch the coral) and 'jangan ambil apa pun' (don't take anything) — reefs are fragile. Marine vocabulary: ikan (fish), penyu (sea turtle), pari (ray), hiu (shark).",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt 'belum' (chưa — có thể có sau) với 'tidak' (không — phủ định dứt khoát). 'Belum punya sertifikat' = chưa có chứng chỉ (ngụ ý sẽ có), khác 'tidak punya' = không có. Đây là lỗi rất phổ biến. 'banyak' (nhiều) đứng TRƯỚC danh từ: 'banyak ikan' = nhiều cá. Động từ gốc bắt đầu bằng 's' khi thêm me- biến 's' thành 'ny': selam → menyelam, sentuh → menyentuh, sewa → menyewa. Hậu tố '-kan' tạo nghĩa 'làm cho/cho ai': sewa (thuê) → sewakan (cho thuê). Nhớ quy tắc bảo tồn: 'jangan menyentuh karang'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish 'belum' (not yet — may happen later) from 'tidak' (not — flat negation). 'Belum punya sertifikat' = don't have a certificate yet (implies you will), vs 'tidak punya' = don't have one. A very common error. 'banyak' (many) goes BEFORE the noun: 'banyak ikan' = many fish. Root verbs starting with 's' turn 's' into 'ny' under the 'me-' prefix: selam → menyelam, sentuh → menyentuh, sewa → menyewa. The '-kan' suffix adds 'do for someone': sewa (rent) → sewakan (rent out). Remember the conservation rule: 'jangan menyentuh karang'.",
    vocabulary: [
      { word: "snorkeling", en: "snorkeling", vi: "lặn ống thở", pos: "noun/verb", pronunciation_vi: "SNOR-ke-ling", pronunciation_en: "SNOR-ke-ling" },
      { word: "menyelam", en: "to dive (scuba)", vi: "lặn (sâu)", pos: "verb", pronunciation_vi: "me-nye-LAM", pronunciation_en: "me-nye-LAM" },
      { word: "terumbu karang", en: "coral reef", vi: "rạn san hô", pos: "noun", pronunciation_vi: "te-RUM-bu KA-rang", pronunciation_en: "te-ROOM-boo KA-rang" },
      { word: "alat selam", en: "diving gear", vi: "thiết bị lặn", pos: "noun", pronunciation_vi: "A-lat SE-lam", pronunciation_en: "A-lat SE-lam" },
      { word: "pelampung", en: "float / life vest", vi: "phao / áo phao", pos: "noun", pronunciation_vi: "pe-lam-PUNG", pronunciation_en: "pe-lam-POONG" },
      { word: "sertifikat", en: "certificate", vi: "chứng chỉ", pos: "noun", pronunciation_vi: "ser-ti-fi-KAT", pronunciation_en: "ser-tee-fee-KAT" },
      { word: "ikan", en: "fish", vi: "cá", pos: "noun", pronunciation_vi: "I-kan", pronunciation_en: "EE-kan" },
      { word: "penyu", en: "sea turtle", vi: "rùa biển", pos: "noun", pronunciation_vi: "pe-NYU", pronunciation_en: "pe-NYOO" },
      { word: "rusak", en: "broken / damaged", vi: "hỏng / hư hại", pos: "adj.", pronunciation_vi: "RU-sak", pronunciation_en: "ROO-sak" },
    ],
    dialogue: [
      { speaker: "Turis", text: "Saya ingin mencoba snorkeling besok. Di sini ada terumbu karang?", vi: "Tôi muốn thử lặn ống thở ngày mai. Ở đây có rạn san hô không?", en: "I'd like to try snorkeling tomorrow. Are there coral reefs here?" },
      { speaker: "Pemandu", text: "Banyak, Bu, dan ikannya indah. Mau menyelam atau snorkeling saja?", vi: "Nhiều lắm ạ, và cá rất đẹp. Chị muốn lặn bình hay chỉ lặn ống thở?", en: "Plenty, ma'am, and the fish are beautiful. Scuba or just snorkeling?" },
      { speaker: "Turis", text: "Snorkeling saja. Saya bisa menyelam, tapi belum punya sertifikat.", vi: "Chỉ lặn ống thở thôi. Tôi biết lặn, nhưng chưa có chứng chỉ.", en: "Just snorkeling. I can dive, but I don't have a certificate yet." },
      { speaker: "Pemandu", text: "Baik. Saya sewakan alat dan pelampung. Ingat, jangan menyentuh karang, ya.", vi: "Được. Tôi cho thuê đồ và phao. Nhớ là đừng chạm san hô nhé.", en: "Alright. I'll rent you the gear and a float. Remember, don't touch the coral." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về lặn/san hô còn thiếu:",
        instruction_en: "Fill in the missing diving/reef word:",
        items: [
          { prompt: "Di sini ada banyak ___ yang indah. (rạn san hô)", answer: "terumbu karang", options: ["terumbu karang", "tempat tidur", "tabir surya"] },
          { prompt: "Saya bisa menyelam, tapi ___ punya sertifikat. (chưa)", answer: "belum", options: ["belum", "bukan", "jangan"] },
          { prompt: "Jangan ___ karang karena bisa rusak. (chạm)", answer: "menyentuh", options: ["menyentuh", "menonton", "menulis"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "menyelam", answer: "lặn (sâu)" },
          { prompt: "terumbu karang", answer: "rạn san hô" },
          { prompt: "alat selam", answer: "thiết bị lặn" },
          { prompt: "penyu", answer: "rùa biển" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn thử lặn ống thở vào ngày mai.", answer: "Saya ingin mencoba snorkeling besok." },
          { prompt: "Tôi biết lặn, nhưng chưa có chứng chỉ.", answer: "Saya bisa menyelam, tapi belum punya sertifikat." },
          { prompt: "Đừng chạm vào san hô vì có thể làm hỏng.", answer: "Jangan menyentuh karang karena bisa rusak." },
        ],
      },
    ],
  },
  {
    id: "indonesian_beach_destinations_conservation",
    level: "B1",
    category: "beach-diving",
    title_vi: "Điểm đến biển và bảo tồn — Bali, Raja Ampat, Komodo",
    title_en: "Marine destinations and conservation — Bali, Raja Ampat, Komodo",
    sentences: [
      {
        en: "Raja Ampat terkenal sebagai surga bagi penyelam.",
        vi: "Raja Ampat nổi tiếng là thiên đường cho thợ lặn.",
        pronunciation_focus: [
          "terkenal → ter-ke-NAL, 'nổi tiếng' (gốc kenal = quen biết)",
          "sebagai → se-ba-GAI, 'như là/với tư cách'",
          "penyelam → pe-nye-LAM, 'thợ lặn/người lặn' (gốc selam)",
        ],
        pronunciation_focus_en: [
          "terkenal → 'ter-ke-NAL' — famous (root 'kenal' = to know)",
          "sebagai → 'se-ba-GAI' — as / in the capacity of",
          "penyelam → 'pe-nye-LAM' — diver (root 'selam')",
        ],
      },
      {
        en: "Keanekaragaman hayati di sini sangat tinggi.",
        vi: "Đa dạng sinh học ở đây rất cao.",
        pronunciation_focus: [
          "keanekaragaman → 'sự đa dạng' (gốc aneka ragam = nhiều loại)",
          "hayati → ha-YA-ti, 'sinh học/sự sống'; keanekaragaman hayati = đa dạng sinh học",
          "tinggi → TING-gi, 'cao'",
        ],
        pronunciation_focus_en: [
          "keanekaragaman → 'diversity' (root 'aneka ragam' = many kinds)",
          "hayati → 'ha-YA-tee' — biological / living; keanekaragaman hayati = biodiversity",
          "tinggi → 'TEENG-gee' — high",
        ],
      },
      {
        en: "Kita harus menjaga kelestarian laut.",
        vi: "Chúng ta phải gìn giữ sự bền vững của biển.",
        pronunciation_focus: [
          "menjaga → men-JA-ga, 'gìn giữ/bảo vệ'",
          "kelestarian → ke-les-ta-RI-an, 'sự bền vững/bảo tồn' (gốc lestari)",
          "harus → HA-rus, 'phải'",
        ],
        pronunciation_focus_en: [
          "menjaga → 'men-JA-ga' — to protect / guard",
          "kelestarian → 'ke-les-ta-REE-an' — sustainability / preservation (root 'lestari')",
          "harus → 'HA-roos' — must",
        ],
      },
      {
        en: "Sampah plastik mengancam kehidupan laut.",
        vi: "Rác nhựa đe dọa sự sống của biển.",
        pronunciation_focus: [
          "sampah → SAM-pah, 'rác'",
          "mengancam → me-ngan-CHAM, 'đe dọa' (gốc ancam)",
          "kehidupan laut → 'đời sống biển/sinh vật biển'",
        ],
        pronunciation_focus_en: [
          "sampah → 'SAM-pah' — rubbish / trash",
          "mengancam → 'me-ngan-CHAM' — to threaten (root 'ancam')",
          "kehidupan laut → 'marine life'",
        ],
      },
      {
        en: "Sebaiknya kita tidak membuang sampah ke laut.",
        vi: "Tốt nhất ta không nên vứt rác xuống biển.",
        pronunciation_focus: [
          "membuang → mem-BU-ang, 'vứt/bỏ' (gốc buang)",
          "ke laut → 'xuống/ra biển' (ke = hướng)",
          "sebaiknya → se-BAIK-nya, 'tốt nhất nên' (khuyên)",
        ],
        pronunciation_focus_en: [
          "membuang → 'mem-BOO-ang' — to throw away (root 'buang')",
          "ke laut → 'into the sea' (ke = directional)",
          "sebaiknya → 'se-BAIK-nya' — it's best to (advice)",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia có những điểm lặn đẳng cấp thế giới: RAJA AMPAT (Tây Papua — đa dạng sinh học biển số 1 thế giới), KOMODO (vườn quốc gia, rồng Komodo + biển), BUNAKEN (Bắc Sulawesi), WAKATOBI, và BALI (Tulamben với xác tàu USAT Liberty, Nusa Penida với cá mola/manta). Nhiều nơi là 'taman nasional' (vườn quốc gia) hoặc 'kawasan konservasi' (khu bảo tồn) thu 'tiket masuk'/'biaya konservasi'. Vấn nạn lớn là 'sampah plastik' (rác nhựa) và tẩy trắng san hô ('pemutihan karang') do biến đổi khí hậu. Phong trào bảo tồn ('konservasi') mạnh; du khách có ý thức tuân thủ 'jaga kelestarian' (giữ gìn sự bền vững), không vứt rác, không lấy san hô/vỏ sò.",
    cultural_notes_en:
      "Indonesia has world-class dive sites: RAJA AMPAT (West Papua — the world's #1 marine biodiversity), KOMODO (national park, Komodo dragons + sea), BUNAKEN (North Sulawesi), WAKATOBI, and BALI (Tulamben with the USAT Liberty wreck, Nusa Penida for mola/manta). Many are a 'taman nasional' (national park) or 'kawasan konservasi' (conservation area) charging an entry / conservation fee. Big problems are 'sampah plastik' (plastic trash) and coral bleaching ('pemutihan karang') from climate change. The conservation ('konservasi') movement is strong; responsible tourists follow 'jaga kelestarian' (preserve sustainability), don't litter, and don't take coral or shells.",
    tip_advice_vi:
      "Mẹo cho người Việt: bậc B1 hay gặp danh từ hóa vòng 'ke-...-an' tạo khái niệm trừu tượng: lestari (bền vững) → kelestarian (sự bền vững), hidup (sống) → kehidupan (đời sống), aneka ragam → keanekaragaman (sự đa dạng). Nhận ra mẫu này giúp đọc văn môi trường. Người làm nghề dùng tiền tố 'pe(N)-': selam → penyelam (thợ lặn), giống cách 'wisata → wisatawan' (du khách). 'Terkenal' (nổi tiếng) dùng tiền tố ter- chỉ trạng thái. 'Menjaga kelestarian' = gìn giữ sự bền vững — cụm cố định trong diễn ngôn bảo tồn. 'Sebaiknya tidak…' = tốt nhất không nên… (lời khuyên lịch sự).",
    tip_advice_en:
      "Tip for Vietnamese speakers: at B1 you'll meet the 'ke-...-an' circumfix forming abstract nouns: lestari (sustainable) → kelestarian (sustainability), hidup (live) → kehidupan (life), aneka ragam → keanekaragaman (diversity). Spotting this pattern helps you read environmental texts. Agent nouns use the 'pe(N)-' prefix: selam → penyelam (diver), like 'wisata → wisatawan' (tourist). 'Terkenal' (famous) uses the stative 'ter-' prefix. 'Menjaga kelestarian' = to preserve sustainability — a fixed phrase in conservation talk. 'Sebaiknya tidak…' = it's best not to… (polite advice).",
    vocabulary: [
      { word: "terkenal", en: "famous", vi: "nổi tiếng", pos: "adj.", pronunciation_vi: "ter-ke-NAL", pronunciation_en: "ter-ke-NAL" },
      { word: "penyelam", en: "diver", vi: "thợ lặn", pos: "noun", pronunciation_vi: "pe-nye-LAM", pronunciation_en: "pe-nye-LAM" },
      { word: "keanekaragaman hayati", en: "biodiversity", vi: "đa dạng sinh học", pos: "noun", pronunciation_vi: "ke-a-ne-ka-ra-GA-man ha-YA-ti", pronunciation_en: "ke-a-ne-ka-ra-GA-man ha-YA-tee" },
      { word: "kelestarian", en: "sustainability / preservation", vi: "sự bền vững / bảo tồn", pos: "noun", pronunciation_vi: "ke-les-ta-RI-an", pronunciation_en: "ke-les-ta-REE-an" },
      { word: "konservasi", en: "conservation", vi: "bảo tồn", pos: "noun", pronunciation_vi: "kon-ser-VA-si", pronunciation_en: "kon-ser-VA-see" },
      { word: "menjaga", en: "to protect / guard", vi: "gìn giữ / bảo vệ", pos: "verb", pronunciation_vi: "men-JA-ga", pronunciation_en: "men-JA-ga" },
      { word: "sampah", en: "rubbish / trash", vi: "rác", pos: "noun", pronunciation_vi: "SAM-pah", pronunciation_en: "SAM-pah" },
      { word: "mengancam", en: "to threaten", vi: "đe dọa", pos: "verb", pronunciation_vi: "me-ngan-CHAM", pronunciation_en: "me-ngan-CHAM" },
      { word: "taman nasional", en: "national park", vi: "vườn quốc gia", pos: "noun", pronunciation_vi: "TA-man na-si-o-NAL", pronunciation_en: "TA-man na-see-o-NAL" },
    ],
    dialogue: [
      { speaker: "Wisatawan", text: "Saya dengar Raja Ampat terkenal sebagai surga penyelam. Benar?", vi: "Tôi nghe nói Raja Ampat nổi tiếng là thiên đường thợ lặn. Đúng không?", en: "I heard Raja Ampat is famous as a divers' paradise. Is that right?" },
      { speaker: "Pemandu", text: "Benar sekali. Keanekaragaman hayatinya tertinggi di dunia.", vi: "Đúng quá. Đa dạng sinh học ở đó cao nhất thế giới.", en: "Absolutely. Its biodiversity is the highest in the world." },
      { speaker: "Wisatawan", text: "Luar biasa. Tapi katanya sampah plastik mengancam terumbu karang, ya?", vi: "Tuyệt vời. Nhưng nghe nói rác nhựa đe dọa rạn san hô phải không?", en: "Amazing. But they say plastic trash threatens the reefs, right?" },
      { speaker: "Pemandu", text: "Sayangnya iya. Karena itu kita harus menjaga kelestarian dan tidak membuang sampah ke laut.", vi: "Tiếc là đúng. Vì thế ta phải gìn giữ sự bền vững và không vứt rác xuống biển.", en: "Sadly yes. So we must preserve sustainability and not throw trash into the sea." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về điểm đến/bảo tồn còn thiếu:",
        instruction_en: "Fill in the missing destination/conservation word:",
        items: [
          { prompt: "Raja Ampat ___ sebagai surga bagi penyelam. (nổi tiếng)", answer: "terkenal", options: ["terkenal", "terlambat", "terbuka"] },
          { prompt: "Kita harus menjaga ___ laut. (sự bền vững)", answer: "kelestarian", options: ["kelestarian", "keamanan", "kemarin"] },
          { prompt: "Sebaiknya kita tidak ___ sampah ke laut. (vứt)", answer: "membuang", options: ["membuang", "membaca", "membeli"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "penyelam", answer: "thợ lặn" },
          { prompt: "kelestarian", answer: "sự bền vững" },
          { prompt: "sampah", answer: "rác" },
          { prompt: "taman nasional", answer: "vườn quốc gia" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Raja Ampat nổi tiếng là thiên đường cho thợ lặn.", answer: "Raja Ampat terkenal sebagai surga bagi penyelam." },
          { prompt: "Chúng ta phải gìn giữ sự bền vững của biển.", answer: "Kita harus menjaga kelestarian laut." },
          { prompt: "Rác nhựa đe dọa sự sống của biển.", answer: "Sampah plastik mengancam kehidupan laut." },
        ],
      },
    ],
  },
];

export default beachDivingLessons;
