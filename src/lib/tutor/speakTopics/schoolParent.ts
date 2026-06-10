import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// School & parent theme. Everyday school-communication language for a Vietnamese
// parent. Deterministic / client-side; copy is warm, adult, low-shame.
// l1InterferenceNotes name genuine Vietnamese→English interference as friendly
// context, never a mistake to call out. A8 D5-B deepening: each topic carries
// 4 L1 interference notes, 6 conversation directions (followUps), and 3 seeds.
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-school-parent-talk-to-teacher",
    labelEn: "Talking To Your Child's Teacher",
    labelVi: "Nói chuyện với giáo viên của con",
    category: "school-parent",
    seedInputs: [
      "Excuse me, I am Bao's mother. Can I ask you something?",
      "Hi, I'm Lan's dad — do you have a quick minute?",
      "Sorry to bother you — could I ask about my daughter?",
    ],
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
      {
        id: "sp-teacher-do-you-have-minute",
        label: "'Do you have a minute?'",
        note: "A soft opener like 'Do you have a minute?' checks the teacher's timing politely. Vietnamese warmth carries over well; this English phrase just gives it a frame.",
      },
      {
        id: "sp-teacher-first-name-ok",
        label: "Using the teacher's name is fine",
        note: "In many schools 'Ms. Tran' or even a first name is normal and not rude. Vietnamese 'Cô/Thầy' feels safer, but the teacher's name plus your question is friendly and clear.",
      },
    ],
    followUps: [
      { id: "sp-talk-open", question: "How would you politely get the teacher's attention?", salienceQuestion: "How would you open the chat about the {slot}?" },
      { id: "sp-talk-child", question: "How would you say which child is yours?", salienceQuestion: "How would you mention your {slot} clearly?" },
      { id: "sp-talk-reason", question: "What one thing do you want to ask the teacher?", salienceQuestion: "What would you ask the teacher about the {slot}?" },
      { id: "sp-talk-close", question: "How would you thank the teacher before you leave?", salienceQuestion: "How would you close the talk about the {slot}?" },
      { id: "sp-talk-timing", question: "How would you check it's a good moment to talk?", salienceQuestion: "When would you raise the {slot}?" },
      { id: "sp-talk-writing", question: "How would you ask to follow up by email later?", salienceQuestion: "How would you continue the {slot} in writing?" },
    ],
  },
  {
    id: "topic-school-parent-conference",
    labelEn: "Parent-Teacher Meeting",
    labelVi: "Buổi họp phụ huynh",
    category: "school-parent",
    seedInputs: [
      "I came for the parent-teacher meeting about my daughter.",
      "I'm here for the parent-teacher meeting for Minh.",
      "I'd like to hear how my son is doing this term.",
    ],
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
      {
        id: "sp-conf-grades-word",
        label: "'Grades' and 'doing well'",
        note: "'Điểm số' is 'grades' and 'học tốt' is 'doing well'. Asking 'Is she doing well in English?' is warmer and clearer than translating each word on its own.",
      },
      {
        id: "sp-conf-write-down",
        label: "It's okay to take notes",
        note: "Bringing a short list of questions and writing the answers down is normal and welcome. A quick 'Can I write that down?' keeps a fast meeting useful and calm.",
      },
    ],
    followUps: [
      { id: "sp-conf-subject", question: "Which subject do you most want to ask about?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "sp-conf-progress", question: "How would you ask how your child is doing?", salienceQuestion: "How would you ask about progress in the {slot}?" },
      { id: "sp-conf-help", question: "What help would you ask the teacher for at home?", salienceQuestion: "What help do you need with the {slot}?" },
      { id: "sp-conf-next", question: "How would you agree on a next step?", salienceQuestion: "What is the next step for the {slot}?" },
      { id: "sp-conf-strength", question: "How would you ask what your child is good at?", salienceQuestion: "What is your child strong in for the {slot}?" },
      { id: "sp-conf-home-plan", question: "How would you ask what to practice at home?", salienceQuestion: "What could you do at home for the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-absence-note",
    labelEn: "Writing An Absence Note",
    labelVi: "Viết giấy xin nghỉ học",
    category: "school-parent",
    seedInputs: [
      "I want to write a note because my son will be absent tomorrow.",
      "My daughter Mai will be absent on Monday.",
      "Please excuse my son from school this Friday.",
    ],
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
      {
        id: "sp-absence-excuse-word",
        label: "'Please excuse' is the set phrase",
        note: "Absence notes often open 'Please excuse [name] from school on [day].' 'Xin phép cho con nghỉ' maps onto it — a ready-made frame the office recognises right away.",
      },
      {
        id: "sp-absence-date-clear",
        label: "Put the date clearly",
        note: "Naming the exact day — 'on Friday, June 12' — helps the office update the record. Vietnamese may lean on 'tomorrow'; an exact date reads more clearly in a written note.",
      },
    ],
    followUps: [
      { id: "sp-absence-who", question: "How would you say which child and which day?", salienceQuestion: "How would you name your {slot} and the day?" },
      { id: "sp-absence-reason", question: "What simple reason would you give?", salienceQuestion: "What reason would you give for the {slot}?" },
      { id: "sp-absence-makeup", question: "How would you ask about missed work?", salienceQuestion: "How would you ask about work missed during the {slot}?" },
      { id: "sp-absence-sign", question: "How would you politely sign off the note?", salienceQuestion: "How would you close the note about the {slot}?" },
      { id: "sp-absence-return", question: "How would you say when your child will be back?", salienceQuestion: "When will your child return after the {slot}?" },
      { id: "sp-absence-deliver", question: "How would you ask how to send the note?", salienceQuestion: "How should you hand in the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-pickup",
    labelEn: "Picking Up Your Child",
    labelVi: "Đón con ở trường",
    category: "school-parent",
    seedInputs: [
      "I am here to pick up my daughter from her classroom.",
      "Hi, I'm here to pick up Lan from Ms. Tran's class.",
      "I've come to collect my son. He's in grade two.",
    ],
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
      {
        id: "sp-pickup-id-frame",
        label: "Showing ID at pickup",
        note: "Some schools ask to see ID before releasing a child. 'Here's my ID' while handing it over is all that's needed — a safety step, not a problem.",
      },
      {
        id: "sp-pickup-someone-else",
        label: "If someone else collects",
        note: "If a relative picks up instead, schools want to know in advance: 'My sister will pick him up today.' Naming the person keeps your child safe.",
      },
    ],
    followUps: [
      { id: "sp-pickup-child", question: "How would you say which child you are picking up?", salienceQuestion: "How would you name the {slot} you are picking up?" },
      { id: "sp-pickup-where", question: "Where do you need to wait or go?", salienceQuestion: "Where is the {slot} for pickup?" },
      { id: "sp-pickup-time", question: "How would you check the right pickup time?", salienceQuestion: "How would you ask about the {slot} time?" },
      { id: "sp-pickup-confirm", question: "How would you let staff know you have arrived?", salienceQuestion: "How would you confirm you are here for the {slot}?" },
      { id: "sp-pickup-id", question: "How would you offer your ID if asked?", salienceQuestion: "How would you show who you are for the {slot}?" },
      { id: "sp-pickup-someone", question: "How would you say a relative is collecting today?", salienceQuestion: "Who else might handle the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-sick-note",
    labelEn: "Telling The School Your Child Is Sick",
    labelVi: "Báo trường con bị ốm",
    category: "school-parent",
    seedInputs: [
      "My son is sick today, so he cannot come to school.",
      "Hi, my daughter has a fever and won't be in today.",
      "My son has a bad cold, so he's staying home.",
    ],
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
      {
        id: "sp-sick-call-early",
        label: "Calling early in the morning",
        note: "Schools like to hear early: 'I'm calling to let you know...' Vietnamese 'báo sớm' is valued too — a quick morning call before class is plenty.",
      },
      {
        id: "sp-sick-return-when",
        label: "Saying when he'll be back",
        note: "Adding 'I hope he'll be back tomorrow' helps the teacher plan. A simple time word is enough; no long explanation is needed.",
      },
    ],
    followUps: [
      { id: "sp-sick-who", question: "How would you say which child is unwell?", salienceQuestion: "How would you name your {slot} when you call?" },
      { id: "sp-sick-symptom", question: "What simple symptom would you mention?", salienceQuestion: "How would you describe the {slot} simply?" },
      { id: "sp-sick-howlong", question: "How would you say how long he might be out?", salienceQuestion: "How long will the {slot} keep your child home?" },
      { id: "sp-sick-work", question: "How would you ask about missed lessons?", salienceQuestion: "How would you ask about lessons during the {slot}?" },
      { id: "sp-sick-channel", question: "How would you ask the right way to report it — call or app?", salienceQuestion: "How should you report the {slot}?" },
      { id: "sp-sick-longer", question: "How would you ask if he should rest at home longer?", salienceQuestion: "How long should your child rest after the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-homework-help",
    labelEn: "Asking About Homework",
    labelVi: "Hỏi về bài tập về nhà",
    category: "school-parent",
    seedInputs: [
      "My daughter has homework, but I do not understand it.",
      "My son doesn't understand his math homework.",
      "Could you explain how to help with this worksheet?",
    ],
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
      {
        id: "sp-homework-explain-to",
        label: "'Explain it to me'",
        note: "English adds 'to me': 'Could you explain it to me?' Vietnamese puts the person right after the verb, so 'explain me' feels natural — 'explain it to me' is the smooth form.",
      },
      {
        id: "sp-homework-due-when",
        label: "Asking when it's due",
        note: "'Khi nào nộp' is 'When is it due?' Knowing the due date helps you plan calm time to help your child at home.",
      },
    ],
    followUps: [
      { id: "sp-homework-subject", question: "Which subject is the homework about?", salienceQuestion: "What is hard about the {slot} homework?" },
      { id: "sp-homework-part", question: "Which part is confusing?", salienceQuestion: "What part of the {slot} is confusing?" },
      { id: "sp-homework-ask", question: "How would you ask the teacher for a tip?", salienceQuestion: "How would you ask for help with the {slot}?" },
      { id: "sp-homework-time", question: "How would you ask when it is due?", salienceQuestion: "When is the {slot} due?" },
      { id: "sp-homework-resource", question: "How would you ask for a website or example to help?", salienceQuestion: "What could help you with the {slot}?" },
      { id: "sp-homework-routine", question: "How would you ask about a good homework routine?", salienceQuestion: "How should your child handle the {slot} each day?" },
    ],
  },
  {
    id: "topic-school-parent-permission-slip",
    labelEn: "Signing A Permission Slip",
    labelVi: "Ký giấy đồng ý cho con",
    category: "school-parent",
    seedInputs: [
      "I need to sign the permission slip for the school trip.",
      "Where do I sign the field trip form?",
      "Yes, my daughter can go on the school trip.",
    ],
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
      {
        id: "sp-permission-due-frame",
        label: "Asking the return date",
        note: "Forms have a deadline: 'When do I need to return this by?' 'Hạn nộp' maps to 'the due date' — worth checking so the slip isn't late.",
      },
      {
        id: "sp-permission-cost-frame",
        label: "Asking about cost",
        note: "Trips sometimes have a fee. 'Is there a cost for the trip?' is a normal, practical question to ask before you sign the slip.",
      },
    ],
    followUps: [
      { id: "sp-permission-event", question: "What event is the slip for?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "sp-permission-where", question: "How would you ask where to sign?", salienceQuestion: "Where do you sign for the {slot}?" },
      { id: "sp-permission-detail", question: "What detail would you check before signing?", salienceQuestion: "What detail matters for the {slot}?" },
      { id: "sp-permission-return", question: "How would you ask when to return it?", salienceQuestion: "When should you return the {slot} form?" },
      { id: "sp-permission-cost", question: "How would you ask if there's a fee?", salienceQuestion: "How would you ask about the cost of the {slot}?" },
      { id: "sp-permission-bring", question: "How would you ask what your child should bring?", salienceQuestion: "What should your child bring for the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-behavior",
    labelEn: "Talking About Your Child's Behavior",
    labelVi: "Nói về hành vi của con",
    category: "school-parent",
    seedInputs: [
      "The teacher wants to talk about my son's behavior in class.",
      "The teacher asked to talk about my son's behavior.",
      "I'd like to understand what's been happening in class.",
    ],
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
      {
        id: "sp-behavior-on-same-side",
        label: "Showing you're on the same side",
        note: "A warm line — 'Thank you for telling me; let's work on it together' — sets a partnership tone. Vietnamese respect for teachers carries over well here.",
      },
      {
        id: "sp-behavior-ask-specific",
        label: "Asking for one specific example",
        note: "'Can you give me an example?' helps you understand. A concrete moment is easier to act on than a general worry, and it keeps the talk practical.",
      },
    ],
    followUps: [
      { id: "sp-behavior-what", question: "How would you ask what happened?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "sp-behavior-when", question: "How would you ask when it happens most?", salienceQuestion: "When does the {slot} happen most?" },
      { id: "sp-behavior-home", question: "How would you offer to help at home?", salienceQuestion: "How would you help with the {slot} at home?" },
      { id: "sp-behavior-followup", question: "How would you ask the teacher to keep you updated?", salienceQuestion: "How would you follow up on the {slot}?" },
      { id: "sp-behavior-example", question: "How would you ask for a specific example?", salienceQuestion: "What example shows the {slot}?" },
      { id: "sp-behavior-plan", question: "How would you agree on a plan with the teacher?", salienceQuestion: "What plan fits the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-late-dropoff",
    labelEn: "Arriving Late For Drop-Off",
    labelVi: "Đưa con đến trường muộn",
    category: "school-parent",
    seedInputs: [
      "Sorry, we are late this morning for drop-off.",
      "Sorry we're late — the bus was delayed.",
      "We're a few minutes late this morning.",
    ],
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
      {
        id: "sp-late-reason-short",
        label: "A short reason is enough",
        note: "'Traffic was bad' or 'the bus was late' is plenty. Vietnamese politeness may add more; one short reason keeps the morning moving.",
      },
      {
        id: "sp-late-where-go",
        label: "Asking where to go now",
        note: "After signing in, ask 'Where should she go now?' Classes may have started, so a quick check sends your child to the right room.",
      },
    ],
    followUps: [
      { id: "sp-late-apolog", question: "How would you give a short, warm sorry?", salienceQuestion: "How would you say sorry about the {slot}?" },
      { id: "sp-late-reason", question: "What short reason would you give?", salienceQuestion: "What reason would you give for the {slot}?" },
      { id: "sp-late-signin", question: "How would you ask if you must sign in?", salienceQuestion: "How would you ask about signing in for the {slot}?" },
      { id: "sp-late-class", question: "How would you ask where your child should go now?", salienceQuestion: "Where should your child go after the {slot}?" },
      { id: "sp-late-tomorrow", question: "How would you say you'll be on time tomorrow?", salienceQuestion: "How would you reassure about the next {slot}?" },
      { id: "sp-late-missed", question: "How would you ask what your child missed?", salienceQuestion: "What did your child miss during the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-early-pickup",
    labelEn: "Picking Up Your Child Early",
    labelVi: "Đón con về sớm",
    category: "school-parent",
    seedInputs: [
      "I need to pick up my son early for a doctor's appointment.",
      "I need to take my daughter out at two for an appointment.",
      "Could I pick up my son a bit early today?",
    ],
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
      {
        id: "sp-early-notice-frame",
        label: "Telling them in advance",
        note: "A quick heads-up helps: 'I'll be picking him up at two today.' Vietnamese 'báo trước' is appreciated, and the office can have your child ready.",
      },
      {
        id: "sp-early-sign-out",
        label: "'Sign out' at the office",
        note: "Schools often ask you to 'sign out' a child who leaves early. 'Do I sign out here?' is the handy phrase to know at the front desk.",
      },
    ],
    followUps: [
      { id: "sp-early-child", question: "How would you say which child you are taking?", salienceQuestion: "How would you name the {slot} for early pickup?" },
      { id: "sp-early-reason", question: "What short reason would you give?", salienceQuestion: "What reason would you give for the {slot}?" },
      { id: "sp-early-time", question: "What time would you ask to collect your child?", salienceQuestion: "What time is the {slot}?" },
      { id: "sp-early-office", question: "How would you ask where to check out?", salienceQuestion: "Where do you check out for the {slot}?" },
      { id: "sp-early-notice", question: "How would you give the school advance notice?", salienceQuestion: "How would you warn about the {slot} early?" },
      { id: "sp-early-back", question: "How would you say if your child returns after?", salienceQuestion: "Will your child come back after the {slot}?" },
    ],
  },
  {
    id: "topic-school-parent-supplies",
    labelEn: "Asking What Your Child Needs To Bring",
    labelVi: "Hỏi con cần mang gì đến trường",
    category: "school-parent",
    seedInputs: [
      "What does my daughter need to bring for class tomorrow?",
      "Does my son need to bring anything special tomorrow?",
      "Is there a supply list for this term?",
    ],
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
      {
        id: "sp-supplies-special-day",
        label: "Asking about special days",
        note: "For events like picture day or sports day, ask 'Is there anything special for tomorrow?' Vietnamese 'cần chuẩn bị gì' fits this question well.",
      },
      {
        id: "sp-supplies-where-buy",
        label: "Where to buy supplies",
        note: "If you need items, 'Where can I buy these?' is a fine question. The school can often point you to a shop or a ready-made kit.",
      },
    ],
    followUps: [
      { id: "sp-supplies-what", question: "What would you ask your child needs to bring?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "sp-supplies-when", question: "How would you ask which day it is needed?", salienceQuestion: "When is the {slot} needed?" },
      { id: "sp-supplies-list", question: "How would you ask for a full list?", salienceQuestion: "How would you ask for a list of the {slot}?" },
      { id: "sp-supplies-where", question: "How would you ask where to get it?", salienceQuestion: "Where can you get the {slot}?" },
      { id: "sp-supplies-special", question: "How would you ask about a special event day?", salienceQuestion: "What does the {slot} need for a special day?" },
      { id: "sp-supplies-label", question: "How would you ask if items should be labeled?", salienceQuestion: "Should the {slot} have your child's name on it?" },
    ],
  },
  {
    id: "topic-school-parent-contact-teacher",
    labelEn: "Finding The Best Way To Reach The Teacher",
    labelVi: "Hỏi cách liên lạc với giáo viên",
    category: "school-parent",
    seedInputs: [
      "What is the best way to contact you if I have a question?",
      "What's the best way to reach you during the week?",
      "Should I email you or send a note in his bag?",
    ],
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
      {
        id: "sp-contact-response-time",
        label: "Asking when they reply",
        note: "It's fine to ask 'When do you usually reply?' so you know what to expect. Vietnamese politeness might skip this, but it actually helps both sides.",
      },
      {
        id: "sp-contact-app-frame",
        label: "School apps and platforms",
        note: "Many schools use an app or portal. 'Do you use an app to message?' helps you set up the easiest channel for you to keep in touch.",
      },
    ],
    followUps: [
      { id: "sp-contact-way", question: "How would you ask the best way to reach the teacher?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "sp-contact-when", question: "How would you ask the best time to contact them?", salienceQuestion: "When is a good time for the {slot}?" },
      { id: "sp-contact-channel", question: "How would you ask if email or a note is okay?", salienceQuestion: "Which {slot} works best for the teacher?" },
      { id: "sp-contact-confirm", question: "How would you confirm you understood?", salienceQuestion: "How would you confirm the {slot}?" },
      { id: "sp-contact-urgent", question: "How would you ask how to reach them urgently?", salienceQuestion: "How would you handle an urgent {slot}?" },
      { id: "sp-contact-language", question: "How would you ask if you can write in simple English?", salienceQuestion: "How would you keep the {slot} easy for you?" },
    ],
  },
] as const;
