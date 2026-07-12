// src/languages/spanish/lessons-c1.ts
//
// C1 Spanish lessons for English-speaking learners.
// 20 hand-crafted lessons covering CEFR C1 descriptors.
//
// Pedagogical priorities for C1:
//   1. Subjunctive becomes PRODUCTIVE, not just recognizable. The
//      pluperfect subjunctive enters the spoken register (hubiera-by-
//      hubiera), cascades through reported speech, and powers evaluative
//      reactions. B2 introduced the forms; C1 makes them automatic.
//   2. Register reading over register production. Vos/tú/usted geography
//      is recognition-first — pick one variety to produce; recognize all.
//      Jerga is recognition-only. Imperfect/conditional politeness is
//      the highest-leverage productive register tool.
//   3. Literary tenses are reading skills. Narrative imperfect, pretérito
//      anterior, historic present, free indirect style. The C1 learner
//      parses them in print; production is optional and high-register.
//   4. Rhetoric as architecture. Anaphora, paralelismo, antithesis, the
//      period sentence. These structure persuasive Spanish prose — the
//      C1 student deploys them deliberately in formal writing.
//   5. Professional writing follows templates. The ensayo, the instancia,
//      the dictamen, citation conventions — internalizing the forms is
//      faster than composing from scratch each time.
//
// Cultural notes target C1-level friction: literary register markers,
// regional register politics (voseo as identity), the cost of getting
// usted wrong with someone older, the difference between a Spanish
// instancia and a US business letter.

import type { SpanishLesson } from "./lessons";

export const lessons: SpanishLesson[] = [
  // ── 1. Advanced subjunctive — pluperfect productive ───────────────────
  {
    id: "spanish_pluperfect_subjunctive_productive",
    level: "C1",
    category: "advanced_subjunctive",
    title: "Pluperfect subjunctive — productive use",
    subtitle: "Ojalá hubiera sabido, como si hubiera visto, no hay nadie que hubiera podido",
    intro:
      "B2 introduced 'hubiera' inside Type 3 conditionals. C1 takes the same form productive across the full range of subjunctive triggers — past wishes (ojalá hubiera), counterfactual comparisons (como si hubiera), denied antecedents (no hay nadie que hubiera). The form is a single irregular verb (haber, past subjunctive) plus a past participle. Memorize the conjugation cold; the rest is choosing the trigger.",
    sentences: [
      {
        spanish: "Ojalá hubiera sabido lo que sé ahora.",
        english: "I wish I had known then what I know now.",
        pronunciation: "oh-hah-LAH oo-BYEH-rah sah-BEE-doh loh keh seh ah-OH-rah",
        pronunciation_focus: ["hubiera: oo-BYEH-rah, glide on the 'ue'"],
        note: "Counterfactual past wish — wish about something that already didn't happen. OJALÁ + PLUPERFECT SUBJ is the canonical pairing. 'Ojalá supiera' would mean 'I wish I knew (now)', a present hypothetical — different time frame entirely.",
      },
      {
        spanish: "Habla como si hubiera vivido allí toda la vida.",
        english: "He talks as if he had lived there his whole life.",
        pronunciation: "AH-blah KOH-moh see oo-BYEH-rah bee-BEE-doh ah-YEE TOH-dah lah BEE-dah",
        note: "COMO SI always triggers subjunctive. Pluperfect (hubiera vivido) because the comparison is to a hypothetical PAST. 'Como si viviera allí' = as if he lived there (present). The tense of the subjunctive marks the time of the counterfactual.",
      },
      {
        spanish: "No hay nadie que hubiera podido prever eso.",
        english: "There's no one who could have foreseen that.",
        pronunciation: "noh ai NAH-dyeh keh oo-BYEH-rah poh-DEE-doh preh-BEHR EH-soh",
        note: "Denied antecedent ('nadie que') + past counterfactual. The 'no one' is a hypothetical past person whose existence is denied. Indicative 'pudo' here would change the meaning to 'no one foresaw it' — flatter, factual.",
      },
      {
        spanish: "Me molesta que no me hubieras avisado.",
        english: "It bothers me that you hadn't warned me.",
        pronunciation: "meh moh-LEHS-tah keh noh meh oo-BYEH-rahs ah-bee-SAH-doh",
        note: "Evaluative reaction (me molesta) to a past event already concluded before another past event. The bothering is now; the not-warning was finished before now. Compound subjunctive marks the prior-past relationship.",
      },
      {
        spanish: "Si me lo hubieras dicho, te habría ayudado.",
        english: "If you had told me, I would have helped you.",
        pronunciation: "see meh loh oo-BYEH-rahs DEE-choh, teh ah-BREE-ah ah-yoo-DAH-doh",
        note: "Textbook Type 3 conditional — SI + PLUPERFECT SUBJ + CONDITIONAL PERFECT. C1 students should produce this without thinking. The 'hubiera-by-hubiera' alternative ('te hubiera ayudado') is its own lesson — see lesson 2.",
      },
    ],
    vocabulary: [
      { cell_id: "b6ae80e0-fb4f-449f-a268-25bcdfb1457b", word: "hubiera/hubiese", english: "had (auxiliary, past subj. of haber)", pronunciation: "oo-BYEH-rah / oo-BYEH-seh", part_of_speech: "verb" },
      { cell_id: "b4f85013-1e20-4cba-a7d9-1787b2d94182", word: "ojalá", english: "I wish / if only", pronunciation: "oh-hah-LAH", part_of_speech: "interj" },
      { cell_id: "9140b16b-7e23-4ab6-af3a-b4699d0fa874", word: "como si", english: "as if (+ past or pluperf. subj.)", pronunciation: "KOH-moh see", part_of_speech: "conj" },
      { cell_id: "bd805903-23b3-40d8-ab4f-b0b27dd39dcd", word: "prever", english: "to foresee", pronunciation: "preh-BEHR", part_of_speech: "verb" },
      { cell_id: "ecfe366a-54bc-41a7-b0a9-209d1a1a15cf", word: "avisar", english: "to warn / let know", pronunciation: "ah-bee-SAHR", part_of_speech: "verb" },
      { cell_id: "b03a6724-73c8-4faa-95f4-7e375dc3b3d4", word: "molestar", english: "to bother / annoy", pronunciation: "moh-lehs-TAHR", part_of_speech: "verb" },
      { cell_id: "f577c0c4-95b6-491f-a969-c64bc0e55980", word: "antecedente", english: "antecedent (grammatical or biographical)", pronunciation: "ahn-teh-seh-DEHN-teh", part_of_speech: "noun", gender: "m" },
      { cell_id: "13d5e43f-9837-4c4e-8dac-4f3358a458b4", word: "contrafáctico", english: "counterfactual", pronunciation: "kohn-trah-FAHK-tee-koh", part_of_speech: "adj" },
      { cell_id: "9ec2764a-4efd-4bc9-b1d7-b0b2ea633b9a", word: "pluscuamperfecto", english: "pluperfect (grammar term)", pronunciation: "ploos-kwahm-pehr-FEHK-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "d5200b17-2971-4ace-a8bf-7900b001c2d0", word: "haberlo sabido", english: "if I'd only known (set phrase)", pronunciation: "ah-BEHR-loh sah-BEE-doh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Forming the pluperfect subjunctive",
        explanation:
          "PAST SUBJUNCTIVE OF HABER + PAST PARTICIPLE. The auxiliary 'haber' conjugates: hubiera/hubieras/hubiera/hubiéramos/hubierais/hubieran (or the -se variants: hubiese, hubieses, hubiese, hubiésemos, hubieseis, hubiesen). The past participle never changes for gender or number when haber is the auxiliary. The 1st-person plural form ALWAYS takes a written accent: hubiéramos / hubiésemos.",
        examples: [
          { spanish: "yo hubiera hablado / hubiese hablado", english: "I had spoken (subj.)" },
          { spanish: "tú hubieras comido / hubieses comido", english: "you had eaten (subj.)" },
          { spanish: "ella hubiera vivido / hubiese vivido", english: "she had lived (subj.)" },
          { spanish: "nosotros hubiéramos visto / hubiésemos visto", english: "we had seen (subj.)" },
        ],
      },
      {
        point: "When pluperfect subjunctive is required",
        explanation:
          "Whenever a subjunctive trigger refers to something COMPLETED before another past reference point. Past wish about a past event (ojalá hubiera ido). Counterfactual past comparison (como si hubiera estado allí). Denied past antecedent (no había nadie que hubiera podido). Past evaluative reaction to a prior past (me molestó que no me hubieras llamado). Si-clause Type 3 conditional (si hubiera sabido). Reported indirect command set in the past (me dijo que hubiera traído un libro — rare, literary).",
      },
    ],
    cultural_note:
      "The pluperfect subjunctive is the single biggest C1 marker that separates 'fluent learner' from 'sounds native at C1 register'. Many B2 speakers freeze at 'ojalá hubiera...' and revert to indicative ('ojalá fui') or simple past ('ojalá supe') because they don't trust the form. C1 speakers produce it under pressure. The fix is volume: write 100 sentences with the construction before trying to speak it; the speaking comes from muscle memory, not real-time conjugation.",
    tip:
      "For one full week, end every retrospective journal entry in Spanish with one 'ojalá hubiera...' or 'si hubiera...' sentence — about that day. The form becomes automatic when it's the natural ending of a thought you already had.",
  },

  // ── 2. Advanced subjunctive — hubiera by hubiera ──────────────────────
  {
    id: "spanish_hubiera_hubiera_construction",
    level: "C1",
    category: "advanced_subjunctive",
    title: "The hubiera-by-hubiera construction",
    subtitle: "Si hubiera sabido, hubiera ido — both clauses in pluperfect subjunctive",
    intro:
      "Textbook Spanish teaches Type 3 conditionals as 'si + pluperfect subjunctive + conditional perfect' — 'si hubiera sabido, habría ido'. But in actual native Spanish, especially Latin American, both clauses often appear in pluperfect subjunctive — 'si hubiera sabido, hubiera ido'. This is correct, idiomatic, and pervasive. Producing it cleanly is a clean C1 marker; learners rarely venture beyond the textbook form.",
    sentences: [
      {
        spanish: "Si hubiera tenido dinero, me hubiera comprado la casa.",
        english: "If I'd had the money, I would have bought the house.",
        pronunciation: "see oo-BYEH-rah teh-NEE-doh dee-NEH-roh, meh oo-BYEH-rah kohm-PRAH-doh lah KAH-sah",
        note: "Pure hubiera-by-hubiera. The textbook would prescribe 'me habría comprado'. In speech across LatAm and increasingly in Spain, the second hubiera is at least as common as habría.",
      },
      {
        spanish: "Si me lo hubieras dicho antes, hubiéramos llegado a tiempo.",
        english: "If you had told me earlier, we would have arrived on time.",
        pronunciation: "see meh loh oo-BYEH-rahs DEE-choh AHN-tehs, oo-BYEH-rah-mohs yeh-GAH-doh ah TYEHM-poh",
        note: "Note the stress on hubiéramos (acento agudo on the antepenult). Speakers slip on the accent and produce 'hubieramos' — wrong. The 1st-person plural ALWAYS carries the written accent.",
      },
      {
        spanish: "Yo nunca hubiera dicho eso.",
        english: "I would never have said that.",
        pronunciation: "yoh NOON-kah oo-BYEH-rah DEE-choh EH-soh",
        note: "Standalone hubiera with no explicit si-clause — the condition is implied (if I'd been in your shoes, etc.). Very common. Conditional perfect 'habría dicho' works too but feels slightly more bookish.",
      },
      {
        spanish: "Hubiera querido estar allí.",
        english: "I would have liked to be there.",
        pronunciation: "oo-BYEH-rah keh-REE-doh ehs-TAR ah-YEE",
        note: "Hubiera + querer + infinitive — extremely common spoken construction for past regret. 'Habría querido' is equally correct but lower-frequency in speech.",
      },
      {
        spanish: "Pensé que te hubiera gustado.",
        english: "I thought you'd have liked it.",
        pronunciation: "pehn-SEH keh teh oo-BYEH-rah goos-TAH-doh",
        note: "Hubiera inside a reported clause after a past main verb (pensé). 'Habría gustado' also valid; the hubiera form sounds more emotionally engaged, more natural in conversation.",
      },
    ],
    vocabulary: [
      { cell_id: "33879197-c62a-4020-979e-b5eea5ab2122", word: "haber + part.", english: "have + past part. (conditional perfect mood)", pronunciation: "ah-BEHR", part_of_speech: "phrase" },
      { cell_id: "9859868e-d837-4b6a-aae2-1be3a586df94", word: "habría", english: "would have (cond. perf. of haber)", pronunciation: "ah-BREE-ah", part_of_speech: "verb" },
      { cell_id: "f9d4c5b2-18e6-4fa3-ac2d-35b348d6ebc5", word: "hubiera", english: "would have / had (pluperf. subj. of haber)", pronunciation: "oo-BYEH-rah", part_of_speech: "verb" },
      { cell_id: "308a850e-5787-4b8a-8421-f9be08c2483d", word: "comprar", english: "to buy", pronunciation: "kohm-PRAHR", part_of_speech: "verb" },
      { cell_id: "d00ece46-c7df-4493-ac88-01e2f5f19dd9", word: "a tiempo", english: "on time", pronunciation: "ah TYEHM-poh", part_of_speech: "phrase" },
      { cell_id: "1d4aa12e-832a-4189-ba5d-e98826c7bec5", word: "decir", english: "to say / tell", pronunciation: "deh-SEER", part_of_speech: "verb" },
      { cell_id: "e28d710e-3741-492e-b784-6bad8767ad69", word: "gustar", english: "to please / be pleasing (impersonal)", pronunciation: "goos-TAHR", part_of_speech: "verb" },
      { cell_id: "2b25efb1-f28c-44f7-b399-bc3e8bd371e8", word: "estar allí", english: "to be there", pronunciation: "ehs-TAHR ah-YEE", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Hubiera vs habría — when each is preferred",
        explanation:
          "Both are correct in the 'result' clause of a Type 3 conditional. HABRÍA (conditional perfect) is the textbook prescriptive form, slightly more formal, dominant in written news/academic prose, neutral across regions. HUBIERA (pluperfect subjunctive used as a conditional) is overwhelmingly preferred in spoken Spanish across most of Latin America, also common in Spain, and increasingly accepted in writing. Both are correct; pick by register.",
        examples: [
          { spanish: "Si hubiera sabido, te habría avisado. (slightly formal)", english: "If I'd known, I'd have warned you." },
          { spanish: "Si hubiera sabido, te hubiera avisado. (spoken-native)", english: "If I'd known, I'd have warned you." },
        ],
      },
      {
        point: "Hubiera with implied conditions",
        explanation:
          "Hubiera + past participle can stand alone with NO 'si' clause, the condition being implied by context. 'Yo no hubiera hecho eso' = I wouldn't have done that (in your shoes / under those circumstances). This standalone use is the most idiomatic place to deploy hubiera; even speakers who prefer habría in full conditionals reach for hubiera here.",
      },
    ],
    cultural_note:
      "Argentine and Mexican speakers use hubiera-by-hubiera so consistently that the textbook 'habría' can sound stiff. Spaniards from formal registers (journalism, academia) lean toward habría in writing but switch to hubiera in speech. The Royal Academy (RAE) explicitly accepts both; this is not a 'correct vs incorrect' question, it's a register question. The C1 learner produces hubiera in conversation and either form in writing.",
    tip:
      "Listen to one hour of Latin American TV (telenovelas work) and count hubiera-by-hubiera tokens. You'll hear 20+ in an hour. Then deliberately produce three in your next Spanish conversation. The shift from 'translating the rule' to 'echoing the pattern' is the productive jump.",
  },

  // ── 3. Advanced subjunctive — layered embedding ───────────────────────
  {
    id: "spanish_layered_subjunctive_embedding",
    level: "C1",
    category: "advanced_subjunctive",
    title: "Layered subjunctive — cascading clauses",
    subtitle: "Me pidió que le dijera que hiciera algo — sequence across nested clauses",
    intro:
      "Spanish news and literary prose routinely chains two, three, even four subordinate clauses, each potentially demanding subjunctive. The challenge isn't choosing the right form for one clause — it's keeping the sequence coherent across the chain. The rule is local: each subordinate clause looks at ITS own main verb, not the verb at the top of the chain. Once you trust that, the chains parse easily.",
    sentences: [
      {
        spanish: "Me pidió que le dijera al jefe que viniera mañana.",
        english: "He asked me to tell the boss to come tomorrow.",
        pronunciation: "meh pee-DYOH keh leh dee-HEH-rah ahl HEH-feh keh bee-NYEH-rah mah-NYAH-nah",
        note: "Three clauses: pidió (preterite) → dijera (past subj, triggered by pidió) → viniera (past subj, triggered by dijera, which is past). Each step echoes the same past-time frame.",
      },
      {
        spanish: "Quería que supieras que ya había llamado antes de que te lo dijeran.",
        english: "I wanted you to know that I had already called before they told you.",
        pronunciation: "keh-REE-ah keh soo-PYEH-rahs keh yah ah-BEE-ah yah-MAH-doh AHN-tehs deh keh teh loh dee-HEH-rahn",
        note: "quería (past) → supieras (past subj) → había llamado (indicative pluperfect, factual past prior) → dijeran (past subj, triggered by 'antes de que'). The mood shifts: subj after volition, indicative for factual prior past, subj after 'antes de que'.",
      },
      {
        spanish: "El profesor exigió que el estudiante explicara por qué no había entregado el trabajo.",
        english: "The professor demanded that the student explain why he hadn't submitted the assignment.",
        pronunciation: "ehl proh-feh-SOHR ek-see-HYOH keh ehl ehs-too-DYAHN-teh ek-splee-KAH-rah pohr keh noh ah-BEE-ah ehn-treh-GAH-doh ehl trah-BAH-hoh",
        note: "exigió → explicara (subj). The 'por qué' clause is INDICATIVE (había entregado), not subj — it's a factual past, the student really hadn't submitted it. Critical distinction: subj for what the professor demands, indicative for the factual past it asks about.",
      },
      {
        spanish: "Espero que entiendas que tuve que hacerlo aunque no quisiera.",
        english: "I hope you understand that I had to do it even though I didn't want to.",
        pronunciation: "ehs-PEH-roh keh ehn-TYEHN-dahs keh TOO-veh keh ah-SEHR-loh OWN-keh noh kee-SYEH-rah",
        note: "espero (present) → entiendas (present subj) → tuve que (indicative, factual past) → aunque + quisiera (past subj — even when 'aunque' takes subj for past hypothetical concession). Mixed-tense sequence is normal.",
      },
      {
        spanish: "Insistió en que se quedaran hasta que terminara la reunión.",
        english: "He insisted they stay until the meeting ended.",
        pronunciation: "een-sees-TYOH ehn keh seh keh-DAH-rahn AHS-tah keh tehr-mee-NAH-rah lah reh-oo-NYOHN",
        note: "insistió → quedaran (past subj) → terminara (past subj, after 'hasta que' with hypothetical future-in-past). Even though the meeting did end, FROM THE INSISTING MOMENT it was unfinished hypothetical.",
      },
    ],
    vocabulary: [
      { cell_id: "fd9c6336-a971-4242-87ac-0b16560ca7fd", word: "exigir", english: "to demand / require", pronunciation: "ek-see-HEER", part_of_speech: "verb" },
      { cell_id: "f3aa8e82-3108-4da6-83f3-851427728e51", word: "insistir", english: "to insist", pronunciation: "een-sees-TEER", part_of_speech: "verb" },
      { cell_id: "141dd1a1-e7c5-417e-8894-7aff3041d0ed", word: "entregar", english: "to submit / hand in / deliver", pronunciation: "ehn-treh-GAHR", part_of_speech: "verb" },
      { cell_id: "9827138e-a6f7-4105-9360-360dbf83b8e5", word: "antes de que", english: "before (+ subj.)", pronunciation: "AHN-tehs deh keh", part_of_speech: "conj" },
      { cell_id: "bd73b9e8-9fb7-44e9-ad7b-648f7be0287f", word: "hasta que", english: "until (+ subj. for future/hypothetical)", pronunciation: "AHS-tah keh", part_of_speech: "conj" },
      { cell_id: "4a07364f-17ae-41b5-b560-b6b558be506a", word: "aunque", english: "although / even though (subj. or ind.)", pronunciation: "OWN-keh", part_of_speech: "conj" },
      { cell_id: "9db4131e-b5fa-4393-a7bf-3e517b30be27", word: "por qué", english: "why (interrogative)", pronunciation: "pohr keh", part_of_speech: "phrase" },
      { cell_id: "95137e76-823a-41ee-9e57-4e85654caae6", word: "concordancia", english: "agreement / sequence", pronunciation: "kohn-kohr-DAHN-syah", part_of_speech: "noun", gender: "f" },
      { cell_id: "41b86c01-dd19-4ce5-bbba-7fb2b6dfa016", word: "cláusula", english: "clause", pronunciation: "KLOW-soo-lah", part_of_speech: "noun", gender: "f" },
      { cell_id: "02a0793d-e386-4ff0-899c-9f90c6564604", word: "subordinado", english: "subordinate", pronunciation: "soob-ohr-dee-NAH-doh", part_of_speech: "adj" },
    ],
    grammar: [
      {
        point: "The locality rule",
        explanation:
          "Each subordinate clause looks at ITS OWN main verb, not the verb at the top of the chain. If a subordinate clause's main verb is past or conditional, the next-level subjunctive (if triggered) is past. If it's present or future, present subjunctive. The cascade just applies the rule once per nesting level.",
        examples: [
          { spanish: "Quiero (PRES) que sepas (PRES SUBJ) que vendrá (FUT, factual).", english: "I want you to know he'll come." },
          { spanish: "Quería (PAST) que supieras (PAST SUBJ) que vendría (COND, factual).", english: "I wanted you to know he'd come." },
        ],
      },
      {
        point: "Mixed indicative + subjunctive across clauses",
        explanation:
          "Subjunctive is local to triggers. A chain can contain BOTH moods at different levels: 'Me dijo (ind, factual past) que viniera (subj, triggered by 'dijo' as command) porque tenía (ind, factual) algo importante que decirme (no clause).' Don't try to keep the whole chain in one mood — that's not how Spanish works.",
      },
    ],
    cultural_note:
      "Spanish news writing — El País, La Nación, El Comercio — routinely produces these chains. Reading a single political column will surface 4-5 of them per paragraph. The chains feel dense to English speakers because English collapses sequence-of-tenses ('He said HE WAS coming' — one tense step) where Spanish marks each level. Reading aloud helps: the rhythm of the chains becomes audible.",
    tip:
      "Take one paragraph of a Spanish news column you've read. Underline every verb. Label each as indicative or subjunctive. Then for every subjunctive, draw an arrow to the trigger word in its own clause's main verb. You'll see the locality rule visually after one paragraph of doing this.",
  },

  // ── 4. Advanced subjunctive — evaluative ──────────────────────────────
  {
    id: "spanish_evaluative_subjunctive",
    level: "C1",
    category: "advanced_subjunctive",
    title: "Evaluative subjunctive — reacting to facts",
    subtitle: "Qué bueno que vinieras, me alegra que hayas llegado, es lógico que estés cansado",
    intro:
      "Some subjunctive triggers don't doubt or wish — they REACT to something that's already true. 'Me alegra que vengas' (I'm glad you're coming — and you are coming). The English-speaking learner often hesitates here because the subordinated event is real, factual, even known. But Spanish marks reactions with subjunctive regardless of factuality. This is the evaluative subjunctive, and it's the most pragmatically useful subjunctive at C1.",
    sentences: [
      {
        spanish: "Qué bueno que hayas venido.",
        english: "How nice that you came / I'm so glad you came.",
        pronunciation: "keh BWEH-noh keh AH-yahs beh-NEE-doh",
        note: "QUÉ BUENO + QUE + SUBJ — fixed reaction frame. Present perfect subj. (hayas venido) for an event just completed. Compare 'qué bueno que vienes' (you're coming — habitual/ongoing) and 'qué bueno que vinieras' (further past).",
      },
      {
        spanish: "Me alegra que te hayan dado el trabajo.",
        english: "I'm glad they gave you the job.",
        pronunciation: "meh ah-LEH-grah keh teh AH-yahn DAH-doh ehl trah-BAH-hoh",
        note: "ALEGRAR + QUE + SUBJ. The job offer is FACT — they did give it. But Spanish marks the emotional reaction with subjunctive. English would say 'I'm glad THAT THEY GAVE YOU' — declarative, indicative. Spanish: subj.",
      },
      {
        spanish: "Es lógico que estés cansado.",
        english: "It makes sense you're tired.",
        pronunciation: "ehs LOH-hee-koh keh ehs-TEHS kahn-SAH-doh",
        note: "ES LÓGICO + QUE + SUBJ. The fact (you're tired) is taken for granted; Spanish marks the SPEAKER'S EVALUATION of that fact as subjunctive. ES LÓGICO is one of a large family: es normal, es natural, es razonable, es comprensible.",
      },
      {
        spanish: "Lamento que no hubieras podido asistir.",
        english: "I'm sorry you couldn't attend.",
        pronunciation: "lah-MEHN-toh keh noh oo-BYEH-rahs poh-DEE-doh ah-sees-TEER",
        note: "Past reaction (lamento) to a past hypothetical/factual absence. Pluperfect subj. (hubieras podido) marks the prior past. Compare 'lamento que no puedas' (present — you can't, now).",
      },
      {
        spanish: "Me sorprende que no me lo hayas dicho.",
        english: "I'm surprised you didn't tell me.",
        pronunciation: "meh sohr-PREHN-deh keh noh meh loh AH-yahs DEE-choh",
        note: "SORPRENDER + QUE + SUBJ. The not-telling is fact; the surprise is the reaction. Critical distinction from 'me sorprendió que no me lo dijeras' (past surprise about past not-telling). Pick tense by when the SURPRISE happens, not the not-telling.",
      },
    ],
    vocabulary: [
      { cell_id: "f8928503-f4f1-4604-af97-8034b223214a", word: "alegrar", english: "to gladden (impersonal: me alegra que…)", pronunciation: "ah-leh-GRAHR", part_of_speech: "verb" },
      { cell_id: "4dea22b7-e30c-400c-b4a2-3f60183d3822", word: "lamentar", english: "to regret / be sorry that", pronunciation: "lah-mehn-TAHR", part_of_speech: "verb" },
      { cell_id: "a489ed83-1c04-4500-9aee-b30f76831885", word: "sorprender", english: "to surprise", pronunciation: "sohr-prehn-DEHR", part_of_speech: "verb" },
      { cell_id: "1ed603e9-9a15-4bf2-93fb-626f3a1549ea", word: "molestar", english: "to bother / be annoyed that", pronunciation: "moh-lehs-TAHR", part_of_speech: "verb" },
      { cell_id: "46e6224a-ac4c-4f6f-9d22-e490efa9fe66", word: "es lógico", english: "it makes sense / is logical", pronunciation: "ehs LOH-hee-koh", part_of_speech: "phrase" },
      { cell_id: "7c98d989-0b65-4ddc-9df5-dbff975535ba", word: "es natural", english: "it's natural / understandable", pronunciation: "ehs nah-too-RAHL", part_of_speech: "phrase" },
      { cell_id: "4a96e029-d65d-4d8f-9b6b-338b19b9538f", word: "es razonable", english: "it's reasonable", pronunciation: "ehs rah-soh-NAH-bleh", part_of_speech: "phrase" },
      { cell_id: "7e2a5dc1-0bd6-419d-a31d-14c958d3ace0", word: "qué bueno que", english: "how nice that / I'm glad that", pronunciation: "keh BWEH-noh keh", part_of_speech: "phrase" },
      { cell_id: "d4ceb6da-096a-4ed2-be00-f9c665871150", word: "qué pena que", english: "what a shame that", pronunciation: "keh PEH-nah keh", part_of_speech: "phrase" },
      { cell_id: "4cc6c3c9-51f8-438e-88e4-4412bc9ddbfa", word: "menos mal que", english: "thank goodness that (+ INDICATIVE, exception!)", pronunciation: "MEH-nohs mahl keh", part_of_speech: "phrase" },
      { cell_id: "03f7e051-d960-49bc-95aa-caa7938c2542", word: "asistir", english: "to attend", pronunciation: "ah-sees-TEER", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Evaluative triggers vs declarative reports",
        explanation:
          "EVALUATIVE: speaker reacts to a (possibly known) fact. Subjunctive. 'Me alegra que vengas' (glad you're coming). DECLARATIVE: speaker reports a fact. Indicative. 'Sé que vienes' (I know you're coming). Same subordinate content — 'que vienes / que vengas'. Different mood, different mental act. The trigger word's CATEGORY (reaction vs report) is what picks the mood.",
        examples: [
          { spanish: "Me alegra que estés aquí. (eval — subj)", english: "I'm glad you're here." },
          { spanish: "Sé que estás aquí. (decl — ind)", english: "I know you're here." },
          { spanish: "Es bueno que estés aquí. (eval — subj)", english: "It's good you're here." },
          { spanish: "Es cierto que estás aquí. (decl — ind)", english: "It's true you're here." },
        ],
      },
      {
        point: "The 'menos mal' exception",
        explanation:
          "Most reactions take subjunctive. ONE prominent exception: MENOS MAL QUE takes INDICATIVE. 'Menos mal que llegaste' (thank goodness you arrived). Why: 'menos mal' frames the subordinate event as a known, achieved fact, not a hypothetical reaction. Memorize as exception; don't try to derive.",
      },
    ],
    cultural_note:
      "Spanish evaluative subjunctive is used DOZENS of times in a normal conversation. 'Me alegra que estés aquí' is a textbook example; 'qué bueno que viniste', 'qué pena que no pudieras quedarte', 'menos mal que llegaste' are everyday tokens. The C1 learner who doesn't produce these sounds B1 — even with correct verbs and good vocabulary. The mood is a pragmatic marker of social warmth as much as a grammatical rule.",
    tip:
      "After any interaction in Spanish, end with one evaluative reaction. 'Qué bueno que hablamos' (so glad we talked). 'Me alegra que vinieras' (glad you came). It becomes natural quickly — and it transforms how Spanish speakers perceive your register.",
  },

  // ── 5. Register shifts — voseo / tuteo / usted geography ──────────────
  {
    id: "spanish_voseo_tuteo_usted_geography",
    level: "C1",
    category: "register_shifts",
    title: "Vos, tú, usted — the geographic map",
    subtitle: "Argentina says vos, Spain says tú, Colombia layers usted — knowing what you're hearing",
    intro:
      "Spanish has THREE second-person singular forms: vos, tú, usted. They map roughly to geography, but with overlap and social nuance. The C1 learner recognizes which form they're hearing, what it signals socially, and produces ONE consistently — typically tú across most regions, vos if learning Argentine/Uruguayan Spanish. Pretending to be pan-Hispanic by switching forms mid-conversation usually sounds confused, not skilled.",
    sentences: [
      {
        spanish: "¿Vos sabés a qué hora llega el tren? (Argentina, Uruguay)",
        english: "Do you know what time the train arrives?",
        pronunciation: "vohs sah-BEHS ah keh OH-rah YEH-gah ehl trehn",
        note: "Argentine voseo: VOS (subject) + verb in voseo form (sabés, not sabes). The verb stress shifts to the final syllable for -ar/-er verbs (hablás, comés). Sounds completely natural in Buenos Aires and Montevideo; would sound foreign in Mexico City.",
      },
      {
        spanish: "¿Tú sabes a qué hora llega el tren? (Spain, Mexico, most LatAm)",
        english: "Do you know what time the train arrives?",
        pronunciation: "too SAH-behs ah keh OH-rah YEH-gah ehl trehn",
        note: "Standard tuteo. The default learner form. Works everywhere except deep voseo regions (Buenos Aires, Montevideo), where it sounds slightly book-learned but is understood and accepted.",
      },
      {
        spanish: "¿Usted sabe a qué hora llega el tren? (formal everywhere; default in much of Colombia, Costa Rica)",
        english: "Do you know what time the train arrives?",
        pronunciation: "oos-TEHD SAH-beh ah keh OH-rah YEH-gah ehl trehn",
        note: "USTED + third-person verb (sabe, not sabes/sabés). In most regions, USTED is formal — used with strangers, elders, professional contacts. In Bogotá, Medellín, parts of Costa Rica, it's the DEFAULT — used between family and friends. Same word, opposite social signal.",
      },
      {
        spanish: "Che, ¿vos podés ayudarme con esto?",
        english: "Hey, can you help me with this? (Argentine)",
        pronunciation: "cheh, vohs poh-DEHS ah-yoo-DAR-meh kohn EHS-toh",
        note: "CHE = Argentine address-call ('hey'). VOS + voseo verb (podés instead of puedes). The trio CHE + VOS + voseo-verb is Argentina concentrated; a Buenos Aires speaker hits all three in their first sentence.",
      },
      {
        spanish: "¿Tú me dices o me dice usted?",
        english: "Are you tú-ing me or usted-ing me?",
        pronunciation: "too meh DEE-sehs oh meh DEE-seh oos-TEHD",
        note: "Asking explicitly about which register the other person wants. Quiet but real social move — common when relationships shift (new colleague, ex's new partner, in-law). Both forms are referenced in one sentence to make the question clear.",
      },
    ],
    vocabulary: [
      { cell_id: "d5ea7b8a-1cbf-4816-9d9d-0cdfcc07a4f5", word: "vos", english: "you (2nd-pers sing., voseo regions)", pronunciation: "vohs", part_of_speech: "pron" },
      { cell_id: "f45210fe-4ae0-4679-a751-1c39316319bd", word: "tú", english: "you (2nd-pers sing., informal, most regions)", pronunciation: "too", part_of_speech: "pron" },
      { cell_id: "23b9df0c-e431-4fbf-a174-8c586b9766dd", word: "usted", english: "you (2nd-pers sing., formal or default in some regions)", pronunciation: "oos-TEHD", part_of_speech: "pron" },
      { cell_id: "dee2ce22-1880-4b4a-8481-862605be6038", word: "voseo", english: "the use of vos as 2nd-pers sing.", pronunciation: "boh-SEH-oh", part_of_speech: "noun", gender: "m" },
      { cell_id: "8cfc5066-a33d-4de9-b01e-d06c41caf678", word: "tuteo", english: "the use of tú as 2nd-pers sing.", pronunciation: "too-TEH-oh", part_of_speech: "noun", gender: "m" },
      { cell_id: "1b856d97-4d48-47d6-9d6c-10c8109f5fc8", word: "ustedeo", english: "the use of usted as default (Andean, some Caribbean)", pronunciation: "oos-teh-DEH-oh", part_of_speech: "noun", gender: "m" },
      { cell_id: "e121c930-cefb-4b71-85ce-a8c343bd5813", word: "che", english: "hey (Argentine vocative)", pronunciation: "cheh", part_of_speech: "interj" },
      { cell_id: "647289b3-aa06-47aa-a2b9-33ff82ea3de0", word: "vosotros", english: "you all (informal, Spain only)", pronunciation: "boh-SOH-trohs", part_of_speech: "pron" },
      { cell_id: "7e73b52b-5536-4f4f-a761-bc07ea4f534a", word: "ustedes", english: "you all (formal in Spain, default in LatAm)", pronunciation: "oos-TEH-dehs", part_of_speech: "pron" },
      { cell_id: "f73332e1-6638-45dd-a67f-ef1fb5d09695", word: "tratamiento", english: "form of address / treatment", pronunciation: "trah-tah-MYEHN-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "9d0df86f-ce90-43f8-9875-efe78ba32643", word: "tutearse", english: "to address each other as tú", pronunciation: "too-teh-AHR-seh", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Voseo verb forms (Argentina, Uruguay, parts of Central America)",
        explanation:
          "Present indicative voseo: -ar verbs end in -ás (hablás, mirás), -er verbs in -és (comés, sabés), -ir verbs in -ís (vivís, decís). The IMPERATIVE voseo is also distinctive: hablá, comé, viví (no final 's', stress on the final syllable). Past tense, imperfect, future use the same forms as tú in Argentine voseo (hablaste, hablabas, hablarás). Some Central American voseos vary further.",
        examples: [
          { spanish: "Vos hablás español muy bien.", english: "You speak Spanish very well. (Argentine)" },
          { spanish: "Tú hablas español muy bien.", english: "You speak Spanish very well. (Mexican/Spanish)" },
          { spanish: "Vení, hablá conmigo. (voseo imperative)", english: "Come, talk with me." },
          { spanish: "Ven, habla conmigo. (tuteo imperative)", english: "Come, talk with me." },
        ],
      },
      {
        point: "Ustedeo in Colombia / Costa Rica / parts of Venezuela",
        explanation:
          "In Bogotá, Medellín, Cali, San José (Costa Rica), and the Andean Colombian highlands, USTED is the unmarked default — between spouses, between parents and children, between close friends. A Colombian father saying 'usted' to his five-year-old daughter is not being formal; it's the normal form. In these regions, TÚ feels intimate or foreign-influenced, and VOS (heard in Antioquia/Paisa Spanish) is regional pride.",
      },
    ],
    cultural_note:
      "Voseo is identity in Argentina. To switch from vos to tú when speaking to an Argentine is to break frame — they will perceive it as foreign affectation. The reverse is also true: an Argentine speaking tú to a fellow Argentine signals self-consciousness, distance, or pretense. Movies and dubbing handle this by region: an Argentine film dubbed for Spain may convert voseo to tuteo, losing register signals. A C1 learner targeting Argentine Spanish learns voseo cold; targeting Mexican/Spanish Spanish, tuteo. Either is a complete C1 profile; both is not necessary.",
    regional_variants: [
      { meaning: "you (sing. informal)", peninsular: "tú", latam: "tú / vos (regional)", note: "Vos dominates Argentina, Uruguay, parts of Central America; tú dominates elsewhere." },
      { meaning: "you (sing. default in family/friend)", peninsular: "tú", latam: "usted (Colombia, Costa Rica)", note: "Ustedeo as default is unique to certain Andean/Central American regions." },
      { meaning: "you all (informal)", peninsular: "vosotros", latam: "ustedes", note: "Spain alone keeps vosotros; all of LatAm uses ustedes for both informal and formal plural." },
    ],
    tip:
      "Pick ONE target variety — Mexican tú, Spanish tú, Argentine vos — and commit. Learn its imperatives, its slang frame, its address conventions. Going pan-Hispanic at C1 is a year-3 luxury; at C1 your prosody and register should sound like one place.",
  },

  // ── 6. Register shifts — pivoting between tú and usted ────────────────
  {
    id: "spanish_register_pivoting",
    level: "C1",
    category: "register_shifts",
    title: "Pivoting between registers",
    subtitle: "Reading the moment when tú becomes usted and back",
    intro:
      "Register isn't fixed at the start of a conversation; it shifts. Someone older may offer tú after a few minutes. A close colleague may switch to usted after an argument as a quiet marker of distance. The C1 learner reads these moves and responds correctly — accepting an offered tú, returning a strategic usted, recognizing when not to escalate. Misreading the pivot costs more social signal than getting any conjugation wrong.",
    sentences: [
      {
        spanish: "Tutéame, por favor. No me hagas sentir tan viejo.",
        english: "Address me as tú, please. Don't make me feel so old.",
        pronunciation: "too-TEH-ah-meh, pohr fah-VOHR. noh meh AH-gahs sehn-TEER tahn VYEH-hoh",
        note: "An older person inviting downshift from usted to tú. The C1 learner accepts: 'Vale, gracias' and switches form. Refusing the invitation by continuing to use usted reads as cold, almost rude.",
      },
      {
        spanish: "Si me permite, prefiero que sigamos con el tratamiento de usted.",
        english: "If you don't mind, I'd prefer we keep the formal address.",
        pronunciation: "see meh pehr-MEE-teh, preh-FYEH-roh keh see-GAH-mohs kohn ehl trah-tah-MYEHN-toh deh oos-TEHD",
        note: "Polite refusal of a tú invitation — used by older speakers, professionals, or in religious/legal settings. The C1 learner accepts the refusal without taking offense; insisting on tú after this is a violation.",
      },
      {
        spanish: "Mira, ya basta de usted, ¿puedes hablarme normal?",
        english: "Look, that's enough usted, can you talk to me normally?",
        pronunciation: "MEE-rah, yah BAHS-tah deh oos-TEHD, PWEH-dehs ah-BLAR-meh nohr-MAHL",
        note: "Frustration with continued formal address — common from a younger person to a slightly older one who's overdoing the politeness. 'Normal' here means tú. Latin American framing.",
      },
      {
        spanish: "Disculpe, ¿le molesta si lo trato de usted?",
        english: "Excuse me, do you mind if I address you formally?",
        pronunciation: "dees-KOOL-peh, leh moh-LEHS-tah see loh TRAH-toh deh oos-TEHD",
        note: "Asking permission to UPSHIFT to usted — common in professional contexts when meeting someone significantly older or in a position of authority. Note the meta-question itself is in usted (le molesta, lo trato) — you've already signaled deference.",
      },
      {
        spanish: "Le pido que no me trate de usted, le voy a parecer del siglo pasado.",
        english: "I'm asking you not to address me formally, I'll seem like I'm from last century.",
        pronunciation: "leh PEE-doh keh noh meh TRAH-teh deh oos-TEHD, leh voy ah pah-reh-SEHR dehl SEE-gloh pah-SAH-doh",
        note: "Younger professional refusing usted from a much older client — frames it as generational, lightens the moment. Note the structural inversion: refusing usted while still using usted in the request. The meta-frame remains formal even as the request is informal.",
      },
    ],
    vocabulary: [
      { cell_id: "d7a48dbd-eae9-4014-a282-c245e10df979", word: "tutear", english: "to address as tú", pronunciation: "too-teh-AHR", part_of_speech: "verb" },
      { cell_id: "ecafc437-12a8-4012-9861-6d6402a955dc", word: "tutearse", english: "to address each other as tú", pronunciation: "too-teh-AHR-seh", part_of_speech: "verb" },
      { cell_id: "f38acb77-d3c1-4cad-a98e-ebf48cc25dd2", word: "ustedear", english: "to address as usted (rare, more often: tratar de usted)", pronunciation: "oos-teh-deh-AHR", part_of_speech: "verb" },
      { cell_id: "fc29fdba-52a3-4c6c-ad70-05223e7ff723", word: "tratar de tú", english: "to use tú with (someone)", pronunciation: "trah-TAR deh too", part_of_speech: "phrase" },
      { cell_id: "1a5cb295-8950-4b43-b762-bcbc4d532874", word: "tratar de usted", english: "to use usted with (someone)", pronunciation: "trah-TAR deh oos-TEHD", part_of_speech: "phrase" },
      { cell_id: "8a2878c0-cd53-40cd-ad2c-a5599204664b", word: "tratamiento", english: "form of address (technical term)", pronunciation: "trah-tah-MYEHN-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "c85afbd6-3f67-4896-9331-baaa08ae1538", word: "deferencia", english: "deference", pronunciation: "deh-feh-REHN-syah", part_of_speech: "noun", gender: "f" },
      { cell_id: "55828c81-3e09-4710-8b9a-cf31285aae91", word: "cercanía", english: "closeness / familiarity", pronunciation: "sehr-kah-NEE-ah", part_of_speech: "noun", gender: "f" },
      { cell_id: "484154b1-a5ea-47c7-b66d-b0b0d1dabcb7", word: "marcar distancia", english: "to mark / signal distance", pronunciation: "mahr-KAR dees-TAHN-syah", part_of_speech: "phrase" },
      { cell_id: "77b4f5d7-16a1-44f6-af3f-eebbabe9965e", word: "bajar el tratamiento", english: "to downshift the register", pronunciation: "bah-HAR ehl trah-tah-MYEHN-toh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Hidden subjunctives in pivot phrases",
        explanation:
          "Most register-pivot requests use subjunctive after volition/permission verbs: 'Le pido que no me TRATE' (subj), 'Si me permite que lo TUTEE' (subj), 'Prefiero que SIGAMOS' (subj). Drill these specific phrases — they are formulaic and high-frequency for any professional or social move involving register change.",
        examples: [
          { spanish: "Me gustaría que nos tuteáramos. (past subj. as politeness)", english: "I'd like for us to use tú with each other." },
          { spanish: "Permíteme que te llame por tu nombre.", english: "Let me call you by your first name." },
        ],
      },
    ],
    cultural_note:
      "In Spain, downshift from usted to tú happens quickly and freely — strangers under 50 often start with tú by default in casual contexts (cafés, shops). In Mexico and most of LatAm, usted is offered first and tú is invited explicitly after rapport is established. In Bogotá and parts of Costa Rica, usted is the unmarked default and tú is intimate — INVITING tú is a real social move, not a courtesy formality. Reading which framework you're in is the C1 skill. When in doubt, start with usted and listen for the other person's pivot.",
    tip:
      "When you sense a pivot is being offered, accept it on the SECOND opportunity, not the first — the first offer is sometimes a politeness gesture that the other person doesn't actually expect you to take. The second offer is sincere. This calibration is regional, but the two-offer rule holds across most Spanish-speaking professional cultures.",
  },

  // ── 7. Register shifts — politeness via imperfect/conditional ─────────
  {
    id: "spanish_politeness_imperfect_conditional",
    level: "C1",
    category: "register_shifts",
    title: "Imperfect and conditional for politeness",
    subtitle: "Quería preguntarte, podrías hacerme un favor — softening with tense",
    intro:
      "Spanish has a productive technique for softening requests, suggestions, and statements: shift from present to imperfect or conditional. 'Quiero un café' becomes 'Quería un café' — same meaning, softer feel. 'Puedes ayudarme' becomes 'Podrías ayudarme' — same ask, less imposing. This is called the 'pasado de cortesía' (politeness past) and the 'condicional de cortesía' (politeness conditional). At C1, deploying it is automatic; missing it makes you sound abrupt.",
    sentences: [
      {
        spanish: "Quería preguntarte una cosa.",
        english: "I wanted to ask you something. (lit.) / I'd like to ask you something. (idiomatic)",
        pronunciation: "keh-REE-ah preh-goon-TAR-teh OO-nah KOH-sah",
        note: "Imperfect QUERÍA, not present QUIERO. The shift signals: 'I'm not demanding, I'm asking for permission to ask.' English speakers translating literally produce 'I wanted to ask' which sounds odd in English but is exactly right in Spanish. ALL Spanish-speaking cultures use this.",
      },
      {
        spanish: "¿Podrías pasarme la sal?",
        english: "Could you pass me the salt?",
        pronunciation: "poh-DREE-ahs pah-SAR-meh lah sahl",
        note: "Conditional PODRÍAS instead of present PUEDES. Same request, much softer. 'Puedes pasarme la sal' is fine but slightly direct — a parent might say it to a child; an adult to a fellow guest uses PODRÍAS.",
      },
      {
        spanish: "Te llamaba para confirmar la cita.",
        english: "I was calling to confirm the appointment.",
        pronunciation: "teh yah-MAH-bah PAH-rah kohn-feer-MAR lah SEE-tah",
        note: "Imperfect LLAMABA on a present-time call. The shift makes the call feel less imposing. 'Te llamo para confirmar' is direct/business; 'te llamaba' is the softer, professional default for a callback or reminder.",
      },
      {
        spanish: "Me gustaría que me dieras tu opinión.",
        english: "I'd like for you to give me your opinion.",
        pronunciation: "meh goos-tah-REE-ah keh meh DYEH-rahs too oh-pee-NYOHN",
        note: "Conditional ME GUSTARÍA + past subj. DIERAS. Both elements soften: conditional in the main clause, past subj. in the subordinate. The full politeness stack — formal request from someone the speaker doesn't want to impose on.",
      },
      {
        spanish: "Yo diría que es mejor esperar.",
        english: "I'd say it's better to wait.",
        pronunciation: "yoh dee-REE-ah keh ehs meh-HOR ehs-peh-RAR",
        note: "Conditional DIRÍA softens an opinion — turns 'digo' (I say, declarative) into 'I'd say' (hedged, tentative). High-frequency in professional contexts where bluntness is to be avoided.",
      },
    ],
    vocabulary: [
      { cell_id: "0b484599-750f-440f-913d-7d61a37c3342", word: "quería", english: "I wanted (imperfect, used for politeness)", pronunciation: "keh-REE-ah", part_of_speech: "verb" },
      { cell_id: "442145f9-e2a4-4ea7-b034-0f5d559578bc", word: "podría/podrías", english: "could (conditional, polite request)", pronunciation: "poh-DREE-ah / poh-DREE-ahs", part_of_speech: "verb" },
      { cell_id: "61d81cce-604d-4fc5-82a4-7b500c50af3e", word: "diría", english: "I'd say (conditional, hedged opinion)", pronunciation: "dee-REE-ah", part_of_speech: "verb" },
      { cell_id: "e092f37c-fddd-4958-b22a-b803ec25370e", word: "me gustaría", english: "I'd like (conditional, polite request)", pronunciation: "meh goos-tah-REE-ah", part_of_speech: "phrase" },
      { cell_id: "8a1d37a1-c7a6-43a1-b2a8-2b8f442d7cc7", word: "tendría", english: "I'd have (conditional)", pronunciation: "tehn-DREE-ah", part_of_speech: "verb" },
      { cell_id: "e98f7d0d-c872-40c9-94f5-77e277af6522", word: "preferiría", english: "I'd prefer", pronunciation: "preh-feh-ree-REE-ah", part_of_speech: "verb" },
      { cell_id: "b471aae5-d0a9-4617-84a2-4220af0cad2e", word: "haría", english: "I'd do", pronunciation: "ah-REE-ah", part_of_speech: "verb" },
      { cell_id: "70b6b6f1-2a91-4f98-9407-572582eb2241", word: "sería", english: "it'd be", pronunciation: "seh-REE-ah", part_of_speech: "verb" },
      { cell_id: "a5413e4c-a679-44b9-8e0a-534717a81b28", word: "cortesía", english: "courtesy / politeness", pronunciation: "kohr-teh-SEE-ah", part_of_speech: "noun", gender: "f" },
      { cell_id: "27416099-23bf-431a-8d01-e877cc347f2f", word: "atenuar", english: "to soften / attenuate", pronunciation: "ah-teh-NWAR", part_of_speech: "verb" },
      { cell_id: "54f829a2-af0c-4f40-828c-6f1a5a398695", word: "petición", english: "request", pronunciation: "peh-tee-SYOHN", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "When imperfect softens vs reports a real past",
        explanation:
          "Context disambiguates. 'Quería un café' said walking into a café = polite present request (I'd like a coffee). 'Quería un café pero me dieron té' = real past report (I wanted coffee but they gave me tea). The imperfect form is identical; the listener parses politeness vs report from situation.",
      },
      {
        point: "Verbs that take politeness shifts most often",
        explanation:
          "QUERER (querer → quería / querría — 'wanted', 'would want'), PODER (puedes → podrías), DEBER (debes → deberías — softer 'should'), TENER (tienes → tendrías — would have), PREFERIR (prefiero → preferiría), GUSTAR (me gusta → me gustaría — would like). These six verbs cover ~90% of all polite requests. Drill them in BOTH softened forms.",
        examples: [
          { spanish: "Debes hablar con él. → Deberías hablar con él.", english: "You should talk to him. (softer)" },
          { spanish: "Tienes que firmar. → Tendrías que firmar.", english: "You have to sign. (softer)" },
        ],
      },
    ],
    cultural_note:
      "Politeness-by-tense is the most underused C1 tool by English-speaking learners. English softens with words ('please', 'kindly', 'if you don't mind') and modals ('could', 'would'). Spanish softens with TENSE — and the result is more invisible, more native-feeling, less wordy. A C1 speaker who says 'quería' instead of 'quiero' when ordering coffee sounds polished without trying. The shift is the marker of register competence.",
    tip:
      "Spend one day deliberately replacing every 'quiero' with 'quería', every 'puedes' with 'podrías', every 'me gusta' with 'me gustaría' — only in request contexts. By evening it's automatic. Then alternate by social distance: family/friends keep present; strangers/professionals get imperfect/conditional. Within a week the politeness frame is yours.",
  },

  // ── 8. Register shifts — jerga reading skill ──────────────────────────
  {
    id: "spanish_jerga_reading_skill",
    level: "C1",
    category: "register_shifts",
    title: "Jerga — reading slang without using it",
    subtitle: "Chido, guay, chévere, padre — same idea, different country",
    intro:
      "Slang (jerga) is recognition-only for C1 learners. Trying to use Argentine slang while learning Mexican Spanish makes you sound like a tourist who watched one show. The job at C1 is to RECOGNIZE regional slang families so you understand who you're talking to and what register they're projecting. Production: stick to the standard form. Comprehension: be ready for chido, guay, chévere, padre, copado, bacán.",
    sentences: [
      {
        spanish: "Está chido el lugar, ¿no? (Mexico)",
        english: "The place is cool, right?",
        pronunciation: "ehs-TAH CHEE-doh ehl loo-GAR, noh",
        note: "CHIDO = cool/great, exclusively Mexican. Saying CHIDO in Madrid or Buenos Aires marks you as a Mexican Spanish speaker. Don't use it elsewhere; recognize it everywhere.",
      },
      {
        spanish: "Qué guay tu camiseta. (Spain)",
        english: "Your t-shirt is so cool.",
        pronunciation: "keh gwai too kah-mee-SEH-tah",
        note: "GUAY = cool, exclusively Spanish (Spain). Sounds totally foreign in Latin America. Mexico's equivalent is CHIDO/PADRE; Argentina's COPADO; Caribbean's CHÉVERE.",
      },
      {
        spanish: "Está chévere la fiesta. (Caribbean, Venezuela, Colombia)",
        english: "The party's great.",
        pronunciation: "ehs-TAH CHEH-veh-reh lah FYEHS-tah",
        note: "CHÉVERE = cool, pervasive in Venezuela, Colombia, the Caribbean. Spreads through Spanish-language reggaetón; Mexican and Spanish listeners recognize it but don't typically produce it.",
      },
      {
        spanish: "¡Qué copado! (Argentina, Uruguay)",
        english: "How cool!",
        pronunciation: "keh koh-PAH-doh",
        note: "COPADO = cool, Argentine/Uruguayan slang. A Spaniard or Mexican might not parse it without context — clearly a positive reaction, but the exact gloss takes regional exposure.",
      },
      {
        spanish: "Está padre el coche. (Mexico)",
        english: "The car's great.",
        pronunciation: "ehs-TAH PAH-dreh ehl KOH-cheh",
        note: "PADRE = cool/great (Mexico). Note literal meaning is 'father' — colloquial reanalysis. Comparable to English 'killer' or 'sick' — semantically nonliteral, intensely regional.",
      },
    ],
    vocabulary: [
      { cell_id: "ebbc998b-23f0-488e-943f-85dc79a27028", word: "chido", english: "cool / great (Mexico)", pronunciation: "CHEE-doh", part_of_speech: "adj", regional: [{ region: "MX", form: "chido", note: "Pervasive Mexican slang for 'cool'." }] },
      { cell_id: "1c700a08-7bc8-4c82-9484-50946033288e", word: "guay", english: "cool (Spain)", pronunciation: "gwai", part_of_speech: "adj", regional: [{ region: "ES", form: "guay", note: "Spain-only; sounds foreign in LatAm." }] },
      { cell_id: "062aa797-2c68-413f-9c0c-4f7eab770cba", word: "chévere", english: "cool / great (Caribbean, Venezuela, Colombia)", pronunciation: "CHEH-veh-reh", part_of_speech: "adj", regional: [{ region: "VE", form: "chévere" }, { region: "CO", form: "chévere" }, { region: "Caribbean", form: "chévere" }] },
      { cell_id: "9dc5a884-8c4a-4c59-bfab-e675dc85e7b1", word: "copado", english: "cool (Argentina, Uruguay)", pronunciation: "koh-PAH-doh", part_of_speech: "adj", regional: [{ region: "AR", form: "copado" }, { region: "UY", form: "copado" }] },
      { cell_id: "09ad6c85-b4d0-4fb0-bc77-0119fc1edd9e", word: "padre", english: "cool (Mexico, colloquial; lit. father)", pronunciation: "PAH-dreh", part_of_speech: "adj", regional: [{ region: "MX", form: "padre" }] },
      { cell_id: "a50a6f7a-9b8d-4cc6-831e-c6d9185eef7f", word: "bacán", english: "cool (Andean: Chile, Peru, Ecuador, Cuba)", pronunciation: "bah-KAHN", part_of_speech: "adj", regional: [{ region: "CL", form: "bacán" }, { region: "PE", form: "bacán" }, { region: "CU", form: "bacán" }] },
      { cell_id: "c0d3f722-13f3-4110-8a7e-d3fbc7b3e9d3", word: "jerga", english: "slang / jargon", pronunciation: "HEHR-gah", part_of_speech: "noun", gender: "f" },
      { cell_id: "6ced2e53-9f06-4bf7-a531-75c38a29529b", word: "coloquial", english: "colloquial", pronunciation: "koh-loh-KYAHL", part_of_speech: "adj" },
      { cell_id: "dc228a96-2f98-464a-9102-78beb3bb2dfe", word: "regionalismo", english: "regionalism", pronunciation: "reh-hyoh-nah-LEES-moh", part_of_speech: "noun", gender: "m" },
      { cell_id: "7c304985-b099-4541-9065-a35c69cbdc2c", word: "estándar", english: "standard (variety)", pronunciation: "ehs-TAHN-dahr", part_of_speech: "adj" },
      { cell_id: "cd02d4d2-e200-4182-bf6b-a755f49a9b7a", word: "boludo", english: "dude / idiot (Argentine, complex)", pronunciation: "boh-LOO-doh", part_of_speech: "noun", gender: "m", regional: [{ region: "AR", form: "boludo", note: "Insult or affectionate vocative depending on tone; never use as outsider." }] },
      { cell_id: "b510118f-3e31-4aef-b055-ddadff30fb8f", word: "wey/güey", english: "dude (Mexican)", pronunciation: "wey", part_of_speech: "noun", gender: "m", regional: [{ region: "MX", form: "güey/wey", note: "Mexican vocative for friend; outsider use sounds artificial." }] },
    ],
    grammar: [
      {
        point: "Why slang is recognition-only at C1",
        explanation:
          "Slang carries IN-GROUP signaling that L2 speakers can't fake. Saying CHIDO in Mexico City as a learner triggers either (a) friendliness if your accent is good and you're clearly trying to fit in, or (b) discomfort if you sound like a textbook. The risk/reward is bad. Standard Spanish ('está genial', 'qué bueno') works everywhere, never sounds wrong, costs nothing. Slang for production is a year-5+ skill.",
      },
    ],
    cultural_note:
      "Regional slang maps onto identity hard. Argentine BOLUDO is the textbook example: between close friends it's affectionate ('che boludo, vamos'); between strangers it's hostile; from a non-Argentine it's almost always wrong. The same logic applies to Mexican GÜEY, Caribbean MANO, Spanish TÍO/TÍA. The C1 learner watches and listens. Reading what register the slang projects (working-class vs middle-class, urban vs rural, young vs older) is its own skill, learned through extensive TV and film exposure.",
    regional_variants: [
      { meaning: "cool / great", peninsular: "guay", latam: "chido (MX) / chévere (VE/CO/CU) / copado (AR/UY) / bacán (CL/PE)" },
      { meaning: "dude / friend (vocative)", peninsular: "tío / tía", latam: "güey/wey (MX) / boludo (AR) / chamo (VE) / parce (CO)" },
      { meaning: "very / really", peninsular: "tela / un montón", latam: "bien (MX) / re- (AR, prefix)" },
    ],
    tip:
      "When you encounter slang, note: (1) what region, (2) what register signal (positive/negative, formal/informal, in-group/neutral), (3) the standard equivalent. Build a one-page slang reference per region you frequently encounter. Don't try to use it; just read it confidently. The C1 reward is comprehension, not production.",
  },

  // ── 9. Literary tenses — narrative imperfect ──────────────────────────
  {
    id: "spanish_narrative_imperfect",
    level: "C1",
    category: "literary_tenses",
    title: "Narrative imperfect — setting the scene",
    subtitle: "Era una tarde de invierno — the imperfect as literary backdrop",
    intro:
      "B1 introduced the imperfect as 'used to' or 'was -ing'. C1 literature exploits a richer use: the imperfect as the SCENE itself, the slowed time inside which preterite events fire off like brief flashes. 'Era una tarde de invierno. Llovía. La casa olía a libros viejos. Entonces sonó el teléfono.' The imperfect creates atmosphere; the preterite punctures it. Reading 20th-century Spanish prose, this contrast is the texture of the page.",
    sentences: [
      {
        spanish: "Era una tarde de noviembre. Llovía sin descanso, y el aire olía a humo y a tierra mojada.",
        english: "It was a November afternoon. It was raining without stop, and the air smelled of smoke and wet earth.",
        pronunciation: "EH-rah OO-nah TAR-deh deh noh-BYEHM-breh. yoh-VEE-ah seen dehs-KAHN-soh, ee ehl AI-reh oh-LEE-ah ah OO-moh ee ah TYEH-rrah moh-HAH-dah",
        note: "Three imperfects (era, llovía, olía) and zero preterites — pure scene-setting. The author paints a sustained moment. A preterite would freeze time into one event; the imperfect lets time flow.",
      },
      {
        spanish: "Caminaba sola por la calle, pensaba en su madre, cuando de pronto oyó la voz.",
        english: "She was walking alone down the street, was thinking about her mother, when suddenly she heard the voice.",
        pronunciation: "kah-mee-NAH-bah SOH-lah pohr lah KAH-yeh, pehn-SAH-bah ehn soo MAH-dreh, KWAHN-doh deh PROHN-toh oh-YOH lah vohs",
        note: "TWO imperfects setting up ongoing activity (caminaba, pensaba) interrupted by ONE preterite (oyó). 'De pronto' often marks the imperfect-to-preterite pivot. Classic narrative structure.",
      },
      {
        spanish: "En aquellos años todos creían que la guerra terminaría pronto.",
        english: "In those years everyone believed the war would end soon.",
        pronunciation: "ehn ah-KEH-yohs AH-nyohs TOH-dohs kreh-EE-ahn keh lah GEH-rrah tehr-mee-nah-REE-ah PROHN-toh",
        note: "CREÍAN (imperfect) — the held belief, durative, sustained. Combined with conditional TERMINARÍA inside the subordinate. Pluperfect would make it look back at a completed point; imperfect leaves it open, atmospheric.",
      },
      {
        spanish: "El mar rugía. Las olas golpeaban el barco. El capitán miraba el horizonte sin decir palabra.",
        english: "The sea was roaring. The waves were pounding the boat. The captain looked at the horizon without saying a word.",
        pronunciation: "ehl mahr roo-HEE-ah. lahs OH-lahs gohl-peh-AH-bahn ehl BAR-koh. ehl kah-pee-TAHN mee-RAH-bah ehl oh-ree-SOHN-teh seen deh-SEER pah-LAH-brah",
        note: "Three parallel imperfects build a single sustained scene. Translation into English requires past continuous ('was roaring', 'was pounding') which feels heavier — Spanish imperfect flows lighter and more naturally for atmospheric setup.",
      },
      {
        spanish: "Mientras el reloj marcaba las tres, Pablo escribía su última carta.",
        english: "While the clock struck three, Pablo was writing his last letter.",
        pronunciation: "MYEHN-trahs ehl reh-LOH mar-KAH-bah lahs trehs, PAH-bloh ehs-kree-BEE-ah soo OOL-tee-mah KAR-tah",
        note: "MIENTRAS + imperfect + imperfect — two parallel ongoing actions. The 'while X, Y' structure with both verbs in imperfect is the canonical literary frame for simultaneous ongoing actions.",
      },
    ],
    vocabulary: [
      { cell_id: "80dddcab-e7a0-4780-b6d7-59c1956564c6", word: "narrativa", english: "narrative", pronunciation: "nah-rrah-TEE-vah", part_of_speech: "noun", gender: "f" },
      { cell_id: "4f9f1889-ac70-4d87-a09f-8de2841a590e", word: "trasfondo", english: "background / backdrop", pronunciation: "trahs-FOHN-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "2fd50376-1d76-48ae-a301-769367f46f30", word: "ambiente", english: "atmosphere", pronunciation: "ahm-BYEHN-teh", part_of_speech: "noun", gender: "m" },
      { cell_id: "34b72a55-c98b-4246-8f74-f23a436772dd", word: "ambientación", english: "scene-setting / ambient setting", pronunciation: "ahm-byehn-tah-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "967c5464-2a99-475e-9c72-5db4ea5d59e4", word: "transcurrir", english: "to elapse / pass (time)", pronunciation: "trahns-koo-RREER", part_of_speech: "verb" },
      { cell_id: "c7969b98-2896-478e-8e70-8ecbf8932d1f", word: "rugir", english: "to roar", pronunciation: "roo-HEER", part_of_speech: "verb" },
      { cell_id: "d92ff72c-2ae0-4c12-aaed-17f581aa75ef", word: "golpear", english: "to pound / strike", pronunciation: "gohl-peh-AHR", part_of_speech: "verb" },
      { cell_id: "692f76e4-b4e5-4142-b68e-de7a0924134d", word: "horizonte", english: "horizon", pronunciation: "oh-ree-SOHN-teh", part_of_speech: "noun", gender: "m" },
      { cell_id: "67c9d4e7-5467-469c-9c62-fd9c025414fb", word: "tierra mojada", english: "wet earth (idiom for petrichor)", pronunciation: "TYEH-rrah moh-HAH-dah", part_of_speech: "phrase" },
      { cell_id: "44c0a7bb-da2d-41e0-acd9-4b88cb335876", word: "de pronto", english: "suddenly", pronunciation: "deh PROHN-toh", part_of_speech: "phrase" },
      { cell_id: "f4f67f74-74d2-4fdd-ae81-bfc885e78e79", word: "mientras", english: "while", pronunciation: "MYEHN-trahs", part_of_speech: "conj" },
    ],
    grammar: [
      {
        point: "Atmospheric imperfect vs habitual imperfect",
        explanation:
          "B1's imperfect handles habit: 'Todos los días iba a la escuela' (every day I went to school). C1's narrative imperfect handles ATMOSPHERE — a single sustained moment, not a repeated routine. 'Llovía esa tarde' isn't 'it used to rain' or 'it would rain'; it's 'it was raining (right then)'. The grammar is the same; the rhetorical function is different. Reading 20th-century Spanish prose, learn to feel the difference.",
        examples: [
          { spanish: "De niño jugaba en el parque. (habitual)", english: "As a child I used to play in the park." },
          { spanish: "Esa tarde jugaba solo en el parque. (atmospheric)", english: "That afternoon I was playing alone in the park." },
        ],
      },
      {
        point: "Imperfect-preterite alternation as narrative rhythm",
        explanation:
          "Long stretches of imperfect set the scene; preterite verbs punch the events that move the plot. 'Era de noche. Hacía frío. Pablo caminaba despacio. Entonces vio la luz.' Three imperfects build, one preterite breaks. Modern Spanish-language journalism uses this pattern too — feature stories open with imperfect scene-setting and pivot to preterite for the news event.",
      },
    ],
    cultural_note:
      "García Márquez, Cortázar, Bolaño, Vargas Llosa — all the canonical 20th-century Latin American novelists exploit the imperfect-preterite contrast. Reading 'Cien años de soledad' aloud, the imperfect is the timeless feel of Macondo; the preterite is when the colonel finally faced the firing squad. The technique came from Spanish-language journalism (Carpentier, Mariátegui) and crossed into fiction. C1 reading is partly learning to feel the texture.",
    tip:
      "Open any Spanish-language novel to chapter 1. Count the imperfects vs preterites in the first 20 verbs. Most literary novels open with 60-80% imperfect. The few preterites mark the events that the story will follow. Doing this with 5 novels gives you the rhythm.",
  },

  // ── 10. Literary tenses — pretérito anterior ──────────────────────────
  {
    id: "spanish_preterito_anterior_literary",
    level: "C1",
    category: "literary_tenses",
    title: "Pretérito anterior — the dying tense",
    subtitle: "Hubo terminado, hubo salido — a tense alive only in literary prose",
    intro:
      "Pretérito anterior — hubo + past participle — is functionally extinct in spoken Spanish. You will never hear it on the street, in a film, or on TV. But it survives in 19th-century literature, formal historical writing, and the occasional self-consciously high-register passage. It marks an event completed IMMEDIATELY BEFORE another preterite event, often after 'apenas', 'en cuanto', 'cuando'. C1 reading skill: recognize it and parse the time. Production: never.",
    sentences: [
      {
        spanish: "Apenas hubo terminado de hablar, salió de la habitación.",
        english: "As soon as he had finished speaking, he left the room.",
        pronunciation: "ah-PEH-nahs OO-boh tehr-mee-NAH-doh deh ah-BLAR, sah-LYOH deh lah ah-bee-tah-SYOHN",
        note: "APENAS + PRETÉRITO ANTERIOR + PRETERITE. The 'hubo terminado' marks completion an instant before 'salió'. In modern Spanish you'd say 'apenas terminó, salió' or 'tan pronto como terminó, salió' — same meaning, simpler tenses.",
      },
      {
        spanish: "Cuando hubo cerrado la puerta, se sentó a llorar.",
        english: "When he had closed the door, he sat down to cry.",
        pronunciation: "KWAHN-doh OO-boh seh-RRAH-doh lah PWEHR-tah, seh sehn-TOH ah yoh-RAHR",
        note: "CUANDO + PRETÉRITO ANTERIOR + PRETERITE. 19th-century Spanish novelistic register — Galdós, Pardo Bazán. Modern translation would be 'cuando cerró la puerta, se sentó'.",
      },
      {
        spanish: "Una vez que hubo escrito la carta, la rompió.",
        english: "Once he had written the letter, he tore it up.",
        pronunciation: "OO-nah behs keh OO-boh ehs-KREE-toh lah KAR-tah, lah rohm-PYOH",
        note: "UNA VEZ QUE = once / after. Triggers preterite anterior in 19th-c. prose. Today: 'Una vez escrita la carta, la rompió' (past participle absolute construction) or 'cuando escribió la carta, la rompió' (preterite).",
      },
      {
        spanish: "En cuanto el rey hubo entrado, todos se levantaron.",
        english: "As soon as the king had entered, everyone stood up.",
        pronunciation: "ehn KWAHN-toh ehl reh-EE OO-boh ehn-TRAH-doh, TOH-dohs seh leh-bahn-TAH-rohn",
        note: "Solemn / historic register — court chronicles, classical historiography. The pretérito anterior here adds ceremony.",
      },
      {
        spanish: "Después que hubieron desaparecido los invitados, el silencio se hizo total.",
        english: "After the guests had disappeared, the silence became total.",
        pronunciation: "dehs-PWEHS keh oo-BYEH-rohn dehs-ah-pah-reh-SEE-doh lohs een-bee-TAH-dohs, ehl see-LEHN-syoh seh EE-soh toh-TAHL",
        note: "Plural form HUBIERON. Note literary register — modern Spanish would just use 'desaparecieron'. Reading Borges or Cortázar, expect this construction maybe twice in a story; producing it in conversation would sound bizarre.",
      },
    ],
    vocabulary: [
      { cell_id: "f415c4e4-8e05-43df-a0c5-29e860bdaa2a", word: "apenas", english: "as soon as / hardly", pronunciation: "ah-PEH-nahs", part_of_speech: "adv" },
      { cell_id: "b0b693c1-ecdb-4ba5-a8b7-08dfb199d356", word: "en cuanto", english: "as soon as", pronunciation: "ehn KWAHN-toh", part_of_speech: "phrase" },
      { cell_id: "2cbd1891-c6d5-4c4b-8264-4681255b60a8", word: "una vez que", english: "once / after", pronunciation: "OO-nah behs keh", part_of_speech: "phrase" },
      { cell_id: "86e07545-0a92-49a3-8861-3329b9b4300f", word: "después que", english: "after (literary)", pronunciation: "dehs-PWEHS keh", part_of_speech: "phrase" },
      { cell_id: "6e058171-b1b6-4473-9432-7b1885335b3a", word: "tan pronto como", english: "as soon as", pronunciation: "tahn PROHN-toh KOH-moh", part_of_speech: "phrase" },
      { cell_id: "b5a93929-aa49-4812-9671-20c900fdf218", word: "anterior", english: "previous / anterior", pronunciation: "ahn-teh-RYOR", part_of_speech: "adj" },
      { cell_id: "9e68fefa-b594-4eba-b13c-6e0173d4bbaf", word: "arcaico", english: "archaic", pronunciation: "ar-KAI-koh", part_of_speech: "adj" },
      { cell_id: "43f4074c-541f-4872-83f9-818d7c4473ce", word: "decimonónico", english: "19th-century (as adj.)", pronunciation: "deh-see-moh-NOH-nee-koh", part_of_speech: "adj" },
      { cell_id: "d53f0910-b10b-458f-817b-ba5454f8f10e", word: "rompió", english: "tore / broke (preterite of romper)", pronunciation: "rohm-PYOH", part_of_speech: "verb" },
      { cell_id: "84267c45-4821-4e5f-aa19-bb1a5b08faf6", word: "habitación", english: "room", pronunciation: "ah-bee-tah-SYOHN", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "How pretérito anterior is formed",
        explanation:
          "PRETERITE OF HABER + PAST PARTICIPLE. Hube/hubiste/hubo/hubimos/hubisteis/hubieron + cantado/comido/vivido. The auxiliary is the preterite of haber (not present, not imperfect). Past participle invariant — never agrees with subject when haber is the auxiliary. Total construction: 'hube terminado' (I had just finished, prior to another preterite).",
      },
      {
        point: "Modern replacements",
        explanation:
          "Spoken Spanish replaces pretérito anterior in three ways: (1) just use the preterite ('cuando terminó, salió'); (2) use the pluperfect ('cuando había terminado, salió') if duration matters; (3) use a past participle absolute ('terminada la conversación, salió') for literary feel without the dead tense. Producing pretérito anterior is wrong-register; producing any of these three is fine.",
      },
    ],
    cultural_note:
      "Reading 'Fortunata y Jacinta' (Galdós, 1887), expect pretérito anterior every few pages. Reading a Carmen Martín Gaite novel (1990s), expect it once a chapter as a deliberate vintage marker. Reading a 2023 newspaper, expect zero. The tense is a fossil in the language — preserved in writing as a style marker, gone from speech. Spanish-major students sometimes try to deploy it in essays to sound 'cultured'; native readers detect it as overreach instantly. Recognition: yes. Production: no.",
    tip:
      "When reading and you encounter 'hubo + participle', mentally substitute the simple preterite. 'Cuando hubo cerrado la puerta, salió' = 'cuando cerró la puerta, salió'. The author is signaling literary register and instant-prior completion; you parse the time relationship the same way as for a simple preterite.",
  },

  // ── 11. Literary tenses — historic present ────────────────────────────
  {
    id: "spanish_historic_present",
    level: "C1",
    category: "literary_tenses",
    title: "Historic present — past as present",
    subtitle: "En 1492, Colón llega a América — present tense for past events",
    intro:
      "Spanish journalism, history textbooks, biographies, and oratorical narrative routinely use the PRESENT tense for completed past events. 'En 1492, Colón llega a América. En 1521, los españoles destruyen Tenochtitlán.' This is the historic present (presente histórico). It pulls the listener into the past as if they were watching it happen. C1 readers parse it fluently; C1 speakers can deploy it for dramatic narrative effect.",
    sentences: [
      {
        spanish: "En 1492, Colón llega al Caribe pensando que es Asia.",
        english: "In 1492, Columbus arrives in the Caribbean thinking it's Asia.",
        pronunciation: "ehn meel kwah-troh-SYEHN-tohs noh-BEHN-tah ee dohs, koh-LOHN YEH-gah ahl kah-REE-beh pehn-SAHN-doh keh ehs ah-SYAH",
        note: "LLEGA, PIENSA — present tense for events 530+ years past. Standard historiography frame. A textbook would use this voice for entire chapters. Past tense ('llegó') would work too but feels flatter, less immersive.",
      },
      {
        spanish: "García Lorca publica 'Bodas de sangre' en 1933 y, tres años después, es asesinado en Granada.",
        english: "García Lorca publishes 'Blood Wedding' in 1933 and, three years later, is murdered in Granada.",
        pronunciation: "gar-SEE-ah LOHR-kah poo-BLEE-kah BOH-dahs deh SAHN-greh ehn meel noh-veh-SYEHN-tohs treh-een-tah ee trehs ee trehs AH-nyohs dehs-PWEHS, ehs ah-seh-see-NAH-doh ehn grah-NAH-dah",
        note: "Biographical historic present. The whole arc of a life rendered in present. Journalistic / literary biography standard register.",
      },
      {
        spanish: "Era domingo por la tarde. Estoy en el café cuando entra y se sienta a mi lado.",
        english: "It was Sunday afternoon. I'm at the café when he walks in and sits down next to me.",
        pronunciation: "EH-rah doh-MEEN-goh pohr lah TAR-deh. ehs-TOY ehn ehl kah-FEH KWAHN-doh EHN-trah ee seh SYEHN-tah ah mee LAH-doh",
        note: "Conversational historic present — telling a past story in present tense for vividness. Note the imperfect frame ('era domingo') gives way to present (estoy, entra, se sienta). This is informal storytelling, not just literary.",
      },
      {
        spanish: "Borges escribe 'El Aleph' en 1945; el cuento aparece publicado en revista en 1949.",
        english: "Borges writes 'The Aleph' in 1945; the story appears published in a magazine in 1949.",
        pronunciation: "BOHR-hehs ehs-KREE-beh ehl ah-LEHF ehn meel noh-veh-SYEHN-tohs kwah-rehn-tah ee SEEN-koh; ehl KWEHN-toh ah-pah-REH-seh poo-blee-KAH-doh ehn reh-BEES-tah ehn meel noh-veh-SYEHN-tohs kwah-rehn-tah ee NWEH-veh",
        note: "Academic literary register — when biographers and critics narrate the writer's career, present tense is default. ESCRIBE, APARECE — both presents, both decades ago.",
      },
      {
        spanish: "Y entonces, te lo juro, se levanta y empieza a gritar.",
        english: "And then, I swear, he stands up and starts yelling.",
        pronunciation: "ee ehn-TOHN-sehs, teh loh HOO-roh, seh leh-BAHN-tah ee ehm-PYEH-sah ah gree-TAR",
        note: "Pure conversational historic present — telling a story dramatically. The 'te lo juro' marks oral storytelling. English does this too: 'And then he stands up and STARTS yelling.' Universal narrative move.",
      },
    ],
    vocabulary: [
      { cell_id: "64ac090d-d2b0-4413-9b99-4f3d853544d7", word: "presente histórico", english: "historic present (grammar term)", pronunciation: "preh-SEHN-teh ees-TOH-ree-koh", part_of_speech: "noun", gender: "m" },
      { cell_id: "89d976d9-fb35-419e-9f57-08f37e6b74b0", word: "narrar", english: "to narrate", pronunciation: "nah-RRAR", part_of_speech: "verb" },
      { cell_id: "0ddcd4d5-df33-47bf-94eb-a2fd1140b96d", word: "publicar", english: "to publish", pronunciation: "poo-blee-KAR", part_of_speech: "verb" },
      { cell_id: "e65ad98b-85c4-43ee-bf98-ad5c4c324c66", word: "asesinato", english: "murder / assassination", pronunciation: "ah-seh-see-NAH-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "90fe786a-869d-4caa-8eda-93171e553064", word: "asesinar", english: "to assassinate / murder", pronunciation: "ah-seh-see-NAR", part_of_speech: "verb" },
      { cell_id: "6ce15da5-69c9-4931-a766-c27647b33c86", word: "aparecer", english: "to appear", pronunciation: "ah-pah-reh-SEHR", part_of_speech: "verb" },
      { cell_id: "828c8c0c-6a5e-475b-ae7d-d999efdea317", word: "publicación", english: "publication", pronunciation: "poo-blee-kah-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "32baee1e-b1a6-457f-958f-10d632937b9b", word: "biografía", english: "biography", pronunciation: "byoh-grah-FEE-ah", part_of_speech: "noun", gender: "f" },
      { cell_id: "832f518d-06f8-4ae9-8248-5d54ae19f684", word: "cronología", english: "chronology", pronunciation: "kroh-noh-loh-HEE-ah", part_of_speech: "noun", gender: "f" },
      { cell_id: "e6eaa22f-14c8-42f3-a4c6-e29dbdf6e5d3", word: "destruir", english: "to destroy", pronunciation: "dehs-troo-EER", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Three contexts where historic present is unmarked",
        explanation:
          "(1) HISTORIOGRAPHY: 'En 1492, Colón llega a América' — events recounted as if witnessed. (2) LITERARY BIOGRAPHY: 'Lorca publica, lee, viaja, muere' — a writer's life narrated in present. (3) ORAL STORYTELLING: 'Y entonces se levanta y dice...' — dramatic narration of a personal anecdote. These are not stylistic choices — they're the default in their context.",
      },
      {
        point: "Switching between historic present and past",
        explanation:
          "Within a single passage, Spanish freely alternates between historic present and preterite/imperfect. The shift is rhetorical: present pulls the reader IN ('Lorca llega a Madrid'), past lets the reader STEP BACK ('Lorca había estudiado en Granada'). A journalist might open a piece in historic present and close in preterite — pulling close, then pulling away. C1 reading: track the shift, feel its effect.",
      },
    ],
    cultural_note:
      "English uses historic present too, but in narrower contexts (sports commentary, oral storytelling). Spanish extends it to journalism, history textbooks, biography, museum captions, documentary voice-over. The result is that reading Spanish history feels more alive than reading English history — the past comes forward into the reader's now. C1 writers can deploy this for effect; in academic essays, alternate between historic present (for events) and preterite (for analysis).",
    tip:
      "Read one Wikipedia article in Spanish about a historical figure. Notice how the lead paragraph almost always uses present tense ('Cervantes nace en Alcalá de Henares en 1547'). Then notice the body paragraphs alternate. The historic present is the texture of Spanish-language reference prose.",
  },

  // ── 12. Literary tenses — free indirect style ─────────────────────────
  {
    id: "spanish_estilo_indirecto_libre",
    level: "C1",
    category: "literary_tenses",
    title: "Free indirect style — characters' thoughts without quote tags",
    subtitle: "Estilo indirecto libre — internal speech in 3rd person, no 'pensó que'",
    intro:
      "Free indirect style (estilo indirecto libre) is the technique where a character's thoughts are rendered in third-person past tense, with no 'pensó que' or 'se dijo que' tag. The narrator's voice and the character's voice merge. '¿Qué le iba a decir? ¿Que llegaba tarde por culpa del tren? Era ridículo.' The reader is inside the character's head without being told they are. C1 readers parse this fluidly; learners often miss the shift and assume the narrator is speaking.",
    sentences: [
      {
        spanish: "Miró el reloj. Eran las once. ¿Cómo había podido pasar tan rápido el tiempo?",
        english: "She looked at the clock. It was eleven. How could time have passed so fast?",
        pronunciation: "mee-ROH ehl reh-LOH. EH-rahn lahs OHN-seh. KOH-moh ah-BEE-ah poh-DEE-doh pah-SAR tahn RAH-pee-doh ehl TYEHM-poh",
        note: "First sentence: narrator describing action (preterite). Second: narrator describing scene (imperfect). Third: CHARACTER'S thought rendered in past, no 'pensó que' — the reader is inside her head. Free indirect.",
      },
      {
        spanish: "Pablo entró en la habitación. Allí estaba ella. ¿Por qué había venido? ¿Qué iba a decirle?",
        english: "Pablo walked into the room. There she was. Why had she come? What was he going to say to her?",
        pronunciation: "PAH-bloh ehn-TROH ehn lah ah-bee-tah-SYOHN. ah-YEE ehs-TAH-bah EH-yah. pohr keh ah-BEE-ah beh-NEE-doh? keh EE-bah ah deh-SEER-leh?",
        note: "Two narrator sentences (entró, estaba), then two free-indirect questions. The questions are PABLO'S, but rendered without 'se preguntó'. The shift to interrogative + past tense is the signal.",
      },
      {
        spanish: "María cerró la carta. No la enviaría. No tenía sentido. Él no la entendería nunca.",
        english: "María closed the letter. She wouldn't send it. There was no point. He'd never understand her.",
        pronunciation: "mah-REE-ah seh-RROH lah KAR-tah. noh lah ehn-bee-ah-REE-ah. noh teh-NEE-ah sehn-TEE-doh. ehl noh lah ehn-tehn-deh-REE-ah NOON-kah",
        note: "Three free-indirect thought-sentences after a narrator action. CONDITIONAL (enviaría, entendería) used for past prospective thought — what Maria thinks SHE WILL/WON'T do. No tag. The reader merges with her decision-making.",
      },
      {
        spanish: "Llegó al café y se sentó. Hacía frío. Tendría que pedirse algo caliente. Quizás un té.",
        english: "She got to the café and sat down. It was cold. She'd have to order something hot. Maybe a tea.",
        pronunciation: "yeh-GOH ahl kah-FEH ee seh sehn-TOH. ah-SEE-ah FREE-oh. tehn-DREE-ah keh peh-DEER-seh AHL-goh kah-LYEHN-teh. kee-SAHS oon teh",
        note: "Two narrator clauses, then two free-indirect thought-clauses. TENDRÍA (cond) for past prospective decision; QUIZÁS without verb is character voice. The 'maybe a tea' is exactly her thought — the narrator wouldn't say that.",
      },
      {
        spanish: "Y eso era todo. Nada más. Una vida. Un nombre. Un punto en el mapa.",
        english: "And that was all. Nothing more. A life. A name. A dot on the map.",
        pronunciation: "ee EH-soh EH-rah TOH-doh. NAH-dah mahs. OO-nah BEE-dah. oon NOHM-breh. oon POON-toh ehn ehl MAH-pah",
        note: "Pure free indirect — a character's resigned summing-up rendered in fragments. No verb-tagged thought. The fragmentary syntax mimics the character's mental cadence. Modernist-literary register; common in 20th-c. Spanish-language prose.",
      },
    ],
    vocabulary: [
      { cell_id: "09e364d9-16bf-4410-94f0-874ce6d5d3f6", word: "estilo indirecto libre", english: "free indirect style / FIS", pronunciation: "ehs-TEE-loh een-dee-REHK-toh LEE-breh", part_of_speech: "phrase" },
      { cell_id: "bdefcd7e-6a72-4af3-8cd4-38a5cd089dd3", word: "discurso", english: "discourse / speech (technical)", pronunciation: "dees-KOOR-soh", part_of_speech: "noun", gender: "m" },
      { cell_id: "c10826be-b0f9-4821-85ff-cf3b4236625b", word: "narrador", english: "narrator", pronunciation: "nah-rrah-DOHR", part_of_speech: "noun", gender: "m" },
      { cell_id: "0ea220c6-b496-4d6e-a573-b65240dc806c", word: "voz narrativa", english: "narrative voice", pronunciation: "vohs nah-rrah-TEE-vah", part_of_speech: "phrase" },
      { cell_id: "2edb5bd3-5432-48d6-bfa2-1449d640cc8b", word: "monólogo interior", english: "interior monologue", pronunciation: "moh-NOH-loh-goh een-teh-RYOR", part_of_speech: "phrase" },
      { cell_id: "25ef750c-af94-47cb-a861-cf1924630c72", word: "punto de vista", english: "point of view", pronunciation: "POON-toh deh BEES-tah", part_of_speech: "phrase" },
      { cell_id: "071f5581-e42b-4f42-8764-d5b574434d07", word: "focalización", english: "focalization (narrative term)", pronunciation: "foh-kah-lee-sah-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "9d884671-75a3-46b0-88a3-7eb53459ff6b", word: "carta", english: "letter (correspondence)", pronunciation: "KAR-tah", part_of_speech: "noun", gender: "f" },
      { cell_id: "02b48225-fa93-4861-9611-e0213dde92a8", word: "tener sentido", english: "to make sense", pronunciation: "teh-NEHR sehn-TEE-doh", part_of_speech: "phrase" },
      { cell_id: "122b6747-d27b-4d7f-9c5d-fcc8d4622bfa", word: "fragmentario", english: "fragmentary", pronunciation: "frahg-mehn-TAH-ryoh", part_of_speech: "adj" },
    ],
    grammar: [
      {
        point: "Three signals that mark FIS",
        explanation:
          "(1) INTERROGATIVE in past tense — '¿Cómo había podido?' rendered without 'se preguntó'. (2) MODAL / EVALUATIVE adverbs out of place for narration — 'quizás', 'seguramente', 'por suerte' — these are voice markers. (3) CONDITIONAL for prospective thought — 'no lo haría' = 'I won't do it' as the character now thinks it. Any of these three after a tagged narrator action signals: the next sentence is in the character's voice, not the narrator's.",
      },
      {
        point: "Distinguishing FIS from indirect speech with 'que'",
        explanation:
          "INDIRECT SPEECH: 'Pensó que llegaba tarde.' Tag 'pensó que' makes it clear who's speaking. FIS: 'Llegaba tarde.' No tag, but context tells us it's the character. The shift from one to the other is a stylistic choice — FIS pulls the reader closer to the character's interior; indirect speech keeps the narrator visible as mediator. Both are normal; FIS feels more literary.",
        examples: [
          { spanish: "Tagged: Se dijo que tenía que irse.", english: "She told herself she had to leave." },
          { spanish: "FIS: Tenía que irse.", english: "She had to leave. (in her voice)" },
        ],
      },
    ],
    cultural_note:
      "García Márquez, Borges, Onetti, Carpentier — Spanish-language modernist novelists rely on FIS for interiority. Translating these authors into English requires the same technique; FIS is universal in literary fiction. The challenge for L2 readers is the INVISIBILITY of the shift — there is no 'thinks Maria' tag, just a tense change and a tonal change. Reading slowly with awareness of voice ownership is the C1 skill. Reading 'El llano en llamas' (Rulfo) is a master class.",
    tip:
      "When you encounter a paragraph in past tense that contains a question, a 'quizás', or a conditional that doesn't logically belong to the narrator's voice, you're in FIS. Pause. Ask yourself: who is thinking this? If the answer is 'the character we're following', the shift has happened. Practice with the opening of any Borges story.",
  },

  // ── 13. Rhetoric — anaphora ───────────────────────────────────────────
  {
    id: "spanish_anaphora_rhetoric",
    level: "C1",
    category: "rhetoric",
    title: "Anaphora — repetition that persuades",
    subtitle: "Vinimos a luchar, vinimos a vencer, vinimos a quedarnos",
    intro:
      "Anaphora (anáfora) is the deliberate repetition of a word or phrase at the start of consecutive clauses. 'Vinimos a luchar. Vinimos a vencer. Vinimos a quedarnos.' Spanish oratory, political speechwriting, and literary persuasion lean on it heavily — it builds momentum, signals conviction, and binds parallel ideas together. C1 readers identify it instantly; C1 writers deploy it in formal essays and speeches with restraint.",
    sentences: [
      {
        spanish: "Vinimos a trabajar. Vinimos a construir. Vinimos a quedarnos.",
        english: "We came to work. We came to build. We came to stay.",
        pronunciation: "vee-NEE-mohs ah trah-bah-HAR. vee-NEE-mohs ah kohns-troo-EER. vee-NEE-mohs ah keh-DAR-nohs",
        note: "Three clauses, each opening with VINIMOS A. The repetition makes each verb (trabajar, construir, quedarnos) hit harder. Political-speech register; you'd hear this from a labor leader or activist.",
      },
      {
        spanish: "Hoy decimos basta. Hoy decimos no más. Hoy decimos nunca jamás.",
        english: "Today we say enough. Today we say no more. Today we say never again.",
        pronunciation: "oy deh-SEE-mohs BAHS-tah. oy deh-SEE-mohs noh mahs. oy deh-SEE-mohs NOON-kah hah-MAHS",
        note: "HOY DECIMOS as anchor. Three nominal complements escalate (basta → no más → nunca jamás). The escalation IS the rhetorical work. Repetition without escalation feels flat; with escalation it climbs.",
      },
      {
        spanish: "No es por nosotros. No es por hoy. Es por los que vienen.",
        english: "It's not for us. It's not for today. It's for those who come after.",
        pronunciation: "noh ehs pohr noh-SOH-trohs. noh ehs pohr oy. ehs pohr lohs keh BYEH-nehn",
        note: "Anaphora on NO ES + parallel structure broken by ES on the third clause. The negation pattern sets expectation; the positive third clause delivers the resolution. Classical rhetorical structure.",
      },
      {
        spanish: "Lucharemos en las calles, lucharemos en las plazas, lucharemos hasta el último aliento.",
        english: "We will fight in the streets, we will fight in the squares, we will fight until our last breath.",
        pronunciation: "loo-chah-REH-mohs ehn lahs KAH-yehs, loo-chah-REH-mohs ehn lahs PLAH-sahs, loo-chah-REH-mohs AHS-tah ehl OOL-tee-moh ah-LYEHN-toh",
        note: "Three-fold anaphora. Note the implicit Churchill echo. Spanish-language oratory inherits both classical (Cicero) and modern (20th-c. political speeches) anaphora traditions. The three-beat pattern is universal.",
      },
      {
        spanish: "Es la voz del pueblo. Es la voz de los olvidados. Es la voz que no se calla.",
        english: "It is the voice of the people. It is the voice of the forgotten. It is the voice that won't be silenced.",
        pronunciation: "ehs lah vohs dehl PWEH-bloh. ehs lah vohs deh lohs ohl-bee-DAH-dohs. ehs lah vohs keh noh seh KAH-yah",
        note: "ES LA VOZ anaphora with escalating qualification (del pueblo → de los olvidados → que no se calla). Each repetition adds urgency. Classic Latin American protest rhetoric register.",
      },
    ],
    vocabulary: [
      { cell_id: "90b5e510-6e20-4078-b601-ed11b8bf28f3", word: "anáfora", english: "anaphora", pronunciation: "ah-NAH-foh-rah", part_of_speech: "noun", gender: "f" },
      { cell_id: "40b901ae-98fd-4795-a236-c315356cf951", word: "repetición", english: "repetition", pronunciation: "reh-peh-tee-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "37e378e8-44dc-4aca-a17b-f9408aebd9f7", word: "retórica", english: "rhetoric", pronunciation: "reh-TOH-ree-kah", part_of_speech: "noun", gender: "f" },
      { cell_id: "9bdb9015-79b3-42fa-bd57-f6649f5d6135", word: "oratoria", english: "oratory", pronunciation: "oh-rah-TOH-ryah", part_of_speech: "noun", gender: "f" },
      { cell_id: "ca9ee848-f29a-4eb7-b50c-62f83f975d54", word: "discurso", english: "speech / address", pronunciation: "dees-KOOR-soh", part_of_speech: "noun", gender: "m" },
      { cell_id: "3afa1589-80fd-4cf2-a0bd-0873f7bfc14c", word: "énfasis", english: "emphasis", pronunciation: "EHN-fah-sees", part_of_speech: "noun", gender: "m" },
      { cell_id: "4d017dc4-62c2-4d03-a78f-48e2ae8e3c6f", word: "cadencia", english: "cadence / rhythm", pronunciation: "kah-DEHN-syah", part_of_speech: "noun", gender: "f" },
      { cell_id: "ac007896-bece-4a81-a576-ce0bcb8f3fd9", word: "escalada", english: "escalation / build-up", pronunciation: "ehs-kah-LAH-dah", part_of_speech: "noun", gender: "f" },
      { cell_id: "07b6fb76-c735-4173-9d69-29dd1f668b55", word: "olvidado", english: "forgotten one", pronunciation: "ohl-bee-DAH-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "06c44aca-7d37-409e-ac5b-7a7a47337dbd", word: "callarse", english: "to be silent / shut up", pronunciation: "kah-YAR-seh", part_of_speech: "verb" },
      { cell_id: "c8fe6866-a28c-4c41-b1bd-6b6dad4f914d", word: "aliento", english: "breath", pronunciation: "ah-LYEHN-toh", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "The three-beat rule",
        explanation:
          "Spanish anaphora almost always comes in threes. Two repetitions feel underdeveloped; four or more feel hectoring. The third element typically escalates or resolves — 'vinimos a trabajar, vinimos a construir, vinimos a QUEDARNOS' (resolution). 'No es por nosotros, no es por hoy, ES POR los que vienen' (negation→affirmation pivot). Plan three clauses; vary the third.",
      },
      {
        point: "Anaphora vs simple repetition",
        explanation:
          "ANAPHORA: repetition at the START of consecutive clauses for rhetorical effect. SIMPLE REPETITION: just saying the same word twice. The difference is structural intent. 'Te quiero, te quiero, te quiero' is repetition (emotional emphasis). 'Te quiero por lo que dices, te quiero por lo que callas, te quiero por lo que aún no me has dicho' is anaphora (rhetorical structure).",
      },
    ],
    cultural_note:
      "Latin American political oratory — Allende, Castro, Chávez, Lula's Spanish-language speeches — relies heavily on anaphora. Spanish-language activism inherits it through José Martí, Pablo Neruda's political poetry, and the protest tradition. A Mexican AMLO speech contains 5-10 anaphora structures per address. C1 readers parse them instantly as rhetorical signals; C1 writers deploy them for high-stakes formal writing (op-eds, manifestos, public letters). Use sparingly — anaphora loses force with overuse.",
    tip:
      "Find one Spanish-language speech online (any politician, any era). Listen for the three-beat patterns. Transcribe two of them and analyze what's repeated and what varies. Then in your next formal Spanish essay, write ONE anaphoric three-beat sentence as the closing of a paragraph. The structure rewards deliberate use.",
  },

  // ── 14. Rhetoric — paralelismo ────────────────────────────────────────
  {
    id: "spanish_paralelismo",
    level: "C1",
    category: "rhetoric",
    title: "Paralelismo — parallel structures",
    subtitle: "Pensar es vivir, escribir es perdurar, callar es desaparecer",
    intro:
      "Paralelismo is the building block of formal Spanish prose. Two or more clauses sharing the same grammatical structure but different content. 'Trabajo de día, estudio de noche.' 'Pensar es vivir; escribir es perdurar.' The reader's mind processes the parallel structure as a single rhythmic unit, and the contrast or accumulation between the parallel elements does the rhetorical work. Spanish essay writing without paralelismo feels lumpy; with it, it flows.",
    sentences: [
      {
        spanish: "Pensar es vivir; escribir es perdurar.",
        english: "To think is to live; to write is to endure.",
        pronunciation: "pehn-SAR ehs bee-BEER; ehs-kree-BEER ehs pehr-doo-RAR",
        note: "Two parallel clauses: INFINITIVO + ES + INFINITIVO. The semicolon separates without subordinating; the parallel structure makes the two ideas resonate. Aphoristic register — common in op-eds and literary essays.",
      },
      {
        spanish: "Por la mañana lee, por la tarde escribe, por la noche piensa.",
        english: "In the morning he reads, in the afternoon he writes, at night he thinks.",
        pronunciation: "pohr lah mah-NYAH-nah LEH-eh, pohr lah TAR-deh ehs-KREE-beh, pohr lah NOH-cheh PYEHN-sah",
        note: "Triple paralelismo: POR LA + time + VERB. The frame is identical; the content varies. Builds a portrait through accumulation. Notice English struggles to keep this structure — Spanish carries it gracefully.",
      },
      {
        spanish: "No quiero tu lástima, no busco tu perdón, no necesito tu aprobación.",
        english: "I don't want your pity, I'm not seeking your forgiveness, I don't need your approval.",
        pronunciation: "noh KYEH-roh too LAHS-tee-mah, noh BOOS-koh too pehr-DOHN, noh neh-seh-SEE-toh too ah-proh-bah-SYOHN",
        note: "Triple paralelismo with semantic gradation (querer → buscar → necesitar). The parallel structure makes the refusal cumulative. This combines paralelismo with anaphora (NO + verb).",
      },
      {
        spanish: "El que mucho habla, poco escucha; el que mucho promete, poco cumple.",
        english: "He who speaks much, listens little; he who promises much, fulfills little.",
        pronunciation: "ehl keh MOO-choh AH-blah, POH-koh ehs-KOO-chah; ehl keh MOO-choh proh-MEH-teh, POH-koh KOOM-pleh",
        note: "Proverbial paralelismo: EL QUE MUCHO X, POCO Y. Two parallel sentences, semicolon-joined. Proverbial register — feels like wisdom literature. Quevedo, Cervantes, Borges all use this structure.",
      },
      {
        spanish: "Que cante el que tenga voz, que escriba el que tenga palabra, que actúe el que tenga fuerza.",
        english: "Let the one who has a voice sing, let the one who has words write, let the one who has strength act.",
        pronunciation: "keh KAHN-teh ehl keh TEHN-gah vohs, keh ehs-KREE-bah ehl keh TEHN-gah pah-LAH-brah, keh ahk-TOO-eh ehl keh TEHN-gah FWEHR-sah",
        note: "Triple paralelismo with embedded subjunctive (CANTE, ESCRIBA, ACTÚE — exhortative; TENGA, TENGA, TENGA — relative clause subj.). Combines paralelismo with subjunctive layering. High formal register.",
      },
    ],
    vocabulary: [
      { cell_id: "32297361-2f39-47ba-bb05-998fab13d9b5", word: "paralelismo", english: "parallelism", pronunciation: "pah-rah-leh-LEES-moh", part_of_speech: "noun", gender: "m" },
      { cell_id: "e352927a-9d0f-4acf-98dc-929cf0cdadd7", word: "estructura", english: "structure", pronunciation: "ehs-trook-TOO-rah", part_of_speech: "noun", gender: "f" },
      { cell_id: "df18fcd2-7c8c-4965-9942-4d23a5128c8e", word: "perdurar", english: "to endure / last", pronunciation: "pehr-doo-RAR", part_of_speech: "verb" },
      { cell_id: "5cc0fe80-5015-4ade-9539-fa6173d37a56", word: "lástima", english: "pity", pronunciation: "LAHS-tee-mah", part_of_speech: "noun", gender: "f" },
      { cell_id: "d12f1b64-1b42-4426-8c10-0b7a95daa8f8", word: "perdón", english: "forgiveness", pronunciation: "pehr-DOHN", part_of_speech: "noun", gender: "m" },
      { cell_id: "9c72756d-d920-458a-bac0-d89d30288aba", word: "aprobación", english: "approval", pronunciation: "ah-proh-bah-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "5f8c7a5f-5252-4cc1-86d7-bd4bc4a70536", word: "cumplir", english: "to fulfill / comply", pronunciation: "koom-PLEER", part_of_speech: "verb" },
      { cell_id: "1a3c9683-9dae-4bf6-92fa-8e69e3ff40cb", word: "aforismo", english: "aphorism", pronunciation: "ah-foh-REES-moh", part_of_speech: "noun", gender: "m" },
      { cell_id: "70c0c37a-8851-493f-b2b8-f0795fd2ffb3", word: "sentencia", english: "maxim / sentence (proverbial)", pronunciation: "sehn-TEHN-syah", part_of_speech: "noun", gender: "f" },
      { cell_id: "927a0a46-39cf-434c-b117-6d31444c9705", word: "gradación", english: "gradation / progression", pronunciation: "grah-dah-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "49a9d5f2-ca1a-483e-a50e-73a98ce12d5a", word: "exhortativo", english: "exhortative", pronunciation: "ek-sohr-tah-TEE-voh", part_of_speech: "adj" },
    ],
    grammar: [
      {
        point: "Distinguishing paralelismo from listing",
        explanation:
          "LISTING: 'Compré pan, leche, y huevos.' Just enumeration. PARALELISMO: 'Compré pan al panadero, leche al vaquero, y huevos al granjero.' Same structural pattern (compré X al Y) repeated. Paralelismo requires structural repetition, not just multiple items. The structural echo is what makes the prose rhythmic.",
      },
      {
        point: "Combining with antithesis",
        explanation:
          "Paralelismo + antithesis is one of the most powerful Spanish rhetorical structures. 'El sabio calla; el necio habla.' Identical structure (article + adj + verb), opposite content. Quevedo's specialty: 'Es hielo abrasador, es fuego helado.' The parallel structure FRAMES the antithesis; the antithesis CONTENTS the parallel. See lesson on antithesis.",
      },
    ],
    cultural_note:
      "Latin American essayists — Reyes, Paz, Borges, Vargas Llosa — write in paralelismos. The aphoristic Spanish essay tradition descends from Gracián (17th c.) through Cervantes to modern op-ed. Reading Octavio Paz's 'El laberinto de la soledad' is reading paralelismo on every page. The structure is so foundational that Spanish-language readers parse paragraphs by their parallel rhythm; a paragraph without parallel structures feels disorganized to a native ear.",
    tip:
      "After drafting a formal Spanish paragraph, scan it for opportunities to convert two related clauses into paralelismo. Find a moment where you've said 'X and also Y'; rewrite as 'X; Y' with parallel structure. Two well-placed paralelismos per paragraph transform a competent essay into a stylish one.",
  },

  // ── 15. Rhetoric — antithesis ─────────────────────────────────────────
  {
    id: "spanish_antithesis_rhetoric",
    level: "C1",
    category: "rhetoric",
    title: "Antithesis — opposites in tension",
    subtitle: "Vivimos para morir, morimos para vivir — Quevedo's school of opposites",
    intro:
      "Antithesis (antítesis) juxtaposes opposing ideas in adjacent clauses or phrases to make each more visible. Quevedo and the Baroque poets built poems out of it. Modern Spanish political speech, journalism, and aphoristic writing inherits the technique. 'Es hielo abrasador, es fuego helado.' 'Hablar es plata, callar es oro.' The contrast creates the meaning; neither side alone would carry the weight.",
    sentences: [
      {
        spanish: "El que mucho habla, poco dice.",
        english: "He who speaks much, says little.",
        pronunciation: "ehl keh MOO-choh AH-blah, POH-koh DEE-seh",
        note: "MUCHO / POCO + HABLAR / DECIR — quantitative and semantic antithesis combined. Proverbial register. Note the parallel structure FRAMES the antithesis (paralelismo + antítesis combined, as discussed in lesson 14).",
      },
      {
        spanish: "Vivimos para morir, morimos para vivir.",
        english: "We live to die, we die to live.",
        pronunciation: "bee-BEE-mohs PAH-rah moh-REER, moh-REE-mohs PAH-rah bee-BEER",
        note: "Chiasmus + antithesis. VIVIR / MORIR swap positions across the two clauses. Religious / philosophical register; deployed by Calderón ('La vida es sueño'). The form is as old as Spanish literature.",
      },
      {
        spanish: "Quería decir mucho y dijo poco; pensó callar y habló demasiado.",
        english: "He wanted to say much and said little; he thought to stay silent and talked too much.",
        pronunciation: "keh-REE-ah deh-SEER MOO-choh ee DEE-hoh POH-koh; pehn-SOH kah-YAR ee ah-BLOH deh-mah-SYAH-doh",
        note: "Two paralleled antitheses. QUERER / DECIR and PENSAR / HABLAR each set up opposed intentions and outcomes. The doubled structure intensifies the irony. Aphoristic-essay register.",
      },
      {
        spanish: "Es ciego el que ve y vidente el que no mira.",
        english: "Blind is he who sees, and seeing is he who doesn't look.",
        pronunciation: "ehs SYEH-goh ehl keh veh ee bee-DEHN-teh ehl keh noh MEE-rah",
        note: "Inverted predicate (ES CIEGO EL QUE) + antithesis (VER / NO MIRAR). The inversion adds gravity; the antithesis pivots seeing as physical vs. seeing as perception. Borges-style aphorism.",
      },
      {
        spanish: "Ganamos perdiendo y perdimos ganando.",
        english: "We won by losing and lost by winning.",
        pronunciation: "gah-NAH-mohs pehr-DYEHN-doh ee pehr-DEE-mohs gah-NAHN-doh",
        note: "Compact antithesis with chiastic inversion. Common in sports columns, political post-mortems, philosophical asides. The form is so tight it bears interpretation only with context — that's its rhetorical power.",
      },
    ],
    vocabulary: [
      { cell_id: "fc0e1006-6503-45b9-bbf8-25bccb6570ae", word: "antítesis", english: "antithesis", pronunciation: "ahn-TEE-teh-sees", part_of_speech: "noun", gender: "f" },
      { cell_id: "b48b706b-f441-43d4-bea6-6fa5d66fe711", word: "oposición", english: "opposition / contrast", pronunciation: "oh-poh-see-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "66893396-633c-4be4-a0ad-5b3e1cb1a9b6", word: "contraste", english: "contrast", pronunciation: "kohn-TRAHS-teh", part_of_speech: "noun", gender: "m" },
      { cell_id: "13089011-fbdc-46a8-a737-95035f1e2f6c", word: "quiasmo", english: "chiasmus", pronunciation: "KYAHS-moh", part_of_speech: "noun", gender: "m" },
      { cell_id: "fda2f926-8243-4d9d-a6ae-922476577652", word: "vidente", english: "seer / one who sees", pronunciation: "bee-DEHN-teh", part_of_speech: "noun", gender: "mf" },
      { cell_id: "a672e0e2-83cf-4634-bb4d-425c836da608", word: "ciego", english: "blind", pronunciation: "SYEH-goh", part_of_speech: "adj" },
      { cell_id: "0842b4ad-2768-48ca-a30d-1ebd7c40d5f5", word: "paradoja", english: "paradox", pronunciation: "pah-rah-DOH-hah", part_of_speech: "noun", gender: "f" },
      { cell_id: "7c805c7b-c8c8-404e-a9ea-30dc65c173e2", word: "ironía", english: "irony", pronunciation: "ee-roh-NEE-ah", part_of_speech: "noun", gender: "f" },
      { cell_id: "09ef7170-fd5e-489d-94a2-1a0da9a4e428", word: "abrasador", english: "scorching / burning", pronunciation: "ah-brah-sah-DOHR", part_of_speech: "adj" },
      { cell_id: "3e60619d-f2dc-4895-9d56-4831d84c12b1", word: "helado", english: "frozen / icy", pronunciation: "eh-LAH-doh", part_of_speech: "adj" },
      { cell_id: "9f74906f-f1fb-4b1a-b883-31202d1c1df5", word: "callar", english: "to be silent", pronunciation: "kah-YAR", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Antithesis pairs that recur in Spanish",
        explanation:
          "Common antithetical pairs: HABLAR/CALLAR, GANAR/PERDER, VIVIR/MORIR, AMOR/ODIO, LUZ/OSCURIDAD, RECORDAR/OLVIDAR, BUSCAR/ENCONTRAR, DAR/RECIBIR. Spanish rhetoric leans on these specific binaries — they appear in proverbs, poems, op-eds. C1 writers can deploy a fresh antithesis by combining a stock pair with a fresh syntactic frame.",
      },
      {
        point: "Chiasmus — the inversion pattern (X-Y / Y-X)",
        explanation:
          "Chiasmus (quiasmo) is an antithesis where the same words appear in reversed order across two clauses: 'Vivimos para morir, morimos para vivir' (VIVIR-MORIR / MORIR-VIVIR). The structural reversal mirrors the conceptual reversal. Calderón, Quevedo, and modern Spanish-language essayists deploy chiasmus as the most compact antithesis form.",
        examples: [
          { spanish: "No vivimos para comer; comemos para vivir.", english: "We don't live to eat; we eat to live." },
          { spanish: "Es fácil prometer y difícil cumplir; es difícil cumplir y fácil olvidar.", english: "It's easy to promise and hard to fulfill; it's hard to fulfill and easy to forget." },
        ],
      },
    ],
    cultural_note:
      "Quevedo's love sonnets are a masterclass in antithesis — 'es hielo abrasador, es fuego helado' (it's scorching ice, it's frozen fire). The Spanish Baroque (Siglo de Oro) made antithesis a virtuoso form. The technique survives in Spanish journalism (op-ed headlines like 'Ganamos la batalla, perdimos la guerra'), in Latin American protest rhetoric, and in literary essay. A C1 writer using a single well-placed antithesis lifts a paragraph noticeably.",
    tip:
      "When drafting a formal Spanish paragraph, look for places where you've stated something. Ask: what's its opposite? Could the opposite be placed in adjacent structure as a contrast? Often the answer is yes. One sharp antithesis per essay is plenty — the form weakens with overuse.",
  },

  // ── 16. Rhetoric — period sentence ────────────────────────────────────
  {
    id: "spanish_period_sentence",
    level: "C1",
    category: "rhetoric",
    title: "The period sentence — delayed resolution",
    subtitle: "La oración periódica — long sentences with the main clause at the end",
    intro:
      "The period sentence (oración periódica) is a long sentence with subordinate clauses front-loaded and the main verb delayed until near the end. The reader sustains expectation through the dependent material and lands on the main clause as a kind of release. Borges and García Márquez built famous opening sentences on this structure. C1 reading: parse long sentences without losing the thread. C1 writing: deploy occasionally for emphasis.",
    sentences: [
      {
        spanish: "Aunque había llovido toda la noche y el camino seguía embarrado, aunque su madre le había advertido del peligro y los vecinos le habían mirado con extrañeza, Pablo salió.",
        english: "Although it had rained all night and the road was still muddy, although his mother had warned him of the danger and the neighbors had looked at him strangely, Pablo went out.",
        pronunciation: "OWN-keh ah-BEE-ah yoh-BEE-doh TOH-dah lah NOH-cheh ee ehl kah-MEE-noh seh-GEE-ah ehm-bah-RRAH-doh, OWN-keh soo MAH-dreh leh ah-BEE-ah ahd-behr-TEE-doh dehl peh-LEE-groh ee lohs beh-SEE-nohs leh ah-BEE-ahn mee-RAH-doh kohn ek-strah-NYEH-sah, PAH-bloh sah-LYOH",
        note: "Two AUNQUE clauses front-loaded, main verb SALIÓ at the very end. The reader holds expectation through ~30 words; the single preterite delivers the climax. Note conjuctions are repeated for parallel emphasis.",
      },
      {
        spanish: "Si pudiéramos escoger el día en que vamos a morir, si supiéramos la hora exacta y el lugar preciso, si tuviéramos la certeza de que nuestros seres queridos estarían allí, quizás moriríamos mejor.",
        english: "If we could choose the day we're going to die, if we knew the exact hour and the precise place, if we had the certainty that our loved ones would be there, perhaps we'd die better.",
        pronunciation: "see poo-DYEH-rah-mohs ehs-koh-HEHR ehl DEE-ah ehn keh BAH-mohs ah moh-REER, see soo-PYEH-rah-mohs lah OH-rah ek-SAHK-tah ee ehl loo-GAR preh-SEE-soh, see too-VYEH-rah-mohs lah sehr-TEH-sah deh keh NWEHS-trohs SEH-rehs keh-REE-dohs ehs-tah-REE-ahn ah-YEE, kee-SAHS moh-ree-REE-ah-mohs meh-HOHR",
        note: "Three SI clauses building a hypothetical, with main clause QUIZÁS MORIRÍAMOS MEJOR delivered at the end. Philosophical-essay register. The pause before the main clause invites contemplation.",
      },
      {
        spanish: "Después de tantos años, después de tantas conversaciones interrumpidas, después de tanto silencio compartido sin saber qué decir, finalmente se dijeron adiós.",
        english: "After so many years, after so many interrupted conversations, after so much shared silence not knowing what to say, finally they said goodbye to each other.",
        pronunciation: "dehs-PWEHS deh TAHN-tohs AH-nyohs, dehs-PWEHS deh TAHN-tahs kohn-behr-sah-SYOH-nehs een-teh-rroom-PEE-dahs, dehs-PWEHS deh TAHN-toh see-LEHN-syoh kohm-pahr-TEE-doh seen sah-BEHR keh deh-SEER, fee-nahl-MEHN-teh seh dee-HYEH-rohn ah-DYOHS",
        note: "Three temporal phrases anaphora (DESPUÉS DE) + emotional weight builds + main clause SE DIJERON ADIÓS lands. Literary register. The accumulation makes the goodbye feel inevitable.",
      },
      {
        spanish: "Como si nada hubiera pasado, como si el tiempo se hubiera detenido, como si los años entre ellos no contaran, sonrió y le tendió la mano.",
        english: "As if nothing had happened, as if time had stopped, as if the years between them didn't count, he smiled and held out his hand.",
        pronunciation: "KOH-moh see NAH-dah oo-BYEH-rah pah-SAH-doh, KOH-moh see ehl TYEHM-poh seh oo-BYEH-rah deh-teh-NEE-doh, KOH-moh see lohs AH-nyohs EHN-treh EH-yohs noh kohn-TAH-rahn, sohn-RYOH ee leh tehn-DYOH lah MAH-noh",
        note: "Three COMO SI clauses with pluperfect subjunctive (hubiera pasado, hubiera detenido, contaran — note the third drops to past subj. without 'hubiera'). The action arrives only at the end: SONRIÓ ... TENDIÓ. Borges-style structure.",
      },
      {
        spanish: "Cuando el sol asomó por encima de las montañas, cuando el silencio del valle se rompió con el canto de los pájaros, cuando el aire se llenó del olor de la tierra recién regada, Marina abrió los ojos.",
        english: "When the sun appeared over the mountains, when the silence of the valley broke with birdsong, when the air filled with the smell of freshly watered earth, Marina opened her eyes.",
        pronunciation: "KWAHN-doh ehl sohl ah-soh-MOH pohr ehn-SEE-mah deh lahs mohn-TAH-nyahs, KWAHN-doh ehl see-LEHN-syoh dehl BAH-yeh seh rohm-PYOH kohn ehl KAHN-toh deh lohs PAH-hah-rohs, KWAHN-doh ehl AI-reh seh yeh-NOH dehl oh-LOHR deh lah TYEH-rrah reh-SYEHN reh-GAH-dah, mah-REE-nah ah-BRYOH lohs OH-hohs",
        note: "Three CUANDO clauses paint the scene; the main action (Marina opening her eyes) lands. Note that the temporal clauses are factual (preterite, not subj.) because they describe what actually happened. Pure scene-into-action structure.",
      },
    ],
    vocabulary: [
      { cell_id: "a60a5516-6fc5-4b8a-86ab-cbfc7ffbdebb", word: "oración periódica", english: "period sentence", pronunciation: "oh-rah-SYOHN peh-RYOH-dee-kah", part_of_speech: "phrase" },
      { cell_id: "2353b5fa-c5fb-4bc4-9c9d-fd467027d868", word: "subordinada", english: "subordinate (clause)", pronunciation: "soob-ohr-dee-NAH-dah", part_of_speech: "adj" },
      { cell_id: "2df54651-1697-4607-80b1-e50fa583c5d1", word: "principal", english: "main (clause)", pronunciation: "preen-see-PAHL", part_of_speech: "adj" },
      { cell_id: "bf2f4074-9264-403c-9b25-b2b5cbcba4ab", word: "expectativa", english: "expectation", pronunciation: "ek-spehk-tah-TEE-vah", part_of_speech: "noun", gender: "f" },
      { cell_id: "d4a8e1ae-1cae-40d5-8b2d-995b76b1130b", word: "embarrado", english: "muddy", pronunciation: "ehm-bah-RRAH-doh", part_of_speech: "adj" },
      { cell_id: "a1f3865b-2c1c-42bc-8567-b0c0618e30a4", word: "advertir", english: "to warn", pronunciation: "ahd-behr-TEER", part_of_speech: "verb" },
      { cell_id: "45a4cc5c-a6aa-44a5-9841-7395c63d4c78", word: "asomar", english: "to appear / peek out", pronunciation: "ah-soh-MAR", part_of_speech: "verb" },
      { cell_id: "19a2de58-044d-43ec-84a8-363fe798ea5f", word: "tender la mano", english: "to extend the hand", pronunciation: "tehn-DEHR lah MAH-noh", part_of_speech: "phrase" },
      { cell_id: "d0f34673-21d4-4afe-a5a7-33a15d0f102f", word: "regado", english: "watered", pronunciation: "reh-GAH-doh", part_of_speech: "adj" },
      { cell_id: "36d8511e-4a3e-499d-94d2-928a43d8ad7f", word: "valle", english: "valley", pronunciation: "BAH-yeh", part_of_speech: "noun", gender: "m" },
      { cell_id: "de42d1fc-b4df-453f-adc6-c76e7590b3d8", word: "canto", english: "song / singing", pronunciation: "KAHN-toh", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "How to build a period sentence",
        explanation:
          "(1) Decide the main clause — the punch you want. (2) Identify two or three contextual clauses that build expectation — temporal (cuando…), conditional (si…), concessive (aunque…), comparative (como si…). (3) Order them at the start, often with anaphora. (4) Land the main clause with no qualifier — short, declarative. The structure is: [DEPENDENT 1, DEPENDENT 2, DEPENDENT 3,] [MAIN CLAUSE].",
      },
      {
        point: "Period sentence vs Spanish-language pile-up",
        explanation:
          "A period sentence is INTENTIONAL — designed with the main clause delayed for effect. A pile-up is what happens when a writer just keeps adding subordinate clauses without planning the resolution. Period: 30+ words, ends with a clean main clause. Pile-up: 50+ words, ends with the writer's exhaustion. Read your sentence aloud — if the listener doesn't feel the landing, it's a pile-up.",
      },
    ],
    cultural_note:
      "García Márquez opens 'Cien años de soledad' with a period sentence — 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.' (Many years later, facing the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to see ice.) The structure does the rhetorical work: future remembering of past wonder, all built before the main verb. C1 readers of Spanish literature parse these constantly.",
    tip:
      "Take a competent paragraph you've already written in Spanish. Find a sentence where you've stated context first and then made your point. Try rewriting it as a period sentence — put all the context up front and end on the point. Often the rhythm improves dramatically. Use one period sentence per essay for emphasis; more than two becomes affectation.",
  },

  // ── 17. Professional writing — academic essay ─────────────────────────
  {
    id: "spanish_academic_essay",
    level: "C1",
    category: "professional_writing",
    title: "Academic essay — the ensayo académico",
    subtitle: "Tesis, planteamiento, desarrollo, conclusión — the four-act structure",
    intro:
      "The Spanish-language academic essay (ensayo académico) follows a tighter template than its English counterpart. Tesis (thesis), planteamiento (problem statement), desarrollo (argument), conclusión (conclusion). Each section uses register markers — connectors, hedging, citation conventions — that signal academic seriousness. Internalizing the template is faster than composing from scratch. C1 students writing for university or publication will produce dozens of these.",
    sentences: [
      {
        spanish: "El presente ensayo se propone analizar la influencia de las redes sociales en el discurso político contemporáneo.",
        english: "The present essay aims to analyze the influence of social media on contemporary political discourse.",
        pronunciation: "ehl preh-SEHN-teh ehn-SAH-yoh seh proh-POH-neh ah-nah-lee-SAR lah een-floo-EHN-syah deh lahs REH-dehs soh-SYAH-lehs ehn ehl dees-KOOR-soh poh-LEE-tee-koh kohn-tehm-poh-RAH-neh-oh",
        note: "Textbook opener. EL PRESENTE ENSAYO + SE PROPONE + ANALIZAR is the standard frame. Note SE PROPONE — the essay does the proposing, not the author. The impersonal construction is the academic register marker.",
      },
      {
        spanish: "Como apunta García (2018, p. 45), la dimensión simbólica del fenómeno suele pasarse por alto en los estudios previos.",
        english: "As García (2018, p. 45) points out, the symbolic dimension of the phenomenon is usually overlooked in prior studies.",
        pronunciation: "KOH-moh ah-POON-tah gar-SEE-ah dohs meel dyeh-see-OH-choh PAH-hee-nah kwah-rehn-tah ee SEEN-koh, lah dee-mehn-SYOHN seem-BOH-lee-kah dehl feh-NOH-meh-noh SWEH-leh pah-SAR-seh pohr AHL-toh ehn lohs ehs-TOO-dyohs preh-VYOHS",
        note: "COMO APUNTA / SEÑALA / OBSERVA + AUTHOR + (YEAR, p. PAGE) — APA-style Spanish citation. The choice of verb (APUNTA, SEÑALA, AFIRMA, SOSTIENE, ARGUYE) signals the speaker's stance on the cited author's claim. APUNTA = neutral; AFIRMA = stronger; SOSTIENE = even stronger.",
      },
      {
        spanish: "Si bien algunos autores han defendido la tesis contraria, los datos sugieren una correlación robusta.",
        english: "Although some authors have defended the opposite thesis, the data suggest a robust correlation.",
        pronunciation: "see byehn ahl-GOO-nohs OW-toh-rehs ahn deh-fehn-DEE-doh lah TEH-sees kohn-TRAH-ryah, lohs DAH-tohs soo-HYEH-rehn OO-nah koh-rreh-lah-SYOHN roh-BOOS-tah",
        note: "SI BIEN = although (concessive, formal). Pivots between concession and core claim. Combined with hedge SUGIEREN (suggest, not prove). Academic register acknowledges opposing views before asserting its own — Spanish convention as much as English.",
      },
      {
        spanish: "Para los efectos del presente análisis, se entenderá por 'populismo' aquella forma de discurso político que apela directamente al pueblo.",
        english: "For the purposes of the present analysis, 'populism' shall be understood as that form of political discourse that appeals directly to the people.",
        pronunciation: "PAH-rah lohs eh-FEHK-tohs dehl preh-SEHN-teh ah-NAH-lee-sees, seh ehn-tehn-deh-RAH pohr poh-poo-LEES-moh ah-KEH-yah FOHR-mah deh dees-KOOR-soh poh-LEE-tee-koh keh ah-PEH-lah dee-rehk-tah-MEHN-teh ahl PWEH-bloh",
        note: "Definitional move: SE ENTENDERÁ POR X = X shall be understood as. The impersonal future tense (entenderá) is the formal academic register marker for defining terms.",
      },
      {
        spanish: "A modo de conclusión, cabe señalar que los hallazgos aquí presentados abren nuevas líneas de investigación.",
        english: "By way of conclusion, it is worth noting that the findings presented here open new lines of research.",
        pronunciation: "ah MOH-doh deh kohn-kloo-SYOHN, KAH-beh seh-NYAH-lar keh lohs ah-YAHS-gohs ah-KEE preh-sehn-TAH-dohs AH-brehn NWEH-vahs LEE-nyahs deh een-behs-tee-gah-SYOHN",
        note: "Conclusion opener: A MODO DE CONCLUSIÓN + CABE SEÑALAR (it bears noting). CABE + INF. is a formal hedge. AQUÍ PRESENTADOS is the standard self-reference. ABREN NUEVAS LÍNEAS DE INVESTIGACIÓN = closing modesty (research is incomplete, more to do).",
      },
    ],
    vocabulary: [
      { cell_id: "3cf03c7e-8251-45fa-b36b-9e6e12d7c502", word: "ensayo", english: "essay", pronunciation: "ehn-SAH-yoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "1221f0d9-7b43-4f30-9678-c1955e63eb8b", word: "tesis", english: "thesis (also a degree thesis)", pronunciation: "TEH-sees", part_of_speech: "noun", gender: "f" },
      { cell_id: "838990fb-597d-4923-8c90-af06f19ce0a8", word: "planteamiento", english: "problem statement / framing", pronunciation: "plahn-teh-ah-MYEHN-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "72b283e9-b5a2-4adc-8bdf-14f9d564ea98", word: "desarrollo", english: "development / body of argument", pronunciation: "dehs-ah-RROH-yoh", part_of_speech: "noun", gender: "m" },
      { cell_id: "0aff4999-afa8-4893-8bbe-8c934cc334f6", word: "conclusión", english: "conclusion", pronunciation: "kohn-kloo-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "d1af2aad-5f8c-442a-80c6-bcaf5dca7420", word: "hallazgo", english: "finding", pronunciation: "ah-YAHS-goh", part_of_speech: "noun", gender: "m" },
      { cell_id: "4efcd012-428e-44c2-8f79-31e21268c1c6", word: "sostener", english: "to maintain / hold (a position)", pronunciation: "sohs-teh-NEHR", part_of_speech: "verb" },
      { cell_id: "5bfe45a6-96e8-4f5d-8b74-b836ea4ccd0c", word: "argüir", english: "to argue (formal)", pronunciation: "ar-GWEER", part_of_speech: "verb" },
      { cell_id: "cbc9319f-3b24-430a-9516-6ce7abcf256c", word: "apuntar", english: "to point out", pronunciation: "ah-poon-TAR", part_of_speech: "verb" },
      { cell_id: "94238299-8852-4e4f-b2b8-a969d495d222", word: "señalar", english: "to point out / signal", pronunciation: "seh-nyah-LAR", part_of_speech: "verb" },
      { cell_id: "d156c3a8-bf21-4080-9419-b045197dc229", word: "se propone", english: "aims to (impersonal)", pronunciation: "seh proh-POH-neh", part_of_speech: "phrase" },
      { cell_id: "bef79b2d-740a-470c-b683-ad24b702c977", word: "cabe señalar", english: "it bears noting", pronunciation: "KAH-beh seh-nyah-LAR", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "The four sections of the ensayo académico",
        explanation:
          "(1) PLANTEAMIENTO (intro): frame the question, justify importance, state thesis. Opens with 'El presente ensayo...' (2) MARCO TEÓRICO: situate within existing literature, cite key authors. Opens with 'Como apunta X...', 'Diversos autores han señalado que...' (3) DESARROLLO: lay out the argument in 2-4 sections. Each opens with a connector ('En primer lugar', 'Por otra parte', 'Cabe agregar que'). (4) CONCLUSIÓN: restate, identify open questions, point to future research. Opens with 'A modo de conclusión', 'Para finalizar'.",
      },
      {
        point: "Hedge verbs that signal academic stance",
        explanation:
          "Strongest claim: AFIRMA, ASEGURA, DEMUESTRA. Medium claim: SOSTIENE, ARGUYE, DEFIENDE. Hedged: APUNTA, SEÑALA, OBSERVA, SUGIERE. The choice of verb is a stance signal that a Spanish-reading academic catches instantly. Using AFIRMA where the cited author was tentative is misreporting; using APUNTA where they were assertive is underrepresenting.",
      },
    ],
    cultural_note:
      "Spanish-language academic writing in the humanities tends to be more ornate than English. Longer sentences, more subordination, more 'cabe señalar' style hedging. Latin American academic register (especially Mexican, Argentine, Chilean) leans slightly more direct than Peninsular Spanish, which preserves more 19th-c. essayistic flourishes. The C1 student writing for a Spanish-language journal calibrates by reading the journal's existing articles — house style varies. A US-trained student writing in Spanish for a Spanish-language journal often needs to ADD register, not remove it.",
    tip:
      "Build a personal phrase bank of 30 academic connectors: en primer lugar, por otra parte, cabe señalar, conviene precisar, no obstante, sin embargo, de igual manera, a modo de cierre. Rotate them in essays. The connectors are doing the structural work; the content is yours. Internalize the connectors and the rest gets easier.",
  },

  // ── 18. Professional writing — instancia / formal letter ──────────────
  {
    id: "spanish_instancia_formal_letter",
    level: "C1",
    category: "professional_writing",
    title: "Instancia — the formal request letter",
    subtitle: "Solicito que se sirva considerar mi candidatura — Spain's bureaucratic genre",
    intro:
      "The instancia is a tightly templated Spanish-language formal request letter, used to address authorities — universities, ministries, employers. It's almost ritualistic: opener, identification, exposition, request, closing courtesy. Once you internalize the template, you can produce one in five minutes for any bureaucratic situation. C1 learners in Spain especially encounter this constantly; LatAm uses simpler versions but the high formal register survives.",
    sentences: [
      {
        spanish: "Por la presente, me dirijo a usted con el fin de solicitar la convalidación de mis estudios universitarios.",
        english: "By the present, I address you in order to request the validation of my university studies.",
        pronunciation: "pohr lah preh-SEHN-teh, meh dee-REE-hoh ah oos-TEHD kohn ehl feen deh soh-lee-see-TAR lah kohn-bah-lee-dah-SYOHN deh mees ehs-TOO-dyohs oo-nee-behr-see-TAH-ryohs",
        note: "POR LA PRESENTE = by the present (letter). ME DIRIJO A USTED = I address you (myself). CON EL FIN DE = in order to. This opening is templatic — almost every instancia starts here.",
      },
      {
        spanish: "Acompaño a la presente la documentación requerida en los apartados a), b) y c) del Real Decreto 1234/2020.",
        english: "I attach to the present the documentation required in sections (a), (b), and (c) of Royal Decree 1234/2020.",
        pronunciation: "ah-kohm-PAH-nyoh ah lah preh-SEHN-teh lah doh-koo-mehn-tah-SYOHN reh-keh-REE-dah ehn lohs ah-pahr-TAH-dohs ah, beh ee seh dehl reh-AHL deh-KREH-toh meel dohs-SYEHN-tohs treh-een-tah ee KWAH-troh dee-ah-goh-NAHL dohs meel beh-EEN-teh",
        note: "ACOMPAÑO A LA PRESENTE = I enclose with the present. Legal-administrative register. Note the citation of decree (Real Decreto) — Spanish administrative letters cite the regulation by number.",
      },
      {
        spanish: "Por todo lo expuesto, SOLICITO que se sirva admitir la presente solicitud y resolver en consecuencia.",
        english: "For all the above, I REQUEST that you kindly admit the present application and rule accordingly.",
        pronunciation: "pohr TOH-doh loh ek-spwehs-TOH, soh-LEE-see-toh keh seh SYEHR-vah ahd-mee-TEER lah preh-SEHN-teh soh-lee-see-TOOD ee reh-sohl-BEHR ehn kohn-seh-KWEHN-syah",
        note: "POR TODO LO EXPUESTO = for all the above set forth. SOLICITO is typically in CAPS in the original document (or set apart visually) — it's the legal-effect verb. QUE SE SIRVA = idiom for 'be so kind as to' (formal). Note the embedded subjunctives (sirva, admita, resuelva implied).",
      },
      {
        spanish: "Aprovecho la ocasión para expresarle mi más alta consideración.",
        english: "I take this opportunity to express my highest consideration.",
        pronunciation: "ah-proh-BEH-choh lah oh-kah-SYOHN PAH-rah ek-spreh-SAR-leh mee mahs AHL-tah kohn-see-deh-rah-SYOHN",
        note: "Diplomatic-courtesy closing — used especially for letters to officials, diplomats, very senior figures. Less formal closings: ATENTAMENTE, CORDIALMENTE, RECIBA UN CORDIAL SALUDO. Match register to recipient.",
      },
      {
        spanish: "Sin otro particular, le saluda atentamente, [firma]",
        english: "Without further matter, sincerely yours, [signature]",
        pronunciation: "seen OH-troh par-tee-koo-LAR, leh sah-LOO-dah ah-tehn-tah-MEHN-teh",
        note: "SIN OTRO PARTICULAR = without further matter. LE SALUDA = (he/she) greets you (3rd-person, formal). This closing is standard for business and administrative letters across Spain and LatAm. Note the impersonal third-person address — it adds formal distance.",
      },
    ],
    vocabulary: [
      { cell_id: "452d8024-fda2-47fe-8741-3c881c6bd938", word: "instancia", english: "formal request letter / application", pronunciation: "eens-TAHN-syah", part_of_speech: "noun", gender: "f" },
      { cell_id: "aaae9cde-478f-4c72-9e9c-27d965d96279", word: "solicitud", english: "request / application", pronunciation: "soh-lee-see-TOOD", part_of_speech: "noun", gender: "f" },
      { cell_id: "ee073ac2-3f6c-4a34-a16d-8305452b3511", word: "solicitar", english: "to request / apply for", pronunciation: "soh-lee-see-TAR", part_of_speech: "verb" },
      { cell_id: "66544ac9-62be-4461-a31e-a8f940b0508b", word: "expuesto", english: "set forth / exposed (past part.)", pronunciation: "ek-SPWEHS-toh", part_of_speech: "adj" },
      { cell_id: "8eeb7fdc-99df-4811-ae90-d99628b6cdc6", word: "convalidación", english: "validation / recognition (of credentials)", pronunciation: "kohn-bah-lee-dah-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "b129e3cb-a7df-4ae6-90e5-7ff4b39b904a", word: "apartado", english: "section / paragraph", pronunciation: "ah-par-TAH-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "5af346dc-9e37-4fdd-a19b-aa24b08a5a28", word: "real decreto", english: "royal decree (Spanish law type)", pronunciation: "reh-AHL deh-KREH-toh", part_of_speech: "phrase" },
      { cell_id: "44057ced-d020-41b9-8ba8-7569074a804b", word: "se sirva", english: "may you kindly (subj., formal)", pronunciation: "seh SYEHR-vah", part_of_speech: "phrase" },
      { cell_id: "439c7506-f0e0-4ccf-94e1-15b0bd35e665", word: "atentamente", english: "sincerely / attentively", pronunciation: "ah-tehn-tah-MEHN-teh", part_of_speech: "adv" },
      { cell_id: "0efbe699-52e7-429f-895b-5f5f69d794f8", word: "cordialmente", english: "cordially", pronunciation: "kohr-dyahl-MEHN-teh", part_of_speech: "adv" },
      { cell_id: "b5da042b-f187-49c6-9cd5-438caa785a41", word: "firma", english: "signature", pronunciation: "FEER-mah", part_of_speech: "noun", gender: "f" },
      { cell_id: "a64091b5-e465-4ae3-8e43-16cf530aa126", word: "destinatario", english: "addressee / recipient", pronunciation: "dehs-tee-nah-TAH-ryoh", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "Five-part instancia structure",
        explanation:
          "(1) ENCABEZADO: 'A LA ATENCIÓN DE [official title]' or 'SR./SRA. [name]'. (2) EXPONE (sets forth): 'Que [identifying facts], que [relevant history], que [grounds for request]'. Each starts with QUE on a new line. (3) SOLICITA (requests): 'Por todo lo expuesto, SOLICITO que [specific request]'. (4) DOCUMENTOS ADJUNTOS: list of attached documents. (5) CLOSING: 'En [city], a [date]. Atentamente, [signature].' This structure is ALMOST UNIVERSAL for Spanish administrative requests.",
      },
      {
        point: "Formal verbs in instancias",
        explanation:
          "ME DIRIJO A USTED, ACOMPAÑO, ADJUNTO, REMITO, SOLICITO, RUEGO, EXPONGO, MANIFIESTO. These are first-person present indicative because the letter is the act. AGRADEZCO is the standard thanks. RECIBA / RECIBAN closings: 'reciba usted un cordial saludo'. None of these appear in casual Spanish.",
      },
    ],
    cultural_note:
      "Spain's bureaucracy expects the instancia format. Submitting a casual letter to a ministry — even with the same content — gets you rejected for form. Latin America has more variance: Mexican administrative letters preserve much of the formality; Argentine ones drop some of the most archaic markers (SOLICITO in caps is more Iberian); Chilean and Colombian formal letters land between the two. The high-formal closings ('LE SALUDA ATENTAMENTE', 'APROVECHO LA OCASIÓN') are universal across the Spanish-speaking world but feel slightly archaic to a Mexican reader and standard to a Madrid reader.",
    tip:
      "Build a one-page template of the instancia with your own identifying info already filled in (name, ID number, address). When a request situation arises (student visa renewal, document request, formal complaint), open the template, swap in the specific exposition and request, sign. The form is so ritualized that 90% of the document is reusable.",
  },

  // ── 19. Professional writing — dictamen / technical report ────────────
  {
    id: "spanish_dictamen_technical_report",
    level: "C1",
    category: "professional_writing",
    title: "Dictamen — technical and legal report",
    subtitle: "Antecedentes, fundamentos, conclusiones — the report that decides things",
    intro:
      "A dictamen is a Spanish-language formal report — legal opinion, technical assessment, expert evaluation. Issued by professionals (lawyers, engineers, doctors, auditors) for institutional consumption. Its structure is fixed: ANTECEDENTES (background), FUNDAMENTOS (reasoning), CONCLUSIONES (findings). The register is dry, precise, third-person impersonal. C1 professionals writing in Spanish will produce these for legal, technical, or compliance contexts.",
    sentences: [
      {
        spanish: "El presente dictamen tiene por objeto evaluar la conformidad de la instalación con la normativa vigente.",
        english: "The present report has as its object to evaluate the conformity of the installation with current regulations.",
        pronunciation: "ehl preh-SEHN-teh deek-TAH-mehn TYEH-neh pohr ohb-HEH-toh eh-bah-loo-AR lah kohn-fohr-mee-DAHD deh lah eens-tah-lah-SYOHN kohn lah nohr-mah-TEE-vah bee-HEHN-teh",
        note: "Opening sentence — almost every dictamen begins this way. TIENE POR OBJETO = has as its object. NORMATIVA VIGENTE = current regulations. The impersonal frame distances the author from the assessment.",
      },
      {
        spanish: "ANTECEDENTES: con fecha 15 de marzo, se llevó a cabo la inspección técnica de las instalaciones eléctricas situadas en el inmueble sito en la calle Mayor, número 12.",
        english: "BACKGROUND: on March 15, the technical inspection of the electrical installations located in the building at calle Mayor, number 12, was carried out.",
        pronunciation: "ahn-teh-seh-DEHN-tehs: kohn FEH-chah keen-seh deh MAR-soh, seh yeh-BOH ah KAH-boh lah eens-pehk-SYOHN TEHK-nee-kah deh lahs eens-tah-lah-SYOH-nehs eh-LEHK-tree-kahs see-too-AH-dahs ehn ehl een-MWEH-bleh SEE-toh ehn lah KAH-yeh mah-YOHR, NOO-meh-roh DOH-seh",
        note: "ANTECEDENTES section. CON FECHA + date. SE LLEVÓ A CABO = passive impersonal — 'was carried out'. SITO = situated (formal). All passive impersonal forms (the author doesn't say 'I inspected'; the inspection 'was carried out').",
      },
      {
        spanish: "FUNDAMENTOS: de conformidad con lo dispuesto en el artículo 23 del Reglamento Electrotécnico, las conexiones deben cumplir los siguientes requisitos: [...]",
        english: "REASONING: in accordance with what is set forth in article 23 of the Electrotechnical Regulation, connections must meet the following requirements: [...]",
        pronunciation: "foon-dah-MEHN-tohs: deh kohn-fohr-mee-DAHD kohn loh dees-PWEHS-toh ehn ehl ahr-TEE-koo-loh beh-EEN-tee-trehs dehl reh-glah-MEHN-toh eh-lehk-troh-TEHK-nee-koh, lahs koh-nek-SYOH-nehs DEH-behn koom-PLEER lohs see-GYEHN-tehs reh-kee-SEE-tohs",
        note: "FUNDAMENTOS section. DE CONFORMIDAD CON LO DISPUESTO = in accordance with what is set forth. Standard legal-technical opener. Citing article numbers is mandatory.",
      },
      {
        spanish: "Tras el análisis de las pruebas obtenidas y el contraste con la normativa aplicable, se concluye que la instalación NO cumple con los requisitos mínimos de seguridad.",
        english: "After analysis of the evidence obtained and contrast with applicable regulations, it is concluded that the installation DOES NOT meet the minimum safety requirements.",
        pronunciation: "trahs ehl ah-NAH-lee-sees deh lahs PRWEH-bahs ohb-teh-NEE-dahs ee ehl kohn-TRAHS-teh kohn lah nohr-mah-TEE-vah ah-plee-KAH-bleh, seh kohn-KLOO-yeh keh lah eens-tah-lah-SYOHN noh KOOM-pleh kohn lohs reh-kee-SEE-tohs MEE-nee-mohs deh seh-goo-ree-DAHD",
        note: "Transition into CONCLUSIONES section. TRAS + analysis = after the analysis. SE CONCLUYE = passive impersonal conclusion. The NO before CUMPLE often capitalized for emphasis — the dictamen's headline finding.",
      },
      {
        spanish: "CONCLUSIONES: se desaconseja el uso de la instalación hasta tanto no se hayan subsanado las deficiencias señaladas en el apartado anterior.",
        english: "CONCLUSIONS: use of the installation is not advised until such time as the deficiencies noted in the previous section have been remedied.",
        pronunciation: "kohn-kloo-SYOH-nehs: seh dehs-ah-kohn-SEH-hah ehl OO-soh deh lah eens-tah-lah-SYOHN AHS-tah TAHN-toh noh seh AH-yahn soob-sah-NAH-doh lahs deh-fee-SYEHN-syahs seh-nyah-LAH-dahs ehn ehl ah-par-TAH-doh ahn-teh-RYOR",
        note: "CONCLUSIONES section. SE DESACONSEJA = is not advised (impersonal). HASTA TANTO NO = until such time as. SUBSANAR = to remedy / correct. Legal-technical register. The conclusion is action-oriented — what should and shouldn't be done.",
      },
    ],
    vocabulary: [
      { cell_id: "7b3f92aa-ae6b-461a-bc16-350106927587", word: "dictamen", english: "expert report / formal opinion", pronunciation: "deek-TAH-mehn", part_of_speech: "noun", gender: "m" },
      { cell_id: "1a6cd75e-9ff8-428c-b77b-9c666ed6f1d2", word: "antecedentes", english: "background / antecedents", pronunciation: "ahn-teh-seh-DEHN-tehs", part_of_speech: "noun", gender: "m" },
      { cell_id: "5357e09f-2bf0-4803-bc78-d7d8e538b1a8", word: "fundamentos", english: "reasoning / foundations", pronunciation: "foon-dah-MEHN-tohs", part_of_speech: "noun", gender: "m" },
      { cell_id: "f14ccfa2-f845-4709-86da-a320866c54ae", word: "conclusiones", english: "conclusions / findings", pronunciation: "kohn-kloo-SYOH-nehs", part_of_speech: "noun", gender: "f" },
      { cell_id: "d3460292-e508-4fdd-bc6d-62b9890cc70c", word: "normativa", english: "regulations / norms", pronunciation: "nohr-mah-TEE-vah", part_of_speech: "noun", gender: "f" },
      { cell_id: "81a7303b-f5a0-4ad2-945b-5e576595cb0d", word: "vigente", english: "current / in force", pronunciation: "bee-HEHN-teh", part_of_speech: "adj" },
      { cell_id: "7836762d-3322-4c49-b218-6d9900b86a99", word: "conformidad", english: "conformity / compliance", pronunciation: "kohn-fohr-mee-DAHD", part_of_speech: "noun", gender: "f" },
      { cell_id: "6d89cb05-a655-4059-a41d-2363b4bad3fb", word: "subsanar", english: "to remedy / correct (a deficiency)", pronunciation: "soob-sah-NAR", part_of_speech: "verb" },
      { cell_id: "e341ddd3-cdad-4759-b4f3-bf007b0da34f", word: "deficiencia", english: "deficiency", pronunciation: "deh-fee-SYEHN-syah", part_of_speech: "noun", gender: "f" },
      { cell_id: "39289e13-dd99-457b-ba3c-d07c1b7de7db", word: "inmueble", english: "building / property", pronunciation: "een-MWEH-bleh", part_of_speech: "noun", gender: "m" },
      { cell_id: "71fe9ed4-53da-43eb-8014-eb673bb9197a", word: "perito", english: "expert / appraiser", pronunciation: "peh-REE-toh", part_of_speech: "noun", gender: "m" },
      { cell_id: "9ebd8a7a-8872-4c78-8d1a-af415db7a6b8", word: "pericial", english: "expert (adj., as in informe pericial)", pronunciation: "peh-ree-SYAHL", part_of_speech: "adj" },
    ],
    grammar: [
      {
        point: "Impersonal passive — the dictamen voice",
        explanation:
          "Spanish technical reports rely on SE + 3rd-person impersonal passive throughout: 'se concluye', 'se observa', 'se constata', 'se determina', 'se desaconseja', 'se recomienda'. The author never appears as 'I' or 'we'. This impersonal voice is what makes the report read as objective. C1 writers MUST master this register; using 'I conclude' instead of 'se concluye' makes a dictamen read as a personal opinion piece.",
        examples: [
          { spanish: "Se observa que la conexión no está aislada.", english: "It is observed that the connection is not insulated." },
          { spanish: "Se recomienda la sustitución inmediata.", english: "Immediate replacement is recommended." },
          { spanish: "Se desconoce la fecha exacta del incidente.", english: "The exact date of the incident is unknown." },
        ],
      },
      {
        point: "Legal connectors specific to dictámenes",
        explanation:
          "DE CONFORMIDAD CON (in accordance with), CON ARREGLO A (according to), EN LO QUE RESPECTA A (with regard to), POR LO QUE SE REFIERE A (as for), A LA LUZ DE (in light of), EN VIRTUD DE (by virtue of). These connectors signal the legal-technical register; their absence makes the document read as informal.",
      },
    ],
    cultural_note:
      "Spanish civil engineering, law, and medicine all use the dictamen format. A judge requesting an expert opinion (peritaje) expects this structure; a building inspector documenting a finding produces this format; a medical consultation between physicians (interconsulta) follows a related model. Latin American technical Spanish preserves most of the Peninsular dictamen conventions; minor variations exist (Mexican legal writing has its own idiosyncrasies inherited from indigenous-influenced colonial Spanish). Writing a dictamen as if it were an English-language technical report misfires culturally — the impersonal voice and the three-part structure are non-negotiable.",
    tip:
      "Find a real public-domain dictamen (Spanish judicial decisions, technical inspection reports, environmental impact assessments are available online from many ministries). Read three of them. The structure becomes visible. Then if you ever need to produce one, you have models to imitate. Form-first, then content.",
  },

  // ── 20. Professional writing — citation conventions ───────────────────
  {
    id: "spanish_citation_conventions",
    level: "C1",
    category: "professional_writing",
    title: "Citation conventions in Spanish",
    subtitle: "Como apunta Paz (1950, p. 23) — citing in academic Spanish",
    intro:
      "Spanish-language academic citation borrows the APA, MLA, and Chicago systems but uses Spanish-language stance verbs to introduce sources and Spanish-language conventions for punctuation, page numbering, and reference lists. The C1 writer producing academic Spanish picks ONE system (usually APA-7 in Spanish) and applies it consistently. The choice of stance verb introducing a citation is a substantive C1 skill — it signals the writer's evaluation of the cited work.",
    sentences: [
      {
        spanish: "Como apunta Octavio Paz (1950, p. 23), la soledad es la condición fundamental del ser mexicano.",
        english: "As Octavio Paz (1950, p. 23) points out, solitude is the fundamental condition of being Mexican.",
        pronunciation: "KOH-moh ah-POON-tah ohk-TAH-byoh pahs meel noh-veh-SYEHN-tohs seen-KWEHN-tah PAH-hee-nah veh-een-tee-trehs, lah soh-leh-DAHD ehs lah kohn-dee-SYOHN foon-dah-mehn-TAHL dehl sehr meh-hee-KAH-noh",
        note: "COMO APUNTA + AUTHOR + (YEAR, p. PAGE) — Spanish APA citation. P. = página (page). PP. = páginas (pages, range). The Spanish abbreviation is the same as English in APA. Note APUNTA = neutral stance.",
      },
      {
        spanish: "Varios autores han defendido esta tesis (Borges, 1949; Cortázar, 1963; Bolaño, 1998).",
        english: "Several authors have defended this thesis (Borges, 1949; Cortázar, 1963; Bolaño, 1998).",
        pronunciation: "BAH-ryohs OW-toh-rehs ahn deh-fehn-DEE-doh EHS-tah TEH-sees BOHR-hehs, meel noh-veh-SYEHN-tohs kwah-rehn-tah ee NWEH-veh; kohr-TAH-sar, meel noh-veh-SYEHN-tohs seh-SEHN-tah ee trehs; boh-LAH-nyoh, meel noh-veh-SYEHN-tohs noh-VEHN-tah ee OH-choh",
        note: "Multiple-author citation. Parenthesis with author + year, separated by SEMICOLONS (not commas). Spanish APA differs slightly from English here — semicolons are the standard separator between distinct sources.",
      },
      {
        spanish: "Aunque (García Márquez, 1967) sostiene que el realismo mágico nace en Macondo, otros críticos discrepan.",
        english: "Although (García Márquez, 1967) maintains that magical realism is born in Macondo, other critics disagree.",
        pronunciation: "OWN-keh gar-SEE-ah MAR-kehs meel noh-veh-SYEHN-tohs seh-SEHN-tah ee SYEH-teh sohs-TYEH-neh keh ehl reh-ah-LEES-moh MAH-hee-koh NAH-seh ehn mah-KOHN-doh, OH-trohs KREE-tee-kohs dees-KREH-pahn",
        note: "Embedded citation in parenthesis. SOSTIENE = stronger stance (maintains). Note compound surnames preserve both names — GARCÍA MÁRQUEZ, not just MÁRQUEZ. Critical for Spanish-language indexing.",
      },
      {
        spanish: "Según afirma Cervantes en el prólogo a la primera parte de El Quijote, 'no he podido yo contravenir al orden de la naturaleza' (Cervantes, 1605/1998, p. 12).",
        english: "As Cervantes affirms in the prologue to the first part of Don Quixote, 'I have not been able to contravene the order of nature' (Cervantes, 1605/1998, p. 12).",
        pronunciation: "seh-GOON ah-FEER-mah sehr-VAHN-tehs ehn ehl PROH-loh-goh ah lah pree-MEH-rah PAR-teh dehl kee-HOH-teh, [quote], sehr-VAHN-tehs meel seh-EES-syehn-tohs SEEN-koh dee-ah-goh-NAHL meel noh-veh-SYEHN-tohs noh-VEHN-tah ee OH-choh PAH-hee-nah DOH-seh",
        note: "Citation of classical text with dual date: ORIGINAL/EDITION USED. (1605/1998) tells the reader the work is from 1605 but the cited edition is 1998. Critical for classical works where the edition matters for pagination.",
      },
      {
        spanish: "Las referencias bibliográficas se ordenarán alfabéticamente por apellido del autor, seguido del año de publicación entre paréntesis.",
        english: "Bibliographic references shall be ordered alphabetically by the author's surname, followed by the year of publication in parentheses.",
        pronunciation: "lahs reh-feh-REHN-syahs bee-blee-oh-GRAH-fee-kahs seh ohr-deh-nah-RAHN ahl-fah-beh-tee-kah-MEHN-teh pohr ah-peh-YEE-doh dehl ow-TOHR, seh-GEE-doh dehl AH-nyoh deh poo-blee-kah-SYOHN EHN-treh pah-REHN-teh-sees",
        note: "Style-guide language. Note the impersonal future SE ORDENARÁN — instructional future, common in style guides and academic regulations. Tells the writer how to organize their bibliography.",
      },
    ],
    vocabulary: [
      { cell_id: "2f061985-9481-4d5d-80ca-03b6be6fb1ef", word: "citación", english: "citation", pronunciation: "see-tah-SYOHN", part_of_speech: "noun", gender: "f" },
      { cell_id: "51c693a1-2b30-4c09-877c-d13aeb32c594", word: "referencia", english: "reference", pronunciation: "reh-feh-REHN-syah", part_of_speech: "noun", gender: "f" },
      { cell_id: "dddb747f-4206-469f-89ab-f5686c69a2e4", word: "bibliografía", english: "bibliography", pronunciation: "bee-blee-oh-grah-FEE-ah", part_of_speech: "noun", gender: "f" },
      { cell_id: "d75bbb36-7f64-42a9-9653-86b8f155958c", word: "apellido", english: "surname", pronunciation: "ah-peh-YEE-doh", part_of_speech: "noun", gender: "m" },
      { cell_id: "d0f5ae72-a6c7-43cf-bfe3-ab885e8e9f4d", word: "nombre", english: "first name", pronunciation: "NOHM-breh", part_of_speech: "noun", gender: "m" },
      { cell_id: "15d37dae-4b75-417a-9c2d-f62e6a05bb9c", word: "página", english: "page (often abbreviated 'p.')", pronunciation: "PAH-hee-nah", part_of_speech: "noun", gender: "f" },
      { cell_id: "035f6d35-0462-4892-bb29-f9737af99920", word: "según", english: "according to", pronunciation: "seh-GOON", part_of_speech: "prep" },
      { cell_id: "a1e50305-7715-4f1b-8b68-2e9ec8846360", word: "afirmar", english: "to affirm / assert", pronunciation: "ah-feer-MAR", part_of_speech: "verb" },
      { cell_id: "c7ad0c28-0484-4bea-9ac7-68191bf5340a", word: "discrepar", english: "to disagree / dissent", pronunciation: "dees-kreh-PAR", part_of_speech: "verb" },
      { cell_id: "25479cb6-a540-4741-a09b-ff864fba0972", word: "fuente", english: "source", pronunciation: "FWEHN-teh", part_of_speech: "noun", gender: "f" },
      { cell_id: "e03a132f-61ed-4f3d-b004-88945916a9dc", word: "obra", english: "work (as in literary work)", pronunciation: "OH-brah", part_of_speech: "noun", gender: "f" },
      { cell_id: "cba77968-e8ca-46be-bc82-2daacf351d32", word: "prólogo", english: "prologue", pronunciation: "PROH-loh-goh", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "The stance-verb taxonomy",
        explanation:
          "NEUTRAL: apunta, señala, observa, comenta, indica. MODERATE: sostiene, argumenta, defiende, plantea, propone. STRONG: afirma, asegura, demuestra, prueba, establece. CRITICAL: discrepa, refuta, contradice, cuestiona. The choice tells the reader your stance toward the cited claim. Picking the right verb is half the work of integrating sources into a Spanish academic essay.",
        examples: [
          { spanish: "Como observa Paz (1950)...", english: "As Paz (1950) observes... (neutral)" },
          { spanish: "Como sostiene Paz (1950)...", english: "As Paz (1950) maintains... (moderate stance)" },
          { spanish: "Como demuestra Paz (1950)...", english: "As Paz (1950) demonstrates... (strong endorsement)" },
          { spanish: "Como cuestiona Paz (1950)...", english: "As Paz (1950) calls into question... (critical)" },
        ],
      },
      {
        point: "Spanish bibliographic format (APA-7 Spanish)",
        explanation:
          "Apellido(s), Inicial(es) del Nombre. (Año). Título en cursiva. Editorial. Example: Paz, O. (1950). El laberinto de la soledad. Fondo de Cultura Económica. Surnames first, period separators, year in parentheses, title in italics, publisher last, period at end. The Royal Spanish Academy and most Spanish-language universities follow APA-7 with these adaptations.",
      },
    ],
    cultural_note:
      "Spanish-language academic writing handles compound surnames (García Márquez, Vargas Llosa, Pardo Bazán) differently from English. CITE both — never just the second surname. 'García Márquez (1967)', not 'Márquez (1967)'. Mexican, Argentine, and Spanish universities have slight variations in citation style but all preserve full surnames. The C1 writer who cites a Latin American author as just one surname signals unfamiliarity with the regional convention; the C1 writer who handles full names correctly signals competence.",
    tip:
      "Pick the citation manager you'll use (Zotero is most popular in Spanish-speaking academia; Mendeley is common too). Configure it to APA-7 with Spanish localization. Build your reference list as you write; never leave it for the end. Manual citation formatting is the single biggest source of errors in Spanish academic essays — automate it.",
  },
];

export default lessons;
