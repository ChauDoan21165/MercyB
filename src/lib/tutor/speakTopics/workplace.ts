import type { SpeakTopicLibraryEntry as SpeakTopic } from "../speakTopicLibrary";

// Workplace theme. Real-life situations a Vietnamese learner meets in English.
// Deterministic / client-side: no per-turn LLM. Copy is warm, adult, low-shame.
// l1InterferenceNotes name genuine Vietnamese→English interference as friendly
// context, NEVER as a grammar correction.
export const workplaceSpeakTopics: readonly SpeakTopic[] = [
  {
    id: "topic-workplace-calling-in-sick",
    labelEn: "Calling In Sick",
    labelVi: "Báo nghỉ ốm",
    category: "work",
    seedInputs: ["Hi, I am not feeling well, so I can't come in today."],
    detectionPatterns: [
      /\b(?:calling in sick|call in sick|not feeling well|can't come in|can't make it in|i am sick|i'm sick|stay home today)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "workplace-sick-was-not-am",
        label: "Telling it as today",
        note: "If you mention 'this morning' or 'last night,' English moves the verb back too: 'Last night I was sick,' not 'Last night I am sick.' In Vietnamese the time word carries the time, so the verb can stay the same — here both move together.",
      },
      {
        id: "workplace-sick-take-a-day",
        label: "One natural phrase",
        note: "A calm, normal frame is 'I need to take a sick day' or 'I can't come in today.' Learners sometimes reach for 'I want to off today' from the Vietnamese idea of 'nghỉ' — 'take the day off' is the phrase that sounds easy and adult.",
      },
      {
        id: "workplace-sick-short-reason",
        label: "Short is fine",
        note: "You do not owe a long medical story. One line is enough: 'I'm not feeling well.' Keeping it short is normal and no pressure.",
      },
    ],
    followUps: [
      { id: "workplace-sick-who", question: "Who do you tell first when you are sick?", salienceQuestion: "How would you reach the {slot} to say you're sick?" },
      { id: "workplace-sick-reason", question: "What would you say is wrong, briefly?", salienceQuestion: "How would you explain the {slot} in one line?" },
      { id: "workplace-sick-work", question: "What happens to your tasks while you rest?", salienceQuestion: "Who could cover the {slot} for you today?" },
      { id: "workplace-sick-return", question: "When do you think you can come back?", salienceQuestion: "How would you say when you'll return to the {slot}?" },
    ],
  },
  {
    id: "topic-workplace-day-off",
    labelEn: "Requesting A Day Off",
    labelVi: "Xin nghỉ một ngày",
    category: "work",
    seedInputs: ["Could I take a day off next Friday?"],
    detectionPatterns: [
      /\b(?:day off|days off|take a day off|request a day off|book a day|vacation day|annual leave|time off|paid leave)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "workplace-dayoff-article",
        label: "The little 'a'",
        note: "English likes 'take a day off,' with 'a.' Vietnamese has no articles, so 'take day off' feels complete to learners. Adding 'a' is the small piece that makes it sound natural.",
      },
      {
        id: "workplace-dayoff-plural-s",
        label: "Two days, with -s",
        note: "For more than one day, English adds -s: 'two days off,' not 'two day off.' Vietnamese nouns don't change for number, so the -s is easy to drop — the number word already feels like enough.",
      },
      {
        id: "workplace-dayoff-could-i",
        label: "Asking, not telling",
        note: "With a boss, 'Could I take a day off?' sounds warmer than 'I want a day off.' Vietnamese often softens with tone and small words; in English the softening lives in 'Could I…' — easy to add and no pressure.",
      },
    ],
    followUps: [
      { id: "workplace-dayoff-when", question: "Which day would you like to take off?", salienceQuestion: "How would you name the {slot} you want off?" },
      { id: "workplace-dayoff-reason", question: "Would you give a short reason, or keep it private?", salienceQuestion: "How much would you share about the {slot}?" },
      { id: "workplace-dayoff-cover", question: "Who could handle things while you are away?", salienceQuestion: "Who could cover the {slot} that day?" },
      { id: "workplace-dayoff-confirm", question: "How would you confirm it is approved?", salienceQuestion: "How would you check the {slot} is okay with your boss?" },
    ],
  },
  {
    id: "topic-workplace-leave-early",
    labelEn: "Asking To Leave Early",
    labelVi: "Xin về sớm",
    category: "work",
    seedInputs: ["Could I leave early today? I have an appointment."],
    detectionPatterns: [
      /\b(?:leave early|leave early today|come in late|arrive late|go home early|finish early|step out for)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "workplace-early-could-i",
        label: "The polite opener",
        note: "'Could I leave early today?' feels right with a manager. Learners often translate the plain wish as 'I want leave early' — adding 'Could I' and 'to' ('I want to leave') keeps it calm and adult, no pressure.",
      },
      {
        id: "workplace-early-time-word-tense",
        label: "When the time word does the work",
        note: "For a future plan English still marks it: 'I'll leave at three' or 'I'm leaving early.' Vietnamese lets a time word carry the future while the verb stays bare, so 'Tomorrow I leave early' is a common habit — adding 'I'll' makes it land.",
      },
    ],
    followUps: [
      { id: "workplace-early-when", question: "What time would you need to leave?", salienceQuestion: "How would you say the {slot} you need to go?" },
      { id: "workplace-early-reason", question: "What short reason would you give?", salienceQuestion: "How would you mention the {slot} briefly?" },
      { id: "workplace-early-makeup", question: "Would you offer to make up the time?", salienceQuestion: "How would you offer to finish the {slot} later?" },
      { id: "workplace-early-thanks", question: "How would you thank your boss for saying yes?", salienceQuestion: "How would you thank them about the {slot}?" },
    ],
  },
  {
    id: "topic-workplace-talk-to-boss-workload",
    labelEn: "Talking To Your Boss About Workload",
    labelVi: "Nói với sếp về khối lượng công việc",
    category: "work",
    seedInputs: ["Could we talk about my workload this week?"],
    detectionPatterns: [
      /\b(?:talk to my boss|talk to the manager|talk to my manager|my workload|too much work|too many tasks|my schedule|overloaded|busy week)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "workplace-workload-article-the",
        label: "Talk to the manager",
        note: "English usually says 'talk to the manager' or 'talk to my boss,' with a small word in front. Vietnamese drops these, so 'talk to manager' feels complete — 'the' or 'my' is the piece that smooths it out.",
      },
      {
        id: "workplace-workload-plural-tasks",
        label: "Many tasks, with -s",
        note: "'Too many tasks' and 'a lot of meetings' take the -s in English. Vietnamese doesn't change the noun for number, so it's easy to say 'too many task' — the -s is the natural finish here.",
      },
      {
        id: "workplace-workload-frame-calm",
        label: "Naming it kindly",
        note: "You can be honest and still gentle: 'I want to make sure I do good work, and right now I have a lot on.' Naming the load is normal and not a complaint — no pressure to soften it away.",
      },
    ],
    followUps: [
      { id: "workplace-workload-what", question: "What feels like too much right now?", salienceQuestion: "How would you describe the {slot} that's heavy?" },
      { id: "workplace-workload-priority", question: "Which task matters most this week?", salienceQuestion: "How would you say the {slot} comes first?" },
      { id: "workplace-workload-ask", question: "What help or change would you ask for?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "workplace-workload-plan", question: "How would you agree on a plan together?", salienceQuestion: "How would you confirm the plan for the {slot}?" },
    ],
  },
  {
    id: "topic-workplace-ask-for-help",
    labelEn: "Asking Your Boss For Help",
    labelVi: "Nhờ sếp giúp hoặc giải thích",
    category: "work",
    seedInputs: ["Could you help me understand this part?"],
    detectionPatterns: [
      /\b(?:ask for help|need help with|help me understand|can you explain|could you clarify|i'm not sure how|i don't understand the|show me how)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "workplace-help-not-shy",
        label: "Asking is normal",
        note: "Learners sometimes stay quiet rather than ask, but in English workplaces 'Could you explain this part?' is welcome and easy to say. Asking early is a good sign, not a weakness — no pressure.",
      },
      {
        id: "workplace-help-explain-me",
        label: "Explain it to me",
        note: "English says 'Could you explain this to me?' — the 'to me' is part of the frame. Vietnamese can put the person right after the verb, so 'explain me' feels natural; 'explain it to me' is the version that sounds smooth.",
      },
    ],
    followUps: [
      { id: "workplace-help-what", question: "What part is unclear to you?", salienceQuestion: "How would you point to the {slot} you don't follow?" },
      { id: "workplace-help-tried", question: "What have you already tried yourself?", salienceQuestion: "How would you say what you tried with the {slot}?" },
      { id: "workplace-help-ask", question: "How would you ask for the explanation politely?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "workplace-help-check", question: "How would you check you understood?", salienceQuestion: "How would you confirm you got the {slot}?" },
    ],
  },
  {
    id: "topic-workplace-report-mistake",
    labelEn: "Reporting A Mistake To Your Manager",
    labelVi: "Báo lỗi với quản lý",
    category: "work",
    seedInputs: ["I think I made a mistake and I want to tell you early."],
    detectionPatterns: [
      /\b(?:made a mistake|i made a mistake|report a problem|something went wrong|there is a problem|i think i messed up|an error in|fix the mistake)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "workplace-mistake-article-a",
        label: "Made a mistake",
        note: "English says 'I made a mistake,' with 'a.' Vietnamese has no articles, so 'I made mistake' feels finished. The 'a' is small but it's what makes the sentence sound complete.",
      },
      {
        id: "workplace-mistake-past-ed",
        label: "It already happened",
        note: "When it's done, English uses the past: 'I sent the wrong file yesterday' → 'sent,' not 'send.' Vietnamese lets 'yesterday' carry the time while the verb stays bare, so the -ed is easy to drop — here the verb changes too.",
      },
      {
        id: "workplace-mistake-early-honest",
        label: "Telling early is brave",
        note: "Saying it early — 'I want to tell you before it gets bigger' — is respected in English workplaces. You can be honest without a long apology; one clear line is enough and no pressure.",
      },
    ],
    followUps: [
      { id: "workplace-mistake-what", question: "What went wrong, in one sentence?", salienceQuestion: "How would you name the {slot} that went wrong?" },
      { id: "workplace-mistake-when", question: "When did it happen?", salienceQuestion: "How would you say when the {slot} happened?" },
      { id: "workplace-mistake-fix", question: "What is your idea to fix it?", salienceQuestion: "How would you offer to fix the {slot}?" },
      { id: "workplace-mistake-prevent", question: "How would you stop it next time?", salienceQuestion: "How would you avoid the {slot} again?" },
    ],
  },
  {
    id: "topic-workplace-asking-about-pay",
    labelEn: "Asking About Pay Or Hours",
    labelVi: "Hỏi về lương hoặc giờ làm",
    category: "work",
    seedInputs: ["Could we talk about my pay sometime this week?"],
    detectionPatterns: [
      /\b(?:ask for a raise|about my pay|my salary|my hours|more hours|fewer hours|talk about pay|pay raise|get paid)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "workplace-pay-plural-hours",
        label: "Hours, with -s",
        note: "English says 'more hours' or 'fewer hours,' with -s, even after 'few' or 'more.' Vietnamese keeps the noun the same, so 'more hour' is a common slip — the -s is the natural finish.",
      },
      {
        id: "workplace-pay-could-we",
        label: "Opening the topic gently",
        note: "Money talk can feel hard, so a soft opener helps: 'Could we set a time to talk about my pay?' Learners may go straight to 'I want more money'; 'Could we talk about…' keeps it calm and adult, no pressure.",
      },
      {
        id: "workplace-pay-reason-value",
        label: "Saying why",
        note: "English often pairs the ask with a reason: 'I've taken on more, so I'd like to talk about my pay.' You don't need a speech — one honest line about your work is plenty.",
      },
    ],
    followUps: [
      { id: "workplace-pay-topic", question: "Are you asking about pay, hours, or both?", salienceQuestion: "How would you name the {slot} you want to discuss?" },
      { id: "workplace-pay-reason", question: "What reason supports your request?", salienceQuestion: "How would you explain the {slot} behind your ask?" },
      { id: "workplace-pay-timing", question: "When is a good time to bring it up?", salienceQuestion: "How would you pick a {slot} to raise it?" },
      { id: "workplace-pay-response", question: "How would you respond if they need to think?", salienceQuestion: "How would you reply about the {slot} later?" },
    ],
  },
  {
    id: "topic-workplace-swap-shift",
    labelEn: "Swapping A Shift With A Coworker",
    labelVi: "Đổi ca với đồng nghiệp",
    category: "work",
    seedInputs: ["Could you swap shifts with me on Saturday?"],
    detectionPatterns: [
      /\b(?:swap shifts|swap a shift|cover my shift|cover for me|switch shifts|trade shifts|take my shift|change my shift)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "workplace-shift-cover-for",
        label: "Cover for me",
        note: "The natural phrases are 'cover my shift' or 'cover for me on Friday.' Learners may say 'do my shift instead'; 'cover for me' is the warm, everyday version coworkers use.",
      },
      {
        id: "workplace-shift-past-worked",
        label: "Last week's swap",
        note: "Talking about a past favor uses the past tense: 'Last week you covered for me,' not 'Last week you cover for me.' Vietnamese leans on 'last week' to mark time; in English the verb takes the -ed too.",
      },
    ],
    followUps: [
      { id: "workplace-shift-which", question: "Which shift do you need to swap?", salienceQuestion: "How would you name the {slot} you want to change?" },
      { id: "workplace-shift-ask", question: "How would you ask a coworker nicely?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "workplace-shift-offer", question: "What would you offer in return?", salienceQuestion: "How would you trade for the {slot}?" },
      { id: "workplace-shift-confirm", question: "How would you make sure the boss knows?", salienceQuestion: "How would you confirm the {slot} with your manager?" },
    ],
  },
  {
    id: "topic-workplace-giving-notice",
    labelEn: "Giving Notice Politely",
    labelVi: "Xin nghỉ việc một cách lịch sự",
    category: "work",
    seedInputs: ["I wanted to let you know I've decided to leave the company."],
    detectionPatterns: [
      /\b(?:giving notice|give my notice|hand in my notice|i'm resigning|i am resigning|leave the company|my last day|two weeks notice|quit my job)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "workplace-notice-decided-ed",
        label: "I've decided",
        note: "English marks the decision as done: 'I've decided to leave,' not 'I decide to leave.' Vietnamese keeps the verb plain and lets context show it's settled; the '-ed' (or 'have decided') signals it's final.",
      },
      {
        id: "workplace-notice-warm-thanks",
        label: "Leaving on good terms",
        note: "A kind frame is 'Thank you for the chance to work here; my last day will be…' You can give the date clearly and still sound grateful. No long explanation is needed — short and warm is enough.",
      },
    ],
    followUps: [
      { id: "workplace-notice-decision", question: "How would you share your decision simply?", salienceQuestion: "How would you state the {slot} clearly?" },
      { id: "workplace-notice-lastday", question: "What would your last day be?", salienceQuestion: "How would you name the {slot} as your last day?" },
      { id: "workplace-notice-thanks", question: "How would you thank your boss?", salienceQuestion: "How would you thank them for the {slot}?" },
      { id: "workplace-notice-handover", question: "How would you offer to hand things over?", salienceQuestion: "How would you plan to pass on the {slot}?" },
    ],
  },
] as const;

export const speakTopics = workplaceSpeakTopics;
