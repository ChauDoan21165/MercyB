import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D4ProfessionalSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

// Car rental customer English — a Vietnamese learner renting a car (booking,
// counter check-in, agreement, during rental, return + billing).
// note-ids use "-note-" and followUp-ids use "-fu-" so the two id spaces are
// disjoint per topic (A9/B3 guard).
export const speakTopics = [
  {
    id: "topic-car-rental-booking",
    labelEn: "Booking A Rental Car",
    labelVi: "Đặt xe thuê",
    category: "car-rental-customer-english",
    scenarioDescription:
      "The learner books a rental car online or by phone, choosing a car type, pickup location, dates, and adding a driver while asking about price and policies.",
    aiRoleDefinition:
      "Act as a helpful rental-car agent who asks about dates, location, car size, and extra drivers, explains pricing tiers, and answers basic policy questions.",
    conversationDirections: [
      "Ask the learner to state the pickup date, return date, and pickup location.",
      "Practice asking which car category they need: economy, compact, SUV, or minivan.",
      "Prompt the learner to ask whether an additional driver can be added and what it costs.",
      "Have the learner ask about the cancellation policy and whether the booking is refundable.",
      "Practice asking whether the price shown includes taxes and fees.",
      "Confirm the learner can ask what documents they need to bring at pickup.",
    ],
    warmthPatterns: [
      "Start simply: 'Tell me your travel dates and I'll find the best options.'",
      "Make the upsell easy to decline: 'An SUV is available too — would that work better?'",
      "Reassure about documents: 'You just need your license and a credit card.'",
    ],
    seedInputs: ["I want rent a car for 3 days from the airport."],
    detectionPatterns: [
      /\b(?:rent(?:al)?|book(?:ing)?|pickup|car type|economy|compact|SUV|dates?|reservation|extra driver|cancell?ation)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "car-rental-booking-note-rent",
        label: "Rent vs borrow",
        note: "'Thuê xe' là 'rent a car', không phải 'borrow a car' — borrow thường chỉ nhận miễn phí từ bạn bè. Nói 'I'd like to rent a car for three days' hoặc 'I need a rental car from Friday.'",
      },
      {
        id: "car-rental-booking-note-reserve",
        label: "Book and reserve",
        note: "'Đặt chỗ trước' là 'book' hoặc 'make a reservation/reserve'. Tránh 'I want to order a car.' Nói 'I'd like to book an economy car for the 15th.'",
      },
      {
        id: "car-rental-booking-note-fee",
        label: "Taxes and fees",
        note: "'Phí' là 'fee', còn 'thuế' là 'tax'. Khi hỏi tổng chi phí, dùng 'Does the price include all taxes and fees?' thay vì 'Include all tax?'",
      },
    ],
    followUps: [
      { id: "car-rental-booking-fu-dates", question: "What dates do you need the car?", salienceQuestion: "How would you state the {slot}?" },
      { id: "car-rental-booking-fu-type", question: "What size or type of car do you need?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "car-rental-booking-fu-driver", question: "How do you ask about adding a second driver?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "car-rental-booking-fu-cancel", question: "How do you ask about the cancellation policy?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "car-rental-booking-fu-total", question: "How do you ask if taxes and fees are included?", salienceQuestion: "How would you ask about the {slot} in the final price?" },
    ],
  },
  {
    id: "topic-car-rental-counter",
    labelEn: "Checking In At The Rental Counter",
    labelVi: "Làm thủ tục thuê xe tại quầy",
    category: "car-rental-customer-english",
    scenarioDescription:
      "The learner picks up the car at the counter, shows their license and credit card, chooses whether to accept or decline insurance and GPS, and asks about fuel policy.",
    aiRoleDefinition:
      "Act as a rental counter agent who checks documents, offers insurance and upgrade options, explains the fuel policy, and hands over the keys with a quick vehicle walkthrough.",
    conversationDirections: [
      "Ask the learner to confirm the reservation and present their license and credit card.",
      "Practice accepting or politely declining the collision damage waiver.",
      "Prompt the learner to ask what the fuel policy is before driving away.",
      "Have the learner ask whether they need to return the car with a full tank.",
      "Practice asking where to find the car in the lot and how to inspect it first.",
      "Confirm the learner can ask what number to call if there is a problem.",
    ],
    warmthPatterns: [
      "Keep insurance clear: 'I'll explain each option in one sentence — no pressure.'",
      "Fuel policy matters: 'Always good to ask — it saves surprises at return.'",
      "Hand over with calm: 'The car is in bay 14; take a quick look before you drive off.'",
    ],
    seedInputs: ["I have a reservation. I'm not sure if I need the insurance."],
    detectionPatterns: [
      /\b(?:counter|check[- ]?in|reservation|license|credit card|insurance|CDW|fuel|full tank|keys?|collision|damage waiver)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "car-rental-counter-note-insurance",
        label: "Insurance: decline, not refuse",
        note: "'Từ chối bảo hiểm thêm' là 'decline the insurance' — 'refuse' nghe có vẻ bực bội. Nói 'I'd like to decline the extra coverage' hoặc 'I'll pass on the CDW, thank you.'",
      },
      {
        id: "car-rental-counter-note-license",
        label: "Driver's license",
        note: "'Bằng lái' là 'driver's license'. Nếu dùng bằng từ nước ngoài, hỏi 'Do you accept an international driving permit?' — không phải 'foreign drive paper'.",
      },
    ],
    followUps: [
      { id: "car-rental-counter-fu-docs", question: "What documents do you show at the counter?", salienceQuestion: "How would you present the {slot}?" },
      { id: "car-rental-counter-fu-insurance", question: "How do you politely decline the extra insurance?", salienceQuestion: "How would you decline the {slot}?" },
      { id: "car-rental-counter-fu-fuel", question: "How do you ask about the fuel policy?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "car-rental-counter-fu-inspect", question: "How do you ask to inspect the car first?", salienceQuestion: "How would you ask about checking the {slot}?" },
      { id: "car-rental-counter-fu-help", question: "How do you ask what number to call if something goes wrong?", salienceQuestion: "How would you ask for the {slot} contact?" },
    ],
  },
  {
    id: "topic-car-rental-agreement",
    labelEn: "Understanding The Rental Agreement",
    labelVi: "Hiểu hợp đồng thuê xe",
    category: "car-rental-customer-english",
    scenarioDescription:
      "The learner reads and signs the rental agreement, asking about mileage limits, late-return fees, toll charges, and what happens if there is an accident.",
    aiRoleDefinition:
      "Act as a rental agent who walks the learner through the key agreement clauses in plain language, answers questions about mileage, tolls, and liability, and flags what to check at vehicle return.",
    conversationDirections: [
      "Ask the learner to read the mileage section and ask if there is a daily limit.",
      "Practice asking what the fee is for returning the car late.",
      "Prompt the learner to ask how tolls are handled — electronic or pay at return.",
      "Have the learner ask what to do if there is a small dent or scratch on return.",
      "Practice asking who to call if the car breaks down or there is an accident.",
      "Confirm the learner can ask what the deductible is on the collision coverage.",
    ],
    warmthPatterns: [
      "Normalize the questions: 'These are exactly the right things to ask.'",
      "Translate jargon: 'Deductible just means the amount you pay before insurance kicks in.'",
      "Make tolls clear: 'Easy to miss — glad you asked about it.'",
    ],
    seedInputs: ["I don't understand this paper. What is 'unlimited mileage'?"],
    detectionPatterns: [
      /\b(?:agreement|contract|mileage|unlimited|late fee|return|toll|deductible|liability|scratch|dent|breakdown|accident)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "car-rental-agreement-note-mileage",
        label: "Mileage, not kilometer",
        note: "Mỹ dùng dặm (miles), không phải km. 'Unlimited mileage' nghĩa là không giới hạn quãng đường. Nếu có giới hạn, hỏi 'Is there a mileage cap per day?'",
      },
      {
        id: "car-rental-agreement-note-deductible",
        label: "Deductible — mức khấu trừ",
        note: "'Deductible' (mức khấu trừ) là số tiền bạn trả trước khi bảo hiểm chi trả phần còn lại. Ví dụ: deductible $500 nghĩa là bạn trả $500 đầu tiên của mọi sự cố. Hỏi 'What is the deductible if I get in an accident?'",
      },
    ],
    followUps: [
      { id: "car-rental-agreement-fu-mileage", question: "How do you ask if mileage is unlimited?", salienceQuestion: "How would you ask about the {slot} limit?" },
      { id: "car-rental-agreement-fu-late", question: "How do you ask about the late-return fee?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "car-rental-agreement-fu-toll", question: "How do you ask how tolls are charged?", salienceQuestion: "How would you ask about {slot} charges?" },
      { id: "car-rental-agreement-fu-damage", question: "How do you ask about minor damage at return?", salienceQuestion: "How would you ask about the {slot} policy?" },
      { id: "car-rental-agreement-fu-deductible", question: "How do you ask what the deductible is?", salienceQuestion: "How would you ask about the {slot} amount?" },
    ],
  },
  {
    id: "topic-car-rental-during",
    labelEn: "Problems During The Rental",
    labelVi: "Xử lý sự cố trong thời gian thuê xe",
    category: "car-rental-customer-english",
    scenarioDescription:
      "The learner handles problems mid-rental: a warning light, a flat tire, a minor accident, or needing to extend the rental, and calls the rental company for help.",
    aiRoleDefinition:
      "Act as a rental-company roadside support agent who helps the learner describe a problem, decides whether to send a replacement car, and explains what to do at the scene of an accident.",
    conversationDirections: [
      "Ask the learner to describe a warning light or dashboard indicator in plain words.",
      "Practice reporting a flat tire and asking whether to call roadside assistance.",
      "Prompt the learner to describe a minor fender-bender and ask what to do next.",
      "Have the learner ask how to extend the rental by one or two days.",
      "Practice asking whether they should take photos of any damage before driving.",
      "Confirm the learner can ask where the nearest authorized repair shop is.",
    ],
    warmthPatterns: [
      "Stay calm first: 'Pull over safely — I'll guide you step by step.'",
      "Extend without stress: 'Extending is easy — I just need the new return date.'",
      "Photos are always right: 'Yes, always take photos before and after anything.'",
    ],
    seedInputs: ["There is a light on the dashboard. I don't know what it mean."],
    detectionPatterns: [
      /\b(?:warning light|flat tire|accident|fender[- ]?bender|extend|roadside|tow|breakdown|dashboard|photo|damage|repair)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "car-rental-during-note-light",
        label: "Warning light, not error light",
        note: "'Đèn báo lỗi' trên xe thường gọi là 'warning light' hoặc 'dashboard warning'. Mô tả màu sắc và hình: 'There is an orange light shaped like an engine.' Tránh 'the car has a mistake sign.'",
      },
      {
        id: "car-rental-during-note-accident",
        label: "Accident and fender-bender",
        note: "Va chạm nhẹ thường gọi là 'fender-bender'. Tai nạn nghiêm trọng hơn là 'accident'. 'I was in a minor fender-bender' — không phải 'I hit a car a little bit' (dù nghe hiểu được, không tự nhiên).",
      },
    ],
    followUps: [
      { id: "car-rental-during-fu-light", question: "How do you describe a warning light to the support agent?", salienceQuestion: "How would you describe the {slot}?" },
      { id: "car-rental-during-fu-flat", question: "How do you report a flat tire?", salienceQuestion: "How would you explain the {slot} situation?" },
      { id: "car-rental-during-fu-accident", question: "How do you explain a minor accident?", salienceQuestion: "How would you describe the {slot}?" },
      { id: "car-rental-during-fu-extend", question: "How do you ask to extend the rental by a day?", salienceQuestion: "How would you ask to extend the {slot}?" },
      { id: "car-rental-during-fu-photos", question: "How do you ask if you should take photos?", salienceQuestion: "How would you ask about documenting the {slot}?" },
    ],
  },
  {
    id: "topic-car-rental-return",
    labelEn: "Returning The Car And Checking The Bill",
    labelVi: "Trả xe và kiểm tra hóa đơn",
    category: "car-rental-customer-english",
    scenarioDescription:
      "The learner returns the car, goes through the inspection with the agent, and checks the final bill — questioning unexpected charges and asking for a receipt.",
    aiRoleDefinition:
      "Act as a return-lot agent who inspects the car with the learner, explains each line on the final invoice, and helps dispute or clarify unexpected charges.",
    conversationDirections: [
      "Ask the learner to describe the car's condition when they drop it off.",
      "Practice asking the agent to explain what each charge on the bill is for.",
      "Prompt the learner to question a fuel charge they think is wrong.",
      "Have the learner ask for a printed or emailed receipt.",
      "Practice asking whether a toll charge that appeared is correct.",
      "Confirm the learner can ask to speak with a manager if a charge is disputed.",
    ],
    warmthPatterns: [
      "Inspection is routine: 'We'll just do a quick walk-around together — it takes two minutes.'",
      "Encourage questions: 'Always ask if a charge looks unfamiliar — that's your right.'",
      "Receipt matters: 'I'll email it right now so you have it for your records.'",
    ],
    seedInputs: ["There is a charge here I don't understand. What is 'fuel service fee'?"],
    detectionPatterns: [
      /\b(?:return|drop[- ]?off|inspection|receipt|bill|charge|fuel service fee|invoice|dispute|manager|toll charge|damage fee)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "car-rental-return-note-charge",
        label: "Charge and fee",
        note: "'Phí' trong hóa đơn là 'charge' hoặc 'fee'. Khi muốn hỏi về một khoản phí, dùng 'Can you explain this charge?' hoặc 'What is this fee for?' — không phải 'Why this money?'",
      },
      {
        id: "car-rental-return-note-dispute",
        label: "Dispute a charge",
        note: "'Phản đối/từ chối một khoản phí' là 'dispute a charge'. Nói 'I'd like to dispute this fuel charge — I returned the car with a full tank.' Giữ bình tĩnh và lịch sự để được giải quyết nhanh hơn.",
      },
    ],
    followUps: [
      { id: "car-rental-return-fu-condition", question: "How do you describe the car's condition at drop-off?", salienceQuestion: "How would you describe the {slot}?" },
      { id: "car-rental-return-fu-explain", question: "How do you ask the agent to explain a charge?", salienceQuestion: "How would you ask about the {slot} on the bill?" },
      { id: "car-rental-return-fu-fuel", question: "How do you question a fuel charge you disagree with?", salienceQuestion: "How would you dispute the {slot} charge?" },
      { id: "car-rental-return-fu-receipt", question: "How do you ask for a receipt?", salienceQuestion: "How would you request the {slot}?" },
      { id: "car-rental-return-fu-manager", question: "How do you ask to speak with a manager about a dispute?", salienceQuestion: "How would you escalate the {slot}?" },
    ],
  },
] satisfies readonly D4ProfessionalSpeakTopic[];
