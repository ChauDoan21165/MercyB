// src/languages/spanish/lessons-b2.ts
//
// B2 Spanish lessons for English-speaking learners.
// 25 hand-crafted lessons covering CEFR B2 descriptors.
//
// Pedagogical priorities for B2:
//   1. Subjunctive mastery gets 5 lessons because B2 is where the mood
//      becomes productive (not just receptive). Past subjunctive forms,
//      sequence of tenses, adjective clauses, adverbial clauses, and
//      all three SI conditional types each get a dedicated lesson.
//   2. Passive voice gets 3 lessons because Spanish has 4+ ways to do
//      "passive" and English speakers default to the wrong one.
//   3. Idioms gets 5 lessons split by region — Peninsular and LatAm
//      idioms often don't travel; learners need to know which is which.
//   4. Business Spanish, news, and debate get the rest — these are
//      the registers an educated B2 speaker handles, and the connectors
//      / discourse markers in debate_basics are how B1 prose becomes
//      B2 prose.
//
// Cultural notes target B2-level friction points: register switching,
// regional idiom geography, journalistic conventions, professional norms.

import type { SpanishLesson } from "./lessons";

export const lessons: SpanishLesson[] = [
  // ── 1. Subjunctive mastery ────────────────────────────────────────────
  {
    id: "spanish_past_subjunctive_forms",
    level: "B2",
    category: "subjunctive_mastery",
    title: "Past subjunctive — forms",
    subtitle: "Hablara, comiera, viviera — and the -se alternative",
    intro:
      "B1 covered present subjunctive. B2 opens with past subjunctive — the form that powers hypotheticals, conditionals, and polite requests. Two parallel endings exist (-ra and -se); they mean exactly the same thing. Drill the forms before tackling usage.",
    sentences: [
      {
        spanish: "Si tuviera tiempo, te ayudaría.",
        english: "If I had time, I'd help you.",
        pronunciation: "see too-BYEH-rah TYEHM-poh, teh ah-yoo-dah-REE-ah",
        pronunciation_focus: ["past subjunctive stress: tu-BYEH-rah"],
        note: "Classic Type 2 hypothetical: si + PAST SUBJUNCTIVE + CONDITIONAL. 'Tuviera' is the past subjunctive of tener.",
      },
      {
        spanish: "Quería que me llamaras antes.",
        english: "I wanted you to call me earlier.",
        pronunciation: "keh-REE-ah keh meh yah-MAH-rahs AHN-tehs",
        note: "Sequence of tenses: main verb 'quería' (imperfect/past) triggers past subjunctive 'llamaras' in the subordinate clause. With present 'quiero', it'd be 'llames'.",
      },
      {
        spanish: "Esperábamos que vinieran a la fiesta.",
        english: "We were hoping they'd come to the party.",
        pronunciation: "ehs-peh-RAH-bah-mohs keh bee-NYEH-rahn ah lah FYEHS-tah",
        note: "VINIERAN = past subjunctive of venir (vinieron → vinie- → -ran). Third-person plural preterite stem is the source.",
      },
      {
        spanish: "Como si fuera fácil.",
        english: "As if it were easy.",
        pronunciation: "KOH-moh see FWEH-rah FAH-seel",
        note: "COMO SI always triggers past subjunctive (even when the main clause is in present tense). It's the fixed Spanish equivalent of English 'as if I WERE'.",
      },
      {
        spanish: "Me habló como si no me conociese.",
        english: "He spoke to me as if he didn't know me.",
        pronunciation: "meh ah-BLOH KOH-moh see noh meh koh-noh-SYEH-seh",
        note: "CONOCIESE = the -se form of past subjunctive (alternative to 'conociera'). Identical meaning. Dominant in Peninsular Spanish writing; rare in Latin American writing.",
      },
    ],
    vocabulary: [
      { word: "tuviera/tuviese", english: "(I/he/she) had — past subj. of tener", pronunciation: "too-BYEH-rah / too-BYEH-seh", part_of_speech: "verb" },
      { word: "fuera/fuese", english: "(I/he/she) were — past subj. of ser/ir", pronunciation: "FWEH-rah / FWEH-seh", part_of_speech: "verb" },
      { word: "viniera/viniese", english: "(I/he/she) came — past subj. of venir", pronunciation: "bee-NYEH-rah / bee-NYEH-seh", part_of_speech: "verb" },
      { word: "hubiera/hubiese", english: "(I/he/she) had — past subj. of haber", pronunciation: "oo-BYEH-rah / oo-BYEH-seh", part_of_speech: "verb" },
      { word: "como si", english: "as if (always + past subj.)", pronunciation: "KOH-moh see", part_of_speech: "conj" },
      { word: "aunque", english: "even if / although (often + subj.)", pronunciation: "OWN-keh", part_of_speech: "conj" },
      { word: "ojalá", english: "I wish / hopefully (+ subj.)", pronunciation: "oh-hah-LAH", part_of_speech: "interj" },
    ],
    grammar: [
      {
        point: "How to form past subjunctive",
        explanation:
          "Take the 3rd-person PLURAL preterite (the 'ellos/ellas' form). Drop the -ron ending. Add the -ra OR -se endings. -ar verbs: hablaron → hablara, hablaras, hablara, habláramos, hablarais, hablaran (or hablase, hablases, etc.). -er/-ir verbs: comieron → comiera/comiese, etc. The 1st-person plural form takes a written accent: HABLÁRAMOS, COMIÉRAMOS, VIVIÉRAMOS.",
        examples: [
          { spanish: "Hablar: hablaron → hablara, hablaras, hablara, habláramos, hablarais, hablaran", english: "" },
          { spanish: "Tener: tuvieron → tuviera, tuvieras, tuviera, tuviéramos, tuvierais, tuvieran", english: "" },
          { spanish: "Ser/Ir: fueron → fuera, fueras, fuera, fuéramos, fuerais, fueran", english: "(ser and ir share forms)" },
        ],
      },
      {
        point: "-ra vs -se — when to use which",
        explanation:
          "Semantically identical. Geographically split: -RA dominates Latin America almost exclusively, and dominates Spanish speech everywhere. -SE persists in Peninsular Spanish writing (novels, newspapers, formal correspondence). Listening to Spanish-language film: ~95% -ra. Reading a García Márquez novel: maybe 30% -se. Use -ra when you produce; recognize -se when you read.",
      },
      {
        point: "Common past subjunctive triggers",
        explanation:
          "1) SI + past subj + conditional (hypothetical). 2) COMO SI + past subj (as if). 3) Main verb in past/conditional + que + past subj (sequence of tenses): 'Quería que vinieras', 'Me gustaría que vinieras'. 4) OJALÁ + past subj (I wish — counterfactual): 'Ojalá fuera rico' = I wish I were rich.",
      },
    ],
    cultural_note:
      "The -se forms feel literary and slightly archaic to Latin American ears. A Mexican reading 'Ojalá viniese' in a novel reads it fine; a Mexican producing 'Ojalá viniera' in conversation sounds completely normal. A Spaniard might naturally write 'Ojalá viniese' in a formal letter and still say 'Ojalá viniera' in conversation. The asymmetry — -se literary, -ra universal — is one of the clearest register signals in written Spanish.",
    tip:
      "Drill the past subjunctive forms in isolation for one full week before tackling usage. Conjugate 20 verbs every morning. The forms must be automatic before you can deploy them under conversational pressure. The 'when' (volition, emotion, doubt, conditionals) is easier than the 'how'.",
  },
  {
    id: "spanish_sequence_of_tenses",
    level: "B2",
    category: "subjunctive_mastery",
    title: "Sequence of tenses",
    subtitle: "Concordancia — matching the main clause to the subjunctive",
    intro:
      "Sequence of tenses is the architectural rule that ties subjunctive usage into a coherent system. The tense of the main clause determines whether the subordinate subjunctive is present or past. Once you internalize this, subjunctive stops feeling like a list of triggers and starts feeling like a coherent system.",
    sentences: [
      {
        spanish: "Quiero que vengas mañana.",
        english: "I want you to come tomorrow.",
        pronunciation: "KYEH-roh keh BEHN-gahs mah-NYAH-nah",
        note: "Main clause PRESENT (quiero) + subordinate PRESENT SUBJUNCTIVE (vengas). Default pairing.",
      },
      {
        spanish: "Quería que vinieras ayer.",
        english: "I wanted you to come yesterday.",
        pronunciation: "keh-REE-ah keh bee-NYEH-rahs ah-YEHR",
        note: "Main clause PAST (quería) + subordinate PAST SUBJUNCTIVE (vinieras). The past main verb pulls the subjunctive back into the past.",
      },
      {
        spanish: "Me dijo que llegara temprano.",
        english: "She told me to arrive early.",
        pronunciation: "meh DEE-hoh keh yeh-GAH-rah tehm-PRAH-noh",
        note: "DIJO (preterite, past) → LLEGARA (past subjunctive). Reporting a past command. Compare 'me dice que llegue' (present + present subj).",
      },
      {
        spanish: "Habría preferido que no lo hicieras.",
        english: "I would have preferred that you not do it.",
        pronunciation: "ah-BREE-ah preh-feh-REE-doh keh noh loh ee-SYEH-rahs",
        note: "Conditional perfect (habría preferido) acts like 'past' for sequence purposes → past subjunctive (hicieras).",
      },
      {
        spanish: "Si pudiera, te ayudaría.",
        english: "If I could, I'd help you.",
        pronunciation: "see poo-DYEH-rah, teh ah-yoo-dah-REE-ah",
        note: "Conditional (ayudaría) pairs with past subjunctive (pudiera) in si-clauses. The conditional is always the result, the past subjunctive is the condition.",
      },
    ],
    grammar: [
      {
        point: "The sequence rule — simplified",
        explanation:
          "MAIN CLAUSE IN PRESENT/FUTURE/COMMAND → subordinate uses PRESENT subjunctive ('Quiero que vengas', 'Te diré que vengas', 'Pídele que venga'). MAIN CLAUSE IN PAST/CONDITIONAL → subordinate uses PAST subjunctive ('Quería que vinieras', 'Te dije que vinieras', 'Me gustaría que vinieras'). The main clause's tense 'sets the time frame' that the subjunctive follows.",
      },
      {
        point: "Exceptions and edge cases",
        explanation:
          "1) When the subordinate refers to a CURRENT or FUTURE situation, even with a past main clause, present subjunctive can appear: 'Te dije que vengas mañana' (I told you to come tomorrow — and tomorrow is still future to me speaking now). 2) ESPERAR QUE in any tense usually triggers present subjunctive if hope persists into now. 3) Conditional + past subjunctive is the standard pairing for hypotheticals — never present subjunctive in si-clauses.",
        examples: [
          { spanish: "Te dije que vengas mañana. (present subj — tomorrow is still future)", english: "I told you to come tomorrow." },
          { spanish: "Te dije que vinieras ayer. (past subj — yesterday is past)", english: "I told you to come yesterday." },
        ],
      },
    ],
    cultural_note:
      "English doesn't mark sequence of tenses with mood — we mark it with verb tense in indirect speech ('He says he is tired' vs 'He said he WAS tired'). Spanish marks it with subjunctive forms. Once you start hearing 'me dijo que viniera' (past+past) vs 'me dice que venga' (present+present), the pattern feels natural. Until then, conscious tagging — main verb tense → subordinate subjunctive tense — is the path.",
    tip:
      "Build a flashcard with TWO COLUMNS: present/future main verbs vs past/conditional main verbs. Drill pairs: 'quiero que VENGAS' / 'quería que VINIERAS'. After 50 pairs, the pattern becomes muscle memory and you stop computing the rule consciously.",
  },
  {
    id: "spanish_subjunctive_adjective_clauses",
    level: "B2",
    category: "subjunctive_mastery",
    title: "Subjunctive in adjective clauses",
    subtitle: "Busco a alguien que hable inglés — describing the unknown",
    intro:
      "When you describe something whose existence is uncertain, hypothetical, or unknown, Spanish uses subjunctive in the relative clause. When the thing is real and known, indicative. This is one of the most useful subjunctive uses for everyday speech — and one English speakers consistently miss.",
    sentences: [
      {
        spanish: "Busco un libro que sea fácil de leer.",
        english: "I'm looking for a book that's easy to read.",
        pronunciation: "BOOS-koh oon LEE-broh keh SEH-ah FAH-seel deh leh-EHR",
        note: "SUBJUNCTIVE 'sea' — the book doesn't exist yet for me; I'm searching for any that fits. Compare 'Tengo un libro que es fácil de leer' (indicative — specific real book I own).",
      },
      {
        spanish: "Necesito alguien que sepa hablar inglés.",
        english: "I need someone who knows English.",
        pronunciation: "neh-seh-SEE-toh ahl-GYEHN keh SEH-pah ah-BLAR een-GLEHS",
        note: "SEPA = present subjunctive of saber. Any English-speaker will do — the person is unspecified. Indicative 'sabe' would imply 'I need this particular person who happens to know English'.",
      },
      {
        spanish: "Conozco a alguien que habla cinco idiomas.",
        english: "I know someone who speaks five languages.",
        pronunciation: "koh-NOHS-koh ah ahl-GYEHN keh AH-blah SEEN-koh ee-DYOH-mahs",
        note: "HABLA (indicative) — the someone is REAL and KNOWN to me. Personal 'a' present because the someone is a person.",
      },
      {
        spanish: "No hay nadie que entienda esto.",
        english: "There's no one who understands this.",
        pronunciation: "noh ai NAH-dyeh keh ehn-TYEHN-dah EHS-toh",
        note: "ENTIENDA (subjunctive) — denied/nonexistent referent. 'Nadie que...' always takes subjunctive because the referent doesn't exist.",
      },
      {
        spanish: "¿Hay alguien aquí que hable francés?",
        english: "Is there anyone here who speaks French?",
        pronunciation: "ai ahl-GYEHN ah-KEE keh AH-bleh frahn-SEHS",
        note: "Question about uncertain existence → SUBJUNCTIVE 'hable'. If the answer comes back 'sí, hay alguien que HABLA francés' (indicative), the speaker confirms the person is real.",
      },
    ],
    grammar: [
      {
        point: "Real vs hypothetical antecedent",
        explanation:
          "Adjective clauses describe nouns. The mood of the verb in the clause depends on whether the noun's referent is REAL/SPECIFIC or HYPOTHETICAL/UNKNOWN. Real → indicative. Hypothetical → subjunctive. 'Quiero un coche que sea barato' (I want a car that's cheap — any car fitting that description) vs 'Tengo un coche que es barato' (I have a car that's cheap — my specific car).",
        examples: [
          { spanish: "Busco una casa que tenga jardín. (hypothetical)", english: "I'm looking for a house that has a garden." },
          { spanish: "Vivo en una casa que tiene jardín. (real)", english: "I live in a house that has a garden." },
        ],
      },
      {
        point: "Negation triggers subjunctive",
        explanation:
          "NO + verb + que clause almost always takes subjunctive because negation denies the referent's existence. 'No hay nadie que sepa' (there's no one who knows), 'No conozco a nadie que vaya' (I don't know anyone who's going), 'No hay nada que pueda hacer' (there's nothing I can do).",
      },
    ],
    cultural_note:
      "This is the subjunctive use that distinguishes 'I sound like a learner' from 'I sound like a fluent speaker'. English flattens the real/hypothetical distinction — 'I'm looking for a book that's easy' and 'I have a book that's easy' use the same verb form. Spanish speakers will instantly hear whether you say 'busco un libro que es' (sounds foreign) vs 'busco un libro que sea' (sounds native).",
    tip:
      "When you say BUSCO, NECESITO, QUIERO, or any verb that introduces a search for an unknown specific thing, expect subjunctive in the relative clause that describes it. Build the chunk: 'busco X que [subjunctive]'. Drill 20 of these. The pattern becomes automatic faster than the rule becomes intellectual.",
  },
  {
    id: "spanish_subjunctive_adverbial_clauses",
    level: "B2",
    category: "subjunctive_mastery",
    title: "Subjunctive in adverbial clauses",
    subtitle: "Cuando, hasta que, antes de que — future vs habitual",
    intro:
      "Time and purpose conjunctions sometimes take subjunctive, sometimes indicative. The rule depends on whether the event is HABITUAL/COMPLETED (indicative) or FUTURE/HYPOTHETICAL (subjunctive). Same conjunctions, two different uses — the mood disambiguates.",
    sentences: [
      {
        spanish: "Cuando llegues, llámame.",
        english: "When you arrive, call me.",
        pronunciation: "KWAHN-doh YEH-gehs, YAH-mah-meh",
        note: "FUTURE event → SUBJUNCTIVE 'llegues'. The arrival hasn't happened yet from the speaker's perspective.",
      },
      {
        spanish: "Cuando llego a casa, me ducho.",
        english: "When I get home, I shower.",
        pronunciation: "KWAHN-doh YEH-goh ah KAH-sah, meh DOO-choh",
        note: "HABITUAL event → INDICATIVE 'llego'. This happens every day as a routine. Same word 'cuando', completely different mood.",
      },
      {
        spanish: "Te espero hasta que termines.",
        english: "I'll wait until you finish.",
        pronunciation: "teh ehs-PEH-roh AHS-tah keh tehr-MEE-nehs",
        note: "FUTURE termination → SUBJUNCTIVE 'termines'. Future event after HASTA QUE.",
      },
      {
        spanish: "Para que entiendas, te lo explico de nuevo.",
        english: "So that you understand, I'll explain it again.",
        pronunciation: "PAH-rah keh ehn-TYEHN-dahs, teh loh ehks-PLEE-koh deh NWEH-boh",
        note: "PARA QUE always triggers subjunctive — purpose clauses are inherently future/hypothetical. Two-subject rule applies (yo explicar, tú entender).",
      },
      {
        spanish: "Antes de que te vayas, dame un abrazo.",
        english: "Before you leave, give me a hug.",
        pronunciation: "AHN-tehs deh keh teh BAH-yahs, DAH-meh oon ah-BRAH-soh",
        note: "ANTES DE QUE always subjunctive — the event hasn't happened yet by definition. Same logic for SIN QUE (without), CON TAL DE QUE (provided that), A MENOS QUE (unless).",
      },
    ],
    grammar: [
      {
        point: "Time conjunctions: future vs habitual",
        explanation:
          "These conjunctions take SUBJUNCTIVE when referring to a future event and INDICATIVE when referring to a habitual or past event: CUANDO, EN CUANTO, HASTA QUE, DESPUÉS DE QUE, MIENTRAS, TAN PRONTO COMO, UNA VEZ QUE. Test: can you replace the conjunction's verb with 'voy a + infinitive'? If yes (future-leaning), subjunctive. If no (habitual or completed), indicative.",
        examples: [
          { spanish: "En cuanto llegues, avísame. (future → subj)", english: "As soon as you arrive, let me know." },
          { spanish: "En cuanto llego, llamo. (habit → indic)", english: "As soon as I arrive, I call." },
        ],
      },
      {
        point: "Conjunctions that ALWAYS take subjunctive",
        explanation:
          "These never appear with indicative because they're inherently hypothetical/future/conditional: PARA QUE (so that), A FIN DE QUE (in order that), SIN QUE (without), ANTES DE QUE (before), A MENOS QUE (unless), CON TAL DE QUE (provided that), EN CASO DE QUE (in case), A NO SER QUE (unless). Memorize as a fixed list.",
      },
    ],
    cultural_note:
      "'Cuando llegue' vs 'cuando llego' is one of the cleanest tests of B2 mastery. Most English speakers default to whichever form they learned first and apply it everywhere. A Spanish speaker hears the mismatch instantly — 'cuando llegas mañana' (when you arrive tomorrow, using indicative for a future event) marks the speaker as still learning. The fluent move: pause briefly when you hit 'cuando' and ask: is this a habit (indicative) or a future event (subjunctive)?",
    tip:
      "When you start a sentence with CUANDO or EN CUANTO, the very next thing your brain should ask: 'is this future or habitual?' Future → subjunctive. Habitual → indicative. This binary disambiguates 90% of cases. Drill 20 pairs: 'cuando llego' (habit) / 'cuando llegue' (future).",
  },
  {
    id: "spanish_si_clauses_all_three",
    level: "B2",
    category: "subjunctive_mastery",
    title: "SI clauses — all three types",
    subtitle: "Real, hypothetical, unreal past — and mixed conditionals",
    intro:
      "B1 covered Types 1 and 2. B2 brings Type 3 (unreal past) into productive use and introduces mixed conditionals. By the end of this lesson, you should be able to express every conditional an English speaker can express.",
    sentences: [
      {
        spanish: "Si llueve, no salimos.",
        english: "If it rains, we don't go out.",
        pronunciation: "see YWEH-beh, noh sah-LEE-mohs",
        note: "TYPE 1 (real condition): si + PRESENT INDICATIVE + PRESENT/FUTURE/IMPERATIVE. Plausible scenario. Indicative throughout.",
      },
      {
        spanish: "Si lloviera, no saldríamos.",
        english: "If it rained, we wouldn't go out.",
        pronunciation: "see yoh-BYEH-rah, noh sahl-DREE-ah-mohs",
        note: "TYPE 2 (hypothetical): si + PAST SUBJUNCTIVE + CONDITIONAL. Counterfactual or unlikely current scenario. 'It isn't actually raining, but if it were...'",
      },
      {
        spanish: "Si hubiera llovido, no habríamos salido.",
        english: "If it had rained, we wouldn't have gone out.",
        pronunciation: "see oo-BYEH-rah yoh-BEE-doh, noh ah-BREE-ah-mohs sah-LEE-doh",
        note: "TYPE 3 (unreal past): si + PLUPERFECT SUBJUNCTIVE + CONDITIONAL PERFECT. Counterfactual past. 'It didn't rain, and we did go out, but if events had been different...'",
      },
      {
        spanish: "Si hubiera estudiado más, ahora sería médico.",
        english: "If I had studied more, I'd be a doctor now.",
        pronunciation: "see oo-BYEH-rah ehs-too-DYAH-doh mahs, ah-OH-rah seh-REE-ah MEH-dee-koh",
        note: "MIXED CONDITIONAL: Type 3 protasis (past unreal) + Type 2 apodosis (present hypothetical result). 'Past action would have changed my present.' Useful for regrets with current consequences.",
      },
      {
        spanish: "Si fuera por mí, ya nos habríamos ido.",
        english: "If it were up to me, we'd already have left.",
        pronunciation: "see FWEH-rah por mee, yah nohs ah-BREE-ah-mohs EE-doh",
        note: "MIXED CONDITIONAL (reverse): Type 2 protasis (present hypothetical) + Type 3 apodosis (past unreal result). 'Current state would have caused a past action.'",
      },
    ],
    grammar: [
      {
        point: "Pluperfect subjunctive — Type 3 forms",
        explanation:
          "HUBIERA (or HUBIESE) + past participle. Conjugate haber in past subjunctive (hubiera, hubieras, hubiera, hubiéramos, hubierais, hubieran). Add past participle: hubiera HABLADO, hubieras COMIDO, hubiera VIVIDO. Note: hubiera form dominant in speech; hubiese dominant in Peninsular literary writing.",
      },
      {
        point: "Conditional perfect — Type 3 result",
        explanation:
          "HABRÍA + past participle. Habría, habrías, habría, habríamos, habríais, habrían. + Past participle: habría HABLADO, habrías COMIDO, habría VIVIDO. Used in the apodosis (result clause) of Type 3. 'No habría venido' = I wouldn't have come.",
      },
      {
        point: "Mixed conditionals — when to use",
        explanation:
          "Standard Type 2 and Type 3 require both clauses to be in the same time frame. Mixed conditionals break this for natural meaning. PAST CONDITION → PRESENT RESULT: 'Si hubiera estudiado, ahora sería médico' (past study → current career). PRESENT CONDITION → PAST RESULT: 'Si fuera más valiente, le habría dicho la verdad' (current state of cowardice → past failure to speak). Spanish handles these gracefully where English often needs paraphrase.",
      },
    ],
    cultural_note:
      "Spanish handles mixed conditionals more naturally than English. An English speaker often paraphrases — 'If I had studied harder, my life would be different now' — where Spanish drops it in one clean sentence. Spanish speakers reach for mixed conditionals regularly in everyday speech, especially in conversations about regret, what-ifs, and counterfactual reasoning. Mastering these lifts your spoken Spanish a full register.",
    tip:
      "Build a personal example for each of the three types — preferably from your own life. 'Si tengo tiempo, voy al gimnasio.' / 'Si tuviera más tiempo, iría al gimnasio.' / 'Si hubiera ido al gimnasio ayer, me sentiría mejor hoy.' Personal stakes anchor the form. Practice cycling through the three types using the same vocabulary until the tense shifts feel natural.",
  },

  // ── 2. Passive voice ──────────────────────────────────────────────────
  {
    id: "spanish_passive_se",
    level: "B2",
    category: "passive_voice",
    title: "The passive SE",
    subtitle: "Se venden coches — the natural Spanish passive",
    intro:
      "Spanish has at least four ways to express passive voice. The PASSIVE SE is the most natural and most common in everyday Spanish. English speakers default to 'ser + participle' because it maps to English 'was X-ed', but that construction sounds journalistic or legalistic to Spanish speakers. The SE form sounds normal.",
    sentences: [
      {
        spanish: "Se venden coches usados.",
        english: "Used cars are sold (here). / We sell used cars.",
        pronunciation: "seh BEHN-dehn KOH-chehs oo-SAH-dohs",
        note: "The classic passive SE. Subject 'coches' is plural → verb 'venden' is plural. Word order is flexible: 'Coches usados se venden' also works.",
      },
      {
        spanish: "Aquí se habla español.",
        english: "Spanish is spoken here.",
        pronunciation: "ah-KEE seh AH-blah ehs-pah-NYOHL",
        note: "Subject 'español' singular → verb 'habla' singular. The sign equivalent of 'English spoken here' in Mexican border restaurants — appears in this exact form.",
      },
      {
        spanish: "Se publicaron tres libros el año pasado.",
        english: "Three books were published last year.",
        pronunciation: "seh poo-blee-KAH-rohn trehs LEE-brohs ehl AH-nyoh pah-SAH-doh",
        note: "PRETERITE passive SE. 'Libros' plural → 'publicaron' plural. The agent (who published them) is unstated and irrelevant — that's what passive voice is for.",
      },
      {
        spanish: "La casa fue construida en 1920.",
        english: "The house was built in 1920.",
        pronunciation: "lah KAH-sah fweh kohn-STREE-dah ehn meel noh-beh-SYEHN-tohs BEHN-teh",
        note: "SER + PARTICIPLE passive. More formal/journalistic register. Same meaning as 'Se construyó la casa en 1920' but feels more written. Participle agrees in gender/number with subject ('construida' for feminine 'casa').",
      },
      {
        spanish: "Está prohibido fumar.",
        english: "Smoking is prohibited.",
        pronunciation: "ehs-TAH proh-ee-BEE-doh foo-MAR",
        note: "ESTAR + PARTICIPLE = passive of STATE (the result of an action, not the action itself). Compare 'fue prohibido fumar' (the prohibiting happened, action) vs 'está prohibido' (the state exists, result).",
      },
    ],
    vocabulary: [
      { word: "se vende", english: "for sale (sing.)", pronunciation: "seh BEHN-deh", part_of_speech: "phrase" },
      { word: "se venden", english: "for sale (pl.)", pronunciation: "seh BEHN-dehn", part_of_speech: "phrase" },
      { word: "se busca", english: "wanted (help wanted)", pronunciation: "seh BOOS-kah", part_of_speech: "phrase" },
      { word: "se necesita", english: "needed", pronunciation: "seh neh-seh-SEE-tah", part_of_speech: "phrase" },
      { word: "se prohíbe", english: "is prohibited", pronunciation: "seh proh-EE-beh", part_of_speech: "phrase" },
      { word: "se ruega", english: "kindly requested", pronunciation: "seh RWEH-gah", part_of_speech: "phrase" },
      { word: "se alquila", english: "for rent", pronunciation: "seh ahl-KEE-lah", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Passive SE — formation",
        explanation:
          "SE + 3rd-person verb (agreeing in number with the grammatical subject). 'Se VENDE el coche' (singular). 'Se VENDEN los coches' (plural). The 'doer' is unstated — that's the whole point. If you want to state the doer, switch to active voice or ser+participle (with 'por').",
        examples: [
          { spanish: "Se construyó la casa. (passive SE)", english: "The house was built." },
          { spanish: "La casa fue construida por el arquitecto. (ser + participle, agent named)", english: "The house was built by the architect." },
        ],
      },
      {
        point: "The four-ways-of-passive map",
        explanation:
          "1) PASSIVE SE: 'Se vende' — most natural in speech. Agent unstated. 2) SER + PARTICIPLE: 'Fue construida' — formal/journalistic. Agent can be added with 'por'. 3) ESTAR + PARTICIPLE: 'Está prohibido' — describes a STATE (result), not the action. 4) IMPERSONAL 3rd PERSON PLURAL: 'Dicen que va a llover' (they say it's going to rain) — colloquial passive equivalent.",
      },
    ],
    cultural_note:
      "Spanish newspapers love SER + PARTICIPLE because it sounds authoritative ('La ley fue aprobada por el congreso'). Spanish friends and shop signs love SE ('Se vende', 'Se busca camarero'). If you're writing a formal report → ser + participle. If you're describing daily life → passive SE. Mismatching the register (using ser + participle in casual speech) sounds stilted; using SE in a legal document sounds unprofessional.",
    tip:
      "Override your English instinct. Where English defaults to 'was X-ed', Spanish prefers SE. Practice the swap: 'The keys were lost' → not 'Las llaves fueron perdidas' (sounds weird) but 'Se perdieron las llaves' (natural). 'The food is served at 8' → not 'La comida es servida a las 8' but 'Se sirve la comida a las 8' or just 'Sirven la comida a las 8'.",
  },
  {
    id: "spanish_impersonal_se",
    level: "B2",
    category: "passive_voice",
    title: "Impersonal SE vs passive SE",
    subtitle: "Se vive bien aquí — when SE means 'one' or 'people'",
    intro:
      "There's a second use of SE that English speakers conflate with the passive: the IMPERSONAL SE. Same word, slightly different grammar, different meaning. Passive SE has a grammatical subject (the thing being acted on); impersonal SE has no subject at all and means 'one' or 'people in general'.",
    sentences: [
      {
        spanish: "Se vive bien en este barrio.",
        english: "One lives well in this neighborhood. / People live well here.",
        pronunciation: "seh BEE-beh byehn ehn EHS-teh BAH-rryoh",
        note: "IMPERSONAL SE. No grammatical subject. Generic statement about life in the neighborhood. Always singular verb regardless of context.",
      },
      {
        spanish: "Se come muy bien en España.",
        english: "You eat very well in Spain. / People eat well in Spain.",
        pronunciation: "seh KOH-meh mwee byehn ehn ehs-PAH-nyah",
        note: "Generic statement about Spanish food/eating culture. Impersonal SE — no specific subject.",
      },
      {
        spanish: "Se trabaja mucho en este país.",
        english: "People work a lot in this country.",
        pronunciation: "seh trah-BAH-hah MOO-choh ehn EHS-teh pah-EES",
        note: "Cultural commentary. Impersonal SE — generalization about a population.",
      },
      {
        spanish: "Se venden coches.",
        english: "Cars are sold. / They sell cars.",
        pronunciation: "seh BEHN-dehn KOH-chehs",
        note: "PASSIVE SE (contrast). 'Coches' is the grammatical subject — plural, hence 'venden' plural. The cars are what get sold.",
      },
      {
        spanish: "¿Cómo se dice 'thanks' en español?",
        english: "How do you say 'thanks' in Spanish?",
        pronunciation: "KOH-moh seh DEE-seh thanks ehn ehs-pah-NYOHL",
        note: "Impersonal SE. The asker isn't asking what one specific person says — it's a general question about Spanish usage. Always singular verb.",
      },
    ],
    grammar: [
      {
        point: "The decision rule",
        explanation:
          "Look for a grammatical subject. If there IS one (a noun the verb agrees with): PASSIVE SE. 'Se venden coches' — coches is the subject. If there ISN'T one (the verb takes no object that 'rises' to subject position): IMPERSONAL SE. 'Se vive bien' — nothing is being lived; 'bien' is an adverb. The impersonal SE is ALWAYS singular because it has no subject to agree with.",
      },
      {
        point: "Why English speakers conflate them",
        explanation:
          "English uses 'one' or 'you' (generic) or passive voice for both: 'Cars are sold' (passive) and 'One lives well' (impersonal) feel similar. Spanish marks them differently — passive SE agrees with the subject (singular or plural); impersonal SE is always singular. 'Se VIVE bien' (singular, impersonal) vs 'Se VENDEN coches' (plural, passive — because coches is plural).",
      },
    ],
    cultural_note:
      "Travel guides and tourism slogans love impersonal SE because it makes generalizations sound objective: 'Aquí se come bien' (one eats well here) sounds like an established fact, while 'la gente come bien' (people eat well) sounds like the speaker's opinion. The impersonal construction is the language of guidebooks, restaurant reviews, and cultural commentary.",
    tip:
      "Train your ear by checking subject agreement. When you hear 'se + verb', ask: is the verb plural? If yes, you're hearing passive SE (with a subject). If singular and there's no obvious subject, you're hearing impersonal SE. After ~50 examples, the distinction feels natural and you can produce both correctly.",
  },
  {
    id: "spanish_ser_estar_participle",
    level: "B2",
    category: "passive_voice",
    title: "Ser vs Estar with participles",
    subtitle: "Fue construida vs Está construida — action vs state",
    intro:
      "Two of Spanish's four passive constructions use participles, but with different auxiliary verbs and meanings. SER + participle describes the ACTION (true passive). ESTAR + participle describes the resulting STATE (a kind of adjectival passive). The distinction is real and matters.",
    sentences: [
      {
        spanish: "La puerta fue cerrada por el viento.",
        english: "The door was closed by the wind.",
        pronunciation: "lah PWEHR-tah fweh seh-RRAH-dah por ehl BYEHN-toh",
        note: "SER + PARTICIPLE = true passive. The wind performed the action of closing. Agent named with 'por'. Focus is on the EVENT.",
      },
      {
        spanish: "La puerta está cerrada.",
        english: "The door is closed.",
        pronunciation: "lah PWEHR-tah ehs-TAH seh-RRAH-dah",
        note: "ESTAR + PARTICIPLE = state. Describes the door's current condition. Doesn't say who/what closed it. Focus is on the STATE.",
      },
      {
        spanish: "El libro fue escrito en 1999.",
        english: "The book was written in 1999.",
        pronunciation: "ehl LEE-broh fweh ehs-KREE-toh ehn meel noh-beh-SYEHN-tohs noh-BEHN-tah ee NWEH-beh",
        note: "Historical event. SER passive because we're describing when the writing happened (action). 'Está escrito' would mean 'it is written / it exists in written form'.",
      },
      {
        spanish: "El informe ya está terminado.",
        english: "The report is already finished.",
        pronunciation: "ehl een-FOR-meh yah ehs-TAH tehr-mee-NAH-doh",
        note: "ESTAR + PARTICIPLE. State of completion. Doesn't say who finished it or when. Focus on current state.",
      },
      {
        spanish: "El edificio está construido con materiales reciclados.",
        english: "The building is constructed with recycled materials.",
        pronunciation: "ehl eh-dee-FEE-syoh ehs-TAH kohn-STROO-EE-doh kohn mah-teh-RYAH-lehs reh-see-KLAH-dohs",
        note: "ESTAR — describing the building's current state/composition. SER ('fue construido con...') would emphasize the construction event.",
      },
    ],
    grammar: [
      {
        point: "Ser vs Estar with participles — the rule",
        explanation:
          "SER + participle = ACTION (focus on when/by whom). Often time-bounded. ESTAR + participle = STATE (focus on current condition, result of an earlier action). 'Fue cerrada' (the closing happened) vs 'está cerrada' (it's in a closed state). The participle agrees in gender and number with the subject in both cases.",
        examples: [
          { spanish: "El restaurante fue abierto en 2010. (action)", english: "The restaurant was opened in 2010." },
          { spanish: "El restaurante está abierto hasta las 11. (state)", english: "The restaurant is open until 11." },
        ],
      },
      {
        point: "Agreement of participle",
        explanation:
          "The participle agrees with the SUBJECT, not the agent. 'Las puertas fueron CERRADAS' (feminine plural agrees with puertas). 'Los libros están ESCRITOS' (masculine plural agrees with libros). Same rule for both SER and ESTAR constructions.",
      },
    ],
    cultural_note:
      "English uses 'is' or 'was' for both meanings: 'The door is closed' can describe a state OR an event (was just closed). Spanish forces you to commit — Está cerrada (state) vs Fue cerrada (event). News headlines often exploit this: 'El acusado fue declarado culpable' (the accused was declared guilty — at a specific moment) vs 'El acusado está declarado culpable' (the accused stands declared guilty — current state). Subtle but legally distinct.",
    tip:
      "When you're tempted to say 'is X-ed', ask yourself: am I describing the EVENT (when/by whom) or the STATE (current condition)? Event → SER. State → ESTAR. Most of the time you want ESTAR (the everyday 'the door is closed' meaning), so default to estar and switch to ser only when the action/agent matters.",
  },
  // ── 3. Idioms ─────────────────────────────────────────────────────────
  {
    id: "spanish_idioms_universal",
    level: "B2",
    category: "idioms",
    title: "Universal Spanish idioms",
    subtitle: "Idioms that travel across all Spanish-speaking countries",
    intro:
      "Some idioms are universally understood across the Spanish-speaking world. Master these first — they're high-utility and won't get you blank looks anywhere. Regional idioms come later.",
    sentences: [
      {
        spanish: "Me estás tomando el pelo, ¿verdad?",
        english: "You're pulling my leg, right?",
        pronunciation: "meh ehs-TAHS toh-MAHN-doh ehl PEH-loh, behr-DAHD",
        note: "TOMAR EL PELO = pull someone's leg, tease. Universal. The mental anchor: English 'pull your leg' / Spanish 'take your hair' — both body-part-grab-tease idioms.",
      },
      {
        spanish: "Estoy hasta las narices de este trabajo.",
        english: "I've had it up to here with this job.",
        pronunciation: "ehs-TOY AHS-tah lahs nah-REE-sehs deh EHS-teh trah-BAH-hoh",
        note: "HASTA LAS NARICES = fed up. Literally 'up to the noses'. Universal in Spanish-speaking world.",
      },
      {
        spanish: "Estaba en las nubes durante la reunión.",
        english: "I was daydreaming during the meeting.",
        pronunciation: "ehs-TAH-bah ehn lahs NOO-behs doo-RAHN-teh lah reh-oo-NYOHN",
        note: "ESTAR EN LAS NUBES = to have your head in the clouds. Universal. Same image as English.",
      },
      {
        spanish: "Tengo que ponerme las pilas si quiero aprobar.",
        english: "I need to get my act together if I want to pass.",
        pronunciation: "TEHN-goh keh poh-NEHR-meh lahs PEE-lahs see KYEH-roh ah-proh-BAR",
        note: "PONERSE LAS PILAS = put your batteries in, get going. Universal across LatAm and Spain.",
      },
      {
        spanish: "No hay mal que por bien no venga.",
        english: "Every cloud has a silver lining.",
        pronunciation: "noh ai mahl keh por byehn noh BEHN-gah",
        note: "Universal refrán (proverb). The Spanish-speaking world's go-to phrase for finding the upside in misfortune.",
      },
    ],
    vocabulary: [
      { word: "tomar el pelo", english: "to pull someone's leg", pronunciation: "toh-MAR ehl PEH-loh", part_of_speech: "phrase" },
      { word: "hasta las narices", english: "fed up", pronunciation: "AHS-tah lahs nah-REE-sehs", part_of_speech: "phrase" },
      { word: "estar en las nubes", english: "to daydream", pronunciation: "ehs-TAR ehn lahs NOO-behs", part_of_speech: "phrase" },
      { word: "ponerse las pilas", english: "to get going / hustle", pronunciation: "poh-NEHR-seh lahs PEE-lahs", part_of_speech: "phrase" },
      { word: "echar una mano", english: "to lend a hand", pronunciation: "eh-CHAR OO-nah MAH-noh", part_of_speech: "phrase" },
      { word: "dar en el clavo", english: "to hit the nail on the head", pronunciation: "dar ehn ehl KLAH-boh", part_of_speech: "phrase" },
      { word: "no tener pelos en la lengua", english: "to not mince words", pronunciation: "noh teh-NEHR PEH-lohs ehn lah LEHN-gwah", part_of_speech: "phrase" },
      { word: "más vale tarde que nunca", english: "better late than never", pronunciation: "mahs BAH-leh TAR-deh keh NOON-kah", part_of_speech: "phrase" },
    ],
    idiom_glosses: [
      { idiom: "tomar el pelo", literal: "to take the hair", figurative: "to tease, pull someone's leg", usage: "Used playfully. Not aggressive." },
      { idiom: "ponerse las pilas", literal: "to put one's batteries in", figurative: "to get one's act together", usage: "Self-motivation context. Common from parents and teachers." },
      { idiom: "dar en el clavo", literal: "to hit the nail", figurative: "to hit the nail on the head, be exactly right", usage: "Praise for accurate insight or guessing." },
    ],
    cultural_note:
      "Universal idioms travel across the entire Spanish-speaking world (Spain + 20 LatAm countries). They're safer than regional idioms for learners because you won't get blank looks no matter where you are. The proverbs (refranes) like 'no hay mal que por bien no venga' carry extra cultural weight.",
    tip:
      "Pick three universal idioms and force yourself to use one per day for a week. Don't try to learn 20 at once — you'll mix them up. Lock three in deep, then add three more.",
  },
  {
    id: "spanish_idioms_peninsular",
    level: "B2",
    category: "idioms",
    title: "Peninsular Spanish idioms",
    subtitle: "Estar como una cabra, ser la leche — Spain-specific",
    intro:
      "These idioms are common in Spain but may draw blank looks in Latin America. Learn them if you'll spend time in Spain; tag them mentally as 'Peninsular only' so you don't deploy them in Mexico City.",
    sentences: [
      {
        spanish: "Mi tío está como una cabra.",
        english: "My uncle is crazy (lit: like a goat).",
        pronunciation: "mee TEE-oh ehs-TAH KOH-moh OO-nah KAH-brah",
        note: "ESTAR COMO UNA CABRA = to be crazy (affectionately). Peninsular. In LatAm you'd say 'estar loco'.",
      },
      {
        spanish: "¡Ese chico es la leche!",
        english: "That guy is amazing! / That guy is the worst!",
        pronunciation: "EH-seh CHEE-koh ehs lah LEH-cheh",
        note: "SER LA LECHE = Peninsular slang. Context-dependent: 'awesome' or 'awful'. Almost exclusively Spain.",
      },
      {
        spanish: "Eso fue la monda.",
        english: "That was hilarious.",
        pronunciation: "EH-soh fweh lah MOHN-dah",
        note: "LA MONDA = Peninsular slang for hilarious. Mexicans would say 'estuvo chistosísimo'.",
      },
      {
        spanish: "Vamos a tomar algo, ¿te apuntas?",
        english: "We're going for a drink, you in?",
        pronunciation: "BAH-mohs ah toh-MAR AHL-goh, teh ah-POON-tahs",
        note: "APUNTARSE = to join in. Very Peninsular. LatAm would use '¿te animas?' or '¿vienes?'",
      },
      {
        spanish: "Está hecho polvo después del viaje.",
        english: "He's exhausted after the trip.",
        pronunciation: "ehs-TAH EH-choh POHL-boh dehs-PWEHS dehl BYAH-heh",
        note: "ESTAR HECHO POLVO = to be exhausted. Peninsular. LatAm uses 'estar muerto' or 'estar agotado'.",
      },
    ],
    vocabulary: [
      { word: "estar como una cabra", english: "to be crazy", pronunciation: "ehs-TAR KOH-moh OO-nah KAH-brah", part_of_speech: "phrase", regional: [{ region: "ES", form: "estar como una cabra", note: "Peninsular only." }] },
      { word: "ser la leche", english: "to be amazing / awful", pronunciation: "sehr lah LEH-cheh", part_of_speech: "phrase", regional: [{ region: "ES", form: "ser la leche" }] },
      { word: "la monda", english: "hilarious / absurd", pronunciation: "lah MOHN-dah", part_of_speech: "phrase", regional: [{ region: "ES", form: "la monda" }] },
      { word: "apuntarse", english: "to join in", pronunciation: "ah-poon-TAR-seh", part_of_speech: "verb", regional: [{ region: "ES", form: "apuntarse" }] },
      { word: "estar hecho polvo", english: "to be exhausted", pronunciation: "ehs-TAR EH-choh POHL-boh", part_of_speech: "phrase", regional: [{ region: "ES", form: "estar hecho polvo" }] },
      { word: "molar", english: "to be cool / to like", pronunciation: "moh-LAR", part_of_speech: "verb", regional: [{ region: "ES", form: "molar", note: "'Me mola esa canción'. Pure Spain." }] },
      { word: "currar", english: "to work (slang)", pronunciation: "koo-RRAR", part_of_speech: "verb", regional: [{ region: "ES", form: "currar", note: "Peninsular slang." }] },
    ],
    cultural_note:
      "Peninsular idioms can sound dated or affected if dropped into Latin American contexts. A Mexican friend hearing 'eres la leche' might smile but mentally tag the speaker as 'someone who learned Spanish in Spain'. Not wrong — just regionally marked.",
    tip:
      "Tag every Peninsular idiom you learn with a mental 'ES-only' sticker. The cost of a wrong-region idiom isn't huge — you'll get understood, just look foreign. If your audience is mixed or unknown, default to universal idioms.",
  },
  {
    id: "spanish_idioms_latam",
    level: "B2",
    category: "idioms",
    title: "Latin American Spanish idioms",
    subtitle: "Qué padre, estar pendiente, dar bola — by region",
    intro:
      "Latin American idioms vary by country. Mexican slang differs from Argentine, which differs from Colombian. Learn a small set from the country whose Spanish you encounter most.",
    sentences: [
      {
        spanish: "¡Qué padre está tu carro!",
        english: "Your car is so cool!",
        pronunciation: "keh PAH-dreh ehs-TAH too KAH-rroh",
        note: "QUÉ PADRE = how cool. Mexican only. In Spain padre means 'father' and 'qué padre' makes no sense.",
      },
      {
        spanish: "Estoy pendiente de tu mensaje.",
        english: "I'm waiting on your message.",
        pronunciation: "ehs-TOY pehn-DYEHN-teh deh too mehn-SAH-heh",
        note: "ESTAR PENDIENTE = to be attentive to / waiting for. Universal LatAm. Spain prefers 'estar esperando'.",
      },
      {
        spanish: "Che, ¿me das bola?",
        english: "Hey, are you paying attention to me?",
        pronunciation: "cheh, meh dahs BOH-lah",
        note: "DAR BOLA = pay attention. Argentine. 'Che' marks the speaker as Argentine.",
      },
      {
        spanish: "No le pares bola, está bromeando.",
        english: "Don't pay attention to him, he's joking.",
        pronunciation: "noh leh PAH-rehs BOH-lah, ehs-TAH broh-meh-AHN-doh",
        note: "PARAR BOLA = pay attention. Colombian and Venezuelan. Different from Argentine 'dar bola'.",
      },
      {
        spanish: "Esa película está chévere.",
        english: "That movie is great.",
        pronunciation: "EH-sah peh-LEE-koo-lah ehs-TAH CHEH-beh-reh",
        note: "CHÉVERE = cool. Caribbean (Venezuela, Colombia, Cuba). Mexicans use 'padre'; Argentines use 'copado'.",
      },
    ],
    vocabulary: [
      { word: "qué padre", english: "how cool (MX)", pronunciation: "keh PAH-dreh", part_of_speech: "phrase", regional: [{ region: "MX", form: "qué padre" }] },
      { word: "estar pendiente", english: "to be attentive / waiting", pronunciation: "ehs-TAR pehn-DYEHN-teh", part_of_speech: "phrase", regional: [{ region: "LATAM", form: "estar pendiente" }] },
      { word: "dar bola", english: "to pay attention (AR/UY)", pronunciation: "dar BOH-lah", part_of_speech: "phrase", regional: [{ region: "AR", form: "dar bola" }] },
      { word: "parar bola", english: "to pay attention (CO/VE)", pronunciation: "pah-RAR BOH-lah", part_of_speech: "phrase", regional: [{ region: "CO", form: "parar bola" }] },
      { word: "chévere", english: "cool / great", pronunciation: "CHEH-beh-reh", part_of_speech: "adj", regional: [{ region: "CO", form: "chévere", note: "Caribbean origin, spread widely." }] },
      { word: "chido", english: "cool (MX)", pronunciation: "CHEE-doh", part_of_speech: "adj", regional: [{ region: "MX", form: "chido" }] },
      { word: "copado", english: "cool (AR)", pronunciation: "koh-PAH-doh", part_of_speech: "adj", regional: [{ region: "AR", form: "copado" }] },
      { word: "bacán", english: "cool (CL/PE)", pronunciation: "bah-KAHN", part_of_speech: "adj", regional: [{ region: "CL", form: "bacán" }] },
    ],
    regional_variants: [
      { meaning: "cool / awesome", peninsular: "guay / mola", latam: "padre/chido (MX) · copado/bárbaro (AR) · chévere (Caribbean) · bacán (CL/PE/CO)", note: "Every country has its own 'cool' word." },
      { meaning: "to pay attention", peninsular: "prestar atención", latam: "dar bola (AR/UY) · parar bola (CO/VE) · hacer caso (MX)", note: "Same idea, completely different verb regionally." },
      { meaning: "to work (slang)", peninsular: "currar", latam: "chambear (MX) · laburar (AR/UY)", note: "Slang verbs for work are heavily regional." },
    ],
    cultural_note:
      "Latin American idiom geography maps to four major zones: MEXICAN → chido, padre, chambear. RIVER PLATE (AR/UY) → copado, laburar, che. ANDEAN (PE/BO/EC) → bacán, chévere. CARIBBEAN (CU/VE/CO coast/PR) → chévere, qué bola. Knowing the zone helps you match register.",
    tip:
      "Pick ONE Latin American country to anchor your idiomatic Spanish in. Master ~10 idioms from that country well. Don't try to be 'pan-Latin American' — even native speakers code-switch between regional registers.",
  },
  {
    id: "spanish_idioms_emotional",
    level: "B2",
    category: "idioms",
    title: "Emotional idioms",
    subtitle: "Body and animal metaphors for feelings",
    intro:
      "Spanish has a rich vocabulary for emotional states built around body parts and animals. These idioms make speech expressive and native-sounding.",
    sentences: [
      {
        spanish: "Se me hizo un nudo en la garganta.",
        english: "I got a lump in my throat.",
        pronunciation: "seh meh EE-soh oon NOO-doh ehn lah gar-GAHN-tah",
        note: "HACERSE UN NUDO EN LA GARGANTA = lump in throat from emotion. Universal. Same image as English.",
      },
      {
        spanish: "Tengo un nudo en el estómago.",
        english: "I have a knot in my stomach.",
        pronunciation: "TEHN-goh oon NOO-doh ehn ehl ehs-TOH-mah-goh",
        note: "TENER UN NUDO EN EL ESTÓMAGO = anxiety. Universal. Before exams, interviews, difficult conversations.",
      },
      {
        spanish: "Me dio un vuelco el corazón al verla.",
        english: "My heart skipped a beat when I saw her.",
        pronunciation: "meh dyoh oon BWEHL-koh ehl koh-rah-SOHN ahl BEHR-lah",
        note: "DAR UN VUELCO EL CORAZÓN = heart skip. Romantic or shock. Universal. Literary register.",
      },
      {
        spanish: "Está con el alma en un hilo.",
        english: "He's worried sick.",
        pronunciation: "ehs-TAH kohn ehl AHL-mah ehn oon EE-loh",
        note: "TENER EL ALMA EN UN HILO = anxious / worried sick. Universal. Often used waiting for important news.",
      },
      {
        spanish: "Sacó las uñas para defender a su hijo.",
        english: "She came out swinging to defend her son.",
        pronunciation: "sah-KOH lahs OO-nyahs PAH-rah deh-fehn-DEHR ah soo EE-hoh",
        note: "SACAR LAS UÑAS = to fight back. Animal metaphor — cat claws. Universal Spanish.",
      },
    ],
    vocabulary: [
      { word: "nudo en la garganta", english: "lump in throat", pronunciation: "NOO-doh ehn lah gar-GAHN-tah", part_of_speech: "phrase" },
      { word: "nudo en el estómago", english: "knot in stomach (anxiety)", pronunciation: "NOO-doh ehn ehl ehs-TOH-mah-goh", part_of_speech: "phrase" },
      { word: "dar un vuelco el corazón", english: "heart skipping a beat", pronunciation: "dar oon BWEHL-koh ehl koh-rah-SOHN", part_of_speech: "phrase" },
      { word: "tener el alma en un hilo", english: "to be worried sick", pronunciation: "teh-NEHR ehl AHL-mah ehn oon EE-loh", part_of_speech: "phrase" },
      { word: "sacar las uñas", english: "to fight back / get defensive", pronunciation: "sah-KAR lahs OO-nyahs", part_of_speech: "phrase" },
      { word: "morirse de risa", english: "to die laughing", pronunciation: "moh-REER-seh deh REE-sah", part_of_speech: "phrase" },
      { word: "estar de los nervios", english: "to be a bundle of nerves", pronunciation: "ehs-TAR deh lohs NEHR-byohs", part_of_speech: "phrase" },
    ],
    cultural_note:
      "Spanish emotional vocabulary leans physical and visceral. Where English might say 'I was anxious,' Spanish reaches for 'tenía un nudo en el estómago'. Using these body-based idioms makes your emotional Spanish sound felt rather than translated.",
    tip:
      "Build emotional idioms as PAIRS with their physical anchor. ANXIETY → nudo (knot). HEARTBREAK → corazón roto. SHOCK → vuelco. Each pair becomes a hook your brain can reach for under emotional pressure.",
  },
  {
    id: "spanish_proverbs",
    level: "B2",
    category: "idioms",
    title: "Spanish proverbs (refranes)",
    subtitle: "Folk wisdom every Spanish speaker knows",
    intro:
      "Refranes are short folk-wisdom phrases every Spanish speaker has heard from grandparents. Dropping one marks you as culturally embedded. Learn five well — enough to land them naturally.",
    sentences: [
      {
        spanish: "Más vale pájaro en mano que ciento volando.",
        english: "A bird in the hand is worth two in the bush.",
        pronunciation: "mahs BAH-leh PAH-hah-roh ehn MAH-noh keh SYEHN-toh boh-LAHN-doh",
        note: "Universal Spanish proverb. Same meaning as English.",
      },
      {
        spanish: "No es oro todo lo que reluce.",
        english: "All that glitters is not gold.",
        pronunciation: "noh ehs OH-roh TOH-doh loh keh reh-LOO-seh",
        note: "Universal. Same meaning as English. Warns against superficial appearances.",
      },
      {
        spanish: "En boca cerrada no entran moscas.",
        english: "A closed mouth catches no flies.",
        pronunciation: "ehn BOH-kah seh-RRAH-dah noh EHN-trahn MOHS-kahs",
        note: "Universal. Knowing when to keep quiet keeps you out of trouble.",
      },
      {
        spanish: "Quien mucho abarca, poco aprieta.",
        english: "Don't bite off more than you can chew.",
        pronunciation: "kyehn MOO-choh ah-BAR-kah, POH-koh ah-PRYEH-tah",
        note: "Universal. Cautions against over-commitment. Great in work contexts.",
      },
      {
        spanish: "A buen entendedor, pocas palabras bastan.",
        english: "A word to the wise is sufficient.",
        pronunciation: "ah bwehn ehn-tehn-deh-DOR, POH-kahs pah-LAH-brahs BAHS-tahn",
        note: "Universal. Often shortened to 'A buen entendedor...' — listener completes the rest mentally.",
      },
    ],
    vocabulary: [
      { word: "más vale", english: "it's better to / worth more", pronunciation: "mahs BAH-leh", part_of_speech: "phrase" },
      { word: "el refrán", english: "proverb / saying", pronunciation: "ehl reh-FRAHN", part_of_speech: "noun", gender: "m" },
      { word: "el dicho", english: "saying / popular phrase", pronunciation: "ehl DEE-choh", part_of_speech: "noun", gender: "m" },
      { word: "como dice el refrán", english: "as the saying goes", pronunciation: "KOH-moh DEE-seh ehl reh-FRAHN", part_of_speech: "phrase" },
    ],
    cultural_note:
      "Spanish-speaking grandparents deploy refranes like English-speaking ones use 'when I was your age'. A young person dropping a refrán signals respect for tradition. In business, a well-placed refrán can defuse tension. 'Quien mucho abarca, poco aprieta' in a project meeting is more persuasive than 'we should reduce scope' said five different ways.",
    tip:
      "Learn five refranes deeply, not 50 shallowly. Pick ones that match situations you commonly encounter — work meetings, family conversations. Drop one per week into real speech. Aim for natural fit, not vocabulary display.",
  },

  // ── 4. Business Spanish ───────────────────────────────────────────────
  {
    id: "spanish_business_meetings",
    level: "B2",
    category: "business_spanish",
    title: "Business meetings",
    subtitle: "Agendas, opening lines, taking the floor",
    intro:
      "Business Spanish has its own register — usted by default unless explicitly invited to tutear, formal connectors, and specific phrases for taking the floor, expressing disagreement diplomatically, and wrapping up. This lesson covers the meeting arc.",
    sentences: [
      {
        spanish: "Buenos días a todos. Vamos a comenzar con la reunión.",
        english: "Good morning everyone. We're going to begin the meeting.",
        pronunciation: "BWEH-nohs DEE-ahs ah TOH-dohs. BAH-mohs ah koh-mehn-SAR kohn lah reh-oo-NYOHN",
        note: "Standard meeting opener. 'A todos' assumes mixed-gender room — universal default.",
      },
      {
        spanish: "El primer punto del orden del día es el presupuesto.",
        english: "The first item on the agenda is the budget.",
        pronunciation: "ehl pree-MEHR POON-toh dehl OR-dehn dehl DEE-ah ehs ehl preh-soo-PWEHS-toh",
        note: "ORDEN DEL DÍA = agenda (literally 'order of the day'). PUNTO = item. Formal business register.",
      },
      {
        spanish: "Si me permite, quisiera añadir algo al respecto.",
        english: "If I may, I'd like to add something on that.",
        pronunciation: "see meh pehr-MEE-teh, kee-SYEH-rah ah-nyah-DEER AHL-goh ahl rehs-PEHK-toh",
        note: "Polite way to take the floor. SI ME PERMITE + QUISIERA — both softeners. Stack them for high formality.",
      },
      {
        spanish: "Discrepo con la propuesta, pero respeto la postura.",
        english: "I disagree with the proposal, but I respect the position.",
        pronunciation: "dees-KREH-poh kohn lah proh-PWEHS-tah, PEH-roh rehs-PEH-toh lah pohs-TOO-rah",
        note: "DISCREPAR = to disagree (formal). Softer and more professional than 'no estoy de acuerdo'. Always pair with respect language in business.",
      },
      {
        spanish: "Damos por concluida la reunión. Gracias a todos por su tiempo.",
        english: "We're calling the meeting to a close. Thanks everyone for your time.",
        pronunciation: "DAH-mohs por kohn-kloo-EE-dah lah reh-oo-NYOHN. GRAH-syahs ah TOH-dohs por soo TYEHM-poh",
        note: "DAR POR CONCLUIDO/A = to declare concluded. Standard closing formula.",
      },
    ],
    vocabulary: [
      { word: "la reunión", english: "meeting", pronunciation: "lah reh-oo-NYOHN", part_of_speech: "noun", gender: "f" },
      { word: "el orden del día", english: "agenda", pronunciation: "ehl OR-dehn dehl DEE-ah", part_of_speech: "phrase", gender: "m" },
      { word: "el punto", english: "item / point", pronunciation: "ehl POON-toh", part_of_speech: "noun", gender: "m" },
      { word: "discrepar", english: "to disagree (formal)", pronunciation: "dees-kreh-PAR", part_of_speech: "verb" },
      { word: "la propuesta", english: "proposal", pronunciation: "lah proh-PWEHS-tah", part_of_speech: "noun", gender: "f" },
      { word: "la postura", english: "position / stance", pronunciation: "lah pohs-TOO-rah", part_of_speech: "noun", gender: "f" },
      { word: "convocar", english: "to convene / call", pronunciation: "kohn-boh-KAR", part_of_speech: "verb" },
      { word: "el acta", english: "minutes (of meeting)", pronunciation: "ehl AHK-tah", part_of_speech: "noun", gender: "f" },
      { word: "la votación", english: "vote", pronunciation: "lah boh-tah-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "por unanimidad", english: "unanimously", pronunciation: "por oo-nah-nee-mee-DAHD", part_of_speech: "phrase" },
    ],
    dialogue: [
      {
        speaker: "Director",
        spanish: "Buenas tardes a todos. Hoy tenemos tres puntos en el orden del día.",
        english: "Good afternoon everyone. Today we have three items on the agenda.",
        pronunciation: "BWEH-nahs TAR-dehs ah TOH-dohs. oy teh-NEH-mohs trehs POON-tohs ehn ehl OR-dehn dehl DEE-ah",
        register: "formal",
      },
      {
        speaker: "Ana",
        spanish: "Si me permite, antes de empezar, ¿podríamos añadir el tema de personal?",
        english: "If I may, before we begin, could we add the staffing issue?",
        pronunciation: "see meh pehr-MEE-teh, AHN-tehs deh ehm-peh-SAR, poh-DREE-ah-mohs ah-nyah-DEER ehl TEH-mah deh pehr-soh-NAHL",
        register: "formal",
      },
      {
        speaker: "Director",
        spanish: "Por supuesto. Lo trataremos al final, en otros asuntos.",
        english: "Of course. We'll handle it at the end, under any other business.",
        pronunciation: "por soo-PWEHS-toh. loh trah-tah-REH-mohs ahl fee-NAHL, ehn OH-trohs ah-SOON-tohs",
        register: "formal",
      },
      {
        speaker: "Ana",
        spanish: "Perfecto, gracias.",
        english: "Perfect, thank you.",
        pronunciation: "pehr-FEHK-toh, GRAH-syahs",
        register: "formal",
      },
    ],
    cultural_note:
      "Spanish business culture preserves usted longer than English-speaking cultures preserve formal address. Even in Latin American startups where tú is more common, meetings often slip into usted for emphasis. The phrase 'permítame' (allow me) signals the speaker is about to say something they want you to take seriously.",
    tip:
      "Build TWO sets of meeting phrases: opener phrases ('Buenos días', 'Vamos a comenzar') and floor-taking phrases ('Si me permite', 'Quisiera añadir'). Memorize 3 of each. The opening phrases get you started; the floor-taking phrases let you contribute without rudely interrupting.",
  },
  {
    id: "spanish_business_emails",
    level: "B2",
    category: "business_spanish",
    title: "Business emails",
    subtitle: "Saludos formales, cuerpo, despedida",
    intro:
      "Spanish business emails follow a clearer template than English ones. Specific opener phrases, specific closer phrases — drop one of each into every business email and the form takes care of itself.",
    sentences: [
      {
        spanish: "Estimado señor García:",
        english: "Dear Mr. García:",
        pronunciation: "ehs-tee-MAH-doh seh-NYOR gar-SEE-ah",
        note: "ESTIMADO/A = formal opener for someone you've never met. Colon after, not comma (Spanish convention).",
      },
      {
        spanish: "Me dirijo a usted para informarle sobre nuestro nuevo producto.",
        english: "I'm writing to you to inform you about our new product.",
        pronunciation: "meh dee-REE-hoh ah oos-TEHD PAH-rah een-for-MAR-leh SOH-breh NWEHS-troh NWEH-boh proh-DOOK-toh",
        note: "ME DIRIJO A USTED = formal opener. PARA + infinitive states the purpose.",
      },
      {
        spanish: "Le adjunto el informe en formato PDF.",
        english: "I'm attaching the report in PDF format.",
        pronunciation: "leh ahd-HOON-toh ehl een-FOR-meh ehn for-MAH-toh peh-deh-EH",
        note: "ADJUNTAR = to attach. Use formal 'le' indirect pronoun with usted-form.",
      },
      {
        spanish: "Quedo a su disposición para cualquier consulta adicional.",
        english: "I remain at your disposal for any additional questions.",
        pronunciation: "KEH-doh ah soo dees-poh-see-SYOHN PAH-rah kwahl-KYEHR kohn-SOOL-tah ah-dee-syoh-NAHL",
        note: "QUEDAR A SU DISPOSICIÓN = standard pre-closing phrase. Equivalent of English 'Please let me know if you have any questions'.",
      },
      {
        spanish: "Atentamente, María Rodríguez",
        english: "Sincerely, María Rodríguez",
        pronunciation: "ah-tehn-tah-MEHN-teh, mah-REE-ah roh-DREE-gehs",
        note: "ATENTAMENTE = standard formal closing. UN CORDIAL SALUDO is also common and slightly warmer. UN ABRAZO is for friends, not business.",
      },
    ],
    vocabulary: [
      { word: "estimado/a", english: "Dear (formal)", pronunciation: "ehs-tee-MAH-doh", part_of_speech: "adj" },
      { word: "me dirijo a usted", english: "I am writing to you (formal)", pronunciation: "meh dee-REE-hoh ah oos-TEHD", part_of_speech: "phrase" },
      { word: "adjuntar", english: "to attach (a file)", pronunciation: "ahd-hoon-TAR", part_of_speech: "verb" },
      { word: "el adjunto", english: "attachment", pronunciation: "ehl ahd-HOON-toh", part_of_speech: "noun", gender: "m" },
      { word: "a su disposición", english: "at your disposal", pronunciation: "ah soo dees-poh-see-SYOHN", part_of_speech: "phrase" },
      { word: "atentamente", english: "Sincerely", pronunciation: "ah-tehn-tah-MEHN-teh", part_of_speech: "adv" },
      { word: "cordial saludo", english: "warm regards", pronunciation: "kor-DYAHL sah-LOO-doh", part_of_speech: "phrase" },
      { word: "acuso recibo", english: "I acknowledge receipt", pronunciation: "ah-KOO-soh reh-SEE-boh", part_of_speech: "phrase" },
      { word: "disculpe la demora", english: "I apologize for the delay", pronunciation: "dees-KOOL-peh lah deh-MOH-rah", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "The email template — opening, body, closing",
        explanation:
          "OPENING (formal): 'Estimado/a + title + surname:'. Less formal: 'Buenos días + first name,'. BODY: open with a purpose phrase ('Me dirijo a usted para...' or 'Le escribo para...'). State the matter. Use 'le' (formal indirect pronoun) throughout. PRE-CLOSING: 'Quedo a su disposición para cualquier consulta.' CLOSING: 'Atentamente,' or 'Un cordial saludo,' + name. The whole template fits 4-5 sentences for most business emails.",
      },
    ],
    cultural_note:
      "Spanish business email register slides faster toward informality than American. After 2-3 exchanges, even initially formal contacts often switch to 'Hola Maria' instead of 'Estimada Sra. García'. Don't initiate the shift — let the more senior or established party drop the formality first. Mismatched register reads as presumptuous.",
    tip:
      "Save TWO email templates in your drafts folder: a formal one (estimated/me dirijo/quedo a su disposición/atentamente) and a semi-formal one (buenos días/le escribo/un cordial saludo). Cut-and-fill these for 90% of business correspondence.",
  },
  {
    id: "spanish_business_negotiation",
    level: "B2",
    category: "business_spanish",
    title: "Negotiation language",
    subtitle: "Counter-offers, softening, finding common ground",
    intro:
      "Negotiation in Spanish leans on conditional verbs and softening expressions. Direct demands feel aggressive; conditional and hypothetical phrasing keeps the door open.",
    sentences: [
      {
        spanish: "¿Podríamos considerar una contraoferta?",
        english: "Could we consider a counter-offer?",
        pronunciation: "poh-DREE-ah-mohs kohn-see-deh-RAR OO-nah kohn-trah-oh-FEHR-tah",
        note: "PODRÍAMOS (conditional) + CONSIDERAR = soft opener. Doesn't reject the current offer; opens the door to alternatives.",
      },
      {
        spanish: "Si pudieran ajustar el precio, llegaríamos a un acuerdo.",
        english: "If you could adjust the price, we'd reach an agreement.",
        pronunciation: "see poo-DYEH-rahn ah-hoos-TAR ehl PREH-syoh, yeh-gah-REE-ah-mohs ah oon ah-KWEHR-doh",
        note: "Type 2 hypothetical. SI + past subjunctive + conditional. Frames your demand as something they can negotiate.",
      },
      {
        spanish: "Entiendo su postura, pero necesitamos encontrar un punto medio.",
        english: "I understand your position, but we need to find a middle ground.",
        pronunciation: "ehn-TYEHN-doh soo pohs-TOO-rah, PEH-roh neh-seh-see-TAH-mohs ehn-kohn-TRAR oon POON-toh MEH-dyoh",
        note: "Empathy + counterargument. ENTIENDO SU POSTURA validates them; PERO + 'punto medio' signals you want compromise.",
      },
      {
        spanish: "¿Hay algún margen de flexibilidad en el plazo de entrega?",
        english: "Is there any flexibility on the delivery deadline?",
        pronunciation: "ai ahl-GOON MAR-hehn deh flehk-see-bee-lee-DAHD ehn ehl PLAH-soh deh ehn-TREH-gah",
        note: "MARGEN DE FLEXIBILIDAD = wiggle room. Diplomatic way to ask whether something is movable without naming a specific number.",
      },
      {
        spanish: "Le propongo lo siguiente: nosotros aceptamos el precio, ustedes asumen el envío.",
        english: "Here's what I propose: we accept the price, you cover the shipping.",
        pronunciation: "leh proh-POHN-goh loh see-GYEHN-teh: noh-SOH-trohs ah-sehp-TAH-mohs ehl PREH-syoh, oos-TEH-dehs ah-SOO-mehn ehl ehn-BEE-oh",
        note: "LE PROPONGO LO SIGUIENTE = 'here's my proposal' phrase. Pairs concession + ask. Makes the trade explicit.",
      },
    ],
    vocabulary: [
      { word: "la contraoferta", english: "counter-offer", pronunciation: "lah kohn-trah-oh-FEHR-tah", part_of_speech: "noun", gender: "f" },
      { word: "ajustar", english: "to adjust", pronunciation: "ah-hoos-TAR", part_of_speech: "verb" },
      { word: "el acuerdo", english: "agreement", pronunciation: "ehl ah-KWEHR-doh", part_of_speech: "noun", gender: "m" },
      { word: "el punto medio", english: "middle ground", pronunciation: "ehl POON-toh MEH-dyoh", part_of_speech: "phrase" },
      { word: "el margen", english: "margin / leeway", pronunciation: "ehl MAR-hehn", part_of_speech: "noun", gender: "m" },
      { word: "la flexibilidad", english: "flexibility", pronunciation: "lah flehk-see-bee-lee-DAHD", part_of_speech: "noun", gender: "f" },
      { word: "asumir", english: "to take on / assume", pronunciation: "ah-soo-MEER", part_of_speech: "verb" },
      { word: "ceder", english: "to yield / give in", pronunciation: "seh-DEHR", part_of_speech: "verb" },
      { word: "la concesión", english: "concession", pronunciation: "lah kohn-seh-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "negociar", english: "to negotiate", pronunciation: "neh-goh-SYAR", part_of_speech: "verb" },
    ],
    cultural_note:
      "Negotiation in Spanish-speaking business cultures tends to be relationship-first, transaction-second. Diving straight into terms feels abrupt to Spanish, Mexican, Argentine, and Colombian counterparts (less so to Chilean). Spend the first 5-10 minutes on personal connection — family, recent travel, the weather — before opening the agenda.",
    tip:
      "Build a personal phrase bank of 5 negotiation softeners: 'Si me permite', 'Quisiera plantear', '¿Sería posible...?', 'Entiendo su postura, pero...', 'Le propongo lo siguiente'. And 5 moves: 'contraoferta', 'punto medio', 'margen de flexibilidad', 'acuerdo mutuamente beneficioso', 'asumir el coste de'.",
  },
  {
    id: "spanish_business_presentations",
    level: "B2",
    category: "business_spanish",
    title: "Presentations and pitches",
    subtitle: "Opening, structuring, closing — the presentation arc",
    intro:
      "Presentations follow a predictable arc: opener, agenda, content sections with connectors, conclusion, Q&A invitation. Master the structural phrases and you can deliver in Spanish with confidence.",
    sentences: [
      {
        spanish: "Buenos días. Soy María García y hoy les voy a hablar sobre nuestro nuevo producto.",
        english: "Good morning. I'm María García and today I'm going to talk to you about our new product.",
        pronunciation: "BWEH-nohs DEE-ahs. soy mah-REE-ah gar-SEE-ah ee oy lehs boy ah ah-BLAR SOH-breh NWEHS-troh NWEH-boh proh-DOOK-toh",
        note: "Standard opener. LES VOY A HABLAR = I'm going to talk to YOU (plural, formal). SOBRE = about/concerning.",
      },
      {
        spanish: "Mi presentación se divide en tres partes principales.",
        english: "My presentation is divided into three main parts.",
        pronunciation: "mee preh-sehn-tah-SYOHN seh dee-BEE-deh ehn trehs PAR-tehs preen-see-PAH-lehs",
        note: "Roadmap statement. SE DIVIDE EN = divides into. Specifying the number gives listeners a mental outline.",
      },
      {
        spanish: "Para empezar, me gustaría compartir algunos datos relevantes.",
        english: "To start, I'd like to share some relevant data.",
        pronunciation: "PAH-rah ehm-peh-SAR, meh goos-tah-REE-ah kohm-par-TEER ahl-GOO-nohs DAH-tohs reh-leh-BAHN-tehs",
        note: "Section transition. ME GUSTARÍA + infinitive = soft 'I would like to'.",
      },
      {
        spanish: "Como pueden ver en la pantalla, las ventas han aumentado un veinte por ciento.",
        english: "As you can see on the screen, sales have increased twenty percent.",
        pronunciation: "KOH-moh PWEH-dehn behr ehn lah pahn-TAH-yah, lahs BEHN-tahs ahn ow-mehn-TAH-doh oon BEHN-teh por SYEHN-toh",
        note: "Standard visual reference. COMO PUEDEN VER = as you can see (ustedes form).",
      },
      {
        spanish: "Para concluir, quedo abierto a sus preguntas.",
        english: "To conclude, I'm open to your questions.",
        pronunciation: "PAH-rah kohn-kloo-EER, KEH-doh ah-BYEHR-toh ah soos preh-GOON-tahs",
        note: "Standard closer + Q&A invitation. QUEDO ABIERTO/A A SUS PREGUNTAS — note feminine 'quedo abierta' if speaker is female.",
      },
    ],
    vocabulary: [
      { word: "la presentación", english: "presentation", pronunciation: "lah preh-sehn-tah-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "dividirse en", english: "to be divided into", pronunciation: "dee-bee-DEER-seh ehn", part_of_speech: "verb" },
      { word: "para empezar", english: "to start with", pronunciation: "PAH-rah ehm-peh-SAR", part_of_speech: "phrase" },
      { word: "en primer lugar", english: "in the first place", pronunciation: "ehn pree-MEHR loo-GAR", part_of_speech: "phrase" },
      { word: "como pueden ver", english: "as you can see", pronunciation: "KOH-moh PWEH-dehn behr", part_of_speech: "phrase" },
      { word: "la pantalla", english: "screen", pronunciation: "lah pahn-TAH-yah", part_of_speech: "noun", gender: "f" },
      { word: "la diapositiva", english: "slide", pronunciation: "lah dyah-poh-see-TEE-bah", part_of_speech: "noun", gender: "f" },
      { word: "para concluir", english: "to conclude", pronunciation: "PAH-rah kohn-kloo-EER", part_of_speech: "phrase" },
      { word: "el gráfico", english: "chart / graph", pronunciation: "ehl GRAH-fee-koh", part_of_speech: "noun", gender: "m" },
      { word: "los datos", english: "data / figures", pronunciation: "lohs DAH-tohs", part_of_speech: "noun", gender: "m" },
    ],
    cultural_note:
      "Spanish business presentations tend to be more discursive than American ones. American: bullet points, three takeaways, end. Spanish (especially Peninsular): more narrative, more context-setting. Latin American varies but sits between. Adjust delivery to the audience.",
    tip:
      "Build a presentation skeleton of 8 phrases — opener, agenda intro, three section transitions ('para empezar', 'a continuación', 'por último'), data reference ('como pueden ver'), conclusion, Q&A invitation. These 8 phrases handle the structural connective tissue of any presentation.",
  },

  // ── 5. News comprehension ─────────────────────────────────────────────
  {
    id: "spanish_news_headlines",
    level: "B2",
    category: "news_comprehension",
    title: "News headlines",
    subtitle: "Reading El País, Clarín, La Nación — headline conventions",
    intro:
      "Spanish news headlines have their own register. Articles often dropped, present tense used for past events, agent often omitted. Master the conventions and you can scan a Spanish newspaper at native speed.",
    sentences: [
      {
        spanish: "Gobierno aprueba nueva ley de educación.",
        english: "Government approves new education law.",
        pronunciation: "goh-BYEHR-noh ah-PRWEH-bah NWEH-bah lay deh eh-doo-kah-SYOHN",
        note: "Headline conventions: ARTICLE DROPPED, PRESENT TENSE for past event. Standard pattern.",
      },
      {
        spanish: "Muere artista de renombre internacional.",
        english: "Internationally renowned artist dies.",
        pronunciation: "MWEH-reh ar-TEES-tah deh reh-NOHM-breh een-tehr-nah-syoh-NAHL",
        note: "Present tense for an event that happened earlier. Headlines compress.",
      },
      {
        spanish: "Detenido sospechoso del robo en banco céntrico.",
        english: "Suspect detained in central bank robbery.",
        pronunciation: "deh-teh-NEE-doh sohs-peh-CHOH-soh dehl ROH-boh ehn BAHN-koh SEHN-tree-koh",
        note: "PASSIVE PARTICIPLE headline. Full sentence: 'Ha sido detenido un sospechoso' but headlines drop the auxiliary.",
      },
      {
        spanish: "Sube el precio de la gasolina por séptima semana consecutiva.",
        english: "Gasoline price rises for seventh consecutive week.",
        pronunciation: "SOO-beh ehl PREH-syoh deh lah gah-soh-LEE-nah por SEHP-tee-mah seh-MAH-nah kohn-seh-koo-TEE-bah",
        note: "SUBE + present tense + temporal phrase. Economic headline pattern.",
      },
      {
        spanish: "Polémica por declaraciones del ministro de Sanidad.",
        english: "Controversy over Health Minister's statements.",
        pronunciation: "poh-LEH-mee-kah por deh-klah-rah-SYOH-nehs dehl mee-NEES-troh deh sah-nee-DAHD",
        note: "NOMINAL HEADLINE — just a noun phrase, no verb. Common for ongoing stories.",
      },
    ],
    vocabulary: [
      { word: "el gobierno", english: "government", pronunciation: "ehl goh-BYEHR-noh", part_of_speech: "noun", gender: "m" },
      { word: "aprobar", english: "to approve (o→ue)", pronunciation: "ah-proh-BAR", part_of_speech: "verb" },
      { word: "la ley", english: "law", pronunciation: "lah lay", part_of_speech: "noun", gender: "f" },
      { word: "el sospechoso", english: "suspect", pronunciation: "ehl sohs-peh-CHOH-soh", part_of_speech: "noun", gender: "m" },
      { word: "detener", english: "to detain", pronunciation: "deh-teh-NEHR", part_of_speech: "verb" },
      { word: "la polémica", english: "controversy", pronunciation: "lah poh-LEH-mee-kah", part_of_speech: "noun", gender: "f" },
      { word: "el ministro / la ministra", english: "minister", pronunciation: "ehl mee-NEES-troh", part_of_speech: "noun" },
      { word: "las declaraciones", english: "statements", pronunciation: "lahs deh-klah-rah-SYOH-nehs", part_of_speech: "noun", gender: "f" },
      { word: "consecutivo/a", english: "consecutive", pronunciation: "kohn-seh-koo-TEE-boh", part_of_speech: "adj" },
      { word: "el alza", english: "rise / increase", pronunciation: "ehl AHL-sah", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "Headline conventions",
        explanation:
          "1) ARTICLES DROPPED: 'Gobierno aprueba ley' not 'El gobierno aprueba la ley'. 2) PRESENT TENSE for past events. 3) PARTICIPLE HEADLINES drop the auxiliary 'ha/han sido': 'Detenido sospechoso'. 4) NOMINAL HEADLINES with just noun phrases for ongoing stories. 5) AGENT OFTEN OMITTED.",
      },
    ],
    cultural_note:
      "Major Spanish-language newspapers: EL PAÍS (Spain, center-left), EL MUNDO (Spain, center-right), ABC (Spain, conservative). CLARÍN (Argentina, most-read), LA NACIÓN (Argentina, center-right). EL UNIVERSAL / REFORMA (Mexico). EL TIEMPO (Colombia). EL MERCURIO (Chile). LA JORNADA (Mexico, left). Reading the same story across two papers gives regional editorial voice.",
    tip:
      "Read one Spanish newspaper headline per day for two weeks. Don't try to read the full article — just headlines. Goal: build automatic recognition of the headline grammar so it stops confusing you.",
  },
  {
    id: "spanish_news_reported_speech",
    level: "B2",
    category: "news_comprehension",
    title: "Reported speech in journalism",
    subtitle: "Según el ministro / afirma que / declara que",
    intro:
      "Journalism uses specific verbs to introduce quotes and attribute statements, each carrying slightly different weight. Mastering these verbs lets you understand and produce news-style Spanish.",
    sentences: [
      {
        spanish: "Según el ministro, la economía crecerá un tres por ciento.",
        english: "According to the minister, the economy will grow three percent.",
        pronunciation: "seh-GOON ehl mee-NEES-troh, lah eh-koh-noh-MEE-ah kreh-seh-RAH oon trehs por SYEHN-toh",
        note: "SEGÚN = according to. Most common attribution. Hedges responsibility — the speaker isn't endorsing the claim, just reporting it.",
      },
      {
        spanish: "El presidente afirma que no habrá nuevos impuestos.",
        english: "The president states there will be no new taxes.",
        pronunciation: "ehl preh-see-DEHN-teh ah-FEER-mah keh noh ah-BRAH NWEH-bohs eem-PWEHS-tohs",
        note: "AFIRMAR = to state, affirm. Stronger than 'dice' — implies a formal declaration.",
      },
      {
        spanish: "La ONU declara que la situación es crítica.",
        english: "The UN declares the situation is critical.",
        pronunciation: "lah OH-noo deh-KLAH-rah keh lah see-twah-SYOHN ehs KREE-tee-kah",
        note: "DECLARAR = to declare. Formal, often institutional. Used for official positions, court rulings.",
      },
      {
        spanish: "Fuentes oficiales aseguran que el acuerdo se firmará la próxima semana.",
        english: "Official sources assure the agreement will be signed next week.",
        pronunciation: "FWEHN-tehs oh-fee-SYAH-lehs ah-seh-GOO-rahn keh ehl ah-KWEHR-doh seh feer-mah-RAH lah PROHK-see-mah seh-MAH-nah",
        note: "FUENTES OFICIALES = official sources. ASEGURAR = to assure. When journalists don't name sources but want to signal credibility.",
      },
      {
        spanish: "El acusado niega haber cometido el delito.",
        english: "The accused denies having committed the crime.",
        pronunciation: "ehl ah-koo-SAH-doh NYEH-gah ah-BEHR koh-meh-TEE-doh ehl deh-LEE-toh",
        note: "NEGAR + INFINITIVE PERFECT = to deny having done something. Standard legal/crime story formula.",
      },
    ],
    vocabulary: [
      { word: "según", english: "according to", pronunciation: "seh-GOON", part_of_speech: "prep" },
      { word: "afirmar", english: "to state / affirm", pronunciation: "ah-feer-MAR", part_of_speech: "verb" },
      { word: "declarar", english: "to declare", pronunciation: "deh-klah-RAR", part_of_speech: "verb" },
      { word: "asegurar", english: "to assure", pronunciation: "ah-seh-goo-RAR", part_of_speech: "verb" },
      { word: "negar", english: "to deny (e→ie)", pronunciation: "neh-GAR", part_of_speech: "verb" },
      { word: "las fuentes", english: "sources", pronunciation: "lahs FWEHN-tehs", part_of_speech: "noun", gender: "f" },
      { word: "el acusado / la acusada", english: "accused", pronunciation: "ehl ah-koo-SAH-doh", part_of_speech: "noun" },
      { word: "el delito", english: "crime / offense", pronunciation: "ehl deh-LEE-toh", part_of_speech: "noun", gender: "m" },
      { word: "el portavoz / la portavoz", english: "spokesperson", pronunciation: "ehl por-tah-BOHS", part_of_speech: "noun" },
      { word: "el comunicado", english: "press release / statement", pronunciation: "ehl koh-moo-nee-KAH-doh", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "Attribution verbs and their weight",
        explanation:
          "DECIR = neutral, weakest. AFIRMAR = formal statement. DECLARAR = official declaration. ASEGURAR = vouches for credibility. SOSTENER = maintains a position (often disputed). NEGAR = denies. RECONOCER = acknowledges (often something the subject didn't want to admit). ADVERTIR = warns. Choice of verb signals the journalist's framing.",
      },
    ],
    cultural_note:
      "Spanish journalism is more openly partisan than American mainstream journalism — papers wear their political alignment on their sleeves, and word choice reflects it. The same event might be 'la manifestación' (sympathetic) or 'la concentración' (distant) or 'el alboroto' (hostile). Pay attention to verb-noun pairs your paper uses.",
    tip:
      "When you read a Spanish news article, mentally tag every attribution verb. 'X afirma' (formal statement), 'X sostiene' (contested claim), 'X reconoce' (forced admission)? The verb choice is the framing.",
  },
  {
    id: "spanish_news_economic",
    level: "B2",
    category: "news_comprehension",
    title: "Economic and political news",
    subtitle: "Vocabulary for headlines about inflation, elections, policy",
    intro:
      "Economic and political news has a dense vocabulary that doesn't appear in everyday speech. Master it once and major newspapers become readable.",
    sentences: [
      {
        spanish: "La inflación interanual alcanzó un cinco coma dos por ciento.",
        english: "Year-on-year inflation reached 5.2 percent.",
        pronunciation: "lah een-flah-SYOHN een-teh-rah-NWAHL ahl-kahn-SOH oon SEEN-koh KOH-mah dohs por SYEHN-toh",
        note: "INTERANUAL = year-on-year. COMA = decimal separator in Spanish (5.2 → 5,2 in Spanish).",
      },
      {
        spanish: "El Banco Central subió las tasas de interés cincuenta puntos básicos.",
        english: "The Central Bank raised interest rates 50 basis points.",
        pronunciation: "ehl BAHN-koh sehn-TRAHL soo-BYOH lahs TAH-sahs deh een-teh-REHS seen-KWEHN-tah POON-tohs BAH-see-kohs",
        note: "TASAS DE INTERÉS = interest rates. PUNTOS BÁSICOS = basis points (1/100 of a percent).",
      },
      {
        spanish: "El gobierno presentó un plan de estímulo fiscal.",
        english: "The government presented a fiscal stimulus plan.",
        pronunciation: "ehl goh-BYEHR-noh preh-sehn-TOH oon plahn deh ehs-TEE-moo-loh fees-KAHL",
        note: "ESTÍMULO FISCAL = fiscal stimulus. PRESENTAR = to present. Standard policy announcement phrasing.",
      },
      {
        spanish: "La oposición denuncia irregularidades en el proceso electoral.",
        english: "The opposition denounces irregularities in the electoral process.",
        pronunciation: "lah oh-poh-see-SYOHN deh-NOON-syah ee-rreh-goo-lah-ree-DAH-dehs ehn ehl proh-SEH-soh eh-lehk-toh-RAHL",
        note: "DENUNCIAR = to denounce / publicly accuse. OPOSICIÓN / OFICIALISMO = standard pairing for opposition / ruling party.",
      },
      {
        spanish: "Los comicios se celebrarán el próximo veintiocho de mayo.",
        english: "The elections will be held on May 28.",
        pronunciation: "lohs koh-MEE-syohs seh seh-leh-brah-RAHN ehl PROHK-see-moh behn-tee-OH-choh deh MAH-yoh",
        note: "COMICIOS = elections (formal/journalistic synonym for 'elecciones'). CELEBRARSE = to be held (passive SE).",
      },
    ],
    vocabulary: [
      { word: "la inflación", english: "inflation", pronunciation: "lah een-flah-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "la tasa", english: "rate", pronunciation: "lah TAH-sah", part_of_speech: "noun", gender: "f" },
      { word: "el banco central", english: "central bank", pronunciation: "ehl BAHN-koh sehn-TRAHL", part_of_speech: "phrase" },
      { word: "el estímulo", english: "stimulus", pronunciation: "ehl ehs-TEE-moo-loh", part_of_speech: "noun", gender: "m" },
      { word: "fiscal", english: "fiscal", pronunciation: "fees-KAHL", part_of_speech: "adj" },
      { word: "la oposición", english: "opposition", pronunciation: "lah oh-poh-see-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "el oficialismo", english: "the ruling party", pronunciation: "ehl oh-fee-SYAH-lees-moh", part_of_speech: "noun", gender: "m" },
      { word: "los comicios", english: "elections (formal)", pronunciation: "lohs koh-MEE-syohs", part_of_speech: "noun", gender: "m" },
      { word: "denunciar", english: "to denounce / report", pronunciation: "deh-noon-SYAR", part_of_speech: "verb" },
      { word: "la jornada electoral", english: "election day", pronunciation: "lah hor-NAH-dah eh-lehk-toh-RAHL", part_of_speech: "phrase" },
      { word: "el escrutinio", english: "vote count / scrutiny", pronunciation: "ehl ehs-kroo-TEE-nyoh", part_of_speech: "noun", gender: "m" },
      { word: "la encuesta", english: "poll", pronunciation: "lah ehn-KWEHS-tah", part_of_speech: "noun", gender: "f" },
    ],
    cultural_note:
      "Decimal separators differ. Spanish-speaking countries use COMMA (5,2) where English uses PERIOD (5.2). Thousands separator is PERIOD or SPACE (1.000.000) where English uses COMMA (1,000,000). Spain and most of LatAm follow this. Mexico is the major exception — uses the English convention.",
    tip:
      "Build a 'numbers reading' habit when scanning Spanish economic news. Every percentage, every monetary figure — pause, read the number aloud, internalize the comma-vs-period flip. Mexican publications need the reverse.",
  },
  {
    id: "spanish_news_op_eds",
    level: "B2",
    category: "news_comprehension",
    title: "Opinion pieces and editorials",
    subtitle: "Stance markers, rhetorical questions, persuasive vocabulary",
    intro:
      "Opinion writing in Spanish leans more openly rhetorical than American journalism. Editorials use stance markers, rhetorical questions, and concession-then-rebuttal moves. Recognize these and you can read between the lines.",
    sentences: [
      {
        spanish: "Claramente, la reforma educativa no ha tenido el efecto esperado.",
        english: "Clearly, the education reform hasn't had the expected effect.",
        pronunciation: "klah-rah-MEHN-teh, lah reh-FOR-mah eh-doo-kah-TEE-bah noh ah teh-NEE-doh ehl eh-FEHK-toh ehs-peh-RAH-doh",
        note: "CLARAMENTE = stance marker. Tells the reader the author finds this self-evident. Often signals a critique to follow.",
      },
      {
        spanish: "¿Acaso no es hora de replantear nuestra estrategia?",
        english: "Is it not time to rethink our strategy?",
        pronunciation: "ah-KAH-soh noh ehs OH-rah deh reh-plahn-teh-AR NWEHS-trah ehs-trah-TEH-hyah",
        note: "ACASO + rhetorical question. Doesn't expect an answer. The 'no' is part of the rhetorical structure.",
      },
      {
        spanish: "Si bien es cierto que la economía ha mejorado, queda mucho por hacer.",
        english: "While it's true that the economy has improved, much remains to be done.",
        pronunciation: "see byehn ehs SYEHR-toh keh lah eh-koh-noh-MEE-ah ah meh-hoh-RAH-doh, KEH-dah MOO-choh por ah-SEHR",
        note: "SI BIEN ES CIERTO QUE = while it's true that. Concession marker. Signals pivot to rebuttal.",
      },
      {
        spanish: "La gran pregunta es: ¿quién pagará el coste de esta reforma?",
        english: "The big question is: who will pay for this reform?",
        pronunciation: "lah grahn preh-GOON-tah ehs: kyehn pah-gah-RAH ehl KOHS-teh deh EHS-tah reh-FOR-mah",
        note: "LA GRAN PREGUNTA ES = signals a central editorial point. Often followed by a rhetorical question that frames the issue.",
      },
      {
        spanish: "No nos engañemos: este problema lleva años sin resolverse.",
        english: "Let's not fool ourselves: this problem has been unresolved for years.",
        pronunciation: "noh nohs ehn-gah-NYEH-mohs: EHS-teh proh-BLEH-mah YEH-bah AH-nyohs seen reh-sohl-BEHR-seh",
        note: "NO NOS ENGAÑEMOS = strong stance opener. Imperative draws the reader into the author's perspective.",
      },
    ],
    vocabulary: [
      { word: "claramente", english: "clearly", pronunciation: "klah-rah-MEHN-teh", part_of_speech: "adv" },
      { word: "sin duda", english: "without a doubt", pronunciation: "seen DOO-dah", part_of_speech: "phrase" },
      { word: "evidentemente", english: "evidently", pronunciation: "eh-bee-dehn-teh-MEHN-teh", part_of_speech: "adv" },
      { word: "acaso", english: "perhaps / by chance (rhetorical)", pronunciation: "ah-KAH-soh", part_of_speech: "adv" },
      { word: "si bien", english: "although / while", pronunciation: "see byehn", part_of_speech: "conj" },
      { word: "no obstante", english: "nevertheless", pronunciation: "noh ohbs-TAHN-teh", part_of_speech: "phrase" },
      { word: "sin embargo", english: "however", pronunciation: "seen ehm-BAR-goh", part_of_speech: "phrase" },
      { word: "es preciso", english: "it's necessary", pronunciation: "ehs preh-SEE-soh", part_of_speech: "phrase" },
      { word: "cabe destacar", english: "it's worth highlighting", pronunciation: "KAH-beh dehs-tah-KAR", part_of_speech: "phrase" },
      { word: "replantear", english: "to rethink / reconsider", pronunciation: "reh-plahn-teh-AR", part_of_speech: "verb" },
    ],
    cultural_note:
      "Spanish editorial culture has a longer tradition of literary, openly opinionated writing than American journalism. Famous columnists (Pérez-Reverte in El País, Aguilar Camín in Mexico, Lanata in Argentina) write with personal voice and rhetorical flourish that American op-ed pages would consider too literary.",
    tip:
      "When reading Spanish opinion pieces, highlight every stance marker. Count them. A piece with many is heavily editorial. A piece with few is more reportorial. The density of stance markers is your guide to how much the author is asserting vs reporting.",
  },

  // ── 6. Debate basics ──────────────────────────────────────────────────
  {
    id: "spanish_debate_connectors",
    level: "B2",
    category: "debate_basics",
    title: "Discourse connectors",
    subtitle: "Sin embargo, no obstante, por consiguiente",
    intro:
      "Discourse connectors are the connective tissue of B2 argumentative speech. Learning a handful well lifts your prose from B1 to B2 immediately. Each carries slightly different weight.",
    sentences: [
      {
        spanish: "El plan es ambicioso. Sin embargo, requiere financiación adicional.",
        english: "The plan is ambitious. However, it requires additional funding.",
        pronunciation: "ehl plahn ehs ahm-bee-SYOH-soh. seen ehm-BAR-goh, reh-KYEH-reh fee-nahn-syah-SYOHN ah-dee-syoh-NAHL",
        note: "SIN EMBARGO = however. Strongest, most neutral contrast connector. Universal across formal and informal Spanish.",
      },
      {
        spanish: "Los datos son claros. No obstante, hay que interpretarlos con cuidado.",
        english: "The data is clear. Nevertheless, we must interpret it carefully.",
        pronunciation: "lohs DAH-tohs sohn KLAH-rohs. noh ohbs-TAHN-teh, ai keh een-tehr-preh-TAR-lohs kohn KWEE-dah-doh",
        note: "NO OBSTANTE = nevertheless. Slightly more formal than 'sin embargo'.",
      },
      {
        spanish: "El proyecto no cumplió las expectativas. Por consiguiente, debemos revisar el enfoque.",
        english: "The project didn't meet expectations. Consequently, we must review the approach.",
        pronunciation: "ehl proh-YEHK-toh noh koom-PLYOH lahs ehks-pehk-tah-TEE-bahs. por kohn-see-GYEHN-teh, deh-BEH-mohs reh-bee-SAR ehl ehn-FOH-keh",
        note: "POR CONSIGUIENTE = consequently. Formal cause-effect connector.",
      },
      {
        spanish: "Por un lado, queremos crecer; por otro lado, tenemos que mantener la calidad.",
        english: "On one hand, we want to grow; on the other hand, we have to maintain quality.",
        pronunciation: "por oon LAH-doh, keh-REH-mohs kreh-SEHR; por OH-troh LAH-doh, teh-NEH-mohs keh mahn-teh-NEHR lah kah-lee-DAHD",
        note: "POR UN LADO ... POR OTRO LADO = balanced contrast. Often used to lay out a dilemma.",
      },
      {
        spanish: "Es una buena idea. Es más, deberíamos implementarla cuanto antes.",
        english: "It's a good idea. Furthermore, we should implement it as soon as possible.",
        pronunciation: "ehs OO-nah BWEH-nah ee-DEH-ah. ehs mahs, deh-beh-REE-ah-mohs eem-pleh-mehn-TAR-lah KWAHN-toh AHN-tehs",
        note: "ES MÁS = furthermore. Addition connector that adds weight. Stronger than 'además' which just adds.",
      },
    ],
    vocabulary: [
      { word: "sin embargo", english: "however", pronunciation: "seen ehm-BAR-goh", part_of_speech: "phrase" },
      { word: "no obstante", english: "nevertheless", pronunciation: "noh ohbs-TAHN-teh", part_of_speech: "phrase" },
      { word: "por consiguiente", english: "consequently", pronunciation: "por kohn-see-GYEHN-teh", part_of_speech: "phrase" },
      { word: "por lo tanto", english: "therefore", pronunciation: "por loh TAHN-toh", part_of_speech: "phrase" },
      { word: "por un lado / por otro lado", english: "on one hand / on the other", pronunciation: "por oon LAH-doh / por OH-troh LAH-doh", part_of_speech: "phrase" },
      { word: "es más", english: "furthermore", pronunciation: "ehs mahs", part_of_speech: "phrase" },
      { word: "además", english: "in addition", pronunciation: "ah-deh-MAHS", part_of_speech: "adv" },
      { word: "asimismo", english: "likewise / also (formal)", pronunciation: "ah-see-MEES-moh", part_of_speech: "adv" },
      { word: "en cambio", english: "in contrast / instead", pronunciation: "ehn KAHM-byoh", part_of_speech: "phrase" },
      { word: "en cualquier caso", english: "in any case", pronunciation: "ehn kwahl-KYEHR KAH-soh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Connector families",
        explanation:
          "CONTRAST: sin embargo, no obstante, en cambio, por el contrario, ahora bien. ADDITION: además, asimismo, es más, por otro lado. CAUSE-EFFECT: por lo tanto, por consiguiente, así pues, en consecuencia. EXEMPLIFICATION: por ejemplo, así, en concreto. CONCLUSION: en conclusión, en definitiva, en suma, finalmente. ENUMERATION: en primer lugar, en segundo lugar, por último.",
      },
    ],
    cultural_note:
      "Spanish-language essays and editorials weight connectors more heavily than English ones. A well-constructed Spanish argument has visible connective tissue every 2-3 sentences. American academic English tends to bury connectors more subtly. Spanish readers expect to be guided. When you write Spanish, signpost more than feels necessary to your English ear.",
    tip:
      "Pick THREE contrast connectors, THREE addition connectors, and TWO cause-effect connectors. Drill these eight phrases until automatic. With these eight, you can connect almost any argument in fluent Spanish.",
  },
  {
    id: "spanish_debate_stance",
    level: "B2",
    category: "debate_basics",
    title: "Stating and supporting a position",
    subtitle: "Defender una postura, argumentar, justificar",
    intro:
      "Debate requires you to state a position, support it, anticipate counterarguments, and rebut. Each move has its own phrases. Master the toolkit and you can hold your own in any Spanish-language argument.",
    sentences: [
      {
        spanish: "Sostengo que la educación pública debería ser gratuita para todos.",
        english: "I maintain that public education should be free for all.",
        pronunciation: "sohs-TEHN-goh keh lah eh-doo-kah-SYOHN POO-blee-kah deh-beh-REE-ah sehr grah-TWEE-tah PAH-rah TOH-dohs",
        note: "SOSTENER = to maintain (a position). Stronger than 'creer' or 'pensar'. Used when defending a thesis.",
      },
      {
        spanish: "Mi argumento se basa en tres puntos principales.",
        english: "My argument rests on three main points.",
        pronunciation: "mee ar-goo-MEHN-toh seh BAH-sah ehn trehs POON-tohs preen-see-PAH-lehs",
        note: "BASARSE EN = to be based on. Standard phrase for stating the structure of your argument.",
      },
      {
        spanish: "Para sustentar esta postura, voy a presentar dos evidencias.",
        english: "To support this position, I'm going to present two pieces of evidence.",
        pronunciation: "PAH-rah soos-tehn-TAR EHS-tah pohs-TOO-rah, boy ah preh-sehn-TAR dohs eh-bee-DEHN-syahs",
        note: "SUSTENTAR = to support (a position with evidence). More formal than 'apoyar'. Common in debate and academic contexts.",
      },
      {
        spanish: "Reconozco que hay argumentos en contra, pero no son determinantes.",
        english: "I acknowledge there are counterarguments, but they're not decisive.",
        pronunciation: "reh-koh-NOHS-koh keh ai ar-goo-MEHN-tohs ehn KOHN-trah, PEH-roh noh sohn deh-tehr-mee-NAHN-tehs",
        note: "RECONOCER = to acknowledge. Concession move. Shows you've considered the other side.",
      },
      {
        spanish: "Esta línea de razonamiento conduce a una conclusión clara.",
        english: "This line of reasoning leads to a clear conclusion.",
        pronunciation: "EHS-tah LEE-neh-ah deh rah-soh-nah-MYEHN-toh kohn-DOO-seh ah OO-nah kohn-kloo-SYOHN KLAH-rah",
        note: "LÍNEA DE RAZONAMIENTO = line of reasoning. CONDUCIR A = to lead to. Standard 'closing the argument' phrase.",
      },
    ],
    vocabulary: [
      { word: "sostener", english: "to maintain (position)", pronunciation: "sohs-teh-NEHR", part_of_speech: "verb" },
      { word: "el argumento", english: "argument", pronunciation: "ehl ar-goo-MEHN-toh", part_of_speech: "noun", gender: "m" },
      { word: "basarse en", english: "to be based on", pronunciation: "bah-SAR-seh ehn", part_of_speech: "verb" },
      { word: "sustentar", english: "to support (with evidence)", pronunciation: "soos-tehn-TAR", part_of_speech: "verb" },
      { word: "la postura", english: "stance / position", pronunciation: "lah pohs-TOO-rah", part_of_speech: "noun", gender: "f" },
      { word: "la evidencia", english: "evidence", pronunciation: "lah eh-bee-DEHN-syah", part_of_speech: "noun", gender: "f" },
      { word: "reconocer", english: "to acknowledge", pronunciation: "reh-koh-noh-SEHR", part_of_speech: "verb" },
      { word: "el razonamiento", english: "reasoning", pronunciation: "ehl rah-soh-nah-MYEHN-toh", part_of_speech: "noun", gender: "m" },
      { word: "determinante", english: "decisive", pronunciation: "deh-tehr-mee-NAHN-teh", part_of_speech: "adj" },
      { word: "rebatir", english: "to refute", pronunciation: "reh-bah-TEER", part_of_speech: "verb" },
      { word: "la refutación", english: "refutation", pronunciation: "lah reh-foo-tah-SYOHN", part_of_speech: "noun", gender: "f" },
    ],
    cultural_note:
      "Spanish-language academic and debate culture preserves a more confrontational rhetorical style than current American norms. Where an American debater might soften with 'I think', 'maybe', a Spanish debater drops 'sostengo que' (I maintain) without hedging. The audience expects assertion, not qualification.",
    tip:
      "Build a 4-phrase debate toolkit: STATE ('sostengo que X'), SUPPORT ('mi argumento se basa en'), CONCEDE ('reconozco que hay argumentos en contra'), CONCLUDE ('esto conduce a una conclusión clara'). These four moves are the bones of any structured argument.",
  },
  {
    id: "spanish_debate_disagreement",
    level: "B2",
    category: "debate_basics",
    title: "Disagreeing diplomatically",
    subtitle: "Discrepar, refutar, matizar — the gradient of disagreement",
    intro:
      "Spanish has a richer vocabulary for graded disagreement than English. From soft hedging to firm rebuttal, the verb choice signals exactly how hard you're pushing back.",
    sentences: [
      {
        spanish: "Me permito discrepar de la lectura que se ha hecho de los datos.",
        english: "I take the liberty of disagreeing with the reading made of the data.",
        pronunciation: "meh pehr-MEE-toh dees-kreh-PAR deh lah lehk-TOO-rah keh seh ah EH-choh deh lohs DAH-tohs",
        note: "ME PERMITO + INFINITIVE = formal opener for any disagreement. The whole structure is the diplomatic way to push back without being abrupt.",
      },
      {
        spanish: "Aunque entiendo el punto, no comparto la conclusión.",
        english: "While I understand the point, I don't share the conclusion.",
        pronunciation: "OWN-keh ehn-TYEHN-doh ehl POON-toh, noh kohm-PAR-toh lah kohn-kloo-SYOHN",
        note: "AUNQUE + INDICATIVE = concession. NO COMPARTIR LA CONCLUSIÓN = softer than 'no estoy de acuerdo'.",
      },
      {
        spanish: "Permítame matizar esa afirmación: el efecto no es tan simple.",
        english: "Allow me to nuance that statement: the effect isn't so simple.",
        pronunciation: "pehr-MEE-tah-meh mah-tee-SAR EH-sah ah-feer-mah-SYOHN: ehl eh-FEHK-toh noh ehs tahn SEEM-pleh",
        note: "MATIZAR = to nuance / qualify. Sophisticated move: you're not flatly rejecting, you're adding shade.",
      },
      {
        spanish: "Niego categóricamente que eso sea cierto.",
        english: "I categorically deny that's true.",
        pronunciation: "NYEH-goh kah-teh-GOH-ree-kah-MEHN-teh keh EH-soh SEH-ah SYEHR-toh",
        note: "NEGAR CATEGÓRICAMENTE = firm denial. SEA (subjunctive) because negar+que triggers subjunctive.",
      },
      {
        spanish: "Su argumento parte de una premisa equivocada.",
        english: "Your argument starts from a mistaken premise.",
        pronunciation: "soo ar-goo-MEHN-toh PAR-teh deh OO-nah preh-MEE-sah eh-kee-boh-KAH-dah",
        note: "PARTIR DE = to start from. Attacks the foundation rather than the conclusion. Devastating rhetorical move.",
      },
    ],
    vocabulary: [
      { word: "discrepar", english: "to disagree (formal)", pronunciation: "dees-kreh-PAR", part_of_speech: "verb" },
      { word: "no compartir", english: "to not share (an opinion)", pronunciation: "noh kohm-par-TEER", part_of_speech: "phrase" },
      { word: "matizar", english: "to nuance / qualify", pronunciation: "mah-tee-SAR", part_of_speech: "verb" },
      { word: "el matiz", english: "nuance", pronunciation: "ehl mah-TEES", part_of_speech: "noun", gender: "m" },
      { word: "rebatir", english: "to refute", pronunciation: "reh-bah-TEER", part_of_speech: "verb" },
      { word: "negar categóricamente", english: "to categorically deny", pronunciation: "neh-GAR kah-teh-GOH-ree-kah-MEHN-teh", part_of_speech: "phrase" },
      { word: "la premisa", english: "premise", pronunciation: "lah preh-MEE-sah", part_of_speech: "noun", gender: "f" },
      { word: "equivocado/a", english: "mistaken / wrong", pronunciation: "eh-kee-boh-KAH-doh", part_of_speech: "adj" },
      { word: "cuestionar", english: "to question / challenge", pronunciation: "kwehs-tyoh-NAR", part_of_speech: "verb" },
      { word: "no me convence", english: "I'm not convinced", pronunciation: "noh meh kohn-BEHN-seh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "The disagreement gradient",
        explanation:
          "From softest to firmest: NO ME CONVENCE (barely a disagreement). NO COMPARTO ESA OPINIÓN. DISCREPO (formal, neutral). PERMÍTAME MATIZAR (adds nuance). NO ESTOY DE ACUERDO (neutral, common). REBATO ESE ARGUMENTO (formal pushback). NIEGO CATEGÓRICAMENTE (firmest). Match the verb to the situation.",
      },
    ],
    cultural_note:
      "Spanish disagreement culture varies by region. Spaniards (Madrid) and Argentines disagree directly. Mexican and Colombian cultures lean indirect — softer openers, more concession before pushback. When negotiating cross-regionally, calibrate. A direct 'eso es falso' might be normal in Madrid and rude in Mexico City.",
    tip:
      "Build a TWO-PHASE disagreement template: (1) ACKNOWLEDGE the other view ('entiendo su punto', 'reconozco que'). (2) THEN STATE your pushback ('sin embargo,', 'no obstante,'). The acknowledge-then-push pattern is the universal diplomatic move.",
  },
  {
    id: "spanish_debate_concluding",
    level: "B2",
    category: "debate_basics",
    title: "Concluding arguments",
    subtitle: "Para terminar, en definitiva, en última instancia",
    intro:
      "Closing an argument well is harder than opening one. Spanish has a rich set of closing connectors that signal you're wrapping up. The right closer makes your argument feel complete; the wrong one leaves it dangling.",
    sentences: [
      {
        spanish: "En definitiva, no podemos ignorar este problema por más tiempo.",
        english: "Ultimately, we can't ignore this problem any longer.",
        pronunciation: "ehn deh-fee-nee-TEE-bah, noh poh-DEH-mohs eeg-noh-RAR EHS-teh proh-BLEH-mah por mahs TYEHM-poh",
        note: "EN DEFINITIVA = ultimately / in the end. Signals you've considered the alternatives and reached a final view.",
      },
      {
        spanish: "Para terminar, resumiré los tres puntos principales.",
        english: "To finish, I'll summarize the three main points.",
        pronunciation: "PAH-rah tehr-mee-NAR, reh-soo-mee-REH lohs trehs POON-tohs preen-see-PAH-lehs",
        note: "PARA TERMINAR = to finish / to close. Most common closing connector.",
      },
      {
        spanish: "En última instancia, la decisión recae en cada uno de ustedes.",
        english: "In the final analysis, the decision rests with each of you.",
        pronunciation: "ehn OOL-tee-mah eens-TAHN-syah, lah deh-see-SYOHN reh-KAH-eh ehn KAH-dah OO-noh deh oos-TEH-dehs",
        note: "EN ÚLTIMA INSTANCIA = in the final analysis. More formal than 'en definitiva'.",
      },
      {
        spanish: "Concluyo, pues, que es necesario actuar de inmediato.",
        english: "I conclude, therefore, that immediate action is necessary.",
        pronunciation: "kohn-KLOO-yoh, pwehs, keh ehs neh-seh-SAH-ryoh ahk-TWAR deh een-meh-DYAH-toh",
        note: "CONCLUYO QUE = I conclude that. PUES = therefore / well. Formal closing. Used in essays and debates.",
      },
      {
        spanish: "Espero haber dejado clara mi postura. Gracias por su atención.",
        english: "I hope I've made my position clear. Thank you for your attention.",
        pronunciation: "ehs-PEH-roh ah-BEHR deh-HAH-doh KLAH-rah mee pohs-TOO-rah. GRAH-syahs por soo ah-tehn-SYOHN",
        note: "ESPERO HABER DEJADO CLARA = I hope I've made clear (perfect infinitive). Standard humble closer.",
      },
    ],
    vocabulary: [
      { word: "en definitiva", english: "ultimately", pronunciation: "ehn deh-fee-nee-TEE-bah", part_of_speech: "phrase" },
      { word: "en última instancia", english: "in the final analysis", pronunciation: "ehn OOL-tee-mah eens-TAHN-syah", part_of_speech: "phrase" },
      { word: "para terminar", english: "to finish", pronunciation: "PAH-rah tehr-mee-NAR", part_of_speech: "phrase" },
      { word: "para concluir", english: "to conclude", pronunciation: "PAH-rah kohn-kloo-EER", part_of_speech: "phrase" },
      { word: "en resumen", english: "in summary", pronunciation: "ehn reh-SOO-mehn", part_of_speech: "phrase" },
      { word: "en suma", english: "in sum", pronunciation: "ehn SOO-mah", part_of_speech: "phrase" },
      { word: "recaer en", english: "to fall on / rest with", pronunciation: "reh-kah-EHR ehn", part_of_speech: "verb" },
      { word: "concluir", english: "to conclude", pronunciation: "kohn-kloo-EER", part_of_speech: "verb" },
      { word: "resumir", english: "to summarize", pronunciation: "reh-soo-MEER", part_of_speech: "verb" },
      { word: "actuar", english: "to act", pronunciation: "ahk-TWAR", part_of_speech: "verb" },
    ],
    cultural_note:
      "Spanish closing rhetoric leans more ceremonial than English. American business closings often slip back into casual register: 'Anyway, that's my take, thanks.' Spanish closings land more formally: 'En definitiva, espero que estas consideraciones sirvan para orientar nuestra decisión.' The asymmetry — direct opening, ceremonial closing — is structural in Spanish argumentative discourse.",
    tip:
      "Memorize TWO closer phrases for opposite registers. Formal: 'En definitiva, [conclusion]. Gracias por su atención.' Informal: 'En resumen, [conclusion].' Switch depending on audience. Two phrases, lifetime coverage.",
  },

];

export default lessons;
