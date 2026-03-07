export type ConfidenceLevel = "low" | "medium" | "high";
export type ClarityLevel = "lost" | "shaky" | "clear";
export type MomentumLevel = "stuck" | "steady" | "flowing";
export type AffectLevel = "frustrated" | "neutral" | "engaged" | "playful";

export interface LearnerState {
  confidence: ConfidenceLevel;
  clarity: ClarityLevel;
  momentum: MomentumLevel;
  affect: AffectLevel;
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

export function inferLearnerState(input: string): LearnerState {
  const text = input.toLowerCase();

  const frustrated = includesAny(text, [
    "i don't get it",
    "i dont get it",
    "this is hard",
    "i'm confused",
    "im confused",
    "why is this so hard",
    "i give up",
    "this makes no sense",
  ]);

  const lowConfidence = includesAny(text, [
    "maybe",
    "i think",
    "not sure",
    "is this right",
    "probably",
    "i guess",
  ]);

  const playful = includesAny(text, [
    "lol",
    "haha",
    "boss",
    "friend of chau doan",
    "joke",
    "roast me",
  ]);

  const clear = includesAny(text, [
    "i understand",
    "got it",
    "that makes sense",
    "okay i see",
  ]);

  const engaged = includesAny(text, [
    "give me another",
    "next one",
    "harder",
    "test me",
    "again",
  ]);

  return {
    confidence: frustrated ? "low" : lowConfidence ? "medium" : "high",
    clarity: frustrated ? "lost" : clear ? "clear" : "shaky",
    momentum: frustrated ? "stuck" : engaged ? "flowing" : "steady",
    affect: frustrated ? "frustrated" : playful ? "playful" : engaged ? "engaged" : "neutral",
  };
}