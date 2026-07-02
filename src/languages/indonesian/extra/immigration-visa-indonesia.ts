// Immigration visa Indonesian (Vietnamese -> Indonesian study track).
//
// A1 Wave 11 file. Covers visa, paspor, KITAS, imigrasi, perpanjangan izin
// tinggal, sponsor, antrean, and dokumen. Self-contained so no registry or
// sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
export type IndonesianExercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
};

export const immigrationVisaIndonesiaLessons: IndonesianLesson[] = [
  {
    id: "indonesian_visa_documents_queue",
    level: "A2",
    category: "life_admin",
    title_vi: "Visa, hộ chiếu và xếp hàng ở imigrasi",
    title_en: "Visa, passport and queueing at immigration",
    sentences: [
      {
        en: "Saya mau bertanya tentang visa Indonesia.",
        vi: "Tôi muốn hỏi về visa Indonesia.",
        pronunciation_focus: [
          "SA-ya mau ber-TA-nya ten-TANG VI-sa in-do-NE-sia - `bertanya tentang` = hỏi về.",
          "`visa` đọc gần VI-sa, không kéo dài như tiếng Anh.",
          "Lỗi người Việt: bỏ `tentang` và nói `tanya visa`. Trong văn phòng, `bertanya tentang visa` lịch sự và rõ hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau ber-TA-nya ten-TANG VEE-sa in-do-NE-sia - `bertanya tentang` = ask about.",
          "`visa` is pronounced close to VEE-sa, not with a long English diphthong.",
          "VN-speaker trap: dropping `tentang` and saying `tanya visa`. At an office, `bertanya tentang visa` is clearer and more polite.",
        ],
      },
      {
        en: "Paspor saya masih berlaku enam bulan.",
        vi: "Hộ chiếu của tôi còn hiệu lực sáu tháng.",
        pronunciation_focus: [
          "PAS-por SA-ya ma-SIH ber-LA-ku e-NAM BU-lan - `masih berlaku` = còn hiệu lực/còn hạn.",
          "`paspor` phải bật rõ `s` và `r`; đừng đọc thành 'pát-po'.",
          "Lỗi người Việt: nói `paspor masih bagus`. Giấy tờ còn hạn dùng `masih berlaku`.",
        ],
        pronunciation_focus_en: [
          "PAS-por SA-ya ma-SIH ber-LA-ku e-NAM BOO-lan - `masih berlaku` = still valid.",
          "Sound both `s` and `r` in `paspor`; do not swallow the final consonants.",
          "VN-speaker trap: saying `paspor masih bagus`. For document validity, use `masih berlaku`.",
        ],
      },
      {
        en: "Dokumen apa saja yang harus saya bawa?",
        vi: "Tôi phải mang theo những giấy tờ gì?",
        pronunciation_focus: [
          "do-ku-MEN A-pa SA-ja yang HA-rus SA-ya BA-wa - `apa saja` hỏi cả danh sách.",
          "`bawa` = mang theo; rất hay dùng ở quầy thủ tục.",
          "Lỗi người Việt: hỏi `dokumen apa` nghe như chỉ một giấy tờ. Thêm `saja` để hỏi danh sách đầy đủ.",
        ],
        pronunciation_focus_en: [
          "do-koo-MEN A-pa SA-ja yang HA-roos SA-ya BA-wa - `apa saja` asks for a full list.",
          "`bawa` = bring; very common at service counters.",
          "VN-speaker trap: asking `dokumen apa`, which can sound like one document. Add `saja` for the complete list.",
        ],
      },
      {
        en: "Saya sudah ambil nomor antrean.",
        vi: "Tôi đã lấy số thứ tự xếp hàng.",
        pronunciation_focus: [
          "SA-ya SU-dah AM-bil NO-mor an-TRE-an - `nomor antrean` = số thứ tự xếp hàng.",
          "`antrean` cũng viết/đọc gần `antrian`; cả hai gặp trong đời thường, nhưng `antrean` chuẩn hơn.",
          "Lỗi người Việt: dịch 'lấy số' thành `ambil angka`. Ở văn phòng nói `ambil nomor antrean`.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah AM-bil NO-mor an-TRE-an - `nomor antrean` = queue number.",
          "You may see `antrian` in daily use, but `antrean` is the more standard spelling.",
          "VN-speaker trap: translating 'take a number' as `ambil angka`. At offices, say `ambil nomor antrean`.",
        ],
      },
      {
        en: "Loket imigrasi buka jam delapan pagi.",
        vi: "Quầy nhập cư mở lúc tám giờ sáng.",
        pronunciation_focus: [
          "LO-ket i-mi-GRA-si BU-ka jam de-LA-pan PA-gi - `loket` = quầy; `imigrasi` = nhập cư/cục xuất nhập cảnh.",
          "`jam delapan pagi` = 8 giờ sáng; `jam` đứng trước số giờ.",
          "Lỗi người Việt: nói `pukul` trong mọi câu. `Pukul` đúng, nhưng `jam` tự nhiên hơn trong hội thoại.",
        ],
        pronunciation_focus_en: [
          "LO-ket i-mi-GRA-see BOO-ka jam de-LA-pan PA-gee - `loket` = counter; `imigrasi` = immigration.",
          "`jam delapan pagi` = 8 a.m.; `jam` comes before the hour.",
          "VN-speaker trap: using formal `pukul` everywhere. `Pukul` is correct, but `jam` is more conversational.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, thủ tục visa và izin tinggal thường liên quan đến kantor imigrasi, app/website đặt lịch, nomor antrean, và danh sách dokumen. Người Việt nên chuẩn bị ảnh hộ chiếu, bản scan paspor, vé đi/về nếu được yêu cầu, địa chỉ ở Indonesia, và bukti pembayaran nếu đã thanh toán. Câu hỏi lịch sự ở quầy thường bắt đầu bằng `Saya mau bertanya...` hoặc `Mohon informasi...`.",
    cultural_notes_en:
      "In Indonesia, visa and stay-permit procedures often involve the immigration office, appointment apps/websites, queue numbers, and document lists. Vietnamese learners should be ready with passport photos, passport scans, onward/return tickets if required, an Indonesian address, and proof of payment if already paid. Polite counter questions often start with `Saya mau bertanya...` or `Mohon informasi...`.",
    tip_advice_vi:
      "Bộ câu sống còn: `Dokumen apa saja yang harus saya bawa?`, `Saya sudah ambil nomor antrean`, `Paspor saya masih berlaku...`. Bẫy lớn là dùng từ chung `giấy tờ` quá nhiều; trong tiếng Indonesia hành chính, hãy dùng đúng `dokumen`, `paspor`, `visa`, `nomor antrean`.",
    tip_advice_en:
      "Survival set: `Dokumen apa saja yang harus saya bawa?`, `Saya sudah ambil nomor antrean`, `Paspor saya masih berlaku...`. The big trap is using generic wording for paperwork; in Indonesian admin contexts, use precise words like `dokumen`, `paspor`, `visa`, `nomor antrean`.",
    vocabulary: [
      { word: "visa", en: "visa", vi: "visa/thị thực", pos: "noun", pronunciation_vi: "VI-sa", pronunciation_en: "VEE-sa" },
      { word: "paspor", en: "passport", vi: "hộ chiếu", pos: "noun", pronunciation_vi: "PAS-por", pronunciation_en: "PAS-por" },
      { word: "imigrasi", en: "immigration", vi: "nhập cư/cục xuất nhập cảnh", pos: "noun", pronunciation_vi: "i-mi-GRA-si", pronunciation_en: "i-mi-GRA-see" },
      { word: "dokumen", en: "documents", vi: "giấy tờ/tài liệu", pos: "noun", pronunciation_vi: "do-ku-MEN", pronunciation_en: "do-koo-MEN" },
      { word: "nomor antrean", en: "queue number", vi: "số thứ tự xếp hàng", pos: "noun phrase", pronunciation_vi: "NO-mor an-TRE-an", pronunciation_en: "NO-mor an-TRE-an" },
      { word: "loket", en: "service counter", vi: "quầy", pos: "noun", pronunciation_vi: "LO-ket", pronunciation_en: "LO-ket" },
    ],
    dialogue: [
      { speaker: "Pemohon", text: "Selamat pagi. Saya mau bertanya tentang visa Indonesia.", vi: "Chào buổi sáng. Tôi muốn hỏi về visa Indonesia.", en: "Good morning. I want to ask about an Indonesian visa." },
      { speaker: "Petugas", text: "Silakan ambil nomor antrean dulu, lalu tunggu di ruang ini.", vi: "Vui lòng lấy số thứ tự trước, rồi chờ ở phòng này.", en: "Please take a queue number first, then wait in this room." },
      { speaker: "Pemohon", text: "Baik. Dokumen apa saja yang harus saya bawa?", vi: "Vâng. Tôi phải mang theo những giấy tờ gì?", en: "Okay. What documents do I need to bring?" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "paspor", answer: "hộ chiếu" },
          { prompt: "nomor antrean", answer: "số thứ tự xếp hàng" },
          { prompt: "loket", answer: "quầy" },
          { prompt: "dokumen", answer: "giấy tờ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi đã lấy số thứ tự.", answer: "Saya sudah ambil nomor antrean." },
          { prompt: "Tôi phải mang theo những giấy tờ gì?", answer: "Dokumen apa saja yang harus saya bawa?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_kitas_stay_permit_extension",
    level: "B1",
    category: "life_admin",
    title_vi: "KITAS và gia hạn izin tinggal",
    title_en: "KITAS and stay-permit extensions",
    sentences: [
      {
        en: "Saya ingin memperpanjang izin tinggal saya.",
        vi: "Tôi muốn gia hạn giấy phép cư trú của tôi.",
        pronunciation_focus: [
          "SA-ya I-ngin mem-per-PAN-jang I-zin TING-gal SA-ya - `memperpanjang` = gia hạn; `izin tinggal` = giấy phép cư trú.",
          "`ingin` trang trọng hơn `mau`, hợp ở kantor imigrasi.",
          "Lỗi người Việt: dùng `panjangkan` hoặc `bikin panjang`. Thuật ngữ thủ tục là `memperpanjang`.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin mem-per-PAN-jang EE-zin TING-gal SA-ya - `memperpanjang` = extend; `izin tinggal` = stay permit.",
          "`ingin` is more formal than `mau`, fitting at immigration offices.",
          "VN-speaker trap: using `panjangkan` or `bikin panjang`. The admin term is `memperpanjang`.",
        ],
      },
      {
        en: "KITAS saya akan habis bulan depan.",
        vi: "KITAS của tôi sẽ hết hạn vào tháng sau.",
        pronunciation_focus: [
          "KI-tas SA-ya A-kan HA-bis BU-lan de-PAN - `akan habis` = sẽ hết hạn.",
          "`KITAS` thường đọc như một từ `KI-tas`, không đọc từng chữ cái.",
          "Lỗi người Việt: nói `KITAS mati`. Có người nói vậy thân mật, nhưng ở văn phòng dùng `akan habis` hoặc `masa berlaku habis`.",
        ],
        pronunciation_focus_en: [
          "KEE-tas SA-ya A-kan HA-bis BOO-lan de-PAN - `akan habis` = will expire.",
          "`KITAS` is usually pronounced as one word, `KEE-tas`, not letter by letter.",
          "VN-speaker trap: saying `KITAS mati`. You may hear it casually, but at the office use `akan habis` or `masa berlaku habis`.",
        ],
      },
      {
        en: "Berapa lama proses perpanjangan izin tinggal?",
        vi: "Quá trình gia hạn giấy phép cư trú mất bao lâu?",
        pronunciation_focus: [
          "be-RA-pa LA-ma PRO-ses per-pan-JA-ngan I-zin TING-gal - `perpanjangan` là danh từ 'sự gia hạn'.",
          "`berapa lama` = bao lâu; hỏi thời lượng xử lý.",
          "Lỗi người Việt: lẫn động từ `memperpanjang` với danh từ `perpanjangan`. Quy trình là `proses perpanjangan`.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa LA-ma PRO-ses per-pan-JA-ngan EE-zin TING-gal - `perpanjangan` is the noun 'extension'.",
          "`berapa lama` = how long; it asks about duration.",
          "VN-speaker trap: mixing the verb `memperpanjang` with the noun `perpanjangan`. The process is `proses perpanjangan`.",
        ],
      },
      {
        en: "Sponsor saya sudah mengirim surat sponsor.",
        vi: "Bên bảo lãnh của tôi đã gửi thư bảo lãnh.",
        pronunciation_focus: [
          "SPON-sor SA-ya SU-dah me-NGI-rim SU-rat SPON-sor - `sponsor` = bên bảo lãnh trong ngữ cảnh nhập cư.",
          "`surat sponsor` = thư bảo lãnh; `surat` là giấy/thư chính thức.",
          "Lỗi người Việt: hiểu `sponsor` là nhà tài trợ tiền. Trong visa, `sponsor` là người/công ty bảo lãnh.",
        ],
        pronunciation_focus_en: [
          "SPON-sor SA-ya SOO-dah me-NGEE-rim SOO-rat SPON-sor - `sponsor` = sponsoring party in immigration.",
          "`surat sponsor` = sponsor letter; `surat` is an official letter/document.",
          "VN-speaker trap: understanding `sponsor` as a money donor. In visas, it means the person/company sponsoring you.",
        ],
      },
      {
        en: "Apakah saya perlu datang lagi untuk wawancara?",
        vi: "Tôi có cần quay lại để phỏng vấn không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya per-LU DA-tang LA-gi UN-tuk wa-WAN-ca-ra - `apakah` mở câu hỏi trang trọng.",
          "`datang lagi` = quay lại/đến lại; `wawancara` = phỏng vấn.",
          "Lỗi người Việt: dùng `apa saya perlu...` ở quầy. Hiểu được, nhưng `apakah saya perlu...` lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SA-ya per-LOO DA-tang LA-gee OON-tuk wa-WAN-cha-ra - `apakah` opens a formal yes/no question.",
          "`datang lagi` = come back; `wawancara` = interview.",
          "VN-speaker trap: using casual `apa saya perlu...` at the counter. Understandable, but `apakah saya perlu...` is more polite.",
        ],
      },
      {
        en: "Saya menunggu konfirmasi dari kantor imigrasi.",
        vi: "Tôi đang chờ xác nhận từ văn phòng nhập cư.",
        pronunciation_focus: [
          "SA-ya me-NUNG-gu kon-fir-MA-si da-RI KAN-tor i-mi-GRA-si - `konfirmasi` = xác nhận.",
          "`dari kantor imigrasi` = từ văn phòng nhập cư; `dari` chỉ nguồn.",
          "Lỗi người Việt: bỏ tiền tố và nói `saya tunggu`. Trong văn cảnh trang trọng, `saya menunggu` đẹp hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya me-NOONG-goo kon-fir-MA-see da-REE KAN-tor i-mi-GRA-see - `konfirmasi` = confirmation.",
          "`dari kantor imigrasi` = from the immigration office; `dari` marks the source.",
          "VN-speaker trap: dropping the prefix and saying `saya tunggu`. In formal contexts, `saya menunggu` sounds better.",
        ],
      },
    ],
    cultural_notes_vi:
      "KITAS là izin tinggal terbatas, tức giấy phép cư trú có thời hạn. Khi gia hạn, bạn thường cần paspor còn hạn, KITAS hiện tại, surat sponsor, formulir, ảnh, bukti pembayaran, và đôi khi lịch hẹn hoặc wawancara. Quy trình và yêu cầu có thể thay đổi theo loại visa và kantor imigrasi, nên trong bài học này dùng ngôn ngữ thực tế để hỏi và xác nhận, không thay thế tư vấn pháp lý.",
    cultural_notes_en:
      "KITAS is a limited stay permit. For extension, you often need a valid passport, current KITAS, sponsor letter, forms, photos, proof of payment, and sometimes an appointment or interview. Procedures and requirements can change by visa type and immigration office, so this lesson gives practical language for asking and confirming, not legal advice.",
    tip_advice_vi:
      "Phân biệt `memperpanjang` và `perpanjangan`: `Saya ingin memperpanjang izin tinggal` là hành động gia hạn; `proses perpanjangan` là quá trình gia hạn. Đây là bẫy lớn vì tiếng Việt dùng cùng một từ 'gia hạn' cho cả động từ và danh từ.",
    tip_advice_en:
      "Distinguish `memperpanjang` and `perpanjangan`: `Saya ingin memperpanjang izin tinggal` is the action of extending; `proses perpanjangan` is the extension process. This is a big trap because Vietnamese uses the same wording for both verb and noun.",
    vocabulary: [
      { word: "KITAS", en: "limited stay permit", vi: "thẻ/giấy phép cư trú tạm thời", pos: "noun", pronunciation_vi: "KI-tas", pronunciation_en: "KEE-tas" },
      { word: "izin tinggal", en: "stay permit", vi: "giấy phép cư trú", pos: "noun phrase", pronunciation_vi: "I-zin TING-gal", pronunciation_en: "EE-zin TING-gal" },
      { word: "memperpanjang", en: "to extend", vi: "gia hạn", pos: "verb", pronunciation_vi: "mem-per-PAN-jang", pronunciation_en: "mem-per-PAN-jang" },
      { word: "perpanjangan", en: "extension", vi: "sự gia hạn", pos: "noun", pronunciation_vi: "per-pan-JA-ngan", pronunciation_en: "per-pan-JA-ngan" },
      { word: "sponsor", en: "sponsor/guarantor", vi: "bên bảo lãnh", pos: "noun", pronunciation_vi: "SPON-sor", pronunciation_en: "SPON-sor" },
      { word: "surat sponsor", en: "sponsor letter", vi: "thư bảo lãnh", pos: "noun phrase", pronunciation_vi: "SU-rat SPON-sor", pronunciation_en: "SOO-rat SPON-sor" },
      { word: "wawancara", en: "interview", vi: "phỏng vấn", pos: "noun", pronunciation_vi: "wa-WAN-ca-ra", pronunciation_en: "wa-WAN-cha-ra" },
    ],
    dialogue: [
      { speaker: "Pemohon", text: "Saya ingin memperpanjang izin tinggal saya. KITAS saya akan habis bulan depan.", vi: "Tôi muốn gia hạn giấy phép cư trú của tôi. KITAS của tôi sẽ hết hạn vào tháng sau.", en: "I want to extend my stay permit. My KITAS will expire next month." },
      { speaker: "Petugas", text: "Apakah sponsor Anda sudah mengirim surat sponsor?", vi: "Bên bảo lãnh của anh/chị đã gửi thư bảo lãnh chưa?", en: "Has your sponsor sent the sponsor letter?" },
      { speaker: "Pemohon", text: "Sudah. Saya menunggu konfirmasi dari kantor imigrasi.", vi: "Rồi. Tôi đang chờ xác nhận từ văn phòng nhập cư.", en: "Yes. I am waiting for confirmation from the immigration office." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng.",
        instruction_en: "Fill in the correct word.",
        items: [
          { prompt: "Saya ingin ___ izin tinggal saya.", answer: "memperpanjang" },
          { prompt: "Berapa lama proses ___ izin tinggal?", answer: "perpanjangan" },
          { prompt: "Sponsor saya sudah mengirim ___ sponsor.", answer: "surat" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Sửa câu Việt hóa sang câu tự nhiên hơn.",
        instruction_en: "Rewrite the Vietnamese-style sentence into more natural Indonesian.",
        items: [
          { prompt: "Saya mau bikin panjang KITAS.", answer: "Saya ingin memperpanjang KITAS saya." },
          { prompt: "Sponsor saya adalah nhà tài trợ.", answer: "Sponsor saya adalah pihak yang menjamin visa saya." },
        ],
      },
    ],
  },
  {
    id: "indonesian_immigration_status_followup",
    level: "B1",
    category: "life_admin",
    title_vi: "Theo dõi hồ sơ và bổ sung dokumen",
    title_en: "Following up and adding documents",
    sentences: [
      {
        en: "Saya mau mengecek status permohonan visa saya.",
        vi: "Tôi muốn kiểm tra trạng thái hồ sơ xin visa của tôi.",
        pronunciation_focus: [
          "SA-ya mau me-NGE-cek STA-tus per-mo-HO-nan VI-sa SA-ya - `permohonan visa` = hồ sơ/đơn xin visa.",
          "`mengecek` trang trọng hơn `cek` khi nói với nhân viên.",
          "Lỗi người Việt: nói `status aplikasi visa`. Trong thủ tục, `permohonan visa` tự nhiên hơn `aplikasi visa`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-NGE-chek STA-tus per-mo-HO-nan VEE-sa SA-ya - `permohonan visa` = visa application/request.",
          "`mengecek` is more formal than `cek` when speaking with staff.",
          "VN-speaker trap: saying `status aplikasi visa`. In admin Indonesian, `permohonan visa` is more natural than `aplikasi visa`.",
        ],
      },
      {
        en: "Apakah dokumen saya sudah diperiksa?",
        vi: "Giấy tờ của tôi đã được kiểm tra chưa?",
        pronunciation_focus: [
          "A-pa-kah do-ku-MEN SA-ya SU-dah di-pe-RIK-sa - `diperiksa` = được kiểm tra.",
          "`sudah` = đã; câu hỏi `sudah ...?` rất giống tiếng Việt 'đã ... chưa?'.",
          "Lỗi người Việt: bỏ bị động `di-` và nói `dokumen sudah periksa`. Đúng: `dokumen sudah diperiksa`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah do-koo-MEN SA-ya SOO-dah dee-pe-RIK-sa - `diperiksa` = checked/examined.",
          "`sudah` = already; `sudah ...?` maps well to Vietnamese 'already ... yet?'.",
          "VN-speaker trap: dropping passive `di-` and saying `dokumen sudah periksa`. Correct: `dokumen sudah diperiksa`.",
        ],
      },
      {
        en: "Saya perlu melengkapi dokumen apa lagi?",
        vi: "Tôi cần bổ sung thêm giấy tờ gì nữa?",
        pronunciation_focus: [
          "SA-ya per-LU me-leng-KA-pi do-ku-MEN A-pa LA-gi - `melengkapi` = bổ sung/hoàn thiện cho đủ.",
          "`apa lagi` = gì nữa; hỏi phần còn thiếu.",
          "Lỗi người Việt: nói `tambah dokumen apa`. Hiểu được, nhưng văn phòng dùng `melengkapi dokumen`.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO me-leng-KA-pee do-koo-MEN A-pa LA-gee - `melengkapi` = complete/supplement.",
          "`apa lagi` = what else; asks what is still missing.",
          "VN-speaker trap: saying `tambah dokumen apa`. Understandable, but offices use `melengkapi dokumen`.",
        ],
      },
      {
        en: "Batas waktu pengumpulan dokumen kapan?",
        vi: "Hạn nộp giấy tờ là khi nào?",
        pronunciation_focus: [
          "BA-tas WAK-tu pe-ngum-PUL-an do-ku-MEN KA-pan - `batas waktu` = hạn chót; `pengumpulan` = việc nộp/thu hồ sơ.",
          "`kapan` = khi nào; đặt cuối câu rất tự nhiên.",
          "Lỗi người Việt: dịch 'deadline' bằng tiếng Anh trong câu Indonesia. Nói `batas waktu`.",
        ],
        pronunciation_focus_en: [
          "BA-tas WAK-too pe-ngoom-POOL-an do-koo-MEN KA-pan - `batas waktu` = deadline; `pengumpulan` = submission/collection.",
          "`kapan` = when; it is natural at the end of the sentence.",
          "VN-speaker trap: using English `deadline` inside Indonesian. Say `batas waktu`.",
        ],
      },
      {
        en: "Kalau ada dokumen yang kurang, mohon beri tahu saya.",
        vi: "Nếu có giấy tờ nào thiếu, vui lòng báo cho tôi biết.",
        pronunciation_focus: [
          "KA-lau A-da do-ku-MEN yang KU-rang, MO-hon BE-ri TA-hu SA-ya - `yang kurang` = cái còn thiếu.",
          "`mohon beri tahu` = vui lòng báo cho biết; lịch sự hơn `kasih tahu`.",
          "Lỗi người Việt: dùng `kurang` sau danh từ kiểu tiếng Việt. Cấu trúc đúng: `dokumen yang kurang`.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da do-koo-MEN yang KOO-rang, MO-hon BEH-ree TA-hoo SA-ya - `yang kurang` = what is missing.",
          "`mohon beri tahu` = please inform; more polite than `kasih tahu`.",
          "VN-speaker trap: placing `kurang` after the noun Vietnamese-style. Correct structure: `dokumen yang kurang`.",
        ],
      },
      {
        en: "Saya akan datang lagi besok pagi.",
        vi: "Tôi sẽ quay lại vào sáng mai.",
        pronunciation_focus: [
          "SA-ya A-kan DA-tang LA-gi BE-sok PA-gi - `datang lagi` = quay lại/đến lại.",
          "`akan` = sẽ, giống tiếng Việt; động từ `datang` không đổi.",
          "Lỗi người Việt: nói `kembali lagi` trong mọi ngữ cảnh. Đến lại văn phòng nói `datang lagi` rất tự nhiên.",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan DA-tang LA-gee BE-sok PA-gee - `datang lagi` = come back.",
          "`akan` = will, like Vietnamese; the verb `datang` does not change.",
          "VN-speaker trap: using `kembali lagi` everywhere. For coming back to an office, `datang lagi` is natural.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi theo dõi hồ sơ ở kantor imigrasi, nên nói theo dữ kiện: nomor permohonan, nama, tanggal pengajuan, jenis visa, và dokumen yang sudah diunggah/dibawa. Nếu nhân viên yêu cầu bổ sung, hỏi rõ `dokumen apa lagi`, `batas waktu kapan`, và apakah harus datang langsung. Văn phong nên ngắn, lịch sự, và không đổ lỗi.",
    cultural_notes_en:
      "When following up at immigration, speak with concrete details: application number, name, submission date, visa type, and documents already uploaded/brought. If staff asks for more, clarify `dokumen apa lagi`, `batas waktu kapan`, and whether you must come in person. Keep the tone short, polite, and non-blaming.",
    tip_advice_vi:
      "Cụm theo dõi hồ sơ tốt: `mengecek status permohonan`, `dokumen sudah diperiksa`, `melengkapi dokumen`, `batas waktu`, `mohon beri tahu`. Bẫy lớn là câu bị động `di-`: giấy tờ `diperiksa`, đơn `diproses`, visa `disetujui` hoặc `ditolak`.",
    tip_advice_en:
      "Good follow-up phrases: `mengecek status permohonan`, `dokumen sudah diperiksa`, `melengkapi dokumen`, `batas waktu`, `mohon beri tahu`. The big trap is passive `di-`: documents are `diperiksa`, applications are `diproses`, visas are `disetujui` or `ditolak`.",
    vocabulary: [
      { word: "permohonan visa", en: "visa application", vi: "hồ sơ/đơn xin visa", pos: "noun phrase", pronunciation_vi: "per-mo-HO-nan VI-sa", pronunciation_en: "per-mo-HO-nan VEE-sa" },
      { word: "mengecek status", en: "check status", vi: "kiểm tra trạng thái", pos: "verb phrase", pronunciation_vi: "me-NGE-cek STA-tus", pronunciation_en: "me-NGE-chek STA-tus" },
      { word: "diperiksa", en: "checked/examined", vi: "được kiểm tra", pos: "passive verb", pronunciation_vi: "di-pe-RIK-sa", pronunciation_en: "dee-pe-RIK-sa" },
      { word: "melengkapi dokumen", en: "complete/supplement documents", vi: "bổ sung/hoàn thiện giấy tờ", pos: "verb phrase", pronunciation_vi: "me-leng-KA-pi do-ku-MEN", pronunciation_en: "me-leng-KA-pee do-koo-MEN" },
      { word: "batas waktu", en: "deadline", vi: "hạn chót", pos: "noun phrase", pronunciation_vi: "BA-tas WAK-tu", pronunciation_en: "BA-tas WAK-too" },
      { word: "mohon beri tahu", en: "please inform", vi: "vui lòng báo cho biết", pos: "polite phrase", pronunciation_vi: "MO-hon BE-ri TA-hu", pronunciation_en: "MO-hon BEH-ree TA-hoo" },
    ],
    dialogue: [
      { speaker: "Pemohon", text: "Saya mau mengecek status permohonan visa saya.", vi: "Tôi muốn kiểm tra trạng thái hồ sơ xin visa của tôi.", en: "I want to check the status of my visa application." },
      { speaker: "Petugas", text: "Dokumen Anda sedang diperiksa. Ada satu dokumen yang kurang.", vi: "Giấy tờ của anh/chị đang được kiểm tra. Có một giấy tờ còn thiếu.", en: "Your documents are being checked. One document is missing." },
      { speaker: "Pemohon", text: "Saya perlu melengkapi dokumen apa lagi?", vi: "Tôi cần bổ sung thêm giấy tờ gì nữa?", en: "What document do I need to add?" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "permohonan visa", answer: "hồ sơ xin visa" },
          { prompt: "diperiksa", answer: "được kiểm tra" },
          { prompt: "batas waktu", answer: "hạn chót" },
          { prompt: "melengkapi dokumen", answer: "bổ sung giấy tờ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn kiểm tra trạng thái hồ sơ visa.", answer: "Saya mau mengecek status permohonan visa saya." },
          { prompt: "Nếu có giấy tờ nào thiếu, vui lòng báo cho tôi biết.", answer: "Kalau ada dokumen yang kurang, mohon beri tahu saya." },
        ],
      },
    ],
  },
];
