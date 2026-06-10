import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D4ProfessionalSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

// Eye-care / optometrist customer English — a Vietnamese learner as the
// CUSTOMER at an optician or eye clinic (exam, prescription, frames, contacts,
// pickup). note-ids use "-note-" and followUp-ids use "-fu-" so the two id
// spaces stay disjoint per topic.
export const speakTopics = [
  {
    id: "topic-eye-care-eye-exam",
    labelEn: "Booking And Doing An Eye Exam",
    labelVi: "Đặt lịch và khám mắt",
    category: "eye-care-customer-english",
    scenarioDescription:
      "The learner books and goes through a routine eye exam, describing vision changes, eye strain, and when the problem started to a receptionist and an optometrist.",
    aiRoleDefinition:
      "Act as a friendly eye-clinic receptionist and then an optometrist who asks about symptoms, insurance, and history, and explains each step of the eye test calmly.",
    conversationDirections: [
      "Ask the learner to book an appointment and say whether it is a new exam or a yearly check.",
      "Practice describing the vision problem: blurry far away, blurry up close, headaches, or tired eyes.",
      "Prompt the learner to say when the symptom started and whether it is getting worse.",
      "Ask about screen time, driving, and reading so the learner explains daily eye use.",
      "Walk through the test steps and have the learner ask what each machine or chart is for.",
      "Confirm the learner can ask for the result in plain English at the end.",
    ],
    warmthPatterns: [
      "Open with a calm welcome: 'Let's start with a few questions about your eyes.'",
      "Reassure that 'blurry' and 'tired eyes' are exactly the right words to use here.",
      "Invite questions during the test: 'Tell me if anything is uncomfortable.'",
    ],
    seedInputs: ["I want to check my eyes because I see not clear far away."],
    detectionPatterns: [
      /\b(?:eye exam|optometrist|blurry|short[- ]?sighted|near[- ]?sighted|vision|eye strain|appointment|eye test|chart)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "eye-care-exam-note-blurry",
        label: "Blurry, not 'not clear'",
        note: "Người Việt hay dịch thẳng 'nhìn không rõ' thành 'see not clear'. Cách nói tự nhiên là 'My vision is blurry' hoặc 'I can't see clearly far away.' Dùng 'blurry' cho hình ảnh mờ.",
      },
      {
        id: "eye-care-exam-note-sight",
        label: "Near-sighted and far-sighted",
        note: "'Cận thị' là 'near-sighted' (nhìn gần rõ, xa mờ) và 'viễn thị' là 'far-sighted'. Tránh dịch 'mắt cận' thành 'eye close'. Nói 'I'm near-sighted, so far things look blurry.'",
      },
      {
        id: "eye-care-exam-note-strain",
        label: "Eye strain and tired eyes",
        note: "'Mỏi mắt' không phải 'tired eye' số ít hay 'my eye is tired'. Người bản xứ nói 'My eyes feel tired' hoặc 'I get eye strain from the screen.'",
      },
    ],
    followUps: [
      { id: "eye-care-exam-fu-reason", question: "Why are you coming in for an eye exam today?", salienceQuestion: "How would you explain the {slot} to the optometrist?" },
      { id: "eye-care-exam-fu-when", question: "When did the vision problem start?", salienceQuestion: "When did the {slot} begin?" },
      { id: "eye-care-exam-fu-daily", question: "How do you use your eyes during the day?", salienceQuestion: "How does the {slot} affect your daily eye use?" },
      { id: "eye-care-exam-fu-worse", question: "Is it getting better, worse, or staying the same?", salienceQuestion: "How is the {slot} changing over time?" },
      { id: "eye-care-exam-fu-result", question: "How would you ask for your result at the end?", salienceQuestion: "How would you ask about the {slot} result?" },
    ],
  },
  {
    id: "topic-eye-care-prescription",
    labelEn: "Understanding Your Prescription",
    labelVi: "Hiểu đơn kính của bạn",
    category: "eye-care-customer-english",
    scenarioDescription:
      "The learner asks the optometrist to explain the prescription numbers, what each eye needs, and whether it changed since last time.",
    aiRoleDefinition:
      "Act as an optometrist who explains the prescription in simple terms, compares it to the previous one, and answers questions about strength and astigmatism without heavy jargon.",
    conversationDirections: [
      "Ask the learner to request a plain-English explanation of the prescription numbers.",
      "Practice asking whether the left and right eye are different.",
      "Prompt the learner to ask if the prescription got stronger or weaker than last year.",
      "Have the learner ask whether they need glasses all the time or only for reading or driving.",
      "Practice asking about astigmatism in everyday words rather than translating literally.",
      "Confirm the learner can ask for a printed or emailed copy of the prescription.",
    ],
    warmthPatterns: [
      "Normalize the question: 'It's smart to ask what these numbers mean.'",
      "Compare gently: 'Your eyes changed a little since last year — that's common.'",
      "Offer a copy without being asked: 'I'll print this so you can keep it.'",
    ],
    seedInputs: ["My eyes number go up or down compared last year?"],
    detectionPatterns: [
      /\b(?:prescription|astigmatism|stronger|weaker|left eye|right eye|reading glasses|distance|diopter)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "eye-care-rx-note-number",
        label: "Prescription, not 'eye number'",
        note: "'Số kính / độ cận' thường bị dịch thành 'eye number'. Từ đúng là 'prescription' hoặc 'my prescription is minus two.' Hỏi 'Did my prescription get stronger?' thay vì 'My number go up?'",
      },
      {
        id: "eye-care-rx-note-stronger",
        label: "Stronger and weaker eyes",
        note: "'Tăng độ' nói tự nhiên là 'my prescription got stronger', còn 'giảm độ' là 'weaker'. Tránh 'my eye is heavier'. Có thể nói 'My right eye needs a stronger lens than my left.'",
      },
    ],
    followUps: [
      { id: "eye-care-rx-fu-explain", question: "How would you ask the optometrist to explain the numbers?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "eye-care-rx-fu-eyes", question: "How do you ask if each eye is different?", salienceQuestion: "How would you compare the {slot} for each eye?" },
      { id: "eye-care-rx-fu-change", question: "How do you ask if it changed since last year?", salienceQuestion: "How did the {slot} change?" },
      { id: "eye-care-rx-fu-when", question: "How do you ask when you need to wear the glasses?", salienceQuestion: "When do you need glasses for the {slot}?" },
      { id: "eye-care-rx-fu-copy", question: "How would you ask for a copy of the prescription?", salienceQuestion: "How would you request the {slot} in writing?" },
    ],
  },
  {
    id: "topic-eye-care-choosing-glasses",
    labelEn: "Choosing Glasses Frames",
    labelVi: "Chọn gọng kính",
    category: "eye-care-customer-english",
    scenarioDescription:
      "The learner chooses frames at the optician, asking about shape, price, lens options, and what suits their face and budget.",
    aiRoleDefinition:
      "Act as a helpful optician who suggests frame shapes, explains lens add-ons like anti-glare, gives prices, and checks the fit on the learner's face.",
    conversationDirections: [
      "Ask the learner to say what frame style or color they like.",
      "Practice asking which frames suit their face shape.",
      "Prompt the learner to ask about price and whether insurance covers part of it.",
      "Have the learner ask about lens options: anti-glare, blue-light, thin lenses.",
      "Practice asking to try the frames on and to check if they feel tight or loose.",
      "Confirm the learner can ask how long the glasses will take to make.",
    ],
    warmthPatterns: [
      "Encourage choice: 'Try a few — there's no rush.'",
      "Be honest and kind about fit: 'These sit nicely on you.'",
      "Make price easy to ask about: 'I can show you a few at different prices.'",
    ],
    seedInputs: ["I want a glasses not too expensive and fit my face."],
    detectionPatterns: [
      /\b(?:frames?|lenses?|anti[- ]?glare|blue[- ]?light|try on|fit|face shape|budget|insurance|price)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "eye-care-frames-note-glasses",
        label: "A pair of glasses",
        note: "'Một cái kính' thường thành 'a glasses'. Tiếng Anh nói 'a pair of glasses' hoặc 'these glasses'. 'I'm looking for a new pair of glasses' nghe tự nhiên hơn 'I find a glasses.'",
      },
      {
        id: "eye-care-frames-note-fit",
        label: "Fit, suit, and match",
        note: "'Hợp mặt' không phải 'fit my face' khi nói về kiểu dáng — 'fit' là vừa vặn về kích thước, còn 'suit' là hợp phong cách. Nói 'Do these frames suit me?' và 'Do they fit okay?'",
      },
    ],
    followUps: [
      { id: "eye-care-frames-fu-style", question: "What frame style or color do you like?", salienceQuestion: "How would you describe the {slot} you want?" },
      { id: "eye-care-frames-fu-suit", question: "How do you ask which frames suit you?", salienceQuestion: "How would you ask if the {slot} suits your face?" },
      { id: "eye-care-frames-fu-price", question: "How do you ask about the price and insurance?", salienceQuestion: "How would you ask about the {slot} cost?" },
      { id: "eye-care-frames-fu-lens", question: "How do you ask about lens options?", salienceQuestion: "How would you ask about the {slot} for the lenses?" },
      { id: "eye-care-frames-fu-time", question: "How do you ask when they will be ready?", salienceQuestion: "How would you ask when the {slot} will be done?" },
    ],
  },
  {
    id: "topic-eye-care-contact-lenses",
    labelEn: "Asking About Contact Lenses",
    labelVi: "Hỏi về kính áp tròng",
    category: "eye-care-customer-english",
    scenarioDescription:
      "The learner asks about switching to or trying contact lenses, including comfort, daily vs monthly, cleaning, and a trial fitting.",
    aiRoleDefinition:
      "Act as an optometrist who explains contact-lens types, teaches safe wearing and cleaning, and checks comfort during a trial fitting.",
    conversationDirections: [
      "Ask the learner why they want to try contact lenses instead of glasses.",
      "Practice asking the difference between daily and monthly lenses.",
      "Prompt the learner to ask how to put them in and take them out safely.",
      "Have the learner ask how to clean and store monthly lenses.",
      "Practice describing comfort during the trial: dry, scratchy, or fine.",
      "Confirm the learner can ask when to stop wearing them and call the clinic.",
    ],
    warmthPatterns: [
      "Reduce worry: 'It feels strange at first, and that's normal.'",
      "Go step by step: 'We'll practice putting one in together.'",
      "Invite honest feedback: 'Tell me exactly how it feels.'",
    ],
    seedInputs: ["I want try contact lens but I scare to touch my eye."],
    detectionPatterns: [
      /\b(?:contact lenses?|daily|monthly|comfort|dry eyes?|cleaning|solution|trial|fitting|put in|take out)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "eye-care-contacts-note-scared",
        label: "I'm scared, not 'I scare'",
        note: "'Tôi sợ chạm vào mắt' hay thành 'I scare to touch my eye'. Đúng là 'I'm scared to touch my eye' hoặc 'I'm nervous about it.' 'Scared' là tính từ, cần 'am/is/are'.",
      },
      {
        id: "eye-care-contacts-note-wear",
        label: "Wear, put in, and take out",
        note: "'Đeo kính áp tròng' là 'wear contact lenses'; động tác là 'put them in' và 'take them out', không phải 'open/close my eye lens'. Nói 'How long can I wear them each day?'",
      },
    ],
    followUps: [
      { id: "eye-care-contacts-fu-why", question: "Why do you want to try contact lenses?", salienceQuestion: "How would you explain the {slot}?" },
      { id: "eye-care-contacts-fu-type", question: "How do you ask about daily vs monthly lenses?", salienceQuestion: "How would you compare the {slot} options?" },
      { id: "eye-care-contacts-fu-use", question: "How do you ask to put them in and take them out?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "eye-care-contacts-fu-clean", question: "How do you ask about cleaning and storing them?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "eye-care-contacts-fu-comfort", question: "How would you describe how they feel?", salienceQuestion: "How would you describe the {slot}?" },
    ],
  },
  {
    id: "topic-eye-care-pickup-problems",
    labelEn: "Picking Up Glasses And Fixing Problems",
    labelVi: "Nhận kính và xử lý sự cố",
    category: "eye-care-customer-english",
    scenarioDescription:
      "The learner picks up finished glasses and reports a problem: they feel tight, slide down, hurt the nose, or the vision still feels off.",
    aiRoleDefinition:
      "Act as an optician handing over the glasses who checks the fit, adjusts the frames, and troubleshoots when the customer says something feels wrong.",
    conversationDirections: [
      "Ask the learner to confirm the glasses are theirs and try them on.",
      "Practice describing a fit problem: too tight, sliding down, pinching the nose.",
      "Prompt the learner to say if the vision feels off or makes them dizzy.",
      "Have the learner ask for an adjustment or a re-check.",
      "Practice asking about the warranty if the lens scratches or breaks.",
      "Confirm the learner can ask how to clean and care for the lenses.",
    ],
    warmthPatterns: [
      "Welcome feedback: 'Tell me right away if anything feels off.'",
      "Fix it calmly: 'I can adjust these in a minute.'",
      "Reassure on new glasses: 'A little dizziness at first is normal.'",
    ],
    seedInputs: ["The glasses make me dizzy and it press my nose."],
    detectionPatterns: [
      /\b(?:pick up|adjust|too tight|slide down|nose|dizzy|warranty|scratch|re[- ]?check|fit|uncomfortable)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "eye-care-pickup-note-press",
        label: "It presses, not 'it press'",
        note: "'Kính ép vào mũi' hay thành 'it press my nose'. Cần chia động từ: 'They press on my nose' hoặc 'They feel too tight on my nose.' Kính số nhiều nên dùng 'they/them'.",
      },
      {
        id: "eye-care-pickup-note-dizzy",
        label: "Dizzy and off",
        note: "'Chóng mặt' là 'dizzy', không phải 'turn around head'. Khi nhìn chưa quen, nói 'These make me feel a bit dizzy' hoặc 'My vision feels off.'",
      },
    ],
    followUps: [
      { id: "eye-care-pickup-fu-tryon", question: "How would you check the glasses when you pick them up?", salienceQuestion: "How would you check the {slot}?" },
      { id: "eye-care-pickup-fu-fit", question: "How do you describe a fit problem?", salienceQuestion: "How would you describe the {slot}?" },
      { id: "eye-care-pickup-fu-vision", question: "How do you say the vision feels off?", salienceQuestion: "How would you describe the {slot}?" },
      { id: "eye-care-pickup-fu-adjust", question: "How do you ask for an adjustment or re-check?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "eye-care-pickup-fu-warranty", question: "How do you ask about the warranty?", salienceQuestion: "How would you ask about the {slot}?" },
    ],
  },
] satisfies readonly D4ProfessionalSpeakTopic[];
