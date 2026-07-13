// src/languages/indonesian/extra/farewell-homesick.ts
//
// Farewell & Homesickness pack for Vietnamese learners of Indonesian.
// The emotional vocabulary of living far from home: rindu/kangen (missing),
// kangen kampung (missing your hometown), mudik & pulang for Lebaran, staying
// in touch by video call, and — written specifically for Vietnamese learners —
// celebrating Vietnamese Tết while living in Indonesia.
//
// Vietnamese-first: every line carries a `vi` gloss; `pronunciation_focus`
// holds the Vietnamese-facing pronunciation/grammar note (incl. the predictable
// Vietnamese-speaker mistake = L1 note), and `pronunciation_focus_en` is the
// English-speaker companion (same order). This pack leans into the Vietnamese
// experience of homesickness abroad — the emotions map almost one-to-one.
//
// Self-contained inline types (mirrors the sibling extra packs); swap for a
// shared import when src/languages/indonesian/lessons.ts lands.

export type LessonSentence = {
  en: string; // Indonesian target line
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

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
  // 1. Rindu & kangen — missing someone
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_farewell_rindu_kangen",
    level: "A2",
    category: "homesick",
    title_vi: "Rindu & kangen — nhớ nhung",
    title_en: "Rindu & kangen — missing someone",
    sentences: [
      {
        en: "Aku kangen banget sama keluarga di kampung.",
        vi: "Tớ nhớ gia đình ở quê lắm.",
        pronunciation_focus: [
          "kangen → KA-ngen = nhớ (thân mật); 'ng' giữa từ",
          "banget → BA-nget = lắm, rất (gaul của 'sangat')",
          "sama → SA-ma = với (gaul của 'dengan')",
          "kampung → kam-PUNG = quê, làng; 'ng' cuối",
        ],
        pronunciation_focus_en: [
          "kangen → 'KAH-ngen' = to miss (casual); medial 'ng'",
          "banget → 'BAH-nget' = very (slang for 'sangat')",
          "sama → 'SAH-mah' = with (slang for 'dengan')",
          "kampung → 'kam-POONG' = hometown/village; final 'ng'",
        ],
      },
      {
        en: "Sudah lama saya tidak pulang, rindu rumah.",
        vi: "Đã lâu rồi tôi không về nhà, nhớ nhà.",
        pronunciation_focus: [
          "rindu → RIN-du = nhớ (trang trọng hơn 'kangen')",
          "pulang → pu-LANG = về nhà; 'ng' cuối",
          "sudah lama → SU-dah LA-ma = đã lâu rồi",
          "rumah → RU-mah = nhà; 'h' cuối thở nhẹ",
        ],
        pronunciation_focus_en: [
          "rindu → 'RIN-doo' = to miss/long for (more formal than 'kangen')",
          "pulang → 'poo-LANG' = to go home; final 'ng'",
          "sudah lama → 'SOO-dah LAH-mah' = it's been a long time",
          "rumah → 'ROO-mah' = home; soft final 'h'",
        ],
      },
      {
        en: "Aku kangen masakan ibu, tidak ada yang seenak itu.",
        vi: "Tớ nhớ món mẹ nấu, không gì ngon bằng.",
        pronunciation_focus: [
          "masakan → ma-SA-kan = món ăn (masak + -an)",
          "ibu → I-bu = mẹ",
          "tidak ada → TI-dak A-da = không có",
          "seenak → se-E-nak = ngon bằng (se- + enak)",
        ],
        pronunciation_focus_en: [
          "masakan → 'mah-SAH-kan' = cooking/dishes (masak + -an)",
          "ibu → 'EE-boo' = mother",
          "tidak ada → 'TEE-dak AH-dah' = there isn't",
          "seenak → 'suh-EH-nak' = as tasty as (se- + enak)",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia có hai từ chính cho 'nhớ': 'rindu' (trang trọng, sâu lắng, hay dùng trong văn thơ, bài hát) và 'kangen' (thân mật, đời thường, dùng hằng ngày). Cả hai đều gần như đồng nghĩa với 'nhớ' của tiếng Việt — cảm xúc rất tương đồng nên người Việt cảm nhận ngay. Cấu trúc: 'kangen/rindu sama X' hoặc 'kangen/rindu X' (nhớ X). Đặc biệt 'kangen kampung halaman' (nhớ quê hương) là cụm cảm xúc rất Indonesia — nỗi nhớ quê là chủ đề lớn trong văn hóa vì hàng triệu người rời quê lên thành phố làm việc ('merantau'). Người Việt xa quê sẽ thấy đồng cảm sâu sắc. Lưu ý: 'kangen' không có dạng trang trọng — trong văn bản chính thức dùng 'rindu' hoặc 'merindukan'.",
    cultural_notes_en:
      "Indonesian has two main words for 'to miss': 'rindu' (formal, deep, common in poetry and songs) and 'kangen' (casual, everyday). Both map almost exactly onto Vietnamese 'nhớ' — the emotion transfers instantly. Structure: 'kangen/rindu sama X' or 'kangen/rindu X' (to miss X). The phrase 'kangen kampung halaman' (missing one's hometown) is deeply Indonesian — homesickness is a huge cultural theme because millions leave home to work in cities ('merantau'). Vietnamese learners far from home will relate strongly. Note: 'kangen' has no formal form — in official writing use 'rindu' or 'merindukan'.",
    tip_advice_vi:
      "Hai nấc: 'kangen' (thân mật, nói hằng ngày) vs 'rindu' (trang trọng, văn thơ). Cấu trúc 'kangen sama X' = nhớ X. 'ng' giữa/cuối từ (kangen, pulang, kampung) rất nhiều — lợi thế người Việt. Cụm cảm xúc vàng: 'kangen kampung halaman' (nhớ quê hương). Phân biệt 'pulang' (về nhà/quê) với 'kembali' (quay lại nói chung).",
    tip_advice_en:
      "Two tiers: 'kangen' (casual, daily) vs 'rindu' (formal, poetic). Structure 'kangen sama X' = to miss X. Lots of medial/final 'ng' (kangen, pulang, kampung) — a Vietnamese advantage. Gold phrase: 'kangen kampung halaman' (missing one's hometown). Distinguish 'pulang' (go home) from 'kembali' (return, general).",
    vocabulary: [
      { cell_id: "b7dc4c05-1a70-48f2-8b77-27afcad97965", word: "rindu", en: "to miss, long for (formal)", vi: "nhớ (trang trọng)", pos: "verb/adjective", pronunciation_vi: "RIN-du", pronunciation_en: "RIN-doo" },
      { cell_id: "b54be5b3-f2c2-497f-b2d6-a47f5ef23784", word: "kangen", en: "to miss (casual)", vi: "nhớ (thân mật)", pos: "verb", pronunciation_vi: "KA-ngen", pronunciation_en: "KAH-ngen" },
      { cell_id: "e28f74ce-cf65-4e9c-827a-b051aadb640c", word: "pulang", en: "to go home", vi: "về nhà, về quê", pos: "verb", pronunciation_vi: "pu-LANG", pronunciation_en: "poo-LANG" },
      { cell_id: "8f351fcd-3bf6-4e48-b2e7-cbb91a64a11f", word: "kampung halaman", en: "hometown", vi: "quê hương", pos: "noun phrase", pronunciation_vi: "kam-PUNG ha-LA-man", pronunciation_en: "kam-POONG hah-LAH-man" },
      { cell_id: "7582af2a-0fd0-4177-88d0-dfd6f8f248c5", word: "merantau", en: "to leave home to seek a living", vi: "tha hương lập nghiệp", pos: "verb", pronunciation_vi: "me-ran-TAU", pronunciation_en: "muh-ran-TAU" },
      { cell_id: "a6d618ba-eed0-441f-8412-95a888b31951", word: "masakan", en: "cooking, home dishes", vi: "món ăn (nhà nấu)", pos: "noun", pronunciation_vi: "ma-SA-kan", pronunciation_en: "mah-SAH-kan" },
    ],
    dialogue: [
      { cell_id: "e436a1c1-708b-47d7-b7cb-36fbbd13128c", speaker: "Linh", text: "Kamu kelihatan sedih. Kenapa?", vi: "Trông cậu buồn. Sao thế?", en: "You look sad. What's wrong?" },
      { cell_id: "3cff4a5d-7896-4525-85fa-69dc55145932", speaker: "Putri", text: "Aku kangen rumah. Sudah setahun nggak pulang.", vi: "Tớ nhớ nhà. Cả năm rồi chưa về.", en: "I miss home. I haven't gone back in a year." },
      { cell_id: "9959b996-7fce-4946-a972-8b1dc3e76ba2", speaker: "Linh", text: "Aku ngerti banget. Aku juga kangen kampung halaman.", vi: "Tớ hiểu lắm. Tớ cũng nhớ quê hương.", en: "I totally understand. I miss my hometown too." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "kangen", answer: "nhớ (thân mật)" },
          { prompt: "rindu", answer: "nhớ (trang trọng)" },
          { prompt: "pulang", answer: "về nhà/quê" },
          { prompt: "kampung halaman", answer: "quê hương" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Mudik & pulang for Lebaran
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_farewell_mudik_lebaran",
    level: "B1",
    category: "homesick",
    title_vi: "Mudik & về quê dịp Lebaran",
    title_en: "Mudik & going home for Lebaran",
    sentences: [
      {
        en: "Setiap Lebaran, saya selalu mudik ke kampung.",
        vi: "Mỗi dịp Lebaran, tôi luôn về quê.",
        pronunciation_focus: [
          "setiap → se-TI-ap = mỗi",
          "Lebaran → le-BA-ran = lễ Idul Fitri (Tết của người Hồi giáo)",
          "selalu → se-LA-lu = luôn luôn",
          "mudik → MU-dik = về quê dịp lễ (từ đặc trưng)",
        ],
        pronunciation_focus_en: [
          "setiap → 'suh-TEE-ap' = every",
          "Lebaran → 'luh-BAH-ran' = Eid al-Fitr (the Muslim festival)",
          "selalu → 'suh-LAH-loo' = always",
          "mudik → 'MOO-dik' = the holiday homecoming (a special word)",
        ],
      },
      {
        en: "Tiket kereta sudah habis, jadi saya naik bus.",
        vi: "Vé tàu hết rồi, nên tôi đi xe buýt.",
        pronunciation_focus: [
          "tiket → TI-ket = vé",
          "kereta → ke-RE-ta = tàu hỏa",
          "habis → HA-bis = hết",
          "naik bus → NA-ik BUS = đi xe buýt",
        ],
        pronunciation_focus_en: [
          "tiket → 'TEE-ket' = ticket",
          "kereta → 'kuh-REH-tah' = train",
          "habis → 'HAH-bis' = sold out/finished",
          "naik bus → 'NAH-ik BOOS' = to take the bus",
        ],
      },
      {
        en: "Senang sekali bisa berkumpul dengan keluarga lagi.",
        vi: "Vui lắm khi được tụ họp với gia đình lần nữa.",
        pronunciation_focus: [
          "senang → se-NANG = vui, hạnh phúc; 'ng' cuối",
          "berkumpul → ber-KUM-pul = tụ họp (ber- + kumpul)",
          "keluarga → ke-lu-AR-ga = gia đình",
          "lagi → LA-gi = lại, lần nữa",
        ],
        pronunciation_focus_en: [
          "senang → 'suh-NANG' = happy/glad; final 'ng'",
          "berkumpul → 'ber-KOOM-pool' = to gather (ber- + kumpul)",
          "keluarga → 'kuh-loo-AR-gah' = family",
          "lagi → 'LAH-gee' = again",
        ],
      },
    ],
    cultural_notes_vi:
      "'Mudik' là cuộc về quê hằng năm dịp Lebaran (Idul Fitri) — gần giống 'về quê ăn Tết' của người Việt. Hàng chục triệu người rời thành phố lớn (Jakarta, Surabaya) về quê cùng lúc, tạo nên một trong những cuộc di cư lớn nhất thế giới. Vé tàu xe ('tiket') bán hết trước hàng tháng; đường cao tốc kẹt cứng hàng ngày. Cảm xúc cốt lõi của mudik là nỗi mong được 'berkumpul' (tụ họp) với gia đình sau cả năm xa cách — cảm giác mà người Việt hiểu rất rõ qua không khí Tết. Khi nói chuyện với người Indonesia dịp này, câu hỏi thân mật là 'Mudik ke mana?' (Về quê ở đâu?). Người Việt có thể chia sẻ: 'Di Vietnam, kami juga mudik saat Tết' (Ở Việt Nam, chúng tôi cũng về quê dịp Tết).",
    cultural_notes_en:
      "'Mudik' is the annual homecoming for Lebaran (Idul Fitri) — much like Vietnamese 'về quê ăn Tết'. Tens of millions leave big cities (Jakarta, Surabaya) for their hometowns at once, one of the world's largest migrations. Transport tickets ('tiket') sell out months ahead; highways jam for days. The core emotion of mudik is the longing to 'berkumpul' (gather) with family after a year apart — a feeling Vietnamese learners know well from Tết. A friendly question this season is 'Mudik ke mana?' (Where are you heading home to?). Vietnamese learners can share: 'Di Vietnam, kami juga mudik saat Tết' (In Vietnam, we also go home for Tết).",
    tip_advice_vi:
      "'mudik' = về quê dịp lễ (không có từ tiếng Anh tương đương). So sánh nhanh với người Việt: mudik = về quê ăn Tết. Động từ di chuyển dùng 'naik' (đi bằng phương tiện): naik bus, naik kereta, naik pesawat. 'berkumpul' (tụ họp) là cảm xúc trung tâm. Câu bắt chuyện: 'Mudik ke mana?'.",
    tip_advice_en:
      "'mudik' = the holiday homecoming (no English equivalent). Quick map for Vietnamese: mudik = going home for Tết. Transport verb 'naik' (to ride/take): naik bus, naik kereta, naik pesawat. 'berkumpul' (gather) is the central emotion. Icebreaker: 'Mudik ke mana?'.",
    vocabulary: [
      { cell_id: "f1f91dc9-eea2-42ca-8e6b-b696657074bf", word: "mudik", en: "holiday homecoming", vi: "về quê dịp lễ", pos: "verb/noun", pronunciation_vi: "MU-dik", pronunciation_en: "MOO-dik" },
      { cell_id: "e9c7b2fb-d41a-4355-bbb2-639d386f33af", word: "Lebaran", en: "Eid al-Fitr festival", vi: "lễ Idul Fitri", pos: "noun", pronunciation_vi: "le-BA-ran", pronunciation_en: "luh-BAH-ran" },
      { cell_id: "68df24e1-4996-4aa2-aeae-077e3164888b", word: "tiket", en: "ticket", vi: "vé", pos: "noun", pronunciation_vi: "TI-ket", pronunciation_en: "TEE-ket" },
      { cell_id: "cbef3e6b-1a6b-46e1-9688-bdf6c9bbf027", word: "kereta", en: "train", vi: "tàu hỏa", pos: "noun", pronunciation_vi: "ke-RE-ta", pronunciation_en: "kuh-REH-tah" },
      { cell_id: "5f68af3c-1a2f-47ce-b90f-a7ab8d7c7d13", word: "berkumpul", en: "to gather", vi: "tụ họp", pos: "verb", pronunciation_vi: "ber-KUM-pul", pronunciation_en: "ber-KOOM-pool" },
      { cell_id: "4db157d9-fcc6-4f60-a303-393aa672ef6f", word: "senang", en: "happy, glad", vi: "vui", pos: "adjective", pronunciation_vi: "se-NANG", pronunciation_en: "suh-NANG" },
    ],
    dialogue: [
      { cell_id: "8bcc740e-1ab2-4ce8-a204-a02c93a92558", speaker: "Rudi", text: "Lebaran ini mudik nggak?", vi: "Lebaran này về quê không?", en: "Are you heading home this Eid?" },
      { cell_id: "3a91f635-4432-44e0-8d70-8bba6a2f4be7", speaker: "Sani", text: "Mudik dong! Tapi tiket kereta udah habis, naik bus deh.", vi: "Về chứ! Nhưng vé tàu hết rồi, đi xe buýt vậy.", en: "Of course! But the train's sold out, so I'll take the bus." },
      { cell_id: "8e6b7abe-19dd-4949-9b23-ff63c842018e", speaker: "Rudi", text: "Hati-hati ya. Salam buat keluarga!", vi: "Cẩn thận nhé. Cho gửi lời chào gia đình!", en: "Take care. Say hi to your family!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          { prompt: "Setiap Lebaran saya ___ ke kampung. (về quê)", answer: "mudik", options: ["mudik", "pergi", "pindah"] },
          { prompt: "Senang bisa ___ dengan keluarga. (tụ họp)", answer: "berkumpul", options: ["berkumpul", "berpisah", "bekerja"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. Staying in touch — video call & messaging
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_farewell_video_call",
    level: "A2",
    category: "homesick",
    title_vi: "Giữ liên lạc — gọi video và nhắn tin",
    title_en: "Staying in touch — video call & messaging",
    sentences: [
      {
        en: "Setiap minggu saya video call dengan orang tua.",
        vi: "Mỗi tuần tôi gọi video với bố mẹ.",
        pronunciation_focus: [
          "video call → VI-de-o KOL = gọi video (mượn tiếng Anh)",
          "setiap minggu → se-TI-ap MING-gu = mỗi tuần",
          "orang tua → O-rang TU-a = bố mẹ (nghĩa đen 'người già')",
          "dengan → de-NGAN = với; 'ng' giữa từ",
        ],
        pronunciation_focus_en: [
          "video call → 'VEE-deh-oh KOL' = video call (English borrowing)",
          "setiap minggu → 'suh-TEE-ap MING-goo' = every week",
          "orang tua → 'OH-rang TOO-ah' = parents (literally 'old people')",
          "dengan → 'duh-NGAN' = with; medial 'ng'",
        ],
      },
      {
        en: "Kalau kangen, aku langsung telepon mama.",
        vi: "Khi nào nhớ, tớ gọi điện ngay cho mẹ.",
        pronunciation_focus: [
          "kalau → KA-lau = nếu, khi nào",
          "langsung → LANG-sung = ngay, trực tiếp; 'ng' hai lần",
          "telepon → te-le-PON = gọi điện thoại",
          "mama → MA-ma = mẹ (thân mật)",
        ],
        pronunciation_focus_en: [
          "kalau → 'KAH-lau' = if/when",
          "langsung → 'LANG-soong' = right away/directly; 'ng' twice",
          "telepon → 'tuh-luh-PON' = to phone",
          "mama → 'MAH-mah' = mum (affectionate)",
        ],
      },
      {
        en: "Kami sering kirim foto lewat WhatsApp biar tetap dekat.",
        vi: "Bọn tớ hay gửi ảnh qua WhatsApp để vẫn gần gũi.",
        pronunciation_focus: [
          "kirim → KI-rim = gửi",
          "lewat → LE-wat = qua, thông qua",
          "biar → BI-ar = để cho (gaul của 'supaya/agar')",
          "tetap dekat → te-TAP DE-kat = vẫn gần gũi",
        ],
        pronunciation_focus_en: [
          "kirim → 'KEE-rim' = to send",
          "lewat → 'LEH-wat' = via/through",
          "biar → 'BEE-ar' = so that (slang for 'supaya/agar')",
          "tetap dekat → 'tuh-TAP DUH-kat' = to stay close",
        ],
      },
    ],
    cultural_notes_vi:
      "Với người sống xa nhà, công nghệ là cứu cánh. Ở Indonesia, 'WhatsApp' (gọi tắt 'WA', đọc 'we-a') là ứng dụng nhắn tin phổ biến nhất — gần như ai cũng dùng, kể cả ông bà. 'Video call' (gọi video) giúp gặp mặt gia đình ở quê. Nhiều từ mượn tiếng Anh trực tiếp: video call, chat, online. Người Việt xa quê sẽ thấy y hệt trải nghiệm của mình (Zalo, Messenger, gọi video về cho bố mẹ). Lưu ý từ chỉ bố mẹ: trang trọng là 'orang tua' (nghĩa đen 'người già'), thân mật là 'mama/papa', hoặc 'ibu/bapak' (mẹ/bố). Cụm cảm xúc: 'biar tetap dekat' (để vẫn gần gũi dù xa cách).",
    cultural_notes_en:
      "For those living far from home, technology is a lifeline. In Indonesia, 'WhatsApp' (shortened to 'WA', said 'weh-ah') is the most popular messaging app — almost everyone uses it, even grandparents. 'Video call' lets you see family back home. Many terms borrow English directly: video call, chat, online. Vietnamese learners abroad will recognise their own experience (Zalo, Messenger, video-calling parents). Note words for parents: formal is 'orang tua' (literally 'old people'), affectionate is 'mama/papa', or 'ibu/bapak' (mum/dad). Emotional phrase: 'biar tetap dekat' (to stay close despite the distance).",
    tip_advice_vi:
      "'orang tua' = bố mẹ (đừng dịch sát 'người già'). 'langsung' (ngay/trực tiếp) có 'ng' hai lần — đọc rõ. 'biar' = 'supaya/agar' (để cho) trong văn nói. WhatsApp gọi tắt 'WA' (we-a). Câu hữu ích: 'Aku video call orang tua tiap minggu' (Tớ gọi video bố mẹ mỗi tuần).",
    tip_advice_en:
      "'orang tua' = parents (don't translate literally as 'old people'). 'langsung' (right away) has two 'ng' — pronounce them clearly. 'biar' = 'supaya/agar' (so that) in speech. WhatsApp is shortened to 'WA' (weh-ah). Useful line: 'Aku video call orang tua tiap minggu'.",
    vocabulary: [
      { cell_id: "a0687056-4fba-4df1-b74e-0bb09cf5546a", word: "video call", en: "video call", vi: "gọi video", pos: "noun/verb", pronunciation_vi: "VI-de-o KOL", pronunciation_en: "VEE-deh-oh KOL" },
      { cell_id: "c86ad842-bb17-4ac4-94be-327cbb3559e6", word: "telepon", en: "to phone / telephone", vi: "gọi điện / điện thoại", pos: "verb/noun", pronunciation_vi: "te-le-PON", pronunciation_en: "tuh-luh-PON" },
      { cell_id: "2d270e2f-3331-476b-ab8b-defb0972fca7", word: "kirim", en: "to send", vi: "gửi", pos: "verb", pronunciation_vi: "KI-rim", pronunciation_en: "KEE-rim" },
      { cell_id: "2fc2bb24-00ff-454e-965a-aacb3d9b2009", word: "orang tua", en: "parents", vi: "bố mẹ", pos: "noun phrase", pronunciation_vi: "O-rang TU-a", pronunciation_en: "OH-rang TOO-ah" },
      { cell_id: "fb4928d0-2ba7-4b4c-9584-2dfa54575420", word: "kabar", en: "news, how one is", vi: "tin tức, tình hình", pos: "noun", pronunciation_vi: "KA-bar", pronunciation_en: "KAH-bar" },
      { cell_id: "d646ac30-5f4b-4fe4-9a5b-f2d1756b7aed", word: "tetap dekat", en: "to stay close", vi: "vẫn gần gũi", pos: "verb phrase", pronunciation_vi: "te-TAP DE-kat", pronunciation_en: "tuh-TAP DUH-kat" },
    ],
    dialogue: [
      { cell_id: "a2d6dafb-fa37-4b4e-805e-06fa3948f83d", speaker: "Mama", text: "Halo Nak, apa kabar? Sehat di sana?", vi: "Alô con, khỏe không? Ở đó ổn chứ?", en: "Hi dear, how are you? Keeping well there?" },
      { cell_id: "fe1581e4-f0b3-4352-9523-e0dde2dee184", speaker: "Anak", text: "Sehat, Ma. Aku kangen masakan Mama. Video call gini bikin lega.", vi: "Khỏe ạ, mẹ. Con nhớ món mẹ nấu. Gọi video thế này thấy đỡ hẳn.", en: "I'm well, Mum. I miss your cooking. This video call makes me feel better." },
      { cell_id: "fe0227c5-b3a8-498e-826a-091b00e277d9", speaker: "Mama", text: "Iya, biar tetap dekat ya. Jaga diri baik-baik.", vi: "Ừ, để vẫn gần gũi nhé. Giữ gìn sức khỏe.", en: "Yes, to stay close. Take good care of yourself." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Mỗi tuần tôi gọi video với bố mẹ.", answer: "Setiap minggu saya video call dengan orang tua." },
          { prompt: "Khi nào nhớ, tớ gọi điện ngay cho mẹ.", answer: "Kalau kangen, aku langsung telepon mama." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Saying goodbye — farewells
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_farewell_perpisahan",
    level: "A2",
    category: "homesick",
    title_vi: "Lời tạm biệt — chia tay",
    title_en: "Saying goodbye — farewells",
    sentences: [
      {
        en: "Selamat tinggal, jaga diri baik-baik ya.",
        vi: "Tạm biệt nhé, giữ gìn sức khỏe nha.",
        pronunciation_focus: [
          "selamat tinggal → se-LA-mat TING-gal = tạm biệt (người ở lại nói khi người kia đi)",
          "jaga diri → JA-ga DI-ri = giữ gìn bản thân",
          "baik-baik → BA-ik BA-ik = cẩn thận, tử tế (từ lặp)",
          "'selamat jalan' = người ở lại chúc người đi (thượng lộ bình an)",
        ],
        pronunciation_focus_en: [
          "selamat tinggal → 'suh-LAH-mat TING-gal' = goodbye (said by the one leaving)",
          "jaga diri → 'JAH-gah DEE-ree' = take care of yourself",
          "baik-baik → 'BAH-ik BAH-ik' = carefully, well (reduplication)",
          "'selamat jalan' = said TO the one leaving (safe journey)",
        ],
      },
      {
        en: "Sampai jumpa lagi, semoga cepat ketemu.",
        vi: "Hẹn gặp lại, mong sớm gặp nhau.",
        pronunciation_focus: [
          "sampai jumpa → sam-PAI JUM-pa = hẹn gặp lại",
          "lagi → LA-gi = lần nữa, lại",
          "semoga → se-MO-ga = mong rằng, cầu chúc",
          "ketemu → ke-TE-mu = gặp (gaul của 'bertemu')",
        ],
        pronunciation_focus_en: [
          "sampai jumpa → 'sam-PAI JOOM-pah' = see you (again)",
          "lagi → 'LAH-gee' = again",
          "semoga → 'suh-MOH-gah' = hopefully/may it be that",
          "ketemu → 'kuh-TUH-moo' = to meet (slang for 'bertemu')",
        ],
      },
      {
        en: "Terima kasih untuk semuanya, aku akan merindukanmu.",
        vi: "Cảm ơn vì tất cả, tớ sẽ nhớ cậu.",
        pronunciation_focus: [
          "terima kasih → te-RI-ma KA-sih = cảm ơn",
          "semuanya → se-mu-A-nya = tất cả mọi thứ; 'ny' = 'nh'",
          "akan → A-kan = sẽ (dấu hiệu tương lai)",
          "merindukanmu → me-rin-DU-kan-mu = sẽ nhớ cậu (merindukan + -mu)",
        ],
        pronunciation_focus_en: [
          "terima kasih → 'tuh-REE-mah KAH-see' = thank you",
          "semuanya → 'suh-moo-AH-nyah' = everything; 'ny' = ñ",
          "akan → 'AH-kan' = will (future marker)",
          "merindukanmu → 'muh-rin-DOO-kan-moo' = will miss you (merindukan + -mu)",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia phân biệt rõ HAI lời tạm biệt mà người Việt hay nhầm: 'selamat tinggal' (người ĐANG ĐI nói với người Ở LẠI, nghĩa đen 'chúc ở lại bình an') và 'selamat jalan' (người Ở LẠI nói với người ĐANG ĐI, 'thượng lộ bình an'). Nói sai sẽ ngược vai. Lời nhẹ nhàng hằng ngày là 'sampai jumpa' (hẹn gặp lại) hoặc 'dadah/dah' (bye bye, thân mật). 'akan merindukanmu' (sẽ nhớ bạn) là câu chia tay tình cảm — 'merindukan' là dạng trang trọng của 'rindu', thêm '-mu' (bạn) thành 'nhớ bạn'. Người Việt sẽ thấy quen với cảm xúc chia tay sân bay/bến xe. Cụm an ủi: 'jaga diri baik-baik' (giữ gìn sức khỏe).",
    cultural_notes_en:
      "Indonesian clearly distinguishes TWO goodbyes that Vietnamese learners often mix up: 'selamat tinggal' (said by the one LEAVING to those STAYING, literally 'stay safe') and 'selamat jalan' (said by those STAYING to the one LEAVING, 'safe journey'). Reversing them swaps the roles. The light everyday farewell is 'sampai jumpa' (see you) or 'dadah/dah' (bye-bye, casual). 'akan merindukanmu' (will miss you) is the emotional farewell — 'merindukan' is the formal form of 'rindu', plus '-mu' (you) = 'miss you'. Vietnamese learners will recognise the airport/station farewell emotions. Comfort phrase: 'jaga diri baik-baik' (take good care).",
    tip_advice_vi:
      "QUY TẮC vàng: 'selamat tinggal' = người ĐI nói; 'selamat jalan' = người Ở LẠI nói. Đừng nhầm! Nhẹ nhàng: 'sampai jumpa', 'dah'. Hậu tố '-mu' = 'bạn/của bạn': merindukanmu (nhớ bạn). 'ny' = 'nh': semuanya. 'akan' = sẽ (tương lai).",
    tip_advice_en:
      "GOLDEN rule: 'selamat tinggal' = said by the one LEAVING; 'selamat jalan' = said by those STAYING. Don't mix them! Casual: 'sampai jumpa', 'dah'. The '-mu' suffix = 'you/your': merindukanmu (miss you). 'ny' = ñ: semuanya. 'akan' = will (future).",
    vocabulary: [
      { cell_id: "f34d1f22-619b-483d-af84-559f0796e554", word: "selamat tinggal", en: "goodbye (said by the leaver)", vi: "tạm biệt (người đi nói)", pos: "phrase", pronunciation_vi: "se-LA-mat TING-gal", pronunciation_en: "suh-LAH-mat TING-gal" },
      { cell_id: "0e6b34ed-587f-4720-b52f-8ec23f915a53", word: "selamat jalan", en: "safe journey (said to the leaver)", vi: "thượng lộ bình an", pos: "phrase", pronunciation_vi: "se-LA-mat JA-lan", pronunciation_en: "suh-LAH-mat JAH-lan" },
      { cell_id: "f2d703f1-b444-4149-9665-7d43c370927c", word: "sampai jumpa", en: "see you again", vi: "hẹn gặp lại", pos: "phrase", pronunciation_vi: "sam-PAI JUM-pa", pronunciation_en: "sam-PAI JOOM-pah" },
      { cell_id: "77c214d8-2eb7-458d-8dde-9f751da822a8", word: "jaga diri", en: "take care of yourself", vi: "giữ gìn sức khỏe", pos: "phrase", pronunciation_vi: "JA-ga DI-ri", pronunciation_en: "JAH-gah DEE-ree" },
      { cell_id: "f6f75a12-9942-4321-90f8-f4b5ab2ce870", word: "semoga", en: "hopefully, may", vi: "mong rằng, cầu chúc", pos: "adverb", pronunciation_vi: "se-MO-ga", pronunciation_en: "suh-MOH-gah" },
      { cell_id: "3b312bb9-9465-4c45-99de-d9981c56ae71", word: "merindukan", en: "to miss (formal, transitive)", vi: "nhớ (trang trọng)", pos: "verb", pronunciation_vi: "me-rin-DU-kan", pronunciation_en: "muh-rin-DOO-kan" },
    ],
    dialogue: [
      { cell_id: "9ed315d1-1ec8-450b-ae6e-c3dc3d31c28b", speaker: "Teman", text: "Besok kamu balik ke Vietnam ya? Selamat jalan.", vi: "Mai cậu về Việt Nam à? Thượng lộ bình an.", en: "You're flying back to Vietnam tomorrow? Safe journey." },
      { cell_id: "a63c3b32-63ce-4d3c-bca6-bc73474768b2", speaker: "Kamu", text: "Iya. Selamat tinggal, terima kasih untuk semuanya.", vi: "Ừ. Tạm biệt nhé, cảm ơn vì tất cả.", en: "Yes. Goodbye, thank you for everything." },
      { cell_id: "2fd1d72d-ab91-45f7-a6a0-ec14ed9b07f8", speaker: "Teman", text: "Sampai jumpa lagi! Jaga diri baik-baik.", vi: "Hẹn gặp lại! Giữ gìn sức khỏe.", en: "See you again! Take good care." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn lời tạm biệt đúng vai:",
        instruction_en: "Choose the right goodbye for the role:",
        items: [
          { prompt: "(người ĐI nói) ___, semuanya!", answer: "Selamat tinggal", options: ["Selamat tinggal", "Selamat jalan"] },
          { prompt: "(người Ở LẠI nói) ___, hati-hati di jalan!", answer: "Selamat jalan", options: ["Selamat jalan", "Selamat tinggal"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. Vietnamese Tết while living in Indonesia
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_farewell_tet_di_indonesia",
    level: "B1",
    category: "homesick",
    title_vi: "Đón Tết Việt khi sống ở Indonesia",
    title_en: "Celebrating Vietnamese Tết in Indonesia",
    sentences: [
      {
        en: "Tahun ini saya merayakan Tet sendirian di Jakarta.",
        vi: "Năm nay tôi đón Tết một mình ở Jakarta.",
        pronunciation_focus: [
          "merayakan → me-ra-YA-kan = đón mừng, ăn mừng (meN- + raya + -kan)",
          "Tet → đọc như tiếng Việt; người Indonesia gọi 'Imlek Vietnam' nếu cần giải thích",
          "sendirian → sen-di-RI-an = một mình",
          "tahun ini → TA-hun I-ni = năm nay",
        ],
        pronunciation_focus_en: [
          "merayakan → 'muh-rah-YAH-kan' = to celebrate (meN- + raya + -kan)",
          "Tet → say it as in Vietnamese; explain as 'Imlek Vietnam' if needed",
          "sendirian → 'sen-dee-REE-an' = alone",
          "tahun ini → 'TAH-hoon EE-nee' = this year",
        ],
      },
      {
        en: "Saya kangen suasana Tet: bunga, lampion, dan makanan khas.",
        vi: "Tôi nhớ không khí Tết: hoa, đèn lồng, và món đặc trưng.",
        pronunciation_focus: [
          "suasana → su-a-SA-na = không khí, bầu không khí",
          "bunga → BU-nga = hoa; 'ng' giữa từ",
          "lampion → lam-PI-on = đèn lồng",
          "makanan khas → ma-KA-nan KHAS = món đặc trưng; 'kh' khạc nhẹ",
        ],
        pronunciation_focus_en: [
          "suasana → 'soo-ah-SAH-nah' = atmosphere/ambiance",
          "bunga → 'BOO-ngah' = flower; medial 'ng'",
          "lampion → 'lam-PEE-on' = lantern",
          "makanan khas → 'mah-KAH-nan KHAS' = signature/typical food; 'kh' light guttural",
        ],
      },
      {
        en: "Untungnya teman Indonesia mengundang saya makan bersama.",
        vi: "May là bạn Indonesia mời tôi ăn cùng.",
        pronunciation_focus: [
          "untungnya → un-TUNG-nya = may là, may mắn thay; 'ng' giữa, 'ny' = 'nh'",
          "mengundang → me-ngun-DANG = mời (meN- + undang)",
          "makan bersama → MA-kan ber-SA-ma = ăn cùng nhau",
          "teman → te-MAN = bạn",
        ],
        pronunciation_focus_en: [
          "untungnya → 'oon-TOONG-nyah' = luckily; medial 'ng', 'ny' = ñ",
          "mengundang → 'muh-ngoon-DANG' = to invite (meN- + undang)",
          "makan bersama → 'MAH-kan ber-SAH-mah' = to eat together",
          "teman → 'tuh-MAN' = friend",
        ],
      },
    ],
    cultural_notes_vi:
      "Đây là bài viết riêng cho người Việt sống ở Indonesia. Tết Nguyên Đán của Việt Nam rơi cùng dịp 'Imlek' (Tết Nguyên Đán của người Hoa) — ở Indonesia, Imlek là ngày lễ chính thức, có nghỉ. Vì thế bạn có thể giải thích Tết Việt là 'mirip Imlek, tahun baru menurut kalender bulan' (giống Imlek, năm mới theo lịch âm). Nhiều thành phố Indonesia (Jakarta, Surabaya, Singkawang) có khu người Hoa trang trí 'lampion' (đèn lồng) đỏ rực, múa lân ('barongsai') — không khí khá giống Tết, giúp vơi nỗi nhớ. Người Indonesia rất hiếu khách: được 'diundang makan bersama' (mời ăn cùng) là chuyện thường, nên bạn ít khi phải đón Tết một mình. Bạn có thể chia sẻ món Việt (bánh chưng, nem) để giới thiệu văn hóa. Cảm xúc 'kangen suasana Tet' (nhớ không khí Tết) là điều ai xa quê cũng thấm.",
    cultural_notes_en:
      "This lesson is written for Vietnamese people living in Indonesia. Vietnam's Lunar New Year falls at the same time as 'Imlek' (Chinese New Year) — in Indonesia, Imlek is an official public holiday. So you can explain Vietnamese Tết as 'mirip Imlek, tahun baru menurut kalender bulan' (like Imlek, the lunar-calendar new year). Many Indonesian cities (Jakarta, Surabaya, Singkawang) have Chinatowns decked in red 'lampion' (lanterns) with lion dances ('barongsai') — the atmosphere resembles Tết and eases the homesickness. Indonesians are very hospitable: being 'diundang makan bersama' (invited to eat together) is common, so you rarely spend Tết alone. You can share Vietnamese dishes (bánh chưng, nem) to introduce your culture. The feeling 'kangen suasana Tet' (missing the Tết atmosphere) is one every person far from home knows.",
    tip_advice_vi:
      "Cách giải thích Tết cho người Indonesia: 'Tet itu tahun baru Vietnam, mirip Imlek' (Tết là năm mới Việt Nam, giống Imlek). 'merayakan' (đón mừng) + dịp lễ. 'suasana' (không khí) là từ cảm xúc đắt giá. 'untungnya' (may là) mở đầu câu kể chuyện tích cực. Đừng quên 'kh' trong 'khas' (đặc trưng) đọc khạc nhẹ.",
    tip_advice_en:
      "How to explain Tết to Indonesians: 'Tet itu tahun baru Vietnam, mirip Imlek' (Tết is Vietnam's new year, like Imlek). 'merayakan' (to celebrate) + the occasion. 'suasana' (atmosphere) is a valuable emotion word. 'untungnya' (luckily) opens a positive anecdote. Don't forget 'kh' in 'khas' (typical) is a light guttural.",
    vocabulary: [
      { cell_id: "77074ec6-1188-4f62-9f5c-179039d99fb1", word: "merayakan", en: "to celebrate", vi: "đón mừng, ăn mừng", pos: "verb", pronunciation_vi: "me-ra-YA-kan", pronunciation_en: "muh-rah-YAH-kan" },
      { cell_id: "59f94e6c-9d55-4ca7-86e6-7968c882b51e", word: "Imlek", en: "Lunar/Chinese New Year", vi: "Tết Nguyên Đán (người Hoa)", pos: "noun", pronunciation_vi: "IM-lek", pronunciation_en: "IM-lek" },
      { cell_id: "fac5e8d1-81f1-4a94-907a-60a62264d7f6", word: "suasana", en: "atmosphere", vi: "không khí", pos: "noun", pronunciation_vi: "su-a-SA-na", pronunciation_en: "soo-ah-SAH-nah" },
      { cell_id: "968dbdad-541b-4261-ae25-0e75456e849b", word: "lampion", en: "lantern", vi: "đèn lồng", pos: "noun", pronunciation_vi: "lam-PI-on", pronunciation_en: "lam-PEE-on" },
      { cell_id: "82f26235-b327-41e4-8f05-f4141a8f45e5", word: "mengundang", en: "to invite", vi: "mời", pos: "verb", pronunciation_vi: "me-ngun-DANG", pronunciation_en: "muh-ngoon-DANG" },
      { cell_id: "15bf7930-e46e-436b-850c-c9c4d5d8412c", word: "makanan khas", en: "signature/typical food", vi: "món đặc trưng", pos: "noun phrase", pronunciation_vi: "ma-KA-nan KHAS", pronunciation_en: "mah-KAH-nan KHAS" },
      { cell_id: "25b2bfa0-1d8a-4fe7-a421-68f2cd62ae15", word: "untungnya", en: "luckily", vi: "may là, may mắn thay", pos: "adverb", pronunciation_vi: "un-TUNG-nya", pronunciation_en: "oon-TOONG-nyah" },
    ],
    dialogue: [
      { cell_id: "7b3d0503-d6dd-424d-974a-2d6d3fc39fe0", speaker: "Andi", text: "Katanya orang Vietnam juga punya tahun baru ya?", vi: "Nghe nói người Việt cũng có năm mới hả?", en: "I heard Vietnamese people have their own new year too?" },
      { cell_id: "3a2769e1-4b61-43a5-8368-8c12d6961e18", speaker: "Mai", text: "Iya, namanya Tet. Mirip Imlek, tahun baru menurut kalender bulan.", vi: "Ừ, gọi là Tết. Giống Imlek, năm mới theo lịch âm.", en: "Yes, it's called Tết. Like Imlek, the lunar-calendar new year." },
      { cell_id: "0612b269-95fc-415e-85e1-76fefeb1dfba", speaker: "Andi", text: "Wah seru! Ayo rayakan bareng, aku undang kamu makan di rumah.", vi: "Wao hay đó! Mình đón cùng nhau đi, tớ mời cậu ăn ở nhà.", en: "Cool! Let's celebrate together, I'll invite you to eat at my place." },
      { cell_id: "9f45e00b-7c7a-4d33-b2bf-5a1eb6cbe9b4", speaker: "Mai", text: "Makasih banyak. Jadi nggak terlalu kangen rumah deh.", vi: "Cảm ơn nhiều. Vậy là đỡ nhớ nhà hẳn.", en: "Thank you so much. Now I won't be too homesick." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tết là năm mới Việt Nam, giống Imlek.", answer: "Tet itu tahun baru Vietnam, mirip Imlek." },
          { prompt: "Tôi nhớ không khí Tết.", answer: "Saya kangen suasana Tet." },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "merayakan", answer: "đón mừng" },
          { prompt: "suasana", answer: "không khí" },
          { prompt: "lampion", answer: "đèn lồng" },
          { prompt: "untungnya", answer: "may là" },
        ],
      },
    ],
  },
];

export default lessons;
