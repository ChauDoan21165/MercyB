// Home Repairs Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Home-repair Indonesian centres on calling a `tukang` (tradesman), describing a
// fault, and agreeing on cost. Vietnamese WIN: no conjugation/gender/tone — fault
// reports stay short ("ACnya rusak"). Traps: `c` = "ch" (`cat` paint = "chat",
// not the animal), the broken-vs-leaking verbs (`rusak`/`bocor`/`mati`/`mampet`),
// and `-nya` as the everyday "the/its" marker on the broken object.

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
    id: "indonesian_home_repairs",
    level: "A2",
    category: "daily_life",
    title_vi: "Tiếng Indonesia cho sửa chữa nhà cửa",
    title_en: "Home repairs Indonesian",
    sentences: [
      // ── Calling the tukang ─────────────────────────────────────────────
      {
        en: "Halo, saya butuh tukang untuk perbaikan di rumah.",
        vi: "Alô, tôi cần thợ để sửa chữa ở nhà.",
        pronunciation_focus: [
          "HA-lo, SA-ya BU-tuh TU-kang ... per-ba-I-kan — `tukang` = thợ; `perbaikan` = việc sửa chữa (gốc `baik` + `per-...-an`).",
          "Lỗi người Việt: nói `orang sửa`. Thợ tay nghề là `tukang` (`tukang listrik`, `tukang ledeng`...).",
          "Luyện: `Halo, saya butuh tukang untuk perbaikan di rumah.`",
        ],
        pronunciation_focus_en: [
          "HA-lo, SA-ya BU-tuh TU-kang ... per-ba-I-kan — `tukang` = tradesman; `perbaikan` = a repair (root `baik` + `per-...-an`).",
          "VN-speaker trap: `orang sembarang`. A skilled hand is a `tukang` (`tukang listrik` electrician, `tukang ledeng` plumber).",
          "Drill: `Halo, saya butuh tukang untuk perbaikan di rumah.`",
        ],
      },
      {
        en: "Bisa datang hari ini?",
        vi: "Hôm nay tới được không?",
        pronunciation_focus: [
          "BI-sa da-TANG HA-ri I-ni — `bisa` = có thể; `datang` = tới; câu hỏi không cần đảo, chỉ lên giọng.",
          "Lợi thế người Việt: câu hỏi có/không chỉ cần thêm `tidak?` cuối hoặc lên giọng — không đảo trật tự như tiếng Anh.",
          "Luyện: `Bisa datang hari ini?`",
        ],
        pronunciation_focus_en: [
          "BI-sa da-TANG HA-ri I-ni — `bisa` = can; `datang` = come; no inversion needed, just rising intonation.",
          "VN-speaker win: a yes/no question only needs a final `tidak?` or rising tone — no English-style inversion.",
          "Drill: `Bisa datang hari ini?`",
        ],
      },
      {
        en: "Rumah saya di Jalan Melati nomor lima.",
        vi: "Nhà tôi ở đường Melati số năm.",
        pronunciation_focus: [
          "RU-mah SA-ya di JA-lan ... NO-mor LI-ma — `di` = ở; `jalan` = đường; `nomor` = số.",
          "Lỗi người Việt: dùng `ke` cho địa chỉ tĩnh. Nhà nằm Ở đâu thì dùng `di`, không phải `ke`.",
          "Luyện: `Rumah saya di Jalan Melati nomor lima.`",
        ],
        pronunciation_focus_en: [
          "RU-mah SA-ya di JA-lan ... NO-mor LI-ma — `di` = at; `jalan` = street; `nomor` = number.",
          "VN-speaker trap: using `ke` for a static address. A house located somewhere takes `di`, not `ke`.",
          "Drill: `Rumah saya di Jalan Melati nomor lima.`",
        ],
      },
      // ── Describing the problem (the broken-verb set) ───────────────────
      {
        en: "ACnya rusak, tidak dingin.",
        vi: "Cái máy lạnh bị hỏng, không lạnh.",
        pronunciation_focus: [
          "a-se-nya RU-sak, TI-dak DI-ngin — `AC` đọc 'a-se'; `-nya` = 'cái đó'; `rusak` = hỏng (chung).",
          "Lỗi người Việt: nói `AC tidak baik`. Máy móc hỏng dùng `rusak`, không phải `tidak baik`.",
          "Luyện: `ACnya rusak, tidak dingin.`",
        ],
        pronunciation_focus_en: [
          "a-se-nya RU-sak, TI-dak DI-ngin — `AC` is read 'a-se'; `-nya` = 'the'; `rusak` = broken (general).",
          "VN-speaker trap: `AC tidak baik`. A broken machine is `rusak`, not `tidak baik`.",
          "Drill: `ACnya rusak, tidak dingin.`",
        ],
      },
      {
        en: "Keran air di dapur bocor.",
        vi: "Vòi nước trong bếp bị rò rỉ.",
        pronunciation_focus: [
          "KE-ran A-ir di DA-pur BO-chor — `keran` = vòi nước; `bocor` = rò rỉ ('bo-chor', `c`='ch'); `dapur` = bếp.",
          "Lỗi người Việt: dùng `rusak` cho mọi thứ. Rỉ nước riêng có từ `bocor`; ống/mái dột cũng `bocor`.",
          "Luyện: `Keran air di dapur bocor.`",
        ],
        pronunciation_focus_en: [
          "KE-ran A-ir di DA-pur BO-chor — `keran` = tap; `bocor` = to leak ('bo-chor', `c`='ch'); `dapur` = kitchen.",
          "VN-speaker trap: using `rusak` for everything. Leaking has its own verb `bocor`; a dripping pipe/roof is also `bocor`.",
          "Drill: `Keran air di dapur bocor.`",
        ],
      },
      {
        en: "Lampu di kamar mandi mati.",
        vi: "Đèn trong nhà tắm bị tắt/cháy.",
        pronunciation_focus: [
          "LAM-pu di KA-mar MAN-di MA-ti — `mati` = chết/tắt (đèn cháy, máy không lên); `kamar mandi` = nhà tắm.",
          "Lỗi người Việt: nói `lampu tidak hidup`. Đèn không sáng / máy không chạy dùng `mati`.",
          "Luyện: `Lampu di kamar mandi mati.`",
        ],
        pronunciation_focus_en: [
          "LAM-pu di KA-mar MAN-di MA-ti — `mati` = dead/off (a blown bulb, a dead device); `kamar mandi` = bathroom.",
          "VN-speaker trap: `lampu tidak hidup`. A dark bulb / dead device is `mati`.",
          "Drill: `Lampu di kamar mandi mati.`",
        ],
      },
      {
        en: "Saluran air mampet, airnya tidak mengalir.",
        vi: "Đường ống nước bị tắc, nước không chảy.",
        pronunciation_focus: [
          "sa-LU-ran A-ir MAM-pet, ... me-nga-LIR — `mampet` = tắc/nghẹt (cống, ống); `mengalir` = chảy.",
          "Lỗi người Việt: nói `tertutup` (= bị đóng/che). Ống tắc nghẹt riêng là `mampet`.",
          "Luyện: `Saluran air mampet, airnya tidak mengalir.`",
        ],
        pronunciation_focus_en: [
          "sa-LU-ran A-ir MAM-pet, ... me-nga-LIR — `mampet` = clogged (drain, pipe); `mengalir` = to flow.",
          "VN-speaker trap: `tertutup` (= closed/covered). A clogged pipe is specifically `mampet`.",
          "Drill: `Saluran air mampet, airnya tidak mengalir.`",
        ],
      },
      {
        en: "Temboknya retak dan catnya mengelupas.",
        vi: "Bức tường bị nứt và lớp sơn bong tróc.",
        pronunciation_focus: [
          "tem-BOK-nya RE-tak dan CHAT-nya me-nge-LU-pas — `tembok` = tường; `retak` = nứt; `cat` = sơn (đọc 'chat'!); `mengelupas` = bong tróc.",
          "Lỗi người Việt: đọc `cat` thành 'két' (con mèo tiếng Anh). `cat` = sơn, đọc 'chat' vì `c`='ch'.",
          "Luyện: `Temboknya retak dan catnya mengelupas.`",
        ],
        pronunciation_focus_en: [
          "tem-BOK-nya RE-tak dan CHAT-nya me-nge-LU-pas — `tembok` = wall; `retak` = cracked; `cat` = paint (read 'chat'!); `mengelupas` = peeling.",
          "VN-speaker trap: reading `cat` like the English animal. `cat` = paint, read 'chat' since `c`='ch'.",
          "Drill: `Temboknya retak dan catnya mengelupas.`",
        ],
      },
      // ── Diagnosis, parts, time, cost ───────────────────────────────────
      {
        en: "Kira-kira apa masalahnya?",
        vi: "Khoảng chừng vấn đề là gì ạ?",
        pronunciation_focus: [
          "KI-ra-KI-ra A-pa ma-sa-LAH-nya — `kira-kira` (lặp) = khoảng chừng/ước đoán; `masalah` = vấn đề.",
          "Lưu ý người Việt: tiếng Indonesia lặp `kira-kira` để nói 'ước chừng' — rất hay dùng khi hỏi thợ.",
          "Luyện: `Kira-kira apa masalahnya?`",
        ],
        pronunciation_focus_en: [
          "KI-ra-KI-ra A-pa ma-sa-LAH-nya — `kira-kira` (reduplication) = roughly/approximately; `masalah` = problem.",
          "VN-speaker note: Indonesian reduplicates `kira-kira` for 'approximately' — very common when asking a tradesman.",
          "Drill: `Kira-kira apa masalahnya?`",
        ],
      },
      {
        en: "Apakah perlu ganti suku cadang?",
        vi: "Có cần thay linh kiện không ạ?",
        pronunciation_focus: [
          "a-pa-KAH PER-lu GAN-ti SU-ku CHA-dang — `ganti` = thay; `suku cadang` = phụ tùng/linh kiện ('su-ku cha-dang').",
          "Lỗi người Việt: nói `spare part` (chêm tiếng Anh). Từ chuẩn là `suku cadang`.",
          "Luyện: `Apakah perlu ganti suku cadang?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH PER-lu GAN-ti SU-ku CHA-dang — `ganti` = replace; `suku cadang` = spare part ('su-ku cha-dang').",
          "VN-speaker trap: mixing in English `spare part`. The standard term is `suku cadang`.",
          "Drill: `Apakah perlu ganti suku cadang?`",
        ],
      },
      {
        en: "Berapa lama perbaikannya?",
        vi: "Việc sửa mất bao lâu ạ?",
        pronunciation_focus: [
          "be-RA-pa LA-ma per-ba-I-kan-nya — `berapa lama` = bao lâu (thời lượng); `perbaikannya` = việc sửa đó.",
          "Lỗi người Việt: nói `berapa waktu`. 'Bao lâu' là `berapa lama`, không phải `berapa waktu`.",
          "Luyện: `Berapa lama perbaikannya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa LA-ma per-ba-I-kan-nya — `berapa lama` = how long (duration); `perbaikannya` = the repair.",
          "VN-speaker trap: `berapa waktu`. 'How long' is `berapa lama`, not `berapa waktu`.",
          "Drill: `Berapa lama perbaikannya?`",
        ],
      },
      {
        en: "Berapa ongkos jasanya?",
        vi: "Tiền công là bao nhiêu ạ?",
        pronunciation_focus: [
          "be-RA-pa ONG-kos JA-sa-nya — `ongkos` = phí/chi phí; `jasa` = dịch vụ/công; `ongkos jasa` = tiền công.",
          "Lỗi người Việt: hỏi `berapa uang`. Tiền công thợ là `ongkos jasa` (tách riêng với tiền vật tư).",
          "Luyện: `Berapa ongkos jasanya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa ONG-kos JA-sa-nya — `ongkos` = fee/cost; `jasa` = service/labor; `ongkos jasa` = labor charge.",
          "VN-speaker trap: `berapa uang`. The labor charge is `ongkos jasa` (separate from material cost).",
          "Drill: `Berapa ongkos jasanya?`",
        ],
      },
      {
        en: "Sudah termasuk bahan atau belum?",
        vi: "Đã bao gồm vật liệu chưa ạ?",
        pronunciation_focus: [
          "SU-dah ter-MA-suk BA-han A-tau be-LUM — `termasuk` = bao gồm; `bahan` = vật liệu/nguyên liệu; `… atau belum?` = … hay chưa?",
          "Lỗi người Việt: kết câu bằng `tidak`. Hỏi 'đã … chưa' chốt bằng `belum`, không phải `tidak`.",
          "Luyện: `Sudah termasuk bahan atau belum?`",
        ],
        pronunciation_focus_en: [
          "SU-dah ter-MA-suk BA-han A-tau be-LUM — `termasuk` = included; `bahan` = materials; `… atau belum?` = … or not yet?",
          "VN-speaker trap: ending with `tidak`. An 'is it … yet' question closes with `belum`, not `tidak`.",
          "Drill: `Sudah termasuk bahan atau belum?`",
        ],
      },
      {
        en: "Tolong rapikan setelah selesai, ya.",
        vi: "Làm ơn dọn dẹp gọn gàng sau khi xong nhé.",
        pronunciation_focus: [
          "TO-long ra-PI-kan se-te-LAH se-le-SAI ya — `rapikan` = dọn gọn (gốc `rapi` + `-kan`); `setelah selesai` = sau khi xong.",
          "Lỗi người Việt: nói `bersih`. 'Dọn gọn lại' là `rapikan`; `bersihkan` = lau rửa cho sạch.",
          "Luyện: `Tolong rapikan setelah selesai, ya.`",
        ],
        pronunciation_focus_en: [
          "TO-long ra-PI-kan se-te-LAH se-le-SAI ya — `rapikan` = tidy up (root `rapi` + `-kan`); `setelah selesai` = after finishing.",
          "VN-speaker trap: `bersih`. 'Tidy up' is `rapikan`; `bersihkan` = wash/clean.",
          "Drill: `Tolong rapikan setelah selesai, ya.`",
        ],
      },
      {
        en: "Kalau rusak lagi, bisa garansi tidak?",
        vi: "Nếu hỏng lại thì có bảo hành không ạ?",
        pronunciation_focus: [
          "KA-lau RU-sak LA-gi, BI-sa ga-ran-SI TI-dak — `kalau` = nếu; `lagi` = lại/nữa; `garansi` = bảo hành.",
          "Lỗi người Việt: nói `jika ... apa garansi`. Khẩu ngữ dùng `kalau` + `bisa … tidak?`",
          "Luyện: `Kalau rusak lagi, bisa garansi tidak?`",
        ],
        pronunciation_focus_en: [
          "KA-lau RU-sak LA-gi, BI-sa ga-ran-SI TI-dak — `kalau` = if; `lagi` = again; `garansi` = warranty/guarantee.",
          "VN-speaker trap: `jika ... apa garansi`. Spoken Indonesian uses `kalau` + `bisa … tidak?`",
          "Drill: `Kalau rusak lagi, bisa garansi tidak?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, việc sửa nhà hầu hết do `tukang` — thợ tay nghề gọi theo chuyên môn: `tukang listrik` (thợ điện), `tukang ledeng` (thợ nước/ống), `tukang AC` (thợ máy lạnh), `tukang cat` (thợ sơn), `tukang bangunan` (thợ xây). Nhiều người tìm thợ qua hàng xóm, RT/RW (tổ trưởng khu phố), hoặc app như `Gojek`/`Grab` mục dịch vụ và `KlikDokter`/`Sejasa`. Tiền công (`ongkos jasa`) thường tách khỏi tiền vật tư (`bahan`/`material`) — nhớ hỏi `sudah termasuk bahan atau belum?` để khỏi bất ngờ. Mặc cả nhẹ về `ongkos` là bình thường, nhất là với thợ tự do; nhưng nên thỏa thuận giá TRƯỚC khi làm. Khi thợ tới, mời nước (`air`/`teh`) là phép lịch sự được quý. Gọi thợ lớn tuổi là `Pak`, thợ trẻ là `Mas`. Câu sống còn để mô tả sự cố: dùng đúng động từ — `rusak` (hỏng chung), `bocor` (rỉ/dột), `mati` (đèn cháy/máy chết), `mampet` (tắc nghẽn), `retak` (nứt).",
    cultural_notes_en:
      "In Indonesia, home repairs are mostly done by a `tukang` — a tradesman named by trade: `tukang listrik` (electrician), `tukang ledeng` (plumber), `tukang AC` (AC tech), `tukang cat` (painter), `tukang bangunan` (builder). People find them via neighbors, the local RT/RW (block heads), or apps like `Gojek`/`Grab` services and `Sejasa`. The labor charge (`ongkos jasa`) is usually separate from materials (`bahan`/`material`) — always ask `sudah termasuk bahan atau belum?` to avoid surprises. Light bargaining over `ongkos` is normal, especially with freelancers; but agree the price BEFORE work starts. When the `tukang` arrives, offering water or tea (`air`/`teh`) is appreciated courtesy. Address an older tradesman as `Pak`, a younger one as `Mas`. The survival skill is the right fault verb: `rusak` (broken in general), `bocor` (leaking/dripping), `mati` (dead bulb/device), `mampet` (clogged), `retak` (cracked).",
    tip_advice_vi:
      "Trọng tâm bài này là chọn ĐÚNG động từ sự cố — đây là nơi người Việt hay nói chung chung `rusak` cho tất cả: `rusak` (hỏng chung), `bocor` (rỉ nước/dột), `mati` (đèn cháy, máy không lên), `mampet` (cống/ống tắc), `retak` (tường nứt), `mengelupas` (sơn bong). Mẫu báo sự cố gọn: `[đồ vật]nya + [động từ]` → `ACnya rusak`, `kerannya bocor`, `lampunya mati`. Sau khi mô tả, hỏi bốn câu tiền-thời gian: `Kira-kira apa masalahnya?` · `Perlu ganti suku cadang?` · `Berapa lama?` · `Berapa ongkos jasanya, sudah termasuk bahan atau belum?`. Mẹo phát âm chí mạng: `c` = 'ch' nên `cat`='chat' (sơn), `bocor`='bo-chor', `cadang`='cha-dang'. Tin vui: không chia thì, chỉ thêm `sudah`/`lagi`.",
    tip_advice_en:
      "This lesson's core is picking the RIGHT fault verb — exactly where Vietnamese speakers over-use `rusak` for everything: `rusak` (broken, general), `bocor` (leaking/dripping), `mati` (dead bulb/device), `mampet` (clogged drain/pipe), `retak` (cracked wall), `mengelupas` (peeling paint). The compact fault template is `[object]nya + [verb]` → `ACnya rusak`, `kerannya bocor`, `lampunya mati`. After describing it, ask the four cost/time questions: `Kira-kira apa masalahnya?` · `Perlu ganti suku cadang?` · `Berapa lama?` · `Berapa ongkos jasanya, sudah termasuk bahan atau belum?`. Killer pronunciation tip: `c` = 'ch', so `cat`='chat' (paint), `bocor`='bo-chor', `cadang`='cha-dang'. Good news: no tense — just add `sudah`/`lagi`.",
    vocabulary: [
      // The tradesman
      {
        cell_id: "040afd0a-ff7a-44c3-abb2-4e894d2907cb",
        word: "tukang",
        en: "tradesman / handyman",
        vi: "thợ",
        pos: "noun",
        pronunciation_vi: "TU-kang — gọi theo nghề: `tukang listrik`, `tukang ledeng`, `tukang cat`",
        pronunciation_en: "TU-kang — named by trade: `tukang listrik`, `tukang ledeng`, `tukang cat`",
      },
      {
        cell_id: "5522766e-d841-448a-a733-851b240c8df8",
        word: "tukang ledeng",
        en: "plumber",
        vi: "thợ nước / thợ ống",
        pos: "noun",
        pronunciation_vi: "TU-kang LE-deng — `ledeng` = hệ thống ống nước",
        pronunciation_en: "TU-kang LE-deng — `ledeng` = plumbing/piped water",
      },
      {
        cell_id: "74cf8af6-fce2-4ad2-bb79-9b1b3db64df8",
        word: "tukang listrik",
        en: "electrician",
        vi: "thợ điện",
        pos: "noun",
        pronunciation_vi: "TU-kang LIS-trik — `listrik` = điện",
        pronunciation_en: "TU-kang LIS-trik — `listrik` = electricity",
      },
      // Fault verbs (the heart of the lesson)
      {
        cell_id: "2626c140-6a25-44ea-8ee8-1ff3a759ffdd",
        word: "rusak",
        en: "broken / out of order",
        vi: "hỏng (chung)",
        pos: "adjective",
        pronunciation_vi: "RU-sak — hỏng chung; `ACnya rusak`",
        pronunciation_en: "RU-sak — broken in general; `ACnya rusak`",
      },
      {
        cell_id: "1e6c935c-eeef-4359-84ab-1f4a50789511",
        word: "bocor",
        en: "leaking / dripping",
        vi: "rò rỉ / dột",
        pos: "verb / adjective",
        pronunciation_vi: "BO-chor — `c`='ch'; vòi rỉ, mái dột đều `bocor`",
        pronunciation_en: "BO-chor — `c`='ch'; a dripping tap or a leaky roof is `bocor`",
      },
      {
        cell_id: "f8262f45-c01e-435e-9436-195125d8fa55",
        word: "mati",
        en: "dead / off (bulb, device)",
        vi: "tắt / cháy / chết (đèn, máy)",
        pos: "verb / adjective",
        pronunciation_vi: "MA-ti — `lampu mati` đèn cháy; `listrik mati` cúp điện",
        pronunciation_en: "MA-ti — `lampu mati` blown bulb; `listrik mati` power cut",
      },
      {
        cell_id: "4b2ff4ab-e431-48df-8254-228b55d46f42",
        word: "mampet",
        en: "clogged / blocked",
        vi: "tắc / nghẹt",
        pos: "adjective",
        pronunciation_vi: "MAM-pet — cống/ống tắc; KHÔNG dùng `tertutup`",
        pronunciation_en: "MAM-pet — a clogged drain/pipe; NOT `tertutup`",
      },
      {
        cell_id: "dee9e3ac-0c72-49f3-8cbd-1b3c2ca7314b",
        word: "retak",
        en: "cracked",
        vi: "nứt",
        pos: "adjective",
        pronunciation_vi: "RE-tak — `temboknya retak` = tường nứt",
        pronunciation_en: "RE-tak — `temboknya retak` = the wall is cracked",
      },
      // Fixtures & materials
      {
        cell_id: "c1a9b34b-ece4-4e6d-891e-467bf4edf6e4",
        word: "keran",
        en: "tap / faucet",
        vi: "vòi nước",
        pos: "noun",
        pronunciation_vi: "KE-ran — cũng viết `kran`",
        pronunciation_en: "KE-ran — also spelled `kran`",
      },
      {
        cell_id: "3f2481a0-eaaa-488d-b82a-037481da4457",
        word: "saluran air",
        en: "drain / water channel",
        vi: "đường ống / cống thoát nước",
        pos: "noun",
        pronunciation_vi: "sa-LU-ran A-ir — `saluran mampet` = cống tắc",
        pronunciation_en: "sa-LU-ran A-ir — `saluran mampet` = clogged drain",
      },
      {
        cell_id: "884e4fd5-1168-44e3-8774-26a3abad5947",
        word: "cat",
        en: "paint",
        vi: "sơn",
        pos: "noun",
        pronunciation_vi: "chat — `c`='ch'; KHÔNG đọc như 'con mèo' tiếng Anh",
        pronunciation_en: "chat — `c`='ch'; NOT the English animal 'cat'",
      },
      {
        cell_id: "2cea2fa1-0afb-4292-a2ce-9c1fb7097f51",
        word: "suku cadang",
        en: "spare part",
        vi: "phụ tùng / linh kiện",
        pos: "noun",
        pronunciation_vi: "SU-ku CHA-dang — đừng chêm 'spare part'",
        pronunciation_en: "SU-ku CHA-dang — don't code-switch to 'spare part'",
      },
      // Cost & service
      {
        cell_id: "79449adf-03f6-43ad-93bd-8592c2f6a5d4",
        word: "perbaikan",
        en: "repair / fixing",
        vi: "việc sửa chữa",
        pos: "noun",
        pronunciation_vi: "per-ba-I-kan — gốc `baik` + `per-...-an`; động từ `memperbaiki`",
        pronunciation_en: "per-ba-I-kan — root `baik` + `per-...-an`; verb `memperbaiki`",
      },
      {
        cell_id: "729911d4-bc73-444f-a3bc-f80e103f7794",
        word: "ongkos jasa",
        en: "labor charge / service fee",
        vi: "tiền công",
        pos: "noun",
        pronunciation_vi: "ONG-kos JA-sa — tách riêng với tiền `bahan` (vật liệu)",
        pronunciation_en: "ONG-kos JA-sa — separate from `bahan` (materials) cost",
      },
      {
        cell_id: "5fae7e36-129e-4faf-a06f-692c6ec9c9be",
        word: "garansi",
        en: "warranty / guarantee",
        vi: "bảo hành",
        pos: "noun",
        pronunciation_vi: "ga-ran-SI — `kalau rusak lagi, ada garansi?`",
        pronunciation_en: "ga-ran-SI — `kalau rusak lagi, ada garansi?`",
      },
    ],
    dialogue: [
      // Dialogue: calling a tukang AC, diagnosing, agreeing on cost
      {
        cell_id: "c62a42a7-7230-4653-8de6-4c5d54aacda4",
        speaker: "Pemilik rumah",
        text: "Halo, Pak. ACnya rusak, sudah dua hari tidak dingin.",
        vi: "Alô anh ơi. Máy lạnh bị hỏng, hai ngày nay không lạnh.",
        en: "Hello, sir. The AC is broken — it hasn't been cold for two days.",
      },
      {
        cell_id: "7fd0ce2c-0458-40e2-ae86-6c6b6a2f598d",
        speaker: "Tukang",
        text: "Oh, mungkin freonnya habis atau filternya kotor. Alamatnya di mana?",
        vi: "À, có thể hết gas hoặc lưới lọc bẩn. Địa chỉ ở đâu ạ?",
        en: "Ah, maybe it's out of refrigerant or the filter is dirty. What's the address?",
      },
      {
        cell_id: "7e2a2036-b894-4af8-bf7c-212fbea8b5b1",
        speaker: "Pemilik rumah",
        text: "Di Jalan Melati nomor lima. Bisa datang hari ini?",
        vi: "Ở đường Melati số năm. Hôm nay tới được không ạ?",
        en: "On Jalan Melati number five. Can you come today?",
      },
      {
        cell_id: "0d2b11bd-9c8e-4e3f-8372-43e702b25cfb",
        speaker: "Tukang",
        text: "Bisa, sore ini sekitar jam empat. Saya cek dulu, kira-kira satu jam.",
        vi: "Được, chiều nay khoảng bốn giờ. Tôi kiểm tra trước, chừng một tiếng.",
        en: "I can, this afternoon around four. I'll check first, roughly an hour.",
      },
      {
        cell_id: "44a60b0c-b3e2-4a44-a679-08956f2e3dd8",
        speaker: "Pemilik rumah",
        text: "Berapa ongkos jasanya? Sudah termasuk bahan atau belum?",
        vi: "Tiền công bao nhiêu ạ? Đã gồm vật tư chưa?",
        en: "How much is the labor charge? Are materials included or not?",
      },
      {
        cell_id: "f311f4a3-5156-4100-94ba-48b8c0a46a07",
        speaker: "Tukang",
        text: "Ongkos cek seratus ribu. Kalau perlu ganti suku cadang, bahannya dihitung terpisah.",
        vi: "Phí kiểm tra một trăm nghìn. Nếu cần thay linh kiện thì vật tư tính riêng.",
        en: "The inspection fee is one hundred thousand. If parts are needed, materials are counted separately.",
      },
      {
        cell_id: "ec460ed5-c159-4e0e-b03f-dd158c6c4f8b",
        speaker: "Pemilik rumah",
        text: "Oke, setuju. Kalau rusak lagi, ada garansi tidak?",
        vi: "Được, đồng ý. Nếu hỏng lại thì có bảo hành không ạ?",
        en: "Okay, agreed. If it breaks again, is there a warranty?",
      },
      {
        cell_id: "1d4dc0c6-b4ab-4871-8039-cc25fb28ece9",
        speaker: "Tukang",
        text: "Ada, garansi servis dua minggu. Nanti tolong rapikan dulu area dekat AC, ya.",
        vi: "Có, bảo hành dịch vụ hai tuần. Lát anh dọn gọn khu gần máy lạnh giúp nhé.",
        en: "Yes, a two-week service warranty. Please tidy the area near the AC beforehand.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi cần thợ để sửa chữa ở nhà.", answer: "Saya butuh tukang untuk perbaikan di rumah." },
          { prompt: "Cái máy lạnh bị hỏng, không lạnh.", answer: "ACnya rusak, tidak dingin." },
          { prompt: "Vòi nước trong bếp bị rò rỉ.", answer: "Keran air di dapur bocor." },
          { prompt: "Việc sửa mất bao lâu?", answer: "Berapa lama perbaikannya?" },
          { prompt: "Tiền công là bao nhiêu?", answer: "Berapa ongkos jasanya?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch sang tiếng Indonesia:",
        instruction_en: "Extra practice — translate into Indonesian:",
        items: [
          { prompt: "Đèn trong nhà tắm bị cháy.", answer: "Lampu di kamar mandi mati." },
          { prompt: "Đường ống nước bị tắc.", answer: "Saluran air mampet." },
          { prompt: "Bức tường bị nứt và lớp sơn bong tróc.", answer: "Temboknya retak dan catnya mengelupas." },
          { prompt: "Có cần thay linh kiện không?", answer: "Apakah perlu ganti suku cadang?" },
          { prompt: "Nếu hỏng lại thì có bảo hành không?", answer: "Kalau rusak lagi, bisa garansi tidak?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn ĐÚNG động từ sự cố (`rusak` · `bocor` · `mati` · `mampet` · `retak`):",
        instruction_en:
          "Pick the RIGHT fault verb (`rusak` · `bocor` · `mati` · `mampet` · `retak`):",
        items: [
          { prompt: "Kerannya ___, airnya menetes terus.", answer: "bocor", hint: "rỉ nước" },
          { prompt: "Lampunya ___, kamar jadi gelap.", answer: "mati", hint: "đèn cháy" },
          { prompt: "Saluran di kamar mandi ___, airnya tidak mengalir.", answer: "mampet", hint: "tắc nghẽn" },
          { prompt: "Temboknya ___ karena gempa kecil.", answer: "retak", hint: "nứt" },
          { prompt: "Mesin cucinya ___, tidak mau menyala.", answer: "rusak", hint: "hỏng chung" },
        ],
      },
      {
        type: "fault_template",
        instruction_vi:
          "Mẫu báo sự cố `[đồ vật]nya + [động từ]`. Ghép thành câu:",
        instruction_en:
          "Fault template `[object]nya + [verb]`. Build the sentence:",
        items: [
          { prompt: "AC + rusak", answer: "ACnya rusak." },
          { prompt: "keran + bocor", answer: "kerannya bocor." },
          { prompt: "lampu + mati", answer: "lampunya mati." },
          { prompt: "tembok + retak", answer: "temboknya retak." },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung gọi thợ — điền chỗ trống: `Halo, Pak. ___nya ___. Bisa datang hari ini? Rumah saya di ___. Kira-kira berapa ongkos jasanya, sudah termasuk bahan atau belum?`",
        instruction_en:
          "Call-a-tradesman frame — fill the blanks: `Halo, Pak. ___nya ___. Bisa datang hari ini? Rumah saya di ___. Kira-kira berapa ongkos jasanya, sudah termasuk bahan atau belum?`",
        example:
          "Halo, Pak. Kerannya bocor. Bisa datang hari ini? Rumah saya di Jalan Melati nomor lima. Kira-kira berapa ongkos jasanya, sudah termasuk bahan atau belum?",
        example_vi:
          "Alô anh. Vòi nước bị rỉ. Hôm nay tới được không? Nhà tôi ở đường Melati số năm. Khoảng tiền công bao nhiêu, đã gồm vật tư chưa?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra sửa nhà — bạn làm được chưa?",
        instruction_en: "Quick home-repair self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể gọi đúng loại thợ (tukang listrik/ledeng/AC).", en: "I can call the right tukang (listrik/ledeng/AC)." },
          { vi: "Tôi dùng đúng động từ: rusak/bocor/mati/mampet/retak.", en: "I use the right verb: rusak/bocor/mati/mampet/retak." },
          { vi: "Tôi có thể mô tả sự cố bằng `[đồ vật]nya + động từ`.", en: "I can describe a fault with `[object]nya + verb`." },
          { vi: "Tôi có thể hỏi thời gian và tiền công.", en: "I can ask the time and labor charge." },
          { vi: "Tôi có thể hỏi gồm vật tư chưa và có bảo hành không.", en: "I can ask if materials are included and about warranty." },
          { vi: "Tôi đọc `c` thành 'ch' (cat = chat = sơn).", en: "I read `c` as 'ch' (cat = chat = paint)." },
        ],
      },
    ],
  },
];

export default lessons;
