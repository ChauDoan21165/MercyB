import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// VN-diaspora-specific service scenarios — deepened to full D4 metadata depth
// (scenarioDescription, aiRoleDefinition, conversationDirections, warmthPatterns)
// so the conversation engine has rich grounding. Plain → rich, content-additive;
// note ids and followUp ids are disjoint within each topic. Warm, low-shame;
// l1InterferenceNotes name genuine Vietnamese→English interference as context.
type DeepSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-vn-pho-less-spicy",
    labelEn: "Pho Order, Less Spicy",
    labelVi: "Gọi phở, ít cay hơn",
    category: "food",
    scenarioDescription:
      "The learner orders pho at a restaurant and adjusts the heat — less spicy or no chili — and asks for sauces or vegetables on the side, then confirms for here or to go.",
    aiRoleDefinition:
      "Act as a friendly restaurant server taking a pho order who asks about size, spice level, add-ons, and whether it is for here or to go.",
    conversationDirections: [
      "Ask what kind of pho the learner would like.",
      "Check the spice level and offer 'less spicy' or 'no chili.'",
      "Offer to put chili, sauce, or bean sprouts on the side.",
      "Confirm any extra add-ons or sizes.",
      "Ask whether it is for here or to go.",
      "Repeat the order back before finishing.",
    ],
    warmthPatterns: [
      "Keep the order exchange quick and friendly.",
      "Reassure the learner that adjusting heat is normal.",
      "Encourage 'on the side' as a reusable phrase.",
    ],
    seedInputs: ["I want to order pho, but less spicy please."],
    detectionPatterns: [
      /\b(?:pho|phở|noodle soup|less spicy|not too spicy|fish sauce|chili|bean sprouts|restaurant)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vn-pho-less-spicy-phrase",
        label: "Less spicy / not too spicy",
        note: "'Ít cay' becomes 'less spicy' or 'not too spicy' ('Can I get it not too spicy?'). 'No chili, please' works if you want none. These adjust the heat without a long sentence.",
      },
      {
        id: "vn-pho-on-the-side",
        label: "On the side",
        note: "To keep the chili, sauce, or bean sprouts separate, English uses 'on the side': 'Can I have the chili on the side?' There's no single Vietnamese word for it, so it's worth practicing.",
      },
    ],
    followUps: [
      { id: "vn-pho-bowl", question: "What kind of pho would you like to order?", salienceQuestion: "How would you order the {slot} clearly?" },
      { id: "vn-pho-spice", question: "How would you ask for it to be not too spicy?", salienceQuestion: "How would you ask for the {slot} to be less spicy?" },
      { id: "vn-pho-condiments", question: "What extra sauce or vegetables would you ask for?", salienceQuestion: "What would you add with the {slot}?" },
      { id: "vn-pho-confirm", question: "How would you confirm the order politely before paying?", salienceQuestion: "How would you confirm the {slot} politely?" },
      { id: "vn-pho-takeaway", question: "How would you ask if it is for here or to go?", salienceQuestion: "Would the {slot} be for here or to go?" },
    ],
  },
  {
    id: "topic-vn-nail-client-request",
    labelEn: "Nail Salon Client Request",
    labelVi: "Nói với khách ở tiệm nail",
    category: "service",
    scenarioDescription:
      "The learner works in a nail salon and checks with a client about nail shape, length, and color, handles a color change, explains a short wait, and confirms the client is happy.",
    aiRoleDefinition:
      "Act as a nail-salon client with preferences about shape, length, and color who answers the technician's warm check-in questions.",
    conversationDirections: [
      "Ask the client about the nail shape they want.",
      "Check whether the length is short or long enough.",
      "Handle a request for a different color.",
      "Explain a short wait warmly if needed.",
      "Confirm the client is happy before finishing.",
    ],
    warmthPatterns: [
      "Use warm check-in questions instead of a flat 'okay?'.",
      "Confirm shape and length so there are no surprises.",
      "Keep the tone caring and professional.",
    ],
    seedInputs: ["I need to ask my nail client if this shape is short enough."],
    detectionPatterns: [
      /\b(?:nail|nails|manicure|pedicure|client|customer|shape|gel color|short enough|salon)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vn-nail-checking-question",
        label: "Checking with the client",
        note: "Instead of a flat 'okay?', a warm check-in sounds more natural to an English-speaking client: 'Is this length good for you?' or 'Do you like this shape?' It invites a yes/no answer kindly.",
      },
      {
        id: "vn-nail-shape-words",
        label: "Shape words",
        note: "Clients name shapes in English: 'square,' 'round,' 'almond,' 'coffin.' Knowing these lets you confirm — 'So you'd like them square and a little shorter?' — without guessing.",
      },
    ],
    followUps: [
      { id: "vn-nail-shape", question: "How would you ask the client about the nail shape?", salienceQuestion: "How would you ask about the {slot} gently?" },
      { id: "vn-nail-length", question: "How would you check if the length is short enough?", salienceQuestion: "How would you check the {slot} length?" },
      { id: "vn-nail-color", question: "What would you say if the client wants a different color?", salienceQuestion: "What would you say about the {slot} color?" },
      { id: "vn-nail-wait", question: "How would you explain a short wait in a warm way?", salienceQuestion: "How would you explain the wait for the {slot}?" },
      { id: "vn-nail-finish", question: "How would you confirm the client is happy before finishing?", salienceQuestion: "How would you confirm the {slot} is okay?" },
    ],
  },
  {
    id: "topic-vn-landlord-zalo-leak",
    labelEn: "Landlord Message About A Leak",
    labelVi: "Nhắn chủ nhà về nước rò",
    category: "home",
    scenarioDescription:
      "The learner messages a landlord about a leaking sink, pinpointing where and when it started, offering a photo, and proposing a repair time — clear and polite without over-apologizing.",
    aiRoleDefinition:
      "Act as a landlord who reads the leak report, asks where and when it started, and arranges a repair time.",
    conversationDirections: [
      "Ask where the leak is in the apartment.",
      "Find out when the learner first noticed it.",
      "Offer to receive a photo of the leak.",
      "Agree on a repair time that works.",
      "Close the message politely and clearly.",
    ],
    warmthPatterns: [
      "Reassure the learner that reporting a leak is their right.",
      "Keep it clear and direct, not buried in apologies.",
      "Encourage pinpointing the spot: 'under the cabinet.'",
    ],
    seedInputs: ["The sink is leaking, and I need to message my landlord politely."],
    detectionPatterns: [
      /\b(?:landlord|zalo|sink|leak|leaking|water leak|repair|maintenance|apartment|rent)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vn-leak-clear-not-over-apologize",
        label: "Clear, not over-apologetic",
        note: "It's fine to be direct with a landlord — reporting a leak is your right, not an imposition. 'Hi, the sink is leaking and needs a repair' is polite enough; you don't need many 'sorry's before it.",
      },
      {
        id: "vn-leak-leaking-phrase",
        label: "It's leaking",
        note: "'Bị rò / bị dột' is 'it's leaking' / 'there's a leak.' 'The sink is leaking under the cabinet' pinpoints it. 'Water is running' sounds like a tap left on, so 'leaking' is the safer word.",
      },
    ],
    followUps: [
      { id: "vn-leak-location", question: "Where is the leak in the apartment?", salienceQuestion: "Where is the {slot} leaking?" },
      { id: "vn-leak-start", question: "When did you first notice the water?", salienceQuestion: "When did the {slot} problem start?" },
      { id: "vn-leak-photo", question: "How would you say you can send a photo?", salienceQuestion: "How would you send a photo of the {slot}?" },
      { id: "vn-leak-repair-time", question: "What repair time would be okay for you?", salienceQuestion: "What time works for the {slot} repair?" },
      { id: "vn-leak-polite-close", question: "How would you close the landlord message politely?", salienceQuestion: "How would you close the message about the {slot}?" },
    ],
  },
  {
    id: "topic-vn-remittance-bank-fee",
    labelEn: "Sending Money Home",
    labelVi: "Gửi tiền về nhà",
    category: "money",
    scenarioDescription:
      "The learner sends money to family in Vietnam and asks about the transfer fee and exchange rate up front, confirms the recipient, and asks for a receipt before sending.",
    aiRoleDefinition:
      "Act as a money-transfer or bank agent who explains the fee, the exchange rate, the recipient details needed, and provides a receipt.",
    conversationDirections: [
      "Ask how much the learner wants to send.",
      "State the transfer fee clearly.",
      "Give the current exchange rate when asked.",
      "Confirm who will receive the money.",
      "Offer a receipt before finishing.",
    ],
    warmthPatterns: [
      "Keep money talk short and matter-of-fact.",
      "Reassure the learner that asking the fee first is smart.",
      "Encourage the fixed phrase 'exchange rate.'",
    ],
    seedInputs: ["I need to ask about the fee before I send money to my family in Vietnam."],
    detectionPatterns: [
      /\b(?:send money|remittance|transfer money|family in vietnam|exchange rate|bank fee|fee|receipt)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vn-remit-exchange-rate",
        label: "Exchange rate",
        note: "'Tỷ giá' is the 'exchange rate.' 'What's the exchange rate today?' is the natural question. 'Change rate' or 'money rate' won't land — 'exchange rate' is the fixed phrase.",
      },
      {
        id: "vn-remit-transfer-fee",
        label: "Transfer fee, send money home",
        note: "'Phí chuyển tiền' is the 'transfer fee.' 'Send money home' / 'remittance' is the service. Asking 'How much is the transfer fee?' up front avoids surprises before you send.",
      },
    ],
    followUps: [
      { id: "vn-remit-amount", question: "How much money do you need to send?", salienceQuestion: "How would you talk about the {slot} amount?" },
      { id: "vn-remit-fee", question: "How would you ask about the transfer fee?", salienceQuestion: "How would you ask about the {slot} fee?" },
      { id: "vn-remit-rate", question: "How would you ask about the exchange rate?", salienceQuestion: "How would you ask about the {slot} rate?" },
      { id: "vn-remit-recipient", question: "How would you confirm who will receive the money?", salienceQuestion: "How would you confirm the {slot} recipient?" },
      { id: "vn-remit-receipt", question: "How would you ask for a receipt?", salienceQuestion: "How would you ask for a receipt for the {slot}?" },
    ],
  },
  {
    id: "topic-vn-teacher-late-pickup",
    labelEn: "Teacher Message, Late Pickup",
    labelVi: "Nhắn giáo viên khi đón con trễ",
    category: "childcare",
    scenarioDescription:
      "The learner messages a child's teacher or daycare that pickup may be late, gives the child's name, a clear reason and time, mentions a backup person, and keeps the apology light.",
    aiRoleDefinition:
      "Act as a teacher or daycare staff member who reads the late-pickup message, confirms the child, and accepts a clear plan calmly.",
    conversationDirections: [
      "Ask which child needs to be picked up.",
      "Let the learner explain why they may be late.",
      "Get an exact, updated pickup time.",
      "Check whether a backup person could come instead.",
      "Accept a light apology without needing more.",
    ],
    warmthPatterns: [
      "Reassure the learner that one short sorry is enough.",
      "Value a clear time over repeated apologies.",
      "Keep the message calm and confident.",
    ],
    seedInputs: ["I need to message my child's teacher because pickup may be late."],
    detectionPatterns: [
      /\b(?:teacher|child's teacher|pickup|pick up my son|pick up my daughter|late pickup|daycare|school)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vn-pickup-running-late",
        label: "Running late",
        note: "'Đón trễ' becomes 'I'll be a little late for pickup' or 'I'm running late.' Giving a number helps: 'I'll be about 15 minutes late.' Clear timing is kinder to the teacher than just 'sorry, late.'",
      },
      {
        id: "vn-pickup-light-apology",
        label: "A light apology is enough",
        note: "One 'Sorry for the late notice' covers it. Vietnamese politeness can pile on apologies; in an English message to a teacher, a single, warm sorry plus the plan reads as respectful and confident.",
      },
    ],
    followUps: [
      { id: "vn-pickup-child", question: "Who do you need to pick up?", salienceQuestion: "What should the teacher know about your {slot}?" },
      { id: "vn-pickup-delay", question: "How would you explain why you may be late?", salienceQuestion: "How would you explain the {slot} delay?" },
      { id: "vn-pickup-time", question: "What exact pickup time would you give?", salienceQuestion: "What pickup time would you give for the {slot}?" },
      { id: "vn-pickup-backup", question: "How would you mention a backup person if needed?", salienceQuestion: "Who could help with the {slot} pickup?" },
      { id: "vn-pickup-apology", question: "How would you apologize without sounding too heavy?", salienceQuestion: "How would you apologize about the {slot}?" },
    ],
  },
  {
    id: "topic-vn-shift-change-manager",
    labelEn: "Manager Shift Change Request",
    labelVi: "Xin đổi ca làm với quản lý",
    category: "work",
    scenarioDescription:
      "The learner asks a manager to change or swap a shift this week, states the current and wanted shift, gives a short reason, and offers a backup option like a coworker who can cover.",
    aiRoleDefinition:
      "Act as a manager who hears the shift-change request, asks for the reason and a backup plan, and decides collaboratively.",
    conversationDirections: [
      "Ask what shift the learner currently has.",
      "Find out which shift they want to change to.",
      "Invite a short, honest reason.",
      "Ask whether a coworker can swap or cover.",
      "Confirm the decision and thank them.",
    ],
    warmthPatterns: [
      "Frame the request softly: 'Would it be possible to...?'.",
      "Reassure the learner that offering a backup helps.",
      "Keep it collaborative, not a demand.",
    ],
    seedInputs: ["I need to ask my manager to change my shift this week."],
    detectionPatterns: [
      /\b(?:manager|shift|change my shift|work schedule|swap shift|day off|coworker|overtime)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vn-shift-swap-cover",
        label: "Swap / cover a shift",
        note: "'Đổi ca' is 'swap shifts' (you trade with someone) or 'cover' (someone works yours). 'Could I swap shifts with a coworker?' or 'Can someone cover my Friday?' are the natural workplace asks.",
      },
      {
        id: "vn-shift-polite-request",
        label: "Asking, not announcing",
        note: "A request frame is softer than a statement: 'Would it be possible to change my shift this week?' invites a yes. It sounds more collaborative than 'I change my shift,' while still being clear.",
      },
    ],
    followUps: [
      { id: "vn-shift-current", question: "What shift do you have now?", salienceQuestion: "What is happening with your {slot}?" },
      { id: "vn-shift-request", question: "What shift do you want to change to?", salienceQuestion: "What change do you need for the {slot}?" },
      { id: "vn-shift-reason", question: "How would you give a short reason?", salienceQuestion: "How would you explain the reason for the {slot}?" },
      { id: "vn-shift-option", question: "What backup option could you offer your manager?", salienceQuestion: "What backup option works for the {slot}?" },
      { id: "vn-shift-thanks", question: "How would you thank your manager after asking?", salienceQuestion: "How would you thank your manager about the {slot}?" },
    ],
  },
] as const satisfies readonly DeepSpeakTopic[];
