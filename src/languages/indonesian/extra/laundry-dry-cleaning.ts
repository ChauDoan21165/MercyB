// src/languages/indonesian/extra/laundry-dry-cleaning.ts
//
// Indonesian laundry and dry-cleaning service pack for Vietnamese learners.
// Covers: laundry kiloan, cuci setrika, dry clean, noda, parfum, jemput antar,
// nota, and pakaian hilang. Vietnamese-first with English companions, following
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

export const laundryDryCleaningLessons: IndonesianLesson[] = [
  {
    id: "indonesian_laundry_kiloan_dry_clean",
    level: "A2",
    category: "services",
    title_vi: "Giặt ủi kiloan và dry clean",
    title_en: "Kilo laundry and dry cleaning",
    sentences: [
      {
        en: "Mbak, saya mau laundry kiloan, cuci setrika.",
        vi: "Chị ơi, tôi muốn giặt tính ký, giặt và ủi.",
        pronunciation_focus: [
          "laundry kiloan → LON-dri ki-LO-an, giặt tính theo ký",
          "cuci setrika → giặt ủi; cuci = giặt, setrika = ủi/là",
          "Mbak → cách gọi lịch sự với nhân viên nữ, giống 'chị ơi'",
        ],
        pronunciation_focus_en: [
          "laundry kiloan → 'LON-dree kee-LO-an' — laundry charged by the kilo",
          "cuci setrika → wash and iron; cuci = wash, setrika = iron",
          "Mbak → polite address for a female staff member, like 'miss/sis'",
        ],
      },
      {
        en: "Berapa harga per kilo untuk cuci setrika?",
        vi: "Giá mỗi ký cho giặt ủi là bao nhiêu?",
        pronunciation_focus: [
          "berapa harga → giá bao nhiêu; thêm 'harga' cho rõ",
          "per kilo → mỗi ký; trong laundry nói rất thường",
          "L1 note: đừng bỏ 'ribu' khi nghe giá, ví dụ 'tujuh ribu per kilo'",
        ],
        pronunciation_focus_en: [
          "berapa harga → how much is the price; adding 'harga' makes it clear",
          "per kilo → per kilo; very common in laundry shops",
          "VN-speaker note: don't drop 'ribu' when hearing prices, e.g. 'tujuh ribu per kilo'",
        ],
      },
      {
        en: "Jas ini jangan dicuci biasa, harus dry clean.",
        vi: "Áo vest này đừng giặt thường, phải dry clean.",
        pronunciation_focus: [
          "jas → jas, áo vest/com-lê",
          "jangan dicuci biasa → đừng giặt thường; di- = bị động",
          "dry clean → DRAI klin, từ mượn phổ biến ở tiệm giặt",
        ],
        pronunciation_focus_en: [
          "jas → suit jacket/blazer",
          "jangan dicuci biasa → don't wash normally; di- = passive",
          "dry clean → 'DRY kleen', common loanword at laundry shops",
        ],
      },
      {
        en: "Ada noda kopi di kemeja putih ini.",
        vi: "Có vết cà phê trên áo sơ mi trắng này.",
        pronunciation_focus: [
          "noda kopi → vết cà phê; noda = vết bẩn/ố",
          "kemeja putih → áo sơ mi trắng; tính từ đặt sau danh từ",
          "di kemeja ini → trên áo này; di = ở/trên vị trí",
        ],
        pronunciation_focus_en: [
          "noda kopi → coffee stain; noda = stain",
          "kemeja putih → white shirt; adjective follows the noun",
          "di kemeja ini → on this shirt; di = at/on a location",
        ],
      },
      {
        en: "Tolong jangan pakai parfum yang terlalu kuat.",
        vi: "Làm ơn đừng dùng nước thơm quá nồng.",
        pronunciation_focus: [
          "tolong jangan → làm ơn đừng; khung dặn dò lịch sự",
          "pakai parfum → dùng nước thơm/mùi thơm sau giặt",
          "terlalu kuat → quá mạnh/nồng",
        ],
        pronunciation_focus_en: [
          "tolong jangan → please don't; polite caution frame",
          "pakai parfum → use laundry fragrance/perfume",
          "terlalu kuat → too strong",
        ],
      },
    ],
    cultural_notes_vi:
      "'Laundry kiloan' rất phổ biến ở khu kos, apartemen và gần kampus tại Indonesia. Giá thường tính 'per kilo', còn dịch vụ nhanh gọi là 'express'. 'Cuci setrika' nghĩa là giặt và ủi, còn 'dry clean' dành cho jas, kebaya, gaun, batik halus hoặc đồ dễ hỏng. Nhiều tiệm hỏi muốn pakai parfum hay tidak; nếu nhạy mùi, nên nói rõ từ đầu.",
    cultural_notes_en:
      "'Laundry kiloan' is very common around boarding houses, apartments, and campuses in Indonesia. Pricing is usually 'per kilo', while fast service is called 'express'. 'Cuci setrika' means wash and iron, while 'dry clean' is for suits, kebaya, gowns, fine batik, or delicate items. Many shops ask whether you want fragrance; if you are sensitive to scent, say so at the start.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong dịch vụ giặt ủi, câu lịch sự hay dùng bị động di-: 'dicuci', 'disetrika', 'jangan dicuci biasa'. 'Kiloan' là hậu tố -an từ 'kilo', nghĩa là tính theo ký. Muốn dặn mùi nhẹ, nói 'parfumnya sedikit saja' hoặc 'jangan terlalu kuat'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: laundry-service requests often use passive di-: 'dicuci', 'disetrika', 'jangan dicuci biasa'. 'Kiloan' uses the -an suffix from 'kilo', meaning charged by the kilo. To request light fragrance, say 'parfumnya sedikit saja' or 'jangan terlalu kuat'.",
    vocabulary: [
      {
        cell_id: "f2ee3817-dc63-4b98-bf3d-ead90fafd06a",
        word: "laundry kiloan",
        en: "laundry by the kilo",
        vi: "giặt tính ký",
        pos: "noun phrase",
        pronunciation_vi: "LON-dri ki-LO-an",
        pronunciation_en: "LON-dree kee-LO-an",
      },
      {
        cell_id: "33d6bd76-eb86-4a88-a554-d1ab8f8facbe",
        word: "cuci setrika",
        en: "wash and iron",
        vi: "giặt ủi",
        pos: "verb / service phrase",
        pronunciation_vi: "CU-ci se-TRI-ka",
        pronunciation_en: "CHOO-chee se-TREE-ka",
      },
      {
        cell_id: "8e33780c-8c59-4e1e-beca-d06e892c9e4d",
        word: "dry clean",
        en: "dry cleaning",
        vi: "giặt khô",
        pos: "noun / verb phrase",
        pronunciation_vi: "DRAI klin",
        pronunciation_en: "DRY kleen",
      },
      {
        cell_id: "42731e7a-a3fe-4a4d-b226-cfcbaee717c7",
        word: "noda",
        en: "stain",
        vi: "vết bẩn / vết ố",
        pos: "noun",
        pronunciation_vi: "NO-da",
        pronunciation_en: "NO-da",
      },
      {
        cell_id: "e74bc1b6-b305-4617-9862-d1447c69efee",
        word: "parfum",
        en: "fragrance / perfume",
        vi: "nước thơm / mùi thơm",
        pos: "noun",
        pronunciation_vi: "par-FUM",
        pronunciation_en: "par-FOOM",
      },
      {
        cell_id: "037ee63d-c368-4c0c-ade8-b4757d41b9af",
        word: "setrika",
        en: "iron / to iron",
        vi: "bàn ủi / ủi",
        pos: "noun / verb",
        pronunciation_vi: "se-TRI-ka",
        pronunciation_en: "se-TREE-ka",
      },
      {
        cell_id: "a3f94dd0-9dfe-4773-a600-58ab87e1672d",
        word: "jas",
        en: "suit jacket / blazer",
        vi: "áo vest / áo com-lê",
        pos: "noun",
        pronunciation_vi: "jas",
        pronunciation_en: "jas",
      },
    ],
    dialogue: [
      {
        cell_id: "cf62f7a2-c6f5-49c1-ba62-de1964b98b5e",
        speaker: "Pelanggan",
        text: "Mbak, saya mau laundry kiloan. Berapa per kilo?",
        vi: "Chị ơi, tôi muốn giặt tính ký. Bao nhiêu một ký?",
        en: "Miss, I want laundry by the kilo. How much per kilo?",
      },
      {
        cell_id: "2c9363ab-9d8d-4cc1-9db2-57eebe7c7820",
        speaker: "Laundry",
        text: "Cuci setrika delapan ribu per kilo, selesai besok sore.",
        vi: "Giặt ủi tám nghìn một ký, xong chiều mai.",
        en: "Wash and iron is eight thousand per kilo, ready tomorrow afternoon.",
      },
      {
        cell_id: "eed6d068-f11a-4594-be1a-662fcfc7d1b4",
        speaker: "Pelanggan",
        text: "Jas ini dry clean, ya. Ada noda kopi di kemeja putih.",
        vi: "Áo vest này dry clean nhé. Có vết cà phê trên áo sơ mi trắng.",
        en: "Dry clean this suit jacket, please. There is a coffee stain on the white shirt.",
      },
      {
        cell_id: "8fdb1414-2b72-4263-9c1e-5daf0be6b8ed",
        speaker: "Laundry",
        text: "Baik. Parfumnya mau biasa atau sedikit saja?",
        vi: "Vâng. Mùi thơm muốn bình thường hay chỉ một chút thôi?",
        en: "Okay. Do you want normal fragrance or just a little?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ giặt ủi còn thiếu:",
        instruction_en: "Fill in the missing laundry word:",
        items: [
          {
            prompt: "Saya mau laundry ___. (tính ký)",
            answer: "kiloan",
            options: ["kiloan", "kilat", "kirim"],
          },
          {
            prompt: "Jas ini harus ___. (giặt khô)",
            answer: "dry clean",
            options: ["dry clean", "diskon", "dikirim"],
          },
          {
            prompt: "Ada ___ kopi di kemeja ini. (vết bẩn)",
            answer: "noda",
            options: ["noda", "nota", "nomor"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "cuci setrika", answer: "giặt ủi" },
          { prompt: "parfum", answer: "nước thơm / mùi thơm" },
          { prompt: "noda", answer: "vết bẩn" },
          { prompt: "jas", answer: "áo vest" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn giặt tính ký, giặt và ủi.", answer: "Saya mau laundry kiloan, cuci setrika." },
          { prompt: "Áo vest này đừng giặt thường, phải dry clean.", answer: "Jas ini jangan dicuci biasa, harus dry clean." },
          { prompt: "Làm ơn đừng dùng nước thơm quá nồng.", answer: "Tolong jangan pakai parfum yang terlalu kuat." },
        ],
      },
    ],
  },
  {
    id: "indonesian_laundry_pickup_note_missing",
    level: "B1",
    category: "services",
    title_vi: "Dịch vụ lấy giao, nota và đồ bị mất",
    title_en: "Pickup delivery, receipts and missing clothes",
    sentences: [
      {
        en: "Apakah ada layanan jemput antar untuk laundry?",
        vi: "Có dịch vụ lấy và giao đồ giặt không?",
        pronunciation_focus: [
          "layanan → la-YA-nan, dịch vụ",
          "jemput antar → lấy và giao tận nơi; jemput = đón/lấy, antar = đưa/giao",
          "untuk laundry → cho đồ giặt/dịch vụ giặt",
        ],
        pronunciation_focus_en: [
          "layanan → 'la-YA-nan' — service",
          "jemput antar → pickup and delivery; jemput = pick up, antar = deliver",
          "untuk laundry → for laundry service/items",
        ],
      },
      {
        en: "Tolong tulis jumlah pakaian di nota.",
        vi: "Làm ơn ghi số lượng quần áo trên phiếu.",
        pronunciation_focus: [
          "tulis → TU-lis, viết/ghi",
          "jumlah pakaian → số lượng quần áo",
          "nota → NO-ta, phiếu/biên nhận ở tiệm",
        ],
        pronunciation_focus_en: [
          "tulis → 'TOO-lis' — write down",
          "jumlah pakaian → number of clothing items",
          "nota → 'NO-ta' — receipt/slip at a shop",
        ],
      },
      {
        en: "Saya mau ambil laundry pakai nota ini.",
        vi: "Tôi muốn lấy đồ giặt bằng phiếu này.",
        pronunciation_focus: [
          "ambil laundry → lấy đồ giặt đã xong",
          "pakai nota ini → dùng phiếu này",
          "L1 note: 'ambil' không chỉ là lấy đồ vật, còn là nhận lại đồ/dịch vụ",
        ],
        pronunciation_focus_en: [
          "ambil laundry → pick up completed laundry",
          "pakai nota ini → using this receipt/slip",
          "VN-speaker note: 'ambil' is not only take an object; it also means collect/pick up a service item",
        ],
      },
      {
        en: "Maaf, satu kemeja saya belum kembali.",
        vi: "Xin lỗi, một áo sơ mi của tôi chưa được trả lại.",
        pronunciation_focus: [
          "maaf → xin lỗi/xin phép mở lời phàn nàn nhẹ",
          "satu kemeja saya → một áo sơ mi của tôi",
          "belum kembali → chưa quay lại/chưa được trả lại",
        ],
        pronunciation_focus_en: [
          "maaf → sorry/excuse me to open a mild complaint",
          "satu kemeja saya → one of my shirts",
          "belum kembali → has not come back/been returned yet",
        ],
      },
      {
        en: "Pakaian saya hilang, bisa dicek lagi?",
        vi: "Quần áo của tôi bị mất, có thể kiểm tra lại không?",
        pronunciation_focus: [
          "pakaian saya → quần áo của tôi",
          "hilang → HI-lang, mất/thất lạc",
          "bisa dicek lagi → có thể được kiểm tra lại không; di- = bị động",
        ],
        pronunciation_focus_en: [
          "pakaian saya → my clothes",
          "hilang → 'HEE-lang' — missing/lost",
          "bisa dicek lagi → can it be checked again; di- = passive",
        ],
      },
      {
        en: "Kalau memang hilang, bagaimana ganti ruginya?",
        vi: "Nếu thật sự bị mất, bồi thường thế nào?",
        pronunciation_focus: [
          "kalau memang hilang → nếu đúng là mất thật",
          "bagaimana → thế nào/ra sao",
          "ganti rugi → bồi thường thiệt hại",
        ],
        pronunciation_focus_en: [
          "kalau memang hilang → if it really is missing",
          "bagaimana → how/what is the arrangement",
          "ganti rugi → compensation for loss/damage",
        ],
      },
    ],
    cultural_notes_vi:
      "Nhiều tiệm laundry Indonesia có 'jemput antar' qua WhatsApp, đặc biệt ở khu kos, apartemen và perumahan. 'Nota' rất quan trọng: trên đó có nama pelanggan, jumlah kilo, jumlah pakaian, tanggal masuk, tanggal selesai, và harga. Nếu pakaian hilang hoặc tertukar, nói lịch sự nhưng rõ: 'bisa dicek lagi?' rồi hỏi aturan 'ganti rugi'. Một số tiệm chỉ bồi thường theo kelipatan harga laundry, không theo giá pakaian mới.",
    cultural_notes_en:
      "Many Indonesian laundry shops offer 'jemput antar' by WhatsApp, especially around boarding houses, apartments, and residential complexes. The 'nota' is important: it lists customer name, weight, item count, drop-off date, pickup date, and price. If clothes are missing or swapped, be polite but clear: 'bisa dicek lagi?' then ask the compensation rule, 'ganti rugi'. Some shops compensate based on multiples of the laundry fee, not the replacement cost of the clothing.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi phàn nàn dịch vụ, mở bằng 'Maaf' để mềm giọng nhưng vẫn chắc ý. 'Hilang' = mất; 'tertukar' = bị nhầm/đổi với đồ người khác; 'rusak' = hỏng. Khi hỏi bồi thường, 'bagaimana ganti ruginya?' tự nhiên hơn dịch từng chữ 'bayar balik'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in service complaints, open with 'Maaf' to sound polite but firm. 'Hilang' = missing/lost; 'tertukar' = swapped with someone else's item; 'rusak' = damaged. For compensation, 'bagaimana ganti ruginya?' is more natural than a literal 'pay back'.",
    vocabulary: [
      {
        cell_id: "6fec72b3-1664-4298-a12e-cac0a082cd7a",
        word: "jemput antar",
        en: "pickup and delivery",
        vi: "lấy và giao tận nơi",
        pos: "service phrase",
        pronunciation_vi: "JEM-put AN-tar",
        pronunciation_en: "JEM-poot AN-tar",
      },
      {
        cell_id: "05a0289e-2a48-4100-9879-6714b76204f4",
        word: "nota",
        en: "receipt / service slip",
        vi: "phiếu / biên nhận",
        pos: "noun",
        pronunciation_vi: "NO-ta",
        pronunciation_en: "NO-ta",
      },
      {
        cell_id: "86ddb2ed-62e7-4d6f-8e3c-d360e8784a54",
        word: "pakaian",
        en: "clothes",
        vi: "quần áo",
        pos: "noun",
        pronunciation_vi: "pa-KAI-an",
        pronunciation_en: "pa-KAI-an",
      },
      {
        cell_id: "67455830-9c65-4f82-92ce-d419fa739337",
        word: "hilang",
        en: "missing / lost",
        vi: "mất / thất lạc",
        pos: "adjective / verb",
        pronunciation_vi: "HI-lang",
        pronunciation_en: "HEE-lang",
      },
      {
        cell_id: "a3b3fa37-983f-4050-bb1d-0073cbe0785a",
        word: "tertukar",
        en: "swapped by mistake",
        vi: "bị nhầm / bị đổi lẫn",
        pos: "passive-like verb",
        pronunciation_vi: "ter-TU-kar",
        pronunciation_en: "ter-TOO-kar",
      },
      {
        cell_id: "1deb2506-6267-4dd8-9ad5-9b9ab706c921",
        word: "ganti rugi",
        en: "compensation",
        vi: "bồi thường",
        pos: "noun / verb phrase",
        pronunciation_vi: "GAN-ti RU-gi",
        pronunciation_en: "GAN-tee ROO-gee",
      },
      {
        cell_id: "fc48c8c7-2ab0-481f-b83f-d96fedef8399",
        word: "dicek lagi",
        en: "checked again",
        vi: "được kiểm tra lại",
        pos: "passive verb phrase",
        pronunciation_vi: "di-CÉK LA-gi",
        pronunciation_en: "dee-CHEK LA-gee",
      },
    ],
    dialogue: [
      {
        cell_id: "e1f79535-780c-41b1-9e6d-0f52107bcadb",
        speaker: "Pelanggan",
        text: "Halo, apakah ada layanan jemput antar?",
        vi: "Xin chào, có dịch vụ lấy và giao tận nơi không?",
        en: "Hello, is there pickup and delivery service?",
      },
      {
        cell_id: "bbb77f43-3719-4c8b-aaf1-65df38c07f7f",
        speaker: "Laundry",
        text: "Ada, Kak. Tolong kirim alamat dan foto nota.",
        vi: "Có bạn nhé. Làm ơn gửi địa chỉ và ảnh phiếu.",
        en: "Yes. Please send the address and a photo of the receipt.",
      },
      {
        cell_id: "ba235a9e-58e8-4776-9a25-2e9df9dcd62f",
        speaker: "Pelanggan",
        text: "Saya sudah terima laundry, tapi satu kemeja belum kembali.",
        vi: "Tôi đã nhận đồ giặt, nhưng một áo sơ mi chưa được trả lại.",
        en: "I received the laundry, but one shirt has not come back.",
      },
      {
        cell_id: "7f8b80a3-4b04-494e-9cf0-6430ab1f9724",
        speaker: "Laundry",
        text: "Maaf, Kak. Kami cek lagi dulu. Kalau hilang, ada ganti rugi.",
        vi: "Xin lỗi bạn. Bên tôi kiểm tra lại trước. Nếu mất, có bồi thường.",
        en: "Sorry. We will check again first. If it is missing, there is compensation.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ dịch vụ laundry còn thiếu:",
        instruction_en: "Fill in the missing laundry-service word:",
        items: [
          {
            prompt: "Apakah ada layanan ___ antar? (lấy và giao)",
            answer: "jemput",
            options: ["jemput", "jemur", "jemaat"],
          },
          {
            prompt: "Tolong tulis jumlah pakaian di ___. (phiếu)",
            answer: "nota",
            options: ["nota", "noda", "nomor"],
          },
          {
            prompt: "Pakaian saya ___, bisa dicek lagi? (mất)",
            answer: "hilang",
            options: ["hilang", "hitam", "hitung"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "jemput antar", answer: "lấy và giao tận nơi" },
          { prompt: "nota", answer: "phiếu / biên nhận" },
          { prompt: "tertukar", answer: "bị nhầm / đổi lẫn" },
          { prompt: "ganti rugi", answer: "bồi thường" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Có dịch vụ lấy và giao đồ giặt không?", answer: "Apakah ada layanan jemput antar untuk laundry?" },
          { prompt: "Làm ơn ghi số lượng quần áo trên phiếu.", answer: "Tolong tulis jumlah pakaian di nota." },
          { prompt: "Nếu thật sự bị mất, bồi thường thế nào?", answer: "Kalau memang hilang, bagaimana ganti ruginya?" },
        ],
      },
    ],
  },
];
