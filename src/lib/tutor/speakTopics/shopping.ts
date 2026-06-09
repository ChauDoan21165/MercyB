import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Shopping theme. Deterministic / client-side; copy is warm and low-shame.
// A9 batch-2 deepening: each topic carries 3 L1 interference notes and 6
// conversation directions (followUps) within the existing schema.
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-shopping-store-help",
    labelEn: "Asking For Help In A Store",
    labelVi: "Nhờ nhân viên cửa hàng giúp",
    category: "shopping",
    seedInputs: ["Excuse me, can you help me find this item?"],
    detectionPatterns: [
      /\b(?:store help|help me find|find this item|where can i find|shop assistant|staff help|looking for)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-help-directness",
        label: "Direct but polite request",
        note: "Vietnamese learners may wait silently or say only the item name. In English stores, a simple 'Excuse me, can you help me find...' is warm and normal.",
      },
      {
        id: "shopping-item-before-story",
        label: "Item first",
        note: "English store help works best when the item comes early, before a long explanation: 'I'm looking for a phone charger.'",
      },
      {
        id: "shopping-help-excuse-me",
        label: "Opening with 'Excuse me'",
        note: "'Xin lỗi' to get attention is 'Excuse me' here, not 'Sorry.' 'Excuse me, do you work here?' is a friendly way to start when you're not sure who is staff.",
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
    seedInputs: ["How much is this, please?"],
    detectionPatterns: [
      /\b(?:how much is this|price check|check the price|how much does it cost|costs how much|price tag)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-price-question-order",
        label: "Natural price question",
        note: "A direct VN-to-English order like 'This how much?' is common in practice. The useful store frame is short: 'How much is this?'",
      },
      {
        id: "shopping-price-please",
        label: "Small softener",
        note: "Adding 'please' or a friendly tone makes the question sound calm without needing a long formal sentence.",
      },
      {
        id: "shopping-price-each-note",
        label: "Each, or for two",
        note: "Prices can be per item: 'Is that each, or for two?' clears up the 'cái này bao nhiêu một cái' question without a long sentence.",
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
    seedInputs: ["Do you have this in a medium?"],
    detectionPatterns: [
      /\b(?:size|small|medium|large|extra large|try this on|fits me|too tight|too loose|do you have this in)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-size-in-a-size",
        label: "Size phrase",
        note: "Learners may say 'have size M?' because Vietnamese drops the frame. In English, 'Do you have this in a medium?' is the practical store sentence.",
      },
      {
        id: "shopping-fit-body-comfort",
        label: "Fit without embarrassment",
        note: "It is normal to say 'too tight' or 'too loose' about clothes. Keep it about the item, not the body.",
      },
      {
        id: "shopping-size-fitting-room",
        label: "The fitting room",
        note: "'Phòng thử đồ' is 'the fitting room' or 'the changing room.' 'Where's the fitting room?' is a normal question before you try things on.",
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
    seedInputs: ["Is this item out of stock?"],
    detectionPatterns: [
      /\b(?:out of stock|sold out|back in stock|have any left|do you have more|available again|restock)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-stock-available",
        label: "Stock words",
        note: "Vietnamese 'het hang' maps to 'out of stock' or 'sold out.' Practicing both helps learners understand staff replies.",
      },
      {
        id: "shopping-stock-timing-note",
        label: "Ask about timing",
        note: "A useful follow-up is 'When will it be back in stock?' rather than stopping after the first no.",
      },
      {
        id: "shopping-stock-other-store",
        label: "Another branch",
        note: "Staff can often check another store: 'Could you see if another branch has it?' keeps the search going when the shelf is empty.",
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
    seedInputs: ["Is this on sale today?"],
    detectionPatterns: [
      /\b(?:on sale|discount|promotion|coupon|deal|clearance|marked down|cheaper|sale price)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-discount-polite",
        label: "Polite discount question",
        note: "Direct bargaining is normal in many VN markets, but in fixed-price stores English often uses 'Is this on sale?' or 'Do you have any discounts?'",
      },
      {
        id: "shopping-discount-not-demand",
        label: "Question, not demand",
        note: "A soft question helps avoid sounding like a demand: 'Is there a discount for this one?'",
      },
      {
        id: "shopping-discount-price-match",
        label: "Price match",
        note: "Some stores match a lower price elsewhere. 'Do you price match?' is a useful question that has no single Vietnamese word.",
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
    seedInputs: ["Can I pay by card, or do you prefer cash?"],
    detectionPatterns: [
      /\b(?:pay by card|pay with card|pay in cash|cash only|tap my card|credit card|debit card|payment)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-pay-cash-preposition",
        label: "Cash phrase",
        note: "VN learners often say 'pay by cash.' In store English, 'pay in cash' or 'pay with cash' is natural.",
      },
      {
        id: "shopping-card-or-cash",
        label: "Offer two options",
        note: "A calm cashier question is 'Can I pay by card, or do you prefer cash?' It works well in small shops.",
      },
      {
        id: "shopping-pay-tap-insert",
        label: "Tap, insert, or swipe",
        note: "Card machines prompt 'tap, insert, or swipe.' You don't have to read it perfectly — 'How do I pay — tap?' is a fine question to ask the cashier.",
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
    seedInputs: ["Could I have a bag and a receipt, please?"],
    detectionPatterns: [
      /\b(?:checkout|cashier|bag|receipt|paper bag|plastic bag|do you need a bag|can i get a receipt)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-receipt-article",
        label: "A receipt",
        note: "Learners may say 'give me receipt.' The safer customer frame is 'Could I have a receipt, please?'",
      },
      {
        id: "shopping-bag-request",
        label: "Bag request",
        note: "In many stores bags cost extra, so asking clearly about a bag avoids surprise at checkout.",
      },
      {
        id: "shopping-checkout-paper-plastic",
        label: "Paper or plastic",
        note: "Cashiers ask 'Paper or plastic?' about the bag type. A short 'Paper, please' or 'I have my own' answers it cleanly.",
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
    seedInputs: ["I would like to return this item."],
    detectionPatterns: [
      /\b(?:return this item|return an item|bring it back|refund|money back|return policy|receipt for return)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-return-not-accuse",
        label: "Calm return opening",
        note: "A return request does not need blame first. 'I would like to return this item' is clear and low-pressure.",
      },
      {
        id: "shopping-return-reason-note",
        label: "Short reason",
        note: "English store staff often ask for a reason. A simple reason like 'It does not fit' or 'It is damaged' is enough.",
      },
      {
        id: "shopping-return-window-note",
        label: "The return window",
        note: "Stores allow returns for a set time, often 30 days. 'Am I still within the return window?' is a useful question if you've waited a while.",
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
    seedInputs: ["Can I exchange this for a different size?"],
    detectionPatterns: [
      /\b(?:exchange this|different size|different color|swap it|change for another|replace this|exchange policy)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-exchange-vs-change",
        label: "Exchange, not just change",
        note: "Vietnamese 'doi hang' can become 'change this.' In store English, 'exchange this' is clearer for replacing an item.",
      },
      {
        id: "shopping-exchange-specific",
        label: "Say what you want instead",
        note: "The staff can help faster when the replacement is specific: different size, different color, or same item without damage.",
      },
      {
        id: "shopping-exchange-difference-note",
        label: "Price difference",
        note: "If the new item costs more, staff say 'pay the difference.' 'Do I pay the difference?' is a calm, clear question to ask.",
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
    seedInputs: ["This item is damaged. Could you help me?"],
    detectionPatterns: [
      /\b(?:damaged|broken|doesn't work|not working|defective|scratched|missing piece|problem with this item)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-damaged-this-item",
        label: "Item problem phrase",
        note: "Learners may say 'it has problem.' A clear store frame is 'There is a problem with this item' or 'This item is damaged.'",
      },
      {
        id: "shopping-damaged-help",
        label: "Ask for help after the issue",
        note: "After naming the problem, add a calm request: 'Could you help me?' This keeps the tone respectful.",
      },
      {
        id: "shopping-damaged-when-note",
        label: "When you noticed",
        note: "Staff often ask when you found the damage. 'I noticed it when I got home' is a simple, honest answer that helps the return.",
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
    seedInputs: ["I am checking on my online order."],
    detectionPatterns: [
      /\b(?:online order|order number|tracking number|delivery status|has my order arrived|pickup order|click and collect)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-online-order-number",
        label: "Order number first",
        note: "For online orders, English staff usually need the order number early. Practice 'My order number is...' before the long story.",
      },
      {
        id: "shopping-online-checking-on",
        label: "Checking on",
        note: "'Checking on my order' is a natural phrase for asking about status without sounding upset.",
      },
      {
        id: "shopping-online-pickup-note",
        label: "Pickup in store",
        note: "'Click and collect' or 'pickup order' means you buy online and collect in store. 'I'm here to pick up an online order' is the sentence at the counter.",
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
    seedInputs: ["I have my own bag, thank you."],
    detectionPatterns: [
      /\b(?:grocery|groceries|supermarket|own bag|reusable bag|loyalty card|scan this|checkout lane)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "shopping-grocery-own-bag",
        label: "Own bag phrase",
        note: "A natural grocery phrase is 'I have my own bag.' It is clearer than 'I bring bag.'",
      },
      {
        id: "shopping-grocery-loyalty",
        label: "Membership question",
        note: "Cashiers may ask about a loyalty card or phone number. Learners can answer simply: 'No, I don't have one.'",
      },
      {
        id: "shopping-grocery-self-checkout",
        label: "Self-checkout help",
        note: "At self-checkout, it's fine to wave for help: 'Could you help me? It won't scan.' Staff expect this and won't mind.",
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
] as const;
