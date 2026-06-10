import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Dentist / dental-appointment theme. The real situations a Vietnamese newcomer
// handles at the dentist: booking, check-in, describing pain, understanding the
// treatment plan, the cleaning visit, cost and insurance, and aftercare.
// Deterministic / client-side; copy is warm, adult, low-shame, and strictly
// about COMMUNICATION, never dental advice. l1InterferenceNotes quote the
// Vietnamese source phrase with full diacritics and name the everyday English
// match — friendly context, NEVER a grammar correction.
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-dentist-booking-appointment",
    labelEn: "Booking A Dental Appointment",
    labelVi: "Đặt lịch hẹn nha khoa",
    category: "dentist",
    seedInputs: [
      "I'd like to book a dental check-up for next week.",
      "Hi, I need to make an appointment with the dentist.",
      "Do you have anything available this Saturday?",
    ],
    detectionPatterns: [
      /\b(?:book a (?:dental|dentist)|make a dental|dental check-?up|dentist appointment|schedule a (?:cleaning|dental)|tooth (?:check|exam)|first visit to the dentist)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "dentist-booking-nha-si",
        label: "\"Bác sĩ nha\" or \"nha sĩ\"",
        note: "Vietnamese says 'nha sĩ' or 'bác sĩ nha khoa.' In English the person is simply 'the dentist.' 'I'd like to see the dentist' is all you need — no long title required at the front desk.",
      },
      {
        id: "dentist-booking-dat-lich",
        label: "\"Đặt lịch\" said word for word",
        note: "'Đặt lịch hẹn' becomes 'set a schedule' or 'register.' The warm everyday phrase is 'book an appointment' or 'make an appointment.' Both mean the same thing; 'book' is the one you'll hear most at dental offices.",
      },
      {
        id: "dentist-booking-new-patient",
        label: "New patient paperwork",
        note: "Many dental offices ask 'Are you a new patient?' Answering 'Yes, this is my first visit' and asking 'Do I need to fill out any forms?' gets you ready before you arrive.",
      },
    ],
    followUps: [
      { id: "dentist-booking-reason", question: "What would you say the appointment is for?", salienceQuestion: "How would you explain the reason for the {slot}?" },
      { id: "dentist-booking-time", question: "What day or time works best for you?", salienceQuestion: "When would you ask to schedule the {slot}?" },
      { id: "dentist-booking-new-patient-fu", question: "How would you say if this is your first visit?", salienceQuestion: "How would you mention you are new for the {slot}?" },
      { id: "dentist-booking-confirm", question: "How would you confirm the date and time before hanging up?", salienceQuestion: "How would you confirm the {slot} details?" },
      { id: "dentist-booking-insurance", question: "How would you ask if the office accepts your insurance?", salienceQuestion: "How would you check the {slot} cost before coming?" },
    ],
  },
  {
    id: "topic-dentist-checking-in",
    labelEn: "Checking In At The Dental Office",
    labelVi: "Làm thủ tục tại phòng khám nha khoa",
    category: "dentist",
    seedInputs: [
      "I have a 10 o'clock appointment with Dr. Nguyen.",
      "Hi, I'm checking in for my cleaning today.",
      "I have an appointment — my name is Linh.",
    ],
    detectionPatterns: [
      /\b(?:checking in|check in for my|here for my (?:dental|cleaning|appointment)|have an appointment (?:with|at)|front desk|fill out forms?|sign in)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "dentist-checkin-dang-ky",
        label: "\"Đăng ký\" as \"register\"",
        note: "'Đăng ký' pushes learners toward 'I want to register.' At a dental front desk the natural phrase is 'I'm checking in for my appointment.' Both are understood; checking in is the phrase you'll hear every time.",
      },
      {
        id: "dentist-checkin-name-order",
        label: "Family name first",
        note: "Vietnamese names lead with the family name. Staff may ask for 'first name' and 'last name' separately. For 'Nguyễn Thị Lan,' last name is 'Nguyễn' and first name is 'Lan' — a quick rehearsal removes a stuck moment at the desk.",
      },
      {
        id: "dentist-checkin-forms",
        label: "New patient forms",
        note: "First-time patients usually fill out forms about their medical history and insurance. 'Do I need to fill out any forms?' shows you're ready and gives the receptionist a clear cue.",
      },
    ],
    followUps: [
      { id: "dentist-checkin-name", question: "How would you give your name at the desk?", salienceQuestion: "How would you say your {slot} clearly?" },
      { id: "dentist-checkin-who", question: "Which dentist are you there to see?", salienceQuestion: "How would you say whose {slot} you are for?" },
      { id: "dentist-checkin-time", question: "How would you say what time your appointment is?", salienceQuestion: "How would you state the {slot} time?" },
      { id: "dentist-checkin-insurance", question: "How would you offer your insurance card?", salienceQuestion: "How would you present the {slot} card?" },
      { id: "dentist-checkin-wait", question: "How would you ask where to sit while you wait?", salienceQuestion: "How would you ask where to wait for the {slot}?" },
    ],
  },
  {
    id: "topic-dentist-describing-pain",
    labelEn: "Describing Tooth Pain Or A Problem",
    labelVi: "Mô tả cơn đau răng hoặc vấn đề",
    category: "dentist",
    seedInputs: [
      "I have a sharp pain in my back tooth when I eat.",
      "One of my teeth is sensitive to cold things.",
      "I think I might have a cavity.",
    ],
    detectionPatterns: [
      /\b(?:tooth (?:pain|ache|hurts?|sensitive)|cavity|cracked tooth|sharp pain|aching|gum is swollen|sensitive to (?:cold|hot|sweet)|my (?:tooth|teeth) hurts?)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "dentist-pain-dau-rang",
        label: "\"Đau răng\" placed like \"I am pain tooth\"",
        note: "'Đau răng' makes learners say 'I am pain tooth' or 'my tooth is pain.' Natural English is 'My tooth hurts' or 'I have a toothache.' Welcome the location and the feeling first; the phrasing can follow.",
      },
      {
        id: "dentist-pain-nhay-cam",
        label: "\"Nhạy cảm\" as \"sensitive\"",
        note: "'Răng nhạy cảm' maps directly to 'sensitive tooth.' You can simply say 'This tooth is sensitive to cold' — the dentist will understand exactly what you mean.",
      },
      {
        id: "dentist-pain-sau-rang",
        label: "Which tooth to point out",
        note: "You don't need to know the dental names. 'It hurts here' while pointing, or 'the back tooth on the left' is enough. 'Cái này' (this one) plus a gesture works fine and dentists see it every day.",
      },
    ],
    followUps: [
      { id: "dentist-pain-where", question: "Which tooth or area hurts?", salienceQuestion: "How would you point out the {slot} that hurts?" },
      { id: "dentist-pain-kind", question: "Is it sharp, dull, or sensitive?", salienceQuestion: "How would you describe the {slot} feeling?" },
      { id: "dentist-pain-when", question: "When does it hurt — eating, drinking cold, or all the time?", salienceQuestion: "When does the {slot} bother you most?" },
      { id: "dentist-pain-since", question: "How long has it been bothering you?", salienceQuestion: "How long has the {slot} been going on?" },
      { id: "dentist-pain-worse", question: "Is it getting worse?", salienceQuestion: "Is the {slot} getting worse over time?" },
      { id: "dentist-pain-cavity", question: "How would you say you think there might be a cavity?", salienceQuestion: "How would you mention the {slot} concern?" },
    ],
  },
  {
    id: "topic-dentist-understanding-treatment",
    labelEn: "Understanding The Treatment Plan",
    labelVi: "Hiểu kế hoạch điều trị",
    category: "dentist",
    seedInputs: [
      "What exactly do I need done today?",
      "Can you explain what a filling is?",
      "Will it hurt? Do I need a shot?",
    ],
    detectionPatterns: [
      /\b(?:filling|root canal|crown|extraction|tooth pulled|what (?:do|will) (?:you|I)|will it hurt|need a shot|numb|anaesthetic|x-ray|treatment plan|what exactly)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "dentist-treatment-tram-rang",
        label: "\"Trám răng\" is a filling",
        note: "'Trám răng' means 'filling' in English. When the dentist says 'you need a filling,' that's the same procedure: they clean the cavity and fill it with a material to protect the tooth.",
      },
      {
        id: "dentist-treatment-nho-rang",
        label: "\"Nhổ răng\" is an extraction",
        note: "'Nhổ răng' (pull the tooth) is called an 'extraction' in English. If you hear 'we may need to extract that tooth,' it means the same thing. Asking 'Is there any way to save it?' is always okay.",
      },
      {
        id: "dentist-treatment-will-it-hurt",
        label: "Asking about pain before treatment",
        note: "It's completely normal to ask 'Will this hurt?' or 'Will I feel anything?' The dentist will explain what to expect and can offer a numbing injection ('local anaesthetic'). 'Sẽ đau không?' maps right onto these.",
      },
    ],
    followUps: [
      { id: "dentist-treatment-what", question: "How would you ask what you need done?", salienceQuestion: "How would you ask about the {slot} you need?" },
      { id: "dentist-treatment-hurt", question: "How would you ask if the treatment will hurt?", salienceQuestion: "How would you ask about pain for the {slot}?" },
      { id: "dentist-treatment-long", question: "How would you ask how long it will take?", salienceQuestion: "How long will the {slot} take?" },
      { id: "dentist-treatment-options", question: "How would you ask if there are other options?", salienceQuestion: "Are there other choices for the {slot}?" },
      { id: "dentist-treatment-cost", question: "How would you ask how much the procedure costs?", salienceQuestion: "How would you ask the cost of the {slot}?" },
    ],
  },
  {
    id: "topic-dentist-cleaning",
    labelEn: "At A Teeth Cleaning",
    labelVi: "Lấy cao răng và vệ sinh răng",
    category: "dentist",
    seedInputs: [
      "I'm here for my regular teeth cleaning.",
      "It's been a while since my last cleaning.",
      "Is the cleaning going to be uncomfortable?",
    ],
    detectionPatterns: [
      /\b(?:teeth cleaning|dental cleaning|cleaning appointment|tartar|plaque|scaling|polish|flossing|it'?s been a while|last cleaning|check-up and clean)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "dentist-cleaning-lay-cao",
        label: "\"Lấy cao răng\" is scaling and cleaning",
        note: "'Lấy cao răng' is 'teeth cleaning' or 'scale and polish.' The hygienist removes 'tartar' (hard build-up) and 'plaque' (soft build-up). You don't need the clinical words; 'cleaning' covers it.",
      },
      {
        id: "dentist-cleaning-uncomfortable",
        label: "Cleaning can feel uncomfortable",
        note: "Some spots feel sensitive during cleaning. Saying 'That spot is a bit uncomfortable' is fine — the hygienist will adjust. You won't seem demanding; feedback helps them.",
      },
      {
        id: "dentist-cleaning-how-often",
        label: "Every six months is normal",
        note: "The dentist will ask when you last had a cleaning. 'About two years ago' or 'I'm not sure — it's been a while' are honest and common answers. 'Lâu rồi chưa khám' maps to 'it's been a while.'",
      },
    ],
    followUps: [
      { id: "dentist-cleaning-last", question: "How would you say when you last had a cleaning?", salienceQuestion: "How would you say when the last {slot} was?" },
      { id: "dentist-cleaning-discomfort", question: "How would you tell them if a spot is uncomfortable?", salienceQuestion: "How would you mention discomfort during the {slot}?" },
      { id: "dentist-cleaning-xray", question: "How would you ask if X-rays are needed?", salienceQuestion: "How would you ask about {slot} extras like X-rays?" },
      { id: "dentist-cleaning-howoften", question: "How would you ask how often you should come back?", salienceQuestion: "How often should you book the {slot}?" },
      { id: "dentist-cleaning-brush", question: "How would you ask for brushing or flossing tips?", salienceQuestion: "How would you ask for {slot} home-care advice?" },
    ],
  },
  {
    id: "topic-dentist-cost-insurance",
    labelEn: "Asking About Cost And Insurance",
    labelVi: "Hỏi về chi phí và bảo hiểm",
    category: "dentist",
    seedInputs: [
      "Does this office accept Delta Dental insurance?",
      "How much will the filling cost with my insurance?",
      "I don't have dental insurance — how much is a cleaning?",
    ],
    detectionPatterns: [
      /\b(?:dental insurance|does (?:my|this) insurance cover|how much (?:will|does)|co-?pay|out of pocket|payment plan|accept (?:my )?insurance|without insurance|insurance card)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "dentist-insurance-bao-hiem",
        label: "\"Bảo hiểm\" and what it covers",
        note: "'Bảo hiểm' is 'insurance.' Dental insurance often covers 100% for cleanings but only part of fillings. Asking 'What does my insurance cover?' or 'What is my share?' finds the answer before you're surprised at checkout.",
      },
      {
        id: "dentist-insurance-copay",
        label: "\"Co-pay\" is your share",
        note: "A 'co-pay' is the amount you pay at the visit; the insurance pays the rest. 'Phần tôi phải trả là bao nhiêu?' maps to 'What is my co-pay?' or 'What is my out-of-pocket amount?'",
      },
      {
        id: "dentist-insurance-payment-plan",
        label: "Payment plan if you can't pay all at once",
        note: "If a bill is large, asking 'Do you offer a payment plan?' is normal. Many dental offices say yes. 'Tôi có thể trả từng phần được không?' is the same idea.",
      },
    ],
    followUps: [
      { id: "dentist-insurance-accepts", question: "How would you ask if they accept your insurance?", salienceQuestion: "How would you ask about the {slot} coverage?" },
      { id: "dentist-insurance-cover", question: "How would you ask what your insurance covers?", salienceQuestion: "How would you ask what the {slot} pays for?" },
      { id: "dentist-insurance-total", question: "How would you ask the total cost before agreeing to treatment?", salienceQuestion: "How would you ask the {slot} total up front?" },
      { id: "dentist-insurance-plan", question: "How would you ask about a payment plan?", salienceQuestion: "How would you ask about paying the {slot} in parts?" },
      { id: "dentist-insurance-no-coverage", question: "How would you ask the cost if you have no insurance?", salienceQuestion: "How much is the {slot} without coverage?" },
    ],
  },
  {
    id: "topic-dentist-aftercare",
    labelEn: "Following Aftercare Instructions",
    labelVi: "Thực hiện hướng dẫn chăm sóc sau điều trị",
    category: "dentist",
    seedInputs: [
      "What can I eat after the filling?",
      "How long will my mouth feel numb?",
      "When should I come back if something feels wrong?",
    ],
    detectionPatterns: [
      /\b(?:after (?:the|my) (?:filling|extraction|treatment|procedure)|what can I eat|how long (?:will|does) it (?:feel|last)|mouth is numb|bite down|come back if|avoid (?:hard|hot|cold) food|follow-up)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "dentist-aftercare-numb",
        label: "\"Tê\" is numb",
        note: "'Tê' (numb) maps to 'numb' in English. After an injection, 'My mouth is still numb' is the natural phrase. The numbness usually fades in one to three hours — no need to wait to leave the office.",
      },
      {
        id: "dentist-aftercare-soft-foods",
        label: "Soft foods after treatment",
        note: "Dentists often say 'stick to soft foods today.' 'Thức ăn mềm' is 'soft food.' Asking 'What can I eat after this?' gives you a clear list: yogurt, soup, scrambled eggs — nothing hard or sticky.",
      },
      {
        id: "dentist-aftercare-when-to-call",
        label: "When to call back",
        note: "If pain continues or gets worse after a couple of days, calling back is smart. 'Gọi lại nếu đau hơn' maps to 'Call us if the pain gets worse.' The office would rather you call than wait.",
      },
    ],
    followUps: [
      { id: "dentist-aftercare-eat", question: "How would you ask what you can eat after treatment?", salienceQuestion: "How would you ask about food after the {slot}?" },
      { id: "dentist-aftercare-numb-fu", question: "How would you ask how long the numbness will last?", salienceQuestion: "How long will the {slot} numbness stay?" },
      { id: "dentist-aftercare-pain", question: "How would you ask what to do if there's pain later?", salienceQuestion: "How would you ask about pain after the {slot}?" },
      { id: "dentist-aftercare-follow-up", question: "How would you ask when to come back for a follow-up?", salienceQuestion: "When should you return after the {slot}?" },
      { id: "dentist-aftercare-brush", question: "How would you ask when it's safe to brush again?", salienceQuestion: "When can you brush after the {slot}?" },
    ],
  },
] as const;
