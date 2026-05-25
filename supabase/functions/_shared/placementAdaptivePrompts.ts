export type PlacementAdaptiveModality =
  | "reading"
  | "writing"
  | "listening"
  | "speaking";

export type PlacementAdaptiveCefrLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

export type BuildAdaptiveGenerationPromptInput = {
  modality: PlacementAdaptiveModality;
  targetCefr: PlacementAdaptiveCefrLevel;
  learnerL1: string;
  targetLanguage: string;
  skillFocus: string;
  difficultyConstraints: string[];
  promptVersion?: string;
};

export type BuildAdaptiveValidationPromptInput = {
  item: Record<string, unknown>;
  existingItems: Array<{ id: string; title?: string; promptText?: string }>;
  promptVersion?: string;
};

export const PLACEMENT_ADAPTIVE_PROMPT_VERSION = "a35-v1";

export const PLACEMENT_ADAPTIVE_TUNING_NOTES: Record<string, string> = {
  "a35-v1":
    "Baseline: generate one compact, gradable placement item with explicit Vietnamese-L1 diagnostic target.",
  "a35-v2":
    "Tuning cycle 1: require less template-like wording and a clearer expected answer or scoring target.",
  "a35-v3":
    "Tuning cycle 2: require stronger Vietnamese-L1 interference link without making the item culturally narrow.",
  "a35-v4":
    "Tuning cycle 3: require learner-friendly mobile wording and reject decorative complexity.",
};

export const MODALITY_CONSTRAINTS: Record<PlacementAdaptiveModality, string[]> = {
  reading: [
    "Include a short passage and one comprehension question.",
    "Question may be mcq, true_false, or short_answer.",
    "Expected answer must be unambiguous.",
    "Do not grade the learner's writing except when it obscures comprehension.",
  ],
  writing: [
    "Ask for a short written response appropriate to the CEFR level.",
    "The task must expose grammar, vocabulary, coherence, and task achievement.",
    "Do not require specialist knowledge or long essays.",
    "Expected answer should describe scoring targets, not a model essay.",
  ],
  listening: [
    "Provide an audio transcript to be recorded later and one comprehension question.",
    "The transcript must be natural spoken English, not a written article.",
    "Expected answer must be unambiguous.",
    "Do not depend on accents, music, sound effects, or native audio delivery.",
  ],
  speaking: [
    "Ask for a spoken response with a realistic time target.",
    "The task must expose fluency, accuracy, range, interaction, and transcript-visible pronunciation clues.",
    "Do not require a partner, image, or live examiner.",
    "Expected answer should describe observable scoring targets.",
  ],
};

export const REJECTION_RUBRIC = [
  "too_easy: predicted CEFR is more than one level below target.",
  "too_hard: predicted CEFR is more than one level above target.",
  "culturally_awkward: wording assumes non-Vietnamese cultural knowledge or stereotypes Vietnamese learners.",
  "unsafe: includes harmful, sexual, hateful, violent, exploitative, or self-harm content.",
  "age_inappropriate: unsuitable for 13+ placement use.",
  "boring: generic filler prompt unlikely to produce useful placement evidence.",
  "poor_vietnamese_l1_relevance: does not connect to useful Vietnamese L1 transfer evidence.",
  "not_gradable: no stable expected answer, rubric target, or observable response evidence.",
  "duplicate: materially similar to existing generated items.",
  "rubric_mismatch: cannot be judged with Placement V3 modality rubrics.",
  "malformed: missing required schema fields or inconsistent modality fields.",
  "model_unavailable: generation or validation provider was unavailable.",
];

const CEFR_ANCHORS = `
A1: very familiar words, isolated phrases, basic personal information, simple literal tasks.
A2: short familiar texts or responses, routine needs, simple reasons, concrete details.
B1: connected familiar topics, opinions, plans, reasons, straightforward inference.
B2: clear detail, comparison, explanation, moderate abstraction, paraphrase and distractors.
C1: complex argument, nuance, register, implicit meaning, academic or professional contexts.
C2: near-native precision, subtlety, style, ambiguity, sophisticated inference.
`.trim();

const VIETNAMESE_L1_ANCHORS = `
Useful Vietnamese-L1 diagnostic targets include: final consonants and -s/-ed, articles, tense marking, subject-verb agreement, plural marking, question inversion, copula be, prepositions, literal Vietnamese calques, word stress, intonation, relative clauses, cohesion, requests/apologies/register.
Frame these respectfully as English-Vietnamese transfer patterns. Do not mock Vietnamese-accented English or require political, religious, sexual, medical, or traumatic content.
`.trim();

export function buildAdaptiveGenerationPrompts(
  input: BuildAdaptiveGenerationPromptInput,
): { systemPrompt: string; userMessage: string } {
  const promptVersion = input.promptVersion ?? PLACEMENT_ADAPTIVE_PROMPT_VERSION;
  const constraints = MODALITY_CONSTRAINTS[input.modality].join("\n- ");

  const systemPrompt = `
You create production-grade CEFR placement-test items for MercyBlade.
The learner is usually Vietnamese L1 learning English. Items must be Vietnamese-first, mobile-friendly, age-appropriate for 13+, and useful for level placement.

Return JSON only. No markdown. Do not include explanations outside JSON.

CEFR anchors:
${CEFR_ANCHORS}

Vietnamese-L1 relevance anchors:
${VIETNAMESE_L1_ANCHORS}

Modality constraints for ${input.modality}:
- ${constraints}

Prompt version: ${promptVersion}
Tuning note: ${PLACEMENT_ADAPTIVE_TUNING_NOTES[promptVersion] ?? "custom"}
`.trim();

  const userMessage = `
Generate one fresh placement item.

Inputs:
- modality: ${input.modality}
- targetCefr: ${input.targetCefr}
- learnerL1: ${input.learnerL1}
- targetLanguage: ${input.targetLanguage}
- skillFocus: ${input.skillFocus}
- difficultyConstraints: ${input.difficultyConstraints.join("; ") || "none"}

Output exactly this JSON shape:
{
  "title": "short internal title",
  "modality": "${input.modality}",
  "targetCefr": "${input.targetCefr}",
  "learnerL1": "${input.learnerL1}",
  "targetLanguage": "${input.targetLanguage}",
  "skillFocus": "${input.skillFocus}",
  "difficultyConstraints": ["copied or refined constraints"],
  "promptText": "learner-facing task",
  "passageText": "reading passage only, else null",
  "audioTranscript": "listening transcript only, else null",
  "questionText": "reading/listening question if applicable, else null",
  "questionType": "open_response|short_answer|mcq|true_false",
  "options": ["only for mcq"],
  "expectedAnswer": "answer key or scoring target",
  "rubricDimensions": ["modality rubric dimensions this item can evaluate"],
  "vietnameseL1Targets": ["specific transfer pattern ids or labels"],
  "ageBand": "13+",
  "estimatedResponseSeconds": 45
}

Quality rules:
- Keep it usable on a phone screen.
- Make the item fresh, not a template with swapped nouns.
- Make the response gradable by the current Placement V3 modality rubric.
- Avoid politics, religion, graphic harm, dating/sex, medical advice, money pressure, and personal trauma.
- Avoid culture traps. Vietnamese context is welcome only when it helps learning and remains neutral.
`.trim();

  return { systemPrompt, userMessage };
}

export function buildAdaptiveValidationPrompts(
  input: BuildAdaptiveValidationPromptInput,
): { systemPrompt: string; userMessage: string } {
  const promptVersion = input.promptVersion ?? PLACEMENT_ADAPTIVE_PROMPT_VERSION;
  const existing = input.existingItems
    .slice(0, 50)
    .map((item) => `- ${item.id}: ${item.title ?? ""} ${item.promptText ?? ""}`.trim())
    .join("\n");

  const systemPrompt = `
You are the MercyBlade Placement V3 adaptive item validator.
You reject weak items. A useful rejection is better than accepting unsafe or ungradable placement content.

Return JSON only. No markdown.

Validate against:
1. CEFR fit.
2. Safety.
3. Age-appropriateness for 13+.
4. Cultural neutrality.
5. Vietnamese-L1 interference relevance.
6. Duplicate/similarity risk.
7. Rubric compatibility.
8. Learner usability on mobile.

CEFR anchors:
${CEFR_ANCHORS}

Vietnamese-L1 anchors:
${VIETNAMESE_L1_ANCHORS}

Rejection rubric:
${REJECTION_RUBRIC.join("\n")}

Prompt version: ${promptVersion}
`.trim();

  const userMessage = `
Candidate item JSON:
${JSON.stringify(input.item, null, 2)}

Existing items for duplicate check:
${existing || "(none provided)"}

Output exactly this JSON shape:
{
  "finalDecision": "accepted|rejected",
  "cefrFit": { "score": 0.0, "pass": false, "predictedCefr": "A1|A2|B1|B2|C1|C2", "notes": "short evidence" },
  "safety": { "score": 0.0, "pass": false, "notes": "short evidence" },
  "ageAppropriateness": { "score": 0.0, "pass": false, "notes": "short evidence" },
  "culturalNeutrality": { "score": 0.0, "pass": false, "notes": "short evidence" },
  "vietnameseL1Relevance": { "score": 0.0, "pass": false, "matchedPatterns": ["pattern"], "notes": "short evidence" },
  "duplicateRisk": { "score": 0.0, "pass": false, "nearestItemIds": ["id"], "notes": "score is risk: lower is better; pass when <=0.35" },
  "rubricCompatibility": { "score": 0.0, "pass": false, "supportedDimensions": ["dimension"], "notes": "short evidence" },
  "learnerUsability": { "score": 0.0, "pass": false, "notes": "short evidence" },
  "rejectionReasons": [
    { "code": "too_easy|too_hard|culturally_awkward|unsafe|age_inappropriate|boring|poor_vietnamese_l1_relevance|not_gradable|duplicate|rubric_mismatch|malformed", "severity": "low|medium|high", "message": "specific reason", "evidence": "quoted field or phrase" }
  ]
}

Decision rule:
- Accept only if all pass flags are true and duplicateRisk.score <= 0.35.
- Reject if schema fields are missing or modality-specific fields do not match.
- Reject if no Vietnamese-L1 target is genuinely testable.
`.trim();

  return { systemPrompt, userMessage };
}
