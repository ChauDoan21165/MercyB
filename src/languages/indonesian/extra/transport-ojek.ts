// src/languages/indonesian/extra/transport-ojek.ts
//
// Indonesian transport survival pack for Vietnamese learners.
// Covers: ride-hailing apps (Gojek / Grab) and ojek motorbike taxis, the
// traditional angkot / becak, and intercity travel by train and to/from the
// airport. Hand-crafted, no filler.
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

export const transportOjekLessons: IndonesianLesson[] = [
  {
    id: "indonesian_ojek_ridehailing",
    level: "A1",
    category: "transport",
    title_vi: "Gojek, Grab và ojek — đặt xe ôm",
    title_en: "Gojek, Grab and ojek — booking a motorbike taxi",
    sentences: [
      {
        en: "Saya mau pesan ojek lewat aplikasi.",
        vi: "Tôi muốn đặt xe ôm qua ứng dụng.",
        pronunciation_focus: [
          "pesan → peu-SAN, 'đặt/gọi' (xe, món…)",
          "ojek → Ô-jék, 'xe ôm' (xe máy chở khách)",
          "lewat → LE-wat, 'qua/bằng'; aplikasi = ứng dụng",
        ],
        pronunciation_focus_en: [
          "pesan → 'pe-SAN' — to book/order (a ride, food…)",
          "ojek → 'OH-jek' — motorbike taxi",
          "lewat → 'LEH-wat' — via/through; aplikasi = app",
        ],
      },
      {
        en: "Tolong jemput saya di depan hotel.",
        vi: "Làm ơn đón tôi trước khách sạn.",
        pronunciation_focus: [
          "jemput → JEM-put, 'đón'",
          "di depan → 'ở phía trước' (di = ở, depan = trước)",
          "hotel → HÔ-tel, mượn từ tiếng Anh",
        ],
        pronunciation_focus_en: [
          "jemput → 'JEM-poot' — to pick up",
          "di depan → 'in front of' (di = at, depan = front)",
          "hotel → 'HOH-tel' — loanword",
        ],
      },
      {
        en: "Antar saya ke bandara, ya.",
        vi: "Cho tôi đến sân bay nhé.",
        pronunciation_focus: [
          "antar → AN-tar, 'đưa/chở đến'",
          "ke → 'đến/tới' — giới từ chỉ hướng (khác 'di' = ở)",
          "bandara → ban-DA-ra, 'sân bay'",
        ],
        pronunciation_focus_en: [
          "antar → 'AN-tar' — to take/deliver (someone) to",
          "ke → 'to/toward' — directional preposition (vs. 'di' = static 'at')",
          "bandara → 'ban-DA-ra' — airport",
        ],
      },
      {
        en: "Berapa ongkosnya ke stasiun?",
        vi: "Đi đến ga giá bao nhiêu?",
        pronunciation_focus: [
          "ongkos → ONG-kos, 'cước/phí đi lại'",
          "ongkosnya → 'cước (của chuyến đó)' (+ -nya)",
          "stasiun → sta-si-UN, 'nhà ga (tàu)'",
        ],
        pronunciation_focus_en: [
          "ongkos → 'ONG-kos' — fare / transport cost",
          "ongkosnya → 'the fare' (+ '-nya')",
          "stasiun → 'sta-see-OON' — (train) station",
        ],
      },
      {
        en: "Tolong pakai helm ini.",
        vi: "Làm ơn đội mũ bảo hiểm này.",
        pronunciation_focus: [
          "pakai → PA-kai, 'dùng/đội/mặc'",
          "helm → 'hèlm', mũ bảo hiểm — bắt buộc khi đi ojek",
          "ini → I-ni, 'này'",
        ],
        pronunciation_focus_en: [
          "pakai → 'PA-kai' — to use/wear/put on",
          "helm → 'helm' — helmet; mandatory on an ojek",
          "ini → 'EE-nee' — this",
        ],
      },
    ],
    cultural_notes_vi:
      "Gojek và Grab là hai ứng dụng gọi xe lớn nhất Indonesia — gọi được cả xe máy (GoRide / GrabBike) lẫn ô tô (GoCar / GrabCar), giao đồ ăn (GoFood / GrabFood), và nhiều dịch vụ khác. 'Ojek' là xe ôm truyền thống; bản qua app gọi là 'ojek online' (ojol). Đi ojek BẮT BUỘC đội mũ bảo hiểm ('helm') — tài xế luôn có sẵn một cái cho khách. Giá hiện rõ trong app nên không cần trả giá như ojek vỉa hè.",
    cultural_notes_en:
      "Gojek and Grab are Indonesia's two biggest ride-hailing apps — they book motorbikes (GoRide / GrabBike) and cars (GoCar / GrabCar), deliver food (GoFood / GrabFood), and much more. 'Ojek' is the traditional motorbike taxi; the app version is 'ojek online' (ojol). Wearing a helmet ('helm') on an ojek is mandatory — the driver always carries a spare for the passenger. App fares are shown upfront, so no haggling unlike a street-corner ojek.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt hai giới từ chỉ nơi chốn — 'di' = ở (tĩnh: di hotel = ở khách sạn), 'ke' = đến (hướng: ke bandara = đến sân bay). Đây là lỗi hay gặp. Ba động từ vàng khi đi xe: jemput (đón), antar (chở đến), pakai (dùng/đội). 'Tolong + động từ' là cách lịch sự để nhờ tài xế.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish the two location prepositions — 'di' = static 'at' (di hotel = at the hotel), 'ke' = directional 'to' (ke bandara = to the airport). This is a common slip. Three golden ride verbs: jemput (pick up), antar (drop off), pakai (use/wear). 'Tolong + verb' is the polite way to ask the driver for something.",
    vocabulary: [
      {
        word: "ojek",
        en: "motorbike taxi",
        vi: "xe ôm",
        pos: "noun",
        pronunciation_vi: "Ô-jék",
        pronunciation_en: "OH-jek",
      },
      {
        word: "aplikasi",
        en: "app / application",
        vi: "ứng dụng",
        pos: "noun",
        pronunciation_vi: "a-pli-KA-si",
        pronunciation_en: "ap-lee-KA-see",
      },
      {
        word: "jemput",
        en: "to pick up",
        vi: "đón",
        pos: "verb",
        pronunciation_vi: "JEM-put",
        pronunciation_en: "JEM-poot",
      },
      {
        word: "antar",
        en: "to take/drop off",
        vi: "chở đến / đưa đến",
        pos: "verb",
        pronunciation_vi: "AN-tar",
        pronunciation_en: "AN-tar",
      },
      {
        word: "bandara",
        en: "airport",
        vi: "sân bay",
        pos: "noun",
        pronunciation_vi: "ban-DA-ra",
        pronunciation_en: "ban-DA-ra",
      },
      {
        word: "ongkos",
        en: "fare / transport cost",
        vi: "cước phí",
        pos: "noun",
        pronunciation_vi: "ONG-kos",
        pronunciation_en: "ONG-kos",
      },
      {
        word: "helm",
        en: "helmet",
        vi: "mũ bảo hiểm",
        pos: "noun",
        pronunciation_vi: "hèlm",
        pronunciation_en: "helm",
      },
      {
        word: "pakai",
        en: "to use / wear",
        vi: "dùng / đội / mặc",
        pos: "verb",
        pronunciation_vi: "PA-kai",
        pronunciation_en: "PA-kai",
      },
      {
        word: "supir / sopir",
        en: "driver",
        vi: "tài xế",
        pos: "noun",
        pronunciation_vi: "su-PIR / sô-PIR",
        pronunciation_en: "soo-PEER / soh-PEER",
      },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Halo, Mas. Tolong jemput saya di depan hotel, ya.",
        vi: "Chào anh. Làm ơn đón tôi trước khách sạn nhé.",
        en: "Hello. Please pick me up in front of the hotel.",
      },
      {
        speaker: "Driver",
        text: "Baik, saya lima menit lagi sampai. Mau ke mana?",
        vi: "Vâng, năm phút nữa tôi tới. Đi đâu ạ?",
        en: "Okay, I'll be there in five minutes. Where to?",
      },
      {
        speaker: "Penumpang",
        text: "Antar saya ke bandara. Berapa ongkosnya?",
        vi: "Chở tôi đến sân bay. Cước bao nhiêu?",
        en: "Take me to the airport. How much is the fare?",
      },
      {
        speaker: "Driver",
        text: "Sudah ada di aplikasi, lima puluh ribu. Pakai helm ini, ya.",
        vi: "Đã có trong app rồi, năm mươi nghìn. Đội mũ bảo hiểm này nhé.",
        en: "It's already in the app, fifty thousand. Wear this helmet, please.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đi xe còn thiếu:",
        instruction_en: "Fill in the missing transport word:",
        items: [
          {
            prompt: "Tolong ___ saya di depan hotel. (đón)",
            answer: "jemput",
            options: ["jemput", "jalan", "jadi"],
          },
          {
            prompt: "___ saya ke bandara. (chở đến)",
            answer: "Antar",
            options: ["Antar", "Ambil", "Akhir"],
          },
          {
            prompt: "Tolong pakai ___ ini. (mũ bảo hiểm)",
            answer: "helm",
            options: ["helm", "hotel", "hari"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "ojek", answer: "xe ôm" },
          { prompt: "bandara", answer: "sân bay" },
          { prompt: "ongkos", answer: "cước phí" },
          { prompt: "supir", answer: "tài xế" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đặt xe ôm qua ứng dụng.", answer: "Saya mau pesan ojek lewat aplikasi." },
          { prompt: "Làm ơn đón tôi trước khách sạn.", answer: "Tolong jemput saya di depan hotel." },
          { prompt: "Đi đến sân bay giá bao nhiêu?", answer: "Berapa ongkosnya ke bandara?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_angkot_becak",
    level: "A2",
    category: "transport",
    title_vi: "Angkot, becak và xe buýt — phương tiện địa phương",
    title_en: "Angkot, becak and bus — local transport",
    sentences: [
      {
        en: "Angkot ini lewat Pasar Baru tidak?",
        vi: "Xe angkot này có đi qua Chợ Mới không?",
        pronunciation_focus: [
          "angkot → ANG-kot, xe khách nhỏ chạy tuyến cố định",
          "lewat → LE-wat, 'đi qua'",
          "…tidak? cuối câu → biến thành câu hỏi có/không",
        ],
        pronunciation_focus_en: [
          "angkot → 'ANG-kot' — shared minivan running a fixed route",
          "lewat → 'LEH-wat' — to pass through / go via",
          "…tidak? at the end → turns the sentence into a yes/no question",
        ],
      },
      {
        en: "Saya turun di perempatan depan, ya.",
        vi: "Tôi xuống ở ngã tư phía trước nhé.",
        pronunciation_focus: [
          "turun → TU-run, 'xuống (xe)' — ngược với naik (lên)",
          "perempatan → 'ngã tư' (gốc empat = bốn)",
          "depan → DE-pan, 'phía trước'",
        ],
        pronunciation_focus_en: [
          "turun → 'TOO-roon' — to get off/down — opposite of 'naik' (get on/up)",
          "perempatan → 'intersection/crossroads' (root 'empat' = four)",
          "depan → 'DEH-pan' — ahead / in front",
        ],
      },
      {
        en: "Pak, tolong berhenti di sini.",
        vi: "Bác ơi, làm ơn dừng ở đây.",
        pronunciation_focus: [
          "berhenti → ber-HEN-ti, 'dừng lại' (gốc henti + ber-)",
          "di sini → 'ở đây' (di = ở, sini = đây)",
          "Pak → gọi bác tài đàn ông lịch sự",
        ],
        pronunciation_focus_en: [
          "berhenti → 'ber-HEN-tee' — to stop (root 'henti' + 'ber-')",
          "di sini → 'here' (di = at, sini = here)",
          "Pak → polite address for the male driver",
        ],
      },
      {
        en: "Naik becak ke pasar berapa, Pak?",
        vi: "Đi xích lô đến chợ bao nhiêu, bác?",
        pronunciation_focus: [
          "naik → NA-ik, 'lên/đi (phương tiện)'",
          "becak → BÉ-chak, 'xích lô (đạp)'; vẫn phải trả giá",
          "berapa → beu-RA-pa, 'bao nhiêu'",
        ],
        pronunciation_focus_en: [
          "naik → 'NA-ik' — to board / ride (a vehicle)",
          "becak → 'BEH-chak' — pedicab/cyclo; you still haggle the price",
          "berapa → 'be-RA-pa' — how much",
        ],
      },
      {
        en: "Halte bus berikutnya di mana?",
        vi: "Trạm xe buýt tiếp theo ở đâu?",
        pronunciation_focus: [
          "halte → HAL-te, 'trạm/điểm dừng xe buýt'",
          "berikutnya → 'tiếp theo' (gốc ikut + ber-…-nya)",
          "di mana → 'ở đâu'",
        ],
        pronunciation_focus_en: [
          "halte → 'HAL-teh' — bus stop",
          "berikutnya → 'the next one' (root 'ikut' + 'ber-…-nya')",
          "di mana → 'where'",
        ],
      },
    ],
    cultural_notes_vi:
      "'Angkot' (angkutan kota — xe khách thành phố) là xe van nhỏ chạy tuyến cố định, vẫy tay là lên, muốn xuống thì nói 'kiri!' (bên trái) hoặc 'berhenti'. 'Becak' là xích lô đạp (ở Sumatra có becak gắn máy) — phải trả giá trước. Xe buýt nhanh hiện đại như TransJakarta dừng ở 'halte' có cửa riêng. Gọi bác tài 'Pak'/'Bu' cho lịch sự.",
    cultural_notes_en:
      "An 'angkot' (angkutan kota — city transport) is a small shared van on a fixed route; flag it down to board and call out 'kiri!' (left) or 'berhenti' to get off. A 'becak' is a pedaled pedicab (in Sumatra, motorized) — agree the price first. Modern bus rapid transit like TransJakarta stops at a 'halte' with its own gate. Address the driver 'Pak'/'Bu' to be polite.",
    tip_advice_vi:
      "Mẹo cho người Việt: cặp động từ ngược nhau cần nhớ — 'naik' (lên/đi xe) vs 'turun' (xuống xe). Để báo xuống angkot, dân địa phương hô 'Kiri!' (sát lề trái) — học một từ này là đủ. App (Grab/Gojek) báo giá sẵn, nhưng angkot/becak vẫn theo lối cũ: hỏi 'berapa?' và trả giá. 'Berhenti' = dừng hẳn; 'turun' = (cho tôi) xuống.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn the opposite pair — 'naik' (board/ride) vs 'turun' (get off). To signal a stop on an angkot, locals shout 'Kiri!' (pull to the left) — that one word is enough. Apps (Grab/Gojek) show fares upfront, but angkot/becak stay old-school: ask 'berapa?' and haggle. 'Berhenti' = come to a stop; 'turun' = (let me) get off.",
    vocabulary: [
      {
        word: "angkot",
        en: "shared minivan (city transport)",
        vi: "xe khách nhỏ tuyến cố định",
        pos: "noun",
        pronunciation_vi: "ANG-kot",
        pronunciation_en: "ANG-kot",
      },
      {
        word: "becak",
        en: "pedicab / cyclo",
        vi: "xích lô",
        pos: "noun",
        pronunciation_vi: "BÉ-chak",
        pronunciation_en: "BEH-chak",
      },
      {
        word: "bus",
        en: "bus",
        vi: "xe buýt",
        pos: "noun",
        pronunciation_vi: "bus (như 'bút' nhẹ)",
        pronunciation_en: "boos",
      },
      {
        word: "naik",
        en: "to board / ride / go up",
        vi: "lên / đi (xe)",
        pos: "verb",
        pronunciation_vi: "NA-ik",
        pronunciation_en: "NA-ik",
      },
      {
        word: "turun",
        en: "to get off / go down",
        vi: "xuống (xe)",
        pos: "verb",
        pronunciation_vi: "TU-run",
        pronunciation_en: "TOO-roon",
      },
      {
        word: "berhenti",
        en: "to stop",
        vi: "dừng lại",
        pos: "verb",
        pronunciation_vi: "ber-HEN-ti",
        pronunciation_en: "ber-HEN-tee",
      },
      {
        word: "halte",
        en: "bus stop",
        vi: "trạm xe buýt",
        pos: "noun",
        pronunciation_vi: "HAL-te",
        pronunciation_en: "HAL-teh",
      },
      {
        word: "perempatan",
        en: "intersection / crossroads",
        vi: "ngã tư",
        pos: "noun",
        pronunciation_vi: "peu-rem-PA-tan",
        pronunciation_en: "pe-rem-PA-tan",
      },
      {
        word: "kiri",
        en: "left (also: 'stop here!' on an angkot)",
        vi: "bên trái (hô để xuống xe)",
        pos: "noun / interjection",
        pronunciation_vi: "KI-ri",
        pronunciation_en: "KEE-ree",
      },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Pak, angkot ini lewat Pasar Baru tidak?",
        vi: "Bác ơi, xe angkot này có đi qua Chợ Mới không?",
        en: "Sir, does this angkot pass through Pasar Baru?",
      },
      {
        speaker: "Sopir",
        text: "Lewat, Mbak. Naik saja.",
        vi: "Có đi qua, cô. Lên xe đi.",
        en: "Yes it does, miss. Hop in.",
      },
      {
        speaker: "Penumpang",
        text: "Saya turun di perempatan depan, ya. Kiri, Pak!",
        vi: "Tôi xuống ở ngã tư phía trước nhé. Bên trái, bác!",
        en: "I'll get off at the next intersection. Pull over (left), sir!",
      },
      {
        speaker: "Sopir",
        text: "Baik. Ongkosnya empat ribu.",
        vi: "Được. Cước bốn nghìn.",
        en: "Alright. The fare is four thousand.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phương tiện địa phương còn thiếu:",
        instruction_en: "Fill in the missing local-transport word:",
        items: [
          {
            prompt: "Saya ___ di perempatan depan. (xuống xe)",
            answer: "turun",
            options: ["turun", "tutup", "tunggu"],
          },
          {
            prompt: "Pak, tolong ___ di sini. (dừng lại)",
            answer: "berhenti",
            options: ["berhenti", "berangkat", "berbicara"],
          },
          {
            prompt: "___ becak ke pasar berapa? (đi/lên)",
            answer: "Naik",
            options: ["Naik", "Nasi", "Nanti"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "becak", answer: "xích lô" },
          { prompt: "halte", answer: "trạm xe buýt" },
          { prompt: "perempatan", answer: "ngã tư" },
          { prompt: "naik", answer: "lên / đi (xe)" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Xe angkot này có đi qua Chợ Mới không?", answer: "Angkot ini lewat Pasar Baru tidak?" },
          { prompt: "Bác ơi, làm ơn dừng ở đây.", answer: "Pak, tolong berhenti di sini." },
          { prompt: "Trạm xe buýt tiếp theo ở đâu?", answer: "Halte bus berikutnya di mana?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_train_airport_travel",
    level: "B1",
    category: "transport",
    title_vi: "Tàu hỏa và sân bay — đi lại liên tỉnh",
    title_en: "Train and airport — intercity travel",
    sentences: [
      {
        en: "Saya mau beli tiket kereta ke Yogyakarta untuk besok.",
        vi: "Tôi muốn mua vé tàu đi Yogyakarta cho ngày mai.",
        pronunciation_focus: [
          "tiket → TI-ket, 'vé' (mượn 'ticket')",
          "kereta → keu-RE-ta, 'tàu hỏa'",
          "untuk besok → 'cho ngày mai'; thời tương lai chỉ cần thêm 'besok', không chia động từ",
        ],
        pronunciation_focus_en: [
          "tiket → 'TEE-ket' — ticket (loanword)",
          "kereta → 'ke-REH-ta' — train",
          "untuk besok → 'for tomorrow'; future is just a time word ('besok'), no verb change",
        ],
      },
      {
        en: "Keretanya berangkat jam berapa?",
        vi: "Tàu khởi hành lúc mấy giờ?",
        pronunciation_focus: [
          "berangkat → ber-ANG-kat, 'khởi hành/xuất phát'",
          "jam berapa → 'lúc mấy giờ' (jam = giờ)",
          "keretanya → 'chuyến tàu (đó)' (+ -nya)",
        ],
        pronunciation_focus_en: [
          "berangkat → 'ber-ANG-kat' — to depart",
          "jam berapa → 'what time' (jam = hour/clock)",
          "keretanya → 'the train' (+ '-nya')",
        ],
      },
      {
        en: "Di mana saya bisa check-in penerbangan?",
        vi: "Tôi làm thủ tục lên máy bay ở đâu?",
        pronunciation_focus: [
          "check-in → đọc như tiếng Anh, dùng phổ biến ở sân bay",
          "penerbangan → 'chuyến bay' (gốc terbang = bay + pe-…-an)",
          "bisa → BI-sa, 'có thể'",
        ],
        pronunciation_focus_en: [
          "check-in → said as in English; common at airports",
          "penerbangan → 'flight' (root 'terbang' = to fly + 'pe-…-an')",
          "bisa → 'BEE-sa' — can / be able to",
        ],
      },
      {
        en: "Pesawat saya tertunda dua jam karena cuaca.",
        vi: "Chuyến bay của tôi bị hoãn hai tiếng vì thời tiết.",
        pronunciation_focus: [
          "pesawat → peu-SA-wat, 'máy bay'",
          "tertunda → 'bị hoãn' — tiền tố ter- chỉ trạng thái bị động/ngoài ý muốn",
          "karena cuaca → 'vì thời tiết' (karena = vì)",
        ],
        pronunciation_focus_en: [
          "pesawat → 'pe-SA-wat' — airplane",
          "tertunda → 'delayed' — prefix 'ter-' marks an unintended/passive state",
          "karena cuaca → 'because of the weather' (karena = because)",
        ],
      },
      {
        en: "Tolong tunjukkan jalan ke pintu keberangkatan.",
        vi: "Làm ơn chỉ đường đến cổng khởi hành.",
        pronunciation_focus: [
          "tunjukkan → 'chỉ cho (xem)' — gốc tunjuk + -kan",
          "pintu → PIN-tu, 'cửa/cổng'",
          "keberangkatan → 'sự khởi hành/cổng đi' (berangkat + ke-…-an)",
        ],
        pronunciation_focus_en: [
          "tunjukkan → 'show (me)' — root 'tunjuk' + '-kan'",
          "pintu → 'PIN-too' — door/gate",
          "keberangkatan → 'departure' (berangkat + circumfix 'ke-…-an')",
        ],
      },
    ],
    cultural_notes_vi:
      "Tàu hỏa (kereta api) ở Java rất phổ biến và đúng giờ; mua vé qua app KAI Access hoặc tại 'stasiun'. Hạng ghế: ekonomi, bisnis, eksekutif. Tại sân bay ('bandara'), bảng hiệu song ngữ Indonesia–Anh: 'Keberangkatan' (Departures), 'Kedatangan' (Arrivals). Nhiều từ sân bay/hàng không mượn thẳng tiếng Anh (check-in, boarding, bagasi). 'Cuaca' (thời tiết) là lý do hoãn bay thường gặp mùa mưa.",
    cultural_notes_en:
      "Trains (kereta api) on Java are popular and punctual; buy tickets via the KAI Access app or at a 'stasiun'. Seat classes: ekonomi, bisnis, eksekutif. At the airport ('bandara'), signage is bilingual Indonesian–English: 'Keberangkatan' (Departures), 'Kedatangan' (Arrivals). Many aviation terms are borrowed straight from English (check-in, boarding, bagasi). 'Cuaca' (weather) is a common reason for delays in the rainy season.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiền tố 'ter-' báo trạng thái bị động/ngoài ý muốn — tertunda (bị hoãn), terlambat (bị trễ), tertinggal (bị bỏ lại). Gặp 'ter-' ở sân bay là biết có chuyện. Cặp đối nghĩa cần thuộc: keberangkatan (đi) ↔ kedatangan (đến). Tương lai không cần chia động từ, chỉ thêm mốc thời gian: besok (mai), nanti (lát nữa), minggu depan (tuần sau).",
    tip_advice_en:
      "Tip for Vietnamese speakers: the 'ter-' prefix flags a passive/unintended state — tertunda (delayed), terlambat (late), tertinggal (left behind). Seeing 'ter-' at the airport means something went off-plan. Memorize the antonym pair: keberangkatan (departure) ↔ kedatangan (arrival). The future needs no verb change, just a time word: besok (tomorrow), nanti (later), minggu depan (next week).",
    vocabulary: [
      {
        word: "kereta (api)",
        en: "train",
        vi: "tàu hỏa",
        pos: "noun",
        pronunciation_vi: "keu-RE-ta (A-pi)",
        pronunciation_en: "ke-REH-ta (A-pee)",
      },
      {
        word: "stasiun",
        en: "station",
        vi: "nhà ga",
        pos: "noun",
        pronunciation_vi: "sta-si-UN",
        pronunciation_en: "sta-see-OON",
      },
      {
        word: "tiket",
        en: "ticket",
        vi: "vé",
        pos: "noun",
        pronunciation_vi: "TI-ket",
        pronunciation_en: "TEE-ket",
      },
      {
        word: "berangkat",
        en: "to depart",
        vi: "khởi hành",
        pos: "verb",
        pronunciation_vi: "ber-ANG-kat",
        pronunciation_en: "ber-ANG-kat",
      },
      {
        word: "pesawat",
        en: "airplane",
        vi: "máy bay",
        pos: "noun",
        pronunciation_vi: "peu-SA-wat",
        pronunciation_en: "pe-SA-wat",
      },
      {
        word: "penerbangan",
        en: "flight",
        vi: "chuyến bay",
        pos: "noun",
        pronunciation_vi: "peu-ner-BANG-an",
        pronunciation_en: "pe-ner-BANG-an",
      },
      {
        word: "tertunda",
        en: "delayed",
        vi: "bị hoãn",
        pos: "verb (passive state)",
        pronunciation_vi: "ter-TUN-da",
        pronunciation_en: "ter-TOON-da",
      },
      {
        word: "keberangkatan",
        en: "departure",
        vi: "khởi hành / cổng đi",
        pos: "noun",
        pronunciation_vi: "keu-ber-ang-KA-tan",
        pronunciation_en: "ke-ber-ang-KA-tan",
      },
      {
        word: "kedatangan",
        en: "arrival",
        vi: "đến nơi / cổng đến",
        pos: "noun",
        pronunciation_vi: "keu-da-TANG-an",
        pronunciation_en: "ke-da-TANG-an",
      },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Selamat pagi. Saya mau beli tiket kereta ke Yogyakarta untuk besok.",
        vi: "Chào buổi sáng. Tôi muốn mua vé tàu đi Yogyakarta cho ngày mai.",
        en: "Good morning. I'd like to buy a train ticket to Yogyakarta for tomorrow.",
      },
      {
        speaker: "Petugas",
        text: "Mau kelas apa, Pak? Ekonomi atau eksekutif?",
        vi: "Anh muốn hạng nào ạ? Phổ thông hay hạng sang?",
        en: "Which class, sir? Economy or executive?",
      },
      {
        speaker: "Penumpang",
        text: "Eksekutif, satu tiket. Keretanya berangkat jam berapa?",
        vi: "Hạng sang, một vé. Tàu khởi hành lúc mấy giờ?",
        en: "Executive, one ticket. What time does the train depart?",
      },
      {
        speaker: "Petugas",
        text: "Jam tujuh pagi dari stasiun Gambir. Ini tiketnya.",
        vi: "Bảy giờ sáng từ ga Gambir. Đây là vé của anh.",
        en: "Seven a.m. from Gambir station. Here is your ticket.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đi lại liên tỉnh còn thiếu:",
        instruction_en: "Fill in the missing intercity-travel word:",
        items: [
          {
            prompt: "Saya mau beli ___ kereta ke Yogyakarta. (vé)",
            answer: "tiket",
            options: ["tiket", "tutup", "tinggal"],
          },
          {
            prompt: "Keretanya ___ jam berapa? (khởi hành)",
            answer: "berangkat",
            options: ["berangkat", "berhenti", "berbicara"],
          },
          {
            prompt: "Pesawat saya ___ dua jam karena cuaca. (bị hoãn)",
            answer: "tertunda",
            options: ["tertunda", "terbang", "terbuka"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "pesawat", answer: "máy bay" },
          { prompt: "keberangkatan", answer: "khởi hành" },
          { prompt: "kedatangan", answer: "đến nơi" },
          { prompt: "stasiun", answer: "nhà ga" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn mua vé tàu cho ngày mai.", answer: "Saya mau beli tiket kereta untuk besok." },
          { prompt: "Tàu khởi hành lúc mấy giờ?", answer: "Keretanya berangkat jam berapa?" },
          { prompt: "Chuyến bay của tôi bị hoãn vì thời tiết.", answer: "Pesawat saya tertunda karena cuaca." },
        ],
      },
    ],
  },
];

export default transportOjekLessons;
