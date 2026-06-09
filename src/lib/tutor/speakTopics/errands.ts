import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type FinalThemeSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-errands-daily-list",
    labelEn: "Daily Errands List",
    labelVi: "Danh sach viec vat hang ngay",
    category: "errands",
    scenarioDescription:
      "The learner plans several everyday errands, explains priorities, asks for help, and confirms timing across shops, offices, or home tasks.",
    aiRoleDefinition:
      "Act as a helpful friend or assistant who asks what needs to be done, what is urgent, where to go first, and what details must be remembered.",
    conversationDirections: [
      "Ask what errands are on the learner's list today.",
      "Prompt the learner to choose the most urgent errand first.",
      "Practice saying where each errand happens and what item or document is needed.",
      "Ask about opening hours, travel time, and budget.",
      "Practice asking a family member or worker for help.",
      "End by confirming the order of errands and the next action.",
    ],
    warmthPatterns: [
      "Keep the conversation practical and organized.",
      "Use natural everyday phrasing rather than formal office language.",
      "Encourage short sentences that can be reused in real errands.",
    ],
    seedInputs: ["I have many errands to do today."],
    detectionPatterns: [
      /\b(?:errands|to-do list|things to do today|pick up|drop off|run errands|go to the store|finish tasks)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-run-errands",
        label: "Run errands",
        note: "The fixed phrase is 'run errands' or 'do errands.' Learners may translate word by word and say 'go errands.'",
      },
      {
        id: "errands-pick-up",
        label: "Pick up",
        note: "'Lay do' often becomes just 'take.' For collecting something from a place, English usually uses 'pick up.'",
      },
    ],
    followUps: [
      { id: "errands-list-tasks", question: "What errands are on your list today?", salienceQuestion: "What do you need to do for the {slot}?" },
      { id: "errands-list-first", question: "Which errand should you do first?", salienceQuestion: "What comes first before the {slot}?" },
      { id: "errands-list-place", question: "Where do you need to go?", salienceQuestion: "Where do you need to go for the {slot}?" },
      { id: "errands-list-item", question: "What item or document should you bring?", salienceQuestion: "What should you bring for the {slot}?" },
      { id: "errands-list-confirm", question: "How would you confirm the plan before leaving?", salienceQuestion: "How would you confirm the {slot} plan?" },
    ],
  },
  {
    id: "topic-errands-pharmacy-pickup",
    labelEn: "Pharmacy Pickup",
    labelVi: "Lay thuoc o nha thuoc",
    category: "errands",
    scenarioDescription:
      "The learner picks up medicine, asks about a prescription, confirms name and birth date, checks pickup time, and asks basic usage questions.",
    aiRoleDefinition:
      "Act as a pharmacy clerk who asks for identifying details, checks whether the medicine is ready, and gives simple next-step information.",
    conversationDirections: [
      "Ask whether the learner is picking up a prescription or buying over-the-counter medicine.",
      "Prompt name, birth date, or order number practice without exposing real private details.",
      "Ask whether the medicine is ready, backordered, or needs approval.",
      "Practice asking about dosage label, pickup time, and price.",
      "Ask how the learner would explain a missing or wrong item.",
      "End by confirming medicine name, payment, and pickup bag.",
    ],
    warmthPatterns: [
      "Keep privacy boundaries clear around birth date and health details.",
      "Use simple labels: prescription, refill, ready, not ready, covered.",
      "Stay procedural and avoid medical advice beyond asking the pharmacist.",
    ],
    seedInputs: ["I need to pick up medicine at the pharmacy."],
    detectionPatterns: [
      /\b(?:pharmacy pickup|pick up medicine|prescription|refill|medicine is ready|drugstore|pharmacist|dosage label)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-pharmacy-prescription",
        label: "Pick up a prescription",
        note: "For medicine ordered by a doctor, English often says 'pick up a prescription,' not only 'take medicine.'",
      },
      {
        id: "errands-pharmacy-ready",
        label: "Is it ready?",
        note: "'Da co chua?' at a pharmacy maps naturally to 'Is it ready?' or 'Is my prescription ready?'",
      },
    ],
    followUps: [
      { id: "errands-pharmacy-type", question: "Are you picking up a prescription or buying medicine?", salienceQuestion: "What kind of medicine is the {slot}?" },
      { id: "errands-pharmacy-ready", question: "How would you ask if it is ready?", salienceQuestion: "Is the {slot} ready?" },
      { id: "errands-pharmacy-id", question: "What identifying detail might they ask for?", salienceQuestion: "What detail connects you to the {slot}?" },
      { id: "errands-pharmacy-label", question: "How would you ask about the dosage label?", salienceQuestion: "What does the label say about the {slot}?" },
      { id: "errands-pharmacy-cost", question: "How would you ask about the price or coverage?", salienceQuestion: "What does the {slot} cost?" },
    ],
  },
  {
    id: "topic-errands-store-return",
    labelEn: "Returning An Item",
    labelVi: "Doi tra hang",
    category: "errands",
    scenarioDescription:
      "The learner returns or exchanges an item, explains the problem, shows proof of purchase, and asks about refund, store credit, or replacement.",
    aiRoleDefinition:
      "Act as a store associate who asks what happened, checks receipt or order number, and explains return or exchange options politely.",
    conversationDirections: [
      "Ask what item the learner wants to return or exchange.",
      "Prompt the learner to explain the issue clearly and briefly.",
      "Ask whether they have a receipt, order number, tag, or warranty.",
      "Practice asking for a refund, exchange, repair, or store credit.",
      "Ask about return window, fee, and manager approval if needed.",
      "End by confirming the option chosen and any receipt or confirmation.",
    ],
    warmthPatterns: [
      "Keep the tone polite but clear about the learner's request.",
      "Use real store phrases: refund, exchange, receipt, return policy.",
      "Help the learner avoid over-explaining the problem.",
    ],
    seedInputs: ["I want to return this item because it does not work."],
    detectionPatterns: [
      /\b(?:return this item|exchange this item|refund|store credit|return policy|receipt|does not work|wrong size|damaged item)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-return-refund",
        label: "Ask for a refund",
        note: "Learners may say 'return money.' The natural store phrase is 'Can I get a refund?'",
      },
      {
        id: "errands-return-does-not-work",
        label: "It does not work",
        note: "For a broken product, 'It does not work' is clearer than 'It is not run' or 'It cannot use.'",
      },
    ],
    followUps: [
      { id: "errands-return-item", question: "What item do you want to return or exchange?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "errands-return-reason", question: "How would you explain the problem briefly?", salienceQuestion: "What happened with the {slot}?" },
      { id: "errands-return-proof", question: "What proof of purchase do you have?", salienceQuestion: "What proof do you have for the {slot}?" },
      { id: "errands-return-option", question: "Do you want a refund, exchange, or repair?", salienceQuestion: "What do you want for the {slot}?" },
      { id: "errands-return-policy", question: "How would you ask about the return policy?", salienceQuestion: "What policy applies to the {slot}?" },
    ],
  },
] as const satisfies readonly FinalThemeSpeakTopic[];
