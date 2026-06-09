import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D5SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-hospitality-check-in-check-out",
    labelEn: "Hotel Check-in And Check-out",
    labelVi: "Nhận và trả phòng khách sạn",
    category: "hospitality-worker-english",
    scenarioDescription:
      "The learner works at a hotel front desk and needs to welcome guests, confirm reservations, explain deposits and IDs, issue keys, and complete check-out.",
    aiRoleDefinition:
      "Act as a hotel guest who asks about the reservation, payment, ID, room details, check-out time, receipt, and luggage storage.",
    conversationDirections: [
      "Open with a professional greeting and ask for the guest's name or reservation.",
      "Practice confirming ID, payment method, deposit, room type, and number of nights.",
      "Explain check-in time, check-out time, breakfast, Wi-Fi, parking, and key cards.",
      "Ask whether the guest needs luggage storage, late check-out, or accessibility support.",
      "Practice check-out questions about minibar, receipt, card charge, and stay feedback.",
      "End with a warm close and clear next step.",
    ],
    warmthPatterns: [
      "Use front-desk warmth that is polished, not overly personal.",
      "Repeat important details slowly: room number, time, charge, and direction.",
      "Balance friendliness with privacy around IDs and payment cards.",
    ],
    seedInputs: ["Welcome to the hotel. May I have your reservation name?"],
    detectionPatterns: [
      /\b(?:hotel check-in|hotel check in|check-out|check out|reservation name|key card|room number|late check-out|luggage storage)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hospitality-checkin-reservation-under",
        label: "Reservation under your name",
        note: "Hotel English often says 'Is the reservation under your name?' Learners may translate to 'reservation by your name,' but 'under' is the professional front-desk preposition.",
      },
      {
        id: "hospitality-checkout-receipt",
        label: "A receipt, not bill paper",
        note: "Vietnamese learners may say 'bill paper' or 'red invoice' from local habits. In hotel service English, 'receipt' and 'invoice' are the useful words to separate.",
      },
    ],
    followUps: [
      { id: "hospitality-checkin-name", question: "How would you ask for the reservation name?", salienceQuestion: "What name is on the {slot}?" },
      { id: "hospitality-checkin-id", question: "How would you ask for ID and payment politely?", salienceQuestion: "What ID or payment is needed for the {slot}?" },
      { id: "hospitality-checkin-info", question: "What hotel details should you explain?", salienceQuestion: "What details matter for the {slot}?" },
      { id: "hospitality-checkout-receipt", question: "How would you ask if they need a receipt?", salienceQuestion: "What receipt is needed for the {slot}?" },
      { id: "hospitality-checkout-close", question: "How would you close the check-out warmly?", salienceQuestion: "How would you finish the {slot}?" },
    ],
  },
  {
    id: "topic-hospitality-room-service-guest-requests",
    labelEn: "Room Service And Guest Requests",
    labelVi: "Dịch vụ phòng và yêu cầu của khách",
    category: "hospitality-worker-english",
    scenarioDescription:
      "The learner handles hotel room-service calls and guest requests for towels, cleaning, food, amenities, maintenance, wake-up calls, and delivery timing.",
    aiRoleDefinition:
      "Act as a hotel guest calling from a room with a practical request, special instruction, timing question, or complaint about a missing item.",
    conversationDirections: [
      "Ask for the room number and confirm the guest's request.",
      "Practice room-service vocabulary for towels, toiletries, housekeeping, maintenance, minibar, tray, and wake-up call.",
      "Ask about timing, allergies, special instructions, and whether staff may enter the room.",
      "Explain availability, wait time, extra charges, or menu limitations clearly.",
      "Handle a missing item or delayed order with a brief apology and action.",
      "Close by repeating what will be delivered and when.",
    ],
    warmthPatterns: [
      "Use service language that sounds helpful without promising what is impossible.",
      "Acknowledge inconvenience, then move quickly to the fix.",
      "Confirm room-entry permission clearly and respectfully.",
    ],
    seedInputs: ["Good evening, room service. How may I help you?"],
    detectionPatterns: [
      /\b(?:room service|housekeeping|extra towels|toiletries|minibar|wake-up call|maintenance|may we enter|food order)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hospitality-room-room-number",
        label: "Room number",
        note: "Vietnamese speakers may say 'number room' because noun order transfers. In hotel English, the fixed phrase is 'room number.'",
      },
      {
        id: "hospitality-room-may-enter",
        label: "May we enter?",
        note: "For privacy, hotel staff should not say only 'I come in?' A professional phrase is 'May we enter the room?' or 'Is it okay for housekeeping to enter?'",
      },
    ],
    followUps: [
      { id: "hospitality-room-number", question: "How would you ask for the room number?", salienceQuestion: "What room number connects to the {slot}?" },
      { id: "hospitality-room-request", question: "How would you confirm the guest's request?", salienceQuestion: "What is the guest asking for in the {slot}?" },
      { id: "hospitality-room-time", question: "How would you explain the wait time?", salienceQuestion: "How long will the {slot} take?" },
      { id: "hospitality-room-entry", question: "How would you ask permission to enter?", salienceQuestion: "Who may enter for the {slot}?" },
      { id: "hospitality-room-confirm", question: "How would you repeat the delivery details?", salienceQuestion: "What details should you confirm for the {slot}?" },
    ],
  },
  {
    id: "topic-hospitality-complaints-directions",
    labelEn: "Guest Complaints And Directions",
    labelVi: "Xử lý phàn nàn và chỉ đường",
    category: "hospitality-worker-english",
    scenarioDescription:
      "The learner works with hotel guests who complain about noise, cleanliness, room problems, or billing, and also asks for directions inside the hotel or nearby area.",
    aiRoleDefinition:
      "Act as a hotel guest who is frustrated about a problem or needs clear directions to hotel facilities, transit, restaurants, parking, or nearby attractions.",
    conversationDirections: [
      "Prompt the learner to acknowledge the complaint before asking details.",
      "Practice complaint vocabulary for noise, dirty room, broken AC, missing item, wrong charge, or slow service.",
      "Ask for room number, timing, and what resolution the guest wants.",
      "Offer realistic next steps such as sending maintenance, changing rooms, refund review, or manager follow-up.",
      "Practice giving directions using lobby, elevator, hallway, front desk, parking garage, and nearby landmarks.",
      "End by confirming the action taken or the route the guest should follow.",
    ],
    warmthPatterns: [
      "Lead with empathy and ownership: 'I'm sorry about that. Let me help.'",
      "Avoid arguing about the guest's feeling; clarify facts calmly.",
      "Give directions in short steps and check if the guest understood.",
    ],
    seedInputs: ["I am sorry about the noise. Let me check what we can do."],
    detectionPatterns: [
      /\b(?:guest complaint|noise complaint|dirty room|broken ac|wrong charge|give directions|front desk|elevator|parking garage|nearby restaurant)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hospitality-complaint-apology",
        label: "Sorry about, not sorry for everything",
        note: "Vietnamese service speech may use a broad apology. In English hospitality, 'I'm sorry about the noise' names the issue and sounds more specific than 'sorry for everything.'",
      },
      {
        id: "hospitality-directions-take-elevator",
        label: "Take the elevator",
        note: "Directions use fixed verbs: 'take the elevator,' 'go down the hallway,' and 'turn left at the lobby.' Learners may say 'go elevator' from Vietnamese word order.",
      },
    ],
    followUps: [
      { id: "hospitality-complaint-issue", question: "How would you acknowledge the guest's problem?", salienceQuestion: "How would you acknowledge the {slot}?" },
      { id: "hospitality-complaint-detail", question: "What details do you need before fixing it?", salienceQuestion: "What details matter for the {slot}?" },
      { id: "hospitality-complaint-resolution", question: "What solution can you offer?", salienceQuestion: "What solution fits the {slot}?" },
      { id: "hospitality-directions-route", question: "How would you give directions in two short steps?", salienceQuestion: "How would you direct someone to the {slot}?" },
      { id: "hospitality-followup", question: "How would you confirm the guest is helped?", salienceQuestion: "How would you follow up on the {slot}?" },
    ],
  },
] as const satisfies readonly D5SpeakTopic[];
