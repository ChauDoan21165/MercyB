// Road Trip Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, passive-active.ts…),
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
// Topic: a road trip across Java — renting a car (`sewa mobil`), toll roads (`tol`),
// gas stations (`SPBU`), rest areas (`rest area`), the `Mudik` holiday exodus, and
// roadside attractions. For Vietnamese speakers the wins are familiar (no conjugation,
// no tones, noun-before-adjective). The traps: `di` (at) ≠ `ke` (to), `naik` for all
// transport, and the di- passive in road/traffic signs (`dilarang parkir`).

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
    id: "indonesian_road_trip",
    level: "A2",
    category: "travel",
    title_vi: "Chuyến đi đường dài bằng ô tô",
    title_en: "Road trip",
    sentences: [
      // ── Renting a car ───────────────────────────────────────────────────
      {
        en: "Saya mau sewa mobil untuk tiga hari.",
        vi: "Tôi muốn thuê ô tô trong ba ngày.",
        pronunciation_focus: [
          "SA-ya mau SE-wa mo-BIL un-TUK ti-GA HA-ri — `sewa` = thuê; `mobil` = ô tô; `untuk tiga hari` = trong ba ngày.",
          "Lợi thế người Việt: không chia động từ — `saya mau sewa` ngắn y như 'tôi muốn thuê'.",
          "Lỗi người Việt: nói `sewa untuk tiga malam` khi thuê xe. Thuê xe đếm theo `hari` (ngày), không `malam` (đêm như khách sạn).",
          "Luyện: `Saya mau sewa mobil untuk tiga hari.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau SE-wa mo-BIL un-TUK ti-GA HA-ri — `sewa` = to rent; `mobil` = car; `untuk tiga hari` = for three days.",
          "VN-speaker win: no conjugation — `saya mau sewa` is as short as 'I want to rent'.",
          "VN-speaker trap: `sewa untuk tiga malam` for a car. Car rental counts in `hari` (days), not `malam` (nights, like hotels).",
          "Drill: `Saya mau sewa mobil untuk tiga hari.`",
        ],
      },
      {
        en: "Apakah harga sewa sudah termasuk sopir dan bensin?",
        vi: "Giá thuê đã bao gồm tài xế và xăng chưa ạ?",
        pronunciation_focus: [
          "a-pa-KAH HAR-ga SE-wa SU-dah ter-MA-suk SO-pir dan BEN-sin — `sopir` = tài xế; `bensin` = xăng; `sudah termasuk?` = đã bao gồm chưa?",
          "Mẹo: `lepas kunci` = thuê xe tự lái (không tài xế); có tài xế thì nói `dengan sopir`.",
          "Lỗi người Việt: đặt `berapa` sai chỗ. Hỏi giá: `Berapa harga sewa?` (`berapa` đứng trước).",
          "Luyện: `Apakah harga sewa sudah termasuk sopir dan bensin?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH HAR-ga SE-wa SU-dah ter-MA-suk SO-pir dan BEN-sin — `sopir` = driver; `bensin` = gasoline; `sudah termasuk?` = is it included?",
          "Tip: `lepas kunci` = self-drive rental (no driver); for one with a driver say `dengan sopir`.",
          "VN-speaker trap: misplacing `berapa`. Ask the price: `Berapa harga sewa?` (`berapa` first).",
          "Drill: `Apakah harga sewa sudah termasuk sopir dan bensin?`",
        ],
      },
      // ── Toll road & navigation ──────────────────────────────────────────
      {
        en: "Kita lewat jalan tol biar lebih cepat.",
        vi: "Mình đi đường cao tốc cho nhanh hơn.",
        pronunciation_focus: [
          "KI-ta LE-wat JA-lan tol bi-AR LE-bih ce-PAT — `lewat` = đi qua; `jalan tol` = đường cao tốc thu phí; `biar` = cho/để (khẩu ngữ của `agar`).",
          "Mẹo: `kita` = chúng ta (GỒM người nghe) — hợp khi rủ bạn đồng hành. Khác `kami` (không gồm người nghe).",
          "Lỗi người Việt: dùng `kami` khi rủ chính người đang nói chuyện. Đi cùng nhau → `kita`.",
          "Luyện: `Kita lewat jalan tol biar lebih cepat.`",
        ],
        pronunciation_focus_en: [
          "KI-ta LE-wat JA-lan tol bi-AR LE-bih ce-PAT — `lewat` = to go via; `jalan tol` = toll highway; `biar` = so that (casual for `agar`).",
          "Tip: `kita` = we (INCLUDING the listener) — right when inviting your travel buddy. Unlike `kami` (excludes the listener).",
          "VN-speaker trap: using `kami` when you mean the person you're talking to. Going together → `kita`.",
          "Drill: `Kita lewat jalan tol biar lebih cepat.`",
        ],
      },
      {
        en: "Jangan lupa siapkan kartu e-toll untuk bayar tol.",
        vi: "Đừng quên chuẩn bị thẻ e-toll để trả phí cao tốc.",
        pronunciation_focus: [
          "JA-ngan LU-pa si-AP-kan KAR-tu e-tol un-TUK BA-yar tol — `siapkan` = chuẩn bị (gốc `siap` + `-kan`); `kartu e-toll` = thẻ thu phí không dừng.",
          "Mẹo: cổng thu phí Indonesia gần như chỉ nhận thẻ `e-toll` (không tiền mặt) — nhớ nạp tiền (`top up`) trước.",
          "Lỗi người Việt: dùng `tidak` cho mệnh lệnh cấm. 'Đừng quên' = `jangan lupa`, KHÔNG `tidak lupa`.",
          "Luyện: `Jangan lupa siapkan kartu e-toll untuk bayar tol.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan LU-pa si-AP-kan KAR-tu e-tol un-TUK BA-yar tol — `siapkan` = to prepare (root `siap` + `-kan`); `kartu e-toll` = electronic toll card.",
          "Tip: Indonesian toll gates are nearly all `e-toll` (cashless) — remember to top up beforehand.",
          "VN-speaker trap: using `tidak` for a prohibition. 'Don't forget' = `jangan lupa`, NOT `tidak lupa`.",
          "Drill: `Jangan lupa siapkan kartu e-toll untuk bayar tol.`",
        ],
      },
      {
        en: "Belok kiri di pertigaan, lalu lurus saja.",
        vi: "Rẽ trái ở ngã ba, rồi cứ đi thẳng.",
        pronunciation_focus: [
          "BE-lok KI-ri di per-ti-GA-an, LA-lu LU-rus SA-ja — `belok kiri/kanan` = rẽ trái/phải; `pertigaan` = ngã ba; `lurus` = thẳng; `saja` = thôi/cứ.",
          "Mẹo: `pertigaan` (ngã ba) từ `tiga` (3); `perempatan` (ngã tư) từ `empat` (4). Đếm theo số nhánh.",
          "Lỗi người Việt: dùng `ke kiri` khi chỉ hướng rẽ. Tự nhiên hơn là `belok kiri` (động từ + hướng).",
          "Luyện: `Belok kiri di pertigaan, lalu lurus saja.`",
        ],
        pronunciation_focus_en: [
          "BE-lok KI-ri di per-ti-GA-an, LA-lu LU-rus SA-ja — `belok kiri/kanan` = turn left/right; `pertigaan` = T-junction; `lurus` = straight; `saja` = just.",
          "Tip: `pertigaan` (3-way) from `tiga` (3); `perempatan` (4-way) from `empat` (4). Counted by branches.",
          "VN-speaker trap: `ke kiri` for the turn. More natural is `belok kiri` (verb + direction).",
          "Drill: `Belok kiri di pertigaan, lalu lurus saja.`",
        ],
      },
      // ── Gas station & rest area ─────────────────────────────────────────
      {
        en: "Kita mampir ke SPBU dulu, bensinnya hampir habis.",
        vi: "Mình ghé cây xăng trước đã, sắp hết xăng rồi.",
        pronunciation_focus: [
          "KI-ta mam-PIR ke es-pe-be-U DU-lu, BEN-sin-nya HAM-pir ha-BIS — `mampir` = ghé qua; `SPBU` đọc 'es-pe-be-u' = trạm xăng; `hampir habis` = sắp hết.",
          "Mẹo: `SPBU` = Stasiun Pengisian Bahan Bakar Umum; người ta cũng gọi tắt 'Pertamina' (hãng xăng quốc gia).",
          "Lỗi người Việt: dùng `di SPBU` khi ý là 'GHÉ ĐẾN' trạm. Di chuyển đến → `ke SPBU`.",
          "Luyện: `Kita mampir ke SPBU dulu, bensinnya hampir habis.`",
        ],
        pronunciation_focus_en: [
          "KI-ta mam-PIR ke es-pe-be-U DU-lu, BEN-sin-nya HAM-pir ha-BIS — `mampir` = to stop by; `SPBU` said 'es-pe-be-oo' = gas station; `hampir habis` = almost out.",
          "Tip: `SPBU` = Stasiun Pengisian Bahan Bakar Umum; people also just say 'Pertamina' (the national fuel brand).",
          "VN-speaker trap: `di SPBU` when you mean 'stop BY' the station. Movement toward → `ke SPBU`.",
          "Drill: `Kita mampir ke SPBU dulu, bensinnya hampir habis.`",
        ],
      },
      {
        en: "Tolong isi full, yang Pertamax ya, Mas.",
        vi: "Đổ đầy bình giúp em, loại Pertamax nhé anh.",
        pronunciation_focus: [
          "TO-long I-si full, yang per-ta-MAX ya, mas — `isi` = đổ/làm đầy; `isi full` = đổ đầy bình; `Pertamax` = loại xăng cao cấp.",
          "Mẹo: gọi nhân viên trạm là `Mas` (anh); xăng phổ biến: `Pertalite` (thường), `Pertamax` (cao cấp), `Solar`/`Dexlite` (dầu diesel).",
          "Lỗi người Việt: bỏ `tolong` khi nhờ. `Tolong isi full` lịch sự hơn `isi full`.",
          "Luyện: `Tolong isi full, yang Pertamax ya, Mas.`",
        ],
        pronunciation_focus_en: [
          "TO-long I-si full, yang per-ta-MAX ya, mas — `isi` = to fill; `isi full` = fill the tank; `Pertamax` = premium petrol grade.",
          "Tip: call the attendant `Mas` (sir/bro); common fuels: `Pertalite` (regular), `Pertamax` (premium), `Solar`/`Dexlite` (diesel).",
          "VN-speaker trap: dropping `tolong` when asking. `Tolong isi full` is politer than `isi full`.",
          "Drill: `Tolong isi full, yang Pertamax ya, Mas.`",
        ],
      },
      {
        en: "Kita istirahat sebentar di rest area, saya mau ke toilet.",
        vi: "Mình nghỉ một chút ở trạm dừng, tôi muốn đi vệ sinh.",
        pronunciation_focus: [
          "KI-ta is-ti-RA-hat se-ben-TAR di rest area, SA-ya mau ke to-i-LET — `istirahat` = nghỉ; `rest area` (giữ tiếng Anh) = trạm dừng nghỉ trên cao tốc; `toilet` = nhà vệ sinh.",
          "Mẹo: trạm dừng (`rest area`) trên đường mudik thường có `musala` (phòng cầu nguyện), `SPBU`, và quán ăn.",
          "Lỗi người Việt: nói `di toilet` khi ý là 'ĐI đến nhà vệ sinh'. Đi đến nơi → `ke toilet`.",
          "Luyện: `Kita istirahat sebentar di rest area, saya mau ke toilet.`",
        ],
        pronunciation_focus_en: [
          "KI-ta is-ti-RA-hat se-ben-TAR di rest area, SA-ya mau ke to-i-LET — `istirahat` = to rest; `rest area` (kept in English) = highway rest stop; `toilet` = restroom.",
          "Tip: rest areas on mudik routes usually have a `musala` (prayer room), an `SPBU`, and food stalls.",
          "VN-speaker trap: `di toilet` when you mean going 'TO the restroom'. Toward a place → `ke toilet`.",
          "Drill: `Kita istirahat sebentar di rest area, saya mau ke toilet.`",
        ],
      },
      // ── Traffic & signs ─────────────────────────────────────────────────
      {
        en: "Awas, di depan ada tanda 'dilarang parkir'.",
        vi: "Coi chừng, phía trước có biển 'cấm đỗ xe'.",
        pronunciation_focus: [
          "A-was, di de-PAN A-da TAN-da di-la-RANG PAR-kir — `awas` = coi chừng; `dilarang` = bị cấm (bị động `di-`); `parkir` = đỗ xe.",
          "Mẹo: biển báo đầy thể bị động `di-`: `dilarang parkir` (cấm đỗ), `dilarang masuk` (cấm vào), `dilarang berhenti` (cấm dừng).",
          "Lỗi người Việt: nói `tidak parkir`. Biển cấm dùng `dilarang` + động từ, không `tidak`.",
          "Luyện: `Awas, di depan ada tanda 'dilarang parkir'.`",
        ],
        pronunciation_focus_en: [
          "A-was, di de-PAN A-da TAN-da di-la-RANG PAR-kir — `awas` = watch out; `dilarang` = forbidden (di- passive); `parkir` = to park.",
          "Tip: road signs are full of the di- passive: `dilarang parkir` (no parking), `dilarang masuk` (no entry), `dilarang berhenti` (no stopping).",
          "VN-speaker trap: `tidak parkir`. Prohibition signs use `dilarang` + verb, not `tidak`.",
          "Drill: `Awas, di depan ada tanda 'dilarang parkir'.`",
        ],
      },
      {
        en: "Jalanan macet total karena arus mudik.",
        vi: "Đường kẹt cứng vì dòng người về quê.",
        pronunciation_focus: [
          "ja-la-NAN ma-CET to-TAL ka-RE-na A-rus MU-dik — `macet` = kẹt xe; `karena` = vì; `arus mudik` = dòng người về quê dịp lễ.",
          "Mẹo: `mudik` = về quê ăn lễ (nhất là Lebaran); `arus balik` = dòng người quay lại thành phố sau lễ.",
          "Lỗi người Việt: dùng `kemacetan` (danh từ: sự kẹt xe) sai chỗ. Tả tình trạng: `jalanan macet` (đường (bị) kẹt).",
          "Luyện: `Jalanan macet total karena arus mudik.`",
        ],
        pronunciation_focus_en: [
          "ja-la-NAN ma-CET to-TAL ka-RE-na A-rus MU-dik — `macet` = jammed; `karena` = because; `arus mudik` = the holiday homebound traffic flow.",
          "Tip: `mudik` = going home for the holidays (especially Lebaran); `arus balik` = the return flow back to the cities after.",
          "VN-speaker trap: misusing `kemacetan` (noun: a traffic jam). To describe the state: `jalanan macet` (the road is jammed).",
          "Drill: `Jalanan macet total karena arus mudik.`",
        ],
      },
      // ── Roadside attractions ────────────────────────────────────────────
      {
        en: "Di sepanjang jalan banyak penjual oleh-oleh khas daerah.",
        vi: "Dọc đường có nhiều người bán đặc sản vùng miền.",
        pronunciation_focus: [
          "di se-pan-JANG JA-lan BA-nyak pen-JU-al o-leh-O-leh khas da-E-rah — `sepanjang jalan` = dọc đường; `khas daerah` = đặc trưng địa phương; `oleh-oleh` = quà đặc sản.",
          "Mẹo: `khas` = đặc trưng/đặc sản: `makanan khas Bandung` = món đặc sản Bandung.",
          "Lỗi người Việt: đặt `banyak` sau danh từ kiểu tiếng Việt ('người bán nhiều'). Tiếng Indonesia: `banyak penjual` (`banyak` trước).",
          "Luyện: `Di sepanjang jalan banyak penjual oleh-oleh khas daerah.`",
        ],
        pronunciation_focus_en: [
          "di se-pan-JANG JA-lan BA-nyak pen-JU-al o-leh-O-leh khas da-E-rah — `sepanjang jalan` = along the road; `khas daerah` = local specialty; `oleh-oleh` = food souvenirs.",
          "Tip: `khas` = characteristic/specialty: `makanan khas Bandung` = Bandung's specialty food.",
          "VN-speaker trap: putting `banyak` after the noun Vietnamese-style. In Indonesian: `banyak penjual` (`banyak` first).",
          "Drill: `Di sepanjang jalan banyak penjual oleh-oleh khas daerah.`",
        ],
      },
      {
        en: "Ban mobilnya kempes, kita harus cari bengkel terdekat.",
        vi: "Lốp xe bị xẹp, mình phải tìm tiệm sửa xe gần nhất.",
        pronunciation_focus: [
          "ban mo-BIL-nya KEM-pes, KI-ta HA-rus CA-ri beng-KEL ter-DE-kat — `ban` = lốp; `kempes` = xẹp/hết hơi; `bengkel` = tiệm sửa xe; `terdekat` = gần nhất.",
          "Mẹo: `ter-` + tính từ = so sánh nhất: `terdekat` (gần nhất), `terbesar` (lớn nhất), `termurah` (rẻ nhất).",
          "Lỗi người Việt: nói `paling dekat bengkel`. Trật tự: `bengkel terdekat` (danh từ + `ter-` tính từ).",
          "Luyện: `Ban mobilnya kempes, kita harus cari bengkel terdekat.`",
        ],
        pronunciation_focus_en: [
          "ban mo-BIL-nya KEM-pes, KI-ta HA-rus CA-ri beng-KEL ter-DE-kat — `ban` = tire; `kempes` = flat/deflated; `bengkel` = repair shop; `terdekat` = nearest.",
          "Tip: `ter-` + adjective = superlative: `terdekat` (nearest), `terbesar` (biggest), `termurah` (cheapest).",
          "VN-speaker trap: `paling dekat bengkel`. Order: `bengkel terdekat` (noun + `ter-` adjective).",
          "Drill: `Ban mobilnya kempes, kita harus cari bengkel terdekat.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Đi ô tô đường dài ở Indonesia chủ yếu là trên đảo Java, nơi có mạng đường cao tốc thu phí (`jalan tol`) nối các thành phố lớn — gần như chỉ thanh toán bằng thẻ `e-toll` chạm, nên phải nạp tiền (`top up`) trước. Thuê xe có hai kiểu: `lepas kunci` (tự lái) và `dengan sopir` (có tài xế) — nhiều người chọn có tài xế vì giao thông đông và đường lạ. Trạm xăng `SPBU` (thường của `Pertamina`) có nhân viên đổ xăng tận nơi; bạn chỉ cần nói loại (`Pertalite`, `Pertamax`) và `isi full`. Trên cao tốc có `rest area` để nghỉ, ăn, đổ xăng và cầu nguyện (`musala`). Cao điểm là mùa `mudik` — hàng triệu người lái xe về quê ăn lễ `Lebaran`, gây kẹt xe (`macet`) khủng khiếp; chiều ngược lại sau lễ gọi là `arus balik`. Dọc đường có vô số quầy bán `oleh-oleh khas daerah` (đặc sản vùng) — dừng mua quà về là nét văn hóa. Biển báo giao thông dùng thể bị động `di-`: `dilarang parkir`, `dilarang masuk` — nhận ra `dilarang` (bị cấm) để khỏi bị phạt (`tilang`).",
    cultural_notes_en:
      "Long-distance driving in Indonesia is mostly on Java, which has a network of toll highways (`jalan tol`) linking the big cities — payment is almost entirely by tap-card `e-toll`, so you must top up beforehand. Car rental comes two ways: `lepas kunci` (self-drive) and `dengan sopir` (with a driver) — many choose a driver because of heavy traffic and unfamiliar roads. `SPBU` gas stations (usually `Pertamina`) have attendants who pump for you; you just state the grade (`Pertalite`, `Pertamax`) and say `isi full`. Highways have `rest area`s for breaks, food, fuel, and prayer (`musala`). The peak is `mudik` season — millions drive home for the `Lebaran` holiday, causing brutal jams (`macet`); the return wave afterward is `arus balik`. Roadsides are lined with stalls selling `oleh-oleh khas daerah` (local specialties) — stopping for gifts is part of the culture. Traffic signs use the di- passive: `dilarang parkir`, `dilarang masuk` — recognizing `dilarang` (forbidden) keeps you from a ticket (`tilang`).",
    tip_advice_vi:
      "Bốn 'việc sống còn' cho chuyến road trip: (1) thuê xe & hỏi điều kiện — `Saya mau sewa mobil …`, `Sudah termasuk sopir/bensin?`; (2) chỉ đường — `belok kiri/kanan di pertigaan`, `lurus saja`; (3) đổ xăng & nghỉ — `mampir ke SPBU`, `tolong isi full`, `istirahat di rest area`; (4) sự cố — `ban kempes`, `cari bengkel terdekat`. Nhớ ba khác biệt cốt lõi: `di` (ở) ≠ `ke` (đến) — đi ĐẾN trạm là `ke SPBU`; `kita` (gồm bạn đồng hành) ≠ `kami`; và `jangan` (đừng) / `dilarang` (bị cấm) ≠ `tidak` (không). Thuê xe đếm theo `hari` (ngày), khách sạn đếm theo `malam` (đêm). Biển báo và bảng điện đầy bị động `di-` (`dilarang …`) — nhận ra nó để an toàn. Tin vui: không chia thì, không thanh điệu, danh từ trước tính từ như tiếng Việt (`mobil merah` = xe màu đỏ).",
    tip_advice_en:
      "Four 'survival' jobs for a road trip: (1) rent & ask terms — `Saya mau sewa mobil …`, `Sudah termasuk sopir/bensin?`; (2) give directions — `belok kiri/kanan di pertigaan`, `lurus saja`; (3) fuel & rest — `mampir ke SPBU`, `tolong isi full`, `istirahat di rest area`; (4) trouble — `ban kempes`, `cari bengkel terdekat`. Keep three core distinctions straight: `di` (at) ≠ `ke` (to) — going TO the station is `ke SPBU`; `kita` (includes your travel buddy) ≠ `kami`; and `jangan` (don't) / `dilarang` (forbidden) ≠ `tidak` (not). Car rental counts in `hari` (days), hotels in `malam` (nights). Signs and boards are full of the di- passive (`dilarang …`) — recognize it for safety. Good news: no tense, no tones, noun-before-adjective like Vietnamese (`mobil merah` = red car).",
    vocabulary: [
      // ── Renting & the car ───────────────────────────────────────────
      {
        word: "sewa mobil",
        en: "to rent a car",
        vi: "thuê ô tô",
        pos: "verb phrase",
        pronunciation_vi: "SE-wa mo-BIL — `lepas kunci` = tự lái; `dengan sopir` = có tài xế",
        pronunciation_en: "SE-wa mo-BIL — `lepas kunci` = self-drive; `dengan sopir` = with driver",
      },
      {
        word: "sopir",
        en: "driver",
        vi: "tài xế",
        pos: "noun",
        pronunciation_vi: "SO-pir — mượn từ 'chauffeur'; đọc rõ `r` cuối",
        pronunciation_en: "SO-pir — from 'chauffeur'; sound the final `r`",
      },
      {
        word: "bensin",
        en: "gasoline / fuel",
        vi: "xăng",
        pos: "noun",
        pronunciation_vi: "BEN-sin — `bensin habis` = hết xăng",
        pronunciation_en: "BEN-sin — `bensin habis` = out of fuel",
      },
      {
        word: "ban",
        en: "tire",
        vi: "lốp xe",
        pos: "noun",
        pronunciation_vi: "ban — `ban kempes` = lốp xẹp; `ban bocor` = lốp thủng",
        pronunciation_en: "ban — `ban kempes` = flat tire; `ban bocor` = punctured tire",
      },
      // ── Roads & tolls ───────────────────────────────────────────────
      {
        word: "jalan tol",
        en: "toll highway",
        vi: "đường cao tốc thu phí",
        pos: "noun phrase",
        pronunciation_vi: "JA-lan tol — trả bằng `kartu e-toll`",
        pronunciation_en: "JA-lan tol — paid with an `e-toll` card",
      },
      {
        word: "e-toll",
        en: "electronic toll card",
        vi: "thẻ thu phí không dừng",
        pos: "noun",
        pronunciation_vi: "i-tol — chạm để trả; nhớ `top up` trước",
        pronunciation_en: "ee-tol — tap to pay; remember to `top up` first",
      },
      {
        word: "gerbang tol",
        en: "toll gate",
        vi: "trạm thu phí",
        pos: "noun phrase",
        pronunciation_vi: "ger-BANG tol — `gerbang` = cổng",
        pronunciation_en: "ger-BANG tol — `gerbang` = gate",
      },
      {
        word: "macet",
        en: "traffic jam / jammed",
        vi: "kẹt xe",
        pos: "adjective",
        pronunciation_vi: "ma-CET — `macet total` = kẹt cứng; danh từ: `kemacetan`",
        pronunciation_en: "ma-CET — `macet total` = total gridlock; noun: `kemacetan`",
      },
      // ── Stops & fuel ────────────────────────────────────────────────
      {
        word: "SPBU",
        en: "gas station",
        vi: "trạm xăng",
        pos: "noun (acronym)",
        pronunciation_vi: "es-pe-be-U — Stasiun Pengisian Bahan Bakar Umum; 'Pertamina'",
        pronunciation_en: "es-pe-be-OO — Stasiun Pengisian Bahan Bakar Umum; 'Pertamina'",
      },
      {
        word: "rest area",
        en: "rest stop",
        vi: "trạm dừng nghỉ",
        pos: "noun",
        pronunciation_vi: "rest A-ri-a — giữ tiếng Anh; có toilet, musala, quán ăn",
        pronunciation_en: "rest AIR-ee-a — kept in English; has toilets, prayer room, food",
      },
      {
        word: "mampir",
        en: "to stop by / drop in",
        vi: "ghé qua",
        pos: "verb",
        pronunciation_vi: "mam-PIR — `mampir ke SPBU` = ghé trạm xăng",
        pronunciation_en: "mam-PIR — `mampir ke SPBU` = stop by the station",
      },
      {
        word: "istirahat",
        en: "to rest",
        vi: "nghỉ ngơi",
        pos: "verb",
        pronunciation_vi: "is-ti-RA-hat — `istirahat sebentar` = nghỉ một chút",
        pronunciation_en: "is-ti-RA-hat — `istirahat sebentar` = rest a moment",
      },
      {
        word: "bengkel",
        en: "repair shop / garage",
        vi: "tiệm sửa xe",
        pos: "noun",
        pronunciation_vi: "beng-KEL — `bengkel terdekat` = tiệm gần nhất",
        pronunciation_en: "beng-KEL — `bengkel terdekat` = the nearest garage",
      },
      // ── Directions ──────────────────────────────────────────────────
      {
        word: "belok kiri / kanan",
        en: "turn left / right",
        vi: "rẽ trái / phải",
        pos: "verb phrase",
        pronunciation_vi: "BE-lok KI-ri / KA-nan — `belok` = rẽ",
        pronunciation_en: "BE-lok KI-ri / KA-nan — `belok` = to turn",
      },
      {
        word: "lurus",
        en: "straight ahead",
        vi: "đi thẳng",
        pos: "adverb",
        pronunciation_vi: "LU-rus — `lurus saja` = cứ đi thẳng",
        pronunciation_en: "LOO-roos — `lurus saja` = just go straight",
      },
      {
        word: "pertigaan / perempatan",
        en: "T-junction / crossroads",
        vi: "ngã ba / ngã tư",
        pos: "noun",
        pronunciation_vi: "per-ti-GA-an / per-em-PA-tan — từ `tiga` (3) / `empat` (4)",
        pronunciation_en: "per-ti-GA-an / per-em-PA-tan — from `tiga` (3) / `empat` (4)",
      },
      {
        word: "putar balik",
        en: "to make a U-turn",
        vi: "quay đầu xe",
        pos: "verb phrase",
        pronunciation_vi: "PU-tar BA-lik — biển 'U-turn' ghi tắt `putar balik`",
        pronunciation_en: "POO-tar BA-lik — U-turn signs read `putar balik`",
      },
      // ── Signs & mudik ───────────────────────────────────────────────
      {
        word: "dilarang parkir",
        en: "no parking",
        vi: "cấm đỗ xe",
        pos: "sign (di- passive)",
        pronunciation_vi: "di-la-RANG PAR-kir — `dilarang` = bị cấm",
        pronunciation_en: "di-la-RANG PAR-kir — `dilarang` = forbidden",
      },
      {
        word: "mudik",
        en: "holiday homecoming exodus",
        vi: "về quê dịp lễ",
        pos: "noun/verb",
        pronunciation_vi: "MU-dik — về quê ăn Lebaran; ngược lại: `arus balik`",
        pronunciation_en: "MOO-dik — going home for Lebaran; reverse: `arus balik`",
      },
      {
        word: "oleh-oleh khas daerah",
        en: "regional specialty souvenirs",
        vi: "đặc sản vùng miền",
        pos: "noun phrase",
        pronunciation_vi: "o-leh-O-leh khas da-E-rah — `khas` = đặc trưng",
        pronunciation_en: "o-leh-O-leh khas da-E-rah — `khas` = characteristic",
      },
      {
        word: "tilang",
        en: "traffic ticket / fine",
        vi: "phạt giao thông",
        pos: "noun",
        pronunciation_vi: "TI-lang — viết tắt 'bukti pelanggaran'; bị cảnh sát phạt",
        pronunciation_en: "TEE-lang — short for 'bukti pelanggaran'; a police fine",
      },
    ],
    dialogue: [
      // Dialogue: two friends on a Java road trip, hitting mudik traffic
      {
        speaker: "Budi",
        text: "Kita berangkat pagi ya, biar tidak kena macet mudik.",
        vi: "Mình khởi hành sớm nhé, để khỏi dính kẹt xe mùa về quê.",
        en: "Let's leave early so we don't hit the mudik traffic.",
      },
      {
        speaker: "Toan",
        text: "Setuju. Mobil sewaannya sudah saya isi full tadi di SPBU.",
        vi: "Đồng ý. Xe thuê tôi đã đổ đầy bình ở cây xăng rồi.",
        en: "Agreed. I already filled up the rental car at the gas station.",
      },
      {
        speaker: "Budi",
        text: "Mantap. Kartu e-tollnya sudah di-top up? Kita lewat tol semua.",
        vi: "Tuyệt. Thẻ e-toll nạp tiền chưa? Mình đi cao tốc suốt.",
        en: "Great. Is the e-toll card topped up? We'll take tolls the whole way.",
      },
      {
        speaker: "Toan",
        text: "Sudah. Eh, di depan macet total. Kita mampir rest area dulu saja?",
        vi: "Rồi. Ơ, phía trước kẹt cứng. Mình ghé trạm dừng nghỉ trước đã nhé?",
        en: "Done. Oh, it's gridlocked ahead. Should we just stop by the rest area first?",
      },
      {
        speaker: "Budi",
        text: "Boleh, saya juga mau ke toilet. Sekalian beli oleh-oleh khas sini.",
        vi: "Được, tôi cũng muốn đi vệ sinh. Tiện thể mua đặc sản ở đây.",
        en: "Sure, I need the restroom too. And let's grab some local souvenirs.",
      },
      {
        speaker: "Toan",
        text: "Oke. Nanti setelah perempatan, belok kanan ke bengkel — bannya agak kempes.",
        vi: "Ok. Lát qua ngã tư, rẽ phải vào tiệm sửa xe — lốp hơi xẹp.",
        en: "Okay. After the crossroads, turn right to a garage — the tire's a bit flat.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn thuê ô tô trong ba ngày.", answer: "Saya mau sewa mobil untuk tiga hari." },
          { prompt: "Mình ghé cây xăng trước đã.", answer: "Kita mampir ke SPBU dulu." },
          { prompt: "Đổ đầy bình giúp em nhé.", answer: "Tolong isi full ya." },
          { prompt: "Rẽ trái ở ngã ba.", answer: "Belok kiri di pertigaan." },
          { prompt: "Đường kẹt cứng vì dòng người về quê.", answer: "Jalanan macet total karena arus mudik." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Giá thuê đã bao gồm tài xế chưa?", answer: "Apakah harga sewa sudah termasuk sopir?" },
          { prompt: "Đừng quên chuẩn bị thẻ e-toll.", answer: "Jangan lupa siapkan kartu e-toll." },
          { prompt: "Mình nghỉ một chút ở trạm dừng.", answer: "Kita istirahat sebentar di rest area." },
          { prompt: "Lốp xe bị xẹp.", answer: "Ban mobilnya kempes." },
          { prompt: "Mình phải tìm tiệm sửa xe gần nhất.", answer: "Kita harus cari bengkel terdekat." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền `di` (ở) hoặc `ke` (đến) cho đúng:",
        instruction_en: "Fill in `di` (at) or `ke` (to):",
        items: [
          { prompt: "Kita mampir ___ SPBU dulu.", answer: "ke", hint: "ghé ĐẾN = `ke`" },
          { prompt: "Kami istirahat ___ rest area.", answer: "di", hint: "nghỉ Ở = `di`" },
          { prompt: "Saya mau ___ toilet sebentar.", answer: "ke", hint: "đi ĐẾN = `ke`" },
          { prompt: "Banyak penjual oleh-oleh ___ sepanjang jalan.", answer: "di", hint: "vị trí Ở dọc = `di`" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `kita` (gồm người nghe) hay `kami` (không gồm); và `jangan`/`dilarang`/`tidak`:",
        instruction_en:
          "Choose `kita` (incl. listener) or `kami` (excl.); and `jangan`/`dilarang`/`tidak`:",
        items: [
          { prompt: "Ayo, ___ berangkat sekarang! (rủ bạn đi cùng)", answer: "kita", hint: "gồm người nghe = `kita`" },
          { prompt: "___ lupa bawa SIM dan STNK. (đừng)", answer: "Jangan", hint: "mệnh lệnh cấm = `jangan`" },
          { prompt: "Di sini ada tanda '___ parkir'. (biển cấm)", answer: "dilarang", hint: "biển cấm = `dilarang`" },
          { prompt: "Mobil ini ___ bisa masuk gang kecil. (phủ định)", answer: "tidak", hint: "phủ định = `tidak`" },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Quick self-check — can you do each one?",
        items: [
          { vi: "Tôi thuê được xe và hỏi điều kiện (`sewa mobil`, `sudah termasuk …?`).", en: "I can rent a car and ask terms (`sewa mobil`, `sudah termasuk …?`)." },
          { vi: "Tôi chỉ/hiểu được đường (`belok kiri`, `lurus saja`, `pertigaan`).", en: "I can give/follow directions (`belok kiri`, `lurus saja`, `pertigaan`)." },
          { vi: "Tôi đổ xăng được (`mampir ke SPBU`, `tolong isi full`).", en: "I can refuel (`mampir ke SPBU`, `tolong isi full`)." },
          { vi: "Tôi phân biệt được `di` (ở) và `ke` (đến).", en: "I can tell `di` (at) from `ke` (to)." },
          { vi: "Tôi đọc được biển báo bị động `di-` (`dilarang parkir`).", en: "I can read di- passive signs (`dilarang parkir`)." },
          { vi: "Tôi báo được sự cố xe (`ban kempes`, `cari bengkel terdekat`).", en: "I can report a car problem (`ban kempes`, `cari bengkel terdekat`)." },
        ],
      },
    ],
  },
];

export default lessons;
