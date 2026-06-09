import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D5SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-tech-worker-standup-meetings",
    labelEn: "Standup Meetings",
    labelVi: "Họp standup",
    category: "tech-worker-english",
    scenarioDescription:
      "The learner is a developer joining an English standup and needs to summarize yesterday's work, today's plan, blockers, tickets, and timing clearly.",
    aiRoleDefinition:
      "Act as an engineering teammate or scrum lead who asks concise follow-up questions about progress, blockers, ownership, and expected completion.",
    conversationDirections: [
      "Prompt the learner to give a short yesterday, today, blocker update.",
      "Ask which ticket, pull request, bug, feature, or deployment they are working on.",
      "Practice saying something is blocked without blaming another person.",
      "Ask for an ETA, dependency, next step, or help from a teammate.",
      "Practice clarifying whether work is in progress, ready for review, or done.",
      "End with one clear ownership statement and one next action.",
    ],
    warmthPatterns: [
      "Keep updates concise and teammate-friendly.",
      "Model calm blocker language: 'I'm waiting on X, so I can do Y next.'",
      "Treat accent and wording mistakes as normal workplace friction, not ability.",
    ],
    seedInputs: ["Yesterday I worked on the login bug. Today I will open a pull request."],
    detectionPatterns: [
      /\b(?:standup|scrum|blocker|blocked by|ticket|pull request|pr|in progress|ready for review|eta)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "tech-standup-work-on",
        label: "Work on a ticket",
        note: "Vietnamese learners may say 'work the ticket' or 'do ticket.' The common engineering phrase is 'work on a ticket,' 'work on a bug,' or 'work on the login flow.'",
      },
      {
        id: "tech-standup-blocked-by",
        label: "Blocked by, waiting on",
        note: "To avoid sounding like blame, English teams often say 'I'm blocked by the API change' or 'I'm waiting on the staging deploy,' not 'he blocks me.'",
      },
    ],
    followUps: [
      { id: "tech-standup-yesterday", question: "What did you finish or move forward yesterday?", salienceQuestion: "What happened with the {slot} yesterday?" },
      { id: "tech-standup-today", question: "What will you work on today?", salienceQuestion: "What is next for the {slot}?" },
      { id: "tech-standup-blocker", question: "Do you have any blockers?", salienceQuestion: "What is blocking the {slot}?" },
      { id: "tech-standup-help", question: "How would you ask for help from a teammate?", salienceQuestion: "Who can help with the {slot}?" },
      { id: "tech-standup-eta", question: "How would you give a careful ETA?", salienceQuestion: "When might the {slot} be ready?" },
    ],
  },
  {
    id: "topic-tech-worker-code-reviews-slack",
    labelEn: "Code Reviews And Slack",
    labelVi: "Review code và nhắn Slack",
    category: "tech-worker-english",
    scenarioDescription:
      "The learner is a developer writing Slack messages and code-review comments, asking for review, responding to feedback, and clarifying implementation choices.",
    aiRoleDefinition:
      "Act as a senior teammate who reviews code, asks practical questions, and helps the learner keep written engineering communication clear and collaborative.",
    conversationDirections: [
      "Practice asking for a code review with context, link, and urgency.",
      "Prompt the learner to respond to review comments without sounding defensive.",
      "Ask them to explain why they chose an approach, library, or API.",
      "Practice Slack updates for delays, fixes, deployments, and production issues.",
      "Use phrases for uncertainty: 'I think,' 'It looks like,' 'I need to verify.'",
      "End by confirming whether they will update code, add tests, or follow up later.",
    ],
    warmthPatterns: [
      "Model collaborative phrasing: 'Good point, I'll adjust that.'",
      "Keep Slack messages direct but not abrupt.",
      "Separate technical disagreement from personal tone.",
    ],
    seedInputs: ["Could you review my pull request when you have time?"],
    detectionPatterns: [
      /\b(?:code review|review my pull request|review my pr|slack|feedback comment|deployment update|production issue|add tests)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "tech-review-review-my-pr",
        label: "Review my PR",
        note: "Vietnamese can omit possessives naturally, but English work messages need them: 'Could you review my PR?' sounds clearer than 'review PR for me.'",
      },
      {
        id: "tech-slack-softener",
        label: "Direct, with a soft edge",
        note: "A Vietnamese message may rely on relationship and tone. In Slack, one small phrase like 'when you have time' or 'no rush' carries that warmth in writing.",
      },
    ],
    followUps: [
      { id: "tech-review-context", question: "What context should you include with the review request?", salienceQuestion: "What context helps with the {slot}?" },
      { id: "tech-review-feedback", question: "How would you respond to a reviewer suggestion?", salienceQuestion: "How would you respond about the {slot}?" },
      { id: "tech-review-choice", question: "How would you explain your implementation choice?", salienceQuestion: "Why did you choose the {slot}?" },
      { id: "tech-slack-delay", question: "How would you write a short delay update in Slack?", salienceQuestion: "What is delayed with the {slot}?" },
      { id: "tech-review-next", question: "How would you confirm the next code change?", salienceQuestion: "What will you change in the {slot}?" },
    ],
  },
  {
    id: "topic-tech-worker-explain-technical-problems",
    labelEn: "Explaining Technical Problems",
    labelVi: "Giải thích lỗi kỹ thuật",
    category: "tech-worker-english",
    scenarioDescription:
      "The learner is a Vietnamese developer explaining bugs, incidents, tradeoffs, or limitations to a product manager, customer, or non-technical stakeholder in English.",
    aiRoleDefinition:
      "Act as a non-technical stakeholder who asks what happened, who is affected, how serious it is, and what the team will do next.",
    conversationDirections: [
      "Ask the learner to start with user impact before technical root cause.",
      "Practice explaining a bug, outage, slow page, data issue, or failed deployment in plain English.",
      "Prompt the learner to separate what is known, what is likely, and what is still being checked.",
      "Ask for timeline, priority, workaround, and owner.",
      "Practice avoiding over-technical words unless the listener asks for detail.",
      "End with a concise status update and next communication time.",
    ],
    warmthPatterns: [
      "Use transparent but steady language: 'Here is what we know so far.'",
      "Avoid hiding uncertainty; phrase it responsibly.",
      "Protect trust by focusing on impact, fix path, and follow-up.",
    ],
    seedInputs: ["The checkout page is slow, and we are investigating the cause."],
    detectionPatterns: [
      /\b(?:technical problem|bug|outage|incident|root cause|workaround|investigating|affected users|failed deployment|slow page)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "tech-explain-user-impact",
        label: "Affected users",
        note: "Learners may translate directly as 'users are impacted by this bug' every time. For non-technical people, 'Some users cannot check out' is often clearer than the abstract phrase.",
      },
      {
        id: "tech-explain-investigate",
        label: "Investigating the cause",
        note: "Vietnamese can say 'check the reason.' Engineering English usually says 'investigate the cause,' 'look into it,' or 'check the logs.'",
      },
    ],
    followUps: [
      { id: "tech-explain-impact", question: "Who is affected, and what can they not do?", salienceQuestion: "Who is affected by the {slot}?" },
      { id: "tech-explain-known", question: "What do you know so far?", salienceQuestion: "What is known about the {slot}?" },
      { id: "tech-explain-workaround", question: "Is there a workaround you can explain simply?", salienceQuestion: "What workaround exists for the {slot}?" },
      { id: "tech-explain-owner", question: "Who owns the next step?", salienceQuestion: "Who owns the {slot} next?" },
      { id: "tech-explain-update", question: "When will you give the next update?", salienceQuestion: "When will you update people about the {slot}?" },
    ],
  },
] as const satisfies readonly D5SpeakTopic[];
