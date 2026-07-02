// Heat & Haze Weather Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// pronunciation/weather notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_weather_heat_haze",
    level: "B1",
    category: "weather",
    title_vi: "Nắng nóng, oi bức và khói mù",
    title_en: "Hot weather, humidity, and haze",
    sentences: [
      {
        en: "Cuaca hari ini panas sekali dan terasa gerah.",
        vi: "Thời tiết hôm nay rất nóng và cảm thấy oi bức.",
        pronunciation_focus: [
          "CU-a-ca HA-ri I-ni PA-nas se-KA-li dan te-RA-sa GE-rah - `cuaca` = thời tiết; `gerah` = oi/nóng bí.",
          "Lỗi người Việt: dùng `panas` cho mọi cảm giác nóng. `Gerah` là nóng ẩm, bí, khó chịu.",
          "Luyện: `Hari ini panas dan gerah.`",
        ],
        pronunciation_focus_en: [
          "CHOO-a-cha HA-ri I-ni PA-nas se-KA-li dan te-RA-sa GE-rah - `cuaca` = weather; `gerah` = humid, stuffy heat.",
          "VN-speaker trap: using `panas` for every kind of heat. `Gerah` is sticky, humid discomfort.",
          "Drill: `Hari ini panas dan gerah.`",
        ],
      },
      {
        en: "Kabut asap membuat mata perih dan tenggorokan gatal.",
        vi: "Khói mù làm mắt cay và cổ họng ngứa.",
        pronunciation_focus: [
          "KA-but A-sap mem-BU-at MA-ta PE-rih dan teng-go-RO-kan GA-tal - `kabut asap` = khói mù; `perih` = cay/rát.",
          "Lỗi người Việt: dịch haze là `kabut` thôi. `Kabut` là sương mù; khói mù do cháy/ô nhiễm là `kabut asap`.",
          "Luyện: `Mata saya perih karena kabut asap.`",
        ],
        pronunciation_focus_en: [
          "KA-but A-sap mem-BOO-at MA-ta PE-rih dan teng-go-RO-kan GA-tal - `kabut asap` = haze/smoke haze; `perih` = stinging/sore.",
          "VN-speaker trap: translating haze as only `kabut`. `Kabut` is fog; smoke/pollution haze is `kabut asap`.",
          "Drill: `Mata saya perih karena kabut asap.`",
        ],
      },
      {
        en: "Kualitas udara sedang buruk, jadi pakai masker di luar.",
        vi: "Chất lượng không khí đang xấu, nên đeo khẩu trang khi ở ngoài.",
        pronunciation_focus: [
          "ku-a-li-TAS U-da-ra SE-dang BU-ruk, JA-di PA-kai MAS-ker di LU-ar - `kualitas udara` = chất lượng không khí; `buruk` = xấu.",
          "Lỗi người Việt: nói `udara jelek` trong thông báo. Hiểu được, nhưng chuẩn hơn là `kualitas udara buruk`.",
          "Luyện: `Pakai masker di luar.`",
        ],
        pronunciation_focus_en: [
          "koo-a-lee-TAS OO-da-ra SE-dang BOO-ruk, JA-di PA-kai MAS-ker di LOO-ar - `kualitas udara` = air quality; `buruk` = poor/bad.",
          "VN-speaker trap: saying `udara jelek` in an alert. It is understood, but `kualitas udara buruk` is standard.",
          "Drill: `Pakai masker di luar.`",
        ],
      },
      {
        en: "Anak-anak dan lansia sebaiknya tetap di dalam rumah.",
        vi: "Trẻ em và người cao tuổi tốt nhất nên ở trong nhà.",
        pronunciation_focus: [
          "A-nak-A-nak dan LAN-si-a se-BAIK-nya te-TAP di DA-lam RU-mah - `sebaiknya` = tốt nhất nên; `lansia` = người cao tuổi.",
          "Lỗi người Việt: dùng `orang tua` cho người cao tuổi. `Orang tua` cũng là bố mẹ; trong cảnh báo dùng `lansia` rõ hơn.",
          "Luyện: `Sebaiknya tetap di dalam rumah.`",
        ],
        pronunciation_focus_en: [
          "A-nak-A-nak dan LAN-see-a se-BAIK-nya te-TAP di DA-lam ROO-mah - `sebaiknya` = it is best to; `lansia` = elderly people.",
          "VN-speaker trap: using `orang tua` for elderly people. It also means parents; in alerts `lansia` is clearer.",
          "Drill: `Sebaiknya tetap di dalam rumah.`",
        ],
      },
      {
        en: "Jangan lupa minum air yang cukup supaya tidak dehidrasi.",
        vi: "Đừng quên uống đủ nước để không bị mất nước.",
        pronunciation_focus: [
          "JA-ngan LU-pa MI-num A-ir yang CU-kup su-PA-ya ti-DAK de-hi-DRA-si - `minum air` = uống nước; `dehidrasi` = mất nước.",
          "Lỗi người Việt: nói `minum nước` bị lẫn tiếng Việt. Tiếng Indonesia là `minum air`.",
          "Luyện: `Minum air yang cukup.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan LOO-pa MI-num A-eer yang CHOO-kup su-PA-ya ti-DAK de-hi-DRA-si - `minum air` = drink water; `dehidrasi` = dehydration.",
          "VN-speaker trap: mixing in Vietnamese `nước`. Indonesian says `minum air`.",
          "Drill: `Minum air yang cukup.`",
        ],
      },
      {
        en: "BMKG mengeluarkan peringatan cuaca panas ekstrem.",
        vi: "BMKG phát cảnh báo thời tiết nắng nóng cực đoan.",
        pronunciation_focus: [
          "be-em-ka-ge me-nge-LU-ar-kan pe-ring-A-tan CU-a-ca PA-nas eks-TREM - `peringatan cuaca` = cảnh báo thời tiết.",
          "Lỗi người Việt: đọc BMKG như một từ. Đọc từng chữ Indonesia: be-em-ka-ge.",
          "Luyện: `Ada peringatan cuaca panas.`",
        ],
        pronunciation_focus_en: [
          "be-em-ka-ge me-nge-LOO-ar-kan pe-ring-A-tan CHOO-a-cha PA-nas eks-TREM - `peringatan cuaca` = weather warning.",
          "VN-speaker trap: reading BMKG as one word. Spell it Indonesian-style: be-em-ka-ge.",
          "Drill: `Ada peringatan cuaca panas.`",
        ],
      },
      {
        en: "Kalau hujan turun, kabut asap biasanya berkurang.",
        vi: "Nếu mưa xuống, khói mù thường giảm.",
        pronunciation_focus: [
          "KA-lau HU-jan TU-run, KA-but A-sap bi-a-SA-nya ber-KU-rang - `hujan turun` = mưa xuống; `berkurang` = giảm.",
          "Lỗi người Việt: dùng `hujan datang`. Tiếng Indonesia tự nhiên là `hujan turun`.",
          "Luyện: `Kabut asap berkurang setelah hujan.`",
        ],
        pronunciation_focus_en: [
          "KA-lau HOO-jan TOO-run, KA-but A-sap bee-a-SA-nya ber-KOO-rang - `hujan turun` = rain falls; `berkurang` = decrease.",
          "VN-speaker trap: saying `hujan datang`. Natural Indonesian is `hujan turun`.",
          "Drill: `Kabut asap berkurang setelah hujan.`",
        ],
      },
      {
        en: "Langit terlihat abu-abu karena asap dari kebakaran hutan.",
        vi: "Bầu trời trông xám vì khói từ cháy rừng.",
        pronunciation_focus: [
          "LA-ngit ter-li-HAT A-bu-A-bu ka-RE-na A-sap da-ri ke-ba-KA-ran HU-tan - `abu-abu` = màu xám; `kebakaran hutan` = cháy rừng.",
          "Lỗi người Việt: dịch `xám` thành `hitam putih`. Màu xám là `abu-abu`.",
          "Luyện: `Langit terlihat abu-abu.`",
        ],
        pronunciation_focus_en: [
          "LA-ngit ter-li-HAT A-boo-A-boo ka-RE-na A-sap da-ri ke-ba-KA-ran HOO-tan - `abu-abu` = gray; `kebakaran hutan` = forest fire.",
          "VN-speaker trap: translating gray as `hitam putih`. Gray is `abu-abu`.",
          "Drill: `Langit terlihat abu-abu.`",
        ],
      },
      {
        en: "Saya merasa pusing karena terlalu lama di bawah matahari.",
        vi: "Tôi thấy chóng mặt vì ở dưới nắng quá lâu.",
        pronunciation_focus: [
          "SA-ya me-RA-sa PU-sing ka-RE-na ter-LA-lu LA-ma di BA-wah ma-ta-HA-ri - `pusing` = chóng mặt/đau đầu; `matahari` = mặt trời.",
          "Lỗi người Việt: dùng `sakit kepala` cho mọi trường hợp. `Pusing` là chóng mặt/choáng, rất hay dùng khi nắng nóng.",
          "Luyện: `Saya merasa pusing.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-RA-sa POO-sing ka-RE-na ter-LA-lu LA-ma di BA-wah ma-ta-HA-ri - `pusing` = dizzy/headachy; `matahari` = sun.",
          "VN-speaker trap: using `sakit kepala` for every case. `Pusing` is dizzy/lightheaded, common in heat.",
          "Drill: `Saya merasa pusing.`",
        ],
      },
      {
        en: "Tolong cari tempat yang teduh dulu.",
        vi: "Làm ơn tìm chỗ râm trước đã.",
        pronunciation_focus: [
          "TO-long CA-ri TEM-pat yang te-DUH DU-lu - `teduh` = râm/mát dưới bóng; `dulu` = trước đã.",
          "Lỗi người Việt: dùng `dingin` cho chỗ râm. `Dingin` = lạnh; chỗ râm/mát là `teduh`.",
          "Luyện: `Cari tempat yang teduh.`",
        ],
        pronunciation_focus_en: [
          "TO-long CHA-ri TEM-pat yang te-DUH DOO-loo - `teduh` = shaded/cool; `dulu` = first/for now.",
          "VN-speaker trap: using `dingin` for shade. `Dingin` = cold; shaded/cool is `teduh`.",
          "Drill: `Cari tempat yang teduh.`",
        ],
      },
      {
        en: "Jarak pandang berkurang karena kabut asap tebal.",
        vi: "Tầm nhìn giảm vì khói mù dày.",
        pronunciation_focus: [
          "JA-rak PAN-dang ber-KU-rang ka-RE-na KA-but A-sap te-BAL - `jarak pandang` = tầm nhìn; `tebal` = dày.",
          "Lỗi người Việt: dịch `visibility` thành `visi`. Trong cảnh báo giao thông/thời tiết, dùng `jarak pandang`.",
          "Luyện: `Jarak pandang berkurang.`",
        ],
        pronunciation_focus_en: [
          "JA-rak PAN-dang ber-KOO-rang ka-RE-na KA-but A-sap te-BAL - `jarak pandang` = visibility; `tebal` = thick.",
          "VN-speaker trap: translating visibility as `visi`. In weather/traffic alerts, use `jarak pandang`.",
          "Drill: `Jarak pandang berkurang.`",
        ],
      },
      {
        en: "Sekolah diliburkan sementara karena kualitas udara tidak sehat.",
        vi: "Trường học được cho nghỉ tạm thời vì chất lượng không khí không lành mạnh.",
        pronunciation_focus: [
          "se-KO-lah di-LI-bur-kan se-men-TA-ra ka-RE-na ku-a-li-TAS U-da-ra ti-DAK SE-hat - `diliburkan` = được cho nghỉ; `sementara` = tạm thời.",
          "Lỗi người Việt: nói `sekolah libur` được trong nói thường, nhưng thông báo chính thức hay dùng `sekolah diliburkan`.",
          "Luyện: `Sekolah diliburkan sementara.`",
        ],
        pronunciation_focus_en: [
          "se-KO-lah di-LEE-bur-kan se-men-TA-ra ka-RE-na koo-a-lee-TAS OO-da-ra ti-DAK SE-hat - `diliburkan` = closed/given a holiday; `sementara` = temporarily.",
          "VN-speaker trap: `sekolah libur` works casually, but formal notices often use `sekolah diliburkan`.",
          "Drill: `Sekolah diliburkan sementara.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, nắng nóng và `gerah` thường đi cùng mùa khô. Ở một số vùng như Sumatra và Kalimantan, `kabut asap` có thể xuất hiện do cháy rừng/lahan, làm chất lượng không khí xấu và tầm nhìn giảm. Người dân thường theo dõi cảnh báo từ BMKG hoặc chính quyền địa phương, đeo masker, hạn chế ra ngoài, uống đủ nước, và chờ `hujan turun` để khói mù giảm.",
    cultural_notes_en:
      "In Indonesia, hot weather and `gerah` often come with the dry season. In areas such as Sumatra and Kalimantan, `kabut asap` can appear from forest/land fires, worsening air quality and reducing visibility. People often follow warnings from BMKG or local authorities, wear masks, limit outdoor activity, drink enough water, and wait for `hujan turun` to reduce the haze.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `panas` (nóng), `gerah` (oi/bí do nóng ẩm), `teduh` (râm mát), `kabut` (sương mù), `kabut asap` (khói mù), `kualitas udara` (chất lượng không khí), `peringatan cuaca` (cảnh báo thời tiết). Trong cảnh báo chính thức, thể bị động `di-` hay xuất hiện: `diliburkan`, `dikeluarkan`, `dianjurkan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `panas` (hot), `gerah` (humid/stuffy), `teduh` (shaded/cool), `kabut` (fog), `kabut asap` (smoke haze), `kualitas udara` (air quality), and `peringatan cuaca` (weather warning). Official notices often use passive `di-`: `diliburkan`, `dikeluarkan`, `dianjurkan`.",
    vocabulary: [
      { word: "cuaca panas", en: "hot weather", vi: "thời tiết nắng nóng", pos: "noun phrase", pronunciation_vi: "CU-a-ca PA-nas", pronunciation_en: "CHOO-a-cha PA-nas" },
      { word: "gerah", en: "humid / stuffy-hot", vi: "oi bức", pos: "adjective", pronunciation_vi: "GE-rah", pronunciation_en: "GE-rah" },
      { word: "kabut asap", en: "smoke haze", vi: "khói mù", pos: "noun phrase", pronunciation_vi: "KA-but A-sap", pronunciation_en: "KA-but A-sap" },
      { word: "kualitas udara", en: "air quality", vi: "chất lượng không khí", pos: "noun phrase", pronunciation_vi: "ku-a-li-TAS U-da-ra", pronunciation_en: "koo-a-lee-TAS OO-da-ra" },
      { word: "masker", en: "mask", vi: "khẩu trang", pos: "noun", pronunciation_vi: "MAS-ker", pronunciation_en: "MAS-ker" },
      { word: "minum air", en: "drink water", vi: "uống nước", pos: "verb phrase", pronunciation_vi: "MI-num A-ir", pronunciation_en: "MI-num A-eer" },
      { word: "hujan turun", en: "rain falls", vi: "mưa xuống", pos: "verb phrase", pronunciation_vi: "HU-jan TU-run", pronunciation_en: "HOO-jan TOO-run" },
      { word: "peringatan cuaca", en: "weather warning", vi: "cảnh báo thời tiết", pos: "noun phrase", pronunciation_vi: "pe-ring-A-tan CU-a-ca", pronunciation_en: "pe-ring-A-tan CHOO-a-cha" },
      { word: "jarak pandang", en: "visibility", vi: "tầm nhìn", pos: "noun phrase", pronunciation_vi: "JA-rak PAN-dang", pronunciation_en: "JA-rak PAN-dang" },
      { word: "teduh", en: "shaded / cool", vi: "râm mát", pos: "adjective", pronunciation_vi: "te-DUH", pronunciation_en: "te-DOOH" },
      { word: "dehidrasi", en: "dehydration", vi: "mất nước", pos: "noun", pronunciation_vi: "de-hi-DRA-si", pronunciation_en: "de-hi-DRA-see" },
      { word: "tidak sehat", en: "unhealthy", vi: "không lành mạnh", pos: "adjective phrase", pronunciation_vi: "ti-DAK SE-hat", pronunciation_en: "ti-DAK SE-hat" },
    ],
    dialogue: [
      {
        speaker: "Rani",
        text: "Hari ini gerah sekali. Langit juga terlihat abu-abu.",
        vi: "Hôm nay oi bức quá. Bầu trời cũng trông xám.",
        en: "It is very humid-hot today. The sky also looks gray.",
      },
      {
        speaker: "Dimas",
        text: "Iya, ada kabut asap. Kualitas udara sedang buruk.",
        vi: "Ừ, có khói mù. Chất lượng không khí đang xấu.",
        en: "Yes, there is haze. The air quality is poor.",
      },
      {
        speaker: "Rani",
        text: "Kalau keluar, kita pakai masker dan bawa air minum.",
        vi: "Nếu ra ngoài, chúng ta đeo khẩu trang và mang nước uống.",
        en: "If we go outside, we should wear masks and bring drinking water.",
      },
      {
        speaker: "Dimas",
        text: "Betul. Semoga hujan turun supaya kabut asap berkurang.",
        vi: "Đúng rồi. Hy vọng mưa xuống để khói mù giảm.",
        en: "Right. Hopefully rain falls so the haze decreases.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng về nắng nóng và khói mù:",
        instruction_en: "Fill in the right heat/haze word:",
        items: [
          {
            prompt: "Cuaca panas dan terasa ___. (oi bức)",
            answer: "gerah",
            options: ["gerah", "garam", "gagal"],
          },
          {
            prompt: "Kualitas ___ sedang buruk. (không khí)",
            answer: "udara",
            options: ["udara", "uang", "ujian"],
          },
          {
            prompt: "Jangan lupa ___ air yang cukup. (uống)",
            answer: "minum",
            options: ["minum", "makan", "mandi"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "kabut asap", answer: "khói mù" },
          { prompt: "peringatan cuaca", answer: "cảnh báo thời tiết" },
          { prompt: "jarak pandang", answer: "tầm nhìn" },
          { prompt: "tempat yang teduh", answer: "chỗ râm mát" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Thời tiết hôm nay rất nóng và oi bức.", answer: "Cuaca hari ini panas sekali dan terasa gerah." },
          { prompt: "Chất lượng không khí đang xấu.", answer: "Kualitas udara sedang buruk." },
          { prompt: "Nếu mưa xuống, khói mù thường giảm.", answer: "Kalau hujan turun, kabut asap biasanya berkurang." },
        ],
      },
    ],
  },
];

export default lessons;
