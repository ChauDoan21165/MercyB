import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

export const speakTopics = [
  {
    id: "topic-documents-filling-out-form",
    labelEn: "Filling Out A Form",
    labelVi: "Điền mẫu đơn",
    category: "documents",
    seedInputs: ["I need to fill out this form with my name and address."],
    detectionPatterns: [
      /\b(?:fill out|filling out|form|application form|write my name|signature|date of birth)\b/i,
    ],
    followUps: [
      { id: "documents-form-purpose", question: "What is this form for?", salienceQuestion: "What is the {slot} asking you to do?" },
      { id: "documents-form-info", question: "What information do you need to write first?", salienceQuestion: "What information belongs in the {slot}?" },
      { id: "documents-form-question", question: "Which part of the form feels unclear?", salienceQuestion: "What is unclear about the {slot}?" },
      { id: "documents-form-submit", question: "Where will you submit the form?", salienceQuestion: "Where do you need to submit the {slot}?" },
    ],
  },
  {
    id: "topic-documents-id-card",
    labelEn: "Showing An ID Card",
    labelVi: "Xuất trình thẻ căn cước",
    category: "documents",
    seedInputs: ["I can show my ID card at the front desk."],
    detectionPatterns: [
      /\b(?:id card|identification card|photo id|show my id|government id|identity card)\b/i,
    ],
    followUps: [
      { id: "documents-id-place", question: "Where do you need to show your ID?", salienceQuestion: "Where do you need to show the {slot}?" },
      { id: "documents-id-reason", question: "Why are they asking for ID?", salienceQuestion: "Why is the {slot} needed here?" },
      { id: "documents-id-confirm", question: "How would you confirm they checked the right name?", salienceQuestion: "How would you confirm the name on the {slot}?" },
      { id: "documents-id-return", question: "What would you say when they give it back?", salienceQuestion: "What would you say after they return the {slot}?" },
    ],
  },
  {
    id: "topic-documents-passport",
    labelEn: "Passport Details",
    labelVi: "Thông tin hộ chiếu",
    category: "documents",
    seedInputs: ["My passport number is on the first page."],
    detectionPatterns: [
      /\b(?:passport|passport number|expiry date|expiration date|visa page|first page)\b/i,
    ],
    followUps: [
      { id: "documents-passport-use", question: "What do you need the passport for today?", salienceQuestion: "What do you need the {slot} for today?" },
      { id: "documents-passport-detail", question: "Which passport detail do you need to read aloud?", salienceQuestion: "Which detail on the {slot} do you need to say?" },
      { id: "documents-passport-copy", question: "Do they need the original passport or a copy?", salienceQuestion: "Do they need the original {slot} or a copy?" },
      { id: "documents-passport-care", question: "How will you keep it safe after using it?", salienceQuestion: "How will you keep the {slot} safe?" },
    ],
  },
  {
    id: "topic-documents-utility-bill",
    labelEn: "Utility Bill",
    labelVi: "Hóa đơn điện nước",
    category: "documents",
    seedInputs: ["This utility bill has my current address."],
    detectionPatterns: [
      /\b(?:utility bill|electric bill|water bill|gas bill|power bill|current address|billing address)\b/i,
    ],
    followUps: [
      { id: "documents-utility-type", question: "What kind of bill is it?", salienceQuestion: "What kind of bill is the {slot}?" },
      { id: "documents-utility-address", question: "How would you point out the address on it?", salienceQuestion: "How would you show the address on the {slot}?" },
      { id: "documents-utility-date", question: "What date does the bill show?", salienceQuestion: "What date is on the {slot}?" },
      { id: "documents-utility-copy", question: "Do you need to bring a paper copy or a digital copy?", salienceQuestion: "Do you need a paper or digital copy of the {slot}?" },
    ],
  },
  {
    id: "topic-documents-bank-statement",
    labelEn: "Bank Statement",
    labelVi: "Sao kê ngân hàng",
    category: "documents",
    seedInputs: ["I downloaded my bank statement for this month."],
    detectionPatterns: [
      /\b(?:bank statement|account statement|bank account|monthly statement|transaction history)\b/i,
    ],
    followUps: [
      { id: "documents-bank-month", question: "Which month does the statement show?", salienceQuestion: "Which month is shown on the {slot}?" },
      { id: "documents-bank-name", question: "How would you show your name on the statement?", salienceQuestion: "How would you show your name on the {slot}?" },
      { id: "documents-bank-private", question: "Which details would you keep private?", salienceQuestion: "Which details on the {slot} should stay private?" },
      { id: "documents-bank-send", question: "How will you send or print it?", salienceQuestion: "How will you send or print the {slot}?" },
    ],
  },
  {
    id: "topic-documents-pay-stub",
    labelEn: "Pay Stub",
    labelVi: "Phiếu lương",
    category: "documents",
    seedInputs: ["My pay stub shows my hours and my pay."],
    detectionPatterns: [
      /\b(?:pay stub|payslip|pay slip|paycheck|hours worked|gross pay|net pay)\b/i,
    ],
    followUps: [
      { id: "documents-pay-period", question: "What pay period does it cover?", salienceQuestion: "What pay period is on the {slot}?" },
      { id: "documents-pay-hours", question: "How many hours does it show?", salienceQuestion: "How many hours are on the {slot}?" },
      { id: "documents-pay-question", question: "What would you ask if something looks wrong?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "documents-pay-save", question: "Where do you usually save your pay stubs?", salienceQuestion: "Where would you save the {slot}?" },
    ],
  },
  {
    id: "topic-documents-rental-agreement",
    labelEn: "Rental Agreement",
    labelVi: "Hợp đồng thuê nhà",
    category: "documents",
    seedInputs: ["I need to read the rental agreement before I sign it."],
    detectionPatterns: [
      /\b(?:rental agreement|lease agreement|lease|rent contract|landlord|tenant|security deposit)\b/i,
    ],
    followUps: [
      { id: "documents-rental-parties", question: "Who are the people named in the agreement?", salienceQuestion: "Who is named in the {slot}?" },
      { id: "documents-rental-payment", question: "What does it say about rent and deposit?", salienceQuestion: "What does the {slot} say about payment?" },
      { id: "documents-rental-rule", question: "Which rule do you want to check carefully?", salienceQuestion: "Which rule in the {slot} matters most to you?" },
      { id: "documents-rental-sign", question: "What would you ask before signing?", salienceQuestion: "What would you ask before signing the {slot}?" },
    ],
  },
  {
    id: "topic-documents-employment-contract",
    labelEn: "Employment Contract",
    labelVi: "Hợp đồng lao động",
    category: "documents",
    seedInputs: ["My employment contract says my start date and hourly wage."],
    detectionPatterns: [
      /\b(?:employment contract|job contract|work contract|start date|hourly wage|salary agreement)\b/i,
    ],
    followUps: [
      { id: "documents-employment-start", question: "What start date is written there?", salienceQuestion: "What start date is written on the {slot}?" },
      { id: "documents-employment-pay", question: "How would you explain the pay section?", salienceQuestion: "How would you explain the pay section in the {slot}?" },
      { id: "documents-employment-hours", question: "What does it say about your work hours?", salienceQuestion: "What does the {slot} say about your hours?" },
      { id: "documents-employment-copy", question: "Who should keep a copy?", salienceQuestion: "Who should keep a copy of the {slot}?" },
    ],
  },
  {
    id: "topic-documents-tax-form",
    labelEn: "Tax Form",
    labelVi: "Mẫu khai thuế",
    category: "documents",
    seedInputs: ["I need help checking this tax form before I submit it."],
    detectionPatterns: [
      /\b(?:tax form|income tax|tax return|tax document|tax slip|submit my taxes)\b/i,
    ],
    followUps: [
      { id: "documents-tax-year", question: "Which tax year is this for?", salienceQuestion: "Which tax year is on the {slot}?" },
      { id: "documents-tax-income", question: "Where does it show your income?", salienceQuestion: "Where does the {slot} show income?" },
      { id: "documents-tax-help", question: "Who could help you check it?", salienceQuestion: "Who could help you check the {slot}?" },
      { id: "documents-tax-deadline", question: "When do you need to submit it?", salienceQuestion: "When do you need to submit the {slot}?" },
    ],
  },
  {
    id: "topic-documents-insurance-card",
    labelEn: "Insurance Card",
    labelVi: "Thẻ bảo hiểm",
    category: "documents",
    seedInputs: ["I keep my insurance card in my wallet."],
    detectionPatterns: [
      /\b(?:insurance card|insurance number|policy number|coverage card|benefits card)\b/i,
    ],
    followUps: [
      { id: "documents-insurance-need", question: "Where might you need this card?", salienceQuestion: "Where might you need the {slot}?" },
      { id: "documents-insurance-number", question: "Which number would you read from the card?", salienceQuestion: "Which number would you read from the {slot}?" },
      { id: "documents-insurance-question", question: "What question would you ask about coverage?", salienceQuestion: "What question would you ask about the {slot}?" },
      { id: "documents-insurance-keep", question: "How do you keep the card easy to find?", salienceQuestion: "How do you keep the {slot} easy to find?" },
    ],
  },
  {
    id: "topic-documents-receipt",
    labelEn: "Receipt",
    labelVi: "Hóa đơn mua hàng",
    category: "documents",
    seedInputs: ["I saved the receipt in case I need to return the item."],
    detectionPatterns: [
      /\b(?:receipt|sales receipt|return receipt|proof of purchase|purchase date|store receipt)\b/i,
    ],
    followUps: [
      { id: "documents-receipt-item", question: "What item is listed on the receipt?", salienceQuestion: "What item is listed on the {slot}?" },
      { id: "documents-receipt-date", question: "What purchase date does it show?", salienceQuestion: "What date is shown on the {slot}?" },
      { id: "documents-receipt-return", question: "How would you use it for a return?", salienceQuestion: "How would you use the {slot} for a return?" },
      { id: "documents-receipt-storage", question: "Where would you keep it until you know you are done?", salienceQuestion: "Where would you keep the {slot}?" },
    ],
  },
  {
    id: "topic-documents-warranty",
    labelEn: "Warranty Paper",
    labelVi: "Giấy bảo hành",
    category: "documents",
    seedInputs: ["The warranty paper says the repair is covered for one year."],
    detectionPatterns: [
      /\b(?:warranty|warranty paper|guarantee|covered for one year|repair coverage|service plan)\b/i,
    ],
    followUps: [
      { id: "documents-warranty-product", question: "What product does the warranty cover?", salienceQuestion: "What product does the {slot} cover?" },
      { id: "documents-warranty-time", question: "How long is the warranty good for?", salienceQuestion: "How long is the {slot} good for?" },
      { id: "documents-warranty-repair", question: "What would you say if you need a repair?", salienceQuestion: "What would you say about repair under the {slot}?" },
      { id: "documents-warranty-proof", question: "What proof might the store ask for?", salienceQuestion: "What proof might they ask for with the {slot}?" },
    ],
  },
  {
    id: "topic-documents-school-notice",
    labelEn: "School Notice",
    labelVi: "Thông báo từ trường",
    category: "documents",
    seedInputs: ["The school notice says the meeting is on Friday."],
    detectionPatterns: [
      /\b(?:school notice|notice from school|parent letter|teacher note|school meeting|field trip form)\b/i,
    ],
    followUps: [
      { id: "documents-school-topic", question: "What is the notice about?", salienceQuestion: "What is the {slot} about?" },
      { id: "documents-school-date", question: "What date or time should you remember?", salienceQuestion: "What date or time is on the {slot}?" },
      { id: "documents-school-action", question: "What does the school want you to do?", salienceQuestion: "What action does the {slot} ask for?" },
      { id: "documents-school-reply", question: "How would you reply to the teacher?", salienceQuestion: "How would you reply about the {slot}?" },
    ],
  },
  {
    id: "topic-documents-consent-form",
    labelEn: "Consent Form",
    labelVi: "Phiếu đồng ý",
    category: "documents",
    seedInputs: ["I need to sign the consent form for the activity."],
    detectionPatterns: [
      /\b(?:consent form|permission form|sign permission|agree to|parent signature|give consent)\b/i,
    ],
    followUps: [
      { id: "documents-consent-activity", question: "What activity is the form for?", salienceQuestion: "What activity is the {slot} for?" },
      { id: "documents-consent-risk", question: "What information should you read carefully?", salienceQuestion: "What part of the {slot} should you read carefully?" },
      { id: "documents-consent-signature", question: "Who needs to sign it?", salienceQuestion: "Who needs to sign the {slot}?" },
      { id: "documents-consent-question", question: "What would you ask before agreeing?", salienceQuestion: "What would you ask before agreeing to the {slot}?" },
    ],
  },
  {
    id: "topic-documents-address-change",
    labelEn: "Address Change Form",
    labelVi: "Mẫu đổi địa chỉ",
    category: "documents",
    seedInputs: ["I need to update my address on this form."],
    detectionPatterns: [
      /\b(?:address change|change my address|update my address|new address|old address|mailing address)\b/i,
    ],
    followUps: [
      { id: "documents-address-old", question: "What old address do you need to list?", salienceQuestion: "What old address belongs on the {slot}?" },
      { id: "documents-address-new", question: "How would you say your new address clearly?", salienceQuestion: "How would you say the new address for the {slot}?" },
      { id: "documents-address-start", question: "When should the address change start?", salienceQuestion: "When should the change on the {slot} start?" },
      { id: "documents-address-confirm", question: "How would you confirm they updated it?", salienceQuestion: "How would you confirm the {slot} was updated?" },
    ],
  },
] as const satisfies readonly SpeakTopicLibraryEntry[];
