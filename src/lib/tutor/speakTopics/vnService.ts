import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-vn-pho-less-spicy",
    labelEn: "Pho Order, Less Spicy",
    labelVi: "Gọi phở, ít cay hơn",
    category: "food",
    seedInputs: ["I want to order pho, but less spicy please."],
    detectionPatterns: [
      /\b(?:pho|phở|noodle soup|less spicy|not too spicy|fish sauce|chili|bean sprouts|restaurant)\b/i,
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
    seedInputs: ["I need to ask my nail client if this shape is short enough."],
    detectionPatterns: [
      /\b(?:nail|nails|manicure|pedicure|client|customer|shape|gel color|short enough|salon)\b/i,
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
    seedInputs: ["The sink is leaking, and I need to message my landlord politely."],
    detectionPatterns: [
      /\b(?:landlord|zalo|sink|leak|leaking|water leak|repair|maintenance|apartment|rent)\b/i,
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
    seedInputs: ["I need to ask about the fee before I send money to my family in Vietnam."],
    detectionPatterns: [
      /\b(?:send money|remittance|transfer money|family in vietnam|exchange rate|bank fee|fee|receipt)\b/i,
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
    seedInputs: ["I need to message my child's teacher because pickup may be late."],
    detectionPatterns: [
      /\b(?:teacher|child's teacher|pickup|pick up my son|pick up my daughter|late pickup|daycare|school)\b/i,
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
    seedInputs: ["I need to ask my manager to change my shift this week."],
    detectionPatterns: [
      /\b(?:manager|shift|change my shift|work schedule|swap shift|day off|coworker|overtime)\b/i,
    ],
    followUps: [
      { id: "vn-shift-current", question: "What shift do you have now?", salienceQuestion: "What is happening with your {slot}?" },
      { id: "vn-shift-request", question: "What shift do you want to change to?", salienceQuestion: "What change do you need for the {slot}?" },
      { id: "vn-shift-reason", question: "How would you give a short reason?", salienceQuestion: "How would you explain the reason for the {slot}?" },
      { id: "vn-shift-option", question: "What backup option could you offer your manager?", salienceQuestion: "What backup option works for the {slot}?" },
      { id: "vn-shift-thanks", question: "How would you thank your manager after asking?", salienceQuestion: "How would you thank your manager about the {slot}?" },
    ],
  },
] as const;
