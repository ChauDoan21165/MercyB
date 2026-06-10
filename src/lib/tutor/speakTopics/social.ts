import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type FinalThemeSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-social-small-talk-neighbors",
    labelEn: "Small Talk With Neighbors",
    labelVi: "Nói chuyện xã giao với hàng xóm",
    category: "social",
    scenarioDescription:
      "The learner makes light conversation with a neighbor, asks simple questions, responds politely, and ends the chat naturally.",
    aiRoleDefinition:
      "Act as a friendly neighbor who keeps the conversation casual, asks simple follow-up questions, and gives the learner chances to practice warm replies.",
    conversationDirections: [
      "Start with a short greeting and one everyday topic.",
      "Ask about weather, weekend plans, building news, family, or local errands.",
      "Prompt the learner to answer with one extra detail, not just yes or no.",
      "Practice asking a polite question back.",
      "Practice ending the conversation kindly when the learner needs to leave.",
      "Keep topics safe, ordinary, and not too personal.",
    ],
    warmthPatterns: [
      "Use relaxed neighborly language without forced intimacy.",
      "Model short, reusable small-talk phrases.",
      "Make polite exits feel normal.",
    ],
    seedInputs: [
      "I want to make small talk with my neighbor.",
      "Nice weather today, isn't it?",
      "Have you lived in the building long?",
    ],
    detectionPatterns: [
      /\b(?:small talk|neighbor|neighbour|say hello|weekend plans|nice weather|chat with my neighbor|building neighbor)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "social-neighbor-question-back",
        label: "Ask a question back",
        note: "Vietnamese learners may answer only the question. In English small talk, a short answer plus 'How about you?' keeps the conversation warm.",
      },
      {
        id: "social-neighbor-exit",
        label: "Polite exit",
        note: "A natural exit is 'It was nice talking to you. I have to go now.' This is softer than ending suddenly.",
      },
      {
        id: "social-neighbor-not-too-personal",
        label: "Keep it light",
        note: "English neighbor small talk often stays light at first. Weather, building news, or weekend plans are safer than money, age, or private family questions.",
      },
      {
        id: "social-neighbor-vocab",
        label: "Vocabulary",
        note: "small talk = nói chuyện xã giao; How about you? = còn bạn thì sao?; weekend plans = kế hoạch cuối tuần. A tag like 'isn't it?' invites a friendly reply.",
      },
      {
        id: "social-neighbor-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Dạo này anh/chị khỏe không ạ?' ↔ EN: 'How have you been lately?' A warm, light opener is enough to start.",
      },
    ],
    followUps: [
      { id: "social-neighbor-greeting", question: "How would you greet your neighbor?", salienceQuestion: "What would you say first about the {slot}?" },
      { id: "social-neighbor-topic", question: "What safe topic would you mention?", salienceQuestion: "What could you say about the {slot}?" },
      { id: "social-neighbor-detail", question: "What extra detail could you add?", salienceQuestion: "What detail makes the {slot} warmer?" },
      { id: "social-neighbor-ask-back", question: "How would you ask a question back?", salienceQuestion: "What question would you ask about the {slot}?" },
      { id: "social-neighbor-exit", question: "How would you end the conversation politely?", salienceQuestion: "How would you finish talking about the {slot}?" },
      { id: "social-neighbor-boundary", question: "What topic would you avoid because it feels too personal?", salienceQuestion: "What should stay private in the {slot}?" },
    ],
  },
  {
    id: "topic-social-inviting-friend",
    labelEn: "Inviting A Friend",
    labelVi: "Mời bạn đi chơi",
    category: "social",
    scenarioDescription:
      "The learner invites a friend to meet, suggests time and place, handles yes/no/maybe answers, and confirms the plan politely.",
    aiRoleDefinition:
      "Act as a friend who responds naturally to invitations and asks follow-up questions about activity, time, place, and whether other people are joining.",
    conversationDirections: [
      "Ask what the learner wants to invite the friend to do.",
      "Practice suggesting a specific day, time, and place.",
      "Give yes, maybe, and unavailable responses so the learner can adapt.",
      "Practice offering another time without pressure.",
      "Ask whether the learner should bring anything or invite anyone else.",
      "End by confirming the plan in one friendly message.",
    ],
    warmthPatterns: [
      "Keep invitation language friendly and low pressure.",
      "Model casual but clear planning phrases.",
      "Treat a no or maybe as normal social communication.",
    ],
    seedInputs: [
      "I want to invite my friend for coffee this weekend.",
      "Are you free this Saturday for coffee?",
      "Want to grab lunch sometime this week?",
    ],
    detectionPatterns: [
      /\b(?:invite my friend|meet for coffee|hang out|come with me|weekend plan|are you free|let's meet|see a movie)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "social-invite-free",
        label: "Are you free?",
        note: "'Bạn có rảnh không?' maps well to 'Are you free?' Add a time: 'Are you free on Saturday afternoon?'",
      },
      {
        id: "social-invite-no-pressure",
        label: "No pressure",
        note: "English invitations often soften the request with 'if you are free' or 'no pressure' to sound friendly.",
      },
      {
        id: "social-invite-sounds-good",
        label: "Sounds good",
        note: "When someone accepts, 'Sounds good!' or 'That works for me' is a natural short response before confirming time and place.",
      },
      {
        id: "social-invite-vocab",
        label: "Vocabulary",
        note: "Are you free? = bạn có rảnh không?; hang out = đi chơi, đi cà phê; sounds good = nghe hay đấy; no pressure = không sao nếu bận.",
      },
      {
        id: "social-invite-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Cuối tuần này đi cà phê không?' ↔ EN: 'Want to get coffee this weekend?' English keeps casual invitations short.",
      },
    ],
    followUps: [
      { id: "social-invite-activity", question: "What do you want to invite your friend to do?", salienceQuestion: "What activity fits the {slot}?" },
      { id: "social-invite-time", question: "What day and time would you suggest?", salienceQuestion: "What time works for the {slot}?" },
      { id: "social-invite-place", question: "Where should you meet?", salienceQuestion: "Where should the {slot} happen?" },
      { id: "social-invite-maybe", question: "What would you say if your friend says maybe?", salienceQuestion: "How would you adjust the {slot}?" },
      { id: "social-invite-confirm", question: "How would you confirm the plan in one message?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "social-invite-accept", question: "How would you respond if your friend says yes?", salienceQuestion: "How would you accept the {slot} plan?" },
    ],
  },
  {
    id: "topic-social-apologizing-rescheduling",
    labelEn: "Apologizing And Rescheduling",
    labelVi: "Xin lỗi và hẹn lại",
    category: "social",
    scenarioDescription:
      "The learner apologizes for being late, canceling, or missing a plan, gives a simple reason, and suggests a new time respectfully.",
    aiRoleDefinition:
      "Act as a friend, classmate, or coworker who receives the apology and helps the learner practice concise repair language and rescheduling.",
    conversationDirections: [
      "Ask what happened: late, canceled, forgot, or schedule conflict.",
      "Prompt a short apology without over-explaining.",
      "Practice giving one clear reason if appropriate.",
      "Ask the learner to suggest a new time or offer a choice.",
      "Practice acknowledging inconvenience.",
      "End with a friendly confirmation or follow-up message.",
    ],
    warmthPatterns: [
      "Use accountable, warm language.",
      "Avoid making the learner sound defensive.",
      "Model repair phrases that preserve the relationship.",
    ],
    seedInputs: [
      "I am sorry I need to reschedule our plan.",
      "Sorry, something came up — can we meet another time?",
      "I'm running late, I'll be there soon.",
    ],
    detectionPatterns: [
      /\b(?:sorry i need to reschedule|apologize|apologise|running late|i will be late|cancel our plan|missed our plan|can we reschedule)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "social-reschedule-preposition",
        label: "Reschedule for",
        note: "Use 'Can we reschedule for Friday?' or 'Can we meet another time?' Avoid 'reschedule to Friday' in casual speech if unsure.",
      },
      {
        id: "social-apology-simple",
        label: "Short apology",
        note: "A clear English apology can be short: 'I'm sorry I'm late.' Long explanations can sound defensive.",
      },
      {
        id: "social-reschedule-choice",
        label: "Offer two choices",
        note: "When rescheduling, offering two times sounds helpful: 'Would Friday afternoon or Saturday morning work for you?'",
      },
      {
        id: "social-reschedule-vocab",
        label: "Vocabulary",
        note: "reschedule = hẹn lại, dời lịch; something came up = có việc đột xuất; no worries = không sao đâu.",
      },
      {
        id: "social-reschedule-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Xin lỗi, mình phải dời hẹn, hẹn bạn hôm khác nhé?' ↔ EN: 'Sorry, I have to reschedule — can we meet another time?'",
      },
    ],
    followUps: [
      { id: "social-reschedule-issue", question: "What happened with the plan?", salienceQuestion: "What happened with the {slot}?" },
      { id: "social-reschedule-apology", question: "How would you apologize in one sentence?", salienceQuestion: "How would you apologize for the {slot}?" },
      { id: "social-reschedule-reason", question: "What short reason would you give?", salienceQuestion: "What reason connects to the {slot}?" },
      { id: "social-reschedule-new-time", question: "What new time would you suggest?", salienceQuestion: "What new time works for the {slot}?" },
      { id: "social-reschedule-confirm", question: "How would you confirm the new plan politely?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "social-reschedule-two-options", question: "What two new times could you offer?", salienceQuestion: "What choices would work for the {slot}?" },
    ],
  },
] as const satisfies readonly FinalThemeSpeakTopic[];
