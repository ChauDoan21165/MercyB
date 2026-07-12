import { describe, expect, it } from "vitest";
import { correctWithTutorRules } from "../correctionEngine";

const trueMissCases = [
  ["I from Canada.", "I am from Canada.", "en-step6-location-be-drop"],
  ["Sorry, the air conditioner broken.", "Sorry, the air conditioner is broken.", "en-vn-copula-be-adjective"],
  ["Excuse me, I lost.", "Excuse me, I am lost.", "en-vn-copula-be-adjective"],
  ["I want to go this hotel.", "I want to go to this hotel.", "en-step5-preposition-pattern"],
  ["You show me on the map?", "Can you show me on the map?", "en-vn-yesno-do-support"],
  ["Excuse me, I sick.", "Excuse me, I am sick.", "en-vn-copula-be-adjective"],
  ["What wrong?", "What is wrong?", "en-vn-copula-be-adjective"],
  ["I have stomachache.", "I have a stomachache.", "en-l4-missing-singular-article"],
  ["If it gets worse, go the hospital.", "If it gets worse, go to the hospital.", "en-step5-preposition-pattern"],
  ["I went work, then came home early.", "I went to work, then came home early.", "en-step5-preposition-pattern"],
  ["I go to work, then came home early.", "I went to work, then came home early.", "en-step6-past-marker-recall"],
  ["What happened", "What happened?", "en-question-form-final-mark"],
  ["Have you tried turning it off and on again", "Have you tried turning it off and on again?", "en-question-form-final-mark"],
  ["I yesterday have had a fever since.", "I have had a fever since yesterday.", "en-time-expression-placement"],
  ["Do you have sore throat?", "Do you have a sore throat?", "en-l4-missing-singular-article"],
  ["Yes, 6 o'clock fine.", "Yes, 6 o'clock is fine.", "en-vn-copula-be-adjective"],
  ["Okay, then you also need address confirmation.", "Okay, then you also need an address confirmation.", "en-l4-missing-singular-article"],
  ["Yesterday the ATM take my card.", "Yesterday the ATM took my card.", "en-yesterday-irregular-beginner-past"],
  ["Any network fine, or do you want a stronger one?", "Any network is fine, or do you want a stronger one?", "en-vn-copula-be-adjective"],
  ["Okay, but it ne to be done before 5 o'clock today.", "Okay, but it needs to be done before 5 o'clock today.", "en-step5-subject-verb-agreement"],
  ["I need to pick up my child five p.m.", "I need to pick up my child at five p.m.", "en-step6-at-clock-time"],
  ["Okay, a cafe fine.", "Okay, a cafe is fine.", "en-vn-copula-be-adjective"],
  ["Doctor, I have had sore throat and cough for about three days.", "Doctor, I have had a sore throat and cough for about three days.", "en-l4-missing-singular-article"],
  ["I take this medicine after eating?", "Do I take this medicine after eating?", "en-vn-yesno-do-support"],
  ["You lower the price a little?", "Can you lower the price a little?", "en-vn-yesno-do-support"],
  ["I understand, let me see if Here have another option.", "I understand, let me see if there is another option.", "en-existential-have-there-is"],
  ["Thank you, then it fine.", "Thank you, then it is fine.", "en-vn-copula-be-adjective"],
  ["After eating better.", "After eating is better.", "en-vn-copula-be-adjective"],
  ["There something that will not make me sleepy?", "Is there something that will not make me sleepy?", "en-vn-yesno-do-support"],
  ["Yesterday I go to the clinic because I felt unwell.", "Yesterday I went to the clinic because I felt unwell.", "en-yesterday-irregular-beginner-past"],
  ["this I like area because it is quiet and convenient.", "I like this area because it is quiet and convenient.", "en-l4-topic-comment-word-order"],
  ["Then why do you not move more closer to the center?", "Then why do you not move closer to the center?", "en-vietlish-double-comparative"],
  ["I chose this cafe because it good for working.", "I chose this cafe because it is good for working.", "en-vn-copula-be-adjective"],
  ["Yeah, it quiet here and the Wi-Fi is stable.", "Yeah, it is quiet here and the Wi-Fi is stable.", "en-vn-copula-be-adjective"],
] as const;

const colloquialAbstentions = [
  "You want it spicy?",
  "You pay cash or by card?",
  "Forty thousand okay?",
  "You free tonight?",
  "Seven o'clock okay?",
  "You need medicine?",
  "You tried turning it off and on again?",
  "Work busy?",
  "Electricity and water included in the rent?",
  "You already have a temporary residence card?",
  "You already have all the documents?",
] as const;

describe("INT probe blindspot closure", () => {
  it.each(trueMissCases)("%s", (input, expectedCorrection, expectedRuleId) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.status).toBe("corrected");
    expect(result.corrected).toBe(expectedCorrection);
    expect(result.appliedRuleIds).toContain(expectedRuleId);
  });

  it.each(colloquialAbstentions)("keeps defensible colloquial question ellipsis: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.status).toBe("unchanged");
    expect(result.corrected).toBe(input);
    expect(result.appliedRuleIds).toEqual([]);
  });
});
