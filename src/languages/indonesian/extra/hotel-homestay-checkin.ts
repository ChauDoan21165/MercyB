// src/languages/indonesian/extra/hotel-homestay-checkin.ts
//
// Indonesian hotel and homestay check-in pack for Vietnamese learners.
// Covers: check-in, KTP, deposit, kamar, AC, sarapan, checkout, room complaints,
// and homestay etiquette. Vietnamese-first with English companions, following
// the established Indonesian extra lesson shape.

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

export const hotelHomestayCheckinLessons: IndonesianLesson[] = [
  {
    id: "indonesian_hotel_checkin_basics",
    level: "A2",
    category: "travel",
    title_vi: "Check-in khách sạn - KTP, deposit và phòng",
    title_en: "Hotel check-in - ID, deposit and room",
    sentences: [
      {
        en: "Selamat siang, saya mau check-in atas nama Nguyen.",
        vi: "Chào buổi trưa, tôi muốn check-in dưới tên Nguyen.",
        pronunciation_focus: [
          "selamat siang → se-LA-mat SI-ang, lời chào từ trưa đến chiều",
          "mau check-in → muốn check-in; khách sạn dùng thẳng từ mượn",
          "atas nama Nguyen → dưới tên Nguyen/trên booking tên Nguyen",
        ],
        pronunciation_focus_en: [
          "selamat siang → 'se-LA-mat SEE-ang' — greeting from midday to afternoon",
          "mau check-in → want to check in; hotels use the loanword directly",
          "atas nama Nguyen → under the name Nguyen / booking name Nguyen",
        ],
      },
      {
        en: "Boleh saya lihat KTP atau paspor, Pak?",
        vi: "Tôi có thể xem căn cước hoặc hộ chiếu của anh không ạ?",
        pronunciation_focus: [
          "boleh saya lihat → tôi có thể xem được không; rất lịch sự",
          "KTP → ka-té-pé, căn cước Indonesia; khách nước ngoài dùng paspor",
          "Pak/Bu → cách gọi lịch sự, không dùng 'kamu' với khách",
        ],
        pronunciation_focus_en: [
          "boleh saya lihat → may I see; very polite",
          "KTP → 'kah-teh-peh', Indonesian ID card; foreign guests use a passport",
          "Pak/Bu → polite address; do not use 'kamu' with guests",
        ],
      },
      {
        en: "Apakah ada deposit untuk kamar ini?",
        vi: "Phòng này có tiền đặt cọc không?",
        pronunciation_focus: [
          "apakah ada → có không; mở câu hỏi yes/no lịch sự",
          "deposit → de-PO-sit, tiền đặt cọc; cũng gọi 'uang jaminan'",
          "kamar ini → phòng này; danh từ trước, từ chỉ định sau",
        ],
        pronunciation_focus_en: [
          "apakah ada → is there; polite yes/no opener",
          "deposit → 'de-PO-sit', security deposit; also 'uang jaminan'",
          "kamar ini → this room; noun first, demonstrative after",
        ],
      },
      {
        en: "Kamar saya di lantai berapa?",
        vi: "Phòng của tôi ở tầng mấy?",
        pronunciation_focus: [
          "kamar saya → phòng của tôi; sở hữu đặt sau danh từ",
          "lantai → LAN-tai, tầng/sàn",
          "berapa → bao nhiêu/mấy; hỏi số tầng dùng 'berapa'",
        ],
        pronunciation_focus_en: [
          "kamar saya → my room; possessor follows the noun",
          "lantai → 'LAN-tai' — floor/storey",
          "berapa → how many/which number; use it for floor numbers",
        ],
      },
      {
        en: "Sarapan mulai jam berapa dan di mana?",
        vi: "Bữa sáng bắt đầu lúc mấy giờ và ở đâu?",
        pronunciation_focus: [
          "sarapan → sa-RA-pan, bữa sáng/ăn sáng",
          "mulai jam berapa → bắt đầu lúc mấy giờ",
          "di mana → ở đâu; di = vị trí, không phải hướng đi",
        ],
        pronunciation_focus_en: [
          "sarapan → 'sa-RA-pan' — breakfast / to have breakfast",
          "mulai jam berapa → starts at what time",
          "di mana → where; di = static location, not movement",
        ],
      },
      {
        en: "Checkout paling lambat jam dua belas siang.",
        vi: "Checkout muộn nhất là mười hai giờ trưa.",
        pronunciation_focus: [
          "checkout → CHEK-aut, trả phòng; cũng viết check-out",
          "paling lambat → muộn nhất/chậm nhất",
          "jam dua belas siang → mười hai giờ trưa",
        ],
        pronunciation_focus_en: [
          "checkout → 'CHEK-out' — check out; also written check-out",
          "paling lambat → at the latest",
          "jam dua belas siang → twelve noon",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở khách sạn Indonesia, lễ tân thường hỏi KTP cho khách nội địa và paspor cho khách nước ngoài. Một số nơi giữ deposit bằng tiền mặt hoặc thẻ, nhất là nếu có minibar hoặc chìa khóa thẻ. Giờ check-in phổ biến là khoảng 14:00 và checkout khoảng 12:00, nhưng homestay nhỏ có thể linh hoạt hơn nếu báo trước. Khi hỏi dịch vụ, thêm 'Pak/Bu/Mas/Mbak' và 'tolong' hoặc 'boleh' sẽ nghe tự nhiên và lịch sự.",
    cultural_notes_en:
      "At Indonesian hotels, reception usually asks for KTP for domestic guests and a passport for foreign guests. Some places hold a cash or card deposit, especially if there is a minibar or key card. Common check-in time is around 14:00 and checkout around 12:00, but small homestays may be more flexible if you ask in advance. When asking for services, adding 'Pak/Bu/Mas/Mbak' and 'tolong' or 'boleh' sounds natural and polite.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'atas nama...' là khung rất hữu ích khi nhận booking: 'atas nama Nguyen'. Đừng nhầm 'di' và 'ke': 'di lantai dua' = ở tầng hai, 'ke lantai dua' = đi lên tầng hai. Khi hỏi giờ, dùng 'jam berapa'; khi hỏi tầng/số phòng, dùng 'berapa' hoặc 'nomor berapa'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'atas nama...' is the useful booking phrase: 'under the name Nguyen'. Do not mix 'di' and 'ke': 'di lantai dua' = on the second floor, 'ke lantai dua' = to the second floor. For time, use 'jam berapa'; for floor/room numbers, use 'berapa' or 'nomor berapa'.",
    vocabulary: [
      {
        word: "check-in",
        en: "check-in",
        vi: "nhận phòng / check-in",
        pos: "noun / verb",
        pronunciation_vi: "CHEK-in",
        pronunciation_en: "CHEK-in",
      },
      {
        word: "KTP",
        en: "Indonesian ID card",
        vi: "căn cước Indonesia",
        pos: "noun",
        pronunciation_vi: "ka-té-pé",
        pronunciation_en: "kah-teh-peh",
      },
      {
        word: "paspor",
        en: "passport",
        vi: "hộ chiếu",
        pos: "noun",
        pronunciation_vi: "PAS-por",
        pronunciation_en: "PAS-por",
      },
      {
        word: "deposit",
        en: "deposit",
        vi: "tiền đặt cọc",
        pos: "noun",
        pronunciation_vi: "de-PO-sit",
        pronunciation_en: "de-PO-sit",
      },
      {
        word: "kamar",
        en: "room",
        vi: "phòng",
        pos: "noun",
        pronunciation_vi: "KA-mar",
        pronunciation_en: "KA-mar",
      },
      {
        word: "sarapan",
        en: "breakfast",
        vi: "bữa sáng / ăn sáng",
        pos: "noun / verb",
        pronunciation_vi: "sa-RA-pan",
        pronunciation_en: "sa-RA-pan",
      },
      {
        word: "checkout",
        en: "checkout",
        vi: "trả phòng / checkout",
        pos: "noun / verb",
        pronunciation_vi: "CHEK-aut",
        pronunciation_en: "CHEK-out",
      },
    ],
    dialogue: [
      {
        speaker: "Tamu",
        text: "Selamat siang, saya mau check-in atas nama Nguyen.",
        vi: "Chào buổi trưa, tôi muốn check-in dưới tên Nguyen.",
        en: "Good afternoon, I want to check in under the name Nguyen.",
      },
      {
        speaker: "Resepsionis",
        text: "Baik, Pak. Boleh saya lihat paspor?",
        vi: "Vâng, anh. Tôi có thể xem hộ chiếu không ạ?",
        en: "Certainly, sir. May I see your passport?",
      },
      {
        speaker: "Tamu",
        text: "Ini paspor saya. Apakah ada deposit?",
        vi: "Đây là hộ chiếu của tôi. Có đặt cọc không?",
        en: "Here is my passport. Is there a deposit?",
      },
      {
        speaker: "Resepsionis",
        text: "Ada deposit dua ratus ribu. Sarapan mulai jam tujuh.",
        vi: "Có đặt cọc hai trăm nghìn. Bữa sáng bắt đầu lúc bảy giờ.",
        en: "There is a two-hundred-thousand deposit. Breakfast starts at seven.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ khách sạn còn thiếu:",
        instruction_en: "Fill in the missing hotel word:",
        items: [
          {
            prompt: "Saya mau ___ atas nama Nguyen. (nhận phòng)",
            answer: "check-in",
            options: ["check-in", "checkout", "checklist"],
          },
          {
            prompt: "Apakah ada ___ untuk kamar ini? (đặt cọc)",
            answer: "deposit",
            options: ["deposit", "diskon", "dokumen"],
          },
          {
            prompt: "___ mulai jam berapa? (bữa sáng)",
            answer: "Sarapan",
            options: ["Sarapan", "Setrika", "Sampai"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "KTP", answer: "căn cước Indonesia" },
          { prompt: "paspor", answer: "hộ chiếu" },
          { prompt: "kamar", answer: "phòng" },
          { prompt: "checkout", answer: "trả phòng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn check-in dưới tên Nguyen.", answer: "Saya mau check-in atas nama Nguyen." },
          { prompt: "Phòng của tôi ở tầng mấy?", answer: "Kamar saya di lantai berapa?" },
          { prompt: "Bữa sáng bắt đầu lúc mấy giờ?", answer: "Sarapan mulai jam berapa?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_hotel_homestay_complaints",
    level: "B1",
    category: "travel",
    title_vi: "Homestay và phàn nàn về phòng",
    title_en: "Homestays and room complaints",
    sentences: [
      {
        en: "Saya menginap di homestay dekat pantai.",
        vi: "Tôi ở homestay gần bãi biển.",
        pronunciation_focus: [
          "menginap → me-NGI-nap, nghỉ lại/qua đêm ở nơi lưu trú",
          "homestay → HOM-stei, từ mượn phổ biến trong du lịch",
          "dekat pantai → gần bãi biển; tính từ/giới từ đặt trước địa điểm",
        ],
        pronunciation_focus_en: [
          "menginap → 'me-NGEE-nap' — stay overnight at lodging",
          "homestay → 'HOM-stay', common tourism loanword",
          "dekat pantai → near the beach; near + place",
        ],
      },
      {
        en: "AC di kamar saya tidak dingin.",
        vi: "Máy lạnh trong phòng của tôi không lạnh.",
        pronunciation_focus: [
          "AC → a-sé, máy lạnh/điều hòa",
          "di kamar saya → trong phòng của tôi",
          "tidak dingin → không lạnh; dingin = lạnh",
        ],
        pronunciation_focus_en: [
          "AC → 'ah-seh' — air conditioner",
          "di kamar saya → in my room",
          "tidak dingin → not cold; dingin = cold",
        ],
      },
      {
        en: "Air panas di kamar mandi tidak keluar.",
        vi: "Nước nóng trong phòng tắm không chảy ra.",
        pronunciation_focus: [
          "air panas → nước nóng; air đọc hai âm A-ir",
          "kamar mandi → phòng tắm/nhà tắm",
          "tidak keluar → không ra/không chảy ra",
        ],
        pronunciation_focus_en: [
          "air panas → hot water; air has two vowels, AH-ir",
          "kamar mandi → bathroom",
          "tidak keluar → does not come out/flow",
        ],
      },
      {
        en: "Boleh pindah kamar kalau masih ada kamar kosong?",
        vi: "Có thể đổi phòng nếu vẫn còn phòng trống không?",
        pronunciation_focus: [
          "boleh pindah kamar → có được chuyển/đổi phòng không",
          "kalau masih ada → nếu vẫn còn",
          "kamar kosong → phòng trống; tính từ sau danh từ như tiếng Việt",
        ],
        pronunciation_focus_en: [
          "boleh pindah kamar → may I move/change rooms",
          "kalau masih ada → if there is still",
          "kamar kosong → vacant room; adjective follows noun as in Vietnamese",
        ],
      },
      {
        en: "Handuk di kamar belum diganti.",
        vi: "Khăn trong phòng chưa được thay.",
        pronunciation_focus: [
          "handuk → HAN-duk, khăn tắm",
          "belum diganti → chưa được thay; di- = bị động",
          "L1 note: dùng 'belum' cho việc đáng ra đã làm nhưng chưa làm",
        ],
        pronunciation_focus_en: [
          "handuk → 'HAN-dook' — towel",
          "belum diganti → has not been replaced yet; di- = passive",
          "VN-speaker note: use 'belum' for something expected but not done yet",
        ],
      },
      {
        en: "Maaf, kamar ini terlalu berisik pada malam hari.",
        vi: "Xin lỗi, phòng này quá ồn vào ban đêm.",
        pronunciation_focus: [
          "maaf → xin lỗi/xin phép mở lời phàn nàn nhẹ",
          "terlalu berisik → quá ồn",
          "pada malam hari → vào ban đêm; trang trọng hơn 'malam-malam'",
        ],
        pronunciation_focus_en: [
          "maaf → sorry/excuse me to open a mild complaint",
          "terlalu berisik → too noisy",
          "pada malam hari → at night; more formal than 'malam-malam'",
        ],
      },
    ],
    cultural_notes_vi:
      "Homestay ở Indonesia có thể rất khác nhau: có nơi giống khách sạn nhỏ, có nơi là nhà gia đình với aturan rumah như giờ malam, melepas sepatu, hoặc không boleh membawa tamu. Khi có vấn đề phòng, nói cụ thể sẽ hiệu quả hơn: 'AC tidak dingin', 'air panas tidak keluar', 'handuk belum diganti'. Mở câu bằng 'Maaf' hoặc 'Tolong dicek' giúp phàn nàn nghe lịch sự nhưng vẫn rõ.",
    cultural_notes_en:
      "Indonesian homestays vary widely: some feel like small hotels, while others are family homes with house rules such as quiet hours, removing shoes, or no outside guests. When there is a room problem, specific wording works best: 'AC tidak dingin', 'air panas tidak keluar', 'handuk belum diganti'. Opening with 'Maaf' or 'Tolong dicek' keeps the complaint polite but clear.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'menginap' là động từ chuẩn cho 'ở qua đêm/lưu trú', khác với 'tinggal' = sống/ở lâu dài. Với sự cố phòng, hay dùng bị động di-: 'diganti' (được thay), 'dicek' (được kiểm tra), 'diperbaiki' (được sửa). Muốn đổi phòng, câu mềm là 'Boleh pindah kamar?'",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'menginap' is the standard verb for staying overnight/lodging, different from 'tinggal' = live/stay long-term. For room issues, passive di- is common: 'diganti' (replaced), 'dicek' (checked), 'diperbaiki' (repaired). To ask for a room change, use the soft question 'Boleh pindah kamar?'",
    vocabulary: [
      {
        word: "homestay",
        en: "homestay / guesthouse-style lodging",
        vi: "homestay / nhà nghỉ kiểu gia đình",
        pos: "noun",
        pronunciation_vi: "HOM-stei",
        pronunciation_en: "HOM-stay",
      },
      {
        word: "menginap",
        en: "to stay overnight",
        vi: "lưu trú / ở qua đêm",
        pos: "verb",
        pronunciation_vi: "me-NGI-nap",
        pronunciation_en: "me-NGEE-nap",
      },
      {
        word: "AC",
        en: "air conditioner",
        vi: "máy lạnh / điều hòa",
        pos: "noun",
        pronunciation_vi: "a-sé",
        pronunciation_en: "ah-seh",
      },
      {
        word: "air panas",
        en: "hot water",
        vi: "nước nóng",
        pos: "noun phrase",
        pronunciation_vi: "A-ir PA-nas",
        pronunciation_en: "AH-ir PA-nas",
      },
      {
        word: "pindah kamar",
        en: "change rooms",
        vi: "đổi phòng",
        pos: "verb phrase",
        pronunciation_vi: "PIN-dah KA-mar",
        pronunciation_en: "PIN-dah KA-mar",
      },
      {
        word: "handuk",
        en: "towel",
        vi: "khăn tắm",
        pos: "noun",
        pronunciation_vi: "HAN-duk",
        pronunciation_en: "HAN-dook",
      },
      {
        word: "berisik",
        en: "noisy",
        vi: "ồn",
        pos: "adjective",
        pronunciation_vi: "be-RI-sik",
        pronunciation_en: "be-REE-sik",
      },
    ],
    dialogue: [
      {
        speaker: "Tamu",
        text: "Maaf, AC di kamar saya tidak dingin.",
        vi: "Xin lỗi, máy lạnh trong phòng của tôi không lạnh.",
        en: "Excuse me, the AC in my room is not cold.",
      },
      {
        speaker: "Staf",
        text: "Baik, Pak. Nanti teknisi kami cek.",
        vi: "Vâng, anh. Lát nữa kỹ thuật viên của chúng tôi kiểm tra.",
        en: "Okay, sir. Our technician will check it later.",
      },
      {
        speaker: "Tamu",
        text: "Kalau tidak bisa diperbaiki, boleh pindah kamar?",
        vi: "Nếu không sửa được, tôi có thể đổi phòng không?",
        en: "If it cannot be fixed, may I change rooms?",
      },
      {
        speaker: "Staf",
        text: "Boleh, kalau masih ada kamar kosong.",
        vi: "Được, nếu vẫn còn phòng trống.",
        en: "Yes, if there is still a vacant room.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ homestay/khách sạn còn thiếu:",
        instruction_en: "Fill in the missing hotel/homestay word:",
        items: [
          {
            prompt: "AC di kamar saya tidak ___. (lạnh)",
            answer: "dingin",
            options: ["dingin", "dekat", "datang"],
          },
          {
            prompt: "Air ___ di kamar mandi tidak keluar. (nóng)",
            answer: "panas",
            options: ["panas", "pagi", "paspor"],
          },
          {
            prompt: "Boleh ___ kamar? (đổi/chuyển phòng)",
            answer: "pindah",
            options: ["pindah", "pesan", "pulang"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "menginap", answer: "lưu trú / ở qua đêm" },
          { prompt: "AC", answer: "máy lạnh" },
          { prompt: "handuk", answer: "khăn tắm" },
          { prompt: "berisik", answer: "ồn" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Máy lạnh trong phòng của tôi không lạnh.", answer: "AC di kamar saya tidak dingin." },
          { prompt: "Có thể đổi phòng nếu vẫn còn phòng trống không?", answer: "Boleh pindah kamar kalau masih ada kamar kosong?" },
          { prompt: "Khăn trong phòng chưa được thay.", answer: "Handuk di kamar belum diganti." },
        ],
      },
    ],
  },
];
