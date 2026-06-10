import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Documents & forms theme. Deterministic / client-side; copy is warm and low-shame.
// A9 overnight L1 pass: each topic now carries Vietnamese→English interference notes
// (naming genuine VN interference as friendly context, never a grammar correction).
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
    l1InterferenceNotes: [
      {
        id: "documents-form-fill-out",
        label: "Fill out, not just fill",
        note: "'Điền đơn' often becomes 'fill the form.' The natural English keeps the particle: 'fill out the form' (US) or 'fill in the form' (UK). Both are fine; 'fill out' is the safe one in Canada/the US.",
      },
      {
        id: "documents-form-name-order",
        label: "Family name vs given name",
        note: "Vietnamese writes the family name first, but Western forms label boxes 'First/Given name' and 'Last/Family name.' It's worth pausing to put your given name in 'First name' — staff read it that way.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-id-show",
        label: "Show, not give",
        note: "'Xuất trình' is 'show my ID,' not 'give my ID.' At a desk you usually 'show' it (they look) rather than hand it over for keeps — 'Here's my ID' or 'I can show my ID' is natural.",
      },
      {
        id: "documents-id-card-word",
        label: "ID, photo ID, government ID",
        note: "Vietnamese 'căn cước' maps to 'ID card' or 'photo ID.' When they want an official one they may say 'government-issued ID' — recognizing that phrase saves a puzzled pause.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-passport-numbers",
        label: "Reading the number slowly",
        note: "Passport numbers mix letters and digits. Vietnamese speakers often group digits in pairs; English readers expect them one at a time. Saying 'B — 1 — 2 — 3' slowly, digit by digit, is clearer than rushing.",
      },
      {
        id: "documents-passport-expiry",
        label: "Expiry date vs expired",
        note: "'Hết hạn' covers both the date and the state. In English the noun is 'expiry/expiration date' ('It expires in 2027'); 'expired' means it's already no longer valid. Keep them apart so staff aren't confused.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-utility-split",
        label: "Electricity and water are separate",
        note: "Vietnamese 'điện nước' bundles electricity and water in one phrase. English usually names them separately: 'electricity bill,' 'water bill,' 'gas bill.' 'Utility bill' is the umbrella word when any one will do.",
      },
      {
        id: "documents-utility-proof",
        label: "Proof of address",
        note: "Offices often accept a utility bill as 'proof of address.' That set phrase has no direct Vietnamese word — knowing it helps you answer 'Do you have proof of address?' with 'Yes, my electricity bill.'",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-bank-statement-word",
        label: "Statement is the word",
        note: "'Sao kê' is 'a (bank) statement' — the monthly list of transactions. Learners sometimes say 'bank paper' or 'bank history'; 'bank statement' or 'account statement' is the term staff expect.",
      },
      {
        id: "documents-bank-download",
        label: "Download / print, not take",
        note: "For a digital statement, English uses 'download' or 'print,' not 'take': 'I downloaded my statement' or 'I'll print it.' Small verb choice, but it signals you mean the e-copy.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-pay-stub-word",
        label: "Pay stub / payslip",
        note: "'Phiếu lương' is 'pay stub' (US/Canada) or 'payslip' (UK). 'Paycheck' is the payment itself; the paper that lists the breakdown is the pay stub. Either stub word is understood.",
      },
      {
        id: "documents-pay-gross-net",
        label: "Gross pay vs net pay",
        note: "'Lương gộp' is 'gross pay' (before deductions) and 'lương thực nhận' is 'net pay' or 'take-home pay' (what lands in your account). Naming them right makes questions about your stub much clearer.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-rental-deposit",
        label: "Security deposit",
        note: "'Tiền cọc / tiền đặt cọc' is the 'security deposit' — money held and usually returned if there's no damage. 'Deposit' alone can sound like a down payment, so 'security deposit' is the precise term for a rental.",
      },
      {
        id: "documents-rental-landlord-tenant",
        label: "Landlord and tenant",
        note: "'Chủ nhà' is the 'landlord' and 'người thuê' is the 'tenant.' Forms name both, so recognizing which line is yours ('tenant') avoids signing on the wrong line.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-employment-wage-salary",
        label: "Hourly wage vs salary",
        note: "'Mức lương' covers both, but English splits them: 'hourly wage' (paid per hour) versus 'salary' (a fixed yearly/monthly amount). Saying which one matches your contract prevents pay confusion.",
      },
      {
        id: "documents-employment-sign-word",
        label: "Sign vs signature",
        note: "'Ký' is the verb 'sign'; 'chữ ký' is the noun 'signature.' 'Please sign here' asks for the action; 'your signature' names the mark. Keeping them apart helps when staff point to the line.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-tax-file-vs-pay",
        label: "File taxes vs pay taxes",
        note: "'Khai thuế' is 'file (your) taxes' — submitting the form — while 'nộp thuế' is 'pay taxes.' In English you 'file a tax return' even in a year you owe nothing, so don't swap 'file' and 'pay.'",
      },
      {
        id: "documents-tax-return-word",
        label: "Tax return",
        note: "'Tax return' is the completed form you file — not money coming back. The money back is a 'tax refund.' This pair trips up many learners, so it's worth keeping separate.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-insurance-policy-number",
        label: "Policy number",
        note: "The ID on the card is usually the 'policy number' or 'member number,' not just 'insurance number.' When staff ask 'What's your policy number?', they mean that line on the card.",
      },
      {
        id: "documents-insurance-coverage",
        label: "Coverage",
        note: "'Bảo hiểm chi trả' becomes 'it's covered' / 'my coverage.' 'Is this covered?' is the everyday question; 'coverage' is the noun for what the plan pays — both are more natural than 'the insurance pays.'",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-receipt-vs-bill",
        label: "Receipt vs bill",
        note: "Vietnamese 'hóa đơn' covers both the 'bill' (what you owe) and the 'receipt' (proof you paid). In English the receipt comes after paying — 'Can I have the receipt?' asks for that proof, not the bill.",
      },
      {
        id: "documents-receipt-proof",
        label: "Proof of purchase",
        note: "For returns, staff ask for 'proof of purchase' — usually the receipt. Knowing that set phrase lets you answer 'Yes, I kept the receipt' without hunting for words.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-warranty-word",
        label: "Warranty",
        note: "'Bảo hành' is the 'warranty.' 'Guarantee' is close and understood, but for products the standard word on the paper and in stores is 'warranty' ('It's still under warranty').",
      },
      {
        id: "documents-warranty-under",
        label: "Under warranty",
        note: "The natural phrase for 'còn bảo hành' is 'it's still under warranty' / 'covered under warranty.' That little 'under' is easy to drop but is what staff listen for.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-school-notice-word",
        label: "Notice / letter from school",
        note: "'Thông báo' is a 'notice' or 'letter from school.' Learners sometimes say 'school announce'; the noun is 'notice.' 'The school sent a notice' is the natural frame.",
      },
      {
        id: "documents-school-reply-slip",
        label: "Reply slip / sign and return",
        note: "Many notices end with 'please sign and return.' The small tear-off part is a 'reply slip.' Recognizing 'sign and return the bottom part' tells you exactly what the teacher needs back.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-consent-give-consent",
        label: "Give consent / give permission",
        note: "'Đồng ý' is 'agree,' but the form word is 'consent' or 'permission': 'I give my consent' / 'I give permission.' 'Sign the consent form' is the natural action phrase.",
      },
      {
        id: "documents-consent-parent-signature",
        label: "Parent/guardian signature",
        note: "School forms ask for a 'parent/guardian signature.' 'Guardian' ('người giám hộ') is included so any caregiver can sign — useful to recognize when the line isn't only for a parent.",
      },
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
    l1InterferenceNotes: [
      {
        id: "documents-address-order",
        label: "Address order is reversed",
        note: "Vietnamese addresses run small-to-big with the street last; English/Canadian forms go number-then-street first, then city, province, postal code. Saying 'unit, then street number, then street name' keeps it in the order the form wants.",
      },
      {
        id: "documents-address-update",
        label: "Update / change my address",
        note: "'Đổi địa chỉ' is 'change' or 'update my address.' 'I need to update my address' is the natural office sentence; 'mailing address' is the one where letters should go, in case they ask which.",
      },
    ],
    followUps: [
      { id: "documents-address-old", question: "What old address do you need to list?", salienceQuestion: "What old address belongs on the {slot}?" },
      { id: "documents-address-new", question: "How would you say your new address clearly?", salienceQuestion: "How would you say the new address for the {slot}?" },
      { id: "documents-address-start", question: "When should the address change start?", salienceQuestion: "When should the change on the {slot} start?" },
      { id: "documents-address-confirm", question: "How would you confirm they updated it?", salienceQuestion: "How would you confirm the {slot} was updated?" },
    ],
  },
] as const satisfies readonly SpeakTopicLibraryEntry[];
