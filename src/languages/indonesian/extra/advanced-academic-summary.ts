// Advanced Academic Summary Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// academic-summary notes with English companions in pronunciation_focus_en.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
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
    id: "indonesian_advanced_academic_summary",
    level: "B2",
    category: "academic_communication",
    title_vi: "Tóm tắt học thuật nâng cao",
    title_en: "Advanced academic summary",
    sentences: [
      {
        en: "Artikel ini membahas perubahan pola belajar mahasiswa.",
        vi: "Bài viết này bàn về sự thay đổi trong mô hình học tập của sinh viên.",
        pronunciation_focus: [
          "ar-TI-kel I-ni mem-BA-has pe-ru-BA-han PO-la be-LA-jar ma-ha-SIS-wa - `artikel ini membahas` = bài viết này bàn về; `pola belajar` = mô hình học tập.",
          "Lỗi người Việt: dùng `berbicara tentang` trong văn học thuật. `Membahas` gọn và trang trọng hơn.",
          "Luyện: `Artikel ini membahas...`",
        ],
        pronunciation_focus_en: [
          "ar-TEE-kel I-ni mem-BA-has pe-roo-BA-han PO-la be-LA-jar ma-ha-SIS-wa - `artikel ini membahas` = this article discusses; `pola belajar` = learning pattern.",
          "VN-speaker trap: using `berbicara tentang` in academic writing. `Membahas` is tighter and more formal.",
          "Drill: `Artikel ini membahas...`",
        ],
      },
      {
        en: "Gagasan utama penulis adalah bahwa teknologi dapat memperluas akses pendidikan.",
        vi: "Ý chính của tác giả là công nghệ có thể mở rộng khả năng tiếp cận giáo dục.",
        pronunciation_focus: [
          "ga-GAS-an u-TA-ma pe-NU-lis A-da-lah ba-HWA tek-no-LO-gi DA-pat mem-per-LU-as AK-ses pen-di-DIK-an - `gagasan utama` = ý chính; `penulis` = tác giả.",
          "Lỗi người Việt: dịch `main idea` thành tiếng Anh. Cụm Indonesia học thuật là `gagasan utama`.",
          "Luyện: `Gagasan utama penulis adalah...`",
        ],
        pronunciation_focus_en: [
          "ga-GAS-an oo-TA-ma pe-NOO-lis A-da-lah ba-HWA tek-no-LO-gi DA-pat mem-per-LOO-as AK-ses pen-di-DIK-an - `gagasan utama` = main idea; `penulis` = author.",
          "VN-speaker trap: importing English `main idea`. Academic Indonesian uses `gagasan utama`.",
          "Drill: `Gagasan utama penulis adalah...`",
        ],
      },
      {
        en: "Argumen penulis didukung oleh data survei dan wawancara.",
        vi: "Lập luận của tác giả được hỗ trợ bởi dữ liệu khảo sát và phỏng vấn.",
        pronunciation_focus: [
          "ar-gu-MEN pe-NU-lis di-du-KUNG O-leh DA-ta sur-VEI dan wa-WAN-ca-ra - `argumen penulis` = lập luận của tác giả; `didukung oleh` = được hỗ trợ bởi.",
          "Lỗi người Việt: nói `argumen dari penulis` được hiểu, nhưng `argumen penulis` tự nhiên hơn.",
          "Luyện: `Argumen penulis didukung oleh data.`",
        ],
        pronunciation_focus_en: [
          "ar-goo-MEN pe-NOO-lis di-doo-KOONG O-leh DA-ta sur-VEI dan wa-WAN-cha-ra - `argumen penulis` = author's argument; `didukung oleh` = supported by.",
          "VN-speaker trap: `argumen dari penulis` is understood, but `argumen penulis` is more natural.",
          "Drill: `Argumen penulis didukung oleh data.`",
        ],
      },
      {
        en: "Bukti yang digunakan cukup kuat, tetapi ruang lingkupnya terbatas.",
        vi: "Bằng chứng được sử dụng khá mạnh, nhưng phạm vi của nó còn hạn chế.",
        pronunciation_focus: [
          "BUK-ti yang di-GU-na-kan CU-kup KU-at, te-TA-pi RU-ang LING-kup-nya ter-BA-tas - `bukti` = bằng chứng; `ruang lingkup` = phạm vi.",
          "Lỗi người Việt: dùng `bukti kuat` tốt, nhưng cần nêu giới hạn bằng `ruang lingkupnya terbatas`.",
          "Luyện: `Buktinya kuat, tetapi terbatas.`",
        ],
        pronunciation_focus_en: [
          "BOOK-ti yang di-GOO-na-kan CHOO-kup KOO-at, te-TA-pi ROO-ang LING-kup-nya ter-BA-tas - `bukti` = evidence; `ruang lingkup` = scope.",
          "VN-speaker trap: `bukti kuat` is fine, but academic summary often also names the limitation: `ruang lingkupnya terbatas`.",
          "Drill: `Buktinya kuat, tetapi terbatas.`",
        ],
      },
      {
        en: "Kesimpulan artikel ini menekankan pentingnya akses yang merata.",
        vi: "Kết luận của bài viết này nhấn mạnh tầm quan trọng của khả năng tiếp cận công bằng.",
        pronunciation_focus: [
          "ke-sim-PUL-an ar-TI-kel I-ni me-ne-KAN-kan pen-TING-nya AK-ses yang me-RA-ta - `kesimpulan` = kết luận; `menekankan` = nhấn mạnh; `merata` = đồng đều/công bằng.",
          "Lỗi người Việt: dùng `penting dari` theo tiếng Việt. Cụm đúng là `pentingnya + danh từ`.",
          "Luyện: `Menekankan pentingnya akses.`",
        ],
        pronunciation_focus_en: [
          "ke-sim-POOL-an ar-TEE-kel I-ni me-ne-KAN-kan pen-TING-nya AK-ses yang me-RA-ta - `kesimpulan` = conclusion; `menekankan` = emphasize; `merata` = evenly distributed/equitable.",
          "VN-speaker trap: saying `penting dari` from Vietnamese. Correct pattern: `pentingnya + noun`.",
          "Drill: `Menekankan pentingnya akses.`",
        ],
      },
      {
        en: "Dalam parafrasa, kita menulis ulang gagasan tanpa menyalin kalimat asli.",
        vi: "Trong diễn giải/paraphrase, chúng ta viết lại ý tưởng mà không sao chép câu gốc.",
        pronunciation_focus: [
          "da-LAM pa-ra-FRA-sa, KI-ta me-NU-lis U-lang ga-GAS-an TAN-pa me-NYA-lin KA-li-mat AS-li - `parafrasa` = diễn giải; `kalimat asli` = câu gốc.",
          "Lỗi người Việt: đổi vài từ rồi gọi là parafrasa. Parafrasa cần viết lại cấu trúc và vẫn giữ ý.",
          "Luyện: `Menulis ulang gagasan.`",
        ],
        pronunciation_focus_en: [
          "da-LAM pa-ra-FRA-sa, KI-ta me-NOO-lis OO-lang ga-GAS-an TAN-pa me-NYA-lin KA-li-mat AS-li - `parafrasa` = paraphrase; `kalimat asli` = original sentence.",
          "VN-speaker trap: changing a few words and calling it paraphrase. A paraphrase rewrites structure while keeping meaning.",
          "Drill: `Menulis ulang gagasan.`",
        ],
      },
      {
        en: "Kutipan langsung sebaiknya digunakan hanya jika kata-katanya penting.",
        vi: "Trích dẫn trực tiếp tốt nhất chỉ nên dùng khi chính từ ngữ đó quan trọng.",
        pronunciation_focus: [
          "ku-TIP-an LANG-sung se-BAIK-nya di-GU-na-kan HA-nya JI-ka KA-ta-KA-ta-nya pen-TING - `kutipan langsung` = trích dẫn trực tiếp.",
          "Lỗi người Việt: lạm dụng kutipan để làm tóm tắt. Tóm tắt tốt thường dùng parafrasa và chỉ trích dẫn khi cần.",
          "Luyện: `Gunakan kutipan langsung jika perlu.`",
        ],
        pronunciation_focus_en: [
          "koo-TIP-an LANG-soong se-BAIK-nya di-GOO-na-kan HA-nya JI-ka KA-ta-KA-ta-nya pen-TING - `kutipan langsung` = direct quotation.",
          "VN-speaker trap: overusing quotations to make a summary. A good summary usually paraphrases and quotes only when needed.",
          "Drill: `Gunakan kutipan langsung jika perlu.`",
        ],
      },
      {
        en: "Ringkasan yang baik harus singkat, jelas, dan tidak menambah opini pribadi.",
        vi: "Một bản tóm tắt tốt phải ngắn gọn, rõ ràng, và không thêm ý kiến cá nhân.",
        pronunciation_focus: [
          "ring-KAS-an yang BAIK HA-rus SING-kat, JE-las, dan ti-DAK me-NAM-bah o-PI-ni pri-BA-di - `ringkasan` = bản tóm tắt; `opini pribadi` = ý kiến cá nhân.",
          "Lỗi người Việt: biến tóm tắt thành bình luận. `Ringkasan` ưu tiên ý tác giả, không thêm phán xét cá nhân.",
          "Luyện: `Ringkasan harus singkat dan jelas.`",
        ],
        pronunciation_focus_en: [
          "ring-KAS-an yang BAIK HA-roos SING-kat, JE-las, dan ti-DAK me-NAM-bah o-PEE-ni pri-BA-di - `ringkasan` = summary; `opini pribadi` = personal opinion.",
          "VN-speaker trap: turning a summary into commentary. `Ringkasan` prioritizes the author's ideas without adding personal judgment.",
          "Drill: `Ringkasan harus singkat dan jelas.`",
        ],
      },
      {
        en: "Analisis singkat dapat menjelaskan kekuatan dan kelemahan argumen.",
        vi: "Phân tích ngắn có thể giải thích điểm mạnh và điểm yếu của lập luận.",
        pronunciation_focus: [
          "a-na-LI-sis SING-kat DA-pat men-JE-las-kan ke-KU-at-an dan ke-le-MAH-an ar-gu-MEN - `analisis singkat` = phân tích ngắn; `kekuatan dan kelemahan` = điểm mạnh và điểm yếu.",
          "Lỗi người Việt: dùng `kelebihan/kekurangan` được, nhưng trong phân tích argumen `kekuatan/kelemahan` trang trọng hơn.",
          "Luyện: `Kekuatan dan kelemahan argumen.`",
        ],
        pronunciation_focus_en: [
          "a-na-LEE-sis SING-kat DA-pat men-JE-las-kan ke-KOO-at-an dan ke-le-MAH-an ar-goo-MEN - `analisis singkat` = brief analysis; `kekuatan dan kelemahan` = strengths and weaknesses.",
          "VN-speaker trap: `kelebihan/kekurangan` works, but for argument analysis `kekuatan/kelemahan` is more formal.",
          "Drill: `Kekuatan dan kelemahan argumen.`",
        ],
      },
      {
        en: "Penulis berpendapat bahwa kebijakan tersebut perlu dikaji ulang.",
        vi: "Tác giả cho rằng chính sách đó cần được xem xét lại.",
        pronunciation_focus: [
          "pe-NU-lis ber-pen-DA-pat ba-HWA ke-BI-ja-kan ter-se-BUT per-LU di-KA-ji U-lang - `berpendapat bahwa` = cho rằng; `dikaji ulang` = được xem xét lại.",
          "Lỗi người Việt: viết `penulis bilang`. Trong tóm tắt học thuật, dùng `penulis berpendapat bahwa...`.",
          "Luyện: `Penulis berpendapat bahwa...`",
        ],
        pronunciation_focus_en: [
          "pe-NOO-lis ber-pen-DA-pat ba-HWA ke-BI-ja-kan ter-se-BOOT per-LOO di-KA-ji OO-lang - `berpendapat bahwa` = argues/states that; `dikaji ulang` = reviewed.",
          "VN-speaker trap: writing casual `penulis bilang`. In academic summary, use `penulis berpendapat bahwa...`.",
          "Drill: `Penulis berpendapat bahwa...`",
        ],
      },
      {
        en: "Secara keseluruhan, artikel ini memberikan gambaran yang cukup seimbang.",
        vi: "Nhìn chung, bài viết này đưa ra một bức tranh khá cân bằng.",
        pronunciation_focus: [
          "se-CA-ra ke-se-lu-RUH-an, ar-TI-kel I-ni mem-BE-ri-kan gam-BA-ran yang CU-kup se-IM-bang - `secara keseluruhan` = nhìn chung; `gambaran` = bức tranh/tổng quan.",
          "Lỗi người Việt: kết thúc bằng `totalnya`. Trong văn học thuật, `secara keseluruhan` tự nhiên hơn.",
          "Luyện: `Secara keseluruhan, artikel ini...`",
        ],
        pronunciation_focus_en: [
          "se-CHA-ra ke-se-loo-ROOH-an, ar-TEE-kel I-ni mem-BE-ri-kan gam-BA-ran yang CHOO-kup se-IM-bang - `secara keseluruhan` = overall; `gambaran` = overview/picture.",
          "VN-speaker trap: ending with `totalnya`. In academic writing, `secara keseluruhan` is more natural.",
          "Drill: `Secara keseluruhan, artikel ini...`",
        ],
      },
      {
        en: "Namun, ringkasan ini belum membahas keterbatasan penelitian secara mendalam.",
        vi: "Tuy nhiên, bản tóm tắt này chưa bàn sâu về giới hạn của nghiên cứu.",
        pronunciation_focus: [
          "NA-mun, ring-KAS-an I-ni be-LUM mem-BA-has ke-ter-ba-TAS-an pe-ne-li-TI-an se-CA-ra men-DA-lam - `keterbatasan penelitian` = giới hạn nghiên cứu; `secara mendalam` = một cách sâu.",
          "Lỗi người Việt: đặt `namun` như `tapi` giữa câu tùy ý. Trong văn viết, `Namun,` thường mở câu mới.",
          "Luyện: `Namun, ada keterbatasan.`",
        ],
        pronunciation_focus_en: [
          "NA-mun, ring-KAS-an I-ni be-LOOM mem-BA-has ke-ter-ba-TAS-an pe-ne-li-TEE-an se-CHA-ra men-DA-lam - `keterbatasan penelitian` = research limitations; `secara mendalam` = in depth.",
          "VN-speaker trap: placing `namun` casually like `tapi`. In writing, `Namun,` often starts a new sentence.",
          "Drill: `Namun, ada keterbatasan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong tiếng Indonesia học thuật, `ringkasan` khác với `analisis`. Ringkasan trình bày lại gagasan utama, argumen penulis, bukti, dan kesimpulan một cách ngắn gọn, thường không thêm opini pribadi. Analisis singkat có thể đánh giá kekuatan, kelemahan, ruang lingkup, và keterbatasan. Khi dùng kutipan langsung, cần giữ ngắn và chỉ dùng khi câu gốc thật sự quan trọng.",
    cultural_notes_en:
      "In academic Indonesian, `ringkasan` is different from `analisis`. A summary restates the main idea, author's argument, evidence, and conclusion concisely, usually without adding personal opinion. A brief analysis may evaluate strengths, weaknesses, scope, and limitations. Direct quotations should be short and used only when the original wording matters.",
    tip_advice_vi:
      "Mẹo cho người Việt: viết tóm tắt theo khung 5 câu: artikel ini membahas...; gagasan utama penulis adalah...; argumen didukung oleh...; kesimpulannya...; secara keseluruhan.... Nếu thêm đánh giá, báo hiệu bằng `analisis singkat` hoặc `namun`. Tránh chép câu gốc quá nhiều; dùng `parafrasa` và chỉ dùng `kutipan langsung` khi cần.",
    tip_advice_en:
      "Tip for Vietnamese speakers: write summaries with a five-sentence frame: artikel ini membahas...; gagasan utama penulis adalah...; argumen didukung oleh...; kesimpulannya...; secara keseluruhan.... If you add evaluation, signal it with `analisis singkat` or `namun`. Avoid copying too much original wording; use `parafrasa` and only use `kutipan langsung` when needed.",
    vocabulary: [
      { cell_id: "19606e84-3556-483e-a95f-c2abc119eef3", word: "merangkum artikel", en: "to summarize an article", vi: "tóm tắt bài viết", pos: "verb phrase", pronunciation_vi: "me-RANG-kum ar-TI-kel", pronunciation_en: "me-RANG-koom ar-TEE-kel" },
      { cell_id: "d194ae67-6352-4dea-a6d5-da5a170b8edb", word: "gagasan utama", en: "main idea", vi: "ý chính", pos: "noun phrase", pronunciation_vi: "ga-GAS-an u-TA-ma", pronunciation_en: "ga-GAS-an oo-TA-ma" },
      { cell_id: "d9a15c30-c4ea-456c-9535-8d806494c5aa", word: "argumen penulis", en: "author's argument", vi: "lập luận của tác giả", pos: "noun phrase", pronunciation_vi: "ar-gu-MEN pe-NU-lis", pronunciation_en: "ar-goo-MEN pe-NOO-lis" },
      { cell_id: "642dcb4a-f7e7-4dbf-af4e-463ba65d11b0", word: "bukti", en: "evidence", vi: "bằng chứng", pos: "noun", pronunciation_vi: "BUK-ti", pronunciation_en: "BOOK-ti" },
      { cell_id: "620835e1-4ae6-43fa-a4d6-ec254c885167", word: "kesimpulan", en: "conclusion", vi: "kết luận", pos: "noun", pronunciation_vi: "ke-sim-PUL-an", pronunciation_en: "ke-sim-POOL-an" },
      { cell_id: "24903fde-1bd5-4877-b227-10c1c7a184c3", word: "parafrasa", en: "paraphrase", vi: "diễn giải/paraphrase", pos: "noun", pronunciation_vi: "pa-ra-FRA-sa", pronunciation_en: "pa-ra-FRA-sa" },
      { cell_id: "0a59433b-6944-4006-82cd-b2852e95caae", word: "kutipan", en: "quotation", vi: "trích dẫn", pos: "noun", pronunciation_vi: "ku-TIP-an", pronunciation_en: "koo-TIP-an" },
      { cell_id: "7955e933-12a1-40f5-9deb-f2587309ebcb", word: "analisis singkat", en: "brief analysis", vi: "phân tích ngắn", pos: "noun phrase", pronunciation_vi: "a-na-LI-sis SING-kat", pronunciation_en: "a-na-LEE-sis SING-kat" },
    ],
    dialogue: [
      {
        cell_id: "c607ba43-f319-4775-8ff4-f29d7d3172d7",
        speaker: "Dosen",
        text: "Apa gagasan utama artikel yang kamu baca?",
        vi: "Ý chính của bài viết em đọc là gì?",
        en: "What is the main idea of the article you read?",
      },
      {
        cell_id: "cb732fd1-7171-49ec-9c5e-3ad5b6f39851",
        speaker: "Mahasiswa",
        text: "Artikel ini membahas perubahan pola belajar mahasiswa.",
        vi: "Bài viết này bàn về sự thay đổi trong mô hình học tập của sinh viên.",
        en: "This article discusses changes in students' learning patterns.",
      },
      {
        cell_id: "d8629523-3845-4125-9dd4-f9af9fd5c66f",
        speaker: "Dosen",
        text: "Bagaimana argumen penulis didukung?",
        vi: "Lập luận của tác giả được hỗ trợ như thế nào?",
        en: "How is the author's argument supported?",
      },
      {
        cell_id: "a4cfc8ca-ce91-4bcc-a12c-209d38aac3b8",
        speaker: "Mahasiswa",
        text: "Argumen penulis didukung oleh data survei dan beberapa kutipan wawancara.",
        vi: "Lập luận của tác giả được hỗ trợ bởi dữ liệu khảo sát và vài trích dẫn phỏng vấn.",
        en: "The author's argument is supported by survey data and several interview quotations.",
      },
      {
        cell_id: "aeb5360d-3e1c-415f-82e6-5da38116ee27",
        speaker: "Dosen",
        text: "Baik. Jangan lupa bedakan ringkasan dan analisis singkat.",
        vi: "Tốt. Đừng quên phân biệt tóm tắt và phân tích ngắn.",
        en: "Good. Do not forget to distinguish summary and brief analysis.",
      },
    ],
    exercises: [
      {
        type: "summary_frame",
        instruction_vi: "Hoàn thành khung tóm tắt học thuật.",
        instruction_en: "Complete the academic summary frame.",
        items: [
          { prompt: "Artikel ini ___ perubahan pola belajar.", answer: "membahas" },
          { prompt: "Gagasan ___ penulis adalah akses pendidikan.", answer: "utama" },
          { prompt: "Argumen penulis didukung oleh ___ survei.", answer: "data" },
          { prompt: "Secara ___, artikel ini cukup seimbang.", answer: "keseluruhan" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Viết lại câu đời thường thành văn học thuật tự nhiên hơn.",
        instruction_en: "Rewrite the casual sentence into more natural academic Indonesian.",
        items: [
          {
            prompt: "Penulis bilang teknologi itu penting.",
            answer: "Penulis berpendapat bahwa teknologi itu penting.",
          },
          {
            prompt: "Artikel ini ngomongin mahasiswa.",
            answer: "Artikel ini membahas mahasiswa.",
          },
          {
            prompt: "Buktinya oke tapi tidak luas.",
            answer: "Bukti yang digunakan cukup kuat, tetapi ruang lingkupnya terbatas.",
          },
        ],
      },
    ],
  },
];

export default lessons;
