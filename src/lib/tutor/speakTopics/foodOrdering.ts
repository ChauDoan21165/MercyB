import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Food & ordering theme (D1). Real-life situations a Vietnamese learner meets
// when ordering food and drinks in English. Deterministic / client-side: no
// per-turn LLM. Copy is warm, adult, and low-shame; l1InterferenceNotes name
// genuine Vietnamese→English interference as friendly context, never as a
// grammar correction. (category is "food-ordering" so this theme remains distinct under auto-registration.)
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-food-ordering-cafe-coffee",
    labelEn: "Ordering Coffee At A Café",
    labelVi: "Gọi cà phê ở quán",
    category: "food-ordering",
    seedInputs: ["Can I get a small iced coffee, please?"],
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
    ],
    followUps: [
      { id: "fo-cafe-drink", question: "Which drink would you like?", salienceQuestion: "What do you like about the {slot}?" },
      { id: "fo-cafe-size", question: "What size do you want — small, medium, or large?", salienceQuestion: "What size would you pick for the {slot}?" },
      { id: "fo-cafe-custom", question: "How would you ask for less ice or less sugar?", salienceQuestion: "How would you adjust the {slot} to your taste?" },
      { id: "fo-cafe-here-go", question: "Is it for here or to go?", salienceQuestion: "Would you have the {slot} for here or to go?" },
    ],
  },
  {
    id: "topic-food-ordering-fast-food-counter",
    labelEn: "Ordering At A Fast-Food Counter",
    labelVi: "Gọi món ở quầy thức ăn nhanh",
    category: "food-ordering",
    seedInputs: ["I'll have a cheeseburger and small fries."],
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
    ],
    followUps: [
      { id: "fo-fast-main", question: "What is the main item you want?", salienceQuestion: "Why did you pick the {slot}?" },
      { id: "fo-fast-getcombo", question: "Do you want it as a combo or just the item?", salienceQuestion: "Would you make the {slot} a combo?" },
      { id: "fo-fast-drink", question: "Which drink goes with it?", salienceQuestion: "What drink would you choose with the {slot}?" },
      { id: "fo-fast-here-go", question: "For here or to go?", salienceQuestion: "Would you take the {slot} to go?" },
    ],
  },
  {
    id: "topic-food-ordering-food-stall",
    labelEn: "Ordering At A Food Stall",
    labelVi: "Mua đồ ăn ở quầy hoặc xe đẩy",
    category: "food-ordering",
    seedInputs: ["How much for one spring roll?"],
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
    ],
    followUps: [
      { id: "fo-stall-item", question: "What food do you want to try?", salienceQuestion: "What looks good about the {slot}?" },
      { id: "fo-stall-qty", question: "How many would you like?", salienceQuestion: "How many of the {slot} do you want?" },
      { id: "fo-stall-price", question: "How would you ask the price?", salienceQuestion: "How would you ask the price of the {slot}?" },
      { id: "fo-stall-extra", question: "Do you want any sauce or extra with it?", salienceQuestion: "What would you add to the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-asking-menu",
    labelEn: "Asking About The Menu",
    labelVi: "Hỏi về thực đơn",
    category: "food-ordering",
    seedInputs: ["What is in this dish?"],
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
    ],
    followUps: [
      { id: "fo-menu-contents", question: "How would you ask what is in a dish?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "fo-menu-askrec", question: "How would you ask for a recommendation?", salienceQuestion: "How would you ask if the {slot} is good?" },
      { id: "fo-menu-spicy", question: "How would you check if it is spicy?", salienceQuestion: "How would you ask if the {slot} is spicy?" },
      { id: "fo-menu-decide", question: "How would you say you have decided?", salienceQuestion: "How would you choose the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-customizing",
    labelEn: "Customizing Your Order",
    labelVi: "Yêu cầu thay đổi món",
    category: "food-ordering",
    seedInputs: ["Can I get it with no onions?"],
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
    ],
    followUps: [
      { id: "fo-custom-remove", question: "What ingredient would you leave out?", salienceQuestion: "How would you ask to remove the {slot}?" },
      { id: "fo-custom-add", question: "What extra would you add?", salienceQuestion: "How would you ask for extra {slot}?" },
      { id: "fo-custom-level", question: "How would you ask for less sweet or less spicy?", salienceQuestion: "How would you adjust the {slot} level?" },
      { id: "fo-custom-confirm", question: "How would you confirm the change politely?", salienceQuestion: "How would you confirm the {slot} change?" },
    ],
  },
  {
    id: "topic-food-ordering-allergies-diet",
    labelEn: "Telling Them About Allergies Or Diet",
    labelVi: "Nói về dị ứng hoặc ăn kiêng",
    category: "food-ordering",
    seedInputs: ["I am allergic to peanuts."],
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
    ],
    followUps: [
      { id: "fo-allergy-state", question: "How would you say your allergy or diet?", salienceQuestion: "How would you explain the {slot} clearly?" },
      { id: "fo-allergy-check", question: "How would you ask if a dish is safe for you?", salienceQuestion: "How would you ask if the {slot} is safe?" },
      { id: "fo-allergy-sub", question: "How would you ask for a substitute?", salienceQuestion: "What could replace the {slot}?" },
      { id: "fo-allergy-confirm", question: "How would you double-check before eating?", salienceQuestion: "How would you confirm the {slot} again?" },
    ],
  },
  {
    id: "topic-food-ordering-takeout",
    labelEn: "Ordering Takeout",
    labelVi: "Mua mang về",
    category: "food-ordering",
    seedInputs: ["I'd like this to go, please."],
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
    ],
    followUps: [
      { id: "fo-takeout-say", question: "How would you say you want it to go?", salienceQuestion: "How would you ask to take the {slot} to go?" },
      { id: "fo-takeout-item", question: "What are you ordering to take away?", salienceQuestion: "What would you pack up — the {slot}?" },
      { id: "fo-takeout-extra", question: "How would you ask for a bag or utensils?", salienceQuestion: "How would you ask for a bag for the {slot}?" },
      { id: "fo-takeout-ready", question: "How would you ask when it will be ready?", salienceQuestion: "When will the {slot} be ready?" },
    ],
  },
  {
    id: "topic-food-ordering-delivery",
    labelEn: "Food Delivery Orders",
    labelVi: "Đặt đồ ăn giao tận nơi",
    category: "food-ordering",
    seedInputs: ["I want to order delivery to my apartment."],
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
    ],
    followUps: [
      { id: "fo-delivery-items", question: "What do you want to order for delivery?", salienceQuestion: "What would you order — the {slot}?" },
      { id: "fo-delivery-giveaddress", question: "How would you give your address clearly?", salienceQuestion: "How would you describe where the {slot} should go?" },
      { id: "fo-delivery-time", question: "How would you ask how long it will take?", salienceQuestion: "How long will the {slot} take to arrive?" },
      { id: "fo-delivery-pay", question: "How would you ask about the fee or payment?", salienceQuestion: "How would you ask about paying for the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-reservation",
    labelEn: "Making A Restaurant Reservation",
    labelVi: "Đặt bàn nhà hàng",
    category: "food-ordering",
    seedInputs: ["I'd like to book a table for two at seven."],
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
    ],
    followUps: [
      { id: "fo-resv-people", question: "How many people is the table for?", salienceQuestion: "How big is the table for the {slot}?" },
      { id: "fo-resv-time", question: "What day and time would you like?", salienceQuestion: "What time would you book the {slot}?" },
      { id: "fo-resv-givename", question: "How would you give your name for the booking?", salienceQuestion: "How would you give your name for the {slot}?" },
      { id: "fo-resv-request", question: "Any special request, like a quiet table?", salienceQuestion: "What would you request for the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-for-the-table",
    labelEn: "Ordering For The Whole Table",
    labelVi: "Gọi món cho cả bàn",
    category: "food-ordering",
    seedInputs: ["We will share two dishes for the table."],
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
    ],
    followUps: [
      { id: "fo-table-shared", question: "What dishes will you share for the table?", salienceQuestion: "What would you share — the {slot}?" },
      { id: "fo-table-each", question: "Is anything just for one person?", salienceQuestion: "Who is the {slot} for?" },
      { id: "fo-table-drinks", question: "What drinks for everyone?", salienceQuestion: "What drinks go with the {slot}?" },
      { id: "fo-table-more", question: "How would you ask if anyone wants more?", salienceQuestion: "How would you offer more {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-bill-paying",
    labelEn: "Asking For The Bill And Paying",
    labelVi: "Xin tính tiền và thanh toán",
    category: "food-ordering",
    seedInputs: ["Can we have the bill, please?"],
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
    ],
    followUps: [
      { id: "fo-bill-ask", question: "How would you ask for the bill?", salienceQuestion: "How would you ask for the {slot}?" },
      { id: "fo-bill-split", question: "Together or separate checks?", salienceQuestion: "How would you split the {slot}?" },
      { id: "fo-bill-method", question: "How would you say card or cash?", salienceQuestion: "How would you pay the {slot}?" },
      { id: "fo-bill-receipt", question: "How would you ask for a receipt?", salienceQuestion: "How would you ask for the {slot} receipt?" },
    ],
  },
  {
    id: "topic-food-ordering-wrong-order",
    labelEn: "When The Order Is Wrong",
    labelVi: "Khi món ăn bị sai hoặc nguội",
    category: "food-ordering",
    seedInputs: ["Sorry, I think this is not what I ordered."],
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
    ],
    followUps: [
      { id: "fo-wrong-problem", question: "How would you describe what is wrong?", salienceQuestion: "What is wrong with the {slot}?" },
      { id: "fo-wrong-ordered", question: "How would you say what you actually ordered?", salienceQuestion: "What did you order instead of the {slot}?" },
      { id: "fo-wrong-fix", question: "How would you ask them to fix it?", salienceQuestion: "How would you ask to fix the {slot}?" },
      { id: "fo-wrong-polite", question: "How would you keep it friendly?", salienceQuestion: "How would you stay polite about the {slot}?" },
    ],
  },
  {
    id: "topic-food-ordering-bakery",
    labelEn: "At The Bakery",
    labelVi: "Ở tiệm bánh",
    category: "food-ordering",
    seedInputs: ["Can I get two croissants and a loaf of bread?"],
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
    ],
    followUps: [
      { id: "fo-bakery-item", question: "What would you like from the bakery?", salienceQuestion: "What would you choose — the {slot}?" },
      { id: "fo-bakery-qty", question: "How many, or a loaf, slice, or dozen?", salienceQuestion: "How much of the {slot} do you want?" },
      { id: "fo-bakery-askfresh", question: "How would you ask if it is fresh today?", salienceQuestion: "How would you ask if the {slot} is fresh?" },
      { id: "fo-bakery-pack", question: "How would you ask them to pack it to go?", salienceQuestion: "How would you pack the {slot} to go?" },
    ],
  },
  {
    id: "topic-food-ordering-drinks-water",
    labelEn: "Ordering Drinks And Asking For Water",
    labelVi: "Gọi nước uống và xin nước lọc",
    category: "food-ordering",
    seedInputs: ["Could I get a glass of water, please?"],
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
    ],
    followUps: [
      { id: "fo-drinks-choose", question: "What drink would you like?", salienceQuestion: "What do you like about the {slot}?" },
      { id: "fo-drinks-water", question: "How would you ask for tap or bottled water?", salienceQuestion: "How would you ask for the {slot}?" },
      { id: "fo-drinks-askrefill", question: "How would you ask for a refill or another one?", salienceQuestion: "How would you ask for another {slot}?" },
      { id: "fo-drinks-ice", question: "How would you say with ice or no ice?", salienceQuestion: "How would you order the {slot} with or without ice?" },
    ],
  },
] as const;
