import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Food & ordering theme (D1). Real-life situations a Vietnamese learner meets
// when ordering food and drinks in English. Deterministic / client-side: no
// per-turn LLM. Copy is warm, adult, and low-shame; l1InterferenceNotes name
// genuine Vietnamese→English interference as friendly context, never as a
// grammar correction. (category is "food-ordering" so this theme remains distinct under auto-registration.)
// A9 batch-2 deepening: each topic carries 3 L1 interference notes and 6
// conversation directions (followUps) within the existing schema.
// A8 D5-B deepening: each topic now carries 4 L1 interference notes and 3 seed
// inputs (dialogue/bilingual-context variants), keeping the 6 followUps.
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-food-ordering-cafe-coffee",
    labelEn: "Ordering Coffee At A Café",
    labelVi: "Gọi cà phê ở quán",
    category: "food-ordering",
    seedInputs: [
      "Can I get a small iced coffee, please?",
      "Could I get a hot latte, not too sweet?",
      "One iced coffee with less ice, please.",
    ],
    detectionPatterns: [
      /\b(?:coffee|latte|iced coffee|cappuccino|café|cafe|cup of tea|barista|less ice|no ice)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-cafe-ice-sugar",
        label: "Ice and sweetness the natural way",
        note: "Vietnamese coffee habits travel: learners often want 'ít đá / không đá' (less ice / no ice) or 'ít ngọt' (less sweet). The friendly English is 'Can I get it with less ice?' or 'not too sweet, please.' Keep it about getting the drink you like.",
      },
      {
        id: "fo-cafe-count",
        label: "Two coffees",
        note: "Vietnamese nouns don't change for number, so 'two coffee' feels complete. The natural café form adds the -s: 'two coffees, please.' A tiny detail — no need to stress about it mid-order.",
      },
      {
        id: "fo-cafe-for-name",
        label: "A name for the order",
        note: "In many cafés the barista asks 'What name for the order?' — 'Cho tên gì?' This isn't personal; it's just to call you when it's ready. A short 'It's Linh' is all they need.",
      },
      {
        id: "fo-cafe-for-here-to-go",
        label: "'For here or to go?'",
        note: "The counter often asks 'For here or to go?' — drink in or take away. There's no single Vietnamese phrase, so listen for this pair and answer 'For here' or 'To go.'",
      },
    ],
    followUps: [
      { id: "fo-cafe-drink", question: "Which drink would you like?", salienceQuestion: "What do you like about the {slot}?" },
      { id: "fo-cafe-size", question: "What size do you want — small, medium, or large?", salienceQuestion: "What size would you pick for the {slot}?" },
      { id: "fo-cafe-custom", question: "How would you ask for less ice or less sugar?", salienceQuestion: "How would you adjust the {slot} to your taste?" },
      { id: "fo-cafe-here-go", question: "Is it for here or to go?", salienceQuestion: "Would you have the {slot} for here or to go?" },
      { id: "fo-cafe-milk", question: "How would you ask about milk options, like oat or no milk?", salienceQuestion: "What milk would you choose for the {slot}?" },
      { id: "fo-cafe-name", question: "How would you give your name for the order?", salienceQuestion: "How would you give your name for the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-fast-food-counter",
    labelEn: "Ordering At A Fast-Food Counter",
    labelVi: "Gọi món ở quầy thức ăn nhanh",
    category: "food-ordering",
    seedInputs: [
      "I'll have a cheeseburger and small fries.",
      "Can I get the number three meal?",
      "Two cheeseburgers and a large Coke, please.",
    ],
    detectionPatterns: [
      /\b(?:burger|cheeseburger|fries|combo|value meal|drive[- ]?thru|counter|nuggets|ketchup|set meal)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-fast-illhave",
        label: "The easy ordering frame",
        note: "A short, natural counter frame is 'I'll have…' or 'Can I get…'. It sounds friendlier than a direct translation of 'cho tôi' and works for everything on the menu.",
      },
      {
        id: "fo-fast-combo",
        label: "Combo / meal idea",
        note: "'Combo' or 'meal' means the food plus a drink and side together. Learners sometimes order each part separately; asking 'Is there a combo?' is a useful shortcut.",
      },
      {
        id: "fo-fast-thatsit",
        label: "Closing the order",
        note: "When they ask 'Anything else?', a simple 'That's it, thanks' or 'That's all' ends the order cleanly — no need for a longer sentence.",
      },
      {
        id: "fo-fast-meal-number",
        label: "Ordering by number",
        note: "Many counters list meals by number: 'I'll have the number two.' Vietnamese orders by dish name; using the number is faster and the staff expect it.",
      },
    ],
    followUps: [
      { id: "fo-fast-main", question: "What is the main item you want?", salienceQuestion: "Why did you pick the {slot}?" },
      { id: "fo-fast-getcombo", question: "Do you want it as a combo or just the item?", salienceQuestion: "Would you make the {slot} a combo?" },
      { id: "fo-fast-drink", question: "Which drink goes with it?", salienceQuestion: "What drink would you choose with the {slot}?" },
      { id: "fo-fast-here-go", question: "For here or to go?", salienceQuestion: "Would you take the {slot} to go?" },
      { id: "fo-fast-side", question: "How would you ask to swap the fries for another side?", salienceQuestion: "What side would you choose with the {slot}?" },
      { id: "fo-fast-done", question: "How would you say that is everything?", salienceQuestion: "How would you finish ordering the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-food-stall",
    labelEn: "Ordering At A Food Stall",
    labelVi: "Mua đồ ăn ở quầy hoặc xe đẩy",
    category: "food-ordering",
    seedInputs: [
      "How much for one spring roll?",
      "Two of these, please.",
      "Can I get one with extra chili?",
    ],
    detectionPatterns: [
      /\b(?:food stall|food truck|street food|how much|skewer|one piece|a piece|snack|vendor|cart)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-stall-howmuch",
        label: "Asking the price simply",
        note: "'How much is this?' or 'How much for one?' is the natural way to ask. Pointing and naming the food together — 'How much for one of these?' — makes it easy when the name is hard.",
      },
      {
        id: "fo-stall-onepiece",
        label: "One, or a piece",
        note: "'Một cái' becomes 'one' or 'a piece': 'Can I get one?' / 'Two pieces, please.' Small and friendly — the vendor will follow your hands too.",
      },
      {
        id: "fo-stall-cash",
        label: "Cash and small change",
        note: "Stalls and carts are often cash only. 'Do you take card?' is worth asking first, and having small bills ready makes the order quick.",
      },
      {
        id: "fo-stall-these-those",
        label: "'These' and 'those' save you",
        note: "When you can't say the name, point and use 'these' and 'those': 'two of these, one of those.' Vietnamese 'cái này / cái kia' maps right onto them.",
      },
    ],
    followUps: [
      { id: "fo-stall-item", question: "What food do you want to try?", salienceQuestion: "What looks good about the {slot}?" },
      { id: "fo-stall-qty", question: "How many would you like?", salienceQuestion: "How many of the {slot} do you want?" },
      { id: "fo-stall-price", question: "How would you ask the price?", salienceQuestion: "How would you ask the price of the {slot}?" },
      { id: "fo-stall-extra", question: "Do you want any sauce or extra with it?", salienceQuestion: "What would you add to the {slot}?" },
      { id: "fo-stall-pay", question: "How would you ask if they take card or cash only?", salienceQuestion: "How would you pay for the {slot}?" },
      { id: "fo-stall-point", question: "How would you point and name the food you can't pronounce?", salienceQuestion: "How would you point out the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-asking-menu",
    labelEn: "Asking About The Menu",
    labelVi: "Hỏi về thực đơn",
    category: "food-ordering",
    seedInputs: [
      "What is in this dish?",
      "What do you recommend?",
      "Is this dish spicy?",
    ],
    detectionPatterns: [
      /\b(?:menu|what is in|what's in|recommend|recommendation|special|ingredients|popular dish|is it spicy)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-menu-whatsin",
        label: "What's in it",
        note: "'Cái này có gì?' becomes 'What's in this?' or 'What comes with it?' These two short questions handle most unfamiliar dishes.",
      },
      {
        id: "fo-menu-recommend",
        label: "Asking for a recommendation",
        note: "When the menu is all new, 'What do you recommend?' is warm and natural, and it invites the server to help instead of you guessing.",
      },
      {
        id: "fo-menu-portion-note",
        label: "How big is it",
        note: "Portion size is hard to guess from a menu. 'Is it big enough to share?' or 'How big is it?' is a practical question, especially when ordering for a group.",
      },
      {
        id: "fo-menu-comes-with",
        label: "'What comes with it?'",
        note: "'Đi kèm gì' asks about the sides included. 'What comes with it?' tells you whether rice, fries, or a salad is part of the dish before you order.",
      },
    ],
    followUps: [
      { id: "fo-menu-contents", question: "How would you ask what is in a dish?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "fo-menu-askrec", question: "How would you ask for a recommendation?", salienceQuestion: "How would you ask if the {slot} is good?" },
      { id: "fo-menu-spicy", question: "How would you check if it is spicy?", salienceQuestion: "How would you ask if the {slot} is spicy?" },
      { id: "fo-menu-decide", question: "How would you say you have decided?", salienceQuestion: "How would you choose the {slot}?" },
      { id: "fo-menu-popular", question: "How would you ask what is the most popular dish?", salienceQuestion: "How would you ask if the {slot} is popular?" },
      { id: "fo-menu-portion", question: "How would you ask how big a dish is?", salienceQuestion: "How would you ask about the size of the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-customizing",
    labelEn: "Customizing Your Order",
    labelVi: "Yêu cầu thay đổi món",
    category: "food-ordering",
    seedInputs: [
      "Can I get it with no onions?",
      "Can I have extra cheese?",
      "Not too spicy, please.",
    ],
    detectionPatterns: [
      /\b(?:no onions|extra cheese|less sugar|no ice|on the side|without|add extra|hold the|not too spicy)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-custom-noless",
        label: "No X, less X",
        note: "'Không hành / ít đường' maps cleanly to 'no onions / less sugar.' The polite frame is 'Can I get it with no onions?' or 'less sugar, please.'",
      },
      {
        id: "fo-custom-ontheside",
        label: "On the side",
        note: "'On the side' means served separately, not mixed in — useful for sauce or dressing: 'Can I have the sauce on the side?' It has no single Vietnamese word, so it's worth practicing.",
      },
      {
        id: "fo-custom-hold",
        label: "Hold the…",
        note: "Servers often say 'hold the onions' to mean 'leave out the onions.' You don't have to use it, but recognizing it helps you confirm your change was heard.",
      },
      {
        id: "fo-custom-without",
        label: "'Without' or 'with no'",
        note: "'Cho tôi... không có...' becomes 'with no onions' or 'without onions.' Both are natural; pick whichever comes out first — the server understands either.",
      },
    ],
    followUps: [
      { id: "fo-custom-remove", question: "What ingredient would you leave out?", salienceQuestion: "How would you ask to remove the {slot}?" },
      { id: "fo-custom-add", question: "What extra would you add?", salienceQuestion: "How would you ask for extra {slot}?" },
      { id: "fo-custom-level", question: "How would you ask for less sweet or less spicy?", salienceQuestion: "How would you adjust the {slot} level?" },
      { id: "fo-custom-confirm", question: "How would you confirm the change politely?", salienceQuestion: "How would you confirm the {slot} change?" },
      { id: "fo-custom-side", question: "How would you ask for the sauce on the side?", salienceQuestion: "How would you ask for the {slot} on the side?" },
      { id: "fo-custom-allergy", question: "How would you mention a small change is for a health reason?", salienceQuestion: "How would you explain why you changed the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-allergies-diet",
    labelEn: "Telling Them About Allergies Or Diet",
    labelVi: "Nói về dị ứng hoặc ăn kiêng",
    category: "food-ordering",
    seedInputs: [
      "I am allergic to peanuts.",
      "I'm vegetarian — no meat, please.",
      "Does this contain peanuts?",
    ],
    detectionPatterns: [
      /\b(?:allergic|allergy|peanut|peanuts|gluten|vegetarian|vegan|no pork|can't eat|cannot eat)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-allergy-allergicto",
        label: "Allergic to, not just can't eat",
        note: "For safety, 'I'm allergic to peanuts' is clearer and stronger than 'I can't eat peanuts.' Both are fine in daily life, but the first signals it really matters.",
      },
      {
        id: "fo-allergy-diet",
        label: "Vegetarian and no pork",
        note: "'Ăn chay' is 'I'm vegetarian'; 'không ăn thịt heo' is 'I don't eat pork.' Saying it before you order saves a lot of back-and-forth.",
      },
      {
        id: "fo-allergy-serious-note",
        label: "Making it land as serious",
        note: "For a real allergy, it's okay to be firm: 'It's a serious allergy — please make sure there are no peanuts.' Staff would rather you be clear than polite-but-vague.",
      },
      {
        id: "fo-allergy-contain",
        label: "'Does this contain...?'",
        note: "'Món này có chứa... không' is 'Does this contain peanuts?' This check asks what's inside for safety — clearer than a vague 'is there anything in it?'",
      },
    ],
    followUps: [
      { id: "fo-allergy-state", question: "How would you say your allergy or diet?", salienceQuestion: "How would you explain the {slot} clearly?" },
      { id: "fo-allergy-check", question: "How would you ask if a dish is safe for you?", salienceQuestion: "How would you ask if the {slot} is safe?" },
      { id: "fo-allergy-sub", question: "How would you ask for a substitute?", salienceQuestion: "What could replace the {slot}?" },
      { id: "fo-allergy-confirm", question: "How would you double-check before eating?", salienceQuestion: "How would you confirm the {slot} again?" },
      { id: "fo-allergy-serious", question: "How would you stress that it is a serious allergy?", salienceQuestion: "How would you make the {slot} sound important?" },
      { id: "fo-allergy-kitchen", question: "How would you ask them to check with the kitchen?", salienceQuestion: "How would you ask the kitchen about the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-takeout",
    labelEn: "Ordering Takeout",
    labelVi: "Mua mang về",
    category: "food-ordering",
    seedInputs: [
      "I'd like this to go, please.",
      "Could I get this to go?",
      "Can I have a bag and some chopsticks?",
    ],
    detectionPatterns: [
      /\b(?:to go|take ?out|take ?away|pack it up|box it|for here|a bag|utensils|leftovers)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-takeout-togo",
        label: "To go vs take away",
        note: "In the US the usual word is 'to go' ('Can I get this to go?'); 'take away' is common elsewhere and people understand it too. The counter question 'For here or to go?' is the pair to listen for.",
      },
      {
        id: "fo-takeout-bag",
        label: "Asking for a bag or utensils",
        note: "It's normal to ask 'Could I get a bag?' or 'Can I have some utensils?' — small requests that learners often skip but staff expect.",
      },
      {
        id: "fo-takeout-wait",
        label: "How long is the wait",
        note: "'Mất bao lâu?' becomes 'How long is the wait?' Asking up front lets you decide whether to wait inside or come back.",
      },
      {
        id: "fo-takeout-pack-up",
        label: "'Pack it up' / 'box it up'",
        note: "'Gói lại' lines up with 'pack it up, please' or 'box it up.' Both mean put the food in a container to carry — handy when you have leftovers, too.",
      },
    ],
    followUps: [
      { id: "fo-takeout-say", question: "How would you say you want it to go?", salienceQuestion: "How would you ask to take the {slot} to go?" },
      { id: "fo-takeout-item", question: "What are you ordering to take away?", salienceQuestion: "What would you pack up — the {slot}?" },
      { id: "fo-takeout-extra", question: "How would you ask for a bag or utensils?", salienceQuestion: "How would you ask for a bag for the {slot}?" },
      { id: "fo-takeout-ready", question: "How would you ask when it will be ready?", salienceQuestion: "When will the {slot} be ready?" },
      { id: "fo-takeout-name", question: "How would you give a name for the pickup order?", salienceQuestion: "How would you give your name for the {slot}?" },
      { id: "fo-takeout-napkins", question: "How would you ask for extra napkins or sauce packets?", salienceQuestion: "What extra would you ask for with the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-delivery",
    labelEn: "Food Delivery Orders",
    labelVi: "Đặt đồ ăn giao tận nơi",
    category: "food-ordering",
    seedInputs: [
      "I want to order delivery to my apartment.",
      "Could you deliver to 12 Lê Lợi?",
      "How much is the delivery fee?",
    ],
    detectionPatterns: [
      /\b(?:delivery|deliver|driver|delivery fee|how long will it take|my address|drop it off|order online)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-delivery-address",
        label: "Giving the address clearly",
        note: "Delivery hinges on a clear address: building, floor or unit, then a landmark. 'It's apartment 5B, the building next to the pharmacy' is the kind of detail drivers need.",
      },
      {
        id: "fo-delivery-howlong",
        label: "How long will it take",
        note: "'Mất bao lâu?' is 'How long will it take?' — a natural, polite thing to ask when you order. Tips and delivery fees are also common to ask about.",
      },
      {
        id: "fo-delivery-instructions",
        label: "Leave-at-door instructions",
        note: "Apps often ask for a delivery note. A short instruction like 'Please leave it at the door and text me' is normal and saves a phone call later.",
      },
      {
        id: "fo-delivery-fee-word",
        label: "'Delivery fee'",
        note: "'Phí giao hàng' is the 'delivery fee' — the extra charge to bring the food. Asking 'Is there a delivery fee?' up front avoids a surprise at the door.",
      },
    ],
    followUps: [
      { id: "fo-delivery-items", question: "What do you want to order for delivery?", salienceQuestion: "What would you order — the {slot}?" },
      { id: "fo-delivery-giveaddress", question: "How would you give your address clearly?", salienceQuestion: "How would you describe where the {slot} should go?" },
      { id: "fo-delivery-time", question: "How would you ask how long it will take?", salienceQuestion: "How long will the {slot} take to arrive?" },
      { id: "fo-delivery-pay", question: "How would you ask about the fee or payment?", salienceQuestion: "How would you ask about paying for the {slot}?" },
      { id: "fo-delivery-note", question: "How would you leave a note for the driver?", salienceQuestion: "What note would you leave about the {slot}?" },
      { id: "fo-delivery-wrong", question: "How would you report a missing item after it arrives?", salienceQuestion: "How would you report a problem with the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-reservation",
    labelEn: "Making A Restaurant Reservation",
    labelVi: "Đặt bàn nhà hàng",
    category: "food-ordering",
    seedInputs: [
      "I'd like to book a table for two at seven.",
      "Do you have a table for four tonight?",
      "I'd like to reserve a table for Saturday at six.",
    ],
    detectionPatterns: [
      /\b(?:reservation|reserve|book a table|table for|party of|under the name|tonight at|do you have a table)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-resv-booktable",
        label: "Book / reserve a table",
        note: "'Đặt bàn' is 'book a table' or 'reserve a table.' A complete, natural sentence is 'I'd like to book a table for two at seven.'",
      },
      {
        id: "fo-resv-name",
        label: "Under the name",
        note: "Restaurants ask for a name to hold the table: 'Under the name Linh.' When you arrive you can say 'I have a reservation under Linh.'",
      },
      {
        id: "fo-resv-partyof",
        label: "Party of…",
        note: "Staff may ask 'For how many?' or say 'a party of four.' 'Party' here just means your group — 'A party of four, please' answers it naturally.",
      },
      {
        id: "fo-resv-do-you-have",
        label: "'Do you have a table?' vs booking ahead",
        note: "'Còn bàn không' is 'Do you have a table?' for right now; 'I'd like to book a table' plans ahead. Listen for which one fits your moment.",
      },
    ],
    followUps: [
      { id: "fo-resv-people", question: "How many people is the table for?", salienceQuestion: "How big is the table for the {slot}?" },
      { id: "fo-resv-time", question: "What day and time would you like?", salienceQuestion: "What time would you book the {slot}?" },
      { id: "fo-resv-givename", question: "How would you give your name for the booking?", salienceQuestion: "How would you give your name for the {slot}?" },
      { id: "fo-resv-request", question: "Any special request, like a quiet table?", salienceQuestion: "What would you request for the {slot}?" },
      { id: "fo-resv-confirmcall", question: "How would you confirm the reservation when you arrive?", salienceQuestion: "How would you confirm the {slot} at the door?" },
      { id: "fo-resv-change", question: "How would you call to change the time later?", salienceQuestion: "How would you change the time for the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-for-the-table",
    labelEn: "Ordering For The Whole Table",
    labelVi: "Gọi món cho cả bàn",
    category: "food-ordering",
    seedInputs: [
      "We will share two dishes for the table.",
      "We'll have three dishes to share.",
      "Could we get some extra plates?",
    ],
    detectionPatterns: [
      /\b(?:for the table|we'll have|we will have|to share|family style|for everyone|one for each|split it)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-table-share",
        label: "Sharing for the table",
        note: "Vietnamese meals are often shared family-style, which English handles with 'for the table' or 'to share': 'Can we get this for the table?' Staff understand it right away.",
      },
      {
        id: "fo-table-well",
        label: "We'll have",
        note: "Ordering for a group uses 'we': 'We'll have two of these and one of those.' It's the group version of 'I'll have.'",
      },
      {
        id: "fo-table-extra-plates",
        label: "Plates to share",
        note: "When sharing, it's normal to ask 'Could we get some small plates?' so everyone can serve themselves — a natural request English handles smoothly.",
      },
      {
        id: "fo-table-one-each",
        label: "'One for each of us'",
        note: "When a dish isn't for sharing, 'one for each of us' makes it clear: 'Could we get one for each?' Vietnamese 'mỗi người một phần' maps onto this neatly.",
      },
    ],
    followUps: [
      { id: "fo-table-shared", question: "What dishes will you share for the table?", salienceQuestion: "What would you share — the {slot}?" },
      { id: "fo-table-each", question: "Is anything just for one person?", salienceQuestion: "Who is the {slot} for?" },
      { id: "fo-table-drinks", question: "What drinks for everyone?", salienceQuestion: "What drinks go with the {slot}?" },
      { id: "fo-table-more", question: "How would you ask if anyone wants more?", salienceQuestion: "How would you offer more {slot}?" },
      { id: "fo-table-plates", question: "How would you ask for extra plates to share?", salienceQuestion: "How would you ask for plates for the {slot}?" },
      { id: "fo-table-order-rounds", question: "How would you order more in a second round?", salienceQuestion: "How would you order more {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-bill-paying",
    labelEn: "Asking For The Bill And Paying",
    labelVi: "Xin tính tiền và thanh toán",
    category: "food-ordering",
    seedInputs: [
      "Can we have the bill, please?",
      "Could we get the check, please?",
      "Can we split the bill four ways?",
    ],
    detectionPatterns: [
      /\b(?:the bill|the check|separate checks|split the bill|card or cash|receipt|tip|pay together)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-bill-billcheck",
        label: "The bill or the check",
        note: "'Tính tiền' is 'Can we have the bill, please?' (often 'the check' in the US). A small wave or that one sentence is all you need.",
      },
      {
        id: "fo-bill-split-tip",
        label: "Splitting and tipping",
        note: "'Split the bill' means share the cost; 'separate checks' means each pays their own. Tipping is common in many countries — worth knowing before the bill arrives.",
      },
      {
        id: "fo-bill-together",
        label: "Paying together",
        note: "If you're treating, 'It's on me' or 'I'll get this one' is warm and clear. To pay as a group, 'We'll pay together' avoids confusion at the till.",
      },
      {
        id: "fo-bill-split-ways",
        label: "'Split it four ways'",
        note: "'Chia đều' becomes 'split it four ways' — divide the cost equally among four. Say the number plus 'ways' so the server can total each share.",
      },
    ],
    followUps: [
      { id: "fo-bill-ask", question: "How would you ask for the bill?", salienceQuestion: "How would you ask for the {slot}?" },
      { id: "fo-bill-split", question: "Together or separate checks?", salienceQuestion: "How would you split the {slot}?" },
      { id: "fo-bill-method", question: "How would you say card or cash?", salienceQuestion: "How would you pay the {slot}?" },
      { id: "fo-bill-receipt", question: "How would you ask for a receipt?", salienceQuestion: "How would you ask for the {slot} receipt?" },
      { id: "fo-bill-tip", question: "How would you ask if tip is included?", salienceQuestion: "How would you ask about tip on the {slot}?" },
      { id: "fo-bill-treat", question: "How would you offer to pay for everyone?", salienceQuestion: "How would you offer to cover the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-wrong-order",
    labelEn: "When The Order Is Wrong",
    labelVi: "Khi món ăn bị sai hoặc nguội",
    category: "food-ordering",
    seedInputs: [
      "Sorry, I think this is not what I ordered.",
      "Sorry, I think this is the wrong dish.",
      "I ordered the chicken, not the beef.",
    ],
    detectionPatterns: [
      /\b(?:wrong order|not what i ordered|this is cold|is missing|didn't order|there's a mistake|send it back)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-wrong-soft",
        label: "Polite but clear",
        note: "It's okay to speak up. A warm, natural frame is 'Sorry, I think there's a mix-up' or 'I think this isn't what I ordered.' You're being helpful, not rude — staff want to fix it.",
      },
      {
        id: "fo-wrong-cold-missing",
        label: "Cold or missing",
        note: "Two common ones: 'This is a bit cold, could you warm it up?' and 'I think the fries are missing.' Simple and direct works best.",
      },
      {
        id: "fo-wrong-no-blame",
        label: "Describe, don't blame",
        note: "English handles complaints best by describing the problem, not the person: 'This came out wrong' lands softer than 'You made a mistake,' and still gets it fixed.",
      },
      {
        id: "fo-wrong-i-ordered",
        label: "'I ordered...' (past)",
        note: "Say what you wanted with 'I ordered the chicken.' The past 'ordered' tells the server it already happened — Vietnamese keeps the verb bare, so the -ed is the part to add.",
      },
    ],
    followUps: [
      { id: "fo-wrong-problem", question: "How would you describe what is wrong?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "fo-wrong-ordered", question: "How would you say what you actually ordered?", salienceQuestion: "What did you order instead of the {slot}?" },
      { id: "fo-wrong-fix", question: "How would you ask them to fix it?", salienceQuestion: "How would you ask to fix the {slot}?" },
      { id: "fo-wrong-polite", question: "How would you keep it friendly?", salienceQuestion: "How would you stay polite about the {slot}?" },
      { id: "fo-wrong-cold", question: "How would you say a dish arrived cold?", salienceQuestion: "How would you say the {slot} is cold?" },
      { id: "fo-wrong-remake", question: "How would you ask for a remake or a refund?", salienceQuestion: "How would you ask to redo the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-bakery",
    labelEn: "At The Bakery",
    labelVi: "Ở tiệm bánh",
    category: "food-ordering",
    seedInputs: [
      "Can I get two croissants and a loaf of bread?",
      "Could I get half a dozen rolls?",
      "Is the bread fresh today?",
    ],
    detectionPatterns: [
      /\b(?:bakery|a loaf|loaf of bread|croissant|baguette|a slice|a dozen|pastry|fresh bread|cake)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-bakery-loaf",
        label: "A loaf, a slice, a dozen",
        note: "Bread is uncountable, so you count the container: 'a loaf of bread,' 'a slice of cake,' 'a dozen rolls.' These little measure words are the tricky part — the food names are easy.",
      },
      {
        id: "fo-bakery-fresh",
        label: "Fresh today",
        note: "A natural, friendly question is 'Is this fresh today?' or 'What's fresh?' It also helps you pick when the names are unfamiliar.",
      },
      {
        id: "fo-bakery-sliced-note",
        label: "Sliced or whole",
        note: "For bread, staff often ask 'Sliced or whole?' — 'Cắt lát hay để nguyên?' A short 'Sliced, please' is all you need.",
      },
      {
        id: "fo-bakery-half-dozen",
        label: "'A dozen' and 'half a dozen'",
        note: "'A dozen' is twelve and 'half a dozen' is six. Vietnamese counts by plain number, so these set words are worth knowing: 'half a dozen rolls, please.'",
      },
    ],
    followUps: [
      { id: "fo-bakery-item", question: "What would you like from the bakery?", salienceQuestion: "What would you choose — the {slot}?" },
      { id: "fo-bakery-qty", question: "How many, or a loaf, slice, or dozen?", salienceQuestion: "How much of the {slot} do you want?" },
      { id: "fo-bakery-askfresh", question: "How would you ask if it is fresh today?", salienceQuestion: "How would you ask if the {slot} is fresh?" },
      { id: "fo-bakery-pack", question: "How would you ask them to pack it to go?", salienceQuestion: "How would you pack the {slot} to go?" },
      { id: "fo-bakery-sliced", question: "How would you answer sliced or whole?", salienceQuestion: "Would you have the {slot} sliced or whole?" },
      { id: "fo-bakery-order-ahead", question: "How would you order a cake for a special day?", salienceQuestion: "How would you order the {slot} ahead of time?" },
    ],
  },
  {
    id: "topic-food-ordering-drinks-water",
    labelEn: "Ordering Drinks And Asking For Water",
    labelVi: "Gọi nước uống và xin nước lọc",
    category: "food-ordering",
    seedInputs: [
      "Could I get a glass of water, please?",
      "Could I get a refill, please?",
      "Still water, no ice, please.",
    ],
    detectionPatterns: [
      /\b(?:glass of water|tap water|still or sparkling|a refill|another drink|soda|juice|with ice|bottled water)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "fo-drinks-tapwater",
        label: "Tap water is usually free",
        note: "In many places 'tap water' is free — just ask 'Could I get a glass of water, please?' You may hear 'still or sparkling?' (flat or fizzy). 'Still' is the plain water you expect.",
      },
      {
        id: "fo-drinks-refill",
        label: "Refill and with ice",
        note: "'A refill' means filling the same drink again (sometimes free). 'With ice / no ice' covers 'có đá / không đá.' Both are quick to ask for.",
      },
      {
        id: "fo-drinks-warm-water",
        label: "Warm water is okay to ask for",
        note: "Many Vietnamese diners prefer warm or room-temperature water. It's fine to ask: 'Could I get warm water, no ice?' Staff won't find it strange.",
      },
      {
        id: "fo-drinks-still-sparkling",
        label: "'Still or sparkling?'",
        note: "'Still or sparkling?' means flat or fizzy water. There's no single Vietnamese word, so remember 'still' for plain water and 'sparkling' for the bubbly kind.",
      },
    ],
    followUps: [
      { id: "fo-drinks-choose", question: "What drink would you like?", salienceQuestion: "What do you like about the {slot}?" },
      { id: "fo-drinks-water", question: "How would you ask for tap or bottled water?", salienceQuestion: "How would you ask for the {slot}?" },
      { id: "fo-drinks-askrefill", question: "How would you ask for a refill or another one?", salienceQuestion: "How would you ask for another {slot}?" },
      { id: "fo-drinks-ice", question: "How would you say with ice or no ice?", salienceQuestion: "How would you order the {slot} with or without ice?" },
      { id: "fo-drinks-warm", question: "How would you ask for warm water, no ice?", salienceQuestion: "How would you ask for a warm {slot}?" },
      { id: "fo-drinks-size", question: "How would you ask for a larger size?", salienceQuestion: "What size {slot} would you choose?" },
    ],
  },
] as const;
