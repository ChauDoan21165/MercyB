// src/languages/spanish/lessons-b1.ts
//
// ⚠️ AI-AUTHORED CONTENT — recommend native-speaker review before merge.
//
// Spanish-for-English-speakers, B1 corpus. 20 hand-crafted lessons.
//
// Pedagogical bets baked into the distribution:
//
//   1. Preterite vs imperfect gets FOUR lessons because it is the
//      single biggest B1 cliff for English speakers. The contrast
//      alone is not enough — meaning-change verbs and fixed time
//      markers each need their own dedicated lesson.
//   2. Subjunctive gets FOUR lessons. Forms come FIRST (before any
//      usage trigger), then volition, emotion, and doubt — the three
//      trigger families that unlock most B1 usage. The "dirty six"
//      irregulars (ser, estar, ir, saber, dar, haber) are introduced
//      as a memorize-as-a-block group.
//   3. Por vs para gets THREE lessons. One lesson cannot reliably
//      teach this distinction; the core rules, the time uses, and
//      the purpose/cause split each need real space.
//   4. SI conditionals teach Type 1 and Type 2 for production; Type 3
//      (pluperfect subjunctive + conditional perfect) is preview-only.
//      Full mastery in B2.
//   5. Future of probability and conditional for politeness are
//      treated as the distinctly Spanish features that lift output
//      from grammatical-but-foreign into native-sounding register.
//   6. Thematic content (travel, work, health, opinions) is shorter —
//      6 lessons total — because the grammar load this round is heavy
//      and bulk-padding themes would dilute the actually-hard pieces.
//   7. The two-subject rule for subjunctive ('Quiero ir' vs 'Quiero
//      que vayas') appears explicitly in the volition lesson and is
//      carried implicitly through emotion and doubt.
//   8. Regional variants flagged where they matter at B1: constipado
//      false friend (massive), consulta/consultorio, ascensor/elevador,
//      reserva/reservación, the coger taboo zone, the -ra/-se imperfect
//      subjunctive distribution, vosotros vs ustedes.

import type { SpanishLesson } from "./lessons";

export const lessons: SpanishLesson[] = [
  // ── 1. preterite_vs_imperfect — spanish_preterite_imperfect_contrast ──
  {
    id: "spanish_preterite_imperfect_contrast",
    level: "B1",
    category: "preterite_vs_imperfect",
    title: "Preterite vs imperfect — the core decision",
    subtitle: "Two past tenses, one decision rule. Event or background?",
    intro:
      "Spanish splits the past into two tenses where English uses one. Preterite is the 'event' tense: a single completed action with a beginning and an end. Imperfect is the 'background' tense: ongoing states, habits, and the scenery a story is set against. The decision is not about WHEN something happened — it is about HOW the speaker frames it. Get this distinction wired and 80% of B1 past-tense usage falls into place.",
    sentences: [
      {
        spanish: "Cuando era niño, vivía en Madrid.",
        english: "When I was a child, I lived in Madrid.",
        pronunciation: "KWAHN-doh EH-rah NEE-nyoh, bee-BEE-ah ehn mah-DREED",
        pronunciation_focus: [
          "Imperfect endings -aba and -ía always carry their own stress — bee-BEE-ah, not BEE-bee-ah",
          "Soft 'b' in 'vivía' (Spanish 'v' is the same sound as 'b')",
        ],
        note:
          "Both verbs are imperfect because both describe ongoing background states — being a child, living somewhere. No specific endpoint.",
      },
      {
        spanish: "Ayer fui al supermercado y compré pan.",
        english: "Yesterday I went to the supermarket and bought bread.",
        pronunciation: "ah-YEHR fwee ahl soo-pehr-mehr-KAH-doh ee kohm-PREH pahn",
        pronunciation_focus: [
          "Preterite yo forms stress the final syllable — kohm-PREH, not KOHM-preh",
        ],
        note:
          "Two completed events with clear endpoints. The supermarket trip started and ended; the bread purchase started and ended. Classic preterite chain.",
      },
      {
        spanish: "Llovía cuando salí de casa.",
        english: "It was raining when I left the house.",
        pronunciation: "yoh-BEE-ah KWAHN-doh sah-LEE deh KAH-sah",
        pronunciation_focus: [
          "Imperfect 'llovía' = ongoing rain (background); preterite 'salí' = completed action (event)",
        ],
        note:
          "The classic mixed sentence. Background (imperfect 'llovía') gets interrupted by an event (preterite 'salí'). This is the most-tested pattern in any B1 exam.",
      },
      {
        spanish: "De niña siempre comía cereal para desayunar.",
        english: "As a girl I always ate cereal for breakfast.",
        pronunciation: "deh NEE-nyah SYEHM-preh koh-MEE-ah seh-reh-AHL PAH-rah deh-sah-yoo-NAR",
        pronunciation_focus: [
          "'siempre' + imperfect = habitual past, English 'used to' or 'would'",
        ],
        note:
          "Habits get imperfect. The English cue 'used to' or 'would (every day)' always maps to imperfect — never to preterite.",
      },
      {
        spanish: "Anoche cené con María y luego vimos una película.",
        english: "Last night I had dinner with María and then we watched a movie.",
        pronunciation: "ah-NOH-cheh seh-NEH kohn mah-REE-ah ee LWEH-goh BEE-mohs OO-nah peh-LEE-koo-lah",
        pronunciation_focus: [
          "Preterite chain — 'cené', 'vimos' — narrative-driving events",
        ],
        note:
          "When events line up in sequence and move time forward, the preterite chains them. Anoche / luego / después / al final are the chaining adverbs to watch for.",
      },
    ],
    vocabulary: [
      { cell_id: "5f470f59-4200-4aa3-b100-da5d2858799f", word: "vivir", english: "to live", pronunciation: "bee-BEER", part_of_speech: "verb" },
      { cell_id: "b28e26c9-82a5-4480-a964-7f6a13d3282b", word: "llover", english: "to rain (o→ue stem change in present)", pronunciation: "yoh-BEHR", part_of_speech: "verb" },
      { cell_id: "d82ef217-0063-49dc-b1c6-2eede271a8e3", word: "salir", english: "to leave / go out (yo salgo present)", pronunciation: "sah-LEER", part_of_speech: "verb" },
      { cell_id: "267ef263-2a2b-4130-b91a-d6fdefdf0955", word: "comer", english: "to eat", pronunciation: "koh-MEHR", part_of_speech: "verb" },
      { cell_id: "affbbe4a-d35c-457e-9f75-2f344948d949", word: "el supermercado", english: "the supermarket", pronunciation: "ehl soo-pehr-mehr-KAH-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "d2d3529c-f3d0-4eb5-8f8a-1457321b07a4", word: "la película", english: "the movie / film", pronunciation: "lah peh-LEE-koo-lah", part_of_speech: "noun", gender: "f" },
      { cell_id: "ddb9dfb5-2e4a-44bd-9a00-545a2fa4f045", word: "siempre", english: "always (habitual marker — pairs with imperfect)", pronunciation: "SYEHM-preh", part_of_speech: "adverb" },
      { cell_id: "c6de24dc-59b6-4819-bc48-5f84b385cf5d", word: "luego", english: "then / later (sequence marker — pairs with preterite)", pronunciation: "LWEH-goh", part_of_speech: "adverb" },
      { cell_id: "e8c1743a-1f5b-46f0-aeb1-14c1a51993d7", word: "anoche", english: "last night (specific time — pairs with preterite)", pronunciation: "ah-NOH-cheh", part_of_speech: "adverb" },
      { cell_id: "5ce587e8-f463-4e70-9c56-921d02d23332", word: "de niño / de niña", english: "as a child (childhood frame — pairs with imperfect)", pronunciation: "deh NEE-nyoh / deh NEE-nyah", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "The decision rule — event vs background",
        explanation:
          "Preterite answers 'what happened?' (a single completed event with start and end). Imperfect answers 'what was going on?' or 'what was it like?' (an ongoing state, habit, or scene). Same fact can be told either way — the choice signals the speaker's frame, not the objective truth. 'Comí pizza' (I ate pizza, one episode) vs 'comía pizza' (I used to eat pizza, habit). Both are correct Spanish for somebody who has eaten pizza in the past; they say different things.",
        examples: [
          { spanish: "Vivía en Madrid. (background)", english: "I was living in Madrid." },
          { spanish: "Viví en Madrid dos años. (bounded event)", english: "I lived in Madrid for two years." },
        ],
      },
      {
        point: "Imperfect endings — regular forms",
        explanation:
          "Two patterns. -ar verbs: -aba, -abas, -aba, -ábamos, -abais, -aban. -er/-ir verbs share one set: -ía, -ías, -ía, -íamos, -íais, -ían. The yo and él/ella forms are IDENTICAL — context disambiguates. Only THREE verbs are irregular in the imperfect (ser, ir, ver) — a huge relief after the preterite.",
        examples: [
          { spanish: "hablaba, hablabas, hablaba, hablábamos, hablabais, hablaban", english: "was speaking / used to speak" },
          { spanish: "comía, comías, comía, comíamos, comíais, comían", english: "was eating / used to eat" },
        ],
      },
      {
        point: "Mixed sentences — background + interruption",
        explanation:
          "The most common past-tense sentence shape combines both tenses. Imperfect sets the scene, preterite drops the event into it. 'Yo dormía (imperfect, background) cuando sonó (preterite, event) el teléfono.' The phone ringing is what happened; the sleeping is what was going on when it happened. Reverse the tenses and you get nonsense — 'Yo dormí cuando sonaba el teléfono' literally says 'I slept while the phone was ringing,' which is a very different scene.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Choose preterite or imperfect. The cue words (siempre, ayer, de niño, anoche, todos los días) tell you which.",
        items: [
          { prompt: "Ayer ___ (yo / comer) sushi por primera vez.", answer: "comí" },
          { prompt: "Cuando ___ (yo / ser) niño, jugaba al fútbol cada tarde.", answer: "era" },
          { prompt: "Anoche María ___ (llamar) tres veces.", answer: "llamó" },
          { prompt: "Todos los veranos ___ (nosotros / ir) a la playa.", answer: "íbamos" },
          { prompt: "___ (llover) cuando salimos del cine.", answer: "Llovía" },
        ],
      },
    ],
    cultural_note:
      "Spanish storytelling OPENS with imperfect to set the scene ('Era una noche oscura, llovía mucho, no había nadie en la calle...') and only switches to preterite when the action kicks in ('De repente, vi una luz...'). Watch any Spanish-language film opening for this pattern — the first 30 seconds are almost always imperfect, then one preterite verb fires the plot. Native speakers feel preterite as motion and imperfect as stillness; if you can hear that, you have the distinction.",
    tip:
      "Whenever you draft a past-tense sentence, pause and ask one question: 'Am I telling what HAPPENED, or am I describing what was GOING ON?' Happened → preterite. Going on → imperfect. Two seconds of decision time at first; after a month, automatic. Don't try to memorize the rules — train the decision.",
  },

  // ── 2. preterite_vs_imperfect — spanish_preterite_imperfect_narrative ──
  {
    id: "spanish_preterite_imperfect_narrative",
    level: "B1",
    category: "preterite_vs_imperfect",
    title: "Telling a story — the imperfect-opens, preterite-drives pattern",
    subtitle: "How Spanish narratives actually move.",
    intro:
      "Once you know which tense is which, the next skill is using them TOGETHER to tell a coherent story. Spanish narrative has a predictable shape: imperfect verbs lay down the scene (weather, time, mood, ongoing actions), then preterite verbs fire the events that move the plot. Learn the shape and your storytelling jumps from textbook-stiff to actually fluid.",
    sentences: [
      {
        spanish: "Era sábado por la tarde y hacía mucho calor.",
        english: "It was Saturday afternoon and it was very hot.",
        pronunciation: "EH-rah SAH-bah-doh por lah TAR-deh ee ah-SEE-ah MOO-choh kah-LOHR",
        pronunciation_focus: [
          "'era' and 'hacía' — two imperfects setting the opening scene",
        ],
        note:
          "Classic story opener. Time + weather, both in imperfect. Spanish-language films open this way constantly.",
      },
      {
        spanish: "Yo paseaba por el parque cuando vi a Lucía.",
        english: "I was walking through the park when I saw Lucía.",
        pronunciation: "yoh pah-seh-AH-bah por ehl PAR-keh KWAHN-doh bee ah loo-SEE-ah",
        pronunciation_focus: [
          "Background 'paseaba' (imperfect) — interrupting event 'vi' (preterite)",
        ],
        note:
          "The 'personal a' returns — 'vi A Lucía', not 'vi Lucía', because the direct object is a person. B1 learners forget this constantly under cognitive load.",
      },
      {
        spanish: "Estábamos cenando cuando se fue la luz.",
        english: "We were eating dinner when the power went out.",
        pronunciation: "ehs-TAH-bah-mohs seh-NAHN-doh KWAHN-doh seh fweh lah looth",
        pronunciation_focus: [
          "'estábamos cenando' = past progressive (imperfect of estar + gerund) — even more clearly 'in progress' than the plain imperfect",
        ],
        note:
          "Past progressive (estar in imperfect + -ndo) is an alternative to the plain imperfect when you want to emphasize 'in the middle of doing'. Both 'cenábamos' and 'estábamos cenando' are correct; the second is more vivid.",
      },
      {
        spanish: "Entré, saludé a todos y me senté al lado de Marta.",
        english: "I came in, said hi to everyone, and sat down next to Marta.",
        pronunciation: "ehn-TREH, sah-loo-DEH ah TOH-dohs ee meh sehn-TEH ahl LAH-doh deh MAR-tah",
        pronunciation_focus: [
          "Preterite chain — three events in sequence drive the action forward",
        ],
        note:
          "Pure preterite chain. Each verb closes one event and opens the next. This is the texture of a Spanish anecdote — listen for it.",
      },
      {
        spanish: "Cuando llegamos al restaurante, ya no había nadie.",
        english: "When we arrived at the restaurant, there was no one there anymore.",
        pronunciation: "KWAHN-doh yeh-GAH-mohs ahl rehs-tow-RAHN-teh, yah noh ah-BEE-ah NAH-dyeh",
        pronunciation_focus: [
          "'había' = imperfect of haber, the 'there was/were' verb. Singular form even when followed by plural.",
        ],
        note:
          "Había is invariable — 'había nadie', 'había muchas personas', 'había un problema'. Never 'habían personas' in standard Spanish (you'll hear it in some dialects but it's not taught as standard).",
      },
    ],
    vocabulary: [
      { cell_id: "91c11e61-b428-49ab-af12-35c00dec28d9", word: "pasear", english: "to walk / stroll", pronunciation: "pah-seh-AR", part_of_speech: "verb" },
      { cell_id: "fe09ee3f-c678-4869-92a1-6d6e284508a7", word: "cenar", english: "to eat dinner / have supper", pronunciation: "seh-NAR", part_of_speech: "verb" },
      { cell_id: "1ec8fc26-eb85-4084-8748-2bac4dac7df1", word: "saludar", english: "to greet / say hi", pronunciation: "sah-loo-DAR", part_of_speech: "verb" },
      { cell_id: "7684beb0-c3f0-49e2-a79b-09be767fc2e4", word: "sentarse", english: "to sit down (reflexive, e→ie)", pronunciation: "sehn-TAR-seh", part_of_speech: "verb" },
      { cell_id: "9adcc3a6-4f47-42a7-9304-25dbc4337e69", word: "llegar", english: "to arrive (-gar spelling change in yo preterite)", pronunciation: "yeh-GAR", part_of_speech: "verb" },
      { cell_id: "f4c3ae6e-5d34-4e97-8e92-e77741c14e22", word: "el parque", english: "the park", pronunciation: "ehl PAR-keh", part_of_speech: "noun", gender: "m" },
      { cell_id: "af8774f9-0921-4ff2-938f-62b55cb8a67c", word: "el restaurante", english: "the restaurant", pronunciation: "ehl rehs-tow-RAHN-teh", part_of_speech: "noun", gender: "m" },
      { cell_id: "033247ce-6696-4692-8b90-e6066597d30f", word: "la luz", english: "the light / the power (electricity)", pronunciation: "lah looth", part_of_speech: "noun", gender: "f" },
      { cell_id: "d8005744-45c4-4475-b4e3-54d2af94671c", word: "de repente", english: "suddenly (storytelling adverb — flips to preterite)", pronunciation: "deh reh-PEHN-teh", part_of_speech: "phrase" },
      { cell_id: "910685ac-9f2f-469e-9472-6a049b43c426", word: "ya no", english: "no longer / not anymore", pronunciation: "yah noh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "The narrative shape — scene, interruption, sequence",
        explanation:
          "A typical Spanish anecdote has three movements. First: imperfect verbs lay the scene (time, place, weather, who was doing what). Second: a preterite verb interrupts (de repente, en ese momento, cuando). Third: a chain of preterite verbs drives events to the climax. The imperfect can return at any point to add more background. Master this shape and you can tell almost any short story in Spanish.",
        examples: [
          { spanish: "Era tarde, llovía, y yo caminaba solo. De repente, oí un ruido y me paré.", english: "It was late, it was raining, and I was walking alone. Suddenly, I heard a noise and stopped." },
        ],
      },
      {
        point: "Past progressive (estaba + gerund)",
        explanation:
          "Spanish has a past progressive — imperfect of estar + the gerund (-ando / -iendo). 'Estaba leyendo' (I was reading) is interchangeable with plain imperfect 'leía' but feels more vivid and 'in the middle of'. Use past progressive when you want to emphasize that an action was actively in progress at a specific moment, especially when something interrupted it. Both forms answer 'what were you doing?' equally well — choose by feel.",
      },
    ],
    dialogue: [
      { cell_id: "7a2a3abc-e954-4d60-a449-a3b8c1c2c370", speaker: "Ana", spanish: "¿Qué tal el fin de semana?", english: "How was the weekend?", pronunciation: "keh tahl ehl feen deh seh-MAH-nah", register: "informal" },
      { cell_id: "233f5d0f-68b5-41db-a68c-cb14bd1c5d72", speaker: "Carlos", spanish: "Pues, el sábado hacía buen tiempo, así que fuimos a la playa.", english: "Well, on Saturday the weather was good, so we went to the beach.", pronunciation: "pwehs, ehl SAH-bah-doh ah-SEE-ah bwehn TYEHM-poh, ah-SEE keh FWEE-mohs ah lah PLAH-yah", register: "informal" },
      { cell_id: "ef10de3c-818e-438f-8c9f-e21761192a8c", speaker: "Ana", spanish: "¿Y qué hicisteis allí?", english: "And what did you all do there?", pronunciation: "ee keh ee-SEES-tehs ah-YEE", register: "informal" },
      { cell_id: "2db8d992-5994-47cf-9605-b895ea23e08b", speaker: "Carlos", spanish: "Pues nada — nadamos un poco, comimos, dormimos la siesta. Estábamos muy relajados.", english: "Not much — we swam a bit, ate, took a nap. We were very relaxed.", pronunciation: "pwehs NAH-dah — nah-DAH-mohs oon POH-koh, koh-MEE-mohs, dohr-MEE-mohs lah SYEHS-tah. ehs-TAH-bah-mohs MOO-ee reh-lah-HAH-dohs", register: "informal" },
      { cell_id: "3a15c102-7c65-49e9-8236-8d5f1f910da6", speaker: "Ana", spanish: "Suena perfecto.", english: "Sounds perfect.", pronunciation: "SWEH-nah pehr-FEHK-toh", register: "informal" },
    ],
    cultural_note:
      "The 'hacía buen tiempo, así que…' pattern is the workhorse of Spanish weekend recaps. Background (imperfect weather) → preterite consequence. Listen for this shape in any casual Monday conversation in Spain or LatAm — it's how people justify what they did on a Saturday. If you can produce a 90-second weekend recap with this shape, you have cleared the highest-frequency B1 narrative task.",
    tip:
      "Build one anecdote — any real story from your life — and rehearse it until you can tell it in 60 seconds with the imperfect-opens, preterite-drives shape. The exact words matter less than the rhythm. Native speakers feel that rhythm; once you can produce it, your past-tense sounds Spanish instead of translated.",
  },

  // ── 3. preterite_vs_imperfect — spanish_preterite_imperfect_meaning_change ──
  {
    id: "spanish_preterite_imperfect_meaning_change",
    level: "B1",
    category: "preterite_vs_imperfect",
    title: "Verbs that change meaning — saber, conocer, querer, poder, tener",
    subtitle: "Five verbs where the tense changes the dictionary meaning.",
    intro:
      "Five high-frequency verbs do something special: their preterite form has a DIFFERENT meaning from their imperfect form. Imperfect describes a continuing state (knew, wanted, could). Preterite describes the moment that state began or ended — and English uses a different verb to translate it. Saber, conocer, querer, poder, tener. Memorize the pairs and a whole layer of Spanish narrative suddenly makes sense.",
    sentences: [
      {
        spanish: "Sabía la respuesta, pero la olvidé. — Supe la respuesta cuando vi la pista.",
        english: "I knew the answer, but I forgot it. — I found out the answer when I saw the clue.",
        pronunciation: "sah-BEE-ah lah rrehs-PWEHS-tah, PEH-roh lah ohl-bee-DEH. SOO-peh lah rrehs-PWEHS-tah KWAHN-doh bee lah PEES-tah",
        pronunciation_focus: [
          "Saber preterite is irregular — supe, supiste, supo, supimos, supisteis, supieron (no accents)",
        ],
        note:
          "Sabía = had the knowledge (ongoing state). Supe = the moment the knowledge arrived — 'found out', 'learned'. Same verb, different English word.",
      },
      {
        spanish: "Conocía Madrid muy bien. — Conocí a María en la fiesta.",
        english: "I knew Madrid very well. — I met María at the party.",
        pronunciation: "koh-noh-SEE-ah mah-DREED MOO-ee byehn. koh-noh-SEE ah mah-REE-ah ehn lah FYEHS-tah",
        pronunciation_focus: [
          "Conocer preterite is regular — conocí, conociste, conoció, etc.",
          "'Conocí a María' — personal 'a' before a person",
        ],
        note:
          "Conocía = was familiar with (ongoing). Conocí = met for the first time. English uses 'met'; Spanish uses the preterite of 'to know'.",
      },
      {
        spanish: "Quería ir a la fiesta. — Quise ir, pero llegué tarde.",
        english: "I wanted to go to the party. — I tried to go, but I arrived late.",
        pronunciation: "keh-REE-ah eer ah lah FYEHS-tah. KEE-seh eer, PEH-roh yeh-GEH TAR-deh",
        pronunciation_focus: [
          "Querer preterite is irregular — quise, quisiste, quiso, quisimos, quisisteis, quisieron",
        ],
        note:
          "Quería = wanted (ongoing, neutral). Quise = tried (made the attempt). And No quise = refused (actively chose not to). Quería is safe; quise is loaded — use it for actual attempts.",
      },
      {
        spanish: "Podía nadar mucho cuando era joven. — Pude terminar el examen antes del tiempo.",
        english: "I could swim a lot when I was young. — I managed to finish the exam before time.",
        pronunciation: "poh-DEE-ah nah-DAR MOO-choh KWAHN-doh EH-rah HOH-behn. POO-deh tehr-mee-NAR ehl ehk-SAH-mehn AHN-tehs dehl TYEHM-poh",
        pronunciation_focus: [
          "Poder preterite — pude, pudiste, pudo, pudimos, pudisteis, pudieron",
        ],
        note:
          "Podía = had the ability (general capacity). Pude = managed to (succeeded in a specific instance). And No pude = failed to / wasn't able to (on that specific occasion).",
      },
      {
        spanish: "Tenía un coche viejo. — Tuve un accidente el lunes pasado.",
        english: "I had an old car. — I had an accident last Monday.",
        pronunciation: "teh-NEE-ah oon KOH-cheh BYEH-hoh. TOO-beh oon ahk-see-DEHN-teh ehl LOO-nehs pah-SAH-doh",
        pronunciation_focus: [
          "Tener preterite — tuve, tuviste, tuvo, tuvimos, tuvisteis, tuvieron",
        ],
        note:
          "Tenía = was possessing (ongoing). Tuve = got / received / experienced (a single moment). 'Tuve un hijo' = 'I had a child' meaning a child was born to me; 'tenía un hijo' = 'I had a child' meaning I was raising one. Big difference.",
      },
    ],
    vocabulary: [
      { cell_id: "6db4de92-6aa2-4844-9ff5-f26a8d59fa58", word: "saber", english: "to know (a fact) — preterite: to find out", pronunciation: "sah-BEHR", part_of_speech: "verb" },
      { cell_id: "032ba4d9-c53a-45ad-8147-4b574d3ed1f0", word: "conocer", english: "to know (person/place) — preterite: to meet", pronunciation: "koh-noh-SEHR", part_of_speech: "verb" },
      { cell_id: "9e0b279e-0b05-47a0-af3f-96aa4eff2031", word: "querer", english: "to want (e→ie) — preterite querer: to try / no querer: to refuse", pronunciation: "keh-REHR", part_of_speech: "verb" },
      { cell_id: "d126d0f6-1484-4e8a-b7a9-e19377b59866", word: "poder", english: "to be able (o→ue) — preterite: to manage / no poder: to fail", pronunciation: "poh-DEHR", part_of_speech: "verb" },
      { cell_id: "e3f97b24-aff5-44f2-99e9-afa1dd42003a", word: "tener", english: "to have (e→ie) — preterite: to get / receive", pronunciation: "teh-NEHR", part_of_speech: "verb" },
      { cell_id: "7bf1e34e-4a11-4fcb-baf8-03f849f1bed1", word: "la respuesta", english: "the answer", pronunciation: "lah rrehs-PWEHS-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "92fcc2b2-ad39-4e6b-a20e-1c4b798e77d4", word: "la pista", english: "the clue / hint", pronunciation: "lah PEES-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "d9121711-bb19-41f3-aa46-b81a5afa8dd8", word: "olvidar", english: "to forget", pronunciation: "ohl-bee-DAR", part_of_speech: "verb" },
      { cell_id: "51173de8-0259-471e-a666-78662e6eaca3", word: "el accidente", english: "the accident", pronunciation: "ehl ahk-see-DEHN-teh", part_of_speech: "noun", gender: "m" },
      { cell_id: "f7a068e0-28b3-46d3-944f-9e81611a3306", word: "joven", english: "young", pronunciation: "HOH-behn", part_of_speech: "adjective" },
    ],
    grammar: [
      {
        point: "The five meaning-change verbs",
        explanation:
          "Saber, conocer, querer, poder, tener. Each has a 'state' meaning (imperfect) and an 'inceptive' meaning (preterite — the moment the state began). The English translation flips. Sabía/supe = knew/found out. Conocía/conocí = was familiar with/met. Quería/quise = wanted/tried. Podía/pude = had the ability to/managed to. Tenía/tuve = had/got. The pattern is consistent: imperfect = state, preterite = the event-moment when the state began.",
        examples: [
          { spanish: "Cuando supe la noticia, lloré.", english: "When I found out the news, I cried." },
          { spanish: "No pude abrir la puerta.", english: "I couldn't get the door open. (specific failed attempt)" },
        ],
      },
      {
        point: "The 'no' twist — querer and poder",
        explanation:
          "Negation amplifies the inceptive meaning for two of these verbs. 'No quise ir' is not 'I didn't want to go' (which would be neutral, imperfect 'no quería ir'). It is 'I refused to go' — an active, willed rejection. 'No pude terminar' is not 'I wasn't able to in general' (no podía); it is 'I failed to finish on that specific occasion'. English speakers default-translate these with the imperfect meaning and constantly underwhelm what they're actually saying in preterite.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Pick preterite or imperfect based on whether you mean the STATE (imperfect) or the EVENT-MOMENT (preterite).",
        items: [
          { prompt: "Yo ___ (conocer) a tu hermana ayer en la fiesta.", answer: "conocí" },
          { prompt: "Cuando era niño, no ___ (saber) nadar.", answer: "sabía" },
          { prompt: "___ (yo / querer) ir, pero perdí el autobús.", answer: "Quise" },
          { prompt: "No ___ (nosotros / poder) terminar el proyecto a tiempo.", answer: "pudimos" },
          { prompt: "El año pasado mi hermana ___ (tener) un bebé.", answer: "tuvo" },
        ],
      },
    ],
    cultural_note:
      "Spanish speakers don't experience these as 'meaning changes' — to them, conocer just means 'to know/be familiar with', and the preterite naturally means the moment that familiarity began (i.e. meeting). The 'change' is entirely an artifact of English using different verbs for state vs onset. Stop translating word-for-word and start asking 'what's the state? what's the moment it began?' — that's how the verbs actually work in the language.",
    tip:
      "Drill the five verbs as PAIRS: sabía/supe, conocía/conocí, quería/quise, podía/pude, tenía/tuve. Say each pair out loud with one sentence per side: 'sabía la respuesta / supe la verdad'. Five pairs, ten sentences, done in five minutes. After that, you'll catch the distinction automatically when reading or listening.",
  },

  // ── 4. preterite_vs_imperfect — spanish_preterite_imperfect_time_markers ──
  {
    id: "spanish_preterite_imperfect_time_markers",
    level: "B1",
    category: "preterite_vs_imperfect",
    title: "Time markers and fixed expressions — the trigger words",
    subtitle: "Certain words always pair with one tense or the other. Learn the pairs.",
    intro:
      "After meaning, the second angle on the preterite/imperfect distinction is TRIGGER WORDS. Some time expressions almost always pair with preterite (ayer, anoche, una vez). Others almost always pair with imperfect (siempre, todos los días, a menudo). Learn the pairs and a lot of B1 past-tense decisions become reflex instead of analysis. This is the second angle on the same distinction the contrast lesson taught — same rule, different cue.",
    sentences: [
      {
        spanish: "Ayer fui al médico.",
        english: "Yesterday I went to the doctor.",
        pronunciation: "ah-YEHR fwee ahl MEH-dee-koh",
        pronunciation_focus: ["'ayer' is the strongest preterite trigger word in Spanish"],
        note:
          "Specific bounded time (ayer, anoche, el lunes pasado, en 2019) → preterite, every time. The boundary is built into the time expression itself.",
      },
      {
        spanish: "Todos los veranos íbamos a Galicia.",
        english: "Every summer we used to go to Galicia.",
        pronunciation: "TOH-dohs lohs beh-RAH-nohs EE-bah-mohs ah gah-LEE-syah",
        pronunciation_focus: [
          "'íbamos' — imperfect of ir, irregular. Ir / ver / ser are the only three imperfect irregulars.",
        ],
        note:
          "Habitual frequency markers (todos los…, cada…, a menudo, siempre, generalmente, normalmente) → imperfect, every time. English 'used to' or 'would' is the giveaway.",
      },
      {
        spanish: "Una vez vi a una serpiente en el jardín.",
        english: "Once I saw a snake in the garden.",
        pronunciation: "OO-nah behs bee ah OO-nah sehr-PYEHN-teh ehn ehl har-DEEN",
        pronunciation_focus: [
          "'una vez' = one specific occurrence — preterite",
        ],
        note:
          "Una vez, dos veces, tres veces, varias veces — counting occurrences is always preterite because each one is bounded.",
      },
      {
        spanish: "Mientras hablábamos, sonó el teléfono.",
        english: "While we were talking, the phone rang.",
        pronunciation: "MYEHN-trahs ah-BLAH-bah-mohs, soh-NOH ehl teh-LEH-foh-noh",
        pronunciation_focus: [
          "'mientras' = while → always pairs with imperfect on its side",
          "'sonó' = ring (preterite) — bounded event interrupts the ongoing 'hablábamos'",
        ],
        note:
          "Mientras (while) introduces an ongoing background action — always imperfect after it. The other clause is usually preterite (the event that happened during the background).",
      },
      {
        spanish: "De pequeño, soñaba con ser astronauta.",
        english: "As a kid, I used to dream of being an astronaut.",
        pronunciation: "deh peh-KEH-nyoh, soh-NYAH-bah kohn sehr ahs-troh-NOW-tah",
        pronunciation_focus: [
          "'de pequeño/a' = as a kid → frame for childhood habits → imperfect",
        ],
        note:
          "Childhood/youth frames (de pequeño, de niño, de joven, en aquella época) signal a long stretch of habitual or background time — imperfect every time.",
      },
    ],
    vocabulary: [
      { cell_id: "b61fe46e-f5b7-453b-8752-da4780ecbcdf", word: "ayer", english: "yesterday (preterite trigger)", pronunciation: "ah-YEHR", part_of_speech: "adverb" },
      { cell_id: "843583a1-bc98-48fe-b0fa-214003bfa52c", word: "anoche", english: "last night (preterite trigger)", pronunciation: "ah-NOH-cheh", part_of_speech: "adverb" },
      { cell_id: "1e24dd50-566d-4d18-84fc-978489df479b", word: "siempre", english: "always (imperfect trigger)", pronunciation: "SYEHM-preh", part_of_speech: "adverb" },
      { cell_id: "0cdaea18-2fd8-4f28-af03-4056b5de51c6", word: "todos los días", english: "every day (imperfect trigger)", pronunciation: "TOH-dohs lohs DEE-ahs", part_of_speech: "phrase" },
      { cell_id: "24c7a394-2575-4a27-b2ad-5068955907b3", word: "una vez", english: "once / one time (preterite trigger — bounded)", pronunciation: "OO-nah behs", part_of_speech: "phrase" },
      { cell_id: "258d15a1-9f9f-4c42-be39-60176dc4d9e8", word: "mientras", english: "while (imperfect trigger on its side)", pronunciation: "MYEHN-trahs", part_of_speech: "conjunction" },
      { cell_id: "ad952a1c-f5c3-4e60-ae22-86f582730368", word: "de repente", english: "suddenly (preterite trigger)", pronunciation: "deh reh-PEHN-teh", part_of_speech: "phrase" },
      { cell_id: "1e8b3a37-7efe-4616-bc0d-6d0bab4e4009", word: "a menudo", english: "often (imperfect trigger)", pronunciation: "ah meh-NOO-doh", part_of_speech: "phrase" },
      { cell_id: "04b5e5ba-ba54-4a0f-82b8-ee3e275898a7", word: "el lunes pasado", english: "last Monday (specific time — preterite)", pronunciation: "ehl LOO-nehs pah-SAH-doh", part_of_speech: "phrase" },
      { cell_id: "65728e67-93a0-487a-a5af-a2bec9e1968b", word: "de pequeño / de niño", english: "as a kid (imperfect trigger)", pronunciation: "deh peh-KEH-nyoh / deh NEE-nyoh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Preterite triggers — bounded time and onset events",
        explanation:
          "Words that name a SPECIFIC bounded moment trigger preterite. Ayer, anoche, esta mañana, el lunes, en 2020, el año pasado. Counting words (una vez, dos veces, tres veces) also bound the action. And 'de repente' / 'de pronto' / 'en ese momento' flip you into preterite because they mark an event-onset. The common thread: the time expression itself has edges — start and end.",
        examples: [
          { spanish: "El sábado salimos con los amigos.", english: "On Saturday we went out with friends." },
          { spanish: "De repente oímos un grito.", english: "Suddenly we heard a scream." },
        ],
      },
      {
        point: "Imperfect triggers — habit and continuation",
        explanation:
          "Words that name a habit or a continuing stretch trigger imperfect. Siempre, nunca, a menudo, todos los días, cada semana, normalmente, generalmente. 'Mientras' (while) flips the verb that follows it into imperfect (because mientras frames an ongoing action). 'De pequeño', 'cuando era joven', 'en aquella época' are all childhood/era frames — imperfect on every verb describing the era.",
      },
      {
        point: "When a preterite trigger meets an imperfect trigger",
        explanation:
          "If both kinds of cue appear in one sentence, you usually get one of each tense — the imperfect describes the framing, the preterite describes the event. 'Cuando era joven (imperfect — era frame), una vez vi (preterite — bounded event) un fantasma.' Don't force one tense; let the cues tell you which verb wants which.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Watch the trigger word. The cue tells you which tense.",
        items: [
          { prompt: "Anoche ___ (yo / cenar) en un restaurante italiano.", answer: "cené" },
          { prompt: "De pequeña, mi hermana ___ (jugar) con muñecas todos los días.", answer: "jugaba" },
          { prompt: "Mientras ___ (yo / estudiar), mi madre preparaba la cena.", answer: "estudiaba" },
          { prompt: "Una vez ___ (nosotros / ver) un oso en el bosque.", answer: "vimos" },
          { prompt: "Cuando ___ (ser) joven, siempre iba al cine los viernes.", answer: "era" },
        ],
      },
    ],
    cultural_note:
      "Spanish speakers often add 'pues' or 'es que' before a past-tense story to ease into it ('Pues ayer fui al médico…'). This is conversational scaffolding, not grammar — but learning to hear it will help you predict that what follows is going to be a past-tense narrative, and you can prime your ear for the trigger words coming next.",
    tip:
      "Build two flashcards: PRETERITE TRIGGERS and IMPERFECT TRIGGERS. Each card has 8–10 phrases on it. Re-read both cards daily for one week. After that, you will catch trigger words automatically when reading, and your output speed for past-tense narration will roughly double.",
  },

  // ── 5. subjunctive_intro — spanish_subjunctive_forms ──────────────────────
  {
    id: "spanish_subjunctive_forms",
    level: "B1",
    category: "subjunctive_intro",
    title: "Subjunctive — the forms before the rules",
    subtitle: "Drill the conjugations. Worry about when to use them next lesson.",
    intro:
      "The subjunctive is a MOOD, not a tense. Spanish uses it after certain trigger words to mark wishes, doubts, emotional reactions, and hypothetical situations. Before you can use it, you have to be able to produce it — so this lesson is conjugation drills. Regular forms first. Then the 'dirty six' irregulars (ser, estar, ir, saber, dar, haber) that account for half of all subjunctive usage. Memorize the dirty six as a block and 90% of recognition unlocks.",
    sentences: [
      {
        spanish: "El profesor quiere que hablemos en español.",
        english: "The teacher wants us to speak in Spanish.",
        pronunciation: "ehl proh-feh-SOR KYEH-reh keh ah-BLEH-mohs ehn ehs-pah-NYOL",
        pronunciation_focus: [
          "Regular -ar subjunctive: stem + -e endings (hable, hables, hable, hablemos, habléis, hablen)",
          "Note the 'flip' — -ar verbs take -e endings, -er/-ir verbs take -a endings",
        ],
        note:
          "Don't worry about WHY 'quiere que' triggers subjunctive — that's lesson 6. For now, see the form: 'hablemos' is the present subjunctive of hablar.",
      },
      {
        spanish: "Espero que comas bien.",
        english: "I hope you eat well.",
        pronunciation: "ehs-PEH-roh keh KOH-mahs byehn",
        pronunciation_focus: [
          "Regular -er subjunctive — comer → coma, comas, coma, comamos, comáis, coman",
        ],
        note:
          "The -ar / -er flip is the single most useful rule. -AR verbs take -E endings in subjunctive. -ER and -IR verbs take -A endings. Memorize the flip and regular forms generate themselves.",
      },
      {
        spanish: "Es posible que sea verdad.",
        english: "It's possible it's true.",
        pronunciation: "ehs poh-SEE-bleh keh SEH-ah behr-DAHD",
        pronunciation_focus: [
          "'sea' = subjunctive of ser. One of the dirty six.",
        ],
        note:
          "Dirty six #1: ser → sea, seas, sea, seamos, seáis, sean. Memorize this row first — ser-subjunctive is the most-encountered subjunctive form in the language.",
      },
      {
        spanish: "Ojalá tengamos tiempo mañana.",
        english: "I hope we have time tomorrow.",
        pronunciation: "oh-hah-LAH tehn-GAH-mohs TYEHM-poh mah-NYAH-nah",
        pronunciation_focus: [
          "'tengamos' — tener subjunctive built from yo-form 'tengo' (drop the o, add a-endings)",
          "Many irregulars follow this 'yo-form rule': start from the present yo, drop -o, add the opposite-vowel endings",
        ],
        note:
          "Tener (yo tengo) → subjunctive stem 'teng-' → tenga, tengas, tenga, tengamos, tengáis, tengan. This same 'yo-form rule' generates the subjunctive for hacer (hago→haga), poner (pongo→ponga), salir (salgo→salga), and dozens more.",
      },
      {
        spanish: "Dudo que sepa la respuesta.",
        english: "I doubt that she knows the answer.",
        pronunciation: "DOO-doh keh SEH-pah lah rrehs-PWEHS-tah",
        pronunciation_focus: [
          "'sepa' = saber subjunctive. Dirty six #2.",
        ],
        note:
          "Saber → sepa, sepas, sepa, sepamos, sepáis, sepan. Note the FORM doesn't even look like 'saber' anymore. This is why the dirty six need rote memorization — they don't follow predictable patterns.",
      },
    ],
    vocabulary: [
      { cell_id: "fa9b3cb9-5fb2-4090-a748-cbc7b548ea9b", word: "hablar", english: "to speak — subj: hable, hables, hable, hablemos, habléis, hablen", pronunciation: "ah-BLAR", part_of_speech: "verb" },
      { cell_id: "aa6c29e6-ef86-41e5-88bc-6a87eb614e9f", word: "comer", english: "to eat — subj: coma, comas, coma, comamos, comáis, coman", pronunciation: "koh-MEHR", part_of_speech: "verb" },
      { cell_id: "d169b83d-b9ed-486f-9963-629b0699d6ed", word: "vivir", english: "to live — subj: viva, vivas, viva, vivamos, viváis, vivan", pronunciation: "bee-BEER", part_of_speech: "verb" },
      { cell_id: "a29d59fb-8706-4f45-bf21-9b5362513f2d", word: "ser", english: "to be (essence) — DIRTY SIX subj: sea, seas, sea, seamos, seáis, sean", pronunciation: "sehr", part_of_speech: "verb" },
      { cell_id: "cfa20f8c-d168-4cc2-8dd6-bf4525b9532c", word: "estar", english: "to be (state) — DIRTY SIX subj: esté, estés, esté, estemos, estéis, estén", pronunciation: "ehs-TAR", part_of_speech: "verb" },
      { cell_id: "3246ef92-75c7-475b-8319-d3a7ff2ef2a3", word: "ir", english: "to go — DIRTY SIX subj: vaya, vayas, vaya, vayamos, vayáis, vayan", pronunciation: "eer", part_of_speech: "verb" },
      { cell_id: "b394a804-7dba-4d6e-9c69-7e89d897838b", word: "saber", english: "to know — DIRTY SIX subj: sepa, sepas, sepa, sepamos, sepáis, sepan", pronunciation: "sah-BEHR", part_of_speech: "verb" },
      { cell_id: "6a35cde7-b833-4ff6-852b-5e3fd040d354", word: "dar", english: "to give — DIRTY SIX subj: dé, des, dé, demos, deis, den", pronunciation: "dahr", part_of_speech: "verb" },
      { cell_id: "fbf81e4e-acf5-463f-a985-a5417204aa2f", word: "haber", english: "auxiliary 'have' — DIRTY SIX subj: haya, hayas, haya, hayamos, hayáis, hayan", pronunciation: "ah-BEHR", part_of_speech: "verb" },
      { cell_id: "2765fa55-97c1-480f-a872-37139a9a8702", word: "tener", english: "to have (yo-form rule) — subj: tenga, tengas, tenga, tengamos, tengáis, tengan", pronunciation: "teh-NEHR", part_of_speech: "verb" },
      { cell_id: "db5ab914-d846-47b7-b28d-4eaeaa326632", word: "ojalá", english: "I hope / hopefully (always triggers subjunctive)", pronunciation: "oh-hah-LAH", part_of_speech: "interjection" },
    ],
    grammar: [
      {
        point: "The vowel flip — present indicative vs present subjunctive",
        explanation:
          "Spanish has two parallel sets of present-tense endings. Indicative -ar endings end in -a (habla); subjunctive -ar endings end in -e (hable). Indicative -er/-ir endings end in -e (come); subjunctive -er/-ir endings end in -a (coma). The vowel literally flips. Internalize the flip and you can generate any regular subjunctive form from its indicative pair without thinking.",
        examples: [
          { spanish: "hablar: hablo / hable, hablas / hables, habla / hable…", english: "indicative / subjunctive" },
          { spanish: "comer: como / coma, comes / comas, come / coma…", english: "indicative / subjunctive" },
        ],
      },
      {
        point: "The yo-form rule — most irregular subjunctives",
        explanation:
          "For most stem-changing and irregular verbs, take the yo form of the present indicative, drop the -o, and add the opposite-vowel endings. Tener: yo tengo → tenga, tengas, tenga… Hacer: yo hago → haga, hagas, haga… Conocer: yo conozco → conozca, conozcas, conozca… This rule alone unlocks dozens of 'irregular' subjunctives.",
        examples: [
          { spanish: "salgo → salga, salgas, salga, salgamos, salgáis, salgan", english: "salir subjunctive" },
          { spanish: "pongo → ponga, pongas, ponga, pongamos, pongáis, pongan", english: "poner subjunctive" },
        ],
      },
      {
        point: "The dirty six — verbs that defy the yo-form rule",
        explanation:
          "Six verbs are TRULY irregular in the subjunctive — their forms can't be predicted from the yo-form. Ser → sea. Estar → esté. Ir → vaya. Saber → sepa. Dar → dé. Haber → haya. Memorize these as a block, in that order. They account for over half of all subjunctive forms you'll hear, because they're auxiliaries and copulas — the language's structural verbs. Get the dirty six and subjunctive RECOGNITION (just reading and understanding) unlocks immediately.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Give the present subjunctive form. Watch for the dirty six.",
        items: [
          { prompt: "que yo ___ (hablar)", answer: "hable" },
          { prompt: "que tú ___ (comer)", answer: "comas" },
          { prompt: "que ella ___ (ser)", answer: "sea" },
          { prompt: "que nosotros ___ (ir)", answer: "vayamos" },
          { prompt: "que ellos ___ (saber)", answer: "sepan" },
        ],
      },
    ],
    cultural_note:
      "Spanish speakers don't think of the subjunctive as 'harder' — to them, it's just the mood you use after certain words. The barrier is entirely on the English-speaker side because English's subjunctive has eroded to almost nothing ('if I WERE you' is one of the only living relics; most native speakers say 'if I WAS you' anyway). Spanish kept the system intact and uses it constantly. The good news: once you accept it as just 'the mood after que', it stops feeling exotic.",
    tip:
      "Today's task is mechanical, not conceptual. Write out the six dirty-six conjugations (sea/esté/vaya/sepa/dé/haya, with all six persons) on a single sheet of paper and tape it where you'll see it. Read it twice a day for a week. By day seven, when you hear 'que sea' or 'que vaya' in the wild, your brain will know which verb that is — which is half the recognition battle.",
  },

  // ── 6. subjunctive_intro — spanish_subjunctive_volition ───────────────────
  {
    id: "spanish_subjunctive_volition",
    level: "B1",
    category: "subjunctive_intro",
    title: "Subjunctive — wishes and influence (the two-subject rule)",
    subtitle: "Quiero que vengas. The verb in the 'que' clause goes subjunctive.",
    intro:
      "The first family of subjunctive triggers is volition — verbs of wanting, asking, telling, and influencing. The pattern: [Subject 1] [verb of volition] que [Subject 2] [subjunctive]. The crucial rule is that the two subjects must be DIFFERENT — if it's the same subject on both sides, you use an infinitive, not subjunctive. 'Quiero ir' = I want to go (same subject). 'Quiero que vayas' = I want YOU to go (different subjects). This is the two-subject rule, and it carries forward implicitly through every other subjunctive lesson.",
    sentences: [
      {
        spanish: "Quiero ir al cine.",
        english: "I want to go to the movies.",
        pronunciation: "KYEH-roh eer ahl SEE-neh",
        pronunciation_focus: [
          "Same subject (yo wants, yo goes) → infinitive, no que, no subjunctive",
        ],
        note:
          "The base case. When the wanter and the doer are the same person, you don't need subjunctive. Just verb + infinitive. English is the same — 'I want to go', not 'I want that I go'.",
      },
      {
        spanish: "Quiero que vayas al cine conmigo.",
        english: "I want you to go to the movies with me.",
        pronunciation: "KYEH-roh keh BAH-yahs ahl SEE-neh kohn-MEE-goh",
        pronunciation_focus: [
          "Different subjects (yo wants, tú goes) → 'que' + subjunctive",
          "'vayas' = ir subjunctive (dirty six)",
        ],
        note:
          "The two-subject case. When the wanter and the doer differ, Spanish requires 'que' + subjunctive. English uses 'I want YOU to go' — a different construction entirely. This is the construction that translates 'tell someone to', 'ask someone to', 'want someone to'.",
      },
      {
        spanish: "Mis padres prefieren que estudie medicina.",
        english: "My parents prefer that I study medicine.",
        pronunciation: "mees PAH-drehs preh-FYEH-rehn keh ehs-TOO-dyeh meh-dee-SEE-nah",
        pronunciation_focus: [
          "'estudie' — regular -ar subjunctive (yo and él/ella forms identical)",
        ],
        note:
          "Preferir, querer, desear, esperar (to hope) — all volition verbs that take subjunctive in the que clause.",
      },
      {
        spanish: "El médico me recomienda que coma menos sal.",
        english: "The doctor recommends that I eat less salt.",
        pronunciation: "ehl MEH-dee-koh meh rreh-koh-MYEHN-dah keh KOH-mah MEH-nohs sahl",
        pronunciation_focus: [
          "Indirect object 'me' before the volition verb — common pattern with recomendar/pedir/decir",
        ],
        note:
          "Verbs of advising, recommending, suggesting also take the volition pattern: recomendar, sugerir, aconsejar, pedir, decir (meaning 'tell to do').",
      },
      {
        spanish: "Te pido que no llegues tarde.",
        english: "I'm asking you not to be late.",
        pronunciation: "teh PEE-doh keh noh YEH-gehs TAR-deh",
        pronunciation_focus: [
          "Negation goes INSIDE the que clause: 'que no llegues', not 'no que llegues'",
        ],
        note:
          "Pedir means 'to ask (someone to do something)' and follows the volition pattern. Note the spelling change: llegar → llegues (u inserted to keep the hard g sound, same rule as preterite).",
      },
    ],
    vocabulary: [
      { cell_id: "a10b2ca5-dc5f-4a8f-b4b9-881542e0546f", word: "querer", english: "to want (e→ie) — volition trigger", pronunciation: "keh-REHR", part_of_speech: "verb" },
      { cell_id: "9050911c-f804-4299-adc6-ec248c7b72aa", word: "preferir", english: "to prefer (e→ie) — volition trigger", pronunciation: "preh-feh-REER", part_of_speech: "verb" },
      { cell_id: "94dbc8f7-9ab3-47b5-9bb7-52dede5d18f1", word: "esperar", english: "to hope / to wait — volition trigger when meaning 'hope'", pronunciation: "ehs-peh-RAR", part_of_speech: "verb" },
      { cell_id: "3eff5f52-efc7-45b0-ae5a-584fbe61fa81", word: "desear", english: "to desire / wish — volition trigger", pronunciation: "deh-seh-AR", part_of_speech: "verb" },
      { cell_id: "5079a569-9a34-4fc5-a36f-33d94d101276", word: "recomendar", english: "to recommend (e→ie) — volition trigger", pronunciation: "rreh-koh-mehn-DAR", part_of_speech: "verb" },
      { cell_id: "8faf3390-1d5b-4e8e-8f05-9466c4682b16", word: "sugerir", english: "to suggest (e→ie) — volition trigger", pronunciation: "soo-heh-REER", part_of_speech: "verb" },
      { cell_id: "589a7132-19cf-4577-8a54-c5f86a71ecf7", word: "aconsejar", english: "to advise — volition trigger", pronunciation: "ah-kohn-seh-HAR", part_of_speech: "verb" },
      { cell_id: "e834adc5-d5af-4a01-b3d0-51075d43cdc7", word: "pedir", english: "to ask (for / to do) (e→i) — volition trigger", pronunciation: "peh-DEER", part_of_speech: "verb" },
      { cell_id: "0605ef84-0bf3-4e3a-81a1-3b566b3b49b8", word: "decir que", english: "'tell to do' (volition) vs 'say that' (indicative) — context disambiguates", pronunciation: "deh-SEER keh", part_of_speech: "phrase" },
      { cell_id: "227faede-714d-43ad-b83a-25cfaac581ff", word: "ojalá (que)", english: "I hope / hopefully — ALWAYS subjunctive, no exceptions", pronunciation: "oh-hah-LAH (keh)", part_of_speech: "interjection" },
    ],
    grammar: [
      {
        point: "The two-subject rule",
        explanation:
          "Volition verbs (querer, preferir, esperar, etc.) trigger subjunctive in the 'que' clause ONLY when there are two different subjects. Same subject = infinitive: 'Quiero ir.' Different subjects = subjunctive: 'Quiero que vayas.' English-speaker default is to throw 'que' in everywhere ('quiero que ir' — wrong), or to drop it everywhere. Drill the contrast: SAME subject means NO 'que'.",
        examples: [
          { spanish: "Espero ganar. / Espero que ganes.", english: "I hope to win. / I hope you win." },
          { spanish: "Prefiero salir temprano. / Prefiero que salgas temprano.", english: "I prefer to leave early. / I prefer that you leave early." },
        ],
      },
      {
        point: "Decir que — indicative or subjunctive depending on meaning",
        explanation:
          "Decir que has TWO meanings, distinguished by mood. 'Me dice que viene' (indicative) = he tells me that he is coming (reporting a fact). 'Me dice que venga' (subjunctive) = he tells me to come (giving an order). Same verb, different intent, different mood. This is the cleanest illustration of how the subjunctive actually carries meaning — it's not decoration; it's signal.",
        examples: [
          { spanish: "Dice que estudia mucho.", english: "He says he studies a lot. (reporting)" },
          { spanish: "Dice que estudie más.", english: "He's telling me to study more. (ordering)" },
        ],
      },
      {
        point: "Ojalá — the no-exceptions subjunctive trigger",
        explanation:
          "Ojalá comes from Arabic ('wa-šā Allāh' — 'and may God will it') and is the strongest, most reliable subjunctive trigger in the language. It ALWAYS takes subjunctive, no exceptions, no same-subject rule, no nothing. 'Ojalá llueva' (I hope it rains). 'Ojalá vengas' (I hope you come). 'Ojalá tenga tiempo' (I hope I have time — even with same subject implicit). The 'que' is optional after ojalá; both 'ojalá llueva' and 'ojalá que llueva' are correct.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Use infinitive (same subject) or subjunctive (different subjects).",
        items: [
          { prompt: "Quiero ___ (ir) a la playa este verano.", answer: "ir" },
          { prompt: "Quiero que tú ___ (venir) conmigo.", answer: "vengas" },
          { prompt: "Mi madre prefiere que yo ___ (estudiar) en casa.", answer: "estudie" },
          { prompt: "Te pido que no ___ (llegar) tarde mañana.", answer: "llegues" },
          { prompt: "Ojalá ___ (hacer) buen tiempo el sábado.", answer: "haga" },
        ],
      },
    ],
    cultural_note:
      "In Spain, 'querer que' between adults is often softened — saying 'quiero que me ayudes' (I want you to help me) sounds bossy. The polite version uses conditional: '¿podrías ayudarme?' or '¿te importaría ayudarme?'. In LatAm the directness varies country to country, but in Mexico and Colombia in particular, 'me gustaría que…' is preferred over 'quiero que…' in any professional or non-family context. Learn the conditional softeners (lesson 10) and you'll dodge a lot of unintended rudeness.",
    tip:
      "Build a two-column drill: SAME SUBJECT on the left, DIFFERENT SUBJECTS on the right. Six rows. For each verb of volition (quiero, espero, prefiero…), write the same-subject form (quiero ir) and the different-subject form (quiero que vayas). Twelve sentences, ten minutes. After that drill, the two-subject rule stops being a thing you decide and becomes a thing you feel.",
  },

  // ── 7. subjunctive_intro — spanish_subjunctive_emotion ────────────────────
  {
    id: "spanish_subjunctive_emotion",
    level: "B1",
    category: "subjunctive_intro",
    title: "Subjunctive — emotional reactions",
    subtitle: "Me alegro de que vengas. Your feelings about someone else's situation.",
    intro:
      "The second family of subjunctive triggers is EMOTION — verbs and expressions that report your emotional reaction to something. The pattern is the same as volition: [I have a feeling] que [someone/something does/is X (subjunctive)]. The two-subject rule still applies — if your feeling and the thing you're feeling about share a subject, you use infinitive instead. 'Me alegro de venir' (I'm happy to come) vs 'me alegro de que vengas' (I'm happy that you're coming).",
    sentences: [
      {
        spanish: "Me alegra que estés aquí.",
        english: "I'm glad you're here.",
        pronunciation: "meh ah-LEH-grah keh ehs-TEHS ah-KEE",
        pronunciation_focus: [
          "'estés' — subjunctive of estar (dirty six), stressed on the final syllable",
          "'me alegra' uses gustar-style construction — the thing makes me happy",
        ],
        note:
          "Alegrar works like gustar — 'me alegra X' = X makes me glad. The X clause goes subjunctive because what makes me glad is somebody else's situation (your being here).",
      },
      {
        spanish: "Es una pena que no puedas venir.",
        english: "It's a shame you can't come.",
        pronunciation: "ehs OO-nah PEH-nah keh noh PWEH-dahs beh-NEER",
        pronunciation_focus: [
          "'puedas' — subjunctive of poder (yo-form rule: puedo → pueda)",
          "Note the e→ue stem change is preserved in subjunctive for all forms EXCEPT nosotros/vosotros",
        ],
        note:
          "'Es una pena que' and 'es una lástima que' are the two main 'that's a shame' phrasings, both trigger subjunctive. Pena is the slightly stronger, more emotional word.",
      },
      {
        spanish: "Tengo miedo de que se enfade.",
        english: "I'm afraid he'll get mad.",
        pronunciation: "TEHN-goh MYEH-doh deh keh seh ehn-FAH-deh",
        pronunciation_focus: [
          "Note 'de que' — emotion phrases often need a preposition before que",
        ],
        note:
          "Tengo miedo de que, me preocupa que, me sorprende que — all emotion triggers. 'Enfadarse' (Spain) / 'enojarse' (LatAm) = to get mad/angry. Reflexive in both cases.",
      },
      {
        spanish: "¡Qué bien que hayas aprobado el examen!",
        english: "How great that you passed the exam!",
        pronunciation: "keh byehn keh AH-yahs ah-proh-BAH-doh ehl ehk-SAH-mehn",
        pronunciation_focus: [
          "'hayas aprobado' = present perfect subjunctive (haya + past participle)",
          "Haber subjunctive (dirty six): haya, hayas, haya, hayamos, hayáis, hayan",
        ],
        note:
          "Qué bien que, qué pena que, qué raro que — exclamations of emotion. They trigger subjunctive even when followed by the present perfect tense, which then becomes 'hayas + past participle'.",
      },
      {
        spanish: "Me molesta que la gente hable tan alto en el tren.",
        english: "It bothers me that people speak so loudly on the train.",
        pronunciation: "meh moh-LEHS-tah keh lah HEHN-teh AH-bleh tahn AHL-toh ehn ehl trehn",
        pronunciation_focus: [
          "'hable' is third-person singular subjunctive because 'la gente' is grammatically singular in Spanish",
        ],
        note:
          "'La gente' takes SINGULAR verbs in Spanish — 'la gente habla', not 'la gente hablan'. This trips English speakers because 'people' is plural in English. Spanish treats gente as one collective noun.",
      },
    ],
    vocabulary: [
      { cell_id: "349df56a-c4e8-45fb-a26d-16677cd3f302", word: "alegrarse de", english: "to be glad / happy about", pronunciation: "ah-leh-GRAR-seh deh", part_of_speech: "verb" },
      { cell_id: "7bf3fe56-a035-4200-baa7-d832c868436c", word: "me alegra", english: "it makes me happy (gustar-style)", pronunciation: "meh ah-LEH-grah", part_of_speech: "phrase" },
      { cell_id: "38f5077d-cb82-4c0a-bb81-91010e5d29ad", word: "tener miedo de", english: "to be afraid of / that", pronunciation: "teh-NEHR MYEH-doh deh", part_of_speech: "phrase" },
      { cell_id: "35c2e5da-69b6-4f6f-9c0d-2593471230a6", word: "es una pena que", english: "it's a shame / pity that", pronunciation: "ehs OO-nah PEH-nah keh", part_of_speech: "phrase" },
      { cell_id: "fe8f1a95-5a2a-4f79-b872-4b4dc0ef31b5", word: "es una lástima que", english: "it's a pity that", pronunciation: "ehs OO-nah LAHS-tee-mah keh", part_of_speech: "phrase" },
      { cell_id: "178ebc23-aca8-437f-9599-b99938d3dc02", word: "me molesta que", english: "it bothers me that", pronunciation: "meh moh-LEHS-tah keh", part_of_speech: "phrase" },
      { cell_id: "f09c34a7-473e-4b82-a4f1-5b4e4d4bf025", word: "me preocupa que", english: "it worries me that", pronunciation: "meh preh-oh-KOO-pah keh", part_of_speech: "phrase" },
      { cell_id: "12fa8299-3345-4526-8fba-a5b58b00621f", word: "me sorprende que", english: "it surprises me that", pronunciation: "meh sohr-PREHN-deh keh", part_of_speech: "phrase" },
      { cell_id: "7886996a-4da7-4203-a471-49bc8ba610d0", word: "qué bien que", english: "how nice that (exclamation)", pronunciation: "keh byehn keh", part_of_speech: "phrase" },
      { cell_id: "94f898b9-079d-4de9-81bd-848e2544bc9b", word: "aprobar", english: "to pass (an exam) (o→ue)", pronunciation: "ah-proh-BAR", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Emotion triggers — the pattern",
        explanation:
          "Any expression of emotional reaction triggers subjunctive in the que clause: alegrarse de que, sentir que, tener miedo de que, esperar que (meaning 'hope'), me molesta que, me sorprende que, me da pena que, qué bien/raro/triste que. The that-clause describes the situation you're reacting to — and Spanish marks it subjunctive because your emotion is about it, not a neutral fact.",
        examples: [
          { spanish: "Siento que estés enfermo.", english: "I'm sorry that you're sick." },
          { spanish: "Me sorprende que llegues a tiempo.", english: "It surprises me that you're arriving on time." },
        ],
      },
      {
        point: "Same-subject case — infinitive again",
        explanation:
          "If the subject of the emotion and the subject of the action are the same, you skip the que and use the infinitive — same rule as volition. 'Me alegro de venir' (I'm happy to come — I'm both the happy one and the comer) vs 'me alegro de que vengas' (I'm happy YOU are coming). The preposition (de) is preserved with the infinitive; the que drops.",
        examples: [
          { spanish: "Tengo miedo de hablar en público.", english: "I'm afraid of speaking in public. (same subject)" },
          { spanish: "Tengo miedo de que él hable demasiado.", english: "I'm afraid he'll talk too much. (different subjects)" },
        ],
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Subjunctive in the que clause. Watch the dirty six and stem changes.",
        items: [
          { prompt: "Me alegra que (tú) ___ (estar) bien.", answer: "estés" },
          { prompt: "Siento que no ___ (poder) venir mañana.", answer: "puedas" },
          { prompt: "Es una pena que no ___ (haber) entradas.", answer: "haya" },
          { prompt: "Me sorprende que tu hermano ___ (ser) tan alto.", answer: "sea" },
          { prompt: "Tengo miedo de que ___ (llover) en la boda.", answer: "llueva" },
        ],
      },
    ],
    cultural_note:
      "Spaniards tend to express emotion through these que-clauses much more readily than English speakers — there is no equivalent stigma to 'oversharing feelings' that exists in Anglo culture. 'Me da pena que…' or 'me da rabia que…' (it makes me angry that…) are normal everyday speech, not therapy talk. When learning, lean into using these phrases freely — you will sound more natural for using them, not less.",
    tip:
      "Pick three emotion triggers (me alegra que, me molesta que, es una pena que) and write five sentences with each one about events in the news this week. Fifteen sentences total. Use each trigger with a different subjunctive verb form. You'll get conjugation practice AND learn to react in Spanish to real events — which is much closer to actual fluency than abstract drill.",
  },

  // ── 8. subjunctive_intro — spanish_subjunctive_doubt ──────────────────────
  {
    id: "spanish_subjunctive_doubt",
    level: "B1",
    category: "subjunctive_intro",
    title: "Subjunctive — doubt, denial, and uncertainty",
    subtitle: "No creo que sea verdad. The mood of 'maybe' and 'I doubt'.",
    intro:
      "The third family of subjunctive triggers is DOUBT, DENIAL, and UNCERTAINTY. The pattern: a negative belief, a doubt, or a hedging phrase in the main clause flips the verb in the que clause to subjunctive. The diagnostic test: if the speaker isn't asserting the que clause as fact, it goes subjunctive. This is the trickiest family for English speakers because the same verb (creer, pensar) flips moods based on whether it's negated. 'Creo que viene' (I think he's coming — indicative, asserting). 'No creo que venga' (I don't think he's coming — subjunctive, denying).",
    sentences: [
      {
        spanish: "Creo que tiene razón.",
        english: "I think he's right.",
        pronunciation: "KREH-oh keh TYEH-neh rrah-SOHN",
        pronunciation_focus: [
          "Creer + affirmative belief → INDICATIVE — the speaker is asserting what comes next",
        ],
        note:
          "Affirmative creer/pensar/parecer takes indicative. The speaker is committing to the fact in the que clause. No subjunctive here.",
      },
      {
        spanish: "No creo que tenga razón.",
        english: "I don't think he's right.",
        pronunciation: "noh KREH-oh keh TEHN-gah rrah-SOHN",
        pronunciation_focus: [
          "No creer / no pensar → SUBJUNCTIVE — the speaker is NOT committing to what comes next",
        ],
        note:
          "Same verb, but negated → subjunctive. The flip is automatic. 'No creo que', 'no pienso que', 'no me parece que' all trigger subjunctive in the que clause.",
      },
      {
        spanish: "Dudo que llegue a tiempo.",
        english: "I doubt he'll arrive on time.",
        pronunciation: "DOO-doh keh YEH-geh ah TYEHM-poh",
        pronunciation_focus: [
          "'llegue' — spelling change (-gar → -gue) preserves the hard 'g' sound",
        ],
        note:
          "Dudar always triggers subjunctive, even in the affirmative — because the meaning IS doubt. 'No dudo que' is a special case that goes back to indicative (no doubt = certainty).",
      },
      {
        spanish: "Es posible que llueva mañana.",
        english: "It's possible it will rain tomorrow.",
        pronunciation: "ehs poh-SEE-bleh keh YWEH-bah mah-NYAH-nah",
        pronunciation_focus: [
          "'llueva' — llover has o→ue stem change preserved in subjunctive",
        ],
        note:
          "Impersonal expressions of possibility, probability, and impossibility all trigger subjunctive: es posible que, es probable que, puede que, es imposible que, no es seguro que. These are some of the most-used subjunctive triggers in everyday Spanish.",
      },
      {
        spanish: "Quizás venga mañana, no lo sé.",
        english: "Maybe he'll come tomorrow, I don't know.",
        pronunciation: "kee-SAHS BEHN-gah mah-NYAH-nah, noh loh seh",
        pronunciation_focus: [
          "'quizás' and 'tal vez' trigger subjunctive (uncertainty)",
        ],
        note:
          "Quizás / quizá / tal vez trigger subjunctive in standard Spanish. The exception that catches everyone: 'a lo mejor' means the same thing but takes INDICATIVE — 'a lo mejor viene mañana'. Memorize the exception or you'll keep getting it wrong.",
      },
    ],
    vocabulary: [
      { cell_id: "ef9d5006-0320-44e5-8ef2-3a59bf2d5fdf", word: "creer", english: "to believe / think — indicative when affirmative, subjunctive when negated", pronunciation: "kreh-EHR", part_of_speech: "verb" },
      { cell_id: "636cf220-4cd9-4f26-998e-82e0678e2900", word: "pensar", english: "to think (e→ie) — same flip rule as creer", pronunciation: "pehn-SAR", part_of_speech: "verb" },
      { cell_id: "fa32170b-df95-4aaf-9de7-8ca91ecc7e24", word: "parecer", english: "to seem — 'me parece que' flips same way", pronunciation: "pah-reh-SEHR", part_of_speech: "verb" },
      { cell_id: "083940f3-1dbf-48be-916c-5f710bde47f8", word: "dudar", english: "to doubt — triggers subjunctive (no dudar goes back to indicative)", pronunciation: "doo-DAR", part_of_speech: "verb" },
      { cell_id: "7a69ed0e-f661-4de8-b0b8-28e0f94511a9", word: "negar", english: "to deny (e→ie) — triggers subjunctive (no negar back to indicative)", pronunciation: "neh-GAR", part_of_speech: "verb" },
      { cell_id: "ac1ae279-a883-4ef8-9f68-567cb3409a45", word: "es posible que", english: "it's possible that — subjunctive trigger", pronunciation: "ehs poh-SEE-bleh keh", part_of_speech: "phrase" },
      { cell_id: "ccb573c1-a6a0-4518-b53a-b6415f27f96a", word: "es probable que", english: "it's likely that — subjunctive trigger", pronunciation: "ehs proh-BAH-bleh keh", part_of_speech: "phrase" },
      { cell_id: "d2c7b446-140c-46a7-92a2-6fac4db948e3", word: "puede que", english: "maybe / it may be that — subjunctive trigger", pronunciation: "PWEH-deh keh", part_of_speech: "phrase" },
      { cell_id: "2a14c57b-825a-4821-8c2c-5e0be419da01", word: "quizás / quizá / tal vez", english: "perhaps / maybe — subjunctive triggers", pronunciation: "kee-SAHS / kee-SAH / tahl behs", part_of_speech: "phrase" },
      { cell_id: "f61dab5b-62a1-441a-adcd-48760d1844f2", word: "a lo mejor", english: "maybe (the indicative exception)", pronunciation: "ah loh meh-HOR", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "The creer / pensar flip",
        explanation:
          "Affirmative creer/pensar/parecer + que takes INDICATIVE because the speaker is committing to the truth of the que clause. Negate them — no creer, no pensar, no parecer — and they flip to SUBJUNCTIVE because the speaker is now NOT committing. Question form ('¿crees que…?') is genuinely ambiguous in Spanish: indicative if you expect a yes, subjunctive if you're genuinely doubting. Most speakers default to indicative in questions; subjunctive in questions is more skeptical.",
        examples: [
          { spanish: "Pienso que es buena idea.", english: "I think it's a good idea. (indicative, asserting)" },
          { spanish: "No pienso que sea buena idea.", english: "I don't think it's a good idea. (subjunctive, denying)" },
        ],
      },
      {
        point: "Impersonal expressions of probability",
        explanation:
          "Es posible/probable que, puede que, es imposible que, no es seguro que — all trigger subjunctive because they hedge. Note: 'es seguro que', 'es verdad que', 'es cierto que' (affirmative, asserting certainty) take INDICATIVE. The flip again: hedge → subjunctive, assert → indicative. Es cierto que viene (indicative — it's certain he's coming). No es cierto que venga (subjunctive — it's NOT certain).",
      },
      {
        point: "The a lo mejor exception",
        explanation:
          "Quizás, quizá, tal vez all trigger subjunctive. But 'a lo mejor' — which means EXACTLY the same thing — takes INDICATIVE. 'A lo mejor viene' (maybe he's coming) NOT 'a lo mejor venga'. There is no good rule for why; it is etymological accident plus how speakers fixed the phrase. The shortcut: when you use a lo mejor, follow it with the present indicative. Always. Just memorize the rule and move on.",
        examples: [
          { spanish: "Quizás venga. / Tal vez venga.", english: "Maybe he'll come. (subjunctive)" },
          { spanish: "A lo mejor viene.", english: "Maybe he'll come. (INDICATIVE — exception)" },
        ],
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Pick indicative or subjunctive. The flip rule applies.",
        items: [
          { prompt: "Creo que María ___ (estar) en casa.", answer: "está" },
          { prompt: "No creo que ___ (ser) tan tarde.", answer: "sea" },
          { prompt: "Dudo que el tren ___ (llegar) a tiempo.", answer: "llegue" },
          { prompt: "Quizás ___ (haber) tráfico esta mañana.", answer: "haya" },
          { prompt: "A lo mejor mi hermana ___ (venir) este fin de semana.", answer: "viene" },
        ],
      },
    ],
    cultural_note:
      "Spanish speakers use 'creo que' with indicative as a soft assertion all the time — closer to English 'I'd say…' than to 'I sincerely believe…'. It is not a strong commitment. The strong assertion is 'estoy seguro/a de que' or 'sin duda'. Pay attention to register: 'no creo que' (with subjunctive) is normal contradiction; 'no me parece que' (with subjunctive) is softer and more polite; 'no es verdad que' (with subjunctive) is direct and a bit confrontational. Choose by how much you want to push back.",
    tip:
      "Build a flip card. On the front: 'Creo que ___'. On the back: 'No creo que ___'. Fill in the same verb on both sides, indicative then subjunctive (creo que viene / no creo que venga). Do this for ten different verbs. After that, the flip is wired — you stop thinking about it and just produce the right mood automatically.",
  },

  // ── 9. future_conditional — spanish_future_probability ────────────────────
  {
    id: "spanish_future_probability",
    level: "B1",
    category: "future_conditional",
    title: "Future tense — and the speculation use that makes you sound native",
    subtitle: "Iré, irás, irá… plus the trick: future = probability about NOW.",
    intro:
      "Spanish has a 'real' future tense (iré, comeré) that competes with the 'going to' future (voy a ir). In everyday speech, 'voy a + infinitive' is winning — it sounds natural and learners default to it. But the simple future has one distinctly Spanish use that you cannot do any other way: PROBABILITY ABOUT THE PRESENT. 'Será la una' (it must be around one o'clock). 'Estará en casa' (he's probably at home). English uses 'must be' or 'probably'; Spanish uses the future tense. This is the highlight of the lesson — skip it and you'll always sound like a textbook.",
    sentences: [
      {
        spanish: "Mañana iré al gimnasio después del trabajo.",
        english: "Tomorrow I'll go to the gym after work.",
        pronunciation: "mah-NYAH-nah ee-REH ahl heem-NAH-syoh dehs-PWEHS dehl trah-BAH-hoh",
        pronunciation_focus: [
          "Future endings carry stress on the FINAL syllable in yo and él/ella/usted forms — ee-REH, not EE-reh",
          "Written accent on final vowel forces this stress",
        ],
        note:
          "Standard future use — predicting/planning an action. In Spain, this future is somewhat losing ground to 'voy a + infinitive' in speech, but it's still required for formal writing and used routinely in LatAm.",
      },
      {
        spanish: "¿Dónde estará María? Ya son las nueve.",
        english: "Where could María be? It's already nine.",
        pronunciation: "DOHN-deh ehs-tah-RAH mah-REE-ah? yah sohn lahs NWEH-beh",
        pronunciation_focus: [
          "'estará' here is NOT about the future — it's speculation about NOW. 'Where can she be (right now)?'",
        ],
        note:
          "The probability future. 'Estará' = 'she must be / she's probably'. English speakers miss this constantly because the form looks like future but the meaning is present-speculative.",
      },
      {
        spanish: "Tendrá unos cincuenta años, calculo yo.",
        english: "He's probably about fifty, I'd guess.",
        pronunciation: "tehn-DRAH OO-nohs seen-KWEHN-tah AH-nyohs, kahl-KOO-loh yoh",
        pronunciation_focus: [
          "'tendrá' = irregular future of tener (drop e, insert d → tendr-)",
          "Probability about a present-time state (his current age)",
        ],
        note:
          "Future of probability with tener for estimating ages. 'Tendrá X años' = 'he must be about X years old'. This phrasing is everywhere in Spanish small talk.",
      },
      {
        spanish: "Saldremos a las ocho si no llueve.",
        english: "We'll leave at eight if it doesn't rain.",
        pronunciation: "sahl-DREH-mohs ah lahs OH-choh see noh YWEH-beh",
        pronunciation_focus: [
          "'saldremos' = irregular future of salir (insert d → saldr-)",
          "'si' clause uses present indicative — never future after si meaning 'if'",
        ],
        note:
          "Important rule: after 'si' meaning 'if', NEVER use the future tense in Spanish. Use present indicative on the si side, future on the other. 'Si llueve, no iremos' — never 'si lloverá'. This breaks the English pattern of 'if it will rain'.",
      },
      {
        spanish: "Habrá unas treinta personas en la fiesta.",
        english: "There must be about thirty people at the party.",
        pronunciation: "ah-BRAH OO-nahs TREHN-tah pehr-SOH-nahs ehn lah FYEHS-tah",
        pronunciation_focus: [
          "'habrá' = future of haber, used as 'there will be' OR 'there must be' (probability)",
          "Like all 'there is/are' forms of haber, invariable — habrá unas X personas, not habrán",
        ],
        note:
          "Habrá covers both real future ('there will be') and present probability ('there must be'). Context disambiguates. Like 'había' and 'hay', it's invariable regardless of singular/plural.",
      },
    ],
    vocabulary: [
      { cell_id: "d524d89c-bf7f-4fde-83a3-2b82cf15972e", word: "el gimnasio", english: "the gym", pronunciation: "ehl heem-NAH-syoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "6de615a7-1d7a-4123-b47d-a356013f345b", word: "tener (irregular future)", english: "tener → tendré, tendrás, tendrá, tendremos, tendréis, tendrán", pronunciation: "teh-NEHR", part_of_speech: "verb" },
      { cell_id: "1eff5e9e-85e5-4ed4-bafa-8b1ec236b2fd", word: "salir (irregular future)", english: "salir → saldré, saldrás, saldrá, saldremos, saldréis, saldrán", pronunciation: "sah-LEER", part_of_speech: "verb" },
      { cell_id: "8b3cd862-17c9-4526-83df-a2a76e41e139", word: "poner (irregular future)", english: "poner → pondré, pondrás, pondrá, pondremos, pondréis, pondrán", pronunciation: "poh-NEHR", part_of_speech: "verb" },
      { cell_id: "a08a8766-228a-408f-93f3-7c19c03cf458", word: "venir (irregular future)", english: "venir → vendré, vendrás, vendrá, vendremos, vendréis, vendrán", pronunciation: "beh-NEER", part_of_speech: "verb" },
      { cell_id: "5aee9950-a35e-4929-910a-e47e539735eb", word: "hacer (irregular future)", english: "hacer → haré, harás, hará, haremos, haréis, harán", pronunciation: "ah-SEHR", part_of_speech: "verb" },
      { cell_id: "791fbc4f-7e2f-4835-b25b-cb1bab2802eb", word: "decir (irregular future)", english: "decir → diré, dirás, dirá, diremos, diréis, dirán", pronunciation: "deh-SEER", part_of_speech: "verb" },
      { cell_id: "a68f593c-1c52-40f6-9501-7b97adfbc3a1", word: "haber (irregular future)", english: "haber → habré, habrás, habrá, habremos, habréis, habrán", pronunciation: "ah-BEHR", part_of_speech: "verb" },
      { cell_id: "5cfce1f3-950c-4393-84e0-db53baa33bd5", word: "querer (irregular future)", english: "querer → querré, querrás, querrá, querremos, querréis, querrán", pronunciation: "keh-REHR", part_of_speech: "verb" },
      { cell_id: "ad5a782b-9d40-4bdd-944a-4e94c1a88d5f", word: "saber (irregular future)", english: "saber → sabré, sabrás, sabrá, sabremos, sabréis, sabrán", pronunciation: "sah-BEHR", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Future endings — the same for ALL three conjugations",
        explanation:
          "Spanish future is built by adding endings to the FULL INFINITIVE (not a stem): -é, -ás, -á, -emos, -éis, -án. Same set for -ar, -er, -ir verbs. hablar → hablaré, comer → comeré, vivir → viviré. Five out of six endings carry a written accent, which forces final-syllable stress. The yo and él/ella endings (-é and -á) sound identical in unstressed speech — listen for the verb stem to tell them apart.",
        examples: [
          { spanish: "hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán", english: "I will speak…" },
        ],
      },
      {
        point: "12 verbs with irregular future stems",
        explanation:
          "About a dozen common verbs have IRREGULAR future stems but use the same endings. Three patterns: (1) drop the infinitive's vowel — poder→podr-, querer→querr-, saber→sabr-, haber→habr-, caber→cabr-. (2) drop vowel + insert d — tener→tendr-, poner→pondr-, salir→saldr-, venir→vendr-, valer→valdr-. (3) Shortened: decir→dir-, hacer→har-. Memorize these twelve and you have all the irregular futures in the language.",
      },
      {
        point: "Future of probability — the highlight",
        explanation:
          "The simple future can be used to express PROBABILITY about the PRESENT. 'Será la una' doesn't mean 'it will be one o'clock'; it means 'it must be one o'clock' (current speculation). 'Tendrá hambre' = 'he's probably hungry' (right now). 'Estará en casa' = 'he must be at home' (now). English uses 'must be' or 'probably' or 'I bet'; Spanish uses the future tense. This is distinctively Spanish — using it correctly signals you're past textbook Spanish.",
        examples: [
          { spanish: "¿Qué hora es? — Serán las dos.", english: "What time is it? — It must be about two." },
          { spanish: "¿Por qué no contesta? — Estará durmiendo.", english: "Why isn't he answering? — He's probably sleeping." },
        ],
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Future tense forms. Some are predicting; some are speculating about NOW.",
        items: [
          { prompt: "Mañana ___ (yo / ir) al médico.", answer: "iré" },
          { prompt: "¿Dónde ___ (estar) los niños? Ya es muy tarde.", answer: "estarán" },
          { prompt: "El año que viene ___ (nosotros / hacer) un viaje a México.", answer: "haremos" },
          { prompt: "El profesor ___ (tener) unos sesenta años, supongo.", answer: "tendrá" },
          { prompt: "Si tengo tiempo, ___ (yo / venir) a verte.", answer: "vendré" },
        ],
      },
    ],
    cultural_note:
      "The probability future is BUILT into Spanish small talk. When you walk into a room and someone says 'pues serán las cinco' looking at the clock, they're not predicting the future — they're guessing the current time without checking. When your friend says 'tendrás hambre, ¿no?' they're not asking about tomorrow — they're asking if you're hungry right now. Listen for this in any Spanish-language podcast or film and you'll suddenly hear it everywhere. Producing it in your own speech is one of the biggest leaps from 'fluent learner' to 'sounds native'.",
    tip:
      "Build a habit: any time you'd normally say 'must be' or 'probably' or 'I bet' in English about a current situation, use the simple future in Spanish. Don't say 'es probablemente las cinco' — say 'serán las cinco'. Don't say 'él está probablemente en casa' — say 'estará en casa'. Train this for a week and it becomes automatic. This single substitution upgrades your Spanish register more than any other B1 trick.",
  },

  // ── 10. future_conditional — spanish_conditional_politeness ──────────────
  {
    id: "spanish_conditional_politeness",
    level: "B1",
    category: "future_conditional",
    title: "Conditional — would, plus the politeness upgrade",
    subtitle: "Me gustaría > quiero. Podrías > puedes. The single biggest register win at B1.",
    intro:
      "The conditional tense translates English 'would'. Its forms are mechanical (infinitive + imperfect endings — almost too easy). The real value at B1 is what conditional does for your REGISTER. Spanish defaults to using conditional for polite requests, soft preferences, and tentative suggestions — places where English would use 'I want' or 'can you' or 'do me a favor'. Switching from 'quiero un café' to 'me gustaría un café', or from 'puedes ayudarme' to 'podrías ayudarme', is the single biggest politeness upgrade you can make at this level. Make it a default and you'll stop sounding bossy.",
    sentences: [
      {
        spanish: "Me gustaría un café con leche, por favor.",
        english: "I would like a coffee with milk, please.",
        pronunciation: "meh goos-tah-REE-ah oon kah-FEH kohn LEH-cheh, por fah-BOR",
        pronunciation_focus: [
          "Conditional endings: -ía, -ías, -ía, -íamos, -íais, -ían (same as imperfect -er/-ir endings)",
          "'gustaría' carries written accent on í — stressed there",
        ],
        note:
          "Compare to 'quiero un café' — also correct, but blunt. 'Me gustaría' is the polite default in any service setting (restaurant, shop, hotel). Adopt it.",
      },
      {
        spanish: "¿Podrías pasarme el agua?",
        english: "Could you pass me the water?",
        pronunciation: "poh-DREE-ahs pah-SAR-meh ehl AH-gwah",
        pronunciation_focus: [
          "'podrías' — irregular conditional (same stem as future: podr-)",
        ],
        note:
          "'Podrías' (could you) is softer than 'puedes' (can you). At a dinner table or with a stranger, use the conditional. It's the difference between asking and asking-nicely.",
      },
      {
        spanish: "Yo en tu lugar, no haría eso.",
        english: "If I were you, I wouldn't do that.",
        pronunciation: "yoh ehn too loo-GAR, noh ah-REE-ah EH-soh",
        pronunciation_focus: [
          "'haría' = conditional of hacer, irregular (har- stem like future)",
          "'Yo en tu lugar' = 'if I were in your place' — fixed expression for hypothetical advice",
        ],
        note:
          "Conditional after a hypothetical frame ('if I were you', 'in your situation'). Note that Spanish gives advice through conditional rather than imperative — softer and more graceful.",
      },
      {
        spanish: "¿Te importaría cerrar la ventana?",
        english: "Would you mind closing the window?",
        pronunciation: "teh eem-por-tah-REE-ah seh-RRAR lah behn-TAH-nah",
        pronunciation_focus: [
          "'importaría' — conditional of the impersonal verb importar",
        ],
        note:
          "'¿Te importaría + infinitive?' is the most polite request form in Spanish. Equivalent to English 'would you mind…?'. Reserve for genuinely-polite contexts (asking a stranger, asking for a real favor).",
      },
      {
        spanish: "Deberías hablar con tu jefe sobre esto.",
        english: "You should talk to your boss about this.",
        pronunciation: "deh-beh-REE-ahs ah-BLAR kohn too HEH-feh SOH-breh EHS-toh",
        pronunciation_focus: [
          "'deberías' = conditional of deber, the polite 'should' for giving advice",
        ],
        note:
          "Conditional of deber (deberías, debería) is how Spanish does 'should' for advice. 'Debes' (present) is more like 'you must' — too strong for friendly advice. Always use the conditional for suggestions to peers.",
      },
    ],
    vocabulary: [
      { cell_id: "43121070-6bb5-4f62-a624-092ccbdcf86d", word: "gustar (conditional)", english: "me gustaría = I would like (polite alternative to quiero)", pronunciation: "goos-tah-REE-ah", part_of_speech: "verb" },
      { cell_id: "da16df28-5367-42fe-a187-3961a3b2457a", word: "poder (conditional)", english: "podría = I/he/she could; podrías = you could (polite)", pronunciation: "poh-DREE-ah(s)", part_of_speech: "verb" },
      { cell_id: "70a91956-9226-4dfe-b7be-049bfd6cee4d", word: "deber (conditional)", english: "debería = should (polite advice)", pronunciation: "deh-beh-REE-ah", part_of_speech: "verb" },
      { cell_id: "3ff809b4-654b-4d94-85be-5b7ec7335c06", word: "querer (conditional)", english: "querría = would like (slightly more formal than gustaría)", pronunciation: "keh-RREE-ah", part_of_speech: "verb" },
      { cell_id: "07fa781a-14e1-43d0-919e-c410ae32ccfa", word: "importar (conditional)", english: "¿te importaría? = would you mind?", pronunciation: "eem-por-tah-REE-ah", part_of_speech: "verb" },
      { cell_id: "69baf35c-6ebe-4720-b02e-3050d8b5c24b", word: "hacer (conditional)", english: "haría = I would do (irregular: har- stem)", pronunciation: "ah-REE-ah", part_of_speech: "verb" },
      { cell_id: "6267a345-4f85-4775-9dad-7370c5110f02", word: "decir (conditional)", english: "diría = I would say (irregular: dir- stem)", pronunciation: "dee-REE-ah", part_of_speech: "verb" },
      { cell_id: "0d091dc7-5582-4e77-9230-221efb88fd9b", word: "tener (conditional)", english: "tendría = I would have (irregular: tendr- stem)", pronunciation: "tehn-DREE-ah", part_of_speech: "verb" },
      { cell_id: "cd1a3032-d446-44f3-b31c-74cc7dafd3f5", word: "venir (conditional)", english: "vendría = I would come (irregular: vendr- stem)", pronunciation: "behn-DREE-ah", part_of_speech: "verb" },
      { cell_id: "184b14f2-4d64-4712-8818-2706393afcea", word: "en tu lugar", english: "in your place / if I were you", pronunciation: "ehn too loo-GAR", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Conditional forms — infinitive + -ía endings",
        explanation:
          "The conditional is built like the future — endings glued to the full infinitive — but it uses the -ía endings borrowed from the imperfect -er/-ir set. -ía, -ías, -ía, -íamos, -íais, -ían. Every form carries an accent on the í. Same twelve verbs that are irregular in the future are irregular in the conditional, with the same stems: tendría, vendría, sabría, podría, haría, diría, etc. Memorize one set; you get both tenses free.",
        examples: [
          { spanish: "hablaría, hablarías, hablaría, hablaríamos, hablaríais, hablarían", english: "would speak" },
          { spanish: "podría, podrías, podría, podríamos, podríais, podrían", english: "could (would be able)" },
        ],
      },
      {
        point: "Politeness register — your default move",
        explanation:
          "Conditional substitutes for present tense to soften almost any request, preference, or piece of advice. Quiero → me gustaría / querría. Puedes → podrías. Debes → deberías. Tienes que → tendrías que. This isn't optional refinement; it's how adult Spanish speakers actually talk in formal-or-polite contexts. Hotel check-in, restaurant ordering, asking strangers, talking to your boss, anything with usted — defaults to conditional.",
      },
      {
        point: "Conditional in hypothetical frames",
        explanation:
          "The conditional also pairs with imperfect subjunctive to express hypotheticals: 'Si tuviera dinero, viajaría más' (If I had money, I would travel more). This is the Type 2 SI conditional you'll meet fully in the next lesson. For now, internalize: any 'would' sentence in English maps to conditional in Spanish. 'I would help, but I'm busy' → 'Te ayudaría, pero estoy ocupado.'",
      },
    ],
    dialogue: [
      { cell_id: "b720b57c-c4a5-4002-bf0e-c18c0ccfe691", speaker: "Camarero", spanish: "¿Qué van a tomar?", english: "What will you have?", pronunciation: "keh bahn ah toh-MAR", register: "formal" },
      { cell_id: "7198fc7d-c109-408a-853f-d3c6fa09fa33", speaker: "Cliente", spanish: "Me gustaría una caña, por favor.", english: "I'd like a small beer, please.", pronunciation: "meh goos-tah-REE-ah OO-nah KAH-nyah, por fah-BOR", register: "formal" },
      { cell_id: "24deed56-0af5-4d05-9aa3-0474f6fc5e08", speaker: "Camarero", spanish: "Muy bien. ¿Algo de comer?", english: "Very good. Anything to eat?", pronunciation: "MOO-ee byehn. AHL-goh deh koh-MEHR", register: "formal" },
      { cell_id: "4b4b6c65-de29-4da8-808c-e240355929d7", speaker: "Cliente", spanish: "¿Podría traernos la carta?", english: "Could you bring us the menu?", pronunciation: "poh-DREE-ah trah-EHR-nohs lah KAR-tah", register: "formal" },
      { cell_id: "6cd62416-d9b3-45b2-9751-90ae0842d6ff", speaker: "Camarero", spanish: "Por supuesto, ahora mismo.", english: "Of course, right away.", pronunciation: "por soo-PWEHS-toh, ah-OH-rah MEES-moh", register: "formal" },
    ],
    cultural_note:
      "The leap from 'quiero' to 'me gustaría' is the single biggest register upgrade an English speaker can make at B1. In any Spanish-speaking country, walking up to a counter and saying 'quiero un café' is grammatically perfect and socially flat — it makes you sound like a learner or a tourist. 'Me gustaría un café' or '¿me pones un café?' (Spain) sounds like someone who lives there. The vocabulary is the same; the register isn't.",
    tip:
      "Pick three verbs you use constantly — querer, poder, deber — and force yourself to use only their conditional forms for one full day. Quiero → me gustaría / querría. Puedes → podrías. Debes → deberías. By the end of that day the substitution will feel automatic, and your Spanish will sound noticeably more adult.",
  },

  // ── 11. future_conditional — spanish_si_conditionals ──────────────────────
  {
    id: "spanish_si_conditionals",
    level: "B1",
    category: "future_conditional",
    title: "SI conditionals — real, hypothetical, and a glimpse of past hypothetical",
    subtitle: "If it rains, we cancel. / If it rained, we would cancel. / If it had rained, we would have cancelled.",
    intro:
      "Spanish 'si' (if) clauses come in three types. Type 1 — real conditions about future possibilities: 'si llueve, no salimos' (if it rains, we don't go out). Type 2 — hypothetical or contrary-to-fact present: 'si lloviera, no saldríamos' (if it rained, we wouldn't go out). Type 3 — past hypothetical: 'si hubiera llovido, no habríamos salido' (if it had rained, we wouldn't have gone out). At B1 you produce Types 1 and 2; Type 3 is recognition-only — you should understand it when you hear it. Mastery of Type 3 belongs to B2.",
    sentences: [
      {
        spanish: "Si tengo tiempo, te llamo esta tarde.",
        english: "If I have time, I'll call you this afternoon.",
        pronunciation: "see TEHN-goh TYEHM-poh, teh YAH-moh EHS-tah TAR-deh",
        pronunciation_focus: [
          "Type 1: si + PRESENT INDICATIVE, then present or future",
          "NEVER 'si tendré' — Spanish forbids future tense after 'si' meaning 'if'",
        ],
        note:
          "Type 1 = real condition. Use it when the situation is plausible and you're describing what will (probably) happen. Present indicative on the si side; present or future on the other side.",
      },
      {
        spanish: "Si llueve mañana, no vamos a la playa.",
        english: "If it rains tomorrow, we're not going to the beach.",
        pronunciation: "see YWEH-beh mah-NYAH-nah, noh BAH-mohs ah lah PLAH-yah",
        pronunciation_focus: [
          "Present indicative 'llueve' on the si side, even though we're talking about tomorrow",
        ],
        note:
          "Note the tense logic — English allows 'if it rains tomorrow' (present) OR 'if it will rain' (Spanish disallows the second). Drill: NO future after 'si' meaning 'if'.",
      },
      {
        spanish: "Si tuviera más dinero, viajaría por todo el mundo.",
        english: "If I had more money, I'd travel around the world.",
        pronunciation: "see too-BYEH-rah mahs dee-NEH-roh, byah-hah-REE-ah por TOH-doh ehl MOON-doh",
        pronunciation_focus: [
          "Type 2: si + IMPERFECT SUBJUNCTIVE, then CONDITIONAL",
          "'tuviera' = imperfect subjunctive of tener (built from preterite stem: tuvier-)",
        ],
        note:
          "Type 2 = hypothetical. Use it when the situation is unlikely, imaginary, or contrary to fact. Imperfect subjunctive on the si side, conditional on the other side. This is the structure for daydreaming, advice ('if I were you'), and polite hypotheticals.",
      },
      {
        spanish: "Si fuera tú, hablaría con él directamente.",
        english: "If I were you, I'd talk to him directly.",
        pronunciation: "see FWEH-rah too, ah-blah-REE-ah kohn ehl dee-rehk-tah-MEHN-teh",
        pronunciation_focus: [
          "'fuera' = imperfect subjunctive of ser/ir (same form for both)",
          "Note: 'si fuera tú' is more direct than 'yo en tu lugar', but both mean the same thing",
        ],
        note:
          "The 'if I were you' construction in Spanish: 'si fuera tú' or 'yo que tú' or 'yo en tu lugar' — all common, all triggering conditional in the result clause. Standard form of giving advice.",
      },
      {
        spanish: "Si hubiera sabido la verdad, no habría venido.",
        english: "If I had known the truth, I wouldn't have come.",
        pronunciation: "see oo-BYEH-rah sah-BEE-doh lah behr-DAHD, noh ah-BREE-ah beh-NEE-doh",
        pronunciation_focus: [
          "Type 3 (PREVIEW): si + PLUPERFECT SUBJUNCTIVE (hubiera + past participle), then CONDITIONAL PERFECT (habría + past participle)",
          "Recognition-only at B1 — you should UNDERSTAND this when you hear it",
        ],
        note:
          "Type 3 = past hypothetical (the thing didn't happen). Reserved for full mastery at B2. For now, recognize it in input — you'll hear it in any film with a regret scene ('si hubiera, habría…').",
      },
    ],
    vocabulary: [
      { cell_id: "895734e2-1de1-4a27-997d-082689cb6a81", word: "si", english: "if (NEVER followed by future or present subjunctive)", pronunciation: "see", part_of_speech: "conjunction" },
      { cell_id: "01d7cf3f-023b-4eda-b6e2-70d49289ddbb", word: "tener (imperfect subjunctive)", english: "tener → tuviera, tuvieras, tuviera, tuviéramos, tuvierais, tuvieran (also -se forms: tuviese, tuvieses…)", pronunciation: "teh-NEHR", part_of_speech: "verb" },
      { cell_id: "7567c548-f0c5-4c0d-9c3e-8e24c5a8e44b", word: "ser / ir (imperfect subjunctive)", english: "ser and ir share: fuera, fueras, fuera, fuéramos, fuerais, fueran", pronunciation: "sehr / eer", part_of_speech: "verb" },
      { cell_id: "19e91f9c-08f5-4a53-8577-eceee8cf4fe8", word: "estar (imperfect subjunctive)", english: "estuviera, estuvieras, estuviera, estuviéramos, estuvierais, estuvieran", pronunciation: "ehs-TAR", part_of_speech: "verb" },
      { cell_id: "031669a1-a143-4006-a3af-cd728d610cf3", word: "haber (imperfect subjunctive)", english: "hubiera, hubieras, hubiera, hubiéramos, hubierais, hubieran (used for Type 3 conditionals)", pronunciation: "ah-BEHR", part_of_speech: "verb" },
      { cell_id: "5ca86e46-6c7c-4548-aa77-19e5b04846d3", word: "el mundo", english: "the world", pronunciation: "ehl MOON-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "3606895d-2740-4759-af34-7644fc896a0c", word: "viajar", english: "to travel", pronunciation: "byah-HAR", part_of_speech: "verb" },
      { cell_id: "9d49d8ce-ada4-4354-a13e-678e0a9e68b7", word: "directamente", english: "directly", pronunciation: "dee-rehk-tah-MEHN-teh", part_of_speech: "adverb" },
      { cell_id: "df8bf2f3-a7d7-4d63-bc4b-02e2e46ba2a3", word: "la verdad", english: "the truth", pronunciation: "lah behr-DAHD", part_of_speech: "noun", gender: "f" },
      { cell_id: "364d80ae-540f-49fa-84ed-2fc20d904147", word: "yo que tú", english: "if I were you (literally: I who you)", pronunciation: "yoh keh too", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Type 1 — real condition (PRODUCE this)",
        explanation:
          "si + PRESENT INDICATIVE, then PRESENT or FUTURE. Use for plausible conditions about the future. 'Si llueve, no salgo / no saldré.' Never put future or subjunctive on the si side. The English 'if it will rain' is grammatical English; Spanish 'si lloverá' is hard wrong. Drill this asymmetry.",
        examples: [
          { spanish: "Si vienes mañana, comemos juntos.", english: "If you come tomorrow, we eat together." },
          { spanish: "Si llamas más tarde, te contesto.", english: "If you call later, I'll answer." },
        ],
      },
      {
        point: "Type 2 — hypothetical (PRODUCE this)",
        explanation:
          "si + IMPERFECT SUBJUNCTIVE, then CONDITIONAL. Use for unlikely, imaginary, or contrary-to-fact present situations. 'Si tuviera tiempo, iría.' (I don't have time, but if I did, I'd go.) The imperfect subjunctive is built from the THIRD-PERSON PLURAL preterite stem: tuvieron → tuviera. fueron → fuera. supieron → supiera. This pattern is mechanical once you know it.",
        examples: [
          { spanish: "Si supiera la respuesta, te la diría.", english: "If I knew the answer, I'd tell you." },
          { spanish: "Si fuéramos ricos, viviríamos en la playa.", english: "If we were rich, we'd live at the beach." },
        ],
      },
      {
        point: "Imperfect subjunctive — the -ra and -se forms",
        explanation:
          "Imperfect subjunctive has TWO sets of endings, interchangeable: -ra forms (hablara, comiera, viviera) and -se forms (hablase, comiese, viviese). In speech, -ra dominates everywhere; -se is mostly written and more common in Spain than LatAm. As a learner, drill the -ra forms — they're what you'll hear and speak. Recognize the -se forms when you read formal Spanish.",
      },
      {
        point: "Type 3 — past hypothetical (RECOGNIZE only)",
        explanation:
          "si + PLUPERFECT SUBJUNCTIVE (hubiera + past participle), then CONDITIONAL PERFECT (habría + past participle). Use for situations contrary to past fact. 'Si hubiera estudiado, habría aprobado.' (I didn't study, but if I had, I would have passed.) This is the regret tense. Don't try to produce it in conversation at B1 — your sentence will collapse halfway through. Train your ear to recognize 'hubiera…habría…' as the regret/counterfactual shape; production comes at B2.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Build Type 1 (real) or Type 2 (hypothetical) conditionals.",
        items: [
          { prompt: "Si ___ (tener) tiempo mañana, te llamo. (Type 1)", answer: "tengo" },
          { prompt: "Si yo ___ (ser) rico, viajaría por el mundo. (Type 2)", answer: "fuera" },
          { prompt: "Si llueve, no ___ (nosotros / salir) de casa. (Type 1)", answer: "salimos" },
          { prompt: "Si supiera la respuesta, te la ___ (decir). (Type 2)", answer: "diría" },
          { prompt: "Si tú ___ (estudiar) más, sacarías mejores notas. (Type 2)", answer: "estudiaras" },
        ],
      },
    ],
    cultural_note:
      "Latin American Spanish often opts for 'si + present, future' even where Spaniards would say 'si + present, present' ('si llueve, no saldré' vs 'si llueve, no salgo'). Both are correct; the LatAm version sounds slightly more emphatic. Type 2 conditionals are used the same way across regions, but in Argentina you'll hear 'si tuviera' replaced by 'si tendría' in colloquial speech — that form is NOT taught as standard but you should expect to hear it. The pluperfect subjunctive (Type 3) is universal and consistent across all regions.",
    tip:
      "Drill Type 1 and Type 2 as PAIRS. Same scenario, both versions: 'Si tengo tiempo, voy al gimnasio.' (real, plausible) / 'Si tuviera tiempo, iría al gimnasio.' (hypothetical, currently don't have time). Five scenarios, ten sentences, fifteen minutes. After that, the choice between Type 1 and Type 2 stops being a question of grammar and becomes a question of how you actually feel about the situation — which is what natives do.",
  },

  // ── 12. por_vs_para — spanish_por_para_core ───────────────────────────────
  {
    id: "spanish_por_para_core",
    level: "B1",
    category: "por_vs_para",
    title: "Por vs para — the core distinction",
    subtitle: "Both mean 'for' in English. They are not interchangeable.",
    intro:
      "Por and para both translate to English 'for', but they mean different things in Spanish. The cleanest distinction at B1 is: PARA marks destination, recipient, deadline, goal — anything pointing FORWARD. POR marks cause, exchange, route, duration, the means by which — anything pointing BACKWARD or AROUND. There are several other rules layered on top, which we'll separate into the next two lessons. Today: lock in the core forward-vs-backward intuition.",
    sentences: [
      {
        spanish: "Este regalo es para ti.",
        english: "This gift is for you.",
        pronunciation: "EHS-teh rreh-GAH-loh ehs PAH-rah tee",
        pronunciation_focus: [
          "PARA + recipient — the gift is destined FOR you",
        ],
        note:
          "Recipient = para. Anytime 'for X' means 'X is the destination/recipient', it's para. 'Para mi madre', 'para el profesor', 'para los niños'.",
      },
      {
        spanish: "Gracias por el regalo.",
        english: "Thanks for the gift.",
        pronunciation: "GRAH-syahs por ehl rreh-GAH-loh",
        pronunciation_focus: [
          "POR + cause — thanks BECAUSE OF the gift",
        ],
        note:
          "Cause/reason = por. 'Thanks for X' = 'thanks because-of X' = gracias por X. This is one of the cleanest por/para contrasts in the language: same speaker, same gift, two prepositions depending on direction.",
      },
      {
        spanish: "Salimos para Madrid mañana.",
        english: "We're leaving for Madrid tomorrow.",
        pronunciation: "sah-LEE-mohs PAH-rah mah-DREED mah-NYAH-nah",
        pronunciation_focus: [
          "PARA + destination — Madrid is where we're heading",
        ],
        note:
          "Destination = para. 'I'm leaving for Madrid' = 'I'm leaving toward Madrid as a goal'. With movement verbs, para = where you're aiming.",
      },
      {
        spanish: "Pasé por Madrid de camino a Barcelona.",
        english: "I passed through Madrid on the way to Barcelona.",
        pronunciation: "pah-SEH por mah-DREED deh kah-MEE-noh ah bar-seh-LOH-nah",
        pronunciation_focus: [
          "POR + route — Madrid is along the way, not the destination",
        ],
        note:
          "Route/passage = por. 'Through', 'along', 'via' — when the place isn't the destination but you went through it, that's por. 'Caminar por el parque', 'viajar por Europa'.",
      },
      {
        spanish: "Estudio español para hablar con mi familia.",
        english: "I study Spanish to talk with my family.",
        pronunciation: "ehs-TOO-dyoh ehs-pah-NYOL PAH-rah ah-BLAR kohn mee fah-MEE-lyah",
        pronunciation_focus: [
          "PARA + infinitive — purpose / goal",
        ],
        note:
          "Purpose = para. 'In order to X' = para + infinitive. The clearest English-to-Spanish mapping: any sentence where you can substitute 'in order to', you use para.",
      },
    ],
    vocabulary: [
      { cell_id: "ad1466be-2387-4dd4-b4c3-5f3f4819dab9", word: "para", english: "for / to / toward (forward: destination, recipient, goal, deadline)", pronunciation: "PAH-rah", part_of_speech: "preposition" },
      { cell_id: "15078ae0-4aff-430d-b39c-383c4a0c8ccd", word: "por", english: "for / through / by / because of (backward/around: cause, route, exchange, means, duration)", pronunciation: "por", part_of_speech: "preposition" },
      { cell_id: "e42418b4-e93a-41db-b4dd-df5718d8a7f7", word: "el regalo", english: "the gift / present", pronunciation: "ehl rreh-GAH-loh", part_of_speech: "noun", gender: "m" },
      { cell_id: "b9377e60-005b-4b17-8a5d-888a3a5871c7", word: "salir para", english: "to leave for (a destination)", pronunciation: "sah-LEER PAH-rah", part_of_speech: "phrase" },
      { cell_id: "65f1e038-00d5-4d10-b1eb-d059d537219d", word: "pasar por", english: "to pass through / by", pronunciation: "pah-SAR por", part_of_speech: "phrase" },
      { cell_id: "02b976a3-743c-4c15-bf5d-5d4a02bd0d8f", word: "estudiar", english: "to study", pronunciation: "ehs-too-DYAR", part_of_speech: "verb" },
      { cell_id: "0e572936-abf3-417f-ab81-8c6fe3fb3322", word: "el camino", english: "the way / road / path", pronunciation: "ehl kah-MEE-noh", part_of_speech: "noun", gender: "m" },
      { cell_id: "dbe1c0bb-0dec-473d-8971-1a3aa98fe2d7", word: "gracias por", english: "thanks for (always por for thanks)", pronunciation: "GRAH-syahs por", part_of_speech: "phrase" },
      { cell_id: "0e5d4e1a-0402-4eb0-b4c1-e1178050b84b", word: "para + infinitive", english: "in order to (purpose construction)", pronunciation: "PAH-rah", part_of_speech: "phrase" },
      { cell_id: "6e6c7785-2512-4e24-bbcd-f6da74d4eed5", word: "la familia", english: "the family", pronunciation: "lah fah-MEE-lyah", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "Para = forward (destination, recipient, goal, deadline)",
        explanation:
          "Use para when the object of the preposition is the END POINT of something — where the action is heading, who receives it, when it must be done by, what it's for. Para mi madre (recipient), para Madrid (destination), para el viernes (deadline), para aprender (goal). The mental test: am I pointing FORWARD or AT a target? Then para.",
        examples: [
          { spanish: "El paquete es para María.", english: "The package is for María. (recipient)" },
          { spanish: "Necesito el informe para el lunes.", english: "I need the report by Monday. (deadline)" },
        ],
      },
      {
        point: "Por = backward or around (cause, route, exchange, means, duration)",
        explanation:
          "Use por when the object of the preposition is the SOURCE or CIRCUMSTANCE — what caused it, what was exchanged, what route was taken, what means was used, how long it lasted. Por la lluvia (cause), por el parque (route), por veinte euros (exchange), por correo (means), por una hora (duration). The mental test: am I pointing BACKWARD to a reason or describing a path? Then por.",
        examples: [
          { spanish: "Lo hago por ti.", english: "I'm doing it for you. (i.e. because of / for your sake)" },
          { spanish: "Compré el coche por 10.000 euros.", english: "I bought the car for 10,000 euros. (exchange)" },
        ],
      },
      {
        point: "The mnemonic that actually works",
        explanation:
          "DEAD CAT mnemonics ('Destination, Exchange, Authorship, Deadline / Cause, Around, Time') overload your memory. Better: feel the DIRECTION. Para points where something is GOING (forward arrow →). Por points where something CAME FROM or what it PASSED THROUGH (backward or circular arrow ↻). Most ambiguous cases resolve by asking 'forward or backward?'. The remaining 10% are fixed expressions to memorize.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Por or para? Use the forward-vs-backward test.",
        items: [
          { prompt: "Estas flores son ___ mi esposa.", answer: "para" },
          { prompt: "Gracias ___ tu ayuda.", answer: "por" },
          { prompt: "Mañana salimos ___ Buenos Aires.", answer: "para" },
          { prompt: "Caminamos ___ el centro durante una hora.", answer: "por" },
          { prompt: "Necesito el documento ___ el viernes.", answer: "para" },
        ],
      },
    ],
    cultural_note:
      "Asking a native speaker WHY a given sentence uses por vs para usually produces a frustrated shrug and 'pues… es así'. Native speakers don't decide; they feel it. The fastest path to feeling it yourself is high-volume input — read Spanish news headlines (where prepositions are dense) and TRACK the por/para choices for ten minutes a day. Within a couple of weeks the patterns become intuitive in a way no rule-based study ever delivers.",
    tip:
      "Build a por/para journal. Every time you read a Spanish sentence with por or para, write it down with a one-word tag: cause, recipient, destination, route, deadline, exchange, duration. After 50 examples (about a week of casual reading), patterns emerge that no rule list captures. This is the single most efficient way to internalize por vs para — direct exposure with light tagging.",
  },

  // ── 13. por_vs_para — spanish_por_para_time ──────────────────────────────
  {
    id: "spanish_por_para_time",
    level: "B1",
    category: "por_vs_para",
    title: "Por vs para — time uses (duration, deadline, parts of day)",
    subtitle: "Por la mañana vs para mañana. The two phrases that catch every learner.",
    intro:
      "Time is where por and para confuse English speakers most, because English uses 'for' and 'in' inconsistently. POR marks DURATION ('for two hours') and APPROXIMATE TIME ('around three'). PARA marks a DEADLINE ('by Friday') and a SCHEDULED TARGET ('for tomorrow'). And the two parts-of-day phrases — 'por la mañana' (in the morning) vs 'para mañana' (by/for tomorrow) — sound nearly identical and mean completely different things. Lock these in.",
    sentences: [
      {
        spanish: "Estudié español por dos horas.",
        english: "I studied Spanish for two hours.",
        pronunciation: "ehs-too-DYEH ehs-pah-NYOL por dohs OH-rahs",
        pronunciation_focus: [
          "POR + duration — how long the action lasted",
        ],
        note:
          "Duration = por. 'For two hours' = por dos horas. Spaniards sometimes drop the preposition entirely ('estudié dos horas') but never substitute para. LatAm tends to keep the por.",
      },
      {
        spanish: "Necesito el informe para el viernes.",
        english: "I need the report by/for Friday.",
        pronunciation: "neh-seh-SEE-toh ehl een-FOR-meh PAH-rah ehl BYEHR-nehs",
        pronunciation_focus: [
          "PARA + deadline — the date BY WHICH something must be done",
        ],
        note:
          "Deadline = para. 'By Friday' / 'for Friday' (as a target) = para el viernes. Equivalent to 'on or before Friday'.",
      },
      {
        spanish: "Voy al gimnasio por la mañana.",
        english: "I go to the gym in the morning.",
        pronunciation: "boy ahl heem-NAH-syoh por lah mah-NYAH-nah",
        pronunciation_focus: [
          "POR + parts of the day — when during the day (Spain default)",
          "LatAm often substitutes 'en la mañana' here — both correct, regional preference",
        ],
        note:
          "Parts of the day: por la mañana, por la tarde, por la noche (Spain). LatAm uses 'en la mañana / en la tarde / en la noche' equally. Mexico in particular favors 'en' over 'por'.",
      },
      {
        spanish: "El proyecto es para mañana.",
        english: "The project is for / due tomorrow.",
        pronunciation: "ehl proh-YEHK-toh ehs PAH-rah mah-NYAH-nah",
        pronunciation_focus: [
          "PARA + future date — when something is scheduled or due",
          "Contrast with 'por la mañana' (in the morning) — phonetically close, completely different meaning",
        ],
        note:
          "Para mañana = for tomorrow / due tomorrow. Por la mañana = in the morning. The two phrases sound nearly identical and confuse beginners every time. Drill the contrast.",
      },
      {
        spanish: "Te llamo por la tarde, sobre las cinco.",
        english: "I'll call you in the afternoon, around five.",
        pronunciation: "teh YAH-moh por lah TAR-deh, SOH-breh lahs SEEN-koh",
        pronunciation_focus: [
          "POR + approximate time of day — 'in the afternoon-ish'",
          "'sobre las cinco' = around five (also approximate time)",
        ],
        note:
          "When you're being vague about time of day, por does the work. 'Te llamo por la tarde' is non-specific; 'te llamo a las cinco' is specific.",
      },
    ],
    vocabulary: [
      { cell_id: "eaf2fb3b-c83c-450d-a2dc-a55460d80796", word: "por dos horas / durante dos horas", english: "for two hours (duration — both forms work, durante is more LatAm)", pronunciation: "por dohs OH-rahs / doo-RAHN-teh dohs OH-rahs", part_of_speech: "phrase" },
      { cell_id: "c20e4db9-8286-4def-9cb4-a50103139cb7", word: "para el viernes", english: "by/for Friday (deadline)", pronunciation: "PAH-rah ehl BYEHR-nehs", part_of_speech: "phrase" },
      { cell_id: "69aee367-7c8f-4866-8219-e75c3a673375", word: "por la mañana", english: "in the morning (Spain default; LatAm often: en la mañana)", pronunciation: "por lah mah-NYAH-nah", part_of_speech: "phrase" },
      { cell_id: "fe8e99aa-f470-4729-8e0f-bbe6fc167dfb", word: "por la tarde", english: "in the afternoon", pronunciation: "por lah TAR-deh", part_of_speech: "phrase" },
      { cell_id: "84f903be-9829-4fb6-a605-8218fcd3192e", word: "por la noche", english: "at night", pronunciation: "por lah NOH-cheh", part_of_speech: "phrase" },
      { cell_id: "bd266a6a-981c-4ade-b912-8672e6fad504", word: "para mañana", english: "by/for tomorrow (deadline)", pronunciation: "PAH-rah mah-NYAH-nah", part_of_speech: "phrase" },
      { cell_id: "31610672-6d24-4c5b-a62b-48d9bb4f8eea", word: "el informe", english: "the report", pronunciation: "ehl een-FOR-meh", part_of_speech: "noun", gender: "m" },
      { cell_id: "429afd83-af14-4a9b-ae29-8e8329a41f1c", word: "el proyecto", english: "the project", pronunciation: "ehl proh-YEHK-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "48f5d877-e7fd-400f-891c-dde2642e9fe2", word: "sobre", english: "around (approximate time)", pronunciation: "SOH-breh", part_of_speech: "preposition" },
      { cell_id: "1f177fec-d258-4c9b-b979-af99b4c01ac3", word: "necesitar", english: "to need", pronunciation: "neh-seh-see-TAR", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Duration vs deadline — the cleanest split",
        explanation:
          "Spanish makes a hard distinction between HOW LONG something lasted (duration → por) and BY WHEN something must be done (deadline → para). 'Trabajé por tres horas' = I worked for three hours. 'Necesito esto para el lunes' = I need this by Monday. These never mix up once you separate the two questions. 'For' in English is genuinely ambiguous; Spanish forces clarity.",
        examples: [
          { spanish: "Viví en México por cinco años.", english: "I lived in Mexico for five years. (duration)" },
          { spanish: "El examen es para el viernes.", english: "The exam is for Friday. (deadline)" },
        ],
      },
      {
        point: "Por la mañana vs para mañana",
        explanation:
          "Two phrases. Same words almost. Different meanings entirely. 'Por la mañana' = in the morning (a recurring or current part of today). 'Para mañana' = by tomorrow (a deadline). Drill these as a pair. Spaniards often use 'esta mañana' / 'esta tarde' / 'esta noche' for 'this morning/afternoon/tonight' to disambiguate. LatAm same.",
        examples: [
          { spanish: "Por la mañana hago ejercicio.", english: "In the morning I exercise. (habit)" },
          { spanish: "Para mañana tengo que terminar esto.", english: "By tomorrow I have to finish this. (deadline)" },
        ],
      },
      {
        point: "Approximate time — por",
        explanation:
          "Vague time-of-day references use por: 'por la tarde' (sometime in the afternoon), 'por entonces' (around that time), 'por aquellos años' (around those years). Para never means 'around' or 'approximately'. If you want 'approximately' for a specific clock time, use 'sobre' or 'a eso de': 'sobre las cinco' / 'a eso de las cinco' (around five o'clock).",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Por or para? Watch for duration (por) vs deadline (para) and morning-phrase contrasts.",
        items: [
          { prompt: "Tengo que entregar el trabajo ___ el lunes.", answer: "para" },
          { prompt: "Estudié ___ tres horas anoche.", answer: "por" },
          { prompt: "Hago ejercicio ___ la mañana.", answer: "por" },
          { prompt: "El informe es ___ mañana, no puedo esperar.", answer: "para" },
          { prompt: "Te llamo ___ la noche cuando llegue a casa.", answer: "por" },
        ],
      },
    ],
    cultural_note:
      "In Spanish offices, deadlines are stated with para — 'para el lunes', 'para final de mes', 'para antes de las cinco'. If a boss says 'lo necesito para hoy', that means it must land in their inbox today, not at some point during the day. Spaniards in particular use 'antes de' (before) for harder deadlines: 'antes del lunes' is firmer than 'para el lunes'. Listen for which preposition your boss uses — it tells you how seriously to take the date.",
    tip:
      "Build the morning/tomorrow contrast as a single drill. Write five sentences with 'por la mañana' (in the morning — habit) and five with 'para mañana' (by tomorrow — deadline). After ten sentences, the phonetic similarity stops fooling you. This is the single biggest por/para distinction English speakers get wrong at B1.",
  },

  // ── 14. por_vs_para — spanish_por_para_purpose_cause ─────────────────────
  {
    id: "spanish_por_para_purpose_cause",
    level: "B1",
    category: "por_vs_para",
    title: "Por vs para — purpose vs cause",
    subtitle: "What you're doing it FOR (para) vs why it's happening (por).",
    intro:
      "The most slippery por/para distinction at B1 is PURPOSE (para) versus CAUSE (por). They sound similar in English — both can be 'because of' or 'for' — but Spanish keeps them separate. PARA + infinitive = purpose ('in order to'). POR + infinitive or POR + noun = cause/reason ('because of'). When you're explaining WHY something happens, ask: am I describing the GOAL it points to, or the REASON it came from?",
    sentences: [
      {
        spanish: "Trabajo para ganar dinero.",
        english: "I work in order to earn money.",
        pronunciation: "trah-BAH-hoh PAH-rah gah-NAR dee-NEH-roh",
        pronunciation_focus: [
          "PARA + infinitive — the GOAL of working",
        ],
        note:
          "Para + infinitive = 'in order to' = purpose. The earning is what you're aiming at. This is the cleanest 'in order to' construction in Spanish.",
      },
      {
        spanish: "Trabajo por necesidad, no por gusto.",
        english: "I work out of necessity, not for fun.",
        pronunciation: "trah-BAH-hoh por neh-seh-see-DAHD, noh por GOOS-toh",
        pronunciation_focus: [
          "POR + noun — the REASON / CAUSE for working",
        ],
        note:
          "Por + noun (or por + infinitive in some cases) = 'because of' / 'out of' / 'due to'. The cause comes BEHIND the action — necesidad is what's pushing you, not pulling you.",
      },
      {
        spanish: "Me castigaron por llegar tarde.",
        english: "They punished me for arriving late.",
        pronunciation: "meh kahs-tee-GAH-rohn por yeh-GAR TAR-deh",
        pronunciation_focus: [
          "POR + infinitive — the REASON I was punished",
        ],
        note:
          "Por + infinitive can also mean 'for (having done)' — a past cause. 'Me castigaron por llegar tarde' = they punished me because I arrived late. Cause, not purpose.",
      },
      {
        spanish: "Estudio mucho para sacar buenas notas.",
        english: "I study a lot in order to get good grades.",
        pronunciation: "ehs-TOO-dyoh MOO-choh PAH-rah sah-KAR BWEH-nahs NOH-tahs",
        pronunciation_focus: [
          "PARA + infinitive — purpose / goal",
        ],
        note:
          "Para + infinitive = the goal of the studying. 'Sacar buenas notas' is the destination the studying is pointed at.",
      },
      {
        spanish: "No fui a la fiesta por estar enfermo.",
        english: "I didn't go to the party because I was sick.",
        pronunciation: "noh fwee ah lah FYEHS-tah por ehs-TAR ehn-FEHR-moh",
        pronunciation_focus: [
          "POR + infinitive — the REASON for not going",
        ],
        note:
          "Por + estar enfermo = because of being sick. Used for past cause. Spanish often uses 'por + infinitive' for compact explanations where English would use a 'because' clause.",
      },
    ],
    vocabulary: [
      { cell_id: "75ffebe2-10a3-42d2-b092-540d07ea32ad", word: "ganar", english: "to earn / win", pronunciation: "gah-NAR", part_of_speech: "verb" },
      { cell_id: "63e721f7-79f0-46ba-ab38-991572744d93", word: "el dinero", english: "the money", pronunciation: "ehl dee-NEH-roh", part_of_speech: "noun", gender: "m" },
      { cell_id: "7bed25ae-8a59-4daa-a0c9-b54edaf8d2b6", word: "la necesidad", english: "the necessity / need", pronunciation: "lah neh-seh-see-DAHD", part_of_speech: "noun", gender: "f" },
      { cell_id: "a405fa57-3394-43fb-b323-28943fc8a084", word: "el gusto", english: "the taste / pleasure", pronunciation: "ehl GOOS-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "4931dee0-0950-4497-a713-c14fd3d2a5be", word: "castigar", english: "to punish (-gar spelling change in yo preterite)", pronunciation: "kahs-tee-GAR", part_of_speech: "verb" },
      { cell_id: "d55407db-3b45-45ff-952b-801fb7ac0d49", word: "sacar", english: "to get / take out (-car spelling change)", pronunciation: "sah-KAR", part_of_speech: "verb" },
      { cell_id: "2d9dfd4b-d61a-4c1c-90ea-444251287a93", word: "la nota", english: "the grade / note", pronunciation: "lah NOH-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "a3b2f0e2-6780-4da7-9442-87f659b963b0", word: "enfermo / enferma", english: "sick / ill", pronunciation: "ehn-FEHR-moh / ehn-FEHR-mah", part_of_speech: "adjective" },
      { cell_id: "977d849c-98c9-4f8c-943f-13ed523d1a85", word: "por eso", english: "that's why / for that reason", pronunciation: "por EH-soh", part_of_speech: "phrase" },
      { cell_id: "34ec92a8-ce49-478c-b5cc-0f0922e4a02d", word: "para que", english: "in order that / so that (always followed by subjunctive)", pronunciation: "PAH-rah keh", part_of_speech: "conjunction" },
    ],
    grammar: [
      {
        point: "Para + infinitive = purpose",
        explanation:
          "Para followed directly by an infinitive answers 'what for?' / 'in order to do what?'. 'Llamé para preguntarte algo' (I called in order to ask you something). The infinitive after para names the purpose, the goal you're aiming at. Note: there's NO 'que' in this construction when subjects are the same.",
        examples: [
          { spanish: "Vine para verte.", english: "I came to see you." },
          { spanish: "Estudio para ser médico.", english: "I study to become a doctor." },
        ],
      },
      {
        point: "Por + infinitive = reason / cause",
        explanation:
          "Por followed by an infinitive answers 'because of doing what?' or 'for what action?'. 'Me multaron por aparcar mal' (they fined me for parking badly). Here the infinitive names the cause — the past action that produced the consequence. The English giveaway: if you can substitute 'because (of) ___ing', use por.",
        examples: [
          { spanish: "Te lo digo por ayudarte.", english: "I'm telling you because I want to help you." },
          { spanish: "Lo despidieron por no trabajar bien.", english: "They fired him for not working well." },
        ],
      },
      {
        point: "Para que + subjunctive (two-subject purpose)",
        explanation:
          "When the purpose involves a DIFFERENT subject, you can't use the infinitive — you need para que + SUBJUNCTIVE. 'Te lo digo para que lo sepas' (I'm telling you so that you know). Same subject would be 'te lo digo para saberlo yo' (which makes no sense here; that's the point of para que). Para que is the two-subject purpose construction — and yes, that's another subjunctive trigger to file alongside volition/emotion/doubt.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Por or para? Purpose (para) vs cause (por).",
        items: [
          { prompt: "Vine ___ verte, no para hablar de trabajo.", answer: "para" },
          { prompt: "Lo hago ___ ti, no por mí mismo.", answer: "por" },
          { prompt: "Estudio mucho ___ aprobar el examen.", answer: "para" },
          { prompt: "Me dieron una multa ___ ir muy rápido.", answer: "por" },
          { prompt: "Te llamo ___ que sepas la verdad.", answer: "para" },
        ],
      },
    ],
    cultural_note:
      "The 'por que / porque / por qué / porqué' family confuses learners because all four exist and mean different things. 'Porque' (one word, no accent) = because. '¿Por qué?' (two words, accented) = why? 'El porqué' (one word, accented, with article) = the reason. 'Por que' (two words, no accent) is rare — used when 'por' is required by a preceding verb and 'que' starts a subordinate clause. For B1, you mainly need the first two: '¿por qué?' to ask, 'porque' to answer. Memorize that pair and you'll handle 99% of usage.",
    tip:
      "Write five sentences answering '¿por qué…?' questions using BOTH constructions: 'porque + clause' AND 'por + infinitive'. For example: ¿Por qué estudias español? Porque quiero hablar con mi familia. / Por hablar con mi familia. Both are valid; the second is more compact and characteristically Spanish. Train both and you'll have more flexibility in spoken response.",
  },

  // ── 15. travel — spanish_travel_hotel ─────────────────────────────────────
  {
    id: "spanish_travel_hotel",
    level: "B1",
    category: "travel",
    title: "Hotel check-in — vocabulary and the polite-register defaults",
    subtitle: "Tengo una reserva. ¿Podría darme una habitación con vistas?",
    intro:
      "Hotel check-in is where B1 grammar and politeness register show up in the wild. You'll need conditional (me gustaría, podría), the future (subiré, llegarán), and a small vocabulary stack — reservation, room types, floors, breakfast, key. The dialogue below is the standard script. Practice it cold and you'll be able to check into any hotel in Spain or LatAm without fumbling.",
    sentences: [
      {
        spanish: "Buenas tardes, tengo una reserva a nombre de Smith.",
        english: "Good afternoon, I have a reservation under the name Smith.",
        pronunciation: "BWEH-nahs TAR-dehs, TEHN-goh OO-nah rreh-SEHR-bah ah NOHM-breh deh smeeth",
        pronunciation_focus: [
          "'a nombre de' = under the name of (fixed expression for reservations)",
        ],
        note:
          "Standard opening line. Greet by time of day, then state the reservation. Don't introduce yourself by name first — Spanish prefers the reservation-first opening.",
      },
      {
        spanish: "¿Me podría dar una habitación con vistas al mar?",
        english: "Could you give me a room with a sea view?",
        pronunciation: "meh poh-DREE-ah dahr OO-nah ah-bee-tah-SYOHN kohn BEES-tahs ahl mahr",
        pronunciation_focus: [
          "'me podría dar' — conditional of poder + indirect object, the polite request frame",
          "'con vistas a' = with views of (fixed phrase, vistas is always plural in this construction)",
        ],
        note:
          "Conditional 'podría' softens the request — much more natural than 'me puede dar'. Use conditional for any hotel/restaurant interaction by default.",
      },
      {
        spanish: "¿A qué hora es el desayuno y dónde se sirve?",
        english: "What time is breakfast and where is it served?",
        pronunciation: "ah keh OH-rah ehs ehl deh-sah-YOO-noh ee DOHN-deh seh SEER-beh",
        pronunciation_focus: [
          "'se sirve' = is served (passive 'se' — common construction for services)",
          "'desayuno' stressed on -YOO-",
        ],
        note:
          "The 'se sirve' construction is everywhere in hospitality. Compare 'se sirve a las ocho' (it's served at eight) — Spanish prefers the impersonal/passive 'se' for services and rules.",
      },
      {
        spanish: "¿Cuándo tengo que dejar la habitación?",
        english: "When do I have to check out?",
        pronunciation: "KWAHN-doh TEHN-goh keh deh-HAR lah ah-bee-tah-SYOHN",
        pronunciation_focus: [
          "'dejar la habitación' = leave the room = check out (Spanish doesn't use 'check out' as a verb)",
        ],
        note:
          "Spanish doesn't borrow 'check-in / check-out' as verbs in everyday speech. 'Entrar' or 'registrarse' for check-in; 'dejar la habitación' or 'hacer el check-out' (loanword, hotel jargon) for check-out.",
      },
      {
        spanish: "¿Podría ayudarme a llamar un taxi para mañana?",
        english: "Could you help me call a taxi for tomorrow?",
        pronunciation: "poh-DREE-ah ah-yoo-DAR-meh ah yah-MAR oon TAHK-see PAH-rah mah-NYAH-nah",
        pronunciation_focus: [
          "'ayudar a + infinitive' — ayudar always takes 'a' before an infinitive",
          "'para mañana' (deadline/scheduled time) — not 'por mañana'",
        ],
        note:
          "Hotel staff handle taxis routinely. 'Para mañana' (for tomorrow — scheduled time, deadline use of para). Compare to 'por la mañana' (in the morning).",
      },
    ],
    vocabulary: [
      { cell_id: "cf02c3d6-f81f-41c9-9f22-4b82eb6184f4", word: "la reserva", english: "the reservation (general / Spain)", pronunciation: "lah rreh-SEHR-bah", part_of_speech: "noun", gender: "f" },
      { cell_id: "82b83617-75aa-4386-b93f-fd1f46120562", word: "la habitación", english: "the (hotel) room", pronunciation: "lah ah-bee-tah-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "23e651da-b072-4960-94f5-13ab17eee029", word: "el desayuno", english: "the breakfast", pronunciation: "ehl deh-sah-YOO-noh", part_of_speech: "noun", gender: "m" },
      { cell_id: "2c947916-72e0-4b96-93c9-c25ef6b136cb", word: "la llave", english: "the key", pronunciation: "lah YAH-beh", part_of_speech: "noun", gender: "f" },
      { cell_id: "8e905d9e-e1f5-4886-b231-e6602148cdd9", word: "el ascensor", english: "the elevator (Spain, most LatAm)", pronunciation: "ehl ah-sehn-SOR", part_of_speech: "noun", gender: "m" },
      { cell_id: "40e2685e-d4dd-4ede-80f3-0dbf4dd785bd", word: "la planta", english: "the floor (level) — Spain default; LatAm often: el piso", pronunciation: "lah PLAHN-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "ce1d2bda-da39-4293-851c-e29ef125e219", word: "con vistas a", english: "with views of (always plural 'vistas')", pronunciation: "kohn BEES-tahs ah", part_of_speech: "phrase" },
      { cell_id: "784f6513-8119-4046-8b0d-8dd86e02af99", word: "el aire acondicionado", english: "air conditioning", pronunciation: "ehl AH-ee-reh ah-kohn-dee-syoh-NAH-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "8ffd4890-f62d-48c3-891a-a837a2652424", word: "el wifi", english: "the wifi (la contraseña = the password)", pronunciation: "ehl WEE-fee", part_of_speech: "noun", gender: "m" },
      { cell_id: "21b5e03a-2bd0-4621-a8ee-f3e50f7a67aa", word: "el documento de identidad", english: "the ID (required at check-in by law in Spain)", pronunciation: "ehl doh-koo-MEHN-toh deh ee-dehn-tee-DAHD", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "The polite conditional defaults for hotel interactions",
        explanation:
          "In hotels and restaurants, the default register is conditional + usted (in Spain) or conditional + tú or usted (LatAm, varies by country and class). 'Me podría dar', 'me gustaría', '¿sería posible…?', '¿podríamos…?'. Drop into present-tense ('me da', 'quiero') and you sound brusque. The conditional adds two syllables and a degree of polish that pays back instantly.",
      },
      {
        point: "Passive se for hotel services",
        explanation:
          "Spanish hospitality language is full of 'passive se' — '¿A qué hora se sirve el desayuno?' (When is breakfast served?), 'Se admiten mascotas' (Pets allowed), 'Se ruega no fumar' (Please don't smoke). The structure is se + 3rd-person verb, no agent expressed. Listen for it on signs and in menus; you'll see it constantly.",
      },
    ],
    dialogue: [
      { cell_id: "7952e272-c974-4590-875a-28df02b9daf7", speaker: "Recepcionista", spanish: "Buenas tardes, ¿en qué puedo ayudarle?", english: "Good afternoon, how can I help you?", pronunciation: "BWEH-nahs TAR-dehs, ehn keh PWEH-doh ah-yoo-DAR-leh", register: "formal" },
      { cell_id: "1a4bf3b6-cd88-4b40-a2b4-8de7dbdc5957", speaker: "Cliente", spanish: "Buenas tardes. Tengo una reserva a nombre de López.", english: "Good afternoon. I have a reservation under the name López.", pronunciation: "BWEH-nahs TAR-dehs. TEHN-goh OO-nah rreh-SEHR-bah ah NOHM-breh deh LOH-pehs", register: "formal" },
      { cell_id: "880ae756-989f-4f8a-8054-b3d3b1de77bc", speaker: "Recepcionista", spanish: "Perfecto. Su documento de identidad, por favor.", english: "Perfect. Your ID, please.", pronunciation: "pehr-FEHK-toh. soo doh-koo-MEHN-toh deh ee-dehn-tee-DAHD, por fah-BOR", register: "formal" },
      { cell_id: "a2acc0a7-617d-4d2b-aa10-f6c29aca7cce", speaker: "Cliente", spanish: "Aquí lo tiene. ¿A qué hora es el desayuno?", english: "Here you go. What time is breakfast?", pronunciation: "ah-KEE loh TYEH-neh. ah keh OH-rah ehs ehl deh-sah-YOO-noh", register: "formal" },
      { cell_id: "e53a6240-972f-4ce6-9f16-34a64a468736", speaker: "Recepcionista", spanish: "De siete a diez, en el comedor de la planta baja.", english: "From seven to ten, in the dining room on the ground floor.", pronunciation: "deh SYEH-teh ah DYEHS, ehn ehl koh-meh-DOR deh lah PLAHN-tah BAH-hah", register: "formal" },
      { cell_id: "ecea9e88-208c-49b9-a85c-be66ecea9bd2", speaker: "Cliente", spanish: "Muy bien. ¿Me podría dar la llave del wifi también?", english: "Great. Could you also give me the wifi key?", pronunciation: "MOO-ee byehn. meh poh-DREE-ah dahr lah YAH-beh dehl WEE-fee tahm-BYEHN", register: "formal" },
    ],
    cultural_note:
      "Hotels in Spain (and most of the EU) are LEGALLY REQUIRED to register guests' ID information with the police within 24 hours of check-in. This is why every Spanish hotel asks for your passport even if you've already shown it during the reservation — it's not bureaucratic theater, it's law (the 'parte de viajeros' rule). Don't be surprised; just have your passport ready. LatAm hotels generally ask for ID too but the legal framework varies country to country.",
    tip:
      "Memorize ONE check-in script and rehearse it cold: greeting → reservation → ID handover → ask about breakfast → ask about wifi. Five lines. If you can deliver those five lines smoothly, you'll handle any Spanish-speaking hotel without stress, and the receptionist will speak to you in normal-paced Spanish instead of slowing down to learner-mode.",
    regional_variants: [
      { meaning: "reservation", peninsular: "reserva", latam: "reserva (most) / reservación (Mexico, occasional Argentina)", note: "Reserva is universal; reservación is a regional variant, mostly Mexican." },
      { meaning: "elevator", peninsular: "ascensor", latam: "elevador (Mexico) / ascensor (most other LatAm)", note: "In Mexico hotels you'll see and hear 'elevador' more than 'ascensor'." },
    ],
  },

  // ── 16. travel — spanish_travel_complaints ────────────────────────────────
  {
    id: "spanish_travel_complaints",
    level: "B1",
    category: "travel",
    title: "Travel problems — complaints, refunds, and the hoja de reclamaciones",
    subtitle: "How to escalate politely in Spain (and what NOT to ask for unless you mean it).",
    intro:
      "When something goes wrong while traveling — late flight, broken AC, wrong room — Spanish has a complaint register that escalates step by step. Start with 'hay un problema con…' and 'me gustaría…'. Move to 'esto es inaceptable' / 'esperaba algo mejor' if the issue isn't resolved. The nuclear option in Spain is 'una hoja de reclamaciones' — the official complaints form every business must provide by law. Asking for it is a real escalation; don't bluff with it unless you actually intend to file.",
    sentences: [
      {
        spanish: "Disculpe, hay un problema con la habitación. No funciona el aire acondicionado.",
        english: "Excuse me, there's a problem with the room. The air conditioning isn't working.",
        pronunciation: "dees-KOOL-peh, AH-ee oon proh-BLEH-mah kohn lah ah-bee-tah-SYOHN. noh foon-SYOH-nah ehl AH-ee-reh ah-kohn-dee-syoh-NAH-doh",
        pronunciation_focus: [
          "'no funciona' = doesn't work (use for broken appliances/services, not for people)",
        ],
        note:
          "Open with 'disculpe' (excuse me, formal) and a calm statement of the problem. This is the gentle opener — leaves room for the staff to fix it without anyone losing face.",
      },
      {
        spanish: "Me gustaría hablar con el gerente, por favor.",
        english: "I'd like to speak with the manager, please.",
        pronunciation: "meh goos-tah-REE-ah ah-BLAR kohn ehl heh-REHN-teh, por fah-BOR",
        pronunciation_focus: [
          "'me gustaría' — conditional, more polite than 'quiero'",
          "'el gerente' = manager (general); 'el encargado' = person in charge (slightly less formal)",
        ],
        note:
          "Step 2 escalation. 'Me gustaría hablar con el gerente' is firm but polite. Don't say 'quiero hablar con el gerente' — too aggressive in Spain, will close down the conversation.",
      },
      {
        spanish: "Esperaba un servicio mejor, francamente.",
        english: "I was expecting better service, frankly.",
        pronunciation: "ehs-peh-RAH-bah oon sehr-BEE-syoh meh-HOR, frahn-kah-MEHN-teh",
        pronunciation_focus: [
          "'esperaba' = imperfect of esperar — was expecting / used to expect",
          "Imperfect signals that the expectation has been continuously held and is now disappointed",
        ],
        note:
          "Imperfect 'esperaba' is the polite way to express disappointment. 'Espero' (present) is too neutral; 'esperaba' communicates ongoing expectation that has now been let down. Subtle but very Spanish.",
      },
      {
        spanish: "¿Podría darme una hoja de reclamaciones, por favor?",
        english: "Could you give me an official complaints form, please?",
        pronunciation: "poh-DREE-ah DAR-meh OO-nah OH-hah deh rreh-klah-mah-SYOH-nehs, por fah-BOR",
        pronunciation_focus: [
          "'hoja de reclamaciones' — the official paper-trail complaint, mandatory in Spain",
          "Asking for it is a SERIOUS escalation move",
        ],
        note:
          "This is the nuclear option in Spain. Every business is legally required to have these forms on premises; asking for one means you intend to file a complaint with consumer-protection authorities. Don't ask unless you truly mean it.",
      },
      {
        spanish: "Quiero un reembolso completo por las molestias.",
        english: "I want a full refund for the inconvenience.",
        pronunciation: "KYEH-roh oon rreh-ehm-BOL-soh kohm-PLEH-toh por lahs moh-LEHS-tyahs",
        pronunciation_focus: [
          "'reembolso' = refund / repayment",
          "'molestias' = inconvenience (plural — like 'troubles' in English)",
        ],
        note:
          "'Por las molestias' is the fixed phrase for compensation requests. Use 'quiero' here (not conditional) — at this stage you're being firm, not polite. Conditional would undermine the demand.",
      },
    ],
    vocabulary: [
      { cell_id: "8c19f7d1-7020-4a94-a970-5035507a620d", word: "el problema", english: "the problem", pronunciation: "ehl proh-BLEH-mah", part_of_speech: "noun", gender: "m" },
      { cell_id: "f9364538-0cd7-4c8f-862f-50039df109ac", word: "funcionar", english: "to work / function (for things, not people)", pronunciation: "foon-syoh-NAR", part_of_speech: "verb" },
      { cell_id: "535286a7-e7f1-4489-b1c4-79cfdb612752", word: "el gerente / la gerente", english: "the manager", pronunciation: "ehl heh-REHN-teh", part_of_speech: "noun", gender: "mf" },
      { cell_id: "45f4ce32-b0bc-488d-ac5d-118e33af7c03", word: "el encargado / la encargada", english: "the person in charge", pronunciation: "ehl ehn-kar-GAH-doh", part_of_speech: "noun", gender: "mf" },
      { cell_id: "450b85b5-02cd-4f3c-81fc-4a55d3735139", word: "la hoja de reclamaciones", english: "official complaints form (Spain — legally required)", pronunciation: "lah OH-hah deh rreh-klah-mah-SYOH-nehs", part_of_speech: "noun", gender: "f" },
      { cell_id: "300d30dc-c4ce-4c21-adbc-3b9e85599256", word: "el reembolso", english: "the refund", pronunciation: "ehl rreh-ehm-BOL-soh", part_of_speech: "noun", gender: "m" },
      { cell_id: "048073fa-55c6-4905-bb01-1fca8fb3d398", word: "la devolución", english: "the return / refund (LatAm common alternative)", pronunciation: "lah deh-boh-loo-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "78e856f4-72c7-427b-b975-7803575e9265", word: "las molestias", english: "the inconvenience (always plural in this fixed phrase)", pronunciation: "lahs moh-LEHS-tyahs", part_of_speech: "noun", gender: "f" },
      { cell_id: "7362c204-6dc7-47da-bf30-f43da72a98a8", word: "inaceptable", english: "unacceptable", pronunciation: "ee-nah-sehp-TAH-bleh", part_of_speech: "adjective" },
      { cell_id: "430cac90-639c-46a5-bf32-7b571501f90e", word: "esperar (imperfect)", english: "esperaba = was expecting (polite complaint frame)", pronunciation: "ehs-peh-RAH-bah", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Imperfect for polite complaints",
        explanation:
          "Spanish uses the imperfect of esperar, querer, and pensar to soften a complaint or a request. 'Esperaba algo mejor' (I was expecting better) is softer than 'espero algo mejor' (I'm expecting better — sounds like a demand). 'Quería preguntar…' (I wanted to ask…) is softer than 'quiero preguntar'. The imperfect signals ongoing intent without forcing it on the listener.",
        examples: [
          { spanish: "Esperaba un poco más de profesionalidad.", english: "I was expecting a bit more professionalism." },
          { spanish: "Quería hablar con el responsable, si es posible.", english: "I wanted to speak with the person in charge, if possible." },
        ],
      },
      {
        point: "Negative imperative for instructions and demands",
        explanation:
          "Negative tú commands take subjunctive forms. 'No me hables así' (don't talk to me that way), 'no toques eso' (don't touch that), 'no llegues tarde' (don't be late). The subjunctive 'flip' you learned in lesson 5 applies — hablar → hables, llegar → llegues. In complaint situations you may need these to set boundaries.",
      },
    ],
    dialogue: [
      { cell_id: "6c00217a-2407-4b0e-b357-2dd60588be0f", speaker: "Cliente", spanish: "Disculpe, llevo media hora esperando y nadie me atiende.", english: "Excuse me, I've been waiting half an hour and no one is helping me.", pronunciation: "dees-KOOL-peh, YEH-boh MEH-dyah OH-rah ehs-peh-RAHN-doh ee NAH-dyeh meh ah-TYEHN-deh", register: "formal" },
      { cell_id: "e666c782-0c26-4383-a4b3-a8aa55dc7e4c", speaker: "Empleado", spanish: "Disculpe la espera. ¿En qué puedo ayudarle?", english: "Sorry for the wait. How can I help you?", pronunciation: "dees-KOOL-peh lah ehs-PEH-rah. ehn keh PWEH-doh ah-yoo-DAR-leh", register: "formal" },
      { cell_id: "863a0170-ab57-4aa3-8ed5-d0f235c96ffd", speaker: "Cliente", spanish: "El vuelo está cancelado y nadie me ha dado información.", english: "The flight is cancelled and no one has given me any information.", pronunciation: "ehl BWEH-loh ehs-TAH kahn-seh-LAH-doh ee NAH-dyeh meh ah DAH-doh een-for-mah-SYOHN", register: "formal" },
      { cell_id: "93f34f55-6f92-4608-93cf-c997436dd49b", speaker: "Empleado", spanish: "Lo siento mucho. Voy a comprobar las opciones de reembolso.", english: "I'm very sorry. I'll check the refund options.", pronunciation: "loh SYEHN-toh MOO-choh. boy ah kohm-proh-BAR lahs ohp-SYOH-nehs deh rreh-ehm-BOL-soh", register: "formal" },
      { cell_id: "bedf1689-389f-4eec-89b6-e9a973be6e04", speaker: "Cliente", spanish: "Si no se resuelve hoy, voy a pedir una hoja de reclamaciones.", english: "If it doesn't get resolved today, I'm going to ask for a complaints form.", pronunciation: "see noh seh rreh-SWEHL-beh oy, boy ah peh-DEER OO-nah OH-hah deh rreh-klah-mah-SYOH-nehs", register: "formal" },
    ],
    cultural_note:
      "In Spain, every business is legally required to have an 'hoja de reclamaciones' (complaints form) on premises. Asking for it ('¿Me da una hoja de reclamaciones?') is a real escalation move that goes to consumer protection authorities — it's not symbolic. Spaniards know this; staff will often switch immediately into resolution mode the moment you ask. Don't ask unless you actually want to file the formal complaint, because the form gets sent in and triggers a real process. LatAm countries have similar mechanisms but vary in legal teeth — Argentina's 'libro de quejas' is comparable; Mexico has 'PROFECO' as the consumer agency but no equivalent mandatory in-store form.",
    tip:
      "Memorize the escalation ladder: (1) 'Disculpe, hay un problema con…' (gentle), (2) 'Me gustaría hablar con el gerente' (firm), (3) 'Esperaba un mejor servicio' (disappointed), (4) 'Quiero un reembolso' (demanding), (5) '¿Me da una hoja de reclamaciones?' (nuclear, Spain only). Know all five; deploy in order; stop at the lowest level that gets resolution. Skipping straight to level 5 is what burned-out tourists do — it works once but damages every future interaction at that business.",
    regional_variants: [
      { meaning: "refund", peninsular: "el reembolso / la devolución", latam: "la devolución (more common) / el reembolso (formal)", note: "Both are universally understood; devolución dominates in casual LatAm speech." },
      { meaning: "complaints form", peninsular: "la hoja de reclamaciones (legally mandatory)", latam: "varies — libro de quejas (Argentina), buzón de quejas (Mexico)", note: "The Spanish hoja de reclamaciones has unique legal weight; the LatAm equivalents are less formalized." },
    ],
  },

  // ── 17. work — spanish_work_office ────────────────────────────────────────
  {
    id: "spanish_work_office",
    level: "B1",
    category: "work",
    title: "Office Spanish — usted register and the daily phrases",
    subtitle: "Reuniones, correos, plazos. The professional register starts with usted.",
    intro:
      "Spanish-language offices switch register fast. With your peers, tú and casual phrasing. With clients, your boss, or anyone external, usted and a more formal phrasing — even if everyone speaks the same age and class. Learn to flip cleanly. The vocabulary stack for office life is small but specific: reunión (meeting), correo (email), plazo (deadline), informe (report), reenviar (forward). Get the words and the register switches and you can hold your own in any Spanish-speaking office.",
    sentences: [
      {
        spanish: "Le adjunto el informe que me pidió ayer.",
        english: "I'm attaching the report you asked me for yesterday.",
        pronunciation: "leh ahd-HOON-toh ehl een-FOR-meh keh meh pee-DYOH ah-YEHR",
        pronunciation_focus: [
          "'le' = usted indirect-object pronoun (formal you)",
          "'adjuntar' = to attach (an email attachment)",
        ],
        note:
          "Email opener — usted register. 'Le adjunto' is the formal version; with a peer you'd say 'te adjunto'. The 'le' / 'te' switch is the cleanest marker of register in professional Spanish.",
      },
      {
        spanish: "¿A qué hora es la reunión de mañana?",
        english: "What time is tomorrow's meeting?",
        pronunciation: "ah keh OH-rah ehs lah rreh-oo-NYOHN deh mah-NYAH-nah",
        pronunciation_focus: [
          "'reunión' = meeting (stressed on -NYOHN with written accent)",
        ],
        note:
          "'Reunión' is the standard word for any kind of work meeting. 'Junta' is also used (more LatAm than Spain). Both fine.",
      },
      {
        spanish: "Tengo que entregar el proyecto antes del viernes.",
        english: "I have to deliver the project before Friday.",
        pronunciation: "TEHN-goh keh ehn-treh-GAR ehl proh-YEHK-toh AHN-tehs dehl BYEHR-nehs",
        pronunciation_focus: [
          "'antes de' = before (deadline construction, slightly firmer than 'para')",
        ],
        note:
          "'Antes del viernes' is harder than 'para el viernes' — 'before Friday' (not on Friday, before it). Use 'para' when on-the-date is OK; use 'antes de' when you mean strictly before.",
      },
      {
        spanish: "¿Podría reenviarme el correo, por favor?",
        english: "Could you forward me the email, please?",
        pronunciation: "poh-DREE-ah rreh-ehn-byar-meh ehl koh-RREH-oh, por fah-BOR",
        pronunciation_focus: [
          "'reenviar' = forward (literally 're-send')",
          "'podría' conditional softens the request even between colleagues",
        ],
        note:
          "Email vocabulary: reenviar (forward), responder (reply), responder a todos (reply all), copiar / cc (cc), adjuntar (attach). 'Copiar a alguien' or 'poner en copia' both work for cc.",
      },
      {
        spanish: "Quedo a su disposición para cualquier duda.",
        english: "I remain at your disposal for any questions.",
        pronunciation: "KEH-doh ah soo dees-poh-see-SYOHN PAH-rah kwahl-KYEHR DOO-dah",
        pronunciation_focus: [
          "'quedo' = present tense of quedar, 'I remain'",
          "'a su disposición' = at your disposal — fixed professional sign-off",
        ],
        note:
          "Email closing line. 'Quedo a su disposición' or 'quedo a tu disposición' depending on register. Standard professional sign-off in Spain and LatAm. English equivalent is 'please let me know if you need anything else'.",
      },
    ],
    vocabulary: [
      { cell_id: "e94073d0-2909-4679-bd55-40b1372fe88f", word: "la reunión", english: "the meeting", pronunciation: "lah rreh-oo-NYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "3ec7b2de-2571-448e-a13d-bbe78c14346e", word: "el correo (electrónico)", english: "the email (full form: correo electrónico)", pronunciation: "ehl koh-RREH-oh", part_of_speech: "noun", gender: "m" },
      { cell_id: "2ea0fe60-1db5-437d-a255-f2b39000806f", word: "el informe", english: "the report", pronunciation: "ehl een-FOR-meh", part_of_speech: "noun", gender: "m" },
      { cell_id: "6d8dec5f-4ec1-4b2b-a79c-6134055c2753", word: "el plazo", english: "the deadline / time limit", pronunciation: "ehl PLAH-soh", part_of_speech: "noun", gender: "m" },
      { cell_id: "e6c3cced-5bbb-43b8-8b1e-795e16095015", word: "entregar", english: "to deliver / hand in", pronunciation: "ehn-treh-GAR", part_of_speech: "verb" },
      { cell_id: "96be1cb4-3c99-4e7b-9e90-c0a5b1f0e7e4", word: "adjuntar", english: "to attach (a file)", pronunciation: "ahd-hoon-TAR", part_of_speech: "verb" },
      { cell_id: "6fb7e7c8-3749-4de9-82ad-6ca15b79d4c5", word: "reenviar", english: "to forward (an email)", pronunciation: "rreh-ehn-byar", part_of_speech: "verb" },
      { cell_id: "e9678de6-98e8-4fc5-900f-454c3df2efbc", word: "el / la jefe / jefa", english: "the boss", pronunciation: "ehl HEH-feh / lah HEH-fah", part_of_speech: "noun", gender: "mf" },
      { cell_id: "b7dce72f-39be-4a91-994b-1e4ead9947b6", word: "el compañero / la compañera", english: "the coworker / colleague", pronunciation: "ehl kohm-pah-NYEH-roh / lah kohm-pah-NYEH-rah", part_of_speech: "noun", gender: "mf" },
      { cell_id: "030e4984-bdfe-4505-9e75-ac5c14346afb", word: "quedo a su disposición", english: "I remain at your disposal (formal sign-off)", pronunciation: "KEH-doh ah soo dees-poh-see-SYOHN", part_of_speech: "phrase" },
      { cell_id: "ca362923-af77-4116-abbc-603a91d81d3d", word: "atentamente", english: "sincerely / regards (formal email closing)", pronunciation: "ah-tehn-tah-MEHN-teh", part_of_speech: "adverb" },
      { cell_id: "e6803a6f-ecb7-4ebc-b213-3daefa027b10", word: "un saludo", english: "regards (less formal email closing)", pronunciation: "oon sah-LOO-doh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Usted register — the pronoun switch",
        explanation:
          "When you switch from tú to usted, almost everything else changes: verbs go 3rd-person singular (tú hablas → usted habla), object pronouns become le/se (te → le), possessives become su/sus (tu → su). 'Tu correo' becomes 'su correo'; 'te lo envío' becomes 'se lo envío'. The hardest part is sustaining the switch — English speakers tend to slip back to tú mid-conversation. Drill complete sentences in usted until the whole pronoun grid feels automatic.",
        examples: [
          { spanish: "Te llamo más tarde. (tú) / Le llamo más tarde. (usted)", english: "I'll call you later." },
          { spanish: "Aquí está tu informe. / Aquí está su informe.", english: "Here's your report." },
        ],
      },
      {
        point: "Email register and structure",
        explanation:
          "Spanish professional emails open with 'Estimado/a [Name]' (formal) or 'Hola [Name]' (semi-formal). The opening line is usually a polite framing — 'Espero que te encuentres bien' (I hope you're well) — followed by the actual point. Close with 'Atentamente' / 'Un cordial saludo' (formal) or 'Un saludo' / 'Saludos' (less formal). 'Quedo a tu/su disposición' is a standard pre-closing line for emails where you're asking the recipient to do something.",
      },
    ],
    dialogue: [
      { cell_id: "80d20697-93ce-4302-a88a-91a36ae81cc9", speaker: "Jefa", spanish: "¿Tienes el informe listo para la reunión?", english: "Do you have the report ready for the meeting?", pronunciation: "TYEH-nehs ehl een-FOR-meh LEES-toh PAH-rah lah rreh-oo-NYOHN", register: "informal" },
      { cell_id: "4a77d28f-ba99-4936-80a9-bb54c08a97bf", speaker: "Empleado", spanish: "Casi. Lo estoy revisando ahora mismo.", english: "Almost. I'm reviewing it right now.", pronunciation: "KAH-see. loh ehs-TOY rreh-bee-SAHN-doh ah-OH-rah MEES-moh", register: "informal" },
      { cell_id: "bd60234f-6c08-4c8e-ad87-f3b3582fcab6", speaker: "Jefa", spanish: "Vale, perfecto. Recuerda copiar a Marta cuando lo envíes.", english: "Okay, perfect. Remember to copy Marta when you send it.", pronunciation: "BAH-leh, pehr-FEHK-toh. rreh-KWEHR-dah koh-PYAR ah MAR-tah KWAHN-doh loh ehn-BEE-ehs", register: "informal" },
      { cell_id: "ddbf3f68-a447-4294-88f9-a4d396b3616d", speaker: "Empleado", spanish: "Sin problema. ¿A qué hora es la reunión?", english: "No problem. What time is the meeting?", pronunciation: "seen proh-BLEH-mah. ah keh OH-rah ehs lah rreh-oo-NYOHN", register: "informal" },
      { cell_id: "391fc57a-d763-488c-b79a-bfd25922a2f1", speaker: "Jefa", spanish: "A las once. Nos vemos en la sala dos.", english: "At eleven. See you in meeting room two.", pronunciation: "ah lahs OHN-seh. nohs BEH-mohs ehn lah SAH-lah dohs", register: "informal" },
    ],
    cultural_note:
      "The tú/usted line in Spanish-speaking offices varies sharply by country. In Spain, most offices have moved to tú for everyone, including with the boss — usted is reserved for clients, older external contacts, and very traditional industries (law, banking, government). In Mexico, Colombia, and most of LatAm, usted lingers much longer — even peers may use usted with each other, especially in conservative industries. Argentina uses vos (with peers, anyone informal) and usted (formal); tú is essentially absent in Argentine workplaces. When in doubt: start with usted, let the other person invite tú with 'tutéame' or 'podemos tutearnos'.",
    tip:
      "Build TWO versions of one email. Same content. One in tú, one in usted. Mark every difference: pronoun, verb form, possessive, sign-off. Five lines, ten minutes. Doing this once makes the register switch reflexive instead of analytical — and the muscle memory transfers immediately to spoken conversation.",
    register_note:
      "Use usted with clients, external contacts, anyone over ~60 you don't know, and in formal industries (law, banking, government). Use tú with peers in most modern offices, especially in Spain. When unsure, start with usted; let the other person invite tú.",
  },

  // ── 18. work — spanish_work_interviews ────────────────────────────────────
  {
    id: "spanish_work_interviews",
    level: "B1",
    category: "work",
    title: "Job interviews — vocabulary, the CV/CV-vitae, and the standard questions",
    subtitle: "Háblame de ti. The interview script that's the same in every country.",
    intro:
      "Spanish-language job interviews follow a predictable script. 'Háblame de ti' (tell me about yourself) opens. Then questions about experience, strengths, weaknesses, salary, and motivation. Learn the script and you can prepare specific answers in advance. Vocabulary: el currículum / el CV, el puesto (the position), la entrevista, la empresa, contratar (to hire), la experiencia. Plus the verb tense layer — past tense for past jobs, present for current, conditional for hypothetical.",
    sentences: [
      {
        spanish: "Háblame un poco de ti y de tu experiencia profesional.",
        english: "Tell me a bit about yourself and your professional experience.",
        pronunciation: "AH-blah-meh oon POH-koh deh tee ee deh too ehks-peh-RYEHN-syah proh-feh-syoh-NAHL",
        pronunciation_focus: [
          "'háblame' = imperative of hablar + me (informal — for tú-register interviews)",
          "In usted-register interviews: 'hábleme un poco de usted'",
        ],
        note:
          "The universal opening question. Prepare a 60-second answer covering: who you are, your background, current role, and why you're here today. Rehearse this cold; it's asked in every interview.",
      },
      {
        spanish: "Trabajé tres años en una empresa de tecnología.",
        english: "I worked three years at a tech company.",
        pronunciation: "trah-bah-HEH trehs AH-nyohs ehn OO-nah ehm-PREH-sah deh tehk-noh-loh-HEE-ah",
        pronunciation_focus: [
          "Preterite 'trabajé' — bounded period, completed",
        ],
        note:
          "Preterite for finished jobs ('trabajé', past, done). Present for current ('trabajo en…', ongoing). The tense switch tells the interviewer at a glance which jobs ended and which are current.",
      },
      {
        spanish: "Me considero una persona organizada y resolutiva.",
        english: "I consider myself an organized and resourceful person.",
        pronunciation: "meh kohn-see-DEH-roh OO-nah pehr-SOH-nah or-gah-nee-SAH-dah ee rreh-soh-loo-TEE-bah",
        pronunciation_focus: [
          "Adjectives match the gender of 'persona' (feminine) regardless of speaker's actual gender",
        ],
        note:
          "Important agreement note: 'persona' is feminine, so adjectives following 'una persona' are feminine — even if the speaker is male. 'Soy una persona organizada' is correct regardless of who's speaking.",
      },
      {
        spanish: "Mi mayor debilidad es que a veces soy demasiado perfeccionista.",
        english: "My biggest weakness is that sometimes I'm too perfectionist.",
        pronunciation: "mee mah-YOR deh-bee-lee-DAHD ehs keh ah BEH-sehs soy deh-mah-SYAH-doh pehr-fehk-syoh-NEES-tah",
        pronunciation_focus: [
          "'mayor' = older / biggest (irregular comparative of grande)",
        ],
        note:
          "The cliché answer to the classic weakness question. Interviewers know the move; what they're really testing is your fluency in delivering the platitude smoothly. Prepare a real-feeling version with a concrete example.",
      },
      {
        spanish: "¿Cuál sería el rango salarial para este puesto?",
        english: "What would the salary range be for this position?",
        pronunciation: "kwahl seh-REE-ah ehl RAHN-goh sah-lah-RYAHL PAH-rah EHS-teh PWEHS-toh",
        pronunciation_focus: [
          "'sería' — conditional of ser, softens the question",
          "'puesto' = position / job (puesto de trabajo full form)",
        ],
        note:
          "Conditional 'sería' is the polite way to ask about money. In Spain it's normal to discuss salary in a first interview; in LatAm it varies — Mexico tends to wait until the second round, Colombia is more open about it upfront.",
      },
    ],
    vocabulary: [
      { cell_id: "e437cf24-de74-4c70-a0c8-8a8bbd439298", word: "el currículum / el CV", english: "the CV / résumé (full form: curriculum vitae)", pronunciation: "ehl koo-RREE-koo-loom / ehl seh BEH", part_of_speech: "noun", gender: "m" },
      { cell_id: "943f7627-e6b9-48c0-806e-17988e1fad9e", word: "el puesto (de trabajo)", english: "the position / job", pronunciation: "ehl PWEHS-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "519a931d-31ff-4bf2-9c00-8903ec1116c1", word: "la entrevista", english: "the interview", pronunciation: "lah ehn-treh-BEES-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "c422ccde-754c-451e-91b4-4ab482c4f766", word: "la empresa", english: "the company / business", pronunciation: "lah ehm-PREH-sah", part_of_speech: "noun", gender: "f" },
      { cell_id: "4bc2bfb6-cc79-40a1-b79e-cd7cbc0becb2", word: "contratar", english: "to hire", pronunciation: "kohn-trah-TAR", part_of_speech: "verb" },
      { cell_id: "0b976761-6a3b-491b-aa94-ebbc9c659d53", word: "la experiencia", english: "the experience", pronunciation: "lah ehks-peh-RYEHN-syah", part_of_speech: "noun", gender: "f" },
      { cell_id: "729cf174-866f-4ad0-be01-7968c1bb03ae", word: "el sueldo / el salario", english: "the salary / wage", pronunciation: "ehl SWEHL-doh / ehl sah-LAH-ryoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "3ab2e4a0-5183-440b-8a65-d87c44e2a60e", word: "la debilidad", english: "the weakness", pronunciation: "lah deh-bee-lee-DAHD", part_of_speech: "noun", gender: "f" },
      { cell_id: "eb0b9a29-8ddb-4b6f-aa99-cda6d291a1aa", word: "el punto fuerte", english: "the strength / strong point", pronunciation: "ehl POON-toh FWEHR-teh", part_of_speech: "noun", gender: "m" },
      { cell_id: "d339dafe-68e1-4a79-8008-7ce9c7ed9cf8", word: "resolutivo / resolutiva", english: "resourceful / good at solving problems", pronunciation: "rreh-soh-loo-TEE-boh / rreh-soh-loo-TEE-bah", part_of_speech: "adjective" },
      { cell_id: "f06ab0b2-8d2d-49d7-bb58-b3593e90e3cb", word: "comprometido / comprometida", english: "committed / engaged (positive — not 'compromised'!)", pronunciation: "kohm-proh-meh-TEE-doh / kohm-proh-meh-TEE-dah", part_of_speech: "adjective" },
      { cell_id: "e3ae1c58-0777-45ba-a71e-91e75f211fba", word: "incorporación", english: "start date (literal: incorporation)", pronunciation: "een-kor-poh-rah-SYOHN", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "Tense use in interviews — past, present, conditional",
        explanation:
          "Three tenses do most of the work in interviews. PRETERITE for past jobs and completed experiences ('trabajé', 'estudié', 'aprendí'). PRESENT for current role and general statements about yourself ('trabajo', 'soy', 'me considero'). CONDITIONAL for hypotheticals and softened requests ('me gustaría', 'sería ideal', 'estaría dispuesto/a a…'). Switching cleanly between these signals fluency more than vocabulary does.",
        examples: [
          { spanish: "Estudié en Madrid, trabajé tres años en Berlín, y ahora vivo en México.", english: "I studied in Madrid, worked three years in Berlin, and now I live in Mexico." },
          { spanish: "Me gustaría trabajar en un equipo internacional.", english: "I'd like to work on an international team." },
        ],
      },
      {
        point: "Adjective agreement for personal descriptions",
        explanation:
          "When describing yourself, gender agreement matters. 'Soy organizado' (male speaker) / 'soy organizada' (female speaker). But when using the frame 'soy una persona…', the adjective agrees with 'persona' (always feminine), regardless of the speaker's gender: 'soy una persona organizada'. This trips English speakers, who default to making the adjective agree with the speaker.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Interview vocabulary and tense practice.",
        items: [
          { prompt: "El año pasado ___ (yo / trabajar) en una multinacional.", answer: "trabajé" },
          { prompt: "Me ___ (yo / considerar) una persona comprometida con el trabajo.", answer: "considero" },
          { prompt: "Me ___ (gustar — conditional) saber el rango salarial.", answer: "gustaría" },
          { prompt: "¿Cuál sería la fecha de ___ (start date)?", answer: "incorporación" },
          { prompt: "Tengo experiencia en gestión de ___ (teams).", answer: "equipos" },
        ],
      },
    ],
    cultural_note:
      "Spanish-speaking interview culture differs from American norms in two key ways. First: it's normal and expected to discuss SALARY explicitly in a first interview, especially in Spain. Don't dance around the number; ask 'el rango salarial' directly. Second: questions about your AGE, MARITAL STATUS, and even CHILDREN are unfortunately still common in some industries and countries — they're not legal in most Spanish-speaking countries (Spain has labor law against them), but candidates report being asked anyway. You can deflect politely ('prefiero hablar de mi experiencia profesional') without poisoning the conversation.",
    tip:
      "Build a 60-second 'háblame de ti' answer and rehearse it cold until you can say it without thinking. Five sentences: name + background, education, two most relevant past jobs, current situation, why you want THIS role. Time yourself; cap at one minute. This single rehearsed answer is the highest-ROI prep you can do — it opens every interview and sets the tone for the rest.",
  },

  // ── 19. health — spanish_health_doctor ────────────────────────────────────
  {
    id: "spanish_health_doctor",
    level: "B1",
    category: "health",
    title: "At the doctor — symptoms, the pharmacy, and the constipado warning",
    subtitle: "Me duele la cabeza. And the false friend that will mortify you.",
    intro:
      "Health is one of the highest-stakes settings to navigate in a second language. The grammar load is moderate (mostly tener / doler / sentir) but the vocabulary is specific and the false friends are dangerous — 'constipado' meaning 'I have a cold' in Spain but 'I'm constipated' in much of LatAm is the most famous example, and you do NOT want to mix it up. Plus: Spanish-speaking pharmacies are real medical resources, not just drug counters. Learn to use them.",
    sentences: [
      {
        spanish: "Me duele mucho la cabeza desde anoche.",
        english: "My head hurts a lot since last night.",
        pronunciation: "meh DWEH-leh MOO-choh lah kah-BEH-sah DEHS-deh ah-NOH-cheh",
        pronunciation_focus: [
          "'doler' works like gustar — the body part is the subject, 'me' the indirect object",
          "'me duele la cabeza' NOT 'duelo mi cabeza' — Spanish uses 'me duele', never 'I hurt'",
        ],
        note:
          "The basic 'me duele' construction. Body part is the subject. Plural body parts → 'me duelen': 'me duelen los pies' (my feet hurt). 'Mucho' as adverb modifies the verb.",
      },
      {
        spanish: "Tengo fiebre y me siento muy cansado.",
        english: "I have a fever and I feel very tired.",
        pronunciation: "TEHN-goh FYEH-breh ee meh SYEHN-toh MOO-ee kahn-SAH-doh",
        pronunciation_focus: [
          "'tengo fiebre' = I have a fever (no article — fixed expression)",
          "'me siento + adjective' = I feel + adjective (reflexive sentir)",
        ],
        note:
          "Symptom verbs: TENER for objective conditions (tengo fiebre, tengo tos, tengo dolor), SENTIRSE for subjective feelings (me siento mal, me siento mejor). Both common; pick by whether you're describing data or experience.",
      },
      {
        spanish: "Estoy constipado, pero no es nada grave.",
        english: "I have a head cold, but it's nothing serious.",
        pronunciation: "ehs-TOY kohns-tee-PAH-doh, PEH-roh noh ehs NAH-dah GRAH-beh",
        pronunciation_focus: [
          "'constipado' in SPAIN = head cold (sneezing, runny nose)",
          "'constipado' in much of LATIN AMERICA = literally constipated (intestinal)",
          "The same word means TWO completely different conditions",
        ],
        note:
          "Massive false friend. 'Estoy constipado' in Spain means 'I have a cold'. In Mexico, Argentina, and much of LatAm, it means 'I'm constipated'. Use 'estoy resfriado' or 'tengo un resfriado' for 'I have a cold' anywhere outside Spain and you'll never have to clarify which orifice is malfunctioning.",
      },
      {
        spanish: "El farmacéutico me recomendó este jarabe para la tos.",
        english: "The pharmacist recommended this cough syrup to me.",
        pronunciation: "ehl far-mah-SEH-oo-tee-koh meh rreh-koh-mehn-DOH EHS-teh hah-RAH-beh PAH-rah lah tohs",
        pronunciation_focus: [
          "'farmacéutico' = pharmacist (stressed on the -CEH-)",
          "'jarabe' = syrup (cough syrup, etc.)",
        ],
        note:
          "Spanish pharmacies are real medical resources. Pharmacists can diagnose minor conditions and recommend treatment without a doctor visit — much more authority than American pharmacists. 'Voy a la farmacia' often replaces 'voy al médico' for routine complaints.",
      },
      {
        spanish: "¿Tiene algo para el dolor de garganta?",
        english: "Do you have something for a sore throat?",
        pronunciation: "TYEH-neh AHL-goh PAH-rah ehl doh-LOR deh gar-GAHN-tah",
        pronunciation_focus: [
          "'dolor de + body part' = pain in + body part (alternative to 'me duele')",
          "Both 'me duele la garganta' and 'tengo dolor de garganta' work — interchangeable",
        ],
        note:
          "Pharmacy opener. Use usted ('tiene') — pharmacists are addressed formally regardless of age. The 'algo para…' construction is universal for asking about over-the-counter remedies.",
      },
    ],
    vocabulary: [
      { cell_id: "bef3e10c-f6d1-4455-a8ea-9ceaafaae188", word: "doler", english: "to hurt (works like gustar — me duele, te duele, le duele…) (o→ue)", pronunciation: "doh-LEHR", part_of_speech: "verb" },
      { cell_id: "1632c80c-655c-4b3e-8dc9-8a35ed7bab38", word: "sentirse", english: "to feel (reflexive, e→ie) — me siento bien / mal", pronunciation: "sehn-TEER-seh", part_of_speech: "verb" },
      { cell_id: "7dd5c3c5-8920-4622-b406-f45eed6aea50", word: "la fiebre", english: "the fever", pronunciation: "lah FYEH-breh", part_of_speech: "noun", gender: "f" },
      { cell_id: "5fd4419c-a5c7-4c12-88f1-21a85e7eae42", word: "la tos", english: "the cough", pronunciation: "lah tohs", part_of_speech: "noun", gender: "f" },
      { cell_id: "fdc30f41-d1a2-445f-8e1a-30b2797d3011", word: "el resfriado", english: "the head cold (safer than 'constipado' anywhere outside Spain)", pronunciation: "ehl rrehs-fryah-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "b1abd6a5-c569-43ee-b4c0-cb0708a40220", word: "constipado", english: "WARNING: head cold in Spain / constipated in much of LatAm — false friend", pronunciation: "kohns-tee-PAH-doh", part_of_speech: "adjective" },
      { cell_id: "a4a59fed-715a-4eb5-a792-d593e0fd702a", word: "la consulta", english: "the doctor's office (Spain; LatAm: el consultorio)", pronunciation: "lah kohn-SOOL-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "9d9cf364-ef0e-4d4b-95d7-dc8c932d02b9", word: "la farmacia", english: "the pharmacy", pronunciation: "lah far-MAH-syah", part_of_speech: "noun", gender: "f" },
      { cell_id: "6041578d-ecf9-438e-af83-77e04045e9da", word: "el / la farmacéutico/a", english: "the pharmacist", pronunciation: "ehl far-mah-SEH-oo-tee-koh", part_of_speech: "noun", gender: "mf" },
      { cell_id: "80bd966b-c38a-4216-9d65-cface7b557ee", word: "el jarabe", english: "the cough syrup / liquid medicine", pronunciation: "ehl hah-RAH-beh", part_of_speech: "noun", gender: "m" },
      { cell_id: "9659f47e-8751-4a7c-a440-78cd79f5e32e", word: "la receta", english: "the prescription (also: recipe — same word)", pronunciation: "lah rreh-SEH-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "6034c3c8-b80c-4e13-aa7e-562a6640109e", word: "la garganta", english: "the throat", pronunciation: "lah gar-GAHN-tah", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "Doler — the gustar-style construction",
        explanation:
          "'Doler' (to hurt) doesn't work like English 'to hurt'. The body part is the SUBJECT; the indirect-object pronoun (me, te, le, nos, os, les) marks who's experiencing the pain. 'Me duele la cabeza' literally means 'the head hurts to me'. Plural body parts take 'duelen': 'me duelen los pies'. Never say 'duelo mi cabeza' — that construction doesn't exist in Spanish.",
        examples: [
          { spanish: "Me duele el estómago. / Me duelen las muelas.", english: "My stomach hurts. / My teeth hurt." },
          { spanish: "Le duele la espalda a mi padre.", english: "My father's back hurts." },
        ],
      },
      {
        point: "Tener vs sentirse — objective vs subjective symptoms",
        explanation:
          "TENER + symptom for objective conditions: tengo fiebre, tengo tos, tengo dolor de cabeza, tengo náuseas. These are facts a doctor could verify. SENTIRSE + adjective for subjective feelings: me siento mal, me siento cansado, me siento mejor. These are how you experience your state. Doctors will ask both kinds of questions; learn to answer with the matching verb.",
      },
    ],
    dialogue: [
      { cell_id: "b0fd64ac-6707-4612-ba09-ab2333efbbbf", speaker: "Médico", spanish: "Buenos días, ¿qué le pasa?", english: "Good morning, what's wrong?", pronunciation: "BWEH-nohs DEE-ahs, keh leh PAH-sah", register: "formal" },
      { cell_id: "aff4cfd6-f5fa-4654-b747-3c49f22d063b", speaker: "Paciente", spanish: "Pues llevo dos días con dolor de garganta y fiebre.", english: "Well, I've had a sore throat and fever for two days.", pronunciation: "pwehs YEH-boh dohs DEE-ahs kohn doh-LOR deh gar-GAHN-tah ee FYEH-breh", register: "formal" },
      { cell_id: "f43bc406-50a3-4be5-8816-c8e217c432ed", speaker: "Médico", spanish: "¿Tiene tos también?", english: "Do you have a cough as well?", pronunciation: "TYEH-neh tohs tahm-BYEHN", register: "formal" },
      { cell_id: "53cd6dcf-e629-4e82-8127-a4375ffa4853", speaker: "Paciente", spanish: "Sí, sobre todo por la noche. Y me siento muy cansado.", english: "Yes, especially at night. And I feel very tired.", pronunciation: "see, SOH-breh TOH-doh por lah NOH-cheh. ee meh SYEHN-toh MOO-ee kahn-SAH-doh", register: "formal" },
      { cell_id: "4b2a1bc4-3911-41a5-a534-c7848aa2f43f", speaker: "Médico", spanish: "Le voy a recetar un antibiótico y reposo. Vuelva si no mejora en una semana.", english: "I'm going to prescribe you an antibiotic and rest. Come back if you don't improve in a week.", pronunciation: "leh boy ah rreh-seh-TAR oon ahn-tee-BYOH-tee-koh ee rreh-POH-soh. BWEHL-bah see noh meh-HOH-rah ehn OO-nah seh-MAH-nah", register: "formal" },
    ],
    cultural_note:
      "Spanish pharmacies are real medical resources. Farmacéuticos can diagnose minor conditions (head cold, stomach bug, allergies, mild burns, minor cuts) and recommend medication — far beyond what an American pharmacist will do. The green cross sign means there's a pharmacist who can help. Cost: in Spain, generics for common complaints often cost 3-5 euros and don't require a prescription; in LatAm, prescription rules are even looser. If your symptom is non-emergency, going to la farmacia first is the locally normal move — only escalate to the doctor if the pharmacist tells you to.",
    tip:
      "BURN THE CONSTIPADO RULE INTO YOUR MEMORY. In Spain, 'estoy constipado' = head cold. In Mexico, Argentina, and most of LatAm, the same words mean intestinal constipation. If you're traveling across regions, default to 'estoy resfriado' or 'tengo un resfriado' anywhere — this works everywhere and has zero risk of producing an awkward conversation. The two-letter difference (constipado vs resfriado) has cost foreign learners decades of mortification.",
    regional_variants: [
      { meaning: "doctor's office", peninsular: "la consulta (also: el centro de salud)", latam: "el consultorio (general LatAm)", note: "Both terms widely understood across regions; consulta dominates in Spain, consultorio in LatAm." },
      { meaning: "head cold (false friend!)", peninsular: "estar constipado = head cold (Spain)", latam: "estar constipado = constipated (intestinal — Mexico, Argentina, most LatAm)", note: "Safer everywhere: 'estoy resfriado' / 'tengo un resfriado'. The constipado false friend is one of the most-cited false friends in any Spanish-learning resource." },
      { meaning: "to take medication", peninsular: "tomar (medicina/medicamento)", latam: "tomar (same) — but some regions: 'coger una pastilla' is FINE in Spain, VULGAR in Mexico/Argentina/several LatAm countries", note: "If discussing meds in Mexico or southern cone, use 'tomar' or 'agarrar' instead of 'coger'." },
    ],
  },

  // ── 20. opinions — spanish_opinions_creo_que ──────────────────────────────
  {
    id: "spanish_opinions_creo_que",
    level: "B1",
    category: "opinions",
    title: "Opinions — creo que, no creo que, and the politics of disagreeing",
    subtitle: "The mood flip rule, plus how to push back without burning the conversation down.",
    intro:
      "Expressing opinions in Spanish requires two skills: knowing the mood flip ('creo que' + indicative / 'no creo que' + subjunctive — lesson 8) and knowing the register ladder for disagreement. Spanish has many ways to say 'I disagree', ranging from gentle ('no estoy del todo de acuerdo') to confrontational ('eso es totalmente falso'). Choose by how much you want to push the conversation. At B1 you should be able to express your view, agree, partially agree, and politely disagree without producing offense.",
    sentences: [
      {
        spanish: "Creo que el cambio climático es el problema más urgente del mundo.",
        english: "I think climate change is the most urgent problem in the world.",
        pronunciation: "KREH-oh keh ehl KAHM-byoh klee-MAH-tee-koh ehs ehl proh-BLEH-mah mahs oor-HEHN-teh dehl MOON-doh",
        pronunciation_focus: [
          "'creo que' + INDICATIVE — speaker IS committing to the truth of the claim",
        ],
        note:
          "Standard opinion construction. Creo que / pienso que / opino que / a mí me parece que — all take indicative when affirmative. Speaker is asserting.",
      },
      {
        spanish: "No creo que sea el problema MÁS urgente, pero es muy serio.",
        english: "I don't think it's the MOST urgent problem, but it is very serious.",
        pronunciation: "noh KREH-oh keh SEH-ah ehl proh-BLEH-mah mahs oor-HEHN-teh, PEH-roh ehs MOO-ee SEH-ryoh",
        pronunciation_focus: [
          "'no creo que' + SUBJUNCTIVE — speaker NOT committing to the claim",
          "'sea' = subjunctive of ser (dirty six)",
        ],
        note:
          "The mood flip in action. 'No creo que' triggers subjunctive in the que clause. Disagreement with a softening clause attached ('pero es muy serio') keeps the conversation alive.",
      },
      {
        spanish: "Estoy totalmente de acuerdo contigo.",
        english: "I totally agree with you.",
        pronunciation: "ehs-TOY toh-tahl-MEHN-teh deh ah-KWEHR-doh kohn-TEE-goh",
        pronunciation_focus: [
          "'estar de acuerdo' = to agree (always 'estar', never 'ser')",
          "'contigo' = with you (special fused form of con + ti)",
        ],
        note:
          "Standard agreement phrase. Always 'estar de acuerdo' (state), never 'ser de acuerdo' (wrong). Special pronouns conmigo / contigo replace 'con yo' / 'con tú' (which don't exist).",
      },
      {
        spanish: "No estoy del todo de acuerdo, pero entiendo tu punto.",
        english: "I don't entirely agree, but I understand your point.",
        pronunciation: "noh ehs-TOY dehl TOH-doh deh ah-KWEHR-doh, PEH-roh ehn-TYEHN-doh too POON-toh",
        pronunciation_focus: [
          "'del todo' = entirely / completely (qualifier softening 'no')",
        ],
        note:
          "Soft disagreement template. 'No estoy del todo de acuerdo' is much softer than 'no estoy de acuerdo' — the 'del todo' (entirely) leaves room for partial agreement. Pair with 'pero entiendo…' (but I understand) and you can disagree without burning the conversation.",
      },
      {
        spanish: "Para mí, lo más importante es la educación.",
        english: "For me, the most important thing is education.",
        pronunciation: "PAH-rah mee, loh mahs eem-por-TAHN-teh ehs lah eh-doo-kah-SYOHN",
        pronunciation_focus: [
          "'para mí' = for me (in my view) — opinion frame",
          "'lo + adjective' = the [adjective] thing — neutral abstract nominalization",
        ],
        note:
          "Two useful opinion frames here. 'Para mí' (for me / in my view) is a softer opinion opener than 'creo que' — invites disagreement without claiming objective truth. 'Lo más importante' (the most important thing) lets you state priorities without naming them directly.",
      },
    ],
    vocabulary: [
      { cell_id: "db97c6b6-602e-4b40-b9ea-589003fe68b1", word: "creer que", english: "to think / believe that (indicative when affirmative, subjunctive when negated)", pronunciation: "kreh-EHR keh", part_of_speech: "verb" },
      { cell_id: "9fa9fe82-a07f-42c7-a71c-81a025e15e07", word: "pensar que", english: "to think that (same flip rule as creer)", pronunciation: "pehn-SAR keh", part_of_speech: "verb" },
      { cell_id: "d8dbc8a9-0233-421f-a0fe-315e567f19b7", word: "opinar que", english: "to be of the opinion that", pronunciation: "oh-pee-NAR keh", part_of_speech: "verb" },
      { cell_id: "a7422331-a0c6-4ebf-9c0f-191ab261dee7", word: "me parece que", english: "it seems to me that (same flip rule)", pronunciation: "meh pah-REH-seh keh", part_of_speech: "phrase" },
      { cell_id: "1905d2ed-9e83-4ac7-bd83-a8385c4c0361", word: "estar de acuerdo con", english: "to agree with (always 'estar')", pronunciation: "ehs-TAR deh ah-KWEHR-doh kohn", part_of_speech: "phrase" },
      { cell_id: "bf4cad74-0295-423d-9fbc-e6f4d576047e", word: "totalmente / del todo", english: "totally / entirely (qualifier for agreement strength)", pronunciation: "toh-tahl-MEHN-teh / dehl TOH-doh", part_of_speech: "adverb" },
      { cell_id: "0f503c2c-e15c-4141-828c-bfbe55cdb473", word: "en parte", english: "partly / in part (soft agreement)", pronunciation: "ehn PAR-teh", part_of_speech: "phrase" },
      { cell_id: "4c49dea2-9b69-4a20-b8b1-7f121b0eb8fa", word: "para mí", english: "for me / in my view (opinion frame)", pronunciation: "PAH-rah mee", part_of_speech: "phrase" },
      { cell_id: "62da3287-0790-4404-888d-341340ec97ea", word: "depende", english: "it depends (universal hedging response)", pronunciation: "deh-PEHN-deh", part_of_speech: "verb" },
      { cell_id: "26342956-54cc-44c2-9237-e309f798bd86", word: "por un lado / por otro lado", english: "on one hand / on the other hand", pronunciation: "por oon LAH-doh / por OH-troh LAH-doh", part_of_speech: "phrase" },
      { cell_id: "c3673333-53e6-458d-a984-9845802e6c31", word: "el punto de vista", english: "the point of view", pronunciation: "ehl POON-toh deh BEES-tah", part_of_speech: "noun", gender: "m" },
      { cell_id: "1bb3958e-028e-4a9c-bf50-c4fdc9cfbc40", word: "la opinión", english: "the opinion", pronunciation: "lah oh-pee-NYOHN", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "The creer que / no creer que mood flip (revisited)",
        explanation:
          "AFFIRMATIVE belief verbs (creer, pensar, opinar, parecer) take INDICATIVE in the que clause — the speaker is asserting. NEGATED belief verbs take SUBJUNCTIVE — the speaker is denying. 'Creo que tiene razón' (indicative — committing). 'No creo que tenga razón' (subjunctive — denying). This is the cleanest mood-flip rule in the language. Drill it as a paired contrast for any opinion verb you use frequently.",
        examples: [
          { spanish: "Pienso que es buena idea.", english: "I think it's a good idea. (committing)" },
          { spanish: "No pienso que sea buena idea.", english: "I don't think it's a good idea. (denying)" },
        ],
      },
      {
        point: "The disagreement register ladder",
        explanation:
          "Spanish disagreement runs from gentle to confrontational. From softest to strongest: (1) 'Bueno, no sé…' (well, I don't know — full hedge), (2) 'Hasta cierto punto, sí, pero…' (up to a point, yes, but), (3) 'No estoy del todo de acuerdo' (I don't entirely agree), (4) 'No estoy de acuerdo' (I disagree), (5) 'Creo que te equivocas' (I think you're wrong), (6) 'Eso es totalmente falso' (that's completely false). Choose by relationship and stakes; staying near the soft end keeps the conversation alive.",
      },
      {
        point: "Opinion frames that DON'T trigger subjunctive",
        explanation:
          "Some opinion frames take indicative in both affirmative AND negative forms. 'Para mí' (in my view), 'en mi opinión' (in my opinion), 'desde mi punto de vista' (from my point of view) — none of these flip moods. They state your perspective without committing to objective truth, so the mood stays neutral indicative. Use these when you want to express an opinion without sounding like you're forcing it on the listener.",
        examples: [
          { spanish: "Para mí, esto es importante. / Para mí, esto no es importante.", english: "For me, this is/isn't important. (no mood flip either way)" },
        ],
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction:
          "Mood flip practice — indicative for affirmative belief, subjunctive for negated belief.",
        items: [
          { prompt: "Creo que ___ (ser) una buena decisión.", answer: "es" },
          { prompt: "No creo que ___ (tener — ella) razón.", answer: "tenga" },
          { prompt: "Pienso que el español ___ (ser) un idioma fascinante.", answer: "es" },
          { prompt: "No pienso que ___ (poder — nosotros) llegar a tiempo.", answer: "podamos" },
          { prompt: "Me parece que ___ (haber) demasiada gente aquí.", answer: "hay" },
        ],
      },
    ],
    cultural_note:
      "Spanish-speaking cultures differ in how directly they accept disagreement. In Spain, peer-to-peer disagreement in casual conversation is normal and almost expected — saying 'no estoy de acuerdo' to a friend is not impolite, it's engaged. In Mexico and Colombia, disagreement is typically softened more — 'no estoy del todo de acuerdo' or 'a lo mejor, pero…' even between friends. Argentina is closer to Spain in directness. When in doubt, soften by one register level beyond what you'd do in English — the cost of being overly polite is small; the cost of being seen as rude is large.",
    tip:
      "Build a mini-debate journal. Pick one news topic per week. Write four sentences: (1) your opinion using 'creo que', (2) someone else's opinion you disagree with, (3) your disagreement using 'no creo que', (4) your softening reason. Four sentences, ten minutes per week. After a month, you'll have rehearsed mood-flip + register-laddering in real content — which is how natives actually use these structures, not as isolated drills.",
  },
];
export default lessons;
