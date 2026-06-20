// Emergency & Disaster Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (legal-police.ts, healthcare-emergency.ts,
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
// no articles. Indonesia sits on the Ring of Fire, so disaster vocabulary is
// genuinely survival-critical: `gempa` (quake), `tsunami`, `banjir` (flood),
// `kebakaran` (fire), `gunung meletus` (eruption). The grammar traps are the
// meN-/-an + di-/ter- affix pairs (`mengungsi` to evacuate-yourself vs.
// `mengungsikan` to evacuate-someone vs. `pengungsi` a refugee; `terjebak`
// trapped, `tertimbun` buried) and the abbreviation soup of officialdom
// (`BMKG`, `BNPB`, `BPBD`, the 112 / 119 hotlines). Short imperative shouts —
// `Awas!`, `Lari!`, `Tolong!` — save lives, so they come first.

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
    id: "indonesian_emergency_disaster",
    level: "B1",
    category: "emergency",
    title_vi: "Tiếng Indonesia khi khẩn cấp & thiên tai",
    title_en: "Emergency & disaster Indonesian",
    sentences: [
      // ── Life-saving shouts ──────────────────────────────────────────────
      {
        en: "Awas! Gempa! Lari ke luar!",
        vi: "Coi chừng! Động đất! Chạy ra ngoài!",
        pronunciation_focus: [
          "A-was! GEM-pa! LA-ri ke LU-ar! — `awas` = coi chừng/cẩn thận; `gempa` = động đất; `lari` = chạy.",
          "Lợi thế người Việt: mệnh lệnh là động từ trần, không chia — `Lari!` = Chạy! Ngắn gọn như tiếng Việt.",
          "Lỗi người Việt: lẫn `awas` (coi chừng) với `maaf` (xin lỗi). Khi nguy hiểm gấp, hô `Awas!`.",
          "Luyện: `Awas! Gempa! Lari ke luar!`",
        ],
        pronunciation_focus_en: [
          "A-was! GEM-pa! LA-ri ke LU-ar! — `awas` = watch out/careful; `gempa` = earthquake; `lari` = run.",
          "VN-speaker win: a command is the bare verb, no conjugation — `Lari!` = Run! As short as Vietnamese.",
          "VN-speaker trap: confusing `awas` (watch out) with `maaf` (sorry). In sudden danger, shout `Awas!`.",
          "Drill: `Awas! Gempa! Lari ke luar!`",
        ],
      },
      {
        en: "Tolong! Ada orang terjebak di dalam!",
        vi: "Cứu với! Có người bị kẹt bên trong!",
        pronunciation_focus: [
          "TO-long! A-da O-rang ter-JE-bak di DA-lam! — `tolong` = cứu/làm ơn; `terjebak` = bị kẹt (ter- chỉ trạng thái ngoài ý muốn); `di dalam` = bên trong.",
          "Lỗi người Việt: quên tiền tố `ter-`. `Menjebak` = giăng bẫy (chủ động); `terjebak` = bị mắc kẹt (trạng thái).",
          "Mẹo: `j` đọc 'j' như 'jam' → 'ter-JE-bak'.",
          "Luyện: `Tolong! Ada orang terjebak!`",
        ],
        pronunciation_focus_en: [
          "TO-long! A-da O-rang ter-JE-bak di DA-lam! — `tolong` = help/please; `terjebak` = trapped (ter- marks an unintended state); `di dalam` = inside.",
          "VN-speaker trap: dropping the `ter-` prefix. `Menjebak` = to set a trap (active); `terjebak` = to be trapped (state).",
          "Tip: `j` is the English 'j' as in 'jam' → 'ter-JE-bak'.",
          "Drill: `Tolong! Ada orang terjebak!`",
        ],
      },
      // ── Calling for help ────────────────────────────────────────────────
      {
        en: "Halo, ini darurat. Ada kebakaran di rumah saya.",
        vi: "A lô, đây là trường hợp khẩn cấp. Có cháy ở nhà tôi.",
        pronunciation_focus: [
          "HA-lo, I-ni da-RU-rat. A-da ke-ba-KA-ran di RU-mah SA-ya — `darurat` = khẩn cấp; `kebakaran` = đám cháy (ke-…-an từ `bakar`).",
          "Lỗi người Việt: lẫn `kebakaran` (đám cháy/bị cháy) với `membakar` (đốt). Sự kiện cháy = `kebakaran`.",
          "Mẹo: gọi `112` (khẩn cấp toàn quốc) hoặc `113` (cứu hỏa).",
          "Luyện: `Ada kebakaran di rumah saya.`",
        ],
        pronunciation_focus_en: [
          "HA-lo, I-ni da-ROO-rat. A-da ke-ba-KA-ran di ROO-mah SA-ya — `darurat` = emergency; `kebakaran` = a fire (ke-…-an from `bakar`).",
          "VN-speaker trap: confusing `kebakaran` (a fire / to catch fire) with `membakar` (to set alight). The fire event = `kebakaran`.",
          "Tip: dial `112` (national emergency) or `113` (fire brigade).",
          "Drill: `Ada kebakaran di rumah saya.`",
        ],
      },
      {
        en: "Alamatnya Jalan Mawar nomor lima. Cepat, tolong!",
        vi: "Địa chỉ là đường Mawar số năm. Nhanh lên, làm ơn!",
        pronunciation_focus: [
          "a-LA-mat-nya JA-lan MA-war NO-mor LI-ma. CE-pat, TO-long! — `alamatnya` = địa chỉ của nó (+ -nya); `Jalan` = đường (viết tắt `Jl.`); `cepat` = nhanh.",
          "Lỗi người Việt: đặt số nhà trước tên đường kiểu Việt. Indonesia: `Jalan` + tên + `nomor` + số.",
          "Mẹo: `c` đọc 'ch' → 'CHE-pat'.",
          "Luyện: `Alamatnya Jalan Mawar nomor lima.`",
        ],
        pronunciation_focus_en: [
          "a-LA-mat-nya JA-lan MA-war NO-mor LEE-ma. CHE-pat, TO-long! — `alamatnya` = its address (+ -nya); `Jalan` = street (abbr. `Jl.`); `cepat` = fast.",
          "VN-speaker trap: putting the house number before the street name. In Indonesian: `Jalan` + name + `nomor` + number.",
          "Tip: `c` is 'ch' → 'CHE-pat'.",
          "Drill: `Alamatnya Jalan Mawar nomor lima.`",
        ],
      },
      {
        en: "Ada yang terluka. Tolong kirim ambulans.",
        vi: "Có người bị thương. Làm ơn gửi xe cứu thương.",
        pronunciation_focus: [
          "A-da yang ter-LU-ka. TO-long KI-rim am-bu-LANS — `terluka` = bị thương (ter- + `luka`); `kirim` = gửi; `ambulans` = xe cứu thương.",
          "Lỗi người Việt: dùng `luka` (vết thương, danh từ) thay vì `terluka` (bị thương, trạng thái). Người bị thương = `terluka`.",
          "Mẹo: gọi `119` cho cấp cứu y tế.",
          "Luyện: `Ada yang terluka, tolong kirim ambulans.`",
        ],
        pronunciation_focus_en: [
          "A-da yang ter-LOO-ka. TO-long KEE-rim am-bu-LANS — `terluka` = injured (ter- + `luka`); `kirim` = to send; `ambulans` = ambulance.",
          "VN-speaker trap: using `luka` (a wound, noun) instead of `terluka` (injured, state). An injured person = `terluka`.",
          "Tip: dial `119` for medical emergencies.",
          "Drill: `Ada yang terluka, tolong kirim ambulans.`",
        ],
      },
      // ── Evacuation & flooding ───────────────────────────────────────────
      {
        en: "Kita harus mengungsi sekarang. Air sudah naik.",
        vi: "Chúng ta phải đi sơ tán ngay. Nước đã dâng lên.",
        pronunciation_focus: [
          "KI-ta HA-rus me-ngung-SI se-ka-RANG. A-ir SU-dah NA-ik — `mengungsi` = tự đi sơ tán (meN- + `ungsi`); `harus` = phải; `air naik` = nước dâng.",
          "Lỗi người Việt: lẫn `mengungsi` (tự sơ tán) với `mengungsikan` (sơ tán NGƯỜI khác). Bản thân đi thì `mengungsi`.",
          "Luyện: `Kita harus mengungsi sekarang.`",
        ],
        pronunciation_focus_en: [
          "KI-ta HA-roos me-ngoong-SI se-ka-RANG. A-ir SOO-dah NA-ik — `mengungsi` = to evacuate (oneself) (meN- + `ungsi`); `harus` = must; `air naik` = water rising.",
          "VN-speaker trap: confusing `mengungsi` (evacuate yourself) with `mengungsikan` (evacuate someone else). For yourself, `mengungsi`.",
          "Drill: `Kita harus mengungsi sekarang.`",
        ],
      },
      {
        en: "Di mana tempat evakuasi yang terdekat?",
        vi: "Điểm sơ tán gần nhất ở đâu?",
        pronunciation_focus: [
          "di MA-na TEM-pat e-va-ku-A-si yang ter-DE-kat? — `tempat evakuasi` = điểm sơ tán; `terdekat` = gần nhất (ter- so sánh nhất từ `dekat`).",
          "Lợi thế người Việt: `ter-` + tính từ = so sánh nhất, đơn giản hơn tiếng Anh — `terdekat` = gần nhất, `tertinggi` = cao nhất.",
          "Luyện: `Di mana tempat evakuasi yang terdekat?`",
        ],
        pronunciation_focus_en: [
          "di MA-na TEM-pat e-va-koo-A-si yang ter-DE-kat? — `tempat evakuasi` = evacuation point; `terdekat` = nearest (ter- superlative from `dekat`).",
          "VN-speaker win: `ter-` + adjective = the superlative, simpler than English — `terdekat` = nearest, `tertinggi` = highest.",
          "Drill: `Di mana tempat evakuasi yang terdekat?`",
        ],
      },
      {
        en: "Jangan panik. Ikuti petunjuk petugas.",
        vi: "Đừng hoảng loạn. Hãy làm theo chỉ dẫn của nhân viên cứu hộ.",
        pronunciation_focus: [
          "JA-ngan PA-nik. i-KU-ti pe-tun-JUK pe-TU-gas — `jangan` = đừng (mệnh lệnh phủ định); `ikuti` = làm theo (meN- + `ikut` + -i); `petunjuk` = chỉ dẫn; `petugas` = nhân viên/cán bộ.",
          "Lỗi người Việt: dùng `tidak` để cấm. Cấm/đừng làm gì thì dùng `jangan`, không phải `tidak`.",
          "Luyện: `Jangan panik. Ikuti petunjuk petugas.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan PA-nik. i-KU-ti pe-tun-JOOK pe-TU-gas — `jangan` = don't (negative command); `ikuti` = to follow (meN- + `ikut` + -i); `petunjuk` = instruction; `petugas` = officer/staff.",
          "VN-speaker trap: using `tidak` to forbid. To say 'don't (do)', use `jangan`, not `tidak`.",
          "Drill: `Jangan panik. Ikuti petunjuk petugas.`",
        ],
      },
      {
        en: "Apakah ada peringatan tsunami dari BMKG?",
        vi: "Có cảnh báo sóng thần từ BMKG không?",
        pronunciation_focus: [
          "a-pa-KAH A-da pe-ring-A-tan tsu-NA-mi da-ri be-em-ka-GE? — `peringatan` = cảnh báo (peN-…-an từ `ingat`); `BMKG` đánh vần 'be-em-ka-ge'.",
          "Lỗi người Việt: đọc liền `BMKG`. Đánh vần từng chữ: be-em-ka-ge (Cơ quan Khí tượng & Địa vật lý).",
          "Mẹo: sau động đất mạnh gần biển, chờ `peringatan tsunami`; nếu nghi ngờ, lên cao ngay.",
          "Luyện: `Apakah ada peringatan tsunami dari BMKG?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da pe-ring-A-tan tsu-NA-mi da-ri be-em-ka-GE? — `peringatan` = warning (peN-…-an from `ingat`); `BMKG` is spelled 'be-em-ka-ge'.",
          "VN-speaker trap: reading `BMKG` as one word. Spell each letter: be-em-ka-ge (the Meteorology & Geophysics Agency).",
          "Tip: after a strong coastal quake, watch for a `peringatan tsunami`; if in doubt, get to high ground immediately.",
          "Drill: `Apakah ada peringatan tsunami dari BMKG?`",
        ],
      },
      {
        en: "Keluarga saya selamat, tapi rumah kami rusak parah.",
        vi: "Gia đình tôi an toàn, nhưng nhà của chúng tôi hư hại nặng.",
        pronunciation_focus: [
          "ke-LU-ar-ga SA-ya se-LA-mat, TA-pi RU-mah KA-mi RU-sak PA-rah — `selamat` = an toàn/sống sót; `rusak parah` = hư hại nặng; `kami` = chúng tôi (không gồm người nghe).",
          "Lỗi người Việt: lẫn `kami` (chúng tôi, KHÔNG gồm người nghe) với `kita` (chúng ta, GỒM người nghe). Nói về gia đình mình thì `kami`.",
          "Luyện: `Keluarga saya selamat, tapi rumah kami rusak parah.`",
        ],
        pronunciation_focus_en: [
          "ke-LU-ar-ga SA-ya se-LA-mat, TA-pi ROO-mah KA-mi ROO-sak PA-rah — `selamat` = safe/survived; `rusak parah` = badly damaged; `kami` = we (excluding the listener).",
          "VN-speaker trap: confusing `kami` (we, EXCLUDING the listener) with `kita` (we, INCLUDING the listener). About your own family, use `kami`.",
          "Drill: `Keluarga saya selamat, tapi rumah kami rusak parah.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia nằm trên 'Vành đai lửa' Thái Bình Dương — động đất (`gempa bumi`), sóng thần (`tsunami`), núi lửa phun (`gunung meletus`) và lũ lụt (`banjir`) là một phần của đời sống. Vì thế từ vựng thiên tai ở đây KHÔNG phải học cho vui mà là kỹ năng sinh tồn.\n\nCÁC CƠ QUAN & SỐ KHẨN CẤP: `BMKG` (Cơ quan Khí tượng, Khí hậu & Địa vật lý) ra `peringatan dini` (cảnh báo sớm) về động đất và sóng thần. `BNPB` (cấp quốc gia) và `BPBD` (cấp địa phương) điều phối ứng phó thảm họa. Số gọi: `112` (khẩn cấp toàn quốc, miễn phí), `113` (cứu hỏa - `pemadam kebakaran`/`Damkar`), `119` (cấp cứu y tế), `110` (cảnh sát). Người dân Indonesia rất quen với khái niệm `siaga` (mức cảnh giác) và `tanggap darurat` (ứng phó khẩn cấp).\n\nQUY TẮC SỐNG CÒN cơ bản người địa phương đều biết: khi `gempa`, làm theo 'Drop–Cover–Hold' (cúi xuống, nấp dưới bàn, bám chắc), tránh cửa kính; khi rung lắc dừng và bạn ở gần biển, ĐỪNG chờ còi — chạy lên `tempat tinggi` (chỗ cao) hoặc `jalur evakuasi` (đường sơ tán) có biển chỉ dẫn. Khi `banjir`, ngắt điện (`matikan listrik`), không lội qua dòng nước chảy xiết, di chuyển tới `tempat pengungsian` (nơi lánh nạn). Tinh thần `gotong royong` (tương trợ cộng đồng) rất mạnh — hàng xóm giúp nhau sơ tán và chia sẻ đồ tiếp tế.\n\nLƯU Ý NGÔN NGỮ: `selamat` ở đây nghĩa 'an toàn/sống sót' (khác với lời chào `selamat pagi`). Người sơ tán/lánh nạn gọi là `pengungsi`; nơi họ ở tạm là `posko` (trạm chỉ huy/tiếp tế) hoặc `tempat pengungsian`.",
    cultural_notes_en:
      "Indonesia sits on the Pacific 'Ring of Fire' — earthquakes (`gempa bumi`), tsunamis (`tsunami`), volcanic eruptions (`gunung meletus`), and floods (`banjir`) are part of life. So disaster vocabulary here is NOT trivia — it's a survival skill.\n\nAGENCIES & EMERGENCY NUMBERS: `BMKG` (the Meteorology, Climatology & Geophysics Agency) issues `peringatan dini` (early warnings) for quakes and tsunamis. `BNPB` (national) and `BPBD` (local) coordinate disaster response. Numbers: `112` (national emergency, free), `113` (fire brigade — `pemadam kebakaran`/`Damkar`), `119` (medical emergency), `110` (police). Indonesians are familiar with `siaga` (alert level) and `tanggap darurat` (emergency response).\n\nBASIC SURVIVAL RULES locals know: in a `gempa`, do 'Drop–Cover–Hold' (`merunduk`–`berlindung`–`berpegangan`), away from glass; once shaking stops and you're near the coast, DON'T wait for a siren — head to `tempat tinggi` (high ground) or a signed `jalur evakuasi` (evacuation route). In a `banjir`, cut the power (`matikan listrik`), never wade through fast-moving water, and move to a `tempat pengungsian` (shelter). The spirit of `gotong royong` (communal mutual aid) is strong — neighbours help each other evacuate and share supplies.\n\nLANGUAGE NOTE: `selamat` here means 'safe/survived' (different from the greeting `selamat pagi`). Evacuees/refugees are `pengungsi`; their temporary site is a `posko` (command/relief post) or `tempat pengungsian`.",
    tip_advice_vi:
      "Học 'bộ khung khẩn cấp' bốn câu để gọi cứu hộ: (1) báo tình huống — `Halo, ini darurat. Ada [kebakaran/banjir/gempa].`; (2) cho địa chỉ — `Alamatnya Jalan ___ nomor ___.`; (3) báo người bị nạn — `Ada yang terluka / terjebak.`; (4) yêu cầu — `Tolong kirim [ambulans / pemadam].`. Thuộc 5 tiếng hô cứu mạng ngắn: `Awas!` (coi chừng), `Lari!` (chạy), `Tolong!` (cứu), `Cepat!` (nhanh), `Jangan panik!` (đừng hoảng).\n\nNhớ các cặp phụ tố hay nhầm: `mengungsi` (tự sơ tán) vs `mengungsikan` (sơ tán người khác) vs `pengungsi` (người lánh nạn); trạng thái `ter-` ngoài ý muốn: `terjebak` (bị kẹt), `terluka` (bị thương), `tertimbun` (bị vùi lấp); so sánh nhất `ter-`: `terdekat` (gần nhất), `tertinggi` (cao nhất). Dùng `jangan` (không `tidak`) cho mệnh lệnh cấm: `Jangan panik!`. Phân biệt `kami` (chúng tôi, không gồm người nghe) và `kita` (chúng ta, gồm người nghe). Đánh vần viết tắt từng chữ: `BMKG` = be-em-ka-ge, `BNPB` = be-en-pe-be, `BPBD` = be-pe-be-de. Giữ giọng phẳng; `c` đọc 'ch', `j` đọc 'j' (như 'jam').",
    tip_advice_en:
      "Learn the four-line emergency frame to call for help: (1) state the situation — `Halo, ini darurat. Ada [kebakaran/banjir/gempa].`; (2) give the address — `Alamatnya Jalan ___ nomor ___.`; (3) report casualties — `Ada yang terluka / terjebak.`; (4) make the request — `Tolong kirim [ambulans / pemadam].`. Memorize 5 short life-saving shouts: `Awas!` (watch out), `Lari!` (run), `Tolong!` (help), `Cepat!` (hurry), `Jangan panik!` (don't panic).\n\nKeep these affix sets straight: `mengungsi` (evacuate yourself) vs `mengungsikan` (evacuate someone) vs `pengungsi` (a refugee); the unintended-state `ter-`: `terjebak` (trapped), `terluka` (injured), `tertimbun` (buried); the superlative `ter-`: `terdekat` (nearest), `tertinggi` (highest). Use `jangan` (not `tidak`) for negative commands: `Jangan panik!`. Distinguish `kami` (we, excluding the listener) from `kita` (we, including the listener). Spell abbreviations letter by letter: `BMKG` = be-em-ka-ge, `BNPB` = be-en-pe-be, `BPBD` = be-pe-be-de. Keep your pitch flat; `c` is 'ch', `j` is the English 'j' as in 'jam'.",
    vocabulary: [
      // The disasters
      {
        word: "gempa (bumi)",
        en: "earthquake",
        vi: "động đất",
        pos: "noun",
        pronunciation_vi: "GEM-pa (BU-mi) — `g` cứng như 'go'; `gempa susulan` = dư chấn",
        pronunciation_en: "GEM-pa (BOO-mi) — hard `g` as in 'go'; `gempa susulan` = aftershock",
      },
      {
        word: "tsunami",
        en: "tsunami",
        vi: "sóng thần",
        pos: "noun",
        pronunciation_vi: "tsu-NA-mi — phát âm cả cụm 'ts'; `peringatan tsunami` = cảnh báo sóng thần",
        pronunciation_en: "tsu-NA-mi — sound the 'ts'; `peringatan tsunami` = tsunami warning",
      },
      {
        word: "banjir",
        en: "flood",
        vi: "lũ lụt",
        pos: "noun",
        pronunciation_vi: "BAN-jir — `j` đọc 'j'; `banjir bandang` = lũ quét",
        pronunciation_en: "BAN-jir — `j` as in 'jam'; `banjir bandang` = flash flood",
      },
      {
        word: "kebakaran",
        en: "fire (the blaze/event)",
        vi: "đám cháy / vụ cháy",
        pos: "noun",
        pronunciation_vi: "ke-ba-KA-ran — ke-…-an từ `bakar`; khác `membakar` (đốt) và `api` (lửa)",
        pronunciation_en: "ke-ba-KA-ran — ke-…-an from `bakar`; differs from `membakar` (to burn) and `api` (fire/flame)",
      },
      {
        word: "gunung meletus",
        en: "volcanic eruption",
        vi: "núi lửa phun trào",
        pos: "phrase",
        pronunciation_vi: "GU-nung me-LE-tus — `gunung berapi` = núi lửa; `letusan` = vụ phun (danh từ)",
        pronunciation_en: "GU-nung me-LE-tus — `gunung berapi` = volcano; `letusan` = an eruption (noun)",
      },
      {
        word: "tanah longsor",
        en: "landslide",
        vi: "sạt lở đất",
        pos: "noun",
        pronunciation_vi: "TA-nah LONG-sor — thường đi kèm `banjir` sau mưa lớn",
        pronunciation_en: "TA-nah LONG-sor — often follows `banjir` after heavy rain",
      },
      // Actions & states
      {
        word: "mengungsi",
        en: "to evacuate (oneself), take refuge",
        vi: "tự đi sơ tán / lánh nạn",
        pos: "verb",
        pronunciation_vi: "me-ngung-SI — meN- + `ungsi`; KHÁC `mengungsikan` (sơ tán người khác)",
        pronunciation_en: "me-ngoong-SI — meN- + `ungsi`; differs from `mengungsikan` (to evacuate someone)",
      },
      {
        word: "evakuasi",
        en: "evacuation",
        vi: "sự sơ tán",
        pos: "noun",
        pronunciation_vi: "e-va-ku-A-si — `jalur evakuasi` = đường sơ tán; `tempat evakuasi` = điểm sơ tán",
        pronunciation_en: "e-va-koo-A-si — `jalur evakuasi` = evacuation route; `tempat evakuasi` = evacuation point",
      },
      {
        word: "terjebak",
        en: "trapped / stuck",
        vi: "bị kẹt / mắc kẹt",
        pos: "verb (stative)",
        pronunciation_vi: "ter-JE-bak — ter- (trạng thái) + `jebak`; KHÁC `menjebak` (giăng bẫy)",
        pronunciation_en: "ter-JE-bak — ter- (stative) + `jebak`; differs from `menjebak` (to set a trap)",
      },
      {
        word: "terluka",
        en: "injured / hurt",
        vi: "bị thương",
        pos: "verb (stative)",
        pronunciation_vi: "ter-LU-ka — ter- + `luka` (vết thương); `korban luka` = người bị thương",
        pronunciation_en: "ter-LOO-ka — ter- + `luka` (a wound); `korban luka` = the injured",
      },
      {
        word: "selamat",
        en: "safe / to survive",
        vi: "an toàn / sống sót",
        pos: "adjective",
        pronunciation_vi: "se-LA-mat — ở đây 'sống sót', khác lời chào `selamat pagi`",
        pronunciation_en: "se-LA-mat — here 'survived/safe', not the greeting `selamat pagi`",
      },
      // People, places, agencies
      {
        word: "korban",
        en: "victim / casualty",
        vi: "nạn nhân",
        pos: "noun",
        pronunciation_vi: "KOR-ban — `korban jiwa` = người tử vong; `korban luka` = người bị thương",
        pronunciation_en: "KOR-ban — `korban jiwa` = fatalities; `korban luka` = the injured",
      },
      {
        word: "pengungsi",
        en: "refugee / evacuee",
        vi: "người lánh nạn / sơ tán",
        pos: "noun",
        pronunciation_vi: "pe-ngung-SI — peN- từ `ungsi`; ở tạm tại `tempat pengungsian`/`posko`",
        pronunciation_en: "pe-ngoong-SI — peN- from `ungsi`; sheltered at a `tempat pengungsian`/`posko`",
      },
      {
        word: "petugas",
        en: "officer / responder / staff",
        vi: "nhân viên / cán bộ cứu hộ",
        pos: "noun",
        pronunciation_vi: "pe-TU-gas — `petugas penyelamat` = nhân viên cứu hộ; `tim SAR` = đội tìm kiếm cứu nạn",
        pronunciation_en: "pe-TU-gas — `petugas penyelamat` = rescue worker; `tim SAR` = search-and-rescue team",
      },
      {
        word: "BMKG",
        en: "Meteorology, Climatology & Geophysics Agency",
        vi: "Cơ quan Khí tượng & Địa vật lý",
        pos: "noun (acronym)",
        pronunciation_vi: "be-em-ka-GE — đánh vần; ra `peringatan dini` động đất/sóng thần",
        pronunciation_en: "be-em-ka-GE — spell it; issues earthquake/tsunami `peringatan dini`",
      },
      {
        word: "pemadam kebakaran",
        en: "fire brigade / firefighters",
        vi: "lính cứu hỏa",
        pos: "noun",
        pronunciation_vi: "pe-ma-DAM ke-ba-KA-ran — gọi tắt `Damkar`; số `113`",
        pronunciation_en: "pe-ma-DAM ke-ba-KA-ran — short `Damkar`; number `113`",
      },
      {
        word: "darurat",
        en: "emergency",
        vi: "khẩn cấp / tình huống nguy cấp",
        pos: "noun/adjective",
        pronunciation_vi: "da-RU-rat — `keadaan darurat` = tình trạng khẩn cấp; `tanggap darurat` = ứng phó khẩn cấp",
        pronunciation_en: "da-ROO-rat — `keadaan darurat` = state of emergency; `tanggap darurat` = emergency response",
      },
    ],
    dialogue: [
      // Dialogue A: phoning the emergency line during a fire
      {
        speaker: "Operator (112)",
        text: "Halo, layanan darurat. Ada keadaan apa?",
        vi: "A lô, dịch vụ khẩn cấp. Có chuyện gì ạ?",
        en: "Hello, emergency services. What's the situation?",
      },
      {
        speaker: "Penelepon",
        text: "Tolong! Ada kebakaran di rumah saya. Ada orang terjebak di dalam!",
        vi: "Cứu với! Có cháy ở nhà tôi. Có người bị kẹt bên trong!",
        en: "Help! There's a fire at my house. Someone is trapped inside!",
      },
      {
        speaker: "Operator (112)",
        text: "Tetap tenang. Alamatnya di mana?",
        vi: "Hãy bình tĩnh. Địa chỉ ở đâu?",
        en: "Stay calm. What's the address?",
      },
      {
        speaker: "Penelepon",
        text: "Jalan Mawar nomor lima, dekat pasar. Cepat, tolong! Ada juga yang terluka.",
        vi: "Đường Mawar số năm, gần chợ. Nhanh lên, làm ơn! Cũng có người bị thương.",
        en: "Jalan Mawar number five, near the market. Hurry, please! There's an injured person too.",
      },
      {
        speaker: "Operator (112)",
        text: "Pemadam dan ambulans segera meluncur. Keluar dari rumah dan jangan kembali masuk.",
        vi: "Xe cứu hỏa và xe cứu thương đang xuất phát ngay. Hãy ra khỏi nhà và đừng quay vào lại.",
        en: "Fire crew and ambulance are on the way. Get out of the house and don't go back in.",
      },
      // Dialogue B: an earthquake and evacuation
      {
        speaker: "Tetangga",
        text: "Awas! Gempa! Merunduk dan berlindung di bawah meja!",
        vi: "Coi chừng! Động đất! Cúi xuống và nấp dưới bàn!",
        en: "Watch out! Earthquake! Get down and shelter under the table!",
      },
      {
        speaker: "Linh",
        text: "Sudah berhenti. Kita harus mengungsi sekarang. Di mana tempat evakuasi yang terdekat?",
        vi: "Đã ngừng rồi. Chúng ta phải đi sơ tán ngay. Điểm sơ tán gần nhất ở đâu?",
        en: "It's stopped. We have to evacuate now. Where's the nearest evacuation point?",
      },
      {
        speaker: "Tetangga",
        text: "Ikuti jalur evakuasi ke bukit. Apakah ada peringatan tsunami dari BMKG?",
        vi: "Theo đường sơ tán lên đồi. Có cảnh báo sóng thần từ BMKG không?",
        en: "Follow the evacuation route to the hill. Is there a tsunami warning from BMKG?",
      },
      {
        speaker: "Linh",
        text: "Belum ada kabar, tapi kita dekat pantai. Jangan tunggu sirene — naik ke tempat tinggi sekarang.",
        vi: "Chưa có tin, nhưng mình gần biển. Đừng chờ còi — lên chỗ cao ngay bây giờ.",
        en: "No word yet, but we're near the coast. Don't wait for the siren — get to high ground now.",
      },
      {
        speaker: "Tetangga",
        text: "Jangan panik. Bawa air dan dokumen penting. Tolong bantu Bu Ani, dia kesulitan berjalan.",
        vi: "Đừng hoảng. Mang theo nước và giấy tờ quan trọng. Làm ơn giúp bà Ani, bà ấy đi lại khó khăn.",
        en: "Don't panic. Bring water and important documents. Please help Bu Ani, she has trouble walking.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Coi chừng! Động đất! Chạy ra ngoài!", answer: "Awas! Gempa! Lari ke luar!" },
          { prompt: "Có người bị kẹt bên trong!", answer: "Ada orang terjebak di dalam!" },
          { prompt: "Có cháy ở nhà tôi.", answer: "Ada kebakaran di rumah saya." },
          { prompt: "Chúng ta phải đi sơ tán ngay.", answer: "Kita harus mengungsi sekarang." },
          { prompt: "Điểm sơ tán gần nhất ở đâu?", answer: "Di mana tempat evakuasi yang terdekat?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Gọi cứu hộ — dịch sang tiếng Indonesia:",
        instruction_en: "Calling for help — translate into Indonesian:",
        items: [
          { prompt: "A lô, đây là trường hợp khẩn cấp.", answer: "Halo, ini darurat." },
          { prompt: "Địa chỉ là đường Mawar số năm.", answer: "Alamatnya Jalan Mawar nomor lima." },
          { prompt: "Có người bị thương, làm ơn gửi xe cứu thương.", answer: "Ada yang terluka, tolong kirim ambulans." },
          { prompt: "Đừng hoảng loạn, hãy làm theo chỉ dẫn của nhân viên.", answer: "Jangan panik, ikuti petunjuk petugas." },
          { prompt: "Gia đình tôi an toàn nhưng nhà bị hư hại nặng.", answer: "Keluarga saya selamat, tapi rumah kami rusak parah." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `mengungsi`, `mengungsikan`, `pengungsi`, `terjebak`, hay `terluka` cho đúng (chủ động vs danh từ vs trạng thái ter-):",
        instruction_en:
          "Choose `mengungsi`, `mengungsikan`, `pengungsi`, `terjebak`, or `terluka` correctly (active vs noun vs ter- state):",
        items: [
          { prompt: "Kita harus ___ ke tempat tinggi.", answer: "mengungsi", hint: "động từ 'tự sơ tán' (meN-)" },
          { prompt: "Petugas ___ warga ke posko.", answer: "mengungsikan", hint: "động từ 'sơ tán NGƯỜI khác' (meN-…-kan)" },
          { prompt: "Ada ratusan ___ di posko itu.", answer: "pengungsi", hint: "danh từ 'người lánh nạn' (peN-)" },
          { prompt: "Dua orang ___ di dalam reruntuhan.", answer: "terjebak", hint: "trạng thái 'bị kẹt' (ter-)" },
          { prompt: "Banyak korban ___ akibat gempa.", answer: "terluka", hint: "trạng thái 'bị thương' (ter-)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung gọi khẩn cấp — điền chỗ trống: `Halo, ini darurat. Ada ___ di ___. Alamatnya Jalan ___ nomor ___. Tolong kirim ___.`",
        instruction_en:
          "Emergency-call frame — fill the blanks: `Halo, ini darurat. Ada ___ di ___. Alamatnya Jalan ___ nomor ___. Tolong kirim ___.`",
        example:
          "Halo, ini darurat. Ada kebakaran di rumah saya. Alamatnya Jalan Mawar nomor lima. Tolong kirim pemadam dan ambulans.",
        example_vi:
          "A lô, đây là khẩn cấp. Có cháy ở nhà tôi. Địa chỉ đường Mawar số năm. Làm ơn gửi xe cứu hỏa và xe cứu thương.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra ứng phó thiên tai — bạn làm được chưa?",
        instruction_en: "Disaster-response self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể hô các tiếng cứu mạng ngắn: `Awas! Lari! Tolong!`", en: "I can shout the short life-saving words: `Awas! Lari! Tolong!`" },
          { vi: "Tôi có thể gọi `112`/`119` và báo tình huống + địa chỉ.", en: "I can call `112`/`119` and report the situation + address." },
          { vi: "Tôi phân biệt được `mengungsi` (tự sơ tán) và `mengungsikan` (sơ tán người khác).", en: "I can tell `mengungsi` (evacuate yourself) from `mengungsikan` (evacuate someone)." },
          { vi: "Tôi dùng đúng trạng thái `ter-`: `terjebak`, `terluka`, `tertimbun`.", en: "I use the `ter-` states correctly: `terjebak`, `terluka`, `tertimbun`." },
          { vi: "Tôi dùng `jangan` (không `tidak`) cho mệnh lệnh cấm: `Jangan panik!`.", en: "I use `jangan` (not `tidak`) for negative commands: `Jangan panik!`." },
          { vi: "Tôi phân biệt được `kami` (không gồm người nghe) và `kita` (gồm người nghe).", en: "I can tell `kami` (excluding listener) from `kita` (including listener)." },
          { vi: "Tôi đánh vần được `BMKG` = be-em-ka-ge và biết các số khẩn cấp.", en: "I can spell `BMKG` = be-em-ka-ge and know the emergency numbers." },
        ],
      },
    ],
  },
];

export default lessons;
