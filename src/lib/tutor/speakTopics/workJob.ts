import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-work-job-first-day",
    labelEn: "Starting A New Job",
    labelVi: "Ngày đầu đi làm",
    category: "work-job",
    seedInputs: ["Hi, today is my first day on the team."],
    detectionPatterns: [
      /\b(?:first day|new job|new team|start work|new employee|onboarding|new here)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-first-day-new-here",
        label: "Simple first-day frame",
        note: "Vietnamese introductions can be longer and more formal. At work, a short frame like 'I'm new here' plus your role is friendly and clear.",
      },
      {
        id: "work-first-day-help",
        label: "Ask for small help early",
        note: "Learners may wait quietly to avoid bothering people. In many workplaces, asking 'Could you show me where...' is normal and practical.",
      },
    ],
    followUps: [
      { id: "work-first-day-role", question: "How would you say your name and role?", salienceQuestion: "How would you introduce yourself for the {slot}?" },
      { id: "work-first-day-person", question: "Who do you need to meet first?", salienceQuestion: "Who can help you with the {slot}?" },
      { id: "work-first-day-place", question: "What place or tool do you need someone to show you?", salienceQuestion: "What do you need to find for the {slot}?" },
      { id: "work-first-day-thanks", question: "How would you thank a coworker after they help?", salienceQuestion: "How would you thank someone for the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-shift-schedule",
    labelEn: "Asking About Your Shift",
    labelVi: "Hỏi lịch ca làm",
    category: "work-job",
    seedInputs: ["Can you tell me my shift for this week?"],
    detectionPatterns: [
      /\b(?:shift|schedule|roster|work time|this week|next week|start time|finish time)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-shift-ca-lam",
        label: "Shift instead of 'work ca'",
        note: "'Ca làm' often comes out as 'work ca' or only 'my time.' The useful workplace word is 'shift': 'What time is my shift?'",
      },
      {
        id: "work-shift-confirm",
        label: "Repeat the time back",
        note: "Vietnamese learners often nod when unsure. Repeating the shift time back is a calm way to avoid being late.",
      },
    ],
    followUps: [
      { id: "work-shift-day", question: "Which day are you asking about?", salienceQuestion: "Which day matters for the {slot}?" },
      { id: "work-shift-time", question: "What start or finish time do you need to confirm?", salienceQuestion: "What time do you need for the {slot}?" },
      { id: "work-shift-change", question: "How would you ask if the schedule changed?", salienceQuestion: "How would you check if the {slot} changed?" },
      { id: "work-shift-repeat", question: "How would you repeat the schedule back?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-running-late",
    labelEn: "Telling Work You Are Running Late",
    labelVi: "Báo đi làm trễ",
    category: "work-job",
    seedInputs: ["I'm sorry, I am running about ten minutes late."],
    detectionPatterns: [
      /\b(?:running late|be late|late for work|traffic|missed the bus|ten minutes late|delay)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-late-short-apology",
        label: "Short apology is enough",
        note: "Vietnamese messages may include a long apology first. In English, one clear apology plus the new arrival time is usually enough.",
      },
      {
        id: "work-late-time",
        label: "Say the time estimate",
        note: "A useful late message includes 'about ten minutes late' or 'I will be there by 9:15' so the manager can plan.",
      },
    ],
    followUps: [
      { id: "work-late-reason", question: "What short reason would you give?", salienceQuestion: "What caused the {slot}?" },
      { id: "work-late-minutes", question: "How many minutes late will you be?", salienceQuestion: "How long is the {slot}?" },
      { id: "work-late-arrive", question: "What arrival time would you give?", salienceQuestion: "When will the {slot} be solved?" },
      { id: "work-late-close", question: "How would you close the message politely?", salienceQuestion: "How would you close the note about the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-asking-manager",
    labelEn: "Asking Your Manager A Question",
    labelVi: "Hỏi quản lý một việc",
    category: "work-job",
    seedInputs: ["Can I ask you a quick question about this task?"],
    detectionPatterns: [
      /\b(?:manager|supervisor|quick question|ask you|about this task|need to ask|team lead)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-manager-quick-question",
        label: "Permission frame",
        note: "A short 'Can I ask you a quick question?' is a natural way to enter a workplace question without sounding too direct.",
      },
      {
        id: "work-manager-context-first",
        label: "Give the task context",
        note: "In English work talk, naming the task first helps the manager answer faster: 'about the inventory list' or 'about this customer.'",
      },
    ],
    followUps: [
      { id: "work-manager-topic", question: "What task do you need to ask about?", salienceQuestion: "What question do you have about the {slot}?" },
      { id: "work-manager-timing", question: "How would you check if now is a good time?", salienceQuestion: "When would you ask about the {slot}?" },
      { id: "work-manager-detail", question: "What detail would make your question clear?", salienceQuestion: "What detail matters for the {slot}?" },
      { id: "work-manager-next", question: "How would you confirm the next step?", salienceQuestion: "What next step do you need for the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-coworker-small-talk",
    labelEn: "Small Talk With A Coworker",
    labelVi: "Nói chuyện nhẹ với đồng nghiệp",
    category: "work-job",
    seedInputs: ["How was your weekend?"],
    detectionPatterns: [
      /\b(?:coworker|colleague|small talk|weekend|lunch break|coffee break|how was your)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-smalltalk-not-too-personal",
        label: "Friendly but not too private",
        note: "Vietnamese friendliness can include age, family, or salary questions. Workplace English small talk is safer with weekend, lunch, weather, or plans.",
      },
      {
        id: "work-smalltalk-answer-plus-one",
        label: "Answer plus one question",
        note: "A natural rhythm is short answer plus one return question: 'It was quiet. How about you?'",
      },
    ],
    followUps: [
      { id: "work-smalltalk-open", question: "What easy question would you ask a coworker?", salienceQuestion: "How would you start small talk about the {slot}?" },
      { id: "work-smalltalk-answer", question: "How would you answer if they ask you back?", salienceQuestion: "What would you say about the {slot}?" },
      { id: "work-smalltalk-return", question: "What follow-up question could you ask?", salienceQuestion: "What would you ask next about the {slot}?" },
      { id: "work-smalltalk-close", question: "How would you end the chat and go back to work?", salienceQuestion: "How would you close the chat about the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-calling-in-sick",
    labelEn: "Calling In Sick",
    labelVi: "Báo nghỉ ốm",
    category: "work-job",
    seedInputs: ["I am not feeling well and I cannot come in today."],
    detectionPatterns: [
      /\b(?:calling in sick|not feeling well|cannot come in|can't come in|sick day|flu|fever)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-sick-not-overexplain",
        label: "Private details can stay private",
        note: "Learners may feel they must explain every symptom. A simple 'I'm not feeling well' is often enough for work.",
      },
      {
        id: "work-sick-come-in",
        label: "Come in means go to work",
        note: "At work, 'I can't come in today' means you cannot go to the workplace. It is a common phrase worth practising.",
      },
    ],
    followUps: [
      { id: "work-sick-state", question: "How would you say you are not feeling well?", salienceQuestion: "How would you explain the {slot}?" },
      { id: "work-sick-day", question: "Which day or shift will you miss?", salienceQuestion: "Which shift is affected by the {slot}?" },
      { id: "work-sick-cover", question: "How would you ask what to do about your shift?", salienceQuestion: "What do you need to ask about the {slot}?" },
      { id: "work-sick-return", question: "How would you say when you hope to return?", salienceQuestion: "When can you return after the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-paycheck-question",
    labelEn: "Asking About Paycheck Or Hours",
    labelVi: "Hỏi về lương hoặc giờ làm",
    category: "work-job",
    seedInputs: ["I have a question about my hours on my paycheck."],
    detectionPatterns: [
      /\b(?:paycheck|pay cheque|payroll|paid|hours missing|my hours|timesheet|wage)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-paycheck-neutral",
        label: "Neutral money question",
        note: "Money questions can feel uncomfortable. A neutral frame like 'I have a question about my paycheck' is calm and professional.",
      },
      {
        id: "work-paycheck-hours",
        label: "Hours before emotion",
        note: "Give the exact date or hours first. This keeps the conversation practical and avoids sounding like blame.",
      },
    ],
    followUps: [
      { id: "work-paycheck-issue", question: "What is the paycheck question?", salienceQuestion: "What is unclear about the {slot}?" },
      { id: "work-paycheck-date", question: "Which date or week is it about?", salienceQuestion: "Which date matters for the {slot}?" },
      { id: "work-paycheck-proof", question: "What detail from your timesheet would you mention?", salienceQuestion: "What detail supports the {slot}?" },
      { id: "work-paycheck-next", question: "How would you ask what happens next?", salienceQuestion: "What next step do you need for the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-task-unclear",
    labelEn: "When A Task Is Unclear",
    labelVi: "Khi chưa rõ việc cần làm",
    category: "work-job",
    seedInputs: ["I want to make sure I understand this task."],
    detectionPatterns: [
      /\b(?:unclear|do not understand|don't understand|make sure i understand|this task|instructions|what should i do)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-task-make-sure",
        label: "Check without losing face",
        note: "'I want to make sure I understand' is a respectful way to ask again. It keeps the focus on doing the task well.",
      },
      {
        id: "work-task-repeat-note",
        label: "Repeat the task in your words",
        note: "Repeating the task back is useful in English workplaces: 'So first I should..., right?'",
      },
    ],
    followUps: [
      { id: "work-task-part", question: "Which part of the task is unclear?", salienceQuestion: "What part of the {slot} is unclear?" },
      { id: "work-task-repeat", question: "How would you repeat what you understood?", salienceQuestion: "How would you repeat the {slot}?" },
      { id: "work-task-deadline", question: "What deadline or priority do you need to confirm?", salienceQuestion: "What deadline matters for the {slot}?" },
      { id: "work-task-check", question: "How would you ask if you are doing it correctly?", salienceQuestion: "How would you check the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-customer-problem",
    labelEn: "Explaining A Customer Problem",
    labelVi: "Nói về vấn đề với khách hàng",
    category: "work-job",
    seedInputs: ["A customer needs help with a return."],
    detectionPatterns: [
      /\b(?:customer problem|customer needs help|angry customer|return issue|complaint|customer is waiting)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-customer-neutral",
        label: "Neutral report",
        note: "Instead of saying the customer is 'difficult' first, English workplace reports often start with the practical issue: 'A customer needs help with a return.'",
      },
      {
        id: "work-customer-need-help",
        label: "Ask for backup",
        note: "It is okay to ask a manager for support. 'Could you help me with this customer?' is clear and professional.",
      },
    ],
    followUps: [
      { id: "work-customer-issue", question: "What does the customer need help with?", salienceQuestion: "What is happening with the {slot}?" },
      { id: "work-customer-waiting", question: "How would you say the customer is waiting?", salienceQuestion: "How would you explain the {slot} politely?" },
      { id: "work-customer-help", question: "What help do you need from a manager?", salienceQuestion: "What help do you need for the {slot}?" },
      { id: "work-customer-update", question: "How would you update the customer calmly?", salienceQuestion: "How would you update someone about the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-time-off-request",
    labelEn: "Requesting Time Off",
    labelVi: "Xin nghỉ phép",
    category: "work-job",
    seedInputs: ["Can I request next Friday off?"],
    detectionPatterns: [
      /\b(?:time off|day off|request off|vacation day|take next friday off|personal day|leave request)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "work-timeoff-xin-nghi",
        label: "Request, not permission only",
        note: "'Xin nghỉ' can feel like asking permission from a teacher. At work, 'request time off' sounds adult and normal.",
      },
      {
        id: "work-timeoff-date-note",
        label: "Date first",
        note: "Put the date early: 'Can I request Friday, June 12 off?' It helps the manager check the schedule quickly.",
      },
    ],
    followUps: [
      { id: "work-timeoff-date", question: "Which day do you want off?", salienceQuestion: "Which day do you need for the {slot}?" },
      { id: "work-timeoff-reason", question: "What short reason would you give, if any?", salienceQuestion: "What reason would you give for the {slot}?" },
      { id: "work-timeoff-coverage", question: "How would you ask about shift coverage?", salienceQuestion: "Who could cover the {slot}?" },
      { id: "work-timeoff-confirm", question: "How would you confirm the request was approved?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
];
