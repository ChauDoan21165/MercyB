export type SpeakTopicCategory =
  | "food"
  | "family"
  | "work"
  | "travel"
  | "shopping"
  | "health"
  | "phone"
  | "introductions"
  | "routine"
  | "time";

export type SpeakTopicFollowUp = {
  id: string;
  question: string;
  salienceQuestion?: string;
};

export type SpeakTopicLibraryEntry = {
  id: string;
  labelEn: string;
  labelVi: string;
  category: SpeakTopicCategory;
  seedInputs: readonly string[];
  detectionPatterns: readonly RegExp[];
  followUps: readonly SpeakTopicFollowUp[];
};

export type SpeakTopicCorrectionStatus = "ship-safe" | "hold" | "abstain";

export type SpeakTopicCorrectionCandidate = {
  id: string;
  status: SpeakTopicCorrectionStatus;
  positives: readonly string[];
  confusableNegatives: readonly string[];
  fpRiskNote: string;
  detect: RegExp;
  buildModelLine?: (match: RegExpMatchArray) => string;
  redirect: string;
};

export type SpeakTopicCorrectionWeave = {
  signalId: string;
  status: SpeakTopicCorrectionStatus;
  promptPrefix: string;
};

function escapeModelTail(value: string): string {
  return value
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const SPEAK_TOPIC_CORRECTION_CANDIDATES: readonly SpeakTopicCorrectionCandidate[] = [
  {
    id: "speak-topic-past-yesterday-go",
    status: "ship-safe",
    positives: [
      "I go to work yesterday.",
      "I go to the doctor yesterday.",
      "I go to the market yesterday.",
    ],
    confusableNegatives: [
      "I go to work every day.",
      "I will go to the doctor tomorrow.",
    ],
    fpRiskNote:
      "Low risk: only first-person go-to-place with an explicit yesterday marker; habitual and future markers are excluded by the pattern.",
    detect: /^\s*i go to (work|the office|the doctor|the market|the store|the shop) yesterday\.?\s*$/i,
    buildModelLine: (match) => `Small model: I went to ${match[1].toLowerCase()} yesterday.`,
    redirect: "Let's keep it concrete.",
  },
  {
    id: "speak-topic-want-to-order",
    status: "ship-safe",
    positives: [
      "I want order noodles.",
      "I want order coffee.",
      "I want order a sandwich.",
    ],
    confusableNegatives: [
      "I want to order coffee.",
      "I ordered coffee yesterday.",
    ],
    fpRiskNote:
      "Low risk: only the exact first-person frame 'I want order ...' is corrected to 'I want to order ...'. Other want/order forms are untouched.",
    detect: /^\s*i want order ([a-z][a-z\s'-]{1,60})\.?\s*$/i,
    buildModelLine: (match) => `Small model: I want to order ${escapeModelTail(match[1])}.`,
    redirect: "Let's keep ordering practice natural.",
  },
  {
    id: "speak-topic-need-to-call",
    status: "ship-safe",
    positives: [
      "I need call my doctor.",
      "I need call my boss.",
      "I need call the clinic.",
    ],
    confusableNegatives: [
      "I need to call my doctor.",
      "I called my doctor yesterday.",
    ],
    fpRiskNote:
      "Low risk: only the exact first-person frame 'I need call ...' is corrected to 'I need to call ...'. Past-tense and already-correct forms are untouched.",
    detect: /^\s*i need call ([a-z][a-z\s'-]{1,60})\.?\s*$/i,
    buildModelLine: (match) => `Small model: I need to call ${escapeModelTail(match[1])}.`,
    redirect: "Let's make the phone sentence easy to use.",
  },
] as const;

export const SPEAK_TOPIC_LIBRARY: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-ordering-food",
    labelEn: "Ordering Food",
    labelVi: "Gọi món ăn",
    category: "food",
    seedInputs: ["I want order noodles at the restaurant."],
    detectionPatterns: [
      /\b(?:order|restaurant|menu|noodles|pho|sandwich|coffee|food stall|waiter|waitress)\b/i,
    ],
    followUps: [
      { id: "ordering-food-item", question: "What would you like to order?", salienceQuestion: "What do you like about the {slot}?" },
      { id: "ordering-food-place", question: "Is this for here or to go?", salienceQuestion: "Would you order the {slot} for here or to go?" },
      { id: "ordering-food-detail", question: "Do you want anything extra with it?", salienceQuestion: "What extra detail would you add with the {slot}?" },
      { id: "ordering-food-confirm", question: "How would you confirm the order politely?", salienceQuestion: "How would you ask politely for the {slot}?" },
    ],
  },
  {
    id: "topic-family-relatives",
    labelEn: "Family And Relatives",
    labelVi: "Gia đình và họ hàng",
    category: "family",
    seedInputs: ["I visited my aunt and my cousins last weekend."],
    detectionPatterns: [
      /\b(?:family|relative|relatives|mother|father|aunt|uncle|cousin|grandmother|grandfather|wife|husband|children|kids)\b/i,
    ],
    followUps: [
      { id: "family-who", question: "Who do you usually talk with in your family?", salienceQuestion: "What do you usually talk about with your {slot}?" },
      { id: "family-place", question: "Where do you usually meet your relatives?", salienceQuestion: "Where do you usually meet your {slot}?" },
      { id: "family-activity", question: "What do you usually do together?", salienceQuestion: "What do you like doing with your {slot}?" },
      { id: "family-feeling", question: "How do you feel after spending time with family?", salienceQuestion: "How do you feel when you talk about your {slot}?" },
    ],
  },
  {
    id: "topic-work",
    labelEn: "Work",
    labelVi: "Công việc",
    category: "work",
    seedInputs: ["I had a meeting with my manager this morning."],
    detectionPatterns: [
      /\b(?:manager|meeting|deadline|project|client|coworker|colleague|task|presentation|shift)\b/i,
    ],
    followUps: [
      { id: "work-first-task", question: "What is your first task at work?", salienceQuestion: "What do you need to do for the {slot}?" },
      { id: "work-people", question: "Who do you usually work with?", salienceQuestion: "Who helps you with the {slot}?" },
      { id: "work-problem", question: "What is one small problem at work today?", salienceQuestion: "What is difficult about the {slot}?" },
      { id: "work-finish", question: "How do you know the work is finished?", salienceQuestion: "How will you finish the {slot}?" },
    ],
  },
  {
    id: "topic-directions-travel",
    labelEn: "Directions And Travel",
    labelVi: "Hỏi đường và đi lại",
    category: "travel",
    seedInputs: ["I need directions to the bus station."],
    detectionPatterns: [
      /\b(?:direction|directions|travel|trip|bus station|airport|hotel|train|taxi|turn left|turn right|map)\b/i,
    ],
    followUps: [
      { id: "travel-destination", question: "Where are you trying to go?", salienceQuestion: "Where is the {slot} on your route?" },
      { id: "travel-transport", question: "How will you get there?", salienceQuestion: "How will you travel with the {slot}?" },
      { id: "travel-help", question: "Who could you ask for help?", salienceQuestion: "Who could help you find the {slot}?" },
      { id: "travel-confirm", question: "How would you confirm the direction?", salienceQuestion: "How would you confirm the way to the {slot}?" },
    ],
  },
  {
    id: "topic-shopping",
    labelEn: "Shopping",
    labelVi: "Mua sắm",
    category: "shopping",
    seedInputs: ["I want to buy a shirt at the store."],
    detectionPatterns: [
      /\b(?:shopping|buy|store|shop|shirt|shoes|price|size|cashier|discount|return an item)\b/i,
    ],
    followUps: [
      { id: "shopping-item", question: "What do you want to buy?", salienceQuestion: "Why do you want to buy the {slot}?" },
      { id: "shopping-size", question: "What size or color do you need?", salienceQuestion: "What size or color works for the {slot}?" },
      { id: "shopping-price", question: "How would you ask about the price?", salienceQuestion: "How would you ask the price of the {slot}?" },
      { id: "shopping-decision", question: "What would make you decide to buy it?", salienceQuestion: "What would make the {slot} worth buying?" },
    ],
  },
  {
    id: "topic-doctor-health-visit",
    labelEn: "Doctor / Health Visit",
    labelVi: "Đi khám sức khỏe",
    category: "health",
    seedInputs: ["I need call my doctor about my appointment."],
    detectionPatterns: [
      /\b(?:doctor|clinic|hospital|appointment|medicine|pharmacy|symptom|sick|pain|fever|health)\b/i,
    ],
    followUps: [
      { id: "health-reason", question: "Why do you need to see the doctor?", salienceQuestion: "What should the doctor know about the {slot}?" },
      { id: "health-symptom", question: "What symptom would you describe first?", salienceQuestion: "How would you describe the {slot} simply?" },
      { id: "health-time", question: "When did the problem start?", salienceQuestion: "When did you first notice the {slot}?" },
      { id: "health-request", question: "What help do you want from the clinic?", salienceQuestion: "What help do you need for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-calls",
    labelEn: "Phone Calls",
    labelVi: "Gọi điện thoại",
    category: "phone",
    seedInputs: ["I need call my boss after lunch."],
    detectionPatterns: [
      /\b(?:phone|call|voicemail|message|text me|missed call|line is busy|speak to)\b/i,
    ],
    followUps: [
      { id: "phone-person", question: "Who do you need to call?", salienceQuestion: "What do you need to tell the {slot}?" },
      { id: "phone-reason", question: "Why are you calling them?", salienceQuestion: "Why is the {slot} important in this call?" },
      { id: "phone-opening", question: "How would you start the call politely?", salienceQuestion: "How would you mention the {slot} politely?" },
      { id: "phone-message", question: "What short message could you leave?", salienceQuestion: "What short message would you leave about the {slot}?" },
    ],
  },
  {
    id: "topic-introductions",
    labelEn: "Introductions",
    labelVi: "Giới thiệu bản thân",
    category: "introductions",
    seedInputs: ["Hello, my name is Linh and I am from Vietnam."],
    detectionPatterns: [
      /\b(?:my name is|nice to meet you|introduce|introduction|from vietnam|meet you|new here)\b/i,
    ],
    followUps: [
      { id: "intro-name", question: "How would you introduce your name clearly?", salienceQuestion: "How would you introduce the {slot} naturally?" },
      { id: "intro-place", question: "Where are you from?", salienceQuestion: "What would you say about the {slot}?" },
      { id: "intro-work-study", question: "What do you do?", salienceQuestion: "How is the {slot} connected to your life?" },
      { id: "intro-close", question: "What friendly question could you ask next?", salienceQuestion: "What friendly question could you ask about the {slot}?" },
    ],
  },
  {
    id: "topic-daily-routine",
    labelEn: "Daily Routine",
    labelVi: "Thói quen hằng ngày",
    category: "routine",
    seedInputs: ["Every morning I brush my teeth before breakfast."],
    detectionPatterns: [
      /\b(?:daily routine|every morning|wake up|brush my teeth|breakfast|make coffee|go home|before bed)\b/i,
    ],
    followUps: [
      { id: "routine-first", question: "What is the first thing you do in the morning?", salienceQuestion: "When do you usually do the {slot}?" },
      { id: "routine-next", question: "What do you do after that?", salienceQuestion: "What comes after the {slot}?" },
      { id: "routine-time", question: "What time do you usually start your day?", salienceQuestion: "What time does the {slot} usually happen?" },
      { id: "routine-evening", question: "What changes in your evening routine?", salienceQuestion: "How does the {slot} affect your evening?" },
    ],
  },
  {
    id: "topic-time-appointments-waiting",
    labelEn: "Time, Appointments, And Waiting",
    labelVi: "Giờ hẹn và chờ đợi",
    category: "time",
    seedInputs: ["I am waiting at three and my turn is late."],
    detectionPatterns: [
      /\b(?:appointment|schedule|wait|waiting|late|early|at three|at four|meeting time|reschedule)\b/i,
    ],
    followUps: [
      { id: "time-appointment", question: "What time is your appointment?", salienceQuestion: "What time is the {slot}?" },
      { id: "time-waiting", question: "How long have you been waiting?", salienceQuestion: "How long have you waited for the {slot}?" },
      { id: "time-delay", question: "What would you say if you are late?", salienceQuestion: "What would you say if the {slot} is delayed?" },
      { id: "time-confirm", question: "How would you confirm the appointment time?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
] as const;

export function getSpeakTopicLibraryEntry(topicId: string): SpeakTopicLibraryEntry | null {
  return SPEAK_TOPIC_LIBRARY.find((entry) => entry.id === topicId) ?? null;
}

export function getSpeakTopicLibraryTopicId(sentence: string): string | null {
  const normalized = sentence.replace(/\s+/g, " ").trim();
  const entry = SPEAK_TOPIC_LIBRARY.find((candidate) =>
    candidate.detectionPatterns.some((pattern) => pattern.test(normalized)),
  );
  return entry?.id ?? null;
}

export function buildSpeakTopicCorrectionWeave(learnerText: string): SpeakTopicCorrectionWeave | null {
  const normalized = learnerText.replace(/\s+/g, " ").trim();
  if (!normalized) return null;

  for (const candidate of SPEAK_TOPIC_CORRECTION_CANDIDATES) {
    const match = normalized.match(candidate.detect);
    if (!match) continue;

    if (candidate.status === "ship-safe" && candidate.buildModelLine) {
      return {
        signalId: candidate.id,
        status: candidate.status,
        promptPrefix: `${candidate.buildModelLine(match)} ${candidate.redirect}`,
      };
    }

    return {
      signalId: candidate.id,
      status: candidate.status,
      promptPrefix: `${candidate.redirect}`,
    };
  }

  return null;
}
