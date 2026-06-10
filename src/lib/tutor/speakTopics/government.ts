import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type FinalThemeSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-government-service-counter",
    labelEn: "Government Service Counter",
    labelVi: "Quầy dịch vụ hành chính",
    category: "government",
    scenarioDescription:
      "The learner visits a government or municipal service counter to ask about a form, required documents, wait time, and the next step.",
    aiRoleDefinition:
      "Act as a patient service-counter clerk who asks what the learner needs, checks basic documents, and explains the next step in simple public-service English.",
    conversationDirections: [
      "Ask what service or form the learner needs today.",
      "Prompt the learner to name their documents without sharing private numbers aloud.",
      "Practice asking where to submit the form and whether a copy is needed.",
      "Ask about appointment time, queue number, fee, and expected processing time.",
      "Help the learner ask for clarification if instructions are confusing.",
      "End by confirming the next step, office location, or receipt.",
    ],
    warmthPatterns: [
      "Use slow, respectful language around official forms.",
      "Normalize asking again when a process is unclear.",
      "Protect privacy while practicing document names.",
    ],
    seedInputs: [
      "I need help at the government service counter.",
      "Which counter do I go to for this form?",
      "Do I need to take a queue number first?",
    ],
    detectionPatterns: [
      /\b(?:government service|service counter|municipal office|city hall|public office|official form|queue number|processing time)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "government-counter-article",
        label: "At the government office",
        note: "Vietnamese learners may drop articles and say 'at government office.' A natural phrase is 'at the government office' or 'at a government office.'",
      },
      {
        id: "government-counter-ask-for",
        label: "Ask for help",
        note: "'Hỏi giúp' can become 'ask help.' At a counter, the safer phrase is 'I need help with this form' or 'Can I ask for help?'",
      },
      {
        id: "government-counter-copy-original",
        label: "Copy or original",
        note: "Government counters often ask whether a document is an original or a copy. A useful question is 'Do you need the original, or is a copy okay?'",
      },
      {
        id: "government-counter-vocab",
        label: "Vocabulary",
        note: "service counter = quầy dịch vụ; queue number = số thứ tự; processing time = thời gian xử lý; original / copy = bản gốc / bản sao.",
      },
      {
        id: "government-counter-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Dạ cho em hỏi nộp đơn này ở quầy nào ạ?' ↔ EN: 'Which counter do I submit this form at?'",
      },
    ],
    followUps: [
      { id: "government-counter-service", question: "What service do you need today?", salienceQuestion: "What service do you need for the {slot}?" },
      { id: "government-counter-docs", question: "What documents do you need to show?", salienceQuestion: "What document connects to the {slot}?" },
      { id: "government-counter-wait", question: "How would you ask about the wait time?", salienceQuestion: "How long might the {slot} take?" },
      { id: "government-counter-clarify", question: "How would you ask them to explain the instruction again?", salienceQuestion: "What is unclear about the {slot}?" },
      { id: "government-counter-next", question: "How would you confirm the next step?", salienceQuestion: "What is the next step for the {slot}?" },
      { id: "government-counter-copy", question: "How would you ask if they need the original or a copy?", salienceQuestion: "Which version of the {slot} do they need?" },
    ],
  },
  {
    id: "topic-government-benefits-application",
    labelEn: "Benefits Application",
    labelVi: "Đăng ký phúc lợi",
    category: "government",
    scenarioDescription:
      "The learner asks about applying for public benefits, support payments, childcare help, health coverage, or another assistance program.",
    aiRoleDefinition:
      "Act as a benefits office worker who explains eligibility, documents, deadlines, and status checks without giving legal or financial advice.",
    conversationDirections: [
      "Ask which benefit or support program the learner wants to understand.",
      "Prompt the learner to ask about eligibility in plain English.",
      "Practice describing household, work, income, and address details carefully.",
      "Ask what documents, forms, or deadlines are required.",
      "Practice checking application status and responding to missing-document notices.",
      "End with a clear next step and a reminder to keep written confirmation.",
    ],
    warmthPatterns: [
      "Use a calm tone because benefits conversations can feel stressful.",
      "Avoid judgment about income, family status, or immigration status.",
      "Keep advice procedural: ask the office, read the notice, confirm in writing.",
    ],
    seedInputs: [
      "I want to ask about a benefits application.",
      "Am I eligible for this benefit?",
      "What documents do I need to apply?",
    ],
    detectionPatterns: [
      /\b(?:benefits application|public benefits|support payment|assistance program|childcare benefit|health coverage|eligibility|application status)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "government-benefits-eligible",
        label: "Am I eligible?",
        note: "Learners may say 'Do I can get benefit?' A natural office question is 'Am I eligible for this benefit?'",
      },
      {
        id: "government-benefits-status",
        label: "Check the status",
        note: "'Kiểm tra hồ sơ' often maps to 'check my application.' For an office call, 'check the status of my application' is precise.",
      },
      {
        id: "government-benefits-written-confirmation",
        label: "Get it in writing",
        note: "For deadlines or missing documents, ask for written confirmation: 'Could you send that to me in writing?' It protects you from remembering details wrong.",
      },
      {
        id: "government-benefits-vocab",
        label: "Vocabulary",
        note: "benefit = phúc lợi, trợ cấp; eligible = đủ điều kiện; application status = tình trạng hồ sơ; deadline = hạn chót.",
      },
      {
        id: "government-benefits-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Dạ cho em hỏi em có đủ điều kiện nhận trợ cấp này không ạ?' ↔ EN: 'Am I eligible for this benefit?'",
      },
    ],
    followUps: [
      { id: "government-benefits-program", question: "Which benefit or support program are you asking about?", salienceQuestion: "Which program connects to the {slot}?" },
      { id: "government-benefits-eligible", question: "How would you ask if you are eligible?", salienceQuestion: "How would you ask if the {slot} is available to you?" },
      { id: "government-benefits-docs", question: "What document might they ask you to provide?", salienceQuestion: "What proof is needed for the {slot}?" },
      { id: "government-benefits-deadline", question: "How would you ask about the deadline?", salienceQuestion: "What deadline matters for the {slot}?" },
      { id: "government-benefits-status", question: "How would you ask about your application status?", salienceQuestion: "How would you check the {slot}?" },
      { id: "government-benefits-written", question: "How would you ask for the instructions in writing?", salienceQuestion: "How would you save details about the {slot}?" },
    ],
  },
  {
    id: "topic-government-residence-address",
    labelEn: "Residence Or Address Record",
    labelVi: "Hồ sơ cư trú hoặc địa chỉ",
    category: "government",
    scenarioDescription:
      "The learner needs to update, confirm, or request a residence or address record for school, work, banking, immigration, or local paperwork.",
    aiRoleDefinition:
      "Act as an office clerk who asks for current address details, explains proof-of-address requirements, and helps the learner request confirmation.",
    conversationDirections: [
      "Ask whether the learner is updating an address, requesting proof, or correcting a record.",
      "Practice saying current address, old address, move date, and household details.",
      "Prompt the learner to ask what proof is accepted.",
      "Ask whether the office needs an original, a copy, or an online upload.",
      "Practice correcting a spelling or address mistake politely.",
      "End by confirming when the record will be updated or available.",
    ],
    warmthPatterns: [
      "Keep address practice precise but not rushed.",
      "Treat correction requests as normal and solvable.",
      "Remind the learner to avoid saying unnecessary private numbers.",
    ],
    seedInputs: [
      "I need to update my address record.",
      "I moved last month — how do I change my address?",
      "What counts as proof of address here?",
    ],
    detectionPatterns: [
      /\b(?:address record|residence record|proof of address|update my address|change my address|current address|old address|move date)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "government-address-update",
        label: "Update my address",
        note: "Vietnamese learners may say 'change address in paper.' A natural office phrase is 'I need to update my address record.'",
      },
      {
        id: "government-address-proof",
        label: "Proof of address",
        note: "Use 'proof of address,' not 'proof for address,' when asking what documents the office accepts.",
      },
      {
        id: "government-address-spelling",
        label: "Spell the street name",
        note: "If the clerk writes the address wrong, a calm phrase is 'Could I spell the street name for you?' This fixes the record without sounding blaming.",
      },
      {
        id: "government-address-vocab",
        label: "Vocabulary",
        note: "proof of address = giấy tờ chứng minh địa chỉ; update = cập nhật; move date = ngày chuyển nhà; record = hồ sơ, sổ ghi.",
      },
      {
        id: "government-address-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Em mới chuyển nhà, em cần cập nhật địa chỉ ạ.' ↔ EN: 'I just moved, so I need to update my address.'",
      },
    ],
    followUps: [
      { id: "government-address-purpose", question: "Why do you need the address record?", salienceQuestion: "Why do you need the {slot}?" },
      { id: "government-address-current", question: "How would you say your current address clearly?", salienceQuestion: "What address belongs with the {slot}?" },
      { id: "government-address-proof", question: "How would you ask what proof of address is accepted?", salienceQuestion: "What proof is needed for the {slot}?" },
      { id: "government-address-correct", question: "How would you correct a mistake politely?", salienceQuestion: "What mistake might be in the {slot}?" },
      { id: "government-address-ready", question: "How would you ask when the record will be ready?", salienceQuestion: "When will the {slot} be ready?" },
      { id: "government-address-spell", question: "How would you spell or repeat the address carefully?", salienceQuestion: "How would you spell the {slot}?" },
    ],
  },
  {
    id: "topic-government-book-appointment",
    labelEn: "Booking A Government Appointment",
    labelVi: "Đặt lịch hẹn với cơ quan nhà nước",
    category: "government",
    scenarioDescription:
      "The learner calls or visits to book a government appointment for an ID, renewal, or benefits question, gives the purpose early, and confirms the date and office.",
    aiRoleDefinition:
      "Act as a government booking clerk who asks what the appointment is for, offers dates and an office location, and confirms the details.",
    conversationDirections: [
      "Ask what service the appointment is for.",
      "Offer a day and time, and a nearby office location.",
      "Practice the learner stating the purpose early.",
      "Confirm the date, time, and place together.",
      "Remind the learner what to bring before ending.",
    ],
    warmthPatterns: [
      "Keep the booking calm and step-by-step.",
      "Reassure the learner that stating the purpose first speeds things up.",
      "Encourage 'book an appointment' over 'make a schedule.'",
    ],
    seedInputs: ["I would like to book an appointment for my ID application."],
    detectionPatterns: [
      /\b(?:government appointment|book an appointment|schedule an appointment|id application|passport office|service center|service centre)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "government-book-dat-lich",
        label: "Book an appointment",
        note: "Vietnamese 'đặt lịch' can sound like 'make a schedule.' In English offices, 'book an appointment' or 'schedule an appointment' is the everyday frame.",
      },
      {
        id: "government-book-purpose-first",
        label: "Purpose early",
        note: "Staff can help faster when the service comes early: 'for my ID application,' 'for a renewal,' or 'for a benefits question.'",
      },
      {
        id: "government-book-what-bring",
        label: "Ask what to bring",
        note: "Before the appointment, ask 'What should I bring?' so you arrive with the right documents and avoid a second trip.",
      },
    ],
    followUps: [
      { id: "government-book-service", question: "What service do you need the appointment for?", salienceQuestion: "How would you name the {slot} when booking?" },
      { id: "government-book-date", question: "What day or time would work for you?", salienceQuestion: "What time would you ask for the {slot}?" },
      { id: "government-book-location", question: "Which office location is best for you?", salienceQuestion: "Which office handles the {slot}?" },
      { id: "government-book-confirm", question: "How would you confirm the appointment details?", salienceQuestion: "How would you confirm the {slot} before ending the call?" },
      { id: "government-book-bring", question: "How would you ask what to bring?", salienceQuestion: "What should you bring to the {slot}?" },
      { id: "government-book-reminder", question: "How would you ask for a reminder?", salienceQuestion: "How would you get a reminder for the {slot}?" },
    ],
  },
  {
    id: "topic-government-missing-document",
    labelEn: "When A Document Is Missing",
    labelVi: "Khi thiếu giấy tờ",
    category: "government",
    scenarioDescription:
      "At the counter the learner realizes a required document is missing, asks what proof they already have is enough, and what to bring next time and by when.",
    aiRoleDefinition:
      "Act as a counter officer who explains which document is missing, what can still be accepted today, and what to bring back and by when.",
    conversationDirections: [
      "Ask which document might be missing.",
      "Check what proof the learner already has with them.",
      "Explain what to bring next time.",
      "Practice the learner asking about the deadline.",
      "Confirm the next step before they leave.",
    ],
    warmthPatterns: [
      "Keep it reassuring; a missing paper is fixable.",
      "Reassure the learner that asking the next step is normal.",
      "Encourage 'documents' over 'papers' for clarity.",
    ],
    seedInputs: ["I think I am missing one document. What should I bring?"],
    detectionPatterns: [
      /\b(?:missing document|forgot a document|what should i bring|required document|proof of address|birth certificate|photo id)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "government-document-paper",
        label: "Document, not paper",
        note: "Vietnamese 'giấy tờ' may become 'papers.' In government English, 'documents' sounds clearer and more official.",
      },
      {
        id: "government-document-what-bring",
        label: "Ask the next step",
        note: "If something is missing, a calm question works: 'What should I bring next time?' It keeps the conversation moving.",
      },
      {
        id: "government-document-copy-ok",
        label: "Copy or original",
        note: "Offices may want an original or accept a copy. Asking 'Do you need the original or a copy?' saves a wasted trip.",
      },
    ],
    followUps: [
      { id: "government-missing-which", question: "Which document might be missing?", salienceQuestion: "How would you ask about the missing {slot}?" },
      { id: "government-missing-proof", question: "What proof do you already have with you?", salienceQuestion: "What proof can support the {slot}?" },
      { id: "government-missing-next", question: "How would you ask what to bring next time?", salienceQuestion: "What should you bring for the {slot}?" },
      { id: "government-missing-deadline", question: "How would you ask about the deadline?", salienceQuestion: "What is the deadline for the {slot}?" },
      { id: "government-missing-copy", question: "How would you ask if a copy is okay?", salienceQuestion: "Does the {slot} need an original?" },
      { id: "government-missing-hold", question: "How would you ask them to hold your file?", salienceQuestion: "How would you keep the {slot} open?" },
    ],
  },
  {
    id: "topic-government-ask-for-interpreter",
    labelEn: "Asking For An Interpreter",
    labelVi: "Xin thông dịch viên",
    category: "government",
    scenarioDescription:
      "The learner asks a public office for a Vietnamese interpreter for an appointment, says when it is needed, and checks whether phone interpretation is acceptable.",
    aiRoleDefinition:
      "Act as a service officer who treats the interpreter request as routine, asks the language and timing, and offers phone or in-person options.",
    conversationDirections: [
      "Ask which language the learner needs.",
      "Ask when the interpreter is needed.",
      "Offer phone interpretation as an option.",
      "Reassure the learner that asking is normal.",
      "Confirm the interpreter is arranged.",
    ],
    warmthPatterns: [
      "Treat the request as completely normal, never a problem.",
      "Reassure the learner that language help protects important details.",
      "Encourage 'Could I have an interpreter?' over apologizing for English.",
    ],
    seedInputs: ["Could I have a Vietnamese interpreter for this appointment?"],
    detectionPatterns: [
      /\b(?:interpreter|translation help|vietnamese interpreter|language help|speak vietnamese|need help in vietnamese)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "government-interpreter-language-help-normal",
        label: "Language help is normal",
        note: "Some learners hesitate because asking for an interpreter feels embarrassing. In public services, asking is normal and protects important details.",
      },
      {
        id: "government-interpreter-have-not-need",
        label: "Could I have",
        note: "'Could I have a Vietnamese interpreter?' sounds calm and respectful. It is stronger than apologizing for English first.",
      },
      {
        id: "government-interpreter-free",
        label: "Often free",
        note: "Interpretation in public services is often free. Asking 'Is the interpreter free?' is reasonable and the answer is usually yes.",
      },
    ],
    followUps: [
      { id: "government-interpreter-language", question: "Which language would you ask for?", salienceQuestion: "How would you request help in {slot}?" },
      { id: "government-interpreter-timing", question: "When do you need the interpreter?", salienceQuestion: "When would you need the {slot}?" },
      { id: "government-interpreter-phone", question: "How would you ask if phone interpretation is okay?", salienceQuestion: "Could the {slot} happen by phone?" },
      { id: "government-interpreter-confirm", question: "How would you confirm the interpreter is booked?", salienceQuestion: "How would you confirm the {slot} is arranged?" },
      { id: "government-interpreter-free-q", question: "How would you ask if it costs anything?", salienceQuestion: "Is there a cost for the {slot}?" },
      { id: "government-interpreter-family", question: "How would you say if a family member can help instead?", salienceQuestion: "Who else could help with the {slot}?" },
    ],
  },
  {
    id: "topic-government-fill-out-form",
    labelEn: "Filling Out A Form",
    labelVi: "Điền đơn",
    category: "government",
    scenarioDescription:
      "The learner needs help understanding part of an application form, asks about a confusing section and the name fields, and where to sign before submitting.",
    aiRoleDefinition:
      "Act as a helpful officer who explains a form section in plain words, clarifies first/last name boxes, and points out where to sign.",
    conversationDirections: [
      "Ask which part of the form is unclear.",
      "Explain the confusing section in plain words.",
      "Clarify first-name and last-name boxes.",
      "Show where the signature goes.",
      "Offer to check the form before it is submitted.",
    ],
    warmthPatterns: [
      "Encourage pausing to ask before signing.",
      "Reassure the learner that clear forms beat fast forms.",
      "Encourage 'fill out the form' over 'fill form.'",
    ],
    seedInputs: ["Could you help me understand this part of the form?"],
    detectionPatterns: [
      /\b(?:fill out a form|fill in this form|application form|this part of the form|signature here|section of the form)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "government-form-fill-out",
        label: "Fill out the form",
        note: "Vietnamese learners often say 'fill form.' The everyday English phrase is 'fill out the form' or 'fill in this section.'",
      },
      {
        id: "government-form-ask-before-sign",
        label: "Ask before signing",
        note: "It is okay to pause and ask about a line before signing. Clear forms matter more than rushing.",
      },
      {
        id: "government-form-not-apply",
        label: "When a box does not apply",
        note: "If a box does not apply to you, ask 'Should I leave this blank?' Many forms accept 'N/A' for fields that do not fit.",
      },
    ],
    followUps: [
      { id: "government-form-section", question: "Which part of the form is unclear?", salienceQuestion: "How would you ask about this {slot}?" },
      { id: "government-form-name", question: "How would you ask about first name and last name?", salienceQuestion: "How would you fill the {slot} line?" },
      { id: "government-form-sign", question: "How would you ask where to sign?", salienceQuestion: "Where should you sign for the {slot}?" },
      { id: "government-form-review", question: "How would you ask someone to check the form?", salienceQuestion: "Who could check the {slot} before you submit it?" },
      { id: "government-form-blank", question: "How would you ask what to do with a box that does not apply?", salienceQuestion: "How would you handle a blank {slot}?" },
      { id: "government-form-copy", question: "How would you ask for a copy of the submitted form?", salienceQuestion: "How would you keep a record of the {slot}?" },
    ],
  },
  {
    id: "topic-government-pay-fee",
    labelEn: "Paying A Government Fee",
    labelVi: "Đóng lệ phí",
    category: "government",
    scenarioDescription:
      "The learner asks how much a government fee is and how to pay it, checks accepted payment methods and any waiver, and asks for a receipt.",
    aiRoleDefinition:
      "Act as a cashier officer who states the fee, lists payment methods, mentions any waiver, and provides a receipt.",
    conversationDirections: [
      "State the fee amount when asked.",
      "List the accepted payment methods.",
      "Mention whether a waiver or help exists.",
      "Practice the learner asking for a receipt.",
      "Confirm the payment is complete.",
    ],
    warmthPatterns: [
      "Keep money talk short and matter-of-fact.",
      "Reassure the learner that asking for a receipt is expected.",
      "Encourage the simple 'How much is the fee?' frame.",
    ],
    seedInputs: ["How much is the fee, and how can I pay it?"],
    detectionPatterns: [
      /\b(?:fee|application fee|renewal fee|pay the fee|service fee|payment method|receipt for the fee)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "government-fee-how-much",
        label: "Fee question",
        note: "A short question is enough: 'How much is the fee?' Vietnamese word order may make 'Fee how much?' feel natural in practice.",
      },
      {
        id: "government-fee-receipt",
        label: "Keep the receipt",
        note: "Government payments often need a receipt. Asking 'Could I get a receipt?' is normal and not demanding.",
      },
      {
        id: "government-fee-card-cash",
        label: "Card or cash",
        note: "Offices may take only certain payments. Asking 'Do you take card or only cash?' avoids being sent to a machine outside.",
      },
    ],
    followUps: [
      { id: "government-fee-amount", question: "How would you ask the amount of the fee?", salienceQuestion: "How much is the {slot}?" },
      { id: "government-fee-method", question: "How would you ask what payment methods they accept?", salienceQuestion: "How can you pay the {slot}?" },
      { id: "government-fee-waiver", question: "How would you ask if there is a waiver?", salienceQuestion: "Is there help with the {slot}?" },
      { id: "government-fee-receipt-q", question: "How would you ask for a receipt?", salienceQuestion: "How would you get proof of the {slot}?" },
      { id: "government-fee-cardcash", question: "How would you ask if they take card or cash?", salienceQuestion: "How would you pay the {slot}?" },
      { id: "government-fee-when", question: "How would you ask when the fee is due?", salienceQuestion: "When must you pay the {slot}?" },
    ],
  },
  {
    id: "topic-government-case-status",
    labelEn: "Checking Case Status",
    labelVi: "Hỏi tình trạng hồ sơ",
    category: "government",
    scenarioDescription:
      "The learner calls to check the status of an application, reads a reference number clearly, asks why it may be delayed, and what happens next.",
    aiRoleDefinition:
      "Act as a case officer who asks for the reference number, gives the current status, explains any delay, and states the next step.",
    conversationDirections: [
      "Ask the learner to read the reference number slowly.",
      "Give the current status of the application.",
      "Explain a possible reason for any delay.",
      "Practice the learner asking what happens next.",
      "Confirm any action the learner must take.",
    ],
    warmthPatterns: [
      "Keep it patient; reading numbers slowly is fine.",
      "Reassure the learner that accuracy beats speed on the phone.",
      "Encourage 'my application' or 'my case' over 'my profile.'",
    ],
    seedInputs: ["I am calling to check the status of my application."],
    detectionPatterns: [
      /\b(?:case status|application status|check the status|reference number|file number|case number|still processing)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "government-status-ho-so",
        label: "Application or case",
        note: "Vietnamese 'hồ sơ' can become 'my profile.' For offices, 'my application,' 'my file,' or 'my case' is usually clearer.",
      },
      {
        id: "government-status-number-ready",
        label: "Number ready",
        note: "Having the reference number ready makes the call easier. Saying it slowly is fine; accuracy matters more than speed.",
      },
      {
        id: "government-status-timeline",
        label: "Ask the timeline",
        note: "It is fine to ask 'How long does this usually take?' so you know whether to keep waiting or follow up later.",
      },
    ],
    followUps: [
      { id: "government-status-number", question: "What reference number would you give?", salienceQuestion: "How would you read the {slot} clearly?" },
      { id: "government-status-question", question: "How would you ask for the current status?", salienceQuestion: "What is the status of the {slot}?" },
      { id: "government-status-delay", question: "How would you ask why it is delayed?", salienceQuestion: "Why might the {slot} be delayed?" },
      { id: "government-status-next", question: "How would you ask what happens next?", salienceQuestion: "What is the next step for the {slot}?" },
      { id: "government-status-timeline-q", question: "How would you ask how long it usually takes?", salienceQuestion: "How long does the {slot} take?" },
      { id: "government-status-contact", question: "How would you ask who to contact for updates?", salienceQuestion: "Who handles updates on the {slot}?" },
    ],
  },
] as const satisfies readonly FinalThemeSpeakTopic[];
