// Cooking Gas & LPG Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_cooking_gas_lpg",
    level: "B1",
    category: "housing",
    title_vi: "Gas LPG và an toàn bếp",
    title_en: "LPG cooking gas and kitchen safety",
    sentences: [
      {
        en: "Gas LPG di dapur sudah hampir habis.",
        vi: "Gas LPG trong bếp sắp hết rồi.",
        pronunciation_focus: [
          "gas LPG di DA-pur SU-dah HAM-pir HA-bis -- `hampir habis` = sắp hết; `dapur` = bếp.",
          "Lỗi người Việt: nói `gas mau habis` được trong khẩu ngữ, nhưng `sudah hampir habis` rõ và tự nhiên hơn khi báo cho chủ nhà.",
          "Luyện: `Gas LPG sudah hampir habis.`",
        ],
        pronunciation_focus_en: [
          "gas LPG di DA-pur SOO-dah HAM-pir HA-bis -- `hampir habis` = almost finished; `dapur` = kitchen.",
          "VN-speaker trap: `gas mau habis` can work casually, but `sudah hampir habis` is clearer and natural when telling a landlord.",
          "Drill: `Gas LPG sudah hampir habis.`",
        ],
      },
      {
        en: "Saya perlu tukar tabung gas di warung gas dekat sini.",
        vi: "Tôi cần đổi bình gas ở cửa hàng gas gần đây.",
        pronunciation_focus: [
          "SA-ya per-LU TU-kar TA-bung gas di WA-rung gas de-KAT SI-ni -- `tukar tabung` = đổi bình; `warung gas` = điểm bán gas nhỏ.",
          "`tukar` thường nghĩa là đổi bình rỗng lấy bình đầy, không chỉ mua một bình mới.",
          "Luyện: `Saya perlu tukar tabung gas.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO TOO-kar TA-boong gas di WA-roong gas de-KAT SEE-ni -- `tukar tabung` = exchange the cylinder; `warung gas` = small gas shop.",
          "`Tukar` often means exchanging an empty cylinder for a full one, not simply buying a new cylinder.",
          "Drill: `Saya perlu tukar tabung gas.`",
        ],
      },
      {
        en: "Regulatornya tidak terpasang rapat.",
        vi: "Bộ điều áp chưa được gắn chặt.",
        pronunciation_focus: [
          "re-gu-LA-tor-nya TI-dak ter-PA-sang RA-pat -- `regulator` = bộ điều áp; `rapat` = chặt/kín.",
          "Mẹo: `terpasang` = đang được gắn/lắp; thêm `rapat` để nói lắp kín, không hở.",
          "Luyện: `Regulatornya tidak terpasang rapat.`",
        ],
        pronunciation_focus_en: [
          "re-gu-LA-tor-nya TEE-dak ter-PA-sang RA-pat -- `regulator` = regulator; `rapat` = tight/sealed.",
          "Tip: `terpasang` = installed/attached; add `rapat` to mean tightly sealed, not loose.",
          "Drill: `Regulatornya tidak terpasang rapat.`",
        ],
      },
      {
        en: "Saya mencium bau gas, mungkin ada bocor gas.",
        vi: "Tôi ngửi thấy mùi gas, có thể có rò rỉ gas.",
        pronunciation_focus: [
          "SA-ya men-CI-um BA-u gas, MUNG-kin A-da BO-cor gas -- `bau gas` = mùi gas; `bocor gas` = rò rỉ gas.",
          "Lỗi người Việt: dùng `rusak gas`. Với rò rỉ, dùng `bocor`: `tabung bocor`, `selang bocor`, `gas bocor`.",
          "Luyện: `Saya mencium bau gas.`",
        ],
        pronunciation_focus_en: [
          "SA-ya men-CHEE-um BA-u gas, MOONG-kin A-da BO-chor gas -- `bau gas` = gas smell; `bocor gas` = gas leak.",
          "VN-speaker trap: using `rusak gas`. For leaks, use `bocor`: `tabung bocor`, `selang bocor`, `gas bocor`.",
          "Drill: `Saya mencium bau gas.`",
        ],
      },
      {
        en: "Jangan nyalakan kompor dulu kalau ada bau gas.",
        vi: "Đừng bật bếp trước nếu có mùi gas.",
        pronunciation_focus: [
          "JA-ngan nya-LA-kan KOM-por DU-lu KA-lau A-da BA-u gas -- `nyalakan kompor` = bật bếp; `jangan... dulu` = đừng vội.",
          "`dulu` ở đây làm câu mềm: đừng làm việc đó trước đã, chờ kiểm tra.",
          "Luyện: `Jangan nyalakan kompor dulu.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan nya-LA-kan KOM-por DOO-lu KA-lau A-da BA-u gas -- `nyalakan kompor` = turn on the stove; `jangan... dulu` = don't do it yet.",
          "`Dulu` softens the instruction here: don't do that yet, wait and check first.",
          "Drill: `Jangan nyalakan kompor dulu.`",
        ],
      },
      {
        en: "Tolong buka jendela supaya udara masuk.",
        vi: "Làm ơn mở cửa sổ để không khí vào.",
        pronunciation_focus: [
          "TO-long BU-ka JEN-de-la su-PA-ya u-DA-ra MA-suk -- `udara masuk` = không khí đi vào; `supaya` = để/nhằm.",
          "Mẹo: `tolong + động từ` là mẫu nhờ lịch sự nhưng rõ ràng trong tình huống cần xử lý nhanh.",
          "Luyện: `Tolong buka jendela.`",
        ],
        pronunciation_focus_en: [
          "TO-long BOO-ka JEN-de-la soo-PA-ya oo-DA-ra MA-suk -- `udara masuk` = air comes in; `supaya` = so that.",
          "Tip: `tolong + verb` is polite but clear in situations that need quick action.",
          "Drill: `Tolong buka jendela.`",
        ],
      },
      {
        en: "Selang gas ini sudah retak dan harus diganti.",
        vi: "Ống dẫn gas này đã nứt và phải được thay.",
        pronunciation_focus: [
          "SE-lang gas I-ni SU-dah RE-tak dan HA-rus di-GAN-ti -- `selang gas` = ống dẫn gas; `retak` = nứt.",
          "`harus diganti` = phải được thay. Bị động `di-` rất hay dùng khi nói đồ cần sửa/thay.",
          "Luyện: `Selang gas harus diganti.`",
        ],
        pronunciation_focus_en: [
          "SE-lang gas EE-ni SOO-dah RE-tak dan HA-rus di-GAN-ti -- `selang gas` = gas hose; `retak` = cracked.",
          "`Harus diganti` = must be replaced. The `di-` passive is common when saying an item needs repair/replacement.",
          "Drill: `Selang gas harus diganti.`",
        ],
      },
      {
        en: "Kebocoran gas bisa menyebabkan bahaya kebakaran.",
        vi: "Rò rỉ gas có thể gây nguy cơ hỏa hoạn.",
        pronunciation_focus: [
          "ke-bo-COR-an gas BI-sa me-nye-BAB-kan ba-HA-ya ke-ba-KAR-an -- `kebocoran` = sự rò rỉ; `bahaya kebakaran` = nguy cơ cháy.",
          "Lỗi người Việt: chỉ nói `api bahaya`. Cụm tự nhiên và rõ hơn là `bahaya kebakaran`.",
          "Luyện: `Kebocoran gas berbahaya.`",
        ],
        pronunciation_focus_en: [
          "ke-bo-CHOR-an gas BEE-sa me-nye-BAB-kan ba-HA-ya ke-ba-KAR-an -- `kebocoran` = leak/leakage; `bahaya kebakaran` = fire hazard.",
          "VN-speaker trap: only saying `api bahaya`. The natural, clearer phrase is `bahaya kebakaran`.",
          "Drill: `Kebocoran gas berbahaya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhiều nhà Indonesia, bếp dùng tabung gas LPG, thường loại 3 kg hoặc 12 kg. Khi hết gas, người thuê nhà thường gọi warung gas hoặc tukang antar gas để `tukar tabung`. Nếu ngửi thấy `bau gas`, người Indonesia thường nói rõ `jangan nyalakan kompor`, `buka jendela`, và `cek regulator/selang`. Với an toàn, nói ngắn gọn và trực tiếp được xem là bình thường.",
    cultural_notes_en:
      "Many Indonesian homes cook with LPG cylinders, often 3 kg or 12 kg. When the gas runs out, tenants often call a small gas shop or delivery worker to `tukar tabung`, exchange the cylinder. If someone smells gas, Indonesians commonly say clear phrases like `jangan nyalakan kompor`, `buka jendela`, and `cek regulator/selang`. For safety, short and direct wording is normal.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm vật dụng và rủi ro: `tabung gas`, `regulator`, `selang gas`, `kompor`, `bocor gas`, `bau gas`, `tukar tabung`, `bahaya kebakaran`. Phân biệt `habis` (hết gas) với `bocor` (rò rỉ) và `rusak` (hỏng thiết bị).",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn object-and-risk chunks: `tabung gas`, `regulator`, `selang gas`, `kompor`, `bocor gas`, `bau gas`, `tukar tabung`, `bahaya kebakaran`. Distinguish `habis` (gas is used up), `bocor` (leaking), and `rusak` (equipment is broken).",
    vocabulary: [
      {
        word: "gas LPG",
        en: "LPG gas",
        vi: "gas LPG",
        pos: "noun phrase",
        pronunciation_vi: "gas el-pe-GE",
        pronunciation_en: "gas el-pee-GEE",
      },
      {
        word: "tabung gas",
        en: "gas cylinder",
        vi: "bình gas",
        pos: "noun phrase",
        pronunciation_vi: "TA-bung gas",
        pronunciation_en: "TA-boong gas",
      },
      {
        word: "regulator",
        en: "regulator",
        vi: "bộ điều áp",
        pos: "noun",
        pronunciation_vi: "re-gu-LA-tor",
        pronunciation_en: "re-gu-LA-tor",
      },
      {
        word: "bocor gas",
        en: "gas leak",
        vi: "rò rỉ gas",
        pos: "phrase",
        pronunciation_vi: "BO-cor gas",
        pronunciation_en: "BO-chor gas",
      },
      {
        word: "kompor",
        en: "stove",
        vi: "bếp",
        pos: "noun",
        pronunciation_vi: "KOM-por",
        pronunciation_en: "KOM-por",
      },
      {
        word: "tukar tabung",
        en: "exchange a gas cylinder",
        vi: "đổi bình gas",
        pos: "verb phrase",
        pronunciation_vi: "TU-kar TA-bung",
        pronunciation_en: "TOO-kar TA-boong",
      },
      {
        word: "warung gas",
        en: "small gas shop",
        vi: "cửa hàng/điểm bán gas nhỏ",
        pos: "noun phrase",
        pronunciation_vi: "WA-rung gas",
        pronunciation_en: "WA-roong gas",
      },
      {
        word: "bahaya kebakaran",
        en: "fire hazard",
        vi: "nguy cơ hỏa hoạn",
        pos: "noun phrase",
        pronunciation_vi: "ba-HA-ya ke-ba-KAR-an",
        pronunciation_en: "ba-HA-ya ke-ba-KAR-an",
      },
    ],
    dialogue: [
      {
        speaker: "Penyewa",
        text: "Pak, gas LPG di dapur sudah hampir habis.",
        vi: "Chú ơi, gas LPG trong bếp sắp hết rồi.",
        en: "Sir, the LPG gas in the kitchen is almost finished.",
      },
      {
        speaker: "Pemilik rumah",
        text: "Baik, nanti saya minta warung gas antar tabung baru.",
        vi: "Được, lát nữa tôi nhờ cửa hàng gas giao bình mới.",
        en: "Okay, I will ask the gas shop to deliver a new cylinder later.",
      },
      {
        speaker: "Penyewa",
        text: "Regulatornya juga agak longgar, saya takut ada bocor gas.",
        vi: "Bộ điều áp cũng hơi lỏng, tôi sợ có rò rỉ gas.",
        en: "The regulator is also a bit loose; I am afraid there may be a gas leak.",
      },
      {
        speaker: "Pemilik rumah",
        text: "Jangan nyalakan kompor dulu. Buka jendela dan tunggu saya datang.",
        vi: "Đừng bật bếp trước. Mở cửa sổ và chờ tôi đến.",
        en: "Do not turn on the stove yet. Open the window and wait for me to come.",
      },
      {
        speaker: "Penyewa",
        text: "Baik, saya juga akan cek selang gas dari jauh.",
        vi: "Vâng, tôi cũng sẽ kiểm tra ống gas từ xa.",
        en: "Okay, I will also check the gas hose from a distance.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Tôi ngửi thấy mùi gas.'",
        prompt_en: "Translate into Indonesian: 'I smell gas.'",
        answer: "Saya mencium bau gas.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya perlu tukar ____ gas di warung gas.`",
        prompt_en: "Fill in the blank: `Saya perlu tukar ____ gas di warung gas.`",
        answer: "tabung",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["bocor gas", "rò rỉ gas"],
          ["selang gas", "ống dẫn gas"],
          ["bahaya kebakaran", "nguy cơ hỏa hoạn"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn là người thuê nhà. Báo với chủ nhà rằng gas sắp hết, regulator lỏng, có mùi gas, và hỏi có thể đổi bình gas hôm nay không.",
        prompt_en:
          "You are a tenant. Tell the landlord that the gas is almost finished, the regulator is loose, there is a gas smell, and ask whether the cylinder can be exchanged today.",
      },
    ],
    content:
      "Use this lesson for practical Indonesian around LPG cooking gas at home: exchanging cylinders, talking to a landlord or gas shop, naming the regulator and hose, reporting gas smell or leakage, and using clear safety language around stove and fire hazards.",
  },
];
