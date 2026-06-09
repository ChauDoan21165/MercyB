import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type FinalThemeSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-emergencies-calling-help",
    labelEn: "Calling Emergency Help",
    labelVi: "Gọi trợ giúp khẩn cấp",
    category: "emergencies",
    scenarioDescription:
      "The learner practices giving essential information during an emergency call: location, problem, people involved, immediate danger, and callback number.",
    aiRoleDefinition:
      "Act as an emergency dispatcher for language practice only, asking short questions and helping the learner state urgent facts clearly.",
    conversationDirections: [
      "Ask for the exact location first.",
      "Prompt the learner to say what happened in one short sentence.",
      "Ask whether anyone is hurt, trapped, missing, or in immediate danger.",
      "Practice giving a phone number and staying on the line.",
      "Keep the learner using plain facts, not long explanations.",
      "End by repeating the location, emergency type, and safest next step.",
    ],
    warmthPatterns: [
      "Keep the tone calm, direct, and non-dramatic.",
      "Use short questions that are easy to answer under stress.",
      "Add a clear practice-only boundary when needed.",
    ],
    seedInputs: ["I need emergency help at my address."],
    detectionPatterns: [
      /\b(?:emergency help|call emergency|call 911|call 999|ambulance|fire department|police emergency|someone is hurt|immediate danger)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "emergency-location-first",
        label: "Give the location first",
        note: "Vietnamese learners may explain the story before the address. In emergency English, location comes first: 'The emergency is at...'",
      },
      {
        id: "emergency-hurt-passive",
        label: "Someone is hurt",
        note: "'Có người bị thương' maps naturally to 'Someone is hurt.' Avoid long grammar under pressure.",
      },
    ],
    followUps: [
      { id: "emergency-call-location", question: "What exact location would you give first?", salienceQuestion: "Where is the {slot} happening?" },
      { id: "emergency-call-problem", question: "What happened, in one short sentence?", salienceQuestion: "What happened with the {slot}?" },
      { id: "emergency-call-injuries", question: "How would you say if someone is hurt?", salienceQuestion: "Is anyone hurt because of the {slot}?" },
      { id: "emergency-call-danger", question: "What danger should the dispatcher know now?", salienceQuestion: "What danger is connected to the {slot}?" },
      { id: "emergency-call-callback", question: "How would you give a callback number?", salienceQuestion: "What number should they use for the {slot}?" },
    ],
  },
  {
    id: "topic-emergencies-medical-urgent",
    labelEn: "Urgent Medical Problem",
    labelVi: "Vấn đề y tế khẩn cấp",
    category: "emergencies",
    scenarioDescription:
      "The learner describes urgent symptoms to a clinic, dispatcher, nurse, or bystander and asks what to do next.",
    aiRoleDefinition:
      "Act as a triage nurse who asks about symptoms, timing, severity, medication, allergies, and whether emergency services are needed.",
    conversationDirections: [
      "Ask what symptom is happening right now.",
      "Prompt the learner to say when it started and how severe it is.",
      "Ask about breathing, chest pain, bleeding, fainting, fever, and injury if relevant.",
      "Practice saying medication and allergy information clearly.",
      "Ask whether the learner needs an ambulance, urgent clinic, or advice line.",
      "End by confirming the next step without making a diagnosis.",
    ],
    warmthPatterns: [
      "Stay calm and avoid medical certainty.",
      "Use concrete symptom questions before any explanation.",
      "Encourage urgent local help when danger signs appear.",
    ],
    seedInputs: ["I have an urgent medical problem and need help."],
    detectionPatterns: [
      /\b(?:urgent medical|medical emergency|chest pain|trouble breathing|bleeding|fainted|high fever|severe pain|allergic reaction)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "emergency-medical-started",
        label: "It started",
        note: "Vietnamese learners may say 'It happen from morning.' In triage English, say 'It started this morning.'",
      },
      {
        id: "emergency-medical-breathing",
        label: "Trouble breathing",
        note: "'Khó thở' is usually 'trouble breathing' or 'shortness of breath,' not 'hard breath.'",
      },
    ],
    followUps: [
      { id: "emergency-medical-symptom", question: "What symptom would you say first?", salienceQuestion: "What symptom is connected to the {slot}?" },
      { id: "emergency-medical-start", question: "When did it start?", salienceQuestion: "When did the {slot} start?" },
      { id: "emergency-medical-severity", question: "How would you describe how serious it feels?", salienceQuestion: "How serious is the {slot}?" },
      { id: "emergency-medical-meds", question: "What medication or allergy detail might matter?", salienceQuestion: "What medicine detail matters for the {slot}?" },
      { id: "emergency-medical-next", question: "How would you ask what to do next?", salienceQuestion: "What should you do next about the {slot}?" },
    ],
  },
  {
    id: "topic-emergencies-home-safety",
    labelEn: "Home Safety Emergency",
    labelVi: "Khẩn cấp an toàn trong nhà",
    category: "emergencies",
    scenarioDescription:
      "The learner reports a home safety issue such as smoke, fire alarm, gas smell, break-in concern, flood, sparking outlet, or blocked exit.",
    aiRoleDefinition:
      "Act as a building manager or emergency operator who asks direct safety questions and helps the learner report location and immediate risk.",
    conversationDirections: [
      "Ask what safety problem the learner noticed.",
      "Prompt the learner to state where it is happening in the home or building.",
      "Ask whether people are outside, safe, or still inside.",
      "Practice reporting smoke, smell of gas, water leak, power issue, or blocked exit.",
      "Ask whether emergency services, building management, or utility support is needed.",
      "End by confirming the safest next action and who has been contacted.",
    ],
    warmthPatterns: [
      "Use calm directness and avoid casual small talk.",
      "Keep the focus on location, people, and immediate risk.",
      "Treat every safety concern as worth reporting clearly.",
    ],
    seedInputs: ["There is a safety emergency in my apartment."],
    detectionPatterns: [
      /\b(?:home safety emergency|fire alarm|smoke alarm|smell gas|gas leak|sparking outlet|blocked exit|water leak|break-in|flooding)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "emergency-home-smell-gas",
        label: "I smell gas",
        note: "A short emergency phrase is best: 'I smell gas.' Learners do not need a long explanation before location and danger.",
      },
      {
        id: "emergency-home-people-safe",
        label: "Everyone is outside",
        note: "For safety status, use simple complete sentences: 'Everyone is outside' or 'One person is still inside.'",
      },
    ],
    followUps: [
      { id: "emergency-home-problem", question: "What safety problem would you report first?", salienceQuestion: "What is happening with the {slot}?" },
      { id: "emergency-home-location", question: "Where in the home or building is it happening?", salienceQuestion: "Where is the {slot}?" },
      { id: "emergency-home-people", question: "How would you say if everyone is safe or outside?", salienceQuestion: "Who is safe from the {slot}?" },
      { id: "emergency-home-risk", question: "What immediate risk should they know?", salienceQuestion: "What risk comes from the {slot}?" },
      { id: "emergency-home-contact", question: "Who should you contact next?", salienceQuestion: "Who should hear about the {slot}?" },
    ],
  },
] as const satisfies readonly FinalThemeSpeakTopic[];
