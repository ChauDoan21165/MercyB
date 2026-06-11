import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D5SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

// Auto / car-repair CUSTOMER English: the learner is the car owner talking to a
// mechanic or service advisor — describing problems, approving estimates,
// booking service, asking about parts/warranty, and picking up the car.
export const speakTopics = [
  {
    id: "topic-auto-describe-car-problem",
    labelEn: "Describing A Car Problem",
    labelVi: "Mô tả sự cố xe",
    category: "auto-car-customer",
    scenarioDescription:
      "The learner is a car owner describing a symptom to a mechanic: a strange noise, a warning light, a leak, vibration, or a problem that only happens sometimes.",
    aiRoleDefinition:
      "Act as a calm auto service advisor who listens to the symptom and asks practical clarifying questions about when, where, and how often the problem happens.",
    conversationDirections: [
      "Open by asking what brings the car in today and listen for the main symptom.",
      "Ask when the problem happens: cold start, braking, turning, high speed, or all the time.",
      "Prompt the learner to describe a noise with simple words: grinding, squealing, clunking, or rattling.",
      "Ask whether a warning light is on and what color it is.",
      "Practice saying how long the problem has lasted and whether it is getting worse.",
      "Summarize the symptom back to confirm you understood before suggesting an inspection.",
    ],
    warmthPatterns: [
      "Keep the advisor reassuring: 'Thanks, that helps me know where to look.'",
      "Normalize not knowing the technical word: describe the sound or feeling instead.",
      "Avoid alarming the customer before the car is inspected.",
    ],
    seedInputs: ["There is a grinding noise when I press the brakes."],
    detectionPatterns: [
      /\b(?:check engine light|warning light|grinding|squealing|squeaking|rattling|vibration|leak|won't start|overheating|noise when)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "auto-problem-noise-words",
        label: "Tiếng kêu của xe",
        note: "Tiếng Việt thường dùng chung 'tiếng kêu' cho mọi âm thanh. Tiếng Anh sửa xe phân biệt rõ: 'grinding' (rít/nghiến), 'squealing' (ré), 'rattling' (lạch cạch). Hãy chọn từ gần nhất với âm thanh thật.",
      },
      {
        id: "auto-problem-when-it-happens",
        label: "It happens when…",
        note: "Người Việt hay nói 'when I brake it noise.' Mẫu tự nhiên là 'It makes a noise when I brake' hoặc 'It only happens when the engine is cold.'",
      },
      {
        id: "auto-problem-warning-light",
        label: "The check engine light is on",
        note: "Đèn báo lỗi trong tiếng Anh là 'warning light' hoặc cụ thể 'check engine light.' Nói 'the check engine light is on,' không dịch sát thành 'the lamp open.'",
      },
    ],
    followUps: [
      { id: "auto-problem-fu-symptom", question: "How would you describe the main symptom?", salienceQuestion: "How would you describe the {slot}?" },
      { id: "auto-problem-fu-when", question: "How would you say when the problem happens?", salienceQuestion: "When does the {slot} happen?" },
      { id: "auto-problem-fu-noise", question: "How would you describe the noise in simple words?", salienceQuestion: "What does the {slot} sound like?" },
      { id: "auto-problem-fu-light", question: "How would you say a warning light is on?", salienceQuestion: "Which {slot} is showing?" },
      { id: "auto-problem-fu-duration", question: "How would you say how long it has lasted?", salienceQuestion: "How long has the {slot} lasted?" },
    ],
  },
  {
    id: "topic-auto-repair-estimate-approval",
    labelEn: "Repair Estimate And Approval",
    labelVi: "Báo giá và duyệt sửa chữa",
    category: "auto-car-customer",
    scenarioDescription:
      "The learner reviews a repair estimate with a service advisor: understanding parts and labor, asking what is urgent, comparing options, and approving or declining work.",
    aiRoleDefinition:
      "Act as a service advisor who explains an estimate line by line, separates urgent from optional repairs, and waits for the customer's approval before any work.",
    conversationDirections: [
      "Walk through the estimate: parts cost, labor cost, and the total.",
      "Ask the learner to request a breakdown of what is urgent versus what can wait.",
      "Practice asking whether there is a cheaper option or an aftermarket part.",
      "Prompt the learner to ask how long the repair will take.",
      "Practice clearly approving some work and declining the rest.",
      "Confirm the final agreed price and that no extra work happens without a call.",
    ],
    warmthPatterns: [
      "Keep pricing talk transparent: 'Here's the parts cost and here's labor.'",
      "Respect a budget without pressure: 'We can do the brakes now and the rest later.'",
      "Confirm consent before any charge: 'I'll call you before I add anything.'",
    ],
    seedInputs: ["Can you explain what is urgent and what can wait?"],
    detectionPatterns: [
      /\b(?:estimate|quote|parts and labor|labor cost|how much will it cost|urgent|can it wait|approve the repair|aftermarket|breakdown)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "auto-estimate-parts-labor",
        label: "Parts and labor",
        note: "Hóa đơn sửa xe tách 'parts' (phụ tùng) và 'labor' (tiền công). Người Việt hay gộp thành 'tiền sửa,' nhưng nên hỏi riêng: 'How much is the part and how much is the labor?'",
      },
      {
        id: "auto-estimate-urgent-wait",
        label: "Urgent vs. can wait",
        note: "Để hỏi mức ưu tiên, dùng 'Is this urgent, or can it wait?' Đừng dịch sát 'this important now or not' — mẫu 'can it wait' nghe tự nhiên hơn.",
      },
      {
        id: "auto-estimate-approve",
        label: "Approve the repair",
        note: "Duyệt sửa là 'I'd like to approve the brake work' hoặc 'Go ahead with the brakes.' 'Approve' là động từ chuẩn ở tiệm sửa xe.",
      },
    ],
    followUps: [
      { id: "auto-estimate-fu-total", question: "How would you ask for the total cost?", salienceQuestion: "What is the total for the {slot}?" },
      { id: "auto-estimate-fu-breakdown", question: "How would you ask for a parts-and-labor breakdown?", salienceQuestion: "How would you split the {slot}?" },
      { id: "auto-estimate-fu-urgent", question: "How would you ask what is urgent?", salienceQuestion: "Is the {slot} urgent?" },
      { id: "auto-estimate-fu-cheaper", question: "How would you ask for a cheaper option?", salienceQuestion: "Is there a cheaper {slot}?" },
      { id: "auto-estimate-fu-approve", question: "How would you approve part of the work and decline the rest?", salienceQuestion: "Which {slot} would you approve?" },
    ],
  },
  {
    id: "topic-auto-book-service-appointment",
    labelEn: "Booking A Service Appointment",
    labelVi: "Đặt lịch bảo dưỡng xe",
    category: "auto-car-customer",
    scenarioDescription:
      "The learner calls or visits to book a service appointment: routine maintenance like an oil change, choosing a day and time, asking about drop-off, and giving the car's details.",
    aiRoleDefinition:
      "Act as a shop receptionist who checks availability, asks for the car's year, make, and model, and explains drop-off, wait, or loaner-car options.",
    conversationDirections: [
      "Greet and ask what service the learner needs to book.",
      "Ask for the car's year, make, model, and mileage.",
      "Offer a few day and time options and confirm one.",
      "Explain whether the customer will wait, drop off, or get a loaner car.",
      "Practice asking roughly how long the service will take.",
      "Confirm the appointment details and what to bring.",
    ],
    warmthPatterns: [
      "Keep scheduling friendly and efficient: 'I can fit you in Thursday morning.'",
      "Repeat the key details back so nothing is misheard.",
      "Offer the wait-or-drop-off choice without pressure.",
    ],
    seedInputs: ["I'd like to book an oil change for my car this week."],
    detectionPatterns: [
      /\b(?:book an appointment|schedule a service|oil change|drop off|drop-off|loaner car|wait for it|year make and model|mileage|tune-up)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "auto-book-make-model",
        label: "Year, make, and model",
        note: "Tiệm xe hỏi 'year, make, and model' (năm, hãng, dòng xe). Người Việt hay chỉ nói tên hãng; hãy nói đủ: 'It's a 2015 Toyota Camry.'",
      },
      {
        id: "auto-book-drop-off",
        label: "Drop off vs. wait",
        note: "'Drop off the car' nghĩa là để xe lại rồi đi. 'Wait for it' là ngồi chờ. Đừng dịch 'leave the car' thành 'throw the car' — dùng 'drop off.'",
      },
      {
        id: "auto-book-appointment-verb",
        label: "Book / schedule an appointment",
        note: "Đặt lịch là 'book an appointment' hoặc 'schedule a service.' Tránh 'register a time'; hai động từ trên là chuẩn ở Mỹ.",
      },
    ],
    followUps: [
      { id: "auto-book-fu-service", question: "How would you say which service you need?", salienceQuestion: "Which {slot} do you need to book?" },
      { id: "auto-book-fu-cardetails", question: "How would you give your car's year, make, and model?", salienceQuestion: "What are the details of the {slot}?" },
      { id: "auto-book-fu-time", question: "How would you confirm a day and time?", salienceQuestion: "Which {slot} works for you?" },
      { id: "auto-book-fu-dropoff", question: "How would you ask about drop-off or waiting?", salienceQuestion: "Would you drop off or wait for the {slot}?" },
      { id: "auto-book-fu-duration", question: "How would you ask how long it will take?", salienceQuestion: "How long is the {slot}?" },
    ],
  },
  {
    id: "topic-auto-parts-warranty-timeline",
    labelEn: "Parts, Warranty, And Timeline",
    labelVi: "Phụ tùng, bảo hành và thời gian",
    category: "auto-car-customer",
    scenarioDescription:
      "The learner asks about the parts being used, whether the repair is under warranty, how long it takes to order a part, and what guarantee comes with the work.",
    aiRoleDefinition:
      "Act as a service advisor who explains part options, warranty coverage, ordering time for a back-ordered part, and the shop's guarantee on the repair.",
    conversationDirections: [
      "Ask whether the part is new, used, original (OEM), or aftermarket.",
      "Practice asking if the repair or the part is still under warranty.",
      "Prompt the learner to ask how long it takes to order a back-ordered part.",
      "Ask what guarantee or warranty the shop gives on its own work.",
      "Practice asking what happens if the same problem comes back.",
      "Confirm the expected pickup day once parts arrive.",
    ],
    warmthPatterns: [
      "Be clear about coverage: 'This part has a one-year warranty.'",
      "Set honest timelines: 'The part is back-ordered until Friday.'",
      "Reassure about the shop's guarantee without overpromising.",
    ],
    seedInputs: ["Is this repair covered under warranty?"],
    detectionPatterns: [
      /\b(?:under warranty|warranty cover|oem|original part|aftermarket part|back-ordered|back ordered|guarantee|how long to order|covered)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "auto-parts-warranty-cover",
        label: "Under warranty",
        note: "Còn bảo hành là 'under warranty.' Hỏi 'Is this under warranty?' chứ không dịch 'still have warranty time.'",
      },
      {
        id: "auto-parts-oem-aftermarket",
        label: "OEM vs. aftermarket",
        note: "'OEM' là phụ tùng chính hãng; 'aftermarket' là phụ tùng thay thế. Người Việt hay nói 'real part / fake part'; nên dùng 'OEM' và 'aftermarket.'",
      },
      {
        id: "auto-parts-back-ordered",
        label: "The part is back-ordered",
        note: "Khi phụ tùng phải đặt thêm, người Mỹ nói 'the part is back-ordered.' Hỏi 'How long to order the part?' để biết thời gian chờ.",
      },
    ],
    followUps: [
      { id: "auto-parts-fu-type", question: "How would you ask whether the part is OEM or aftermarket?", salienceQuestion: "What kind of {slot} is it?" },
      { id: "auto-parts-fu-warranty", question: "How would you ask if it is under warranty?", salienceQuestion: "Is the {slot} under warranty?" },
      { id: "auto-parts-fu-order", question: "How would you ask how long to order the part?", salienceQuestion: "How long to order the {slot}?" },
      { id: "auto-parts-fu-guarantee", question: "How would you ask about the shop's guarantee?", salienceQuestion: "What guarantee covers the {slot}?" },
      { id: "auto-parts-fu-recur", question: "How would you ask what happens if it breaks again?", salienceQuestion: "What if the {slot} comes back?" },
    ],
  },
  {
    id: "topic-auto-pickup-invoice-review",
    labelEn: "Picking Up The Car And Reviewing The Invoice",
    labelVi: "Nhận xe và kiểm tra hóa đơn",
    category: "auto-car-customer",
    scenarioDescription:
      "The learner picks up the repaired car and reviews the invoice: confirming what was done, checking the charges match the estimate, asking about a test drive, and paying.",
    aiRoleDefinition:
      "Act as a service advisor handing back the car who explains the invoice, confirms the work done, and answers questions about charges and follow-up care.",
    conversationDirections: [
      "Greet the customer and confirm the car is ready.",
      "Walk through the invoice: what was repaired and the final charge.",
      "Practice checking that the total matches the approved estimate.",
      "Prompt the learner to ask about a test drive or what to watch for.",
      "Handle a charge that looks different from the estimate, politely.",
      "Confirm payment method and ask for any warranty paperwork.",
    ],
    warmthPatterns: [
      "Hand back the car with a clear summary: 'We replaced the brake pads and rotors.'",
      "Invite questions about the bill without defensiveness.",
      "Offer a calm path when a charge is questioned: 'Let me check that line for you.'",
    ],
    seedInputs: ["Can you explain this charge on the invoice?"],
    detectionPatterns: [
      /\b(?:invoice|final bill|the car is ready|what was done|matches the estimate|test drive|pay by card|warranty paperwork|receipt|itemized)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "auto-pickup-invoice-word",
        label: "Invoice / receipt",
        note: "Hóa đơn sửa xe là 'invoice' (chi tiết) hoặc 'receipt' (biên nhận thanh toán). Người Việt hay nói 'the bill paper'; dùng 'invoice' khi xem chi tiết.",
      },
      {
        id: "auto-pickup-matches-estimate",
        label: "It matches the estimate",
        note: "Để kiểm tra giá đúng như báo giá, nói 'Does this match the estimate?' Tránh 'the price same like before'; mẫu 'match the estimate' chuẩn hơn.",
      },
      {
        id: "auto-pickup-test-drive",
        label: "Test drive",
        note: "Chạy thử sau sửa là 'test drive.' Hỏi 'Can I take it for a test drive?' để chắc xe đã ổn.",
      },
    ],
    followUps: [
      { id: "auto-pickup-fu-done", question: "How would you confirm what was repaired?", salienceQuestion: "What was done to the {slot}?" },
      { id: "auto-pickup-fu-match", question: "How would you check the bill matches the estimate?", salienceQuestion: "Does the {slot} match the estimate?" },
      { id: "auto-pickup-fu-charge", question: "How would you ask about a charge you don't recognize?", salienceQuestion: "What is this {slot} for?" },
      { id: "auto-pickup-fu-testdrive", question: "How would you ask for a test drive?", salienceQuestion: "Can you test drive the {slot}?" },
      { id: "auto-pickup-fu-pay", question: "How would you confirm payment and warranty paperwork?", salienceQuestion: "How would you pay for the {slot}?" },
    ],
  },
] as const satisfies readonly D5SpeakTopic[];
