import type { SpeakTopicLibraryEntry as SpeakTopic } from "../speakTopicLibrary";

// Utilities & Internet Setup theme. The move-in essentials a Vietnamese newcomer
// must handle: turning on electricity/gas, getting home internet, picking a phone
// plan, transferring service, deposits and ID, installation visits, bundles, and
// reading the first bill. Deterministic / client-side: no per-turn LLM. Copy is
// warm, adult, low-shame, practical. l1InterferenceNotes quote the Vietnamese
// source phrase with full diacritics and map it to natural English — friendly
// context, NEVER a grammar correction.
export const speakTopics: readonly SpeakTopic[] = [
  {
    id: "topic-utilities-set-up-electricity",
    labelEn: "Setting Up Electricity And Gas",
    labelVi: "Đăng ký điện và ga",
    category: "utilities-setup",
    seedInputs: ["Hi, I just moved in and I'd like to start electricity service."],
    detectionPatterns: [
      /\b(?:set up (?:electricity|power|gas)|start (?:electricity|power) service|turn on the (?:power|electricity)|utility account|new service|move-in date)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "utilities-electric-dien-nuoc",
        label: "Điện and ga are separate",
        note: "Vietnamese 'điện nước' bundles electricity and water in one phrase. In English you usually set them up separately: 'electricity,' 'gas,' and 'water' each have their own account and company.",
      },
      {
        id: "utilities-electric-set-up",
        label: "Set up, start, turn on",
        note: "'Đăng ký điện' can become 'register electricity.' The everyday phrases are 'set up,' 'start,' or 'turn on' service: 'I'd like to set up electricity at my new address.'",
      },
      {
        id: "utilities-electric-start-date",
        label: "Start date matters",
        note: "Companies ask 'When do you want service to start?' Giving the move-in date clearly — 'starting the first of the month' — avoids days without power.",
      },
    ],
    followUps: [
      { id: "utilities-electric-which", question: "Which services do you need: electricity, gas, or both?", salienceQuestion: "What kind of {slot} do you need to start?" },
      { id: "utilities-electric-address", question: "How would you give your new address?", salienceQuestion: "Where should the {slot} be turned on?" },
      { id: "utilities-electric-date", question: "What start date would you ask for?", salienceQuestion: "When should the {slot} begin?" },
      { id: "utilities-electric-confirm", question: "How would you confirm the account is set up?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-utilities-set-up-internet",
    labelEn: "Setting Up Home Internet",
    labelVi: "Lắp mạng internet tại nhà",
    category: "utilities-setup",
    seedInputs: ["I'd like to get home internet installed at my apartment."],
    detectionPatterns: [
      /\b(?:home internet|wifi|wi-fi|internet plan|broadband|install internet|modem|router|internet speed)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "utilities-internet-lap-mang",
        label: "Lắp mạng is 'get internet installed'",
        note: "'Lắp mạng' often becomes 'install net.' Natural English is 'get internet installed' or 'set up home internet.' The provider sends a 'technician' to do the 'installation.'",
      },
      {
        id: "utilities-internet-speed",
        label: "Speed and plans",
        note: "Internet is sold by 'speed' (megabits) and 'plans.' Asking 'Which plan is good for video calls?' is more useful than translating 'mạng mạnh' as 'strong net.'",
      },
      {
        id: "utilities-internet-wifi-router",
        label: "Modem, router, Wi-Fi",
        note: "The box from the company is a 'modem' or 'router'; the wireless signal is 'Wi-Fi.' Asking 'Is the Wi-Fi router included?' is a practical setup question.",
      },
    ],
    followUps: [
      { id: "utilities-internet-plan", question: "What would you use the internet for most?", salienceQuestion: "Which {slot} plan fits your needs?" },
      { id: "utilities-internet-install", question: "How would you ask about installation?", salienceQuestion: "How would you schedule the {slot} install?" },
      { id: "utilities-internet-price", question: "How would you ask the monthly price?", salienceQuestion: "How much is the {slot} each month?" },
      { id: "utilities-internet-equipment", question: "How would you ask if the router is included?", salienceQuestion: "What equipment comes with the {slot}?" },
    ],
  },
  {
    id: "topic-utilities-choose-phone-plan",
    labelEn: "Choosing A Phone Plan",
    labelVi: "Chọn gói điện thoại",
    category: "utilities-setup",
    seedInputs: ["I want a phone plan with enough data and calls to Vietnam."],
    detectionPatterns: [
      /\b(?:phone plan|cell plan|mobile plan|prepaid|monthly plan|data plan|sim card|international calls|unlimited data)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "utilities-phone-goi-cuoc",
        label: "Gói cước is a 'plan'",
        note: "'Gói cước' translates loosely as 'package.' The mobile word is 'plan': 'a monthly plan' or 'a prepaid plan.' 'Which plan has unlimited data?' is a natural question.",
      },
      {
        id: "utilities-phone-data",
        label: "Data, minutes, texts",
        note: "Plans list 'data,' 'minutes,' and 'texts.' Vietnamese learners may say '4G' for everything; in a store, 'How much data does this plan have?' is the clear question.",
      },
      {
        id: "utilities-phone-international",
        label: "Calls to Vietnam",
        note: "For calling family, ask about 'international calls' or 'an international add-on.' Saying 'Does this plan include calls to Vietnam?' gets a direct answer.",
      },
    ],
    followUps: [
      { id: "utilities-phone-need", question: "How much data and calling do you need?", salienceQuestion: "What do you need most from the {slot}?" },
      { id: "utilities-phone-prepaid", question: "Would you prefer prepaid or monthly?", salienceQuestion: "Which kind of {slot} suits you?" },
      { id: "utilities-phone-intl", question: "How would you ask about calls to Vietnam?", salienceQuestion: "How would you ask if the {slot} covers calls home?" },
      { id: "utilities-phone-sim", question: "How would you ask about a SIM card or keeping your number?", salienceQuestion: "How would you set up the {slot}?" },
    ],
  },
  {
    id: "topic-utilities-transfer-service",
    labelEn: "Transferring Service When You Move",
    labelVi: "Chuyển dịch vụ khi chuyển nhà",
    category: "utilities-setup",
    seedInputs: ["I'm moving next week and I need to transfer my service to the new place."],
    detectionPatterns: [
      /\b(?:transfer (?:my )?service|move my account|moving to a new|change my address|disconnect at|reconnect at|new place)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "utilities-transfer-chuyen",
        label: "Transfer, not move the wire",
        note: "'Chuyển dịch vụ' can become 'move the service.' The account word is 'transfer': 'I'd like to transfer my service to my new address.' You keep the same company and account.",
      },
      {
        id: "utilities-transfer-two-dates",
        label: "Two dates",
        note: "A move needs two dates: 'disconnect' (turn off) at the old place and 'reconnect' (turn on) at the new place. Giving both dates avoids paying for an empty home.",
      },
    ],
    followUps: [
      { id: "utilities-transfer-when", question: "When are you moving?", salienceQuestion: "When does the {slot} need to happen?" },
      { id: "utilities-transfer-old", question: "How would you say when to stop service at the old place?", salienceQuestion: "When should the old {slot} end?" },
      { id: "utilities-transfer-new", question: "How would you give the new address?", salienceQuestion: "Where should the {slot} restart?" },
      { id: "utilities-transfer-fee", question: "How would you ask about any transfer fee?", salienceQuestion: "Is there a fee for the {slot}?" },
    ],
  },
  {
    id: "topic-utilities-deposit-id",
    labelEn: "Deposits, ID, And Credit Checks",
    labelVi: "Tiền đặt cọc, giấy tờ và kiểm tra tín dụng",
    category: "utilities-setup",
    seedInputs: ["Do I need to pay a deposit to start service?"],
    detectionPatterns: [
      /\b(?:deposit|security deposit|credit check|social security number|proof of address|photo id|no credit history|down payment)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "utilities-deposit-dat-coc",
        label: "Đặt cọc is a 'deposit'",
        note: "'Tiền đặt cọc' is a 'deposit' or 'security deposit' — money held and often returned later. Asking 'Is the deposit refundable?' tells you if you get it back.",
      },
      {
        id: "utilities-deposit-credit-history",
        label: "No credit history is common",
        note: "Newcomers often have 'no credit history' yet. It is fine to say so: 'I'm new here and don't have credit history yet.' Companies may ask for a deposit instead — that is normal, not a refusal.",
      },
      {
        id: "utilities-deposit-id-words",
        label: "ID and proof of address",
        note: "'Giấy tờ' covers many papers. Companies usually want a 'photo ID' and sometimes 'proof of address.' Recognizing those two phrases helps you bring the right documents.",
      },
    ],
    followUps: [
      { id: "utilities-deposit-need", question: "How would you ask if a deposit is required?", salienceQuestion: "Is a {slot} needed to start service?" },
      { id: "utilities-deposit-refund", question: "How would you ask if the deposit comes back?", salienceQuestion: "Will you get the {slot} back later?" },
      { id: "utilities-deposit-credit", question: "How would you explain you have no credit history yet?", salienceQuestion: "How would you handle the {slot} as a newcomer?" },
      { id: "utilities-deposit-docs", question: "What documents would you ask about?", salienceQuestion: "What documents support the {slot}?" },
    ],
  },
  {
    id: "topic-utilities-install-appointment",
    labelEn: "Scheduling An Installation Visit",
    labelVi: "Hẹn lịch kỹ thuật viên lắp đặt",
    category: "utilities-setup",
    seedInputs: ["When can a technician come to install the internet?"],
    detectionPatterns: [
      /\b(?:installation|technician|service window|appointment window|come to install|set up the equipment|be home for|installer)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "utilities-install-ky-thuat-vien",
        label: "Kỹ thuật viên is the 'technician'",
        note: "'Kỹ thuật viên' is the 'technician' or 'installer' who comes to set things up. 'When can the technician come?' is the natural way to ask for the visit.",
      },
      {
        id: "utilities-install-window",
        label: "A time 'window'",
        note: "Companies give an 'appointment window' like '8 a.m. to noon,' not an exact time. Asking 'What is the appointment window?' helps you plan to be home.",
      },
      {
        id: "utilities-install-be-home",
        label: "Be home for it",
        note: "Someone usually must 'be home' for the install. Saying 'I'll be home that morning' confirms it; 'I be home' is the common slip — keep 'I'll be home.'",
      },
    ],
    followUps: [
      { id: "utilities-install-when", question: "What day works for the installation?", salienceQuestion: "When could the {slot} happen?" },
      { id: "utilities-install-window-q", question: "How would you ask about the time window?", salienceQuestion: "What is the {slot} time window?" },
      { id: "utilities-install-home", question: "How would you say who will be home?", salienceQuestion: "Who will be home for the {slot}?" },
      { id: "utilities-install-prepare", question: "How would you ask what you need to do first?", salienceQuestion: "How would you prepare for the {slot}?" },
    ],
  },
  {
    id: "topic-utilities-bundle-promotion",
    labelEn: "Asking About Bundles And Promotions",
    labelVi: "Hỏi về gói kết hợp và khuyến mãi",
    category: "utilities-setup",
    seedInputs: ["Is there a discount if I get internet and phone together?"],
    detectionPatterns: [
      /\b(?:bundle|package deal|discount|promotion|promo|special offer|sign-up offer|get them together|new customer deal)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "utilities-bundle-khuyen-mai",
        label: "Khuyến mãi is a 'promotion'",
        note: "'Khuyến mãi' maps to 'promotion,' 'promo,' or 'special offer.' Asking 'Is there a new-customer promotion?' is a normal, smart question, not pushy.",
      },
      {
        id: "utilities-bundle-together",
        label: "Bundle them together",
        note: "Getting internet and phone from one company is a 'bundle.' 'Is there a discount if I bundle them?' often saves money each month.",
      },
      {
        id: "utilities-bundle-after-promo",
        label: "Ask what happens after the promo",
        note: "Promo prices often rise later. Asking 'What is the price after the promotion ends?' protects you from a surprise on a future bill.",
      },
    ],
    followUps: [
      { id: "utilities-bundle-ask", question: "How would you ask about a bundle discount?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "utilities-bundle-which", question: "Which services would you combine?", salienceQuestion: "What would you include in the {slot}?" },
      { id: "utilities-bundle-after", question: "How would you ask what the price is after the promo?", salienceQuestion: "What is the {slot} price later on?" },
      { id: "utilities-bundle-contract", question: "How would you ask if it locks you into a contract?", salienceQuestion: "Does the {slot} require a contract?" },
    ],
  },
  {
    id: "topic-utilities-first-bill",
    labelEn: "Understanding Your First Bill",
    labelVi: "Hiểu hóa đơn đầu tiên",
    category: "utilities-setup",
    seedInputs: ["My first bill looks higher than I expected. Can you explain it?"],
    detectionPatterns: [
      /\b(?:first bill|why is my bill|extra charge|setup fee|prorated|taxes and fees|higher than expected|one-time charge)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "utilities-bill-hoa-don",
        label: "Hóa đơn is the 'bill'",
        note: "'Hóa đơn' is the 'bill' (what you owe). A first bill often has a 'setup fee' and 'prorated' (partial-month) charges, which is why it looks higher than usual.",
      },
      {
        id: "utilities-bill-this-charge",
        label: "What is this charge?",
        note: "A calm line is 'What is this charge?' Vietnamese may point and say only the amount; the full English frame helps the agent explain a fee quickly.",
      },
      {
        id: "utilities-bill-taxes-fees",
        label: "Taxes and fees",
        note: "Bills add 'taxes and fees' on top of the plan price. Knowing that phrase explains why the total is more than the advertised monthly price.",
      },
    ],
    followUps: [
      { id: "utilities-bill-which", question: "Which charge looks unclear to you?", salienceQuestion: "What is unclear on the {slot}?" },
      { id: "utilities-bill-setup", question: "How would you ask about a one-time setup fee?", salienceQuestion: "What one-time charge is on the {slot}?" },
      { id: "utilities-bill-prorated", question: "How would you ask why the first month is different?", salienceQuestion: "Why is the first {slot} higher?" },
      { id: "utilities-bill-next", question: "How would you ask what your normal bill will be?", salienceQuestion: "What will the usual {slot} be?" },
    ],
  },
];
