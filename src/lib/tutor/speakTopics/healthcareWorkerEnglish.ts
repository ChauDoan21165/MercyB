import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D4ProfessionalSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-healthcare-worker-patient-explanation",
    labelEn: "Explaining Care To A Patient",
    labelVi: "Giải thích chăm sóc cho bệnh nhân",
    category: "healthcare-worker-english",
    scenarioDescription:
      "The learner is a healthcare worker explaining a routine check, medication step, procedure preparation, or follow-up instruction to an English-speaking patient.",
    aiRoleDefinition:
      "Act as a patient who needs clear, calm instructions, asks simple safety questions, and may be nervous about pain, timing, or what will happen next.",
    conversationDirections: [
      "Ask the learner to explain what they are about to do before touching or moving the patient.",
      "Practice checking name, date of birth, allergies, pain level, and consent in plain English.",
      "Prompt the learner to explain a procedure step by step without overusing medical jargon.",
      "Ask what the patient should feel, report, or avoid after the procedure.",
      "Practice clarifying medication timing, dose, side effects, and when to call for help.",
      "Practice pausing to ask for consent and check comfort before continuing a step.",
      "Confirm the patient understands when and who to call if a symptom gets worse at home.",
      "End by asking the patient to repeat the key instruction back in their own words.",
    ],
    warmthPatterns: [
      "Use calm permission language: 'I'm going to explain each step first.'",
      "Pair professional confidence with patient choice and consent.",
      "Normalize patient questions before procedures or medication changes.",
    ],
    seedInputs: ["I am going to check your blood pressure and explain the next step."],
    detectionPatterns: [
      /\b(?:blood pressure|vital signs|procedure|medication|dose|side effects|allergies|pain level|date of birth|consent)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "healthcare-worker-explain-procedure-pronouns",
        label: "You, we, and I in patient instructions",
        note: "Vietnamese often lets context carry the subject, so English instructions may sound abrupt: 'Check blood pressure now.' A patient-facing frame like 'I'm going to check your blood pressure now' makes the action clear and respectful.",
      },
      {
        id: "healthcare-worker-explain-dose",
        label: "Dose, dosage, and take",
        note: "Professional words can blur together. 'Dose' is the amount, 'dosage' is the planned amount and schedule, and patients 'take' medicine. Practice 'Take one tablet twice a day' instead of translating from 'uống thuốc' word by word.",
      },
      {
        id: "healthcare-worker-explain-consent",
        label: "Asking permission, not announcing",
        note: "Vietnamese instructions may state the action directly out of efficiency. With patients, 'Is it okay if I check your arm now?' adds the consent that English-speaking patients expect before being touched.",
      },
    ],
    followUps: [
      { id: "healthcare-worker-explain-step", question: "What care step are you explaining to the patient?", salienceQuestion: "How would you explain the {slot} before you begin?" },
      { id: "healthcare-worker-explain-safety", question: "What safety question should you ask first?", salienceQuestion: "What safety detail matters for the {slot}?" },
      { id: "healthcare-worker-explain-feel", question: "How would you tell the patient what they may feel?", salienceQuestion: "What might the patient feel during the {slot}?" },
      { id: "healthcare-worker-explain-after", question: "What should the patient do afterward?", salienceQuestion: "What should happen after the {slot}?" },
      { id: "healthcare-worker-explain-teachback", question: "How would you ask the patient to repeat the instruction back?", salienceQuestion: "How would you confirm they understood the {slot}?" },
      { id: "healthcare-worker-explain-consent-q", question: "How would you ask the patient's permission before a step?", salienceQuestion: "How would you ask consent for the {slot}?" },
    ],
  },
  {
    id: "topic-healthcare-worker-doctor-handoff",
    labelEn: "Giving A Handoff To A Doctor",
    labelVi: "Bàn giao thông tin cho bác sĩ",
    category: "healthcare-worker-english",
    scenarioDescription:
      "The learner gives a concise clinical handoff to a doctor, nurse, or supervisor about a patient's current condition, recent change, and urgent concern.",
    aiRoleDefinition:
      "Act as a busy doctor who needs an organized handoff with the patient identity, situation, background, assessment, and requested next action.",
    conversationDirections: [
      "Ask for the patient's name, age, room number, and main concern first.",
      "Prompt the learner to state what changed and when it changed.",
      "Practice reporting vital signs, symptoms, pain score, medication, allergies, and relevant history.",
      "Ask the learner to separate observed facts from their concern or assessment.",
      "Practice a clear request: review the patient, place an order, call family, or advise next steps.",
      "Practice asking the doctor to confirm or repeat an order you did not fully hear.",
      "Confirm the priority level so the team knows how urgent the concern is.",
      "End by confirming what the doctor wants done and by what time.",
    ],
    warmthPatterns: [
      "Keep the tone concise, respectful, and steady under pressure.",
      "Support the learner in asking for clarification when orders are unclear.",
      "Model teamwork language: 'I wanted to update you because...'",
    ],
    seedInputs: ["Doctor, I need to give you a handoff about room 204."],
    detectionPatterns: [
      /\b(?:handoff|doctor|room \d+|vital signs|blood pressure|heart rate|oxygen|assessment|order|patient is getting worse)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "healthcare-worker-handoff-sbar",
        label: "Situation first, story later",
        note: "Vietnamese storytelling can begin with background to show care and respect. In a clinical handoff, English teams often need the urgent situation first: 'I'm concerned because her oxygen level dropped.'",
      },
      {
        id: "healthcare-worker-handoff-terms",
        label: "Vital signs pronunciation pressure",
        note: "Terms like 'oxygen saturation,' 'respiratory rate,' and 'blood pressure' are high-stakes and easy to rush. It is professional to slow down, say numbers clearly, and repeat them if asked.",
      },
      {
        id: "healthcare-worker-handoff-confirm-order",
        label: "Reading the order back",
        note: "Out of respect, learners may avoid questioning a doctor. In English clinical teams, reading an order back — 'So that's 10 milligrams now, correct?' — is expected safety practice, not doubt.",
      },
    ],
    followUps: [
      { id: "healthcare-worker-handoff-identity", question: "How would you identify the patient first?", salienceQuestion: "How would you identify the {slot} clearly?" },
      { id: "healthcare-worker-handoff-change", question: "What changed in the patient's condition?", salienceQuestion: "What changed about the {slot}?" },
      { id: "healthcare-worker-handoff-vitals", question: "Which vital signs or symptoms would you report?", salienceQuestion: "Which numbers matter for the {slot}?" },
      { id: "healthcare-worker-handoff-concern", question: "How would you state your concern professionally?", salienceQuestion: "What concern do you have about the {slot}?" },
      { id: "healthcare-worker-handoff-request", question: "What action do you need from the doctor?", salienceQuestion: "What do you need next for the {slot}?" },
      { id: "healthcare-worker-handoff-readback", question: "How would you read the doctor's order back to confirm it?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-healthcare-worker-medical-terms",
    labelEn: "Using Medical Terms Clearly",
    labelVi: "Dùng thuật ngữ y tế rõ ràng",
    category: "healthcare-worker-english",
    scenarioDescription:
      "The learner practices saying difficult medical terms, spelling them when needed, and switching between professional terms and plain patient-friendly explanations.",
    aiRoleDefinition:
      "Act as a patient, coworker, or supervisor who asks the learner to clarify medical terms, pronounce a word again, or explain the same idea in plain language.",
    conversationDirections: [
      "Ask the learner to say a medical term, then explain it in everyday English.",
      "Practice terms Vietnamese speakers may find hard to pronounce, including allergy, nausea, sterile, procedure, discharge, prescription, and referral.",
      "Prompt spelling or slow repetition for names of medications, clinics, and body systems.",
      "Ask the learner to avoid guessing when a term is unclear and request confirmation instead.",
      "Practice distinguishing similar words such as breath and breathe, dose and dosage, infection and inflammation.",
      "Practice politely asking a coworker to slow down or repeat a term you did not catch.",
      "Confirm a medication or clinic name by spelling it out loud when there is any doubt.",
      "End by converting one technical instruction into a short patient-friendly sentence.",
    ],
    warmthPatterns: [
      "Treat pronunciation repeats as normal professional safety, not embarrassment.",
      "Use plain English after technical terms so patients can act on instructions.",
      "Encourage confirmation phrases: 'Let me make sure I heard that correctly.'",
    ],
    seedInputs: ["I need to explain the prescription and the referral clearly."],
    detectionPatterns: [
      /\b(?:prescription|referral|discharge|sterile|nausea|allergy|procedure|infection|inflammation|breathe|breath)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "healthcare-worker-terms-final-sounds",
        label: "Final sounds in safety words",
        note: "Vietnamese final consonants are shorter than English ones, so 'dose,' 'pulse,' and 'breath' can be hard for listeners to distinguish. Slow final sounds matter because these words carry clinical meaning.",
      },
      {
        id: "healthcare-worker-terms-plain-english",
        label: "Technical term plus plain meaning",
        note: "Vietnamese medical explanations may rely on shared context or translated specialist words. In English care settings, the safest pattern is term plus meaning: 'You are being discharged, which means you can go home today.'",
      },
      {
        id: "healthcare-worker-terms-ask-repeat",
        label: "Asking for a repeat is safe practice",
        note: "Learners may worry that asking again sounds unprofessional. In English care settings, 'Could you say that medication name once more?' is safer than guessing a high-stakes word.",
      },
    ],
    followUps: [
      { id: "healthcare-worker-terms-word", question: "Which medical word do you want to practice?", salienceQuestion: "How would you say the {slot} slowly?" },
      { id: "healthcare-worker-terms-plain", question: "How would you explain that word in plain English?", salienceQuestion: "How would you explain the {slot} to a patient?" },
      { id: "healthcare-worker-terms-confirm", question: "How would you ask someone to repeat or confirm the term?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "healthcare-worker-terms-similar", question: "What similar word could cause confusion?", salienceQuestion: "What could be confused with the {slot}?" },
      { id: "healthcare-worker-terms-instruction", question: "How would you use the term in a patient instruction?", salienceQuestion: "How would the patient act on the {slot}?" },
      { id: "healthcare-worker-terms-spell", question: "How would you spell a medication or clinic name to confirm it?", salienceQuestion: "How would you spell the {slot}?" },
    ],
  },
  {
    id: "topic-healthcare-worker-patient-intake",
    labelEn: "Patient Intake Questions",
    labelVi: "Hỏi thông tin ban đầu của bệnh nhân",
    category: "healthcare-worker-english",
    scenarioDescription:
      "The learner checks in a patient, gathers basic symptoms, confirms identity, asks about medications and allergies, and prepares the patient for the doctor.",
    aiRoleDefinition:
      "Act as a patient who may be worried, unclear, or in pain, while allowing the healthcare worker to guide the intake with calm professional questions.",
    conversationDirections: [
      "Open by explaining that you need to ask a few intake questions.",
      "Confirm the patient's name and date of birth before clinical details.",
      "Ask what brought the patient in today and when it started.",
      "Ask about allergies, medications, and relevant medical history.",
      "Use plain language when the patient does not understand a term.",
      "Close by explaining what will happen next.",
    ],
    warmthPatterns: [
      "Use calm permission frames like 'I need to ask...' and 'Is it okay if...?'",
      "Keep safety questions direct without sounding rushed.",
      "Reassure with next-step language instead of vague comfort.",
    ],
    seedInputs: ["I need to ask you a few questions before the doctor comes in."],
    detectionPatterns: [
      /\b(?:patient intake|medical history|symptoms|allergies|medications|date of birth|insurance card|before the doctor)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hcw-intake-dob",
        label: "Date of birth, not just age",
        note: "Vietnamese staff may ask age first because it feels natural. In clinics, 'Can you confirm your date of birth?' is a standard safety check and sounds professional, not cold.",
      },
      {
        id: "hcw-intake-allergic-to",
        label: "Allergic to medication",
        note: "'Dị ứng thuốc' often comes out as 'you allergy medicine?' The clear clinical frame is 'Are you allergic to any medications?' Warm tone matters, but the safety word 'allergic' should be direct.",
      },
    ],
    followUps: [
      { id: "hcw-intake-open", question: "How would you explain that you need to ask intake questions?", salienceQuestion: "How would you start the {slot} kindly?" },
      { id: "hcw-intake-id", question: "How would you confirm the patient's name and date of birth?", salienceQuestion: "How would you confirm the {slot} safely?" },
      { id: "hcw-intake-symptoms", question: "How would you ask what brought them in today?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "hcw-intake-meds", question: "How would you ask about allergies and medications?", salienceQuestion: "How would you ask about the {slot} clearly?" },
      { id: "hcw-intake-close", question: "How would you tell them what happens next?", salienceQuestion: "How would you close the {slot} with reassurance?" },
    ],
  },
  {
    id: "topic-healthcare-worker-explaining-procedure",
    labelEn: "Explaining A Simple Procedure",
    labelVi: "Giải thích một thủ thuật đơn giản",
    category: "healthcare-worker-english",
    scenarioDescription:
      "The learner explains a routine check or procedure such as blood pressure, temperature, swab, injection, or blood draw before performing it.",
    aiRoleDefinition:
      "Act as a patient who wants to know what will happen, how long it takes, whether it hurts, and what they should do during the procedure.",
    conversationDirections: [
      "Name the procedure or check before starting.",
      "Ask permission or signal what you are about to do.",
      "Explain the steps in simple order.",
      "Describe what the patient may feel using words like pinch, pressure, or sting.",
      "Tell the patient what to do with their arm, body, or breathing.",
      "End by saying it is finished and what happens next.",
    ],
    warmthPatterns: [
      "Announce touch before touching the patient.",
      "Use short, steady sentences for nervous patients.",
      "Balance honesty about discomfort with reassuring next steps.",
    ],
    seedInputs: ["I am going to check your blood pressure now."],
    detectionPatterns: [
      /\b(?:blood pressure|temperature|pulse|vital signs|swab|injection|draw blood|procedure|check your)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hcw-procedure-going-to",
        label: "Say what you will do before touching",
        note: "In Vietnamese clinics, action plus gesture may be enough. In English care settings, 'I'm going to...' before touching a patient builds consent and trust.",
      },
      {
        id: "hcw-procedure-small-pain",
        label: "Sting, pinch, pressure",
        note: "Words like 'sting,' 'pinch,' and 'pressure' are hard because Vietnamese may use broader 'đau.' These small words help patients know what to expect without alarming them.",
      },
    ],
    followUps: [
      { id: "hcw-procedure-name", question: "What procedure or check are you explaining?", salienceQuestion: "How would you name the {slot}?" },
      { id: "hcw-procedure-consent", question: "How would you ask or signal permission first?", salienceQuestion: "How would you ask before the {slot}?" },
      { id: "hcw-procedure-steps", question: "How would you explain the next two steps?", salienceQuestion: "What happens during the {slot}?" },
      { id: "hcw-procedure-feel", question: "How would you describe what the patient may feel?", salienceQuestion: "What might the {slot} feel like?" },
      { id: "hcw-procedure-after", question: "How would you tell them it is finished?", salienceQuestion: "How would you finish the {slot} warmly?" },
    ],
  },
  {
    id: "topic-healthcare-worker-family-update",
    labelEn: "Updating A Family Member",
    labelVi: "Cập nhật cho người nhà bệnh nhân",
    category: "healthcare-worker-english",
    scenarioDescription:
      "The learner updates a family member in a waiting room or hallway while staying calm, accurate, and respectful of privacy rules.",
    aiRoleDefinition:
      "Act as a concerned family member who wants a status update, timing, and reassurance but may ask for information the worker cannot share.",
    conversationDirections: [
      "Give a calm status update using careful words like stable when appropriate.",
      "Explain who will provide more detailed medical information.",
      "Give a practical wait time or next step if known.",
      "Handle privacy limits with a respectful boundary.",
      "Acknowledge the family's worry without promising outcomes.",
      "Close with where to wait or who will come next.",
    ],
    warmthPatterns: [
      "Use careful reassurance without overpromising.",
      "Set privacy boundaries in a respectful tone.",
      "Recognize worry with short human phrases.",
    ],
    seedInputs: ["Your mother is stable, and the doctor will speak with you soon."],
    detectionPatterns: [
      /\b(?:family update|your mother|your father|stable|doctor will speak|waiting room|condition|visiting hours)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hcw-family-stable",
        label: "Stable is a careful word",
        note: "Vietnamese family updates may use comforting words quickly. In English healthcare, 'stable' is useful because it reassures without promising too much.",
      },
      {
        id: "hcw-family-privacy",
        label: "Privacy limits",
        note: "Family-centered Vietnamese culture can expect broad sharing. A warm boundary is 'I can ask the nurse what information we can share' so privacy rules stay respectful.",
      },
    ],
    followUps: [
      { id: "hcw-family-status", question: "How would you give a calm status update?", salienceQuestion: "How would you explain the {slot} calmly?" },
      { id: "hcw-family-wait", question: "How would you explain the wait?", salienceQuestion: "How long might the {slot} take?" },
      { id: "hcw-family-doctor", question: "How would you say the doctor will speak with them?", salienceQuestion: "Who will explain the {slot}?" },
      { id: "hcw-family-boundary", question: "How would you handle a privacy question?", salienceQuestion: "How would you protect the {slot}?" },
      { id: "hcw-family-comfort", question: "What warm sentence could you add?", salienceQuestion: "How would you show care about the {slot}?" },
    ],
  },
  {
    id: "topic-healthcare-worker-call-light-safety",
    labelEn: "Patient Safety And Call Light",
    labelVi: "An toàn bệnh nhân và nút gọi hỗ trợ",
    category: "healthcare-worker-english",
    scenarioDescription:
      "The learner explains fall prevention, call light use, walker or wheelchair support, and safety instructions to a patient in a room.",
    aiRoleDefinition:
      "Act as a patient who may feel independent, confused, or impatient, and needs the worker to explain safety instructions clearly and kindly.",
    conversationDirections: [
      "Show the patient where the call light or call bell is.",
      "Explain when to press it and what help they can ask for.",
      "Ask the patient to call before getting out of bed.",
      "Explain the safety reason without blaming the patient.",
      "Mention walker, wheelchair, socks, or bed alarm if relevant.",
      "Confirm the patient understands the plan.",
    ],
    warmthPatterns: [
      "Make safety sound caring, not controlling.",
      "Use visible gestures with simple English.",
      "Ask for confirmation in a low-pressure way.",
    ],
    seedInputs: ["Please press the call light before you get out of bed."],
    detectionPatterns: [
      /\b(?:call light|call bell|fall risk|get out of bed|walker|wheelchair|nonslip socks|safety)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "hcw-safety-call-light",
        label: "Call light / call bell",
        note: "There may be no familiar Vietnamese equivalent for 'call light.' Showing the button and saying 'Press this if you need help' makes the English practical right away.",
      },
      {
        id: "hcw-safety-before",
        label: "Before you get up",
        note: "Patients may hear the instruction as optional politeness. 'Please call us before you get up' is warm, clear, and safety-focused without sounding angry.",
      },
    ],
    followUps: [
      { id: "hcw-safety-show", question: "How would you show the patient the call light?", salienceQuestion: "How would you explain the {slot}?" },
      { id: "hcw-safety-reason", question: "How would you explain why it matters?", salienceQuestion: "Why is the {slot} important?" },
      { id: "hcw-safety-before-q", question: "How would you ask them to call before getting up?", salienceQuestion: "What should happen before the {slot}?" },
      { id: "hcw-safety-repeat", question: "How would you ask them to repeat the plan?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "hcw-safety-warm", question: "How would you make it sound caring, not bossy?", salienceQuestion: "How would you soften the {slot}?" },
    ],
  },
] as const satisfies readonly D4ProfessionalSpeakTopic[];
