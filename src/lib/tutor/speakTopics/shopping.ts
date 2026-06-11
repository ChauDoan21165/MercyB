import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Shopping theme — deepened to full D4 metadata depth
// (scenarioDescription, aiRoleDefinition, conversationDirections, warmthPatterns).
// 12 topics covering the real situations a Vietnamese learner meets when shopping
// in English: asking for help, checking prices, sizes, stock, discounts, paying,
// checkout, returning, exchanging, damaged items, online orders, and grocery checkout.
// Copy is warm, adult, low-shame, and strictly about COMMUNICATION.
// l1InterferenceNotes quote the Vietnamese source phrase with full diacritics —
// friendly context, never a grammar correction.

type D4SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const shoppingSpeakTopics: readonly D4SpeakTopic[] = [
  {
    id: "topic-shopping-store-help",
    labelEn: "Asking For Help In A Store",
    labelVi: "Nhờ nhân viên cửa hàng giúp",
    category: "shopping",
    scenarioDescription:
      "The learner needs to find a specific item in an unfamiliar store and must get the attention of a staff member, describe what they are looking for, and follow the directions to the right section.",
    aiRoleDefinition:
      "Act as a helpful store assistant who greets the learner, listens to their request, asks a clarifying question about the item, and walks them to the right section or gives clear directions.",
    conversationDirections: [
      "Let the learner open by getting your attention — 'Excuse me' or similar.",
      "Ask one clarifying question about the item (size, brand, or type) to narrow it down.",
      "Give clear section or aisle directions in simple language.",
      "Let the learner confirm the directions back to you.",
      "If you don't have the item, suggest a nearby alternative or another store.",
      "Close warmly and invite them to come back if they can't find it.",
    ],
    warmthPatterns: [
      "Greet every approach with a friendly opener — make the learner feel welcome before they finish the sentence.",
      "Treat 'I'm not sure' and 'Could you repeat that?' as normal — slow down and rephrase without sighing.",
      "If the item isn't in stock, offer one concrete alternative before closing.",
    ],
    seedInputs: [
      "Excuse me, can you help me find this item?",
      "Hi, I'm looking for a phone charger — where would that be?",
      "Excuse me, do you work here? I need help finding something.",
    ],
    detectionPatterns: [
      /\b(?:store help|help me find|find this item|where can i find|shop assistant|staff help|looking for)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-help-directness",
        label: "Direct but polite request",
        note: "Vietnamese learners may wait silently or say only the item name. In English stores, a simple 'Excuse me, can you help me find...' is warm and normal — saying your need out loud is not rude.",
      },
      {
        id: "shopping-item-before-story",
        label: "Item first, story second",
        note: "'Nói rõ cái cần tìm' (say the thing you need clearly) is the right instinct. In English, put the item first: 'I'm looking for a phone charger.' Context can follow, but the item name unlocks the help faster.",
      },
      {
        id: "shopping-help-excuse-me",
        label: "'Excuse me' to get attention",
        note: "'Xin lỗi' to get someone's attention is 'Excuse me' in this context, not 'Sorry.' 'Excuse me, do you work here?' is a friendly way to start when you're not sure who is staff and who is another customer.",
      },
      {
        id: "shopping-help-looking-for",
        label: "'I'm looking for', not 'I find'",
        note: "'Tôi tìm...' often becomes 'I find a charger.' The natural store phrase is 'I'm looking for a charger.' The -ing keeps it as a polite, ongoing search rather than a statement that you already found it.",
      },
    ],
    followUps: [
      { id: "shopping-help-item", question: "What item are you trying to find?", salienceQuestion: "How would you ask for help finding the {slot}?" },
      { id: "shopping-help-location", question: "Which section of the store might it be in?", salienceQuestion: "Where might the {slot} be in the store?" },
      { id: "shopping-help-detail", question: "What detail would help the staff understand?", salienceQuestion: "What detail would you add about the {slot}?" },
      { id: "shopping-help-thanks", question: "How would you thank the staff after they help?", salienceQuestion: "How would you thank someone for helping with the {slot}?" },
      { id: "shopping-help-who", question: "How would you check if someone works there?", salienceQuestion: "How would you find staff to ask about the {slot}?" },
      { id: "shopping-help-brand", question: "How would you describe a brand or model you want?", salienceQuestion: "How would you describe the {slot} you want?" },
    ],
  },
  {
    id: "topic-shopping-price-check",
    labelEn: "Checking The Price",
    labelVi: "Hỏi giá sản phẩm",
    category: "shopping",
    scenarioDescription:
      "The learner picks up an item with no visible price tag, needs to ask a staff member or cashier how much it costs, and wants to understand whether there is a discount or a different price for a set.",
    aiRoleDefinition:
      "Act as a store staff member who checks the price, explains whether the item is on sale or full price, and answers clearly if the learner asks about individual versus set pricing.",
    conversationDirections: [
      "Let the learner ask about the price naturally — 'How much is this?'",
      "Give a clear price and say whether it is on sale or full price.",
      "If the learner asks, explain whether the price is per item or for a set.",
      "Let the learner ask about a discount or coupon.",
      "If the learner wants to compare with something else, help them think through it.",
      "Close by confirming the final price so there are no surprises at checkout.",
    ],
    warmthPatterns: [
      "Give the price clearly and in one number — don't make the learner calculate anything.",
      "Proactively mention if something is on sale; learners may not notice the sale sign.",
      "Treat the 'is this each or for the set?' question as helpful and smart, not annoying.",
    ],
    seedInputs: [
      "How much is this, please?",
      "Sorry, how much does this one cost?",
      "Is this the price, or is there a discount?",
    ],
    detectionPatterns: [
      /\b(?:how much is this|price check|check the price|how much does it cost|costs how much|price tag)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-price-question-order",
        label: "Natural price question word order",
        note: "A direct VN-to-English word order like 'This how much?' is common in practice. The useful store frame is short: 'How much is this?' — subject and verb swap compared to Vietnamese but it is the natural English price question.",
      },
      {
        id: "shopping-price-please",
        label: "Small softener 'please'",
        note: "Adding 'please' or a friendly tone makes the question feel calm: 'How much is this, please?' You don't need a long formal sentence — one soft word at the end does the work of the whole Vietnamese politeness frame.",
      },
      {
        id: "shopping-price-each-note",
        label: "Each, or for a set",
        note: "'Cái này bao nhiêu một cái' (how much each) is handled by a quick follow-up: 'Is that each, or for two?' It clears up the price without a long sentence and sounds like something a regular shopper would say.",
      },
      {
        id: "shopping-price-does-it-cost",
        label: "'How much does it cost?'",
        note: "'Cái này giá bao nhiêu' can become 'how much price?' The smooth forms are 'How much is this?' or 'How much does it cost?' — both are short and clear. Learners sometimes add 'price' because Vietnamese uses it; dropping it makes the question sound natural.",
      },
    ],
    followUps: [
      { id: "shopping-price-item", question: "What item are you asking about?", salienceQuestion: "How would you ask the price of the {slot}?" },
      { id: "shopping-price-tag", question: "Can you see a price tag, or do you need help?", salienceQuestion: "What is unclear about the price of the {slot}?" },
      { id: "shopping-price-compare", question: "Would you compare it with another item?", salienceQuestion: "What would you compare with the {slot}?" },
      { id: "shopping-price-decision", question: "What price would feel okay for you?", salienceQuestion: "What price would make the {slot} worth buying?" },
      { id: "shopping-price-each", question: "How would you ask if the price is each or for a set?", salienceQuestion: "How would you ask if the {slot} price is per item?" },
      { id: "shopping-price-scan", question: "How would you ask them to scan it for the price?", salienceQuestion: "How would you ask to scan the {slot}?" },
    ],
  },
  {
    id: "topic-shopping-size-fit",
    labelEn: "Asking About Size And Fit",
    labelVi: "Hỏi size và độ vừa",
    category: "shopping",
    scenarioDescription:
      "The learner is buying clothes and needs to ask if a different size is available, describe how the current size fits — too tight, too loose, or not quite right — and find the fitting room to try things on before deciding.",
    aiRoleDefinition:
      "Act as a friendly clothing store assistant who helps the learner find the right size, points out the fitting room, and reassures them that trying on multiple sizes is normal and expected.",
    conversationDirections: [
      "Ask the learner which size they need and offer to check the stockroom.",
      "Describe what sizes are currently available on the floor.",
      "Let the learner try describing the fit — too tight, too loose, or just right.",
      "Direct the learner to the fitting room with a friendly pointer.",
      "If their size is not in stock, offer the next size up or a different style.",
      "Close by confirming the size and offering to hold it at the register.",
    ],
    warmthPatterns: [
      "Make fitting room suggestions feel like a natural next step, not an imposition.",
      "Keep fit descriptions body-neutral — 'this cut runs small' is kinder than comments on the person.",
      "Reassure that trying two or three sizes is normal and staff expect it.",
    ],
    seedInputs: [
      "Do you have this in a medium?",
      "This is a bit tight — do you have the next size up?",
      "Where's the fitting room? I'd like to try this on.",
    ],
    detectionPatterns: [
      /\b(?:size|small|medium|large|extra large|try this on|fits me|too tight|too loose|do you have this in)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-size-in-a-size",
        label: "'Do you have this in a medium?'",
        note: "Learners may say 'have size M?' because Vietnamese drops the frame. In English, 'Do you have this in a medium?' is the practical store sentence — the 'in' preposition connects the item to the size you want.",
      },
      {
        id: "shopping-fit-body-comfort",
        label: "Fit language is about the item",
        note: "It is normal to say 'too tight' or 'too loose' about clothes. Keep the language about the item rather than the body: 'This one's a bit tight on the shoulders' keeps the conversation practical and friendly.",
      },
      {
        id: "shopping-size-fitting-room",
        label: "Fitting room — phòng thử đồ",
        note: "'Phòng thử đồ' is 'the fitting room' or 'the changing room.' Both terms work — ask 'Where's the fitting room?' before you carry the item around looking for it. Staff expect the question on a first visit.",
      },
      {
        id: "shopping-size-try-it-on",
        label: "'Try it on', not just 'try it'",
        note: "For clothes, English adds 'on': 'Can I try it on?' Vietnamese 'thử' is one word, so the 'on' is easy to drop — but 'try it' alone could mean taste or test, while 'try it on' specifically means wearing the item.",
      },
    ],
    followUps: [
      { id: "shopping-size-needed", question: "What size do you need?", salienceQuestion: "What size do you need for the {slot}?" },
      { id: "shopping-size-color", question: "What color would you ask for?", salienceQuestion: "What color would work for the {slot}?" },
      { id: "shopping-size-try", question: "How would you ask to try it on?", salienceQuestion: "How would you ask to try on the {slot}?" },
      { id: "shopping-size-fit", question: "How would you describe the fit?", salienceQuestion: "How would you describe how the {slot} fits?" },
      { id: "shopping-size-room", question: "How would you ask where the fitting room is?", salienceQuestion: "Where would you try on the {slot}?" },
      { id: "shopping-size-other", question: "How would you ask for the next size up or down?", salienceQuestion: "What other size would you ask for the {slot}?" },
    ],
  },
  {
    id: "topic-shopping-out-of-stock",
    labelEn: "When An Item Is Out Of Stock",
    labelVi: "Khi hàng đã hết",
    category: "shopping",
    scenarioDescription:
      "The learner wants an item that is not on the shelf, needs to ask if there are more in the back, find out when the item will be restocked, and explore whether another branch or an alternative product will meet their need.",
    aiRoleDefinition:
      "Act as a store assistant who checks the back for stock, gives an honest restock estimate, suggests a similar item, and offers to look up whether another branch has the item.",
    conversationDirections: [
      "Listen to the learner describe the item they want and confirm you understand.",
      "Check the back and tell them honestly whether any are left.",
      "Give an approximate restock date or say you're not sure — honesty beats a guess.",
      "Let the learner ask about another branch or the online store.",
      "Suggest one similar item as an alternative if the original is unavailable.",
      "Close by offering to notify the learner when it's back in stock.",
    ],
    warmthPatterns: [
      "Keep 'we're out of stock' matter-of-fact, not apologetic — it's routine retail information.",
      "Offer the alternative before the learner has to ask — one proactive suggestion beats three questions.",
      "Treat the restock-date question as helpful and reasonable, not demanding.",
    ],
    seedInputs: [
      "Is this item out of stock?",
      "Do you have any of these left in the back?",
      "When will this be back in stock?",
    ],
    detectionPatterns: [
      /\b(?:out of stock|sold out|back in stock|have any left|do you have more|available again|restock)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-stock-available",
        label: "'Hết hàng' — out of stock",
        note: "Vietnamese 'hết hàng' maps directly to 'out of stock' or 'sold out.' Practicing both phrases helps learners understand staff replies — signs and apps use 'out of stock' while staff often say 'we're sold out.'",
      },
      {
        id: "shopping-stock-timing-note",
        label: "Ask about the restock timing",
        note: "A useful follow-up is 'When will it be back in stock?' rather than accepting the first 'no.' Staff often have an estimate — and even 'I'm not sure' tells you to check again later.",
      },
      {
        id: "shopping-stock-other-store",
        label: "Asking about another branch",
        note: "Staff can often check the inventory at other stores: 'Could you see if another branch has it?' 'Chi nhánh khác' is 'another branch.' This keeps the search going when the shelf in front of you is empty.",
      },
      {
        id: "shopping-stock-any-left",
        label: "'Any left' — còn cái nào không",
        note: "'Còn cái nào không' (is there any remaining?) is naturally 'Do you have any left?' The word 'left' here means remaining — a handy store word with no single Vietnamese equivalent that carries the same brevity.",
      },
    ],
    followUps: [
      { id: "shopping-stock-item", question: "Which item is not available?", salienceQuestion: "How would you ask if the {slot} is in stock?" },
      { id: "shopping-stock-more", question: "How would you ask if they have more in the back?", salienceQuestion: "How would you ask if there is more {slot} in the back?" },
      { id: "shopping-stock-time", question: "When would you ask it might come back?", salienceQuestion: "When might the {slot} be back in stock?" },
      { id: "shopping-stock-alternative", question: "What similar item could you ask for?", salienceQuestion: "What could you buy instead of the {slot}?" },
      { id: "shopping-stock-branch", question: "How would you ask if another branch has it?", salienceQuestion: "How would you ask another store about the {slot}?" },
      { id: "shopping-stock-notify", question: "How would you ask them to notify you when it returns?", salienceQuestion: "How would you get a message when the {slot} is back?" },
    ],
  },
  {
    id: "topic-shopping-discount-sale",
    labelEn: "Asking About A Sale Or Discount",
    labelVi: "Hỏi giảm giá hoặc khuyến mãi",
    category: "shopping",
    scenarioDescription:
      "The learner sees an item they want to buy and wants to know if there is a current sale, a member discount, or a coupon they can use before paying the full price.",
    aiRoleDefinition:
      "Act as a store cashier or floor staff who explains current promotions clearly, checks whether the learner qualifies for a member or student discount, and confirms the final price after any discount is applied.",
    conversationDirections: [
      "Let the learner open by asking whether the item is on sale or discounted.",
      "Tell them clearly whether there is a current promotion on that item.",
      "Ask whether they have a membership card or coupon to apply.",
      "Explain what the discount is and what the final price will be.",
      "Let the learner ask about the next sale if none is running now.",
      "Close by confirming the total so there are no surprises at the register.",
    ],
    warmthPatterns: [
      "Mention the promotion proactively — many learners won't see the sign.",
      "Keep the discount explanation simple: 'That's 20% off today, so it comes to X.'",
      "Treat the coupon question as smart and common, not cheap or unusual.",
    ],
    seedInputs: [
      "Is this on sale today?",
      "Do you have any discounts on this one?",
      "Is there a student or member discount?",
    ],
    detectionPatterns: [
      /\b(?:on sale|discount|promotion|coupon|deal|clearance|marked down|cheaper|sale price)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-discount-polite",
        label: "Discount question, not bargaining",
        note: "Direct bargaining is normal in many Vietnamese markets, but in fixed-price stores the polite move is a question: 'Is this on sale?' or 'Do you have any discounts?' It is not rude — it is exactly what staff expect to hear.",
      },
      {
        id: "shopping-discount-not-demand",
        label: "Question first, then decide",
        note: "A soft question keeps options open: 'Is there a discount for this one?' versus insisting on a lower price. If the answer is no, 'That's okay, I'll take it' closes gracefully without any awkwardness.",
      },
      {
        id: "shopping-discount-price-match",
        label: "Price match — a new concept",
        note: "Some stores match a lower price found elsewhere: 'Do you price match?' Vietnamese retail rarely has this option, so the phrase may be unfamiliar. It's worth asking at electronics and big-box stores — the answer is always just yes or no.",
      },
      {
        id: "shopping-discount-on-sale",
        label: "'On sale' vs 'for sale'",
        note: "'On sale' means a lower price right now; 'for sale' simply means the item can be bought. Vietnamese uses 'giảm giá' for the first meaning — always say 'on sale' when you mean a discount, not 'for sale.'",
      },
    ],
    followUps: [
      { id: "shopping-discount-item", question: "Which item are you asking about?", salienceQuestion: "How would you ask if the {slot} is on sale?" },
      { id: "shopping-discount-coupon", question: "Do you have a coupon or membership?", salienceQuestion: "Could a coupon help with the {slot}?" },
      { id: "shopping-discount-final", question: "How would you ask for the final price?", salienceQuestion: "How would you confirm the final price for the {slot}?" },
      { id: "shopping-discount-no", question: "What would you say if there is no discount?", salienceQuestion: "What would you say if the {slot} is full price?" },
      { id: "shopping-discount-when", question: "How would you ask when the next sale is?", salienceQuestion: "When would the {slot} go on sale?" },
      { id: "shopping-discount-match", question: "How would you ask if they match a lower price?", salienceQuestion: "How would you ask to match the price of the {slot}?" },
    ],
  },
  {
    id: "topic-shopping-paying-cash-card",
    labelEn: "Paying By Card Or In Cash",
    labelVi: "Thanh toán bằng thẻ hoặc tiền mặt",
    category: "shopping",
    scenarioDescription:
      "The learner is ready to pay and needs to confirm whether the store accepts card, choose between tapping, inserting, or swiping, and handle any card machine prompt smoothly without holding up the queue.",
    aiRoleDefinition:
      "Act as a cashier who confirms accepted payment methods, walks the learner through the card machine steps in plain language, and helps calmly if the card doesn't work on the first try.",
    conversationDirections: [
      "Let the learner ask whether card or cash is accepted.",
      "Confirm the accepted methods and say whether the machine takes tap, insert, or swipe.",
      "Walk through the card machine prompt step by step if the learner asks.",
      "Handle a 'declined' or 'not working' scenario calmly — ask them to try again or use another card.",
      "Let the learner ask for the total before inserting the card.",
      "Close by confirming the payment went through and offering a receipt.",
    ],
    warmthPatterns: [
      "Keep card machine instructions short — one step at a time, never a long list.",
      "Make a declined card feel routine and fixable, not embarrassing.",
      "Always confirm the total aloud before the learner taps — surprises at checkout cause stress.",
    ],
    seedInputs: [
      "Can I pay by card, or do you prefer cash?",
      "Do you take card? I don't have much cash on me.",
      "How do I pay — do I tap or insert?",
    ],
    detectionPatterns: [
      /\b(?:pay by card|pay with card|pay in cash|cash only|tap my card|credit card|debit card|payment)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-pay-cash-preposition",
        label: "'Pay in cash', not 'pay by cash'",
        note: "VN learners often say 'pay by cash.' In everyday store English, 'pay in cash' or 'pay with cash' is the natural phrase. 'By card' is correct for cards — the preposition changes between cash and card.",
      },
      {
        id: "shopping-card-or-cash",
        label: "Offer both options to be polite",
        note: "A calm question that gives two options is 'Can I pay by card, or do you prefer cash?' It works well in small shops where cash-only signs aren't always visible — and it sounds like a considerate regular customer.",
      },
      {
        id: "shopping-pay-tap-insert",
        label: "Tap, insert, or swipe",
        note: "Card machines prompt 'tap, insert, or swipe.' You don't have to read the screen perfectly — 'How do I pay — tap?' is a fine question to ask the cashier. They will point you to the right spot on the machine.",
      },
      {
        id: "shopping-pay-do-you-take",
        label: "'Do you take card?' — có nhận thẻ không",
        note: "A quick, natural check before paying is 'Do you take card?' Learners may translate 'có nhận thẻ không' as 'you receive card?' — 'take' is the everyday verb here. Short, clear, and cashiers hear it dozens of times a day.",
      },
    ],
    followUps: [
      { id: "shopping-pay-method", question: "How do you want to pay?", salienceQuestion: "How would you pay for the {slot}?" },
      { id: "shopping-pay-card", question: "How would you ask if cards are accepted?", salienceQuestion: "How would you ask if you can use a card for the {slot}?" },
      { id: "shopping-pay-cash", question: "How would you ask if cash is okay?", salienceQuestion: "How would you ask if cash is okay for the {slot}?" },
      { id: "shopping-pay-confirm", question: "How would you confirm the payment went through?", salienceQuestion: "How would you confirm payment for the {slot}?" },
      { id: "shopping-pay-machine", question: "How would you ask how to use the card machine?", salienceQuestion: "How would you ask how to pay for the {slot}?" },
      { id: "shopping-pay-change", question: "How would you check your change when paying cash?", salienceQuestion: "How would you check the change for the {slot}?" },
    ],
  },
  {
    id: "topic-shopping-checkout-bag-receipt",
    labelEn: "Checkout, Bag, And Receipt",
    labelVi: "Tính tiền, túi và hóa đơn",
    category: "shopping",
    scenarioDescription:
      "The learner is at the checkout counter and needs to handle the bag question, ask for a receipt, and understand the cashier's prompts — including whether bags are charged and whether a paper or emailed receipt is available.",
    aiRoleDefinition:
      "Act as a cashier who asks about bags, offers paper or email receipt options, and finishes the transaction in a friendly and efficient way.",
    conversationDirections: [
      "Ask the learner if they need a bag — or if bags cost extra, say so clearly.",
      "If the learner has their own bag, acknowledge it and move on.",
      "Offer the receipt in paper or email form and wait for the learner's choice.",
      "Let the learner ask for the total one more time before finalising.",
      "Confirm the payment method and thank the learner.",
      "Close with a warm send-off — 'Have a great day' is the standard phrase.",
    ],
    warmthPatterns: [
      "Keep the bag-cost mention brief and matter-of-fact — no apology needed.",
      "Make the receipt choice feel easy: one question, two options.",
      "Send the learner off warmly — checkout is the last impression of the store.",
    ],
    seedInputs: [
      "Could I have a bag and a receipt, please?",
      "Do I need to pay for a bag here?",
      "Could I get the receipt by email instead?",
    ],
    detectionPatterns: [
      /\b(?:checkout|cashier|bag|receipt|paper bag|plastic bag|do you need a bag|can i get a receipt)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-receipt-article",
        label: "'Could I have a receipt?'",
        note: "Learners may say 'give me receipt' because Vietnamese 'cho tôi hóa đơn' uses no article. The warmer customer frame adds both the article and a soft opener: 'Could I have a receipt, please?' It sounds like a request, not a demand.",
      },
      {
        id: "shopping-bag-request",
        label: "Bags often cost extra",
        note: "In many stores and cities, single-use bags cost a small fee. Asking 'Is there a charge for a bag?' before checkout avoids a surprise. Bringing your own — 'I have my own bag, thanks' — is the most common answer cashiers hear.",
      },
      {
        id: "shopping-checkout-paper-plastic",
        label: "'Paper or plastic?' — the bag question",
        note: "Cashiers ask 'Paper or plastic?' when offering bag types. A short 'Paper, please' or 'I have my own' answers it cleanly. If you don't catch the question, 'Sorry — do you mean the bag?' is a fine clarification.",
      },
      {
        id: "shopping-checkout-could-i-have",
        label: "'Could I have...' — the soft customer frame",
        note: "'Cho tôi...' translates flatly to 'give me,' which can sound abrupt in English. 'Could I have a bag, please?' is the warm customer version cashiers expect — the 'could' makes it a polite request, not a command.",
      },
    ],
    followUps: [
      { id: "shopping-checkout-bag", question: "Do you need a bag?", salienceQuestion: "Would you need a bag for the {slot}?" },
      { id: "shopping-checkout-receipt", question: "How would you ask for a receipt?", salienceQuestion: "How would you ask for a receipt for the {slot}?" },
      { id: "shopping-checkout-total", question: "How would you ask for the total?", salienceQuestion: "How would you confirm the total for the {slot}?" },
      { id: "shopping-checkout-close", question: "What would you say after paying?", salienceQuestion: "What would you say after buying the {slot}?" },
      { id: "shopping-checkout-bagtype", question: "How would you answer paper or plastic?", salienceQuestion: "What bag would you choose for the {slot}?" },
      { id: "shopping-checkout-email", question: "How would you answer if they offer an emailed receipt?", salienceQuestion: "How would you get a receipt for the {slot}?" },
    ],
  },
  {
    id: "topic-shopping-return-item",
    labelEn: "Returning An Item",
    labelVi: "Trả lại hàng đã mua",
    category: "shopping",
    scenarioDescription:
      "The learner wants to return a purchase — perhaps because it doesn't fit, doesn't work, or was the wrong item — and needs to explain the reason calmly, check the return window, and understand whether a refund or store credit will be given.",
    aiRoleDefinition:
      "Act as a customer service assistant who asks for the receipt and a brief reason, confirms the return policy, and processes the return in a calm, no-blame way.",
    conversationDirections: [
      "Let the learner open by saying they'd like to return an item.",
      "Ask for the receipt and a short reason — 'doesn't fit' or 'not working' is enough.",
      "Confirm whether the item is within the return window.",
      "Explain whether the refund goes back to the card, cash, or store credit.",
      "Handle a 'no receipt' scenario by asking for the order email or loyalty account.",
      "Close by confirming what the learner will receive and when.",
    ],
    warmthPatterns: [
      "Make return reasons feel routine — staff have heard everything, no need to over-explain.",
      "Never question the learner's reason; accept 'it doesn't fit' at face value.",
      "Confirm the refund method clearly so the learner knows exactly what to expect.",
    ],
    seedInputs: [
      "I would like to return this item.",
      "I'd like to return this — it doesn't fit. Here's my receipt.",
      "Am I still within the return window for this?",
    ],
    detectionPatterns: [
      /\b(?:return this item|return an item|bring it back|refund|money back|return policy|receipt for return)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-return-not-accuse",
        label: "Calm, factual opening",
        note: "A return request does not need blame or a long story. 'I would like to return this item' is clear and low-pressure — let the staff ask their questions rather than pre-defending your reason.",
      },
      {
        id: "shopping-return-reason-note",
        label: "Short reason is enough",
        note: "English store staff often ask for a reason. A one-phrase answer like 'It doesn't fit' or 'It's damaged' is enough — you don't need to translate a full explanation. The cleaner the reason, the smoother the return.",
      },
      {
        id: "shopping-return-window-note",
        label: "The return window — thời hạn đổi trả",
        note: "Stores allow returns within a set time, often 14–30 days. 'Thời hạn đổi trả' is 'the return window.' If you've waited a while, asking 'Am I still within the return window?' saves a wasted trip.",
      },
      {
        id: "shopping-return-vs-refund",
        label: "'Return' the item, 'refund' the money",
        note: "'Trả hàng' covers both ideas. In English you 'return the item' (give it back) and ask for a 'refund' (your money back). Naming both keeps the request clear: 'I'd like to return this and get a refund.'",
      },
    ],
    followUps: [
      { id: "shopping-return-item", question: "What item do you want to return?", salienceQuestion: "How would you ask to return the {slot}?" },
      { id: "shopping-return-reason", question: "What short reason would you give?", salienceQuestion: "What is the reason for returning the {slot}?" },
      { id: "shopping-return-receipt", question: "How would you mention the receipt?", salienceQuestion: "How would you show the receipt for the {slot}?" },
      { id: "shopping-return-next", question: "Would you ask for a refund or exchange?", salienceQuestion: "Would you refund or exchange the {slot}?" },
      { id: "shopping-return-window", question: "How would you ask if it is still within the return time?", salienceQuestion: "How would you ask if the {slot} can still be returned?" },
      { id: "shopping-return-method", question: "How would you ask how the refund comes back?", salienceQuestion: "How would you get the refund for the {slot}?" },
    ],
  },
  {
    id: "topic-shopping-exchange-item",
    labelEn: "Exchanging For Another Item",
    labelVi: "Đổi sang món khác",
    category: "shopping",
    scenarioDescription:
      "The learner wants to exchange a purchase for a different size, colour, or the same item without damage, and needs to understand the exchange policy, whether they have to pay a price difference, and what steps to follow.",
    aiRoleDefinition:
      "Act as a customer service staff member who confirms the exchange policy, locates the replacement item, and explains any price difference before completing the swap.",
    conversationDirections: [
      "Let the learner open by saying they'd like to exchange an item.",
      "Ask what they'd like instead — size, colour, or a replacement of the same item.",
      "Check whether the replacement is in stock and its current price.",
      "Explain any price difference the learner would need to pay.",
      "Process the receipt and confirm the exchange is complete.",
      "Close by wishing them well with the new item.",
    ],
    warmthPatterns: [
      "Treat the exchange as a positive interaction — the learner is giving you a second chance to get it right.",
      "Mention the price difference upfront so the learner isn't surprised at the register.",
      "If the exact replacement isn't available, offer one similar item proactively.",
    ],
    seedInputs: [
      "Can I exchange this for a different size?",
      "I'd like to swap this for the same one in blue.",
      "If I exchange it for a pricier one, do I pay the difference?",
    ],
    detectionPatterns: [
      /\b(?:exchange this|different size|different color|swap it|change for another|replace this|exchange policy)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-exchange-vs-change",
        label: "'Exchange', not just 'change'",
        note: "Vietnamese 'đổi hàng' can become 'change this.' In store English, 'exchange this' is the clearer verb for replacing an item — 'change' alone can mean changing your mind rather than swapping a product.",
      },
      {
        id: "shopping-exchange-specific",
        label: "Say what you want instead",
        note: "The staff can help faster when the replacement is specific: different size, different colour, or same item undamaged. 'I'd like to exchange this for a size medium in blue' is one sentence that gives the cashier everything they need.",
      },
      {
        id: "shopping-exchange-difference-note",
        label: "Price difference — trả thêm tiền",
        note: "If the new item costs more, staff say 'you'll need to pay the difference.' 'Trả thêm tiền' (pay extra) maps to 'pay the difference.' Asking 'Do I pay the difference?' before you commit is a smart, normal question.",
      },
      {
        id: "shopping-exchange-for-preposition",
        label: "'Exchange this for...' — the preposition matters",
        note: "The frame is 'exchange this for a larger size.' Learners may drop 'for' from 'đổi lấy'; the small 'for' links the old and new item and makes it clear what you're trading in and what you want back.",
      },
    ],
    followUps: [
      { id: "shopping-exchange-item", question: "What do you want to exchange?", salienceQuestion: "How would you ask to exchange the {slot}?" },
      { id: "shopping-exchange-size", question: "What size or color do you need instead?", salienceQuestion: "What would you need instead of the {slot}?" },
      { id: "shopping-exchange-policy", question: "How would you ask if exchanges are allowed?", salienceQuestion: "How would you ask about the exchange policy for the {slot}?" },
      { id: "shopping-exchange-thanks", question: "How would you close the conversation politely?", salienceQuestion: "How would you close after exchanging the {slot}?" },
      { id: "shopping-exchange-difference", question: "How would you ask about a price difference?", salienceQuestion: "How would you ask if the {slot} costs more?" },
      { id: "shopping-exchange-receipt", question: "How would you mention you have the receipt?", salienceQuestion: "How would you show the receipt for the {slot}?" },
    ],
  },
  {
    id: "topic-shopping-damaged-item",
    labelEn: "Explaining A Damaged Item",
    labelVi: "Nói món hàng bị lỗi",
    category: "shopping",
    scenarioDescription:
      "The learner discovers their purchase is damaged or defective — a scratch noticed at home, something that won't turn on, or a missing part — and needs to describe the problem clearly and ask for a replacement or refund.",
    aiRoleDefinition:
      "Act as a customer service staff member who listens to the damage description, asks when the learner noticed the problem, and processes a replacement or refund without making the learner feel at fault.",
    conversationDirections: [
      "Let the learner open by saying there is a problem with their item.",
      "Ask them to describe the damage or fault specifically.",
      "Ask when they noticed — whether in-store or at home.",
      "Confirm whether a replacement or refund is the right solution.",
      "Handle the 'I didn't notice it in the store' concern without blame.",
      "Close by confirming the next step — replacement, refund, or repair referral.",
    ],
    warmthPatterns: [
      "Start from a position of trust — assume the learner is reporting a real fault.",
      "Keep 'when did you notice?' as a factual question, not an accusation.",
      "Confirm the solution clearly at the end so there's no uncertainty about what happens next.",
    ],
    seedInputs: [
      "This item is damaged. Could you help me?",
      "There's a problem with this — it doesn't turn on.",
      "I noticed a scratch when I got home. Can I get a replacement?",
    ],
    detectionPatterns: [
      /\b(?:damaged|broken|doesn't work|not working|defective|scratched|missing piece|problem with this item)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-damaged-this-item",
        label: "'There is a problem with this item'",
        note: "Learners may say 'it has problem.' A clear store frame is 'There is a problem with this item' or 'This item is damaged.' Naming the item specifically before describing the fault helps staff understand immediately.",
      },
      {
        id: "shopping-damaged-help",
        label: "Follow the problem with a request",
        note: "After naming the problem, add a calm request: 'Could you help me?' or 'Can I get a replacement?' This keeps the tone respectful and gives the staff a clear direction rather than leaving the next step unclear.",
      },
      {
        id: "shopping-damaged-when-note",
        label: "When you noticed — khi nào phát hiện",
        note: "Staff often ask when you found the damage. 'I noticed it when I got home' is a simple, honest answer. 'Khi nào phát hiện' (when you noticed) maps to that phrase — and saying it pre-empts the question.",
      },
      {
        id: "shopping-damaged-doesnt-work",
        label: "'It doesn't work' — bị hỏng",
        note: "'Bị hỏng' is naturally 'it doesn't work' or 'it's not working' in English. Learners sometimes say 'it is broken die' from a direct translation. The plain present 'doesn't work' is the clearest store phrase and staff understand immediately.",
      },
    ],
    followUps: [
      { id: "shopping-damaged-item", question: "What item has a problem?", salienceQuestion: "How would you explain the problem with the {slot}?" },
      { id: "shopping-damaged-detail", question: "What exactly is damaged or missing?", salienceQuestion: "What detail is wrong with the {slot}?" },
      { id: "shopping-damaged-proof", question: "Would you show the receipt or photo?", salienceQuestion: "What proof would help with the {slot}?" },
      { id: "shopping-damaged-request", question: "What help do you want from the store?", salienceQuestion: "What help do you need for the {slot}?" },
      { id: "shopping-damaged-when", question: "How would you say when you noticed the damage?", salienceQuestion: "When did you notice the problem with the {slot}?" },
      { id: "shopping-damaged-replace", question: "How would you ask for a new one instead?", salienceQuestion: "How would you ask to replace the {slot}?" },
    ],
  },
  {
    id: "topic-shopping-online-order",
    labelEn: "Asking About An Online Order",
    labelVi: "Hỏi về đơn hàng online",
    category: "shopping",
    scenarioDescription:
      "The learner placed an order online and either visits the store to collect it or calls to ask about a delayed delivery, a wrong item sent, or the tracking status of their package.",
    aiRoleDefinition:
      "Act as a store customer-service representative who looks up the order number, confirms the status, and handles a late or incorrect order calmly with a clear next step.",
    conversationDirections: [
      "Let the learner introduce the reason — pickup, delay, or incorrect item.",
      "Ask for the order number early to look it up.",
      "Give the current status — ready for pickup, in transit, or delayed.",
      "Let the learner describe what went wrong if the order is incorrect.",
      "Offer one clear next step — reorder, refund, or in-store swap.",
      "Close by confirming the resolution and thanking the learner for their patience.",
    ],
    warmthPatterns: [
      "Ask for the order number before asking anything else — it unblocks every other question.",
      "Keep delay news factual and forward-looking: 'It's on its way and should arrive by X.'",
      "Treat a wrong item as fixable, not a catastrophe — one calm sentence moves toward the solution.",
    ],
    seedInputs: [
      "I am checking on my online order.",
      "Hi, I'm here to pick up an online order.",
      "My order is late — could you check the tracking for me?",
    ],
    detectionPatterns: [
      /\b(?:online order|order number|tracking number|delivery status|has my order arrived|pickup order|click and collect)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-online-order-number",
        label: "Order number first",
        note: "For online orders, English staff usually need the order number early. Practice 'My order number is...' before the long story. Having it ready on your phone removes the most common friction in these conversations.",
      },
      {
        id: "shopping-online-checking-on",
        label: "'Checking on' my order — kiểm tra đơn hàng",
        note: "'Checking on my order' is a natural phrase for asking about status without sounding impatient. 'Kiểm tra đơn hàng' is the Vietnamese counterpart — the same calm intent, just a different form.",
      },
      {
        id: "shopping-online-pickup-note",
        label: "'Click and collect' — mua online đến lấy",
        note: "'Click and collect' or 'pickup order' means you buy online and collect in store. 'I'm here to pick up an online order' is the sentence at the counter. Staff will ask for your name or order number to confirm.",
      },
      {
        id: "shopping-online-track",
        label: "'Track' the order — theo dõi đơn hàng",
        note: "'Theo dõi đơn hàng' is 'track my order.' Asking 'Can you track my order?' or 'What's the tracking number?' moves the conversation forward calmly. The tracking number is usually in your confirmation email.",
      },
    ],
    followUps: [
      { id: "shopping-online-order", question: "What order are you asking about?", salienceQuestion: "How would you ask about the {slot}?" },
      { id: "shopping-online-number", question: "How would you give the order number?", salienceQuestion: "How would you connect the order number to the {slot}?" },
      { id: "shopping-online-status", question: "What status do you want to know?", salienceQuestion: "What status do you need for the {slot}?" },
      { id: "shopping-online-next", question: "What next step would you ask for?", salienceQuestion: "What should happen next with the {slot}?" },
      { id: "shopping-online-pickup", question: "How would you say you are here to pick it up?", salienceQuestion: "How would you collect the {slot}?" },
      { id: "shopping-online-late", question: "How would you ask why it is late?", salienceQuestion: "How would you ask why the {slot} is delayed?" },
    ],
  },
  {
    id: "topic-shopping-grocery-checkout",
    labelEn: "Grocery Checkout",
    labelVi: "Tính tiền ở siêu thị",
    category: "shopping",
    scenarioDescription:
      "The learner is at the grocery store checkout and needs to handle the cashier's prompts — loyalty card, bag preference, an item that won't scan at self-checkout — and close the transaction smoothly.",
    aiRoleDefinition:
      "Act as a grocery cashier who asks the standard checkout questions (loyalty card, bag type), handles a self-checkout help request, and finishes the transaction with a friendly send-off.",
    conversationDirections: [
      "Ask the learner about their loyalty card or store membership number.",
      "Ask about bag preference — own bag, paper, or plastic.",
      "Let the learner handle a 'this item won't scan' moment at self-checkout.",
      "Confirm the total before the learner pays.",
      "Handle a coupon or discount code if the learner mentions one.",
      "Close with a friendly 'have a great day' — the standard grocery send-off.",
    ],
    warmthPatterns: [
      "Keep loyalty card questions quick — 'no' is a complete answer and needs no explanation.",
      "Make self-checkout help requests feel ordinary — staff expect them and never mind.",
      "A friendly 'have a great day' at the end costs nothing and makes a good impression.",
    ],
    seedInputs: [
      "I have my own bag, thank you.",
      "No loyalty card, thanks — just paying for these.",
      "Could you help me? This one won't scan.",
    ],
    detectionPatterns: [
      /\b(?:grocery|groceries|supermarket|own bag|reusable bag|loyalty card|scan this|checkout lane)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-grocery-own-bag",
        label: "'I have my own bag' — tôi mang túi theo rồi",
        note: "A natural grocery phrase is 'I have my own bag.' 'Tôi mang túi theo rồi' (I already brought a bag) maps to that sentence. It is clearer and friendlier than 'I bring bag' and saves you the bag charge.",
      },
      {
        id: "shopping-grocery-loyalty",
        label: "Loyalty card question",
        note: "Cashiers may ask 'Do you have a loyalty card or rewards number?' Learners can answer simply: 'No, I don't have one.' No explanation needed — it is a yes/no question and 'no' is a perfectly good answer.",
      },
      {
        id: "shopping-grocery-self-checkout",
        label: "Self-checkout help",
        note: "At self-checkout, it's fine to wave and say 'Could you help me? This won't scan.' 'Cái này không quét được' is the Vietnamese instinct — the English version is just as short. Staff expect these calls and are never annoyed.",
      },
      {
        id: "shopping-grocery-plural-groceries",
        label: "'Groceries' is always plural",
        note: "The food shopping itself is 'groceries' with an -s — there's no common singular. 'I'm buying groceries' sounds natural; 'a grocery' refers to the store, not the food. Vietnamese 'đồ ăn' or 'thức phẩm' never needs a plural form, so the -s is easy to drop.",
      },
    ],
    followUps: [
      { id: "shopping-grocery-bag", question: "Do you have your own bag?", salienceQuestion: "Would you use your own bag for the {slot}?" },
      { id: "shopping-grocery-card", question: "How would you answer about a loyalty card?", salienceQuestion: "How would you answer a membership question for the {slot}?" },
      { id: "shopping-grocery-total", question: "How would you check the total?", salienceQuestion: "How would you check the total for the {slot}?" },
      { id: "shopping-grocery-leave", question: "What would you say before leaving?", salienceQuestion: "What would you say after paying for the {slot}?" },
      { id: "shopping-grocery-self", question: "How would you ask for help at self-checkout?", salienceQuestion: "How would you get help scanning the {slot}?" },
      { id: "shopping-grocery-weigh", question: "How would you ask how to weigh produce?", salienceQuestion: "How would you weigh the {slot}?" },
    ],
  },
] as const satisfies readonly D4SpeakTopic[];

export const speakTopics = shoppingSpeakTopics;
