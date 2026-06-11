import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Childcare / daycare theme. The real situations a Vietnamese parent handles
// at a daycare or preschool: enrolling a child, drop-off and pickup, calling
// about a sick child, understanding fees, learning the daily schedule, talking
// with caregivers, and arranging emergency or early pickup. Distinctly
// uncovered from schoolParent (K-12 school).
// Deterministic / client-side; copy is warm, adult, low-shame, and strictly
// about COMMUNICATION, never childcare advice. l1InterferenceNotes quote the
// Vietnamese source phrase with full diacritics — friendly context, never a
// grammar correction.
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-childcare-enrollment-inquiry",
    labelEn: "Asking About Enrollment",
    labelVi: "Hỏi về thủ tục ghi danh",
    category: "childcare",
    seedInputs: [
      "Hi, I'm looking for a daycare for my two-year-old.",
      "Do you have any openings for a toddler?",
      "I'd like to find out about enrolling my son in your daycare.",
    ],
    detectionPatterns: [
      /\b(?:enroll|enrollment|sign up|register my child|openings for a|spot for my|looking for a daycare|childcare|preschool opening|waitlist)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "childcare-enroll-ghi-danh",
        label: "\"Ghi danh\" and \"register\"",
        note: "'Ghi danh' makes parents reach for 'register my child.' At a daycare front desk the everyday phrase is 'enroll' or 'sign up': 'I'd like to enroll my daughter.' Both are understood; 'enroll' is the one on all the forms.",
      },
      {
        id: "childcare-enroll-waitlist",
        label: "Waitlists are common",
        note: "Popular daycares often say 'We're full but you can join the waitlist.' 'Danh sách chờ' is 'waitlist.' Asking 'How long is the waitlist?' and leaving your contact details is standard — it doesn't sound pushy.",
      },
      {
        id: "childcare-enroll-age-range",
        label: "Ages the center accepts",
        note: "Each center has an age range — 'We take children from six weeks to five years.' Your child's age in months matters early on: 'She's 18 months' is clearer than 'she's a year and a half' for staff checking room ratios.",
      },
    ],
    followUps: [
      { id: "childcare-enroll-age", question: "How old is your child?", salienceQuestion: "How would you give your child's {slot} age?" },
      { id: "childcare-enroll-available", question: "How would you ask if there's an opening?", salienceQuestion: "How would you ask about a {slot} spot?" },
      { id: "childcare-enroll-start", question: "When do you need care to start?", salienceQuestion: "When would you need the {slot} to begin?" },
      { id: "childcare-enroll-waitlist-fu", question: "How would you ask about the waitlist?", salienceQuestion: "How would you ask about the {slot} waitlist?" },
      { id: "childcare-enroll-tour", question: "How would you ask to visit and see the centre?", salienceQuestion: "How would you ask for a {slot} tour?" },
    ],
  },
  {
    id: "topic-childcare-dropoff-pickup",
    labelEn: "Drop-Off And Pickup Routine",
    labelVi: "Đưa và đón con hàng ngày",
    category: "childcare",
    seedInputs: [
      "What time does drop-off start in the morning?",
      "I'm here to pick up my son, Kevin.",
      "Is there a late pickup fee if I'm a little late?",
    ],
    detectionPatterns: [
      /\b(?:drop-?off|pick-?up|picking up my|here to (?:pick up|collect)|what time (?:is|does) (?:drop|pick)|late pickup|early pickup|sign (?:in|out)|authorized to pick up)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "childcare-dropoff-dua-don",
        label: "\"Đưa đón\" as \"take and bring\"",
        note: "'Đưa đón trẻ' becomes 'take and bring the child.' English uses two separate words for these moments: 'drop off' in the morning and 'pick up' in the afternoon. These short phrases cover every daily handover.",
      },
      {
        id: "childcare-dropoff-late-fee",
        label: "Late pickup fees",
        note: "Many daycares charge if you're more than ten or fifteen minutes late. Asking 'Is there a late pickup fee?' before it happens shows you're organised — and helps you avoid a surprise charge.",
      },
      {
        id: "childcare-dropoff-authorized",
        label: "Who is authorised to pick up",
        note: "Staff may ask 'Who else is authorised to pick up?' 'Người được phép đón' maps to 'authorised to pick up.' Naming a grandparent or neighbour — with their ID — keeps the handover smooth.",
      },
    ],
    followUps: [
      { id: "childcare-dropoff-hours", question: "What are the drop-off and pickup hours?", salienceQuestion: "How would you ask about the {slot} hours?" },
      { id: "childcare-dropoff-late", question: "How would you let them know you'll be a little late?", salienceQuestion: "How would you warn about a late {slot}?" },
      { id: "childcare-dropoff-other-person", question: "How would you say someone else is picking up today?", salienceQuestion: "How would you say who is doing the {slot} today?" },
      { id: "childcare-dropoff-signin", question: "How would you ask about the sign-in and sign-out process?", salienceQuestion: "What is the {slot} sign-in rule?" },
      { id: "childcare-dropoff-fee", question: "How would you ask about late pickup fees?", salienceQuestion: "What is the {slot} late fee?" },
    ],
  },
  {
    id: "topic-childcare-sick-child",
    labelEn: "Calling About A Sick Child",
    labelVi: "Gọi điện khi con bị bệnh",
    category: "childcare",
    seedInputs: [
      "My daughter has a fever this morning so she won't be coming in today.",
      "Hi, I'm calling to let you know my son is sick.",
      "When is he well enough to come back after being sick?",
    ],
    detectionPatterns: [
      /\b(?:sick|fever|throwing up|vomiting|runny nose|won'?t be coming in|staying home today|child is ill|when can (?:he|she) come back|contagious|exclusion policy)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "childcare-sick-bao-truoc",
        label: "Calling ahead is valued",
        note: "Vietnamese 'báo trước' (give notice) maps to calling early to say your child is staying home. 'I'm calling to let you know she won't be in today' is the warm, short phrase. Calling by the centre's deadline avoids a missed-absence mark.",
      },
      {
        id: "childcare-sick-exclusion",
        label: "Exclusion and return rules",
        note: "Daycares often say a child must be fever-free for 24 hours before returning ('exclusion policy'). Asking 'When can she come back?' saves a second call — and 'fever-free for 24 hours' is the phrase to remember.",
      },
      {
        id: "childcare-sick-contagious",
        label: "Saying what it might be",
        note: "If you know the illness — 'she has a stomach bug' or 'the doctor said it's an ear infection' — sharing that helps the staff watch other children. There's no need to translate the Vietnamese diagnosis word by word; a short description is enough.",
      },
    ],
    followUps: [
      { id: "childcare-sick-reason", question: "How would you say why your child isn't coming in?", salienceQuestion: "How would you explain the {slot} reason?" },
      { id: "childcare-sick-howlong", question: "How would you ask how long the child should stay home?", salienceQuestion: "How long for the {slot} absence?" },
      { id: "childcare-sick-return", question: "How would you ask when it's okay to return?", salienceQuestion: "How would you ask about the {slot} return rule?" },
      { id: "childcare-sick-doctor", question: "How would you say if you've been to the doctor?", salienceQuestion: "How would you mention the {slot} doctor visit?" },
      { id: "childcare-sick-note", question: "How would you ask if you need a doctor's note?", salienceQuestion: "Do you need a {slot} note?" },
    ],
  },
  {
    id: "topic-childcare-fees-payment",
    labelEn: "Understanding Fees And Payment",
    labelVi: "Hiểu về học phí và thanh toán",
    category: "childcare",
    seedInputs: [
      "How much is the monthly fee for a full-time spot?",
      "Is there a discount if I pay for the full term upfront?",
      "Do you accept childcare subsidy or government assistance?",
    ],
    detectionPatterns: [
      /\b(?:monthly fee|weekly fee|how much (?:is|does)|childcare subsidy|government assistance|deposit|payment plan|full-?time|part-?time rate|due date|invoice)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "childcare-fees-hoc-phi",
        label: "\"Học phí\" for daycare fees",
        note: "'Học phí' (school/learning fee) is the natural word Vietnamese parents reach for. In English the same idea is 'childcare fee' or 'tuition.' Asking 'What is the weekly tuition?' or 'What's the monthly fee?' both work at the desk.",
      },
      {
        id: "childcare-fees-subsidy",
        label: "Government childcare assistance",
        note: "Many countries offer childcare subsidies or tax credits — ask 'Do you accept childcare assistance?' or 'Is there a subsidy programme?' Vietnamese newcomers sometimes don't know these benefits exist; it's a helpful question to ask upfront.",
      },
      {
        id: "childcare-fees-deposit",
        label: "Deposits and holding fees",
        note: "Some centres ask for a deposit to hold a spot: 'There's a two-week deposit to hold the place.' 'Tiền đặt cọc' maps to 'deposit.' Asking 'Is the deposit refundable?' is a normal and smart question.",
      },
    ],
    followUps: [
      { id: "childcare-fees-how-much", question: "How would you ask the total weekly or monthly cost?", salienceQuestion: "How would you ask about the {slot} total?" },
      { id: "childcare-fees-subsidy-fu", question: "How would you ask if they accept a childcare subsidy?", salienceQuestion: "How would you ask about the {slot} subsidy?" },
      { id: "childcare-fees-deposit-fu", question: "How would you ask about any deposit required?", salienceQuestion: "What {slot} deposit is needed?" },
      { id: "childcare-fees-due", question: "How would you ask when payment is due each month?", salienceQuestion: "When is the {slot} due?" },
      { id: "childcare-fees-payment-method", question: "How would you ask which payment methods are accepted?", salienceQuestion: "How do you pay the {slot}?" },
    ],
  },
  {
    id: "topic-childcare-daily-schedule",
    labelEn: "Understanding The Daily Schedule And Activities",
    labelVi: "Hỏi về thời khóa biểu và hoạt động hàng ngày",
    category: "childcare",
    seedInputs: [
      "What does a typical day look like for the toddler group?",
      "When do they have nap time?",
      "What activities do the kids do in the afternoon?",
    ],
    detectionPatterns: [
      /\b(?:daily (?:schedule|routine|programme)|nap time|circle time|outdoor (?:time|play)|what (?:do|does) (?:the )?kids?|activities?|meal time|snack time|typical day|learning activities)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "childcare-schedule-thoi-khoa-bieu",
        label: "\"Thời khóa biểu\" as \"timetable\"",
        note: "'Thời khóa biểu' (school timetable) makes parents ask for 'the timetable.' Daycare staff say 'daily schedule' or 'daily routine.' Asking 'Can I see the daily schedule?' gets you exactly what you're looking for.",
      },
      {
        id: "childcare-schedule-ngu-trua",
        label: "Nap time — \"ngủ trưa\"",
        note: "'Ngủ trưa' (afternoon nap) maps to 'nap time.' Asking 'Is there a nap time?' is one of the first questions parents have. Most daycares have a set nap window and will tell you if they wake a child early.",
      },
      {
        id: "childcare-schedule-activities",
        label: "Learning through play",
        note: "Daycares often describe activities as 'learning through play': art, storytime, outdoor play, circle time. If you wonder what your child learns, 'What learning activities do they do?' is a natural question that staff love to answer.",
      },
    ],
    followUps: [
      { id: "childcare-schedule-typical", question: "How would you ask what a typical day is like?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "childcare-schedule-nap", question: "How would you ask about nap time?", salienceQuestion: "How would you ask about the {slot} nap?" },
      { id: "childcare-schedule-meals", question: "How would you ask about meals or snacks?", salienceQuestion: "What about the {slot} meal?" },
      { id: "childcare-schedule-outside", question: "How would you ask about outdoor playtime?", salienceQuestion: "When is the {slot} outside time?" },
      { id: "childcare-schedule-learning", question: "How would you ask what the children learn?", salienceQuestion: "What {slot} learning happens there?" },
    ],
  },
  {
    id: "topic-childcare-caregiver-communication",
    labelEn: "Talking With The Caregiver",
    labelVi: "Nói chuyện với người trông trẻ",
    category: "childcare",
    seedInputs: [
      "My daughter cried a lot when I dropped her off — is she okay now?",
      "Can you let me know how his day went?",
      "He has a small food allergy — I wanted to mention it.",
    ],
    detectionPatterns: [
      /\b(?:how (?:was|did) (?:her|his|their|my child'?s) day|cried at drop-?off|daily report|food allergy|special need|any concerns|how is (?:he|she) doing|settling in)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "childcare-caregiver-khoc",
        label: "Crying at drop-off is normal",
        note: "'Khóc khi đưa đến trường' (crying at drop-off) is very common. Saying 'She was a bit upset when I left — is she okay now?' is a warm, clear question. Staff expect it and will reassure you; it's not a complaint.",
      },
      {
        id: "childcare-caregiver-allergy",
        label: "Mentioning a food allergy",
        note: "'Dị ứng thức ăn' is 'food allergy.' Saying 'He's allergic to peanuts' at enrolment — and again whenever a new carer starts — keeps your child safe. 'Please note he has a nut allergy' is the natural phrase.",
      },
      {
        id: "childcare-caregiver-daily-report",
        label: "Daily update from caregivers",
        note: "Most daycares give a short daily report: nap, meals, mood, activities. 'How did she do today?' opens the door. If you want more detail: 'Was there anything I should know about today?'",
      },
    ],
    followUps: [
      { id: "childcare-caregiver-how-day", question: "How would you ask how your child's day went?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "childcare-caregiver-crying", question: "How would you ask if your child stopped crying after drop-off?", salienceQuestion: "How would you check the {slot} mood?" },
      { id: "childcare-caregiver-allergy-fu", question: "How would you tell them about a food allergy?", salienceQuestion: "How would you mention the {slot} allergy?" },
      { id: "childcare-caregiver-concern", question: "How would you share a small concern you've noticed?", salienceQuestion: "How would you raise a {slot} concern?" },
      { id: "childcare-caregiver-update", question: "How would you ask about your child's progress or settling in?", salienceQuestion: "How is the {slot} going?" },
    ],
  },
  {
    id: "topic-childcare-emergency-pickup",
    labelEn: "Arranging An Early Or Emergency Pickup",
    labelVi: "Sắp xếp đón con sớm hoặc khẩn cấp",
    category: "childcare",
    seedInputs: [
      "I need to pick up my daughter early today — is that okay?",
      "The centre called to say my son isn't feeling well.",
      "My aunt will pick him up today — I've already added her to the form.",
    ],
    detectionPatterns: [
      /\b(?:early pickup|pick (?:her|him|them) up early|child isn'?t feeling well|centre called|emergency (?:contact|pickup)|someone else (?:will|is) picking up|not authorized|ID check)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "childcare-emergency-don-som",
        label: "\"Đón sớm\" — early pickup",
        note: "'Đón sớm' (pick up early) maps to 'early pickup.' Saying 'I need to pick her up early at noon today — is that okay?' is the full, clear message in one sentence. Giving a time avoids a second call.",
      },
      {
        id: "childcare-emergency-someone-else",
        label: "Another person collecting your child",
        note: "If someone else is picking up, centres ask you to confirm in advance and may ask for their ID. 'My aunt is picking him up today — her name is Mai Nguyen' tells staff exactly what to expect and keeps your child safe.",
      },
      {
        id: "childcare-emergency-centre-calls",
        label: "When the centre calls you",
        note: "If the centre calls to say your child is unwell, they're asking you to pick up as soon as you can. 'I'll be there in about 30 minutes' is a calm, clear reply. If you truly can't come, 'Can my husband pick up instead?' is the right follow-up.",
      },
    ],
    followUps: [
      { id: "childcare-emergency-early", question: "How would you ask to pick your child up early?", salienceQuestion: "How would you arrange an early {slot}?" },
      { id: "childcare-emergency-other", question: "How would you say someone else is picking up today?", salienceQuestion: "Who is doing the {slot} today?" },
      { id: "childcare-emergency-called", question: "How would you respond if the centre calls about your sick child?", salienceQuestion: "What would you say about the {slot} call?" },
      { id: "childcare-emergency-time", question: "How would you say what time you'll arrive?", salienceQuestion: "How would you give your {slot} arrival time?" },
      { id: "childcare-emergency-cant", question: "How would you say you can't come right away and ask for an alternative?", salienceQuestion: "How would you explain a {slot} delay?" },
    ],
  },
] as const;
