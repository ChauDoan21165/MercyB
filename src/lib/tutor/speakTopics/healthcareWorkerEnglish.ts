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
] as const satisfies readonly D4ProfessionalSpeakTopic[];
