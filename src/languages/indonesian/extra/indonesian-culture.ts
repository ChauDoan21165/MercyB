// src/languages/indonesian/extra/indonesian-culture.ts
//
// Indonesian Culture pack for Vietnamese learners.
// Hand-crafted study track: gotong royong, Pancasila, Lebaran, Nyepi, batik,
// gamelan, and the everyday cultural etiquette that decides whether a foreigner
// is treated as a guest or an outsider in Indonesia.
//
// Vietnamese-first: every line carries a `vi` gloss, `pronunciation_focus`
// holds the Vietnamese-facing pronunciation/grammar note (incl. the predictable
// Vietnamese-speaker mistake = L1 note), and `pronunciation_focus_en` is the
// English-speaker companion (same order). Indonesian uses the Latin alphabet
// so there is no special script rendering — but the SOUNDS differ from
// Vietnamese in ways the notes below flag.
//
// Self-contained on purpose: the shared Indonesian lesson registry
// (src/languages/indonesian/lessons.ts) is authored by a sibling agent and may
// not exist yet. The inline types below mirror the Portuguese/Italian extra
// packs so the page UI stays consistent. When the registry lands, swap these
// for a shared import.

export type LessonSentence = {
  // The Indonesian target line the learner speaks.
  en: string;
  // Vietnamese meaning.
  vi: string;
  // Vietnamese-facing pronunciation / grammar / culture note (incl. L1 traps).
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  cell_id?: string;
  // Indonesian word/phrase.
  word: string;
  en: string;
  vi: string;
  pos: string;
  // Vietnamese-speaker pronunciation hint, stressed syllable in CAPS.
  pronunciation_vi: string;
  // English-speaker pronunciation hint, stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
export type Exercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
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

export const lessons: IndonesianLesson[] = [
  // ──────────────────────────────────────────────────────────────────────
  // 1. Gotong royong — communal cooperation
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_culture_gotong_royong",
    level: "A2",
    category: "culture",
    title_vi: "Gotong royong — tinh thần tương trợ cộng đồng",
    title_en: "Gotong royong — communal cooperation",
    sentences: [
      {
        en: "Gotong royong adalah semangat kerja sama dalam masyarakat.",
        vi: "Gotong royong là tinh thần hợp tác trong cộng đồng.",
        pronunciation_focus: [
          "gotong → go-TONG, 'ng' cuối ngân như 'ng' trong 'mang'",
          "royong → ro-YONG, chữ 'r' phải RUNG lưỡi, không phải 'd'",
          "adalah → a-da-LAH = 'là'; không có động từ 'to be' chia như tiếng Anh",
          "masyarakat → ma-sya-ra-KAT = xã hội",
        ],
        pronunciation_focus_en: [
          "gotong → 'go-TONG' — final 'ng' as in 'sing'",
          "royong → 'ro-YONG' — roll the 'r'; it is a tapped/trilled r, not English 'r'",
          "adalah → 'ah-dah-LAH' = 'is/are'; Indonesian has no conjugated 'to be'",
          "masyarakat → 'mah-sya-rah-KAT' = society/community",
        ],
      },
      {
        en: "Setiap minggu warga kampung membersihkan jalan bersama.",
        vi: "Mỗi tuần dân làng cùng nhau dọn dẹp đường phố.",
        pronunciation_focus: [
          "setiap → se-TI-ap = mỗi",
          "warga → WAR-ga = dân cư, công dân",
          "kampung → kam-PUNG = làng, xóm",
          "membersihkan → mem-ber-SIH-kan; tiền tố meN- + bersih + -kan = 'làm cho sạch'",
        ],
        pronunciation_focus_en: [
          "setiap → 'suh-TEE-ap' = every/each",
          "warga → 'WAR-gah' = resident/citizen",
          "kampung → 'kam-POONG' = village/neighbourhood",
          "membersihkan → 'mem-ber-SIH-kan'; meN- + bersih (clean) + -kan = 'to clean (something)'",
        ],
      },
      {
        en: "Mari kita bantu tetangga yang sedang membangun rumah.",
        vi: "Nào chúng ta giúp người hàng xóm đang xây nhà.",
        pronunciation_focus: [
          "mari kita → MA-ri KI-ta = 'nào chúng ta' (lời rủ rê lịch sự)",
          "tetangga → te-TANG-ga = hàng xóm; chú ý 'ngg' = ng + g",
          "sedang → se-DANG = đang (dấu hiệu thì tiếp diễn)",
          "membangun → mem-ba-NGUN = xây dựng",
        ],
        pronunciation_focus_en: [
          "mari kita → 'MAH-ree KEE-tah' = 'let us' (polite, inclusive 'we')",
          "tetangga → 'tuh-TANG-gah' = neighbour; 'ngg' = ng followed by a hard g",
          "sedang → 'suh-DANG' = the present-continuous marker ('-ing')",
          "membangun → 'mem-bah-NGOON' = to build",
        ],
      },
    ],
    cultural_notes_vi:
      "Gotong royong là giá trị cốt lõi của xã hội Indonesia — gần giống 'lá lành đùm lá rách' hay 'tối lửa tắt đèn có nhau' của người Việt. Cả khu phố cùng dọn vệ sinh, dựng nhà, tổ chức đám cưới hay đám tang mà không tính tiền công. Nếu bạn sống ở Indonesia và được mời tham gia kerja bakti (lao động công ích) cuối tuần, từ chối sẽ bị coi là sống tách biệt, không hòa nhập. Người Việt rất dễ hiểu khái niệm này vì văn hóa làng xã hai nước rất giống nhau.",
    cultural_notes_en:
      "Gotong royong (mutual cooperation) is a core Indonesian value, similar to the Vietnamese village ethic of neighbours helping neighbours. A whole neighbourhood cleans streets, builds houses, and runs weddings or funerals together with no payment expected. If you live in Indonesia and are invited to weekend kerja bakti (community work), declining marks you as aloof. Vietnamese learners grasp this fast — both cultures share the same communal village roots.",
    tip_advice_vi:
      "Mẹo phát âm cho người Việt: chữ 'r' trong tiếng Indonesia phải RUNG lưỡi (giống 'r' tiếng Tây Ban Nha), KHÔNG đọc thành 'd' hay 'z' như tiếng Việt miền Bắc/Nam. 'royong' không phải 'doyong'. Âm 'ng' đầu từ (ngun, nga) là thử thách lớn nhất — xem file pronunciation-guide.ts.",
    tip_advice_en:
      "Pronunciation tip for Vietnamese speakers: the Indonesian 'r' is rolled/tapped (like Spanish), never softened to a 'd' or 'z'. Word-initial 'ng' (as in many affixed verbs) is the hardest sound — see pronunciation-guide.ts.",
    vocabulary: [
      { cell_id: "8d3a4c34-b2e9-4374-b49e-43682c117da5", word: "gotong royong", en: "communal cooperation", vi: "tinh thần tương trợ cộng đồng", pos: "noun phrase", pronunciation_vi: "go-TONG ro-YONG", pronunciation_en: "go-TONG ro-YONG" },
      { cell_id: "8d7848ca-3a2b-40a6-8790-adb33469d08b", word: "kerja bakti", en: "community volunteer work", vi: "lao động công ích", pos: "noun phrase", pronunciation_vi: "KER-ja BAK-ti", pronunciation_en: "KER-jah BAHK-tee" },
      { cell_id: "9e7bcd55-d388-4878-b794-430a70a126e0", word: "tetangga", en: "neighbour", vi: "hàng xóm", pos: "noun", pronunciation_vi: "te-TANG-ga", pronunciation_en: "tuh-TANG-gah" },
      { cell_id: "74a4a08b-4bf9-45f4-ba7f-f81f24f66f4b", word: "warga", en: "resident, citizen", vi: "dân cư, công dân", pos: "noun", pronunciation_vi: "WAR-ga", pronunciation_en: "WAR-gah" },
      { cell_id: "2add9b9d-f3b8-4b55-a194-85f26aaacdf8", word: "masyarakat", en: "society, community", vi: "xã hội", pos: "noun", pronunciation_vi: "ma-sya-ra-KAT", pronunciation_en: "mah-sya-rah-KAT" },
      { cell_id: "4dd1929e-142a-4f6d-8a5b-c66aa63aeecd", word: "bersama", en: "together", vi: "cùng nhau", pos: "adverb", pronunciation_vi: "ber-SA-ma", pronunciation_en: "ber-SAH-mah" },
      { cell_id: "b4e80758-7686-48cb-b282-5540477c7038", word: "membantu", en: "to help", vi: "giúp đỡ", pos: "verb", pronunciation_vi: "mem-BAN-tu", pronunciation_en: "mem-BAN-too" },
    ],
    dialogue: [
      { cell_id: "ca067dd2-d0c5-452f-bfb1-8d0f40a93ccd", speaker: "Pak Budi", text: "Besok ada kerja bakti di kampung. Bisa ikut?", vi: "Mai có lao động công ích ở làng. Tham gia được không?", en: "There's community work in the neighbourhood tomorrow. Can you join?" },
      { cell_id: "58346948-1ff1-4dfc-86ab-37423c904540", speaker: "Anh", text: "Tentu saja! Saya bawa apa?", vi: "Tất nhiên! Tôi mang gì đến?", en: "Of course! What should I bring?" },
      { cell_id: "dd8428cf-1544-4d65-a798-95630879d07d", speaker: "Pak Budi", text: "Bawa sapu saja. Kita bersihkan selokan bersama.", vi: "Mang chổi thôi. Chúng ta cùng dọn cống rãnh.", en: "Just bring a broom. We'll clean the drains together." },
      { cell_id: "844d0f18-e6be-473e-b244-11d82ae1f9bb", speaker: "Anh", text: "Siap, Pak. Gotong royong memang penting.", vi: "Sẵn sàng, bác ạ. Tinh thần tương trợ đúng là quan trọng.", en: "Ready, sir. Mutual cooperation really matters." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian word with its Vietnamese meaning:",
        items: [
          { prompt: "gotong royong", answer: "tinh thần tương trợ" },
          { prompt: "tetangga", answer: "hàng xóm" },
          { prompt: "kampung", answer: "làng, xóm" },
          { prompt: "bersama", answer: "cùng nhau" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          { prompt: "Mari kita ___ tetangga. (giúp)", answer: "bantu", options: ["bantu", "beli", "makan"] },
          { prompt: "Warga ___ membersihkan jalan. (cùng nhau)", answer: "bersama", options: ["sendiri", "bersama", "jauh"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Pancasila — the five founding principles
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_culture_pancasila",
    level: "B1",
    category: "culture",
    title_vi: "Pancasila — năm nguyên tắc lập quốc",
    title_en: "Pancasila — the five founding principles",
    sentences: [
      {
        en: "Pancasila adalah dasar negara Indonesia.",
        vi: "Pancasila là nền tảng quốc gia của Indonesia.",
        pronunciation_focus: [
          "Pancasila → pan-ca-SI-la; 'c' đọc là 'ch' (cha), KHÔNG phải 'k' hay 's'",
          "dasar → DA-sar = nền tảng",
          "negara → ne-GA-ra = quốc gia, nhà nước",
          "'panca' = năm (gốc tiếng Phạn), 'sila' = nguyên tắc",
        ],
        pronunciation_focus_en: [
          "Pancasila → 'pan-cha-SEE-lah'; the letter 'c' is always 'ch' as in 'church'",
          "dasar → 'DAH-sar' = foundation/basis",
          "negara → 'nuh-GAH-rah' = state/nation",
          "'panca' = five (Sanskrit), 'sila' = principle",
        ],
      },
      {
        en: "Sila pertama adalah Ketuhanan Yang Maha Esa.",
        vi: "Nguyên tắc thứ nhất là Tín ngưỡng vào Thượng Đế Tối Cao Duy Nhất.",
        pronunciation_focus: [
          "pertama → per-TA-ma = thứ nhất",
          "Ketuhanan → ke-tu-HA-nan = tín ngưỡng/thần thánh (gốc 'tuhan' = Chúa/Trời)",
          "Maha Esa → MA-ha E-sa = Tối Cao Duy Nhất",
          "Indonesia công nhận nhiều tôn giáo, không phải nhà nước thế tục hoàn toàn",
        ],
        pronunciation_focus_en: [
          "pertama → 'per-TAH-mah' = first",
          "Ketuhanan → 'kuh-too-HAH-nan' = belief in God (root 'tuhan' = God)",
          "Maha Esa → 'MAH-hah EH-sah' = the One Almighty",
          "Indonesia recognises several official religions; it is not a fully secular state",
        ],
      },
      {
        en: "Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu.",
        vi: "Bhinneka Tunggal Ika nghĩa là khác biệt nhưng vẫn là một.",
        pronunciation_focus: [
          "Bhinneka → bin-NE-ka; 'bh' đọc như 'b' thường",
          "Tunggal → TUNG-gal = duy nhất, đơn nhất",
          "berarti → ber-AR-ti = có nghĩa là",
          "berbeda-beda → từ lặp (reduplikasi) = 'khác biệt nhiều thứ' — đặc trưng tiếng Indonesia",
        ],
        pronunciation_focus_en: [
          "Bhinneka → 'bin-NEH-kah'; the 'bh' is just a 'b'",
          "Tunggal → 'TOONG-gal' = single/unified",
          "berarti → 'ber-AR-tee' = means",
          "berbeda-beda → reduplication = 'diverse'; doubling a root is a key Indonesian feature",
        ],
      },
    ],
    cultural_notes_vi:
      "Pancasila là hệ tư tưởng lập quốc gồm 5 nguyên tắc: (1) Tín ngưỡng vào Thượng Đế, (2) Nhân đạo công bằng và văn minh, (3) Thống nhất Indonesia, (4) Dân chủ qua hiệp thương, (5) Công bằng xã hội. Khẩu hiệu quốc gia 'Bhinneka Tunggal Ika' (Thống nhất trong đa dạng) phản ánh một đất nước hơn 17.000 đảo, 700 ngôn ngữ, 6 tôn giáo chính thức. Khác Việt Nam, Indonesia BẮT BUỘC mỗi công dân khai một tôn giáo trên CMND. Người vô thần gặp khó khăn pháp lý — đây là điểm cần lưu ý khi sống và làm việc ở đây.",
    cultural_notes_en:
      "Pancasila is the state ideology of five principles: belief in God; just and civilised humanity; the unity of Indonesia; democracy through deliberation; and social justice. The national motto 'Bhinneka Tunggal Ika' (Unity in Diversity) reflects a nation of 17,000+ islands, 700 languages, and six official religions. Unlike Vietnam, Indonesia requires every citizen to declare a religion on their ID card; atheism creates legal friction — worth knowing if you live or work there.",
    tip_advice_vi:
      "Quy tắc vàng cho người Việt: chữ 'c' trong tiếng Indonesia LUÔN đọc là 'ch' (như 'cha'), không bao giờ đọc 'k'. 'Pancasila' = 'pan-cha-si-la'. 'baca' (đọc) = 'ba-cha'. Đây là lỗi số một của người mới học vì tiếng Việt và tiếng Anh đọc 'c' khác.",
    tip_advice_en:
      "Golden rule for Vietnamese speakers: Indonesian 'c' is ALWAYS 'ch' as in 'church', never 'k'. 'Pancasila' = 'pan-cha-see-lah'; 'baca' (to read) = 'BAH-chah'. This is the number-one beginner error.",
    vocabulary: [
      { cell_id: "60912a41-6659-40c8-9419-83b8b8b29196", word: "Pancasila", en: "the five state principles", vi: "năm nguyên tắc lập quốc", pos: "proper noun", pronunciation_vi: "pan-ca-SI-la", pronunciation_en: "pan-cha-SEE-lah" },
      { cell_id: "a41547b3-a9b4-4e03-b615-4356f79ea793", word: "negara", en: "state, nation", vi: "quốc gia, nhà nước", pos: "noun", pronunciation_vi: "ne-GA-ra", pronunciation_en: "nuh-GAH-rah" },
      { cell_id: "50bd6a50-4259-46ff-85c2-4618028908eb", word: "dasar", en: "basis, foundation", vi: "nền tảng", pos: "noun", pronunciation_vi: "DA-sar", pronunciation_en: "DAH-sar" },
      { cell_id: "d065a521-73ef-4665-bc28-9162dfbc5623", word: "persatuan", en: "unity", vi: "sự thống nhất", pos: "noun", pronunciation_vi: "per-sa-TU-an", pronunciation_en: "per-sah-TOO-an" },
      { cell_id: "0e110c58-f080-464d-bf67-ab52eafcde44", word: "keadilan", en: "justice", vi: "công lý, công bằng", pos: "noun", pronunciation_vi: "ke-a-DIL-an", pronunciation_en: "kuh-ah-DEEL-an" },
      { cell_id: "ffc9e92c-6174-4da7-b3a4-fdc9f3216ac9", word: "Bhinneka Tunggal Ika", en: "Unity in Diversity", vi: "Thống nhất trong đa dạng", pos: "motto", pronunciation_vi: "bin-NE-ka TUNG-gal I-ka", pronunciation_en: "bin-NEH-kah TOONG-gal EE-kah" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Pancasila là nền tảng quốc gia.", answer: "Pancasila adalah dasar negara." },
          { prompt: "Khác biệt nhưng vẫn là một.", answer: "Berbeda-beda tetapi tetap satu." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền chữ 'c' và đọc đúng (ch):",
        instruction_en: "The letter 'c' below is read as 'ch':",
        items: [
          { prompt: "Pan___asila = năm nguyên tắc", answer: "c", options: ["c", "k", "s"] },
          { prompt: "ba___a = đọc", answer: "c", options: ["c", "k", "s"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. Lebaran / Idul Fitri — the biggest holiday
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_culture_lebaran",
    level: "A2",
    category: "culture",
    title_vi: "Lebaran (Idul Fitri) — lễ lớn nhất trong năm",
    title_en: "Lebaran (Idul Fitri) — the biggest festival",
    sentences: [
      {
        en: "Selamat Hari Raya Idul Fitri! Mohon maaf lahir dan batin.",
        vi: "Chúc mừng lễ Idul Fitri! Xin lỗi từ tâm hồn đến thể xác.",
        pronunciation_focus: [
          "Selamat → se-LA-mat = chúc mừng / an lành",
          "Hari Raya → HA-ri RA-ya = ngày lễ lớn",
          "mohon maaf → MO-hon ma-AF = xin thứ lỗi (trang trọng)",
          "lahir dan batin → 'thể xác và tâm hồn' — câu chúc cố định, không dịch từng chữ",
        ],
        pronunciation_focus_en: [
          "Selamat → 'suh-LAH-mat' = congratulations / safe",
          "Hari Raya → 'HAH-ree RAH-yah' = the great day/festival",
          "mohon maaf → 'MOH-hon mah-AF' = I beg forgiveness (formal)",
          "lahir dan batin → 'in body and soul' — a fixed greeting, don't translate literally",
        ],
      },
      {
        en: "Setiap tahun jutaan orang mudik ke kampung halaman.",
        vi: "Mỗi năm hàng triệu người về quê ăn lễ.",
        pronunciation_focus: [
          "jutaan → ju-TA-an = hàng triệu",
          "mudik → MU-dik = về quê dịp lễ (từ đặc trưng, không có trong tiếng Anh)",
          "kampung halaman → quê hương, quê gốc",
          "Đây là cuộc di cư thường niên lớn nhất thế giới",
        ],
        pronunciation_focus_en: [
          "jutaan → 'joo-TAH-an' = millions",
          "mudik → 'MOO-dik' = the holiday homecoming exodus (no English equivalent)",
          "kampung halaman → 'home village/hometown'",
          "It is one of the world's largest annual human migrations",
        ],
      },
      {
        en: "Keluarga berkumpul, makan ketupat, dan minta maaf.",
        vi: "Gia đình tụ họp, ăn ketupat, và xin lỗi nhau.",
        pronunciation_focus: [
          "keluarga → ke-lu-AR-ga = gia đình",
          "berkumpul → ber-KUM-pul = tụ họp (tiền tố ber-)",
          "ketupat → ke-TU-pat = bánh gạo gói lá dừa hình thoi",
          "minta maaf → MIN-ta ma-AF = xin lỗi (thân mật hơn 'mohon maaf')",
        ],
        pronunciation_focus_en: [
          "keluarga → 'kuh-loo-AR-gah' = family",
          "berkumpul → 'ber-KOOM-pool' = to gather (ber- prefix)",
          "ketupat → 'kuh-TOO-pat' = diamond-shaped rice cake in woven palm leaves",
          "minta maaf → 'MIN-tah mah-AF' = sorry (more casual than 'mohon maaf')",
        ],
      },
    ],
    cultural_notes_vi:
      "Lebaran (tên chính thức Idul Fitri) là ngày kết thúc tháng nhịn ăn Ramadan — lễ quan trọng nhất với người Hồi giáo Indonesia (gần 90% dân số). Truyền thống 'mudik' (về quê) khiến cả nước gần như đóng cửa 1-2 tuần; vé tàu xe bán hết trước hàng tháng. Người ta mặc đồ mới, thăm họ hàng, và nói 'mohon maaf lahir dan batin' để xin tha thứ mọi lỗi lầm trong năm. Trẻ con và người chưa lập gia đình nhận 'THR' (tiền lì xì) — rất giống tục lì xì Tết của người Việt. Nếu làm việc ở Indonesia, đừng lên lịch họp quan trọng quanh dịp này.",
    cultural_notes_en:
      "Lebaran (officially Idul Fitri) marks the end of Ramadan fasting — the most important festival for Indonesia's Muslim majority (~90%). The 'mudik' homecoming nearly shuts the country down for one to two weeks; transport tickets sell out months ahead. People wear new clothes, visit relatives, and say 'mohon maaf lahir dan batin' to ask forgiveness for the year's wrongs. Children and the unmarried receive 'THR' cash gifts — much like Vietnamese lì xì at Tết. Don't schedule key meetings around this period.",
    tip_advice_vi:
      "So sánh với người Việt: Lebaran = Tết của Indonesia. 'mudik' = 'về quê ăn Tết'. 'THR' = 'lì xì'. Dùng phép so sánh này để nhớ nhanh. Lưu ý: lời chúc 'mohon maaf lahir dan batin' là cụm cố định — học thuộc cả câu, đừng ghép từ.",
    tip_advice_en:
      "Map it to Vietnamese: Lebaran = Indonesia's Tết, 'mudik' = going home for the holiday, 'THR' = lucky money. Learn 'mohon maaf lahir dan batin' as one fixed chunk, not word by word.",
    vocabulary: [
      { cell_id: "bdb9d969-41c6-4ab6-a379-d9a10e82f865", word: "Lebaran", en: "Eid al-Fitr (popular name)", vi: "lễ Idul Fitri", pos: "noun", pronunciation_vi: "le-BA-ran", pronunciation_en: "luh-BAH-ran" },
      { cell_id: "7a556db9-92f6-4337-9df5-bbf58d2a3c8e", word: "mudik", en: "holiday homecoming", vi: "về quê dịp lễ", pos: "verb/noun", pronunciation_vi: "MU-dik", pronunciation_en: "MOO-dik" },
      { cell_id: "186dad08-9bb7-484d-8765-c43b46211f38", word: "ketupat", en: "woven rice cake", vi: "bánh gạo gói lá", pos: "noun", pronunciation_vi: "ke-TU-pat", pronunciation_en: "kuh-TOO-pat" },
      { cell_id: "e36d6bf2-a125-41c6-ad0c-1cfec880d735", word: "keluarga", en: "family", vi: "gia đình", pos: "noun", pronunciation_vi: "ke-lu-AR-ga", pronunciation_en: "kuh-loo-AR-gah" },
      { cell_id: "731e6276-8efe-4e5a-8ce4-3a142ff34f98", word: "maaf", en: "sorry, forgiveness", vi: "xin lỗi", pos: "noun/interjection", pronunciation_vi: "ma-AF", pronunciation_en: "mah-AF" },
      { cell_id: "2eb970ba-d401-432b-abfe-c42da0f9eb5b", word: "selamat", en: "congratulations, safe", vi: "chúc mừng, an lành", pos: "interjection", pronunciation_vi: "se-LA-mat", pronunciation_en: "suh-LAH-mat" },
      { cell_id: "8c39d656-f649-4555-b322-db51c8c49223", word: "THR (tunjangan hari raya)", en: "holiday bonus / cash gift", vi: "tiền lì xì lễ", pos: "noun", pronunciation_vi: "te-ha-ER", pronunciation_en: "teh-hah-AIR" },
    ],
    dialogue: [
      { cell_id: "d287742c-84c6-4181-8d99-583aab090e5a", speaker: "Rina", text: "Selamat Idul Fitri! Mohon maaf lahir dan batin ya.", vi: "Chúc mừng Idul Fitri! Mong bạn thứ lỗi mọi điều nhé.", en: "Happy Eid! Please forgive me for everything." },
      { cell_id: "0eb369d0-e56e-434c-be4c-edbacfa56f23", speaker: "Anh", text: "Sama-sama. Mohon maaf juga. Mudik ke mana?", vi: "Cũng vậy. Tôi cũng xin lỗi. Về quê ở đâu thế?", en: "Likewise. I'm sorry too. Where are you heading home to?" },
      { cell_id: "edefa848-846f-42b8-8339-5f6c3e763b30", speaker: "Rina", text: "Ke Yogyakarta. Rumah orang tua di sana.", vi: "Về Yogyakarta. Nhà bố mẹ ở đó.", en: "To Yogyakarta. My parents' home is there." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối phong tục Indonesia với tục Việt tương đương:",
        instruction_en: "Match each Indonesian custom to its Vietnamese counterpart:",
        items: [
          { prompt: "mudik", answer: "về quê ăn Tết" },
          { prompt: "THR", answer: "lì xì" },
          { prompt: "Lebaran", answer: "Tết (lễ lớn nhất)" },
          { prompt: "ketupat", answer: "bánh chưng/bánh tét (món lễ)" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Nyepi — the Balinese Day of Silence
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_culture_nyepi",
    level: "B1",
    category: "culture",
    title_vi: "Nyepi — Ngày Tĩnh Lặng của người Bali",
    title_en: "Nyepi — the Balinese Day of Silence",
    sentences: [
      {
        en: "Nyepi adalah hari raya umat Hindu Bali untuk merenung.",
        vi: "Nyepi là ngày lễ của người Hindu Bali để tĩnh tâm suy ngẫm.",
        pronunciation_focus: [
          "Nyepi → NYE-pi; 'ny' đọc như 'nh' tiếng Việt (nhà)",
          "umat → U-mat = tín đồ, cộng đồng tín ngưỡng",
          "Hindu → HIN-du = đạo Hindu",
          "merenung → me-re-NUNG = suy ngẫm, trầm tư",
        ],
        pronunciation_focus_en: [
          "Nyepi → 'NYEH-pee'; 'ny' = the 'ñ' sound, like Vietnamese 'nh'",
          "umat → 'OO-mat' = religious community/followers",
          "Hindu → 'HIN-doo'",
          "merenung → 'muh-ruh-NOONG' = to reflect/contemplate",
        ],
      },
      {
        en: "Pada hari Nyepi, semua orang harus diam di rumah.",
        vi: "Vào ngày Nyepi, mọi người phải ở yên trong nhà.",
        pronunciation_focus: [
          "pada → PA-da = vào (giới từ chỉ thời gian/vị trí)",
          "semua → se-MU-a = tất cả",
          "harus → HA-rus = phải (bắt buộc)",
          "diam → DI-am = im lặng, ở yên",
        ],
        pronunciation_focus_en: [
          "pada → 'PAH-dah' = on/at (time/place preposition)",
          "semua → 'suh-MOO-ah' = all/everyone",
          "harus → 'HAH-roos' = must",
          "diam → 'DEE-am' = silent, still",
        ],
      },
      {
        en: "Bandara ditutup dan lampu dimatikan sepanjang hari.",
        vi: "Sân bay đóng cửa và đèn tắt suốt cả ngày.",
        pronunciation_focus: [
          "bandara → ban-DA-ra = sân bay",
          "ditutup → di-TU-tup = bị đóng (tiền tố thụ động di-)",
          "dimatikan → di-ma-TI-kan = bị tắt (di- + mati + -kan)",
          "sepanjang → se-pan-JANG = suốt, dọc theo",
        ],
        pronunciation_focus_en: [
          "bandara → 'ban-DAH-rah' = airport",
          "ditutup → 'dee-TOO-toop' = is closed (passive di- prefix)",
          "dimatikan → 'dee-mah-TEE-kan' = is turned off (di- + mati 'dead' + -kan)",
          "sepanjang → 'suh-pan-JANG' = throughout/along",
        ],
      },
    ],
    cultural_notes_vi:
      "Nyepi là Tết âm lịch của người Hindu Bali — nhưng ăn mừng theo cách độc nhất thế giới: bằng SỰ IM LẶNG TUYỆT ĐỐI trong 24 giờ. Không ra đường, không bật đèn, không làm việc, không giải trí, nhiều người nhịn ăn. Cả đảo Bali ngừng hoạt động: sân bay đóng cửa hoàn toàn (chuyến bay duy nhất trong năm bị cấm), internet di động có thể bị cắt. Đêm trước Nyepi có lễ rước hình nộm quỷ Ogoh-ogoh khổng lồ rồi đốt đi để xua tà. Nếu bạn là du khách ở Bali đúng dịp này, BẮT BUỘC ở trong khách sạn — kéo rèm, giữ im lặng.",
    cultural_notes_en:
      "Nyepi is the Balinese Hindu New Year, but celebrated uniquely: 24 hours of total silence. No going outside, no lights, no work, no entertainment; many fast. The whole island stops — the airport fully closes (the only day of the year flights are banned) and mobile internet may be cut. The night before features a parade of giant Ogoh-ogoh demon effigies that are then burned to drive out evil. Tourists in Bali must stay inside their hotel, curtains drawn, quiet.",
    tip_advice_vi:
      "Phát âm 'ny' = 'nh' tiếng Việt — đây là âm DỄ cho người Việt (Nyepi = 'Nhe-pi', nyaman = 'nha-man'). Tận dụng lợi thế này. Để ý tiền tố thụ động 'di-': ditutup (bị đóng), dimatikan (bị tắt) — giống cấu trúc 'bị/được' trong tiếng Việt.",
    tip_advice_en:
      "'ny' = the Vietnamese 'nh' sound — an EASY sound for Vietnamese speakers (Nyepi = 'nyeh-pee'). The passive 'di-' prefix (ditutup = 'is closed') maps neatly onto Vietnamese 'bị/được' passive constructions.",
    vocabulary: [
      { cell_id: "18ae95a8-489b-4d87-b92e-b5c839283001", word: "Nyepi", en: "Day of Silence", vi: "Ngày Tĩnh Lặng", pos: "proper noun", pronunciation_vi: "NYE-pi", pronunciation_en: "NYEH-pee" },
      { cell_id: "7b6a5c9b-c7df-4af5-b4f8-98727a10b05d", word: "umat", en: "religious community", vi: "tín đồ, cộng đồng", pos: "noun", pronunciation_vi: "U-mat", pronunciation_en: "OO-mat" },
      { cell_id: "74a6f357-98a3-41d0-b3ca-4591273829d3", word: "diam", en: "silent, still", vi: "im lặng, ở yên", pos: "adjective/verb", pronunciation_vi: "DI-am", pronunciation_en: "DEE-am" },
      { cell_id: "febb1e6e-fb79-46a8-935b-4cbb091b4d6d", word: "bandara", en: "airport", vi: "sân bay", pos: "noun", pronunciation_vi: "ban-DA-ra", pronunciation_en: "ban-DAH-rah" },
      { cell_id: "bb12799b-a49d-4a9d-b98f-09d3edad3ffa", word: "Ogoh-ogoh", en: "giant demon effigy", vi: "hình nộm quỷ khổng lồ", pos: "noun", pronunciation_vi: "O-goh O-goh", pronunciation_en: "OH-goh OH-goh" },
      { cell_id: "a399a20a-8494-47ff-b083-bb055a5b0bbd", word: "merenung", en: "to reflect, contemplate", vi: "suy ngẫm", pos: "verb", pronunciation_vi: "me-re-NUNG", pronunciation_en: "muh-ruh-NOONG" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền tiền tố thụ động 'di-':",
        instruction_en: "Fill in the passive 'di-' prefix form:",
        items: [
          { prompt: "Bandara ___tutup. (bị đóng)", answer: "di", options: ["di", "me", "ber"] },
          { prompt: "Lampu ___matikan. (bị tắt)", answer: "di", options: ["di", "me", "ke"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. Batik — the heritage textile
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_culture_batik",
    level: "A2",
    category: "culture",
    title_vi: "Batik — vải truyền thống di sản thế giới",
    title_en: "Batik — the UNESCO heritage textile",
    sentences: [
      {
        en: "Batik adalah kain tradisional yang dibuat dengan lilin.",
        vi: "Batik là loại vải truyền thống được làm bằng sáp.",
        pronunciation_focus: [
          "batik → BA-tik = vải hoa văn truyền thống",
          "kain → KA-in = vải (hai âm tiết: ka-in)",
          "dibuat → di-BU-at = được làm (thụ động di-)",
          "lilin → LI-lin = sáp, nến",
        ],
        pronunciation_focus_en: [
          "batik → 'BAH-tik' = patterned heritage cloth",
          "kain → 'KAH-in' = cloth (two syllables: ka-in)",
          "dibuat → 'dee-BOO-at' = is made (passive di-)",
          "lilin → 'LEE-lin' = wax, candle",
        ],
      },
      {
        en: "Orang memakai batik untuk acara resmi dan pernikahan.",
        vi: "Người ta mặc batik trong dịp trang trọng và đám cưới.",
        pronunciation_focus: [
          "memakai → me-ma-KAI = mặc, dùng (meN- + pakai)",
          "acara → a-CA-ra = sự kiện; 'c' đọc 'ch' → 'a-cha-ra'",
          "resmi → RES-mi = chính thức, trang trọng",
          "pernikahan → per-ni-KA-han = đám cưới",
        ],
        pronunciation_focus_en: [
          "memakai → 'muh-mah-KAI' = to wear/use (meN- + pakai)",
          "acara → 'ah-CHAH-rah' = event; the 'c' is 'ch'",
          "resmi → 'RES-mee' = official, formal",
          "pernikahan → 'per-nee-KAH-han' = wedding",
        ],
      },
      {
        en: "Setiap motif batik punya makna dan asal daerah.",
        vi: "Mỗi hoa văn batik có ý nghĩa và nguồn gốc vùng miền riêng.",
        pronunciation_focus: [
          "motif → mo-TIF = họa tiết, hoa văn",
          "punya → PU-nya = có ('ny' = 'nh')",
          "makna → MAK-na = ý nghĩa",
          "daerah → da-E-rah = vùng, địa phương (ba âm tiết: da-e-rah)",
        ],
        pronunciation_focus_en: [
          "motif → 'moh-TIF' = motif/pattern",
          "punya → 'POO-nyah' = to have ('ny' = ñ)",
          "makna → 'MAHK-nah' = meaning",
          "daerah → 'dah-EH-rah' = region (three syllables: da-e-rah)",
        ],
      },
    ],
    cultural_notes_vi:
      "Batik là kỹ thuật nhuộm vải bằng sáp ong, được UNESCO công nhận là Di sản Văn hóa Phi vật thể của nhân loại (2009). Mỗi vùng có motif riêng: Yogyakarta và Solo nổi tiếng nhất. Có 'Hari Batik Nasional' (Ngày Batik Quốc gia, 2/10) khi mọi người mặc batik đi làm. Áo batik dài tay được coi là trang phục lịch sự ngang vest — đi đám cưới, họp công ty, gặp quan chức đều mặc được. Nếu được tặng một chiếc áo batik, đó là món quà rất trân trọng. Đừng nhầm batik thật (vẽ tay/in sáp) với batik in công nghiệp giá rẻ.",
    cultural_notes_en:
      "Batik is a wax-resist dyeing technique, recognised by UNESCO as Intangible Cultural Heritage (2009). Each region has its own motifs; Yogyakarta and Solo are the most famous. National Batik Day (2 October) sees everyone wear batik to work. A long-sleeved batik shirt counts as formal wear on par with a suit — fine for weddings, corporate meetings, and meeting officials. Receiving a batik shirt as a gift is an honour. Don't confuse hand-drawn/stamped batik with cheap printed imitations.",
    tip_advice_vi:
      "Lưu ý nguyên âm đôi: 'kain' (ka-in), 'daerah' (da-e-rah), 'pakai' (pa-kai) đọc TÁCH từng nguyên âm — người Việt hay nuốt thành một âm. Nhắc lại quy tắc 'c' = 'ch': acara = 'a-cha-ra', bukan 'a-ka-ra'.",
    tip_advice_en:
      "Watch vowel sequences: 'kain', 'daerah', 'pakai' keep each vowel distinct — Vietnamese speakers tend to collapse them. And again: 'c' = 'ch' (acara = 'ah-CHAH-rah').",
    vocabulary: [
      { cell_id: "fd7e1587-d04b-4061-b373-ea0273e553bb", word: "batik", en: "wax-resist patterned cloth", vi: "vải hoa văn truyền thống", pos: "noun", pronunciation_vi: "BA-tik", pronunciation_en: "BAH-tik" },
      { cell_id: "b1152900-65db-46a4-bc32-7eeb468d942a", word: "kain", en: "cloth, fabric", vi: "vải", pos: "noun", pronunciation_vi: "KA-in", pronunciation_en: "KAH-in" },
      { cell_id: "bda209e6-9130-494f-a78f-298487dfe370", word: "motif", en: "motif, pattern", vi: "họa tiết", pos: "noun", pronunciation_vi: "mo-TIF", pronunciation_en: "moh-TIF" },
      { cell_id: "6b0bcc64-81a0-450e-aec6-df4e3a8213c7", word: "memakai", en: "to wear, to use", vi: "mặc, dùng", pos: "verb", pronunciation_vi: "me-ma-KAI", pronunciation_en: "muh-mah-KAI" },
      { cell_id: "937d0401-c65e-4248-9595-17103b55a9db", word: "resmi", en: "official, formal", vi: "chính thức, trang trọng", pos: "adjective", pronunciation_vi: "RES-mi", pronunciation_en: "RES-mee" },
      { cell_id: "691ee2c2-8aec-4274-8492-b12bb6aa6a80", word: "daerah", en: "region, area", vi: "vùng, địa phương", pos: "noun", pronunciation_vi: "da-E-rah", pronunciation_en: "dah-EH-rah" },
    ],
    dialogue: [
      { cell_id: "f04159f4-494f-491f-9ed5-ac83278e5d00", speaker: "Penjual", text: "Ini batik tulis asli dari Solo. Bukan cetak.", vi: "Đây là batik vẽ tay thật từ Solo. Không phải in.", en: "This is genuine hand-drawn batik from Solo. Not printed." },
      { cell_id: "aa0bbdf2-b616-48c5-a397-0b07f746b156", speaker: "Anh", text: "Bagus sekali. Motifnya punya makna apa?", vi: "Đẹp quá. Hoa văn này có ý nghĩa gì?", en: "Beautiful. What does the motif mean?" },
      { cell_id: "4c95e46d-c320-49da-ba61-174f8ca74430", speaker: "Penjual", text: "Motif parang artinya keberanian dan kekuatan.", vi: "Hoa văn parang nghĩa là sự dũng cảm và sức mạnh.", en: "The parang motif means courage and strength." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Người ta mặc batik trong dịp trang trọng.", answer: "Orang memakai batik untuk acara resmi." },
          { prompt: "Mỗi hoa văn có ý nghĩa riêng.", answer: "Setiap motif punya makna." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 6. Gamelan — the bronze orchestra
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_culture_gamelan",
    level: "B1",
    category: "culture",
    title_vi: "Gamelan — dàn nhạc đồng truyền thống",
    title_en: "Gamelan — the bronze gong orchestra",
    sentences: [
      {
        en: "Gamelan adalah ansambel musik dari Jawa dan Bali.",
        vi: "Gamelan là dàn nhạc hợp tấu từ Java và Bali.",
        pronunciation_focus: [
          "gamelan → GA-me-lan = dàn nhạc cồng chiêng đồng",
          "ansambel → an-SAM-bel = dàn nhạc hợp tấu",
          "Jawa → JA-wa = đảo Java; 'J' đọc như 'j' tiếng Anh (jam)",
          "musik → MU-sik = âm nhạc",
        ],
        pronunciation_focus_en: [
          "gamelan → 'GAH-muh-lan' = bronze percussion orchestra",
          "ansambel → 'an-SAM-bel' = ensemble",
          "Jawa → 'JAH-wah' = Java; 'J' as in English 'jam'",
          "musik → 'MOO-sik' = music",
        ],
      },
      {
        en: "Alat musiknya terbuat dari logam seperti gong dan kendang.",
        vi: "Nhạc cụ được làm từ kim loại như cồng và trống.",
        pronunciation_focus: [
          "alat → A-lat = công cụ, dụng cụ",
          "terbuat → ter-BU-at = được làm từ (tiền tố ter-)",
          "logam → LO-gam = kim loại",
          "kendang → ken-DANG = trống tay hai mặt",
        ],
        pronunciation_focus_en: [
          "alat → 'AH-lat' = tool/instrument",
          "terbuat → 'ter-BOO-at' = made of (ter- prefix)",
          "logam → 'LOH-gam' = metal",
          "kendang → 'ken-DANG' = double-headed hand drum",
        ],
      },
      {
        en: "Musik gamelan sering mengiringi pertunjukan wayang kulit.",
        vi: "Nhạc gamelan thường đệm cho rối bóng wayang kulit.",
        pronunciation_focus: [
          "sering → SE-ring = thường, hay",
          "mengiringi → me-ngi-RING-i = đệm nhạc, hộ tống (meN- + iring + -i)",
          "pertunjukan → per-tun-JU-kan = buổi biểu diễn",
          "wayang kulit → WA-yang KU-lit = múa rối bóng bằng da",
        ],
        pronunciation_focus_en: [
          "sering → 'SUH-ring' = often",
          "mengiringi → 'muh-ngee-RING-ee' = to accompany (meN- + iring + -i)",
          "pertunjukan → 'per-toon-JOO-kan' = performance/show",
          "wayang kulit → 'WAH-yang KOO-lit' = leather shadow-puppet theatre",
        ],
      },
    ],
    cultural_notes_vi:
      "Gamelan là dàn nhạc gồm cồng, chiêng, đàn metallophone, trống kendang — chủ yếu bằng đồng, mỗi bộ được chế tác và lên dây riêng nên không bộ nào giống bộ nào. Âm nhạc gamelan dùng thang âm slendro và pelog, nghe rất khác nhạc phương Tây. Nó đệm cho múa cung đình, lễ tôn giáo, và đặc biệt là wayang kulit (rối bóng) — kể sử thi Ramayana/Mahabharata suốt đêm. UNESCO công nhận gamelan là Di sản năm 2021. Triết lý gamelan phản ánh gotong royong: không nhạc công nào nổi bật, tất cả hòa quyện thành một thể — rất khác tinh thần solo của nhạc phương Tây.",
    cultural_notes_en:
      "Gamelan is an orchestra of gongs, metallophones, and kendang drums — mostly bronze, each set individually forged and tuned so no two are alike. It uses the slendro and pelog scales, sounding very different from Western music. It accompanies court dance, religious rites, and especially wayang kulit (shadow puppetry) telling the Ramayana and Mahabharata through the night. UNESCO listed gamelan as heritage in 2021. Its philosophy mirrors gotong royong: no player stands out — all blend into one whole, unlike the soloist focus of Western music.",
    tip_advice_vi:
      "Lưu ý chữ 'J' tiếng Indonesia đọc như 'j' tiếng Anh ('jam'), KHÔNG đọc 'gi' hay 'z': Jawa = 'Ja-wa', jam = 'jam'. Tiền tố động từ phức tạp ở đây (mengiringi, pertunjukan) — học cách bóc lớp: meN- + gốc + hậu tố. Xem file lessons-a2.ts về hệ thống tiền tố.",
    tip_advice_en:
      "The Indonesian 'J' is the English 'j' ('jam'), never 'y' or 'z': Jawa = 'JAH-wah'. The affixed verbs here (mengiringi, pertunjukan) are best peeled apart: meN- + root + suffix — see the prefix system in lessons-a2.ts.",
    vocabulary: [
      { cell_id: "5af121a7-8eb7-4220-96d4-1e0727b1f636", word: "gamelan", en: "bronze gong orchestra", vi: "dàn nhạc đồng", pos: "noun", pronunciation_vi: "GA-me-lan", pronunciation_en: "GAH-muh-lan" },
      { cell_id: "f7a99d7a-6645-461e-ac9f-c718e59019f5", word: "gong", en: "gong", vi: "cồng, chiêng", pos: "noun", pronunciation_vi: "GONG", pronunciation_en: "GONG" },
      { cell_id: "49719a3b-8d3c-462f-a071-4bcecd71fdf5", word: "kendang", en: "two-headed hand drum", vi: "trống tay", pos: "noun", pronunciation_vi: "ken-DANG", pronunciation_en: "ken-DANG" },
      { cell_id: "5b5a3982-d373-4fb0-abc9-5a1ea427b1a8", word: "wayang kulit", en: "shadow-puppet theatre", vi: "múa rối bóng", pos: "noun", pronunciation_vi: "WA-yang KU-lit", pronunciation_en: "WAH-yang KOO-lit" },
      { cell_id: "17a62520-aee2-441f-a60f-1669b07e6486", word: "pertunjukan", en: "performance", vi: "buổi biểu diễn", pos: "noun", pronunciation_vi: "per-tun-JU-kan", pronunciation_en: "per-toon-JOO-kan" },
      { cell_id: "e57076cf-28d2-4b57-a1bf-420db02dfda0", word: "logam", en: "metal", vi: "kim loại", pos: "noun", pronunciation_vi: "LO-gam", pronunciation_en: "LOH-gam" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "gamelan", answer: "dàn nhạc đồng" },
          { prompt: "wayang kulit", answer: "múa rối bóng" },
          { prompt: "kendang", answer: "trống tay" },
          { prompt: "pertunjukan", answer: "buổi biểu diễn" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 7. Everyday etiquette — saving face, right hand, removing shoes
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_culture_etiquette",
    level: "A2",
    category: "culture",
    title_vi: "Phép lịch sự hàng ngày — giữ thể diện, tay phải, cởi giày",
    title_en: "Everyday etiquette — face, the right hand, shoes off",
    sentences: [
      {
        en: "Berikan dan terima sesuatu dengan tangan kanan.",
        vi: "Đưa và nhận đồ bằng tay phải.",
        pronunciation_focus: [
          "berikan → be-RI-kan = hãy đưa (beri + -kan)",
          "terima → te-RI-ma = nhận",
          "tangan → TA-ngan = bàn tay; 'ng' giữa từ",
          "kanan → KA-nan = bên phải",
        ],
        pronunciation_focus_en: [
          "berikan → 'buh-REE-kan' = give (beri + -kan)",
          "terima → 'tuh-REE-mah' = receive",
          "tangan → 'TAH-ngan' = hand; medial 'ng'",
          "kanan → 'KAH-nan' = right (side)",
        ],
      },
      {
        en: "Lepas sepatu sebelum masuk rumah.",
        vi: "Cởi giày trước khi vào nhà.",
        pronunciation_focus: [
          "lepas → le-PAS = cởi, tháo ra",
          "sepatu → se-PA-tu = giày",
          "sebelum → se-be-LUM = trước khi",
          "masuk → MA-suk = vào",
        ],
        pronunciation_focus_en: [
          "lepas → 'luh-PAS' = take off/remove",
          "sepatu → 'suh-PAH-too' = shoes",
          "sebelum → 'suh-buh-LOOM' = before",
          "masuk → 'MAH-sook' = to enter",
        ],
      },
      {
        en: "Jangan menunjuk orang dengan jari telunjuk.",
        vi: "Đừng chỉ vào người khác bằng ngón trỏ.",
        pronunciation_focus: [
          "jangan → JA-ngan = đừng (mệnh lệnh phủ định)",
          "menunjuk → me-nun-JUK = chỉ vào",
          "jari → JA-ri = ngón tay",
          "telunjuk → te-lun-JUK = ngón trỏ",
        ],
        pronunciation_focus_en: [
          "jangan → 'JAH-ngan' = don't (negative command)",
          "menunjuk → 'muh-noon-JOOK' = to point at",
          "jari → 'JAH-ree' = finger",
          "telunjuk → 'tuh-loon-JOOK' = index finger",
        ],
      },
    ],
    cultural_notes_vi:
      "Một vài quy tắc khiến bạn được tôn trọng ngay ở Indonesia: (1) Luôn đưa/nhận đồ và bắt tay bằng TAY PHẢI — tay trái bị coi là không sạch. (2) Cởi giày trước khi vào nhà và nhà thờ Hồi giáo. (3) Đừng chỉ tay vào người bằng ngón trỏ; dùng ngón cái hoặc cả bàn tay. (4) Đừng xoa đầu người khác kể cả trẻ con — đầu được coi là linh thiêng. (5) Quan trọng nhất là 'menjaga muka' (giữ thể diện): tránh làm ai xấu hổ nơi đông người, không lớn tiếng, không nổi giận công khai. Người Việt rất quen khái niệm 'giữ thể diện' nên dễ thích nghi. Tránh chỉ chân vào người hay đồ vật.",
    cultural_notes_en:
      "A few rules win instant respect in Indonesia: (1) Always give/receive things and shake hands with the RIGHT hand — the left is considered unclean. (2) Remove shoes before entering homes and mosques. (3) Don't point at people with the index finger; use the thumb or open hand. (4) Don't touch anyone's head, even a child's — the head is sacred. (5) Above all, 'menjaga muka' (saving face): never embarrass someone publicly, don't raise your voice, don't show open anger. Vietnamese learners know 'face' well and adapt fast. Avoid pointing your feet at people or objects.",
    tip_advice_vi:
      "Cụm mệnh lệnh quan trọng: 'jangan' + động từ = 'đừng...'. Jangan menunjuk (đừng chỉ), jangan marah (đừng giận). Ghép 'tolong' (làm ơn) trước câu để lịch sự hơn. Phát âm 'ng' giữa từ (tangan, jangan) dễ với người Việt vì tiếng Việt có 'ng' — nhưng 'ng' ĐẦU từ (xem pronunciation-guide.ts) mới khó.",
    tip_advice_en:
      "Key command frame: 'jangan' + verb = 'don't...'. Jangan menunjuk (don't point), jangan marah (don't get angry). Prefix 'tolong' (please) for politeness. Medial 'ng' (tangan, jangan) is easy for Vietnamese speakers; word-INITIAL 'ng' is the hard one — see pronunciation-guide.ts.",
    vocabulary: [
      { cell_id: "5c539fc8-eddb-4a75-b732-3923ae324fe3", word: "tangan kanan", en: "right hand", vi: "tay phải", pos: "noun phrase", pronunciation_vi: "TA-ngan KA-nan", pronunciation_en: "TAH-ngan KAH-nan" },
      { cell_id: "88063ced-b5ab-437a-acbe-b9bcf849494a", word: "sepatu", en: "shoes", vi: "giày", pos: "noun", pronunciation_vi: "se-PA-tu", pronunciation_en: "suh-PAH-too" },
      { cell_id: "5266ae40-d3d6-4785-867d-087ddc9c12ad", word: "lepas", en: "to take off, remove", vi: "cởi, tháo", pos: "verb", pronunciation_vi: "le-PAS", pronunciation_en: "luh-PAS" },
      { cell_id: "36b114a8-8081-4a95-b3e0-8ad5d53d53f7", word: "jangan", en: "don't (command)", vi: "đừng", pos: "particle", pronunciation_vi: "JA-ngan", pronunciation_en: "JAH-ngan" },
      { cell_id: "b2476b3d-8b1d-4a31-aa64-a1dce67bc3ee", word: "menjaga muka", en: "to save face", vi: "giữ thể diện", pos: "verb phrase", pronunciation_vi: "men-JA-ga MU-ka", pronunciation_en: "men-JAH-gah MOO-kah" },
      { cell_id: "77f7c4b6-bcd6-422a-ac98-7ef881b5eb8a", word: "sopan", en: "polite, well-mannered", vi: "lịch sự", pos: "adjective", pronunciation_vi: "SO-pan", pronunciation_en: "SOH-pan" },
    ],
    dialogue: [
      { cell_id: "24d8d647-d03b-4e1b-a538-2f221df77d9d", speaker: "Tuan rumah", text: "Silakan masuk! Tapi lepas sepatu dulu ya.", vi: "Mời vào! Nhưng cởi giày trước nhé.", en: "Please come in! But take off your shoes first." },
      { cell_id: "e5afc963-806d-4aee-8b3e-88cc23baf741", speaker: "Tamu", text: "Tentu. Ini oleh-oleh untuk Anda.", vi: "Tất nhiên. Đây là quà cho anh/chị.", en: "Of course. Here's a small gift for you." },
      { cell_id: "12344ecd-8658-4f55-b0fe-6871e6a636de", speaker: "Tuan rumah", text: "Terima kasih banyak! (menerima dengan tangan kanan)", vi: "Cảm ơn nhiều! (nhận bằng tay phải)", en: "Thank you so much! (receiving with the right hand)" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'jangan' hoặc 'tolong':",
        instruction_en: "Fill in 'jangan' (don't) or 'tolong' (please):",
        items: [
          { prompt: "___ menunjuk dengan jari. (đừng)", answer: "jangan", options: ["jangan", "tolong"] },
          { prompt: "___ lepas sepatu. (làm ơn)", answer: "tolong", options: ["jangan", "tolong"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Cởi giày trước khi vào nhà.", answer: "Lepas sepatu sebelum masuk rumah." },
          { prompt: "Đưa bằng tay phải.", answer: "Berikan dengan tangan kanan." },
        ],
      },
    ],
  },
];

export default lessons;
