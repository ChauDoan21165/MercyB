import { describe, expect, it } from "vitest";
import { detectResidualError, isSafeToPromote } from "@/lib/tutor/residualErrorCheck";

/**
 * The five confident-but-wrong engine outputs reproduced on main. Each is what
 * correctWithTutorRules() returned with status "corrected", and each was then
 * promoted into the speak-practice model slot for the learner to imitate.
 */
const CONFIDENT_BUT_WRONG: Array<[string, string]> = [
  ["Yesterday I went to school and I no have book.", "uncorrected-negation"],
  ["He goes to work by bus everyday and he no late.", "uncorrected-negation"],
  ["My father he is a teacher and he teach math at school.", "subject-verb-agreement"],
  ["There are many people in the party yesterday there.", "doubled-token"],
  ["Because I am tired, I go sleep early.", "bare-infinitive-after-motion-verb"],
];

describe("detectResidualError — RECALL: the five proven confident-but-wrong outputs", () => {
  it.each(CONFIDENT_BUT_WRONG)("flags %j", (sentence, expectedClass) => {
    const finding = detectResidualError(sentence);
    expect(finding, `expected a residual error in: ${sentence}`).not.toBeNull();
    expect(finding?.errorClass).toBe(expectedClass);
    expect(isSafeToPromote(sentence)).toBe(false);
  });
});

/**
 * PRECISION. These are grammatical English sentences. A false flag here silently
 * withholds a good correction from the learner — the failure mode this gate must
 * never introduce. Every entry corresponds to an exclusion in the source.
 */
const MUST_STILL_PROMOTE: string[] = [
  // Clean corrections of the very inputs above.
  "Yesterday I went to school and I did not have a book.",
  "He goes to work by bus every day and he is not late.",
  "My father is a teacher and he teaches math at school.",
  "There were many people at the party yesterday.",
  "Because I am tired, I go to sleep early.",

  // Existing promoted fixtures elsewhere in the suite.
  "She goes to school every day.",

  // `no` as a determiner — legal.
  "I have no book.",
  "There is no problem with the answer.",
  "I no longer live in Hanoi.",
  "No one knows the answer.",
  "He has no doubt about it.",

  // Causative / permissive — the pronoun is an OBJECT, so the bare verb is a
  // correct bare infinitive, not a missing -s. "Let it go" is very common.
  "Let it go.",
  "Make it work.",
  "Watch it grow.",
  "Help him learn.",
  "Let it be.",
  "See her leave.",
  "Have him call me.",

  // Subject-aux inversion — bare verb is correct after do-support / modals.
  "Does he like it?",
  "Did she go to the market?",
  "Can he teach math?",
  "Where does she work?",
  "He can teach math at school.",
  "She will study English tonight.",
  "It does not matter.",

  // Base form == past form; "read"/"put"/"cost" must never be flagged.
  "Yesterday he read a book.",
  "She put the book on the table.",
  "It cost ten dollars.",

  // Motion verb + `to` infinitive, gerunds, and non-verb complements.
  "I go to sleep early.",
  "She goes shopping every weekend.",
  "They went swimming yesterday.",
  "He goes home after work.",
  "Please come here.",

  // Legitimate consecutive doublings.
  "I had had enough of the noise.",
  "He said that that was fine.",

  // Existential "there" without the engine's trailing duplicate.
  "There are many people at the party.",
  // Trailing "there" with a locative particle — legal, though the engine appends
  // " there." unconditionally.
  "There is a book on the table over there.",
  "There are children playing out there.",
  // Trailing "there" with NO adjunct already filling the slot — ordinary English.
  "There are many people there.",
  "There is someone there.",

  // A clean sentence the correction engine itself mislabels `needs_ai`.
  "I do not understand what the teacher said yesterday.",
];

describe("detectResidualError — PRECISION: grammatical sentences must still promote", () => {
  it.each(MUST_STILL_PROMOTE)("does not flag %j", (sentence) => {
    const finding = detectResidualError(sentence);
    expect(
      finding,
      `FALSE POSITIVE — good correction would be withheld: ${sentence} (${finding?.errorClass}: ${finding?.evidence})`,
    ).toBeNull();
    expect(isSafeToPromote(sentence)).toBe(true);
  });
});

describe("detectResidualError — additional recall within the covered classes", () => {
  it.each([
    "I no understand what teacher say.",
    "He don't have money so he no can buy.",
    "My father no have money.",
  ])("flags uncorrected negation in %j", (s) => {
    expect(detectResidualError(s)?.errorClass).toBe("uncorrected-negation");
  });

  it.each(["She teach English.", "It seem good to me."])("flags agreement in %j", (s) => {
    expect(detectResidualError(s)?.errorClass).toBe("subject-verb-agreement");
  });

  it("flags a consecutive duplicate word", () => {
    expect(detectResidualError("I saw the the dog.")?.errorClass).toBe("doubled-token");
  });
});

describe("detectResidualError — degrades safely (never withholds on a bug)", () => {
  it.each([
    ["", "empty"],
    ["   ", "whitespace"],
  ])("returns null for %j (%s)", (input) => {
    expect(detectResidualError(input)).toBeNull();
    expect(isSafeToPromote(input)).toBe(true);
  });

  it("returns null rather than throwing on a non-string", () => {
    expect(detectResidualError(undefined as unknown as string)).toBeNull();
    expect(detectResidualError(null as unknown as string)).toBeNull();
  });
});
