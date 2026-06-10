import type { SpeakTopicLibraryEntry as SpeakTopic } from "../speakTopicLibrary";

// Workplace theme. Real-life situations a Vietnamese learner meets in English.
// Deterministic / client-side: no per-turn LLM. Copy is warm, adult, low-shame.
// l1InterferenceNotes name genuine Vietnamese→English interference as friendly
// context, NEVER as a grammar correction. Vietnamese is quoted with full
// diacritics so the learner recognises the L1 phrase behind the English.

type D4SpeakTopic = SpeakTopic & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const workplaceSpeakTopics: readonly D4SpeakTopic[] = [
  {
    id: "topic-workplace-calling-in-sick",
    labelEn: "Calling In Sick",
    labelVi: "Báo nghỉ ốm",
    category: "work",
    scenarioDescription:
      "The learner feels unwell and needs to call or message their manager to report a sick day, give a brief reason, and mention when they expect to return.",
    aiRoleDefinition:
      "Act as a manager who receives the sick-day message, asks how long the learner expects to be out, and confirms whether a doctor's note or urgent handover is needed.",
    conversationDirections: [
      "Start by letting the learner report that they are sick and cannot come in.",
      "Ask what is wrong — a short reason like a fever or stomach pain is enough.",
      "Prompt the learner to say which shift or day they will miss.",
      "Ask when they think they will be able to return.",
      "Check whether any urgent tasks need to be handed over.",
      "End by confirming the sick-day request and wishing the learner a quick recovery.",
    ],
    warmthPatterns: [
      "Stay calm and supportive: 'Thanks for letting me know — take care of yourself.'",
      "Keep the tone practical and no-pressure about reasons.",
      "Confirm clearly so the learner feels the message was received.",
    ],
    seedInputs: [
      "Hi, I am not feeling well, so I can't come in today.",
      "Good morning, I've got a fever and I need to take a sick day.",
    ],
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
      {
        id: "workplace-sick-feel-verb",
        label: "I feel sick",
        note: "Vietnamese 'tôi bị ốm' uses 'bị' (suffer), so 'I am bị sick' or 'I have sick' can slip out. English says 'I feel sick' or 'I'm not feeling well' — the verb is 'feel,' and 'well' (not 'good') is the natural partner here.",
      },
    ],
    followUps: [
      { id: "workplace-sick-who", question: "Who do you tell first when you are sick?", salienceQuestion: "How would you reach the {slot} to say you're sick?" },
      { id: "workplace-sick-reason", question: "What would you say is wrong, briefly?", salienceQuestion: "How would you explain the {slot} in one line?" },
      { id: "workplace-sick-work", question: "What happens to your tasks while you rest?", salienceQuestion: "Who could cover the {slot} for you today?" },
      { id: "workplace-sick-return", question: "When do you think you can come back?", salienceQuestion: "How would you say when you'll return to the {slot}?" },
      { id: "workplace-sick-note", question: "How would you ask if you need a doctor's note?", salienceQuestion: "What proof might they want for the {slot}?" },
      { id: "workplace-sick-message", question: "How would you write this as a short message?", salienceQuestion: "How would you text in about the {slot}?" },
    ],
  },
  {
    id: "topic-workplace-day-off",
    labelEn: "Requesting A Day Off",
    labelVi: "Xin nghỉ một ngày",
    category: "work",
    scenarioDescription:
      "The learner wants to take a day off and needs to ask their manager by naming the day, offering a brief reason, and confirming whether it is paid leave.",
    aiRoleDefinition:
      "Act as a manager who listens to the day-off request, checks team coverage, and either approves it, asks a clarifying question, or suggests an alternative date.",
    conversationDirections: [
      "Let the learner state the day they want off and frame it as a polite request.",
      "Ask if it is a vacation day, personal day, or annual leave.",
      "Prompt the learner to briefly explain the reason if they are comfortable.",
      "Ask who could cover their tasks or shift while they are away.",
      "Confirm the request — approved or pending — with a clear next step.",
      "End by checking how far ahead the request was made and whether notice is sufficient.",
    ],
    warmthPatterns: [
      "Keep the tone collegial: 'Sure, let me check the schedule.'",
      "Normalise asking — there is no shame in using leave.",
      "Confirm clearly so the learner knows their request was logged.",
    ],
    seedInputs: [
      "Could I take a day off next Friday?",
      "I'd like to request two days off next month, if that works.",
    ],
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
      {
        id: "workplace-dayoff-nghi-phep",
        label: "Annual leave vs a day off",
        note: "'Nghỉ phép' is your paid leave; a casual 'day off' may or may not be paid. If you mean your paid days, the clear words are 'a vacation day' or 'annual leave' — it tells your boss which kind you're using.",
      },
    ],
    followUps: [
      { id: "workplace-dayoff-when", question: "Which day would you like to take off?", salienceQuestion: "How would you name the {slot} you want off?" },
      { id: "workplace-dayoff-reason", question: "Would you give a short reason, or keep it private?", salienceQuestion: "How much would you share about the {slot}?" },
      { id: "workplace-dayoff-cover", question: "Who could handle things while you are away?", salienceQuestion: "Who could cover the {slot} that day?" },
      { id: "workplace-dayoff-confirm", question: "How would you confirm it is approved?", salienceQuestion: "How would you check the {slot} is okay with your boss?" },
      { id: "workplace-dayoff-notice", question: "How far ahead would you ask?", salienceQuestion: "How much notice would you give for the {slot}?" },
      { id: "workplace-dayoff-paid", question: "How would you ask if the day is paid?", salienceQuestion: "How would you check if the {slot} is paid?" },
    ],
  },
  {
    id: "topic-workplace-leave-early",
    labelEn: "Asking To Leave Early",
    labelVi: "Xin về sớm",
    category: "work",
    scenarioDescription:
      "The learner needs to leave before the end of their shift for an appointment or personal reason and must ask their manager politely, naming a time and briefly explaining why.",
    aiRoleDefinition:
      "Act as a manager who hears the request, asks what time the learner needs to leave and briefly why, checks task coverage, and then approves or agrees on an arrangement.",
    conversationDirections: [
      "Let the learner open with a polite request to leave early and give a time.",
      "Ask what the reason is — a short phrase like 'doctor's appointment' is enough.",
      "Prompt the learner to offer to make up the time or hand over any urgent work.",
      "Confirm what time the learner needs to be out the door.",
      "Ask whether the learner has already told a coworker or handled their tasks.",
      "Close by approving the request or agreeing a plan so the learner feels clear.",
    ],
    warmthPatterns: [
      "Keep the register professional but not cold: 'Of course — let me know if anything needs covering.'",
      "Acknowledge the effort of asking rather than just leaving.",
      "Focus on the practical: time and coverage, not the reason in detail.",
    ],
    seedInputs: [
      "Could I leave early today? I have an appointment.",
      "Would it be okay if I left at three for a doctor's visit?",
    ],
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
      {
        id: "workplace-early-ve-som",
        label: "Leave early vs go home early",
        note: "'Về sớm' can become 'go back early' or 'return early.' The everyday work phrase is 'leave early' (leave the workplace) or 'head out early.' 'Leave' is the verb a manager expects here.",
      },
    ],
    followUps: [
      { id: "workplace-early-when", question: "What time would you need to leave?", salienceQuestion: "How would you say the {slot} you need to go?" },
      { id: "workplace-early-reason", question: "What short reason would you give?", salienceQuestion: "How would you mention the {slot} briefly?" },
      { id: "workplace-early-makeup", question: "Would you offer to make up the time?", salienceQuestion: "How would you offer to finish the {slot} later?" },
      { id: "workplace-early-thanks", question: "How would you thank your boss for saying yes?", salienceQuestion: "How would you thank them about the {slot}?" },
      { id: "workplace-early-handover", question: "How would you hand off any urgent work?", salienceQuestion: "How would you pass on the {slot} before you go?" },
      { id: "workplace-early-ask-ahead", question: "How would you ask the day before instead of last minute?", salienceQuestion: "How would you give notice about the {slot}?" },
    ],
  },
  {
    id: "topic-workplace-talk-to-boss-workload",
    labelEn: "Talking To Your Boss About Workload",
    labelVi: "Nói với sếp về khối lượng công việc",
    category: "work",
    scenarioDescription:
      "The learner feels overloaded and wants to have an honest, calm conversation with their manager about which tasks matter most so they can do good work without burning out.",
    aiRoleDefinition:
      "Act as a manager who listens without judgment, asks which tasks feel heaviest, helps the learner name one or two priorities for the week, and agrees on a concrete plan together.",
    conversationDirections: [
      "Let the learner open the conversation by naming the situation calmly.",
      "Ask which tasks or projects feel most urgent or heavy right now.",
      "Prompt the learner to suggest which one they should tackle first.",
      "Practice asking to move a deadline or delegate part of a task.",
      "Ask the learner to confirm what the plan is at the end of the conversation.",
      "Keep the tone collaborative — problem-solving, not complaining.",
    ],
    warmthPatterns: [
      "Frame it as working together: 'Let's look at the list and pick the top two.'",
      "Normalise naming the load — it is a sign of ownership, not weakness.",
      "Avoid any hint of blame; the goal is a plan, not a verdict.",
    ],
    seedInputs: [
      "Could we talk about my workload this week?",
      "I've got a lot on right now — can we look at my priorities together?",
    ],
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
      {
        id: "workplace-workload-sep-boss",
        label: "Sếp is 'my boss' or 'my manager'",
        note: "'Sếp' covers any superior. In English you pick 'my boss' (casual) or 'my manager / supervisor' (more formal). 'My leader' is a direct translation that sounds off at work — 'my manager' is the safe word.",
      },
    ],
    followUps: [
      { id: "workplace-workload-what", question: "What feels like too much right now?", salienceQuestion: "How would you describe the {slot} that's heavy?" },
      { id: "workplace-workload-priority", question: "Which task matters most this week?", salienceQuestion: "How would you say the {slot} comes first?" },
      { id: "workplace-workload-ask", question: "What help or change would you ask for?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "workplace-workload-plan", question: "How would you agree on a plan together?", salienceQuestion: "How would you confirm the plan for the {slot}?" },
      { id: "workplace-workload-deadline", question: "How would you ask to move a deadline?", salienceQuestion: "How would you renegotiate the {slot} timing?" },
      { id: "workplace-workload-tone", question: "How would you raise it without sounding negative?", salienceQuestion: "How would you keep the {slot} talk positive?" },
    ],
  },
  {
    id: "topic-workplace-ask-for-help",
    labelEn: "Asking Your Boss For Help",
    labelVi: "Nhờ sếp giúp hoặc giải thích",
    category: "work",
    scenarioDescription:
      "The learner is stuck on a task or part of a process and needs to ask their manager for a clear explanation or demonstration, starting with a polite opener.",
    aiRoleDefinition:
      "Act as a manager who invites the learner to explain what is unclear, walks through the issue step by step in plain language, and checks at the end that the learner understood.",
    conversationDirections: [
      "Let the learner open by asking if now is a good time to ask a question.",
      "Prompt the learner to name the specific task or step that is unclear.",
      "Ask the learner to say what they have already tried so far.",
      "Walk through an explanation and ask the learner to repeat it back in their own words.",
      "Check whether the learner needs the explanation written down or shown again.",
      "Close by thanking the manager and confirming the next step.",
    ],
    warmthPatterns: [
      "Make asking feel safe: 'Good question — let me show you.'",
      "Invite repetition without any shame: 'Want me to go through it once more?'",
      "Keep the pace slow enough for confidence to build.",
    ],
    seedInputs: [
      "Could you help me understand this part?",
      "I'm a bit stuck on this — could you walk me through it?",
    ],
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
      {
        id: "workplace-help-chi-cho",
        label: "Show me how",
        note: "'Chỉ cho tôi' becomes 'point for me' or 'guide me' if translated tightly. The everyday phrases are 'Could you show me how?' or 'walk me through it' — natural ways to ask someone to demonstrate.",
      },
    ],
    followUps: [
      { id: "workplace-help-what", question: "What part is unclear to you?", salienceQuestion: "How would you point to the {slot} you don't follow?" },
      { id: "workplace-help-tried", question: "What have you already tried yourself?", salienceQuestion: "How would you say what you tried with the {slot}?" },
      { id: "workplace-help-ask", question: "How would you ask for the explanation politely?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "workplace-help-check", question: "How would you check you understood?", salienceQuestion: "How would you confirm you got the {slot}?" },
      { id: "workplace-help-timing", question: "How would you ask if now is a good time?", salienceQuestion: "When would you bring up the {slot}?" },
      { id: "workplace-help-thanks", question: "How would you thank them after they help?", salienceQuestion: "How would you thank them for the {slot}?" },
    ],
  },
  {
    id: "topic-workplace-report-mistake",
    labelEn: "Reporting A Mistake To Your Manager",
    labelVi: "Báo lỗi với quản lý",
    category: "work",
    scenarioDescription:
      "The learner made a workplace mistake — wrong order, missed step, or sent the wrong file — and needs to report it early, state the key facts, and offer a plan to fix it.",
    aiRoleDefinition:
      "Act as a manager who receives the mistake report calmly, asks for the date, the error, and the impact, then guides the learner to think through a fix rather than blame anyone.",
    conversationDirections: [
      "Let the learner open by saying they need to report something that went wrong.",
      "Ask what exactly happened — the date, task, and what the error was.",
      "Prompt the learner to say what the impact is and how urgent the fix is.",
      "Ask the learner's idea for fixing or correcting the mistake.",
      "Discuss how to avoid the same mistake next time.",
      "Close by thanking the learner for being honest and confirming the next action.",
    ],
    warmthPatterns: [
      "Lead with calm: 'Thanks for telling me early — let's sort this out.'",
      "Focus on the fix, not the fault: 'What can we do right now?'",
      "Acknowledge that reporting takes courage and is the right move.",
    ],
    seedInputs: [
      "I think I made a mistake and I want to tell you early.",
      "I need to let you know something went wrong with the order.",
    ],
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
      {
        id: "workplace-mistake-make-verb",
        label: "Make a mistake, not 'do'",
        note: "'Làm sai' can lead to 'I did a mistake.' English pairs 'mistake' with 'make': 'I made a mistake.' (You 'do' a task, but you 'make' a mistake — a fixed pairing worth remembering.)",
      },
    ],
    followUps: [
      { id: "workplace-mistake-what", question: "What went wrong, in one sentence?", salienceQuestion: "How would you name the {slot} that went wrong?" },
      { id: "workplace-mistake-when", question: "When did it happen?", salienceQuestion: "How would you say when the {slot} happened?" },
      { id: "workplace-mistake-fix", question: "What is your idea to fix it?", salienceQuestion: "How would you offer to fix the {slot}?" },
      { id: "workplace-mistake-prevent", question: "How would you stop it next time?", salienceQuestion: "How would you avoid the {slot} again?" },
      { id: "workplace-mistake-help", question: "What help would you ask for to fix it?", salienceQuestion: "What help do you need with the {slot}?" },
      { id: "workplace-mistake-calm", question: "How would you stay calm while you explain?", salienceQuestion: "How would you keep steady about the {slot}?" },
    ],
  },
  {
    id: "topic-workplace-asking-about-pay",
    labelEn: "Asking About Pay Or Hours",
    labelVi: "Hỏi về lương hoặc giờ làm",
    category: "work",
    scenarioDescription:
      "The learner wants to have a professional conversation with their manager about pay or hours — asking for more hours, discussing a raise, or clarifying their pay — framing the ask around their contribution.",
    aiRoleDefinition:
      "Act as a manager who listens to the pay or hours request, asks the learner's reason, and either agrees to discuss further, explains the review process, or asks for more time to check.",
    conversationDirections: [
      "Let the learner ask to set a time to talk about pay or hours rather than demanding immediately.",
      "Ask whether the conversation is about a raise, more hours, fewer hours, or a paycheck question.",
      "Prompt the learner to give one honest reason that supports their request.",
      "Practice responding calmly if the manager says 'let me think about it.'",
      "Ask the learner how they would close the conversation warmly regardless of the outcome.",
      "Confirm the next step — a follow-up date, a decision, or a process to follow.",
    ],
    warmthPatterns: [
      "Normalise the topic: 'It's completely fine to bring this up — let's talk.'",
      "Keep the tone adult and calm: practical points, not emotional pressure.",
      "Acknowledge the ask positively even if the answer is 'not yet.'",
    ],
    seedInputs: [
      "Could we talk about my pay sometime this week?",
      "I'd like to ask about getting a few more hours.",
    ],
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
      {
        id: "workplace-pay-tang-luong",
        label: "A raise is 'a pay raise'",
        note: "'Tăng lương' translates literally as 'increase salary.' The natural noun is 'a raise' (US) or 'a pay rise' (UK): 'Could we talk about a raise?' Both are clearer at work than 'increase my money.'",
      },
    ],
    followUps: [
      { id: "workplace-pay-topic", question: "Are you asking about pay, hours, or both?", salienceQuestion: "How would you name the {slot} you want to discuss?" },
      { id: "workplace-pay-reason", question: "What reason supports your request?", salienceQuestion: "How would you explain the {slot} behind your ask?" },
      { id: "workplace-pay-timing", question: "When is a good time to bring it up?", salienceQuestion: "How would you pick a {slot} to raise it?" },
      { id: "workplace-pay-response", question: "How would you respond if they need to think?", salienceQuestion: "How would you reply about the {slot} later?" },
      { id: "workplace-pay-prepare", question: "What would you prepare before the talk?", salienceQuestion: "How would you get ready for the {slot} chat?" },
      { id: "workplace-pay-thanks", question: "How would you close the talk warmly?", salienceQuestion: "How would you end the {slot} conversation?" },
    ],
  },
  {
    id: "topic-workplace-swap-shift",
    labelEn: "Swapping A Shift With A Coworker",
    labelVi: "Đổi ca với đồng nghiệp",
    category: "work",
    scenarioDescription:
      "The learner needs to change a shift and wants to ask a coworker to swap, agree on the trade, and make sure the manager or schedule system is updated.",
    aiRoleDefinition:
      "Act as a coworker who hears the swap request, asks which shift and which day the learner wants in return, and either agrees or suggests a different arrangement.",
    conversationDirections: [
      "Let the learner name the shift they want to swap and ask the coworker politely.",
      "Ask which shift the learner is offering in return.",
      "Prompt the learner to confirm both the date and the time clearly.",
      "Practice what the learner would say if the coworker says no.",
      "Ask how the learner would let the manager know about the swap.",
      "Close by repeating the agreed arrangement so both sides are clear.",
    ],
    warmthPatterns: [
      "Keep the tone friendly and reciprocal: 'I can cover yours another time — how about this?'",
      "Make the ask easy to say yes or no to without pressure.",
      "Confirm the swap in writing (text or app) as the natural last step.",
    ],
    seedInputs: [
      "Could you swap shifts with me on Saturday?",
      "Any chance you could cover my Friday shift? I'll take one of yours.",
    ],
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
      {
        id: "workplace-shift-doi-ca",
        label: "Swap or trade shifts",
        note: "'Đổi ca' is exactly 'swap shifts' or 'trade shifts.' Both verbs work: 'Can we swap shifts?' or 'Can we trade?' Coworkers say either — 'change shift with me' is understood but a touch less natural.",
      },
    ],
    followUps: [
      { id: "workplace-shift-which", question: "Which shift do you need to swap?", salienceQuestion: "How would you name the {slot} you want to change?" },
      { id: "workplace-shift-ask", question: "How would you ask a coworker nicely?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "workplace-shift-offer", question: "What would you offer in return?", salienceQuestion: "How would you trade for the {slot}?" },
      { id: "workplace-shift-confirm", question: "How would you make sure the boss knows?", salienceQuestion: "How would you confirm the {slot} with your manager?" },
      { id: "workplace-shift-thanks", question: "How would you thank a coworker who says yes?", salienceQuestion: "How would you thank them for the {slot}?" },
      { id: "workplace-shift-backup", question: "How would you ask someone else if the first says no?", salienceQuestion: "Who else could take the {slot}?" },
    ],
  },
  {
    id: "topic-workplace-giving-notice",
    labelEn: "Giving Notice Politely",
    labelVi: "Xin nghỉ việc một cách lịch sự",
    category: "work",
    scenarioDescription:
      "The learner has decided to leave their job and needs to inform their manager, give the last working day, offer a smooth handover, and thank the company — leaving on good terms.",
    aiRoleDefinition:
      "Act as a manager who receives the resignation, asks about the last day and handover plan, responds professionally, and expresses good wishes for the learner's next step.",
    conversationDirections: [
      "Let the learner share the decision calmly and professionally, without over-explaining.",
      "Ask what the last working day will be.",
      "Prompt the learner to offer to hand over tasks or train a replacement.",
      "Practice thanking the company for the opportunity — a short, warm phrase.",
      "Ask if the learner would like to request a reference.",
      "Close by confirming the handover plan and wishing each other well.",
    ],
    warmthPatterns: [
      "Stay warm and professional on both sides: 'We'll miss you — all the best.'",
      "Keep the tone matter-of-fact; no need for long explanations or justifications.",
      "End every exchange on a positive note — good terms are the lasting impression.",
    ],
    seedInputs: [
      "I wanted to let you know I've decided to leave the company.",
      "I'm giving my two weeks' notice — my last day would be the 20th.",
    ],
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
      {
        id: "workplace-notice-nghi-viec",
        label: "Resign, not just 'stop work'",
        note: "'Nghỉ việc' can become 'stop work' or 'rest the job.' The work words are 'resign,' 'give notice,' or 'hand in my notice.' 'I'm resigning' or 'I'd like to give my notice' is the clear, professional phrasing.",
      },
    ],
    followUps: [
      { id: "workplace-notice-decision", question: "How would you share your decision simply?", salienceQuestion: "How would you state the {slot} clearly?" },
      { id: "workplace-notice-lastday", question: "What would your last day be?", salienceQuestion: "How would you name the {slot} as your last day?" },
      { id: "workplace-notice-thanks", question: "How would you thank your boss?", salienceQuestion: "How would you thank them for the {slot}?" },
      { id: "workplace-notice-handover", question: "How would you offer to hand things over?", salienceQuestion: "How would you plan to pass on the {slot}?" },
      { id: "workplace-notice-reference", question: "How would you ask for a reference?", salienceQuestion: "How would you ask about the {slot} for the future?" },
      { id: "workplace-notice-reason", question: "How much reason would you share, if any?", salienceQuestion: "How would you frame the {slot} kindly?" },
    ],
  },
] as const;

export const speakTopics = workplaceSpeakTopics;
