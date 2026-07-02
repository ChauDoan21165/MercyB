// Flood & Rainy Season Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// pronunciation/culture notes with English companions in pronunciation_focus_en.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

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
    id: "indonesian_flood_rainy_season",
    level: "B1",
    category: "emergency",
    title_vi: "Mùa mưa và ngập lụt ở Indonesia",
    title_en: "Floods and the rainy season in Indonesia",
    sentences: [
      {
        en: "Musim hujan sudah mulai, jadi kita harus siap banjir.",
        vi: "Mùa mưa đã bắt đầu, nên chúng ta phải sẵn sàng đối phó ngập lụt.",
        pronunciation_focus: [
          "MU-sim HU-jan SU-dah mu-LAI — `musim hujan` = mùa mưa; `banjir` = ngập/lũ.",
          "Lỗi người Việt: nói `musim air`. Cụm tự nhiên là `musim hujan`, không dịch từng chữ từ 'mùa nước'.",
          "Luyện: `Kita harus siap banjir.`",
        ],
        pronunciation_focus_en: [
          "MU-sim HU-jan SU-dah mu-LAI — `musim hujan` = rainy season; `banjir` = flood/flooding.",
          "VN-speaker trap: saying `musim air`. Natural Indonesian is `musim hujan`, not a literal 'water season'.",
          "Drill: `Kita harus siap banjir.`",
        ],
      },
      {
        en: "Hujan deras dari tadi malam membuat selokan penuh.",
        vi: "Mưa to từ tối qua làm cống/rãnh thoát nước đầy.",
        pronunciation_focus: [
          "HU-jan de-RAS da-ri TA-di MA-lam — `hujan deras` = mưa to; `selokan` = cống/rãnh thoát nước nhỏ.",
          "Lỗi người Việt: dùng `kanal` cho mọi loại cống. Trong khu dân cư, rãnh thoát nước thường gọi là `selokan`.",
          "Luyện: `Selokan penuh karena hujan deras.`",
        ],
        pronunciation_focus_en: [
          "HU-jan de-RAS da-ri TA-di MA-lam — `hujan deras` = heavy rain; `selokan` = small drain/ditch.",
          "VN-speaker trap: using `kanal` for every drain. In neighborhoods, small drainage channels are usually `selokan`.",
          "Drill: `Selokan penuh karena hujan deras.`",
        ],
      },
      {
        en: "Air mulai masuk ke rumah sekitar jam tiga pagi.",
        vi: "Nước bắt đầu tràn vào nhà khoảng ba giờ sáng.",
        pronunciation_focus: [
          "A-ir mu-LAI MA-suk ke RU-mah — `air masuk` = nước vào/tràn vào; `sekitar` = khoảng.",
          "Lỗi người Việt: quên giới từ hướng `ke`. Nước tràn VÀO nhà là `masuk ke rumah`.",
          "Luyện: `Air masuk ke rumah.`",
        ],
        pronunciation_focus_en: [
          "A-ir mu-LAI MA-suk ke RU-mah — `air masuk` = water enters; `sekitar` = around/about.",
          "VN-speaker trap: dropping directional `ke`. Water entering the house is `masuk ke rumah`.",
          "Drill: `Air masuk ke rumah.`",
        ],
      },
      {
        en: "Rumah kami kebanjiran setinggi lutut.",
        vi: "Nhà chúng tôi bị ngập cao tới đầu gối.",
        pronunciation_focus: [
          "RU-mah KA-mi ke-ban-JIR-an se-TING-gi LU-tut — `kebanjiran` = bị ngập; `setinggi lutut` = cao tới đầu gối.",
          "Mẹo affix: `ke-...-an` thường chỉ trạng thái bị ảnh hưởng: `kebanjiran` = bị lụt/ngập.",
          "Lỗi người Việt: nói `rumah banjir` được hiểu, nhưng tự nhiên hơn là `rumah kami kebanjiran`.",
        ],
        pronunciation_focus_en: [
          "RU-mah KA-mi ke-ban-JIR-an se-TING-gi LU-tut — `kebanjiran` = flooded; `setinggi lutut` = knee-high.",
          "Affix tip: `ke-...-an` often marks an affected state: `kebanjiran` = got flooded.",
          "VN-speaker trap: `rumah banjir` is understood, but `rumah kami kebanjiran` is more natural.",
        ],
      },
      {
        en: "Tolong matikan listrik sebelum air makin tinggi.",
        vi: "Làm ơn tắt điện trước khi nước dâng cao hơn.",
        pronunciation_focus: [
          "TO-long MA-ti-kan LIS-trik se-BE-lum A-ir MA-kin TING-gi — `matikan` = tắt; `makin` = càng/ngày càng.",
          "Lỗi người Việt: dùng `mati listrik` cho hành động tắt điện. `mati listrik` = mất điện; `matikan listrik` = tắt điện.",
          "Luyện: `Matikan listrik sekarang.`",
        ],
        pronunciation_focus_en: [
          "TO-long MA-ti-kan LIS-trik se-BE-lum A-ir MA-kin TING-gi — `matikan` = turn off; `makin` = increasingly.",
          "VN-speaker trap: using `mati listrik` for turning power off. `mati listrik` = power outage; `matikan listrik` = turn off power.",
          "Drill: `Matikan listrik sekarang.`",
        ],
      },
      {
        en: "Pompa air rusak, jadi air sulit surut.",
        vi: "Máy bơm nước bị hỏng, nên nước khó rút.",
        pronunciation_focus: [
          "POM-pa A-ir RU-sak — `pompa air` = máy bơm nước; `surut` = rút xuống.",
          "Lỗi người Việt: nói `air turun` cho nước rút. Trong ngập lụt, từ chính xác là `air surut`.",
          "Luyện: `Air belum surut.`",
        ],
        pronunciation_focus_en: [
          "POM-pa A-ir RU-sak — `pompa air` = water pump; `surut` = recede/go down.",
          "VN-speaker trap: saying `air turun` for floodwater receding. In flood context, use `air surut`.",
          "Drill: `Air belum surut.`",
        ],
      },
      {
        en: "Jalan utama ditutup karena banjir tinggi.",
        vi: "Đường chính bị đóng vì ngập sâu.",
        pronunciation_focus: [
          "JA-lan u-TA-ma di-TU-tup ka-RE-na ban-JIR TING-gi — `jalan utama` = đường chính; `ditutup` = bị đóng.",
          "Lỗi người Việt: quên bị động `di-`. Biển báo/thông báo thường dùng `jalan ditutup`.",
          "Luyện: `Jalan ditutup karena banjir.`",
        ],
        pronunciation_focus_en: [
          "JA-lan u-TA-ma di-TU-tup ka-RE-na ban-JIR TING-gi — `jalan utama` = main road; `ditutup` = closed.",
          "VN-speaker trap: dropping passive `di-`. Signs and alerts often say `jalan ditutup`.",
          "Drill: `Jalan ditutup karena banjir.`",
        ],
      },
      {
        en: "Warga membantu evakuasi anak-anak dan lansia.",
        vi: "Người dân hỗ trợ sơ tán trẻ em và người cao tuổi.",
        pronunciation_focus: [
          "WAR-ga mem-BAN-tu e-va-ku-A-si A-nak-A-nak dan LAN-si-a — `warga` = cư dân/người dân; `lansia` = người cao tuổi.",
          "Lỗi người Việt: dùng `orang tua` cho người cao tuổi. `orang tua` cũng nghĩa là bố mẹ; trong cứu trợ dùng `lansia` rõ hơn.",
          "Luyện: `Bantu evakuasi lansia.`",
        ],
        pronunciation_focus_en: [
          "WAR-ga mem-BAN-tu e-va-ku-A-si A-nak-A-nak dan LAN-si-a — `warga` = residents; `lansia` = elderly people.",
          "VN-speaker trap: using `orang tua` for elderly people. It can mean parents; in relief contexts `lansia` is clearer.",
          "Drill: `Bantu evakuasi lansia.`",
        ],
      },
      {
        en: "Kami mengungsi ke posko dekat masjid.",
        vi: "Chúng tôi sơ tán đến điểm trú/cứu trợ gần nhà thờ Hồi giáo.",
        pronunciation_focus: [
          "KA-mi me-NGUNG-si ke POS-ko de-KAT MAS-jid — `mengungsi` = đi lánh nạn/sơ tán; `posko` = điểm chỉ huy/cứu trợ.",
          "Lỗi người Việt: nói `evakuasi ke posko` cho bản thân. `evakuasi` là quá trình sơ tán; người dân nói `mengungsi ke posko`.",
          "Luyện: `Kami mengungsi ke posko.`",
        ],
        pronunciation_focus_en: [
          "KA-mi me-NGUNG-si ke POS-ko de-KAT MAS-jid — `mengungsi` = evacuate/take shelter; `posko` = command/relief post.",
          "VN-speaker trap: saying `evakuasi ke posko` for yourself. `evakuasi` is the evacuation process; residents say `mengungsi ke posko`.",
          "Drill: `Kami mengungsi ke posko.`",
        ],
      },
      {
        en: "Tetangga membagikan nasi bungkus dan air minum.",
        vi: "Hàng xóm phát cơm hộp/gói và nước uống.",
        pronunciation_focus: [
          "te-TANG-ga mem-ba-GI-kan NA-si BUNG-kus dan A-ir MI-num — `nasi bungkus` = phần cơm gói/hộp; `membagikan` = phân phát.",
          "Lỗi người Việt: gọi mọi đồ cứu trợ là `hadiah`. Cứu trợ/thức ăn phát cho dân là `bantuan` hoặc `membagikan makanan`.",
          "Luyện: `Warga membagikan air minum.`",
        ],
        pronunciation_focus_en: [
          "te-TANG-ga mem-ba-GI-kan NA-si BUNG-kus dan A-ir MI-num — `nasi bungkus` = wrapped boxed rice meal; `membagikan` = distribute.",
          "VN-speaker trap: calling all relief goods `hadiah`. Aid/food distribution is `bantuan` or `membagikan makanan`.",
          "Drill: `Warga membagikan air minum.`",
        ],
      },
      {
        en: "Tolong laporkan kalau ada warga yang butuh bantuan.",
        vi: "Làm ơn báo nếu có cư dân cần hỗ trợ.",
        pronunciation_focus: [
          "TO-long la-POR-kan KA-lau A-da WAR-ga yang BU-tuh ban-TU-an — `laporkan` = báo cáo/báo cho; `bantuan` = hỗ trợ/cứu trợ.",
          "Lỗi người Việt: dùng `membantu` khi cần danh từ. Động từ là `membantu`; danh từ là `bantuan`.",
          "Luyện: `Butuh bantuan apa?`",
        ],
        pronunciation_focus_en: [
          "TO-long la-POR-kan KA-lau A-da WAR-ga yang BU-tuh ban-TU-an — `laporkan` = report/notify; `bantuan` = help/aid.",
          "VN-speaker trap: using `membantu` when you need a noun. Verb: `membantu`; noun: `bantuan`.",
          "Drill: `Butuh bantuan apa?`",
        ],
      },
      {
        en: "Setelah banjir surut, rumah harus dibersihkan dan disemprot disinfektan.",
        vi: "Sau khi nước lũ rút, nhà phải được dọn sạch và phun khử trùng.",
        pronunciation_focus: [
          "se-TE-lah ban-JIR SU-rut — `setelah` = sau khi; `dibersihkan` = được dọn sạch; `disemprot` = được phun.",
          "Mẹo: thông báo hướng dẫn sau lũ hay dùng bị động `di-`: `dibersihkan`, `disemprot`, `diperiksa`.",
          "Luyện: `Rumah harus dibersihkan setelah banjir.`",
        ],
        pronunciation_focus_en: [
          "se-TE-lah ban-JIR SU-rut — `setelah` = after; `dibersihkan` = cleaned; `disemprot` = sprayed.",
          "Tip: post-flood instructions often use passive `di-`: `dibersihkan`, `disemprot`, `diperiksa`.",
          "Drill: `Rumah harus dibersihkan setelah banjir.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, mùa mưa thường đi kèm nguy cơ `banjir`, nhất là khu đô thị thấp, gần sông, hoặc nơi `selokan` bị tắc. Khi ngập, thông báo khu dân cư thường nhắc `jalan ditutup`, `listrik dimatikan`, `evakuasi`, `posko`, và `bantuan warga`. Người dân hay phối hợp qua nhóm WhatsApp RT/RW để báo mực nước, đường bị đóng, nhu cầu đồ ăn/nước uống và người cần sơ tán.",
    cultural_notes_en:
      "In Indonesia, the rainy season often brings `banjir`, especially in low urban areas, near rivers, or where `selokan` drains are blocked. During floods, neighborhood alerts commonly mention `jalan ditutup`, `listrik dimatikan`, `evakuasi`, `posko`, and `bantuan warga`. Residents often coordinate through RT/RW WhatsApp groups to report water levels, road closures, food/water needs, and people needing evacuation.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `banjir` (ngập/lũ), `kebanjiran` (bị ngập), `air surut` (nước rút), `mengungsi` (đi lánh nạn), `evakuasi` (sơ tán/quá trình cứu hộ). Trong cảnh báo, bị động `di-` rất thường gặp: `ditutup`, `dimatikan`, `dibersihkan`. Học nguyên cụm sẽ phản ứng nhanh hơn khi có sự cố.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `banjir` (flood/flooding), `kebanjiran` (got flooded), `air surut` (water recedes), `mengungsi` (take shelter), and `evakuasi` (evacuation/rescue process). In warnings, passive `di-` is common: `ditutup`, `dimatikan`, `dibersihkan`. Learn fixed chunks so you can react quickly in an incident.",
    vocabulary: [
      { word: "banjir", en: "flood / flooding", vi: "ngập lụt", pos: "noun / verb", pronunciation_vi: "ban-JIR", pronunciation_en: "ban-JEER" },
      { word: "musim hujan", en: "rainy season", vi: "mùa mưa", pos: "noun phrase", pronunciation_vi: "MU-sim HU-jan", pronunciation_en: "MOO-sim HOO-jan" },
      { word: "hujan deras", en: "heavy rain", vi: "mưa to", pos: "noun phrase", pronunciation_vi: "HU-jan de-RAS", pronunciation_en: "HOO-jan de-RAS" },
      { word: "selokan", en: "drain / ditch", vi: "cống/rãnh thoát nước", pos: "noun", pronunciation_vi: "se-LO-kan", pronunciation_en: "se-LO-kan" },
      { word: "pompa air", en: "water pump", vi: "máy bơm nước", pos: "noun phrase", pronunciation_vi: "POM-pa A-ir", pronunciation_en: "POM-pa A-eer" },
      { word: "kebanjiran", en: "flooded / affected by flood", vi: "bị ngập", pos: "verb / state", pronunciation_vi: "ke-ban-JIR-an", pronunciation_en: "ke-ban-JEER-an" },
      { word: "surut", en: "recede / go down", vi: "rút xuống", pos: "verb", pronunciation_vi: "SU-rut", pronunciation_en: "SOO-root" },
      { word: "evakuasi", en: "evacuation", vi: "sơ tán", pos: "noun", pronunciation_vi: "e-va-ku-A-si", pronunciation_en: "e-va-koo-A-see" },
      { word: "mengungsi", en: "to evacuate / take shelter", vi: "đi lánh nạn", pos: "verb", pronunciation_vi: "me-NGUNG-si", pronunciation_en: "me-NGUNG-see" },
      { word: "posko", en: "relief post / command post", vi: "điểm cứu trợ/chỉ huy", pos: "noun", pronunciation_vi: "POS-ko", pronunciation_en: "POS-ko" },
      { word: "bantuan warga", en: "resident/community aid", vi: "hỗ trợ của người dân", pos: "noun phrase", pronunciation_vi: "ban-TU-an WAR-ga", pronunciation_en: "ban-TOO-an WAR-ga" },
      { word: "jalan ditutup", en: "road closed", vi: "đường bị đóng", pos: "phrase", pronunciation_vi: "JA-lan di-TU-tup", pronunciation_en: "JA-lan di-TOO-toop" },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Pak RT, air sudah masuk ke rumah kami.",
        vi: "Bác trưởng khu, nước đã vào nhà chúng tôi rồi.",
        en: "Neighborhood head, water has entered our house.",
      },
      {
        speaker: "Pak RT",
        text: "Matikan listrik dulu. Kalau air makin tinggi, segera mengungsi ke posko.",
        vi: "Tắt điện trước. Nếu nước dâng cao hơn, hãy sơ tán ngay đến điểm cứu trợ.",
        en: "Turn off the power first. If the water rises higher, evacuate to the post immediately.",
      },
      {
        speaker: "Rina",
        text: "Jalan utama masih bisa dilewati?",
        vi: "Đường chính vẫn còn đi qua được không?",
        en: "Can the main road still be passed?",
      },
      {
        speaker: "Pak RT",
        text: "Tidak bisa. Jalan ditutup karena banjir setinggi lutut.",
        vi: "Không được. Đường bị đóng vì ngập cao tới đầu gối.",
        en: "No. The road is closed because the flood is knee-high.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng về mùa mưa và ngập lụt:",
        instruction_en: "Fill in the right rainy-season/flood word:",
        items: [
          {
            prompt: "Rumah kami ___ setinggi lutut. (bị ngập)",
            answer: "kebanjiran",
            options: ["kebanjiran", "kemarau", "kelaparan"],
          },
          {
            prompt: "Jalan utama ___ karena banjir tinggi. (bị đóng)",
            answer: "ditutup",
            options: ["ditutup", "dibuka", "ditulis"],
          },
          {
            prompt: "Air belum ___, jadi kami masih di posko. (rút xuống)",
            answer: "surut",
            options: ["surut", "sulit", "surat"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "musim hujan", answer: "mùa mưa" },
          { prompt: "selokan penuh", answer: "cống/rãnh thoát nước đầy" },
          { prompt: "pompa air rusak", answer: "máy bơm nước bị hỏng" },
          { prompt: "bantuan warga", answer: "hỗ trợ của người dân" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Nước bắt đầu vào nhà.", answer: "Air mulai masuk ke rumah." },
          { prompt: "Làm ơn tắt điện trước.", answer: "Tolong matikan listrik dulu." },
          { prompt: "Chúng tôi sơ tán đến điểm cứu trợ.", answer: "Kami mengungsi ke posko." },
        ],
      },
    ],
  },
];

export default lessons;
