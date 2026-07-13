// Construction Worker Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling Italian `extra/*` files (which in turn mirror the
// French `FrenchLesson` shape). When the shared Indonesian registry
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
// no articles. The traps are: `c` is read "ch" (cat = "chat"), `jangan` (not
// `tidak`) for negative commands, word-final consonants must be pronounced, and
// the affix system (meN-, ber-, -kan, -an).

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
    id: "indonesian_construction_worker",
    level: "A2",
    category: "work",
    title_vi: "Tiếng Indonesia cho thợ xây dựng",
    title_en: "Construction worker Indonesian",
    sentences: [
      // ── Essential site phrases ──────────────────────────────────────────
      {
        en: "Saya harus ke mana?",
        vi: "Tôi phải đi đâu?",
        pronunciation_focus: [
          "SA-ya HA-rus ke MA-na — `harus` = phải; `ke mana` = đi đâu (`ke` = đến/về phía).",
          "Lợi thế người Việt: không chia động từ, không mạo từ — câu ngắn y như tiếng Việt.",
          "Lỗi người Việt: nói `saya pergi mana`. Phải có `ke`: `ke mana`.",
          "Luyện: `Saya harus ke mana?`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-rus ke MA-na — `harus` = must; `ke mana` = to where (`ke` = to/toward).",
          "VN-speaker win: no conjugation, no articles — maps almost 1:1 to Vietnamese.",
          "VN-speaker trap: saying `saya pergi mana`. You need `ke`: `ke mana`.",
          "Drill: `Saya harus ke mana?`",
        ],
      },
      {
        en: "Sekarang saya harus apa?",
        vi: "Bây giờ tôi phải làm gì?",
        pronunciation_focus: [
          "se-ka-RANG SA-ya HA-rus A-pa — `apa` = gì; câu hỏi xin chỉ dẫn an toàn.",
          "Lỗi người Việt: thêm `melakukan` cho đủ chữ. Khẩu ngữ chỉ cần `harus apa`.",
          "Luyện: `Sekarang saya harus apa?`",
        ],
        pronunciation_focus_en: [
          "se-ka-RANG SA-ya HA-rus A-pa — `apa` = what; the safe 'what should I do' question.",
          "VN-speaker trap: padding it with `melakukan`. Spoken Indonesian just says `harus apa`.",
          "Drill: `Sekarang saya harus apa?`",
        ],
      },
      {
        en: "Saya belum mengerti. Bisa diulang?",
        vi: "Tôi chưa hiểu. Nhắc lại được không?",
        pronunciation_focus: [
          "SA-ya be-LUM me-NGER-ti — `belum` = chưa (khác `tidak` = không).",
          "Lỗi người Việt: nói `saya tidak mengerti` khi ý là 'chưa kịp hiểu'. Dùng `belum` mới đúng sắc thái.",
          "Luyện: `Saya belum mengerti. Bisa diulang?`",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LUM me-NGER-ti — `belum` = not yet (different from `tidak` = not).",
          "VN-speaker trap: saying `saya tidak mengerti` when you mean 'I haven't grasped it yet'. `belum` is the right nuance.",
          "Drill: `Saya belum mengerti. Bisa diulang?`",
        ],
      },
      {
        en: "Tolong bicara lebih pelan.",
        vi: "Làm ơn nói chậm lại.",
        pronunciation_focus: [
          "TO-long bi-CA-ra LE-bih PE-lan — `tolong` mở đầu lời nhờ cho lịch sự; `lebih` = hơn.",
          "Lỗi người Việt: `bicara` đọc `bi-CHA-ra`, vì `c` trong tiếng Indonesia = `ch`, KHÔNG phải `k`/`x`.",
          "Luyện: `Tolong bicara lebih pelan.`",
        ],
        pronunciation_focus_en: [
          "TO-long bi-CHA-ra LE-bih PE-lan — `tolong` softens a request; `lebih` = more.",
          "VN-speaker trap: Indonesian `c` is read 'ch', so `bicara` = 'bi-CHA-ra', never 'bi-KA-ra'.",
          "Drill: `Tolong bicara lebih pelan.`",
        ],
      },
      {
        en: "Ini berbahaya.",
        vi: "Cái này nguy hiểm.",
        pronunciation_focus: [
          "I-ni ber-ba-HA-ya — `berbahaya` (tính từ, nguy hiểm) = tiền tố `ber-` + `bahaya` (danh từ, mối nguy).",
          "Lỗi người Việt: dùng danh từ `bahaya` làm tính từ. 'Nguy hiểm' (mô tả) là `berbahaya`.",
          "Luyện: `Ini berbahaya.`",
        ],
        pronunciation_focus_en: [
          "I-ni ber-ba-HA-ya — `berbahaya` (adjective, 'dangerous') = prefix `ber-` + `bahaya` (noun, 'danger').",
          "VN-speaker trap: using the noun `bahaya` as an adjective. The descriptive 'dangerous' is `berbahaya`.",
          "Drill: `Ini berbahaya.`",
        ],
      },
      {
        en: "Saya butuh bantuan sekarang.",
        vi: "Tôi cần giúp ngay.",
        pronunciation_focus: [
          "SA-ya BU-tuh ban-TU-an se-ka-RANG — `butuh` = cần (khẩu ngữ); `bantuan` = sự giúp đỡ.",
          "Lỗi người Việt: nói `saya butuh bantu`. `bantu` là động từ; danh từ 'sự giúp' là `bantuan` (đuôi `-an`).",
          "Luyện: `Saya butuh bantuan sekarang.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BU-tuh ban-TU-an se-ka-RANG — `butuh` = need (colloquial); `bantuan` = help/assistance.",
          "VN-speaker trap: saying `saya butuh bantu`. `bantu` is the verb; the noun 'help' is `bantuan` (suffix `-an`).",
          "Drill: `Saya butuh bantuan sekarang.`",
        ],
      },
      // ── Safety commands ────────────────────────────────────────────────
      {
        en: "Awas, ada tangga!",
        vi: "Coi chừng, có cái thang!",
        pronunciation_focus: [
          "A-was, A-da TANG-ga — `awas` = coi chừng/cảnh báo gấp; `ada` = có.",
          "Lỗi người Việt: bỏ `ada`. Để cảnh báo có vật, dùng `ada` + danh từ.",
          "Luyện: `Awas, ada tangga!`",
        ],
        pronunciation_focus_en: [
          "A-was, A-da TANG-ga — `awas` = watch out!; `ada` = there is.",
          "VN-speaker trap: dropping `ada`. To warn of an object, use `ada` + noun.",
          "Drill: `Awas, ada tangga!`",
        ],
      },
      {
        en: "Berhenti sekarang!",
        vi: "Dừng lại ngay!",
        pronunciation_focus: [
          "ber-HEN-ti se-ka-RANG — `berhenti` = dừng; mệnh lệnh giữ nguyên động từ, không đổi đuôi.",
          "Lợi thế người Việt: không có dạng mệnh lệnh riêng — chỉ cần đọc to động từ.",
          "Luyện: `Berhenti sekarang!`",
        ],
        pronunciation_focus_en: [
          "ber-HEN-ti se-ka-RANG — `berhenti` = stop; the command is just the plain verb, no ending change.",
          "VN-speaker win: there's no special imperative form — just say the verb firmly.",
          "Drill: `Berhenti sekarang!`",
        ],
      },
      {
        en: "Pakai helm.",
        vi: "Đội mũ bảo hộ vào.",
        pronunciation_focus: [
          "PA-kai helm — `pakai` = đeo/mặc/dùng; dùng cho mọi đồ bảo hộ.",
          "Lỗi người Việt: nói `gunakan helm` (quá trang trọng). Trên công trường nói `pakai`.",
          "Luyện: `Pakai helm.`",
        ],
        pronunciation_focus_en: [
          "PA-kai helm — `pakai` = put on / wear / use; works for all safety gear.",
          "VN-speaker trap: saying `gunakan helm` (too formal). On site people say `pakai`.",
          "Drill: `Pakai helm.`",
        ],
      },
      {
        en: "Jangan naik ke sana.",
        vi: "Đừng leo lên đó.",
        pronunciation_focus: [
          "JA-ngan NA-ik ke SA-na — `jangan` = ĐỪNG (mệnh lệnh phủ định), KHÁC `tidak`.",
          "Lỗi người Việt: nói `tidak naik` để ngăn cản. Cấm/đừng phải dùng `jangan`, không phải `tidak`.",
          "Luyện: `Jangan naik ke sana.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan NA-ik ke SA-na — `jangan` = don't (negative command), NOT `tidak`.",
          "VN-speaker trap: saying `tidak naik` to forbid. Prohibitions use `jangan`, never `tidak`.",
          "Drill: `Jangan naik ke sana.`",
        ],
      },
      {
        en: "Panggil mandor.",
        vi: "Gọi quản đốc / cai công trường.",
        pronunciation_focus: [
          "PANG-gil MAN-dor — `panggil` = gọi (ai đó tới); `mandor` = cai/quản đốc công trường.",
          "Lỗi người Việt: nói `telepon mandor` khi người đó ở ngay đó. `telepon` = gọi điện; gọi tại chỗ là `panggil`.",
          "Luyện: `Panggil mandor.`",
        ],
        pronunciation_focus_en: [
          "PANG-gil MAN-dor — `panggil` = call (someone over); `mandor` = site foreman.",
          "VN-speaker trap: `telepon mandor` when he's right there. `telepon` = phone; calling someone over is `panggil`.",
          "Drill: `Panggil mandor.`",
        ],
      },
      // ── Reporting problems ─────────────────────────────────────────────
      {
        en: "Ada masalah di sini.",
        vi: "Có vấn đề ở đây.",
        pronunciation_focus: [
          "A-da ma-SA-lah di SI-ni — `ada` = có; `di sini` = ở đây (`di` = ở).",
          "Lỗi người Việt: lẫn `di` (ở) với `ke` (đến). Đứng tại chỗ dùng `di sini`, không phải `ke sini`.",
          "Luyện: `Ada masalah di sini.`",
        ],
        pronunciation_focus_en: [
          "A-da ma-SA-lah di SI-ni — `ada` = there is; `di sini` = here (`di` = at/in).",
          "VN-speaker trap: confusing `di` (at) with `ke` (to). Standing here is `di sini`, not `ke sini`.",
          "Drill: `Ada masalah di sini.`",
        ],
      },
      {
        en: "Bornya rusak.",
        vi: "Cái máy khoan bị hỏng.",
        pronunciation_focus: [
          "BOR-nya RU-sak — `bor` = máy khoan; `-nya` = 'cái đó' (mạo từ xác định gắn sau danh từ).",
          "Lỗi người Việt: nói `bor itu rusak` cũng đúng nhưng `bornya` tự nhiên hơn khi cả hai đã biết là cái nào.",
          "Luyện: `Bornya rusak.`",
        ],
        pronunciation_focus_en: [
          "BOR-nya RU-sak — `bor` = drill; `-nya` = 'the' (definite marker that attaches to the noun).",
          "VN-speaker trap: `bor itu rusak` is fine, but `bornya` is more natural once both of you know which one.",
          "Drill: `Bornya rusak.`",
        ],
      },
      {
        en: "Kurang satu bagian.",
        vi: "Thiếu một bộ phận.",
        pronunciation_focus: [
          "KU-rang SA-tu BA-gi-an — `kurang` = thiếu/ít hơn; `bagian` = bộ phận/phần (gốc `bagi` + `-an`).",
          "Lỗi người Việt: nói `tidak ada satu bagian`. Để báo thiếu, dùng `kurang`.",
          "Luyện: `Kurang satu bagian.`",
        ],
        pronunciation_focus_en: [
          "KU-rang SA-tu BA-gi-an — `kurang` = lacking/short; `bagian` = part (root `bagi` + `-an`).",
          "VN-speaker trap: `tidak ada satu bagian`. To report a shortfall, use `kurang`.",
          "Drill: `Kurang satu bagian.`",
        ],
      },
      {
        en: "Saya sudah selesai.",
        vi: "Tôi xong việc rồi.",
        pronunciation_focus: [
          "SA-ya SU-dah se-le-SAI — `sudah` = đã/rồi (đánh dấu hoàn thành); động từ không đổi.",
          "Lợi thế người Việt: `sudah` y hệt 'đã/rồi' — không phải chia thì như tiếng châu Âu.",
          "Luyện: `Saya sudah selesai.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SU-dah se-le-SAI — `sudah` = already/done (completion marker); the verb never changes.",
          "VN-speaker win: `sudah` maps straight onto 'đã/rồi' — no European-style tense to conjugate.",
          "Drill: `Saya sudah selesai.`",
        ],
      },
      {
        en: "Tangan saya terluka.",
        vi: "Tôi bị thương ở tay.",
        pronunciation_focus: [
          "TA-ngan SA-ya ter-LU-ka — `terluka` = bị thương (tiền tố `ter-` = bị/vô tình); `tangan saya` = tay tôi.",
          "Lỗi người Việt: nói `saya sakit tangan` (= tay tôi đau/ốm). Bị thương do tai nạn là `terluka`.",
          "Luyện: `Tangan saya terluka.`",
        ],
        pronunciation_focus_en: [
          "TA-ngan SA-ya ter-LU-ka — `terluka` = injured (prefix `ter-` = accidentally/got); `tangan saya` = my hand.",
          "VN-speaker trap: `saya sakit tangan` means 'my hand aches/is ill'. An accidental injury is `terluka`.",
          "Drill: `Tangan saya terluka.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trên công trường Indonesia, `mandor` là người ra lệnh trực tiếp cho tổ thợ (`tukang`), còn `kuli` là lao động phổ thông. An toàn lao động gọi là `K3` (Keselamatan dan Kesehatan Kerja); ở các dự án lớn (`proyek`) của công ty hoặc nhà thầu nước ngoài, đội mũ (`helm`) và giày bảo hộ (`sepatu safety`) là bắt buộc. Số khẩn cấp toàn quốc là `112`; cấp cứu y tế có thể gọi `119`. Người Indonesia nói chuyện rất coi trọng sự lịch sự gián tiếp — mở lời nhờ bằng `tolong` và xưng hô tôn trọng (`Pak` với đàn ông lớn tuổi, `Bu` với phụ nữ) sẽ được quý mến. Nói `belum` (chưa) thay vì `tidak` (không) khi từ chối nhẹ nhàng được xem là tế nhị.",
    cultural_notes_en:
      "On an Indonesian site the `mandor` (foreman) gives orders directly to the crew of `tukang` (skilled workers), while `kuli` are general laborers. Workplace safety is called `K3` (Keselamatan dan Kesehatan Kerja); on big projects (`proyek`) run by companies or foreign contractors, the helmet (`helm`) and safety boots (`sepatu safety`) are mandatory. The national emergency number is `112`; medical emergencies can also reach `119`. Indonesians value indirect politeness — opening a request with `tolong` and using respectful address (`Pak` for an older man, `Bu` for a woman) goes a long way. Softening a refusal with `belum` (not yet) instead of `tidak` (no) reads as tactful.",
    tip_advice_vi:
      "Học thuộc bốn 'việc sống còn' trước: (1) dừng việc bằng MỘT lệnh ngắn — `Berhenti!`; (2) ngăn cản bằng `Jangan …` (KHÔNG dùng `tidak`); (3) báo cái gì hỏng/thiếu — `… rusak` / `Kurang …`; (4) báo bị thương — `… saya terluka`. Nhớ ba khác biệt cốt lõi với người Việt mới học: `belum` (chưa) ≠ `tidak` (không) ≠ `jangan` (đừng), và `di` (ở) ≠ `ke` (đến). Tin vui: tiếng Indonesia không chia động từ, không có giống, không có thanh điệu — câu của bạn ngắn gần như tiếng Việt.",
    tip_advice_en:
      "Drill the four 'survival' jobs first: (1) stop work with ONE short command — `Berhenti!`; (2) forbid with `Jangan …` (NOT `tidak`); (3) report what's broken/missing — `… rusak` / `Kurang …`; (4) report an injury — `… saya terluka`. Keep three core distinctions straight: `belum` (not yet) ≠ `tidak` (not) ≠ `jangan` (don't), and `di` (at) ≠ `ke` (to). The good news: Indonesian has no conjugation, no gender, and no tones — your sentences stay almost as short as Vietnamese.",
    vocabulary: [
      // People on site
      {
        cell_id: "7de90110-6e92-4454-b902-ed5ca3eaa91e",
        word: "proyek",
        en: "project / construction site",
        vi: "dự án / công trình",
        pos: "noun",
        pronunciation_vi: "PRO-yek — `y` đọc như 'i'; đọc rõ `k` cuối",
        pronunciation_en: "PRO-yek — `y` as in 'yes'; sound the final `k`",
      },
      {
        cell_id: "ea56bb25-a316-4765-9512-4ed12c435da1",
        word: "mandor",
        en: "foreman / site supervisor",
        vi: "cai / quản đốc công trường",
        pos: "noun",
        pronunciation_vi: "MAN-dor — người ra lệnh trực tiếp; đừng dùng từ Anh 'boss'",
        pronunciation_en: "MAN-dor — gives orders directly; not the English 'boss'",
      },
      {
        cell_id: "0ca828df-6464-4c93-8800-f8a841d354bc",
        word: "tukang",
        en: "skilled tradesman / craftsman",
        vi: "thợ (lành nghề)",
        pos: "noun",
        pronunciation_vi: "TU-kang — `tukang batu` thợ hồ, `tukang kayu` thợ mộc, `tukang las` thợ hàn",
        pronunciation_en: "TU-kang — `tukang batu` mason, `tukang kayu` carpenter, `tukang las` welder",
      },
      {
        cell_id: "b0df17e0-ee6d-4d3e-a09e-13824482ca1e",
        word: "material",
        en: "building materials",
        vi: "vật liệu",
        pos: "noun",
        pronunciation_vi: "ma-te-ri-AL — mượn từ tiếng Anh; nhấn cuối, không như tiếng Anh",
        pronunciation_en: "ma-te-ri-AL — English loanword; final stress, not English-like",
      },
      // Tools
      {
        cell_id: "1ac93895-8d40-4a02-86b3-390743b28958",
        word: "palu",
        en: "hammer",
        vi: "búa",
        pos: "noun",
        pronunciation_vi: "PA-lu — đừng lẫn với `paku` (đinh)",
        pronunciation_en: "PA-lu — don't confuse with `paku` (nail)",
      },
      {
        cell_id: "c2489b6a-118a-4b98-a2cc-c85b78c1d776",
        word: "bor",
        en: "drill",
        vi: "máy khoan",
        pos: "noun",
        pronunciation_vi: "bor — một âm tiết; `r` rung nhẹ",
        pronunciation_en: "bor — one syllable; lightly trilled `r`",
      },
      {
        cell_id: "df9e9afc-c67a-47fa-bb68-7d9f456f4c47",
        word: "tangga",
        en: "ladder / stairs",
        vi: "thang / cầu thang",
        pos: "noun",
        pronunciation_vi: "TANG-ga — `ngg` ngậm rồi bật; phân biệt `tangan` (tay)",
        pronunciation_en: "TANG-ga — hold the `ngg`; distinct from `tangan` (hand)",
      },
      {
        cell_id: "d6b1a0fc-ad5b-48b4-881c-db5ca188c588",
        word: "meteran",
        en: "tape measure",
        vi: "thước cuộn / thước dây",
        pos: "noun",
        pronunciation_vi: "ME-te-ran — gốc `meter` + `-an`",
        pronunciation_en: "ME-te-ran — root `meter` + `-an`",
      },
      // Materials
      {
        cell_id: "b6dd91d4-ae9b-4cd9-858e-9675156befc7",
        word: "semen",
        en: "cement",
        vi: "xi măng",
        pos: "noun",
        pronunciation_vi: "SE-men — `e` đọc nhẹ như 'ơ'; không phải 'xi-men'",
        pronunciation_en: "SE-men — schwa `e`; not the English 'cement'",
      },
      {
        cell_id: "d4d60715-316e-4782-a220-7d724c4a5662",
        word: "pasir",
        en: "sand",
        vi: "cát",
        pos: "noun",
        pronunciation_vi: "PA-sir — đọc rõ `r` cuối",
        pronunciation_en: "PA-sir — sound the final `r`",
      },
      {
        cell_id: "3d1322b3-fbdd-4dde-9548-5a4bc1c35096",
        word: "besi",
        en: "iron / steel / rebar",
        vi: "sắt / thép",
        pos: "noun",
        pronunciation_vi: "BE-si — `besi beton` = thép cây/cốt thép",
        pronunciation_en: "BE-si — `besi beton` = rebar",
      },
      {
        cell_id: "9ec169dc-7678-4757-9095-6a0c0384bbd2",
        word: "kayu",
        en: "wood / timber",
        vi: "gỗ",
        pos: "noun",
        pronunciation_vi: "KA-yu — `y` đọc như 'i'",
        pronunciation_en: "KA-yu — `y` as in 'yes'",
      },
      {
        cell_id: "c40a7359-a797-44db-b714-856627d3e29e",
        word: "paku",
        en: "nail",
        vi: "đinh",
        pos: "noun",
        pronunciation_vi: "PA-ku — đừng lẫn với `palu` (búa)",
        pronunciation_en: "PA-ku — don't confuse with `palu` (hammer)",
      },
      {
        cell_id: "bd6b85de-1334-4172-9be6-b87b40e67f82",
        word: "sekrup",
        en: "screw",
        vi: "ốc vít",
        pos: "noun",
        pronunciation_vi: "se-KRUP — mượn từ tiếng Hà Lan 'schroef'",
        pronunciation_en: "se-KRUP — from Dutch 'schroef'",
      },
      // Safety gear
      {
        cell_id: "c5a40edc-acf6-4aa6-a25e-c6c6d65f4399",
        word: "helm",
        en: "helmet / hard hat",
        vi: "mũ bảo hộ",
        pos: "noun",
        pronunciation_vi: "helm — một âm tiết; đọc rõ `lm` cuối",
        pronunciation_en: "helm — one syllable; sound the final `lm`",
      },
      {
        cell_id: "5b648a2e-1a16-4730-8816-c2b552c8da9a",
        word: "sarung tangan",
        en: "gloves",
        vi: "găng tay",
        pos: "noun",
        pronunciation_vi: "SA-rung TA-ngan — nghĩa đen 'bao + tay'",
        pronunciation_en: "SA-rung TA-ngan — literally 'cover + hand'",
      },
      {
        cell_id: "3454dec4-87b6-409f-b5b9-3b7354bcd9cd",
        word: "berbahaya",
        en: "dangerous",
        vi: "nguy hiểm",
        pos: "adjective",
        pronunciation_vi: "ber-ba-HA-ya — `ber-` + `bahaya`; là tính từ, không phải danh từ",
        pronunciation_en: "ber-ba-HA-ya — `ber-` + `bahaya`; the adjective, not the noun",
      },
    ],
    dialogue: [
      // Dialogue: Broken tool, missing part
      {
        cell_id: "785f0ea1-28e2-4477-840e-dbcdbe70aa89",
        speaker: "Mandor",
        text: "Kamu, ke lantai dua sekarang.",
        vi: "Cậu, lên tầng hai ngay.",
        en: "You, go to the second floor now.",
      },
      {
        cell_id: "70d2b510-3048-4fad-9094-6fe354112c7c",
        speaker: "Pekerja",
        text: "Baik, Pak. Saya harus melakukan apa di sana?",
        vi: "Vâng, anh. Tôi phải làm gì trên đó?",
        en: "Okay, sir. What should I do up there?",
      },
      {
        cell_id: "ff8719dd-c6e6-443a-9604-76bf1c44deb2",
        speaker: "Mandor",
        text: "Pasang besi untuk dindingnya.",
        vi: "Lắp sắt cho bức tường.",
        en: "Install the rebar for the wall.",
      },
      {
        cell_id: "057e702c-72ab-4177-b2a9-fccaab9046a9",
        speaker: "Pekerja",
        text: "Maaf, Pak. Bornya rusak dan kurang satu sekrup.",
        vi: "Xin lỗi anh. Máy khoan hỏng và thiếu một con ốc vít.",
        en: "Sorry, sir. The drill is broken and one screw is missing.",
      },
      {
        cell_id: "d713f150-4557-4b27-83b6-d8a8d573cff8",
        speaker: "Mandor",
        text: "Tunggu sebentar, saya ambil yang baru.",
        vi: "Chờ một chút, tôi lấy cái mới.",
        en: "Wait a moment, I'll get a new one.",
      },
      {
        cell_id: "73b65bae-7f00-4cba-a7c8-4a7158fa7c5a",
        speaker: "Pekerja",
        text: "Terima kasih. Awas, lantainya licin di sini.",
        vi: "Cảm ơn anh. Coi chừng, sàn ở đây trơn.",
        en: "Thank you. Watch out, the floor is slippery here.",
      },
      {
        cell_id: "ef2d949b-a014-44ae-976c-9e53632cc54a",
        speaker: "Mandor",
        text: "Oke. Pakai helm dan hati-hati.",
        vi: "Được. Đội mũ vào và cẩn thận.",
        en: "Okay. Put on your helmet and be careful.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi cần giúp ngay.", answer: "Saya butuh bantuan sekarang." },
          { prompt: "Tôi chưa hiểu.", answer: "Saya belum mengerti." },
          { prompt: "Máy khoan bị hỏng.", answer: "Bornya rusak." },
          { prompt: "Có vấn đề ở đây.", answer: "Ada masalah di sini." },
          { prompt: "Tôi bị thương ở tay.", answer: "Tangan saya terluka." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Đừng leo lên đó.", answer: "Jangan naik ke sana." },
          { prompt: "Đội mũ bảo hộ vào.", answer: "Pakai helm." },
          { prompt: "Thiếu một bộ phận.", answer: "Kurang satu bagian." },
          { prompt: "Làm ơn nói chậm lại.", answer: "Tolong bicara lebih pelan." },
          { prompt: "Gọi cai công trường.", answer: "Panggil mandor." },
          { prompt: "Cái này nguy hiểm.", answer: "Ini berbahaya." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `tidak`, `belum`, hay `jangan` cho đúng (không / chưa / đừng):",
        instruction_en:
          "Fill in `tidak`, `belum`, or `jangan` (not / not yet / don't):",
        items: [
          { prompt: "___ naik ke sana, bahaya!", answer: "Jangan", hint: "ngăn cản = mệnh lệnh phủ định" },
          { prompt: "Saya ___ selesai, masih kerja.", answer: "belum", hint: "chưa xong" },
          { prompt: "Bornya ___ rusak, masih bagus.", answer: "tidak", hint: "phủ định sự việc" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung báo cáo sự cố ngắn — điền chỗ trống: `Ada masalah dengan ___. ___ rusak. Kurang ___. Saya butuh ___.`",
        instruction_en:
          "Short site-report frame — fill the blanks: `Ada masalah dengan ___. ___ rusak. Kurang ___. Saya butuh ___.`",
        example:
          "Ada masalah dengan bor. Bornya rusak. Kurang satu sekrup. Saya butuh bantuan sekarang.",
        example_vi:
          "Có vấn đề với máy khoan. Máy khoan bị hỏng. Thiếu một con ốc vít. Tôi cần giúp ngay.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra an toàn — bạn làm được chưa?",
        instruction_en: "Quick safety self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể dừng việc bằng một lệnh ngắn.", en: "I can stop work with one short command." },
          { vi: "Tôi có thể ngăn cản bằng `Jangan …`.", en: "I can forbid something with `Jangan …`." },
          { vi: "Tôi có thể nói cái gì bị hỏng hoặc thiếu.", en: "I can say what is broken or missing." },
          { vi: "Tôi có thể báo bị thương rõ ràng.", en: "I can report an injury clearly." },
          { vi: "Tôi phân biệt được `di` (ở) và `ke` (đến).", en: "I can tell `di` (at) from `ke` (to)." },
          { vi: "Tôi có thể xin nhắc lại mà vẫn lịch sự.", en: "I can ask for repetition politely." },
        ],
      },
    ],
  },
];

export default lessons;
