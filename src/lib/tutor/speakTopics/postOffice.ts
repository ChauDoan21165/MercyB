import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D3SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics: D3SpeakTopic[] = [
  {
    id: "topic-post-office-send-parcel",
    labelEn: "Sending A Parcel",
    labelVi: "Gửi bưu kiện",
    category: "post-office",
    scenarioDescription:
      "The learner brings a parcel to the post office counter to send domestically, asks about size and weight limits, chooses a service speed, and pays for postage.",
    aiRoleDefinition:
      "Act as a postal clerk who weighs and measures the parcel, explains service options (standard, express, registered), asks whether the contents are fragile, and calculates the total cost.",
    conversationDirections: [
      "Ask the learner to place the parcel on the scale and confirm the weight and dimensions.",
      "Explain the difference between standard post, express, and registered/tracked mail.",
      "Ask whether the contents are fragile and whether insurance is needed.",
      "Guide the learner to ask how long delivery will take for each service option.",
      "Confirm the recipient's address is correct and readable on the label.",
      "End by confirming the tracking number and estimated delivery date.",
    ],
    warmthPatterns: [
      "Make service options clear without jargon: 'Standard takes 3–5 days; express gets there by tomorrow.'",
      "Normalize fragile questions: 'Just want to make sure nothing gets damaged in transit.'",
      "Hand over the tracking slip clearly: 'This number is how you follow the parcel online.'",
    ],
    seedInputs: [
      "I'd like to send this parcel.",
      "How much does it cost to send this?",
      "How long will it take to arrive?",
    ],
    detectionPatterns: [
      /\b(?:send (?:a )?(?:parcel|package|box)|post (?:a )?(?:parcel|package)|how (?:long|much) (?:to send|to post|does it take)|express (?:post|mail)|registered (?:mail|post)|standard post|postage|tracking number|weigh (?:my )?(?:parcel|package))\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "postoffice-send-verb",
        label: "Send vs post vs mail",
        note: "'Gửi' covers send/post/mail. In Australian English 'post a parcel' is natural; in American English 'mail a package' is more common; 'send' works everywhere. 'I'd like to send this parcel' is the universal counter opener that any English-speaking clerk understands immediately.",
      },
      {
        id: "postoffice-send-service",
        label: "Service options vocabulary",
        note: "'Thường / chuyển phát nhanh / có theo dõi' = standard / express / tracked/registered. When the clerk asks 'Which service?', 'Express, please' or 'The cheapest option that gives me a tracking number' are the two most practical answers.",
      },
      {
        id: "postoffice-send-fragile",
        label: "Declaring fragile contents",
        note: "'Hàng dễ vỡ' = fragile. 'The contents are fragile — it's a ceramic piece' tells the clerk to add fragile stickers and handle with care. Some post offices charge a small extra fee; 'Is there a fragile handling fee?' is the follow-up.",
      },
      {
        id: "postoffice-send-tracking",
        label: "Tracking number",
        note: "'Mã theo dõi / mã vận đơn' = tracking number. After paying, ask 'Can I have the tracking number?' if the clerk hasn't handed it over — it lets you check the parcel status online. 'How do I track this online?' gets the website or app name.",
      },
    ],
    followUps: [
      { id: "postoffice-send-weight-fu", question: "How would you ask the clerk how much the parcel weighs and what the weight limit is?", salienceQuestion: "How would you confirm the {slot} weight?" },
      { id: "postoffice-send-service-fu", question: "How would you ask the difference between standard and express post?", salienceQuestion: "How would you compare the two {slot} options?" },
      { id: "postoffice-send-time-fu", question: "How would you ask how long delivery will take for the express option?", salienceQuestion: "How would you ask the {slot} delivery time?" },
      { id: "postoffice-send-fragile-fu", question: "How would you tell the clerk the contents are fragile and ask for extra protection?", salienceQuestion: "How would you flag the {slot} as fragile?" },
      { id: "postoffice-send-tracking-fu", question: "How would you ask for the tracking number after paying?", salienceQuestion: "How would you get the {slot} tracking number?" },
    ],
  },
  {
    id: "topic-post-office-international-customs",
    labelEn: "Sending An International Package",
    labelVi: "Gửi bưu kiện quốc tế với khai báo hải quan",
    category: "post-office",
    scenarioDescription:
      "The learner sends a package overseas — including to Vietnam — and needs to fill in a customs declaration form, declare the contents and value, and choose an international service.",
    aiRoleDefinition:
      "Act as a postal clerk who helps the learner complete a customs declaration form (CN22 or CN23), asks about the contents and declared value, explains prohibited items, and recommends an international service.",
    conversationDirections: [
      "Ask the learner what is in the package and its approximate value for the customs form.",
      "Explain that the customs form requires item description, quantity, and value in the destination currency.",
      "Ask whether the package contains food, liquids, batteries, or other restricted items.",
      "Guide the learner to choose between airmail, economy international, and EMS/express courier.",
      "Practice asking how long international delivery takes and whether tracking is included.",
      "End by confirming the total cost and that the customs label is attached securely.",
    ],
    warmthPatterns: [
      "Demystify the customs form: 'Just write what's inside and its value — I'll show you the boxes.'",
      "Flag restrictions without alarm: 'Some foods can't cross customs — let me check your item.'",
      "Set realistic expectations: 'EMS is about a week; standard airmail can be three to four weeks.'",
    ],
    seedInputs: [
      "I need to send this to Vietnam.",
      "How do I fill in the customs form?",
      "How long does international shipping take?",
    ],
    detectionPatterns: [
      /\b(?:international (?:package|parcel|shipping|mail|post)|send (?:this )?to (?:Vietnam|overseas|abroad)|customs (?:form|declaration|label)|CN22|CN23|declared (?:value|contents)|EMS|airmail|prohibited (?:items|goods)|overseas (?:parcel|package)|customs duty)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "postoffice-intl-customs-form",
        label: "Customs declaration form",
        note: "'Tờ khai hải quan' = customs declaration form (CN22 for small packets, CN23 for larger parcels). The form asks: item description ('clothes', 'books', 'electronics'), quantity, and declared value in local currency. Writing 'gift' is not an item description — 'gift: 2 shirts, value AUD 40' is the correct format.",
      },
      {
        id: "postoffice-intl-declared-value",
        label: "Declared value",
        note: "'Giá trị khai báo' = declared value. Under-declaring to avoid customs duty at the destination is risky — Vietnam customs may open and assess the parcel. 'What value should I declare?' is the question for the clerk. The correct answer is the actual purchase value, not a guess.",
      },
      {
        id: "postoffice-intl-restricted",
        label: "Restricted and prohibited items",
        note: "Items often restricted to Vietnam: fresh food, meats, soil, certain medicines, aerosols, lithium batteries (loose). 'Is [item] allowed in international post to Vietnam?' is the direct question. The clerk checks a reference list — you don't need to know it in advance.",
      },
      {
        id: "postoffice-intl-ems",
        label: "EMS vs airmail",
        note: "'EMS' (Express Mail Service = Dịch vụ Chuyển phát nhanh Quốc tế) takes ~5–7 days to Vietnam and includes tracking. Standard airmail takes 3–4 weeks with no tracking. 'Which is faster — EMS or regular airmail?' and 'Does it include online tracking?' are the two decision questions.",
      },
    ],
    followUps: [
      { id: "postoffice-intl-form-fu", question: "How would you ask the clerk to explain what to write on the customs form?", salienceQuestion: "How would you fill in the {slot} form?" },
      { id: "postoffice-intl-contents-fu", question: "How would you describe the contents and value of your package for the customs declaration?", salienceQuestion: "How would you declare the {slot} contents?" },
      { id: "postoffice-intl-restricted-fu", question: "How would you ask whether a specific item is allowed in international post?", salienceQuestion: "How would you check if the {slot} is permitted?" },
      { id: "postoffice-intl-service-fu", question: "How would you ask the clerk to recommend a service that includes tracking?", salienceQuestion: "How would you choose the best {slot} service?" },
      { id: "postoffice-intl-time-fu", question: "How would you ask how long EMS takes compared to standard airmail?", salienceQuestion: "How would you compare the {slot} delivery times?" },
    ],
  },
  {
    id: "topic-post-office-pickup-package",
    labelEn: "Picking Up A Package",
    labelVi: "Nhận bưu kiện tại bưu điện",
    category: "post-office",
    scenarioDescription:
      "The learner visits the post office to collect a package that couldn't be delivered, shows their ID and collection slip, and handles situations where the notice has expired or someone else is collecting.",
    aiRoleDefinition:
      "Act as a postal clerk who asks for the collection card or notice number, verifies ID, locates the package, and explains what to do if the notice has expired or the addressee sends an authorized person.",
    conversationDirections: [
      "Ask the learner to present the collection card (the yellow slip left by the postie) and photo ID.",
      "Practice reading the notice number and package barcode aloud.",
      "Guide the learner to ask what to do if they lost the collection notice.",
      "Ask about the expiry — packages are typically held for 10–15 days before return.",
      "Practice authorizing someone else to pick up the package: written authority + their ID.",
      "End by confirming the learner has signed for the package and can take it.",
    ],
    warmthPatterns: [
      "Help with the ID check naturally: 'I just need to verify the name matches the package — thank you.'",
      "Explain lost notices without blame: 'No worries — I can look it up with your name and postcode.'",
      "Confirm handover: 'Sign here, and it's all yours.'",
    ],
    seedInputs: [
      "I have a collection notice for a package.",
      "I lost my collection card — can I still pick it up?",
      "My package was returned — how do I get it back?",
    ],
    detectionPatterns: [
      /\b(?:pick up (?:a )?package|collection (?:card|notice|slip)|parcel (?:collection|pickup|locker)|collect (?:a )?(?:parcel|package)|yellow (?:card|slip)|package (?:held|waiting|notice)|sign for (?:a )?(?:parcel|package)|package was returned|authorize (?:someone|another person) to pick up)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "postoffice-pickup-notice",
        label: "Collection card / notice",
        note: "'Thẻ thu thập / phiếu lấy hàng' = collection card. In Australia it's often called 'a card' or 'a slip'; in the UK 'a collection notice.' Saying 'I have a card for a parcel' plus handing over the slip is enough for the clerk to locate the package.",
      },
      {
        id: "postoffice-pickup-id",
        label: "Showing ID",
        note: "The clerk asks 'Can I see some ID?' — a driver's licence or passport is standard. 'Here is my driver's licence' or 'I only have my passport — is that okay?' are the natural responses. Vietnamese learners may not know that a student card is often NOT sufficient; always bring government-issued ID.",
      },
      {
        id: "postoffice-pickup-authorize",
        label: "Sending someone else to collect",
        note: "If a family member needs to collect for you: 'I'd like to authorize my friend to collect my package.' Post offices typically require a written authority note: 'I, [your name], authorize [their name] to collect parcel [tracking number] on my behalf.' Signed and dated. The authorized person also brings their own ID.",
      },
      {
        id: "postoffice-pickup-lost",
        label: "Lost collection notice",
        note: "If the yellow slip was lost: 'I don't have the collection notice, but I know a package is waiting for me.' The clerk looks it up by name and postcode or tracking number. 'I have the tracking number — can you look it up?' gets results fastest.",
      },
    ],
    followUps: [
      { id: "postoffice-pickup-notice-fu", question: "How would you tell the clerk you have a collection notice and want to pick up your package?", salienceQuestion: "How would you present your {slot} notice?" },
      { id: "postoffice-pickup-id-fu", question: "How would you offer your ID to verify your identity?", salienceQuestion: "How would you verify yourself for the {slot}?" },
      { id: "postoffice-pickup-lost-fu", question: "How would you explain you lost your collection slip and ask if you can still collect?", salienceQuestion: "How would you handle a missing {slot} notice?" },
      { id: "postoffice-pickup-expire-fu", question: "How would you ask when the package will be returned if you don't collect it in time?", salienceQuestion: "How would you ask about the {slot} deadline?" },
      { id: "postoffice-pickup-authorize-fu", question: "How would you ask about sending someone else to collect the package on your behalf?", salienceQuestion: "How would you authorize {slot} collection?" },
    ],
  },
  {
    id: "topic-post-office-registered-certified",
    labelEn: "Sending Registered Or Certified Mail",
    labelVi: "Gửi thư bảo đảm hoặc thư có xác nhận",
    category: "post-office",
    scenarioDescription:
      "The learner sends an important letter or document by registered or certified mail, gets proof of posting, and understands the signature-on-delivery and return-receipt options.",
    aiRoleDefinition:
      "Act as a postal clerk who explains the difference between registered and certified mail, confirms proof of posting, explains signature-on-delivery, and processes the transaction.",
    conversationDirections: [
      "Explain the difference between registered mail (tracking + compensation) and certified mail (delivery confirmation only).",
      "Ask why the learner needs the service — legal documents, bank statements, immigration letters — to recommend the right option.",
      "Guide the learner to ask for proof of posting and a receipt.",
      "Practice asking for the signature-on-delivery option so the sender gets confirmation when it's received.",
      "Confirm the delivery address is complete: name, street, suburb, postcode, and country.",
      "End by confirming the lodgement receipt and tracking number.",
    ],
    warmthPatterns: [
      "Match the formality of important documents: 'For legal documents I'd recommend registered — it gives you full tracking and compensation.'",
      "Explain options clearly: 'Signature-on-delivery means they must sign before they get it — useful for important papers.'",
      "Reassure: 'The lodgement receipt is your proof that it left here today.'",
    ],
    seedInputs: [
      "I need to send this by registered mail.",
      "Can I get proof that I sent this?",
      "I need a signature when it's delivered.",
    ],
    detectionPatterns: [
      /\b(?:registered (?:mail|post|letter)|certified (?:mail|letter)|proof of (?:posting|delivery|sending)|signature (?:on delivery|required)|return receipt|lodgement receipt|important (?:document|letter)|legal document|recorded delivery|confirmation of delivery)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "postoffice-reg-difference",
        label: "Registered vs certified mail",
        note: "'Thư bảo đảm' = registered mail (tracked, with compensation for loss). In the US, 'certified mail' gives delivery confirmation but no tracking or compensation; 'registered mail' is the highest security level. In Australia and the UK, 'registered post' covers both. Asking 'Which option gives me proof and tracking?' covers all naming conventions.",
      },
      {
        id: "postoffice-reg-proof",
        label: "Proof of posting",
        note: "'Biên lai gửi thư' = proof of posting / lodgement receipt. 'Can I have proof of posting?' is the phrase. The receipt has the date, time, and reference number — useful if you later need to prove the letter was sent on a specific date (immigration applications, legal deadlines).",
      },
      {
        id: "postoffice-reg-signature",
        label: "Signature on delivery",
        note: "'Yêu cầu chữ ký khi nhận' = signature on delivery. 'I need them to sign for it' is understood, but 'Can I add signature-on-delivery?' is the exact service name. Cost is usually a small add-on fee. Once delivered, you get a digital scan of the signature via the tracking page.",
      },
      {
        id: "postoffice-reg-address",
        label: "Complete delivery address",
        note: "For international registered mail, the address must include: recipient name, street address, city/suburb, postcode, and country. 'Is this address format correct for Vietnam?' is a smart question — some countries need specific formatting for the postal system to route correctly.",
      },
    ],
    followUps: [
      { id: "postoffice-reg-service-fu", question: "How would you ask which service gives you both tracking and proof of delivery?", salienceQuestion: "How would you choose the right {slot} service?" },
      { id: "postoffice-reg-proof-fu", question: "How would you ask for a proof-of-posting receipt?", salienceQuestion: "How would you request the {slot} receipt?" },
      { id: "postoffice-reg-signature-fu", question: "How would you add the signature-on-delivery option to your registered mail?", salienceQuestion: "How would you request {slot} signature confirmation?" },
      { id: "postoffice-reg-address-fu", question: "How would you ask the clerk to check that the international address format is correct?", salienceQuestion: "How would you verify the {slot} address?" },
      { id: "postoffice-reg-tracking-fu", question: "How would you ask how to track the letter online after posting?", salienceQuestion: "How would you track the {slot} letter?" },
    ],
  },
  {
    id: "topic-post-office-problem-missing",
    labelEn: "Reporting A Missing Or Damaged Package",
    labelVi: "Báo cáo bưu kiện bị thất lạc hoặc hư hỏng",
    category: "post-office",
    scenarioDescription:
      "The learner's package has not arrived past the expected delivery date, or arrived damaged, and they need to report it at the post office counter and start an inquiry.",
    aiRoleDefinition:
      "Act as a postal customer service officer who takes the details of the missing or damaged item, explains the inquiry process and timeframe, and helps the learner lodge a formal complaint or claim.",
    conversationDirections: [
      "Ask the learner for the tracking number and the original lodgement date.",
      "Guide the learner to describe what was in the package and its estimated value.",
      "Explain the inquiry timeframe — domestic and international lost-parcel investigation periods.",
      "Practice asking about compensation: 'Am I entitled to a refund or compensation?'",
      "For damaged items: ask about photo evidence and whether the original packaging was kept.",
      "End by confirming the inquiry reference number and the next contact step.",
    ],
    warmthPatterns: [
      "Acknowledge the frustration: 'I understand that's very stressful — let me open an inquiry right away.'",
      "Be clear about timelines: 'It takes about 10 business days to investigate — we'll contact you by email.'",
      "Empower the learner: 'Keep the damaged packaging — the assessor will need photos or the item itself.'",
    ],
    seedInputs: [
      "My package hasn't arrived yet.",
      "My parcel arrived damaged.",
      "How do I make a claim for a lost package?",
    ],
    detectionPatterns: [
      /\b(?:package (?:hasn'?t arrived|is missing|was damaged|not delivered)|missing (?:parcel|package)|damaged (?:parcel|package|item)|lost (?:parcel|package|mail)|make a claim|lodge (?:a )?(?:complaint|inquiry|claim)|compensation for (?:lost|damaged)|inquiry (?:number|reference)|where is my (?:parcel|package))\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "postoffice-missing-inquiry",
        label: "Lodging an inquiry",
        note: "'Khiếu nại / yêu cầu điều tra' = lodge an inquiry/complaint. 'I'd like to lodge an inquiry about a missing parcel' is the formal phrase at the counter. 'I want to know where my package is' is understood but the word 'inquiry' signals to the clerk that a formal case needs to be opened.",
      },
      {
        id: "postoffice-missing-tracking",
        label: "Tracking number is essential",
        note: "Without the tracking number, the counter staff can only search by name and approximate date — much slower. 'My tracking number is [X] and the parcel was sent on [date]' gives the clerk everything needed to pull up the record in one step.",
      },
      {
        id: "postoffice-missing-damaged",
        label: "Reporting damage",
        note: "For damaged items: 'The package arrived damaged — the contents are broken.' Keep the original box and packaging, and take photos before and after unpacking. The clerk will say 'We'll need photos of the damaged packaging' — 'I have photos on my phone' or 'I brought the box with me' speeds up the assessment.",
      },
      {
        id: "postoffice-missing-compensation",
        label: "Compensation and refunds",
        note: "'Bồi thường' = compensation. 'Am I entitled to compensation?' is the direct question. For registered/insured mail: yes, up to the declared/insured value. For standard uninsured post: usually no compensation, only an apology. 'Was this item insured when it was sent?' determines the answer.",
      },
    ],
    followUps: [
      { id: "postoffice-missing-report-fu", question: "How would you tell the clerk your tracked package hasn't arrived past the expected date?", salienceQuestion: "How would you report the {slot} as missing?" },
      { id: "postoffice-missing-info-fu", question: "How would you give the tracking number and sending date to help the clerk open an inquiry?", salienceQuestion: "How would you provide the {slot} details?" },
      { id: "postoffice-missing-damaged-fu", question: "How would you describe damage to a package that arrived with broken contents?", salienceQuestion: "How would you report the {slot} damage?" },
      { id: "postoffice-missing-comp-fu", question: "How would you ask whether you are entitled to compensation for a lost parcel?", salienceQuestion: "How would you ask about {slot} compensation?" },
      { id: "postoffice-missing-ref-fu", question: "How would you ask for an inquiry reference number so you can follow up later?", salienceQuestion: "How would you get the {slot} reference?" },
    ],
  },
] as const;
