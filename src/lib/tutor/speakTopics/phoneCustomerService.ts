import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D3SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-phone-customer-service-provider-call",
    labelEn: "Calling A Service Provider",
    labelVi: "Gọi nhà cung cấp dịch vụ",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner calls a phone, internet, utility, insurance, or other service provider to explain who they are, name the service, and ask for practical help.",
    aiRoleDefinition:
      "Act as a calm customer-service representative who asks for account details, repeats information clearly, and helps the learner make one clear request at a time.",
    conversationDirections: [
      "Open with the reason for the call before giving a long background story.",
      "Ask for the account number, phone number, address, or name on the account.",
      "Prompt the learner to describe the service problem in one sentence.",
      "Confirm dates, amounts, addresses, and callback details slowly.",
      "Offer a next step such as checking the account, booking a technician, or transferring the call.",
      "Practice asking for repetition when the phone audio is unclear.",
    ],
    warmthPatterns: [
      "Use short reassurance: 'I can help with that' and 'Let's check it together.'",
      "Keep the tone adult and respectful when the learner sounds unsure.",
      "Model polite persistence: clear request, calm repeat, practical next step.",
    ],
    seedInputs: ["Hi, I am calling about my internet service."],
    detectionPatterns: [
      /\b(?:calling about my|service provider|internet service|phone provider|utility company|account number|customer support|provider)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-cs-provider-article",
        label: "My account, my service",
        note: "Vietnamese often leaves out articles and possessives, so 'I call about account' can feel complete. In English service calls, 'my account' or 'my internet service' sounds clear and natural.",
      },
      {
        id: "phone-cs-provider-preposition",
        label: "Calling about, not calling for",
        note: "'Goi ve' can push learners toward 'calling for my bill.' The everyday English frame is 'I'm calling about my bill' or 'I'm calling about my service.'",
      },
    ],
    followUps: [
      { id: "phone-cs-provider-reason", question: "What service are you calling about?", salienceQuestion: "What provider handles the {slot}?" },
      { id: "phone-cs-provider-account", question: "What account detail might they ask for?", salienceQuestion: "What account detail connects to the {slot}?" },
      { id: "phone-cs-provider-problem", question: "How would you explain the problem in one sentence?", salienceQuestion: "What is happening with the {slot}?" },
      { id: "phone-cs-provider-repeat", question: "How would you ask them to repeat a detail?", salienceQuestion: "How would you ask again about the {slot}?" },
      { id: "phone-cs-provider-next", question: "How would you ask for the next step?", salienceQuestion: "What should happen next for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-customer-service-dispute-bill",
    labelEn: "Disputing A Bill",
    labelVi: "Khiếu nại hóa đơn",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner calls customer service because a bill looks wrong and they need to explain the charge, ask for a review, and request a correction or credit.",
    aiRoleDefinition:
      "Act as a billing agent who asks what charge is unclear, checks the billing period, and helps the learner phrase a firm but polite dispute.",
    conversationDirections: [
      "Ask which bill, month, or charge the learner is disputing.",
      "Prompt the learner to compare the expected amount and the actual amount.",
      "Practice saying 'I don't recognize this charge' without sounding hostile.",
      "Ask whether the learner wants a credit, refund, payment plan, or explanation.",
      "Confirm the case number, timeline, and whether payment is still due.",
      "Let the learner ask for a supervisor only after the first request is clear.",
    ],
    warmthPatterns: [
      "Validate the concern without escalating emotion: 'I understand why you want that checked.'",
      "Use calm firmness: 'Could you review this charge, please?'",
      "End with written confirmation or a case number.",
    ],
    seedInputs: ["I need to dispute a charge on my bill."],
    detectionPatterns: [
      /\b(?:dispute a charge|wrong bill|bill is wrong|billing error|overcharged|unexpected charge|refund|credit on my account)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-cs-bill-tense",
        label: "Was charged",
        note: "Learners may say 'you charge me wrong last month.' The billing phrase is often passive: 'I was charged twice' or 'I was overcharged last month.'",
      },
      {
        id: "phone-cs-bill-article",
        label: "A charge on my bill",
        note: "Vietnamese does not require 'a/the,' so 'dispute charge on bill' is a likely shortcut. In English, 'a charge on my bill' gives the agent the exact object to check.",
      },
    ],
    followUps: [
      { id: "phone-cs-bill-which", question: "Which bill or charge looks wrong?", salienceQuestion: "Which part of the {slot} looks wrong?" },
      { id: "phone-cs-bill-amount", question: "What amount did you expect, and what amount did you see?", salienceQuestion: "What amount is connected to the {slot}?" },
      { id: "phone-cs-bill-review", question: "How would you ask them to review the charge?", salienceQuestion: "How would you ask them to check the {slot}?" },
      { id: "phone-cs-bill-resolution", question: "What result do you want: explanation, credit, refund, or payment plan?", salienceQuestion: "What result do you need for the {slot}?" },
      { id: "phone-cs-bill-case", question: "How would you ask for a case number or written confirmation?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-phone-customer-service-ask-help-english",
    labelEn: "Asking For Help In English",
    labelVi: "Xin hỗ trợ khi nói tiếng Anh",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner is already on a service call and needs to ask the agent to slow down, repeat, spell a word, use simpler English, or explain one step at a time.",
    aiRoleDefinition:
      "Act as a patient support agent who normalizes clarification requests and responds with shorter, slower, practical instructions.",
    conversationDirections: [
      "Prompt the learner to state that English is not their first language if they want to.",
      "Practice asking the agent to speak more slowly.",
      "Practice asking for one step at a time instead of a long explanation.",
      "Ask the agent to spell names, addresses, confirmation codes, or technical words.",
      "Let the learner repeat back what they understood.",
      "Close by confirming the next action and asking for written follow-up if needed.",
    ],
    warmthPatterns: [
      "Normalize the request: 'Of course, I can slow down.'",
      "Avoid babying the learner; keep the language simple but adult.",
      "Praise the communication behavior, not the accent.",
    ],
    seedInputs: ["English is not my first language. Could you speak more slowly?"],
    detectionPatterns: [
      /\b(?:english is not my first language|speak more slowly|slow down|simpler english|one step at a time|could you spell|repeat that)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-cs-help-preposition",
        label: "Help with English",
        note: "'Giup toi tieng Anh' can become 'help me English.' The natural request is 'Could you help me with the English?' or simply 'Could you speak more slowly?'",
      },
      {
        id: "phone-cs-help-article",
        label: "One step at a time",
        note: "Vietnamese learners may say 'say step by step.' Customer-service English often uses 'Could you explain it one step at a time?'",
      },
    ],
    followUps: [
      { id: "phone-cs-help-slow", question: "How would you ask the agent to speak more slowly?", salienceQuestion: "How would you slow down the {slot}?" },
      { id: "phone-cs-help-repeat", question: "How would you ask them to repeat the last part?", salienceQuestion: "How would you hear the {slot} again?" },
      { id: "phone-cs-help-spell", question: "What word, name, or code would you ask them to spell?", salienceQuestion: "What part of the {slot} needs spelling?" },
      { id: "phone-cs-help-confirm", question: "How would you repeat back what you understood?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "phone-cs-help-written", question: "How would you ask for the instructions by text or email?", salienceQuestion: "How would you get the {slot} in writing?" },
    ],
  },
  {
    id: "topic-phone-customer-service-phone-menu",
    labelEn: "Navigating A Phone Menu",
    labelVi: "Nghe menu tự động trên điện thoại",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner reaches an automated phone menu, listens for the option that matches their problem, and learns how to reach a real person if needed.",
    aiRoleDefinition:
      "Act as an automated menu plus a coach who reads the options, lets the learner choose, and shows how to reach a person.",
    conversationDirections: [
      "Read out a short list of menu options.",
      "Let the learner pick the option for their problem.",
      "Practice what to do if they miss an option.",
      "Show how to reach a real person from the menu.",
      "Confirm the choice routed them correctly.",
    ],
    warmthPatterns: [
      "Keep it unhurried; waiting to choose is fine.",
      "Reassure the learner that menus repeat if missed.",
      "Encourage saying the chosen option back in English.",
    ],
    seedInputs: ["Press one for billing, press two for technical support."],
    detectionPatterns: [
      /\b(?:press one|press 1|press two|press 2|automated menu|phone menu|main menu|press the number|for billing press)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-service-menu-listen-for",
        label: "Listen for the option you need",
        note: "The menu lists choices fast: 'Press one for billing, two for support.' It is fine to wait and pick the option that matches your problem, no rush.",
      },
      {
        id: "phone-service-menu-numbers",
        label: "Numbers stay simple",
        note: "You only need to recognize 'press one, press two,' then act. Saying the option back to yourself in English is good practice for the next call.",
      },
    ],
    followUps: [
      { id: "phone-service-menu-option", question: "Which menu option matches your problem?", salienceQuestion: "Which menu option fits the {slot}?" },
      { id: "phone-service-menu-mishear", question: "What would you do if you miss an option?", salienceQuestion: "How would you handle missing the {slot} option?" },
      { id: "phone-service-menu-zero", question: "How might you reach a real person from the menu?", salienceQuestion: "How would you skip the menu to reach help with the {slot}?" },
      { id: "phone-service-menu-confirm", question: "How would you confirm you picked the right one?", salienceQuestion: "How would you check the menu sent you to the {slot}?" },
      { id: "phone-service-menu-repeat", question: "How would you ask the menu to repeat the options?", salienceQuestion: "How would you hear the {slot} options again?" },
    ],
  },
  {
    id: "topic-phone-customer-service-on-hold",
    labelEn: "Being Put On Hold",
    labelVi: "Bị giữ máy chờ",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner is put on hold, agrees to wait, asks how long it might be, checks the line if it goes quiet, and can ask for a callback instead.",
    aiRoleDefinition:
      "Act as a support agent who places the learner on hold, returns, and answers questions about wait time and callbacks.",
    conversationDirections: [
      "Ask the learner to hold and let them agree.",
      "Let them ask how long the wait might be.",
      "Practice what to say if the line goes quiet.",
      "Offer a callback as an option.",
      "Return to the line and thank them for waiting.",
    ],
    warmthPatterns: [
      "Keep hold language short and friendly.",
      "Reassure the learner that checking the quiet line is polite.",
      "Encourage 'I can hold' over longer phrasing.",
    ],
    seedInputs: ["Sure, I can hold. Thank you."],
    detectionPatterns: [
      /\b(?:on hold|put me on hold|please hold|i can hold|still there|hold the line|waiting on the line)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-service-hold-wait-not-here",
        label: "Hold or wait, not 'stand'",
        note: "Vietnamese 'chờ máy' can become 'I stand and wait.' On the phone, English uses 'I can hold' or 'I'll wait.' Friendly and short.",
      },
      {
        id: "phone-service-hold-still-there",
        label: "When the line goes quiet",
        note: "After a long silence it is normal to ask 'Hello, are you still there?' This is polite, not rude, and keeps the call going.",
      },
    ],
    followUps: [
      { id: "phone-service-hold-agree", question: "How would you agree to wait on hold?", salienceQuestion: "How would you agree to hold about the {slot}?" },
      { id: "phone-service-hold-time", question: "How would you ask how long the wait might be?", salienceQuestion: "How would you ask the wait time for the {slot}?" },
      { id: "phone-service-hold-check", question: "What would you say if the line goes quiet?", salienceQuestion: "How would you check the line during the {slot} call?" },
      { id: "phone-service-hold-callback", question: "How would you ask them to call you back instead?", salienceQuestion: "How would you ask for a callback about the {slot}?" },
      { id: "phone-service-hold-thanks", question: "How would you thank them when they come back?", salienceQuestion: "How would you thank them after the {slot} hold?" },
    ],
  },
  {
    id: "topic-phone-customer-service-voicemail",
    labelEn: "Leaving A Voicemail",
    labelVi: "Để lại lời nhắn thoại",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner leaves a clear voicemail: who is calling, a short reason, and a callback number said slowly, then a polite close.",
    aiRoleDefinition:
      "Act as a voicemail greeting plus a coach who helps the learner structure name, reason, number, and a polite ending.",
    conversationDirections: [
      "Prompt the learner to say who is calling.",
      "Have them give a short reason for the call.",
      "Practice saying the callback number slowly.",
      "Encourage repeating the number once.",
      "Close the voicemail politely.",
    ],
    warmthPatterns: [
      "Keep the message short and easy to replay.",
      "Reassure the learner that saying the number twice is welcome.",
      "Encourage 'Hi, this is...' as the phone opener.",
    ],
    seedInputs: ["Hi, this is Linh. Please call me back at this number."],
    detectionPatterns: [
      /\b(?:leave a voicemail|leave a message|left a message|call me back|this is .+ calling|after the beep|return my call)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-service-voicemail-leave-a",
        label: "Leave a message",
        note: "Vietnamese drops the article, so 'leave message' is common. English likes the small word: 'I'd like to leave a message.' One short add-on.",
      },
      {
        id: "phone-service-voicemail-this-is",
        label: "Say 'This is...' not 'I am...'",
        note: "On the phone English usually opens with 'Hi, this is Linh' instead of 'I am Linh.' It is a fixed phone habit, not a grammar rule to worry over.",
      },
      {
        id: "phone-service-voicemail-callback",
        label: "Ask for the call back clearly",
        note: "'Call me back' (not 'call back to me') and a slow phone number make a voicemail easy to act on. Saying the number twice is very welcome.",
      },
    ],
    followUps: [
      { id: "phone-service-voicemail-name", question: "How would you say who is calling?", salienceQuestion: "How would you give your name in the {slot}?" },
      { id: "phone-service-voicemail-reason", question: "What short reason would you leave?", salienceQuestion: "What reason would you leave about the {slot}?" },
      { id: "phone-service-voicemail-number", question: "How would you leave your number clearly?", salienceQuestion: "How would you share your number for the {slot}?" },
      { id: "phone-service-voicemail-close", question: "How would you end the voicemail politely?", salienceQuestion: "How would you close the message about the {slot}?" },
      { id: "phone-service-voicemail-besttime", question: "How would you say the best time to reach you?", salienceQuestion: "When could they call you back about the {slot}?" },
    ],
  },
  {
    id: "topic-phone-customer-service-explain-problem",
    labelEn: "Explaining A Problem To An Agent",
    labelVi: "Trình bày vấn đề với nhân viên",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner explains a service problem clearly: what is wrong, when it started, what they tried, and what a good fix would look like.",
    aiRoleDefinition:
      "Act as a support agent who asks what is wrong, when it began, what the learner tried, and what outcome they want.",
    conversationDirections: [
      "Ask what exactly is going wrong.",
      "Ask when the problem started.",
      "Find out what the learner already tried.",
      "Ask what a good fix would look like.",
      "Summarize the issue back to confirm.",
    ],
    warmthPatterns: [
      "Encourage short, clear sentences over long stories.",
      "Reassure the learner that 'It doesn't work' is a fine start.",
      "Keep the tone patient and solution-focused.",
    ],
    seedInputs: ["Yesterday my service stopped, and it still doesn't work."],
    detectionPatterns: [
      /\b(?:stopped working|it doesn't work|the problem is|started yesterday|since this morning|not working since|keeps happening)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-service-problem-past-ed",
        label: "Past -ed even with a time word",
        note: "Vietnamese lets a time word carry tense: 'Yesterday I call support.' English still adds -ed: 'Yesterday I called support.' The time word and the verb agree.",
      },
      {
        id: "phone-service-problem-it-doesnt",
        label: "Describe it simply",
        note: "A clear line like 'It doesn't work' or 'It stopped yesterday' helps more than a long story. Short sentences are easy for the agent to follow.",
      },
      {
        id: "phone-service-problem-plural-s",
        label: "Plural -s on the details",
        note: "VN nouns don't change for plural, so 'two time' slips out. English adds -s: 'It happened two times this week.' A tiny sound that adds clarity.",
      },
    ],
    followUps: [
      { id: "phone-service-problem-what", question: "What exactly is going wrong?", salienceQuestion: "What is going wrong with the {slot}?" },
      { id: "phone-service-problem-when", question: "When did the problem start?", salienceQuestion: "When did the {slot} problem start?" },
      { id: "phone-service-problem-tried", question: "What have you already tried?", salienceQuestion: "What did you already try with the {slot}?" },
      { id: "phone-service-problem-want", question: "What would a good fix look like for you?", salienceQuestion: "What fix do you want for the {slot}?" },
      { id: "phone-service-problem-account", question: "What account detail might they ask for?", salienceQuestion: "What detail identifies the {slot}?" },
    ],
  },
  {
    id: "topic-phone-customer-service-ask-for-person",
    labelEn: "Asking To Speak To A Person",
    labelVi: "Xin gặp người thật hoặc quản lý",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner asks to reach a real person or a manager, gives a brief reason, handles being asked to hold, and restates the issue to the new person.",
    aiRoleDefinition:
      "Act as a frontline agent who can transfer the learner, asks why a manager is needed, and hands off to a supervisor.",
    conversationDirections: [
      "Let the learner ask to reach a person or manager.",
      "Ask why a manager is needed.",
      "Practice handling a request to hold first.",
      "Have the learner restate the issue to the new person.",
      "Confirm the transfer is happening.",
    ],
    warmthPatterns: [
      "Keep the request calm, never a confrontation.",
      "Reassure the learner that asking for a manager is allowed.",
      "Encourage 'Could I speak to a manager, please?'",
    ],
    seedInputs: ["Could I speak to a manager, please?"],
    detectionPatterns: [
      /\b(?:speak to a person|speak to someone|talk to a manager|speak to a manager|a real person|supervisor|transfer me to)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-service-person-softening",
        label: "A gentle 'Could I...'",
        note: "Direct VN phrasing gives 'I want talk to a manager.' English softens on the phone: 'Could I speak to a manager, please?' It feels calmer and works better.",
      },
      {
        id: "phone-service-person-the-manager",
        label: "Speak to a manager",
        note: "Without articles, 'speak to manager' is natural to say. English wants 'a manager' or 'the manager.' Small word, friendly result.",
      },
    ],
    followUps: [
      { id: "phone-service-person-request", question: "How would you ask to reach a real person?", salienceQuestion: "How would you ask to speak to someone about the {slot}?" },
      { id: "phone-service-person-reason", question: "Why do you need a manager for this?", salienceQuestion: "Why does the {slot} need a manager?" },
      { id: "phone-service-person-wait", question: "How would you respond if asked to hold first?", salienceQuestion: "How would you wait to be transferred about the {slot}?" },
      { id: "phone-service-person-restate", question: "How would you restate the issue to the new person?", salienceQuestion: "How would you re-explain the {slot} to the manager?" },
      { id: "phone-service-person-name", question: "How would you give your name and account?", salienceQuestion: "How would you identify yourself for the {slot}?" },
    ],
  },
  {
    id: "topic-phone-customer-service-cancel-change",
    labelEn: "Canceling Or Changing A Service",
    labelVi: "Hủy hoặc thay đổi dịch vụ",
    category: "phone-customer-service",
    scenarioDescription:
      "The learner calls to cancel or change a service or plan, gives a reason if asked, checks any fees or final date, and confirms it is done.",
    aiRoleDefinition:
      "Act as a retention or billing agent who processes the cancel/change, mentions fees or a final date, and confirms completion.",
    conversationDirections: [
      "Ask what service the learner wants to cancel or change.",
      "Ask the reason, if the learner is comfortable.",
      "Mention any fees or the final date.",
      "Practice the learner confirming it is done.",
      "Offer a confirmation number or email.",
    ],
    warmthPatterns: [
      "Keep it pressure-free; canceling is the learner's choice.",
      "Reassure the learner that a reason is optional.",
      "Encourage 'I'd like to cancel...' over 'I want cancel.'",
    ],
    seedInputs: ["I'd like to cancel my subscription, please."],
    detectionPatterns: [
      /\b(?:cancel my|cancel the subscription|change my plan|downgrade|upgrade my plan|stop the service|end my contract)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "phone-service-cancel-want-to",
        label: "Soften the request",
        note: "VN often gives the bare 'I want cancel.' English adds a small frame: 'I'd like to cancel my subscription.' Polite, and the agent helps faster.",
      },
      {
        id: "phone-service-cancel-the-plan",
        label: "Name the plan with an article",
        note: "'Change my plan' or 'cancel the subscription' use little words VN can drop. Keeping 'my' and 'the' makes it clear which account you mean.",
      },
    ],
    followUps: [
      { id: "phone-service-cancel-what", question: "What service do you want to cancel or change?", salienceQuestion: "What change do you want for the {slot}?" },
      { id: "phone-service-cancel-reason", question: "What reason would you give, if asked?", salienceQuestion: "What reason would you give for the {slot}?" },
      { id: "phone-service-cancel-fees", question: "How would you ask about any fees or final date?", salienceQuestion: "How would you ask about fees for the {slot}?" },
      { id: "phone-service-cancel-confirm", question: "How would you confirm it is done?", salienceQuestion: "How would you confirm the {slot} is canceled?" },
      { id: "phone-service-cancel-proof", question: "How would you ask for a confirmation number?", salienceQuestion: "How would you get proof of the {slot}?" },
    ],
  },
] as const satisfies readonly D3SpeakTopic[];
