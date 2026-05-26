import type { CefrLevel } from "../../types";

export const personaSamples: Array<{ level: CefrLevel; text: string; viAllowed: boolean }> = [
  { level: "A1", text: "That's okay. Nếu câu hỏi hơi khó, em có thể trả lời bằng một câu tiếng Anh ngắn thôi. What food do you like?", viAllowed: true },
  { level: "A2", text: "No rush. Tell me one small thing you did after work yesterday.", viAllowed: true },
  { level: "B1", text: "Tell me about a time you had to learn something difficult. What helped you keep going?", viAllowed: false },
  { level: "B2", text: "Which matters more for Vietnamese students: exam practice or real conversation, and why?", viAllowed: false },
  { level: "C1", text: "What is one belief about English learning in Vietnam that is partly true but often misunderstood?", viAllowed: false },
  { level: "C2", text: "How do language, opportunity, and confidence influence each other for Vietnamese learners trying to work or study abroad?", viAllowed: false },
];
