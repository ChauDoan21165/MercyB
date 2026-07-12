// Camping & outdoor gear Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 23 file. Covers berkemah, tenda, sleeping bag, kompor portable,
// senter, perlengkapan hujan, api unggun, and sampah.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
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
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_camping_outdoor_gear",
    level: "A2",
    category: "travel",
    title_vi: "Đi cắm trại và chuẩn bị đồ outdoor",
    title_en: "Camping and outdoor gear",
    sentences: [
      {
        en: "Akhir pekan ini kami mau berkemah di dekat danau.",
        vi: "Cuối tuần này chúng tôi muốn cắm trại gần hồ.",
        pronunciation_focus: [
          "A-khir PE-kan I-ni KA-mi MAU ber-KE-mah di de-KAT DA-nau - `berkemah` = cắm trại; `danau` = hồ.",
          "`kami` không gồm người nghe. Nếu rủ người nghe cùng đi, dùng `kita mau berkemah`.",
          "Lỗi người Việt: nói `kemah` như động từ trong mọi câu. Danh từ là `kemah/tenda`; động từ tự nhiên là `berkemah`.",
        ],
        pronunciation_focus_en: [
          "A-khir PE-kan EE-nee KA-mi MAU ber-KE-mah di de-KAT DA-now - `berkemah` = go camping; `danau` = lake.",
          "`kami` excludes the listener. If inviting the listener along, use `kita mau berkemah`.",
          "VN-speaker trap: using `kemah` as the verb everywhere. The noun is `kemah/tenda`; the natural verb is `berkemah`.",
        ],
      },
      {
        en: "Tenda harus dipasang sebelum hujan turun.",
        vi: "Lều phải được dựng trước khi mưa xuống.",
        pronunciation_focus: [
          "TEN-da HA-rus di-PA-sang se-BE-lum HU-jan TU-run - `tenda` = lều; `dipasang` = được dựng/lắp.",
          "Bị động `di-` rất tự nhiên trong hướng dẫn: `tenda dipasang`, `barang dibawa`, `sampah dibuang`.",
          "Lỗi người Việt: bỏ `di-` và nói `tenda pasang`. Nói chuẩn: `tenda dipasang` hoặc `kami memasang tenda`.",
        ],
        pronunciation_focus_en: [
          "TEN-da HA-rus di-PA-sang se-BE-lum HOO-jan TOO-run - `tenda` = tent; `dipasang` = set up.",
          "Passive `di-` is very natural in instructions: `tenda dipasang`, `barang dibawa`, `sampah dibuang`.",
          "VN-speaker trap: dropping `di-` and saying `tenda pasang`. Standard: `tenda dipasang` or `kami memasang tenda`.",
        ],
      },
      {
        en: "Saya membawa sleeping bag karena malam hari sangat dingin.",
        vi: "Tôi mang túi ngủ vì ban đêm rất lạnh.",
        pronunciation_focus: [
          "SA-ya mem-BA-wa SLI-ping beg ka-RE-na MA-lam HA-ri SA-ngat DI-ngin - `sleeping bag` = túi ngủ; `malam hari` = ban đêm.",
          "Người Indonesia thường dùng từ mượn `sleeping bag`; cũng có thể nghe `kantong tidur`, nhưng ít phổ biến hơn.",
          "Lỗi người Việt: dịch cứng thành `tas tidur`. Từ tự nhiên trong đồ cắm trại là `sleeping bag`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-BA-wa SLEE-ping bag ka-RE-na MA-lam HA-ree SA-ngat DEE-ngin - `sleeping bag` = sleeping bag; `malam hari` = at night.",
          "Indonesians commonly use the loanword `sleeping bag`; `kantong tidur` exists but is less common.",
          "VN-speaker trap: translating literally as `tas tidur`. The natural camping term is `sleeping bag`.",
        ],
      },
      {
        en: "Kompor portable dan gas kecil sudah masuk tas.",
        vi: "Bếp portable và bình gas nhỏ đã vào trong túi rồi.",
        pronunciation_focus: [
          "KOM-por POR-ta-bel dan gas KE-cil SU-dah MA-suk tas - `kompor portable` = bếp di động; `gas kecil` = bình gas nhỏ.",
          "`sudah masuk tas` là cách nói gọn: đồ đã được bỏ vào túi/ba lô.",
          "Lỗi người Việt: dùng `kompor kecil` khi muốn nói bếp dã ngoại. Có thể hiểu, nhưng `kompor portable` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "KOM-por POR-ta-bel dan gas KE-chil SOO-dah MA-suk tas - `kompor portable` = portable stove; `gas kecil` = small gas canister.",
          "`sudah masuk tas` is compact: the gear has been put into the bag/backpack.",
          "VN-speaker trap: saying `kompor kecil` when you mean a camping stove. Understandable, but `kompor portable` is clearer.",
        ],
      },
      {
        en: "Jangan lupa bawa senter dan baterai cadangan.",
        vi: "Đừng quên mang đèn pin và pin dự phòng.",
        pronunciation_focus: [
          "JA-ngan LU-pa BA-wa SEN-ter dan ba-te-RAI ca-DA-ngan - `senter` = đèn pin; `baterai cadangan` = pin dự phòng.",
          "`jangan lupa` = đừng quên; dùng `jangan`, không dùng `tidak`, khi ra lệnh/cảnh báo.",
          "Lỗi người Việt: gọi đèn pin là `lampu kecil`. Từ cụ thể và tự nhiên là `senter`.",
        ],
        pronunciation_focus_en: [
          "JA-ngan LOO-pa BA-wa SEN-ter dan ba-te-RAI cha-DA-ngan - `senter` = flashlight/torch; `baterai cadangan` = spare batteries.",
          "`jangan lupa` = do not forget; use `jangan`, not `tidak`, for commands/warnings.",
          "VN-speaker trap: calling a flashlight `lampu kecil`. The specific natural word is `senter`.",
        ],
      },
      {
        en: "Perlengkapan hujan harus selalu ada di tas.",
        vi: "Đồ đi mưa phải luôn có trong túi.",
        pronunciation_focus: [
          "per-leng-KAP-an HU-jan HA-rus se-LA-lu A-da di tas - `perlengkapan hujan` = đồ đi mưa; `selalu` = luôn luôn.",
          "`perlengkapan` là bộ đồ/trang bị, rộng hơn một món `alat`.",
          "Lỗi người Việt: chỉ nói `bawa jas hujan` dù cần cả túi chống nước, áo mưa, và bọc balo. Cụm rộng là `perlengkapan hujan`.",
        ],
        pronunciation_focus_en: [
          "per-leng-KAP-an HOO-jan HA-rus se-LA-loo A-da di tas - `perlengkapan hujan` = rain gear; `selalu` = always.",
          "`perlengkapan` means gear/equipment set, broader than a single `alat`.",
          "VN-speaker trap: only saying `bawa jas hujan` when you need dry bags, raincoat, and backpack cover. Broader phrase: `perlengkapan hujan`.",
        ],
      },
      {
        en: "Boleh menyalakan api unggun di area ini?",
        vi: "Có được đốt lửa trại ở khu vực này không?",
        pronunciation_focus: [
          "BO-leh me-nya-LA-kan A-pi UNG-gun di a-RE-a I-ni - `api unggun` = lửa trại; `menyalakan` = đốt/bật lên.",
          "`boleh` hỏi xin phép. Trong khu cắm trại, câu này lịch sự và quan trọng.",
          "Lỗi người Việt: nói `buat api` cho đốt lửa trại. Tự nhiên hơn: `menyalakan api unggun`.",
        ],
        pronunciation_focus_en: [
          "BO-leh me-nya-LA-kan A-pee OONG-goon di a-RE-a EE-nee - `api unggun` = campfire; `menyalakan` = light/start.",
          "`boleh` asks permission. In a campsite, this is polite and important.",
          "VN-speaker trap: saying `buat api` for making a campfire. More natural: `menyalakan api unggun`.",
        ],
      },
      {
        en: "Sampah harus dibawa turun, jangan ditinggal di hutan.",
        vi: "Rác phải được mang xuống, đừng để lại trong rừng.",
        pronunciation_focus: [
          "SAM-pah HA-rus di-BA-wa TU-run, JA-ngan di-TING-gal di HU-tan - `sampah` = rác; `dibawa turun` = được mang xuống.",
          "`ditinggal` = bị/được để lại. Với rác, dùng câu cấm: `jangan ditinggal`.",
          "Lỗi người Việt: nói `buang sampah di hutan` theo thói quen. Ở khu tự nhiên, nguyên tắc là `bawa turun sampah`.",
        ],
        pronunciation_focus_en: [
          "SAM-pah HA-rus di-BA-wa TOO-run, JA-ngan di-TING-gal di HOO-tan - `sampah` = trash; `dibawa turun` = brought down/out.",
          "`ditinggal` = left behind. For trash, use the prohibition: `jangan ditinggal`.",
          "VN-speaker trap: saying `buang sampah di hutan` from habit. In nature areas, the rule is `bawa turun sampah`.",
        ],
      },
      {
        en: "Kalau angin kencang, jangan pasang tenda dekat pohon besar.",
        vi: "Nếu gió mạnh, đừng dựng lều gần cây lớn.",
        pronunciation_focus: [
          "KA-lau A-ngin KEN-cang, JA-ngan PA-sang TEN-da de-KAT PO-hon be-SAR - `angin kencang` = gió mạnh; `pohon besar` = cây lớn.",
          "`kalau` = nếu/khi; dùng tự nhiên trong lời khuyên an toàn.",
          "Lỗi người Việt: dịch 'gió mạnh' thành `angin kuat`. Hiểu được, nhưng cụm tự nhiên hơn là `angin kencang`.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-ngin KEN-chang, JA-ngan PA-sang TEN-da de-KAT PO-hon be-SAR - `angin kencang` = strong wind; `pohon besar` = big tree.",
          "`kalau` = if/when; natural in safety advice.",
          "VN-speaker trap: translating 'strong wind' as `angin kuat`. Understandable, but more natural is `angin kencang`.",
        ],
      },
      {
        en: "Kita cek perlengkapan lagi sebelum berangkat.",
        vi: "Chúng ta kiểm tra lại đồ đạc trước khi khởi hành.",
        pronunciation_focus: [
          "KI-ta cek per-leng-KAP-an LA-gi se-BE-lum ber-ANG-kat - `cek perlengkapan` = kiểm tra đồ/trang bị; `sebelum berangkat` = trước khi đi.",
          "`kita` gồm người nghe, hợp khi nói với nhóm đi cùng.",
          "Lỗi người Việt: nói `periksa barang` được hiểu nhưng chung chung. Với đồ outdoor, `cek perlengkapan` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "KI-ta chek per-leng-KAP-an LA-gee se-BE-lum ber-ANG-kat - `cek perlengkapan` = check gear; `sebelum berangkat` = before leaving.",
          "`kita` includes the listener, right when speaking to your group.",
          "VN-speaker trap: `periksa barang` is understood but generic. For outdoor gear, `cek perlengkapan` is more natural.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, cắm trại có thể ở khu hồ, bãi biển, rừng, hoặc chân núi. Nhiều khu cắm trại có aturan riêng về `api unggun`, khu dựng `tenda`, giờ masuk/keluar, và rác. Mùa mưa có thể đến nhanh, nên `perlengkapan hujan`, túi chống nước, senter, và pin dự phòng rất quan trọng. Trong văn hóa outdoor Indonesia, câu `bawa turun sampah` nhấn mạnh trách nhiệm không để rác lại ở núi/rừng.",
    cultural_notes_en:
      "In Indonesia, camping can be near lakes, beaches, forests, or mountain areas. Many campsites have rules about `api unggun`, tent areas, entry/exit hours, and trash. Rain can arrive quickly in the wet season, so `perlengkapan hujan`, dry bags, flashlights, and spare batteries matter. In Indonesian outdoor culture, `bawa turun sampah` emphasizes the responsibility not to leave trash in mountains/forests.",
    tip_advice_vi:
      "Mẹo cho người Việt: `berkemah` là động từ cắm trại, `tenda` là lều, `senter` là đèn pin, `api unggun` là lửa trại. Khi nói quy định/an toàn, tiếng Indonesia rất hay dùng bị động `di-`: `tenda dipasang`, `sampah dibawa turun`, `api unggun dilarang`. Hỏi xin phép bằng `Boleh...?` trước khi đốt lửa hoặc dựng lều ở khu chưa rõ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `berkemah` is the verb to camp, `tenda` is tent, `senter` is flashlight, and `api unggun` is campfire. Safety/rule language often uses passive `di-`: `tenda dipasang`, `sampah dibawa turun`, `api unggun dilarang`. Ask permission with `Boleh...?` before lighting a fire or pitching a tent in an unclear area.",
    vocabulary: [
      { cell_id: "0e9a38ed-c69a-49df-90b4-c1b290f433f9", word: "berkemah", en: "to camp", vi: "cắm trại", pos: "verb", pronunciation_vi: "ber-KE-mah", pronunciation_en: "ber-KE-mah" },
      { cell_id: "c01f21dd-8b4f-4965-9371-925a6fff2093", word: "tenda", en: "tent", vi: "lều", pos: "noun", pronunciation_vi: "TEN-da", pronunciation_en: "TEN-da" },
      { cell_id: "7d2711dd-270c-4ce2-a004-54d4b8ac2695", word: "sleeping bag", en: "sleeping bag", vi: "túi ngủ", pos: "noun", pronunciation_vi: "SLI-ping beg", pronunciation_en: "SLEE-ping bag" },
      { cell_id: "44e74a07-8efe-4c3a-a7f7-63351b22f121", word: "kompor portable", en: "portable stove", vi: "bếp di động", pos: "noun phrase", pronunciation_vi: "KOM-por POR-ta-bel", pronunciation_en: "KOM-por POR-ta-bel" },
      { cell_id: "eb98983d-1d73-4d81-a232-4a7877c3e672", word: "senter", en: "flashlight / torch", vi: "đèn pin", pos: "noun", pronunciation_vi: "SEN-ter", pronunciation_en: "SEN-ter" },
      { cell_id: "af12e970-74e9-4a09-a9da-1acca7ed9888", word: "perlengkapan hujan", en: "rain gear", vi: "đồ đi mưa", pos: "noun phrase", pronunciation_vi: "per-leng-KAP-an HU-jan", pronunciation_en: "per-leng-KAP-an HOO-jan" },
      { cell_id: "9b116a2d-b3a6-4c50-b40b-44b0490ae0c9", word: "api unggun", en: "campfire", vi: "lửa trại", pos: "noun phrase", pronunciation_vi: "A-pi UNG-gun", pronunciation_en: "A-pee OONG-goon" },
      { cell_id: "00e34f12-c0d8-4018-899e-9995b12415ef", word: "sampah", en: "trash / garbage", vi: "rác", pos: "noun", pronunciation_vi: "SAM-pah", pronunciation_en: "SAM-pah" },
      { cell_id: "e2778b18-3be0-44cb-acf9-e73abcd10836", word: "angin kencang", en: "strong wind", vi: "gió mạnh", pos: "noun phrase", pronunciation_vi: "A-ngin KEN-cang", pronunciation_en: "A-ngin KEN-chang" },
      { cell_id: "b6dec2e5-6724-4b75-95ba-5329307e694a", word: "bawa turun sampah", en: "carry trash down/out", vi: "mang rác xuống/ra ngoài", pos: "verb phrase", pronunciation_vi: "BA-wa TU-run SAM-pah", pronunciation_en: "BA-wa TOO-run SAM-pah" },
    ],
    dialogue: [
      {
        cell_id: "de0e37fe-68d4-46a2-9d29-562a20f48ef2",
        speaker: "Rina",
        text: "Kita jadi berkemah akhir pekan ini?",
        vi: "Cuối tuần này mình vẫn đi cắm trại chứ?",
        en: "Are we still camping this weekend?",
      },
      {
        cell_id: "bf74a6d4-208b-4b02-8afa-c6d80c2036a4",
        speaker: "Bima",
        text: "Jadi. Aku sudah bawa tenda, sleeping bag, dan kompor portable.",
        vi: "Đi chứ. Mình đã mang lều, túi ngủ và bếp di động.",
        en: "Yes. I have brought the tent, sleeping bag, and portable stove.",
      },
      {
        cell_id: "f49a5b0a-a69e-4866-bae1-da245a0e9f41",
        speaker: "Rina",
        text: "Jangan lupa senter dan perlengkapan hujan.",
        vi: "Đừng quên đèn pin và đồ đi mưa.",
        en: "Do not forget the flashlight and rain gear.",
      },
      {
        cell_id: "f4326412-364e-4a15-8cc6-1bf49b2870c4",
        speaker: "Bima",
        text: "Siap. Tapi kita harus tanya dulu apakah boleh menyalakan api unggun.",
        vi: "Được. Nhưng mình phải hỏi trước có được đốt lửa trại không.",
        en: "Got it. But we should ask first whether we may light a campfire.",
      },
      {
        cell_id: "21692bf1-75de-49f0-85e7-0e6327065164",
        speaker: "Rina",
        text: "Setuju. Sampah juga harus kita bawa turun.",
        vi: "Đồng ý. Rác cũng phải mang xuống.",
        en: "Agreed. We also have to carry the trash out.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "berkemah", answer: "cắm trại" },
          { prompt: "senter", answer: "đèn pin" },
          { prompt: "api unggun", answer: "lửa trại" },
          { prompt: "perlengkapan hujan", answer: "đồ đi mưa" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Đừng quên mang đèn pin và pin dự phòng.", answer: "Jangan lupa bawa senter dan baterai cadangan." },
          { prompt: "Có được đốt lửa trại ở khu vực này không?", answer: "Boleh menyalakan api unggun di area ini?" },
          { prompt: "Rác phải được mang xuống.", answer: "Sampah harus dibawa turun." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Tenda harus ___ sebelum hujan turun.", answer: "dipasang" },
          { prompt: "Saya membawa ___ karena malam hari sangat dingin.", answer: "sleeping bag" },
          { prompt: "Kalau angin ___, jangan pasang tenda dekat pohon besar.", answer: "kencang" },
        ],
      },
    ],
  },
];
