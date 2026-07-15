// src/languages/indonesian/lessons-c2.ts
//
// Indonesian (Bahasa Indonesia) C2 lessons for Vietnamese learners.
// Native-mastery pack: literary close reading (analisis sastra), classical
// poetry (pantun & gurindam), political/public discourse (wacana politik),
// legal-bureaucratic register (bahasa hukum & birokrasi), and humor, satire,
// dialectal awareness + native-level fluency markers.
//
// Shape mirrors the Portuguese pack (src/languages/portuguese/lessons-c2.ts)
// and the sibling Indonesian files (lessons-a1 … lessons-c1) so the page UI
// stays consistent across language verticals. The type surface is declared
// inline here, structurally compatible with the others so a future shared
// registry can swap the inline types for
// `import type { IndonesianLesson } from "./lessons";`.
//
// Standard Bahasa Indonesia (bahasa baku) throughout, with notes on colloquial
// Jakarta usage where a C2 speaker must recognize the register difference.
// C2 means native-level command: irony, subtext, formal/erudite register, and
// the ability to read between the lines of a pantun or a legal clause.
// Hand-crafted; no AI filler. Vietnamese L1 notes (cultural_notes_vi,
// tip_advice_vi, pronunciation_vi) + English companions (pronunciation_focus_en,
// *_en).
//
// Indonesian uses the Latin alphabet — no special script rendering needed.
// Phonetic reminders baked into the pronunciation hints for Vietnamese
// speakers: 'c' = "ch", 'j' = "gi/j", 'ny' = "nh", 'ng' = Vietnamese "ng"
// (including word-initially), 'sy' = "s(h)", and stress falls on the
// penultimate syllable. The 'e' is either a schwa (ə, written here as "ơ")
// or an open "é" — context-dependent, flagged per word.

// ── Inline type surface (mirrors PortugueseLesson / sibling ID files) ────────

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  // English-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields can vary. Known optional fields:
//   fill-blank:  question, answer, hint_vi?, hint_en?
//   matching:    pairs, instruction, instruction_en?
//   translation: vietnamese, indonesian, english?, hint_vi?, hint_en?
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
  // Calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: IndonesianDialogueLine[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
  idiom_glosses?: {
    idiom: string;
    literal: string;
    literal_en?: string;
    meaning: string;
    meaning_en?: string;
    example: string;
    example_en?: string;
  }[];
};

// ── Lessons ─────────────────────────────────────────────────────────────────

export const lessons: IndonesianLesson[] = [
  // ── 1. Literary close reading — analisis sastra ──────────────────────────
  {
    id: "indonesian_c2_analisis_sastra",
    level: "C2",
    category: "literature",
    title_vi: "Phân tích văn học: đọc kỹ một trang văn (analisis sastra)",
    title_en: "Literary close reading: analyzing a literary passage",
    sentences: [
      {
        en: "Pramoedya tidak menjelaskan perasaan tokohnya; ia membiarkan tindakan kecil yang berbicara.",
        vi: "Pramoedya không giải thích cảm xúc của nhân vật; ông để cho những hành động nhỏ tự lên tiếng.",
        pronunciation_focus: ["menjelaskan→mơn-jơ-LAS-kan", "tokohnya→TO-koh-nya", "membiarkan→mơm-bi-AR-kan", "berbicara→bơr-bi-CHA-ra"],
        pronunciation_focus_en: [
          "menjelaskan→muhn-juh-LAS-kan — 'me-' prefix is schwa; 'j' = English 'j'",
          "tokohnya→TOH-koh-nyah — '-nya' = 'nyah'; 'ny' like Spanish ñ",
          "membiarkan→muhm-bee-AR-kan — 'mem-' + biar + '-kan'; stress on 'AR'",
          "berbicara→bur-bee-CHA-ra — 'ber-' prefix; 'c' = 'ch' as in church",
        ],
      },
      {
        en: "Perhatikan ironi sang narator, yang seakan memuji tokoh justru pada saat ia membongkar kepalsuannya.",
        vi: "Hãy chú ý sự mỉa mai của người kể, kẻ dường như khen ngợi nhân vật ngay đúng lúc lột trần sự giả dối của cô ta.",
        pronunciation_focus: ["perhatikan→pơr-ha-TI-kan", "ironi→i-RO-ni", "memuji→mơ-MU-ji", "kepalsuannya→kơ-pal-su-AN-nya"],
        pronunciation_focus_en: [
          "perhatikan→pur-ha-TEE-kan — 'h' is lightly aspirated; stress 'TI'",
          "ironi→ee-ROH-nee — loanword; clean vowels, stress on 'RO'",
          "memuji→muh-MOO-jee — 'j' = 'j'; = to praise",
          "kepalsuannya→kuh-pal-soo-AN-nyah — ke-...-an = abstraction; = the falseness",
        ],
      },
      {
        en: "Kalimat yang sengaja dipenggal itu menunda makna, memaksa pembaca menahan napas sampai titik.",
        vi: "Câu văn bị cố ý ngắt quãng ấy trì hoãn ý nghĩa, buộc người đọc nín thở cho đến dấu chấm.",
        pronunciation_focus: ["sengaja→sơ-NGA-ja", "dipenggal→di-PƠNG-gal", "menunda→mơ-NUN-da", "pembaca→pơm-BA-cha"],
        pronunciation_focus_en: [
          "sengaja→suh-NGA-ja — 'ng' mid-word; stress on 'NGA'; = on purpose",
          "dipenggal→dee-PUNG-gal — 'di-' passive prefix; 'ngg' = 'ng-g'",
          "menunda→muh-NOON-da — = to postpone/delay",
          "pembaca→pum-BA-cha — pe- + baca; 'c' = 'ch'; = the reader",
        ],
      },
      {
        en: "Jauh dari sekadar hiasan, metafora itu menata seluruh paragraf dan mengisyaratkan akhir cerita.",
        vi: "Khác xa chuyện chỉ là trang trí, phép ẩn dụ ấy kiến tạo toàn bộ đoạn văn và báo trước kết cục.",
        pronunciation_focus: ["sekadar→sơ-KA-dar", "hiasan→hi-A-san", "metafora→mơ-ta-FO-ra", "mengisyaratkan→mơ-ngi-sya-RAT-kan"],
        pronunciation_focus_en: [
          "sekadar→suh-KA-dar — 'sekadar' = merely/just",
          "hiasan→hee-A-san — hias + -an; = ornament/decoration",
          "metafora→muh-ta-FOH-ra — loanword; stress on 'FO'",
          "mengisyaratkan→muh-ngee-sya-RAT-kan — 'meng-' before vowel; 'sy' = 'sh'",
        ],
      },
      {
        en: "Boleh kita bertanya: bukankah diamnya tokoh itu, pada akhirnya, berkata lebih banyak daripada kata-kata?",
        vi: "Có lẽ ta nên hỏi: chẳng phải sự im lặng của nhân vật, rốt cuộc, nói lên nhiều hơn cả lời nói hay sao?",
        pronunciation_focus: ["bertanya→bơr-TA-nya", "bukankah→bu-KAN-kah", "diamnya→di-AM-nya", "daripada→da-ri-PA-da"],
        pronunciation_focus_en: [
          "bertanya→bur-TA-nyah — ber- + tanya; = to ask",
          "bukankah→boo-KAN-kah — '-kah' = rhetorical question marker",
          "diamnya→dee-AM-nyah — diam + -nya; = its/his silence",
          "daripada→da-ree-PA-da — = than (in comparisons); fully spelled in formal text",
        ],
      },
    ],
    cultural_notes_vi:
      "ANALISIS SASTRA bậc đại học ở Indonesia (di fakultas sastra / Fakultas Ilmu Budaya) yêu cầu bạn BÌNH GIẢNG một đoạn (kutipan / petikan), KHÔNG kể lại cốt truyện (bukan meringkas alur). Sa vào 'penulis ingin mengatakan bahwa…' (tác giả muốn nói rằng…) là lỗi kinh điển — ta phân tích VĂN BẢN, không phải tâm trí tác giả.\n\nTÁC GIẢ KINH ĐIỂN cần biết tên: Pramoedya Ananta Toer (tứ tác phẩm Tetralogi Buru — Bumi Manusia…, bậc thầy hiện thực và lịch sử), Chairil Anwar (nhà thơ của Angkatan '45, bài 'Aku'), Sutan Takdir Alisjahbana, Sapardi Djoko Damono (thơ — 'Hujan Bulan Juni'), Andrea Hirata ('Laskar Pelangi'), Eka Kurniawan (hiện đại, 'Cantik Itu Luka'). Nhắc đúng tên cho thấy sự thành thạo văn hóa.\n\nGIAI ĐOẠN VĂN HỌC (angkatan): Balai Pustaka (thập niên 1920), Pujangga Baru (1930s), Angkatan '45 (sau độc lập), Angkatan '66, sastra kontemporer. Biết angkatan giúp 'contextualize' (kontekstualisasi) đoạn văn.\n\nCẤU TRÚC bài phân tích: (1) kontekstualisasi — đặt đoạn vào tác phẩm và angkatan; (2) analisis unsur — gaya bahasa (majas: metafora, ironi, personifikasi), sudut pandang (orang pertama/ketiga), tema, latar; (3) interpretasi — ý nghĩa nảy sinh TỪ hình thức.\n\nKHÁC BIỆT VỚI VIỆT NAM: giáo dục văn ở Việt thường tách 'nội dung' và 'nghệ thuật'. Truyền thống phê bình hiện đại coi BENTUK ADALAH MAKNA — hình thức CHÍNH LÀ nội dung. Majas không 'minh họa' một ý; nó SẢN SINH ý nghĩa.",
    cultural_notes_en:
      "University-level analisis sastra in Indonesia (in a Fakultas Ilmu Budaya) asks you to comment on an excerpt (kutipan/petikan) — NOT to retell the plot (bukan meringkas alur). The classic error is 'penulis ingin mengatakan bahwa…' (the author meant that…): you analyze the TEXT, not the author's mind. Canonical authors to name accurately: Pramoedya Ananta Toer (the Buru Tetralogy — Bumi Manusia), the poet Chairil Anwar (Angkatan '45, 'Aku'), Sapardi Djoko Damono, Andrea Hirata, Eka Kurniawan. Know the literary periods (angkatan): Balai Pustaka, Pujangga Baru, Angkatan '45, contemporary. Structure: kontekstualisasi → analysis of figures (majas) and point of view → interpretation that arises FROM the form. As in the French/Brazilian tradition, BENTUK ADALAH MAKNA — form IS content; a majas does not illustrate a point, it produces meaning.",
    tip_advice_vi:
      "CÔNG THỨC NHẬP ĐỀ (pendahuluan): 'Kutipan yang dianalisis, yang diambil dari [tác phẩm] karya [tác giả], berlatar [bối cảnh].' Rồi nêu trục đọc: 'Tulisan ini hendak menunjukkan bahwa…' (Bài này muốn chứng minh rằng…).\n\nTRÍCH DẪN VÀ BÌNH (mengutip lalu menafsirkan): đặt trích trong ngoặc kép rồi bình ngay: 'Frasa «[trích]» memperlihatkan…' / 'Perhatikan penggunaan…' (Hãy chú ý cách dùng…) / 'Narator memanfaatkan ironi untuk…' (Người kể dùng mỉa mai để…).\n\nTÊN GỌI MAJAS (gaya bahasa) cần thuộc: metafora (ẩn dụ), metonimia (hoán dụ), ironi (mỉa mai), personifikasi (nhân hóa), hiperbola (phóng đại), litotes (nói giảm), repetisi/anafora (điệp), antitesis (đối lập).\n\nKẾT LUẬN (simpulan): 'Singkatnya, jauh dari sekadar [hiểu nông], kutipan ini [ý sâu hơn].' / 'Analisis ini dapat diperluas ke [đoạn/tác phẩm khác].'\n\nTRÁNH: 'Ceritanya bagus sekali' (Truyện hay lắm) — phán xét cảm tính, không phân tích. 'Penulis ingin mengatakan' — ngụy biện về ý đồ. Tóm tắt cốt truyện thay vì bình giảng. Dán lý thuyết từ ngoài — bắt đầu từ CHỨNG CỨ trong văn bản trước.",
    tip_advice_en:
      "Intro formula: 'Kutipan yang dianalisis, yang diambil dari [work] karya [author], berlatar [setting].' then your reading axis: 'Tulisan ini hendak menunjukkan bahwa…' (This paper aims to show that…). Quote-then-gloss: 'Perhatikan penggunaan…' (Note the use of…), 'Narator memanfaatkan ironi untuk…'. Memorize the majas names: metafora, metonimia, ironi, personifikasi, hiperbola, litotes, antitesis. Conclude: 'Singkatnya, jauh dari sekadar [shallow], kutipan ini [deeper point].' Avoid 'Ceritanya bagus sekali' (sentimental, not analytical), 'Penulis ingin mengatakan' (intentional fallacy), plot summary, and bolting theory on from outside — start from textual evidence.",
    vocabulary: [
      { cell_id: "bebcb487-b555-4cbd-8367-92c6397dd5a7", word: "analisis sastra", en: "literary analysis", vi: "phân tích văn học", pos: "n.", pronunciation_vi: "a-NA-li-sis SAS-tra", pronunciation_en: "a-NA-lee-sis SAS-tra — both loanwords; clean vowels" },
      { cell_id: "a9bf3e59-1577-49c5-8319-a8b5d56dfbea", word: "kutipan", en: "the quotation / excerpt", vi: "đoạn trích, trích dẫn", pos: "n.", pronunciation_vi: "ku-TI-pan", pronunciation_en: "koo-TEE-pan — kutip + -an; the standard word for an excerpt" },
      { cell_id: "ccbf52a3-e799-4a77-ba95-129b3859caf3", word: "sudut pandang", en: "point of view / narrative stance", vi: "điểm nhìn, ngôi kể", pos: "n.", pronunciation_vi: "SU-dut PAN-dang", pronunciation_en: "SOO-doot PAN-dang — 'ng' nasal; orang pertama/ketiga" },
      { cell_id: "115624d4-31c8-42ab-8cc5-18a3f7eddf88", word: "majas", en: "figure of speech", vi: "biện pháp tu từ", pos: "n.", pronunciation_vi: "MA-jas", pronunciation_en: "MA-jas — umbrella term for all rhetorical figures" },
      { cell_id: "ce095b25-eeb6-42c5-9f59-1dbce83a58a3", word: "ironi", en: "irony", vi: "sự mỉa mai", pos: "n.", pronunciation_vi: "i-RO-ni", pronunciation_en: "ee-ROH-nee — saying X to mean the opposite" },
      { cell_id: "b713ac7f-86a6-45c5-9af8-0a671adb315e", word: "metafora", en: "metaphor", vi: "ẩn dụ", pos: "n.", pronunciation_vi: "mơ-ta-FO-ra", pronunciation_en: "muh-ta-FOH-ra" },
      { cell_id: "c0656f73-7603-479f-9b1e-dc0277a41659", word: "personifikasi", en: "personification", vi: "nhân hóa", pos: "n.", pronunciation_vi: "pơr-so-ni-fi-KA-si", pronunciation_en: "pur-so-nee-fee-KA-see" },
      { cell_id: "e179cc45-fe4b-4e53-a699-9be0e3e80aba", word: "alur", en: "plot", vi: "cốt truyện", pos: "n.", pronunciation_vi: "A-lur", pronunciation_en: "A-loor — what you must NOT just summarize" },
      { cell_id: "2bd37da3-c33d-44da-886b-dbd4368e1ef2", word: "latar", en: "setting (time/place)", vi: "bối cảnh", pos: "n.", pronunciation_vi: "LA-tar", pronunciation_en: "LA-tar — latar tempat/waktu" },
      { cell_id: "3d30b2ca-3958-4321-9c38-e3c04f69bf39", word: "menafsirkan", en: "to interpret", vi: "diễn giải, lý giải", pos: "v.", pronunciation_vi: "mơ-naf-SIR-kan", pronunciation_en: "muh-naf-SEER-kan — me- + tafsir + -kan" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Narator memanfaatkan ___ untuk berpura-pura memuji, padahal sebenarnya mengkritik tokoh.",
        answer: "ironi",
        hint_vi: "majas nói X nhưng ý là ngược lại",
        hint_en: "the figure of saying one thing to mean its opposite",
      },
      {
        type: "matching",
        pairs: [
          ["metafora", "ẩn dụ"],
          ["sudut pandang", "điểm nhìn"],
          ["personifikasi", "nhân hóa"],
          ["alur", "cốt truyện"],
        ],
        instruction: "Nối thuật ngữ phân tích văn học với nghĩa tiếng Việt.",
        instruction_en: "Match each literary-analysis term with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Khác xa chuyện chỉ là trang trí, phép ẩn dụ kiến tạo cả đoạn văn.",
        indonesian: "Jauh dari sekadar hiasan, metafora itu menata seluruh paragraf.",
        english: "Far from being mere ornament, the metaphor structures the whole paragraph.",
        hint_vi: "'jauh dari sekadar' = khác xa chuyện chỉ là; mở đầu mạnh cho một luận điểm",
        hint_en: "'jauh dari sekadar' = far from being merely; a strong way to open an analytic point",
      },
    ],
  },

  // ── 2. Classical poetry — pantun & gurindam ──────────────────────────────
  {
    id: "indonesian_c2_pantun_gurindam",
    level: "C2",
    category: "poetry",
    title_vi: "Thơ cổ điển: pantun và gurindam — vần luật và hàm ý",
    title_en: "Classical poetry: pantun and gurindam — form and hidden meaning",
    sentences: [
      {
        en: "A pantun has four lines: the first two (sampiran) set the imagery, the last two (isi) carry the message.",
        vi: "Một bài pantun có bốn câu: hai câu đầu (sampiran) dựng hình ảnh, hai câu cuối (isi) chở thông điệp.",
        pronunciation_focus: ["pantun→PAN-tun", "sampiran→sam-PI-ran", "isi→I-si", "pesan→PƠ-san"],
        pronunciation_focus_en: [
          "pantun→PAN-toon — the four-line quatrain form; stress on 'PAN'",
          "sampiran→sam-PEE-ran — lines 1-2, the 'setup' imagery",
          "isi→EE-see — literally 'contents'; lines 3-4, the point",
          "pesan→PUH-san — 'e' = schwa here; = the message",
        ],
      },
      {
        en: "Rhyme follows an a-b-a-b pattern, and a true master makes the imagery quietly mirror the message.",
        vi: "Vần theo lối a-b-a-b, và một bậc thầy thực thụ khiến hình ảnh lặng lẽ soi chiếu thông điệp.",
        pronunciation_focus: ["rima→RI-ma", "berpola→bơr-PO-la", "mencerminkan→mơn-chơr-MIN-kan", "halus→HA-lus"],
        pronunciation_focus_en: [
          "rima→REE-ma — = rhyme; loanword, clean vowels",
          "berpola→bur-POH-la — ber- + pola; = patterned",
          "mencerminkan→mun-chur-MIN-kan — 'c' = 'ch'; = to mirror/reflect",
          "halus→HA-loos — = subtle/refined; the prized quality",
        ],
      },
      {
        en: "Berakit-rakit ke hulu, berenang-renang ke tepian — bersakit-sakit dahulu, bersenang-senang kemudian.",
        vi: "Chèo bè ngược dòng, bơi mãi vào bờ — chịu khổ trước, hưởng vui sau (một pantun nổi tiếng).",
        pronunciation_focus: ["berakit→bơ-ra-KIT", "hulu→HU-lu", "bersakit→bơr-sa-KIT", "kemudian→kơ-mu-DI-an"],
        pronunciation_focus_en: [
          "berakit-rakit→buh-ra-KEET RA-keet — reduplicated; = rafting along",
          "hulu→HOO-loo — = upstream (vs hilir, downstream)",
          "bersakit-sakit→bur-sa-KEET SA-keet — = suffering for a while",
          "kemudian→kuh-moo-DEE-an — = later/afterwards; the famous moral",
        ],
      },
      {
        en: "A gurindam is a two-line couplet where the first line states a condition and the second its consequence.",
        vi: "Gurindam là cặp câu hai dòng: dòng đầu nêu điều kiện, dòng sau nêu hệ quả.",
        pronunciation_focus: ["gurindam→gu-RIN-dam", "syarat→SYA-rat", "akibat→a-ki-BAT", "baris→BA-ris"],
        pronunciation_focus_en: [
          "gurindam→goo-RIN-dam — the moralistic couplet form",
          "syarat→SYA-rat — 'sy' = 'sh'; = condition/requirement",
          "akibat→a-kee-BAT — = consequence/result",
          "baris→BA-rees — = line (of verse)",
        ],
      },
      {
        en: "Raja Ali Haji's Gurindam Dua Belas remains the canonical model of the moral couplet.",
        vi: "Tập 'Gurindam Dua Belas' của Raja Ali Haji vẫn là mẫu mực kinh điển của thể song thất đạo lý.",
        pronunciation_focus: ["Raja→RA-ja", "dua belas→DU-a bơ-LAS", "kanonik→ka-NO-nik", "moral→mo-RAL"],
        pronunciation_focus_en: [
          "Raja→RA-ja — = king/raja; the 19th-c. Riau poet's title",
          "dua belas→DOO-a buh-LAS — = twelve (the 12 couplets)",
          "kanonik→ka-NOH-neek — loanword = canonical",
          "moral→moh-RAL — stress shifts to final syllable in loanwords",
        ],
      },
    ],
    cultural_notes_vi:
      "PANTUN là thể thơ dân gian Mã Lai–Indonesia, được UNESCO ghi danh di sản văn hóa phi vật thể năm 2020 (chung của Indonesia và Malaysia). Cấu trúc: 4 dòng (baris), mỗi dòng 8–12 âm tiết (suku kata), vần a-b-a-b. HAI DÒNG ĐẦU = SAMPIRAN (hình ảnh thiên nhiên, thường không liên quan nghĩa đen tới thông điệp), HAI DÒNG SAU = ISI (nội dung, lời khuyên, tỏ tình, châm biếm). Bậc thầy là người khiến sampiran ngầm 'cộng hưởng' với isi qua âm thanh hoặc liên tưởng.\n\nGURINDAM là thể cặp đôi (dua baris) mang tính giáo huấn: dòng 1 = syarat (điều kiện), dòng 2 = akibat (hệ quả). Tác phẩm kinh điển là 'Gurindam Dua Belas' (1847) của RAJA ALI HAJI ở Riau — 12 đoạn dạy đạo đức và tôn giáo. Đây là viên đá nền của bahasa Melayu mà bahasa Indonesia kế thừa.\n\nPHÂN BIỆT VỚI SYAIR: syair là thể trường thiên 4 dòng nhưng VẦN a-a-a-a và CẢ 4 dòng đều là isi (không có sampiran) — thường dùng kể chuyện dài.\n\nKHÁC BIỆT VỚI VIỆT NAM: người Việt có lục bát và ca dao — pantun gần ca dao ở chức năng (truyền miệng, tỏ tình, răn dạy) nhưng KHÁC ở chỗ sampiran cố ý 'lạc đề' bề mặt. Đừng dịch pantun sát nghĩa từng chữ; hãy giữ cặp sampiran–isi và vần. Trong giao tiếp C2, lẩy một câu pantun đúng lúc (berbalas pantun) là dấu hiệu uyên bác và duyên dáng, hay thấy trong đám cưới, diễn văn, MC.",
    cultural_notes_en:
      "The PANTUN is a Malay-Indonesian folk verse form, inscribed by UNESCO as intangible cultural heritage in 2020 (jointly Indonesia + Malaysia). Four lines, a-b-a-b rhyme: lines 1-2 (SAMPIRAN) paint nature imagery seemingly unrelated to the point; lines 3-4 (ISI) carry the actual message — advice, courtship, satire. A master makes the sampiran quietly resonate with the isi through sound or association. The GURINDAM is a moralistic couplet: line 1 a condition (syarat), line 2 its consequence (akibat); the canonical work is Raja Ali Haji's 'Gurindam Dua Belas' (1847) from Riau. Distinguish from the SYAIR (four lines, a-a-a-a rhyme, all four lines are content, no sampiran). Functionally close to Vietnamese ca dao, but the pantun's sampiran is deliberately 'off-topic' on the surface. At C2, dropping an apt pantun (berbalas pantun) — common at weddings and in speeches — marks you as erudite and charming.",
    tip_advice_vi:
      "ĐỌC HIỂU PANTUN: đừng tìm logic nghĩa đen giữa sampiran và isi. Hỏi: âm cuối có vần không (a-b-a-b)? Hình ảnh sampiran gợi tâm trạng gì cộng hưởng với isi? Ví dụ 'Berakit-rakit ke hulu / berenang-renang ke tepian' (chèo bè / bơi vào bờ — gian khó) → cộng hưởng với 'bersakit-sakit dahulu / bersenang-senang kemudian' (khổ trước sướng sau).\n\nTỪ VỰNG PHÂN TÍCH cần thuộc: bait (khổ thơ), baris/larik (dòng), suku kata (âm tiết), rima (vần), sampiran, isi, majas.\n\nĐỂ BÌNH GURINDAM: chỉ ra quan hệ syarat→akibat. Mẫu câu: 'Pada gurindam ini, baris pertama menyatakan syarat bahwa…, sedangkan baris kedua menegaskan akibatnya, yakni…' (Ở gurindam này, dòng đầu nêu điều kiện rằng…, còn dòng sau khẳng định hệ quả là…).\n\nĐỂ TỰ SÁNG TÁC (berbalas pantun): viết isi trước (thông điệp), rồi tìm sampiran có vần khớp. Giữ 8–12 âm tiết/dòng.\n\nTRÁNH: dịch pantun word-for-word sang tiếng Việt rồi mất vần. Nhầm pantun (a-b-a-b, có sampiran) với syair (a-a-a-a, toàn isi). Coi sampiran là 'vô nghĩa' — nó mang nhạc tính và ẩn ý.",
    tip_advice_en:
      "Reading a pantun: don't hunt for literal logic between sampiran and isi. Ask — do the line-endings rhyme a-b-a-b? What mood does the sampiran imagery evoke that resonates with the isi? Analysis vocabulary: bait (stanza), baris/larik (line), suku kata (syllable), rima (rhyme), sampiran, isi, majas. To comment on a gurindam, name the syarat→akibat relation: 'baris pertama menyatakan syarat…, baris kedua menegaskan akibatnya…'. To compose (berbalas pantun), write the isi first, then find a rhyming sampiran; keep 8-12 syllables per line. Avoid: translating word-for-word and losing the rhyme; confusing pantun (a-b-a-b, has sampiran) with syair (a-a-a-a, all content); dismissing the sampiran as 'meaningless' — it carries the music and the hint.",
    vocabulary: [
      { cell_id: "79e72dce-5ff1-4f85-a0e4-0ca4294c8ff9", word: "pantun", en: "pantun (four-line quatrain)", vi: "thể thơ pantun (tứ tuyệt)", pos: "n.", pronunciation_vi: "PAN-tun", pronunciation_en: "PAN-toon — UNESCO-listed Malay verse form" },
      { cell_id: "69828b6d-43e9-4f97-b07d-fc8ab21ec8ac", word: "gurindam", en: "moralistic couplet", vi: "thể song thất đạo lý", pos: "n.", pronunciation_vi: "gu-RIN-dam", pronunciation_en: "goo-RIN-dam — condition + consequence" },
      { cell_id: "3a2dc6a0-fd81-4e0c-8ff1-07919b8abf27", word: "syair", en: "syair (narrative quatrain, a-a-a-a)", vi: "thể syair (trường thiên)", pos: "n.", pronunciation_vi: "SYA-ir", pronunciation_en: "SHA-eer — 'sy' = 'sh'; all four lines are content" },
      { cell_id: "37e71d09-8057-4b7c-86a0-6aadcd6e2808", word: "sampiran", en: "the imagery lines (1-2)", vi: "hai câu dựng cảnh", pos: "n.", pronunciation_vi: "sam-PI-ran", pronunciation_en: "sam-PEE-ran — the 'setup' couplet" },
      { cell_id: "e1165529-115e-45b8-9dab-b0286967b8cd", word: "isi", en: "the message lines (3-4)", vi: "hai câu nội dung", pos: "n.", pronunciation_vi: "I-si", pronunciation_en: "EE-see — literally 'contents'" },
      { cell_id: "d917ce13-33a9-452c-b204-95416ab9d2d8", word: "bait", en: "stanza", vi: "khổ thơ", pos: "n.", pronunciation_vi: "BA-it", pronunciation_en: "BA-eet — two syllables; a verse stanza" },
      { cell_id: "80059c78-6211-4687-84b5-3d6989b3a520", word: "baris", en: "line (of verse)", vi: "dòng thơ", pos: "n.", pronunciation_vi: "BA-ris", pronunciation_en: "BA-rees — also larik" },
      { cell_id: "87c72ac9-18e8-4435-88b1-03d12d053aa7", word: "rima", en: "rhyme", vi: "vần", pos: "n.", pronunciation_vi: "RI-ma", pronunciation_en: "REE-ma — the a-b-a-b scheme" },
      { cell_id: "d73467c2-f770-4d6c-b8fd-78049a27cf9a", word: "suku kata", en: "syllable", vi: "âm tiết", pos: "n.", pronunciation_vi: "SU-ku KA-ta", pronunciation_en: "SOO-koo KA-ta — count these per line (8-12)" },
      { cell_id: "3ddda87e-485f-4eee-b030-c35f379c07f0", word: "berbalas pantun", en: "to exchange pantun (back and forth)", vi: "đối đáp pantun", pos: "v.", pronunciation_vi: "bơr-BA-las PAN-tun", pronunciation_en: "bur-BA-las PAN-toon — a courtship/ceremony tradition" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Dalam pantun, dua baris pertama disebut ___, sedangkan dua baris terakhir disebut isi.",
        answer: "sampiran",
        hint_vi: "hai câu đầu dựng hình ảnh",
        hint_en: "the first two lines that set the imagery",
      },
      {
        type: "matching",
        pairs: [
          ["sampiran", "hai câu dựng cảnh"],
          ["isi", "hai câu nội dung"],
          ["gurindam", "thể song thất đạo lý"],
          ["rima", "vần"],
        ],
        instruction: "Nối thuật ngữ thơ ca với nghĩa tiếng Việt.",
        instruction_en: "Match each poetry term with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Chịu khổ trước, hưởng vui sau.",
        indonesian: "Bersakit-sakit dahulu, bersenang-senang kemudian.",
        english: "Endure hardship first, enjoy comfort later.",
        hint_vi: "đây là 'isi' của một pantun nổi tiếng; vần với 'ke hulu / ke tepian'",
        hint_en: "this is the 'isi' of a famous pantun; it rhymes with the sampiran 'ke hulu / ke tepian'",
      },
    ],
  },

  // ── 3. Political and public discourse — wacana politik ───────────────────
  {
    id: "indonesian_c2_wacana_politik",
    level: "C2",
    category: "discourse",
    title_vi: "Diễn ngôn chính trị: hùng biện, uyển ngữ và ẩn ý nơi công cộng",
    title_en: "Political discourse: rhetoric, euphemism and public subtext",
    sentences: [
      {
        en: "Atas nama seluruh rakyat, izinkan saya menyampaikan komitmen kami terhadap reformasi yang berkelanjutan.",
        vi: "Nhân danh toàn thể nhân dân, xin cho phép tôi truyền đạt cam kết của chúng tôi đối với công cuộc cải cách bền vững.",
        pronunciation_focus: ["atas nama→A-tas NA-ma", "izinkan→i-ZIN-kan", "komitmen→ko-MIT-mơn", "berkelanjutan→bơr-kơ-lan-JU-tan"],
        pronunciation_focus_en: [
          "atas nama→A-tas NA-ma — = in the name of; a speech-opening formula",
          "izinkan→ee-ZEEN-kan — 'izinkan saya' = allow me; deferential register",
          "komitmen→ko-MIT-mun — loanword 'commitment'; final 'e' = schwa",
          "berkelanjutan→bur-kuh-lan-JOO-tan — ber-ke-...-an; = sustainability",
        ],
      },
      {
        en: "We must not — I repeat, must not — sacrifice the people's welfare on the altar of short-term interests.",
        vi: "Chúng ta không được — tôi nhắc lại, không được — hy sinh phúc lợi của nhân dân trên bàn thờ của lợi ích ngắn hạn.",
        pronunciation_focus: ["mengorbankan→mơ-ngor-BAN-kan", "kesejahteraan→kơ-sơ-jah-tơ-RA-an", "kepentingan→kơ-pơn-TI-ngan", "rakyat→RAK-yat"],
        pronunciation_focus_en: [
          "mengorbankan→muh-ngor-BAN-kan — meng- + korban + -kan; = to sacrifice",
          "kesejahteraan→kuh-suh-jah-tuh-RA-an — ke-...-an; = welfare/prosperity",
          "kepentingan→kuh-pun-TEE-ngan — = interests; 'ng' nasal cluster",
          "rakyat→RAK-yat — = the people; the central word of political speech",
        ],
      },
      {
        en: "Some quarters describe the policy as a 'recalibration' — a refined word for what is, in truth, a reversal.",
        vi: "Một số phía gọi chính sách ấy là 'điều chỉnh lại' — một từ hoa mỹ cho điều thực ra là sự đảo ngược.",
        pronunciation_focus: ["sejumlah→sơ-JUM-lah", "kebijakan→kơ-bi-JA-kan", "penghalusan→pơng-ha-LU-san", "kenyataannya→kơ-nya-ta-AN-nya"],
        pronunciation_focus_en: [
          "sejumlah→suh-JOOM-lah — = a number of; 'some quarters'",
          "kebijakan→kuh-bee-JA-kan — = policy; ke-...-an from bijak (wise)",
          "penghalusan→pung-ha-LOO-san — = euphemism/softening; peng-halus-an",
          "kenyataannya→kuh-nya-ta-AN-nyah — = in reality; the rhetorical pivot",
        ],
      },
      {
        en: "Behind the slogan of 'national unity' often hides a quiet demand for unquestioning obedience.",
        vi: "Đằng sau khẩu hiệu 'đoàn kết dân tộc' thường ẩn giấu một đòi hỏi thầm lặng về sự vâng phục không phản biện.",
        pronunciation_focus: ["slogan→SLO-gan", "persatuan→pơr-sa-TU-an", "kepatuhan→kơ-pa-TU-han", "tanpa→TAN-pa"],
        pronunciation_focus_en: [
          "slogan→SLOH-gan — loanword; clean vowels",
          "persatuan→pur-sa-TOO-an — per-satu-an; = unity (from satu, one)",
          "kepatuhan→kuh-pa-TOO-han — = obedience; ke-patuh-an",
          "tanpa→TAN-pa — = without; 'tanpa bertanya' = without questioning",
        ],
      },
      {
        en: "A sound critique attacks the policy, never the dignity of the person who proposed it.",
        vi: "Một lời phê bình lành mạnh nhắm vào chính sách, không bao giờ nhắm vào nhân phẩm của người đề xuất.",
        pronunciation_focus: ["kritik→KRI-tik", "menyerang→mơ-nyơ-RANG", "martabat→mar-ta-BAT", "mengusulkan→mơ-ngu-SUL-kan"],
        pronunciation_focus_en: [
          "kritik→KREE-teek — loanword = critique/criticism",
          "menyerang→muh-nyuh-RANG — me- + serang; 'ny'; = to attack",
          "martabat→mar-ta-BAT — = dignity; an Arabic-origin loanword",
          "mengusulkan→muh-ngoo-SOOL-kan — meng- + usul + -kan; = to propose",
        ],
      },
    ],
    cultural_notes_vi:
      "DIỄN NGÔN CHÍNH TRỊ Indonesia (pidato, debat, jumpa pers) dùng bahasa baku (chuẩn) và giàu công thức trang trọng. Mở đầu kinh điển: 'Assalamualaikum… Salam sejahtera bagi kita semua' (chào liên tôn), rồi xưng hô danh dự 'Yang terhormat Bapak/Ibu…' (Kính thưa Ngài/Bà…), rồi 'Hadirin yang saya hormati' (Thưa quý vị mà tôi kính trọng).\n\nUYỂN NGỮ CHÍNH TRỊ (eufemisme / penghalusan) là kỹ năng C2 phải GIẢI MÃ: 'merumahkan' (cho về nhà) = sa thải; 'penyesuaian harga' (điều chỉnh giá) = tăng giá; 'diamankan' (được bảo đảm an toàn) = bị bắt giữ; 'oknum' (cá nhân riêng lẻ) = dùng để tách một kẻ sai phạm khỏi tổ chức. Nhận ra penghalusan là đọc được ẩn ý quyền lực.\n\nTỪ KHÓA CHÍNH TRỊ: reformasi (cải cách — gắn với 1998, lật đổ Soeharto), Pancasila (5 nguyên tắc nền tảng quốc gia), NKRI (Negara Kesatuan Republik Indonesia — nhà nước thống nhất), Bhinneka Tunggal Ika (Thống nhất trong đa dạng — quốc huy), gotong royong (tương trợ cộng đồng — thường được viện dẫn để kêu gọi đồng thuận).\n\nKHÁC BIỆT VỚI VIỆT NAM: không gian báo chí và mạng xã hội Indonesia (era Reformasi) cho phép phê bình chính phủ công khai hơn — nhưng vẫn có lằn ranh nhạy cảm (SARA: Suku, Agama, Ras, Antargolongan — sắc tộc, tôn giáo, chủng tộc, nhóm). Người C2 biết phê bình CHÍNH SÁCH sắc bén mà tránh chạm SARA, vốn có thể bị xem là kích động.",
    cultural_notes_en:
      "Indonesian political discourse (pidato/speech, debate, press conference) uses bahasa baku and rich formal openings: an interfaith greeting, then deferential address 'Yang terhormat Bapak/Ibu…', then 'Hadirin yang saya hormati'. A C2 skill is DECODING political euphemism (penghalusan/eufemisme): 'merumahkan' (to send home) = to lay off; 'penyesuaian harga' (price adjustment) = a price hike; 'diamankan' (to be secured) = to be detained; 'oknum' (a lone individual) = used to detach a wrongdoer from the institution. Key terms: reformasi (the 1998 reform era that ended Soeharto's rule), Pancasila (the five founding principles), NKRI (the unitary republic), Bhinneka Tunggal Ika (Unity in Diversity), gotong royong (communal cooperation, invoked to call for consensus). Unlike Vietnam, the post-Reformasi press allows more open critique of government — but the SARA red line (ethnicity, religion, race, intergroup relations) stays sensitive. A C2 speaker critiques the POLICY sharply while steering clear of SARA, which can be treated as incitement.",
    tip_advice_vi:
      "BỘ KHUNG PHÊ BÌNH CHÍNH SÁCH (register cao, lịch sự): (1) Thừa nhận: 'Saya menghargai niat baik di balik kebijakan ini, namun…' (Tôi trân trọng thiện chí sau chính sách này, song…). (2) Phản bác: 'kebijakan ini justru berisiko…' (chính sách này lại có nguy cơ…) / 'data di lapangan menunjukkan sebaliknya' (số liệu thực địa cho thấy điều ngược lại). (3) Đề xuất: 'Alangkah baiknya jika…' (Sẽ tốt biết bao nếu…).\n\nCỤM TRANG TRỌNG: 'perlu digarisbawahi bahwa' (cần gạch chân rằng), 'pada hakikatnya' (về bản chất), 'dalam jangka panjang' (về dài hạn), 'demi kepentingan bersama' (vì lợi ích chung).\n\nGIẢI MÃ UYỂN NGỮ: khi nghe 'penyesuaian', 'restrukturisasi', 'efisiensi', 'dirumahkan' — hỏi: từ thẳng thắn là gì? Đó là kỹ năng đọc subtext.\n\nĐỘNG TỪ THỨC HÔ HÀO: 'Marilah kita…' (Hãy cùng nhau…) — rất phổ biến trong pidato để kêu gọi đồng thuận.\n\nTRÁNH: tấn công cá nhân (serangan pribadi / ad hominem) — bị xem là đuối lý. Chạm SARA. Dùng khẩu ngữ 'gue/lo', 'banget', 'sih' trong diễn văn — hạ register tức thì. Cao giọng — sự điềm tĩnh (santun) được coi trọng hơn.",
    tip_advice_en:
      "Policy-critique frame (high, courteous register): (1) acknowledge — 'Saya menghargai niat baik di balik kebijakan ini, namun…'; (2) rebut — 'kebijakan ini justru berisiko…', 'data di lapangan menunjukkan sebaliknya'; (3) propose — 'Alangkah baiknya jika…'. Formal connectors: 'perlu digarisbawahi bahwa', 'pada hakikatnya' (in essence), 'dalam jangka panjang', 'demi kepentingan bersama'. Decode euphemism: hearing 'penyesuaian', 'restrukturisasi', 'efisiensi', 'dirumahkan' — ask what the blunt word is. The hortative 'Marilah kita…' (Let us together…) is the classic consensus-call in a pidato. Avoid: ad hominem (serangan pribadi), touching SARA, and colloquialisms ('gue/lo', 'banget', 'sih') that instantly drop the register. Composure (santun) outranks volume.",
    vocabulary: [
      { cell_id: "3787f864-750f-445e-b296-8bdb729731af", word: "wacana", en: "discourse", vi: "diễn ngôn", pos: "n.", pronunciation_vi: "wa-CHA-na", pronunciation_en: "wa-CHA-na — 'c' = 'ch'; the academic word for discourse" },
      { cell_id: "12de1cc2-b072-47f9-8987-21bbec7ce082", word: "pidato", en: "speech / address", vi: "bài diễn văn", pos: "n.", pronunciation_vi: "pi-DA-to", pronunciation_en: "pee-DA-toh — a formal public speech" },
      { cell_id: "68d289c0-0387-4f6a-9731-62927acfd6d9", word: "kebijakan", en: "policy", vi: "chính sách", pos: "n.", pronunciation_vi: "kơ-bi-JA-kan", pronunciation_en: "kuh-bee-JA-kan — ke-bijak-an, from bijak (wise)" },
      { cell_id: "153883fa-3cb3-442a-926e-92975dfab277", word: "reformasi", en: "reform (esp. the 1998 era)", vi: "cải cách", pos: "n.", pronunciation_vi: "re-for-MA-si", pronunciation_en: "re-for-MA-see — loaded with 1998 history" },
      { cell_id: "1eca3894-697b-47cf-90ea-867c93d7da30", word: "penghalusan", en: "euphemism / softening", vi: "uyển ngữ, nói giảm", pos: "n.", pronunciation_vi: "pơng-ha-LU-san", pronunciation_en: "pung-ha-LOO-san — peng-halus-an; the politician's tool" },
      { cell_id: "28897871-7b06-4d4c-9cee-dc26ef6bfd53", word: "oknum", en: "a rogue individual (bureaucratic spin)", vi: "cá nhân (tách khỏi tổ chức)", pos: "n.", pronunciation_vi: "OK-num", pronunciation_en: "OK-noom — used to deflect blame from an institution" },
      { cell_id: "188c7ffc-1120-4f19-9817-f63a69308384", word: "rakyat", en: "the people", vi: "nhân dân", pos: "n.", pronunciation_vi: "RAK-yat", pronunciation_en: "RAK-yat — the rhetorical center of any speech" },
      { cell_id: "4aeaf461-3532-4837-a2dd-1c0763e25da1", word: "martabat", en: "dignity", vi: "nhân phẩm, phẩm giá", pos: "n.", pronunciation_vi: "mar-ta-BAT", pronunciation_en: "mar-ta-BAT — attack the policy, not the martabat" },
      { cell_id: "484da468-3157-489f-8f8f-c433990acbce", word: "garis bawahi", en: "to underline / emphasize", vi: "nhấn mạnh, gạch chân", pos: "v.", pronunciation_vi: "GA-ris ba-WA-hi", pronunciation_en: "GA-rees ba-WA-hee — 'perlu digarisbawahi' = it must be emphasized" },
      { cell_id: "9a0fda57-3583-4acf-919d-6f2d4ef85b32", word: "santun", en: "courteous / well-mannered", vi: "lịch thiệp, nhã nhặn", pos: "adj.", pronunciation_vi: "SAN-tun", pronunciation_en: "SAN-toon — the prized tone in public debate" },
    ],
    dialogue: [
      { cell_id: "08b71580-484e-4691-baee-53a70aa137fb", speaker: "Anggota DPR", text: "Saya menghargai niat di balik kebijakan ini, namun data di lapangan justru menunjukkan sebaliknya.", vi: "Tôi trân trọng ý định sau chính sách này, song số liệu thực địa lại cho thấy điều ngược lại.", en: "I appreciate the intent behind this policy, but field data shows the opposite." },
      { cell_id: "31abdcdb-eda6-46d8-bed3-b324ad7a1163", speaker: "Menteri", text: "Yang kami lakukan bukanlah kenaikan, melainkan penyesuaian harga demi keberlanjutan anggaran.", vi: "Điều chúng tôi làm không phải là tăng giá, mà là điều chỉnh giá vì sự bền vững của ngân sách.", en: "What we did is not a hike but a price adjustment for budget sustainability." },
      { cell_id: "a059bc3c-2539-4af7-9a45-188fdac2c673", speaker: "Anggota DPR", text: "Dengan segala hormat, 'penyesuaian' itu, di mata rakyat, tetaplah beban yang nyata.", vi: "Với tất cả sự kính trọng, 'điều chỉnh' ấy, trong mắt nhân dân, vẫn là một gánh nặng có thật.", en: "With all due respect, that 'adjustment', in the people's eyes, is still a real burden." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Dalam politik, kata 'merumahkan' sering dipakai sebagai ___ untuk pemutusan hubungan kerja.",
        answer: "penghalusan",
        hint_vi: "cách nói giảm/uyển ngữ để che một sự thật khó nghe",
        hint_en: "the softening/euphemism that veils a harsh fact",
      },
      {
        type: "matching",
        pairs: [
          ["kebijakan", "chính sách"],
          ["penghalusan", "uyển ngữ"],
          ["rakyat", "nhân dân"],
          ["martabat", "nhân phẩm"],
        ],
        instruction: "Nối thuật ngữ diễn ngôn chính trị với nghĩa tiếng Việt.",
        instruction_en: "Match each political-discourse term with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Một lời phê bình lành mạnh nhắm vào chính sách, không nhắm vào con người.",
        indonesian: "Kritik yang sehat menyerang kebijakan, bukan pribadi orangnya.",
        english: "A healthy critique attacks the policy, not the person.",
        hint_vi: "'bukan' phủ định danh từ; nguyên tắc tránh ad hominem",
        hint_en: "'bukan' negates a noun; the anti-ad-hominem principle",
      },
    ],
  },

  // ── 4. Legal and bureaucratic register — bahasa hukum & birokrasi ────────
  {
    id: "indonesian_c2_bahasa_hukum_birokrasi",
    level: "C2",
    category: "formal-register",
    title_vi: "Ngôn ngữ pháp lý và hành chính: văn bản chính thức (bahasa hukum)",
    title_en: "Legal and bureaucratic register: official documents",
    sentences: [
      {
        en: "Pursuant to the provisions of Article 5 paragraph (2), the parties are obliged to fulfil their respective duties.",
        vi: "Căn cứ vào quy định tại Điều 5 khoản (2), các bên có nghĩa vụ thực hiện trách nhiệm tương ứng của mình.",
        pronunciation_focus: ["sesuai dengan→sơ-SU-ai DƠ-ngan", "ketentuan→kơ-tơn-TU-an", "pasal→PA-sal", "berkewajiban→bơr-kơ-wa-JI-ban"],
        pronunciation_focus_en: [
          "sesuai dengan→suh-SOO-ai DUH-ngan — = in accordance with; legal opener",
          "ketentuan→kuh-tun-TOO-an — = provision/stipulation; ke-tentu-an",
          "pasal→PA-sal — = Article (of a law); ayat = paragraph/clause",
          "berkewajiban→bur-kuh-wa-JEE-ban — = to be obligated; ber-ke-wajib-an",
        ],
      },
      {
        en: "Whereas the first party, hereinafter referred to as the Lessor, owns the building in question.",
        vi: "Xét rằng bên thứ nhất, sau đây gọi là Bên cho thuê, là chủ sở hữu tòa nhà nói trên.",
        pronunciation_focus: ["bahwa→BAH-wa", "pihak pertama→PI-hak pơr-TA-ma", "selanjutnya disebut→sơ-lan-JUT-nya di-SƠ-but", "tersebut→tơr-SƠ-but"],
        pronunciation_focus_en: [
          "bahwa→BAH-wa — = that (the conjunction opening a clause); 'menimbang bahwa'",
          "pihak pertama→PEE-hak pur-TA-ma — = the first party; 'pihak' = party",
          "selanjutnya disebut→suh-lan-JOOT-nyah dee-SUH-boot — = hereinafter called",
          "tersebut→tur-SUH-boot — = aforementioned; the bureaucratic 'said/the'",
        ],
      },
      {
        en: "Any violation of this clause shall result in sanctions in accordance with the prevailing laws and regulations.",
        vi: "Mọi vi phạm điều khoản này sẽ dẫn đến chế tài chiếu theo pháp luật và quy định hiện hành.",
        pronunciation_focus: ["pelanggaran→pơ-lang-GA-ran", "dikenakan→di-kơ-NA-kan", "sanksi→SANK-si", "perundang-undangan→pơr-un-dang-un-DA-ngan"],
        pronunciation_focus_en: [
          "pelanggaran→puh-lang-GA-ran — = violation; pe-langgar-an",
          "dikenakan→dee-kuh-NA-kan — passive di-; = to be imposed (on)",
          "sanksi→SANK-see — loanword = sanction/penalty",
          "perundang-undangan→pur-oo-dang-oon-DA-ngan — reduplicated; = legislation",
        ],
      },
      {
        en: "This document is made in duplicate, each bearing equal legal force.",
        vi: "Văn bản này được lập thành hai bản, mỗi bản có giá trị pháp lý ngang nhau.",
        pronunciation_focus: ["dibuat→di-BU-at", "rangkap dua→RANG-kap DU-a", "kekuatan hukum→kơ-ku-A-tan HU-kum", "sama→SA-ma"],
        pronunciation_focus_en: [
          "dibuat→dee-BOO-at — passive of buat; = is made",
          "rangkap dua→RANG-kap DOO-a — = in duplicate; 'rangkap' = layer/copy",
          "kekuatan hukum→kuh-koo-A-tan HOO-koom — = legal force",
          "sama→SA-ma — = same/equal; the closing formula",
        ],
      },
      {
        en: "To process the permit, applicants must submit the requirements no later than fourteen working days in advance.",
        vi: "Để xử lý giấy phép, người nộp đơn phải nộp đủ hồ sơ chậm nhất mười bốn ngày làm việc trước đó.",
        pronunciation_focus: ["mengurus→mơ-ngu-RUS", "pemohon→pơ-MO-hon", "persyaratan→pơr-sya-RA-tan", "selambat-lambatnya→sơ-lam-bat-LAM-bat-nya"],
        pronunciation_focus_en: [
          "mengurus→muh-ngoo-ROOS — = to process/handle (paperwork)",
          "pemohon→puh-MOH-hon — = applicant; pe-mohon, from mohon (to request)",
          "persyaratan→pur-sya-RA-tan — = requirements; per-syarat-an; 'sy' = 'sh'",
          "selambat-lambatnya→suh-lam-bat-LAM-bat-nyah — = at the latest; reduplicated superlative",
        ],
      },
    ],
    cultural_notes_vi:
      "BAHASA HUKUM (ngôn ngữ pháp lý) và BAHASA BIROKRASI (hành chính) là register cao nhất của bahasa Indonesia baku — câu dài, thể bị động (di- prefix), danh từ hóa (ke-...-an, pe-...-an), và công thức cố định. Người C2 phải đọc hiểu hợp đồng (kontrak/perjanjian), đơn từ (surat resmi), quy định (peraturan), luật (undang-undang).\n\nCẤU TRÚC VĂN BẢN LUẬT: Undang-Undang (UU, luật do Quốc hội DPR ban hành) > Peraturan Pemerintah (PP, nghị định) > Peraturan Presiden (Perpres) > Peraturan Daerah (Perda, cấp địa phương). Đơn vị trong văn bản: BAB (chương) > Pasal (điều) > ayat (khoản, ghi số trong ngoặc, vd ayat (2)) > huruf (điểm a, b, c).\n\nCÔNG THỨC MỞ ĐẦU LUẬT: 'Menimbang' (Xét rằng — phần lý do), 'Mengingat' (Căn cứ — phần dẫn chiếu pháp lý), 'Memutuskan' (Quyết định). Trong hợp đồng: 'Pihak Pertama' / 'Pihak Kedua', 'yang selanjutnya disebut sebagai…' (sau đây gọi là…).\n\nTỪ HÀNH CHÍNH ĐẶC TRƯNG: tersebut (nói trên), dimaksud (được đề cập), bersangkutan (liên quan), terlampir (đính kèm), perihal (về việc), demikian (như vậy — đóng thư). Thư công vụ kết bằng 'Demikian surat ini kami sampaikan, atas perhatiannya kami ucapkan terima kasih.' (Trên đây là nội dung chúng tôi xin trình bày, xin cảm ơn sự quan tâm của quý vị.)\n\nKHÁC BIỆT VỚI VIỆT NAM: cả hai nền hành chính đều thừa hưởng văn phong trang trọng nặng nề, nhưng tiếng Indonesia lạm dụng thể bị động di- để tạo giọng vô nhân xưng (impersonal) — 'diharapkan' (được mong rằng), 'dimohon' (kính đề nghị) — thay vì nói ai làm. Người C2 nhận ra rằng giọng bị động ấy CỐ Ý xóa chủ thể trách nhiệm.",
    cultural_notes_en:
      "Bahasa hukum (legal) and bahasa birokrasi (bureaucratic) are the highest registers of standard Indonesian — long sentences, the di- passive, heavy nominalization (ke-...-an, pe-...-an), and fixed formulas. Legal hierarchy: Undang-Undang (UU, statute) > Peraturan Pemerintah (PP) > Peraturan Presiden (Perpres) > Peraturan Daerah (Perda). Document units: BAB (chapter) > Pasal (Article) > ayat (paragraph, numbered in parentheses) > huruf (lettered point). Opening formulas: 'Menimbang' (Considering/Whereas), 'Mengingat' (Having regard to — the legal citations), 'Memutuskan' (Decides). Contracts use 'Pihak Pertama/Kedua' and 'yang selanjutnya disebut sebagai…' (hereinafter referred to as). Bureaucratic markers: tersebut (aforementioned), dimaksud (referred to), bersangkutan (concerned), terlampir (attached), perihal (re:). Official letters close with 'Demikian surat ini kami sampaikan, atas perhatiannya kami ucapkan terima kasih.' Like Vietnamese officialese, the style is heavy and formal — but Indonesian leans hard on the di- passive to sound impersonal ('diharapkan' = it is hoped, 'dimohon' = it is requested) rather than naming an agent. A C2 reader notices that this passive deliberately erases who is responsible.",
    tip_advice_vi:
      "ĐỌC HỢP ĐỒNG: tìm 'Pihak Pertama' và 'Pihak Kedua' trước, rồi tìm 'hak' (quyền) và 'kewajiban' (nghĩa vụ) của từng bên, rồi điều khoản 'sanksi' và 'penyelesaian sengketa' (giải quyết tranh chấp).\n\nVIẾT THƯ CÔNG VỤ (surat resmi): cấu trúc cố định — Kop surat (tiêu đề), Nomor/Lampiran/Perihal (số/đính kèm/về việc), 'Kepada Yth.' (Kính gửi), nội dung, 'Demikian… atas perhatiannya terima kasih', 'Hormat kami' + chữ ký.\n\nCHUYỂN TỪ NÓI THƯỜNG SANG PHÁP LÝ: 'kalau' → 'apabila/jikalau' (nếu), 'tapi' → 'namun/akan tetapi' (nhưng), 'soal' → 'perihal/mengenai' (về việc), 'harus' → 'wajib/berkewajiban' (có nghĩa vụ), 'bikin' → 'membuat/menyusun' (lập).\n\nGIẢI MÃ THỂ BỊ ĐỘNG VÔ CHỦ: khi đọc 'diharapkan', 'dimohon', 'akan ditindaklanjuti' — hỏi: AI mong, AI đề nghị, AI xử lý? Văn bản hành chính cố ý mờ chủ thể.\n\nTRÁNH: khẩu ngữ trong văn bản chính thức ('gak', 'banget', 'sih'). Câu chủ động khi văn cảnh đòi bị động trang trọng. Quên số ayat trong ngoặc — Pasal 5 ayat (2) là cách dẫn chuẩn. Dịch 'tersebut/dimaksud' thành 'cái đó' — phải là 'nói trên/được đề cập'.",
    tip_advice_en:
      "Reading a contract: find 'Pihak Pertama' and 'Pihak Kedua' first, then each side's 'hak' (rights) and 'kewajiban' (obligations), then the 'sanksi' and 'penyelesaian sengketa' (dispute resolution) clauses. Official-letter skeleton: letterhead, Nomor/Lampiran/Perihal, 'Kepada Yth.' (To the respected…), body, 'Demikian… terima kasih', 'Hormat kami' + signature. Register upgrades: 'kalau'→'apabila/jikalau', 'tapi'→'namun/akan tetapi', 'soal'→'perihal/mengenai', 'harus'→'wajib/berkewajiban', 'bikin'→'membuat/menyusun'. Decode the agentless passive: at 'diharapkan', 'dimohon', 'akan ditindaklanjuti' — ask WHO hopes, requests, follows up; the form hides the agent on purpose. Avoid colloquialisms in official text, active voice where formal passive is expected, dropping the parenthetical ayat number (Pasal 5 ayat (2) is the standard citation), and rendering 'tersebut/dimaksud' as 'that one' instead of 'aforementioned/referred to'.",
    vocabulary: [
      { cell_id: "07db4d89-25c0-4fea-a5b6-8532819d13af", word: "undang-undang", en: "statute / law (UU)", vi: "luật, đạo luật", pos: "n.", pronunciation_vi: "un-dang-UN-dang", pronunciation_en: "oon-dang-OON-dang — reduplicated; the highest statute" },
      { cell_id: "1390d25d-d8c0-49c2-a7fa-61ff6632b6a4", word: "pasal", en: "Article (of a law/contract)", vi: "điều", pos: "n.", pronunciation_vi: "PA-sal", pronunciation_en: "PA-sal — Pasal 5; ayat is the sub-paragraph" },
      { cell_id: "1caa6c62-37f5-4592-af30-c9ed6cd1fec5", word: "ayat", en: "paragraph / clause", vi: "khoản", pos: "n.", pronunciation_vi: "A-yat", pronunciation_en: "A-yat — cited as ayat (2), in parentheses" },
      { cell_id: "2f8a0074-f7af-4824-bf48-86dc09ca7107", word: "perjanjian", en: "agreement / contract", vi: "hợp đồng, thỏa thuận", pos: "n.", pronunciation_vi: "pơr-jan-JI-an", pronunciation_en: "pur-jan-JEE-an — per-janji-an, from janji (promise)" },
      { cell_id: "f750c0f5-7302-445d-bc5d-01afa055642b", word: "kewajiban", en: "obligation / duty", vi: "nghĩa vụ", pos: "n.", pronunciation_vi: "kơ-wa-JI-ban", pronunciation_en: "kuh-wa-JEE-ban — paired with 'hak' (rights)" },
      { cell_id: "95ad3c8e-5ead-47c6-b458-139a84cfd86c", word: "ketentuan", en: "provision / stipulation", vi: "quy định", pos: "n.", pronunciation_vi: "kơ-tơn-TU-an", pronunciation_en: "kuh-tun-TOO-an — ke-tentu-an" },
      { cell_id: "50afd263-38d4-49e7-8d58-bb66fe4304f9", word: "tersebut", en: "aforementioned / the said", vi: "nói trên", pos: "adj.", pronunciation_vi: "tơr-SƠ-but", pronunciation_en: "tur-SUH-boot — the bureaucratic 'the said'" },
      { cell_id: "12440d8b-2701-4d12-a86b-3cab2af26ced", word: "selanjutnya disebut", en: "hereinafter referred to as", vi: "sau đây gọi là", pos: "expr.", pronunciation_vi: "sơ-lan-JUT-nya di-SƠ-but", pronunciation_en: "suh-lan-JOOT-nyah dee-SUH-boot — contract boilerplate" },
      { cell_id: "5aa4ec15-7bc2-43d3-813a-76cf3195967f", word: "pemohon", en: "applicant", vi: "người nộp đơn", pos: "n.", pronunciation_vi: "pơ-MO-hon", pronunciation_en: "puh-MOH-hon — pe-mohon, from mohon (to request)" },
      { cell_id: "4968c248-6aa3-4310-8502-72e402c46268", word: "menimbang", en: "considering / whereas (legal preamble)", vi: "xét rằng", pos: "v.", pronunciation_vi: "mơ-NIM-bang", pronunciation_en: "muh-NIM-bang — opens the reasoning of a law" },
    ],
    dialogue: [
      { cell_id: "0d2d2c5c-ad6b-4118-93df-3855489ad86d", speaker: "Notaris", text: "Mohon Bapak membaca Pasal 7 ayat (1) mengenai kewajiban Pihak Kedua sebelum menandatangani.", vi: "Xin Ngài đọc Điều 7 khoản (1) về nghĩa vụ của Bên thứ hai trước khi ký.", en: "Please read Article 7 paragraph (1) on the Second Party's obligations before signing." },
      { cell_id: "40b0f674-e856-48e6-8dc6-469872eea5c2", speaker: "Klien", text: "Apakah sanksi yang dimaksud dalam ayat berikutnya berlaku bila keterlambatan disebabkan keadaan kahar?", vi: "Chế tài được nói đến ở khoản tiếp theo có áp dụng không nếu sự chậm trễ do bất khả kháng?", en: "Does the sanction referred to in the next paragraph apply if the delay is caused by force majeure?" },
      { cell_id: "e73d6039-2414-40b6-a44b-91fcc722eac9", speaker: "Notaris", text: "Tidak. Sesuai ketentuan, keadaan kahar membebaskan para pihak dari tanggung jawab tersebut.", vi: "Không. Theo quy định, trường hợp bất khả kháng miễn cho các bên khỏi trách nhiệm nói trên.", en: "No. Under the provision, force majeure releases the parties from the said liability." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Sesuai ketentuan ___ 5 ayat (2), kedua belah pihak wajib memenuhi kewajibannya.",
        answer: "Pasal",
        hint_vi: "đơn vị 'Điều' trong luật/hợp đồng",
        hint_en: "the 'Article' unit in a law or contract",
      },
      {
        type: "matching",
        pairs: [
          ["perjanjian", "hợp đồng"],
          ["kewajiban", "nghĩa vụ"],
          ["tersebut", "nói trên"],
          ["pemohon", "người nộp đơn"],
        ],
        instruction: "Nối thuật ngữ pháp lý–hành chính với nghĩa tiếng Việt.",
        instruction_en: "Match each legal-bureaucratic term with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Văn bản này được lập thành hai bản, mỗi bản có giá trị pháp lý ngang nhau.",
        indonesian: "Dokumen ini dibuat dalam rangkap dua, masing-masing memiliki kekuatan hukum yang sama.",
        english: "This document is made in duplicate, each having equal legal force.",
        hint_vi: "công thức kết hợp đồng; 'rangkap dua' = hai bản, 'kekuatan hukum' = giá trị pháp lý",
        hint_en: "the contract-closing formula; 'rangkap dua' = in duplicate",
      },
    ],
  },

  // ── 5. Humor, satire, dialect & native-fluency markers ───────────────────
  {
    id: "indonesian_c2_humor_satir_dialek",
    level: "C2",
    category: "register-mastery",
    title_vi: "Hài hước, châm biếm, phương ngữ và dấu hiệu thông thạo bản ngữ",
    title_en: "Humor, satire, dialect and native-fluency markers",
    sentences: [
      {
        en: "His apology was so polished you could almost forget he was the one who started the fire.",
        vi: "Lời xin lỗi của anh ta bóng bẩy đến mức bạn gần như quên mất chính anh ta là kẻ đã châm lửa.",
        pronunciation_focus: ["permintaan maaf→pơr-min-TA-an ma-AF", "begitu→bơ-GI-tu", "menyulut→mơ-nyu-LUT", "hampir→HAM-pir"],
        pronunciation_focus_en: [
          "permintaan maaf→pur-meen-TA-an ma-AF — = apology; 'maaf' = sorry",
          "begitu→buh-GEE-too — = so/that much; intensifier",
          "menyulut→muh-nyoo-LOOT — = to ignite; 'menyulut api/keributan' = stir up trouble",
          "hampir→HAM-peer — = almost; sets up the ironic 'almost forget'",
        ],
      },
      {
        en: "Don't take it to heart — that's just Jakarta sarcasm; if they tease you, it means you're already a friend.",
        vi: "Đừng để bụng — đó chỉ là kiểu mỉa mai Jakarta thôi; nếu họ trêu bạn, nghĩa là bạn đã là bạn bè rồi.",
        pronunciation_focus: ["jangan→JA-ngan", "baper→BA-pơr", "nyindir→NYIN-dir", "udah→U-dah"],
        pronunciation_focus_en: [
          "jangan→JA-ngan — = don't; 'jangan baper' = don't get over-emotional",
          "baper→BA-pur — slang clip of 'bawa perasaan' (take it personally)",
          "nyindir→NYEEN-deer — colloquial 'menyindir' = to make a snide remark",
          "udah→OO-dah — colloquial 'sudah' = already; pure Jakarta speech",
        ],
      },
      {
        en: "The columnist's satire bites hardest precisely because it never once raises its voice.",
        vi: "Lối châm biếm của cây bút ấy sắc nhất chính vì nó chưa một lần lớn tiếng.",
        pronunciation_focus: ["satire→SA-ti-rơ", "menggigit→mơng-GI-git", "justru→JUS-tru", "meninggikan suara→mơ-ning-GI-kan su-A-ra"],
        pronunciation_focus_en: [
          "satire→SA-tee-ruh — also 'satir'; the loanword for satire",
          "menggigit→mung-GEE-geet — = to bite; 'satire menggigit' = biting satire",
          "justru→JOOS-troo — = precisely/on the contrary; a C2 pivot word",
          "meninggikan suara→muh-ning-GEE-kan soo-A-ra — = to raise one's voice",
        ],
      },
      {
        en: "In Yogyakarta people pepper their Indonesian with a gentle 'to' and 'je'; in Medan it comes out blunt and loud.",
        vi: "Ở Yogyakarta người ta rắc vào tiếng Indonesia những tiếng 'to' và 'je' nhẹ nhàng; ở Medan thì nói thẳng và to.",
        pronunciation_focus: ["logat→LO-gat", "lembut→lơm-BUT", "blak-blakan→blak-BLA-kan", "medok→MƠ-dok"],
        pronunciation_focus_en: [
          "logat→LOH-gat — = accent/dialect; 'logat Jawa/Medan'",
          "lembut→lum-BOOT — = soft/gentle (the Yogya manner)",
          "blak-blakan→blak-BLA-kan — = blunt/outspoken (the Medan reputation)",
          "medok→MUH-dok — = a thick (esp. Javanese) regional accent",
        ],
      },
      {
        en: "A true native doesn't translate the joke; they feel exactly when 'kan' turns a statement into a sly nudge.",
        vi: "Người bản ngữ thực thụ không dịch câu đùa; họ cảm được chính xác khi nào 'kan' biến một câu trần thuật thành cú huých tinh quái.",
        pronunciation_focus: ["penutur asli→pơ-NU-tur AS-li", "menerjemahkan→mơ-nơr-jơ-MAH-kan", "lelucon→lơ-LU-chon", "sindiran halus→sin-DI-ran HA-lus"],
        pronunciation_focus_en: [
          "penutur asli→puh-NOO-toor AS-lee — = native speaker (lit. 'original speaker')",
          "menerjemahkan→muh-nur-juh-MAH-kan — = to translate; what you stop doing at C2",
          "lelucon→luh-LOO-chon — = a joke; 'c' = 'ch'",
          "sindiran halus→seen-DEE-ran HA-loos — = a subtle dig; the prized C2 register",
        ],
      },
    ],
    cultural_notes_vi:
      "HÀI HƯỚC INDONESIA nghiêng về sindiran (móc mỉa nhẹ) và satire xã hội hơn là chọc cười thô. SINDIRAN HALUS — một câu khen mà thực ra là chê — được đánh giá cao hơn đùa lộ liễu. Cây bút châm biếm kinh điển: Mahbub Djunaidi, và truyền thống 'Mojok.co' / 'Mang Oleh' thời nay. Hiểu được satire chính trị (vd biếm họa, meme) là đỉnh cao đọc hiểu văn hóa.\n\nĐA NGỮ THỰC TẾ: hầu hết người Indonesia song/đa ngữ — bahasa Indonesia (quốc ngữ, register trang trọng và liên vùng) + một bahasa daerah (tiếng địa phương: Jawa, Sunda, Batak, Minang, Bali…). Người C2 KHÔNG cần nói tiếng địa phương, nhưng phải NHẬN RA dấu vết của chúng trong tiếng Indonesia: logat Jawa (medok, thêm 'to', 'je', 'lho'), giọng Medan/Batak thẳng và vang, giọng Sunda mềm với 'euy', 'atuh'.\n\nDẤU HIỆU THÔNG THẠO BẢN NGỮ (penanda kefasihan): (1) dùng PARTIKEL đúng chỗ — 'kan' (chẳng phải sao), 'sih' (vậy/thì), 'dong' (đi mà), 'kok' (sao mà), 'lho/loh' (ơ kìa), 'deh', 'nih', 'tuh'. Đây là thứ sách giáo khoa không dạy được. (2) Chuyển register MƯỢT giữa baku (chuẩn) và gaul (đời thường) tùy ngữ cảnh. (3) Hiểu lelucon mà không cần dịch.\n\nKHÁC BIỆT VỚI VIỆT NAM: tiếng Việt có 'à, ạ, nhé, nha, đấy, cơ, mà' — tương tự về CHỨC NĂNG nhưng KHÔNG ánh xạ 1-1 sang partikel Indonesia. Đừng dịch 'nhé' = 'ya' một cách máy móc. Mỗi partikel Indonesia mang sắc thái riêng: 'dong' (nũng nịu/thúc giục), 'kok' (ngạc nhiên/phản bác nhẹ), 'sih' (làm dịu hoặc gặng hỏi). Nắm được phổ này là ranh giới giữa C1 'đúng ngữ pháp' và C2 'nghe như người bản xứ'.",
    cultural_notes_en:
      "Indonesian humor leans toward sindiran (gentle innuendo) and social satire rather than broad slapstick. A SINDIRAN HALUS — a 'compliment' that is really a dig — is prized over an obvious joke; grasping political satire (cartoons, memes) is the summit of cultural reading. MULTILINGUAL REALITY: most Indonesians are bilingual — Bahasa Indonesia (the formal, cross-regional national language) plus a bahasa daerah (Javanese, Sundanese, Batak, Minang, Balinese…). A C2 speaker needn't speak a regional language but must RECOGNIZE its traces in someone's Indonesian: a Javanese logat (medok, with 'to', 'je', 'lho'), the blunt loud Medan/Batak manner, the soft Sundanese 'euy', 'atuh'. NATIVE-FLUENCY MARKERS (penanda kefasihan): (1) placing PARTICLES correctly — 'kan', 'sih', 'dong', 'kok', 'lho', 'deh', 'nih', 'tuh' — what textbooks can't teach; (2) sliding smoothly between baku (standard) and gaul (casual) by context; (3) getting a joke without translating it. Vietnamese has 'à, ạ, nhé, nha, đấy, cơ, mà' — functionally similar but NOT a 1-to-1 map; don't mechanically equate 'nhé' with 'ya'. Each Indonesian particle has its own colour: 'dong' (coaxing/urging), 'kok' (mild surprise or pushback), 'sih' (softening or pressing). Mastering this spectrum is the line between C1 'grammatically correct' and C2 'sounds native'.",
    tip_advice_vi:
      "BẢNG PARTIKEL CỐT LÕI (gaul nhưng ai cũng dùng):\n• -kah / -lah → trang trọng/nhấn ('Benarkah?' Thật sao?; 'Duduklah' Mời ngồi).\n• kan → 'chẳng phải… sao' / tìm đồng tình ('Enak, kan?' Ngon mà, đúng không?).\n• sih → làm dịu hoặc gặng ('Kenapa sih?' Sao thế?; 'Mahal sih, tapi…' Đắt thì đắt, nhưng…).\n• dong → thúc giục nhẹ, nũng ('Ikut dong!' Cho đi với mà!).\n• kok → ngạc nhiên/phản bác nhẹ ('Kok bisa?' Sao lại thế được?).\n• lho/loh → cảnh báo hoặc 'ơ kìa' ('Awas lho!' Coi chừng đấy!).\n• deh → đồng ý xuôi theo ('Ya udah deh' Thôi được rồi vậy).\n\nCHUYỂN REGISTER: trong phỏng vấn việc/họp → baku (saya, tidak, sudah, bagaimana). Với bạn bè → gaul (gue/aku, nggak, udah, gimana). Người C2 đổi mượt theo người nghe; trộn sai chỗ (gaul trong họp trang trọng, hoặc baku cứng nhắc với bạn thân) là dấu hiệu chưa thành thạo.\n\nĐỂ ĐÙA TINH TẾ (sindiran halus): khen quá lời để ngầm chê ('Wah, rajin sekali, sampai jam sebelas baru datang' — Chà, chăm chỉ ghê, mười một giờ mới tới). Giữ giọng đều, để ngữ cảnh làm phần còn lại.\n\nTRÁNH: dịch partikel máy móc. Lạm dụng gaul trong văn cảnh trang trọng. Cười cợt về SARA. Cố nhại logat vùng miền nếu chưa nắm vững — dễ thành nhạo báng (mengejek), kém duyên.",
    tip_advice_en:
      "Core particle table (casual but universal): '-kah/-lah' = formal emphasis ('Benarkah?' Really?; 'Duduklah' Do sit); 'kan' = isn't it / seeking agreement ('Enak, kan?'); 'sih' = soften or press ('Kenapa sih?'); 'dong' = gentle urging/coaxing ('Ikut dong!'); 'kok' = surprise/mild pushback ('Kok bisa?'); 'lho/loh' = warning or 'hey now' ('Awas lho!'); 'deh' = grudging agreement ('Ya udah deh'). Register-switch: job interviews/meetings → baku (saya, tidak, sudah, bagaimana); friends → gaul (gue/aku, nggak, udah, gimana). A C2 speaker slides smoothly with the audience; mixing wrong (slang in a formal meeting, stiff baku with close friends) flags non-mastery. For subtle humor (sindiran halus), over-praise to imply a dig ('Wah, rajin sekali, sampai jam sebelas baru datang' — 'Wow, so diligent, only showed up at eleven'); keep a flat tone and let context do the work. Avoid: translating particles mechanically, overusing gaul in formal settings, joking about SARA, and mimicking regional accents you don't command — it easily reads as mockery (mengejek).",
    vocabulary: [
      { cell_id: "6c8067fd-6478-4f57-b696-46e45b3a503e", word: "sindiran", en: "innuendo / a snide remark", vi: "lời móc mỉa", pos: "n.", pronunciation_vi: "sin-DI-ran", pronunciation_en: "seen-DEE-ran — sindiran halus = a subtle dig" },
      { cell_id: "67295442-07e7-4a96-aae2-239bd168567f", word: "satire / satir", en: "satire", vi: "châm biếm", pos: "n.", pronunciation_vi: "SA-tir", pronunciation_en: "SA-teer — 'satire menggigit' = biting satire" },
      { cell_id: "ea2d8a5e-5e09-40bb-a552-963f7ac653f5", word: "lelucon", en: "a joke", vi: "câu chuyện cười", pos: "n.", pronunciation_vi: "lơ-LU-chon", pronunciation_en: "luh-LOO-chon — 'c' = 'ch'" },
      { cell_id: "64c183c4-d556-463c-95d9-638e8a295cdf", word: "logat", en: "accent / regional dialect", vi: "giọng vùng miền", pos: "n.", pronunciation_vi: "LO-gat", pronunciation_en: "LOH-gat — logat Jawa/Medan/Sunda" },
      { cell_id: "8cc044e9-e07a-4c87-8399-984e80d37bbc", word: "penutur asli", en: "native speaker", vi: "người bản ngữ", pos: "n.", pronunciation_vi: "pơ-NU-tur AS-li", pronunciation_en: "puh-NOO-toor AS-lee — lit. 'original speaker'" },
      { cell_id: "47b67840-0bab-4294-97d2-3b65055c696a", word: "baku", en: "standard / formal (language)", vi: "(ngôn ngữ) chuẩn", pos: "adj.", pronunciation_vi: "BA-ku", pronunciation_en: "BA-koo — bahasa baku, the formal register" },
      { cell_id: "acd06881-b5f4-49fa-b628-ae1426afafeb", word: "gaul", en: "slang / hip casual register", vi: "tiếng lóng, đời thường", pos: "adj.", pronunciation_vi: "GA-ul", pronunciation_en: "GA-ool — bahasa gaul, Jakarta casual speech" },
      { cell_id: "c302d767-85ae-45a0-9d31-9f6f8ece291b", word: "baper", en: "to get over-emotional / take it personally", vi: "để bụng, đa cảm", pos: "v. (slang)", pronunciation_vi: "BA-pơr", pronunciation_en: "BA-pur — clipped from 'bawa perasaan'" },
      { cell_id: "412d476a-47c9-4f42-b341-355bac494065", word: "justru", en: "precisely / on the contrary", vi: "chính là, trái lại", pos: "adv.", pronunciation_vi: "JUS-tru", pronunciation_en: "JOOS-troo — a C2 pivot for irony/contrast" },
      { cell_id: "5e020502-9bdb-4843-99dc-ff167eab557d", word: "kefasihan", en: "fluency", vi: "sự lưu loát, thông thạo", pos: "n.", pronunciation_vi: "kơ-fa-SI-han", pronunciation_en: "kuh-fa-SEE-han — ke-fasih-an, from fasih (fluent)" },
    ],
    dialogue: [
      { cell_id: "b868ca61-c1fb-428e-b6f9-cb92221b6920", speaker: "Rina", text: "Eh, kamu udah baca kolom satir di Mojok tadi? Nyindir banget, tapi nggak nyebut nama.", vi: "Này, cậu đọc cột châm biếm trên Mojok lúc nãy chưa? Móc mỉa cực kỳ, mà chẳng nêu tên ai.", en: "Hey, did you read the satire column on Mojok? So snide, but it names no one." },
      { cell_id: "be76c248-6702-48a7-ac2a-f7a0f0c56cda", speaker: "Dimas", text: "Udah dong. Justru karena halus itu yang bikin nampar. Kalau kasar mah malah nggak kena.", vi: "Đọc rồi chứ. Chính vì nó tinh tế nên mới đau. Thô lỗ thì lại chẳng thấm.", en: "Of course. It's precisely the subtlety that stings. If it were crude it wouldn't land." },
      { cell_id: "4f3b5195-c3d9-4ff3-96b5-18b2d83932f3", speaker: "Rina", text: "Nah, itu dia. Penulisnya penutur asli banget rasa bahasanya — kita mah masih nerjemahin dalam kepala, ya kan?", vi: "Đấy, đúng vậy. Cảm ngôn ngữ của tác giả đúng chất bản ngữ — bọn mình vẫn còn dịch trong đầu, đúng không?", en: "Right, exactly. The writer's feel for the language is so native — we still translate in our heads, don't we?" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Tenang, jangan ___ — itu cuma cara orang Jakarta bercanda; kalau diledek, tandanya sudah dianggap teman.",
        answer: "baper",
        hint_vi: "tiếng lóng = để bụng, đa cảm (rút gọn của 'bawa perasaan')",
        hint_en: "slang for taking things too personally (short for 'bawa perasaan')",
      },
      {
        type: "matching",
        pairs: [
          ["sindiran", "lời móc mỉa"],
          ["logat", "giọng vùng miền"],
          ["penutur asli", "người bản ngữ"],
          ["baku", "(ngôn ngữ) chuẩn"],
        ],
        instruction: "Nối thuật ngữ về register và phương ngữ với nghĩa tiếng Việt.",
        instruction_en: "Match each register/dialect term with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Lối châm biếm ấy sắc nhất chính vì nó chưa một lần lớn tiếng.",
        indonesian: "Satire itu paling menggigit justru karena tak sekali pun meninggikan suara.",
        english: "That satire bites hardest precisely because it never once raises its voice.",
        hint_vi: "'justru karena' = chính vì; 'tak sekali pun' = chưa một lần nào",
        hint_en: "'justru karena' = precisely because; 'tak sekali pun' = not even once",
      },
    ],
  },
];

export default lessons;
