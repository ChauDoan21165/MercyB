// src/languages/indonesian/extra/motorcycle-culture.ts
//
// Indonesian motorcycle-culture pack for Vietnamese learners.
// Covers: owning and riding a motorbike (motor, helm, bensin, parkir), the
// repair shop (bengkel: servis, ban bocor, ganti oli), and traffic rules +
// motorbike culture (SIM, lampu merah, tilang, helm wajib, modifikasi).
// Hand-crafted, no filler. Focus is on OWNING/maintaining a bike — distinct
// from the ride-hailing/ojek pack.
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

export const motorcycleCultureLessons: IndonesianLesson[] = [
  {
    id: "indonesian_motor_riding_gear",
    level: "A1",
    category: "transport",
    title_vi: "Đi xe máy — đồ bảo hộ, xăng, gửi xe",
    title_en: "Riding a motorbike — gear, fuel, parking",
    sentences: [
      {
        en: "Saya naik motor ke kantor setiap hari.",
        vi: "Tôi đi xe máy đến công ty mỗi ngày.",
        pronunciation_focus: [
          "naik motor → 'đi xe máy' (naik = lên/đi phương tiện)",
          "motor → MÔ-tor, 'xe máy' (xe gắn máy)",
          "L1 note: 'motor' = xe máy, KHÔNG phải 'mô tơ/động cơ' như trong tiếng Việt",
        ],
        pronunciation_focus_en: [
          "naik motor → 'to ride a motorbike' (naik = board/ride)",
          "motor → 'MOH-tor' — motorbike",
          "note: 'motor' = the whole motorbike, not just the engine",
        ],
      },
      {
        en: "Jangan lupa pakai helm sebelum jalan.",
        vi: "Đừng quên đội mũ bảo hiểm trước khi đi.",
        pronunciation_focus: [
          "pakai → PA-kai, 'dùng/đội/mặc'",
          "helm → 'hèlm', mũ bảo hiểm",
          "sebelum jalan → 'trước khi đi' (sebelum = trước khi, jalan = đi/chạy)",
        ],
        pronunciation_focus_en: [
          "pakai → 'PA-kai' — to use/wear/put on",
          "helm → 'helm' — helmet",
          "sebelum jalan → 'before setting off' (sebelum = before, jalan = to go/run)",
        ],
      },
      {
        en: "Bensinnya hampir habis, kita isi dulu.",
        vi: "Xăng gần hết rồi, mình đổ trước đã.",
        pronunciation_focus: [
          "bensin → BÉN-sin, 'xăng'",
          "hampir habis → 'gần hết' (hampir = gần, habis = hết)",
          "isi → I-si, 'đổ/nạp đầy'; dulu = '… trước đã'",
        ],
        pronunciation_focus_en: [
          "bensin → 'BEN-sin' — petrol/gasoline",
          "hampir habis → 'almost out' (hampir = nearly, habis = used up)",
          "isi → 'EE-see' — to fill; 'dulu' = 'first/beforehand'",
        ],
      },
      {
        en: "Di mana saya bisa parkir motor?",
        vi: "Tôi có thể gửi xe máy ở đâu?",
        pronunciation_focus: [
          "di mana → 'ở đâu'",
          "parkir → PAR-kir, 'đỗ/gửi xe' (mượn 'park')",
          "bisa → BI-sa, 'có thể'",
        ],
        pronunciation_focus_en: [
          "di mana → 'where'",
          "parkir → 'PAR-keer' — to park (loanword)",
          "bisa → 'BEE-sa' — can/be able to",
        ],
      },
      {
        en: "Tolong kunci motornya supaya aman.",
        vi: "Làm ơn khóa xe lại cho an toàn.",
        pronunciation_focus: [
          "kunci → KUN-chi, 'khóa' (vừa là danh từ chìa khóa, vừa là động từ khóa)",
          "supaya → su-PA-ya, 'để/cho (mục đích)'",
          "aman → A-man, 'an toàn'",
        ],
        pronunciation_focus_en: [
          "kunci → 'KOON-chee' — key / to lock",
          "supaya → 'soo-PA-ya' — so that (purpose)",
          "aman → 'A-man' — safe/secure",
        ],
      },
    ],
    cultural_notes_vi:
      "Xe máy ('motor') là phương tiện số một ở Indonesia — Honda và Yamaha thống trị, xe tay ga ('motor matic') rất phổ biến. Đội mũ bảo hiểm ('helm') là bắt buộc, công an phạt nếu không đội. Đổ xăng ở 'SPBU' (cây xăng Pertamina) hoặc mua xăng lẻ 'Pertamini'. Hầu hết nơi công cộng có bãi gửi xe ('parkir') có người trông, trả phí nhỏ và họ đưa vé. Nhớ khóa cổ ('kunci stang') để chống trộm.",
    cultural_notes_en:
      "The motorbike ('motor') is Indonesia's number-one vehicle — Honda and Yamaha dominate, and automatic scooters ('motor matic') are everywhere. Wearing a helmet ('helm') is mandatory; police fine you for going without. Fuel up at an 'SPBU' (Pertamina station) or buy bottled petrol from a 'Pertamini'. Most public places have an attended parking lot ('parkir') with a small fee and a ticket. Remember the handlebar lock ('kunci stang') against theft.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'motor' trong tiếng Indonesia = cả chiếc xe máy, không phải 'động cơ' — đây là false friend hay nhầm. 'Naik motor' = đi xe máy (naik dùng cho mọi phương tiện). 'Pakai helm' = đội mũ bảo hiểm. Để chỉ mục đích, dùng 'supaya/agar + mệnh đề' (supaya aman = cho an toàn). 'Isi bensin' = đổ xăng (isi = đổ đầy).",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'motor' in Indonesian = the whole motorbike, not 'engine' — a common false friend. 'Naik motor' = to ride a motorbike (naik works for any vehicle). 'Pakai helm' = to wear a helmet. To express purpose, use 'supaya/agar + clause' (supaya aman = so it's safe). 'Isi bensin' = to fill up with petrol (isi = to fill).",
    vocabulary: [
      {
        cell_id: "051f9492-37d0-481c-8c74-9d18c84f7860",
        word: "motor",
        en: "motorbike",
        vi: "xe máy",
        pos: "noun",
        pronunciation_vi: "MÔ-tor",
        pronunciation_en: "MOH-tor",
      },
      {
        cell_id: "dee3b10d-fa7a-47f1-a3b1-cd24460b6daf",
        word: "helm",
        en: "helmet",
        vi: "mũ bảo hiểm",
        pos: "noun",
        pronunciation_vi: "hèlm",
        pronunciation_en: "helm",
      },
      {
        cell_id: "b9f06999-94b4-40df-beb3-11ba68e722d2",
        word: "bensin",
        en: "petrol / gasoline",
        vi: "xăng",
        pos: "noun",
        pronunciation_vi: "BÉN-sin",
        pronunciation_en: "BEN-sin",
      },
      {
        cell_id: "12b31f92-3155-4508-8d05-77f2c04bb824",
        word: "parkir",
        en: "to park / parking",
        vi: "gửi xe / đỗ xe",
        pos: "verb / noun",
        pronunciation_vi: "PAR-kir",
        pronunciation_en: "PAR-keer",
      },
      {
        cell_id: "4823e971-134a-45cc-bca6-b92b230d395b",
        word: "kunci",
        en: "key / to lock",
        vi: "chìa khóa / khóa",
        pos: "noun / verb",
        pronunciation_vi: "KUN-chi",
        pronunciation_en: "KOON-chee",
      },
      {
        cell_id: "ec23ff5e-bca0-4d02-b949-ff7c467bbd7f",
        word: "isi",
        en: "to fill",
        vi: "đổ / nạp đầy",
        pos: "verb",
        pronunciation_vi: "I-si",
        pronunciation_en: "EE-see",
      },
      {
        cell_id: "05d236c9-52ea-4c84-b46b-c28572d2be61",
        word: "aman",
        en: "safe / secure",
        vi: "an toàn",
        pos: "adjective",
        pronunciation_vi: "A-man",
        pronunciation_en: "A-man",
      },
      {
        cell_id: "06ca4803-4f9c-42be-acb6-d3de20964b5c",
        word: "habis",
        en: "used up / out of",
        vi: "hết",
        pos: "adjective / verb",
        pronunciation_vi: "HA-bis",
        pronunciation_en: "HA-bees",
      },
    ],
    dialogue: [
      {
        cell_id: "ad7c3ec3-5547-473c-87b8-91580e58271a",
        speaker: "Eko",
        text: "Mau ke pasar naik motor? Bensinnya hampir habis, lho.",
        vi: "Đi chợ bằng xe máy hả? Xăng gần hết rồi đó.",
        en: "Heading to the market by motorbike? The petrol's almost out, you know.",
      },
      {
        cell_id: "51c28201-9fd4-40a9-ab87-736802ae72fd",
        speaker: "Wati",
        text: "Kita isi dulu di SPBU. Jangan lupa pakai helm, ya.",
        vi: "Mình ghé cây xăng đổ trước. Đừng quên đội mũ bảo hiểm nhé.",
        en: "Let's fill up at the station first. Don't forget your helmet.",
      },
      {
        cell_id: "f9548e04-2645-429d-85da-03f102650101",
        speaker: "Eko",
        text: "Nanti di pasar, di mana saya bisa parkir motor?",
        vi: "Lát tới chợ, mình gửi xe ở đâu được?",
        en: "Later at the market, where can I park the bike?",
      },
      {
        cell_id: "e5af2727-88ec-46f4-be5e-369d185c2624",
        speaker: "Wati",
        text: "Ada tempat parkir di depan. Tolong kunci motornya supaya aman.",
        vi: "Có chỗ gửi xe ở phía trước. Nhớ khóa xe cho an toàn nhé.",
        en: "There's a parking spot out front. Please lock the bike so it's safe.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về xe máy còn thiếu:",
        instruction_en: "Fill in the missing motorbike word:",
        items: [
          {
            prompt: "Jangan lupa pakai ___ sebelum jalan. (mũ bảo hiểm)",
            answer: "helm",
            options: ["helm", "hotel", "hari"],
          },
          {
            prompt: "___-nya hampir habis, kita isi dulu. (xăng)",
            answer: "Bensin",
            options: ["Bensin", "Bantal", "Bangku"],
          },
          {
            prompt: "Tolong ___ motornya supaya aman. (khóa)",
            answer: "kunci",
            options: ["kunci", "kursi", "kurang"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "motor", answer: "xe máy" },
          { prompt: "bensin", answer: "xăng" },
          { prompt: "parkir", answer: "gửi xe" },
          { prompt: "aman", answer: "an toàn" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi đi xe máy đến công ty mỗi ngày.", answer: "Saya naik motor ke kantor setiap hari." },
          { prompt: "Xăng gần hết rồi, mình đổ trước đã.", answer: "Bensinnya hampir habis, kita isi dulu." },
          { prompt: "Tôi có thể gửi xe máy ở đâu?", answer: "Di mana saya bisa parkir motor?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_motor_bengkel_repair",
    level: "A2",
    category: "transport",
    title_vi: "Ở tiệm sửa xe — bảo dưỡng và sửa chữa",
    title_en: "At the repair shop — servicing and repairs",
    sentences: [
      {
        en: "Motor saya mogok, tolong dibantu.",
        vi: "Xe máy tôi chết máy, làm ơn giúp với.",
        pronunciation_focus: [
          "mogok → MÔ-gok, '(xe) chết máy/hỏng giữa đường'",
          "tolong dibantu → 'làm ơn giúp đỡ' (di- = dạng bị động lịch sự)",
          "L1 note: 'mogok' còn nghĩa 'đình công' — ngữ cảnh xe cộ = chết máy",
        ],
        pronunciation_focus_en: [
          "mogok → 'MOH-gok' — (vehicle) to break down/stall",
          "tolong dibantu → 'please help' (di- = polite passive)",
          "note: 'mogok' also means 'to strike' — in a vehicle context it's 'break down'",
        ],
      },
      {
        en: "Bannya bocor, harus ditambal.",
        vi: "Lốp bị thủng, phải vá lại.",
        pronunciation_focus: [
          "ban → ban, 'lốp/vỏ xe'",
          "bocor → BÔ-chor, 'thủng/rò'",
          "ditambal → 'được vá' (di- + tambal = vá)",
        ],
        pronunciation_focus_en: [
          "ban → 'ban' — tire",
          "bocor → 'BOH-chor' — punctured/leaking",
          "ditambal → 'be patched' (di- + tambal = to patch)",
        ],
      },
      {
        en: "Sudah waktunya ganti oli mesin.",
        vi: "Đã đến lúc thay nhớt máy rồi.",
        pronunciation_focus: [
          "sudah waktunya → 'đã đến lúc'",
          "ganti → GAN-ti, 'thay/đổi'",
          "oli mesin → 'dầu nhớt động cơ' (oli = nhớt, mesin = máy)",
        ],
        pronunciation_focus_en: [
          "sudah waktunya → 'it's time to'",
          "ganti → 'GAN-tee' — to change/replace",
          "oli mesin → 'engine oil' (oli = oil, mesin = engine)",
        ],
      },
      {
        en: "Berapa biaya servisnya, Mas?",
        vi: "Phí bảo dưỡng bao nhiêu vậy anh?",
        pronunciation_focus: [
          "biaya → bi-A-ya, 'chi phí'",
          "servis → SÉR-vis, 'bảo dưỡng/dịch vụ' (mượn 'service')",
          "Mas → cách gọi thân thiện 'anh' (đàn ông trẻ, hay dùng với thợ)",
        ],
        pronunciation_focus_en: [
          "biaya → 'bee-A-ya' — cost/fee",
          "servis → 'SER-vis' — servicing (loanword)",
          "Mas → friendly address 'bro' (younger man; common with mechanics)",
        ],
      },
      {
        en: "Tolong cek remnya juga, kurang pakem.",
        vi: "Làm ơn kiểm tra cả phanh nữa, không ăn lắm.",
        pronunciation_focus: [
          "cek → 'chék', 'kiểm tra' (mượn 'check')",
          "rem → 'rèm', 'phanh/thắng'",
          "kurang pakem → 'phanh không ăn' (pakem = bám/ăn chắc)",
        ],
        pronunciation_focus_en: [
          "cek → 'chek' — to check (loanword)",
          "rem → 'rem' — brake",
          "kurang pakem → 'the brakes aren't gripping well' (pakem = grippy/firm)",
        ],
      },
    ],
    cultural_notes_vi:
      "'Bengkel' là tiệm sửa xe, có ở khắp nơi — nhỏ ven đường lẫn đại lý chính hãng ('bengkel resmi'). Thợ sửa xe gọi thân mật là 'Mas' (anh) hoặc 'montir'. Dịch vụ thường gặp: 'tambal ban' (vá lốp), 'ganti oli' (thay nhớt), 'servis' (bảo dưỡng định kỳ). Khi xe 'mogok' (chết máy) giữa đường, dễ tìm 'tukang tambal ban' bên lề. Nên hỏi 'Berapa biaya…?' trước khi sửa để khỏi bất ngờ.",
    cultural_notes_en:
      "A 'bengkel' is a repair shop, found everywhere — from small roadside stalls to official dealerships ('bengkel resmi'). The mechanic is addressed familiarly as 'Mas' (bro) or 'montir'. Common services: 'tambal ban' (patch a tire), 'ganti oli' (oil change), 'servis' (routine servicing). When a bike 'mogok' (breaks down) on the road, a roadside 'tukang tambal ban' is easy to find. Ask 'Berapa biaya…?' before the work so there are no surprises.",
    tip_advice_vi:
      "Mẹo cho người Việt: dạng bị động 'di-' rất hay gặp ở tiệm sửa xe — 'harus ditambal' (phải được vá), 'mau diservis' (muốn được bảo dưỡng). 'Ganti + X' = thay X (ganti oli, ganti ban). Hỏi giá: 'Berapa biaya servisnya?'. Gọi thợ là 'Mas' cho thân thiện. Cẩn thận false friend: 'mogok' = chết máy (xe) chứ không phải 'mỏi/mệt'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the 'di-' passive is very common at the shop — 'harus ditambal' (must be patched), 'mau diservis' (wants to be serviced). 'Ganti + X' = change X (ganti oli, ganti ban). Ask the price: 'Berapa biaya servisnya?'. Address the mechanic 'Mas' to be friendly. Watch the false friend: 'mogok' = (vehicle) breaks down, not 'tired'.",
    vocabulary: [
      {
        cell_id: "a432ee99-e281-406d-9f3c-e760484ba4e9",
        word: "bengkel",
        en: "repair shop / workshop",
        vi: "tiệm sửa xe",
        pos: "noun",
        pronunciation_vi: "BÉNG-kel",
        pronunciation_en: "BENG-kel",
      },
      {
        cell_id: "a8944269-509d-4525-b3e2-cffb4bc62ae7",
        word: "mogok",
        en: "to break down / stall",
        vi: "chết máy",
        pos: "verb",
        pronunciation_vi: "MÔ-gok",
        pronunciation_en: "MOH-gok",
      },
      {
        cell_id: "957b4cc3-998e-4d56-a979-1fd4f7de78d7",
        word: "ban",
        en: "tire",
        vi: "lốp / vỏ xe",
        pos: "noun",
        pronunciation_vi: "ban",
        pronunciation_en: "ban",
      },
      {
        cell_id: "538fbf98-18d5-4202-9038-a74818c06387",
        word: "bocor",
        en: "punctured / leaking",
        vi: "thủng / rò",
        pos: "adjective",
        pronunciation_vi: "BÔ-chor",
        pronunciation_en: "BOH-chor",
      },
      {
        cell_id: "44882b54-2926-4be3-9bfd-5d1173080bdc",
        word: "ganti oli",
        en: "oil change",
        vi: "thay nhớt",
        pos: "verb phrase",
        pronunciation_vi: "GAN-ti Ô-li",
        pronunciation_en: "GAN-tee OH-lee",
      },
      {
        cell_id: "e4746e55-a11a-48b7-8c7f-e018741cb8fb",
        word: "servis",
        en: "servicing / service",
        vi: "bảo dưỡng",
        pos: "noun / verb",
        pronunciation_vi: "SÉR-vis",
        pronunciation_en: "SER-vis",
      },
      {
        cell_id: "83f78ee5-2773-4ef1-912e-698efd2a8db6",
        word: "rem",
        en: "brake",
        vi: "phanh / thắng",
        pos: "noun",
        pronunciation_vi: "rèm",
        pronunciation_en: "rem",
      },
      {
        cell_id: "768a96c5-9bd4-4e33-b35b-e32140ae354f",
        word: "biaya",
        en: "cost / fee",
        vi: "chi phí",
        pos: "noun",
        pronunciation_vi: "bi-A-ya",
        pronunciation_en: "bee-A-ya",
      },
    ],
    dialogue: [
      {
        cell_id: "da7375cd-7c1e-47ed-bbd5-c44f2e3f494f",
        speaker: "Pelanggan",
        text: "Mas, motor saya mogok di jalan tadi. Tolong dicek.",
        vi: "Anh ơi, xe em chết máy ngoài đường lúc nãy. Làm ơn kiểm tra giúp.",
        en: "Bro, my bike broke down on the road earlier. Please check it.",
      },
      {
        cell_id: "650cf1ac-b501-4b82-a3e1-c86ca75dbcef",
        speaker: "Montir",
        text: "Coba saya lihat. Wah, bannya bocor, harus ditambal.",
        vi: "Để tôi xem thử. Ồ, lốp bị thủng, phải vá lại.",
        en: "Let me take a look. Oh, the tire's punctured, it needs patching.",
      },
      {
        cell_id: "86513457-1d08-4a1d-ab9a-fa93f2859d7e",
        speaker: "Pelanggan",
        text: "Sekalian ganti oli, ya. Berapa biaya semuanya?",
        vi: "Thay luôn nhớt nhé. Tổng cộng hết bao nhiêu?",
        en: "Change the oil too, please. How much for everything?",
      },
      {
        cell_id: "b98eb60d-5fbc-432e-9031-47752bf4172e",
        speaker: "Montir",
        text: "Tambal ban sama oli, sekitar delapan puluh ribu. Remnya juga saya cek, ya.",
        vi: "Vá lốp với nhớt, khoảng tám mươi nghìn. Tôi kiểm tra cả phanh luôn nhé.",
        en: "Patch plus oil, about eighty thousand. I'll check the brakes too.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ sửa xe còn thiếu:",
        instruction_en: "Fill in the missing repair word:",
        items: [
          {
            prompt: "Motor saya ___ di jalan tadi. (chết máy)",
            answer: "mogok",
            options: ["mogok", "mahal", "makan"],
          },
          {
            prompt: "Bannya ___, harus ditambal. (thủng)",
            answer: "bocor",
            options: ["bocor", "bagus", "besar"],
          },
          {
            prompt: "Sudah waktunya ___ oli mesin. (thay)",
            answer: "ganti",
            options: ["ganti", "gantung", "garam"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "bengkel", answer: "tiệm sửa xe" },
          { prompt: "ban", answer: "lốp / vỏ xe" },
          { prompt: "rem", answer: "phanh" },
          { prompt: "biaya", answer: "chi phí" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Xe máy tôi chết máy, làm ơn giúp với.", answer: "Motor saya mogok, tolong dibantu." },
          { prompt: "Lốp bị thủng, phải vá lại.", answer: "Bannya bocor, harus ditambal." },
          { prompt: "Phí bảo dưỡng bao nhiêu vậy anh?", answer: "Berapa biaya servisnya, Mas?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_motor_traffic_rules_culture",
    level: "B1",
    category: "transport",
    title_vi: "Luật giao thông và văn hóa xe máy",
    title_en: "Traffic rules and motorbike culture",
    sentences: [
      {
        en: "Pengendara motor wajib punya SIM dan membawa STNK.",
        vi: "Người lái xe máy bắt buộc phải có bằng lái và mang theo giấy đăng ký xe.",
        pronunciation_focus: [
          "pengendara → 'người điều khiển/lái' (gốc kendara + peN-…)",
          "wajib → WA-jib, 'bắt buộc/phải'",
          "SIM = bằng lái; STNK = giấy đăng ký xe (đọc tách chữ S-T-N-K)",
        ],
        pronunciation_focus_en: [
          "pengendara → 'rider/driver' (root 'kendara' + 'peN-…')",
          "wajib → 'WA-jeeb' — obligatory/must",
          "SIM = driver's license; STNK = vehicle registration (spell out S-T-N-K)",
        ],
      },
      {
        en: "Kalau melanggar lampu merah, bisa kena tilang.",
        vi: "Nếu vượt đèn đỏ, có thể bị phạt.",
        pronunciation_focus: [
          "melanggar → meu-LANG-gar, 'vi phạm/vượt (luật)'",
          "lampu merah → 'đèn đỏ' (lampu = đèn, merah = đỏ)",
          "kena tilang → 'bị phạt (giao thông)' (kena = dính/bị, tilang = biên bản phạt)",
        ],
        pronunciation_focus_en: [
          "melanggar → 'me-LANG-gar' — to violate/run (a rule)",
          "lampu merah → 'red light' (lampu = light, merah = red)",
          "kena tilang → 'to get a traffic ticket' (kena = to get hit with, tilang = ticket)",
        ],
      },
      {
        en: "Banyak anak muda suka memodifikasi motornya.",
        vi: "Nhiều bạn trẻ thích độ xe máy của mình.",
        pronunciation_focus: [
          "anak muda → 'người trẻ/thanh niên' (anak = con/đứa, muda = trẻ)",
          "memodifikasi → 'độ/chỉnh sửa (xe)' (gốc modifikasi + meN-…-i)",
          "motornya → 'chiếc xe (của họ)' (motor + -nya)",
        ],
        pronunciation_focus_en: [
          "anak muda → 'young people' (anak = child, muda = young)",
          "memodifikasi → 'to modify (a bike)' (root 'modifikasi' + 'meN-…-i')",
          "motornya → 'their motorbike' (motor + '-nya')",
        ],
      },
      {
        en: "Polisi sering melakukan razia di pagi hari.",
        vi: "Cảnh sát thường lập chốt kiểm tra vào buổi sáng.",
        pronunciation_focus: [
          "polisi → pô-LI-si, 'cảnh sát'",
          "melakukan → 'tiến hành/thực hiện' (gốc laku + meN-…-kan)",
          "razia → RA-zi-a, 'chốt kiểm tra/tổng kiểm tra'",
        ],
        pronunciation_focus_en: [
          "polisi → 'po-LEE-see' — police",
          "melakukan → 'to carry out' (root 'laku' + 'meN-…-kan')",
          "razia → 'RA-zee-a' — a police checkpoint/raid",
        ],
      },
      {
        en: "Demi keselamatan, sebaiknya jangan ngebut.",
        vi: "Vì sự an toàn, tốt nhất đừng phóng nhanh.",
        pronunciation_focus: [
          "demi → DEU-mi, 'vì/vì lợi ích của'",
          "keselamatan → 'sự an toàn' (gốc selamat + ke-…-an)",
          "ngebut → NGEU-but, 'phóng nhanh' (đời thường); sebaiknya = 'tốt nhất nên'",
        ],
        pronunciation_focus_en: [
          "demi → 'DE-mee' — for the sake of",
          "keselamatan → 'safety' (root 'selamat' + 'ke-…-an')",
          "ngebut → 'NGE-boot' — to speed (casual); 'sebaiknya' = 'had better/best to'",
        ],
      },
    ],
    cultural_notes_vi:
      "Người lái xe máy ở Indonesia bắt buộc có 'SIM C' (bằng lái xe máy) và mang theo 'STNK' (giấy đăng ký xe). 'Tilang' là biên bản phạt; cảnh sát lập 'razia' (chốt kiểm tra) để xét giấy tờ, mũ bảo hiểm, đèn. Văn hóa độ xe ('modifikasi') rất sôi nổi trong giới trẻ — có cả cộng đồng và sự kiện. Đóng thuế xe hằng năm ('pajak kendaraan') qua 'Samsat'. Khẩu hiệu an toàn hay gặp: 'Utamakan keselamatan' (Đặt an toàn lên hàng đầu).",
    cultural_notes_en:
      "Motorbike riders in Indonesia must hold a 'SIM C' (motorcycle license) and carry the 'STNK' (vehicle registration). A 'tilang' is a traffic ticket; police set up a 'razia' (checkpoint) to inspect documents, helmets, and lights. Bike-modification ('modifikasi') culture thrives among the young — with communities and events. Annual vehicle tax ('pajak kendaraan') is paid at the 'Samsat'. A common safety slogan: 'Utamakan keselamatan' (Put safety first).",
    tip_advice_vi:
      "Mẹo cho người Việt: chú ý tiền tố 'meN-' tạo động từ chủ động — langgar→melanggar (vi phạm), laku→melakukan (thực hiện), modifikasi→memodifikasi (độ xe). Người Việt hay BỎ tiền tố này khi nói; trong văn trang trọng/viết phải giữ. 'Kena + danh từ' = bị/dính (kena tilang = bị phạt). 'Wajib' = bắt buộc (mạnh hơn 'harus'). 'Demi + danh từ' = vì (mục đích cao đẹp).",
    tip_advice_en:
      "Tip for Vietnamese speakers: note the 'meN-' prefix forming active verbs — langgar→melanggar (violate), laku→melakukan (carry out), modifikasi→memodifikasi (modify). VN speakers often DROP this prefix in speech; keep it in formal/written register. 'Kena + noun' = to get hit with (kena tilang = to get fined). 'Wajib' = obligatory (stronger than 'harus'). 'Demi + noun' = for the sake of.",
    vocabulary: [
      {
        cell_id: "145aef2f-3171-470f-b13b-323a6d770741",
        word: "pengendara",
        en: "rider / driver",
        vi: "người lái",
        pos: "noun",
        pronunciation_vi: "peu-ngen-DA-ra",
        pronunciation_en: "pe-ngen-DA-ra",
      },
      {
        cell_id: "bc428fc1-3a32-4429-a74f-4db28188a1ea",
        word: "SIM",
        en: "driver's license",
        vi: "bằng lái xe",
        pos: "noun (abbreviation)",
        pronunciation_vi: "sim",
        pronunciation_en: "sim",
      },
      {
        cell_id: "dcabbd6a-4572-4ace-9408-b034ce5d3493",
        word: "STNK",
        en: "vehicle registration certificate",
        vi: "giấy đăng ký xe",
        pos: "noun (abbreviation)",
        pronunciation_vi: "és-té-én-ka",
        pronunciation_en: "es-teh-en-ka",
      },
      {
        cell_id: "d8f2af5f-dc39-4bdc-bd12-104b8928a42a",
        word: "tilang",
        en: "traffic ticket / fine",
        vi: "biên bản phạt giao thông",
        pos: "noun",
        pronunciation_vi: "TI-lang",
        pronunciation_en: "TEE-lang",
      },
      {
        cell_id: "81c70702-730b-4d0e-9e53-8ce6db97fe83",
        word: "melanggar",
        en: "to violate / run (a rule)",
        vi: "vi phạm / vượt (luật)",
        pos: "verb",
        pronunciation_vi: "meu-LANG-gar",
        pronunciation_en: "me-LANG-gar",
      },
      {
        cell_id: "b6b69705-9848-44fa-bdf3-fafab191b510",
        word: "razia",
        en: "police checkpoint / raid",
        vi: "chốt kiểm tra",
        pos: "noun",
        pronunciation_vi: "RA-zi-a",
        pronunciation_en: "RA-zee-a",
      },
      {
        cell_id: "e4911a2c-6805-4941-8293-504676ef1a16",
        word: "modifikasi",
        en: "modification (of a vehicle)",
        vi: "độ xe / chỉnh sửa",
        pos: "noun",
        pronunciation_vi: "mô-di-fi-KA-si",
        pronunciation_en: "mo-dee-fee-KA-see",
      },
      {
        cell_id: "2a93977d-0a44-480e-84d7-ebdbab597e1f",
        word: "keselamatan",
        en: "safety",
        vi: "sự an toàn",
        pos: "noun",
        pronunciation_vi: "keu-seu-la-MA-tan",
        pronunciation_en: "ke-se-la-MA-tan",
      },
    ],
    dialogue: [
      {
        cell_id: "c89ce1ac-6832-4768-b015-26bd17ed138d",
        speaker: "Rio",
        text: "Tadi pagi ada razia di perempatan, banyak yang kena tilang.",
        vi: "Sáng nay có chốt kiểm tra ở ngã tư, nhiều người bị phạt.",
        en: "There was a checkpoint at the intersection this morning, lots of people got fined.",
      },
      {
        cell_id: "ccc50e4c-5078-416c-9d43-1605e6438491",
        speaker: "Dina",
        text: "Mereka melanggar apa? Lampu merah?",
        vi: "Họ vi phạm gì vậy? Vượt đèn đỏ à?",
        en: "What did they violate? Running a red light?",
      },
      {
        cell_id: "d9af904b-b94c-451b-a291-d2a393903717",
        speaker: "Rio",
        text: "Ada yang nggak bawa STNK, ada yang motornya dimodifikasi berlebihan.",
        vi: "Có người không mang giấy đăng ký xe, có người độ xe quá đà.",
        en: "Some didn't carry the STNK, some had over-modified bikes.",
      },
      {
        cell_id: "54e4f4d0-57fa-4802-8263-e6b1318834df",
        speaker: "Dina",
        text: "Makanya, demi keselamatan, sebaiknya jangan ngebut dan lengkapi surat.",
        vi: "Vậy đó, vì an toàn, tốt nhất đừng phóng nhanh và mang đủ giấy tờ.",
        en: "Exactly — for safety's sake, better not to speed and keep your papers complete.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ luật giao thông còn thiếu:",
        instruction_en: "Fill in the missing traffic-rule word:",
        items: [
          {
            prompt: "Pengendara motor wajib punya ___. (bằng lái)",
            answer: "SIM",
            options: ["SIM", "STNK", "KTP"],
          },
          {
            prompt: "Kalau melanggar lampu merah, bisa kena ___. (phạt)",
            answer: "tilang",
            options: ["tilang", "tiket", "tilam"],
          },
          {
            prompt: "Polisi sering melakukan ___ di pagi hari. (chốt kiểm tra)",
            answer: "razia",
            options: ["razia", "rapat", "rabat"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "tilang", answer: "biên bản phạt" },
          { prompt: "melanggar", answer: "vi phạm" },
          { prompt: "modifikasi", answer: "độ xe" },
          { prompt: "keselamatan", answer: "sự an toàn" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Người lái xe máy bắt buộc phải có bằng lái và mang theo giấy đăng ký xe.", answer: "Pengendara motor wajib punya SIM dan membawa STNK." },
          { prompt: "Nếu vượt đèn đỏ, có thể bị phạt.", answer: "Kalau melanggar lampu merah, bisa kena tilang." },
          { prompt: "Vì sự an toàn, tốt nhất đừng phóng nhanh.", answer: "Demi keselamatan, sebaiknya jangan ngebut." },
        ],
      },
    ],
  },
];

export default motorcycleCultureLessons;
