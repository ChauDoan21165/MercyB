// src/languages/spanish/lessons-c2.ts
//
// C2 Spanish lessons for English-speaking learners.
// 15 hand-crafted lessons covering CEFR C2 descriptors.
//
// Pedagogical priorities for C2:
//   1. Cultural literacy outranks grammar. At C2 the learner already
//      sounds grammatically native; what's missing is the cultural and
//      literary substrate that educated Spanish speakers swim in.
//   2. Regional ear is mandatory. A C2 speaker places any Spanish
//      speaker phonetically within a few sentences — Andalusian vs
//      Mexican vs Caribbean vs Rioplatense. Three lessons train that.
//   3. Ironic reading is the literacy floor. Spanish-language opinion
//      writing assumes ironic competence; literal readers miss the
//      point. Three lessons drill the ironic reflex.
//   4. Adversarial register is communicative competence. Hostile
//      interviews, fallacy-naming, sustained polite disagreement —
//      three lessons cover the language that survives them.
//   5. Literary criticism is shared educated language. García Márquez,
//      Borges, Cervantes — three lessons deliver the analytical
//      vocabulary required to discuss them with any literate speaker.
//
// This file completes the Spanish curriculum: A1 (14) + A2 (15) +
// B1 (20) + B2 (25) + C1 (20) + C2 (15) = 109 lessons.

import type { SpanishLesson } from "./lessons";

export const lessons: SpanishLesson[] = [
  // ── 1. Idiomatic mastery — Refranes (proverbs) ────────────────────────
  {
    id: "spanish_refranes_classic",
    level: "C2",
    category: "idiomatic_mastery",
    title: "Refranes — the classical canon",
    subtitle: "A buen entendedor, pocas palabras bastan",
    intro:
      "Refranes (proverbs) are the deepest layer of Spanish idiomaticity. They predate the modern language, carry the cadence of medieval Castilian, and surface in editorials, sermons, and family arguments alike. At C2, the goal is not to memorize hundreds — it is to recognize a refrán mid-sentence, finish the second half if the speaker drops it, and read the rhetorical move being made.",
    sentences: [
      {
        spanish: "A buen entendedor, pocas palabras bastan.",
        english: "A word to the wise is enough.",
        pronunciation: "ah bwehn ehn-tehn-deh-DOR, POH-kahs pah-LAH-brahs BAHS-tahn",
        note: "Often shortened to just 'a buen entendedor…' — the listener completes it mentally. Used after a veiled accusation or hint.",
      },
      {
        spanish: "En boca cerrada no entran moscas.",
        english: "A closed mouth catches no flies. (Silence is safest.)",
        pronunciation: "ehn BOH-kah seh-RAH-dah noh EHN-trahn MOHS-kahs",
        note: "The classic Spanish counsel against speaking too freely. Often used as a warning to a child or a colleague who is oversharing.",
      },
      {
        spanish: "No por mucho madrugar amanece más temprano.",
        english: "Getting up earlier won't make dawn come sooner.",
        pronunciation: "noh por MOO-choh mah-droo-GAR ah-mah-NEH-seh mahs tehm-PRAH-noh",
        note: "Rebukes anxious overwork. The 14th-century rhythm survives intact — note the assonance madrugar / amanecer.",
      },
      {
        spanish: "Cría cuervos y te sacarán los ojos.",
        english: "Raise crows and they'll peck your eyes out.",
        pronunciation: "KREE-ah KWEHR-bohs ee teh sah-kah-RAHN lohs OH-hohs",
        note: "Said about ingratitude — usually a child or protégé who turns on their benefactor. Also the title of Saura's 1976 film, a key reference in Spanish cinema.",
      },
      {
        spanish: "Dime con quién andas y te diré quién eres.",
        english: "Tell me who you walk with and I'll tell you who you are.",
        pronunciation: "DEE-meh kohn kyehn AHN-dahs ee teh dee-REH kyehn EH-rehs",
        note: "Used to judge someone by their company. The medieval imperative cadence (dime…te diré) is the rhythm marker of the genre.",
      },
      {
        spanish: "Al mal tiempo, buena cara.",
        english: "Put a good face on bad times.",
        pronunciation: "ahl mahl TYEHM-poh, BWEH-nah KAH-rah",
        note: "Spanish stoicism in five words. Compact, irreducible, and quoted constantly during the 2008 crisis and again in 2020.",
      },
    ],
    vocabulary: [
      { word: "el refrán", english: "proverb", pronunciation: "ehl reh-FRAHN", part_of_speech: "noun", gender: "m", plural: "refranes" },
      { word: "el dicho", english: "saying / set phrase", pronunciation: "ehl DEE-choh", part_of_speech: "noun", gender: "m" },
      { word: "el entendedor", english: "one who understands", pronunciation: "ehl ehn-tehn-deh-DOR", part_of_speech: "noun", gender: "m" },
      { word: "madrugar", english: "to rise early", pronunciation: "mah-droo-GAR", part_of_speech: "verb" },
      { word: "amanecer", english: "to dawn / break of day", pronunciation: "ah-mah-neh-SEHR", part_of_speech: "verb" },
      { word: "criar", english: "to raise (a child, an animal)", pronunciation: "kree-AR", part_of_speech: "verb" },
      { word: "el cuervo", english: "crow", pronunciation: "ehl KWEHR-boh", part_of_speech: "noun", gender: "m" },
      { word: "andar con", english: "to associate with (lit. walk with)", pronunciation: "ahn-DAR kohn", part_of_speech: "verb" },
      { word: "bastar", english: "to be enough / suffice", pronunciation: "bahs-TAR", part_of_speech: "verb" },
      { word: "la mosca", english: "fly (insect)", pronunciation: "lah MOHS-kah", part_of_speech: "noun", gender: "f" },
      { word: "con segundas", english: "indirect / with double meaning", pronunciation: "kohn seh-GOON-dahs", part_of_speech: "phrase" },
      { word: "la cadencia", english: "cadence / rhythm", pronunciation: "lah kah-DEHN-syah", part_of_speech: "noun", gender: "f" },
    ],
    cultural_note:
      "The refrán is a class marker in Spanish-speaking cultures, but not in the way English speakers expect. Quoting a refrán correctly — especially the abbreviated half — signals you grew up listening to grandparents speak Spanish, not that you read a book of proverbs. Overusing them sounds rural or affected; deploying one well in an editorial or a closing argument is masterful. The asymmetric quote ('a buen entendedor…' with a knowing pause) is the most sophisticated move: it forces the listener to complete the proverb mentally, implicating them in the conclusion.",
    tip:
      "Pick ten refranes and master them deeply: know each one's literal meaning, its figurative use, the situations in which it lands, and whether educated speakers still cite it or whether it has drifted into kitsch. Ten well-deployed refranes beat a hundred memorized ones.",
  },

  // ── 2. Idiomatic mastery — Dichos and set phrases ─────────────────────
  {
    id: "spanish_dichos_register",
    level: "C2",
    category: "idiomatic_mastery",
    title: "Dichos — set phrases by register",
    subtitle: "Echar leña al fuego, hacerse el sueco, montar un pollo",
    intro:
      "Dichos sit between refranes (proverbs) and ordinary idioms. They are fixed multi-word phrases — opaque to learners, automatic to natives. The C2 challenge is not memorizing them but knowing which register each one belongs to: which dicho is fine in a board meeting, which is bar-only, which is dated and which is current.",
    sentences: [
      {
        spanish: "No quiero echar leña al fuego, pero esa decisión fue un error.",
        english: "I don't want to add fuel to the fire, but that decision was a mistake.",
        pronunciation: "noh KYEH-roh eh-CHAR LEH-nyah ahl FWEH-goh, PEH-roh EH-sah deh-see-SYOHN fweh oon eh-RROR",
        note: "ECHAR LEÑA AL FUEGO = add fuel to the fire. Neutral register, fine in any professional context.",
      },
      {
        spanish: "Se hizo el sueco cuando le mencioné la factura.",
        english: "He played dumb when I mentioned the bill.",
        pronunciation: "seh EE-soh ehl SWEH-koh KWAHN-doh leh mehn-syoh-NEH lah fahk-TOO-rah",
        note: "HACERSE EL SUECO = play dumb (literally 'play the Swede'). Informal — fine among friends, slightly off in formal writing.",
      },
      {
        spanish: "Montó un pollo en la reunión cuando le bajaron el bono.",
        english: "He made a huge scene at the meeting when they cut his bonus.",
        pronunciation: "mohn-TOH oon POH-yoh ehn lah reh-oo-NYOHN KWAHN-doh leh bah-HAH-rohn ehl BOH-noh",
        note: "MONTAR UN POLLO = throw a tantrum / make a scene. Peninsular and very informal. Latin Americans more often say 'armar un escándalo'.",
      },
      {
        spanish: "Estoy hasta las narices de las excusas.",
        english: "I'm fed up to the eyeballs with the excuses.",
        pronunciation: "ehs-TOY AHS-tah lahs nah-REE-sehs deh lahs ehks-KOO-sahs",
        note: "ESTAR HASTA LAS NARICES (Spain) / HASTA EL COPETE (Mexico) / HASTA EL MOÑO (LatAm). Same meaning, different geography.",
      },
      {
        spanish: "Esa empresa anda con pies de plomo desde el escándalo.",
        english: "That company is treading very cautiously since the scandal.",
        pronunciation: "EH-sah ehm-PREH-sah AHN-dah kohn pyehs deh PLOH-moh DEHS-deh ehl ehs-KAHN-dah-loh",
        note: "ANDAR CON PIES DE PLOMO = move with lead feet, i.e. proceed with extreme caution. Formal-register-safe. Common in business journalism.",
      },
    ],
    vocabulary: [
      { word: "echar leña al fuego", english: "add fuel to the fire", pronunciation: "eh-CHAR LEH-nyah ahl FWEH-goh", part_of_speech: "phrase" },
      { word: "hacerse el sueco", english: "play dumb / pretend not to hear", pronunciation: "ah-SEHR-seh ehl SWEH-koh", part_of_speech: "phrase" },
      { word: "montar un pollo", english: "make a scene (ES, informal)", pronunciation: "mohn-TAR oon POH-yoh", part_of_speech: "phrase", regional: [{ region: "Spain", form: "montar un pollo" }, { region: "LatAm", form: "armar un escándalo" }] },
      { word: "estar hasta las narices", english: "be fed up (ES)", pronunciation: "ehs-TAR AHS-tah lahs nah-REE-sehs", part_of_speech: "phrase", regional: [{ region: "Spain", form: "hasta las narices" }, { region: "Mexico", form: "hasta el copete" }, { region: "LatAm general", form: "hasta el moño" }] },
      { word: "andar con pies de plomo", english: "tread cautiously", pronunciation: "ahn-DAR kohn pyehs deh PLOH-moh", part_of_speech: "phrase" },
      { word: "irse por las ramas", english: "go off on a tangent", pronunciation: "EER-seh por lahs RAH-mahs", part_of_speech: "phrase" },
      { word: "dar en el clavo", english: "hit the nail on the head", pronunciation: "dar ehn ehl KLAH-boh", part_of_speech: "phrase" },
      { word: "estar en su salsa", english: "be in one's element", pronunciation: "ehs-TAR ehn soo SAHL-sah", part_of_speech: "phrase" },
      { word: "tirar la toalla", english: "throw in the towel", pronunciation: "tee-RAR lah toh-AH-yah", part_of_speech: "phrase" },
      { word: "ponerse las pilas", english: "get one's act together (lit. put one's batteries in)", pronunciation: "poh-NEHR-seh lahs PEE-lahs", part_of_speech: "phrase" },
      { word: "no tener pelos en la lengua", english: "speak frankly (lit. have no hairs on the tongue)", pronunciation: "noh teh-NEHR PEH-lohs ehn lah LEHN-gwah", part_of_speech: "phrase" },
      { word: "matar dos pájaros de un tiro", english: "kill two birds with one stone", pronunciation: "mah-TAR dohs PAH-hah-rohs deh oon TEE-roh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Dichos as fixed units",
        explanation:
          "Dichos resist transformation. You can say ESTOY HASTA LAS NARICES, but not *MIS NARICES ESTÁN HASTAS — the phrase is frozen. Same with HACERSE EL SUECO: the article and adjective are fixed even when the subject changes (se hizo EL sueco, not *se hizo UN sueco). Treat each dicho as a single lexical item; don't try to decompose it grammatically.",
      },
    ],
    cultural_note:
      "Dichos travel poorly across Spanish-speaking countries. MONTAR UN POLLO is Madrid Spanish; a Mexican would understand it from context but never produce it. HACERSE EL SUECO is universal but feels Iberian. ESTAR EN SU SALSA travels everywhere. The C2 move is matching the dicho to the listener's geography — quote a peninsular dicho to a Mexican and you sound like you learned Spanish from a Madrid hostel. The asymmetry matters because dichos tag your assumed audience.",
    tip:
      "Build a TWO-COLUMN dicho list: column A is the phrase, column B is the regions where you'd safely deploy it. Better to know fifty dichos with geographic tags than two hundred without.",
  },

  // ── 3. Idiomatic mastery — Pop-culture references ─────────────────────
  {
    id: "spanish_pop_culture_references",
    level: "C2",
    category: "idiomatic_mastery",
    title: "Pop-culture references educated speakers expect",
    subtitle: "Mafalda, Chavo del 8, Macondo, La Casa de los Espíritus",
    intro:
      "A C2 speaker recognizes cultural references the same way an educated English speaker recognizes 'down the rabbit hole' or 'Catch-22.' These references run from comics (Mafalda, Condorito) to sitcoms (El Chavo del 8) to novels (Cien años de soledad). Missing them isn't grammar failure — it's cultural illiteracy that natives notice instantly.",
    sentences: [
      {
        spanish: "Esa reunión fue muy Mafalda — todos opinando sobre la sopa.",
        english: "That meeting was very Mafalda — everyone opining about the soup.",
        pronunciation: "EH-sah reh-oo-NYOHN fweh mwee mah-FAHL-dah — TOH-dohs oh-pee-NAHN-doh SOH-breh lah SOH-pah",
        note: "Mafalda (Quino's Argentine comic strip, 1964-1973) is the canonical reference for thoughtful political commentary delivered by a child. Hating sopa is her signature trait — used metonymically here to mean 'people complaining about something trivial in front of bigger problems.'",
      },
      {
        spanish: "Le dijo 'fue sin querer queriendo' y todos se rieron.",
        english: "He said 'it was unintentionally intentional' and everyone laughed.",
        pronunciation: "leh DEE-hoh fweh seen keh-REHR keh-RYEHN-doh ee TOH-dohs seh ree-EH-rohn",
        note: "Chavo del 8's signature line. Recognizable across all Spanish-speaking Latin America. Quoting it signals shared 1970s-80s childhood TV.",
      },
      {
        spanish: "Esta familia parece sacada de Macondo.",
        english: "This family seems pulled straight out of Macondo.",
        pronunciation: "EHS-tah fah-MEE-lyah pah-REH-seh sah-KAH-dah deh mah-KOHN-doh",
        note: "Macondo is the fictional town in Cien años de soledad. Saying a family is 'de Macondo' invokes generational repetition, magical events treated as ordinary, and a slowly accumulating fate.",
      },
      {
        spanish: "Vivimos en una realidad muy García Márquez últimamente.",
        english: "We've been living a very García Márquez reality lately.",
        pronunciation: "bee-BEE-mohs ehn OO-nah reh-ah-lee-DAHD mwee gar-SEE-ah MAR-kehs OOL-tee-mah-MEHN-teh",
        note: "Adjectival use of an author's name = the realismo mágico register. The reference is shorthand for events so improbable they feel literary.",
      },
      {
        spanish: "Tiene un tono muy borgiano — un laberinto con un solo personaje.",
        english: "It has a very Borgesian tone — a labyrinth with a single character.",
        pronunciation: "TYEH-neh oon TOH-noh mwee bor-HYAH-noh — oon lah-beh-REEN-toh kohn oon SOH-loh pehr-soh-NAH-heh",
        note: "BORGIANO is the recognized adjective (parallel to 'Kafkaesque'). Educated literary Spanish uses it casually about anything labyrinthine, recursive, or metafictional.",
      },
    ],
    vocabulary: [
      { word: "el referente", english: "reference / referent (cultural)", pronunciation: "ehl reh-feh-REHN-teh", part_of_speech: "noun", gender: "m" },
      { word: "borgiano/a", english: "Borgesian", pronunciation: "bor-HYAH-noh", part_of_speech: "adj" },
      { word: "cervantino/a", english: "Cervantine", pronunciation: "sehr-bahn-TEE-noh", part_of_speech: "adj" },
      { word: "quijotesco/a", english: "quixotic", pronunciation: "kee-hoh-TEHS-koh", part_of_speech: "adj" },
      { word: "el laberinto", english: "labyrinth", pronunciation: "ehl lah-beh-REEN-toh", part_of_speech: "noun", gender: "m" },
      { word: "el realismo mágico", english: "magical realism", pronunciation: "ehl reh-ah-LEES-moh MAH-hee-koh", part_of_speech: "noun", gender: "m" },
      { word: "Macondo", english: "Macondo (G. Márquez's fictional town)", pronunciation: "mah-KOHN-doh", part_of_speech: "noun" },
      { word: "Mafalda", english: "Mafalda (Argentine comic)", pronunciation: "mah-FAHL-dah", part_of_speech: "noun" },
      { word: "El Chavo del 8", english: "El Chavo del 8 (Mexican sitcom)", pronunciation: "ehl CHAH-boh dehl OH-choh", part_of_speech: "noun" },
      { word: "la cita velada", english: "veiled / unattributed quote", pronunciation: "lah SEE-tah beh-LAH-dah", part_of_speech: "phrase" },
      { word: "el guiño", english: "wink / knowing nod (cultural reference)", pronunciation: "ehl GEE-nyoh", part_of_speech: "noun", gender: "m" },
      { word: "metonímico/a", english: "metonymic (used as a stand-in)", pronunciation: "meh-toh-NEE-mee-koh", part_of_speech: "adj" },
    ],
    cultural_note:
      "Spanish-speaking culture is fractured by geography but stitched together by a handful of shared media references. Roberto Gómez Bolaños's El Chavo del 8 (Mexican, 1973) reached every country in Latin America and Spain in dubbed form — quoting it instantly tags you as part of that pan-Latin generation. Quino's Mafalda did the same through print syndication. The novels of García Márquez, Borges, and Allende became required-reading shorthand. When an educated Spanish speaker drops 'macondiano' or 'borgiano' as an adjective, they assume the listener will catch the reference; missing it doesn't break the conversation but quietly demotes the speaker's read of you.",
    tip:
      "Watch one episode of El Chavo del 8, read three Mafalda strips, and read the first chapter of Cien años de soledad. Total: under three hours. After that, ninety percent of casual pop-culture allusions in Spanish-language media will register. The marginal return is enormous.",
  },

  // ── 4. Sociolinguistics — Andaluz ─────────────────────────────────────
  {
    id: "spanish_andaluz_features",
    level: "C2",
    category: "sociolinguistics",
    title: "Recognizing Andaluz",
    subtitle: "Aspiración, seseo, ceceo, and the dropped -s",
    intro:
      "Andalusian Spanish (andaluz) is the most phonetically distinct variety of Peninsular Spanish. It's also the historical bridge to Latin American Spanish — the conquistadores were largely southern Spaniards, and the features Latin Americans share with Andalusians (seseo, aspirated s) trace back to that demographic accident. At C2 you should hear an Andalusian in a single sentence.",
    sentences: [
      {
        spanish: "Loh niño ehtán en la pla'a.",
        english: "(Los niños están en la playa.) The kids are at the beach.",
        pronunciation: "loh NEE-nyoh eh-TAHN ehn lah PLAH-ah",
        pronunciation_focus: ["dropped final -s", "aspirated s → h", "elided intervocalic -y-"],
        note: "Three signature andaluz features in one sentence: final -s dropped (loh niño), intervocalic -s- aspirated (ehtán), and the 'y' in playa elided. A Madrid speaker would say 'los niños están en la playa' with every consonant audible.",
      },
      {
        spanish: "Vamoh a tomá una cervecita en la terracita.",
        english: "Let's go grab a beer on the terrace.",
        pronunciation: "BAH-mohh ah toh-MAH OO-nah sehr-beh-SEE-tah ehn lah teh-rah-SEE-tah",
        note: "Dropped final -r (tomá instead of tomar), aspirated s (vamoh), and the diminutive -ita on everything. Andaluz overuses the affectionate diminutive even more than the rest of Spain.",
      },
      {
        spanish: "Quillo, ¿qué pasa? ¿Cómo va eso?",
        english: "Dude, what's up? How's it going?",
        pronunciation: "KEE-yoh, keh PAH-sah? KOH-moh bah EH-soh?",
        note: "QUILLO (chiquillo → quillo) is the Andalusian vocative for friend / dude. Heard constantly in Seville and Cádiz; sounds out-of-place in Madrid.",
      },
      {
        spanish: "Eh que no me da la gana.",
        english: "It's that I don't feel like it.",
        pronunciation: "eh keh noh meh dah lah GAH-nah",
        note: "ES QUE collapses to EH QUE because of the aspirated s + dropped vowel. A Madrid speaker would clearly say 'es que.'",
      },
      {
        spanish: "Mi arma, no te preocupeh.",
        english: "Sweetheart, don't worry. (lit. 'my soul, don't worry yourself.')",
        pronunciation: "mee AR-mah, noh teh preh-oh-KOO-pehh",
        note: "MI ARMA = mi alma. The Andalusian l→r before a consonant is one of the strongest regional markers. Also: PREOCUPEH = preocupes with aspirated -s.",
      },
    ],
    vocabulary: [
      { word: "el andaluz", english: "Andalusian (variety / person)", pronunciation: "ehl ahn-dah-LOOTH", part_of_speech: "noun", gender: "m" },
      { word: "la aspiración", english: "aspiration (the s → h shift)", pronunciation: "lah ahs-pee-rah-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "el seseo", english: "pronouncing c/z as s (LatAm + western Andalusia)", pronunciation: "ehl seh-SEH-oh", part_of_speech: "noun", gender: "m" },
      { word: "el ceceo", english: "pronouncing s as θ (parts of southern Andalusia)", pronunciation: "ehl theh-THEH-oh", part_of_speech: "noun", gender: "m" },
      { word: "el yeísmo", english: "merging ll and y", pronunciation: "ehl yeh-EES-moh", part_of_speech: "noun", gender: "m" },
      { word: "quillo", english: "dude / buddy (Andalusia)", pronunciation: "KEE-yoh", part_of_speech: "noun", gender: "m", regional: [{ region: "Andalusia", form: "quillo" }] },
      { word: "mi arma", english: "sweetheart (lit. my soul)", pronunciation: "mee AR-mah", part_of_speech: "phrase", regional: [{ region: "Andalusia", form: "mi arma / mi alma" }] },
      { word: "el habla", english: "speech / variety (gendered fem, takes 'el' for phonetic reasons)", pronunciation: "ehl AH-blah", part_of_speech: "noun", gender: "f" },
      { word: "la jota", english: "the jota sound (h-aspirate)", pronunciation: "lah HOH-tah", part_of_speech: "noun", gender: "f" },
      { word: "la entonación", english: "intonation", pronunciation: "lah ehn-toh-nah-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "el deje", english: "accent / inflection (especially regional)", pronunciation: "ehl DEH-heh", part_of_speech: "noun", gender: "m" },
      { word: "el rasgo", english: "feature / trait", pronunciation: "ehl RAHS-goh", part_of_speech: "noun", gender: "m" },
    ],
    grammar: [
      {
        point: "Why andaluz matters historically",
        explanation:
          "The features Latin American Spanish shares with Andalusian — seseo (z = s), yeísmo (ll = y), aspirated s, and ustedes for both formal and informal plural — are not coincidence. Spanish settlers in the Americas came disproportionately from Seville and the south, and 16th-century Sevillian Spanish is the demographic substrate of LatAm Spanish. The Castilian distinction between c/z (θ) and s only became standard in the north after the colonization wave had already left.",
      },
      {
        point: "Seseo vs ceceo",
        explanation:
          "SESEO pronounces both c (before e/i) and z as /s/. Universal in Latin America, normal in western Andalusia. CECEO pronounces s also as /θ/ — found in parts of southern Andalusia (Cádiz, Huelva). To a Spaniard, ceceo sounds rural; to a Latin American it sounds like everyone is lisping. Both are perfectly correct; neither is non-standard.",
      },
    ],
    cultural_note:
      "Andaluz carries class baggage in Spain that LatAm Spanish does not. National TV news reads in standard Castilian; an Andalusian announcer is rare. The variety is widely loved (música, comedia, flamenco) and widely stereotyped (rural, jokey, lower-class). Andalusian speakers code-switch on demand: a Sevillian academic giving a lecture in Madrid moderates the aspirated s; the same person back in Seville with friends drops every consonant Andaluz allows. The C2 ear catches the switch in real time.",
    tip:
      "Listen to ten minutes of Joaquín Reyes or Cádiz carnival chirigotas. Then ten minutes of TVE national news. The phonetic distance between the two is your training signal. After a week of contrast you'll hear Andaluz reflexively.",
  },

  // ── 5. Sociolinguistics — Rioplatense ─────────────────────────────────
  {
    id: "spanish_rioplatense_features",
    level: "C2",
    category: "sociolinguistics",
    title: "Recognizing Rioplatense",
    subtitle: "Voseo, sheísmo, and the Italian intonation",
    intro:
      "Rioplatense is the Spanish of Buenos Aires, Montevideo, and the surrounding Plate basin. It is the most identifiable Latin American variety — Italian intonation, the sh-sound for y/ll, voseo conjugation, lunfardo vocabulary. A C2 listener spots it in three syllables.",
    sentences: [
      {
        spanish: "¿Vos sabés a qué hora llega el subte?",
        english: "Do you know what time the subway gets here?",
        pronunciation: "bohs sah-BEHS ah keh OH-rah SHEH-gah ehl SOOB-teh",
        pronunciation_focus: ["voseo verb form (sabés)", "sheísmo (llega → shega)", "subte = Buenos Aires subway"],
        note: "Three rioplatense markers: VOS (not tú), the stressed -ÉS verb ending (sabés, not sabes), and SHEÍSMO turning 'll' into 'sh'. SUBTE is the Buenos Aires word for metro.",
      },
      {
        spanish: "Che, ¿me pasás el mate?",
        english: "Hey, pass me the mate?",
        pronunciation: "cheh, meh pah-SAHS ehl MAH-teh",
        note: "CHE is the iconic Rioplatense vocative — neutral, friendly, untranslatable. It's the source of Che Guevara's nickname (he was Argentine, abroad). MATE is the regional drink.",
      },
      {
        spanish: "Mirá vos lo que dijo el tipo.",
        english: "Get a load of what the guy said.",
        pronunciation: "mee-RAH bohs loh keh DEE-hoh ehl TEE-poh",
        note: "MIRÁ VOS = check this out / look at that. Stressed -Á imperative + the disjunctive VOS. Pure rioplatense rhythm. TIPO = guy.",
      },
      {
        spanish: "Estoy re-cansado, no fui al laburo hoy.",
        english: "I'm super tired, I didn't go to work today.",
        pronunciation: "ehs-TOY reh-kahn-SAH-doh, noh fwee ahl lah-BOO-roh oy",
        note: "RE- as an intensifier prefix is rioplatense par excellence ('re-bueno', 're-loco'). LABURO = work, from Italian lavoro. Lunfardo lives.",
      },
      {
        spanish: "Boludo, te juro que no entendí nada.",
        english: "Dude, I swear I didn't understand anything.",
        pronunciation: "boh-LOO-doh, teh HOO-roh keh noh ehn-tehn-DEE NAH-dah",
        note: "BOLUDO is the universal Argentine vocative — originally an insult, now drained of meaning between friends. Like 'dude' in California: aggressive between strangers, affectionate between friends.",
      },
    ],
    vocabulary: [
      { word: "el voseo", english: "voseo (using 'vos' instead of 'tú')", pronunciation: "ehl boh-SEH-oh", part_of_speech: "noun", gender: "m" },
      { word: "el sheísmo", english: "pronouncing y/ll as 'sh'", pronunciation: "ehl sheh-EES-moh", part_of_speech: "noun", gender: "m" },
      { word: "el lunfardo", english: "Buenos Aires slang (originally working-class)", pronunciation: "ehl loon-FAR-doh", part_of_speech: "noun", gender: "m" },
      { word: "che", english: "hey / dude (vocative, Rioplatense)", pronunciation: "cheh", part_of_speech: "interj", regional: [{ region: "Argentina/Uruguay", form: "che" }] },
      { word: "boludo/a", english: "dude / idiot (varies wildly by tone)", pronunciation: "boh-LOO-doh", part_of_speech: "noun", regional: [{ region: "Argentina", form: "boludo" }] },
      { word: "el laburo", english: "work (lunfardo)", pronunciation: "ehl lah-BOO-roh", part_of_speech: "noun", gender: "m" },
      { word: "el subte", english: "subway (Buenos Aires)", pronunciation: "ehl SOOB-teh", part_of_speech: "noun", gender: "m" },
      { word: "el quilombo", english: "mess / chaos (lunfardo)", pronunciation: "ehl kee-LOHM-boh", part_of_speech: "noun", gender: "m" },
      { word: "pibe/piba", english: "kid / young person", pronunciation: "PEE-beh", part_of_speech: "noun", regional: [{ region: "Argentina", form: "pibe" }] },
      { word: "el mate", english: "mate (the drink/ritual)", pronunciation: "ehl MAH-teh", part_of_speech: "noun", gender: "m" },
      { word: "la cancha", english: "stadium / playing field", pronunciation: "lah KAHN-chah", part_of_speech: "noun", gender: "f" },
      { word: "morfar", english: "to eat (lunfardo)", pronunciation: "mor-FAR", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Voseo conjugation",
        explanation:
          "VOS replaces TÚ as the informal singular pronoun. The verb endings shift: tú hablas → vos hablás, tú comes → vos comés, tú vives → vos vivís. The stress moves to the final syllable and the diphthong disappears. Imperatives shift too: tú habla → vos hablá, tú ven → vos vení. Object pronouns and possessives don't change (TE quiero, TU casa). Voseo is used in Argentina, Uruguay, Paraguay, much of Central America, and parts of Colombia and Bolivia — about 40 million speakers, despite many textbooks pretending it doesn't exist.",
      },
      {
        point: "Sheísmo / zheísmo",
        explanation:
          "Standard Spanish pronounces LL and Y as a soft /ʝ/. Rioplatense pronounces both as /ʃ/ (sh) or /ʒ/ (zh, like the s in 'measure'). The shift is recent — older Argentines often have /ʒ/, younger urban speakers tend toward /ʃ/. Result: YO SOY → 'sho soy' or 'zho soy', POLLO → 'pósho' or 'pózho', LLAMAR → 'shamar' or 'zhamar'. Once you hear it, you can't unhear it.",
      },
    ],
    cultural_note:
      "Rioplatense intonation is famously musical — heard internationally, it carries the contour of southern Italian dialects, the legacy of late-19th-century immigration that doubled the population of Buenos Aires in twenty years. The result is a variety of Spanish that no other Spanish speaker mistakes for their own. Argentines abroad are instantly placed. The variety also exports culturally: tango lyrics, Borges and Cortázar, Mafalda, Maradona-era football commentary — all of it carries the rioplatense rhythm. Loving or hating the accent is a personality test in the Spanish-speaking world.",
    tip:
      "Listen to a single Buenos Aires radio host for ten minutes (Radio Mitre, Radio Continental). Notice three things: the stressed final syllable in tú-form verbs (sabÉS, hablÁS), the sh-sound for y/ll, and the upward intonation contour. After one week of daily exposure, you'll spot Rioplatense in any media instantly.",
  },

  // ── 6. Sociolinguistics — Mexicano vs Caribeño ────────────────────────
  {
    id: "spanish_mexicano_vs_caribeno",
    level: "C2",
    category: "sociolinguistics",
    title: "Mexicano vs Caribeño — distinguishing the two",
    subtitle: "The clearest articulation in the world vs the fastest",
    intro:
      "Mexican Spanish and Caribbean Spanish (Cuba, Puerto Rico, Dominican Republic, coastal Venezuela and Colombia) are often grouped together as 'Latin American Spanish' by English speakers — but they sit at opposite phonetic extremes. Mexicano is the most clearly articulated variety in the world. Caribeño is the fastest, the most aspirated, the most consonant-dropping. At C2 you should hear the difference in a single phrase.",
    sentences: [
      {
        spanish: "(Mex) ¿Mande? No le entendí bien.",
        english: "Pardon? I didn't quite catch that.",
        pronunciation: "MAHN-deh? noh leh ehn-tehn-DEE byehn",
        note: "MANDE = the polite Mexican way to ask 'what?' (literally 'command me'). Universal in Mexico, virtually unused elsewhere. The very fact of this politeness marker is the cultural signature — Mexico has the most elaborate courtesy register in Spanish.",
      },
      {
        spanish: "(Mex) Está padre la fiesta, ahorita vamos.",
        english: "The party's cool, we'll head over in a bit.",
        pronunciation: "ehs-TAH PAH-dreh lah FYEHS-tah, ah-oh-REE-tah BAH-mohs",
        note: "ESTAR PADRE = to be cool (Mexico). AHORITA = the famously elastic Mexican 'right now' that can mean any time from immediately to several hours from now.",
      },
      {
        spanish: "(Cuba) ¿Qué bola, asere? ¿Qué vola tú?",
        english: "What's up, bro? How you doing?",
        pronunciation: "keh BOH-lah, ah-SEH-reh? keh BOH-lah too?",
        note: "Universal Cuban street greeting. ASERE = friend/bro. The aspirated s in 'asere' is what marks the Caribbean variety phonetically.",
      },
      {
        spanish: "(PR/DR) E'tá cerrao, no podemo' entrá.",
        english: "(Está cerrado, no podemos entrar.) It's closed, we can't go in.",
        pronunciation: "eh-TAH seh-RAH-oh, noh poh-DEH-moh ehn-TRAH",
        pronunciation_focus: ["dropped final -s (e'tá, podemo')", "dropped final -d (cerrao, instead of cerrado)", "dropped final -r (entrá)"],
        note: "Caribbean Spanish drops final consonants aggressively. Three losses in one short sentence. A Mexican speaker would clearly pronounce each consonant.",
      },
      {
        spanish: "(Mex) No sabía que andabas por aquí, ¡qué chido!",
        english: "I didn't know you were around, awesome!",
        pronunciation: "noh sah-BEE-ah keh ahn-DAH-bahs por ah-KEE, keh CHEE-doh",
        note: "QUÉ CHIDO = awesome / cool (Mexico). The fully articulated consonants — every -s, -r, -d crystal clear — are the Mexican signature.",
      },
    ],
    vocabulary: [
      { word: "mande", english: "pardon? (Mexico — polite 'what?')", pronunciation: "MAHN-deh", part_of_speech: "interj", regional: [{ region: "Mexico", form: "mande" }] },
      { word: "ahorita", english: "in a bit (elastic time, Mexico)", pronunciation: "ah-oh-REE-tah", part_of_speech: "adv", regional: [{ region: "Mexico", form: "ahorita" }] },
      { word: "padre", english: "cool / great (Mexico)", pronunciation: "PAH-dreh", part_of_speech: "adj", regional: [{ region: "Mexico", form: "padre" }, { region: "Mexico North", form: "chido" }] },
      { word: "chido/a", english: "cool / awesome (Mexico)", pronunciation: "CHEE-doh", part_of_speech: "adj", regional: [{ region: "Mexico", form: "chido" }] },
      { word: "güey/wey", english: "dude (Mexico)", pronunciation: "gway", part_of_speech: "noun", regional: [{ region: "Mexico", form: "güey / wey" }] },
      { word: "qué bola", english: "what's up (Cuba)", pronunciation: "keh BOH-lah", part_of_speech: "phrase", regional: [{ region: "Cuba", form: "qué bola" }] },
      { word: "asere", english: "bro / friend (Cuba)", pronunciation: "ah-SEH-reh", part_of_speech: "noun", regional: [{ region: "Cuba", form: "asere" }] },
      { word: "el bochinche", english: "gossip / loud commotion (Caribbean)", pronunciation: "ehl boh-CHEEN-cheh", part_of_speech: "noun", gender: "m", regional: [{ region: "Caribbean", form: "bochinche" }] },
      { word: "la guagua", english: "bus (Caribbean) — but 'baby' in the Andes", pronunciation: "lah WAH-wah", part_of_speech: "noun", gender: "f", regional: [{ region: "Caribbean", form: "bus" }, { region: "Andes", form: "baby" }] },
      { word: "la chamba", english: "work / gig (Mexico)", pronunciation: "lah CHAHM-bah", part_of_speech: "noun", gender: "f", regional: [{ region: "Mexico", form: "chamba" }] },
      { word: "fajarse", english: "to get serious / hustle (Caribbean)", pronunciation: "fah-HAR-seh", part_of_speech: "verb", regional: [{ region: "Caribbean", form: "fajarse" }] },
      { word: "la cuadra", english: "block (the unit of urban geography)", pronunciation: "lah KWAH-drah", part_of_speech: "noun", gender: "f" },
    ],
    grammar: [
      {
        point: "Final consonants — articulation gradient",
        explanation:
          "Mexican Spanish over-articulates: every -s, -r, -d is crystalline, even at fast speed. Andean Spanish (Bogotá, Quito) sits in the middle. Caribbean Spanish drops final consonants aggressively, sometimes whole syllables. Listening test: 'los estados unidos.' Mexican: every consonant pronounced. Caribbean: 'loh ehtaoh unioh,' final -s aspirated or dropped, intervocalic -d gone, almost a different word.",
      },
      {
        point: "Politeness register",
        explanation:
          "Mexico has the most elaborate politeness register in Spanish. USTED extends further than anywhere else; honorific forms (joven, señorita, señor, doctor as forms of address) persist where they have faded elsewhere. MANDE replaces ¿qué? for 'pardon?' DISCULPE precedes nearly every request. Caribbean Spanish is far more direct — TÚ everywhere, fewer honorifics, faster intimacy.",
      },
    ],
    cultural_note:
      "The two varieties also tag class and aesthetic differently. Mexican Spanish carries the formal, courteous register that comes from a society with deep colonial-era class stratification still encoded in speech. Caribbean Spanish carries music, oral improvisation, and an aesthetic of speed — the prosody of son cubano, salsa, and reggaeton lives in the rhythm of the speech itself. Neither is more correct; they index opposite cultural temperaments. A C2 listener catches all of this in the first two sentences.",
    tip:
      "Watch the opening scenes of any classic Cantinflas film (Mexico) and any Cuban movie (Fresa y Chocolate works well). Same language, opposite registers, opposite phonetics. The contrast is the lesson — your ear calibrates against both poles simultaneously.",
  },

  // ── 7. Satire & irony — Reading ironic editorials ─────────────────────
  {
    id: "spanish_irony_editorials",
    level: "C2",
    category: "satire_irony",
    title: "Reading ironic editorials",
    subtitle: "Cuando la prensa dice una cosa y quiere decir otra",
    intro:
      "Spanish-language opinion writing — especially in El País, El Mundo, La Nación, Reforma, Clarín — assumes ironic competence. Editorial irony in Spanish runs heavier than in English: the writer says one thing while signaling the opposite, and the literate reader catches the inversion automatically. Missing the irony makes you read the editorial as agreeing with what it is in fact destroying.",
    sentences: [
      {
        spanish: "Qué loable iniciativa la de subir los sueldos de los políticos en plena crisis sanitaria.",
        english: "What a praiseworthy initiative — raising politicians' salaries during a health crisis.",
        pronunciation: "keh loh-AH-bleh ee-nee-syah-TEE-bah lah deh soo-BEER lohs SWEHL-dohs deh lohs poh-LEE-tee-kohs ehn PLEH-nah KREE-sees sah-nee-TAH-ryah",
        note: "Pure editorial irony. LOABLE = praiseworthy, but tone and context invert the meaning. The cue: nobody would write this sincerely. Listen for the contrast between the polite adjective and the absurd action.",
      },
      {
        spanish: "Faltaría más que ahora también tuviéramos que dar las gracias por el escándalo.",
        english: "It would only be fitting that we now also have to say thank you for the scandal.",
        pronunciation: "fahl-tah-REE-ah mahs keh ah-OH-rah tahm-BYEHN too-BYEH-rah-mohs keh dar lahs GRAH-syahs por ehl ehs-KAHN-dah-loh",
        note: "FALTARÍA MÁS QUE… is the canonical ironic-reproach formula. Used to mark: 'on top of everything else.' Literally 'it would be lacking that…' — pragmatically 'as if that weren't already too much.'",
      },
      {
        spanish: "Una vez más, el ministro nos sorprende con su acostumbrada elocuencia.",
        english: "Once again the minister surprises us with his usual eloquence.",
        pronunciation: "OO-nah behs mahs, ehl mee-NEES-troh nohs sor-PREHN-deh kohn soo ah-kohs-toom-BRAH-dah eh-loh-KWEHN-syah",
        note: "The contradiction SORPRENDE / ACOSTUMBRADA (surprises / usual) is the giveaway. Editorial irony loves these self-defeating constructions. Tone: deadpan.",
      },
      {
        spanish: "Tan original como siempre, la propuesta retoma las mismas ideas de hace veinte años.",
        english: "As original as ever, the proposal recycles the same ideas from twenty years ago.",
        pronunciation: "tahn oh-ree-hee-NAHL KOH-moh SYEHM-preh, lah proh-PWEHS-tah reh-TOH-mah lahs MEES-mahs ee-DEH-ahs deh AH-seh BEYN-teh AH-nyohs",
        note: "TAN ORIGINAL COMO SIEMPRE = as original as ever. Then the destructive specifying clause. The structure 'X as always, [evidence X is not X]' is the ironic editorial's signature move.",
      },
      {
        spanish: "Quizás algún día nos expliquen, con la paciencia que les caracteriza, por qué votaron así.",
        english: "Perhaps someday they'll explain, with their characteristic patience, why they voted that way.",
        pronunciation: "kee-SAHS ahl-GOON DEE-ah nohs ehks-PLEE-kehn, kohn lah pah-SYEHN-syah keh lehs kah-rahk-teh-REE-sah, por keh boh-TAH-rohn ah-SEE",
        note: "Triple irony: QUIZÁS ALGÚN DÍA (skeptical of any explanation), LA PACIENCIA QUE LES CARACTERIZA (they are notably impatient and dismissive), and the deferred final clause that delivers the actual complaint. The full move is rhetorical — say the opposite of every key adjective.",
      },
    ],
    vocabulary: [
      { word: "la ironía", english: "irony", pronunciation: "lah ee-roh-NEE-ah", part_of_speech: "noun", gender: "f" },
      { word: "el sarcasmo", english: "sarcasm", pronunciation: "ehl sar-KAHS-moh", part_of_speech: "noun", gender: "m" },
      { word: "la sorna", english: "mocking tone / sneer", pronunciation: "lah SOR-nah", part_of_speech: "noun", gender: "f" },
      { word: "loable", english: "praiseworthy (often ironic)", pronunciation: "loh-AH-bleh", part_of_speech: "adj" },
      { word: "encomiable", english: "commendable (often ironic)", pronunciation: "ehn-koh-MYAH-bleh", part_of_speech: "adj" },
      { word: "acostumbrado/a", english: "usual / habitual", pronunciation: "ah-kohs-toom-BRAH-doh", part_of_speech: "adj" },
      { word: "no es para menos", english: "and rightly so / no wonder", pronunciation: "noh ehs PAH-rah MEH-nohs", part_of_speech: "phrase" },
      { word: "faltaría más", english: "it would only be fitting (often ironic)", pronunciation: "fahl-tah-REE-ah mahs", part_of_speech: "phrase" },
      { word: "como cabía esperar", english: "as one might have expected (dryly)", pronunciation: "KOH-moh kah-BEE-ah ehs-peh-RAR", part_of_speech: "phrase" },
      { word: "el editorial", english: "editorial / opinion piece", pronunciation: "ehl eh-dee-toh-RYAHL", part_of_speech: "noun", gender: "m" },
      { word: "el matiz", english: "nuance", pronunciation: "ehl mah-TEES", part_of_speech: "noun", gender: "m" },
      { word: "destruir el argumento", english: "demolish the argument", pronunciation: "dehs-troo-EER ehl ar-goo-MEHN-toh", part_of_speech: "phrase" },
      { word: "leer entre líneas", english: "read between the lines", pronunciation: "leh-EHR EHN-treh LEE-neh-ahs", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Lexical signals of irony",
        explanation:
          "Spanish ironic editorials use a small set of recurring lexical signals: LOABLE, ENCOMIABLE, EJEMPLAR, MAGNÍFICO before something the writer clearly disapproves of. ACOSTUMBRADA / DE SIEMPRE / DE COSTUMBRE attached to a virtue the subject does not in fact possess. FALTARÍA MÁS QUE introducing the absurd. COMO CABÍA ESPERAR before a disappointment. Once you recognize these flags, you read the ironic register automatically.",
      },
    ],
    cultural_note:
      "Spanish-language journalism has a long tradition of literary irony that English-language journalism mostly lacks. The U.S. opinion page is mostly earnest argument; the Spanish opinion page (especially Spain and Argentina) is often closer to a literary essay — its weapon is irony, not data. Writers like Manuel Vicent, Rosa Montero, Juan Cruz, or Hernán Casciari built reputations on the move that says one thing while doing the opposite. Reading them literally produces baffling output: 'the writer seems to agree with what they obviously oppose.' The C2 reader processes the inversion in real time.",
    tip:
      "Read three Manuel Vicent columns from El País without checking the title. Decide what he thinks. Then read his column header — it tells you his actual position. The gap between your literal reading and his actual position is your ironic-deficit measurement. Close it by doing this exercise weekly.",
  },

  // ── 8. Satire & irony — Political satire ──────────────────────────────
  {
    id: "spanish_political_satire",
    level: "C2",
    category: "satire_irony",
    title: "Political satire — recognizing the genre",
    subtitle: "El Mundo Today, La Tercera Vía, las viñetas de Forges",
    intro:
      "Spanish-language political satire has its own conventions, distinct from English-language equivalents like The Onion or SNL. The dominant form is the dry fake-news headline (El Mundo Today, Actualidad Panamericana) and the political comic strip (Forges, Quino, El Roto). At C2 the goal is to recognize satire instantly, even when the headline is plausible enough to be reposted as fact.",
    sentences: [
      {
        spanish: "El Gobierno propone trabajar menos para acabar antes.",
        english: "The government proposes working less to finish sooner.",
        pronunciation: "ehl goh-BYEHR-noh proh-POH-neh trah-bah-HAR MEH-nohs PAH-rah ah-kah-BAR AHN-tehs",
        note: "Classic El Mundo Today style: a sentence that sounds bureaucratic and absurd in the same breath. The grammar is correct, the proposition is absurd, the deadpan delivery is the joke.",
      },
      {
        spanish: "Un ciudadano descubre que el Estado le debe 0,03 euros y exige justicia.",
        english: "A citizen discovers the State owes him 0.03 euros and demands justice.",
        pronunciation: "oon syoo-dah-DAH-noh dehs-KOO-breh keh ehl ehs-TAH-doh leh DEH-beh THEH-roh KOH-mah THEH-roh trehs eh-OO-rohs ee ehk-SEE-heh hoos-TEE-syah",
        note: "The micro-amount + the grandiose demand = the satirical structure. Spanish-language satire often pairs absurdly precise specificity with absurdly grand emotional response.",
      },
      {
        spanish: "El presidente niega categóricamente lo que aún no ha sido preguntado.",
        english: "The president categorically denies what has not yet been asked.",
        pronunciation: "ehl preh-see-DEHN-teh NYEH-gah kah-teh-GOH-ree-kah-MEHN-teh loh keh ah-OON noh ah SEE-doh preh-goon-TAH-doh",
        note: "Political satire's favorite move: take a real institutional pattern (deny in advance) and state it baldly. Forges's comic strips ran on this for forty years.",
      },
      {
        spanish: "La oposición protesta enérgicamente contra una medida que aún no se ha propuesto.",
        english: "The opposition energetically protests against a measure that hasn't yet been proposed.",
        pronunciation: "lah oh-poh-see-SYOHN proh-TEHS-tah eh-NEHR-hee-kah-MEHN-teh KOHN-trah OO-nah meh-DEE-dah keh ah-OON noh seh ah proh-PWEHS-toh",
        note: "Mirror move to the previous one — same structure applied to the opposition. Spanish political satire is rarely partisan; it tends to mock the institutional shape of politics itself.",
      },
      {
        spanish: "Un grupo de expertos confirma que el café estaba caliente.",
        english: "A panel of experts confirms the coffee was hot.",
        pronunciation: "oon GROO-poh deh ehks-PEHR-tohs kohn-FEER-mah keh ehl kah-FEH ehs-TAH-bah kah-LYEHN-teh",
        note: "The 'panel of experts confirms something obvious' headline is the satirical archetype for any institutional report that elaborately confirms common knowledge. Read every headline that starts UN ESTUDIO REVELA / UN INFORME CONFIRMA with this template in mind.",
      },
    ],
    vocabulary: [
      { word: "la sátira", english: "satire", pronunciation: "lah SAH-tee-rah", part_of_speech: "noun", gender: "f" },
      { word: "satírico/a", english: "satirical", pronunciation: "sah-TEE-ree-koh", part_of_speech: "adj" },
      { word: "la viñeta", english: "comic panel / political cartoon", pronunciation: "lah bee-NYEH-tah", part_of_speech: "noun", gender: "f" },
      { word: "la chanza", english: "joke / jest (often dated/literary)", pronunciation: "lah CHAHN-sah", part_of_speech: "noun", gender: "f" },
      { word: "el chiste", english: "joke", pronunciation: "ehl CHEES-teh", part_of_speech: "noun", gender: "m" },
      { word: "la parodia", english: "parody", pronunciation: "lah pah-ROH-dyah", part_of_speech: "noun", gender: "f" },
      { word: "el ridículo", english: "ridicule / making a fool of oneself", pronunciation: "ehl ree-DEE-koo-loh", part_of_speech: "noun", gender: "m" },
      { word: "categóricamente", english: "categorically", pronunciation: "kah-teh-GOH-ree-kah-MEHN-teh", part_of_speech: "adv" },
      { word: "enérgicamente", english: "energetically", pronunciation: "eh-NEHR-hee-kah-MEHN-teh", part_of_speech: "adv" },
      { word: "la rueda de prensa", english: "press conference", pronunciation: "lah RWEH-dah deh PREHN-sah", part_of_speech: "phrase" },
      { word: "el portavoz", english: "spokesperson", pronunciation: "ehl por-tah-BOHS", part_of_speech: "noun", gender: "mf" },
      { word: "a palo seco", english: "deadpan / dry delivery (lit. dry stick)", pronunciation: "ah PAH-loh SEH-koh", part_of_speech: "phrase" },
      { word: "tomar a la torera", english: "to dismiss / ignore (lit. 'as a bullfighter')", pronunciation: "toh-MAR ah lah toh-REH-rah", part_of_speech: "phrase" },
    ],
    cultural_note:
      "El Mundo Today (Spain) and Actualidad Panamericana (Latin America) are the Spanish-language equivalents of The Onion — but their style is more deadpan and more bureaucratic in voice. They satirize the language of officialdom rather than political personalities. Forges (Antonio Fraguas, 1942-2018) is the canonical Spanish political cartoonist — his pen captured the absurdity of 40 years of Spanish democracy in single-panel form. Quino (Joaquín Lavado, 1932-2020), the Argentine creator of Mafalda, did the same for Latin America and was widely syndicated. C2 readers know both names and can identify their styles without seeing the byline.",
    tip:
      "Read three El Mundo Today headlines a day for a week. Practice the test: can you tell, from the headline alone, whether it's satire or a real news item? When the line blurs (and in Spanish political news it blurs constantly), you've calibrated. That ambiguity is the satirical genre's signature.",
  },

  // ── 9. Satire & irony — Dry humor & understatement ────────────────────
  {
    id: "spanish_dry_humor_understatement",
    level: "C2",
    category: "satire_irony",
    title: "Dry humor and understatement",
    subtitle: "Tampoco es para tanto, ya ves tú, qué quieres que te diga",
    intro:
      "Spanish has a deep tradition of dry humor delivered through understatement — especially in Castile, Catalonia, and the Río de la Plata. The technique is to deflate a dramatic situation with a flat-affect comment that says the opposite of what the speaker means. C2 listeners catch the inversion; learners hear only the literal words.",
    sentences: [
      {
        spanish: "Tampoco es para tanto.",
        english: "It's not that big a deal.",
        pronunciation: "tahm-POH-koh ehs PAH-rah TAHN-toh",
        note: "The classic Spanish deflation. Used when someone is being dramatic about a setback that the speaker considers minor. Often delivered to register quiet disagreement without confrontation.",
      },
      {
        spanish: "Hombre, no estaba mal.",
        english: "Well, it wasn't bad.",
        pronunciation: "OHM-breh, noh ehs-TAH-bah mahl",
        note: "Litotes — saying something is 'not bad' to mean it was excellent. In Spain, NO ESTABA MAL after watching something brilliant is the speaker quietly affirming greatness without sentimentality. HOMBRE here is a softener, not a vocative — used by both sexes.",
      },
      {
        spanish: "Ya ves tú qué problema.",
        english: "What a problem indeed. (i.e., that's not a problem at all.)",
        pronunciation: "yah behs too keh proh-BLEH-mah",
        note: "YA VES TÚ inverts the apparent meaning. Used to dismiss someone's concern as overblown. The deadpan delivery is essential — said with any heat it becomes aggressive.",
      },
      {
        spanish: "Qué quieres que te diga, a mí no me convence.",
        english: "What can I tell you, it doesn't convince me.",
        pronunciation: "keh KYEH-rehs keh teh DEE-gah, ah mee noh meh kohn-BEHN-seh",
        note: "QUÉ QUIERES QUE TE DIGA is the dry-humor opener for sustained skepticism. It puts the burden on the listener — 'I'm not going to argue, but here's what I think.' Far more Spanish than 'I disagree.'",
      },
      {
        spanish: "Bueno, podría haber sido peor.",
        english: "Well, it could have been worse.",
        pronunciation: "BWEH-noh, poh-DREE-ah ah-BEHR SEE-doh peh-OR",
        note: "Spanish stoicism. Used about disasters that genuinely could not have been much worse. The understatement is the joke.",
      },
    ],
    vocabulary: [
      { word: "la litote", english: "litotes / understatement", pronunciation: "lah lee-TOH-teh", part_of_speech: "noun", gender: "f" },
      { word: "tampoco es para tanto", english: "it's not such a big deal", pronunciation: "tahm-POH-koh ehs PAH-rah TAHN-toh", part_of_speech: "phrase" },
      { word: "ya ves tú", english: "see how it is / big deal (dry)", pronunciation: "yah behs too", part_of_speech: "phrase" },
      { word: "qué quieres que te diga", english: "what can I tell you", pronunciation: "keh KYEH-rehs keh teh DEE-gah", part_of_speech: "phrase" },
      { word: "no está mal", english: "not bad (often = very good)", pronunciation: "noh ehs-TAH mahl", part_of_speech: "phrase" },
      { word: "podría ser peor", english: "could be worse", pronunciation: "poh-DREE-ah sehr peh-OR", part_of_speech: "phrase" },
      { word: "menudo X", english: "what a X (often ironic)", pronunciation: "meh-NOO-doh", part_of_speech: "adj" },
      { word: "vaya X", english: "what a X (often ironic / sarcastic)", pronunciation: "BAH-yah", part_of_speech: "interj" },
      { word: "hombre (filler)", english: "well / hey (gender-neutral filler)", pronunciation: "OHM-breh", part_of_speech: "interj" },
      { word: "bueno (filler)", english: "well (hesitation marker)", pronunciation: "BWEH-noh", part_of_speech: "interj" },
      { word: "el sosiego", english: "calm / equanimity", pronunciation: "ehl soh-SYEH-goh", part_of_speech: "noun", gender: "m" },
      { word: "deadpan / a palo seco", english: "deadpan (lit. dry stick)", pronunciation: "ah PAH-loh SEH-koh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Menudo and vaya as ironic intensifiers",
        explanation:
          "Both MENUDO and VAYA function as ironic intensifiers in colloquial Spanish. MENUDO PROBLEMA = quite a problem (sounding light, meaning heavy). VAYA DÍA = what a day. Tone disambiguates: said cheerily, they're literal; said flatly, they're ironic. Both are universal across Spanish-speaking countries.",
      },
      {
        point: "Hombre as a softener (gender-neutral)",
        explanation:
          "HOMBRE as a discourse-marker filler is not a vocative — it's a softener used by both men and women when introducing a slightly contrarian opinion: 'Hombre, yo no diría tanto.' English speakers often misread it as 'man', which it isn't here. The Latin American equivalent is BUENO or PUES.",
      },
    ],
    cultural_note:
      "Dry humor in Spanish carries a class signal opposite to what English speakers expect. In Spain, the working-class register tends toward broad, physical, slapstick comedy (Cantinflas-style in Mexico, Chiquito de la Calzada in Spain). The educated middle-class register leans toward dry understatement and deadpan irony — the Castilian sosiego (composure). Mastering the dry register doesn't make you sound funny in the English sense; it makes you sound composed, slightly tired, and unimpressed by drama. That is the register educated Spanish speakers default to when complaining.",
    tip:
      "Practice the SHRUG response. When someone tells you bad news in Spanish, try: 'Bueno, podría haber sido peor.' Then nothing else. The follow-up silence is the punch line. Two weeks of doing this and your spoken Spanish gains ten years of weariness — which at C2 reads as authority.",
  },

  // ── 10. Advanced debate — Hostile interviews ──────────────────────────
  {
    id: "spanish_hostile_interview",
    level: "C2",
    category: "advanced_debate",
    title: "Surviving a hostile interview",
    subtitle: "Permítame que le matice, no es exactamente así, déjeme terminar",
    intro:
      "Spanish-language political and press culture features genuinely hostile interviews — Jordi Évole, Ana Pastor, Jorge Ramos, Risto Mejide, Pablo Iglesias on his own program. The C2 task is to recognize the genre, name the moves, and deploy the survival phrases that buy you time and authority. The vocabulary is fixed; the timing is the skill.",
    sentences: [
      {
        spanish: "Permítame que le matice ese punto antes de continuar.",
        english: "Allow me to nuance that point before we go on.",
        pronunciation: "pehr-MEE-tah-meh keh leh mah-TEE-seh EH-seh POON-toh AHN-tehs deh kohn-tee-NWAR",
        note: "The classic time-buying move. PERMÍTAME QUE LE MATICE = let me add nuance. Polite, formal, irrefutable. Common in serious Spanish-language political interviews.",
      },
      {
        spanish: "Eso no es exactamente lo que dije; me parece que lo está sacando de contexto.",
        english: "That's not exactly what I said; I think you're taking it out of context.",
        pronunciation: "EH-soh noh ehs ehk-SAHK-tah-MEHN-teh loh keh DEE-heh; meh pah-REH-seh keh loh ehs-TAH sah-KAHN-doh deh kohn-TEKS-toh",
        note: "Defensive but polite. SACAR DE CONTEXTO = take out of context. The hedge ME PARECE QUE softens the accusation while planting it.",
      },
      {
        spanish: "Déjeme terminar la idea, después le contesto.",
        english: "Let me finish the thought, then I'll answer you.",
        pronunciation: "DEH-heh-meh tehr-mee-NAR lah ee-DEH-ah, dehs-PWEHS leh kohn-TEHS-toh",
        note: "Used when interrupted. DÉJEME TERMINAR = let me finish. The promise to answer afterwards (LE CONTESTO) is what makes it work — you commit to the engagement, then claim the floor.",
      },
      {
        spanish: "Con todo respeto, la pregunta parte de una premisa equivocada.",
        english: "With all due respect, the question rests on a mistaken premise.",
        pronunciation: "kohn TOH-doh rehs-PEH-toh, lah preh-GOON-tah PAR-teh deh OO-nah preh-MEE-sah eh-kee-boh-KAH-dah",
        note: "Devastating but polite. Refuses the question without dodging — by attacking the framing, not the asker. The phrase CON TODO RESPETO is essential cover.",
      },
      {
        spanish: "Le agradezco la pregunta, pero creo que se está usted dejando llevar por el titular.",
        english: "I appreciate the question, but I think you're being led by the headline.",
        pronunciation: "leh ah-grah-DEHS-koh lah preh-GOON-tah, PEH-roh KREH-oh keh seh ehs-TAH oos-TEHD deh-HAHN-doh yeh-BAR por ehl tee-too-LAR",
        note: "Politely accuses the interviewer of chasing a tabloid framing. DEJARSE LLEVAR POR = let oneself be led by. Used by experienced public figures to push back without escalating.",
      },
    ],
    vocabulary: [
      { word: "matizar", english: "to nuance / qualify", pronunciation: "mah-tee-SAR", part_of_speech: "verb" },
      { word: "el matiz", english: "nuance / shade", pronunciation: "ehl mah-TEES", part_of_speech: "noun", gender: "m" },
      { word: "sacar de contexto", english: "take out of context", pronunciation: "sah-KAR deh kohn-TEKS-toh", part_of_speech: "phrase" },
      { word: "dejarse llevar por", english: "be led by", pronunciation: "deh-HAR-seh yeh-BAR por", part_of_speech: "phrase" },
      { word: "la premisa", english: "premise", pronunciation: "lah preh-MEE-sah", part_of_speech: "noun", gender: "f" },
      { word: "equivocado/a", english: "mistaken", pronunciation: "eh-kee-boh-KAH-doh", part_of_speech: "adj" },
      { word: "con todo respeto", english: "with all due respect", pronunciation: "kohn TOH-doh rehs-PEH-toh", part_of_speech: "phrase" },
      { word: "déjeme terminar", english: "let me finish", pronunciation: "DEH-heh-meh tehr-mee-NAR", part_of_speech: "phrase" },
      { word: "le contesto enseguida", english: "I'll answer in a moment", pronunciation: "leh kohn-TEHS-toh ehn-seh-GEE-dah", part_of_speech: "phrase" },
      { word: "no me consta", english: "I have no record of that / I'm not aware", pronunciation: "noh meh KOHNS-tah", part_of_speech: "phrase" },
      { word: "rotundamente", english: "categorically / flatly", pronunciation: "roh-toon-dah-MEHN-teh", part_of_speech: "adv" },
      { word: "el titular", english: "headline", pronunciation: "ehl tee-too-LAR", part_of_speech: "noun", gender: "m" },
      { word: "encajar el golpe", english: "absorb the blow", pronunciation: "ehn-kah-HAR ehl GOHL-peh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "USTED in hostile contexts",
        explanation:
          "Even in countries where TÚ is universal in casual speech, hostile interviews are almost always conducted in USTED. The formal register raises stakes, marks distance, and forces both interlocutors into a more careful rhetorical mode. Switching to TÚ mid-interview is itself a rhetorical move — a way to either de-escalate or to condescend. Stay in USTED unless the interviewer drops first.",
      },
      {
        point: "Subjunctive of polite resistance",
        explanation:
          "PERMÍTAME QUE LE MATICE / DÉJEME QUE LE EXPLIQUE / DÍGAME USTED — these polite imperatives trigger subjunctive in their dependent clauses. The subjunctive itself adds politeness: 'permítame que LE MATICE' (subj) sounds more careful than 'permítame matizarle' (infinitive), even though both are correct.",
      },
    ],
    cultural_note:
      "The Spanish-language hostile interview has its own theater. Jordi Évole (Salvados, La Sexta) made his name through patient demolition; Jorge Ramos confronts U.S. presidents in Spanish; Ana Pastor and Jordi Évole both became reference points for the genre. Politicians who cannot survive these interviews are publicly damaged. The vocabulary above is the toolkit any senior public figure has rehearsed. At C2 you should recognize the standard moves on both sides — interviewer drilling, interviewee deflecting — and read the chess match in real time.",
    tip:
      "Watch one full Évole or Ana Pastor interview without subtitles, transcript open. Mark every PERMÍTAME, MATIZAR, CON TODO RESPETO in the transcript. Track who deploys which move when. After three interviews the genre's rhythm becomes visible — you'll know what's coming next.",
  },

  // ── 11. Advanced debate — Rhetorical traps & fallacy-naming ───────────
  {
    id: "spanish_rhetorical_traps",
    level: "C2",
    category: "advanced_debate",
    title: "Naming rhetorical fallacies in real time",
    subtitle: "Eso es una falacia ad hominem, una pendiente resbaladiza, un hombre de paja",
    intro:
      "Educated Spanish-language debate names its fallacies — often in Latin, sometimes Spanish. Being able to identify and name a fallacy live is a C2-level rhetorical move that immediately raises the register. The vocabulary is short and finite; the timing is the difficulty.",
    sentences: [
      {
        spanish: "Eso es una falacia ad hominem — está atacando a la persona, no al argumento.",
        english: "That's an ad hominem fallacy — you're attacking the person, not the argument.",
        pronunciation: "EH-soh ehs OO-nah fah-LAH-syah ahd OH-mee-nehm — ehs-TAH ah-tah-KAHN-doh ah lah pehr-SOH-nah, noh ahl ar-goo-MEHN-toh",
        note: "AD HOMINEM is used in Latin, as in English. Spanish debate culture is more comfortable than English deploying Latin terms directly.",
      },
      {
        spanish: "Está usted creando un hombre de paja para tirarlo abajo más fácilmente.",
        english: "You're building a straw man so you can knock it down more easily.",
        pronunciation: "ehs-TAH oos-TEHD kreh-AHN-doh oon OHM-breh deh PAH-hah PAH-rah tee-RAR-loh ah-BAH-hoh mahs FAH-seel-MEHN-teh",
        note: "HOMBRE DE PAJA = straw man. The calque from English is established. TIRAR ABAJO = knock down.",
      },
      {
        spanish: "Ese es un argumento de pendiente resbaladiza — no se sigue lógicamente.",
        english: "That's a slippery slope argument — it doesn't follow logically.",
        pronunciation: "EH-seh ehs oon ar-goo-MEHN-toh deh pehn-DYEHN-teh rehs-bah-lah-DEE-sah — noh seh SEE-geh LOH-hee-kah-MEHN-teh",
        note: "PENDIENTE RESBALADIZA = slippery slope. The translated form is now standard.",
      },
      {
        spanish: "Lo que usted plantea es una falsa dicotomía.",
        english: "What you're proposing is a false dichotomy.",
        pronunciation: "loh keh oos-TEHD plahn-TEH-ah ehs OO-nah FAHL-sah dee-koh-toh-MEE-ah",
        note: "FALSA DICOTOMÍA = false dichotomy. Polite, surgical. Forces the opponent to acknowledge there are options between the two they've offered.",
      },
      {
        spanish: "Está usted cometiendo una petición de principio — está dando por probado lo que tiene que demostrar.",
        english: "You're committing a petitio principii — assuming what you need to prove.",
        pronunciation: "ehs-TAH oos-TEHD koh-meh-TYEHN-doh OO-nah peh-tee-SYOHN deh preen-SEE-pyoh — ehs-TAH DAHN-doh por proh-BAH-doh loh keh TYEH-neh keh deh-mohs-TRAR",
        note: "PETICIÓN DE PRINCIPIO = begging the question (petitio principii). One of the more sophisticated moves; signals serious philosophical training.",
      },
    ],
    vocabulary: [
      { word: "la falacia", english: "fallacy", pronunciation: "lah fah-LAH-syah", part_of_speech: "noun", gender: "f" },
      { word: "ad hominem", english: "ad hominem", pronunciation: "ahd OH-mee-nehm", part_of_speech: "phrase" },
      { word: "el hombre de paja", english: "straw man", pronunciation: "ehl OHM-breh deh PAH-hah", part_of_speech: "phrase" },
      { word: "la pendiente resbaladiza", english: "slippery slope", pronunciation: "lah pehn-DYEHN-teh rehs-bah-lah-DEE-sah", part_of_speech: "phrase" },
      { word: "la falsa dicotomía", english: "false dichotomy", pronunciation: "lah FAHL-sah dee-koh-toh-MEE-ah", part_of_speech: "phrase" },
      { word: "la petición de principio", english: "begging the question", pronunciation: "lah peh-tee-SYOHN deh preen-SEE-pyoh", part_of_speech: "phrase" },
      { word: "la generalización apresurada", english: "hasty generalization", pronunciation: "lah heh-neh-rah-lee-sah-SYOHN ah-preh-soo-RAH-dah", part_of_speech: "phrase" },
      { word: "el argumento circular", english: "circular argument", pronunciation: "ehl ar-goo-MEHN-toh seer-koo-LAR", part_of_speech: "phrase" },
      { word: "la apelación a la autoridad", english: "appeal to authority", pronunciation: "lah ah-peh-lah-SYOHN ah lah ow-toh-ree-DAHD", part_of_speech: "phrase" },
      { word: "la apelación a las emociones", english: "appeal to emotion", pronunciation: "lah ah-peh-lah-SYOHN ah lahs eh-moh-SYOH-nehs", part_of_speech: "phrase" },
      { word: "non sequitur", english: "non sequitur", pronunciation: "nohn SEH-kee-toor", part_of_speech: "phrase" },
      { word: "el sofisma", english: "sophism", pronunciation: "ehl soh-FEES-mah", part_of_speech: "noun", gender: "m" },
      { word: "refutar", english: "to refute", pronunciation: "reh-foo-TAR", part_of_speech: "verb" },
      { word: "desmontar el argumento", english: "dismantle the argument", pronunciation: "dehs-mohn-TAR ehl ar-goo-MEHN-toh", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "ESO ES + nombre de falacia",
        explanation:
          "The naming move follows a fixed structure: ESO ES UNA + [falacia], or LO QUE USTED ESTÁ HACIENDO ES + [falacia]. The naming is the rhetorical weapon — you don't elaborate yet, you label first. Elaboration comes after. The structure forces the opponent to either accept the label or defend against it, which moves the conversation onto your terrain.",
      },
    ],
    cultural_note:
      "Latin terms are far more comfortable in Spanish-language debate than in English-language equivalents. AD HOMINEM, PETITIO PRINCIPII, REDUCTIO AD ABSURDUM, NON SEQUITUR all sit naturally in Spanish editorial and academic prose. Using them in casual conversation reads as showing off; using them in a formal debate or interview reads as competence. The university tradition in Spain and Latin America preserved classical rhetoric longer than the equivalent Anglo tradition, which is why the moves named here still feel current rather than antiquated.",
    tip:
      "Memorize five fallacy names in Spanish (ad hominem, hombre de paja, falsa dicotomía, pendiente resbaladiza, petición de principio) and the formula ESO ES UNA + [name]. Practice naming them out loud while watching Spanish-language debate clips. The first time you name a fallacy in real time, you'll feel the register shift.",
  },

  // ── 12. Advanced debate — Sustained polite disagreement ───────────────
  {
    id: "spanish_sustained_polite_disagreement",
    level: "C2",
    category: "advanced_debate",
    title: "Sustained polite disagreement",
    subtitle: "Cómo discrepar sin pelear durante una hora",
    intro:
      "Disagreeing once is easy. Sustaining disagreement across a long conversation — without escalating, without conceding, without sounding defensive — is the C2-level rhetorical skill. The technique is to recycle a small toolkit of softeners, concessions, and partial agreements, each used at the right moment.",
    sentences: [
      {
        spanish: "Le doy la razón en parte, pero permítame matizar.",
        english: "I agree in part, but let me add nuance.",
        pronunciation: "leh doy lah rah-SOHN ehn PAR-teh, PEH-roh pehr-MEE-tah-meh mah-tee-SAR",
        note: "Half-concession opener. DAR LA RAZÓN EN PARTE = grant the point in part. The pattern is concede first, push back second — politest version of disagreement.",
      },
      {
        spanish: "Entiendo su punto, pero creo que está obviando algo esencial.",
        english: "I understand your point, but I think you're glossing over something essential.",
        pronunciation: "ehn-TYEHN-doh soo POON-toh, PEH-roh KREH-oh keh ehs-TAH oh-BYAHN-doh AHL-goh eh-sehn-SYAHL",
        note: "OBVIAR = to overlook / dodge. Polite accusation of selective argument. Pairs the show of understanding with the substantive pushback.",
      },
      {
        spanish: "No es que esté en desacuerdo, es que veo el problema desde otra perspectiva.",
        english: "It's not that I disagree, it's that I see the problem from a different angle.",
        pronunciation: "noh ehs keh ehs-TEH ehn dehs-ah-KWEHR-doh, ehs keh BEH-oh ehl proh-BLEH-mah DEHS-deh OH-trah pehrs-pehk-TEE-bah",
        note: "Maximum diplomatic softener. Denies disagreement while disagreeing. NO ES QUE + subjunctive is the canonical Spanish negation-with-cover.",
      },
      {
        spanish: "Permítame una observación: los datos no son concluyentes.",
        english: "Allow me one observation: the data are not conclusive.",
        pronunciation: "pehr-MEE-tah-meh OO-nah ohb-sehr-bah-SYOHN: lohs DAH-tohs noh sohn kohn-kloo-YEHN-tehs",
        note: "PERMÍTAME UNA OBSERVACIÓN = the formal flag for substantive pushback. Sounds bureaucratic in English; sounds elegant in Spanish.",
      },
      {
        spanish: "Quizá estemos hablando de cosas distintas. Yo me refería a otra cuestión.",
        english: "Perhaps we're talking about different things. I was referring to a different issue.",
        pronunciation: "kee-SAH ehs-TEH-mohs ah-BLAHN-doh deh KOH-sahs dees-TEEN-tahs. yoh meh reh-feh-REE-ah ah OH-trah kwehs-TYOHN",
        note: "The 'we're at cross-purposes' move. Reframes a clash as a definitional mismatch. Lowers temperature without conceding. Tactical retreat at its best.",
      },
    ],
    vocabulary: [
      { word: "discrepar", english: "to disagree (formal)", pronunciation: "dees-kreh-PAR", part_of_speech: "verb" },
      { word: "dar la razón en parte", english: "to grant the point in part", pronunciation: "dar lah rah-SOHN ehn PAR-teh", part_of_speech: "phrase" },
      { word: "obviar", english: "to overlook / gloss over", pronunciation: "ohb-BYAR", part_of_speech: "verb" },
      { word: "soslayar", english: "to sidestep (formal)", pronunciation: "sohs-lah-YAR", part_of_speech: "verb" },
      { word: "la observación", english: "observation / remark", pronunciation: "lah ohb-sehr-bah-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "el desacuerdo", english: "disagreement", pronunciation: "ehl dehs-ah-KWEHR-doh", part_of_speech: "noun", gender: "m" },
      { word: "la perspectiva", english: "perspective", pronunciation: "lah pehrs-pehk-TEE-bah", part_of_speech: "noun", gender: "f" },
      { word: "concluyente", english: "conclusive", pronunciation: "kohn-kloo-YEHN-teh", part_of_speech: "adj" },
      { word: "la salvedad", english: "exception / proviso", pronunciation: "lah sahl-beh-DAHD", part_of_speech: "noun", gender: "f" },
      { word: "salvo error u omisión", english: "barring error or omission (formal)", pronunciation: "SAHL-boh eh-RROR oo oh-mee-SYOHN", part_of_speech: "phrase" },
      { word: "no es menos cierto que", english: "it's no less true that", pronunciation: "noh ehs MEH-nohs SYEHR-toh keh", part_of_speech: "phrase" },
      { word: "sin embargo", english: "however", pronunciation: "seen ehm-BAR-goh", part_of_speech: "phrase" },
      { word: "no obstante", english: "nonetheless", pronunciation: "noh ohbs-TAHN-teh", part_of_speech: "phrase" },
      { word: "matizar", english: "to nuance / qualify", pronunciation: "mah-tee-SAR", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "NO ES QUE + subjunctive",
        explanation:
          "NO ES QUE + subjunctive is the canonical Spanish denial-of-disagreement structure: NO ES QUE ESTÉ EN DESACUERDO (it's not that I disagree). The subjunctive is required after NO ES QUE because the matrix is negative. The structure is universal across registers — used in casual conversation and in formal essays. The contrasting positive clause (ES QUE…) takes indicative.",
      },
      {
        point: "Conditional softeners",
        explanation:
          "QUIZÁ + subjunctive, TAL VEZ + subjunctive, A LO MEJOR + indicative — all introduce hesitation as politeness. QUIZÁ ESTEMOS HABLANDO DE COSAS DISTINTAS (perhaps we're talking about different things) is the diplomatic Spanish offering. A LO MEJOR with the indicative is more colloquial; QUIZÁS + subjunctive is more formal. The choice signals register.",
      },
    ],
    cultural_note:
      "Spanish-language professional culture rewards sustained polite disagreement more visibly than English-language equivalents do. A Spanish board meeting can run for two hours with everyone present disagreeing constructively without raising voices, because the language has a precise vocabulary for this exact mode — SOSLAYAR, OBVIAR, MATIZAR, SALVEDAD, NO ES MENOS CIERTO QUE. Anglo workplaces often resolve disagreement by collapsing into either silence or open conflict. The Spanish toolkit lives between those two, and the C2 speaker uses it fluently.",
    tip:
      "Build a TEN-PHRASE deck of polite-disagreement moves. Drill them out loud until they come without thinking. The skill isn't knowing what to say — it's having the phrases ready when temperature rises. The natives who sound most authoritative aren't the smartest; they're the ones whose rhetorical toolkit is fastest at hand.",
  },

  // ── 13. Literary analysis — García Márquez ────────────────────────────
  {
    id: "spanish_garcia_marquez",
    level: "C2",
    category: "literary_analysis",
    title: "Reading García Márquez critically",
    subtitle: "Realismo mágico, voz narrativa, el tiempo circular",
    intro:
      "García Márquez and the Latin American Boom did more for the international prestige of the Spanish language than any other 20th-century cultural event. A C2 reader can discuss Cien años de soledad, El amor en los tiempos del cólera, and Crónica de una muerte anunciada in analytical Spanish — naming techniques (realismo mágico, voz narrativa, prolepsis), recognizing recurring themes (the circular time, the foundational family, the political violence), and using the critical vocabulary that any literate Spanish-language reader expects.",
    sentences: [
      {
        spanish: "El realismo mágico no es lo sobrenatural — es lo sobrenatural narrado como si fuera natural.",
        english: "Magical realism isn't the supernatural — it's the supernatural narrated as if it were ordinary.",
        pronunciation: "ehl reh-ah-LEES-moh MAH-hee-koh noh ehs loh soh-breh-nah-too-RAHL — ehs loh soh-breh-nah-too-RAHL nah-RAH-doh KOH-moh see FWEH-rah nah-too-RAHL",
        note: "The clearest one-sentence definition. The technique lives in the narrator's tone — flat, unsurprised, as if levitating women and 200-year-old patriarchs were unremarkable village events.",
      },
      {
        spanish: "La voz narrativa de Cien años de soledad funciona como la de una crónica oral.",
        english: "The narrative voice of One Hundred Years of Solitude works like that of an oral chronicle.",
        pronunciation: "lah bohs nah-rah-TEE-bah deh syehn AH-nyohs deh soh-leh-DAHD foon-SYOH-nah KOH-moh lah deh OO-nah KROH-nee-kah oh-RAHL",
        note: "VOZ NARRATIVA = narrative voice. CRÓNICA ORAL = oral chronicle. García Márquez explicitly modeled the voice on his grandmother's storytelling. The C2 reader names this structural choice rather than describing it.",
      },
      {
        spanish: "El uso de la prolepsis al inicio — 'Muchos años después' — establece el tono circular de toda la novela.",
        english: "The use of prolepsis at the opening — 'Many years later' — establishes the circular tone of the whole novel.",
        pronunciation: "ehl OO-soh deh lah proh-LEHP-sees ahl ee-NEE-syoh — MOO-chohs AH-nyohs dehs-PWEHS — ehs-tah-BLEH-seh ehl TOH-noh seer-koo-LAR deh TOH-dah lah noh-BEH-lah",
        note: "PROLEPSIS = flash-forward (literary term, identical Spanish/English). Naming it elevates the discussion. The opening sentence of Cien años is one of the most analyzed in Spanish-language literature.",
      },
      {
        spanish: "Los Buendía repiten los nombres y los destinos generación tras generación.",
        english: "The Buendías repeat names and fates generation after generation.",
        pronunciation: "lohs bwehn-DEE-ah reh-PEE-tehn lohs NOHM-brehs ee lohs dehs-TEE-nohs heh-neh-rah-SYOHN trahs heh-neh-rah-SYOHN",
        note: "The repetition of names (José Arcadio, Aureliano) is the structural correlate of the circular time. Naming the technique — repetición onomástica — is C2-level commentary.",
      },
      {
        spanish: "La soledad funciona como tema axial en toda su obra, no solo en la novela que lleva el título.",
        english: "Solitude functions as a central theme throughout his work, not just the novel whose title bears the word.",
        pronunciation: "lah soh-leh-DAHD foon-SYOH-nah KOH-moh TEH-mah ahk-SYAHL ehn TOH-dah soo OH-brah, noh SOH-loh ehn lah noh-BEH-lah keh YEH-bah ehl TEE-too-loh",
        note: "TEMA AXIAL = central / load-bearing theme. The thematic-criticism vocabulary in Spanish is rich; this is the entry point.",
      },
    ],
    vocabulary: [
      { word: "el realismo mágico", english: "magical realism", pronunciation: "ehl reh-ah-LEES-moh MAH-hee-koh", part_of_speech: "noun", gender: "m" },
      { word: "la voz narrativa", english: "narrative voice", pronunciation: "lah bohs nah-rah-TEE-bah", part_of_speech: "noun", gender: "f" },
      { word: "el narrador omnisciente", english: "omniscient narrator", pronunciation: "ehl nah-rah-DOR ohm-nee-SYEHN-teh", part_of_speech: "noun", gender: "m" },
      { word: "la prolepsis", english: "prolepsis / flash-forward", pronunciation: "lah proh-LEHP-sees", part_of_speech: "noun", gender: "f" },
      { word: "la analepsis", english: "analepsis / flashback", pronunciation: "lah ah-nah-LEHP-sees", part_of_speech: "noun", gender: "f" },
      { word: "el tiempo circular", english: "circular time", pronunciation: "ehl TYEHM-poh seer-koo-LAR", part_of_speech: "phrase" },
      { word: "el tema axial", english: "central theme", pronunciation: "ehl TEH-mah ahk-SYAHL", part_of_speech: "phrase" },
      { word: "Macondo", english: "Macondo (the fictional town)", pronunciation: "mah-KOHN-doh", part_of_speech: "noun" },
      { word: "la estirpe", english: "lineage / bloodline", pronunciation: "lah ehs-TEER-peh", part_of_speech: "noun", gender: "f" },
      { word: "la dinastía", english: "dynasty", pronunciation: "lah dee-nahs-TEE-ah", part_of_speech: "noun", gender: "f" },
      { word: "el Boom latinoamericano", english: "the Latin American Boom (60s-70s)", pronunciation: "ehl boom lah-tee-noh-ah-meh-ree-KAH-noh", part_of_speech: "noun", gender: "m" },
      { word: "la novela total", english: "total novel (Vargas Llosa term)", pronunciation: "lah noh-BEH-lah toh-TAHL", part_of_speech: "phrase" },
      { word: "la cosmovisión", english: "worldview", pronunciation: "lah kohs-moh-bee-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "macondiano/a", english: "Macondian (adj. derived from Macondo)", pronunciation: "mah-kohn-DYAH-noh", part_of_speech: "adj" },
    ],
    grammar: [
      {
        point: "Critical vocabulary as register marker",
        explanation:
          "C2-level literary discussion uses a precise set of technical terms: PROLEPSIS, ANALEPSIS, FOCALIZACIÓN, NARRADOR EXTRADIEGÉTICO, TEMA AXIAL, COSMOVISIÓN. Using them correctly signals literary training; misusing them or avoiding them signals enthusiast-level rather than scholarly. The terms parallel English literary criticism almost one-to-one — the bridge is straightforward once you know which Spanish term maps to which English one.",
      },
    ],
    cultural_note:
      "Cien años de soledad (1967) is the most-read Spanish-language novel of the 20th century. The Latin American Boom — García Márquez, Vargas Llosa, Cortázar, Carlos Fuentes, José Donoso — emerged as a coordinated literary movement in the 1960s. García Márquez won the Nobel in 1982; his Nobel speech, 'La soledad de América Latina,' is itself a foundational essay on the continent's relationship to European narrative expectations. Discussing him at C2 requires recognizing not just the novels but the cultural movement: which writers belonged to the Boom, what came after (the post-Boom: Allende, Skármeta), and how realismo mágico became a stereotype that Latin American writers since 2000 have actively pushed back against.",
    tip:
      "Read the opening paragraph of Cien años de soledad in Spanish. Identify three techniques: the prolepsis, the unnamed narrator's tone, and the introduction of magical detail as ordinary fact. The exercise takes ten minutes and prepares you to discuss the novel with any literate Spanish-speaker.",
  },

  // ── 14. Literary analysis — Borges ────────────────────────────────────
  {
    id: "spanish_borges_critically",
    level: "C2",
    category: "literary_analysis",
    title: "Reading Borges critically",
    subtitle: "El laberinto, la metaficción, la biblioteca infinita",
    intro:
      "Jorge Luis Borges (1899-1986) reshaped how short fiction is written, in any language. His specific techniques — the metafictional frame, the infinite library, the imagined book, the labyrinth as concept rather than place — became part of global literary vocabulary. At C2, discussing Borges in Spanish requires both the critical terms and the recognition that 'borgiano' is now a global adjective.",
    sentences: [
      {
        spanish: "Borges trabaja con bibliotecas, espejos y laberintos como otros trabajan con personajes.",
        english: "Borges works with libraries, mirrors and labyrinths the way other writers work with characters.",
        pronunciation: "BOR-hehs trah-BAH-hah kohn bee-blee-oh-TEH-kahs, ehs-PEH-hohs ee lah-beh-REEN-tohs KOH-moh OH-trohs trah-BAH-hahn kohn pehr-soh-NAH-hehs",
        note: "Names the structural eccentricity. Borges's stories often lack rounded characters; their protagonists are concepts or objects. Critical commentary frequently begins here.",
      },
      {
        spanish: "La metaficción borgiana cuestiona los límites entre el texto y el lector.",
        english: "Borgesian metafiction questions the boundaries between text and reader.",
        pronunciation: "lah meh-tah-feek-SYOHN bor-HYAH-nah kwehs-TYOH-nah lohs LEE-mee-tehs EHN-treh ehl TEHK-stoh ee ehl lehk-TOR",
        note: "METAFICCIÓN = metafiction. The story that knows it is a story; the narrator who reveals the writing. Borges did this before the term existed in English literary criticism.",
      },
      {
        spanish: "En 'La biblioteca de Babel' el infinito no es una metáfora — es la arquitectura del cuento.",
        english: "In 'The Library of Babel' the infinite isn't a metaphor — it's the architecture of the story.",
        pronunciation: "ehn lah bee-blee-oh-TEH-kah deh BAH-behl ehl een-fee-NEE-toh noh ehs OO-nah meh-TAH-foh-rah — ehs lah ar-kee-tehk-TOO-rah dehl KWEHN-toh",
        note: "Foundational reading. The infinite library is not a stand-in for something — it IS the setting and the structural logic. Borges treats abstract concepts as physical spaces.",
      },
      {
        spanish: "Su prosa es brevísima y a la vez densa: cada cuento condensa lo que otros estiran en una novela.",
        english: "His prose is extremely brief yet dense: each story condenses what others stretch into a novel.",
        pronunciation: "soo PROH-sah ehs breh-BEE-see-mah ee ah lah behs DEHN-sah: KAH-dah KWEHN-toh kohn-DEHN-sah loh keh OH-trohs ehs-TEE-rahn ehn OO-nah noh-BEH-lah",
        note: "Critical commonplace: Borges's compression. BREVÍSIMA = superlative of breve. CONDENSAR vs ESTIRAR = compress vs stretch. The contrast structure is a frequent Spanish critical move.",
      },
      {
        spanish: "Borges inventa libros que no existen y los cita como si existieran.",
        english: "Borges invents books that don't exist and quotes them as if they did.",
        pronunciation: "BOR-hehs een-BEHN-tah LEE-brohs keh noh ehk-SEES-tehn ee lohs SEE-tah KOH-moh see ehk-sees-TYEH-rahn",
        note: "The signature trick. 'Pierre Menard, autor del Quijote' and 'Tlön, Uqbar, Orbis Tertius' both pretend to review books that never existed. Influence flows from this directly to Calvino, Eco, Bolaño, the entire postmodern lineage.",
      },
    ],
    vocabulary: [
      { word: "borgiano/a", english: "Borgesian", pronunciation: "bor-HYAH-noh", part_of_speech: "adj" },
      { word: "la metaficción", english: "metafiction", pronunciation: "lah meh-tah-feek-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "el laberinto", english: "labyrinth", pronunciation: "ehl lah-beh-REEN-toh", part_of_speech: "noun", gender: "m" },
      { word: "la biblioteca", english: "library", pronunciation: "lah bee-blee-oh-TEH-kah", part_of_speech: "noun", gender: "f" },
      { word: "el espejo", english: "mirror", pronunciation: "ehl ehs-PEH-hoh", part_of_speech: "noun", gender: "m" },
      { word: "el infinito", english: "the infinite", pronunciation: "ehl een-fee-NEE-toh", part_of_speech: "noun", gender: "m" },
      { word: "la erudición", english: "erudition / scholarly density", pronunciation: "lah eh-roo-dee-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "el aforismo", english: "aphorism", pronunciation: "ehl ah-foh-REES-moh", part_of_speech: "noun", gender: "m" },
      { word: "la ficción", english: "fiction (Borges's category for his stories)", pronunciation: "lah feek-SYOHN", part_of_speech: "noun", gender: "f" },
      { word: "el ensayo", english: "essay", pronunciation: "ehl ehn-SAH-yoh", part_of_speech: "noun", gender: "m" },
      { word: "la cita apócrifa", english: "apocryphal quotation (fake quote)", pronunciation: "lah SEE-tah ah-POH-kree-fah", part_of_speech: "phrase" },
      { word: "el palimpsesto", english: "palimpsest", pronunciation: "ehl pah-leemp-SEHS-toh", part_of_speech: "noun", gender: "m" },
      { word: "la intertextualidad", english: "intertextuality", pronunciation: "lah een-tehr-tehks-twah-lee-DAHD", part_of_speech: "noun", gender: "f" },
      { word: "condensar", english: "to condense", pronunciation: "kohn-dehn-SAR", part_of_speech: "verb" },
    ],
    grammar: [
      {
        point: "Adjectival use of author names",
        explanation:
          "Spanish builds adjectives off author names productively: BORGIANO (Borgesian), CERVANTINO (Cervantine), QUIJOTESCO (quixotic), KAFKIANO (Kafkaesque), GARCIAMARQUIANO (less common but attested). The pattern requires either -IANO or -ESCO. The adjective stands alone — 'un cuento muy borgiano' is fully grammatical and immediately understood. English uses 'Kafkaesque' the same way but builds fewer such forms.",
      },
    ],
    cultural_note:
      "Borges is the most globally influential Argentine writer — claimed by literary modernism, by postmodernism, by the entire 1980s-2000s wave of self-conscious metafiction. He was passed over for the Nobel for decades (officially because of his perceived support for Pinochet and the Argentine military government, though the politics are more complicated). His Argentine identity matters: he wrote in a Rioplatense register, he was deeply European in reference, and he was profoundly suspicious of nationalism. Discussing Borges in C2 Spanish requires holding all of this at once — the techniques, the global influence, the political complications, and the Argentine specificity of his voice.",
    tip:
      "Read one Borges story — 'La biblioteca de Babel', 'El jardín de senderos que se bifurcan', or 'Funes el memorioso'. Fifteen minutes. Then write three sentences in Spanish naming three techniques you observed. The exercise builds the analytical-vocabulary muscle directly.",
  },

  // ── 15. Literary analysis — Cervantes & Siglo de Oro ──────────────────
  {
    id: "spanish_cervantes_siglo_de_oro",
    level: "C2",
    category: "literary_analysis",
    title: "Cervantes and the Siglo de Oro",
    subtitle: "Conceptismo, gongorismo, el Quijote como invención de la novela",
    intro:
      "The Spanish Golden Age (Siglo de Oro, roughly 1492-1681) produced not only Don Quijote but the rhetorical traditions — conceptismo, culteranismo — that still echo in modern Spanish prose. Cervantes's novel is often called the first modern novel. C2 readers can discuss the period, name its rhetorical schools, and recognize Golden Age allusions when modern writers deploy them.",
    sentences: [
      {
        spanish: "El Quijote inaugura la novela moderna porque sus personajes evolucionan al ser leídos.",
        english: "Don Quijote inaugurates the modern novel because its characters evolve as they are read.",
        pronunciation: "ehl kee-HOH-teh ee-now-GOO-rah lah noh-BEH-lah moh-DEHR-nah POR-keh soos pehr-soh-NAH-hehs eh-boh-loo-SYOH-nahn ahl sehr leh-EE-dohs",
        note: "Central critical claim. In Part II, the characters know they have been read in Part I. The metafictional move that Borges would later inherit was first executed here.",
      },
      {
        spanish: "Cervantes maneja la voz narrativa con una distancia irónica que no se había visto antes.",
        english: "Cervantes handles narrative voice with an ironic distance unseen before him.",
        pronunciation: "sehr-BAHN-tehs mah-NEH-hah lah bohs nah-rah-TEE-bah kohn OO-nah dees-TAHN-syah ee-ROH-nee-kah keh noh seh ah-BEE-ah BEES-toh AHN-tehs",
        note: "Names the technique: ironic narrative distance. The narrator alternately mocks and defends Don Quijote — the modern unreliable narrator begins here.",
      },
      {
        spanish: "El conceptismo de Quevedo se apoya en el juego conceptual y la condensación verbal.",
        english: "Quevedo's conceptismo rests on conceptual play and verbal condensation.",
        pronunciation: "ehl kohn-sehp-TEES-moh deh keh-BEH-doh seh ah-POH-yah ehn ehl HWEH-goh kohn-sehp-TWAHL ee lah kohn-dehn-sah-SYOHN behr-BAHL",
        note: "CONCEPTISMO = conceptual wit, Quevedo's signature. Compressed, sharp, paradoxical. Opposite school from gongorismo.",
      },
      {
        spanish: "El gongorismo de Góngora explota la sintaxis latina y el léxico recóndito.",
        english: "Góngora's gongorismo exploits Latinate syntax and obscure vocabulary.",
        pronunciation: "ehl gohn-goh-REES-moh deh GOHN-goh-rah ehks-PLOH-tah lah seen-TAHK-sees lah-TEE-nah ee ehl LEHK-see-koh reh-KOHN-dee-toh",
        note: "GONGORISMO / CULTERANISMO = the other dominant Golden Age school. Latinate sentence structure, hyperbaton, mythological allusion, deliberately difficult vocabulary. Quevedo and Góngora mocked each other in verse.",
      },
      {
        spanish: "La picaresca presenta el mundo desde abajo, desde la mirada del marginado.",
        english: "The picaresque presents the world from below, through the gaze of the outsider.",
        pronunciation: "lah pee-kah-REHS-kah preh-SEHN-tah ehl MOON-doh DEHS-deh ah-BAH-hoh, DEHS-deh lah mee-RAH-dah dehl mar-hee-NAH-doh",
        note: "PICARESCA = picaresque novel. Lazarillo de Tormes (1554) inaugurates the genre. Critical perspective: world seen from social margins. Still echoes in modern Spanish-language fiction.",
      },
    ],
    vocabulary: [
      { word: "el Siglo de Oro", english: "Spanish Golden Age", pronunciation: "ehl SEE-gloh deh OH-roh", part_of_speech: "phrase" },
      { word: "Don Quijote", english: "Don Quijote", pronunciation: "dohn kee-HOH-teh", part_of_speech: "noun" },
      { word: "cervantino/a", english: "Cervantine", pronunciation: "sehr-bahn-TEE-noh", part_of_speech: "adj" },
      { word: "quijotesco/a", english: "quixotic", pronunciation: "kee-hoh-TEHS-koh", part_of_speech: "adj" },
      { word: "el conceptismo", english: "conceptismo (Quevedo's school)", pronunciation: "ehl kohn-sehp-TEES-moh", part_of_speech: "noun", gender: "m" },
      { word: "el gongorismo", english: "gongorismo / culteranismo (Góngora's school)", pronunciation: "ehl gohn-goh-REES-moh", part_of_speech: "noun", gender: "m" },
      { word: "el hipérbaton", english: "hyperbaton (Latinate word order)", pronunciation: "ehl ee-PEHR-bah-tohn", part_of_speech: "noun", gender: "m" },
      { word: "la picaresca", english: "the picaresque (genre)", pronunciation: "lah pee-kah-REHS-kah", part_of_speech: "noun", gender: "f" },
      { word: "el pícaro", english: "rogue / picaro (the genre's protagonist)", pronunciation: "ehl PEE-kah-roh", part_of_speech: "noun", gender: "m" },
      { word: "la comedia del Siglo de Oro", english: "Golden Age drama", pronunciation: "lah koh-MEH-dyah dehl SEE-gloh deh OH-roh", part_of_speech: "phrase" },
      { word: "el verso octosílabo", english: "octosyllabic verse", pronunciation: "ehl BEHR-soh ohk-toh-SEE-lah-boh", part_of_speech: "phrase" },
      { word: "la décima", english: "décima (ten-line stanza)", pronunciation: "lah DEH-see-mah", part_of_speech: "noun", gender: "f" },
      { word: "el soneto", english: "sonnet", pronunciation: "ehl soh-NEH-toh", part_of_speech: "noun", gender: "m" },
      { word: "la metáfora barroca", english: "Baroque metaphor", pronunciation: "lah meh-TAH-foh-rah bah-ROH-kah", part_of_speech: "phrase" },
    ],
    grammar: [
      {
        point: "Reading Siglo de Oro Spanish",
        explanation:
          "Golden Age Spanish differs from modern Spanish in pronoun position (clitic pronouns often attach to conjugated verbs: 'preguntóle'), in the future subjunctive (still alive: 'el que tuviere'), and in vocabulary that has since shifted. Reading a page of Cervantes requires accepting a different register, not a different language. The modern reader closes the gap easily after the first chapter.",
      },
      {
        point: "Adjectives derived from Golden Age authors",
        explanation:
          "CERVANTINO (of or related to Cervantes), QUIJOTESCO (quixotic — idealistically impractical), GONGORINO (of Góngora's school, ornate), QUEVEDESCO (of Quevedo, sharp and ironic), CALDERONIANO (of Calderón's drama, philosophical). These adjectives are all productive in modern Spanish criticism and educated speech.",
      },
    ],
    cultural_note:
      "The Siglo de Oro is to Spanish what Shakespeare's era is to English — the period that shaped the language's modern register. Cervantes, Lope de Vega, Calderón de la Barca, Quevedo, Góngora, Sor Juana Inés de la Cruz (slightly later, in colonial Mexico but writing in the Golden Age tradition): the canon's weight in modern Spanish curricula is enormous. A C2 speaker recognizes these names automatically and can place them in their period. The rivalry between conceptismo (Quevedo: compressed, witty, sharp) and culteranismo / gongorismo (Góngora: ornate, Latinate, difficult) defined Spanish poetic taste for centuries and still surfaces in modern literary debate as a shorthand for aesthetic temperament.",
    tip:
      "Read the opening paragraph of Don Quijote in Spanish — 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme…' Notice the ironic narrator (refusing to remember the village), the parodic mock-epic register, and the immediate establishment of the unreliable voice. Two minutes of reading; three sentences of analysis. You now hold the standard opening of literary Spanish.",
  },
];

export default lessons;
