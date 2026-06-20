// Advanced Problem-Solution Essay Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// essay-structure notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_advanced_problem_solution_essay",
    level: "B2",
    category: "academic_writing",
    title_vi: "Viết bài luận vấn đề - giải pháp nâng cao",
    title_en: "Advanced problem-solution essay",
    sentences: [
      {
        en: "Esai masalah-solusi biasanya dimulai dengan latar belakang yang jelas.",
        vi: "Bài luận vấn đề - giải pháp thường bắt đầu bằng phần bối cảnh rõ ràng.",
        pronunciation_focus: [
          "e-SAI MA-sa-lah so-LU-si bi-A-sa-nya di-MU-lai de-NGAN LA-tar be-la-KANG yang JE-las - `esai masalah-solusi` = bài luận vấn đề - giải pháp; `latar belakang` = bối cảnh.",
          "Lỗi người Việt: mở bài bằng kết luận ngay. Trong esai Indonesia, `latar belakang` giúp người đọc hiểu vì sao vấn đề quan trọng.",
          "Luyện: `Dimulai dengan latar belakang yang jelas.`",
        ],
        pronunciation_focus_en: [
          "e-SAI MA-sa-lah so-LOO-si bi-A-sa-nya di-MOO-lai de-NGAN LA-tar be-la-KANG yang JE-las - `esai masalah-solusi` = problem-solution essay; `latar belakang` = background.",
          "VN-speaker trap: opening with the conclusion immediately. In Indonesian essays, `latar belakang` helps readers understand why the issue matters.",
          "Drill: `Dimulai dengan latar belakang yang jelas.`",
        ],
      },
      {
        en: "Masalah utama perlu dijelaskan secara spesifik, bukan terlalu umum.",
        vi: "Vấn đề chính cần được giải thích một cách cụ thể, không quá chung chung.",
        pronunciation_focus: [
          "MA-sa-lah u-TA-ma per-LU di-JE-las-kan se-CA-ra spe-SI-fik, BU-kan ter-LA-lu U-mum - `masalah utama` = vấn đề chính; `secara spesifik` = một cách cụ thể.",
          "Lỗi người Việt: viết `masalahnya banyak`. Esai tốt cần một masalah utama rõ trước khi phân tích.",
          "Luyện: `Jelaskan masalah utama secara spesifik.`",
        ],
        pronunciation_focus_en: [
          "MA-sa-lah oo-TA-ma per-LOO di-JE-las-kan se-CHA-ra spe-SEE-fik, BOO-kan ter-LA-loo OO-moom - `masalah utama` = main problem; `secara spesifik` = specifically.",
          "VN-speaker trap: writing `masalahnya banyak`. A good essay needs one clear main problem before analysis.",
          "Drill: `Jelaskan masalah utama secara spesifik.`",
        ],
      },
      {
        en: "Penyebab pertama adalah kurangnya koordinasi antara pihak terkait.",
        vi: "Nguyên nhân đầu tiên là thiếu sự phối hợp giữa các bên liên quan.",
        pronunciation_focus: [
          "pe-NYE-bab per-TA-ma A-da-lah KU-rang-nya ko-or-di-NA-si an-TA-ra PI-hak ter-KAIT - `penyebab pertama` = nguyên nhân đầu tiên; `pihak terkait` = các bên liên quan.",
          "Lỗi người Việt: dùng `karena pertama` để mở đoạn. Tự nhiên hơn: `Penyebab pertama adalah...`.",
          "Luyện: `Penyebab pertama adalah...`",
        ],
        pronunciation_focus_en: [
          "pe-NYE-bab per-TA-ma A-da-lah KOO-rang-nya ko-or-di-NA-si an-TA-ra PI-hak ter-KAIT - `penyebab pertama` = first cause; `pihak terkait` = related parties/stakeholders.",
          "VN-speaker trap: opening a paragraph with `karena pertama`. More natural: `Penyebab pertama adalah...`.",
          "Drill: `Penyebab pertama adalah...`",
        ],
      },
      {
        en: "Selain itu, rendahnya kesadaran masyarakat memperburuk keadaan.",
        vi: "Ngoài ra, mức độ nhận thức thấp của người dân làm tình hình xấu hơn.",
        pronunciation_focus: [
          "se-LAIN I-tu, REN-dah-nya ke-sa-DAR-an ma-sya-ra-KAT mem-per-BU-ruk ke-A-da-an - `selain itu` = ngoài ra; `kesadaran masyarakat` = nhận thức của người dân.",
          "Lỗi người Việt: nối mọi ý bằng `dan`. `Selain itu` mở nguyên nhân phụ hoặc ý bổ sung rõ hơn.",
          "Luyện: `Selain itu, kesadaran masih rendah.`",
        ],
        pronunciation_focus_en: [
          "se-LAIN I-too, REN-dah-nya ke-sa-DAR-an ma-sya-ra-KAT mem-per-BOO-rook ke-A-da-an - `selain itu` = in addition; `kesadaran masyarakat` = public awareness.",
          "VN-speaker trap: linking every point with `dan`. `Selain itu` marks a secondary cause or added point more clearly.",
          "Drill: `Selain itu, kesadaran masih rendah.`",
        ],
      },
      {
        en: "Dampaknya tidak hanya terasa pada individu, tetapi juga pada lingkungan sosial.",
        vi: "Tác động không chỉ được cảm nhận ở cá nhân, mà còn ở môi trường xã hội.",
        pronunciation_focus: [
          "DAM-pak-nya ti-DAK HA-nya te-RA-sa PA-da in-di-VI-du, te-TA-pi JU-ga PA-da ling-KUNG-an so-SI-al - `dampaknya` = tác động; `tidak hanya... tetapi juga...` = không chỉ... mà còn...",
          "Lỗi người Việt: chỉ nói tác động một chiều. Cấu trúc này giúp mở rộng phân tích ảnh hưởng.",
          "Luyện: `Tidak hanya pada individu, tetapi juga...`",
        ],
        pronunciation_focus_en: [
          "DAM-pak-nya ti-DAK HA-nya te-RA-sa PA-da in-di-VI-du, te-TA-pi JOO-ga PA-da ling-KOONG-an so-SEE-al - `dampaknya` = the impact; `tidak hanya... tetapi juga...` = not only... but also...",
          "VN-speaker trap: describing only one-sided impact. This frame broadens impact analysis.",
          "Drill: `Tidak hanya pada individu, tetapi juga...`",
        ],
      },
      {
        en: "Solusi utama yang dapat ditawarkan adalah memperbaiki sistem pengawasan.",
        vi: "Giải pháp chính có thể được đề xuất là cải thiện hệ thống giám sát.",
        pronunciation_focus: [
          "so-LU-si u-TA-ma yang DA-pat di-TA-war-kan A-da-lah mem-per-BAI-ki SIS-tem pe-nga-WAS-an - `solusi utama` = giải pháp chính; `ditawarkan` = được đề xuất.",
          "Lỗi người Việt: nói `solusinya adalah membuat bagus`. Cụm học thuật hơn: `memperbaiki sistem...`.",
          "Luyện: `Solusi utama yang dapat ditawarkan adalah...`",
        ],
        pronunciation_focus_en: [
          "so-LOO-si oo-TA-ma yang DA-pat di-TA-war-kan A-da-lah mem-per-BAI-ki SIS-tem pe-nga-WAS-an - `solusi utama` = main solution; `ditawarkan` = offered/proposed.",
          "VN-speaker trap: writing vague `solusinya adalah membuat bagus`. More academic: `memperbaiki sistem...`.",
          "Drill: `Solusi utama yang dapat ditawarkan adalah...`",
        ],
      },
      {
        en: "Solusi tersebut harus disertai langkah pelaksanaan yang realistis.",
        vi: "Giải pháp đó phải đi kèm các bước thực hiện thực tế.",
        pronunciation_focus: [
          "so-LU-si ter-se-BUT HA-rus di-ser-TA-i LANG-kah pe-lak-sa-NA-an yang re-a-LIS-tis - `disertai` = đi kèm; `langkah pelaksanaan` = bước thực hiện.",
          "Lỗi người Việt: đưa giải pháp nhưng không nói cách làm. Esai masalah-solusi cần langkah pelaksanaan.",
          "Luyện: `Disertai langkah yang realistis.`",
        ],
        pronunciation_focus_en: [
          "so-LOO-si ter-se-BOOT HA-roos di-ser-TA-i LANG-kah pe-lak-sa-NA-an yang re-a-LIS-tis - `disertai` = accompanied by; `langkah pelaksanaan` = implementation steps.",
          "VN-speaker trap: giving a solution without saying how to do it. A problem-solution essay needs implementation steps.",
          "Drill: `Disertai langkah yang realistis.`",
        ],
      },
      {
        en: "Namun, kelemahan solusi ini adalah biaya awal yang cukup besar.",
        vi: "Tuy nhiên, điểm yếu của giải pháp này là chi phí ban đầu khá lớn.",
        pronunciation_focus: [
          "NA-mun, ke-le-MAH-an so-LU-si I-ni A-da-lah BI-a-ya A-wal yang CU-kup BE-sar - `kelemahan solusi` = điểm yếu của giải pháp; `biaya awal` = chi phí ban đầu.",
          "Lỗi người Việt: chỉ khen giải pháp. Bài nâng cao nên nêu kelemahan solusi để lập luận cân bằng.",
          "Luyện: `Kelemahan solusi ini adalah...`",
        ],
        pronunciation_focus_en: [
          "NA-mun, ke-le-MAH-an so-LOO-si I-ni A-da-lah BEE-a-ya A-wal yang CHOO-kup BE-sar - `kelemahan solusi` = weakness of the solution; `biaya awal` = initial cost.",
          "VN-speaker trap: only praising the solution. Advanced essays should name solution weaknesses for balanced argument.",
          "Drill: `Kelemahan solusi ini adalah...`",
        ],
      },
      {
        en: "Meskipun demikian, manfaat jangka panjangnya lebih besar daripada risikonya.",
        vi: "Mặc dù vậy, lợi ích dài hạn của nó lớn hơn rủi ro.",
        pronunciation_focus: [
          "mes-ki-PUN de-mi-KI-an, man-FA-at JANG-ka PAN-jang-nya LE-bih BE-sar da-ri-PA-da RI-si-ko-nya - `meskipun demikian` = mặc dù vậy; `jangka panjang` = dài hạn.",
          "Lỗi người Việt: thêm `tetapi` sau `meskipun demikian`. Tiếng Indonesia không cần gấp đôi mặc dù-nhưng.",
          "Luyện: `Meskipun demikian, manfaatnya besar.`",
        ],
        pronunciation_focus_en: [
          "mes-kee-POON de-mi-KEE-an, man-FA-at JANG-ka PAN-jang-nya LE-bih BE-sar da-ri-PA-da RI-si-ko-nya - `meskipun demikian` = nevertheless; `jangka panjang` = long term.",
          "VN-speaker trap: adding `tetapi` after `meskipun demikian`. Indonesian does not double although-but.",
          "Drill: `Meskipun demikian, manfaatnya besar.`",
        ],
      },
      {
        en: "Untuk mengurangi kelemahan tersebut, pemerintah dapat bekerja sama dengan komunitas lokal.",
        vi: "Để giảm điểm yếu đó, chính phủ có thể hợp tác với cộng đồng địa phương.",
        pronunciation_focus: [
          "UN-tuk me-ngu-RA-ngi ke-le-MAH-an ter-se-BUT, pe-me-RIN-tah DA-pat be-KER-ja SA-ma de-NGAN ko-mu-ni-TAS LO-kal - `mengurangi kelemahan` = giảm điểm yếu; `komunitas lokal` = cộng đồng địa phương.",
          "Lỗi người Việt: bỏ qua cách giảm nhược điểm. Sau khi nêu kelemahan, nên thêm mitigasi/giảm thiểu.",
          "Luyện: `Untuk mengurangi kelemahan tersebut...`",
        ],
        pronunciation_focus_en: [
          "UN-tuk me-ngu-RA-ngi ke-le-MAH-an ter-se-BOOT, pe-me-RIN-tah DA-pat be-KER-ja SA-ma de-NGAN ko-moo-ni-TAS LO-kal - `mengurangi kelemahan` = reduce the weakness; `komunitas lokal` = local community.",
          "VN-speaker trap: ignoring how to reduce a weakness. After naming a weakness, add mitigation.",
          "Drill: `Untuk mengurangi kelemahan tersebut...`",
        ],
      },
      {
        en: "Kesimpulannya, solusi yang efektif harus menangani penyebab dan dampak sekaligus.",
        vi: "Kết luận là, một giải pháp hiệu quả phải xử lý cả nguyên nhân và tác động cùng lúc.",
        pronunciation_focus: [
          "ke-sim-PUL-an-nya, so-LU-si yang e-FEK-tif HA-rus me-na-NGA-ni pe-NYE-bab dan DAM-pak se-ka-LI-gus - `sekaligus` = đồng thời/cùng lúc.",
          "Lỗi người Việt: kết luận chỉ lặp lại đề bài. Câu này tổng hợp tiêu chí của giải pháp tốt.",
          "Luyện: `Menangani penyebab dan dampak sekaligus.`",
        ],
        pronunciation_focus_en: [
          "ke-sim-POOL-an-nya, so-LOO-si yang e-FEK-tif HA-roos me-na-NGA-ni pe-NYE-bab dan DAM-pak se-ka-LEE-goos - `sekaligus` = at the same time.",
          "VN-speaker trap: conclusion only repeats the prompt. This sentence synthesizes what a good solution must do.",
          "Drill: `Menangani penyebab dan dampak sekaligus.`",
        ],
      },
      {
        en: "Dengan struktur yang jelas, esai akan terasa lebih logis dan meyakinkan.",
        vi: "Với cấu trúc rõ ràng, bài luận sẽ có cảm giác logic và thuyết phục hơn.",
        pronunciation_focus: [
          "de-NGAN struk-TUR yang JE-las, e-SAI A-kan te-RA-sa LE-bih LO-gis dan me-ya-KIN-kan - `struktur yang jelas` = cấu trúc rõ ràng; `meyakinkan` = thuyết phục.",
          "Lỗi người Việt: viết ý đúng nhưng thiếu liên kết. `Struktur yang jelas` giúp lập luận dễ theo dõi.",
          "Luyện: `Lebih logis dan meyakinkan.`",
        ],
        pronunciation_focus_en: [
          "de-NGAN struk-TOOR yang JE-las, e-SAI A-kan te-RA-sa LE-bih LO-gis dan me-ya-KIN-kan - `struktur yang jelas` = clear structure; `meyakinkan` = convincing.",
          "VN-speaker trap: having correct ideas but weak links. `Struktur yang jelas` makes the argument easier to follow.",
          "Drill: `Lebih logis dan meyakinkan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong văn Indonesia học thuật, esai masalah-solusi thường cần mạch rõ: latar belakang, masalah utama, penyebab, dampak, solusi utama, kelemahan solusi, cara mengurangi kelemahan, và kesimpulan. Người đọc đánh giá cao lập luận cân bằng: không chỉ đưa solusi, mà còn chỉ ra kelemahan dan cara mengatasinya. Các liên từ như `selain itu`, `namun`, `meskipun demikian`, và `kesimpulannya` giúp bài viết mạch lạc.",
    cultural_notes_en:
      "In Indonesian academic writing, a problem-solution essay usually needs a clear flow: background, main problem, causes, impacts, main solution, weakness of the solution, how to reduce the weakness, and conclusion. Readers value balanced argument: not only proposing a solution, but also naming its weakness and how to address it. Connectors like `selain itu`, `namun`, `meskipun demikian`, and `kesimpulannya` make the essay coherent.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng biến bài masalah-solusi thành danh sách ý rời rạc. Dùng khung 6 câu: `Masalah utama...`, `Penyebab pertama...`, `Dampaknya...`, `Solusi utama...`, `Namun, kelemahan solusi...`, `Kesimpulannya...`. Khi nêu giải pháp, luôn thêm langkah pelaksanaan và một câu về kelemahan agar bài viết có chiều sâu.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not turn a problem-solution essay into a loose list. Use a six-sentence frame: `Masalah utama...`, `Penyebab pertama...`, `Dampaknya...`, `Solusi utama...`, `Namun, kelemahan solusi...`, `Kesimpulannya...`. When proposing a solution, always add implementation steps and one sentence about its weakness so the essay has depth.",
    vocabulary: [
      { word: "esai masalah-solusi", en: "problem-solution essay", vi: "bài luận vấn đề - giải pháp", pos: "noun phrase", pronunciation_vi: "e-SAI MA-sa-lah so-LU-si", pronunciation_en: "e-SAI MA-sa-lah so-LOO-si" },
      { word: "latar belakang", en: "background", vi: "bối cảnh", pos: "noun phrase", pronunciation_vi: "LA-tar be-la-KANG", pronunciation_en: "LA-tar be-la-KANG" },
      { word: "penyebab", en: "cause", vi: "nguyên nhân", pos: "noun", pronunciation_vi: "pe-NYE-bab", pronunciation_en: "pe-NYE-bab" },
      { word: "dampak", en: "impact", vi: "tác động", pos: "noun", pronunciation_vi: "DAM-pak", pronunciation_en: "DAM-pak" },
      { word: "solusi utama", en: "main solution", vi: "giải pháp chính", pos: "noun phrase", pronunciation_vi: "so-LU-si u-TA-ma", pronunciation_en: "so-LOO-si oo-TA-ma" },
      { word: "kelemahan solusi", en: "weakness of the solution", vi: "điểm yếu của giải pháp", pos: "noun phrase", pronunciation_vi: "ke-le-MAH-an so-LU-si", pronunciation_en: "ke-le-MAH-an so-LOO-si" },
      { word: "kesimpulan", en: "conclusion", vi: "kết luận", pos: "noun", pronunciation_vi: "ke-sim-PUL-an", pronunciation_en: "ke-sim-POOL-an" },
      { word: "langkah pelaksanaan", en: "implementation steps", vi: "các bước thực hiện", pos: "noun phrase", pronunciation_vi: "LANG-kah pe-lak-sa-NA-an", pronunciation_en: "LANG-kah pe-lak-sa-NA-an" },
    ],
    dialogue: [
      {
        speaker: "Dosen",
        text: "Bagaimana struktur esai masalah-solusi yang kamu tulis?",
        vi: "Cấu trúc bài luận vấn đề - giải pháp em viết như thế nào?",
        en: "What is the structure of the problem-solution essay you wrote?",
      },
      {
        speaker: "Mahasiswa",
        text: "Saya mulai dengan latar belakang, lalu menjelaskan masalah utama dan penyebabnya.",
        vi: "Em bắt đầu bằng bối cảnh, rồi giải thích vấn đề chính và nguyên nhân của nó.",
        en: "I start with the background, then explain the main problem and its causes.",
      },
      {
        speaker: "Dosen",
        text: "Bagus. Jangan lupa membahas dampak dan kelemahan solusi.",
        vi: "Tốt. Đừng quên bàn về tác động và điểm yếu của giải pháp.",
        en: "Good. Do not forget to discuss the impact and the weakness of the solution.",
      },
      {
        speaker: "Mahasiswa",
        text: "Baik, saya akan menambahkan langkah pelaksanaan yang lebih realistis.",
        vi: "Vâng, em sẽ thêm các bước thực hiện thực tế hơn.",
        en: "All right, I will add more realistic implementation steps.",
      },
      {
        speaker: "Dosen",
        text: "Dengan begitu, kesimpulanmu akan terasa lebih logis dan meyakinkan.",
        vi: "Như vậy, kết luận của em sẽ có cảm giác logic và thuyết phục hơn.",
        en: "That way, your conclusion will feel more logical and convincing.",
      },
    ],
    exercises: [
      {
        type: "essay_structure",
        instruction_vi: "Sắp xếp cấu trúc esai masalah-solusi theo thứ tự hợp lý.",
        instruction_en: "Arrange the problem-solution essay structure in a logical order.",
        items: [
          { prompt: "1", answer: "latar belakang" },
          { prompt: "2", answer: "masalah utama" },
          { prompt: "3", answer: "penyebab dan dampak" },
          { prompt: "4", answer: "solusi utama" },
          { prompt: "5", answer: "kelemahan solusi dan cara menguranginya" },
          { prompt: "6", answer: "kesimpulan" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Viết lại câu đơn giản thành văn học thuật tự nhiên hơn.",
        instruction_en: "Rewrite the simple sentence into more natural academic Indonesian.",
        items: [
          {
            prompt: "Masalahnya banyak.",
            answer: "Masalah utama perlu dijelaskan secara spesifik.",
          },
          {
            prompt: "Solusinya bikin sistem bagus.",
            answer: "Solusi utama yang dapat ditawarkan adalah memperbaiki sistem pengawasan.",
          },
          {
            prompt: "Tapi solusinya mahal.",
            answer: "Namun, kelemahan solusi ini adalah biaya awal yang cukup besar.",
          },
        ],
      },
    ],
  },
];

export default lessons;
