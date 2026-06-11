import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Transportation theme — deepened to full D4 metadata depth
// (scenarioDescription, aiRoleDefinition, conversationDirections, warmthPatterns).
// 13 topics covering the real situations a Vietnamese learner meets when getting
// around in English: bus stops, fares, directions, taxi/rideshare, train platforms,
// missed buses, being lost, airport rides, parking, walking/biking, distance
// questions, map reading, and transferring between lines.
// Copy is warm, adult, low-shame, and strictly about COMMUNICATION.
// l1InterferenceNotes quote the Vietnamese source phrase with full diacritics —
// friendly context, never a grammar correction.

type D4SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const transportationSpeakTopics: readonly D4SpeakTopic[] = [
  {
    id: "topic-transportation-bus-stop",
    labelEn: "Finding The Right Bus Stop",
    labelVi: "Tìm đúng trạm xe buýt",
    category: "transportation",
    scenarioDescription:
      "The learner is standing at what might be the wrong bus stop and needs to confirm the route, ask whether a specific bus stops here, and understand which direction the bus goes so they don't end up on the wrong side of the street.",
    aiRoleDefinition:
      "Act as a helpful passerby or transit worker who tells the learner whether this is the right stop, explains which bus number stops here, and points them to the correct side of the street if needed.",
    conversationDirections: [
      "Let the learner open by asking whether this is the right stop for their destination.",
      "Confirm or correct — tell them the bus number and direction.",
      "If they're on the wrong side, point them across the road in friendly terms.",
      "Let the learner ask when the next bus comes.",
      "Confirm the destination stop name so they know when to get off.",
      "Close with a short, warm send-off — 'You've got the right one!'",
    ],
    warmthPatterns: [
      "Keep corrections gentle — 'actually you want the other side' beats a long explanation.",
      "Give the bus number before anything else — it's the most useful piece of information.",
      "Reassure the learner that asking is the right move at an unfamiliar stop.",
    ],
    seedInputs: [
      "Excuse me, is this the bus stop for downtown?",
      "Does the number 8 bus stop here?",
      "Am I on the right side for the bus going to the mall?",
    ],
    detectionPatterns: [
      /\b(?:bus stop|bus station|downtown bus|which stop|right stop|bus route)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-bus-stop-this",
        label: "'Is this the stop?' — đây có phải trạm không",
        note: "A short question like 'Is this the stop for downtown?' is natural when you are unsure. 'Đây có phải trạm xe buýt đến trung tâm không?' is the Vietnamese instinct — the English is shorter but means the same thing.",
      },
      {
        id: "transport-bus-route",
        label: "Route number first",
        note: "English transit talk often uses the route number first: 'Does the number 8 stop here?' Vietnamese typically names the destination first — flipping to the number first is the faster way to get a yes or no.",
      },
      {
        id: "transport-bus-stop-which-side",
        label: "Which side of the road",
        note: "Buses going in opposite directions stop on opposite sides of the street. Asking 'Which side do I need for downtown?' catches this before you board the wrong bus. Staff and locals answer this all the time.",
      },
      {
        id: "transport-bus-stop-next-l1",
        label: "'When's the next one?' — bao lâu nữa có xe",
        note: "'Bao lâu nữa có xe' (how long until the next one?) maps to 'When's the next bus?' or 'How long until the next one?' Both are short and work at any stop — no app needed.",
      },
    ],
    followUps: [
      { id: "transport-bus-stop-destination", question: "Where are you trying to go?", salienceQuestion: "Where do you need to go with the {slot}?" },
      { id: "transport-bus-stop-route", question: "What bus number or route would you ask about?", salienceQuestion: "Which route matters for the {slot}?" },
      { id: "transport-bus-stop-check", question: "How would you check if this is the right stop?", salienceQuestion: "How would you check the {slot}?" },
      { id: "transport-bus-stop-side", question: "How would you ask if you're on the right side of the road?", salienceQuestion: "Which side is the {slot} on?" },
      { id: "transport-bus-stop-next", question: "How would you ask when the next bus comes?", salienceQuestion: "How long until the next {slot}?" },
      { id: "transport-bus-stop-thanks", question: "How would you thank someone who helps?", salienceQuestion: "How would you thank someone for the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-paying-fare",
    labelEn: "Paying A Fare",
    labelVi: "Trả tiền vé xe",
    category: "transportation",
    scenarioDescription:
      "The learner is about to board a bus or train and needs to confirm whether they can pay by card or cash, ask about day passes or single-ride prices, and understand how to tap or use the machine to avoid holding up the queue.",
    aiRoleDefinition:
      "Act as a bus driver or transit booth worker who explains the accepted payment methods, describes how to use the card reader, and gives the price for a single trip or day pass.",
    conversationDirections: [
      "Let the learner ask whether card or cash is accepted before boarding.",
      "Explain the fare options — single ride, day pass, or exact-change cash.",
      "Walk the learner through how to tap or use the fare machine.",
      "Handle a 'my card isn't working' moment calmly.",
      "Let the learner ask about a transfer if they need one.",
      "Close by confirming the fare went through and directing them to a seat.",
    ],
    warmthPatterns: [
      "Keep fare instructions short — one action at a time.",
      "Treat payment problems as routine — every driver has seen a card fail.",
      "Confirm the fare total before the learner pays so there are no surprises.",
    ],
    seedInputs: [
      "Can I pay with a card on the bus?",
      "How much is a single ride to downtown?",
      "My card isn't tapping — what should I do?",
    ],
    detectionPatterns: [
      /\b(?:pay fare|bus fare|transit card|tap card|pay with card|cash fare|ticket machine)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-fare-tap",
        label: "'Tap' your card — chạm thẻ",
        note: "In many cities, 'tap' means touch your card to the reader — no swipe or insert needed. 'Chạm thẻ' is the Vietnamese equivalent. Knowing the word 'tap' lets you follow the machine's instructions without asking for help.",
      },
      {
        id: "transport-fare-enough",
        label: "Ask before boarding",
        note: "If you are unsure about cash or card, asking before boarding prevents stress at the front of the bus. 'Do you take card?' or 'Is it exact change only?' takes two seconds and saves the whole queue a wait.",
      },
      {
        id: "transport-fare-transfer-l1",
        label: "Transfer ticket — vé chuyển tuyến",
        note: "'Vé chuyển tuyến' is 'a transfer.' On many systems, your first fare buys you a transfer to another bus or train within a set time — asking 'Does this include a transfer?' can save you paying twice.",
      },
      {
        id: "transport-fare-day-pass",
        label: "Day pass — vé ngày",
        note: "'Vé ngày' is 'a day pass' — unlimited rides for one day. If you're making three or more trips, asking 'Is there a day pass?' often saves money. The driver or booth worker can tell you in one sentence.",
      },
    ],
    followUps: [
      { id: "transport-fare-method", question: "How do you want to pay?", salienceQuestion: "How would you pay for the {slot}?" },
      { id: "transport-fare-ask", question: "How would you ask if card payment works?", salienceQuestion: "How would you ask about paying for the {slot}?" },
      { id: "transport-fare-price", question: "How would you ask the fare price?", salienceQuestion: "How much is the {slot} fare?" },
      { id: "transport-fare-transfer", question: "How would you ask about a transfer?", salienceQuestion: "Do you need a transfer for the {slot}?" },
      { id: "transport-fare-daypass", question: "How would you ask about a day pass?", salienceQuestion: "Is there a day pass for the {slot}?" },
      { id: "transport-fare-problem", question: "What would you say if your card does not work?", salienceQuestion: "What would you do if the {slot} fails?" },
    ],
  },
  {
    id: "topic-transportation-asking-directions",
    labelEn: "Asking For Directions",
    labelVi: "Hỏi đường",
    category: "transportation",
    scenarioDescription:
      "The learner is on foot in an unfamiliar area and needs to stop someone to ask how to get to a specific place, follow multi-step directions in English, and confirm they understood before walking off.",
    aiRoleDefinition:
      "Act as a friendly local who gives clear, step-by-step walking directions, checks whether the learner understood, and offers a landmark to look out for.",
    conversationDirections: [
      "Let the learner open with 'Excuse me' and name the destination.",
      "Give two or three short direction steps — turn left, go straight, look for the sign.",
      "Mention one clear landmark so the learner can confirm they're on track.",
      "Ask the learner to repeat the first step back to check understanding.",
      "Offer an estimate of walking time.",
      "Close warmly — 'You can't miss it' or 'It's just around the corner.'",
    ],
    warmthPatterns: [
      "Keep direction steps short and numbered — three steps max before a landmark.",
      "Offer a landmark before the learner has to ask — it doubles as a checkpoint.",
      "Treat 'can you repeat that?' as the smartest thing the learner can say.",
    ],
    seedInputs: [
      "Excuse me, how do I get to the train station?",
      "Sorry to bother you — I'm trying to find the library.",
      "Could you point me toward the nearest pharmacy?",
    ],
    detectionPatterns: [
      /\b(?:ask directions|how do i get|where is|train station|which way|directions to)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-directions-excuse",
        label: "'Excuse me' — xin lỗi cho hỏi",
        note: "'Xin lỗi cho hỏi' (sorry to ask) maps to 'Excuse me' before a question. In English, 'Excuse me' is the polite opener for a stranger — 'Sorry' alone can imply you did something wrong, which is the wrong tone.",
      },
      {
        id: "transport-directions-place-note",
        label: "Destination clearly first",
        note: "Say the destination clearly and early: 'How do I get to the train station?' Vietnamese often builds context before the destination — in English, naming the place first unlocks the answer faster.",
      },
      {
        id: "transport-directions-repeat-l1",
        label: "Repeating directions back",
        note: "After getting directions, confirm the first step: 'So I turn left at the lights?' 'Tôi hiểu rồi' (I understand) is the Vietnamese instinct — but checking aloud in English catches a misunderstanding before you walk the wrong way.",
      },
      {
        id: "transport-directions-landmark-l1",

        label: "Landmarks over street names",
        note: "In English directions, landmarks matter as much as street names: 'You'll see a big red building on your right.' If the street name is hard to catch, ask 'What's the landmark near it?' to anchor the directions in something visible.",
      },
    ],
    followUps: [
      { id: "transport-directions-place", question: "What place are you trying to find?", salienceQuestion: "How would you ask for the {slot}?" },
      { id: "transport-directions-repeat", question: "How would you repeat the first step back?", salienceQuestion: "How would you repeat directions for the {slot}?" },
      { id: "transport-directions-distance", question: "How would you ask how far it is?", salienceQuestion: "How far is the {slot}?" },
      { id: "transport-directions-landmark", question: "How would you ask about a landmark to look for?", salienceQuestion: "What landmark is near the {slot}?" },
      { id: "transport-directions-time", question: "How would you ask how long it takes to walk?", salienceQuestion: "How long to walk to the {slot}?" },
      { id: "transport-directions-thanks", question: "How would you thank the person and move on?", salienceQuestion: "How would you close after asking about the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-taxi-rideshare",
    labelEn: "Taking A Taxi Or Rideshare",
    labelVi: "Đi taxi hoặc xe công nghệ",
    category: "transportation",
    scenarioDescription:
      "The learner needs to book or hail a taxi or rideshare, confirm the pickup location clearly, give the destination, and handle any small talk or questions from the driver during the trip.",
    aiRoleDefinition:
      "Act as a taxi driver or rideshare driver who confirms the pickup address, asks about the destination, and keeps light conversation during the ride without overwhelming the learner.",
    conversationDirections: [
      "Let the learner confirm the pickup location or their name for a rideshare.",
      "Ask for the destination and confirm the route or estimated time.",
      "Let the learner describe a preferred route or stop — 'Can we take the highway?'",
      "Practice a small-talk exchange if the driver initiates one.",
      "Let the learner ask to be dropped off slightly early or at a specific spot.",
      "Close by confirming the fare, tipping expectations, and saying goodbye.",
    ],
    warmthPatterns: [
      "Keep the driver's small talk short and easy to respond to — one question at a time.",
      "Make the drop-off request feel like a normal preference, not a demand.",
      "Confirm the fare amount before the learner gets out so there's no confusion.",
    ],
    seedInputs: [
      "Can you take me to this address, please?",
      "Hi, I booked a ride — I'm at the corner of Main and First.",
      "Could you drop me off just before the intersection?",
    ],
    detectionPatterns: [
      /\b(?:taxi|rideshare|uber|lyft|take me to|driver|pickup spot|drop me off)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-taxi-address",
        label: "Address first — địa chỉ nơi đến",
        note: "Drivers need the destination first. 'Can you take me to this address?' is short and practical. 'Địa chỉ nơi đến' (destination address) — having it ready on your phone means you never need to spell it aloud.",
      },
      {
        id: "transport-taxi-dropoff",
        label: "'Drop me off here' — cho tôi xuống đây",
        note: "'Cho tôi xuống đây' (let me off here) is 'Drop me off here' in English. It is a completely normal, casual phrase — not rude. Drivers hear it dozens of times a day and respond with a smooth stop.",
      },
      {
        id: "transport-taxi-rideshare-name",
        label: "Confirming your name for rideshare",
        note: "Rideshare drivers ask 'Are you [name]?' before you get in. Say 'Yes, that's me' or simply confirm your name. This safety check is standard — the driver is not being unfriendly, they just need to confirm the booking.",
      },
      {
        id: "transport-taxi-tip",
        label: "Tipping in rideshares and taxis",
        note: "In many English-speaking countries, tipping a taxi or rideshare driver 10–20% is common. 'Tiền tip' is 'a tip.' If you're paying cash, 'Keep the change' is the short phrase for leaving a tip automatically.",
      },
    ],
    followUps: [
      { id: "transport-taxi-destination", question: "What address or place are you going to?", salienceQuestion: "Where is the {slot}?" },
      { id: "transport-taxi-pickup", question: "How would you explain your pickup location?", salienceQuestion: "Where should the driver find the {slot}?" },
      { id: "transport-taxi-drop", question: "Where would you ask to be dropped off?", salienceQuestion: "Where should they drop off the {slot}?" },
      { id: "transport-taxi-route", question: "How would you ask to take a specific route?", salienceQuestion: "How would you request a route for the {slot}?" },
      { id: "transport-taxi-fare", question: "How would you ask about the estimated fare?", salienceQuestion: "How much will the {slot} cost?" },
      { id: "transport-taxi-thanks", question: "How would you thank the driver at the end?", salienceQuestion: "How would you close the {slot} ride?" },
    ],
  },
  {
    id: "topic-transportation-train-platform",
    labelEn: "Finding A Train Platform",
    labelVi: "Tìm sân ga hoặc đường ray",
    category: "transportation",
    scenarioDescription:
      "The learner arrives at a large train or subway station, needs to find the right platform or track for their train, confirm the departure time, and make sure they are heading in the correct direction before the doors close.",
    aiRoleDefinition:
      "Act as a station attendant or fellow passenger who tells the learner which platform to use, confirms the departure time, and points them toward the right escalator or gate.",
    conversationDirections: [
      "Let the learner ask which platform their train leaves from.",
      "Confirm the platform number and the direction or line name.",
      "Let the learner ask what time the train leaves and when it arrives.",
      "Point out whether they need to go up, down, or through a gate.",
      "Handle a 'did I miss it?' question calmly — give the next departure time.",
      "Close by confirming the learner has everything they need to board.",
    ],
    warmthPatterns: [
      "Give platform and departure time in one sentence — the two most-needed pieces.",
      "Point physically if you can — 'it's down the escalator on the right' is faster than words alone.",
      "Reassure the learner about the next train if they've missed theirs.",
    ],
    seedInputs: [
      "Which platform is the train to the airport?",
      "Is this the right platform for the 3 o'clock to downtown?",
      "Excuse me — did I miss the last train?",
    ],
    detectionPatterns: [
      /\b(?:train platform|which platform|train to|airport train|track number|station platform)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-platform-word",
        label: "Platform or track — sân ga hoặc đường ray",
        note: "Stations may say 'platform' or 'track' — both mean where the train leaves from. 'Sân ga' is closer to 'platform'; 'đường ray' is 'track.' Knowing both lets you follow signs and announcements whichever word they use.",
      },
      {
        id: "transport-platform-destination-note",
        label: "Destination with 'to'",
        note: "A clear phrase is 'the train to the airport' or 'the train to downtown.' Vietnamese drops prepositions in this context — adding 'to' before the destination is the one small change that makes the English version sound natural.",
      },
      {
        id: "transport-platform-confirm-l1",

        label: "Confirming before boarding",
        note: "Before stepping onto the train, a quick 'Is this the train to X?' to a conductor or nearby passenger takes two seconds and prevents a wrong-direction ride. 'Xác nhận trước khi lên tàu' (confirm before boarding) is a habit worth building.",
      },
      {
        id: "transport-platform-announcement",
        label: "Station announcements",
        note: "Platform announcements can be fast and hard to follow. If you miss the platform number, it's fine to ask again: 'Sorry — which platform for the 3 o'clock?' Most passengers and staff hear this all the time and are happy to repeat.",
      },
    ],
    followUps: [
      { id: "transport-platform-destination", question: "Which train destination do you need?", salienceQuestion: "Which train goes to the {slot}?" },
      { id: "transport-platform-ask", question: "How would you ask for the platform?", salienceQuestion: "How would you find the platform for the {slot}?" },
      { id: "transport-platform-time", question: "How would you ask when it leaves?", salienceQuestion: "When does the {slot} leave?" },
      { id: "transport-platform-direction", question: "How would you ask which way to go in the station?", salienceQuestion: "How would you find the gate for the {slot}?" },
      { id: "transport-platform-missed", question: "How would you ask if you missed your train?", salienceQuestion: "How would you ask about a missed {slot}?" },
      { id: "transport-platform-confirm", question: "How would you confirm you are on the right platform?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-missed-bus",
    labelEn: "When You Miss The Bus",
    labelVi: "Khi lỡ xe buýt",
    category: "transportation",
    scenarioDescription:
      "The learner just watched their bus leave and needs to find out when the next one comes, decide whether to wait or take a different route, and let someone know they will be late.",
    aiRoleDefinition:
      "Act as a transit information worker or a fellow commuter who tells the learner when the next bus arrives, suggests an alternative route, and reassures them that it's a common situation.",
    conversationDirections: [
      "Let the learner open by saying they missed their bus.",
      "Give the next departure time clearly and without fuss.",
      "Offer one alternative — a different bus, a train, or a rideshare.",
      "Let the learner ask how long the wait is.",
      "Help the learner practice telling someone they'll be late.",
      "Close by confirming which bus to look out for next.",
    ],
    warmthPatterns: [
      "Keep 'you just missed it' matter-of-fact — it happens to everyone.",
      "Offer the next option before the learner has to ask.",
      "Keep the lateness-message practice short and direct — one sentence works.",
    ],
    seedInputs: [
      "I missed my bus. When is the next one?",
      "How long until the next number 12?",
      "Is there another way to get to the hospital from here?",
    ],
    detectionPatterns: [
      /\b(?:missed my bus|missed the bus|next bus|late bus|bus left|wait for the next)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-missed-next-note",
        label: "'When is the next one?' — bao lâu nữa có xe tiếp theo",
        note: "After saying 'I missed my bus,' asking 'When is the next one?' is natural and short. 'Bao lâu nữa có xe tiếp theo?' is the Vietnamese instinct — the English is half as long and means exactly the same.",
      },
      {
        id: "transport-missed-not-blame",
        label: "Keep it practical, not apologetic",
        note: "You don't need to explain why you missed the bus. Transit staff need the route and destination — not the story. 'I missed the 12 to downtown — when's the next?' gives them everything in one sentence.",
      },
      {
        id: "transport-missed-alternative-l1",

        label: "Ask for an alternative route",
        note: "'Có cách nào khác không?' (is there another way?) maps to 'Is there another way to get there?' If the wait is long, asking about alternatives — another bus, the subway, or a rideshare — can save significant time.",
      },
      {
        id: "transport-missed-letting-know",
        label: "Telling someone you're late",
        note: "'Tôi sẽ đến muộn' (I will be late) maps to 'I'll be a little late — I missed my bus.' A short text or message with the reason reassures the person waiting and is the polite thing to do in any English-speaking context.",
      },
    ],
    followUps: [
      { id: "transport-missed-route", question: "Which bus did you miss?", salienceQuestion: "Which route was the {slot}?" },
      { id: "transport-missed-next", question: "How would you ask when the next one comes?", salienceQuestion: "When is the next {slot}?" },
      { id: "transport-missed-wait", question: "How would you ask how long the wait is?", salienceQuestion: "How long is the wait for the {slot}?" },
      { id: "transport-missed-alternative", question: "What other way could you get there?", salienceQuestion: "What backup plan works for the {slot}?" },
      { id: "transport-missed-message", question: "How would you tell someone you will be late?", salienceQuestion: "How would you explain the {slot}?" },
      { id: "transport-missed-confirm", question: "How would you confirm which bus to take next?", salienceQuestion: "How would you identify the next {slot}?" },
    ],
  },
  {
    id: "topic-transportation-getting-lost",
    labelEn: "When You Are Lost",
    labelVi: "Khi bị lạc đường",
    category: "transportation",
    scenarioDescription:
      "The learner realises they have taken a wrong turn or are completely turned around in an unfamiliar neighbourhood, and needs to stop someone, admit they are lost, and get clear directions back on track.",
    aiRoleDefinition:
      "Act as a friendly local who reacts warmly to the learner's situation, gives simple step-by-step directions, and suggests showing the destination on a phone if the street name is hard to say.",
    conversationDirections: [
      "Let the learner open by admitting they are lost — 'I think I'm lost.'",
      "React with a warm, unhurried response — 'No worries, let me help.'",
      "Ask the destination name or let the learner show it on their phone.",
      "Give two or three short direction steps and a clear landmark.",
      "Let the learner confirm the first step back to you.",
      "Close by offering to point them in the right direction physically.",
    ],
    warmthPatterns: [
      "Open with 'no worries' — being lost is not a mistake worth apologising for.",
      "Accept the phone-screen approach as a perfectly valid way to communicate the destination.",
      "Confirm the first step together before sending the learner on their way.",
    ],
    seedInputs: [
      "I think I am lost. Can you help me?",
      "Excuse me — I'm trying to get back to the main street.",
      "Sorry to bother you, but I have no idea where I am.",
    ],
    detectionPatterns: [
      /\b(?:i am lost|i'm lost|got lost|wrong way|cannot find|can't find|help me find)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-lost-calm",
        label: "Calm first sentence — tôi bị lạc",
        note: "'Tôi bị lạc' (I'm lost) maps directly to 'I'm lost' or 'I think I'm lost.' Saying it clearly and calmly is the fastest path to help. 'I think I'm lost. Can you help me?' is two sentences that work in any English-speaking city.",
      },
      {
        id: "transport-lost-map-note",
        label: "Use your map — chỉ trên điện thoại",
        note: "It is natural to show your phone and say 'I'm trying to get here.' 'Chỉ trên điện thoại' (point on the phone) is the Vietnamese instinct — and it works in English too. You don't need to pronounce the street name correctly.",
      },
      {
        id: "transport-lost-no-worries",
        label: "Receiving help gracefully",
        note: "When someone helps, responding with 'Thank you so much, I appreciate it' lands better than a long explanation of how you got lost. Keep the gratitude warm and brief — the helper is usually in a hurry too.",
      },
      {
        id: "transport-lost-bother",
        label: "'Sorry to bother you'",
        note: "'Xin lỗi làm phiền' (sorry to bother) maps to 'Sorry to bother you' as a gentle opener for a stranger. It is a warmer alternative to a sudden 'Excuse me' when you are visibly flustered and need a moment of grace.",
      },
    ],
    followUps: [
      { id: "transport-lost-place", question: "Where are you trying to go?", salienceQuestion: "Where is the {slot}?" },
      { id: "transport-lost-help", question: "How would you ask someone for help?", salienceQuestion: "How would you ask for help with the {slot}?" },
      { id: "transport-lost-map", question: "How would you use your map in the question?", salienceQuestion: "How would you show the {slot} on your phone?" },
      { id: "transport-lost-first-step", question: "How would you confirm the first step?", salienceQuestion: "What is the first step to reach the {slot}?" },
      { id: "transport-lost-landmark", question: "How would you ask about a landmark near your destination?", salienceQuestion: "What landmark marks the {slot}?" },
      { id: "transport-lost-next", question: "How would you ask for the next step?", salienceQuestion: "What is the next step to reach the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-airport-ride",
    labelEn: "Getting To The Airport",
    labelVi: "Đi ra sân bay",
    category: "transportation",
    scenarioDescription:
      "The learner has a flight and needs to figure out the best way to reach the airport on time — bus, train, or taxi — including how long the trip takes and when to leave based on their check-in window.",
    aiRoleDefinition:
      "Act as a hotel concierge, local, or transit worker who gives clear advice on the best airport transport option, the approximate travel time, and the recommended departure time based on the learner's flight.",
    conversationDirections: [
      "Let the learner mention their flight time and ask for transport advice.",
      "Give one recommended option — train, bus, or taxi — with the travel time.",
      "Explain where to catch it — nearest station, bus stop, or taxi rank.",
      "Let the learner ask how long the journey takes and how much it costs.",
      "Confirm what time they should leave to arrive comfortably.",
      "Close by wishing them a good flight.",
    ],
    warmthPatterns: [
      "Lead with one clear recommendation rather than a list of options.",
      "Include the travel time and cost upfront — the two questions the learner will always ask.",
      "End with a warm send-off — 'Have a great flight' is a natural closing.",
    ],
    seedInputs: [
      "What is the best way to get to the airport?",
      "My flight is at 3 pm — what time should I leave?",
      "Is there a direct train to the airport from here?",
    ],
    detectionPatterns: [
      /\b(?:airport|get to the airport|flight|airport bus|airport train|taxi to airport|leave for airport)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-airport-best-way",
        label: "'What is the best way?' — cách nào tốt nhất",
        note: "'Cách nào tốt nhất để ra sân bay?' (what's the best way to the airport?) maps directly. The English version is 'What's the best way to get to the airport?' — one extra phrase 'to get' makes it grammatical without adding complexity.",
      },
      {
        id: "transport-airport-time-buffer",
        label: "Give your flight time first",
        note: "Airport advice depends on your flight time. Saying 'My flight is at 3' before asking helps the person give you the right departure time. 'Chuyến bay lúc 3 giờ' is 'My flight is at 3.' Starting with this saves back-and-forth.",
      },
      {
        id: "transport-airport-early",
        label: "Arriving early at the airport",
        note: "Advisors usually say 'get there two hours before your flight' for domestic and 'three hours' for international. 'Đến sân bay sớm' (arrive at the airport early) — asking 'How early should I arrive?' brings this practical advice out directly.",
      },
      {
        id: "transport-airport-terminal-l1",

        label: "Which terminal",
        note: "Large airports have multiple terminals. Asking 'Which terminal does my airline use?' saves a long walk or an extra shuttle ride. 'Nhà ga số mấy?' (which terminal number?) is the Vietnamese instinct — the English form is the same question.",
      },
    ],
    followUps: [
      { id: "transport-airport-flight", question: "What time is your flight?", salienceQuestion: "What time is the {slot}?" },
      { id: "transport-airport-method", question: "What transportation option would you ask about?", salienceQuestion: "How could you get to the {slot}?" },
      { id: "transport-airport-leave", question: "How would you ask what time to leave?", salienceQuestion: "When should you leave for the {slot}?" },
      { id: "transport-airport-cost", question: "How would you ask how much the trip costs?", salienceQuestion: "How much is the {slot} ride?" },
      { id: "transport-airport-terminal", question: "How would you ask which terminal to go to?", salienceQuestion: "Which terminal is for the {slot}?" },
      { id: "transport-airport-confirm", question: "How would you confirm the route?", salienceQuestion: "How would you confirm the {slot} route?" },
    ],
  },
  {
    id: "topic-transportation-parking",
    labelEn: "Asking About Parking",
    labelVi: "Hỏi chỗ đậu xe",
    category: "transportation",
    scenarioDescription:
      "The learner is driving to a destination and needs to find a parking spot nearby, ask whether it is paid or free, confirm the time limit, and understand how to pay at the machine or app.",
    aiRoleDefinition:
      "Act as a local, building staff member, or parking lot attendant who explains where to park, the cost, the time limit, and how to pay.",
    conversationDirections: [
      "Let the learner ask where parking is available near the building.",
      "Confirm whether parking is free, metered, or in a paid lot.",
      "Explain the time limit and what happens if they go over.",
      "Walk through the payment method — machine, app, or ticket.",
      "Let the learner ask about permit zones or restricted hours.",
      "Close by confirming the parking spot location in simple terms.",
    ],
    warmthPatterns: [
      "Lead with the location before the pricing — the learner needs to know where to go first.",
      "Keep time-limit information brief: 'You've got two hours here.'",
      "Mention app payment as an option if it's available — many learners prefer it.",
    ],
    seedInputs: [
      "Is there parking near the building?",
      "How much does it cost to park here?",
      "How do I pay — is there a machine or an app?",
    ],
    detectionPatterns: [
      /\b(?:parking|park my car|parking lot|street parking|garage|parking spot|near the building)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-parking-is-there",
        label: "'Is there parking near...?' — có chỗ đậu xe không",
        note: "'Có chỗ đậu xe gần đây không?' (is there a parking spot nearby?) maps to 'Is there parking near here?' In English, 'parking' in this context is uncountable — you don't need 'a parking space' to ask the opener question.",
      },
      {
        id: "transport-parking-paid",
        label: "Paid or free — có mất tiền không",
        note: "In Canada and the US, asking 'Is it paid parking?' or 'Is parking free?' is practical and normal. 'Có mất tiền không?' (does it cost money?) is the Vietnamese instinct — the English version is just as short and direct.",
      },
      {
        id: "transport-parking-meter",
        label: "Parking meter — đồng hồ tính giờ",
        note: "'Đồng hồ tính giờ' is a 'parking meter' — the machine at the street that you pay for time. 'Feed the meter' means adding money before the time runs out. Asking 'How much is the meter?' or 'Where's the nearest meter?' gets you the practical answer fast.",
      },
      {
        id: "transport-parking-time-limit",
        label: "Time limit — giới hạn thời gian",
        note: "Some spots have a two-hour or one-hour limit whether you pay or not. 'What's the time limit here?' is the question — 'Giới hạn thời gian là bao nhiêu?' is the Vietnamese counterpart. Going over the limit earns a ticket, so asking upfront saves money.",
      },
    ],
    followUps: [
      { id: "transport-parking-place", question: "Where do you need to park?", salienceQuestion: "Where is the {slot}?" },
      { id: "transport-parking-ask", question: "How would you ask if parking is available?", salienceQuestion: "How would you ask about parking for the {slot}?" },
      { id: "transport-parking-cost", question: "How would you ask if parking is free?", salienceQuestion: "How much is parking for the {slot}?" },
      { id: "transport-parking-time", question: "How would you ask how long you can park there?", salienceQuestion: "How long can you park near the {slot}?" },
      { id: "transport-parking-pay", question: "How would you ask how to pay for parking?", salienceQuestion: "How do you pay for the {slot} spot?" },
      { id: "transport-parking-permit", question: "How would you ask about permit zones or restrictions?", salienceQuestion: "Are there restrictions near the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-bike-walk",
    labelEn: "Walking Or Biking Somewhere",
    labelVi: "Đi bộ hoặc đi xe đạp",
    category: "transportation",
    scenarioDescription:
      "The learner wants to walk or bike to a destination and needs to ask whether the route is safe, how long it takes, and where the bike lane or pedestrian path is, especially in an unfamiliar neighbourhood.",
    aiRoleDefinition:
      "Act as a friendly local who gives practical walking or biking advice, mentions the safest route, and points out any hazards or useful landmarks along the way.",
    conversationDirections: [
      "Let the learner ask whether it's safe or reasonable to walk or bike there.",
      "Give an honest time estimate for the walking or biking route.",
      "Mention a landmark or street that helps them stay on track.",
      "Let the learner ask about a bike lane or pedestrian path.",
      "Handle a 'is this neighbourhood safe at night?' question with care.",
      "Close by confirming the first turn or heading to get them started.",
    ],
    warmthPatterns: [
      "Keep the safety answer honest and brief — 'it's fine during the day' is enough.",
      "Offer the time estimate before the learner asks — it's the first thing they need.",
      "Mention the bike lane proactively if biking is the mode of transport.",
    ],
    seedInputs: [
      "Is it safe to walk there from here?",
      "How long would it take to bike to the park?",
      "Is there a bike lane on that road?",
    ],
    detectionPatterns: [
      /\b(?:walk there|bike there|safe to walk|walking route|bike lane|sidewalk|from here)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transport-walk-safe-note",
        label: "'Is it safe to walk?' — đi bộ có an toàn không",
        note: "'Đi bộ có an toàn không?' (is it safe to walk?) maps directly to 'Is it safe to walk there?' Asking this in a new city is useful and sensible — it doesn't sound weak or timid; it sounds like someone who wants accurate information.",
      },
      {
        id: "transport-bike-lane",
        label: "Bike lane — làn xe đạp",
        note: "'Làn xe đạp' is 'bike lane' — the marked section of the road reserved for cyclists. 'Is there a bike lane on that street?' is the question to ask before cycling on an unfamiliar road. Some streets have them; many don't.",
      },
      {
        id: "transport-walk-how-long",
        label: "'How long does it take to walk?' — đi bộ mất bao lâu",
        note: "'Đi bộ mất bao lâu?' is 'How long does it take to walk there?' The English form adds 'does it take' — the same indirect question pattern that Vietnamese drops but English requires to sound natural.",
      },
      {
        id: "transport-walk-sidewalk",
        label: "Sidewalk vs footpath",
        note: "The paved path for pedestrians beside a road is 'sidewalk' in North America and 'footpath' or 'pavement' in the UK. 'Vỉa hè' covers all of these. If you're not sure which term is local, 'path for walking' is always understood.",
      },
    ],
    followUps: [
      { id: "transport-walk-destination", question: "Where do you want to walk or bike?", salienceQuestion: "Where is the {slot}?" },
      { id: "transport-walk-safe", question: "How would you ask if it is safe?", salienceQuestion: "How safe is the {slot}?" },
      { id: "transport-walk-time", question: "How would you ask how long it takes?", salienceQuestion: "How long does the {slot} take?" },
      { id: "transport-walk-route", question: "How would you ask for the best route?", salienceQuestion: "What route works for the {slot}?" },
      { id: "transport-walk-lane", question: "How would you ask about a bike lane?", salienceQuestion: "Is there a bike lane toward the {slot}?" },
      { id: "transport-walk-night", question: "How would you ask if the route is safe at night?", salienceQuestion: "Is the {slot} safe after dark?" },
    ],
  },
  {
    id: "topic-transportation-how-long-far",
    labelEn: "Asking How Long Or How Far",
    labelVi: "Hỏi mất bao lâu, bao xa",
    category: "transportation",
    scenarioDescription:
      "The learner needs to ask how long a trip will take, how far a destination is, or how many stops are left on the bus or train, in order to plan their journey and decide how to spend the waiting time.",
    aiRoleDefinition:
      "Act as a transit worker, local, or fellow passenger who gives practical time and distance answers and uses clear, everyday language rather than exact measurements.",
    conversationDirections: [
      "Let the learner ask 'How long does it take?' for their chosen mode of transport.",
      "Give an approximate time and explain if there is traffic or delay risk.",
      "Let the learner ask how many stops away the destination is.",
      "Explain distance in walking time or landmarks rather than kilometres.",
      "Let the learner ask when they should leave to arrive on time.",
      "Close by confirming the key number — time or stops — so the learner can remember it.",
    ],
    warmthPatterns: [
      "Give time in practical terms — 'about 20 minutes' beats '1.8 km.'",
      "Mention a backup — 'if there's traffic, add 10 minutes' — so the learner can plan.",
      "Stops count is more useful than distance when the learner is on a bus or train.",
    ],
    seedInputs: [
      "How long does it take to get there?",
      "How many stops is it to the hospital?",
      "Is it far from here to the shopping centre?",
    ],
    detectionPatterns: [
      /\b(?:how long does it|how far|how many stops|how long to get|how much time|take to get there)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transportation-howlong-frame",
        label: "'How long does it take?' — mất bao lâu",
        note: "Vietnamese 'mất bao lâu' has no 'does/it,' so learners may say 'How long to go there?' The fuller frame 'How long does it take?' sounds natural and works anywhere — on the bus, at the station, or asking a local.",
      },
      {
        id: "transportation-howlong-article",
        label: "'How far is the station?' — ga ở đâu",
        note: "Vietnamese skips the article, so 'How far is station?' feels finished. English wants 'How far is the station?' Adding 'the' is a tiny step — but it's the one that makes the question sound like a native English speaker.",
      },
      {
        id: "transportation-howlong-stops",
        label: "'How many stops?' — bao nhiêu trạm",
        note: "'How many stops is it?' needs the plural -s. Vietnamese does not mark plural, so 'how many stop' can slip out; 'how many' already implies more than one, and the -s on 'stops' matches it to make the question grammatical.",
      },
      {
        id: "transportation-howlong-approximate",
        label: "Approximate answers are normal",
        note: "'Khoảng 20 phút' (about 20 minutes) maps to 'about 20 minutes' or 'roughly 20 minutes.' In transit conversations, 'about' is the most common word before a time — exact numbers are rare. Accepting approximate answers is part of the transit vocabulary.",
      },
    ],
    followUps: [
      { id: "transportation-howlong-to", question: "Where are you measuring the time or distance to?", salienceQuestion: "How would you ask how long it takes to the {slot}?" },
      { id: "transportation-howlong-far", question: "How would you ask how far it is?", salienceQuestion: "How would you ask how far the {slot} is?" },
      { id: "transportation-howlong-stops-q", question: "How would you ask how many stops it is?", salienceQuestion: "How would you ask the number of stops to the {slot}?" },
      { id: "transportation-howlong-traffic", question: "How would you ask if traffic might add time?", salienceQuestion: "Is there traffic toward the {slot}?" },
      { id: "transportation-howlong-leave", question: "How would you ask when you should leave?", salienceQuestion: "When should you leave for the {slot}?" },
      { id: "transportation-howlong-confirm", question: "How would you confirm the time estimate you heard?", salienceQuestion: "How would you repeat the time for the {slot}?" },
    ],
  },
  {
    id: "topic-transportation-map-next-stop",
    labelEn: "Reading The Map Or The Next Stop",
    labelVi: "Xem bản đồ hoặc trạm kế tiếp",
    category: "transportation",
    scenarioDescription:
      "The learner is on a bus or train, unsure where they are on the route, and needs to ask a fellow passenger or check with the driver to confirm whether the next stop is the right one, or how many stops remain.",
    aiRoleDefinition:
      "Act as a friendly fellow passenger who helps the learner confirm their stop, points at the route map, and reassures them in a relaxed, no-rush tone.",
    conversationDirections: [
      "Let the learner ask whether the next stop is the one they need.",
      "Confirm or correct — name the correct stop and how many stops away it is.",
      "Let the learner ask 'where are we now?' to orientate themselves.",
      "Point to the map display or app if available.",
      "Let the learner ask the driver or another passenger for a second confirmation.",
      "Close by saying you'll let them know when their stop is coming up.",
    ],
    warmthPatterns: [
      "Offer to call out the stop when it comes — a small, generous gesture.",
      "Keep the correction gentle — 'yours is the one after next' beats a long explanation.",
      "Treat map-reading questions as completely normal on any transit system.",
    ],
    seedInputs: [
      "Is the next stop the one I need?",
      "Where are we on the route right now?",
      "Could you let me know when we reach the central station?",
    ],
    detectionPatterns: [
      /\b(?:next stop|transit map|the map|which stop is next|where are we now|this stop|route map)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transportation-map-next-article",
        label: "'The next stop' — trạm kế tiếp",
        note: "English says 'the next stop' with 'the.' Vietnamese 'trạm kế tiếp' needs no article, so 'next stop' alone can feel complete. The small 'the' makes it sound like a real transit announcement — it's one word that signals fluency.",
      },
      {
        id: "transportation-map-where-are-we",
        label: "'Where are we now?' — chúng ta đang ở đâu",
        note: "A handy question on the map is 'Where are we now?' It is short and natural; learners may translate a longer phrase, but this simple form is what locals say while checking a route — and it works on a phone map too.",
      },
      {
        id: "transportation-map-let-me-know",
        label: "'Could you let me know?' — cho tôi biết khi nào đến",
        note: "'Cho tôi biết khi nào đến trạm...' (let me know when we reach the stop) maps to 'Could you let me know when we reach X?' Asking a fellow passenger this small favour is completely normal on public transit.",
      },
      {
        id: "transportation-map-wrong-stop",
        label: "Missed your stop",
        note: "If you realise you've passed your stop, telling the driver or pressing the stop button is the first step. 'I missed my stop — is there a way to get back?' is a calm, clear question. 'Tôi đã qua trạm rồi' is the Vietnamese version — the feeling is the same.",
      },
    ],
    followUps: [
      { id: "transportation-map-next", question: "Which stop are you watching for?", salienceQuestion: "How would you ask if the next stop is the {slot}?" },
      { id: "transportation-map-now", question: "How would you ask where you are right now?", salienceQuestion: "How would you ask where the {slot} is on the map?" },
      { id: "transportation-map-count", question: "How would you ask how many stops are left?", salienceQuestion: "How many stops until the {slot}?" },
      { id: "transportation-map-letme", question: "How would you ask someone to call out your stop?", salienceQuestion: "How would you ask for a reminder about the {slot}?" },
      { id: "transportation-map-missed", question: "How would you say you missed your stop?", salienceQuestion: "What would you say if you passed the {slot}?" },
      { id: "transportation-map-confirm", question: "How would you confirm you read the map right?", salienceQuestion: "How would you confirm the {slot} on the map?" },
    ],
  },
  {
    id: "topic-transportation-transfer-lines",
    labelEn: "Transferring Between Lines",
    labelVi: "Chuyển tuyến xe hoặc tàu",
    category: "transportation",
    scenarioDescription:
      "The learner needs to change buses or trains mid-journey, find the right connection, and confirm which stop to get off at in order to transfer, including whether their fare or pass covers the connection.",
    aiRoleDefinition:
      "Act as a transit information worker or fellow commuter who explains where and how to transfer, confirms which stop to get off at, and tells the learner whether the transfer is free or costs extra.",
    conversationDirections: [
      "Let the learner ask whether they need to change buses or trains to reach their destination.",
      "Confirm the transfer station or stop name and what line to switch to.",
      "Explain where in the station to find the connecting line.",
      "Let the learner ask whether the transfer is included in their fare.",
      "Practice a 'did I miss my transfer stop?' recovery scenario.",
      "Close by confirming the full route — Line A to Line B — in one clear sentence.",
    ],
    warmthPatterns: [
      "Name the transfer stop before the connecting line — that's what the learner needs to watch for.",
      "Keep transfer instructions to two steps: 'get off at X, take line Y.'",
      "Make the missed-transfer scenario low-stress — it is fixable and happens to regulars.",
    ],
    seedInputs: [
      "Do I need to change trains to get there?",
      "Where do I get off to transfer to the blue line?",
      "Is the transfer included in my fare, or do I pay again?",
    ],
    detectionPatterns: [
      /\b(?:transfer|change trains|change buses|switch lines|connecting|do i need to change|next line)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "transportation-transfer-change-verb",
        label: "'Change trains' or 'transfer' — đổi tàu",
        note: "English says 'change trains' or 'transfer to the blue line.' 'Đổi tàu' is the Vietnamese instinct — 'change' and 'transfer' are the words on signs and in announcements. Using them makes asking and following directions faster.",
      },
      {
        id: "transportation-transfer-get-off",
        label: "'Get off to change' — xuống để đổi tuyến",
        note: "A practical question mixes two phrasal verbs: 'Where do I get off to change lines?' 'Xuống để đổi tuyến' is the Vietnamese version. These 'get off' and 'change' phrases have no single-word equivalents in Vietnamese, so saying them as a set lands clearly.",
      },
      {
        id: "transportation-transfer-included",
        label: "Is the transfer free? — vé có bao gồm không",
        note: "On many transit systems, a single fare covers one transfer within a set time. 'Is the transfer included in my fare?' is the key question — 'Vé có bao gồm chuyến đổi tuyến không?' is the Vietnamese counterpart. Asking prevents a double charge.",
      },
      {
        id: "transportation-transfer-connect",
        label: "Connection time — thời gian chờ đổi tuyến",
        note: "If two lines connect at a busy station, asking 'How much time do I have for the connection?' tells you whether to walk or run. 'Thời gian chờ đổi tuyến' is the Vietnamese frame — the English is 'connection time' and transit staff use it every day.",
      },
    ],
    followUps: [
      { id: "transportation-transfer-where", question: "Where do you think you need to change?", salienceQuestion: "How would you ask where to change for the {slot}?" },
      { id: "transportation-transfer-line", question: "Which line are you trying to reach?", salienceQuestion: "How would you ask for the line to the {slot}?" },
      { id: "transportation-transfer-stop", question: "How would you ask which stop to get off at?", salienceQuestion: "Which stop connects to the {slot}?" },
      { id: "transportation-transfer-fare", question: "How would you ask if the transfer is included?", salienceQuestion: "Is the transfer to the {slot} free?" },
      { id: "transportation-transfer-confirm", question: "How would you confirm you got the transfer right?", salienceQuestion: "How would you confirm the transfer to the {slot}?" },
      { id: "transportation-transfer-help", question: "Who could you ask if you are unsure?", salienceQuestion: "Who could help you transfer toward the {slot}?" },
    ],
  },
] as const satisfies readonly D4SpeakTopic[];

export const speakTopics = transportationSpeakTopics;
