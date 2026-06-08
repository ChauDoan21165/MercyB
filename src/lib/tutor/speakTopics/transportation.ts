import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-transportation-bus-stop",
    labelEn: "Finding The Right Bus Stop",
    labelVi: "Tìm đúng trạm xe buýt",
    category: "transportation",
    seedInputs: ["Excuse me, is this the bus stop for downtown?"],
    detectionPatterns: [
      /\b(?:bus stop|bus station|downtown bus|which stop|right stop|bus route)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-bus-stop-this",
        label: "Is this the stop",
        note: "A short question like 'Is this the stop for downtown?' is natural when you are unsure at a bus stop.",
      },
      {
        id: "transport-bus-route",
        label: "Route number first",
        note: "English transit talk often uses the route number first: 'Does the number 8 stop here?'",
      },
    ],
    followUps: [
      { id: "transport-bus-stop-destination", question: "Where are you trying to go?", salienceQuestion: "Where do you need to go with the {slot}?" },
      { id: "transport-bus-stop-route", question: "What bus number or route would you ask about?", salienceQuestion: "Which route matters for the {slot}?" },
      { id: "transport-bus-stop-check", question: "How would you check if this is the right stop?", salienceQuestion: "How would you check the {slot}?" },
      { id: "transport-bus-stop-thanks", question: "How would you thank someone who helps?", salienceQuestion: "How would you thank someone for the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-paying-fare",
    labelEn: "Paying A Fare",
    labelVi: "Trả tiền vé xe",
    category: "transportation",
    seedInputs: ["Can I pay with a card on the bus?"],
    detectionPatterns: [
      /\b(?:pay fare|bus fare|transit card|tap card|pay with card|cash fare|ticket machine)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-fare-tap",
        label: "Tap your card",
        note: "In many cities, 'tap' means touch your card to the machine. It is useful everyday transit language.",
      },
      {
        id: "transport-fare-enough",
        label: "Ask before boarding",
        note: "If you are unsure about cash or card, asking before boarding prevents stress at the front of the bus.",
      },
    ],
    followUps: [
      { id: "transport-fare-method", question: "How do you want to pay?", salienceQuestion: "How would you pay for the {slot}?" },
      { id: "transport-fare-ask", question: "How would you ask if card payment works?", salienceQuestion: "How would you ask about paying for the {slot}?" },
      { id: "transport-fare-transfer", question: "How would you ask about a transfer?", salienceQuestion: "Do you need a transfer for the {slot}?" },
      { id: "transport-fare-problem", question: "What would you say if your card does not work?", salienceQuestion: "What would you do if the {slot} fails?" },
    ],
  },
  {
    id: "topic-transportation-asking-directions",
    labelEn: "Asking For Directions",
    labelVi: "Hỏi đường",
    category: "transportation",
    seedInputs: ["Excuse me, how do I get to the train station?"],
    detectionPatterns: [
      /\b(?:ask directions|how do i get|where is|train station|which way|directions to)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-directions-excuse",
        label: "Excuse me first",
        note: "A simple 'Excuse me' before asking directions makes the question sound polite without being formal.",
      },
      {
        id: "transport-directions-place-note",
        label: "Place name clearly",
        note: "Say the destination clearly and early: 'How do I get to the train station?'",
      },
    ],
    followUps: [
      { id: "transport-directions-place", question: "What place are you trying to find?", salienceQuestion: "How would you ask for the {slot}?" },
      { id: "transport-directions-repeat", question: "How would you repeat the first step back?", salienceQuestion: "How would you repeat directions for the {slot}?" },
      { id: "transport-directions-distance", question: "How would you ask how far it is?", salienceQuestion: "How far is the {slot}?" },
      { id: "transport-directions-thanks", question: "How would you thank the person and move on?", salienceQuestion: "How would you close after asking about the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-taxi-rideshare",
    labelEn: "Taking A Taxi Or Rideshare",
    labelVi: "Đi taxi hoặc xe công nghệ",
    category: "transportation",
    seedInputs: ["Can you take me to this address, please?"],
    detectionPatterns: [
      /\b(?:taxi|rideshare|uber|lyft|take me to|driver|pickup spot|drop me off)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-taxi-address",
        label: "Address first",
        note: "Drivers need the destination first. 'Can you take me to this address?' is short and practical.",
      },
      {
        id: "transport-taxi-dropoff",
        label: "Drop me off",
        note: "'Drop me off here' is common English for getting out near a place, not a strange phrase.",
      },
    ],
    followUps: [
      { id: "transport-taxi-destination", question: "What address or place are you going to?", salienceQuestion: "Where is the {slot}?" },
      { id: "transport-taxi-pickup", question: "How would you explain your pickup location?", salienceQuestion: "Where should the driver find the {slot}?" },
      { id: "transport-taxi-drop", question: "Where would you ask to be dropped off?", salienceQuestion: "Where should they drop off the {slot}?" },
      { id: "transport-taxi-thanks", question: "How would you thank the driver at the end?", salienceQuestion: "How would you close the {slot} ride?" },
    ],
  },
  {
    id: "topic-transportation-train-platform",
    labelEn: "Finding A Train Platform",
    labelVi: "Tìm sân ga hoặc đường ray",
    category: "transportation",
    seedInputs: ["Which platform is the train to the airport?"],
    detectionPatterns: [
      /\b(?:train platform|which platform|train to|airport train|track number|station platform)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-platform-word",
        label: "Platform or track",
        note: "Stations may say platform or track. Both mean where the train leaves from.",
      },
      {
        id: "transport-platform-destination-note",
        label: "Destination with 'to'",
        note: "A clear phrase is 'the train to the airport' or 'the train to downtown.'",
      },
    ],
    followUps: [
      { id: "transport-platform-destination", question: "Which train destination do you need?", salienceQuestion: "Which train goes to the {slot}?" },
      { id: "transport-platform-ask", question: "How would you ask for the platform?", salienceQuestion: "How would you find the platform for the {slot}?" },
      { id: "transport-platform-time", question: "How would you ask when it leaves?", salienceQuestion: "When does the {slot} leave?" },
      { id: "transport-platform-confirm", question: "How would you confirm you are on the right platform?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-missed-bus",
    labelEn: "When You Miss The Bus",
    labelVi: "Khi lỡ xe buýt",
    category: "transportation",
    seedInputs: ["I missed my bus. When is the next one?"],
    detectionPatterns: [
      /\b(?:missed my bus|missed the bus|next bus|late bus|bus left|wait for the next)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-missed-next-note",
        label: "Next one",
        note: "After saying 'I missed my bus,' asking 'When is the next one?' is natural and short.",
      },
      {
        id: "transport-missed-not-blame",
        label: "No need to explain too much",
        note: "You can keep it practical. Transit staff usually need the route and destination more than a long story.",
      },
    ],
    followUps: [
      { id: "transport-missed-route", question: "Which bus did you miss?", salienceQuestion: "Which route was the {slot}?" },
      { id: "transport-missed-next", question: "How would you ask when the next one comes?", salienceQuestion: "When is the next {slot}?" },
      { id: "transport-missed-alternative", question: "What other way could you get there?", salienceQuestion: "What backup plan works for the {slot}?" },
      { id: "transport-missed-message", question: "How would you tell someone you will be late?", salienceQuestion: "How would you explain the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-getting-lost",
    labelEn: "When You Are Lost",
    labelVi: "Khi bị lạc đường",
    category: "transportation",
    seedInputs: ["I think I am lost. Can you help me?"],
    detectionPatterns: [
      /\b(?:i am lost|i'm lost|got lost|wrong way|cannot find|can't find|help me find)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-lost-calm",
        label: "Calm first sentence",
        note: "'I think I'm lost. Can you help me?' is clear and low-pressure, even if you feel nervous.",
      },
      {
        id: "transport-lost-map-note",
        label: "Use your map",
        note: "It is natural to show your phone and say, 'I'm trying to get here.' You do not need perfect place pronunciation.",
      },
    ],
    followUps: [
      { id: "transport-lost-place", question: "Where are you trying to go?", salienceQuestion: "Where is the {slot}?" },
      { id: "transport-lost-help", question: "How would you ask someone for help?", salienceQuestion: "How would you ask for help with the {slot}?" },
      { id: "transport-lost-map", question: "How would you use your map in the question?", salienceQuestion: "How would you show the {slot} on your phone?" },
      { id: "transport-lost-next", question: "How would you ask for the next step?", salienceQuestion: "What is the next step to reach the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-airport-ride",
    labelEn: "Getting To The Airport",
    labelVi: "Đi ra sân bay",
    category: "transportation",
    seedInputs: ["What is the best way to get to the airport?"],
    detectionPatterns: [
      /\b(?:airport|get to the airport|flight|airport bus|airport train|taxi to airport|leave for airport)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-airport-best-way",
        label: "Best way question",
        note: "'What is the best way to get to the airport?' lets the other person suggest bus, train, or taxi.",
      },
      {
        id: "transport-airport-time-buffer",
        label: "Time buffer",
        note: "Airport talk often includes time: 'My flight is at 3.' This helps people give safer advice.",
      },
    ],
    followUps: [
      { id: "transport-airport-flight", question: "What time is your flight?", salienceQuestion: "What time is the {slot}?" },
      { id: "transport-airport-method", question: "What transportation option would you ask about?", salienceQuestion: "How could you get to the {slot}?" },
      { id: "transport-airport-leave", question: "How would you ask what time to leave?", salienceQuestion: "When should you leave for the {slot}?" },
      { id: "transport-airport-confirm", question: "How would you confirm the route?", salienceQuestion: "How would you confirm the {slot} route?" },
    ],
  },
  {
    id: "topic-transportation-parking",
    labelEn: "Asking About Parking",
    labelVi: "Hỏi chỗ đậu xe",
    category: "transportation",
    seedInputs: ["Is there parking near the building?"],
    detectionPatterns: [
      /\b(?:parking|park my car|parking lot|street parking|garage|parking spot|near the building)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-parking-is-there",
        label: "Is there parking",
        note: "'Is there parking near...?' is the natural question. You do not need to say 'a parking' in this context.",
      },
      {
        id: "transport-parking-paid",
        label: "Paid or free",
        note: "In Canada and the US, asking 'Is it paid parking?' or 'Is parking free?' is practical and normal.",
      },
    ],
    followUps: [
      { id: "transport-parking-place", question: "Where do you need to park?", salienceQuestion: "Where is the {slot}?" },
      { id: "transport-parking-ask", question: "How would you ask if parking is available?", salienceQuestion: "How would you ask about parking for the {slot}?" },
      { id: "transport-parking-cost", question: "How would you ask if parking is free?", salienceQuestion: "How much is parking for the {slot}?" },
      { id: "transport-parking-time", question: "How would you ask how long you can park there?", salienceQuestion: "How long can you park near the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-bike-walk",
    labelEn: "Walking Or Biking Somewhere",
    labelVi: "Đi bộ hoặc đi xe đạp",
    category: "transportation",
    seedInputs: ["Is it safe to walk there from here?"],
    detectionPatterns: [
      /\b(?:walk there|bike there|safe to walk|walking route|bike lane|sidewalk|from here)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-walk-safe-note",
        label: "Safety question",
        note: "Asking 'Is it safe to walk there?' is useful in a new city and does not sound weak.",
      },
      {
        id: "transport-bike-lane",
        label: "Bike lane",
        note: "For biking, 'bike lane' is a helpful phrase. It means the marked space for bikes on the road.",
      },
    ],
    followUps: [
      { id: "transport-walk-destination", question: "Where do you want to walk or bike?", salienceQuestion: "Where is the {slot}?" },
      { id: "transport-walk-safe", question: "How would you ask if it is safe?", salienceQuestion: "How safe is the {slot}?" },
      { id: "transport-walk-time", question: "How would you ask how long it takes?", salienceQuestion: "How long does the {slot} take?" },
      { id: "transport-walk-route", question: "How would you ask for the best route?", salienceQuestion: "What route works for the {slot}?" },
    ],
  },
];
