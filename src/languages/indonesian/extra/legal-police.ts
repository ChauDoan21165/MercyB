// Legal & Police Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (job-interview.ts, banking-money.ts,
// etc.), which in turn mirror the French `FrenchLesson` shape. When the shared
// Indonesian registry (src/languages/indonesian/lessons.ts) lands, swap the local
// types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Indonesian is written in Latin script and is largely phonetic. For Vietnamese
// speakers the big WINS are: no grammatical gender, no verb conjugation, no tones,
// no articles. The legal/police-specific traps are: the meN-/-an + di- affix pairs
// (`melapor` to report vs. `laporan` a report; `menilang` to ticket vs. `ditilang`
// to be ticketed; `menahan` to detain vs. `ditahan` to be detained), the formal
// register (`Pak`/`Bu`/`Bapak`/`Ibu` for officers, `saya`/`Anda` — never `lu`/`gue`),
// and the abbreviation soup of Indonesian officialdom (`SIM`, `STNK`, `KTP`, `BAP`,
// `LP`, `Polsek`, `Polres`). Knowing your RIGHTS (`hak`) keeps a routine stop calm.

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_legal_police",
    level: "B1",
    category: "legal",
    title_vi: "Tiếng Indonesia với cảnh sát & pháp luật",
    title_en: "Legal & police Indonesian",
    sentences: [
      // ── Reporting a crime / loss ────────────────────────────────────────
      {
        en: "Saya ingin membuat laporan kehilangan.",
        vi: "Tôi muốn làm đơn trình báo mất đồ.",
        pronunciation_focus: [
          "SA-ya ING-in mem-BU-at la-PO-ran ke-hi-LANG-an — `membuat laporan` = làm đơn trình báo; `kehilangan` = sự mất (ke-…-an từ `hilang`).",
          "Lợi thế người Việt: cấu trúc `muốn + động từ` y như tiếng Việt — `ingin membuat`, không cần chia thì.",
          "Lỗi người Việt: dùng danh từ `laporan` làm động từ. Hành động 'trình báo' là `melapor`/`melaporkan` (có meN-).",
          "Luyện: `Saya ingin membuat laporan kehilangan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ING-in mem-BOO-at la-PO-ran ke-hi-LANG-an — `membuat laporan` = to file a report; `kehilangan` = a loss (ke-…-an from `hilang`).",
          "VN-speaker win: `want + verb` maps 1:1 to Vietnamese — `ingin membuat`, no tense to conjugate.",
          "VN-speaker trap: using the noun `laporan` as a verb. The action 'to report' is `melapor`/`melaporkan` (with meN-).",
          "Drill: `Saya ingin membuat laporan kehilangan.`",
        ],
      },
      {
        en: "Dompet saya dicuri di pasar tadi pagi.",
        vi: "Ví của tôi bị trộm ở chợ sáng nay.",
        pronunciation_focus: [
          "DOM-pet SA-ya di-CU-ri di PA-sar TA-di PA-gi — `dicuri` = bị trộm (bị động `di-` từ `curi`); `tadi pagi` = sáng nay (vừa xảy ra).",
          "Lỗi người Việt: quên `di-` cho thể bị động. `Mencuri` = đi ăn trộm (chủ động); `dicuri` = bị trộm.",
          "Mẹo: `c` đọc 'ch' → 'di-CHU-ri'.",
          "Luyện: `Dompet saya dicuri.`",
        ],
        pronunciation_focus_en: [
          "DOM-pet SA-ya di-CHU-ri di PA-sar TA-di PA-gi — `dicuri` = was stolen (passive `di-` from `curi`); `tadi pagi` = this morning (just happened).",
          "VN-speaker trap: dropping the `di-` for the passive. `Mencuri` = to steal (active); `dicuri` = to be stolen.",
          "Tip: `c` is 'ch' → 'di-CHU-ri'.",
          "Drill: `Dompet saya dicuri.`",
        ],
      },
      {
        en: "Tolong, ada pencurian! Saya butuh bantuan polisi.",
        vi: "Làm ơn, có vụ trộm! Tôi cần cảnh sát giúp.",
        pronunciation_focus: [
          "TO-long, A-da pen-CU-ri-an! SA-ya BU-tuh ban-TU-an po-LI-si — `tolong` = làm ơn/cứu; `pencurian` = vụ trộm cắp (peN-…-an); `butuh` = cần.",
          "Lỗi người Việt: lẫn `tolong` (làm ơn/cứu) với `maaf` (xin lỗi). Khi cần giúp gấp, hô `Tolong!`.",
          "Luyện: `Tolong, saya butuh bantuan polisi.`",
        ],
        pronunciation_focus_en: [
          "TO-long, A-da pen-CHU-ri-an! SA-ya BOO-tooh ban-TU-an po-LEE-si — `tolong` = please/help; `pencurian` = a theft (peN-…-an); `butuh` = to need.",
          "VN-speaker trap: confusing `tolong` (please/help) with `maaf` (sorry). For urgent help, shout `Tolong!`.",
          "Drill: `Tolong, saya butuh bantuan polisi.`",
        ],
      },
      // ── Traffic stop / ticket ───────────────────────────────────────────
      {
        en: "Selamat siang, Pak. Ada apa, ya?",
        vi: "Chào buổi trưa, anh (cảnh sát). Có chuyện gì vậy ạ?",
        pronunciation_focus: [
          "se-la-MAT SI-ang, Pak. A-da A-pa, ya? — `Pak` = cách gọi cảnh sát nam một cách lịch sự (rút gọn của `Bapak`); `ada apa` = có chuyện gì.",
          "Lỗi người Việt: gọi cảnh sát trống không. Luôn thêm `Pak` (nam) / `Bu` (nữ) cho lịch sự và hạ nhiệt.",
          "Luyện: `Selamat siang, Pak. Ada apa, ya?`",
        ],
        pronunciation_focus_en: [
          "se-la-MAT SI-ang, Pak. A-da A-pa, ya? — `Pak` = the polite way to address a male officer (short for `Bapak`); `ada apa` = what's the matter.",
          "VN-speaker trap: addressing an officer with no title. Always add `Pak` (m) / `Bu` (f) to stay polite and de-escalate.",
          "Drill: `Selamat siang, Pak. Ada apa, ya?`",
        ],
      },
      {
        en: "Ini SIM dan STNK saya, Pak.",
        vi: "Đây là bằng lái và giấy đăng ký xe của tôi, thưa anh.",
        pronunciation_focus: [
          "I-ni SIM dan es-te-en-KA SA-ya, Pak — `SIM` (đọc 'sim') = bằng lái; `STNK` (đánh vần 'es-te-en-ka') = giấy đăng ký xe.",
          "Lỗi người Việt: đọc liền `STNK`. Người Indonesia đánh vần từng chữ: es-te-en-ka.",
          "Mẹo: luôn mang đủ `SIM` + `STNK`; thiếu một là lý do bị phạt (`tilang`).",
          "Luyện: `Ini SIM dan STNK saya.`",
        ],
        pronunciation_focus_en: [
          "I-ni SIM dan es-te-en-KA SA-ya, Pak — `SIM` (say 'sim') = driver's licence; `STNK` (spell 'es-te-en-ka') = vehicle registration.",
          "VN-speaker trap: reading `STNK` as one word. Indonesians spell each letter: es-te-en-ka.",
          "Tip: always carry both `SIM` + `STNK`; missing either is grounds for a ticket (`tilang`).",
          "Drill: `Ini SIM dan STNK saya.`",
        ],
      },
      {
        en: "Saya kena tilang karena apa, Pak?",
        vi: "Tôi bị phạt vì lỗi gì vậy anh?",
        pronunciation_focus: [
          "SA-ya KE-na TI-lang ka-RE-na A-pa, Pak? — `kena tilang` = bị phạt giao thông; `karena apa` = vì lý do gì.",
          "Lỗi người Việt: nói `saya tilang`. Bị phạt là `kena tilang` hoặc bị động `ditilang`; `menilang` là việc cảnh sát làm.",
          "Luyện: `Saya kena tilang karena apa?`",
        ],
        pronunciation_focus_en: [
          "SA-ya KE-na TI-lang ka-RE-na A-pa, Pak? — `kena tilang` = to get a traffic ticket; `karena apa` = for what reason.",
          "VN-speaker trap: saying `saya tilang`. To be fined is `kena tilang` or the passive `ditilang`; `menilang` is what the officer does.",
          "Drill: `Saya kena tilang karena apa?`",
        ],
      },
      {
        en: "Saya minta surat tilang yang resmi, ya, Pak.",
        vi: "Tôi xin biên bản phạt chính thức nhé, thưa anh.",
        pronunciation_focus: [
          "SA-ya MIN-ta SU-rat TI-lang yang re-SMI, ya, Pak — `surat tilang` = biên bản phạt; `resmi` = chính thức; yêu cầu giấy tờ giúp tránh đưa tiền tay.",
          "Lỗi người Việt: ngại đòi giấy. Lịch sự xin `surat tilang resmi` là QUYỀN của bạn và là cách tránh chung chi.",
          "Luyện: `Saya minta surat tilang yang resmi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MIN-ta SU-rat TI-lang yang re-SMI, ya, Pak — `surat tilang` = the official ticket; `resmi` = official; asking for paperwork avoids cash-in-hand.",
          "VN-speaker trap: being shy to ask for paperwork. Politely requesting the `surat tilang resmi` is your RIGHT and the way to avoid a bribe.",
          "Drill: `Saya minta surat tilang yang resmi.`",
        ],
      },
      // ── Rights / detention ──────────────────────────────────────────────
      {
        en: "Apa saya ditahan? Atas dasar apa, Pak?",
        vi: "Tôi có bị tạm giữ không? Trên cơ sở nào, thưa anh?",
        pronunciation_focus: [
          "A-pa SA-ya di-TA-han? A-tas DA-sar A-pa, Pak? — `ditahan` = bị tạm giữ/giam (bị động `di-` từ `tahan`); `atas dasar apa` = trên cơ sở nào.",
          "Lỗi người Việt: lẫn `menahan` (giữ ai đó) với `ditahan` (bị giữ). Hỏi về mình thì dùng `ditahan`.",
          "Luyện: `Apa saya ditahan? Atas dasar apa?`",
        ],
        pronunciation_focus_en: [
          "A-pa SA-ya di-TA-han? A-tas DA-sar A-pa, Pak? — `ditahan` = to be detained (passive `di-` from `tahan`); `atas dasar apa` = on what basis.",
          "VN-speaker trap: confusing `menahan` (to detain someone) with `ditahan` (to be detained). Asking about yourself, use `ditahan`.",
          "Drill: `Apa saya ditahan? Atas dasar apa?`",
        ],
      },
      {
        en: "Saya ingin menghubungi kedutaan dan pengacara saya.",
        vi: "Tôi muốn liên hệ đại sứ quán và luật sư của tôi.",
        pronunciation_focus: [
          "SA-ya ING-in meng-hu-BUNG-i ke-du-TA-an dan pe-nga-CA-ra SA-ya — `menghubungi` = liên hệ (meN- + `hubung` + -i); `kedutaan` = đại sứ quán; `pengacara` = luật sư.",
          "Lợi thế người Việt: `ingin + menghubungi` đúng kiểu `muốn + liên hệ`; chỉ cần nhớ đuôi `-i` chỉ đối tượng được liên hệ.",
          "Luyện: `Saya ingin menghubungi pengacara saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ING-in meng-hu-BUNG-i ke-du-TA-an dan pe-nga-CHA-ra SA-ya — `menghubungi` = to contact (meN- + `hubung` + -i); `kedutaan` = embassy; `pengacara` = lawyer.",
          "VN-speaker win: `ingin + menghubungi` is exactly `want + contact`; just remember the `-i` suffix marks the person being contacted.",
          "Drill: `Saya ingin menghubungi pengacara saya.`",
        ],
      },
      {
        en: "Maaf, bahasa Indonesia saya terbatas. Bisa pelan-pelan, Pak?",
        vi: "Xin lỗi, tiếng Indonesia của tôi còn hạn chế. Anh nói chậm được không ạ?",
        pronunciation_focus: [
          "ma-AF, ba-HA-sa in-do-NE-sia SA-ya ter-BA-tas. BI-sa pe-lan-PE-lan, Pak? — `terbatas` = hạn chế (ter- từ `batas`); `pelan-pelan` = từ từ/chậm (láy đôi).",
          "Lỗi người Việt: nói `bisa pelan` một lần. Người Indonesia láy đôi: `pelan-pelan` = chậm rãi.",
          "Mẹo hữu ích: câu này hợp pháp và lịch sự, giúp bạn có thời gian và sự cảm thông.",
          "Luyện: `Bisa pelan-pelan, Pak?`",
        ],
        pronunciation_focus_en: [
          "ma-AF, ba-HA-sa in-do-NE-sia SA-ya ter-BA-tas. BI-sa pe-lan-PE-lan, Pak? — `terbatas` = limited (ter- from `batas`); `pelan-pelan` = slowly (reduplicated).",
          "VN-speaker trap: saying `bisa pelan` once. Indonesians reduplicate: `pelan-pelan` = slowly/gently.",
          "Handy: this line is lawful and polite, and buys you time and goodwill.",
          "Drill: `Bisa pelan-pelan, Pak?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, cảnh sát (`polisi`) thuộc lực lượng quốc gia POLRI. Đồn theo cấp: `Polsek` (cấp phường/huyện), `Polres` (cấp quận/thành phố), `Polda` (cấp tỉnh). Khi cần trình báo, bạn đến `kantor polisi` và xin làm `Laporan Polisi` (viết tắt `LP`); bản ghi lời khai gọi là `BAP` (Berita Acara Pemeriksaan). LUÔN giữ thái độ bình tĩnh, lễ phép, gọi `Pak`/`Bu`. Văn hóa Indonesia coi trọng `sopan santun` (phép lịch sự) và việc giữ thể diện cho cả hai bên — to tiếng hay tỏ ra hung hăng làm mọi việc xấu đi nhanh.\n\nVỀ GIAO THÔNG: bị dừng xe là chuyện thường với người đi `motor`. Bạn phải mang `SIM` (bằng lái) và `STNK` (đăng ký xe). Vi phạm dẫn tới `tilang` (phạt). QUAN TRỌNG: hãy yêu cầu `surat tilang resmi` (biên bản chính thức) và nộp phạt qua kênh hợp pháp (chuyển khoản BRI hoặc tòa) — ĐỪNG đưa tiền mặt tận tay (`uang damai`/`pungli` = chung chi), vừa phạm luật vừa khuyến khích tiêu cực. Nói nhẹ nhàng: `Saya ikut prosedur resmi saja, Pak` (Tôi xin theo đúng thủ tục thôi ạ).\n\nQUYỀN của bạn: bạn có quyền biết lý do bị dừng/giữ (`atas dasar apa`), quyền giữ im lặng phần nào, quyền liên hệ `pengacara` (luật sư) và — nếu là người nước ngoài — `kedutaan` (đại sứ quán). Câu `bahasa Indonesia saya terbatas` là hợp pháp và hữu ích.",
    cultural_notes_en:
      "In Indonesia the police (`polisi`) are the national force POLRI. Stations are tiered: `Polsek` (sub-district), `Polres` (city/regency), `Polda` (province). To report something you go to a `kantor polisi` and file a `Laporan Polisi` (abbreviated `LP`); the recorded statement is the `BAP` (Berita Acara Pemeriksaan). ALWAYS stay calm and polite and use `Pak`/`Bu`. Indonesian culture prizes `sopan santun` (courtesy) and keeping face for both sides — raising your voice or acting aggressive makes things worse fast.\n\nON TRAFFIC: getting stopped is routine for `motor` riders. You must carry your `SIM` (licence) and `STNK` (registration). A violation leads to a `tilang` (ticket). IMPORTANT: ask for the `surat tilang resmi` (official ticket) and pay through legal channels (BRI bank transfer or the court) — DON'T hand over cash directly (`uang damai`/`pungli` = a bribe), which is both illegal and feeds corruption. Say gently: `Saya ikut prosedur resmi saja, Pak` (I'll just follow the official procedure, sir).\n\nYOUR RIGHTS: you may ask why you were stopped/held (`atas dasar apa`), you have a degree of right to silence, and the right to contact a `pengacara` (lawyer) and — if a foreigner — your `kedutaan` (embassy). The line `bahasa Indonesia saya terbatas` (my Indonesian is limited) is lawful and useful.",
    tip_advice_vi:
      "Học 'bộ khung an toàn' bốn câu khi gặp cảnh sát: (1) chào lễ phép — `Selamat siang, Pak. Ada apa, ya?`; (2) đưa giấy tờ — `Ini SIM dan STNK saya.`; (3) hỏi lý do — `Saya kena tilang karena apa, Pak?`; (4) chốt theo thủ tục — `Saya minta surat tilang yang resmi.` / `Saya ikut prosedur resmi saja.`. Nhớ ba cặp phụ tố hay nhầm: `melapor`/`melaporkan` (động từ, trình báo) ≠ `laporan` (danh từ, đơn); `menilang` (cảnh sát phạt) vs `ditilang`/`kena tilang` (bạn bị phạt); `menahan` (giữ ai) vs `ditahan` (bị giữ). Đánh vần các viết tắt từng chữ: `SIM` đọc liền 'sim', nhưng `STNK` = es-te-en-ka, `KTP` = ka-te-pe, `BAP` đọc 'bap'. Giữ giọng phẳng, không thanh điệu; `c` đọc 'ch', `j` đọc 'j' (như 'jam').",
    tip_advice_en:
      "Learn the four-line safety frame for a police encounter: (1) greet politely — `Selamat siang, Pak. Ada apa, ya?`; (2) hand over documents — `Ini SIM dan STNK saya.`; (3) ask the reason — `Saya kena tilang karena apa, Pak?`; (4) insist on procedure — `Saya minta surat tilang yang resmi.` / `Saya ikut prosedur resmi saja.`. Keep three affix pairs straight: `melapor`/`melaporkan` (verb, to report) ≠ `laporan` (noun, a report); `menilang` (the officer fines) vs `ditilang`/`kena tilang` (you get fined); `menahan` (to detain someone) vs `ditahan` (to be detained). Spell abbreviations letter by letter: `SIM` reads as 'sim', but `STNK` = es-te-en-ka, `KTP` = ka-te-pe, `BAP` = 'bap'. Keep your pitch flat (no tones); `c` is 'ch', `j` is the English 'j' as in 'jam'.",
    vocabulary: [
      // People & places
      {
        word: "polisi",
        en: "police / police officer",
        vi: "cảnh sát",
        pos: "noun",
        pronunciation_vi: "po-LI-si — cũng dùng cho cá nhân cảnh sát; gọi lịch sự là `Pak Polisi`",
        pronunciation_en: "po-LEE-si — also used for an individual officer; politely `Pak Polisi`",
      },
      {
        word: "kantor polisi",
        en: "police station",
        vi: "đồn cảnh sát",
        pos: "noun",
        pronunciation_vi: "KAN-tor po-LI-si — cấp: `Polsek` < `Polres` < `Polda`",
        pronunciation_en: "KAN-tor po-LEE-si — tiers: `Polsek` < `Polres` < `Polda`",
      },
      {
        word: "pengacara",
        en: "lawyer / attorney",
        vi: "luật sư",
        pos: "noun",
        pronunciation_vi: "pe-nga-CA-ra — peN- + `acara`; cũng gọi `advokat`",
        pronunciation_en: "pe-nga-CHA-ra — peN- + `acara`; also `advokat`",
      },
      {
        word: "saksi",
        en: "witness",
        vi: "nhân chứng",
        pos: "noun",
        pronunciation_vi: "SAK-si — `saksi mata` = nhân chứng tận mắt",
        pronunciation_en: "SAK-si — `saksi mata` = eyewitness",
      },
      // Reports & documents
      {
        word: "laporan",
        en: "report (the document/act as a noun)",
        vi: "đơn trình báo / báo cáo",
        pos: "noun",
        pronunciation_vi: "la-PO-ran — danh từ (-an); `Laporan Polisi` viết tắt `LP`",
        pronunciation_en: "la-PO-ran — the noun (-an); `Laporan Polisi` abbreviated `LP`",
      },
      {
        word: "melaporkan",
        en: "to report (something)",
        vi: "trình báo (việc gì)",
        pos: "verb",
        pronunciation_vi: "me-la-POR-kan — động từ (meN- + `lapor` + -kan); đừng dùng `laporan` thay nó",
        pronunciation_en: "me-la-POR-kan — the verb (meN- + `lapor` + -kan); don't swap in `laporan`",
      },
      {
        word: "SIM",
        en: "driver's licence",
        vi: "bằng lái xe",
        pos: "noun",
        pronunciation_vi: "đọc liền 'sim' — Surat Izin Mengemudi; `SIM A` ô tô, `SIM C` xe máy",
        pronunciation_en: "read as 'sim' — Surat Izin Mengemudi; `SIM A` car, `SIM C` motorbike",
      },
      {
        word: "STNK",
        en: "vehicle registration certificate",
        vi: "giấy đăng ký xe",
        pos: "noun",
        pronunciation_vi: "es-te-en-KA — đánh vần từng chữ; bắt buộc mang theo khi lái",
        pronunciation_en: "es-te-en-KA — spell each letter; mandatory to carry while driving",
      },
      {
        word: "KTP",
        en: "national ID card",
        vi: "căn cước công dân",
        pos: "noun",
        pronunciation_vi: "ka-te-PE — Kartu Tanda Penduduk; người nước ngoài dùng `KITAS`/hộ chiếu",
        pronunciation_en: "ka-te-PE — Kartu Tanda Penduduk; foreigners use `KITAS`/passport",
      },
      // The offence / penalty
      {
        word: "tilang",
        en: "traffic ticket / fine",
        vi: "phạt giao thông",
        pos: "noun",
        pronunciation_vi: "TI-lang — `kena tilang`/`ditilang` = bị phạt; `surat tilang` = biên bản",
        pronunciation_en: "TI-lang — `kena tilang`/`ditilang` = to get fined; `surat tilang` = the ticket",
      },
      {
        word: "denda",
        en: "fine / penalty (the money)",
        vi: "tiền phạt",
        pos: "noun",
        pronunciation_vi: "DEN-da — số tiền; nộp qua bank/`pengadilan` (tòa), không tận tay",
        pronunciation_en: "DEN-da — the amount; pay via bank/`pengadilan` (court), not by hand",
      },
      {
        word: "pelanggaran",
        en: "violation / offence",
        vi: "vi phạm",
        pos: "noun",
        pronunciation_vi: "pe-lang-GA-ran — peN-…-an từ `langgar`; `melanggar` = vi phạm (động từ)",
        pronunciation_en: "pe-lang-GA-ran — peN-…-an from `langgar`; `melanggar` = to violate (verb)",
      },
      {
        word: "pencurian",
        en: "theft",
        vi: "vụ trộm cắp",
        pos: "noun",
        pronunciation_vi: "pen-CU-ri-an — peN-…-an từ `curi`; `dicuri` = bị trộm; `pencuri` = kẻ trộm",
        pronunciation_en: "pen-CHU-ri-an — peN-…-an from `curi`; `dicuri` = stolen; `pencuri` = thief",
      },
      {
        word: "ditahan",
        en: "to be detained / held",
        vi: "bị tạm giữ / tạm giam",
        pos: "verb (passive)",
        pronunciation_vi: "di-TA-han — bị động `di-` từ `tahan`; `penahanan` = việc tạm giữ",
        pronunciation_en: "di-TA-han — passive `di-` from `tahan`; `penahanan` = the detention",
      },
      // Rights & procedure
      {
        word: "hak",
        en: "right (legal)",
        vi: "quyền",
        pos: "noun",
        pronunciation_vi: "hak — `hak saya` = quyền của tôi; `hak asasi` = nhân quyền",
        pronunciation_en: "hak — `hak saya` = my right; `hak asasi` = human rights",
      },
      {
        word: "prosedur resmi",
        en: "official procedure",
        vi: "thủ tục chính thức",
        pos: "noun",
        pronunciation_vi: "pro-se-DUR re-SMI — `ikut prosedur resmi` = làm theo đúng thủ tục (tránh chung chi)",
        pronunciation_en: "pro-se-DUR re-SMI — `ikut prosedur resmi` = follow the official procedure (avoids bribes)",
      },
      {
        word: "pungli",
        en: "illegal levy / petty bribe",
        vi: "tiêu cực / vòi tiền (bất hợp pháp)",
        pos: "noun",
        pronunciation_vi: "PUNG-li — viết tắt `pungutan liar`; KHÔNG đưa, hãy theo `prosedur resmi`",
        pronunciation_en: "PUNG-li — short for `pungutan liar`; never pay it — follow `prosedur resmi`",
      },
      {
        word: "kedutaan",
        en: "embassy",
        vi: "đại sứ quán",
        pos: "noun",
        pronunciation_vi: "ke-du-TA-an — ke-…-an từ `duta`; `Kedutaan Besar Vietnam` = ĐSQ Việt Nam",
        pronunciation_en: "ke-du-TA-an — ke-…-an from `duta`; `Kedutaan Besar Vietnam` = Vietnamese Embassy",
      },
    ],
    dialogue: [
      // Dialogue A: filing a theft report at the station
      {
        speaker: "Petugas",
        text: "Selamat siang. Ada yang bisa saya bantu?",
        vi: "Chào buổi trưa. Tôi có thể giúp gì ạ?",
        en: "Good afternoon. How can I help you?",
      },
      {
        speaker: "Pelapor",
        text: "Selamat siang, Pak. Saya ingin membuat laporan kehilangan. Dompet saya dicuri di pasar tadi pagi.",
        vi: "Chào buổi trưa, thưa anh. Tôi muốn làm đơn trình báo mất đồ. Ví của tôi bị trộm ở chợ sáng nay.",
        en: "Good afternoon, sir. I'd like to file a loss report. My wallet was stolen at the market this morning.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Ada saksi? Apa saja yang hilang di dalam dompet?",
        vi: "Được. Có nhân chứng không? Trong ví mất những gì?",
        en: "All right. Any witnesses? What was in the wallet?",
      },
      {
        speaker: "Pelapor",
        text: "Tidak ada saksi. Ada KTP, uang, dan kartu ATM. Saya butuh surat laporan resmi untuk bank.",
        vi: "Không có nhân chứng. Có CCCD, tiền và thẻ ATM. Tôi cần giấy trình báo chính thức để gửi ngân hàng.",
        en: "No witnesses. There were my ID, cash, and an ATM card. I need an official report letter for the bank.",
      },
      {
        speaker: "Petugas",
        text: "Akan saya buatkan Laporan Polisi. Tolong tunjukkan paspor Anda dulu.",
        vi: "Tôi sẽ lập Biên bản trình báo cho anh. Anh cho xem hộ chiếu trước nhé.",
        en: "I'll make a Police Report for you. Please show me your passport first.",
      },
      // Dialogue B: a traffic stop handled by the book
      {
        speaker: "Polisi",
        text: "Selamat sore. Tolong pinggirkan motornya. SIM dan STNK, ya.",
        vi: "Chào buổi chiều. Vui lòng tấp xe vào lề. Cho xem bằng lái và đăng ký xe.",
        en: "Good evening. Please pull the bike over. Licence and registration, please.",
      },
      {
        speaker: "Pengendara",
        text: "Selamat sore, Pak. Ini SIM dan STNK saya. Saya kena tilang karena apa, ya, Pak?",
        vi: "Chào buổi chiều, thưa anh. Đây là bằng lái và đăng ký xe. Tôi bị phạt vì lỗi gì vậy anh?",
        en: "Good evening, sir. Here are my licence and registration. What am I being ticketed for, sir?",
      },
      {
        speaker: "Polisi",
        text: "Tadi Anda menerobos lampu merah. Itu pelanggaran.",
        vi: "Vừa nãy anh vượt đèn đỏ. Đó là vi phạm.",
        en: "You just ran a red light. That's a violation.",
      },
      {
        speaker: "Pengendara",
        text: "Maaf, Pak. Kalau begitu, saya minta surat tilang yang resmi dan saya bayar dendanya lewat bank. Saya ikut prosedur resmi saja.",
        vi: "Tôi xin lỗi, thưa anh. Vậy thì tôi xin biên bản phạt chính thức và sẽ nộp phạt qua ngân hàng. Tôi xin theo đúng thủ tục thôi ạ.",
        en: "Sorry, sir. In that case, I'd like the official ticket and I'll pay the fine via the bank. I'll just follow the official procedure.",
      },
      {
        speaker: "Polisi",
        text: "Baik. Ini surat tilangnya. Sidang atau bayar di bank, terserah Anda.",
        vi: "Được. Đây là biên bản phạt. Ra tòa hay nộp ở ngân hàng, tùy anh.",
        en: "All right. Here's the ticket. Court hearing or pay at the bank, up to you.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn làm đơn trình báo mất đồ.", answer: "Saya ingin membuat laporan kehilangan." },
          { prompt: "Ví của tôi bị trộm.", answer: "Dompet saya dicuri." },
          { prompt: "Đây là bằng lái và đăng ký xe của tôi.", answer: "Ini SIM dan STNK saya." },
          { prompt: "Tôi bị phạt vì lỗi gì?", answer: "Saya kena tilang karena apa?" },
          { prompt: "Tôi xin biên bản phạt chính thức.", answer: "Saya minta surat tilang yang resmi." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Bảo vệ quyền của bạn — dịch sang tiếng Indonesia:",
        instruction_en: "Asserting your rights — translate into Indonesian:",
        items: [
          { prompt: "Tôi có bị tạm giữ không? Trên cơ sở nào?", answer: "Apa saya ditahan? Atas dasar apa?" },
          { prompt: "Tôi muốn liên hệ luật sư của tôi.", answer: "Saya ingin menghubungi pengacara saya." },
          { prompt: "Tôi muốn liên hệ đại sứ quán.", answer: "Saya ingin menghubungi kedutaan." },
          { prompt: "Tiếng Indonesia của tôi còn hạn chế, anh nói chậm được không?", answer: "Bahasa Indonesia saya terbatas, bisa pelan-pelan?" },
          { prompt: "Tôi xin theo đúng thủ tục thôi.", answer: "Saya ikut prosedur resmi saja." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `melaporkan`, `laporan`, `menilang`, `ditilang`, hay `ditahan` cho đúng (chủ động vs bị động vs danh từ):",
        instruction_en:
          "Choose `melaporkan`, `laporan`, `menilang`, `ditilang`, or `ditahan` correctly (active vs passive vs noun):",
        items: [
          { prompt: "Saya mau ___ pencurian ini.", answer: "melaporkan", hint: "động từ 'trình báo việc gì' (meN-…-kan)" },
          { prompt: "Ini surat ___ polisi saya.", answer: "laporan", hint: "danh từ 'tờ trình báo' (-an)" },
          { prompt: "Saya ___ karena menerobos lampu merah.", answer: "ditilang", hint: "bị động 'bị phạt' (di-)" },
          { prompt: "Polisi berhak ___ pelanggar lalu lintas.", answer: "menilang", hint: "chủ động 'phạt' (meN-)" },
          { prompt: "Apa saya ___ malam ini, Pak?", answer: "ditahan", hint: "bị động 'bị tạm giữ' (di-)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung gặp cảnh sát — điền chỗ trống: `Selamat ___, Pak. Ini SIM dan STNK saya. Saya kena tilang karena ___? Saya minta surat tilang yang ___.`",
        instruction_en:
          "Police-stop frame — fill the blanks: `Selamat ___, Pak. Ini SIM dan STNK saya. Saya kena tilang karena ___? Saya minta surat tilang yang ___.`",
        example:
          "Selamat sore, Pak. Ini SIM dan STNK saya. Saya kena tilang karena apa? Saya minta surat tilang yang resmi.",
        example_vi:
          "Chào buổi chiều, thưa anh. Đây là bằng lái và đăng ký xe của tôi. Tôi bị phạt vì lỗi gì? Tôi xin biên bản phạt chính thức.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra khi gặp cảnh sát — bạn làm được chưa?",
        instruction_en: "Police-encounter self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể chào và gọi cảnh sát lịch sự bằng `Pak`/`Bu`.", en: "I can greet and address an officer politely with `Pak`/`Bu`." },
          { vi: "Tôi có thể trình `SIM` và `STNK` và hỏi lý do bị dừng.", en: "I can present my `SIM` and `STNK` and ask why I was stopped." },
          { vi: "Tôi phân biệt được `menilang` (cảnh sát phạt) và `ditilang`/`kena tilang` (tôi bị phạt).", en: "I can tell `menilang` (officer fines) from `ditilang`/`kena tilang` (I get fined)." },
          { vi: "Tôi biết xin `surat tilang resmi` và nộp phạt qua kênh hợp pháp, không đưa `pungli`.", en: "I know to ask for the `surat tilang resmi` and pay legally, never a `pungli`." },
          { vi: "Tôi biết hỏi `atas dasar apa` và đòi liên hệ `pengacara`/`kedutaan` khi bị giữ.", en: "I know to ask `atas dasar apa` and request a `pengacara`/`kedutaan` if detained." },
          { vi: "Tôi dùng `saya`/`Anda` chứ không `kamu`/`gue`.", en: "I use `saya`/`Anda`, never `kamu`/`gue`." },
        ],
      },
    ],
  },
];

export default lessons;
