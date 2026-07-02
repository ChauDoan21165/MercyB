// Tax & Documents Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, travel-tourism.ts…),
// which in turn mirror the French `FrenchLesson` shape. When the shared Indonesian
// registry (src/languages/indonesian/lessons.ts) lands, swap the local types for a
// shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Topic: the Indonesian tax & employment-paperwork maze a working foreigner must
// survive — the taxpayer number (`NPWP`), the annual tax return (`SPT`), `e-filing`,
// the worker social-security scheme (`BPJS Ketenagakerjaan`), and reading a payslip
// (`slip gaji`). This is bureaucratic Bahasa: heavy on acronyms, formal `di-` passives,
// and polite `mohon`. For Vietnamese speakers the grammar is forgiving (no conjugation,
// no tones), but the acronyms and the formal register are the real work.

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

// Loosely typed so per-type fields (translation, fill_blank, checklist) can vary.
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
    id: "indonesian_tax_documents",
    level: "B1",
    category: "bureaucracy",
    title_vi: "Thuế và giấy tờ",
    title_en: "Tax and documents",
    sentences: [
      // ── NPWP: the taxpayer number ───────────────────────────────────────
      {
        en: "Saya mau membuat NPWP, dokumen apa saja yang diperlukan?",
        vi: "Tôi muốn làm mã số thuế, cần những giấy tờ gì ạ?",
        pronunciation_focus: [
          "SA-ya mau mem-BU-at en-pe-we-PE, do-KU-men A-pa SA-ja yang di-per-LU-kan — `NPWP` đọc 'en-pe-we-pe' = mã số thuế; `membuat` = làm/tạo; `diperlukan` = được cần (bị động).",
          "Mẹo: `apa saja` = 'những gì' (số nhiều) — `dokumen apa saja` = những giấy tờ gì. `saja` ở đây không phải 'chỉ'.",
          "Lỗi người Việt: đọc NPWP từng chữ kiểu tiếng Anh. Trong tiếng Indonesia đọc tên chữ cái: en-pe-we-pe.",
          "Luyện: `Saya mau membuat NPWP, dokumen apa saja yang diperlukan?`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BU-at en-pe-we-PE, do-KU-men A-pa SA-ja yang di-per-LU-kan — `NPWP` said 'en-pe-we-pe' = taxpayer number; `membuat` = to make/create; `diperlukan` = is needed (passive).",
          "Tip: `apa saja` = 'what (all)' (plural) — `dokumen apa saja` = which documents. Here `saja` is not 'only'.",
          "VN-speaker trap: spelling NPWP English-style. In Indonesian you say the letter names: en-pe-we-pe.",
          "Drill: `Saya mau membuat NPWP, dokumen apa saja yang diperlukan?`",
        ],
      },
      {
        en: "Nomor NPWP saya sudah terdaftar di kantor pajak.",
        vi: "Mã số thuế của tôi đã được đăng ký ở cơ quan thuế.",
        pronunciation_focus: [
          "NO-mor en-pe-we-PE SA-ya SU-dah ter-DAF-tar di kan-TOR PA-jak — `terdaftar` = đã được đăng ký (tiền tố `ter-` = trạng thái hoàn thành); `kantor pajak` = cơ quan thuế.",
          "Mẹo: `ter-` ở đây = 'đã ở trạng thái' (terdaftar = đã có tên trong danh sách), khác `di-` (hành động bị động).",
          "Lỗi người Việt: dùng `ke kantor pajak` khi ý là 'Ở cơ quan thuế'. Vị trí tĩnh dùng `di`, không `ke`.",
          "Luyện: `Nomor NPWP saya sudah terdaftar di kantor pajak.`",
        ],
        pronunciation_focus_en: [
          "NO-mor en-pe-we-PE SA-ya SU-dah ter-DAF-tar di kan-TOR PA-jak — `terdaftar` = is registered (prefix `ter-` = resulting state); `kantor pajak` = tax office.",
          "Tip: `ter-` here = 'in a resulting state' (terdaftar = listed/registered), distinct from `di-` (passive action).",
          "VN-speaker trap: `ke kantor pajak` when you mean 'AT the tax office'. Static location takes `di`, not `ke`.",
          "Drill: `Nomor NPWP saya sudah terdaftar di kantor pajak.`",
        ],
      },
      // ── SPT: the annual return ──────────────────────────────────────────
      {
        en: "Setiap tahun saya harus melaporkan SPT pajak.",
        vi: "Mỗi năm tôi phải khai báo tờ khai thuế.",
        pronunciation_focus: [
          "se-ti-AP TA-hun SA-ya HA-rus me-la-POR-kan es-pe-TE PA-jak — `setiap tahun` = mỗi năm; `melaporkan` = khai báo/báo cáo; `SPT` đọc 'es-pe-te' = tờ khai thuế.",
          "Mẹo: `me-…-kan` biến `lapor` (báo) → `melaporkan` (báo cáo cái gì). Hậu tố `-kan` = làm điều đó cho/lên đối tượng.",
          "Lỗi người Việt: bỏ tiền tố `me-`, nói `saya lapor SPT`. Trang trọng/chuẩn là `melaporkan SPT`.",
          "Luyện: `Setiap tahun saya harus melaporkan SPT pajak.`",
        ],
        pronunciation_focus_en: [
          "se-ti-AP TA-hun SA-ya HA-rus me-la-POR-kan es-pe-TE PA-jak — `setiap tahun` = every year; `melaporkan` = to report/file; `SPT` said 'es-pe-te' = tax return.",
          "Tip: `me-…-kan` turns `lapor` (report) → `melaporkan` (to file something). The `-kan` suffix = do it to/onto the object.",
          "VN-speaker trap: dropping the `me-` prefix: `saya lapor SPT`. The standard form is `melaporkan SPT`.",
          "Drill: `Setiap tahun saya harus melaporkan SPT pajak.`",
        ],
      },
      {
        en: "Batas waktu lapor SPT pribadi adalah akhir Maret.",
        vi: "Hạn nộp tờ khai thuế cá nhân là cuối tháng Ba.",
        pronunciation_focus: [
          "BA-tas WAK-tu LA-por es-pe-TE pri-BA-di a-DA-lah a-KHIR MA-ret — `batas waktu` = hạn chót; `pribadi` = cá nhân; `adalah` = là.",
          "Mẹo: `adalah` = 'là' nối hai danh từ trang trọng. Khẩu ngữ thường bỏ luôn: `Batasnya akhir Maret`.",
          "Lỗi người Việt: dùng `adalah` trước tính từ: `dia adalah pintar` (sai). `adalah` chỉ nối danh từ; với tính từ bỏ nó.",
          "Luyện: `Batas waktu lapor SPT pribadi adalah akhir Maret.`",
        ],
        pronunciation_focus_en: [
          "BA-tas WAK-tu LA-por es-pe-TE pri-BA-di a-DA-lah a-KHIR MA-ret — `batas waktu` = deadline; `pribadi` = personal/individual; `adalah` = is.",
          "Tip: `adalah` = 'is', linking two nouns formally. Casual speech drops it: `Batasnya akhir Maret`.",
          "VN-speaker trap: using `adalah` before an adjective: `dia adalah pintar` (wrong). `adalah` links nouns only; with adjectives, omit it.",
          "Drill: `Batas waktu lapor SPT pribadi adalah akhir Maret.`",
        ],
      },
      {
        en: "SPT bisa dilaporkan secara online lewat e-filing.",
        vi: "Tờ khai thuế có thể được nộp trực tuyến qua e-filing.",
        pronunciation_focus: [
          "es-pe-TE BI-sa di-la-POR-kan se-CA-ra ON-line LE-wat e-fai-ling — `dilaporkan` = được nộp (bị động `di-`); `secara online` = bằng hình thức trực tuyến; `lewat` = qua/thông qua.",
          "Mẹo: `e-filing` đọc kiểu Anh 'i-fai-ling'; `secara` + tính từ = 'một cách …' (`secara online` = một cách trực tuyến).",
          "Lỗi người Việt: dùng `melalui` và `lewat` lẫn lộn không sao — cả hai = 'qua', nhưng `lewat` thân mật hơn.",
          "Luyện: `SPT bisa dilaporkan secara online lewat e-filing.`",
        ],
        pronunciation_focus_en: [
          "es-pe-TE BI-sa di-la-POR-kan se-CA-ra ON-line LE-wat e-fai-ling — `dilaporkan` = can be filed (di- passive); `secara online` = in an online manner; `lewat` = via/through.",
          "Tip: `e-filing` is said English-style 'ee-filing'; `secara` + adjective = 'in a … manner' (`secara online` = online).",
          "VN-speaker trap: `melalui` vs `lewat` — both mean 'through'; `lewat` is just more casual.",
          "Drill: `SPT bisa dilaporkan secara online lewat e-filing.`",
        ],
      },
      // ── Payslip & withholding ───────────────────────────────────────────
      {
        en: "Pajak penghasilan saya sudah dipotong dari gaji.",
        vi: "Thuế thu nhập của tôi đã được khấu trừ từ lương.",
        pronunciation_focus: [
          "PA-jak peng-HA-si-lan SA-ya SU-dah di-PO-tong da-ri GA-ji — `pajak penghasilan` (PPh) = thuế thu nhập; `dipotong` = bị khấu trừ; `gaji` = lương.",
          "Mẹo: `penghasilan` = thu nhập (gốc `hasil` = kết quả/sản phẩm + `peN-…-an`). PPh = Pajak Penghasilan.",
          "Lỗi người Việt: nói `saya potong pajak` (= tôi cắt thuế của ai). 'Bị trừ' phải là `dipotong` (bị động).",
          "Luyện: `Pajak penghasilan saya sudah dipotong dari gaji.`",
        ],
        pronunciation_focus_en: [
          "PA-jak peng-HA-si-lan SA-ya SU-dah di-PO-tong da-ri GA-ji — `pajak penghasilan` (PPh) = income tax; `dipotong` = is deducted; `gaji` = salary.",
          "Tip: `penghasilan` = income (root `hasil` = result/yield + `peN-…-an`). PPh = Pajak Penghasilan.",
          "VN-speaker trap: `saya potong pajak` means 'I cut someone's tax'. 'Was deducted' must be `dipotong` (passive).",
          "Drill: `Pajak penghasilan saya sudah dipotong dari gaji.`",
        ],
      },
      {
        en: "Tolong, bisa minta slip gaji bulan ini?",
        vi: "Cho hỏi, tôi xin phiếu lương tháng này được không?",
        pronunciation_focus: [
          "TO-long, BI-sa MIN-ta slip GA-ji BU-lan I-ni — `slip gaji` = phiếu lương; `minta` = xin; `bulan ini` = tháng này.",
          "Mẹo: `bisa minta …?` = 'cho tôi xin … được không?' — cách hỏi lịch sự, nhẹ nhàng.",
          "Lỗi người Việt: dùng `boleh` thay `bisa` ở đây cũng được, nhưng `bisa minta` là cụm cố định rất thông dụng.",
          "Luyện: `Tolong, bisa minta slip gaji bulan ini?`",
        ],
        pronunciation_focus_en: [
          "TO-long, BI-sa MIN-ta slip GA-ji BU-lan I-ni — `slip gaji` = payslip; `minta` = to ask for; `bulan ini` = this month.",
          "Tip: `bisa minta …?` = 'could I get …?' — a soft, polite request frame.",
          "VN-speaker trap: `boleh` instead of `bisa` also works here, but `bisa minta` is the very common fixed phrase.",
          "Drill: `Tolong, bisa minta slip gaji bulan ini?`",
        ],
      },
      {
        en: "Di slip gaji ada potongan BPJS dan pajak.",
        vi: "Trên phiếu lương có khoản trừ BPJS và thuế.",
        pronunciation_focus: [
          "di slip GA-ji A-da po-TO-ngan be-pe-je-ES dan PA-jak — `potongan` = khoản khấu trừ; `BPJS` đọc 'be-pe-je-es'; `dan` = và.",
          "Mẹo: `potongan` (danh từ: khoản trừ) từ `potong` (cắt) + `-an`. So với `dipotong` (động từ bị động).",
          "Lỗi người Việt: lẫn `BPJS Kesehatan` (bảo hiểm y tế) với `BPJS Ketenagakerjaan` (bảo hiểm lao động) — hai loại khác nhau.",
          "Luyện: `Di slip gaji ada potongan BPJS dan pajak.`",
        ],
        pronunciation_focus_en: [
          "di slip GA-ji A-da po-TO-ngan be-pe-je-ES dan PA-jak — `potongan` = a deduction; `BPJS` said 'be-pe-je-es'; `dan` = and.",
          "Tip: `potongan` (noun: deduction) from `potong` (to cut) + `-an`. Compare `dipotong` (passive verb).",
          "VN-speaker trap: confusing `BPJS Kesehatan` (health insurance) with `BPJS Ketenagakerjaan` (employment insurance) — two different schemes.",
          "Drill: `Di slip gaji ada potongan BPJS dan pajak.`",
        ],
      },
      // ── BPJS Ketenagakerjaan ────────────────────────────────────────────
      {
        en: "Perusahaan wajib mendaftarkan karyawan ke BPJS Ketenagakerjaan.",
        vi: "Công ty bắt buộc phải đăng ký cho nhân viên vào BPJS lao động.",
        pronunciation_focus: [
          "pe-ru-sa-HA-an WA-jib men-daf-TAR-kan kar-ya-WAN ke be-pe-je-ES ke-te-na-ga-ker-JA-an — `wajib` = bắt buộc; `mendaftarkan` = đăng ký (cho ai); `karyawan` = nhân viên.",
          "Mẹo: `mendaftarkan` = đăng ký GIÚP ai (có `-kan`); `mendaftar` = tự mình đăng ký. Hậu tố `-kan` thêm đối tượng.",
          "Lỗi người Việt: dùng `harus` và `wajib` lẫn lộn — `harus` = phải (chung), `wajib` = bắt buộc theo luật (mạnh hơn).",
          "Luyện: `Perusahaan wajib mendaftarkan karyawan ke BPJS Ketenagakerjaan.`",
        ],
        pronunciation_focus_en: [
          "pe-ru-sa-HA-an WA-jib men-daf-TAR-kan kar-ya-WAN ke be-pe-je-ES ke-te-na-ga-ker-JA-an — `wajib` = obligatory; `mendaftarkan` = to register (someone); `karyawan` = employee.",
          "Tip: `mendaftarkan` = to register someone (has `-kan`); `mendaftar` = to register yourself. The `-kan` adds the object.",
          "VN-speaker trap: mixing `harus` and `wajib` — `harus` = must (general), `wajib` = legally obligatory (stronger).",
          "Drill: `Perusahaan wajib mendaftarkan karyawan ke BPJS Ketenagakerjaan.`",
        ],
      },
      {
        en: "Iuran BPJS dibayar setiap bulan, sebagian oleh perusahaan.",
        vi: "Phí BPJS được đóng hàng tháng, một phần do công ty trả.",
        pronunciation_focus: [
          "i-U-ran be-pe-je-ES di-BA-yar se-ti-AP BU-lan, se-ba-GI-an O-leh pe-ru-sa-HA-an — `iuran` = phí đóng góp; `dibayar` = được trả; `sebagian` = một phần; `oleh` = bởi/do.",
          "Mẹo: `oleh` đánh dấu chủ thể trong câu bị động: `dibayar oleh perusahaan` = do công ty trả. Có thể bỏ `oleh`.",
          "Lỗi người Việt: nói `bayar oleh saya`. Trong câu bị động cần `di-`: `dibayar oleh saya`.",
          "Luyện: `Iuran BPJS dibayar setiap bulan, sebagian oleh perusahaan.`",
        ],
        pronunciation_focus_en: [
          "i-U-ran be-pe-je-ES di-BA-yar se-ti-AP BU-lan, se-ba-GI-an O-leh pe-ru-sa-HA-an — `iuran` = contribution/fee; `dibayar` = is paid; `sebagian` = partly; `oleh` = by.",
          "Tip: `oleh` marks the agent in a passive: `dibayar oleh perusahaan` = paid by the company. `oleh` can be dropped.",
          "VN-speaker trap: saying `bayar oleh saya`. A passive needs `di-`: `dibayar oleh saya`.",
          "Drill: `Iuran BPJS dibayar setiap bulan, sebagian oleh perusahaan.`",
        ],
      },
      // ── Asking for help at the office ───────────────────────────────────
      {
        en: "Maaf, saya belum mengerti cara mengisi formulir ini.",
        vi: "Xin lỗi, tôi chưa hiểu cách điền tờ khai này.",
        pronunciation_focus: [
          "ma-AF, SA-ya BE-lum me-NGER-ti CA-ra me-ngi-SI for-mu-LIR I-ni — `belum` = chưa; `mengerti` = hiểu; `cara mengisi` = cách điền; `formulir` = tờ khai/mẫu đơn.",
          "Mẹo: `belum` (chưa) ≠ `tidak` (không). 'Chưa hiểu' (sẽ hiểu) = `belum mengerti`, không phải `tidak mengerti`.",
          "Lỗi người Việt: nói `tidak mengerti` khi ý là 'chưa hiểu'. Dùng `belum` để giữ phép lịch sự ('chưa, sẽ học').",
          "Luyện: `Maaf, saya belum mengerti cara mengisi formulir ini.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, SA-ya BE-lum me-NGER-ti CA-ra me-ngi-SI for-mu-LIR I-ni — `belum` = not yet; `mengerti` = to understand; `cara mengisi` = how to fill in; `formulir` = form.",
          "Tip: `belum` (not yet) ≠ `tidak` (not). 'Don't understand yet' = `belum mengerti`, not `tidak mengerti`.",
          "VN-speaker trap: `tidak mengerti` when you mean 'not yet'. Use `belum` to stay polite ('not yet, I'll learn').",
          "Drill: `Maaf, saya belum mengerti cara mengisi formulir ini.`",
        ],
      },
      {
        en: "Mohon dibantu, dokumen mana yang harus saya tanda tangani?",
        vi: "Kính mong được giúp, tôi phải ký vào giấy tờ nào ạ?",
        pronunciation_focus: [
          "MO-hon di-BAN-tu, do-KU-men MA-na yang HA-rus SA-ya tan-da-ta-NGA-ni — `mohon dibantu` = kính mong được giúp; `tanda tangani` = ký tên (vào).",
          "Mẹo: `mohon` + bị động `di-` là công thức nhờ vả siêu lịch sự ở văn phòng/cơ quan: `mohon dibantu`, `mohon diperiksa`.",
          "Lỗi người Việt: nói `tolong bantu saya` ở nơi trang trọng — không sai nhưng `mohon dibantu` lịch sự hơn hẳn.",
          "Luyện: `Mohon dibantu, dokumen mana yang harus saya tanda tangani?`",
        ],
        pronunciation_focus_en: [
          "MO-hon di-BAN-tu, do-KU-men MA-na yang HA-rus SA-ya tan-da-ta-NGA-ni — `mohon dibantu` = kindly assist me; `tanda tangani` = to sign.",
          "Tip: `mohon` + di- passive is the ultra-polite request formula at offices: `mohon dibantu`, `mohon diperiksa`.",
          "VN-speaker trap: `tolong bantu saya` in a formal setting — not wrong, but `mohon dibantu` is far politer.",
          "Drill: `Mohon dibantu, dokumen mana yang harus saya tanda tangani?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Hệ thống thuế và giấy tờ lao động ở Indonesia ngập trong từ viết tắt — học thuộc bộ acronym là một nửa trận chiến. `NPWP` (Nomor Pokok Wajib Pajak) là mã số thuế cá nhân/doanh nghiệp; có việc làm chính thức gần như bắt buộc phải có. `SPT` (Surat Pemberitahuan) là tờ khai thuế năm; cá nhân khai trước cuối tháng Ba qua `e-filing` trên trang DJP Online của `Direktorat Jenderal Pajak` (cơ quan thuế, gọi tắt `DJP`). `PPh` (Pajak Penghasilan) là thuế thu nhập, thường được công ty khấu trừ (`dipotong`) thẳng từ lương và ghi trên `slip gaji`. Có hai loại BPJS dễ nhầm: `BPJS Kesehatan` (bảo hiểm y tế) và `BPJS Ketenagakerjaan` (bảo hiểm lao động: tai nạn, hưu trí, tử tuất) — công ty bắt buộc (`wajib`) đăng ký cho nhân viên và đóng một phần `iuran` (phí). Lưu ý: lao động nước ngoài cư trú và có thu nhập ở Indonesia thường cũng phải có NPWP và khai SPT — hãy hỏi phòng nhân sự (`HRD`) hoặc một `konsultan pajak` (tư vấn thuế). Văn phòng nhà nước dùng Bahasa rất trang trọng: nhiều `di-` bị động và `mohon`.",
    cultural_notes_en:
      "Indonesia's tax and employment paperwork is drowning in acronyms — memorizing the acronym set is half the battle. `NPWP` (Nomor Pokok Wajib Pajak) is the personal/business taxpayer number; formal employment basically requires one. `SPT` (Surat Pemberitahuan) is the annual tax return; individuals file by the end of March via `e-filing` on the DJP Online site run by the `Direktorat Jenderal Pajak` (tax authority, abbreviated `DJP`). `PPh` (Pajak Penghasilan) is income tax, usually withheld (`dipotong`) straight from salary and shown on the `slip gaji` (payslip). Two easily-confused BPJS schemes: `BPJS Kesehatan` (health insurance) and `BPJS Ketenagakerjaan` (employment insurance: work accident, pension, death benefit) — the company is obligated (`wajib`) to enroll staff and pay part of the `iuran` (contribution). Note: resident foreigners earning income in Indonesia generally also need an NPWP and must file an SPT — ask HR (`HRD`) or a `konsultan pajak` (tax consultant). Government offices use very formal Bahasa: lots of di- passives and `mohon`.",
    tip_advice_vi:
      "Học theo cụm, không học lẻ. Bốn 'việc sống còn' về giấy tờ: (1) làm/hỏi giấy tờ — `Saya mau membuat …, dokumen apa saja yang diperlukan?`; (2) khai/nộp — `Saya harus melaporkan SPT`, `bisa dilaporkan lewat e-filing`; (3) đọc phiếu lương — `Pajak/BPJS sudah dipotong dari gaji`; (4) xin giúp lịch sự — `Mohon dibantu …`, `Saya belum mengerti …`. Nhớ ba khác biệt: `belum` (chưa, sẽ làm) ≠ `tidak` (không) ≠ `jangan` (đừng); `harus` (phải) ≠ `wajib` (bắt buộc theo luật); `di` (ở) ≠ `ke` (đến). Acronym đọc theo TÊN CHỮ CÁI tiếng Indonesia: NPWP = en-pe-we-pe, SPT = es-pe-te, BPJS = be-pe-je-es. Văn bản hành chính đầy bị động `di-` (`dipotong`, `dibayar`, `terdaftar`) — nhận ra nó là chìa khóa đọc hiểu. Khi bí, hỏi `HRD` hoặc `konsultan pajak` — đừng đoán.",
    tip_advice_en:
      "Learn by phrase, not by single word. Four 'survival' paperwork jobs: (1) make/ask for documents — `Saya mau membuat …, dokumen apa saja yang diperlukan?`; (2) file/report — `Saya harus melaporkan SPT`, `bisa dilaporkan lewat e-filing`; (3) read the payslip — `Pajak/BPJS sudah dipotong dari gaji`; (4) ask for help politely — `Mohon dibantu …`, `Saya belum mengerti …`. Keep three distinctions straight: `belum` (not yet, will do) ≠ `tidak` (not) ≠ `jangan` (don't); `harus` (must) ≠ `wajib` (legally obligatory); `di` (at) ≠ `ke` (to). Read acronyms by Indonesian LETTER NAMES: NPWP = en-pe-we-pe, SPT = es-pe-te, BPJS = be-pe-je-es. Bureaucratic text is full of the di- passive (`dipotong`, `dibayar`, `terdaftar`) — recognizing it is the key to reading it. When stuck, ask `HRD` or a `konsultan pajak` — don't guess.",
    vocabulary: [
      // ── Core acronyms ───────────────────────────────────────────────
      {
        word: "NPWP",
        en: "taxpayer ID number",
        vi: "mã số thuế",
        pos: "noun (acronym)",
        pronunciation_vi: "en-pe-we-PE — Nomor Pokok Wajib Pajak",
        pronunciation_en: "en-pe-way-PAY — Nomor Pokok Wajib Pajak",
      },
      {
        word: "SPT",
        en: "annual tax return",
        vi: "tờ khai thuế",
        pos: "noun (acronym)",
        pronunciation_vi: "es-pe-TE — Surat Pemberitahuan; nộp trước cuối tháng Ba",
        pronunciation_en: "es-pay-TAY — Surat Pemberitahuan; filed by end of March",
      },
      {
        word: "PPh",
        en: "income tax",
        vi: "thuế thu nhập",
        pos: "noun (acronym)",
        pronunciation_vi: "pe-pe-HA — Pajak Penghasilan",
        pronunciation_en: "pay-pay-HA — Pajak Penghasilan",
      },
      {
        word: "DJP",
        en: "tax authority (Directorate General of Taxes)",
        vi: "cơ quan thuế",
        pos: "noun (acronym)",
        pronunciation_vi: "de-je-PE — Direktorat Jenderal Pajak; trang `DJP Online`",
        pronunciation_en: "day-jay-PAY — Direktorat Jenderal Pajak; the `DJP Online` site",
      },
      {
        word: "e-filing",
        en: "online tax filing",
        vi: "khai thuế trực tuyến",
        pos: "noun",
        pronunciation_vi: "i-FAI-ling — nộp SPT qua mạng",
        pronunciation_en: "ee-FY-ling — filing the SPT online",
      },
      // ── BPJS & payroll ──────────────────────────────────────────────
      {
        word: "BPJS Ketenagakerjaan",
        en: "worker social-security scheme",
        vi: "bảo hiểm lao động",
        pos: "noun phrase",
        pronunciation_vi: "be-pe-je-ES ke-te-na-ga-ker-JA-an — tai nạn, hưu trí, tử tuất",
        pronunciation_en: "bay-pay-jay-ES ke-te-na-ga-ker-JA-an — accident, pension, death benefit",
      },
      {
        word: "BPJS Kesehatan",
        en: "national health insurance",
        vi: "bảo hiểm y tế",
        pos: "noun phrase",
        pronunciation_vi: "be-pe-je-ES ke-se-HA-tan — khác với Ketenagakerjaan",
        pronunciation_en: "bay-pay-jay-ES ke-se-HA-tan — different from Ketenagakerjaan",
      },
      {
        word: "iuran",
        en: "contribution / monthly fee",
        vi: "phí đóng góp",
        pos: "noun",
        pronunciation_vi: "i-U-ran — `iuran BPJS` đóng hàng tháng",
        pronunciation_en: "ee-OO-ran — `iuran BPJS` paid monthly",
      },
      {
        word: "slip gaji",
        en: "payslip",
        vi: "phiếu lương",
        pos: "noun phrase",
        pronunciation_vi: "slip GA-ji — liệt kê lương + các khoản trừ",
        pronunciation_en: "slip GA-ji — lists salary + deductions",
      },
      {
        word: "potongan",
        en: "deduction",
        vi: "khoản khấu trừ",
        pos: "noun",
        pronunciation_vi: "po-TO-ngan — gốc `potong` (cắt) + `-an`",
        pronunciation_en: "po-TO-ngan — root `potong` (cut) + `-an`",
      },
      {
        word: "penghasilan",
        en: "income / earnings",
        vi: "thu nhập",
        pos: "noun",
        pronunciation_vi: "peng-HA-si-lan — gốc `hasil` (kết quả)",
        pronunciation_en: "peng-HA-si-lan — root `hasil` (result/yield)",
      },
      // ── Tax & office actions ────────────────────────────────────────
      {
        word: "pajak",
        en: "tax",
        vi: "thuế",
        pos: "noun",
        pronunciation_vi: "PA-jak — `kantor pajak` = cơ quan thuế; `wajib pajak` = người nộp thuế",
        pronunciation_en: "PA-jak — `kantor pajak` = tax office; `wajib pajak` = taxpayer",
      },
      {
        word: "melaporkan",
        en: "to report / file",
        vi: "khai báo / báo cáo",
        pos: "verb",
        pronunciation_vi: "me-la-POR-kan — `lapor` + `me-…-kan`; `melaporkan SPT`",
        pronunciation_en: "me-la-POR-kan — `lapor` + `me-…-kan`; `melaporkan SPT`",
      },
      {
        word: "mendaftarkan",
        en: "to register (someone)",
        vi: "đăng ký (cho ai)",
        pos: "verb",
        pronunciation_vi: "men-daf-TAR-kan — `mendaftar` = tự đăng ký; `-kan` thêm đối tượng",
        pronunciation_en: "men-daf-TAR-kan — `mendaftar` = register oneself; `-kan` adds an object",
      },
      {
        word: "mengisi formulir",
        en: "to fill in a form",
        vi: "điền tờ khai/mẫu đơn",
        pos: "verb phrase",
        pronunciation_vi: "me-ngi-SI for-mu-LIR — `isi` = nội dung/điền vào",
        pronunciation_en: "me-ngi-SI for-mu-LIR — `isi` = content / to fill",
      },
      {
        word: "tanda tangan",
        en: "signature / to sign",
        vi: "chữ ký / ký tên",
        pos: "noun/verb",
        pronunciation_vi: "TAN-da TA-ngan — `menandatangani` = ký vào (cái gì)",
        pronunciation_en: "TAN-da TA-ngan — `menandatangani` = to sign (something)",
      },
      {
        word: "dokumen",
        en: "document",
        vi: "giấy tờ / tài liệu",
        pos: "noun",
        pronunciation_vi: "do-KU-men — `dokumen apa saja?` = những giấy tờ gì?",
        pronunciation_en: "do-KU-men — `dokumen apa saja?` = which documents?",
      },
      {
        word: "wajib",
        en: "obligatory (by law)",
        vi: "bắt buộc",
        pos: "adjective",
        pronunciation_vi: "WA-jib — mạnh hơn `harus`; `wajib pajak` = người phải nộp thuế",
        pronunciation_en: "WA-jib — stronger than `harus`; `wajib pajak` = taxpayer",
      },
      {
        word: "batas waktu",
        en: "deadline",
        vi: "hạn chót",
        pos: "noun phrase",
        pronunciation_vi: "BA-tas WAK-tu — `batas` = giới hạn; `tenggat` cũng = hạn",
        pronunciation_en: "BA-tas WAK-tu — `batas` = limit; `tenggat` also = deadline",
      },
      {
        word: "kantor pajak",
        en: "tax office",
        vi: "cơ quan thuế",
        pos: "noun phrase",
        pronunciation_vi: "kan-TOR PA-jak — `KPP` = Kantor Pelayanan Pajak",
        pronunciation_en: "kan-TOR PA-jak — `KPP` = Kantor Pelayanan Pajak",
      },
      {
        word: "konsultan pajak",
        en: "tax consultant",
        vi: "tư vấn thuế",
        pos: "noun phrase",
        pronunciation_vi: "kon-sul-TAN PA-jak — hỏi khi bí giấy tờ",
        pronunciation_en: "kon-sul-TAN PA-jak — ask when stuck on paperwork",
      },
    ],
    dialogue: [
      // Dialogue: a foreign worker sorts out NPWP & SPT with HR
      {
        speaker: "Karyawan",
        text: "Selamat pagi, Bu. Saya karyawan baru, apakah saya wajib punya NPWP?",
        vi: "Chào buổi sáng, cô. Em là nhân viên mới, em có bắt buộc phải có mã số thuế không ạ?",
        en: "Good morning, ma'am. I'm a new employee — am I required to have an NPWP?",
      },
      {
        speaker: "HRD",
        text: "Iya, wajib. Nanti kami bantu daftar. Dokumen yang diperlukan: paspor dan KITAS.",
        vi: "Vâng, bắt buộc. Chúng tôi sẽ giúp đăng ký. Giấy tờ cần: hộ chiếu và KITAS.",
        en: "Yes, it's required. We'll help you register. The documents needed: passport and KITAS.",
      },
      {
        speaker: "Karyawan",
        text: "Baik. Lalu pajak penghasilan saya bagaimana, Bu?",
        vi: "Vâng. Vậy còn thuế thu nhập của em thì sao ạ?",
        en: "Alright. And what about my income tax, ma'am?",
      },
      {
        speaker: "HRD",
        text: "PPh-nya sudah dipotong langsung dari gaji, tercatat di slip gaji setiap bulan.",
        vi: "Thuế thu nhập đã được trừ thẳng từ lương, ghi trên phiếu lương mỗi tháng.",
        en: "Your income tax is withheld straight from salary, recorded on the monthly payslip.",
      },
      {
        speaker: "Karyawan",
        text: "Maaf, saya belum mengerti soal SPT tahunan. Mohon dibantu.",
        vi: "Xin lỗi, em chưa hiểu về tờ khai thuế năm. Kính mong cô giúp ạ.",
        en: "Sorry, I don't yet understand the annual SPT. Please help me.",
      },
      {
        speaker: "HRD",
        text: "Tenang, SPT bisa dilaporkan online lewat e-filing. Batas waktunya akhir Maret.",
        vi: "Yên tâm, tờ khai có thể nộp trực tuyến qua e-filing. Hạn chót là cuối tháng Ba.",
        en: "Don't worry, the SPT can be filed online via e-filing. The deadline is the end of March.",
      },
      {
        speaker: "Karyawan",
        text: "Terima kasih banyak, Bu. Nanti saya tanda tangani formulirnya.",
        vi: "Cảm ơn cô nhiều ạ. Lát em sẽ ký vào tờ khai.",
        en: "Thank you so much, ma'am. I'll sign the form later.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn làm mã số thuế.", answer: "Saya mau membuat NPWP." },
          { prompt: "Mỗi năm tôi phải khai tờ khai thuế.", answer: "Setiap tahun saya harus melaporkan SPT." },
          { prompt: "Thuế thu nhập đã được trừ từ lương.", answer: "Pajak penghasilan sudah dipotong dari gaji." },
          { prompt: "Cho hỏi, tôi xin phiếu lương được không?", answer: "Bisa minta slip gaji?" },
          { prompt: "Xin lỗi, tôi chưa hiểu.", answer: "Maaf, saya belum mengerti." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Cần những giấy tờ gì ạ?", answer: "Dokumen apa saja yang diperlukan?" },
          { prompt: "Tờ khai có thể nộp qua e-filing.", answer: "SPT bisa dilaporkan lewat e-filing." },
          { prompt: "Công ty bắt buộc đăng ký nhân viên vào BPJS.", answer: "Perusahaan wajib mendaftarkan karyawan ke BPJS." },
          { prompt: "Kính mong được giúp.", answer: "Mohon dibantu." },
          { prompt: "Tôi phải ký vào giấy tờ nào?", answer: "Dokumen mana yang harus saya tanda tangani?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `belum` (chưa), `tidak` (không), hay `wajib` (bắt buộc) cho đúng:",
        instruction_en:
          "Fill in `belum` (not yet), `tidak` (not), or `wajib` (obligatory):",
        items: [
          { prompt: "Saya ___ mengerti, tolong jelaskan lagi.", answer: "belum", hint: "chưa hiểu (sẽ hiểu)" },
          { prompt: "Karyawan ___ punya NPWP menurut aturan.", answer: "wajib", hint: "bắt buộc theo luật" },
          { prompt: "Slip gaji ini ___ ada potongan pajak.", answer: "tidak", hint: "phủ định: không có" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Khớp từ viết tắt với nghĩa: `NPWP`, `SPT`, `PPh`, `BPJS Ketenagakerjaan`:",
        instruction_en:
          "Match each acronym to its meaning: `NPWP`, `SPT`, `PPh`, `BPJS Ketenagakerjaan`:",
        items: [
          { prompt: "Mã số thuế cá nhân → ___", answer: "NPWP", hint: "Nomor Pokok Wajib Pajak" },
          { prompt: "Tờ khai thuế hàng năm → ___", answer: "SPT", hint: "Surat Pemberitahuan" },
          { prompt: "Thuế thu nhập → ___", answer: "PPh", hint: "Pajak Penghasilan" },
          { prompt: "Bảo hiểm lao động → ___", answer: "BPJS Ketenagakerjaan", hint: "tai nạn, hưu trí" },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Quick self-check — can you do each one?",
        items: [
          { vi: "Tôi hỏi được giấy tờ cần làm (`dokumen apa saja yang diperlukan?`).", en: "I can ask which documents are needed (`dokumen apa saja yang diperlukan?`)." },
          { vi: "Tôi đọc đúng acronym theo tên chữ cái (NPWP = en-pe-we-pe).", en: "I can read acronyms by letter name (NPWP = en-pe-we-pe)." },
          { vi: "Tôi phân biệt `belum` (chưa) và `tidak` (không).", en: "I can tell `belum` (not yet) from `tidak` (not)." },
          { vi: "Tôi phân biệt `harus` (phải) và `wajib` (bắt buộc theo luật).", en: "I can tell `harus` (must) from `wajib` (legally obligatory)." },
          { vi: "Tôi nhận ra bị động `di-` trên giấy tờ (`dipotong`, `dibayar`).", en: "I can recognize the di- passive on documents (`dipotong`, `dibayar`)." },
          { vi: "Tôi xin giúp lịch sự bằng `Mohon dibantu`.", en: "I can ask for help politely with `Mohon dibantu`." },
        ],
      },
    ],
  },
];

export default lessons;
