import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-school-parent-talk-to-teacher",
    labelEn: "Talking To Your Child's Teacher",
    labelVi: "Nói chuyện với giáo viên của con",
    category: "school-parent",
    seedInputs: ["Excuse me, I am Bao's mother. Can I ask you something?"],
    detectionPatterns: [
      /\b(?:my child's teacher|talk to the teacher|ask the teacher|i am .+ mother|i am .+ father|excuse me teacher)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-teacher-vocative",
        label: "Opening without 'Teacher' as a name",
        note: "Vietnamese parents often start with 'Teacher, ...' because 'Cô' or 'Thầy' is the natural address. In English a warm opening is usually 'Excuse me' or the teacher's name, then the question. This is about a friendly start, not correcting the word.",
      },
      {
        id: "sp-teacher-child-word",
        label: "Saying son or daughter",
        note: "'Con tôi' translates to 'my child', but in school chats English speakers often say 'my son' or 'my daughter' with the child's name. Practising the warmer, clearer version helps the teacher follow you.",
      },
    ],
    followUps: [
      { id: "sp-talk-open", question: "How would you politely get the teacher's attention?", salienceQuestion: "How would you open the chat about the {slot}?" },
      { id: "sp-talk-child", question: "How would you say which child is yours?", salienceQuestion: "How would you mention your {slot} clearly?" },
      { id: "sp-talk-reason", question: "What one thing do you want to ask the teacher?", salienceQuestion: "What would you ask the teacher about the {slot}?" },
      { id: "sp-talk-close", question: "How would you thank the teacher before you leave?", salienceQuestion: "How would you close the talk about the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-conference",
    labelEn: "Parent-Teacher Meeting",
    labelVi: "Buổi họp phụ huynh",
    category: "school-parent",
    seedInputs: ["I came for the parent-teacher meeting about my daughter."],
    detectionPatterns: [
      /\b(?:parent-teacher meeting|parent teacher meeting|parent meeting|conference|report card meeting|meet the teacher)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-conf-study-word",
        label: "Asking about 'studies'",
        note: "'Việc học của con' often becomes 'the study of my child'. A natural English version is 'how my daughter is doing' or 'her studies'. Keeping the question short helps a busy meeting stay friendly.",
      },
      {
        id: "sp-conf-listen-first",
        label: "One clear question first",
        note: "In Vietnamese it can feel polite to wait quietly, but English meetings move fast. Coming with one clear question ('How is she doing in math?') makes the short time feel calm and useful.",
      },
    ],
    followUps: [
      { id: "sp-conf-subject", question: "Which subject do you most want to ask about?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "sp-conf-progress", question: "How would you ask how your child is doing?", salienceQuestion: "How would you ask about progress in the {slot}?" },
      { id: "sp-conf-help", question: "What help would you ask the teacher for at home?", salienceQuestion: "What help do you need with the {slot}?" },
      { id: "sp-conf-next", question: "How would you agree on a next step?", salienceQuestion: "What is the next step for the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-absence-note",
    labelEn: "Writing An Absence Note",
    labelVi: "Viết giấy xin nghỉ học",
    category: "school-parent",
    seedInputs: ["I want to write a note because my son will be absent tomorrow."],
    detectionPatterns: [
      /\b(?:absence note|absent tomorrow|excuse note|write a note|miss school|will not be at school|day off school)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-absence-paper-word",
        label: "Note instead of 'paper'",
        note: "'Viết giấy cho cô' can come out as 'write a paper for teacher'. In English the short word is 'a note'. Practising 'I'm writing a note about...' makes the message easy for the school to read.",
      },
      {
        id: "sp-absence-reason-frame",
        label: "Simple reason frame",
        note: "A natural absence note is short: who, when, why. 'My son Bao will be absent on Friday for a family event.' Vietnamese learners sometimes add long apologies; one warm line is enough.",
      },
    ],
    followUps: [
      { id: "sp-absence-who", question: "How would you say which child and which day?", salienceQuestion: "How would you name your {slot} and the day?" },
      { id: "sp-absence-reason", question: "What simple reason would you give?", salienceQuestion: "What reason would you give for the {slot}?" },
      { id: "sp-absence-makeup", question: "How would you ask about missed work?", salienceQuestion: "How would you ask about work missed during the {slot}?" },
      { id: "sp-absence-sign", question: "How would you politely sign off the note?", salienceQuestion: "How would you close the note about the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-pickup",
    labelEn: "Picking Up Your Child",
    labelVi: "Đón con ở trường",
    category: "school-parent",
    seedInputs: ["I am here to pick up my daughter from her classroom."],
    detectionPatterns: [
      /\b(?:pick up my child|pick up my son|pick up my daughter|here to pick up|collect my child|pickup time|after school pickup)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-pickup-fetch-word",
        label: "'Pick up' for đón",
        note: "'Đón con' is naturally 'pick up my child', but learners sometimes say 'take my child' or 'get my child'. 'Pick up' is the warm, everyday phrase the school staff expect at the door.",
      },
      {
        id: "sp-pickup-who-frame",
        label: "Naming the child and class",
        note: "At pickup, English staff often ask for the child's name and class. Having a short answer ready ('Lan, in Ms. Tran's class') keeps the moment calm and friendly.",
      },
    ],
    followUps: [
      { id: "sp-pickup-child", question: "How would you say which child you are picking up?", salienceQuestion: "How would you name the {slot} you are picking up?" },
      { id: "sp-pickup-where", question: "Where do you need to wait or go?", salienceQuestion: "Where is the {slot} for pickup?" },
      { id: "sp-pickup-time", question: "How would you check the right pickup time?", salienceQuestion: "How would you ask about the {slot} time?" },
      { id: "sp-pickup-confirm", question: "How would you let staff know you have arrived?", salienceQuestion: "How would you confirm you are here for the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-sick-note",
    labelEn: "Telling The School Your Child Is Sick",
    labelVi: "Báo trường con bị ốm",
    category: "school-parent",
    seedInputs: ["My son is sick today, so he cannot come to school."],
    detectionPatterns: [
      /\b(?:my child is sick|my son is sick|my daughter is sick|cannot come to school|stay home today|has a fever|not feeling well today)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-sick-cannot-frame",
        label: "Can't come to school",
        note: "'Con tôi không đi học được' often becomes 'my child cannot go school'. The warm, natural frame is 'he can't come to school today'. Short and clear is best when you are calling early.",
      },
      {
        id: "sp-sick-symptom-simple",
        label: "One simple symptom",
        note: "English schools usually want one simple reason: 'a fever', 'a bad cold', 'a stomachache'. Vietnamese learners sometimes describe symptoms in long detail; one clear word is enough.",
      },
    ],
    followUps: [
      { id: "sp-sick-who", question: "How would you say which child is unwell?", salienceQuestion: "How would you name your {slot} when you call?" },
      { id: "sp-sick-symptom", question: "What simple symptom would you mention?", salienceQuestion: "How would you describe the {slot} simply?" },
      { id: "sp-sick-howlong", question: "How would you say how long he might be out?", salienceQuestion: "How long will the {slot} keep your child home?" },
      { id: "sp-sick-work", question: "How would you ask about missed lessons?", salienceQuestion: "How would you ask about lessons during the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-homework-help",
    labelEn: "Asking About Homework",
    labelVi: "Hỏi về bài tập về nhà",
    category: "school-parent",
    seedInputs: ["My daughter has homework, but I do not understand it."],
    detectionPatterns: [
      /\b(?:homework help|help with homework|understand the homework|the assignment is|homework is due|do the homework together)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-homework-help-with",
        label: "Help with the homework",
        note: "'Giúp bài tập' can become 'help homework'. The everyday English frame is 'help with the homework'. Practising 'Can you help me understand the homework?' makes asking feel easy, not shy.",
      },
      {
        id: "sp-homework-admit-ok",
        label: "It is fine to say you are unsure",
        note: "Many parents feel uneasy saying they don't understand. In English it is normal and welcome to say 'I'm not sure how to help her with this.' Teachers expect and respect that honest, warm question.",
      },
    ],
    followUps: [
      { id: "sp-homework-subject", question: "Which subject is the homework about?", salienceQuestion: "What is hard about the {slot} homework?" },
      { id: "sp-homework-part", question: "Which part is confusing?", salienceQuestion: "What part of the {slot} is confusing?" },
      { id: "sp-homework-ask", question: "How would you ask the teacher for a tip?", salienceQuestion: "How would you ask for help with the {slot}?" },
      { id: "sp-homework-time", question: "How would you ask when it is due?", salienceQuestion: "When is the {slot} due?" },
    ],
  },
  {
    id: "topic-school-parent-permission-slip",
    labelEn: "Signing A Permission Slip",
    labelVi: "Ký giấy đồng ý cho con",
    category: "school-parent",
    seedInputs: ["I need to sign the permission slip for the school trip."],
    detectionPatterns: [
      /\b(?:permission slip|permission form|sign the form for|consent form|field trip form|allow my child to go)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-permission-sign-frame",
        label: "Sign the form",
        note: "'Ký giấy' is naturally 'sign the form' or 'sign the slip'. Learners sometimes say 'write my name on paper'. Practising 'Where do I sign the permission slip?' keeps the office chat quick.",
      },
      {
        id: "sp-permission-allow-frame",
        label: "Giving permission warmly",
        note: "'Cho phép con đi' becomes 'I allow my child to go' or simply 'Yes, she can go.' A short, friendly yes is all English forms need; long formal wording is not expected.",
      },
    ],
    followUps: [
      { id: "sp-permission-event", question: "What event is the slip for?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "sp-permission-where", question: "How would you ask where to sign?", salienceQuestion: "Where do you sign for the {slot}?" },
      { id: "sp-permission-detail", question: "What detail would you check before signing?", salienceQuestion: "What detail matters for the {slot}?" },
      { id: "sp-permission-return", question: "How would you ask when to return it?", salienceQuestion: "When should you return the {slot} form?" },
    ],
  },
  {
    id: "topic-school-parent-behavior",
    labelEn: "Talking About Your Child's Behavior",
    labelVi: "Nói về hành vi của con",
    category: "school-parent",
    seedInputs: ["The teacher wants to talk about my son's behavior in class."],
    detectionPatterns: [
      /\b(?:my child's behavior|behavior in class|got in trouble|talk about behavior|how he behaves|how she behaves|listens in class)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-behavior-calm-frame",
        label: "Asking calmly what happened",
        note: "It is natural to feel worried or tense. A warm English opener is 'Can you tell me what happened?' This keeps the talk calm and shows you and the teacher are on the same side.",
      },
      {
        id: "sp-behavior-home-frame",
        label: "Offering to help at home",
        note: "'Tôi sẽ nói chuyện với con ở nhà' becomes 'I'll talk to him at home.' A short offer to help, instead of long apologies, is the friendly English pattern teachers appreciate.",
      },
    ],
    followUps: [
      { id: "sp-behavior-what", question: "How would you ask what happened?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "sp-behavior-when", question: "How would you ask when it happens most?", salienceQuestion: "When does the {slot} happen most?" },
      { id: "sp-behavior-home", question: "How would you offer to help at home?", salienceQuestion: "How would you help with the {slot} at home?" },
      { id: "sp-behavior-followup", question: "How would you ask the teacher to keep you updated?", salienceQuestion: "How would you follow up on the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-late-dropoff",
    labelEn: "Arriving Late For Drop-Off",
    labelVi: "Đưa con đến trường muộn",
    category: "school-parent",
    seedInputs: ["Sorry, we are late this morning for drop-off."],
    detectionPatterns: [
      /\b(?:late this morning|late for drop-off|late drop off|we are late|sorry we are late|arrived late at school|sign in late)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-late-short-sorry",
        label: "A short, warm sorry",
        note: "Vietnamese politeness can lead to long apologies. In English a short 'Sorry we're late this morning' is warm and enough. Then a quick reason if needed.",
      },
      {
        id: "sp-late-signin-frame",
        label: "Signing in late",
        note: "Many schools ask late children to 'sign in' at the office. Learners may not know this phrase. Practising 'Do we need to sign in?' makes the late morning feel less stressful.",
      },
    ],
    followUps: [
      { id: "sp-late-apolog", question: "How would you give a short, warm sorry?", salienceQuestion: "How would you say sorry about the {slot}?" },
      { id: "sp-late-reason", question: "What short reason would you give?", salienceQuestion: "What reason would you give for the {slot}?" },
      { id: "sp-late-signin", question: "How would you ask if you must sign in?", salienceQuestion: "How would you ask about signing in for the {slot}?" },
      { id: "sp-late-class", question: "How would you ask where your child should go now?", salienceQuestion: "Where should your child go after the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-early-pickup",
    labelEn: "Picking Up Your Child Early",
    labelVi: "Đón con về sớm",
    category: "school-parent",
    seedInputs: ["I need to pick up my son early for a doctor's appointment."],
    detectionPatterns: [
      /\b(?:pick up .* early|leave school early|early pickup|take my child early|appointment this afternoon|out of class early)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-early-reason-frame",
        label: "A simple reason for leaving early",
        note: "'Đón con về sớm' becomes 'pick him up early'. English staff usually just want a short reason: 'a doctor's appointment'. One clear line is enough; long explanations are not expected.",
      },
      {
        id: "sp-early-office-frame",
        label: "Checking out at the office",
        note: "Many schools ask you to 'check out' your child at the office. Learners may not know this phrase. Practising 'I'm here to check out my son early' keeps the moment smooth.",
      },
    ],
    followUps: [
      { id: "sp-early-child", question: "How would you say which child you are taking?", salienceQuestion: "How would you name the {slot} for early pickup?" },
      { id: "sp-early-reason", question: "What short reason would you give?", salienceQuestion: "What reason would you give for the {slot}?" },
      { id: "sp-early-time", question: "What time would you ask to collect your child?", salienceQuestion: "What time is the {slot}?" },
      { id: "sp-early-office", question: "How would you ask where to check out?", salienceQuestion: "Where do you check out for the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-supplies",
    labelEn: "Asking What Your Child Needs To Bring",
    labelVi: "Hỏi con cần mang gì đến trường",
    category: "school-parent",
    seedInputs: ["What does my daughter need to bring for class tomorrow?"],
    detectionPatterns: [
      /\b(?:what to bring|need to bring|school supplies|bring to class|what does .* need|notebook and pencil|bring tomorrow)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-supplies-bring-frame",
        label: "Bring, not 'take'",
        note: "'Mang đến trường' can become 'take to school'. When talking about the school's side, English uses 'bring': 'What should she bring tomorrow?' Practising this makes the question clear to staff.",
      },
      {
        id: "sp-supplies-list-frame",
        label: "Asking for a short list",
        note: "Learners sometimes ask item by item. A warm, efficient English question is 'Is there a list of what she needs?' This gets a clear answer in one go.",
      },
    ],
    followUps: [
      { id: "sp-supplies-what", question: "What would you ask your child needs to bring?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "sp-supplies-when", question: "How would you ask which day it is needed?", salienceQuestion: "When is the {slot} needed?" },
      { id: "sp-supplies-list", question: "How would you ask for a full list?", salienceQuestion: "How would you ask for a list of the {slot}?" },
      { id: "sp-supplies-where", question: "How would you ask where to get it?", salienceQuestion: "Where can you get the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-contact-teacher",
    labelEn: "Finding The Best Way To Reach The Teacher",
    labelVi: "Hỏi cách liên lạc với giáo viên",
    category: "school-parent",
    seedInputs: ["What is the best way to contact you if I have a question?"],
    detectionPatterns: [
      /\b(?:best way to contact|how can i reach you|email the teacher|reach the teacher|contact you later|send a message to the teacher)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "sp-contact-reach-frame",
        label: "Best way to reach you",
        note: "'Liên lạc với cô bằng cách nào' becomes 'What's the best way to reach you?' Learners sometimes say 'how I contact you'. The warm, ready-made phrase keeps the door open for later questions.",
      },
      {
        id: "sp-contact-channel-frame",
        label: "Naming the channel",
        note: "English schools may offer email, an app, or a note in the bag. Practising 'Is email okay?' or 'Should I write a note?' helps you choose a way that feels comfortable.",
      },
    ],
    followUps: [
      { id: "sp-contact-way", question: "How would you ask the best way to reach the teacher?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "sp-contact-when", question: "How would you ask the best time to contact them?", salienceQuestion: "When is a good time for the {slot}?" },
      { id: "sp-contact-channel", question: "How would you ask if email or a note is okay?", salienceQuestion: "Which {slot} works best for the teacher?" },
      { id: "sp-contact-confirm", question: "How would you confirm you understood?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
] as const;
