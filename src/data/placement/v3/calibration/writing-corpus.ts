import type { CalibrationEntry } from "./index";

export const WRITING_CALIBRATION_CORPUS = [
  {
    id: "cal-w-a1-self-intro-1",
    promptId: "a1-w-self-intro",
    modality: "writing",
    expectedLevel: "A1",
    expectedSubskills: { grammar: "A1", vocabulary: "A1", coherence: "A1", taskAchievement: "A1" },
    expectedL1Flags: ["copula-be-omission", "missing-articles"],
    userResponse: "My name Linh. I live in Hanoi. I like music and cat. I am student.",
    expertNotes:
      "Communicates basic personal information but omits be and articles. Vocabulary is narrow and sentence control is A1.",
    difficulty: "clear",
  },
  {
    id: "cal-w-a1-family-photo-1",
    promptId: "a1-w-family-photo",
    modality: "writing",
    expectedLevel: "A1",
    expectedSubskills: { grammar: "A1", vocabulary: "A1", coherence: "A1", taskAchievement: "A2" },
    expectedL1Flags: ["pronoun-gender-confusion", "missing-plurals", "copula-be-omission"],
    userResponse:
      "This my family. My mother 45 year old. He is teacher. My brother like football. We happy.",
    expertNotes:
      "The response fulfills the task but relies on short clauses with unstable pronouns, plurals, and copula use.",
    difficulty: "tricky",
  },
  {
    id: "cal-w-a2-yesterday-1",
    promptId: "a2-w-yesterday-after-school",
    modality: "writing",
    expectedLevel: "A2",
    expectedSubskills: { grammar: "A2", vocabulary: "A2", coherence: "A2", taskAchievement: "A2" },
    expectedL1Flags: ["past-tense-omission", "preposition-transfer"],
    userResponse:
      "Yesterday after work I go to market with my sister. We bought vegetable and fish. At 7 pm I cook dinner but the fish was too salty. Then I watched film in my phone.",
    expertNotes:
      "There is a clear sequence and adequate everyday vocabulary, but past tense marking is inconsistent and prepositions show transfer.",
    difficulty: "borderline",
  },
  {
    id: "cal-w-a2-tet-1",
    promptId: "a2-w-tet-message",
    modality: "writing",
    expectedLevel: "A2",
    expectedSubskills: { grammar: "A2", vocabulary: "B1", coherence: "A2", taskAchievement: "A2" },
    expectedL1Flags: ["direct-translation", "subject-verb-agreement", "article-omission"],
    userResponse:
      "Hi Anna, Tet is biggest holiday in Vietnam. My family clean house, cook banh chung and visit grandparents. You should come my home because it is very vui and warm. I hope you can eat many food with us.",
    expertNotes:
      "Good cultural vocabulary and invitation intent, but grammar remains elementary with article omission and direct Vietnamese rhythm.",
    difficulty: "borderline",
  },
  {
    id: "cal-w-b1-lost-phone-1",
    promptId: "b1-w-lost-phone",
    modality: "writing",
    expectedLevel: "B1",
    expectedSubskills: { grammar: "B1", vocabulary: "B1", coherence: "B1", taskAchievement: "B1" },
    expectedL1Flags: ["missing-articles", "preposition-transfer"],
    userResponse:
      "Dear Manager, I visited your cafe on Bach Dang Street yesterday at about 4 p.m. I sat near the window on second floor. I think I left my black iPhone 13 on the table when I paid. It has a blue case and a photo of my son inside. Could you please check for me? You can contact me by this email or call 0900000000.",
    expertNotes:
      "Functional B1 email with relevant details and polite request. Minor article and preposition errors do not block communication.",
    difficulty: "clear",
  },
  {
    id: "cal-w-b1-learning-problem-1",
    promptId: "b1-w-learning-problem",
    modality: "writing",
    expectedLevel: "B1",
    expectedSubskills: { grammar: "B1", vocabulary: "B1", coherence: "A2", taskAchievement: "B1" },
    expectedL1Flags: ["lexical-repetition", "question-word-order-transfer", "connector-overuse"],
    userResponse:
      "I have problem with speaking confidence. I studied English many years but when foreigner ask me something I cannot answer fast. I try watch YouTube and shadowing, however I still afraid. So what should I practice every day and how can I stop translate from Vietnamese in my head?",
    expertNotes:
      "The message is meaningful and task-complete, but organization and question formation are uneven. This is a solid B1 with A2-like pressure points.",
    difficulty: "borderline",
  },
  {
    id: "cal-w-b2-workplace-1",
    promptId: "b2-w-workplace-choice",
    modality: "writing",
    expectedLevel: "B2",
    expectedSubskills: { grammar: "B2", vocabulary: "B2", coherence: "B2", taskAchievement: "B2" },
    expectedL1Flags: ["connector-overuse", "register-flattening"],
    userResponse:
      "For early-career workers, I would choose the lower salary with training. A high salary is attractive, especially when young people need to support their family, but long hours can make them repeat simple tasks without improving. Training and mentoring create skills that can be used for many years. For example, a junior marketer who learns how to read data and receive feedback may earn less this year but become much more valuable later. Therefore, the second option is more sustainable, although companies should still pay enough for basic living costs.",
    expertNotes:
      "Clear B2 argument with concession, example, and appropriate workplace vocabulary. Some phrasing is plain but effective.",
    difficulty: "clear",
  },
  {
    id: "cal-w-b2-air-pollution-1",
    promptId: "b2-w-city-air-pollution",
    modality: "writing",
    expectedLevel: "B2",
    expectedSubskills: { grammar: "B2", vocabulary: "B2", coherence: "B2", taskAchievement: "B2" },
    expectedL1Flags: ["topic-comment-transfer", "collocation-transfer"],
    userResponse:
      "Air pollution in Hanoi and Ho Chi Minh City is not only an environmental issue but also an education issue. Schools should check air quality before outdoor activities and provide masks for younger students. Families can reduce motorbike trips when possible, but they should not be blamed alone because many parents have no other transport. Local government has the biggest role: improve buses, limit construction dust, and publish reliable data. If each side does a realistic part, students can study with fewer health risks.",
    expertNotes:
      "Well-organized and practical with control of concession. Minor collocation stiffness remains but level is B2.",
    difficulty: "clear",
  },
  {
    id: "cal-w-c1-migration-1",
    promptId: "c1-w-migration-tradeoffs",
    modality: "writing",
    expectedLevel: "C1",
    expectedSubskills: { grammar: "C1", vocabulary: "C1", coherence: "C1", taskAchievement: "C1" },
    expectedL1Flags: ["calque-from-vietnamese"],
    userResponse:
      "Migration can transform a student's options, but it also changes the cost of every decision. Studying abroad offers stronger institutions, broader networks, and often a clearer reward for English proficiency. Yet it can also create loneliness, financial pressure, and a quiet loss of belonging. Staying in Vietnam is not simply the conservative choice: English can open remote work, tourism, technology, and international collaboration without forcing a person to rebuild their life elsewhere. I would argue for staying first, unless a specific program abroad is clearly superior. The wiser question is not 'go or stay' but whether English is being used to expand agency rather than outsource hope.",
    expertNotes:
      "Nuanced, controlled, and lexically precise. The final metaphor is sophisticated, with only slight Vietnamese-influenced abstraction.",
    difficulty: "clear",
  },
  {
    id: "cal-w-c1-ai-ethics-1",
    promptId: "c1-w-ai-tutor-ethics",
    modality: "writing",
    expectedLevel: "C1",
    expectedSubskills: { grammar: "C1", vocabulary: "C1", coherence: "B2", taskAchievement: "C1" },
    expectedL1Flags: ["collocation-transfer", "relative-clause-transfer"],
    userResponse:
      "AI tutors are valuable because they make feedback less dependent on family income. A learner in a small province can receive correction at midnight, something a human teacher cannot provide cheaply. However, the danger is that wrong feedback may become very confident feedback. Students may also interact with English as a private screen activity, not as a social language. Safeguards should include visible uncertainty, Vietnamese explanations of common errors, and easy reporting when feedback feels wrong. AI should be treated as a tireless assistant, not an authority that replaces teachers or classmates.",
    expertNotes:
      "C1 range and control, though paragraph development is compact. Strong handling of risk and safeguard framing.",
    difficulty: "borderline",
  },
  {
    id: "cal-w-c2-diaspora-1",
    promptId: "c2-w-diaspora-identity",
    modality: "writing",
    expectedLevel: "C2",
    expectedSubskills: { grammar: "C2", vocabulary: "C2", coherence: "C2", taskAchievement: "C2" },
    expectedL1Flags: [],
    userResponse:
      "For immigrant families, English is rarely just a school subject. It is the language of permissions, interviews, medical forms, and social ease; it can make a child safer in the new country. Yet that same competence can quietly invert authority inside the family, with children interpreting not only words but institutions for their parents. The risk is not that English replaces Vietnamese overnight. It is subtler: Vietnamese becomes the language of affection and memory, while English becomes the language of ambition and public legitimacy. A healthy bilingual education should resist that split by giving Vietnamese intellectual dignity, not merely sentimental value.",
    expertNotes:
      "Near-native precision with layered argumentation and controlled abstraction. It sustains nuance without over-explaining.",
    difficulty: "clear",
  },
  {
    id: "cal-w-c2-exam-culture-1",
    promptId: "c2-w-exam-culture-critique",
    modality: "writing",
    expectedLevel: "C2",
    expectedSubskills: { grammar: "C2", vocabulary: "C1", coherence: "C2", taskAchievement: "C2" },
    expectedL1Flags: ["connector-overuse"],
    userResponse:
      "The problem is not assessment itself, but the collapse of assessment into theatre. A good exam clarifies standards, rewards preparation, and protects students from purely subjective judgment. Bad exam culture does the opposite: it teaches students to perform competence while postponing actual use. In Vietnam, this distinction matters because families often need scores as a portable signal of opportunity. Abolishing high-stakes tests would not magically create communicative classrooms. The better reform is to make exams harder to game and closer to real language tasks: listening under imperfect conditions, writing for an audience, and speaking with repair, hesitation, and pressure.",
    expertNotes:
      "C2-level critique with strong distinction-making and rhetorical compression. Slight connector density does not lower the level.",
    difficulty: "tricky",
  },
] satisfies CalibrationEntry[];
