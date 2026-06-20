// Family Business Negotiation Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_family_business_negotiation",
    level: "B1",
    category: "business",
    title_vi: "Thương lượng trong kinh doanh gia đình",
    title_en: "Negotiating in a family business",
    sentences: [
      {
        en: "Kita perlu membagi tugas dengan lebih jelas.",
        vi: "Chúng ta cần chia nhiệm vụ rõ ràng hơn.",
        pronunciation_focus: [
          "KI-ta per-LU mem-BA-gi TU-gas de-NGAN le-BIH JE-las — `membagi tugas` = chia nhiệm vụ.",
          "Lưu ý người Việt: dùng `bagi kerja` nghe thô và không tự nhiên. `Pembagian tugas` là cụm trung tính, chuyên nghiệp hơn.",
          "Luyện: `Kita perlu membagi tugas.`",
        ],
        pronunciation_focus_en: [
          "KEE-tah per-LOO mem-BAH-gee TOO-gahs deh-NGAN leh-BEE JEH-las — `membagi tugas` = divide tasks.",
          "VN-speaker trap: `bagi kerja` sounds rough and unnatural. `Pembagian tugas` is more neutral and professional.",
          "Drill: `Kita perlu membagi tugas.`",
        ],
      },
      {
        en: "Siapa yang pegang modal bersama bulan ini?",
        vi: "Ai là người giữ vốn chung trong tháng này?",
        pronunciation_focus: [
          "SI-a-pa yang pe-GANG MO-dal ber-SA-ma bu-LAN i-NI — `pegang modal` = giữ/quản lý vốn.",
          "`modal bersama` = vốn chung; rất hợp khi nhiều thành viên cùng góp tiền làm usaha.",
          "Lỗi người Việt: nói `siapa pegang uang` quá chung. Trong usaha, `modal` rõ nghĩa hơn `uang`.",
          "Luyện: `Siapa yang pegang modal?`",
        ],
        pronunciation_focus_en: [
          "SEE-ah-pah yang pe-GANG MO-dahl ber-SAH-ma boo-LAN ee-NEE — `pegang modal` = hold/manage the capital.",
          "`modal bersama` = shared capital; fits when several family members contribute to the business.",
          "VN-speaker trap: `siapa pegang uang` is too vague. In business, `modal` is clearer than `uang`.",
          "Drill: `Siapa yang pegang modal?`",
        ],
      },
      {
        en: "Keuntungan usaha harus dibagi adil.",
        vi: "Lợi nhuận của việc kinh doanh phải được chia công bằng.",
        pronunciation_focus: [
          "ke-un-TUNG-an u-SA-ha HA-rus di-BA-gi A-dil — `keuntungan` = lợi nhuận.",
          "`dibagi adil` = được chia công bằng; bị động `di-` rất tự nhiên trong nói về uang dan hasil usaha.",
          "Lỗi người Việt: dùng `laba` mọi lúc. `Keuntungan` là từ rất an toàn và umum.",
          "Luyện: `Keuntungan harus dibagi adil.`",
        ],
        pronunciation_focus_en: [
          "keh-oon-TOONG-an oo-SAH-hah HA-roos dee-BAH-gee AH-dil — `keuntungan` = profit.",
          "`dibagi adil` = divided fairly; passive `di-` is very natural when talking about money and business results.",
          "VN-speaker trap: overusing `laba`. `Keuntungan` is a safe and common word.",
          "Drill: `Keuntungan harus dibagi adil.`",
        ],
      },
      {
        en: "Saya setuju, tapi kita perlu musyawarah dulu.",
        vi: "Tôi đồng ý, nhưng chúng ta cần bàn bạc trước đã.",
        pronunciation_focus: [
          "sa-YA se-TU-ju, TA-pi KI-ta per-LU mu-sya-WA-rah DU-lu — `musyawarah` = bàn bạc để cùng đồng thuận.",
          "Mẹo: trong keluarga Indonesia, `musyawarah` là cách nói rất đẹp khi muốn tránh tranh cãi trực diện.",
          "Lỗi người Việt: dùng `diskusi` mọi nơi. `Musyawarah` nghe đúng văn hóa gia đình và cộng đồng hơn.",
          "Luyện: `Kita perlu musyawarah dulu.`",
        ],
        pronunciation_focus_en: [
          "sah-YAH seh-TOO-joo, TAH-pee KEE-tah moo-syah-WAH-rah DOO-loo — `musyawarah` = deliberation/consensus discussion.",
          "Tip: in Indonesian families, `musyawarah` is a beautiful way to avoid direct confrontation.",
          "VN-speaker trap: using `diskusi` everywhere. `Musyawarah` fits family/community culture better.",
          "Drill: `Kita perlu musyawarah dulu.`",
        ],
      },
      {
        en: "Kalau ada konflik kecil, sebaiknya dibicarakan baik-baik.",
        vi: "Nếu có mâu thuẫn nhỏ, tốt nhất là nên nói chuyện đàng hoàng.",
        pronunciation_focus: [
          "KA-lau A-da kon-FLIK KE-cil, se-baiK-nya di-bi-CA-ra-kan BAIK-baik — `konflik kecil` = mâu thuẫn nhỏ.",
          "`dibicarakan baik-baik` = được nói chuyện đàng hoàng, êm đẹp; rất hợp với keluarga.",
          "Lỗi người Việt: nói `berantem kecil` quá mạnh. `Konflik kecil` là mức độ mềm hơn.",
          "Luyện: `Dibicarakan baik-baik.`",
        ],
        pronunciation_focus_en: [
          "KAH-loh AH-dah kon-FLEEK KE-chil, seh-BYKE-nya dee-bee-CHA-rah-kan BYKE-BYKE — `konflik kecil` = small conflict.",
          "`dibicarakan baik-baik` = discussed calmly/properly; very suitable for family settings.",
          "VN-speaker trap: `berantem kecil` is too strong. `Konflik kecil` is softer.",
          "Drill: `Dibicarakan baik-baik.`",
        ],
      },
      {
        en: "Saya bisa ambil bagian dapur dan belanja bahan.",
        vi: "Tôi có thể phụ phần bếp và đi mua nguyên liệu.",
        pronunciation_focus: [
          "SA-ya BI-sa am-BIL BA-gi-an DA-pur dan be-LAN-ja BA-han — `ambil bagian` = nhận phần việc.",
          "`belanja bahan` = mua nguyên liệu; kata `bahan` sangat umum untuk usaha makanan.",
          "Lỗi người Việt: nói `ambil job` hoặc `share kerja` lẫn tiếng Anh. `Ambil bagian` đủ tự nhiên.",
          "Luyện: `Saya ambil bagian dapur.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah BEE-sah ahm-BEEL BAH-gee-an DAH-poor dan beh-LAN-jah BAH-han — `ambil bagian` = take on a part/task.",
          "`belanja bahan` = buy ingredients; `bahan` is very common in food business talk.",
          "VN-speaker trap: `ambil job` or `share kerja` mixes in too much English. `Ambil bagian` is natural.",
          "Drill: `Saya ambil bagian dapur.`",
        ],
      },
      {
        en: "Bagian penjualan bisa diurus oleh kakak saya.",
        vi: "Phần bán hàng có thể do anh/chị tôi phụ trách.",
        pronunciation_focus: [
          "ba-GI-an pen-jua-LAN BI-sa di-u-RUS o-leh KA-kak SA-ya — `penjualan` = bộ phận bán hàng/việc bán.",
          "`diurus oleh` = được phụ trách bởi; cách nói rất phù hợp khi membagi tugas keluarga.",
          "Lỗi người Việt: dùng `dipegang oleh` mọi lúc. `Diurus oleh` nghe mềm và chuyên nghiệp hơn.",
          "Luyện: `Bagian penjualan diurus oleh kakak saya.`",
        ],
        pronunciation_focus_en: [
          "bah-GEE-an pen-joo-AH-lan BEE-sah dee-OO-roos OH-leh KAH-kak SAH-yah — `penjualan` = sales/sales section.",
          "`diurus oleh` = handled by; fits well when dividing family tasks.",
          "VN-speaker trap: using `dipegang oleh` for everything. `Diurus oleh` sounds softer and more professional.",
          "Drill: `Bagian penjualan diurus oleh kakak saya.`",
        ],
      },
      {
        en: "Modal awal kita belum cukup, jadi kita harus cari solusi.",
        vi: "Vốn ban đầu của chúng ta vẫn chưa đủ, nên phải tìm giải pháp.",
        pronunciation_focus: [
          "MO-dal A-wal KI-ta be-LUM CU-kup, JA-di KI-ta HA-rus CA-ri so-LU-si — `modal awal` = vốn ban đầu.",
          "`cukup` = đủ; `belum cukup` là cách nói rất tự nhiên saat dana masih kurang.",
          "Lỗi người Việt: nói `modal pertama` theo thói quen. Cụm chuẩn dalam usaha adalah `modal awal`.",
          "Luyện: `Modal awal belum cukup.`",
        ],
        pronunciation_focus_en: [
          "MOH-dahl AH-wahl KEE-tah beh-lum CHOO-koop, JAH-dee KEE-tah HA-roos CHAH-ree soh-LOO-see — `modal awal` = startup capital.",
          "`cukup` = enough; `belum cukup` is natural when the funds are still short.",
          "VN-speaker trap: `modal pertama` by habit. The standard business phrase is `modal awal`.",
          "Drill: `Modal awal belum cukup.`",
        ],
      },
      {
        en: "Saya menghargai kerja keras semua orang di rumah.",
        vi: "Tôi trân trọng sự chăm chỉ của mọi người trong nhà.",
        pronunciation_focus: [
          "meNG-har-GAI ker-ja KER-as se-MUA o-RANG di RU-mah — `menghargai` = trân trọng/đánh giá cao.",
          "`kerja keras` = làm việc chăm chỉ; câu này giúp menenangkan suasana sebelum negosiasi lanjut.",
          "Lỗi người Việt: bỏ qua lời công nhận và đi thẳng vào yêu cầu. `Menghargai` làm câu mềm hơn.",
          "Luyện: `Saya menghargai kerja keras semua orang.`",
        ],
        pronunciation_focus_en: [
          "me-nghar-GAI KER-jah KER-as seh-MOO-ah OH-rang dee ROO-mah — `menghargai` = appreciate/value.",
          "`kerja keras` = hard work; this line helps calm the mood before continuing the negotiation.",
          "VN-speaker trap: skipping appreciation and jumping straight to demands. `Menghargai` softens the tone.",
          "Drill: `Saya menghargai kerja keras semua orang.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Dalam usaha keluarga di Indonesia, keputusan thường không chỉ dựa vào satu orang. Banyak keluarga memilih musyawarah trước khi quyết định modal, pembagian tugas, atau arah usaha. Lời nói yang menjaga hubungan sangat penting: người ta thích nghe `kita cari jalan tengah`, `dibicarakan baik-baik`, dan `saya menghargai kerja keras Anda` daripada lời quá trực diện.",
    cultural_notes_en:
      "In Indonesian family businesses, decisions are often not made by just one person. Many families prefer musyawarah before deciding on capital, task division, or business direction. Relationship-preserving language matters: people prefer hearing `kita cari jalan tengah`, `dibicarakan baik-baik`, and `saya menghargai kerja keras Anda` instead of blunt wording.",
    tip_advice_vi:
      "Khung cần nhớ: `membagi tugas`, `modal bersama`, `keuntungan dibagi adil`, `musyawarah dulu`, `konflik kecil`, `jalan tengah`. Khi nói chuyện gia đình, bắt đầu bằng sự công nhận rồi mới nêu yêu cầu sẽ dễ được đồng ý hơn.",
    tip_advice_en:
      "Useful frames: `membagi tugas`, `modal bersama`, `keuntungan dibagi adil`, `musyawarah dulu`, `konflik kecil`, `jalan tengah`. In family discussions, start with appreciation before making requests, and you are more likely to get agreement.",
    vocabulary: [
      {
        word: "usaha keluarga",
        en: "family business",
        vi: "kinh doanh gia đình",
        pos: "noun phrase",
        pronunciation_vi: "u-SA-ha ke-LU-ar-ga",
        pronunciation_en: "oo-SAH-hah keh-LOO-ar-gah",
      },
      {
        word: "pembagian tugas",
        en: "task division",
        vi: "phân chia nhiệm vụ",
        pos: "noun phrase",
        pronunciation_vi: "pem-BA-gi-an TU-gas",
        pronunciation_en: "pem-BAH-gee-an TOO-gahs",
      },
      {
        word: "modal bersama",
        en: "shared capital",
        vi: "vốn chung",
        pos: "noun phrase",
        pronunciation_vi: "MO-dal ber-SA-ma",
        pronunciation_en: "MOH-dahl ber-SAH-mah",
      },
      {
        word: "keuntungan",
        en: "profit",
        vi: "lợi nhuận",
        pos: "noun",
        pronunciation_vi: "ke-un-TUNG-an",
        pronunciation_en: "keh-oon-TOONG-an",
      },
      {
        word: "musyawarah",
        en: "consensus discussion",
        vi: "bàn bạc, thảo luận để đồng thuận",
        pos: "noun",
        pronunciation_vi: "mu-sya-WA-rah",
        pronunciation_en: "moo-syah-WAH-rah",
      },
      {
        word: "konflik kecil",
        en: "small conflict",
        vi: "mâu thuẫn nhỏ",
        pos: "noun phrase",
        pronunciation_vi: "kon-FLIK KE-cil",
        pronunciation_en: "kon-FLEEK KE-chil",
      },
      {
        word: "jalan tengah",
        en: "middle ground / compromise",
        vi: "giải pháp trung dung / thỏa hiệp",
        pos: "noun phrase",
        pronunciation_vi: "JA-lan TEN-gah",
        pronunciation_en: "JAH-lan TEN-gah",
      },
      {
        word: "keputusan keluarga",
        en: "family decision",
        vi: "quyết định của gia đình",
        pos: "noun phrase",
        pronunciation_vi: "ke-pu-TUS-an ke-LU-ar-ga",
        pronunciation_en: "keh-poo-TOO-san keh-LOO-ar-gah",
      },
    ],
    dialogue: [
      {
        speaker: "Ibu",
        text: "Kita perlu musyawarah dulu soal usaha keluarga ini.",
        vi: "Chúng ta cần bàn bạc trước về việc kinh doanh gia đình này.",
        en: "We need to discuss this family business first.",
      },
      {
        speaker: "Anak",
        text: "Setuju. Saya mau membagi tugas dengan lebih jelas.",
        vi: "Đồng ý. Tôi muốn chia nhiệm vụ rõ ràng hơn.",
        en: "Agreed. I want to divide the tasks more clearly.",
      },
      {
        speaker: "Ayah",
        text: "Bagus. Siapa yang pegang modal bersama bulan ini?",
        vi: "Tốt. Ai là người giữ vốn chung trong tháng này?",
        en: "Good. Who is handling the shared capital this month?",
      },
      {
        speaker: "Ibu",
        text: "Keuntungan usaha harus dibagi adil supaya tidak ada konflik kecil.",
        vi: "Lợi nhuận của việc kinh doanh phải được chia công bằng để không có mâu thuẫn nhỏ.",
        en: "The business profit must be divided fairly so there are no small conflicts.",
      },
      {
        speaker: "Anak",
        text: "Kalau begitu, saya ambil bagian penjualan dan kakak urus pembelian bahan.",
        vi: "Vậy thì tôi phụ phần bán hàng và anh/chị lo việc mua nguyên liệu.",
        en: "In that case, I’ll take sales and my older sibling will handle ingredient purchases.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Kita perlu ___ dulu soal usaha keluarga ini.`",
        prompt_en: "Fill in: `Kita perlu ___ dulu soal usaha keluarga ini.`",
        answer: "musyawarah",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Chúng ta cần chia nhiệm vụ rõ ràng hơn.",
        prompt_en: "Translate to Indonesian: We need to divide the tasks more clearly.",
        answer: "Kita perlu membagi tugas dengan lebih jelas.",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Lợi nhuận phải được chia công bằng.",
        prompt_en: "Translate to Indonesian: The profit must be divided fairly.",
        answer: "Keuntungan usaha harus dibagi adil.",
      },
      {
        type: "choose_best_phrase",
        prompt_vi: "Chọn cụm tự nhiên nhất cho 'giải pháp trung dung'.",
        prompt_en: "Choose the most natural phrase for 'middle ground / compromise'.",
        options: ["jalan tengah", "jalan lurus", "jalan cepat"],
        answer: "jalan tengah",
      },
      {
        type: "roleplay",
        prompt_vi: "Đóng vai: bạn muốn đề nghị bàn bạc lại cách chia nhiệm vụ trong kinh doanh gia đình.",
        prompt_en: "Roleplay: you want to suggest discussing the task division in a family business again.",
        answer: "Kita perlu musyawarah dulu. Saya rasa pembagian tugasnya bisa dibuat lebih jelas.",
      },
    ],
  },
];
