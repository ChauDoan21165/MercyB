import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Phone call theme. Deterministic / client-side; copy is warm and low-shame.
// A9 batch-2 deepening: each topic carries 3 L1 interference notes and 6
// conversation directions (followUps) within the existing schema.
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-phone-call-making-appointment",
    labelEn: "Calling To Make An Appointment",
    labelVi: "Gọi điện đặt lịch hẹn",
    category: "phone-call",
    seedInputs: ["Hi, I would like to make an appointment."],
    detectionPatterns: [
      /\b(?:make an appointment|book an appointment|call to book|schedule an appointment|available time)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-appointment-open",
        label: "Clear opening sentence",
        note: "Vietnamese callers may start with background first. In English phone calls, saying the reason early helps: 'I'd like to make an appointment.'",
      },
      {
        id: "phone-appointment-repeat",
        label: "Repeat details back",
        note: "Phone audio is easy to miss. Repeating the date, time, and name back is normal, not awkward.",
      },
      {
        id: "phone-appointment-first-time",
        label: "First visit or returning",
        note: "Offices often ask 'Are you a new patient?' or 'Have you been here before?' A short 'It's my first time' answers it and moves the call along.",
      },
    ],
    followUps: [
      { id: "phone-appointment-service", question: "What appointment do you need?", salienceQuestion: "What kind of appointment is the {slot}?" },
      { id: "phone-appointment-time", question: "What day or time would you ask for?", salienceQuestion: "What time works for the {slot}?" },
      { id: "phone-appointment-name", question: "How would you give your name and phone number?", salienceQuestion: "How would you give details for the {slot}?" },
      { id: "phone-appointment-confirm", question: "How would you repeat the appointment back?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "phone-appointment-new", question: "How would you say it is your first visit?", salienceQuestion: "How would you say the {slot} is your first?" },
      { id: "phone-appointment-reminder", question: "How would you ask for a reminder text?", salienceQuestion: "How would you get a reminder for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-call-asking-speak-person",
    labelEn: "Asking To Speak To Someone",
    labelVi: "Xin gặp một người qua điện thoại",
    category: "phone-call",
    seedInputs: ["May I speak with Ms. Lee, please?"],
    detectionPatterns: [
      /\b(?:may i speak|can i speak|speak with|speak to|is .* available|transfer me)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-speak-with",
        label: "Speak with or speak to",
        note: "A natural phone request is 'May I speak with...' or 'Can I speak to...'. Both are useful and polite.",
      },
      {
        id: "phone-person-unavailable",
        label: "Ready for not available",
        note: "Learners often prepare only the first sentence. Phone calls go better when you can answer, 'Can I leave a message?'",
      },
      {
        id: "phone-speak-whos-calling",
        label: "Who's calling?",
        note: "The other side often asks 'Who's calling?' or 'May I ask who's calling?' A simple 'This is Linh' is the expected answer — it's not a personal question.",
      },
    ],
    followUps: [
      { id: "phone-speak-name", question: "Who do you want to speak with?", salienceQuestion: "Who do you need for the {slot}?" },
      { id: "phone-speak-reason", question: "What short reason would you give?", salienceQuestion: "Why are you calling about the {slot}?" },
      { id: "phone-speak-message", question: "How would you ask to leave a message?", salienceQuestion: "What message would you leave about the {slot}?" },
      { id: "phone-speak-callback", question: "How would you ask for a call back?", salienceQuestion: "How would you ask for a call back about the {slot}?" },
      { id: "phone-speak-whois", question: "How would you answer 'Who's calling?'", salienceQuestion: "How would you say who you are for the {slot}?" },
      { id: "phone-speak-hold", question: "How would you respond if they ask you to hold?", salienceQuestion: "How would you wait on hold for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-call-leaving-message",
    labelEn: "Leaving A Voicemail",
    labelVi: "Để lại tin nhắn thoại",
    category: "phone-call",
    seedInputs: ["Hi, this is Linh. Please call me back when you can."],
    detectionPatterns: [
      /\b(?:voicemail|leave a message|call me back|after the beep|missed your call|this is)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-voicemail-order",
        label: "Name, reason, number",
        note: "A useful voicemail order is name, reason, phone number. It keeps the message short and easy to replay.",
      },
      {
        id: "phone-voicemail-not-too-fast",
        label: "Slow down for numbers",
        note: "Many learners rush through phone numbers. Saying the number slowly is helpful, especially with a Vietnamese accent.",
      },
      {
        id: "phone-voicemail-best-time",
        label: "Best time to reach you",
        note: "Adding 'You can reach me after five' helps them call back when you can answer — a small detail that saves phone tag.",
      },
    ],
    followUps: [
      { id: "phone-message-name", question: "How would you say your name first?", salienceQuestion: "How would you start the message about the {slot}?" },
      { id: "phone-message-reason", question: "What is the main reason for your call?", salienceQuestion: "What is the reason for the {slot}?" },
      { id: "phone-message-number", question: "How would you say your callback number slowly?", salienceQuestion: "What number should they use for the {slot}?" },
      { id: "phone-message-close", question: "How would you close the voicemail?", salienceQuestion: "How would you close the message about the {slot}?" },
      { id: "phone-message-besttime", question: "How would you say the best time to reach you?", salienceQuestion: "When could they call you back about the {slot}?" },
      { id: "phone-message-spell", question: "How would you spell your name if it is hard to hear?", salienceQuestion: "How would you spell your name for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-call-wrong-number",
    labelEn: "Handling A Wrong Number",
    labelVi: "Khi gọi nhầm số",
    category: "phone-call",
    seedInputs: ["Sorry, I think I have the wrong number."],
    detectionPatterns: [
      /\b(?:wrong number|called the wrong|is this the right number|sorry wrong|mistake number)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-wrong-number-simple",
        label: "Short and polite",
        note: "A wrong-number call does not need a long apology. 'Sorry, I have the wrong number' is enough.",
      },
      {
        id: "phone-wrong-number-check",
        label: "Check one detail if needed",
        note: "If you are not sure, ask 'Is this the number for...?' before ending the call.",
      },
      {
        id: "phone-wrong-no-fault",
        label: "It happens to everyone",
        note: "A wrong number isn't a language mistake. A light 'Sorry to bother you' and hanging up is completely normal — no need to over-explain.",
      },
    ],
    followUps: [
      { id: "phone-wrong-check", question: "How would you check if you reached the right place?", salienceQuestion: "How would you check the {slot}?" },
      { id: "phone-wrong-apology", question: "How would you apologize briefly?", salienceQuestion: "How would you apologize for the {slot}?" },
      { id: "phone-wrong-confirm", question: "What number or business were you trying to reach?", salienceQuestion: "What were you trying to reach for the {slot}?" },
      { id: "phone-wrong-end", question: "How would you end the call politely?", salienceQuestion: "How would you end the call about the {slot}?" },
      { id: "phone-wrong-recheck", question: "How would you ask them to confirm their number?", salienceQuestion: "How would you double-check the {slot}?" },
      { id: "phone-wrong-redial", question: "How would you say you will redial carefully?", salienceQuestion: "How would you try the {slot} again?" },
    ],
  },
  {
    id: "topic-phone-call-bad-connection",
    labelEn: "When The Connection Is Bad",
    labelVi: "Khi nghe điện thoại không rõ",
    category: "phone-call",
    seedInputs: ["Sorry, the connection is bad. Could you say that again?"],
    detectionPatterns: [
      /\b(?:bad connection|cannot hear|can't hear|say that again|breaking up|phone is cutting out|not clear)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-connection-ask-again",
        label: "Ask again calmly",
        note: "It is normal to ask someone to repeat on the phone. This is not a language failure; phone audio is hard for everyone.",
      },
      {
        id: "phone-connection-specific",
        label: "Say what is wrong",
        note: "'The line is breaking up' or 'I can't hear you clearly' gives the other person a reason to slow down or repeat.",
      },
      {
        id: "phone-connection-move-note",
        label: "Move to better signal",
        note: "'Let me move to a better spot' or 'Can I call you right back?' is a natural way to fix a bad signal without ending things awkwardly.",
      },
    ],
    followUps: [
      { id: "phone-connection-problem", question: "How would you say the connection is bad?", salienceQuestion: "What is hard about the {slot}?" },
      { id: "phone-connection-repeat", question: "How would you ask them to repeat?", salienceQuestion: "How would you ask again about the {slot}?" },
      { id: "phone-connection-slow", question: "How would you ask them to speak more slowly?", salienceQuestion: "How would you slow down the {slot}?" },
      { id: "phone-connection-callback", question: "How would you suggest calling back?", salienceQuestion: "How would you restart the {slot}?" },
      { id: "phone-connection-move", question: "How would you say you will move to better signal?", salienceQuestion: "How would you fix the signal for the {slot}?" },
      { id: "phone-connection-louder", question: "How would you ask them to speak louder?", salienceQuestion: "How would you hear the {slot} better?" },
    ],
  },
  {
    id: "topic-phone-call-confirming-details",
    labelEn: "Confirming Details On The Phone",
    labelVi: "Xác nhận thông tin qua điện thoại",
    category: "phone-call",
    seedInputs: ["Can I confirm the address and time?"],
    detectionPatterns: [
      /\b(?:confirm the details|confirm the address|confirm the time|spell that|repeat that|make sure)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-confirm-make-sure",
        label: "Make sure phrase",
        note: "'I want to make sure' is a calm way to confirm details. It sounds careful, not slow.",
      },
      {
        id: "phone-confirm-spell",
        label: "Ask for spelling",
        note: "Names and streets are hard by phone. Asking 'Could you spell that?' is normal and useful.",
      },
      {
        id: "phone-confirm-readback-note",
        label: "Read it back",
        note: "Reading the detail back — 'So that's 14 Oak Street at three?' — lets the other person catch a mistake before you hang up.",
      },
    ],
    followUps: [
      { id: "phone-confirm-detail", question: "Which detail do you need to confirm?", salienceQuestion: "What detail matters for the {slot}?" },
      { id: "phone-confirm-spelling", question: "How would you ask them to spell it?", salienceQuestion: "How would you spell-check the {slot}?" },
      { id: "phone-confirm-repeat", question: "How would you repeat the detail back?", salienceQuestion: "How would you repeat the {slot}?" },
      { id: "phone-confirm-thanks", question: "How would you thank them after confirming?", salienceQuestion: "How would you close after the {slot}?" },
      { id: "phone-confirm-readback", question: "How would you read the full detail back to be sure?", salienceQuestion: "How would you read back the {slot}?" },
      { id: "phone-confirm-number", question: "How would you confirm a number digit by digit?", salienceQuestion: "How would you confirm the number for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-call-customer-service",
    labelEn: "Calling Customer Service",
    labelVi: "Gọi chăm sóc khách hàng",
    category: "phone-call",
    seedInputs: ["Hi, I need help with my account."],
    detectionPatterns: [
      /\b(?:customer service|help with my account|account problem|support line|billing problem|service issue)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-service-account",
        label: "Problem first",
        note: "Customer service calls go better when you say the problem first: 'I need help with my account' or 'I have a billing question.'",
      },
      {
        id: "phone-service-number",
        label: "Have numbers ready",
        note: "English support calls often ask for account number, address, or phone number. Practising the handoff lowers stress.",
      },
      {
        id: "phone-service-menu",
        label: "Press 1 menus",
        note: "Automated menus ('Press 1 for billing') move fast. It's fine to say 'representative' or press 0 to reach a person if the options don't fit.",
      },
    ],
    followUps: [
      { id: "phone-service-problem", question: "What do you need help with?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "phone-service-account-id", question: "What account detail might they ask for?", salienceQuestion: "What detail identifies the {slot}?" },
      { id: "phone-service-explain", question: "How would you explain the issue in one sentence?", salienceQuestion: "How would you explain the {slot}?" },
      { id: "phone-service-next", question: "How would you ask what happens next?", salienceQuestion: "What next step do you need for the {slot}?" },
      { id: "phone-service-human", question: "How would you ask to speak to a real person?", salienceQuestion: "How would you reach a person about the {slot}?" },
      { id: "phone-service-reference", question: "How would you ask for a reference number?", salienceQuestion: "How would you track the {slot} later?" },
    ],
  },
  {
    id: "topic-phone-call-rescheduling",
    labelEn: "Rescheduling By Phone",
    labelVi: "Đổi lịch qua điện thoại",
    category: "phone-call",
    seedInputs: ["I need to reschedule my appointment."],
    detectionPatterns: [
      /\b(?:reschedule|change my appointment|move my appointment|another time|cancel my appointment|new time)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-reschedule-word",
        label: "Reschedule is the useful word",
        note: "'Đổi lịch' often becomes 'change my schedule.' The phone word 'reschedule' is short and practical.",
      },
      {
        id: "phone-reschedule-option",
        label: "Offer a new time",
        note: "After asking to reschedule, give one or two possible times so the call does not stall.",
      },
      {
        id: "phone-reschedule-apologize",
        label: "A light apology is enough",
        note: "'Sorry for the short notice' covers the politeness without a long explanation. You don't owe a detailed reason for changing a time.",
      },
    ],
    followUps: [
      { id: "phone-reschedule-which", question: "Which appointment do you need to change?", salienceQuestion: "Which appointment is the {slot}?" },
      { id: "phone-reschedule-reason", question: "What short reason would you give?", salienceQuestion: "Why do you need to change the {slot}?" },
      { id: "phone-reschedule-newtime", question: "What new time would you ask for?", salienceQuestion: "What time works for the {slot}?" },
      { id: "phone-reschedule-confirm", question: "How would you confirm the new appointment?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "phone-reschedule-notice", question: "How would you apologize for the short notice?", salienceQuestion: "How would you soften changing the {slot}?" },
      { id: "phone-reschedule-fee", question: "How would you ask if there is a cancellation fee?", salienceQuestion: "How would you ask about a fee for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-call-delivery-driver",
    labelEn: "Talking To A Delivery Driver",
    labelVi: "Nói chuyện với tài xế giao hàng",
    category: "phone-call",
    seedInputs: ["Hi, I am at the front door now."],
    detectionPatterns: [
      /\b(?:delivery driver|front door|package delivery|food delivery|where are you|apartment buzzer|gate code)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-delivery-location",
        label: "Location before story",
        note: "Delivery calls are fast. Say the exact place first: 'I'm at the front door' or 'Please leave it at the lobby.'",
      },
      {
        id: "phone-delivery-building",
        label: "Building words",
        note: "Apartment words like lobby, entrance, buzzer, and unit number are useful for Vietnamese learners in Canada or the US.",
      },
      {
        id: "phone-delivery-eta-note",
        label: "How far away",
        note: "'How far away are you?' or 'How many minutes?' is a normal question when you're waiting and want to be at the door in time.",
      },
    ],
    followUps: [
      { id: "phone-delivery-where", question: "Where should the driver go?", salienceQuestion: "Where is the {slot}?" },
      { id: "phone-delivery-code", question: "What building detail might you need to give?", salienceQuestion: "What detail helps with the {slot}?" },
      { id: "phone-delivery-leave", question: "How would you ask them to leave the item somewhere?", salienceQuestion: "Where should they leave the {slot}?" },
      { id: "phone-delivery-thanks", question: "How would you thank the driver quickly?", salienceQuestion: "How would you close the call about the {slot}?" },
      { id: "phone-delivery-eta", question: "How would you ask how many minutes away they are?", salienceQuestion: "How far is the {slot}?" },
      { id: "phone-delivery-meet", question: "How would you say you will come down to meet them?", salienceQuestion: "How would you meet the driver for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-call-ending-politely",
    labelEn: "Ending A Phone Call Politely",
    labelVi: "Kết thúc cuộc gọi lịch sự",
    category: "phone-call",
    seedInputs: ["Thank you for your help. Have a good day."],
    detectionPatterns: [
      /\b(?:end the call|thank you for your help|have a good day|anything else|goodbye|bye now)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-ending-short",
        label: "Short closing works",
        note: "A phone closing can be simple: 'Thank you for your help. Have a good day.' No long formal ending needed.",
      },
      {
        id: "phone-ending-check-note",
        label: "One last check",
        note: "Before ending, it is fine to ask 'Is there anything else I need to do?' so you do not miss a step.",
      },
      {
        id: "phone-ending-signal-note",
        label: "Signalling the end",
        note: "'Okay, I think that's everything' is a soft way to signal you're ready to hang up, so the goodbye doesn't feel sudden.",
      },
    ],
    followUps: [
      { id: "phone-ending-thanks", question: "How would you thank them for the call?", salienceQuestion: "How would you thank them for the {slot}?" },
      { id: "phone-ending-check", question: "What final question might you ask?", salienceQuestion: "What final check do you need for the {slot}?" },
      { id: "phone-ending-repeat", question: "What detail would you repeat before hanging up?", salienceQuestion: "What would you repeat about the {slot}?" },
      { id: "phone-ending-goodbye", question: "How would you say goodbye warmly?", salienceQuestion: "How would you end the {slot}?" },
      { id: "phone-ending-signal", question: "How would you gently signal the call is wrapping up?", salienceQuestion: "How would you start to close the {slot}?" },
      { id: "phone-ending-followup", question: "How would you confirm any follow-up step?", salienceQuestion: "What follow-up would you confirm for the {slot}?" },
    ],
  },
] as const;
