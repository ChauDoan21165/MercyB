// Laundry & House Cleaning Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling Indonesian `extra/*` files (e.g. food-street.ts,
// banking-money.ts), which in turn mirror the French `FrenchLesson` shape. When the
// shared Indonesian registry (src/languages/indonesian/lessons.ts) lands, swap the
// local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Laundry/cleaning Indonesian is everyday-service register: `mbak`/`mas` or, for a
// household helper, `Mbak`/`Bu`. The verbs cluster around `meN-...-kan` causatives
// (`cucikan`, `setrikakan`, `bersihkan`) and the passive `di-` (`dicuci`, `disetrika`).
// For Vietnamese speakers the WIN is no conjugation/gender/tone; the trap is the
// `meN-...-kan` 'do it FOR me' frame, the `-an` measure noun (`laundry kiloan`,
// `cucian`), and per-kilo pricing in `ribu`.

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
    id: "indonesian_laundry_cleaning",
    level: "A2",
    category: "services",
    title_vi: "Tiếng Indonesia cho giặt ủi và dọn dẹp nhà",
    title_en: "Laundry and house-cleaning Indonesian",
    sentences: [
      // ── At the laundry (laundry kiloan) ────────────────────────────────
      {
        en: "Mbak, mau laundry kiloan, berapa per kilo?",
        vi: "Chị ơi, tôi muốn giặt tính ký, bao nhiêu một ký ạ?",
        pronunciation_focus: [
          "mbak, mau LON-dri ki-LO-an, be-RA-pa per KI-lo — `laundry kiloan` = giặt tính theo ký (gốc `kilo` + `-an`).",
          "`kiloan` (hậu tố `-an`) = 'theo ký'; giá tính `per kilo`, thường ~Rp 6–10 nghìn/ký.",
          "Lỗi người Việt: nói `giặt cân`. Đúng là `laundry kiloan`; hỏi giá: `berapa per kilo?`.",
        ],
        pronunciation_focus_en: [
          "mbak, mau LON-dree ki-LO-an, be-RA-pa per KI-lo — `laundry kiloan` = laundry charged by the kilo (root `kilo` + `-an`).",
          "`kiloan` (`-an` suffix) = 'by the kilo'; priced `per kilo`, usually ~Rp 6–10k/kg.",
          "VN-speaker trap: 'wash by weight' literally. Say `laundry kiloan`; ask `berapa per kilo?`.",
        ],
      },
      {
        en: "Cucian ini tolong dicuci dan disetrika, ya.",
        vi: "Đống đồ này làm ơn giặt và ủi giúp nhé.",
        pronunciation_focus: [
          "cu-CI-an I-ni TO-long di-CU-ci dan di-se-TRI-ka — `cucian` = đồ cần giặt (gốc `cuci` + `-an`); bị động `di-`: `dicuci`, `disetrika`.",
          "Khung yêu cầu dịch vụ rất hay dùng thể bị động `di-`: `dicuci` (được giặt), `disetrika` (được ủi).",
          "Lỗi người Việt: né `di-`, nói `tolong cuci`. Lịch sự hơn: `tolong dicuci dan disetrika`.",
        ],
        pronunciation_focus_en: [
          "cu-CI-an I-ni TO-long di-CU-ci dan di-se-TRI-ka — `cucian` = the wash/laundry (root `cuci` + `-an`); passive `di-`: `dicuci`, `disetrika`.",
          "Service requests lean on the `di-` passive: `dicuci` (be washed), `disetrika` (be ironed).",
          "VN-speaker trap: avoiding `di-`, saying `tolong cuci`. Politer: `tolong dicuci dan disetrika`.",
        ],
      },
      {
        en: "Yang ini jangan dikeringkan pakai mesin, ya.",
        vi: "Cái này đừng sấy bằng máy nhé.",
        pronunciation_focus: [
          "yang I-ni JA-ngan di-ke-ring-KAN PA-kai me-SIN — `dikeringkan` (bị động `di-...-kan`) = được làm khô/sấy; `mesin` = máy.",
          "`jangan di-...kan` = 'đừng để bị ...' — khung dặn dò lịch sự cho đồ dễ hỏng.",
          "Lỗi người Việt: nói `jangan keringkan mesin`. Đầy đủ: `jangan dikeringkan pakai mesin`.",
        ],
        pronunciation_focus_en: [
          "yang I-ni JA-ngan di-ke-ring-KAN PA-kai me-SIN — `dikeringkan` (passive `di-...-kan`) = be dried; `mesin` = machine.",
          "`jangan di-...kan` = 'don't let it be ...' — the polite caution frame for delicate items.",
          "VN-speaker trap: `jangan keringkan mesin`. Full form: `jangan dikeringkan pakai mesin`.",
        ],
      },
      {
        en: "Ada noda di kemeja ini, bisa dihilangkan?",
        vi: "Áo sơ mi này có vết bẩn, tẩy được không ạ?",
        pronunciation_focus: [
          "A-da NO-da di ke-ME-ja I-ni, BI-sa di-hi-lang-KAN — `noda` = vết bẩn/ố; `dihilangkan` = được làm sạch/tẩy đi.",
          "`hilang` (mất) + `di-...-kan` → `dihilangkan` = làm cho biến mất (tẩy vết).",
          "Lỗi người Việt: nói `bersihkan noda` chung chung. Vết ố/cứng đầu dùng `dihilangkan` chính xác hơn.",
        ],
        pronunciation_focus_en: [
          "A-da NO-da di ke-ME-ja I-ni, BI-sa di-hi-lang-KAN — `noda` = stain; `dihilangkan` = be removed.",
          "`hilang` (gone) + `di-...-kan` → `dihilangkan` = make it disappear (remove the stain).",
          "VN-speaker trap: generic `bersihkan noda`. For a stubborn stain, `dihilangkan` is more precise.",
        ],
      },
      {
        en: "Kira-kira selesainya kapan, Mbak?",
        vi: "Khoảng khi nào xong vậy chị?",
        pronunciation_focus: [
          "ki-ra-KI-ra se-le-SAI-nya ka-PAN — `kira-kira` = khoảng chừng; `selesai` = xong; `kapan` = khi nào.",
          "Thêm `kira-kira` làm câu hỏi mềm; tiệm thường trả lời 'besok' (mai) hoặc 'dua hari' (hai ngày).",
          "Lỗi người Việt: hỏi cộc `kapan selesai?`. Thêm `kira-kira` + `Mbak` nghe lịch sự, tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "ki-ra-KI-ra se-le-SAI-nya ka-PAN — `kira-kira` = roughly; `selesai` = done; `kapan` = when.",
          "Adding `kira-kira` softens it; the shop often says 'besok' (tomorrow) or 'dua hari' (two days).",
          "VN-speaker trap: blunt `kapan selesai?`. Adding `kira-kira` + `Mbak` is politer and more natural.",
        ],
      },
      {
        en: "Tolong dipisah yang putih dan yang berwarna.",
        vi: "Làm ơn tách riêng đồ trắng và đồ màu.",
        pronunciation_focus: [
          "TO-long di-PI-sah yang PU-tih dan yang ber-WAR-na — `dipisah` = được tách riêng; `yang putih` = (đồ) màu trắng; `berwarna` = có màu.",
          "`yang` = '(cái) mà' — gom nhóm: `yang putih`, `yang berwarna`; `berwarna` (`ber-` + `warna`) = có màu.",
          "Lỗi người Việt: bỏ `yang`. 'Đồ trắng' nói gọn là `yang putih`, 'đồ màu' là `yang berwarna`.",
        ],
        pronunciation_focus_en: [
          "TO-long di-PI-sah yang PU-tih dan yang ber-WAR-na — `dipisah` = be separated; `yang putih` = the white ones; `berwarna` = colored.",
          "`yang` = 'the one(s) that' — groups items: `yang putih`, `yang berwarna`; `berwarna` (`ber-` + `warna`) = colored.",
          "VN-speaker trap: dropping `yang`. 'The whites' = `yang putih`, 'the colors' = `yang berwarna`.",
        ],
      },
      // ── Household helper / cleaning ────────────────────────────────────
      {
        en: "Mbak, tolong bantu bersih-bersih rumah hari ini.",
        vi: "Chị ơi, hôm nay giúp dọn dẹp nhà cửa nhé.",
        pronunciation_focus: [
          "mbak, TO-long BAN-tu ber-sih-BER-sih RU-mah — `bersih-bersih` (láy của `bersih`) = dọn dẹp lặt vặt khắp nơi.",
          "Tái lặp `bersih-bersih` diễn tả hành động dọn nhiều thứ/nhiều chỗ, nhẹ nhàng (khác `membersihkan` cụ thể một vật).",
          "Lỗi người Việt: nói `bersihkan rumah` cứng. Khẩu ngữ thân thiện là `bersih-bersih rumah`.",
        ],
        pronunciation_focus_en: [
          "mbak, TO-long BAN-tu ber-sih-BER-sih RU-mah — `bersih-bersih` (reduplication of `bersih`) = general tidying around the house.",
          "Reduplicated `bersih-bersih` = cleaning many things/places, casually (vs `membersihkan` of one specific item).",
          "VN-speaker trap: the stiff `bersihkan rumah`. The friendly everyday form is `bersih-bersih rumah`.",
        ],
      },
      {
        en: "Tolong sapu dan pel lantainya, ya, Mbak.",
        vi: "Làm ơn quét và lau sàn nhà nhé chị.",
        pronunciation_focus: [
          "TO-long SA-pu dan pel LAN-tai-nya — `sapu` = quét (cũng là cái chổi); `pel` = lau (cũng là cây lau nhà); `lantai` = sàn.",
          "`sapu` và `pel` vừa là động từ vừa là dụng cụ — ngữ cảnh quyết định; ở đây là hành động.",
          "Lỗi người Việt: nói `lau` bằng `bersih`. Lau sàn dùng đúng từ `mengepel`/`pel lantai`.",
        ],
        pronunciation_focus_en: [
          "TO-long SA-pu dan pel LAN-tai-nya — `sapu` = to sweep (also 'broom'); `pel` = to mop (also 'mop'); `lantai` = floor.",
          "`sapu` and `pel` are both verbs and tools — context decides; here they're actions.",
          "VN-speaker trap: using `bersih` for mopping. Mop the floor = `mengepel`/`pel lantai`.",
        ],
      },
      {
        en: "Sampahnya tolong dibuang ke depan, ya.",
        vi: "Rác làm ơn đem bỏ ra phía trước nhé.",
        pronunciation_focus: [
          "SAM-pah-nya TO-long di-BU-ang ke de-PAN — `sampah` = rác; `dibuang` (bị động `di-`) = được vứt đi; `ke depan` = ra phía trước.",
          "`buang` (vứt) + `di-` → `dibuang`; nhà ở Indonesia hay để rác `ke depan` cho xe gom (`tukang sampah`).",
          "Lỗi người Việt: nói `buang sampah luar`. Đầy đủ: `dibuang ke depan/ke tempat sampah`.",
        ],
        pronunciation_focus_en: [
          "SAM-pah-nya TO-long di-BU-ang ke de-PAN — `sampah` = trash; `dibuang` (passive `di-`) = be thrown out; `ke depan` = out front.",
          "`buang` (discard) + `di-` → `dibuang`; homes leave trash `ke depan` for the collector (`tukang sampah`).",
          "VN-speaker trap: `buang sampah luar`. Full form: `dibuang ke depan/ke tempat sampah`.",
        ],
      },
      {
        en: "Kamar mandinya tolong disikat sampai bersih.",
        vi: "Làm ơn cọ nhà tắm cho thật sạch.",
        pronunciation_focus: [
          "KA-mar MAN-di-nya TO-long di-SI-kat SAM-pai ber-SIH — `disikat` = được chà/cọ (bằng bàn chải `sikat`); `sampai bersih` = đến khi sạch.",
          "`sampai bersih` = '... cho đến khi sạch' — cách diễn tả mức độ/kết quả mong muốn.",
          "Lỗi người Việt: nói `cuci kamar mandi`. Cọ rửa nhà tắm dùng `disikat`; `sampai bersih` nêu rõ chuẩn.",
        ],
        pronunciation_focus_en: [
          "KA-mar MAN-di-nya TO-long di-SI-kat SAM-pai ber-SIH — `disikat` = be scrubbed (with a brush `sikat`); `sampai bersih` = until clean.",
          "`sampai bersih` = '... until it's clean' — states the desired result/standard.",
          "VN-speaker trap: `cuci kamar mandi`. Scrubbing a bathroom = `disikat`; `sampai bersih` sets the bar.",
        ],
      },
      // ── Pricing, payment, thanks ───────────────────────────────────────
      {
        en: "Semuanya berapa, Mbak? Bisa bayar pakai QRIS?",
        vi: "Tất cả bao nhiêu vậy chị? Trả bằng QRIS được không?",
        pronunciation_focus: [
          "se-MU-a-nya be-RA-pa, mbak — `semuanya berapa?` = tất cả bao nhiêu; `bayar pakai QRIS` = trả bằng mã QR.",
          "Tiệm giặt nhỏ nay nhiều nơi nhận `QRIS`; vẫn nên thủ `uang tunai` lẻ. Giá tính bằng `ribu`.",
          "Lỗi người Việt: quên bậc `ribu`. 'Hai lăm nghìn' = `dua puluh lima ribu`, không phải `dua puluh lima`.",
        ],
        pronunciation_focus_en: [
          "se-MU-a-nya be-RA-pa, mbak — `semuanya berapa?` = how much altogether; `bayar pakai QRIS` = pay by QR code.",
          "Small laundries often take `QRIS` now; still keep small `uang tunai`. Prices are in `ribu`.",
          "VN-speaker trap: dropping the `ribu` scale. 'Twenty-five thousand' = `dua puluh lima ribu`, not `dua puluh lima`.",
        ],
      },
      {
        en: "Wangi dan rapi, makasih banyak, ya, Mbak!",
        vi: "Thơm và gọn gàng, cảm ơn chị nhiều nhé!",
        pronunciation_focus: [
          "WA-ngi dan RA-pi, ma-KA-sih BA-nyak, ya, mbak — `wangi` = thơm; `rapi` = gọn gàng/phẳng phiu; `makasih banyak` = cảm ơn nhiều.",
          "Khen kết quả giặt ủi: `wangi` (thơm), `rapi` (phẳng), `bersih` (sạch) — lời khen quen thuộc, ấm áp.",
          "Lỗi người Việt: chỉ nói `terima kasih` trang trọng. Với tiệm quen, `makasih ya, Mbak` thân thiện, đúng tông.",
        ],
        pronunciation_focus_en: [
          "WA-ngi dan RA-pi, ma-KA-sih BA-nyak, ya, mbak — `wangi` = fragrant; `rapi` = neat/well-pressed; `makasih banyak` = thanks a lot.",
          "Praising laundry: `wangi` (smells good), `rapi` (well-pressed), `bersih` (clean) — warm, common compliments.",
          "VN-speaker trap: only the formal `terima kasih`. At a regular shop, `makasih ya, Mbak` is warmer and on-tone.",
        ],
      },
    ],
    cultural_notes_vi:
      "Dịch vụ giặt là cực phổ biến và rẻ ở Indonesia. `Laundry kiloan` (giặt tính ký, ~Rp 6–10 nghìn/ký, thường gồm giặt + sấy + ủi + gấp) là lựa chọn của sinh viên và người đi làm; trả thêm cho `express` (lấy nhanh trong ngày) hay `dry cleaning` (giặt khô cho đồ vest, jas). Đếm đồ theo `kilo`; đồ dễ hỏng dặn `jangan dikeringkan pakai mesin`. Ở nhà, nhiều gia đình thuê `ART` (`asisten rumah tangga`, trước gọi `pembantu`) hoặc theo giờ; gọi họ lịch sự bằng `Mbak`/`Bu`, đối xử tôn trọng. Việc dọn dẹp gọi chung là `bersih-bersih`: `menyapu` (quét), `mengepel` (lau sàn), `menyikat` (cọ), `membuang sampah` (đổ rác — thường để `ke depan` cho `tukang sampah` gom). Trả công có thể `harian` (theo ngày) hoặc `bulanan` (theo tháng); nhiều nơi nay nhận `QRIS`. Lưu ý: ngôn ngữ với người giúp việc nên lịch sự ấm áp (`tolong`, `ya, Mbak`), không ra lệnh trống không.",
    cultural_notes_en:
      "Laundry service is ubiquitous and cheap in Indonesia. `Laundry kiloan` (charged by the kilo, ~Rp 6–10k/kg, usually wash + dry + iron + fold) is the go-to for students and workers; pay extra for `express` (same-day) or `dry cleaning` (for suits/`jas`). Items are counted by `kilo`; for delicates, say `jangan dikeringkan pakai mesin`. At home, many households hire an `ART` (`asisten rumah tangga`, formerly `pembantu`) full-time or by the hour; address them politely as `Mbak`/`Bu` and treat them with respect. Cleaning is `bersih-bersih`: `menyapu` (sweep), `mengepel` (mop), `menyikat` (scrub), `membuang sampah` (take out trash — usually left `ke depan` for the `tukang sampah`). Pay can be `harian` (daily) or `bulanan` (monthly); many places now take `QRIS`. Note: speak to a helper warmly and politely (`tolong`, `ya, Mbak`), never in bare commands.",
    tip_advice_vi:
      "Năm khung vàng cho giặt ủi & dọn dẹp: (1) hỏi dịch vụ/giá — `Mau laundry kiloan, berapa per kilo?`; (2) nêu yêu cầu lịch sự bằng thể bị động `di-` — `Tolong dicuci dan disetrika` / `Tolong disapu dan dipel`; (3) dặn dò — `Jangan dikeringkan pakai mesin` / `Tolong dipisah yang putih`; (4) hỏi thời gian/tiền — `Kira-kira selesainya kapan?` / `Semuanya berapa?`; (5) khen + cảm ơn — `Wangi dan rapi, makasih ya`. Hai điểm ngữ pháp lõi: causative `-kan` ('làm GIÚP': `cucikan`, `setrikakan`, `bersihkan`) và bị động `di-(...-kan)` rất hay gặp trong dịch vụ (`dicuci`, `disetrika`, `dikeringkan`, `dibuang`). Hậu tố `-an` tạo danh từ đo lường/khối: `kiloan` (theo ký), `cucian` (đồ giặt). Đừng quên bậc `ribu` khi nói giá, và luôn dùng `tolong` + `Mbak/Bu` cho lịch sự.",
    tip_advice_en:
      "Five golden frames for laundry & cleaning: (1) ask service/price — `Mau laundry kiloan, berapa per kilo?`; (2) request politely with the `di-` passive — `Tolong dicuci dan disetrika` / `Tolong disapu dan dipel`; (3) caution — `Jangan dikeringkan pakai mesin` / `Tolong dipisah yang putih`; (4) ask time/cost — `Kira-kira selesainya kapan?` / `Semuanya berapa?`; (5) praise + thanks — `Wangi dan rapi, makasih ya`. Two core grammar points: the causative `-kan` ('do it FOR me': `cucikan`, `setrikakan`, `bersihkan`) and the passive `di-(...-kan)`, very common in service (`dicuci`, `disetrika`, `dikeringkan`, `dibuang`). The `-an` suffix builds measure/mass nouns: `kiloan` (by the kilo), `cucian` (the wash). Don't drop the `ribu` scale on prices, and always use `tolong` + `Mbak/Bu` to stay polite.",
    vocabulary: [
      {
        cell_id: "18c9b1f5-8ccf-47ea-b82f-35df1f195595",
        word: "laundry kiloan",
        en: "laundry charged by the kilo",
        vi: "giặt tính theo ký",
        pos: "noun phrase (-an)",
        pronunciation_vi: "LON-dri ki-LO-an — `kilo` + `-an`; hỏi `berapa per kilo?`",
        pronunciation_en: "LON-dree ki-LO-an — `kilo` + `-an`; ask `berapa per kilo?`",
      },
      {
        cell_id: "ba93ac9f-2a16-4ef3-8544-e234c2f1a5a0",
        word: "cuci",
        en: "to wash",
        vi: "giặt / rửa",
        pos: "verb",
        pronunciation_vi: "CU-ci — bị động `dicuci`; đồ giặt = `cucian`",
        pronunciation_en: "CHOO-chee — passive `dicuci`; the wash = `cucian`",
      },
      {
        cell_id: "b002c3a3-f01e-4b6d-94e9-cc342d1761d0",
        word: "setrika",
        en: "to iron / an iron",
        vi: "ủi (là) / bàn ủi",
        pos: "verb/noun",
        pronunciation_vi: "se-TRI-ka — bị động `disetrika`",
        pronunciation_en: "se-TREE-kah — passive `disetrika`",
      },
      {
        cell_id: "72b26228-00fb-4ccb-a716-b42baf0afeae",
        word: "noda",
        en: "stain",
        vi: "vết bẩn / vết ố",
        pos: "noun",
        pronunciation_vi: "NO-da — tẩy vết = `dihilangkan`",
        pronunciation_en: "NO-dah — remove a stain = `dihilangkan`",
      },
      {
        cell_id: "b69bc72b-2495-4ae3-abb9-deda9b779612",
        word: "bersih-bersih",
        en: "general tidying/cleaning",
        vi: "dọn dẹp lặt vặt",
        pos: "verb (reduplication)",
        pronunciation_vi: "ber-sih-BER-sih — láy của `bersih` (sạch)",
        pronunciation_en: "ber-sih-BER-sih — reduplication of `bersih` (clean)",
      },
      {
        cell_id: "543722ff-45b1-45d3-ad90-a4a0e8d3e51c",
        word: "menyapu",
        en: "to sweep",
        vi: "quét",
        pos: "verb (meN-)",
        pronunciation_vi: "me-NYA-pu — dụng cụ: `sapu` (cây chổi)",
        pronunciation_en: "me-NYAH-poo — tool: `sapu` (broom)",
      },
      {
        cell_id: "1a538d30-f7f3-4265-972c-6b934812792c",
        word: "mengepel",
        en: "to mop",
        vi: "lau sàn",
        pos: "verb (meN-)",
        pronunciation_vi: "me-nge-PEL — dụng cụ: `pel` (cây lau nhà)",
        pronunciation_en: "me-nge-PEL — tool: `pel` (mop)",
      },
      {
        cell_id: "58ddd0f3-5dce-4f92-9fb9-82c5cdf3bcbf",
        word: "membuang sampah",
        en: "to take out the trash",
        vi: "đổ rác",
        pos: "verb phrase",
        pronunciation_vi: "mem-BU-ang SAM-pah — để `ke depan` cho `tukang sampah`",
        pronunciation_en: "mem-BOO-ang SAM-pah — left `ke depan` for the `tukang sampah`",
      },
      {
        cell_id: "6b4c77e0-3cbc-4498-8150-3e774b9abc23",
        word: "asisten rumah tangga (ART)",
        en: "household helper",
        vi: "người giúp việc nhà",
        pos: "noun",
        pronunciation_vi: "a-SIS-ten RU-mah TANG-ga — gọi lịch sự `Mbak`/`Bu`",
        pronunciation_en: "ah-SIS-ten ROO-mah TAHNG-gah — addressed politely `Mbak`/`Bu`",
      },
      {
        cell_id: "e4db672f-0aed-4229-abc7-680008396a6f",
        word: "rapi",
        en: "neat / well-pressed",
        vi: "gọn gàng / phẳng phiu",
        pos: "adj.",
        pronunciation_vi: "RA-pi — khen giặt ủi: `wangi dan rapi`",
        pronunciation_en: "RAH-pee — laundry praise: `wangi dan rapi`",
      },
    ],
    dialogue: [
      {
        cell_id: "1e249ad7-2bc5-4700-98ae-213d8f46337e",
        speaker: "Pelanggan",
        text: "Mbak, mau laundry kiloan. Ini ada lima kilo. Berapa per kilo?",
        vi: "Chị ơi, tôi muốn giặt tính ký. Đây có năm ký. Bao nhiêu một ký?",
        en: "Hi, laundry by the kilo. This is five kilos. How much per kilo?",
      },
      {
        cell_id: "0fb7b828-55b0-4086-8b5a-fc6c23760945",
        speaker: "Petugas",
        text: "Tujuh ribu per kilo, Mas. Mau yang biasa atau express?",
        vi: "Bảy nghìn một ký, anh. Muốn loại thường hay lấy nhanh?",
        en: "Seven thousand per kilo. Regular or express?",
      },
      {
        cell_id: "32e2b95a-008d-4ee1-9a6e-30acd0dba5aa",
        speaker: "Pelanggan",
        text: "Yang biasa saja. Tapi yang ini jangan dikeringkan pakai mesin, ya. Ada noda juga, bisa dihilangkan?",
        vi: "Loại thường thôi. Nhưng cái này đừng sấy máy nhé. Có vết bẩn nữa, tẩy được không?",
        en: "Regular's fine. But don't machine-dry this one. There's a stain too — can it be removed?",
      },
      {
        cell_id: "2ae85570-19f3-413e-9d3f-0f1aaa174c89",
        speaker: "Petugas",
        text: "Bisa, kami coba hilangkan. Selesainya besok sore.",
        vi: "Được, chúng tôi sẽ thử tẩy. Mai chiều xong.",
        en: "Yes, we'll try to get it out. Ready tomorrow afternoon.",
      },
      {
        cell_id: "8fe90e20-fd16-4aad-93ff-55708f967d25",
        speaker: "Pelanggan",
        text: "Oke. Semuanya berapa? Bisa QRIS?",
        vi: "Được. Tất cả bao nhiêu? QRIS được không?",
        en: "Okay. How much altogether? Does QRIS work?",
      },
      {
        cell_id: "8fbca12b-fba8-44f2-b892-8ce5190f0dc3",
        speaker: "Petugas",
        text: "Tiga puluh lima ribu. Bisa QRIS atau tunai.",
        vi: "Ba lăm nghìn. QRIS hay tiền mặt đều được.",
        en: "Thirty-five thousand. QRIS or cash.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chị ơi, giặt tính ký bao nhiêu một ký?", answer: "Mbak, laundry kiloan berapa per kilo?" },
          { prompt: "Đống đồ này làm ơn giặt và ủi giúp nhé.", answer: "Cucian ini tolong dicuci dan disetrika, ya." },
          { prompt: "Cái này đừng sấy bằng máy nhé.", answer: "Yang ini jangan dikeringkan pakai mesin, ya." },
          { prompt: "Khoảng khi nào xong vậy chị?", answer: "Kira-kira selesainya kapan, Mbak?" },
          { prompt: "Thơm và gọn gàng, cảm ơn chị nhiều nhé!", answer: "Wangi dan rapi, makasih banyak, ya, Mbak!" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dọn dẹp nhà:",
        instruction_en: "Extra practice — house cleaning:",
        items: [
          { prompt: "Hôm nay giúp dọn dẹp nhà cửa nhé.", answer: "Tolong bantu bersih-bersih rumah hari ini." },
          { prompt: "Làm ơn quét và lau sàn nhé.", answer: "Tolong sapu dan pel lantainya, ya." },
          { prompt: "Rác làm ơn đem bỏ ra phía trước nhé.", answer: "Sampahnya tolong dibuang ke depan, ya." },
          { prompt: "Làm ơn cọ nhà tắm cho thật sạch.", answer: "Kamar mandinya tolong disikat sampai bersih." },
          { prompt: "Làm ơn tách riêng đồ trắng và đồ màu.", answer: "Tolong dipisah yang putih dan yang berwarna." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Đổi sang dạng BỊ ĐỘNG `di-` dùng khi nhờ dịch vụ: `cuci` → ___, `setrika` → ___, `kering` (+kan) → ___, `buang` → ___.",
        instruction_en:
          "Give the `di-` PASSIVE used for service requests: `cuci` → ___, `setrika` → ___, `kering` (+kan) → ___, `buang` → ___.",
        items: [
          { prompt: "cuci (giặt) →", answer: "dicuci" },
          { prompt: "setrika (ủi) →", answer: "disetrika" },
          { prompt: "kering (làm khô) →", answer: "dikeringkan" },
          { prompt: "buang (vứt) →", answer: "dibuang" },
        ],
      },
      {
        type: "term_match",
        instruction_vi: "Ghép từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "laundry kiloan", answer: "giặt tính theo ký (laundry by the kilo)" },
          { prompt: "noda", answer: "vết bẩn / vết ố (stain)" },
          { prompt: "menyapu", answer: "quét (to sweep)" },
          { prompt: "mengepel", answer: "lau sàn (to mop)" },
          { prompt: "ART / asisten rumah tangga", answer: "người giúp việc nhà (household helper)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung gửi đồ giặt — điền chỗ trống: `Mbak, mau laundry kiloan. Tolong ___ dan ___. Yang ini jangan ___. Kira-kira selesainya kapan?`",
        instruction_en:
          "Drop-off frame — fill the blanks: `Mbak, mau laundry kiloan. Tolong ___ dan ___. Yang ini jangan ___. Kira-kira selesainya kapan?`",
        example:
          "Mbak, mau laundry kiloan. Tolong dicuci dan disetrika. Yang ini jangan dikeringkan pakai mesin. Kira-kira selesainya kapan?",
        example_vi:
          "Chị ơi, giặt tính ký nhé. Làm ơn giặt và ủi. Cái này đừng sấy máy. Khoảng khi nào xong?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra ở tiệm giặt / khi dọn nhà — bạn làm được chưa?",
        instruction_en: "Quick laundry/cleaning self-check — can you do each one?",
        items: [
          { vi: "Tôi hỏi `laundry kiloan` và `berapa per kilo?`.", en: "I ask for `laundry kiloan` and `berapa per kilo?`." },
          { vi: "Tôi nhờ vả bằng thể bị động `di-` (`dicuci`, `disetrika`).", en: "I request with the `di-` passive (`dicuci`, `disetrika`)." },
          { vi: "Tôi dặn dò bằng `jangan di-...kan` (`jangan dikeringkan`).", en: "I caution with `jangan di-...kan` (`jangan dikeringkan`)." },
          { vi: "Tôi dùng đúng từ dọn dẹp: `sapu`, `pel`, `sikat`, `buang sampah`.", en: "I use the right cleaning verbs: `sapu`, `pel`, `sikat`, `buang sampah`." },
          { vi: "Tôi nói giá có bậc `ribu` và hỏi `QRIS bisa?`.", en: "I say prices with `ribu` and ask `QRIS bisa?`." },
          { vi: "Tôi nói chuyện lịch sự với `Mbak/Bu` + `tolong`, không ra lệnh trống.", en: "I speak politely with `Mbak/Bu` + `tolong`, never bare commands." },
        ],
      },
    ],
  },
];

export default lessons;
