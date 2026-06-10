import type { SpeakTopicLibraryEntry as SpeakTopic } from "../speakTopicLibrary";

export const introductionSpeakTopics: readonly SpeakTopic[] = [
  {
    id: "topic-introductions-new-neighbor",
    labelEn: "Meeting A New Neighbor",
    labelVi: "Gặp hàng xóm mới",
    category: "introductions",
    seedInputs: ["Hi, I just moved in upstairs."],
    detectionPatterns: [
      /\b(?:new neighbor|moved in|just moved|live upstairs|live downstairs|same building)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "intro-moved-in-preposition",
        label: "Natural place phrase",
        note: "Vietnamese learners may say only 'I live upstairs' when the useful real-life meaning is 'I just moved in upstairs.' Keep the practice on friendly context, not grammar correction.",
      },
      {
        id: "intro-name-order",
        label: "Name plus context",
        note: "A natural English introduction often gives name + situation together: 'I'm Linh. I just moved in upstairs.'",
      },
      {
        id: "intro-neighbor-first-name",
        label: "First names are normal",
        note: "With neighbors, English usually goes by first name right away: 'I'm Linh — nice to meet you.' You don't need a formal title like 'Mrs.'; offering your first name is the friendly default.",
      },
      {
        id: "intro-neighbor-offer-help",
        label: "A warm, open closing",
        note: "'Có gì cứ gọi em' maps to 'Let me know if you ever need anything.' A small open offer like that is a natural, low-pressure way to end a first hello with a neighbor.",
      },
    ],
    followUps: [
      { id: "intro-neighbor-name", question: "How would you say your name to the neighbor?", salienceQuestion: "How would you introduce yourself near the {slot}?" },
      { id: "intro-neighbor-place", question: "Which apartment or floor would you mention?", salienceQuestion: "How would you explain where the {slot} is?" },
      { id: "intro-neighbor-small-talk", question: "What friendly small question could you ask next?", salienceQuestion: "What friendly question could you ask about the {slot}?" },
      { id: "intro-neighbor-close", question: "How would you end the first chat politely?", salienceQuestion: "How would you close the chat about the {slot}?" },
    ],
  },
  {
    id: "topic-introductions-first-day-work",
    labelEn: "First Day At Work",
    labelVi: "Ngày đầu đi làm",
    category: "introductions",
    seedInputs: ["Hello, I am new here and today is my first day."],
    detectionPatterns: [
      /\b(?:first day at work|new here|new employee|start my job|meet my team|new coworker)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "intro-new-here",
        label: "Simple workplace opening",
        note: "The safe English frame is short and adult: 'I'm new here. Today is my first day.' It avoids over-formal translated openings.",
      },
      {
        id: "intro-role-context",
        label: "Role before detail",
        note: "VN learners often need practice saying role and team clearly before extra background, because English workplace introductions value quick context.",
      },
      {
        id: "intro-work-first-names",
        label: "First names with colleagues",
        note: "Vietnamese marks age and rank (anh/chị/em); most English-speaking workplaces use first names for everyone, even a manager, unless told otherwise. 'Hi, I'm Linh' to anyone on the team is normal, not rude.",
      },
      {
        id: "intro-work-ask-help",
        label: "Asking for help on day one",
        note: "'Could you show me where...?' or 'Would you mind helping me with...?' are warm, natural day-one requests. Asking is expected of a new hire — it reads as engaged, not weak.",
      },
    ],
    followUps: [
      { id: "intro-work-name-role", question: "How would you say your name and new role?", salienceQuestion: "How would you connect your name to the {slot}?" },
      { id: "intro-work-team", question: "Which team or person are you trying to find?", salienceQuestion: "Who can help you with the {slot}?" },
      { id: "intro-work-help", question: "What small help might you ask for on the first day?", salienceQuestion: "What help do you need for the {slot}?" },
      { id: "intro-work-thanks", question: "How would you thank a coworker after they help you?", salienceQuestion: "How would you thank someone for the {slot}?" },
    ],
  },
  {
    id: "topic-introductions-parent-at-school",
    labelEn: "Introducing Yourself At School",
    labelVi: "Giới thiệu với giáo viên ở trường",
    category: "introductions",
    seedInputs: ["Hi, I am Minh's mother. Nice to meet you."],
    detectionPatterns: [
      /\b(?:my son's teacher|my daughter's teacher|parent meeting|school office|i am .+ mother|i am .+ father)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "intro-child-relationship",
        label: "Child relationship phrase",
        note: "A direct, natural frame is 'I'm Minh's mother/father.' This is more useful than translating a longer Vietnamese family introduction.",
      },
      {
        id: "intro-teacher-politeness",
        label: "Warm but not too formal",
        note: "For school conversations, friendly English usually sounds simple: greeting, relationship, child's name, then one clear question.",
      },
      {
        id: "intro-school-teacher-title",
        label: "How to address the teacher",
        note: "In English you usually say 'Ms./Mr.' + last name (e.g. 'Ms. Carter'), not 'Teacher' as a title the way 'cô/thầy' is used in Vietnamese. If you don't know the name yet, a simple 'Hi' is fine to start.",
      },
      {
        id: "intro-school-parent-word",
        label: "Parent / guardian",
        note: "'Phụ huynh' is 'parent.' Schools also say 'parent or guardian' so any caregiver is included. 'I'm Minh's mother' or 'I'm Minh's guardian' both clearly say who you are.",
      },
    ],
    followUps: [
      { id: "intro-school-child", question: "How would you say your child's name clearly?", salienceQuestion: "How would you introduce your child with the {slot}?" },
      { id: "intro-school-reason", question: "Why are you talking with the teacher today?", salienceQuestion: "What should the teacher know about the {slot}?" },
      { id: "intro-school-question", question: "What one clear question would you ask the teacher?", salienceQuestion: "What question would you ask about the {slot}?" },
      { id: "intro-school-followup", question: "How would you ask for the best way to contact the teacher later?", salienceQuestion: "How would you follow up about the {slot}?" },
    ],
  },
] as const;

export const speakTopics = introductionSpeakTopics;
