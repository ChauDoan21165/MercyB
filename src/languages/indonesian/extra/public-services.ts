// Public Services Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker, healthcare-emergency,
// restaurant-hospitality, school-education, phone-calls), which in turn mirror the
// French `FrenchLesson` shape. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Indonesian is written in Latin script and is largely phonetic. For Vietnamese
// speakers the big WINS are: no grammatical gender, no verb conjugation, no tones,
// no articles. The traps in this topic are: bureaucratic acronyms (KTP, KK, RT/RW),
// the meN- / pe-...-an affix system around `urus` and `daftar`, polite `Pak`/`Bu`
// address at a counter, and clear word-final consonants (`surat`, `dokumen`, `loket`).

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
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
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill-blank, checklist) can vary.
export type IndonesianExercise = Record<string, any>;

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_public_services",
    level: "B1",
    category: "public_services",
    title_vi: "Dịch vụ công và giấy tờ hành chính",
    title_en: "Public services and paperwork",
    sentences: [
      // ── At the post office ────────────────────────────────────────────────
      {
        en: "Saya mau kirim paket ini ke Vietnam.",
        vi: "Tôi muốn gửi gói hàng này đi Việt Nam.",
        pronunciation_focus: [
          "SA-ya MAU KI-rim PA-ket I-ni ke vi-et-NAM — `kirim` = gửi; `paket` = bưu kiện/gói hàng.",
          "Lợi thế người Việt: không chia động từ — `mau kirim` (muốn gửi) ghép thẳng, y như tiếng Việt.",
          "Lỗi người Việt: đọc rớt `k` cuối `paket`. Phải bật rõ: 'PA-ket'.",
          "Luyện: `Saya mau kirim paket ini ke Vietnam.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU KI-rim PA-ket I-ni ke vi-et-NAM — `kirim` = to send; `paket` = parcel.",
          "VN-speaker win: no conjugation — `mau kirim` (want to send) stacks straight, just like Vietnamese.",
          "VN-speaker trap: dropping the final `k` in `paket`. Release it clearly: 'PA-ket'.",
          "Drill: `Saya mau kirim paket ini ke Vietnam.`",
        ],
      },
      {
        en: "Berapa ongkos kirim dan berapa lama sampainya?",
        vi: "Phí gửi bao nhiêu và mất bao lâu thì tới?",
        pronunciation_focus: [
          "be-RA-pa ONG-kos KI-rim dan be-RA-pa LA-ma sam-PAI-nya — `ongkos kirim` = phí vận chuyển; `berapa lama` = bao lâu.",
          "Mẹo: `berapa` hỏi số/lượng — `berapa ongkos` (giá), `berapa lama` (thời gian). Hỏi giá/thời gian luôn dùng `berapa`.",
          "Lỗi người Việt: hỏi `apa ongkos` cho giá. Hỏi giá phải là `berapa ongkos`.",
          "Luyện: `Berapa ongkos kirim?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa ONG-kos KI-rim dan be-RA-pa LA-ma sam-PAI-nya — `ongkos kirim` = shipping cost; `berapa lama` = how long.",
          "Tip: `berapa` asks amount — `berapa ongkos` (price), `berapa lama` (time). Prices and durations both take `berapa`.",
          "VN-speaker trap: asking `apa ongkos` for a price. Use `berapa ongkos`.",
          "Drill: `Berapa ongkos kirim?`",
        ],
      },
      // ── At the kelurahan / making ID documents ────────────────────────────
      {
        en: "Saya mau mengurus KTP yang hilang.",
        vi: "Tôi muốn làm lại căn cước (KTP) bị mất.",
        pronunciation_focus: [
          "SA-ya MAU me-ngu-RUS ka-te-pe yang HI-lang — `mengurus` = lo/giải quyết thủ tục; `KTP` đọc 'ka-te-pe'.",
          "Mẹo affix: gốc `urus` (lo liệu) + meN- → `mengurus` = làm thủ tục cho việc gì.",
          "Lỗi người Việt: nói `saya urus KTP` trơ. Văn cảnh hành chính cần affix: `mengurus`.",
          "Luyện: `Saya mau mengurus KTP.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU me-ngu-RUS ka-te-pe yang HI-lang — `mengurus` = to take care of (paperwork); spell `KTP` 'ka-te-pe'.",
          "Affix tip: root `urus` (to handle) + meN- → `mengurus` = to process something.",
          "VN-speaker trap: saying bare `saya urus KTP`. Admin contexts want the affix: `mengurus`.",
          "Drill: `Saya mau mengurus KTP.`",
        ],
      },
      {
        en: "Dokumen apa saja yang harus saya bawa?",
        vi: "Tôi phải mang theo những giấy tờ gì?",
        pronunciation_focus: [
          "DO-ku-men A-pa SA-ja yang HA-rus SA-ya BA-wa — `apa saja` = những gì (số nhiều); `bawa` = mang theo.",
          "Mẹo: `apa saja` mở một danh sách — đáp lại bằng nhiều món giấy tờ, không phải một.",
          "Lỗi người Việt: bỏ `saja`, hỏi `dokumen apa` (nghe như chỉ MỘT thứ). Thêm `saja` để hỏi cả danh sách.",
          "Luyện: `Dokumen apa saja yang harus saya bawa?`",
        ],
        pronunciation_focus_en: [
          "DO-ku-men A-pa SA-ja yang HA-rus SA-ya BA-wa — `apa saja` = what (all of them); `bawa` = to bring.",
          "Tip: `apa saja` opens a list — answer with several documents, not one.",
          "VN-speaker trap: dropping `saja` and asking `dokumen apa` (sounds like just ONE). Add `saja` for the full list.",
          "Drill: `Dokumen apa saja yang harus saya bawa?`",
        ],
      },
      {
        en: "Tolong bawa KK asli dan fotokopinya.",
        vi: "Làm ơn mang theo sổ hộ khẩu (KK) bản gốc và bản photo.",
        pronunciation_focus: [
          "TO-long BA-wa ka-ka AS-li dan fo-to-KO-pi-nya — `KK` (Kartu Keluarga) = sổ hộ khẩu; `asli` = bản gốc.",
          "Mẹo: `asli` (gốc/thật) ↔ `fotokopi` (bản sao). Cán bộ thường xin cả hai: `asli dan fotokopi`.",
          "Lỗi người Việt: đọc `KK` thành 'k-k' tiếng Anh. Đọc theo chữ cái Indonesia: 'ka-ka'.",
          "Luyện: `Bawa KK asli dan fotokopinya.`",
        ],
        pronunciation_focus_en: [
          "TO-long BA-wa ka-ka AS-li dan fo-to-KO-pi-nya — `KK` (Kartu Keluarga) = family/household card; `asli` = original.",
          "Tip: `asli` (original/genuine) ↔ `fotokopi` (photocopy). Officials usually want both: `asli dan fotokopi`.",
          "VN-speaker trap: spelling `KK` the English way. Use Indonesian letters: 'ka-ka'.",
          "Drill: `Bawa KK asli dan fotokopinya.`",
        ],
      },
      {
        en: "Saya butuh surat keterangan domisili dari kelurahan.",
        vi: "Tôi cần giấy xác nhận nơi cư trú từ phường (kelurahan).",
        pronunciation_focus: [
          "SA-ya BU-tuh SU-rat ke-te-RANG-an do-mi-SI-li da-ri ke-lu-RA-han — `surat keterangan` = giấy xác nhận.",
          "Mẹo: `surat keterangan ___` là khung giấy xác nhận: `domisili` (cư trú), `usaha` (kinh doanh), `tidak mampu` (khó khăn).",
          "Lỗi người Việt: đọc `ng` trong `keterangan` rời. `ng` là một âm mũi, ngậm liền.",
          "Luyện: `surat keterangan domisili`",
        ],
        pronunciation_focus_en: [
          "SA-ya BU-tuh SU-rat ke-te-RANG-an do-mi-SI-li da-ri ke-lu-RA-han — `surat keterangan` = letter of confirmation.",
          "Tip: `surat keterangan ___` is a frame: `domisili` (residence), `usaha` (business), `tidak mampu` (low-income).",
          "VN-speaker trap: splitting the `ng` in `keterangan`. It's one nasal sound, held smoothly.",
          "Drill: `surat keterangan domisili`",
        ],
      },
      // ── Queue / counter logistics ─────────────────────────────────────────
      {
        en: "Permisi, loket pembuatan KTP yang mana?",
        vi: "Xin lỗi, quầy làm căn cước (KTP) là quầy nào ạ?",
        pronunciation_focus: [
          "per-MI-si, LO-ket pem-bu-A-tan ka-te-pe yang MA-na — `loket` = quầy/cửa giao dịch; `yang mana` = cái nào.",
          "Mẹo: `permisi` = xin phép/xin lỗi để bắt chuyện hay đi qua — câu mở miệng lịch sự khắp nơi.",
          "Lỗi người Việt: hỏi `loket mana` cộc. Lịch sự hơn: `loket ... yang mana?`.",
          "Luyện: `Permisi, loket KTP yang mana?`",
        ],
        pronunciation_focus_en: [
          "per-MI-si, LO-ket pem-bu-A-tan ka-te-pe yang MA-na — `loket` = counter/window; `yang mana` = which one.",
          "Tip: `permisi` = excuse me (to get attention or pass) — the universal polite opener.",
          "VN-speaker trap: blunt `loket mana`. Softer: `loket ... yang mana?`.",
          "Drill: `Permisi, loket KTP yang mana?`",
        ],
      },
      {
        en: "Saya harus ambil nomor antrian dulu, ya?",
        vi: "Tôi phải lấy số thứ tự trước, đúng không ạ?",
        pronunciation_focus: [
          "SA-ya HA-rus AM-bil NO-mor an-TRI-an DU-lu, ya — `nomor antrian` = số thứ tự; `dulu` = trước đã.",
          "Mẹo: `dulu` ở cuối câu = 'trước đã' (làm việc này trước). Rất hay gặp ở văn phòng công.",
          "Lỗi người Việt: bỏ `dulu`, mất sắc thái 'làm cái này TRƯỚC'. Giữ `dulu` cuối câu.",
          "Luyện: `Ambil nomor antrian dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-rus AM-bil NO-mor an-TRI-an DU-lu, ya — `nomor antrian` = queue number; `dulu` = first.",
          "Tip: sentence-final `dulu` = 'first / before anything else'. Very common at public offices.",
          "VN-speaker trap: dropping `dulu` and losing the 'do this FIRST' nuance. Keep `dulu` at the end.",
          "Drill: `Ambil nomor antrian dulu.`",
        ],
      },
      // ── Library ───────────────────────────────────────────────────────────
      {
        en: "Saya mau pinjam buku ini. Bagaimana caranya?",
        vi: "Tôi muốn mượn cuốn sách này. Làm thế nào ạ?",
        pronunciation_focus: [
          "SA-ya MAU PIN-jam BU-ku I-ni. ba-gai-MA-na CA-ra-nya — `pinjam` = mượn; `caranya` = cách (làm).",
          "Mẹo: `c` trong `caranya` đọc 'ch' → 'CHA-ra-nya'. `c` Indonesia LUÔN là 'ch'.",
          "Lỗi người Việt: lẫn `pinjam` (mượn) với `meminjamkan` (cho mượn). Bạn mượn → `pinjam`/`meminjam`.",
          "Luyện: `Saya mau pinjam buku ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU PIN-jam BU-ku I-ni. ba-gai-MA-na CA-ra-nya — `pinjam` = to borrow; `caranya` = the way/how.",
          "Tip: `c` in `caranya` is 'ch' → 'CHA-ra-nya'. Indonesian `c` is ALWAYS 'ch'.",
          "VN-speaker trap: confusing `pinjam` (borrow) with `meminjamkan` (lend). You borrow → `pinjam`/`meminjam`.",
          "Drill: `Saya mau pinjam buku ini.`",
        ],
      },
      {
        en: "Buku ini harus dikembalikan paling lambat kapan?",
        vi: "Cuốn sách này phải trả chậm nhất là khi nào?",
        pronunciation_focus: [
          "BU-ku I-ni HA-rus di-kem-ba-LI-kan PA-ling LAM-bat KA-pan — `dikembalikan` = được trả lại; `paling lambat` = chậm nhất.",
          "Mẹo affix: gốc `kembali` (trở lại) → `mengembalikan` (trả lại), `dikembalikan` (bị/được trả lại, thể bị động `di-`).",
          "Lỗi người Việt: né thể bị động `di-`. Trong văn phong hành chính `di-` rất phổ biến, nên làm quen.",
          "Luyện: `Harus dikembalikan paling lambat kapan?`",
        ],
        pronunciation_focus_en: [
          "BU-ku I-ni HA-rus di-kem-ba-LI-kan PA-ling LAM-bat KA-pan — `dikembalikan` = must be returned; `paling lambat` = at the latest.",
          "Affix tip: root `kembali` (to return) → `mengembalikan` (to return sth), `dikembalikan` (be returned, passive `di-`).",
          "VN-speaker trap: avoiding the `di-` passive. In admin language `di-` is everywhere — get comfortable with it.",
          "Drill: `Harus dikembalikan paling lambat kapan?`",
        ],
      },
      // ── Closing / confirming ──────────────────────────────────────────────
      {
        en: "Jadi prosesnya berapa hari, Pak?",
        vi: "Vậy quy trình mất mấy ngày ạ?",
        pronunciation_focus: [
          "JA-di pro-SES-nya be-RA-pa HA-ri, pak — `prosesnya` = quy trình của nó; `berapa hari` = bao nhiêu ngày.",
          "Mẹo lịch sự: thêm `Pak` (với nam) / `Bu` (với nữ) cuối câu hỏi với cán bộ — bắt buộc về phép tắc.",
          "Lỗi người Việt: hỏi trống không, bỏ `Pak`/`Bu`. Ở cơ quan công, luôn kèm `Pak`/`Bu`.",
          "Luyện: `Prosesnya berapa hari, Pak?`",
        ],
        pronunciation_focus_en: [
          "JA-di pro-SES-nya be-RA-pa HA-ri, pak — `prosesnya` = the process; `berapa hari` = how many days.",
          "Politeness tip: add `Pak` (to a man) / `Bu` (to a woman) at the end when asking an official — socially required.",
          "VN-speaker trap: asking bluntly without `Pak`/`Bu`. At a public office, always attach `Pak`/`Bu`.",
          "Drill: `Prosesnya berapa hari, Pak?`",
        ],
      },
      {
        en: "Baik, terima kasih atas bantuannya, Bu.",
        vi: "Vâng, cảm ơn chị đã giúp đỡ.",
        pronunciation_focus: [
          "BA-ik, te-RI-ma KA-sih A-tas ban-TU-an-nya, bu — `atas bantuannya` = vì sự giúp đỡ.",
          "Mẹo: `terima kasih atas ___` là khung cảm ơn lịch sự: `atas bantuannya`, `atas waktunya`, `atas infonya`.",
          "Lỗi người Việt: đọc rớt `h` cuối `kasih`. Bật nhẹ `h`: 'KA-sih'.",
          "Luyện: `Terima kasih atas bantuannya, Bu.`",
        ],
        pronunciation_focus_en: [
          "BA-ik, te-RI-ma KA-sih A-tas ban-TU-an-nya, bu — `atas bantuannya` = for your help.",
          "Tip: `terima kasih atas ___` is a polite thank-you frame: `atas bantuannya`, `atas waktunya`, `atas infonya`.",
          "VN-speaker trap: dropping the final `h` in `kasih`. Lightly sound it: 'KA-sih'.",
          "Drill: `Terima kasih atas bantuannya, Bu.`",
        ],
      },
    ],
    vocabulary: [
      // Places & offices
      {
        word: "kantor pos",
        en: "post office",
        vi: "bưu điện",
        pos: "noun",
        pronunciation_vi: "KAN-tor pos — `kantor` = văn phòng/cơ quan; đọc rõ `s` cuối `pos`",
        pronunciation_en: "KAN-tor pos — `kantor` = office; sound the final `s` in `pos`",
      },
      {
        word: "kelurahan",
        en: "urban village / ward office",
        vi: "ủy ban phường",
        pos: "noun",
        pronunciation_vi: "ke-lu-RA-han — cấp hành chính dưới `kecamatan` (quận/huyện)",
        pronunciation_en: "ke-lu-RA-han — the admin level below `kecamatan` (district)",
      },
      {
        word: "kecamatan",
        en: "subdistrict office",
        vi: "ủy ban quận/huyện",
        pos: "noun",
        pronunciation_vi: "ke-ca-MA-tan — `c` đọc 'ch': 'ke-CHA-ma-tan'; trên `kelurahan`",
        pronunciation_en: "ke-ca-MA-tan — `c` is 'ch': 'ke-CHA-ma-tan'; above `kelurahan`",
      },
      {
        word: "perpustakaan",
        en: "library",
        vi: "thư viện",
        pos: "noun",
        pronunciation_vi: "per-pus-ta-KA-an — gốc `pustaka` (sách) + khung `per-...-an`",
        pronunciation_en: "per-pus-ta-KA-an — root `pustaka` (books) + `per-...-an` frame",
      },
      {
        word: "loket",
        en: "service counter / window",
        vi: "quầy giao dịch",
        pos: "noun",
        pronunciation_vi: "LO-ket — đọc rõ `t` cuối; `loket 3` = quầy số 3",
        pronunciation_en: "LO-ket — sound the final `t`; `loket 3` = counter 3",
      },
      // Documents (the acronym wall)
      {
        word: "KTP (Kartu Tanda Penduduk)",
        en: "national ID card",
        vi: "căn cước công dân",
        pos: "noun",
        pronunciation_vi: "ka-te-pe — đọc theo chữ cái Indonesia; giấy tờ tùy thân quan trọng nhất",
        pronunciation_en: "ka-te-pe — spelled in Indonesian letters; the most important ID",
      },
      {
        word: "KK (Kartu Keluarga)",
        en: "family/household card",
        vi: "sổ hộ khẩu",
        pos: "noun",
        pronunciation_vi: "ka-ka — liệt kê mọi thành viên trong hộ",
        pronunciation_en: "ka-ka — lists everyone in the household",
      },
      {
        word: "surat keterangan",
        en: "letter of confirmation / certificate",
        vi: "giấy xác nhận",
        pos: "noun",
        pronunciation_vi: "SU-rat ke-te-RANG-an — khung: `surat keterangan domisili/usaha`",
        pronunciation_en: "SU-rat ke-te-RANG-an — frame: `surat keterangan domisili/usaha`",
      },
      {
        word: "domisili",
        en: "place of residence",
        vi: "nơi cư trú",
        pos: "noun",
        pronunciation_vi: "do-mi-SI-li — `surat keterangan domisili` = giấy xác nhận cư trú",
        pronunciation_en: "do-mi-SI-li — `surat keterangan domisili` = proof of residence",
      },
      {
        word: "akta kelahiran",
        en: "birth certificate",
        vi: "giấy khai sinh",
        pos: "noun",
        pronunciation_vi: "AK-ta ke-la-HI-ran — `akta` = chứng thư; `akta nikah` = giấy đăng ký kết hôn",
        pronunciation_en: "AK-ta ke-la-HI-ran — `akta` = a deed/certificate; `akta nikah` = marriage certificate",
      },
      {
        word: "fotokopi",
        en: "photocopy",
        vi: "bản photo / bản sao",
        pos: "noun/verb",
        pronunciation_vi: "fo-to-KO-pi — `fotokopi KTP` = photo căn cước; ↔ `asli` (bản gốc)",
        pronunciation_en: "fo-to-KO-pi — `fotokopi KTP` = a copy of the ID; ↔ `asli` (original)",
      },
      {
        word: "asli",
        en: "original / genuine",
        vi: "bản gốc / thật",
        pos: "adj.",
        pronunciation_vi: "AS-li — `dokumen asli` = giấy tờ gốc; ↔ `palsu` (giả)",
        pronunciation_en: "AS-li — `dokumen asli` = the original document; ↔ `palsu` (fake)",
      },
      // Actions & process
      {
        word: "mengurus",
        en: "to handle / process (paperwork)",
        vi: "lo thủ tục / làm giấy tờ",
        pos: "verb",
        pronunciation_vi: "me-ngu-RUS — gốc `urus`; `mengurus KTP` = làm căn cước",
        pronunciation_en: "me-ngu-RUS — root `urus`; `mengurus KTP` = to process an ID",
      },
      {
        word: "nomor antrian",
        en: "queue number",
        vi: "số thứ tự",
        pos: "noun",
        pronunciation_vi: "NO-mor an-TRI-an — `ambil nomor antrian` = lấy số chờ",
        pronunciation_en: "NO-mor an-TRI-an — `ambil nomor antrian` = take a queue ticket",
      },
      {
        word: "persyaratan",
        en: "requirements",
        vi: "yêu cầu / điều kiện",
        pos: "noun",
        pronunciation_vi: "per-sya-RA-tan — gốc `syarat` (điều kiện); danh sách giấy tờ cần",
        pronunciation_en: "per-sya-RA-tan — root `syarat` (condition); the list of needed papers",
      },
      {
        word: "biaya administrasi",
        en: "administrative fee",
        vi: "phí hành chính",
        pos: "noun",
        pronunciation_vi: "BI-a-ya ad-mi-nis-TRA-si — nhiều giấy tờ cơ bản là miễn phí (`gratis`)",
        pronunciation_en: "BI-a-ya ad-mi-nis-TRA-si — many basic documents are free (`gratis`)",
      },
      {
        word: "mengembalikan",
        en: "to return (something)",
        vi: "trả lại",
        pos: "verb",
        pronunciation_vi: "me-ngem-ba-LI-kan — gốc `kembali`; bị động `dikembalikan`",
        pronunciation_en: "me-ngem-ba-LI-kan — root `kembali`; passive `dikembalikan`",
      },
      {
        word: "stempel / cap",
        en: "official stamp / seal",
        vi: "con dấu",
        pos: "noun",
        pronunciation_vi: "STEM-pel / cap — `c` đọc 'ch': 'chap'; cần dấu mới có hiệu lực",
        pronunciation_en: "STEM-pel / cap — `c` is 'ch': 'chap'; needs a stamp to be valid",
      },
      {
        word: "RT / RW",
        en: "neighborhood unit / community unit head",
        vi: "tổ trưởng dân phố / khu phố",
        pos: "noun",
        pronunciation_vi: "er-te / er-we — cấp cộng đồng nhỏ nhất; thường ký giấy giới thiệu trước",
        pronunciation_en: "er-te / er-we — the smallest community units; often sign a referral first",
      },
      {
        word: "Pak / Bu",
        en: "Sir / Ma'am (official address)",
        vi: "ông/anh / bà/chị (xưng hô lịch sự)",
        pos: "noun",
        pronunciation_vi: "pak / bu — luôn dùng với cán bộ; `Pak` cho nam, `Bu` cho nữ",
        pronunciation_en: "pak / bu — always use with officials; `Pak` for men, `Bu` for women",
      },
    ],
    dialogue: [
      // Resident at the kelurahan asking for a residence letter
      {
        speaker: "Warga",
        text: "Permisi, Bu. Saya mau mengurus surat keterangan domisili.",
        vi: "Xin lỗi chị. Tôi muốn làm giấy xác nhận nơi cư trú.",
        en: "Excuse me, ma'am. I'd like to process a residence-confirmation letter.",
      },
      {
        speaker: "Petugas",
        text: "Baik, Pak. Sudah ada surat pengantar dari RT/RW?",
        vi: "Vâng, anh. Anh đã có giấy giới thiệu từ tổ trưởng (RT/RW) chưa?",
        en: "Alright, sir. Do you already have a referral letter from the RT/RW?",
      },
      {
        speaker: "Warga",
        text: "Sudah, ini suratnya. Dokumen apa saja yang harus saya bawa lagi?",
        vi: "Có rồi, đây ạ. Tôi còn phải mang theo những giấy tờ gì nữa?",
        en: "Yes, here it is. What other documents do I need to bring?",
      },
      {
        speaker: "Petugas",
        text: "Bawa KTP dan KK, asli dan fotokopinya masing-masing satu.",
        vi: "Mang theo căn cước và sổ hộ khẩu, mỗi loại một bản gốc và một bản photo.",
        en: "Bring your KTP and KK, one original and one photocopy each.",
      },
      {
        speaker: "Warga",
        text: "Oh, fotokopinya belum ada. Di sini bisa fotokopi, Bu?",
        vi: "Ồ, bản photo thì chưa có. Ở đây photo được không chị?",
        en: "Oh, I don't have copies yet. Can I photocopy here, ma'am?",
      },
      {
        speaker: "Petugas",
        text: "Bisa, di sebelah ada. Setelah itu ambil nomor antrian di loket dua.",
        vi: "Được, ở bên cạnh có. Sau đó lấy số thứ tự ở quầy số hai.",
        en: "Yes, there's one next door. After that, take a queue number at counter two.",
      },
      {
        speaker: "Warga",
        text: "Baik. Jadi prosesnya berapa hari, Bu?",
        vi: "Vâng. Vậy quy trình mất mấy ngày ạ?",
        en: "Okay. So how many days does the process take, ma'am?",
      },
      {
        speaker: "Petugas",
        text: "Kalau lengkap, hari ini jadi. Gratis, tidak ada biaya.",
        vi: "Nếu đủ giấy thì hôm nay xong. Miễn phí, không mất tiền.",
        en: "If it's complete, it's done today. Free of charge.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn gửi gói hàng này đi Việt Nam.", answer: "Saya mau kirim paket ini ke Vietnam." },
          { prompt: "Tôi muốn làm lại căn cước bị mất.", answer: "Saya mau mengurus KTP yang hilang." },
          { prompt: "Tôi phải mang theo những giấy tờ gì?", answer: "Dokumen apa saja yang harus saya bawa?" },
          { prompt: "Xin lỗi, quầy làm KTP là quầy nào?", answer: "Permisi, loket pembuatan KTP yang mana?" },
          { prompt: "Cảm ơn chị đã giúp đỡ.", answer: "Terima kasih atas bantuannya, Bu." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Phí gửi bao nhiêu?", answer: "Berapa ongkos kirim?" },
          { prompt: "Làm ơn mang theo bản gốc và bản photo.", answer: "Tolong bawa yang asli dan fotokopinya." },
          { prompt: "Tôi phải lấy số thứ tự trước.", answer: "Saya harus ambil nomor antrian dulu." },
          { prompt: "Tôi muốn mượn cuốn sách này.", answer: "Saya mau pinjam buku ini." },
          { prompt: "Vậy quy trình mất mấy ngày ạ?", answer: "Jadi prosesnya berapa hari, Pak?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `berapa`, `apa saja`, hay `yang mana` cho đúng:",
        instruction_en:
          "Fill in `berapa`, `apa saja`, or `yang mana`:",
        items: [
          { prompt: "___ ongkos kirim ke Vietnam?", answer: "Berapa", hint: "hỏi GIÁ" },
          { prompt: "Dokumen ___ yang harus saya bawa?", answer: "apa saja", hint: "hỏi cả DANH SÁCH" },
          { prompt: "Loket pembuatan KTP ___?", answer: "yang mana", hint: "hỏi CÁI NÀO trong nhiều quầy" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn từ viết tắt đúng: `KTP` (căn cước) hay `KK` (hộ khẩu); và affix đúng của gốc `urus`:",
        instruction_en:
          "Pick the right acronym: `KTP` (ID) vs `KK` (household card); and the correct form of root `urus`:",
        items: [
          { prompt: "Giấy tờ tùy thân cá nhân là ___.", answer: "KTP", hint: "Kartu Tanda Penduduk" },
          { prompt: "Sổ liệt kê cả gia đình là ___.", answer: "KK", hint: "Kartu Keluarga" },
          { prompt: "Saya mau ___ surat ini di kelurahan.", answer: "mengurus", hint: "meN- + urus" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung yêu cầu ở cơ quan công — điền chỗ trống: `Permisi, ___. Saya mau mengurus ___. Dokumen apa saja yang harus saya bawa? ... Terima kasih atas bantuannya, ___.`",
        instruction_en:
          "Public-office request frame — fill the blanks: `Permisi, ___. Saya mau mengurus ___. Dokumen apa saja yang harus saya bawa? ... Terima kasih atas bantuannya, ___.`",
        example:
          "Permisi, Bu. Saya mau mengurus surat keterangan domisili. Dokumen apa saja yang harus saya bawa? Terima kasih atas bantuannya, Bu.",
        example_vi:
          "Xin lỗi chị. Tôi muốn làm giấy xác nhận cư trú. Tôi phải mang theo những giấy tờ gì? Cảm ơn chị đã giúp đỡ.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn xử lý được việc giấy tờ này chưa?",
        instruction_en: "Self-check — can you handle each paperwork task?",
        items: [
          { vi: "Tôi có thể nói muốn làm thủ tục gì (`mengurus ...`).", en: "I can say which document I want to process (`mengurus ...`)." },
          { vi: "Tôi có thể hỏi cần mang theo giấy tờ gì.", en: "I can ask which documents to bring." },
          { vi: "Tôi phân biệt được `KTP` và `KK`.", en: "I can tell `KTP` from `KK`." },
          { vi: "Tôi phân biệt được `asli` (gốc) và `fotokopi` (sao).", en: "I can tell `asli` (original) from `fotokopi` (copy)." },
          { vi: "Tôi biết lấy `nomor antrian` và hỏi `loket yang mana`.", en: "I know to take a `nomor antrian` and ask `loket yang mana`." },
          { vi: "Tôi luôn xưng hô `Pak`/`Bu` với cán bộ.", en: "I always address officials with `Pak`/`Bu`." },
        ],
      },
    ],
    cultural_notes_vi:
      "Hệ thống hành chính Indonesia đi từ nhỏ đến lớn: `RT` (tổ dân phố) → `RW` (khu phố) → `kelurahan`/`desa` (phường/xã) → `kecamatan` (quận/huyện) → `kabupaten`/`kota` (tỉnh/thành). Nhiều thủ tục (làm KTP, giấy xác nhận) yêu cầu trước hết một `surat pengantar` (giấy giới thiệu) có chữ ký và con dấu (`stempel`) của ông tổ trưởng RT/RW. Hai giấy tờ xương sống là `KTP` (căn cước cá nhân) và `KK` (sổ hộ khẩu của cả gia đình) — gần như việc gì cũng hỏi tới. Mẹo thực tế: luôn mang sẵn `fotokopi` của KTP và KK, vì cơ quan nào cũng xin. Nhiều giấy cơ bản là `gratis` (miễn phí); cảnh giác nếu bị đòi 'phí' không rõ ràng.",
    cultural_notes_en:
      "Indonesia's admin ladder runs small-to-large: `RT` (neighborhood unit) → `RW` (community unit) → `kelurahan`/`desa` (urban village/village) → `kecamatan` (subdistrict) → `kabupaten`/`kota` (regency/city). Many procedures (a new KTP, a confirmation letter) first require a `surat pengantar` (referral letter) signed and stamped (`stempel`) by your RT/RW head. The two backbone documents are `KTP` (your personal ID) and `KK` (the whole family's household card) — nearly everything asks for them. Practical tip: always carry `fotokopi` of your KTP and KK, since every office wants copies. Many basic documents are `gratis` (free); be wary of vague 'fees'.",
    tip_advice_vi:
      "Khung mở miệng vạn năng ở cơ quan công: `Permisi, [Pak/Bu]. Saya mau mengurus ___.` Học thuộc hệ affix quanh gốc `urus`: `urus` → `mengurus` (lo thủ tục) → `pengurusan` (việc xử lý) → `diurus` (được xử lý). Và làm quen thể bị động `di-` (rất nhiều trong văn bản: `dikembalikan` = phải trả lại, `dilengkapi` = được bổ sung đầy đủ) — đừng né nó. Cuối cùng, hai phép lịch sự không bao giờ thiếu: gọi `Pak`/`Bu`, và đóng câu bằng `terima kasih atas bantuannya`.",
    tip_advice_en:
      "A universal opener at any public office: `Permisi, [Pak/Bu]. Saya mau mengurus ___.` Memorize the affix family around `urus`: `urus` → `mengurus` (to process) → `pengurusan` (the handling) → `diurus` (be processed). Get comfortable with the `di-` passive (all over admin text: `dikembalikan` = must be returned, `dilengkapi` = be completed) — don't dodge it. Finally, two non-negotiable courtesies: address people as `Pak`/`Bu`, and close with `terima kasih atas bantuannya`.",
  },
];

export default lessons;
