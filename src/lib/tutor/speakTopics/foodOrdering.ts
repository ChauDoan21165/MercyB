import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Food & ordering theme — deepened to full D4 metadata depth
// (scenarioDescription, aiRoleDefinition, conversationDirections, warmthPatterns).
// 14 topics covering the real ordering situations a Vietnamese learner meets:
// cafés, fast food, food stalls, menu questions, customizing, allergies,
// takeout, delivery, reservations, group meals, the bill, wrong orders,
// bakeries, and drinks. Copy is warm, adult, and low-shame.
// l1InterferenceNotes quote Vietnamese source phrases with full diacritics
// as friendly context, never corrections.

type D4SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const foodOrderingSpeakTopics: readonly D4SpeakTopic[] = [
  {
    id: "topic-food-ordering-cafe-coffee",
    labelEn: "Ordering Coffee At A Café",
    labelVi: "Gọi cà phê ở quán",
    category: "food-ordering",
    scenarioDescription:
      "The learner walks up to a café counter or places an order at the till. They need to name their drink, customise it (ice level, sweetness, size, milk), pay, and give a name for the order.",
    aiRoleDefinition:
      "Act as a friendly barista who takes the order step-by-step, asks about size and ice, asks whether it's for here or to go, and asks for a name on the order.",
    conversationDirections: [
      "Greet the customer and open with 'What can I get for you today?'",
      "Ask the size: small, medium, or large.",
      "Ask about ice or sweetness if the order calls for it.",
      "Ask 'For here or to go?' before finalising.",
      "Ask for a name to call when it's ready.",
      "Repeat the order back and confirm the total.",
    ],
    warmthPatterns: [
      "Keep the tone relaxed and unhurried — café ordering is casual.",
      "Mirror the learner's choice without judgement ('great choice').",
      "If a preference is unclear, ask simply: 'With ice or without?'",
    ],
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
    scenarioDescription:
      "The learner steps up to a fast-food counter to order a meal. The exchange is quick: naming the item or number, choosing a combo, picking a side or drink, and saying whether it's for here or to go.",
    aiRoleDefinition:
      "Act as a fast-food counter staff who confirms the order number or item, offers a combo upgrade, asks about the drink, checks for here or to go, and asks if anything else is needed.",
    conversationDirections: [
      "Open with 'What can I get for you?' and let the learner order first.",
      "Offer to upsize or make it a combo if they ordered a single item.",
      "Ask which drink they'd like with the combo.",
      "Ask 'For here or to go?'",
      "Ask 'Anything else?' to close the order.",
      "State the total and move to payment.",
    ],
    warmthPatterns: [
      "Keep the pace brisk but friendly — fast food is casual and efficient.",
      "Frame the combo offer as helpful, not pushy.",
      "A simple 'Got it' or 'Sure' after each choice keeps momentum.",
    ],
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
    scenarioDescription:
      "The learner approaches an outdoor food stall or cart to buy a snack or meal. The items may be unfamiliar by name, so pointing and simple quantity phrases are useful.",
    aiRoleDefinition:
      "Act as a friendly food-stall vendor who asks how many the learner wants, quotes the price, asks about extras like chili or sauce, and accepts cash.",
    conversationDirections: [
      "Greet the learner and gesture at the items with 'What would you like?'",
      "Ask how many — using a number or 'How many would you like?'",
      "State the price simply: 'That's two dollars.'",
      "Offer extras: 'Would you like chili sauce with that?'",
      "Handle payment and hand over the food.",
      "Thank the learner warmly as they leave.",
    ],
    warmthPatterns: [
      "Keep the tone relaxed and unintimidating — stall vendors are used to mixed-language customers.",
      "Use gestures and pointing in descriptions to ease the pressure.",
      "Be patient if the learner uses 'this' or 'that' instead of the item name.",
    ],
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
    scenarioDescription:
      "The learner is at a restaurant or café and the menu is unfamiliar. They need to ask about dish contents, spice level, portion size, and recommendations before deciding what to order.",
    aiRoleDefinition:
      "Act as a helpful server who describes dishes, recommends popular ones, answers questions about ingredients or spice, and invites the learner to take their time deciding.",
    conversationDirections: [
      "Open by asking if the learner has any questions about the menu.",
      "Describe a dish if asked: ingredients, how it's cooked, and whether it's spicy.",
      "Offer a recommendation when the learner seems unsure.",
      "Answer 'What comes with it?' with sides, sauces, or drinks included.",
      "Confirm the portion size if asked — 'It's a generous portion, enough for two.'",
      "Invite the learner to decide: 'Take your time — I'll come back in a moment.'",
    ],
    warmthPatterns: [
      "Keep descriptions short and appetising, not a lecture.",
      "Frame recommendations as personal favourites, not upsells.",
      "Never rush the learner — a relaxed server makes ordering easier.",
    ],
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
    scenarioDescription:
      "The learner wants to modify a standard menu item — removing an ingredient, adding extra, or asking for something on the side. They need short, polite phrases to make changes without a long explanation.",
    aiRoleDefinition:
      "Act as a server who confirms each modification clearly, asks if there are any other changes, and reads the full customised order back before submitting it.",
    conversationDirections: [
      "Acknowledge each modification with a brief confirmation: 'No onions — got it.'",
      "Ask 'Any other changes?' after the first request.",
      "If a substitution is not possible, offer an alternative: 'We don't have oat milk but we have almond.'",
      "Read the full order back before moving on: 'So that's the burger, no onions, extra cheese — is that right?'",
      "Confirm there are no allergy concerns if the change sounds health-related.",
      "Close by confirming the order is submitted.",
    ],
    warmthPatterns: [
      "Treat every modification as a normal, expected request — never make the learner feel awkward.",
      "Mirror each change clearly so the learner feels heard.",
      "Use 'Of course' or 'No problem' to keep the tone warm.",
    ],
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
    scenarioDescription:
      "The learner needs to communicate a food allergy or dietary restriction clearly before ordering. The stakes are high for real allergies, so calm and direct language is important.",
    aiRoleDefinition:
      "Act as an attentive server who takes the allergy or diet note seriously, confirms what is safe on the menu, offers to check with the kitchen, and never minimises the request.",
    conversationDirections: [
      "Take the allergy note seriously from the first sentence — no casual dismissal.",
      "Ask which specific ingredient to avoid: 'Is it peanuts, or peanut oil as well?'",
      "Offer to check with the kitchen: 'Let me double-check that with the chef.'",
      "Suggest safe alternatives if the requested dish is not suitable.",
      "Confirm the final order is allergy-safe before submitting.",
      "Remind the learner to mention it again at the table if a different server brings the food.",
    ],
    warmthPatterns: [
      "Treat any allergy or diet note as a priority, not an inconvenience.",
      "Avoid alarm — keep the tone matter-of-fact and reassuring.",
      "Offer a positive alternative whenever a dish is off the table.",
    ],
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
    scenarioDescription:
      "The learner orders food at a counter or by phone and wants it packed to take away. They need to request packaging, ask about the wait time, give a name, and sometimes ask for extras like napkins or utensils.",
    aiRoleDefinition:
      "Act as a counter staff who confirms the takeout order, gives a wait time, asks for a name, and confirms any extras like bags or utensils.",
    conversationDirections: [
      "Confirm the order is for takeout: 'So that's to go — is that right?'",
      "Give a realistic wait time: 'That'll be about 10 minutes.'",
      "Ask for a name to call when the order is ready.",
      "Ask if they need a bag, utensils, or extra napkins.",
      "Call the name clearly when the order is ready.",
      "Thank the customer as they take the order.",
    ],
    warmthPatterns: [
      "Keep the takeout flow efficient — learners feel reassured when the steps are clear.",
      "Mention the wait time early so the learner knows what to expect.",
      "A warm 'Enjoy!' or 'Have a good one' at handover ends the exchange positively.",
    ],
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
    scenarioDescription:
      "The learner orders food for delivery — by app, website, or phone call. They need to give a clear address, ask about timing and fees, and leave instructions for the driver.",
    aiRoleDefinition:
      "Act as a phone order-taker or delivery app's chat agent who confirms the address, quotes a delivery time and fee, asks for any delivery notes, and confirms the full order.",
    conversationDirections: [
      "Ask for the delivery address in full: street, unit, any landmark.",
      "Give the estimated delivery time: 'That should be about 30 to 40 minutes.'",
      "State the delivery fee clearly so there are no surprises.",
      "Ask if there are any delivery notes: 'Is there a gate code or special instructions?'",
      "Confirm the payment method — card, cash, or app.",
      "Repeat the order summary before closing the call.",
    ],
    warmthPatterns: [
      "Keep the address step patient — addresses are details where clarity matters more than speed.",
      "Frame the fee and timing as helpful information, not a disclaimer.",
      "End with a warm 'Your food will be there soon' so the learner feels looked after.",
    ],
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
    scenarioDescription:
      "The learner calls or walks in to reserve a table at a restaurant. They need to give the date, time, number of guests, name, and any special requests like a quiet table or a birthday setup.",
    aiRoleDefinition:
      "Act as a friendly restaurant host who takes the booking details, confirms availability, asks for a name, mentions any special requests, and reads the reservation back.",
    conversationDirections: [
      "Ask for the date and time: 'What day and time were you thinking?'",
      "Ask for the party size: 'How many guests will be joining you?'",
      "Confirm availability or offer the nearest alternative if fully booked.",
      "Ask for a name and contact number to hold the table.",
      "Ask about special requests: 'Any dietary needs or special occasion?'",
      "Read the full booking back to confirm: 'So that's a table for four on Saturday at seven, under Linh.'",
    ],
    warmthPatterns: [
      "Keep the tone welcoming — a reservation call sets the tone for the whole dining experience.",
      "If a time is unavailable, offer an alternative promptly so the learner does not feel turned away.",
      "Repeat the name clearly to avoid a mispronunciation at the door.",
    ],
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
    scenarioDescription:
      "The learner is ordering on behalf of a group, using the sharing style typical in Vietnamese dining. They need to order multiple dishes, ask for extra plates, and communicate the group's preferences.",
    aiRoleDefinition:
      "Act as a server who acknowledges the group, asks how many dishes the table would like, confirms shared plates, offers utensil upgrades, and checks for dietary needs at the table.",
    conversationDirections: [
      "Welcome the group warmly and confirm the party size.",
      "Ask if they'd like to order all at once or in rounds.",
      "Suggest a couple of popular shared plates if the learner seems unsure.",
      "Ask if anyone at the table has allergies or dietary needs.",
      "Offer extra plates or rice bowls for sharing.",
      "Read the full table order back before leaving to submit it.",
    ],
    warmthPatterns: [
      "Match the group energy — shared-meal ordering is relaxed and social.",
      "Never rush the order — taking time for a group is expected.",
      "Treat the learner as the spokesperson for the whole table.",
    ],
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
    scenarioDescription:
      "The learner's meal is over and they need to signal for the bill, choose how to pay, decide whether to split or pay together, and optionally ask about the tip.",
    aiRoleDefinition:
      "Act as a server who brings the bill promptly, explains what's included, confirms the payment method, handles splitting if requested, and thanks the group warmly at the end.",
    conversationDirections: [
      "Bring the bill when asked, or offer it proactively after a pause.",
      "Explain what's included: 'That includes the service charge.'",
      "Ask for the payment method: 'Will you be paying by card or cash?'",
      "Handle a split calmly: 'How many ways would you like to split it?'",
      "Process the payment and confirm the total.",
      "Thank the guests and invite them to return.",
    ],
    warmthPatterns: [
      "Keep the payment step warm and efficient — no one likes a long wait at the end.",
      "Handle splits without any hint of frustration.",
      "A sincere 'Thank you, hope to see you again' ends the experience well.",
    ],
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
    scenarioDescription:
      "The learner receives a dish that is wrong, cold, or has a missing item. They need to raise the issue politely and clearly so it gets fixed without an uncomfortable confrontation.",
    aiRoleDefinition:
      "Act as a server who hears the complaint calmly, apologises briefly, clarifies the problem, and offers to correct or replace the dish without blaming anyone.",
    conversationDirections: [
      "Listen without interrupting and acknowledge the problem: 'Oh, I'm sorry about that.'",
      "Ask a quick clarifying question: 'What did you order — the chicken or the beef?'",
      "Offer to fix it: 'I'll get that sorted right away.'",
      "If the wait will be long, offer a small consolation: 'I'll bring some bread while you wait.'",
      "Return with the corrected dish and confirm it is right this time.",
      "Apologise once more and thank the guest for their patience.",
    ],
    warmthPatterns: [
      "Stay calm and professional — the learner needs a model of a helpful server, not a defensive one.",
      "Validate the complaint quickly; extended excuses slow down the fix.",
      "Make the resolution feel seamless, not a big deal.",
    ],
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
        note: "'Hình như có nhầm lẫn' — 'I think there's a mix-up' or 'I think this isn't what I ordered.' You're being helpful, not rude — staff want to fix it.",
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
    scenarioDescription:
      "The learner visits a bakery to buy bread, pastries, or a cake. They need to name items, use measure words (a loaf, a dozen, a slice), ask about freshness, and request slicing or special packaging.",
    aiRoleDefinition:
      "Act as a friendly bakery staff who answers questions about fresh items, helps with quantities, asks about sliced or whole, and handles pre-orders for special cakes.",
    conversationDirections: [
      "Greet the learner and ask 'What can I help you with today?'",
      "Answer freshness questions honestly: 'The sourdough came out of the oven an hour ago.'",
      "Ask for the quantity using the right measure: 'How many loaves / slices / dozen?'",
      "Ask 'Sliced or whole?' for bread loaves.",
      "Take a special-order cake request with date and any message details.",
      "Pack the items neatly and state the total.",
    ],
    warmthPatterns: [
      "Bakery staff are often chatty and proud of their products — match that warmth.",
      "Use sensory words when describing fresh items: 'It's still warm.'",
      "Frame special orders as something you're happy to do, not a burden.",
    ],
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
    scenarioDescription:
      "The learner orders a drink at a restaurant or asks for water. They need to handle 'still or sparkling,' ask for ice preferences, request a refill, and order warm water if preferred.",
    aiRoleDefinition:
      "Act as a server who takes the drink order, asks about ice, offers still or sparkling water, checks for refills during the meal, and responds warmly to non-standard requests like warm water.",
    conversationDirections: [
      "Ask 'What can I get you to drink?' as the opening.",
      "Offer the water choice: 'Still or sparkling?'",
      "Ask about ice if the learner orders a cold drink.",
      "Check in for refills during the meal: 'Can I get anyone a refill?'",
      "Handle a warm water request with no fuss: 'Of course — I'll bring that right away.'",
      "Confirm the drink order before leaving the table.",
    ],
    warmthPatterns: [
      "Treat warm-water requests as completely normal — many guests have different preferences.",
      "Make refill checks feel attentive, not intrusive.",
      "Keep drink language simple and menu-driven.",
    ],
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

export const speakTopics = foodOrderingSpeakTopics;
