export type VNL1Category =
  | "phonology"
  | "morphology"
  | "syntax"
  | "lexicon"
  | "discourse"
  | "pragmatics";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type Severity = "low" | "medium" | "high";

export type VNL1Example = {
  incorrect: string;
  corrected: string;
  gloss?: string;
  context?: string;
};

export type VNL1Pattern = {
  id: string;
  category: VNL1Category;
  name: string;
  shortDescription: string;
  longDescription: string;
  vietnameseRoot: string;
  examples: VNL1Example[];
  cefrLevelsObserved: CEFRLevel[];
  severity: Severity;
  remediation: string;
  ruleTags: string[];
};

const commonSourceNote =
  "Encoded from Vietnamese-English learner research plus MercyBlade teaching observations; see docs/placement-vn-l1-interference-taxonomy.md for source notes.";

export const VN_L1_INTERFERENCE_PATTERNS: VNL1Pattern[] = [
  {
    id: "final_consonant_cluster_reduction",
    category: "phonology",
    name: "Final cluster reduction",
    shortDescription:
      "Vietnamese speakers often delete or simplify English word-final consonant clusters.",
    longDescription:
      "English carries heavy grammatical and lexical information in final clusters: next, asked, tests, worlds. Vietnamese-accented English often reduces these clusters, especially when two or three consonants occur after the vowel. The result may sound like a missing tense, plural, or different word even when the learner knows the grammar in writing.\n\nThis is one of the highest-value diagnostic patterns because it crosses phonology and morphology. A grader should not immediately assume the learner does not know past tense or plural marking; in speech, the written knowledge may be present but inaudible.",
    vietnameseRoot:
      "Vietnamese syllables do not permit the kind of final consonant clusters English uses. Native codas are restricted and unreleased, so a word like next or asked requires both unfamiliar coda inventory and unfamiliar sequencing. Research on Vietnamese L1 speakers' English final clusters reports multiple repair strategies, including deletion, simplification, and vowel insertion. " +
      commonSourceNote,
    examples: [
      { incorrect: "I saw three tes yesterday.", corrected: "I saw three tests yesterday.", gloss: "ba bài kiểm tra", context: "Reporting school work" },
      { incorrect: "She ask me last night.", corrected: "She asked me last night.", gloss: "cô ấy hỏi tôi tối qua", context: "Narrating a past event" },
      { incorrect: "The nex stop is mine.", corrected: "The next stop is mine.", gloss: "trạm kế tiếp", context: "On a bus" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1", "B2"],
    severity: "high",
    remediation:
      "Train final clusters as timed releases, then connect them to grammar: test/tests, ask/asked, next stop. Use slow-to-fast drills with waveform or recording playback.",
    ruleTags: ["final_consonants", "clusters", "past_ed", "plural_s", "vn_l1_phonology"],
  },
  {
    id: "voiced_final_stop_devoicing",
    category: "phonology",
    name: "Voiced final stop loss",
    shortDescription:
      "Final /b d g/ are often devoiced, unreleased, or dropped, blurring pairs like bad/bat.",
    longDescription:
      "English distinguishes final voiced and voiceless stops in meaning and grammar. Vietnamese learners may produce a very short unreleased final stop or omit voicing cues entirely, so bad can sound like bat and bag can sound like back. This is especially damaging in short everyday words.\n\nThe pattern should be scored as pronunciation interference unless the same learner also omits the spelling or grammar in writing.",
    vietnameseRoot:
      "Vietnamese has a limited set of final oral stops, and final stops are unreleased. Southern and Northern varieties differ in coda realization, but neither gives learners routine practice with English-style final voiced obstruents. English listeners rely on vowel length and voicing transitions that Vietnamese speakers may not produce.",
    examples: [
      { incorrect: "I need a back.", corrected: "I need a bag.", gloss: "tôi cần cái túi", context: "Shopping" },
      { incorrect: "The road is bat.", corrected: "The road is bad.", gloss: "đường xấu", context: "Giving a warning" },
      { incorrect: "She has a big dok.", corrected: "She has a big dog.", gloss: "con chó lớn", context: "Describing a pet" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "medium",
    remediation:
      "Use minimal pairs with vowel-length cues before final stops: bad/bat, bag/back, robe/rope. Keep the final consonant short but audible.",
    ruleTags: ["final_stops", "voicing", "minimal_pairs", "vn_l1_phonology"],
  },
  {
    id: "th_stopping_and_fronting",
    category: "phonology",
    name: "TH substitution",
    shortDescription:
      "English /theta/ and /eth/ are replaced by /t d/ or /s z/.",
    longDescription:
      "Vietnamese learners commonly replace interdental fricatives with the nearest familiar sounds. Think becomes tink or sink; this becomes dis or zis. Because these words are frequent function words, the error can make even simple sentences sound less fluent.\n\nThis pattern is important for Mercy feedback because learners often think TH is one sound. The voiced and voiceless versions need separate cueing.",
    vietnameseRoot:
      "Vietnamese does not have English interdental fricatives. Vietnamese spelling th represents an aspirated /t/ type sound, so literate learners may map English th to a Vietnamese spelling-sound association rather than to tongue-between-teeth frication.",
    examples: [
      { incorrect: "I tink it is good.", corrected: "I think it is good.", gloss: "tôi nghĩ", context: "Giving an opinion" },
      { incorrect: "Dis is my brother.", corrected: "This is my brother.", gloss: "đây là em trai tôi", context: "Introducing family" },
      { incorrect: "She has tree books.", corrected: "She has three books.", gloss: "ba quyển sách", context: "Counting items" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1", "B2"],
    severity: "medium",
    remediation:
      "Teach /theta/ as visible airflow and /eth/ as voiced airflow. Start with high-frequency words: think, three, this, that, they.",
    ruleTags: ["th", "interdental_fricatives", "function_words", "vn_l1_phonology"],
  },
  {
    id: "inflectional_s_ed_inaudible",
    category: "phonology",
    name: "Inaudible -s and -ed",
    shortDescription:
      "Third-person, plural, possessive, and past endings are not pronounced clearly.",
    longDescription:
      "The learner may write he works, two cats, and watched correctly but pronounce work, cat, and watch. The grader must separate written morphology from spoken intelligibility. This pattern is a bridge error: a pronunciation problem can be misread as grammar ignorance.\n\nIt is high priority because English uses low-salience endings for major grammatical contrasts.",
    vietnameseRoot:
      "Vietnamese does not use bound inflectional suffixes for tense, agreement, plural, or possession. Combined with restricted final consonants, English grammatical endings are both conceptually non-native and phonetically difficult at the end of a syllable.",
    examples: [
      { incorrect: "He work every day.", corrected: "He works every day.", gloss: "anh ấy làm mỗi ngày", context: "Habit" },
      { incorrect: "I watch it yesterday.", corrected: "I watched it yesterday.", gloss: "tôi xem hôm qua", context: "Past event" },
      { incorrect: "My friend car is red.", corrected: "My friend's car is red.", gloss: "xe của bạn tôi", context: "Possession" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1", "B2"],
    severity: "high",
    remediation:
      "Pair meaning contrasts with sound contrasts: one cat/two cats, I walk/I walked, I work/he works. Drill endings after voiceless, voiced, and sibilant sounds.",
    ruleTags: ["final_s", "past_ed", "third_person_s", "possessive_s", "vn_l1_phonology"],
  },
  {
    id: "word_stress_even_timing",
    category: "phonology",
    name: "Even word stress",
    shortDescription:
      "Multisyllabic English words are pronounced with flat or misplaced stress.",
    longDescription:
      "English word stress changes intelligibility and sometimes meaning: record vs record, present vs present. Vietnamese learners may give each syllable similar weight or place stress by spelling habits. Native listeners then hear correct consonants and vowels but still struggle to identify the word.\n\nThis pattern grows more visible from B1 upward as learners use academic and professional vocabulary.",
    vietnameseRoot:
      "Vietnamese is a tonal, syllable-timed language with lexical tone on syllables rather than English-style lexical stress across a word. Research on Southern Vietnamese finds little evidence for word stress as English uses it; phrase-final lengthening can be mistaken for stress.",
    examples: [
      { incorrect: "I need IN-for-ma-tion.", corrected: "I need in-for-MA-tion.", gloss: "thông tin", context: "Academic request" },
      { incorrect: "She is a PHO-to-GRAPH-er.", corrected: "She is a pho-TOG-ra-pher.", gloss: "nhiếp ảnh gia", context: "Job description" },
      { incorrect: "This is IM-por-tant.", corrected: "This is im-POR-tant.", gloss: "quan trọng", context: "Emphasis" },
    ],
    cefrLevelsObserved: ["A2", "B1", "B2", "C1"],
    severity: "medium",
    remediation:
      "Mark stressed syllables visually and practice reduction of unstressed vowels. Prioritize high-frequency IELTS and workplace vocabulary.",
    ruleTags: ["word_stress", "schwa", "academic_vocabulary", "vn_l1_phonology"],
  },
  {
    id: "diphthong_monophthong_reduction",
    category: "phonology",
    name: "Diphthong reduction",
    shortDescription:
      "English diphthongs are shortened into single vowels, blurring words like face and goat.",
    longDescription:
      "Vietnamese has complex vowels, but English diphthongs require learners to move through a target trajectory under English timing. When movement is reduced, face can sound closer to fess and goat closer to got. The listener may understand in context but the accent remains marked.\n\nThe pattern matters for high-frequency words, names, numbers, and test listening/speaking tasks.",
    vietnameseRoot:
      "Vietnamese vowel categories do not map neatly onto English /eI/, /oU/, /aI/, /aU/, and /OI/. Learners may choose the nearest stable Vietnamese vowel quality rather than an English glide, especially under time pressure.",
    examples: [
      { incorrect: "My fess is tired.", corrected: "My face is tired.", gloss: "mặt tôi mệt", context: "Describing appearance" },
      { incorrect: "I got home by bot.", corrected: "I go home by boat.", gloss: "đi bằng thuyền", context: "Transportation" },
      { incorrect: "She is late today.", corrected: "She is late today.", gloss: "trễ hôm nay", context: "Often pronounced with too little /eI/ glide" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "medium",
    remediation:
      "Use glide arrows and slow exaggeration, then reduce to natural speed. Contrast bed/bade, got/goat, cut/cow, cot/coin.",
    ruleTags: ["vowels", "diphthongs", "minimal_pairs", "vn_l1_phonology"],
  },
  {
    id: "r_l_w_position_confusion",
    category: "phonology",
    name: "R/L/W position confusion",
    shortDescription:
      "R, L, and W are confused depending on word position and regional Vietnamese accent.",
    longDescription:
      "Vietnamese learners may distinguish r and l in one position but not another. Initial r may be produced as a flap, fricative, or approximant depending on Vietnamese region; final English /l/ can become dark, vocalized, or omitted; /w/ may be confused with /v/.\n\nThis is not one universal Vietnamese accent error. It should be diagnosed with position-specific examples: red, very, world, feel, wheel.",
    vietnameseRoot:
      "Vietnamese regional phonologies vary in how spelling r, d, gi, v, l, and n are realized. English /r/ and dark final /l/ do not map cleanly to Vietnamese categories, and /w/ is often learned through spelling rather than articulatory contrast with /v/.",
    examples: [
      { incorrect: "I really like lice.", corrected: "I really like rice.", gloss: "tôi thích cơm/gạo", context: "Food preference" },
      { incorrect: "This word is verry hard.", corrected: "This word is very hard.", gloss: "rất khó", context: "Classroom comment" },
      { incorrect: "I fee happy.", corrected: "I feel happy.", gloss: "tôi cảm thấy vui", context: "Emotion" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1", "B2"],
    severity: "medium",
    remediation:
      "Diagnose by position, not by letter. Practice initial /r/, initial /w/, and final /l/ separately with mirror feedback.",
    ruleTags: ["r_l", "v_w", "regional_accent", "vn_l1_phonology"],
  },
  {
    id: "flat_english_intonation",
    category: "phonology",
    name: "Flat English intonation",
    shortDescription:
      "English sentence melody is flattened or shaped by Vietnamese tone habits.",
    longDescription:
      "A learner can have accurate segmental pronunciation but sound uncertain, abrupt, or robotic because English pitch movement is not carrying information naturally. Questions, lists, contrastive stress, and polite requests are especially affected.\n\nThis is an advanced diagnostic because it rarely blocks literal meaning but strongly affects perceived fluency and pragmatics.",
    vietnameseRoot:
      "Vietnamese lexical tone uses pitch to distinguish syllable meaning, while English uses pitch movement across phrases for information structure, attitude, and discourse management. Learners may protect lexical syllable pitch and underuse English phrase-level rise/fall patterns.",
    examples: [
      { incorrect: "You want coffee.", corrected: "Do you want coffee?", gloss: "bạn muốn cà phê không", context: "Offer that sounds like a statement" },
      { incorrect: "I like it.", corrected: "I like it.", gloss: "tôi thích", context: "Sounds unenthusiastic because pitch is too flat" },
      { incorrect: "Really.", corrected: "Really?", gloss: "thật à", context: "Surprise question" },
    ],
    cefrLevelsObserved: ["B1", "B2", "C1", "C2"],
    severity: "low",
    remediation:
      "Use shadowing with pitch traces for yes/no questions, wh-questions, contrastive stress, and polite requests.",
    ruleTags: ["intonation", "sentence_stress", "pragmatics", "vn_l1_phonology"],
  },
  {
    id: "missing_subject_verb_agreement",
    category: "morphology",
    name: "Missing subject agreement",
    shortDescription:
      "Third-person singular -s is omitted or inconsistently applied.",
    longDescription:
      "Vietnamese learners often say he go, she have, it depend. This can persist even after explicit instruction because the ending is low-salience, phonetically final, and absent from Vietnamese verb morphology.\n\nThe placement grader should treat repeated omission in controlled present-simple contexts as a strong A1-A2 grammar signal, but occasional slips at B1-B2 may be fluency pressure.",
    vietnameseRoot:
      "Vietnamese verbs do not inflect for person or number. Tôi đi, anh ấy đi, and họ đi all use the same verb form. English requires a morphologically marked verb only for a narrow present-tense context, making the rule easy to know but hard to automatize.",
    examples: [
      { incorrect: "She go to work by bus.", corrected: "She goes to work by bus.", gloss: "cô ấy đi làm bằng xe buýt", context: "Daily routine" },
      { incorrect: "My brother have a job.", corrected: "My brother has a job.", gloss: "anh tôi có việc làm", context: "Family description" },
      { incorrect: "It depend on the price.", corrected: "It depends on the price.", gloss: "tùy vào giá", context: "Decision making" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "medium",
    remediation:
      "Drill present-simple contrasts in meaningful pairs: I work / she works. Tie the written -s to a clearly audible final sound.",
    ruleTags: ["third_person_s", "present_simple", "verb_agreement", "vn_l1_morphology"],
  },
  {
    id: "past_tense_unmarked",
    category: "morphology",
    name: "Unmarked past tense",
    shortDescription:
      "Learners rely on time adverbs and leave verbs in base form.",
    longDescription:
      "Sentences like I go yesterday are strongly associated with Vietnamese-English transfer. The learner marks time lexically but not morphologically. In writing, this is a grammar error; in speech, it may combine with inaudible final -ed.\n\nThis is one of the most important placement signals because tense control is a central CEFR discriminator from A1 through B1.",
    vietnameseRoot:
      "Vietnamese marks time through context, time adverbs, and optional aspect particles rather than obligatory verb inflection. Hôm qua tôi đi is complete without changing đi. English requires the verb phrase to carry tense even when yesterday already gives the time.",
    examples: [
      { incorrect: "I go to Da Nang last week.", corrected: "I went to Da Nang last week.", gloss: "tuần trước tôi đi Đà Nẵng", context: "Travel story" },
      { incorrect: "She cook dinner yesterday.", corrected: "She cooked dinner yesterday.", gloss: "hôm qua cô ấy nấu bữa tối", context: "Past event" },
      { incorrect: "We meet two years ago.", corrected: "We met two years ago.", gloss: "chúng tôi gặp hai năm trước", context: "Relationship history" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "high",
    remediation:
      "Contrast Vietnamese time-adverb marking with English verb marking. Practice regular and high-frequency irregular verbs in personal narratives.",
    ruleTags: ["past_simple", "regular_verbs", "irregular_verbs", "time_reference", "vn_l1_morphology"],
  },
  {
    id: "plural_s_omission",
    category: "morphology",
    name: "Plural -s omission",
    shortDescription:
      "Count nouns remain singular after numbers and quantifiers.",
    longDescription:
      "Vietnamese learners may say three book, many student, two year. The intended number is clear, but English requires noun morphology as well as the numeral. The error is especially persistent because Vietnamese bare nouns are number-neutral.\n\nThis matters for IELTS/TOEIC writing because it appears in nearly every factual description.",
    vietnameseRoot:
      "Vietnamese nouns do not obligatorily change for plural. Number can be marked by numerals, plural markers such as những/các, classifiers, or context, while the noun itself remains stable. English requires plural morphology on count nouns in most plural contexts.",
    examples: [
      { incorrect: "I have two sister.", corrected: "I have two sisters.", gloss: "tôi có hai chị/em gái", context: "Family" },
      { incorrect: "Many student want IELTS.", corrected: "Many students want IELTS.", gloss: "nhiều học sinh muốn IELTS", context: "Education" },
      { incorrect: "I lived there for five year.", corrected: "I lived there for five years.", gloss: "năm năm", context: "Duration" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "medium",
    remediation:
      "Teach plural -s as part of the noun phrase after numbers and quantifiers. Use count/mass sorting before free writing.",
    ruleTags: ["plural_s", "count_nouns", "quantifiers", "vn_l1_morphology"],
  },
  {
    id: "possessive_s_avoidance",
    category: "morphology",
    name: "Possessive -s avoidance",
    shortDescription:
      "Learners avoid or omit English possessive -s and overuse of-phrases.",
    longDescription:
      "Vietnamese learners often produce my friend house or the house of my friend. Both are understandable, but the first lacks English possession marking and the second can sound formal or unnatural in everyday contexts.\n\nThis pattern should feed lesson recommendations for noun phrase control rather than general possession meaning.",
    vietnameseRoot:
      "Vietnamese possession is commonly expressed with của after the possessed noun phrase or through juxtaposition when the relationship is clear. There is no clitic equivalent to English apostrophe-s, so learners must acquire both form and placement.",
    examples: [
      { incorrect: "My mother phone is old.", corrected: "My mother's phone is old.", gloss: "điện thoại của mẹ tôi", context: "Possession" },
      { incorrect: "The car of Nam is outside.", corrected: "Nam's car is outside.", gloss: "xe của Nam", context: "Location" },
      { incorrect: "This is teacher book.", corrected: "This is the teacher's book.", gloss: "sách của giáo viên", context: "Classroom" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "low",
    remediation:
      "Contrast của phrases with English apostrophe-s. Practice human possessors first, then organizations and time expressions.",
    ruleTags: ["possessive_s", "noun_phrases", "of_phrases", "vn_l1_morphology"],
  },
  {
    id: "comparative_superlative_mixing",
    category: "morphology",
    name: "Comparative form mixing",
    shortDescription:
      "More, -er, most, and -est are mixed or doubled.",
    longDescription:
      "Common outputs include more cheaper, the most easiest, and more good. Learners grasp the comparison meaning but not the English morphological split between short adjectives, long adjectives, and irregular forms.\n\nThis appears from A2 upward because learners begin comparing jobs, prices, cities, and study options.",
    vietnameseRoot:
      "Vietnamese comparison uses separate words such as hơn for comparative meaning and nhất for superlative meaning without changing the adjective. The adjective đẹp remains stable in đẹp hơn and đẹp nhất, so English adjective inflection and suppletive forms require extra learning.",
    examples: [
      { incorrect: "This one is more cheap.", corrected: "This one is cheaper.", gloss: "cái này rẻ hơn", context: "Shopping" },
      { incorrect: "She is the most tall in class.", corrected: "She is the tallest in class.", gloss: "cao nhất lớp", context: "Description" },
      { incorrect: "My English is more good now.", corrected: "My English is better now.", gloss: "tiếng Anh của tôi tốt hơn", context: "Progress" },
    ],
    cefrLevelsObserved: ["A2", "B1", "B2"],
    severity: "low",
    remediation:
      "Sort adjectives by one-syllable, multi-syllable, and irregular forms. Use Vietnamese hơn/nhất as semantic anchors, then force one English form only.",
    ruleTags: ["comparatives", "superlatives", "adjectives", "vn_l1_morphology"],
  },
  {
    id: "modal_verb_inflection",
    category: "morphology",
    name: "Modal verb inflection",
    shortDescription:
      "Learners add tense or agreement endings to modal verbs or to the verb after a modal.",
    longDescription:
      "Errors like he cans, she shoulds, and must to go show that the learner treats English modals like ordinary verbs or transfers Vietnamese serial-verb patterns. This is a useful A2-B1 diagnostic because modals are frequent in advice, obligation, and requests.\n\nThe error can also appear as overcorrection after learners study third-person -s.",
    vietnameseRoot:
      "Vietnamese modal meanings are expressed with separate preverbal words such as có thể, nên, phải, and cần. These do not inflect and can sit before the main verb without an English-style bare-infinitive rule. English modals are defective auxiliaries with special syntax.",
    examples: [
      { incorrect: "He cans speak English.", corrected: "He can speak English.", gloss: "anh ấy có thể nói tiếng Anh", context: "Ability" },
      { incorrect: "She shoulds study more.", corrected: "She should study more.", gloss: "cô ấy nên học thêm", context: "Advice" },
      { incorrect: "I must to leave now.", corrected: "I must leave now.", gloss: "tôi phải đi bây giờ", context: "Obligation" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "medium",
    remediation:
      "Teach modals as a small closed class: modal + base verb, no -s, no to. Drill can/should/must with Vietnamese meaning equivalents.",
    ruleTags: ["modals", "auxiliaries", "base_verb", "vn_l1_morphology"],
  },
  {
    id: "missing_articles",
    category: "syntax",
    name: "Article omission",
    shortDescription:
      "A/an/the are omitted, overused, or selected by specificity rather than definiteness.",
    longDescription:
      "Vietnamese speakers often omit English articles entirely, then later overuse the once they notice English requires articles often. This pattern affects every level of writing because article choice depends on countability, specificity, definiteness, and shared knowledge.\n\nA placement grader should record both omission and overuse, because they represent different stages of the same article-system acquisition problem.",
    vietnameseRoot:
      "Vietnamese has no grammatical article system. Definiteness is resolved through context, demonstratives, classifiers, numerals, or plural markers. A bare noun like sách can mean book, books, the book, or books in general depending on context; research on Vietnamese learners of English articles highlights the role of specificity and classifier-based noun phrases.",
    examples: [
      { incorrect: "I bought book yesterday.", corrected: "I bought a book yesterday.", gloss: "tôi mua sách hôm qua", context: "Reporting a purchase" },
      { incorrect: "The Vietnam is beautiful country.", corrected: "Vietnam is a beautiful country.", gloss: "Việt Nam đẹp", context: "Describing Vietnam" },
      { incorrect: "I love the music.", corrected: "I love music.", gloss: "tôi yêu âm nhạc", context: "General preference" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1", "B2", "C1"],
    severity: "medium",
    remediation:
      "Teach article choice through noun phrase slots: count/mass, singular/plural, general/specific, new/known. Use contrastive Vietnamese examples with classifiers.",
    ruleTags: ["articles", "definiteness", "noun_phrase_syntax", "vn_l1_syntax"],
  },
  {
    id: "copula_be_omission",
    category: "syntax",
    name: "Copula be omission",
    shortDescription:
      "Be is omitted before adjectives, nouns, or locations.",
    longDescription:
      "Vietnamese learners often say she beautiful, he doctor, or my school near here. The content words carry the intended meaning, so the sentence feels complete from a Vietnamese perspective, but English requires be in these predicate structures.\n\nThis is a strong beginner-to-elementary placement signal and should trigger lessons on be as a grammar carrier, not just as a vocabulary item.",
    vietnameseRoot:
      "Vietnamese adjectival predicates do not require an equivalent of be, and là is used in narrower identity/classification contexts than English be. Location predicates also use words like ở or gần rather than a general copular auxiliary.",
    examples: [
      { incorrect: "She beautiful.", corrected: "She is beautiful.", gloss: "cô ấy đẹp", context: "Description" },
      { incorrect: "He doctor.", corrected: "He is a doctor.", gloss: "anh ấy là bác sĩ", context: "Job" },
      { incorrect: "My house near the market.", corrected: "My house is near the market.", gloss: "nhà tôi gần chợ", context: "Location" },
    ],
    cefrLevelsObserved: ["A1", "A2"],
    severity: "high",
    remediation:
      "Practice be in three frames: be + adjective, be + noun phrase, be + place. Contrast with Vietnamese sentences where no overt be appears.",
    ruleTags: ["be", "copula", "adjectives", "locations", "vn_l1_syntax"],
  },
  {
    id: "question_word_order_transfer",
    category: "syntax",
    name: "Question word order",
    shortDescription:
      "Questions keep Vietnamese declarative order instead of English auxiliary inversion.",
    longDescription:
      "Learners may ask You go where? or Why you late? This is a direct and common transfer pattern. It can coexist with correct written multiple-choice grammar because real-time question formation is faster than conscious rule retrieval.\n\nFor placement, repeated no-inversion questions indicate A1-A2 syntax even when vocabulary is higher.",
    vietnameseRoot:
      "Vietnamese wh-questions can keep the wh-word in the position of the missing information, and yes/no questions often use particles or intonation rather than auxiliary inversion. English requires do-support or auxiliary movement in most direct questions.",
    examples: [
      { incorrect: "You where go?", corrected: "Where are you going?", gloss: "bạn đi đâu", context: "Asking destination" },
      { incorrect: "Why you don't come?", corrected: "Why didn't you come?", gloss: "sao bạn không đến", context: "Past absence" },
      { incorrect: "She can speak English?", corrected: "Can she speak English?", gloss: "cô ấy nói tiếng Anh được không", context: "Ability question" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "high",
    remediation:
      "Teach question templates by auxiliary: be, do, did, can. Use Vietnamese word-order comparisons only after the English template is automated.",
    ruleTags: ["questions", "do_support", "auxiliary_inversion", "vn_l1_syntax"],
  },
  {
    id: "relative_clause_transfer",
    category: "syntax",
    name: "Relative clause transfer",
    shortDescription:
      "Relative clauses omit who/that/which or preserve Vietnamese noun-modifier logic.",
    longDescription:
      "Vietnamese learners may write the man I met him yesterday or the book that I bought it. They understand the relationship but keep a resumptive pronoun or omit the relative marker inconsistently.\n\nThis appears in B1-B2 writing when learners attempt longer sentences.",
    vietnameseRoot:
      "Vietnamese relative-like modifiers commonly use mà or bare modifier structures, and pronoun retention can feel natural in translated clauses. English relative clauses require specific relativizers and usually leave a gap rather than a repeated object pronoun.",
    examples: [
      { incorrect: "The man I met him is my teacher.", corrected: "The man I met is my teacher.", gloss: "người đàn ông tôi gặp", context: "Identifying a person" },
      { incorrect: "I like the book that you gave it to me.", corrected: "I like the book that you gave to me.", gloss: "quyển sách bạn đưa tôi", context: "Thanking someone" },
      { incorrect: "Students want study abroad need IELTS.", corrected: "Students who want to study abroad need IELTS.", gloss: "học sinh muốn du học", context: "Academic advice" },
    ],
    cefrLevelsObserved: ["B1", "B2", "C1"],
    severity: "medium",
    remediation:
      "Teach relative clauses with gap awareness: person who, thing that/which, place where. Have learners delete repeated pronouns.",
    ruleTags: ["relative_clauses", "complex_sentences", "pronouns", "vn_l1_syntax"],
  },
  {
    id: "negation_no_not_placement",
    category: "syntax",
    name: "Negation placement",
    shortDescription:
      "No/not is placed before the main verb without English auxiliary support.",
    longDescription:
      "Vietnamese learners may say I no want, he not go, or I don't can. The learner has mapped Vietnamese không onto English no/not but has not acquired do-support and modal negation.\n\nThis is a high-value placement item because English negation touches auxiliaries, tense, and modals at once.",
    vietnameseRoot:
      "Vietnamese uses không before the verb or predicate for many negative clauses. It does not require a dummy auxiliary like do. English finite negation generally attaches to an auxiliary, and present/past simple requires do-support.",
    examples: [
      { incorrect: "I no want coffee.", corrected: "I don't want coffee.", gloss: "tôi không muốn cà phê", context: "Refusing an offer" },
      { incorrect: "He not come yesterday.", corrected: "He didn't come yesterday.", gloss: "anh ấy không đến hôm qua", context: "Past event" },
      { incorrect: "I don't can swim.", corrected: "I can't swim.", gloss: "tôi không biết bơi", context: "Ability" },
    ],
    cefrLevelsObserved: ["A1", "A2"],
    severity: "high",
    remediation:
      "Teach negation by verb family: be not, modal not, do/does/did not. Practice with Vietnamese không as the meaning anchor but not the syntax model.",
    ruleTags: ["negation", "do_support", "modals", "vn_l1_syntax"],
  },
  {
    id: "there_is_co_transfer",
    category: "syntax",
    name: "There is / có transfer",
    shortDescription:
      "Vietnamese có is mapped too broadly onto have, there is, be, or exist.",
    longDescription:
      "Learners may say my room has a table when they mean there is a table in my room, or there has many people. Because có covers possession, existence, and availability in Vietnamese, English requires a split the learner may not notice.\n\nThis pattern affects descriptions, maps, accommodation, and IELTS Task 1 language.",
    vietnameseRoot:
      "Vietnamese có is semantically broad: it can mark possession, existence, availability, and occurrence. English distributes these meanings across have, there is/are, be, and happen, with different subjects and agreement patterns.",
    examples: [
      { incorrect: "There has many people in the room.", corrected: "There are many people in the room.", gloss: "có nhiều người trong phòng", context: "Describing a room" },
      { incorrect: "My city has very beautiful.", corrected: "My city is very beautiful.", gloss: "thành phố tôi đẹp", context: "City description" },
      { incorrect: "In my house has three bedrooms.", corrected: "There are three bedrooms in my house.", gloss: "nhà tôi có ba phòng ngủ", context: "Home description" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "medium",
    remediation:
      "Sort có translations into possession, existence, and description. Drill there is/are with location-first Vietnamese prompts.",
    ruleTags: ["there_is", "have", "existentials", "vn_l1_syntax"],
  },
  {
    id: "topic_comment_fronting",
    category: "syntax",
    name: "Topic-comment fronting",
    shortDescription:
      "Vietnamese topic-first structure is transferred into English clauses.",
    longDescription:
      "Learners may write This problem, I think we should fix soon or About my hometown, it is very peaceful. Some forms are acceptable in spoken English, but overuse creates unnatural or fragmented writing.\n\nThis overlaps with discourse organization but can produce sentence-level syntax errors.",
    vietnameseRoot:
      "Vietnamese commonly organizes information with a topic-comment structure where a known topic is placed first and then commented on. English allows topicalization but uses it more selectively and often requires punctuation, resumptive wording, or a different clause structure.",
    examples: [
      { incorrect: "My family, they live in Hue.", corrected: "My family lives in Hue.", gloss: "gia đình tôi thì sống ở Huế", context: "Family description" },
      { incorrect: "This job, I don't like.", corrected: "I don't like this job.", gloss: "công việc này tôi không thích", context: "Opinion" },
      { incorrect: "About English, I study every day.", corrected: "I study English every day.", gloss: "về tiếng Anh, tôi học mỗi ngày", context: "Study habit" },
    ],
    cefrLevelsObserved: ["A2", "B1", "B2"],
    severity: "medium",
    remediation:
      "Teach when English topic fronting is marked. Have learners rewrite topic-comment drafts into subject-verb-object clauses first.",
    ruleTags: ["word_order", "topic_comment", "sentence_structure", "vn_l1_syntax"],
  },
  {
    id: "literal_vietnamese_calques",
    category: "lexicon",
    name: "Literal Vietnamese calques",
    shortDescription:
      "Vietnamese verb-object combinations are translated word for word into unnatural English.",
    longDescription:
      "Learners often know every word in a phrase but choose the Vietnamese collocation. Open the light, eat medicine, and learn by heart all reflect L1 phrase logic. These errors are usually understandable but mark the learner as non-idiomatic.\n\nA diagnostic UI should show the corrected collocation, not just label the sentence wrong.",
    vietnameseRoot:
      "Vietnamese everyday collocations package actions differently from English. Because bilingual dictionaries often give one-word equivalents, learners transfer the Vietnamese verb and attach an English noun instead of learning the whole English collocation.",
    examples: [
      { incorrect: "Please open the light.", corrected: "Please turn on the light.", gloss: "mở đèn", context: "Request at home" },
      { incorrect: "I eat medicine twice a day.", corrected: "I take medicine twice a day.", gloss: "uống thuốc", context: "Health" },
      { incorrect: "I very like this song.", corrected: "I really like this song.", gloss: "rất thích", context: "Preference" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1", "B2"],
    severity: "low",
    remediation:
      "Teach high-frequency collocations as chunks. Include Vietnamese source phrases so learners see why their literal version happened.",
    ruleTags: ["collocations", "calques", "everyday_phrases", "vn_l1_lexicon"],
  },
  {
    id: "polysemy_one_vietnamese_many_english",
    category: "lexicon",
    name: "One Vietnamese word, many English words",
    shortDescription:
      "A broad Vietnamese word is mapped to one English equivalent across contexts.",
    longDescription:
      "Learners may overuse make, do, say, know, or learn because one Vietnamese verb covers several English distinctions. The issue is not vocabulary size alone; it is lexical boundary mismatch.\n\nThis pattern becomes prominent from A2 upward as learners discuss work, study, and relationships.",
    vietnameseRoot:
      "Vietnamese and English carve semantic fields differently. Words such as làm, nói, biết, học, and đi cover ranges that English splits among do/make/work, say/tell/speak/talk, know/know how/meet, learn/study, and go/travel/attend.",
    examples: [
      { incorrect: "I learn English at university.", corrected: "I study English at university.", gloss: "học tiếng Anh", context: "Formal education" },
      { incorrect: "I know him yesterday.", corrected: "I met him yesterday.", gloss: "tôi biết/gặp anh ấy hôm qua", context: "First meeting" },
      { incorrect: "Can you say me the answer?", corrected: "Can you tell me the answer?", gloss: "nói cho tôi đáp án", context: "Asking for information" },
    ],
    cefrLevelsObserved: ["A2", "B1", "B2"],
    severity: "medium",
    remediation:
      "Build semantic maps from one Vietnamese source word to multiple English verbs. Practice with context sorting rather than translation only.",
    ruleTags: ["word_choice", "semantic_maps", "verbs", "vn_l1_lexicon"],
  },
  {
    id: "preposition_selection_transfer",
    category: "lexicon",
    name: "Preposition selection",
    shortDescription:
      "English prepositions are chosen by Vietnamese spatial or verb patterns.",
    longDescription:
      "Vietnamese learners often write depend in, discuss about, married with, or in Monday. These are high-frequency errors and persist into advanced levels because English prepositions are partly lexicalized and collocational.\n\nThe grader should tag exact preposition frames because a generic preposition lesson is too broad.",
    vietnameseRoot:
      "Vietnamese relational words do not map one-to-one to English prepositions, and some Vietnamese verbs encode relation meanings that English expresses with a preposition. Learners also translate prepositions from Vietnamese phrases where the conceptual metaphor differs.",
    examples: [
      { incorrect: "It depends in the weather.", corrected: "It depends on the weather.", gloss: "tùy vào thời tiết", context: "Condition" },
      { incorrect: "I will meet you in Monday.", corrected: "I will meet you on Monday.", gloss: "gặp bạn vào thứ Hai", context: "Scheduling" },
      { incorrect: "We discussed about the plan.", corrected: "We discussed the plan.", gloss: "thảo luận về kế hoạch", context: "Work meeting" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1", "B2", "C1"],
    severity: "medium",
    remediation:
      "Teach prepositions in verb/adjective/noun frames: depend on, interested in, reason for. Keep a personal error bank.",
    ruleTags: ["prepositions", "collocations", "verb_patterns", "vn_l1_lexicon"],
  },
  {
    id: "phrasal_verb_avoidance",
    category: "lexicon",
    name: "Phrasal verb avoidance",
    shortDescription:
      "Learners avoid common phrasal verbs or interpret them literally.",
    longDescription:
      "Vietnamese learners may choose formal single verbs where native English would use get up, turn off, put on, look after, or give up. In listening, they may miss the idiomatic meaning because the particles seem small and optional.\n\nThis affects natural spoken English and everyday comprehension more than academic writing.",
    vietnameseRoot:
      "Vietnamese verbs do combine with directional/resultative elements, but English phrasal verbs are highly idiomatic and particle meaning is not predictable. Learners trained through word-level translation often treat particles as low-value extras.",
    examples: [
      { incorrect: "I wake at 6.", corrected: "I get up at 6.", gloss: "thức dậy lúc 6 giờ", context: "Routine" },
      { incorrect: "Please wear your jacket.", corrected: "Please put on your jacket.", gloss: "mặc áo khoác vào", context: "Instruction" },
      { incorrect: "She cares her brother.", corrected: "She looks after her brother.", gloss: "chăm sóc em trai", context: "Family duty" },
    ],
    cefrLevelsObserved: ["A2", "B1", "B2", "C1"],
    severity: "low",
    remediation:
      "Introduce phrasal verbs by scenario, not alphabetically. Use listen-and-act drills for high-frequency physical actions first.",
    ruleTags: ["phrasal_verbs", "spoken_english", "particles", "vn_l1_lexicon"],
  },
  {
    id: "false_friend_loanword_overreach",
    category: "lexicon",
    name: "Loanword false friends",
    shortDescription:
      "French- or English-origin Vietnamese loanwords are mapped to the wrong English word or register.",
    longDescription:
      "Vietnamese contains loanwords through French, Chinese, and English contact. Some are helpful, but others encourage wrong assumptions about meaning, register, or collocation. Learners may use a technical or outdated word because it resembles the Vietnamese classroom term.\n\nThis is most relevant for educated B1-C1 learners who rely on academic vocabulary.",
    vietnameseRoot:
      "Loanwords in Vietnamese may shift meaning, pronunciation, or register after borrowing. A learner may trust the surface similarity and miss that English uses a different everyday word, a different collocation, or a narrower technical term.",
    examples: [
      { incorrect: "I will photocopy my identity card at the photo shop.", corrected: "I will copy my ID at the copy shop.", gloss: "phô tô căn cước", context: "Errand" },
      { incorrect: "I study informatics.", corrected: "I study computer science.", gloss: "tin học/công nghệ thông tin", context: "Major" },
      { incorrect: "He works in a saloon.", corrected: "He works in a salon.", gloss: "tiệm salon", context: "Job" },
    ],
    cefrLevelsObserved: ["B1", "B2", "C1"],
    severity: "low",
    remediation:
      "Flag suspicious cognates and teach the current English register. Confirm with corpus-like examples, not dictionary headwords alone.",
    ruleTags: ["false_friends", "loanwords", "register", "vn_l1_lexicon"],
  },
  {
    id: "idiom_literal_interpretation",
    category: "lexicon",
    name: "Literal idiom interpretation",
    shortDescription:
      "Idioms are interpreted as transparent word meanings or translated from Vietnamese idioms.",
    longDescription:
      "Learners may understand every word in raining cats and dogs and still miss the phrase meaning. Conversely, they may translate Vietnamese idioms directly into English. This affects listening, reading, and speaking naturalness.\n\nThe pattern is not a beginner priority, but it becomes important for B2-C1 fluency and test reading.",
    vietnameseRoot:
      "Vietnamese has a rich idiom/proverb system, but idioms are language-specific cultural chunks. Direct translation rarely preserves metaphor, register, or frequency. English idioms also often contain low-frequency concrete words that distract learners from the phrase meaning.",
    examples: [
      { incorrect: "It rains like pouring water.", corrected: "It's pouring.", gloss: "mưa như trút nước", context: "Heavy rain" },
      { incorrect: "I am very headache with this problem.", corrected: "This problem is giving me a headache.", gloss: "đau đầu với vấn đề này", context: "Frustration" },
      { incorrect: "He is a frog under the well.", corrected: "He has a narrow view of the world.", gloss: "ếch ngồi đáy giếng", context: "Criticism" },
    ],
    cefrLevelsObserved: ["B1", "B2", "C1", "C2"],
    severity: "low",
    remediation:
      "Teach idioms as optional comprehension chunks with register notes. Prefer plain English paraphrase before production.",
    ruleTags: ["idioms", "metaphor", "reading", "vn_l1_lexicon"],
  },
  {
    id: "over_explicit_pronoun_reference",
    category: "discourse",
    name: "Over-explicit pronouns",
    shortDescription:
      "Learners repeat names or nouns where English prefers pronouns or ellipsis.",
    longDescription:
      "Vietnamese writing and speech may repeat kinship terms, names, or role nouns to maintain clarity and politeness. In English, repeated full noun phrases can sound heavy or childlike unless used for emphasis.\n\nThis is a discourse-level fluency issue, not a sentence grammar failure.",
    vietnameseRoot:
      "Vietnamese pronoun choice is socially loaded; kinship terms and names often replace simple pronouns. English pronouns are less relational and are expected once a referent is established. Learners may avoid pronouns to prevent ambiguity or politeness mistakes.",
    examples: [
      { incorrect: "Lan is my friend. Lan studies nursing. Lan wants to work abroad.", corrected: "Lan is my friend. She studies nursing and wants to work abroad.", gloss: "Lan là bạn tôi...", context: "Short biography" },
      { incorrect: "My mother said my mother was tired.", corrected: "My mother said she was tired.", gloss: "mẹ tôi nói mẹ tôi mệt", context: "Reported speech" },
      { incorrect: "The company is small, but the company is growing.", corrected: "The company is small, but it is growing.", gloss: "công ty nhỏ nhưng đang phát triển", context: "Business description" },
    ],
    cefrLevelsObserved: ["A2", "B1", "B2"],
    severity: "low",
    remediation:
      "Teach reference chains: introduce with a noun, continue with pronouns. Contrast English clarity with Vietnamese social pronoun habits.",
    ruleTags: ["pronoun_reference", "cohesion", "writing", "vn_l1_discourse"],
  },
  {
    id: "topic_comment_paragraph_shape",
    category: "discourse",
    name: "Topic-comment paragraphing",
    shortDescription:
      "Paragraphs present topics by association rather than a linear English claim-support pattern.",
    longDescription:
      "The learner may introduce a broad topic, circle through related observations, and leave the main claim implicit. English academic and test writing expects an explicit topic sentence, controlled development, and a visible conclusion.\n\nThis should be diagnosed separately from sentence-level grammar because even grammatically correct sentences may not satisfy IELTS coherence expectations.",
    vietnameseRoot:
      "Vietnamese discourse can tolerate more context-building and indirect topic development, especially when shared knowledge is assumed. English academic discourse places heavier responsibility on explicit thesis, signposting, and paragraph unity.",
    examples: [
      { incorrect: "About technology, people use phones every day. Children also use phones. My city has many shops.", corrected: "Smartphones have changed daily life in Vietnam in three main ways.", gloss: "về công nghệ...", context: "Essay opening" },
      { incorrect: "My hometown, it has many memories, and people are friendly, so when I go away, I miss it.", corrected: "My hometown is important to me because of its people and memories.", gloss: "quê tôi thì...", context: "Personal paragraph" },
      { incorrect: "English is global. Many companies need it. I study every night.", corrected: "English is important for my career, so I study it every night.", gloss: "tiếng Anh toàn cầu...", context: "Motivation statement" },
    ],
    cefrLevelsObserved: ["B1", "B2", "C1"],
    severity: "medium",
    remediation:
      "Use paragraph frames: claim, reason, example, result. Ask learners to underline the one sentence that controls each paragraph.",
    ruleTags: ["paragraphs", "coherence", "ielts_writing", "vn_l1_discourse"],
  },
  {
    id: "connector_overuse_and_stacking",
    category: "discourse",
    name: "Connector stacking",
    shortDescription:
      "So, because, but, and moreover are overused or stacked mechanically.",
    longDescription:
      "Learners may produce long chains connected by and/so/because or insert formal connectors without a real logical relationship. The writing appears connected on the surface but weak in coherence.\n\nThis is common after exam-prep instruction that rewards visible linking words.",
    vietnameseRoot:
      "Vietnamese can use flexible clause chaining and discourse particles to guide interpretation. English academic writing requires explicit logical relations, but overteaching connector lists can lead Vietnamese learners to decorate rather than organize meaning.",
    examples: [
      { incorrect: "I was tired so I went home so I slept early.", corrected: "I was tired, so I went home and slept early.", gloss: "nên... nên...", context: "Narrative" },
      { incorrect: "Moreover, I like coffee, but moreover it is expensive.", corrected: "I like coffee, but it is expensive.", gloss: "hơn nữa", context: "Simple contrast" },
      { incorrect: "Because I was busy. I didn't call you.", corrected: "Because I was busy, I didn't call you.", gloss: "vì tôi bận", context: "Explanation" },
    ],
    cefrLevelsObserved: ["A2", "B1", "B2", "C1"],
    severity: "medium",
    remediation:
      "Teach connectors by function and punctuation, then force sentence combining. Remove connectors that do not change the logical relation.",
    ruleTags: ["connectors", "cohesion", "sentence_combining", "vn_l1_discourse"],
  },
  {
    id: "time_reference_overmarking",
    category: "discourse",
    name: "Time reference overmarking",
    shortDescription:
      "Learners repeat time adverbs because Vietnamese relies heavily on lexical time marking.",
    longDescription:
      "English narratives can mark time once and let tense carry the sequence. Vietnamese learners may repeat yesterday, then, after that, or now in nearly every sentence, making the text sound mechanical.\n\nThe pattern is related to tense morphology but appears at discourse level in narrative flow.",
    vietnameseRoot:
      "Vietnamese does not require tense inflection on verbs, so time adverbs and aspect markers carry much of the temporal organization. When learners write English, they may keep Vietnamese-style lexical time marking even after adding English tense.",
    examples: [
      { incorrect: "Yesterday I went to work. Yesterday I met my boss. Yesterday I finished late.", corrected: "Yesterday I went to work, met my boss, and finished late.", gloss: "hôm qua... hôm qua...", context: "Diary" },
      { incorrect: "In the future, I will study abroad and in the future I will find a job.", corrected: "In the future, I will study abroad and find a job.", gloss: "trong tương lai...", context: "Plan" },
      { incorrect: "Now I am a student. Now I live in Hanoi.", corrected: "I am a student now, and I live in Hanoi.", gloss: "hiện tại...", context: "Self introduction" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1"],
    severity: "low",
    remediation:
      "Have learners mark time once per paragraph, then use tense and sequencing verbs. Combine repetitive time-marked sentences.",
    ruleTags: ["time_reference", "narrative", "cohesion", "vn_l1_discourse"],
  },
  {
    id: "indirect_main_point_delay",
    category: "discourse",
    name: "Delayed main point",
    shortDescription:
      "Writers delay requests or opinions with background before stating the point.",
    longDescription:
      "In emails or essays, Vietnamese learners may build context politely before making the request or thesis. English workplace readers often expect the main point early, then supporting context.\n\nThis is a high-leverage professional-English pattern for job abroad and immigration outcomes.",
    vietnameseRoot:
      "Vietnamese politeness and high-context communication often value relational setup before direct business. English professional writing, especially North American workplace email, often treats early explicit purpose as respectful of the reader's time.",
    examples: [
      { incorrect: "I hope you are well. These days our team has many tasks... I want to ask for Friday off.", corrected: "Could I take Friday off? Our team has many tasks, so I will finish my handover by Thursday.", gloss: "em xin phép nghỉ thứ Sáu", context: "Work email" },
      { incorrect: "Nowadays English is important... I agree with online learning.", corrected: "I agree that online learning is useful because it is flexible and affordable.", gloss: "tôi đồng ý", context: "Essay response" },
      { incorrect: "My situation is a little difficult... can you help me?", corrected: "Could you help me with my application? My situation is a little difficult.", gloss: "bạn giúp tôi được không", context: "Request" },
    ],
    cefrLevelsObserved: ["B1", "B2", "C1", "C2"],
    severity: "medium",
    remediation:
      "Teach purpose-first email and paragraph templates. Frame directness as clarity, not rudeness, when the relationship and context allow it.",
    ruleTags: ["email_writing", "main_idea", "professional_english", "vn_l1_discourse"],
  },
  {
    id: "direct_request_transfer",
    category: "pragmatics",
    name: "Direct request transfer",
    shortDescription:
      "Requests are translated directly and can sound too blunt or too soft in English.",
    longDescription:
      "Vietnamese requests depend heavily on relationship terms, particles, and context. In English, Give me... or You help me... can sound abrupt, while overly indirect translations can sound evasive. The learner needs the English request formula for the power relationship.\n\nThis pattern matters for customer service, school, workplace, and immigration settings.",
    vietnameseRoot:
      "Vietnamese politeness is encoded through pronouns, kinship terms, particles such as nhé/ạ/dạ, and shared context. English relies more on modal formulas, please placement, hedging, and intonation. Literal translation loses the politeness machinery.",
    examples: [
      { incorrect: "You send me the file.", corrected: "Could you send me the file?", gloss: "bạn gửi tôi file nhé", context: "Work request" },
      { incorrect: "Give me one coffee.", corrected: "Could I have a coffee, please?", gloss: "cho tôi một cà phê", context: "Ordering" },
      { incorrect: "Help me check this.", corrected: "Could you help me check this?", gloss: "giúp tôi xem cái này", context: "Asking a coworker" },
    ],
    cefrLevelsObserved: ["A2", "B1", "B2", "C1"],
    severity: "medium",
    remediation:
      "Teach request ladders by relationship and burden: Can you, Could you, Would you mind, I was wondering if. Practice intonation with each.",
    ruleTags: ["requests", "politeness", "workplace", "vn_l1_pragmatics"],
  },
  {
    id: "formality_calibration",
    category: "pragmatics",
    name: "Formality calibration",
    shortDescription:
      "Learners choose English that is too formal, too intimate, or mismatched to the situation.",
    longDescription:
      "Vietnamese has rich address systems that make relative age, status, and closeness explicit. English has fewer pronoun choices, so learners may compensate with Dear teacher, sir, bro, or overly ceremonial phrases.\n\nThe issue is pragmatic fit, not grammar.",
    vietnameseRoot:
      "Vietnamese pronouns and address terms encode social hierarchy and relationship. English relies on first names, titles, tone, and genre conventions. Vietnamese learners may over-transfer status marking into English or remove too much and sound abrupt.",
    examples: [
      { incorrect: "Dear teacher, I have a question.", corrected: "Hi Ms. Nguyen, I have a question.", gloss: "cô ơi em có câu hỏi", context: "Email to teacher" },
      { incorrect: "Respected sir, please see my homework.", corrected: "Hi Mr. Lee, here is my homework.", gloss: "thưa thầy", context: "Class email" },
      { incorrect: "Hey bro, I need visa information.", corrected: "Hello, I need information about my visa.", gloss: "anh/chị cho tôi hỏi", context: "Official inquiry" },
    ],
    cefrLevelsObserved: ["B1", "B2", "C1", "C2"],
    severity: "medium",
    remediation:
      "Teach register by channel: text to friend, email to teacher, message to boss, official form. Provide safe default templates.",
    ruleTags: ["register", "email", "address_terms", "vn_l1_pragmatics"],
  },
  {
    id: "apology_explanation_before_responsibility",
    category: "pragmatics",
    name: "Apology explanation order",
    shortDescription:
      "Learners give explanations before an explicit English apology or repair offer.",
    longDescription:
      "A Vietnamese learner may say Because traffic was bad, I came late before saying sorry. In English, especially professional settings, listeners often expect apology, responsibility, and repair first, then explanation.\n\nThis is not about sincerity; it is speech-act sequencing.",
    vietnameseRoot:
      "Vietnamese apology routines can rely on context, relationship, particles, and explanation to show sincerity. Studies of Vietnamese EFL apology transfer examine how learners carry L1 apology strategies into English. English workplace norms often prefer an explicit apology and concrete next step.",
    examples: [
      { incorrect: "The traffic was terrible, so I am late.", corrected: "I'm sorry I'm late. The traffic was terrible.", gloss: "kẹt xe nên tôi đến muộn", context: "Arriving late" },
      { incorrect: "I forgot because I was busy.", corrected: "I'm sorry I forgot. I'll send it now.", gloss: "tôi quên vì bận", context: "Missed task" },
      { incorrect: "My computer had a problem.", corrected: "Sorry, my computer had a problem. I will resend the file.", gloss: "máy tính bị lỗi", context: "Failed upload" },
    ],
    cefrLevelsObserved: ["A2", "B1", "B2", "C1"],
    severity: "medium",
    remediation:
      "Teach apology formula: sorry + responsibility + repair + brief reason. Role-play late arrival, missed deadline, and wrong order.",
    ruleTags: ["apologies", "speech_acts", "workplace", "vn_l1_pragmatics"],
  },
  {
    id: "refusal_softening_gap",
    category: "pragmatics",
    name: "Refusal softening gap",
    shortDescription:
      "Refusals are either too direct or too vague because English softening formulas are missing.",
    longDescription:
      "Vietnamese learners may answer No, I can't or avoid saying no clearly. English refusals often need appreciation, soft no, brief reason, and alternative. Without that formula, the learner can sound rude or noncommittal.\n\nThis pattern is important for interviews, customer support, and professional boundaries.",
    vietnameseRoot:
      "Vietnamese refusals are managed through relationship, particles, indirectness, and shared context. English requires explicit but softened refusal formulas, especially in low-context professional interactions.",
    examples: [
      { incorrect: "No, I don't go.", corrected: "Sorry, I can't go today.", gloss: "hôm nay tôi không đi được", context: "Declining invitation" },
      { incorrect: "Maybe later.", corrected: "Thanks for asking, but I can't this week.", gloss: "để sau", context: "Avoiding a request" },
      { incorrect: "I don't want this job.", corrected: "Thank you for the offer, but I have decided to accept another position.", gloss: "tôi không muốn việc này", context: "Rejecting offer" },
    ],
    cefrLevelsObserved: ["B1", "B2", "C1"],
    severity: "medium",
    remediation:
      "Practice refusal frames by stakes: friend invitation, boss request, customer complaint, job offer. Include alternatives when appropriate.",
    ruleTags: ["refusals", "politeness", "professional_english", "vn_l1_pragmatics"],
  },
  {
    id: "greeting_small_talk_transfer",
    category: "pragmatics",
    name: "Greeting convention transfer",
    shortDescription:
      "Vietnamese greeting topics are transferred into English settings where they may feel personal.",
    longDescription:
      "Questions about age, family, salary, eating, or destination can be friendly in Vietnamese contexts but intrusive in many English-speaking contexts. Conversely, English small talk can feel empty to Vietnamese learners because it does not seek real information.\n\nMercy feedback should explain the cultural function, not shame the learner.",
    vietnameseRoot:
      "Vietnamese greetings often use relational questions and care-based comments: ăn cơm chưa, đi đâu đấy, dạo này khỏe không. English small talk frequently uses low-risk topics such as weather, weekend, commute, and general wellbeing with limited disclosure expected.",
    examples: [
      { incorrect: "How old are you?", corrected: "Nice to meet you. What do you do?", gloss: "bạn bao nhiêu tuổi", context: "First meeting with adult" },
      { incorrect: "Where are you going?", corrected: "How's your day going?", gloss: "đi đâu đấy", context: "Casual hallway greeting" },
      { incorrect: "Did you eat rice?", corrected: "Have you had lunch yet?", gloss: "ăn cơm chưa", context: "Friendly check-in; safer with close friends" },
    ],
    cefrLevelsObserved: ["A1", "A2", "B1", "B2"],
    severity: "low",
    remediation:
      "Teach safe small-talk scripts by closeness level. Mark which Vietnamese care questions are close-relationship only in English.",
    ruleTags: ["greetings", "small_talk", "culture", "vn_l1_pragmatics"],
  },
];

export const VN_L1_INTERFERENCE_BY_ID = Object.fromEntries(
  VN_L1_INTERFERENCE_PATTERNS.map((pattern) => [pattern.id, pattern]),
) as Record<string, VNL1Pattern>;

export function getVnL1PatternById(id: string): VNL1Pattern | undefined {
  return VN_L1_INTERFERENCE_BY_ID[id];
}

export function getVnL1PatternsByCategory(
  category: VNL1Category,
): VNL1Pattern[] {
  return VN_L1_INTERFERENCE_PATTERNS.filter(
    (pattern) => pattern.category === category,
  );
}
