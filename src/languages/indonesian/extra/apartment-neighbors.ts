// Apartment & Neighbors Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker, healthcare-emergency,
// restaurant-hospitality, school-education, phone-calls, public-services), which in
// turn mirror the French `FrenchLesson` shape. When the shared Indonesian registry
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
// no articles. The traps in this topic are: community acronyms (RT/RW), the soft
// command frame `tolong`/`mohon`/`jangan`, the ber- prefix of mutual activity
// (`bergotong royong`, `berkumpul`), and clear word-final consonants
// (`tetangga`, `iuran`, `keamanan`).

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
    id: "indonesian_apartment_neighbors",
    level: "B1",
    category: "community",
    title_vi: "Hàng xóm và đời sống khu phố",
    title_en: "Neighbors and community life",
    sentences: [
      // ── Introducing yourself to neighbors ─────────────────────────────────
      {
        en: "Permisi, saya tetangga baru di sebelah.",
        vi: "Xin chào, tôi là hàng xóm mới ở sát bên.",
        pronunciation_focus: [
          "per-MI-si, SA-ya te-TANG-ga BA-ru di se-be-LAH — `tetangga` = hàng xóm; `di sebelah` = ở bên cạnh.",
          "Lợi thế người Việt: không mạo từ, không chia động từ — `saya tetangga baru` ghép thẳng.",
          "Lỗi người Việt: tách `ng` trong `tetangga`. `ngg` là một âm mũi, ngậm rồi bật: te-TANG-ga.",
          "Luyện: `Saya tetangga baru di sebelah.`",
        ],
        pronunciation_focus_en: [
          "per-MI-si, SA-ya te-TANG-ga BA-ru di se-be-LAH — `tetangga` = neighbor; `di sebelah` = next door.",
          "VN-speaker win: no articles, no conjugation — `saya tetangga baru` stacks directly.",
          "VN-speaker trap: splitting the `ng` in `tetangga`. `ngg` is one nasal, held then released: te-TANG-ga.",
          "Drill: `Saya tetangga baru di sebelah.`",
        ],
      },
      {
        en: "Mohon maaf kalau nanti merepotkan, ya.",
        vi: "Mong anh/chị thông cảm nếu sau này có làm phiền nhé.",
        pronunciation_focus: [
          "MO-hon ma-AF KA-lau NAN-ti me-re-POT-kan, ya — `mohon maaf` = xin lỗi (trang trọng); `merepotkan` = làm phiền.",
          "Mẹo affix: gốc `repot` (bận/phiền) + me-...-kan → `merepotkan` = gây phiền cho ai.",
          "Lỗi người Việt: dùng `maaf` trơ cho mọi cảnh. `mohon maaf` lịch sự hơn khi mới làm quen hàng xóm.",
          "Luyện: `Mohon maaf kalau merepotkan.`",
        ],
        pronunciation_focus_en: [
          "MO-hon ma-AF KA-lau NAN-ti me-re-POT-kan, ya — `mohon maaf` = (formal) apologies; `merepotkan` = to trouble someone.",
          "Affix tip: root `repot` (bothered) + me-...-kan → `merepotkan` = to be a bother to someone.",
          "VN-speaker trap: using bare `maaf` everywhere. `mohon maaf` is more polite when first meeting neighbors.",
          "Drill: `Mohon maaf kalau merepotkan.`",
        ],
      },
      // ── RT/RW, dues, registration ─────────────────────────────────────────
      {
        en: "Saya harus lapor ke Pak RT dulu, ya?",
        vi: "Tôi phải báo với ông tổ trưởng (RT) trước, đúng không ạ?",
        pronunciation_focus: [
          "SA-ya HA-rus LA-por ke pak er-te DU-lu, ya — `lapor` = trình báo; `Pak RT` = ông tổ trưởng dân phố.",
          "Mẹo: `RT` đọc theo chữ cái Indonesia 'er-te'; `dulu` cuối câu = 'trước đã'.",
          "Lỗi người Việt: bỏ `dulu`, mất sắc thái 'làm việc này TRƯỚC'. Giữ `dulu` cuối câu.",
          "Luyện: `Saya harus lapor ke Pak RT dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-rus LA-por ke pak er-te DU-lu, ya — `lapor` = to report/register; `Pak RT` = the neighborhood-unit head.",
          "Tip: spell `RT` in Indonesian letters 'er-te'; sentence-final `dulu` = 'first'.",
          "VN-speaker trap: dropping `dulu` and losing the 'do this FIRST' nuance. Keep `dulu` at the end.",
          "Drill: `Saya harus lapor ke Pak RT dulu.`",
        ],
      },
      {
        en: "Berapa iuran keamanan dan kebersihan per bulan?",
        vi: "Phí an ninh và vệ sinh mỗi tháng là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa I-u-ran ke-a-MA-nan dan ke-ber-SI-han per BU-lan — `iuran` = tiền đóng góp; `keamanan` = an ninh; `kebersihan` = vệ sinh.",
          "Mẹo affix: khung `ke-...-an` tạo danh từ trừu tượng: `aman` (an toàn) → `keamanan`; `bersih` (sạch) → `kebersihan`.",
          "Lỗi người Việt: hỏi `apa iuran` cho số tiền. Hỏi số/giá phải là `berapa iuran`.",
          "Luyện: `Berapa iuran per bulan?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa I-u-ran ke-a-MA-nan dan ke-ber-SI-han per BU-lan — `iuran` = dues; `keamanan` = security; `kebersihan` = cleanliness.",
          "Affix tip: the `ke-...-an` frame builds abstract nouns: `aman` (safe) → `keamanan`; `bersih` (clean) → `kebersihan`.",
          "VN-speaker trap: asking `apa iuran` for an amount. Use `berapa iuran` for a number/price.",
          "Drill: `Berapa iuran per bulan?`",
        ],
      },
      {
        en: "Iuran bisa dibayar tunai atau lewat transfer?",
        vi: "Phí có thể trả tiền mặt hay chuyển khoản ạ?",
        pronunciation_focus: [
          "I-u-ran BI-sa di-BA-yar tu-NAI A-tau LE-wat TRANS-fer — `dibayar` = được trả (bị động); `tunai` = tiền mặt; `lewat` = qua.",
          "Mẹo: thể bị động `di-` rất hay gặp: `dibayar` (được trả). Đừng né — văn nói lẫn viết đều dùng.",
          "Lỗi người Việt: đọc `tunai` thành 'tu-nay-i'. Hai âm thôi: 'tu-NAI'.",
          "Luyện: `Iuran bisa dibayar tunai atau transfer?`",
        ],
        pronunciation_focus_en: [
          "I-u-ran BI-sa di-BA-yar tu-NAI A-tau LE-wat TRANS-fer — `dibayar` = be paid (passive); `tunai` = cash; `lewat` = via.",
          "Tip: the `di-` passive is common: `dibayar` (be paid). Don't avoid it — used in speech and writing alike.",
          "VN-speaker trap: over-syllabifying `tunai`. Just two beats: 'tu-NAI'.",
          "Drill: `Iuran bisa dibayar tunai atau transfer?`",
        ],
      },
      // ── Noise / a polite complaint ────────────────────────────────────────
      {
        en: "Maaf, malam ini agak berisik. Bisa pelankan musiknya?",
        vi: "Xin lỗi, tối nay hơi ồn. Anh vặn nhỏ nhạc lại được không?",
        pronunciation_focus: [
          "ma-AF, MA-lam I-ni A-gak be-RI-sik. BI-sa pe-LAN-kan MU-sik-nya — `berisik` = ồn ào; `pelankan` = vặn nhỏ/làm chậm lại.",
          "Mẹo: `agak` = hơi/khá — làm lời than nhẹ đi, đỡ gắt: `agak berisik` (hơi ồn) lịch sự hơn `berisik`.",
          "Lỗi người Việt: nói thẳng `berisik!` (cộc). Thêm `agak` + `bisa ... ?` để giữ hòa khí.",
          "Luyện: `Bisa pelankan musiknya?`",
        ],
        pronunciation_focus_en: [
          "ma-AF, MA-lam I-ni A-gak be-RI-sik. BI-sa pe-LAN-kan MU-sik-nya — `berisik` = noisy; `pelankan` = to lower/turn down.",
          "Tip: `agak` = a bit/rather — softens a complaint: `agak berisik` (a bit noisy) is gentler than `berisik`.",
          "VN-speaker trap: blunt `berisik!`. Add `agak` + `bisa ... ?` to keep the peace.",
          "Drill: `Bisa pelankan musiknya?`",
        ],
      },
      {
        en: "Tolong jangan parkir di depan pagar saya.",
        vi: "Làm ơn đừng đỗ xe trước cổng nhà tôi.",
        pronunciation_focus: [
          "TO-long JA-ngan PAR-kir di de-PAN PA-gar SA-ya — `tolong` = làm ơn; `jangan` = đừng; `pagar` = hàng rào/cổng.",
          "Mẹo: `jangan` (đừng) chỉ dùng cho MỆNH LỆNH phủ định, KHÁC `tidak` (không) phủ định sự việc.",
          "Lỗi người Việt: nói `tidak parkir di sini` để cấm. Cấm/ngăn phải dùng `jangan parkir`.",
          "Luyện: `Tolong jangan parkir di sini.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan PAR-kir di de-PAN PA-gar SA-ya — `tolong` = please; `jangan` = don't; `pagar` = fence/gate.",
          "Tip: `jangan` (don't) is only for negative COMMANDS, unlike `tidak` (not) which negates facts.",
          "VN-speaker trap: saying `tidak parkir di sini` to forbid. To forbid, use `jangan parkir`.",
          "Drill: `Tolong jangan parkir di sini.`",
        ],
      },
      // ── Gotong royong / community work ────────────────────────────────────
      {
        en: "Minggu pagi ada kerja bakti, semua warga ikut.",
        vi: "Sáng Chủ nhật có buổi lao động chung, cả khu phố cùng tham gia.",
        pronunciation_focus: [
          "MING-gu PA-gi A-da ker-ja BAK-ti, SE-mua WAR-ga I-kut — `kerja bakti` = lao động công ích chung; `warga` = cư dân.",
          "Mẹo: `kerja bakti` = `gotong royong` thực hành — cả xóm cùng dọn dẹp. `ikut` = tham gia/đi cùng.",
          "Lỗi người Việt: đọc rớt `t` cuối `ikut`. Bật rõ: 'I-kut'.",
          "Luyện: `Ada kerja bakti, semua warga ikut.`",
        ],
        pronunciation_focus_en: [
          "MING-gu PA-gi A-da ker-ja BAK-ti, SE-mua WAR-ga I-kut — `kerja bakti` = communal volunteer work; `warga` = residents.",
          "Tip: `kerja bakti` is `gotong royong` in action — the whole block cleans up together. `ikut` = to join/come along.",
          "VN-speaker trap: dropping the final `t` in `ikut`. Release it: 'I-kut'.",
          "Drill: `Ada kerja bakti, semua warga ikut.`",
        ],
      },
      {
        en: "Kita harus saling membantu, namanya juga gotong royong.",
        vi: "Mình phải giúp đỡ lẫn nhau, gọi là tinh thần tương trợ (gotong royong) mà.",
        pronunciation_focus: [
          "KI-ta HA-rus SA-ling mem-BAN-tu, NA-ma-nya JU-ga go-tong RO-yong — `saling` = lẫn nhau; `gotong royong` = tinh thần cộng đồng tương trợ.",
          "Mẹo: `saling` đứng trước động từ để chỉ hành động qua lại: `saling membantu` = giúp đỡ nhau.",
          "Lỗi người Việt: lặp đại từ kiểu 'giúp nhau nhau'. Chỉ cần `saling` + động từ là đủ.",
          "Luyện: `Kita harus saling membantu.`",
        ],
        pronunciation_focus_en: [
          "KI-ta HA-rus SA-ling mem-BAN-tu, NA-ma-nya JU-ga go-tong RO-yong — `saling` = each other; `gotong royong` = the spirit of mutual community help.",
          "Tip: `saling` sits before a verb to mark a reciprocal action: `saling membantu` = help one another.",
          "VN-speaker trap: doubling pronouns for 'each other'. Just `saling` + verb is enough.",
          "Drill: `Kita harus saling membantu.`",
        ],
      },
      // ── Favors & everyday neighborliness ──────────────────────────────────
      {
        en: "Numpang tanya, tukang galon air lewat sini jam berapa?",
        vi: "Cho hỏi chút, người giao nước bình đi qua đây lúc mấy giờ?",
        pronunciation_focus: [
          "NUM-pang TA-nya, TU-kang GA-lon A-ir LE-wat SI-ni jam be-RA-pa — `numpang tanya` = cho hỏi nhờ; `tukang galon` = người giao nước bình.",
          "Mẹo: `numpang tanya` (xin hỏi nhờ) là câu mở miệng cực thân thiện giữa hàng xóm.",
          "Lỗi người Việt: dịch word-by-word 'mượn hỏi'. `numpang tanya` là cụm cố định = 'cho hỏi'.",
          "Luyện: `Numpang tanya, jam berapa?`",
        ],
        pronunciation_focus_en: [
          "NUM-pang TA-nya, TU-kang GA-lon A-ir LE-wat SI-ni jam be-RA-pa — `numpang tanya` = may I just ask; `tukang galon` = the water-jug delivery person.",
          "Tip: `numpang tanya` (mind if I ask) is a very friendly neighbor opener.",
          "VN-speaker trap: translating it literally as 'borrow ask'. `numpang tanya` is a fixed phrase = 'may I ask'.",
          "Drill: `Numpang tanya, jam berapa?`",
        ],
      },
      {
        en: "Kalau butuh sesuatu, ketuk saja pintu saya.",
        vi: "Nếu cần gì cứ gõ cửa nhà tôi nhé.",
        pronunciation_focus: [
          "KA-lau BU-tuh se-su-A-tu, ke-TUK SA-ja PIN-tu SA-ya — `kalau` = nếu; `ketuk` = gõ; `saja` = cứ (việc).",
          "Mẹo: `saja` sau động từ = 'cứ ... đi' (làm thoải mái, đừng ngại): `ketuk saja` = cứ gõ đi.",
          "Lỗi người Việt: bỏ `saja`, mất sắc thái mời gọi 'cứ tự nhiên'. Giữ `ketuk saja`.",
          "Luyện: `Kalau butuh, ketuk saja pintu saya.`",
        ],
        pronunciation_focus_en: [
          "KA-lau BU-tuh se-su-A-tu, ke-TUK SA-ja PIN-tu SA-ya — `kalau` = if; `ketuk` = to knock; `saja` = just.",
          "Tip: `saja` after a verb = 'just go ahead and...' (feel free): `ketuk saja` = just knock.",
          "VN-speaker trap: dropping `saja` and losing the warm 'feel free' nuance. Keep `ketuk saja`.",
          "Drill: `Kalau butuh, ketuk saja pintu saya.`",
        ],
      },
    ],
    vocabulary: [
      // People & community structure
      {
        word: "tetangga",
        en: "neighbor",
        vi: "hàng xóm",
        pos: "noun",
        pronunciation_vi: "te-TANG-ga — `ngg` một âm mũi; `tetangga sebelah` = hàng xóm sát bên",
        pronunciation_en: "te-TANG-ga — `ngg` is one nasal; `tetangga sebelah` = next-door neighbor",
      },
      {
        word: "warga",
        en: "resident / citizen",
        vi: "cư dân",
        pos: "noun",
        pronunciation_vi: "WAR-ga — `warga` = người dân khu phố; `warga negara` = công dân",
        pronunciation_en: "WAR-ga — `warga` = a resident; `warga negara` = a citizen of a country",
      },
      {
        word: "RT (Rukun Tetangga)",
        en: "neighborhood unit (head)",
        vi: "tổ dân phố / tổ trưởng",
        pos: "noun",
        pronunciation_vi: "er-te — `Pak RT` = ông tổ trưởng; cấp cộng đồng nhỏ nhất",
        pronunciation_en: "er-te — `Pak RT` = the unit head; the smallest community level",
      },
      {
        word: "RW (Rukun Warga)",
        en: "community unit (head)",
        vi: "khu phố / trưởng khu",
        pos: "noun",
        pronunciation_vi: "er-we — gồm nhiều `RT`; trên `RT`, dưới `kelurahan`",
        pronunciation_en: "er-we — groups several `RT`s; above `RT`, below `kelurahan`",
      },
      {
        word: "ketua RT",
        en: "head of the neighborhood unit",
        vi: "tổ trưởng dân phố",
        pos: "noun",
        pronunciation_vi: "ke-TU-a er-te — `ketua` = người đứng đầu; thường gọi `Pak RT`",
        pronunciation_en: "ke-TU-a er-te — `ketua` = chairperson; usually addressed `Pak RT`",
      },
      // Dues, security, cleanliness
      {
        word: "iuran",
        en: "dues / contribution fee",
        vi: "tiền đóng góp / phí",
        pos: "noun",
        pronunciation_vi: "I-u-ran — `iuran bulanan` = phí hàng tháng; gốc `iur` (góp)",
        pronunciation_en: "I-u-ran — `iuran bulanan` = monthly dues; root `iur` (to chip in)",
      },
      {
        word: "keamanan",
        en: "security",
        vi: "an ninh",
        pos: "noun",
        pronunciation_vi: "ke-a-MA-nan — `aman` (an toàn) qua khung `ke-...-an`; `satpam` = bảo vệ",
        pronunciation_en: "ke-a-MA-nan — `aman` (safe) via `ke-...-an`; `satpam` = the security guard",
      },
      {
        word: "kebersihan",
        en: "cleanliness / sanitation",
        vi: "vệ sinh",
        pos: "noun",
        pronunciation_vi: "ke-ber-SI-han — `bersih` (sạch) qua khung `ke-...-an`",
        pronunciation_en: "ke-ber-SI-han — `bersih` (clean) via `ke-...-an`",
      },
      {
        word: "satpam",
        en: "security guard",
        vi: "bảo vệ",
        pos: "noun",
        pronunciation_vi: "SAT-pam — viết tắt `satuan pengamanan`; gác cổng khu phố",
        pronunciation_en: "SAT-pam — short for `satuan pengamanan`; guards the complex gate",
      },
      {
        word: "pos ronda",
        en: "neighborhood watch post",
        vi: "chòi canh / trạm tuần tra",
        pos: "noun",
        pronunciation_vi: "pos RON-da — `ronda` = đi tuần đêm; người dân thay phiên canh",
        pronunciation_en: "pos RON-da — `ronda` = night patrol; residents take turns watching",
      },
      // Community spirit & activities
      {
        word: "gotong royong",
        en: "communal mutual help",
        vi: "tinh thần tương trợ cộng đồng",
        pos: "noun/phrase",
        pronunciation_vi: "go-tong RO-yong — giá trị nền tảng; cả xóm cùng làm việc chung",
        pronunciation_en: "go-tong RO-yong — a core value; the whole community pitches in together",
      },
      {
        word: "kerja bakti",
        en: "communal volunteer work",
        vi: "lao động công ích chung",
        pos: "noun/phrase",
        pronunciation_vi: "ker-ja BAK-ti — buổi dọn dẹp khu phố, thường cuối tuần",
        pronunciation_en: "ker-ja BAK-ti — a neighborhood clean-up session, usually on weekends",
      },
      {
        word: "arisan",
        en: "rotating savings social gathering",
        vi: "hụi / họ (góp xoay vòng)",
        pos: "noun",
        pronunciation_vi: "a-RI-san — vừa tiết kiệm xoay vòng vừa gặp gỡ hàng xóm",
        pronunciation_en: "a-RI-san — a rotating savings club that doubles as a social meetup",
      },
      {
        word: "berisik",
        en: "noisy",
        vi: "ồn ào",
        pos: "adj.",
        pronunciation_vi: "be-RI-sik — `agak berisik` = hơi ồn (lịch sự); `ribut` đồng nghĩa",
        pronunciation_en: "be-RI-sik — `agak berisik` = a bit noisy (polite); `ribut` is a synonym",
      },
      {
        word: "tamu",
        en: "guest / visitor",
        vi: "khách",
        pos: "noun",
        pronunciation_vi: "TA-mu — khách qua đêm thường phải `lapor` (báo) với RT; láy `tamu-tamu` = các vị khách",
        pronunciation_en: "TA-mu — overnight guests often must be reported (`lapor`) to the RT; reduplicated `tamu-tamu` = guests",
      },
      // Useful actions
      {
        word: "lapor",
        en: "to report / register (with authority)",
        vi: "trình báo",
        pos: "verb",
        pronunciation_vi: "LA-por — `lapor ke Pak RT` = báo với tổ trưởng; `melapor` thể đầy đủ",
        pronunciation_en: "LA-por — `lapor ke Pak RT` = report to the unit head; `melapor` is the full form",
      },
      {
        word: "menegur",
        en: "to gently warn / speak to",
        vi: "nhắc nhở",
        pos: "verb",
        pronunciation_vi: "me-ne-GUR — gốc `tegur`; `ditegur` = bị nhắc nhở (bị động)",
        pronunciation_en: "me-ne-GUR — root `tegur`; `ditegur` = be spoken to (passive)",
      },
      {
        word: "numpang",
        en: "to impose / borrow briefly (a favor)",
        vi: "nhờ / đi nhờ / ở nhờ",
        pos: "verb",
        pronunciation_vi: "NUM-pang — `numpang tanya` = cho hỏi; `numpang lewat` = cho đi nhờ qua",
        pronunciation_en: "NUM-pang — `numpang tanya` = may I ask; `numpang lewat` = excuse me, passing through",
      },
      {
        word: "saling",
        en: "each other / mutually",
        vi: "lẫn nhau",
        pos: "adverb",
        pronunciation_vi: "SA-ling — `saling` + động từ = hành động qua lại: `saling membantu`",
        pronunciation_en: "SA-ling — `saling` + verb = a reciprocal action: `saling membantu`",
      },
      {
        word: "pagar",
        en: "fence / gate",
        vi: "hàng rào / cổng",
        pos: "noun",
        pronunciation_vi: "PA-gar — đọc rõ `r` cuối; `di depan pagar` = trước cổng",
        pronunciation_en: "PA-gar — sound the final `r`; `di depan pagar` = in front of the gate",
      },
    ],
    dialogue: [
      // New tenant greets a neighbor and learns the community rules
      {
        speaker: "Penghuni baru",
        text: "Permisi, Bu. Saya Linh, penghuni baru di nomor 12.",
        vi: "Xin chào chị. Tôi là Linh, người mới chuyển đến số nhà 12.",
        en: "Excuse me, ma'am. I'm Linh, the new tenant at number 12.",
      },
      {
        speaker: "Tetangga",
        text: "Oh, selamat datang! Sudah lapor ke Pak RT belum?",
        vi: "Ồ, chào mừng nhé! Đã báo với ông tổ trưởng (RT) chưa?",
        en: "Oh, welcome! Have you registered with the RT head yet?",
      },
      {
        speaker: "Penghuni baru",
        text: "Belum, Bu. Nanti sore saya ke sana. Iurannya berapa, ya?",
        vi: "Chưa ạ. Chiều nay tôi sẽ qua đó. Phí đóng góp bao nhiêu vậy chị?",
        en: "Not yet. I'll go this afternoon. How much are the dues?",
      },
      {
        speaker: "Tetangga",
        text: "Lima puluh ribu sebulan, untuk keamanan dan kebersihan.",
        vi: "Năm mươi nghìn một tháng, cho an ninh và vệ sinh.",
        en: "Fifty thousand a month, for security and cleanliness.",
      },
      {
        speaker: "Penghuni baru",
        text: "Baik. Oh ya, kalau ada tamu menginap perlu lapor juga?",
        vi: "Vâng. À, nếu có khách ở lại qua đêm cũng cần báo nữa ạ?",
        en: "Okay. Oh, and if I have an overnight guest, do I report that too?",
      },
      {
        speaker: "Tetangga",
        text: "Iya, cukup bilang ke satpam. Minggu pagi ada kerja bakti, ikut ya.",
        vi: "Đúng vậy, chỉ cần nói với bảo vệ. Sáng Chủ nhật có lao động chung, tham gia nhé.",
        en: "Yes, just tell the guard. Sunday morning there's communal work — do join.",
      },
      {
        speaker: "Penghuni baru",
        text: "Pasti, Bu. Senang bisa kenal. Kalau butuh apa-apa, ketuk saja pintu saya.",
        vi: "Chắc chắn rồi chị. Rất vui được làm quen. Cần gì cứ gõ cửa nhà tôi nhé.",
        en: "Definitely. Nice to meet you. If you need anything, just knock on my door.",
      },
      {
        speaker: "Tetangga",
        text: "Sama-sama. Namanya juga bertetangga, harus saling bantu.",
        vi: "Tôi cũng vậy. Đã là hàng xóm thì phải giúp đỡ lẫn nhau mà.",
        en: "Likewise. That's what being neighbors is — we help one another.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi là hàng xóm mới ở sát bên.", answer: "Saya tetangga baru di sebelah." },
          { prompt: "Tôi phải báo với ông tổ trưởng trước.", answer: "Saya harus lapor ke Pak RT dulu." },
          { prompt: "Phí mỗi tháng bao nhiêu?", answer: "Iurannya berapa per bulan?" },
          { prompt: "Làm ơn đừng đỗ xe trước cổng nhà tôi.", answer: "Tolong jangan parkir di depan pagar saya." },
          { prompt: "Cần gì cứ gõ cửa nhà tôi.", answer: "Kalau butuh, ketuk saja pintu saya." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Tối nay hơi ồn, vặn nhỏ nhạc được không?", answer: "Malam ini agak berisik, bisa pelankan musiknya?" },
          { prompt: "Mình phải giúp đỡ lẫn nhau.", answer: "Kita harus saling membantu." },
          { prompt: "Sáng Chủ nhật có lao động chung.", answer: "Minggu pagi ada kerja bakti." },
          { prompt: "Cho hỏi chút, lúc mấy giờ?", answer: "Numpang tanya, jam berapa?" },
          { prompt: "Phí có thể chuyển khoản không?", answer: "Iuran bisa dibayar lewat transfer?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Điền `tolong`, `jangan`, hay `mohon` cho đúng (làm ơn / đừng / xin):",
        instruction_en:
          "Fill in `tolong`, `jangan`, or `mohon` (please / don't / kindly):",
        items: [
          { prompt: "___ parkir di depan pagar saya. (ngăn cản)", answer: "Jangan", hint: "mệnh lệnh phủ định = đừng" },
          { prompt: "___ pelankan musiknya sedikit. (nhờ làm)", answer: "Tolong", hint: "nhờ ai làm gì = làm ơn" },
          { prompt: "___ maaf kalau merepotkan. (xin lỗi trang trọng)", answer: "Mohon", hint: "xin (lịch sự) = mohon" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn danh từ `ke-...-an` đúng từ gốc cho sẵn:",
        instruction_en:
          "Pick the correct `ke-...-an` noun from the given root:",
        items: [
          { prompt: "aman (an toàn) → iuran untuk ___", answer: "keamanan", hint: "an ninh" },
          { prompt: "bersih (sạch) → iuran untuk ___", answer: "kebersihan", hint: "vệ sinh" },
          { prompt: "sehat (khỏe) → menjaga ___ warga", answer: "kesehatan", hint: "sức khỏe" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung tự giới thiệu với hàng xóm — điền chỗ trống: `Permisi, [Pak/Bu]. Saya ___, penghuni baru di ___. Mohon maaf kalau nanti merepotkan. Kalau butuh apa-apa, ketuk saja pintu saya.`",
        instruction_en:
          "Introduce-yourself-to-neighbors frame — fill the blanks: `Permisi, [Pak/Bu]. Saya ___, penghuni baru di ___. Mohon maaf kalau nanti merepotkan. Kalau butuh apa-apa, ketuk saja pintu saya.`",
        example:
          "Permisi, Bu. Saya Linh, penghuni baru di nomor 12. Mohon maaf kalau nanti merepotkan. Kalau butuh apa-apa, ketuk saja pintu saya.",
        example_vi:
          "Xin chào chị. Tôi là Linh, người mới ở số nhà 12. Mong chị thông cảm nếu sau này làm phiền. Cần gì cứ gõ cửa nhà tôi.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn hòa nhập khu phố được chưa?",
        instruction_en: "Self-check — can you handle neighborhood life?",
        items: [
          { vi: "Tôi có thể tự giới thiệu với hàng xóm.", en: "I can introduce myself to neighbors." },
          { vi: "Tôi biết phải `lapor` với Pak RT.", en: "I know to register (`lapor`) with the RT head." },
          { vi: "Tôi có thể hỏi `iuran` bao nhiêu.", en: "I can ask how much the `iuran` is." },
          { vi: "Tôi phàn nàn tiếng ồn một cách lịch sự (`agak berisik`).", en: "I can complain about noise politely (`agak berisik`)." },
          { vi: "Tôi phân biệt được `jangan` (đừng) và `tidak` (không).", en: "I can tell `jangan` (don't) from `tidak` (not)." },
          { vi: "Tôi hiểu `gotong royong` và sẵn sàng `ikut kerja bakti`.", en: "I understand `gotong royong` and am ready to join `kerja bakti`." },
        ],
      },
    ],
    cultural_notes_vi:
      "Đời sống khu phố Indonesia xoay quanh `RT` (tổ dân phố) và `RW` (khu phố) — hai cấp cộng đồng nhỏ nhất, do dân bầu. Khi mới chuyển đến, việc đầu tiên là `lapor` (trình báo) với `Pak RT` kèm bản photo KTP; nhiều nơi còn yêu cầu báo cả khách ở lại qua đêm vì lý do an ninh. Mỗi tháng cư dân đóng `iuran` cho `keamanan` (thuê `satpam`) và `kebersihan` (gom rác). Giá trị cốt lõi là `gotong royong` — tinh thần tương trợ; biểu hiện cụ thể là `kerja bakti` (cùng dọn dẹp cuối tuần) và `arisan` (vừa góp tiền xoay vòng vừa gặp gỡ). Với người Việt, văn hóa này rất gần 'tình làng nghĩa xóm' — điểm khác là tính tổ chức chặt qua RT/RW. Mẹo hòa nhập: chào hỏi, chịu khó `ikut` các hoạt động chung, và than phiền thì nhẹ nhàng (`agak ...`, `bisa ... ?`) để giữ `rukun` (hòa thuận).",
    cultural_notes_en:
      "Indonesian community life revolves around the `RT` (neighborhood unit) and `RW` (community unit) — the two smallest, elected community tiers. When you move in, the first step is to `lapor` (register) with `Pak RT`, usually with a photocopy of your KTP; many areas also ask you to report overnight guests for security. Each month residents pay `iuran` for `keamanan` (hiring a `satpam` guard) and `kebersihan` (trash collection). The core value is `gotong royong` — mutual aid — made concrete in `kerja bakti` (weekend communal clean-ups) and `arisan` (a rotating savings club that doubles as socializing). For Vietnamese speakers this closely echoes 'tình làng nghĩa xóm'; the difference is the tight RT/RW organization. To fit in: greet people, make an effort to `ikut` (join) shared activities, and keep complaints gentle (`agak ...`, `bisa ... ?`) to preserve `rukun` (harmony).",
    tip_advice_vi:
      "Hai mảnh ngữ pháp đáng vàng cho chủ đề này. (1) Mệnh lệnh mềm: `tolong` (làm ơn, nhờ làm) ≠ `jangan` (đừng, ngăn cản) ≠ `mohon` (xin, trang trọng). Cấm điều gì luôn dùng `jangan`, KHÔNG dùng `tidak`. (2) Khung danh từ `ke-...-an` biến tính từ thành khái niệm: `aman` → `keamanan` (an ninh), `bersih` → `kebersihan` (vệ sinh), `sehat` → `kesehatan` (sức khỏe). Thêm hai cụm xã giao thân thiện: `numpang tanya` (cho hỏi chút) để mở lời, và `saling membantu` (giúp đỡ lẫn nhau) — chỉ cần `saling` + động từ, đừng lặp đại từ.",
    tip_advice_en:
      "Two grammar pieces are gold here. (1) Soft commands: `tolong` (please, asking a favor) ≠ `jangan` (don't, forbidding) ≠ `mohon` (kindly, formal). To forbid something, always use `jangan`, never `tidak`. (2) The `ke-...-an` noun frame turns adjectives into concepts: `aman` → `keamanan` (security), `bersih` → `kebersihan` (cleanliness), `sehat` → `kesehatan` (health). Add two friendly social phrases: `numpang tanya` (mind if I ask) to open, and `saling membantu` (help each other) — just `saling` + verb, no doubled pronoun.",
  },
];

export default lessons;
