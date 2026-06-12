import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Gym & fitness customer English theme. Deepened to full D4 metadata depth.
// 6 topics covering the everyday interactions a Vietnamese newcomer faces at a gym:
// joining, using equipment, fitness classes, working with a personal trainer,
// canceling, and understanding the contract/billing.
// Copy is warm, adult, low-shame, and strictly about COMMUNICATION.
// l1InterferenceNotes quote the Vietnamese source phrase with full diacritics —
// friendly context, never a grammar correction.
// note-ids and followUp-ids are disjoint (note ids have no -fu suffix;
// followUp ids always end with -fu).

type D4SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const gymFitnessSpeakTopics: readonly D4SpeakTopic[] = [
  {
    id: "topic-gym-join-membership",
    labelEn: "Joining A Gym",
    labelVi: "Đăng ký thành viên phòng tập",
    category: "gym-fitness",
    scenarioDescription:
      "The learner visits a gym for the first time and wants to sign up for a membership. They need to ask about membership types, pricing, contracts, and whether a trial pass is available before committing.",
    aiRoleDefinition:
      "Act as a friendly gym sales representative who explains the membership options clearly, answers questions about pricing and contracts without pressure, and offers a trial pass before asking for a decision.",
    conversationDirections: [
      "Greet the learner warmly and ask how you can help before launching into a sales pitch.",
      "Describe the two or three most common options (monthly, annual, day pass) with prices.",
      "Explain the contract or no-contract options clearly — learners often don't know what to ask.",
      "Offer a trial pass proactively so the learner can see the gym before signing.",
      "Answer the learner's specific questions about cost or features before circling back to a decision.",
      "If the learner wants time to think, give them a brochure or website and invite them back — no pressure.",
    ],
    warmthPatterns: [
      "Open with a genuine welcome rather than an immediate offer — 'I'm glad you came in' lands better than a price list.",
      "If the learner hesitates, name the trial-pass option first: it lowers the stakes and builds trust.",
      "When the learner decides to join, congratulate them briefly and move straight to the paperwork — don't oversell.",
    ],
    seedInputs: ["Hi, I'd like to sign up for a membership."],
    detectionPatterns: [
      /\b(?:join (?:the )?gym|sign up for (?:a )?membership|gym membership|day pass|trial pass|become a member|membership fee)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "gym-join-dang-ky",
        label: "Đăng ký thành viên → 'sign up for a membership'",
        note: "'Đăng ký thành viên' can become 'register member.' The everyday phrase is 'sign up for a membership' or simply 'join the gym.' Saying 'I'd like to sign up' is warm and natural.",
      },
      {
        id: "gym-join-membership-types",
        label: "Monthly, annual, day-pass",
        note: "Gyms offer 'monthly' and 'annual' (year-long) memberships, plus a 'day pass' for one visit. Asking 'What membership options do you have?' gets you all the choices.",
      },
      {
        id: "gym-join-trial",
        label: "Dùng thử → 'trial' or 'free pass'",
        note: "'Dùng thử' is 'try it out.' Ask for a 'trial pass' or 'free day pass' before committing: 'Do you offer a trial pass?' Most gyms say yes.",
      },
    ],
    followUps: [
      { id: "gym-join-type-fu", question: "What membership type would work for you?", salienceQuestion: "Which {slot} option fits your schedule?" },
      { id: "gym-join-price-fu", question: "How would you ask about the monthly price?", salienceQuestion: "How much is the {slot} each month?" },
      { id: "gym-join-contract-fu", question: "How would you ask if there is a contract?", salienceQuestion: "Does the {slot} require a contract?" },
      { id: "gym-join-trial-fu", question: "How would you ask for a trial pass?", salienceQuestion: "Can you try the {slot} before signing up?" },
      { id: "gym-join-start-fu", question: "How would you say when you want to start?", salienceQuestion: "When would you like to begin the {slot}?" },
    ],
  },
  {
    id: "topic-gym-equipment-help",
    labelEn: "Using Gym Equipment",
    labelVi: "Sử dụng thiết bị phòng tập",
    category: "gym-fitness",
    scenarioDescription:
      "The learner is on the gym floor and needs help from a staff member — either to learn how to use a machine safely, find out if a machine is free, or report a broken one.",
    aiRoleDefinition:
      "Act as a gym floor staff member who is approachable, gives a quick demonstration when asked, checks whether equipment is occupied correctly, and takes broken-machine reports seriously.",
    conversationDirections: [
      "If the learner asks for help with a machine, offer to demonstrate immediately — walk over, don't just describe.",
      "Explain one or two safety points naturally, not as a lecture.",
      "If the learner asks whether a machine is taken, give a clear yes or no — offer to hold it if the owner stepped away.",
      "When the learner reports a broken machine, thank them and say you'll put an 'out of order' sign on it right away.",
      "Invite the learner to ask again if they need anything else — a brief 'I'm right here if you have questions' is enough.",
      "Keep instructions short — one step at a time — so the learner can follow along while you demonstrate.",
    ],
    warmthPatterns: [
      "Never make asking for help feel like an interruption — drop what you're doing and give the learner full attention.",
      "If the learner apologises for asking, dismiss the apology warmly: 'That's exactly what I'm here for.'",
      "After the demonstration, ask 'Does that make sense?' rather than assuming they followed every step.",
    ],
    seedInputs: ["Excuse me, can you show me how to use this machine?"],
    detectionPatterns: [
      /\b(?:how (?:do I )?use (?:this )?machine|is this (?:machine )?taken|treadmill|weights|elliptical|equipment|broken machine|out of order)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "gym-equipment-may-tap",
        label: "Máy tập → 'machine' or 'equipment'",
        note: "'Máy tập' is 'exercise machine' or simply 'machine.' Asking 'Can you show me how to use this machine?' is polite and gets quick help from staff.",
      },
      {
        id: "gym-equipment-how-to-use",
        label: "Asking for help without embarrassment",
        note: "It is normal to ask staff: 'I'm not sure how to use this — can you help me?' Vietnamese learners sometimes avoid asking; staff expect it and are happy to show you.",
      },
      {
        id: "gym-equipment-taken",
        label: "Máy đó có ai dùng không → 'Is this taken?'",
        note: "'Máy đó có ai dùng không?' translates word-for-word as 'does anyone use that machine?' The short, natural phrase is 'Is this taken?' or 'Are you using this?'",
      },
    ],
    followUps: [
      { id: "gym-equipment-find-fu", question: "How would you ask where to find a specific machine?", salienceQuestion: "Where is the {slot} in this gym?" },
      { id: "gym-equipment-use-fu", question: "How would you ask a staff member to show you how to use a machine?", salienceQuestion: "Can someone show you the {slot}?" },
      { id: "gym-equipment-taken-fu", question: "How would you ask if a machine is free?", salienceQuestion: "Is the {slot} available right now?" },
      { id: "gym-equipment-rules-fu", question: "How would you ask about gym etiquette or rules?", salienceQuestion: "What are the rules for the {slot}?" },
      { id: "gym-equipment-repair-fu", question: "How would you report a broken machine to staff?", salienceQuestion: "How would you report a broken {slot}?" },
    ],
  },
  {
    id: "topic-gym-fitness-class",
    labelEn: "Signing Up For A Fitness Class",
    labelVi: "Đăng ký lớp thể dục",
    category: "gym-fitness",
    scenarioDescription:
      "The learner wants to join a group fitness class at the gym — yoga, spin, Zumba, or another option. They need to ask about the schedule, how to sign up, what happens when a class is full, and how to cancel if they can't attend.",
    aiRoleDefinition:
      "Act as a gym front-desk staff member who explains the class schedule clearly, walks the learner through the sign-up process (app or in-person), and offers to add them to a waitlist when a class is full.",
    conversationDirections: [
      "Ask what type of class the learner is interested in before going through the full schedule.",
      "Explain the sign-up process in two or three steps — app, front desk, or online.",
      "Tell the learner the cancellation window (e.g., 24 hours) so they know the rule before booking.",
      "If the class is full, offer the waitlist clearly and explain how they'll be notified.",
      "Recommend a beginner-friendly option if the learner is unsure which class fits their level.",
      "Confirm the booking and repeat the class name, day, and time before closing.",
    ],
    warmthPatterns: [
      "Treat first-time class questions as routine and exciting — 'You'll love it' is always a good opener.",
      "If the learner is nervous about their fitness level, name one way the class accommodates beginners.",
      "After booking, send them off with 'See you in class' — it makes the commitment feel real and welcoming.",
    ],
    seedInputs: ["I'd like to join the yoga class. How do I sign up?"],
    detectionPatterns: [
      /\b(?:fitness class|yoga class|spin class|zumba|group class|class schedule|sign up for (?:a )?class|waitlist|class reservation)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "gym-class-lop-the-duc",
        label: "Lớp thể dục → 'fitness class'",
        note: "'Lớp thể dục' is a 'fitness class.' Classes have names like 'yoga,' 'spin,' and 'Zumba.' Saying 'I'd like to join the yoga class' is clear and direct.",
      },
      {
        id: "gym-class-schedule",
        label: "Lịch lớp → 'class schedule'",
        note: "'Lịch lớp' is the 'class schedule' or 'timetable.' Asking 'Where can I find the class schedule?' — or checking the gym's app — shows you when classes are.",
      },
      {
        id: "gym-class-waitlist",
        label: "Lớp đầy → 'join the waitlist'",
        note: "If a class is full, you can 'join the waitlist.' Say 'Can I be added to the waitlist?' — if someone cancels, you get their spot.",
      },
    ],
    followUps: [
      { id: "gym-class-schedule-fu", question: "How would you ask about the class schedule?", salienceQuestion: "When is the {slot} available?" },
      { id: "gym-class-sign-up-fu", question: "How would you sign up for a specific class?", salienceQuestion: "How do you join the {slot}?" },
      { id: "gym-class-full-fu", question: "How would you ask to be put on a waitlist?", salienceQuestion: "What if the {slot} is full?" },
      { id: "gym-class-cancel-fu", question: "How would you cancel a class reservation you can't attend?", salienceQuestion: "How would you cancel a {slot} you can't make?" },
      { id: "gym-class-level-fu", question: "How would you ask if a class is right for your fitness level?", salienceQuestion: "Is the {slot} right for you?" },
    ],
  },
  {
    id: "topic-gym-personal-trainer",
    labelEn: "Working With A Personal Trainer",
    labelVi: "Tập cùng huấn luyện viên cá nhân",
    category: "gym-fitness",
    scenarioDescription:
      "The learner wants to explore personal training — asking about costs, booking a first session, describing their fitness goals, and understanding what a training package includes.",
    aiRoleDefinition:
      "Act as a gym personal trainer who introduces themselves warmly, asks about the learner's goals without judgment, explains session pricing and package options clearly, and books an intro session before the conversation ends.",
    conversationDirections: [
      "Open by asking about the learner's main goal before talking about packages or prices.",
      "Listen to the goal and reflect it back — 'So you want to build strength, especially in your upper body' — to show you understood.",
      "Explain session pricing and what a package includes (number of sessions, assessment, programme).",
      "Offer an intro session — sometimes free — so the learner can decide before buying a package.",
      "Book the first session before the conversation ends: name a day and time and get confirmation.",
      "Close with one practical detail — what to bring and where to meet — so the learner feels prepared.",
    ],
    warmthPatterns: [
      "Never judge the learner's starting fitness level — respond to their goal with 'That's very achievable' rather than surprise.",
      "If the learner is unsure of their goal, offer three common options (weight loss, strength, general fitness) and let them pick.",
      "After booking, give one motivating line — 'We'll have you on the right track quickly' — to close on a positive note.",
    ],
    seedInputs: ["I'm interested in working with a personal trainer. What are my options?"],
    detectionPatterns: [
      /\b(?:personal trainer|PT session|training session|book (?:a )?trainer|one-on-one|fitness goal|strength training|weight loss plan)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "gym-trainer-huan-luyen-vien",
        label: "Huấn luyện viên → 'personal trainer' or 'PT'",
        note: "'Huấn luyện viên cá nhân' is a 'personal trainer,' often called a 'PT.' Gyms usually let you meet one for a free 'intro session' before committing.",
      },
      {
        id: "gym-trainer-session",
        label: "Buổi tập → 'session'",
        note: "'Buổi tập' is a 'session' or 'appointment.' You 'book' or 'schedule' sessions: 'I'd like to book a session for Thursday.' A package of sessions is called a 'training package.'",
      },
      {
        id: "gym-trainer-goals",
        label: "Mục tiêu → 'fitness goals'",
        note: "Trainers always ask about your 'fitness goals' (mục tiêu). Common answers: 'I want to lose weight,' 'I want to build muscle,' or 'I want to get stronger.' Clear goals help the trainer build the right plan.",
      },
    ],
    followUps: [
      { id: "gym-trainer-inquire-fu", question: "How would you ask about personal training options at this gym?", salienceQuestion: "What {slot} options are available here?" },
      { id: "gym-trainer-cost-fu", question: "How would you ask about the cost per session?", salienceQuestion: "How much is a {slot} session?" },
      { id: "gym-trainer-schedule-fu", question: "How would you schedule your first session?", salienceQuestion: "When would you book your first {slot}?" },
      { id: "gym-trainer-goal-fu", question: "How would you describe your fitness goal to a trainer?", salienceQuestion: "What is your {slot} goal?" },
      { id: "gym-trainer-cancel-fu", question: "How would you cancel or reschedule a training session?", salienceQuestion: "How would you change a {slot} appointment?" },
    ],
  },
  {
    id: "topic-gym-cancel-membership",
    labelEn: "Canceling Your Membership",
    labelVi: "Hủy tư cách thành viên",
    category: "gym-fitness",
    scenarioDescription:
      "The learner wants to cancel their gym membership and needs to understand the process — notice period, cancellation form, any fees, and when billing will actually stop.",
    aiRoleDefinition:
      "Act as a gym front-desk staff member who explains the cancellation process clearly and without guilt-tripping, states any notice period or fee upfront, and confirms the last billing date before the member leaves.",
    conversationDirections: [
      "Acknowledge the cancellation request without asking for a reason unless it's part of a simple retention script — keep it brief.",
      "Explain the notice period (e.g., 30 days) immediately so the learner knows when charges stop.",
      "State whether cancellation must be done in writing, in person, or both.",
      "Mention any early-termination fee if the learner is still in a contract — be clear about the amount.",
      "Confirm the last day of membership and the last payment date before the learner leaves.",
      "Offer the freeze option as a brief alternative if the learner is travelling or taking a break — but accept a 'no' without pressure.",
    ],
    warmthPatterns: [
      "Thank the member for their time at the gym before starting the cancellation process.",
      "State every fee or notice requirement neutrally — no sighing, no disappointed tone.",
      "Close with 'You're always welcome back' to leave the door open without any guilt.",
    ],
    seedInputs: ["I'd like to cancel my membership. What's the process?"],
    detectionPatterns: [
      /\b(?:cancel (?:my )?membership|end (?:my )?membership|cancellation (?:fee|policy|form)|cancel (?:my )?contract|notice period|freeze (?:my )?membership|pause (?:my )?membership)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "gym-cancel-huy-hop-dong",
        label: "Hủy hợp đồng → 'cancel my membership'",
        note: "'Hủy hợp đồng' is 'cancel the contract.' The everyday phrase at a gym is 'cancel my membership.' Ask front desk: 'I'd like to cancel my membership — what do I need to do?'",
      },
      {
        id: "gym-cancel-notice",
        label: "Notice period / 30-day notice",
        note: "Most gyms need a 'notice period' — usually 30 days — before they stop charging. Saying 'I'd like to give my 30-day notice' starts the clock correctly.",
      },
      {
        id: "gym-cancel-in-writing",
        label: "Bằng văn bản → 'in writing'",
        note: "Many gyms require cancellation 'in writing' — a signed form or an email. Asking 'Do I need to cancel in writing?' avoids a surprise charge the next month.",
      },
    ],
    followUps: [
      { id: "gym-cancel-how-fu", question: "How would you ask about the cancellation process?", salienceQuestion: "How do you cancel the {slot}?" },
      { id: "gym-cancel-fee-fu", question: "How would you ask if there is a cancellation fee?", salienceQuestion: "Is there a fee to cancel the {slot}?" },
      { id: "gym-cancel-notice-fu", question: "How would you give your notice to cancel?", salienceQuestion: "How do you give notice for the {slot}?" },
      { id: "gym-cancel-last-day-fu", question: "How would you ask when your membership ends?", salienceQuestion: "When does the {slot} actually end?" },
      { id: "gym-cancel-refund-fu", question: "How would you ask about a refund for unused time?", salienceQuestion: "Can you get a refund for unused {slot} time?" },
    ],
  },
  {
    id: "topic-gym-billing-contract",
    labelEn: "Understanding Your Gym Contract And Billing",
    labelVi: "Hiểu hợp đồng và thanh toán phòng tập",
    category: "gym-fitness",
    scenarioDescription:
      "The learner received an unexpected charge or wants to understand their gym contract before signing. They need to ask about auto-renewal, extra fees, billing cycles, and how to freeze or change their plan.",
    aiRoleDefinition:
      "Act as a gym billing representative who explains contract terms in plain language, breaks down each line on the bill, and offers to freeze or adjust the plan rather than waiting for the member to guess the solution.",
    conversationDirections: [
      "Let the learner describe the charge or question they have before explaining — listen to the specific concern.",
      "Identify the charge by name on the bill ('That's the annual maintenance fee') rather than giving a general explanation.",
      "Explain auto-renewal clearly — when it happens, how to stop it, and what the window is.",
      "If the learner didn't expect a fee, apologise briefly for the confusion and explain how to avoid it next time.",
      "Offer concrete actions: waive a one-time fee if it's a first occurrence, or apply a freeze if the learner is away.",
      "Confirm the next charge date and amount before closing so the learner leaves with clear expectations.",
    ],
    warmthPatterns: [
      "Start by thanking the member for bringing the billing question to your attention — it signals you want to fix it.",
      "Never repeat the policy in a robotic tone; explain it as one person to another: 'Basically, what that means is...'",
      "If there's nothing you can do about a charge, say so directly and offer one alternative — don't leave the learner in a loop.",
    ],
    seedInputs: ["I got charged an extra fee this month. Can you explain my bill?"],
    detectionPatterns: [
      /\b(?:gym contract|auto-renew|auto renewal|annual fee|enrollment fee|extra charge|billing cycle|freeze (?:my )?account|initiation fee|monthly charge)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "gym-billing-hop-dong",
        label: "Hợp đồng → 'contract'",
        note: "'Hợp đồng' is the 'contract.' Always ask 'Can I see the contract?' and check the term length — month-to-month costs a bit more but lets you cancel anytime.",
      },
      {
        id: "gym-billing-auto-renew",
        label: "Tự động gia hạn → 'auto-renews'",
        note: "'Tự động gia hạn' is 'auto-renews.' Many gym contracts auto-renew annually. Asking 'Does this contract auto-renew?' before signing protects you from a surprise year-long charge.",
      },
      {
        id: "gym-billing-extra-fees",
        label: "Phí phụ → extra fees",
        note: "Gyms add fees beyond the monthly rate: an 'enrollment fee' when you join, an 'annual maintenance fee' once a year, and 'guest fees' if you bring someone. Asking 'What other fees are there?' reveals them before you sign.",
      },
    ],
    followUps: [
      { id: "gym-billing-contract-fu", question: "How would you ask to read the contract before signing?", salienceQuestion: "Can you see the {slot} before committing?" },
      { id: "gym-billing-auto-renew-fu", question: "How would you ask if the contract auto-renews?", salienceQuestion: "Does the {slot} renew automatically?" },
      { id: "gym-billing-fees-fu", question: "How would you ask about extra fees not shown in the monthly rate?", salienceQuestion: "What other {slot} fees are there?" },
      { id: "gym-billing-freeze-fu", question: "How would you ask about pausing your membership instead of canceling?", salienceQuestion: "Can you pause the {slot} temporarily?" },
      { id: "gym-billing-change-fu", question: "How would you ask about switching to a different membership plan?", salienceQuestion: "How would you change the {slot} type?" },
    ],
  },
] as const satisfies readonly D4SpeakTopic[];

export const speakTopics = gymFitnessSpeakTopics;
