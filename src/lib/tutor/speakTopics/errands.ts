import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type FinalThemeSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-errands-daily-list",
    labelEn: "Daily Errands List",
    labelVi: "Danh sách việc vặt hằng ngày",
    category: "errands",
    scenarioDescription:
      "The learner plans several everyday errands, explains priorities, asks for help, and confirms timing across shops, offices, or home tasks.",
    aiRoleDefinition:
      "Act as a helpful friend or assistant who asks what needs to be done, what is urgent, where to go first, and what details must be remembered.",
    conversationDirections: [
      "Ask what errands are on the learner's list today.",
      "Prompt the learner to choose the most urgent errand first.",
      "Practice saying where each errand happens and what item or document is needed.",
      "Ask about opening hours, travel time, and budget.",
      "Practice asking a family member or worker for help.",
      "End by confirming the order of errands and the next action.",
    ],
    warmthPatterns: [
      "Keep the conversation practical and organized.",
      "Use natural everyday phrasing rather than formal office language.",
      "Encourage short sentences that can be reused in real errands.",
    ],
    seedInputs: ["I have many errands to do today."],
    detectionPatterns: [
      /\b(?:errands|to-do list|things to do today|pick up|drop off|run errands|go to the store|finish tasks)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-run-errands",
        label: "Run errands",
        note: "The fixed phrase is 'run errands' or 'do errands.' Learners may translate word by word and say 'go errands.'",
      },
      {
        id: "errands-pick-up",
        label: "Pick up",
        note: "'Lấy đồ' often becomes just 'take.' For collecting something from a place, English usually uses 'pick up.'",
      },
      {
        id: "errands-drop-off",
        label: "Drop off",
        note: "The pair to 'pick up' is 'drop off.' Use it for leaving documents, packages, or a child at a place: 'I need to drop this off first.'",
      },
    ],
    followUps: [
      { id: "errands-list-tasks", question: "What errands are on your list today?", salienceQuestion: "What do you need to do for the {slot}?" },
      { id: "errands-list-first", question: "Which errand should you do first?", salienceQuestion: "What comes first before the {slot}?" },
      { id: "errands-list-place", question: "Where do you need to go?", salienceQuestion: "Where do you need to go for the {slot}?" },
      { id: "errands-list-item", question: "What item or document should you bring?", salienceQuestion: "What should you bring for the {slot}?" },
      { id: "errands-list-confirm", question: "How would you confirm the plan before leaving?", salienceQuestion: "How would you confirm the {slot} plan?" },
      { id: "errands-list-dropoff", question: "What do you need to drop off somewhere?", salienceQuestion: "Where would you drop off the {slot}?" },
    ],
  },
  {
    id: "topic-errands-pharmacy-pickup",
    labelEn: "Pharmacy Pickup",
    labelVi: "Lấy thuốc ở nhà thuốc",
    category: "errands",
    scenarioDescription:
      "The learner picks up medicine, asks about a prescription, confirms name and birth date, checks pickup time, and asks basic usage questions.",
    aiRoleDefinition:
      "Act as a pharmacy clerk who asks for identifying details, checks whether the medicine is ready, and gives simple next-step information.",
    conversationDirections: [
      "Ask whether the learner is picking up a prescription or buying over-the-counter medicine.",
      "Prompt name, birth date, or order number practice without exposing real private details.",
      "Ask whether the medicine is ready, backordered, or needs approval.",
      "Practice asking about dosage label, pickup time, and price.",
      "Ask how the learner would explain a missing or wrong item.",
      "End by confirming medicine name, payment, and pickup bag.",
    ],
    warmthPatterns: [
      "Keep privacy boundaries clear around birth date and health details.",
      "Use simple labels: prescription, refill, ready, not ready, covered.",
      "Stay procedural and avoid medical advice beyond asking the pharmacist.",
    ],
    seedInputs: ["I need to pick up medicine at the pharmacy."],
    detectionPatterns: [
      /\b(?:pharmacy pickup|pick up medicine|prescription|refill|medicine is ready|drugstore|pharmacist|dosage label)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-pharmacy-prescription",
        label: "Pick up a prescription",
        note: "For medicine ordered by a doctor, English often says 'pick up a prescription,' not only 'take medicine.'",
      },
      {
        id: "errands-pharmacy-ready",
        label: "Is it ready?",
        note: "'Đã có chưa?' at a pharmacy maps naturally to 'Is it ready?' or 'Is my prescription ready?'",
      },
      {
        id: "errands-pharmacy-refill",
        label: "Refill",
        note: "A repeat prescription is a 'refill.' A useful sentence is 'I need to refill my prescription' or 'Do I have any refills left?'",
      },
    ],
    followUps: [
      { id: "errands-pharmacy-type", question: "Are you picking up a prescription or buying medicine?", salienceQuestion: "What kind of medicine is the {slot}?" },
      { id: "errands-pharmacy-ready", question: "How would you ask if it is ready?", salienceQuestion: "Is the {slot} ready?" },
      { id: "errands-pharmacy-id", question: "What identifying detail might they ask for?", salienceQuestion: "What detail connects you to the {slot}?" },
      { id: "errands-pharmacy-label", question: "How would you ask about the dosage label?", salienceQuestion: "What does the label say about the {slot}?" },
      { id: "errands-pharmacy-cost", question: "How would you ask about the price or coverage?", salienceQuestion: "What does the {slot} cost?" },
      { id: "errands-pharmacy-refill", question: "How would you ask whether you have a refill left?", salienceQuestion: "Can you refill the {slot}?" },
    ],
  },
  {
    id: "topic-errands-store-return",
    labelEn: "Returning An Item",
    labelVi: "Đổi trả hàng",
    category: "errands",
    scenarioDescription:
      "The learner returns or exchanges an item, explains the problem, shows proof of purchase, and asks about refund, store credit, or replacement.",
    aiRoleDefinition:
      "Act as a store associate who asks what happened, checks receipt or order number, and explains return or exchange options politely.",
    conversationDirections: [
      "Ask what item the learner wants to return or exchange.",
      "Prompt the learner to explain the issue clearly and briefly.",
      "Ask whether they have a receipt, order number, tag, or warranty.",
      "Practice asking for a refund, exchange, repair, or store credit.",
      "Ask about return window, fee, and manager approval if needed.",
      "End by confirming the option chosen and any receipt or confirmation.",
    ],
    warmthPatterns: [
      "Keep the tone polite but clear about the learner's request.",
      "Use real store phrases: refund, exchange, receipt, return policy.",
      "Help the learner avoid over-explaining the problem.",
    ],
    seedInputs: ["I want to return this item because it does not work."],
    detectionPatterns: [
      /\b(?:return this item|exchange this item|refund|store credit|return policy|receipt|does not work|wrong size|damaged item)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-return-refund",
        label: "Ask for a refund",
        note: "Learners may say 'return money.' The natural store phrase is 'Can I get a refund?'",
      },
      {
        id: "errands-return-does-not-work",
        label: "It does not work",
        note: "For a broken product, 'It does not work' is clearer than 'It is not run' or 'It cannot use.'",
      },
      {
        id: "errands-return-store-credit",
        label: "Store credit",
        note: "If a refund is not available, the store may offer 'store credit.' That means money you can spend at the same store later.",
      },
    ],
    followUps: [
      { id: "errands-return-item", question: "What item do you want to return or exchange?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "errands-return-reason", question: "How would you explain the problem briefly?", salienceQuestion: "What happened with the {slot}?" },
      { id: "errands-return-proof", question: "What proof of purchase do you have?", salienceQuestion: "What proof do you have for the {slot}?" },
      { id: "errands-return-option", question: "Do you want a refund, exchange, or repair?", salienceQuestion: "What do you want for the {slot}?" },
      { id: "errands-return-policy", question: "How would you ask about the return policy?", salienceQuestion: "What policy applies to the {slot}?" },
      { id: "errands-return-credit", question: "How would you answer if they offer store credit?", salienceQuestion: "Would store credit work for the {slot}?" },
    ],
  },
  {
    id: "topic-errands-post-office-package",
    labelEn: "Sending A Package",
    labelVi: "Gửi bưu kiện",
    category: "errands",
    scenarioDescription:
      "The learner is at the post office or a shipping counter to send a package to another city, and needs to give the destination, choose a speed, ask the price, and get a tracking number.",
    aiRoleDefinition:
      "Act as a patient postal clerk who asks where the package is going, how fast it should arrive, what is inside, and offers the tracking number.",
    conversationDirections: [
      "Ask where the package is going and what is inside.",
      "Offer a few shipping speeds and their rough prices.",
      "Practice the learner asking for the shipping cost.",
      "Make sure the learner asks for a tracking number.",
      "Confirm the address is written clearly before finishing.",
    ],
    warmthPatterns: [
      "Keep the counter exchange short and practical.",
      "Reassure the learner that asking the price is normal.",
      "Encourage reusable phrases like 'Could I get the tracking number?'",
    ],
    seedInputs: ["I need to send this package to another city."],
    detectionPatterns: [
      /\b(?:send a package|mail this package|post office|shipping label|tracking number|parcel|delivery service)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-post-send-mail",
        label: "Send or mail",
        note: "Vietnamese 'gửi' covers many actions. In English, 'send a package' and 'mail a letter' are the useful errand frames.",
      },
      {
        id: "errands-post-tracking",
        label: "Tracking number",
        note: "A tracking number is often important. Asking for it is normal: 'Could I get the tracking number?'",
      },
      {
        id: "errands-post-weight-price",
        label: "Priced by weight and speed",
        note: "Packages are priced by weight and how fast they go. It is fine to let them weigh it first and ask 'How much to send this?'",
      },
    ],
    followUps: [
      { id: "errands-post-destination", question: "Where is the package going?", salienceQuestion: "How would you give the {slot} destination?" },
      { id: "errands-post-speed", question: "How fast does it need to arrive?", salienceQuestion: "How fast should the {slot} arrive?" },
      { id: "errands-post-price", question: "How would you ask the shipping price?", salienceQuestion: "How much is shipping for the {slot}?" },
      { id: "errands-post-tracking-q", question: "How would you ask for tracking?", salienceQuestion: "How would you track the {slot}?" },
      { id: "errands-post-fragile", question: "How would you say the package is fragile?", salienceQuestion: "How would you protect the {slot}?" },
      { id: "errands-post-insure", question: "How would you ask about insurance?", salienceQuestion: "How would you insure the {slot}?" },
    ],
  },
  {
    id: "topic-errands-pick-up-package",
    labelEn: "Picking Up A Package",
    labelVi: "Nhận bưu kiện",
    category: "errands",
    scenarioDescription:
      "The learner arrives at a counter or locker to collect a package held under their name, and needs to give the name, show a notice or code, prove ID, and sign.",
    aiRoleDefinition:
      "Act as a pickup-desk clerk who asks for the name on the package, the pickup notice or code, and ID, then shows where to sign.",
    conversationDirections: [
      "Ask whose name the package is held under.",
      "Ask for the pickup notice, slip, or locker code.",
      "Prompt the learner to offer ID calmly.",
      "Show the learner where to sign for the package.",
      "Confirm the package is the right one before they leave.",
    ],
    warmthPatterns: [
      "Keep it brief and routine, like a normal pickup.",
      "Reassure the learner that showing ID is standard.",
      "Encourage 'It's under my name' as a reusable line.",
    ],
    seedInputs: ["I am here to pick up a package under my name."],
    detectionPatterns: [
      /\b(?:pick up a package|package pickup|delivery notice|pickup slip|under my name|missed delivery|locker code)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-pickup-under-name",
        label: "Under my name",
        note: "English pickup desks often use 'under my name.' Vietnamese learners may say 'package has my name' and still be understood.",
      },
      {
        id: "errands-pickup-id-ready",
        label: "ID ready",
        note: "Pickup counters often ask for ID. A calm line is 'I have my ID here.'",
      },
      {
        id: "errands-pickup-hours",
        label: "Pickup hours",
        note: "It helps to ask 'What are your pickup hours?' so you do not arrive after the counter has closed for the day.",
      },
    ],
    followUps: [
      { id: "errands-pickup-name", question: "What name is the package under?", salienceQuestion: "What name is on the {slot}?" },
      { id: "errands-pickup-notice", question: "What pickup notice or code do you have?", salienceQuestion: "What code came with the {slot}?" },
      { id: "errands-pickup-id", question: "How would you say you have ID?", salienceQuestion: "What ID would you show for the {slot}?" },
      { id: "errands-pickup-sign", question: "How would you ask where to sign?", salienceQuestion: "Where do you sign for the {slot}?" },
      { id: "errands-pickup-hours-q", question: "How would you ask the pickup hours?", salienceQuestion: "When can you collect the {slot}?" },
      { id: "errands-pickup-hold", question: "How would you ask how long they hold it?", salienceQuestion: "How long will they keep the {slot}?" },
    ],
  },
  {
    id: "topic-errands-bank-deposit",
    labelEn: "At The Bank Counter",
    labelVi: "Ở quầy ngân hàng",
    category: "errands",
    scenarioDescription:
      "The learner is at a bank counter to deposit cash, withdraw money, or ask a quick account question, keeping private details short and clear.",
    aiRoleDefinition:
      "Act as a calm bank teller who asks whether the learner wants to deposit, withdraw, or ask something, which account is involved, and offers a receipt.",
    conversationDirections: [
      "Ask whether the learner wants to deposit, withdraw, or ask a question.",
      "Ask which account the money is for.",
      "Prompt the learner to answer an ID request calmly.",
      "Practice asking for a receipt.",
      "Confirm the amount before finishing.",
    ],
    warmthPatterns: [
      "Keep bank English short; private details stay brief.",
      "Reassure the learner that 'deposit' and 'withdraw' are easy to mix up.",
      "Encourage 'I'd like to deposit this, please' as a model.",
    ],
    seedInputs: ["I would like to deposit this cash into my account."],
    detectionPatterns: [
      /\b(?:bank counter|deposit cash|withdraw money|my account|bank card|account number|bank teller)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-bank-put-money",
        label: "Deposit money",
        note: "Vietnamese learners may say 'put money in my account.' That is clear; 'deposit money' is the bank-counter phrase.",
      },
      {
        id: "errands-bank-privacy",
        label: "Private details",
        note: "Bank English is allowed to be short. Account numbers and balances do not need extra explanation in public.",
      },
      {
        id: "errands-bank-fee",
        label: "Ask about fees",
        note: "It is normal to ask 'Is there a fee for this?' before a transfer or withdrawal, so there is no surprise charge.",
      },
    ],
    followUps: [
      { id: "errands-bank-action", question: "Do you need to deposit, withdraw, or ask a question?", salienceQuestion: "What do you need to do with the {slot}?" },
      { id: "errands-bank-account", question: "Which account is involved?", salienceQuestion: "Which account should receive the {slot}?" },
      { id: "errands-bank-id", question: "How would you answer if they ask for ID?", salienceQuestion: "What ID supports the {slot}?" },
      { id: "errands-bank-receipt", question: "How would you ask for a receipt?", salienceQuestion: "How would you get a receipt for the {slot}?" },
      { id: "errands-bank-fee-q", question: "How would you ask if there is a fee?", salienceQuestion: "What fee applies to the {slot}?" },
      { id: "errands-bank-amount", question: "How would you say the amount clearly?", salienceQuestion: "How would you confirm the {slot} amount?" },
    ],
  },
  {
    id: "topic-errands-laundry-dropoff",
    labelEn: "Dropping Off Laundry",
    labelVi: "Gửi đồ giặt",
    category: "errands",
    scenarioDescription:
      "The learner drops clothes at a laundry or dry-cleaning shop for wash-and-fold, notes any stains or delicate items, and asks the price and when it will be ready.",
    aiRoleDefinition:
      "Act as a friendly laundry-shop worker who asks what service is needed, checks for stains or delicate items, and gives a price and ready time.",
    conversationDirections: [
      "Ask what service the learner needs: wash and fold, or dry clean.",
      "Check whether any item has a stain or is delicate.",
      "Let the learner point and say 'this spot' or 'this is delicate.'",
      "Give a price and a ready time.",
      "Confirm the pickup day before finishing.",
    ],
    warmthPatterns: [
      "Keep it relaxed; pointing is perfectly fine.",
      "Reassure the learner that 'wash and fold' is a normal phrase.",
      "Encourage short item descriptions over long explanations.",
    ],
    seedInputs: ["I would like to drop off these clothes for wash and fold."],
    detectionPatterns: [
      /\b(?:laundry|wash and fold|dry clean|drop off clothes|pick up laundry|stain|delicate)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-laundry-wash-clothes",
        label: "Laundry words",
        note: "Vietnamese 'giặt đồ' may become 'wash clothes' in every setting. At a shop, 'laundry,' 'wash and fold,' and 'dry cleaning' are useful choices.",
      },
      {
        id: "errands-laundry-stain",
        label: "Pointing is fine",
        note: "For stains or delicate items, pointing and saying 'this spot' or 'this shirt is delicate' is enough.",
      },
      {
        id: "errands-laundry-ticket",
        label: "Keep the ticket",
        note: "Shops give a ticket or receipt for pickup. Asking 'Do I need a ticket to pick up?' keeps the exchange smooth.",
      },
    ],
    followUps: [
      { id: "errands-laundry-service", question: "What laundry service do you need?", salienceQuestion: "What should they do with the {slot}?" },
      { id: "errands-laundry-stain-q", question: "Is there a stain or special instruction?", salienceQuestion: "What is special about the {slot}?" },
      { id: "errands-laundry-time", question: "When do you need it ready?", salienceQuestion: "When do you need the {slot} back?" },
      { id: "errands-laundry-price", question: "How would you ask the price?", salienceQuestion: "How much will the {slot} cost?" },
      { id: "errands-laundry-ticket-q", question: "How would you ask about a pickup ticket?", salienceQuestion: "How would you claim the {slot}?" },
      { id: "errands-laundry-pay", question: "How would you ask when to pay?", salienceQuestion: "When do you pay for the {slot}?" },
    ],
  },
  {
    id: "topic-errands-phone-repair",
    labelEn: "Getting A Phone Repaired",
    labelVi: "Sửa điện thoại",
    category: "errands",
    scenarioDescription:
      "The learner brings a phone with a cracked screen or other problem to a repair shop, describes what is wrong, and asks the cost, the time, and when to pick it up.",
    aiRoleDefinition:
      "Act as a repair-shop technician who asks what is wrong with the phone, then gives a rough cost, a repair time, and a pickup time.",
    conversationDirections: [
      "Ask the learner to describe the phone problem.",
      "Offer a rough cost estimate for the repair.",
      "Give an estimated repair time.",
      "Practice the learner asking when to pick it up.",
      "Confirm the problem and price before starting.",
    ],
    warmthPatterns: [
      "Keep the tone helpful and unhurried.",
      "Reassure the learner that asking for an estimate first is smart.",
      "Encourage 'broken,' 'not working,' and 'cracked' as flexible words.",
    ],
    seedInputs: ["My phone screen is cracked. Can you repair it?"],
    detectionPatterns: [
      /\b(?:phone repair|screen is cracked|battery problem|charging port|fix my phone|repair shop|not turning on)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-repair-broken",
        label: "Broken or not working",
        note: "Vietnamese 'hư' can map to many English words. 'Broken,' 'not working,' and 'cracked' cover many repair errands.",
      },
      {
        id: "errands-repair-estimate",
        label: "Ask for estimate",
        note: "Before agreeing, it is normal to ask: 'How much will it cost?' and 'How long will it take?'",
      },
      {
        id: "errands-repair-warranty",
        label: "Warranty on the repair",
        note: "It is fine to ask 'Is there a warranty on the repair?' so you know if a re-fix is free if the problem comes back.",
      },
    ],
    followUps: [
      { id: "errands-repair-problem", question: "What is wrong with the phone?", salienceQuestion: "How would you describe the {slot} problem?" },
      { id: "errands-repair-cost", question: "How would you ask for the cost?", salienceQuestion: "How much to fix the {slot}?" },
      { id: "errands-repair-time", question: "How would you ask how long it will take?", salienceQuestion: "How long will the {slot} take?" },
      { id: "errands-repair-pickup", question: "How would you ask when to pick it up?", salienceQuestion: "When can you pick up the {slot}?" },
      { id: "errands-repair-warranty-q", question: "How would you ask about a warranty?", salienceQuestion: "What warranty covers the {slot}?" },
      { id: "errands-repair-data", question: "How would you ask if your data is safe?", salienceQuestion: "How would you protect data during the {slot}?" },
    ],
  },
  {
    id: "topic-errands-library-card",
    labelEn: "Getting A Library Card",
    labelVi: "Làm thẻ thư viện",
    category: "errands",
    scenarioDescription:
      "The learner asks at a library desk for a library card for themselves or family, checks what documents are needed, and asks about borrowing and return rules.",
    aiRoleDefinition:
      "Act as a welcoming library worker who explains what proof is needed for a card, who can get one, and the basics of borrowing and returns.",
    conversationDirections: [
      "Ask who needs a library card.",
      "Explain what documents, like proof of address, are needed.",
      "Cover whether children or family can get cards.",
      "Practice asking how many books can be borrowed.",
      "Confirm when items must be returned.",
    ],
    warmthPatterns: [
      "Keep the desk tone friendly and welcoming.",
      "Reassure the learner that family questions are expected.",
      "Encourage 'get a library card' over 'make a card.'",
    ],
    seedInputs: ["I would like to get a library card for my family."],
    detectionPatterns: [
      /\b(?:library card|get a card|borrow books|library account|proof of address|children's books|return books)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "errands-library-make-card",
        label: "Get a card",
        note: "Vietnamese 'làm thẻ' may become 'make a card.' In English service desks, 'get a library card' sounds natural.",
      },
      {
        id: "errands-library-family",
        label: "For my family",
        note: "It is okay to ask about cards for children or family members. The desk expects these questions.",
      },
      {
        id: "errands-library-free",
        label: "The card is usually free",
        note: "Public library cards are usually free. Asking 'Is the card free?' is normal, and the answer is often yes.",
      },
    ],
    followUps: [
      { id: "errands-library-who", question: "Who needs a library card?", salienceQuestion: "Who needs the {slot}?" },
      { id: "errands-library-docs", question: "How would you ask what documents are needed?", salienceQuestion: "What documents are needed for the {slot}?" },
      { id: "errands-library-borrow", question: "How would you ask how many books you can borrow?", salienceQuestion: "How many items can you borrow with the {slot}?" },
      { id: "errands-library-return", question: "How would you ask when to return books?", salienceQuestion: "When should you return the {slot}?" },
      { id: "errands-library-free-q", question: "How would you ask if the card is free?", salienceQuestion: "Is there a cost for the {slot}?" },
      { id: "errands-library-online", question: "How would you ask about online or e-book access?", salienceQuestion: "How would you use the {slot} online?" },
    ],
  },
] as const satisfies readonly FinalThemeSpeakTopic[];
