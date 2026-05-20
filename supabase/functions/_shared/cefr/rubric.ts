import { CEFRSubskill, type CEFRLevel } from "./types.ts";

export const CEFR_WRITING_RUBRIC: Record<
  CEFRLevel,
  Record<CEFRSubskill, string>
> = {
  A1: {
    grammar:
      "Uses memorised simple clauses and isolated phrases. Frequent basic errors in tense, word order, articles, plurals, and subject-verb agreement; meaning often depends on context.",
    vocabulary:
      "Has a very limited stock of everyday words for personal details, family, routine, places, food, and likes. Repetition and wrong word choice are common.",
    coherence:
      "Writes short, separate phrases or very simple sentences. Connectors are absent or limited to and/but. Sequence is mostly implicit.",
    taskAchievement:
      "Addresses only parts of a simple personal prompt with basic facts. Usually below 50 words or made of short fragments.",
  },
  A2: {
    grammar:
      "Uses simple sentence patterns, present/past forms, modals, and common connectors with frequent errors. Errors may slow or sometimes obscure meaning.",
    vocabulary:
      "Uses basic high-frequency vocabulary for familiar topics and routine needs. Can add simple detail but range remains narrow.",
    coherence:
      "Links simple sentences into a short text with and, but, because, then, after that. Paragraph control is limited.",
    taskAchievement:
      "Covers a familiar personal task in simple connected sentences, often 50-100 words. Details are concrete but underdeveloped.",
  },
  B1: {
    grammar:
      "Uses a mix of simple and some complex forms on familiar topics. Errors remain noticeable, especially tense/aspect, articles, and agreement, but usually do not block meaning.",
    vocabulary:
      "Has enough vocabulary for familiar topics, opinions, routines, plans, and reasons. Some circumlocution and collocation errors appear.",
    coherence:
      "Produces connected text with clear sequence and basic paragraphing. Uses common linking devices, though transitions may be mechanical.",
    taskAchievement:
      "Responds to the task with relevant detail, reasons, and examples on familiar topics, usually 100-200 words.",
  },
  B2: {
    grammar:
      "Uses a range of sentence structures, including subordination and varied verb forms. Errors are occasional and rarely occur in common patterns.",
    vocabulary:
      "Uses a broad enough range for clear, detailed description and explanation. Word choice is generally precise with occasional awkward collocation.",
    coherence:
      "Organises ideas clearly across sentences and paragraphs. Uses cohesive devices flexibly, with only occasional overuse or stiffness.",
    taskAchievement:
      "Develops the prompt fully with clear detail, explanation, and viewpoint. The reader can follow without effort.",
  },
  C1: {
    grammar:
      "Maintains a high degree of grammatical control across complex structures. Errors are minor, infrequent, and usually self-correctable.",
    vocabulary:
      "Uses a wide lexical range, idiomatic phrasing, and precise collocation for familiar and abstract topics. Occasional small slips do not affect style.",
    coherence:
      "Produces well-structured text with controlled flow, emphasis, and natural transitions. Cohesion supports nuance rather than just sequence.",
    taskAchievement:
      "Handles the task with sophistication, clear stance, relevant detail, and effective register. Can go beyond the minimum prompt naturally.",
  },
  C2: {
    grammar:
      "Shows consistent control of complex grammar, register, rhythm, and nuance. Any slips are rare and comparable to educated native-speaker drafting errors.",
    vocabulary:
      "Uses very precise, flexible, idiomatic vocabulary with natural collocation and tone. Can express subtle distinctions without strain.",
    coherence:
      "Writes smoothly flowing text with effortless cohesion, style, and rhetorical control. Paragraph and sentence rhythm feel natural.",
    taskAchievement:
      "Fulfils and enriches the task with mature judgement, nuance, and strong audience awareness. Response reads near-native.",
  },
};

export function formatRubricForPrompt(): string {
  return Object.entries(CEFR_WRITING_RUBRIC)
    .map(([level, descriptors]) => {
      return [
        `${level}:`,
        `- grammar: ${descriptors[CEFRSubskill.Grammar]}`,
        `- vocabulary: ${descriptors[CEFRSubskill.Vocabulary]}`,
        `- coherence: ${descriptors[CEFRSubskill.Coherence]}`,
        `- taskAchievement: ${descriptors[CEFRSubskill.TaskAchievement]}`,
      ].join("\n");
    })
    .join("\n\n");
}

