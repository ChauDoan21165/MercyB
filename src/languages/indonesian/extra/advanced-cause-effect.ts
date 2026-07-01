// Advanced Cause & Effect Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// cause-effect/register notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_advanced_cause_effect",
    level: "B2",
    category: "academic_communication",
    title_vi: "Phân tích nguyên nhân và kết quả nâng cao",
    title_en: "Advanced cause and effect analysis",
    sentences: [
      {
        en: "Karena itu, kita perlu melihat masalah ini secara lebih luas.",
        vi: "Vì vậy, chúng ta cần nhìn vấn đề này rộng hơn.",
        pronunciation_focus: [
          "ka-RE-na I-tu, KI-ta per-LU me-LI-hat MA-sa-lah I-ni se-CA-ra LE-bih LU-as - `karena itu` = vì vậy; `secara lebih luas` = một cách rộng hơn.",
          "Lỗi người Việt: dùng `karena` một mình để mở câu kết quả. `Karena itu` mới là cụm kết luận 'vì vậy'.",
          "Luyện: `Karena itu, kita perlu...`",
        ],
        pronunciation_focus_en: [
          "ka-RE-na I-too, KI-ta per-LOO me-LI-hat MA-sa-lah I-ni se-CHA-ra LE-bih LOO-as - `karena itu` = for that reason; `secara lebih luas` = more broadly.",
          "VN-speaker trap: using bare `karena` to open a result sentence. `Karena itu` is the conclusion connector.",
          "Drill: `Karena itu, kita perlu...`",
        ],
      },
      {
        en: "Akibatnya, biaya operasional meningkat cukup tajam.",
        vi: "Hậu quả là chi phí vận hành tăng khá mạnh.",
        pronunciation_focus: [
          "a-KI-bat-nya, BI-a-ya o-pe-ra-si-o-NAL me-NING-kat CU-kup TA-jam - `akibatnya` = hậu quả là; `meningkat tajam` = tăng mạnh.",
          "Lỗi người Việt: dùng `hasilnya` cho hậu quả tiêu cực. `Akibatnya` phù hợp hơn khi nói hệ quả.",
          "Luyện: `Akibatnya, biaya meningkat.`",
        ],
        pronunciation_focus_en: [
          "a-KEE-bat-nya, BEE-a-ya o-pe-ra-si-o-NAL me-NING-kat CHOO-kup TA-jam - `akibatnya` = as a result; `meningkat tajam` = increased sharply.",
          "VN-speaker trap: using `hasilnya` for negative consequences. `Akibatnya` better marks a consequence.",
          "Drill: `Akibatnya, biaya meningkat.`",
        ],
      },
      {
        en: "Penyebabnya bukan hanya kurangnya dana, tetapi juga lemahnya koordinasi.",
        vi: "Nguyên nhân không chỉ là thiếu ngân sách, mà còn là sự phối hợp yếu.",
        pronunciation_focus: [
          "pe-NYE-bab-nya BU-kan HA-nya KU-rang-nya DA-na, te-TA-pi JU-ga LE-mah-nya ko-or-di-NA-si - `penyebabnya` = nguyên nhân; `bukan hanya... tetapi juga...` = không chỉ... mà còn...",
          "Lỗi người Việt: dịch `nguyên nhân là vì` thành `penyebabnya karena`. Tránh trùng: dùng `penyebabnya adalah...` hoặc bỏ `karena`.",
          "Luyện: `Penyebabnya bukan hanya A, tetapi juga B.`",
        ],
        pronunciation_focus_en: [
          "pe-NYE-bab-nya BOO-kan HA-nya KOO-rang-nya DA-na, te-TA-pi JOO-ga LE-mah-nya ko-or-di-NA-si - `penyebabnya` = the cause; `bukan hanya... tetapi juga...` = not only... but also...",
          "VN-speaker trap: translating 'the cause is because' as `penyebabnya karena`. Avoid doubling; use `penyebabnya adalah...` or omit `karena`.",
          "Drill: `Penyebabnya bukan hanya A, tetapi juga B.`",
        ],
      },
      {
        en: "Dampaknya terasa langsung pada warga sekitar.",
        vi: "Tác động của nó được cảm nhận trực tiếp bởi cư dân xung quanh.",
        pronunciation_focus: [
          "DAM-pak-nya te-RA-sa LANG-sung PA-da WAR-ga se-KI-tar - `dampak` = tác động; `warga sekitar` = cư dân xung quanh.",
          "Lỗi người Việt: nhầm `dampak` với `akibat`. `Akibat` là hệ quả; `dampak` nhấn mạnh tác động/ảnh hưởng.",
          "Luyện: `Dampaknya terasa langsung.`",
        ],
        pronunciation_focus_en: [
          "DAM-pak-nya te-RA-sa LANG-soong PA-da WAR-ga se-KEE-tar - `dampak` = impact; `warga sekitar` = nearby residents.",
          "VN-speaker trap: mixing `dampak` and `akibat`. `Akibat` is consequence; `dampak` emphasizes impact/effect.",
          "Drill: `Dampaknya terasa langsung.`",
        ],
      },
      {
        en: "Masalah ini berhubungan dengan perubahan pola konsumsi.",
        vi: "Vấn đề này liên quan đến sự thay đổi mô hình tiêu dùng.",
        pronunciation_focus: [
          "MA-sa-lah I-ni ber-hu-BUNG-an de-NGAN pe-ru-BA-han PO-la kon-SUM-si - `berhubungan dengan` = liên quan đến; `pola konsumsi` = mô hình tiêu dùng.",
          "Lỗi người Việt: dùng `berhubungan ke`. Giới từ tự nhiên là `berhubungan dengan`.",
          "Luyện: `Ini berhubungan dengan...`",
        ],
        pronunciation_focus_en: [
          "MA-sa-lah I-ni ber-hoo-BOONG-an de-NGAN pe-roo-BA-han PO-la kon-SOOM-si - `berhubungan dengan` = related to; `pola konsumsi` = consumption pattern.",
          "VN-speaker trap: saying `berhubungan ke`. The natural preposition is `berhubungan dengan`.",
          "Drill: `Ini berhubungan dengan...`",
        ],
      },
      {
        en: "Alasan utamanya adalah kurangnya informasi yang mudah dipahami.",
        vi: "Lý do chính là thiếu thông tin dễ hiểu.",
        pronunciation_focus: [
          "a-LA-san u-TA-ma-nya A-da-lah KU-rang-nya in-for-MA-si yang MU-dah di-pa-HA-mi - `alasan utama` = lý do chính; `mudah dipahami` = dễ hiểu.",
          "Lỗi người Việt: `alasan` là lý do lập luận; `penyebab` nghiêng về nguyên nhân khách quan. Câu này dùng `alasan` vì đang giải thích.",
          "Luyện: `Alasan utamanya adalah...`",
        ],
        pronunciation_focus_en: [
          "a-LA-san oo-TA-ma-nya A-da-lah KOO-rang-nya in-for-MA-si yang MOO-dah di-pa-HA-mi - `alasan utama` = main reason; `mudah dipahami` = easy to understand.",
          "VN-speaker trap: `alasan` is a reason in explanation/argument; `penyebab` leans toward objective cause. This sentence uses `alasan` because it explains reasoning.",
          "Drill: `Alasan utamanya adalah...`",
        ],
      },
      {
        en: "Hal ini menyebabkan antrean menjadi lebih panjang.",
        vi: "Điều này khiến hàng chờ trở nên dài hơn.",
        pronunciation_focus: [
          "HAL I-ni me-nye-BAB-kan an-TRE-an men-JA-di LE-bih PAN-jang - `menyebabkan` = gây ra/khiến; `antrean` = hàng chờ.",
          "Lỗi người Việt: đặt `menyebabkan` sau kết quả theo trật tự Việt. Khung Indonesia: A `menyebabkan` B.",
          "Luyện: `Hal ini menyebabkan...`",
        ],
        pronunciation_focus_en: [
          "HAL I-ni me-nye-BAB-kan an-TRE-an men-JA-di LE-bih PAN-jang - `menyebabkan` = cause; `antrean` = queue.",
          "VN-speaker trap: placing `menyebabkan` after the result from Vietnamese word order. Indonesian frame: A `menyebabkan` B.",
          "Drill: `Hal ini menyebabkan...`",
        ],
      },
      {
        en: "Kenaikan harga dipicu oleh terbatasnya pasokan barang.",
        vi: "Việc tăng giá bị kích hoạt/gây ra bởi nguồn cung hàng hóa hạn chế.",
        pronunciation_focus: [
          "ke-NAI-kan HAR-ga di-PI-cu O-leh ter-BA-tas-nya pa-SO-kan BA-rang - `dipicu oleh` = bị kích hoạt bởi; `pasokan` = nguồn cung.",
          "Lỗi người Việt: dùng `dibuat oleh` cho nguyên nhân. Trong phân tích, `dipicu oleh` tự nhiên hơn cho yếu tố kích hoạt.",
          "Luyện: `Kenaikan harga dipicu oleh...`",
        ],
        pronunciation_focus_en: [
          "ke-NAI-kan HAR-ga di-PI-choo O-leh ter-BA-tas-nya pa-SO-kan BA-rang - `dipicu oleh` = triggered by; `pasokan` = supply.",
          "VN-speaker trap: using `dibuat oleh` for cause. In analysis, `dipicu oleh` is more natural for a trigger.",
          "Drill: `Kenaikan harga dipicu oleh...`",
        ],
      },
      {
        en: "Faktor lain yang memengaruhi situasi ini adalah kebijakan baru.",
        vi: "Yếu tố khác ảnh hưởng đến tình huống này là chính sách mới.",
        pronunciation_focus: [
          "FAK-tor LA-in yang me-me-NGA-ru-hi si-tu-A-si I-ni A-da-lah ke-BI-ja-kan BA-ru - `faktor lain` = yếu tố khác; `memengaruhi` = ảnh hưởng.",
          "Lỗi người Việt: viết `mempengaruhi`; dạng baku hiện nay là `memengaruhi`.",
          "Luyện: `Faktor lain yang memengaruhi...`",
        ],
        pronunciation_focus_en: [
          "FAK-tor LA-in yang me-me-NGA-roo-hi si-too-A-si I-ni A-da-lah ke-BI-ja-kan BA-roo - `faktor lain` = another factor; `memengaruhi` = influence.",
          "VN-speaker trap: writing `mempengaruhi`; the standard form now is `memengaruhi`.",
          "Drill: `Faktor lain yang memengaruhi...`",
        ],
      },
      {
        en: "Jika penyebab utamanya tidak ditangani, dampaknya akan terus berulang.",
        vi: "Nếu nguyên nhân chính không được xử lý, tác động/hậu quả sẽ tiếp tục lặp lại.",
        pronunciation_focus: [
          "JI-ka pe-NYE-bab u-TA-ma-nya ti-DAK di-ta-NGA-ni, DAM-pak-nya A-kan te-RUS be-RU-lang - `ditangani` = được xử lý; `berulang` = lặp lại.",
          "Lỗi người Việt: dùng `diurus` cho mọi xử lý. Trong phân tích vấn đề, `ditangani` chuẩn và chuyên nghiệp hơn.",
          "Luyện: `Penyebabnya harus ditangani.`",
        ],
        pronunciation_focus_en: [
          "JI-ka pe-NYE-bab oo-TA-ma-nya ti-DAK di-ta-NGA-ni, DAM-pak-nya A-kan te-ROOS be-ROO-lang - `ditangani` = handled/addressed; `berulang` = repeat.",
          "VN-speaker trap: using `diurus` for every kind of handling. In problem analysis, `ditangani` is more standard and professional.",
          "Drill: `Penyebabnya harus ditangani.`",
        ],
      },
      {
        en: "Dengan memahami hubungan sebab-akibat, kita bisa memilih solusi yang tepat.",
        vi: "Bằng cách hiểu mối quan hệ nhân quả, chúng ta có thể chọn giải pháp phù hợp.",
        pronunciation_focus: [
          "de-NGAN me-ma-HA-mi hu-BUNG-an se-BAB a-KI-bat, KI-ta BI-sa me-MI-lih so-LU-si yang te-PAT - `hubungan sebab-akibat` = quan hệ nhân quả; `solusi yang tepat` = giải pháp phù hợp.",
          "Lỗi người Việt: nói `hubungan alasan-hasil`. Cụm học thuật tự nhiên là `hubungan sebab-akibat`.",
          "Luyện: `Hubungan sebab-akibat.`",
        ],
        pronunciation_focus_en: [
          "de-NGAN me-ma-HA-mi hoo-BOONG-an se-BAB a-KEE-bat, KI-ta BI-sa me-MI-lih so-LOO-si yang te-PAT - `hubungan sebab-akibat` = cause-effect relationship; `solusi yang tepat` = appropriate solution.",
          "VN-speaker trap: saying `hubungan alasan-hasil`. The natural academic phrase is `hubungan sebab-akibat`.",
          "Drill: `Hubungan sebab-akibat.`",
        ],
      },
      {
        en: "Kesimpulannya, dampak tersebut muncul karena beberapa faktor saling berkaitan.",
        vi: "Kết luận là, tác động đó xuất hiện vì vài yếu tố liên quan lẫn nhau.",
        pronunciation_focus: [
          "ke-sim-PUL-an-nya, DAM-pak ter-se-BUT MUN-cul ka-RE-na be-be-RA-pa FAK-tor SA-ling ber-ka-I-tan - `kesimpulannya` = kết luận là; `saling berkaitan` = liên quan lẫn nhau.",
          "Lỗi người Việt: chỉ dùng một nguyên nhân cho vấn đề phức tạp. Câu này giúp phân tích đa nguyên nhân.",
          "Luyện: `Beberapa faktor saling berkaitan.`",
        ],
        pronunciation_focus_en: [
          "ke-sim-POOL-an-nya, DAM-pak ter-se-BOOT MOON-chool ka-RE-na be-be-RA-pa FAK-tor SA-ling ber-ka-I-tan - `kesimpulannya` = in conclusion; `saling berkaitan` = interrelated.",
          "VN-speaker trap: giving one cause for a complex issue. This sentence helps express multi-causal analysis.",
          "Drill: `Beberapa faktor saling berkaitan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong văn Indonesia học thuật, báo cáo công việc, hoặc thảo luận chính sách, người nói thường tách `penyebab` (nguyên nhân), `alasan` (lý do giải thích), `akibat` (hệ quả), và `dampak` (tác động). Các liên từ như `karena itu`, `akibatnya`, `oleh karena itu`, `jika... maka...`, và cụm `berhubungan dengan` giúp bài nói nghe mạch lạc hơn thay vì chỉ lặp `karena`.",
    cultural_notes_en:
      "In Indonesian academic writing, work reports, or policy discussion, speakers often separate `penyebab` (cause), `alasan` (reason/explanation), `akibat` (consequence), and `dampak` (impact). Connectors such as `karena itu`, `akibatnya`, `oleh karena itu`, `jika... maka...`, and `berhubungan dengan` make speech more coherent than repeating only `karena`.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng dịch mọi `vì/nên` thành `karena`. Hãy chọn theo vai trò câu: mở nguyên nhân dùng `penyebabnya`, mở hệ quả dùng `akibatnya`, nói tác động dùng `dampaknya`, giải thích lý do dùng `alasan utamanya`, và nối quan hệ dùng `berhubungan dengan`. Khi phân tích dài, dùng khung: nguyên nhân chính -> yếu tố phụ -> hệ quả trực tiếp -> tác động dài hạn -> giải pháp.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not translate every `vì/nên` as `karena`. Choose by sentence role: open a cause with `penyebabnya`, a consequence with `akibatnya`, an impact with `dampaknya`, an explanation with `alasan utamanya`, and a relationship with `berhubungan dengan`. For longer analysis, use the frame: main cause -> secondary factor -> direct consequence -> long-term impact -> solution.",
    vocabulary: [
      { word: "karena itu", en: "for that reason", vi: "vì vậy", pos: "connector", pronunciation_vi: "ka-RE-na I-tu", pronunciation_en: "ka-RE-na I-too" },
      { word: "akibatnya", en: "as a result", vi: "hậu quả là/kết quả là", pos: "connector", pronunciation_vi: "a-KI-bat-nya", pronunciation_en: "a-KEE-bat-nya" },
      { word: "penyebabnya", en: "the cause", vi: "nguyên nhân", pos: "noun", pronunciation_vi: "pe-NYE-bab-nya", pronunciation_en: "pe-NYE-bab-nya" },
      { word: "dampaknya", en: "the impact", vi: "tác động", pos: "noun", pronunciation_vi: "DAM-pak-nya", pronunciation_en: "DAM-pak-nya" },
      { word: "berhubungan dengan", en: "related to", vi: "liên quan đến", pos: "verb phrase", pronunciation_vi: "ber-hu-BUNG-an de-NGAN", pronunciation_en: "ber-hoo-BOONG-an de-NGAN" },
      { word: "menjelaskan alasan", en: "to explain the reason", vi: "giải thích lý do", pos: "verb phrase", pronunciation_vi: "men-JE-las-kan a-LA-san", pronunciation_en: "men-JE-las-kan a-LA-san" },
      { word: "analisis sebab-akibat", en: "cause-effect analysis", vi: "phân tích nhân quả", pos: "noun phrase", pronunciation_vi: "a-na-LI-sis se-BAB a-KI-bat", pronunciation_en: "a-na-LI-sis se-BAB a-KEE-bat" },
      { word: "saling berkaitan", en: "interrelated", vi: "liên quan lẫn nhau", pos: "phrase", pronunciation_vi: "SA-ling ber-ka-I-tan", pronunciation_en: "SA-ling ber-ka-I-tan" },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Mengapa antrean di loket semakin panjang?",
        vi: "Vì sao hàng chờ ở quầy ngày càng dài?",
        en: "Why is the queue at the counter getting longer?",
      },
      {
        speaker: "Fajar",
        text: "Penyebabnya bukan hanya jumlah petugas, tetapi juga sistem pendaftaran yang lambat.",
        vi: "Nguyên nhân không chỉ là số lượng nhân viên, mà còn là hệ thống đăng ký chậm.",
        en: "The cause is not only the number of staff, but also the slow registration system.",
      },
      {
        speaker: "Rina",
        text: "Akibatnya, warga harus menunggu lebih lama.",
        vi: "Hậu quả là người dân phải chờ lâu hơn.",
        en: "As a result, residents have to wait longer.",
      },
      {
        speaker: "Fajar",
        text: "Dampaknya juga terasa pada kepuasan layanan.",
        vi: "Tác động của nó cũng được cảm nhận ở mức độ hài lòng với dịch vụ.",
        en: "The impact is also felt in service satisfaction.",
      },
      {
        speaker: "Rina",
        text: "Karena itu, solusinya harus menangani penyebab utama dulu.",
        vi: "Vì vậy, giải pháp phải xử lý nguyên nhân chính trước.",
        en: "For that reason, the solution must address the main cause first.",
      },
    ],
    exercises: [
      {
        type: "connector_choice",
        instruction_vi: "Chọn liên từ/cụm phù hợp để nối nguyên nhân và kết quả.",
        instruction_en: "Choose the suitable connector/phrase to link cause and effect.",
        items: [
          { prompt: "Harga naik. ___, daya beli turun.", answer: "Akibatnya" },
          { prompt: "Masalah ini ___ perubahan pola konsumsi.", answer: "berhubungan dengan" },
          { prompt: "___ bukan hanya kurangnya dana, tetapi juga lemahnya koordinasi.", answer: "Penyebabnya" },
          { prompt: "___, kita perlu mencari solusi yang seimbang.", answer: "Karena itu" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Viết lại câu đơn giản thành câu phân tích tự nhiên hơn.",
        instruction_en: "Rewrite the simple sentence into more natural analytical Indonesian.",
        items: [
          {
            prompt: "Ini karena uang kurang.",
            answer: "Penyebabnya adalah kurangnya dana.",
          },
          {
            prompt: "Jadi antrean panjang.",
            answer: "Akibatnya, antrean menjadi lebih panjang.",
          },
          {
            prompt: "Ini ada hubungan sama kebijakan baru.",
            answer: "Masalah ini berhubungan dengan kebijakan baru.",
          },
        ],
      },
    ],
  },
];

export default lessons;
