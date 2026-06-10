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
  {
    id: "topic-social-accept-invitation",
    labelEn: "Accepting An Invitation",
    labelVi: "Nhận lời mời",
    category: "social",
    scenarioDescription:
      "A friend or neighbor invites the learner somewhere, and the learner accepts warmly, confirms one detail like time or place, and asks what to bring.",
    aiRoleDefinition:
      "Act as a friendly host who invites the learner, welcomes a warm yes, and answers questions about time, place, and what to bring.",
    conversationDirections: [
      "Invite the learner to an event or outing.",
      "Welcome a warm, full acceptance, not just 'yes.'",
      "Let the learner confirm a detail like time or place.",
      "Answer what to bring if asked.",
      "Close by saying you look forward to it.",
    ],
    warmthPatterns: [
      "Keep the tone warm and welcoming.",
      "Reassure the learner that confirming details sounds prepared, not rude.",
      "Encourage 'I'd love to' over a bare 'yes.'",
    ],
    seedInputs: ["Thank you for inviting me. I would love to come."],
    detectionPatterns: [
      /\b(?:thank you for inviting me|i would love to come|accept an invitation|come to your party|join you|sounds nice)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "social-accept-love-to",
        label: "I would love to",
        note: "A warm English acceptance is 'I'd love to.' Vietnamese learners may answer only 'yes' because the rest feels extra.",
      },
      {
        id: "social-accept-confirm-detail",
        label: "Confirm one detail",
        note: "After accepting, it is normal to confirm time, place, or what to bring. It does not sound suspicious; it sounds prepared.",
      },
      {
        id: "social-accept-look-forward",
        label: "Looking forward to it",
        note: "A warm closer is 'I'm looking forward to it.' It sounds genuine and is easy to reuse for any invitation you accept.",
      },
    ],
    followUps: [
      { id: "social-accept-thanks", question: "How would you thank the person for inviting you?", salienceQuestion: "How would you thank them for the {slot}?" },
      { id: "social-accept-yes", question: "How would you say yes warmly?", salienceQuestion: "How would you accept the {slot}?" },
      { id: "social-accept-detail", question: "What detail would you confirm?", salienceQuestion: "What detail matters for the {slot}?" },
      { id: "social-accept-bring", question: "How would you ask what to bring?", salienceQuestion: "What should you bring to the {slot}?" },
      { id: "social-accept-forward", question: "How would you say you're looking forward to it?", salienceQuestion: "How would you show you're glad about the {slot}?" },
      { id: "social-accept-who", question: "How would you ask who else is coming?", salienceQuestion: "Who else will be at the {slot}?" },
    ],
  },
  {
    id: "topic-social-decline-politely",
    labelEn: "Declining Politely",
    labelVi: "Từ chối lịch sự",
    category: "social",
    scenarioDescription:
      "The learner cannot attend something and declines kindly, thanking the person, giving a short reason, and leaving the door open for next time.",
    aiRoleDefinition:
      "Act as a warm friend who invites the learner and accepts a kind, short decline without pressing for a long explanation.",
    conversationDirections: [
      "Invite the learner to something.",
      "Let the learner thank you first, then decline.",
      "Accept a short reason without pressing.",
      "Welcome a 'maybe next time' opening.",
      "Keep the tone friendly to the end.",
    ],
    warmthPatterns: [
      "Reassure the learner that a short reason is enough.",
      "Keep the exchange free of pressure or hard feelings.",
      "Encourage 'I can't make it' over a bare 'I can't go.'",
    ],
    seedInputs: ["Thank you for inviting me, but I can't make it this time."],
    detectionPatterns: [
      /\b(?:can't make it|decline politely|maybe next time|thank you for inviting|i have plans|sorry i can't come)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "social-decline-no-long-excuse",
        label: "Short reason is enough",
        note: "Vietnamese politeness may add a long explanation. English declining can stay kind and short: thanks, can't come, maybe next time.",
      },
      {
        id: "social-decline-cant-make-it",
        label: "Can't make it",
        note: "'I can't make it' is a natural social phrase for not being able to attend. It sounds softer than a bare 'I can't go.'",
      },
      {
        id: "social-decline-no-detail",
        label: "You don't owe a full reason",
        note: "It is fine to keep the reason private: 'I have something on that day.' A vague but warm reason is completely acceptable.",
      },
    ],
    followUps: [
      { id: "social-decline-thanks", question: "How would you thank them first?", salienceQuestion: "How would you thank them for the {slot}?" },
      { id: "social-decline-reason", question: "What short reason would you give?", salienceQuestion: "Why can't you make the {slot}?" },
      { id: "social-decline-next", question: "How would you leave the door open for next time?", salienceQuestion: "How would you suggest another {slot}?" },
      { id: "social-decline-tone", question: "How would you keep the tone warm?", salienceQuestion: "How would you sound kind about the {slot}?" },
      { id: "social-decline-private", question: "How would you keep the reason private but kind?", salienceQuestion: "How would you stay vague about the {slot}?" },
      { id: "social-decline-offer", question: "How would you offer to meet another way?", salienceQuestion: "What other {slot} could you suggest?" },
    ],
  },
  {
    id: "topic-social-join-group-conversation",
    labelEn: "Joining A Group Conversation",
    labelVi: "Tham gia cuộc trò chuyện nhóm",
    category: "social",
    scenarioDescription:
      "The learner wants to join a small group already talking, enters with a light line, listens, asks one question, adds a short comment, and can step away politely.",
    aiRoleDefinition:
      "Act as a member of a friendly group who welcomes the learner in, shares the topic, and includes their question and comment.",
    conversationDirections: [
      "Let the learner ask to join with a light line.",
      "Tell them what the group is talking about.",
      "Invite one question from the learner.",
      "Welcome one short comment they add.",
      "Allow a polite way to step away.",
    ],
    warmthPatterns: [
      "Make joining feel welcome, not awkward.",
      "Reassure the learner that listening first is a safe move.",
      "Encourage the simple 'Can I join you?' opener.",
    ],
    seedInputs: ["Can I join you? What are you talking about?"],
    detectionPatterns: [
      /\b(?:join the conversation|join you|what are you talking about|group chat|at the table|talking with coworkers)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "social-group-join-you",
        label: "Can I join you",
        note: "English groups often welcome a light entry line: 'Can I join you?' It is not too forward when said warmly.",
      },
      {
        id: "social-group-listen-first",
        label: "Listen then add",
        note: "Learners may worry about perfect timing. A safe move is to listen, ask one question, then add one short comment.",
      },
      {
        id: "social-group-agree",
        label: "Show you agree",
        note: "Short reactions like 'That's a good point' or 'Same here' let you join warmly without needing a long sentence.",
      },
    ],
    followUps: [
      { id: "social-group-enter", question: "How would you ask to join the group?", salienceQuestion: "How would you join the {slot}?" },
      { id: "social-group-topic", question: "How would you ask what they are discussing?", salienceQuestion: "What is the {slot} about?" },
      { id: "social-group-comment", question: "What short comment could you add?", salienceQuestion: "What could you add about the {slot}?" },
      { id: "social-group-exit", question: "How would you step away politely?", salienceQuestion: "How would you leave the {slot} kindly?" },
      { id: "social-group-react", question: "How would you show you agree or are interested?", salienceQuestion: "How would you react to the {slot}?" },
      { id: "social-group-name", question: "How would you introduce yourself if needed?", salienceQuestion: "How would you join the {slot} as a new face?" },
    ],
  },
  {
    id: "topic-social-ask-again",
    labelEn: "Asking Someone To Repeat",
    labelVi: "Nhờ người khác nói lại",
    category: "social",
    scenarioDescription:
      "The learner did not catch what someone said and asks them to repeat or slow down, then checks understanding and thanks them — all low-pressure.",
    aiRoleDefinition:
      "Act as a patient conversation partner who repeats and slows down willingly when the learner asks, without making it awkward.",
    conversationDirections: [
      "Say something the learner may not fully catch.",
      "Let the learner ask you to repeat.",
      "Slow down when asked.",
      "Let the learner check their understanding.",
      "Accept their thanks warmly.",
    ],
    warmthPatterns: [
      "Keep it relaxed; asking again is completely normal.",
      "Reassure the learner that repeating is no trouble at all.",
      "Encourage 'A little more slowly' over 'speak slow.'",
    ],
    seedInputs: ["Sorry, could you say that again a little more slowly?"],
    detectionPatterns: [
      /\b(?:say that again|repeat that|more slowly|i didn't catch|what did you say|pardon|could you repeat)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "social-repeat-no-pressure",
        label: "Asking again is normal",
        note: "Many learners smile and pretend they understood. In English social life, 'Could you say that again?' is normal and low-pressure.",
      },
      {
        id: "social-repeat-slowly",
        label: "A little more slowly",
        note: "'A little more slowly' sounds softer than 'speak slow.' It asks for help without blaming the other person.",
      },
      {
        id: "social-repeat-one-word",
        label: "Ask about one word",
        note: "You can ask about just the part you missed: 'Sorry, what does ___ mean?' It is fine to ask about a single word.",
      },
    ],
    followUps: [
      { id: "social-repeat-ask", question: "How would you ask them to repeat?", salienceQuestion: "How would you ask again about the {slot}?" },
      { id: "social-repeat-slow", question: "How would you ask them to slow down?", salienceQuestion: "How would you slow down the {slot}?" },
      { id: "social-repeat-check", question: "How would you check your understanding?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "social-repeat-thanks", question: "How would you thank them after they repeat?", salienceQuestion: "How would you thank them for explaining the {slot}?" },
      { id: "social-repeat-word", question: "How would you ask about one word you missed?", salienceQuestion: "How would you ask about a word in the {slot}?" },
      { id: "social-repeat-spell", question: "How would you ask them to spell a name?", salienceQuestion: "How would you confirm a name in the {slot}?" },
    ],
  },
  {
    id: "topic-social-compliment-and-reply",
    labelEn: "Giving And Receiving Compliments",
    labelVi: "Khen và đáp lại lời khen",
    category: "social",
    scenarioDescription:
      "The learner gives a specific, warm compliment and practices accepting praise graciously instead of brushing it off, and returning a kind word.",
    aiRoleDefinition:
      "Act as a friendly peer who exchanges compliments, accepts the learner's kind word, and gently models accepting praise.",
    conversationDirections: [
      "Invite the learner to give a specific compliment.",
      "Accept it warmly and compliment them back.",
      "Let the learner practice accepting praise.",
      "Encourage a short, gracious reply.",
      "Keep the exchange light and kind.",
    ],
    warmthPatterns: [
      "Model accepting praise without deflecting it.",
      "Reassure the learner that 'Thank you, that's kind' is enough.",
      "Encourage specific compliments over vague ones.",
    ],
    seedInputs: ["I like your jacket. The color looks great on you."],
    detectionPatterns: [
      /\b(?:nice jacket|i like your|compliment|looks great|thank you that's kind|you look nice|good job)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "social-compliment-specific-note",
        label: "Specific compliment",
        note: "A specific English compliment feels natural: 'I like your jacket' or 'You did a great job on the report.'",
      },
      {
        id: "social-compliment-accept",
        label: "Accepting kindly",
        note: "Vietnamese modesty may push learners to reject praise. In English, 'Thank you, that's kind of you' is warm and accepted.",
      },
      {
        id: "social-compliment-not-deflect",
        label: "Avoid 'no, it's nothing'",
        note: "Brushing praise away with 'no, it's nothing' can feel like disagreeing. A simple 'Thank you' keeps the moment warm.",
      },
    ],
    followUps: [
      { id: "social-compliment-what", question: "What would you compliment?", salienceQuestion: "What would you say about the {slot}?" },
      { id: "social-compliment-specific", question: "How would you make it specific?", salienceQuestion: "What detail about the {slot} would you mention?" },
      { id: "social-compliment-reply", question: "How would you reply if someone compliments you?", salienceQuestion: "How would you accept praise about the {slot}?" },
      { id: "social-compliment-return", question: "Would you return a compliment?", salienceQuestion: "What could you say back about the {slot}?" },
      { id: "social-compliment-simple", question: "How would you simply say thank you?", salienceQuestion: "How would you accept the {slot} graciously?" },
      { id: "social-compliment-work", question: "How would you compliment someone's work?", salienceQuestion: "How would you praise the {slot} they did?" },
    ],
  },
  {
    id: "topic-social-make-plans",
    labelEn: "Making Casual Plans",
    labelVi: "Hẹn gặp một cách tự nhiên",
    category: "social",
    scenarioDescription:
      "The learner suggests casual plans like coffee or lunch, offers a relaxed time and place, and confirms the plan later — keeping it low-pressure.",
    aiRoleDefinition:
      "Act as a friendly acquaintance who is open to casual plans, helps settle a time and place, and confirms warmly.",
    conversationDirections: [
      "Let the learner suggest a casual outing.",
      "Be open and help pick a relaxed time.",
      "Help settle on a place to meet.",
      "Practice confirming the plan later.",
      "Keep the whole thing easygoing.",
    ],
    warmthPatterns: [
      "Keep plans relaxed, not over-detailed.",
      "Reassure the learner that 'sometime next week' is fine.",
      "Encourage the soft 'Would you like to...' opener.",
    ],
    seedInputs: ["Would you like to get coffee sometime next week?"],
    detectionPatterns: [
      /\b(?:get coffee|make plans|hang out|meet sometime|next week|free this weekend|grab lunch)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "social-plans-sometime",
        label: "Sometime next week",
        note: "For casual plans, 'sometime next week' sounds relaxed. It is less intense than choosing every detail immediately.",
      },
      {
        id: "social-plans-would-like",
        label: "Would you like",
        note: "Vietnamese invitations can be direct and warm. English softens with 'Would you like to...' for casual social plans.",
      },
      {
        id: "social-plans-text-later",
        label: "Settle details by text",
        note: "It is normal to leave the details for later: 'I'll text you to figure out a time.' Casual plans do not need everything fixed at once.",
      },
    ],
    followUps: [
      { id: "social-plans-invite", question: "What would you invite them to do?", salienceQuestion: "How would you invite them to the {slot}?" },
      { id: "social-plans-time", question: "What time would you suggest?", salienceQuestion: "When would the {slot} work?" },
      { id: "social-plans-place", question: "Where could you meet?", salienceQuestion: "Where would you meet for the {slot}?" },
      { id: "social-plans-confirm", question: "How would you confirm the plan later?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "social-plans-text", question: "How would you say you'll text to settle details?", salienceQuestion: "How would you arrange the {slot} later?" },
      { id: "social-plans-flexible", question: "How would you stay flexible if they're busy?", salienceQuestion: "How would you adjust the {slot}?" },
    ],
  },
] as const satisfies readonly FinalThemeSpeakTopic[];
