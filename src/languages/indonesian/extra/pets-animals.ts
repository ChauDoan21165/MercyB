// src/languages/indonesian/extra/pets-animals.ts
//
// Indonesian pets & animals pack for Vietnamese learners.
// Covers: keeping a pet at home (kucing, anjing, hewan peliharaan, feeding and
// care), the vet clinic (dokter hewan, vaksin, sterilisasi, sakit), and the pet
// shop / adoption (toko hewan, adopsi, kandang, makanan). Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts so the
// page UI stays consistent across language verticals. The types are defined
// inline because the Indonesian pack has no sibling lessons.ts registry yet
// (A7 owns it) — this file is self-contained on purpose. Types are NOT exported
// and the lesson array uses a unique name so a future barrel `export *` cannot
// collide with the sibling extra packs.
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

export const petsAnimalsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_pets_at_home",
    level: "A1",
    category: "pets_animals",
    title_vi: "Thú cưng trong nhà — mèo, chó và chăm sóc",
    title_en: "Pets at home — cats, dogs and care",
    sentences: [
      {
        en: "Saya punya seekor kucing dan seekor anjing.",
        vi: "Tôi có một con mèo và một con chó.",
        pronunciation_focus: [
          "punya → PU-nya, 'có/sở hữu'",
          "seekor → 'một con' — loại từ cho động vật (se- + ekor = đuôi)",
          "kucing → KU-ching, 'mèo'; anjing → AN-jing, 'chó'",
        ],
        pronunciation_focus_en: [
          "punya → 'POO-nya' — to have/own",
          "seekor → 'one (animal)' — the animal classifier (se- + ekor = tail)",
          "kucing → 'KOO-ching' — cat; anjing → 'AN-jing' — dog",
        ],
      },
      {
        en: "Kucing saya suka tidur sepanjang hari.",
        vi: "Con mèo của tôi thích ngủ cả ngày.",
        pronunciation_focus: [
          "kucing saya → 'mèo của tôi' — sở hữu đặt SAU danh từ",
          "suka → SU-ka, 'thích'",
          "sepanjang hari → 'suốt cả ngày'",
        ],
        pronunciation_focus_en: [
          "kucing saya → 'my cat' — possessor follows the noun",
          "suka → 'SOO-ka' — to like",
          "sepanjang hari → 'all day long'",
        ],
      },
      {
        en: "Setiap pagi saya memberi makan hewan peliharaan saya.",
        vi: "Mỗi sáng tôi cho thú cưng của tôi ăn.",
        pronunciation_focus: [
          "memberi makan → 'cho ăn' (memberi = cho + makan = ăn)",
          "hewan peliharaan → 'thú cưng' (hewan = động vật, peliharaan = vật nuôi)",
          "setiap pagi → 'mỗi sáng'",
        ],
        pronunciation_focus_en: [
          "memberi makan → 'to feed' (memberi = give + makan = eat)",
          "hewan peliharaan → 'pet' (hewan = animal, peliharaan = kept thing)",
          "setiap pagi → 'every morning'",
        ],
      },
      {
        en: "Jangan lupa memberi air minum yang bersih.",
        vi: "Đừng quên cho nước uống sạch.",
        pronunciation_focus: [
          "jangan lupa → 'đừng quên' (jangan = đừng, lupa = quên)",
          "air minum → 'nước uống'",
          "yang bersih → 'mà sạch/sạch sẽ' — yang nối tính từ vào danh từ",
        ],
        pronunciation_focus_en: [
          "jangan lupa → 'don't forget' (jangan = don't, lupa = forget)",
          "air minum → 'drinking water'",
          "yang bersih → 'that is clean' — 'yang' links the adjective to the noun",
        ],
      },
      {
        en: "Anjing itu sangat jinak dan ramah.",
        vi: "Con chó đó rất hiền và thân thiện.",
        pronunciation_focus: [
          "anjing itu → 'con chó đó' (itu = đó/kia, đặt sau danh từ)",
          "jinak → JI-nak, 'hiền/thuần'",
          "ramah → RA-mah, 'thân thiện'",
        ],
        pronunciation_focus_en: [
          "anjing itu → 'that dog' (itu = that, placed after the noun)",
          "jinak → 'JEE-nak' — tame / gentle",
          "ramah → 'RA-mah' — friendly",
        ],
      },
    ],
    cultural_notes_vi:
      "'Hewan peliharaan' (thú cưng) phổ biến ở Indonesia gồm 'kucing' (mèo) và 'ikan' (cá); chó được nuôi nhiều nhưng cần tế nhị vì phần lớn dân theo đạo Hồi coi chó là 'najis' (ô uế theo nghi lễ) — không phải ghét chó, mà tránh chạm khi ướt. Mèo ngược lại rất được yêu (Nhà tiên tri Muhammad yêu mèo). Khi vào nhà người Hồi giáo, nên hỏi trước nếu mang chó theo. Đếm động vật dùng loại từ 'ekor': 'dua ekor kucing' (hai con mèo).",
    cultural_notes_en:
      "Common 'hewan peliharaan' (pets) in Indonesia include 'kucing' (cats) and 'ikan' (fish); dogs are kept too but call for tact, as most of the Muslim-majority population regards dogs as 'najis' (ritually impure) — not hatred, but avoiding contact when the dog is wet. Cats, by contrast, are much loved (the Prophet Muhammad loved cats). When visiting a Muslim home, ask first if bringing a dog. Count animals with the classifier 'ekor': 'dua ekor kucing' (two cats).",
    tip_advice_vi:
      "Mẹo cho người Việt: động vật dùng loại từ riêng 'ekor' (nghĩa gốc là 'đuôi') — 'seekor anjing' (một con chó), 'tiga ekor ayam' (ba con gà). Giống loại từ 'con' của tiếng Việt nên dễ quen. Từ nối 'yang' = 'mà/cái mà', gắn tính từ vào danh từ: 'air yang bersih' (nước mà sạch). 'Memberi makan' (cho ăn) là cụm cố định — đừng tách rời.",
    tip_advice_en:
      "Tip for Vietnamese speakers: animals take their own classifier 'ekor' (literally 'tail') — 'seekor anjing' (one dog), 'tiga ekor ayam' (three chickens). It mirrors Vietnamese 'con', so it feels familiar. The linker 'yang' = 'that/which' attaches an adjective to a noun: 'air yang bersih' (water that is clean). 'Memberi makan' (to feed) is a fixed phrase — keep it together.",
    vocabulary: [
      {
        word: "kucing",
        en: "cat",
        vi: "mèo",
        pos: "noun",
        pronunciation_vi: "KU-ching",
        pronunciation_en: "KOO-ching",
      },
      {
        word: "anjing",
        en: "dog",
        vi: "chó",
        pos: "noun",
        pronunciation_vi: "AN-jing",
        pronunciation_en: "AN-jing",
      },
      {
        word: "hewan peliharaan",
        en: "pet",
        vi: "thú cưng",
        pos: "noun",
        pronunciation_vi: "HE-wan peu-li-ha-RA-an",
        pronunciation_en: "HEH-wan pe-lee-ha-RA-an",
      },
      {
        word: "ekor",
        en: "tail (animal classifier)",
        vi: "đuôi / con (loại từ động vật)",
        pos: "noun / classifier",
        pronunciation_vi: "É-kor",
        pronunciation_en: "EH-kor",
      },
      {
        word: "memberi makan",
        en: "to feed",
        vi: "cho ăn",
        pos: "verb phrase",
        pronunciation_vi: "mem-BE-ri MA-kan",
        pronunciation_en: "mem-BEH-ree MA-kan",
      },
      {
        word: "jinak",
        en: "tame / gentle",
        vi: "hiền / thuần",
        pos: "adjective",
        pronunciation_vi: "JI-nak",
        pronunciation_en: "JEE-nak",
      },
      {
        word: "ramah",
        en: "friendly",
        vi: "thân thiện",
        pos: "adjective",
        pronunciation_vi: "RA-mah",
        pronunciation_en: "RA-mah",
      },
      {
        word: "ikan",
        en: "fish",
        vi: "cá",
        pos: "noun",
        pronunciation_vi: "I-kan",
        pronunciation_en: "EE-kan",
      },
      {
        word: "burung",
        en: "bird",
        vi: "chim",
        pos: "noun",
        pronunciation_vi: "BU-rung",
        pronunciation_en: "BOO-roong",
      },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Kamu punya hewan peliharaan di rumah?",
        vi: "Bạn có thú cưng ở nhà không?",
        en: "Do you have a pet at home?",
      },
      {
        speaker: "Tono",
        text: "Iya, saya punya seekor kucing. Namanya Mimi.",
        vi: "Có, tôi có một con mèo. Tên nó là Mimi.",
        en: "Yes, I have a cat. Her name is Mimi.",
      },
      {
        speaker: "Rina",
        text: "Lucu! Kucingnya jinak?",
        vi: "Dễ thương quá! Con mèo có hiền không?",
        en: "Cute! Is the cat tame?",
      },
      {
        speaker: "Tono",
        text: "Sangat jinak. Setiap pagi saya memberi makan dia.",
        vi: "Rất hiền. Mỗi sáng tôi cho nó ăn.",
        en: "Very tame. Every morning I feed her.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về thú cưng còn thiếu:",
        instruction_en: "Fill in the missing pet word:",
        items: [
          {
            prompt: "Saya punya seekor ___. (mèo)",
            answer: "kucing",
            options: ["kucing", "kursi", "kunci"],
          },
          {
            prompt: "Setiap pagi saya ___ hewan saya. (cho ăn)",
            answer: "memberi makan",
            options: ["memberi makan", "membeli", "membaca"],
          },
          {
            prompt: "Anjing itu sangat ___ dan ramah. (hiền)",
            answer: "jinak",
            options: ["jinak", "jauh", "jelek"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối tên con vật với nghĩa tiếng Việt:",
        instruction_en: "Match each animal with its Vietnamese meaning:",
        items: [
          { prompt: "kucing", answer: "mèo" },
          { prompt: "anjing", answer: "chó" },
          { prompt: "ikan", answer: "cá" },
          { prompt: "burung", answer: "chim" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi có một con mèo và một con chó.", answer: "Saya punya seekor kucing dan seekor anjing." },
          { prompt: "Con mèo của tôi thích ngủ cả ngày.", answer: "Kucing saya suka tidur sepanjang hari." },
          { prompt: "Đừng quên cho nước uống sạch.", answer: "Jangan lupa memberi air minum yang bersih." },
        ],
      },
    ],
  },
  {
    id: "indonesian_vet_clinic",
    level: "A2",
    category: "pets_animals",
    title_vi: "Phòng khám thú y — dokter hewan, vắc-xin và bệnh",
    title_en: "The vet clinic — vet, vaccines and illness",
    sentences: [
      {
        en: "Saya mau membawa kucing saya ke dokter hewan.",
        vi: "Tôi muốn mang con mèo của tôi đến bác sĩ thú y.",
        pronunciation_focus: [
          "membawa → mem-BA-wa, 'mang/đưa đi' (gốc bawa)",
          "dokter hewan → 'bác sĩ thú y' (hewan = động vật)",
          "ke → 'đến/tới' (hướng), khác di (ở)",
        ],
        pronunciation_focus_en: [
          "membawa → 'mem-BA-wa' — to bring/take (root 'bawa')",
          "dokter hewan → 'veterinarian' (hewan = animal)",
          "ke → 'to' (direction), unlike 'di' (static 'at')",
        ],
      },
      {
        en: "Anjing saya tidak mau makan sejak kemarin.",
        vi: "Con chó của tôi không chịu ăn từ hôm qua.",
        pronunciation_focus: [
          "tidak mau makan → 'không chịu ăn' (mau = muốn)",
          "sejak → SE-jak, 'từ (mốc thời gian)'",
          "kemarin → keu-MA-rin, 'hôm qua'",
        ],
        pronunciation_focus_en: [
          "tidak mau makan → 'won't eat' (mau = want)",
          "sejak → 'SE-jak' — since (a point in time)",
          "kemarin → 'ke-MA-rin' — yesterday",
        ],
      },
      {
        en: "Kucing ini perlu vaksin rabies tahun ini.",
        vi: "Con mèo này cần tiêm phòng dại năm nay.",
        pronunciation_focus: [
          "vaksin → VAK-sin, 'vắc-xin/tiêm phòng'",
          "rabies → RA-bi-és, 'bệnh dại'",
          "tahun ini → 'năm nay'",
        ],
        pronunciation_focus_en: [
          "vaksin → 'VAK-sin' — vaccine",
          "rabies → 'RA-bee-es' — rabies",
          "tahun ini → 'this year'",
        ],
      },
      {
        en: "Apakah hewan saya perlu disuntik atau diberi obat?",
        vi: "Thú cưng của tôi cần tiêm hay uống thuốc?",
        pronunciation_focus: [
          "disuntik → 'được tiêm' — di- bị động + suntik",
          "diberi obat → 'được cho thuốc' — di- + beri + obat",
          "atau → A-tau, 'hay/hoặc'",
        ],
        pronunciation_focus_en: [
          "disuntik → 'to be injected' — passive 'di-' + 'suntik'",
          "diberi obat → 'to be given medicine' — 'di-' + beri + obat",
          "atau → 'A-tow' — or",
        ],
      },
      {
        en: "Berapa biaya pemeriksaan dan vaksinnya?",
        vi: "Phí khám và tiêm phòng là bao nhiêu?",
        pronunciation_focus: [
          "biaya → bi-A-ya, 'chi phí'",
          "pemeriksaan → 'việc khám/kiểm tra' (gốc periksa + pe-…-an)",
          "vaksinnya → 'tiền vắc-xin (đó)' (+ -nya)",
        ],
        pronunciation_focus_en: [
          "biaya → 'bee-A-ya' — cost",
          "pemeriksaan → 'examination' (root 'periksa' + 'pe-…-an')",
          "vaksinnya → 'the vaccine (cost)' (+ '-nya')",
        ],
      },
    ],
    cultural_notes_vi:
      "Phòng khám thú y ở thành phố lớn (Jakarta, Surabaya, Bandung) khá phát triển; bác sĩ thú y là 'dokter hewan' (viết tắt 'drh.'). Vắc-xin dại ('vaksin rabies') quan trọng vì bệnh dại còn lưu hành ở một số vùng — Bali từng có dịch lớn. Triệt sản ('sterilisasi') ngày càng phổ biến để kiểm soát số lượng. Dịch vụ và thuốc thường tính bằng tiền mặt; bảo hiểm thú cưng còn hiếm ở Indonesia.",
    cultural_notes_en:
      "Vet clinics in big cities (Jakarta, Surabaya, Bandung) are fairly developed; a vet is a 'dokter hewan' (abbreviated 'drh.'). The rabies vaccine ('vaksin rabies') matters because rabies still circulates in some regions — Bali had a major outbreak. Spaying/neutering ('sterilisasi') is increasingly common for population control. Services and meds are usually cash; pet insurance is still rare in Indonesia.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng 'atau' (hay/hoặc) để hỏi lựa chọn — 'disuntik atau diberi obat?' (tiêm hay uống thuốc?). Tiền tố bị động 'di-' rất hay gặp ở phòng khám: disuntik (được tiêm), diperiksa (được khám), divaksin (được tiêm phòng). Khung mang đi vạn năng: 'Saya mau membawa … ke dokter hewan' (Tôi muốn mang … đến thú y).",
    tip_advice_en:
      "Tip for Vietnamese speakers: use 'atau' (or) to offer a choice — 'disuntik atau diberi obat?' (injection or oral medicine?). The passive 'di-' prefix is everywhere at the clinic: disuntik (injected), diperiksa (examined), divaksin (vaccinated). Reusable take-to frame: 'Saya mau membawa … ke dokter hewan' (I want to take … to the vet).",
    vocabulary: [
      {
        word: "dokter hewan",
        en: "veterinarian",
        vi: "bác sĩ thú y",
        pos: "noun",
        pronunciation_vi: "DOK-ter HE-wan",
        pronunciation_en: "DOK-ter HEH-wan",
      },
      {
        word: "vaksin",
        en: "vaccine",
        vi: "vắc-xin",
        pos: "noun",
        pronunciation_vi: "VAK-sin",
        pronunciation_en: "VAK-sin",
      },
      {
        word: "rabies",
        en: "rabies",
        vi: "bệnh dại",
        pos: "noun",
        pronunciation_vi: "RA-bi-és",
        pronunciation_en: "RA-bee-es",
      },
      {
        word: "membawa",
        en: "to bring / take",
        vi: "mang / đưa đi",
        pos: "verb",
        pronunciation_vi: "mem-BA-wa",
        pronunciation_en: "mem-BA-wa",
      },
      {
        word: "sakit",
        en: "sick / it hurts",
        vi: "ốm / đau",
        pos: "adjective",
        pronunciation_vi: "SA-kit",
        pronunciation_en: "SA-kit",
      },
      {
        word: "sterilisasi",
        en: "spaying / neutering",
        vi: "triệt sản",
        pos: "noun",
        pronunciation_vi: "ste-ri-li-SA-si",
        pronunciation_en: "ste-ree-lee-SA-see",
      },
      {
        word: "pemeriksaan",
        en: "examination / check-up",
        vi: "việc khám",
        pos: "noun",
        pronunciation_vi: "peu-meu-rik-SA-an",
        pronunciation_en: "pe-me-rik-SA-an",
      },
      {
        word: "obat",
        en: "medicine",
        vi: "thuốc",
        pos: "noun",
        pronunciation_vi: "Ô-bat",
        pronunciation_en: "OH-bat",
      },
      {
        word: "sehat",
        en: "healthy",
        vi: "khỏe mạnh",
        pos: "adjective",
        pronunciation_vi: "SE-hat",
        pronunciation_en: "SEH-hat",
      },
    ],
    dialogue: [
      {
        speaker: "Pemilik",
        text: "Dok, anjing saya tidak mau makan sejak kemarin.",
        vi: "Bác sĩ ơi, con chó của tôi không chịu ăn từ hôm qua.",
        en: "Doctor, my dog won't eat since yesterday.",
      },
      {
        speaker: "Dokter hewan",
        text: "Baik, kita periksa dulu. Sudah pernah divaksin?",
        vi: "Được, mình khám trước. Đã từng tiêm phòng chưa?",
        en: "Alright, let's examine it first. Has it been vaccinated?",
      },
      {
        speaker: "Pemilik",
        text: "Belum tahun ini. Apakah perlu vaksin rabies?",
        vi: "Năm nay thì chưa. Có cần tiêm phòng dại không?",
        en: "Not this year. Does it need a rabies vaccine?",
      },
      {
        speaker: "Dokter hewan",
        text: "Perlu. Hari ini saya beri obat, lalu disuntik minggu depan.",
        vi: "Cần. Hôm nay tôi cho thuốc, rồi tuần sau tiêm.",
        en: "Yes. Today I'll give medicine, then vaccinate next week.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về thú y còn thiếu:",
        instruction_en: "Fill in the missing vet word:",
        items: [
          {
            prompt: "Saya mau ___ kucing saya ke dokter hewan. (mang/đưa)",
            answer: "membawa",
            options: ["membawa", "membaca", "membayar"],
          },
          {
            prompt: "Kucing ini perlu ___ rabies. (tiêm phòng)",
            answer: "vaksin",
            options: ["vaksin", "visa", "video"],
          },
          {
            prompt: "Apakah hewan saya perlu ___ atau diberi obat? (được tiêm)",
            answer: "disuntik",
            options: ["disuntik", "ditutup", "dijual"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "dokter hewan", answer: "bác sĩ thú y" },
          { prompt: "rabies", answer: "bệnh dại" },
          { prompt: "sterilisasi", answer: "triệt sản" },
          { prompt: "sehat", answer: "khỏe mạnh" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Con chó của tôi không chịu ăn từ hôm qua.", answer: "Anjing saya tidak mau makan sejak kemarin." },
          { prompt: "Con mèo này cần tiêm phòng dại năm nay.", answer: "Kucing ini perlu vaksin rabies tahun ini." },
          { prompt: "Phí khám là bao nhiêu?", answer: "Berapa biaya pemeriksaan?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_pet_shop_adoption",
    level: "B1",
    category: "pets_animals",
    title_vi: "Cửa hàng thú cưng và nhận nuôi",
    title_en: "The pet shop and adoption",
    sentences: [
      {
        en: "Saya mau membeli makanan kucing dan pasir di toko hewan.",
        vi: "Tôi muốn mua thức ăn cho mèo và cát ở cửa hàng thú cưng.",
        pronunciation_focus: [
          "membeli → mem-BE-li, 'mua' (gốc beli)",
          "makanan kucing → 'thức ăn cho mèo' (makan→makanan + kucing)",
          "toko hewan → 'cửa hàng thú cưng' (toko = cửa hàng)",
        ],
        pronunciation_focus_en: [
          "membeli → 'mem-BEH-lee' — to buy (root 'beli')",
          "makanan kucing → 'cat food' (makan→makanan + kucing)",
          "toko hewan → 'pet shop' (toko = shop)",
        ],
      },
      {
        en: "Daripada membeli, lebih baik mengadopsi hewan terlantar.",
        vi: "Thay vì mua, tốt hơn là nhận nuôi động vật bị bỏ rơi.",
        pronunciation_focus: [
          "daripada → da-ri-PA-da, 'thay vì/hơn là' (so sánh)",
          "lebih baik → 'tốt hơn' (lebih = hơn, baik = tốt)",
          "mengadopsi → 'nhận nuôi'; terlantar = bị bỏ rơi",
        ],
        pronunciation_focus_en: [
          "daripada → 'da-ree-PA-da' — rather than / than (comparison)",
          "lebih baik → 'better' (lebih = more, baik = good)",
          "mengadopsi → 'to adopt'; terlantar = abandoned/neglected",
        ],
      },
      {
        en: "Kandang ini terlalu kecil untuk anjing besar.",
        vi: "Chuồng này quá nhỏ cho con chó lớn.",
        pronunciation_focus: [
          "kandang → KAN-dang, 'chuồng/lồng'",
          "terlalu kecil → 'quá nhỏ' (terlalu = quá)",
          "untuk → UN-tuk, 'cho/để'",
        ],
        pronunciation_focus_en: [
          "kandang → 'KAN-dang' — cage/kennel",
          "terlalu kecil → 'too small' (terlalu = too)",
          "untuk → 'OON-took' — for",
        ],
      },
      {
        en: "Hewan peliharaan harus dirawat dengan kasih sayang.",
        vi: "Thú cưng phải được chăm sóc bằng tình yêu thương.",
        pronunciation_focus: [
          "dirawat → 'được chăm sóc' — di- bị động + rawat",
          "dengan → DENG-an, 'bằng/với'",
          "kasih sayang → 'tình yêu thương' (cặp từ cố định)",
        ],
        pronunciation_focus_en: [
          "dirawat → 'to be cared for' — passive 'di-' + 'rawat'",
          "dengan → 'DENG-an' — with",
          "kasih sayang → 'love and affection' (a fixed pair)",
        ],
      },
      {
        en: "Sebelum mengadopsi, pikirkan tanggung jawabnya baik-baik.",
        vi: "Trước khi nhận nuôi, hãy suy nghĩ kỹ về trách nhiệm.",
        pronunciation_focus: [
          "sebelum → seu-beu-LUM, 'trước khi'",
          "pikirkan → 'hãy nghĩ về' (gốc pikir + -kan)",
          "tanggung jawab → 'trách nhiệm'; baik-baik = kỹ càng (lặp từ)",
        ],
        pronunciation_focus_en: [
          "sebelum → 'se-be-LOOM' — before",
          "pikirkan → 'think about (it)' (root 'pikir' + '-kan')",
          "tanggung jawab → 'responsibility'; baik-baik = carefully (reduplication)",
        ],
      },
    ],
    cultural_notes_vi:
      "Cửa hàng thú cưng ('toko hewan' / 'pet shop') bán thức ăn, lồng ('kandang'), cát vệ sinh ('pasir kucing') và đôi khi cả thú nuôi. Phong trào nhận nuôi ('adopsi') động vật bị bỏ rơi ('hewan terlantar') ngày càng mạnh trên mạng xã hội — khẩu hiệu 'adopt, don't shop' (nhận nuôi, đừng mua) cũng phổ biến ở Indonesia. Nhiều cộng đồng cứu hộ ('komunitas penyelamat hewan') hoạt động ở Jakarta và Bali. Văn hoá đề cao 'kasih sayang' (tình yêu thương) với động vật.",
    cultural_notes_en:
      "A pet shop ('toko hewan' / 'pet shop') sells food, cages ('kandang'), litter ('pasir kucing'), and sometimes animals. The movement to adopt ('adopsi') abandoned animals ('hewan terlantar') is growing on social media — 'adopt, don't shop' resonates in Indonesia too. Many rescue communities ('komunitas penyelamat hewan') operate in Jakarta and Bali. The culture emphasizes 'kasih sayang' (love/affection) toward animals.",
    tip_advice_vi:
      "Mẹo cho người Việt: so sánh 'thay vì/hơn là' dùng 'daripada' — 'daripada membeli, lebih baik mengadopsi' (thay vì mua, tốt hơn nhận nuôi). 'lebih + tính từ' = 'hơn': lebih baik (tốt hơn), lebih besar (lớn hơn). Lặp từ 'baik-baik' = 'cẩn thận/kỹ càng' (không phải số nhiều) — chú ý lặp từ tiếng Indonesia có nhiều nghĩa, không chỉ số nhiều.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'rather than' uses 'daripada' — 'daripada membeli, lebih baik mengadopsi' (rather than buy, better to adopt). 'lebih + adjective' = comparative: lebih baik (better), lebih besar (bigger). Reduplicated 'baik-baik' means 'carefully' (not a plural) — note that Indonesian reduplication has several meanings, not only plurals.",
    vocabulary: [
      {
        word: "toko hewan",
        en: "pet shop",
        vi: "cửa hàng thú cưng",
        pos: "noun",
        pronunciation_vi: "TÔ-ko HE-wan",
        pronunciation_en: "TOH-ko HEH-wan",
      },
      {
        word: "makanan kucing",
        en: "cat food",
        vi: "thức ăn cho mèo",
        pos: "noun",
        pronunciation_vi: "ma-KA-nan KU-ching",
        pronunciation_en: "ma-KA-nan KOO-ching",
      },
      {
        word: "kandang",
        en: "cage / kennel",
        vi: "chuồng / lồng",
        pos: "noun",
        pronunciation_vi: "KAN-dang",
        pronunciation_en: "KAN-dang",
      },
      {
        word: "mengadopsi",
        en: "to adopt",
        vi: "nhận nuôi",
        pos: "verb",
        pronunciation_vi: "meng-a-DOP-si",
        pronunciation_en: "meng-a-DOP-see",
      },
      {
        word: "terlantar",
        en: "abandoned / neglected",
        vi: "bị bỏ rơi",
        pos: "adjective",
        pronunciation_vi: "ter-LAN-tar",
        pronunciation_en: "ter-LAN-tar",
      },
      {
        word: "kasih sayang",
        en: "love / affection",
        vi: "tình yêu thương",
        pos: "noun",
        pronunciation_vi: "KA-sih SA-yang",
        pronunciation_en: "KA-sih SA-yang",
      },
      {
        word: "tanggung jawab",
        en: "responsibility",
        vi: "trách nhiệm",
        pos: "noun",
        pronunciation_vi: "tang-GUNG JA-wab",
        pronunciation_en: "tang-GOONG JA-wab",
      },
      {
        word: "merawat",
        en: "to care for / look after",
        vi: "chăm sóc",
        pos: "verb",
        pronunciation_vi: "meu-RA-wat",
        pronunciation_en: "me-RA-wat",
      },
      {
        word: "pasir kucing",
        en: "cat litter",
        vi: "cát vệ sinh cho mèo",
        pos: "noun",
        pronunciation_vi: "PA-sir KU-ching",
        pronunciation_en: "PA-seer KOO-ching",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Mbak, saya cari makanan kucing dan pasir. Ada?",
        vi: "Chị ơi, tôi tìm thức ăn cho mèo và cát. Có không?",
        en: "Miss, I'm looking for cat food and litter. Do you have them?",
      },
      {
        speaker: "Penjual",
        text: "Ada, di rak sebelah sana. Mau adopsi kucing juga? Ada yang terlantar.",
        vi: "Có, ở kệ phía bên kia. Có muốn nhận nuôi mèo không? Có con bị bỏ rơi.",
        en: "Yes, on the shelf over there. Want to adopt a cat too? There's an abandoned one.",
      },
      {
        speaker: "Pembeli",
        text: "Boleh saya lihat? Tapi kandang saya kecil.",
        vi: "Tôi xem được không? Nhưng chuồng tôi nhỏ.",
        en: "May I see it? But my cage is small.",
      },
      {
        speaker: "Penjual",
        text: "Tidak apa-apa. Yang penting dirawat dengan kasih sayang.",
        vi: "Không sao. Quan trọng là được chăm sóc bằng tình yêu thương.",
        en: "That's fine. What matters is caring for it with love.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về cửa hàng / nhận nuôi còn thiếu:",
        instruction_en: "Fill in the missing pet-shop/adoption word:",
        items: [
          {
            prompt: "Saya mau ___ makanan kucing di toko hewan. (mua)",
            answer: "membeli",
            options: ["membeli", "membaca", "membawa"],
          },
          {
            prompt: "Daripada membeli, lebih baik ___ hewan terlantar. (nhận nuôi)",
            answer: "mengadopsi",
            options: ["mengadopsi", "mengantar", "mengakui"],
          },
          {
            prompt: "Hewan harus dirawat dengan ___. (tình yêu thương)",
            answer: "kasih sayang",
            options: ["kasih sayang", "kanan kiri", "kaki lima"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kandang", answer: "chuồng / lồng" },
          { prompt: "terlantar", answer: "bị bỏ rơi" },
          { prompt: "tanggung jawab", answer: "trách nhiệm" },
          { prompt: "merawat", answer: "chăm sóc" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Thay vì mua, tốt hơn là nhận nuôi.", answer: "Daripada membeli, lebih baik mengadopsi." },
          { prompt: "Chuồng này quá nhỏ cho con chó lớn.", answer: "Kandang ini terlalu kecil untuk anjing besar." },
          { prompt: "Thú cưng phải được chăm sóc bằng tình yêu thương.", answer: "Hewan peliharaan harus dirawat dengan kasih sayang." },
        ],
      },
    ],
  },
];

export default petsAnimalsLessons;
