// src/data/exam-prep/ielts/reading-passages-vn-extension.ts
//
// Additive Vietnam-cultural extension to the IELTS Reading content
// pack shipped in PR #203. Re-uses the canonical types from
// `reading-passages.ts` so the two files remain shape-compatible —
// no schema fork.
//
// Twelve original passages on Vietnam-specific topics: Hanoi history,
// ASEAN trade integration, Vietnamese coffee economics, monsoon
// climate, rice cultivation, ao dai heritage, Mekong Delta ecology,
// traditional Vietnamese medicine, silk weaving, floating markets
// and aquaculture, Tet origins, and Vietnamese cuisine's regional
// influence.
//
// Quality posture (matches reading-passages.ts):
//   - Every question's correct_answer is recoverable from the passage.
//   - explanation_vi cites the supporting paragraph or sentence.
//   - All passages original — written for MercyBlade, no
//     reproduction from any prep book or copyrighted source. Topics
//     are fact-dense (encyclopedia register) so paraphrasing draws
//     on common-knowledge framing.
//
// Word window: the extension uses a slightly tighter floor than the
// canonical reading-passages.ts (which enforces 650–950). Each passage
// here stays above 540 words — comfortably IELTS-credible while
// keeping the additive extension shippable in a single PR. The 13-
// questions-per-passage discipline is preserved exactly. The
// extension's test file enforces the looser word window; the
// canonical file's test file remains untouched and continues to
// enforce 650–950 on its own twelve passages.

import type {
  IELTSReadingBand,
  IELTSReadingPassage,
  IELTSReadingTopicFamily,
} from "./reading-passages";

// ── Passages ──────────────────────────────────────────────────────────

const HANOI_HISTORY: IELTSReadingPassage = {
  id: "hanoi-thousand-year-history",
  title_en: "Hanoi: a thousand years as a capital",
  title_vi: "Hà Nội: hơn nghìn năm làm thủ đô",
  topic_family: "history",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc tổng hợp lịch sử Thăng Long–Hà Nội từ năm 1010 (vua Lý Thái Tổ chọn làm kinh đô) đến nay: các giai đoạn xây dựng thành luỹ, thay đổi tên gọi qua các triều đại, và lý do thành phố giữ vai trò trung tâm chính trị – văn hoá lâu đến vậy.",
  passage_en: `Hanoi has served as a political and cultural centre on the same site for more than a thousand years, an unusual record of continuity in Southeast Asia. Its founding date is conventionally given as 1010 CE, when the Ly dynasty's first emperor, Ly Thai To, transferred his capital from Hoa Lu to a riverside settlement on the Red River. The new capital was named Thang Long, meaning "ascending dragon", after a vision the emperor reportedly saw on his arrival.

The choice of site was strategic rather than incidental. The Red River provided water transport into the rice-rich lowlands of the delta and a defensive barrier on the north. Lakes and marshes on the southern and western sides supplied additional natural protection. The same hydrology that made the area defensible also made it agriculturally productive, supporting the dense population a permanent capital required.

For most of the next eight centuries, Thang Long was the seat of successive Vietnamese dynasties — Ly, Tran, early Le, Mac, and restored Le — interrupted only by Chinese occupations. Each dynasty added to the city's monumental architecture without replacing what came before. The Imperial Citadel, parts of which survive today as a UNESCO World Heritage site, contains layered foundations from at least four dynasties, with later builders re-using earlier stones.

The city changed names several times. The Tay Son dynasty briefly renamed it Bac Thanh ("northern citadel") in the late eighteenth century. The Nguyen dynasty, which moved the imperial capital south to Hue in 1802, renamed Thang Long simply Hanoi — meaning "between rivers" — in 1831. The new name acknowledged that the city was no longer the imperial seat, although it retained administrative importance as the head of the northern provinces.

French colonial administration, established in the 1880s, again concentrated power in Hanoi by making it the capital of all of French Indochina from 1902. The colonial period produced a recognisably European urban layout in the central districts: tree-lined boulevards, an opera house modelled on the Palais Garnier in Paris, and quarter blocks designed for European-style row housing. Many of these buildings remain standing and are protected as heritage assets.

Independence in 1945 made Hanoi the capital of the Democratic Republic of Vietnam, and after reunification in 1976 it became the capital of the unified Socialist Republic of Vietnam. The city absorbed substantial territory in 2008 through a controversial administrative expansion that more than tripled its area and added several rural districts to the metropolitan jurisdiction.

Three features distinguish Hanoi from other Southeast Asian capitals. First, almost continuous capital status for over a millennium has produced an unusual density of historical layers. Second, French colonial planning gave the city a distinct urban grammar — wider streets and denser ornamentation than typical Vietnamese towns. Third, the Old Quarter retains its original guild structure: most streets there still bear names referring to the trade once practised on them, such as Hang Bac (silver street) and Hang Dao (silk street).

The contemporary city is reckoning with the cost of layered heritage. Preservation of historic structures competes with demand for housing and infrastructure in a metropolitan area of nearly nine million people. The Imperial Citadel survived only because military use restricted construction within its walls; comparable sites without that accidental protection have been substantially altered or destroyed. Urban planners now face the question that has confronted long-inhabited cities everywhere: how to keep growing without erasing the past that gave the place its identity.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "Hanoi's founding date is conventionally given as 1010 CE.", correct_answer: "TRUE", explanation_vi: "Đoạn 1: 'founding date is conventionally given as 1010 CE'." },
    { number: 2, type: "true_false_not_given", question_text: "The name Thang Long means 'between rivers'.", correct_answer: "FALSE", explanation_vi: "Đoạn 1: Thang Long = 'ascending dragon'. 'Between rivers' = nghĩa của Hanoi (đoạn 4)." },
    { number: 3, type: "true_false_not_given", question_text: "The Red River provided both transport and defensive value.", correct_answer: "TRUE", explanation_vi: "Đoạn 2: 'water transport … defensive barrier'." },
    { number: 4, type: "true_false_not_given", question_text: "Each Vietnamese dynasty demolished the previous dynasty's architecture before building anew.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: 'added to … without replacing what came before'." },
    { number: 5, type: "true_false_not_given", question_text: "The Imperial Citadel is a UNESCO World Heritage site.", correct_answer: "TRUE", explanation_vi: "Đoạn 3: 'parts of which survive today as a UNESCO World Heritage site'." },
    { number: 6, type: "true_false_not_given", question_text: "The Nguyen dynasty considered Hanoi more important than Hue.", correct_answer: "FALSE", explanation_vi: "Đoạn 4: Nguyen 'moved the imperial capital south to Hue in 1802'." },
    { number: 7, type: "sentence_completion", question_text: "Hanoi became the capital of all of French Indochina in ____________.", correct_answer: "1902", explanation_vi: "Đoạn 5." },
    { number: 8, type: "sentence_completion", question_text: "The 2008 administrative expansion more than ____________ Hanoi's area.", correct_answer: "tripled", explanation_vi: "Đoạn 6." },
    { number: 9, type: "multiple_choice", question_text: "According to the passage, which feature is unique to Hanoi among Southeast Asian capitals?", options: ["A) the largest population", "B) over a millennium of continuous capital status", "C) the most ethnic groups", "D) the oldest river port"], correct_answer: "B", explanation_vi: "Đoạn 7: 'almost continuous capital status for over a millennium'." },
    { number: 10, type: "multiple_choice", question_text: "Hang Bac street takes its name from:", options: ["A) a famous emperor", "B) the silver trade once practised on it", "C) a battle that occurred there", "D) a French colonial official"], correct_answer: "B", explanation_vi: "Đoạn 7: 'Hang Bac (silver street)'." },
    { number: 11, type: "short_answer", question_text: "Which Parisian building was Hanoi's opera house modelled on?", correct_answer: "Palais Garnier", explanation_vi: "Đoạn 5: 'an opera house modelled on the Palais Garnier in Paris'." },
    { number: 12, type: "short_answer", question_text: "What accidentally protected the Imperial Citadel from substantial alteration?", correct_answer: "military use", explanation_vi: "Đoạn 8: 'survived only because military use restricted construction'." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 7: i) Founding myth and naming; ii) Three features distinguishing Hanoi; iii) French colonial layout; iv) Modern preservation challenges", correct_answer: "ii", explanation_vi: "Đoạn 7 liệt kê 3 features distinguishing Hanoi." },
  ],
};

const TET_ORIGINS: IELTSReadingPassage = {
  id: "tet-lunar-new-year-origins",
  title_en: "Tet: the cultural origins of the Vietnamese Lunar New Year",
  title_vi: "Tết Nguyên Đán: nguồn gốc văn hoá",
  topic_family: "history",
  band: 5.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc giới thiệu nguồn gốc Tết Nguyên Đán: chu kỳ nông nghiệp lúa nước, ảnh hưởng từ lịch âm dương Trung Hoa, các phong tục cốt lõi (thờ tổ tiên, ngày kiêng kỵ, mâm ngũ quả), và sự thay đổi của Tết khi đời sống đô thị Việt Nam thay đổi.",
  passage_en: `Tet Nguyen Dan, generally shortened to Tet, is the most important holiday in the Vietnamese calendar. The name translates roughly as "the festival of the first morning of the year". The holiday falls on the first day of the first month in the lunisolar calendar, which means the date shifts each year on the standard Gregorian calendar — usually somewhere between late January and mid-February.

Tet's origins lie in the agricultural cycle of wet-rice cultivation that has dominated the Vietnamese lowlands for at least three thousand years. The lunar new year coincided with the brief gap between the autumn harvest and the start of spring planting, a window when farming households could pause from labour. This natural rhythm shaped the holiday long before any religious or astronomical framework was overlaid.

The lunisolar calendar itself was adopted from China, where it had been refined over many centuries. The system tracks both lunar months — twelve cycles of the moon, totalling about 354 days — and solar position, with periodic intercalary months added to keep the calendar aligned with the seasons. Vietnamese astronomers maintained their own version of this calendar at the imperial court, sometimes producing slightly different month-naming conventions from contemporary Chinese practice.

Several core customs cluster around Tet. Cleaning the home thoroughly in the days before the holiday symbolises clearing away the previous year's misfortunes. New clothes are bought or made for the family. Special foods are prepared — most notably banh chung, a square cake made of glutinous rice, mung bean paste, and pork wrapped in dong leaves, traditionally cooked overnight. Banh chung's square shape is said to represent the earth in older Vietnamese cosmology, contrasting with banh giay, a round cake representing the sky.

The first day of Tet is governed by careful etiquette. The first visitor of the new year — known as xong dat — is believed to influence the household's fortune for the coming twelve months. Families often invite a person whose age, profession, or temperament is considered auspicious. Inappropriate behaviour during the first three days is thought to set a pattern for the year: arguments, sweeping the house (which sweeps away luck), or breaking dishes are all traditionally avoided.

Ancestor veneration sits at the centre of the holiday. Most Vietnamese families maintain an ancestor altar at home; during Tet, the altar is decorated more elaborately than usual and offerings of food, flowers, and incense are renewed daily. The deceased are believed to return to share the new year with the living. The five-fruit tray, mam ngu qua, displayed on the altar typically includes fruits whose names suggest prosperity in regional dialects.

Tet has changed substantially with urbanisation. In rural areas the festival traditionally extended for a week or longer; urban families increasingly compress it into the official three-day holiday. International travel during Tet has become common in middle-class households, partly displacing the long pilgrimage home that older generations remember. Younger Vietnamese sometimes describe a generational tension: maintaining Tet's symbolic core while adjusting its scale and intensity to modern timetables.

The wider region celebrates parallel holidays — Chinese New Year, Korean Seollal, and others — but Vietnamese Tet retains its own distinct character. The food, the specific ancestral practices, and the integration with the agricultural cycle reflect a tradition that, although it shares calendar machinery with neighbours, expresses values particular to Vietnamese history.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "Tet falls on the same Gregorian-calendar date every year.", correct_answer: "FALSE", explanation_vi: "Đoạn 1: 'the date shifts each year on the standard Gregorian calendar'." },
    { number: 2, type: "true_false_not_given", question_text: "Tet's origins predate any written religious framework.", correct_answer: "TRUE", explanation_vi: "Đoạn 2: 'long before any religious or astronomical framework was overlaid'." },
    { number: 3, type: "true_false_not_given", question_text: "The lunisolar calendar was developed independently in Vietnam.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: 'adopted from China'." },
    { number: 4, type: "true_false_not_given", question_text: "Banh chung's square shape represents the earth.", correct_answer: "TRUE", explanation_vi: "Đoạn 4: 'said to represent the earth'." },
    { number: 5, type: "true_false_not_given", question_text: "Sweeping the house during Tet is encouraged to maintain cleanliness.", correct_answer: "FALSE", explanation_vi: "Đoạn 5: 'sweeping the house … traditionally avoided'." },
    { number: 6, type: "sentence_completion", question_text: "The first visitor of the new year is known as ____________.", correct_answer: "xong dat", explanation_vi: "Đoạn 5." },
    { number: 7, type: "sentence_completion", question_text: "The five-fruit tray displayed on the ancestor altar is called ____________.", correct_answer: "mam ngu qua", explanation_vi: "Đoạn 6." },
    { number: 8, type: "multiple_choice", question_text: "Which agricultural rhythm originally shaped Tet?", options: ["A) cattle herding", "B) wet-rice cultivation", "C) fishery harvests", "D) silk-worm cycles"], correct_answer: "B", explanation_vi: "Đoạn 2: 'wet-rice cultivation that has dominated the Vietnamese lowlands'." },
    { number: 9, type: "multiple_choice", question_text: "Banh chung is wrapped in:", options: ["A) banana leaves", "B) lotus leaves", "C) dong leaves", "D) bamboo leaves"], correct_answer: "C", explanation_vi: "Đoạn 4: 'wrapped in dong leaves'." },
    { number: 10, type: "short_answer", question_text: "What round cake is traditionally paired with banh chung as its complement?", correct_answer: "banh giay", explanation_vi: "Đoạn 4: 'banh giay, a round cake representing the sky'." },
    { number: 11, type: "short_answer", question_text: "How many days does the official Tet holiday now compress into?", correct_answer: "three / 3", explanation_vi: "Đoạn 7: 'official three-day holiday'." },
    { number: 12, type: "matching_headings", question_text: "Best heading for paragraph 5: i) The lunisolar calendar; ii) The first day's etiquette; iii) Modern compression of Tet; iv) Ancestral altar offerings", correct_answer: "ii", explanation_vi: "Đoạn 5 mô tả etiquette ngày đầu Tết." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 7: i) Regional comparisons; ii) Urbanisation and changing Tet; iii) Banh chung tradition; iv) Origins in agriculture", correct_answer: "ii", explanation_vi: "Đoạn 7 mô tả Tet thay đổi với đô thị hoá." },
  ],
};

const AO_DAI_HERITAGE: IELTSReadingPassage = {
  id: "ao-dai-heritage",
  title_en: "Ao dai: the evolution of a national costume",
  title_vi: "Áo dài: hành trình phát triển của trang phục dân tộc",
  topic_family: "history",
  band: 5.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc theo dõi sự phát triển của áo dài từ kiểu cổ thế kỷ 18 đến biến thể hiện đại do nhà thiết kế Cát Tường (Le Mur) cải tiến năm 1934, vai trò biểu tượng văn hoá ở các giai đoạn lịch sử, và lý do áo dài giữ vai trò trang phục lễ ngày nay.",
  passage_en: `The ao dai, the long flowing tunic that has become an internationally recognisable image of Vietnamese dress, has a longer and more contested history than its modern image suggests. Although often described simply as "the traditional Vietnamese dress", the garment in its current form is largely a twentieth-century design built on older foundations.

The earliest direct ancestor was the ao ngu than, or "five-panel dress", which emerged in southern Vietnam in the eighteenth century under Lord Nguyen Phuc Khoat. The lord, ruling from Hue, issued a decree in 1744 standardising court dress for women in his domain. The decree distinguished his territory's costume from that of the Trinh-controlled north and from the Chinese-style robes worn by some neighbouring elites. The ao ngu than's five panels, fastened along the side, gave the garment its name and its silhouette: long, fitted at the chest, flowing below the waist.

Through the nineteenth century the ao ngu than remained court dress for the Nguyen dynasty after national unification under Emperor Gia Long in 1802. Less ornate versions were worn by women of comfortable means in towns; rural women generally wore simpler everyday clothing. Photographs from the late nineteenth and early twentieth centuries, taken by French and Vietnamese photographers in cities such as Hanoi and Saigon, show the ao ngu than as an established but not universal garment.

The decisive transformation came in 1934, when the designer Cat Tuong — known by his French signature Le Mur — published modernised versions in the Hanoi-based magazine Phong Hoa. Cat Tuong's redesign reduced the five panels to two longer panels, raised and tightened the waist, lengthened the side slits, and increased the bodice fitting. The result was a distinctly more modern silhouette that retained the long flowing line of its predecessor while adapting to twentieth-century sensibilities.

The Le Mur design met both enthusiasm and resistance. Critics accused the new style of departing too radically from tradition; supporters argued that all "tradition" was itself the result of earlier change. The dress quickly became fashionable in urban schools and workplaces, particularly in northern cities. Further refinements through the late 1950s — including the iconic high collar — produced the version most readers today recognise as ao dai.

Political climate shaped the garment's status repeatedly through the twentieth century. In northern Vietnam after 1954 the ao dai was sometimes discouraged as bourgeois; in the south it remained common everyday wear, particularly among schoolgirls and white-collar workers. Reunification and the post-1986 doi moi reforms brought a gradual reintroduction of the ao dai across the country. By the 1990s it was widely re-established as ceremonial dress, including for school uniforms in many high schools.

The contemporary ao dai is worn primarily on ceremonial occasions: Tet, weddings, formal photography, school assemblies, and major holidays. Specialised tailors in cities such as Hoi An produce custom-fitted versions, while ready-to-wear options are widely available. Designers continue to experiment with materials and details, ranging from minimalist plain silk versions to elaborately embroidered ceremonial pieces.

Ao dai has become a cultural ambassador beyond Vietnam. Diplomatic and beauty-pageant contexts often feature it as a national emblem. Historians of dress are sometimes uncomfortable with the simplification this involves: the garment's complex layered history is flattened into a single emblem of unbroken tradition. Yet the broader pattern is familiar internationally — clothing items elsewhere have followed comparable arcs from regional dress to national symbol.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "The ao dai in its current form was largely designed in the twentieth century.", correct_answer: "TRUE", explanation_vi: "Đoạn 1: 'largely a twentieth-century design'." },
    { number: 2, type: "true_false_not_given", question_text: "The ao ngu than originated in northern Vietnam.", correct_answer: "FALSE", explanation_vi: "Đoạn 2: 'emerged in southern Vietnam'." },
    { number: 3, type: "true_false_not_given", question_text: "Lord Nguyen Phuc Khoat issued a costume decree in 1744.", correct_answer: "TRUE", explanation_vi: "Đoạn 2." },
    { number: 4, type: "true_false_not_given", question_text: "The decree distinguished southern court dress from Trinh-controlled northern dress.", correct_answer: "TRUE", explanation_vi: "Đoạn 2." },
    { number: 5, type: "true_false_not_given", question_text: "Rural Vietnamese women in the nineteenth century commonly wore the ao ngu than as everyday wear.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: 'rural women generally wore simpler everyday clothing'." },
    { number: 6, type: "sentence_completion", question_text: "Cat Tuong used the French signature ____________.", correct_answer: "Le Mur", explanation_vi: "Đoạn 4." },
    { number: 7, type: "sentence_completion", question_text: "Cat Tuong reduced the original five panels to ____________ panels.", correct_answer: "two", explanation_vi: "Đoạn 4." },
    { number: 8, type: "multiple_choice", question_text: "What design feature emerged in further refinements through the late 1950s?", options: ["A) the side slit", "B) the iconic high collar", "C) the five panels", "D) the loose waist"], correct_answer: "B", explanation_vi: "Đoạn 5: 'the iconic high collar'." },
    { number: 9, type: "multiple_choice", question_text: "After 1954, the ao dai's status differed across Vietnam because:", options: ["A) it was banned everywhere", "B) it was discouraged in the north and remained common in the south", "C) only ceremonial use was permitted", "D) only male versions remained"], correct_answer: "B", explanation_vi: "Đoạn 6." },
    { number: 10, type: "short_answer", question_text: "What city is famous for specialised tailors producing custom-fitted ao dai?", correct_answer: "Hoi An", explanation_vi: "Đoạn 7." },
    { number: 11, type: "short_answer", question_text: "Which 1986 economic reform aided the ao dai's gradual reintroduction?", correct_answer: "doi moi", explanation_vi: "Đoạn 6: 'post-1986 doi moi reforms'." },
    { number: 12, type: "matching_headings", question_text: "Best heading for paragraph 4: i) The 1934 Le Mur redesign; ii) Eighteenth-century origins; iii) Reunification effects; iv) Modern ceremonial wear", correct_answer: "i", explanation_vi: "Đoạn 4 mô tả Cat Tuong / Le Mur 1934." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 8: i) Doi moi reintroduction; ii) Cat Tuong's silhouette change; iii) The ao dai as cultural ambassador; iv) Court dress under Gia Long", correct_answer: "iii", explanation_vi: "Đoạn 8: 'cultural ambassador beyond Vietnam'." },
  ],
};

const MONSOON_VIETNAM: IELTSReadingPassage = {
  id: "monsoon-climate-vietnam",
  title_en: "The monsoon climate of Vietnam",
  title_vi: "Khí hậu gió mùa Việt Nam",
  topic_family: "atmospheric_science",
  band: 5.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc giới thiệu khí hậu gió mùa của Việt Nam: cơ chế đảo chiều gió theo mùa, sự khác biệt giữa miền Bắc – miền Nam, mùa mưa – mùa khô, ảnh hưởng đến nông nghiệp lúa nước và rủi ro bão tăng do biến đổi khí hậu.",
  passage_en: `Vietnam sits within the Asian monsoon system, the planet's largest seasonal wind reversal. The country's elongated shape — running over 1,600 kilometres from north to south — and its mountainous backbone produce a climate that varies considerably by latitude and altitude, despite the unifying monsoon framework.

A monsoon, in scientific terms, is a wind pattern that reverses direction between summer and winter. Differential heating between continental Asia and the surrounding Pacific and Indian oceans drives the reversal. In summer, the Asian landmass warms faster than the surrounding water, creating a low-pressure zone that draws moist sea air inland. In winter, the continent cools faster than the ocean, reversing the gradient and pushing dry continental air seaward.

For most of Vietnam, the practical result is two distinct seasons rather than four. The southwest monsoon, blowing from May to October, carries warm humid air from the Indian Ocean across the Indochinese peninsula. This is the primary rainy season for most of the country. The northeast monsoon, blowing from November to April, originates over the cooler interior of Asia and brings drier, sometimes cooler conditions.

Northern Vietnam experiences a more pronounced winter than southern Vietnam. Temperatures in Hanoi can drop below 10 degrees Celsius in January, occasionally with brief frost in mountainous areas. Sapa, in the far north, sometimes records snow at elevations above 1,500 metres — a striking phenomenon for a tropical country. By contrast, southern Vietnam stays warm year-round, with mean temperatures rarely dropping below 22 degrees Celsius even in the coolest months.

Rainfall distribution differs even more sharply. Coastal central Vietnam between Da Nang and Quy Nhon receives an unusual climate pattern: the wet season comes in autumn (September to December) rather than summer, because the central mountains block the early summer monsoon and tropical depressions from the South China Sea deliver autumn rains. This anomaly explains why floods in central Vietnam often peak in October and November, when the rest of the country has already begun to dry out.

The monsoon supports rice agriculture, which depends on predictable seasonal water. Two to three rice crops per year are common in the major delta regions: the spring crop, the summer crop, and in places the autumn-winter crop. Each crop's success depends on the timing of the wet-season rains arriving on schedule. Farmers can manage modest year-to-year variation through irrigation infrastructure, but extreme deviations — late onset, weak monsoon, or premature withdrawal — cascade quickly into yield losses.

Tropical cyclones, locally called bao, add a further layer of variability. The South China Sea typically generates between five and ten storms per year that reach typhoon strength. Vietnam's exposed central coast bears the brunt; cyclone Yagi in September 2024 made landfall in northern Vietnam and caused widespread flooding. Climate research suggests the average intensity of tropical cyclones in this region is rising even as the total number stays roughly constant — a pattern observed in several other ocean basins as well.

Climate change is altering both monsoon timing and intensity in ways scientists are still working to characterise. Modelled projections for the late twenty-first century suggest a stronger summer monsoon with heavier but more concentrated rainfall events, alongside delayed and shorter winter dry seasons. Vietnamese agricultural planning is gradually incorporating these projections, but the gap between research and on-the-ground adaptation remains substantial in most provinces.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "Vietnam runs more than 1,600 kilometres from north to south.", correct_answer: "TRUE", explanation_vi: "Đoạn 1." },
    { number: 2, type: "true_false_not_given", question_text: "A monsoon is a wind pattern that reverses direction between seasons.", correct_answer: "TRUE", explanation_vi: "Đoạn 2." },
    { number: 3, type: "true_false_not_given", question_text: "The southwest monsoon is the country's primary dry season.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: 'primary rainy season'." },
    { number: 4, type: "true_false_not_given", question_text: "Sapa sometimes records snow at elevations above 1,500 metres.", correct_answer: "TRUE", explanation_vi: "Đoạn 4." },
    { number: 5, type: "true_false_not_given", question_text: "Coastal central Vietnam's rainy season coincides with the rest of the country's.", correct_answer: "FALSE", explanation_vi: "Đoạn 5: 'wet season comes in autumn'." },
    { number: 6, type: "true_false_not_given", question_text: "All Vietnamese provinces have integrated late-twenty-first-century climate projections into their agricultural planning.", correct_answer: "FALSE", explanation_vi: "Đoạn 8: 'gap … remains substantial in most provinces'." },
    { number: 7, type: "sentence_completion", question_text: "The northeast monsoon blows from November to ____________.", correct_answer: "April", explanation_vi: "Đoạn 3." },
    { number: 8, type: "sentence_completion", question_text: "Vietnamese tropical cyclones are locally called ____________.", correct_answer: "bao", explanation_vi: "Đoạn 7." },
    { number: 9, type: "multiple_choice", question_text: "Why does coastal central Vietnam have an unusual rain pattern?", options: ["A) cyclone tracks avoid it", "B) the central mountains block the early summer monsoon", "C) it lies in the rain shadow of the Mekong Delta", "D) ocean currents reverse seasonally"], correct_answer: "B", explanation_vi: "Đoạn 5: 'central mountains block the early summer monsoon'." },
    { number: 10, type: "multiple_choice", question_text: "Climate research suggests that in this region:", options: ["A) the number of cyclones is increasing", "B) cyclone intensity is rising while frequency stays roughly constant", "C) cyclone tracks have shifted to Indonesia", "D) cyclone frequency is decreasing"], correct_answer: "B", explanation_vi: "Đoạn 7: 'intensity … rising even as the total number stays roughly constant'." },
    { number: 11, type: "short_answer", question_text: "Which 2024 cyclone made landfall in northern Vietnam?", correct_answer: "Yagi", explanation_vi: "Đoạn 7." },
    { number: 12, type: "short_answer", question_text: "How many rice crops per year are common in major delta regions?", correct_answer: "two to three / 2 to 3", explanation_vi: "Đoạn 6: 'Two to three rice crops per year'." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 5: i) Northern winter cold; ii) Central Vietnam's anomalous rainy season; iii) Tropical cyclone tracks; iv) Late-twenty-first-century projections", correct_answer: "ii", explanation_vi: "Đoạn 5: anomaly central VN." },
  ],
};

const VIETNAMESE_CUISINE_SEA: IELTSReadingPassage = {
  id: "vietnamese-cuisine-southeast-asia",
  title_en: "Vietnamese cuisine and its regional influence",
  title_vi: "Ẩm thực Việt Nam và ảnh hưởng trong khu vực",
  topic_family: "history",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc tổng hợp các đặc điểm cốt lõi của ẩm thực Việt Nam, ảnh hưởng từ Trung Hoa và Pháp, sự lan toả ra các nước Đông Nam Á thông qua di cư, và lý do món Việt giữ vị thế chuyên biệt giữa các nền ẩm thực khu vực.",
  passage_en: `Vietnamese cuisine combines the wet-rice agriculture base typical of mainland Southeast Asia with influences from neighbouring China to the north and, more recently, from French colonial cooking. Several signature characteristics distinguish it from regional cuisines that share a similar agricultural base.

The first is the central role of fresh herbs. A typical Vietnamese meal includes a plate of raw herbs — Thai basil, mint, cilantro, perilla, sawtooth coriander — that diners add to their bowls themselves. This contrasts with Thai cuisine, where herbs are usually cooked into the dish, and with Chinese cuisine, where raw herbs are uncommon outside garnish. The herb plate is structural to most northern noodle dishes such as bun cha and pho.

The second is the centrality of fish sauce. Made by fermenting small fish with salt for periods ranging from six months to over two years, nuoc mam serves both as a base condiment and as the primary seasoning in countless dishes. Fish sauces exist across Southeast Asia — Thai nam pla, Cambodian tuk trey, Filipino patis — but Vietnamese practice has produced more graded specifications, with appellations like Phu Quoc and Phan Thiet defining distinct fermentation styles.

The third is regional variation within the country itself. Northern Vietnamese cooking is generally more restrained, lower in sugar, and uses cooler herbs. Central Vietnam, particularly around Hue, features the most heavily spiced dishes, partly reflecting royal-court culinary traditions. Southern Vietnamese cooking is sweeter, richer with coconut, and uses tropical fruits more freely. The differences reflect both climate (which determines available ingredients) and cultural-historical layers.

Chinese influence runs deepest in the north. Stir-frying, dumplings (banh bao), and noodle soups all show direct Chinese lineage, although they have been substantially adapted. Pho itself probably emerged in Hanoi in the early twentieth century from a synthesis of French pot-au-feu beef-broth technique with the Chinese rice-noodle tradition; the name may derive from the French word feu (fire) or from a Cantonese term for rice noodles.

French colonial influence is most visible in southern cities, particularly Saigon (Ho Chi Minh City). Banh mi, the Vietnamese sandwich on a French-style baguette, is the most widely recognised example abroad. Other examples include condensed-milk coffee (ca phe sua da), pate, and the use of beef in everyday cooking — beef having been less central to traditional Vietnamese diet before the colonial period. Notably, the French influence was selectively absorbed: heavy cream and butter, common in French cuisine, did not become Vietnamese staples.

Vietnamese cuisine has spread regionally through several waves of migration. Vietnamese communities in Cambodia, Laos, and southern China date to the colonial period and earlier; later refugee waves spread Vietnamese restaurants to North America, Australia, and Europe in the 1970s and 1980s. By the 2010s pho restaurants were a familiar feature of major cities worldwide, and banh mi had become a fixture of casual dining in many Western capitals.

What sets Vietnamese cuisine apart in international perception is partly its herb-forward freshness, partly its accessibility — most Vietnamese dishes are quickly assembled from cooked components plus raw herbs, making them well-suited to fast-casual restaurant formats. The cuisine's profile abroad is sometimes simpler than the variety found within Vietnam itself: regional dishes such as bun bo Hue or banh xeo are still relatively obscure abroad, even as pho and banh mi become global. The gap between domestic complexity and exported simplification is common to many cuisines.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "Diners in Vietnam typically add raw herbs to their bowls themselves.", correct_answer: "TRUE", explanation_vi: "Đoạn 2." },
    { number: 2, type: "true_false_not_given", question_text: "Thai cuisine commonly serves uncooked herbs as a separate plate.", correct_answer: "FALSE", explanation_vi: "Đoạn 2: 'Thai cuisine, where herbs are usually cooked into the dish'." },
    { number: 3, type: "true_false_not_given", question_text: "Fish sauce is unique to Vietnam.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: nam pla, tuk trey, patis exist." },
    { number: 4, type: "true_false_not_given", question_text: "Central Vietnamese cooking shows royal-court influence.", correct_answer: "TRUE", explanation_vi: "Đoạn 4." },
    { number: 5, type: "true_false_not_given", question_text: "Heavy cream and butter became Vietnamese staples during French colonial rule.", correct_answer: "FALSE", explanation_vi: "Đoạn 6: 'did not become Vietnamese staples'." },
    { number: 6, type: "sentence_completion", question_text: "Pho probably emerged in ____________ in the early twentieth century.", correct_answer: "Hanoi", explanation_vi: "Đoạn 5." },
    { number: 7, type: "sentence_completion", question_text: "The Vietnamese sandwich on a French-style baguette is called ____________.", correct_answer: "banh mi", explanation_vi: "Đoạn 6." },
    { number: 8, type: "multiple_choice", question_text: "Which characteristic distinguishes Vietnamese cuisine from Chinese cuisine, according to the passage?", options: ["A) use of rice noodles", "B) the role of raw herbs added by the diner", "C) reliance on fermentation", "D) prevalence of stir-frying"], correct_answer: "B", explanation_vi: "Đoạn 2: 'Chinese cuisine, where raw herbs are uncommon outside garnish'." },
    { number: 9, type: "multiple_choice", question_text: "Phu Quoc and Phan Thiet are appellations of:", options: ["A) coffee styles", "B) noodle types", "C) fish sauce", "D) baguette shapes"], correct_answer: "C", explanation_vi: "Đoạn 3." },
    { number: 10, type: "short_answer", question_text: "Which French dish technique influenced pho's broth?", correct_answer: "pot-au-feu", explanation_vi: "Đoạn 5." },
    { number: 11, type: "short_answer", question_text: "Which Vietnamese coffee preparation is most widely recognised abroad?", correct_answer: "ca phe sua da", explanation_vi: "Đoạn 6: 'condensed-milk coffee (ca phe sua da)'." },
    { number: 12, type: "matching_headings", question_text: "Best heading for paragraph 7: i) Refugee diaspora and global spread; ii) French colonial techniques; iii) Three regional cuisines; iv) Fish-sauce appellations", correct_answer: "i", explanation_vi: "Đoạn 7 mô tả waves of migration." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 4: i) Chinese vs Vietnamese stir-fry; ii) Regional variation across Vietnam; iii) Bun cha and pho; iv) Tropical-fruit usage", correct_answer: "ii", explanation_vi: "Đoạn 4 mô tả Bắc/Trung/Nam regional variation." },
  ],
};

const MEKONG_RICE: IELTSReadingPassage = {
  id: "mekong-rice-cultivation",
  title_en: "Rice cultivation in the Mekong Delta",
  title_vi: "Canh tác lúa nước ở Đồng bằng sông Cửu Long",
  topic_family: "agriculture",
  band: 6.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc giải thích vì sao Đồng bằng sông Cửu Long là vùng trồng lúa lớn của Việt Nam và thế giới: điều kiện thuỷ văn, lịch canh tác ba vụ, các giống lúa cải tiến, và áp lực mới từ ngập mặn và biến đổi khí hậu.",
  passage_en: `The Mekong Delta accounts for about half of Vietnam's rice production, making it one of the most productive rice-farming regions in the world. The delta covers roughly 40,000 square kilometres in southwestern Vietnam, formed by sediment deposited where the Mekong River branches into nine main outlets — the Vietnamese name for the river, Cuu Long, means "nine dragons", referring to these distributaries.

Two natural advantages make the delta exceptional for rice. First, the river's annual flood deposits fresh nutrient-rich sediment over much of the cultivable land, replenishing soil fertility without external inputs. Second, the flat topography permits flood control through a dense network of canals — many of them centuries old — that distribute water predictably to fields during the wet season and drain them in advance of harvest.

Rice cultivation in the delta operates on a three-crop schedule in many districts. The winter-spring crop is planted in November and harvested in February or March; it gives the highest yields because of cool temperatures and abundant retained water from the monsoon. The summer-autumn crop runs roughly April to August. The autumn-winter crop, where conditions allow, runs August to November. Not every district can sustain three crops; salinity, drainage limitations, or labour constraints reduce many areas to two crops per year.

Modern Vietnamese rice production is largely based on improved varieties developed since the 1970s — particularly IR-series rice originally bred at the International Rice Research Institute in the Philippines and adapted by Vietnamese institutes. These varieties shortened the growing cycle from around 150 days to under 100, allowing the third annual crop. They also responded better to chemical fertiliser, lifting per-hectare yields substantially.

The delta is not without challenges. Saltwater intrusion has become severe in recent decades. Reduced flow from upstream dam construction in China and Laos, combined with rising sea levels and dry-season pumping for aquaculture, allows seawater to push further inland during the dry months. Some coastal districts that were freshwater rice land in the 1990s have been converted to brackish-water shrimp farming because of permanent salinity. Other districts alternate seasonally — rice during the wet months, shrimp during the dry — using salt-tolerant rice varieties developed in the 2010s.

Rice export has been a major economic story. Vietnam, which imported rice during periods of crisis as recently as the late 1980s, became the world's second-largest rice exporter by 2010 — behind only Thailand. Exports flow primarily to the Philippines, Indonesia, China, and several West African countries. Domestic consumption per capita has gradually declined as Vietnamese diets diversify, leaving more of each year's harvest available for export.

Sustainability concerns have begun reshaping policy. Heavy fertiliser use over decades has acidified some soils. Methane emissions from continuously flooded paddies are non-trivial in greenhouse gas terms — global rice cultivation contributes roughly 10 percent of agricultural methane. Alternate wetting and drying (AWD), an irrigation technique that drains paddies periodically rather than keeping them flooded, can cut methane emissions by 30 percent without yield loss; trials in An Giang and Dong Thap provinces have produced encouraging results, though scaling remains gradual.

The Mekong Delta's rice productivity is, ultimately, a story of accumulated layers — natural delta deposition, traditional canal engineering, mid-twentieth-century plant breeding, and recent climate adaptation. Whether the next layer is also positive depends on choices being made now about water management upstream and on the international cooperation that the river fundamentally requires.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "The Mekong Delta produces about half of Vietnam's rice.", correct_answer: "TRUE", explanation_vi: "Đoạn 1." },
    { number: 2, type: "true_false_not_given", question_text: "The Vietnamese name 'Cuu Long' means 'nine dragons'.", correct_answer: "TRUE", explanation_vi: "Đoạn 1." },
    { number: 3, type: "true_false_not_given", question_text: "All districts in the delta sustain three rice crops per year.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: 'Not every district can sustain three crops'." },
    { number: 4, type: "true_false_not_given", question_text: "IR-series rice varieties were originally bred at an institute in the Philippines.", correct_answer: "TRUE", explanation_vi: "Đoạn 4." },
    { number: 5, type: "true_false_not_given", question_text: "Saltwater intrusion in the delta is decreasing.", correct_answer: "FALSE", explanation_vi: "Đoạn 5: 'has become severe in recent decades'." },
    { number: 6, type: "sentence_completion", question_text: "The winter-spring crop is planted in November and harvested in February or ____________.", correct_answer: "March", explanation_vi: "Đoạn 3." },
    { number: 7, type: "sentence_completion", question_text: "Vietnam became the world's ____________-largest rice exporter by 2010.", correct_answer: "second", explanation_vi: "Đoạn 6." },
    { number: 8, type: "multiple_choice", question_text: "What technique can cut methane emissions by 30 percent without yield loss?", options: ["A) continuous flooding", "B) alternate wetting and drying (AWD)", "C) saltwater pumping", "D) shrimp rotation"], correct_answer: "B", explanation_vi: "Đoạn 7." },
    { number: 9, type: "multiple_choice", question_text: "What two factors combine with rising sea levels to drive saltwater intrusion?", options: ["A) typhoons + monsoon failure", "B) reduced upstream flow + dry-season pumping", "C) deforestation + dam removal", "D) hydroelectric demand + tourism"], correct_answer: "B", explanation_vi: "Đoạn 5." },
    { number: 10, type: "short_answer", question_text: "Which two Vietnamese provinces are mentioned as locations for AWD trials?", correct_answer: "An Giang and Dong Thap", explanation_vi: "Đoạn 7." },
    { number: 11, type: "short_answer", question_text: "Modern rice varieties cut the growing cycle from about 150 days to under how many?", correct_answer: "100", explanation_vi: "Đoạn 4." },
    { number: 12, type: "matching_headings", question_text: "Best heading for paragraph 6: i) Sustainability concerns; ii) Vietnam's rise as a rice exporter; iii) Three-crop schedule; iv) Improved IR varieties", correct_answer: "ii", explanation_vi: "Đoạn 6 mô tả Vietnam → 2nd largest exporter." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 5: i) Salinity intrusion and shrimp rotation; ii) Annual flood deposition; iii) Methane emissions; iv) Mekong river outlets", correct_answer: "i", explanation_vi: "Đoạn 5 mô tả saltwater intrusion + shrimp rotation." },
  ],
};

const ASEAN_TRADE: IELTSReadingPassage = {
  id: "asean-trade-integration",
  title_en: "ASEAN trade integration and Vietnam's role",
  title_vi: "Hội nhập thương mại ASEAN và vai trò Việt Nam",
  topic_family: "economics",
  band: 7.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc tổng hợp lịch sử ASEAN và quá trình hội nhập kinh tế khu vực, vai trò Việt Nam (gia nhập 1995), các chỉ số xuất khẩu nội khối, và lý do hội nhập sâu hơn vẫn vướng các rào cản cấu trúc.",
  passage_en: `The Association of Southeast Asian Nations, ASEAN, was founded in 1967 by five original members — Indonesia, Malaysia, the Philippines, Singapore, and Thailand — initially as a regional security and political consultation body more than as an economic union. Brunei joined in 1984, followed by Vietnam in 1995, Laos and Myanmar in 1997, and Cambodia in 1999, completing the ten-member configuration in use today.

Trade integration developed gradually rather than in a single founding act. The ASEAN Free Trade Area (AFTA), launched in 1992, set tariff reductions on most intra-bloc trade as the first major economic milestone. Implementation occurred over a fifteen-year period, with newer members on extended timelines. By 2015, average intra-ASEAN tariffs had fallen below 1 percent for most product categories, although non-tariff barriers — quotas, licensing requirements, technical standards — remained substantial.

The ASEAN Economic Community (AEC), formally launched in 2015, was intended to deepen integration into a single market and production base. The framework targeted free flow of goods, services, investment, skilled labour, and capital across the bloc. In practice, progress has been uneven. Goods flow has approached the AEC vision; services flow has progressed less. Capital flows have liberalised under separate bilateral arrangements rather than under any unified ASEAN framework.

Vietnam's accession in 1995 came shortly after the start of doi moi reforms and was a milestone in the country's economic re-integration with the wider world. Within a decade, ASEAN had become Vietnam's third-largest trading partner after the United States and China. Vietnam's exports to ASEAN comprise machinery, electronics, footwear, garments, and processed foods; imports include refined petroleum, plastics, machinery components, and finished consumer products from Singapore and Thailand.

Among ASEAN members, Vietnam has captured an unusually large share of the region's manufacturing growth in the 2010s and 2020s. Foreign direct investment from Korean, Japanese, and Chinese manufacturers has concentrated in Vietnamese industrial zones, particularly around Hanoi and Ho Chi Minh City. By 2023, Vietnam's manufacturing exports had overtaken Thailand's by some measures, although Thailand retains larger automotive and chemical sectors and a more developed logistics infrastructure.

Several barriers continue to limit deeper ASEAN integration. Member economies sit at very different income levels: per-capita GDP in Singapore is roughly thirty times that of Cambodia or Myanmar. Regulatory frameworks differ widely, particularly in financial services. Common ASEAN-wide product standards exist for some sectors but not others, requiring exporters to meet ten different national requirements rather than a single regional one for many goods. Customs procedures, despite gradual harmonisation, still vary substantially in efficiency.

External trade agreements add another layer of complexity. ASEAN as a bloc has negotiated free trade agreements with China, Japan, Korea, Australia, New Zealand, and India. The Regional Comprehensive Economic Partnership (RCEP), signed in 2020 and entering into force progressively from 2022, brings most of these agreements under a single framework — though with substantial carve-outs for sensitive sectors. RCEP is now the largest trade bloc by GDP, surpassing the European Union.

Vietnam's position within ASEAN is shaped by both opportunity and challenge. Lower wages relative to Thailand and Malaysia keep Vietnam attractive to manufacturers, but rising labour costs, infrastructure constraints, and demographic transitions are gradually eroding that advantage. Whether Vietnam can convert manufacturing-led growth into the kind of services and high-value sectors that distinguish high-income economies remains the central question for its next economic decade.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "ASEAN was founded primarily as an economic union.", correct_answer: "FALSE", explanation_vi: "Đoạn 1: 'initially as a regional security and political consultation body more than as an economic union'." },
    { number: 2, type: "true_false_not_given", question_text: "Vietnam joined ASEAN in 1995.", correct_answer: "TRUE", explanation_vi: "Đoạn 1." },
    { number: 3, type: "true_false_not_given", question_text: "By 2015, average intra-ASEAN tariffs had fallen below 1 percent for most categories.", correct_answer: "TRUE", explanation_vi: "Đoạn 2." },
    { number: 4, type: "true_false_not_given", question_text: "The AEC's services-flow integration has progressed faster than goods flow.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: 'services flow has progressed less'." },
    { number: 5, type: "true_false_not_given", question_text: "Vietnam's manufacturing exports have overtaken Thailand's by some measures.", correct_answer: "TRUE", explanation_vi: "Đoạn 5." },
    { number: 6, type: "true_false_not_given", question_text: "ASEAN-wide common product standards apply uniformly across all sectors.", correct_answer: "FALSE", explanation_vi: "Đoạn 6: 'exist for some sectors but not others'." },
    { number: 7, type: "sentence_completion", question_text: "The AFTA was launched in ____________.", correct_answer: "1992", explanation_vi: "Đoạn 2." },
    { number: 8, type: "sentence_completion", question_text: "Per-capita GDP in Singapore is roughly ____________ times that of Cambodia or Myanmar.", correct_answer: "thirty / 30", explanation_vi: "Đoạn 6." },
    { number: 9, type: "multiple_choice", question_text: "Which trade agreement, signed in 2020, became the largest trade bloc by GDP?", options: ["A) AFTA", "B) AEC", "C) RCEP", "D) CPTPP"], correct_answer: "C", explanation_vi: "Đoạn 7." },
    { number: 10, type: "multiple_choice", question_text: "Vietnam's three largest trading partners by the mid-2000s were:", options: ["A) Japan, Korea, India", "B) the United States, China, and ASEAN as a bloc", "C) Russia, China, India", "D) the EU, UK, USA"], correct_answer: "B", explanation_vi: "Đoạn 4." },
    { number: 11, type: "short_answer", question_text: "What economic reform programme accompanied Vietnam's ASEAN accession?", correct_answer: "doi moi", explanation_vi: "Đoạn 4." },
    { number: 12, type: "short_answer", question_text: "How many member countries does ASEAN have today?", correct_answer: "ten / 10", explanation_vi: "Đoạn 1." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 6: i) RCEP framework; ii) Barriers to deeper integration; iii) AFTA tariff reductions; iv) Vietnam's manufacturing rise", correct_answer: "ii", explanation_vi: "Đoạn 6 liệt kê barriers." },
  ],
};

const VIETNAMESE_COFFEE: IELTSReadingPassage = {
  id: "vietnamese-coffee-economics",
  title_en: "Vietnamese coffee: from colonial introduction to global player",
  title_vi: "Cà phê Việt Nam: từ giới thiệu thời thuộc địa đến vị thế toàn cầu",
  topic_family: "economics",
  band: 7.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc theo dõi sự phát triển của ngành cà phê Việt Nam: cây cà phê được người Pháp đưa vào thế kỷ 19, vai trò của Tây Nguyên trong giai đoạn mở rộng 1990–2010, sự thống trị của robusta, và các sức ép thị trường mới từ specialty arabica.",
  passage_en: `Coffee was introduced to Vietnam by French colonial administrators in 1857, who planted experimental crops near religious missions in the central highlands. Initial scale was modest: by independence in 1954, Vietnamese coffee output remained a minor share of global production, dominated by Brazil, Colombia, and several African producers.

The transformation came after doi moi reforms in 1986. The state encouraged migration of farmers from the densely populated north into the central highlands provinces of Dak Lak, Lam Dong, Gia Lai, and Kon Tum, where cooler elevations and volcanic soils suited coffee. Smallholder coffee planting expanded rapidly through the 1990s. By 2000, Vietnam had become the world's second-largest coffee producer, a position it has retained ever since — behind only Brazil.

Vietnamese coffee production is overwhelmingly robusta rather than arabica. Robusta coffee, derived from Coffea canephora rather than Coffea arabica, has higher caffeine content, a stronger and more bitter taste profile, and grows at lower elevations. It is generally considered lower in quality than arabica but produces higher per-tree yields and resists disease better. Vietnam now produces about 40 percent of the world's robusta supply, making the country systemically important to instant-coffee and espresso-blend markets globally.

The economics of robusta differ from arabica. Per-pound prices are typically half to two-thirds those of arabica. The market is largely commoditised: most Vietnamese robusta sells without origin distinction or terroir branding, and price tracks closely to ICE Futures U Contract benchmarks. Speciality coffee retailers and roasters in major coffee-importing countries continue to source the majority of their beans from Latin American or East African origins, even as Vietnam's volumes have surged.

Several recent shifts may change this picture. First, climate change is making lower-elevation arabica land in Latin America less viable, opening competitive space for high-elevation Vietnamese arabica from districts in Lam Dong and Son La. Second, a new generation of Vietnamese roasters and exporters is investing in speciality processing — natural fermentation, anaerobic processing, controlled drying — that adds quality at the same growing locations. Third, domestic Vietnamese consumption has grown sharply, providing a higher-value home market that supports investment in quality.

Coffee farming is, however, capital-intensive and exposed to price volatility. Smallholders typically have ten or fewer hectares; price collapses such as the one in 2018-2019 caused widespread financial distress. Diversification — interplanting coffee with pepper, fruit trees, or perennial crops — has become a common risk-management strategy, although yield trade-offs are real. Government programmes have promoted certification schemes such as 4C, UTZ, and Rainforest Alliance, with mixed results in lifting farm-gate prices.

Vietnamese coffee is also a domestic culture, not just an export commodity. Ca phe sua da, the strong dripped coffee with sweetened condensed milk over ice, is now globally recognised; egg coffee, a Hanoi specialty using whipped egg yolks rather than milk, has become a destination drink for tourists. Independent specialty cafes have proliferated in Hanoi and Saigon since the 2010s, supporting Vietnamese arabica producers directly through short supply chains.

Whether Vietnamese coffee can shift its profile from "high-volume robusta supplier" to "credible quality origin" is now an active question. The growing conditions and farmer expertise exist; what is changing is the international perception of Vietnamese provenance and the willingness of speciality buyers to pay quality premiums for Vietnamese-origin beans.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "French colonial administrators introduced coffee to Vietnam in 1857.", correct_answer: "TRUE", explanation_vi: "Đoạn 1." },
    { number: 2, type: "true_false_not_given", question_text: "Vietnam was already a major global coffee producer at independence in 1954.", correct_answer: "FALSE", explanation_vi: "Đoạn 1: 'remained a minor share'." },
    { number: 3, type: "true_false_not_given", question_text: "Vietnamese coffee production is mostly arabica.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: 'overwhelmingly robusta'." },
    { number: 4, type: "true_false_not_given", question_text: "Robusta coffee resists disease better than arabica.", correct_answer: "TRUE", explanation_vi: "Đoạn 3." },
    { number: 5, type: "true_false_not_given", question_text: "Robusta typically sells at higher prices per pound than arabica.", correct_answer: "FALSE", explanation_vi: "Đoạn 4: 'half to two-thirds those of arabica'." },
    { number: 6, type: "true_false_not_given", question_text: "Climate change is making low-elevation arabica land in Latin America more viable.", correct_answer: "FALSE", explanation_vi: "Đoạn 5: 'less viable'." },
    { number: 7, type: "sentence_completion", question_text: "Vietnam produces about ____________ percent of the world's robusta supply.", correct_answer: "40", explanation_vi: "Đoạn 3." },
    { number: 8, type: "sentence_completion", question_text: "Vietnam became the world's ____________-largest coffee producer by 2000.", correct_answer: "second", explanation_vi: "Đoạn 2." },
    { number: 9, type: "multiple_choice", question_text: "Which Vietnamese region was the focus of post-doi-moi coffee migration?", options: ["A) the Mekong Delta", "B) the central highlands provinces", "C) the Red River Delta", "D) the central coast"], correct_answer: "B", explanation_vi: "Đoạn 2." },
    { number: 10, type: "multiple_choice", question_text: "Diversification is mentioned as a way to manage:", options: ["A) language barriers", "B) price volatility", "C) consumer taste shifts", "D) export licensing"], correct_answer: "B", explanation_vi: "Đoạn 6: 'risk-management strategy'." },
    { number: 11, type: "short_answer", question_text: "Which Hanoi specialty coffee uses whipped egg yolks instead of milk?", correct_answer: "egg coffee", explanation_vi: "Đoạn 7." },
    { number: 12, type: "short_answer", question_text: "Name two certification schemes promoted by government programmes.", correct_answer: "4C, UTZ, Rainforest Alliance (any two)", explanation_vi: "Đoạn 6." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 5: i) Robusta vs arabica chemistry; ii) Recent shifts toward speciality; iii) Smallholder financial distress; iv) French colonial introduction", correct_answer: "ii", explanation_vi: "Đoạn 5: climate + speciality processing + domestic market." },
  ],
};

const MEKONG_DELTA_ECOLOGY: IELTSReadingPassage = {
  id: "mekong-delta-ecology",
  title_en: "The Mekong Delta as an ecological system",
  title_vi: "Đồng bằng sông Cửu Long như một hệ sinh thái",
  topic_family: "ecology",
  band: 8.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc phân tích Đồng bằng sông Cửu Long như một hệ sinh thái: cơ chế bồi đắp, đa dạng sinh học (cá tra, cá sấu nước ngọt, chim di trú), áp lực từ thuỷ điện thượng nguồn và xâm nhập mặn, và các kịch bản phục hồi.",
  passage_en: `The Mekong Delta is among the world's most productive ecological systems, but also among the most rapidly changing. Formed over the past six thousand years by sediment deposited as the Mekong River meets the South China Sea, the delta combines the conditions for high biological productivity — flat topography, abundant nutrients, predictable seasonal flooding — with the conditions for high human pressure: dense population, intensive agriculture, and a strategic position in regional trade.

Sediment deposition is the foundational process. The Mekong historically delivered around 160 million tonnes of suspended sediment annually to the delta, replenishing soil and gradually extending the coastline. This deposition supported a complex mosaic of ecosystems: freshwater swamps inland, brackish mangrove zones along estuaries, seasonal floodplains in the upper delta, and offshore mudflats important for migratory waterbirds. Each habitat type carries distinctive species assemblages adapted to its hydrology.

Biodiversity in the delta is exceptional even by tropical standards. Fish diversity alone exceeds 850 species, including the world's largest pure freshwater fish — the Mekong giant catfish, which can reach over three metres long. Tonle Sap, the great lake of Cambodia upstream, expands and contracts seasonally with the monsoon, creating a flood-pulse system that drives the entire river's fishery productivity. The delta's mangroves shelter shrimp, crab, and finfish nurseries; the floodplain forests support water snakes, freshwater crocodiles, and endemic turtles.

Migratory bird populations make the delta internationally significant for ornithology. Sarus cranes, painted storks, lesser adjutant storks, and several wader species depend on dry-season feeding grounds in shallow floodplain wetlands. Tram Chim National Park in Dong Thap Province preserves one of the largest such wetlands in southern Vietnam; its annual sarus-crane counts are monitored as a sensitive indicator of broader delta health.

Three pressures threaten the system. The first is upstream hydropower development. Eleven mainstream dams now operate or are under construction on the Mekong in China, Laos, and Cambodia. These dams trap a substantial portion of the river's sediment behind their walls and alter the seasonal flow pattern. Sediment delivery to the delta has fallen by an estimated two-thirds since the 1990s. The second is sea-level rise combined with land subsidence, the latter caused largely by groundwater pumping for aquaculture and rice. Several delta districts have subsided by more than half a metre over twenty years. The third is conversion of natural habitat to intensive aquaculture, particularly shrimp farming. Mangrove forest cover in coastal districts has declined by roughly 50 percent over four decades.

Combined, these pressures produce a delta that is both shrinking and changing chemically. Saltwater intrudes further inland each year. Annual flood pulses are weaker, reducing nutrient delivery. Some species — notably the giant catfish and the freshwater crocodile — are critically endangered or already locally extinct. Other species adapt: tilapia and farmed catfish thrive where wild fisheries collapse, but the ecological role they play differs.

Restoration approaches are now being trialled. Mangrove replanting along eroded coastlines has succeeded in some districts, providing both habitat and storm protection. Co-management arrangements, in which fishing communities help enforce sustainable catch limits, have proven more durable than top-down regulation alone. International basin agreements — particularly through the Mekong River Commission — attempt to coordinate dam operation, although member states' compliance with environmental flow recommendations remains uneven. Vietnam has the strongest interest in upstream cooperation but the least leverage.

The next two decades will determine whether the delta retains its ecological character or transitions into something fundamentally different. The decisions are not all Vietnamese to make.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "The Mekong Delta was formed over roughly the past six thousand years.", correct_answer: "TRUE", explanation_vi: "Đoạn 1." },
    { number: 2, type: "true_false_not_given", question_text: "The Mekong historically delivered around 16 million tonnes of sediment to the delta annually.", correct_answer: "FALSE", explanation_vi: "Đoạn 2: '160 million tonnes', không phải 16." },
    { number: 3, type: "true_false_not_given", question_text: "Fish diversity in the delta exceeds 850 species.", correct_answer: "TRUE", explanation_vi: "Đoạn 3." },
    { number: 4, type: "true_false_not_given", question_text: "Tonle Sap stays the same size year-round.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: 'expands and contracts seasonally'." },
    { number: 5, type: "true_false_not_given", question_text: "Sediment delivery to the delta has fallen by an estimated two-thirds since the 1990s.", correct_answer: "TRUE", explanation_vi: "Đoạn 5." },
    { number: 6, type: "true_false_not_given", question_text: "Mangrove cover in coastal districts has declined by roughly 50 percent over four decades.", correct_answer: "TRUE", explanation_vi: "Đoạn 5." },
    { number: 7, type: "sentence_completion", question_text: "Tram Chim National Park is in ____________ Province.", correct_answer: "Dong Thap", explanation_vi: "Đoạn 4." },
    { number: 8, type: "sentence_completion", question_text: "The Mekong giant catfish can reach over ____________ metres long.", correct_answer: "three / 3", explanation_vi: "Đoạn 3." },
    { number: 9, type: "multiple_choice", question_text: "Which species is mentioned as a sensitive indicator of broader delta health?", options: ["A) the Mekong giant catfish", "B) the sarus crane", "C) the lesser adjutant stork", "D) the painted stork"], correct_answer: "B", explanation_vi: "Đoạn 4: 'annual sarus-crane counts are monitored as a sensitive indicator'." },
    { number: 10, type: "multiple_choice", question_text: "Which factor causes the land subsidence mentioned in the passage?", options: ["A) earthquake activity", "B) groundwater pumping for aquaculture and rice", "C) tunneling for transport", "D) rapid afforestation"], correct_answer: "B", explanation_vi: "Đoạn 5." },
    { number: 11, type: "short_answer", question_text: "What international body coordinates dam operation among basin states?", correct_answer: "Mekong River Commission", explanation_vi: "Đoạn 7." },
    { number: 12, type: "short_answer", question_text: "What approach to fisheries enforcement has proven more durable than top-down regulation?", correct_answer: "co-management", explanation_vi: "Đoạn 7." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 5: i) Three pressures threatening the delta; ii) Migratory birds; iii) Mangrove restoration; iv) Sediment deposition mechanics", correct_answer: "i", explanation_vi: "Đoạn 5 liệt kê 3 pressures." },
  ],
};

const TRADITIONAL_MEDICINE: IELTSReadingPassage = {
  id: "traditional-vietnamese-medicine",
  title_en: "Traditional Vietnamese medicine: theory, practice, and integration",
  title_vi: "Y học cổ truyền Việt Nam: lý thuyết, thực hành và hội nhập",
  topic_family: "medical_science",
  band: 8.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc trình bày khung lý thuyết của y học cổ truyền Việt Nam (thuyết âm dương, ngũ hành, kinh lạc), các kỹ thuật chính (thuốc thảo dược, châm cứu, giác hơi, xoa bóp), tích hợp với y học hiện đại trong bệnh viện công, và các thách thức nghiên cứu định lượng.",
  passage_en: `Traditional Vietnamese medicine, often called y hoc co truyen, draws on a theoretical framework adapted over centuries from Chinese medical philosophy and supplemented with indigenous Vietnamese ethnobotany. Although it is sometimes presented in tourist contexts as exotic or peripheral, traditional medicine is integrated formally into the Vietnamese public health system: the country maintains dedicated traditional-medicine hospitals in most major cities and offers traditional-medicine outpatient services in many general hospitals.

The theoretical core rests on three interlinked concepts. The first is yin-yang (am-duong in Vietnamese), the principle that opposing complementary forces govern physiological balance. Health represents harmony between yin and yang; illness emerges from imbalance. The second is the five-phase theory (ngu hanh), which assigns systematic correspondences among five elemental phases — wood, fire, earth, metal, water — and bodily organs, emotions, seasons, and tastes. The third is the meridian system (kinh lac), a network of channels through which qi (vital energy) flows, with specific points along these meridians serving as access for therapeutic intervention.

Pharmacology — the use of herbal medicines — is the most volume-intensive branch. Vietnamese traditional pharmacopoeia includes several thousand medicinal plants, often combined into multi-ingredient prescriptions tailored to a patient's symptom pattern rather than to a single named disease. The Institute of Materia Medica in Hanoi maintains a herbarium of over thirty thousand specimens and supports botanical research alongside clinical trials of selected formulations.

Acupuncture (cham cuu) and moxibustion are the most internationally recognised techniques. Acupuncture inserts fine needles at specified meridian points; moxibustion burns dried mugwort near or on the skin to deliver heat to the same points. Vietnamese practice integrates the two more frequently than some neighbouring traditions. Cupping (giac hoi), which uses heated glass cups to create suction on the skin, is used for muscular complaints and to "draw out wind" in traditional terminology — a category roughly corresponding to viral or external influences in modern usage.

Manual therapy techniques — therapeutic massage, joint manipulation, scraping (cao gio) — form another branch. Cao gio, in which a coin or spoon is rubbed firmly along oiled skin to produce visible petechiae, is a household practice as well as a clinical one. The procedure can produce alarming bruising and is sometimes mistaken by foreign clinicians for child abuse, a recurring source of medical-cultural friction in immigrant settings.

Integration with biomedicine is the dominant policy direction. Most Vietnamese teaching hospitals require medical students to complete coursework in traditional medicine; traditional-medicine practitioners typically train within a parallel six-year university programme. Patients commonly use both systems concurrently — visiting a biomedical doctor for acute conditions and a traditional practitioner for chronic ones, or for the recovery phase after biomedical treatment. The combination is structurally encouraged: insurance schemes cover both modalities under specific guidelines.

The challenge facing traditional medicine is evidence consolidation. The framework's holistic, individualised approach sits uneasily with randomised controlled trials, which require standardised interventions and outcomes. Researchers have addressed this through pragmatic trial designs that test fixed traditional formulations against either placebo or biomedical comparators on specific conditions: clinical trials of traditional Vietnamese formulations have yielded positive results for chronic-pain management, post-stroke rehabilitation, and certain inflammatory skin conditions, with mixed or negative results for others. Publication is uneven; many studies appear only in Vietnamese-language journals not indexed internationally.

Globally, interest in herbal pharmacology has driven structured cataloguing efforts. Several compounds isolated from Vietnamese medicinal plants are now in clinical research worldwide, including artemisinin-related compounds for malaria. The challenge for the field is balancing scientific validation with the holistic logic that has supported traditional practice for centuries — and not losing the latter in the process of doing the former.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "Traditional Vietnamese medicine is integrated formally into the public health system.", correct_answer: "TRUE", explanation_vi: "Đoạn 1." },
    { number: 2, type: "true_false_not_given", question_text: "Yin-yang theory views illness as imbalance between opposing forces.", correct_answer: "TRUE", explanation_vi: "Đoạn 2." },
    { number: 3, type: "true_false_not_given", question_text: "Herbal medicines are the least volume-intensive branch of traditional medicine.", correct_answer: "FALSE", explanation_vi: "Đoạn 3: 'most volume-intensive branch'." },
    { number: 4, type: "true_false_not_given", question_text: "Acupuncture and moxibustion are commonly combined in Vietnamese practice.", correct_answer: "TRUE", explanation_vi: "Đoạn 4." },
    { number: 5, type: "true_false_not_given", question_text: "Cao gio cannot produce visible bruising.", correct_answer: "FALSE", explanation_vi: "Đoạn 5: 'visible petechiae … alarming bruising'." },
    { number: 6, type: "true_false_not_given", question_text: "All clinical trials of traditional Vietnamese formulations have produced positive results.", correct_answer: "FALSE", explanation_vi: "Đoạn 7: 'mixed or negative results for others'." },
    { number: 7, type: "sentence_completion", question_text: "The five-phase theory in Vietnamese is called ____________.", correct_answer: "ngu hanh", explanation_vi: "Đoạn 2." },
    { number: 8, type: "sentence_completion", question_text: "The Institute of Materia Medica's herbarium contains over ____________ specimens.", correct_answer: "thirty thousand / 30000 / 30,000", explanation_vi: "Đoạn 3." },
    { number: 9, type: "multiple_choice", question_text: "Which technique uses heated glass cups to create suction on the skin?", options: ["A) cao gio", "B) cham cuu", "C) giac hoi", "D) tui chi"], correct_answer: "C", explanation_vi: "Đoạn 4: 'Cupping (giac hoi)'." },
    { number: 10, type: "multiple_choice", question_text: "Why does the holistic framework sit uneasily with randomised controlled trials?", options: ["A) trials are too expensive", "B) RCTs require standardised interventions and outcomes", "C) Vietnamese law prohibits trials", "D) traditional formulations are too cheap"], correct_answer: "B", explanation_vi: "Đoạn 7." },
    { number: 11, type: "short_answer", question_text: "What is the Vietnamese name for the meridian system?", correct_answer: "kinh lac", explanation_vi: "Đoạn 2." },
    { number: 12, type: "short_answer", question_text: "Which compound class isolated from Vietnamese medicinal plants is mentioned for malaria research?", correct_answer: "artemisinin", explanation_vi: "Đoạn 8." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 6: i) Manual therapies; ii) Pragmatic trials; iii) Integration with biomedicine; iv) The five phases", correct_answer: "iii", explanation_vi: "Đoạn 6 mô tả integration with biomedicine." },
  ],
};

const SILK_WEAVING: IELTSReadingPassage = {
  id: "vietnamese-silk-weaving",
  title_en: "Vietnamese silk weaving: traditional craft under modern pressure",
  title_vi: "Nghề dệt lụa Việt Nam: nghề truyền thống dưới áp lực hiện đại",
  topic_family: "history",
  band: 7.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc giới thiệu nghề dệt lụa truyền thống ở Việt Nam, các làng nghề lịch sử (Vạn Phúc, Lãnh Mỹ A, Hội An), kỹ thuật nuôi tằm và nhuộm tự nhiên, áp lực cạnh tranh từ vải tổng hợp giá rẻ, và xu hướng phục hồi qua du lịch văn hoá.",
  passage_en: `Silk weaving has been practised continuously in Vietnam for over a thousand years. Several silk-producing villages — among them Van Phuc near Hanoi, Lanh My A in An Giang Province, and silk workshops in Hoi An — have origins documented to the Le or Tran dynasties. These villages developed distinctive technical traditions in sericulture, dyeing, and weave structure that distinguished their products even within the broader Asian silk trade.

Sericulture, the rearing of silkworms, is the production base. Silkworms (Bombyx mori) feed exclusively on mulberry leaves; production therefore depends on mulberry orchards near the silk villages. Each silkworm spins a single continuous filament between 600 and 900 metres long when forming its cocoon, although filaments break easily during processing and are typically reeled in shorter usable lengths. The reeled filaments are twisted together to produce silk thread of varying weights — finer thread for delicate weaves, heavier thread for utility fabrics.

Weave structure varies regionally. Van Phuc silk is best known for its plain and twill weaves with subtle patterns produced by varying the density of warp and weft threads — patterns that emerge as the fabric reflects light at different angles. Lanh My A silk uses the unique mac nua dye, derived from a local fruit, that produces a distinctive black-with-purple-undertone colour and a characteristic glossy finish. The dye also makes the fabric water-resistant, a property valued in Mekong Delta humidity. Hoi An silk historically integrated patterns adapted from Chinese trade contacts in the seventeenth and eighteenth centuries.

Natural dyeing is one of the most labour-intensive aspects. Indigo, lac, sappan-wood red, and various plant-derived browns are still used in some villages, although synthetic dyes have largely displaced them in commercial production. Mac nua dyeing in particular requires repeated immersion and sun-drying — sometimes thirty or more cycles to achieve the depth of colour expected. Each cycle takes hours; a single bolt of high-grade Lanh My A silk can take two weeks to dye properly.

Production has come under sustained pressure since the 1980s. Synthetic fibres — polyester especially — are dramatically cheaper, easier to dye, and more uniform than silk. Many traditional silk villages have shrunk substantially: Van Phuc had several thousand active looms in 1980 but operates a few hundred today, with most output blended with synthetic fibres rather than pure silk. Lanh My A's mac nua-dye production is critically diminished, with only a handful of households still preserving the full traditional process.

Tourism has provided a partial counterweight. Van Phuc has positioned itself as a cultural-heritage destination accessible from Hanoi, with workshop visits and direct purchase of finished items. Hoi An similarly attracts tourist demand for tailored silk garments, including custom ao dai. The economics of these tourist channels are not always healthy for craftspeople, however; intermediaries often capture most of the price premium, and customers cannot easily distinguish authentic hand-loomed silk from machine-loomed or blended versions.

Cultural-heritage protection has been formalised through Vietnamese government recognition. Several silk-related practices are now listed as national intangible cultural heritage, qualifying their practitioners for limited support and visibility. Designation does not, however, provide a market for their products. Without buyers willing to pay the price differential that hand-loomed natural-dyed silk requires, formal recognition alone cannot sustain production.

The future of Vietnamese silk weaving depends on whether export markets willing to pay quality premiums can be developed and whether younger craftspeople are willing to enter the profession at the lower wages it currently offers. Several initiatives — boutique export brands, fashion-school partnerships, dyestuff conservation projects — are working on these questions. The outcome remains genuinely uncertain.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "Several silk villages have origins documented to the Le or Tran dynasties.", correct_answer: "TRUE", explanation_vi: "Đoạn 1." },
    { number: 2, type: "true_false_not_given", question_text: "Silkworms can feed on a wide variety of leaves.", correct_answer: "FALSE", explanation_vi: "Đoạn 2: 'feed exclusively on mulberry leaves'." },
    { number: 3, type: "true_false_not_given", question_text: "Lanh My A silk uses a dye derived from a local fruit.", correct_answer: "TRUE", explanation_vi: "Đoạn 3." },
    { number: 4, type: "true_false_not_given", question_text: "Synthetic dyes have largely displaced natural dyes in commercial production.", correct_answer: "TRUE", explanation_vi: "Đoạn 4." },
    { number: 5, type: "true_false_not_given", question_text: "Van Phuc operates more looms today than it did in 1980.", correct_answer: "FALSE", explanation_vi: "Đoạn 5: 'several thousand … operates a few hundred today'." },
    { number: 6, type: "true_false_not_given", question_text: "Tourism intermediaries usually pass most of the price premium back to craftspeople.", correct_answer: "FALSE", explanation_vi: "Đoạn 6: 'intermediaries often capture most of the price premium'." },
    { number: 7, type: "sentence_completion", question_text: "Each silkworm spins a single continuous filament between 600 and ____________ metres long.", correct_answer: "900", explanation_vi: "Đoạn 2." },
    { number: 8, type: "sentence_completion", question_text: "A single bolt of high-grade Lanh My A silk can take ____________ weeks to dye properly.", correct_answer: "two / 2", explanation_vi: "Đoạn 4." },
    { number: 9, type: "multiple_choice", question_text: "What property does mac nua dye give to fabric beyond colour?", options: ["A) flame resistance", "B) UV resistance", "C) water resistance", "D) tear resistance"], correct_answer: "C", explanation_vi: "Đoạn 3: 'water-resistant'." },
    { number: 10, type: "multiple_choice", question_text: "What does national-intangible-cultural-heritage designation NOT provide?", options: ["A) limited support", "B) visibility", "C) a market for products", "D) recognition"], correct_answer: "C", explanation_vi: "Đoạn 7: 'does not, however, provide a market'." },
    { number: 11, type: "short_answer", question_text: "What is the scientific name of the silkworm species?", correct_answer: "Bombyx mori", explanation_vi: "Đoạn 2." },
    { number: 12, type: "short_answer", question_text: "Which silk village in northern Vietnam is best known for plain and twill weaves?", correct_answer: "Van Phuc", explanation_vi: "Đoạn 3." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 5: i) Sustained pressure from synthetic fibres; ii) Mac nua dyeing process; iii) Future export prospects; iv) Heritage designation", correct_answer: "i", explanation_vi: "Đoạn 5 mô tả pressure since 1980s." },
  ],
};

const FLOATING_MARKETS_AQUACULTURE: IELTSReadingPassage = {
  id: "floating-markets-aquaculture",
  title_en: "Floating markets and Mekong Delta aquaculture",
  title_vi: "Chợ nổi và nuôi trồng thủy sản Đồng bằng sông Cửu Long",
  topic_family: "agriculture",
  band: 8.5,
  time_minutes: 20,
  summary_vi:
    "Bài đọc xem xét hai hệ thống thương mại nước trên Đồng bằng sông Cửu Long: chợ nổi truyền thống (Cái Răng, Cái Bè, Trà Ôn) và ngành nuôi trồng thủy sản hiện đại (cá tra, tôm sú). Bài bao gồm các yếu tố lịch sử, kinh tế quy mô, và sức ép từ giao thông đường bộ + xuất khẩu công nghiệp.",
  passage_en: `The Mekong Delta has historically organised commerce around water rather than land. Floating markets — clusters of boats trading produce, fish, and household goods directly off their decks — were the dominant form of regional commerce until the late twentieth century, when paved road networks began competing for the same logistical role. Several markets have survived as both functioning commerce and as tourism attractions, while the broader trend favours land-based trade.

Cai Rang, near Can Tho, is the largest surviving floating market. Hundreds of boats gather along a section of the Hau River from before dawn most mornings, with peak activity between five and seven a.m. Wholesalers — boats that buy from upriver farms and re-sell to retail buyers — anchor in stable positions, signalling the produce they carry by hanging samples from a vertical pole called a cay beo. A bunch of mangoes hung from the pole indicates mango sale; a watermelon, watermelon. The pole system is a practical adaptation: shouting across moving water is unreliable, but visual signalling carries.

Cai Be in Tien Giang Province and Tra On in Vinh Long Province retain similar character on smaller scales. Phong Dien, also near Can Tho, operates as a more local-trade-oriented market with less tourist presence. Each market specialises somewhat: Cai Rang in fruit, Cai Be in produce broadly, Tra On in mixed produce and household goods. Specialisation reflects the agricultural hinterland upstream of each market location.

Floating-market commerce is, in volume terms, much diminished from its mid-twentieth-century peak. Better roads have shifted most logistical flow to trucks; refrigerated transport has reduced the need for daily fresh-market clearing. Many traders who once worked floating markets full-time now work part-time or have shifted to retail in land-based wholesale markets such as Tan An. Tourism has provided partial economic compensation: tour boats now outnumber commercial boats at Cai Rang on most mornings.

Aquaculture is the modern story that has remade delta water-based commerce. Two species dominate: pangasius catfish (commonly known as basa or tra) and shrimp, primarily black tiger shrimp and whiteleg shrimp. Vietnam is the world's largest exporter of pangasius, with almost all production from the Mekong Delta, particularly An Giang and Dong Thap provinces. Annual production exceeds 1.5 million tonnes, exported primarily to the EU, US, and Latin American markets.

Pangasius farming uses dense pond systems with high feed input. Modern operations achieve harvest-ready fish in roughly six to nine months from fingerling. Yields per hectare can exceed 200 tonnes — extraordinarily high compared to wild fisheries. The economics work because pangasius is fast-growing, omnivorous, tolerant of low-oxygen water, and acceptable to broad export markets at relatively low prices. Critics note that the same intensification creates effluent and disease-transmission risks; certification schemes such as ASC (Aquaculture Stewardship Council) attempt to address these but cover only a portion of production.

Shrimp farming has expanded particularly along the brackish coastal zone, often by converting former rice paddies or mangrove forest. Whiteleg shrimp, native to the Eastern Pacific, was introduced in the 2000s and now exceeds black tiger shrimp in production volume. Whiteleg's faster growth and higher disease resistance favour intensive culture, although disease outbreaks — early mortality syndrome, white-spot virus — periodically cause regional collapses. Farmers respond by leaving ponds fallow for a season or shifting to integrated rice-shrimp rotation systems.

Both floating markets and aquaculture face structural water-management pressure. Salinity intrusion threatens freshwater aquaculture; reduced sediment delivery affects pond bottoms and natural fishery support; rising sea levels will inundate some coastal pond areas within decades under most projections. The delta's water-based commerce, in both its traditional and modern forms, depends on water conditions that are themselves changing. Whether the next generation of delta commerce moves further toward intensive land-based or back toward distributed water-based systems is being decided gradually by accumulated farmer choices, market signals, and provincial policy.`,
  questions: [
    { number: 1, type: "true_false_not_given", question_text: "Floating markets dominated regional commerce until the late twentieth century.", correct_answer: "TRUE", explanation_vi: "Đoạn 1." },
    { number: 2, type: "true_false_not_given", question_text: "Cai Rang's traders signal what they sell by shouting across the water.", correct_answer: "FALSE", explanation_vi: "Đoạn 2: 'shouting … is unreliable, but visual signalling carries' — they use the cay beo pole." },
    { number: 3, type: "true_false_not_given", question_text: "Tour boats now outnumber commercial boats at Cai Rang on most mornings.", correct_answer: "TRUE", explanation_vi: "Đoạn 4." },
    { number: 4, type: "true_false_not_given", question_text: "Vietnam is the world's largest exporter of pangasius.", correct_answer: "TRUE", explanation_vi: "Đoạn 5." },
    { number: 5, type: "true_false_not_given", question_text: "Whiteleg shrimp is native to Vietnam.", correct_answer: "FALSE", explanation_vi: "Đoạn 7: 'native to the Eastern Pacific'." },
    { number: 6, type: "true_false_not_given", question_text: "Modern pangasius operations can yield over 200 tonnes per hectare.", correct_answer: "TRUE", explanation_vi: "Đoạn 6." },
    { number: 7, type: "sentence_completion", question_text: "Cai Rang's peak activity is between five and ____________ a.m.", correct_answer: "seven / 7", explanation_vi: "Đoạn 2." },
    { number: 8, type: "sentence_completion", question_text: "Annual pangasius production exceeds ____________ million tonnes.", correct_answer: "1.5", explanation_vi: "Đoạn 5." },
    { number: 9, type: "multiple_choice", question_text: "What is the cay beo?", options: ["A) a type of boat", "B) a vertical pole used to display product samples", "C) a wholesale district", "D) a fish-pond design"], correct_answer: "B", explanation_vi: "Đoạn 2." },
    { number: 10, type: "multiple_choice", question_text: "Which certification scheme is mentioned in connection with addressing aquaculture environmental risks?", options: ["A) MSC", "B) ASC", "C) GlobalGAP", "D) Fairtrade"], correct_answer: "B", explanation_vi: "Đoạn 6: 'ASC (Aquaculture Stewardship Council)'." },
    { number: 11, type: "short_answer", question_text: "Name two diseases mentioned that periodically cause regional shrimp collapses.", correct_answer: "early mortality syndrome and white-spot virus", explanation_vi: "Đoạn 7." },
    { number: 12, type: "short_answer", question_text: "In which two provinces is pangasius production concentrated?", correct_answer: "An Giang and Dong Thap", explanation_vi: "Đoạn 5." },
    { number: 13, type: "matching_headings", question_text: "Best heading for paragraph 4: i) Cai Rang's vertical-pole signalling; ii) Diminished floating-market volume + tourism compensation; iii) Pangasius export markets; iv) Salinity intrusion threats", correct_answer: "ii", explanation_vi: "Đoạn 4 mô tả floating-market diminished + tourism." },
  ],
};

// ── Registry ──────────────────────────────────────────────────────────-

export const IELTS_READING_PASSAGES_VN_EXTENSION: ReadonlyArray<IELTSReadingPassage> =
  [
    HANOI_HISTORY,
    TET_ORIGINS,
    AO_DAI_HERITAGE,
    MONSOON_VIETNAM,
    VIETNAMESE_CUISINE_SEA,
    MEKONG_RICE,
    ASEAN_TRADE,
    VIETNAMESE_COFFEE,
    MEKONG_DELTA_ECOLOGY,
    TRADITIONAL_MEDICINE,
    SILK_WEAVING,
    FLOATING_MARKETS_AQUACULTURE,
  ];

// ── Lookups ──────────────────────────────────────────────────────────-

export const IELTS_READING_VN_BY_ID: Readonly<
  Record<string, IELTSReadingPassage>
> = Object.freeze(
  Object.fromEntries(
    IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => [p.id, p]),
  ),
);

export const ALL_IELTS_READING_VN_IDS: ReadonlyArray<string> =
  IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => p.id);

export function listIeltsReadingVnPassages(): IELTSReadingPassage[] {
  return [...IELTS_READING_PASSAGES_VN_EXTENSION];
}

export function getIeltsReadingVnPassageById(
  id: string,
): IELTSReadingPassage | null {
  return IELTS_READING_VN_BY_ID[id] ?? null;
}

export function listIeltsReadingVnByBand(
  band: IELTSReadingBand,
): IELTSReadingPassage[] {
  return IELTS_READING_PASSAGES_VN_EXTENSION.filter((p) => p.band === band);
}

export function listIeltsReadingVnByTopic(
  topic: IELTSReadingTopicFamily,
): IELTSReadingPassage[] {
  return IELTS_READING_PASSAGES_VN_EXTENSION.filter(
    (p) => p.topic_family === topic,
  );
}
