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
] as const satisfies readonly FinalThemeSpeakTopic[];
