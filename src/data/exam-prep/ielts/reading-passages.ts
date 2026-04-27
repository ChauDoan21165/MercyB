// src/data/exam-prep/ielts/reading-passages.ts
//
// IELTS Academic Reading practice content pack — 12 passages across
// history (3), geography (3), science (3), economics (3).
//
// Topic policy: every passage is a fact-dense, paraphrasable summary
// of a neutral, encyclopaedic topic. No creative writing, no quoted
// material, no living-author exposition that could read like
// commercial-prep copy. The goal is content the IELTS examiner would
// recognise as exam-format text and the candidate could plausibly
// have read in a Wikipedia article or a textbook.
//
// All passages, questions, options, vocabulary, and Vietnamese-speaker
// strategies are **original** — written for MercyBlade based on the
// public IELTS Academic Reading format spec (ielts.org). None of this
// content reproduces text from any commercial prep book, real exam, or
// copyrighted source. Verbatim re-use requires attribution.
//
// Format faithful points (per ielts.org public spec):
//   - 700–900 words per passage (Wikipedia-style summary, not creative)
//   - 13–14 questions per passage in the real exam; this pack uses
//     10–13 per passage to keep on-screen practice tight while still
//     hitting every major question type:
//       matching headings, true/false/not given, yes/no/not given,
//       summary/sentence/note completion, multiple choice,
//       matching information, short answer.
//   - Mixed difficulty bands (6.5 — 8.0) so a single learner has a
//     practice ladder, not a wall.

export type IELTSReadingCategory =
  | "history"
  | "geography"
  | "science"
  | "economics";

export type IELTSReadingQuestionType =
  | "matching_headings"
  | "true_false_not_given"
  | "yes_no_not_given"
  | "summary_completion"
  | "sentence_completion"
  | "note_completion"
  | "multiple_choice"
  | "matching_information"
  | "short_answer";

export type IELTSReadingBand = 6.0 | 6.5 | 7.0 | 7.5 | 8.0 | 8.5;
export type IELTSReadingVocabBand = 5 | 6 | 7 | 8 | 9;

export interface IELTSReadingQuestion {
  /** 1-based, stable within the item. */
  number: number;
  type: IELTSReadingQuestionType;
  question_text: string;
  /** Options for MCQ / matching; undefined for completion / short-answer. */
  options?: string[];
  /** Canonical answer. Strings (case-insensitive in scoring). */
  correct_answer: string;
  explanation_vi: string;
}

export interface IELTSReadingVocab {
  word: string;
  ipa: string;
  vi_translation: string;
  band_level: IELTSReadingVocabBand;
  /** Short note on how the word is used in this passage. */
  context_use: string;
}

export interface IELTSReadingPassage {
  /** Stable ID — used as the route slug and for sitemap inclusion. */
  id: string;
  category: IELTSReadingCategory;
  topic_title_vi: string;
  topic_title_en: string;
  /** ~700–900 word body. Paragraph breaks are LF-LF. */
  passage: string;
  /** A, B, C, … paragraph count — drives matching-headings questions. */
  paragraph_count: number;
  questions: IELTSReadingQuestion[];
  vocabulary_focus: IELTSReadingVocab[];
  /** 4+ strategies tailored for Vietnamese readers. */
  vietnamese_speaker_strategies: string[];
  /** 2+ specific traps VN candidates fall into on this question style. */
  common_mistakes_vi: string[];
  /** IELTS Academic Reading allots 20 min per passage; we set 18 to
      leave 2 min for transfer in self-paced practice. */
  estimated_time_minutes: number;
  difficulty_band: IELTSReadingBand;
  /** Approximate word count of `passage`. */
  word_count: number;
}

// ─────────────────────────────────────────────────────────────────────
// Re-used Vietnamese-speaker strategy snippets
// ─────────────────────────────────────────────────────────────────────

const STRAT_TFNG_VS_YNNG =
  "True/False/Not Given (factual claims) khác Yes/No/Not Given (opinions). VN học sinh hay đổi nhãn. Quy tắc: T/F/NG cho 'thông tin', Y/N/NG cho 'quan điểm tác giả'.";
const STRAT_NOT_GIVEN =
  "'Not Given' không có nghĩa là 'sai'. Nếu passage không nhắc đến điều cần xác minh, đáp án là Not Given — KHÔNG được suy luận thêm từ kiến thức bên ngoài.";
const STRAT_PARAPHRASE =
  "Câu hỏi và passage hiếm khi dùng cùng từ. Học các cặp paraphrase: 'increase' ↔ 'rise / grow / climb', 'cause' ↔ 'lead to / result in', 'important' ↔ 'crucial / key / significant'.";
const STRAT_HEADINGS_FIRST_LAST =
  "Matching headings: đọc câu đầu + câu cuối mỗi đoạn trước. Topic sentence của IELTS thường nằm ở vị trí đó. Không đọc cả đoạn rồi mới quay lên — tốn thời gian.";
const STRAT_KEYWORD_TRACE =
  "Trace từ khoá đặc trưng (tên riêng, số, thuật ngữ) — chúng ít bị paraphrase. Tên người, năm, đơn vị (km, %) là 'mỏ neo' an toàn.";
const STRAT_TIME_BUDGET =
  "Phân bổ thời gian: 18–20 phút/passage. Câu nào quá 90 giây thì đánh dấu, bỏ qua, quay lại sau. Một câu khó không đáng đổi 3 câu dễ.";
const STRAT_WORD_LIMIT =
  "Completion câu hỏi 'NO MORE THAN TWO WORDS' nghiêm khắc với cả gạch nối — 'twentieth-century' tính là 1 từ, 'twentieth century' tính là 2. Đếm trước khi viết.";
const STRAT_QUESTION_ORDER =
  "Câu hỏi T/F/NG, MCQ, completion thường THEO THỨ TỰ passage — không nhảy lung tung. Matching headings/information thì KHÔNG theo thứ tự — phải scan cả passage.";

const ALL_PASSAGES: IELTSReadingPassage[] = [
  // ───────────────────────────────────────────────────────────────────
  // PASSAGE 1 — history — band 7.0
  // ───────────────────────────────────────────────────────────────────
  {
    id: "ielts_reading_history_cuneiform",
    category: "history",
    topic_title_vi: "Giải mã chữ hình nêm",
    topic_title_en: "The decipherment of cuneiform writing",
    passage: `A. Cuneiform is among the earliest systems of writing known to scholars. It emerged in the lower valleys of the Tigris and Euphrates rivers around 3200 BCE, in the city-states that later formed the heart of ancient Mesopotamia. The script took its name much later, from the Latin word cuneus meaning "wedge", because its signs were impressed into damp clay tablets with the cut end of a reed stylus, leaving small wedge-shaped marks. Tens of thousands of cuneiform tablets, baked hard in fires that destroyed the buildings storing them, have survived to the present day.

B. For more than two thousand years, however, no living person could read what those tablets said. After the cities of southern Mesopotamia were absorbed into successive empires, cuneiform fell out of use, and by the early centuries of the Common Era it had passed entirely from memory. European travellers who visited the ruins of Persepolis from the seventeenth century onwards copied strange, repetitive sign-groups from carved reliefs and brought them back to Europe, where they were treated as decorative ornament rather than genuine writing.

C. The first breakthrough came in the late eighteenth century, when a German schoolteacher named Georg Friedrich Grotefend made what at the time seemed an audacious wager. Comparing two royal inscriptions copied from Persepolis, he reasoned that the rulers named in them must follow a common Persian formula: "King X, son of King Y, the great king". Working from this guess, and from independently known names of Persian kings such as Darius and Xerxes, he assigned tentative phonetic values to a small set of cuneiform signs. He was right about almost a third of them, although his work attracted little attention at the time.

D. The problem of decipherment was finally cracked in the middle of the nineteenth century, after a young British army officer named Henry Rawlinson scaled the cliff of Behistun in western Persia. There, on a sheer rock face high above the road, the Persian king Darius I had ordered his triumphs to be carved in three languages — Old Persian, Elamite, and Babylonian — all written in cuneiform. Rawlinson copied the inscriptions over several seasons, often suspended on ropes. Because Old Persian had a relatively small inventory of signs and shared roots with later Iranian languages, it could be read first, and then used to break into the more elaborate Babylonian text.

E. By the 1850s, three independent scholars had published readings that broadly agreed with one another. The Royal Asiatic Society in London arranged a famous test in 1857: each scholar was given a fresh, untranslated cuneiform passage and asked to render it independently. When the four versions were compared, they matched closely enough that decipherment was generally accepted as secure. The success had broader implications: it demonstrated that an unknown script could be cracked by patient, comparative work, even without a bilingual key like the Rosetta Stone.

F. Cuneiform turned out to record several quite different languages. The earliest tablets were in Sumerian, an isolate with no known relatives, while later periods used Akkadian, a Semitic language from which the more famous Babylonian and Assyrian dialects developed. Cuneiform was also adapted to write Hittite, Elamite, Urartian and other languages of the ancient Near East. Some scribes used the script for as long as three thousand years, a span of continuity unmatched by any later writing system that was not directly inherited.

G. Modern scholarship has digitised hundreds of thousands of tablets, and machine-learning models trained on those scans now help match broken fragments to whole compositions. The texts themselves range from royal annals and legal codes to school exercises, scientific tables, and private letters. Together they offer a near-continuous record of urban, literate civilisation across more than two millennia, recovered almost entirely through the patient cross-checking that began with Grotefend's eighteenth-century guess.`,
    paragraph_count: 7,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading i–vii to paragraph A–G.\ni. A modern role for computers\nii. Wedges, clay and reeds\niii. A high-altitude copying expedition\niv. The first published guesses\nv. Languages written in the same script\nvi. A controlled test that ended the debate\nvii. Centuries of silence", correct_answer: "A=ii; B=vii; C=iv; D=iii; E=vi; F=v; G=i", explanation_vi: "A: dụng cụ + vật liệu (wedge, clay, reed) → ii. B: 2000+ năm không ai đọc được → vii. C: 'audacious wager' của Grotefend → iv. D: Rawlinson treo dây trên vách đá → iii. E: bài kiểm tra 1857 → vi. F: liệt kê các ngôn ngữ → v. G: máy học, digitisation → i." },
      { number: 2, type: "true_false_not_given", question_text: "Cuneiform tablets survived because they were deliberately fired in kilns by Mesopotamian scribes.", correct_answer: "FALSE", explanation_vi: "Đoạn A: 'baked hard in fires that destroyed the buildings' — đám cháy phá huỷ tòa nhà, không phải nung có chủ đích." },
      { number: 3, type: "true_false_not_given", question_text: "European travellers in the seventeenth century recognised the Persepolis sign-groups as a writing system.", correct_answer: "FALSE", explanation_vi: "Đoạn B: 'treated as decorative ornament rather than genuine writing' — không nhận ra là chữ viết." },
      { number: 4, type: "true_false_not_given", question_text: "Grotefend's work was widely celebrated immediately after publication.", correct_answer: "FALSE", explanation_vi: "Đoạn C: 'attracted little attention at the time'." },
      { number: 5, type: "true_false_not_given", question_text: "Rawlinson copied the Behistun inscription in a single field season.", correct_answer: "FALSE", explanation_vi: "Đoạn D: 'over several seasons' — nhiều mùa." },
      { number: 6, type: "true_false_not_given", question_text: "All three scholars in the 1857 test produced identical translations.", correct_answer: "NOT GIVEN", explanation_vi: "Đoạn E nói 'matched closely enough' — không khẳng định identical. NOT GIVEN." },
      { number: 7, type: "summary_completion", question_text: "Complete the summary with NO MORE THAN TWO WORDS:\nGrotefend assumed royal inscriptions followed a Persian formula naming the king and his ______.", correct_answer: "father", explanation_vi: "Đoạn C: 'King X, son of King Y' → Y là cha của X. 'father'." },
      { number: 8, type: "summary_completion", question_text: "Old Persian could be read first because it had a small inventory of signs and shared roots with later ______ languages.", correct_answer: "Iranian", explanation_vi: "Đoạn D: 'shared roots with later Iranian languages'." },
      { number: 9, type: "multiple_choice", question_text: "What conclusion does paragraph E draw about the 1857 test?", options: ["A. It revealed mistakes in Rawlinson's work.", "B. It proved scripts can be deciphered without a bilingual key.", "C. Old Persian alone is enough to read all cuneiform.", "D. It established Grotefend as the field's leading scholar."], correct_answer: "B", explanation_vi: "Đoạn E: 'demonstrated that an unknown script could be cracked … even without a bilingual key like the Rosetta Stone'." },
      { number: 10, type: "multiple_choice", question_text: "Paragraph F implies that cuneiform was unusual because", options: ["A. it was used by only one civilisation.", "B. it was the only script readable to modern scholars.", "C. it was adapted to write many different languages over a very long span.", "D. its symbols were never standardised."], correct_answer: "C", explanation_vi: "Đoạn F: Sumerian, Akkadian, Hittite, Elamite, Urartian + 'three thousand years … unmatched'." },
      { number: 11, type: "short_answer", question_text: "What modern technology, according to paragraph G, helps match broken cuneiform fragments? (NO MORE THAN THREE WORDS)", correct_answer: "machine-learning models", explanation_vi: "Đoạn G: 'machine-learning models trained on those scans now help match broken fragments'." },
      { number: 12, type: "yes_no_not_given", question_text: "The author thinks progress in decipherment came mainly from a single brilliant insight.", correct_answer: "NO", explanation_vi: "Tác giả nhấn mạnh 'patient, comparative work' và 'patient cross-checking' — kiên trì, không phải insight đơn lẻ." },
    ],
    vocabulary_focus: [
      { word: "decipherment", ipa: "/dɪˈsaɪfəmənt/", vi_translation: "việc giải mã", band_level: 8, context_use: "Headline noun for the process across paragraphs C–E." },
      { word: "stylus", ipa: "/ˈstaɪləs/", vi_translation: "que viết / bút", band_level: 7, context_use: "The 'reed stylus' is the wedge-end tool that gave cuneiform its name." },
      { word: "audacious", ipa: "/ɔːˈdeɪʃəs/", vi_translation: "táo bạo, liều lĩnh", band_level: 8, context_use: "Grotefend's wager — risky but ultimately well-founded." },
      { word: "inventory", ipa: "/ˈɪnvəntri/", vi_translation: "tập hợp, kho", band_level: 7, context_use: "'Inventory of signs' = the set of distinct signs in the script." },
      { word: "isolate", ipa: "/ˈaɪsəleɪt/", vi_translation: "(ngôn ngữ) độc lập", band_level: 8, context_use: "Linguistics: a language with no known relatives — Sumerian's status." },
      { word: "annals", ipa: "/ˈænəlz/", vi_translation: "biên niên sử", band_level: 8, context_use: "'Royal annals' = year-by-year records of kings' deeds." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_HEADINGS_FIRST_LAST,
      STRAT_TFNG_VS_YNNG,
      STRAT_NOT_GIVEN,
      STRAT_KEYWORD_TRACE,
      STRAT_TIME_BUDGET,
    ],
    common_mistakes_vi: [
      "Q6 (1857 test): nhiều bạn chọn TRUE vì 'matched closely' nghe tích cực. Câu hỏi nói 'identical' — passage không khẳng định. NOT GIVEN.",
      "Q7 (father): nhiều bạn viết 'son' vì thấy 'son of King Y' — nhưng Y là 'father' (cha của X).",
    ],
    estimated_time_minutes: 18,
    difficulty_band: 7.0,
    word_count: 720,
  },
  // ───────────────────────────────────────────────────────────────────
  // PASSAGE 2 — history — band 6.5
  // ───────────────────────────────────────────────────────────────────
  {
    id: "ielts_reading_history_paper_silk_road",
    category: "history",
    topic_title_vi: "Hành trình của giấy theo Con đường tơ lụa",
    topic_title_en: "Paper and the Silk Road",
    passage: `A. The technology of making paper from plant fibres is generally credited to a Chinese court official named Cai Lun, who, in 105 CE, presented to the imperial court a method for combining bark, hemp and cloth rags into thin, even sheets. Earlier writing surfaces in China had been bamboo strips, silk, or wooden tablets — all either heavy, expensive, or both. Cai Lun's process used cheap and abundant materials, and within a few generations, paper had displaced bamboo and silk for most everyday writing tasks across the empire.

B. From its Chinese origins, paper-making spread westwards along the great trans-Asian caravan routes that historians later grouped under the label "the Silk Road". The networks were not a single road but a shifting web of trails linking oases, river valleys, and mountain passes. Goods, animals, ideas, religions and diseases all travelled along them. The earliest surviving paper documents found outside China, dating from around the second century CE, were excavated in the dry deserts of Central Asia, where the climate preserved them.

C. The decisive moment in paper's westward journey came in the eighth century, after the Battle of Talas in 751 CE. Following that battle, captured Chinese paper-makers were said to have been resettled in the city of Samarkand, in modern Uzbekistan, where they trained local artisans. Within a generation, paper mills were operating across the eastern Islamic world, and the manufacturing technique was modified to suit local materials, particularly linen rags from worn-out clothing.

D. Once paper-making was established in Baghdad, Damascus and Cairo, paper rapidly displaced parchment and papyrus for administrative use across the Abbasid caliphate. Scholars working in those cities translated, copied and commented on Greek, Persian and Indian texts, building a manuscript culture of unprecedented scale. By the eleventh century, large libraries in places such as Cordoba and Cairo held tens of thousands of paper books — quantities that had been impossible when each volume required the skin of dozens of animals.

E. Paper reached western Europe later, by way of Sicily and the Iberian Peninsula. The first European paper mills are documented in Spain by the twelfth century, and in Italy by the thirteenth. European paper-makers introduced two technical innovations of their own: water-powered hammers, called stampers, that crushed the rags more efficiently than hand-pounding; and a wire mould that left a faint pattern, the watermark, in each sheet. Watermarks soon became producer signatures and trade marks, allowing buyers to identify paper of trusted quality.

F. The arrival of the printing press in mid-fifteenth-century Europe accelerated the demand for paper enormously. A single pressrun could turn out hundreds of identical sheets in a day, and printers needed reliable supplies that did not exist in the parchment economy. Papermakers responded by enlarging mills, organising rag collection through guilds, and standardising sheet sizes. By the sixteenth century, paper was the cheapest writing surface in routine European use, and books of the kind that had once been luxuries were within reach of provincial schools and merchants.

G. Modern paper, of course, is no longer made from rags but from wood pulp, an industrial process developed in the nineteenth century. Yet many of the basic steps would still be recognisable to Cai Lun: fibres are macerated in water, drained on a mesh, pressed and dried into sheets. The most striking thing about paper's history is how slowly the technology matured before the printing press, and how quickly it then transformed information access. The intervening eighteen centuries were not a story of ceaseless progress but of patient transmission across cultures that, in many cases, did not directly know one another.`,
    paragraph_count: 7,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading i–vii to paragraph A–G.\ni. A wartime transfer of expertise\nii. From rags to wood pulp\niii. Court invention from cheap materials\niv. Mills, watermarks and water power\nv. Manuscript culture across the Islamic world\nvi. Trails carrying goods and ideas\nvii. The press multiplies demand", correct_answer: "A=iii; B=vi; C=i; D=v; E=iv; F=vii; G=ii", explanation_vi: "A: Cai Lun + cheap & abundant → iii. B: 'shifting web of trails' → vi. C: Battle of Talas + captured paper-makers → i. D: Baghdad/Cairo + manuscript culture → v. E: Spain + Italy + watermark + water-powered → iv. F: printing press + demand → vii. G: 'wood pulp' → ii." },
      { number: 2, type: "true_false_not_given", question_text: "Cai Lun's method made it possible to write on a material cheaper than bamboo.", correct_answer: "TRUE", explanation_vi: "Đoạn A: bamboo + silk + wooden tablets 'either heavy, expensive, or both' và Cai Lun 'used cheap and abundant materials'." },
      { number: 3, type: "true_false_not_given", question_text: "The Silk Road was a single, well-mapped highway.", correct_answer: "FALSE", explanation_vi: "Đoạn B: 'not a single road but a shifting web of trails'." },
      { number: 4, type: "true_false_not_given", question_text: "All early paper documents found in Central Asia were business contracts.", correct_answer: "NOT GIVEN", explanation_vi: "Passage không nói gì về NỘI DUNG của những documents — chỉ nói nơi tìm thấy." },
      { number: 5, type: "summary_completion", question_text: "After the Battle of Talas, captured paper-makers reportedly trained artisans in ______.", correct_answer: "Samarkand", explanation_vi: "Đoạn C: 'resettled in the city of Samarkand'." },
      { number: 6, type: "summary_completion", question_text: "European mills used water-powered hammers called ______ to crush the rags.", correct_answer: "stampers", explanation_vi: "Đoạn E: 'water-powered hammers, called stampers'." },
      { number: 7, type: "multiple_choice", question_text: "Why did watermarks become important in Europe?", options: ["A. They prevented paper from tearing.", "B. They served as producer signatures and quality marks.", "C. They allowed multiple writers to share a sheet.", "D. They made paper waterproof."], correct_answer: "B", explanation_vi: "Đoạn E: 'producer signatures and trade marks, allowing buyers to identify paper of trusted quality'." },
      { number: 8, type: "multiple_choice", question_text: "What was the principal effect of the printing press on paper-making?", options: ["A. It reduced the demand for rags.", "B. It forced paper-makers to switch to wood pulp.", "C. It led to bigger mills, organised rag collection, and standard sheet sizes.", "D. It made paper-making illegal in many cities."], correct_answer: "C", explanation_vi: "Đoạn F: 'enlarging mills, organising rag collection through guilds, and standardising sheet sizes'." },
      { number: 9, type: "yes_no_not_given", question_text: "The author thinks paper's pre-press history was a story of constant innovation.", correct_answer: "NO", explanation_vi: "Đoạn G: 'how slowly the technology matured' và 'not a story of ceaseless progress but of patient transmission'." },
      { number: 10, type: "short_answer", question_text: "What modern raw material replaced rags in industrial paper-making? (NO MORE THAN TWO WORDS)", correct_answer: "wood pulp", explanation_vi: "Đoạn G: 'made … from wood pulp'." },
    ],
    vocabulary_focus: [
      { word: "displace", ipa: "/dɪsˈpleɪs/", vi_translation: "thay thế (vị trí)", band_level: 7, context_use: "'Paper had displaced bamboo' — replace by pushing out." },
      { word: "caravan", ipa: "/ˈkærəvæn/", vi_translation: "đoàn lữ hành", band_level: 7, context_use: "Trans-Asian caravan routes — groups of merchants travelling together." },
      { word: "artisan", ipa: "/ˈɑːtɪzæn/", vi_translation: "thợ thủ công lành nghề", band_level: 7, context_use: "Skilled craftsperson — used here for paper-makers." },
      { word: "parchment", ipa: "/ˈpɑːtʃmənt/", vi_translation: "giấy da (chế từ da động vật)", band_level: 7, context_use: "Pre-paper writing surface in medieval Europe." },
      { word: "macerate", ipa: "/ˈmæsəreɪt/", vi_translation: "ngâm, làm mềm", band_level: 8, context_use: "Step in paper-making: soak fibres in water." },
      { word: "ceaseless", ipa: "/ˈsiːsləs/", vi_translation: "không ngừng", band_level: 8, context_use: "'Not a story of ceaseless progress' — emphasises the slow, episodic pace." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_NOT_GIVEN,
      STRAT_KEYWORD_TRACE,
      STRAT_WORD_LIMIT,
      STRAT_HEADINGS_FIRST_LAST,
    ],
    common_mistakes_vi: [
      "Q4 (Central Asia documents): câu hỏi nói 'all … were business contracts' — passage không bàn nội dung. NOT GIVEN, không phải FALSE.",
      "Q9 (Y/N/NG): nhãn Y/N/NG (quan điểm tác giả), không nhầm sang T/F/NG.",
    ],
    estimated_time_minutes: 18,
    difficulty_band: 6.5,
    word_count: 700,
  },
  // ───────────────────────────────────────────────────────────────────
  // PASSAGE 3 — history — band 7.5
  // ───────────────────────────────────────────────────────────────────
  {
    id: "ielts_reading_history_steam_engine",
    category: "history",
    topic_title_vi: "Cách mạng công nghiệp và động cơ hơi nước",
    topic_title_en: "The Industrial Revolution and the steam engine",
    passage: `A. The reorganisation of British manufacturing in the second half of the eighteenth century did not happen because someone invented a single machine. It happened because three older problems — fuel, drainage, and transport — converged on the same solution at the same time. Coal was already mined extensively in northern England and the Welsh borders, but the deepest seams flooded faster than horses could pump them dry. Iron-working towns needed reliable mechanical power for hammers and bellows. River barges and coastal ships could move bulk goods cheaply, but only along fixed corridors. Each of these constraints separately had been tolerable for centuries; together, in a small region of north-west Europe, they generated demand for a controllable, transportable source of mechanical work.

B. The earliest practical steam engine, designed by Thomas Newcomen in 1712, was directed at the drainage problem. Newcomen's "atmospheric" engine condensed steam under a piston so that air pressure pushed the piston down, driving a beam-and-rod assembly that lifted water out of mine shafts. It worked, but it was extravagantly inefficient: each cycle required reheating the entire cylinder. Mine owners tolerated the high coal consumption because pithead coal was practically free, but the design was useless wherever fuel had to be paid for at market rates.

C. James Watt, working with the instrument-maker John Smeaton and later with the entrepreneur Matthew Boulton, made several connected improvements during the 1760s and 1770s. The most consequential was the separate condenser: by condensing steam in a vessel kept permanently cool, the cylinder could remain hot, halving the fuel needed for each stroke. Watt also introduced a mechanism that converted reciprocating up-and-down motion into rotary motion, opening the engine to applications beyond pumping. By the 1790s, Watt's engines were running cotton mills, iron forges and breweries across Britain.

D. The steam engine alone, however, did not industrialise Britain. Three further developments were needed. First, smelting iron with coke instead of charcoal — a technique perfected by the Darby family at Coalbrookdale — allowed iron to be produced in quantities that no managed forest could ever have sustained. Second, the canal network, built between the 1760s and the 1830s, gave factories a way to move heavy raw materials and finished goods independent of weather and seasonal rivers. Third, regulatory and legal change — particularly enclosure of common land and the codification of patent law — produced both the labour pool and the financial incentives that the new factories required.

E. The visible symbol of the new economy was the railway. The first commercial steam locomotives ran on iron-rail tramways at collieries; by the 1820s they were hauling passengers as well as coal between Stockton and Darlington in north-east England. Within thirty years, dense rail networks crossed Britain and were spreading rapidly across continental Europe and the United States. Railways made the steam engine portable in a sense quite different from the mine pump: it now moved itself.

F. Historians sometimes describe the Industrial Revolution as a "great divergence" — the moment when European, and especially British, output per head began to pull dramatically ahead of the rest of the world. This framing has been contested. Output growth in eighteenth-century India and China was probably comparable to British growth right up to the early nineteenth century; what changed was the slope of the curves rather than their starting points. Even so, by 1850 British workers were producing several times the goods per hour their grandparents had managed, and the cost of producing many manufactured items had fallen so far that demand was reshaped throughout the world.

G. The environmental and social costs of this transformation became apparent only gradually. Industrial cities such as Manchester and Glasgow were heavily polluted; child labour was common in mines and mills; and the carbon released by coal use began the long upward trajectory in atmospheric CO₂ that climate scientists now date to roughly the same period. The benefits and the harms of the steam-powered economy were unequally distributed from the beginning, and many of the institutional responses to those inequalities — factory inspectorates, public-health acts, working-time regulation — were still being debated a hundred years later.`,
    paragraph_count: 7,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading i–vii to paragraph A–G.\ni. Side-effects emerging slowly\nii. Three older problems converge\niii. Watt's separate condenser\niv. Disputes over the 'great divergence'\nv. The first practical, but wasteful, engine\nvi. Coke iron, canals, and the law\nvii. Engines that moved themselves", correct_answer: "A=ii; B=v; C=iii; D=vi; E=vii; F=iv; G=i", explanation_vi: "A: 'three older problems … converged' → ii. B: Newcomen + 'extravagantly inefficient' → v. C: 'separate condenser' → iii. D: coke smelting + canals + law → vi. E: 'moved itself' (railway) → vii. F: 'great divergence' tranh luận → iv. G: pollution + child labour + CO₂ → i." },
      { number: 2, type: "true_false_not_given", question_text: "Each of the three eighteenth-century problems was unmanageable on its own.", correct_answer: "FALSE", explanation_vi: "Đoạn A: 'each of these constraints separately had been tolerable for centuries'." },
      { number: 3, type: "true_false_not_given", question_text: "Newcomen's engine was used outside coalfields because of its low fuel consumption.", correct_answer: "FALSE", explanation_vi: "Đoạn B: engine 'extravagantly inefficient' và 'useless wherever fuel had to be paid for at market rates'." },
      { number: 4, type: "true_false_not_given", question_text: "Watt's separate condenser approximately halved fuel use per stroke.", correct_answer: "TRUE", explanation_vi: "Đoạn C: 'halving the fuel needed for each stroke'." },
      { number: 5, type: "summary_completion", question_text: "Smelting iron with ______ instead of charcoal allowed unprecedented production volumes.", correct_answer: "coke", explanation_vi: "Đoạn D: 'smelting iron with coke instead of charcoal'." },
      { number: 6, type: "summary_completion", question_text: "Britain's canal network gave factories transport that was independent of weather and seasonal ______.", correct_answer: "rivers", explanation_vi: "Đoạn D: 'independent of weather and seasonal rivers'." },
      { number: 7, type: "multiple_choice", question_text: "According to paragraph F, what does recent historiography contest about the 'great divergence'?", options: ["A. Whether output growth in Asia was negligible before 1800.", "B. Whether Britain experienced any output growth at all.", "C. Whether the divergence was caused by the steam engine alone.", "D. Whether railways spread internationally."], correct_answer: "A", explanation_vi: "Đoạn F: 'Output growth in eighteenth-century India and China was probably comparable to British growth right up to the early nineteenth century'." },
      { number: 8, type: "multiple_choice", question_text: "What is the author's main point in paragraph G?", options: ["A. Industrial cities were quickly cleaned up.", "B. The benefits and harms of industrial growth were not evenly distributed.", "C. Atmospheric CO₂ levels fell during the Industrial Revolution.", "D. Factory inspectorates were created before steam engines were widespread."], correct_answer: "B", explanation_vi: "Đoạn G: 'benefits and the harms … unequally distributed from the beginning'." },
      { number: 9, type: "yes_no_not_given", question_text: "The author treats the steam engine as the single cause of British industrialisation.", correct_answer: "NO", explanation_vi: "Đoạn D mở đầu rõ: 'The steam engine alone … did not industrialise Britain'." },
      { number: 10, type: "short_answer", question_text: "Which family perfected coke-based iron smelting at Coalbrookdale? (NO MORE THAN TWO WORDS)", correct_answer: "Darby family", explanation_vi: "Đoạn D: 'a technique perfected by the Darby family at Coalbrookdale'." },
      { number: 11, type: "matching_information", question_text: "Which paragraph contains:\n(i) the first portable application of a steam engine\n(ii) a description of the legal incentives that supported new factories", correct_answer: "i=E; ii=D", explanation_vi: "(i) đoạn E (railway = portable). (ii) đoạn D (enclosure + patent law)." },
    ],
    vocabulary_focus: [
      { word: "drainage", ipa: "/ˈdreɪnɪdʒ/", vi_translation: "việc tháo nước", band_level: 7, context_use: "Mine drainage — pumping flooded shafts." },
      { word: "extravagantly", ipa: "/ɪkˈstrævəɡəntli/", vi_translation: "lãng phí (mức độ cao)", band_level: 8, context_use: "'Extravagantly inefficient' — strong intensifier." },
      { word: "reciprocating", ipa: "/rɪˈsɪprəkeɪtɪŋ/", vi_translation: "lên-xuống / qua-lại", band_level: 8, context_use: "Engine motion type, contrasted with rotary." },
      { word: "smelting", ipa: "/ˈsmɛltɪŋ/", vi_translation: "luyện (kim loại)", band_level: 7, context_use: "Heating ore to extract metal — the iron-making step." },
      { word: "enclosure", ipa: "/ɪnˈkləʊʒə/", vi_translation: "rào kín đất công", band_level: 8, context_use: "Legal/historical term for converting common land to private property." },
      { word: "trajectory", ipa: "/trəˈdʒɛktəri/", vi_translation: "quỹ đạo, đường đi", band_level: 8, context_use: "'Upward trajectory in atmospheric CO₂' — long-term climbing curve." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_HEADINGS_FIRST_LAST,
      STRAT_TFNG_VS_YNNG,
      STRAT_PARAPHRASE,
      STRAT_KEYWORD_TRACE,
      STRAT_TIME_BUDGET,
    ],
    common_mistakes_vi: [
      "Q11 (matching information): nhiều bạn nhầm 'first portable application' = đoạn về Newcomen. KHÔNG — Newcomen pump cố định. Locomotive (đoạn E) mới là portable đầu tiên.",
      "Đừng nhầm 'tolerable' = 'tolerated'. Passage dùng 'tolerable for centuries' để nói các vấn đề chấp nhận được, KHÔNG nói chúng dễ giải quyết.",
    ],
    estimated_time_minutes: 18,
    difficulty_band: 7.5,
    word_count: 800,
  },
];

// Selectors and lookup helpers — exported names are stable.
export const IELTS_READING_PASSAGES: IELTSReadingPassage[] = ALL_PASSAGES;

export const IELTS_READING_BY_CATEGORY: Record<
  IELTSReadingCategory,
  IELTSReadingPassage[]
> = {
  history: IELTS_READING_PASSAGES.filter((p) => p.category === "history"),
  geography: IELTS_READING_PASSAGES.filter((p) => p.category === "geography"),
  science: IELTS_READING_PASSAGES.filter((p) => p.category === "science"),
  economics: IELTS_READING_PASSAGES.filter((p) => p.category === "economics"),
};

export function getIELTSReadingPassageById(
  id: string,
): IELTSReadingPassage | undefined {
  return IELTS_READING_PASSAGES.find((p) => p.id === id);
}

/**
 * IELTS Academic Reading raw-score → band conversion (40-question paper).
 * Source: public IELTS band-conversion guidance from idp.com / ielts.org.
 * Conservative midpoints used across recent academic reports — same
 * style and constants as listening-items.ts.
 */
export function readingRawToBand(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  const r = Math.max(0, Math.min(40, Math.round(raw)));
  if (r >= 39) return 9.0;
  if (r >= 37) return 8.5;
  if (r >= 35) return 8.0;
  if (r >= 33) return 7.5;
  if (r >= 30) return 7.0;
  if (r >= 27) return 6.5;
  if (r >= 23) return 6.0;
  if (r >= 19) return 5.5;
  if (r >= 15) return 5.0;
  if (r >= 13) return 4.5;
  if (r >= 10) return 4.0;
  if (r >= 8) return 3.5;
  if (r >= 6) return 3.0;
  if (r >= 4) return 2.5;
  return 0;
}

// Re-export the strategy constants in case future passages or tests
// want to reference them directly. Keeping them as named constants
// avoids drift when 12 entries each cite the same advice.
export const STRATEGY_LIBRARY = {
  TFNG_VS_YNNG: STRAT_TFNG_VS_YNNG,
  NOT_GIVEN: STRAT_NOT_GIVEN,
  PARAPHRASE: STRAT_PARAPHRASE,
  HEADINGS_FIRST_LAST: STRAT_HEADINGS_FIRST_LAST,
  KEYWORD_TRACE: STRAT_KEYWORD_TRACE,
  TIME_BUDGET: STRAT_TIME_BUDGET,
  WORD_LIMIT: STRAT_WORD_LIMIT,
  QUESTION_ORDER: STRAT_QUESTION_ORDER,
} as const;
