import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

export const speakTopics = [
  {
    id: "topic-services-laundry",
    labelEn: "Laundry Service",
    labelVi: "Dịch vụ giặt ủi",
    category: "service",
    seedInputs: ["I want to drop off clothes at the laundry shop."],
    detectionPatterns: [
      /\b(?:laundry|wash and fold|dry clean|clothes to wash|iron my shirt|laundry shop|stain on my clothes)\b/i,
    ],
    followUps: [
      { id: "services-laundry-items", question: "What clothes do you need to wash or iron?", salienceQuestion: "What should the laundry shop do with the {slot}?" },
      { id: "services-laundry-timing", question: "When do you need to pick them up?", salienceQuestion: "When do you need the {slot} ready?" },
      { id: "services-laundry-special", question: "Is there any stain or special care to mention?", salienceQuestion: "What special care does the {slot} need?" },
      { id: "services-laundry-confirm", question: "How would you confirm the price and pickup time?", salienceQuestion: "How would you confirm the price for the {slot}?" },
    ],
  },
  {
    id: "topic-services-haircut",
    labelEn: "Haircut Appointment",
    labelVi: "Cắt tóc",
    category: "service",
    seedInputs: ["I need a simple haircut this afternoon."],
    detectionPatterns: [
      /\b(?:haircut|hair salon|barber|trim my hair|wash my hair|cut my bangs|hair color)\b/i,
    ],
    followUps: [
      { id: "services-haircut-style", question: "What kind of haircut do you want?", salienceQuestion: "How would you describe the {slot} to the barber?" },
      { id: "services-haircut-length", question: "How short should they cut it?", salienceQuestion: "How short should the {slot} be?" },
      { id: "services-haircut-extra", question: "Do you need shampoo, styling, or color too?", salienceQuestion: "What extra service do you want with the {slot}?" },
      { id: "services-haircut-check", question: "What would you say if you want a small change?", salienceQuestion: "What small change would you ask for with the {slot}?" },
    ],
  },
  {
    id: "topic-services-tailoring",
    labelEn: "Tailoring Clothes",
    labelVi: "Sửa quần áo",
    category: "service",
    seedInputs: ["I need to shorten my trousers at the tailor."],
    detectionPatterns: [
      /\b(?:tailor|alter clothes|shorten my pants|fix my dress|sew a button|take in my shirt|hem)\b/i,
    ],
    followUps: [
      { id: "services-tailor-item", question: "What clothing item needs fixing?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "services-tailor-fit", question: "How should it fit after the change?", salienceQuestion: "How should the {slot} fit you?" },
      { id: "services-tailor-deadline", question: "When do you need it back?", salienceQuestion: "When do you need the {slot} finished?" },
      { id: "services-tailor-tryon", question: "How would you ask to try it on first?", salienceQuestion: "How would you ask to try on the {slot}?" },
    ],
  },
  {
    id: "topic-services-phone-plan",
    labelEn: "Mobile Phone Plan",
    labelVi: "Gói cước điện thoại",
    category: "service",
    seedInputs: ["I want to ask about a cheaper mobile data plan."],
    detectionPatterns: [
      /\b(?:mobile plan|phone plan|sim card|data plan|top up|prepaid|postpaid|phone bill|mobile data)\b/i,
    ],
    followUps: [
      { id: "services-mobile-need", question: "What do you use your phone plan for most?", salienceQuestion: "How much {slot} do you need each month?" },
      { id: "services-mobile-budget", question: "What monthly price feels comfortable?", salienceQuestion: "What price would be fair for the {slot}?" },
      { id: "services-mobile-problem", question: "What problem do you have with your current plan?", salienceQuestion: "What problem do you have with the {slot}?" },
      { id: "services-mobile-confirm", question: "How would you confirm the fee before you agree?", salienceQuestion: "How would you confirm the fee for the {slot}?" },
    ],
  },
  {
    id: "topic-services-internet",
    labelEn: "Home Internet Service",
    labelVi: "Dịch vụ internet tại nhà",
    category: "service",
    seedInputs: ["My home internet is slow and I need support."],
    detectionPatterns: [
      /\b(?:home internet|wifi|wi-fi|router|modem|internet service|internet is slow|install internet|fiber internet)\b/i,
    ],
    followUps: [
      { id: "services-internet-issue", question: "What is happening with the internet?", salienceQuestion: "What problem do you notice with the {slot}?" },
      { id: "services-internet-when", question: "When does the problem usually happen?", salienceQuestion: "When is the {slot} slow or unstable?" },
      { id: "services-internet-help", question: "What help do you want from the provider?", salienceQuestion: "What should the provider do about the {slot}?" },
      { id: "services-internet-visit", question: "How would you arrange a technician visit?", salienceQuestion: "How would you arrange help for the {slot}?" },
    ],
  },
  {
    id: "topic-services-delivery",
    labelEn: "Package Delivery",
    labelVi: "Giao nhận bưu kiện",
    category: "service",
    seedInputs: ["I need to ask about my package delivery."],
    detectionPatterns: [
      /\b(?:package delivery|parcel|courier|delivery driver|tracking number|missed delivery|pickup point|send a package)\b/i,
    ],
    followUps: [
      { id: "services-delivery-package", question: "What package are you asking about?", salienceQuestion: "What is inside the {slot}?" },
      { id: "services-delivery-status", question: "What does the tracking status say?", salienceQuestion: "What status do you see for the {slot}?" },
      { id: "services-delivery-address", question: "What address or pickup point should they use?", salienceQuestion: "Where should they deliver the {slot}?" },
      { id: "services-delivery-contact", question: "How would you ask the courier to call before arriving?", salienceQuestion: "How would you ask about delivery of the {slot}?" },
    ],
  },
  {
    id: "topic-services-bank-counter",
    labelEn: "Bank Counter Service",
    labelVi: "Dịch vụ tại quầy ngân hàng",
    category: "service",
    seedInputs: ["I need help at the bank counter with my account."],
    detectionPatterns: [
      /\b(?:bank counter|bank account|cash deposit|withdraw cash|bank card|transfer money|account balance|bank teller)\b/i,
    ],
    followUps: [
      { id: "services-bank-purpose", question: "What do you need to do at the bank?", salienceQuestion: "What do you need help with for the {slot}?" },
      { id: "services-bank-document", question: "What document or card do you need to show?", salienceQuestion: "What document connects to the {slot}?" },
      { id: "services-bank-amount", question: "Is there an amount you need to confirm?", salienceQuestion: "What amount is connected to the {slot}?" },
      { id: "services-bank-receipt", question: "How would you ask for a receipt or confirmation?", salienceQuestion: "How would you ask for proof of the {slot}?" },
    ],
  },
  {
    id: "topic-services-atm-card",
    labelEn: "ATM Or Card Problem",
    labelVi: "Sự cố ATM hoặc thẻ",
    category: "service",
    seedInputs: ["My ATM card did not work and I need help."],
    detectionPatterns: [
      /\b(?:atm|cash machine|debit card|credit card|card is blocked|lost card|pin number|card problem)\b/i,
    ],
    followUps: [
      { id: "services-card-problem", question: "What happened with the card or ATM?", salienceQuestion: "What happened when you used the {slot}?" },
      { id: "services-card-urgent", question: "How urgent is the problem?", salienceQuestion: "Why is the {slot} urgent for you?" },
      { id: "services-card-security", question: "What personal details should you keep private?", salienceQuestion: "What should you not share about the {slot}?" },
      { id: "services-card-next", question: "What next step do you want from the bank?", salienceQuestion: "What help do you want for the {slot}?" },
    ],
  },
  {
    id: "topic-services-motorbike-repair",
    labelEn: "Motorbike Repair",
    labelVi: "Sửa xe máy",
    category: "service",
    seedInputs: ["My motorbike makes a strange noise and needs repair."],
    detectionPatterns: [
      /\b(?:motorbike repair|scooter repair|bike repair|flat tire|oil change|brake problem|engine noise|repair shop)\b/i,
    ],
    followUps: [
      { id: "services-motorbike-problem", question: "What problem do you notice with the motorbike?", salienceQuestion: "What happens when you use the {slot}?" },
      { id: "services-motorbike-timing", question: "When did the problem start?", salienceQuestion: "When did you first notice the {slot}?" },
      { id: "services-motorbike-cost", question: "How would you ask for the repair cost first?", salienceQuestion: "How would you ask the cost to fix the {slot}?" },
      { id: "services-motorbike-pickup", question: "When do you need the motorbike back?", salienceQuestion: "When do you need the {slot} ready?" },
    ],
  },
  {
    id: "topic-services-home-repair",
    labelEn: "Home Repair Visit",
    labelVi: "Sửa chữa trong nhà",
    category: "service",
    seedInputs: ["I need a repair person to fix a leak at home."],
    detectionPatterns: [
      /\b(?:home repair|repair person|plumber|electrician|water leak|broken light|fix the sink|repair visit)\b/i,
    ],
    followUps: [
      { id: "services-home-problem", question: "What needs to be fixed at home?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "services-home-access", question: "When can someone come to your home?", salienceQuestion: "When can someone check the {slot}?" },
      { id: "services-home-photo", question: "What photo or detail could you send first?", salienceQuestion: "What detail would show the {slot} clearly?" },
      { id: "services-home-cost", question: "How would you ask about the service fee?", salienceQuestion: "How would you ask the fee for the {slot}?" },
    ],
  },
  {
    id: "topic-services-apartment-management",
    labelEn: "Apartment Management Office",
    labelVi: "Ban quản lý chung cư",
    category: "service",
    seedInputs: ["I need to talk to apartment management about the elevator."],
    detectionPatterns: [
      /\b(?:apartment management|building management|management office|elevator problem|parking card|resident card|maintenance fee)\b/i,
    ],
    followUps: [
      { id: "services-building-issue", question: "What issue do you need to report?", salienceQuestion: "What should management know about the {slot}?" },
      { id: "services-building-location", question: "Where in the building is the problem?", salienceQuestion: "Where is the {slot} in the building?" },
      { id: "services-building-response", question: "What response do you want from the office?", salienceQuestion: "What should the office do about the {slot}?" },
      { id: "services-building-follow", question: "How would you follow up politely if nobody answers?", salienceQuestion: "How would you follow up about the {slot}?" },
    ],
  },
  {
    id: "topic-services-cleaning",
    labelEn: "House Cleaning Service",
    labelVi: "Dịch vụ dọn nhà",
    category: "service",
    seedInputs: ["I want to book a cleaner for my apartment."],
    detectionPatterns: [
      /\b(?:cleaning service|house cleaner|book a cleaner|clean my apartment|deep cleaning|cleaning fee|cleaning appointment)\b/i,
    ],
    followUps: [
      { id: "services-cleaning-area", question: "What area needs cleaning first?", salienceQuestion: "What should they clean around the {slot}?" },
      { id: "services-cleaning-detail", question: "What task is most important for you?", salienceQuestion: "What detail matters most for the {slot}?" },
      { id: "services-cleaning-supplies", question: "Do you have supplies, or should they bring them?", salienceQuestion: "What supplies are needed for the {slot}?" },
      { id: "services-cleaning-time", question: "How would you confirm the date, time, and fee?", salienceQuestion: "How would you confirm service for the {slot}?" },
    ],
  },
  {
    id: "topic-services-printing-copying",
    labelEn: "Printing And Copying",
    labelVi: "In ấn và photocopy",
    category: "service",
    seedInputs: ["I need to print and copy some documents."],
    detectionPatterns: [
      /\b(?:print documents|copy documents|photocopy|scan documents|printing shop|laminate|passport photo|document print)\b/i,
    ],
    followUps: [
      { id: "services-printing-document", question: "What document do you need to print or copy?", salienceQuestion: "How many copies of the {slot} do you need?" },
      { id: "services-printing-format", question: "Do you need color, black and white, or two-sided printing?", salienceQuestion: "What format do you need for the {slot}?" },
      { id: "services-printing-file", question: "How will you send the file to the shop?", salienceQuestion: "How will you send the {slot}?" },
      { id: "services-printing-check", question: "What would you check before paying?", salienceQuestion: "What would you check on the {slot}?" },
    ],
  },
  {
    id: "topic-services-government-paperwork",
    labelEn: "Local Paperwork Office",
    labelVi: "Làm giấy tờ địa phương",
    category: "service",
    seedInputs: ["I need to ask the local office about paperwork."],
    detectionPatterns: [
      /\b(?:local office|paperwork office|ward office|people's committee|residence paper|certified copy|application form|official stamp)\b/i,
    ],
    followUps: [
      { id: "services-paperwork-purpose", question: "What paperwork do you need help with?", salienceQuestion: "Why do you need the {slot}?" },
      { id: "services-paperwork-docs", question: "What documents should you bring?", salienceQuestion: "What document do you need with the {slot}?" },
      { id: "services-paperwork-step", question: "What step feels unclear?", salienceQuestion: "What is confusing about the {slot}?" },
      { id: "services-paperwork-confirm", question: "How would you confirm the next step politely?", salienceQuestion: "How would you confirm the next step for the {slot}?" },
    ],
  },
  {
    id: "topic-services-gym-membership",
    labelEn: "Gym Membership Service",
    labelVi: "Dịch vụ hội viên phòng gym",
    category: "service",
    seedInputs: ["I want to ask about a gym membership."],
    detectionPatterns: [
      /\b(?:gym membership|fitness membership|monthly gym fee|personal trainer|gym class|freeze my membership|cancel membership)\b/i,
    ],
    followUps: [
      { id: "services-gym-goal", question: "What do you want from the gym membership?", salienceQuestion: "How does the {slot} help your goal?" },
      { id: "services-gym-schedule", question: "When would you usually go?", salienceQuestion: "When would you use the {slot}?" },
      { id: "services-gym-fee", question: "What fee or contract detail do you need to check?", salienceQuestion: "What fee should you check for the {slot}?" },
      { id: "services-gym-change", question: "How would you ask to pause or cancel politely?", salienceQuestion: "How would you change the {slot} politely?" },
    ],
  },
] as const satisfies readonly SpeakTopicLibraryEntry[];
