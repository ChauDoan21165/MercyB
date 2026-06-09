import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D5SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-driver-ride-share-passenger-communication",
    labelEn: "Ride-share Passenger Communication",
    labelVi: "Giao tiếp với khách đi xe",
    category: "driver-english",
    scenarioDescription:
      "The learner is a ride-share driver who needs to greet passengers, confirm names and destinations, discuss pickup details, and handle simple route or comfort requests.",
    aiRoleDefinition:
      "Act as a ride-share passenger who gives pickup details, asks about the route, and responds naturally when the driver confirms safety and destination information.",
    conversationDirections: [
      "Open with a short greeting and confirm the passenger's name before driving.",
      "Ask the learner to confirm the destination and any pickup-location confusion.",
      "Practice route choices such as highway, local roads, tolls, or avoiding traffic.",
      "Prompt polite answers to requests about music, temperature, windows, luggage, or extra stops.",
      "Practice explaining a delay or missed turn without sounding defensive.",
      "End by confirming the drop-off spot and thanking the passenger.",
    ],
    warmthPatterns: [
      "Keep the driver voice calm, brief, and professional.",
      "Use safety-first reassurance: 'Let me confirm the address before we go.'",
      "Model polite boundaries around extra stops, unsafe pickups, or unclear names.",
    ],
    seedInputs: ["Hi, are you Minh? I am your ride-share driver."],
    detectionPatterns: [
      /\b(?:ride-share|rideshare|passenger|pickup location|drop-off|drop off|confirm your name|uber|lyft|extra stop)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "driver-rideshare-compound",
        label: "Pickup and drop-off",
        note: "Vietnamese can use one general idea like 'don' or 'tra' with context. Driver English often uses fixed service words: 'pickup location,' 'drop-off spot,' and 'extra stop.'",
      },
      {
        id: "driver-rideshare-confirm-object",
        label: "Confirm your destination",
        note: "Learners may say 'confirm destination for you.' In app-driver English, 'confirm your destination' or 'confirm the address' sounds direct and professional.",
      },
    ],
    followUps: [
      { id: "driver-rideshare-name", question: "How would you confirm the passenger's name?", salienceQuestion: "How would you confirm the {slot} before driving?" },
      { id: "driver-rideshare-destination", question: "How would you confirm the destination address?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "driver-rideshare-route", question: "How would you ask if they prefer a route?", salienceQuestion: "What route works best for the {slot}?" },
      { id: "driver-rideshare-comfort", question: "How would you answer a comfort request politely?", salienceQuestion: "How would you handle the {slot} request?" },
      { id: "driver-rideshare-dropoff", question: "How would you confirm the exact drop-off spot?", salienceQuestion: "Where should the {slot} end?" },
    ],
  },
  {
    id: "topic-driver-delivery-instructions",
    labelEn: "Delivery Instructions",
    labelVi: "Hướng dẫn giao hàng",
    category: "driver-english",
    scenarioDescription:
      "The learner is a delivery driver who needs to read instructions, contact a customer, find an entrance, handle missing gate codes, and confirm a successful delivery.",
    aiRoleDefinition:
      "Act as a delivery customer or building contact who gives practical instructions, answers location questions, and expects clear updates about the order.",
    conversationDirections: [
      "Ask the learner to confirm the order name, address, and delivery note.",
      "Practice asking for an apartment number, buzzer code, gate code, or entrance.",
      "Prompt the learner to explain that they are outside, parked nearby, or unable to access the building.",
      "Practice clarifying whether to hand the order to the customer or leave it at the door.",
      "Ask what photo, message, or receipt confirmation is needed.",
      "Handle a late delivery or wrong address with a short apology and next step.",
    ],
    warmthPatterns: [
      "Use concise service updates: 'I'm at the main entrance now.'",
      "Keep apologies short and action-focused.",
      "Respect customer privacy and avoid asking for unnecessary personal details.",
    ],
    seedInputs: ["Hi, I am outside with your delivery. What is the gate code?"],
    detectionPatterns: [
      /\b(?:delivery instructions|gate code|buzzer code|apartment number|leave it at the door|hand it to me|delivery driver|main entrance)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "driver-delivery-at-outside",
        label: "I am outside",
        note: "Vietnamese location phrases can map to 'I am at outside.' The natural customer message is 'I am outside' or 'I am at the main entrance.'",
      },
      {
        id: "driver-delivery-leave-at-door",
        label: "Leave it at the door",
        note: "Delivery apps use the fixed phrase 'leave it at the door.' Learners may say 'put it in front door,' but 'at the door' is the professional instruction.",
      },
    ],
    followUps: [
      { id: "driver-delivery-address", question: "How would you confirm the delivery address?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "driver-delivery-code", question: "How would you ask for the gate or buzzer code?", salienceQuestion: "What code do you need for the {slot}?" },
      { id: "driver-delivery-entrance", question: "How would you ask which entrance to use?", salienceQuestion: "Which entrance works for the {slot}?" },
      { id: "driver-delivery-drop", question: "How would you confirm where to leave the order?", salienceQuestion: "Where should you leave the {slot}?" },
      { id: "driver-delivery-late", question: "How would you explain a short delay?", salienceQuestion: "What delayed the {slot}?" },
    ],
  },
  {
    id: "topic-driver-traffic-stop-navigation",
    labelEn: "Traffic Stops And Navigation",
    labelVi: "Dừng xe và chỉ đường",
    category: "driver-english",
    scenarioDescription:
      "The learner is driving for work and needs to understand a traffic stop, talk about license and insurance, and use GPS or navigation vocabulary with passengers or customers.",
    aiRoleDefinition:
      "Act as either a calm police officer during a traffic stop or a passenger who asks about GPS, road closures, turns, and arrival time.",
    conversationDirections: [
      "Practice responding calmly to a traffic stop with license, registration, and insurance.",
      "Ask the learner to explain they are a ride-share or delivery driver if relevant.",
      "Practice GPS vocabulary: reroute, turn left, exit, merge, U-turn, arrival time, and road closure.",
      "Prompt the learner to ask for repetition if instructions are fast or unclear.",
      "Handle navigation mistakes with a short update and a corrected plan.",
      "End by confirming the next direction, lane, or safe place to stop.",
    ],
    warmthPatterns: [
      "Keep the tone especially calm and respectful during authority interactions.",
      "Use clear, literal navigation language without extra storytelling.",
      "Normalize asking for repetition when safety depends on understanding.",
    ],
    seedInputs: ["Officer, I have my license and insurance here."],
    detectionPatterns: [
      /\b(?:traffic stop|police officer|license and insurance|registration|gps|navigation|reroute|road closure|turn left|merge|u-turn)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "driver-stop-documents",
        label: "License, registration, insurance",
        note: "Traffic-stop English uses document names in a set order. Vietnamese learners may translate more generally as 'driving paper,' but officers expect 'license, registration, and insurance.'",
      },
      {
        id: "driver-navigation-turn-onto",
        label: "Turn onto, merge onto",
        note: "Vietnamese can use one verb for entering a road. GPS English often separates 'turn onto Main Street' and 'merge onto the highway.'",
      },
    ],
    followUps: [
      { id: "driver-stop-docs", question: "How would you say you have your documents ready?", salienceQuestion: "Which documents connect to the {slot}?" },
      { id: "driver-stop-role", question: "How would you explain you are working as a driver?", salienceQuestion: "How would you explain the {slot}?" },
      { id: "driver-nav-repeat", question: "How would you ask someone to repeat a direction?", salienceQuestion: "How would you repeat the {slot} safely?" },
      { id: "driver-nav-reroute", question: "How would you explain the GPS is rerouting?", salienceQuestion: "What changed with the {slot}?" },
      { id: "driver-nav-stop", question: "How would you ask where to stop safely?", salienceQuestion: "Where is a safe place for the {slot}?" },
    ],
  },
] as const satisfies readonly D5SpeakTopic[];
