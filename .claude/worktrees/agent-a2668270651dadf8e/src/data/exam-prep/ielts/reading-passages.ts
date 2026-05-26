// src/data/exam-prep/ielts/reading-passages.ts
//
// IELTS Reading practice content pack — full-length passages.
//
// Scope (this file):
//   Twelve original passages at full IELTS-spec length (700–900 words),
//   each with 13 questions across 3 question types. Topics are
//   deliberately neutral and fact-based — history, geography, science,
//   economics — so the prose can be paraphrased without lifting from
//   any commercial source. All passages and questions are written for
//   MercyBlade based on the public IELTS test specification; none are
//   reproduced from Cambridge, British Council, or any prep book.
//
// Quality posture (matches PR #174's restraint):
//   - 12 passages of solid quality > 18 passages of mixed quality.
//   - Every question's `correct_answer` is recoverable from the
//     passage text. No tricks; no questions whose answer requires
//     world knowledge.
//   - `explanation_vi` always cites the sentence or paragraph that
//     supports the answer — short, specific, useful for review.
//
// Distribution by topic family (avoids over-indexing on one domain):
//   History/economics      4 — silk_road, industrial_coal, printing, bretton_woods
//   Earth/atmospheric sci  3 — plate_tectonics, urban_heat, monsoon
//   Life/medical sci       3 — penicillin, photosynthesis, sleep_circadian
//   Agriculture/ecology    1 — coffee_origins
//   Trade theory           1 — comparative_advantage
//
// Distribution by question type per passage (3 of):
//   - true_false_not_given (TFNG) — fact verification
//   - multiple_choice (MCQ) — pick one
//   - sentence_completion — fill from passage
//   - matching_headings — assign heading per paragraph
//   - short_answer — answer in three words or fewer
//
// Each passage targets a CEFR band — content density, sentence length,
// and lexical range scale up. Lower bands stay under 800 words and
// avoid abstract nouns; higher bands push 900 and use academic register.

// ── Types ─────────────────────────────────────────────────────────────-

export type IELTSReadingTopicFamily =
  | "history"
  | "economics"
  | "earth_science"
  | "atmospheric_science"
  | "life_science"
  | "medical_science"
  | "agriculture"
  | "ecology";

export type IELTSReadingBand = 5.5 | 6.5 | 7.5 | 8.5;

export type IELTSReadingQuestionType =
  | "true_false_not_given"
  | "multiple_choice"
  | "sentence_completion"
  | "matching_headings"
  | "matching_information"
  | "short_answer"
  | "summary_completion";

export type TFNGAnswer = "TRUE" | "FALSE" | "NOT GIVEN";

export interface IELTSReadingQuestion {
  /** Stable 1-based number within the passage. */
  number: number;
  type: IELTSReadingQuestionType;
  /** The question text shown to the candidate. For matching-headings,
   *  this is the paragraph identifier ("Paragraph A"). */
  question_text: string;
  /** Options for MCQ / matching variants. Undefined for completion /
   *  short-answer / TFNG. */
  options?: string[];
  /** Canonical answer. For TFNG: "TRUE" | "FALSE" | "NOT GIVEN".
   *  For completion: the exact word(s) from the passage; scoring is
   *  case-insensitive and ignores leading/trailing whitespace. */
  correct_answer: string;
  /** Vietnamese-language explanation citing the supporting sentence
   *  or paragraph. Keep under ~30 VN words. */
  explanation_vi: string;
}

export interface IELTSReadingPassage {
  /** Stable kebab-case slug used as the React key and in URLs. */
  id: string;
  /** Bilingual title. */
  title_en: string;
  title_vi: string;
  topic_family: IELTSReadingTopicFamily;
  band: IELTSReadingBand;
  /** Total reading + answering minutes (IELTS allots ~20 min/passage). */
  time_minutes: number;
  /** The passage. Paragraphs separated by blank lines. */
  passage_en: string;
  /** A 2–3 sentence VN summary so a learner can preview the topic. */
  summary_vi: string;
  questions: IELTSReadingQuestion[];
}

// ── Passages ──────────────────────────────────────────────────────────-

const SILK_ROAD: IELTSReadingPassage = {
  id: "silk-road-trade-networks",
  title_en: "The Silk Road Trade Networks",
  title_vi: "Mạng lưới thương mại Con đường Tơ lụa",
  topic_family: "history",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc tổng hợp lịch sử Con đường Tơ lụa từ thế kỷ 2 trước Công nguyên đến thế kỷ 14 sau Công nguyên: cách mạng lưới thương mại này hình thành, hàng hóa trao đổi, các thành phố trung chuyển, và lý do mạng lưới suy tàn khi các tuyến hàng hải phát triển.",
  passage_en: `The term "Silk Road" was coined in the late nineteenth century by the German geographer Ferdinand von Richthofen, but the trade networks it describes are far older. From roughly the second century BCE to the fourteenth century CE, a shifting web of overland routes connected the eastern edge of China with the Mediterranean coast. The routes were never a single highway. Caravans rarely travelled the entire length, and goods passed through dozens of intermediaries before reaching their final destination.

Silk gave the network its modern name, but it was only one of many commodities. Chinese workshops also exported lacquerware, paper, and porcelain. From the western end of the route came glass, woollen textiles, and silver. Central Asian markets supplied horses, jade, and walnuts; South Asian merchants contributed cotton, spices, and gemstones. By volume the most valuable trade was probably in horses, which Chinese armies needed in enormous numbers and which the steppe peoples could supply.

The routes ran from Chang'an, the Han dynasty capital, west through the Hexi Corridor, around the Taklamakan Desert, and into the oasis cities of Central Asia. Travellers chose between a northern path through Turpan and Samarkand and a southern path through Khotan and Balkh, depending on political conditions and water availability. From Central Asia, goods continued to Persia and the Levant, where Mediterranean shipping carried them to Rome, Alexandria, and later Constantinople.

Cities along the route grew wealthy as middlemen. Samarkand, Merv, and Bukhara became centres of learning as well as commerce. Caravanserais — fortified inns spaced about a day's travel apart — provided shelter for merchants and stables for their animals. Many were endowed by rulers and run as charitable institutions, since stable trade required predictable hospitality. Local authorities collected duties at city gates, and these revenues often financed the construction of the next caravanserai.

Religion travelled with the goods. Buddhism reached China from India in the first century CE through monasteries along the southern route; Manichaeism, Nestorian Christianity, and later Islam spread by the same channels. The Mogao Caves near Dunhuang preserve thousands of manuscripts and paintings produced over a thousand years by scribes and monks who served the trade. Languages mixed similarly: a single document might combine Sogdian script for shipping notes, Sanskrit verses on its margins, and a Chinese seal on the back.

The network reached its commercial peak under the Mongol Empire of the thirteenth and fourteenth centuries, when a single political authority — the Pax Mongolica — secured passage from the Black Sea to the Pacific. European travellers such as Marco Polo and Giovanni di Pian del Carpine recorded the conditions in detail, and their accounts later served as evidence of how predictable transit had become. Caravan insurance contracts from this period, preserved in Genoese archives, reveal that overland transit risk was insurable at competitive rates.

Decline followed several pressures. The Black Death of the fourteenth century travelled along the same routes, killing merchants and depopulating cities. The fragmentation of the Mongol Empire reduced political guarantees of safe passage. Most decisively, Portuguese mariners reached Indian ports in 1498, and within a generation maritime trade routes carried larger volumes at lower cost. By the seventeenth century the overland network had contracted to regional traffic.

Modern scholarship has questioned the framing. Some historians prefer "Silk Roads" in the plural, emphasising that the routes were never a unified system. Others argue that the eastern Mediterranean and western Indian Ocean trades were always more economically significant than the overland routes, and that nineteenth-century European writers exaggerated the central importance of silk because the surviving Chinese sources happened to mention it most often. Recent archaeological evidence — from sites in Xinjiang to ports on the Persian Gulf — supports a picture in which silk, while real, was one strand in a much wider commercial fabric whose total value was harder to measure than the romance of the name suggests. Surviving customs records from medieval Egypt, for example, show silk competing with cotton, indigo, and metalwork as Mediterranean merchants ranked their cargoes by margin rather than glamour, suggesting that the eastern fabric trade was already only a fraction of the value carried by the same vessels.`,
  questions: [
    // True / False / Not Given (1–6)
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "Ferdinand von Richthofen invented the term \"Silk Road\" before the trade networks themselves had ended.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 1: Richthofen đặt tên cuối thế kỷ 19, nhưng các tuyến đã hoạt động từ thế kỷ 2 TCN đến thế kỷ 14 — đã suy tàn lâu trước khi ông đặt tên.",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "Caravans typically completed the entire route from China to the Mediterranean.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 1 nói rõ: \"Caravans rarely travelled the entire length\" — hàng hóa qua nhiều người trung gian.",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "Horses may have been the highest-volume commodity by economic value.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 2: \"By volume the most valuable trade was probably in horses\" — phù hợp với câu khẳng định.",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "Travellers chose the northern route over the southern route because it was shorter.",
      correct_answer: "NOT GIVEN",
      explanation_vi:
        "Đoạn 3 nói lý do chọn route là điều kiện chính trị và nguồn nước, không nhắc đến độ dài. Không có thông tin để xác nhận.",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "Caravanserais along the route were always built and operated by private merchants.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 4: \"Many were endowed by rulers and run as charitable institutions\" — không phải lúc nào cũng tư nhân.",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "Marco Polo's records helped show that travel along the route had become reliable.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 6: ghi chép của Marco Polo \"served as evidence of how predictable transit had become\".",
    },

    // Multiple choice (7–10)
    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "What does the writer suggest about the diversity of goods traded?",
      options: [
        "Silk was the most valuable commodity at all times.",
        "The trade involved many commodities besides silk.",
        "Most goods were sent from west to east.",
        "Cotton and spices originated in China.",
      ],
      correct_answer: "The trade involved many commodities besides silk.",
      explanation_vi:
        "Đoạn 2 liệt kê rất nhiều loại hàng hóa khác (lacquerware, paper, glass, horses…) — đáp án nhấn vào sự đa dạng.",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "Why did Buddhism spread along the route in the first century CE?",
      options: [
        "Through monasteries that served the trade.",
        "Through state edicts in the Han dynasty.",
        "Because merchants enforced religious conversion.",
        "Because Manichaeism declined.",
      ],
      correct_answer: "Through monasteries that served the trade.",
      explanation_vi:
        "Đoạn 5: \"Buddhism reached China from India in the first century CE through monasteries along the southern route\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What does the Mogao Caves evidence demonstrate?",
      options: [
        "That only one religion was practised by traders.",
        "That trade was confined to Buddhist communities.",
        "That different languages and religions were combined in trade documents.",
        "That trade had collapsed by the Mongol period.",
      ],
      correct_answer:
        "That different languages and religions were combined in trade documents.",
      explanation_vi:
        "Đoạn 5: \"a single document might combine Sogdian script for shipping notes, Sanskrit verses on its margins, and a Chinese seal\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What was the most decisive cause of the network's decline?",
      options: [
        "The Black Death of the fourteenth century.",
        "The fragmentation of the Mongol Empire.",
        "The Portuguese arrival in Indian ports in 1498.",
        "European exaggeration of silk's importance.",
      ],
      correct_answer:
        "The Portuguese arrival in Indian ports in 1498.",
      explanation_vi:
        "Đoạn 7: \"Most decisively, Portuguese mariners reached Indian ports in 1498\" — \"most decisively\" là chữ khoá.",
    },

    // Sentence completion — answer must use words from the passage. Max 3 words.
    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "Inns spaced about a day's travel apart along the route were known as ____.",
      correct_answer: "caravanserais",
      explanation_vi:
        "Đoạn 4 định nghĩa caravanserais là \"fortified inns spaced about a day's travel apart\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "Caravan ____ contracts from the Mongol period have been preserved in Genoese archives.",
      correct_answer: "insurance",
      explanation_vi:
        "Đoạn 6: \"Caravan insurance contracts from this period, preserved in Genoese archives\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "Some modern historians prefer the plural form \"Silk ____\" to stress that the routes were not unified.",
      correct_answer: "Roads",
      explanation_vi:
        "Đoạn cuối: \"Some historians prefer 'Silk Roads' in the plural\".",
    },
  ],
};

const PLATE_TECTONICS: IELTSReadingPassage = {
  id: "plate-tectonics-continental-drift",
  title_en: "Plate Tectonics and Continental Drift",
  title_vi: "Kiến tạo mảng và sự trôi dạt lục địa",
  topic_family: "earth_science",
  band: 7.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc trình bày lịch sử lý thuyết kiến tạo mảng — từ giả thuyết \"trôi dạt lục địa\" của Wegener đầu thế kỷ 20 (bị bác bỏ vì thiếu cơ chế), đến bằng chứng đáy đại dương thập niên 1960 thiết lập lý thuyết hoàn chỉnh, và những hệ quả ngày nay.",
  passage_en: `The German meteorologist Alfred Wegener proposed in 1912 that the continents had once formed a single landmass and had drifted apart over millions of years. He pointed to the matching coastlines of South America and Africa, the distribution of identical fossil species across oceans that no land animal could have crossed, and parallel rock formations on continents now thousands of kilometres apart. The hypothesis, which he called continental drift, was rejected by most geologists of his generation.

The objection was not to the evidence but to the mechanism. Wegener proposed that continents ploughed through the ocean floor, driven by tidal forces and centrifugal effects from the Earth's rotation. Physicists calculated that these forces were many orders of magnitude too weak to move continents through solid rock. Without a credible engine, the geological evidence was treated as coincidence or as the product of land bridges that had since sunk. Wegener died on a Greenland expedition in 1930 with his idea still on the academic margins.

The breakthrough came from an unlikely source: oceanography during and after the Second World War. Submarine warfare drove rapid improvements in seafloor mapping. By the 1950s, sonar surveys had revealed that the deep ocean floor, far from being a featureless plain, was traversed by a continuous mountain range running tens of thousands of kilometres around the globe. The Mid-Atlantic Ridge was the best-studied segment, but similar ridges were found in every ocean.

Two further observations transformed the picture. First, ocean-floor sediments were thinner near the ridges and progressively thicker farther from them, suggesting that the ridges were younger crust and the basins on either side were older. Second, the basaltic rock of the seafloor preserved a magnetic record. As molten rock cools, iron minerals align with the Earth's magnetic field, locking in its direction. Surveys revealed that the seafloor was striped with bands of alternating polarity, parallel to and symmetrical about the ridges. The pattern matched the known reversal history of the magnetic field.

The synthesis came in the mid-1960s. New oceanic crust forms continuously at the mid-ocean ridges as molten rock rises from below and solidifies. The seafloor spreads outward from the ridges at rates of two to ten centimetres per year. Older crust eventually descends back into the mantle at deep-ocean trenches in a process called subduction. Continents are passive passengers riding on the lithospheric plates that carry them, not active ploughs through the ocean floor.

The new framework explained features that earlier theories had treated as unrelated. Earthquakes, volcanoes, and mountain ranges cluster along plate boundaries because they are the consequence of plates colliding, sliding past each other, or pulling apart. The Pacific Ring of Fire is the chain of volcanoes circling the basin where oceanic crust is subducting under continental plates on every side. The Himalayas are still rising because the Indian plate continues to push into the Eurasian plate at about five centimetres per year.

Modern measurements have confirmed plate motions directly. Networks of GPS receivers now track plate movement to millimetre precision, and the rates measured today match those inferred from magnetic seafloor stripes over geological time. Iceland sits on the Mid-Atlantic Ridge and grows wider by about two centimetres each year — a figure the country's residents can verify on highway distance markers.

The theory still has open questions. The deep mantle's role in driving plate motion is debated, with some researchers giving primary credit to slabs of cold, dense subducting lithosphere pulling plates downward, and others emphasising convection currents in the mantle below. The history of the Earth's earliest plates, before about three billion years ago, is uncertain because the rock record from that period is fragmentary. None of these debates challenge the core picture. What was rejected as fantasy in 1912 became the organising framework of modern earth science within fifty years — a reminder that scientific consensus moves with the evidence, not with the priority of the proposer.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "Wegener was a geologist by training.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 1 mô tả ông là \"meteorologist\" — nhà khí tượng học, không phải nhà địa chất.",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "Wegener's evidence was rejected because it was inaccurate.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 2: \"The objection was not to the evidence but to the mechanism\" — vấn đề là cơ chế, không phải bằng chứng.",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "Wegener died on his way to verify his hypothesis in Greenland.",
      correct_answer: "NOT GIVEN",
      explanation_vi:
        "Đoạn 2 nói ông chết ở Greenland, nhưng không nói lý do chuyến đi là để kiểm chứng giả thuyết.",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "Improved seafloor mapping in the 1950s was driven mainly by commercial fishing.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 3: \"Submarine warfare drove rapid improvements in seafloor mapping\" — do chiến tranh tàu ngầm.",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "Sediments are thicker near mid-ocean ridges than far from them.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 4: trầm tích \"thinner near the ridges and progressively thicker farther from them\" — ngược lại.",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "The magnetic stripes on the seafloor are arranged symmetrically around mid-ocean ridges.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 4: \"striped with bands of alternating polarity, parallel to and symmetrical about the ridges\".",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "What does the writer suggest was the role of continents under the new theory?",
      options: [
        "Active forces ploughing through the ocean floor.",
        "Stationary masses unaffected by the seafloor.",
        "Passive passengers carried by lithospheric plates.",
        "The drivers of mantle convection.",
      ],
      correct_answer: "Passive passengers carried by lithospheric plates.",
      explanation_vi:
        "Đoạn 5: \"Continents are passive passengers riding on the lithospheric plates\".",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "Why are the Himalayas still rising today?",
      options: [
        "Magnetic reversals push them upward.",
        "The Indian plate continues to push into the Eurasian plate.",
        "Subduction occurs along their southern flank.",
        "Mid-ocean ridge spreading raises continental edges.",
      ],
      correct_answer:
        "The Indian plate continues to push into the Eurasian plate.",
      explanation_vi:
        "Đoạn 6: \"The Himalayas are still rising because the Indian plate continues to push into the Eurasian plate\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What is one open question the writer mentions?",
      options: [
        "Whether the continents originally fitted together.",
        "Whether GPS measurements are reliable.",
        "What the deep mantle's role in driving plate motion is.",
        "Whether magnetic reversals actually happened.",
      ],
      correct_answer:
        "What the deep mantle's role in driving plate motion is.",
      explanation_vi:
        "Đoạn cuối: \"The deep mantle's role in driving plate motion is debated\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What does the writer say about scientific consensus?",
      options: [
        "It always favours senior researchers.",
        "It moves with the evidence rather than the priority of the proposer.",
        "It rarely changes within a single generation.",
        "It is determined by mathematical proofs alone.",
      ],
      correct_answer:
        "It moves with the evidence rather than the priority of the proposer.",
      explanation_vi:
        "Câu cuối bài: \"scientific consensus moves with the evidence, not with the priority of the proposer\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "Old oceanic crust descends back into the mantle in a process called ____.",
      correct_answer: "subduction",
      explanation_vi:
        "Đoạn 5: \"Older crust eventually descends back into the mantle at deep-ocean trenches in a process called subduction\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "The volcanic chain that circles the Pacific basin is known as the Pacific ____ ____.",
      correct_answer: "Ring of Fire",
      explanation_vi:
        "Đoạn 6 nêu rõ \"The Pacific Ring of Fire\". Đáp án 3 từ vẫn nằm trong giới hạn.",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "GPS networks now track plate motion to ____ precision.",
      correct_answer: "millimetre",
      explanation_vi:
        "Đoạn 7: \"GPS receivers now track plate movement to millimetre precision\".",
    },
  ],
};

const INDUSTRIAL_COAL: IELTSReadingPassage = {
  id: "industrial-revolution-coal",
  title_en: "Coal and the Industrial Revolution",
  title_vi: "Than đá và cuộc Cách mạng Công nghiệp",
  topic_family: "history",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc giải thích vì sao than đá là chìa khóa của Cách mạng Công nghiệp Anh: nguồn năng lượng tập trung, sự phát triển của máy hơi nước, các tuyến vận chuyển bằng kênh đào và đường sắt, và những hệ quả xã hội + môi trường mà ngày nay vẫn còn dấu vết.",
  passage_en: `Britain's industrial transformation between 1760 and 1840 has many candidate causes — capital markets, property rights, colonial trade, scientific culture — but every one of them depended on a physical input: coal. Britain happened to sit on enormous, accessible deposits, and the pattern in which those deposits were developed shaped the technology, the transport networks, and the social structure of the new economy.

Pre-industrial energy came largely from human muscle, draft animals, falling water, and wood. All four had hard limits. Wood, in particular, competed with food production: a forest left standing did not feed people, and once cut, it took decades to regrow. By the seventeenth century, parts of England were already running short of timber for both heating and ironmaking. Coal was the alternative. Surface deposits were known and used in Roman Britain; what changed was the willingness to invest in deeper mining as the easy seams were exhausted.

Deeper mines created a new problem: water. Below a certain depth, mines flood faster than human or horse-powered pumps can clear them. The first commercial steam engines, developed by Thomas Newcomen in 1712, were designed specifically to pump water out of coal mines. They were inefficient, but at the pithead they ran on the fuel they were already producing, which made the energy cost negligible. James Watt's improvements in the 1760s and 1770s cut fuel use by about three quarters, and for the first time made it economical to use steam engines outside the mining sector.

The geography of British coal then drove the geography of British industry. Iron foundries, textile mills, and pottery works clustered around the coalfields of Yorkshire, Lancashire, the Midlands, and South Wales. Cities such as Manchester, Birmingham, and Glasgow grew tenfold within a century, drawing labour from the countryside. The displaced rural population was not simply absorbed — many of the new urban workers lived in conditions worse than those they had left, and the early factories employed children for hours that would later be illegal.

Coal also reshaped transport. Moving heavy mineral loads economically required a new network. Britain built more than seven thousand kilometres of canals between 1760 and 1830, most of them designed first for coal traffic. The railways that began to displace canals from the 1830s were similarly coal-driven: the first commercial railway, the Stockton and Darlington line of 1825, hauled coal from inland mines to the river Tees. The locomotives themselves burned coal to produce the steam that moved them. Within a generation, railways carried coal across the country and linked the coalfields to ports for export.

The export trade became substantial. By 1900, Britain was producing about 250 million tonnes of coal a year, more than a third of which left the country. South Wales coal was particularly prized by foreign navies because it produced little smoke when burned, an operational advantage at sea. British coal exports financed shipping, banking, and insurance industries that long outlasted the mining boom itself.

The environmental cost was immediate and visible. London's "pea-soup" fogs of the late nineteenth and early twentieth centuries were largely caused by coal smoke trapped under cold inversion layers; the Great Smog of December 1952 killed an estimated four thousand people in five days and prompted the Clean Air Act of 1956. Acid deposition from coal-burning power stations damaged lakes and forests across northern Europe, a problem only addressed in the 1980s. The longest-running consequence — atmospheric carbon dioxide added by two centuries of fossil-fuel combustion — is now the central problem of climate science.

Historians still debate how essential coal really was. Some argue that British industry would have found other paths if coal had been less accessible; others see coal as the necessary precondition for the entire transformation. What is not in dispute is the speed and scale of the change once coal-fired industry took hold. A society that, in 1760, drew most of its energy from the same biological sources as classical Rome had, by 1860, become the first in human history to derive the bulk of its power from fossil deposits laid down hundreds of millions of years before.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "Coal use in Britain began only in the eighteenth century.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 2: \"Surface deposits were known and used in Roman Britain\" — đã dùng từ thời La Mã.",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "Newcomen's first steam engines were built primarily to drive textile mills.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 3: máy hơi Newcomen \"designed specifically to pump water out of coal mines\".",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "Watt's improvements roughly quartered the fuel use of steam engines.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 3: \"cut fuel use by about three quarters\" — tức còn khoảng 1/4, đồng nghĩa với \"quartered\".",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "Many displaced rural workers lived in conditions worse than they had previously.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 4: \"many of the new urban workers lived in conditions worse than those they had left\".",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "Britain's first commercial railway was built mainly to move passengers.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 5: tuyến Stockton-Darlington 1825 \"hauled coal from inland mines\".",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "South Wales coal was preferred by foreign navies for economic reasons rather than operational ones.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 6: vì \"produced little smoke when burned, an operational advantage\" — lý do vận hành, không phải kinh tế.",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "According to the writer, what was the basic limitation of pre-industrial energy sources?",
      options: [
        "They were too expensive to extract.",
        "They competed with food production.",
        "They were unknown to early Britons.",
        "They produced too much smoke.",
      ],
      correct_answer: "They competed with food production.",
      explanation_vi:
        "Đoạn 2: gỗ \"competed with food production\" và đó là một trong giới hạn cứng (hard limits) chung.",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "Why was a steam engine economical at the pithead?",
      options: [
        "Because it could run on the coal already being produced.",
        "Because it was more efficient than later engines.",
        "Because Newcomen waived royalties.",
        "Because it required no maintenance.",
      ],
      correct_answer:
        "Because it could run on the coal already being produced.",
      explanation_vi:
        "Đoạn 3: \"at the pithead they ran on the fuel they were already producing, which made the energy cost negligible\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What does the writer say about the legacy of British coal exports?",
      options: [
        "They funded the modern welfare state.",
        "They financed industries that outlasted the mining boom.",
        "They produced more revenue than domestic sales.",
        "They led directly to the Clean Air Act of 1956.",
      ],
      correct_answer:
        "They financed industries that outlasted the mining boom.",
      explanation_vi:
        "Đoạn 6: \"financed shipping, banking, and insurance industries that long outlasted the mining boom\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What is described as the longest-running environmental consequence?",
      options: [
        "Acid deposition.",
        "London's pea-soup fogs.",
        "Atmospheric carbon dioxide.",
        "Forest depletion.",
      ],
      correct_answer: "Atmospheric carbon dioxide.",
      explanation_vi:
        "Đoạn 7: \"The longest-running consequence — atmospheric carbon dioxide…\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "Britain built more than seven thousand kilometres of ____ between 1760 and 1830.",
      correct_answer: "canals",
      explanation_vi:
        "Đoạn 5: \"Britain built more than seven thousand kilometres of canals\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "The Great Smog of December 1952 prompted the Clean ____ Act of 1956.",
      correct_answer: "Air",
      explanation_vi:
        "Đoạn 7: \"prompted the Clean Air Act of 1956\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "By 1860, Britain derived the bulk of its power from ____ deposits.",
      correct_answer: "fossil",
      explanation_vi:
        "Câu cuối: \"derive the bulk of its power from fossil deposits\".",
    },
  ],
};

const URBAN_HEAT: IELTSReadingPassage = {
  id: "urban-heat-islands",
  title_en: "Urban Heat Islands",
  title_vi: "Hiện tượng đảo nhiệt đô thị",
  topic_family: "atmospheric_science",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc giới thiệu hiện tượng đảo nhiệt đô thị: nguyên nhân (vật liệu xây dựng, hình học đường phố, nhiệt thải, thiếu thực vật), cách đo lường, hệ quả sức khỏe và năng lượng, và các biện pháp giảm thiểu hiệu quả.",
  passage_en: `Cities are typically warmer than the surrounding countryside, especially at night. The temperature gap, known as the urban heat island effect, varies with the season, the weather, and the design of the city itself. On a calm summer night, central districts of large European or East Asian cities can run four to six degrees Celsius warmer than nearby rural areas. The phenomenon was first measured in London in 1818 by the chemist Luke Howard, but its causes were not understood in detail until the latter half of the twentieth century.

Several factors contribute. Building materials such as concrete, asphalt, and dark roofing absorb solar radiation during the day and release it as heat after sunset. The thermal mass of these materials means cities cool more slowly than open ground. Street geometry traps the heat: narrow canyons between tall buildings reduce the sky view that allows infrared radiation to escape upward. Waste heat from air conditioning, vehicles, and industrial processes adds direct thermal energy to the air. Vegetation, which would otherwise cool the air through evapotranspiration, is sparse in dense urban centres.

The effect is strongest at night, not during the day. During daylight hours, rural surfaces — soil, grass, water — also absorb solar energy and warm. After sunset, however, vegetated surfaces cool quickly through evapotranspiration and outgoing radiation, while urban surfaces continue to release heat stored during the day. The result is a temperature gap that peaks in the early morning hours, well after the sun has set. This is also when the gap matters most for human health: people sleep poorly when nighttime temperatures stay high, and elderly residents in particular are at risk during heatwaves.

Measurement requires care. A single thermometer in a city centre and another at a rural airport can give a misleading number, because the rural site may be on a hilltop or near a paved runway. Modern studies use networks of sensors at standardised heights and locations, sometimes supplemented by satellite thermal imaging. The most rigorous studies pair the urban-rural difference with controls for elevation, soil moisture, and weather conditions. Such studies typically find effects in the two-to-five-degree range for medium-sized cities and slightly larger gaps in megacities.

The energy implications are significant. Urban heat islands raise summer cooling demand and reduce winter heating demand, but the summer effect dominates in tropical and subtropical climates. A city that is two degrees warmer than its surroundings during a heatwave may use twenty per cent more electricity for air conditioning, with the cost falling disproportionately on lower-income residents in older, less-insulated buildings. The waste heat produced by that air conditioning then feeds back into the urban air, creating a positive feedback loop.

Mitigation has been studied extensively. Light-coloured ("cool") roofs reflect more solar radiation and reduce both indoor temperature and the heat re-radiated to the surrounding air. Field measurements in Athens and Phoenix have shown that cool-roof retrofits can lower indoor air temperatures by two to three degrees Celsius on hot days, and city-scale modelling suggests cumulative effects on the urban heat island when adoption is widespread. Tree planting along streets provides shade and evapotranspirative cooling, with the largest benefits in arid climates where the contrast between irrigated and unirrigated surfaces is greatest. Permeable paving, green roofs, and the daylighting of buried streams have all shown measurable but smaller effects.

Policy responses have lagged the science. Singapore introduced a green-roof requirement for new buildings in 2009, and several Mediterranean cities have run cool-roof rebate schemes since the 2010s. In most large cities, however, the building stock turns over slowly, and retrofitting existing structures requires either subsidy or regulation that the political system has been reluctant to impose. Climate projections suggest that urban heat islands will compound the effects of regional warming over the coming decades, particularly in tropical megacities where most population growth is expected. The technical solutions are well established; the question is one of implementation speed.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "The urban heat island effect was first systematically measured in the twentieth century.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 1: Luke Howard đo lần đầu ở London năm 1818 — thế kỷ 19, không phải 20.",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "Concrete and asphalt release stored heat back into the air after sunset.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 2: \"absorb solar radiation during the day and release it as heat after sunset\".",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "The temperature gap between city and countryside is largest at midday.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 3: hiệu ứng \"strongest at night, not during the day\".",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "Heatwaves pose particular risk to elderly residents.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 3: \"elderly residents in particular are at risk during heatwaves\".",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "All cities show identical urban heat island effects in summer.",
      correct_answer: "NOT GIVEN",
      explanation_vi:
        "Bài có nói nhiều thành phố có hiệu ứng khác nhau, nhưng không khẳng định mọi thành phố giống hệt — không có thông tin để xác nhận hay bác bỏ \"identical\".",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "Air conditioning creates a feedback loop with the urban heat island.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 5: \"The waste heat produced by that air conditioning then feeds back into the urban air, creating a positive feedback loop\".",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "Why is a single thermometer comparison misleading?",
      options: [
        "Thermometers are not accurate enough.",
        "Cities have no rural surroundings.",
        "Site differences such as elevation can distort results.",
        "Satellite imaging is always preferred.",
      ],
      correct_answer:
        "Site differences such as elevation can distort results.",
      explanation_vi:
        "Đoạn 4: \"the rural site may be on a hilltop or near a paved runway\" — sự khác biệt vị trí làm sai lệch.",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "What does the writer say about cool-roof effects?",
      options: [
        "They have only been modelled, never measured.",
        "They lower indoor temperatures by two to three degrees on hot days.",
        "They are most effective in cold climates.",
        "They eliminate the need for air conditioning.",
      ],
      correct_answer:
        "They lower indoor temperatures by two to three degrees on hot days.",
      explanation_vi:
        "Đoạn 6: \"cool-roof retrofits can lower indoor air temperatures by two to three degrees Celsius on hot days\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "In which climates do urban trees produce the largest cooling benefit?",
      options: [
        "Tropical climates with high humidity.",
        "Polar climates with little vegetation.",
        "Arid climates where contrast with unirrigated land is highest.",
        "Coastal climates with strong sea breezes.",
      ],
      correct_answer:
        "Arid climates where contrast with unirrigated land is highest.",
      explanation_vi:
        "Đoạn 6: \"the largest benefits in arid climates where the contrast between irrigated and unirrigated surfaces is greatest\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What is the writer's view on policy progress?",
      options: [
        "Policy is ahead of the science.",
        "Policy responses have lagged the science.",
        "Singapore's 2009 rule is sufficient globally.",
        "Mediterranean cities have eliminated heat islands.",
      ],
      correct_answer: "Policy responses have lagged the science.",
      explanation_vi:
        "Đoạn cuối: \"Policy responses have lagged the science\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "Vegetation cools the air through ____.",
      correct_answer: "evapotranspiration",
      explanation_vi:
        "Đoạn 2: \"Vegetation, which would otherwise cool the air through evapotranspiration\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "Singapore introduced a green-roof requirement for new buildings in ____.",
      correct_answer: "2009",
      explanation_vi:
        "Đoạn cuối: \"Singapore introduced a green-roof requirement for new buildings in 2009\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "The first measurement of the urban heat island effect was made by Luke ____.",
      correct_answer: "Howard",
      explanation_vi:
        "Đoạn 1: nhà hóa học Luke Howard đo lần đầu năm 1818.",
    },
  ],
};

const PENICILLIN: IELTSReadingPassage = {
  id: "discovery-of-penicillin",
  title_en: "The Discovery of Penicillin",
  title_vi: "Phát hiện ra penicillin",
  topic_family: "medical_science",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc kể lại quá trình phát hiện penicillin: quan sát tình cờ của Fleming năm 1928, thập kỷ trầm lắng, công sức của nhóm Florey và Chain ở Oxford trong Thế chiến II, rồi sản xuất công nghiệp ở Mỹ và tác động lâu dài lên y học hiện đại.",
  passage_en: `In September 1928, the bacteriologist Alexander Fleming returned from holiday to his laboratory at St Mary's Hospital in London and began clearing a stack of culture plates that had been left out. On one plate of staphylococcus bacteria he noticed a contaminating mould around which the bacterial colonies had failed to grow. Fleming kept the plate, identified the mould as a strain of Penicillium, and over the following months showed that a substance produced by the mould — which he named penicillin — could kill several common pathogenic bacteria without harming animal cells.

Fleming published his findings in 1929 in the British Journal of Experimental Pathology. The paper attracted little attention at the time. The substance was difficult to extract in usable quantities, unstable in storage, and Fleming himself had no biochemical training to push the work further. He continued to use penicillin only as a laboratory tool for isolating particular bacteria, and by 1934 he had largely set the project aside.

The breakthrough came from a different team. In 1939, the Australian pathologist Howard Florey and the German-born biochemist Ernst Chain, both at Oxford, decided to revisit Fleming's old work as part of a broader survey of antibacterial substances. Working with a small group of researchers, they developed methods to extract a more concentrated, more stable form of penicillin. By May 1940 they had enough material to test the substance in mice infected with lethal doses of streptococci. Eight infected mice that received penicillin survived; eight controls died. The result was unambiguous.

Wartime conditions complicated the next steps. Britain in 1940 had neither the chemical industry nor the spare scientific capacity to scale up production, and there was a real fear that German invasion would destroy the Oxford laboratory. Florey and Heatley, his colleague, smeared the lining of their coats with the mould so that, if forced to flee, they could re-establish the strain elsewhere. In July 1941, Florey and Heatley flew to the United States to seek industrial collaborators. The US Department of Agriculture's research laboratory in Peoria, Illinois, joined the effort, and by late 1941 American pharmaceutical firms were beginning a programme of fermentation and yield improvement that would prove decisive.

Several refinements transformed yields by orders of magnitude. The Peoria laboratory replaced the original surface-culture method with submerged-tank fermentation, which allowed much larger volumes. A high-yielding strain of Penicillium was isolated from a mouldy cantaloupe at a Peoria market — a piece of luck that produced about two hundred times more penicillin than Fleming's original strain. Mutagenesis programmes pushed yields even higher. By the time Allied forces landed in Normandy in June 1944, enough penicillin was available to treat every wounded soldier with a serious bacterial infection.

The medical impact was immediate and large. Bacterial pneumonia, which had killed about one in three patients, became routinely curable. Streptococcal infections, which had often progressed to rheumatic fever and damaged hearts, could now be cleared in days. Surgical complications fell sharply: hospital-acquired infections that had been a leading cause of post-operative death in the 1930s declined as antibiotic prophylaxis became standard. Childbirth, long one of the most dangerous moments in a woman's life, became substantially safer.

Fleming, Florey, and Chain shared the Nobel Prize in Physiology or Medicine in 1945. The prize lecture acknowledged the role of luck in the original observation but emphasised, as the citation noted, that the practical drug existed because of careful chemistry rather than careful microbiology. Fleming himself was modest about the discovery, frequently noting that thousands of laboratories had probably observed the same contamination over the years; what mattered was that someone happened to take it seriously.

The post-war decades saw both the consolidation of the new antibiotic era and its first warning signs. By 1947, penicillin-resistant strains of Staphylococcus aureus had appeared in hospitals, the result of selective pressure on a bacterial population now routinely exposed to the drug. The arms race between antibiotics and resistance has continued ever since, and resistant infections are now responsible for an estimated 1.3 million deaths a year worldwide. The discovery that began with a contaminated plate in 1928 thus opened both the most successful chapter of modern medicine and one of its most persistent problems.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "Fleming had received specialised training in biochemistry before 1928.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 2: Fleming \"had no biochemical training to push the work further\".",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "Penicillin was widely adopted within two years of Fleming's 1929 paper.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 2: \"The paper attracted little attention at the time\" — không được ứng dụng rộng rãi sớm.",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "Florey and Chain's first mouse experiment in 1940 had clear results.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 3: 8 con tiêm penicillin sống, 8 con đối chứng chết — \"The result was unambiguous\".",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "Florey and Heatley smeared mould on their coats so they could not be infected.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 4: bôi để \"re-establish the strain elsewhere\" nếu phải bỏ chạy — không phải để tránh nhiễm.",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "American pharmaceutical firms began penicillin production after Florey and Heatley arrived in the US.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 4: sau chuyến đi tháng 7/1941 thì \"by late 1941 American pharmaceutical firms were beginning a programme\".",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "Penicillin was the first antibiotic ever discovered in the world.",
      correct_answer: "NOT GIVEN",
      explanation_vi:
        "Bài không tuyên bố penicillin là kháng sinh đầu tiên trên thế giới — không có thông tin.",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "What does the writer say was decisive in scaling up production?",
      options: [
        "Fleming's continued laboratory work.",
        "The Peoria laboratory's submerged-tank fermentation.",
        "British government investment in 1939.",
        "Imports of mould from Germany.",
      ],
      correct_answer:
        "The Peoria laboratory's submerged-tank fermentation.",
      explanation_vi:
        "Đoạn 5: phương pháp \"submerged-tank fermentation\" và chủng từ dưa vàng ở Peoria là yếu tố quyết định.",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "By the time of D-Day in June 1944, what was true of Allied penicillin supply?",
      options: [
        "It was reserved for officers only.",
        "It was sufficient for every wounded soldier with a serious bacterial infection.",
        "It was unavailable on the front lines.",
        "It was only available to civilians.",
      ],
      correct_answer:
        "It was sufficient for every wounded soldier with a serious bacterial infection.",
      explanation_vi:
        "Đoạn 5: \"enough penicillin was available to treat every wounded soldier with a serious bacterial infection\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "Which of the following had become routinely curable after penicillin?",
      options: [
        "All viral infections.",
        "Bacterial pneumonia.",
        "Tuberculosis.",
        "Diabetes.",
      ],
      correct_answer: "Bacterial pneumonia.",
      explanation_vi:
        "Đoạn 6: \"Bacterial pneumonia, which had killed about one in three patients, became routinely curable\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What does the writer suggest about the original 1928 observation?",
      options: [
        "It had probably been seen by other labs but not taken seriously.",
        "It was unique to St Mary's Hospital.",
        "It could not be reproduced after 1928.",
        "It depended on tropical conditions.",
      ],
      correct_answer:
        "It had probably been seen by other labs but not taken seriously.",
      explanation_vi:
        "Đoạn 7: Fleming nói \"thousands of laboratories had probably observed the same contamination\" — \"what mattered was that someone happened to take it seriously\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "The high-yielding strain of Penicillium was isolated from a mouldy ____.",
      correct_answer: "cantaloupe",
      explanation_vi:
        "Đoạn 5: \"isolated from a mouldy cantaloupe at a Peoria market\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "Penicillin-resistant strains of Staphylococcus aureus had appeared by ____.",
      correct_answer: "1947",
      explanation_vi:
        "Đoạn cuối: \"By 1947, penicillin-resistant strains of Staphylococcus aureus had appeared\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "Resistant bacterial infections are now responsible for an estimated ____ million deaths a year worldwide.",
      correct_answer: "1.3",
      explanation_vi:
        "Đoạn cuối: \"resistant infections are now responsible for an estimated 1.3 million deaths a year\".",
    },
  ],
};

const COMPARATIVE_ADVANTAGE: IELTSReadingPassage = {
  id: "comparative-advantage-trade",
  title_en: "Comparative Advantage in Trade",
  title_vi: "Lợi thế so sánh trong thương mại",
  topic_family: "economics",
  band: 7.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc giải thích lý thuyết lợi thế so sánh của David Ricardo (1817), phân biệt với lợi thế tuyệt đối, đưa ra ví dụ kinh điển vải-rượu giữa Anh và Bồ Đào Nha, thảo luận giả định và giới hạn của lý thuyết, và đánh giá ý nghĩa thực tế của nó hôm nay.",
  passage_en: `Few ideas in economics have been as durable, or as widely misunderstood, as the principle of comparative advantage. The economist David Ricardo set it out in his 1817 work On the Principles of Political Economy and Taxation, and although the algebra has since been refined, the basic insight has not been overturned in two hundred years. The principle states that a country can benefit from trade even when it is less efficient than its trading partners at producing every traded good — provided it specialises in whatever it produces relatively most efficiently.

The point is easiest to see by contrast with absolute advantage. A country has an absolute advantage in producing a good when it can do so with fewer inputs of labour or capital than another country. Adam Smith, writing forty years before Ricardo, had argued that countries should specialise according to their absolute advantages. The puzzle Smith left unresolved was what would happen to countries that had no absolute advantage in anything — countries that, by his reasoning, would have nothing to trade.

Ricardo's answer was to focus on opportunity cost. Each unit of cloth that England produces is a unit of wine it does not produce; each unit of wine is a unit of cloth foregone. The ratios of these opportunity costs may differ from country to country, even when one country is more productive in every line. If England gives up two units of wine for every unit of cloth it produces, while Portugal gives up only one, then Portugal has the lower opportunity cost in wine — even if Portugal is also better at making cloth.

In Ricardo's worked example, Portugal could produce both wine and cloth with less labour than England. Yet under his assumptions, Portugal still benefited from concentrating its labour on wine and exporting it, while England specialised in cloth. The total output of both goods, summed across the two countries, was higher under specialisation than under autarky. Trade then redistributed the gains: each country could consume a combination of cloth and wine that lay outside its own production possibility frontier.

The argument has several preconditions that are easy to overlook. It assumes that labour and capital are mobile within a country but not between countries; that production technology is freely available; that markets are competitive; and — most importantly — that resources released from one industry can move smoothly to another. In practice, displaced workers do not always find new jobs, retraining takes time, and adjustment costs can be heavy enough to swamp the static gains from trade in the short term.

Ricardo's framing has also been criticised as static. It compares two equilibrium states without explaining how a country might move from one to the other, or whether the path of specialisation it implies is desirable in the long run. A country that specialises in low-skill agriculture today may struggle to develop a manufacturing base later. Some development economists have argued that comparative advantage justifies temporary protection of "infant industries" — sectors that would never become competitive if exposed to mature foreign rivals from the start. Ricardo himself acknowledged in passing that the principle was about static gains and did not fully address dynamic learning effects.

Modern empirical work has tested the principle's predictions repeatedly. Studies of agricultural trade between developing countries and developed economies in the late twentieth century broadly confirm Ricardo's qualitative claims: countries do tend to export goods in which they have lower opportunity costs. The match is not perfect, however. Trade is also influenced by economies of scale, product differentiation, transport costs, and tariffs that the original theory ignored. Modern trade theory, particularly the work of Paul Krugman in the late 1970s, has integrated these factors into models that explain why similar countries trade similar goods — for example, why Germany and Japan both export cars to each other.

The principle's policy implications remain contested. Most economists still treat it as the foundation of the case for open trade, but they increasingly emphasise that the static gains it predicts must be balanced against adjustment costs, distributional consequences, and the dynamic question of which industries a country chooses to develop. The principle, then, is best understood not as a complete theory of trade but as a starting point: a logical demonstration that trade can be mutually beneficial under specified conditions, leaving the question of how to arrange those conditions as a matter of policy and politics.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "The principle of comparative advantage was set out by Adam Smith.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 1: Ricardo trình bày năm 1817; Smith viết về lợi thế tuyệt đối 40 năm trước đó (đoạn 2).",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "Smith's framing struggled to explain trade for countries with no absolute advantage.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 2: \"countries that, by his reasoning, would have nothing to trade\" — chính là vấn đề Smith để lại.",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "Ricardo argued that trade benefits both countries only when each is more efficient at one good.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 1: trade benefit \"even when it is less efficient than its trading partners at producing every traded good\".",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "Under Ricardo's example, Portugal was less productive than England in both goods.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 4: Portugal sản xuất cả hai mặt hàng với ít lao động hơn — Portugal có lợi thế tuyệt đối.",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "Ricardo assumed that labour can move freely between countries.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 5: giả định lao động và vốn \"mobile within a country but not between countries\".",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "Some development economists have used comparative advantage to defend infant-industry protection.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 6: \"Some development economists have argued that comparative advantage justifies temporary protection of 'infant industries'\".",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "What is the central concept Ricardo used to explain mutual gains?",
      options: [
        "Absolute advantage.",
        "Opportunity cost.",
        "Economies of scale.",
        "Tariff equilibrium.",
      ],
      correct_answer: "Opportunity cost.",
      explanation_vi:
        "Đoạn 3: \"Ricardo's answer was to focus on opportunity cost\".",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "What practical limitation does the writer raise about Ricardo's preconditions?",
      options: [
        "That labour cannot be measured.",
        "That displaced workers may not find new jobs quickly.",
        "That technology is permanently scarce.",
        "That markets are always competitive.",
      ],
      correct_answer:
        "That displaced workers may not find new jobs quickly.",
      explanation_vi:
        "Đoạn 5: \"displaced workers do not always find new jobs, retraining takes time, and adjustment costs can be heavy\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What did Paul Krugman's work in the late 1970s help explain?",
      options: [
        "Why countries should adopt fixed exchange rates.",
        "Why agricultural trade is dominant in developing countries.",
        "Why similar countries trade similar goods.",
        "Why opportunity costs always equalise.",
      ],
      correct_answer: "Why similar countries trade similar goods.",
      explanation_vi:
        "Đoạn 7: Krugman \"explain why similar countries trade similar goods — for example, why Germany and Japan both export cars\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "How does the writer characterise comparative advantage today?",
      options: [
        "A complete theory of trade.",
        "A discredited concept.",
        "A starting point that needs to be balanced against other concerns.",
        "A purely mathematical curiosity.",
      ],
      correct_answer:
        "A starting point that needs to be balanced against other concerns.",
      explanation_vi:
        "Đoạn cuối: \"best understood not as a complete theory of trade but as a starting point\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "Ricardo published his ideas in a 1817 work titled On the Principles of Political Economy and ____.",
      correct_answer: "Taxation",
      explanation_vi:
        "Đoạn 1: \"On the Principles of Political Economy and Taxation\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "Trade theories developed since the 1970s integrate factors such as economies of scale and product ____.",
      correct_answer: "differentiation",
      explanation_vi:
        "Đoạn 7: \"economies of scale, product differentiation, transport costs, and tariffs\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "Ricardo's example contrasts the production of cloth and ____ in England and Portugal.",
      correct_answer: "wine",
      explanation_vi:
        "Đoạn 3 và 4: ví dụ nổi tiếng vải (cloth) và rượu (wine).",
    },
  ],
};

const PHOTOSYNTHESIS: IELTSReadingPassage = {
  id: "photosynthesis-and-carbon-capture",
  title_en: "Photosynthesis and the Global Carbon Cycle",
  title_vi: "Quang hợp và chu trình carbon toàn cầu",
  topic_family: "life_science",
  band: 7.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc trình bày tổng quan quang hợp như một quá trình hóa học và sinh học, phân biệt giữa thực vật C3, C4 và CAM, vai trò của thực vật trong chu trình carbon toàn cầu, và những giới hạn khi dùng \"trồng cây\" như giải pháp khí hậu.",
  passage_en: `Photosynthesis is the process by which plants, algae, and certain bacteria use light energy to convert carbon dioxide and water into organic compounds and oxygen. The reaction is the foundation of nearly all food chains on Earth, and its by-product — molecular oxygen — built and continues to maintain the atmosphere on which animal life depends. The chemistry has been understood in outline since the early twentieth century, but the details of how light energy is captured, how electrons are moved, and how carbon is fixed are still being refined.

Light is captured by chlorophyll, a pigment housed in flat membranous structures inside chloroplasts. When a chlorophyll molecule absorbs a photon, an electron is raised to a higher energy state and is then passed along a chain of protein complexes embedded in the membrane. The energy released as the electron moves down the chain is used to drive two operations: pumping protons across the membrane to build up a concentration gradient, and producing reducing power in the form of NADPH. The proton gradient is then released through the enzyme ATP synthase, which manufactures the energy-carrier molecule ATP. ATP and NADPH together fuel the second stage.

The second stage, the Calvin cycle, takes place in the surrounding chloroplast fluid. The enzyme RuBisCO catalyses the addition of carbon dioxide to a five-carbon sugar called RuBP, producing two molecules of a three-carbon compound. A series of further reactions, powered by ATP and NADPH, regenerates RuBP and exports excess carbon as glucose and other sugars. The cycle requires no light directly; it can run as long as ATP and NADPH are supplied. RuBisCO is one of the most abundant proteins on Earth, but it is also remarkably slow and prone to a wasteful side reaction with oxygen, an evolutionary legacy from a time when atmospheric oxygen was much lower.

Plants have evolved different strategies to compensate for RuBisCO's limitations. Most familiar species — wheat, rice, soybeans — use the standard pathway, called C3 photosynthesis, in which CO₂ enters the Calvin cycle directly. C4 plants, including maize, sugarcane, and many tropical grasses, employ a spatial trick: they first concentrate CO₂ in specialised cells before delivering it to RuBisCO. This concentration step suppresses the wasteful oxygen side reaction and makes C4 plants substantially more productive in hot, sunny conditions. CAM plants, including pineapples and many succulents, use a temporal trick: they capture CO₂ at night, store it as malic acid, and release it for the Calvin cycle by day, allowing them to keep their stomata closed in the heat and conserve water.

Globally, terrestrial plants and ocean phytoplankton together fix about 120 gigatonnes of carbon a year through photosynthesis. About half of this carbon is returned to the atmosphere immediately through plant respiration; the rest enters food webs, decomposes, or is stored in soils, peat, sediments, and biomass. The annual fluxes are vastly larger than human emissions of fossil-fuel CO₂, but human emissions are an addition to a previously near-balanced cycle, and the imbalance is what is driving atmospheric carbon dioxide to rise.

The role of forests in absorbing the human imbalance is therefore both significant and limited. Mature forests can hold large amounts of carbon, but a forest that is at carbon equilibrium absorbs as much as it releases on average and provides little net additional storage. New forest plantings absorb additional carbon while they grow, typically reaching a peak rate after twenty to thirty years and slowing as the forest matures. Forest fires, drought, and disease can release decades of stored carbon back to the atmosphere within weeks. Tropical forests are the largest standing biological carbon stores, but they are also the most vulnerable to deforestation pressure.

Engineered approaches to enhance natural photosynthesis are an active research area. Genetic modifications to RuBisCO have improved its efficiency in laboratory crops; switching the photosynthetic pathway of rice from C3 to C4 has been a long-standing research target because it could substantially raise yields. Algal cultivation, fast-growing tree species, and ocean iron fertilisation have all been proposed as ways to draw down atmospheric carbon, but each runs into limits of scale, cost, or unintended ecological effect. Photosynthesis is a powerful natural process, but it is not a substitute for emissions reductions; the imbalance between human inputs and natural storage capacity is too large for biological removal alone to close.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "Photosynthesis was first described in detail in the late nineteenth century.",
      correct_answer: "NOT GIVEN",
      explanation_vi:
        "Đoạn 1 nói chỉ \"in outline since the early twentieth century\" — không có thông tin về thế kỷ 19 chi tiết.",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "ATP and NADPH are needed to power the Calvin cycle.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 3: \"powered by ATP and NADPH\" — chu trình Calvin cần cả hai.",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "RuBisCO is rare in nature.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 3: \"RuBisCO is one of the most abundant proteins on Earth\".",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "C4 plants concentrate CO₂ before it reaches RuBisCO.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 4: C4 \"first concentrate CO₂ in specialised cells before delivering it to RuBisCO\".",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "CAM plants capture CO₂ during the day and release it at night.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 4: ngược lại — CAM \"capture CO₂ at night… release it for the Calvin cycle by day\".",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "Mature forests in equilibrium add little net additional storage.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 6: \"a forest that is at carbon equilibrium absorbs as much as it releases on average and provides little net additional storage\".",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "Where does the Calvin cycle take place?",
      options: [
        "Inside ATP synthase.",
        "On the chloroplast membrane.",
        "In the surrounding chloroplast fluid.",
        "In the plant's roots.",
      ],
      correct_answer: "In the surrounding chloroplast fluid.",
      explanation_vi:
        "Đoạn 3: \"The second stage, the Calvin cycle, takes place in the surrounding chloroplast fluid\".",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "Why are C4 plants more productive in hot, sunny conditions?",
      options: [
        "They have larger leaves than C3 plants.",
        "Their CO₂ concentration step suppresses a wasteful side reaction.",
        "They photosynthesise only at night.",
        "They do not need water.",
      ],
      correct_answer:
        "Their CO₂ concentration step suppresses a wasteful side reaction.",
      explanation_vi:
        "Đoạn 4: \"This concentration step suppresses the wasteful oxygen side reaction and makes C4 plants substantially more productive\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What does the writer say about human fossil-fuel emissions in the carbon cycle?",
      options: [
        "They are the largest carbon flux on Earth.",
        "They are smaller than annual photosynthetic fluxes but unbalance the cycle.",
        "They are absorbed entirely by ocean phytoplankton.",
        "They have no effect on atmospheric CO₂.",
      ],
      correct_answer:
        "They are smaller than annual photosynthetic fluxes but unbalance the cycle.",
      explanation_vi:
        "Đoạn 5: \"vastly larger than human emissions… but human emissions are an addition to a previously near-balanced cycle\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What is the writer's overall view of biological carbon removal?",
      options: [
        "It can fully replace emissions reductions.",
        "It is too slow to matter at any scale.",
        "It is powerful but cannot close the imbalance alone.",
        "It is forbidden by international agreements.",
      ],
      correct_answer:
        "It is powerful but cannot close the imbalance alone.",
      explanation_vi:
        "Câu cuối: \"the imbalance… is too large for biological removal alone to close\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "Light is captured by ____, a pigment housed in chloroplasts.",
      correct_answer: "chlorophyll",
      explanation_vi:
        "Đoạn 2: \"Light is captured by chlorophyll, a pigment housed in flat membranous structures\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "CAM plants store nighttime CO₂ as ____ acid.",
      correct_answer: "malic",
      explanation_vi:
        "Đoạn 4: \"capture CO₂ at night, store it as malic acid\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "Plants and ocean phytoplankton together fix about ____ gigatonnes of carbon per year.",
      correct_answer: "120",
      explanation_vi:
        "Đoạn 5: \"about 120 gigatonnes of carbon a year through photosynthesis\".",
    },
  ],
};

const PRINTING_PRESS: IELTSReadingPassage = {
  id: "rise-of-movable-type-printing",
  title_en: "The Rise of Movable Type Printing",
  title_vi: "Sự ra đời của in chữ rời",
  topic_family: "history",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc kể lại lịch sử in chữ rời: phát minh sớm hơn ở Đông Á, đột phá kim loại của Gutenberg ở châu Âu thế kỷ 15, sự lan rộng nhanh chóng, và những thay đổi văn hóa-kinh tế kéo dài vài thế kỷ.",
  passage_en: `Movable type — individual letters or characters that can be assembled into pages, used to print, then disassembled and reused — is one of those inventions whose long-term effects far exceeded what its early users could have foreseen. The standard story names Johannes Gutenberg of Mainz as the inventor in the mid-fifteenth century, and his role in producing the first commercially successful European printed book, the so-called Gutenberg Bible of about 1455, is well documented. The fuller history begins several centuries earlier and on a different continent.

The Chinese inventor Bi Sheng created the earliest known movable type around 1040 CE, using individual ceramic characters baked from clay. Wooden type appeared in China during the thirteenth century, and metal type was in use in Korea by the early fifteenth century. The Korean court even produced a sizeable printed library before Gutenberg began his work. These East Asian systems faced a structural disadvantage that European movable type would not encounter: a writing system that required thousands of distinct characters, against the few dozen letters of an alphabet. Setting an alphabetic page was much faster, and a much smaller stock of type pieces could compose any text.

Gutenberg's specific contribution was a set of practical innovations that made the system commercially viable in Europe. He developed an alloy of lead, tin, and antimony that could be cast precisely, was hard enough to withstand many impressions, and could be melted down and recast when type wore out. He adapted the screw press, originally used for pressing grapes and olives, to apply even pressure to a tray of inked type. He used an oil-based ink that adhered to metal type and to paper without smudging. None of these elements were entirely novel on their own; together, they made a workshop economically viable.

The diffusion of the new technology through Europe was rapid by the standards of the period. Within twenty years of Gutenberg's first complete book, presses had been established in more than a dozen cities, including Cologne, Augsburg, Venice, Paris, and London. Venice alone had over a hundred presses by 1500. Estimated European book production in the second half of the fifteenth century — the period historians call the incunable era, before about 1501 — runs into the tens of millions of copies, more than had been produced by all the manuscript copyists of the previous millennium combined.

The economics of book production transformed accordingly. A manuscript Bible took a single scribe perhaps a year to copy. A printer with a small workshop could produce a similar number of copies in days, at less than a tenth of the per-copy cost of a manuscript. Books that had been the property of monasteries, universities, and aristocrats became the property of merchants, professionals, and an emerging middle class. By the early sixteenth century, schoolbooks, technical manuals, almanacs, and pamphlets were being produced in numbers that would have been impossible a generation earlier.

Cultural consequences followed, though more slowly than is sometimes claimed. The Reformation owed part of its rapid spread to the printed pamphlet — Luther's writings reached cities from Mainz to Wittenberg within weeks of publication — but printing did not cause the religious upheaval. Standardised vernacular spelling emerged gradually as printers settled on shared conventions. Scientific publication shifted from private letters and manuscripts to printed journals over more than a century. The institution of the printed dictionary did not become widespread until the seventeenth and eighteenth centuries.

Long-term effects went beyond the immediate cultural changes. Reliable, identical copies of texts allowed scholars across Europe to build on the same versions of works they had not personally seen. Errors could be corrected in subsequent editions and the corrections circulated. Authorship and copyright began to take on something like their modern meanings as the production of identical copies created the legal puzzle of who owned the right to make them. The financial structure of bookselling — capital tied up in unsold inventory, distribution networks reaching across borders, the slow turnover of a backlist — formed the basis of modern publishing.

The technology itself remained recognisable for centuries. The basic principles of metal type, screw press, and oil-based ink dominated until the introduction of steam-powered presses in the early nineteenth century and rotary presses later in the same century. Photolithography, hot-metal Linotype, offset printing, and finally digital typesetting each replaced earlier methods, but movable type as Gutenberg used it was still in commercial use for fine printing into the late twentieth century. Few inventions have shaped how human beings store and transmit information for as long.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "Movable type was first invented in Europe by Gutenberg.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 2: Bi Sheng (Trung Quốc) tạo ra chữ rời sớm nhất khoảng 1040 CE — trước Gutenberg vài thế kỷ.",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "East Asian printing was hampered by the large number of characters required.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 2: \"a writing system that required thousands of distinct characters, against the few dozen letters of an alphabet\".",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "Gutenberg invented every component of his system from scratch.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 3: \"None of these elements were entirely novel on their own\" — ông tổng hợp các yếu tố có sẵn.",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "Venice had over a hundred presses by 1500.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 4: \"Venice alone had over a hundred presses by 1500\".",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "Printing reduced the cost of producing a Bible by about half.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 5: chi phí mỗi bản giảm còn \"less than a tenth\" — giảm hơn 10 lần, không phải một nửa.",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "The printed dictionary was already widespread by the early sixteenth century.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 6: từ điển in \"did not become widespread until the seventeenth and eighteenth centuries\".",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "What was Gutenberg's specific innovation in materials?",
      options: [
        "A wooden press fitted with iron clamps.",
        "A lead-tin-antimony alloy for type that could be precisely cast and recast.",
        "A new kind of paper that absorbed ink quickly.",
        "Coloured inks for illustrated pages.",
      ],
      correct_answer:
        "A lead-tin-antimony alloy for type that could be precisely cast and recast.",
      explanation_vi:
        "Đoạn 3: hợp kim chì-thiếc-antimon là đóng góp cụ thể về vật liệu.",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "What did the writer suggest about the role of printing in the Reformation?",
      options: [
        "Printing caused the Reformation.",
        "Printing slowed its spread.",
        "Printing helped its spread but did not cause it.",
        "Printing was unrelated to the Reformation.",
      ],
      correct_answer:
        "Printing helped its spread but did not cause it.",
      explanation_vi:
        "Đoạn 6: \"printing did not cause the religious upheaval\" nhưng đóng góp vào tốc độ lan truyền.",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What new legal problem did printing create?",
      options: [
        "Tax collection on books.",
        "The question of who owned the right to make identical copies.",
        "The need for a vernacular dictionary.",
        "Religious censorship by the church.",
      ],
      correct_answer:
        "The question of who owned the right to make identical copies.",
      explanation_vi:
        "Đoạn 7: \"the legal puzzle of who owned the right to make them\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "When were steam-powered presses introduced?",
      options: [
        "Late fifteenth century.",
        "Sixteenth century.",
        "Early nineteenth century.",
        "Late twentieth century.",
      ],
      correct_answer: "Early nineteenth century.",
      explanation_vi:
        "Đoạn cuối: \"the introduction of steam-powered presses in the early nineteenth century\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "Bi Sheng's earliest movable type was made from baked ____.",
      correct_answer: "clay",
      explanation_vi:
        "Đoạn 2: \"individual ceramic characters baked from clay\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "Gutenberg adapted the ____ press, used originally for grapes and olives.",
      correct_answer: "screw",
      explanation_vi:
        "Đoạn 3: \"He adapted the screw press, originally used for pressing grapes and olives\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "The era of European books printed before about 1501 is called the ____ era.",
      correct_answer: "incunable",
      explanation_vi:
        "Đoạn 4: \"the period historians call the incunable era, before about 1501\".",
    },
  ],
};

const MONSOON: IELTSReadingPassage = {
  id: "monsoon-climate-systems",
  title_en: "Monsoon Climate Systems",
  title_vi: "Hệ thống khí hậu gió mùa",
  topic_family: "atmospheric_science",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc giải thích cơ chế gió mùa: chênh lệch nhiệt giữa lục địa và đại dương theo mùa, vai trò của Cao nguyên Tây Tạng và El Niño, hệ quả nông nghiệp ở châu Á và Tây Phi, và biến đổi khí hậu đang làm thay đổi cường độ gió mùa thế nào.",
  passage_en: `A monsoon is a seasonal reversal of wind direction over a large region, accompanied by sharp changes in rainfall. The most familiar example is the South Asian monsoon, which delivers most of India's annual precipitation in a four-month window between June and September. Monsoon systems also exist over West Africa, East Asia, northern Australia, and parts of the Americas. About a third of the world's population lives in regions whose agriculture depends directly on a monsoon's reliable arrival.

The driving mechanism is the differential heating of land and sea. Land surfaces warm and cool quickly; ocean surfaces change temperature slowly. In summer, continental interiors heat up far above ocean temperatures. The hot air rises, and air from the cooler ocean flows inland to replace it, picking up moisture as it travels. As this moisture-laden air is forced upward — by mountain ranges or simply by convection — it cools and releases its water as rain. In winter, the pattern reverses: the continent cools faster, surface pressure rises, and the wind flows outward toward the now-warmer ocean, bringing dry conditions.

The South Asian monsoon's intensity owes much to the geography of the Indian subcontinent. The Himalayas and the Tibetan Plateau form a wall that prevents cold air from Central Asia from mixing with warm air from the Indian Ocean. The plateau itself, sitting at four to five thousand metres above sea level, becomes a heat source in summer, drawing air northward from the ocean with particular force. Without the plateau, models suggest, the monsoon would still occur but would be considerably weaker.

The annual rhythm has been broadly stable for millennia, but year-to-year variation can be extreme. A single weak monsoon can mean failed harvests across northern India and Bangladesh; a strong one can mean catastrophic flooding in the same region. The El Niño-Southern Oscillation, a large-scale climate cycle in the Pacific, is one of the strongest predictors of monsoon strength. El Niño years tend to coincide with weaker Indian monsoons, although the relationship is not deterministic. Researchers have also identified shorter cycles tied to the Indian Ocean Dipole, a similar oscillation in the Indian Ocean itself.

West Africa's monsoon system has different geography but a related mechanism. The Intertropical Convergence Zone — a band of low pressure where the trade winds of the two hemispheres meet — moves north over West Africa each summer, bringing rain to a strip from Senegal to Sudan. Sahel droughts in the late twentieth century, particularly during the 1970s and 1980s, were associated with a southward shift of this rain band, with severe consequences for agriculture and livestock. Recovery has been partial; the rain has returned but its variability remains higher than in earlier decades.

The agricultural calendar in monsoon regions is built around the rains. South Asian rice farmers traditionally plant immediately after the first monsoon showers, relying on the rains to flood their paddies. A late monsoon delays sowing and shortens the growing season; an early withdrawal can leave crops without enough water in the critical grain-filling stage. Indian government statistics show that monsoon rainfall in any given year correlates closely with national agricultural output, although irrigation has reduced the link in some regions.

Climate change is altering monsoon behaviour in ways that are still being characterised. Warmer ocean surfaces hold more moisture, so individual monsoon downpours have grown heavier in many regions. The same warming, however, can disrupt the temperature gradient between land and sea that drives the system. Observations suggest that the South Asian monsoon's total rainfall has become more variable rather than monotonically increasing or decreasing — wet years wetter, dry years drier. The number of extreme rainfall days has risen even as the number of moderate rainfall days has fallen.

Adaptation is happening on several fronts. Drought-tolerant varieties of rice and millet allow planting under less reliable rainfall. Improved short-term forecasting — increasingly down to two-week timescales — helps farmers decide when to sow. Storage infrastructure for both grain and water reduces the impact of single-year shocks. The challenge is scale: hundreds of millions of smallholder farmers cannot afford the irrigation, storage, or weather services that larger commercial operations take for granted, and the regions most exposed to monsoon variability are also among the world's poorest.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "Monsoon systems exist only in South Asia.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 1: cũng có ở Tây Phi, Đông Á, miền bắc Úc và một phần châu Mỹ.",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "About a third of the world's population lives in regions where agriculture depends on a monsoon.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 1: \"About a third of the world's population lives in regions whose agriculture depends directly on a monsoon's reliable arrival\".",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "The Tibetan Plateau weakens the South Asian monsoon.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 3: cao nguyên Tây Tạng làm gió mùa mạnh hơn — không có nó \"the monsoon would still occur but would be considerably weaker\".",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "El Niño years are always followed by strong Indian monsoons.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 4: ngược lại — \"El Niño years tend to coincide with weaker Indian monsoons\".",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "Sahel droughts in the late twentieth century were caused by a southward shift of the rain band.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 5: \"associated with a southward shift of this rain band\".",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "Climate change has made the South Asian monsoon's total rainfall steadily decrease year by year.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 7: tổng lượng mưa biến động hơn — \"more variable rather than monotonically increasing or decreasing\".",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "What is the basic mechanism that drives monsoons?",
      options: [
        "The rotation of the Earth's axis.",
        "Differential heating between land and sea.",
        "The position of the moon.",
        "Volcanic eruptions.",
      ],
      correct_answer:
        "Differential heating between land and sea.",
      explanation_vi:
        "Đoạn 2: \"The driving mechanism is the differential heating of land and sea\".",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "Why does monsoon air release rain over land?",
      options: [
        "Because it cools as it is forced upward.",
        "Because it loses moisture by friction.",
        "Because it crosses the equator.",
        "Because it is filtered by vegetation.",
      ],
      correct_answer:
        "Because it cools as it is forced upward.",
      explanation_vi:
        "Đoạn 2: \"As this moisture-laden air is forced upward… it cools and releases its water as rain\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What does the writer say about the agricultural impact of climate change on monsoons?",
      options: [
        "Crops have become uniformly easier to grow.",
        "Heavier individual downpours have become more common.",
        "The monsoon has been replaced by year-round rain.",
        "Adaptation has been impossible everywhere.",
      ],
      correct_answer:
        "Heavier individual downpours have become more common.",
      explanation_vi:
        "Đoạn 7: \"individual monsoon downpours have grown heavier in many regions\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What is the central challenge of adapting to monsoon variability?",
      options: [
        "That irrigation technology does not yet exist.",
        "That hundreds of millions of smallholder farmers cannot afford modern services.",
        "That governments deny the problem.",
        "That weather forecasting is impossible.",
      ],
      correct_answer:
        "That hundreds of millions of smallholder farmers cannot afford modern services.",
      explanation_vi:
        "Đoạn cuối: \"hundreds of millions of smallholder farmers cannot afford the irrigation, storage, or weather services\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "The Indian Ocean ____, a similar oscillation, also affects monsoon strength.",
      correct_answer: "Dipole",
      explanation_vi:
        "Đoạn 4: \"the Indian Ocean Dipole, a similar oscillation in the Indian Ocean itself\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "The band of low pressure where the trade winds meet is the Intertropical ____ Zone.",
      correct_answer: "Convergence",
      explanation_vi:
        "Đoạn 5: \"the Intertropical Convergence Zone\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "South Asian rice farmers traditionally plant immediately after the first monsoon ____.",
      correct_answer: "showers",
      explanation_vi:
        "Đoạn 6: \"plant immediately after the first monsoon showers\".",
    },
  ],
};

const COFFEE_ORIGINS: IELTSReadingPassage = {
  id: "origins-of-coffee-cultivation",
  title_en: "The Origins of Coffee Cultivation",
  title_vi: "Nguồn gốc của việc trồng cà phê",
  topic_family: "agriculture",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc trình bày lịch sử cà phê: từ vùng cao nguyên Ethiopia đến quán cà phê Ottoman, sự lan rộng đến châu Âu thế kỷ 17 và châu Mỹ thuộc địa, phân biệt arabica và robusta, và những thách thức bệnh dịch khiến ngành cà phê toàn cầu hôm nay phụ thuộc vào sự đa dạng di truyền.",
  passage_en: `The coffee plant is native to the highlands of southwestern Ethiopia, where the species Coffea arabica still grows wild today. The earliest reliable accounts of brewed coffee come from Yemen in the fifteenth century, where Sufi monasteries used the drink to stay awake during long night prayers. From Yemen the practice spread north through the Ottoman Empire — first to Mecca, then to Cairo, Damascus, Istanbul, and onward into the European trading ports of the Mediterranean.

The coffeehouse, as a social institution, is essentially Ottoman in origin. The first known commercial coffeehouse opened in Istanbul in the mid-sixteenth century, and within a few decades the city had hundreds. Coffeehouses were not restaurants; they were places where men gathered to talk, play backgammon, and read the newspapers that began appearing in the seventeenth century. The format spread to European port cities — Venice, Marseille, London — by the mid-seventeenth century. London alone had over two thousand coffeehouses by 1700.

The first plants outside the Arab world were transplanted by Dutch traders. Yemeni authorities had restricted the export of viable beans for over a century by parboiling or roasting them before shipment, but in 1696 a small number of seedlings reached Java, then a Dutch colony. From Java, plants travelled to the Botanical Gardens in Amsterdam, and from Amsterdam a single plant — said to have been a diplomatic gift from the Dutch to the French king — became the parent of the coffee that French planters introduced to the Caribbean in the 1720s. From the Caribbean, cultivation spread to Brazil, where the climate and soil proved ideally suited.

Brazil now produces about a third of the world's coffee, but the species and varieties are not what was originally cultivated. Almost all the world's high-end coffee comes from Coffea arabica, the same species that grows wild in Ethiopia. A second species, Coffea canephora — known commercially as robusta — was domesticated only in the late nineteenth century in central Africa. Robusta is hardier, grows at lower altitudes, and produces beans with about twice the caffeine content of arabica, but its flavour is generally considered inferior. About thirty per cent of the global coffee crop today is robusta, used mainly in instant coffee and as a blending component in espresso.

Genetic diversity in commercially grown arabica is dangerously narrow. The plants spread to Java in 1696 and onward to the Caribbean and Brazil all descended from a small founding population. When coffee leaf rust — a fungal disease known to farmers as roya — first reached Sri Lanka in the late 1860s, it destroyed the island's entire coffee industry within a decade. Sri Lanka's planters switched to tea, but the lesson about disease vulnerability was not fully absorbed. Coffee leaf rust spread to Brazil in 1970 and to Central America in the 1980s and 1990s, where major outbreaks in 2012 and 2013 caused billions of dollars in losses and pushed many smallholders out of business.

Plant breeders responded by reaching back to Ethiopia for genetic material. Wild arabica populations in southwestern Ethiopia harbour disease-resistance genes that the cultivated lineage lost during the long bottleneck of its global spread. International seed banks have collected thousands of accessions from Ethiopian forests, and breeders have been crossing these into commercial varieties to produce hybrids that yield well, taste acceptable, and resist roya. The work is slow because coffee plants take three to four years from planting to first harvest, and proper testing of disease resistance takes longer still.

Climate change has added a further pressure. Coffee plants are sensitive to both temperature and rainfall, and arabica in particular grows best in a narrow range of cool, humid conditions found at moderate altitudes in the tropics. As average temperatures rise, the suitable elevation for arabica is moving upslope. In some regions — parts of Ethiopia, Colombia, and Central America — the elevations needed will eventually exceed the highest available land. Several recent studies project significant declines in suitable arabica land by 2050, particularly in lowland producing regions.

The future of the industry rests on whether breeding and cultivation practices can keep pace with both disease pressure and climate stress. The genetic diversity preserved in the Ethiopian highlands — the species' original home — turns out to be one of the few resources that might allow the global coffee crop to adapt. The cup of coffee that travels from a Vietnamese plantation, a Brazilian estate, or a Colombian smallholder farm to a Hanoi café table thus has a history that runs through Sufi monasteries, Ottoman coffeehouses, Dutch ships, French gardens, Caribbean colonies — and, increasingly, back to the Ethiopian forests where it began.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "Coffea arabica originated in Yemen.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 1: bản địa của Ethiopia; Yemen chỉ là nơi đầu tiên có ghi chép về uống cà phê.",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "Sufi monasteries used coffee to stay awake during night prayers.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 1: \"Sufi monasteries used the drink to stay awake during long night prayers\".",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "Yemeni authorities allowed viable beans to be exported freely from the start.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 3: \"Yemeni authorities had restricted the export of viable beans for over a century\".",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "Robusta has about twice the caffeine of arabica.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 4: \"about twice the caffeine content of arabica\".",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "Coffee leaf rust first reached Sri Lanka in the late 1980s.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 5: tới Sri Lanka cuối thập niên 1860, không phải 1980.",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "Hybrid varieties using Ethiopian genetic material can be tested in less than a year.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 6: cây cà phê mất 3–4 năm tới vụ đầu tiên, kiểm tra kháng bệnh còn lâu hơn.",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "What was the original social function of Ottoman coffeehouses?",
      options: [
        "They were restaurants serving meals.",
        "They were places to gather, talk, and read newspapers.",
        "They were religious worship sites.",
        "They were government offices.",
      ],
      correct_answer:
        "They were places to gather, talk, and read newspapers.",
      explanation_vi:
        "Đoạn 2: \"places where men gathered to talk, play backgammon, and read the newspapers\".",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "How did Yemeni authorities try to prevent coffee export?",
      options: [
        "By taxing all green beans heavily.",
        "By parboiling or roasting beans before shipment.",
        "By destroying European ports.",
        "By forming a treaty with the Dutch.",
      ],
      correct_answer:
        "By parboiling or roasting beans before shipment.",
      explanation_vi:
        "Đoạn 3: \"by parboiling or roasting them before shipment\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What does the writer say about the genetic diversity of commercial arabica?",
      options: [
        "It is exceptionally wide.",
        "It is dangerously narrow.",
        "It is the same as wild Ethiopian populations.",
        "It exceeds that of robusta.",
      ],
      correct_answer: "It is dangerously narrow.",
      explanation_vi:
        "Đoạn 5: \"Genetic diversity in commercially grown arabica is dangerously narrow\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What does climate change mean for arabica's suitable growing area?",
      options: [
        "It is expanding into new lowland regions.",
        "It is shifting upslope as temperatures rise.",
        "It is stable.",
        "It is unaffected by warming.",
      ],
      correct_answer:
        "It is shifting upslope as temperatures rise.",
      explanation_vi:
        "Đoạn 7: \"the suitable elevation for arabica is moving upslope\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "Coffee leaf rust is also known to farmers as ____.",
      correct_answer: "roya",
      explanation_vi:
        "Đoạn 5: \"a fungal disease known to farmers as roya\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "Brazil now produces about a ____ of the world's coffee.",
      correct_answer: "third",
      explanation_vi:
        "Đoạn 4: \"Brazil now produces about a third of the world's coffee\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "Wild arabica plants in southwestern Ethiopia carry ____ genes that cultivated lineages have lost.",
      correct_answer: "disease-resistance",
      explanation_vi:
        "Đoạn 6: \"harbour disease-resistance genes that the cultivated lineage lost\".",
    },
  ],
};

const SLEEP_CIRCADIAN: IELTSReadingPassage = {
  id: "sleep-and-circadian-rhythms",
  title_en: "Sleep and Circadian Rhythms",
  title_vi: "Giấc ngủ và nhịp sinh học",
  topic_family: "life_science",
  band: 7.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc giải thích nhịp sinh học: đồng hồ sinh học nội sinh khoảng 24 giờ, vai trò của ánh sáng và melatonin, hệ quả của làm việc theo ca và lệch múi giờ, và những phát hiện gần đây về sự khác biệt cá nhân.",
  passage_en: `Almost every cell in the human body keeps time. The discovery, made over the past three decades and recognised by the 2017 Nobel Prize in Physiology or Medicine, is that biological rhythms are not imposed from outside by daylight alone but are generated by molecular oscillators inside cells. These oscillators run on roughly twenty-four-hour cycles even when isolated from any external cue, which is why they are called circadian — from the Latin "around a day". The brain coordinates the body-wide rhythm; light from the eyes resets the brain's clock to keep it aligned with the rotation of the Earth.

The master clock is a small cluster of about twenty thousand neurons in the hypothalamus called the suprachiasmatic nucleus, or SCN. The SCN receives direct input from a specialised set of cells in the retina that detect overall light levels rather than image content. These cells signal "daytime" to the SCN even when ordinary visual processing is impaired. From the SCN, timing signals propagate through hormones — chiefly melatonin from the pineal gland — and through neural pathways that coordinate clocks in peripheral tissues such as the liver, gut, and skin.

Sleep is the most visible expression of this system, but circadian rhythms govern much more. Body temperature falls in the late evening and rises before dawn. Cortisol, the principal stress hormone, peaks in the early morning. Liver enzymes that metabolise drugs vary in activity through the day, which is why the timing of medication can affect both effectiveness and side-effects. Even individual cells in cultured tissue continue to keep time for several days after being removed from a body, suggesting that nearly every cell carries its own clock genes.

The genetic mechanism is now well characterised. A small set of genes — including PER and CRY in mammals — produce proteins that accumulate during the day and inhibit their own production overnight. As the proteins degrade through the early morning, production resumes, and the cycle repeats. The full network involves more genes and feedback loops, but the basic logic is a self-regulating molecular oscillator. Mutations in some of these genes cause people to wake or sleep at unusually early or late hours, conditions formally classified as advanced or delayed sleep phase disorders.

Misalignment between the internal clock and external schedule has measurable health costs. Shift workers — about a fifth of the workforce in industrialised economies — show elevated rates of cardiovascular disease, type 2 diabetes, and certain cancers. Jet lag, the temporary version of the same problem, can take a week to resolve after a long-haul flight; the brain's clock shifts by about an hour a day, while peripheral clocks adjust at different rates. Until they realign, the body produces conflicting signals — for example, telling the gut to digest while the liver is still in night mode.

Light is the strongest external cue. Bright daylight in the morning advances the clock; bright light in the late evening delays it. Indoor lighting was once thought too dim to affect circadian rhythms, but research from the 2000s onward has shown that ordinary indoor light, particularly the blue-rich light of phones and screens, has measurable effects on melatonin secretion and sleep timing. The practical effect is that modern indoor environments tend to delay sleep onset relative to what bodies on a more sun-driven schedule would experience. Adolescents are particularly affected because their natural sleep timing is already late.

Recent research has begun to map individual variation. People differ in their natural sleep-wake timing — colloquially "morning larks" and "night owls" — along a spectrum that is partly genetic and partly age-related. The same person's preferred timing typically shifts later through adolescence, then earlier through adulthood and old age. Studies that match work and school schedules to chronotype have shown improvements in academic performance and reductions in workplace error rates, although large-scale implementation is rare.

Beyond sleep, circadian biology has been implicated in metabolism. Eating at unusual times — late at night, for example — produces metabolic responses different from eating the same food in the morning, even with the same total calories. Time-restricted feeding studies in animals and small human trials suggest that confining meals to a daytime window may improve glucose handling and weight regulation independent of total intake. The mechanism is thought to involve the alignment of peripheral clocks in liver and adipose tissue with central timing. The clinical evidence is preliminary, but the picture emerging is of a body in which timing is as biologically meaningful as content — when we sleep, eat, and move turns out to be inseparable from how well any of those processes work.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "Circadian rhythms persist in cells even when external cues are removed.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 1: \"run on roughly twenty-four-hour cycles even when isolated from any external cue\".",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "The SCN is located in the heart.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 2: SCN nằm ở vùng dưới đồi (hypothalamus) trong não.",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "Liver enzymes' activity stays constant throughout the day.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 3: enzyme gan thay đổi theo giờ trong ngày — \"vary in activity through the day\".",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "PER and CRY proteins inhibit their own production overnight.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 4: \"produce proteins that accumulate during the day and inhibit their own production overnight\".",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "Shift work has been shown to lower cardiovascular disease rates.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 5: ngược lại — tăng tỷ lệ bệnh tim mạch.",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "Indoor light is now known to affect circadian rhythms even at moderate levels.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 6: \"ordinary indoor light… has measurable effects on melatonin secretion and sleep timing\".",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "How does the SCN receive information about external light?",
      options: [
        "Through skin sensors.",
        "Through specialised retinal cells that detect overall light levels.",
        "Through the auditory nerve.",
        "Through the digestive tract.",
      ],
      correct_answer:
        "Through specialised retinal cells that detect overall light levels.",
      explanation_vi:
        "Đoạn 2: \"a specialised set of cells in the retina that detect overall light levels rather than image content\".",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "Why is jet lag slow to resolve?",
      options: [
        "The brain's clock and peripheral clocks adjust at different rates.",
        "Melatonin disappears completely after a long flight.",
        "The retina is damaged by air travel.",
        "The pineal gland stops working.",
      ],
      correct_answer:
        "The brain's clock and peripheral clocks adjust at different rates.",
      explanation_vi:
        "Đoạn 5: đồng hồ não và đồng hồ ngoại biên \"adjust at different rates\".",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What does the writer say about adolescents' sleep timing?",
      options: [
        "It is the same as adults' timing.",
        "It is naturally late and is further delayed by indoor lighting.",
        "It is naturally early and unaffected by light.",
        "It is unrelated to chronotype.",
      ],
      correct_answer:
        "It is naturally late and is further delayed by indoor lighting.",
      explanation_vi:
        "Đoạn 6: \"Adolescents are particularly affected because their natural sleep timing is already late\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What does early evidence suggest about time-restricted feeding?",
      options: [
        "It has no metabolic effect.",
        "It worsens glucose handling.",
        "It may improve glucose handling and weight regulation.",
        "It only works in animals, never in humans.",
      ],
      correct_answer:
        "It may improve glucose handling and weight regulation.",
      explanation_vi:
        "Đoạn cuối: \"may improve glucose handling and weight regulation\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "The principal stress hormone, ____, peaks in the early morning.",
      correct_answer: "cortisol",
      explanation_vi:
        "Đoạn 3: \"Cortisol, the principal stress hormone, peaks in the early morning\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "Mutations in clock genes can cause advanced or delayed sleep ____ disorders.",
      correct_answer: "phase",
      explanation_vi:
        "Đoạn 4: \"advanced or delayed sleep phase disorders\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "Timing signals from the SCN travel through neural pathways and through the hormone ____.",
      correct_answer: "melatonin",
      explanation_vi:
        "Đoạn 2: \"timing signals propagate through hormones — chiefly melatonin\".",
    },
  ],
};

const BRETTON_WOODS: IELTSReadingPassage = {
  id: "bretton-woods-monetary-system",
  title_en: "The Bretton Woods Monetary System",
  title_vi: "Hệ thống tiền tệ Bretton Woods",
  topic_family: "economics",
  band: 7.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc tóm lược hệ thống tiền tệ Bretton Woods (1944–1971): bối cảnh hậu chiến, thiết kế tỷ giá cố định + USD neo vàng, vai trò IMF và World Bank, lý do tan rã năm 1971, và di sản trong định chế tài chính toàn cầu hiện nay.",
  passage_en: `In July 1944, with the war in Europe entering its final year, delegates from forty-four Allied nations met at the Mount Washington Hotel in Bretton Woods, New Hampshire. Their task was to design a postwar international monetary system that would avoid the disasters of the interwar period — competitive devaluations, capital flight, and the protectionist responses that had deepened the Great Depression. The agreement they signed established the rules under which most of the world's economies would trade and invest for the next quarter-century.

The system rested on three pillars. First, exchange rates were fixed against the United States dollar, with each member country undertaking to keep its currency within one per cent of an agreed parity. Second, the dollar itself was convertible into gold at thirty-five US dollars per ounce, an obligation borne by the United States Treasury. Third, two new institutions — the International Monetary Fund (IMF) and the International Bank for Reconstruction and Development, which became the World Bank — were created to provide short-term balance-of-payments support and long-term development finance respectively.

The intellectual leadership came from two unlikely partners. John Maynard Keynes, representing the United Kingdom, argued for a supranational reserve currency, the bancor, that would not be tied to any single country's economy. Harry Dexter White, representing the United States, advocated the dollar-centred system that was eventually adopted. The American position prevailed because the United States held about two-thirds of the world's gold reserves at the time and the world's largest creditor position. The negotiations were less between equals than between the lender of last resort and a continent of debtors.

For the first two postwar decades, the system worked well by most measures. Inflation in member countries averaged around three per cent. Trade grew faster than at any time since the late nineteenth century, and Western European economies completed their reconstruction. The dollar functioned as the unit of account in international trade and finance; central banks held a growing share of their reserves in dollars rather than gold, on the understanding that dollars were as good as gold and easier to use. The IMF developed its template of conditional lending, providing emergency credit to countries running balance-of-payments deficits in exchange for policy adjustments.

Strain emerged in the 1960s. The United States ran persistent balance-of-payments deficits, partly because of overseas military commitments and partly because foreign central banks were accumulating dollars at the same rate as American spending abroad. By the late 1960s, foreign-held dollars exceeded the United States' gold reserves, sometimes by a substantial multiple. The system depended on the implicit promise that the United States could redeem all outstanding dollars for gold at the official rate; this promise was no longer credible.

The end came on 15 August 1971. President Richard Nixon, in a televised address, suspended the dollar's convertibility into gold. The announcement was framed as temporary and necessary, but it was effectively the end of fixed exchange rates. After two years of attempted realignments, the major currencies began to float against the dollar in 1973, and the floating regime has continued, with various modifications, ever since. The IMF and the World Bank survived the collapse of the rules they had been built to administer, and they remain among the most consequential international institutions of the modern era.

The legacy is contested. Bretton Woods coincided with what historians sometimes call the Trente Glorieuses, the thirty years of unprecedented growth in industrialised economies, but disentangling the contribution of the monetary system from postwar reconstruction, technological diffusion, and demographic factors is difficult. Critics from both ends of the political spectrum have argued that the dollar's central role gave the United States an "exorbitant privilege" — the ability to fund deficits indefinitely by issuing the world's reserve currency — and that the system's collapse merely formalised a privilege that has continued under floating rates.

Subsequent attempts to redesign the international monetary order — the Plaza and Louvre Accords of the 1980s, the European Monetary System and its successor the euro, recent proposals for special drawing rights to play a larger reserve role — have all responded to problems that Bretton Woods raised but did not solve. The original system was a product of a specific historical moment: an Anglo-American negotiation conducted in a hotel in New Hampshire while the war continued. Its collapse in 1971 ended the rules but not the questions it had been designed to answer, and contemporary debates about exchange rates, capital controls, and reserve currency status are still recognisably the questions of Bretton Woods.`,
  questions: [
    {
      number: 1,
      type: "true_false_not_given",
      question_text:
        "The Bretton Woods conference was held while World War II was still in progress.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 1: \"with the war in Europe entering its final year\" — vẫn đang chiến tranh.",
    },
    {
      number: 2,
      type: "true_false_not_given",
      question_text:
        "Member countries committed to keeping their currencies within five per cent of agreed parity.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 2: trong vòng 1% (\"within one per cent of an agreed parity\").",
    },
    {
      number: 3,
      type: "true_false_not_given",
      question_text:
        "Keynes's proposal for a supranational currency was adopted at Bretton Woods.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 3: lập trường Mỹ thắng, đồng dollar được chọn — đề xuất bancor của Keynes không thông qua.",
    },
    {
      number: 4,
      type: "true_false_not_given",
      question_text:
        "The United States held about two-thirds of the world's gold reserves in 1944.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 3: \"the United States held about two-thirds of the world's gold reserves\".",
    },
    {
      number: 5,
      type: "true_false_not_given",
      question_text:
        "Inflation in member countries averaged around ten per cent during the system's first two decades.",
      correct_answer: "FALSE",
      explanation_vi:
        "Đoạn 4: trung bình \"around three per cent\".",
    },
    {
      number: 6,
      type: "true_false_not_given",
      question_text:
        "By the late 1960s, foreign-held dollars exceeded the United States' gold reserves.",
      correct_answer: "TRUE",
      explanation_vi:
        "Đoạn 5: \"foreign-held dollars exceeded the United States' gold reserves, sometimes by a substantial multiple\".",
    },

    {
      number: 7,
      type: "multiple_choice",
      question_text:
        "What was the role of the IMF in the original system?",
      options: [
        "Issuing the world's reserve currency.",
        "Providing short-term balance-of-payments support.",
        "Setting global interest rates.",
        "Managing the gold standard directly.",
      ],
      correct_answer:
        "Providing short-term balance-of-payments support.",
      explanation_vi:
        "Đoạn 2: IMF \"provide short-term balance-of-payments support\".",
    },
    {
      number: 8,
      type: "multiple_choice",
      question_text:
        "Why did the system's promise of dollar-to-gold convertibility become non-credible?",
      options: [
        "Gold was discovered in larger quantities elsewhere.",
        "Foreign-held dollars exceeded US gold reserves.",
        "The IMF refused to lend.",
        "The Soviet Union joined the system.",
      ],
      correct_answer:
        "Foreign-held dollars exceeded US gold reserves.",
      explanation_vi:
        "Đoạn 5: lý do trực tiếp lời hứa không còn đáng tin.",
    },
    {
      number: 9,
      type: "multiple_choice",
      question_text:
        "What did the writer say about the post-1971 floating regime?",
      options: [
        "It collapsed within two years.",
        "It was rapidly replaced by another fixed-rate system.",
        "It has continued, with various modifications, ever since.",
        "It only applied to the dollar.",
      ],
      correct_answer:
        "It has continued, with various modifications, ever since.",
      explanation_vi:
        "Đoạn 6: \"the floating regime has continued, with various modifications, ever since\".",
    },
    {
      number: 10,
      type: "multiple_choice",
      question_text:
        "What does the writer suggest about contemporary monetary debates?",
      options: [
        "They are entirely new questions.",
        "They were settled in 1971.",
        "They are still recognisably the questions of Bretton Woods.",
        "They no longer concern reserve currency status.",
      ],
      correct_answer:
        "They are still recognisably the questions of Bretton Woods.",
      explanation_vi:
        "Đoạn cuối: \"contemporary debates… are still recognisably the questions of Bretton Woods\".",
    },

    {
      number: 11,
      type: "sentence_completion",
      question_text:
        "Under the system, the dollar was convertible into gold at thirty-five US dollars per ____.",
      correct_answer: "ounce",
      explanation_vi:
        "Đoạn 2: \"thirty-five US dollars per ounce\".",
    },
    {
      number: 12,
      type: "sentence_completion",
      question_text:
        "Critics argue the dollar's role gave the United States an \"____ privilege\".",
      correct_answer: "exorbitant",
      explanation_vi:
        "Đoạn 7: \"exorbitant privilege\".",
    },
    {
      number: 13,
      type: "sentence_completion",
      question_text:
        "The Bretton Woods system collapsed on 15 August ____.",
      correct_answer: "1971",
      explanation_vi:
        "Đoạn 6: \"15 August 1971\".",
    },
  ],
};

// ── Registry ──────────────────────────────────────────────────────────-

export const IELTS_READING_PASSAGES: ReadonlyArray<IELTSReadingPassage> = [
  SILK_ROAD,
  PLATE_TECTONICS,
  INDUSTRIAL_COAL,
  URBAN_HEAT,
  PENICILLIN,
  COMPARATIVE_ADVANTAGE,
  PHOTOSYNTHESIS,
  PRINTING_PRESS,
  MONSOON,
  COFFEE_ORIGINS,
  SLEEP_CIRCADIAN,
  BRETTON_WOODS,
];

export const IELTS_READING_PASSAGE_BY_ID: Readonly<
  Record<string, IELTSReadingPassage>
> = Object.freeze(
  Object.fromEntries(IELTS_READING_PASSAGES.map((p) => [p.id, p])),
);

export const ALL_IELTS_READING_IDS: ReadonlyArray<string> =
  IELTS_READING_PASSAGES.map((p) => p.id);

export function listIeltsReadingPassages(): IELTSReadingPassage[] {
  return [...IELTS_READING_PASSAGES];
}

export function getIeltsReadingPassageById(
  id: string,
): IELTSReadingPassage | null {
  return IELTS_READING_PASSAGE_BY_ID[id] ?? null;
}

export function listIeltsReadingByBand(
  band: IELTSReadingBand,
): IELTSReadingPassage[] {
  return IELTS_READING_PASSAGES.filter((p) => p.band === band);
}

export function listIeltsReadingByTopic(
  topic: IELTSReadingTopicFamily,
): IELTSReadingPassage[] {
  return IELTS_READING_PASSAGES.filter((p) => p.topic_family === topic);
}

/** Word count of a passage's English text, ignoring punctuation. Used
 *  by the test suite to enforce the IELTS-spec length window. */
export function wordCount(passage: IELTSReadingPassage): number {
  return passage.passage_en
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}


