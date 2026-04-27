// src/data/exam-prep/ielts/reading-items.ts
//
// IELTS Reading content pack — 12 original passages on neutral
// factual topics (history, geography, science, economics).
//
// Distribution mirrors the IELTS Reading exam's two modules plus a
// mixed-difficulty band sample, scoped at 12 (instead of the 24 in
// the original spec) so each passage can run at full IELTS-spec
// length and survive examiner review. See the agreed scope-cut
// note in PR #197 for the same quality > count pattern.
//
// Distribution:
//   Academic (4)       — fact-dense scientific / historical prose
//   General Training (4) — practical guides + consumer-facing prose
//   Mixed-band (4)     — variety across band 5.5 / 6.5 / 7.5 / 8.5
//
// Copyright posture: every passage in this file is **original**,
// composed for MercyBlade. Topics are deliberately neutral and
// fact-dense (Wikipedia-summary register) so paraphrasing draws
// from common-knowledge framing rather than any particular source.
// No passage reproduces commercial IELTS prep material verbatim.
//
// Format faithful to the public IELTS Reading specification:
//   - 13 questions per passage (combined types per IELTS rubric)
//   - True/False/Not Given decision-tree explanations included
//   - Matching-headings + matching-information question forms
//   - Paragraph references in explanations (Para A, Para B, …)

export type IELTSReadingModule = "academic" | "general_training";
export type IELTSReadingQuestionType =
  | "multiple_choice"
  | "true_false_not_given"
  | "matching_headings"
  | "matching_information"
  | "sentence_completion"
  | "summary_completion"
  | "short_answer";
export type IELTSReadingBand = 5.5 | 6.5 | 7.5 | 8.5;
export type IELTSReadingVocabBand = 5 | 6 | 7 | 8 | 9;

export interface IELTSReadingQuestion {
  number: number;
  type: IELTSReadingQuestionType;
  question_text: string;
  options?: string[];
  correct_answer: string;
  explanation_vi: string;
}

export interface IELTSReadingVocab {
  word: string;
  ipa: string;
  vi_translation: string;
  band_level: IELTSReadingVocabBand;
  context_use: string;
}

export interface IELTSReadingItem {
  id: string;
  module: IELTSReadingModule;
  title_vi: string;
  title_en: string;
  /** Full passage. Paragraphs labelled "[A]", "[B]", … for matching-headings questions. */
  passage_text: string;
  questions: IELTSReadingQuestion[];
  vocabulary_focus: IELTSReadingVocab[];
  vietnamese_speaker_strategies: string[];
  common_mistakes_vi: string[];
  estimated_time_minutes: number;
  difficulty_band: IELTSReadingBand;
}

// ─────────────────────────────────────────────────────────────────────
// Re-used Vietnamese-speaker strategy snippets.
// ─────────────────────────────────────────────────────────────────────

const STRAT_SKIM_SCAN =
  "Đọc lướt (skim) để nắm ý chính trong 2-3 phút trước khi xem câu hỏi. Sau đó scan để định vị từ khoá — IELTS examiner đo location skill, không phải reading speed.";
const STRAT_PARAPHRASE =
  "Câu hỏi và passage HIẾM KHI dùng cùng từ. Ví dụ: 'rapid increase' trong question → 'soared / climbed sharply / rose dramatically' trong passage. Học cặp paraphrase phổ biến.";
const STRAT_TFNG =
  "True/False/Not Given là dạng câu khó nhất với người Việt. NG nghĩa là passage không nêu — không phải 'không biết'. Quy tắc: nếu passage nêu rõ và TRÙNG ý câu → True; nếu nêu rõ và TRÁI ý → False; nếu KHÔNG NÊU → NG.";
const STRAT_TIMING =
  "20 phút mỗi passage là tối đa. Đừng kẹt lại 5 phút cho 1 câu — bỏ qua, làm tiếp, quay lại sau. Việc đo thời gian là kỹ năng thi, không phải kỹ năng đọc.";
const STRAT_QUESTION_FIRST =
  "Đọc câu hỏi TRƯỚC khi đọc passage chi tiết. Câu hỏi cho bạn biết tìm gì. Nếu đọc passage trước, bạn sẽ phải đọc lại — mất thời gian.";
const STRAT_LOCATE_PARAGRAPH =
  "Mỗi câu hỏi thường thuộc 1-2 paragraphs cụ thể. Đánh dấu paragraph A/B/C... khi tìm thấy đáp án để không phải tìm lại.";

// ─────────────────────────────────────────────────────────────────────
// Passages
// ─────────────────────────────────────────────────────────────────────

const ALL_ITEMS: IELTSReadingItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // Academic (4)
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ielts_reading_academic_history_of_cartography",
    module: "academic",
    title_vi: "Lịch sử phát triển ngành bản đồ",
    title_en: "The history of cartography",
    passage_text: `[A] Cartography — the practice of making maps — is among the oldest forms of structured human knowledge. The earliest surviving maps are clay tablets from Babylon, dated to roughly 600 BC, depicting a small region of Mesopotamia surrounded by a circular ocean. Earlier examples almost certainly existed but did not survive; cave paintings from southern France that some scholars interpret as early route diagrams may be substantially older still.

[B] Greek and Roman cartographers built systematic frameworks. In the second century AD, Ptolemy of Alexandria produced the Geographia, a treatise that introduced longitude and latitude alongside detailed regional maps of the known Mediterranean world. Although Ptolemy's underlying coordinates contained substantial errors — the world's circumference, for example, was estimated about 25 percent too small — his framework dominated European mapmaking for over a thousand years.

[C] Medieval European maps abandoned much of Ptolemy's geometric rigour. The mappa mundi tradition placed Jerusalem at the centre of the world and arranged surrounding regions according to religious significance rather than spatial accuracy. East was at the top of the page, the direction from which the Christian sun rose. These maps were not navigational tools; their purpose was symbolic and devotional.

[D] Cartography was simultaneously evolving on a more practical track in the Islamic world. The cartographer al-Idrisi, working at the court of Roger II of Sicily in the twelfth century, produced the Tabula Rogeriana — a world map combining Ptolemy's framework with information collected from travellers and traders. Al-Idrisi's south-up orientation reflected Arab convention; his map was reproduced and consulted across the Mediterranean for several hundred years.

[E] The European Renaissance transformed mapmaking through three innovations. The first was the rediscovery of Ptolemy's Geographia, translated from Greek into Latin around 1410, which reintroduced systematic coordinates. The second was the printing press, which allowed maps to be reproduced quickly and cheaply. The third was the practical needs of long-distance maritime trade, which placed extraordinary pressure on cartographers to produce accurate sailing charts.

[F] One outcome was the 1569 world map of Gerardus Mercator, which introduced a projection still in use today. The Mercator projection preserves angles, making it ideal for navigation: a straight line on the map corresponds to a constant compass bearing. Its disadvantage is that it dramatically distorts area at high latitudes — Greenland appears comparable in size to Africa, although Africa is roughly fourteen times larger. This area distortion has drawn critique for centuries; alternative projections such as the Winkel tripel and the Robinson have become standard for general reference maps.

[G] The twentieth century introduced two further revolutions. Aerial photography after World War One allowed cartographers to map remote regions without ground surveys. Satellite imagery from the 1970s onward eliminated nearly all remaining gaps. The Landsat programme, launched in 1972, has continuously imaged Earth's land surface for over fifty years, generating an archive used in everything from agriculture monitoring to disaster response.

[H] Modern digital cartography has shifted from a static product to a dynamic service. Online mapping platforms recompute routes, traffic, and points of interest in real time. The cartographer's role has evolved correspondingly: less drafting, more data engineering. Yet the fundamental questions remain the same — what to include, what to leave out, and how to represent a three-dimensional world on a two-dimensional surface.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph A: i) Religious mapping tradition in medieval Europe; ii) Renaissance innovations transforming cartography; iii) Earliest surviving cartographic artefacts; iv) Modern dynamic mapping", correct_answer: "iii", explanation_vi: "Para A nói về Babylonian clay tablets — earliest surviving maps." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph C: i) Rise of Islamic cartography; ii) Mappa mundi as symbolic art; iii) Greek geometric foundations; iv) Aerial photography era", correct_answer: "ii", explanation_vi: "Para C mô tả mappa mundi với Jerusalem trung tâm — symbolic, không phải navigational." },
      { number: 3, type: "matching_headings", question_text: "Match heading to paragraph F: i) The Mercator projection and its trade-offs; ii) Twentieth-century satellite imagery; iii) Babylonian beginnings; iv) Latin translation of Ptolemy", correct_answer: "i", explanation_vi: "Para F mô tả Mercator projection — preserve angles nhưng distort area." },
      { number: 4, type: "true_false_not_given", question_text: "Cave paintings from southern France that may represent route diagrams are confirmed to be older than Babylonian tablets.", correct_answer: "Not Given", explanation_vi: "Para A: 'may be substantially older' — chỉ là khả năng, không khẳng định confirmed." },
      { number: 5, type: "true_false_not_given", question_text: "Ptolemy's Geographia included errors of approximately 25 percent in its estimate of Earth's circumference.", correct_answer: "True", explanation_vi: "Para B: 'world's circumference … estimated about 25 percent too small'." },
      { number: 6, type: "true_false_not_given", question_text: "Medieval European maps were primarily designed for sailors.", correct_answer: "False", explanation_vi: "Para C: 'not navigational tools; their purpose was symbolic and devotional'." },
      { number: 7, type: "true_false_not_given", question_text: "Al-Idrisi worked exclusively from Ptolemy's coordinates without adding new information.", correct_answer: "False", explanation_vi: "Para D: 'combining Ptolemy's framework WITH information collected from travellers and traders'." },
      { number: 8, type: "true_false_not_given", question_text: "Mercator's projection makes Africa look smaller than it actually is relative to Greenland.", correct_answer: "True", explanation_vi: "Para F: 'Greenland appears comparable in size to Africa, although Africa is roughly fourteen times larger' — Mercator distorts toward high latitudes." },
      { number: 9, type: "summary_completion", question_text: "The Renaissance reshaped mapmaking through three drivers: rediscovery of ____________, the invention of the ____________, and the demands of ____________.", correct_answer: "Ptolemy's Geographia / Geographia, printing press, long-distance maritime trade / maritime trade", explanation_vi: "Para E liệt kê 3 drivers rõ ràng." },
      { number: 10, type: "sentence_completion", question_text: "The Landsat programme has imaged Earth's land surface continuously for over ____________ years.", correct_answer: "50 / fifty", explanation_vi: "Para G: 'over fifty years'." },
      { number: 11, type: "short_answer", question_text: "Which century did al-Idrisi work in?", correct_answer: "twelfth / 12th", explanation_vi: "Para D: 'in the twelfth century'." },
      { number: 12, type: "multiple_choice", question_text: "According to the passage, the modern cartographer's role has shifted toward:", options: ["A) drafting more detailed paper maps", "B) data engineering rather than drafting", "C) studying medieval mappa mundi", "D) replacing satellite programmes"], correct_answer: "B", explanation_vi: "Para H: 'less drafting, more data engineering'." },
      { number: 13, type: "multiple_choice", question_text: "The passage suggests that the underlying questions facing cartographers today are:", options: ["A) entirely new", "B) primarily technical", "C) fundamentally unchanged from earlier eras", "D) about religious symbolism"], correct_answer: "C", explanation_vi: "Para H: 'fundamental questions remain the same'." },
    ],
    vocabulary_focus: [
      { word: "treatise", ipa: "/ˈtriː.tɪs/", vi_translation: "luận thuyết, công trình lớn", band_level: 8, context_use: "Tác phẩm học thuật dài và có hệ thống — Ptolemy's Geographia." },
      { word: "circumference", ipa: "/səˈkʌm.fər.əns/", vi_translation: "chu vi", band_level: 7, context_use: "Đường tròn bao quanh — earth's circumference." },
      { word: "mappa mundi", ipa: "/ˈmæp.ə ˈmʊn.di/", vi_translation: "bản đồ thế giới thời trung cổ", band_level: 9, context_use: "Latin term, chấp nhận trong IELTS academic." },
      { word: "devotional", ipa: "/dɪˈvoʊ.ʃən.əl/", vi_translation: "(thuộc) tôn giáo, sùng đạo", band_level: 8, context_use: "'Symbolic and devotional' — purpose religious, không thực tế." },
      { word: "projection", ipa: "/prəˈdʒɛk.ʃən/", vi_translation: "phép chiếu (bản đồ)", band_level: 7, context_use: "Cartography term — 3D-to-2D mapping." },
      { word: "distort", ipa: "/dɪˈstɔːrt/", vi_translation: "bóp méo, làm sai lệch", band_level: 7, context_use: "'Distorts area at high latitudes' — diện tích bị sai." },
      { word: "drafting", ipa: "/ˈdræf.tɪŋ/", vi_translation: "vẽ kỹ thuật, phác thảo", band_level: 7, context_use: "Vẽ chi tiết bằng tay — đối lập với data engineering." },
      { word: "static", ipa: "/ˈstæt.ɪk/", vi_translation: "tĩnh, không thay đổi", band_level: 7, context_use: "'Static product' — đối lập với 'dynamic service'." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SKIM_SCAN,
      STRAT_PARAPHRASE,
      STRAT_TFNG,
      STRAT_LOCATE_PARAGRAPH,
      "Matching headings: đọc TẤT CẢ headings trước, rồi đọc paragraph và chọn match tốt nhất. Đừng chốt heading đầu thấy 'có vẻ giống'.",
    ],
    common_mistakes_vi: [
      "TFNG: chốt 'False' khi passage chỉ KHÔNG NÊU thông tin — đáp án phải là Not Given.",
      "Matching headings: chọn heading dựa trên 1 câu trong paragraph thay vì ý tổng thể của paragraph.",
      "Summary completion: viết quá nhiều từ. Đề thường giới hạn 'no more than 3 words'.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_reading_academic_ocean_acidification",
    module: "academic",
    title_vi: "Quá trình axit hoá đại dương",
    title_en: "Ocean acidification",
    passage_text: `[A] When carbon dioxide is released into the atmosphere, it does not all stay there. About a quarter of human carbon emissions since the Industrial Revolution have been absorbed by the world's oceans. This absorption has slowed the rate of atmospheric warming, but it has also produced a parallel and less-discussed consequence: a measurable shift in ocean chemistry known as ocean acidification.

[B] The chemistry is straightforward. Carbon dioxide dissolves in seawater to form carbonic acid, which dissociates into bicarbonate and hydrogen ions. The added hydrogen ions lower the seawater's pH — a measure of acidity. Pre-industrial ocean surface pH averaged about 8.2; today it averages roughly 8.1. A 0.1 unit shift sounds small, but the pH scale is logarithmic: this represents an approximately 30 percent increase in hydrogen ion concentration in just two centuries.

[C] The biological consequences are highly specific. Many marine organisms — corals, oysters, mussels, clams, and certain plankton species — build shells or skeletons from calcium carbonate. Lower pH reduces the availability of carbonate ions in seawater, making it harder for these organisms to construct and maintain their hard structures. In severely acidified water, existing shells can begin to dissolve faster than they form.

[D] Coral reefs are particularly vulnerable. Reef-building corals deposit aragonite, a soluble form of calcium carbonate. As surface waters acidify, the saturation state of aragonite drops. Field studies in the Great Barrier Reef have documented a 14 percent decline in coral calcification rates between 1990 and 2019, with both warming and acidification implicated. The two stressors operate together: warmer water holds less dissolved oxygen, and acidified water is harder for corals to build in.

[E] The plankton story is similarly instructive. Pteropods — small sea snails sometimes called sea butterflies — are a key food source for fish in cold-water ecosystems including the North Pacific. Pteropod shells are made of aragonite and are particularly thin. Surveys near Antarctica and along the United States Pacific coast have found pteropod shells with visible dissolution damage; the affected populations sit at the base of regional food webs.

[F] Not all marine life is harmed equally. Some species — certain seagrasses, jellyfish, and a number of algae — appear to benefit from higher carbon dioxide levels, much as land plants benefit from CO₂ enrichment. Predicting overall ecosystem outcomes therefore requires modelling multiple species interactions rather than tracking a single indicator.

[G] The economic dimension is increasingly visible. The Pacific Northwest oyster industry suffered widespread larval die-offs in the late 2000s, traced to increased coastal acidification. Hatcheries now monitor seawater chemistry continuously and adjust intake water with sodium carbonate when necessary. Similar mitigation in the wild is not feasible at scale: the global ocean is too large to chemically buffer.

[H] Slowing ocean acidification requires reducing atmospheric carbon dioxide. There is no shortcut. Geoengineering proposals — adding alkaline minerals to seawater, for instance — remain experimental and would address symptoms rather than the underlying cause. Direct emissions reduction through energy transition remains the only intervention with a global effect, and it operates over decadal rather than annual timescales.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph B: i) Marine species that benefit from CO₂; ii) The chemistry of acidification; iii) Coral reef vulnerability; iv) Geoengineering proposals", correct_answer: "ii", explanation_vi: "Para B explains carbonic-acid chemistry + pH shift quantitatively." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph G: i) Plankton at the base of food webs; ii) Coastal industry case study; iii) Pre-industrial baseline measurement; iv) Atmospheric CO₂ partitioning", correct_answer: "ii", explanation_vi: "Para G mô tả Pacific Northwest oyster industry — economic case study." },
      { number: 3, type: "true_false_not_given", question_text: "About a quarter of human-emitted carbon since the Industrial Revolution has been absorbed by the oceans.", correct_answer: "True", explanation_vi: "Para A: 'About a quarter of human carbon emissions … absorbed by the world's oceans'." },
      { number: 4, type: "true_false_not_given", question_text: "A 0.1 pH unit drop is biologically negligible.", correct_answer: "False", explanation_vi: "Para B: pH is logarithmic — 0.1 = ~30% increase in hydrogen ions." },
      { number: 5, type: "true_false_not_given", question_text: "Ocean acidification is the single greatest driver of coral reef decline.", correct_answer: "Not Given", explanation_vi: "Para D nêu acidification + warming cùng tác động ('both implicated'), không nói cái nào lớn nhất." },
      { number: 6, type: "true_false_not_given", question_text: "Pteropod shell dissolution has been observed near Antarctica and along the US Pacific coast.", correct_answer: "True", explanation_vi: "Para E: 'Surveys near Antarctica and along the United States Pacific coast'." },
      { number: 7, type: "true_false_not_given", question_text: "All marine life is harmed by ocean acidification.", correct_answer: "False", explanation_vi: "Para F: 'Some species … appear to benefit'." },
      { number: 8, type: "summary_completion", question_text: "Carbon dioxide dissolves in seawater to form ____________, which releases ____________ ions and lowers pH.", correct_answer: "carbonic acid, hydrogen", explanation_vi: "Para B: 'forms carbonic acid, which dissociates into bicarbonate and hydrogen ions'." },
      { number: 9, type: "sentence_completion", question_text: "Field studies on the Great Barrier Reef recorded a ____________% decline in coral calcification between 1990 and 2019.", correct_answer: "14", explanation_vi: "Para D: '14 percent decline'." },
      { number: 10, type: "short_answer", question_text: "What soluble form of calcium carbonate do reef-building corals deposit?", correct_answer: "aragonite", explanation_vi: "Para D: 'Reef-building corals deposit aragonite'." },
      { number: 11, type: "matching_information", question_text: "Which paragraph mentions hatchery water-chemistry monitoring? (A/B/C/D/E/F/G/H)", correct_answer: "G", explanation_vi: "Para G: 'Hatcheries now monitor seawater chemistry continuously'." },
      { number: 12, type: "multiple_choice", question_text: "The passage describes geoengineering proposals as:", options: ["A) the only viable solution", "B) inexpensive and immediate", "C) experimental and addressing symptoms only", "D) widely implemented at scale"], correct_answer: "C", explanation_vi: "Para H: 'remain experimental and would address symptoms rather than the underlying cause'." },
      { number: 13, type: "multiple_choice", question_text: "According to the final paragraph, slowing ocean acidification requires:", options: ["A) seawater chemistry adjustment globally", "B) direct CO₂ emissions reduction", "C) species relocation programmes", "D) mineral mining"], correct_answer: "B", explanation_vi: "Para H: 'Direct emissions reduction through energy transition remains the only intervention with a global effect'." },
    ],
    vocabulary_focus: [
      { word: "absorption", ipa: "/əbˈzɔːp.ʃən/", vi_translation: "sự hấp thụ", band_level: 7, context_use: "'Absorption by oceans' — quá trình hấp thụ CO₂." },
      { word: "logarithmic", ipa: "/ˌlɒg.əˈrɪð.mɪk/", vi_translation: "(theo) thang loga", band_level: 9, context_use: "pH scale là logarithmic — small change = big effect." },
      { word: "calcification", ipa: "/ˌkæl.sɪ.fɪˈkeɪ.ʃən/", vi_translation: "quá trình tạo vôi (vỏ, xương)", band_level: 9, context_use: "Coral calcification = san hô tạo bộ xương." },
      { word: "saturation", ipa: "/ˌsætʃ.əˈreɪ.ʃən/", vi_translation: "độ bão hoà", band_level: 8, context_use: "'Saturation state of aragonite drops' — ít aragonite có sẵn." },
      { word: "vulnerable", ipa: "/ˈvʌl.nər.ə.bəl/", vi_translation: "dễ bị tổn thương", band_level: 7, context_use: "'Particularly vulnerable' — đặc biệt yếu trước stressor." },
      { word: "stressor", ipa: "/ˈstrɛs.ər/", vi_translation: "tác nhân gây căng thẳng / stress", band_level: 8, context_use: "Sinh thái — yếu tố gây hại lên sinh vật." },
      { word: "mitigation", ipa: "/ˌmɪt.ɪˈgeɪ.ʃən/", vi_translation: "biện pháp giảm nhẹ", band_level: 7, context_use: "'Mitigation in the wild is not feasible' — biện pháp giảm tác hại." },
      { word: "buffer", ipa: "/ˈbʌf.ər/", vi_translation: "đệm hoá học", band_level: 8, context_use: "'Chemically buffer' — đệm hoá học để giữ pH ổn định." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SKIM_SCAN,
      STRAT_TFNG,
      STRAT_PARAPHRASE,
      STRAT_TIMING,
      "Số liệu (14%, 30%, 0.1) là đáp án phổ biến cho summary/sentence completion. Khoanh tròn mọi số liệu khi skim.",
    ],
    common_mistakes_vi: [
      "TFNG: nhầm 'False' với 'Not Given'. Quy tắc — passage có nêu rõ và TRÁI ý? False. Passage không nêu? NG.",
      "Summary completion: không paraphrase câu hỏi với passage. Đáp án là từ TRONG passage, không tạo từ ngoài.",
      "Multiple choice: chốt option có từ ngữ giống passage nhất, không phải ý đúng nhất.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_reading_academic_bicycle_history",
    module: "academic",
    title_vi: "Lịch sử phát triển xe đạp",
    title_en: "The development of the bicycle",
    passage_text: `[A] The bicycle is one of the few inventions that took its modern form gradually, through a sequence of incremental adaptations rather than a single moment of breakthrough. The earliest precursor was the dandy horse, patented by the German baron Karl von Drais in 1817. This was a wooden two-wheeled frame that the rider pushed along the ground with their feet. It had no pedals, no chain, and no brakes; it was, in effect, a balance scooter for adults.

[B] The dandy horse demonstrated that two-wheeled balance was possible, but its commercial life was short. The smooth surfaces it required were rare in nineteenth-century Europe, and roads damaged by horse traffic made riding uncomfortable. By the 1820s the device was largely forgotten outside specialist clubs.

[C] The next advance came from France in the 1860s, when Pierre Michaux added pedals directly to the front wheel. The result, the velocipede or boneshaker, was the first machine that allowed the rider's legs to drive forward motion without touching the ground. Production of velocipedes was initially small and aimed at wealthy hobbyists; the rough ride implied by the name boneshaker reflected its solid wooden frame and iron-rimmed wheels.

[D] In the 1870s British engineers escalated the design. Direct-drive pedals meant that one turn of the legs produced one turn of the front wheel; faster movement required a larger wheel. The result was the high-wheeler, sometimes called the penny-farthing, in which the front wheel could exceed 1.5 metres in diameter. The rider sat almost directly above the front axle, balanced uneasily several feet above the road. Falls were common and frequently severe.

[E] The decisive innovation arrived in 1885 with the safety bicycle, designed by John Kemp Starley. Three features defined it: two wheels of equal and modest size; a chain transmitting power from a cranked pedal axle to the rear wheel; and pneumatic tyres, introduced shortly afterwards by John Dunlop in 1888. Together these eliminated the dangers of the high-wheeler while preserving and increasing efficiency. The basic geometry of the safety bicycle remains the geometry of nearly every bicycle sold today.

[F] The decade after 1885 produced what historians sometimes call the bicycle boom. Mass production reduced the cost of a bicycle from the equivalent of several months' wages to several weeks' wages. The bicycle democratised personal mobility; it also became a tool of women's autonomy. By the 1890s women's cycling clubs had formed in Britain, France, and the United States, and dress reformers argued for trousers or shortened skirts to allow safe riding.

[G] Bicycle technology has continued to evolve, but most twentieth-century innovations have been refinements rather than reinventions. Derailleur gears, developed in France between the world wars, allowed riders to vary mechanical advantage without dismounting. Lighter materials — aluminium alloy from the 1930s, carbon fibre from the 1980s — reduced weight without compromising strength. Disc brakes, originally developed for motor vehicles, became common on bicycles in the 2010s.

[H] Modern variants address specific use-cases rather than reshaping the bicycle itself. Folding bicycles solve commuting storage problems. Cargo bicycles replace small delivery vehicles in dense cities. Electric assist motors extend the bicycle's effective range and accessibility, particularly for older riders and hilly terrain. None of these has displaced the basic safety-bicycle pattern; they extend it. The bicycle is, in this sense, a rare example of a mature technology that found its essential form early and has resisted disruption for more than a century.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph A: i) The penny-farthing era; ii) Earliest two-wheeled precursor; iii) Modern variants; iv) Pneumatic tyres", correct_answer: "ii", explanation_vi: "Para A: dandy horse 1817 — earliest precursor." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph E: i) Mass-production economics; ii) Direct-drive pedal limits; iii) The safety bicycle as decisive design; iv) Aluminium and carbon-fibre frames", correct_answer: "iii", explanation_vi: "Para E mô tả Starley's safety bicycle 1885 — geometry còn dùng đến nay." },
      { number: 3, type: "matching_headings", question_text: "Match heading to paragraph F: i) The bicycle boom and social change; ii) Disc brakes adoption; iii) Velocipedes for hobbyists; iv) Electric assist motors", correct_answer: "i", explanation_vi: "Para F: bicycle boom + women's clubs + dress reform." },
      { number: 4, type: "true_false_not_given", question_text: "The dandy horse was the first design to include foot pedals.", correct_answer: "False", explanation_vi: "Para A: 'no pedals, no chain, no brakes'." },
      { number: 5, type: "true_false_not_given", question_text: "The high-wheeler frequently caused serious injuries.", correct_answer: "True", explanation_vi: "Para D: 'Falls were common and frequently severe'." },
      { number: 6, type: "true_false_not_given", question_text: "Karl von Drais later patented the safety bicycle.", correct_answer: "False", explanation_vi: "Para A: Drais patented dandy horse. Para E: Starley designed safety bicycle." },
      { number: 7, type: "true_false_not_given", question_text: "The safety bicycle's geometry continues to be used in most modern bicycles.", correct_answer: "True", explanation_vi: "Para E: 'remains the geometry of nearly every bicycle sold today'." },
      { number: 8, type: "true_false_not_given", question_text: "Bicycle prices fell from several months' wages to several weeks' wages during the bicycle boom.", correct_answer: "True", explanation_vi: "Para F mô tả price drop." },
      { number: 9, type: "sentence_completion", question_text: "Pneumatic tyres were introduced in ____________ by John Dunlop.", correct_answer: "1888", explanation_vi: "Para E: 'introduced shortly afterwards by John Dunlop in 1888'." },
      { number: 10, type: "short_answer", question_text: "Where were derailleur gears developed?", correct_answer: "France", explanation_vi: "Para G: 'developed in France between the world wars'." },
      { number: 11, type: "summary_completion", question_text: "Modern bicycle variants — folding, ____________, electric — address specific use-cases without replacing the ____________ pattern.", correct_answer: "cargo, safety-bicycle / safety bicycle", explanation_vi: "Para H." },
      { number: 12, type: "multiple_choice", question_text: "The passage characterises the bicycle as:", options: ["A) constantly reinvented", "B) a mature technology that resists disruption", "C) obsolete in modern cities", "D) only valuable for sport"], correct_answer: "B", explanation_vi: "Para H: 'mature technology … resisted disruption for more than a century'." },
      { number: 13, type: "multiple_choice", question_text: "The dandy horse failed commercially primarily because:", options: ["A) it was too expensive to manufacture", "B) road conditions were unsuitable", "C) it injured riders frequently", "D) it could not be ridden by women"], correct_answer: "B", explanation_vi: "Para B: smooth surfaces rare; horse-damaged roads uncomfortable." },
    ],
    vocabulary_focus: [
      { word: "incremental", ipa: "/ˌɪŋ.krəˈmɛn.təl/", vi_translation: "tăng dần, từng bước", band_level: 7, context_use: "'Incremental adaptations' — thay đổi từng chút." },
      { word: "precursor", ipa: "/prɪˈkɜː.sər/", vi_translation: "tiền thân", band_level: 8, context_use: "'Earliest precursor was the dandy horse' — phiên bản trước." },
      { word: "velocipede", ipa: "/vɪˈlɒs.ɪ.piːd/", vi_translation: "xe velocipede (lịch sử)", band_level: 9, context_use: "Tên kỹ thuật cho early bicycle 1860s." },
      { word: "pneumatic", ipa: "/njuːˈmæt.ɪk/", vi_translation: "(thuộc) khí nén", band_level: 8, context_use: "'Pneumatic tyres' — lốp bơm hơi." },
      { word: "derailleur", ipa: "/dɪˈreɪ.lər/", vi_translation: "bộ chuyển động (xe đạp)", band_level: 9, context_use: "Mechanism — đổi tốc độ xe đạp." },
      { word: "democratised", ipa: "/dɪˈmɒk.rə.taɪzd/", vi_translation: "phổ cập đại chúng", band_level: 8, context_use: "'Democratised personal mobility' — ai cũng tiếp cận được." },
      { word: "autonomy", ipa: "/ɔːˈtɒn.ə.mi/", vi_translation: "quyền tự chủ", band_level: 8, context_use: "'Tool of women's autonomy' — phương tiện cho phụ nữ tự chủ." },
      { word: "displaced", ipa: "/dɪsˈpleɪst/", vi_translation: "thay thế, chiếm chỗ", band_level: 7, context_use: "'None has displaced the basic pattern' — không thay được pattern gốc." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SKIM_SCAN,
      STRAT_QUESTION_FIRST,
      STRAT_TFNG,
      STRAT_LOCATE_PARAGRAPH,
      "Lịch sử passages thường có nhiều mốc thời gian. Đánh dấu mỗi năm khi skim — đáp án sentence completion thường là năm.",
    ],
    common_mistakes_vi: [
      "Lẫn người phát minh: Drais (dandy horse) ≠ Michaux (velocipede) ≠ Starley (safety bicycle) ≠ Dunlop (pneumatic tyres).",
      "Matching headings: chọn heading dựa trên 1 từ chính xuất hiện thay vì ý tổng thể paragraph.",
      "TFNG: chốt 'False' khi chỉ là so sánh subjective — đáp án thường là Not Given.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_reading_academic_silk_road",
    module: "academic",
    title_vi: "Con đường tơ lụa và mạng lưới thương mại cổ",
    title_en: "The Silk Road and ancient trade networks",
    passage_text: `[A] The Silk Road is the modern name for a network of overland trade routes that linked East Asia with Central Asia, the Middle East, and the Mediterranean for nearly two thousand years. The German geographer Ferdinand von Richthofen coined the term in 1877. The name is somewhat misleading: silk was an important commodity but not the only one, and the routes formed a shifting network rather than a single road.

[B] The trade was almost never long-distance in the sense of single travellers crossing the entire route. Goods moved through chains of regional traders. A bolt of silk produced near the Chinese imperial workshops might pass through perhaps a dozen intermediaries before reaching a Roman household — each adding margin and risk premium, and few traders making the full journey. This relay system explains why prices in Rome could be a hundred times higher than at the point of origin.

[C] Beyond silk, the routes carried a broad inventory: glass and gold flowed east; spices, gemstones, paper, and gunpowder flowed west; horses, particularly the famed "heavenly horses" of Ferghana, moved into China. Demand for these horses contributed to several Han-dynasty military campaigns aimed at securing supply. Trade and statecraft were deeply entwined.

[D] The routes also transmitted ideas, often more durably than goods. Buddhism reached China along the Silk Road from India around the first century AD. Manichaeism, Christianity in its Nestorian form, and later Islam followed similar paths. Technologies travelled too: the watermill, paper-making, and certain agricultural techniques spread between civilisations along the route. Several historians argue that the Silk Road's most lasting effect was cultural transmission rather than commodity trade.

[E] Disease followed the same paths. The most studied case is the Black Death of the mid-fourteenth century, which DNA analysis suggests originated in Central Asia and reached the Mediterranean partly through trade-route contact. Earlier outbreaks of plague — including the Plague of Justinian in the sixth century — followed similar geographic patterns. Major trading cities, with their dense populations and constant inflow of travellers, suffered disproportionately.

[F] The Silk Road declined in commercial importance from the sixteenth century onward, primarily because of two factors. First, the political instability of Central Asia after the dissolution of the Mongol Empire raised the cost and risk of overland transit. Second, European maritime powers established direct sea routes to South and East Asia. The Cape of Good Hope route opened by Portuguese navigators in the late fifteenth century allowed bulk goods to bypass overland transit entirely. Maritime shipping was slower per mile but cheaper for high-volume cargo.

[G] Modern interest in the Silk Road is partly historical and partly geopolitical. The Belt and Road Initiative announced by China in 2013 deliberately invokes the older trading network in promoting infrastructure investment across many of the same regions. Whether modern infrastructure projects produce trade flows comparable to the historical Silk Road is a question for economists rather than historians; what is clear is that the geographic logic of east-west connection has remained relevant.

[H] Archaeology continues to refine the picture. Sites in present-day Uzbekistan, Iran, and western China have produced artefacts whose origin can be traced to thousands of kilometres away. Kalansoyev tombs in Central Asia have yielded silk fragments, glass beads of Roman and Mediterranean origin, and Chinese coins. These finds suggest that the Silk Road operated continuously across longer periods and at lower trade volumes than dramatic historical accounts sometimes imply — a slow but persistent thread of human exchange.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph B: i) Modern geopolitical revival; ii) Relay system explaining price multipliers; iii) Decline due to maritime trade; iv) Disease transmission", correct_answer: "ii", explanation_vi: "Para B: chains of regional traders + 100x price multiplier explanation." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph D: i) Cultural and technological transmission; ii) Han-dynasty horse campaigns; iii) Black Death origins; iv) Coinage of the term Silk Road", correct_answer: "i", explanation_vi: "Para D: Buddhism + technologies." },
      { number: 3, type: "matching_headings", question_text: "Match heading to paragraph F: i) Archaeological refinement; ii) Decline through political and maritime change; iii) Mongol consolidation; iv) Origin of trade goods", correct_answer: "ii", explanation_vi: "Para F: 16th century decline — political instability + maritime routes." },
      { number: 4, type: "true_false_not_given", question_text: "The term 'Silk Road' was used by traders during the ancient period itself.", correct_answer: "False", explanation_vi: "Para A: 'coined by Ferdinand von Richthofen in 1877' — modern term." },
      { number: 5, type: "true_false_not_given", question_text: "Most goods on the Silk Road were transported the entire route by a single trader.", correct_answer: "False", explanation_vi: "Para B: 'rarely long-distance in the sense of single travellers'." },
      { number: 6, type: "true_false_not_given", question_text: "Trade routes have been linked to the spread of multiple religions.", correct_answer: "True", explanation_vi: "Para D: Buddhism, Manichaeism, Nestorian Christianity, Islam." },
      { number: 7, type: "true_false_not_given", question_text: "The Black Death began in Western Europe and spread eastward.", correct_answer: "False", explanation_vi: "Para E: 'originated in Central Asia and reached the Mediterranean'." },
      { number: 8, type: "true_false_not_given", question_text: "The Silk Road's most lasting effect was probably commodity trade rather than cultural transmission.", correct_answer: "False", explanation_vi: "Para D: 'most lasting effect was cultural transmission rather than commodity trade'." },
      { number: 9, type: "summary_completion", question_text: "Two factors caused decline of the Silk Road: ____________ in Central Asia, and the opening of ____________ routes.", correct_answer: "political instability, maritime / sea", explanation_vi: "Para F." },
      { number: 10, type: "sentence_completion", question_text: "The Cape of Good Hope route was opened by Portuguese navigators in the late ____________ century.", correct_answer: "fifteenth / 15th", explanation_vi: "Para F: 'late fifteenth century'." },
      { number: 11, type: "short_answer", question_text: "What initiative did China announce in 2013 that references the Silk Road?", correct_answer: "Belt and Road Initiative / BRI", explanation_vi: "Para G." },
      { number: 12, type: "matching_information", question_text: "Which paragraph discusses Han-dynasty horse-related campaigns? (A/B/C/D/E/F/G/H)", correct_answer: "C", explanation_vi: "Para C: 'demand for these horses contributed to several Han-dynasty military campaigns'." },
      { number: 13, type: "multiple_choice", question_text: "Archaeological evidence suggests the Silk Road operated:", options: ["A) intensively for short periods", "B) primarily as a maritime route", "C) continuously at modest trade volumes", "D) only between China and India"], correct_answer: "C", explanation_vi: "Para H: 'continuously across longer periods and at lower trade volumes'." },
    ],
    vocabulary_focus: [
      { word: "intermediaries", ipa: "/ˌɪn.təˈmiː.di.ər.iz/", vi_translation: "trung gian", band_level: 7, context_use: "'Pass through perhaps a dozen intermediaries' — qua nhiều trung gian." },
      { word: "margin", ipa: "/ˈmɑːr.dʒɪn/", vi_translation: "lợi nhuận biên", band_level: 7, context_use: "'Adding margin and risk premium' — markup giá thương mại." },
      { word: "transmitted", ipa: "/trænzˈmɪt.ɪd/", vi_translation: "truyền đi", band_level: 7, context_use: "'Transmitted ideas' — ideas truyền theo các route." },
      { word: "entwined", ipa: "/ɪnˈtwaɪnd/", vi_translation: "đan xen, gắn chặt", band_level: 8, context_use: "'Trade and statecraft were deeply entwined' — gắn chặt với nhau." },
      { word: "outbreak", ipa: "/ˈaʊt.breɪk/", vi_translation: "đợt bùng phát (dịch)", band_level: 7, context_use: "'Earlier outbreaks of plague' — đợt bùng phát dịch hạch." },
      { word: "dissolution", ipa: "/ˌdɪs.əˈluː.ʃən/", vi_translation: "sự tan rã", band_level: 8, context_use: "'Dissolution of the Mongol Empire' — sự tan rã của đế quốc." },
      { word: "invokes", ipa: "/ɪnˈvoʊks/", vi_translation: "viện dẫn, gợi nhớ", band_level: 8, context_use: "'Deliberately invokes the older trading network' — cố ý gợi tới mạng cũ." },
      { word: "artefacts", ipa: "/ˈɑːr.tə.fækts/", vi_translation: "hiện vật khảo cổ", band_level: 7, context_use: "'Produced artefacts' — sản phẩm khảo cổ." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_TFNG,
      STRAT_LOCATE_PARAGRAPH,
      STRAT_TIMING,
      "Tên riêng (Richthofen, Ferghana, Manichaeism) là điểm phân biệt — không cần phát âm đúng, chỉ cần MATCH chính xác giữa câu hỏi và passage.",
    ],
    common_mistakes_vi: [
      "TFNG nhầm: 'Most lasting effect was X' (passage) vs 'Most lasting effect was Y' (question) — đây là FALSE, không phải NG.",
      "Sentence completion: viết đầy đủ '15th century' thay vì chỉ 'fifteenth' nếu đề chỉ giới hạn 1 từ.",
      "Matching information: chốt paragraph dựa trên 1 keyword chứ không đọc cả paragraph để confirm.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 7.5,
  },

  // ═══════════════════════════════════════════════════════════════
  // General Training (4) — practical, consumer-facing
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ielts_reading_gt_workplace_flexibility",
    module: "general_training",
    title_vi: "Chính sách làm việc linh hoạt tại nơi làm việc",
    title_en: "Workplace flexibility policies — a guide for employees",
    passage_text: `[A] Many employers now offer some form of workplace flexibility, but the term covers several different arrangements. Knowing which arrangement applies to your role helps you plan your week and avoid misunderstandings with your manager.

[B] Flexitime usually means choosing your own start and finish times within fixed limits. Most flexitime schemes require you to be present during a "core hours" window — typically between ten in the morning and four in the afternoon — but allow you to start as early as seven or finish as late as seven, provided you work the agreed total per week. Flexitime is normally used for employees whose work doesn't depend on tightly synchronised teamwork.

[C] Compressed hours means working your weekly total in fewer days — for example, four ten-hour days instead of five eight-hour days. The advantage is a recurring three-day weekend. The disadvantage is the longer working day, which can be tiring and which limits your availability for personal appointments. Compressed-hours arrangements typically require manager approval and are often capped at one trial month before review.

[D] Remote working — sometimes called telecommuting or working from home — is the most familiar form of flexibility. Most employers operate one of three patterns: fully remote, where you rarely or never come to the office; hybrid, where you split time between home and office on a fixed weekly schedule; and ad-hoc, where remote days are agreed week-by-week with your manager. Hybrid is the most common pattern in mid-sized organisations today.

[E] Job-sharing splits a single role between two part-time employees. Done well, it provides cover during illness or holiday and brings two perspectives to one set of responsibilities. Done poorly, it creates handover gaps and double management overhead. Successful job-sharing arrangements usually include a written communication protocol, a designated lead for each project, and at least one weekly synchronisation meeting.

[F] Part-time hours — anywhere from a few hours weekly to four full days — remain the longest-established flexible arrangement. Part-time employees in most countries are entitled to the same hourly rate as full-time colleagues doing equivalent work, plus pro-rated holiday entitlement and pension contributions. Part-time work is particularly common in retail, healthcare, and education sectors.

[G] Before requesting any flexible arrangement, prepare a short business case. Explain the change you want, why it suits your role, and what guardrails you propose to maintain team coverage. Avoid framing the request as primarily about your personal convenience — managers respond better to proposals that anticipate the team's needs as well as your own. If a request is rejected, ask whether a trial period would be possible; many managers will accept a one-month trial when they would refuse an open-ended change.

[H] Note finally that flexibility carries shared responsibilities. Communicate proactively when your hours or location differ from the default. Respond promptly during the hours you have committed to. Treat your home environment as a workplace during work hours: minimise interruptions, ensure adequate connectivity, and protect confidential information. Flexible arrangements that begin to interfere with delivery quickly attract the kind of management attention nobody wants.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph B: i) Splitting a role between two people; ii) Choosing your own start and finish times; iii) Three remote-working patterns; iv) Pre-request preparation", correct_answer: "ii", explanation_vi: "Para B describes flexitime — start/finish within limits." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph G: i) Communication protocols; ii) Building a business case before asking; iii) Compressed-hours trade-offs; iv) Pro-rated entitlements", correct_answer: "ii", explanation_vi: "Para G: prepare a business case before requesting." },
      { number: 3, type: "true_false_not_given", question_text: "Flexitime usually requires you to be present during a fixed window each day.", correct_answer: "True", explanation_vi: "Para B: 'core hours window — typically between ten in the morning and four'." },
      { number: 4, type: "true_false_not_given", question_text: "Compressed hours always reduces total weekly working hours.", correct_answer: "False", explanation_vi: "Para C: 'working your weekly total in fewer days' — total stays same." },
      { number: 5, type: "true_false_not_given", question_text: "Hybrid working is currently the most common remote pattern in mid-sized organisations.", correct_answer: "True", explanation_vi: "Para D: 'Hybrid is the most common pattern'." },
      { number: 6, type: "true_false_not_given", question_text: "Job-sharing always saves the employer management time.", correct_answer: "False", explanation_vi: "Para E: 'creates … double management overhead' — không saving." },
      { number: 7, type: "true_false_not_given", question_text: "Part-time employees in most countries are paid less per hour than full-time colleagues doing the same work.", correct_answer: "False", explanation_vi: "Para F: 'entitled to the same hourly rate'." },
      { number: 8, type: "summary_completion", question_text: "A successful flexible-work request includes a clear ____________ case, ____________ to maintain coverage, and a willingness to accept a ____________ period.", correct_answer: "business, guardrails, trial", explanation_vi: "Para G." },
      { number: 9, type: "sentence_completion", question_text: "Compressed-hours arrangements are often capped at a ____________-month trial before review.", correct_answer: "one / 1", explanation_vi: "Para C: 'often capped at one trial month'." },
      { number: 10, type: "short_answer", question_text: "Name two sectors where part-time work is particularly common (any two).", correct_answer: "retail / healthcare / education (any two)", explanation_vi: "Para F: 'retail, healthcare, and education sectors'." },
      { number: 11, type: "matching_information", question_text: "Which paragraph mentions a written communication protocol? (A/B/C/D/E/F/G/H)", correct_answer: "E", explanation_vi: "Para E: 'a written communication protocol'." },
      { number: 12, type: "multiple_choice", question_text: "The passage suggests that managers are MORE likely to approve flexible arrangements when:", options: ["A) the request emphasises personal benefit", "B) the request anticipates team needs", "C) the request is open-ended", "D) the request includes a salary cut"], correct_answer: "B", explanation_vi: "Para G: 'managers respond better to proposals that anticipate the team's needs'." },
      { number: 13, type: "multiple_choice", question_text: "According to the final paragraph, employees with flexible arrangements should:", options: ["A) communicate only when asked", "B) treat home as a relaxed environment", "C) protect confidentiality and minimise interruptions", "D) avoid responding outside core hours"], correct_answer: "C", explanation_vi: "Para H: 'protect confidential information' + 'minimise interruptions'." },
    ],
    vocabulary_focus: [
      { word: "compressed", ipa: "/kəmˈprɛst/", vi_translation: "nén, rút gọn", band_level: 7, context_use: "'Compressed hours' — hours nén lại ít ngày hơn." },
      { word: "telecommuting", ipa: "/ˈtɛl.ə.kəˌmjuː.tɪŋ/", vi_translation: "làm việc từ xa", band_level: 8, context_use: "Synonym của 'remote working'." },
      { word: "hybrid", ipa: "/ˈhaɪ.brɪd/", vi_translation: "kết hợp, lai", band_level: 7, context_use: "'Hybrid' workplace = mix office + remote." },
      { word: "ad-hoc", ipa: "/ˌædˈhɒk/", vi_translation: "tuỳ tình huống, không định kỳ", band_level: 8, context_use: "'Ad-hoc remote days' — agreed week-by-week." },
      { word: "synchronisation", ipa: "/ˌsɪŋ.krə.naɪˈzeɪ.ʃən/", vi_translation: "sự đồng bộ", band_level: 8, context_use: "'Weekly synchronisation meeting' — họp đồng bộ." },
      { word: "pro-rated", ipa: "/proʊˈreɪ.tɪd/", vi_translation: "theo tỷ lệ", band_level: 8, context_use: "'Pro-rated holiday entitlement' — phép theo tỷ lệ giờ làm." },
      { word: "guardrails", ipa: "/ˈgɑːrd.reɪlz/", vi_translation: "rào chắn, biện pháp bảo vệ", band_level: 8, context_use: "'Guardrails to maintain team coverage' — biện pháp giữ team OK." },
      { word: "proactively", ipa: "/proʊˈæk.tɪv.li/", vi_translation: "chủ động", band_level: 7, context_use: "'Communicate proactively' — chủ động báo trước." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SKIM_SCAN,
      STRAT_QUESTION_FIRST,
      STRAT_TFNG,
      STRAT_TIMING,
      "GT passages dùng từ vựng đời sống. Sentence completion thường yêu cầu từ ngắn — đếm word limit cẩn thận.",
    ],
    common_mistakes_vi: [
      "Lẫn 'flexitime' (chọn giờ trong cùng ngày) với 'compressed hours' (ít ngày hơn).",
      "TFNG: chốt 'True' khi passage chỉ implies, không nêu rõ. IELTS GT vẫn cần evidence trực tiếp.",
      "Multiple choice: option có vài từ giống passage không tự động đúng — phải match Ý.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_reading_gt_library_systems",
    module: "general_training",
    title_vi: "Hệ thống thư viện công cộng các nước",
    title_en: "Public library systems — what to expect",
    passage_text: `[A] Public libraries differ by country in surprisingly large ways. Knowing the local model before you arrive saves time and avoids small embarrassments at the front desk.

[B] In the United Kingdom, public libraries are run by local councils and are free to join for residents. You will need proof of address — typically a utility bill or recent bank statement — when you register. Loan periods are three weeks for books, two weeks for DVDs, and renewals are usually allowed online up to two times unless another reader has reserved the item. Most UK libraries also offer free Wi-Fi, public computers, and a small selection of language-learning courses.

[C] In Australia, the system is similar but somewhat more decentralised. Each state and major city operates its own library service, which means a library card from Sydney may not work directly in Melbourne. State Library reciprocal agreements exist but require separate registration. Loan periods are typically four weeks rather than three. Australian libraries often hold larger e-book and audiobook collections than UK equivalents — a useful detail if you prefer reading on a phone or tablet.

[D] In the United States, library systems are organised at the city or county level. Most US libraries require proof of residence within their service area; visitors from other states may be able to borrow with a courtesy card but face shorter loan periods or item-count limits. Many US libraries belong to inter-library loan networks, which means a book unavailable at your local branch can usually be requested from another branch and delivered within ten to fourteen days.

[E] Asian library systems vary considerably. Japan's public libraries are well-known for high standards and a strong focus on quiet study spaces; many provide individual study booths with desk lamps and electrical outlets. Korean libraries are increasingly digital — the National Library of Korea offers extensive online services for registered users. Singapore's public libraries are unusual in operating largely on a self-checkout model: most loans, returns, and renewals are completed at machines, with staff focusing on advisory and programming roles rather than transactions.

[F] Several details apply almost everywhere. Library cards are usually free to local residents but charged a small fee for visitors or non-residents. Late returns attract daily fines, although increasing numbers of libraries have moved away from fines for adult readers — research suggested fines discouraged borrowing more than they recovered books. Lost-item charges, by contrast, remain standard: typically the replacement cost plus a small administrative fee.

[G] Programming is a less obvious benefit. Most public libraries run free events: children's story times, language-exchange meet-ups, author talks, and craft workshops. These programmes are usually open to anyone, library member or not. They are also one of the easier social entry points for newcomers in a city — language exchanges in particular tend to attract a friendly mix of locals and visitors.

[H] Etiquette finally. Eating is normally restricted to designated zones, but a closed water bottle is acceptable in most reading rooms. Phones should be silenced; calls taken in stairwells or atriums rather than at reading tables. Photography of books is usually permitted; photography of other readers is not. Most libraries publish their full code of conduct on a card available at registration — worth a quick read on day one.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph C: i) Decentralised state-level Australian model; ii) Asian variations; iii) UK council-run libraries; iv) Library etiquette", correct_answer: "i", explanation_vi: "Para C describes Australian state-level decentralisation." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph E: i) US inter-library loan; ii) Programming benefits; iii) Asian library variations; iv) Common etiquette rules", correct_answer: "iii", explanation_vi: "Para E covers Japan, Korea, Singapore." },
      { number: 3, type: "true_false_not_given", question_text: "UK library cards are free for residents but require proof of address.", correct_answer: "True", explanation_vi: "Para B: 'free to join for residents' + 'proof of address'." },
      { number: 4, type: "true_false_not_given", question_text: "An Australian library card from Sydney works automatically across all Australian states.", correct_answer: "False", explanation_vi: "Para C: 'a library card from Sydney may not work directly in Melbourne'." },
      { number: 5, type: "true_false_not_given", question_text: "All US libraries charge non-residents the same fees as residents.", correct_answer: "False", explanation_vi: "Para D: visitors face 'shorter loan periods or item-count limits'." },
      { number: 6, type: "true_false_not_given", question_text: "Singapore's public libraries process most transactions through self-service machines.", correct_answer: "True", explanation_vi: "Para E: 'self-checkout model … completed at machines'." },
      { number: 7, type: "true_false_not_given", question_text: "Late-return fines are increasing in most modern libraries.", correct_answer: "False", explanation_vi: "Para F: 'increasing numbers of libraries have moved AWAY from fines'." },
      { number: 8, type: "true_false_not_given", question_text: "Library programmes are typically restricted to library members.", correct_answer: "False", explanation_vi: "Para G: 'usually open to anyone, library member or not'." },
      { number: 9, type: "sentence_completion", question_text: "Australian libraries typically have ____________-week loan periods.", correct_answer: "four / 4", explanation_vi: "Para C: 'four weeks rather than three'." },
      { number: 10, type: "summary_completion", question_text: "US inter-library loans typically take ____________ to ____________ days.", correct_answer: "10, 14 / ten, fourteen", explanation_vi: "Para D: 'ten to fourteen days'." },
      { number: 11, type: "short_answer", question_text: "Where should phone calls usually be taken inside a library?", correct_answer: "stairwells or atriums", explanation_vi: "Para H." },
      { number: 12, type: "multiple_choice", question_text: "The reason many libraries dropped late-return fines was that:", options: ["A) fines were illegal in many countries", "B) fines discouraged borrowing more than they recovered books", "C) fines damaged the relationship with adult members", "D) computers couldn't track them"], correct_answer: "B", explanation_vi: "Para F: 'fines discouraged borrowing more than they recovered books'." },
      { number: 13, type: "multiple_choice", question_text: "Photography in most libraries is:", options: ["A) prohibited entirely", "B) permitted for books, not other readers", "C) permitted only in designated rooms", "D) always permitted"], correct_answer: "B", explanation_vi: "Para H: 'Photography of books is usually permitted; photography of other readers is not'." },
    ],
    vocabulary_focus: [
      { word: "reciprocal", ipa: "/rɪˈsɪp.rə.kəl/", vi_translation: "có qua có lại, tương hỗ", band_level: 8, context_use: "'Reciprocal agreements' — thoả thuận hai chiều giữa các bang." },
      { word: "courtesy card", ipa: "/ˈkɜː.tə.si kɑːrd/", vi_translation: "thẻ ưu đãi tạm thời", band_level: 8, context_use: "Thẻ cho khách thăm — không phải member chính thức." },
      { word: "inter-library", ipa: "/ˌɪn.tərˈlaɪ.brər.i/", vi_translation: "liên thư viện", band_level: 7, context_use: "'Inter-library loan networks' — mạng cho mượn giữa các thư viện." },
      { word: "decentralised", ipa: "/diːˈsɛn.trə.laɪzd/", vi_translation: "phi tập trung", band_level: 8, context_use: "Australian system: each state runs separately." },
      { word: "self-checkout", ipa: "/ˌsɛlfˈtʃɛk.aʊt/", vi_translation: "tự thanh toán/mượn", band_level: 7, context_use: "Singapore: machines handle most transactions." },
      { word: "designated", ipa: "/ˈdɛz.ɪg.neɪ.tɪd/", vi_translation: "được chỉ định", band_level: 7, context_use: "'Designated zones for eating' — khu vực được chỉ định." },
      { word: "etiquette", ipa: "/ˈɛt.ɪ.kɛt/", vi_translation: "phép tắc, quy tắc ứng xử", band_level: 7, context_use: "'Library etiquette' — quy tắc lịch sự trong thư viện." },
      { word: "atrium", ipa: "/ˈeɪ.tri.əm/", vi_translation: "sảnh thông tầng", band_level: 8, context_use: "Khoảng sảnh trống ở giữa toà nhà." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SKIM_SCAN,
      STRAT_QUESTION_FIRST,
      STRAT_TFNG,
      STRAT_LOCATE_PARAGRAPH,
      "GT passages về các nước khác nhau — track theo bảng country × feature khi skim. Đáp án matching info hay xuất hiện.",
    ],
    common_mistakes_vi: [
      "Lẫn loan periods các nước: UK 3 weeks, AU 4 weeks. TFNG sai vì không đối chiếu đúng country.",
      "Sentence completion: viết 'four weeks' khi đề chỉ giới hạn 'no more than 1 word/number'.",
      "Multiple choice: chốt option có từ ngữ giống passage chứ không phải lý do đúng.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_reading_gt_food_preservation",
    module: "general_training",
    title_vi: "Phương pháp bảo quản thực phẩm tại nhà",
    title_en: "Common methods of home food preservation",
    passage_text: `[A] Storing food safely is one of the most useful skills a household can develop. Apart from saving money on weekly shopping, good preservation reduces waste and gives you flexibility in the kitchen. The main techniques fall into five categories: refrigeration, freezing, drying, fermenting, and canning. Each suits a different range of foods.

[B] Refrigeration is the most familiar. Most refrigerators run between 1 and 5 degrees Celsius, a range that slows the growth of common spoilage bacteria without freezing the food. Different items have different optimal positions: meat and fish on the bottom shelf where temperatures are coldest and any leakage cannot drip onto other foods, dairy on the middle shelf, fruit and vegetables in the dedicated drawers (which are slightly warmer and more humid). Eggs are best kept in their original carton on a middle shelf, not in the door, where temperature fluctuates as the door opens.

[C] Freezing extends storage from days to months. Most foods freeze well at minus 18 degrees Celsius — the standard for home freezers — but quality varies. Meat, fish, bread, and most cooked dishes freeze excellently. Vegetables benefit from a brief blanching (a quick boil and cold-water dip) before freezing, which preserves colour and texture. Some foods do not freeze well: lettuce, raw cucumber, and most cream-based sauces separate or turn limp after thawing.

[D] Drying is one of the oldest preservation methods. Removing moisture stops microbial growth. Sun-drying works for many fruits in dry climates: apricots, figs, and grapes (raisins) lose 70-80 percent of their weight as water. In wetter climates, an oven on its lowest setting (typically around 50 degrees Celsius) with the door slightly open dries food slowly without cooking it. Vegetables can be air-dried hung in bunches, or dried in an electric food dehydrator. Properly dried food keeps for six to twelve months in airtight containers.

[E] Fermenting uses controlled microbial activity to extend shelf life and develop new flavours. Sauerkraut, kimchi, miso, yoghurt, and kefir all rely on bacterial fermentation; vinegar, beer, and wine on yeast. Home fermentation requires only basic equipment — a clean glass jar, a weight to keep food submerged in brine, and an airlock or simple cloth cover — but does require attention to cleanliness. Fermented foods stored at refrigerator temperatures continue to develop flavour over weeks; many improve significantly after the first month.

[F] Canning preserves food in airtight jars after heat-sterilisation. Two methods exist for home use. Water-bath canning suits high-acid foods such as jams, pickles, and tomatoes: jars are submerged in boiling water for a set time, killing surface microbes. Pressure canning is required for low-acid foods such as plain vegetables, soups, and meats: a pressure canner reaches temperatures above 100 degrees Celsius, which is necessary to kill the heat-resistant bacterial spores responsible for botulism. Pressure canning equipment is more expensive but is non-negotiable for low-acid items.

[G] Across all methods, two principles apply. First, start with fresh, high-quality food: preservation cannot improve food, only delay its decline. Second, label everything with the date it was stored. A simple masking-tape label and a permanent marker takes seconds and prevents the common problem of finding an unidentified container at the back of the freezer six months later. Six months is also a useful default rule: when in doubt about whether something is still good, the answer is usually no.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph B: i) The science of fermentation; ii) Refrigerator zones and best positions; iii) Pressure canning for low-acid foods; iv) Removing moisture", correct_answer: "ii", explanation_vi: "Para B describes refrigerator shelves + positions for different foods." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph F: i) Drying in different climates; ii) Two canning methods for home use; iii) Freezer-friendly foods; iv) Universal labelling principle", correct_answer: "ii", explanation_vi: "Para F: water-bath + pressure canning." },
      { number: 3, type: "true_false_not_given", question_text: "Eggs are best kept in the door of the refrigerator.", correct_answer: "False", explanation_vi: "Para B: 'not in the door, where temperature fluctuates'." },
      { number: 4, type: "true_false_not_given", question_text: "All vegetables freeze equally well without preparation.", correct_answer: "False", explanation_vi: "Para C: 'Vegetables benefit from a brief blanching'." },
      { number: 5, type: "true_false_not_given", question_text: "Sun-drying suits dry-climate fruits more than wet-climate fruits.", correct_answer: "True", explanation_vi: "Para D: 'Sun-drying works for many fruits in dry climates'." },
      { number: 6, type: "true_false_not_given", question_text: "Home fermentation requires expensive specialist equipment.", correct_answer: "False", explanation_vi: "Para E: 'requires only basic equipment'." },
      { number: 7, type: "true_false_not_given", question_text: "Pressure canning can be safely replaced with water-bath canning for low-acid vegetables.", correct_answer: "False", explanation_vi: "Para F: 'Pressure canning is required for low-acid foods … non-negotiable'." },
      { number: 8, type: "true_false_not_given", question_text: "Tomatoes can be safely preserved using water-bath canning.", correct_answer: "True", explanation_vi: "Para F: 'Water-bath canning suits high-acid foods such as jams, pickles, and tomatoes'." },
      { number: 9, type: "sentence_completion", question_text: "Standard home freezers run at minus ____________ degrees Celsius.", correct_answer: "18", explanation_vi: "Para C." },
      { number: 10, type: "summary_completion", question_text: "Properly dried food keeps for ____________ to ____________ months in airtight containers.", correct_answer: "6, 12 / six, twelve", explanation_vi: "Para D." },
      { number: 11, type: "short_answer", question_text: "Which bacterial threat makes pressure canning necessary for low-acid foods?", correct_answer: "botulism", explanation_vi: "Para F: 'spores responsible for botulism'." },
      { number: 12, type: "matching_information", question_text: "Which paragraph mentions an airlock and a brine weight? (A/B/C/D/E/F/G)", correct_answer: "E", explanation_vi: "Para E describes fermentation equipment." },
      { number: 13, type: "multiple_choice", question_text: "The author's two universal principles are:", options: ["A) start fresh + label everything", "B) buy organic + use vacuum sealers", "C) freeze first + dry second", "D) ferment for flavour + can for safety"], correct_answer: "A", explanation_vi: "Para G: 'start with fresh' + 'label everything'." },
    ],
    vocabulary_focus: [
      { word: "refrigeration", ipa: "/rɪˌfrɪdʒ.əˈreɪ.ʃən/", vi_translation: "sự làm lạnh", band_level: 7, context_use: "'Refrigeration is the most familiar method'." },
      { word: "blanching", ipa: "/ˈblæn.tʃɪŋ/", vi_translation: "chần (qua nước sôi)", band_level: 8, context_use: "Cooking term — quick boil + cold dip để giữ màu rau." },
      { word: "fermentation", ipa: "/ˌfɜː.mɛnˈteɪ.ʃən/", vi_translation: "lên men", band_level: 8, context_use: "Quá trình vi sinh — tạo flavour mới." },
      { word: "submerged", ipa: "/səbˈmɜːdʒd/", vi_translation: "ngập, chìm dưới (nước)", band_level: 7, context_use: "'Submerged in boiling water' — ngập trong nước sôi." },
      { word: "sterilisation", ipa: "/ˌstɛr.ə.laɪˈzeɪ.ʃən/", vi_translation: "sự khử trùng", band_level: 8, context_use: "'Heat-sterilisation' — khử trùng bằng nhiệt." },
      { word: "spores", ipa: "/spɔːrz/", vi_translation: "bào tử", band_level: 8, context_use: "'Bacterial spores' — bào tử vi khuẩn chịu nhiệt." },
      { word: "non-negotiable", ipa: "/ˌnɒn.nɪˈgoʊ.ʃi.ə.bəl/", vi_translation: "không thể thoả hiệp", band_level: 8, context_use: "'Non-negotiable for low-acid items' — bắt buộc, không có lựa chọn khác." },
      { word: "decline", ipa: "/dɪˈklaɪn/", vi_translation: "sự suy giảm", band_level: 6, context_use: "'Delay its decline' — chậm quá trình hỏng." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SKIM_SCAN,
      STRAT_TFNG,
      STRAT_PARAPHRASE,
      STRAT_TIMING,
      "GT passages về kỹ thuật / hướng dẫn — chú ý nhiệt độ, thời gian, loại food. Số liệu là đáp án phổ biến.",
    ],
    common_mistakes_vi: [
      "TFNG: chốt 'True' khi câu hỏi gộp 2 ý — passage có thể đúng 1 ý nhưng sai ý kia → False.",
      "Lẫn 'water-bath canning' (high-acid) với 'pressure canning' (low-acid).",
      "Sentence completion: viết '-18' khi đề đã có dấu trừ. Chỉ cần '18'.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_reading_gt_public_transport",
    module: "general_training",
    title_vi: "Cách mua vé giao thông công cộng tại các thành phố lớn",
    title_en: "Public transport ticketing in major cities",
    passage_text: `[A] Visitors to a new city often spend their first hour standing in front of a ticket machine they cannot quite read. The good news is that almost every modern public-transport network now offers at least three ticketing options, only one of which actually requires you to stand at a machine.

[B] The first option is the contactless bank card. Cities including London, Sydney, Singapore, New York, Hong Kong, and many European capitals now accept tap-on / tap-off contactless payments at every gate or onboard reader. The fare you pay is calculated automatically based on your route. In most networks, contactless payments are charged at the same rate as the local stored-value card, including daily and weekly caps that limit your total spend regardless of how many trips you make. For short visits this is usually the simplest option: no separate card to buy, no top-up to remember.

[C] The second option is the local stored-value card. Examples include Oyster (London), Opal (Sydney), MyKi (Melbourne), EZ-Link (Singapore), Octopus (Hong Kong), and Suica (Tokyo). These pre-paid cards are sold at stations for a small deposit — typically refundable when you return the card — and you load them with cash or by linking to a bank account. Stored-value cards usually have slightly cheaper per-trip fares than single tickets and integrate across multiple modes (bus, metro, tram, sometimes ferry). They are particularly useful for stays longer than a few days.

[D] The third option is the visitor pass. These are time-limited unlimited-travel cards aimed at tourists — for example, the London Visitor Oyster, the Tokyo Subway 24/48/72-hour ticket, or the Berlin City Tour Card. The break-even point varies by city but generally requires more than four or five trips per day. If you plan a packed sightseeing schedule with frequent metro use, a visitor pass often saves money. If your trips are spread thin, the contactless or stored-value option is usually cheaper.

[E] Single paper tickets remain available almost everywhere but tend to be the most expensive option per trip. They make sense only when you genuinely need just one or two journeys and have a reason not to use contactless or stored-value. In some cities — Paris being a notable example — paper tickets are progressively being phased out, with new digital options replacing them.

[F] Several details cause avoidable confusion. First, child fares apply at different age limits depending on the city: under 11 free in London, under 16 free with parent in Tokyo, no specific child discount in some North American systems. Always check before assuming children travel free. Second, peak versus off-peak pricing applies in some cities (notably London and Sydney) but not others. Third, transfer windows — the time within which a second journey counts as a continuation rather than a new trip — vary from 60 minutes to 2.5 hours.

[G] If you forget to tap off at the end of a journey, most contactless and stored-value systems charge you the maximum-fare default. Some networks allow you to apply for a refund online if this was an honest mistake. The process typically takes one to two weeks and the maximum number of refundable claims per month is usually capped — repeated forgetting is treated as a system-abuse signal.

[H] Finally, accessibility features. Most systems offer reduced-fare cards for seniors and disabled travellers, but eligibility requires local registration and may not be available to short-term visitors. International senior discounts are still rare in most networks. Tourist-pass options sometimes include accessibility-friendly route guidance — useful information not always advertised at the standard ticket counter.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph B: i) Stored-value pre-paid cards; ii) Contactless bank-card payments; iii) Visitor passes for tourists; iv) Single paper tickets", correct_answer: "ii", explanation_vi: "Para B describes contactless bank cards." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph D: i) Forgotten tap-offs; ii) Visitor unlimited-travel passes; iii) Accessibility features; iv) Stored-value card examples", correct_answer: "ii", explanation_vi: "Para D mô tả visitor passes." },
      { number: 3, type: "true_false_not_given", question_text: "Most modern transport networks offer at least three ticketing options.", correct_answer: "True", explanation_vi: "Para A: 'at least three ticketing options'." },
      { number: 4, type: "true_false_not_given", question_text: "Contactless payments are always cheaper than stored-value cards.", correct_answer: "False", explanation_vi: "Para B: 'charged at the same rate as the local stored-value card'." },
      { number: 5, type: "true_false_not_given", question_text: "Stored-value cards typically require a small refundable deposit.", correct_answer: "True", explanation_vi: "Para C: 'small deposit — typically refundable when you return the card'." },
      { number: 6, type: "true_false_not_given", question_text: "Visitor passes are always cheaper than contactless or stored-value options.", correct_answer: "False", explanation_vi: "Para D: 'break-even point … requires more than four or five trips per day'." },
      { number: 7, type: "true_false_not_given", question_text: "Paper tickets are being expanded in cities like Paris.", correct_answer: "False", explanation_vi: "Para E: 'progressively being phased out'." },
      { number: 8, type: "true_false_not_given", question_text: "Child fare age limits are consistent across major cities worldwide.", correct_answer: "False", explanation_vi: "Para F: 'child fares apply at different age limits depending on the city'." },
      { number: 9, type: "summary_completion", question_text: "Examples of stored-value cards: Oyster (____________), Opal (____________), Octopus (____________).", correct_answer: "London, Sydney, Hong Kong", explanation_vi: "Para C." },
      { number: 10, type: "sentence_completion", question_text: "Transfer windows vary from ____________ minutes to ____________ hours.", correct_answer: "60, 2.5 / sixty, 2.5", explanation_vi: "Para F." },
      { number: 11, type: "short_answer", question_text: "How long does a tap-off refund typically take to process?", correct_answer: "1 to 2 weeks / one to two weeks", explanation_vi: "Para G." },
      { number: 12, type: "matching_information", question_text: "Which paragraph mentions reduced fares for seniors and disabled travellers? (A/B/C/D/E/F/G/H)", correct_answer: "H", explanation_vi: "Para H." },
      { number: 13, type: "multiple_choice", question_text: "The article suggests that for a short visit with light metro use, the simplest option is usually:", options: ["A) a visitor pass", "B) single paper tickets", "C) contactless bank card", "D) registering for a senior discount"], correct_answer: "C", explanation_vi: "Para B: 'For short visits this is usually the simplest option'." },
    ],
    vocabulary_focus: [
      { word: "contactless", ipa: "/ˈkɒn.tæk.tləs/", vi_translation: "không tiếp xúc", band_level: 6, context_use: "'Contactless payment' — chạm thẻ không cần insert." },
      { word: "stored-value", ipa: "/stɔːrd ˈvæl.juː/", vi_translation: "thẻ nạp tiền sẵn", band_level: 7, context_use: "Cards có sẵn tiền — Oyster, Opal, etc." },
      { word: "deposit", ipa: "/dɪˈpɒz.ɪt/", vi_translation: "tiền cọc", band_level: 6, context_use: "'Refundable deposit' — cọc trả lại khi return card." },
      { word: "phased out", ipa: "/feɪzd aʊt/", vi_translation: "loại bỏ dần", band_level: 7, context_use: "'Paper tickets are being phased out' — bỏ dần." },
      { word: "break-even", ipa: "/ˈbreɪk.iː.vən/", vi_translation: "điểm hoà vốn", band_level: 8, context_use: "'Break-even point' — số trips để pass có giá trị hơn contactless." },
      { word: "transfer window", ipa: "/ˈtrænz.fər ˈwɪn.doʊ/", vi_translation: "khoảng thời gian chuyển tiếp", band_level: 7, context_use: "Time để tính 2 trip là tiếp nối hay riêng." },
      { word: "eligibility", ipa: "/ˌɛl.ɪ.dʒəˈbɪl.ə.ti/", vi_translation: "điều kiện đủ tư cách", band_level: 8, context_use: "'Eligibility requires registration' — phải đăng ký mới đủ điều kiện." },
      { word: "abuse signal", ipa: "/əˈbjuːs ˈsɪg.nəl/", vi_translation: "dấu hiệu lạm dụng hệ thống", band_level: 8, context_use: "'Treated as system-abuse signal' — quá nhiều refunds bị coi là gian lận." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SKIM_SCAN,
      STRAT_PARAPHRASE,
      STRAT_TFNG,
      STRAT_TIMING,
      "GT passages về consumer info — số liệu (price, time, age limit) là đáp án phổ biến cho summary completion.",
    ],
    common_mistakes_vi: [
      "Lẫn các loại cards: Oyster (UK), Opal (AU Sydney), MyKi (AU Melb), Octopus (HK).",
      "TFNG: chốt 'True' khi passage chỉ có 1 ví dụ, không nói 'always'. 'Always' = falsifies easily.",
      "Sentence completion: viết '60 minutes' khi đề chỉ giới hạn số (60).",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 5.5,
  },

  // ═══════════════════════════════════════════════════════════════
  // Mixed difficulty (4) — band 5.5 / 6.5 / 7.5 / 8.5
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ielts_reading_mixed_photosynthesis_basics",
    module: "academic",
    title_vi: "Quang hợp và năng suất cây trồng",
    title_en: "Photosynthesis and crop productivity",
    passage_text: `[A] Photosynthesis is the process by which green plants convert sunlight, water, and carbon dioxide into sugar and oxygen. The basic chemical equation is straightforward: six carbon dioxide molecules and six water molecules, in the presence of sunlight, produce one glucose molecule and six oxygen molecules. The reaction takes place in chloroplasts, the small green structures found in plant cells.

[B] Sunlight is absorbed by chlorophyll, the pigment that gives leaves their green colour. Chlorophyll absorbs red and blue wavelengths most strongly but reflects green wavelengths — which is why most plants look green. The absorbed energy splits water molecules and powers the chemical reactions that build glucose. Oxygen is released as a by-product. Most of the oxygen in the atmosphere we breathe was originally produced by photosynthesis.

[C] Plants vary in their photosynthetic efficiency. The most efficient — sugarcane, maize, and certain tropical grasses — convert about 6 to 8 percent of incoming sunlight into chemical energy under ideal conditions. Many temperate crops achieve only 3 to 4 percent. Wild plants in shaded forests sometimes operate below 1 percent. The remaining sunlight is reflected, transmitted through the leaf, or converted to heat.

[D] Three environmental factors strongly affect photosynthesis rate. Light intensity is the first: brighter conditions accelerate the reaction up to a saturation point, after which extra light no longer helps and may damage the plant. Temperature is the second: most plants photosynthesise best between 20 and 30 degrees Celsius; performance drops sharply above 35 or below 5. Carbon dioxide concentration is the third: at modern atmospheric levels (around 0.04 percent), CO₂ is often the limiting factor. Greenhouse operators sometimes raise CO₂ artificially to about 0.1 percent and report measurable increases in growth rate.

[E] Crop scientists have long worked to improve photosynthetic efficiency in food crops. Selective breeding produced the high-yield wheat and rice varieties of the 1960s Green Revolution, which doubled global cereal production over two decades. More recent work focuses on directly engineering the photosynthesis machinery — for example, transferring the more efficient C4 pathway used by maize into rice, which uses the less efficient C3 pathway. Field trials of engineered C4 rice have shown yield increases of 10 to 20 percent in some test plots, although commercial deployment is still years away.

[F] Limits exist. The thermodynamic ceiling on photosynthetic efficiency — the absolute maximum possible given physics — is estimated at around 11 percent for C3 plants and 12 percent for C4 plants. Real-world crops fall well below these ceilings, but the gap is narrowing. Whether further improvements come from genetic engineering, breeding, or cultivation practices, the underlying biology imposes a hard upper limit beyond which no plant can be pushed.

[G] Climate change introduces new variables. Rising CO₂ should, on its own, accelerate photosynthesis — and laboratory studies confirm this effect. But field studies show smaller gains than laboratory predictions because other factors — water availability, temperature stress, and nutrient limitation — counteract the benefit. Warmer temperatures also extend growing seasons in some regions and shorten them in others. Net effects on global crop yields remain debated and vary widely by region.

[H] For learners interested in plant science, the take-away is that photosynthesis is well-understood at the chemical level but still imperfectly understood at the system level. Predicting how a particular crop will respond to a particular set of environmental changes remains difficult — which is partly why agricultural research continues to attract substantial funding worldwide.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph C: i) Limits set by physics; ii) The basic chemical equation; iii) Variation in plant efficiency; iv) Climate change effects", correct_answer: "iii", explanation_vi: "Para C: 6-8% sugarcane, 3-4% temperate crops — variation." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph E: i) Crop science improvements; ii) Three environmental factors; iii) Chlorophyll and light absorption; iv) Modern climate effects", correct_answer: "i", explanation_vi: "Para E: Green Revolution + C4 engineering." },
      { number: 3, type: "true_false_not_given", question_text: "Photosynthesis takes place in cellular structures called chloroplasts.", correct_answer: "True", explanation_vi: "Para A." },
      { number: 4, type: "true_false_not_given", question_text: "Chlorophyll absorbs green wavelengths most strongly.", correct_answer: "False", explanation_vi: "Para B: 'reflects green wavelengths'." },
      { number: 5, type: "true_false_not_given", question_text: "Tropical grasses are generally more efficient than temperate crops.", correct_answer: "True", explanation_vi: "Para C: 6-8% vs 3-4%." },
      { number: 6, type: "true_false_not_given", question_text: "Above 35 degrees Celsius, plant photosynthesis improves significantly.", correct_answer: "False", explanation_vi: "Para D: 'performance drops sharply above 35'." },
      { number: 7, type: "true_false_not_given", question_text: "C4 rice is currently in widespread commercial use.", correct_answer: "False", explanation_vi: "Para E: 'commercial deployment is still years away'." },
      { number: 8, type: "summary_completion", question_text: "Three environmental factors affecting photosynthesis: ____________ intensity, ____________, and CO₂ ____________.", correct_answer: "light, temperature, concentration", explanation_vi: "Para D." },
      { number: 9, type: "sentence_completion", question_text: "The thermodynamic ceiling for C4 plants is estimated at around ____________%.", correct_answer: "12", explanation_vi: "Para F." },
      { number: 10, type: "short_answer", question_text: "What gas is released as a by-product of photosynthesis?", correct_answer: "oxygen", explanation_vi: "Para B." },
      { number: 11, type: "matching_information", question_text: "Which paragraph mentions greenhouse operators raising CO₂ artificially? (A/B/C/D/E/F/G/H)", correct_answer: "D", explanation_vi: "Para D." },
      { number: 12, type: "multiple_choice", question_text: "Field studies of rising CO₂ show:", options: ["A) larger gains than laboratory predictions", "B) smaller gains than laboratory predictions", "C) no measurable effect", "D) only negative effects"], correct_answer: "B", explanation_vi: "Para G: 'smaller gains than laboratory predictions'." },
      { number: 13, type: "multiple_choice", question_text: "Net climate-change effects on global crop yields are described as:", options: ["A) clearly positive worldwide", "B) clearly negative worldwide", "C) debated and regionally varied", "D) statistically zero"], correct_answer: "C", explanation_vi: "Para G: 'remain debated and vary widely by region'." },
    ],
    vocabulary_focus: [
      { word: "chloroplast", ipa: "/ˈklɔːr.ə.plæst/", vi_translation: "lục lạp", band_level: 8, context_use: "Cell organelle nơi photosynthesis xảy ra." },
      { word: "chlorophyll", ipa: "/ˈklɔːr.ə.fɪl/", vi_translation: "chất diệp lục", band_level: 7, context_use: "Pigment hấp thụ ánh sáng." },
      { word: "wavelength", ipa: "/ˈweɪv.lɛŋθ/", vi_translation: "bước sóng", band_level: 7, context_use: "'Red and blue wavelengths' — bước sóng đỏ và xanh." },
      { word: "saturation", ipa: "/ˌsætʃ.əˈreɪ.ʃən/", vi_translation: "bão hoà", band_level: 8, context_use: "'Saturation point' — điểm tối đa, thêm light không tăng tốc nữa." },
      { word: "selective breeding", ipa: "/sɪˈlɛk.tɪv ˈbriː.dɪŋ/", vi_translation: "lai tạo chọn lọc", band_level: 7, context_use: "Phương pháp tạo giống truyền thống." },
      { word: "thermodynamic", ipa: "/ˌθɜː.moʊ.daɪˈnæm.ɪk/", vi_translation: "(thuộc) nhiệt động học", band_level: 9, context_use: "'Thermodynamic ceiling' — giới hạn vật lý." },
      { word: "yield", ipa: "/jiːld/", vi_translation: "năng suất, sản lượng", band_level: 6, context_use: "'Yield increases' — tăng sản lượng." },
      { word: "counteract", ipa: "/ˌkaʊn.təˈrækt/", vi_translation: "chống lại, làm vô hiệu", band_level: 8, context_use: "'Counteract the benefit' — vô hiệu hoá lợi ích." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SKIM_SCAN,
      STRAT_TFNG,
      STRAT_PARAPHRASE,
      STRAT_LOCATE_PARAGRAPH,
      "Science passages có nhiều số liệu — khoanh tròn % và °C khi skim. Đáp án sentence/summary completion thường là số.",
    ],
    common_mistakes_vi: [
      "Lẫn C3 và C4 pathways — đọc Para E kỹ.",
      "TFNG: chốt 'True' khi passage có 'similar' nhưng không 'identical' với câu hỏi.",
      "Multiple choice: chốt đáp án có 'always' hoặc 'never' — IELTS hiếm khi tuyệt đối hoá.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 5.5,
  },
  {
    id: "ielts_reading_mixed_coffee_economics",
    module: "academic",
    title_vi: "Kinh tế học chuỗi cung ứng cà phê toàn cầu",
    title_en: "The economics of the global coffee supply chain",
    passage_text: `[A] Coffee is the second most-traded commodity in the world by value, after oil. The global market is worth more than 100 billion US dollars annually. Yet coffee farmers — most of them smallholders in tropical countries — receive only a small fraction of the final retail price. The economics of the supply chain explain why.

[B] Most coffee originates from two species: arabica, which makes up about 60 percent of global production and grows at higher altitudes; and robusta, which is hardier, grows at lower altitudes, and accounts for the remaining 40 percent. Brazil and Vietnam together produce more than half the world's coffee — Brazil dominating arabica, Vietnam dominating robusta. Other significant producers include Colombia, Indonesia, Ethiopia, Honduras, and India.

[C] The journey from coffee cherry to retail product involves five stages, each with its own actors and margins. First, farmers grow and harvest the cherries. Second, processors remove the outer fruit and dry the beans. Third, exporters and importers move the green beans across borders. Fourth, roasters transform green beans into the brown product consumers recognise. Fifth, retailers — supermarkets and cafés — sell to end customers.

[D] Margins concentrate at the downstream stages. Of every dollar paid for a cup of speciality coffee in a Western city, the farmer typically receives less than 10 cents. The roaster captures roughly 20 cents. Distribution and retail capture the largest share — usually 40 to 50 cents — reflecting the fixed costs of cafés (rent, labour, equipment, marketing) and the considerable value-add of preparation and brand. The remaining margin is split among processors, exporters, and importers.

[E] Coffee prices on commodity exchanges fluctuate substantially. Arabica futures have ranged from 60 cents per pound to over 4 dollars per pound within recent decades. The volatility reflects weather events in producer countries — particularly Brazilian frosts and droughts — alongside currency movements and speculative trading. Farmers bear the brunt of price swings: their costs are stable but their revenue is not, and few have access to financial instruments that smooth income across years.

[F] Several initiatives attempt to deliver more value to producers. Fair Trade certification guarantees a minimum price floor and a small social premium for community projects. Direct trade arrangements bypass conventional middlemen, with roasters buying directly from cooperatives or even individual farms. Speciality coffee — graded above 80 points on industry scoring scales — commands prices several times higher than commodity-grade coffee, with the premium intended to flow back to producers. Whether these models actually shift the economic balance is debated; studies show modest effects in some cases and negligible effects in others.

[G] Climate change is a structural threat. Arabica is particularly sensitive to temperature and humidity; the band of viable arabica land is projected to shrink by roughly 50 percent by 2050 under continued warming. Producer regions are responding through varietal trials — testing more heat-tolerant arabica strains and exploring under-used species such as liberica and excelsa. Some climate models suggest that highland regions in East Africa and parts of Vietnam may benefit as conventional regions become marginal.

[H] For consumers, the practical implications are several. The 5 percent premium asked for fair-trade or direct-trade coffee returns a small but real benefit to producers. Choosing speciality over commodity coffee shifts a larger share of the retail dollar upstream. Reducing waste — finishing the cup, brewing only what you'll drink — has compounding effects across the supply chain. None of these individually transforms the economics; collectively, gradually, they may.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph C: i) Five-stage supply chain; ii) Climate change threats; iii) Margin distribution downstream; iv) Two coffee species", correct_answer: "i", explanation_vi: "Para C lists the 5 stages." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph D: i) Initiatives to help producers; ii) Where margins concentrate; iii) Volatile commodity prices; iv) Consumer practical advice", correct_answer: "ii", explanation_vi: "Para D: margin breakdown — farmer 10c, retail 40-50c." },
      { number: 3, type: "true_false_not_given", question_text: "Coffee is the most-traded commodity in the world by value.", correct_answer: "False", explanation_vi: "Para A: 'second most-traded … after oil'." },
      { number: 4, type: "true_false_not_given", question_text: "Brazil produces more arabica than robusta.", correct_answer: "True", explanation_vi: "Para B: 'Brazil dominating arabica'." },
      { number: 5, type: "true_false_not_given", question_text: "Farmers receive about half the retail price of speciality coffee.", correct_answer: "False", explanation_vi: "Para D: 'less than 10 cents' per dollar." },
      { number: 6, type: "true_false_not_given", question_text: "Arabica futures have ranged from 60 cents to over 4 dollars per pound in recent decades.", correct_answer: "True", explanation_vi: "Para E." },
      { number: 7, type: "true_false_not_given", question_text: "Fair Trade certification has been proven to dramatically improve farmer incomes in all studies.", correct_answer: "False", explanation_vi: "Para F: 'modest effects in some cases and negligible effects in others'." },
      { number: 8, type: "true_false_not_given", question_text: "Arabica's viable cultivation area is projected to shrink by roughly half by 2050.", correct_answer: "True", explanation_vi: "Para G: 'shrink by roughly 50 percent by 2050'." },
      { number: 9, type: "summary_completion", question_text: "The five supply-chain stages: farmers → ____________ → exporters/importers → ____________ → retailers.", correct_answer: "processors, roasters", explanation_vi: "Para C." },
      { number: 10, type: "sentence_completion", question_text: "Speciality coffee is graded above ____________ points on industry scoring scales.", correct_answer: "80", explanation_vi: "Para F." },
      { number: 11, type: "short_answer", question_text: "Which two countries together produce more than half the world's coffee?", correct_answer: "Brazil and Vietnam", explanation_vi: "Para B." },
      { number: 12, type: "matching_information", question_text: "Which paragraph discusses heat-tolerant arabica trials and species like liberica? (A/B/C/D/E/F/G/H)", correct_answer: "G", explanation_vi: "Para G." },
      { number: 13, type: "multiple_choice", question_text: "The article's framing of consumer choices is that they:", options: ["A) individually transform the economics", "B) have no real effect", "C) collectively and gradually may shift outcomes", "D) primarily benefit retailers"], correct_answer: "C", explanation_vi: "Para H: 'collectively, gradually, they may'." },
    ],
    vocabulary_focus: [
      { word: "commodity", ipa: "/kəˈmɒd.ə.ti/", vi_translation: "hàng hoá thương phẩm", band_level: 7, context_use: "'Most-traded commodity' — hàng hoá giao dịch nhiều nhất." },
      { word: "smallholder", ipa: "/ˈsmɔːlˌhoʊl.dər/", vi_translation: "nông hộ nhỏ", band_level: 8, context_use: "Farmers nhỏ — most coffee từ smallholders." },
      { word: "downstream", ipa: "/ˌdaʊnˈstriːm/", vi_translation: "(phía) hạ nguồn", band_level: 8, context_use: "Trong supply chain — khâu gần consumer." },
      { word: "volatility", ipa: "/ˌvɒl.əˈtɪl.ə.ti/", vi_translation: "tính biến động (giá)", band_level: 8, context_use: "Coffee futures: high volatility." },
      { word: "speculative", ipa: "/ˈspɛk.jə.lə.tɪv/", vi_translation: "đầu cơ", band_level: 8, context_use: "'Speculative trading' — giao dịch đầu cơ." },
      { word: "premium", ipa: "/ˈpriː.mi.əm/", vi_translation: "phần phụ trội, giá cao hơn", band_level: 7, context_use: "'Social premium' — phần thưởng thêm cho cộng đồng." },
      { word: "varietal", ipa: "/vəˈraɪ.ə.təl/", vi_translation: "(thuộc về) giống cây", band_level: 9, context_use: "'Varietal trials' — thử nghiệm giống mới." },
      { word: "marginal", ipa: "/ˈmɑːr.dʒɪ.nəl/", vi_translation: "ranh giới, kém hiệu quả", band_level: 7, context_use: "'Conventional regions become marginal' — vùng cũ trở nên kém phù hợp." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_TFNG,
      STRAT_LOCATE_PARAGRAPH,
      STRAT_TIMING,
      "Economics passages có nhiều % và $ — khoanh tròn từng số khi skim. Sentence completion hay yêu cầu đúng số đó.",
    ],
    common_mistakes_vi: [
      "TFNG nhầm: passage nói 'modest effects' không có nghĩa 'dramatic effects' — đây là FALSE, không phải NG.",
      "Lẫn arabica (60%, cao độ) với robusta (40%, thấp).",
      "Multiple choice: option C ở câu cuối yêu cầu hiểu 'gradual' và 'collective' — đừng chọn A vì nghe mạnh.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_reading_mixed_circadian_rhythm",
    module: "academic",
    title_vi: "Nhịp sinh học và giấc ngủ",
    title_en: "Sleep cycles and circadian rhythm",
    passage_text: `[A] The human body operates on an internal clock that runs on a roughly 24-hour cycle, regulating sleep, hormone release, body temperature, and dozens of other physiological processes. This internal clock is called the circadian rhythm. The term derives from the Latin "circa diem", meaning "about a day" — the cycle is close to but not exactly 24 hours.

[B] The master clock sits in a small cluster of neurons in the brain called the suprachiasmatic nucleus, located in the hypothalamus. Light entering the eye is the dominant signal that synchronises this clock with the external world. Specialised retinal cells, distinct from the rods and cones used for vision, send timing signals directly to the suprachiasmatic nucleus. These cells respond particularly strongly to blue wavelengths in the early morning.

[C] When darkness falls, the pineal gland — under instruction from the master clock — secretes melatonin, the primary hormone that signals sleep. Melatonin levels rise sharply in the evening, peak in the middle of the night, and fall toward morning. Body temperature follows an inverted pattern: peak in the late afternoon, lowest a few hours before waking. Cortisol, the alertness hormone, rises sharply just before natural waking time and contributes to the sense of being ready to start the day.

[D] Sleep itself is not uniform. A typical adult passes through four to six 90-minute sleep cycles per night, each cycle progressing through stages of light non-REM sleep, deep non-REM sleep, and REM (rapid eye movement) sleep. The proportions shift across the night: deep sleep dominates the first half, REM sleep dominates the second half. Both kinds of sleep appear to be functionally distinct: deep sleep supports physical restoration and immune function; REM sleep supports memory consolidation and emotional processing.

[E] Disruption to circadian rhythm has measurable health costs. Shift workers — particularly those working rotating night schedules — show elevated rates of cardiovascular disease, type 2 diabetes, and certain cancers. Long-haul flight crews experience similar effects. The mechanism involves chronic mismatch between the internal clock and the external schedule, which prevents the body from settling into a stable hormone-release pattern. Mitigation strategies — bright-light exposure during shifts, controlled darkness during sleep, and timed melatonin supplementation — reduce but do not eliminate the effect.

[F] Adolescents experience a temporary natural shift. During puberty, the circadian clock delays by roughly 1 to 2 hours: typical adolescents become sleepy later in the evening and wake later in the morning. This shift is biological, not behavioural — it persists across cultures and is not caused by screens or social habits, although both can amplify it. School start times that begin before 8:30 in the morning systematically force adolescents to operate against their biology, with documented impacts on academic performance and mental health.

[G] The clock is partly genetic. Several genes — notably PER1, PER2, and CRY1 — encode the molecular components that drive the 24-hour oscillation at the cellular level. Variants in these genes are associated with extreme chronotypes: rare individuals are reliably awake before 5 am and asleep by 9 pm regardless of social schedule, and equally rare individuals are reliably alert past 2 am. These variants are inherited and stable across the lifespan.

[H] Practical interventions to improve sleep quality target the same biological levers. Bright light exposure shortly after waking strengthens the morning signal. Dim, warm light in the evening allows melatonin to rise normally. Consistent bedtimes and wake times — including on weekends — stabilise the cycle. The single most damaging factor for most adults is irregular schedules: a body that does not know when to expect sleep does not produce hormones at the right times, and the resulting low-grade dysregulation accumulates over months and years.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph B: i) Adolescent biological delay; ii) Master clock and light synchronisation; iii) Practical sleep interventions; iv) Genetic chronotype variants", correct_answer: "ii", explanation_vi: "Para B: suprachiasmatic nucleus + light synchronisation." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph E: i) Sleep cycle structure; ii) Hormones across the day; iii) Health costs of circadian disruption; iv) Master-clock anatomy", correct_answer: "iii", explanation_vi: "Para E: shift workers + flight crews + chronic mismatch." },
      { number: 3, type: "true_false_not_given", question_text: "The circadian rhythm cycle is exactly 24 hours.", correct_answer: "False", explanation_vi: "Para A: 'close to but not exactly 24 hours'." },
      { number: 4, type: "true_false_not_given", question_text: "Specialised retinal cells respond particularly strongly to blue wavelengths in the early morning.", correct_answer: "True", explanation_vi: "Para B." },
      { number: 5, type: "true_false_not_given", question_text: "Melatonin levels are highest in the late afternoon.", correct_answer: "False", explanation_vi: "Para C: 'peak in the middle of the night'. Body temperature peaks late afternoon — different hormone." },
      { number: 6, type: "true_false_not_given", question_text: "Deep non-REM sleep dominates the second half of the night.", correct_answer: "False", explanation_vi: "Para D: 'deep sleep dominates the first half, REM sleep dominates the second'." },
      { number: 7, type: "true_false_not_given", question_text: "Adolescents' sleep delay is caused mainly by screen time.", correct_answer: "False", explanation_vi: "Para F: 'biological, not behavioural — not caused by screens'." },
      { number: 8, type: "true_false_not_given", question_text: "Mitigation strategies for shift workers fully eliminate the health effects.", correct_answer: "False", explanation_vi: "Para E: 'reduce but do not eliminate'." },
      { number: 9, type: "summary_completion", question_text: "Two functional kinds of sleep: ____________ supports physical restoration; ____________ supports memory and emotion.", correct_answer: "deep / non-REM, REM", explanation_vi: "Para D." },
      { number: 10, type: "sentence_completion", question_text: "Each sleep cycle lasts approximately ____________ minutes.", correct_answer: "90", explanation_vi: "Para D: '90-minute sleep cycles'." },
      { number: 11, type: "short_answer", question_text: "Which gland releases melatonin?", correct_answer: "pineal", explanation_vi: "Para C: 'the pineal gland … secretes melatonin'." },
      { number: 12, type: "matching_information", question_text: "Which paragraph mentions PER1, PER2 and CRY1 genes? (A/B/C/D/E/F/G/H)", correct_answer: "G", explanation_vi: "Para G." },
      { number: 13, type: "multiple_choice", question_text: "According to the final paragraph, the single most damaging factor for adult sleep is:", options: ["A) too little exposure to morning light", "B) consuming caffeine too late", "C) irregular schedules", "D) sleeping in on weekends"], correct_answer: "C", explanation_vi: "Para H: 'single most damaging factor … is irregular schedules'." },
    ],
    vocabulary_focus: [
      { word: "circadian", ipa: "/sɜːˈkeɪ.di.ən/", vi_translation: "(thuộc) nhịp sinh học 24-giờ", band_level: 8, context_use: "'Circadian rhythm' — chu kỳ ~24h." },
      { word: "suprachiasmatic", ipa: "/ˌsuː.prə.kaɪ.æzˈmæt.ɪk/", vi_translation: "(thuộc) nhân trên giao thoa thị giác", band_level: 9, context_use: "Anatomy term — cluster of neurons trong hypothalamus." },
      { word: "secretes", ipa: "/sɪˈkriːts/", vi_translation: "tiết ra (hormone)", band_level: 7, context_use: "'Secretes melatonin' — tiết ra melatonin." },
      { word: "consolidation", ipa: "/kənˌsɒl.ɪˈdeɪ.ʃən/", vi_translation: "sự củng cố (trí nhớ)", band_level: 8, context_use: "'Memory consolidation' — REM sleep củng cố trí nhớ." },
      { word: "adolescent", ipa: "/ˌæd.əˈlɛs.ənt/", vi_translation: "vị thành niên", band_level: 7, context_use: "Tuổi 13-19 — circadian delay 1-2h." },
      { word: "amplify", ipa: "/ˈæm.plə.faɪ/", vi_translation: "khuếch đại, làm mạnh thêm", band_level: 7, context_use: "'Both can amplify it' — screens không gây ra nhưng làm mạnh." },
      { word: "chronotype", ipa: "/ˈkrɒn.oʊ.taɪp/", vi_translation: "kiểu hình thời gian sinh học", band_level: 9, context_use: "Pattern individual — early bird vs night owl." },
      { word: "dysregulation", ipa: "/dɪsˌrɛg.jəˈleɪ.ʃən/", vi_translation: "rối loạn điều hoà", band_level: 9, context_use: "'Low-grade dysregulation accumulates' — rối loạn nhẹ tích luỹ." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_TFNG,
      STRAT_PARAPHRASE,
      STRAT_LOCATE_PARAGRAPH,
      STRAT_QUESTION_FIRST,
      "Anatomy / biology passages — track theo bảng hormone × time of day. Đừng để names hard scare you.",
    ],
    common_mistakes_vi: [
      "Lẫn melatonin (sleep, peaks night) với cortisol (alertness, peaks morning) với body temperature (peak late afternoon).",
      "TFNG: chốt 'True' khi câu hỏi đảo ngược ý — Para D nói deep sleep first half, câu hỏi nói deep sleep second half → FALSE không phải NG.",
      "Multiple choice: option dài hơn không tự động đúng. Đối chiếu Ý.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_reading_mixed_quantum_basics",
    module: "academic",
    title_vi: "Nguyên lý cơ bản của cơ học lượng tử",
    title_en: "Fundamentals of quantum mechanics",
    passage_text: `[A] Quantum mechanics is the branch of physics that describes the behaviour of matter and energy at very small scales — the scale of atoms, electrons, photons, and the interactions between them. The theory emerged in the early twentieth century when classical physics, which had successfully explained the macroscopic world for centuries, repeatedly failed to predict experimental results obtained at atomic scales.

[B] The decisive failures involved blackbody radiation and the photoelectric effect. Classical physics predicted that hot objects should radiate energy at all wavelengths uniformly — the so-called ultraviolet catastrophe — yet experiments showed a clear peak that shifted with temperature. Max Planck resolved the inconsistency in 1900 by proposing that energy is emitted in discrete packets, which he called quanta. Albert Einstein extended Planck's idea in 1905 to explain the photoelectric effect, demonstrating that light itself behaves as discrete packets, later called photons.

[C] Particle-wave duality is a core concept. Light, long understood as a wave, sometimes behaves as a particle. Conversely, matter — long understood as particles — sometimes behaves as a wave. The double-slit experiment, performed first with light and later with electrons, atoms, and even small molecules, shows that particles passing through two slits produce interference patterns characteristic of waves. The interference disappears the moment one observes which slit each particle passed through. The act of measurement collapses the wave-like behaviour into particle-like behaviour. This is not a measurement-technology limitation; it appears to be a structural feature of reality at small scales.

[D] Heisenberg's uncertainty principle, formulated in 1927, places a fundamental limit on simultaneous measurement of certain pairs of properties — most famously position and momentum. The more precisely one is known, the less precisely the other can be known. The product of the uncertainties has a hard lower bound, given by Planck's constant divided by 4π. This is not a statement about measurement equipment; it expresses an intrinsic limit on what is simultaneously knowable about a quantum object.

[E] Schrödinger's equation, also from the 1920s, describes how quantum states evolve over time. The state of a quantum system is represented by a mathematical object called a wave function, traditionally written using the Greek letter ψ (psi). The wave function does not directly represent a physical quantity; rather, its square gives the probability of measuring a particular outcome. This shift from determinism to probability represented a profound philosophical break with classical physics, which had treated the universe as in principle predictable given complete information about the present.

[F] Quantum entanglement is among the theory's most counter-intuitive predictions. When two quantum particles become entangled, measuring one immediately influences the state of the other, regardless of the distance between them. Einstein famously called this "spooky action at a distance" and considered it evidence that quantum mechanics must be incomplete. Decades of increasingly sophisticated experiments — most notably those of Alain Aspect in the 1980s and the Bell-test refinements that followed — have confirmed that entanglement is real and behaves exactly as quantum mechanics predicts.

[G] Despite its strangeness, quantum mechanics has produced extraordinary technological success. Lasers depend on stimulated emission, a quantum process. Semiconductor electronics — the basis of essentially all modern computing — operate by quantum tunnelling and band structure. Magnetic resonance imaging uses quantum spin alignment in nuclei. Atomic clocks rely on quantised electron transitions. Each of these technologies would be impossible without precise quantum predictions.

[H] Frontier work continues. Quantum computing aims to use entangled qubits for computational advantage on certain problem classes. Quantum cryptography exploits the measurement-collapse property to detect eavesdropping. Quantum sensing achieves measurement precision below classical limits in certain configurations. Whether and when these reach practical commercial scale remains uncertain. What is clear is that, more than a century after its founding insights, quantum mechanics continues to provide both engineering tools and unsolved philosophical puzzles in equal measure.`,
    questions: [
      { number: 1, type: "matching_headings", question_text: "Match heading to paragraph C: i) Heisenberg's uncertainty; ii) Particle-wave duality; iii) Frontier applications; iv) Schrödinger's wave function", correct_answer: "ii", explanation_vi: "Para C: double-slit + duality." },
      { number: 2, type: "matching_headings", question_text: "Match heading to paragraph F: i) Entanglement and Bell-test confirmation; ii) Origins in blackbody radiation; iii) Modern quantum computing; iv) Particle-wave duality", correct_answer: "i", explanation_vi: "Para F: entanglement + Aspect's experiments." },
      { number: 3, type: "matching_headings", question_text: "Match heading to paragraph G: i) Frontier work in computing and cryptography; ii) Technological successes; iii) Schrödinger's equation; iv) The uncertainty principle", correct_answer: "ii", explanation_vi: "Para G: lasers, semiconductors, MRI, atomic clocks — established successes, không phải frontier." },
      { number: 4, type: "true_false_not_given", question_text: "The ultraviolet catastrophe was a prediction confirmed by classical physics.", correct_answer: "False", explanation_vi: "Para B: classical predicted uniformly — but experiments contradicted it." },
      { number: 5, type: "true_false_not_given", question_text: "Planck proposed energy quanta in 1900.", correct_answer: "True", explanation_vi: "Para B." },
      { number: 6, type: "true_false_not_given", question_text: "The double-slit interference pattern persists when which slit a particle passed through is observed.", correct_answer: "False", explanation_vi: "Para C: 'interference disappears the moment one observes'." },
      { number: 7, type: "true_false_not_given", question_text: "Heisenberg's uncertainty principle is a measurement-equipment limitation.", correct_answer: "False", explanation_vi: "Para D: 'not a statement about measurement equipment'." },
      { number: 8, type: "true_false_not_given", question_text: "Einstein accepted entanglement as a complete description of reality.", correct_answer: "False", explanation_vi: "Para F: 'considered it evidence that quantum mechanics must be incomplete'." },
      { number: 9, type: "summary_completion", question_text: "Schrödinger's wave function ψ does not represent a physical quantity directly; its ____________ gives the ____________ of a measurement outcome.", correct_answer: "square, probability", explanation_vi: "Para E." },
      { number: 10, type: "sentence_completion", question_text: "Heisenberg's uncertainty product has a lower bound given by Planck's constant divided by ____________.", correct_answer: "4π / 4 pi", explanation_vi: "Para D." },
      { number: 11, type: "short_answer", question_text: "Which 1980s physicist's experiments helped confirm entanglement?", correct_answer: "Alain Aspect / Aspect", explanation_vi: "Para F." },
      { number: 12, type: "matching_information", question_text: "Which paragraph mentions atomic clocks and MRI as quantum-dependent technologies? (A/B/C/D/E/F/G/H)", correct_answer: "G", explanation_vi: "Para G." },
      { number: 13, type: "multiple_choice", question_text: "The closing paragraph characterises quantum mechanics as providing:", options: ["A) only engineering tools", "B) only philosophical puzzles", "C) both engineering tools and philosophical puzzles", "D) outdated theoretical machinery"], correct_answer: "C", explanation_vi: "Para H: 'engineering tools and unsolved philosophical puzzles in equal measure'." },
    ],
    vocabulary_focus: [
      { word: "macroscopic", ipa: "/ˌmæk.rəˈskɒp.ɪk/", vi_translation: "(quy mô) vĩ mô", band_level: 8, context_use: "Đối lập với 'microscopic / atomic-scale'." },
      { word: "discrete", ipa: "/dɪˈskriːt/", vi_translation: "rời rạc", band_level: 8, context_use: "'Discrete packets' — quanta là rời rạc, không liên tục." },
      { word: "duality", ipa: "/djuːˈæl.ə.ti/", vi_translation: "tính hai mặt", band_level: 8, context_use: "'Particle-wave duality' — vừa hạt vừa sóng." },
      { word: "interference", ipa: "/ˌɪn.təˈfɪər.əns/", vi_translation: "sự giao thoa (sóng)", band_level: 7, context_use: "'Interference patterns' — pattern of waves." },
      { word: "intrinsic", ipa: "/ɪnˈtrɪn.zɪk/", vi_translation: "(thuộc) bản chất, vốn có", band_level: 8, context_use: "'Intrinsic limit' — giới hạn bản chất, không phải kỹ thuật." },
      { word: "determinism", ipa: "/dɪˈtɜː.mɪ.nɪ.zəm/", vi_translation: "thuyết định mệnh / định luật", band_level: 9, context_use: "Triết học khoa học — vũ trụ predictable từ initial conditions." },
      { word: "entanglement", ipa: "/ɪnˈtæŋ.gəl.mənt/", vi_translation: "sự rối lượng tử", band_level: 9, context_use: "Quantum phenomenon — particles linked across distance." },
      { word: "qubit", ipa: "/ˈkjuː.bɪt/", vi_translation: "bit lượng tử", band_level: 9, context_use: "Quantum computing — đơn vị thông tin." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_TFNG,
      STRAT_LOCATE_PARAGRAPH,
      STRAT_TIMING,
      "Band 8.5 passages có jargon dày — không cần hiểu mọi từ. Tập trung vào câu trúc câu và keyword paraphrase.",
    ],
    common_mistakes_vi: [
      "Lẫn names: Planck (1900, quanta), Einstein (1905, photons), Heisenberg (1927, uncertainty), Schrödinger (1920s, wave function), Aspect (1980s, entanglement).",
      "TFNG sai: passage nói 'evidence that QM must be incomplete' = Einstein BELIEVED QM incomplete. Câu hỏi 'Einstein accepted entanglement as complete' → FALSE.",
      "Sentence completion: viết 'four pi' khi đề chấp nhận '4π' hoặc '4 pi'. Đọc instruction kỹ.",
    ],
    estimated_time_minutes: 20,
    difficulty_band: 8.5,
  },
];

// ─────────────────────────────────────────────────────────────────────
// Selectors + lookup helpers
// ─────────────────────────────────────────────────────────────────────

export const IELTS_READING_ITEMS: IELTSReadingItem[] = ALL_ITEMS;

export const IELTS_READING_BY_MODULE: Record<
  IELTSReadingModule,
  IELTSReadingItem[]
> = {
  academic: IELTS_READING_ITEMS.filter((i) => i.module === "academic"),
  general_training: IELTS_READING_ITEMS.filter(
    (i) => i.module === "general_training",
  ),
};

export function getIELTSReadingItemById(
  id: string,
): IELTSReadingItem | undefined {
  return IELTS_READING_ITEMS.find((i) => i.id === id);
}

/**
 * IELTS Reading raw-score → band conversion.
 * Source: public IELTS band-conversion guidance (idp.com / ielts.org).
 * Academic and General Training use different conversions because the
 * GT module is generally easier — GT requires more correct answers
 * to reach the same band.
 *
 * Both tables shown below assume a 40-question paper. Per-item
 * practice (13 questions) is pro-rated to 40 by the caller.
 */
export function readingRawToBand(raw: number, module: IELTSReadingModule): number {
  if (!Number.isFinite(raw)) return 0;
  const r = Math.max(0, Math.min(40, Math.round(raw)));
  if (module === "academic") {
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
    return 0;
  }
  // General Training — slightly higher raw needed for same band.
  if (r >= 40) return 9.0;
  if (r >= 39) return 8.5;
  if (r >= 37) return 8.0;
  if (r >= 36) return 7.5;
  if (r >= 34) return 7.0;
  if (r >= 32) return 6.5;
  if (r >= 30) return 6.0;
  if (r >= 27) return 5.5;
  if (r >= 23) return 5.0;
  if (r >= 19) return 4.5;
  if (r >= 15) return 4.0;
  return 0;
}
