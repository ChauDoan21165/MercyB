import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

type D4ProfessionalSpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const speakTopics = [
  {
    id: "topic-electronics-asking-staff",
    labelEn: "Asking Staff For Help",
    labelVi: "Nhờ nhân viên hỗ trợ",
    category: "shopping",
    scenarioDescription:
      "The learner walks into an electronics or phone store and needs to find a product, ask where something is, or get a staff member's attention without feeling awkward.",
    aiRoleDefinition:
      "Act as a helpful but slightly busy electronics store associate who asks clarifying questions about what the learner is looking for, points them to the right section, and confirms the right product category.",
    conversationDirections: [
      "Have the learner practice getting a staff member's attention politely with 'Excuse me' or 'Hi, could you help me?'",
      "Ask what device, brand, or accessory they are looking for.",
      "Prompt them to describe what the item is for — 'I need a charger for my phone' or 'I'm looking for headphones for calls.'",
      "Guide them to ask where an item is: 'Which aisle?' or 'Could you show me where that is?'",
      "Practice confirming the exact item with 'Is this the right one for…?' before going to the checkout.",
      "End with the learner thanking the associate and confirming the next step.",
    ],
    warmthPatterns: [
      "Stay friendly and slightly informal — 'Sure, what are you looking for today?'",
      "Ask one short clarifying question at a time so the learner can respond naturally.",
      "Encourage confidence: 'Great question — those are right over here.'",
    ],
    seedInputs: [
      "Excuse me, can you help me find a phone charger?",
      "I'm looking for wireless earbuds.",
      "Where are the laptop bags?",
    ],
    detectionPatterns: [
      /\b(?:excuse me|can you help|looking for|where.*(?:charger|cable|headphone|earbuds|laptop|tablet|phone|screen protector)|which aisle|find a|do you have)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "electronics-ask-article",
        label: "A charger vs charger",
        note: "Người Việt hay bỏ mạo từ 'a': nói 'I need charger' thay vì 'I need a charger.' Trong tiếng Anh, danh từ đếm được số ít phải có mạo từ.",
      },
      {
        id: "electronics-ask-attention",
        label: "Getting attention politely",
        note: "'Ơi' → 'Excuse me' (chính thức hơn) hoặc 'Hi, sorry to bother you' (thân thiện hơn). Đừng dùng 'Hey!' với người lạ trong cửa hàng.",
      },
      {
        id: "electronics-ask-purpose",
        label: "Saying what it's for",
        note: "'Tôi cần cái sạc cho điện thoại' → 'I need a charger for my phone.' Dùng 'for + danh từ', không nói 'I need charger of phone.'",
      },
      {
        id: "electronics-ask-vocab",
        label: "Từ vựng cơ bản",
        note: "charger = cục sạc/dây sạc; cable = cáp; earbuds = tai nghe nhét tai; headphones = tai nghe chụp tai; screen protector = kính cường lực/miếng dán màn hình; aisle = lối đi/khu vực.",
      },
      {
        id: "electronics-ask-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Xin lỗi anh/chị, cho em hỏi tai nghe không dây ở đâu ạ?' ↔ EN: 'Excuse me, could you tell me where the wireless earbuds are?'",
      },
    ],
    followUps: [
      { id: "electronics-ask-fu-attention", question: "How would you get a staff member's attention politely?", salienceQuestion: "How would you start asking about the {slot}?" },
      { id: "electronics-ask-fu-describe", question: "How would you describe what you are looking for?", salienceQuestion: "How would you explain you need the {slot}?" },
      { id: "electronics-ask-fu-aisle", question: "How would you ask which aisle or section it is in?", salienceQuestion: "How would you find the {slot} in the store?" },
      { id: "electronics-ask-fu-confirm", question: "How would you confirm you found the right item?", salienceQuestion: "How would you check this is the right {slot}?" },
      { id: "electronics-ask-fu-thanks", question: "How would you thank the associate and end the interaction?", salienceQuestion: "How would you close the conversation about the {slot}?" },
    ],
  },
  {
    id: "topic-electronics-describing-problem",
    labelEn: "Describing A Device Problem",
    labelVi: "Mô tả sự cố thiết bị",
    category: "shopping",
    scenarioDescription:
      "The learner visits the tech support desk or calls a phone store to explain that a device is broken, behaving strangely, or not working, so a technician can diagnose it.",
    aiRoleDefinition:
      "Act as a tech support associate who asks follow-up questions about what the device is doing, how long the problem has been happening, and whether the learner has tried any fixes.",
    conversationDirections: [
      "Have the learner state the problem clearly: 'My phone won't turn on' or 'The screen keeps freezing.'",
      "Ask clarifying questions: 'When did it start?' 'Did it get wet?' 'Have you tried restarting it?'",
      "Practice describing the behavior with 'It keeps…' + '-ing' (It keeps shutting off, It keeps crashing).",
      "Prompt the learner to mention how long the problem has been happening.",
      "Ask whether the device is still under warranty.",
      "Practice asking what the repair will cost and how long it will take.",
    ],
    warmthPatterns: [
      "Sound patient and diagnostic: 'OK, let me ask a few questions so we can figure out what's happening.'",
      "Avoid technical jargon unless the learner uses it first.",
      "Reassure: 'That sounds like something we can fix.'",
    ],
    seedInputs: [
      "My phone won't charge anymore.",
      "The screen is cracked and it keeps freezing.",
      "My laptop won't turn on.",
    ],
    detectionPatterns: [
      /\b(?:won't (?:turn on|charge|work|connect)|keeps (?:crashing|freezing|shutting off|restarting)|screen is cracked|not working|stopped working|broken|defective|tech support|diagnose|repair)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "electronics-problem-keeps",
        label: "'It keeps + -ing'",
        note: "'Nó cứ tắt máy' → 'It keeps shutting off.' Người Việt thường nói 'It always off' hoặc 'It shut off always.' Cấu trúc đúng: 'It keeps + V-ing.'",
      },
      {
        id: "electronics-problem-charge",
        label: "Charge vs plug in",
        note: "'Sạc' trong tiếng Việt dùng cho cả động từ (sạc điện thoại) lẫn danh từ (cục sạc). Tiếng Anh: to charge = sạc pin; to plug in = cắm điện; charger = cục sạc. 'My phone won't charge' ≠ 'My phone won't plug in.'",
      },
      {
        id: "electronics-problem-broken",
        label: "Broken / not working / defective",
        note: "'Bị hỏng' → 'broken' (hỏng nặng), 'not working' (không hoạt động), 'defective' (lỗi từ nhà sản xuất — dùng khi yêu cầu bảo hành). 'It doesn't work' (đúng) ≠ 'It is not work' (sai).",
      },
      {
        id: "electronics-problem-since",
        label: "How long / since when",
        note: "'Nó hỏng từ hôm qua' → 'It stopped working yesterday.' Hoặc: 'It's been like this since yesterday.' Tránh nói 'It broken from yesterday' (thiếu trợ động từ).",
      },
      {
        id: "electronics-problem-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Điện thoại của em cứ tắt tự động, sạc cũng không vào ạ.' ↔ EN: 'My phone keeps shutting off by itself and it's not charging anymore.'",
      },
    ],
    followUps: [
      { id: "electronics-problem-fu-state", question: "How would you describe what the device is doing wrong?", salienceQuestion: "How would you explain the problem with the {slot}?" },
      { id: "electronics-problem-fu-since", question: "How would you say when the problem started?", salienceQuestion: "When did the {slot} start having this issue?" },
      { id: "electronics-problem-fu-tried", question: "How would you say what you have already tried?", salienceQuestion: "What have you done to fix the {slot}?" },
      { id: "electronics-problem-fu-warranty", question: "How would you ask if the repair is covered under warranty?", salienceQuestion: "Is the {slot} issue covered by warranty?" },
      { id: "electronics-problem-fu-cost", question: "How would you ask how much the repair will cost?", salienceQuestion: "What will it cost to fix the {slot}?" },
      { id: "electronics-problem-fu-time", question: "How would you ask how long the repair will take?", salienceQuestion: "How long will the {slot} take to repair?" },
    ],
  },
  {
    id: "topic-electronics-comparing-specs",
    labelEn: "Comparing Product Specs",
    labelVi: "So sánh thông số kỹ thuật",
    category: "shopping",
    scenarioDescription:
      "The learner stands in front of two or three similar products and asks a sales associate to explain the differences in plain language — storage, battery, camera, speed — so they can decide which one to buy.",
    aiRoleDefinition:
      "Act as a knowledgeable sales associate who explains spec differences in simple terms, asks what the learner mainly uses the device for, and guides them to the best fit without being pushy.",
    conversationDirections: [
      "Have the learner ask the key question: 'What is the difference between these two?'",
      "Ask what the learner uses the device for: calls and texts, gaming, photos, video editing.",
      "Explain storage vs RAM in simple terms: 'Storage is how much you can save; memory/RAM is how fast it runs tasks.'",
      "Compare battery life, camera quality, and price in plain language.",
      "Practice asking 'Which one do you recommend for…?' and 'Is this one worth the extra cost?'",
      "Confirm the learner's decision and lead toward the purchase.",
    ],
    warmthPatterns: [
      "Match the learner's level — if they use simple words, answer simply.",
      "Never make the learner feel foolish for not knowing tech terms.",
      "End recommendations with a practical reason: 'For everyday use, this one is the better value.'",
    ],
    seedInputs: [
      "What is the difference between these two phones?",
      "Which one has more storage?",
      "I mainly use it for photos — which is better?",
    ],
    detectionPatterns: [
      /\b(?:difference between|which one|more storage|better camera|battery life|RAM|processor|specs?|recommend|worth the (?:price|cost|extra)|faster|comparing)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "electronics-specs-memory-storage",
        label: "Memory vs storage (RAM vs dung lượng)",
        note: "'Bộ nhớ' trong tiếng Việt dùng cho cả RAM lẫn storage. Tiếng Anh phân biệt: storage (lưu trữ — 128 GB, 256 GB) = bộ nhớ trong/dung lượng; RAM/memory = bộ nhớ tạm (4 GB, 8 GB). Nói 'I need more storage' khi muốn lưu nhiều ảnh, không phải 'I need more memory.'",
      },
      {
        id: "electronics-specs-fast",
        label: "Fast vs high-performance vs powerful",
        note: "'Máy nhanh' → 'It's fast' (OK cho nói chuyện thông thường) hoặc 'It's more powerful / higher performance' (chính xác hơn). Tránh nói 'This phone has more fast' (sai so sánh).",
      },
      {
        id: "electronics-specs-screen",
        label: "Screen / display / monitor",
        note: "'Màn hình' = screen hoặc display (cho điện thoại/máy tính bảng); monitor (cho màn hình rời của máy tính bàn). 'The screen is bright' (đúng cho phone). 'The monitor resolution' (đúng cho desktop screen).",
      },
      {
        id: "electronics-specs-worth",
        label: "Worth it / worth the price",
        note: "'Có đáng tiền không?' → 'Is it worth the price?' hoặc 'Is this worth the extra money?' Tránh 'Is this worth it the price?' (thêm 'it' thừa).",
      },
      {
        id: "electronics-specs-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Hai cái này khác nhau chỗ nào vậy anh/chị? Em hay chụp ảnh nên không biết cái nào tốt hơn.' ↔ EN: 'What is the difference between these two? I use it mainly for photos — which one would you recommend?'",
      },
    ],
    followUps: [
      { id: "electronics-specs-fu-diff", question: "How would you ask what the difference is between two models?", salienceQuestion: "How would you compare two versions of the {slot}?" },
      { id: "electronics-specs-fu-use", question: "How would you explain what you mainly use the device for?", salienceQuestion: "How would you tell them how you use the {slot}?" },
      { id: "electronics-specs-fu-storage", question: "How would you ask which one has more storage?", salienceQuestion: "How would you ask about storage for the {slot}?" },
      { id: "electronics-specs-fu-battery", question: "How would you ask about battery life?", salienceQuestion: "How long does the battery last on the {slot}?" },
      { id: "electronics-specs-fu-recommend", question: "How would you ask the associate for a recommendation?", salienceQuestion: "Which {slot} would the associate recommend for your use?" },
    ],
  },
  {
    id: "topic-electronics-warranty-plan",
    labelEn: "Understanding The Warranty",
    labelVi: "Hiểu về bảo hành",
    category: "shopping",
    scenarioDescription:
      "The learner is at the checkout and the associate offers an extended warranty or protection plan. The learner needs to ask what it covers, how long it lasts, and decide whether it is worth buying.",
    aiRoleDefinition:
      "Act as a checkout associate who explains the protection plan clearly, answers questions about what is and is not covered, and lets the learner decide without pressure.",
    conversationDirections: [
      "Have the learner ask 'Does this come with a warranty?' before the associate brings it up.",
      "Explain the manufacturer warranty vs the store's extended protection plan.",
      "Practice asking what exactly is covered: 'Does it cover accidental damage?' 'What about the screen?'",
      "Prompt the learner to ask what is NOT covered — 'What if I drop it in water?'",
      "Practice the decision: 'I'll take the protection plan' or 'No thank you, I'll pass on the extended warranty.'",
      "Confirm the total price including the plan and what the claim process looks like.",
    ],
    warmthPatterns: [
      "Be clear about what is and is not covered — no vague 'it covers most things.'",
      "Respect the learner's decision: 'That's totally fine, no problem.'",
      "Use plain numbers: 'The plan is 49 dollars and covers the device for two years.'",
    ],
    seedInputs: [
      "Does this phone come with a warranty?",
      "What does the protection plan cover?",
      "Does it cover accidental damage?",
    ],
    detectionPatterns: [
      /\b(?:warranty|protection plan|extended warranty|cover(?:ed|s)?|accidental damage|manufacturer warranty|claim|what.*covered|does it include)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "electronics-warranty-cover",
        label: "Cover / covered",
        note: "'Bảo hành bao gồm...' → 'The warranty covers...' Người Việt hay nói 'The warranty include' (thiếu 's') hoặc 'It is cover' (sai dạng bị động — đúng là 'It is covered by the warranty').",
      },
      {
        id: "electronics-warranty-accidental",
        label: "Accidental damage",
        note: "'Bảo hành cho vỡ màn hình không?' → 'Does the plan cover accidental damage?' hoặc 'Is a cracked screen covered?' 'Accidental' = vô tình; 'intentional damage' thường không được bảo hành.",
      },
      {
        id: "electronics-warranty-pass",
        label: "Declining politely",
        note: "Để từ chối: 'No thank you, I'll pass on that' hoặc 'I'll skip the protection plan.' Tránh nói 'No, I don't want' (có vẻ cộc lốc). 'I'll pass' là cách lịch sự để từ chối ở Mỹ.",
      },
      {
        id: "electronics-warranty-charge",
        label: "Charge (fee) vs charge (battery)",
        note: "'Charge' có hai nghĩa khác nhau: (1) to charge a fee = tính phí; (2) to charge a battery = sạc pin. 'How much do you charge for the plan?' = phí bao nhiêu? 'The phone is charging' = đang sạc pin.",
      },
      {
        id: "electronics-warranty-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Gói bảo hành này bao gồm những gì ạ? Nếu em lỡ làm vỡ màn hình thì có được bảo hành không?' ↔ EN: 'What exactly does the protection plan cover? If I accidentally crack the screen, is that included?'",
      },
    ],
    followUps: [
      { id: "electronics-warranty-fu-included", question: "How would you ask whether the device comes with a manufacturer warranty?", salienceQuestion: "Does the {slot} include a standard warranty?" },
      { id: "electronics-warranty-fu-covers", question: "How would you ask what the protection plan covers?", salienceQuestion: "What does the plan cover for the {slot}?" },
      { id: "electronics-warranty-fu-accidental", question: "How would you ask whether accidental damage is covered?", salienceQuestion: "Does dropping or cracking the {slot} count?" },
      { id: "electronics-warranty-fu-notcovered", question: "How would you ask what is NOT covered by the plan?", salienceQuestion: "What situation with the {slot} would not be covered?" },
      { id: "electronics-warranty-fu-decline", question: "How would you politely decline the extended warranty?", salienceQuestion: "How would you say no to the plan for the {slot}?" },
    ],
  },
  {
    id: "topic-electronics-returning-defective",
    labelEn: "Returning A Defective Item",
    labelVi: "Trả hàng bị lỗi",
    category: "shopping",
    scenarioDescription:
      "The learner bought an electronic device that turned out to be defective or stopped working shortly after purchase. They return to the store to ask for a refund, exchange, or repair.",
    aiRoleDefinition:
      "Act as a customer service associate at the returns desk who asks for the receipt, asks the learner to describe the defect, checks the return policy, and guides them toward a resolution.",
    conversationDirections: [
      "Have the learner explain why they are returning the item: 'I bought this last week and it stopped working.'",
      "Ask for the receipt and ask whether the learner wants a refund, exchange, or store credit.",
      "Practice describing the defect in clear English: 'The screen is flickering,' 'The battery drains in two hours.'",
      "Explain the return window: 'Our return policy is 30 days from the date of purchase.'",
      "Practice asking 'Can I exchange this for the same model?' or 'Can I get a refund instead?'",
      "Confirm the resolution and what the learner should expect next.",
    ],
    warmthPatterns: [
      "Stay procedural but empathetic: 'I'm sorry that happened — let me take a look.'",
      "Ask for the receipt without making the learner feel guilty.",
      "Be clear about the options available under the return policy.",
    ],
    seedInputs: [
      "I'd like to return this phone — it stopped working.",
      "I bought this tablet last week and the screen is broken.",
      "Can I exchange this for a different model?",
    ],
    detectionPatterns: [
      /\b(?:return|refund|exchange|defective|stopped working|broken|receipt|return policy|within.*days|replace|store credit|swap)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "electronics-return-refund-exchange",
        label: "Refund vs exchange vs replace",
        note: "refund = hoàn tiền; exchange = đổi sang sản phẩm khác; replace = đổi sang cùng sản phẩm đó; store credit = tiền hoàn vào thẻ mua sắm tại cửa hàng. Người Việt hay nói 'I want to change this' — đúng hơn là 'I'd like to exchange this' hoặc 'I'd like a refund.'",
      },
      {
        id: "electronics-return-receipt",
        label: "Receipt not bill",
        note: "'Hóa đơn' hay được dịch là 'bill' nhưng khi trả hàng tại Mỹ, họ hỏi 'Do you have your receipt?' (biên lai mua hàng). 'Bill' thường là hóa đơn cần phải trả (điện, nước, bệnh viện).",
      },
      {
        id: "electronics-return-policy",
        label: "Return policy / return window",
        note: "'Chính sách đổi trả' → 'return policy.' 'Thời gian đổi trả' → 'return window' hoặc 'return period.' 'Our return policy is 30 days' = bạn có 30 ngày để trả hàng.",
      },
      {
        id: "electronics-return-defective",
        label: "Defective vs damaged",
        note: "'Bị lỗi từ nhà máy' → 'defective' (lỗi sản xuất, thường được bảo hành). 'Tôi lỡ làm hỏng' → 'damaged' (hỏng do người dùng, thường không được hoàn tiền). Dùng đúng từ giúp bạn được hỗ trợ tốt hơn.",
      },
      {
        id: "electronics-return-mirror",
        label: "Bilingual mirror",
        note: "VN: 'Dạ em mua cái này hồi tuần trước, nhưng về nhà bật lên thì màn hình bị nhấp nháy, không dùng được ạ.' ↔ EN: 'I bought this last week, but when I got home the screen was flickering and I can't use it at all.'",
      },
    ],
    followUps: [
      { id: "electronics-return-fu-explain", question: "How would you explain why you are returning the item?", salienceQuestion: "How would you describe the problem with the {slot} you are returning?" },
      { id: "electronics-return-fu-receipt", question: "How would you respond if the associate asks for your receipt?", salienceQuestion: "Do you have the receipt for the {slot}?" },
      { id: "electronics-return-fu-options", question: "How would you ask what your return options are?", salienceQuestion: "Can you get a refund or exchange for the {slot}?" },
      { id: "electronics-return-fu-policy", question: "How would you ask what the store's return policy is?", salienceQuestion: "How many days do you have to return the {slot}?" },
      { id: "electronics-return-fu-defective", question: "How would you explain that the item was defective, not damaged by you?", salienceQuestion: "How would you show the {slot} was already broken when you bought it?" },
    ],
  },
] satisfies readonly D4ProfessionalSpeakTopic[];
