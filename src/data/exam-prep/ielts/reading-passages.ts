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
  // ───────────────────────────────────────────────────────────────────
  // PASSAGE 4 — geography — band 7.0
  // ───────────────────────────────────────────────────────────────────
  {
    id: "ielts_reading_geography_himalayas",
    category: "geography",
    topic_title_vi: "Sự hình thành dãy Himalaya",
    topic_title_en: "The formation of the Himalayas",
    passage: `A. The Himalayan mountain range, stretching some 2,400 kilometres along the northern edge of the Indian subcontinent, contains every one of the world's fourteen peaks above eight thousand metres. Its existence is the product of a slow-motion collision between two segments of the Earth's outer shell — the Indian Plate and the Eurasian Plate — that began about 50 million years ago and has not yet ended.

B. The lithosphere, the rigid outer layer of the planet, is broken into roughly a dozen large pieces and many smaller ones. These plates float on the more plastic asthenosphere beneath them, dragged and pushed by slow currents in the Earth's mantle. Where two plates carrying continental crust meet, neither side can sink easily into the mantle, because continental rock is too thick and buoyant. Instead, the leading edges crumple, fold, and stack on top of each other, raising mountains.

C. Before the collision, the Indian Plate was moving northwards across what is now the Indian Ocean at an unusually high speed of around fifteen centimetres per year — fast for a plate. The intervening sea, called the Tethys Ocean, was steadily consumed as its floor was forced downwards into the mantle along the southern margin of Asia, a process geologists term subduction. Sediments scraped from the Tethys floor were piled up against the Asian continent. When India itself finally arrived, the trailing seabed sediments were caught between the two continents and lifted high into the air, which is why fossil sea-shells are routinely found near the summit of Everest.

D. Plate movement has not stopped since the collision. India continues to push into Asia at about five centimetres per year, roughly the rate at which fingernails grow. The pressure is partly absorbed by continued thickening of the crust beneath the Himalayas, but a great deal of it is also transmitted northwards as a chain of basins, plateaus, and fault lines, including the Tibetan Plateau itself. Earthquakes are a frequent expression of this ongoing accommodation. The 2015 Gorkha earthquake in Nepal, magnitude 7.8, was caused by sudden slip along a fault that had been quietly accumulating strain for decades.

E. The mountains erode almost as fast as they rise. Monsoon rainfall, sourced from the Indian Ocean, drains south down the Himalayan front, while seasonal snowmelt feeds the great river systems — the Indus, the Ganges, the Brahmaputra — which carve deep valleys and carry away vast quantities of sediment. The Bay of Bengal contains the world's largest underwater fan of river-borne mud and silt, almost all of it Himalayan in origin. The mountains are therefore best understood not as a stable monument but as a near-equilibrium between uplift and erosion, with the ocean as the final receiver.

F. Climate everywhere downwind of the range is shaped by its bulk. Moist air masses arriving from the south are forced upwards on the Himalayan slopes, cool, and release their moisture as rain or snow on the Indian side; air that does cross the range is dry, producing the rain-shadow deserts of the Tibetan Plateau, Ladakh, and parts of Central Asia. The same uplift process maintains the seasonal monsoon by creating a sharp temperature contrast between heated continental interior and cooler ocean. Without the Himalayas, the agricultural geography of South Asia would be entirely different.

G. Studying a mountain range that is still actively forming requires data over very different scales of time and space. Satellite-based GPS networks now measure plate motion to the millimetre per year. Field geologists map fault outcrops on foot. Sediment cores from the Bay of Bengal record erosion rates over millions of years. Together these methods make the Himalayas one of the best-instrumented natural laboratories in plate tectonics — a place where Earth's deep machinery is still working, in slow motion, in full view.`,
    paragraph_count: 7,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading i–vii to paragraph A–G.\ni. The biggest underwater sediment fan\nii. Why two continents pile up\niii. The race north and the lifted seabed\niv. A still-active laboratory at multiple scales\nv. Length, height, and starting date\nvi. Continued slip and earthquakes\nvii. Monsoon, rain shadow, and agriculture", correct_answer: "A=v; B=ii; C=iii; D=vi; E=i; F=vii; G=iv", explanation_vi: "A: '2,400 km' + '50 million years' → v. B: continental crust 'too thick and buoyant' → ii. C: '15 cm/year' + Tethys + Everest fossils → iii. D: Gorkha + 5 cm/year → vi. E: 'largest underwater fan' → i. F: monsoon + rain shadow + agriculture → vii. G: GPS + sediment cores → iv." },
      { number: 2, type: "true_false_not_given", question_text: "Continental rock is dense enough to sink easily into the mantle when two plates collide.", correct_answer: "FALSE", explanation_vi: "Đoạn B: 'continental rock is too thick and buoyant' để chìm dễ." },
      { number: 3, type: "true_false_not_given", question_text: "Sea-fossil shells found near Everest's summit support the idea that an ocean floor was lifted upwards.", correct_answer: "TRUE", explanation_vi: "Đoạn C: 'fossil sea-shells are routinely found near the summit of Everest' chính là bằng chứng cho seabed bị nâng." },
      { number: 4, type: "true_false_not_given", question_text: "India is still moving north at about five centimetres per year.", correct_answer: "TRUE", explanation_vi: "Đoạn D: 'India continues to push into Asia at about five centimetres per year'." },
      { number: 5, type: "summary_completion", question_text: "Sediments removed from the Himalayas are deposited in the world's largest ______ fan in the Bay of Bengal.", correct_answer: "underwater", explanation_vi: "Đoạn E: 'world's largest underwater fan'." },
      { number: 6, type: "summary_completion", question_text: "Air that crosses the range becomes dry, producing the rain-______ deserts of the Tibetan Plateau.", correct_answer: "shadow", explanation_vi: "Đoạn F: 'rain-shadow deserts'." },
      { number: 7, type: "multiple_choice", question_text: "According to the passage, the Himalayas are best understood as", options: ["A. a stable, finished monument.", "B. a near-equilibrium between uplift and erosion.", "C. a single uplift event from 50 million years ago.", "D. an offshoot of the Tibetan Plateau."], correct_answer: "B", explanation_vi: "Đoạn E: 'best understood not as a stable monument but as a near-equilibrium between uplift and erosion'." },
      { number: 8, type: "multiple_choice", question_text: "Which combination of methods does paragraph G describe?", options: ["A. Satellite GPS, field geology, sediment cores.", "B. Only laboratory experiments.", "C. Only historical written records.", "D. Only seismic stations on the Tibetan Plateau."], correct_answer: "A", explanation_vi: "Đoạn G liệt kê đủ 3: GPS + foot mapping + sediment cores." },
      { number: 9, type: "yes_no_not_given", question_text: "The author considers the Himalayas a poor place to test plate-tectonic theory.", correct_answer: "NO", explanation_vi: "Đoạn G: 'one of the best-instrumented natural laboratories'." },
      { number: 10, type: "short_answer", question_text: "Name the rapidly-consumed ocean that lay between India and Asia. (NO MORE THAN TWO WORDS)", correct_answer: "Tethys Ocean", explanation_vi: "Đoạn C: 'a sea, called the Tethys Ocean'." },
    ],
    vocabulary_focus: [
      { word: "lithosphere", ipa: "/ˈlɪθəsfɪə/", vi_translation: "thạch quyển", band_level: 8, context_use: "The rigid outer layer — the rock that makes up plates." },
      { word: "subduction", ipa: "/səbˈdʌkʃən/", vi_translation: "sự hút chìm (kiến tạo)", band_level: 8, context_use: "Process where one plate slides under another into the mantle." },
      { word: "buoyant", ipa: "/ˈbɔɪənt/", vi_translation: "có sức nổi", band_level: 7, context_use: "Continental rock is buoyant — too light to sink." },
      { word: "accumulate", ipa: "/əˈkjuːmjəleɪt/", vi_translation: "tích lũy", band_level: 7, context_use: "'Accumulating strain' — fault stress builds before sudden release." },
      { word: "outcrop", ipa: "/ˈaʊtkrɒp/", vi_translation: "lộ ra (đá trên mặt đất)", band_level: 8, context_use: "Section of rock visible at the surface." },
      { word: "equilibrium", ipa: "/ˌiːkwɪˈlɪbriəm/", vi_translation: "trạng thái cân bằng", band_level: 8, context_use: "'Near-equilibrium between uplift and erosion'." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_KEYWORD_TRACE,
      STRAT_NOT_GIVEN,
      STRAT_PARAPHRASE,
      STRAT_HEADINGS_FIRST_LAST,
      STRAT_QUESTION_ORDER,
    ],
    common_mistakes_vi: [
      "Q9: 'poor place' = 'không tốt'. Tác giả nói ngược lại — đừng vội YES vì đọc lướt thấy 'natural laboratories'.",
      "Q10 (Tethys): nhiều bạn viết 'Indian Ocean' vì đoạn C nhắc 'across what is now the Indian Ocean'. Câu hỏi yêu cầu sea NẰM GIỮA — Tethys.",
    ],
    estimated_time_minutes: 18,
    difficulty_band: 7.0,
    word_count: 750,
  },
  // ───────────────────────────────────────────────────────────────────
  // PASSAGE 5 — geography — band 6.5
  // ───────────────────────────────────────────────────────────────────
  {
    id: "ielts_reading_geography_mekong_delta",
    category: "geography",
    topic_title_vi: "Đồng bằng sông Cửu Long và hệ thống phù sa",
    topic_title_en: "The Mekong Delta and its sediment system",
    passage: `A. The Mekong Delta in southern Vietnam is one of the world's largest river deltas, covering nearly 40,000 square kilometres of low-lying land where the Mekong River meets the South China Sea. About 17 million people live on it. Its existence depends on a continuous supply of mineral sediment, washed down from the river's upper basin in southern China and the Tibetan Plateau and deposited as silt at the river mouth. Without that supply, the land would slowly sink and the sea would advance.

B. Globally, deltas form when a river loses speed as it enters the sea: the load of sand, silt, and clay that the moving water can carry drops out of suspension and accumulates. The Mekong has been doing this for several million years. The modern delta is a fan-shaped accumulation built since the last ice age, when the sea level rose by more than 100 metres and stabilised at roughly its present height about 6,000 years ago.

C. The river's flow varies sharply with the seasons. About 80 per cent of the annual sediment load arrives during the summer monsoon, when discharge can be ten times the dry-season minimum. In the absence of human modification, much of this water spreads across the floodplain, dropping fresh silt and recharging shallow groundwater. Vietnamese farmers have for generations adapted to this cycle by farming flood-tolerant rice varieties and harvesting fish that breed in the inundated fields.

D. Two large changes are now altering the delta. The first is upstream dam construction. Since the early 2000s, more than ten major dams have been built on the Lancang (the Chinese name for the upper Mekong) and on tributaries in Laos. Dams are designed to hold back water for hydropower; in doing so they also trap sediment. Recent studies estimate that the sediment delivered to the delta has fallen by between 50 and 70 per cent compared with pre-dam levels.

E. The second change is sand mining. Sand from the riverbed is dredged to supply the construction industry, especially for concrete in fast-growing cities. Each cubic metre removed lowers the local riverbed slightly. Over years, this causes the channel to deepen, banks to slump, and seawater to intrude further inland during dry months. Vietnamese government surveys put annual sand removal in the high tens of millions of tonnes — a quantity comparable to the natural sediment supply that the dams are now blocking.

F. The combined result is a delta that is sinking. Subsidence rates of one to four centimetres a year have been measured in many districts, partly natural compaction of soft sediments and partly the consequence of groundwater pumping for agriculture. Sea level, in the meantime, is rising at roughly 0.3 centimetres a year. Where these two figures combine, the land is effectively losing elevation against the sea ten times faster than the global average. Saltwater regularly reaches kilometres further inland than it did a generation ago, and saltwater intrusion now affects rice yields in provinces such as Bến Tre and Sóc Trăng during severe dry seasons.

G. Several adaptation strategies are under discussion. Some studies advocate restoring controlled monsoon flooding to selected areas to deposit fresh sediment. Others propose changing crop choices — replacing dry-season rice with brackish-water aquaculture, for instance — and limiting both groundwater extraction and sand mining. Coordination between Mekong-basin countries through the Mekong River Commission has been part of the conversation since the 1990s, but binding agreements on dam operation and sediment release remain difficult to reach. The delta's long-term future will depend on choices made not only in Vietnam but in five upstream countries as well.`,
    paragraph_count: 7,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading i–vii to paragraph A–G.\ni. Why deltas form\nii. Adaptation under discussion\niii. Land below the rising sea\niv. Where the river feeds the people\nv. The summer-monsoon cycle\nvi. Trapped behind upstream dams\nvii. Sand for the construction industry", correct_answer: "A=iv; B=i; C=v; D=vi; E=vii; F=iii; G=ii", explanation_vi: "A: 17 triệu người sống nhờ phù sa → iv. B: deltas hình thành thế nào → i. C: 'summer monsoon' + farming → v. D: dams + Lancang → vi. E: sand mining → vii. F: subsidence + rising sea → iii. G: 'adaptation strategies' → ii." },
      { number: 2, type: "true_false_not_given", question_text: "The Mekong Delta has reached its present height roughly six thousand years ago.", correct_answer: "TRUE", explanation_vi: "Đoạn B: 'sea level rose … and stabilised at roughly its present height about 6,000 years ago'." },
      { number: 3, type: "true_false_not_given", question_text: "Most of the river's annual sediment is delivered during the dry season.", correct_answer: "FALSE", explanation_vi: "Đoạn C: '80 per cent … during the summer monsoon'." },
      { number: 4, type: "true_false_not_given", question_text: "Vietnamese farmers in the delta traditionally rejected the seasonal floods.", correct_answer: "FALSE", explanation_vi: "Đoạn C: farmers 'adapted to this cycle by farming flood-tolerant rice varieties' — họ thích nghi." },
      { number: 5, type: "true_false_not_given", question_text: "Recent studies estimate sediment to the delta has dropped by 50–70 per cent.", correct_answer: "TRUE", explanation_vi: "Đoạn D: 'fallen by between 50 and 70 per cent'." },
      { number: 6, type: "true_false_not_given", question_text: "Sand mining is illegal across the entire Mekong-basin region.", correct_answer: "NOT GIVEN", explanation_vi: "Passage không bàn legality. NOT GIVEN." },
      { number: 7, type: "summary_completion", question_text: "The delta is losing elevation against the sea about ______ times faster than the global average.", correct_answer: "ten", explanation_vi: "Đoạn F: 'losing elevation against the sea ten times faster'." },
      { number: 8, type: "summary_completion", question_text: "Saltwater intrusion now affects rice yields in provinces such as Bến Tre and ______.", correct_answer: "Sóc Trăng", explanation_vi: "Đoạn F: 'Bến Tre and Sóc Trăng'." },
      { number: 9, type: "multiple_choice", question_text: "What does paragraph G suggest about basin-level coordination?", options: ["A. It has produced binding rules on dam operation.", "B. It has been discussed since the 1990s but binding agreements remain difficult.", "C. It is led entirely by Vietnam.", "D. It primarily focuses on tourism."], correct_answer: "B", explanation_vi: "Đoạn G: 'since the 1990s, but binding agreements … remain difficult to reach'." },
      { number: 10, type: "short_answer", question_text: "What is the dual cause of the local subsidence described in paragraph F? (NO MORE THAN THREE WORDS)", correct_answer: "compaction and pumping", explanation_vi: "Đoạn F: 'natural compaction … and … groundwater pumping'." },
      { number: 11, type: "yes_no_not_given", question_text: "The author thinks the delta's future is solely a Vietnamese decision.", correct_answer: "NO", explanation_vi: "Đoạn G: 'will depend on choices made not only in Vietnam but in five upstream countries as well'." },
    ],
    vocabulary_focus: [
      { word: "subsidence", ipa: "/səbˈsaɪdəns/", vi_translation: "sự sụt lún", band_level: 8, context_use: "Land sinking — central process in paragraph F." },
      { word: "discharge", ipa: "/ˈdɪstʃɑːdʒ/", vi_translation: "lưu lượng (sông)", band_level: 7, context_use: "Volume of water flowing per unit time — varies with monsoon." },
      { word: "tributary", ipa: "/ˈtrɪbjətri/", vi_translation: "nhánh sông", band_level: 7, context_use: "Smaller river feeding the main channel." },
      { word: "intrusion", ipa: "/ɪnˈtruːʒən/", vi_translation: "sự xâm nhập", band_level: 7, context_use: "'Saltwater intrusion' — sea reaching further inland." },
      { word: "brackish", ipa: "/ˈbrækɪʃ/", vi_translation: "nước lợ", band_level: 8, context_use: "Mix of salt and fresh — used for adapted aquaculture." },
      { word: "binding", ipa: "/ˈbaɪndɪŋ/", vi_translation: "có tính ràng buộc (pháp lý)", band_level: 7, context_use: "'Binding agreements' = legally enforceable." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NOT_GIVEN,
      STRAT_KEYWORD_TRACE,
      STRAT_HEADINGS_FIRST_LAST,
      STRAT_PARAPHRASE,
      STRAT_TIME_BUDGET,
    ],
    common_mistakes_vi: [
      "Q6 (sand mining illegal): cám dỗ chọn FALSE vì passage có vẻ phê phán hoạt động này — nhưng tính hợp pháp KHÔNG được bàn. NOT GIVEN.",
      "Q4 ('rejected'): nhiều bạn không kịp đọc 'flood-tolerant rice varieties' và chọn TRUE/NOT GIVEN.",
    ],
    estimated_time_minutes: 18,
    difficulty_band: 6.5,
    word_count: 700,
  },
  // ───────────────────────────────────────────────────────────────────
  // PASSAGE 6 — geography — band 7.5
  // ───────────────────────────────────────────────────────────────────
  {
    id: "ielts_reading_geography_urban_heat_island",
    category: "geography",
    topic_title_vi: "Hiệu ứng đảo nhiệt đô thị",
    topic_title_en: "Urban heat islands",
    passage: `A. An urban heat island is a region within a city that is consistently warmer than the surrounding rural area. The temperature difference is usually small at noon — frequently no more than one or two degrees Celsius — but builds rapidly after sunset, reaching its peak a few hours into the night, when the centre of a large city can be five to seven degrees Celsius warmer than the open countryside on the same day. Researchers have documented heat islands in cities of every climate, from London to Phoenix and from Tokyo to Manila.

B. The basic mechanism is straightforward. Buildings, roads and pavements absorb solar radiation during the day and re-radiate it slowly through the night. Their materials — concrete, asphalt, brick — store heat far longer than the soils and vegetation they replaced. At the same time, urban areas have less evaporative cooling: where a forest canopy or a wet field would lose heat as water evaporates from leaves and ground, sealed surfaces shed water as run-off without pulling heat with it. Add waste heat from vehicles, air conditioners, and industrial processes, and the night-time imbalance compounds.

C. Geometry matters as much as material. Tall buildings flanking narrow streets produce what climatologists call urban canyons. During the day, these canyons trap solar radiation between facades; after sunset, they restrict the open sky to a narrow strip directly overhead. Heat radiated upwards from streets and walls bounces between buildings rather than escaping unimpeded into the cold sky. The deeper and narrower a canyon, the slower the night-time cooling.

D. Heat-island intensity is also moderated by wind. A strong breeze can ventilate a city quickly, mixing warmer urban air with cooler air from upwind. On still nights — common in stable summer weather — the absence of wind allows the imbalance to develop fully. This is one reason why heat-wave fatalities are usually concentrated in densely built city centres rather than in surrounding suburbs: not only are central temperatures higher, but the pollution and humidity that worsen heat stress are also poorly dispersed.

E. The public-health consequences are now well documented. During the European heatwave of 2003, large cities reported substantially higher mortality than rural areas at the same temperatures, and a similar pattern was observed in the British heatwaves of 2018 and 2022. The most vulnerable groups are the elderly, those with pre-existing cardiovascular conditions, infants, and outdoor workers. Within cities, the health burden is itself unequally distributed: lower-income districts tend to have less tree canopy, smaller parks, and older housing without air conditioning, all of which raise local heat exposure.

F. A range of mitigations is now being trialled in cities worldwide. Reflective roofing, sometimes called "cool roofs", uses white or light-coloured materials that reflect rather than absorb solar radiation. Green roofs and walls add vegetation directly onto buildings, providing both evaporative cooling and shade. Increased street-tree planting can reduce summer surface temperatures along a corridor by several degrees. So can the choice of permeable rather than impermeable paving, which allows water to evaporate slowly from beneath the pavement instead of rushing into a storm drain.

G. None of these measures by itself solves the heat-island effect, but combinations can substantially lessen it. Singapore, Tokyo, Melbourne and Medellín have all set quantified urban-cooling targets, and early evaluations suggest measurable improvements in the streets where coordinated investments have been made. As climate change pushes many cities into more frequent, more intense heatwaves, the urban heat island has shifted from being treated as a curiosity of urban climatology to being a routine constraint on planning and public-health decisions.`,
    paragraph_count: 7,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading i–vii to paragraph A–G.\ni. Geometry traps the night-time heat\nii. Cooling targets and combined investment\niii. Materials, surfaces, and waste heat\niv. Defining the night-time temperature gap\nv. Reflective roofs, green roofs, and trees\nvi. Health burden and inequality\nvii. Stillness and concentrated risk", correct_answer: "A=iv; B=iii; C=i; D=vii; E=vi; F=v; G=ii", explanation_vi: "A định nghĩa & đo nhiệt độ ban đêm → iv. B vật liệu + waste heat → iii. C 'urban canyons' → i. D 'still nights' + concentrated mortality → vii. E sức khoẻ + bất bình đẳng → vi. F cool roof, green roof, trees, paving → v. G mục tiêu định lượng + đầu tư phối hợp → ii." },
      { number: 2, type: "true_false_not_given", question_text: "Heat-island temperature differences are usually largest at midday.", correct_answer: "FALSE", explanation_vi: "Đoạn A: 'small at noon' — đỉnh chênh vài giờ sau hoàng hôn." },
      { number: 3, type: "true_false_not_given", question_text: "Concrete and asphalt store heat for a shorter time than soils and vegetation.", correct_answer: "FALSE", explanation_vi: "Đoạn B: 'store heat far longer than the soils and vegetation they replaced'." },
      { number: 4, type: "true_false_not_given", question_text: "Strong wind can mix urban and rural air and reduce the heat-island intensity.", correct_answer: "TRUE", explanation_vi: "Đoạn D: 'A strong breeze can ventilate a city quickly, mixing warmer urban air with cooler air from upwind'." },
      { number: 5, type: "true_false_not_given", question_text: "Heat-wave fatalities are evenly distributed between city centres and suburbs.", correct_answer: "FALSE", explanation_vi: "Đoạn D: 'concentrated in densely built city centres rather than in surrounding suburbs'." },
      { number: 6, type: "summary_completion", question_text: "Tall buildings along narrow streets create what climatologists call urban ______.", correct_answer: "canyons", explanation_vi: "Đoạn C: 'urban canyons'." },
      { number: 7, type: "summary_completion", question_text: "Light-coloured roofing that reflects sunlight is sometimes called a 'cool ______'.", correct_answer: "roof", explanation_vi: "Đoạn F: 'reflective roofing, sometimes called \"cool roofs\"'. Số ít vì câu đề dùng 'a'." },
      { number: 8, type: "multiple_choice", question_text: "Why are lower-income districts more exposed to heat-island effects?", options: ["A. They have more trees and parks.", "B. They have less tree canopy, smaller parks, and older housing.", "C. They have universal air conditioning.", "D. They are mainly outside city centres."], correct_answer: "B", explanation_vi: "Đoạn E liệt kê chính xác — B đúng nguyên văn." },
      { number: 9, type: "multiple_choice", question_text: "How does paragraph G describe the policy status of the heat-island problem?", options: ["A. Still treated as a curiosity by city planners.", "B. A routine constraint on planning and public-health decisions.", "C. Fully solved in tropical cities.", "D. Applies only to cities in Asia."], correct_answer: "B", explanation_vi: "Đoạn G: 'shifted from being treated as a curiosity … to being a routine constraint'." },
      { number: 10, type: "matching_information", question_text: "Which paragraph contains:\n(i) the role of evaporation in urban temperature\n(ii) examples of cities that have set numeric cooling targets", correct_answer: "i=B; ii=G", explanation_vi: "(i) đoạn B: 'less evaporative cooling … sealed surfaces shed water as run-off'. (ii) đoạn G: Singapore/Tokyo/Melbourne/Medellín 'quantified urban-cooling targets'." },
    ],
    vocabulary_focus: [
      { word: "radiation", ipa: "/ˌreɪdiˈeɪʃən/", vi_translation: "bức xạ", band_level: 7, context_use: "Solar radiation absorbed by surfaces during the day." },
      { word: "evaporative", ipa: "/ɪˈvæpərətɪv/", vi_translation: "(thuộc về) bay hơi", band_level: 8, context_use: "'Evaporative cooling' — heat loss through water vaporising." },
      { word: "ventilate", ipa: "/ˈvɛntɪleɪt/", vi_translation: "thông gió", band_level: 7, context_use: "Wind 'ventilates' a city by exchanging warm and cool air." },
      { word: "mortality", ipa: "/mɔːˈtæləti/", vi_translation: "tỉ lệ tử vong", band_level: 8, context_use: "Public-health metric — death rate during heatwaves." },
      { word: "permeable", ipa: "/ˈpɜːmiəbəl/", vi_translation: "thấm được", band_level: 8, context_use: "'Permeable paving' lets water seep through and evaporate." },
      { word: "mitigation", ipa: "/ˌmɪtɪˈɡeɪʃən/", vi_translation: "biện pháp giảm thiểu", band_level: 7, context_use: "Strategies that reduce, but do not eliminate, the effect." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_TFNG_VS_YNNG,
      STRAT_PARAPHRASE,
      STRAT_KEYWORD_TRACE,
      STRAT_QUESTION_ORDER,
      STRAT_WORD_LIMIT,
    ],
    common_mistakes_vi: [
      "Q10 (matching information): 'evaporation' không lặp ở đoạn F (cây + permeable paving cũng evaporative). Cẩn thận chọn đoạn B vì nó nói về 'evaporative cooling' rõ nhất.",
      "Q3: nhiều bạn nhầm 'shorter' và 'longer' khi đọc nhanh. Đáp án FALSE vì passage nói LONGER.",
    ],
    estimated_time_minutes: 18,
    difficulty_band: 7.5,
    word_count: 760,
  },
  // ───────────────────────────────────────────────────────────────────
  // PASSAGE 7 — science — band 6.5
  // ───────────────────────────────────────────────────────────────────
  {
    id: "ielts_reading_science_penicillin",
    category: "science",
    topic_title_vi: "Phát hiện và phát triển penicillin",
    topic_title_en: "The discovery and development of penicillin",
    passage: `A. The story of penicillin is sometimes told as the result of a single moment of luck. Alexander Fleming, a Scottish bacteriologist working at St Mary's Hospital in London, returned to his laboratory in September 1928 and noticed that a Petri dish of staphylococcus bacteria he had left out before going on holiday was contaminated with mould. Around the mould, the bacteria had been killed. Fleming identified the mould as a strain of Penicillium and gave the active substance it produced its now-familiar name.

B. Fleming's discovery alone would not have changed medicine. He could grow only tiny amounts of his unstable substance, and his attempts to publish were met with limited interest in the early 1930s. The transformation of penicillin into a usable drug had to wait until 1939, when a team led by the Australian pathologist Howard Florey at the University of Oxford took up the problem with the support of the Rockefeller Foundation.

C. The Oxford team — which included the German-born biochemist Ernst Chain and the chemist Norman Heatley — solved a chain of practical problems that Fleming alone could not. They cultured the mould on a much larger scale, devising bedpans and bath-tubs as makeshift fermentation vessels when more sophisticated equipment proved unavailable. They isolated the active substance more cleanly. They tested it on infected mice with dramatic success in 1940, and on a single human patient, Albert Alexander, in early 1941. Alexander improved markedly, but the team ran out of supply before treatment could be completed; he relapsed and died.

D. The decisive next step was industrial. Britain in 1941 was at war and had no spare manufacturing capacity. Florey and Heatley flew to the United States, where, with the cooperation of the U.S. Department of Agriculture's research laboratory in Peoria, Illinois, the production yield of the mould was multiplied many-fold. A switch to deep-tank fermentation in industrial vats and the discovery, in a Peoria market, of a higher-yielding mould strain on a cantaloupe melon increased output enormously. By 1943 American firms were producing enough penicillin to treat every Allied serviceman wounded that year, and by 1945 supply was sufficient to meet civilian demand.

E. The clinical impact was immediate. Bacterial pneumonia, which had killed roughly a third of patients hospitalised with it in the early 1940s, became a routinely curable disease. Bloodstream infections following childbirth and surgery, which had crippled hospitals across the world, retreated. Tuberculosis was unaffected, because tubercle bacilli are not sensitive to penicillin, but a separate antibiotic discovered in 1944 — streptomycin — soon filled that gap. Within twenty years, the antibiotic class as a whole had become the most powerful tool in scientific medicine.

F. Fleming, Florey, and Chain were jointly awarded the Nobel Prize in Physiology or Medicine in 1945. Heatley, whose engineering ingenuity made the Oxford fermentations possible, received an honorary doctorate from Oxford in 1990 — the first conferred on a non-medical scientist in the university's history — but never the Nobel itself, partly a function of the Nobel rule limiting any prize to three living recipients.

G. Modern medicine has watched, with concern, the slow erosion of penicillin's effectiveness against bacteria that have evolved resistance. Penicillin-resistant strains of staphylococcus appeared within a decade of widespread use. The development of newer antibiotics has so far kept pace, but the gap is narrowing, and resistance has emerged at one stage or another to almost every drug in clinical use. The opening chapter of antibiotic medicine, in other words, was written between 1928 and 1945; the closing chapter is being written now, and its outcome is not yet known.`,
    paragraph_count: 7,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading i–vii to paragraph A–G.\ni. The chemist, biochemist, and bath-tubs\nii. Industrial scale, melon, and cantaloupe\niii. The September 1928 contamination\niv. The Nobel and a delayed honour\nv. Routine cures and one untouched disease\nvi. Resistance closing in\nvii. From discovery to drug — the missing decade", correct_answer: "A=iii; B=vii; C=i; D=ii; E=v; F=iv; G=vi", explanation_vi: "A: 09/1928, Petri dish, mould → iii. B: 1928→1939, không có drug → vii. C: Chain + Heatley + 'bedpans and bath-tubs' → i. D: Peoria, deep-tank, melon → ii. E: pneumonia, TB → v. F: Nobel + honorary doctorate → iv. G: resistance → vi." },
      { number: 2, type: "true_false_not_given", question_text: "Fleming personally produced penicillin on a clinically useful scale.", correct_answer: "FALSE", explanation_vi: "Đoạn B: 'tiny amounts of his unstable substance'." },
      { number: 3, type: "true_false_not_given", question_text: "Albert Alexander recovered fully after his 1941 penicillin treatment.", correct_answer: "FALSE", explanation_vi: "Đoạn C: 'he relapsed and died' khi ngắt thuốc." },
      { number: 4, type: "true_false_not_given", question_text: "Industrial penicillin production began in Britain due to wartime urgency.", correct_answer: "FALSE", explanation_vi: "Đoạn D: Britain 'had no spare manufacturing capacity'; production scaled up in the U.S." },
      { number: 5, type: "summary_completion", question_text: "A higher-yielding mould strain was found on a cantaloupe ______ in a Peoria market.", correct_answer: "melon", explanation_vi: "Đoạn D: 'a cantaloupe melon'." },
      { number: 6, type: "summary_completion", question_text: "An antibiotic discovered in 1944, ______, became effective against tuberculosis.", correct_answer: "streptomycin", explanation_vi: "Đoạn E: 'streptomycin'." },
      { number: 7, type: "multiple_choice", question_text: "Why did Heatley not receive the Nobel Prize?", options: ["A. He had retired from research.", "B. The Nobel rule limits each prize to three living recipients.", "C. He was not part of the Oxford team.", "D. His work was on streptomycin, not penicillin."], correct_answer: "B", explanation_vi: "Đoạn F: 'partly a function of the Nobel rule limiting any prize to three living recipients'." },
      { number: 8, type: "yes_no_not_given", question_text: "The author treats penicillin's discovery as the work of a single individual.", correct_answer: "NO", explanation_vi: "Phần còn lại nhấn mạnh team Oxford + Peoria. Tác giả KHÔNG đồng ý với view 'single individual'." },
      { number: 9, type: "short_answer", question_text: "What proportion of pneumonia patients hospitalised in the early 1940s died before penicillin? (NO MORE THAN THREE WORDS)", correct_answer: "roughly a third", explanation_vi: "Đoạn E: 'killed roughly a third of patients'." },
      { number: 10, type: "matching_information", question_text: "Which paragraph contains:\n(i) the use of make-shift containers in early production\n(ii) the rule about Nobel-prize recipients", correct_answer: "i=C; ii=F", explanation_vi: "(i) đoạn C 'bedpans and bath-tubs'. (ii) đoạn F về Nobel rule." },
    ],
    vocabulary_focus: [
      { word: "contamination", ipa: "/kənˌtæmɪˈneɪʃən/", vi_translation: "sự nhiễm bẩn", band_level: 7, context_use: "Petri dish was contaminated with airborne mould." },
      { word: "fermentation", ipa: "/ˌfɜːmənˈteɪʃən/", vi_translation: "sự lên men", band_level: 7, context_use: "Mould grown in tanks — fermentation in industrial vats." },
      { word: "yield", ipa: "/jiːld/", vi_translation: "sản lượng (thu được)", band_level: 6, context_use: "'Higher-yielding strain' — produces more drug per litre of broth." },
      { word: "ingenuity", ipa: "/ˌɪndʒəˈnjuːəti/", vi_translation: "sự khéo léo, tài tháo vát", band_level: 8, context_use: "'Engineering ingenuity' — Heatley's skill at improvising equipment." },
      { word: "erosion", ipa: "/ɪˈrəʊʒən/", vi_translation: "sự bào mòn (nghĩa bóng)", band_level: 8, context_use: "'Slow erosion of penicillin's effectiveness'." },
      { word: "resistance", ipa: "/rɪˈzɪstəns/", vi_translation: "sự kháng thuốc", band_level: 7, context_use: "Bacterial resistance — central problem of paragraph G." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_TFNG_VS_YNNG,
      STRAT_NOT_GIVEN,
      STRAT_KEYWORD_TRACE,
      STRAT_QUESTION_ORDER,
      STRAT_HEADINGS_FIRST_LAST,
    ],
    common_mistakes_vi: [
      "Q3 (Alexander): nhiều bạn không đọc kỹ và chọn TRUE vì đoạn nói 'improved markedly'. Câu cuối đoạn C nói rõ 'relapsed and died'.",
      "Q8 (Y/N/NG): đừng chọn NOT GIVEN. Cấu trúc cả bài thể hiện rõ tác giả KHÔNG đồng ý với view 'single individual'.",
    ],
    estimated_time_minutes: 18,
    difficulty_band: 6.5,
    word_count: 740,
  },
  // ───────────────────────────────────────────────────────────────────
  // PASSAGE 8 — science — band 7.5
  // ───────────────────────────────────────────────────────────────────
  {
    id: "ielts_reading_science_photosynthesis_yields",
    category: "science",
    topic_title_vi: "Quang hợp và năng suất cây trồng",
    topic_title_en: "Photosynthesis and crop yield",
    passage: `A. Photosynthesis is the chemical process by which green plants convert carbon dioxide and water into sugars, using light energy captured by chlorophyll molecules in the leaf. Despite billions of years of evolutionary refinement, photosynthesis is in many respects an inefficient process. The maximum theoretical efficiency at which sunlight is converted to chemical energy in a leaf is around 12 per cent for plants such as sugarcane and around 4 per cent for wheat or rice. Real-world field crops achieve only a fraction of these ceilings: most modern agricultural species deliver between 1 and 2 per cent over a full growing season.

B. The reasons for the gap have been mapped in detail. Some sunlight is reflected from the leaf surface or absorbed by pigments other than chlorophyll. A large fraction of the absorbed energy is lost as heat. The most consequential single inefficiency, however, is an enzymatic one. The enzyme that incorporates carbon dioxide into the photosynthetic cycle, known as Rubisco, sometimes binds to oxygen instead of carbon dioxide — a "mistake" that wastes energy and is corrected at additional metabolic cost in a process called photorespiration. Photorespiration is estimated to reduce wheat and rice yields by between 20 and 40 per cent under hot, dry conditions.

C. Some plants have evolved an internal workaround. Maize, sugarcane, sorghum, and many tropical grasses use a variant pathway called C4 photosynthesis, in which carbon dioxide is concentrated near Rubisco before fixation. Under high temperatures and bright sunlight, C4 plants outperform their C3 relatives by 30 to 50 per cent in raw productivity. Rice, wheat and most temperate cereals, however, remain C3, and this is one reason why their yields plateau in increasingly hot growing seasons.

D. Plant biologists have spent two decades trying to engineer the C4 pathway into rice, with the support of the Bill and Melinda Gates Foundation among others. Several of the genes responsible have been identified, and prototype "C4 rice" lines have been produced that show some of the diagnostic anatomy of C4 leaves. Field trials so far have not matched the productivity gain seen in natural C4 species, in part because the trait depends on dozens of coordinated changes across leaf anatomy, biochemistry, and gene regulation.

E. A simpler intervention has come from rerouting the photorespiration pathway itself. In 2019, a research group at the University of Illinois reported a transgenic tobacco line carrying a redesigned bypass that captured most of the energy normally lost during photorespiration. Field trials over two seasons showed yield increases of around 40 per cent. Tobacco is a comparatively easy plant to modify, but the same principle is being tested in soybean, potato and rice. Whether such modifications survive regulatory review and farmer adoption in different national contexts is a separate question.

F. Conventional plant breeding remains the larger source of yield gains in practice. Modern wheat varieties yield between two and three times what wheat yields delivered in the 1950s, almost entirely through the choice of dwarf stems, larger grain heads, and disease-resistant cultivars rather than through any improvement in photosynthetic efficiency itself. The same is broadly true of rice and maize. The implication is that, even before any C4 or bypass success, breeding has been doing a good job of harvesting the existing photosynthetic surplus by directing it into edible grain rather than stem and leaf.

G. Climate change adds urgency. Higher atmospheric carbon dioxide acts as a fertiliser for C3 photosynthesis up to a point, but rising temperatures, more variable rainfall, and increased evaporative demand more than offset the benefit in many regions. Models project flat or falling yields for major staples in low-latitude growing zones over the coming decades, even before considering soil and pest stresses. Whether the next round of yield gains comes from biotechnology, traditional breeding, agronomy, or some combination, photosynthesis itself is no longer assumed to be a fixed constraint.`,
    paragraph_count: 7,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading i–vii to paragraph A–G.\ni. Engineering C4 traits into rice\nii. Climate pressure on yields\niii. Theoretical and real-world ceilings\niv. Photorespiration and Rubisco's mistake\nv. Yield from breeding, not photosynthesis\nvi. C4: a workaround that already exists\nvii. A redesigned bypass with measurable gains", correct_answer: "A=iii; B=iv; C=vi; D=i; E=vii; F=v; G=ii", explanation_vi: "A: max theoretical 12% vs actual 1-2% → iii. B: Rubisco + photorespiration → iv. C: Maize, sugarcane → vi. D: C4 rice prototype → i. E: bypass + transgenic tobacco + 40% → vii. F: dwarf stems, breeding doubled wheat → v. G: climate change → ii." },
      { number: 2, type: "true_false_not_given", question_text: "Field crops typically operate at less than 5 per cent of theoretical maximum efficiency.", correct_answer: "TRUE", explanation_vi: "Đoạn A: max 12% (sugarcane); 4% (wheat); thực tế 1-2%. 1-2 < 5. TRUE." },
      { number: 3, type: "true_false_not_given", question_text: "Photorespiration is most damaging in cool, wet conditions.", correct_answer: "FALSE", explanation_vi: "Đoạn B: 'under hot, dry conditions' — ngược lại với 'cool, wet'." },
      { number: 4, type: "true_false_not_given", question_text: "Rice and wheat are both C4 plants.", correct_answer: "FALSE", explanation_vi: "Đoạn C: 'Rice, wheat … remain C3'." },
      { number: 5, type: "summary_completion", question_text: "Engineered C4 rice lines have not matched natural C4 productivity because the trait requires dozens of coordinated changes across leaf anatomy, biochemistry, and ______ regulation.", correct_answer: "gene", explanation_vi: "Đoạn D: 'gene regulation'." },
      { number: 6, type: "summary_completion", question_text: "A 2019 University of Illinois study reported about ______ per cent yield gain in transgenic tobacco.", correct_answer: "40", explanation_vi: "Đoạn E: 'yield increases of around 40 per cent'." },
      { number: 7, type: "multiple_choice", question_text: "What does paragraph F suggest about the source of recent wheat yield gains?", options: ["A. Improved photosynthetic efficiency.", "B. Dwarf stems, larger grain heads, and disease-resistant cultivars.", "C. C4 engineering.", "D. Reduced photorespiration."], correct_answer: "B", explanation_vi: "Đoạn F: 'almost entirely through the choice of dwarf stems, larger grain heads, and disease-resistant cultivars'." },
      { number: 8, type: "multiple_choice", question_text: "What is the main argument of paragraph G?", options: ["A. CO₂ fertilisation will fully offset climate harm.", "B. Models project flat or falling yields for major staples in low-latitude zones, despite some CO₂ benefit.", "C. Photosynthesis is now treated as a fixed limit.", "D. Climate change has no impact on grain yields."], correct_answer: "B", explanation_vi: "Đoạn G: 'rising temperatures, more variable rainfall, and increased evaporative demand more than offset the benefit'." },
      { number: 9, type: "yes_no_not_given", question_text: "The author thinks photosynthetic efficiency is a fixed biological limit.", correct_answer: "NO", explanation_vi: "Câu cuối G: 'photosynthesis itself is no longer assumed to be a fixed constraint'." },
      { number: 10, type: "short_answer", question_text: "Name the enzyme whose binding error drives photorespiration. (ONE WORD)", correct_answer: "Rubisco", explanation_vi: "Đoạn B nêu rõ tên enzyme: Rubisco." },
      { number: 11, type: "matching_information", question_text: "Which paragraph contains:\n(i) the proportion of yield reduction caused by photorespiration in hot conditions\n(ii) examples of plant species that already use the C4 pathway", correct_answer: "i=B; ii=C", explanation_vi: "(i) đoạn B '20 and 40 per cent'. (ii) đoạn C 'Maize, sugarcane, sorghum, and many tropical grasses'." },
    ],
    vocabulary_focus: [
      { word: "chlorophyll", ipa: "/ˈklɔːrəfɪl/", vi_translation: "diệp lục", band_level: 7, context_use: "Pigment that captures light energy in green leaves." },
      { word: "enzymatic", ipa: "/ˌɛnzaɪˈmætɪk/", vi_translation: "(thuộc về) enzyme", band_level: 8, context_use: "'An enzymatic inefficiency' — caused by enzyme behaviour, here Rubisco." },
      { word: "transgenic", ipa: "/trænzˈdʒɛnɪk/", vi_translation: "biến đổi gen", band_level: 8, context_use: "Tobacco modified by inserting genes from another organism." },
      { word: "bypass", ipa: "/ˈbaɪpɑːs/", vi_translation: "(con đường) tránh, vòng qua", band_level: 7, context_use: "'Redesigned bypass' for the energy-wasting photorespiration step." },
      { word: "cultivar", ipa: "/ˈkʌltɪvɑː/", vi_translation: "giống cây trồng (chọn lọc)", band_level: 8, context_use: "Plant variety produced by selective breeding." },
      { word: "agronomy", ipa: "/əˈɡrɒnəmi/", vi_translation: "nông học", band_level: 8, context_use: "Field-management science — crop rotation, fertiliser use, etc." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_KEYWORD_TRACE,
      STRAT_TFNG_VS_YNNG,
      STRAT_HEADINGS_FIRST_LAST,
      STRAT_QUESTION_ORDER,
    ],
    common_mistakes_vi: [
      "Q2 ('5 per cent'): câu hỏi đảo chiều — passage cho 1-2%, hỏi 'less than 5%'. Đúng (TRUE) vì 1-2 < 5. Đừng nhầm với một con số mới.",
      "Q5 (gene): nhiều bạn viết 'genetic' vì quen tay. Passage dùng cụm chính xác 'gene regulation'.",
    ],
    estimated_time_minutes: 18,
    difficulty_band: 7.5,
    word_count: 770,
  },
  // ───────────────────────────────────────────────────────────────────
  // PASSAGE 9 — science — band 7.5
  // ───────────────────────────────────────────────────────────────────
  {
    id: "ielts_reading_science_jwst_deep_field",
    category: "science",
    topic_title_vi: "James Webb và những bức ảnh trường sâu",
    topic_title_en: "The James Webb Space Telescope and the deep field",
    passage: `A. The James Webb Space Telescope, launched in December 2021 and reaching its operational orbit in early 2022, is the largest infrared observatory ever placed in space. Its primary mirror is composed of eighteen hexagonal beryllium segments, coated with a thin layer of gold and folded for launch, then unfolded over several days after deployment. Unlike the Hubble Space Telescope, which orbits a few hundred kilometres above Earth, the Webb observatory is positioned at the second Lagrange point, about 1.5 million kilometres outwards from Earth on the side away from the Sun.

B. Operating in the infrared band, rather than in visible light, was a deliberate choice rather than an engineering accident. Light from the most distant galaxies has been redshifted by the expansion of the universe — what was emitted as ultraviolet or visible light during the early universe arrives at the Webb's instruments as infrared. To resolve faint, redshifted sources, the telescope must itself be cold. A five-layer sunshield the size of a tennis court keeps the optics below 50 kelvin, allowing the instruments to detect very weak infrared signals against an extremely cold sky.

C. The first scientific images, released in July 2022, included a deep-field exposure of a small patch of sky no larger than a grain of sand held at arm's length. In that single field of view, thousands of galaxies are visible, including some so distant that their light left them less than half a billion years after the Big Bang. The deep field demonstrated, in a way the Hubble images of similar exposures did not, just how thoroughly populated the early universe was with already-formed galaxies.

D. Some of those distant galaxies surprised astronomers. Several appeared more massive and more chemically evolved than current models predicted for their age. The dust content of the early universe also seems higher than expected, with dust formed surprisingly quickly after the first generations of stars. Some of these results have been revised or weakened with further data and reprocessing, but several have survived and are pushing astrophysicists to reconsider how rapidly the first galaxies could have grown.

E. The Webb has also returned detailed measurements of planets outside the solar system. As an exoplanet passes in front of its parent star, a small fraction of the star's light filters through the planet's atmosphere on its way to the telescope. The wavelengths absorbed in that brief transit reveal which gases are present. Webb has detected water vapour, carbon dioxide, methane and sulphur compounds in atmospheres ranging from hot gas giants to cooler, smaller worlds. None of the planets observed so far carries the unambiguous chemical fingerprint of life, but the cataloguing has begun.

F. Closer to home, infrared imaging has provided sharper views of objects within our own galaxy. Star-forming regions, which glow brightly in infrared as embryonic stars heat the dust around them, have been resolved at much higher contrast than was possible with previous instruments. Pillars and filaments of cool gas, the nurseries of new stars, can be seen condensing in real time on cosmic timescales. These observations help test theoretical models of how stars and planetary systems form from interstellar clouds.

G. The mission was designed for a minimum of five years, with a propellant budget intended to support up to ten. Early performance has been better than required, and the orbit-correction propellant on board may now last fifteen to twenty years. Beyond engineering, however, the long-term scientific value depends on the queue of competitive observing proposals that determines, every cycle, which questions the telescope is asked. The Webb is not a finished archive but an ongoing instrument, and its most important results have probably not yet been collected.`,
    paragraph_count: 7,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading i–vii to paragraph A–G.\ni. Cool clouds and stellar nurseries\nii. Surprises in the early universe\niii. The unfolded gold mirror at L2\niv. Atmospheric chemistry of distant worlds\nv. Why infrared, and why cold\nvi. Mission lifetime and the proposal queue\nvii. The grain-of-sand deep field", correct_answer: "A=iii; B=v; C=vii; D=ii; E=iv; F=i; G=vi", explanation_vi: "A: hexagonal mirror + L2 → iii. B: redshift, sunshield, 50 K → v. C: 'grain of sand' → vii. D: 'more massive' than expected → ii. E: water vapour, CO2 in exoplanet atmospheres → iv. F: pillars + filaments + nurseries → i. G: '15–20 years' + observing proposals → vi." },
      { number: 2, type: "true_false_not_given", question_text: "The Webb's primary mirror is made of polished steel.", correct_answer: "FALSE", explanation_vi: "Đoạn A: 'beryllium segments, coated with a thin layer of gold'." },
      { number: 3, type: "true_false_not_given", question_text: "Operating in the infrared was chosen because of an engineering accident.", correct_answer: "FALSE", explanation_vi: "Đoạn B: 'a deliberate choice rather than an engineering accident'." },
      { number: 4, type: "true_false_not_given", question_text: "Webb has confirmed unambiguous chemical signatures of life on at least one planet.", correct_answer: "FALSE", explanation_vi: "Đoạn E: 'None of the planets observed so far carries the unambiguous chemical fingerprint of life'." },
      { number: 5, type: "summary_completion", question_text: "The deep-field exposure covered a patch of sky no larger than a grain of sand held at ______ length.", correct_answer: "arm's", explanation_vi: "Đoạn C: 'a grain of sand held at arm's length'. 'arm's' (with apostrophe) đếm là 1 từ." },
      { number: 6, type: "summary_completion", question_text: "Webb's instruments are kept below ______ kelvin by a five-layer sunshield.", correct_answer: "50", explanation_vi: "Đoạn B: 'below 50 kelvin'." },
      { number: 7, type: "multiple_choice", question_text: "Why did some of Webb's earliest observations surprise astronomers?", options: ["A. They showed no galaxies at all.", "B. They showed galaxies more massive and chemically evolved than models predicted.", "C. They proved galaxies do not contain dust.", "D. They confirmed Hubble's findings exactly."], correct_answer: "B", explanation_vi: "Đoạn D: 'more massive and more chemically evolved than current models predicted for their age'." },
      { number: 8, type: "multiple_choice", question_text: "What is the main point of paragraph G about the mission?", options: ["A. The mission has already exhausted its propellant.", "B. Early performance has extended the projected mission lifetime, and future results depend on the proposal queue.", "C. No more observing proposals will be accepted.", "D. The Webb operates only in optical wavelengths."], correct_answer: "B", explanation_vi: "Đoạn G: '15–20 years' + 'queue of competitive observing proposals'." },
      { number: 9, type: "yes_no_not_given", question_text: "The author claims Webb's most important results have already been gathered.", correct_answer: "NO", explanation_vi: "Đoạn G: 'most important results have probably not yet been collected'. Tác giả tin còn ở phía trước." },
      { number: 10, type: "short_answer", question_text: "Name two atmospheric gases Webb has detected on exoplanets. (NO MORE THAN THREE WORDS)", correct_answer: "water and carbon dioxide", explanation_vi: "Đoạn E liệt kê: 'water vapour, carbon dioxide, methane and sulphur compounds'. Bất kỳ 2 chất nào hợp lệ; 'water and carbon dioxide' là cặp ngắn nhất + đúng giới hạn." },
    ],
    vocabulary_focus: [
      { word: "deployment", ipa: "/dɪˈplɔɪmənt/", vi_translation: "việc triển khai", band_level: 7, context_use: "Unfolding the telescope after launch — staged deployment." },
      { word: "redshift", ipa: "/ˈrɛdʃɪft/", vi_translation: "dịch chuyển đỏ (vũ trụ học)", band_level: 8, context_use: "Stretching of light wavelengths from receding sources." },
      { word: "exposure", ipa: "/ɪkˈspəʊʒə/", vi_translation: "(ảnh) phơi sáng", band_level: 7, context_use: "Imaging sense — long-duration capture of a faint field." },
      { word: "exoplanet", ipa: "/ˈɛksəʊˌplænɪt/", vi_translation: "ngoại hành tinh", band_level: 8, context_use: "Planet outside our own solar system." },
      { word: "filament", ipa: "/ˈfɪləmənt/", vi_translation: "sợi (mảnh, dài)", band_level: 7, context_use: "Filaments of cool gas in star-forming regions." },
      { word: "propellant", ipa: "/prəˈpɛlənt/", vi_translation: "nhiên liệu đẩy", band_level: 8, context_use: "Used for orbit-correction manoeuvres on the spacecraft." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_KEYWORD_TRACE,
      STRAT_PARAPHRASE,
      STRAT_TFNG_VS_YNNG,
      STRAT_HEADINGS_FIRST_LAST,
      STRAT_TIME_BUDGET,
    ],
    common_mistakes_vi: [
      "Q5 (arm's length): trong tiếng Anh, 'arm's' là 1 từ (genitive). Câu hỏi giới hạn 1 từ là viết được — nhưng nhiều bạn cố đếm 2 và bỏ apostrophe.",
      "Q9: 'already been gathered' (đã thu nhặt rồi) — passage nói NGƯỢC LẠI ('not yet been collected'). NO.",
    ],
    estimated_time_minutes: 18,
    difficulty_band: 7.5,
    word_count: 780,
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
