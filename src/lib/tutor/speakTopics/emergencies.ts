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
      {
        id: "emergency-line-stay",
        label: "Stay on the line",
        note: "Dispatchers may say 'Stay on the line.' It means keep the call connected, even if you are scared or moving to safety.",
      },
    ],
    followUps: [
      { id: "emergency-call-location", question: "What exact location would you give first?", salienceQuestion: "Where is the {slot} happening?" },
      { id: "emergency-call-problem", question: "What happened, in one short sentence?", salienceQuestion: "What happened with the {slot}?" },
      { id: "emergency-call-injuries", question: "How would you say if someone is hurt?", salienceQuestion: "Is anyone hurt because of the {slot}?" },
      { id: "emergency-call-danger", question: "What danger should the dispatcher know now?", salienceQuestion: "What danger is connected to the {slot}?" },
      { id: "emergency-call-callback", question: "How would you give a callback number?", salienceQuestion: "What number should they use for the {slot}?" },
      { id: "emergency-call-stay-line", question: "How would you answer if they tell you to stay on the line?", salienceQuestion: "What should you do while reporting the {slot}?" },
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
      {
        id: "emergency-medical-allergy",
        label: "Allergic to",
        note: "For urgent care, use 'I'm allergic to...' or 'They are allergic to...' rather than only 'cannot eat.' The phrase signals medical risk clearly.",
      },
    ],
    followUps: [
      { id: "emergency-medical-symptom", question: "What symptom would you say first?", salienceQuestion: "What symptom is connected to the {slot}?" },
      { id: "emergency-medical-start", question: "When did it start?", salienceQuestion: "When did the {slot} start?" },
      { id: "emergency-medical-severity", question: "How would you describe how serious it feels?", salienceQuestion: "How serious is the {slot}?" },
      { id: "emergency-medical-meds", question: "What medication or allergy detail might matter?", salienceQuestion: "What medicine detail matters for the {slot}?" },
      { id: "emergency-medical-next", question: "How would you ask what to do next?", salienceQuestion: "What should you do next about the {slot}?" },
      { id: "emergency-medical-allergy", question: "How would you mention an allergy clearly?", salienceQuestion: "What allergy matters for the {slot}?" },
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
      {
        id: "emergency-home-turn-off",
        label: "Turn off / shut off",
        note: "For gas, water, or power, staff may say 'turn it off' or 'shut it off.' If you are not sure, ask 'Should I turn it off?'",
      },
    ],
    followUps: [
      { id: "emergency-home-problem", question: "What safety problem would you report first?", salienceQuestion: "What is happening with the {slot}?" },
      { id: "emergency-home-location", question: "Where in the home or building is it happening?", salienceQuestion: "Where is the {slot}?" },
      { id: "emergency-home-people", question: "How would you say if everyone is safe or outside?", salienceQuestion: "Who is safe from the {slot}?" },
      { id: "emergency-home-risk", question: "What immediate risk should they know?", salienceQuestion: "What risk comes from the {slot}?" },
      { id: "emergency-home-contact", question: "Who should you contact next?", salienceQuestion: "Who should hear about the {slot}?" },
      { id: "emergency-home-shutoff", question: "How would you ask if you should turn something off?", salienceQuestion: "Should you shut off the {slot}?" },
    ],
  },
  {
    id: "topic-emergencies-give-location",
    labelEn: "Giving Your Exact Location",
    labelVi: "Nói chính xác vị trí",
    category: "emergencies",
    scenarioDescription:
      "On an emergency call the learner gives an exact location using an address, intersection, or nearby landmark, names which entrance to use, and repeats it calmly.",
    aiRoleDefinition:
      "Act as a calm dispatcher who asks where the learner is, presses gently for a landmark or entrance, and has them repeat the location.",
    conversationDirections: [
      "Ask the learner for their address or intersection.",
      "Ask for a nearby landmark if the address is unclear.",
      "Find out which entrance responders should use.",
      "Have the learner repeat the location slowly.",
      "Confirm the location is clear before moving on.",
    ],
    warmthPatterns: [
      "Stay calm and steady to keep the learner steady.",
      "Reassure the learner that slow and accurate beats fast.",
      "Encourage landmark phrases like 'near the pharmacy.'",
    ],
    seedInputs: ["I am at the corner of King Street and First Avenue."],
    detectionPatterns: [
      /\b(?:my location|where are you|corner of|near the|address is|intersection|landmark|building entrance)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "emergency-location-near",
        label: "Near plus landmark",
        note: "Vietnamese directions often rely on landmarks. That helps in English too: 'near the pharmacy,' 'beside the bus stop,' or 'at the front entrance.'",
      },
      {
        id: "emergency-location-say-address",
        label: "Slow address",
        note: "It is okay to say the address slowly and repeat it. Dispatchers prefer accurate, not fast.",
      },
    ],
    followUps: [
      { id: "emergency-location-address", question: "What address or intersection would you give?", salienceQuestion: "How would you say the {slot} clearly?" },
      { id: "emergency-location-landmark", question: "What landmark is nearby?", salienceQuestion: "What landmark is near the {slot}?" },
      { id: "emergency-location-entrance", question: "Which entrance should help use?", salienceQuestion: "Where is the entrance for the {slot}?" },
      { id: "emergency-location-repeat", question: "How would you repeat the location if asked?", salienceQuestion: "How would you repeat the {slot} calmly?" },
    ],
  },
  {
    id: "topic-emergencies-describe-injury",
    labelEn: "Describing An Injury",
    labelVi: "Mô tả chấn thương",
    category: "emergencies",
    scenarioDescription:
      "The learner describes an injury to emergency staff: who is hurt, where on the body, how serious, whether the person is awake and breathing, and if there is bleeding.",
    aiRoleDefinition:
      "Act as emergency staff who calmly ask what happened, where the injury is, and whether the person is awake, breathing, and bleeding.",
    conversationDirections: [
      "Ask what happened to the person.",
      "Ask where the injury is on the body.",
      "Check if the person is awake and breathing.",
      "Ask whether there is bleeding.",
      "Keep the learner calm while gathering facts.",
    ],
    warmthPatterns: [
      "Keep questions short and steady.",
      "Reassure the learner that imperfect words are fine.",
      "Model the calm 'awake and breathing' safety phrase.",
    ],
    seedInputs: ["He fell and hit his head. He is awake but dizzy."],
    detectionPatterns: [
      /\b(?:fell|hit his head|hit her head|bleeding|broken arm|hurt badly|injury|dizzy|unconscious)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "emergency-injury-he-she",
        label: "He or she under stress",
        note: "Vietnamese pronouns work differently, so he/she can swap under pressure. The key is still clear: who is hurt, where, and how serious.",
      },
      {
        id: "emergency-injury-awake-breathing",
        label: "Awake and breathing",
        note: "Emergency staff may ask if the person is awake and breathing. Practicing those words gives learners a calm safety script.",
      },
    ],
    followUps: [
      { id: "emergency-injury-what", question: "What happened to the person?", salienceQuestion: "How would you describe the {slot}?" },
      { id: "emergency-injury-where", question: "Where is the injury?", salienceQuestion: "Where is the {slot} on the body?" },
      { id: "emergency-injury-conscious", question: "Is the person awake and breathing?", salienceQuestion: "What is the person's condition after the {slot}?" },
      { id: "emergency-injury-bleeding", question: "How would you say whether there is bleeding?", salienceQuestion: "Is there bleeding from the {slot}?" },
    ],
  },
  {
    id: "topic-emergencies-fire-or-smoke",
    labelEn: "Reporting Fire Or Smoke",
    labelVi: "Báo cháy hoặc khói",
    category: "emergencies",
    scenarioDescription:
      "The learner reports fire, smoke, or a gas smell, says where it is, whether people are still inside, and that they are leaving the building safely.",
    aiRoleDefinition:
      "Act as a fire dispatcher who asks what the learner sees or smells, where it is, who is inside, and confirms they are getting out safely.",
    conversationDirections: [
      "Ask what the learner sees or smells.",
      "Find out where the fire or smoke is.",
      "Ask whether people are still inside.",
      "Confirm the learner is leaving safely.",
      "Keep instructions short and calm.",
    ],
    warmthPatterns: [
      "Prioritize getting out over long explanations.",
      "Reassure the learner that leaving first is right.",
      "Encourage 'There is smoke...' as the opening frame.",
    ],
    seedInputs: ["There is smoke in the hallway and we are leaving the building."],
    detectionPatterns: [
      /\b(?:fire|smoke|smell gas|gas leak|alarm is going off|building is on fire|hallway smoke|evacuate)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "emergency-fire-there-is",
        label: "There is smoke",
        note: "Vietnamese may start with the place first. English emergency reports often start with 'There is smoke' or 'There is a fire,' then the place.",
      },
      {
        id: "emergency-fire-leaving",
        label: "Say you are leaving",
        note: "If people are evacuating, say it simply: 'We are leaving the building.' It tells responders what is happening now.",
      },
    ],
    followUps: [
      { id: "emergency-fire-what", question: "What do you see or smell?", salienceQuestion: "How would you report the {slot}?" },
      { id: "emergency-fire-where", question: "Where is the smoke or fire?", salienceQuestion: "Where is the {slot} located?" },
      { id: "emergency-fire-people", question: "Are people still inside?", salienceQuestion: "Who is near the {slot}?" },
      { id: "emergency-fire-exit", question: "How would you say you are leaving safely?", salienceQuestion: "How would you leave the {slot} safely?" },
    ],
  },
  {
    id: "topic-emergencies-car-accident",
    labelEn: "After A Car Accident",
    labelVi: "Sau tai nạn xe",
    category: "emergencies",
    scenarioDescription:
      "After a car accident the learner reports the location, whether anyone is hurt, how many vehicles are involved, and any remaining danger like traffic or fire.",
    aiRoleDefinition:
      "Act as a dispatcher who asks where the accident is, who is hurt, how many vehicles, and whether danger remains — safety before paperwork.",
    conversationDirections: [
      "Ask where the accident happened.",
      "Ask whether anyone is hurt.",
      "Find out how many vehicles are involved.",
      "Check for remaining danger like traffic or fire.",
      "Keep the learner focused on safety first.",
    ],
    warmthPatterns: [
      "Put injuries and location before insurance talk.",
      "Reassure the learner that paperwork can wait.",
      "Encourage 'There was an accident' as the opener.",
    ],
    seedInputs: ["There was a car accident. Nobody is trapped, but one person is hurt."],
    detectionPatterns: [
      /\b(?:car accident|crash|hit my car|rear-ended|someone is hurt|traffic accident|vehicle collision|pulled over)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "emergency-accident-had-was",
        label: "There was an accident",
        note: "Vietnamese learners may say 'have accident here.' Emergency English usually says 'There was an accident' or 'We had an accident.'",
      },
      {
        id: "emergency-accident-insurance-later",
        label: "Safety before paperwork",
        note: "In an accident, say injuries and location first. Insurance and documents can wait until everyone is safe.",
      },
    ],
    followUps: [
      { id: "emergency-accident-location", question: "Where did the accident happen?", salienceQuestion: "How would you locate the {slot}?" },
      { id: "emergency-accident-injury", question: "Is anyone hurt?", salienceQuestion: "Who is hurt in the {slot}?" },
      { id: "emergency-accident-vehicles", question: "How many vehicles are involved?", salienceQuestion: "How many vehicles are in the {slot}?" },
      { id: "emergency-accident-danger", question: "Is there any danger now, like traffic or fire?", salienceQuestion: "What danger remains after the {slot}?" },
    ],
  },
  {
    id: "topic-emergencies-lost-child",
    labelEn: "A Lost Child In Public",
    labelVi: "Trẻ bị lạc nơi công cộng",
    category: "emergencies",
    scenarioDescription:
      "The learner reports a lost child to staff or security, giving the child's age, clothing, and where they were last seen, and a contact number.",
    aiRoleDefinition:
      "Act as calm security or staff who ask the child's age, what they are wearing, where they were last seen, and the learner's phone number.",
    conversationDirections: [
      "Ask how old the child is.",
      "Ask what the child is wearing.",
      "Find out where the child was last seen.",
      "Get the learner's contact number.",
      "Reassure the learner while gathering details.",
    ],
    warmthPatterns: [
      "Stay calm and kind; the learner is frightened.",
      "Reassure the learner that simple descriptions are enough.",
      "Encourage 'my son' or 'my daughter' as clear terms.",
    ],
    seedInputs: ["My son is lost. He is six years old and wearing a blue jacket."],
    detectionPatterns: [
      /\b(?:lost child|my son is lost|my daughter is lost|can't find my child|missing child|wearing a blue|last seen)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "emergency-child-description",
        label: "Age and clothing",
        note: "For a lost child, English helpers need age, clothing, and last seen place. The description can be simple and imperfect.",
      },
      {
        id: "emergency-child-relationship",
        label: "My son, my daughter",
        note: "Vietnamese family terms are richer than English. In public help requests, 'my son' or 'my daughter' is enough and clear.",
      },
    ],
    followUps: [
      { id: "emergency-child-age", question: "How old is the child?", salienceQuestion: "How would you say the {slot} age?" },
      { id: "emergency-child-clothes", question: "What is the child wearing?", salienceQuestion: "How would you describe the {slot} clothing?" },
      { id: "emergency-child-last", question: "Where did you last see the child?", salienceQuestion: "Where was the {slot} last seen?" },
      { id: "emergency-child-contact", question: "How would you give your phone number?", salienceQuestion: "How would helpers reach you about the {slot}?" },
    ],
  },
  {
    id: "topic-emergencies-neighbor-help",
    labelEn: "Asking A Neighbor For Urgent Help",
    labelVi: "Nhờ hàng xóm giúp gấp",
    category: "emergencies",
    scenarioDescription:
      "In an urgent moment the learner asks a neighbor for immediate help, states the one urgent reason first, and says exactly what they need done.",
    aiRoleDefinition:
      "Act as a willing neighbor who responds to an urgent ask, listens for the one key reason, and helps with the specific action requested.",
    conversationDirections: [
      "Let the learner ask for help directly.",
      "Listen for the single urgent reason.",
      "Ask what action the learner needs.",
      "Offer to help right away.",
      "Accept their thanks once it is handled.",
    ],
    warmthPatterns: [
      "Treat a direct urgent ask as appropriate, not rude.",
      "Reassure the learner that one clear reason is enough.",
      "Encourage 'Can you help me now?' in real urgency.",
    ],
    seedInputs: ["Can you help me? I locked myself out and my child is inside."],
    detectionPatterns: [
      /\b(?:urgent help|locked myself out|child is inside|neighbor help|can you help me now|emergency at home|need help quickly)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "emergency-neighbor-direct",
        label: "Direct neighbor ask",
        note: "In urgent moments, 'Can you help me now?' is not rude. It gives the neighbor a clear signal that this is not small talk.",
      },
      {
        id: "emergency-neighbor-one-reason",
        label: "One reason first",
        note: "Say the urgent reason before details: child inside, stove on, water leaking, or someone hurt.",
      },
    ],
    followUps: [
      { id: "emergency-neighbor-help", question: "What urgent help do you need?", salienceQuestion: "How would you ask for help with the {slot}?" },
      { id: "emergency-neighbor-reason", question: "What one reason would you say first?", salienceQuestion: "What makes the {slot} urgent?" },
      { id: "emergency-neighbor-action", question: "What do you need the neighbor to do?", salienceQuestion: "What action would help with the {slot}?" },
      { id: "emergency-neighbor-thanks", question: "How would you thank them after the urgent moment?", salienceQuestion: "How would you thank them for the {slot}?" },
    ],
  },
] as const satisfies readonly FinalThemeSpeakTopic[];
