// src/languages/indonesian/extra/moving-pindahan.ts
//
// Moving House (Pindahan) pack for Vietnamese learners of Indonesian.
// The full relocation journey and its vocabulary: pindah rumah (moving house),
// packing into kardus (boxes), hiring an ekspedisi/jasa pindahan (movers),
// registering a new alamat (address) with the RT/RW, and introducing yourself
// to the tetangga baru (new neighbours).
//
// Vietnamese-first: every line carries a `vi` gloss; `pronunciation_focus`
// holds the Vietnamese-facing pronunciation/grammar note (incl. the predictable
// Vietnamese-speaker mistake = L1 note), and `pronunciation_focus_en` is the
// English-speaker companion (same order).
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
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
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
  // 1. Deciding to move — pindah rumah
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_moving_pindah_rumah",
    level: "A2",
    category: "housing",
    title_vi: "Quyết định chuyển nhà — pindah rumah",
    title_en: "Deciding to move — pindah rumah",
    sentences: [
      {
        en: "Bulan depan saya akan pindah rumah ke daerah lain.",
        vi: "Tháng sau tôi sẽ chuyển nhà sang khu khác.",
        pronunciation_focus: [
          "pindah → PIN-dah = chuyển, dời (đi nơi khác)",
          "pindah rumah → chuyển nhà",
          "akan → A-kan = sẽ (dấu hiệu tương lai)",
          "daerah → da-E-rah = khu vực, vùng (ba âm: da-e-rah)",
        ],
        pronunciation_focus_en: [
          "pindah → 'PIN-dah' = to move/relocate",
          "pindah rumah → to move house",
          "akan → 'AH-kan' = will (future marker)",
          "daerah → 'dah-EH-rah' = area/region (three syllables)",
        ],
      },
      {
        en: "Rumah baru saya lebih dekat ke kantor.",
        vi: "Nhà mới của tôi gần văn phòng hơn.",
        pronunciation_focus: [
          "rumah baru → nhà mới",
          "lebih dekat → LE-bih DE-kat = gần hơn (lebih TRƯỚC tính từ)",
          "ke kantor → KE KAN-tor = đến văn phòng",
          "LỖI: nói 'dekat lebih'; phải 'lebih dekat'",
        ],
        pronunciation_focus_en: [
          "rumah baru → new house",
          "lebih dekat → 'LUH-bee DUH-kat' = closer (lebih BEFORE adjective)",
          "ke kantor → 'kuh KAN-tor' = to the office",
          "error: 'dekat lebih' is wrong; it must be 'lebih dekat'",
        ],
      },
      {
        en: "Saya harus memberi tahu pemilik kos sebulan sebelumnya.",
        vi: "Tôi phải báo cho chủ nhà trọ trước một tháng.",
        pronunciation_focus: [
          "memberi tahu → mem-be-RI TA-hu = báo cho, thông báo",
          "pemilik → pe-MI-lik = chủ sở hữu (pe- + milik)",
          "kos → KOS = nhà trọ (phòng thuê)",
          "sebelumnya → se-be-LUM-nya = trước đó; 'ny' = 'nh'",
        ],
        pronunciation_focus_en: [
          "memberi tahu → 'mem-buh-REE TAH-hoo' = to inform/notify",
          "pemilik → 'puh-MEE-lik' = owner (pe- + milik)",
          "kos → 'KOS' = boarding room (rented room)",
          "sebelumnya → 'suh-buh-LOOM-nyah' = beforehand; 'ny' = ñ",
        ],
      },
    ],
    cultural_notes_vi:
      "'Pindah rumah' (chuyển nhà) hay 'pindahan' (sự dọn nhà) là việc thường gặp ở Indonesia, đặc biệt với người trẻ đi làm xa quê ('merantau') hay sinh viên đổi 'kos' (nhà trọ). Nếu thuê 'kos' hay 'kontrakan' (nhà thuê), thường phải báo 'pemilik kos' / 'ibu kos' (chủ trọ, thường là phụ nữ) trước 1 tháng để lấy lại 'deposit' (tiền cọc). Lý do chuyển nhà phổ biến: gần chỗ làm hơn ('lebih dekat ke kantor'), giá rẻ hơn, hoặc lập gia đình. Người Việt sẽ thấy rất quen vì văn hóa thuê trọ tương tự ở các thành phố lớn. Lưu ý động từ 'pindah' (chuyển chỗ) khác 'memindahkan' (di dời đồ vật — có tân ngữ).",
    cultural_notes_en:
      "'Pindah rumah' (moving house) or 'pindahan' (the move) is common in Indonesia, especially for young people working far from home ('merantau') or students changing 'kos' (boarding rooms). If you rent a 'kos' or 'kontrakan' (rented house), you usually notify the 'pemilik kos' / 'ibu kos' (landlady, often a woman) a month ahead to reclaim your 'deposit'. Common reasons to move: closer to work ('lebih dekat ke kantor'), cheaper rent, or starting a family. Vietnamese learners will find it familiar from big-city rental culture. Note 'pindah' (to move oneself) differs from 'memindahkan' (to relocate an object — takes an object).",
    tip_advice_vi:
      "'pindah' = tự chuyển chỗ; 'memindahkan' = di dời đồ (có tân ngữ). 'kos' = nhà trọ, 'ibu kos' = chủ trọ. So sánh hơn 'lebih dekat' — lebih đặt TRƯỚC. 'memberi tahu' (báo cho) là cụm hữu ích khi rời đi. 'daerah' đọc tách ba âm da-e-rah.",
    tip_advice_en:
      "'pindah' = to move oneself; 'memindahkan' = to move an object (transitive). 'kos' = boarding room, 'ibu kos' = landlady. Comparative 'lebih dekat' — lebih goes BEFORE. 'memberi tahu' (to inform) is handy when leaving. 'daerah' splits into three syllables da-e-rah.",
    vocabulary: [
      { word: "pindah", en: "to move, relocate", vi: "chuyển, dời", pos: "verb", pronunciation_vi: "PIN-dah", pronunciation_en: "PIN-dah" },
      { word: "pindahan", en: "the move, moving", vi: "việc dọn nhà", pos: "noun", pronunciation_vi: "pin-DA-han", pronunciation_en: "pin-DAH-han" },
      { word: "kos", en: "boarding room", vi: "nhà trọ", pos: "noun", pronunciation_vi: "KOS", pronunciation_en: "KOS" },
      { word: "pemilik", en: "owner", vi: "chủ sở hữu", pos: "noun", pronunciation_vi: "pe-MI-lik", pronunciation_en: "puh-MEE-lik" },
      { word: "deposit", en: "deposit", vi: "tiền cọc", pos: "noun", pronunciation_vi: "de-PO-sit", pronunciation_en: "deh-POH-sit" },
      { word: "daerah", en: "area, region", vi: "khu vực, vùng", pos: "noun", pronunciation_vi: "da-E-rah", pronunciation_en: "dah-EH-rah" },
    ],
    dialogue: [
      { speaker: "Sari", text: "Katanya kamu mau pindah rumah?", vi: "Nghe nói cậu định chuyển nhà à?", en: "I heard you're moving house?" },
      { speaker: "Andi", text: "Iya, bulan depan. Rumah baru lebih dekat ke kantor.", vi: "Ừ, tháng sau. Nhà mới gần văn phòng hơn.", en: "Yeah, next month. The new place is closer to the office." },
      { speaker: "Sari", text: "Sudah bilang ibu kos belum?", vi: "Báo bà chủ trọ chưa?", en: "Have you told the landlady yet?" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "pindah", answer: "chuyển, dời" },
          { prompt: "kos", answer: "nhà trọ" },
          { prompt: "deposit", answer: "tiền cọc" },
          { prompt: "pemilik", answer: "chủ sở hữu" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Packing — kardus & barang
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_moving_packing_kardus",
    level: "A2",
    category: "housing",
    title_vi: "Đóng gói — thùng carton và đồ đạc",
    title_en: "Packing — boxes & belongings",
    sentences: [
      {
        en: "Saya membungkus semua barang ke dalam kardus.",
        vi: "Tôi gói tất cả đồ đạc vào thùng carton.",
        pronunciation_focus: [
          "membungkus → mem-BUNG-kus = gói, bọc (meN- + bungkus); 'ng' giữa",
          "barang → BA-rang = đồ đạc, hàng hóa; 'ng' cuối",
          "ke dalam → KE DA-lam = vào trong",
          "kardus → KAR-dus = thùng carton, hộp giấy",
        ],
        pronunciation_focus_en: [
          "membungkus → 'mem-BOONG-koos' = to wrap/pack (meN- + bungkus); medial 'ng'",
          "barang → 'BAH-rang' = belongings/goods; final 'ng'",
          "ke dalam → 'kuh DAH-lam' = into",
          "kardus → 'KAR-doos' = cardboard box",
        ],
      },
      {
        en: "Tolong beri label di setiap kardus biar tidak tertukar.",
        vi: "Làm ơn dán nhãn mỗi thùng để khỏi lẫn lộn.",
        pronunciation_focus: [
          "beri label → BE-ri LA-bel = dán nhãn, ghi nhãn",
          "setiap → se-TI-ap = mỗi",
          "biar → BI-ar = để cho (gaul của 'supaya')",
          "tertukar → ter-TU-kar = bị lẫn, đổi nhầm (ter- = ngẫu nhiên)",
        ],
        pronunciation_focus_en: [
          "beri label → 'BUH-ree LAH-bel' = to label",
          "setiap → 'suh-TEE-ap' = each/every",
          "biar → 'BEE-ar' = so that (slang for 'supaya')",
          "tertukar → 'ter-TOO-kar' = to get mixed up/swapped (ter- = accidental)",
        ],
      },
      {
        en: "Barang yang mudah pecah harus dibungkus dengan hati-hati.",
        vi: "Đồ dễ vỡ phải được gói cẩn thận.",
        pronunciation_focus: [
          "mudah pecah → MU-dah pe-CAH = dễ vỡ; 'c' = 'ch' → 'pe-chah'",
          "dibungkus → di-BUNG-kus = được gói (thụ động di-)",
          "dengan hati-hati → một cách cẩn thận (từ lặp)",
          "harus → HA-rus = phải",
        ],
        pronunciation_focus_en: [
          "mudah pecah → 'MOO-dah puh-CHAH' = fragile/easily broken; 'c' = 'ch'",
          "dibungkus → 'dee-BOONG-koos' = to be wrapped (passive di-)",
          "dengan hati-hati → carefully (reduplication)",
          "harus → 'HAH-roos' = must",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi dọn nhà, 'kardus' (thùng carton) là vật dụng số một — người ta hay xin lại thùng từ siêu thị (Indomaret, Alfamart) hoặc cửa hàng. Dán 'label' (nhãn) lên mỗi thùng để biết đồ gì bên trong và 'biar tidak tertukar' (để khỏi lẫn). Đồ 'mudah pecah' (dễ vỡ — chén bát, kính) cần bọc kỹ bằng giấy báo hoặc 'bubble wrap'. Lưu ý cấu trúc ngữ pháp quan trọng: tiền tố 'ter-' chỉ điều XẢY RA NGẪU NHIÊN, ngoài ý muốn — 'tertukar' (bị lẫn nhầm), 'terjatuh' (bị rơi), 'terpecah' (bị vỡ). Khác 'di-' (thụ động cố ý: dibungkus = được gói). Người Việt phân biệt qua 'bị' (xui rủi) vs 'được' (chủ động) — logic tương đồng.",
    cultural_notes_en:
      "When moving, 'kardus' (cardboard boxes) are essential — people often grab spare boxes from minimarkets (Indomaret, Alfamart) or shops. Put a 'label' on each box so you know what's inside and 'biar tidak tertukar' (so they don't get mixed up). 'Mudah pecah' items (fragile — dishes, glass) need careful wrapping in newspaper or bubble wrap. Note a key grammar point: the 'ter-' prefix marks ACCIDENTAL, unintended events — 'tertukar' (got swapped), 'terjatuh' (fell), 'terpecah' (got broken). This differs from 'di-' (deliberate passive: dibungkus = was wrapped). Vietnamese distinguishes via 'bị' (unlucky) vs 'được' (intended) — similar logic.",
    tip_advice_vi:
      "Cặp tiền tố quan trọng: 'di-' (thụ động cố ý: dibungkus = được gói) vs 'ter-' (ngẫu nhiên ngoài ý: tertukar = bị lẫn nhầm). Giống 'được' vs 'bị' tiếng Việt. 'c' = 'ch': pecah. 'biar' = 'supaya' (để) trong văn nói. Xin 'kardus' miễn phí ở Indomaret/Alfamart.",
    tip_advice_en:
      "Key prefix pair: 'di-' (deliberate passive: dibungkus = was wrapped) vs 'ter-' (accidental: tertukar = got mixed up). Like Vietnamese 'được' vs 'bị'. 'c' = 'ch': pecah. 'biar' = 'supaya' (so that) in speech. Grab free 'kardus' at Indomaret/Alfamart.",
    vocabulary: [
      { word: "kardus", en: "cardboard box", vi: "thùng carton", pos: "noun", pronunciation_vi: "KAR-dus", pronunciation_en: "KAR-doos" },
      { word: "barang", en: "belongings, goods", vi: "đồ đạc", pos: "noun", pronunciation_vi: "BA-rang", pronunciation_en: "BAH-rang" },
      { word: "membungkus", en: "to wrap, pack", vi: "gói, bọc", pos: "verb", pronunciation_vi: "mem-BUNG-kus", pronunciation_en: "mem-BOONG-koos" },
      { word: "label", en: "label", vi: "nhãn", pos: "noun", pronunciation_vi: "LA-bel", pronunciation_en: "LAH-bel" },
      { word: "mudah pecah", en: "fragile", vi: "dễ vỡ", pos: "adjective phrase", pronunciation_vi: "MU-dah pe-CAH", pronunciation_en: "MOO-dah puh-CHAH" },
      { word: "tertukar", en: "got mixed up, swapped", vi: "bị lẫn nhầm", pos: "verb", pronunciation_vi: "ter-TU-kar", pronunciation_en: "ter-TOO-kar" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền 'di-' (cố ý) hoặc 'ter-' (ngẫu nhiên):",
        instruction_en: "Fill 'di-' (deliberate) or 'ter-' (accidental):",
        items: [
          { prompt: "Barang ___bungkus rapi. (được gói gọn)", answer: "di", options: ["di", "ter"] },
          { prompt: "Kardusnya ___tukar dengan tetangga. (bị lẫn)", answer: "ter", options: ["di", "ter"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. Hiring movers — ekspedisi / jasa pindahan
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_moving_jasa_pindahan",
    level: "B1",
    category: "housing",
    title_vi: "Thuê dịch vụ vận chuyển — ekspedisi / jasa pindahan",
    title_en: "Hiring movers — ekspedisi / jasa pindahan",
    sentences: [
      {
        en: "Saya menyewa jasa pindahan untuk mengangkut barang.",
        vi: "Tôi thuê dịch vụ chuyển nhà để vận chuyển đồ.",
        pronunciation_focus: [
          "menyewa → me-nye-WA = thuê (meN- + sewa); 'ny' = 'nh'",
          "jasa → JA-sa = dịch vụ",
          "jasa pindahan → dịch vụ chuyển nhà",
          "mengangkut → me-ngang-KUT = vận chuyển, khuân (meN- + angkut)",
        ],
        pronunciation_focus_en: [
          "menyewa → 'muh-nyuh-WAH' = to rent/hire (meN- + sewa); 'ny' = ñ",
          "jasa → 'JAH-sah' = service",
          "jasa pindahan → moving service/movers",
          "mengangkut → 'muh-ngang-KOOT' = to transport/haul (meN- + angkut)",
        ],
      },
      {
        en: "Berapa biaya untuk pindah dari Jakarta ke Bandung?",
        vi: "Chi phí chuyển từ Jakarta đến Bandung là bao nhiêu?",
        pronunciation_focus: [
          "berapa → be-RA-pa = bao nhiêu (hỏi số lượng/giá)",
          "biaya → bi-A-ya = chi phí",
          "untuk → UN-tuk = để, cho",
          "dari ... ke ... → từ ... đến ...",
        ],
        pronunciation_focus_en: [
          "berapa → 'buh-RAH-pah' = how much/many",
          "biaya → 'bee-AH-yah' = cost/fee",
          "untuk → 'OON-took' = for/to",
          "dari ... ke ... → from ... to ...",
        ],
      },
      {
        en: "Tolong hati-hati, ada barang yang berat dan besar.",
        vi: "Làm ơn cẩn thận, có đồ vừa nặng vừa to.",
        pronunciation_focus: [
          "hati-hati → HA-ti HA-ti = cẩn thận (từ lặp)",
          "berat → be-RAT = nặng",
          "besar → be-SAR = to, lớn",
          "ada → A-da = có",
        ],
        pronunciation_focus_en: [
          "hati-hati → 'HAH-tee HAH-tee' = careful (reduplication)",
          "berat → 'buh-RAT' = heavy",
          "besar → 'buh-SAR' = big",
          "ada → 'AH-dah' = there is/are",
        ],
      },
    ],
    cultural_notes_vi:
      "Để chuyển nhà ở Indonesia, có nhiều lựa chọn: 'jasa pindahan' (dịch vụ chuyển nhà trọn gói, có người khuân), 'ekspedisi' (công ty vận chuyển hàng — như Deliveree, GoBox), hay đơn giản thuê 'pikap' (xe bán tải) cùng 'kuli angkut' (người khuân vác). Giá tính theo khoảng cách và khối lượng — luôn hỏi 'Berapa biayanya?' (Chi phí bao nhiêu?) và mặc cả ('nego'). Với quãng đường xa (liên thành phố), dùng ekspedisi rẻ hơn. Người Việt nên biết: nhiều dịch vụ đặt qua app, thanh toán 'cash' hoặc e-wallet (OVO, GoPay). Từ vựng hỏi giá 'berapa' (bao nhiêu) cực kỳ thông dụng — dùng cho cả mua sắm lẫn dịch vụ. Đừng quên dặn 'hati-hati' (cẩn thận) với đồ dễ vỡ và nặng.",
    cultural_notes_en:
      "To move house in Indonesia, options include: 'jasa pindahan' (full-service movers who carry everything), 'ekspedisi' (freight/logistics companies — like Deliveree, GoBox), or simply renting a 'pikap' (pickup truck) with 'kuli angkut' (porters). Prices depend on distance and volume — always ask 'Berapa biayanya?' (How much does it cost?) and negotiate ('nego'). For long distances (inter-city), ekspedisi is cheaper. Vietnamese learners should note many services are booked via app and paid by cash or e-wallet (OVO, GoPay). The price-asking word 'berapa' (how much) is extremely common — used for both shopping and services. Don't forget to say 'hati-hati' (careful) for fragile and heavy items.",
    tip_advice_vi:
      "Từ vàng hỏi giá: 'Berapa biayanya?' (Chi phí bao nhiêu?). 'menyewa' (thuê) có 'ny'='nh' — dễ với người Việt. 'jasa' = dịch vụ. Cấu trúc 'dari X ke Y' = từ X đến Y. Mặc cả gọi là 'nego'. Dặn 'hati-hati' với đồ nặng/dễ vỡ.",
    tip_advice_en:
      "Gold price-asking line: 'Berapa biayanya?' (How much?). 'menyewa' (to hire) has 'ny'=ñ — easy for Vietnamese. 'jasa' = service. Structure 'dari X ke Y' = from X to Y. Haggling is 'nego'. Say 'hati-hati' for heavy/fragile items.",
    vocabulary: [
      { word: "jasa pindahan", en: "moving service, movers", vi: "dịch vụ chuyển nhà", pos: "noun phrase", pronunciation_vi: "JA-sa pin-DA-han", pronunciation_en: "JAH-sah pin-DAH-han" },
      { word: "ekspedisi", en: "freight/logistics company", vi: "công ty vận chuyển", pos: "noun", pronunciation_vi: "eks-pe-DI-si", pronunciation_en: "eks-puh-DEE-see" },
      { word: "menyewa", en: "to rent, hire", vi: "thuê", pos: "verb", pronunciation_vi: "me-nye-WA", pronunciation_en: "muh-nyuh-WAH" },
      { word: "mengangkut", en: "to transport, haul", vi: "vận chuyển, khuân", pos: "verb", pronunciation_vi: "me-ngang-KUT", pronunciation_en: "muh-ngang-KOOT" },
      { word: "biaya", en: "cost, fee", vi: "chi phí", pos: "noun", pronunciation_vi: "bi-A-ya", pronunciation_en: "bee-AH-yah" },
      { word: "berat", en: "heavy", vi: "nặng", pos: "adjective", pronunciation_vi: "be-RAT", pronunciation_en: "buh-RAT" },
    ],
    dialogue: [
      { speaker: "Pelanggan", text: "Halo, saya mau pindahan. Berapa biaya ke Bandung?", vi: "Alô, tôi muốn chuyển nhà. Chi phí đến Bandung bao nhiêu?", en: "Hello, I want to move house. How much to Bandung?" },
      { speaker: "Petugas", text: "Tergantung jumlah barang, Bu. Kira-kira satu juta.", vi: "Tùy số lượng đồ ạ. Khoảng một triệu.", en: "It depends on the amount of stuff, ma'am. Around one million." },
      { speaker: "Pelanggan", text: "Oke. Tolong hati-hati ya, ada barang yang mudah pecah.", vi: "Ok. Làm ơn cẩn thận nhé, có đồ dễ vỡ.", en: "Okay. Please be careful, there are fragile items." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chi phí chuyển đến Bandung là bao nhiêu?", answer: "Berapa biaya pindah ke Bandung?" },
          { prompt: "Tôi thuê dịch vụ chuyển nhà.", answer: "Saya menyewa jasa pindahan." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. New address & registering with RT/RW
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_moving_alamat_rtrw",
    level: "B1",
    category: "housing",
    title_vi: "Địa chỉ mới & đăng ký với RT/RW",
    title_en: "New address & registering with the RT/RW",
    sentences: [
      {
        en: "Saya harus melapor ke Pak RT setelah pindah.",
        vi: "Tôi phải trình báo với bác tổ trưởng dân phố sau khi chuyển đến.",
        pronunciation_focus: [
          "melapor → me-LA-por = trình báo, khai báo (meN- + lapor)",
          "Pak RT → PAK ER-TE = bác tổ trưởng RT (Rukun Tetangga)",
          "RT → đọc 'er-te'; RW → đọc 'er-we'",
          "setelah → se-te-LAH = sau khi",
        ],
        pronunciation_focus_en: [
          "melapor → 'muh-LAH-por' = to report/register (meN- + lapor)",
          "Pak RT → 'PAK er-TEH' = the RT neighbourhood head (Rukun Tetangga)",
          "RT → say 'er-teh'; RW → say 'er-weh'",
          "setelah → 'suh-tuh-LAH' = after",
        ],
      },
      {
        en: "Alamat baru saya di Jalan Melati nomor lima.",
        vi: "Địa chỉ mới của tôi ở đường Melati số năm.",
        pronunciation_focus: [
          "alamat → a-LA-mat = địa chỉ",
          "Jalan → JA-lan = đường (viết tắt 'Jl.')",
          "nomor → NO-mor = số",
          "lima → LI-ma = năm (số 5)",
        ],
        pronunciation_focus_en: [
          "alamat → 'ah-LAH-mat' = address",
          "Jalan → 'JAH-lan' = street/road (abbreviated 'Jl.')",
          "nomor → 'NOH-mor' = number",
          "lima → 'LEE-mah' = five",
        ],
      },
      {
        en: "Saya perlu mengurus surat pindah dan KTP baru.",
        vi: "Tôi cần làm giấy chuyển hộ khẩu và CMND mới.",
        pronunciation_focus: [
          "mengurus → me-ngu-RUS = lo liệu, làm thủ tục (meN- + urus); 'ngu'",
          "surat → SU-rat = giấy tờ, thư",
          "surat pindah → giấy báo chuyển nơi cư trú",
          "KTP → KA-TE-PE = chứng minh nhân dân (Kartu Tanda Penduduk)",
        ],
        pronunciation_focus_en: [
          "mengurus → 'muh-ngoo-ROOS' = to take care of/process (meN- + urus)",
          "surat → 'SOO-rat' = letter/document",
          "surat pindah → a change-of-residence letter",
          "KTP → 'kah-teh-PEH' = national ID card (Kartu Tanda Penduduk)",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi chuyển đến nơi ở mới ở Indonesia, BẮT BUỘC phải 'melapor' (trình báo) với 'Pak RT' (tổ trưởng RT) trong vài ngày đầu. RT (Rukun Tetangga) là đơn vị hành chính nhỏ nhất — khoảng 30-50 hộ; nhiều RT họp thành RW (Rukun Warga). Đây giống 'tổ dân phố' của Việt Nam. Bạn cần 'surat pindah' (giấy chuyển hộ khẩu) từ nơi cũ và làm 'KTP' (CMND) mới với địa chỉ mới. Pak RT giúp xác nhận giấy tờ, thông báo bạn với hàng xóm, và mời bạn vào nhóm WhatsApp khu phố. Người nước ngoài (kể cả người Việt sống ở Indonesia) cũng phải báo RT — bỏ qua bước này có thể gây rắc rối khi cần giấy tờ. Địa chỉ Indonesia ghi: Jalan (đường) + nomor (số) + RT/RW + kelurahan (phường) + kecamatan (quận).",
    cultural_notes_en:
      "When you move to a new home in Indonesia, you MUST 'melapor' (report) to 'Pak RT' (the RT head) within the first few days. RT (Rukun Tetangga) is the smallest administrative unit — about 30–50 households; several RTs form an RW (Rukun Warga). It's like Vietnam's neighbourhood unit ('tổ dân phố'). You need a 'surat pindah' (change-of-residence letter) from your old place and a new 'KTP' (ID card) with the new address. Pak RT verifies documents, introduces you to neighbours, and adds you to the neighbourhood WhatsApp group. Foreigners (including Vietnamese living in Indonesia) must also report to the RT — skipping this can cause paperwork trouble. An Indonesian address reads: Jalan (street) + nomor (number) + RT/RW + kelurahan (ward) + kecamatan (district).",
    tip_advice_vi:
      "RT đọc 'er-te', RW đọc 'er-we'. 'melapor ke Pak RT' (trình báo tổ trưởng) là việc đầu tiên khi chuyển đến. 'mengurus' (làm thủ tục) + surat/KTP. Cấu trúc địa chỉ: Jalan + nomor + RT/RW. Người Việt: RT ≈ tổ dân phố. Đừng bỏ qua bước báo RT.",
    tip_advice_en:
      "RT = 'er-teh', RW = 'er-weh'. 'melapor ke Pak RT' (report to the RT head) is the first task when you move in. 'mengurus' (to process) + surat/KTP. Address format: Jalan + nomor + RT/RW. For Vietnamese: RT ≈ tổ dân phố. Don't skip reporting to the RT.",
    vocabulary: [
      { word: "alamat", en: "address", vi: "địa chỉ", pos: "noun", pronunciation_vi: "a-LA-mat", pronunciation_en: "ah-LAH-mat" },
      { word: "RT (Rukun Tetangga)", en: "neighbourhood unit", vi: "tổ dân phố", pos: "noun", pronunciation_vi: "ER-TE", pronunciation_en: "er-TEH" },
      { word: "RW (Rukun Warga)", en: "larger neighbourhood unit", vi: "khu phố (gồm nhiều RT)", pos: "noun", pronunciation_vi: "ER-WE", pronunciation_en: "er-WEH" },
      { word: "melapor", en: "to report, register", vi: "trình báo", pos: "verb", pronunciation_vi: "me-LA-por", pronunciation_en: "muh-LAH-por" },
      { word: "surat pindah", en: "change-of-residence letter", vi: "giấy chuyển hộ khẩu", pos: "noun phrase", pronunciation_vi: "SU-rat PIN-dah", pronunciation_en: "SOO-rat PIN-dah" },
      { word: "KTP", en: "national ID card", vi: "chứng minh nhân dân", pos: "noun", pronunciation_vi: "KA-TE-PE", pronunciation_en: "kah-teh-PEH" },
    ],
    dialogue: [
      { speaker: "Penghuni baru", text: "Permisi Pak, saya warga baru. Mau lapor pindah.", vi: "Xin phép bác, tôi là cư dân mới. Muốn trình báo chuyển đến.", en: "Excuse me sir, I'm a new resident. I'd like to report my move." },
      { speaker: "Pak RT", text: "Oh, selamat datang! Bawa surat pindah dan KTP, ya.", vi: "Ồ, chào mừng! Mang theo giấy chuyển và CMND nhé.", en: "Oh, welcome! Bring your change-of-residence letter and ID." },
      { speaker: "Penghuni baru", text: "Sudah saya bawa, Pak. Terima kasih.", vi: "Tôi mang theo rồi ạ. Cảm ơn bác.", en: "I've brought them, sir. Thank you." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ thủ tục chuyển nhà:",
        instruction_en: "Fill the moving-paperwork word:",
        items: [
          { prompt: "Saya harus ___ ke Pak RT. (trình báo)", answer: "melapor", options: ["melapor", "membungkus", "menyewa"] },
          { prompt: "Saya perlu ___ pindah dan KTP. (giấy)", answer: "surat", options: ["surat", "kardus", "biaya"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. New neighbours — tetangga baru
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_moving_tetangga_baru",
    level: "A2",
    category: "housing",
    title_vi: "Hàng xóm mới — tetangga baru",
    title_en: "New neighbours — tetangga baru",
    sentences: [
      {
        en: "Selamat siang, saya tetangga baru di sebelah.",
        vi: "Chào buổi trưa, tôi là hàng xóm mới ở bên cạnh.",
        pronunciation_focus: [
          "tetangga → te-TANG-ga = hàng xóm; 'ngg' = ng + g",
          "baru → BA-ru = mới",
          "di sebelah → di se-be-LAH = ở bên cạnh",
          "selamat siang → chào buổi trưa",
        ],
        pronunciation_focus_en: [
          "tetangga → 'tuh-TANG-gah' = neighbour; 'ngg' = ng + g",
          "baru → 'BAH-roo' = new",
          "di sebelah → 'dee suh-buh-LAH' = next door",
          "selamat siang → good afternoon",
        ],
      },
      {
        en: "Perkenalkan, nama saya Mai, dari Vietnam.",
        vi: "Xin tự giới thiệu, tôi tên Mai, đến từ Việt Nam.",
        pronunciation_focus: [
          "perkenalkan → per-ke-NAL-kan = xin giới thiệu (per- + kenal + -kan)",
          "nama saya → tên tôi là",
          "dari → DA-ri = từ, đến từ",
          "Vietnam → vi-et-NAM (người Indonesia đọc 'Vietnam')",
        ],
        pronunciation_focus_en: [
          "perkenalkan → 'per-kuh-NAL-kan' = allow me to introduce (per- + kenal + -kan)",
          "nama saya → my name is",
          "dari → 'DAH-ree' = from",
          "Vietnam → 'vee-et-NAM'",
        ],
      },
      {
        en: "Kalau butuh apa-apa, jangan sungkan minta tolong ya.",
        vi: "Nếu cần gì, đừng ngại nhờ giúp nhé.",
        pronunciation_focus: [
          "kalau → KA-lau = nếu",
          "butuh apa-apa → cần bất cứ thứ gì (từ lặp 'apa-apa' = thứ gì)",
          "jangan sungkan → JA-ngan SUNG-kan = đừng ngại ngùng",
          "minta tolong → MIN-ta TO-long = nhờ giúp đỡ",
        ],
        pronunciation_focus_en: [
          "kalau → 'KAH-lau' = if",
          "butuh apa-apa → to need anything ('apa-apa' reduplication = anything)",
          "jangan sungkan → 'JAH-ngan SOONG-kan' = don't hesitate/feel shy",
          "minta tolong → 'MIN-tah TOH-long' = to ask for help",
        ],
      },
    ],
    cultural_notes_vi:
      "Làm quen với 'tetangga baru' (hàng xóm mới) là bước quan trọng để hòa nhập ở Indonesia — nơi tinh thần 'gotong royong' (tương trợ cộng đồng) rất mạnh. Phong tục đẹp: người mới chuyển đến thường mang 'oleh-oleh' (quà nhỏ — bánh, trái cây) sang chào hàng xóm, hoặc tổ chức 'syukuran' (tiệc tạ ơn nhỏ) mời hàng xóm tới. Câu 'jangan sungkan' (đừng ngại) thể hiện sự thân thiện cởi mở — 'sungkan' là một khái niệm văn hóa Indonesia: cảm giác ngại làm phiền/e dè người khác. Người Việt rất hiểu 'sungkan' vì giống 'ngại', 'cả nể'. Tham gia nhóm WhatsApp khu phố, đi 'kerja bakti' (lao động chung) cuối tuần sẽ giúp bạn được chấp nhận nhanh. Đừng sống khép kín — bị coi là 'sombong' (kiêu, xa cách).",
    cultural_notes_en:
      "Meeting your 'tetangga baru' (new neighbours) is a key step to fitting in in Indonesia, where 'gotong royong' (communal cooperation) runs deep. A nice custom: new arrivals often bring 'oleh-oleh' (small gifts — snacks, fruit) to greet neighbours, or host a small 'syukuran' (thanksgiving gathering) for them. The line 'jangan sungkan' (don't hesitate) signals warmth — 'sungkan' is an Indonesian cultural concept: the reluctance to impose on or trouble others. Vietnamese learners grasp 'sungkan' easily, like 'ngại' or 'cả nể'. Joining the neighbourhood WhatsApp group and attending weekend 'kerja bakti' (community work) earns acceptance fast. Don't keep to yourself — that reads as 'sombong' (arrogant/aloof).",
    tip_advice_vi:
      "'tetangga' (hàng xóm) có 'ngg' = ng+g (tang-ga). 'perkenalkan' (xin giới thiệu) mở đầu lời chào. 'jangan sungkan' (đừng ngại) — 'sungkan' giống 'ngại/cả nể' tiếng Việt. Mang 'oleh-oleh' (quà nhỏ) sang chào hàng xóm. Tránh bị coi là 'sombong'. Từ lặp 'apa-apa' = thứ gì/bất cứ gì.",
    tip_advice_en:
      "'tetangga' (neighbour) has 'ngg' = ng+g (tang-ga). 'perkenalkan' (let me introduce) opens a greeting. 'jangan sungkan' (don't hesitate) — 'sungkan' is like Vietnamese 'ngại/cả nể'. Bring 'oleh-oleh' (small gifts) to greet neighbours. Avoid seeming 'sombong'. Reduplication 'apa-apa' = anything.",
    vocabulary: [
      { word: "tetangga", en: "neighbour", vi: "hàng xóm", pos: "noun", pronunciation_vi: "te-TANG-ga", pronunciation_en: "tuh-TANG-gah" },
      { word: "perkenalkan", en: "allow me to introduce", vi: "xin giới thiệu", pos: "verb", pronunciation_vi: "per-ke-NAL-kan", pronunciation_en: "per-kuh-NAL-kan" },
      { word: "sebelah", en: "next door, beside", vi: "bên cạnh", pos: "noun/adverb", pronunciation_vi: "se-be-LAH", pronunciation_en: "suh-buh-LAH" },
      { word: "sungkan", en: "hesitant, reluctant to impose", vi: "ngại, cả nể", pos: "adjective", pronunciation_vi: "SUNG-kan", pronunciation_en: "SOONG-kan" },
      { word: "oleh-oleh", en: "small gift/souvenir", vi: "quà nhỏ", pos: "noun", pronunciation_vi: "O-leh O-leh", pronunciation_en: "OH-leh OH-leh" },
      { word: "minta tolong", en: "to ask for help", vi: "nhờ giúp đỡ", pos: "verb phrase", pronunciation_vi: "MIN-ta TO-long", pronunciation_en: "MIN-tah TOH-long" },
    ],
    dialogue: [
      { speaker: "Mai", text: "Selamat sore, Bu. Perkenalkan, saya Mai, baru pindah ke sebelah.", vi: "Chào buổi chiều cô. Xin giới thiệu, tôi là Mai, mới chuyển đến bên cạnh.", en: "Good afternoon, ma'am. Let me introduce myself, I'm Mai, just moved in next door." },
      { speaker: "Bu Ani", text: "Oh, selamat datang! Ini ada sedikit oleh-oleh, dimakan ya.", vi: "Ồ, chào mừng! Đây có chút quà, ăn nhé.", en: "Oh, welcome! Here's a little gift, please enjoy it." },
      { speaker: "Mai", text: "Wah, terima kasih banyak. Kalau butuh apa-apa, jangan sungkan ya, Bu.", vi: "Ôi, cảm ơn cô nhiều. Nếu cần gì, cô đừng ngại nhé.", en: "Oh, thank you so much. If you need anything, don't hesitate, ma'am." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Xin giới thiệu, tôi là hàng xóm mới ở bên cạnh.", answer: "Perkenalkan, saya tetangga baru di sebelah." },
          { prompt: "Nếu cần gì, đừng ngại nhờ giúp nhé.", answer: "Kalau butuh apa-apa, jangan sungkan minta tolong ya." },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "tetangga", answer: "hàng xóm" },
          { prompt: "sungkan", answer: "ngại, cả nể" },
          { prompt: "oleh-oleh", answer: "quà nhỏ" },
          { prompt: "sebelah", answer: "bên cạnh" },
        ],
      },
    ],
  },
];

export default lessons;
