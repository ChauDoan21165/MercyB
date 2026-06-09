import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D3SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-housing-daily-talking-landlord",
    labelEn: "Talking To A Landlord",
    labelVi: "Nói chuyện với chủ nhà",
    category: "housing-daily",
    scenarioDescription:
      "The learner contacts a landlord or property manager to ask about rent, rules, access, notices, or a small problem in the home.",
    aiRoleDefinition:
      "Act as a landlord or property manager who responds professionally, asks for apartment details, and helps the learner make a clear request.",
    conversationDirections: [
      "Ask the learner to state their unit, name, and reason for contacting the landlord.",
      "Prompt one clear request before extra background details.",
      "Practice asking about rent due dates, lease rules, visitor rules, or building access.",
      "Ask the learner to give a time frame or deadline if the issue matters soon.",
      "Let the learner follow up politely if the landlord has not replied.",
      "End by confirming the agreement, date, or next action in writing.",
    ],
    warmthPatterns: [
      "Use respectful but direct language: 'I wanted to ask about...' and 'Could you confirm...?'",
      "Keep conflict calm and specific.",
      "Prefer written confirmation for agreements and notices.",
    ],
    seedInputs: ["I need to ask my landlord about the lease."],
    detectionPatterns: [
      /\b(?:landlord|property manager|building manager|lease question|rent due|visitor rules|talk to my landlord|ask my landlord)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-daily-landlord-article",
        label: "My landlord, the lease",
        note: "Vietnamese learners may drop articles and possessives: 'ask landlord about lease.' In English housing messages, 'my landlord' and 'the lease' sound complete and natural.",
      },
      {
        id: "housing-daily-landlord-preposition",
        label: "Ask about, not ask for",
        note: "'Hoi ve' often becomes 'ask for the lease rule.' Use 'ask about the lease rule' when you need information, and 'ask for a copy' when you need a document.",
      },
    ],
    followUps: [
      { id: "housing-daily-landlord-reason", question: "Why do you need to contact the landlord?", salienceQuestion: "What should the landlord know about the {slot}?" },
      { id: "housing-daily-landlord-unit", question: "How would you give your name and unit number?", salienceQuestion: "Which unit is connected to the {slot}?" },
      { id: "housing-daily-landlord-request", question: "What one clear request would you make?", salienceQuestion: "What do you need about the {slot}?" },
      { id: "housing-daily-landlord-time", question: "When do you need an answer?", salienceQuestion: "When does the {slot} matter?" },
      { id: "housing-daily-landlord-confirm", question: "How would you ask for confirmation in writing?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-housing-daily-viewing-apartment",
    labelEn: "Viewing An Apartment",
    labelVi: "Đi xem căn hộ",
    category: "housing-daily",
    scenarioDescription:
      "The learner schedules and attends an apartment viewing, asks practical questions, checks the unit, and decides whether to apply.",
    aiRoleDefinition:
      "Act as a leasing agent or landlord showing the apartment, answering questions about cost, utilities, rules, and move-in details.",
    conversationDirections: [
      "Ask the learner to request a viewing time with two options.",
      "Practice questions about rent, deposit, utilities, parking, laundry, and internet.",
      "Ask what the learner wants to check inside the apartment.",
      "Prompt questions about noise, safety, building rules, and neighborhood basics.",
      "Let the learner ask how to apply and what documents are required.",
      "End by confirming the viewing time or next application step.",
    ],
    warmthPatterns: [
      "Keep the tone friendly but not salesy.",
      "Make the learner's practical checks feel normal.",
      "Use clear summaries for costs and move-in dates.",
    ],
    seedInputs: ["I am interested in viewing the apartment."],
    detectionPatterns: [
      /\b(?:viewing the apartment|view an apartment|apartment viewing|see the apartment|tour the apartment|rental viewing|interested in viewing)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-daily-viewing-preposition",
        label: "Interested in viewing",
        note: "'Muon xem nha' can become 'interested to view.' In rental English, 'I'm interested in viewing the apartment' is the natural frame.",
      },
      {
        id: "housing-daily-viewing-tense",
        label: "When is it available?",
        note: "Learners may ask 'When it available?' because Vietnamese does not need an English-style be verb. The viewing phrase is 'When is it available?' or 'When can I move in?'",
      },
    ],
    followUps: [
      { id: "housing-daily-viewing-time", question: "What time would you suggest for the viewing?", salienceQuestion: "When can you view the {slot}?" },
      { id: "housing-daily-viewing-cost", question: "How would you ask about rent, deposit, and utilities?", salienceQuestion: "What does the {slot} cost?" },
      { id: "housing-daily-viewing-check", question: "What would you check carefully inside?", salienceQuestion: "How would you check the {slot}?" },
      { id: "housing-daily-viewing-rules", question: "What building rule would you ask about?", salienceQuestion: "What rule affects the {slot}?" },
      { id: "housing-daily-viewing-apply", question: "How would you ask how to apply?", salienceQuestion: "How would you apply for the {slot}?" },
    ],
  },
  {
    id: "topic-housing-daily-maintenance-issue",
    labelEn: "Reporting A Maintenance Issue",
    labelVi: "Báo sự cố cần sửa chữa",
    category: "housing-daily",
    scenarioDescription:
      "The learner reports a repair problem such as a leak, clogged drain, broken appliance, heating issue, pest issue, or unsafe condition.",
    aiRoleDefinition:
      "Act as a property manager taking a maintenance request, asking for location, urgency, access time, and whether photos are available.",
    conversationDirections: [
      "Ask what item or area is not working before asking for background.",
      "Prompt the learner to describe when the problem started and how serious it is.",
      "Ask whether there is water, heat, electricity, safety, or access urgency.",
      "Practice offering photos or a short video of the problem.",
      "Ask when maintenance can enter the unit and how to contact the learner.",
      "End by confirming the request number, visit window, and next step.",
    ],
    warmthPatterns: [
      "Acknowledge inconvenience without over-apologizing.",
      "Use concrete repair language: item, location, urgency, access time.",
      "Keep urgent issues calm and action-focused.",
    ],
    seedInputs: ["The sink is leaking and I need maintenance help."],
    detectionPatterns: [
      /\b(?:maintenance issue|maintenance help|sink is leaking|leak|clogged drain|broken appliance|heater is not working|repair request|fix it)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-daily-maintenance-tense",
        label: "It started yesterday",
        note: "For repair timing, learners may say 'it start yesterday.' A clear maintenance report uses past tense: 'It started yesterday' or 'It has been leaking since yesterday.'",
      },
      {
        id: "housing-daily-maintenance-article",
        label: "The sink, the heater",
        note: "Vietnamese can say the object without an article, so 'sink leaking' may feel enough. In English, 'the sink is leaking' or 'the heater is not working' gives a complete repair sentence.",
      },
      {
        id: "housing-daily-maintenance-preposition",
        label: "In my unit",
        note: "'O phong toi' can become 'at my room.' For apartments, 'in my unit' or 'in my apartment' is the natural maintenance phrase.",
      },
    ],
    followUps: [
      { id: "housing-daily-maintenance-item", question: "What needs to be fixed?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "housing-daily-maintenance-start", question: "When did the problem start?", salienceQuestion: "When did the {slot} start?" },
      { id: "housing-daily-maintenance-urgent", question: "Is it urgent, or can it wait?", salienceQuestion: "How urgent is the {slot}?" },
      { id: "housing-daily-maintenance-access", question: "When can someone enter to check it?", salienceQuestion: "When can someone check the {slot}?" },
      { id: "housing-daily-maintenance-confirm", question: "How would you confirm the repair request?", salienceQuestion: "How would you confirm help for the {slot}?" },
    ],
  },
] as const satisfies readonly D3SpeakTopic[];
