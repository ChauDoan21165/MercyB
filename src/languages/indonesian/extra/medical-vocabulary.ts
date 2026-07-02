// Medical Vocabulary Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, job-interview.ts,
// housing-rental.ts etc.), which in turn mirror the French `FrenchLesson` shape.
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
// no articles. The medical-specific traps are: `sakit` covers BOTH "sick" and "to
// hurt" (`saya sakit` = I'm ill; `kepala saya sakit` = my head hurts); body-part
// possession follows the noun (`perut saya` = my stomach); and `obat` (medicine)
// vs. `resep` (prescription) vs. `apotek` (pharmacy, not "apotik-the-doctor").

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
    id: "indonesian_medical_vocabulary",
    level: "A2",
    category: "health",
    title_vi: "Tiếng Indonesia về sức khỏe & khám bệnh",
    title_en: "Medical vocabulary Indonesian",
    sentences: [
      // ── Saying you're unwell ─────────────────────────────────────────────
      {
        en: "Saya sakit dari kemarin.",
        vi: "Tôi bị ốm từ hôm qua.",
        pronunciation_focus: [
          "SA-ya SA-kit da-ri ke-MA-rin — `sakit` = ốm/đau; `dari kemarin` = từ hôm qua.",
          "Lỗi người Việt: `sakit` vừa là 'ốm' vừa là 'đau'. `Saya sakit` = tôi ốm; muốn nói bộ phận đau thì đặt bộ phận trước: `kepala saya sakit`.",
          "Luyện: `Saya sakit dari kemarin.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SA-kit da-ri ke-MA-rin — `sakit` = sick/painful; `dari kemarin` = since yesterday.",
          "VN-speaker trap: `sakit` means both 'ill' and 'hurts'. `Saya sakit` = I'm ill; to say a body part hurts, put it first: `kepala saya sakit`.",
          "Drill: `Saya sakit dari kemarin.`",
        ],
      },
      {
        en: "Kepala saya pusing dan badan lemas.",
        vi: "Đầu tôi chóng mặt và người mệt rũ.",
        pronunciation_focus: [
          "ke-PA-la SA-ya PU-sing dan BA-dan LE-mas — `kepala` = đầu; `pusing` = chóng mặt/nhức đầu; `badan` = cơ thể; `lemas` = mệt rũ/yếu.",
          "Lỗi người Việt: đặt sở hữu trước — `saya kepala`. Đúng: `kepala saya` (bộ phận + người).",
          "Luyện: `Kepala saya pusing dan badan lemas.`",
        ],
        pronunciation_focus_en: [
          "ke-PA-la SA-ya PU-sing dan BA-dan LE-mas — `kepala` = head; `pusing` = dizzy/headachy; `badan` = body; `lemas` = weak/limp.",
          "VN-speaker trap: putting the owner first — `saya kepala`. Correct: `kepala saya` (part + owner).",
          "Drill: `Kepala saya pusing dan badan lemas.`",
        ],
      },
      {
        en: "Perut saya sakit sejak pagi.",
        vi: "Bụng tôi đau từ sáng.",
        pronunciation_focus: [
          "pe-RUT SA-ya SA-kit se-JAK PA-gi — `perut` = bụng; `sejak` = kể từ; `sakit` ở đây = đau (vì có bộ phận đứng trước).",
          "Lợi thế người Việt: thứ tự `bộ phận + saya + sakit` y như tiếng Việt 'bụng tôi đau'.",
          "Luyện: `Perut saya sakit sejak pagi.`",
        ],
        pronunciation_focus_en: [
          "pe-RUT SA-ya SA-kit se-JAK PA-gi — `perut` = stomach/belly; `sejak` = since; `sakit` here = hurts (a body part precedes it).",
          "VN-speaker win: the order `body-part + saya + sakit` matches Vietnamese 'bụng tôi đau'.",
          "Drill: `Perut saya sakit sejak pagi.`",
        ],
      },
      // ── Symptoms ─────────────────────────────────────────────────────────
      {
        en: "Saya demam dan batuk.",
        vi: "Tôi bị sốt và ho.",
        pronunciation_focus: [
          "SA-ya de-MAM dan BA-tuk — `demam` = sốt; `batuk` = ho; đọc rõ `k` cuối `batuk`.",
          "Lỗi người Việt: thêm 'bị' kiểu tiếng Việt thành câu thừa. Chỉ cần `saya demam` — không cần từ chỉ thể bị động.",
          "Luyện: `Saya demam dan batuk.`",
        ],
        pronunciation_focus_en: [
          "SA-ya de-MAM dan BA-tuk — `demam` = fever; `batuk` = cough; sound the final `k` in `batuk`.",
          "VN-speaker trap: adding a Vietnamese-style 'bị' (passive marker). Just say `saya demam` — no passive word needed.",
          "Drill: `Saya demam dan batuk.`",
        ],
      },
      {
        en: "Saya pilek dan tenggorokan sakit.",
        vi: "Tôi bị sổ mũi và đau họng.",
        pronunciation_focus: [
          "SA-ya PI-lek dan teng-go-RO-kan SA-kit — `pilek` = sổ mũi/cảm; `tenggorokan` = họng.",
          "Lỗi người Việt: đọc `tenggorokan` thiếu âm 'ng'. Giữ 'teng-go-RO-kan', âm `ng` ngậm rồi bật.",
          "Luyện: `Saya pilek dan tenggorokan sakit.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PEE-lek dan teng-go-RO-kan SA-kit — `pilek` = runny nose/cold; `tenggorokan` = throat.",
          "VN-speaker trap: dropping the `ng` in `tenggorokan`. Keep 'teng-go-RO-kan', the `ng` held then released.",
          "Drill: `Saya pilek dan tenggorokan sakit.`",
        ],
      },
      {
        en: "Saya mual dan mau muntah.",
        vi: "Tôi buồn nôn và muốn nôn.",
        pronunciation_focus: [
          "SA-ya MU-al dan MAU MUN-tah — `mual` = buồn nôn; `muntah` = nôn/ói; `mau` = muốn (sắp).",
          "Lỗi người Việt: lẫn `mual` (buồn nôn) với `muntah` (đã nôn). `mual` là cảm giác, `muntah` là hành động.",
          "Luyện: `Saya mual dan mau muntah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MOO-al dan MAU MUN-tah — `mual` = nauseous; `muntah` = to vomit; `mau` = want/about to.",
          "VN-speaker trap: confusing `mual` (nausea) with `muntah` (vomiting). `mual` is the feeling, `muntah` the act.",
          "Drill: `Saya mual dan mau muntah.`",
        ],
      },
      // ── At the clinic / doctor ───────────────────────────────────────────
      {
        en: "Saya mau periksa ke dokter.",
        vi: "Tôi muốn đi khám bác sĩ.",
        pronunciation_focus: [
          "SA-ya MAU pe-RIK-sa ke DOK-ter — `periksa` = khám; `ke dokter` = đến (chỗ) bác sĩ; `ke` chỉ hướng.",
          "Lỗi người Việt: dùng `di dokter` (ở). Đi đến bác sĩ là chuyển động → `ke dokter`.",
          "Luyện: `Saya mau periksa ke dokter.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU pe-RIK-sa ke DOK-ter — `periksa` = to examine/check; `ke dokter` = to the doctor; `ke` marks direction.",
          "VN-speaker trap: using `di dokter` (at). Going to the doctor is movement → `ke dokter`.",
          "Drill: `Saya mau periksa ke dokter.`",
        ],
      },
      {
        en: "Sudah berapa lama Anda sakit?",
        vi: "Anh/chị bị ốm bao lâu rồi?",
        pronunciation_focus: [
          "SU-dah be-RA-pa LA-ma AN-da SA-kit — `sudah` = đã/rồi; `berapa lama` = bao lâu (câu bác sĩ hay hỏi).",
          "Lợi thế người Việt: `sudah` đặt đầu như 'đã/rồi' tiếng Việt — không chia thì.",
          "Luyện: `Sudah berapa lama Anda sakit?`",
        ],
        pronunciation_focus_en: [
          "SU-dah be-RA-pa LA-ma AN-da SA-kit — `sudah` = already; `berapa lama` = how long (a doctor's stock question).",
          "VN-speaker win: `sudah` leads like Vietnamese 'đã/rồi' — no tense to conjugate.",
          "Drill: `Sudah berapa lama Anda sakit?`",
        ],
      },
      {
        en: "Apakah saya perlu istirahat?",
        vi: "Tôi có cần nghỉ ngơi không?",
        pronunciation_focus: [
          "a-pa-KAH SA-ya per-LU is-ti-RA-hat — `perlu` = cần; `istirahat` = nghỉ ngơi; `apakah` mở câu hỏi có/không.",
          "Lỗi người Việt: đọc `istirahat` dồn âm. Tách rõ: 'is-ti-RA-hat', nhấn 'RA'.",
          "Luyện: `Apakah saya perlu istirahat?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH SA-ya per-LU is-ti-RA-hat — `perlu` = need; `istirahat` = to rest; `apakah` opens a yes/no question.",
          "VN-speaker trap: slurring `istirahat`. Separate clearly: 'is-ti-RA-hat', stress 'RA'.",
          "Drill: `Apakah saya perlu istirahat?`",
        ],
      },
      // ── Prescription, pharmacy, insurance ────────────────────────────────
      {
        en: "Dokter memberi saya resep.",
        vi: "Bác sĩ kê đơn thuốc cho tôi.",
        pronunciation_focus: [
          "DOK-ter mem-BE-ri SA-ya RE-sep — `memberi` = đưa/cho (meN- + `beri`); `resep` = đơn thuốc.",
          "Lỗi người Việt: lẫn `resep` (đơn thuốc) với `obat` (thuốc). `resep` là tờ kê đơn, `obat` là viên/lọ thuốc.",
          "Luyện: `Dokter memberi saya resep.`",
        ],
        pronunciation_focus_en: [
          "DOK-ter mem-BE-ri SA-ya RE-sep — `memberi` = to give (meN- + `beri`); `resep` = prescription.",
          "VN-speaker trap: confusing `resep` (prescription) with `obat` (medicine). `resep` is the slip, `obat` is the pill/bottle.",
          "Drill: `Dokter memberi saya resep.`",
        ],
      },
      {
        en: "Di mana apotek terdekat?",
        vi: "Nhà thuốc gần nhất ở đâu?",
        pronunciation_focus: [
          "di MA-na a-po-TEK ter-de-KAT — `apotek` = nhà thuốc; `terdekat` = gần nhất (ter- + `dekat`).",
          "Lỗi người Việt: lẫn `apotek` (nhà thuốc) với `dokter`. `apotek` là nơi mua `obat`.",
          "Luyện: `Di mana apotek terdekat?`",
        ],
        pronunciation_focus_en: [
          "di MA-na a-po-TEK ter-de-KAT — `apotek` = pharmacy; `terdekat` = nearest (ter- + `dekat`).",
          "VN-speaker trap: confusing `apotek` (pharmacy) with `dokter`. `apotek` is where you buy `obat`.",
          "Drill: `Di mana apotek terdekat?`",
        ],
      },
      {
        en: "Obat ini diminum tiga kali sehari.",
        vi: "Thuốc này uống ba lần mỗi ngày.",
        pronunciation_focus: [
          "O-bat I-ni di-MI-num TI-ga KA-li se-HA-ri — `obat` = thuốc; `diminum` = được uống (bị động `di-`); `tiga kali sehari` = ba lần/ngày.",
          "Lỗi người Việt: né câu bị động. Thuốc là vật được uống → `diminum` (di- + `minum`).",
          "Luyện: `Obat ini diminum tiga kali sehari.`",
        ],
        pronunciation_focus_en: [
          "O-bat EE-ni di-MEE-num TEE-ga KA-li se-HA-ri — `obat` = medicine; `diminum` = is taken/drunk (passive `di-`); `tiga kali sehari` = three times a day.",
          "VN-speaker trap: avoiding the passive. Medicine is the thing taken → `diminum` (di- + `minum`).",
          "Drill: `Obat ini diminum tiga kali sehari.`",
        ],
      },
      {
        en: "Apakah klinik ini menerima BPJS?",
        vi: "Phòng khám này có nhận BPJS không?",
        pronunciation_focus: [
          "a-pa-KAH KLI-nik I-ni me-ne-RI-ma be-pe-je-ES — `menerima` = nhận (meN- + `terima`); `BPJS` đọc từng chữ 'be-pe-je-es'.",
          "Lỗi người Việt: đọc `BPJS` như một từ. Đánh vần từng chữ: 'be-pe-je-es' (bảo hiểm y tế quốc gia).",
          "Luyện: `Apakah klinik ini menerima BPJS?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH KLI-nik EE-ni me-ne-REE-ma be-pe-je-ES — `menerima` = to accept (meN- + `terima`); spell `BPJS` 'be-pe-je-es'.",
          "VN-speaker trap: reading `BPJS` as one word. Spell each letter: 'be-pe-je-es' (the national health insurance).",
          "Drill: `Apakah klinik ini menerima BPJS?`",
        ],
      },
      // ── Emergency ────────────────────────────────────────────────────────
      {
        en: "Tolong, ini darurat! Panggil ambulans.",
        vi: "Cứu với, đây là trường hợp khẩn cấp! Gọi xe cứu thương.",
        pronunciation_focus: [
          "TO-long, I-ni da-RU-rat! PANG-gil am-bu-LANS — `darurat` = khẩn cấp; `panggil` = gọi (người/dịch vụ); `ambulans` = xe cứu thương.",
          "Lỗi người Việt: dùng `telepon` cho 'gọi người tới'. Gọi người/dịch vụ tới dùng `panggil`.",
          "Luyện: `Tolong, ini darurat! Panggil ambulans.`",
        ],
        pronunciation_focus_en: [
          "TO-long, EE-ni da-RU-rat! PANG-gil am-bu-LANS — `darurat` = emergency; `panggil` = to summon/call (a person/service); `ambulans` = ambulance.",
          "VN-speaker trap: using `telepon` for 'call someone over'. To summon a person/service use `panggil`.",
          "Drill: `Tolong, ini darurat! Panggil ambulans.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Hệ thống y tế Indonesia: tuyến đầu thường là `puskesmas` (trạm y tế công cộng cấp phường/xã) hoặc `klinik`; bệnh viện gọi là `rumah sakit` (nghĩa đen 'nhà + bệnh', viết tắt `RS`), `IGD`/`UGD` là khoa cấp cứu. `BPJS Kesehatan` (đọc 'be-pe-je-es') là bảo hiểm y tế quốc gia — hỏi `Apakah menerima BPJS?` để biết nơi đó có nhận không, nếu không thì trả tiền mặt (`bayar tunai`/`umum`). Mua thuốc ở `apotek` (nhà thuốc); nhiều `obat` cần `resep` (đơn) của `dokter`, nhưng thuốc thông thường (`obat bebas`, vỉ dán nhãn xanh/xanh dương) mua không cần đơn. Số khẩn cấp toàn quốc là `112`; cấp cứu y tế có thể gọi `119`. Lưu ý lớn cho người Việt: `sakit` mang CẢ nghĩa 'ốm' và 'đau' — `saya sakit` (tôi ốm) khác `kepala saya sakit` (đầu tôi đau); luôn đặt bộ phận cơ thể TRƯỚC `saya`. Người Indonesia coi trọng lịch sự: mở lời bằng `Permisi`/`Maaf`, gọi bác sĩ là `Dokter` hoặc `Dok`.",
    cultural_notes_en:
      "Indonesia's care system: the front line is usually a `puskesmas` (public community health center at the sub-district level) or a `klinik`; a hospital is a `rumah sakit` (literally 'house + sick', abbreviated `RS`), and `IGD`/`UGD` is the emergency department. `BPJS Kesehatan` (spell 'be-pe-je-es') is the national health insurance — ask `Apakah menerima BPJS?` to learn if a place accepts it; otherwise you pay cash (`bayar tunai`/`umum`). Buy medicine at an `apotek` (pharmacy); many `obat` need a `dokter`'s `resep` (prescription), but over-the-counter drugs (`obat bebas`, green/blue-labelled) need none. The national emergency number is `112`; medical emergencies can also reach `119`. Key point for Vietnamese speakers: `sakit` means BOTH 'ill' and 'hurts' — `saya sakit` (I'm sick) differs from `kepala saya sakit` (my head hurts); always put the body part BEFORE `saya`. Indonesians value politeness: open with `Permisi`/`Maaf`, and address the doctor as `Dokter` or `Dok`.",
    tip_advice_vi:
      "Học thuộc 'bộ khung khám bệnh' bốn câu: (1) nói triệu chứng — `Saya demam dan batuk.`; (2) chỉ chỗ đau — `[bộ phận] saya sakit.`; (3) xin khám — `Saya mau periksa ke dokter.`; (4) hỏi bảo hiểm/thuốc — `Apakah menerima BPJS? Di mana apotek terdekat?`. Nhớ ba điểm hay sai với người Việt: `sakit` = ốm HOẶC đau (đặt bộ phận trước để chỉ 'đau'); `resep` (đơn) ≠ `obat` (thuốc) ≠ `apotek` (nhà thuốc); và viết tắt `BPJS` đọc từng chữ 'be-pe-je-es'. Bị động `di-` hay gặp trên nhãn thuốc: `diminum`, `dioleskan` (bôi). Giữ giọng phẳng, không thanh điệu; `c` đọc 'ch'.",
    tip_advice_en:
      "Memorize the four-line clinic frame: (1) state symptoms — `Saya demam dan batuk.`; (2) point to the pain — `[body part] saya sakit.`; (3) ask to be seen — `Saya mau periksa ke dokter.`; (4) ask about insurance/medicine — `Apakah menerima BPJS? Di mana apotek terdekat?`. Keep three VN-speaker pitfalls straight: `sakit` = ill OR hurts (put the body part first for 'hurts'); `resep` (prescription) ≠ `obat` (medicine) ≠ `apotek` (pharmacy); and spell `BPJS` letter-by-letter 'be-pe-je-es'. The passive `di-` is common on medicine labels: `diminum`, `dioleskan` (applied). Keep your pitch flat — no tones; `c` is 'ch'.",
    vocabulary: [
      // Body
      {
        word: "badan",
        en: "body",
        vi: "cơ thể / người",
        pos: "noun",
        pronunciation_vi: "BA-dan — `badan lemas` = người mệt rũ; cũng dùng `tubuh`",
        pronunciation_en: "BA-dan — `badan lemas` = the body feels weak; also `tubuh`",
      },
      {
        word: "kepala",
        en: "head",
        vi: "đầu",
        pos: "noun",
        pronunciation_vi: "ke-PA-la — `kepala saya sakit/pusing` = đau/chóng mặt đầu",
        pronunciation_en: "ke-PA-la — `kepala saya sakit/pusing` = my head hurts/is dizzy",
      },
      {
        word: "perut",
        en: "stomach / belly",
        vi: "bụng",
        pos: "noun",
        pronunciation_vi: "pe-RUT — đọc rõ `t` cuối; `sakit perut` = đau bụng",
        pronunciation_en: "pe-RUT — sound the final `t`; `sakit perut` = stomachache",
      },
      {
        word: "tenggorokan",
        en: "throat",
        vi: "họng / cổ họng",
        pos: "noun",
        pronunciation_vi: "teng-go-RO-kan — giữ âm `ng`; `tenggorokan sakit` = đau họng",
        pronunciation_en: "teng-go-RO-kan — hold the `ng`; `tenggorokan sakit` = sore throat",
      },
      // Symptoms
      {
        word: "sakit",
        en: "sick / painful / to hurt",
        vi: "ốm / đau",
        pos: "adjective",
        pronunciation_vi: "SA-kit — `saya sakit` (ốm) ≠ `[bộ phận] saya sakit` (đau)",
        pronunciation_en: "SA-kit — `saya sakit` (ill) ≠ `[part] saya sakit` (hurts)",
      },
      {
        word: "demam",
        en: "fever",
        vi: "sốt",
        pos: "noun / adjective",
        pronunciation_vi: "de-MAM — `demam tinggi` = sốt cao",
        pronunciation_en: "de-MAM — `demam tinggi` = high fever",
      },
      {
        word: "batuk",
        en: "cough",
        vi: "ho",
        pos: "noun / verb",
        pronunciation_vi: "BA-tuk — đọc rõ `k` cuối; `batuk pilek` = ho cảm",
        pronunciation_en: "BA-tuk — sound the final `k`; `batuk pilek` = cough and cold",
      },
      {
        word: "pilek",
        en: "runny nose / common cold",
        vi: "sổ mũi / cảm",
        pos: "noun",
        pronunciation_vi: "PI-lek — khác `flu`; là cảm thường",
        pronunciation_en: "PEE-lek — milder than 'flu'; the common cold",
      },
      {
        word: "pusing",
        en: "dizzy / headachy",
        vi: "chóng mặt / nhức đầu",
        pos: "adjective",
        pronunciation_vi: "PU-sing — `kepala pusing`; cũng nghĩa bóng 'rối trí'",
        pronunciation_en: "PU-sing — `kepala pusing`; also figuratively 'stressed/confused'",
      },
      {
        word: "mual",
        en: "nauseous",
        vi: "buồn nôn",
        pos: "adjective",
        pronunciation_vi: "MU-al — cảm giác; khác `muntah` (nôn ra)",
        pronunciation_en: "MOO-al — the feeling; distinct from `muntah` (to vomit)",
      },
      // Care & treatment
      {
        word: "dokter",
        en: "doctor",
        vi: "bác sĩ",
        pos: "noun",
        pronunciation_vi: "DOK-ter — gọi tắt lịch sự `Dok`; `periksa ke dokter` = đi khám",
        pronunciation_en: "DOK-ter — polite short form `Dok`; `periksa ke dokter` = to see a doctor",
      },
      {
        word: "resep",
        en: "prescription",
        vi: "đơn thuốc",
        pos: "noun",
        pronunciation_vi: "RE-sep — tờ bác sĩ kê; khác `obat` (thuốc thật)",
        pronunciation_en: "RE-sep — the doctor's slip; not `obat` (the actual medicine)",
      },
      {
        word: "obat",
        en: "medicine",
        vi: "thuốc",
        pos: "noun",
        pronunciation_vi: "O-bat — `obat bebas` (không cần đơn); nhãn ghi `diminum` (uống)",
        pronunciation_en: "O-bat — `obat bebas` (over-the-counter); label says `diminum` (take/drink)",
      },
      {
        word: "apotek",
        en: "pharmacy",
        vi: "nhà thuốc / hiệu thuốc",
        pos: "noun",
        pronunciation_vi: "a-po-TEK — nơi mua `obat`; `apotek terdekat` = nhà thuốc gần nhất",
        pronunciation_en: "a-po-TEK — where you buy `obat`; `apotek terdekat` = nearest pharmacy",
      },
      {
        word: "BPJS",
        en: "national health insurance",
        vi: "bảo hiểm y tế quốc gia",
        pos: "noun (acronym)",
        pronunciation_vi: "be-pe-je-ES — đọc từng chữ; hỏi `menerima BPJS?`",
        pronunciation_en: "be-pe-je-ES — spell each letter; ask `menerima BPJS?`",
      },
      {
        word: "rumah sakit",
        en: "hospital",
        vi: "bệnh viện",
        pos: "noun",
        pronunciation_vi: "RU-mah SA-kit — nghĩa đen 'nhà + bệnh'; viết tắt `RS`; cấp cứu `IGD`",
        pronunciation_en: "RU-mah SA-kit — literally 'house + sick'; abbreviated `RS`; ER is `IGD`",
      },
    ],
    dialogue: [
      // Dialogue: a clinic visit
      {
        speaker: "Dokter",
        text: "Selamat siang. Ada keluhan apa?",
        vi: "Chào buổi trưa. Anh/chị thấy khó chịu chỗ nào?",
        en: "Good afternoon. What's bothering you?",
      },
      {
        speaker: "Pasien",
        text: "Dok, saya demam dan batuk. Tenggorokan saya juga sakit.",
        vi: "Bác sĩ ơi, tôi bị sốt và ho. Họng tôi cũng đau.",
        en: "Doctor, I have a fever and a cough. My throat hurts too.",
      },
      {
        speaker: "Dokter",
        text: "Sudah berapa lama? Apakah ada mual atau pusing?",
        vi: "Bao lâu rồi? Có buồn nôn hay chóng mặt không?",
        en: "For how long? Any nausea or dizziness?",
      },
      {
        speaker: "Pasien",
        text: "Sejak kemarin. Kepala saya pusing dan badan lemas.",
        vi: "Từ hôm qua. Đầu tôi chóng mặt và người mệt rũ.",
        en: "Since yesterday. My head is dizzy and my body feels weak.",
      },
      {
        speaker: "Dokter",
        text: "Baik. Saya beri resep. Obat ini diminum tiga kali sehari, dan banyak istirahat.",
        vi: "Được rồi. Tôi kê đơn. Thuốc này uống ba lần mỗi ngày, và nghỉ ngơi nhiều.",
        en: "Okay. I'll give you a prescription. Take this medicine three times a day, and rest a lot.",
      },
      {
        speaker: "Pasien",
        text: "Terima kasih, Dok. Di mana apotek terdekat? Apakah klinik ini menerima BPJS?",
        vi: "Cảm ơn bác sĩ. Nhà thuốc gần nhất ở đâu? Phòng khám này có nhận BPJS không?",
        en: "Thank you, doctor. Where's the nearest pharmacy? Does this clinic accept BPJS?",
      },
      {
        speaker: "Dokter",
        text: "Apotek di sebelah. Ya, kami menerima BPJS. Semoga cepat sembuh.",
        vi: "Nhà thuốc ở ngay bên cạnh. Vâng, chúng tôi nhận BPJS. Chúc mau khỏe.",
        en: "The pharmacy is next door. Yes, we accept BPJS. Get well soon.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi bị sốt và ho.", answer: "Saya demam dan batuk." },
          { prompt: "Đầu tôi đau.", answer: "Kepala saya sakit." },
          { prompt: "Bụng tôi đau từ sáng.", answer: "Perut saya sakit sejak pagi." },
          { prompt: "Tôi muốn đi khám bác sĩ.", answer: "Saya mau periksa ke dokter." },
          { prompt: "Nhà thuốc gần nhất ở đâu?", answer: "Di mana apotek terdekat?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thuốc & bảo hiểm — dịch sang tiếng Indonesia:",
        instruction_en: "Medicine & insurance practice — translate into Indonesian:",
        items: [
          { prompt: "Bác sĩ kê đơn cho tôi.", answer: "Dokter memberi saya resep." },
          { prompt: "Thuốc này uống ba lần mỗi ngày.", answer: "Obat ini diminum tiga kali sehari." },
          { prompt: "Phòng khám này có nhận BPJS không?", answer: "Apakah klinik ini menerima BPJS?" },
          { prompt: "Cứu với, đây là khẩn cấp! Gọi xe cứu thương.", answer: "Tolong, ini darurat! Panggil ambulans." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `sakit`, `obat`, `resep`, hay `apotek` cho đúng:",
        instruction_en:
          "Choose `sakit`, `obat`, `resep`, or `apotek` correctly:",
        items: [
          { prompt: "Saya ___ dari kemarin.", answer: "sakit", hint: "ốm / đau" },
          { prompt: "Dokter menulis ___ untuk saya.", answer: "resep", hint: "đơn thuốc (tờ giấy)" },
          { prompt: "Saya beli ___ di apotek.", answer: "obat", hint: "thuốc (viên/lọ)" },
          { prompt: "Di mana ___ terdekat?", answer: "apotek", hint: "nhà thuốc (nơi bán)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung mô tả triệu chứng — điền chỗ trống: `Dok, saya ___ dan ___. ___ saya sakit sejak ___.`",
        instruction_en:
          "Symptom-describing frame — fill the blanks: `Dok, saya ___ dan ___. ___ saya sakit sejak ___.`",
        example:
          "Dok, saya demam dan batuk. Tenggorokan saya sakit sejak kemarin.",
        example_vi:
          "Bác sĩ ơi, tôi bị sốt và ho. Họng tôi đau từ hôm qua.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra khám bệnh — bạn làm được chưa?",
        instruction_en: "Clinic self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể kể ít nhất ba triệu chứng (sốt, ho, đau...).", en: "I can name at least three symptoms (fever, cough, pain...)." },
          { vi: "Tôi đặt bộ phận cơ thể TRƯỚC `saya` để chỉ chỗ đau.", en: "I put the body part BEFORE `saya` to say where it hurts." },
          { vi: "Tôi phân biệt được `resep` (đơn), `obat` (thuốc), `apotek` (nhà thuốc).", en: "I can tell `resep`, `obat`, and `apotek` apart." },
          { vi: "Tôi hỏi được phòng khám có nhận BPJS không.", en: "I can ask whether a clinic accepts BPJS." },
          { vi: "Tôi đọc BPJS từng chữ ('be-pe-je-es') và biết số khẩn 112/119.", en: "I spell BPJS ('be-pe-je-es') and know the emergency numbers 112/119." },
          { vi: "Tôi hiểu hướng dẫn dùng thuốc bị động `diminum … kali sehari`.", en: "I understand the passive dosing instruction `diminum … kali sehari`." },
        ],
      },
    ],
  },
];

export default lessons;
