export type SpeakTopicKnownCategory =
  | "food"
  | "family"
  | "work"
  | "travel"
  | "shopping"
  | "health"
  | "phone"
  | "introductions"
  | "routine"
  | "time"
  | "home"
  | "money"
  | "mail"
  | "school"
  | "social"
  | "weather"
  | "hobbies"
  | "service"
  | "childcare"
  | "documents";

export type SpeakTopicCategory = SpeakTopicKnownCategory | (string & {});

export type SpeakTopicFollowUp = {
  id: string;
  question: string;
  salienceQuestion?: string;
};

export type SpeakTopicL1InterferenceNote = {
  id: string;
  label: string;
  note: string;
};

export type SpeakTopicLibraryEntry = {
  id: string;
  labelEn: string;
  labelVi: string;
  category: SpeakTopicCategory;
  seedInputs: readonly string[];
  detectionPatterns: readonly RegExp[];
  followUps: readonly SpeakTopicFollowUp[];
  l1InterferenceNotes?: readonly SpeakTopicL1InterferenceNote[];
};

type SpeakTopicModule = {
  speakTopics?: unknown;
};

const speakTopicModules = import.meta.glob<SpeakTopicModule>("./speakTopics/*.ts", {
  eager: true,
});

export function collectSpeakTopicsFromModules(
  modules: Iterable<readonly [string, SpeakTopicModule]>,
): readonly SpeakTopicLibraryEntry[] {
  return [...modules]
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([, module]) => (
      Array.isArray(module.speakTopics) ? module.speakTopics : []
    ));
}

const autoRegisteredSpeakTopics: readonly SpeakTopicLibraryEntry[] = collectSpeakTopicsFromModules(
  Object.entries(speakTopicModules),
);

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
  {
    id: "speak-topic-pay-in-cash",
    status: "ship-safe",
    positives: [
      "I pay by cash.",
      "I want to pay by cash.",
      "Can I pay by cash?",
    ],
    confusableNegatives: [
      "I pay by card.",
      "I pay with cash.",
    ],
    fpRiskNote:
      "Low risk: only the exact phrase 'pay by cash' is corrected to 'pay in cash'. Card payments and already-natural 'pay with cash' are untouched.",
    detect: /^\s*(i pay|i want to pay|can i pay) by cash[.?]?\s*$/i,
    buildModelLine: (match) => {
      const opener = match[1].toLowerCase();
      if (opener === "can i pay") return "Small model: Can I pay in cash?";
      if (opener === "i want to pay") return "Small model: I want to pay in cash.";
      return "Small model: I pay in cash.";
    },
    redirect: "Let's make the payment sentence natural.",
  },
  {
    id: "speak-topic-fill-out-form",
    status: "ship-safe",
    positives: [
      "I need to fill form.",
      "I want to fill form.",
      "Can you help me fill form?",
    ],
    confusableNegatives: [
      "I need to fill out the form.",
      "I filled the form yesterday.",
    ],
    fpRiskNote:
      "Low risk: only exact missing-particle 'fill form' frames are corrected. Past-tense and already-correct 'fill out' forms are untouched.",
    detect: /^\s*(i need to fill|i want to fill|can you help me fill) form[.?]?\s*$/i,
    buildModelLine: (match) => {
      const opener = match[1].toLowerCase();
      if (opener === "can you help me fill") return "Small model: Can you help me fill out the form?";
      if (opener === "i want to fill") return "Small model: I want to fill out the form.";
      return "Small model: I need to fill out the form.";
    },
    redirect: "Let's keep the form request clear.",
  },
  {
    id: "speak-topic-need-help-with",
    status: "ship-safe",
    positives: [
      "I need help this form.",
      "I need help my homework.",
      "I need help the package.",
    ],
    confusableNegatives: [
      "I need help with this form.",
      "I need help to carry this box.",
    ],
    fpRiskNote:
      "Low risk: only first-person 'I need help' followed by a noun phrase gets 'with'. Verb frames and already-correct 'help with' are untouched.",
    detect: /^\s*i need help ((?:this|that|my|your|the|a|an) [a-z][a-z\s'-]{1,50})\.?\s*$/i,
    buildModelLine: (match) => `Small model: I need help with ${escapeModelTail(match[1])}.`,
    redirect: "Let's make the help request easy to use.",
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
  {
    id: "topic-home-rent-repairs",
    labelEn: "Home, Rent, And Repairs",
    labelVi: "Nhà ở, tiền thuê và sửa chữa",
    category: "home",
    seedInputs: ["My sink is leaking and I need a repair."],
    detectionPatterns: [
      /\b(?:rent|landlord|apartment|sink|leak|leaking|repair|broken heater|roommate|maintenance)\b/i,
    ],
    followUps: [
      { id: "home-place", question: "What part of your home has the problem?", salienceQuestion: "What is happening with the {slot}?" },
      { id: "home-problem", question: "When did the problem start?", salienceQuestion: "When did the {slot} problem start?" },
      { id: "home-help", question: "Who do you need to contact for help?", salienceQuestion: "Who can help with the {slot}?" },
      { id: "home-time", question: "What time would be good for a repair visit?", salienceQuestion: "What time works for the {slot} repair?" },
    ],
  },
  {
    id: "topic-mail-package-delivery",
    labelEn: "Mail And Package Delivery",
    labelVi: "Thư và giao hàng",
    category: "mail",
    seedInputs: ["The package delivery has a tracking number."],
    detectionPatterns: [
      /\b(?:mail|package|delivery|delivered|tracking|post office|address|pickup notice|courier)\b/i,
    ],
    followUps: [
      { id: "mail-item", question: "What are you waiting for?", salienceQuestion: "What do you know about the {slot}?" },
      { id: "mail-time", question: "When should it arrive?", salienceQuestion: "When should the {slot} arrive?" },
      { id: "mail-problem", question: "What problem could you explain?", salienceQuestion: "What problem happened with the {slot}?" },
      { id: "mail-action", question: "What would you ask the delivery person?", salienceQuestion: "What would you ask about the {slot}?" },
    ],
  },
  {
    id: "topic-school-class",
    labelEn: "School Or Class",
    labelVi: "Trường học hoặc lớp học",
    category: "school",
    seedInputs: ["I have English class tonight and homework is due."],
    detectionPatterns: [
      /\b(?:school|class|teacher|homework|lesson|exam|student|assignment|due tonight)\b/i,
    ],
    followUps: [
      { id: "school-class", question: "What class are you talking about?", salienceQuestion: "What do you do in the {slot}?" },
      { id: "school-time", question: "When is the class or homework due?", salienceQuestion: "When is the {slot} due?" },
      { id: "school-help", question: "What help could you ask for?", salienceQuestion: "What help do you need with the {slot}?" },
      { id: "school-message", question: "What short message could you send the teacher?", salienceQuestion: "What would you tell the teacher about the {slot}?" },
    ],
  },
  {
    id: "topic-social-plans-invitations",
    labelEn: "Social Plans And Invitations",
    labelVi: "Hẹn gặp và rủ bạn bè",
    category: "social",
    seedInputs: ["I want to invite my friend to meet tomorrow."],
    detectionPatterns: [
      /\b(?:invite|invitation|plans|coffee tomorrow|hang out|meet up|dinner tonight|free this weekend)\b/i,
    ],
    followUps: [
      { id: "social-person", question: "Who do you want to invite?", salienceQuestion: "What would you say to your {slot}?" },
      { id: "social-activity", question: "What do you want to do together?", salienceQuestion: "What would you do for {slot}?" },
      { id: "social-time", question: "What time should you suggest?", salienceQuestion: "What time works for the {slot}?" },
      { id: "social-confirm", question: "How would you confirm the plan politely?", salienceQuestion: "How would you confirm the {slot} plan?" },
    ],
  },
  {
    id: "topic-weather-clothes",
    labelEn: "Weather And Clothes",
    labelVi: "Thời tiết và quần áo",
    category: "weather",
    seedInputs: ["It is raining today, so I need a jacket."],
    detectionPatterns: [
      /\b(?:weather|raining|rainy|snowing|sunny|cold|hot|jacket|umbrella|coat|sweater)\b/i,
    ],
    followUps: [
      { id: "weather-today", question: "What is the weather like today?", salienceQuestion: "How does the {slot} change your day?" },
      { id: "weather-clothes", question: "What will you wear?", salienceQuestion: "What will you wear for the {slot}?" },
      { id: "weather-plan", question: "Will the weather change your plan?", salienceQuestion: "Will the {slot} change your plan?" },
      { id: "weather-advice", question: "What advice would you give someone?", salienceQuestion: "What advice would you give about the {slot}?" },
    ],
  },
  {
    id: "topic-exercise-hobbies",
    labelEn: "Exercise And Hobbies",
    labelVi: "Tập thể dục và sở thích",
    category: "hobbies",
    seedInputs: ["I go for a walk after dinner."],
    detectionPatterns: [
      /\b(?:exercise|hobby|hobbies|walk|walking|gym|soccer|music|gardening|paint|painting|after dinner)\b/i,
    ],
    followUps: [
      { id: "hobby-activity", question: "What activity do you enjoy?", salienceQuestion: "What do you like about {slot}?" },
      { id: "hobby-frequency", question: "How often do you do it?", salienceQuestion: "How often do you do {slot}?" },
      { id: "hobby-place", question: "Where do you usually do this activity?", salienceQuestion: "Where do you usually do {slot}?" },
      { id: "hobby-feeling", question: "How do you feel after doing it?", salienceQuestion: "How do you feel after {slot}?" },
    ],
  },
  {
    id: "topic-customer-service-problems",
    labelEn: "Customer Service Problems",
    labelVi: "Vấn đề với dịch vụ khách hàng",
    category: "service",
    seedInputs: ["I bought this yesterday, but it does not work."],
    detectionPatterns: [
      /\b(?:customer service|refund|exchange|return this|does not work|doesn't work|wrong order|broken item|receipt)\b/i,
    ],
    followUps: [
      { id: "service-item", question: "What item or service has a problem?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "service-problem", question: "What happened?", salienceQuestion: "When did the {slot} problem happen?" },
      { id: "service-fix", question: "What do you want them to do?", salienceQuestion: "What fix do you want for the {slot}?" },
      { id: "service-close", question: "How would you end the request politely?", salienceQuestion: "How would you politely close the {slot} request?" },
    ],
  },
  {
    id: "topic-childcare-school-pickup",
    labelEn: "Childcare And School Pickup",
    labelVi: "Đón con và chăm sóc trẻ",
    category: "childcare",
    seedInputs: ["The daycare pickup is this afternoon."],
    detectionPatterns: [
      /\b(?:childcare|daycare|pick up my son|pick up my daughter|drop off|school pickup|babysitter|after school)\b/i,
    ],
    followUps: [
      { id: "childcare-person", question: "Who do you need to pick up or drop off?", salienceQuestion: "Where do you need to take your {slot}?" },
      { id: "childcare-time", question: "What time is pickup or drop-off?", salienceQuestion: "What time is pickup for your {slot}?" },
      { id: "childcare-place", question: "Where do you need to go?", salienceQuestion: "Where is the {slot} pickup?" },
      { id: "childcare-backup", question: "What is your backup plan if you are late?", salienceQuestion: "What is the backup plan for your {slot}?" },
    ],
  },
  {
    id: "topic-documents-forms",
    labelEn: "Documents And Forms",
    labelVi: "Giấy tờ và biểu mẫu",
    category: "documents",
    seedInputs: ["I need help this form for my application."],
    detectionPatterns: [
      /\b(?:document|documents|form|forms|application|signature|sign here|fill form|fill out|id card|paperwork)\b/i,
    ],
    followUps: [
      { id: "documents-type", question: "What document or form are you working on?", salienceQuestion: "What do you need to do with the {slot}?" },
      { id: "documents-problem", question: "What part is confusing?", salienceQuestion: "What is confusing about the {slot}?" },
      { id: "documents-help", question: "Who could help you with it?", salienceQuestion: "Who could help you with the {slot}?" },
      { id: "documents-next", question: "What is the next step after the form is ready?", salienceQuestion: "What is the next step for the {slot}?" },
    ],
  },
  ...autoRegisteredSpeakTopics,
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
