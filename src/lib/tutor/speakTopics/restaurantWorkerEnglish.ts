import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D4ProfessionalSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-restaurant-worker-taking-orders",
    labelEn: "Taking Restaurant Orders",
    labelVi: "Nhận order trong nhà hàng",
    category: "restaurant-worker-english",
    scenarioDescription:
      "The learner is a restaurant worker greeting guests, taking dine-in or takeout orders, confirming modifiers, and repeating the order before sending it to the kitchen.",
    aiRoleDefinition:
      "Act as a restaurant guest who asks about specials, makes changes to the order, and expects the server or cashier to confirm details clearly.",
    conversationDirections: [
      "Ask whether the order is for here, to go, pickup, delivery, or dine-in table service.",
      "Practice taking drinks, appetizers, main dishes, sides, spice level, sauces, and modifications.",
      "Prompt the learner to ask follow-up questions when the order is incomplete.",
      "Practice repeating the order back with quantities and special requests.",
      "Ask about timing, payment, receipt, utensils, and pickup name when relevant.",
      "End with a clear closing line before the food is prepared.",
    ],
    warmthPatterns: [
      "Use efficient hospitality: friendly, clear, and not overly formal.",
      "Repeat modifications without annoyance.",
      "Make confirmation sound helpful: 'Let me read that back to make sure.'",
    ],
    seedInputs: ["Is this for here or to go, and what would you like to order?"],
    detectionPatterns: [
      /\b(?:for here|to go|takeout|dine[- ]?in|order|appetizer|main dish|side|spice level|sauce|pickup name)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "restaurant-orders-countables",
        label: "Quantities and plural menu items",
        note: "Vietnamese does not mark plural nouns the same way, so 'two spring roll' can feel natural. Restaurant English needs clear quantities: 'two spring rolls' or 'one order of spring rolls.'",
      },
      {
        id: "restaurant-orders-repeat-back",
        label: "Repeating back is service, not doubt",
        note: "Some learners worry repetition sounds rude or slow. In English restaurants, 'Let me read that back' is professional because it prevents kitchen mistakes and protects special requests.",
      },
    ],
    followUps: [
      { id: "restaurant-orders-type", question: "Is the guest ordering for here or to go?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "restaurant-orders-items", question: "What items does the guest want?", salienceQuestion: "How would you enter the {slot}?" },
      { id: "restaurant-orders-mods", question: "What modifier or side should you ask about?", salienceQuestion: "What detail changes the {slot}?" },
      { id: "restaurant-orders-repeat", question: "How would you repeat the order back?", salienceQuestion: "How would you repeat the {slot}?" },
      { id: "restaurant-orders-close", question: "How would you close before sending the order?", salienceQuestion: "What final check does the {slot} need?" },
    ],
  },
  {
    id: "topic-restaurant-worker-menu-diet",
    labelEn: "Explaining Menu Items And Diet Needs",
    labelVi: "Giải thích món ăn và yêu cầu ăn kiêng",
    category: "restaurant-worker-english",
    scenarioDescription:
      "The learner explains ingredients, cooking style, spice level, portion size, substitutions, and dietary restrictions such as allergies, vegetarian, vegan, gluten-free, and no pork.",
    aiRoleDefinition:
      "Act as a guest who is curious about the menu or has a dietary restriction and needs careful, honest information before ordering.",
    conversationDirections: [
      "Ask the learner to describe what comes in a dish and how it is cooked.",
      "Practice explaining spicy, mild, fried, grilled, steamed, raw, broth-based, dairy-free, and gluten-free.",
      "Prompt the learner to ask about allergies and cross-contact without making unsafe promises.",
      "Practice saying when they need to check with the kitchen.",
      "Ask how to offer substitutions or remove ingredients.",
      "End by confirming the guest's restriction and the safest menu choice.",
    ],
    warmthPatterns: [
      "Be honest and careful with allergies: 'Let me check with the kitchen.'",
      "Use descriptive menu language that helps guests imagine the dish.",
      "Respect dietary restrictions without jokes or judgment.",
    ],
    seedInputs: ["This dish has peanuts, so let me check a safer option for you."],
    detectionPatterns: [
      /\b(?:ingredients|spicy|mild|fried|grilled|steamed|allergy|allergic|vegetarian|vegan|gluten[- ]?free|dairy[- ]?free|no pork|cross[- ]?contact)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "restaurant-diet-allergy-vs-dislike",
        label: "Allergy is stronger than dislike",
        note: "Vietnamese restaurant talk may use broad phrases like 'khong an duoc.' In English service, 'allergy' is a safety word. Staff should ask, 'Is it an allergy or a preference?'",
      },
      {
        id: "restaurant-diet-check-kitchen",
        label: "Do not promise what you do not know",
        note: "To be helpful, learners may want to answer quickly. With allergens and dietary restrictions, the professional English phrase is 'Let me check with the kitchen' before promising the dish is safe.",
      },
    ],
    followUps: [
      { id: "restaurant-diet-dish", question: "Which dish are you explaining?", salienceQuestion: "How would you describe the {slot}?" },
      { id: "restaurant-diet-ingredients", question: "What ingredients or cooking method should you mention?", salienceQuestion: "What is in the {slot}?" },
      { id: "restaurant-diet-restriction", question: "What dietary restriction does the guest have?", salienceQuestion: "What restriction affects the {slot}?" },
      { id: "restaurant-diet-check", question: "How would you say you need to check with the kitchen?", salienceQuestion: "How would you verify the {slot}?" },
      { id: "restaurant-diet-option", question: "What safer option or substitution could you offer?", salienceQuestion: "What could replace the {slot}?" },
    ],
  },
  {
    id: "topic-restaurant-worker-complaints",
    labelEn: "Handling Restaurant Complaints",
    labelVi: "Xử lý phàn nàn trong nhà hàng",
    category: "restaurant-worker-english",
    scenarioDescription:
      "The learner handles guest complaints about wrong orders, long waits, cold food, missing items, billing problems, delivery errors, or dissatisfaction with a dish.",
    aiRoleDefinition:
      "Act as a guest who is frustrated but open to a respectful solution if the worker listens, apologizes, and explains the next step clearly.",
    conversationDirections: [
      "Start by acknowledging the problem and apologizing briefly.",
      "Ask what happened and confirm the exact item, table, order number, or receipt.",
      "Practice explaining what can be fixed now: remake, refund, discount, missing item, manager help, or delivery follow-up.",
      "Prompt the learner to avoid blaming the guest, kitchen, driver, or coworker.",
      "Ask how long the solution will take and what the guest prefers.",
      "End by confirming the resolution and thanking the guest for their patience.",
    ],
    warmthPatterns: [
      "Use calm repair language: 'I'm sorry about that. Let me fix it.'",
      "Keep explanations short until the guest feels heard.",
      "Offer a concrete next step instead of debating the complaint.",
    ],
    seedInputs: ["I am sorry about the mistake. Let me fix that order for you."],
    detectionPatterns: [
      /\b(?:wrong order|missing item|cold food|long wait|refund|remake|discount|manager|receipt|delivery problem|complaint|fix it)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "restaurant-complaints-sorry-about",
        label: "Sorry about, then action",
        note: "Vietnamese apologies can be indirect or repeated, while English service recovery often uses one clear apology plus action: 'I'm sorry about that. Let me fix it.'",
      },
      {
        id: "restaurant-complaints-blame",
        label: "Avoid blame words during service recovery",
        note: "Explaining 'the kitchen made mistake' may sound like blame even if it is true. A safer professional phrase is 'Let me check what happened and make this right.'",
      },
    ],
    followUps: [
      { id: "restaurant-complaint-ack", question: "How would you acknowledge the problem?", salienceQuestion: "How would you respond to the {slot}?" },
      { id: "restaurant-complaint-details", question: "What detail do you need to confirm?", salienceQuestion: "What detail confirms the {slot}?" },
      { id: "restaurant-complaint-solution", question: "What solution can you offer?", salienceQuestion: "What would solve the {slot}?" },
      { id: "restaurant-complaint-time", question: "How would you explain the wait for the solution?", salienceQuestion: "How long will the {slot} take?" },
      { id: "restaurant-complaint-close", question: "How would you close after fixing it?", salienceQuestion: "How would you close the {slot}?" },
    ],
  },
] as const satisfies readonly D4ProfessionalSpeakTopic[];
