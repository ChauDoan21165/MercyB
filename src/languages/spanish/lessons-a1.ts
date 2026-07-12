// src/languages/spanish/lessons-a1.ts
//
// ⚠️ AI-AUTHORED CONTENT — recommend native-speaker review before merge.
//
// First Spanish-for-English-speakers corpus. 14 A1 lessons spanning all
// 9 A1 categories. Content authored to the structure spec in this PR
// chain's design brief. Pedagogical priorities:
//
//   1. Introduce ser vs estar EARLY (lessons 3-4). Every beginner
//      resource that delays this creates an "es is the default" habit
//      that has to be unlearned later.
//   2. Vocabulary entries pair words with articles (el libro, la mesa)
//      so gender is encoded in the data, not just the gender field.
//      The normalizer also formats bare words with a (m)/(f) suffix as
//      a backstop, but article-with-noun is the higher-quality form.
//   3. Regional variants (Peninsular vs LatAm) flagged inside the lesson
//      bodies and via the regional_variants[] field. Both markets are
//      real; don't pick one and stick with it.
//   4. Pronunciation guides use English-speaker-friendly approximations
//      (BWEH-nohs DEE-ahs), not IPA. Pronunciation_focus calls out the
//      specific sounds to drill (silent h, rolled r, ñ).
//   5. Cultural notes teach real distinctions, not tourism trivia.
//      Tips are tactical, not generic.

import type { SpanishLesson } from "./lessons";

export const lessons: SpanishLesson[] = [
  // ── 1. greetings — spanish_greetings_basic ─────────────────────────────
  {
    id: "spanish_greetings_basic",
    level: "A1",
    category: "greetings",
    title: "Greetings — the first 30 seconds",
    subtitle: "Hola, buenos días, ¿cómo estás?",
    intro:
      "Spanish greetings shift through the day in a way English doesn't. Get the time-of-day cutoffs right and you'll sound less like a textbook on day one.",
    sentences: [
      {
        spanish: "Hola, ¿cómo estás?",
        english: "Hi, how are you?",
        pronunciation: "OH-lah, KOH-moh ehs-TAHS",
        pronunciation_focus: ["Silent 'h' in hola", "Soft 't' in estás"],
        note: "Default informal greeting. Use with friends, peers, anyone roughly your age.",
      },
      {
        spanish: "Buenos días.",
        english: "Good morning. (Used through midday.)",
        pronunciation: "BWEH-nohs DEE-ahs",
        pronunciation_focus: ["Rolled 'd' is soft, almost 'th'"],
        note: "Spain: switch to 'buenas tardes' after lunch (~2 pm). LatAm: switch around noon.",
      },
      {
        spanish: "Buenas tardes.",
        english: "Good afternoon. / Good evening (before dark).",
        pronunciation: "BWEH-nahs TAR-dehs",
        pronunciation_focus: ["Rolled 'r' is single, not the long trill"],
        note: "Covers everything from midday through dusk.",
      },
      {
        spanish: "¿Qué tal?",
        english: "How's it going? / What's up?",
        pronunciation: "keh TAHL",
        pronunciation_focus: ["'qu' = 'k' sound, 'u' is silent"],
        note: "Casual. Equivalent to English 'what's up' — answer with bien, todo bien, or any short phrase.",
      },
      {
        spanish: "Mucho gusto.",
        english: "Nice to meet you. (Literally: much pleasure.)",
        pronunciation: "MOO-choh GOOS-toh",
        pronunciation_focus: ["'ch' is hard like English 'ch' in chair"],
        note: "Standard response when first introduced. Both people often say it.",
      },
    ],
    vocabulary: [
      { cell_id: "52abc2a3-4556-41da-80b5-f9a89e666a03", word: "hola", english: "hello", pronunciation: "OH-lah", part_of_speech: "interjection" },
      { cell_id: "8f22e36e-00e5-4b0b-be69-fe8bd819e678", word: "buenos días", english: "good morning", pronunciation: "BWEH-nohs DEE-ahs", part_of_speech: "phrase" },
      { cell_id: "c969795d-ac51-47ca-8b43-0911206a91b2", word: "buenas tardes", english: "good afternoon", pronunciation: "BWEH-nahs TAR-dehs", part_of_speech: "phrase" },
      { cell_id: "e4eb058a-f883-4ad2-9107-f7d852b3768c", word: "buenas noches", english: "good night / good evening (after dark)", pronunciation: "BWEH-nahs NOH-chehs", part_of_speech: "phrase" },
      { cell_id: "ac34dfe6-2f16-47f2-add2-07695abc5d77", word: "¿cómo estás?", english: "how are you? (informal)", pronunciation: "KOH-moh ehs-TAHS", part_of_speech: "question" },
      { cell_id: "1b797f09-be00-4fa4-b06d-891d04940f0d", word: "¿cómo está?", english: "how are you? (formal)", pronunciation: "KOH-moh ehs-TAH", part_of_speech: "question" },
      { cell_id: "51239f08-1bac-4a8a-a1bb-fe1c304ac072", word: "bien", english: "well / good", pronunciation: "BYEHN", part_of_speech: "adverb" },
      { cell_id: "e69523f5-9ee8-49cd-9750-74e837bd7b6a", word: "mucho gusto", english: "nice to meet you", pronunciation: "MOO-choh GOOS-toh", part_of_speech: "phrase" },
    ],
    dialogue: [
      { cell_id: "c6e6e2f8-692f-4748-b65d-89dc3df133d1", speaker: "Ana", spanish: "¡Hola! ¿Cómo estás?", english: "Hi! How are you?", pronunciation: "OH-lah! KOH-moh ehs-TAHS?", register: "informal" },
      { cell_id: "83dbb908-dae1-4f37-a7d5-4561b23d61be", speaker: "Carlos", spanish: "Bien, gracias. ¿Y tú?", english: "Good, thanks. And you?", pronunciation: "BYEHN, GRAH-syahs. ee TOO?", register: "informal" },
      { cell_id: "47535e46-26de-44d0-a94d-5d4f2c24bb5b", speaker: "Ana", spanish: "Muy bien. Mucho gusto.", english: "Very well. Nice to meet you.", pronunciation: "moo-EE BYEHN. MOO-choh GOOS-toh", register: "informal" },
      { cell_id: "3ec4ca1c-ef60-4d95-8f53-411de5cdcb27", speaker: "Carlos", spanish: "Igualmente.", english: "Likewise.", pronunciation: "ee-gwahl-MEHN-teh", register: "informal" },
    ],
    cultural_note:
      "In Spain, 'buenos días' ends at lunch (~2 pm) and 'buenas tardes' kicks in for the long Spanish afternoon. In most of Latin America, the cutoff is noon. If you say 'buenos días' to a Madrileño at 3 pm, you sound like a tourist; in Mexico City at 3 pm it's totally normal. Pay attention to which you're hearing locals use.",
    tip:
      "Spanish 'h' is ALWAYS silent. 'Hola' is 'OH-lah', never 'HOH-lah'. The single exception is the digraph 'ch' (chico, mucho) where it functions as a consonant cluster, not a silent letter. If you only fix one English-speaker habit on day one, fix this.",
    regional_variants: [
      {
        meaning: "casual hello",
        peninsular: "hola, ¿qué pasa?",
        latam: "hola, ¿qué tal?",
        note: "Spain's ¿qué pasa? sounds vaguely confrontational in some LatAm contexts. ¿Qué tal? works everywhere.",
      },
    ],
  },

  // ── 2. greetings — spanish_greetings_introductions ─────────────────────
  {
    id: "spanish_greetings_introductions",
    level: "A1",
    category: "greetings",
    title: "Introducing yourself",
    subtitle: "Me llamo... ¿Y tú?",
    sentences: [
      {
        spanish: "Me llamo Sarah.",
        english: "My name is Sarah. (Literally: I call myself Sarah.)",
        pronunciation: "meh YAH-moh SAH-rah",
        pronunciation_focus: ["'ll' is 'y' sound in most dialects; 'j' sound in Argentina/Uruguay"],
        note: "Most common way to introduce yourself. Reflexive — literally 'I call myself X'.",
      },
      {
        spanish: "Soy de Estados Unidos.",
        english: "I'm from the United States.",
        pronunciation: "soy deh ehs-TAH-dohs oo-NEE-dohs",
        pronunciation_focus: ["'s' at end of words is aspirated in Caribbean Spanish"],
        note: "Notice 'soy' (ser) — origin is permanent, so it's ser not estar.",
      },
      {
        spanish: "¿Cómo te llamas?",
        english: "What's your name? (informal)",
        pronunciation: "KOH-moh teh YAH-mahs",
        pronunciation_focus: ["Reflexive 'te' — required, not optional"],
        note: "Formal: ¿Cómo se llama?",
      },
      {
        spanish: "Encantado de conocerte.",
        english: "Pleased to meet you. (Said by a male speaker.)",
        pronunciation: "ehn-kahn-TAH-doh deh koh-noh-SEHR-teh",
        pronunciation_focus: ["Final '-do' is softer than English 'do'"],
        note: "Female speaker: 'encantada'. The adjective agrees with the speaker's gender.",
      },
      {
        spanish: "¿De dónde eres?",
        english: "Where are you from?",
        pronunciation: "deh DOHN-deh EH-rehs",
        pronunciation_focus: ["Two question marks: ¿ at start, ? at end"],
        note: "Eres (ser) — again, origin is permanent.",
      },
    ],
    vocabulary: [
      { cell_id: "00037250-d547-42a3-abf4-88b85d8bc699", word: "me llamo", english: "my name is (literally: I call myself)", pronunciation: "meh YAH-moh", part_of_speech: "reflexive phrase" },
      { cell_id: "6a1a6e0e-62bf-4de1-8e36-610362452277", word: "soy", english: "I am (ser — permanent)", pronunciation: "soy", part_of_speech: "verb" },
      { cell_id: "6b1c8fad-7010-4192-a66c-aa2fd4720f62", word: "de", english: "from / of", pronunciation: "deh", part_of_speech: "preposition" },
      { cell_id: "2b9c7630-f2a3-4ac8-b2bd-a581d86a3d7d", word: "encantado/a", english: "pleased (m/f — adjective agrees with speaker)", pronunciation: "ehn-kahn-TAH-doh / -dah", part_of_speech: "adjective", gender: "mf" },
      { cell_id: "1d8abfef-6405-444e-b68e-63f85ab96a28", word: "tú", english: "you (informal singular)", pronunciation: "TOO", part_of_speech: "pronoun" },
      { cell_id: "a720a3f8-93e7-459d-846b-541e5684cb6d", word: "usted", english: "you (formal singular)", pronunciation: "oos-TEHD", part_of_speech: "pronoun" },
    ],
    grammar: [
      {
        point: "tú vs usted",
        explanation:
          "Spanish forces a politeness choice on every conversation. Tú is informal — peers, friends, anyone younger. Usted is formal — older strangers, professional contexts, anyone in authority. Spain uses tú broadly (even with strangers your age); LatAm tends more formal with usted in service contexts. When in doubt, start with usted and let the other person invite tú.",
        examples: [
          { spanish: "¿Cómo te llamas? (tú)", english: "What's your name? (to a peer)" },
          { spanish: "¿Cómo se llama? (usted)", english: "What's your name? (to a stranger / elder)" },
        ],
      },
    ],
    dialogue: [
      { cell_id: "74df5e1d-f016-48f2-a899-fd615d5e0cd0", speaker: "Profesora", spanish: "Hola, buenos días. ¿Cómo se llama?", english: "Hello, good morning. What's your name?", pronunciation: "OH-lah, BWEH-nohs DEE-ahs. KOH-moh seh YAH-mah?", register: "formal" },
      { cell_id: "43af01cf-593c-4e5f-a5ba-b660224de940", speaker: "Estudiante", spanish: "Me llamo Tom. Soy de Inglaterra.", english: "My name is Tom. I'm from England.", pronunciation: "meh YAH-moh tahm. soy deh een-glah-TEH-rrah", register: "neutral" },
      { cell_id: "39dd1814-e2f1-4ed7-a830-7d6f3da392c0", speaker: "Profesora", spanish: "Encantada. Bienvenido a la clase.", english: "Pleased to meet you. Welcome to the class.", pronunciation: "ehn-kahn-TAH-dah. byehn-veh-NEE-doh ah lah KLAH-seh", register: "formal" },
    ],
    cultural_note:
      "Hispanic names often have two surnames — father's first, mother's second. María García López uses 'García' as her primary surname (first one). When you write to her, address as 'Sra. García', not 'Sra. López'. This trips up many English speakers who default to the last word. Latin America increasingly uses hyphenated forms or drops the maternal surname, but Spain holds the two-surname convention strictly.",
    tip:
      "Spanish nationality adjectives are NOT capitalized: 'soy estadounidense' (American), 'soy inglés' (English), 'soy mexicana' (Mexican female). Only proper nouns are capitalized — country names are, nationalities aren't.",
  },

  // ── 3. ser_estar_intro — spanish_ser_estar_overview ────────────────────
  {
    id: "spanish_ser_estar_overview",
    level: "A1",
    category: "ser_estar_intro",
    title: "Ser vs estar — the two 'to be's",
    subtitle: "Yo soy / yo estoy — and why it matters",
    intro:
      "Spanish has two verbs for 'to be'. Ser is for permanent traits — who you are, where you're from, what you do. Estar is for temporary states — where you are right now, how you feel today. Mixing them up doesn't just sound wrong; it can change the meaning of a sentence. 'Es aburrido' = he is boring (a person). 'Está aburrido' = he is bored (right now). Same word, different verb, completely different sentence.",
    sentences: [
      {
        spanish: "Yo soy de Canadá.",
        english: "I am from Canada. (Origin — permanent, ser.)",
        pronunciation: "yoh SOY deh kah-nah-DAH",
        pronunciation_focus: ["'y' in yo is hardly pronounced in fast speech"],
        note: "Where you're FROM uses ser. Where you ARE (right now) uses estar.",
      },
      {
        spanish: "Estoy en Madrid.",
        english: "I am in Madrid. (Location — temporary, estar.)",
        pronunciation: "ehs-TOY ehn mah-DREED",
        pronunciation_focus: ["Final 'd' in Madrid is almost silent in Spain"],
        note: "Location uses estar even for permanent buildings: 'Madrid está en España.'",
      },
      {
        spanish: "Ella es médica.",
        english: "She is a doctor. (Profession — defining, ser.)",
        pronunciation: "EH-yah ehs MEH-dee-kah",
        pronunciation_focus: ["No article 'una' before profession with ser"],
        note: "Notice no 'una' — Spanish drops the article before profession when using ser.",
      },
      {
        spanish: "Estoy cansado.",
        english: "I am tired. (State — temporary, estar.)",
        pronunciation: "ehs-TOY kahn-SAH-doh",
        pronunciation_focus: ["'ado' ending is often softened to 'ao' in fast speech"],
        note: "Feminine speaker: 'estoy cansada'. Adjective agrees.",
      },
      {
        spanish: "La sopa está caliente.",
        english: "The soup is hot. (Right now — estar.)",
        pronunciation: "lah SOH-pah ehs-TAH kah-LYEHN-teh",
        pronunciation_focus: ["'ie' diphthong is 'ye' sound"],
        note: "If you said 'la sopa es caliente', a Spanish speaker would assume you mean it's a 'hot soup' kind of soup (its category), not that it happens to be hot now.",
      },
    ],
    vocabulary: [
      { cell_id: "6e8dad9b-2463-46ad-a6b5-2a851483c2ec", word: "ser", english: "to be (permanent / defining)", pronunciation: "SEHR", part_of_speech: "verb" },
      { cell_id: "b0fcceb7-c006-489f-83b4-0a0563af3761", word: "estar", english: "to be (temporary / location / state)", pronunciation: "ehs-TAHR", part_of_speech: "verb" },
      { cell_id: "3414f26a-70ec-4885-9d1a-e3169d326df6", word: "soy", english: "I am (ser)", pronunciation: "soy", part_of_speech: "verb" },
      { cell_id: "0ac70cb8-d33e-4e01-864f-1d6525ec546a", word: "estoy", english: "I am (estar)", pronunciation: "ehs-TOY", part_of_speech: "verb" },
      { cell_id: "4052579a-f9a9-4c03-a44d-162f97ca1046", word: "eres", english: "you are (ser, informal)", pronunciation: "EH-rehs", part_of_speech: "verb" },
      { cell_id: "f64e353c-529c-44a8-b308-03587447e3eb", word: "estás", english: "you are (estar, informal)", pronunciation: "ehs-TAHS", part_of_speech: "verb" },
      { cell_id: "4c36d19a-df54-4f8a-a84b-226adbf79d7e", word: "es", english: "he/she/it is (ser)", pronunciation: "ehs", part_of_speech: "verb" },
      { cell_id: "8b456e91-a0ed-41e3-8b0c-7d93f1e084a8", word: "está", english: "he/she/it is (estar)", pronunciation: "ehs-TAH", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "When to use ser",
        explanation:
          "Permanent or defining traits. Origin, nationality, profession, physical characteristics, personality, relationships, time, possession. Anything you'd answer with 'who/what is this'.",
        examples: [
          { spanish: "Soy estudiante.", english: "I am a student. (defining)" },
          { spanish: "Es alto.", english: "He is tall. (trait)" },
          { spanish: "Son las tres.", english: "It's three o'clock. (time)" },
        ],
      },
      {
        point: "When to use estar",
        explanation:
          "Temporary states, location, ongoing actions, feelings. Anything you'd answer with 'how is this right now / where is this'.",
        examples: [
          { spanish: "Estoy en casa.", english: "I am at home. (location)" },
          { spanish: "Está triste.", english: "She is sad. (feeling)" },
          { spanish: "Estamos estudiando.", english: "We are studying. (ongoing action)" },
        ],
      },
    ],
    cultural_note:
      "Native speakers don't think about the ser/estar rule consciously — they pick based on whether the trait feels inherent or situational. As an English speaker, you'll catch yourself defaulting to ser ('es') because 'is' feels neutral. Train yourself: if you can attach 'right now' or 'today' to the English sentence, use estar.",
    tip:
      "Memorize the 'DOCTOR/PLACE' mnemonic for ser/estar: Ser = Description, Occupation, Characteristic, Time, Origin, Relationship. Estar = Position, Location, Action, Condition, Emotion. Imperfect but it's the fastest scaffolding for the first three months until you build feel.",
  },

  // ── 4. ser_estar_intro — spanish_ser_estar_practice ────────────────────
  {
    id: "spanish_ser_estar_practice",
    level: "A1",
    category: "ser_estar_intro",
    title: "Ser vs estar — exercises and edge cases",
    subtitle: "The minimal-pair sentences that change meaning",
    intro:
      "Same adjective, different verb, different meaning. These are the pairs that catch every learner. Worth memorizing — they show up constantly.",
    sentences: [
      {
        spanish: "Es aburrido.",
        english: "He is boring. (His personality — ser.)",
        pronunciation: "ehs ah-boo-RREE-doh",
        pronunciation_focus: ["Rolled 'rr' is the long trill, two-second roll"],
        note: "If you call your date 'es aburrido', you're saying they ARE a boring person. Wrong verb = relationship ruined.",
      },
      {
        spanish: "Está aburrido.",
        english: "He is bored. (Right now — estar.)",
        pronunciation: "ehs-TAH ah-boo-RREE-doh",
        pronunciation_focus: ["Stress on the final syllable: aburri-DO"],
        note: "Same word 'aburrido' — but with estar it means the temporary state.",
      },
      {
        spanish: "Es lista.",
        english: "She is smart / clever. (Trait — ser.)",
        pronunciation: "ehs LEES-tah",
        pronunciation_focus: ["'i' is short, like 'ee' but quick"],
        note: "Listo/a with ser = intelligent.",
      },
      {
        spanish: "Está lista.",
        english: "She is ready. (State — estar.)",
        pronunciation: "ehs-TAH LEES-tah",
        pronunciation_focus: ["Notice the verb shift completely changes the adjective's meaning"],
        note: "Same word — with estar it means 'ready to go'.",
      },
      {
        spanish: "Es rico.",
        english: "He is rich. (Wealth — ser.)",
        pronunciation: "ehs RREE-koh",
        pronunciation_focus: ["Initial 'r' in 'rico' is the rolled trill"],
        note: "About food, 'es rico' = the food itself is delicious/rich. About a person, wealth.",
      },
    ],
    grammar: [
      {
        point: "Ser/estar with adjectives that change meaning",
        explanation:
          "Spanish doesn't add words — it changes verbs. Memorize these high-frequency pairs and you'll skip months of confused conversations.",
        examples: [
          { spanish: "Es bueno (good person) / Está bueno (it tastes good / he looks hot)", english: "" },
          { spanish: "Es malo (bad person) / Está malo (sick or spoiled food)", english: "" },
          { spanish: "Es callado (quiet personality) / Está callado (silent right now)", english: "" },
          { spanish: "Es vivo (sharp / clever) / Está vivo (alive)", english: "" },
        ],
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction: "Fill in with ser (es/soy) or estar (está/estoy). Watch the meaning cue.",
        items: [
          { prompt: "Madrid ___ en España.", answer: "está" },
          { prompt: "Yo ___ de Estados Unidos.", answer: "soy" },
          { prompt: "La pizza ___ caliente, no la toques.", answer: "está" },
          { prompt: "Mi hermana ___ médica.", answer: "es" },
          { prompt: "Hoy ___ muy cansado.", answer: "estoy" },
        ],
      },
    ],
    cultural_note:
      "Spanish speakers will sometimes deliberately use the 'wrong' verb for effect. Calling a soup 'es caliente' implies the soup belongs to a hot-soup tradition (vs. cold gazpacho). Calling someone 'está guapo' (with estar) instead of 'es guapo' (with ser) implies they look especially handsome today, vs. always. Native speakers play with this.",
    tip:
      "When you're stuck mid-sentence, default to ESTAR. English speakers chronically over-use ser. If the sentence is about location, an ongoing condition, or a feeling, estar is right ~85% of the time.",
  },

  // ── 5. gendered_nouns — spanish_gender_articles ────────────────────────
  {
    id: "spanish_gender_articles",
    level: "A1",
    category: "gendered_nouns",
    title: "Gender & articles — el, la, los, las",
    subtitle: "Every Spanish noun is masculine or feminine. Learn them together.",
    intro:
      "There's no neutral 'the' in Spanish. Every noun has a gender, and the article (el/la/los/las) and any adjectives that touch it must match. Memorize nouns with their article — 'la mesa' not 'mesa', 'el libro' not 'libro'. This is the single highest-ROI habit you can build at A1.",
    sentences: [
      {
        spanish: "El libro está en la mesa.",
        english: "The book is on the table.",
        pronunciation: "ehl LEE-broh ehs-TAH ehn lah MEH-sah",
        pronunciation_focus: ["'l' is soft, never the velar 'l' of English 'wall'"],
        note: "El (m) for libro, la (f) for mesa. Article tells you gender.",
      },
      {
        spanish: "La casa es grande.",
        english: "The house is big.",
        pronunciation: "lah KAH-sah ehs GRAHN-deh",
        pronunciation_focus: ["'casa' has English-like vowels — clear AH"],
        note: "Casa is feminine despite ending in -a being only loosely a gender cue.",
      },
      {
        spanish: "Los gatos son simpáticos.",
        english: "The cats are nice.",
        pronunciation: "lohs GAH-tohs sohn seem-PAH-tee-kohs",
        pronunciation_focus: ["Stress on the second syllable: sim-PA-ti-cos"],
        note: "Plural: los (m), las (f). Adjective also pluralizes and agrees.",
      },
      {
        spanish: "Las flores son bonitas.",
        english: "The flowers are pretty.",
        pronunciation: "lahs FLOH-rehs sohn boh-NEE-tahs",
        pronunciation_focus: ["Final 's' is voiced in most Spanish accents"],
        note: "Bonitas matches flores in gender (f) and number (plural).",
      },
      {
        spanish: "Un café, por favor.",
        english: "A coffee, please.",
        pronunciation: "oon kah-FEH, pohr fah-VOHR",
        pronunciation_focus: ["'un' is short, almost 'oon'"],
        note: "Indefinite article: un (m), una (f). Plural unos / unas = some.",
      },
    ],
    vocabulary: [
      { cell_id: "d183d498-33f0-4145-be84-38d7102c6756", word: "el libro", english: "the book", pronunciation: "ehl LEE-broh", part_of_speech: "noun", gender: "m" },
      { cell_id: "495526bd-e6c3-438d-967f-c15fe24bcca5", word: "la mesa", english: "the table", pronunciation: "lah MEH-sah", part_of_speech: "noun", gender: "f" },
      { cell_id: "3402caae-894e-411e-a752-79f95967b3d2", word: "el coche", english: "the car (Spain)", pronunciation: "ehl KOH-cheh", part_of_speech: "noun", gender: "m", regional: [{ region: "LatAm", form: "el carro", note: "Used across most of Latin America; auto is also common." }] },
      { cell_id: "51bf9fe6-0e3f-4fa8-9b71-1d5820e8a709", word: "la casa", english: "the house", pronunciation: "lah KAH-sah", part_of_speech: "noun", gender: "f" },
      { cell_id: "12d0bdf8-bb1d-4cd9-9114-769c3a9f2258", word: "el día", english: "the day", pronunciation: "ehl DEE-ah", part_of_speech: "noun", gender: "m", regional: [{ region: "all", form: "el día", note: "Ends in -a but is MASCULINE. Common irregular. Same with: el mapa, el sofá, el problema, el sistema, el clima." }] },
      { cell_id: "31e8f8f2-2010-4ce0-a2bb-8953a348c5b6", word: "la mano", english: "the hand", pronunciation: "lah MAH-noh", part_of_speech: "noun", gender: "f", regional: [{ region: "all", form: "la mano", note: "Ends in -o but is FEMININE. Common irregular. Same with: la foto (foto-grafía), la moto (moto-cicleta), la radio." }] },
    ],
    grammar: [
      {
        point: "Gender-marker rules and the exceptions that always show up on exams",
        explanation:
          "Default rules: words ending in -o are masculine (el libro, el gato, el momento), words ending in -a are feminine (la casa, la mesa, la fiesta). BUT — and this is the part that catches everyone: several common everyday nouns break the rule. El día, el mapa, el problema, el sistema, el sofá, el clima are all masculine despite -a endings (most have Greek origins). La mano, la foto, la moto, la radio are feminine despite -o endings. Words ending in -ción, -sión, -dad, -tad, -tud are almost always feminine. Words ending in consonants other than -d / -z are usually masculine. Always check; never assume.",
        examples: [
          { spanish: "el problema (m)", english: "the problem — Greek origin, masculine despite -a" },
          { spanish: "la mano (f)", english: "the hand — irregular, feminine despite -o" },
          { spanish: "la libertad (f)", english: "the freedom — -tad ending = feminine" },
        ],
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction: "Match each noun to its correct article (el / la).",
        items: [
          { prompt: "libro", answer: "el" },
          { prompt: "mesa", answer: "la" },
          { prompt: "día", answer: "el" },
          { prompt: "mano", answer: "la" },
          { prompt: "casa", answer: "la" },
          { prompt: "problema", answer: "el" },
        ],
      },
    ],
    cultural_note:
      "The Royal Spanish Academy (RAE) is the official authority on Spanish, but it's increasingly catching up to usage. Words like 'el internet' vs 'la internet' shift regionally — Spain leans 'el', Mexico leans 'la'. The RAE finally accepted both in 2010. Don't stress; pick one and stay consistent.",
    tip:
      "Always learn nouns WITH their article — not 'mesa' but 'la mesa'. Spanish-speaking children learn it this way, and so do successful adult learners. If you ever write a flashcard with just 'mesa', you're doing it wrong.",
  },

  // ── 6. gendered_nouns — spanish_gender_adjectives ──────────────────────
  {
    id: "spanish_gender_adjectives",
    level: "A1",
    category: "gendered_nouns",
    title: "Adjective agreement — the most-broken A1 rule",
    subtitle: "Adjectives agree with the noun in gender AND number",
    intro:
      "When an adjective describes a noun, it has to MATCH that noun. Feminine noun = feminine adjective. Plural noun = plural adjective. English speakers chronically forget this because English doesn't do it. Fix it once and you'll sound fluent in basic conversation.",
    sentences: [
      {
        spanish: "El gato es negro.",
        english: "The cat is black. (m singular)",
        pronunciation: "ehl GAH-toh ehs NEH-groh",
        pronunciation_focus: ["'g' before 'a' / 'o' / 'u' is hard like English 'g' in 'gate'"],
        note: "Default form. -o for masculine singular.",
      },
      {
        spanish: "La gata es negra.",
        english: "The (female) cat is black. (f singular)",
        pronunciation: "lah GAH-tah ehs NEH-grah",
        pronunciation_focus: ["Same 'g' rule applies"],
        note: "Adjective flips from -o to -a to match feminine gata.",
      },
      {
        spanish: "Los gatos son negros.",
        english: "The cats are black. (m plural)",
        pronunciation: "lohs GAH-tohs sohn NEH-grohs",
        pronunciation_focus: ["Final 's' is pronounced everywhere except some Caribbean accents"],
        note: "Adjective takes -s plural ending.",
      },
      {
        spanish: "Las casas son grandes.",
        english: "The houses are big. (f plural)",
        pronunciation: "lahs KAH-sahs sohn GRAHN-dehs",
        pronunciation_focus: ["'grande' is one of the adjectives that don't change for gender"],
        note: "Notice: grande stays 'grande' for both m and f. Only adds -s for plural. Adjectives ending in -e are gender-neutral.",
      },
      {
        spanish: "Es un libro interesante.",
        english: "It's an interesting book.",
        pronunciation: "ehs oon LEE-broh een-teh-reh-SAHN-teh",
        pronunciation_focus: ["'interesante' — stress on the third syllable"],
        note: "Interesante ends in -e, so same form for m/f.",
      },
    ],
    vocabulary: [
      { cell_id: "4200dbcb-d9de-452a-8f13-da1a4edc23b5", word: "grande", english: "big", pronunciation: "GRAHN-deh", part_of_speech: "adjective", regional: [{ region: "all", form: "grande", note: "Same form for m/f. Plural: grandes. Shortens to 'gran' before any singular noun: 'un gran amigo'." }] },
      { cell_id: "9eab6292-d3d4-4adc-bd1f-6db084571ddd", word: "pequeño/a", english: "small", pronunciation: "peh-KEH-nyoh / -nyah", part_of_speech: "adjective", gender: "mf" },
      { cell_id: "e5a5fefa-0918-4c98-8efa-82f41635a624", word: "bonito/a", english: "pretty / nice-looking", pronunciation: "boh-NEE-toh / -tah", part_of_speech: "adjective", gender: "mf" },
      { cell_id: "4cb674f8-90a5-42c7-b6eb-bd95ee74eef4", word: "feo/a", english: "ugly", pronunciation: "FEH-oh / -ah", part_of_speech: "adjective", gender: "mf" },
      { cell_id: "d1cdec05-a742-47d5-97bc-8352259eaf00", word: "interesante", english: "interesting", pronunciation: "een-teh-reh-SAHN-teh", part_of_speech: "adjective" },
      { cell_id: "d672eb31-6967-4579-ac47-78ec5d65d7d8", word: "difícil", english: "difficult", pronunciation: "dee-FEE-seel", part_of_speech: "adjective" },
      { cell_id: "61c51846-1ca0-4b95-857f-d1c64a403023", word: "fácil", english: "easy", pronunciation: "FAH-seel", part_of_speech: "adjective" },
    ],
    grammar: [
      {
        point: "Adjective placement",
        explanation:
          "Default position is AFTER the noun: 'la casa grande' (the big house), 'un coche rojo' (a red car). Some adjectives flip in front of the noun for emphasis or stylistic reasons (gran, buen, mal, primer) and a few change meaning when placed before vs after. As a rule of thumb at A1: after the noun. You're never wrong putting an adjective after.",
        examples: [
          { spanish: "la casa grande", english: "the big house (neutral)" },
          { spanish: "una gran casa", english: "a great house (figurative)" },
          { spanish: "un buen amigo", english: "a good friend (positions for emphasis)" },
        ],
      },
    ],
    cultural_note:
      "Vietnamese speakers learning Spanish often nail gender quickly because of Vietnamese's classifier system — your brain is already trained to think of nouns categorically. English speakers struggle more because English flattened gender out of nouns 800 years ago. The fix is the same regardless: learn the article with the noun, every time.",
    tip:
      "When you forget a noun's gender, listen to YOUR OWN voice say it both ways: 'la casa', 'el casa'. One sounds wrong. Native speakers do this all the time. Your ear catches mistakes faster than your rule-memory.",
  },

  // ── 7. present_tense — spanish_present_tense_regular ───────────────────
  {
    id: "spanish_present_tense_regular",
    level: "A1",
    category: "present_tense",
    title: "Present tense — regular -ar / -er / -ir verbs",
    subtitle: "Hablar, comer, vivir — the patterns 70% of verbs follow",
    intro:
      "Spanish verbs split into three groups by their infinitive ending: -ar, -er, -ir. The regular ones in each group follow the same conjugation pattern. Memorize one of each (hablar, comer, vivir) and you can conjugate hundreds of verbs.",
    sentences: [
      {
        spanish: "Hablo español un poco.",
        english: "I speak a little Spanish.",
        pronunciation: "AH-bloh ehs-pah-NYOHL oon POH-koh",
        pronunciation_focus: ["'ñ' is 'ny' sound — like English 'canyon'"],
        note: "Subject pronoun 'yo' is usually dropped — the verb ending tells you who.",
      },
      {
        spanish: "Comemos en casa esta noche.",
        english: "We're eating at home tonight.",
        pronunciation: "koh-MEH-mohs ehn KAH-sah EHS-tah NOH-cheh",
        pronunciation_focus: ["'h' in 'casa' silent; emphasis: COH-cheh, not coh-CHEH"],
        note: "Present tense in Spanish covers both English 'we eat' AND 'we are eating'. Context disambiguates.",
      },
      {
        spanish: "Vivimos en Barcelona.",
        english: "We live in Barcelona.",
        pronunciation: "vee-VEE-mohs ehn bar-seh-LOH-nah",
        pronunciation_focus: ["Barcelona's 'c' is 'th' in Spain, 's' in LatAm"],
        note: "Vivir = to live (in a place / to be alive). -imos for nosotros.",
      },
      {
        spanish: "¿Hablas inglés?",
        english: "Do you speak English?",
        pronunciation: "AH-blahs een-GLEHS",
        pronunciation_focus: ["Inglés has stress on the final syllable"],
        note: "Question word order is the same as statement — only intonation rises.",
      },
      {
        spanish: "Mis padres trabajan en Madrid.",
        english: "My parents work in Madrid.",
        pronunciation: "mees PAH-drehs trah-BAH-hahn ehn mah-DREED",
        pronunciation_focus: ["'j' is the harsh 'h' sound — like clearing your throat"],
        note: "Trabajar (to work) — note the 'j' pronunciation.",
      },
    ],
    grammar: [
      {
        point: "Regular -ar verbs (hablar = to speak)",
        explanation:
          "Drop -ar, add: yo -o, tú -as, él/ella/usted -a, nosotros -amos, vosotros -áis (Spain only), ellos/ustedes -an. Vosotros is the informal you-plural used in Spain only; LatAm uses ustedes for both formal and informal you-plural.",
        examples: [
          { spanish: "yo hablo", english: "I speak" },
          { spanish: "tú hablas", english: "you speak (informal)" },
          { spanish: "él/ella habla", english: "he/she speaks" },
          { spanish: "nosotros hablamos", english: "we speak" },
          { spanish: "vosotros habláis", english: "you all speak (Spain)" },
          { spanish: "ellos hablan", english: "they speak" },
        ],
      },
      {
        point: "Regular -er verbs (comer = to eat) and -ir verbs (vivir = to live)",
        explanation:
          "Drop -er or -ir, add: yo -o, tú -es, él/ella/usted -e, nosotros -emos (-er) or -imos (-ir), vosotros -éis (-er) or -ís (-ir), ellos/ustedes -en. Notice -er and -ir share most endings — the difference is only in the nosotros and vosotros forms.",
        examples: [
          { spanish: "como / comes / come / comemos / coméis / comen", english: "I eat, you eat, he eats, etc." },
          { spanish: "vivo / vives / vive / vivimos / vivís / viven", english: "I live, you live, he lives, etc." },
        ],
      },
    ],
    vocabulary: [
      { cell_id: "71db8285-3e6d-4b44-bdb4-d896857ad97b", word: "hablar", english: "to speak", pronunciation: "ah-BLAHR", part_of_speech: "verb" },
      { cell_id: "1a0192ca-3d9a-4538-b604-b44cc605a0ea", word: "comer", english: "to eat", pronunciation: "koh-MEHR", part_of_speech: "verb" },
      { cell_id: "bc1f873d-3634-4f5b-980e-cb16ae7a2889", word: "vivir", english: "to live", pronunciation: "vee-VEER", part_of_speech: "verb" },
      { cell_id: "481eb09f-4441-40db-8b0c-93cb9b483c30", word: "trabajar", english: "to work", pronunciation: "trah-bah-HAHR", part_of_speech: "verb" },
      { cell_id: "e9cc9a64-d349-40ca-a0b7-7bcc7de55b61", word: "estudiar", english: "to study", pronunciation: "ehs-too-DYAHR", part_of_speech: "verb" },
      { cell_id: "add42e32-2f06-41bb-b780-2a28ae83d629", word: "beber", english: "to drink", pronunciation: "beh-BEHR", part_of_speech: "verb" },
      { cell_id: "5586b2ef-1c8d-4933-bf94-5ab811a0b8a2", word: "escribir", english: "to write", pronunciation: "ehs-kree-BEER", part_of_speech: "verb" },
    ],
    cultural_note:
      "Vosotros (informal you-plural) is Spain's signature. Across all of Latin America, that form is essentially extinct — they use 'ustedes' for both formal and informal you-plural. If you're learning Spanish for Spain, learn vosotros conjugations. If you're learning for LatAm, you can skip them entirely for active use, but recognize them in writing (movies, books, news).",
    tip:
      "Don't try to memorize the conjugation tables. Pick three sentences per verb (one each for yo, tú, ellos), repeat aloud daily for a week, and the patterns slot into your speech without conscious work. Tables are reference; speech is muscle memory.",
  },

  // ── 8. present_tense — spanish_present_tense_irregular_yo ──────────────
  {
    id: "spanish_present_tense_irregular_yo",
    level: "A1",
    category: "present_tense",
    title: "Irregular yo-forms — tener, hacer, poner, salir, conocer",
    subtitle: "The verbs that misbehave only in the 'I' form",
    intro:
      "A whole class of Spanish verbs is regular EXCEPT for the yo (I) form, where they take -go or -zco endings. Tener (to have), hacer (to do/make), poner (to put), salir (to leave/go out), conocer (to know a person) all fit this pattern. They're among the most-used verbs in Spanish — worth memorizing as a group.",
    sentences: [
      {
        spanish: "Tengo dos hermanos.",
        english: "I have two brothers / siblings.",
        pronunciation: "TEHN-goh dohs ehr-MAH-nohs",
        pronunciation_focus: ["Stress on the first syllable: TEN-go"],
        note: "Tener → tengo (irregular yo) but tienes / tiene / tenemos / tenéis / tienen are mostly regular. (tienes / tiene are e→ie stem-changing — covered later.)",
      },
      {
        spanish: "Hago la cena los viernes.",
        english: "I make dinner on Fridays.",
        pronunciation: "AH-goh lah SEH-nah lohs VYEHR-nehs",
        pronunciation_focus: ["'h' is silent; 'hago' sounds like 'AH-goh'"],
        note: "Hacer = to do OR to make. Yo form: hago. Tú: haces. Él: hace.",
      },
      {
        spanish: "Pongo el libro en la mesa.",
        english: "I put the book on the table.",
        pronunciation: "POHN-goh ehl LEE-broh ehn lah MEH-sah",
        pronunciation_focus: ["Poner: 'po-NER' — but yo form is 'PON-go'"],
        note: "Poner = to put / place. Yo: pongo. Tú: pones. Él: pone. (Regular except yo.)",
      },
      {
        spanish: "Salgo a las ocho.",
        english: "I leave / go out at eight.",
        pronunciation: "SAHL-goh ah lahs OH-choh",
        pronunciation_focus: ["'salir' has 'lir' ending but yo form replaces with '-lgo'"],
        note: "Salir = to leave a place / to go out. Yo: salgo. Tú: sales. Él: sale.",
      },
      {
        spanish: "Conozco a Carlos.",
        english: "I know Carlos. (I'm acquainted with him.)",
        pronunciation: "koh-NOHS-koh ah KAR-lohs",
        pronunciation_focus: ["'c' before 'o' is 'k' sound; in conozco the 'z' makes a 'th' (Spain) or 's' (LatAm)"],
        note: "Conocer = to know a person/place. The 'a' before Carlos is the 'personal a' — required before direct-object people.",
      },
    ],
    grammar: [
      {
        point: "The -go and -zco irregular yo patterns",
        explanation:
          "Group 1 (-go): tener→tengo, hacer→hago, poner→pongo, salir→salgo, venir→vengo, traer→traigo, decir→digo. Group 2 (-zco): conocer→conozco, parecer→parezco, conducir→conduzco (drive — verbs ending in -cer or -cir). These yo-forms are irregular but everything else (tú, él, nosotros, etc.) conjugates predictably. Worth a flashcard set.",
        examples: [
          { spanish: "tener → tengo, tienes, tiene, tenemos, tienen", english: "to have" },
          { spanish: "hacer → hago, haces, hace, hacemos, hacen", english: "to do/make" },
          { spanish: "conocer → conozco, conoces, conoce, conocemos, conocen", english: "to know (a person)" },
        ],
      },
      {
        point: "Conocer vs saber — both mean 'to know'",
        explanation:
          "Saber = to know a FACT or HOW to do something. Conocer = to know a PERSON or be FAMILIAR with a place. 'Sé inglés' = I know English (have learned it as a fact). 'Conozco Madrid' = I know Madrid (I'm familiar with it, I've been there). English collapses both into 'know'; Spanish forces the distinction.",
        examples: [
          { spanish: "Sé hablar español.", english: "I know how to speak Spanish. (skill)" },
          { spanish: "Conozco a tu hermana.", english: "I know your sister. (acquaintance)" },
          { spanish: "¿Conoces Barcelona?", english: "Have you been to Barcelona? (familiarity with a place)" },
        ],
      },
    ],
    vocabulary: [
      { cell_id: "025be749-7a4f-4793-b490-a3d558b79d73", word: "tener", english: "to have", pronunciation: "teh-NEHR", part_of_speech: "verb" },
      { cell_id: "9d06e8ff-159a-4934-a9ba-4b64be8ef98d", word: "tengo", english: "I have", pronunciation: "TEHN-goh", part_of_speech: "verb" },
      { cell_id: "fbff1683-261c-4664-ac74-c977bcdda2ef", word: "hacer", english: "to do / to make", pronunciation: "ah-SEHR", part_of_speech: "verb" },
      { cell_id: "db5db9f1-9865-4413-81d0-0d46189e3f1f", word: "hago", english: "I do / I make", pronunciation: "AH-goh", part_of_speech: "verb" },
      { cell_id: "b9794414-5cfc-4af8-a96b-3399f8c0f106", word: "poner", english: "to put / to place", pronunciation: "poh-NEHR", part_of_speech: "verb" },
      { cell_id: "6e9e4f0b-c4c5-4ff5-8e74-95ef2f4132e3", word: "salir", english: "to leave / to go out", pronunciation: "sah-LEER", part_of_speech: "verb" },
      { cell_id: "66b32741-db6f-46d4-8965-64f4458770c5", word: "conocer", english: "to know (a person/place)", pronunciation: "koh-noh-SEHR", part_of_speech: "verb" },
      { cell_id: "a3f7c858-22c7-480c-9731-531885eb681c", word: "saber", english: "to know (a fact / how to)", pronunciation: "sah-BEHR", part_of_speech: "verb" },
    ],
    cultural_note:
      "When Spanish speakers ask 'tienes hambre?' (literally: do you have hunger?), they're asking 'are you hungry?'. Spanish uses 'tener' for many states English uses 'to be' for: tengo frío (I'm cold), tengo sueño (I'm sleepy), tengo miedo (I'm afraid), tengo razón (I'm right), tengo 30 años (I'm 30 — literally 'I have 30 years'). Don't translate word-for-word; the idiom is 'have + state' in Spanish.",
    tip:
      "If you only memorize five irregular yo-forms at A1, make them: tengo, hago, voy (from ir), digo (from decir), and soy (from ser). Together they cover ~80% of natural speech.",
  },

  // ── 9. numbers — spanish_numbers_basic ────────────────────────────────
  {
    id: "spanish_numbers_basic",
    level: "A1",
    category: "numbers",
    title: "Numbers — 0 to 100",
    subtitle: "Counting, prices, and the weird thirty-pattern that breaks the rule",
    sentences: [
      {
        spanish: "Tengo veintisiete años.",
        english: "I'm twenty-seven years old. (Literally: I have 27 years.)",
        pronunciation: "TEHN-goh veyn-tee-SYEH-teh AH-nyohs",
        pronunciation_focus: ["21-29 are all single words: veintiuno, veintidós..."],
        note: "Spanish uses 'tener' for age. Don't say 'soy 27' — that's incorrect.",
      },
      {
        spanish: "Cuesta treinta y cinco euros.",
        english: "It costs thirty-five euros.",
        pronunciation: "KWEHS-tah TREYN-tah ee SEEN-koh EW-rohs",
        pronunciation_focus: ["From 31-99, numbers split: treinta Y cinco, with 'y' between"],
        note: "From 31 onward: tens + 'y' + units. So 35 = treinta y cinco, 47 = cuarenta y siete.",
      },
      {
        spanish: "El número es ochenta y dos.",
        english: "The number is eighty-two.",
        pronunciation: "ehl NOO-meh-roh ehs oh-CHEN-tah ee dohs",
        pronunciation_focus: ["'ochenta' has stress on second-to-last syllable"],
        note: "Same pattern: ochenta + y + dos.",
      },
      {
        spanish: "Mi dirección es Calle Mayor cien.",
        english: "My address is 100 Mayor Street.",
        pronunciation: "mee dee-rehk-SYOHN ehs KAH-yeh mah-YOHR SYEHN",
        pronunciation_focus: ["100 is 'cien' on its own; becomes 'ciento' before another number"],
        note: "100 alone = cien. 101 = ciento uno. 150 = ciento cincuenta.",
      },
      {
        spanish: "Hay cincuenta personas.",
        english: "There are fifty people.",
        pronunciation: "ay seen-KWEHN-tah pehr-SOH-nahs",
        pronunciation_focus: ["'hay' = 'there is/are' — one of the most-used words"],
        note: "Hay (from haber) is unchanging — both 'there is' and 'there are'.",
      },
    ],
    grammar: [
      {
        point: "The number patterns",
        explanation:
          "0-15: each number is its own word — cero, uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce, trece, catorce, quince. 16-29: written as single words — dieciséis, diecisiete...; veintiuno, veintidós... 30+: tens + y + units — treinta y uno, cuarenta y dos, etc. Tens: 10 diez, 20 veinte, 30 treinta, 40 cuarenta, 50 cincuenta, 60 sesenta, 70 setenta, 80 ochenta, 90 noventa.",
        examples: [
          { spanish: "diez, veinte, treinta, cuarenta, cincuenta", english: "10, 20, 30, 40, 50" },
          { spanish: "veintiuno (single word) vs treinta y uno (three words)", english: "21 vs 31 — pattern changes at 30" },
        ],
      },
      {
        point: "Uno → un / una agreement",
        explanation:
          "When 'uno' appears before a masculine noun, it becomes 'un'. Before feminine, 'una'. The number 21, 31, etc. also follow this: veintiún libros (m), veintiuna mesas (f).",
        examples: [
          { spanish: "un libro / una mesa", english: "one book / one table" },
          { spanish: "veintiún años / veintiuna chicas", english: "21 years / 21 girls" },
        ],
      },
    ],
    vocabulary: [
      { cell_id: "25466440-f8ba-4b7c-8622-7d9dc4a525da", word: "uno", english: "one", pronunciation: "OO-noh", part_of_speech: "number" },
      { cell_id: "97285a34-b30c-47c9-8851-93a016eda5ed", word: "diez", english: "ten", pronunciation: "DYEHS", part_of_speech: "number" },
      { cell_id: "318eee5f-2631-4e60-8900-6bd70799674f", word: "veinte", english: "twenty", pronunciation: "VEYN-teh", part_of_speech: "number" },
      { cell_id: "6300be69-ffb4-48eb-9d1f-afb24920a269", word: "treinta", english: "thirty", pronunciation: "TREYN-tah", part_of_speech: "number" },
      { cell_id: "cab503fa-86e9-419d-a78e-fa63fbf8c720", word: "cien", english: "one hundred", pronunciation: "SYEHN", part_of_speech: "number" },
      { cell_id: "c4c1b4ff-b7b8-462d-bb8b-637488bd7a72", word: "el número", english: "the number", pronunciation: "ehl NOO-meh-roh", part_of_speech: "noun", gender: "m" },
      { cell_id: "b2e06fa9-8c25-428a-9e7c-71929e232715", word: "los años", english: "years (literally: the years)", pronunciation: "lohs AH-nyohs", part_of_speech: "noun", gender: "m" },
    ],
    cultural_note:
      "Price-saying conventions differ between Spain and Mexico. In Spain you'd say '€3,50' as 'tres euros con cincuenta' or 'tres con cincuenta'. In Mexico you'd say '$35' as 'treinta y cinco pesos' (no decimals on standard prices). The currency symbol differs too — € in Spain, $ in Mexico/most LatAm (different countries' pesos all use $). Argentina uses peso argentino with the same $.",
    tip:
      "Practice saying your phone number, your address, and your age in Spanish. These are the three numbers you'll use most as a beginner. If you can say them without thinking, you've cracked numbers.",
  },

  // ── 10. time_dates — spanish_time_dates ────────────────────────────────
  {
    id: "spanish_time_dates",
    level: "A1",
    category: "time_dates",
    title: "Time and dates",
    subtitle: "¿Qué hora es? — and Spain's preposition trap",
    sentences: [
      {
        spanish: "¿Qué hora es?",
        english: "What time is it?",
        pronunciation: "keh OH-rah ehs",
        pronunciation_focus: ["'q' = 'k', silent 'u'"],
        note: "Standard question. Answer with es (singular for 1 o'clock) or son (plural for any other).",
      },
      {
        spanish: "Son las tres y media.",
        english: "It's 3:30. (Literally: It's three and half.)",
        pronunciation: "sohn lahs trehs ee MEH-dyah",
        pronunciation_focus: ["'son las' — plural for 2 o'clock onward"],
        note: "Singular form only for 1: 'es la una'. For 2+: 'son las dos / tres / cuatro...'",
      },
      {
        spanish: "Es la una y cuarto.",
        english: "It's 1:15. (Literally: It's one and quarter.)",
        pronunciation: "ehs lah OO-nah ee KWAHR-toh",
        pronunciation_focus: ["'cuarto' has clear 'kw' sound"],
        note: "Note: 'es la una' — singular for 1 o'clock only.",
      },
      {
        spanish: "La reunión es a las dos.",
        english: "The meeting is at two.",
        pronunciation: "lah reh-oo-NYOHN ehs ah lahs dohs",
        pronunciation_focus: ["'a las' = at — preposition for time points"],
        note: "When stating WHEN something is, use 'a las'. The verb itself stays in the present tense.",
      },
      {
        spanish: "Hoy es lunes, dos de mayo.",
        english: "Today is Monday, May 2nd.",
        pronunciation: "oy ehs LOO-nehs, dohs deh MAH-yoh",
        pronunciation_focus: ["Days and months are NOT capitalized in Spanish"],
        note: "Date format: day + month — dos de mayo (May 2). The 'de' is mandatory.",
      },
    ],
    grammar: [
      {
        point: "Telling time",
        explanation:
          "For 1 o'clock: 'es la una'. For 2 onward: 'son las dos / tres / cuatro...'. Add minutes after 'y' (and) for the first 30 minutes: 'son las tres y diez' = 3:10. For minutes past 30, switch to 'menos' (minus) and the NEXT hour: 'son las cuatro menos veinte' = 3:40 (literally 'four minus twenty'). Quarter past = y cuarto. Half past = y media. Quarter to = menos cuarto.",
        examples: [
          { spanish: "Es la una y cinco.", english: "It's 1:05." },
          { spanish: "Son las dos y media.", english: "It's 2:30." },
          { spanish: "Son las tres menos cuarto.", english: "It's 2:45 (lit: 3 minus quarter)." },
        ],
      },
      {
        point: "Days of the week",
        explanation:
          "lunes (Mon), martes (Tue), miércoles (Wed), jueves (Thu), viernes (Fri), sábado (Sat), domingo (Sun). Spanish-speaking countries start the week on MONDAY. Saturday and Sunday are explicitly 'el fin de semana' (the weekend). Days are NOT capitalized.",
        examples: [
          { spanish: "El lunes voy al gimnasio.", english: "On Monday I go to the gym. (specific Monday)" },
          { spanish: "Los lunes voy al gimnasio.", english: "On Mondays I go to the gym. (every Monday)" },
        ],
      },
    ],
    vocabulary: [
      { cell_id: "c2ca893d-0de8-49be-a363-c0f2b1c6a5b7", word: "la hora", english: "the hour / time", pronunciation: "lah OH-rah", part_of_speech: "noun", gender: "f" },
      { cell_id: "afcf691e-7bfd-413e-b035-6856586ee96a", word: "el día", english: "the day", pronunciation: "ehl DEE-ah", part_of_speech: "noun", gender: "m" },
      { cell_id: "540b8055-eda4-498d-bea5-dafa9b76d711", word: "hoy", english: "today", pronunciation: "oy", part_of_speech: "adverb" },
      { cell_id: "df458b33-0338-4935-b3fb-fb5065ab6d6a", word: "mañana", english: "tomorrow / morning", pronunciation: "mah-NYAH-nah", part_of_speech: "adverb", regional: [{ region: "all", form: "mañana", note: "Means BOTH 'tomorrow' AND 'morning' depending on context. Por la mañana = in the morning. Hasta mañana = see you tomorrow." }] },
      { cell_id: "ab2e699e-96e0-4781-a77b-c3f026d911eb", word: "ayer", english: "yesterday", pronunciation: "ah-YEHR", part_of_speech: "adverb" },
      { cell_id: "79fc6216-52a9-4ad6-b8dc-4f62084b5feb", word: "la semana", english: "the week", pronunciation: "lah seh-MAH-nah", part_of_speech: "noun", gender: "f" },
      { cell_id: "6c6584f9-0a2a-47c0-b0e1-747029c192a2", word: "el mes", english: "the month", pronunciation: "ehl mehs", part_of_speech: "noun", gender: "m" },
      { cell_id: "b8ed5982-16e7-41f9-b59f-3b6bf3304428", word: "el año", english: "the year", pronunciation: "ehl AH-nyoh", part_of_speech: "noun", gender: "m" },
    ],
    cultural_note:
      "Spain runs on a unique daily schedule. Lunch is 2-4 pm (not 12-1 like the US/UK). Dinner is 9-11 pm. Shops often close from 2-5 pm for siesta in smaller cities. If you say 'a la una' to a Spaniard, they think 1 pm — they likely won't be at lunch yet. In Mexico, lunch is more like 1-3 pm, dinner around 8 pm. Don't assume any pan-Hispanic 'standard' — it varies sharply by country.",
    tip:
      "Mañana means BOTH 'tomorrow' AND 'morning' — context disambiguates. 'Hasta mañana' = see you tomorrow. 'Por la mañana' = in the morning. If you hear 'mañana por la mañana', that's 'tomorrow morning'. Yes, it's a real phrase.",
  },

  // ── 11. family — spanish_family ────────────────────────────────────────
  {
    id: "spanish_family",
    level: "A1",
    category: "family",
    title: "Family vocabulary",
    subtitle: "Padres, hermanos, tíos — and the slang only Spain uses",
    sentences: [
      {
        spanish: "Mi padre se llama David.",
        english: "My father is named David.",
        pronunciation: "mee PAH-dreh seh YAH-mah DAH-veed",
        pronunciation_focus: ["'mi' (no accent) = my; 'mí' (accent) = me"],
        note: "Padre = father; familiar: papá. Padres (plural) = parents.",
      },
      {
        spanish: "Tengo dos hermanas y un hermano.",
        english: "I have two sisters and one brother.",
        pronunciation: "TEHN-goh dohs ehr-MAH-nahs ee oon ehr-MAH-noh",
        pronunciation_focus: ["'h' silent — 'hermanas' is 'ehr-MAH-nahs'"],
        note: "Hermano (m) / hermana (f). Plural masculine 'hermanos' can mean 'siblings' (both brothers and sisters).",
      },
      {
        spanish: "Mis abuelos viven en Sevilla.",
        english: "My grandparents live in Seville.",
        pronunciation: "mees ah-BWEH-lohs VEE-vehn ehn seh-VEE-yah",
        pronunciation_focus: ["'ue' diphthong is 'weh' — abuelo = ah-BWEH-loh"],
        note: "Abuelo (m) / abuela (f). Plural 'abuelos' covers both grandparents.",
      },
      {
        spanish: "Mi tío trabaja en México.",
        english: "My uncle works in Mexico.",
        pronunciation: "mee TEE-oh trah-BAH-hah ehn MEH-hee-koh",
        pronunciation_focus: ["México is spelled with x but pronounced with 'h' sound — 'MEH-hee-koh'"],
        note: "Tío = uncle. Tía = aunt. In Spain, 'tío/tía' is also slang for 'dude/dude (f)'.",
      },
      {
        spanish: "Mi prima es muy simpática.",
        english: "My cousin (f) is very nice.",
        pronunciation: "mee PREE-mah ehs moo-EE seem-PAH-tee-kah",
        pronunciation_focus: ["'simpática' stress on second syllable, but spelled with accent"],
        note: "Primo (m) / prima (f). Same word in English (cousin) is gendered in Spanish.",
      },
    ],
    vocabulary: [
      { cell_id: "4e3ad6c0-9fd3-47ef-aa53-436f93f66704", word: "el padre", english: "the father", pronunciation: "ehl PAH-dreh", part_of_speech: "noun", gender: "m" },
      { cell_id: "910f1abf-c995-477c-a8f4-1be05cd6d861", word: "la madre", english: "the mother", pronunciation: "lah MAH-dreh", part_of_speech: "noun", gender: "f" },
      { cell_id: "8bebb8b5-7abd-435a-965d-944641d2fa49", word: "los padres", english: "parents (collective)", pronunciation: "lohs PAH-drehs", part_of_speech: "noun", gender: "m" },
      { cell_id: "7fc54b69-a00d-43c0-8764-081486869a7f", word: "el hermano", english: "the brother", pronunciation: "ehl ehr-MAH-noh", part_of_speech: "noun", gender: "m" },
      { cell_id: "038cbf24-e912-4e13-b60c-785cff9dac57", word: "la hermana", english: "the sister", pronunciation: "lah ehr-MAH-nah", part_of_speech: "noun", gender: "f" },
      { cell_id: "398e0292-31ba-4831-ba2f-6c89e72765b9", word: "el abuelo", english: "the grandfather", pronunciation: "ehl ah-BWEH-loh", part_of_speech: "noun", gender: "m" },
      { cell_id: "cc6bc9c1-b53e-4435-8bfc-0fc757e5e07d", word: "la abuela", english: "the grandmother", pronunciation: "lah ah-BWEH-lah", part_of_speech: "noun", gender: "f" },
      { cell_id: "d79c40b7-74c1-4c58-bfdc-293ffa9534e7", word: "el tío", english: "the uncle", pronunciation: "ehl TEE-oh", part_of_speech: "noun", gender: "m", regional: [{ region: "Spain", form: "tío (slang)", note: "Also means 'dude/man' in Spain casual speech: '¡qué guay, tío!' = 'how cool, dude!'. Not used this way in LatAm." }] },
      { cell_id: "9d2b79c8-db96-41db-9f09-8a017e11da81", word: "la tía", english: "the aunt", pronunciation: "lah TEE-ah", part_of_speech: "noun", gender: "f" },
      { cell_id: "5c93b39b-d4ea-4f67-a1b6-0ca6c0fca22b", word: "el primo", english: "the (male) cousin", pronunciation: "ehl PREE-moh", part_of_speech: "noun", gender: "m" },
      { cell_id: "9759e153-82e8-46dd-8c80-d652ad7e0647", word: "la prima", english: "the (female) cousin", pronunciation: "lah PREE-mah", part_of_speech: "noun", gender: "f" },
      { cell_id: "dd68eeba-e8fb-4766-b4e4-42f5ed23d966", word: "el hijo", english: "the son", pronunciation: "ehl EE-hoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "dae3c635-e578-4a5c-8018-8d7f4e4daabb", word: "la hija", english: "the daughter", pronunciation: "lah EE-hah", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "Possessive adjectives — mi, tu, su, nuestro",
        explanation:
          "Mi (my), tu (your informal), su (his/her/your formal/their). Plural form: mis, tus, sus. Possessive agrees with the THING POSSESSED, not the owner — mis hermanos (my siblings, plural agreement with 'hermanos'), tu casa (your house, singular agreement with 'casa'). Nuestro/a (our) inflects: nuestro hijo, nuestra casa, nuestros hijos, nuestras casas.",
        examples: [
          { spanish: "Mi madre, tu padre, su hermana", english: "My mother, your father, his/her sister" },
          { spanish: "Nuestros padres", english: "Our parents (m plural agreement)" },
          { spanish: "Sus abuelos", english: "Their grandparents (or his/her grandparents — context disambiguates)" },
        ],
      },
    ],
    cultural_note:
      "Spanish-speaking cultures lean heavily on extended family. 'Tío' covers your blood uncle AND close family friends in many Latin American countries. When you meet a Spanish-speaker's family, expect introductions to abuelos, tíos, primos that go three generations deep. In Spain, 'tío/tía' as slang for 'dude' is everywhere — '¿qué tal, tío?' is the equivalent of 'what's up, man?'. NEVER use it that way in Mexico or most of LatAm; you'll sound weird.",
    tip:
      "Family terms in Spanish default to masculine when the group is mixed: 'mis hermanos' could mean my brothers OR my siblings (mixed). Same with 'mis tíos' (my uncles OR my aunts and uncles). Use feminine plural 'hermanas / tías' only when ALL members are female.",
  },

  // ── 12. food_basics — spanish_food_ordering ────────────────────────────
  {
    id: "spanish_food_ordering",
    level: "A1",
    category: "food_basics",
    title: "Ordering food — café & restaurant",
    subtitle: "Un café, una caña, la cuenta — survival vocabulary",
    sentences: [
      {
        spanish: "Un café con leche, por favor.",
        english: "A coffee with milk, please.",
        pronunciation: "oon kah-FEH kohn LEH-cheh, pohr fah-VOHR",
        pronunciation_focus: ["'leche' has 'cheh' ending — clear 'eh'"],
        note: "The default Spanish breakfast coffee. In Spain a café con leche is half coffee, half milk.",
      },
      {
        spanish: "¿Qué quiere tomar?",
        english: "What would you like to drink? (Formal — used by waiters.)",
        pronunciation: "keh KYEH-reh toh-MAHR",
        pronunciation_focus: ["'quiere' is 'KYE-reh' — 'ie' diphthong"],
        note: "Tomar literally = to take, but in food context = to drink. Spanish always asks 'tomar' for beverages.",
      },
      {
        spanish: "Quiero la paella, por favor.",
        english: "I'd like the paella, please.",
        pronunciation: "KYEH-roh lah pah-EH-yah, pohr fah-VOHR",
        pronunciation_focus: ["'paella' is 'pah-EH-yah', NOT 'pa-EL-la'"],
        note: "Quiero = I want / I'd like. Polite enough in food contexts. For more formal: 'me gustaría'.",
      },
      {
        spanish: "La cuenta, por favor.",
        english: "The check, please.",
        pronunciation: "lah KWEHN-tah, pohr fah-VOHR",
        pronunciation_focus: ["'cuenta' is 'KWEN-tah'"],
        note: "Waiters in Spain rarely bring the bill without being asked — you have to flag them. In LatAm, it varies by country.",
      },
      {
        spanish: "Está delicioso.",
        english: "It's delicious.",
        pronunciation: "ehs-TAH deh-lee-SYOH-soh",
        pronunciation_focus: ["estar — temporary state, the food right now"],
        note: "Notice estar, not ser. The food is delicious right now (taste, state). 'Es delicioso' would imply it's always delicious as a defining trait.",
      },
    ],
    vocabulary: [
      { cell_id: "d1131f56-292f-4261-bb7b-01fc333755ea", word: "el café", english: "the coffee / the café", pronunciation: "ehl kah-FEH", part_of_speech: "noun", gender: "m", regional: [{ region: "Spain", form: "café solo / cortado / con leche", note: "Spain has detailed coffee terminology. Solo = espresso. Cortado = espresso with dash of milk. Con leche = half-and-half." }, { region: "Mexico", form: "café americano", note: "American-style filter coffee. Less common in Spain." }] },
      { cell_id: "fd5db9fc-0071-4781-bb21-d1116e7693b2", word: "el agua", english: "the water", pronunciation: "ehl AH-gwah", part_of_speech: "noun", gender: "f", regional: [{ region: "all", form: "el agua", note: "Feminine noun, but uses 'el' instead of 'la' because singular feminine words starting with stressed 'a-' do. Plural is 'las aguas'." }] },
      { cell_id: "6970c9c7-09ae-4dad-a486-825b184d08c1", word: "la cerveza", english: "the beer", pronunciation: "lah sehr-VEH-sah", part_of_speech: "noun", gender: "f", regional: [{ region: "Spain", form: "una caña", note: "Small draft beer (~200ml). The default beer order in Spain. 'Una cerveza' sounds formal." }, { region: "Mexico", form: "una chela", note: "Slang. 'Una cerveza' is the neutral form." }] },
      { cell_id: "9571075c-8ab6-4e0b-a560-b403a4009428", word: "la cuenta", english: "the check / bill", pronunciation: "lah KWEHN-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "f0282796-3c1b-4ebc-b441-24a4493ab3c6", word: "el menú", english: "the menu", pronunciation: "ehl meh-NOO", part_of_speech: "noun", gender: "m", regional: [{ region: "Spain", form: "la carta", note: "In Spain, 'la carta' is the menu of all dishes. 'El menú' is specifically the fixed-price lunch deal." }] },
      { cell_id: "f45c4bf1-2b7d-408c-9ecf-35251c3c9a67", word: "el desayuno", english: "the breakfast", pronunciation: "ehl deh-sah-YOO-noh", part_of_speech: "noun", gender: "m" },
      { cell_id: "1b6e9814-2780-40ff-a9f1-b59ae24a47d5", word: "la comida", english: "the food / the lunch (Spain)", pronunciation: "lah koh-MEE-dah", part_of_speech: "noun", gender: "f", regional: [{ region: "Spain", form: "la comida = lunch", note: "In Spain, 'la comida' specifically means lunch (the main meal of the day)." }, { region: "Mexico", form: "la comida = food/meal", note: "In Mexico, 'la comida' is general 'food' or any meal." }] },
      { cell_id: "b19a1a66-0686-4800-a58b-04fc306a9a8c", word: "la cena", english: "the dinner", pronunciation: "lah SEH-nah", part_of_speech: "noun", gender: "f" },
    ],
    dialogue: [
      { cell_id: "c4e7ae7e-1e69-4c71-9626-d0ef6d9dda6f", speaker: "Camarero", spanish: "Buenos días. ¿Qué desea tomar?", english: "Good morning. What would you like to drink?", pronunciation: "BWEH-nohs DEE-ahs. keh deh-SEH-ah toh-MAHR?", register: "formal" },
      { cell_id: "fad7c040-c64d-4b57-9ca5-6ed69eb91b14", speaker: "Cliente", spanish: "Un café con leche y una tostada, por favor.", english: "A coffee with milk and toast, please.", pronunciation: "oon kah-FEH kohn LEH-cheh ee OO-nah tohs-TAH-dah, pohr fah-VOHR", register: "neutral" },
      { cell_id: "a9e6983d-ff35-44de-b537-1e9da13fc0d9", speaker: "Camarero", spanish: "Muy bien, ¿algo más?", english: "Very well, anything else?", pronunciation: "moo-EE BYEHN, AHL-goh MAHS?", register: "formal" },
      { cell_id: "f821854e-cd4f-496f-86d7-cad51f7dfd01", speaker: "Cliente", spanish: "No, gracias. Eso es todo.", english: "No, thanks. That's all.", pronunciation: "noh, GRAH-syahs. EH-soh ehs TOH-doh", register: "neutral" },
    ],
    cultural_note:
      "Tipping conventions vary wildly. In Spain, leave the small change or 5-10% if service was good — never 18-20% like the US. In Mexico, 10-15% is standard. In Argentina, 10%. Most Spanish-speaking countries do NOT tip 20% — it would be perceived as showing off, not generosity. Service is included in many countries' prices.",
    tip:
      "When the menu has both 'menú del día' and 'carta' — pick the menú del día for lunch. It's a fixed-price multi-course set (typically €10-15 in Spain, $7-12 USD in Mexico) and includes starter + main + dessert + drink + coffee. It's how locals eat lunch. Eating off the carta costs 2-3x more.",
  },

  // ── 13. food_basics — spanish_food_market ──────────────────────────────
  {
    id: "spanish_food_market",
    level: "A1",
    category: "food_basics",
    title: "Mercado & grocery shopping",
    subtitle: "Un kilo de manzanas — buying food the way locals do",
    intro:
      "Spanish-speaking countries have a strong outdoor / municipal market tradition that's separate from supermarkets. Vocabulary differs — and you'll find yourself negotiating quantities, asking for ripeness, and pointing more than you do at a supermarket. This is the survival kit for that.",
    sentences: [
      {
        spanish: "Un kilo de manzanas, por favor.",
        english: "A kilo of apples, please.",
        pronunciation: "oon KEE-loh deh mahn-SAH-nahs, pohr fah-VOHR",
        pronunciation_focus: ["'kilo' — short 'i' sound, like 'ee' but quick"],
        note: "Metric everywhere. A kilo (~2.2 lb) is the standard purchase unit. Half kilo = medio kilo.",
      },
      {
        spanish: "¿Cuánto cuesta el queso?",
        english: "How much does the cheese cost?",
        pronunciation: "KWAHN-toh KWEHS-tah ehl KEH-soh",
        pronunciation_focus: ["'queso' is 'KEH-soh', not 'KAY-soh'"],
        note: "Cuesta (costar) — irregular o→ue stem-changing verb. Tú costas → cuestas; él costa → cuesta.",
      },
      {
        spanish: "¿Están maduros los aguacates?",
        english: "Are the avocados ripe?",
        pronunciation: "ehs-TAHN mah-DOO-rohs lohs ah-gwah-KAH-tehs",
        pronunciation_focus: ["'aguacate' uses Náhuatl-origin word; in Spain often 'aguacate' too, occasionally 'palta' in Argentina/Chile/Peru"],
        note: "Estar — temporary state (the ripeness right now, not a defining trait).",
      },
      {
        spanish: "Dos panes, por favor.",
        english: "Two breads (rolls / loaves), please.",
        pronunciation: "dohs PAH-nehs, pohr fah-VOHR",
        pronunciation_focus: ["'pan' singular; 'panes' plural — bread is countable in Spanish"],
        note: "In Spain, 'pan' often means a baguette-style loaf. 'Dos panes' = two of them.",
      },
      {
        spanish: "Necesito tomates y cebollas.",
        english: "I need tomatoes and onions.",
        pronunciation: "neh-seh-SEE-toh toh-MAH-tehs ee seh-BOH-yahs",
        pronunciation_focus: ["'necesitar' — regular -ar verb; you'll use it constantly"],
        note: "Necesitar = to need. Yo necesito, tú necesitas, él necesita, etc.",
      },
    ],
    vocabulary: [
      { cell_id: "ab0b8423-4b72-446c-b483-c25fc2355068", word: "el mercado", english: "the market", pronunciation: "ehl mehr-KAH-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "5f1e4528-1a45-48d4-83f6-e6420369fb97", word: "el supermercado", english: "the supermarket", pronunciation: "ehl soo-pehr-mehr-KAH-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "3f1fc0e4-f2fc-4ed3-9b74-3252ebc0df33", word: "el kilo", english: "the kilo (kilogram)", pronunciation: "ehl KEE-loh", part_of_speech: "noun", gender: "m" },
      { cell_id: "d5754f78-1443-4f11-8a6b-b6d68e48f849", word: "la manzana", english: "the apple", pronunciation: "lah mahn-SAH-nah", part_of_speech: "noun", gender: "f" },
      { cell_id: "8ba685b6-a163-4005-ab70-83c1df08a4af", word: "el tomate", english: "the tomato", pronunciation: "ehl toh-MAH-teh", part_of_speech: "noun", gender: "m" },
      { cell_id: "ea8f1d87-343b-4132-b27b-9ed74b940dbf", word: "la cebolla", english: "the onion", pronunciation: "lah seh-BOH-yah", part_of_speech: "noun", gender: "f" },
      { cell_id: "f091eb83-d68a-4435-915e-d252a538382c", word: "el queso", english: "the cheese", pronunciation: "ehl KEH-soh", part_of_speech: "noun", gender: "m" },
      { cell_id: "9dd8a4fe-89fd-4e93-8f14-a16e7531eaf7", word: "el pan", english: "the bread", pronunciation: "ehl pahn", part_of_speech: "noun", gender: "m" },
      { cell_id: "0bb0e5c3-d919-4042-8bcf-00e15bb477b7", word: "el aguacate", english: "the avocado", pronunciation: "ehl ah-gwah-KAH-teh", part_of_speech: "noun", gender: "m", regional: [{ region: "Spain & Mexico & most LatAm", form: "el aguacate", note: "Náhuatl-origin word, used widely." }, { region: "Argentina / Chile / Peru / Uruguay", form: "la palta", note: "Quechua-origin word. Same fruit, totally different word." }] },
      { cell_id: "1b6043a4-bf4d-444f-84b4-f31bf9884986", word: "maduro/a", english: "ripe", pronunciation: "mah-DOO-roh / -rah", part_of_speech: "adjective", gender: "mf" },
      { cell_id: "3df8ff4b-0325-4267-ab1f-97c77c0623e2", word: "fresco/a", english: "fresh", pronunciation: "FREHS-koh / -kah", part_of_speech: "adjective", gender: "mf" },
    ],
    dialogue: [
      { cell_id: "cc011037-2c67-4954-b12b-c2ffcd569057", speaker: "Vendedor", spanish: "¿Qué le pongo?", english: "What can I get you? (Literally: What do I put for you?)", pronunciation: "keh leh POHN-goh?", register: "neutral" },
      { cell_id: "c370e70c-3980-4b5d-a685-d17797aaad3a", speaker: "Cliente", spanish: "Un kilo de tomates, por favor. ¿Están maduros?", english: "A kilo of tomatoes, please. Are they ripe?", pronunciation: "oon KEE-loh deh toh-MAH-tehs, pohr fah-VOHR. ehs-TAHN mah-DOO-rohs?", register: "neutral" },
      { cell_id: "be6fd21a-3553-4d73-a26c-1a65fdf56e5a", speaker: "Vendedor", spanish: "Sí, hoy mismo del huerto. ¿Algo más?", english: "Yes, fresh from the garden today. Anything else?", pronunciation: "see, oy MEES-moh dehl WEHR-toh. AHL-goh MAHS?", register: "neutral" },
      { cell_id: "aa107003-b946-4281-9e64-a4be797cbc47", speaker: "Cliente", spanish: "Sí, medio kilo de cebollas también.", english: "Yes, half a kilo of onions too.", pronunciation: "see, MEH-dyoh KEE-loh deh seh-BOH-yahs tahm-BYEHN", register: "neutral" },
    ],
    cultural_note:
      "Spanish-speaking countries use metric everywhere. A kilo is the default unit; a libra (pound, ~454 g) is rarely used outside Mexico/some LatAm countries. Don't ask for 'two pounds' — ask for 'un kilo'. Half a kilo = medio kilo. A quarter = un cuarto de kilo. For light things: 100 grams = cien gramos. The vendor will weigh and tell you the price.",
    tip:
      "When you don't know a food's name, point and say '¿esto?' (this?) or '¿cómo se llama esto?' (what's this called?). Vendors at municipal markets are patient with foreigners and will teach you the word. This is faster than scrolling through your phone dictionary.",
    regional_variants: [
      { meaning: "avocado", peninsular: "aguacate", latam: "aguacate (most) / palta (Argentina, Chile, Peru, Uruguay)", note: "Same fruit, two completely different words. Worth knowing which region you're in." },
      { meaning: "string bean", peninsular: "judía verde", latam: "ejote (Mexico) / vainita (Venezuela) / chaucha (Argentina)", note: "One of the most regionally variable vegetable names in Spanish." },
      { meaning: "potato", peninsular: "patata", latam: "papa", note: "Spain calls it patata; the rest of the Spanish-speaking world says papa (originally from Quechua)." },
    ],
  },

  // ── 14. questions — spanish_question_words ─────────────────────────────
  {
    id: "spanish_question_words",
    level: "A1",
    category: "questions",
    title: "Question words — qué, cómo, dónde, cuándo, por qué",
    subtitle: "And the upside-down ¿ that throws every English speaker",
    sentences: [
      {
        spanish: "¿Qué es esto?",
        english: "What is this?",
        pronunciation: "keh ehs EHS-toh",
        pronunciation_focus: ["¿ at start and ? at end — both required"],
        note: "Qué = what. Always with accent when it's a question word. 'Que' without accent = that/which (relative).",
      },
      {
        spanish: "¿Dónde está el baño?",
        english: "Where is the bathroom?",
        pronunciation: "DOHN-deh ehs-TAH ehl BAH-nyoh",
        pronunciation_focus: ["'dónde' with accent — without accent it's 'donde' (where as relative pronoun)"],
        note: "Note estar — location uses estar even for permanent locations.",
      },
      {
        spanish: "¿Cuándo llegas?",
        english: "When are you arriving?",
        pronunciation: "KWAHN-doh YEH-gahs",
        pronunciation_focus: ["'llegar' — 'll' is 'y' or 'j' depending on dialect"],
        note: "Cuándo = when (question). Without accent: cuando (when as conjunction).",
      },
      {
        spanish: "¿Cómo te llamas?",
        english: "What's your name? (Literally: How do you call yourself?)",
        pronunciation: "KOH-moh teh YAH-mahs",
        pronunciation_focus: ["¿Cómo? = how, used here for 'what's your name' idiomatically"],
        note: "Cómo (with accent) = how / what. Spanish asks 'how do you call yourself' — different idiom from English.",
      },
      {
        spanish: "¿Por qué estudias español?",
        english: "Why do you study Spanish?",
        pronunciation: "pohr keh ehs-TOO-dyahs ehs-pah-NYOHL",
        pronunciation_focus: ["Two words: 'por qué'. Single word 'porque' (no accent) = because"],
        note: "Question: por qué (two words, accent). Answer: porque (one word, no accent).",
      },
    ],
    grammar: [
      {
        point: "Question words with accent marks",
        explanation:
          "Spanish question words ALL carry accent marks: qué, cómo, dónde, cuándo, por qué, quién, cuál, cuánto. The SAME words without accents are statement words (the relative pronouns): que (that/which), como (like/as), donde (where as relative), cuando (when as conjunction), porque (because), quien (who as relative). The accent disambiguates question from statement.",
        examples: [
          { spanish: "¿Qué quieres? (question)", english: "What do you want?" },
          { spanish: "Quiero que vengas. (statement)", english: "I want you to come." },
          { spanish: "¿Por qué? — Porque sí.", english: "Why? — Because." },
        ],
      },
      {
        point: "The upside-down opening punctuation",
        explanation:
          "Spanish requires ¿ at the start of questions and ¡ at the start of exclamations. These mark the tone for the whole sentence — useful when a long sentence ends with a question mark. Both opening and closing marks are mandatory in standard writing. Casual texting often drops the opening ¿/¡, but formal writing, books, newspapers, and exams require both.",
        examples: [
          { spanish: "¿Cómo estás?", english: "How are you?" },
          { spanish: "¡Qué bien!", english: "How nice!" },
        ],
      },
    ],
    vocabulary: [
      { cell_id: "7616efbc-8329-4304-9d0a-584bef22f484", word: "qué", english: "what", pronunciation: "keh", part_of_speech: "interrogative" },
      { cell_id: "d7b72854-27b4-406a-b3a0-54a14da3f9a7", word: "cómo", english: "how", pronunciation: "KOH-moh", part_of_speech: "interrogative" },
      { cell_id: "c8e52b95-7973-48a4-b2b7-7c05cf3b5d37", word: "dónde", english: "where", pronunciation: "DOHN-deh", part_of_speech: "interrogative" },
      { cell_id: "5dda38db-89cc-4edf-8499-29b1a9b24a36", word: "cuándo", english: "when", pronunciation: "KWAHN-doh", part_of_speech: "interrogative" },
      { cell_id: "bd26f383-ec5a-43fd-bcdc-8246d69dd26e", word: "por qué", english: "why", pronunciation: "pohr keh", part_of_speech: "interrogative" },
      { cell_id: "eb6cfdb1-c491-44f5-943e-8f99fd3d36e9", word: "porque", english: "because (NOT a question word)", pronunciation: "POHR-keh", part_of_speech: "conjunction" },
      { cell_id: "a9800f0f-9298-476f-b01c-1c65875479b4", word: "quién", english: "who", pronunciation: "KYEHN", part_of_speech: "interrogative" },
      { cell_id: "66159958-7ae4-4bc9-87d6-2aa5d6f9a4c1", word: "cuál", english: "which", pronunciation: "KWAHL", part_of_speech: "interrogative" },
      { cell_id: "88028aab-c934-40d0-a865-f817e9459fc7", word: "cuánto/a", english: "how much / how many", pronunciation: "KWAHN-toh / -tah", part_of_speech: "interrogative" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction: "Fill in the correct question word with proper accent.",
        items: [
          { prompt: "¿___ te llamas?", answer: "Cómo" },
          { prompt: "¿___ está mi libro?", answer: "Dónde" },
          { prompt: "¿___ es esto?", answer: "Qué" },
          { prompt: "¿___ vives en Madrid?", answer: "Por qué" },
          { prompt: "¿___ cuesta?", answer: "Cuánto" },
        ],
      },
    ],
    cultural_note:
      "Spanish-speakers will often drop the upside-down ¿ in informal texting, like 'cómo estás?' instead of '¿cómo estás?'. But in formal writing, school, books, newspapers, and Wikipedia, the ¿ is mandatory. Spanish-speakers themselves grew up writing it; if you skip it in formal writing, it looks careless. In casual chat: optional.",
    tip:
      "Por qué (why) and porque (because) are pronounced almost the same but spelled differently. The pair appears constantly: '¿Por qué estudias español?' — 'Porque me gusta'. Train yourself to write the question form as TWO words with an accent, and the answer as ONE word without. This single distinction trips up advanced learners.",
  },
];

export default lessons;
