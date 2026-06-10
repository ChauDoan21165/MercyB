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
  {
    id: "topic-banking-deposit-withdraw",
    labelEn: "Depositing Or Withdrawing Cash",
    labelVi: "Gửi hoặc rút tiền mặt",
    category: "banking",
    scenarioDescription:
      "The learner visits a teller or ATM to deposit cash, withdraw money, say an amount clearly, and confirm the receipt or account balance.",
    aiRoleDefinition:
      "Act as a bank teller who confirms whether the learner wants to deposit or withdraw, checks the account and amount, and repeats the transaction details simply.",
    conversationDirections: [
      "Ask whether the learner wants to deposit cash, withdraw cash, or use the ATM.",
      "Prompt the learner to say the exact dollar amount slowly.",
      "Practice identifying which account the money should come from or go into.",
      "Ask whether the learner wants large bills, small bills, or a receipt.",
      "Confirm the new balance and any withdrawal limits.",
      "End by repeating the amount, account, and receipt choice.",
    ],
    warmthPatterns: [
      "Keep the exchange calm and routine around handling cash.",
      "Repeat numbers slowly when the learner asks.",
      "Use clear teller language without judging pronunciation or math slips.",
    ],
    seedInputs: ["I want to withdraw one hundred dollars, please."],
    detectionPatterns: [
      /\b(?:deposit|withdraw|take out (?:cash|money)|put money (?:in|into)|cash out|atm|one hundred dollars)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "banking-cash-amount-plural",
        label: "One hundred dollars",
        note: "Vietnamese numbers do not force a plural noun, so learners may say 'one hundred dollar.' Bank English keeps the amount plural: 'one hundred dollars.'",
      },
      {
        id: "banking-deposit-withdraw-pair",
        label: "Deposit vs withdraw",
        note: "'Gửi tiền' maps to 'deposit' and 'rút tiền' maps to 'withdraw.' Practicing the pair helps avoid mixing up money going in and money coming out.",
      },
    ],
    followUps: [
      { id: "banking-cash-action", question: "Do you want to put money in or take money out?", salienceQuestion: "What do you need to do with the {slot}?" },
      { id: "banking-cash-amount", question: "How much would you say to the teller?", salienceQuestion: "How would you say the {slot} clearly?" },
      { id: "banking-cash-account", question: "Which account should the money use?", salienceQuestion: "Which account connects to the {slot}?" },
      { id: "banking-cash-receipt", question: "How would you ask for a receipt?", salienceQuestion: "What receipt do you need for the {slot}?" },
      { id: "banking-cash-confirm", question: "How would you check that the amount is right?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-banking-bills",
    labelEn: "Paying A Bill",
    labelVi: "Thanh toán hóa đơn",
    category: "banking",
    scenarioDescription:
      "The learner pays a utility, phone, or credit card bill and needs to ask about the amount due, due date, payment method, and confirmation number.",
    aiRoleDefinition:
      "Act as a customer-service billing agent who helps the learner identify the bill, choose a payment method, and confirm that the payment went through.",
    conversationDirections: [
      "Ask which bill the learner wants to pay and whether it is due today.",
      "Prompt the learner to say the bill amount and account number safely.",
      "Practice choosing online payment, mail, phone, or in-person payment.",
      "Ask whether there are fees for using a card or paying late.",
      "Confirm the payment date, confirmation number, and remaining balance.",
      "End by helping the learner save or repeat the proof of payment.",
    ],
    warmthPatterns: [
      "Keep the tone steady around money pressure and due dates.",
      "Use practical confirmation language after every payment step.",
      "Avoid blame if the learner is late or confused by the bill.",
    ],
    seedInputs: ["I need to pay my electricity bill today."],
    detectionPatterns: [
      /\b(?:pay (?:my |the |a )?bill|electric(?:ity)? bill|water bill|phone bill|make a payment|payment went through|confirmation number)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "banking-pay-bill-article",
        label: "Pay the bill",
        note: "Vietnamese often drops articles, so 'I pay bill today' is a natural slip. Everyday billing English is 'pay the bill' or 'pay my bill.'",
      },
      {
        id: "banking-pay-by-in-online",
        label: "Pay online or in person",
        note: "English uses set phrases like 'pay online,' 'pay by mail,' and 'pay in person.' These small prepositions do not map one-to-one from Vietnamese.",
      },
      {
        id: "banking-pay-past-time-word",
        label: "Yesterday I paid",
        note: "A Vietnamese time word can carry the past by itself. In English, the verb changes too: 'Yesterday I paid the bill.'",
      },
    ],
    followUps: [
      { id: "banking-pay-which-bill", question: "Which bill are you paying?", salienceQuestion: "Which bill is the {slot}?" },
      { id: "banking-pay-how", question: "Will you pay online, by mail, by phone, or in person?", salienceQuestion: "How would you pay the {slot}?" },
      { id: "banking-pay-amount", question: "How much is due this time?", salienceQuestion: "How much is the {slot}?" },
      { id: "banking-pay-fee", question: "How would you ask if there is a payment fee?", salienceQuestion: "What fee might apply to the {slot}?" },
      { id: "banking-pay-confirm", question: "How would you make sure the payment went through?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-banking-autopay",
    labelEn: "Setting Up Autopay",
    labelVi: "Cài đặt thanh toán tự động",
    category: "banking",
    scenarioDescription:
      "The learner asks to set up automatic payments for recurring bills and checks the date, source account, amount, and how to stop or change it later.",
    aiRoleDefinition:
      "Act as a billing representative who explains autopay setup in plain English, confirms consent, and makes sure the learner understands future payment dates.",
    conversationDirections: [
      "Ask which bill or account the learner wants to put on autopay.",
      "Prompt the learner to choose the payment source and monthly date.",
      "Practice asking whether the amount is fixed or can change each month.",
      "Explain how the learner can cancel, pause, or update autopay later.",
      "Confirm alerts, receipts, and what happens if there is not enough money.",
      "End by repeating the first payment date and source account.",
    ],
    warmthPatterns: [
      "Make consent explicit before automatic payments begin.",
      "Use plain words before terms like recurring or automatic debit.",
      "Encourage the learner to ask how to stop autopay without embarrassment.",
    ],
    seedInputs: ["I want to set up autopay for my bills."],
    detectionPatterns: [
      /\b(?:autopay|auto pay|automatic payment|recurring payment|pay automatically|automatic bill pay|set up autopay)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "banking-autopay-set-up",
        label: "Set up autopay",
        note: "Vietnamese may use one verb like 'cài đặt.' In English the smooth phrase is 'I want to set up autopay,' with 'to' before 'set up.'",
      },
      {
        id: "banking-autopay-plural-bills",
        label: "All my bills",
        note: "Vietnamese nouns do not change for plural meaning, so 'autopay for my bill' may mean several bills. English adds -s for 'my bills.'",
      },
    ],
    followUps: [
      { id: "banking-autopay-which", question: "Which bills do you want on autopay?", salienceQuestion: "Which bill is the {slot}?" },
      { id: "banking-autopay-account", question: "Which account should the money come from?", salienceQuestion: "Which account pays the {slot}?" },
      { id: "banking-autopay-date", question: "What day each month would work for you?", salienceQuestion: "When should the {slot} happen?" },
      { id: "banking-autopay-alert", question: "How would you ask for a reminder or receipt?", salienceQuestion: "What notice do you need for the {slot}?" },
      { id: "banking-autopay-stop", question: "How would you ask to change or stop it later?", salienceQuestion: "How would you change the {slot}?" },
    ],
  },
  {
    id: "topic-banking-card-declined",
    labelEn: "When A Card Is Declined",
    labelVi: "Khi thẻ bị từ chối",
    category: "banking",
    scenarioDescription:
      "The learner contacts the bank after a debit or credit card is declined and needs to explain where it happened, ask why, and choose the next payment step.",
    aiRoleDefinition:
      "Act as a bank support representative who checks common card-decline reasons, protects private information, and helps the learner decide what to do next.",
    conversationDirections: [
      "Ask where and when the card was declined.",
      "Prompt the learner to say whether the card was debit, credit, online, or in store.",
      "Practice asking about insufficient funds, holds, card locks, travel blocks, and expired cards.",
      "Remind the learner not to share the PIN or full password.",
      "Ask whether the learner needs a temporary unlock, new card, or alternate payment.",
      "Confirm the next step and when the card should work again.",
    ],
    warmthPatterns: [
      "Treat a declined card as a normal support issue, not a personal failure.",
      "Offer simple options before formal banking terms.",
      "Keep security reminders calm and specific.",
    ],
    seedInputs: ["My card was declined at the store."],
    detectionPatterns: [
      /\b(?:card (?:was |got )?declined|declined card|insufficient funds|not enough funds|card (?:did not|didn't|won't) work|payment failed)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "banking-declined-passive-past",
        label: "My card was declined",
        note: "English often uses a past passive phrase: 'My card was declined.' Vietnamese learners may say 'my card decline,' which is understandable but less standard.",
      },
      {
        id: "banking-declined-not-enough",
        label: "Insufficient funds",
        note: "The formal phrase 'insufficient funds' simply means 'not enough money.' It is fine to start with the plain phrase when talking to the bank.",
      },
    ],
    followUps: [
      { id: "banking-declined-where", question: "Where did the card stop working?", salienceQuestion: "Where did the {slot} happen?" },
      { id: "banking-declined-card", question: "Was it a debit card, credit card, online payment, or store payment?", salienceQuestion: "What card was used for the {slot}?" },
      { id: "banking-declined-why", question: "How would you ask why it was declined?", salienceQuestion: "Why might the {slot} happen?" },
      { id: "banking-declined-security", question: "What private information should you not share?", salienceQuestion: "What should stay private about the {slot}?" },
      { id: "banking-declined-next", question: "What would you do to pay another way?", salienceQuestion: "How would you handle the {slot}?" },
    ],
  },
  {
    id: "topic-banking-transfer-money",
    labelEn: "Transferring Or Sending Money",
    labelVi: "Chuyển hoặc gửi tiền",
    category: "banking",
    scenarioDescription:
      "The learner sends money to another person or account and needs to ask about recipient details, fees, exchange rates, timing, and confirmation.",
    aiRoleDefinition:
      "Act as a bank or remittance representative who asks for safe transfer details, explains fees and timing clearly, and confirms the receipt or tracking number.",
    conversationDirections: [
      "Ask who the learner is sending money to and whether it is domestic or international.",
      "Prompt the learner to say the amount, currency, and recipient information carefully.",
      "Practice asking about fees, exchange rates, limits, and delivery time.",
      "Ask whether the learner wants a bank transfer, wire, app transfer, or remittance service.",
      "Confirm what information should be checked before sending.",
      "End by repeating the confirmation number and expected arrival time.",
    ],
    warmthPatterns: [
      "Stay careful and unhurried when names, amounts, and account details matter.",
      "Explain transfer fees without pressure.",
      "Encourage the learner to repeat details before money is sent.",
    ],
    seedInputs: ["I want to transfer money to my family."],
    detectionPatterns: [
      /\b(?:transfer (?:money|funds)|send money|wire transfer|move money|remittance|exchange rate|confirmation number)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "banking-transfer-send-vs-transfer",
        label: "Send vs transfer",
        note: "Vietnamese 'gửi tiền' can cover both 'send money' and 'transfer money.' Banks often say 'transfer' between accounts and 'send' to a person.",
      },
      {
        id: "banking-transfer-to-someone",
        label: "Transfer to my family",
        note: "English uses 'to' for the receiver: 'transfer money to my brother.' Vietnamese word order can make 'transfer my brother money' feel natural.",
      },
      {
        id: "banking-transfer-amount-plural",
        label: "Five hundred dollars",
        note: "Amounts above one usually take plural dollars in English. Vietnamese numbers do not force noun changes, so dropping the -s is common and understandable.",
      },
    ],
    followUps: [
      { id: "banking-transfer-who", question: "Who are you sending money to?", salienceQuestion: "Who receives the {slot}?" },
      { id: "banking-transfer-amount", question: "How much do you want to transfer?", salienceQuestion: "How would you say the {slot}?" },
      { id: "banking-transfer-fee", question: "How would you ask about the fee or exchange rate?", salienceQuestion: "What fee applies to the {slot}?" },
      { id: "banking-transfer-how", question: "Will you use the app, the bank, or a money-transfer service?", salienceQuestion: "How would you send the {slot}?" },
      { id: "banking-transfer-confirm", question: "How would you make sure it arrived?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-banking-late-fee",
    labelEn: "Asking About A Late Fee Or Due Date",
    labelVi: "Hỏi về phí trễ hạn hoặc ngày đến hạn",
    category: "banking",
    scenarioDescription:
      "The learner asks about a bill due date, late fee, missed payment, or possible fee removal and needs polite language for a stressful money conversation.",
    aiRoleDefinition:
      "Act as a billing representative who explains due dates and late fees, listens to the learner's situation, and gives clear options for payment or fee review.",
    conversationDirections: [
      "Ask which bill, card, or account has the due date or late fee.",
      "Prompt the learner to say when they paid or when they can pay.",
      "Practice asking how much the late fee is and why it was charged.",
      "Let the learner ask politely whether the fee can be removed or waived.",
      "Confirm the new due date, payment plan, or one-time courtesy adjustment.",
      "End by repeating what the learner should do before the next due date.",
    ],
    warmthPatterns: [
      "Use non-shaming language around missed payments.",
      "Keep fee-removal requests polite but direct.",
      "Give the learner exact next steps instead of vague warnings.",
    ],
    seedInputs: ["When is the due date for this bill?"],
    detectionPatterns: [
      /\b(?:late fee|due date|past due|overdue|missed (?:the )?(?:payment|due date)|waive the fee|remove the fee|when is (?:it|the bill) due)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "banking-late-due-date-article",
        label: "The due date",
        note: "English usually says 'the due date.' Vietnamese drops articles, so 'when is due date?' is understandable but less natural.",
      },
      {
        id: "banking-late-paid-past",
        label: "Last week I paid",
        note: "When a past time is named, English also changes the verb: 'Last week I paid late.' Vietnamese can leave the verb unchanged because the time word carries the past.",
      },
      {
        id: "banking-late-fee-waive",
        label: "Waive the late fee",
        note: "'Waive the fee' means remove or cancel it. The plain request 'Can you remove the late fee?' is also clear and respectful.",
      },
    ],
    followUps: [
      { id: "banking-late-when", question: "When is the bill due?", salienceQuestion: "When is the {slot}?" },
      { id: "banking-late-fee-amount", question: "How much is the late fee?", salienceQuestion: "How much is the {slot}?" },
      { id: "banking-late-explain", question: "How would you explain why it was late?", salienceQuestion: "How would you explain the {slot}?" },
      { id: "banking-late-ask-waive", question: "How would you ask them to remove the fee?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "banking-late-next", question: "How would you confirm the next due date?", salienceQuestion: "What is next for the {slot}?" },
    ],
  },
] as const satisfies readonly D3SpeakTopic[];
