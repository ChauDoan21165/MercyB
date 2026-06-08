import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-health-visit-booking-appointment",
    labelEn: "Booking A Doctor's Appointment",
    labelVi: "Đặt lịch khám bác sĩ",
    category: "health-visit",
    seedInputs: ["I want to book a visit with the doctor next week."],
    detectionPatterns: [
      /\b(?:book a visit|book a check-?up|schedule a visit|set up a visit|first available|earliest opening|next available slot)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-booking-dat-lich",
        label: "\"Đặt lịch\" said word for word",
        note: "Vietnamese learners translate 'đặt lịch khám' as 'set a schedule' or 'register a calendar.' The warm, natural frame is just 'I'd like to book an appointment.' Keep the practice on getting the visit, not on fixing the words.",
      },
      {
        id: "health-visit-booking-di-kham",
        label: "\"Đi khám\" becomes \"go to examine\"",
        note: "'Đi khám' literally feels like 'go to examine,' so learners may say 'I want to examine' about themselves. In real English they 'see the doctor' or 'get a check-up.' Treat this as everyday phrasing, never as a mistake to call out.",
      },
    ],
    followUps: [
      { id: "health-visit-booking-reason", question: "What would you tell them you need the visit for?", salienceQuestion: "How would you explain the {slot} when you call?" },
      { id: "health-visit-booking-time", question: "What day or time works best for you?", salienceQuestion: "What time would you ask for the {slot}?" },
      { id: "health-visit-booking-ask", question: "How would you ask for the soonest open spot?", salienceQuestion: "How would you ask about the {slot} politely?" },
      { id: "health-visit-booking-confirm", question: "How would you repeat the time back to be sure?", salienceQuestion: "How would you confirm the {slot} before you hang up?" },
    ],
  },
  {
    id: "topic-health-visit-reschedule",
    labelEn: "Rescheduling Or Canceling A Visit",
    labelVi: "Đổi lịch hoặc hủy lịch hẹn",
    category: "health-visit",
    seedInputs: ["I need to change my visit to another day."],
    detectionPatterns: [
      /\b(?:reschedule|change my visit|move my visit|push my visit|cancel my visit|cannot make it|can't make it)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-reschedule-doi-lich",
        label: "\"Đổi lịch\" as \"change calendar\"",
        note: "'Đổi lịch' makes learners reach for 'change my calendar' or 'change my date.' The easy real-life phrase is 'reschedule' or 'move my appointment.' Stay encouraging; the goal is being understood, not perfect words.",
      },
      {
        id: "health-visit-reschedule-sorry-load",
        label: "Heavy apologizing carried over",
        note: "Vietnamese phone manners add long apologies before a request. In English a short 'Sorry, I can't make my appointment tomorrow' is already polite and clear. Let learners keep their warmth without feeling they over-explained.",
      },
    ],
    followUps: [
      { id: "health-visit-reschedule-which", question: "Which appointment do you need to change?", salienceQuestion: "How would you name the {slot} you want to change?" },
      { id: "health-visit-reschedule-why", question: "What short reason would you give?", salienceQuestion: "What simple reason would you give for the {slot}?" },
      { id: "health-visit-reschedule-newtime", question: "What new day would you ask for instead?", salienceQuestion: "What new time would you suggest for the {slot}?" },
      { id: "health-visit-reschedule-close", question: "How would you thank them and end the call kindly?", salienceQuestion: "How would you close the call about the {slot}?" },
    ],
  },
  {
    id: "topic-health-visit-checking-in",
    labelEn: "Checking In At Reception",
    labelVi: "Làm thủ tục ở quầy tiếp đón",
    category: "health-visit",
    seedInputs: ["I have a visit at ten and I am here to check in."],
    detectionPatterns: [
      /\b(?:check in|i'?m here for my|i have a visit at|front desk|reception desk|sign in sheet|fill in my details)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-checkin-dang-ky",
        label: "\"Đăng ký\" as \"register\"",
        note: "'Đăng ký' pushes learners toward 'I want to register.' At an English front desk the friendly phrase is 'I'm checking in for my appointment.' Both work; gently model the everyday one without marking the other wrong.",
      },
      {
        id: "health-visit-checkin-name-order",
        label: "Family-name-first habit",
        note: "Vietnamese names lead with the family name, so learners may pause when staff ask for a 'first name' or 'last name.' Practising 'My name is …, I have an appointment with Dr. …' builds calm confidence at the desk.",
      },
    ],
    followUps: [
      { id: "health-visit-checkin-name", question: "How would you give your name at the desk?", salienceQuestion: "How would you say your {slot} clearly at the desk?" },
      { id: "health-visit-checkin-who", question: "Which doctor are you there to see?", salienceQuestion: "How would you mention the {slot} you are seeing?" },
      { id: "health-visit-checkin-time", question: "How would you say what time your visit is?", salienceQuestion: "How would you state the {slot} of your visit?" },
      { id: "health-visit-checkin-wait", question: "How would you ask where to wait?", salienceQuestion: "How would you ask about the {slot} while you wait?" },
    ],
  },
  {
    id: "topic-health-visit-describing-symptoms",
    labelEn: "Describing How You Feel",
    labelVi: "Kể về tình trạng sức khỏe",
    category: "health-visit",
    seedInputs: ["I have a sore throat and a cough since Monday."],
    detectionPatterns: [
      /\b(?:sore throat|runny nose|stuffy nose|cough|coughing|tired all the time|not feeling well|feel unwell|under the weather)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-symptoms-bi-passive",
        label: "\"Bị\" turns into \"I am\"",
        note: "Vietnamese marks illness with 'bị' ('bị ho', 'bị sốt'), so learners often say 'I am cough' or 'I am fever.' The natural frame is 'I have a cough' or 'I have a fever.' Welcome the meaning first; the article and verb can come later.",
      },
      {
        id: "health-visit-symptoms-no-tense",
        label: "Time without tense",
        note: "Vietnamese leaves verbs unmarked for time, so 'I sick two days' stands in for 'I've been sick for two days.' Keep the focus on the helpful detail — how long it's lasted — not on the grammar.",
      },
    ],
    followUps: [
      { id: "health-visit-symptoms-what", question: "What feels wrong right now?", salienceQuestion: "How would you describe the {slot} in simple words?" },
      { id: "health-visit-symptoms-since", question: "When did it start?", salienceQuestion: "When did the {slot} first begin?" },
      { id: "health-visit-symptoms-worse", question: "Is it getting better or worse?", salienceQuestion: "Is the {slot} getting better or worse?" },
      { id: "health-visit-symptoms-affect", question: "How is it changing your day?", salienceQuestion: "How does the {slot} affect your day?" },
    ],
  },
  {
    id: "topic-health-visit-where-it-hurts",
    labelEn: "Saying Where It Hurts",
    labelVi: "Chỉ chỗ bị đau",
    category: "health-visit",
    seedInputs: ["My stomach hurts after I eat."],
    detectionPatterns: [
      /\b(?:hurts here|it hurts when|aches?|sharp pain|dull ache|my back hurts|my stomach hurts|my chest feels)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-hurts-dau-noun",
        label: "\"Đau\" placed like \"I am pain\"",
        note: "'Đau bụng' (stomach hurts) leads to 'I am pain stomach' or 'my stomach is pain.' Natural English is 'My stomach hurts' or 'I have a pain in my stomach.' Affirm the location they pointed to before reshaping the phrase.",
      },
      {
        id: "health-visit-hurts-pointing",
        label: "Pointing instead of naming",
        note: "Learners may point and say 'here, here' because body-part words feel hard. Practising a few calm words — 'It hurts here, in my lower back' — gives them a clear, low-pressure script.",
      },
    ],
    followUps: [
      { id: "health-visit-hurts-where", question: "Where exactly does it hurt?", salienceQuestion: "How would you point out the {slot} that hurts?" },
      { id: "health-visit-hurts-kind", question: "Is it a sharp or a dull feeling?", salienceQuestion: "How would you describe the {slot} feeling?" },
      { id: "health-visit-hurts-when", question: "When does it hurt the most?", salienceQuestion: "When does the {slot} hurt the most?" },
      { id: "health-visit-hurts-trigger", question: "What makes it feel better or worse?", salienceQuestion: "What changes the {slot} for you?" },
    ],
  },
  {
    id: "topic-health-visit-how-long",
    labelEn: "Saying How Long You've Felt Unwell",
    labelVi: "Nói bị bao lâu rồi",
    category: "health-visit",
    seedInputs: ["I have felt dizzy for about three days now."],
    detectionPatterns: [
      /\b(?:for three days|for a week|since last (?:night|week|monday)|on and off|comes and goes|started yesterday|a few days now)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-howlong-roi",
        label: "\"Rồi\" without a tense",
        note: "Vietnamese uses 'rồi' for 'already/since,' so learners say 'I dizzy three days already' for 'I've been dizzy for three days.' The duration is the gift to the doctor — celebrate the detail, not the tense.",
      },
      {
        id: "health-visit-howlong-for-since",
        label: "\"For\" and \"since\" mixed up",
        note: "Vietnamese has one word where English splits into 'for' (a length) and 'since' (a starting point). Gentle modelling — 'for two days', 'since Monday' — is plenty; mixing them is a normal stage, not a failure.",
      },
    ],
    followUps: [
      { id: "health-visit-howlong-duration", question: "How long have you felt this way?", salienceQuestion: "How long has the {slot} been going on?" },
      { id: "health-visit-howlong-start", question: "What day did it start?", salienceQuestion: "When did the {slot} start?" },
      { id: "health-visit-howlong-pattern", question: "Is it there all the time or does it come and go?", salienceQuestion: "Does the {slot} stay or come and go?" },
      { id: "health-visit-howlong-change", question: "Has anything changed since it began?", salienceQuestion: "How has the {slot} changed since it began?" },
    ],
  },
  {
    id: "topic-health-visit-child-sick",
    labelEn: "Talking About A Sick Child",
    labelVi: "Kể về con đang bị ốm",
    category: "health-visit",
    seedInputs: ["My daughter has a high temperature and won't eat."],
    detectionPatterns: [
      /\b(?:my son has|my daughter has|my child has|high temperature|won'?t eat|keeps crying|very fussy|not sleeping well)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-child-temperature",
        label: "\"Nóng\" for fever",
        note: "Parents may say 'my child is hot' from 'cháu bị nóng/sốt,' meaning a fever. English carers say 'has a temperature' or 'has a fever.' Honour the worried parent first; the wording is the small part.",
      },
      {
        id: "health-visit-child-age-detail",
        label: "Age and weight come up fast",
        note: "English clinics ask a child's age and sometimes weight early. Vietnamese parents may count age differently (including the first year), so a quick practice of 'She is two years old' eases a common stumble.",
      },
    ],
    followUps: [
      { id: "health-visit-child-who", question: "Who are you bringing in today?", salienceQuestion: "How would you tell them about your {slot}?" },
      { id: "health-visit-child-what", question: "What have you noticed in your child?", salienceQuestion: "How would you describe the {slot} you noticed?" },
      { id: "health-visit-child-since", question: "When did it start?", salienceQuestion: "When did the {slot} begin?" },
      { id: "health-visit-child-worry", question: "What worries you the most?", salienceQuestion: "What about the {slot} worries you most?" },
    ],
  },
  {
    id: "topic-health-visit-pharmacy-counter",
    labelEn: "At The Pharmacy Counter",
    labelVi: "Ở quầy thuốc",
    category: "health-visit",
    seedInputs: ["I'd like to ask the pharmacist about something for a cold."],
    detectionPatterns: [
      /\b(?:pharmacist|something for a cold|something for a cough|behind the counter|at the chemist|do you have anything for)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-pharmacy-nha-thuoc",
        label: "\"Nhà thuốc\" and the helper's name",
        note: "Vietnamese says 'nhà thuốc/tiệm thuốc' and may call any staff 'cô/chú.' In English the person is the 'pharmacist.' A friendly 'Excuse me, can the pharmacist help me?' is all that's needed — no formal title to worry about.",
      },
      {
        id: "health-visit-pharmacy-hesitation",
        label: "Hesitation to ask for advice",
        note: "Asking a stranger for health advice can feel forward for some learners. Reassure them that 'Do you have anything for a sore throat?' is normal and welcome at a counter; asking is expected, not a bother.",
      },
    ],
    followUps: [
      { id: "health-visit-pharmacy-need", question: "What do you need help with today?", salienceQuestion: "How would you explain the {slot} to the pharmacist?" },
      { id: "health-visit-pharmacy-symptom", question: "Which symptom would you mention?", salienceQuestion: "How would you describe the {slot} at the counter?" },
      { id: "health-visit-pharmacy-ask", question: "How would you ask if they have something for it?", salienceQuestion: "How would you ask for help with the {slot}?" },
      { id: "health-visit-pharmacy-thanks", question: "How would you thank them for the advice?", salienceQuestion: "How would you thank them for the {slot} advice?" },
    ],
  },
  {
    id: "topic-health-visit-otc-remedies",
    labelEn: "Asking About Over-The-Counter Remedies",
    labelVi: "Hỏi mua thuốc không cần đơn",
    category: "health-visit",
    seedInputs: ["Is there a cough syrup I can buy without a prescription?"],
    detectionPatterns: [
      /\b(?:over the counter|without a prescription|cough syrup|cold tablets|throat lozenges|something gentle|non-?drowsy)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-otc-uong-thuoc",
        label: "\"Uống thuốc\" as \"drink medicine\"",
        note: "'Uống thuốc' is literally 'drink medicine,' so learners say 'I drink medicine.' English says 'take medicine.' This is one of the most common and harmless carry-overs — meaning is always clear, so keep it light.",
      },
      {
        id: "health-visit-otc-strength",
        label: "Asking for 'strong' medicine",
        note: "Vietnamese learners often ask for 'strong medicine' ('thuốc mạnh'). In English a clearer ask is 'something that works well for a bad cough' or 'something gentle.' Offer the phrasing as an option, never a correction.",
      },
    ],
    followUps: [
      { id: "health-visit-otc-for", question: "What do you want the remedy for?", salienceQuestion: "How would you say what the {slot} is for?" },
      { id: "health-visit-otc-noprescription", question: "How would you ask if you need a prescription?", salienceQuestion: "How would you ask if the {slot} needs a prescription?" },
      { id: "health-visit-otc-form", question: "Do you prefer tablets, syrup, or something else?", salienceQuestion: "Which form of the {slot} would you ask for?" },
      { id: "health-visit-otc-howtake", question: "How would you ask how to take it?", salienceQuestion: "How would you ask how to take the {slot}?" },
    ],
  },
  {
    id: "topic-health-visit-picking-up-medicine",
    labelEn: "Picking Up Your Medicine",
    labelVi: "Lấy thuốc đã kê",
    category: "health-visit",
    seedInputs: ["I'm here to pick up the medicine my doctor sent over."],
    detectionPatterns: [
      /\b(?:pick up (?:my|the) medicine|collect my medicine|ready for collection|is it ready yet|sent over by my doctor|under the name)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-pickup-lay-thuoc",
        label: "\"Lấy thuốc\" as \"take medicine\"",
        note: "'Lấy thuốc' means collect medicine, but 'take' tempts learners into 'I take my medicine' at the counter, which sounds like swallowing it. 'I'm here to pick up my medicine' is the clear counter phrase. Affirm their intent first.",
      },
      {
        id: "health-visit-pickup-name-spelling",
        label: "Spelling the name aloud",
        note: "Staff often look up orders by name, and Vietnamese names with diacritics are hard to spell aloud in English. A short rehearsal of 'It's under Nguyen, N-G-U-Y-E-N' removes a real moment of stress.",
      },
    ],
    followUps: [
      { id: "health-visit-pickup-name", question: "Whose name is the order under?", salienceQuestion: "How would you give the {slot} for the order?" },
      { id: "health-visit-pickup-ready", question: "How would you ask if it's ready?", salienceQuestion: "How would you ask if the {slot} is ready?" },
      { id: "health-visit-pickup-check", question: "How would you check it's the right medicine?", salienceQuestion: "How would you check the {slot} is correct?" },
      { id: "health-visit-pickup-pay", question: "How would you ask about the cost?", salienceQuestion: "How would you ask about the {slot} cost?" },
    ],
  },
  {
    id: "topic-health-visit-prescription-instructions",
    labelEn: "Understanding How To Take Your Medicine",
    labelVi: "Hiểu cách dùng thuốc",
    category: "health-visit",
    seedInputs: ["How many times a day should I take this?"],
    detectionPatterns: [
      /\b(?:how many times a day|with food|on an empty stomach|before bed|how many pills|read the label|how do i take this)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-instructions-ngay-lan",
        label: "\"Ngày … lần\" word order",
        note: "Vietnamese says 'ngày 3 lần' (day 3 times), so learners produce 'day three times' for 'three times a day.' The frequency is the key safety detail — confirm you understood it, then gently model the English order.",
      },
      {
        id: "health-visit-instructions-with-food",
        label: "\"Before/after meals\" anxiety",
        note: "Dosing words like 'on an empty stomach' or 'with food' translate awkwardly from 'lúc đói / sau ăn.' Practising one clear question — 'Do I take it with food?' — lets learners leave sure of the instructions.",
      },
    ],
    followUps: [
      { id: "health-visit-instructions-howoften", question: "How often should you take it?", salienceQuestion: "How would you ask how often to take the {slot}?" },
      { id: "health-visit-instructions-food", question: "Should you take it with food or not?", salienceQuestion: "How would you ask about taking the {slot} with food?" },
      { id: "health-visit-instructions-howmany", question: "How many do you take each time?", salienceQuestion: "How would you ask how many of the {slot} to take?" },
      { id: "health-visit-instructions-howlong", question: "How long should you keep taking it?", salienceQuestion: "How would you ask how long to take the {slot}?" },
    ],
  },
  {
    id: "topic-health-visit-refill",
    labelEn: "Refilling A Prescription",
    labelVi: "Mua thêm thuốc theo đơn",
    category: "health-visit",
    seedInputs: ["I've run out of my blood pressure tablets and need more."],
    detectionPatterns: [
      /\b(?:run out of|repeat prescription|refill|need more of my|same tablets again|out of my (?:tablets|pills)|renew my)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-refill-het-thuoc",
        label: "\"Hết thuốc\" as \"finish medicine\"",
        note: "'Hết thuốc' (out of medicine) becomes 'I finished my medicine,' which can sound like a course was completed. 'I've run out and I need a refill' is the clear counter phrase. Welcome the message, then offer the wording.",
      },
      {
        id: "health-visit-refill-same-as",
        label: "Showing the box instead of naming",
        note: "Learners often hand over the old box rather than name the medicine, which is perfectly fine. Adding one line — 'I need a refill of the same one, please' — gives them words to pair with the gesture.",
      },
    ],
    followUps: [
      { id: "health-visit-refill-which", question: "Which medicine do you need more of?", salienceQuestion: "How would you name the {slot} you need refilled?" },
      { id: "health-visit-refill-out", question: "How would you say you've run out?", salienceQuestion: "How would you explain you're out of the {slot}?" },
      { id: "health-visit-refill-need", question: "How would you ask for a refill?", salienceQuestion: "How would you ask for more of the {slot}?" },
      { id: "health-visit-refill-when", question: "How would you ask when it will be ready?", salienceQuestion: "How would you ask when the {slot} will be ready?" },
    ],
  },
  {
    id: "topic-health-visit-side-effects-allergies",
    labelEn: "Asking About Side Effects And Allergies",
    labelVi: "Hỏi về tác dụng phụ và dị ứng",
    category: "health-visit",
    seedInputs: ["I'm allergic to penicillin, so is this one safe for me?"],
    detectionPatterns: [
      /\b(?:side effects?|allergic to|makes me drowsy|is this safe|any reaction|upset my stomach|safe to take with)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "health-visit-side-di-ung",
        label: "\"Dị ứng\" without \"to\"",
        note: "'Dị ứng' (allergy) leads to 'I allergy penicillin' for 'I'm allergic to penicillin.' This detail keeps the learner safe, so receive it warmly and clearly before modelling 'allergic to.'",
      },
      {
        id: "health-visit-side-tac-dung-phu",
        label: "\"Tác dụng phụ\" as a long phrase",
        note: "'Tác dụng phụ' translates to 'side effects,' but learners may describe the feeling instead ('it makes me sleepy'). Both are useful at the counter — praise the clear description and link it to the phrase 'side effects.'",
      },
    ],
    followUps: [
      { id: "health-visit-side-allergy", question: "Is there anything you're allergic to?", salienceQuestion: "How would you mention the {slot} you react to?" },
      { id: "health-visit-side-effects", question: "How would you ask about side effects?", salienceQuestion: "How would you ask about the {slot} of this medicine?" },
      { id: "health-visit-side-safe", question: "How would you ask if it's safe for you?", salienceQuestion: "How would you ask if the {slot} is safe for you?" },
      { id: "health-visit-side-mix", question: "How would you ask if it's okay with your other medicine?", salienceQuestion: "How would you ask about the {slot} with your other medicine?" },
    ],
  },
] as const;
