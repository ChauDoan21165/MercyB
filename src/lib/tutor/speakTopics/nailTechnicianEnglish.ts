import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D4ProfessionalSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-nail-technician-client-consultation",
    labelEn: "Nail Client Consultation",
    labelVi: "Tư vấn khách làm móng",
    category: "nail-technician-english",
    scenarioDescription:
      "The learner is a nail technician greeting a client, asking what service they want, checking nail condition, and confirming color, shape, length, and timing.",
    aiRoleDefinition:
      "Act as a salon client who has a style in mind, asks for advice, and needs the technician to confirm details before the service begins.",
    conversationDirections: [
      "Ask whether the client wants a manicure, pedicure, gel, acrylic, dip powder, fill, removal, or repair.",
      "Practice confirming nail shape, length, color, finish, and design inspiration.",
      "Ask about sensitive skin, broken nails, lifting, allergies, or previous product issues.",
      "Prompt the learner to explain what is possible today based on nail condition and time.",
      "Practice saying a polite recommendation without sounding pushy.",
      "Practice politely declining a service that could damage the nail and offering a safer option instead.",
      "Confirm how much time the client has and any hard stop, so the service fits their schedule.",
      "End by confirming the service, price range, and estimated finish time.",
    ],
    warmthPatterns: [
      "Use relaxed salon hospitality: 'Let me take a look and we can choose together.'",
      "Confirm preferences before filing, cutting, or changing length.",
      "Make advice feel collaborative, not judgmental.",
    ],
    seedInputs: ["What shape and length would you like for your nails today?"],
    detectionPatterns: [
      /\b(?:manicure|pedicure|gel|acrylic|dip powder|fill|removal|nail shape|almond|coffin|square|cuticle)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "nail-consultation-shape-length",
        label: "Shape and length order",
        note: "Vietnamese salon talk may use quick nouns or pointing. In English, clients expect the paired question 'What shape and length would you like?' before the technician changes the nail.",
      },
      {
        id: "nail-consultation-sensitive",
        label: "Sensitive, sore, and allergic",
        note: "Words like 'sensitive,' 'sore,' and 'allergic' are important service-safety vocabulary. Practicing 'Are your nails sensitive today?' helps prevent discomfort and complaints.",
      },
      {
        id: "nail-consultation-decline-kindly",
        label: "Declining kindly",
        note: "Vietnamese salon talk can be very direct, which may sound blunt in English. Saying 'I'd recommend a gel fill instead, so your nails stay healthy' protects both the client's nails and the relationship.",
      },
    ],
    followUps: [
      { id: "nail-consultation-service", question: "What service does the client want today?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "nail-consultation-style", question: "How would you ask about shape, length, and color?", salienceQuestion: "What style details matter for the {slot}?" },
      { id: "nail-consultation-condition", question: "What nail condition should you check first?", salienceQuestion: "What should you check before the {slot}?" },
      { id: "nail-consultation-recommend", question: "How would you make a polite recommendation?", salienceQuestion: "What would you recommend for the {slot}?" },
      { id: "nail-consultation-confirm", question: "How would you confirm the plan before starting?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "nail-consultation-timing", question: "How would you check how much time the client has?", salienceQuestion: "How long do you have for the {slot}?" },
    ],
  },
  {
    id: "topic-nail-technician-services-pricing",
    labelEn: "Explaining Nail Services And Pricing",
    labelVi: "Giải thích dịch vụ và giá làm móng",
    category: "nail-technician-english",
    scenarioDescription:
      "The learner explains salon services, add-ons, price differences, deposits, wait time, and why a requested design may cost more or take longer.",
    aiRoleDefinition:
      "Act as a client who compares options, asks why prices differ, and wants a clear total before agreeing to the service.",
    conversationDirections: [
      "Ask the learner to explain the difference between regular polish, gel, dip, acrylic, fill, and full set.",
      "Practice naming add-ons such as French tips, chrome, cat-eye, ombre, nail art, gems, repair, and removal.",
      "Prompt a clear price estimate before the service begins.",
      "Ask how long the service will take and whether there is a wait.",
      "Practice explaining extra charges politely when the client changes the design.",
      "Practice asking for a deposit on long or custom designs without sounding distrustful.",
      "Confirm the payment method and whether card or cash is preferred before starting.",
      "End by confirming the final service and total price.",
    ],
    warmthPatterns: [
      "Be transparent early: 'Let me explain the price before we start.'",
      "Keep price explanations neutral and specific.",
      "Offer options at different price points without pressure.",
    ],
    seedInputs: ["Gel polish is more because it lasts longer and needs curing."],
    detectionPatterns: [
      /\b(?:price|pricing|extra charge|add[- ]?on|gel polish|full set|fill|french tips|chrome|ombre|nail art|removal)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "nail-pricing-more-because",
        label: "Explaining why it costs more",
        note: "A direct 'this more money' can sound sharp in English. The professional frame is 'That is an extra charge because...' or 'The total would be...' so the client understands before agreeing.",
      },
      {
        id: "nail-pricing-service-names",
        label: "Salon service names are fixed phrases",
        note: "Vietnamese speakers may translate service names loosely, but English salons use fixed terms like 'full set,' 'fill,' 'gel removal,' and 'French tips.' These are worth practicing as whole phrases.",
      },
      {
        id: "nail-pricing-deposit-ask",
        label: "Asking for a deposit politely",
        note: "A blunt 'you pay first' can feel harsh in English. 'For a custom set we take a small deposit to hold your time' explains the reason and keeps the client comfortable.",
      },
    ],
    followUps: [
      { id: "nail-pricing-option", question: "Which service option are you explaining?", salienceQuestion: "How would you explain the {slot}?" },
      { id: "nail-pricing-addons", question: "What add-on affects the price?", salienceQuestion: "What extra applies to the {slot}?" },
      { id: "nail-pricing-total", question: "How would you give the total clearly?", salienceQuestion: "What is the total for the {slot}?" },
      { id: "nail-pricing-time", question: "How would you explain the time needed?", salienceQuestion: "How long will the {slot} take?" },
      { id: "nail-pricing-confirm", question: "How would you confirm the client agrees?", salienceQuestion: "How would you confirm the {slot} before starting?" },
      { id: "nail-pricing-payment", question: "How would you confirm the payment method?", salienceQuestion: "How would the client pay for the {slot}?" },
    ],
  },
  {
    id: "topic-nail-technician-small-talk-complaints",
    labelEn: "Salon Small Talk And Complaints",
    labelVi: "Trò chuyện và xử lý phàn nàn ở tiệm nail",
    category: "nail-technician-english",
    scenarioDescription:
      "The learner practices friendly small talk during a nail appointment and handles common complaints about color, shape, wait time, pain, chips, lifting, or price.",
    aiRoleDefinition:
      "Act as a salon client who may want quiet conversation, friendly small talk, or help fixing a problem without the situation becoming tense.",
    conversationDirections: [
      "Open with light, optional small talk about the client's day, weekend, or occasion.",
      "Practice reading whether the client wants to chat or relax quietly.",
      "Ask follow-up questions about vacation, wedding, work, or a special event without becoming too personal.",
      "Handle a complaint by acknowledging it before explaining or fixing it.",
      "Practice offering a reasonable solution: reshape, repaint, repair, discount, manager help, or appointment follow-up.",
      "Practice setting a gentle boundary when a personal question feels too private, then steering back to the service.",
      "Confirm whether the client wants the fix now or a follow-up appointment if time is short.",
      "End with a calm confirmation that the client is satisfied before they leave.",
    ],
    warmthPatterns: [
      "Keep small talk warm but not intrusive.",
      "Start complaint responses with acknowledgement: 'I see what you mean.'",
      "Protect dignity on both sides by offering solutions in a steady tone.",
    ],
    seedInputs: ["I see what you mean. Let me fix that shape for you."],
    detectionPatterns: [
      /\b(?:small talk|how is your day|vacation|wedding|complaint|fix that|too thick|too short|chipped|lifting|wait time|manager)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "nail-complaints-acknowledge-first",
        label: "Acknowledge before defending",
        note: "In a busy Vietnamese-owned salon, quick explanations can sound like arguing in English. A short acknowledgement first, such as 'I see what you mean,' keeps the conversation professional.",
      },
      {
        id: "nail-smalltalk-boundaries",
        label: "Friendly but not too personal",
        note: "Vietnamese hospitality may include personal questions that feel normal in community settings. With clients, safer small talk uses open topics like weekend plans, events, color choices, and comfort.",
      },
      {
        id: "nail-smalltalk-redirect",
        label: "Redirecting a too-personal question",
        note: "A personal question can feel friendly in Vietnamese settings but awkward with clients. A soft redirect like 'That's kind of you to ask — would you like this shape a little shorter?' keeps it warm and professional.",
      },
    ],
    followUps: [
      { id: "nail-smalltalk-open", question: "What friendly question would you ask first?", salienceQuestion: "How would you start with the {slot}?" },
      { id: "nail-smalltalk-read", question: "How would you tell if the client wants quiet?", salienceQuestion: "What does the {slot} tell you?" },
      { id: "nail-complaint-ack", question: "How would you acknowledge the complaint?", salienceQuestion: "How would you acknowledge the {slot}?" },
      { id: "nail-complaint-solution", question: "What solution could you offer?", salienceQuestion: "What would fix the {slot}?" },
      { id: "nail-complaint-close", question: "How would you check that the client is satisfied?", salienceQuestion: "How would you close the {slot}?" },
      { id: "nail-complaint-followup", question: "How would you offer a follow-up appointment if there is no time now?", salienceQuestion: "How would you schedule a fix for the {slot}?" },
    ],
  },
] as const satisfies readonly D4ProfessionalSpeakTopic[];
