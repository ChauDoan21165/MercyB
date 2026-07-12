// Dentist & Eye Doctor Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (medical-vocabulary.ts, housing-rental.ts,
// job-interview.ts etc.), which in turn mirror the French `FrenchLesson` shape. When
// the shared Indonesian registry (src/languages/indonesian/lessons.ts) lands, swap
// the local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Indonesian is written in Latin script and is largely phonetic. For Vietnamese
// speakers the big WINS are: no grammatical gender, no verb conjugation, no tones,
// no articles. The dental/optical traps are: `gigi` (tooth) vs. `gusi` (gum) are
// easy to swap; `cabut` (extract) vs. `tambal` (fill) vs. `bersihkan` (clean) name
// three different procedures; `kacamata` is one word ('eyeglasses'); and BPJS claims
// use the passive `di-` (`ditanggung` covered, `ditolak` rejected).

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
  cell_id?: string;
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
  cell_id?: string;
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
    id: "indonesian_dentist_eye_doctor",
    level: "A2",
    category: "health",
    title_vi: "Tiếng Indonesia ở nha sĩ & bác sĩ mắt",
    title_en: "Dentist & eye doctor Indonesian",
    sentences: [
      // ── At the dentist: the complaint ────────────────────────────────────
      {
        en: "Gigi saya sakit sejak kemarin.",
        vi: "Răng tôi đau từ hôm qua.",
        pronunciation_focus: [
          "GI-gi SA-ya SA-kit se-JAK ke-MA-rin — `gigi` = răng (`g` cứng cả hai); `sakit` ở đây = đau (vì có bộ phận đứng trước).",
          "Lỗi người Việt: lẫn `gigi` (răng) với `gusi` (nướu/lợi). Đau răng = `sakit gigi`; đau nướu = `gusi sakit`.",
          "Luyện: `Gigi saya sakit sejak kemarin.`",
        ],
        pronunciation_focus_en: [
          "GI-gi SA-ya SA-kit se-JAK ke-MA-rin — `gigi` = tooth (hard `g` both times); here `sakit` = hurts (a body part precedes it).",
          "VN-speaker trap: confusing `gigi` (tooth) with `gusi` (gum). Toothache = `sakit gigi`; sore gum = `gusi sakit`.",
          "Drill: `Gigi saya sakit sejak kemarin.`",
        ],
      },
      {
        en: "Ada gigi berlubang di belakang.",
        vi: "Có một cái răng sâu ở phía sau.",
        pronunciation_focus: [
          "A-da GI-gi ber-LU-bang di be-la-KANG — `berlubang` = bị lỗ/sâu (ber- + `lubang` lỗ); `di belakang` = ở phía sau.",
          "Lỗi người Việt: dùng danh từ `lubang` làm tính từ — ❌ `gigi lubang` → ✓ `gigi berlubang` (răng có lỗ = răng sâu).",
          "Luyện: `Ada gigi berlubang di belakang.`",
        ],
        pronunciation_focus_en: [
          "A-da GI-gi ber-LU-bang di be-la-KANG — `berlubang` = has a hole/cavity (ber- + `lubang` hole); `di belakang` = at the back.",
          "VN-speaker trap: using the noun `lubang` as an adjective — ❌ `gigi lubang` → ✓ `gigi berlubang` (a tooth with a hole = a cavity).",
          "Drill: `Ada gigi berlubang di belakang.`",
        ],
      },
      // ── Dental procedures ────────────────────────────────────────────────
      {
        en: "Apakah gigi ini harus dicabut?",
        vi: "Cái răng này có phải nhổ không ạ?",
        pronunciation_focus: [
          "a-pa-KAH GI-gi I-ni HA-rus di-CA-but — `dicabut` = bị/được nhổ (bị động `di-` + `cabut`); `harus` = phải.",
          "Lỗi người Việt: đọc `cabut` thành 'ka-but'. `c` = 'ch' → 'CHA-but'; và `dicabut` viết DÍNH (bị động).",
          "Luyện: `Apakah gigi ini harus dicabut?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH GI-gi EE-ni HA-rus di-CHA-but — `dicabut` = is/must be extracted (passive `di-` + `cabut`); `harus` = must.",
          "VN-speaker trap: reading `cabut` as 'ka-but'. `c` = 'ch' → 'CHA-but'; and `dicabut` is JOINED (passive).",
          "Drill: `Apakah gigi ini harus dicabut?`",
        ],
      },
      {
        en: "Saya mau gigi saya ditambal saja.",
        vi: "Tôi chỉ muốn trám răng thôi.",
        pronunciation_focus: [
          "SA-ya MAU GI-gi SA-ya di-TAM-bal SA-ja — `ditambal` = được trám (bị động `di-` + `tambal`); `saja` = thôi/chỉ.",
          "Lỗi người Việt: lẫn `tambal` (trám) với `cabut` (nhổ). Trám = vá lỗ giữ răng; nhổ = lấy răng ra.",
          "Luyện: `Saya mau gigi saya ditambal saja.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU GI-gi SA-ya di-TAM-bal SA-ja — `ditambal` = to be filled (passive `di-` + `tambal`); `saja` = just/only.",
          "VN-speaker trap: confusing `tambal` (fill) with `cabut` (extract). Filling patches the hole to keep the tooth; extraction removes it.",
          "Drill: `Saya mau gigi saya ditambal saja.`",
        ],
      },
      {
        en: "Tolong bersihkan karang gigi saya.",
        vi: "Nhờ cạo vôi răng giúp tôi.",
        pronunciation_focus: [
          "TO-long ber-sih-KAN KA-rang GI-gi SA-ya — `bersihkan` = làm sạch (gốc `bersih` + -kan); `karang gigi` = cao/vôi răng.",
          "Lỗi người Việt: bỏ `-kan` — ❌ `tolong bersih` → ✓ `tolong bersihkan` (làm cho sạch). `-kan` = khiến/giúp.",
          "Luyện: `Tolong bersihkan karang gigi saya.`",
        ],
        pronunciation_focus_en: [
          "TO-long ber-sih-KAN KA-rang GI-gi SA-ya — `bersihkan` = to clean (root `bersih` + -kan); `karang gigi` = tartar/plaque.",
          "VN-speaker trap: dropping `-kan` — ❌ `tolong bersih` → ✓ `tolong bersihkan` (make it clean). `-kan` = cause/for someone.",
          "Drill: `Tolong bersihkan karang gigi saya.`",
        ],
      },
      {
        en: "Apakah cabut gigi ini sakit?",
        vi: "Nhổ răng này có đau không ạ?",
        pronunciation_focus: [
          "a-pa-KAH CA-but GI-gi I-ni SA-kit — `cabut gigi` = việc nhổ răng (gốc trần làm danh động); `sakit` = đau.",
          "Lợi thế người Việt: hỏi có/không chỉ cần `apakah` đầu câu — không cần 'do/does' như tiếng Anh.",
          "Luyện: `Apakah cabut gigi ini sakit?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH CHA-but GI-gi EE-ni SA-kit — `cabut gigi` = a tooth extraction (bare root as a gerund); `sakit` = painful.",
          "VN-speaker win: a yes/no question just needs `apakah` up front — no 'do/does' like English.",
          "Drill: `Apakah cabut gigi ini sakit?`",
        ],
      },
      // ── At the eye doctor / optician ─────────────────────────────────────
      {
        en: "Mata saya kabur kalau melihat jauh.",
        vi: "Mắt tôi mờ khi nhìn xa.",
        pronunciation_focus: [
          "MA-ta SA-ya KA-bur ka-LAU me-LI-hat JA-uh — `mata` = mắt; `kabur` = mờ; `melihat` = nhìn (meN- + `lihat`).",
          "Lỗi người Việt: lẫn `kabur` (mờ) với `buta` (mù). Nhìn không rõ = `kabur`; mất thị lực hẳn = `buta`.",
          "Luyện: `Mata saya kabur kalau melihat jauh.`",
        ],
        pronunciation_focus_en: [
          "MA-ta SA-ya KA-bur ka-LAU me-LEE-hat JAH-ooh — `mata` = eye; `kabur` = blurry; `melihat` = to see (meN- + `lihat`).",
          "VN-speaker trap: confusing `kabur` (blurry) with `buta` (blind). Unclear vision = `kabur`; total loss of sight = `buta`.",
          "Drill: `Mata saya kabur kalau melihat jauh.`",
        ],
      },
      {
        en: "Saya mau periksa mata dan buat kacamata.",
        vi: "Tôi muốn khám mắt và làm kính.",
        pronunciation_focus: [
          "SA-ya MAU pe-RIK-sa MA-ta dan BU-at ka-ca-MA-ta — `periksa mata` = khám mắt; `kacamata` = kính mắt (MỘT từ, `c` = 'ch').",
          "Lỗi người Việt: tách `kaca mata` thành hai từ. Kính mắt là MỘT từ `kacamata` ('CHA-cha + MA-ta').",
          "Luyện: `Saya mau periksa mata dan buat kacamata.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU pe-RIK-sa MA-ta dan BU-at ka-cha-MA-ta — `periksa mata` = eye exam; `kacamata` = eyeglasses (ONE word, `c` = 'ch').",
          "VN-speaker trap: splitting `kaca mata` into two words. Eyeglasses is ONE word `kacamata` ('ka-cha-MA-ta').",
          "Drill: `Saya mau periksa mata dan buat kacamata.`",
        ],
      },
      {
        en: "Minus saya bertambah, jadi saya butuh lensa baru.",
        vi: "Độ cận của tôi tăng, nên tôi cần tròng kính mới.",
        pronunciation_focus: [
          "MI-nus SA-ya ber-TAM-bah, JA-di SA-ya BU-tuh LEN-sa BA-ru — `minus` = độ cận; `bertambah` = tăng lên (ber- + `tambah`); `lensa` = tròng kính.",
          "Lỗi người Việt: dùng `naik` cho 'độ tăng'. Số độ tăng dùng `bertambah` (tăng thêm); `lensa` = tròng, `kacamata` = nguyên cặp kính.",
          "Luyện: `Minus saya bertambah, jadi saya butuh lensa baru.`",
        ],
        pronunciation_focus_en: [
          "MEE-nus SA-ya ber-TAM-bah, JA-di SA-ya BU-tuh LEN-sa BA-ru — `minus` = (myopia) prescription; `bertambah` = increases (ber- + `tambah`); `lensa` = lens.",
          "VN-speaker trap: using `naik` for 'went up'. A rising prescription takes `bertambah`; `lensa` = the lens, `kacamata` = the whole pair.",
          "Drill: `Minus saya bertambah, jadi saya butuh lensa baru.`",
        ],
      },
      {
        en: "Di mana optik terdekat?",
        vi: "Tiệm kính gần nhất ở đâu ạ?",
        pronunciation_focus: [
          "di MA-na OP-tik ter-de-KAT — `optik` = tiệm kính/cửa hàng mắt kính; `terdekat` = gần nhất (ter- + `dekat`).",
          "Lỗi người Việt: lẫn `optik` (tiệm kính) với `apotek` (nhà thuốc). `optik` bán `kacamata`; `apotek` bán `obat`.",
          "Luyện: `Di mana optik terdekat?`",
        ],
        pronunciation_focus_en: [
          "di MA-na OP-tik ter-de-KAT — `optik` = optical shop/optician; `terdekat` = nearest (ter- + `dekat`).",
          "VN-speaker trap: confusing `optik` (optical shop) with `apotek` (pharmacy). `optik` sells `kacamata`; `apotek` sells `obat`.",
          "Drill: `Di mana optik terdekat?`",
        ],
      },
      // ── BPJS / payment ───────────────────────────────────────────────────
      {
        en: "Apakah tambal gigi ditanggung BPJS?",
        vi: "Trám răng có được BPJS chi trả không ạ?",
        pronunciation_focus: [
          "a-pa-KAH TAM-bal GI-gi di-TANG-gung be-pe-je-ES — `ditanggung` = được chi trả/bảo lãnh (bị động `di-` + `tanggung`); `BPJS` đọc từng chữ.",
          "Lỗi người Việt: dùng `dibayar` cho 'được bảo hiểm chi trả'. Bảo hiểm chi trả = `ditanggung`; `dibayar` = được trả tiền (chung).",
          "Luyện: `Apakah tambal gigi ditanggung BPJS?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH TAM-bal GI-gi di-TANG-gung be-pe-je-ES — `ditanggung` = is covered/borne (passive `di-` + `tanggung`); spell `BPJS` letter-by-letter.",
          "VN-speaker trap: using `dibayar` for 'covered by insurance'. Insurance coverage = `ditanggung`; `dibayar` = is paid (generic).",
          "Drill: `Apakah tambal gigi ditanggung BPJS?`",
        ],
      },
      {
        en: "Saya mau klaim BPJS untuk perawatan ini.",
        vi: "Tôi muốn yêu cầu BPJS chi trả cho lần điều trị này.",
        pronunciation_focus: [
          "SA-ya MAU klaim be-pe-je-ES UN-tuk pe-ra-WA-tan I-ni — `klaim` = yêu cầu chi trả (mượn tiếng Anh 'claim'); `perawatan` = sự điều trị (per-…-an từ `rawat`).",
          "Lỗi người Việt: dùng `pengobatan` (việc dùng thuốc) cho mọi 'điều trị'. `perawatan` = chăm sóc/điều trị tổng quát (gồm nha khoa, mắt).",
          "Luyện: `Saya mau klaim BPJS untuk perawatan ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU klaim be-pe-je-ES UN-tuk pe-ra-WA-tan EE-ni — `klaim` = to claim (English loan); `perawatan` = the treatment/care (per-…-an from `rawat`).",
          "VN-speaker trap: using `pengobatan` (medication) for all 'treatment'. `perawatan` = general care/treatment (incl. dental, eye).",
          "Drill: `Saya mau klaim BPJS untuk perawatan ini.`",
        ],
      },
      // ── Booking / follow-up ──────────────────────────────────────────────
      {
        en: "Saya mau buat janji dengan dokter gigi.",
        vi: "Tôi muốn đặt lịch hẹn với nha sĩ.",
        pronunciation_focus: [
          "SA-ya MAU BU-at JAN-ji de-NGAN DOK-ter GI-gi — `buat janji` = đặt hẹn; `dokter gigi` = nha sĩ (bác sĩ + răng).",
          "Lợi thế người Việt: `dokter gigi` ghép 'danh từ + bổ nghĩa' y như tiếng Việt 'bác sĩ răng'; `dokter mata` = bác sĩ mắt.",
          "Luyện: `Saya mau buat janji dengan dokter gigi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU BU-at JAN-ji de-NGAN DOK-ter GI-gi — `buat janji` = to make an appointment; `dokter gigi` = dentist (doctor + tooth).",
          "VN-speaker win: `dokter gigi` stacks 'noun + modifier' just like Vietnamese 'bác sĩ răng'; `dokter mata` = eye doctor.",
          "Drill: `Saya mau buat janji dengan dokter gigi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khám răng và mắt ở Indonesia: nha sĩ là `dokter gigi` (gọi tắt `drg.`), bác sĩ mắt là `dokter mata`/`dokter spesialis mata`. Mua kính ở `optik` (tiệm kính — ĐỪNG nhầm với `apotek` nhà thuốc); ở `optik` thường khám độ (`periksa mata`) miễn phí rồi làm `kacamata` (kính, một từ) với `lensa` (tròng) và `bingkai`/`frame` (gọng). Độ cận ghi là `minus`, viễn là `plus`, loạn là `silinder`. Thủ thuật nha khoa thường gặp: `tambal` (trám lỗ sâu), `cabut` (nhổ), `bersihkan karang gigi`/`scaling` (cạo vôi), `behel`/`kawat gigi` (niềng). `BPJS Kesehatan` (đọc 'be-pe-je-es') CÓ chi trả một số dịch vụ nha khoa cơ bản (nhổ, trám, cạo vôi) và khám mắt + trợ cấp `kacamata` định kỳ — nhưng phải đi đúng tuyến (`faskes 1` → giới thiệu `rujukan` lên tuyến trên) và hỏi rõ `ditanggung BPJS atau tidak?`. Lưu ý người Việt: `gigi` (răng) ≠ `gusi` (nướu); `kabur` (mờ) ≠ `buta` (mù).",
    cultural_notes_en:
      "Dental and eye care in Indonesia: the dentist is a `dokter gigi` (abbreviated `drg.`), the eye doctor a `dokter mata`/`dokter spesialis mata`. Buy glasses at an `optik` (optical shop — do NOT confuse with `apotek`, a pharmacy); an `optik` usually does the `periksa mata` (eye exam) free and then makes the `kacamata` (glasses, one word) with `lensa` (lenses) and a `bingkai`/`frame`. Myopia is written `minus`, hyperopia `plus`, astigmatism `silinder`. Common dental procedures: `tambal` (fill a cavity), `cabut` (extract), `bersihkan karang gigi`/`scaling` (descaling), `behel`/`kawat gigi` (braces). `BPJS Kesehatan` (spell 'be-pe-je-es') DOES cover some basic dental services (extractions, fillings, scaling) and eye exams plus a periodic `kacamata` subsidy — but you must follow the referral chain (`faskes 1` → a `rujukan` referral upward) and ask clearly `ditanggung BPJS atau tidak?` (covered by BPJS or not?). VN-speaker note: `gigi` (tooth) ≠ `gusi` (gum); `kabur` (blurry) ≠ `buta` (blind).",
    tip_advice_vi:
      "Học thuộc hai 'bộ khung': RĂNG — `Gigi saya sakit. Ada gigi berlubang. Apakah harus dicabut atau ditambal saja?`; MẮT — `Mata saya kabur. Saya mau periksa mata dan buat kacamata.`. Nhớ ba điểm hay sai với người Việt: ba thủ thuật răng khác nhau — `cabut` (nhổ) ≠ `tambal` (trám) ≠ `bersihkan` (cạo vôi); `gigi` (răng) ≠ `gusi` (nướu) và `kabur` (mờ) ≠ `buta` (mù); và `optik` (tiệm kính) ≠ `apotek` (nhà thuốc). Bảo hiểm: hỏi `ditanggung BPJS?` (được chi trả không) — `ditanggung` ≠ `dibayar`. Phát âm: `c` = 'ch' (`cabut`, `kacamata`), `g` cứng (`gigi`); giữ giọng phẳng, không thanh điệu.",
    tip_advice_en:
      "Memorize two frames: TEETH — `Gigi saya sakit. Ada gigi berlubang. Apakah harus dicabut atau ditambal saja?`; EYES — `Mata saya kabur. Saya mau periksa mata dan buat kacamata.`. Keep three VN-speaker pitfalls straight: three distinct dental procedures — `cabut` (extract) ≠ `tambal` (fill) ≠ `bersihkan` (descale); `gigi` (tooth) ≠ `gusi` (gum) and `kabur` (blurry) ≠ `buta` (blind); and `optik` (optical shop) ≠ `apotek` (pharmacy). Insurance: ask `ditanggung BPJS?` (is it covered) — `ditanggung` ≠ `dibayar`. Pronunciation: `c` = 'ch' (`cabut`, `kacamata`), hard `g` (`gigi`); keep your pitch flat — no tones.",
    vocabulary: [
      // Dental
      {
        cell_id: "6b585bcc-d976-433e-835d-3ae61ea76ca9",
        word: "dokter gigi",
        en: "dentist",
        vi: "nha sĩ",
        pos: "noun",
        pronunciation_vi: "DOK-ter GI-gi — 'bác sĩ + răng'; viết tắt `drg.`",
        pronunciation_en: "DOK-ter GI-gi — 'doctor + tooth'; abbreviated `drg.`",
      },
      {
        cell_id: "a11206ef-4144-42f8-b2a3-bdbb827d9be7",
        word: "gigi",
        en: "tooth / teeth",
        vi: "răng",
        pos: "noun",
        pronunciation_vi: "GI-gi — `g` cứng cả hai; KHÁC `gusi` (nướu)",
        pronunciation_en: "GI-gi — hard `g` both times; NOT `gusi` (gum)",
      },
      {
        cell_id: "0bbb0cf6-4003-4d82-b8c8-ff6e78bb458e",
        word: "gusi",
        en: "gum (in the mouth)",
        vi: "nướu / lợi",
        pos: "noun",
        pronunciation_vi: "GU-si — `gusi berdarah` = chảy máu nướu",
        pronunciation_en: "GU-si — `gusi berdarah` = bleeding gums",
      },
      {
        cell_id: "4b745544-b9e9-4a1b-a1cf-f724da43da2f",
        word: "gigi berlubang",
        en: "cavity / decayed tooth",
        vi: "răng sâu",
        pos: "noun phrase",
        pronunciation_vi: "GI-gi ber-LU-bang — ber- + `lubang` (lỗ); KHÔNG nói `gigi lubang`",
        pronunciation_en: "GI-gi ber-LU-bang — ber- + `lubang` (hole); not `gigi lubang`",
      },
      {
        cell_id: "116b4c5a-bf16-4111-bee2-adcc8dfeafd4",
        word: "cabut",
        en: "to extract / pull out",
        vi: "nhổ (răng)",
        pos: "verb",
        pronunciation_vi: "CA-but — `c` = 'ch'; bị động `dicabut` (được nhổ)",
        pronunciation_en: "CHA-but — `c` = 'ch'; passive `dicabut` (be extracted)",
      },
      {
        cell_id: "85154738-be77-476d-b582-c319c925d2cd",
        word: "tambal",
        en: "to fill (a cavity)",
        vi: "trám (răng)",
        pos: "verb",
        pronunciation_vi: "TAM-bal — bị động `ditambal` (được trám); KHÁC `cabut`",
        pronunciation_en: "TAM-bal — passive `ditambal` (be filled); not `cabut`",
      },
      {
        cell_id: "26d901ef-1b2b-4f50-b285-517e42375a91",
        word: "karang gigi",
        en: "tartar / plaque",
        vi: "cao răng / vôi răng",
        pos: "noun",
        pronunciation_vi: "KA-rang GI-gi — `bersihkan karang gigi` / `scaling` = cạo vôi",
        pronunciation_en: "KA-rang GI-gi — `bersihkan karang gigi` / `scaling` = descaling",
      },
      // Eye
      {
        cell_id: "f1cfcf5b-cb27-4957-8e0f-4bce01ba5b80",
        word: "dokter mata",
        en: "eye doctor / ophthalmologist",
        vi: "bác sĩ mắt",
        pos: "noun",
        pronunciation_vi: "DOK-ter MA-ta — 'bác sĩ + mắt'",
        pronunciation_en: "DOK-ter MA-ta — 'doctor + eye'",
      },
      {
        cell_id: "2b213298-5d21-45ea-a240-340f77672c54",
        word: "mata",
        en: "eye",
        vi: "mắt",
        pos: "noun",
        pronunciation_vi: "MA-ta — `periksa mata` = khám mắt; `mata kabur` = mắt mờ",
        pronunciation_en: "MA-ta — `periksa mata` = eye exam; `mata kabur` = blurry eyes",
      },
      {
        cell_id: "6eba59f3-3ce4-4cb4-853b-ccead8b3d31d",
        word: "kabur",
        en: "blurry (vision)",
        vi: "mờ",
        pos: "adjective",
        pronunciation_vi: "KA-bur — nhìn không rõ; KHÁC `buta` (mù hẳn)",
        pronunciation_en: "KA-bur — unclear sight; NOT `buta` (fully blind)",
      },
      {
        cell_id: "64c82ed0-7e15-4bfb-94c1-583c1cf40f15",
        word: "kacamata",
        en: "eyeglasses",
        vi: "kính mắt",
        pos: "noun",
        pronunciation_vi: "ka-ca-MA-ta — MỘT từ; `c` = 'ch'; `buat kacamata` = làm kính",
        pronunciation_en: "ka-cha-MA-ta — ONE word; `c` = 'ch'; `buat kacamata` = to make glasses",
      },
      {
        cell_id: "a2fe261e-635e-4642-88cf-69fcc6acb376",
        word: "lensa",
        en: "lens",
        vi: "tròng kính",
        pos: "noun",
        pronunciation_vi: "LEN-sa — `lensa baru` = tròng mới; `bingkai`/`frame` = gọng",
        pronunciation_en: "LEN-sa — `lensa baru` = new lens; `bingkai`/`frame` = the frame",
      },
      {
        cell_id: "7cde2ecb-a2a1-4d05-99e2-0f661faed197",
        word: "optik",
        en: "optical shop / optician",
        vi: "tiệm kính",
        pos: "noun",
        pronunciation_vi: "OP-tik — bán `kacamata`; KHÁC `apotek` (nhà thuốc)",
        pronunciation_en: "OP-tik — sells `kacamata`; NOT `apotek` (pharmacy)",
      },
      // Insurance / admin
      {
        cell_id: "6dd26971-4e02-4a26-8cd6-de596f30dc67",
        word: "ditanggung",
        en: "covered / borne (by insurance)",
        vi: "được chi trả / bảo lãnh",
        pos: "verb",
        pronunciation_vi: "di-TANG-gung — bị động `di-`; `ditanggung BPJS` = BPJS chi trả",
        pronunciation_en: "di-TANG-gung — passive `di-`; `ditanggung BPJS` = covered by BPJS",
      },
      {
        cell_id: "a83e886a-86ff-43a9-b203-5da565e032ff",
        word: "klaim",
        en: "to claim (insurance)",
        vi: "yêu cầu chi trả bảo hiểm",
        pos: "verb",
        pronunciation_vi: "klaim — mượn tiếng Anh 'claim'; `klaim BPJS` = yêu cầu BPJS chi trả",
        pronunciation_en: "klaim — English loan 'claim'; `klaim BPJS` = file a BPJS claim",
      },
    ],
    dialogue: [
      // Dialogue: a dentist visit, ending with a BPJS question
      {
        cell_id: "73539dca-2c39-48dc-b46b-a35ca7b34ddc",
        speaker: "Dokter",
        text: "Selamat siang. Ada keluhan apa dengan gigi Anda?",
        vi: "Chào buổi trưa. Răng anh/chị có vấn đề gì ạ?",
        en: "Good afternoon. What's the problem with your teeth?",
      },
      {
        cell_id: "09c0fd16-58e7-429a-acb2-0b1c6fad2e30",
        speaker: "Pasien",
        text: "Gigi saya sakit sejak kemarin, Dok. Sepertinya ada gigi berlubang.",
        vi: "Răng tôi đau từ hôm qua. Hình như có cái răng sâu.",
        en: "My tooth has hurt since yesterday, doctor. I think there's a cavity.",
      },
      {
        cell_id: "73949d38-abae-41c6-a0ee-47956dfff5c5",
        speaker: "Dokter",
        text: "Mari saya periksa. Ya, ada lubang. Tapi masih bisa ditambal, tidak perlu dicabut.",
        vi: "Để tôi khám. Đúng rồi, có lỗ sâu. Nhưng vẫn trám được, không cần nhổ.",
        en: "Let me check. Yes, there's a hole. But it can still be filled — no need to extract it.",
      },
      {
        cell_id: "a9dd56bb-093e-487d-b1e1-1f24f662634c",
        speaker: "Pasien",
        text: "Syukurlah. Tolong bersihkan karang gigi saya juga, ya, Dok.",
        vi: "May quá. Nhờ bác cạo vôi răng giúp tôi luôn nhé.",
        en: "What a relief. Please descale my teeth too, doctor.",
      },
      {
        cell_id: "623acaee-1cbe-4a02-b1d8-980e764e070d",
        speaker: "Dokter",
        text: "Baik. Tambal dan bersihkan hari ini. Apakah Anda pakai BPJS?",
        vi: "Được. Hôm nay trám và cạo vôi. Anh/chị có dùng BPJS không?",
        en: "Okay. Filling and cleaning today. Do you use BPJS?",
      },
      {
        cell_id: "c11af669-1bd2-493f-b365-18f4f666596d",
        speaker: "Pasien",
        text: "Iya. Apakah tambal gigi ditanggung BPJS? Saya mau klaim.",
        vi: "Vâng. Trám răng có được BPJS chi trả không? Tôi muốn làm yêu cầu chi trả.",
        en: "Yes. Is a filling covered by BPJS? I'd like to claim.",
      },
      {
        cell_id: "1a9875a4-a9bc-440e-9bc8-f39eb69bf10c",
        speaker: "Dokter",
        text: "Tambal dan scaling ditanggung. Bawa kartu BPJS ke loket, ya.",
        vi: "Trám và cạo vôi được chi trả. Mang thẻ BPJS ra quầy nhé.",
        en: "Filling and scaling are covered. Bring your BPJS card to the counter.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Răng tôi đau từ hôm qua.", answer: "Gigi saya sakit sejak kemarin." },
          { prompt: "Có một cái răng sâu ở phía sau.", answer: "Ada gigi berlubang di belakang." },
          { prompt: "Cái răng này có phải nhổ không?", answer: "Apakah gigi ini harus dicabut?" },
          { prompt: "Tôi chỉ muốn trám răng thôi.", answer: "Saya mau gigi saya ditambal saja." },
          { prompt: "Tôi muốn đặt lịch hẹn với nha sĩ.", answer: "Saya mau buat janji dengan dokter gigi." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành khám mắt & bảo hiểm — dịch sang tiếng Indonesia:",
        instruction_en: "Eye-exam & insurance practice — translate into Indonesian:",
        items: [
          { prompt: "Mắt tôi mờ khi nhìn xa.", answer: "Mata saya kabur kalau melihat jauh." },
          { prompt: "Tôi muốn khám mắt và làm kính.", answer: "Saya mau periksa mata dan buat kacamata." },
          { prompt: "Tiệm kính gần nhất ở đâu?", answer: "Di mana optik terdekat?" },
          { prompt: "Trám răng có được BPJS chi trả không?", answer: "Apakah tambal gigi ditanggung BPJS?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `cabut`, `tambal`, hay `bersihkan` cho đúng thủ thuật:",
        instruction_en:
          "Choose `cabut`, `tambal`, or `bersihkan` for the right procedure:",
        items: [
          { prompt: "Gigi berlubang kecil → cukup di___ saja.", answer: "tambal", hint: "trám lỗ sâu" },
          { prompt: "Gigi rusak parah → harus di___.", answer: "cabut", hint: "nhổ răng" },
          { prompt: "Banyak karang gigi → tolong di___.", answer: "bersihkan", hint: "cạo vôi (làm sạch)" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn từ dễ nhầm cho đúng (`gigi`/`gusi`, `kabur`/`buta`, `optik`/`apotek`):",
        instruction_en:
          "Choose the right easily-confused word (`gigi`/`gusi`, `kabur`/`buta`, `optik`/`apotek`):",
        items: [
          { prompt: "___ saya berdarah waktu sikat gigi. (nướu)", answer: "Gusi", hint: "nướu = gusi" },
          { prompt: "Mata saya ___, tidak bisa baca jauh. (mờ)", answer: "kabur", hint: "mờ = kabur" },
          { prompt: "Saya beli kacamata di ___. (tiệm kính)", answer: "optik", hint: "tiệm kính = optik" },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra nha khoa & mắt — bạn làm được chưa?",
        instruction_en: "Dental & eye self-check — can you do each one?",
        items: [
          { vi: "Tôi mô tả được đau răng và răng sâu (`gigi berlubang`).", en: "I can describe a toothache and a cavity (`gigi berlubang`)." },
          { vi: "Tôi phân biệt `cabut` (nhổ), `tambal` (trám), `bersihkan` (cạo vôi).", en: "I distinguish `cabut`, `tambal`, and `bersihkan`." },
          { vi: "Tôi phân biệt `gigi`/`gusi` và `kabur`/`buta`.", en: "I distinguish `gigi`/`gusi` and `kabur`/`buta`." },
          { vi: "Tôi biết khám mắt và làm kính (`periksa mata`, `buat kacamata`).", en: "I can ask for an eye exam and glasses (`periksa mata`, `buat kacamata`)." },
          { vi: "Tôi không nhầm `optik` (tiệm kính) với `apotek` (nhà thuốc).", en: "I don't confuse `optik` (optical shop) with `apotek` (pharmacy)." },
          { vi: "Tôi hỏi được `ditanggung BPJS?` và biết `klaim`.", en: "I can ask `ditanggung BPJS?` and know how to `klaim`." },
        ],
      },
    ],
  },
];

export default lessons;
