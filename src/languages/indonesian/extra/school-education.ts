// School & Education Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker, healthcare-emergency,
// restaurant-hospitality), which in turn mirror the French `FrenchLesson` shape.
// When the shared Indonesian registry (src/languages/indonesian/lessons.ts) lands,
// swap the local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Indonesian is written in Latin script and is largely phonetic. For Vietnamese
// speakers the big WINS are: no grammatical gender, no verb conjugation, no tones,
// no articles. The traps in this topic are: the affix system around `daftar`
// (mendaftar = to register, pendaftaran = registration, pe-...-an), `c` read as
// "ch" (`pencatatan` = "pen-cha-..."), and word-final consonants that must be
// sounded (`rapor`, `nilai`, `murid`).

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
    id: "indonesian_school_education",
    level: "B1",
    category: "education",
    title_vi: "Trường học và giáo dục",
    title_en: "School and education",
    sentences: [
      // ── Registration / enrolling a child ──────────────────────────────────
      {
        en: "Saya ingin mendaftarkan anak saya di sekolah ini.",
        vi: "Tôi muốn đăng ký cho con tôi vào trường này.",
        pronunciation_focus: [
          "SA-ya I-ngin men-DAF-tar-kan A-nak SA-ya di se-KO-lah I-ni — `mendaftarkan` = đăng ký (cho ai).",
          "Lợi thế người Việt: không chia động từ — `ingin` (muốn) + động từ nguyên dạng là xong.",
          "Lỗi người Việt: dùng `daftar` trơ. Khi đăng ký CHO con, cần tiền tố/hậu tố: `men-daftar-kan`.",
          "Luyện: `Saya ingin mendaftarkan anak saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin men-DAF-tar-kan A-nak SA-ya di se-KO-lah I-ni — `mendaftarkan` = to register (someone).",
          "VN-speaker win: no conjugation — `ingin` (want) + bare verb and you're done.",
          "VN-speaker trap: using bare `daftar`. To register SOMEONE you need the affixes: `men-daftar-kan`.",
          "Drill: `Saya ingin mendaftarkan anak saya.`",
        ],
      },
      {
        en: "Kapan pendaftaran siswa baru dibuka?",
        vi: "Khi nào mở đăng ký học sinh mới?",
        pronunciation_focus: [
          "KA-pan pen-daf-TA-ran SIS-wa BA-ru di-BU-ka — `pendaftaran` = sự đăng ký (danh từ).",
          "Mẹo affix: cùng gốc `daftar`: `mendaftar` (đăng ký), `pendaftaran` (việc đăng ký), `daftar` (danh sách).",
          "Lỗi người Việt: nói `kapan buka daftar`. Câu chuẩn: `kapan pendaftaran dibuka`.",
          "Luyện: `Kapan pendaftaran dibuka?`",
        ],
        pronunciation_focus_en: [
          "KA-pan pen-daf-TA-ran SIS-wa BA-ru di-BU-ka — `pendaftaran` = the registration (noun).",
          "Affix tip: one root `daftar` → `mendaftar` (to register), `pendaftaran` (registration), `daftar` (a list).",
          "VN-speaker trap: saying `kapan buka daftar`. Standard: `kapan pendaftaran dibuka`.",
          "Drill: `Kapan pendaftaran dibuka?`",
        ],
      },
      {
        en: "Dokumen apa saja yang diperlukan?",
        vi: "Cần những giấy tờ gì?",
        pronunciation_focus: [
          "DO-ku-men A-pa SA-ja yang di-per-LU-kan — `apa saja` = những gì (số nhiều); `diperlukan` = được cần đến.",
          "Mẹo: `apa saja` mở danh sách — đáp lại bằng nhiều món, không phải một.",
          "Lỗi người Việt: bỏ `saja`, hỏi `dokumen apa` (nghe như chỉ MỘT thứ). Thêm `saja` để hỏi cả danh sách.",
          "Luyện: `Dokumen apa saja yang diperlukan?`",
        ],
        pronunciation_focus_en: [
          "DO-ku-men A-pa SA-ja yang di-per-LU-kan — `apa saja` = what (all of them); `diperlukan` = is required.",
          "Tip: `apa saja` opens a list — expect to answer with several items, not one.",
          "VN-speaker trap: dropping `saja` and asking `dokumen apa` (sounds like just ONE). Add `saja` for the whole list.",
          "Drill: `Dokumen apa saja yang diperlukan?`",
        ],
      },
      {
        en: "Anak saya sekarang kelas lima SD.",
        vi: "Con tôi hiện đang học lớp năm tiểu học.",
        pronunciation_focus: [
          "A-nak SA-ya se-ka-RANG KE-las LI-ma es-de — `kelas lima` = lớp năm; `SD` đọc 'es-de'.",
          "Mẹo hệ thống: `SD` (tiểu học) → `SMP` (cấp 2) → `SMA` (cấp 3). Học 3 chữ này là đủ định vị.",
          "Lỗi người Việt: nói `lima kelas` (= năm lớp học). Đúng thứ tự: số đứng SAU — `kelas lima`.",
          "Luyện: `Anak saya kelas lima SD.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya se-ka-RANG KE-las LI-ma es-de — `kelas lima` = grade five; spell `SD` as 'es-de'.",
          "System tip: `SD` (primary) → `SMP` (junior high) → `SMA` (senior high). Those three letters place any student.",
          "VN-speaker trap: saying `lima kelas` (= five classrooms). Correct order: number AFTER — `kelas lima`.",
          "Drill: `Anak saya kelas lima SD.`",
        ],
      },
      // ── Exams, grades, homework ───────────────────────────────────────────
      {
        en: "Ujian akhir semester minggu depan.",
        vi: "Kỳ thi cuối học kỳ tuần sau.",
        pronunciation_focus: [
          "U-ji-an A-khir se-MES-ter MING-gu de-PAN — `ujian` = kỳ thi; `minggu depan` = tuần sau.",
          "Mẹo: `depan` (phía trước) cũng nghĩa 'sau/tới' khi nói thời gian: `bulan depan` (tháng sau).",
          "Lỗi người Việt: đọc `kh` trong `akhir` thành 'kh' nặng. Ở đây `kh` ≈ 'k' nhẹ: A-khir.",
          "Luyện: `Ujian akhir semester minggu depan.`",
        ],
        pronunciation_focus_en: [
          "U-ji-an A-khir se-MES-ter MING-gu de-PAN — `ujian` = exam; `minggu depan` = next week.",
          "Tip: `depan` (front) also means 'next/upcoming' for time: `bulan depan` (next month).",
          "VN-speaker trap: over-rasping the `kh` in `akhir`. Here `kh` ≈ a light 'k': A-khir.",
          "Drill: `Ujian akhir semester minggu depan.`",
        ],
      },
      {
        en: "Nilai matematika anak saya sudah bagus.",
        vi: "Điểm môn toán của con tôi đã tốt rồi.",
        pronunciation_focus: [
          "NI-lai ma-te-MA-ti-ka A-nak SA-ya SU-dah BA-gus — `nilai` = điểm số; `sudah` = đã/rồi.",
          "Mẹo người Việt: `sudah` y hệt 'rồi' tiếng Việt — đặt trước tính từ/động từ: `sudah bagus` (đã tốt rồi).",
          "Lỗi người Việt: bỏ `r` cuối trong `bagus`? Không — `bagus` không có `r`; nhưng đọc rõ `s` cuối.",
          "Luyện: `Nilai anak saya sudah bagus.`",
        ],
        pronunciation_focus_en: [
          "NI-lai ma-te-MA-ti-ka A-nak SA-ya SU-dah BA-gus — `nilai` = grade/score; `sudah` = already.",
          "VN-speaker tip: `sudah` maps onto Vietnamese 'rồi' — place it before the word: `sudah bagus` (already good).",
          "VN-speaker trap: swallowing the final `s` in `bagus`. Sound it clearly: BA-gus.",
          "Drill: `Nilai anak saya sudah bagus.`",
        ],
      },
      {
        en: "Anak saya belum mengerjakan PR-nya.",
        vi: "Con tôi chưa làm bài tập về nhà.",
        pronunciation_focus: [
          "A-nak SA-ya be-LUM me-nger-JA-kan pe-er-nya — `belum` = chưa; `PR` = bài tập về nhà (đọc 'pe-er').",
          "Mẹo người Việt: `belum` (chưa) ≠ `tidak` (không). Việc chưa xong → `belum`, không phải `tidak`.",
          "Lỗi người Việt: trả lời `tidak` khi cô giáo hỏi `Sudah?`. Đúng phải là `belum` (chưa).",
          "Luyện: `Anak saya belum mengerjakan PR.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya be-LUM me-nger-JA-kan pe-er-nya — `belum` = not yet; `PR` = homework (say 'pe-er').",
          "VN-speaker tip: `belum` (not yet) ≠ `tidak` (not). An unfinished task → `belum`, never `tidak`.",
          "VN-speaker trap: answering `tidak` when the teacher asks `Sudah?`. The right answer is `belum`.",
          "Drill: `Anak saya belum mengerjakan PR.`",
        ],
      },
      // ── Parent–teacher meeting ────────────────────────────────────────────
      {
        en: "Saya ingin bertemu wali kelas anak saya.",
        vi: "Tôi muốn gặp giáo viên chủ nhiệm của con tôi.",
        pronunciation_focus: [
          "SA-ya I-ngin ber-TE-mu WA-li KE-las A-nak SA-ya — `wali kelas` = giáo viên chủ nhiệm.",
          "Mẹo affix: `bertemu` = gặp nhau (`ber-` chỉ hành động qua lại); `temu` là gốc.",
          "Lỗi người Việt: nói `saya mau temu`. Cần `ber-`: `bertemu`.",
          "Luyện: `Saya ingin bertemu wali kelas.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin ber-TE-mu WA-li KE-las A-nak SA-ya — `wali kelas` = homeroom teacher.",
          "Affix tip: `bertemu` = to meet (`ber-` marks a mutual action); the root is `temu`.",
          "VN-speaker trap: saying `saya mau temu`. You need `ber-`: `bertemu`.",
          "Drill: `Saya ingin bertemu wali kelas.`",
        ],
      },
      {
        en: "Bagaimana perkembangan anak saya di sekolah?",
        vi: "Con tôi tiến bộ ở trường như thế nào?",
        pronunciation_focus: [
          "ba-gai-MA-na per-kem-BANG-an A-nak SA-ya di se-KO-lah — `perkembangan` = sự phát triển/tiến bộ.",
          "Mẹo affix: gốc `kembang` (nở/phát triển) → `perkembangan` (sự phát triển) qua khung `per-...-an`.",
          "Lỗi người Việt: ngắt `bagaimana` thành 'ba-gai-ma-na' rời rạc; đọc liền, nhấn MA.",
          "Luyện: `Bagaimana perkembangan anak saya?`",
        ],
        pronunciation_focus_en: [
          "ba-gai-MA-na per-kem-BANG-an A-nak SA-ya di se-KO-lah — `perkembangan` = development/progress.",
          "Affix tip: root `kembang` (to bloom/develop) → `perkembangan` (development) via the `per-...-an` frame.",
          "VN-speaker trap: chopping `bagaimana` into pieces; say it smoothly, stress on MA.",
          "Drill: `Bagaimana perkembangan anak saya?`",
        ],
      },
      // ── University & fees ─────────────────────────────────────────────────
      {
        en: "Universitas itu menerima mahasiswa baru bulan Juli.",
        vi: "Trường đại học đó nhận sinh viên mới vào tháng Bảy.",
        pronunciation_focus: [
          "u-ni-ver-SI-tas I-tu me-ne-RI-ma ma-ha-SIS-wa BA-ru BU-lan JU-li — `mahasiswa` = sinh viên (đại học).",
          "Mẹo phân biệt: `siswa` = học sinh (phổ thông); `mahasiswa` = sinh viên (đại học). `maha-` = 'đại/lớn'.",
          "Lỗi người Việt: gọi sinh viên đại học là `siswa`. Đại học → `mahasiswa`.",
          "Luyện: `Universitas itu menerima mahasiswa baru.`",
        ],
        pronunciation_focus_en: [
          "u-ni-ver-SI-tas I-tu me-ne-RI-ma ma-ha-SIS-wa BA-ru BU-lan JU-li — `mahasiswa` = university student.",
          "Distinction tip: `siswa` = a school pupil; `mahasiswa` = a university student. `maha-` = 'great/higher'.",
          "VN-speaker trap: calling a uni student `siswa`. University → `mahasiswa`.",
          "Drill: `Universitas itu menerima mahasiswa baru.`",
        ],
      },
      {
        en: "Berapa biaya SPP per bulan?",
        vi: "Học phí mỗi tháng bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya es-pe-pe per BU-lan — `biaya` = chi phí; `SPP` = học phí hàng tháng (đọc 'es-pe-pe').",
          "Mẹo: `berapa` hỏi SỐ LƯỢNG/GIÁ; khác `apa` (cái gì). Hỏi tiền luôn dùng `berapa`.",
          "Lỗi người Việt: hỏi `apa biaya` cho giá. Hỏi giá phải là `berapa biaya`.",
          "Luyện: `Berapa biaya SPP per bulan?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa BI-a-ya es-pe-pe per BU-lan — `biaya` = cost/fee; `SPP` = the monthly tuition (say 'es-pe-pe').",
          "Tip: `berapa` asks HOW MUCH/MANY; different from `apa` (what). Prices always take `berapa`.",
          "VN-speaker trap: asking `apa biaya` for a price. Use `berapa biaya` to ask the cost.",
          "Drill: `Berapa biaya SPP per bulan?`",
        ],
      },
      {
        en: "Apakah ada beasiswa untuk anak yang kurang mampu?",
        vi: "Có học bổng cho trẻ em hoàn cảnh khó khăn không?",
        pronunciation_focus: [
          "A-pa-kah A-da be-a-SIS-wa UN-tuk A-nak yang KU-rang MAM-pu — `beasiswa` = học bổng; `kurang mampu` = khó khăn.",
          "Mẹo: `apakah` mở câu hỏi Có/Không lịch sự; khẩu ngữ rút thành `apa` hoặc bỏ luôn.",
          "Lỗi người Việt: đọc `beasiswa` thành 'bia-siswa'; đúng là 'be-a-SIS-wa', `e` và `a` tách rời.",
          "Luyện: `Apakah ada beasiswa?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah A-da be-a-SIS-wa UN-tuk A-nak yang KU-rang MAM-pu — `beasiswa` = scholarship; `kurang mampu` = less able / low-income.",
          "Tip: `apakah` politely opens a yes/no question; in speech it shrinks to `apa` or is dropped.",
          "VN-speaker trap: reading `beasiswa` as 'bia-siswa'; it's 'be-a-SIS-wa', the `e` and `a` are separate.",
          "Drill: `Apakah ada beasiswa?`",
        ],
      },
    ],
    vocabulary: [
      // People & places
      {
        cell_id: "fdec6c28-b914-461b-bdb7-9e46dc2213fd",
        word: "sekolah",
        en: "school",
        vi: "trường học",
        pos: "noun",
        pronunciation_vi: "se-KO-lah — `e` đầu đọc nhẹ như 'ơ'; đọc rõ `h` cuối",
        pronunciation_en: "se-KO-lah — schwa first `e`; lightly sound the final `h`",
      },
      {
        cell_id: "2f6b53cc-b970-4a7d-a443-3db5a789122d",
        word: "universitas",
        en: "university",
        vi: "trường đại học",
        pos: "noun",
        pronunciation_vi: "u-ni-ver-SI-tas — mượn tiếng Hà Lan; nhấn 'SI'",
        pronunciation_en: "u-ni-ver-SI-tas — Dutch loanword; stress on 'SI'",
      },
      {
        cell_id: "c8b92ee8-94a1-4917-b918-b7ae95072071",
        word: "guru",
        en: "teacher",
        vi: "giáo viên / thầy cô",
        pos: "noun",
        pronunciation_vi: "GU-ru — gọi lịch sự kèm tên: `Bu Guru`, `Pak Guru`",
        pronunciation_en: "GU-ru — polite address with a name: `Bu Guru`, `Pak Guru`",
      },
      {
        cell_id: "56bd929b-9ca5-482d-b3fd-e2e2611a23ac",
        word: "wali kelas",
        en: "homeroom / form teacher",
        vi: "giáo viên chủ nhiệm",
        pos: "noun",
        pronunciation_vi: "WA-li KE-las — `wali` = người giám hộ/phụ trách",
        pronunciation_en: "WA-li KE-las — `wali` = guardian/the one in charge",
      },
      {
        cell_id: "85c17c63-3ad8-47ab-b2b0-9c8486b8c13a",
        word: "kepala sekolah",
        en: "principal / headmaster",
        vi: "hiệu trưởng",
        pos: "noun",
        pronunciation_vi: "ke-PA-la se-KO-lah — `kepala` (đầu) = người đứng đầu",
        pronunciation_en: "ke-PA-la se-KO-lah — `kepala` (head) = the one at the top",
      },
      {
        cell_id: "0298858b-2031-47b8-84c4-e08b764c9a45",
        word: "siswa / murid",
        en: "pupil / student (school)",
        vi: "học sinh",
        pos: "noun",
        pronunciation_vi: "SIS-wa / MU-rid — đọc rõ `d` cuối ở `murid`",
        pronunciation_en: "SIS-wa / MU-rid — sound the final `d` in `murid`",
      },
      {
        cell_id: "ce6267d8-d3e5-43c4-9aba-c9cca5718e43",
        word: "mahasiswa",
        en: "university student",
        vi: "sinh viên",
        pos: "noun",
        pronunciation_vi: "ma-ha-SIS-wa — `maha-` = đại/lớn; phân biệt với `siswa`",
        pronunciation_en: "ma-ha-SIS-wa — `maha-` = great/higher; contrast with `siswa`",
      },
      {
        cell_id: "b84b2cef-651e-4bb0-886b-9638fd0a1f6c",
        word: "ruang kelas",
        en: "classroom",
        vi: "phòng học / lớp học",
        pos: "noun",
        pronunciation_vi: "RU-ang KE-las — `ruang` = phòng/không gian",
        pronunciation_en: "RU-ang KE-las — `ruang` = room/space",
      },
      {
        cell_id: "8c648bd3-f3f5-4d6c-9005-28c11d958739",
        word: "perpustakaan",
        en: "library",
        vi: "thư viện",
        pos: "noun",
        pronunciation_vi: "per-pus-ta-KA-an — dài nhưng đều; gốc `pustaka` (sách)",
        pronunciation_en: "per-pus-ta-KA-an — long but even; root `pustaka` (books)",
      },
      // Registration & documents
      {
        cell_id: "98da005d-ee16-4c4a-858d-dabc622014e3",
        word: "pendaftaran",
        en: "registration / enrollment",
        vi: "việc đăng ký / ghi danh",
        pos: "noun",
        pronunciation_vi: "pen-daf-TA-ran — gốc `daftar` qua khung `pe-...-an`",
        pronunciation_en: "pen-daf-TA-ran — root `daftar` via the `pe-...-an` frame",
      },
      {
        cell_id: "fb35ac07-b57f-4f23-a01a-9a3897c5a816",
        word: "mendaftar",
        en: "to register / sign up",
        vi: "đăng ký",
        pos: "verb",
        pronunciation_vi: "men-DAF-tar — `mendaftarkan` = đăng ký cho người khác",
        pronunciation_en: "men-DAF-tar — `mendaftarkan` = to register someone else",
      },
      {
        cell_id: "5dd335ac-dec6-44d6-8401-68b41c917ef1",
        word: "formulir",
        en: "form (to fill in)",
        vi: "đơn / mẫu đơn",
        pos: "noun",
        pronunciation_vi: "for-mu-LIR — mượn tiếng Hà Lan; đọc rõ `r` cuối",
        pronunciation_en: "for-mu-LIR — Dutch loanword; sound the final `r`",
      },
      {
        cell_id: "b0425a8b-dd72-42e3-8865-9a2d6f60588b",
        word: "akta kelahiran",
        en: "birth certificate",
        vi: "giấy khai sinh",
        pos: "noun",
        pronunciation_vi: "AK-ta ke-la-HI-ran — giấy tờ bắt buộc khi nhập học",
        pronunciation_en: "AK-ta ke-la-HI-ran — a required document for enrollment",
      },
      {
        cell_id: "eafe3eb4-a892-4fba-bcdd-1fa61e0dd0e8",
        word: "rapor",
        en: "report card",
        vi: "học bạ / phiếu điểm",
        pos: "noun",
        pronunciation_vi: "RA-por — đọc rõ `r` cuối; phát mỗi cuối học kỳ",
        pronunciation_en: "RA-por — sound the final `r`; handed out each term",
      },
      {
        cell_id: "77275510-b6c6-4a7b-a4b0-f2ad475802db",
        word: "seragam",
        en: "uniform",
        vi: "đồng phục",
        pos: "noun",
        pronunciation_vi: "se-RA-gam — `e` đầu nhẹ như 'ơ'",
        pronunciation_en: "se-RA-gam — schwa first `e`",
      },
      // Academics
      {
        cell_id: "378389c4-2ba2-4916-aefe-9b3772301294",
        word: "mata pelajaran",
        en: "school subject",
        vi: "môn học",
        pos: "noun",
        pronunciation_vi: "MA-ta pe-la-JA-ran — gọi tắt `mapel`; gốc `ajar` (dạy)",
        pronunciation_en: "MA-ta pe-la-JA-ran — short form `mapel`; root `ajar` (to teach)",
      },
      {
        cell_id: "a79da925-c466-4a6c-9245-2e46abd24f0b",
        word: "ujian",
        en: "exam / test",
        vi: "kỳ thi / bài kiểm tra",
        pos: "noun",
        pronunciation_vi: "U-ji-an — `ulangan` = bài kiểm tra nhỏ trên lớp",
        pronunciation_en: "U-ji-an — `ulangan` = a small in-class quiz",
      },
      {
        cell_id: "beb1fb8c-9249-4aa4-9302-a0e0bbf50380",
        word: "nilai",
        en: "grade / score / mark",
        vi: "điểm số",
        pos: "noun",
        pronunciation_vi: "NI-lai — cũng nghĩa 'giá trị'; `nilai bagus` = điểm tốt",
        pronunciation_en: "NI-lai — also means 'value'; `nilai bagus` = a good grade",
      },
      {
        cell_id: "5e79f31a-b3eb-4cb3-a0fe-9c4a144b3a87",
        word: "PR (pekerjaan rumah)",
        en: "homework",
        vi: "bài tập về nhà",
        pos: "noun",
        pronunciation_vi: "pe-er — đọc tên hai chữ cái; viết tắt rất thông dụng",
        pronunciation_en: "pe-er — say the two letters; a very common abbreviation",
      },
      {
        cell_id: "f973586f-6836-4241-9872-c77f3db39ffd",
        word: "semester",
        en: "semester / term",
        vi: "học kỳ",
        pos: "noun",
        pronunciation_vi: "se-MES-ter — `semester ganjil/genap` = học kỳ lẻ/chẵn",
        pronunciation_en: "se-MES-ter — `semester ganjil/genap` = odd/even term",
      },
      {
        cell_id: "0f48ae90-a10f-4bdf-b7b6-e35c24ced9a1",
        word: "jurusan",
        en: "major / study track",
        vi: "ngành / ban học",
        pos: "noun",
        pronunciation_vi: "ju-RU-san — chọn ở cấp 3 (IPA/IPS) và đại học",
        pronunciation_en: "ju-RU-san — chosen in senior high (IPA/IPS) and at university",
      },
      {
        cell_id: "1c98f3db-9f72-41c3-a754-0c22252197dd",
        word: "beasiswa",
        en: "scholarship",
        vi: "học bổng",
        pos: "noun",
        pronunciation_vi: "be-a-SIS-wa — `e` và `a` tách rời, không thành 'bia'",
        pronunciation_en: "be-a-SIS-wa — `e` and `a` stay separate, not 'bia'",
      },
      // Fees & assistance
      {
        cell_id: "4fbe73e7-36d8-4259-a041-26763052e056",
        word: "biaya sekolah / SPP",
        en: "school fees / monthly tuition",
        vi: "học phí",
        pos: "noun",
        pronunciation_vi: "BI-a-ya / es-pe-pe — `SPP` đọc tên ba chữ cái",
        pronunciation_en: "BI-a-ya / es-pe-pe — spell `SPP` letter by letter",
      },
      {
        cell_id: "bff957f6-d7af-462b-a514-9e12b96af73c",
        word: "KIP (Kartu Indonesia Pintar)",
        en: "the 'Smart Indonesia' student aid card",
        vi: "thẻ hỗ trợ học tập KIP",
        pos: "noun",
        pronunciation_vi: "kip — trợ cấp học cho hộ khó khăn (tên thật, không phải 'BPJS Pendidikan')",
        pronunciation_en: "kip — study aid for low-income families (the real program name, not 'BPJS Pendidikan')",
      },
      {
        cell_id: "dad24e70-0f6f-434e-a16d-020a83f007de",
        word: "dana BOS",
        en: "school operational assistance fund",
        vi: "quỹ hỗ trợ hoạt động trường (BOS)",
        pos: "noun",
        pronunciation_vi: "DA-na bos — chính phủ cấp cho trường, giảm gánh học phí",
        pronunciation_en: "DA-na bos — government funding to schools that eases fees",
      },
    ],
    dialogue: [
      // Parent meets the homeroom teacher
      {
        cell_id: "62daf574-55fd-4402-af63-05f3b3efec27",
        speaker: "Orang tua",
        text: "Selamat siang, Bu. Saya ibu dari Linh, murid kelas lima.",
        vi: "Chào cô buổi chiều. Tôi là mẹ của Linh, học sinh lớp năm.",
        en: "Good afternoon, ma'am. I'm Linh's mother, the fifth-grade pupil.",
      },
      {
        cell_id: "e875e36f-e80f-4f98-9257-9cba257c21ea",
        speaker: "Wali kelas",
        text: "Selamat siang, Bu. Silakan duduk. Ada yang bisa saya bantu?",
        vi: "Chào chị buổi chiều. Mời ngồi. Tôi có thể giúp gì ạ?",
        en: "Good afternoon. Please sit. How can I help you?",
      },
      {
        cell_id: "049cf4a5-918d-4b6c-b446-157783a93606",
        speaker: "Orang tua",
        text: "Saya ingin tahu bagaimana perkembangan anak saya di sekolah.",
        vi: "Tôi muốn biết con tôi tiến bộ ở trường như thế nào.",
        en: "I'd like to know how my child is progressing at school.",
      },
      {
        cell_id: "410d6ec7-af91-4363-bf10-7683d8e3123a",
        speaker: "Wali kelas",
        text: "Nilainya sudah bagus, tapi dia belum mengerjakan beberapa PR.",
        vi: "Điểm của cháu đã tốt rồi, nhưng cháu chưa làm một vài bài tập về nhà.",
        en: "Her grades are already good, but she hasn't done several homework assignments.",
      },
      {
        cell_id: "b79639a4-390c-40cb-a65c-78c3d574994f",
        speaker: "Orang tua",
        text: "Oh, begitu. Di rumah saya akan ingatkan dia setiap sore.",
        vi: "Ồ, vậy à. Ở nhà tôi sẽ nhắc cháu mỗi buổi chiều.",
        en: "Oh, I see. At home I'll remind her every afternoon.",
      },
      {
        cell_id: "96ca1158-c586-40aa-b745-f44be660fe6f",
        speaker: "Wali kelas",
        text: "Bagus. Oh ya, pendaftaran ujian akhir dibuka minggu depan.",
        vi: "Tốt. À đúng rồi, đăng ký thi cuối kỳ mở vào tuần sau.",
        en: "Good. Oh, and registration for the final exam opens next week.",
      },
      {
        cell_id: "fa756333-2241-47c3-ab69-2178449ae4fb",
        speaker: "Orang tua",
        text: "Baik, Bu. Dokumen apa saja yang perlu saya siapkan?",
        vi: "Vâng, thưa cô. Tôi cần chuẩn bị những giấy tờ gì?",
        en: "Alright. Which documents do I need to prepare?",
      },
      {
        cell_id: "2fb32b53-0e48-4c54-a532-048ec7a873f0",
        speaker: "Wali kelas",
        text: "Cukup rapor semester lalu dan formulir ini. Terima kasih, Bu.",
        vi: "Chỉ cần học bạ học kỳ trước và mẫu đơn này. Cảm ơn chị.",
        en: "Just last term's report card and this form. Thank you, ma'am.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đăng ký cho con tôi.", answer: "Saya ingin mendaftarkan anak saya." },
          { prompt: "Khi nào mở đăng ký?", answer: "Kapan pendaftaran dibuka?" },
          { prompt: "Con tôi chưa làm bài tập về nhà.", answer: "Anak saya belum mengerjakan PR." },
          { prompt: "Học phí mỗi tháng bao nhiêu?", answer: "Berapa biaya SPP per bulan?" },
          { prompt: "Tôi muốn gặp giáo viên chủ nhiệm.", answer: "Saya ingin bertemu wali kelas." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Cần những giấy tờ gì?", answer: "Dokumen apa saja yang diperlukan?" },
          { prompt: "Điểm của cháu đã tốt rồi.", answer: "Nilainya sudah bagus." },
          { prompt: "Kỳ thi cuối kỳ vào tuần sau.", answer: "Ujian akhir semester minggu depan." },
          { prompt: "Có học bổng không?", answer: "Apakah ada beasiswa?" },
          { prompt: "Con tôi học lớp năm tiểu học.", answer: "Anak saya kelas lima SD." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `tidak`, `belum`, hay `sudah` cho đúng (không / chưa / đã rồi):",
        instruction_en:
          "Fill in `tidak`, `belum`, or `sudah` (not / not yet / already):",
        items: [
          { prompt: "Anak saya ___ mengerjakan PR, masih di kamar.", answer: "belum", hint: "việc chưa xong = chưa" },
          { prompt: "Nilainya ___ bagus, saya senang.", answer: "sudah", hint: "đã đạt rồi = rồi" },
          { prompt: "Dia ___ malas, hanya lupa.", answer: "tidak", hint: "phủ định tính chất = không" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn đúng dạng affix của gốc `daftar`:",
        instruction_en:
          "Pick the correct affixed form of the root `daftar`:",
        items: [
          { prompt: "Saya ingin ___ anak saya. (đăng ký CHO con)", answer: "mendaftarkan", hint: "men-...-kan = làm cho ai" },
          { prompt: "Kapan ___ dibuka? (việc đăng ký)", answer: "pendaftaran", hint: "pe-...-an = danh từ" },
          { prompt: "Saya mau ___ sendiri. (tự đăng ký)", answer: "mendaftar", hint: "men- = tự làm" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung trao đổi với giáo viên — điền chỗ trống: `Saya ibu/bapak dari ___. Anak saya kelas ___. Nilainya ___, tapi dia ___ mengerjakan ___.`",
        instruction_en:
          "Parent–teacher frame — fill the blanks: `Saya ibu/bapak dari ___. Anak saya kelas ___. Nilainya ___, tapi dia ___ mengerjakan ___.`",
        example:
          "Saya ibu dari Linh. Anak saya kelas lima. Nilainya sudah bagus, tapi dia belum mengerjakan PR.",
        example_vi:
          "Tôi là mẹ của Linh. Con tôi học lớp năm. Điểm cháu đã tốt rồi, nhưng cháu chưa làm bài tập về nhà.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn nói được những việc trường lớp này chưa?",
        instruction_en: "Self-check — can you handle each school task?",
        items: [
          { vi: "Tôi có thể đăng ký cho con vào trường.", en: "I can enroll my child in a school." },
          { vi: "Tôi có thể hỏi cần giấy tờ gì.", en: "I can ask which documents are needed." },
          { vi: "Tôi có thể hỏi học phí mỗi tháng.", en: "I can ask the monthly tuition." },
          { vi: "Tôi phân biệt được `belum` (chưa) và `tidak` (không).", en: "I can tell `belum` (not yet) from `tidak` (not)." },
          { vi: "Tôi phân biệt được `siswa` và `mahasiswa`.", en: "I can tell `siswa` from `mahasiswa`." },
          { vi: "Tôi có thể trao đổi với giáo viên chủ nhiệm.", en: "I can talk with the homeroom teacher." },
        ],
      },
    ],
    cultural_notes_vi:
      "Hệ thống trường Indonesia: `SD` (tiểu học, 6 năm) → `SMP` (cấp 2, 3 năm) → `SMA`/`SMK` (cấp 3 phổ thông/nghề) → `universitas`. Trường công gọi là `negeri`, trường tư là `swasta`. Lưu ý quan trọng: brief ghi 'BPJS Pendidikan' nhưng thực tế BPJS là bảo hiểm Y TẾ và lao động, KHÔNG phải giáo dục. Hỗ trợ học tập thật sự tên là `KIP` (Kartu Indonesia Pintar) cho hộ khó khăn và quỹ `BOS` (Bantuan Operasional Sekolah) cấp cho trường. Khi nói chuyện với giáo viên, luôn dùng `Bu`/`Pak` + tên và đại từ `saya` (không dùng `aku`).",
    cultural_notes_en:
      "Indonesia's school ladder: `SD` (primary, 6 years) → `SMP` (junior high, 3 years) → `SMA`/`SMK` (academic/vocational senior high) → `universitas`. Public schools are `negeri`, private ones `swasta`. Important accuracy note: the brief said 'BPJS Pendidikan', but BPJS actually covers HEALTH and employment, not education. The real student-aid programs are `KIP` (Kartu Indonesia Pintar) for low-income families and the `BOS` operational fund paid to schools. When speaking with teachers, always use `Bu`/`Pak` + name and the pronoun `saya` (never `aku`).",
    tip_advice_vi:
      "Học nguyên cụm `daftar` để nắm hệ thống affix — chỉ một gốc mà ra cả họ từ: `daftar` (danh sách) → `mendaftar` (tự đăng ký) → `mendaftarkan` (đăng ký cho ai) → `pendaftaran` (việc đăng ký) → `terdaftar` (đã được ghi danh). Nắm khung `men-...-kan` (làm cho ai) và `pe-...-an` (danh từ chỉ quá trình) thì áp được sang trăm gốc khác. Và nhớ cặp `belum` (chưa) ↔ `sudah` (rồi): khi cô giáo hỏi `Sudah mengerjakan PR?`, trả lời `Sudah` hoặc `Belum`, đừng bao giờ dùng `tidak`.",
    tip_advice_en:
      "Learn the whole `daftar` family to internalize the affix system — one root spawns a cluster: `daftar` (a list) → `mendaftar` (to register oneself) → `mendaftarkan` (to register someone) → `pendaftaran` (the registration) → `terdaftar` (registered/enrolled). Master the `men-...-kan` (do-for-someone) and `pe-...-an` (process noun) frames and you can decode hundreds of other roots. And drill the `belum` (not yet) ↔ `sudah` (already) pair: when a teacher asks `Sudah mengerjakan PR?`, answer `Sudah` or `Belum` — never `tidak`.",
  },
];

export default lessons;
