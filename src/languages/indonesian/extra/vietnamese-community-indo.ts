// src/languages/indonesian/extra/vietnamese-community-indo.ts
//
// Indonesian pack for Vietnamese people LIVING IN Indonesia. The most
// Vietnamese-first file in the set: how to find Vietnamese food (phở, bánh mì,
// cà phê) in Jakarta, how to find and talk about the Vietnamese community
// (komunitas, kedutaan, vihara/kuil), and how to explain and celebrate Tết in an
// Indonesian setting. Hand-crafted, no filler.
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

export const vietnameseCommunityIndoLessons: IndonesianLesson[] = [
  {
    id: "indonesian_finding_vietnamese_food",
    level: "A2",
    category: "vietnamese_community",
    title_vi: "Tìm món Việt ở Jakarta — phở, bánh mì, cà phê",
    title_en: "Finding Vietnamese food in Jakarta — phở, bánh mì, coffee",
    sentences: [
      {
        en: "Apakah ada restoran Vietnam di dekat sini?",
        vi: "Có nhà hàng Việt Nam gần đây không?",
        pronunciation_focus: [
          "restoran → res-tô-RAN, 'nhà hàng'",
          "Vietnam → 'Vietnam' (Indonesia gọi đất nước là 'Vietnam')",
          "di dekat sini → 'ở gần đây'",
        ],
        pronunciation_focus_en: [
          "restoran → 'res-toh-RAN' — restaurant",
          "Vietnam → Indonesians call the country 'Vietnam'",
          "di dekat sini → 'near here'",
        ],
      },
      {
        en: "Saya rindu makan pho dan banh mi dari kampung halaman.",
        vi: "Tôi nhớ ăn phở và bánh mì quê nhà.",
        pronunciation_focus: [
          "rindu → RIN-du, 'nhớ (nhung)'",
          "pho / banh mi → người Indonesia viết không dấu, đọc gần như tiếng Việt",
          "kampung halaman → 'quê nhà' (cụm cố định)",
        ],
        pronunciation_focus_en: [
          "rindu → 'RIN-doo' — to miss/long for",
          "pho / banh mi → Indonesians write these without diacritics; pronounced close to Vietnamese",
          "kampung halaman → 'hometown' (a fixed phrase)",
        ],
      },
      {
        en: "Kuah pho ini hampir sama dengan di Vietnam.",
        vi: "Nước dùng phở này gần giống ở Việt Nam.",
        pronunciation_focus: [
          "kuah → KU-ah, 'nước dùng/nước lèo'",
          "hampir sama → 'gần giống' (hampir = gần, sama = giống)",
          "dengan → 'với'; sama dengan = giống như",
        ],
        pronunciation_focus_en: [
          "kuah → 'KOO-ah' — broth/soup liquid",
          "hampir sama → 'almost the same' (hampir = nearly, sama = same)",
          "dengan → 'with'; sama dengan = the same as",
        ],
      },
      {
        en: "Tolong jangan terlalu manis, orang Vietnam suka rasa segar.",
        vi: "Làm ơn đừng quá ngọt, người Việt thích vị thanh.",
        pronunciation_focus: [
          "jangan terlalu manis → 'đừng quá ngọt'",
          "orang Vietnam → 'người Việt Nam' (orang = người)",
          "rasa segar → 'vị tươi/thanh' (rasa = vị)",
        ],
        pronunciation_focus_en: [
          "jangan terlalu manis → 'not too sweet, please'",
          "orang Vietnam → 'Vietnamese people' (orang = person)",
          "rasa segar → 'fresh taste' (rasa = taste)",
        ],
      },
      {
        en: "Di mana saya bisa beli kopi Vietnam dan saus ikan?",
        vi: "Tôi mua cà phê Việt Nam và nước mắm ở đâu?",
        pronunciation_focus: [
          "kopi Vietnam → 'cà phê Việt Nam' (kopi = cà phê)",
          "saus ikan → 'nước mắm' (saus = nước sốt, ikan = cá)",
          "di mana … bisa beli → 'mua … ở đâu'",
        ],
        pronunciation_focus_en: [
          "kopi Vietnam → 'Vietnamese coffee' (kopi = coffee)",
          "saus ikan → 'fish sauce' (saus = sauce, ikan = fish)",
          "di mana … bisa beli → 'where can I buy …'",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Jakarta và một số thành phố lớn (Bandung, Surabaya, Bali) có nhà hàng Việt — tìm bằng từ khoá 'restoran Vietnam', 'pho', 'banh mi' trên GoFood/GrabFood. Người Indonesia viết tên món không dấu (pho, banh mi, goi cuon) và thường biết 'pho' nhờ phổ biến toàn cầu. Khẩu vị Indonesia ngọt và cay hơn, nên dặn 'jangan terlalu manis' (đừng quá ngọt) nếu muốn vị Việt. 'Nước mắm' dịch là 'saus ikan' hoặc giữ nguyên 'nuoc mam'; mua được ở siêu thị lớn hoặc cửa hàng đồ châu Á.",
    cultural_notes_en:
      "Jakarta and several big cities (Bandung, Surabaya, Bali) have Vietnamese restaurants — search 'restoran Vietnam', 'pho', 'banh mi' on GoFood/GrabFood. Indonesians write dish names without diacritics (pho, banh mi, goi cuon) and often recognize 'pho' from its global fame. Indonesian palates skew sweeter and spicier, so say 'jangan terlalu manis' (not too sweet) for an authentic Vietnamese taste. 'Fish sauce' is rendered 'saus ikan' or kept as 'nuoc mam'; find it in big supermarkets or Asian grocers.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'rindu' (nhớ nhung) là từ rất dễ nhớ và dùng được cho cả người lẫn món ăn quê — 'rindu pho', 'rindu keluarga'. So sánh 'giống như' dùng 'sama dengan': 'sama dengan di Vietnam' (giống như ở Việt Nam). Để dặn vị, ghép 'jangan terlalu + tính từ': jangan terlalu manis/pedas/asin. Tên nước mình là 'Vietnam' (một từ, không dấu) trong tiếng Indonesia.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'rindu' (to long for) is easy to remember and works for people and homeland food alike — 'rindu pho', 'rindu keluarga'. The comparison 'the same as' uses 'sama dengan': 'sama dengan di Vietnam'. To tune a flavor, use 'jangan terlalu + adjective': jangan terlalu manis/pedas/asin. Your country's name is 'Vietnam' (one word, no diacritics) in Indonesian.",
    vocabulary: [
      {
        word: "restoran",
        en: "restaurant",
        vi: "nhà hàng",
        pos: "noun",
        pronunciation_vi: "res-tô-RAN",
        pronunciation_en: "res-toh-RAN",
      },
      {
        word: "rindu",
        en: "to miss / long for",
        vi: "nhớ (nhung)",
        pos: "verb",
        pronunciation_vi: "RIN-du",
        pronunciation_en: "RIN-doo",
      },
      {
        word: "kuah",
        en: "broth / soup liquid",
        vi: "nước dùng / nước lèo",
        pos: "noun",
        pronunciation_vi: "KU-ah",
        pronunciation_en: "KOO-ah",
      },
      {
        word: "kopi",
        en: "coffee",
        vi: "cà phê",
        pos: "noun",
        pronunciation_vi: "KÔ-pi",
        pronunciation_en: "KOH-pee",
      },
      {
        word: "saus ikan",
        en: "fish sauce",
        vi: "nước mắm",
        pos: "noun",
        pronunciation_vi: "SA-us I-kan",
        pronunciation_en: "SOWS EE-kan",
      },
      {
        word: "rasa",
        en: "taste / flavor",
        vi: "vị",
        pos: "noun",
        pronunciation_vi: "RA-sa",
        pronunciation_en: "RA-sa",
      },
      {
        word: "sama dengan",
        en: "the same as",
        vi: "giống như",
        pos: "phrase",
        pronunciation_vi: "SA-ma DENG-an",
        pronunciation_en: "SA-ma DENG-an",
      },
      {
        word: "orang Vietnam",
        en: "Vietnamese person",
        vi: "người Việt Nam",
        pos: "noun",
        pronunciation_vi: "Ô-rang Vietnam",
        pronunciation_en: "OH-rang Vietnam",
      },
    ],
    dialogue: [
      {
        speaker: "Linh",
        text: "Mas, apakah ada restoran Vietnam yang jual pho di sekitar sini?",
        vi: "Anh ơi, có nhà hàng Việt nào bán phở quanh đây không?",
        en: "Excuse me, is there a Vietnamese restaurant selling pho around here?",
      },
      {
        speaker: "Warga lokal",
        text: "Ada, di mal sebelah. Mbak orang Vietnam, ya?",
        vi: "Có, ở trung tâm thương mại bên cạnh. Chị là người Việt à?",
        en: "Yes, in the mall next door. You're Vietnamese, aren't you?",
      },
      {
        speaker: "Linh",
        text: "Iya. Saya rindu rasa kampung halaman. Kuah pho di sana enak?",
        vi: "Vâng. Tôi nhớ vị quê nhà. Nước phở ở đó ngon không?",
        en: "Yes. I miss the taste of home. Is the pho broth there good?",
      },
      {
        speaker: "Warga lokal",
        text: "Enak, hampir sama dengan aslinya. Tapi minta jangan terlalu manis, ya.",
        vi: "Ngon, gần giống bản gốc. Nhưng nhớ dặn đừng quá ngọt nhé.",
        en: "Good, almost like the original. But ask for it not too sweet.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về món Việt còn thiếu:",
        instruction_en: "Fill in the missing Vietnamese-food word:",
        items: [
          {
            prompt: "Apakah ada ___ Vietnam di dekat sini? (nhà hàng)",
            answer: "restoran",
            options: ["restoran", "rumah", "rapat"],
          },
          {
            prompt: "Saya ___ makan pho dari kampung halaman. (nhớ)",
            answer: "rindu",
            options: ["rindu", "ramai", "rajin"],
          },
          {
            prompt: "Kuah pho ini hampir ___ dengan di Vietnam. (giống)",
            answer: "sama",
            options: ["sama", "satu", "siap"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kuah", answer: "nước dùng" },
          { prompt: "kopi", answer: "cà phê" },
          { prompt: "saus ikan", answer: "nước mắm" },
          { prompt: "rindu", answer: "nhớ nhung" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Có nhà hàng Việt Nam gần đây không?", answer: "Apakah ada restoran Vietnam di dekat sini?" },
          { prompt: "Tôi nhớ ăn phở quê nhà.", answer: "Saya rindu makan pho dari kampung halaman." },
          { prompt: "Làm ơn đừng quá ngọt.", answer: "Tolong jangan terlalu manis." },
        ],
      },
    ],
  },
  {
    id: "indonesian_finding_vietnamese_community",
    level: "B1",
    category: "vietnamese_community",
    title_vi: "Tìm cộng đồng người Việt — đại sứ quán, hội nhóm, chùa",
    title_en: "Finding the Vietnamese community — embassy, groups, temple",
    sentences: [
      {
        en: "Saya mencari komunitas orang Vietnam di Jakarta.",
        vi: "Tôi đang tìm cộng đồng người Việt ở Jakarta.",
        pronunciation_focus: [
          "mencari → men-CHA-ri, 'tìm kiếm' (gốc cari)",
          "komunitas → ko-mu-ni-TAS, 'cộng đồng'",
          "đặt 'orang Vietnam' sau 'komunitas' — bổ nghĩa đặt SAU",
        ],
        pronunciation_focus_en: [
          "mencari → 'men-CHA-ree' — to look for (root 'cari')",
          "komunitas → 'ko-moo-nee-TAS' — community",
          "'orang Vietnam' follows 'komunitas' — modifiers come AFTER the head noun",
        ],
      },
      {
        en: "Di mana alamat Kedutaan Besar Vietnam?",
        vi: "Địa chỉ Đại sứ quán Việt Nam ở đâu?",
        pronunciation_focus: [
          "alamat → a-LA-mat, 'địa chỉ'",
          "Kedutaan Besar → 'Đại sứ quán' (kedutaan = sứ quán, besar = lớn)",
          "viết tắt KBRI/KBV cho sứ quán — nhưng nói đầy đủ vẫn hiểu",
        ],
        pronunciation_focus_en: [
          "alamat → 'a-LA-mat' — address",
          "Kedutaan Besar → 'Embassy' (kedutaan = legation, besar = great)",
          "the full phrase is always understood even if locals abbreviate",
        ],
      },
      {
        en: "Setiap akhir pekan kami berkumpul untuk makan bersama.",
        vi: "Mỗi cuối tuần chúng tôi tụ họp để ăn cùng nhau.",
        pronunciation_focus: [
          "akhir pekan → 'cuối tuần' (akhir = cuối, pekan = tuần)",
          "berkumpul → ber-KUM-pul, 'tụ họp' (gốc kumpul)",
          "makan bersama → 'ăn chung/cùng nhau'",
        ],
        pronunciation_focus_en: [
          "akhir pekan → 'weekend' (akhir = end, pekan = week)",
          "berkumpul → 'ber-KOOM-pool' — to gather (root 'kumpul')",
          "makan bersama → 'eat together'",
        ],
      },
      {
        en: "Banyak orang Vietnam pergi ke vihara untuk berdoa.",
        vi: "Nhiều người Việt đến chùa để cầu nguyện.",
        pronunciation_focus: [
          "vihara → vi-HA-ra, 'chùa (Phật giáo)'; cũng gọi 'kuil'",
          "berdoa → ber-DÔ-a, 'cầu nguyện'",
          "ke → 'đến/tới' (hướng)",
        ],
        pronunciation_focus_en: [
          "vihara → 'vee-HA-ra' — Buddhist temple (also 'kuil')",
          "berdoa → 'ber-DOH-a' — to pray",
          "ke → 'to' (direction)",
        ],
      },
      {
        en: "Bisakah Anda membantu saya menerjemahkan dokumen ini?",
        vi: "Anh/chị có thể giúp tôi dịch tài liệu này không?",
        pronunciation_focus: [
          "bisakah → 'có thể … không' (bisa + -kah, hỏi lịch sự)",
          "membantu → mem-BAN-tu, 'giúp đỡ' (gốc bantu)",
          "menerjemahkan → 'dịch (thuật)' (gốc terjemah)",
        ],
        pronunciation_focus_en: [
          "bisakah → 'could you' (bisa + '-kah' polite question)",
          "membantu → 'mem-BAN-too' — to help (root 'bantu')",
          "menerjemahkan → 'to translate' (root 'terjemah')",
        ],
      },
    ],
    cultural_notes_vi:
      "Cộng đồng người Việt ('komunitas orang Vietnam') ở Indonesia còn nhỏ nhưng có tổ chức quanh 'Kedutaan Besar Vietnam' (Đại sứ quán Việt Nam) tại Jakarta — nơi hỗ trợ giấy tờ, hộ chiếu, đăng ký công dân. Nhiều hội nhóm sinh hoạt qua Facebook/Zalo và gặp mặt cuối tuần ('akhir pekan'). Phật tử Việt có thể đến 'vihara' (chùa) Phật giáo địa phương — Indonesia công nhận Phật giáo nên có nhiều chùa, nhất là khu người Hoa. Khi cần dịch giấy tờ chính thức, hỏi sứ quán về 'penerjemah tersumpah' (dịch giả tuyên thệ).",
    cultural_notes_en:
      "The Vietnamese community ('komunitas orang Vietnam') in Indonesia is small but organized around the 'Kedutaan Besar Vietnam' (Embassy of Vietnam) in Jakarta — which handles documents, passports, and citizen registration. Many groups coordinate via Facebook/Zalo and meet on weekends ('akhir pekan'). Vietnamese Buddhists can visit a local 'vihara' (Buddhist temple) — Indonesia recognizes Buddhism, so temples exist, especially in Chinese-Indonesian areas. For official document translation, ask the embassy about a 'penerjemah tersumpah' (sworn translator).",
    tip_advice_vi:
      "Mẹo cho người Việt: trật tự từ ngược tiếng Việt một phần — bổ nghĩa đặt SAU danh từ: 'komunitas orang Vietnam' (cộng đồng người Việt), 'Kedutaan Besar Vietnam' (Đại sứ quán Việt Nam). Câu hỏi lịch sự thêm '-kah': 'Bisakah Anda …?' (Anh có thể … không?). Động từ giúp đỡ rất hay dùng: 'membantu' (giúp) + động từ: 'membantu menerjemahkan' (giúp dịch).",
    tip_advice_en:
      "Tip for Vietnamese speakers: word order partly inverts Vietnamese — modifiers go AFTER the head noun: 'komunitas orang Vietnam' (Vietnamese community), 'Kedutaan Besar Vietnam' (Embassy of Vietnam). For a polite question add '-kah': 'Bisakah Anda …?' (Could you …?). The helper verb 'membantu' (to help) + a verb is very useful: 'membantu menerjemahkan' (help translate).",
    vocabulary: [
      {
        word: "komunitas",
        en: "community",
        vi: "cộng đồng",
        pos: "noun",
        pronunciation_vi: "ko-mu-ni-TAS",
        pronunciation_en: "ko-moo-nee-TAS",
      },
      {
        word: "Kedutaan Besar",
        en: "embassy",
        vi: "đại sứ quán",
        pos: "noun",
        pronunciation_vi: "keu-du-TA-an beu-SAR",
        pronunciation_en: "ke-doo-TA-an be-SAR",
      },
      {
        word: "alamat",
        en: "address",
        vi: "địa chỉ",
        pos: "noun",
        pronunciation_vi: "a-LA-mat",
        pronunciation_en: "a-LA-mat",
      },
      {
        word: "berkumpul",
        en: "to gather",
        vi: "tụ họp",
        pos: "verb",
        pronunciation_vi: "ber-KUM-pul",
        pronunciation_en: "ber-KOOM-pool",
      },
      {
        word: "vihara",
        en: "Buddhist temple",
        vi: "chùa",
        pos: "noun",
        pronunciation_vi: "vi-HA-ra",
        pronunciation_en: "vee-HA-ra",
      },
      {
        word: "berdoa",
        en: "to pray",
        vi: "cầu nguyện",
        pos: "verb",
        pronunciation_vi: "ber-DÔ-a",
        pronunciation_en: "ber-DOH-a",
      },
      {
        word: "membantu",
        en: "to help",
        vi: "giúp đỡ",
        pos: "verb",
        pronunciation_vi: "mem-BAN-tu",
        pronunciation_en: "mem-BAN-too",
      },
      {
        word: "menerjemahkan",
        en: "to translate",
        vi: "dịch (thuật)",
        pos: "verb",
        pronunciation_vi: "meu-ner-jeu-MAH-kan",
        pronunciation_en: "me-ner-je-MAH-kan",
      },
      {
        word: "akhir pekan",
        en: "weekend",
        vi: "cuối tuần",
        pos: "noun",
        pronunciation_vi: "A-khir PE-kan",
        pronunciation_en: "A-kheer PE-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Huy",
        text: "Saya baru pindah ke Jakarta. Mencari komunitas orang Vietnam.",
        vi: "Tôi mới chuyển đến Jakarta. Đang tìm cộng đồng người Việt.",
        en: "I just moved to Jakarta. I'm looking for the Vietnamese community.",
      },
      {
        speaker: "Mai",
        text: "Oh, kami berkumpul setiap akhir pekan. Kamu sudah ke Kedutaan?",
        vi: "Ồ, bọn mình tụ họp mỗi cuối tuần. Bạn đã đến Đại sứ quán chưa?",
        en: "Oh, we gather every weekend. Have you been to the embassy yet?",
      },
      {
        speaker: "Huy",
        text: "Belum. Bisakah kamu beri saya alamatnya?",
        vi: "Chưa. Bạn cho mình địa chỉ được không?",
        en: "Not yet. Could you give me the address?",
      },
      {
        speaker: "Mai",
        text: "Tentu. Hari Minggu kita berdoa di vihara, lalu makan pho bersama.",
        vi: "Chắc chắn. Chủ nhật bọn mình cầu nguyện ở chùa, rồi ăn phở cùng nhau.",
        en: "Sure. On Sunday we pray at the temple, then eat pho together.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về cộng đồng còn thiếu:",
        instruction_en: "Fill in the missing community word:",
        items: [
          {
            prompt: "Saya mencari ___ orang Vietnam di Jakarta. (cộng đồng)",
            answer: "komunitas",
            options: ["komunitas", "komputer", "komentar"],
          },
          {
            prompt: "Di mana alamat ___ Vietnam? (đại sứ quán)",
            answer: "Kedutaan Besar",
            options: ["Kedutaan Besar", "Kantor Pos", "Kamar Mandi"],
          },
          {
            prompt: "Setiap akhir pekan kami ___ untuk makan bersama. (tụ họp)",
            answer: "berkumpul",
            options: ["berkumpul", "berhenti", "berbelanja"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "alamat", answer: "địa chỉ" },
          { prompt: "vihara", answer: "chùa" },
          { prompt: "berdoa", answer: "cầu nguyện" },
          { prompt: "membantu", answer: "giúp đỡ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi đang tìm cộng đồng người Việt ở Jakarta.", answer: "Saya mencari komunitas orang Vietnam di Jakarta." },
          { prompt: "Địa chỉ Đại sứ quán Việt Nam ở đâu?", answer: "Di mana alamat Kedutaan Besar Vietnam?" },
          { prompt: "Anh có thể giúp tôi dịch tài liệu này không?", answer: "Bisakah Anda membantu saya menerjemahkan dokumen ini?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_celebrating_tet",
    level: "B1",
    category: "vietnamese_community",
    title_vi: "Đón Tết ở Indonesia — giải thích và ăn mừng",
    title_en: "Celebrating Tết in Indonesia — explaining and celebrating",
    sentences: [
      {
        en: "Tet adalah Tahun Baru Imlek versi Vietnam, perayaan terpenting kami.",
        vi: "Tết là Tết Nguyên đán phiên bản Việt Nam, lễ hội quan trọng nhất của chúng tôi.",
        pronunciation_focus: [
          "Tet → người Indonesia viết không dấu, đọc 'tét'",
          "Tahun Baru Imlek → 'Tết âm lịch (người Hoa)' — mốc Indonesia đã quen",
          "terpenting → 'quan trọng nhất' (ter- + penting = nhất)",
        ],
        pronunciation_focus_en: [
          "Tet → Indonesians write it without diacritics, said 'tet'",
          "Tahun Baru Imlek → 'Lunar New Year' — a reference Indonesians know",
          "terpenting → 'most important' (ter- + penting = superlative)",
        ],
      },
      {
        en: "Kami merayakan Tet dengan keluarga, makanan khas, dan amplop merah.",
        vi: "Chúng tôi đón Tết với gia đình, món truyền thống và bao lì xì.",
        pronunciation_focus: [
          "merayakan → 'ăn mừng/tổ chức' (gốc raya + me-…-kan)",
          "makanan khas → 'món đặc trưng/truyền thống' (khas = đặc trưng)",
          "amplop merah → 'phong bì đỏ' = bao lì xì (Indonesia gọi 'angpao')",
        ],
        pronunciation_focus_en: [
          "merayakan → 'to celebrate' (root 'raya' + 'me-…-kan')",
          "makanan khas → 'traditional/typical food' (khas = characteristic)",
          "amplop merah → 'red envelope' = lì xì (Indonesians also say 'angpao')",
        ],
      },
      {
        en: "Di Indonesia, Tet biasanya jatuh pada hari yang sama dengan Imlek.",
        vi: "Ở Indonesia, Tết thường rơi vào cùng ngày với Tết người Hoa.",
        pronunciation_focus: [
          "jatuh pada → 'rơi vào (ngày)' — nói về ngày lễ",
          "hari yang sama dengan → 'ngày giống/cùng với'",
          "biasanya → bi-A-sa-nya, 'thường thường'",
        ],
        pronunciation_focus_en: [
          "jatuh pada → 'falls on' (used for dates/holidays)",
          "hari yang sama dengan → 'the same day as'",
          "biasanya → 'bee-A-sa-nya' — usually",
        ],
      },
      {
        en: "Saya ingin mengundang teman Indonesia untuk merasakan Tet.",
        vi: "Tôi muốn mời bạn Indonesia đến trải nghiệm Tết.",
        pronunciation_focus: [
          "mengundang → 'mời' (gốc undang)",
          "merasakan → 'trải nghiệm/nếm thử' (gốc rasa + me-…-kan)",
          "ingin → ING-in, 'muốn' (trang trọng hơn 'mau')",
        ],
        pronunciation_focus_en: [
          "mengundang → 'to invite' (root 'undang')",
          "merasakan → 'to experience/taste' (root 'rasa' + 'me-…-kan')",
          "ingin → 'ING-in' — to want (a touch more formal than 'mau')",
        ],
      },
      {
        en: "Selamat Tahun Baru! Semoga tahun ini penuh keberuntungan.",
        vi: "Chúc mừng năm mới! Chúc năm nay đầy may mắn.",
        pronunciation_focus: [
          "Selamat Tahun Baru → 'Chúc mừng năm mới' (lời chúc chuẩn)",
          "semoga → seu-MÔ-ga, 'cầu mong/chúc'",
          "keberuntungan → 'sự may mắn' (untung + ke-…-an)",
        ],
        pronunciation_focus_en: [
          "Selamat Tahun Baru → 'Happy New Year' (the standard greeting)",
          "semoga → 'se-MOH-ga' — may / hopefully (introduces a wish)",
          "keberuntungan → 'good fortune/luck' (untung + 'ke-…-an')",
        ],
      },
    ],
    cultural_notes_vi:
      "Tết Việt thường trùng ngày với 'Tahun Baru Imlek' (Tết người Hoa) — vốn là ngày nghỉ quốc gia ở Indonesia, nên dễ giải thích: 'Tet adalah Imlek versi Vietnam' (Tết là Imlek phiên bản Việt). Bao lì xì người Indonesia gọi 'angpao' (mượn tiếng Hoa) hoặc mô tả 'amplop merah' (phong bì đỏ). Cộng đồng Việt ở Jakarta thường tổ chức tiệc Tết qua hội nhóm và đại sứ quán. Đây là dịp tuyệt vời để mời ('mengundang') bạn Indonesia trải nghiệm văn hoá Việt — bánh chưng, áo dài, mâm ngũ quả.",
    cultural_notes_en:
      "Vietnamese Tết usually falls on the same day as 'Tahun Baru Imlek' (Chinese New Year) — already a national holiday in Indonesia, so it's easy to explain: 'Tet adalah Imlek versi Vietnam' (Tet is the Vietnamese version of Imlek). The lì xì envelope is called 'angpao' (from Chinese) or described as 'amplop merah' (red envelope). The Vietnamese community in Jakarta often holds Tết gatherings through groups and the embassy. It's a great occasion to invite ('mengundang') Indonesian friends to experience Vietnamese culture — bánh chưng, áo dài, the five-fruit tray.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiền tố 'ter-' tạo so sánh nhất — 'terpenting' (quan trọng nhất), 'terbaik' (tốt nhất), 'terbesar' (lớn nhất). 'semoga + mong muốn' để chúc: 'Semoga tahun ini penuh keberuntungan.' Giải thích Tết qua mốc người Indonesia đã biết: 'sama dengan Imlek' (giống Tết người Hoa). Lời chúc gốc dùng được ngay: 'Selamat Tahun Baru!'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the 'ter-' prefix forms superlatives — 'terpenting' (most important), 'terbaik' (best), 'terbesar' (biggest). Use 'semoga + a wish' to bless: 'Semoga tahun ini penuh keberuntungan.' Explain Tết via a reference Indonesians already know: 'sama dengan Imlek' (the same as Chinese New Year). The core greeting works as-is: 'Selamat Tahun Baru!'.",
    vocabulary: [
      {
        word: "merayakan",
        en: "to celebrate",
        vi: "ăn mừng / tổ chức",
        pos: "verb",
        pronunciation_vi: "meu-ra-YA-kan",
        pronunciation_en: "me-ra-YA-kan",
      },
      {
        word: "Tahun Baru",
        en: "New Year",
        vi: "năm mới",
        pos: "noun",
        pronunciation_vi: "TA-hun BA-ru",
        pronunciation_en: "TA-hoon BA-roo",
      },
      {
        word: "amplop merah / angpao",
        en: "red envelope (lucky money)",
        vi: "bao lì xì",
        pos: "noun",
        pronunciation_vi: "AM-plop ME-rah / ANG-pao",
        pronunciation_en: "AM-plop MEH-rah / ANG-pow",
      },
      {
        word: "makanan khas",
        en: "traditional / typical food",
        vi: "món truyền thống",
        pos: "noun",
        pronunciation_vi: "ma-KA-nan KHAS",
        pronunciation_en: "ma-KA-nan KHAS",
      },
      {
        word: "mengundang",
        en: "to invite",
        vi: "mời",
        pos: "verb",
        pronunciation_vi: "meng-UN-dang",
        pronunciation_en: "meng-OON-dang",
      },
      {
        word: "terpenting",
        en: "most important",
        vi: "quan trọng nhất",
        pos: "adjective (superlative)",
        pronunciation_vi: "ter-PEN-ting",
        pronunciation_en: "ter-PEN-ting",
      },
      {
        word: "semoga",
        en: "may / hopefully (wish)",
        vi: "cầu mong / chúc",
        pos: "particle",
        pronunciation_vi: "seu-MÔ-ga",
        pronunciation_en: "se-MOH-ga",
      },
      {
        word: "keberuntungan",
        en: "good fortune / luck",
        vi: "sự may mắn",
        pos: "noun",
        pronunciation_vi: "keu-ber-un-TUNG-an",
        pronunciation_en: "ke-ber-oon-TUNG-an",
      },
    ],
    dialogue: [
      {
        speaker: "Teman Indonesia",
        text: "Linh, Tet itu apa? Sama dengan Imlek?",
        vi: "Linh ơi, Tết là gì? Giống Tết người Hoa à?",
        en: "Linh, what is Tet? Is it the same as Imlek?",
      },
      {
        speaker: "Linh",
        text: "Iya, Tet adalah Imlek versi Vietnam, perayaan terpenting kami.",
        vi: "Đúng, Tết là Tết Nguyên đán phiên bản Việt, lễ quan trọng nhất của bọn mình.",
        en: "Yes, Tet is the Vietnamese version of Imlek, our most important celebration.",
      },
      {
        speaker: "Teman Indonesia",
        text: "Wah, menarik! Ada amplop merah juga?",
        vi: "Ồ, thú vị! Cũng có bao lì xì à?",
        en: "Wow, interesting! Are there red envelopes too?",
      },
      {
        speaker: "Linh",
        text: "Ada! Saya ingin mengundang kamu merasakan Tet. Selamat Tahun Baru!",
        vi: "Có chứ! Mình muốn mời bạn trải nghiệm Tết. Chúc mừng năm mới!",
        en: "Yes! I'd love to invite you to experience Tet. Happy New Year!",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về Tết còn thiếu:",
        instruction_en: "Fill in the missing Tết word:",
        items: [
          {
            prompt: "Kami ___ Tet dengan keluarga. (ăn mừng/tổ chức)",
            answer: "merayakan",
            options: ["merayakan", "membayar", "membaca"],
          },
          {
            prompt: "Tet adalah perayaan ___ kami. (quan trọng nhất)",
            answer: "terpenting",
            options: ["terpenting", "termurah", "terlambat"],
          },
          {
            prompt: "___ tahun ini penuh keberuntungan. (cầu mong/chúc)",
            answer: "Semoga",
            options: ["Semoga", "Sebelum", "Sesudah"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "amplop merah", answer: "bao lì xì" },
          { prompt: "makanan khas", answer: "món truyền thống" },
          { prompt: "mengundang", answer: "mời" },
          { prompt: "keberuntungan", answer: "sự may mắn" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tết là Tết Nguyên đán phiên bản Việt Nam.", answer: "Tet adalah Tahun Baru Imlek versi Vietnam." },
          { prompt: "Tôi muốn mời bạn Indonesia đến trải nghiệm Tết.", answer: "Saya ingin mengundang teman Indonesia untuk merasakan Tet." },
          { prompt: "Chúc mừng năm mới!", answer: "Selamat Tahun Baru!" },
        ],
      },
    ],
  },
];

export default vietnameseCommunityIndoLessons;
