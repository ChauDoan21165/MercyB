import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D3SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics: D3SpeakTopic[] = [
  {
    id: "topic-pharmacy-prescription-pickup",
    labelEn: "Picking Up A Prescription",
    labelVi: "Lấy thuốc theo đơn",
    category: "pharmacy",
    scenarioDescription:
      "The learner visits a pharmacy to pick up a prescription, verify the medication name, ask how to take it, and understand the cost and any insurance co-pay.",
    aiRoleDefinition:
      "Act as a pharmacy technician at the counter who asks for the patient's name and date of birth, confirms the prescription is ready, explains the directions and co-pay, and offers the pharmacist consultation.",
    conversationDirections: [
      "Ask the learner to give their name and date of birth to verify the prescription.",
      "Confirm the medication name, dose, and quantity with the learner.",
      "Practice asking how to take the medication — 'with food or without?', 'how many times a day?'",
      "Practice asking about the cost and whether insurance is applied.",
      "Practice asking what to do if a dose is missed or a side effect appears.",
      "End by confirming the label instructions and whether a pharmacist consultation is needed.",
    ],
    warmthPatterns: [
      "Use clear, unhurried language for medical instructions: 'Let me read you the directions.'",
      "Invite questions: 'Do you have any questions about how to take this?'",
      "Reassure around cost: 'Your insurance covers most of it — you only pay the co-pay.'",
    ],
    seedInputs: [
      "I'm here to pick up my prescription.",
      "Is my prescription ready?",
      "How do I take this medication?",
    ],
    detectionPatterns: [
      /\b(?:pick up (?:my |a )?prescription|prescription (?:ready|pickup)|refill (?:my |a )?prescription|collect (?:my )?medication|pharmacy|pharmacist|co-?pay|my medicine is ready)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "pharmacy-rx-article",
        label: "\"A prescription\" vs \"my prescription\"",
        note: "Vietnamese has no articles, so learners often say 'I come pick prescription' or 'prescription ready?' The full, natural phrase is 'I'm here to pick up my prescription' — possessive 'my' plus the verb group 'pick up' together.",
      },
      {
        id: "pharmacy-rx-directions",
        label: "How to ask the dosage direction",
        note: "'Uống mấy viên một ngày?' (how many pills a day?) becomes 'How much I take?' in English. The natural counter phrase is 'How many tablets should I take, and how often?' — this gets the full direction in one question.",
      },
      {
        id: "pharmacy-rx-copay",
        label: "Co-pay / insurance",
        note: "'Co-pay' (= khoản đồng chi trả bảo hiểm) is common in US/Australian pharmacies. If insurance doesn't cover it fully, the technician says 'Your co-pay is $X.' Learners may confuse 'co-pay' with 'full price' — asking 'Is this after insurance?' clarifies it.",
      },
      {
        id: "pharmacy-rx-side-effects",
        label: "Side effects",
        note: "'Tác dụng phụ' = side effects. The question 'What are the side effects?' is natural. A follow-up 'Should I stop taking it if I feel dizzy?' models the conditional that Vietnamese learners tend to drop ('I feel dizzy, stop?' instead of 'If I feel dizzy, should I stop?').",
      },
      {
        id: "pharmacy-rx-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Xin chào, tôi đến lấy thuốc theo đơn của tôi.' ↔ EN: 'Hi, I'm here to pick up my prescription.' The possessive 'my' and the phrasal verb 'pick up' are both load-bearing; dropping either sounds incomplete.",
      },
    ],
    followUps: [
      { id: "pharmacy-rx-name-fu", question: "How would you give your name and date of birth to verify the prescription?", salienceQuestion: "How would you verify your {slot} at the counter?" },
      { id: "pharmacy-rx-directions-fu", question: "How would you ask how many times a day you should take the medication?", salienceQuestion: "How would you ask the dosage for your {slot}?" },
      { id: "pharmacy-rx-food-fu", question: "How would you ask whether to take the medication with or without food?", salienceQuestion: "What food rule applies to the {slot}?" },
      { id: "pharmacy-rx-cost-fu", question: "How would you ask what the total cost is after insurance?", salienceQuestion: "How would you check the cost of the {slot}?" },
      { id: "pharmacy-rx-missed-fu", question: "How would you ask what to do if you miss a dose?", salienceQuestion: "What is the rule for a missed {slot}?" },
    ],
  },
  {
    id: "topic-pharmacy-otc-recommendation",
    labelEn: "Asking For An OTC Recommendation",
    labelVi: "Hỏi dược sĩ về thuốc không cần đơn",
    category: "pharmacy",
    scenarioDescription:
      "The learner describes symptoms to a pharmacist and asks which over-the-counter medication to choose, how to compare options, and whether anything interacts with a prescription they already take.",
    aiRoleDefinition:
      "Act as a pharmacist who asks about symptoms, allergies, and any current medications, recommends an appropriate OTC product, and explains the dosage and what to watch for.",
    conversationDirections: [
      "Ask the learner to describe their symptoms clearly — headache, cough, cold, allergy, or upset stomach.",
      "Ask about any known allergies or current prescription medications.",
      "Guide the learner to ask between two options: 'What's the difference between these two?'",
      "Practice reading the label — dosage, how often, and age restrictions.",
      "Explain what to do if the medication doesn't work or symptoms worsen.",
      "Confirm whether the product is safe to take with any other medication the learner mentioned.",
    ],
    warmthPatterns: [
      "Keep medical language accessible: 'This one is gentler on the stomach.'",
      "Flag drug interactions clearly without alarming: 'Just to be safe, let's check that with your other medication.'",
      "Offer to show the label: 'Let me point out the dosage right here.'",
    ],
    seedInputs: [
      "I have a bad headache. What can I take?",
      "Which cold medicine do you recommend?",
      "Is this safe to take with my blood pressure medication?",
    ],
    detectionPatterns: [
      /\b(?:over[- ]the[- ]counter|OTC|recommend(?:ation)?|which (?:medicine|medication|product)|headache (?:medicine|tablet|pill)|cold (?:medicine|remedy)|allergy (?:medicine|pill)|cough (?:syrup|medicine)|upset stomach|drug interaction|safe to take with)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "pharmacy-otc-symptoms",
        label: "Describing symptoms",
        note: "Vietnamese describes pain with a body part first: 'Đầu tôi đau' (head of me aches). In English the subject is the person: 'I have a headache' or 'My head is pounding.' Saying 'My head very pain' is a direct transfer; the natural phrase is 'My head is throbbing' or 'I have a bad headache.'",
      },
      {
        id: "pharmacy-otc-compare",
        label: "Comparing two products",
        note: "'Cái này và cái kia khác nhau gì?' (what is different between this and that?) maps to 'What's the difference between these two?' In pharmacies, learners can also say 'Which one is stronger?' or 'Which one is gentler on the stomach?' — these are the real comparison questions pharmacists expect.",
      },
      {
        id: "pharmacy-otc-allergy",
        label: "Reporting an allergy",
        note: "'Tôi dị ứng với penicillin' → 'I'm allergic to penicillin' (not 'I have allergy with penicillin'). The structure is 'I'm allergic to [substance].' Pharmacists hear this exact phrase and act on it immediately.",
      },
      {
        id: "pharmacy-otc-interaction",
        label: "Drug interaction question",
        note: "'Is this safe to take with my blood pressure medication?' is the full, clear question. Vietnamese learners may say 'I already take medicine, can take this also?' — swapping 'also' with the full phrasing prevents the pharmacist needing a follow-up question.",
      },
      {
        id: "pharmacy-otc-label",
        label: "Reading the label",
        note: "Key label vocabulary: 'take [N] tablets every [X] hours', 'do not exceed [N] doses in 24 hours', 'take with food'. 'Không quá' (do not exceed) maps exactly to 'do not exceed'; 'uống kèm ăn' maps to 'take with food.' Reading these out loud at the counter is the best way to confirm understanding.",
      },
    ],
    followUps: [
      { id: "pharmacy-otc-symptoms-fu", question: "How would you describe your symptoms to the pharmacist?", salienceQuestion: "How would you explain your {slot} symptom?" },
      { id: "pharmacy-otc-compare-fu", question: "How would you ask what the difference is between two products?", salienceQuestion: "How would you compare the two {slot} options?" },
      { id: "pharmacy-otc-allergy-fu", question: "How would you tell the pharmacist about an allergy you have?", salienceQuestion: "How would you report your {slot} allergy?" },
      { id: "pharmacy-otc-interaction-fu", question: "How would you ask whether the new medication is safe to take with something you already take?", salienceQuestion: "How would you check the {slot} interaction?" },
      { id: "pharmacy-otc-label-fu", question: "How would you ask the pharmacist to explain the dosage on the label?", salienceQuestion: "How would you clarify the {slot} dosage?" },
    ],
  },
  {
    id: "topic-pharmacy-refill-request",
    labelEn: "Requesting A Prescription Refill",
    labelVi: "Yêu cầu tái cấp phát thuốc",
    category: "pharmacy",
    scenarioDescription:
      "The learner calls or visits the pharmacy to request a refill on a long-term prescription, confirm how many refills remain, and ask about timing if it's too early to fill.",
    aiRoleDefinition:
      "Act as a pharmacy technician who looks up the patient's prescription record, confirms how many refills remain, explains the earliest fill date if it's too early, and offers to contact the doctor for an authorization if needed.",
    conversationDirections: [
      "Ask the learner to identify the medication name and strength they need refilled.",
      "Practice saying the prescription number from the bottle label.",
      "Explain what 'too early to fill' means and ask when the earliest fill date is.",
      "Practice asking for an emergency supply if the medication is running low.",
      "Guide the learner to ask the pharmacy to contact their doctor for a renewal.",
      "Confirm the pickup time and whether notification will be sent by text or phone.",
    ],
    warmthPatterns: [
      "Explain 'too early' without blame: 'Insurance won't cover it until the 28th — that's just their rule.'",
      "Offer solutions clearly: 'We can contact your doctor to authorize the refill.'",
      "Confirm the timeline: 'It should be ready in about two hours.'",
    ],
    seedInputs: [
      "I need to refill my prescription.",
      "How many refills do I have left?",
      "Can you contact my doctor for a refill?",
    ],
    detectionPatterns: [
      /\b(?:refill|re-fill|prescription (?:refill|renewal|number)|how many refills|too early to fill|renew (?:my )?prescription|contact (?:my )?doctor for|authorization|running out of (?:my )?medication)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "pharmacy-refill-verb",
        label: "\"Refill\" vs \"re-take\" or \"re-buy\"",
        note: "'Tái cấp phát' or 'mua lại thuốc' becomes 'refill' in pharmacy English — not 're-buy' or 'get more.' The single word 'refill' is what the system recognizes. 'I need to refill my prescription' or 'Can I get a refill?' are both natural.",
      },
      {
        id: "pharmacy-refill-number",
        label: "Prescription number",
        note: "The prescription number is on the bottle label — 'Rx number' or 'Rx #'. Saying 'My Rx number is 1234567' speeds up the lookup. Vietnamese learners may not know to look for it; it is the small number printed near the pharmacy name.",
      },
      {
        id: "pharmacy-refill-early",
        label: "Too early to fill",
        note: "'Too early to fill' means insurance will only pay once the current supply should be running low. The pharmacy will say 'It's too early — your next fill date is [date].' The response 'When is the earliest I can fill it?' gets the exact date without a longer exchange.",
      },
      {
        id: "pharmacy-refill-doctor",
        label: "Asking the pharmacy to call the doctor",
        note: "'Can you contact my doctor for a refill?' is the phrase that triggers the pharmacy to send a fax or message to the prescriber. Vietnamese learners may say 'Please call doctor for me' — adding 'for a refill authorization' makes the request specific and actionable.",
      },
    ],
    followUps: [
      { id: "pharmacy-refill-name-fu", question: "How would you tell the pharmacy which medication you need refilled?", salienceQuestion: "How would you identify the {slot} for refill?" },
      { id: "pharmacy-refill-number-fu", question: "How would you give the prescription number from your bottle?", salienceQuestion: "How would you share the {slot} number?" },
      { id: "pharmacy-refill-early-fu", question: "How would you ask when the earliest fill date is if it's too early now?", salienceQuestion: "How would you ask for the earliest {slot} date?" },
      { id: "pharmacy-refill-doctor-fu", question: "How would you ask the pharmacy to contact your doctor for a renewal?", salienceQuestion: "How would you request a {slot} authorization?" },
      { id: "pharmacy-refill-notify-fu", question: "How would you ask to be notified by text when the prescription is ready?", salienceQuestion: "How would you set up a {slot} notification?" },
    ],
  },
  {
    id: "topic-pharmacy-payment-insurance",
    labelEn: "Paying And Using Insurance",
    labelVi: "Thanh toán và sử dụng bảo hiểm tại nhà thuốc",
    category: "pharmacy",
    scenarioDescription:
      "The learner pays for medication at the pharmacy counter, uses a prescription insurance card, asks why a medication is not covered, and requests a receipt for reimbursement.",
    aiRoleDefinition:
      "Act as a pharmacy cashier who processes insurance, explains coverage gaps, offers to apply discount cards like GoodRx if insurance doesn't cover the item, and prints a receipt for reimbursement.",
    conversationDirections: [
      "Ask the learner to present their insurance card or enter the member ID.",
      "Practice asking 'Is this covered by my insurance?' when the price seems high.",
      "Practice asking why a specific brand is not covered and whether a generic is available.",
      "Practice asking for a receipt for insurance reimbursement or FSA/HSA payment.",
      "Guide the learner to ask about discount programs like GoodRx if insurance won't cover it.",
      "Confirm the total and the payment method accepted.",
    ],
    warmthPatterns: [
      "Explain coverage gaps without judgment: 'Brand names often aren't covered — the generic is exactly the same medication.'",
      "Proactively offer savings: 'Let me check if a discount card brings the price down.'",
      "Make the receipt request easy: 'I'll print a detailed receipt for you — just say the word.'",
    ],
    seedInputs: [
      "Here is my insurance card.",
      "Why is this medication not covered?",
      "Can I get a receipt for reimbursement?",
    ],
    detectionPatterns: [
      /\b(?:insurance card|member ID|covered by (?:my )?insurance|not covered|generic (?:version|option|available)|GoodRx|discount (?:card|program)|FSA|HSA|reimbursement|receipt for insurance|co-?pay)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "pharmacy-pay-insurance-card",
        label: "Presenting the insurance card",
        note: "'Đây là thẻ bảo hiểm của tôi' → 'Here is my insurance card.' In North America the card is called a 'prescription benefit card' or simply 'insurance card.' Learners can also say 'I have insurance — let me find the card' to buy a moment while searching.",
      },
      {
        id: "pharmacy-pay-generic",
        label: "Brand vs generic",
        note: "Thuốc generic (thuốc gốc) has the same active ingredient as the brand name at a lower price. 'Do you have a generic for this?' is the question that can save $20–$80. The pharmacist may say 'The generic is bioequivalent' — this means it works the same way.",
      },
      {
        id: "pharmacy-pay-not-covered",
        label: "Asking why it's not covered",
        note: "'Why isn't this covered?' is a natural question. The pharmacy may say 'It's a tier-3 drug' or 'Your plan requires prior authorization.' If the price is too high, 'Is there a discount card I can use instead?' (GoodRx etc.) is the practical follow-up.",
      },
      {
        id: "pharmacy-pay-receipt",
        label: "Receipt for reimbursement",
        note: "'Phiếu thu' = receipt. For FSA/HSA or employer reimbursement, 'Can I get an itemized receipt?' specifies the detailed version insurers require. 'Itemized' means each item listed separately — this is the key word.",
      },
    ],
    followUps: [
      { id: "pharmacy-pay-card-fu", question: "How would you offer your insurance card at the counter?", salienceQuestion: "How would you present your {slot} card?" },
      { id: "pharmacy-pay-covered-fu", question: "How would you ask whether a medication is covered by your insurance?", salienceQuestion: "How would you check if your {slot} is covered?" },
      { id: "pharmacy-pay-generic-fu", question: "How would you ask if there is a cheaper generic version available?", salienceQuestion: "How would you ask for a generic {slot}?" },
      { id: "pharmacy-pay-discount-fu", question: "How would you ask about a discount program if insurance doesn't cover it?", salienceQuestion: "How would you find a discount for the {slot}?" },
      { id: "pharmacy-pay-receipt-fu", question: "How would you ask for an itemized receipt for reimbursement?", salienceQuestion: "How would you request the {slot} receipt?" },
    ],
  },
  {
    id: "topic-pharmacy-side-effects-concern",
    labelEn: "Reporting A Side Effect Or Concern",
    labelVi: "Báo cáo tác dụng phụ hoặc lo ngại về thuốc",
    category: "pharmacy",
    scenarioDescription:
      "The learner calls or visits the pharmacy to report an unexpected side effect, ask whether to stop the medication, and find out whether to call a doctor or go to urgent care.",
    aiRoleDefinition:
      "Act as a pharmacist who listens to the side effect description, assesses urgency, advises whether to stop, reduce, or continue the medication, and tells the learner when to seek immediate care.",
    conversationDirections: [
      "Ask the learner to describe the symptom clearly — rash, dizziness, nausea, trouble breathing.",
      "Ask when the symptom started relative to starting the medication.",
      "Guide the learner to ask: 'Is this a normal side effect or should I be worried?'",
      "Practice asking whether to stop the medication immediately or finish the course.",
      "Ask what to tell the doctor at the next visit about this reaction.",
      "Explain when to call 911 or go to the emergency room versus waiting to see the doctor.",
    ],
    warmthPatterns: [
      "Stay calm and grounding: 'Let's go through what you're feeling step by step.'",
      "Be direct about urgency: 'If you have trouble breathing, call 911 right away — don't wait.'",
      "Empower the learner: 'You were right to call — it's always better to check.'",
    ],
    seedInputs: [
      "I think I'm having a side effect from this medication.",
      "I feel dizzy after taking my new medicine.",
      "Should I stop taking it?",
    ],
    detectionPatterns: [
      /\b(?:side effect|adverse (?:reaction|effect)|allergic reaction|rash|dizziness|nausea|trouble breathing|after taking (?:my )?(?:medicine|medication|pill)|should I stop taking|reaction to (?:my )?medication|call (?:the )?doctor|emergency room|urgent care)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "pharmacy-se-describe",
        label: "Describing the symptom clearly",
        note: "Vietnamese describes pain by location and intensity: 'Chóng mặt, nôn nao.' In English the pharmacist needs a time reference too: 'I started feeling dizzy about an hour after taking the pill — it's been going on for two hours.' The timeline helps the pharmacist decide urgency.",
      },
      {
        id: "pharmacy-se-stop",
        label: "Asking whether to stop the medication",
        note: "'Should I stop taking it?' is the direct question. Vietnamese learners may say 'I can stop medicine?' — adding 'should' turns it into a request for medical advice rather than a permission question. If the pharmacist says 'Do not stop abruptly,' the key follow-up is 'How do I taper off safely?'",
      },
      {
        id: "pharmacy-se-emergency",
        label: "Knowing when to call 911",
        note: "Emergency signals the pharmacist will name: 'trouble breathing, swelling of the face or throat, severe chest pain.' Vietnamese learners may use 'tức ngực' (chest tightness) which translates as 'tightness in my chest' or 'chest pressure' — not quite 'chest pain,' so it's worth describing both: 'pressure and tightness in my chest.'",
      },
      {
        id: "pharmacy-se-course",
        label: "Finishing the course vs stopping",
        note: "For antibiotics especially, stopping early risks resistance. 'Should I finish the full course even if I feel better?' is the question. The pharmacist's answer — 'Yes, always finish antibiotics unless I tell you to stop' — is worth repeating back to confirm.",
      },
    ],
    followUps: [
      { id: "pharmacy-se-describe-fu", question: "How would you describe a side effect you are experiencing to the pharmacist?", salienceQuestion: "How would you describe the {slot} symptom?" },
      { id: "pharmacy-se-timing-fu", question: "How would you explain when the symptom started relative to taking the medication?", salienceQuestion: "How would you give the timeline of your {slot}?" },
      { id: "pharmacy-se-stop-fu", question: "How would you ask whether you should stop taking the medication?", salienceQuestion: "How would you ask about stopping the {slot}?" },
      { id: "pharmacy-se-doctor-fu", question: "How would you ask what to tell your doctor at the next appointment?", salienceQuestion: "What should you report about the {slot} at your appointment?" },
      { id: "pharmacy-se-emergency-fu", question: "How would you ask when a side effect is serious enough to go to the emergency room?", salienceQuestion: "How would you gauge the urgency of the {slot}?" },
    ],
  },
] as const;
