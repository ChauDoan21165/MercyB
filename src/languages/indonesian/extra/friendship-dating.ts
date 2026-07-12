// src/languages/indonesian/extra/friendship-dating.ts
//
// Friendship & Dating pack for Vietnamese learners of Indonesian.
// The social-life vocabulary nobody teaches in class but everyone uses:
// teman/sahabat (friend/best friend), pacaran (dating), PDKT (the approach
// phase), jadian (becoming a couple), putus (breaking up), and nongkrong
// (the hangout culture that glues Indonesian social life together).
//
// Vietnamese-first: every line carries a `vi` gloss; `pronunciation_focus`
// holds the Vietnamese-facing pronunciation/grammar note (incl. the predictable
// Vietnamese-speaker mistake = L1 note), and `pronunciation_focus_en` is the
// English-speaker companion (same order).
//
// REGISTER NOTE: most of this vocabulary is casual (gaul). Where a word is
// slang, the formal/standard equivalent is given so the learner keeps a safe
// default. Dating is socially sensitive in Indonesia — see cultural notes.
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
  // 1. Teman & sahabat — friends and best friends
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_social_teman_sahabat",
    level: "A2",
    category: "friendship",
    title_vi: "Teman & sahabat — bạn bè và bạn thân",
    title_en: "Teman & sahabat — friends and best friends",
    sentences: [
      {
        en: "Dia teman sekelas saya waktu SMA.",
        vi: "Cậu ấy là bạn cùng lớp của tôi hồi cấp 3.",
        pronunciation_focus: [
          "teman → te-MAN = bạn (chung chung)",
          "sekelas → se-KE-las = cùng lớp (se- + kelas)",
          "waktu → WAK-tu = hồi, lúc, thời gian",
          "SMA → es-em-A = trung học phổ thông (cấp 3)",
        ],
        pronunciation_focus_en: [
          "teman → 'tuh-MAN' = friend (general)",
          "sekelas → 'suh-KEH-las' = classmate (se- + kelas)",
          "waktu → 'WAK-too' = time/when",
          "SMA → 'es-em-AH' = senior high school",
        ],
      },
      {
        en: "Rina adalah sahabat saya sejak kecil.",
        vi: "Rina là bạn thân của tôi từ thuở nhỏ.",
        pronunciation_focus: [
          "sahabat → sa-HA-bat = bạn thân (gắn bó hơn 'teman')",
          "sejak → se-JAK = từ (mốc thời gian); 'j' như tiếng Anh",
          "kecil → ke-CIL = nhỏ, bé; 'c' = 'ch' → 'ke-chil'",
          "adalah → 'là'",
        ],
        pronunciation_focus_en: [
          "sahabat → 'sah-HAH-bat' = best/close friend (deeper than 'teman')",
          "sejak → 'suh-JAK' = since; 'j' as English",
          "kecil → 'kuh-CHEEL' = small; 'c' = 'ch'",
          "adalah → 'is/are'",
        ],
      },
      {
        en: "Kami sering nongkrong bareng setelah kerja.",
        vi: "Chúng tôi hay tụ tập đi chơi chung sau giờ làm.",
        pronunciation_focus: [
          "nongkrong → nong-KRONG = tụ tập, ngồi chơi (gaul); 'ng' đầu",
          "bareng → BA-reng = cùng nhau (gaul của 'bersama')",
          "setelah → se-te-LAH = sau khi",
          "sering → SE-ring = thường, hay",
        ],
        pronunciation_focus_en: [
          "nongkrong → 'nong-KRONG' = to hang out (slang); initial 'ng'",
          "bareng → 'BAH-reng' = together (slang for 'bersama')",
          "setelah → 'suh-tuh-LAH' = after",
          "sering → 'SUH-ring' = often",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia phân biệt rõ 'teman' (bạn nói chung) và 'sahabat' (bạn thân, tri kỷ) — giống 'bạn' vs 'bạn thân/tri kỷ' trong tiếng Việt. Còn có 'kawan' (bạn, hơi trang trọng/vùng miền), 'gebetan' (người đang để ý/crush), và 'geng' (nhóm bạn chơi). Văn hóa 'nongkrong' (tụ tập ngồi chơi, thường ở quán cà phê, warung, hay đơn giản ven đường) là trụ cột đời sống xã hội — không cần lý do, chỉ cần ngồi tán gẫu hàng giờ. Được rủ 'nongkrong bareng' nghĩa là bạn đã được chấp nhận vào nhóm. Người Việt sẽ thấy rất quen với văn hóa 'đi cà phê', 'trà đá vỉa hè'.",
    cultural_notes_en:
      "Indonesian clearly distinguishes 'teman' (friend in general) from 'sahabat' (close/best friend) — like Vietnamese 'bạn' vs 'bạn thân'. There's also 'kawan' (friend, more formal/regional), 'gebetan' (a crush you're pursuing), and 'geng' (friend group). The 'nongkrong' culture (hanging out, often at a café, warung, or roadside) is a pillar of social life — no reason needed, just sit and chat for hours. Being invited to 'nongkrong bareng' means you've been accepted into the group. Vietnamese learners will recognise the 'đi cà phê' / 'trà đá vỉa hè' vibe.",
    tip_advice_vi:
      "Nhớ thang độ thân: kenalan (người quen) < teman (bạn) < sahabat (bạn thân). 'c' = 'ch' lại xuất hiện: kecil = 'ke-chil'. 'nongkrong' có 'ng' đầu — dễ với người Việt. Học cụm rủ rê: 'Nongkrong yuk!' (Đi tụ tập đi!).",
    tip_advice_en:
      "Closeness scale: kenalan (acquaintance) < teman (friend) < sahabat (close friend). 'c' = 'ch' again: kecil = 'kuh-CHEEL'. 'nongkrong' has initial 'ng' — easy for Vietnamese. Learn the invite: 'Nongkrong yuk!' (Let's hang out!).",
    vocabulary: [
      { cell_id: "fe9edd19-58ee-402d-9858-e6a5603fd5e3", word: "teman", en: "friend", vi: "bạn", pos: "noun", pronunciation_vi: "te-MAN", pronunciation_en: "tuh-MAN" },
      { cell_id: "a3bf29cc-ad9e-4fa8-87b6-7d4f0a92bfdc", word: "sahabat", en: "best/close friend", vi: "bạn thân", pos: "noun", pronunciation_vi: "sa-HA-bat", pronunciation_en: "sah-HAH-bat" },
      { cell_id: "0d56375f-ebcd-4942-bb52-3ba2c5ba08c6", word: "kenalan", en: "acquaintance / to get to know", vi: "người quen / làm quen", pos: "noun/verb", pronunciation_vi: "ke-NA-lan", pronunciation_en: "kuh-NAH-lan" },
      { cell_id: "4236d8d1-b78c-4a52-9539-6b2dbe805db8", word: "nongkrong", en: "to hang out", vi: "tụ tập, đi chơi", pos: "verb", pronunciation_vi: "nong-KRONG", pronunciation_en: "nong-KRONG" },
      { cell_id: "3442c796-2aee-45c9-8ab8-f74144eda24c", word: "bareng", en: "together (slang)", vi: "cùng nhau", pos: "adverb", pronunciation_vi: "BA-reng", pronunciation_en: "BAH-reng" },
      { cell_id: "6d29cb94-a12d-438d-90da-316426129c14", word: "geng", en: "friend group, gang", vi: "nhóm bạn", pos: "noun", pronunciation_vi: "GENG", pronunciation_en: "GENG" },
    ],
    dialogue: [
      { cell_id: "0a43f8b0-b714-4e67-9363-19804242b082", speaker: "Dewi", text: "Nanti malam nongkrong yuk, di kafe biasa.", vi: "Tối nay đi chơi đi, ở quán cà phê quen.", en: "Let's hang out tonight, at the usual café." },
      { cell_id: "aa91810c-9fce-4e52-b3ec-b21db4947121", speaker: "Fajar", text: "Boleh! Ajak yang lain juga, ramai-ramai.", vi: "Được! Rủ mấy người khác nữa, đông cho vui.", en: "Sure! Invite the others too, the more the merrier." },
      { cell_id: "db5a73e9-e061-47e7-8f20-b98f125188d5", speaker: "Dewi", text: "Oke, aku chat geng dulu ya.", vi: "Ok, để tớ nhắn cả nhóm trước nhé.", en: "Okay, I'll message the group first." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với mức độ thân:",
        instruction_en: "Match the word to its closeness level:",
        items: [
          { prompt: "kenalan", answer: "người quen" },
          { prompt: "teman", answer: "bạn" },
          { prompt: "sahabat", answer: "bạn thân" },
          { prompt: "nongkrong", answer: "tụ tập đi chơi" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. PDKT — the approach phase
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_social_pdkt",
    level: "B1",
    category: "dating",
    title_vi: "PDKT — giai đoạn tán tỉnh, làm quen",
    title_en: "PDKT — the approach / pursuing phase",
    sentences: [
      {
        en: "Dia lagi PDKT sama teman sekantor.",
        vi: "Cậu ấy đang cưa cẩm một đồng nghiệp cùng công ty.",
        pronunciation_focus: [
          "PDKT → pe-de-ka-TE = 'pendekatan' (sự tiếp cận) = giai đoạn theo đuổi",
          "lagi → LA-gi = đang (gaul của 'sedang')",
          "sama → SA-ma = với (gaul của 'dengan')",
          "sekantor → se-KAN-tor = cùng văn phòng (se- + kantor)",
        ],
        pronunciation_focus_en: [
          "PDKT → 'peh-deh-kah-TEH' = 'pendekatan' (approach) = the pursuing phase",
          "lagi → 'LAH-gee' = currently (slang for 'sedang')",
          "sama → 'SAH-mah' = with (slang for 'dengan')",
          "sekantor → 'suh-KAN-tor' = same-office (se- + kantor)",
        ],
      },
      {
        en: "Aku suka sama dia, tapi malu mau ngomong.",
        vi: "Tớ thích cậu ấy, nhưng ngại không dám nói.",
        pronunciation_focus: [
          "suka sama → SU-ka SA-ma = thích (ai đó)",
          "malu → MA-lu = ngại, xấu hổ",
          "ngomong → ngo-MONG = nói (gaul); 'ng' đầu",
          "mau → MA-u = muốn, định",
        ],
        pronunciation_focus_en: [
          "suka sama → 'SOO-kah SAH-mah' = to like (someone)",
          "malu → 'MAH-loo' = shy, embarrassed",
          "ngomong → 'ngo-MONG' = to talk (slang); initial 'ng'",
          "mau → 'MAH-oo' = want/intend",
        ],
      },
      {
        en: "Dia sering ngasih perhatian, kayaknya naksir aku.",
        vi: "Cậu ấy hay quan tâm tớ, hình như cảm nắng tớ rồi.",
        pronunciation_focus: [
          "ngasih → nga-SIH = cho, dành (gaul của 'memberi')",
          "perhatian → per-ha-TI-an = sự quan tâm",
          "kayaknya → KA-yak-nya = hình như, có vẻ; 'ny' = 'nh'",
          "naksir → NAK-sir = cảm nắng, để ý ai (gaul)",
        ],
        pronunciation_focus_en: [
          "ngasih → 'nga-SEE' = to give (slang for 'memberi')",
          "perhatian → 'per-hah-TEE-an' = attention/care",
          "kayaknya → 'KAH-yak-nyah' = it seems; 'ny' = ñ",
          "naksir → 'NAK-seer' = to have a crush on (slang)",
        ],
      },
    ],
    cultural_notes_vi:
      "'PDKT' (viết tắt của 'pendekatan' = sự tiếp cận) là giai đoạn tán tỉnh, làm quen trước khi chính thức yêu — y hệt 'cưa cẩm' / 'tán' của người Việt. Trong giai đoạn này người ta 'ngasih perhatian' (quan tâm), nhắn tin thường xuyên, rủ đi chơi. 'Naksir' = cảm nắng, để ý ai đó; 'gebetan' = đối tượng đang theo đuổi (crush). PDKT có thể kéo dài vài tuần đến vài tháng. Lưu ý văn hóa: hẹn hò ở Indonesia kín đáo hơn phương Tây, đặc biệt trong gia đình Hồi giáo truyền thống — thể hiện tình cảm nơi công cộng (PDA) thường bị nhìn không thiện cảm. Người Việt sẽ thấy mức độ kín đáo này khá quen.",
    cultural_notes_en:
      "'PDKT' (short for 'pendekatan' = approach) is the flirting/getting-to-know phase before officially dating — exactly like Vietnamese 'cưa cẩm' / 'tán'. During it you 'ngasih perhatian' (give attention), text a lot, and ask each other out. 'Naksir' = to have a crush; 'gebetan' = the crush/person you're pursuing. PDKT can last weeks to months. Cultural note: dating in Indonesia is more discreet than in the West, especially in traditional Muslim families — public displays of affection (PDA) are often frowned upon. Vietnamese learners will find this reserve familiar.",
    tip_advice_vi:
      "Học các viết tắt tình cảm — chúng cực phổ biến: PDKT (cưa cẩm), PDA (thể hiện nơi công cộng), TTM (teman tapi mesra = bạn nhưng thân mật). Tiền tố gaul 'ng-' lại xuất hiện: ngomong, ngasih. 'suka sama X' = thích X. Phân biệt 'naksir' (cảm nắng, nhẹ) với 'cinta' (yêu, sâu đậm).",
    tip_advice_en:
      "Learn the romance acronyms — they're everywhere: PDKT (pursuing), PDA (public affection), TTM (teman tapi mesra = friends with closeness). The slang 'ng-' prefix again: ngomong, ngasih. 'suka sama X' = to like X. Distinguish 'naksir' (a light crush) from 'cinta' (deep love).",
    vocabulary: [
      { cell_id: "2fa65157-7d0b-46c6-8cb0-25eac38307d8", word: "PDKT (pendekatan)", en: "the pursuing/flirting phase", vi: "giai đoạn cưa cẩm", pos: "noun", pronunciation_vi: "pe-de-ka-TE", pronunciation_en: "peh-deh-kah-TEH" },
      { cell_id: "9453dd14-6744-4434-9de1-b364d4c9c948", word: "naksir", en: "to have a crush on", vi: "cảm nắng, để ý", pos: "verb", pronunciation_vi: "NAK-sir", pronunciation_en: "NAK-seer" },
      { cell_id: "d68e2c68-de7d-4651-ad28-a5f8d0df39fb", word: "gebetan", en: "crush (the person)", vi: "người mình thích", pos: "noun", pronunciation_vi: "ge-BE-tan", pronunciation_en: "guh-BUH-tan" },
      { cell_id: "fe5f590a-7b09-4dca-87ee-f0d3ff9d2d15", word: "perhatian", en: "attention, care", vi: "sự quan tâm", pos: "noun", pronunciation_vi: "per-ha-TI-an", pronunciation_en: "per-hah-TEE-an" },
      { cell_id: "c74107b6-6b52-40d2-b7e1-56a8f26c9475", word: "malu", en: "shy, embarrassed", vi: "ngại, xấu hổ", pos: "adjective", pronunciation_vi: "MA-lu", pronunciation_en: "MAH-loo" },
      { cell_id: "21a487d5-5825-4631-a74e-abcfb24dae66", word: "suka", en: "to like", vi: "thích", pos: "verb", pronunciation_vi: "SU-ka", pronunciation_en: "SOO-kah" },
    ],
    dialogue: [
      { cell_id: "94198fe6-a26c-4c2c-89f8-10d1cf588b85", speaker: "Tya", text: "Kamu kayaknya lagi PDKT sama si Andi ya?", vi: "Hình như cậu đang cưa anh Andi đúng không?", en: "Seems like you're pursuing Andi, right?" },
      { cell_id: "fcff6bf4-313c-455f-99eb-b570e63bd426", speaker: "Sari", text: "Hehe, ketahuan. Aku naksir dia sih, tapi malu.", vi: "Hehe, bị phát hiện. Tớ cảm nắng cậu ấy, mà ngại.", en: "Heh, busted. I do have a crush on him, but I'm shy." },
      { cell_id: "28ad9611-cad7-4a2a-bea8-4a67f60aa542", speaker: "Tya", text: "Ayo dong, kasih kode aja dulu.", vi: "Cố lên nào, thả thính trước đi.", en: "Come on, just drop a hint first." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ tình cảm hợp ngữ cảnh:",
        instruction_en: "Fill the romance word that fits:",
        items: [
          { prompt: "Dia lagi ___ sama teman sekelas. (cưa cẩm)", answer: "PDKT", options: ["PDKT", "putus", "jadian"] },
          { prompt: "Aku ___ dia sejak lama. (cảm nắng)", answer: "naksir", options: ["naksir", "malu", "marah"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. Pacaran & jadian — dating & becoming a couple
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_social_pacaran_jadian",
    level: "B1",
    category: "dating",
    title_vi: "Pacaran & jadian — hẹn hò và chính thức thành đôi",
    title_en: "Pacaran & jadian — dating & becoming a couple",
    sentences: [
      {
        en: "Mereka akhirnya jadian setelah berbulan-bulan PDKT.",
        vi: "Cuối cùng họ cũng thành đôi sau nhiều tháng cưa cẩm.",
        pronunciation_focus: [
          "akhirnya → a-KHIR-nya = cuối cùng; 'kh' khạc nhẹ, 'ny'='nh'",
          "jadian → ja-DI-an = chính thức yêu nhau (gaul từ 'jadi')",
          "setelah → se-te-LAH = sau khi",
          "berbulan-bulan → ber-bu-lan BU-lan = nhiều tháng (từ lặp)",
        ],
        pronunciation_focus_en: [
          "akhirnya → 'ah-KHEER-nyah' = finally; 'kh' light guttural, 'ny'=ñ",
          "jadian → 'jah-DEE-an' = to become a couple (slang from 'jadi')",
          "setelah → 'suh-tuh-LAH' = after",
          "berbulan-bulan → 'ber-boo-lan BOO-lan' = for months (reduplication)",
        ],
      },
      {
        en: "Sekarang dia pacarku. Kami sudah pacaran enam bulan.",
        vi: "Bây giờ cậu ấy là người yêu của tớ. Bọn tớ yêu nhau sáu tháng rồi.",
        pronunciation_focus: [
          "pacar → PA-car = người yêu; 'c' = 'ch' → 'pa-char'",
          "pacarku → người yêu của tôi (pacar + -ku)",
          "pacaran → pa-CA-ran = hẹn hò, yêu đương",
          "sudah → SU-dah = đã, rồi",
        ],
        pronunciation_focus_en: [
          "pacar → 'PAH-char' = boyfriend/girlfriend; 'c' = 'ch'",
          "pacarku → 'my partner' (pacar + -ku 'my')",
          "pacaran → 'pah-CHAH-ran' = to date / be in a relationship",
          "sudah → 'SOO-dah' = already",
        ],
      },
      {
        en: "Kami sering kencan nonton film atau makan malam.",
        vi: "Bọn tớ hay đi hẹn hò xem phim hoặc ăn tối.",
        pronunciation_focus: [
          "kencan → KEN-can = buổi hẹn hò (date); 'c' = 'ch' → 'ken-chan'",
          "nonton → NON-ton = xem (gaul của 'menonton')",
          "atau → A-tau = hoặc",
          "makan malam → MA-kan MA-lam = ăn tối",
        ],
        pronunciation_focus_en: [
          "kencan → 'KEN-chan' = a date; 'c' = 'ch'",
          "nonton → 'NON-ton' = to watch (slang for 'menonton')",
          "atau → 'AH-tau' = or",
          "makan malam → 'MAH-kan MAH-lam' = dinner",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi PDKT thành công, hai người 'jadian' (chính thức yêu nhau) và bắt đầu 'pacaran' (hẹn hò). 'Pacar' = người yêu (cả nam lẫn nữ, không phân biệt giới). Một buổi hẹn cụ thể gọi là 'kencan' (date). Khác văn hóa phương Tây, ở Indonesia nhiều cặp đôi giữ kín hoặc thông báo với gia đình sớm; trong gia đình Hồi giáo sùng đạo, hẹn hò riêng tư có thể bị hạn chế và mục tiêu thường hướng tới hôn nhân ('menikah'). Có khái niệm ' taaruf' — tìm hiểu để cưới theo nghi thức Hồi giáo, không phải 'pacaran' tự do. Người Việt nên ý thức sự đa dạng này: bạn trẻ thành thị hẹn hò khá thoáng, nhưng vùng quê và gia đình truyền thống thì kín đáo hơn nhiều.",
    cultural_notes_en:
      "When PDKT succeeds, two people 'jadian' (officially become a couple) and start 'pacaran' (dating). 'Pacar' = partner (any gender). A specific outing is a 'kencan' (date). Unlike the West, many Indonesian couples stay discreet or tell family early; in devout Muslim families, private dating may be limited and the goal is usually marriage ('menikah'). There's also 'taaruf' — a faith-based getting-to-know process aimed at marriage, distinct from free 'pacaran'. Vietnamese learners should note the diversity: urban youth date fairly openly, but rural and traditional families are far more reserved.",
    tip_advice_vi:
      "Cùng gốc 'jadi' (trở thành) → 'jadian' (thành đôi). 'pacar' (người yêu) + đuôi sở hữu: pacarku (người yêu tớ), pacarmu (người yêu cậu). 'c' = 'ch' lặp lại: pacar, kencan. Phân biệt 'pacaran' (đang yêu, chưa cưới) với 'menikah' (kết hôn) và 'tunangan' (đính hôn).",
    tip_advice_en:
      "Same root 'jadi' (to become) → 'jadian' (to couple up). 'pacar' + possessive: pacarku (my partner), pacarmu (your partner). 'c' = 'ch' again: pacar, kencan. Distinguish 'pacaran' (dating, unmarried) from 'menikah' (to marry) and 'tunangan' (engaged).",
    vocabulary: [
      { cell_id: "64e106df-7ee1-4533-8771-9755b335a629", word: "jadian", en: "to become a couple", vi: "thành đôi", pos: "verb", pronunciation_vi: "ja-DI-an", pronunciation_en: "jah-DEE-an" },
      { cell_id: "5eda12de-eafc-4a65-ba5b-d7c08abc9859", word: "pacar", en: "boyfriend/girlfriend", vi: "người yêu", pos: "noun", pronunciation_vi: "PA-car", pronunciation_en: "PAH-char" },
      { cell_id: "63f65586-e755-45e2-9aaf-2e5e3c7691a6", word: "pacaran", en: "to date, be in a relationship", vi: "hẹn hò, yêu đương", pos: "verb", pronunciation_vi: "pa-CA-ran", pronunciation_en: "pah-CHAH-ran" },
      { cell_id: "436bb1f4-cf4a-49de-811e-f4465c79d37f", word: "kencan", en: "a date (outing)", vi: "buổi hẹn hò", pos: "noun", pronunciation_vi: "KEN-can", pronunciation_en: "KEN-chan" },
      { cell_id: "45ad40e8-1515-4ee4-b54b-2d7547717c63", word: "tunangan", en: "engaged / fiancé(e)", vi: "đính hôn / hôn phu/thê", pos: "noun/verb", pronunciation_vi: "tu-NA-ngan", pronunciation_en: "too-NAH-ngan" },
      { cell_id: "3c841fcc-d737-4b36-b648-9e436409e21f", word: "menikah", en: "to get married", vi: "kết hôn", pos: "verb", pronunciation_vi: "me-NI-kah", pronunciation_en: "muh-NEE-kah" },
    ],
    dialogue: [
      { cell_id: "b98d748f-b9e7-4d2e-b93d-80727603e8d1", speaker: "Bayu", text: "Eh, kamu sama Sari udah jadian belum?", vi: "Ê, cậu với Sari thành đôi chưa?", en: "Hey, are you and Sari official yet?" },
      { cell_id: "0fe6218d-2d6b-4b34-94ab-3604ecdb83a0", speaker: "Dito", text: "Udah dong! Kami pacaran dua minggu ini.", vi: "Rồi chứ! Bọn tớ yêu nhau hai tuần nay.", en: "Yeah! We've been dating for two weeks now." },
      { cell_id: "6691f6f1-5edb-429a-89fc-257f59c8a604", speaker: "Bayu", text: "Wah selamat! Kapan kencan pertama?", vi: "Wao chúc mừng! Hẹn hò lần đầu khi nào?", en: "Wow, congrats! When's the first date?" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Cậu ấy là người yêu của tớ.", answer: "Dia pacarku." },
          { prompt: "Bọn tớ yêu nhau sáu tháng rồi.", answer: "Kami sudah pacaran enam bulan." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Putus — breaking up
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_social_putus",
    level: "B1",
    category: "dating",
    title_vi: "Putus — chia tay",
    title_en: "Putus — breaking up",
    sentences: [
      {
        en: "Mereka putus minggu lalu, katanya nggak cocok.",
        vi: "Họ chia tay tuần trước, nghe nói không hợp nhau.",
        pronunciation_focus: [
          "putus → PU-tus = chia tay, đứt (quan hệ)",
          "minggu lalu → MING-gu LA-lu = tuần trước",
          "katanya → ka-TA-nya = nghe nói, người ta bảo; 'ny' = 'nh'",
          "cocok → CO-cok = hợp nhau; 'c' = 'ch' → 'cho-chok'",
        ],
        pronunciation_focus_en: [
          "putus → 'POO-toos' = to break up",
          "minggu lalu → 'MING-goo LAH-loo' = last week",
          "katanya → 'kah-TAH-nyah' = they say / reportedly; 'ny' = ñ",
          "cocok → 'CHOH-chok' = compatible; 'c' = 'ch'",
        ],
      },
      {
        en: "Dia sedang patah hati dan butuh waktu sendiri.",
        vi: "Cậu ấy đang thất tình và cần thời gian một mình.",
        pronunciation_focus: [
          "patah hati → PA-tah HA-ti = thất tình, đau lòng (tan vỡ con tim)",
          "butuh → BU-tuh = cần",
          "waktu → WAK-tu = thời gian",
          "sendiri → sen-DI-ri = một mình",
        ],
        pronunciation_focus_en: [
          "patah hati → 'PAH-tah HAH-tee' = heartbroken (a broken heart)",
          "butuh → 'BOO-tooh' = to need",
          "waktu → 'WAK-too' = time",
          "sendiri → 'sen-DEE-ree' = alone/by oneself",
        ],
      },
      {
        en: "Jangan sedih terus, masih banyak ikan di laut.",
        vi: "Đừng buồn mãi, biển còn nhiều cá lắm.",
        pronunciation_focus: [
          "jangan sedih → đừng buồn (cụm an ủi)",
          "terus → te-RUS = mãi, liên tục",
          "masih → MA-sih = vẫn còn",
          "'banyak ikan di laut' = thành ngữ 'còn nhiều cá ngoài biển' (như tiếng Anh)",
        ],
        pronunciation_focus_en: [
          "jangan sedih → 'don't be sad' (comforting frame)",
          "terus → 'tuh-ROOS' = continuously, keep on",
          "masih → 'MAH-see' = still",
          "'banyak ikan di laut' = idiom 'plenty more fish in the sea'",
        ],
      },
    ],
    cultural_notes_vi:
      "'Putus' nghĩa đen là 'đứt' — dùng cho chia tay (putus cinta = đứt gánh tình). Người vừa chia tay thì 'patah hati' (thất tình, tim tan vỡ) hoặc 'galau' (rối bời, buồn bã — từ gaul rất thịnh). Bạn bè an ủi bằng những câu như 'masih banyak ikan di laut' (còn nhiều cá ngoài biển) — thành ngữ giống hệt tiếng Anh và cũng có trong tiếng Việt. Có khái niệm 'move on' (mượn tiếng Anh, đọc 'mup on') = quên đi bước tiếp, và 'baper' (dễ xúc động) khi ai đó còn vương vấn. Mạng xã hội Indonesia đầy nội dung về 'galau' và 'move on' sau chia tay. Người Việt sẽ thấy cảm xúc và cách an ủi rất tương đồng.",
    cultural_notes_en:
      "'Putus' literally means 'to snap/break' — used for breaking up (putus cinta = a love split). The newly single are 'patah hati' (heartbroken) or 'galau' (in turmoil/down — a very popular slang word). Friends comfort with lines like 'masih banyak ikan di laut' (plenty more fish in the sea) — the same idiom as English. There's also 'move on' (English borrowing, said 'moop on') and 'baper' (oversensitive) for someone still hung up. Indonesian social media is full of 'galau' and 'move on' content. Vietnamese learners will find the emotions and comfort scripts very familiar.",
    tip_advice_vi:
      "'putus' = chia tay; thêm 'cinta' thành 'putus cinta' (đứt gánh tình) cho rõ. Từ cảm xúc quan trọng: galau (rối bời/buồn), patah hati (thất tình), move on (bước tiếp). 'cocok' (hợp) đọc 'cho-chok' — c=ch hai lần. 'katanya' (nghe nói) cực hữu ích khi kể chuyện người khác.",
    tip_advice_en:
      "'putus' = to break up; add 'cinta' → 'putus cinta' for clarity. Key emotion words: galau (turmoil/down), patah hati (heartbroken), move on. 'cocok' (compatible) = 'CHOH-chok' — c=ch twice. 'katanya' (reportedly) is very useful for relaying gossip.",
    vocabulary: [
      { cell_id: "33a5fa9d-3e19-4a6b-a51e-de64caf2a02a", word: "putus", en: "to break up", vi: "chia tay", pos: "verb", pronunciation_vi: "PU-tus", pronunciation_en: "POO-toos" },
      { cell_id: "d168cd19-690b-4db5-b667-f5af947b474a", word: "patah hati", en: "heartbroken", vi: "thất tình", pos: "adjective phrase", pronunciation_vi: "PA-tah HA-ti", pronunciation_en: "PAH-tah HAH-tee" },
      { cell_id: "ebc3e3a5-41c0-4762-ad51-a72b01c41119", word: "galau", en: "in emotional turmoil, down", vi: "rối bời, buồn bã", pos: "adjective", pronunciation_vi: "GA-lau", pronunciation_en: "GAH-lau" },
      { cell_id: "5c20e9f6-3183-45b2-bacb-185b91528169", word: "cocok", en: "compatible, a good match", vi: "hợp nhau", pos: "adjective", pronunciation_vi: "CO-cok", pronunciation_en: "CHOH-chok" },
      { cell_id: "4d9b04aa-a195-4cd3-983e-da76891b502f", word: "selingkuh", en: "to cheat (in a relationship)", vi: "ngoại tình, lừa dối", pos: "verb", pronunciation_vi: "se-LING-kuh", pronunciation_en: "suh-LING-kooh" },
      { cell_id: "3a8d4ab4-4a59-4d13-acfe-deaea54dcd1e", word: "move on", en: "to move on", vi: "bước tiếp, quên đi", pos: "verb", pronunciation_vi: "mup ON", pronunciation_en: "moop ON" },
    ],
    dialogue: [
      { cell_id: "531f8ca1-73bc-4756-bd1f-675505ad46d9", speaker: "Rini", text: "Kamu kenapa galau gitu? Ada masalah?", vi: "Sao trông cậu buồn rối thế? Có chuyện gì à?", en: "Why do you look so down? Something wrong?" },
      { cell_id: "fad8a0d5-5209-429a-bbce-28505f1d08c4", speaker: "Sinta", text: "Aku putus sama pacarku. Lagi patah hati nih.", vi: "Tớ chia tay người yêu rồi. Đang thất tình đây.", en: "I broke up with my partner. I'm heartbroken." },
      { cell_id: "f180ad3c-8373-4b13-bf1b-c8816447470d", speaker: "Rini", text: "Sabar ya. Masih banyak ikan di laut. Move on pelan-pelan.", vi: "Cố gắng nhé. Biển còn nhiều cá. Từ từ bước tiếp.", en: "Hang in there. Plenty more fish in the sea. Move on slowly." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "putus", answer: "chia tay" },
          { prompt: "patah hati", answer: "thất tình" },
          { prompt: "galau", answer: "rối bời, buồn" },
          { prompt: "cocok", answer: "hợp nhau" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. Hangout culture — nongkrong, ajak, traktir
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_social_hangout_culture",
    level: "A2",
    category: "friendship",
    title_vi: "Văn hóa tụ tập — nongkrong, rủ rê, bao nhau",
    title_en: "Hangout culture — nongkrong, inviting, treating",
    sentences: [
      {
        en: "Yuk, kita nongkrong di warung kopi sebentar.",
        vi: "Đi nào, mình ra quán cà phê ngồi chút đi.",
        pronunciation_focus: [
          "yuk → YUK = nào, đi thôi (rủ rê thân mật)",
          "warung kopi → WA-rung KO-pi = quán cà phê bình dân",
          "sebentar → se-ben-TAR = một lát, chút xíu",
          "nongkrong → nong-KRONG = tụ tập ngồi chơi",
        ],
        pronunciation_focus_en: [
          "yuk → 'YOOK' = let's, come on (casual invite)",
          "warung kopi → 'WAH-roong KOH-pee' = a humble coffee stall",
          "sebentar → 'suh-ben-TAR' = a moment, a bit",
          "nongkrong → 'nong-KRONG' = to hang out",
        ],
      },
      {
        en: "Aku ajak teman-teman buat kumpul akhir pekan.",
        vi: "Tớ rủ đám bạn tụ họp cuối tuần.",
        pronunciation_focus: [
          "ajak → A-jak = rủ, mời (đi cùng)",
          "teman-teman → te-MAN te-MAN = bạn bè (số nhiều, từ lặp)",
          "buat → BU-at = để (gaul của 'untuk')",
          "kumpul → KUM-pul = tụ họp",
        ],
        pronunciation_focus_en: [
          "ajak → 'AH-jak' = to invite (along)",
          "teman-teman → 'tuh-MAN tuh-MAN' = friends (plural via reduplication)",
          "buat → 'BOO-at' = for/to (slang for 'untuk')",
          "kumpul → 'KOOM-pool' = to gather",
        ],
      },
      {
        en: "Tenang, hari ini aku yang traktir!",
        vi: "Yên tâm, hôm nay tớ bao!",
        pronunciation_focus: [
          "tenang → te-NANG = bình tĩnh, yên tâm; 'ng' cuối",
          "hari ini → HA-ri I-ni = hôm nay",
          "traktir → TRAK-tir = bao, mời (trả tiền hộ)",
          "'aku yang traktir' = chính tớ là người bao",
        ],
        pronunciation_focus_en: [
          "tenang → 'tuh-NANG' = calm, relax; final 'ng'",
          "hari ini → 'HAH-ree EE-nee' = today",
          "traktir → 'TRAK-teer' = to treat (pay for someone)",
          "'aku yang traktir' = I'm the one treating",
        ],
      },
    ],
    cultural_notes_vi:
      "'Nongkrong' là trái tim đời sống xã hội Indonesia: ngồi tụ tập hàng giờ ở warung, quán cà phê, hay 'angkringan' (quán vỉa hè) chỉ để tán gẫu. Lời rủ phổ biến nhất là 'Yuk!' hoặc 'Nongkrong yuk!'. Khi đi nhóm, có văn hóa 'traktir' (bao, mời) — người vừa có lương, vừa sinh nhật, hay vừa được thăng chức thường 'traktir' cả nhóm; nhưng cũng hay chia tiền ('patungan'). Từ chối lời rủ liên tục có thể bị coi là 'sombong' (kiêu, xa cách). Người Việt sẽ thấy cực kỳ quen: 'đi nhậu', 'đi cà phê', 'hôm nay tao bao' — gần như giống hệt. Đây là vốn từ vàng để kết bạn và hòa nhập nhanh.",
    cultural_notes_en:
      "'Nongkrong' is the heart of Indonesian social life: sitting and chatting for hours at a warung, café, or 'angkringan' (street stall) for no reason but to talk. The most common invite is 'Yuk!' or 'Nongkrong yuk!'. In groups there's a 'traktir' culture — whoever just got paid, had a birthday, or got promoted often treats the group; but splitting the bill ('patungan') is common too. Repeatedly declining invites can read as 'sombong' (arrogant/aloof). Vietnamese learners will find it extremely familiar: 'đi nhậu', 'đi cà phê', 'hôm nay tao bao'. This is gold-tier vocabulary for making friends and fitting in fast.",
    tip_advice_vi:
      "Bộ rủ rê thiết yếu: 'Yuk!' (đi nào), 'ajak' (rủ), 'kumpul' (tụ họp), 'traktir' (bao), 'patungan' (chia tiền). 'buat' = 'untuk' (để) trong văn nói. Cấu trúc nhấn mạnh 'aku YANG traktir' (chính tớ bao) — 'yang' làm rõ ai. Đừng từ chối lời rủ quá nhiều lần kẻo bị coi là 'sombong'.",
    tip_advice_en:
      "Essential invite kit: 'Yuk!' (let's), 'ajak' (invite), 'kumpul' (gather), 'traktir' (treat), 'patungan' (split the bill). 'buat' = 'untuk' (for) in speech. The emphasis structure 'aku YANG traktir' (I'm the one treating) — 'yang' marks who. Don't decline invites too often or you'll seem 'sombong'.",
    vocabulary: [
      { cell_id: "cfa9ea86-154f-403d-9b79-88bbb5322d7d", word: "yuk", en: "let's, come on", vi: "đi nào", pos: "interjection", pronunciation_vi: "YUK", pronunciation_en: "YOOK" },
      { cell_id: "3784f1bd-d0a7-4e1b-8668-28b3a7e278e5", word: "ajak", en: "to invite along", vi: "rủ, mời đi cùng", pos: "verb", pronunciation_vi: "A-jak", pronunciation_en: "AH-jak" },
      { cell_id: "a8f3fcfb-b763-4e61-ae41-5ece41a4227b", word: "kumpul", en: "to gather", vi: "tụ họp", pos: "verb", pronunciation_vi: "KUM-pul", pronunciation_en: "KOOM-pool" },
      { cell_id: "dda18d22-e560-49c5-aee9-0cad4e0f9fbf", word: "traktir", en: "to treat (pay for)", vi: "bao, mời", pos: "verb", pronunciation_vi: "TRAK-tir", pronunciation_en: "TRAK-teer" },
      { cell_id: "466ea4c8-3e60-4b6f-aac0-4cd3721151c6", word: "patungan", en: "to split the bill / chip in", vi: "chia tiền, góp tiền", pos: "verb", pronunciation_vi: "pa-TU-ngan", pronunciation_en: "pah-TOO-ngan" },
      { cell_id: "e62e34fa-a407-467d-ac14-e68bf843675e", word: "warung kopi", en: "coffee stall", vi: "quán cà phê bình dân", pos: "noun", pronunciation_vi: "WA-rung KO-pi", pronunciation_en: "WAH-roong KOH-pee" },
    ],
    dialogue: [
      { cell_id: "43833abc-6345-42f8-a21b-c57723dbae9b", speaker: "Eka", text: "Yuk kumpul nanti sore, ajak anak-anak yang lain juga.", vi: "Chiều nay tụ họp đi, rủ mấy đứa kia nữa.", en: "Let's meet up this afternoon, invite the others too." },
      { cell_id: "3213ac4a-fd28-4136-a164-5b8b8a18d959", speaker: "Joko", text: "Siap! Patungan atau gimana?", vi: "Sẵn sàng! Chia tiền hay sao đây?", en: "Ready! Split the bill or what?" },
      { cell_id: "2eb02b03-193b-43fd-a338-86306ed25e72", speaker: "Eka", text: "Tenang, hari ini aku yang traktir. Baru gajian, hehe.", vi: "Yên tâm, hôm nay tớ bao. Mới nhận lương, hehe.", en: "Relax, I'm treating today. Just got paid, heh." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ rủ rê hợp ngữ cảnh:",
        instruction_en: "Fill the social word that fits:",
        items: [
          { prompt: "___ nongkrong di kafe! (đi nào)", answer: "Yuk", options: ["Yuk", "Jangan", "Tidak"] },
          { prompt: "Hari ini aku yang ___. (bao)", answer: "traktir", options: ["traktir", "putus", "ajak"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Đi nào, mình ra quán cà phê đi.", answer: "Yuk, kita nongkrong di warung kopi." },
          { prompt: "Hôm nay tớ bao!", answer: "Hari ini aku yang traktir!" },
        ],
      },
    ],
  },
];

export default lessons;
