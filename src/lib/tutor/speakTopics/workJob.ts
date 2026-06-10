import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Work & Job theme. Real-life situations a Vietnamese learner meets in English.
// Deterministic / client-side: no per-turn LLM. Copy is warm, adult, low-shame.
// l1InterferenceNotes name genuine Vietnamese→English interference as friendly
// context, NEVER as a grammar correction. Vietnamese is quoted with full
// diacritics so the learner recognises the L1 phrase behind the English.
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-work-job-first-day",
    labelEn: "Starting A New Job",
    labelVi: "Ngày đầu đi làm",
    category: "work-job",
    seedInputs: [
      "Hi, today is my first day on the team.",
      "Good morning, I'm new here. I start today.",
    ],
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
      {
        id: "work-first-day-nice-to-meet",
        label: "Nice to meet you",
        note: "'Rất vui được gặp' becomes 'Nice to meet you' — present, not 'I happy to meet you.' English keeps the small verb 'to be': 'I'm happy to be here.'",
      },
      {
        id: "work-first-day-start-today",
        label: "I'm starting, I started",
        note: "'Hôm nay tôi bắt đầu' is naturally 'I start today,' but English often marks it as happening now ('I'm starting today') or, once the day is over, as past ('I started on Monday'). The verb carries the time, not just the day word.",
      },
      {
        id: "work-first-day-vocab",
        label: "Vocabulary",
        note: "onboarding = quá trình nhận việc, làm quen; coworker = đồng nghiệp; check in with = trình diện, báo có mặt với.",
      },
      {
        id: "work-first-day-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Chào mọi người, hôm nay là ngày đầu của em ạ.' ↔ EN: 'Hi everyone, today is my first day.' English keeps it short and uses first names.",
      },
    ],
    followUps: [
      { id: "work-first-day-role", question: "How would you say your name and role?", salienceQuestion: "How would you introduce yourself for the {slot}?" },
      { id: "work-first-day-person", question: "Who do you need to meet first?", salienceQuestion: "Who can help you with the {slot}?" },
      { id: "work-first-day-place", question: "What place or tool do you need someone to show you?", salienceQuestion: "What do you need to find for the {slot}?" },
      { id: "work-first-day-thanks", question: "How would you thank a coworker after they help?", salienceQuestion: "How would you thank someone for the {slot}?" },
      { id: "work-first-day-question", question: "How would you ask where to put your things?", salienceQuestion: "How would you ask about the {slot} on your first day?" },
      { id: "work-first-day-eager", question: "How would you say you're ready to learn?", salienceQuestion: "How would you show you're keen for the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-shift-schedule",
    labelEn: "Asking About Your Shift",
    labelVi: "Hỏi lịch ca làm",
    category: "work-job",
    seedInputs: [
      "Can you tell me my shift for this week?",
      "What time do I start tomorrow?",
    ],
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
      {
        id: "work-shift-day-off",
        label: "Ngày nghỉ is 'day off'",
        note: "'Ngày nghỉ' translates word-for-word as 'rest day,' but the everyday work word is 'day off': 'Which day is my day off?' Both are understood, yet 'day off' is what the schedule will say.",
      },
      {
        id: "work-shift-prepositions",
        label: "On Monday, at 9",
        note: "Vietnamese says the equivalent of 'Monday I start 9 o'clock,' so the small words drop out. English wants 'on Monday' and 'at 9': 'I start at 9 on Monday.' The 'on' and 'at' make the time clear.",
      },
      {
        id: "work-shift-vocab",
        label: "Vocabulary",
        note: "shift = ca làm; schedule / roster = lịch làm việc; start time = giờ bắt đầu; finish time = giờ tan ca.",
      },
      {
        id: "work-shift-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Tuần này em làm ca nào ạ?' ↔ EN: 'What's my shift this week?' English asks for the shift, not the literal 'which shift do I work.'",
      },
    ],
    followUps: [
      { id: "work-shift-day", question: "Which day are you asking about?", salienceQuestion: "Which day matters for the {slot}?" },
      { id: "work-shift-time", question: "What start or finish time do you need to confirm?", salienceQuestion: "What time do you need for the {slot}?" },
      { id: "work-shift-change", question: "How would you ask if the schedule changed?", salienceQuestion: "How would you check if the {slot} changed?" },
      { id: "work-shift-repeat", question: "How would you repeat the schedule back?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "work-shift-where", question: "How would you ask where the schedule is posted?", salienceQuestion: "Where can you find the {slot}?" },
      { id: "work-shift-overtime", question: "How would you ask about extra hours?", salienceQuestion: "How would you ask about more {slot}?" },
    ],
  },
  {
    id: "topic-work-job-running-late",
    labelEn: "Telling Work You Are Running Late",
    labelVi: "Báo đi làm trễ",
    category: "work-job",
    seedInputs: [
      "I'm sorry, I am running about ten minutes late.",
      "Sorry, the bus is late, so I'll be there by 9:15.",
    ],
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
      {
        id: "work-late-running-late",
        label: "Running late, not 'go late'",
        note: "'Đi trễ' often becomes 'I go late' or 'I'm late go.' The natural set phrase is 'I'm running late' or 'I'm going to be late.' 'Running' here just means 'happening now,' nothing about speed.",
      },
      {
        id: "work-late-future-will",
        label: "I'll be there",
        note: "'Tôi sẽ tới lúc 9 giờ' carries the future with 'sẽ.' English uses 'I'll' or 'I'm going to': 'I'll be there by 9.' The 'sẽ' becomes the small 'll attached to 'I.'",
      },
      {
        id: "work-late-vocab",
        label: "Vocabulary",
        note: "running late = đang bị trễ; traffic = kẹt xe; be there by = có mặt trước lúc. 'By 9:15' means at or before 9:15.",
      },
      {
        id: "work-late-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Em xin lỗi, đường kẹt nên em sẽ tới trễ khoảng 10 phút ạ.' ↔ EN: 'Sorry, traffic is bad, so I'll be about ten minutes late.'",
      },
    ],
    followUps: [
      { id: "work-late-reason", question: "What short reason would you give?", salienceQuestion: "What caused the {slot}?" },
      { id: "work-late-minutes", question: "How many minutes late will you be?", salienceQuestion: "How long is the {slot}?" },
      { id: "work-late-arrive", question: "What arrival time would you give?", salienceQuestion: "When will the {slot} be solved?" },
      { id: "work-late-close", question: "How would you close the message politely?", salienceQuestion: "How would you close the note about the {slot}?" },
      { id: "work-late-who", question: "Who should you message when you're late?", salienceQuestion: "Who do you tell about the {slot}?" },
      { id: "work-late-makeup", question: "How would you offer to make up the time?", salienceQuestion: "How would you make up for the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-asking-manager",
    labelEn: "Asking Your Manager A Question",
    labelVi: "Hỏi quản lý một việc",
    category: "work-job",
    seedInputs: [
      "Can I ask you a quick question about this task?",
      "Do you have a minute? I want to check something with you.",
    ],
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
      {
        id: "work-manager-have-a-minute",
        label: "Do you have a minute?",
        note: "'Anh/chị có rảnh không?' is asking if they're free. The everyday work version is 'Do you have a minute?' or 'Is now a good time?' — softer than 'Are you free?', which can sound like an invitation.",
      },
      {
        id: "work-manager-ask-about",
        label: "Ask about, not ask",
        note: "'Hỏi việc này' becomes 'ask this' if translated tightly. English usually adds 'about': 'I want to ask you about this task.' The 'about' points to the topic of the question.",
      },
      {
        id: "work-manager-vocab",
        label: "Vocabulary",
        note: "manager / supervisor = quản lý, người giám sát; task = công việc, nhiệm vụ; Do you have a minute? = anh có rảnh một chút không?",
      },
      {
        id: "work-manager-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Anh có rảnh một chút không, em hỏi về việc này ạ?' ↔ EN: 'Do you have a minute? I have a quick question about this task.'",
      },
    ],
    followUps: [
      { id: "work-manager-topic", question: "What task do you need to ask about?", salienceQuestion: "What question do you have about the {slot}?" },
      { id: "work-manager-timing", question: "How would you check if now is a good time?", salienceQuestion: "When would you ask about the {slot}?" },
      { id: "work-manager-detail", question: "What detail would make your question clear?", salienceQuestion: "What detail matters for the {slot}?" },
      { id: "work-manager-next", question: "How would you confirm the next step?", salienceQuestion: "What next step do you need for the {slot}?" },
      { id: "work-manager-thanks", question: "How would you thank them for explaining?", salienceQuestion: "How would you thank them about the {slot}?" },
      { id: "work-manager-written", question: "How would you ask them to write it down or show you?", salienceQuestion: "How would you get the {slot} in writing?" },
    ],
  },
  {
    id: "topic-work-job-coworker-small-talk",
    labelEn: "Small Talk With A Coworker",
    labelVi: "Nói chuyện nhẹ với đồng nghiệp",
    category: "work-job",
    seedInputs: [
      "How was your weekend?",
      "Morning! Did you do anything fun on the weekend?",
    ],
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
      {
        id: "work-smalltalk-how-old",
        label: "Skip 'how old are you?'",
        note: "'Bạn bao nhiêu tuổi?' is a warm opener in Vietnamese but feels personal at a Western workplace. Safer openers are 'How's your day going?' or 'Any plans this weekend?' — friendly without the age question.",
      },
      {
        id: "work-smalltalk-past-weekend",
        label: "Was, not is",
        note: "'Cuối tuần của bạn thế nào?' has no past marker, so 'How is your weekend?' slips out for a weekend already finished. English uses 'How was your weekend?' — the 'was' shows it's already over.",
      },
      {
        id: "work-smalltalk-vocab",
        label: "Vocabulary",
        note: "small talk = nói chuyện phiếm; weekend = cuối tuần; break = giờ giải lao. 'How about you?' returns the same question politely.",
      },
      {
        id: "work-smalltalk-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Cuối tuần của anh vui không?' ↔ EN: 'How was your weekend?' A short, light question is enough to start.",
      },
    ],
    followUps: [
      { id: "work-smalltalk-open", question: "What easy question would you ask a coworker?", salienceQuestion: "How would you start small talk about the {slot}?" },
      { id: "work-smalltalk-answer", question: "How would you answer if they ask you back?", salienceQuestion: "What would you say about the {slot}?" },
      { id: "work-smalltalk-return", question: "What follow-up question could you ask?", salienceQuestion: "What would you ask next about the {slot}?" },
      { id: "work-smalltalk-close", question: "How would you end the chat and go back to work?", salienceQuestion: "How would you close the chat about the {slot}?" },
      { id: "work-smalltalk-topic", question: "What safe topic would you pick at work?", salienceQuestion: "What safe {slot} would you bring up?" },
      { id: "work-smalltalk-listen", question: "How would you show you're listening?", salienceQuestion: "How would you react to the {slot} they share?" },
    ],
  },
  {
    id: "topic-work-job-calling-in-sick",
    labelEn: "Calling In Sick",
    labelVi: "Báo nghỉ ốm",
    category: "work-job",
    seedInputs: [
      "I am not feeling well and I cannot come in today.",
      "Hi, I've got a fever, so I need to take a sick day.",
    ],
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
      {
        id: "work-sick-take-a-day",
        label: "Take a sick day",
        note: "'Xin nghỉ ốm' becomes 'I want to off' if translated piece by piece. The natural phrase is 'take a sick day' or 'take the day off': 'I need to take a sick day today.'",
      },
      {
        id: "work-sick-feel-not-have",
        label: "I feel sick",
        note: "Vietnamese says 'tôi bị ốm' (literally 'I suffer sick'). English usually says 'I feel sick' or 'I'm not feeling well' — the verb is 'feel,' not 'have.' 'I have sick' isn't used.",
      },
      {
        id: "work-sick-vocab",
        label: "Vocabulary",
        note: "sick day = ngày nghỉ ốm; fever = sốt; flu = cúm. 'Call in sick' is the fixed phrase for reporting that you're sick.",
      },
      {
        id: "work-sick-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Em bị sốt, hôm nay xin nghỉ ạ.' ↔ EN: 'I have a fever, so I can't come in today.' One reason is enough.",
      },
    ],
    followUps: [
      { id: "work-sick-state", question: "How would you say you are not feeling well?", salienceQuestion: "How would you explain the {slot}?" },
      { id: "work-sick-day", question: "Which day or shift will you miss?", salienceQuestion: "Which shift is affected by the {slot}?" },
      { id: "work-sick-cover", question: "How would you ask what to do about your shift?", salienceQuestion: "What do you need to ask about the {slot}?" },
      { id: "work-sick-return", question: "How would you say when you hope to return?", salienceQuestion: "When can you return after the {slot}?" },
      { id: "work-sick-who", question: "Who should you tell first?", salienceQuestion: "Who do you notify about the {slot}?" },
      { id: "work-sick-note", question: "How would you ask if you need a doctor's note?", salienceQuestion: "What proof might they want for the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-paycheck-question",
    labelEn: "Asking About Paycheck Or Hours",
    labelVi: "Hỏi về lương hoặc giờ làm",
    category: "work-job",
    seedInputs: [
      "I have a question about my hours on my paycheck.",
      "It looks like some hours are missing from my pay this week.",
    ],
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
      {
        id: "work-paycheck-luong-pay",
        label: "Pay, paycheck, wage",
        note: "'Lương' covers everything about money for work. English splits it: 'pay' (general), 'paycheck' (the actual cheque or deposit), 'wage' (per hour), 'salary' (yearly). 'My paycheck' is the safe everyday word.",
      },
      {
        id: "work-paycheck-plural-hours",
        label: "Two hours, with -s",
        note: "'Thiếu hai giờ' has no plural ending, so 'two hour is missing' slips out. English adds -s: 'two hours are missing.' The small -s and 'are' show it's more than one.",
      },
      {
        id: "work-paycheck-vocab",
        label: "Vocabulary",
        note: "paycheck = phiếu lương; timesheet = bảng chấm công; wage = tiền công theo giờ. 'My pay looks short' means it seems less than expected.",
      },
      {
        id: "work-paycheck-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Hình như lương tuần này bị thiếu mấy giờ ạ.' ↔ EN: 'I think some hours are missing from this week's pay.'",
      },
    ],
    followUps: [
      { id: "work-paycheck-issue", question: "What is the paycheck question?", salienceQuestion: "What is unclear about the {slot}?" },
      { id: "work-paycheck-date", question: "Which date or week is it about?", salienceQuestion: "Which date matters for the {slot}?" },
      { id: "work-paycheck-proof", question: "What detail from your timesheet would you mention?", salienceQuestion: "What detail supports the {slot}?" },
      { id: "work-paycheck-next", question: "How would you ask what happens next?", salienceQuestion: "What next step do you need for the {slot}?" },
      { id: "work-paycheck-who", question: "Who handles payroll questions?", salienceQuestion: "Who should you ask about the {slot}?" },
      { id: "work-paycheck-calm", question: "How would you keep the tone friendly, not blaming?", salienceQuestion: "How would you raise the {slot} calmly?" },
    ],
  },
  {
    id: "topic-work-job-task-unclear",
    labelEn: "When A Task Is Unclear",
    labelVi: "Khi chưa rõ việc cần làm",
    category: "work-job",
    seedInputs: [
      "I want to make sure I understand this task.",
      "Sorry, could you explain that part again?",
    ],
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
      {
        id: "work-task-not-clear-yet",
        label: "I'm not clear on this yet",
        note: "'Tôi chưa rõ' often becomes 'I not clear' — dropping the verb 'to be.' English keeps it: 'I'm not clear on this part yet.' The small 'm ('am') is the piece that makes it sound complete.",
      },
      {
        id: "work-task-explain-to-me",
        label: "Explain it to me",
        note: "'Giải thích cho tôi' maps to 'explain me' if translated word-by-word. English says 'explain it to me' or 'walk me through it' — the 'to me' is part of the phrase.",
      },
      {
        id: "work-task-vocab",
        label: "Vocabulary",
        note: "task = công việc, nhiệm vụ; instructions = hướng dẫn; double-check = kiểm tra lại cho chắc.",
      },
      {
        id: "work-task-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Em muốn chắc là mình hiểu đúng việc này ạ.' ↔ EN: 'I just want to make sure I understand this correctly.'",
      },
    ],
    followUps: [
      { id: "work-task-part", question: "Which part of the task is unclear?", salienceQuestion: "What part of the {slot} is unclear?" },
      { id: "work-task-repeat", question: "How would you repeat what you understood?", salienceQuestion: "How would you repeat the {slot}?" },
      { id: "work-task-deadline", question: "What deadline or priority do you need to confirm?", salienceQuestion: "What deadline matters for the {slot}?" },
      { id: "work-task-check", question: "How would you ask if you are doing it correctly?", salienceQuestion: "How would you check the {slot}?" },
      { id: "work-task-example", question: "How would you ask for an example?", salienceQuestion: "How would you ask to see the {slot} done?" },
      { id: "work-task-write", question: "How would you ask to write the steps down?", salienceQuestion: "How would you note down the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-customer-problem",
    labelEn: "Explaining A Customer Problem",
    labelVi: "Nói về vấn đề với khách hàng",
    category: "work-job",
    seedInputs: [
      "A customer needs help with a return.",
      "There's a customer at the counter who wants to speak to a manager.",
    ],
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
      {
        id: "work-customer-khach-the",
        label: "The customer, a customer",
        note: "Vietnamese has no articles, so 'customer want return' feels complete. English needs 'a' for a new person ('A customer wants a return') and 'the' once you both know who ('The customer is still waiting').",
      },
      {
        id: "work-customer-wants-s",
        label: "The customer wants",
        note: "'Khách muốn đổi hàng' has no verb ending. In English, for one customer the verb takes -s: 'The customer wants to exchange it.' The little -s matches the single person.",
      },
      {
        id: "work-customer-vocab",
        label: "Vocabulary",
        note: "return = trả lại hàng; complaint = lời khiếu nại; charge = khoản tính tiền. 'Upset' is calmer to report than 'angry.'",
      },
      {
        id: "work-customer-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Có một khách đang cần hỗ trợ đổi trả hàng ạ.' ↔ EN: 'A customer needs help with a return.'",
      },
    ],
    followUps: [
      { id: "work-customer-issue", question: "What does the customer need help with?", salienceQuestion: "What is happening with the {slot}?" },
      { id: "work-customer-waiting", question: "How would you say the customer is waiting?", salienceQuestion: "How would you explain the {slot} politely?" },
      { id: "work-customer-help", question: "What help do you need from a manager?", salienceQuestion: "What help do you need for the {slot}?" },
      { id: "work-customer-update", question: "How would you update the customer calmly?", salienceQuestion: "How would you update someone about the {slot}?" },
      { id: "work-customer-calm", question: "How would you keep an upset customer calm?", salienceQuestion: "How would you settle the {slot}?" },
      { id: "work-customer-sorry", question: "How would you apologize without blaming anyone?", salienceQuestion: "How would you say sorry for the {slot}?" },
    ],
  },
  {
    id: "topic-work-job-time-off-request",
    labelEn: "Requesting Time Off",
    labelVi: "Xin nghỉ phép",
    category: "work-job",
    seedInputs: [
      "Can I request next Friday off?",
      "I'd like to take Friday, June 12 off, if that's okay.",
    ],
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
      {
        id: "work-timeoff-take-off",
        label: "Take a day off",
        note: "'Nghỉ một ngày' often becomes 'rest one day.' At work the phrase is 'take a day off': 'I'd like to take Friday off.' 'Take ... off' wraps around the day word.",
      },
      {
        id: "work-timeoff-could-i",
        label: "Could I, may I",
        note: "Vietnamese softens with tone and 'ạ' at the end. English softens with the opener: 'Could I take Friday off?' sounds warmer than 'I want Friday off.' The 'Could I' carries the politeness.",
      },
      {
        id: "work-timeoff-vocab",
        label: "Vocabulary",
        note: "time off = nghỉ phép; vacation day = ngày nghỉ; cover a shift = làm thay ca; personal day = ngày nghỉ việc riêng.",
      },
      {
        id: "work-timeoff-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Em xin nghỉ thứ Sáu tuần sau được không ạ?' ↔ EN: 'Can I take next Friday off?'",
      },
    ],
    followUps: [
      { id: "work-timeoff-date", question: "Which day do you want off?", salienceQuestion: "Which day do you need for the {slot}?" },
      { id: "work-timeoff-reason", question: "What short reason would you give, if any?", salienceQuestion: "What reason would you give for the {slot}?" },
      { id: "work-timeoff-coverage", question: "How would you ask about shift coverage?", salienceQuestion: "Who could cover the {slot}?" },
      { id: "work-timeoff-confirm", question: "How would you confirm the request was approved?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "work-timeoff-notice", question: "How far ahead would you ask?", salienceQuestion: "How much notice would you give for the {slot}?" },
      { id: "work-timeoff-thanks", question: "How would you thank your boss for approving it?", salienceQuestion: "How would you thank them for the {slot}?" },
    ],
  },
];
