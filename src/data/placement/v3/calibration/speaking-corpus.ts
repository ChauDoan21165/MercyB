import type { CalibrationEntry } from "./index";

export const SPEAKING_CALIBRATION_CORPUS = [
  {
    id: "cal-s-a1-routine-1",
    promptId: "a1-s-daily-routine",
    modality: "speaking",
    expectedLevel: "A1",
    expectedSubskills: { grammar: "A1", vocabulary: "A1", coherence: "A1", taskAchievement: "A1" },
    expectedL1Flags: ["copula-be-omission", "final-consonant-deletion"],
    userResponse:
      "transcript_of_speech: I wake up six. I eat rice, sometimes bread. I go school by motorbike. Morning is very busy.",
    expertNotes:
      "Basic routine is understandable but grammar is fragmentary and pronunciation flags would likely appear in speech.",
    difficulty: "clear",
  },
  {
    id: "cal-s-a1-food-1",
    promptId: "a1-s-favorite-food",
    modality: "speaking",
    expectedLevel: "A1",
    expectedSubskills: { grammar: "A1", vocabulary: "A2", coherence: "A1", taskAchievement: "A2" },
    expectedL1Flags: ["missing-articles", "tone-stress-transfer"],
    userResponse:
      "transcript_of_speech: I like pho because it hot and ngon, sorry, delicious. I eat pho with my father on Sunday. It have beef and noodle.",
    expertNotes:
      "Authentic code-switching and self-correction. Food vocabulary is adequate but verb control stays A1.",
    difficulty: "tricky",
  },
  {
    id: "cal-s-a2-plan-1",
    promptId: "a2-s-weekend-plan",
    modality: "speaking",
    expectedLevel: "A2",
    expectedSubskills: { grammar: "A2", vocabulary: "A2", coherence: "A2", taskAchievement: "A2" },
    expectedL1Flags: ["verb-form-after-to", "question-word-order-transfer"],
    userResponse:
      "transcript_of_speech: This weekend I want to go to cinema in Vincom. We can watch a comedy movie and after that drink milk tea. We meet at three, okay? You want go with me?",
    expertNotes:
      "Can make a simple plan and ask a follow-up, though infinitive and question forms are unstable.",
    difficulty: "borderline",
  },
  {
    id: "cal-s-a2-trip-1",
    promptId: "a2-s-last-trip",
    modality: "speaking",
    expectedLevel: "A2",
    expectedSubskills: { grammar: "A2", vocabulary: "A2", coherence: "A2", taskAchievement: "B1" },
    expectedL1Flags: ["past-tense-omission", "run-on-sentences"],
    userResponse:
      "transcript_of_speech: Last month I went, I go, sorry, I went to Hue with my class. We visited old palace and ate bun bo. The weather was rain but I felt happy because my friends made many funny photo.",
    expertNotes:
      "Self-correction shows emerging past control. Narrative is coherent but morphology and noun phrases remain A2.",
    difficulty: "borderline",
  },
  {
    id: "cal-s-b1-cafe-1",
    promptId: "b1-s-cafe-problem",
    modality: "speaking",
    expectedLevel: "B1",
    expectedSubskills: { grammar: "B1", vocabulary: "B1", coherence: "B1", taskAchievement: "B1" },
    expectedL1Flags: ["register-flattening", "article-omission"],
    userResponse:
      "transcript_of_speech: Excuse me, I ordered iced coffee but this one is hot. Maybe there is mistake. Could you change it for me, please? I can wait, no problem.",
    expertNotes:
      "Effective repair language and polite request. Minor article omission but the interaction is successful.",
    difficulty: "clear",
  },
  {
    id: "cal-s-b1-advice-1",
    promptId: "b1-s-study-advice",
    modality: "speaking",
    expectedLevel: "B1",
    expectedSubskills: { grammar: "B1", vocabulary: "B1", coherence: "B1", taskAchievement: "B1" },
    expectedL1Flags: ["modal-verb-inflection", "direct-translation"],
    userResponse:
      "transcript_of_speech: First, you should speak every day, even only five minutes. Second, don't afraid mistake because mistake is normal. Third, you can record your voice and listen again. If you wait until perfect grammar, you never speak.",
    expertNotes:
      "Advice is organized and practical, with clear B1 communicative success despite transferred phrasing.",
    difficulty: "clear",
  },
  {
    id: "cal-s-b2-interview-1",
    promptId: "b2-s-job-interview-strength",
    modality: "speaking",
    expectedLevel: "B2",
    expectedSubskills: { grammar: "B2", vocabulary: "B2", coherence: "B2", taskAchievement: "B2" },
    expectedL1Flags: ["collocation-transfer"],
    userResponse:
      "transcript_of_speech: One strength I developed through learning English is resilience. At first I was embarrassed when customers asked me questions, but I learned to stay calm, clarify the meaning, and answer step by step. In your team, this would help because I can communicate with international clients without panicking when the conversation is not perfect.",
    expertNotes:
      "Confident B2 response with specific example and professional framing. Some collocations are slightly non-native but controlled.",
    difficulty: "clear",
  },
  {
    id: "cal-s-b2-transport-1",
    promptId: "b2-s-city-transport-opinion",
    modality: "speaking",
    expectedLevel: "B2",
    expectedSubskills: { grammar: "B2", vocabulary: "B2", coherence: "B1", taskAchievement: "B2" },
    expectedL1Flags: ["topic-comment-transfer", "connector-overuse"],
    userResponse:
      "transcript_of_speech: About motorbikes, Vietnamese people still need them because buses are not convenient in many districts. However, if big cities only depend on motorbikes, traffic and pollution will become worse. So I think the government should improve metro and buses first, and after that people can change their habit slowly. For example, in Hanoi, many students would use metro if it connects to their university.",
    expertNotes:
      "B2 opinion with relevant example; cohesion is sometimes additive rather than elegant, but meaning is clear.",
    difficulty: "borderline",
  },
  {
    id: "cal-s-c1-family-pressure-1",
    promptId: "c1-s-parent-expectations",
    modality: "speaking",
    expectedLevel: "C1",
    expectedSubskills: { grammar: "C1", vocabulary: "C1", coherence: "C1", taskAchievement: "C1" },
    expectedL1Flags: ["calque-from-vietnamese"],
    userResponse:
      "transcript_of_speech: Family expectation is a double force. It can give Vietnamese learners discipline because parents often sacrifice a lot for education, so the student feels their study has meaning. But the same love can become pressure when English is treated only as IELTS score or a ticket to leave. I think the healthiest support is specific and calm: ask what skill the child is building, not only what band they got.",
    expertNotes:
      "Nuanced C1 answer with abstraction, concession, and cultural specificity. Minor calque-like phrasing does not impede control.",
    difficulty: "clear",
  },
  {
    id: "cal-s-c1-feedback-disagree-1",
    promptId: "c1-s-feedback-disagreement",
    modality: "speaking",
    expectedLevel: "C1",
    expectedSubskills: { grammar: "C1", vocabulary: "B2", coherence: "C1", taskAchievement: "C1" },
    expectedL1Flags: ["register-flattening"],
    userResponse:
      "transcript_of_speech: I see your point, but I don't fully agree that directness is always a weakness. In some academic writing, a clear position is necessary. Maybe my problem is not the opinion itself, but the way I support it. Could you show me which sentence sounds too strong and what kind of hedging would make it more acceptable?",
    expertNotes:
      "Handles disagreement and requests evidence politely. Vocabulary is less elaborate than C2 but fully C1 functional.",
    difficulty: "borderline",
  },
  {
    id: "cal-s-c2-reform-1",
    promptId: "c2-s-education-reform",
    modality: "speaking",
    expectedLevel: "C2",
    expectedSubskills: { grammar: "C2", vocabulary: "C2", coherence: "C2", taskAchievement: "C2" },
    expectedL1Flags: [],
    userResponse:
      "transcript_of_speech: I would redesign speaking assessment so it rewards repair, not theatrical fluency. Real communication includes hesitation, clarification, and adjusting when the listener looks confused. The objection is obvious: this is harder to score reliably than memorized monologues. But rubrics can define observable behaviors, such as asking for clarification or paraphrasing a failed answer. That would still serve exam accountability while pushing classrooms toward usable English.",
    expertNotes:
      "C2 response: compressed argument, anticipated objection, and precise assessment language.",
    difficulty: "clear",
  },
  {
    id: "cal-s-c2-cultural-translation-1",
    promptId: "c2-s-cultural-translation",
    modality: "speaking",
    expectedLevel: "C2",
    expectedSubskills: { grammar: "C2", vocabulary: "C2", coherence: "C2", taskAchievement: "C2" },
    expectedL1Flags: ["calque-from-vietnamese"],
    userResponse:
      "transcript_of_speech: Ne is not simply respect and not exactly fear of offending someone. It is the social pressure you feel when a relationship makes direct refusal costly. For example, if an older colleague asks for help, you may agree even when you are overloaded, because saying no would disturb the harmony of the relationship. The closest English explanation might be deferential reluctance, but that phrase sounds more formal and less everyday than the Vietnamese feeling.",
    expertNotes:
      "Excellent cultural mediation with precise boundaries around translation. This is C2 despite one unavoidable calque.",
    difficulty: "tricky",
  },
] satisfies CalibrationEntry[];
