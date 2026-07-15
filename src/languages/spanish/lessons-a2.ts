// src/languages/spanish/lessons-a2.ts
//
// ⚠️ AI-AUTHORED CONTENT — recommend native-speaker review before merge.
//
// Spanish-for-English-speakers, A2 corpus. 15 hand-crafted lessons.
//
// Pedagogical bets baked into the distribution:
//
//   1. Preterite gets THREE lessons (regular / core irregulars /
//      j-stem + 3rd-person stem-changers). It is the single biggest
//      A2 grammar cliff for English speakers; one lesson under-serves
//      it. Even drill apps give it three.
//   2. Object pronouns get THREE lessons (direct / indirect+gustar /
//      combined RID). The RID order rule and the le→se rule are A2's
//      two memorization items most worth real space.
//   3. Reflexives appear TWICE — once as a category (lessons 4-5),
//      once embedded in daily-routine narrative (lessons 12-13).
//      English speakers learn reflexives best in their natural
//      habitat, not as abstract grammar.
//   4. Concentration over coverage. Comparatives is a single tight
//      lesson because the patterns are clean — no padding.
//   5. Cultural notes target real friction (regateo etiquette, Spain's
//      rebajas schedule, late-night salir, leísmo). Tips are
//      tactical (default-to-X habits), not encouragement.
//   6. Pronunciation guides are English-phonetic, matching A1.
//      Pronunciation_focus calls out the preterite stress shift
//      (the most common spoken-Spanish error English speakers make
//      at A2 — saying "comi" instead of "co-MEE", "yegue" instead
//      of "ye-GAY").

import type { SpanishLesson } from "./lessons";

export const lessons: SpanishLesson[] = [
  // ── 1. past_tense_intro — spanish_preterite_regular ─────────────────────
  {
    id: "spanish_preterite_regular",
    level: "A2",
    category: "past_tense_intro",
    title: "Preterite — regular -ar / -er / -ir verbs",
    subtitle: "What you did once, finished, in a specific moment.",
    intro:
      "The preterite is Spanish's 'something happened, then it was over' tense. It's the most-used past tense in spoken Spanish — anytime you're telling a story or recounting a finished event, you'll reach for it. Two patterns to learn (one for -ar, one shared by -er/-ir) and the stress shifts that English speakers chronically miss.",
    sentences: [
      {
        spanish: "Ayer hablé con mi madre.",
        english: "Yesterday I talked with my mother.",
        pronunciation: "ah-YEHR ah-BLEH kohn mee MAH-dreh",
        pronunciation_focus: [
          "hablé stresses the FINAL syllable — ah-BLEH, never AH-bleh",
          "Written accent on é forces the stress; without it, it's the present-tense yo form.",
        ],
        note:
          "Regular -ar preterite endings: -é, -aste, -ó, -amos, -asteis, -aron. The yo form's accent is non-negotiable in writing.",
      },
      {
        spanish: "¿Comiste algo en el avión?",
        english: "Did you eat anything on the plane?",
        pronunciation: "koh-MEES-teh AHL-goh ehn ehl ah-BYOHN",
        pronunciation_focus: ["Stress on -mis- in comiste, not on -te"],
        note:
          "Regular -er/-ir preterite tú form ends in -iste. Same endings for both -er and -ir verbs in the preterite — that's a free win.",
      },
      {
        spanish: "Salimos del cine a las once.",
        english: "We left the movie theater at eleven.",
        pronunciation: "sah-LEE-mohs dehl SEE-neh ah lahs OHN-seh",
        pronunciation_focus: [
          "-ir nosotros form is salimos — SAME spelling as the present tense (we leave / we left). Context disambiguates.",
        ],
        note:
          "-ar and -ir nosotros preterite forms collide with the present tense. Spanish speakers rely on context plus time markers (ayer, anoche, el martes pasado) to tell which is which.",
      },
      {
        spanish: "Ella escribió una carta muy larga.",
        english: "She wrote a very long letter.",
        pronunciation: "EH-yah ehs-kree-BYOH OO-nah KAR-tah moo-EE LAR-gah",
        pronunciation_focus: ["escribió stresses -BYOH; the ó accent is mandatory"],
        note:
          "Third-person singular -er/-ir preterite ends in -ió (with accent). Without the accent on ó it would shift stress and change meaning.",
      },
      {
        spanish: "Llegué tarde a la reunión.",
        english: "I arrived late to the meeting.",
        pronunciation: "yeh-GAY TAR-deh ah lah reh-oo-NYOHN",
        pronunciation_focus: [
          "Spelling change — llegar → llegué (u inserted to keep the hard 'g' sound before é)",
        ],
        note:
          "Verbs ending in -gar, -car, -zar have a yo-form spelling change in the preterite to preserve the consonant sound: llegar→llegué, buscar→busqué, empezar→empecé. The change is purely orthographic; pronunciation is regular.",
      },
    ],
    vocabulary: [
      { cell_id: "90b6cf98-bc4b-425f-ab92-92cbed46748f", word: "ayer", english: "yesterday", pronunciation: "ah-YEHR", part_of_speech: "adverb" },
      { cell_id: "0ac85951-ae3c-43ff-a333-8b9948ffad0e", word: "anoche", english: "last night", pronunciation: "ah-NOH-cheh", part_of_speech: "adverb" },
      { cell_id: "5003b349-a074-4882-a895-c188daa8679b", word: "hablar", english: "to speak / to talk", pronunciation: "ah-BLAR", part_of_speech: "verb" },
      { cell_id: "7aa634c5-7e22-46d4-be6b-1987a72546e9", word: "comer", english: "to eat", pronunciation: "koh-MEHR", part_of_speech: "verb" },
      { cell_id: "5fb245b0-9b3d-47c5-8be7-67cc4c0f9dd9", word: "escribir", english: "to write", pronunciation: "ehs-kree-BEER", part_of_speech: "verb" },
      { cell_id: "573a16df-a9c7-4eac-ba68-17e9d443f03c", word: "llegar", english: "to arrive (-gar spelling change in yo preterite)", pronunciation: "yeh-GAR", part_of_speech: "verb" },
      { cell_id: "a8be09d0-f16d-4461-a670-e9c51fbe865e", word: "buscar", english: "to look for (-car spelling change in yo preterite)", pronunciation: "boos-KAR", part_of_speech: "verb" },
      { cell_id: "35c4a488-d696-4e9c-8ef5-de9ac3cbcd5c", word: "empezar", english: "to begin (e→ie present, -zar spelling change in preterite)", pronunciation: "ehm-peh-SAR", part_of_speech: "verb" },
      { cell_id: "7890c9fc-f5f0-4d72-b484-804220920ad4", word: "la reunión", english: "the meeting", pronunciation: "lah reh-oo-NYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "2bec66f5-a245-48d8-9e38-532518b80cfe", word: "tarde", english: "late (adverb) / afternoon (noun)", pronunciation: "TAR-deh", part_of_speech: "adverb/noun" },
    ],
    grammar: [
      {
        point: "Regular preterite endings",
        explanation:
          "-ar verbs: -é, -aste, -ó, -amos, -asteis, -aron. -er and -ir verbs share one set: -í, -iste, -ió, -imos, -isteis, -ieron. Note that yo and él/ella/usted forms ALWAYS carry a written accent — this is the signal that flips a present-tense form into a past one (hablo I speak / habló he spoke).",
        examples: [
          { spanish: "hablé, hablaste, habló, hablamos, hablasteis, hablaron", english: "spoke (talk)" },
          { spanish: "comí, comiste, comió, comimos, comisteis, comieron", english: "ate (eat)" },
          { spanish: "viví, viviste, vivió, vivimos, vivisteis, vivieron", english: "lived (live)" },
        ],
      },
      {
        point: "Orthographic spelling changes (-gar / -car / -zar)",
        explanation:
          "In the yo form only, verbs ending in -gar add a u (llegué), -car becomes -qué (busqué), and -zar becomes -cé (empecé). The spelling change preserves the hard sound; pronunciation follows the regular pattern. Nothing else in the conjugation changes.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Fill in the preterite form. Watch for accents and the -gar/-car/-zar yo-form spelling changes.",
        items: [
          { prompt: "Yo ___ (hablar) con el profesor ayer.", answer: "hablé" },
          { prompt: "¿Tú ___ (comer) en casa anoche?", answer: "comiste" },
          { prompt: "Nosotros ___ (escribir) tres correos esta mañana.", answer: "escribimos" },
          { prompt: "Ella ___ (llegar) tarde a la fiesta.", answer: "llegó" },
          { prompt: "Yo ___ (buscar) las llaves por todas partes.", answer: "busqué" },
        ],
      },
    ],
    cultural_note:
      "Spanish past-tense storytelling chains preterite verbs to drive narrative forward — 'Llegué, vi, comí, salí' (I arrived, I saw, I ate, I left). Listen for that rapid-fire chain in any anecdote: it's the texture of Spanish narrative. The imperfect (which you'll meet at B1) handles background and habit; the preterite handles the events that move the story.",
    tip:
      "Drill the YO and TÚ forms first. Those two account for most of what you'll say about your own day, and they're where English speakers most often drop the accent and end up sounding like they're using the present tense.",
  },

  // ── 2. past_tense_intro — spanish_preterite_core_irregulars ─────────────
  {
    id: "spanish_preterite_core_irregulars",
    level: "A2",
    category: "past_tense_intro",
    title: "Preterite — core irregulars (ser, ir, hacer, tener, estar)",
    subtitle: "The five verbs you'll use ten times a day. Memorize the forms.",
    intro:
      "Spanish has a small bench of preterite irregulars that English speakers use constantly. The frustrating one: 'fui' is BOTH 'I was' (ser) and 'I went' (ir). Yes — same form, two verbs, context decides. The freeing one: hacer/tener/estar share a stress pattern (no accents on yo or él/ella) and you only have to memorize the stem once.",
    sentences: [
      {
        spanish: "Fui al supermercado esta mañana.",
        english: "I went to the supermarket this morning.",
        pronunciation: "FWEE ahl soo-pehr-mehr-KAH-doh EHS-tah mah-NYAH-nah",
        pronunciation_focus: ["fui is one syllable, not 'foo-EE'"],
        note:
          "Fui = I went (from ir). It's also 'I was' (from ser). Same spelling, same pronunciation. Context is the only disambiguator — and it almost always is enough.",
      },
      {
        spanish: "Fue una noche increíble.",
        english: "It was an incredible night.",
        pronunciation: "FWEH OO-nah NOH-cheh een-kreh-EE-bleh",
        pronunciation_focus: ["fue is one syllable: FWEH"],
        note:
          "Here fue = 'it was' (from ser). The same form fue could also mean 'he/she went' (from ir). Native speakers don't notice the ambiguity — they hear the surrounding sentence.",
      },
      {
        spanish: "Hice mucho trabajo el lunes.",
        english: "I did a lot of work on Monday.",
        pronunciation: "EE-seh MOO-choh trah-BAH-hoh ehl LOO-nehs",
        pronunciation_focus: [
          "hice has NO accent — stress falls on EE-seh by default since it ends in a vowel.",
          "The c in hice is soft (like 's') because it's followed by e.",
        ],
        note:
          "hacer → hice, hiciste, hizo, hicimos, hicisteis, hicieron. Note the 3rd-person singular swap c→z (hizo, not 'hico') — keeps the soft 's' sound before o.",
      },
      {
        spanish: "Tuvimos un problema con el coche.",
        english: "We had a problem with the car.",
        pronunciation: "too-BEE-mohs oon proh-BLEH-mah kohn ehl KOH-cheh",
        pronunciation_focus: ["tuvimos stresses tu-BEE-mohs, not TOO-bee-mohs"],
        note:
          "tener → tuve, tuviste, tuvo, tuvimos, tuvisteis, tuvieron. Note the irregular stem 'tuv-' (not 'ten-') and the lack of accents on yo/él forms.",
      },
      {
        spanish: "Estuve en Madrid tres días.",
        english: "I was in Madrid for three days.",
        pronunciation: "ehs-TOO-beh ehn mah-DREED trehs DEE-ahs",
        pronunciation_focus: ["estuve = ehs-TOO-beh, four syllables"],
        note:
          "estar → estuve, estuviste, estuvo, estuvimos, estuvisteis, estuvieron. 'Estuve en X' is the workhorse phrase for 'I was in X' (a place, for a duration). Note: car is 'el coche' in Spain, 'el carro' in most of LatAm.",
      },
    ],
    vocabulary: [
      { cell_id: "69741364-2126-4270-a7b9-ce9331be9eaa", word: "ser", english: "to be (essence) — preterite stem fu-", pronunciation: "SEHR", part_of_speech: "verb" },
      { cell_id: "961de084-6c7e-4965-93bf-cedd77ce6519", word: "ir", english: "to go — preterite stem fu- (identical to ser)", pronunciation: "EER", part_of_speech: "verb" },
      { cell_id: "9f258c5c-563d-425c-83fc-21cfffabc0ea", word: "hacer", english: "to do / to make — preterite stem hic-", pronunciation: "ah-SEHR", part_of_speech: "verb" },
      { cell_id: "eed6c660-8810-4bed-b655-84b3d2450cdc", word: "tener", english: "to have — preterite stem tuv-", pronunciation: "teh-NEHR", part_of_speech: "verb" },
      { cell_id: "ea24caf9-768b-4788-96ce-04eb9b4a9522", word: "estar", english: "to be (state) — preterite stem estuv-", pronunciation: "ehs-TAR", part_of_speech: "verb" },
      { cell_id: "2fe4cfc0-872e-44fd-a33a-a04733340a7d", word: "el supermercado", english: "the supermarket", pronunciation: "ehl soo-pehr-mehr-KAH-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "94c8ba96-97bd-4bd7-afcf-0a9fbb1d4e17", word: "el coche", english: "the car (Spain)", pronunciation: "ehl KOH-cheh", part_of_speech: "noun", gender: "m" },
      { cell_id: "8559a5d6-414a-4edc-a831-af039c462617", word: "el problema", english: "the problem (yes, masculine despite the -a)", pronunciation: "ehl proh-BLEH-mah", part_of_speech: "noun", gender: "m" },
      { cell_id: "9cc74558-384c-4ade-8879-690fcf621cfa", word: "el lunes", english: "Monday", pronunciation: "ehl LOO-nehs", part_of_speech: "noun", gender: "m" },
      { cell_id: "efcf8ce1-6c0e-484a-a39f-0194159be49f", word: "la mañana", english: "the morning", pronunciation: "lah mah-NYAH-nah", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "ser and ir share preterite forms",
        explanation:
          "fui, fuiste, fue, fuimos, fuisteis, fueron. Used identically for both verbs. Only context tells you which is meant: 'Fui a Madrid' (I went to Madrid — ir), 'Fue mi profesor' (He was my teacher — ser). Spanish speakers don't experience this as ambiguous; the verb's complement makes it obvious.",
        examples: [
          { spanish: "Fui al cine.", english: "I went to the movies. (ir)" },
          { spanish: "Fui camarero en Barcelona.", english: "I was a waiter in Barcelona. (ser)" },
        ],
      },
      {
        point: "hacer / tener / estar share a stress pattern",
        explanation:
          "These 'strong' irregulars all stress the second-to-last syllable in yo and él/ella/usted forms — and they DON'T carry the written accents that regular preterites do. Hice, not hicé. Tuvo, not tuvó. Estuvo, not estuvó. Once you internalize this pattern you'll have ~30 verbs covered (poder→pude, poner→puse, querer→quise, decir→dije, venir→vine, all the same shape).",
        examples: [
          { spanish: "Yo hice / él hizo (NO accent)", english: "I did / he did" },
          { spanish: "Yo tuve / él tuvo (NO accent)", english: "I had / he had" },
        ],
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction: "Fill in the preterite form. Mind the irregular stems and the missing accents.",
        items: [
          { prompt: "Yo ___ (ir) al cine ayer.", answer: "fui" },
          { prompt: "Mi hermana ___ (ser) profesora durante diez años.", answer: "fue" },
          { prompt: "Nosotros ___ (hacer) la tarea juntos.", answer: "hicimos" },
          { prompt: "¿Tú ___ (tener) tiempo de comer?", answer: "tuviste" },
          { prompt: "Ellos ___ (estar) en la playa todo el día.", answer: "estuvieron" },
        ],
      },
    ],
    cultural_note:
      "When Spanish speakers tell you about their weekend, you'll hear a wall of these five irregulars: 'Fui al cine, hice una paella, tuve una cena con amigos, estuvimos hasta tarde, fue genial.' Five verbs cover most of a casual weekend recap. If you can produce that paragraph, you've cleared the hardest part of A2 storytelling.",
    tip:
      "Memorize fui/fue first. They're the two highest-frequency irregular preterite forms in the entire language — together they account for more spoken-Spanish past-tense usage than the next ten irregulars combined.",
    regional_variants: [
      { meaning: "car", peninsular: "el coche", latam: "el carro (most countries) / el auto (Argentina, Uruguay, Chile)", note: "Sometimes called 'el coche' in some LatAm contexts but 'carro/auto' is overwhelmingly more common." },
    ],
  },

  // ── 3. past_tense_intro — spanish_preterite_jstem_stemchangers ──────────
  {
    id: "spanish_preterite_jstem_stemchangers",
    level: "A2",
    category: "past_tense_intro",
    title: "Preterite — j-stem verbs and 3rd-person stem-changers",
    subtitle: "The two patterns left after you know the regulars.",
    intro:
      "Two more preterite groups complete A2 coverage. J-stem verbs (decir, traer, conducir + every verb ending in -ducir) drop the i in the 3rd-person plural — 'dijeron', not 'dijieron'. And -ir stem-changing verbs (pedir, dormir, sentir) keep their stem change but ONLY in 3rd person singular and plural — pidió/pidieron, durmió/durmieron. -ar and -er stem-changers don't stem-change in the preterite at all (a small relief).",
    sentences: [
      {
        spanish: "Me dijeron la verdad.",
        english: "They told me the truth.",
        pronunciation: "meh dee-HEH-rohn lah behr-DAHD",
        pronunciation_focus: [
          "dijeron has NO 'i' between the j and the e — never 'dijieron'",
          "j is pronounced like a strong English 'h'",
        ],
        note:
          "decir → dije, dijiste, dijo, dijimos, dijisteis, dijeron. The dropped 'i' is the j-stem signature.",
      },
      {
        spanish: "Trajimos vino para la cena.",
        english: "We brought wine for dinner.",
        pronunciation: "trah-HEE-mohs BEE-noh PAH-rah lah SEH-nah",
        pronunciation_focus: ["traer's preterite stem is traj-, not tra-"],
        note:
          "traer → traje, trajiste, trajo, trajimos, trajisteis, trajeron. Same j-stem dropped-i pattern as decir. Every -ducir verb (conducir, traducir, producir) follows this too: condujeron, tradujeron, produjeron.",
      },
      {
        spanish: "Pidió un café con leche.",
        english: "She ordered a coffee with milk.",
        pronunciation: "pee-DYOH oon kah-FEH kohn LEH-cheh",
        pronunciation_focus: ["pidió, not pedió — the e becomes i in 3rd person"],
        note:
          "pedir is e→i in present tense AND in 3rd-person preterite. yo pedí, tú pediste, ÉL PIDIÓ, nosotros pedimos, vosotros pedisteis, ELLOS PIDIERON. The change is ONLY in those two forms.",
      },
      {
        spanish: "Los niños durmieron diez horas.",
        english: "The kids slept ten hours.",
        pronunciation: "lohs NEE-nyohs door-MYEH-rohn dyehs OH-rahs",
        pronunciation_focus: ["durmieron — o becomes u in 3rd person, not 'dormieron'"],
        note:
          "dormir is o→ue in present, o→u in 3rd-person preterite. Same shape applies to morir → murió, murieron. Two verbs in this small subgroup.",
      },
      {
        spanish: "Sintió un dolor fuerte en el pecho.",
        english: "He felt a sharp pain in his chest.",
        pronunciation: "seen-TYOH oon doh-LOHR FWEHR-teh ehn ehl PEH-choh",
        pronunciation_focus: ["sintió, not sentió — e→i in 3rd person"],
        note:
          "sentir, mentir, preferir, divertirse: e→ie in present, e→i in 3rd-person preterite. The pattern is consistent across the family.",
      },
    ],
    vocabulary: [
      { cell_id: "f1fbff03-5a4a-43f1-a797-59f1ffc7c58f", word: "decir", english: "to say / to tell — j-stem in preterite (dij-)", pronunciation: "deh-SEER", part_of_speech: "verb" },
      { cell_id: "03c07aba-e260-4ccf-ac8a-aeb86dd32e02", word: "traer", english: "to bring — j-stem in preterite (traj-)", pronunciation: "trah-EHR", part_of_speech: "verb" },
      { cell_id: "0ba3c30c-a380-4a4d-953f-4d460630628d", word: "conducir", english: "to drive (Spain) — j-stem (conduj-)", pronunciation: "kohn-doo-SEER", part_of_speech: "verb" },
      { cell_id: "d3ab48d3-1474-4339-82d4-73e00d760998", word: "pedir", english: "to ask for / to order (food) — e→i in 3rd-pers preterite", pronunciation: "peh-DEER", part_of_speech: "verb" },
      { cell_id: "971e018b-ac0c-47e4-8a07-ccd7bc402bad", word: "dormir", english: "to sleep (o→ue present, o→u 3rd-pers preterite)", pronunciation: "dohr-MEER", part_of_speech: "verb" },
      { cell_id: "63a466b1-fd81-4328-8ff0-698aba72311c", word: "sentir", english: "to feel (e→ie present, e→i 3rd-pers preterite)", pronunciation: "sehn-TEER", part_of_speech: "verb" },
      { cell_id: "0eae02d2-e7bf-4936-b552-4f8fba09e2fb", word: "la verdad", english: "the truth", pronunciation: "lah behr-DAHD", part_of_speech: "noun", gender: "f" },
      { cell_id: "e023f6fd-1d09-491a-9fd4-5949953d1778", word: "el vino", english: "the wine", pronunciation: "ehl BEE-noh", part_of_speech: "noun", gender: "m" },
      { cell_id: "4f552fd3-779c-4dd0-9187-ff7b54060252", word: "el dolor", english: "the pain", pronunciation: "ehl doh-LOHR", part_of_speech: "noun", gender: "m" },
      { cell_id: "8b24a17a-973b-4e36-88ec-c95edc7d1b9a", word: "fuerte", english: "strong / sharp / loud", pronunciation: "FWEHR-teh", part_of_speech: "adjective" },
    ],
    grammar: [
      {
        point: "J-stem preterite (decir, traer, -ducir)",
        explanation:
          "These verbs have a stem ending in 'j' in the preterite (dij-, traj-, conduj-, traduj-, produj-). The 3rd-person plural drops the usual 'i' — it's 'dijeron', not 'dijieron'. No accents on yo or él/ella forms (same as the strong-irregular pattern).",
        examples: [
          { spanish: "dije / dijiste / dijo / dijimos / dijisteis / dijeron", english: "said" },
          { spanish: "traduje / tradujiste / tradujo / ... / tradujeron", english: "translated" },
        ],
      },
      {
        point: "3rd-person stem changes in -ir preterite (only)",
        explanation:
          "-ir verbs that stem-change in the present (pedir e→i, dormir o→ue, sentir e→ie) carry a smaller stem change ONLY in the 3rd-person singular and plural of the preterite: pidió/pidieron, durmió/durmieron, sintió/sintieron. -ar and -er stem-changers do NOT stem-change in the preterite at all — that's a free win (yo cierro present → yo cerré preterite, not 'yo cirré').",
        examples: [
          { spanish: "Yo pedí, tú pediste, él PIDIÓ, ellos PIDIERON.", english: "I/you ordered, he/they ordered." },
          { spanish: "Yo dormí, tú dormiste, ella DURMIÓ, ellas DURMIERON.", english: "I/you slept, she/they slept." },
        ],
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction: "Fill in the preterite. Watch the j-stem dropped-i and the 3rd-person stem changes.",
        items: [
          { prompt: "Ellos me ___ (decir) la verdad ayer.", answer: "dijeron" },
          { prompt: "Yo ___ (traer) los postres.", answer: "traje" },
          { prompt: "Mi padre ___ (conducir) toda la noche.", answer: "condujo" },
          { prompt: "El camarero ___ (pedir) disculpas.", answer: "pidió" },
          { prompt: "Los gemelos ___ (dormir) en el coche.", answer: "durmieron" },
        ],
      },
    ],
    cultural_note:
      "Pidió (he/she ordered) is the verb of every restaurant story you'll hear in Spanish. Notice how Spanish uses 'pedir' for both ordering food and asking for any object or favor — 'pedí un café', 'pedí ayuda', 'pedí permiso'. English splits 'order/ask for/request/borrow' into separate verbs. Spanish leans on pedir for all of them.",
    tip:
      "If you're going to memorize one j-stem verb, make it dijeron. It's the most common past-tense quotation frame in spoken Spanish — 'me dijeron que...', 'dijeron que sí', 'no me dijeron nada'. Drill that one form and you'll catch it everywhere.",
    regional_variants: [
      { meaning: "to drive", peninsular: "conducir", latam: "manejar", note: "In LatAm 'conducir' sounds formal/Spain-flavored. 'Manejar' is the everyday word in Mexico, Argentina, Colombia, Chile — almost everywhere west of the Atlantic. Both are universally understood." },
    ],
  },

  // ── 4. reflexive_verbs — spanish_reflexives_intro ───────────────────────
  {
    id: "spanish_reflexives_intro",
    level: "A2",
    category: "reflexive_verbs",
    title: "Reflexive verbs — actions on yourself",
    subtitle: "Me ducho, te lavas, se afeita.",
    intro:
      "A reflexive verb is one where the subject and the object are the same person — 'I wash myself,' 'you brush your (own) teeth.' Spanish marks this with a reflexive pronoun (me, te, se, nos, os, se) before the conjugated verb. Three things English speakers chronically miss: the pronoun is required (not optional), Spanish uses reflexives for things English just leaves bare ('me ducho' not 'I shower myself'), and many verbs change meaning between reflexive and non-reflexive forms.",
    sentences: [
      {
        spanish: "Me levanto a las siete.",
        english: "I get up at seven.",
        pronunciation: "meh leh-BAHN-toh ah lahs SYEH-teh",
        pronunciation_focus: ["levantar = to lift; levantarse = to get oneself up. The 'se' (here 'me' for yo) is what makes the difference."],
        note:
          "levantarse means 'to get up.' The bare verb levantar means 'to lift (something else).' The reflexive is what flips the meaning to 'lift oneself = get up.'",
      },
      {
        spanish: "¿A qué hora te despiertas?",
        english: "What time do you wake up?",
        pronunciation: "ah keh OH-rah teh dehs-PYEHR-tahs",
        pronunciation_focus: ["despertar is e→ie stem-changing — despierto, despiertas, despierta, despertamos, despertáis, despiertan"],
        note:
          "despertarse is the workhorse 'wake up.' The reflexive pronoun te goes before the conjugated verb. Don't say 'tú despiertas' alone — that means 'you wake (someone else) up.'",
      },
      {
        spanish: "Mi padre se afeita todas las mañanas.",
        english: "My father shaves every morning.",
        pronunciation: "mee PAH-dreh seh ah-FAY-tah TOH-dahs lahs mah-NYAH-nahs",
        pronunciation_focus: ["se = third-person reflexive (himself/herself/yourself-formal/themselves)"],
        note:
          "afeitarse = to shave oneself. Without the reflexive, 'afeitar' means 'to shave someone else' (a barber shaving a client). The reflexive is doing real semantic work here.",
      },
      {
        spanish: "Nos vamos a la cama tarde.",
        english: "We go to bed late.",
        pronunciation: "nohs BAH-mohs ah lah KAH-mah TAR-deh",
        pronunciation_focus: ["irse (to leave / to go away) ≠ ir (to go to)"],
        note:
          "Irse adds a sense of departure that bare ir doesn't carry. 'Voy' = I'm going (to a place). 'Me voy' = I'm leaving / I'm out of here. Subtle but important.",
      },
      {
        spanish: "Antes de dormir, me lavo los dientes.",
        english: "Before sleeping, I brush my teeth.",
        pronunciation: "AHN-tehs deh dor-MEER, meh LAH-boh lohs DYEHN-tehs",
        pronunciation_focus: ["los dientes — Spanish uses the definite article, NOT a possessive. Never 'me lavo mis dientes.'"],
        note:
          "Spanish drops 'my' in front of body parts and clothing when a reflexive is doing the possession work for you. 'Me lavo las manos' (I wash my hands), 'se quita el abrigo' (he takes off his coat).",
      },
    ],
    vocabulary: [
      { cell_id: "56a1d597-232a-4057-abe0-bf73277aa223", word: "levantarse", english: "to get up (out of bed)", pronunciation: "leh-bahn-TAR-seh", part_of_speech: "reflexive verb" },
      { cell_id: "d73e17f6-2941-473a-8a2d-b6c0e7576e79", word: "despertarse", english: "to wake up (e→ie)", pronunciation: "dehs-pehr-TAR-seh", part_of_speech: "reflexive verb" },
      { cell_id: "3096ba53-7b3c-4ab7-b339-28740bfa0541", word: "ducharse", english: "to shower", pronunciation: "doo-CHAR-seh", part_of_speech: "reflexive verb" },
      { cell_id: "bf7ba25c-7a98-4a3b-95e0-53a3fee666e0", word: "afeitarse", english: "to shave oneself", pronunciation: "ah-fay-TAR-seh", part_of_speech: "reflexive verb" },
      { cell_id: "05365dff-413b-4752-9ba9-aaac6e70f511", word: "lavarse", english: "to wash (a part of) oneself", pronunciation: "lah-BAR-seh", part_of_speech: "reflexive verb" },
      { cell_id: "bf0058ba-1f4b-4093-a2e8-8c9627ee5821", word: "vestirse", english: "to get dressed (e→i)", pronunciation: "behs-TEER-seh", part_of_speech: "reflexive verb" },
      { cell_id: "51cf5cb5-b8f4-418a-b04d-e5637b0c96fc", word: "acostarse", english: "to go to bed (o→ue)", pronunciation: "ah-kohs-TAR-seh", part_of_speech: "reflexive verb" },
      { cell_id: "c927a99d-8ad3-452b-b10d-32933abbcf10", word: "irse", english: "to leave / to go away", pronunciation: "EER-seh", part_of_speech: "reflexive verb" },
      { cell_id: "e1089d32-759b-4fd9-b522-dd76de863fea", word: "los dientes", english: "the teeth", pronunciation: "lohs DYEHN-tehs", part_of_speech: "noun", gender: "m" },
      { cell_id: "521d0192-354b-4219-a663-915092a31d2d", word: "el pelo", english: "the hair", pronunciation: "ehl PEH-loh", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "Reflexive pronoun placement",
        explanation:
          "The reflexive pronoun (me/te/se/nos/os/se) goes BEFORE a conjugated verb (me ducho), or attached to the END of an infinitive or gerund (voy a ducharme, estoy duchándome — note the accent that's added to keep the original stress). The full conjugation: yo me, tú te, él/ella/usted se, nosotros nos, vosotros os, ellos/ellas/ustedes se.",
        examples: [
          { spanish: "Me ducho. / Voy a ducharme. / Estoy duchándome.", english: "I shower. / I'm going to shower. / I'm showering." },
        ],
      },
      {
        point: "Definite article instead of possessive",
        explanation:
          "When the reflexive makes ownership clear, Spanish drops the possessive in front of body parts and clothing. 'Me lavo las manos' (I wash my hands — never 'mis manos'), 'se quita la chaqueta' (he takes off his jacket — never 'su chaqueta'). English speakers chronically over-translate the 'my' and it sounds awkward.",
      },
    ],
    cultural_note:
      "Spanish reflexives can encode emotion or sudden change in a way English uses adverbs for. 'Me caí' (I fell) carries an unintended/sudden quality compared to 'caí' (I dropped — more controlled). 'Se murió' (she died) is more emotionally weighted than 'murió' — used when the speaker feels the loss. Native speakers reach for the reflexive form to add this quiet color.",
    tip:
      "Conjugate the verb first, then put the right reflexive pronoun in front. Don't try to 'translate the myself' — that's English thinking. Think 'verb form + matching pronoun' and you'll stop pausing in the middle of sentences.",
  },

  // ── 5. reflexive_verbs — spanish_reflexives_daily_routine_narrative ─────
  {
    id: "spanish_reflexives_daily_routine_narrative",
    level: "A2",
    category: "reflexive_verbs",
    title: "Reflexives in your day — narrate a routine",
    subtitle: "Stringing reflexives together to describe your morning.",
    intro:
      "Reflexive verbs cluster heaviest in the morning routine — wake up, get up, shower, dress, brush teeth, go out. This lesson takes the grammar from lesson 4 and puts it to work narrating a real day. The pattern you'll repeat: time-marker + reflexive verb + (possibly definite article + body part / clothing).",
    sentences: [
      {
        spanish: "Me despierto a las siete y media.",
        english: "I wake up at seven thirty.",
        pronunciation: "meh dehs-PYEHR-toh ah lahs SYEH-teh ee MEH-dyah",
        note:
          "Standard opener for any 'mi rutina' description. 'a las + hora' is the time slot — internalize that frame.",
      },
      {
        spanish: "Después de desayunar, me ducho rápidamente.",
        english: "After eating breakfast, I shower quickly.",
        pronunciation: "dehs-PWEHS deh deh-sah-yoo-NAR, meh DOO-choh rah-pee-dah-MEHN-teh",
        pronunciation_focus: ["rápidamente — adverbs in -mente carry the stress where the adjective had it (rápida → rápidamente)"],
        note:
          "Después de + infinitive = 'after [verbing]' (after eating breakfast). Note: desayunar isn't reflexive in Spanish, even though English speakers sometimes expect it to be.",
      },
      {
        spanish: "Mi mujer y yo nos vestimos antes de salir.",
        english: "My wife and I get dressed before leaving.",
        pronunciation: "mee moo-HEHR ee yoh nohs behs-TEE-mohs AHN-tehs deh sah-LEER",
        pronunciation_focus: ["nos vestimos — nosotros reflexive is 'nos' before the verb"],
        note:
          "'Mi mujer' = 'my wife' in Spain (alongside 'mi esposa'); LatAm strongly prefers 'mi esposa'. Antes de + infinitive = 'before [verbing].'",
      },
      {
        spanish: "Los niños se cepillan los dientes antes de ir al colegio.",
        english: "The kids brush their teeth before going to school.",
        pronunciation: "lohs NEE-nyohs seh seh-PEE-yahn lohs DYEHN-tehs AHN-tehs deh EER ahl koh-LEH-hyoh",
        pronunciation_focus: ["los dientes — definite article, not 'sus dientes'"],
        note:
          "Cepillarse los dientes is 'to brush one's teeth.' In some places (esp. LatAm) you'll also hear 'lavarse los dientes.' Both are correct.",
      },
      {
        spanish: "Por la noche, nos acostamos sobre las once.",
        english: "At night, we go to bed around eleven.",
        pronunciation: "por lah NOH-cheh, nohs ah-kohs-TAH-mohs SOH-breh lahs OHN-seh",
        pronunciation_focus: ["sobre las + hora = 'around [time]' — softer than the exact 'a las'"],
        note:
          "Acostarse is o→ue in present (me acuesto, te acuestas, se acuesta, nos acostamos, os acostáis, se acuestan — note the nosotros/vosotros forms DON'T stem-change). 'Sobre las' is the idiomatic 'around X o'clock.'",
      },
    ],
    vocabulary: [
      { cell_id: "3fb64536-65fa-49a6-9bf2-27727e0eafb4", word: "la rutina", english: "the routine", pronunciation: "lah roo-TEE-nah", part_of_speech: "noun", gender: "f" },
      { cell_id: "5eacd932-a5d9-4c4c-992f-81b12e12c609", word: "desayunar", english: "to eat breakfast (NOT reflexive in Spanish)", pronunciation: "deh-sah-yoo-NAR", part_of_speech: "verb" },
      { cell_id: "3d7ff751-c9da-42d8-9126-a3f812e668c9", word: "cepillarse", english: "to brush (oneself / one's teeth)", pronunciation: "seh-pee-YAR-seh", part_of_speech: "reflexive verb" },
      { cell_id: "41b9837b-2acc-4853-bef2-e51d4197a933", word: "el colegio", english: "the school (primary/secondary)", pronunciation: "ehl koh-LEH-hyoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "5d40e206-f7ca-4543-b107-fa3c80dd361d", word: "el trabajo", english: "the work / the job", pronunciation: "ehl trah-BAH-hoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "b054b035-5c39-43ce-92f8-d9ed3eb898ce", word: "antes de", english: "before (followed by infinitive)", pronunciation: "AHN-tehs deh", part_of_speech: "preposition phrase" },
      { cell_id: "f41cd923-4ce1-46e7-9d7f-0700b292c3e9", word: "después de", english: "after (followed by infinitive)", pronunciation: "dehs-PWEHS deh", part_of_speech: "preposition phrase" },
      { cell_id: "1b616da4-c355-4eee-bc89-428bf0c0e1d8", word: "luego", english: "later / then (sequencing)", pronunciation: "LWEH-goh", part_of_speech: "adverb" },
      { cell_id: "d13caa42-ce86-4e58-9e7e-1c7be1e1b259", word: "rápidamente", english: "quickly", pronunciation: "rah-pee-dah-MEHN-teh", part_of_speech: "adverb" },
      { cell_id: "844cc84e-1f4f-4649-9da3-6724721d3a18", word: "sobre las (+ hour)", english: "around (a given hour)", pronunciation: "SOH-breh lahs", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Sequencing words for narrating a day",
        explanation:
          "Primero (first), luego/después (then/after), antes de + infinitive (before doing X), después de + infinitive (after doing X), por la mañana / tarde / noche (in the morning/afternoon/night), finalmente (finally). Stitch your day together with these.",
        examples: [
          { spanish: "Primero me ducho, luego desayuno, y finalmente salgo de casa.", english: "First I shower, then I have breakfast, and finally I leave the house." },
        ],
      },
    ],
    dialogue: [
      { cell_id: "7f3161ac-608d-4de2-8cb0-844b89a378da", speaker: "Marta", spanish: "¿A qué hora te levantas normalmente?", english: "What time do you usually get up?", pronunciation: "ah keh OH-rah teh leh-BAHN-tahs nohr-mahl-MEHN-teh", register: "informal" },
      { cell_id: "2e35a7f3-8753-40c9-a2dd-7f5087469ae6", speaker: "Diego", spanish: "Sobre las siete. Me ducho, desayuno, y salgo a las ocho.", english: "Around seven. I shower, have breakfast, and leave at eight.", pronunciation: "SOH-breh lahs SYEH-teh. meh DOO-choh, deh-sah-YOO-noh, ee SAHL-goh ah lahs OH-choh", register: "informal" },
      { cell_id: "171b9c10-85c0-4825-af56-ebd9b6e19f08", speaker: "Marta", spanish: "¡Qué temprano! Yo no me despierto hasta las nueve.", english: "How early! I don't wake up until nine.", pronunciation: "keh tehm-PRAH-noh! yoh noh meh dehs-PYEHR-toh AHS-tah lahs NWEH-beh", register: "informal" },
      { cell_id: "27333b2d-3316-448a-b03b-a44d206c3c28", speaker: "Diego", spanish: "Es que me acuesto a las diez. Soy de los que se duermen pronto.", english: "It's because I go to bed at ten. I'm one of those who fall asleep early.", pronunciation: "ehs keh meh ah-KWEHS-toh ah lahs DYEHS. soy deh lohs keh seh DWEHR-mehn PROHN-toh", register: "informal" },
    ],
    cultural_note:
      "Spanish daily-routine schedules slide later than American or British ones, especially in Spain. A 9 pm dinner is normal; primetime TV starts at 10 pm; bars stay loud until 2 am on a weeknight in Madrid. When you describe your day to a Spaniard and say 'me acuesto a las diez', expect to be teased that you live like a farmer. LatAm schedules vary by country but tend to land between US and Spanish norms.",
    tip:
      "Build a 60-second 'mi rutina diaria' monologue and rehearse it until you can say it without thinking. It's the most-asked-of-you topic in any A2 conversation class, and once you've automated it, you free up cognitive space for everything else.",
  },

  // ── 6. object_pronouns — spanish_object_pronouns_direct ─────────────────
  {
    id: "spanish_object_pronouns_direct",
    level: "A2",
    category: "object_pronouns",
    title: "Direct object pronouns — lo, la, los, las",
    subtitle: "The 'it' / 'them' that English speakers always over-think.",
    intro:
      "A direct object is what receives the verb's action — what you eat, what you see, who you call. Spanish replaces direct objects with pronouns: lo (it/him), la (it/her), los (them, masculine or mixed), las (them, feminine). The pronoun goes BEFORE a conjugated verb. Get this pattern automatic and you'll sound noticeably less choppy.",
    sentences: [
      {
        spanish: "¿El libro? Lo leí ayer.",
        english: "The book? I read it yesterday.",
        pronunciation: "ehl LEE-broh? loh leh-EE ah-YEHR",
        pronunciation_focus: ["lo replaces 'el libro' (masculine singular)"],
        note:
          "The pronoun matches the gender and number of what it replaces. El libro (m sing) → lo. La carta (f sing) → la. Los libros → los. Las cartas → las.",
      },
      {
        spanish: "¿La película? La vimos la semana pasada.",
        english: "The movie? We saw it last week.",
        pronunciation: "lah peh-LEE-koo-lah? lah BEE-mohs lah seh-MAH-nah pah-SAH-dah",
        pronunciation_focus: ["la película → la (f sing)"],
        note:
          "Notice the word order: 'la vimos' (we saw it) — pronoun BEFORE conjugated verb. Never 'vimos la' in this position.",
      },
      {
        spanish: "Los voy a llamar mañana.",
        english: "I'm going to call them tomorrow.",
        pronunciation: "lohs boy ah yah-MAR mah-NYAH-nah",
        pronunciation_focus: [
          "Two valid placements with infinitive: 'los voy a llamar' OR 'voy a llamarlos' — both are correct.",
        ],
        note:
          "When there's an infinitive in the verb chain (voy a llamar), the pronoun can either precede the conjugated verb OR attach to the infinitive. Spanish speakers do both interchangeably.",
      },
      {
        spanish: "No la conozco bien.",
        english: "I don't know her well.",
        pronunciation: "noh lah koh-NOHS-koh byehn",
        pronunciation_focus: ["no goes BEFORE the pronoun: 'no la conozco', never 'la no conozco'"],
        note:
          "Negation slot: 'no' comes first, then the object pronoun, then the verb. Drill this order so you don't get stuck mid-sentence.",
      },
      {
        spanish: "¿Las llaves? Las dejé en la mesa.",
        english: "The keys? I left them on the table.",
        pronunciation: "lahs YAH-behs? lahs deh-HEH ehn lah MEH-sah",
        pronunciation_focus: ["las llaves (f pl) → las"],
        note:
          "When the antecedent (las llaves) is restated and then replaced with the pronoun, Spanish often uses this comma-pause structure. It's natural conversational rhythm.",
      },
    ],
    vocabulary: [
      { cell_id: "c7263c7c-69e4-44da-a64e-9c5682519ae0", word: "lo", english: "it/him (direct object pronoun, masculine singular)", pronunciation: "loh", part_of_speech: "pronoun" },
      { cell_id: "f7e6feea-24dc-49bb-b940-8fa3b710b55a", word: "la", english: "it/her (direct object pronoun, feminine singular)", pronunciation: "lah", part_of_speech: "pronoun" },
      { cell_id: "28e314a7-861c-4e28-bd09-3315cda75dab", word: "los", english: "them (direct object, masculine or mixed plural)", pronunciation: "lohs", part_of_speech: "pronoun" },
      { cell_id: "514ddb46-6d04-461b-bd13-59696fc4d041", word: "las", english: "them (direct object, feminine plural)", pronunciation: "lahs", part_of_speech: "pronoun" },
      { cell_id: "035fd2ee-51c9-423b-8b81-b22c33e3b3e3", word: "leer", english: "to read", pronunciation: "leh-EHR", part_of_speech: "verb" },
      { cell_id: "92c6f233-df67-4ce8-be03-408658911f28", word: "ver", english: "to see / to watch", pronunciation: "behr", part_of_speech: "verb" },
      { cell_id: "0be81775-c69b-4e3a-a05d-157e52f6bd1c", word: "llamar", english: "to call (someone)", pronunciation: "yah-MAR", part_of_speech: "verb" },
      { cell_id: "e10f44f8-9ea0-448a-976b-ee040ac2d3a4", word: "conocer", english: "to know (a person/place — yo conozco)", pronunciation: "koh-noh-SEHR", part_of_speech: "verb" },
      { cell_id: "1b713cb2-2fba-40ee-82e5-21b26b8da8bf", word: "la película", english: "the movie / film", pronunciation: "lah peh-LEE-koo-lah", part_of_speech: "noun", gender: "f" },
      { cell_id: "98d655e5-da6f-4c49-a6aa-84d981002f30", word: "las llaves", english: "the keys", pronunciation: "lahs YAH-behs", part_of_speech: "noun", gender: "f", plural: "las llaves" },
    ],
    grammar: [
      {
        point: "Direct object pronoun placement",
        explanation:
          "Before a conjugated verb: 'Lo veo' (I see him/it). Attached to an infinitive or gerund: 'Voy a verlo' or 'Estoy viéndolo' (note added accent to preserve stress). With a negative: 'no' goes before the pronoun — 'No lo veo.' With a tú-affirmative command (B1 territory), the pronoun ATTACHES to the end: '¡Léelo!' (Read it!).",
        examples: [
          { spanish: "Lo compré. / Voy a comprarlo. / Estoy comprándolo.", english: "I bought it. / I'm going to buy it. / I'm buying it." },
        ],
      },
      {
        point: "Personal a — when the direct object is a person",
        explanation:
          "When the direct object is a SPECIFIC PERSON (or beloved pet), Spanish inserts an untranslatable 'a' before it: 'Veo a mi hermana' (I see my sister), but 'Veo la película' (I see the movie). When you replace the person with a pronoun, the 'a' disappears: 'La veo' (I see her). The personal 'a' is one of the markers Spanish uses to signal that the noun phrase is the object, not the subject — useful in Spanish's flexible word order.",
        examples: [
          { spanish: "Llamé a Pedro. → Lo llamé.", english: "I called Pedro. → I called him." },
          { spanish: "Compré un libro. → Lo compré.", english: "I bought a book. → I bought it." },
        ],
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction: "Replace the underlined direct object with the correct pronoun (lo, la, los, las).",
        items: [
          { prompt: "Compré [el coche] ayer. → ___ compré ayer.", answer: "Lo" },
          { prompt: "Vimos [la película] anoche. → ___ vimos anoche.", answer: "La" },
          { prompt: "Llamé [a mis padres] esta mañana. → ___ llamé esta mañana.", answer: "Los" },
          { prompt: "Conozco [a tus hermanas] muy bien. → ___ conozco muy bien.", answer: "Las" },
          { prompt: "No leí [el correo] todavía. → No ___ leí todavía.", answer: "lo" },
        ],
      },
    ],
    cultural_note:
      "Leísmo — using 'le' instead of 'lo' when the direct object is a male human — is widespread and accepted in central/northern Spain. 'Le vi en el bar' (I saw him at the bar) is what you'll hear in Madrid. The standard textbook form is 'lo vi.' Both are correct depending on where you are. LatAm uses 'lo' across the board. Don't 'correct' a Spaniard's leísmo — it's a feature of their dialect, not an error.",
    tip:
      "Drill 'lo / la / los / las' by REPLACEMENT exercises, not by translation. Pick a Spanish noun + verb sentence ('Compré el libro'), then immediately restate it with the pronoun ('Lo compré'). Speed up until you can do the swap in under a second. That muscle memory is the entire skill.",
    regional_variants: [
      { meaning: "I saw him (male direct object)", peninsular: "Le vi (leísmo, normal in central Spain)", latam: "Lo vi (universal in LatAm)", note: "Both forms are accepted; just don't mix them in the same sentence." },
    ],
  },

  // ── 7. object_pronouns — spanish_object_pronouns_indirect_gustar ────────
  {
    id: "spanish_object_pronouns_indirect_gustar",
    level: "A2",
    category: "object_pronouns",
    title: "Indirect object pronouns — le, les, and the gustar family",
    subtitle: "What is pleasing TO ME, what hurts ME — Spanish flips the subject.",
    intro:
      "Indirect object pronouns answer 'to whom?' or 'for whom?' (me, te, le, nos, os, les). Their biggest job at A2 is the 'gustar family' — verbs that grammatically work backward from English. 'Me gusta el café' is literally 'Coffee is pleasing TO ME,' not 'I like coffee.' Once you internalize the flip, a whole class of verbs (encantar, doler, faltar, parecer, importar, interesar) opens up at once.",
    sentences: [
      {
        spanish: "Me gusta el café.",
        english: "I like coffee. (Literally: Coffee is pleasing to me.)",
        pronunciation: "meh GOOS-tah ehl kah-FEH",
        pronunciation_focus: ["The verb agrees with what's liked (el café, sing → gusta), NOT with the person doing the liking."],
        note:
          "The subject is 'el café' (3rd person singular → gusta). 'Me' is the indirect object — the person to whom coffee is pleasing. This is the central pattern; everything else is variation.",
      },
      {
        spanish: "Me gustan los gatos.",
        english: "I like cats. (Literally: Cats are pleasing to me.)",
        pronunciation: "meh GOOS-tahn lohs GAH-tohs",
        pronunciation_focus: ["los gatos is plural → verb form is 'gustan', not 'gusta'"],
        note:
          "When what's liked is plural, the verb is plural — gustan. The 'me' doesn't change; it's the indirect object pronoun, not the subject.",
      },
      {
        spanish: "A mi hermana le encanta bailar.",
        english: "My sister loves dancing.",
        pronunciation: "ah mee ehr-MAH-nah leh ehn-KAHN-tah bai-LAR",
        pronunciation_focus: [
          "'a + person' clarifies who 'le' refers to. With third-person, 'le' is ambiguous (him? her? you-formal?), so Spanish often adds the clarifier.",
        ],
        note:
          "Encantar is 'gustar but stronger' — like 'love' for activities and things. NEVER use it for 'I love you' (that's te quiero / te amo). 'Le encanta bailar' = the activity (bailar) is the subject; the verb is singular because an infinitive counts as singular.",
      },
      {
        spanish: "Me duele la cabeza.",
        english: "My head hurts. (Literally: The head hurts to me.)",
        pronunciation: "meh DWEH-leh lah kah-BEH-sah",
        pronunciation_focus: ["definite article 'la cabeza' — never 'mi cabeza'"],
        note:
          "Doler works exactly like gustar: the body part is the subject (la cabeza, sing → duele), the person feeling the pain is the indirect object (me). 'Me duelen los pies' = my feet hurt (plural feet → duelen).",
      },
      {
        spanish: "A los niños no les interesa la política.",
        english: "Kids aren't interested in politics.",
        pronunciation: "ah lohs NEE-nyohs noh lehs een-teh-REH-sah lah poh-LEE-tee-kah",
        pronunciation_focus: ["a los niños = the clarifier; les = the actual indirect object pronoun. Both are needed."],
        note:
          "With third-person plurals, 'a los niños' clarifies who 'les' refers to. The 'a + person' is a clarifier, not a separate object — the 'les' is doing the grammatical work. The verb agrees with 'la política' (sing → interesa).",
      },
    ],
    vocabulary: [
      { cell_id: "12276663-5610-42a6-bc9b-3e8f060e9d4d", word: "me", english: "to me (indirect object pronoun)", pronunciation: "meh", part_of_speech: "pronoun" },
      { cell_id: "db8c9189-961a-48cc-aff3-a15f7944686e", word: "te", english: "to you (informal singular)", pronunciation: "teh", part_of_speech: "pronoun" },
      { cell_id: "54dfd1fd-444f-4dc4-806a-02fcaad97bcf", word: "le", english: "to him / her / you-formal (3rd person sing — ambiguous, often clarified with 'a + person')", pronunciation: "leh", part_of_speech: "pronoun" },
      { cell_id: "e59ac328-2c1f-436a-ab7b-f512e0ff1c7d", word: "nos", english: "to us", pronunciation: "nohs", part_of_speech: "pronoun" },
      { cell_id: "d6273600-c307-437c-9dc7-44e75bb87ff5", word: "les", english: "to them / you-formal-plural", pronunciation: "lehs", part_of_speech: "pronoun" },
      { cell_id: "af8b80ab-8621-4943-bfb4-bc6b6985ad6f", word: "gustar", english: "to be pleasing to (= 'to like' inverted)", pronunciation: "goos-TAR", part_of_speech: "verb" },
      { cell_id: "a87a96ef-5e60-41c0-aa8e-9d57e98b6125", word: "encantar", english: "to delight (= 'to love' an activity/thing — stronger than gustar)", pronunciation: "ehn-kahn-TAR", part_of_speech: "verb" },
      { cell_id: "556b0d99-3b5a-42e9-925c-081113877d1c", word: "doler", english: "to hurt (o→ue, conjugated like gustar)", pronunciation: "doh-LEHR", part_of_speech: "verb" },
      { cell_id: "3a23a837-919d-4fc9-9b5d-e772e1de48f4", word: "interesar", english: "to interest (conjugated like gustar)", pronunciation: "een-teh-reh-SAR", part_of_speech: "verb" },
      { cell_id: "4bafe0bb-e7a4-44c4-a6f3-59f6802f022e", word: "parecer", english: "to seem (often gustar-style: 'me parece bien' = it seems good to me)", pronunciation: "pah-reh-SEHR", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "The gustar pattern — agreement with the subject",
        explanation:
          "The verb conjugates to match what is pleasing/hurting/interesting (the grammatical subject), NOT the person experiencing it. Singular subject → singular verb; plural subject → plural verb. An infinitive subject counts as singular ('Me gusta bailar'). Multiple infinitives count as singular too ('Me gusta nadar y correr').",
        examples: [
          { spanish: "Me gusta el libro. / Me gustan los libros.", english: "I like the book. / I like the books." },
          { spanish: "Le duele la mano. / Le duelen las manos.", english: "His hand hurts. / His hands hurt." },
        ],
      },
      {
        point: "Clarifying or emphasizing with 'a + person'",
        explanation:
          "The pronoun 'le' is ambiguous (him? her? you-formal?), so Spanish adds 'a + person' before the verb to clarify: 'A mi padre le gusta el fútbol.' This phrase is also used for emphasis/contrast even when the pronoun is unambiguous: 'A mí me gusta el café, a ti te gusta el té.' Note 'a mí' (with accent) and 'a ti' — this is the prepositional pronoun form, distinct from me/te.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction: "Choose the correct gustar/doler/encantar form. Watch agreement with the subject (what's pleasing/hurting).",
        items: [
          { prompt: "A mí me ___ (gustar) las películas españolas.", answer: "gustan" },
          { prompt: "A mi hermano le ___ (encantar) el chocolate.", answer: "encanta" },
          { prompt: "Me ___ (doler) los pies después de correr.", answer: "duelen" },
          { prompt: "¿A vosotros os ___ (interesar) la historia?", answer: "interesa" },
          { prompt: "A ellos no les ___ (gustar) viajar en avión.", answer: "gusta" },
        ],
      },
    ],
    cultural_note:
      "Spanish has an absolute taboo on saying 'te quiero' to someone you don't actually love. Where English happily says 'love you!' to a coworker after a coffee, Spanish-speaking friends use 'te quiero mucho' only for genuine emotional closeness. 'Te amo' is even stronger and reserved mostly for romantic partners (in Spain) or family + romantic in some LatAm countries. NEVER say either to your boss. The gustar-family verbs (me gusta, me cae bien) are the safe register for warm-but-not-intimate.",
    tip:
      "Memorize gustar in TWO forms only: gusta (singular) and gustan (plural). That's it — those are the only two verb forms you'll need in 95% of A2 sentences. Same drill works for doler, encantar, interesar. Two forms each, twelve verbs covered.",
  },

  // ── 8. object_pronouns — spanish_object_pronouns_combined_rid ───────────
  {
    id: "spanish_object_pronouns_combined_rid",
    level: "A2",
    category: "object_pronouns",
    title: "Combined pronouns — RID order and the le→se rule",
    subtitle: "When you have both an indirect AND direct object in one sentence.",
    intro:
      "When a sentence has both an indirect and a direct object pronoun, two rules govern them: (1) RID order — Reflexive, Indirect, Direct — that's the sequence they appear in (R-I-D). (2) The le→se rule: 'le' or 'les' followed by 'lo/la/los/las' becomes 'se' to avoid the awkward 'le lo' sound. These two rules are the entire A2 challenge for combined pronouns; everything else flows from them.",
    sentences: [
      {
        spanish: "Te lo digo en serio.",
        english: "I'm telling you (it) seriously.",
        pronunciation: "teh loh DEE-goh ehn SEH-ryoh",
        pronunciation_focus: ["te (indirect) precedes lo (direct) — Indirect before Direct"],
        note:
          "Te = to you (indirect); lo = it (direct, the thing being told). Order is fixed: Indirect-then-Direct. Never 'lo te digo.'",
      },
      {
        spanish: "Me los compró mi madre.",
        english: "My mother bought them for me.",
        pronunciation: "meh lohs kohm-PROH mee MAH-dreh",
        pronunciation_focus: ["me (indirect 'for me'), los (direct 'them')"],
        note:
          "Two pronouns clustered before the conjugated verb. 'Mi madre' is the subject (it follows the verb here, which is fine in Spanish).",
      },
      {
        spanish: "Se lo di ayer.",
        english: "I gave it to him/her/you-formal yesterday.",
        pronunciation: "seh loh DEE ah-YEHR",
        pronunciation_focus: [
          "'se' here is NOT reflexive — it's the substitute for 'le' before lo/la/los/las.",
        ],
        note:
          "Original would be 'le lo di' (to him + it I gave) — Spanish dislikes the sound, so 'le' becomes 'se'. The 'se' looks reflexive but isn't. Common point of confusion; just memorize: any time you see 'se lo / se la / se los / se las' it's the le→se rule.",
      },
      {
        spanish: "Voy a explicártelo otra vez.",
        english: "I'm going to explain it to you again.",
        pronunciation: "boy ah ehks-plee-KAR-teh-loh OH-trah behs",
        pronunciation_focus: [
          "Both pronouns ATTACH to the infinitive in RID order, and an accent is added to keep the original stress.",
          "explicar → explicár+te+lo, accent on the second-to-last syllable of the original infinitive.",
        ],
        note:
          "Equally valid: 'Te lo voy a explicar otra vez.' Both placements are correct and equally common in spoken Spanish. The attached form sounds slightly more compact.",
      },
      {
        spanish: "No me lo digas.",
        english: "Don't tell me (that). / You're kidding!",
        pronunciation: "noh meh loh DEE-gahs",
        pronunciation_focus: ["With negative commands, pronouns precede the verb in RID order"],
        note:
          "'No me lo digas' is also a fixed exclamation meaning 'No way!' / 'You're kidding!' — both literal and idiomatic uses are common. Remember the order: NO + me + lo + verb.",
      },
    ],
    vocabulary: [
      { cell_id: "f0148463-3820-444c-875b-e409e3f85d98", word: "se (le→se)", english: "indirect object 'le/les' → 'se' before lo/la/los/las", pronunciation: "seh", part_of_speech: "pronoun" },
      { cell_id: "fbb0c4fc-57c6-40b8-9b36-e9cb2cd3e1b6", word: "decir", english: "to say / to tell", pronunciation: "deh-SEER", part_of_speech: "verb" },
      { cell_id: "f66e1124-9cbc-4c5b-8beb-d7452d8e935a", word: "dar", english: "to give (yo doy, preterite di/diste/dio/dimos/disteis/dieron)", pronunciation: "DAR", part_of_speech: "verb" },
      { cell_id: "2d60150d-8f78-41ba-8d23-165030789364", word: "explicar", english: "to explain", pronunciation: "ehks-plee-KAR", part_of_speech: "verb" },
      { cell_id: "d940f1ae-a4da-47f3-8c8d-95708bc48bf4", word: "comprar", english: "to buy", pronunciation: "kohm-PRAR", part_of_speech: "verb" },
      { cell_id: "ca6a7667-6e84-4e2b-a800-859be7170652", word: "regalar", english: "to give (as a gift)", pronunciation: "rreh-gah-LAR", part_of_speech: "verb" },
      { cell_id: "dc724a9e-7d2f-4238-97ae-1fb94681d335", word: "enviar", english: "to send (yo envío, accent on í)", pronunciation: "ehn-bee-AR", part_of_speech: "verb" },
      { cell_id: "8031b6c8-d286-43ca-905f-93cda6c20e55", word: "mandar", english: "to send / to order (someone to do)", pronunciation: "mahn-DAR", part_of_speech: "verb" },
      { cell_id: "6ef39ddf-2c22-4ede-b688-5dc0beaba34a", word: "otra vez", english: "again (literally: another time)", pronunciation: "OH-trah behs", part_of_speech: "phrase" },
      { cell_id: "371505e6-f556-45a8-8dd9-d075ed9450c9", word: "en serio", english: "seriously / for real", pronunciation: "ehn SEH-ryoh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "RID order — Reflexive, Indirect, Direct",
        explanation:
          "When multiple pronouns precede or attach to a verb, they appear in this fixed order: Reflexive (se/me/te etc. as reflexive) first, then Indirect Object (me/te/le/nos/os/les), then Direct Object (lo/la/los/las). At A2 you'll mostly use the Indirect-then-Direct sequence; the full RID matters as you advance. The order is non-negotiable — Spanish ear immediately catches a swap.",
        examples: [
          { spanish: "Te lo doy. (I-D)", english: "I give it to you." },
          { spanish: "Se me cayó. (R-I — 'It fell on me' — accidental)", english: "I dropped it / It fell on me." },
        ],
      },
      {
        point: "le → se before lo/la/los/las",
        explanation:
          "Spanish refuses to say 'le lo' (or les lo, le la, etc.). When 'le' or 'les' is followed by a direct object pronoun starting with l-, the 'le/les' becomes 'se'. Result: 'le lo doy' becomes 'se lo doy.' Because 'se' loses the his/her/you-formal/them/you-formal-plural distinction, you'll often see clarifying 'a él/ella/usted/ellos' added: 'Se lo di a él' (I gave it to him).",
        examples: [
          { spanish: "Le doy el libro. → Se lo doy.", english: "I give him the book. → I give it to him." },
          { spanish: "Les expliqué la regla. → Se la expliqué.", english: "I explained the rule to them. → I explained it to them." },
        ],
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction: "Replace the underlined direct object with a pronoun. Apply RID order and the le→se rule where needed.",
        items: [
          { prompt: "Le di [el libro] a Pedro. → ___ ___ di a Pedro.", answer: "Se lo" },
          { prompt: "Te mandé [los correos] esta mañana. → ___ ___ mandé esta mañana.", answer: "Te los" },
          { prompt: "Me explicó [la lección]. → ___ ___ explicó.", answer: "Me la" },
          { prompt: "Les regalé [las flores]. → ___ ___ regalé.", answer: "Se las" },
          { prompt: "Voy a comprarte [el regalo]. → Voy a comprár___ ___.", answer: "te lo" },
        ],
      },
    ],
    cultural_note:
      "The phrase 'no me lo digas' has spread far beyond its literal meaning. It's the Spanish-speaking world's go-to 'oh my god' / 'you're kidding!' / 'no way!' — said with rising intonation when someone shares surprising gossip. Get the prosody right (a sharp pause between 'lo' and 'digas', stress on 'di-') and you'll sound noticeably more native.",
    tip:
      "When you build a sentence with two pronouns, write the pronouns FIRST (in RID order), check whether le→se applies, and only then attach the verb. Trying to compose them word-by-word in real time leads to mid-sentence freezing. Pre-decide the pronoun cluster, then say the whole thing.",
  },

  // ── 9. comparatives — spanish_comparatives ──────────────────────────────
  {
    id: "spanish_comparatives",
    level: "A2",
    category: "comparatives",
    title: "Comparatives — más, menos, tan, and the four irregulars",
    subtitle: "Comparing things in Spanish is cleaner than in English.",
    intro:
      "Spanish handles comparisons with a small kit: más (more), menos (less), tan...como (as...as), and four irregular comparatives — mejor (better), peor (worse), mayor (older/greater), menor (younger/lesser). No '-er' suffix complications; no need to learn which adjectives take what. Tightest grammar topic at A2.",
    sentences: [
      {
        spanish: "Madrid es más grande que Barcelona.",
        english: "Madrid is bigger than Barcelona.",
        pronunciation: "mah-DREED ehs mahs GRAHN-deh keh bar-seh-LOH-nah",
        pronunciation_focus: ["más + adjective + que = comparative of superiority"],
        note:
          "más [adjective] que = '[adjective]-er than.' Works with any adjective: más caro que (more expensive than), más rápido que (faster than), más interesante que (more interesting than).",
      },
      {
        spanish: "Mi hermana es menos paciente que yo.",
        english: "My sister is less patient than me.",
        pronunciation: "mee ehr-MAH-nah ehs MEH-nohs pah-SYEHN-teh keh yoh",
        pronunciation_focus: ["menos + adjective + que = comparative of inferiority"],
        note:
          "Note 'que yo' (than I/me) — Spanish uses subject pronouns (yo, tú) after 'que', not object pronouns. Sounds wrong to English ears at first.",
      },
      {
        spanish: "Este café es tan bueno como el otro.",
        english: "This coffee is as good as the other one.",
        pronunciation: "EHS-teh kah-FEH ehs tahn BWEH-noh KOH-moh ehl OH-troh",
        pronunciation_focus: ["tan + adjective + como = comparison of equality (note: not 'tan...que')"],
        note:
          "tan [adjective] como = 'as [adjective] as.' For nouns it's tanto/tanta/tantos/tantas + noun + como ('tantas hermanas como tú' = as many sisters as you).",
      },
      {
        spanish: "Tu coche es mejor que el mío.",
        english: "Your car is better than mine.",
        pronunciation: "too KOH-cheh ehs meh-HOR keh ehl MEE-oh",
        pronunciation_focus: ["mejor — irregular comparative of bueno; never 'más bueno' for quality"],
        note:
          "Four irregulars: bueno → mejor (better), malo → peor (worse), grande → mayor (older / greater), pequeño → menor (younger / lesser). 'Más bueno' exists but means 'morally good / kind'; for quality you say mejor.",
      },
      {
        spanish: "Mi hermano mayor vive en México.",
        english: "My older brother lives in Mexico.",
        pronunciation: "mee ehr-MAH-noh mah-YOHR BEE-beh ehn MEH-hee-koh",
        pronunciation_focus: ["mayor / menor = older / younger when talking about people; greater / lesser for abstract things"],
        note:
          "For people, mayor and menor refer to age. For physical size, Spanish uses más grande and más pequeño — never mayor/menor. So 'esta casa es más grande' (this house is bigger), but 'mi hermano es mayor' (my brother is older).",
      },
    ],
    vocabulary: [
      { cell_id: "a57c3f75-e9b4-4e3d-8465-d107ca987161", word: "más", english: "more (also: most, depending on context)", pronunciation: "mahs", part_of_speech: "adverb" },
      { cell_id: "f67a3300-ecff-466d-b045-c554c6969fe0", word: "menos", english: "less / fewer (also: least)", pronunciation: "MEH-nohs", part_of_speech: "adverb" },
      { cell_id: "e78f6bb8-f30d-4157-a8b3-5e290a226eca", word: "tan", english: "as / so (used in tan...como comparisons)", pronunciation: "tahn", part_of_speech: "adverb" },
      { cell_id: "9b4a7c62-8ce2-4e4b-b90b-df0246144d10", word: "como", english: "as / like (in equality comparisons)", pronunciation: "KOH-moh", part_of_speech: "adverb" },
      { cell_id: "df1d70ca-40e4-484c-b3e5-49bc441f4575", word: "mejor", english: "better (irregular comparative of bueno)", pronunciation: "meh-HOR", part_of_speech: "adjective" },
      { cell_id: "79028cb1-0651-4da7-8f34-0c29a9c1cadd", word: "peor", english: "worse (irregular comparative of malo)", pronunciation: "peh-OHR", part_of_speech: "adjective" },
      { cell_id: "0a1363d0-6a80-4fe4-9821-099c9f384d03", word: "mayor", english: "older / greater", pronunciation: "mah-YOHR", part_of_speech: "adjective" },
      { cell_id: "284246e0-8184-4304-8f87-a94e8b434cfe", word: "menor", english: "younger / lesser", pronunciation: "meh-NOHR", part_of_speech: "adjective" },
      { cell_id: "8f3379ef-20f7-4cac-a80c-00765617fdcc", word: "que", english: "than (in comparisons; also 'that' as a conjunction)", pronunciation: "keh", part_of_speech: "conjunction" },
      { cell_id: "bcdc3bf0-7d44-4bce-98a3-2310cc197768", word: "el / la / los / las + adjective", english: "definite article + adjective forms the superlative", pronunciation: "(varies)", part_of_speech: "construction" },
    ],
    grammar: [
      {
        point: "Three comparison frames",
        explanation:
          "Superiority: más + adjective/adverb/noun + que. Inferiority: menos + adjective/adverb/noun + que. Equality: tan + adjective/adverb + como, or tanto/a/os/as + noun + como (the noun version agrees in gender and number). Mind the structural pair — más/menos use 'que', tan uses 'como.'",
        examples: [
          { spanish: "Más alto que tú. / Menos rápido que ayer. / Tan listo como su hermano. / Tantas amigas como yo.", english: "Taller than you. / Less fast than yesterday. / As clever as his brother. / As many friends as I." },
        ],
      },
      {
        point: "Superlatives: el/la/los/las más + adjective + de",
        explanation:
          "To say 'the most/least X of/in [group],' use the definite article + más/menos + adjective + de + group. 'El más alto de la clase' (the tallest in the class), 'la película más interesante del año' (the most interesting movie of the year). The four irregulars work the same way: 'el mejor restaurante de la ciudad' (the best restaurant in the city).",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction: "Fill in the comparison. Watch for irregular comparatives where appropriate.",
        items: [
          { prompt: "Mi coche es ___ rápido ___ el tuyo. (more...than)", answer: "más, que" },
          { prompt: "Esta película es ___ aburrida ___ la otra. (less...than)", answer: "menos, que" },
          { prompt: "Pedro es ___ alto ___ Juan. (as...as)", answer: "tan, como" },
          { prompt: "Este restaurante es ___ que el otro. (better)", answer: "mejor" },
          { prompt: "Mi hermana es ___ que yo. (younger — referring to a sibling)", answer: "menor" },
        ],
      },
    ],
    cultural_note:
      "Spanish doesn't share English's fondness for hyperbolic comparisons ('a thousand times better'). When a Spanish speaker reaches for 'mucho mejor' or 'muchísimo mejor', they mean it literally — measurably better, not just rhetorically. Calibrate accordingly: 'me gusta más' is genuine preference, not throwaway politeness like 'I love it!' might be in English.",
    tip:
      "Memorize the four irregulars (mejor, peor, mayor, menor) as pairs with their adjective: bueno/mejor, malo/peor, grande/mayor (people), pequeño/menor (people). Once those four are automatic, every other comparison is just plug-and-chug with más/menos/tan.",
  },

  // ── 10. weather — spanish_weather_three_verbs ───────────────────────────
  {
    id: "spanish_weather_three_verbs",
    level: "A2",
    category: "weather",
    title: "Weather — the hacer / estar / haber three-verb system",
    subtitle: "English uses one verb (it's). Spanish needs three. Here's the rule.",
    intro:
      "Spanish weather is split across three verbs by what kind of phenomenon you're describing. Hacer covers temperatures and general conditions ('it's hot,' 'it's cold,' 'it's nice out'). Estar covers the current state, usually with -ndo ('it's raining,' 'it's cloudy right now'). Haber (the impersonal hay/había/habrá) covers the existence of a phenomenon ('there's fog,' 'there's a storm'). Pick the wrong verb and you sound off.",
    sentences: [
      {
        spanish: "Hace mucho calor hoy.",
        english: "It's very hot today.",
        pronunciation: "AH-seh MOO-choh kah-LOR oy",
        pronunciation_focus: ["hace + noun (calor, frío, sol, viento) for general weather conditions"],
        note:
          "hacer + weather noun is the workhorse. Hace calor (it's hot), hace frío (cold), hace sol (sunny), hace viento (windy), hace fresco (cool), hace buen/mal tiempo (nice/bad weather).",
      },
      {
        spanish: "Está lloviendo en Sevilla.",
        english: "It's raining in Seville.",
        pronunciation: "ehs-TAH yoh-BYEHN-doh ehn seh-BEE-yah",
        pronunciation_focus: [
          "está + gerund describes weather happening NOW",
          "lloviendo from llover (o→ue, but the gerund is regular)",
        ],
        note:
          "estar + gerund (-ndo) for weather actively in progress: está lloviendo, está nevando (snowing), está granizando (hailing). Also: 'está nublado' (it's cloudy — adjective form, no -ndo).",
      },
      {
        spanish: "Hay niebla en la carretera.",
        english: "There's fog on the road.",
        pronunciation: "EYE NYEH-blah ehn lah kah-rreh-TEH-rah",
        pronunciation_focus: ["hay = 'there is/are', from haber. Pronounced like the English word 'eye'."],
        note:
          "haber (hay / había / habrá) for the EXISTENCE of a weather phenomenon: hay niebla (there's fog), hay tormenta (there's a storm), hay nubes (there are clouds), hay nieve en la montaña (there's snow on the mountain).",
      },
      {
        spanish: "En invierno hace mucho frío en Madrid.",
        english: "In winter it's very cold in Madrid.",
        pronunciation: "ehn een-BYEHR-noh AH-seh MOO-choh FREE-oh ehn mah-DREED",
        pronunciation_focus: ["mucho frío — 'mucho' (not 'muy') because frío is a NOUN here, not an adjective"],
        note:
          "Common English-speaker error: 'muy frío' for 'very cold.' Wrong — frío here is a noun (cold), so it takes 'mucho.' 'El agua está muy fría' (the water is very cold) — there frío is an adjective, so 'muy' is correct.",
      },
      {
        spanish: "¿Qué tiempo hace en tu ciudad?",
        english: "What's the weather like in your city?",
        pronunciation: "keh TYEHM-poh AH-seh ehn too see-oo-DAHD",
        pronunciation_focus: ["¿Qué tiempo hace? is the standard Spain question; LatAm often uses ¿Cómo está el clima?"],
        note:
          "Spain says ¿Qué tiempo hace? LatAm prefers ¿Cómo está el clima? or ¿Qué clima hace? The Spain version uses 'tiempo' (which also means 'time' — context disambiguates).",
      },
    ],
    vocabulary: [
      { cell_id: "477d1dba-8f63-472b-af17-bd7931d84436", word: "el calor", english: "the heat", pronunciation: "ehl kah-LOR", part_of_speech: "noun", gender: "m" },
      { cell_id: "44a01c91-2540-42ec-ab7c-8847eaab0eed", word: "el frío", english: "the cold", pronunciation: "ehl FREE-oh", part_of_speech: "noun", gender: "m" },
      { cell_id: "75c7a0a4-448d-4947-851a-ecdf5e9ccfb3", word: "el sol", english: "the sun", pronunciation: "ehl sohl", part_of_speech: "noun", gender: "m" },
      { cell_id: "25f57979-d966-4a59-97d7-7a73b8e26775", word: "el viento", english: "the wind", pronunciation: "ehl BYEHN-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "ee0b215b-b74a-4512-aa84-3554c04bfdee", word: "la lluvia", english: "the rain", pronunciation: "lah YOO-byah", part_of_speech: "noun", gender: "f" },
      { cell_id: "3f5b6012-6ef4-4b89-8b55-a0406c7c9796", word: "la nieve", english: "the snow", pronunciation: "lah NYEH-beh", part_of_speech: "noun", gender: "f" },
      { cell_id: "6db7c4fe-1521-4452-acc5-9662f1e683a5", word: "la niebla", english: "the fog", pronunciation: "lah NYEH-blah", part_of_speech: "noun", gender: "f" },
      { cell_id: "cbcc8058-2dfd-4254-978b-934cca04132f", word: "la tormenta", english: "the storm", pronunciation: "lah tor-MEHN-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "d1fb4622-8e27-4571-a718-60fdab5414d4", word: "llover", english: "to rain (o→ue, mostly used in 3rd person and gerund)", pronunciation: "yoh-BEHR", part_of_speech: "verb" },
      { cell_id: "b6d20c64-7777-4e53-9f93-13b6e267e11e", word: "nevar", english: "to snow (e→ie, mostly used in 3rd person and gerund)", pronunciation: "neh-BAR", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Which verb for which weather",
        explanation:
          "Hacer + noun (general conditions, temperature, time-of-day weather): hace calor, hace sol, hace buen tiempo. Estar + gerund (something happening right now): está lloviendo, está nevando. Estar + adjective (current visible state): está nublado, está despejado. Haber (hay/había) + noun (something exists in the environment): hay niebla, hay tormenta. Pick by the type of phenomenon, not by the English equivalent — 'it's raining' (estar) and 'it's cold' (hacer) both translate as 'it's' in English but use different verbs in Spanish.",
        examples: [
          { spanish: "Hace frío. / Está nevando. / Hay nieve en el suelo.", english: "It's cold. / It's snowing. / There's snow on the ground." },
        ],
      },
      {
        point: "Mucho vs muy with weather",
        explanation:
          "When the weather word is a NOUN, use mucho/mucha/muchos/muchas (mucho calor, mucha lluvia). When it's an ADJECTIVE, use muy (está muy nublado, el día está muy soleado). The trap: 'frío' is a noun in 'hace frío' but an adjective in 'el agua está fría' — same word, different role, different intensifier.",
      },
    ],
    cultural_note:
      "Spanish weather small-talk doesn't carry the load it does in British English. A Spaniard who says '¿Qué tal el tiempo?' is asking about the weather, not making polite filler — they probably want a real answer ('horrible, llueve a cántaros' / 'awful, it's pouring'). When you genuinely have nothing to say weather-wise, Spanish moves on to soccer, food, or family — three topics that always have material.",
    tip:
      "Drill '¿Qué tiempo hace?' as a complete unit, not three separate words. It's so frequent you'll say it dozens of times in your first month of speaking, and breaking it into pieces in your head slows the entire conversation. Whole-phrase memorization is the right move for high-frequency formulas.",
    regional_variants: [
      { meaning: "How's the weather?", peninsular: "¿Qué tiempo hace?", latam: "¿Cómo está el clima? / ¿Qué clima hace?", note: "'El tiempo' for weather is universal but more textbook in LatAm, where 'el clima' has taken over in casual use." },
    ],
  },

  // ── 11. daily_routine — spanish_daily_routine_workday ───────────────────
  {
    id: "spanish_daily_routine_workday",
    level: "A2",
    category: "daily_routine",
    title: "Daily routine — describing a workday",
    subtitle: "Reflexives + time markers + frequency adverbs in their natural habitat.",
    intro:
      "This lesson chains the A2 building blocks (reflexives, time expressions, frequency adverbs) into the most-asked-for monologue: describing your workday. The pattern repeats — time + reflexive verb + activity. Master the template and you can swap in your own specifics.",
    sentences: [
      {
        spanish: "Normalmente me levanto a las seis y cuarto.",
        english: "I normally get up at quarter past six.",
        pronunciation: "nohr-mahl-MEHN-teh meh leh-BAHN-toh ah lahs SEYS ee KWAR-toh",
        pronunciation_focus: ["adverbs of frequency (normalmente, siempre, casi siempre, a veces) sit at the start or after the verb"],
        note:
          "Frequency adverbs in Spanish are flexible in placement: 'Normalmente me levanto' or 'Me levanto normalmente' are both fine. Sentence-initial gives the adverb more weight.",
      },
      {
        spanish: "Llego al trabajo sobre las nueve.",
        english: "I get to work around nine.",
        pronunciation: "YEH-goh ahl trah-BAH-hoh SOH-breh lahs NWEH-beh",
        pronunciation_focus: ["sobre las + hora gives an approximate time; a las + hora is exact"],
        note:
          "'Llegar a + place' = to arrive at. 'al' is the contraction of 'a + el' — mandatory, not optional. Same goes for 'del' (de + el).",
      },
      {
        spanish: "Como con mis compañeros a la una y media.",
        english: "I eat (lunch) with my coworkers at one thirty.",
        pronunciation: "KOH-moh kohn mees kohm-pah-NYEH-rohs ah lah OO-nah ee MEH-dyah",
        pronunciation_focus: ["a la una (singular) — only the 1 o'clock hour uses 'la' instead of 'las'"],
        note:
          "In Spain, 'la comida' (lunch) is traditionally the largest meal, taken between 1:30 and 3 pm. 'Compañeros de trabajo' = coworkers. 'Comer' alone often means 'to eat lunch' in Spain (vs 'cenar' = to eat dinner).",
      },
      {
        spanish: "Casi siempre vuelvo a casa en metro.",
        english: "I almost always go home on the metro.",
        pronunciation: "KAH-see SYEHM-preh BWEHL-boh ah KAH-sah ehn MEH-troh",
        pronunciation_focus: [
          "volver — o→ue stem-changing (vuelvo, vuelves, vuelve, volvemos, volvéis, vuelven)",
          "casi siempre = 'almost always' — frequency phrase",
        ],
        note:
          "'Volver a casa' is the idiomatic 'go back home.' Note: no article — 'a casa' (literally: 'to house') is the fixed expression.",
      },
      {
        spanish: "Después de cenar, veo una serie y me acuesto pronto.",
        english: "After eating dinner, I watch a series and go to bed early.",
        pronunciation: "dehs-PWEHS deh seh-NAR, BEH-oh OO-nah SEH-ryeh ee meh ah-KWEHS-toh PROHN-toh",
        pronunciation_focus: ["pronto = early/soon (in time); temprano = early (in the day) — overlap, but 'pronto' carries the 'soon' nuance"],
        note:
          "'Una serie' = a TV series (not a 'show' — show in Spanish is 'un programa'). Acostarse is o→ue stem-changing. 'Pronto' here means 'early' (relative to a normal bedtime).",
      },
    ],
    vocabulary: [
      { cell_id: "473103d3-14c8-4901-b06f-d01962b2cf93", word: "normalmente", english: "normally / usually", pronunciation: "nohr-mahl-MEHN-teh", part_of_speech: "adverb" },
      { cell_id: "1564f8fe-aa91-49d1-b0ee-d07289150eaa", word: "siempre", english: "always", pronunciation: "SYEHM-preh", part_of_speech: "adverb" },
      { cell_id: "f4b47ca3-0e98-46f0-87e8-1f73aaf0258b", word: "casi siempre", english: "almost always", pronunciation: "KAH-see SYEHM-preh", part_of_speech: "phrase" },
      { cell_id: "e3613713-0d95-4197-bf96-6a590ae676e8", word: "a veces", english: "sometimes", pronunciation: "ah BEH-sehs", part_of_speech: "phrase" },
      { cell_id: "36868ff2-8075-4d68-a5ca-9afacef1916b", word: "casi nunca", english: "almost never", pronunciation: "KAH-see NOON-kah", part_of_speech: "phrase" },
      { cell_id: "5ede38ef-12d3-411a-b3ba-ba8e05759c84", word: "el trabajo", english: "the job / work", pronunciation: "ehl trah-BAH-hoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "288782e5-8e52-492c-a9ee-45669a9454ce", word: "el compañero / la compañera", english: "the coworker / classmate", pronunciation: "ehl kohm-pah-NYEH-roh / lah kohm-pah-NYEH-rah", part_of_speech: "noun", gender: "mf" },
      { cell_id: "05cbef67-8c6d-4e6f-9a80-cbf94dd185b7", word: "volver", english: "to go back / return (o→ue)", pronunciation: "bohl-BEHR", part_of_speech: "verb" },
      { cell_id: "c55a43ec-35d1-4da5-9ee8-f2150b8dd7a5", word: "cenar", english: "to eat dinner", pronunciation: "seh-NAR", part_of_speech: "verb" },
      { cell_id: "f608ff23-5680-4204-b527-1ccded04ab72", word: "pronto", english: "early / soon", pronunciation: "PROHN-toh", part_of_speech: "adverb" },
    ],
    dialogue: [
      { cell_id: "c922877d-6b4d-4ce4-89b8-dab4b83c4a23", speaker: "Lucía", spanish: "¿Cómo es un día normal de trabajo para ti?", english: "What's a normal workday like for you?", pronunciation: "KOH-moh ehs oon DEE-ah nor-MAHL deh trah-BAH-hoh PAH-rah tee", register: "informal" },
      { cell_id: "301805e1-8da9-4730-8514-883d4c008210", speaker: "Tomás", spanish: "Pues me levanto a las siete, desayuno rápido y cojo el metro a las ocho.", english: "Well, I get up at seven, eat a quick breakfast, and catch the metro at eight.", pronunciation: "pwehs meh leh-BAHN-toh ah lahs SYEH-teh, deh-sah-YOO-noh RAH-pee-doh ee KOH-hoh ehl MEH-troh ah lahs OH-choh", register: "informal" },
      { cell_id: "12d80466-8443-4a4d-a1eb-bfec0119cacf", speaker: "Lucía", spanish: "¿Y a qué hora terminas?", english: "And what time do you finish?", pronunciation: "ee ah keh OH-rah tehr-MEE-nahs", register: "informal" },
      { cell_id: "15257bd3-1a8c-4258-9eb9-b8c457aa9ac3", speaker: "Tomás", spanish: "Sobre las seis. Vuelvo a casa, ceno, y normalmente leo un rato antes de dormir.", english: "Around six. I go home, have dinner, and usually read for a while before sleeping.", pronunciation: "SOH-breh lahs SEYS. BWEHL-boh ah KAH-sah, SEH-noh, ee nohr-mahl-MEHN-teh LEH-oh oon RAH-toh AHN-tehs deh dohr-MEER", register: "informal" },
    ],
    cultural_note:
      "Spanish workday rhythm has historically run on a split-shift model: morning work 9–2, long lunch 2–4 or 5, then 4–8 in the afternoon. Madrid offices are increasingly switching to a 'jornada continua' (continuous shift, 8–4 or 9–5) but the 2 pm lunch remains sacred. Schedule a coffee call with a Spaniard for 1:30 pm and you'll get a polite 'better at 4'. LatAm schedules are closer to US conventions in most countries.",
    tip:
      "When you're describing your day, give yourself permission to chain short sentences with 'y' (and). Spanish is fine with 'Me levanto, me ducho, desayuno y salgo' — you don't need conjunctions in every slot. Trying to vary sentence structure mid-monologue is the most common cause of A2 stalls.",
    regional_variants: [
      { meaning: "to take (a means of transport)", peninsular: "coger (el metro, el autobús)", latam: "tomar (el metro, el bus, el colectivo)", note: "DO NOT use 'coger' in most of Latin America (especially Mexico, Argentina, Chile, Colombia, Venezuela) — it has a strong sexual meaning. Universally safe: 'tomar.' In Spain, 'coger' is the everyday word for catching a bus or train." },
    ],
  },

  // ── 12. daily_routine — spanish_daily_routine_weekend ───────────────────
  {
    id: "spanish_daily_routine_weekend",
    level: "A2",
    category: "daily_routine",
    title: "Weekend routine — soler and the language of habit",
    subtitle: "How Spanish says 'I usually...' — soler + infinitive.",
    intro:
      "The weekend gets its own lesson because it introduces 'soler + infinitive' — Spanish's compact way of saying 'I usually [do X].' Suelo levantarme tarde (I usually get up late). Soler is conjugated and the action verb stays in the infinitive. It's simpler than English's 'usually + verb' and noticeably more natural than just stacking 'normalmente' on every sentence.",
    sentences: [
      {
        spanish: "Los fines de semana suelo levantarme tarde.",
        english: "On weekends I usually get up late.",
        pronunciation: "lohs FEE-nehs deh seh-MAH-nah SWEH-loh leh-bahn-TAR-meh TAR-deh",
        pronunciation_focus: [
          "soler is o→ue stem-changing (suelo, sueles, suele, solemos, soléis, suelen)",
          "Reflexive pronoun attaches to the INFINITIVE: levantarme, not 'me suelo levantar' (though that's also valid)",
        ],
        note:
          "Soler + infinitive = 'usually [verb].' Both 'suelo levantarme' and 'me suelo levantar' are valid placements for the reflexive pronoun. Soler doesn't really translate as a single English word — internalize it as 'be in the habit of.'",
      },
      {
        spanish: "El sábado por la mañana voy al mercado con mi pareja.",
        english: "Saturday morning I go to the market with my partner.",
        pronunciation: "ehl SAH-bah-doh por lah mah-NYAH-nah boy ahl mehr-KAH-doh kohn mee pah-REH-hah",
        pronunciation_focus: ["'pareja' is gender-neutral for 'partner' — used by both same-sex and opposite-sex couples"],
        note:
          "Days of the week are NOT capitalized in Spanish. 'El sábado' = (this/that) Saturday; 'los sábados' = on Saturdays (every Saturday). The plural form is the regular-recurrence form.",
      },
      {
        spanish: "A veces salimos a cenar fuera.",
        english: "Sometimes we go out for dinner.",
        pronunciation: "ah BEH-sehs sah-LEE-mohs ah seh-NAR FWEH-rah",
        pronunciation_focus: ["salir a + infinitive = 'to go out to [verb]'"],
        note:
          "'Salir' is the workhorse 'go out' verb — for socializing, evening plans, leaving the house. 'Cenar fuera' = to eat dinner out (literally: dinner outside). The 'fuera' marks 'not at home.'",
      },
      {
        spanish: "El domingo no hago nada, descanso todo el día.",
        english: "Sunday I don't do anything, I rest all day.",
        pronunciation: "ehl doh-MEEN-goh noh AH-goh NAH-dah, dehs-KAHN-soh TOH-doh ehl DEE-ah",
        pronunciation_focus: [
          "no...nada — Spanish doubles the negation: 'no hago nada' (literally: 'I don't do nothing'). Required.",
        ],
        note:
          "Double negation is mandatory in Spanish. 'No tengo nada' (I have nothing — literally 'I don't have nothing'), 'no veo a nadie' (I don't see anyone), 'no voy nunca' (I never go). English speakers chronically drop the 'no' and it sounds wrong.",
      },
      {
        spanish: "Suelen invitarnos a comer los domingos.",
        english: "They usually invite us to lunch on Sundays.",
        pronunciation: "SWEH-lehn een-bee-TAR-nohs ah koh-MEHR lohs doh-MEEN-gohs",
        pronunciation_focus: [
          "Reflexive/object pronoun (-nos) attached to the infinitive (invitarnos)",
          "soler conjugates for the subject (suelen = ellos/ellas/ustedes)",
        ],
        note:
          "Soler conjugates for whoever HAS the habit, not for whom the action targets. 'Suelen' = they (have the habit); 'invitarnos' = (invite us). Family Sunday lunch (la comida del domingo) is a major weekly anchor in Spain and most of LatAm.",
      },
    ],
    vocabulary: [
      { cell_id: "6af7e840-b9a6-452e-8e4c-f950b5e63699", word: "soler (o→ue)", english: "to usually [verb] / to be in the habit of", pronunciation: "soh-LEHR", part_of_speech: "verb" },
      { cell_id: "b54c7537-ff4b-4b04-9d65-ae0001129d58", word: "el fin de semana", english: "the weekend", pronunciation: "ehl feen deh seh-MAH-nah", part_of_speech: "noun", gender: "m" },
      { cell_id: "fc2666f6-27b7-4a55-8c7b-c3df4525737c", word: "el sábado", english: "Saturday", pronunciation: "ehl SAH-bah-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "1fb3608a-498d-4698-90a4-a619b913de36", word: "el domingo", english: "Sunday", pronunciation: "ehl doh-MEEN-goh", part_of_speech: "noun", gender: "m" },
      { cell_id: "9eb13200-68b7-4d38-96a2-aa245ab74b20", word: "la pareja", english: "the partner / couple (gender-neutral)", pronunciation: "lah pah-REH-hah", part_of_speech: "noun", gender: "f" },
      { cell_id: "0d730321-ed6e-46c4-a85e-e805dca29928", word: "el mercado", english: "the market", pronunciation: "ehl mehr-KAH-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "65c36099-9ff9-4e01-a824-55a03424382a", word: "salir", english: "to go out / to leave (yo salgo)", pronunciation: "sah-LEER", part_of_speech: "verb" },
      { cell_id: "fc0bff94-1a44-4eb6-a26d-a56594d135cc", word: "descansar", english: "to rest", pronunciation: "dehs-kahn-SAR", part_of_speech: "verb" },
      { cell_id: "56566bcd-d487-4f69-a1c6-f6d91404a546", word: "invitar", english: "to invite", pronunciation: "een-bee-TAR", part_of_speech: "verb" },
      { cell_id: "dabad3d0-8fe6-4de2-ad5d-a3e67df95bfa", word: "fuera", english: "outside / out (also used in 'fuera de casa')", pronunciation: "FWEH-rah", part_of_speech: "adverb" },
    ],
    grammar: [
      {
        point: "soler + infinitive",
        explanation:
          "Conjugate soler (o→ue) for the person who has the habit; the action verb stays in the infinitive. 'Suelo + ir, sueles + comer, suele + estudiar.' This is THE compact way to express habits in Spanish — much more natural than 'normalmente voy.' Note: soler doesn't have a future or imperative form (you can't 'will usually' or 'usually do!'); for those use 'normalmente' instead.",
        examples: [
          { spanish: "Suelo desayunar a las ocho.", english: "I usually have breakfast at eight." },
          { spanish: "¿Sueles ver mucha tele?", english: "Do you usually watch much TV?" },
        ],
      },
      {
        point: "Double negation",
        explanation:
          "Spanish requires 'no' before the verb when a negative word (nada, nadie, nunca, ningún) appears AFTER the verb. 'No quiero nada' (I don't want anything), 'no veo a nadie' (I don't see anyone), 'no voy nunca' (I never go). If the negative word comes BEFORE the verb, the 'no' drops: 'Nunca voy' = 'No voy nunca.' Both are correct.",
      },
    ],
    dialogue: [
      { cell_id: "2f127a92-f273-44ea-9aa4-bb64c261d177", speaker: "Pilar", spanish: "¿Qué sueles hacer los fines de semana?", english: "What do you usually do on weekends?", pronunciation: "keh SWEH-lehs ah-SEHR lohs FEE-nehs deh seh-MAH-nah", register: "informal" },
      { cell_id: "72046b06-0d54-47de-b37a-04d4bbee10bc", speaker: "Carlos", spanish: "Pues los sábados salgo con amigos. Los domingos suelo quedar con mi familia para comer.", english: "Saturdays I go out with friends. Sundays I usually meet up with my family for lunch.", pronunciation: "pwehs lohs SAH-bah-dohs SAHL-goh kohn ah-MEE-gohs. lohs doh-MEEN-gohs SWEH-loh keh-DAR kohn mee fah-MEE-lyah PAH-rah koh-MEHR", register: "informal" },
      { cell_id: "e2b9b442-afa7-4235-a65b-62ff51f501f0", speaker: "Pilar", spanish: "¿No descansas nunca?", english: "Don't you ever rest?", pronunciation: "noh dehs-KAHN-sahs NOON-kah", register: "informal" },
      { cell_id: "62602ed2-b1b3-46ce-bc1b-aba20316c64d", speaker: "Carlos", spanish: "El domingo por la tarde no hago nada, sólo descanso.", english: "Sunday afternoon I don't do anything, I just rest.", pronunciation: "ehl doh-MEEN-goh por lah TAR-deh noh AH-goh NAH-dah, SOH-loh dehs-KAHN-soh", register: "informal" },
    ],
    cultural_note:
      "'Salir' on a weekend night in Spain is a logistical operation. A typical Madrid Saturday night runs: dinner 9:30–11:30, drinks at a bar 11:30–1:30, dancing/club 2–6 am, churros con chocolate at sunrise. If a Spaniard says 'salimos esta noche' on a Saturday, the implicit timeline isn't '8 pm dinner like Americans' — it's 'we'll be home around dawn.' Calibrate your stamina expectations.",
    tip:
      "Drill 'suelo + infinitive' until it's automatic. It's the single highest-leverage A2 phrase for talking about your life — replaces a lot of awkward 'normalmente + verb' constructions and instantly sounds more native. Pick five things you usually do and rehearse: 'Suelo X, suelo Y, suelo Z.'",
  },

  // ── 13. shopping — spanish_shopping_clothes ─────────────────────────────
  {
    id: "spanish_shopping_clothes",
    level: "A2",
    category: "shopping",
    title: "Shopping for clothes — talla, quedar, probarse",
    subtitle: "The three verbs you'll use in every Spanish-speaking dressing room.",
    intro:
      "Buying clothes in Spanish has its own small vocabulary that doesn't map to English directly. 'Talla' (size) is a noun, not a number you give; 'quedar' (to fit/look) is a gustar-style verb that runs backward; 'probarse' (to try on) is reflexive. Get these three right and you can navigate any Zara, Falabella, or Mexican boutique without switching to English.",
    sentences: [
      {
        spanish: "¿Qué talla usa?",
        english: "What size do you wear/use?",
        pronunciation: "keh TAH-yah OO-sah",
        pronunciation_focus: ["usted (formal) form: usa, not usas"],
        note:
          "Standard shop assistant question, formal (because you're a stranger). 'Talla' is for clothes; for shoes you say 'número' (¿qué número calza?). Don't mix them.",
      },
      {
        spanish: "¿Puedo probarme estos pantalones?",
        english: "Can I try on these pants?",
        pronunciation: "PWEH-doh proh-BAR-meh EHS-tohs pahn-tah-LOH-nehs",
        pronunciation_focus: [
          "probarse is reflexive when YOU are trying something on (probar without -se = to taste/test)",
          "Pronoun -me attached to the infinitive after the modal poder",
        ],
        note:
          "'Probar' alone = to taste (food) or to test (a hypothesis). 'Probarse' = to try on (clothing). The reflexive flips the meaning — you're testing the clothes on yourself.",
      },
      {
        spanish: "Esta camisa me queda grande.",
        english: "This shirt is too big on me. (Lit: This shirt fits big to me.)",
        pronunciation: "EHS-tah kah-MEE-sah meh KEH-dah GRAHN-deh",
        pronunciation_focus: ["quedar conjugates with the clothing item, not with 'me' — same backward structure as gustar"],
        note:
          "Quedar (in this sense) = 'to fit' or 'to look on someone.' Works exactly like gustar: the clothing is the subject, the wearer is the indirect object. 'Te queda bien' = it looks good on you. 'Me quedan apretados' = they (pl) are tight on me.",
      },
      {
        spanish: "¿Lo tienen en una talla más pequeña?",
        english: "Do you have it in a smaller size?",
        pronunciation: "loh TYEH-nehn ehn OO-nah TAH-yah mahs peh-KEH-nyah",
        pronunciation_focus: [
          "lo = direct object replacing the item (the shirt, etc.)",
          "tienen = ustedes/ellos form, used here to address shop staff collectively",
        ],
        note:
          "Spanish shops are addressed in plural-formal (ustedes) even when there's one assistant — you're addressing 'the store.' 'Más pequeña / más grande / más ajustada' (smaller / bigger / tighter).",
      },
      {
        spanish: "Es muy bonito, pero me lo voy a pensar.",
        english: "It's very nice, but I'll think about it.",
        pronunciation: "ehs moo-EE boh-NEE-toh, PEH-roh meh loh boy ah pehn-SAR",
        pronunciation_focus: [
          "'me lo voy a pensar' — the polite Spanish 'no thank you' to a shop assistant",
        ],
        note:
          "This is the universal walk-away phrase. Translation in spirit is 'thanks, I'm going to think about it' — said with smile, then leave. Direct 'no' or 'no me gusta' sounds blunt; the pensar-frame preserves face on both sides.",
      },
    ],
    vocabulary: [
      { cell_id: "cfd7c113-e8ba-4503-b7e7-ae61ab6dc2ff", word: "la talla", english: "the size (clothing)", pronunciation: "lah TAH-yah", part_of_speech: "noun", gender: "f" },
      { cell_id: "882a5d31-b059-45dc-bf81-91fd70d51a19", word: "el número", english: "the size (shoes)", pronunciation: "ehl NOO-meh-roh", part_of_speech: "noun", gender: "m" },
      { cell_id: "7e417b52-c7fd-408b-b84e-a7b7bd9899c0", word: "probarse (o→ue)", english: "to try on (reflexive)", pronunciation: "proh-BAR-seh", part_of_speech: "reflexive verb" },
      { cell_id: "51b6cc28-8af7-4a1d-afd4-5831e8895e8b", word: "quedar", english: "to fit / to look on someone (gustar-style)", pronunciation: "keh-DAR", part_of_speech: "verb" },
      { cell_id: "7fbc90aa-42ac-4ef7-ab35-c3037a9613b4", word: "la camisa", english: "the (button-down) shirt", pronunciation: "lah kah-MEE-sah", part_of_speech: "noun", gender: "f" },
      { cell_id: "7100b307-2c0a-4aa8-ad02-1e05f151f76c", word: "la camiseta", english: "the t-shirt (Spain) — see regional variants", pronunciation: "lah kah-mee-SEH-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "67fea1e5-039c-4a28-961c-d60862232515", word: "los pantalones", english: "the pants/trousers (always plural)", pronunciation: "lohs pahn-tah-LOH-nehs", part_of_speech: "noun", gender: "m", plural: "los pantalones" },
      { cell_id: "caac81a7-71b2-4858-8e78-7917eba61a29", word: "los vaqueros", english: "the jeans (Spain) — see regional variants", pronunciation: "lohs bah-KEH-rohs", part_of_speech: "noun", gender: "m" },
      { cell_id: "6c8dea39-0036-4148-8fd4-91e9a6695e84", word: "la chaqueta", english: "the jacket", pronunciation: "lah chah-KEH-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "904d4901-6b1e-4209-b63a-817b2e121f3f", word: "el probador", english: "the dressing room", pronunciation: "ehl proh-bah-DOHR", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "Quedar — the gustar-style 'fit/look' verb",
        explanation:
          "Quedar conjugates for the item of clothing, not for the person wearing it. 'Me queda grande' (it's big on me — sing item), 'me quedan grandes' (they're big on me — pl items), 'te queda bien ese color' (that color looks good on you). The same person+thing logic as gustar: indirect object pronoun + verb agreeing with the item.",
        examples: [
          { spanish: "Me queda perfecto. / Te quedan apretados. / Le queda bien el rojo.", english: "It fits me perfectly. / They're tight on you. / Red looks good on him/her." },
        ],
      },
    ],
    dialogue: [
      { cell_id: "ba60b6f6-1474-4c52-9d51-030847bbbbda", speaker: "Dependienta", spanish: "Buenos días. ¿En qué puedo ayudarle?", english: "Good morning. How can I help you?", pronunciation: "BWEH-nohs DEE-ahs. ehn keh PWEH-doh ah-yoo-DAR-leh", register: "formal" },
      { cell_id: "cc50bc03-592e-489d-aa59-5cc00f0d390f", speaker: "Cliente", spanish: "Hola, ¿puedo probarme esta camisa? La 38, por favor.", english: "Hi, can I try on this shirt? Size 38, please.", pronunciation: "OH-lah, PWEH-doh proh-BAR-meh EHS-tah kah-MEE-sah? lah TREYN-tah ee OH-choh, por fah-BOR", register: "neutral" },
      { cell_id: "b1571d6e-5e98-48ad-862f-e35d6595b7e1", speaker: "Dependienta", spanish: "Por supuesto. El probador está al fondo a la derecha.", english: "Of course. The dressing room is at the back on the right.", pronunciation: "por soo-PWEHS-toh. ehl proh-bah-DOHR ehs-TAH ahl FOHN-doh ah lah deh-REH-chah", register: "formal" },
      { cell_id: "53403a66-8ee4-4723-b4c1-e5ca7df311a7", speaker: "Cliente", spanish: "Me queda un poco grande. ¿La tienen en una talla menos?", english: "It's a little big on me. Do you have it in a smaller size?", pronunciation: "meh KEH-dah oon POH-koh GRAHN-deh. lah TYEH-nehn ehn OO-nah TAH-yah MEH-nohs", register: "neutral" },
      { cell_id: "e4da3a9e-5dcf-48c5-9787-e38b6873af71", speaker: "Dependienta", spanish: "Voy a mirar. Un momento.", english: "I'll go check. One moment.", pronunciation: "boy ah mee-RAR. oon moh-MEHN-toh", register: "formal" },
    ],
    cultural_note:
      "Sales in Spain happen on a SCHEDULE: las rebajas de invierno (January–February) and las rebajas de verano (July–August). Stores cannot legally discount outside these windows in many cases; what looks like a year-round 'oferta' in a Spanish shop window during March is usually a promotional discount on a specific item, not a sale. Asking 'is this on sale?' in May confuses the assistant. LatAm doesn't share this rebajas calendar — sales happen whenever stores decide.",
    tip:
      "Don't translate 'fits' literally. Reach for 'me queda + adjective' as a unit: me queda bien (fits well), me queda grande (too big), me queda apretado (too tight), me queda corto (too short). Trying to construct 'this shirt fits me well' word-by-word in real time is where conversations stall.",
    regional_variants: [
      { meaning: "jeans", peninsular: "vaqueros", latam: "jeans (pronounced 'yeens'), some places 'pantalón de mezclilla' (Mexico)", note: "'Vaqueros' (literally 'cowboy pants') sounds dated/Spain-flavored in much of LatAm." },
      { meaning: "T-shirt", peninsular: "camiseta", latam: "playera (Mexico), remera (Argentina, Uruguay), polera (Chile)", note: "Camiseta is universally understood but each country has a stronger local default." },
      { meaning: "jacket", peninsular: "chaqueta", latam: "chamarra (Mexico, Central America), campera (Argentina, Uruguay)", note: "Chaqueta is universally understood. Note: in some parts of Mexico 'chaqueta' has a vulgar slang meaning — when in doubt say 'chamarra.'" },
    ],
  },

  // ── 14. shopping — spanish_shopping_market_regateo ──────────────────────
  {
    id: "spanish_shopping_market_regateo",
    level: "A2",
    category: "shopping",
    title: "At the market — bargaining (regateo) etiquette",
    subtitle: "Where you can haggle, where you can't, and how to do it without offending.",
    intro:
      "Regateo (bargaining) is real but tightly bounded in the Spanish-speaking world. It happens at artisan markets, tourist stalls, El Rastro in Madrid, informal vendors in LatAm, and almost nowhere else. Trying to haggle in a supermarket or a chain store reads as either rude or clueless. This lesson covers the language for both the haggling that's welcome and the polite price-checking that works everywhere.",
    sentences: [
      {
        spanish: "¿Cuánto cuesta este collar?",
        english: "How much does this necklace cost?",
        pronunciation: "KWAHN-toh KWEHS-tah EHS-teh koh-YAR",
        pronunciation_focus: ["costar is o→ue (cuesta, cuestan), only used in 3rd person for prices"],
        note:
          "Standard opener. 'Cuesta' (sing) for one item, 'cuestan' (pl) for multiple. The verb agrees with the item being priced, not with you.",
      },
      {
        spanish: "¿Me hace un descuento si llevo dos?",
        english: "Will you give me a discount if I take two?",
        pronunciation: "meh AH-seh oon dehs-KWEHN-toh see YEH-boh dohs",
        pronunciation_focus: [
          "'hacer un descuento' = to give a discount (literally: to make a discount)",
          "llevar = 'to take' in the sense of taking purchased items",
        ],
        note:
          "The polite haggling opener. You're not demanding; you're proposing a quantity discount. Most artisan vendors will respond positively — even if just dropping the price slightly. The 'si llevo dos' framing makes it about volume, not about distrust of their pricing.",
      },
      {
        spanish: "Es un poco caro para mí. ¿Es lo mejor que puede hacer?",
        english: "It's a bit expensive for me. Is that the best you can do?",
        pronunciation: "ehs oon POH-koh KAH-roh PAH-rah mee. ehs loh meh-HOR keh PWEH-deh ah-SEHR",
        pronunciation_focus: ["lo mejor = 'the best (of it)' — neuter article 'lo' for abstract qualities"],
        note:
          "The classic 'soft pushback' phrase. 'Es un poco caro' is gentle and gives the seller a face-saving way to come down. Avoid 'es muy caro' (too direct/blunt) at first contact — save that for later rounds if needed.",
      },
      {
        spanish: "Le dejo veinte y nos olvidamos del cambio.",
        english: "I'll leave you twenty and we forget the change.",
        pronunciation: "leh DEH-hoh BEYN-teh ee nohs ohl-bee-DAH-mohs dehl KAHM-byoh",
        pronunciation_focus: ["dejar (to leave) + amount = the bargaining offer formula"],
        note:
          "A common closing move at LatAm artisan markets. 'Le dejo X' = 'I'll give you X (final offer).' The 'nos olvidamos del cambio' implies a round number that ends the negotiation cleanly. Often accepted with a smile and a handshake.",
      },
      {
        spanish: "Vale, me lo llevo. Muchas gracias.",
        english: "OK, I'll take it. Thanks very much.",
        pronunciation: "BAH-leh, meh loh YEH-boh. MOO-chahs GRAH-syahs",
        pronunciation_focus: ["'vale' = 'OK' in Spain; LatAm prefers 'bueno', 'está bien', or 'dale' (Argentina)"],
        note:
          "Closing the deal. 'Me lo llevo' (I'll take it) seals the purchase. 'Vale' is uniquely Spanish-Spain; LatAm equivalents vary by country (bueno in Mexico/Colombia, dale in Argentina, listo in Chile).",
      },
    ],
    vocabulary: [
      { cell_id: "8b483a63-a441-4d2a-a8c4-5163e7ef530c", word: "el regateo", english: "the bargaining / haggling (the practice)", pronunciation: "ehl rreh-gah-TEH-oh", part_of_speech: "noun", gender: "m" },
      { cell_id: "a1bcc838-8ed8-4e00-aa6c-de73e4b919e7", word: "regatear", english: "to bargain / haggle", pronunciation: "rreh-gah-teh-AR", part_of_speech: "verb" },
      { cell_id: "218ed5f4-1315-491c-9046-96797f4528e6", word: "el descuento", english: "the discount", pronunciation: "ehl dehs-KWEHN-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "461b4e02-66e1-487f-93fc-530f3d977dcb", word: "caro / cara", english: "expensive (m/f)", pronunciation: "KAH-roh / KAH-rah", part_of_speech: "adjective" },
      { cell_id: "2ca50341-47a7-461d-a2cc-79abe4961c9b", word: "barato / barata", english: "cheap / inexpensive (m/f)", pronunciation: "bah-RAH-toh / bah-RAH-tah", part_of_speech: "adjective" },
      { cell_id: "6895d89d-0252-4961-855a-2fdd4bcf8119", word: "el precio", english: "the price", pronunciation: "ehl PREH-syoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "8388e0df-d249-4df1-b69f-4ad3484a45a1", word: "el cambio", english: "the change (money returned) / the exchange", pronunciation: "ehl KAHM-byoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "f631d9ef-f4fa-4c1d-89ae-ef887b50116c", word: "llevar", english: "to take / to carry / to wear", pronunciation: "yeh-BAR", part_of_speech: "verb" },
      { cell_id: "fdc2fc3c-7861-4be4-8159-aaf4d36cc202", word: "el mercado", english: "the market (artisan, food, or general)", pronunciation: "ehl mehr-KAH-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "763aa0a7-954e-482a-9106-be4b5888d7bf", word: "el puesto", english: "the stall (in a market)", pronunciation: "ehl PWEHS-toh", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "lo + adjective for abstract qualities",
        explanation:
          "Spanish uses the neuter article 'lo' before an adjective to express the abstract quality — 'lo bueno' (the good thing / what's good), 'lo importante' (what's important), 'lo mejor que puede hacer' (the best [thing] you can do). 'Lo' isn't masculine; it's neuter. Use it whenever you'd say 'the X thing' in English without referring to a specific noun.",
        examples: [
          { spanish: "Lo difícil es decidir. / Lo bueno es que es barato.", english: "The hard part is deciding. / The good thing is it's cheap." },
        ],
      },
    ],
    dialogue: [
      { cell_id: "6471b45f-039e-4bef-82f9-9720603ec51e", speaker: "Vendedor", spanish: "¿Le interesa algo? Tengo collares muy bonitos.", english: "Are you interested in anything? I have very nice necklaces.", pronunciation: "leh een-teh-REH-sah AHL-goh? TEHN-goh koh-YAH-rehs moo-EE boh-NEE-tohs", register: "formal" },
      { cell_id: "efd7a247-fa47-4151-9b8b-e49ca670df01", speaker: "Cliente", spanish: "Me gusta éste. ¿Cuánto cuesta?", english: "I like this one. How much does it cost?", pronunciation: "meh GOOS-tah EHS-teh. KWAHN-toh KWEHS-tah", register: "neutral" },
      { cell_id: "fa47aa35-847e-4b3e-b1fd-2b1767d983f9", speaker: "Vendedor", spanish: "Veinticinco. Hecho a mano, plata pura.", english: "Twenty-five. Handmade, pure silver.", pronunciation: "beyn-tee-SEEN-koh. EH-choh ah MAH-noh, PLAH-tah POO-rah", register: "neutral" },
      { cell_id: "838d52f0-95fc-4b76-af7a-115ddfe0c276", speaker: "Cliente", spanish: "Es un poco caro. ¿Me lo deja en veinte?", english: "It's a bit expensive. Will you let me have it for twenty?", pronunciation: "ehs oon POH-koh KAH-roh. meh loh DEH-hah ehn BEYN-teh", register: "neutral" },
      { cell_id: "80043373-cb4b-4e8b-b40f-4bb708e55db1", speaker: "Vendedor", spanish: "Veintidós y nos olvidamos del cambio.", english: "Twenty-two and we forget the change.", pronunciation: "beyn-tee-DOHS ee nohs ohl-bee-DAH-mohs dehl KAHM-byoh", register: "neutral" },
      { cell_id: "f2ef809c-bc58-4e83-9634-01013cf98562", speaker: "Cliente", spanish: "Vale, me lo llevo.", english: "OK, I'll take it.", pronunciation: "BAH-leh, meh loh YEH-boh", register: "informal" },
    ],
    cultural_note:
      "Where you CAN haggle: artisan markets (mercados de artesanía), tourist souvenir stalls, Madrid's El Rastro, informal street vendors, antique fairs. Where you CANNOT: supermarkets, chain stores (Zara, Mercadona, Falabella), restaurants, taxis with meters, pharmacies, anything with a printed price tag attached. Trying to haggle in the wrong place reads as either rude (in Spain) or as not understanding how the business works (everywhere). When in doubt, ask quietly and politely; if the vendor blinks, drop it immediately.",
    tip:
      "First-offer move at an artisan market: cut their price by ~20% and propose with 'le dejo X y me lo llevo.' Expect to settle around 10% off. Going for 50% off insults the vendor and ends the conversation. Bargaining is a face-saving dance, not a price war — both parties want to walk away feeling they got something.",
    regional_variants: [
      { meaning: "OK / agreed", peninsular: "vale", latam: "bueno (Mex/Col), dale (Arg), listo (Chile), bien (general)", note: "'Vale' immediately marks you as Spanish-Spain-trained anywhere in LatAm. Not wrong, just stylistically distinctive." },
    ],
  },

  // ── 15. directions — spanish_directions_usted_commands ──────────────────
  {
    id: "spanish_directions_usted_commands",
    level: "A2",
    category: "directions",
    title: "Asking for and giving directions — formal usted commands",
    subtitle: "Why directions are almost always given in usted form.",
    intro:
      "When you ask a stranger for directions, you address them with usted — and they answer in usted-command form ('siga recto,' 'gire a la derecha'). This lesson covers both sides: how to ask politely and how to parse the answer. Bonus: location prepositions and the polite phrases that frame any direction-asking exchange.",
    sentences: [
      {
        spanish: "Disculpe, ¿cómo se va a la estación de tren?",
        english: "Excuse me, how do you get to the train station?",
        pronunciation: "dees-KOOL-peh, KOH-moh seh bah ah lah ehs-tah-SYOHN deh trehn",
        pronunciation_focus: [
          "'disculpe' (formal) is the usted form; 'disculpa' would be informal",
          "'se va' = impersonal 'one goes' / 'do you get' — much more polite than 'voy' or 'vas' here",
        ],
        note:
          "The all-purpose direction-asking opener. 'Cómo se va a + place' is the most polite form. Alternative: '¿Por dónde se va a...?' or '¿Sabe dónde está...?' (do you know where X is?).",
      },
      {
        spanish: "Siga recto dos manzanas y luego gire a la derecha.",
        english: "Go straight for two blocks and then turn right.",
        pronunciation: "SEE-gah RREHK-toh dohs mahn-SAH-nahs ee LWEH-goh HEE-reh ah lah deh-REH-chah",
        pronunciation_focus: [
          "siga = usted command of seguir (e→i, irregular: yo sigo)",
          "gire = usted command of girar (regular -ar)",
        ],
        note:
          "Usted command formation: take the yo present-tense form, drop the -o, add -e (for -ar verbs) or -a (for -er/-ir verbs). yo sigo → siga; yo giro → gire; yo cruzo → cruce (z→c spelling change). Spain uses 'manzana' for city block; LatAm uses 'cuadra.'",
      },
      {
        spanish: "Está enfrente del banco, al lado de la farmacia.",
        english: "It's across from the bank, next to the pharmacy.",
        pronunciation: "ehs-TAH ehn-FREHN-teh dehl BAHN-koh, ahl LAH-doh deh lah far-MAH-syah",
        pronunciation_focus: [
          "del = de + el (mandatory contraction)",
          "Location prepositions are compound: enfrente DE, al lado DE, cerca DE, lejos DE",
        ],
        note:
          "Most location prepositions in Spanish are compound and end in 'de' — enfrente de (across from), al lado de (next to), cerca de (near), lejos de (far from), detrás de (behind), delante de (in front of).",
      },
      {
        spanish: "¿Está lejos de aquí?",
        english: "Is it far from here?",
        pronunciation: "ehs-TAH LEH-hohs deh ah-KEE",
        pronunciation_focus: ["lejos = far (irregular adverb, not 'lejano' which is the adjective)"],
        note:
          "The standard follow-up. 'Aquí' = here (close to me); 'ahí' = there (close to you / nearby); 'allí' = over there (far). Three-step distance system that maps loosely to here/there/yonder.",
      },
      {
        spanish: "Cruce la calle en el semáforo y la verá a su izquierda.",
        english: "Cross the street at the traffic light and you'll see it on your left.",
        pronunciation: "KROO-seh lah KAH-yeh ehn ehl seh-MAH-foh-roh ee lah beh-RAH ah soo ees-KYEHR-dah",
        pronunciation_focus: [
          "cruzar → cruce (z→c spelling change in usted command, just like in preterite yo)",
          "la verá = 'you (formal) will see her/it' — direct object pronoun + future tense ver",
        ],
        note:
          "'A su izquierda / a su derecha' (on your left/right) — uses 'su' because we're in usted register. With tú it would be 'a tu izquierda.' The future tense (verá) here functions as a polite/predictive 'you will see.'",
      },
    ],
    vocabulary: [
      { cell_id: "9e998552-0328-47a3-87f3-9fd56e3fac12", word: "disculpe / perdone", english: "excuse me (formal — usted)", pronunciation: "dees-KOOL-peh / pehr-DOH-neh", part_of_speech: "interjection" },
      { cell_id: "50c3eea1-b800-414b-8c4e-c0519047655e", word: "seguir (e→i, yo sigo)", english: "to follow / to keep going", pronunciation: "seh-GEER", part_of_speech: "verb" },
      { cell_id: "9081adc5-1d4b-4af4-87f3-a0c97c13ff8b", word: "girar", english: "to turn", pronunciation: "hee-RAR", part_of_speech: "verb" },
      { cell_id: "57700154-ddb5-4fb5-82f8-6f76d5a681c5", word: "cruzar", english: "to cross (z→c in usted command and yo preterite)", pronunciation: "kroo-SAR", part_of_speech: "verb" },
      { cell_id: "f379b993-a4bc-4ba1-b937-9813c4841a50", word: "recto / derecho", english: "straight ahead", pronunciation: "RREHK-toh / deh-REH-choh", part_of_speech: "adverb" },
      { cell_id: "a576cdc8-337c-4181-a902-76a3f1d84ad1", word: "a la derecha", english: "to/on the right", pronunciation: "ah lah deh-REH-chah", part_of_speech: "phrase" },
      { cell_id: "d387b0d0-c686-472b-aeb9-cc8118febdf6", word: "a la izquierda", english: "to/on the left", pronunciation: "ah lah ees-KYEHR-dah", part_of_speech: "phrase" },
      { cell_id: "7ab2386d-f1bd-4d7b-b394-f1b0b8d25f7b", word: "enfrente de", english: "across from / opposite", pronunciation: "ehn-FREHN-teh deh", part_of_speech: "preposition phrase" },
      { cell_id: "bb2406cb-6562-44d4-af1f-4b65f4ed069c", word: "al lado de", english: "next to", pronunciation: "ahl LAH-doh deh", part_of_speech: "preposition phrase" },
      { cell_id: "359c6821-fbc8-4a45-8bd9-f43184ddff0e", word: "el semáforo", english: "the traffic light", pronunciation: "ehl seh-MAH-foh-roh", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "Usted commands",
        explanation:
          "Take the yo form of the present tense (yo hablo, yo como, yo sigo), drop the -o, and switch the vowel: -ar verbs end in -e (hable), -er/-ir verbs end in -a (coma, siga). Plural 'ustedes' command adds -n: hablen, coman, sigan. Negative commands use the same form: 'no hable,' 'no cruce.' Object pronouns ATTACH to affirmative commands ('dígame' = tell me) and PRECEDE negative ones ('no me diga' = don't tell me / no way!).",
        examples: [
          { spanish: "Siga recto. / Gire a la derecha. / No cruce aquí.", english: "Go straight. / Turn right. / Don't cross here." },
        ],
      },
      {
        point: "Location prepositions ending in 'de'",
        explanation:
          "enfrente de (across from), al lado de (next to), cerca de (near), lejos de (far from), detrás de (behind), delante de (in front of), encima de (on top of / above), debajo de (under). The 'de' is part of the preposition phrase — don't drop it. When the next word is 'el', contract to 'del': enfrente DEL banco, cerca DEL parque.",
      },
    ],
    dialogue: [
      { cell_id: "835d5111-b1cc-4580-9676-4e76981fcaf0", speaker: "Turista", spanish: "Disculpe, ¿cómo se va a la Plaza Mayor?", english: "Excuse me, how do you get to Plaza Mayor?", pronunciation: "dees-KOOL-peh, KOH-moh seh bah ah lah PLAH-sah mah-YOHR", register: "formal" },
      { cell_id: "c4c8d119-b853-44cb-b3d9-d6379f2cf00d", speaker: "Local", spanish: "Está cerca. Siga por esta calle dos manzanas y gire a la izquierda.", english: "It's nearby. Follow this street two blocks and turn left.", pronunciation: "ehs-TAH SEHR-kah. SEE-gah por EHS-tah KAH-yeh dohs mahn-SAH-nahs ee HEE-reh ah lah ees-KYEHR-dah", register: "formal" },
      { cell_id: "5a987311-e7fb-4741-9025-083bf2f2d14f", speaker: "Turista", spanish: "¿Y luego?", english: "And then?", pronunciation: "ee LWEH-goh", register: "informal" },
      { cell_id: "2a4dfe09-71fe-408f-98fc-85cba44acc92", speaker: "Local", spanish: "Cruce la avenida en el semáforo y la verá enfrente.", english: "Cross the avenue at the traffic light and you'll see it across the way.", pronunciation: "KROO-seh lah ah-beh-NEE-dah ehn ehl seh-MAH-foh-roh ee lah beh-RAH ehn-FREHN-teh", register: "formal" },
      { cell_id: "057cd29c-580f-4a60-b5c1-41d0f569cfa0", speaker: "Turista", spanish: "Muchas gracias, muy amable.", english: "Thanks very much, very kind of you.", pronunciation: "MOO-chahs GRAH-syahs, moo-EE ah-MAH-bleh", register: "neutral" },
    ],
    cultural_note:
      "Asking strangers for directions is usually friendly in Spanish-speaking countries, but the answers may be CREATIVE — many cultures consider 'I don't know' impolite, so people sometimes invent a plausible-sounding answer rather than admit ignorance. Always confirm with a second person in cities you don't know. Pro move: ask two people independently and compare. If the answers diverge, ask a third. This isn't malicious; it's a politeness pattern that prioritizes 'helping' over 'admitting limits.'",
    tip:
      "Memorize three usted commands cold: SIGA (go on/follow), GIRE (turn), CRUCE (cross). Plus 'a la derecha' and 'a la izquierda.' That five-phrase kit decodes about 80% of the directions you'll be given. The rest is street names and landmarks you can pattern-match.",
    regional_variants: [
      { meaning: "city block", peninsular: "manzana", latam: "cuadra", note: "'Manzana' literally means 'apple' — it's the same word for 'city block' in Spain. LatAm reserves 'manzana' for the fruit and uses 'cuadra' for blocks." },
    ],
  },
];

export default lessons;
