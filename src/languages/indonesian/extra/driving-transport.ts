// src/languages/indonesian/extra/driving-transport.ts
//
// Indonesian driving & vehicle-ownership pack for Vietnamese learners.
// Covers: the driver's licence (SIM) and its categories, vehicle registration
// and road tax (STNK, BPKB, pajak kendaraan, Samsat), and the repair shop
// (bengkel) — servicing, breakdowns and common faults. Hand-crafted, no filler.
//
// Distinct from transport-ojek.ts (ride-hailing & public transit): this pack is
// about OWNING and OPERATING your own motorbike or car in Indonesia.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts and the
// sibling extra packs so the page UI stays consistent across language verticals.
// The types are defined inline because the Indonesian pack has no sibling
// lessons.ts registry yet (A7 owns it) — this file is self-contained on purpose.
// Types are NOT exported and the lesson array uses a unique name so a future
// barrel `export *` cannot collide with the sibling extra packs.
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

export const drivingTransportLessons: IndonesianLesson[] = [
  {
    id: "indonesian_drive_sim",
    level: "A1",
    category: "driving",
    title_vi: "SIM — bằng lái xe ở Indonesia",
    title_en: "SIM — the Indonesian driver's licence",
    sentences: [
      {
        en: "Saya mau membuat SIM C untuk sepeda motor.",
        vi: "Tôi muốn làm bằng lái SIM C cho xe máy.",
        pronunciation_focus: [
          "SIM → đọc 'sim', viết tắt của Surat Izin Mengemudi (giấy phép lái xe)",
          "SIM C → bằng cho xe máy; SIM A → cho ô tô con",
          "membuat → mem-BU-at, 'làm/tạo' (gốc buat + me-…)",
        ],
        pronunciation_focus_en: [
          "SIM → said 'sim'; short for Surat Izin Mengemudi (driving licence)",
          "SIM C → the motorbike licence; SIM A → for private cars",
          "membuat → 'mem-BOO-at' — to make/produce (root 'buat' + 'me-')",
        ],
      },
      {
        en: "Saya harus ikut ujian teori dan ujian praktik.",
        vi: "Tôi phải tham gia thi lý thuyết và thi thực hành.",
        pronunciation_focus: [
          "ikut → I-kut, 'tham gia/đi theo'",
          "ujian → u-JI-an, 'kỳ thi' (gốc uji = kiểm tra)",
          "praktik → PRAK-tik, 'thực hành'; teori = lý thuyết",
        ],
        pronunciation_focus_en: [
          "ikut → 'EE-koot' — to take part / join",
          "ujian → 'oo-JEE-an' — exam (root 'uji' = to test)",
          "praktik → 'PRAK-teek' — practical; teori = theory",
        ],
      },
      {
        en: "Berapa biaya untuk membuat SIM baru?",
        vi: "Lệ phí làm bằng lái mới là bao nhiêu?",
        pronunciation_focus: [
          "biaya → bi-A-ya, 'chi phí/lệ phí'",
          "untuk → UN-tuk, 'để/cho'",
          "baru → BA-ru, 'mới' (đặt SAU danh từ: SIM baru = bằng mới)",
        ],
        pronunciation_focus_en: [
          "biaya → 'bee-A-ya' — cost / fee",
          "untuk → 'OON-took' — for / in order to",
          "baru → 'BA-roo' — new (comes AFTER the noun: SIM baru)",
        ],
      },
      {
        en: "SIM saya sudah mau habis, harus diperpanjang.",
        vi: "Bằng lái của tôi sắp hết hạn, phải gia hạn.",
        pronunciation_focus: [
          "sudah mau habis → 'sắp hết' (habis = hết, sudah mau = sắp)",
          "diperpanjang → di-per-PAN-jang, 'được gia hạn' (gốc panjang = dài)",
          "harus → HA-rus, 'phải'",
        ],
        pronunciation_focus_en: [
          "sudah mau habis → 'about to run out' (habis = used up)",
          "diperpanjang → 'dee-per-PAN-jang' — to be renewed/extended (root 'panjang' = long)",
          "harus → 'HA-roos' — must / have to",
        ],
      },
      {
        en: "Jangan lupa bawa KTP dan surat keterangan sehat.",
        vi: "Đừng quên mang theo CMND và giấy khám sức khỏe.",
        pronunciation_focus: [
          "jangan → JA-ngan, 'đừng' (cấm/khuyên không làm)",
          "KTP → đọc từng chữ 'ka-te-pe', thẻ căn cước (CMND)",
          "surat keterangan sehat → 'giấy chứng nhận sức khỏe'",
        ],
        pronunciation_focus_en: [
          "jangan → 'JA-ngan' — don't (prohibition)",
          "KTP → spelled out 'kah-teh-peh'; national ID card",
          "surat keterangan sehat → 'health certificate'",
        ],
      },
    ],
    cultural_notes_vi:
      "SIM (Surat Izin Mengemudi) là bằng lái xe do CẢNH SÁT (Polri) cấp, không phải sở giao thông. Hạng phổ biến: SIM C (xe máy), SIM A (ô tô con, dưới 3.500 kg), SIM B (xe tải/khách lớn), SIM D (cho người khuyết tật). Muốn cấp mới phải đủ 17 tuổi, có KTP (thẻ căn cước), giấy khám sức khỏe ('surat keterangan sehat'), thi lý thuyết ('ujian teori') và thực hành ('ujian praktik'). SIM có giá trị 5 năm rồi phải gia hạn ('perpanjang'). Làm SIM ở Satpas (Satuan Penyelenggara Administrasi SIM) hoặc qua SIM keliling (xe lưu động).",
    cultural_notes_en:
      "The SIM (Surat Izin Mengemudi) is the driver's licence, issued by the POLICE (Polri), not a transport ministry. Common categories: SIM C (motorbike), SIM A (private cars under 3,500 kg), SIM B (trucks/large passenger vehicles), SIM D (for people with disabilities). To get one you must be 17+, have a KTP (national ID), a health certificate ('surat keterangan sehat'), and pass the theory ('ujian teori') and practical ('ujian praktik') tests. A SIM is valid for 5 years, then must be renewed ('perpanjang'). You apply at a Satpas office or via a mobile SIM unit ('SIM keliling').",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ chữ cái hạng bằng — SIM C = xe máy (motoR → C dễ nhớ là 'cycle'), SIM A = ô tô (Auto). Tính từ trong tiếng Indonesia đứng SAU danh từ: 'SIM baru' (bằng mới), 'motor lama' (xe cũ) — ngược với tiếng Việt nhưng giống thứ tự nói. Tiền tố vòng 'di-…-perpanjang' biến 'panjang' (dài) thành 'được gia hạn' — gặp 'di-' đầu từ là biết câu ở thể bị động. 'Jangan + động từ' = đừng làm gì (lịch sự nhắc nhở).",
    tip_advice_en:
      "Tip for Vietnamese speakers: remember the category letters — SIM C = motorbike, SIM A = Auto (car). Indonesian adjectives come AFTER the noun: 'SIM baru' (new licence), 'motor lama' (old bike). The circumfix in 'diperpanjang' turns 'panjang' (long) into 'to be renewed' — an initial 'di-' signals the passive voice. 'Jangan + verb' = don't do something (a polite reminder).",
    vocabulary: [
      { word: "SIM", en: "driver's licence", vi: "bằng lái xe", pos: "noun (abbr.)", pronunciation_vi: "sim", pronunciation_en: "sim" },
      { word: "mengemudi", en: "to drive", vi: "lái xe", pos: "verb", pronunciation_vi: "me-nge-MU-di", pronunciation_en: "me-nge-MOO-dee" },
      { word: "ujian", en: "exam / test", vi: "kỳ thi", pos: "noun", pronunciation_vi: "u-JI-an", pronunciation_en: "oo-JEE-an" },
      { word: "praktik", en: "practical (test)", vi: "thực hành", pos: "noun", pronunciation_vi: "PRAK-tik", pronunciation_en: "PRAK-teek" },
      { word: "biaya", en: "cost / fee", vi: "chi phí / lệ phí", pos: "noun", pronunciation_vi: "bi-A-ya", pronunciation_en: "bee-A-ya" },
      { word: "perpanjang", en: "to renew / extend", vi: "gia hạn", pos: "verb", pronunciation_vi: "per-PAN-jang", pronunciation_en: "per-PAN-jang" },
      { word: "habis", en: "used up / expired", vi: "hết / hết hạn", pos: "verb/adj.", pronunciation_vi: "HA-bis", pronunciation_en: "HA-bees" },
      { word: "KTP", en: "national ID card", vi: "thẻ căn cước (CMND)", pos: "noun (abbr.)", pronunciation_vi: "ka-te-PE", pronunciation_en: "kah-teh-PEH" },
      { word: "sepeda motor", en: "motorbike", vi: "xe máy", pos: "noun", pronunciation_vi: "se-PE-da MO-tor", pronunciation_en: "se-PEH-da MOH-tor" },
    ],
    dialogue: [
      { speaker: "Pemohon", text: "Selamat pagi, Pak. Saya mau membuat SIM C baru.", vi: "Chào buổi sáng. Tôi muốn làm bằng lái SIM C mới.", en: "Good morning. I'd like to apply for a new SIM C." },
      { speaker: "Petugas", text: "Sudah bawa KTP dan surat keterangan sehat?", vi: "Đã mang theo CMND và giấy khám sức khỏe chưa?", en: "Did you bring your KTP and health certificate?" },
      { speaker: "Pemohon", text: "Sudah. Ujian teori dan praktiknya hari ini juga?", vi: "Rồi ạ. Thi lý thuyết và thực hành hôm nay luôn ạ?", en: "Yes. Are the theory and practical tests today too?" },
      { speaker: "Petugas", text: "Betul. Biayanya seratus ribu. Silakan isi formulir dulu.", vi: "Đúng vậy. Lệ phí một trăm nghìn. Mời điền mẫu đơn trước.", en: "Correct. The fee is one hundred thousand. Please fill in the form first." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về bằng lái còn thiếu:",
        instruction_en: "Fill in the missing licence word:",
        items: [
          { prompt: "Saya mau membuat ___ C untuk sepeda motor. (bằng lái)", answer: "SIM", options: ["SIM", "KTP", "STNK"] },
          { prompt: "Saya harus ikut ___ teori dan praktik. (kỳ thi)", answer: "ujian", options: ["ujian", "untuk", "uang"] },
          { prompt: "SIM saya sudah mau habis, harus ___. (gia hạn)", answer: "diperpanjang", options: ["diperpanjang", "dibuat", "dibawa"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "SIM", answer: "bằng lái xe" },
          { prompt: "mengemudi", answer: "lái xe" },
          { prompt: "biaya", answer: "chi phí / lệ phí" },
          { prompt: "habis", answer: "hết hạn" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn làm bằng lái SIM C cho xe máy.", answer: "Saya mau membuat SIM C untuk sepeda motor." },
          { prompt: "Lệ phí làm bằng lái mới là bao nhiêu?", answer: "Berapa biaya untuk membuat SIM baru?" },
          { prompt: "Đừng quên mang theo CMND.", answer: "Jangan lupa bawa KTP." },
        ],
      },
    ],
  },
  {
    id: "indonesian_drive_stnk_pajak",
    level: "A2",
    category: "driving",
    title_vi: "STNK và thuế xe — đăng ký và nộp thuế tại Samsat",
    title_en: "STNK and road tax — registration and tax at Samsat",
    sentences: [
      {
        en: "Saya mau membayar pajak kendaraan tahunan.",
        vi: "Tôi muốn nộp thuế xe hằng năm.",
        pronunciation_focus: [
          "membayar → mem-BA-yar, 'trả/nộp' (gốc bayar)",
          "pajak → PA-jak, 'thuế'; pajak kendaraan = thuế phương tiện",
          "tahunan → ta-HU-nan, 'hằng năm' (gốc tahun = năm)",
        ],
        pronunciation_focus_en: [
          "membayar → 'mem-BA-yar' — to pay (root 'bayar')",
          "pajak → 'PA-jak' — tax; pajak kendaraan = vehicle tax",
          "tahunan → 'ta-HOO-nan' — annual (root 'tahun' = year)",
        ],
      },
      {
        en: "STNK saya hilang, bagaimana cara mengurusnya?",
        vi: "STNK của tôi bị mất, làm thủ tục thế nào?",
        pronunciation_focus: [
          "STNK → đọc từng chữ 'es-te-en-ka', cà-vẹt/giấy đăng ký xe",
          "hilang → HI-lang, 'mất/biến mất'",
          "mengurusnya → me-ngu-RUS-nya, 'làm thủ tục (cho nó)'",
        ],
        pronunciation_focus_en: [
          "STNK → spelled out; the vehicle registration certificate",
          "hilang → 'HEE-lang' — lost / missing",
          "mengurusnya → 'me-ngoo-ROOS-nya' — to process it (handle the paperwork)",
        ],
      },
      {
        en: "Pajaknya jatuh tempo bulan depan.",
        vi: "Thuế đến hạn vào tháng sau.",
        pronunciation_focus: [
          "jatuh tempo → 'đến hạn/đáo hạn' (thành ngữ cố định)",
          "bulan depan → 'tháng sau' (bulan = tháng, depan = trước/tới)",
          "pajaknya → 'thuế (của nó)' (+ -nya)",
        ],
        pronunciation_focus_en: [
          "jatuh tempo → 'falls due / is due' (a fixed phrase)",
          "bulan depan → 'next month' (bulan = month, depan = next)",
          "pajaknya → 'the tax' (+ '-nya')",
        ],
      },
      {
        en: "Saya harus ke Samsat untuk perpanjang STNK.",
        vi: "Tôi phải đến Samsat để gia hạn STNK.",
        pronunciation_focus: [
          "Samsat → SAM-sat, văn phòng một cửa lo STNK + thuế xe",
          "ke → 'đến/tới' (hướng), khác 'di' (ở)",
          "untuk → UN-tuk, 'để'",
        ],
        pronunciation_focus_en: [
          "Samsat → 'SAM-sat' — the one-stop office for STNK + vehicle tax",
          "ke → 'to' (direction), unlike 'di' (static 'at')",
          "untuk → 'OON-took' — in order to",
        ],
      },
      {
        en: "Jangan lupa bawa BPKB asli dan fotokopi KTP.",
        vi: "Đừng quên mang theo BPKB bản gốc và bản photo CMND.",
        pronunciation_focus: [
          "BPKB → 'be-pe-ka-be', sổ chủ quyền xe (giấy tờ gốc đứng tên chủ)",
          "asli → AS-li, 'bản gốc/thật'",
          "fotokopi → fo-to-KO-pi, 'bản photo/sao'",
        ],
        pronunciation_focus_en: [
          "BPKB → spelled out; the vehicle ownership book (the title document)",
          "asli → 'AS-lee' — original / genuine",
          "fotokopi → 'fo-to-KOH-pee' — photocopy",
        ],
      },
    ],
    cultural_notes_vi:
      "Hai giấy tờ xe quan trọng: STNK (Surat Tanda Nomor Kendaraan) — cà-vẹt, phải mang theo khi lái và gia hạn HẰNG NĂM kèm nộp thuế; và BPKB (Buku Pemilik Kendaraan Bermotor) — sổ chủ quyền, giữ ở nhà, cần khi bán xe hoặc thế chấp. Mọi thủ tục làm ở SAMSAT (Sistem Administrasi Manunggal Satu Atap) — văn phòng một cửa gồm cảnh sát, sở thuế và Jasa Raharja (bảo hiểm). Thuế xe ('pajak kendaraan bermotor', PKB) nộp mỗi năm; 5 năm một lần đổi biển số ('ganti pelat') và STNK mới. Trễ hạn bị phạt ('denda').",
    cultural_notes_en:
      "Two key vehicle documents: the STNK (Surat Tanda Nomor Kendaraan) — the registration certificate you must carry while driving and renew ANNUALLY along with paying tax; and the BPKB (Buku Pemilik Kendaraan Bermotor) — the ownership book you keep at home, needed to sell or pledge the vehicle. Everything is handled at SAMSAT (a one-stop office combining police, the tax office and Jasa Raharja insurance). Vehicle tax ('pajak kendaraan bermotor', PKB) is paid yearly; every 5 years you change the plate ('ganti pelat') and get a new STNK. Late payment incurs a fine ('denda').",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng nhầm hai giấy — STNK = cà-vẹt mang theo người, BPKB = sổ hồng của xe để ở nhà. Cụm 'jatuh tempo' (đến hạn) cố định, không dịch từng chữ ('jatuh' = rơi, 'tempo' = thời điểm). Phân biệt 'asli' (bản gốc) ↔ 'fotokopi' (bản sao) — Samsat thường đòi cả hai. Mốc thời gian tương lai chỉ cần thêm từ, không chia động từ: 'bulan depan' (tháng sau), 'tahun depan' (năm sau), 'minggu lalu' (tuần trước).",
    tip_advice_en:
      "Tip for Vietnamese speakers: don't confuse the two papers — STNK = the registration you carry on you, BPKB = the ownership book kept at home. 'Jatuh tempo' (falls due) is a fixed idiom, not literal ('jatuh' = fall, 'tempo' = time). Distinguish 'asli' (original) ↔ 'fotokopi' (copy) — Samsat usually wants both. Future time needs only a time word, no verb change: 'bulan depan' (next month), 'tahun depan' (next year), 'minggu lalu' (last week).",
    vocabulary: [
      { word: "STNK", en: "vehicle registration certificate", vi: "cà-vẹt / giấy đăng ký xe", pos: "noun (abbr.)", pronunciation_vi: "es-te-en-KA", pronunciation_en: "es-teh-en-KAH" },
      { word: "BPKB", en: "vehicle ownership book", vi: "sổ chủ quyền xe", pos: "noun (abbr.)", pronunciation_vi: "be-pe-ka-BE", pronunciation_en: "beh-peh-kah-BEH" },
      { word: "pajak", en: "tax", vi: "thuế", pos: "noun", pronunciation_vi: "PA-jak", pronunciation_en: "PA-jak" },
      { word: "kendaraan", en: "vehicle", vi: "phương tiện / xe cộ", pos: "noun", pronunciation_vi: "ken-da-RA-an", pronunciation_en: "ken-da-RA-an" },
      { word: "membayar", en: "to pay", vi: "trả / nộp", pos: "verb", pronunciation_vi: "mem-BA-yar", pronunciation_en: "mem-BA-yar" },
      { word: "Samsat", en: "one-stop vehicle admin office", vi: "văn phòng một cửa (giấy tờ xe)", pos: "noun", pronunciation_vi: "SAM-sat", pronunciation_en: "SAM-sat" },
      { word: "jatuh tempo", en: "to fall due / be due", vi: "đến hạn / đáo hạn", pos: "phrase", pronunciation_vi: "JA-tuh TEM-po", pronunciation_en: "JA-tooh TEM-poh" },
      { word: "denda", en: "fine / penalty", vi: "tiền phạt", pos: "noun", pronunciation_vi: "DEN-da", pronunciation_en: "DEN-da" },
      { word: "asli", en: "original / genuine", vi: "bản gốc / thật", pos: "adj.", pronunciation_vi: "AS-li", pronunciation_en: "AS-lee" },
    ],
    dialogue: [
      { speaker: "Wajib pajak", text: "Selamat siang. Saya mau membayar pajak kendaraan tahunan.", vi: "Chào buổi trưa. Tôi muốn nộp thuế xe hằng năm.", en: "Good afternoon. I'd like to pay the annual vehicle tax." },
      { speaker: "Petugas Samsat", text: "Boleh saya lihat STNK dan BPKB aslinya, Pak?", vi: "Cho tôi xem STNK và BPKB bản gốc được không ạ?", en: "May I see your STNK and the original BPKB, sir?" },
      { speaker: "Wajib pajak", text: "Ini, Bu. Pajaknya jatuh tempo minggu depan, masih sempat?", vi: "Đây ạ. Thuế đến hạn tuần sau, còn kịp không ạ?", en: "Here you are. The tax is due next week — am I still in time?" },
      { speaker: "Petugas Samsat", text: "Masih, belum kena denda. Totalnya tiga ratus dua puluh ribu.", vi: "Còn kịp, chưa bị phạt. Tổng cộng ba trăm hai mươi nghìn.", en: "Yes, no fine yet. The total is three hundred and twenty thousand." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về giấy tờ và thuế xe còn thiếu:",
        instruction_en: "Fill in the missing registration/tax word:",
        items: [
          { prompt: "Saya mau ___ pajak kendaraan tahunan. (nộp/trả)", answer: "membayar", options: ["membayar", "membuat", "membawa"] },
          { prompt: "Saya harus ke ___ untuk perpanjang STNK. (văn phòng một cửa)", answer: "Samsat", options: ["Samsat", "Satpas", "Stasiun"] },
          { prompt: "Bawa BPKB ___ dan fotokopi KTP. (bản gốc)", answer: "asli", options: ["asli", "habis", "akhir"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "STNK", answer: "cà-vẹt / giấy đăng ký xe" },
          { prompt: "pajak", answer: "thuế" },
          { prompt: "jatuh tempo", answer: "đến hạn" },
          { prompt: "denda", answer: "tiền phạt" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn nộp thuế xe hằng năm.", answer: "Saya mau membayar pajak kendaraan tahunan." },
          { prompt: "Thuế đến hạn vào tháng sau.", answer: "Pajaknya jatuh tempo bulan depan." },
          { prompt: "Tôi phải đến Samsat để gia hạn STNK.", answer: "Saya harus ke Samsat untuk perpanjang STNK." },
        ],
      },
    ],
  },
  {
    id: "indonesian_drive_bengkel",
    level: "B1",
    category: "driving",
    title_vi: "Bengkel — sửa xe, bảo dưỡng và hỏng hóc",
    title_en: "Bengkel — repairs, servicing and breakdowns",
    sentences: [
      {
        en: "Motor saya mogok di tengah jalan tadi pagi.",
        vi: "Xe máy của tôi chết máy giữa đường sáng nay.",
        pronunciation_focus: [
          "mogok → MO-gok, 'chết máy/hỏng không nổ'",
          "di tengah jalan → 'giữa đường' (tengah = giữa, jalan = đường)",
          "tadi pagi → 'sáng nay (vừa rồi)' (tadi = lúc nãy)",
        ],
        pronunciation_focus_en: [
          "mogok → 'MOH-gok' — to break down / stall",
          "di tengah jalan → 'in the middle of the road'",
          "tadi pagi → 'this morning (earlier)' (tadi = a moment ago)",
        ],
      },
      {
        en: "Tolong cek mesin dan ganti olinya.",
        vi: "Làm ơn kiểm tra động cơ và thay nhớt.",
        pronunciation_focus: [
          "cek → 'kiểm tra' (mượn 'check')",
          "mesin → me-SIN, 'động cơ/máy'",
          "ganti oli → 'thay dầu/nhớt' (ganti = thay, oli = dầu nhớt)",
        ],
        pronunciation_focus_en: [
          "cek → 'check' (loanword)",
          "mesin → 'me-SEEN' — engine / machine",
          "ganti oli → 'change the oil' (ganti = to change, oli = engine oil)",
        ],
      },
      {
        en: "Ban depannya bocor, harus ditambal.",
        vi: "Lốp trước bị thủng, phải vá.",
        pronunciation_focus: [
          "ban → ban, 'lốp/vỏ xe'",
          "bocor → BO-chor, 'thủng/xì' ('c' đọc như 'ch')",
          "ditambal → di-TAM-bal, 'được vá' (thể bị động, gốc tambal = vá)",
        ],
        pronunciation_focus_en: [
          "ban → 'ban' — tyre",
          "bocor → 'BOH-chor' — punctured / leaking ('c' = 'ch')",
          "ditambal → 'dee-TAM-bal' — to be patched (passive, root 'tambal')",
        ],
      },
      {
        en: "Berapa lama servisnya selesai?",
        vi: "Bảo dưỡng xong trong bao lâu?",
        pronunciation_focus: [
          "berapa lama → 'bao lâu' (berapa = bao nhiêu, lama = lâu)",
          "servis → SER-vis, 'bảo dưỡng/dịch vụ sửa'",
          "selesai → se-le-SAI, 'xong/hoàn thành'",
        ],
        pronunciation_focus_en: [
          "berapa lama → 'how long' (berapa = how much, lama = long/duration)",
          "servis → 'SER-vees' — service / servicing",
          "selesai → 'se-le-SAI' — finished / done",
        ],
      },
      {
        en: "Suku cadangnya harus dipesan dulu, jadi agak lama.",
        vi: "Phụ tùng phải đặt trước nên hơi lâu.",
        pronunciation_focus: [
          "suku cadang → 'phụ tùng/linh kiện'",
          "dipesan → di-pe-SAN, 'được đặt (hàng)' (thể bị động)",
          "agak lama → 'hơi lâu' (agak = hơi, mức độ vừa)",
        ],
        pronunciation_focus_en: [
          "suku cadang → 'spare part(s)'",
          "dipesan → 'dee-pe-SAN' — to be ordered (passive)",
          "agak lama → 'a bit long/slow' (agak = somewhat)",
        ],
      },
    ],
    cultural_notes_vi:
      "'Bengkel' là tiệm/gara sửa xe — có bengkel motor (xe máy) và bengkel mobil (ô tô). Xe máy là phương tiện chính của đa số người Indonesia nên bengkel motor có ở khắp nơi. Bảo dưỡng định kỳ gọi là 'servis' (servis rutin); việc thường gặp: ganti oli (thay nhớt), tambal ban (vá lốp), ganti kampas rem (thay má phanh). Hãng xe lớn (Honda, Yamaha) có bengkel resmi (chính hãng, dùng suku cadang asli) và bengkel biasa/pinggir jalan rẻ hơn. Đổ xăng ở SPBU (cây xăng), loại Pertalite/Pertamax do Pertamina bán.",
    cultural_notes_en:
      "A 'bengkel' is a repair shop/garage — there are bengkel motor (motorbike) and bengkel mobil (car). Motorbikes are most Indonesians' main transport, so bengkel motor are everywhere. Routine maintenance is 'servis' (servis rutin); common jobs: ganti oli (oil change), tambal ban (patch a tyre), ganti kampas rem (replace brake pads). Big brands (Honda, Yamaha) have a bengkel resmi (official, using genuine 'suku cadang asli') and cheaper roadside shops. You refuel at an SPBU (petrol station) with Pertalite/Pertamax sold by Pertamina.",
    tip_advice_vi:
      "Mẹo cho người Việt: động từ vàng ở bengkel — 'cek' (kiểm tra), 'ganti' (thay), 'tambal' (vá), 'servis' (bảo dưỡng). Tiền tố 'di-' biến chúng thành bị động: ditambal (được vá), dipesan (được đặt), diganti (được thay) — rất hay nghe khi thợ tả việc cần làm. Cặp mức độ: 'agak' (hơi) < 'cukup' (khá) < 'sangat/banget' (rất). 'Mogok' vừa nghĩa xe chết máy, vừa nghĩa đình công — hiểu theo ngữ cảnh. Hỏi giá trước: 'Berapa biayanya?' và thời gian: 'Berapa lama?'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the golden bengkel verbs — 'cek' (check), 'ganti' (change), 'tambal' (patch), 'servis' (service). The 'di-' prefix makes them passive: ditambal (gets patched), dipesan (gets ordered), diganti (gets replaced) — you'll hear these as the mechanic describes the work. Degree scale: 'agak' (a bit) < 'cukup' (fairly) < 'sangat/banget' (very). 'Mogok' means both 'to stall/break down' and 'to go on strike' — read it from context. Ask price ('Berapa biayanya?') and time ('Berapa lama?') upfront.",
    vocabulary: [
      { word: "bengkel", en: "repair shop / garage", vi: "tiệm sửa xe / gara", pos: "noun", pronunciation_vi: "BENG-kel", pronunciation_en: "BENG-kel" },
      { word: "mogok", en: "to break down / stall", vi: "chết máy / hỏng", pos: "verb", pronunciation_vi: "MO-gok", pronunciation_en: "MOH-gok" },
      { word: "mesin", en: "engine / machine", vi: "động cơ / máy", pos: "noun", pronunciation_vi: "me-SIN", pronunciation_en: "me-SEEN" },
      { word: "ganti oli", en: "to change the oil", vi: "thay nhớt", pos: "verb phrase", pronunciation_vi: "GAN-ti O-li", pronunciation_en: "GAN-tee OH-lee" },
      { word: "ban", en: "tyre", vi: "lốp / vỏ xe", pos: "noun", pronunciation_vi: "ban", pronunciation_en: "ban" },
      { word: "bocor", en: "punctured / leaking", vi: "thủng / xì", pos: "adj./verb", pronunciation_vi: "BO-chor", pronunciation_en: "BOH-chor" },
      { word: "tambal", en: "to patch (a tyre)", vi: "vá (lốp)", pos: "verb", pronunciation_vi: "TAM-bal", pronunciation_en: "TAM-bal" },
      { word: "servis", en: "service / servicing", vi: "bảo dưỡng", pos: "noun/verb", pronunciation_vi: "SER-vis", pronunciation_en: "SER-vees" },
      { word: "suku cadang", en: "spare part(s)", vi: "phụ tùng / linh kiện", pos: "noun", pronunciation_vi: "SU-ku CA-dang", pronunciation_en: "SOO-koo CHA-dang" },
      { word: "rem", en: "brake(s)", vi: "phanh / thắng", pos: "noun", pronunciation_vi: "rem", pronunciation_en: "rem" },
    ],
    dialogue: [
      { speaker: "Pelanggan", text: "Mas, motor saya mogok tadi pagi. Tolong cek mesinnya, ya.", vi: "Anh ơi, xe máy tôi chết máy sáng nay. Làm ơn kiểm tra động cơ giúp nhé.", en: "Hey, my bike stalled this morning. Please check the engine." },
      { speaker: "Montir", text: "Sebentar saya periksa. Wah, olinya kering dan ban depannya bocor juga.", vi: "Để tôi xem chút. Ồ, nhớt cạn mà lốp trước cũng bị thủng nữa.", en: "Let me have a look. Ah, the oil is dry and the front tyre is punctured too." },
      { speaker: "Pelanggan", text: "Tolong ganti oli dan tambal bannya. Berapa lama servisnya selesai?", vi: "Làm ơn thay nhớt và vá lốp. Bảo dưỡng xong trong bao lâu?", en: "Please change the oil and patch the tyre. How long until it's done?" },
      { speaker: "Montir", text: "Sekitar satu jam. Tapi kampas remnya juga tipis, perlu diganti nanti.", vi: "Khoảng một tiếng. Nhưng má phanh cũng mòn rồi, sau cần thay.", en: "About an hour. But the brake pads are thin too — they'll need replacing later." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về sửa xe còn thiếu:",
        instruction_en: "Fill in the missing repair word:",
        items: [
          { prompt: "Motor saya ___ di tengah jalan tadi pagi. (chết máy)", answer: "mogok", options: ["mogok", "mahal", "minum"] },
          { prompt: "Ban depannya bocor, harus ___. (vá)", answer: "ditambal", options: ["ditambal", "dibawa", "dibeli"] },
          { prompt: "Tolong cek mesin dan ganti ___. (nhớt)", answer: "olinya", options: ["olinya", "uangnya", "namanya"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "bengkel", answer: "tiệm sửa xe" },
          { prompt: "mesin", answer: "động cơ" },
          { prompt: "bocor", answer: "thủng" },
          { prompt: "suku cadang", answer: "phụ tùng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Xe máy của tôi chết máy giữa đường.", answer: "Motor saya mogok di tengah jalan." },
          { prompt: "Làm ơn kiểm tra động cơ và thay nhớt.", answer: "Tolong cek mesin dan ganti olinya." },
          { prompt: "Bảo dưỡng xong trong bao lâu?", answer: "Berapa lama servisnya selesai?" },
        ],
      },
    ],
  },
];

export default drivingTransportLessons;
