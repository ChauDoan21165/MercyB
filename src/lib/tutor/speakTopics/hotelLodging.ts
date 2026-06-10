import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D4SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

// Hotel & lodging customer English theme. Covers everyday front-desk and in-room
// interactions for a Vietnamese learner staying at an English-language hotel.
// Scenarios are warm, adult, low-shame, and strictly about COMMUNICATION.
// L1 notes name genuine Vietnamese→English interference patterns as friendly context.
// note-ids and followUp-ids are disjoint: note ids have no -fu suffix;
// followUp ids always end with -fu.
export const speakTopics: readonly D4SpeakTopic[] = [
  {
    id: "topic-hotel-lodging-check-in",
    labelEn: "Checking In At The Hotel",
    labelVi: "Làm thủ tục nhận phòng khách sạn",
    category: "hotel-lodging",
    scenarioDescription:
      "The learner arrives at a hotel, confirms their reservation, shows ID, chooses preferences, and receives key cards and room information from the front desk.",
    aiRoleDefinition:
      "Act as a hotel front-desk agent who warmly greets the guest, asks for the name on the reservation, confirms room type and preferences, requests ID, and hands over key cards with a brief room orientation.",
    conversationDirections: [
      "Ask the learner to confirm their name and reservation details.",
      "Practice saying check-in dates, room type preference (king, double, non-smoking).",
      "Ask the learner how to respond when staff request a credit card for incidentals.",
      "Prompt the learner to ask about floor level, quiet rooms, or view preference.",
      "Practice accepting or declining room upgrades politely.",
      "End by asking the learner to confirm the room number, breakfast details, and checkout time.",
    ],
    warmthPatterns: [
      "Use welcoming hotel register: 'We're happy to have you with us tonight.'",
      "Make preference questions feel like choices, not tests.",
      "Keep the energy calm and efficient — front-desk exchanges are brief and friendly.",
    ],
    seedInputs: [
      "Hi, I have a reservation under the name Nguyen.",
      "Hello, I'd like to check in — I booked a king room for two nights.",
      "Good afternoon, I'm checking in today. Can you look up my booking?",
    ],
    detectionPatterns: [
      /\b(?:check in|checking in|i have a reservation|i booked a room|confirm my booking|check-in time|front desk|key card|room assignment)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hotel-checkin-dat-phong",
        label: "\"Đặt phòng\" → \"I booked a room\"",
        note: "'Đặt phòng' means 'book a room.' Learners often say 'I reserved a room,' which is perfectly correct. An equally natural opener is 'I have a reservation' — front desks love this phrase because it tells them exactly what to look for.",
      },
      {
        id: "hotel-checkin-incidentals",
        label: "Credit card for incidentals",
        note: "Hotels often say 'We need a credit card on file for incidentals.' This means a temporary hold for extras like room service or damage — it is released when you check out. Saying 'Sure, here you go' while handing the card is all that is needed.",
      },
      {
        id: "hotel-checkin-key-card",
        label: "\"Chìa khóa\" vs \"key card\"",
        note: "'Chìa khóa' is a physical key; hotel rooms use a 'key card' (also called a 'room key' or 'card key'). Staff may say 'Here are your key cards' — knowing this word prevents confusion at the elevator.",
      },
      {
        id: "hotel-checkin-preference",
        label: "Asking for a preference politely",
        note: "It is perfectly normal to request 'a quiet room away from the elevator' or 'a higher floor if possible.' Adding 'if possible' or 'if that's available' keeps the request warm and realistic.",
      },
    ],
    followUps: [
      { id: "hotel-checkin-name-fu", question: "How would you say your name and confirm your reservation?", salienceQuestion: "How would you give your name for the {slot}?" },
      { id: "hotel-checkin-dates-fu", question: "How would you state your check-in and check-out dates?", salienceQuestion: "What dates are you staying for the {slot}?" },
      { id: "hotel-checkin-preference-fu", question: "What room preference would you ask for?", salienceQuestion: "What would you request for the {slot}?" },
      { id: "hotel-checkin-card-fu", question: "How would you respond when staff ask for your credit card?", salienceQuestion: "What would you say when they ask for a card at the {slot}?" },
      { id: "hotel-checkin-wifi-fu", question: "How would you ask for the WiFi password at check-in?", salienceQuestion: "How would you ask about WiFi at the {slot}?" },
      { id: "hotel-checkin-confirm-fu", question: "How would you confirm your room number and checkout time before leaving the desk?", salienceQuestion: "How would you confirm the details at the {slot}?" },
    ],
  },
  {
    id: "topic-hotel-lodging-room-amenities",
    labelEn: "Requesting Room Amenities",
    labelVi: "Yêu cầu tiện nghi phòng khách sạn",
    category: "hotel-lodging",
    scenarioDescription:
      "The learner calls or texts the front desk to request extra towels, pillows, toiletries, or room-service items, and confirms delivery timing.",
    aiRoleDefinition:
      "Act as a hotel housekeeping or front-desk agent who takes amenity requests warmly, confirms what is available, and gives an estimated delivery time.",
    conversationDirections: [
      "Ask the learner to request extra towels, an extra pillow, or a blanket.",
      "Practice asking for toiletries such as toothbrush, toothpaste, shampoo, or conditioner.",
      "Prompt the learner to ask about iron and ironing board availability.",
      "Practice ordering a simple room-service item and asking for the delivery time.",
      "Ask the learner to clarify the room number and a good delivery window.",
      "End by confirming whether the learner needs anything else before hanging up.",
    ],
    warmthPatterns: [
      "Keep the register polite but brief — a hotel call is a quick favour, not a negotiation.",
      "Soften requests with 'Could I get…?' or 'I was hoping to get…'",
      "Accept delivery timelines graciously: 'That's fine, thank you.'",
    ],
    seedInputs: [
      "Hi, this is room 412 — could I get some extra towels, please?",
      "Hello, I'd like to request an extra pillow and a blanket.",
      "Can I order a pot of tea and some biscuits from room service?",
    ],
    detectionPatterns: [
      /\b(?:extra towels?|extra pillow|room service|toiletries|toothbrush|iron|ironing board|more towels?|additional (?:towel|pillow|blanket)|amenities)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hotel-amenities-towel-count",
        label: "\"Thêm khăn\" → \"extra towels\" (countable)",
        note: "'Khăn' is uncountable in Vietnamese but 'towel/towels' is countable in English. Saying 'Could I get some extra towels?' is natural. Saying 'give me more towel' will be understood, but 'some extra towels' sounds hotel-professional.",
      },
      {
        id: "hotel-amenities-could-i-get",
        label: "\"Cho tôi\" → \"Could I get…?\"",
        note: "'Cho tôi' is 'give me' in Vietnamese — direct and normal there. In English hotel calls, the polite frame is 'Could I get…?' or 'I'd love an extra blanket if possible.' Keeping the same warm meaning while softening the phrasing.",
      },
      {
        id: "hotel-amenities-room-service-menu",
        label: "Room-service vocabulary",
        note: "Room service is ordered by phone or app. Saying 'I'd like to order from room service' opens the conversation. Then name the item and add 'for room [number].' Estimated delivery time is '20 to 30 minutes' — ask 'How long will it take?' if unsure.",
      },
    ],
    followUps: [
      { id: "hotel-amenities-room-number-fu", question: "How would you give your room number when calling?", salienceQuestion: "How would you identify your room for the {slot}?" },
      { id: "hotel-amenities-request-fu", question: "How would you ask for an extra towel or pillow politely?", salienceQuestion: "How would you ask for an item from the {slot}?" },
      { id: "hotel-amenities-toiletries-fu", question: "What toiletry items would you ask for and how?", salienceQuestion: "What toiletry would you need from the {slot}?" },
      { id: "hotel-amenities-time-fu", question: "How would you ask when the items will arrive?", salienceQuestion: "When will the {slot} arrive?" },
      { id: "hotel-amenities-roomservice-fu", question: "How would you place a simple room-service order?", salienceQuestion: "How would you order from the {slot}?" },
      { id: "hotel-amenities-close-fu", question: "How would you end the call and say thank you?", salienceQuestion: "How would you wrap up the {slot} call?" },
    ],
  },
  {
    id: "topic-hotel-lodging-room-problem",
    labelEn: "Reporting A Room Problem",
    labelVi: "Báo cáo sự cố trong phòng",
    category: "hotel-lodging",
    scenarioDescription:
      "The learner contacts the front desk or maintenance to report a problem in the room — broken air conditioning, noise, plumbing issue, or cleanliness concern — and asks for a solution.",
    aiRoleDefinition:
      "Act as a hotel front-desk agent who listens calmly to the problem, apologizes sincerely, and offers a concrete solution: sending maintenance, moving the guest, or applying a discount.",
    conversationDirections: [
      "Ask the learner to describe a broken appliance (AC, TV, shower, heater) simply and clearly.",
      "Practice reporting a noise problem from neighbors or construction without sounding angry.",
      "Prompt the learner to describe a cleanliness issue (dirty bathroom, stained sheets) politely.",
      "Ask the learner to accept or decline an offer to move rooms.",
      "Practice asking for a timeline: 'When can someone come to fix this?'",
      "End by asking the learner to confirm the resolution — fix, room change, or discount.",
    ],
    warmthPatterns: [
      "Report problems calmly and factually — staff respond better to 'There's a problem with my AC' than to frustration.",
      "Acknowledge the staff's response graciously even when inconvenienced.",
      "Ask for a specific timeline so expectations are clear on both sides.",
    ],
    seedInputs: [
      "Hi, this is room 305. My air conditioner isn't working.",
      "Excuse me, there's a loud noise coming from the room next door — it's very late.",
      "I wanted to report that my shower isn't draining properly.",
    ],
    detectionPatterns: [
      /\b(?:air conditioner|AC isn'?t|heater|shower (?:isn'?t|not)|noise|plumbing|tv isn'?t|broken|out of order|room (?:is |smells|has)|dirty|stained|maintenance)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hotel-problem-phong-co-van-de",
        label: "\"Phòng có vấn đề\" → \"There's a problem with my room\"",
        note: "'Phòng có vấn đề' becomes 'The room have problem' word-for-word. The natural frame is 'There's a problem with my room' or 'My AC isn't working.' Both phrases put the issue first without sounding angry.",
      },
      {
        id: "hotel-problem-noise-frame",
        label: "Reporting noise without blame",
        note: "Vietnamese directness ('Bên cạnh ồn lắm' = 'next door is very noisy') can land harshly in English if translated exactly. The soft frame 'There's a lot of noise coming from next door' describes the problem without pointing blame at specific guests.",
      },
      {
        id: "hotel-problem-timeline",
        label: "Asking for a fix timeline",
        note: "'Khi nào sửa được?' becomes 'When can you fix it?' which is fine. Adding a little context — 'I have an early meeting, so is there any way to fix it tonight?' — helps staff prioritize your request.",
      },
    ],
    followUps: [
      { id: "hotel-problem-describe-fu", question: "How would you describe what is broken or not working?", salienceQuestion: "What is the problem with the {slot}?" },
      { id: "hotel-problem-noise-fu", question: "How would you report a noise issue politely?", salienceQuestion: "How would you tell them about the noise near the {slot}?" },
      { id: "hotel-problem-clean-fu", question: "How would you report a cleanliness issue without sounding rude?", salienceQuestion: "How would you describe the {slot} cleanliness concern?" },
      { id: "hotel-problem-solution-fu", question: "How would you accept or decline a room change?", salienceQuestion: "Would you move rooms because of the {slot}?" },
      { id: "hotel-problem-timeline-fu", question: "How would you ask when someone will come to fix the problem?", salienceQuestion: "When will maintenance come for the {slot}?" },
      { id: "hotel-problem-confirm-fu", question: "How would you confirm the resolution before ending the call?", salienceQuestion: "What was resolved about the {slot}?" },
    ],
  },
  {
    id: "topic-hotel-lodging-hotel-services",
    labelEn: "Asking About Hotel Services",
    labelVi: "Hỏi về dịch vụ khách sạn",
    category: "hotel-lodging",
    scenarioDescription:
      "The learner asks the concierge or front desk about hotel services including breakfast hours, swimming pool, gym, parking, laundry, and local recommendations.",
    aiRoleDefinition:
      "Act as a hotel concierge who answers service questions with clear details — hours, locations, prices — and offers helpful recommendations for local restaurants or attractions.",
    conversationDirections: [
      "Ask the learner how they would ask whether breakfast is included and what time it is served.",
      "Practice asking where the pool or gym is located and what the hours are.",
      "Prompt the learner to ask about parking — self-park, valet, and daily rate.",
      "Practice asking about laundry or dry-cleaning service and pickup timing.",
      "Ask the learner to request a restaurant recommendation near the hotel.",
      "End by asking how the learner would thank the concierge and note down the information.",
    ],
    warmthPatterns: [
      "Concierge conversations are relaxed — curiosity and friendliness are welcome.",
      "Asking 'What would you recommend?' invites the local knowledge concierges love to share.",
      "Confirming hours and prices before committing shows practical confidence.",
    ],
    seedInputs: [
      "Excuse me, is breakfast included with my stay?",
      "What time does the pool open, and is there an extra fee?",
      "Could you recommend a good restaurant within walking distance?",
    ],
    detectionPatterns: [
      /\b(?:breakfast (?:included|hours?|time)|pool|gym|parking|valet|laundry|dry.?cleaning|concierge|restaurant recommendation|hotel (?:gym|pool|map|wifi|amenities))\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hotel-services-bua-sang",
        label: "\"Bữa sáng có bao gồm không?\" → \"Is breakfast included?\"",
        note: "'Bữa sáng có bao gồm không?' maps almost perfectly to 'Is breakfast included?' — a learner success to celebrate. If unsure whether it's free, adding 'or is there a charge?' covers both cases politely.",
      },
      {
        id: "hotel-services-parking",
        label: "Self-park vs valet",
        note: "Hotels often have 'self-parking' (you park your own car, cheaper) and 'valet parking' (staff park it for you, costs more). Asking 'Do you have parking?' then 'Is it self-park or valet?' gets a complete answer.",
      },
      {
        id: "hotel-services-recommend",
        label: "\"Nhờ gợi ý\" → \"What would you recommend?\"",
        note: "'Nhờ anh/chị gợi ý cho em' is a respectful request in Vietnamese. In English the easy phrase is 'What would you recommend?' or 'Any suggestions for a good dinner nearby?' Both show you trust the concierge's local knowledge.",
      },
    ],
    followUps: [
      { id: "hotel-services-breakfast-fu", question: "How would you ask if breakfast is included and what time it starts?", salienceQuestion: "What would you ask about breakfast at the {slot}?" },
      { id: "hotel-services-pool-fu", question: "How would you ask where the pool is and what the hours are?", salienceQuestion: "What would you ask about the pool for the {slot}?" },
      { id: "hotel-services-parking-fu", question: "How would you ask about parking options and daily rate?", salienceQuestion: "What parking question would you ask at the {slot}?" },
      { id: "hotel-services-laundry-fu", question: "How would you ask about laundry or dry-cleaning service?", salienceQuestion: "How would you handle laundry during the {slot}?" },
      { id: "hotel-services-restaurant-fu", question: "How would you ask for a restaurant recommendation?", salienceQuestion: "What restaurant would you ask about near the {slot}?" },
      { id: "hotel-services-thanks-fu", question: "How would you thank the concierge and wrap up the conversation?", salienceQuestion: "How would you close the {slot} conversation?" },
    ],
  },
  {
    id: "topic-hotel-lodging-late-checkout",
    labelEn: "Requesting A Late Checkout",
    labelVi: "Xin gia hạn giờ trả phòng",
    category: "hotel-lodging",
    scenarioDescription:
      "The learner calls the front desk to request a late checkout or to extend their stay by one night, asking about availability and any extra charge.",
    aiRoleDefinition:
      "Act as a front-desk agent who checks occupancy, offers the latest available checkout time, and quotes the extra charge or extended-stay rate if needed.",
    conversationDirections: [
      "Ask the learner how they would request a late checkout politely.",
      "Practice asking what the latest checkout time available is.",
      "Prompt the learner to ask whether there is an extra charge for a late checkout.",
      "Practice negotiating a specific time — for example, asking for 1 p.m. instead of noon.",
      "Ask the learner what they would say if a late checkout is not available.",
      "End by asking how the learner would confirm the new checkout time and thank staff.",
    ],
    warmthPatterns: [
      "Late-checkout requests are common — frame it as a polite question, never a demand.",
      "Accepting a partial solution graciously ('Noon works, thank you') keeps goodwill.",
      "Giving a reason (early flight, morning meeting) makes requests feel reasonable.",
    ],
    seedInputs: [
      "Hi, I was wondering if I could get a late checkout today.",
      "Is there any way to stay until 1 p.m. instead of noon?",
      "Could I extend my stay by one more night?",
    ],
    detectionPatterns: [
      /\b(?:late checkout|late check.?out|extend(?:ing)? my stay|one more night|stay (?:an|one) extra|checkout (?:at|until)|check out (?:later|at noon|at 1|after))\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hotel-late-checkout-tra-phong-muon",
        label: "\"Trả phòng muộn\" → \"late checkout\"",
        note: "'Trả phòng muộn' maps directly to 'late checkout.' The polite request is 'I'd like to request a late checkout if possible' or 'Is a late checkout available today?' Adding 'if possible' shows flexibility and gets a warmer answer.",
      },
      {
        id: "hotel-late-checkout-negotiate",
        label: "Asking for a specific time",
        note: "If the hotel offers noon as the latest but you need 1 p.m., it is fine to ask: 'Is 1 o'clock possible?' Staff appreciate a specific target — it is easier to approve than an open-ended 'as late as possible.'",
      },
      {
        id: "hotel-late-checkout-fee",
        label: "Asking about the extra charge",
        note: "Many hotels charge a half-day rate for late checkouts after a certain time. Asking 'Is there a fee for a late checkout?' before agreeing avoids surprise charges on your bill.",
      },
    ],
    followUps: [
      { id: "hotel-late-checkout-request-fu", question: "How would you ask for a late checkout politely?", salienceQuestion: "How would you request the {slot}?" },
      { id: "hotel-late-checkout-time-fu", question: "How would you ask what the latest available checkout time is?", salienceQuestion: "What time could you leave during the {slot}?" },
      { id: "hotel-late-checkout-fee-fu", question: "How would you ask if there is a fee for a late checkout?", salienceQuestion: "Is there a charge for the {slot}?" },
      { id: "hotel-late-checkout-negotiate-fu", question: "How would you request a specific time, like 1 p.m.?", salienceQuestion: "How would you ask for 1 p.m. during the {slot}?" },
      { id: "hotel-late-checkout-extend-fu", question: "How would you ask to extend your stay by one more night?", salienceQuestion: "How would you book one more night for the {slot}?" },
      { id: "hotel-late-checkout-confirm-fu", question: "How would you confirm the new checkout time before ending the call?", salienceQuestion: "How would you confirm the {slot} arrangement?" },
    ],
  },
  {
    id: "topic-hotel-lodging-checkout-dispute",
    labelEn: "Checking Out & Disputing A Charge",
    labelVi: "Trả phòng và khiếu nại phí phát sinh",
    category: "hotel-lodging",
    scenarioDescription:
      "The learner checks out at the front desk, reviews the final bill, and calmly disputes an incorrect charge — such as a minibar item they did not use or a room-service order they did not place.",
    aiRoleDefinition:
      "Act as a front-desk agent who presents the bill, listens carefully to the dispute, apologizes if there is an error, and either removes the charge or explains why it is correct.",
    conversationDirections: [
      "Ask the learner to say they are ready to check out and give their room number.",
      "Practice reviewing a bill line by line and spotting an unfamiliar charge.",
      "Prompt the learner to dispute a charge politely — minibar, parking, or room service.",
      "Practice providing evidence: 'I didn't open the minibar — could you check?'",
      "Ask the learner to accept the staff's explanation or ask for a supervisor if needed.",
      "End by confirming the final total, paying, and asking for a receipt.",
    ],
    warmthPatterns: [
      "Approach disputes calmly and factually — 'I believe there may be an error' opens more doors than frustration.",
      "Give the benefit of the doubt first: 'Could you double-check?' before escalating.",
      "Confirm the corrected total and ask for a receipt before leaving the desk.",
    ],
    seedInputs: [
      "Hi, I'd like to check out from room 412, please.",
      "I'm looking at my bill and I see a minibar charge, but I didn't use the minibar.",
      "Could you go over the charges with me? There's one I don't recognize.",
    ],
    detectionPatterns: [
      /\b(?:check out|checking out|review (?:my )?bill|dispute a charge|minibar charge|i didn'?t use|unrecognized charge|room.?service charge|final bill|receipt|invoice)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hotel-checkout-khong-dung-minibar",
        label: "\"Tôi không dùng minibar\" → \"I didn't use the minibar\"",
        note: "'Tôi không dùng minibar' translates well — just add the past tense: 'I didn't use the minibar.' The full polite phrase is 'I didn't use the minibar — could you check the record?' It sounds calm and gives staff a clear action.",
      },
      {
        id: "hotel-checkout-dispute-frame",
        label: "Disputing without blame",
        note: "In Vietnamese, a direct challenge ('Sai rồi!') is fine among friends but can sound harsh at a hotel front desk. The English frame 'I believe there may be an error on my bill' invites cooperation. 'Could you double-check this charge?' does the same thing softly.",
      },
      {
        id: "hotel-checkout-receipt",
        label: "Always ask for a receipt",
        note: "At checkout, asking for a receipt or 'a copy of my final bill' is standard. Say 'Could I get a receipt, please?' or 'Could you email me the invoice?' Hotel staff expect this and it protects you if a charge appears on your card later.",
      },
      {
        id: "hotel-checkout-supervisor",
        label: "Asking for a supervisor",
        note: "If the front-desk agent cannot resolve a dispute, politely ask: 'Could I speak with the manager, please?' This is a normal hotel escalation and is not considered rude in English-speaking cultures.",
      },
    ],
    followUps: [
      { id: "hotel-checkout-ready-fu", question: "How would you say you are ready to check out?", salienceQuestion: "How would you announce your {slot}?" },
      { id: "hotel-checkout-review-fu", question: "How would you ask to review your bill?", salienceQuestion: "How would you review the {slot} charges?" },
      { id: "hotel-checkout-dispute-fu", question: "How would you dispute a charge you don't recognize?", salienceQuestion: "How would you dispute a {slot} charge?" },
      { id: "hotel-checkout-evidence-fu", question: "What evidence or explanation would you give for the dispute?", salienceQuestion: "What would you say to back up your {slot} claim?" },
      { id: "hotel-checkout-supervisor-fu", question: "How would you politely ask to speak with a manager?", salienceQuestion: "How would you escalate the {slot} issue?" },
      { id: "hotel-checkout-receipt-fu", question: "How would you ask for a receipt before leaving the desk?", salienceQuestion: "How would you ask for a receipt at the {slot}?" },
    ],
  },
];
