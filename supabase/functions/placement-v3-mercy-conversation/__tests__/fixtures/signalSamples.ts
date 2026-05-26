import type { CefrLevel } from "../../types";

export const signalSamples: Array<{ id: string; text: string; prompt?: string; expected: CefrLevel; expectedFlag?: string }> = [
  { id: "a1", text: "I go school. I tired. Speaking difficult.", expected: "A1", expectedFlag: "l1_missing_be" },
  { id: "b1", text: "I practiced listening every night because speakers were fast, and after two months I understood the main idea.", expected: "B1" },
  { id: "c1", text: "The silence is rational rather than laziness because students are rewarded for accuracy before they are allowed to communicate.", expected: "C1" },
  { id: "self-correct", text: "I go, sorry, I went to the interview and explained my plan more clearly.", expected: "B1" },
  { id: "off-topic", prompt: "Tell me about your job.", text: "Blue coffee table yes.", expected: "A1" },
  { id: "vn-l1", text: "Many student in Vietnam learn grammar but he go quiet when foreigner speak.", expected: "A2", expectedFlag: "l1_plural_s" },
  { id: "code-switch", text: "I wake up at six and đi làm bằng xe máy because traffic is heavy.", expected: "A2" },
  { id: "empty", text: "", expected: "A1" },
];
