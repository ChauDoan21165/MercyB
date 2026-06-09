import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-housing-rent-viewing-apartment",
    labelEn: "Booking An Apartment Viewing",
    labelVi: "Đặt lịch xem nhà",
    category: "housing-rent",
    seedInputs: ["Hi, I am interested in viewing the apartment."],
    detectionPatterns: [
      /\b(?:viewing apartment|view the apartment|interested in the apartment|rental viewing|see the place)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-viewing-interested",
        label: "Interested in viewing",
        note: "A natural rental message starts with 'I'm interested in viewing the apartment.' It is clear and polite without a long self-introduction.",
      },
      {
        id: "housing-viewing-time-note",
        label: "Offer times",
        note: "Landlords often reply faster when you offer two possible viewing times.",
      },
    ],
    followUps: [
      { id: "housing-viewing-place", question: "Which apartment are you asking about?", salienceQuestion: "Which place is the {slot}?" },
      { id: "housing-viewing-time", question: "What viewing time would you suggest?", salienceQuestion: "When can you view the {slot}?" },
      { id: "housing-viewing-question", question: "What one question would you ask before viewing?", salienceQuestion: "What do you need to know about the {slot}?" },
      { id: "housing-viewing-confirm", question: "How would you confirm the viewing?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-housing-rent-monthly-rent",
    labelEn: "Asking About Monthly Rent",
    labelVi: "Hỏi tiền thuê hàng tháng",
    category: "housing-rent",
    seedInputs: ["How much is the monthly rent?"],
    detectionPatterns: [
      /\b(?:monthly rent|rent per month|how much is rent|rent price|rental cost|utilities included)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-rent-monthly",
        label: "Monthly rent",
        note: "'Tiền nhà' can become 'house money.' The natural rental phrase is 'monthly rent' or 'rent per month.'",
      },
      {
        id: "housing-rent-utilities",
        label: "Ask what is included",
        note: "Utilities, internet, and parking may or may not be included. Asking early prevents surprises.",
      },
    ],
    followUps: [
      { id: "housing-rent-amount", question: "How would you ask the monthly rent?", salienceQuestion: "How much is the {slot}?" },
      { id: "housing-rent-included", question: "What would you ask if utilities are included?", salienceQuestion: "What is included with the {slot}?" },
      { id: "housing-rent-parking", question: "How would you ask about parking or internet?", salienceQuestion: "What extra cost matters for the {slot}?" },
      { id: "housing-rent-confirm", question: "How would you repeat the total cost back?", salienceQuestion: "How would you confirm the {slot} cost?" },
    ],
  },
  {
    id: "topic-housing-rent-lease-terms",
    labelEn: "Understanding Lease Terms",
    labelVi: "Hỏi điều khoản hợp đồng thuê",
    category: "housing-rent",
    seedInputs: ["How long is the lease?"],
    detectionPatterns: [
      /\b(?:lease|lease term|rental agreement|contract|how long is the lease|month to month|one year lease)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-lease-word",
        label: "Lease means rental contract",
        note: "Learners may say 'contract rent.' In housing English, 'lease' or 'rental agreement' is the everyday word.",
      },
      {
        id: "housing-lease-month",
        label: "Month-to-month",
        note: "'Month-to-month' means the lease continues one month at a time. It is a useful housing phrase to recognize.",
      },
    ],
    followUps: [
      { id: "housing-lease-length", question: "How would you ask how long the lease is?", salienceQuestion: "How long is the {slot}?" },
      { id: "housing-lease-start", question: "What move-in date would you ask about?", salienceQuestion: "When does the {slot} start?" },
      { id: "housing-lease-rules", question: "What lease rule would you want explained?", salienceQuestion: "What rule matters in the {slot}?" },
      { id: "housing-lease-copy", question: "How would you ask for a copy of the lease?", salienceQuestion: "How would you get a copy of the {slot}?" },
    ],
  },
  {
    id: "topic-housing-rent-deposit",
    labelEn: "Asking About Deposit",
    labelVi: "Hỏi tiền đặt cọc",
    category: "housing-rent",
    seedInputs: ["How much is the security deposit?"],
    detectionPatterns: [
      /\b(?:security deposit|damage deposit|deposit|pay deposit|first month rent|last month rent)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-deposit-security",
        label: "Security deposit",
        note: "'Tiền cọc' in rentals is often 'security deposit' or 'damage deposit.' The exact term depends on the place.",
      },
      {
        id: "housing-deposit-receipt-note",
        label: "Ask for receipt",
        note: "It is normal to ask for a receipt or written confirmation when paying a deposit.",
      },
    ],
    followUps: [
      { id: "housing-deposit-amount", question: "How would you ask the deposit amount?", salienceQuestion: "How much is the {slot}?" },
      { id: "housing-deposit-due", question: "How would you ask when it is due?", salienceQuestion: "When is the {slot} due?" },
      { id: "housing-deposit-return", question: "How would you ask when it is returned?", salienceQuestion: "When do you get the {slot} back?" },
      { id: "housing-deposit-receipt", question: "How would you ask for written confirmation?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-housing-rent-maintenance-request",
    labelEn: "Requesting A Repair",
    labelVi: "Báo sửa chữa trong nhà thuê",
    category: "housing-rent",
    seedInputs: ["The sink is leaking. Could someone fix it?"],
    detectionPatterns: [
      /\b(?:repair|maintenance|leaking|broken|not working|fix it|sink|toilet|heater|appliance)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-maintenance-thing-first",
        label: "Problem first",
        note: "Maintenance messages work best with the item first: 'The sink is leaking' or 'The heater is not working.'",
      },
      {
        id: "housing-maintenance-photo-note",
        label: "Mention a photo",
        note: "It is useful to say 'I can send a photo' so the landlord understands the issue faster.",
      },
    ],
    followUps: [
      { id: "housing-maintenance-item", question: "What needs to be repaired?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "housing-maintenance-when", question: "When did the problem start?", salienceQuestion: "When did the {slot} start?" },
      { id: "housing-maintenance-access", question: "How would you ask when someone can come?", salienceQuestion: "When can someone check the {slot}?" },
      { id: "housing-maintenance-photo", question: "How would you offer to send a photo?", salienceQuestion: "How would you show the {slot}?" },
    ],
  },
  {
    id: "topic-housing-rent-noise-neighbor",
    labelEn: "Talking About Noise",
    labelVi: "Nói về tiếng ồn",
    category: "housing-rent",
    seedInputs: ["There has been loud noise at night."],
    detectionPatterns: [
      /\b(?:noise|loud at night|noisy neighbor|quiet hours|music at night|complaint about noise)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-noise-specific",
        label: "Specific time helps",
        note: "Noise reports are more useful with time and place: 'after 11 p.m.' or 'from the apartment upstairs.'",
      },
      {
        id: "housing-noise-calm",
        label: "Calm request",
        note: "A calm phrase like 'Could you remind them about quiet hours?' sounds practical and respectful.",
      },
    ],
    followUps: [
      { id: "housing-noise-type", question: "What kind of noise is happening?", salienceQuestion: "What kind of {slot} is it?" },
      { id: "housing-noise-time", question: "What time does it usually happen?", salienceQuestion: "When does the {slot} happen?" },
      { id: "housing-noise-place", question: "Where is the noise coming from?", salienceQuestion: "Where is the {slot} coming from?" },
      { id: "housing-noise-request", question: "What calm request would you make?", salienceQuestion: "What do you need about the {slot}?" },
    ],
  },
  {
    id: "topic-housing-rent-moving-in",
    labelEn: "Moving In",
    labelVi: "Dọn vào nhà thuê",
    category: "housing-rent",
    seedInputs: ["What time can I pick up the keys?"],
    detectionPatterns: [
      /\b(?:move in|moving in|pick up the keys|key pickup|move-in day|elevator booking)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-movein-keys-note",
        label: "Pick up the keys",
        note: "'Lấy chìa khóa' becomes 'pick up the keys' in natural housing English.",
      },
      {
        id: "housing-movein-elevator-note",
        label: "Book the elevator",
        note: "In many buildings, you may need to book the elevator for moving. This is common apartment language.",
      },
    ],
    followUps: [
      { id: "housing-movein-date", question: "What is your move-in date?", salienceQuestion: "When is the {slot}?" },
      { id: "housing-movein-keys", question: "How would you ask about picking up keys?", salienceQuestion: "How would you get keys for the {slot}?" },
      { id: "housing-movein-elevator", question: "How would you ask about booking the elevator?", salienceQuestion: "What do you need to move into the {slot}?" },
      { id: "housing-movein-confirm", question: "How would you confirm the move-in plan?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-housing-rent-moving-out",
    labelEn: "Moving Out",
    labelVi: "Dọn ra khỏi nhà thuê",
    category: "housing-rent",
    seedInputs: ["I plan to move out at the end of the month."],
    detectionPatterns: [
      /\b(?:move out|moving out|end of the month|give notice|notice to move|last day)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-moveout-notice-note",
        label: "Give notice",
        note: "In rentals, 'give notice' means officially tell the landlord you will move out. It is important housing vocabulary.",
      },
      {
        id: "housing-moveout-date-note",
        label: "Clear last day",
        note: "Always include the last day you will live there. Dates matter more than extra explanation.",
      },
    ],
    followUps: [
      { id: "housing-moveout-date", question: "What is your move-out date?", salienceQuestion: "When is the {slot}?" },
      { id: "housing-moveout-notice", question: "How would you say you are giving notice?", salienceQuestion: "How would you give notice for the {slot}?" },
      { id: "housing-moveout-inspection", question: "How would you ask about a move-out inspection?", salienceQuestion: "What inspection is needed for the {slot}?" },
      { id: "housing-moveout-deposit", question: "How would you ask about the deposit return?", salienceQuestion: "How would you ask about the {slot} deposit?" },
    ],
  },
  {
    id: "topic-housing-rent-roommate",
    labelEn: "Talking With A Roommate",
    labelVi: "Nói chuyện với bạn cùng nhà",
    category: "housing-rent",
    seedInputs: ["Can we talk about the cleaning schedule?"],
    detectionPatterns: [
      /\b(?:roommate|housemate|cleaning schedule|shared kitchen|shared bathroom|chores|split rent)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-roommate-we-talk",
        label: "Can we talk about",
        note: "'Can we talk about...' is a respectful way to bring up a shared-home issue without sounding angry.",
      },
      {
        id: "housing-roommate-specific",
        label: "One issue at a time",
        note: "Roommate conversations go better with one clear topic: cleaning, noise, guests, or bills.",
      },
    ],
    followUps: [
      { id: "housing-roommate-topic", question: "What shared-home topic do you need to discuss?", salienceQuestion: "What do you need to discuss about the {slot}?" },
      { id: "housing-roommate-request", question: "What clear request would you make?", salienceQuestion: "What request do you have about the {slot}?" },
      { id: "housing-roommate-schedule", question: "How would you suggest a schedule or plan?", salienceQuestion: "What plan works for the {slot}?" },
      { id: "housing-roommate-agree", question: "How would you agree on the next step?", salienceQuestion: "How would you agree on the {slot}?" },
    ],
  },
  {
    id: "topic-housing-rent-mail-package",
    labelEn: "Asking About Mail Or Packages",
    labelVi: "Hỏi thư hoặc gói hàng",
    category: "housing-rent",
    seedInputs: ["Did a package arrive for my unit?"],
    detectionPatterns: [
      /\b(?:mail|package|parcel|unit number|mailbox|delivery room|package room|front desk)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "housing-package-unit-note",
        label: "Unit number",
        note: "In apartment buildings, 'unit number' is a common phrase for your apartment number.",
      },
      {
        id: "housing-package-arrive",
        label: "Did a package arrive",
        note: "A natural question is 'Did a package arrive for my unit?' It is short and clear for front desk staff.",
      },
    ],
    followUps: [
      { id: "housing-package-item", question: "What mail or package are you asking about?", salienceQuestion: "What is the {slot}?" },
      { id: "housing-package-unit", question: "How would you give your unit number?", salienceQuestion: "What unit is the {slot} for?" },
      { id: "housing-package-location", question: "How would you ask where to pick it up?", salienceQuestion: "Where can you pick up the {slot}?" },
      { id: "housing-package-thanks", question: "How would you thank the person helping?", salienceQuestion: "How would you thank someone for the {slot}?" },
    ],
  },
];
