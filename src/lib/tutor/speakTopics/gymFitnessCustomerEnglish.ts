import type { SpeakTopicLibraryEntry as SpeakTopic } from "../speakTopicLibrary";

// Gym & fitness customer English theme. Covers the everyday interactions a Vietnamese
// newcomer faces at an American gym: joining, using equipment, fitness classes, working
// with a personal trainer, canceling, and understanding the contract/billing.
// L1 notes quote the Vietnamese source phrase with full diacritics and map it to
// natural English. note-ids and followUp-ids are disjoint (note ids have no -fu suffix;
// followUp ids always end with -fu).
export const speakTopics: readonly SpeakTopic[] = [
  {
    id: "topic-gym-join-membership",
    labelEn: "Joining A Gym",
    labelVi: "Đăng ký thành viên phòng tập",
    category: "gym-fitness",
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
];
