// Indonesian (Bahasa Indonesia) C1 lessons — Vietnamese-first (L1 = Vietnamese),
// English companion fields.
//
// Variety: Standard Indonesian (Bahasa Indonesia baku), the formal register used
// in academic writing, professional presentations, and national media. Where the
// colloquial Jakarta variety (bahasa gaul) differs, it is flagged explicitly so a
// C1 learner controls the register switch rather than blurring it.
//
// Self-contained on purpose: the Indonesian language folder ships a sibling
// `./lessons.ts` registry, but the structural types are declared inline here so
// this module compiles on its own and mirrors the Portuguese C1 template field
// for field (src/languages/portuguese/lessons-c1.ts). A future consolidation can
// lift these type definitions out unchanged.
//
// Scope (C1): academic register, professional presentations, literary language,
// regional-language (Javanese/Sundanese) awareness, advanced affixation
// (memper-, -i, ke-…-an), and essay writing. Every lesson assumes the learner
// can already hold a B2 conversation and now needs the rhetorical and
// morphological machinery — nominalization, hedging, register control, the
// dense affix system — that distinguishes a fluent speaker from an advanced one.
//
// Vietnamese L1 notes throughout: Indonesian is phonetically regular (Latin
// script, near-one-to-one spelling), has no tones, no grammatical gender, no
// verb conjugation, and no articles — all genuinely EASIER for a Vietnamese
// speaker than European languages. The real C1 challenge is the affix system
// and register, which is where these notes concentrate.

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianCategoryId =
  | "fluency"
  | "workplace"
  | "public_communication"
  | "advanced_grammar"
  | "society"
  | "expressions";

export type LessonSentence = {
  en: string;
  vi: string;
  // VN-speaker pronunciation aid: syllable break + STRESSED syllable in CAPS.
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type Exercise = Record<string, unknown>;

export type IdiomGloss = {
  idiom: string;
  literal: string;
  literal_en?: string;
  meaning: string;
  meaning_en?: string;
  example: string;
  example_en?: string;
};

export type IndonesianLesson = {
  id: string;
  category: IndonesianCategoryId;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
  dialogue_long?: DialogueLine[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_en?: string;
  idiom_glosses?: IdiomGloss[];
};

export const lessons: IndonesianLesson[] = [
  // ── 1. Academic Indonesian: presenting a thesis / research hypothesis ──
  {
    id: "akademik_hipotesis_penelitian",
    level: "C1",
    category: "fluency",
    title_vi: "Trình bày luận đề và giả thuyết nghiên cứu (học thuật)",
    title_en: "Presenting a thesis and research hypothesis (academic Indonesian)",
    sentences: [
      {
        en: "The central hypothesis underlying this study posits that the independent variable significantly influences the observed phenomenon.",
        vi: "Giả thuyết trung tâm làm nền cho nghiên cứu này đặt giả định rằng biến độc lập có tác động đáng kể đến hiện tượng được quan sát.",
        pronunciation_focus: [
          "hipotesis → hi-po-TÉ-sis (nhấn áp chót TÉ; mọi âm tiết rõ, không nuốt)",
          "mendasari → men-da-SA-ri (tiền tố meN- + dasar + -i; nhấn SA)",
          "variabel → va-ri-A-bel (4 âm tiết, nhấn A; -bel đọc 'bel')",
          "fenomena → fe-no-MÉ-na (nhấn MÉ; e đầu là e mở, không phải schwa)",
        ],
        pronunciation_focus_en: [
          "hipotesis → 'hee-po-TEH-sis' (penultimate stress; every syllable clear)",
          "mendasari → 'men-da-SA-ree' (prefix meN- + root dasar + suffix -i)",
          "variabel → 'va-ree-A-bel' (four syllables, stress on A)",
          "fenomena → 'feh-no-MEH-na' (open initial e, not a schwa; stress MEH)",
        ],
      },
      {
        en: "Our approach builds on earlier studies while diverging from them on one essential methodological point.",
        vi: "Cách tiếp cận của chúng tôi nối tiếp các nghiên cứu trước, đồng thời tách khỏi chúng ở một điểm phương pháp luận cốt yếu.",
        pronunciation_focus: [
          "pendekatan → pen-de-KA-tan (ke-…-an bao quanh 'dekat'; nhấn KA)",
          "menyimpang → me-nyim-PANG (meN- + simpang; 's' → 'ny'; nhấn PANG)",
          "metodologis → me-to-do-LO-gis (5 âm tiết; nhấn LO; 'gis' không phải 'jis')",
        ],
        pronunciation_focus_en: [
          "pendekatan → 'pen-de-KA-tan' (ke-…-an circumfix around 'dekat')",
          "menyimpang → 'me-nyim-PANG' (meN- + simpang; s assimilates to 'ny')",
          "metodologis → 'me-to-do-LO-gis' (five syllables; hard g, stress LO)",
        ],
      },
      {
        en: "It is precisely this gap in the literature that the present study intends to address.",
        vi: "Chính tại khoảng trống này trong tài liệu mà nghiên cứu hiện tại muốn lấp đầy.",
        pronunciation_focus: [
          "kesenjangan → ke-sen-JANG-an (ke-…-an quanh 'senjang'; nhấn JANG)",
          "kepustakaan → ke-pus-ta-KA-an (ke-…-an quanh 'pustaka'; nhấn KA)",
          "hendak → HEN-dak ('h' nhẹ nhưng phát âm; trang trọng hơn 'mau')",
        ],
        pronunciation_focus_en: [
          "kesenjangan → 'ke-sen-JANG-an' (ke-…-an around 'senjang' = gap)",
          "kepustakaan → 'ke-pus-ta-KA-an' (ke-…-an around 'pustaka' = literature)",
          "hendak → 'HEN-dak' (soft but voiced h; more formal than 'mau')",
        ],
      },
    ],
    vocabulary: [
      {
        cell_id: "1398015e-1a60-4659-a0f8-65b2a526bc2c",
        word: "hipotesis penelitian",
        en: "research hypothesis",
        vi: "giả thuyết nghiên cứu",
        pos: "n.",
        pronunciation_vi: "hi-po-TÉ-sis pe-ne-LI-ti-an",
        pronunciation_en: "hee-po-TEH-sis pe-ne-LEE-tee-an — root 'teliti' + peN-…-an",
      },
      {
        cell_id: "7c45b42e-1959-4e30-9a57-f39762e3ccc4",
        word: "berlandaskan",
        en: "to be grounded on / based upon",
        vi: "dựa trên (trang trọng)",
        pos: "v.",
        pronunciation_vi: "ber-lan-DAS-kan (ber- + landas + -kan)",
        pronunciation_en: "ber-lan-DAS-kan — ber- prefix + landas + -kan; formal 'based on'",
      },
      {
        cell_id: "23254d86-6d87-4652-bc3c-f6fb21736af0",
        word: "mengkaji",
        en: "to examine / study critically",
        vi: "khảo cứu, nghiên cứu sâu",
        pos: "v.",
        pronunciation_vi: "meng-KA-ji (meN- + kaji; 'k' giữ lại sau 'ng')",
        pronunciation_en: "meng-KA-jee — meN- + kaji; the k is retained after ng",
      },
      {
        cell_id: "25960618-a52f-46c7-aacf-1ea982c00413",
        word: "tinjauan pustaka",
        en: "literature review",
        vi: "tổng quan tài liệu",
        pos: "n.",
        pronunciation_vi: "tin-JAU-an pus-TA-ka",
        pronunciation_en: "tin-JOW-an poos-TA-ka — the obligatory opening section of a thesis",
      },
      {
        cell_id: "e636e3a1-b8d5-47ed-a80a-1d27240f75c6",
        word: "kerangka teoretis",
        en: "theoretical framework",
        vi: "khung lý thuyết",
        pos: "n.",
        pronunciation_vi: "ke-RANG-ka te-o-RÉ-tis",
        pronunciation_en: "ke-RANG-ka te-o-REH-tis — note spelling 'teoretis', not 'teoritis'",
      },
      {
        cell_id: "ec450840-dce7-4aad-a355-43564b0c47ae",
        word: "data tersebut menunjukkan",
        en: "the said data indicates",
        vi: "dữ liệu nói trên cho thấy",
        pos: "phrase",
        pronunciation_vi: "DA-ta ter-se-BUT me-nun-JUK-kan",
        pronunciation_en: "DA-ta ter-se-BOOT me-noon-JOOK-kan — 'tersebut' = the aforementioned",
      },
      {
        cell_id: "d288d8d9-30c1-4b77-8b21-d0dcc9a82473",
        word: "dengan demikian",
        en: "thus / accordingly",
        vi: "do đó, như vậy",
        pos: "conj.",
        pronunciation_vi: "DENG-an de-MI-ki-an",
        pronunciation_en: "DENG-an de-MEE-kee-an — academic connector, sentence-initial",
      },
      {
        cell_id: "80ae2dc7-1368-4a00-9edf-376cb61053fb",
        word: "perlu digarisbawahi",
        en: "it must be underlined",
        vi: "cần được nhấn mạnh",
        pos: "phrase",
        pronunciation_vi: "PER-lu di-ga-ris-ba-WA-hi",
        pronunciation_en: "PER-loo dee-ga-ris-ba-WA-hee — di- passive of 'garis bawah' (underline)",
      },
    ],
    dialogue: [
      {
        cell_id: "8652b1ad-f50f-49e7-8c06-c139b0d2418a",
        speaker: "Prof. Wibowo (pembimbing)",
        text: "Linh, bisakah Anda memaparkan hipotesis utama tesis Anda dalam beberapa menit?",
        vi: "Linh, em có thể trình bày giả thuyết chính của luận văn trong vài phút không?",
        en: "Linh, could you set out the main hypothesis of your thesis in a few minutes?",
      },
      {
        cell_id: "8c1420b6-9931-4a57-8083-9477d7bfe5df",
        speaker: "Linh",
        text: "Dengan senang hati, Prof. Hipotesis saya menyatakan bahwa terdapat hubungan kausal antara pemaparan dini terhadap bahasa kedua dan fleksibilitas metalinguistik pada usia dewasa.",
        vi: "Rất sẵn lòng, thưa thầy. Giả thuyết của em cho rằng có một mối quan hệ nhân quả giữa việc tiếp xúc sớm với ngôn ngữ thứ hai và sự linh hoạt siêu ngôn ngữ ở tuổi trưởng thành.",
        en: "Gladly, Professor. My hypothesis states that there is a causal relationship between early exposure to a second language and metalinguistic flexibility in adulthood.",
      },
      {
        cell_id: "59c93e27-f80f-4e72-aabe-bc797aa67c33",
        speaker: "Prof. Wibowo",
        text: "Korpus apa yang Anda gunakan untuk menopang intuisi tersebut?",
        vi: "Em dựa trên ngữ liệu nào để củng cố trực giác đó?",
        en: "What corpus are you drawing on to support that intuition?",
      },
      {
        cell_id: "c6f9b1ff-a83f-4008-88f9-64fb6dcdc2d2",
        speaker: "Linh",
        text: "Korpus delapan puluh wawancara semiterstruktur, dilengkapi serangkaian uji kognitif.",
        vi: "Một ngữ liệu gồm tám mươi cuộc phỏng vấn bán cấu trúc, bổ sung bằng một loạt bài kiểm tra nhận thức.",
        en: "A corpus of eighty semi-structured interviews, supplemented by a battery of cognitive tests.",
      },
    ],
    dialogue_long: [
      {
        speaker: "Prof. Wibowo (sidang tesis)",
        text: "Linh, dewan penguji mendengarkan. Anda punya lima belas menit — pemaparan, lalu tanya jawab.",
        vi: "Linh, hội đồng đang lắng nghe. Em có 15 phút — trình bày rồi hỏi đáp.",
        en: "Linh, the examining committee is listening. You have fifteen minutes — presentation, then questions.",
      },
      {
        speaker: "Linh",
        text: "Terima kasih. Penelitian saya berada dalam ranah sosiolinguistik kedwibahasaan, dan secara khusus mengkaji pengaruh usia pemerolehan bahasa kedua terhadap kemampuan metalinguistik orang dewasa.",
        vi: "Cảm ơn thầy. Nghiên cứu của em nằm trong lĩnh vực ngôn ngữ học xã hội về song ngữ, và cụ thể khảo sát ảnh hưởng của tuổi tiếp thu ngôn ngữ thứ hai lên năng lực siêu ngôn ngữ ở người trưởng thành.",
        en: "Thank you. My research sits within the sociolinguistics of bilingualism, and specifically examines the effect of age of second-language acquisition on adult metalinguistic ability.",
      },
      {
        speaker: "Linh",
        text: "Pustaka terdahulu — terutama karya Bialystok (2001), Cummins (1979), dan yang lebih mutakhir Costa dan Sebastián-Gallés (2014) — telah memantapkan adanya keunggulan kognitif pada dwibahasawan dini. Akan tetapi, satu hal masih relatif belum tergarap: sejauh mana keunggulan itu bertahan ketika bahasa kedua diperoleh di luar konteks persekolahan.",
        vi: "Tài liệu trước đó — đặc biệt các công trình của Bialystok (2001), Cummins (1979) và gần đây hơn của Costa và Sebastián-Gallés (2014) — đã xác lập vững chắc một lợi thế nhận thức ở người song ngữ sớm. Tuy vậy, có một điểm còn ít được khai thác: mức độ lợi thế đó còn duy trì khi ngôn ngữ thứ hai được tiếp thu ngoài môi trường học đường.",
        en: "Prior literature — notably the work of Bialystok (2001), Cummins (1979), and more recently Costa and Sebastián-Gallés (2014) — has firmly established a cognitive advantage in early bilinguals. However, one point remains relatively unexplored: the extent to which that advantage holds when the second language is acquired outside a schooling context.",
      },
      {
        speaker: "Linh",
        text: "Justru kesenjangan inilah yang hendak saya tangani. Hipotesis kerja saya adalah: keunggulan metalinguistik pada dwibahasawan dini, setidaknya sebagian, bersifat lepas dari kerangka pemerolehan formal.",
        vi: "Chính tại lỗ hổng này em muốn đặt vấn đề. Giả thuyết làm việc của em là: lợi thế siêu ngôn ngữ ở người song ngữ sớm, ít nhất một phần, độc lập với khung tiếp thu chính quy.",
        en: "It is precisely this gap that I intend to address. My working hypothesis is: the metalinguistic advantage in early bilinguals is, at least in part, independent of the formal acquisition framework.",
      },
      {
        speaker: "Dr. Anggraini (penguji)",
        text: "Izinkan saya mengajukan satu keberatan: bagaimana Anda mengendalikan variabel sosioekonomi, yang dapat mengacaukan efek yang Anda kaitkan dengan usia pemerolehan?",
        vi: "Cho phép tôi nêu một phản biện: em kiểm soát biến kinh tế-xã hội thế nào, vì nó có thể gây nhiễu cho hiệu ứng mà em quy cho tuổi tiếp thu?",
        en: "Allow me one objection: how do you control for the socioeconomic variable, which could confound the effect you attribute to age of acquisition?",
      },
      {
        speaker: "Linh",
        text: "Pertanyaan yang sangat relevan, Bu. Saya telah mengantisipasinya: kelompok dipadankan berdasarkan pendapatan keluarga dan tingkat pendidikan orang tua, sehingga variabel sosioekonomi pada prinsipnya tetap konstan antarkondisi. Namun, saya akui ini pengendalian statistik, bukan eksperimental — keterbatasan yang saya nyatakan secara eksplisit dalam bab metodologi.",
        vi: "Câu hỏi rất xác đáng, thưa cô. Em đã lường trước: các nhóm được ghép cặp theo thu nhập gia đình và trình độ học vấn của cha mẹ, để biến kinh tế-xã hội về nguyên tắc giữ nguyên giữa các điều kiện. Tuy nhiên em thừa nhận đây là kiểm soát thống kê, không phải thực nghiệm — một giới hạn em nêu rõ trong chương phương pháp.",
        en: "A very relevant question, ma'am. I anticipated it: the groups are matched by family income and parental education, so the socioeconomic variable in principle stays constant across conditions. However, I admit this is a statistical control, not an experimental one — a limitation I state explicitly in the methodology chapter.",
      },
    ],
    cultural_notes_vi:
      "Trong giới học thuật Indonesia, trình bày luận đề (« tesis ») hay giả thuyết nghiên cứu (« hipotesis penelitian ») trước « dewan penguji » (hội đồng), tại một « sidang » (buổi bảo vệ), hay trong « seminar », đi theo một kịch bản tu từ chặt chẽ. Hội đồng KỲ VỌNG nghiên cứu sinh:\n\n(1) MỞ ĐẦU BẰNG « TINJAUAN PUSTAKA » (tổng quan tài liệu) — ai đã làm gì, kết luận ra sao, còn lỗ hổng nào. Thiếu phần này, hội đồng đọc bạn là chưa làm bài đọc.\n\n(2) ĐỊNH VỊ MÌNH bằng « penelitian ini berada dalam ranah… » (nghiên cứu này nằm trong lĩnh vực…) và « menyimpang dari… » (tách khỏi…). Nói trống « saya meneliti X » bị xem là sinh viên cử nhân, không phải bậc thạc sĩ/tiến sĩ.\n\n(3) PHÁT BIỂU GIẢ THUYẾT bằng « hipotesis saya menyatakan bahwa », « diasumsikan bahwa », « diduga bahwa » — KHÔNG « saya rasa », « menurut saya ». Văn học thuật Indonesia ưa thể bị động vô nhân xưng với tiền tố « di- » (« diamati », « ditunjukkan ») để xóa cái « tôi » cảm tính.\n\n(4) RÀO ĐÓN (hedge) ngay từ đầu: « tampaknya », « diduga », « setidaknya sebagian ». Một giả thuyết KHÔNG hedge ở C1 nghe như giáo điều và bị tấn công ngay câu hỏi đầu.\n\nNgười Việt mới vào đại học Indonesia dễ rơi vào hai bẫy: (a) quá tự tin — phát biểu kết luận chắc nịch, làm hội đồng cảnh giác; (b) quá khiêm tốn — « saya masih pemula » — đẩy hội đồng vào vai trấn an. Khoảng giữa là giọng khẳng định có chừng mực: nói thẳng giả thuyết, gắn với điều kiện kiểm chứng, sẵn sàng từ bỏ nếu dữ liệu phản bác. Lưu ý: hội đồng Indonesia trang trọng nhưng thân thiện — gọi tên riêng, mỉm cười — nhưng độ chặt chẽ tu từ bên dưới không đổi.",
    cultural_notes_en:
      "In Indonesian academia, presenting a thesis ('tesis') or research hypothesis ('hipotesis penelitian') before a 'dewan penguji' (examining committee), at a 'sidang' (defense), or in a 'seminar' follows a tight rhetorical script. The committee expects you to: (1) open with a 'tinjauan pustaka' — who did what, what they concluded, what gap remains. Skip it and you read as underprepared. (2) Position yourself with 'penelitian ini berada dalam ranah…' (this research sits within…) and 'menyimpang dari…' (departs from…). A bare 'saya meneliti X' marks you as an undergraduate, not a master's/doctoral candidate. (3) State hypotheses with the impersonal passive — 'hipotesis saya menyatakan bahwa', 'diasumsikan bahwa', 'diduga bahwa' — NOT 'saya rasa' or 'menurut saya'. Indonesian academic prose leans heavily on the di- passive ('diamati', 'ditunjukkan', 'diperoleh') to erase the emotional first person. (4) Hedge from the first sentence: 'tampaknya', 'diduga', 'setidaknya sebagian'. An unhedged C1 hypothesis sounds dogmatic and invites immediate attack.\n\nTwo traps: (a) over-confidence — stating conclusions like a proof, which makes the committee distrust you; (b) over-modesty — 'saya masih pemula' (I'm still a beginner) — forcing them into reassurance mode. The middle voice means stating the hypothesis cleanly, tying it to falsifiable conditions, and signaling you'd abandon it if the data refutes it. Note: Indonesian defenses are formal yet warm — examiners use first names and smile — but the rhetorical rigor underneath is unchanged.",
    tip_advice_vi:
      "Cấu trúc chuẩn để trình bày « hipotesis penelitian » trong 3-5 phút (seminar, sidang):\n\n(1) KALIMAT PEMBUKA: « Penelitian ini berada dalam ranah X dan secara khusus mengkaji Y. » — định danh lĩnh vực + đối tượng cụ thể, một câu. « Mengkaji » trang trọng hơn « membahas ».\n\n(2) TINJAUAN RINGKAS: nêu BA tên (không hơn cho oral), kết luận chung, lỗ hổng cụ thể: « Pustaka terdahulu — terutama A (tahun), B (tahun), C (tahun) — telah memantapkan bahwa… Akan tetapi, satu hal masih belum tergarap: Z. »\n\n(3) RUMUSAN HIPOTESIS: « Justru kesenjangan inilah yang hendak saya tangani. Hipotesis kerja saya adalah: [phát biểu]. »\n\n(4) METODOLOGI MỘT CÂU: « Untuk mengujinya, saya menyusun korpus berisi N [đơn vị] yang dianalisis melalui kacamata [framework]. »\n\n(5) ANTISIPASI KEBERATAN: « Dapat saja diajukan keberatan bahwa [phản biện dễ đoán]. Terhadap itu saya akan menjawab bahwa [câu trả lời mầm]. » — câu này nâng ngay lên số học thuật C1.\n\nTRÁNH:\n- « Saya mau ngomongin… » → quá thân mật; dùng « Penelitian ini membahas… »\n- « Ini menarik banget karena… » → trống rỗng; nêu lý do cụ thể\n- Đọc slide từng chữ → KHÔNG; slide là điểm tựa\n- Vượt thời gian → mất điểm ngay\n\nLuyện ở nhà: viết 5 câu trên (pembuka / tinjauan / hipotesis / metodologi / keberatan) và đọc to đến khi nói được trong 3 phút không nhìn giấy.",
    tip_advice_en:
      "Standard structure for presenting a research hypothesis in 3–5 minutes (seminar or defense):\n\n(1) OPENING SENTENCE: 'Penelitian ini berada dalam ranah X dan secara khusus mengkaji Y.' — name the field + the specific object in one sentence. 'Mengkaji' (examine) is more academic than 'membahas' (discuss).\n\n(2) CONDENSED REVIEW: name THREE authors max, state the consensus, then the precise gap: 'Pustaka terdahulu — terutama A (tahun), B (tahun), C (tahun) — telah memantapkan bahwa… Akan tetapi, satu hal masih belum tergarap: Z.'\n\n(3) HYPOTHESIS FORMULATION: 'Justru kesenjangan inilah yang hendak saya tangani. Hipotesis kerja saya adalah: [statement].' The 'kesenjangan' (gap) framing is C1-register gold.\n\n(4) METHODOLOGY IN ONE SENTENCE: 'Untuk mengujinya, saya menyusun korpus berisi N [units] yang dianalisis melalui kacamata [framework].'\n\n(5) ANTICIPATING THE OBJECTION: 'Dapat saja diajukan keberatan bahwa [predictable critique]. Terhadap itu saya akan menjawab bahwa [seed of an answer].' This single sentence lifts you to C1-academic register.\n\nAVOID:\n- 'Saya mau ngomongin…' — too casual (Jakarta colloquial); use 'Penelitian ini membahas…'\n- 'Ini menarik banget karena…' — empty filler; give the concrete reason\n- Reading slides verbatim — slides are scaffolding, your voice is the product\n- Going over time — penalized immediately\n\nPractice at home: write all five sentences (pembuka / tinjauan / hipotesis / metodologi / keberatan) and read them aloud until you can deliver them in three minutes without notes.",
    register_notes:
      "Học thuật Indonesia dùng nhiều thể bị động « di- » (« diamati », « diperoleh », « ditunjukkan ») để xóa cái « saya » cảm tính. Dùng câu đầy đủ và liên từ trang trọng (« akan tetapi », « dengan demikian », « oleh karena itu », « sehubungan dengan itu »). Đại từ « saya », không « aku » (« aku » chỉ dùng thân mật/văn chương). Xưng hô hội đồng: « Prof. » / « Bapak / Ibu » + họ.",
    register_notes_en:
      "Indonesian academic register relies on the di- passive ('diamati', 'diperoleh', 'ditunjukkan') to depersonalize claims. Use full sentences and formal connectors ('akan tetapi' not 'tapi', 'dengan demikian', 'oleh karena itu', 'sehubungan dengan itu'). The pronoun is 'saya', never 'aku' (which is intimate/literary only). Address committee members as 'Prof.' or 'Bapak/Ibu' + surname; 'Anda' is the neutral formal 'you' but Bapak/Ibu is warmer and preferred.",
    roleplay_prompts: [
      "Trình bày giả thuyết nghiên cứu của bạn trong 3 phút theo cấu trúc 5 câu (pembuka / tinjauan / hipotesis / metodologi / keberatan).",
      "Một thành viên hội đồng nêu phản biện về cỡ mẫu nhỏ; trả lời theo công thức « saya telah mengantisipasinya… namun saya akui bahwa… ».",
    ],
    roleplay_prompts_en: [
      "Present your research hypothesis in 3 minutes following the five-sentence structure (pembuka / tinjauan / hipotesis / metodologi / keberatan).",
      "A committee member objects that your sample is too small; respond using 'saya telah mengantisipasinya… namun saya akui bahwa…'.",
    ],
  },

  // ── 2. Professional presentations ─────────────────────────────────────
  {
    id: "presentasi_profesional",
    level: "C1",
    category: "public_communication",
    title_vi: "Thuyết trình chuyên nghiệp: mở đầu, lập luận, chốt hành động",
    title_en: "Professional presentations: opening, arguing, closing with a call to action",
    sentences: [
      {
        en: "Allow me to walk you through the three priorities that will shape our roadmap for the coming quarter.",
        vi: "Cho phép tôi dẫn quý vị qua ba ưu tiên sẽ định hình lộ trình của chúng ta trong quý tới.",
        pronunciation_focus: [
          "memaparkan → me-ma-PAR-kan (meN- + papar + -kan; nhấn PAR)",
          "prioritas → pri-o-ri-TAS (4 âm tiết, nhấn TAS; rõ từng âm)",
          "kuartal → ku-AR-tal (3 âm tiết; 'kw' tách thành 'ku-ar')",
        ],
        pronunciation_focus_en: [
          "memaparkan → 'me-ma-PAR-kan' (meN- + papar + -kan = to lay out)",
          "prioritas → 'pree-o-ree-TAS' (four syllables, final stress)",
          "kuartal → 'koo-AR-tal' (quarter; kw splits to 'koo-ar')",
        ],
      },
      {
        en: "If we set the headline figures aside for a moment, the underlying trend tells a more nuanced story.",
        vi: "Nếu tạm gác các con số nổi bật sang một bên, xu hướng nền cho thấy một câu chuyện nhiều sắc thái hơn.",
        pronunciation_focus: [
          "mengesampingkan → me-nge-sam-PING-kan (meN- + ke-samping + -kan; nhấn PING)",
          "kecenderungan → ke-cen-de-RUNG-an (ke-…-an quanh 'cenderung'; 'c' = 'ch')",
          "bernuansa → ber-nu-AN-sa (ber- + nuansa; nhấn AN)",
        ],
        pronunciation_focus_en: [
          "mengesampingkan → 'me-nge-sam-PING-kan' (to set aside)",
          "kecenderungan → 'ke-chen-de-RUNG-an' (trend; c = 'ch', ke-…-an circumfix)",
          "bernuansa → 'ber-noo-AN-sa' (nuanced; ber- + nuansa)",
        ],
      },
      {
        en: "What I am asking of this team today is not agreement, but a decision.",
        vi: "Điều tôi yêu cầu ở đội ngũ hôm nay không phải là sự đồng thuận, mà là một quyết định.",
        pronunciation_focus: [
          "persetujuan → per-se-tu-JU-an (per-…-an quanh 'setuju'; nhấn JU)",
          "keputusan → ke-pu-TU-san (ke-…-an quanh 'putus'; nhấn TU)",
          "melainkan → me-LAIN-kan ('không phải… mà là'; cặp với 'bukan')",
        ],
        pronunciation_focus_en: [
          "persetujuan → 'per-se-too-JOO-an' (agreement; per-…-an around 'setuju')",
          "keputusan → 'ke-poo-TOO-san' (decision; ke-…-an around 'putus')",
          "melainkan → 'me-LAIN-kan' ('but rather', pairs with 'bukan')",
        ],
      },
    ],
    vocabulary: [
      {
        cell_id: "3ef58a2d-d652-4117-b022-1ed129d7f97a",
        word: "memaparkan",
        en: "to lay out / present",
        vi: "trình bày, phơi bày (rõ ràng)",
        pos: "v.",
        pronunciation_vi: "me-ma-PAR-kan",
        pronunciation_en: "me-ma-PAR-kan — meN- + papar + -kan; more vivid than 'menyampaikan'",
      },
      {
        cell_id: "fb1e88a2-b87f-48ed-943e-8bee7f967c58",
        word: "secara garis besar",
        en: "in broad strokes / in outline",
        vi: "một cách khái quát",
        pos: "phrase",
        pronunciation_vi: "se-CA-ra GA-ris be-SAR",
        pronunciation_en: "se-CHA-ra GA-ris be-SAR — 'garis besar' = main lines",
      },
      {
        cell_id: "74a74395-af33-4c5b-8bd8-33b90d57ebc8",
        word: "menggarisbawahi",
        en: "to underline / emphasize",
        vi: "nhấn mạnh",
        pos: "v.",
        pronunciation_vi: "meng-ga-ris-ba-WA-hi",
        pronunciation_en: "meng-ga-ris-ba-WA-hee — meN- + garis bawah + -i",
      },
      {
        cell_id: "05e66388-55a9-4bfc-b524-c4430a05caa5",
        word: "tindak lanjut",
        en: "follow-up / next steps",
        vi: "bước tiếp theo, hành động tiếp",
        pos: "n.",
        pronunciation_vi: "TIN-dak LAN-jut",
        pronunciation_en: "TIN-dak LAN-joot — the action item; 'menindaklanjuti' = to follow up",
      },
      {
        cell_id: "e22edd76-a1f2-4dae-b1c5-b218ae072ebc",
        word: "pemangku kepentingan",
        en: "stakeholder(s)",
        vi: "các bên liên quan",
        pos: "n.",
        pronunciation_vi: "pe-MANG-ku ke-pen-TING-an",
        pronunciation_en: "pe-MANG-koo ke-pen-TING-an — calque of 'stakeholder'; formal register",
      },
      {
        cell_id: "fe283db1-1c70-48c8-a96b-26a6f6770482",
        word: "menyimpulkan",
        en: "to conclude / summarize",
        vi: "kết luận, tổng kết",
        pos: "v.",
        pronunciation_vi: "me-nyim-PUL-kan (meN- + simpul + -kan; 's' → 'ny')",
        pronunciation_en: "me-nyim-POOL-kan — meN- + simpul + -kan; s → ny",
      },
      {
        cell_id: "88c45eb5-618b-4a7e-a723-d85b83e5cb0a",
        word: "izinkan saya",
        en: "allow me / permit me",
        vi: "cho phép tôi",
        pos: "phrase",
        pronunciation_vi: "i-ZIN-kan SA-ya",
        pronunciation_en: "ee-ZIN-kan SA-ya — polite presenter opener",
      },
    ],
    dialogue: [
      {
        cell_id: "ebe1e78b-d010-4139-8355-e04209f6d960",
        speaker: "Linh (presenter)",
        text: "Selamat pagi, Bapak dan Ibu. Izinkan saya memaparkan tiga prioritas yang akan menentukan arah kita kuartal depan.",
        vi: "Chào buổi sáng quý vị. Cho phép tôi trình bày ba ưu tiên sẽ định hướng chúng ta trong quý tới.",
        en: "Good morning, everyone. Allow me to lay out the three priorities that will set our direction next quarter.",
      },
      {
        cell_id: "7f275f9d-11aa-4118-9376-2ed74fbdf8a8",
        speaker: "Pak Surya (direktur)",
        text: "Silakan. Tapi tolong langsung ke angka — waktu kita terbatas.",
        vi: "Mời. Nhưng xin đi thẳng vào con số — thời gian của chúng ta có hạn.",
        en: "Please. But go straight to the figures — our time is limited.",
      },
      {
        cell_id: "c92dde17-ec41-4394-b3fb-360e9c98af16",
        speaker: "Linh",
        text: "Tentu, Pak. Garis besarnya: pendapatan naik dua belas persen, namun marjin justru menipis. Inilah yang ingin saya garisbawahi hari ini.",
        vi: "Vâng thưa anh. Khái quát: doanh thu tăng mười hai phần trăm, nhưng biên lợi nhuận lại mỏng đi. Đây chính là điều tôi muốn nhấn mạnh hôm nay.",
        en: "Of course, sir. In broad strokes: revenue is up twelve percent, yet the margin is actually thinning. That is what I want to underline today.",
      },
      {
        cell_id: "bdd9eafc-fb62-40a8-a48f-f02324d66680",
        speaker: "Bu Hartini (keuangan)",
        text: "Lalu apa usulan tindak lanjutnya?",
        vi: "Vậy đề xuất bước tiếp theo là gì?",
        en: "And what is the proposed follow-up?",
      },
      {
        cell_id: "49db5794-32fc-49a9-a8b9-53bb39c1e6f4",
        speaker: "Linh",
        text: "Yang saya minta hari ini bukan persetujuan, melainkan satu keputusan: menunda ekspansi atau memangkas biaya. Saya sarankan yang kedua, dengan alasan berikut.",
        vi: "Điều tôi yêu cầu hôm nay không phải sự đồng thuận, mà là một quyết định: hoãn mở rộng hay cắt giảm chi phí. Tôi đề xuất phương án thứ hai, với những lý do sau.",
        en: "What I ask today is not agreement, but a decision: defer expansion or cut costs. I recommend the latter, for the following reasons.",
      },
    ],
    cultural_notes_vi:
      "Thuyết trình chuyên nghiệp ở Indonesia cân bằng giữa trang trọng và quan hệ con người (« basa-basi » mở đầu nhẹ là bình thường, nhưng ở môi trường doanh nghiệp cấp cao thường được rút ngắn). Vài điểm C1 then chốt:\n\n(1) MỞ ĐẦU bằng « Selamat pagi/siang, Bapak dan Ibu » rồi « Izinkan saya… ». Câu « izinkan saya » báo hiệu giọng trang trọng có kiểm soát — khác hẳn « gue mau cerita » của bahasa gaul.\n\n(2) XƯNG HÔ cấp trên bằng « Bapak/Ibu » hoặc « Pak/Bu » + tên, KHÔNG gọi trống tên. Bỏ qua điều này bị xem là thiếu lễ độ (« kurang sopan »), nặng hơn ở Indonesia so với phương Tây.\n\n(3) BẤT ĐỒNG GIÁN TIẾP: người Indonesia trong họp hiếm khi nói « Anda salah ». Thay vào đó: « Mungkin ada baiknya kita tinjau ulang… » (Có lẽ ta nên xem lại…). Người Việt vốn cũng gián tiếp nên dễ hợp, nhưng đừng nhầm sự lịch thiệp này với sự đồng ý.\n\n(4) CHỐT bằng lời kêu gọi hành động rõ: « Yang saya minta adalah satu keputusan: A atau B. » Kết thúc mơ hồ làm cuộc họp tan mà không có « tindak lanjut » (bước tiếp), một lỗi thường gặp.\n\nBẫy cho người Việt: dùng tiếng Anh chèn quá nhiều (« revenue », « target ») — chấp nhận được trong tech nhưng ở môi trường chính thống nên dùng « pendapatan », « sasaran ». Và đừng cười xòa khi bị chất vấn — giữ điềm tĩnh, đó là dấu hiệu của « kewibawaan » (uy thế).",
    cultural_notes_en:
      "Professional presentations in Indonesia balance formality with the human relationship (a brief 'basa-basi' warm-up is normal, though trimmed in senior corporate settings). Key C1 points:\n\n(1) OPEN with 'Selamat pagi/siang, Bapak dan Ibu' then 'Izinkan saya…'. 'Izinkan saya' signals controlled formality — utterly different from the bahasa gaul 'gue mau cerita'.\n\n(2) ADDRESS superiors as 'Bapak/Ibu' or 'Pak/Bu' + name, never by bare first name. Skipping this reads as 'kurang sopan' (impolite), weightier in Indonesia than in the West.\n\n(3) INDIRECT DISAGREEMENT: Indonesians in meetings rarely say 'Anda salah' (you're wrong). Instead: 'Mungkin ada baiknya kita tinjau ulang…' (perhaps we ought to review this). Vietnamese speakers are also indirect, so this transfers well — but don't mistake the courtesy for agreement.\n\n(4) CLOSE with a clear call to action: 'Yang saya minta adalah satu keputusan: A atau B.' A vague ending dissolves the meeting with no 'tindak lanjut' (follow-up), a common failure.\n\nTrap for Vietnamese speakers: over-inserting English ('revenue', 'target') — acceptable in tech but in formal settings prefer 'pendapatan', 'sasaran'. And don't laugh nervously when challenged — staying composed signals 'kewibawaan' (authority/gravitas).",
    tip_advice_vi:
      "Khung thuyết trình 'tiga-poin' (ba điểm) chuẩn doanh nghiệp Indonesia:\n\nPEMBUKA (mở): « Selamat pagi. Izinkan saya memaparkan [chủ đề] dalam tiga poin. »\n\nISI (thân) — mỗi điểm theo công thức KLAIM → BUKTI → IMPLIKASI:\n- « Pertama, [khẳng định]. Datanya menunjukkan [số liệu]. Artinya, [hệ quả]. »\n- « Kedua… » « Ketiga… »\n\nTRANSISI trang trọng: « beralih ke poin berikutnya », « sehubungan dengan itu », « di sisi lain ».\n\nPENUTUP (chốt): « Sebagai penutup, yang saya minta adalah [hành động cụ thể]. » Rồi mời hỏi: « Saya persilakan jika ada pertanyaan. »\n\nXỬ LÝ CÂU HỎI KHÓ:\n- Câu mua thời gian: « Pertanyaan yang bagus. Begini… »\n- Khi chưa có số liệu: « Saya belum punya angka pastinya, akan saya tindaklanjuti. » (KHÔNG bịa số)\n- Khi bị phản bác: « Saya memahami kekhawatiran Bapak. Izinkan saya menjelaskan dari sudut lain. »\n\nLuyện: ghi âm bài 3 phút, nghe lại, cắt mọi « eee », « anu », « apa ya » — những từ đệm này kéo tụt uy thế (« kewibawaan ») nhanh nhất.",
    tip_advice_en:
      "The 'tiga-poin' (three-point) frame, standard in Indonesian corporate decks:\n\nPEMBUKA (open): 'Selamat pagi. Izinkan saya memaparkan [topic] dalam tiga poin.'\n\nISI (body) — each point follows CLAIM → EVIDENCE → IMPLICATION:\n- 'Pertama, [claim]. Datanya menunjukkan [figure]. Artinya, [consequence].'\n- 'Kedua…' 'Ketiga…'\n\nFORMAL TRANSITIONS: 'beralih ke poin berikutnya' (turning to the next point), 'sehubungan dengan itu', 'di sisi lain' (on the other hand).\n\nPENUTUP (close): 'Sebagai penutup, yang saya minta adalah [concrete action].' Then invite questions: 'Saya persilakan jika ada pertanyaan.'\n\nHANDLING HARD QUESTIONS:\n- Time-buyer: 'Pertanyaan yang bagus. Begini…'\n- No data yet: 'Saya belum punya angka pastinya, akan saya tindaklanjuti.' (Never fabricate a number.)\n- When challenged: 'Saya memahami kekhawatiran Bapak. Izinkan saya menjelaskan dari sudut lain.'\n\nDrill: record a 3-minute version, replay it, and cut every 'eee', 'anu', 'apa ya' — these fillers erode 'kewibawaan' (gravitas) fastest.",
    register_notes:
      "Trang trọng doanh nghiệp: « saya » + « Bapak/Ibu », liên từ đầy đủ (« akan tetapi », « oleh sebab itu »), số đếm rõ ràng. Bahasa gaul (« gue/lu », « banget », « gimana ») bị cấm trong phần chính thức nhưng có thể nới lỏng nhẹ khi trò chuyện hành lang sau họp với đồng cấp.",
    register_notes_en:
      "Corporate-formal: 'saya' + 'Bapak/Ibu', full connectors ('akan tetapi', 'oleh sebab itu'), spelled-out figures. Bahasa gaul ('gue/lu', 'banget', 'gimana') is barred from the formal portion but can relax slightly in post-meeting hallway chat with peers.",
    roleplay_prompts: [
      "Trình bày một đề xuất ngân sách trong 3 phút theo khung tiga-poin (klaim → bukti → implikasi), kết bằng một lời kêu gọi quyết định A/B.",
      "Một giám đốc phản bác con số của bạn giữa chừng; phản hồi bằng « Saya memahami kekhawatiran Bapak. Izinkan saya menjelaskan dari sudut lain. » mà không mất bình tĩnh.",
    ],
    roleplay_prompts_en: [
      "Present a budget proposal in 3 minutes using the tiga-poin frame (claim → evidence → implication), closing with a clear A/B decision ask.",
      "A director challenges your figure mid-presentation; respond with 'Saya memahami kekhawatiran Bapak. Izinkan saya menjelaskan dari sudut lain.' without losing composure.",
    ],
  },

  // ── 3. Literary language ──────────────────────────────────────────────
  {
    id: "bahasa_sastra",
    level: "C1",
    category: "expressions",
    title_vi: "Ngôn ngữ văn chương: ẩn dụ, nhịp điệu, giọng trữ tình",
    title_en: "Literary language: metaphor, rhythm, and the lyrical voice",
    sentences: [
      {
        en: "Dusk fell over the city like a slow tide, and the streetlamps blinked awake one by one.",
        vi: "Hoàng hôn buông xuống thành phố như một con nước chậm, và những ngọn đèn đường lần lượt chớp thức.",
        pronunciation_focus: [
          "senja → SEN-ja (hoàng hôn; văn chương hơn 'sore'; nhấn SEN)",
          "merayap → me-RA-yap (meN- + rayap, 'bò/lan'; nhấn RA)",
          "satu per satu → SA-tu per SA-tu ('lần lượt'; ngắt nhịp đều)",
        ],
        pronunciation_focus_en: [
          "senja → 'SEN-ja' (dusk; more literary than 'sore')",
          "merayap → 'me-RA-yap' (to creep/crawl; meN- + rayap)",
          "satu per satu → 'SA-too per SA-too' (one by one; even cadence)",
        ],
      },
      {
        en: "Her silence was not emptiness but a room with all its doors gently shut.",
        vi: "Sự im lặng của nàng không phải là trống rỗng, mà là một căn phòng với mọi cánh cửa khép nhẹ.",
        pronunciation_focus: [
          "keheningan → ke-he-NING-an (ke-…-an quanh 'hening'; nhấn NING)",
          "kehampaan → ke-ham-PA-an (ke-…-an quanh 'hampa', 'rỗng'; nhấn PA)",
          "terkatup → ter-KA-tup (ter- + katup; 'khép lại', thể bị động/trạng thái)",
        ],
        pronunciation_focus_en: [
          "keheningan → 'ke-he-NING-an' (silence; ke-…-an around 'hening')",
          "kehampaan → 'ke-ham-PA-an' (emptiness; ke-…-an around 'hampa')",
          "terkatup → 'ter-KA-toop' (shut/closed; ter- stative around 'katup')",
        ],
      },
      {
        en: "The old man spoke in proverbs, as if every truth were too heavy to carry without a handle.",
        vi: "Ông lão nói bằng tục ngữ, như thể mọi sự thật đều quá nặng để mang vác mà không có quai cầm.",
        pronunciation_focus: [
          "peribahasa → pe-ri-ba-HA-sa (tục ngữ; nhấn HA)",
          "seakan-akan → se-a-kan-A-kan ('như thể'; láy, nhịp đôi)",
          "kebenaran → ke-be-NA-ran (ke-…-an quanh 'benar'; nhấn NA)",
        ],
        pronunciation_focus_en: [
          "peribahasa → 'pe-ree-ba-HA-sa' (proverb; stress HA)",
          "seakan-akan → 'se-a-kan-A-kan' (as if; reduplicated, paired beat)",
          "kebenaran → 'ke-be-NA-ran' (truth; ke-…-an around 'benar')",
        ],
      },
    ],
    vocabulary: [
      {
        cell_id: "b04dd173-a2a5-41ea-9686-5b4cba95b7d6",
        word: "senja",
        en: "dusk / twilight",
        vi: "hoàng hôn (chất thơ)",
        pos: "n.",
        pronunciation_vi: "SEN-ja",
        pronunciation_en: "SEN-ja — poetic; 'sore' is the everyday word for late afternoon",
      },
      {
        cell_id: "e88218cf-9c33-442c-8c89-e4118cb82110",
        word: "merindukan",
        en: "to long for / yearn for",
        vi: "khao khát, nhớ nhung",
        pos: "v.",
        pronunciation_vi: "me-rin-DU-kan (meN- + rindu + -kan)",
        pronunciation_en: "me-rin-DOO-kan — meN- + rindu + -kan; 'rindu' is itself deeply lyrical",
      },
      {
        cell_id: "cc46fc05-5d3a-403b-9332-54ed3846d361",
        word: "kefanaan",
        en: "transience / impermanence",
        vi: "sự vô thường",
        pos: "n.",
        pronunciation_vi: "ke-fa-NA-an (ke-…-an quanh 'fana')",
        pronunciation_en: "ke-fa-NA-an — ke-…-an around 'fana' (mortal/fleeting); high literary",
      },
      {
        cell_id: "6b40b731-2505-477f-9946-f323889f95d2",
        word: "bagai / laksana",
        en: "like / as (literary 'seperti')",
        vi: "tựa như, dường như (văn)",
        pos: "conj.",
        pronunciation_vi: "ba-GAI / lak-SA-na",
        pronunciation_en: "ba-GAI / lak-SA-na — literary equivalents of 'seperti'; mark the simile register",
      },
      {
        cell_id: "f17f55f0-8206-49a7-a1ba-a4ab6a69e7f8",
        word: "menyiratkan",
        en: "to imply / hint at",
        vi: "ngụ ý, hàm ý",
        pos: "v.",
        pronunciation_vi: "me-nyi-RAT-kan (meN- + sirat + -kan; 's' → 'ny')",
        pronunciation_en: "me-nyee-RAT-kan — meN- + sirat + -kan; 'tersirat' = implied/between-the-lines",
      },
      {
        cell_id: "c3859812-488c-484f-853e-37b16f2440ba",
        word: "kesunyian",
        en: "solitude / stillness",
        vi: "sự cô tịch, vắng lặng",
        pos: "n.",
        pronunciation_vi: "ke-su-NYI-an (ke-…-an quanh 'sunyi')",
        pronunciation_en: "ke-soo-NYEE-an — ke-…-an around 'sunyi'; a key mood-word in Indonesian poetry",
      },
    ],
    cultural_notes_vi:
      "Văn chương Indonesia hiện đại (« sastra Indonesia ») mang một giọng riêng mà người Việt sẽ thấy vừa lạ vừa gần. Vài chìa khóa C1:\n\n(1) HAI TẦNG TỪ VỰNG. Indonesia có lớp từ đời thường (« sore », « sedih », « sepi ») và lớp từ văn chương song hành (« senja », « pilu/nestapa », « sunyi/lengang »). Chọn đúng tầng là dấu hiệu C1. Dùng « bagai » và « laksana » thay « seperti » lập tức nâng câu lên giọng trữ tình.\n\n(2) DI SẢN TỪ TIẾNG MÃ LAI CỔ & ẢNH HƯỞNG ARABIC/PERSIAN. Nhiều từ trữ tình (« rindu », « kalbu » = con tim, « sukma » = linh hồn, « fana » = vô thường) đến từ truyền thống thơ « pantun » và « syair », nhuốm màu Hồi giáo - Mã Lai. « Sukma », « kalbu », « fana » không dùng trong văn nói đời thường.\n\n(3) NHÀ VĂN MỐC. Chairil Anwar (thơ hiện đại, « Aku »), Pramoedya Ananta Toer (tiểu thuyết « Bumi Manusia »), Sapardi Djoko Damono (thơ tối giản, « Hujan Bulan Juni »). Đọc một bài Sapardi cho thấy sức mạnh của câu ngắn, từ đời thường đặt đúng chỗ.\n\n(4) IMBUHAN (phụ tố) LÀM NHẠC. Tiền tố ke-…-an biến tính từ thành danh từ trừu tượng trữ tình: hening → keheningan (sự tĩnh lặng), sunyi → kesunyian, fana → kefanaan. Lớp danh từ -an/ke-…-an này là xương sống của giọng văn chương.\n\nNgười Việt có lợi thế: thơ Việt cũng yêu sự cô tịch, vô thường, hoàng hôn — các « mood » này dịch qua rất tự nhiên. Cái khó là kỷ luật KHÔNG trộn tầng: một câu trữ tình mà chèn « banget » hay « lagi » (gaul) sẽ vỡ giọng.",
    cultural_notes_en:
      "Modern Indonesian literature ('sastra Indonesia') has a voice a Vietnamese reader will find both foreign and familiar. C1 keys:\n\n(1) TWO LEXICAL REGISTERS. Indonesian keeps an everyday layer ('sore', 'sedih', 'sepi') alongside a parallel literary layer ('senja', 'pilu/nestapa', 'sunyi/lengang'). Choosing the right tier is a C1 marker. Swapping 'bagai' or 'laksana' for 'seperti' instantly lifts a line into the lyrical register.\n\n(2) OLD-MALAY HERITAGE & ARABIC/PERSIAN INFLUENCE. Many lyrical words ('rindu' = longing, 'kalbu' = heart, 'sukma' = soul, 'fana' = transience) descend from the 'pantun' and 'syair' poetic traditions, tinged with Malay-Islamic color. 'Sukma', 'kalbu', 'fana' never appear in everyday speech.\n\n(3) LANDMARK WRITERS. Chairil Anwar (modernist poetry, 'Aku'), Pramoedya Ananta Toer (the novel 'Bumi Manusia'), Sapardi Djoko Damono (minimalist verse, 'Hujan Bulan Juni'). A single Sapardi poem shows the power of short lines and plain words placed exactly right.\n\n(4) AFFIXES AS MUSIC. The ke-…-an circumfix turns adjectives into lyrical abstract nouns: hening → keheningan (stillness), sunyi → kesunyian (solitude), fana → kefanaan (transience). This -an / ke-…-an noun layer is the backbone of the literary voice.\n\nVietnamese readers have an edge: Vietnamese poetry also loves solitude, impermanence, and dusk — these moods carry over naturally. The discipline is NOT mixing tiers: a lyrical line spiked with 'banget' or colloquial 'lagi' shatters the voice.",
    tip_advice_vi:
      "Cách rèn giọng văn chương Indonesia ở C1:\n\n(1) HỌC TỪ THEO CẶP TẦNG. Mỗi từ đời thường, học bạn song của nó: sore/senja, sedih/pilu, hati/kalbu, jiwa/sukma, sepi/sunyi, mati/fana. Khi viết, chọn tầng theo giọng mong muốn.\n\n(2) DÙNG SO SÁNH TRỮ TÌNH. Thay « seperti » bằng « bagai », « laksana », « bak ». « Hatinya sekeras batu » → « hatinya laksana batu karang ». Đừng lạm dụng: một, hai hình ảnh mạnh hơn năm hình ảnh nhạt.\n\n(3) KHAI THÁC ke-…-an. Biến cảm giác thành danh từ: « Dia merasa sunyi » (anh thấy cô đơn) → « Kesunyian merayap ke dalam dadanya » (Sự cô tịch bò vào lồng ngực anh). Danh từ hóa cho phép ẩn dụ chủ ngữ — cảm xúc tự hành động.\n\n(4) NHỊP. Văn chương Indonesia chuộng câu ngắn xen câu dài, và phép láy (« satu per satu », « perlahan-lahan », « samar-samar ») tạo nhịp. Đọc to là cách kiểm tra nhịp tốt nhất.\n\n(5) ĐỌC ĐỂ VIẾT. Đọc 4 câu mở của « Bumi Manusia » (Pramoedya) hoặc một bài « Hujan Bulan Juni » (Sapardi), gạch dưới mọi từ tầng văn chương, rồi thử viết một đoạn 3 câu bắt chước giọng.\n\nBẪY: ép quá nhiều từ « cao » vào một câu thành ra sến (« lebay »). C1 thực thụ biết tiết chế — một từ « fana » đặt đúng chỗ mạnh hơn cả đoạn đầy « kalbu », « sukma », « nestapa ».",
    tip_advice_en:
      "How to build an Indonesian literary voice at C1:\n\n(1) LEARN WORDS IN REGISTER PAIRS. For each everyday word, learn its literary twin: sore/senja, sedih/pilu, hati/kalbu, jiwa/sukma, sepi/sunyi, mati/fana. When writing, pick the tier your voice wants.\n\n(2) USE LYRICAL SIMILES. Replace 'seperti' with 'bagai', 'laksana', 'bak'. 'Hatinya sekeras batu' → 'hatinya laksana batu karang' (his heart like a reef). Don't overdo it: one or two strong images beat five flat ones.\n\n(3) EXPLOIT ke-…-an. Turn feeling into a noun: 'Dia merasa sunyi' (he feels lonely) → 'Kesunyian merayap ke dalam dadanya' (Solitude creeps into his chest). Nominalizing lets the emotion become the subject — it acts on its own.\n\n(4) RHYTHM. Indonesian literary prose likes short lines against long ones, and reduplication ('satu per satu', 'perlahan-lahan', 'samar-samar') sets the beat. Reading aloud is the best rhythm test.\n\n(5) READ TO WRITE. Read the opening lines of 'Bumi Manusia' (Pramoedya) or a poem from 'Hujan Bulan Juni' (Sapardi), underline every literary-tier word, then write a 3-sentence passage imitating the voice.\n\nTRAP: cramming too many 'high' words into one line turns purple ('lebay'). True C1 knows restraint — one well-placed 'fana' beats a paragraph stuffed with 'kalbu', 'sukma', 'nestapa'.",
    idiom_glosses: [
      {
        idiom: "bagai pungguk merindukan bulan",
        literal: "like an owl longing for the moon",
        literal_en: "like an owl longing for the moon",
        meaning: "Khao khát một điều ngoài tầm với; yêu đơn phương một người quá cao xa.",
        meaning_en: "To yearn for something unreachable; to love someone hopelessly out of one's reach.",
        example: "Mencintai bintang film itu? Bagai pungguk merindukan bulan saja kau ini.",
        example_en: "In love with that movie star? You're just an owl longing for the moon.",
      },
      {
        idiom: "tak ada gading yang tak retak",
        literal: "there is no ivory that is not cracked",
        literal_en: "there is no ivory without a crack",
        meaning: "Không có gì hoàn hảo; ai cũng có khuyết điểm.",
        meaning_en: "Nothing is perfect; everyone has flaws.",
        example: "Karyanya luar biasa, walau ada cela kecil — tak ada gading yang tak retak.",
        example_en: "His work is extraordinary, though it has a small flaw — no ivory is without a crack.",
      },
      {
        idiom: "patah tumbuh hilang berganti",
        literal: "what breaks grows again, what is lost is replaced",
        literal_en: "the broken grows anew, the lost is replaced",
        meaning: "Cuộc đời nối tiếp không ngừng; mất mát rồi sẽ có cái mới thay thế.",
        meaning_en: "Life renews itself endlessly; what is lost will be replaced.",
        example: "Generasi tua berlalu, yang muda bangkit — patah tumbuh hilang berganti.",
        example_en: "The old generation passes, the young rise — the broken grows anew, the lost replaced.",
      },
    ],
    register_notes:
      "Tầng văn chương: « bagai/laksana » thay « seperti »; danh từ ke-…-an trừu tượng; từ gốc Mã Lai cổ/Arabic (« kalbu », « sukma », « fana », « rindu »). KHÔNG trộn với gaul. Đại từ « aku/kau » (không « gue/lu ») được dùng trong thơ — « aku » ở đây trữ tình, không thân mật suồng sã.",
    register_notes_en:
      "Literary tier: 'bagai/laksana' for 'seperti'; abstract ke-…-an nouns; Old-Malay/Arabic loans ('kalbu', 'sukma', 'fana', 'rindu'). Never mix with gaul. The pronouns 'aku/kau' (not 'gue/lu') appear in verse — here 'aku' is lyrical, not casual-intimate.",
    roleplay_prompts: [
      "Viết lại một câu đời thường (« Sore itu saya merasa sangat sepi ») thành một câu văn chương dùng tầng từ cao và một danh từ ke-…-an.",
      "Đọc to một bài thơ Sapardi Djoko Damono, gạch dưới mọi từ tầng văn chương, rồi giải thích bằng tiếng Indonesia tại sao từ đời thường lại được giữ nguyên ở vài chỗ.",
    ],
    roleplay_prompts_en: [
      "Rewrite an everyday line ('Sore itu saya merasa sangat sepi') into a literary sentence using the high register and one ke-…-an noun.",
      "Read a Sapardi Djoko Damono poem aloud, underline every literary-tier word, then explain in Indonesian why everyday words are kept in certain spots.",
    ],
  },

  // ── 4. Regional vocabulary awareness (Javanese / Sundanese influence) ─
  {
    id: "kesadaran_bahasa_daerah",
    level: "C1",
    category: "society",
    title_vi: "Ý thức về ngôn ngữ vùng miền: ảnh hưởng Java và Sunda",
    title_en: "Regional-language awareness: Javanese and Sundanese influence",
    sentences: [
      {
        en: "Even in standard Indonesian, a Javanese speaker will soften a request with 'monggo' before switching back.",
        vi: "Ngay cả trong tiếng Indonesia chuẩn, người Java vẫn làm mềm lời mời bằng « monggo » trước khi chuyển lại.",
        pronunciation_focus: [
          "monggo → MONG-go (tiếng Java: 'mời/xin'; 'ng-g' rõ cả hai)",
          "memperhalus → mem-per-ha-LUS (meN- + per- + halus; 'làm dịu hơn')",
          "logat → LO-gat ('giọng/ngữ điệu vùng'; nhấn LO)",
        ],
        pronunciation_focus_en: [
          "monggo → 'MONG-go' (Javanese 'please/go ahead'; sound both ng and g)",
          "memperhalus → 'mem-per-ha-LOOS' (meN- + per- + halus = to soften)",
          "logat → 'LO-gat' (regional accent/intonation)",
        ],
      },
      {
        en: "The word 'atuh' tacked onto a sentence is an unmistakable signature of Sundanese West Java.",
        vi: "Từ « atuh » gắn cuối câu là dấu hiệu không thể nhầm của vùng Sunda Tây Java.",
        pronunciation_focus: [
          "atuh → A-tuh (tiểu từ Sunda cuối câu; làm mềm/nài nỉ)",
          "ciri khas → CI-ri KHAS ('đặc trưng'; 'kh' hơi rít như tiếng Ả Rập)",
          "tak terbantahkan → tak ter-ban-TAH-kan ('không thể chối cãi')",
        ],
        pronunciation_focus_en: [
          "atuh → 'A-tooh' (Sundanese sentence-final particle; softening/coaxing)",
          "ciri khas → 'CHEE-ree KHAS' (hallmark; kh is a raspy Arabic-style fricative)",
          "tak terbantahkan → 'tak ter-ban-TAH-kan' (undeniable)",
        ],
      },
      {
        en: "Understanding these regional layers is less about vocabulary than about reading who someone is and where they place you.",
        vi: "Hiểu các tầng vùng miền này không phải chuyện từ vựng, mà là đọc được người ta là ai và đặt bạn ở đâu.",
        pronunciation_focus: [
          "lapisan → la-PI-san (tầng/lớp; nhấn PI)",
          "kedaerahan → ke-da-e-RA-han (ke-…-an quanh 'daerah'; 'thuộc vùng miền')",
          "menempatkan → me-nem-PAT-kan (meN- + tempat + -kan; 'đặt vào vị trí')",
        ],
        pronunciation_focus_en: [
          "lapisan → 'la-PEE-san' (layer; stress PEE)",
          "kedaerahan → 'ke-da-e-RA-han' (regionality; ke-…-an around 'daerah')",
          "menempatkan → 'me-nem-PAT-kan' (to place/position; meN- + tempat + -kan)",
        ],
      },
    ],
    vocabulary: [
      {
        cell_id: "29168479-4e5c-4a92-b133-5bbe3dbd5112",
        word: "bahasa daerah",
        en: "regional / local language",
        vi: "tiếng địa phương, ngôn ngữ vùng",
        pos: "n.",
        pronunciation_vi: "ba-HA-sa da-E-rah",
        pronunciation_en: "ba-HA-sa da-E-rah — e.g. Javanese, Sundanese, Balinese, Batak",
      },
      {
        cell_id: "a672ae34-3c5a-48e0-bacc-2bdd38bf98a8",
        word: "logat",
        en: "accent / regional intonation",
        vi: "giọng vùng, ngữ điệu",
        pos: "n.",
        pronunciation_vi: "LO-gat",
        pronunciation_en: "LO-gat — 'logat Jawa', 'logat Batak' — the audible regional stamp",
      },
      {
        cell_id: "51e2d772-6734-4c0c-b485-4ddef14269c7",
        word: "halus / kasar",
        en: "refined / coarse (speech level)",
        vi: "lịch sự nhã / thô (cấp độ lời nói)",
        pos: "adj.",
        pronunciation_vi: "ha-LUS / ka-SAR",
        pronunciation_en: "ha-LOOS / ka-SAR — central to Javanese speech levels (krama vs ngoko)",
      },
      {
        cell_id: "6f958820-da06-4bbe-b28f-e9e104270f7b",
        word: "sungkan",
        en: "reluctant out of deference / loath to impose",
        vi: "ngại, e dè vì nể",
        pos: "adj.",
        pronunciation_vi: "SUNG-kan",
        pronunciation_en: "SUNG-kan — a Javanese-rooted feeling now standard Indonesian; deferential reluctance",
      },
      {
        cell_id: "8645740a-2e95-4204-a2bf-4676748c185c",
        word: "guyub",
        en: "communal harmony / togetherness",
        vi: "đoàn kết cộng đồng, gắn bó",
        pos: "adj.",
        pronunciation_vi: "GU-yub",
        pronunciation_en: "GOO-yoob — Javanese loanword for warm communal cohesion; cf. 'gotong royong'",
      },
      {
        cell_id: "ed5880c1-5465-411d-8771-a9a614c197f7",
        word: "teteh / aa / mas / mbak",
        en: "respectful address terms (Sundanese / Javanese)",
        vi: "từ xưng hô kính (Sunda / Java): chị/anh",
        pos: "n.",
        pronunciation_vi: "TÉ-teh / A-a / MAS / m-BAK",
        pronunciation_en: "TEH-teh, A-a (Sundanese older sister/brother); MAS, mBAK (Javanese older brother/sister)",
      },
    ],
    dialogue: [
      {
        cell_id: "79f44652-7855-46a7-a304-1d5d1d2dace9",
        speaker: "Pak Bambang (Jawa)",
        text: "Monggo, Mbak Linh, silakan duduk dulu. Maaf, rumah saya sederhana.",
        vi: "Mời, chị Linh, ngồi đã. Xin lỗi, nhà tôi giản dị thôi.",
        en: "Please, Mbak Linh, do sit down. Forgive me, my home is humble.",
      },
      {
        cell_id: "27f14a7a-d499-4df4-b050-6986752182f5",
        speaker: "Linh",
        text: "Terima kasih, Pak. Rumahnya justru terasa hangat. Saya jadi sungkan merepotkan.",
        vi: "Cảm ơn anh. Nhà mình thật ấm cúng. Tôi lại thấy ngại làm phiền.",
        en: "Thank you, sir. Your home feels warm, actually. Now I feel reluctant to be a bother.",
      },
      {
        cell_id: "a9ab7694-609e-4045-aa18-7da96cc23a1e",
        speaker: "Bu Euis (Sunda)",
        text: "Ih, teu kenging sungkan atuh, Teh. Di sini mah kita guyub, anggap rumah sendiri.",
        vi: "Ấy, đừng ngại mà chị. Ở đây mình gắn bó, cứ coi như nhà mình.",
        en: "Oh, no need to feel shy, sis. Here we're close-knit — treat it as your own home.",
      },
      {
        cell_id: "ca91cce1-46cc-4bec-8a3c-a55a9b5dcc03",
        speaker: "Linh",
        text: "Baik, Teh. Saya perhatikan 'atuh' tadi — itu khas Sunda, ya?",
        vi: "Vâng chị. Tôi để ý chữ « atuh » lúc nãy — đó là đặc trưng Sunda phải không?",
        en: "All right, sis. I noticed the 'atuh' just now — that's distinctly Sundanese, right?",
      },
      {
        cell_id: "6fd50dcf-f623-4b87-83a6-15d29d81a79e",
        speaker: "Bu Euis",
        text: "Pinter, Teh! 'Atuh' itu nempel di mana-mana kalau orang Sunda ngomong, walau pakai bahasa Indonesia.",
        vi: "Giỏi đó chị! « Atuh » dính khắp nơi khi người Sunda nói, dù dùng tiếng Indonesia.",
        en: "Sharp, sis! 'Atuh' sticks everywhere when a Sundanese person talks, even in Indonesian.",
      },
    ],
    cultural_notes_vi:
      "Indonesia có hơn 700 ngôn ngữ; tiếng Indonesia là « lingua franca » trung lập đặt lên trên chúng. Người nói C1 cần đọc được các « tầng vùng miền » thấm vào tiếng Indonesia chuẩn:\n\n(1) JAVA (Jawa) — đông nhất. Tiếng Java có hệ « cấp độ lời nói » phức tạp: « ngoko » (suồng sã) vs « krama » (kính cẩn). Phản xạ này tràn vào tiếng Indonesia của người Java: họ làm mềm bằng « monggo » (mời), tự hạ mình (« rumah saya sederhana »), và cảm thấy « sungkan » (ngại vì nể) — một khái niệm Java giờ đã thành tiếng Indonesia chuẩn. Xưng hô: « Mas » (anh), « Mbak » (chị).\n\n(2) SUNDA (Tây Java) — lớn thứ hai. Dấu hiệu dễ nhận: tiểu từ cuối câu « atuh », « euy », « mah », « teh »; xưng hô « Aa » (anh), « Teteh/Teh » (chị); âm « eu » (như 'ơ' Việt) trong tên (Euis, Cecep). Người Sunda nổi tiếng nói nhẹ nhàng, hay đùa.\n\n(3) TỪ VAY MƯỢN ĐÃ THÀNH CHUẨN. Nhiều từ gốc Java/Sunda đã vào tiếng Indonesia toàn quốc: « guyub » (gắn bó cộng đồng), « sungkan » (nể ngại), « lugu » (chất phác), « gede » (to, gaul). Biết gốc của chúng giúp đọc đúng sắc thái.\n\n(4) ĐỪNG GIẢ GIỌNG. Người ngoài bắt chước « atuh » hay krama Java có thể bị xem là nhại. An toàn ở C1 là: NHẬN RA và HIỂU, đáp lại bằng tiếng Indonesia chuẩn lịch sự, và chỉ dùng vài từ vùng miền (« monggo », « matur nuwun » = cảm ơn tiếng Java) khi đã thân và đúng ngữ cảnh.\n\nLợi thế cho người Việt: ý niệm « nể », « ngại làm phiền » (sungkan) rất gần văn hóa Việt. Bạn đã có sẵn bản năng đó — chỉ cần gắn nhãn ngôn ngữ.",
    cultural_notes_en:
      "Indonesia has 700+ languages; Indonesian is the neutral lingua franca laid over them. A C1 speaker must read the 'regional layers' that seep into standard Indonesian:\n\n(1) JAVANESE (Jawa) — the largest group. Javanese has elaborate 'speech levels': 'ngoko' (casual) vs 'krama' (deferential). That reflex spills into a Javanese person's Indonesian: they soften with 'monggo' (please/go ahead), self-deprecate ('rumah saya sederhana' — my home is humble), and feel 'sungkan' (deferential reluctance) — a Javanese concept now fully standard Indonesian. Address terms: 'Mas' (older brother), 'Mbak' (older sister).\n\n(2) SUNDANESE (West Java) — the second largest. Easy tells: sentence-final particles 'atuh', 'euy', 'mah', 'teh'; address terms 'Aa' (older brother), 'Teteh/Teh' (older sister); the 'eu' vowel (like Vietnamese 'ơ') in names (Euis, Cecep). Sundanese speakers are known for a gentle, joking manner.\n\n(3) LOANS NOW STANDARD. Many Javanese/Sundanese-rooted words are nationwide Indonesian: 'guyub' (communal cohesion), 'sungkan' (deferential reluctance), 'lugu' (naive/plain), 'gede' (big, colloquial). Knowing their origin helps you read the nuance.\n\n(4) DON'T FAKE THE ACCENT. An outsider mimicking 'atuh' or Javanese krama can read as mockery. The safe C1 stance: RECOGNIZE and UNDERSTAND, reply in polite standard Indonesian, and only use a few regional words ('monggo', 'matur nuwun' = thank you in Javanese) once you're close and the context fits.\n\nEdge for Vietnamese speakers: 'sungkan' — deference, reluctance to impose — is very close to Vietnamese feeling. You already have the instinct; you just need the language label.",
    tip_advice_vi:
      "Chiến lược C1 để xử lý ngôn ngữ vùng miền mà không lạc bước:\n\n(1) NHẬN DIỆN, ĐỪNG NHÁI. Học các dấu hiệu để ĐOÁN gốc người nói: « atuh/teh » → Sunda; « monggo/mas/mbak » → Java; « bli/gus » → Bali; giọng nhấn mạnh, thẳng → Batak/Medan. Dùng để điều chỉnh sự lịch sự của BẠN, không để bắt chước họ.\n\n(2) HỌC 5 TỪ VÙNG AN TOÀN dùng được toàn quốc: « monggo » (mời, Java), « matur nuwun » (cảm ơn, Java), « hatur nuhun » (cảm ơn, Sunda), « sungkan » (nể ngại), « guyub » (gắn bó). Năm từ này được hiểu khắp nơi và cho thấy bạn tinh ý.\n\n(3) XƯNG HÔ THEO VÙNG. Khi biết người đối diện là Java → « Mas/Mbak »; Sunda → « Aa/Teteh »; chung/an toàn → « Mas/Mbak » hoặc « Pak/Bu ». Xưng hô đúng vùng tạo thiện cảm tức thì.\n\n(4) ĐỌC SỰ TỰ HẠ. Khi người Java nói « rumah saya jelek » (nhà tôi xấu) hay « masakan saya tidak enak » (món tôi nấu dở), ĐỪNG đồng ý! Đó là khiêm tốn nghi thức. Đáp: « Ah, tidak, justru… ». Người Việt quen điều này — phản xạ tương tự.\n\n(5) KHI BỊ HỎI « ASLI MANA? » (gốc ở đâu?). Đây là câu xã giao phổ biến, không tọc mạch. Trả lời thẳng (« Saya dari Vietnam ») thường mở ra thiện cảm và tò mò tích cực.\n\nBẪY: nói « lu/gue » với người lớn tuổi Java — họ có thể thấy « kasar » (thô). Khi chưa chắc, dùng « saya » + « Bapak/Ibu/Mas/Mbak ».",
    tip_advice_en:
      "C1 strategy for handling regional language without missteps:\n\n(1) RECOGNIZE, DON'T MIMIC. Learn the tells to GUESS a speaker's origin: 'atuh/teh' → Sundanese; 'monggo/mas/mbak' → Javanese; 'bli/gus' → Balinese; emphatic, direct delivery → Batak/Medan. Use it to calibrate YOUR politeness, not to imitate them.\n\n(2) LEARN 5 SAFE REGIONAL WORDS usable nationwide: 'monggo' (please, Javanese), 'matur nuwun' (thank you, Javanese), 'hatur nuhun' (thank you, Sundanese), 'sungkan' (deferential reluctance), 'guyub' (cohesion). All five are widely understood and show you're perceptive.\n\n(3) ADDRESS BY REGION. Once you know the person is Javanese → 'Mas/Mbak'; Sundanese → 'Aa/Teteh'; neutral/safe → 'Mas/Mbak' or 'Pak/Bu'. Region-correct address earns instant warmth.\n\n(4) READ THE SELF-DEPRECATION. When a Javanese person says 'rumah saya jelek' (my house is ugly) or 'masakan saya tidak enak' (my cooking is bad), DON'T agree! It's ritual modesty. Reply: 'Ah, tidak, justru…' (Oh no, on the contrary…). Vietnamese speakers know this reflex well.\n\n(5) WHEN ASKED 'ASLI MANA?' (where are you originally from?). This is common small talk, not prying. Answer plainly ('Saya dari Vietnam') — it usually opens warmth and positive curiosity.\n\nTRAP: using 'lu/gue' with an older Javanese person — they may find it 'kasar' (coarse). When unsure, use 'saya' + 'Bapak/Ibu/Mas/Mbak'.",
    register_notes:
      "Tiếng Indonesia chuẩn là nền trung lập; từ vùng miền (« monggo », « atuh », « teh ») là gia vị, không thay nền. Người ngoài an toàn nhất khi NHẬN RA tầng vùng và đáp bằng tiếng Indonesia chuẩn lịch sự. « Sungkan », « guyub » đã là chuẩn — dùng tự do. Krama Java và tiểu từ Sunda thì chỉ dùng khi thân, đúng ngữ cảnh, tránh bị hiểu là nhại.",
    register_notes_en:
      "Standard Indonesian is the neutral base; regional words ('monggo', 'atuh', 'teh') are seasoning, not a replacement base. An outsider is safest RECOGNIZING the regional layer and replying in polite standard Indonesian. 'Sungkan', 'guyub' are already standard — use freely. Javanese krama and Sundanese particles are for close, well-judged contexts only, to avoid reading as mockery.",
    roleplay_prompts: [
      "Bạn được mời đến nhà một gia đình Java; chủ nhà tự hạ « rumahnya sederhana ». Đáp lễ độ, không đồng ý với lời tự hạ, và dùng đúng « Mas/Mbak ».",
      "Nghe một đoạn hội thoại có « atuh » và « teh »; xác định người nói gốc Sunda và giải thích bằng tiếng Indonesia các dấu hiệu bạn dựa vào.",
    ],
    roleplay_prompts_en: [
      "You're invited to a Javanese family's home; the host self-deprecates with 'rumahnya sederhana'. Reply politely, don't agree with the self-deprecation, and use correct 'Mas/Mbak'.",
      "Hear a snippet with 'atuh' and 'teh'; identify the speaker as Sundanese and explain in Indonesian which cues you relied on.",
    ],
  },

  // ── 5. Advanced affixation (memper-, -i, ke-…-an) ─────────────────────
  {
    id: "afiksasi_lanjut",
    level: "C1",
    category: "advanced_grammar",
    title_vi: "Phụ tố nâng cao: memper-, -i, và ke-…-an",
    title_en: "Advanced affixation: memper-, -i, and ke-…-an",
    sentences: [
      {
        en: "The new policy is meant to deepen cooperation, not merely to widen the network.",
        vi: "Chính sách mới nhằm làm sâu sắc thêm sự hợp tác, chứ không chỉ mở rộng mạng lưới.",
        pronunciation_focus: [
          "memperdalam → mem-per-DA-lam (memper- + dalam = 'làm sâu hơn'; nhấn DA)",
          "kerja sama → KER-ja SA-ma ('hợp tác'; hai từ rời)",
          "memperluas → mem-per-LU-as (memper- + luas = 'mở rộng hơn')",
        ],
        pronunciation_focus_en: [
          "memperdalam → 'mem-per-DA-lam' (memper- + dalam = to deepen)",
          "kerja sama → 'KER-ja SA-ma' (cooperation; two words)",
          "memperluas → 'mem-per-LOO-as' (memper- + luas = to widen)",
        ],
      },
      {
        en: "Please water the plants and tidy the desk before the guests arrive.",
        vi: "Xin tưới cây và dọn gọn bàn làm việc trước khi khách đến.",
        pronunciation_focus: [
          "menyirami → me-nyi-RA-mi (meN- + siram + -i = 'tưới lên'; -i = đối tượng/bề mặt)",
          "merapikan → me-ra-PI-kan (meN- + rapi + -kan vs -i: 'làm cho gọn')",
          "berdatangan → ber-da-TANG-an (ber-…-an = nhiều người cùng đến)",
        ],
        pronunciation_focus_en: [
          "menyirami → 'me-nyee-RA-mee' (meN- + siram + -i = to water; -i marks the surface/object)",
          "merapikan → 'me-ra-PEE-kan' (meN- + rapi + -kan = to tidy up)",
          "berdatangan → 'ber-da-TANG-an' (ber-…-an = many arriving together)",
        ],
      },
      {
        en: "The committee's indecision caused a delay that no one had anticipated.",
        vi: "Sự thiếu quyết đoán của hội đồng gây ra một sự chậm trễ mà không ai lường trước.",
        pronunciation_focus: [
          "ketidaktegasan → ke-ti-dak-te-GA-san (ke-…-an quanh 'tidak tegas'; danh từ hóa cả cụm)",
          "keterlambatan → ke-ter-lam-BA-tan (ke-…-an quanh 'terlambat'; nhấn BA)",
          "diantisipasi → di-an-ti-si-PA-si (di- bị động + antisipasi)",
        ],
        pronunciation_focus_en: [
          "ketidaktegasan → 'ke-tee-dak-te-GA-san' (ke-…-an nominalizing the whole 'tidak tegas')",
          "keterlambatan → 'ke-ter-lam-BA-tan' (ke-…-an around 'terlambat' = lateness)",
          "diantisipasi → 'dee-an-tee-see-PA-see' (di- passive + antisipasi)",
        ],
      },
    ],
    vocabulary: [
      {
        cell_id: "fbe2c075-1e2f-42a7-b807-8ed1a928f65d",
        word: "memperdalam",
        en: "to deepen (make more X)",
        vi: "làm sâu sắc thêm",
        pos: "v.",
        pronunciation_vi: "mem-per-DA-lam",
        pronunciation_en: "mem-per-DA-lam — memper- + adjective 'dalam'; the causative-intensive prefix",
      },
      {
        cell_id: "fe859c59-61b2-4176-bf61-dc7574bf3642",
        word: "memperbaiki",
        en: "to repair / improve",
        vi: "sửa chữa, cải thiện",
        pos: "v.",
        pronunciation_vi: "mem-per-ba-I-ki (memper- + baik + -i)",
        pronunciation_en: "mem-per-ba-EE-kee — memper- + baik + -i; note the irregular high-frequency form",
      },
      {
        cell_id: "54b5576b-e90c-449b-8fd1-1cdb00285b67",
        word: "mendatangi",
        en: "to come to / approach (a place/person)",
        vi: "đến chỗ ai, tới (đối tượng)",
        pos: "v.",
        pronunciation_vi: "men-da-TANG-i (meN- + datang + -i)",
        pronunciation_en: "men-da-TANG-ee — meN- + datang + -i; contrast 'datang ke' (intransitive)",
      },
      {
        cell_id: "3b0f1c1f-f457-4df6-8b44-071315504b66",
        word: "menanami",
        en: "to plant (a field) with",
        vi: "trồng (lên một mảnh đất)",
        pos: "v.",
        pronunciation_vi: "me-na-NA-mi (meN- + tanam + -i; 't' → 'n')",
        pronunciation_en: "me-na-NA-mee — meN- + tanam + -i; the -i marks the location being acted on",
      },
      {
        cell_id: "6eed368c-f745-47a0-ad93-15ba5b0fd10c",
        word: "kebersamaan",
        en: "togetherness / solidarity",
        vi: "sự gắn kết, ở bên nhau",
        pos: "n.",
        pronunciation_vi: "ke-ber-sa-MA-an (ke-…-an quanh 'bersama')",
        pronunciation_en: "ke-ber-sa-MA-an — ke-…-an around 'bersama'; abstract noun",
      },
      {
        cell_id: "c877fd67-5a66-4c5c-8bc7-6674aeef6f2e",
        word: "ketidakpastian",
        en: "uncertainty",
        vi: "sự bất định, không chắc chắn",
        pos: "n.",
        pronunciation_vi: "ke-ti-dak-pas-TI-an (ke-…-an quanh 'tidak pasti')",
        pronunciation_en: "ke-tee-dak-pas-TEE-an — ke-…-an nominalizing the negated 'tidak pasti'",
      },
      {
        cell_id: "b8f84ccb-1806-419a-ae97-d65e98c07e5f",
        word: "keberlanjutan",
        en: "sustainability / continuity",
        vi: "tính bền vững, sự tiếp nối",
        pos: "n.",
        pronunciation_vi: "ke-ber-lan-JU-tan (ke-…-an quanh 'berlanjut')",
        pronunciation_en: "ke-ber-lan-JOO-tan — ke-…-an around 'berlanjut'; the standard word for 'sustainability'",
      },
    ],
    content:
      "THREE AFFIX SYSTEMS THAT SEPARATE B2 FROM C1\n\n" +
      "1) memper- (and memper-…-kan / memper-…-i) — the intensive-causative.\n" +
      "   • memper- + ADJECTIVE = 'make more X': dalam (deep) → memperdalam (deepen); luas (wide) → memperluas (widen); kuat (strong) → memperkuat (strengthen); indah (beautiful) → memperindah (beautify).\n" +
      "   • memper- + NOUN = 'treat as / turn into': budak (slave) → memperbudak (to enslave); istri (wife) → memperistri (to take as wife).\n" +
      "   • memper-…-kan often = 'cause to be shown/done': memperkenalkan (to introduce, from kenal); mempertahankan (to defend/maintain, from tahan); mempertanyakan (to call into question, from tanya).\n" +
      "   • Note: meN- + per- already overlap in a few high-frequency irregulars — memperbaiki (repair) and mempelajari (study, from ajar) drop a syllable. Memorize these as units.\n\n" +
      "2) -i vs -kan — the suffix that trips up every learner.\n" +
      "   • -kan typically marks a MOVED OBJECT or a beneficiary: 'masukkan surat itu' (put the letter in — the letter moves); 'belikan saya kopi' (buy me a coffee — for me).\n" +
      "   • -i typically marks a LOCATION or SURFACE acted on, often repeatedly: 'masuki ruangan' (enter the room — the room is the location); 'sirami tanaman' (water the plants — onto them); 'datangi kantornya' (go to his office — the office is the goal).\n" +
      "   • Minimal pairs reveal the logic: 'menjatuhkan' (to drop/make fall — the thing moves) vs 'menjatuhi' (to fall upon / impose on — e.g. 'menjatuhi hukuman' = to impose a sentence). 'Menanamkan' (to instill — values into someone) vs 'menanami' (to plant a field with crops).\n\n" +
      "3) ke-…-an — the abstract nominalizer (and the accidental-passive).\n" +
      "   • Nominalizer: adjective/verb → abstract noun. bersama → kebersamaan (togetherness); pasti → kepastian (certainty); berlanjut → keberlanjutan (sustainability). This is the engine of formal/academic Indonesian — almost every abstract concept is a ke-…-an noun.\n" +
      "   • It even nominalizes negated phrases: tidak pasti → ketidakpastian (uncertainty); tidak adil → ketidakadilan (injustice); tidak tegas → ketidaktegasan (indecisiveness). C1 writers stack these freely.\n" +
      "   • SECOND function — the adversative/accidental passive: 'kehujanan' (caught in the rain), 'ketinggalan' (left behind), 'kemalingan' (to be robbed), 'kepanasan' (overheated). Here ke-…-an means something unwanted happened TO the subject. Same shape, different job — context disambiguates.",
    cultural_notes_vi:
      "Hệ phụ tố là « trái tim » của ngữ pháp Indonesia, và là ranh giới thật giữa B2 và C1. Người Việt có một lợi thế tâm lý: tiếng Việt KHÔNG có biến tố, nên bạn không bị thói quen chia động từ châu Âu cản trở — bạn học phụ tố như học một hệ « ghép từ » logic, gần với cách tiếng Việt ghép « làm + tính từ » (làm sâu, làm rộng). « Memperdalam » = « làm sâu hơn », tư duy rất Việt.\n\nĐiểm khác cốt lõi cần nội tâm hóa: trong tiếng Indonesia, phụ tố KHÔNG tùy chọn ở văn trang trọng. Nói « saya kasih tahu » (gaul) khác hẳn « saya memberitahukan » (chuẩn). Văn báo chí, học thuật, công sở Indonesia DÀY ĐẶC phụ tố — bỏ phụ tố nghe như trẻ con hoặc cực kỳ suồng sã. Ngược lại, bahasa gaul Jakarta CẮT phụ tố một cách hệ thống (« mikir » thay « memikirkan », « ngajarin » thay « mengajari »). Vì vậy làm chủ phụ tố cũng chính là làm chủ thang đo trang trọng.\n\nKe-…-an đặc biệt quan trọng: nó là cỗ máy sản xuất danh từ trừu tượng. Mọi bài luận, bài báo, diễn văn Indonesia đều xây trên các danh từ ke-…-an (« keadilan », « kebebasan », « keberlanjutan », « ketimpangan »). Không làm chủ nó thì không viết được văn nghị luận C1.",
    cultural_notes_en:
      "The affix system is the 'heart' of Indonesian grammar and the real B2→C1 boundary. Vietnamese speakers have a psychological edge: Vietnamese has NO inflection, so you carry no European verb-conjugation habit to fight — you can learn affixes as a logical 'word-building' system, close to how Vietnamese stacks 'làm + adjective' (làm sâu = make deep, làm rộng = make wide). 'Memperdalam' = 'make deeper' is a very Vietnamese way to think.\n\nThe core difference to internalize: in formal Indonesian, affixes are NOT optional. 'Saya kasih tahu' (colloquial) is worlds apart from 'saya memberitahukan' (standard). Indonesian journalism, academia, and office writing are DENSE with affixes — dropping them sounds childish or extremely casual. Conversely, Jakarta bahasa gaul systematically STRIPS affixes ('mikir' for 'memikirkan', 'ngajarin' for 'mengajari'). So mastering affixes is also mastering the formality dial.\n\nKe-…-an matters most: it is the abstract-noun factory. Every Indonesian essay, article, and speech is built on ke-…-an nouns ('keadilan' = justice, 'kebebasan' = freedom, 'keberlanjutan' = sustainability, 'ketimpangan' = inequality). Without command of it, you cannot write C1 argumentative prose.",
    tip_advice_vi:
      "Lộ trình làm chủ phụ tố nâng cao:\n\n(1) memper- — học theo công thức « làm + tính từ ». Lấy 10 tính từ thường (dalam, luas, kuat, baik, indah, kaya, mudah, sulit, cepat, dekat) và tạo dạng memper- cho từng cái. Tự kiểm: « memperkuat tim » (làm đội mạnh hơn) nghe tự nhiên không?\n\n(2) -i vs -kan — học theo CẶP TỐI THIỂU, không học rời. Mỗi gốc, ghi cả hai và nghĩa khác nhau:\n   • jatuh: menjatuhkan (làm rơi) / menjatuhi (giáng xuống, áp lên)\n   • tanam: menanamkan (gieo vào — giá trị) / menanami (trồng lên — mảnh đất)\n   • datang: mendatangkan (mang đến) / mendatangi (đến chỗ)\n   Quy tắc nhớ nhanh: « -kan = vật DI CHUYỂN hoặc người HƯỞNG »; « -i = ĐỊA ĐIỂM/BỀ MẶT bị tác động ».\n\n(3) ke-…-an — biến mọi khái niệm thành danh từ. Bài tập: lấy một đoạn báo Indonesia, gạch dưới mọi danh từ ke-…-an, đếm — bạn sẽ choáng vì mật độ. Rồi tự tạo: adil → keadilan, timpang → ketimpangan, tidak pasti → ketidakpastian.\n\n(4) PHÂN BIỆT ke-…-an danh từ vs ke-…-an « bị động rủi ». « Kehujanan » (bị mắc mưa) KHÔNG phải danh từ « sự mưa ». Ngữ cảnh + chủ ngữ người = nghĩa « bị », chủ ngữ trừu tượng = danh từ.\n\n(5) DỊCH NGƯỢC để luyện. Lấy một câu tiếng Việt trừu tượng (« Sự bất bình đẳng làm sâu sắc thêm sự bất ổn ») và buộc mình dùng phụ tố: « Ketimpangan memperdalam ketidakstabilan. » Một câu, ba phụ tố — đó là văn C1.\n\nBẪY: lạm dụng memper- với danh từ lạ hoặc tạo từ không tồn tại. Khi nghi ngờ, tra KBBI (từ điển chuẩn Indonesia) — không phải gốc nào cũng nhận mọi phụ tố.",
    tip_advice_en:
      "A roadmap to mastering advanced affixes:\n\n(1) memper- — learn it as 'make + adjective'. Take 10 common adjectives (dalam, luas, kuat, baik, indah, kaya, mudah, sulit, cepat, dekat) and build the memper- form of each. Self-check: does 'memperkuat tim' (strengthen the team) sound natural?\n\n(2) -i vs -kan — learn by MINIMAL PAIRS, never in isolation. For each root, note both and the difference:\n   • jatuh: menjatuhkan (to drop) / menjatuhi (to fall upon, impose)\n   • tanam: menanamkan (to instill — values) / menanami (to plant — a field)\n   • datang: mendatangkan (to bring in) / mendatangi (to go to)\n   Quick rule: '-kan = the thing MOVES or someone BENEFITS'; '-i = a LOCATION/SURFACE is acted on'.\n\n(3) ke-…-an — turn every concept into a noun. Exercise: take an Indonesian news paragraph, underline every ke-…-an noun, count — the density will surprise you. Then build your own: adil → keadilan, timpang → ketimpangan, tidak pasti → ketidakpastian.\n\n(4) DISTINGUISH noun ke-…-an from adversative ke-…-an. 'Kehujanan' (caught in the rain) is NOT the noun 'rain-ness'. Context + a human subject = the 'suffered' meaning; an abstract subject = the noun.\n\n(5) REVERSE-TRANSLATE to drill. Take an abstract Vietnamese/English sentence ('Inequality deepens instability') and force yourself to use affixes: 'Ketimpangan memperdalam ketidakstabilan.' One sentence, three affixes — that is C1 prose.\n\nTRAP: overusing memper- on odd nouns or inventing non-existent forms. When in doubt, check the KBBI (the standard Indonesian dictionary) — not every root accepts every affix.",
    exercises: [
      {
        type: "affix_choice",
        prompt_vi: "Chọn -i hoặc -kan: « Tolong (siram) ___ tanaman di teras. »",
        answer: "menyirami",
        explanation_vi: "« -i » vì cây là BỀ MẶT/đối tượng được tưới lên; « menyiramkan » sẽ cần một chất lỏng làm tân ngữ di chuyển (menyiramkan air).",
        explanation_en: "Use '-i' because the plants are the surface being watered onto. 'Menyiramkan' would require a moving liquid object (menyiramkan air = to pour water).",
      },
      {
        type: "nominalize",
        prompt_vi: "Danh từ hóa bằng ke-…-an: « tidak adil » → ___",
        answer: "ketidakadilan",
        explanation_vi: "ke- + [tidak adil] + -an. Ke-…-an bao quanh cả cụm phủ định để tạo danh từ « sự bất công ».",
        explanation_en: "ke- + [tidak adil] + -an. The circumfix wraps the whole negated phrase to form 'injustice'.",
      },
      {
        type: "memper_form",
        prompt_vi: "Tạo dạng memper-: « Kebijakan ini bertujuan (luas) ___ jangkauan pasar. »",
        answer: "memperluas",
        explanation_vi: "memper- + luas = « làm rộng hơn / mở rộng ». Tính từ luas thành động từ gây khiến.",
        explanation_en: "memper- + luas = 'to widen/expand'. The adjective 'luas' becomes a causative verb.",
      },
    ],
    register_notes:
      "Phụ tố đầy đủ = trang trọng/chuẩn; cắt phụ tố = gaul. « Memikirkan » (chuẩn) vs « mikirin » (gaul); « mengajari » (chuẩn) vs « ngajarin » (gaul). Văn học thuật, báo chí, công sở yêu cầu dạng đầy đủ. Ke-…-an là bắt buộc cho danh từ trừu tượng ở mọi văn nghị luận.",
    register_notes_en:
      "Full affixes = formal/standard; stripped affixes = colloquial. 'Memikirkan' (standard) vs 'mikirin' (gaul); 'mengajari' (standard) vs 'ngajarin' (gaul). Academic, journalistic, and office writing require the full forms. Ke-…-an is mandatory for abstract nouns in any argumentative text.",
    roleplay_prompts: [
      "Dịch sang tiếng Indonesia chuẩn, buộc dùng ít nhất ba phụ tố (memper-, -i hoặc -kan, ke-…-an): « Sự bất bình đẳng làm sâu sắc thêm sự bất ổn của xã hội. »",
      "Giải thích cho một bạn học sự khác nhau giữa « menanamkan » và « menanami » bằng hai câu ví dụ tự đặt.",
    ],
    roleplay_prompts_en: [
      "Translate into standard Indonesian using at least three affixes (memper-, -i or -kan, ke-…-an): 'Inequality deepens the instability of society.'",
      "Explain to a classmate the difference between 'menanamkan' and 'menanami' using two example sentences of your own.",
    ],
  },

  // ── 6. Essay writing ──────────────────────────────────────────────────
  {
    id: "menulis_esai",
    level: "C1",
    category: "fluency",
    title_vi: "Viết tiểu luận: luận điểm, lập luận, phản biện, kết",
    title_en: "Essay writing: thesis, argument, counterargument, conclusion",
    sentences: [
      {
        en: "This essay argues that universal access to education is less a matter of funding than of political will.",
        vi: "Tiểu luận này lập luận rằng tiếp cận giáo dục phổ cập ít là vấn đề kinh phí mà là vấn đề ý chí chính trị.",
        pronunciation_focus: [
          "berargumen → ber-ar-GU-men (ber- + argumen; nhấn GU)",
          "kemauan politik → ke-ma-U-an po-LI-tik (ke-…-an quanh 'mau' = ý chí)",
          "ketimbang → ke-tim-BANG ('hơn là, thay vì'; văn viết)",
        ],
        pronunciation_focus_en: [
          "berargumen → 'ber-ar-GOO-men' (to argue; ber- + argumen)",
          "kemauan politik → 'ke-ma-OO-an po-LEE-tik' (political will; ke-…-an around 'mau')",
          "ketimbang → 'ke-tim-BANG' (rather than; written register)",
        ],
      },
      {
        en: "Critics might counter that funding remains the decisive constraint; this objection, however, overlooks one fact.",
        vi: "Người phê bình có thể phản bác rằng kinh phí vẫn là ràng buộc quyết định; tuy nhiên phản bác này bỏ qua một sự thật.",
        pronunciation_focus: [
          "membantah → mem-ban-TAH (meN- + bantah; 'phản bác')",
          "kendala → ken-DA-la ('ràng buộc, trở ngại'; nhấn DA)",
          "mengabaikan → me-nga-bai-KAN (meN- + abai + -kan; 'bỏ qua, phớt lờ')",
        ],
        pronunciation_focus_en: [
          "membantah → 'mem-ban-TAH' (to refute; meN- + bantah)",
          "kendala → 'ken-DA-la' (constraint/obstacle)",
          "mengabaikan → 'me-nga-bai-KAN' (to overlook/ignore; meN- + abai + -kan)",
        ],
      },
      {
        en: "Taken together, the evidence points to a single, perhaps uncomfortable, conclusion.",
        vi: "Gộp lại, các bằng chứng chỉ về một kết luận duy nhất, có lẽ gây khó chịu.",
        pronunciation_focus: [
          "secara keseluruhan → se-CA-ra ke-se-lu-RU-han (ke-…-an quanh 'seluruh' = toàn thể)",
          "mengarah → me-nga-RAH (meN- + arah; 'hướng về')",
          "kesimpulan → ke-sim-PU-lan (ke-…-an quanh 'simpul' = kết luận)",
        ],
        pronunciation_focus_en: [
          "secara keseluruhan → 'se-CHA-ra ke-se-loo-ROO-han' (taken together; ke-…-an around 'seluruh')",
          "mengarah → 'me-nga-RAH' (to point toward; meN- + arah)",
          "kesimpulan → 'ke-sim-POO-lan' (conclusion; ke-…-an around 'simpul')",
        ],
      },
    ],
    vocabulary: [
      {
        cell_id: "f6ffa16e-ac6f-410f-82c8-117c416526ed",
        word: "esai argumentatif",
        en: "argumentative essay",
        vi: "tiểu luận nghị luận",
        pos: "n.",
        pronunciation_vi: "e-SAI ar-gu-men-ta-TIF",
        pronunciation_en: "e-SAI ar-goo-men-ta-TIF — note spelling 'esai', not 'essay'",
      },
      {
        cell_id: "99bd7ba7-a5d0-4aa6-97ac-8e62b3d29f28",
        word: "tesis / gagasan utama",
        en: "thesis / central idea",
        vi: "luận điểm / ý chính",
        pos: "n.",
        pronunciation_vi: "TÉ-sis / ga-GA-san u-TA-ma",
        pronunciation_en: "TEH-sis / ga-GA-san oo-TA-ma — the controlling claim of the essay",
      },
      {
        cell_id: "e3fc70ce-dee8-4d59-98b2-c2956ebcbf3e",
        word: "argumen tandingan",
        en: "counterargument",
        vi: "lập luận phản biện",
        pos: "n.",
        pronunciation_vi: "ar-GU-men tan-DING-an",
        pronunciation_en: "ar-GOO-men tan-DING-an — 'tanding' = to oppose/match",
      },
      {
        cell_id: "0f2b0ac1-565f-4c1a-80a8-71b9e6510fa0",
        word: "di satu sisi … di sisi lain",
        en: "on one hand … on the other",
        vi: "một mặt … mặt khác",
        pos: "phrase",
        pronunciation_vi: "di SA-tu SI-si … di SI-si LA-in",
        pronunciation_en: "dee SA-too SEE-see … dee SEE-see LA-in — balanced-view connector",
      },
      {
        cell_id: "e98b5352-de84-4f0e-8119-cc0727b9f168",
        word: "oleh karena itu",
        en: "therefore / for that reason",
        vi: "vì vậy, do đó",
        pos: "conj.",
        pronunciation_vi: "O-leh ka-RE-na I-tu",
        pronunciation_en: "O-leh ka-RE-na EE-too — formal conclusion connector",
      },
      {
        cell_id: "7d85bba6-53df-43d3-a758-3b8aa88dbceb",
        word: "menyoroti",
        en: "to highlight / spotlight",
        vi: "làm nổi bật, soi rọi",
        pos: "v.",
        pronunciation_vi: "me-nyo-RO-ti (meN- + sorot + -i; 's' → 'ny')",
        pronunciation_en: "me-nyo-RO-tee — meN- + sorot + -i; 'sorot' = beam of light",
      },
      {
        cell_id: "5904c6eb-502d-40a0-8e0f-279fc4f117b5",
        word: "menyimpulkan bahwa",
        en: "to conclude that",
        vi: "kết luận rằng",
        pos: "phrase",
        pronunciation_vi: "me-nyim-PUL-kan BAH-wa",
        pronunciation_en: "me-nyim-POOL-kan BAH-wa — the signpost that closes the argument",
      },
    ],
    content:
      "THE FOUR-MOVE INDONESIAN ARGUMENTATIVE ESSAY (esai argumentatif)\n\n" +
      "MOVE 1 — PENDAHULUAN (introduction): hook → context → THESIS.\n" +
      "  Standard thesis frame: 'Esai ini berargumen bahwa X, bukan Y.' (This essay argues that X, not Y.)\n" +
      "  Or: 'Tulisan ini berpendapat bahwa…' (This piece holds that…). End the intro with ONE sharp claim — Indonesian readers expect the thesis stated, not implied.\n\n" +
      "MOVE 2 — ARGUMEN (body): each paragraph = KLAIM → BUKTI → ANALISIS.\n" +
      "  Klaim (claim): 'Pertama, …' / 'Faktor utama adalah…'\n" +
      "  Bukti (evidence): 'Data BPS menunjukkan…' / 'Sebagai contoh, …' / 'Penelitian Sari (2019) menemukan…'\n" +
      "  Analisis (analysis): 'Hal ini menunjukkan bahwa…' / 'Artinya, …' — never let evidence stand without interpretation.\n" +
      "  Connectors that signal flow: 'selain itu' (moreover), 'lebih jauh lagi' (furthermore), 'akibatnya' (consequently).\n\n" +
      "MOVE 3 — ARGUMEN TANDINGAN (counterargument + rebuttal): the C1 differentiator.\n" +
      "  Concede first: 'Memang benar bahwa…' / 'Sebagian pihak berpendapat bahwa…' (It is true that… / Some argue that…).\n" +
      "  Then rebut: 'Namun, pandangan ini mengabaikan…' / 'Akan tetapi, argumen tersebut tidak memperhitungkan…' (However, this overlooks… / fails to account for…).\n" +
      "  A B2 essay only defends its side; a C1 essay stages and defeats the strongest opposing view.\n\n" +
      "MOVE 4 — SIMPULAN (conclusion): restate the thesis in new words → widen the implication → close.\n" +
      "  'Secara keseluruhan, bukti-bukti mengarah pada satu kesimpulan: …'\n" +
      "  'Dengan demikian, persoalan ini bukan sekadar soal X, melainkan soal Y.'\n" +
      "  End on the stakes, not a summary list — Indonesian conclusions often widen to a national or human implication ('demi masa depan generasi mendatang').",
    cultural_notes_vi:
      "Tiểu luận nghị luận (« esai argumentatif ») là thể loại trụ cột trong giáo dục đại học và báo chí quan điểm (« opini ») Indonesia — trang « Opini » của Kompas hay Tempo là mẫu vàng để học. Vài điểm văn hóa-tu từ C1:\n\n(1) LUẬN ĐIỂM PHẢI HIỆN. Khác văn nghị luận Việt đôi khi để luận điểm thấm dần, văn Indonesia chuẩn KỲ VỌNG bạn phát biểu « tesis » rõ ở cuối đoạn mở: « Esai ini berargumen bahwa… ». Để mơ hồ bị đọc là thiếu lập trường.\n\n(2) PHẢN BIỆN LÀ DẤU HIỆU TRƯỞNG THÀNH. Văn C1 Indonesia luôn dựng « argumen tandingan » rồi bác lại (« Memang benar… Namun… »). Bỏ qua phản biện làm bài nghị luận thành bài cổ động một chiều — điểm thấp ở đại học.\n\n(3) DỮ LIỆU + NGUỒN. Văn opini Indonesia trọng số liệu (« Data BPS… » — Cục Thống kê) và trích dẫn. Không bắt buộc trang trọng như học thuật, nhưng một con số đặt đúng chỗ thắng cả đoạn cảm tính.\n\n(4) KẾT MỞ RỘNG. Kết bài Indonesia hiếm khi chỉ tóm tắt; nó thường nâng lên tầm quốc gia hoặc nhân văn (« demi masa depan bangsa », « ini menyangkut keadilan bagi semua »). Giọng này, người Việt thấy quen — văn nghị luận Việt cũng hay kết bằng tầm vóc lớn.\n\n(5) NGÔI XƯNG. Văn nghị luận chuẩn dùng « penulis » (người viết) hoặc thể bị động vô nhân (« dapat disimpulkan bahwa ») thay vì « saya » dày đặc. « Saya » dùng được nhưng tiết chế, để giữ giọng khách quan.\n\nLợi thế cho người Việt: cấu trúc luận điểm–luận cứ–kết rất gần văn nghị luận trung học Việt. Cái mới chủ yếu là (a) bắt buộc dựng phản biện và (b) mật độ phụ tố ke-…-an trong từ vựng trừu tượng.",
    cultural_notes_en:
      "The argumentative essay ('esai argumentatif') is a pillar genre in Indonesian higher education and opinion journalism ('opini') — the Opinion pages of Kompas and Tempo are the gold standard to study. C1 culture-rhetoric points:\n\n(1) THE THESIS MUST BE EXPLICIT. Unlike Vietnamese argumentation, which sometimes lets the claim emerge gradually, standard Indonesian EXPECTS a clear 'tesis' at the end of the intro: 'Esai ini berargumen bahwa…'. Leaving it implicit reads as having no position.\n\n(2) THE COUNTERARGUMENT SIGNALS MATURITY. C1 Indonesian writing always stages an 'argumen tandingan' and rebuts it ('Memang benar… Namun…'). Skipping it turns the essay into one-sided advocacy — a low grade at university.\n\n(3) DATA + SOURCES. Indonesian opinion writing values figures ('Data BPS…' — the Central Statistics Agency) and citations. Less formal than academia, but one well-placed number beats a paragraph of feeling.\n\n(4) WIDENING CONCLUSIONS. Indonesian conclusions rarely just summarize; they usually rise to a national or humanistic stake ('demi masa depan bangsa', 'ini menyangkut keadilan bagi semua'). Vietnamese writers will find this familiar — Vietnamese argumentation also closes on grand significance.\n\n(5) PERSON. Standard argumentation uses 'penulis' (the writer) or the impersonal passive ('dapat disimpulkan bahwa') rather than dense 'saya'. 'Saya' is allowed but used sparingly to keep an objective voice.\n\nEdge for Vietnamese speakers: the claim–evidence–conclusion structure is very close to Vietnamese secondary-school argumentation. What's new is mainly (a) the obligatory counterargument and (b) the density of ke-…-an affixed abstract vocabulary.",
    tip_advice_vi:
      "Khung viết esai argumentatif C1 trong 4 nước đi (làm dàn ý trước khi viết):\n\n(1) PENDAHULUAN: câu mở gây chú ý (số liệu sốc / câu hỏi) → 2 câu bối cảnh → MỘT câu tesis: « Esai ini berargumen bahwa X, bukan Y. » Viết câu tesis TRƯỚC TIÊN, cả bài phục vụ nó.\n\n(2) TIGA PARAGRAF ARGUMEN, mỗi đoạn một lý do, theo KLAIM → BUKTI → ANALISIS:\n   - Klaim: « Pertama / Kedua / Ketiga, … »\n   - Bukti: « Data … menunjukkan » / « Sebagai contoh »\n   - Analisis: « Hal ini berarti bahwa… » (ĐỪNG để số liệu trần — luôn diễn giải)\n\n(3) MỘT PARAGRAF PHẢN BIỆN: « Memang benar bahwa [quan điểm đối lập mạnh nhất]. Namun, pandangan ini mengabaikan [điểm bạn]. » Đây là đoạn nâng bạn lên C1.\n\n(4) SIMPULAN: nhắc lại tesis bằng từ mới → mở rộng tầm vóc → chốt: « Dengan demikian, persoalan ini bukan sekadar soal X, melainkan soal Y. »\n\nTỪ NỐI BẮT BUỘC: selain itu (ngoài ra), lebih jauh lagi (hơn nữa), akibatnya (do đó), di sisi lain (mặt khác), oleh karena itu (vì vậy), pada akhirnya (rốt cuộc).\n\nTỪ VỰNG TRỪU TƯỢNG = ke-…-an: keadilan, kesetaraan, keberlanjutan, ketimpangan, kebijakan. Một đoạn nghị luận hay dày đặc các danh từ này.\n\nBẪY:\n- Bài chỉ một chiều (thiếu argumen tandingan) → tự động xuống một bậc.\n- Trộn gaul (« banget », « nggak », « gue ») vào văn esai → vỡ giọng.\n- Số liệu không nguồn → mất tin cậy; ghi « menurut … » nếu nhớ nguồn, hoặc bỏ.\n\nLuyện: lấy một đề (« Apakah media sosial merusak demokrasi? »), viết DÀN Ý 4 nước đi trong 10 phút trước khi viết câu nào.",
    tip_advice_en:
      "A C1 argumentative-essay frame in four moves (outline before you write):\n\n(1) PENDAHULUAN: a hook (a striking statistic / a question) → 2 sentences of context → ONE thesis sentence: 'Esai ini berargumen bahwa X, bukan Y.' Write the thesis FIRST; the whole essay serves it.\n\n(2) THREE ARGUMENT PARAGRAPHS, one reason each, as KLAIM → BUKTI → ANALISIS:\n   - Claim: 'Pertama / Kedua / Ketiga, …'\n   - Evidence: 'Data … menunjukkan' / 'Sebagai contoh'\n   - Analysis: 'Hal ini berarti bahwa…' (never leave evidence bare — always interpret)\n\n(3) ONE COUNTERARGUMENT PARAGRAPH: 'Memang benar bahwa [the strongest opposing view]. Namun, pandangan ini mengabaikan [your point].' This paragraph is what lifts you to C1.\n\n(4) SIMPULAN: restate the thesis in new words → widen the stakes → close: 'Dengan demikian, persoalan ini bukan sekadar soal X, melainkan soal Y.'\n\nESSENTIAL CONNECTORS: selain itu (moreover), lebih jauh lagi (furthermore), akibatnya (consequently), di sisi lain (on the other hand), oleh karena itu (therefore), pada akhirnya (ultimately).\n\nABSTRACT VOCABULARY = ke-…-an: keadilan (justice), kesetaraan (equality), keberlanjutan (sustainability), ketimpangan (inequality), kebijakan (policy). Good argumentative prose is dense with these nouns.\n\nTRAPS:\n- A one-sided essay (no counterargument) → automatically one grade lower.\n- Mixing gaul ('banget', 'nggak', 'gue') into essay prose → shattered voice.\n- Unsourced figures → lost credibility; write 'menurut …' if you recall the source, or cut it.\n\nDrill: take a prompt ('Apakah media sosial merusak demokrasi?' = Does social media damage democracy?) and write a 4-move OUTLINE in 10 minutes before writing a single sentence.",
    exercises: [
      {
        type: "thesis_frame",
        prompt_vi: "Viết một câu tesis cho đề « Apakah pariwisata massal merugikan Bali? » dùng khung « berargumen bahwa X, bukan Y ».",
        sample_answer: "Esai ini berargumen bahwa kerusakan Bali lebih disebabkan oleh lemahnya tata kelola, bukan oleh jumlah wisatawan itu sendiri.",
        explanation_vi: "Khung « X, bukan Y » buộc luận điểm sắc và có lập trường: đổ lỗi cho quản trị (tata kelola) thay vì số lượng khách.",
        explanation_en: "The 'X, not Y' frame forces a sharp, positioned claim: it blames governance ('tata kelola') rather than tourist numbers.",
      },
      {
        type: "counterargument",
        prompt_vi: "Hoàn thành đoạn phản biện: « Memang benar bahwa pariwisata massal menambah sampah dan kemacetan. Namun, ___ »",
        sample_answer: "Namun, pandangan ini mengabaikan fakta bahwa daerah dengan tata kelola kuat mampu menampung jumlah wisatawan yang sama tanpa kerusakan serupa.",
        explanation_vi: "Nhượng bộ trước (« Memang benar »), rồi bác bằng « Namun, pandangan ini mengabaikan… » — đúng cú pháp phản biện C1.",
        explanation_en: "Concede first ('Memang benar'), then rebut with 'Namun, pandangan ini mengabaikan…' — the C1 counterargument syntax.",
      },
    ],
    register_notes:
      "Văn esai = chuẩn, đầy phụ tố, đại từ tiết chế (« penulis » / bị động vô nhân). Liên từ đầy đủ (« oleh karena itu », không « jadi »). Tuyệt đối không gaul. Số liệu nên có nguồn. Kết mở rộng tầm vóc là chuẩn mực, không phải tùy chọn.",
    register_notes_en:
      "Essay register = standard, affix-dense, sparing pronouns ('penulis' / impersonal passive). Full connectors ('oleh karena itu', not 'jadi'). No gaul whatsoever. Figures should be sourced. A stakes-widening conclusion is the norm, not optional.",
    roleplay_prompts: [
      "Cho đề « Apakah kerja jarak jauh baik bagi produktivitas? », viết dàn ý 4 nước đi (pendahuluan + tesis / 3 argumen / argumen tandingan / simpulan) trong 10 phút.",
      "Lấy một đoạn nghị luận một chiều và thêm vào một đoạn « argumen tandingan » đúng công thức « Memang benar… Namun, pandangan ini mengabaikan… ».",
    ],
    roleplay_prompts_en: [
      "For the prompt 'Is remote work good for productivity?', write a 4-move outline (intro + thesis / 3 arguments / counterargument / conclusion) in 10 minutes.",
      "Take a one-sided argumentative paragraph and add an 'argumen tandingan' paragraph following 'Memang benar… Namun, pandangan ini mengabaikan…'.",
    ],
  },
];

export default lessons;
