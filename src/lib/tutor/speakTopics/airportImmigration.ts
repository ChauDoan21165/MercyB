import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D3SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics: D3SpeakTopic[] = [
  {
    id: "topic-airport-check-in-counter",
    labelEn: "Checking In At The Airport",
    labelVi: "Làm thủ tục check-in tại sân bay",
    category: "airport",
    scenarioDescription:
      "The learner approaches an airline check-in counter to confirm their booking, drop off luggage, choose a seat, and receive a boarding pass.",
    aiRoleDefinition:
      "Act as an airline check-in agent who verifies the passenger's ID and booking reference, asks about luggage, offers seat preferences, and issues the boarding pass with gate information.",
    conversationDirections: [
      "Ask the learner to present their passport and confirm the flight destination.",
      "Practice giving the booking reference or confirmation number.",
      "Ask about luggage — how many bags, estimated weight, and whether they contain restricted items.",
      "Guide the learner to request a window or aisle seat, or upgrade options.",
      "Confirm the boarding pass details: gate number, boarding time, and terminal.",
      "End by reminding the learner of the security process and when to be at the gate.",
    ],
    warmthPatterns: [
      "Stay efficient but friendly: 'Let me pull up your booking right away.'",
      "Confirm details clearly: 'Your gate is B12 and boarding starts at 14:40.'",
      "Flag baggage limits without blame: 'Your bag is just over the limit — we can check options.'",
    ],
    seedInputs: [
      "I'm here to check in for my flight.",
      "Can I have a window seat?",
      "How many bags can I check in?",
    ],
    detectionPatterns: [
      /\b(?:check[- ]in|checking in|boarding pass|check (?:my )?(?:bag|luggage|suitcase)|window seat|aisle seat|seat preference|booking reference|confirmation number|check[- ]in counter)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "airport-checkin-booking",
        label: "Booking reference / confirmation number",
        note: "'Mã đặt vé' = booking reference. The agent asks 'Can I have your booking reference?' — a 6-character code on the itinerary email. Vietnamese learners may say 'I have ticket number' (chỉ có số vé); the specific phrase the system recognizes is 'booking reference' or 'confirmation number.'",
      },
      {
        id: "airport-checkin-luggage",
        label: "Luggage allowance",
        note: "'Hành lý ký gửi' = checked baggage; 'hành lý xách tay' = carry-on. When asked 'Are you checking any bags?', the answer is 'Yes, one checked bag' or 'No, just carry-on.' Saying 'I have one big bag' is understood but 'one checked bag of 23 kg' gets the fastest response.",
      },
      {
        id: "airport-checkin-seat",
        label: "Seat preference request",
        note: "'Ghế cạnh cửa sổ' = window seat; 'ghế lối đi' = aisle seat. 'Can I have a window seat, please?' or 'Do you have any aisle seats available?' are the natural phrases. 'I want sit near window' omits 'a' and 'seat' — adding them makes the request clearer at a busy counter.",
      },
      {
        id: "airport-checkin-gate",
        label: "Gate and boarding time",
        note: "'Cổng lên máy bay' = gate; 'giờ lên máy bay' = boarding time. 'What gate is my flight?' and 'When does boarding start?' are the two most useful follow-up questions at check-in. The boarding pass shows both, but confirming verbally catches last-minute gate changes.",
      },
      {
        id: "airport-checkin-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Xin chào, tôi muốn làm thủ tục check-in cho chuyến bay của tôi ạ.' ↔ EN: 'Hi, I'm here to check in for my flight.' The possessive 'my' and 'for my flight' are both load-bearing — omitting them sounds like a question rather than a statement.",
      },
    ],
    followUps: [
      { id: "airport-checkin-id-fu", question: "How would you offer your passport and tell the agent your destination?", salienceQuestion: "How would you identify yourself for the {slot}?" },
      { id: "airport-checkin-ref-fu", question: "How would you give your booking reference number?", salienceQuestion: "How would you share the {slot} reference?" },
      { id: "airport-checkin-bag-fu", question: "How would you say you have one bag to check and ask about the weight limit?", salienceQuestion: "How would you confirm the {slot} allowance?" },
      { id: "airport-checkin-seat-fu", question: "How would you ask for an aisle seat if one is available?", salienceQuestion: "How would you request the {slot} seat?" },
      { id: "airport-checkin-gate-fu", question: "How would you ask which gate your flight is departing from?", salienceQuestion: "How would you confirm the {slot} gate?" },
    ],
  },
  {
    id: "topic-airport-security-screening",
    labelEn: "Going Through Airport Security",
    labelVi: "Qua cổng kiểm tra an ninh sân bay",
    category: "airport",
    scenarioDescription:
      "The learner goes through airport security screening, removes required items, interacts with the TSA or airport security officer, and handles being pulled aside for additional screening.",
    aiRoleDefinition:
      "Act as an airport security officer who instructs the learner to prepare their items, explains what must go in the bin, responds to an alarm, and explains additional screening procedures calmly.",
    conversationDirections: [
      "Instruct the learner to remove shoes, belt, laptop, and liquids from their bag.",
      "Practice responding when asked to empty pockets or remove a jacket.",
      "Guide the learner to explain a medical device, implant, or special item that may trigger the scanner.",
      "Practice responding calmly if pulled aside for additional screening or a pat-down.",
      "Ask the learner to confirm they packed their bag themselves and that no one added anything.",
      "End by confirming the learner can collect their items and proceed to the gate.",
    ],
    warmthPatterns: [
      "Keep instructions clear and non-threatening: 'Please step this way — it's just a quick check.'",
      "Normalize additional screening: 'This is routine — it only takes a minute.'",
      "Confirm completion: 'You're all set — have a great flight.'",
    ],
    seedInputs: [
      "Do I need to remove my shoes?",
      "I have a metal implant in my knee.",
      "What do I put in the bin?",
    ],
    detectionPatterns: [
      /\b(?:security (?:check|screening|line|lane)|take off (?:my )?shoes|remove (?:shoes|belt|jacket|laptop)|liquids bag|TSA|metal detector|body scanner|pat[- ]down|additional screening|medical (?:device|implant)|pacemaker|bin)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "airport-security-bin",
        label: "The security bin",
        note: "'Khay kiểm tra' = security bin/tray. The officer says 'Put your items in the bin' — 'bin' here means the grey plastic tray on the conveyor belt, not a rubbish bin. Vietnamese learners sometimes hesitate on this word; knowing it speeds up the line.",
      },
      {
        id: "airport-security-shoes",
        label: "Removing shoes",
        note: "US/AU airports often require shoes off; EU airports less so. 'Do I need to take off my shoes?' is the clearest question. The officer's answer 'Yes, please remove your shoes and place them in the bin' gives you the full instruction.",
      },
      {
        id: "airport-security-implant",
        label: "Declaring a medical implant",
        note: "'Tôi có cấy ghép kim loại trong đầu gối' → 'I have a metal implant in my knee.' The phrase 'I have a medical implant' plus the body part tells the officer exactly what to expect. Adding 'I have a doctor's note if you need it' prevents an extended delay.",
      },
      {
        id: "airport-security-packed",
        label: "\"Did you pack your own bag?\"",
        note: "The question 'Did you pack your bag yourself?' is asked to everyone — it is not an accusation. The answers are 'Yes, I packed it myself' or 'Most of it — my colleague added one item.' Saying only 'Yes' is enough; 'Yes, I packed it myself' is the complete, natural form.",
      },
    ],
    followUps: [
      { id: "airport-security-remove-fu", question: "How would you ask what items you need to remove before going through the scanner?", salienceQuestion: "How would you confirm what to remove for the {slot}?" },
      { id: "airport-security-implant-fu", question: "How would you explain a metal implant or medical device to the security officer?", salienceQuestion: "How would you declare the {slot} to security?" },
      { id: "airport-security-liquid-fu", question: "How would you ask whether a liquid item in your bag is allowed through?", salienceQuestion: "How would you check if the {slot} is permitted?" },
      { id: "airport-security-patdown-fu", question: "How would you respond calmly if asked to step aside for additional screening?", salienceQuestion: "How would you respond to a {slot} request?" },
      { id: "airport-security-packed-fu", question: "How would you answer 'Did you pack this bag yourself?'", salienceQuestion: "How would you confirm you packed the {slot}?" },
    ],
  },
  {
    id: "topic-airport-immigration-customs",
    labelEn: "Talking To The Immigration Officer",
    labelVi: "Nói chuyện với nhân viên hải quan và nhập cư",
    category: "airport",
    scenarioDescription:
      "The learner arrives in a new country and speaks with the immigration or customs officer, answering questions about their purpose of visit, length of stay, and what they are carrying.",
    aiRoleDefinition:
      "Act as an immigration officer who asks standard arrival questions about the traveler's purpose of visit, length of stay, accommodation, and customs declaration, and responds naturally to common answers.",
    conversationDirections: [
      "Ask the learner why they are visiting: tourism, study, work, or visiting family.",
      "Ask how long they intend to stay and where they will be staying.",
      "Practice answering questions about their return ticket and financial means.",
      "Ask about items being brought in: cash over the limit, gifts, food, or prohibited items.",
      "Guide the learner to answer 'anything to declare?' at customs.",
      "End by confirming documents are in order and the officer stamps the passport.",
    ],
    warmthPatterns: [
      "Keep questions direct and professional: 'Purpose of your visit?'",
      "Normalize standard questions: 'These are routine questions — just answer briefly.'",
      "Confirm smooth passage: 'Everything looks good — enjoy your stay.'",
    ],
    seedInputs: [
      "I'm here for tourism.",
      "I will stay for two weeks.",
      "I have nothing to declare.",
    ],
    detectionPatterns: [
      /\b(?:immigration|customs|purpose of (?:your )?visit|how long (?:will you|are you) stay|where (?:will you|are you) stay|return ticket|anything to declare|visa|entry stamp|arrival card|tourist|business visa|student visa|work visa)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "airport-immigration-purpose",
        label: "Purpose of visit",
        note: "'Mục đích chuyến đi' = purpose of visit. The four answers officers expect are: 'tourism', 'business', 'study', and 'visiting family/friends.' Using one of these exact words after 'I'm here for…' or 'I'm visiting for…' gets the fastest response. Saying 'I come to see my friend' works but 'I'm here to visit family' is more standard.",
      },
      {
        id: "airport-immigration-stay",
        label: "Length of stay",
        note: "'Tôi sẽ ở lại bao lâu?' → 'How long will you be staying?' Answer: 'I'll be staying for two weeks' (not 'two week'). Plural -s after numbers applies in English; 'one week' but 'two weeks', 'three months.' The officer may ask 'Do you have a return ticket?' — 'Yes, I fly back on the 25th' is the clear answer.",
      },
      {
        id: "airport-immigration-declare",
        label: "Customs declaration",
        note: "'Khai báo hải quan' = customs declaration. 'Do you have anything to declare?' has two answers: 'No, nothing to declare' or 'Yes, I have [item].' For cash over the threshold: 'I'm carrying USD 12,000 in cash — I have the form.' Never guess at thresholds; declaring is always safer than not declaring.",
      },
      {
        id: "airport-immigration-address",
        label: "Where are you staying?",
        note: "The officer asks 'Where will you be staying?' — give the hotel name or a person's address: 'I'm staying at the Marriott on Collins Street' or 'I'm staying with my aunt at 42 Smith Street, Richmond.' 'I stay at hotel' is understood but adding the hotel name or suburb avoids a follow-up.",
      },
    ],
    followUps: [
      { id: "airport-immigration-purpose-fu", question: "How would you tell the immigration officer the purpose of your visit?", salienceQuestion: "How would you state the {slot} purpose?" },
      { id: "airport-immigration-stay-fu", question: "How would you say how long you plan to stay and where you will be staying?", salienceQuestion: "How would you confirm your {slot} plan?" },
      { id: "airport-immigration-ticket-fu", question: "How would you confirm you have a return ticket?", salienceQuestion: "How would you mention your {slot} ticket?" },
      { id: "airport-immigration-declare-fu", question: "How would you answer 'Do you have anything to declare?' when you have nothing to declare?", salienceQuestion: "How would you respond to the {slot} question?" },
      { id: "airport-immigration-address-fu", question: "How would you give the name and address of where you are staying?", salienceQuestion: "How would you give your {slot} address?" },
    ],
  },
  {
    id: "topic-airport-boarding-gate",
    labelEn: "At The Boarding Gate",
    labelVi: "Tại cổng lên máy bay",
    category: "airport",
    scenarioDescription:
      "The learner navigates to the boarding gate, listens to announcements, asks about delays or gate changes, and boards the aircraft.",
    aiRoleDefinition:
      "Act as a gate agent who makes boarding announcements, responds to passenger questions about delays, gate changes, and boarding groups, and confirms boarding passes at the door.",
    conversationDirections: [
      "Practice listening to and asking about a gate change announcement.",
      "Guide the learner to ask about a flight delay and what time boarding will start.",
      "Practice asking which boarding group or zone they are in.",
      "Ask the learner what to do if they have a carry-on that may need to be gate-checked.",
      "Practice the boarding process: scanning the pass and confirming seat number.",
      "End by asking a flight attendant for help locating an overhead bin.",
    ],
    warmthPatterns: [
      "Make delay information clear: 'The flight is delayed by about 45 minutes — new departure is 16:30.'",
      "Help with gate changes: 'Gate B12 has moved to C4 — it's a 10-minute walk to the left.'",
      "Ease boarding: 'Just scan your boarding pass face-down on the reader.'",
    ],
    seedInputs: [
      "Is this flight delayed?",
      "Which boarding group am I in?",
      "Where is gate C4?",
    ],
    detectionPatterns: [
      /\b(?:boarding (?:gate|group|zone|pass|time|call)|gate (?:change|number)|flight (?:delayed|delay|on time|cancelled)|which (?:gate|zone|group)|overhead (?:bin|compartment)|gate.check|final (?:boarding|call)|seat number|scan (?:my )?boarding pass)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "airport-gate-delay",
        label: "Asking about a delay",
        note: "'Chuyến bay bị trễ' = the flight is delayed. 'Is the flight delayed?' is the direct question. If the board shows 'delayed,' asking 'What is the new departure time?' gets the updated schedule. 'When will we board?' covers the case where departure is delayed but boarding might still start on time.",
      },
      {
        id: "airport-gate-group",
        label: "Boarding groups",
        note: "Many airlines board by groups or zones (Group 1, Zone A). The boarding pass shows 'Group 2' or 'Zone B.' 'Am I in the first boarding group?' or 'Which zone am I in?' are the questions. Vietnamese learners may not know to look for this on the pass — the zone is usually next to the seat number.",
      },
      {
        id: "airport-gate-carry-on",
        label: "Gate-checking a carry-on",
        note: "If the overhead bins are full, the agent may say 'We'll need to gate-check your bag — pick it up at baggage claim.' 'Gate-check' means the bag goes into the cargo hold and comes out at the destination carousel. 'Is my bag gate-checked or can I bring it on?' confirms the situation.",
      },
      {
        id: "airport-gate-bin",
        label: "Finding an overhead bin",
        note: "'Ngăn chứa hành lý phía trên' = overhead bin/compartment. Asking a flight attendant 'Is there space in the overhead bin near row 24?' or 'Where can I put my bag?' gets the quickest help. Don't say 'Do you have space?' without specifying it's for luggage — the attendant may not understand the context.",
      },
    ],
    followUps: [
      { id: "airport-gate-delay-fu", question: "How would you ask if your flight is delayed and what the new departure time is?", salienceQuestion: "How would you check the {slot} status?" },
      { id: "airport-gate-change-fu", question: "How would you ask where the new gate is after a gate change announcement?", salienceQuestion: "How would you find the new {slot} gate?" },
      { id: "airport-gate-group-fu", question: "How would you ask which boarding group you are in?", salienceQuestion: "How would you confirm your {slot} group?" },
      { id: "airport-gate-carry-fu", question: "How would you ask whether your carry-on bag needs to be gate-checked?", salienceQuestion: "How would you ask about the {slot} bag?" },
      { id: "airport-gate-bin-fu", question: "How would you ask a flight attendant where to put your bag on the plane?", salienceQuestion: "How would you find space for your {slot} bag?" },
    ],
  },
  {
    id: "topic-airport-flight-problem",
    labelEn: "Handling A Flight Problem",
    labelVi: "Xử lý sự cố chuyến bay",
    category: "airport",
    scenarioDescription:
      "The learner's flight is cancelled, missed, or overbooked, and they need to speak with an airline agent to get a rebooking, compensation, or hotel voucher.",
    aiRoleDefinition:
      "Act as an airline service desk agent who explains the situation, offers rebooking options, explains compensation or voucher entitlements, and processes the new booking as efficiently as possible.",
    conversationDirections: [
      "Explain that the flight is cancelled or the passenger missed their connection.",
      "Guide the learner to ask for the next available flight to their destination.",
      "Practice asking about meal vouchers, hotel accommodation, or travel credits when there is a long wait.",
      "Ask the learner to request a written confirmation of the rebooking.",
      "Practice asking about baggage — whether the checked bag will transfer automatically.",
      "End by confirming the new boarding pass, gate, and departure time.",
    ],
    warmthPatterns: [
      "Acknowledge the disruption first: 'I understand this is frustrating — let me sort this out for you.'",
      "Be proactive about entitlements: 'Because the delay is over three hours, you're entitled to a meal voucher.'",
      "Confirm the new plan clearly: 'Your new flight leaves at 19:15 from gate D8 — here's your new boarding pass.'",
    ],
    seedInputs: [
      "My flight was cancelled. What can I do?",
      "I missed my connecting flight.",
      "Am I entitled to a hotel voucher?",
    ],
    detectionPatterns: [
      /\b(?:flight (?:cancelled|canceled|missed|overbooked)|missed (?:my )?(?:connection|connecting flight|flight)|rebook|next available flight|compensation|meal voucher|hotel voucher|travel credit|stranded|denied boarding|bumped from (?:my )?flight|baggage (?:transfer|claim|missing))\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "airport-problem-rebook",
        label: "Asking to be rebooked",
        note: "'Đặt lại vé' = rebook. 'Can you rebook me on the next available flight to Sydney?' is the one sentence that gets the process started. 'I want new ticket' is understood but agents process 'rebook' faster because it tells them the type of transaction.",
      },
      {
        id: "airport-problem-voucher",
        label: "Voucher entitlement",
        note: "EU rules (EC261) and many other country rules give passengers meal/hotel vouchers for long delays. 'Am I entitled to a meal voucher?' or 'Can I get a hotel voucher for tonight?' are the exact questions. The agent may not offer proactively — asking directly is the key skill.",
      },
      {
        id: "airport-problem-connection",
        label: "Missed connection",
        note: "If your connecting flight was on the same booking, the airline must rebook you. 'I missed my connection due to the delay — can you put me on the next flight?' makes clear it is the airline's responsibility. If you booked two separate tickets, say 'They were separate bookings' and ask what options exist.",
      },
      {
        id: "airport-problem-baggage",
        label: "Asking about your checked baggage",
        note: "When rebooked onto a new flight: 'Will my checked bag be transferred automatically?' is the critical question. If not, you may need to re-check it. 'My bag tag number is X — where will it arrive?' at the destination gives the agent the information to track it if it doesn't appear.",
      },
    ],
    followUps: [
      { id: "airport-problem-rebook-fu", question: "How would you ask to be rebooked on the next available flight to your destination?", salienceQuestion: "How would you request a {slot} rebooking?" },
      { id: "airport-problem-wait-fu", question: "How would you ask how long the wait will be for the next flight?", salienceQuestion: "How would you ask about the {slot} wait?" },
      { id: "airport-problem-voucher-fu", question: "How would you ask whether you are entitled to a meal or hotel voucher?", salienceQuestion: "How would you claim your {slot} voucher?" },
      { id: "airport-problem-bag-fu", question: "How would you ask whether your checked bag will automatically transfer to the new flight?", salienceQuestion: "How would you check on your {slot} bag?" },
      { id: "airport-problem-confirm-fu", question: "How would you ask for a written or printed confirmation of your new booking?", salienceQuestion: "How would you get the {slot} in writing?" },
    ],
  },
] as const;
