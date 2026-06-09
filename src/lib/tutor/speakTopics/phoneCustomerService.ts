import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D3SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-phone-customer-service-provider-call",
    labelEn: "Calling A Service Provider",
    labelVi: "Gọi nhà cung cấp dịch vụ",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner calls a phone, internet, utility, insurance, or other service provider to explain who they are, name the service, and ask for practical help.",
    aiRoleDefinition:
      "Act as a calm customer-service representative who asks for account details, repeats information clearly, and helps the learner make one clear request at a time.",
    conversationDirections: [
      "Open with the reason for the call before giving a long background story.",
      "Ask for the account number, phone number, address, or name on the account.",
      "Prompt the learner to describe the service problem in one sentence.",
      "Confirm dates, amounts, addresses, and callback details slowly.",
      "Offer a next step such as checking the account, booking a technician, or transferring the call.",
      "Practice asking for repetition when the phone audio is unclear.",
    ],
    warmthPatterns: [
      "Use short reassurance: 'I can help with that' and 'Let's check it together.'",
      "Keep the tone adult and respectful when the learner sounds unsure.",
      "Model polite persistence: clear request, calm repeat, practical next step.",
    ],
    seedInputs: ["Hi, I am calling about my internet service."],
    detectionPatterns: [
      /\b(?:calling about my|service provider|internet service|phone provider|utility company|account number|customer support|provider)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-cs-provider-article",
        label: "My account, my service",
        note: "Vietnamese often leaves out articles and possessives, so 'I call about account' can feel complete. In English service calls, 'my account' or 'my internet service' sounds clear and natural.",
      },
      {
        id: "phone-cs-provider-preposition",
        label: "Calling about, not calling for",
        note: "'Goi ve' can push learners toward 'calling for my bill.' The everyday English frame is 'I'm calling about my bill' or 'I'm calling about my service.'",
      },
    ],
    followUps: [
      { id: "phone-cs-provider-reason", question: "What service are you calling about?", salienceQuestion: "What provider handles the {slot}?" },
      { id: "phone-cs-provider-account", question: "What account detail might they ask for?", salienceQuestion: "What account detail connects to the {slot}?" },
      { id: "phone-cs-provider-problem", question: "How would you explain the problem in one sentence?", salienceQuestion: "What is happening with the {slot}?" },
      { id: "phone-cs-provider-repeat", question: "How would you ask them to repeat a detail?", salienceQuestion: "How would you ask again about the {slot}?" },
      { id: "phone-cs-provider-next", question: "How would you ask for the next step?", salienceQuestion: "What should happen next for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-customer-service-dispute-bill",
    labelEn: "Disputing A Bill",
    labelVi: "Khiếu nại hóa đơn",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner calls customer service because a bill looks wrong and they need to explain the charge, ask for a review, and request a correction or credit.",
    aiRoleDefinition:
      "Act as a billing agent who asks what charge is unclear, checks the billing period, and helps the learner phrase a firm but polite dispute.",
    conversationDirections: [
      "Ask which bill, month, or charge the learner is disputing.",
      "Prompt the learner to compare the expected amount and the actual amount.",
      "Practice saying 'I don't recognize this charge' without sounding hostile.",
      "Ask whether the learner wants a credit, refund, payment plan, or explanation.",
      "Confirm the case number, timeline, and whether payment is still due.",
      "Let the learner ask for a supervisor only after the first request is clear.",
    ],
    warmthPatterns: [
      "Validate the concern without escalating emotion: 'I understand why you want that checked.'",
      "Use calm firmness: 'Could you review this charge, please?'",
      "End with written confirmation or a case number.",
    ],
    seedInputs: ["I need to dispute a charge on my bill."],
    detectionPatterns: [
      /\b(?:dispute a charge|wrong bill|bill is wrong|billing error|overcharged|unexpected charge|refund|credit on my account)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-cs-bill-tense",
        label: "Was charged",
        note: "Learners may say 'you charge me wrong last month.' The billing phrase is often passive: 'I was charged twice' or 'I was overcharged last month.'",
      },
      {
        id: "phone-cs-bill-article",
        label: "A charge on my bill",
        note: "Vietnamese does not require 'a/the,' so 'dispute charge on bill' is a likely shortcut. In English, 'a charge on my bill' gives the agent the exact object to check.",
      },
    ],
    followUps: [
      { id: "phone-cs-bill-which", question: "Which bill or charge looks wrong?", salienceQuestion: "Which part of the {slot} looks wrong?" },
      { id: "phone-cs-bill-amount", question: "What amount did you expect, and what amount did you see?", salienceQuestion: "What amount is connected to the {slot}?" },
      { id: "phone-cs-bill-review", question: "How would you ask them to review the charge?", salienceQuestion: "How would you ask them to check the {slot}?" },
      { id: "phone-cs-bill-resolution", question: "What result do you want: explanation, credit, refund, or payment plan?", salienceQuestion: "What result do you need for the {slot}?" },
      { id: "phone-cs-bill-case", question: "How would you ask for a case number or written confirmation?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-phone-customer-service-ask-help-english",
    labelEn: "Asking For Help In English",
    labelVi: "Xin hỗ trợ khi nói tiếng Anh",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner is already on a service call and needs to ask the agent to slow down, repeat, spell a word, use simpler English, or explain one step at a time.",
    aiRoleDefinition:
      "Act as a patient support agent who normalizes clarification requests and responds with shorter, slower, practical instructions.",
    conversationDirections: [
      "Prompt the learner to state that English is not their first language if they want to.",
      "Practice asking the agent to speak more slowly.",
      "Practice asking for one step at a time instead of a long explanation.",
      "Ask the agent to spell names, addresses, confirmation codes, or technical words.",
      "Let the learner repeat back what they understood.",
      "Close by confirming the next action and asking for written follow-up if needed.",
    ],
    warmthPatterns: [
      "Normalize the request: 'Of course, I can slow down.'",
      "Avoid babying the learner; keep the language simple but adult.",
      "Praise the communication behavior, not the accent.",
    ],
    seedInputs: ["English is not my first language. Could you speak more slowly?"],
    detectionPatterns: [
      /\b(?:english is not my first language|speak more slowly|slow down|simpler english|one step at a time|could you spell|repeat that)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-cs-help-preposition",
        label: "Help with English",
        note: "'Giup toi tieng Anh' can become 'help me English.' The natural request is 'Could you help me with the English?' or simply 'Could you speak more slowly?'",
      },
      {
        id: "phone-cs-help-article",
        label: "One step at a time",
        note: "Vietnamese learners may say 'say step by step.' Customer-service English often uses 'Could you explain it one step at a time?'",
      },
    ],
    followUps: [
      { id: "phone-cs-help-slow", question: "How would you ask the agent to speak more slowly?", salienceQuestion: "How would you slow down the {slot}?" },
      { id: "phone-cs-help-repeat", question: "How would you ask them to repeat the last part?", salienceQuestion: "How would you hear the {slot} again?" },
      { id: "phone-cs-help-spell", question: "What word, name, or code would you ask them to spell?", salienceQuestion: "What part of the {slot} needs spelling?" },
      { id: "phone-cs-help-confirm", question: "How would you repeat back what you understood?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "phone-cs-help-written", question: "How would you ask for the instructions by text or email?", salienceQuestion: "How would you get the {slot} in writing?" },
    ],
  },
] as const satisfies readonly D3SpeakTopic[];
