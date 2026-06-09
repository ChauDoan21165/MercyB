import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D3SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-banking-opening-account",
    labelEn: "Opening A Bank Account",
    labelVi: "Mở tài khoản ngân hàng",
    category: "banking",
    scenarioDescription:
      "The learner visits or calls a bank to open an account, ask what documents are needed, and understand basic account fees and card setup.",
    aiRoleDefinition:
      "Act as a bank teller who asks identity and address questions, explains account options simply, and confirms what the learner needs to bring or sign.",
    conversationDirections: [
      "Ask whether the learner needs a chequing account, savings account, debit card, or online banking.",
      "Prompt the learner to ask what ID and proof of address are required.",
      "Practice explaining current address, phone number, and employment status.",
      "Ask about monthly fees, minimum balance, and debit card limits.",
      "Confirm how online banking and the debit card will be activated.",
      "End by repeating the documents, appointment time, or next step.",
    ],
    warmthPatterns: [
      "Use respectful clarity: 'Let me explain the options briefly.'",
      "Keep questions practical and privacy-aware.",
      "Offer repetition for forms, fees, and required documents.",
    ],
    seedInputs: ["I would like to open a bank account."],
    detectionPatterns: [
      /\b(?:open a bank account|new bank account|chequing account|checking account|savings account|debit card|online banking|proof of address)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "banking-open-article",
        label: "Open a bank account",
        note: "Vietnamese learners may drop 'a' and say 'open bank account.' The natural bank-counter phrase is 'I'd like to open a bank account.'",
      },
      {
        id: "banking-open-preposition",
        label: "Proof of address",
        note: "'Giay to dia chi' can become 'proof for address.' In bank English, the fixed phrase is 'proof of address.'",
      },
    ],
    followUps: [
      { id: "banking-open-type", question: "What type of account do you need?", salienceQuestion: "Which account fits the {slot}?" },
      { id: "banking-open-docs", question: "How would you ask what documents to bring?", salienceQuestion: "What document do you need for the {slot}?" },
      { id: "banking-open-fees", question: "How would you ask about monthly fees?", salienceQuestion: "What fee matters for the {slot}?" },
      { id: "banking-open-card", question: "How would you ask about getting a debit card?", salienceQuestion: "How would you use a card for the {slot}?" },
      { id: "banking-open-confirm", question: "How would you confirm the next step?", salienceQuestion: "What happens next with the {slot}?" },
    ],
  },
  {
    id: "topic-banking-explaining-transaction",
    labelEn: "Explaining A Transaction",
    labelVi: "Giải thích một giao dịch",
    category: "banking",
    scenarioDescription:
      "The learner contacts the bank because they do not recognize a transaction, need to explain a transfer or deposit, or want help reading account activity.",
    aiRoleDefinition:
      "Act as a bank representative who asks for the date, amount, merchant, and account, then guides the learner to explain what happened without sharing private PINs or passwords.",
    conversationDirections: [
      "Ask the learner to identify the date and amount first.",
      "Prompt the learner to say whether they recognize the merchant or transfer.",
      "Practice explaining a deposit, withdrawal, transfer, fee, hold, or pending transaction.",
      "Remind the learner not to say their PIN or online banking password.",
      "Ask whether the learner wants information, a dispute, or fraud protection.",
      "Confirm the case number, card status, and timeline for follow-up.",
    ],
    warmthPatterns: [
      "Stay calm around money stress: 'Let's look at the transaction step by step.'",
      "Protect privacy with clear boundaries.",
      "Use practical next-step language instead of blame.",
    ],
    seedInputs: ["I do not recognize this transaction on my account."],
    detectionPatterns: [
      /\b(?:do not recognize this transaction|don't recognize this transaction|unknown transaction|bank transaction|pending transaction|money transfer|deposit|withdrawal|merchant)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "banking-transaction-tense",
        label: "I did not make this transaction",
        note: "For past account activity, learners may say 'I don't make this transaction yesterday.' The clear bank phrase is 'I did not make this transaction' or 'I don't recognize this transaction.'",
      },
      {
        id: "banking-transaction-preposition",
        label: "On my account",
        note: "'Trong tai khoan' can lead to 'in my account' for everything. For statement activity, 'a transaction on my account' is the natural collocation.",
      },
    ],
    followUps: [
      { id: "banking-transaction-date", question: "What date and amount would you give first?", salienceQuestion: "What date and amount are on the {slot}?" },
      { id: "banking-transaction-merchant", question: "Do you recognize the merchant or person?", salienceQuestion: "Who is connected to the {slot}?" },
      { id: "banking-transaction-explain", question: "How would you explain what you think happened?", salienceQuestion: "What happened with the {slot}?" },
      { id: "banking-transaction-security", question: "What private information should you not share?", salienceQuestion: "What should stay private about the {slot}?" },
      { id: "banking-transaction-next", question: "How would you ask what the bank will do next?", salienceQuestion: "What next step do you need for the {slot}?" },
    ],
  },
  {
    id: "topic-banking-loan-questions",
    labelEn: "Asking Loan Questions",
    labelVi: "Hỏi về khoản vay",
    category: "banking",
    scenarioDescription:
      "The learner asks a bank about a personal, car, small-business, or mortgage loan and needs to understand eligibility, interest, payments, and documents.",
    aiRoleDefinition:
      "Act as a loan officer who explains loan terms in plain English, asks financial questions carefully, and helps the learner ask before signing anything.",
    conversationDirections: [
      "Ask what type of loan the learner wants and why.",
      "Prompt questions about interest rate, monthly payment, loan term, and total cost.",
      "Ask what income, employment, credit history, and documents may be needed.",
      "Practice asking what happens if a payment is late.",
      "Let the learner ask whether there is a penalty for paying early.",
      "End by asking for a written summary before making a decision.",
    ],
    warmthPatterns: [
      "Keep the tone careful and non-pushy around borrowing money.",
      "Use plain-language explanations before technical terms.",
      "Encourage written confirmation for rates, fees, and payment dates.",
    ],
    seedInputs: ["I have some questions about getting a loan."],
    detectionPatterns: [
      /\b(?:loan questions|get a loan|personal loan|car loan|mortgage|interest rate|monthly payment|loan term|credit history|pay it back)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "banking-loan-preposition",
        label: "Questions about a loan",
        note: "'Hoi ve khoan vay' maps to 'questions about a loan.' Learners may say 'questions for loan,' but bank staff expect 'about a loan.'",
      },
      {
        id: "banking-loan-tense",
        label: "If I miss a payment",
        note: "Vietnamese conditionals do not mark tense the same way, so learners may say 'if I missed payment next month.' A natural future-risk question is 'What happens if I miss a payment?'",
      },
    ],
    followUps: [
      { id: "banking-loan-type", question: "What type of loan are you asking about?", salienceQuestion: "What kind of loan fits the {slot}?" },
      { id: "banking-loan-rate", question: "How would you ask about the interest rate?", salienceQuestion: "What rate applies to the {slot}?" },
      { id: "banking-loan-payment", question: "How would you ask about the monthly payment?", salienceQuestion: "How much would the {slot} cost each month?" },
      { id: "banking-loan-docs", question: "What documents or income proof might they need?", salienceQuestion: "What proof do you need for the {slot}?" },
      { id: "banking-loan-summary", question: "How would you ask for the loan details in writing?", salienceQuestion: "How would you review the {slot} later?" },
    ],
  },
] as const satisfies readonly D3SpeakTopic[];
