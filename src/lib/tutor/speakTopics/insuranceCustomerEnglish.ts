import type { SpeakTopicLibraryEntry as SpeakTopic } from "../speakTopicLibrary";

// Insurance customer English theme. Covers the everyday situations a Vietnamese
// newcomer faces when buying or using insurance in the US: enrolling in health
// insurance, understanding a health plan, using auto insurance after an accident,
// getting a home/renters quote, filing a claim, and reading an explanation of
// benefits. L1 notes quote the Vietnamese source phrase with full diacritics.
// note-ids and followUp-ids are disjoint (followUp ids always end with -fu).
export const speakTopics: readonly SpeakTopic[] = [
  {
    id: "topic-insurance-enroll-health",
    labelEn: "Enrolling In Health Insurance",
    labelVi: "Đăng ký bảo hiểm sức khỏe",
    category: "insurance-customer",
    seedInputs: ["I need to sign up for health insurance. What are my options?"],
    detectionPatterns: [
      /\b(?:sign up for (?:health )?insurance|enroll (?:in )?(?:health )?insurance|open enrollment|health plan|marketplace plan|employer (?:health )?plan|coverage options)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "insurance-enroll-bao-hiem",
        label: "Bảo hiểm sức khỏe → 'health insurance'",
        note: "'Bảo hiểm sức khỏe' is 'health insurance.' Enrolling is called 'signing up' or 'enrolling.' The signup window each year is 'open enrollment': 'When is open enrollment?'",
      },
      {
        id: "insurance-enroll-premium-copay",
        label: "Phí hàng tháng, đồng chi trả → premium and copay",
        note: "A 'premium' is the monthly amount you pay whether you use the insurance or not. A 'copay' is the fixed amount you pay per visit — 'tiền đồng chi trả.' Knowing both helps you compare plans.",
      },
      {
        id: "insurance-enroll-deductible",
        label: "Khoản khấu trừ → 'deductible'",
        note: "A 'deductible' is the amount you pay out of pocket before insurance starts sharing costs — 'khoản khấu trừ.' A lower deductible usually means a higher monthly premium.",
      },
    ],
    followUps: [
      { id: "insurance-enroll-options-fu", question: "How would you ask what health insurance options are available to you?", salienceQuestion: "What {slot} options are open to you?" },
      { id: "insurance-enroll-premium-fu", question: "How would you ask how much the monthly premium is?", salienceQuestion: "How much is the {slot} each month?" },
      { id: "insurance-enroll-deductible-fu", question: "How would you ask about the deductible?", salienceQuestion: "What is the {slot} deductible?" },
      { id: "insurance-enroll-network-fu", question: "How would you ask if your doctor is in the plan's network?", salienceQuestion: "Is your doctor covered by this {slot}?" },
      { id: "insurance-enroll-deadline-fu", question: "How would you ask when the enrollment deadline is?", salienceQuestion: "When does the {slot} sign-up window close?" },
    ],
  },
  {
    id: "topic-insurance-understand-health-plan",
    labelEn: "Understanding Your Health Plan",
    labelVi: "Hiểu kế hoạch bảo hiểm sức khỏe của bạn",
    category: "insurance-customer",
    seedInputs: ["I got my insurance card. How do I use it at the doctor?"],
    detectionPatterns: [
      /\b(?:insurance card|use my insurance|in-network|out-of-network|referral|prior authorization|co-insurance|out of pocket (?:max|maximum))\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "insurance-plan-in-network",
        label: "Bác sĩ trong mạng lưới → 'in-network'",
        note: "Doctors your insurer has agreements with are 'in-network'; others are 'out-of-network' and cost more. Always ask: 'Is this doctor in my plan's network?'",
      },
      {
        id: "insurance-plan-referral",
        label: "Giấy giới thiệu → 'referral'",
        note: "Some plans (HMO) require a 'referral' from your primary care doctor to see a specialist — 'giấy giới thiệu.' Asking 'Do I need a referral to see a specialist?' prevents a surprise bill.",
      },
      {
        id: "insurance-plan-eob",
        label: "Giải thích quyền lợi → 'Explanation of Benefits' (EOB)",
        note: "After a visit you receive an 'Explanation of Benefits' (EOB) — not a bill. It shows what insurance paid and what you owe. Knowing to wait for the real bill before paying prevents double payment.",
      },
    ],
    followUps: [
      { id: "insurance-plan-card-fu", question: "How would you show your insurance card at a clinic?", salienceQuestion: "How do you present your {slot} card?" },
      { id: "insurance-plan-network-fu", question: "How would you ask if a specialist is in your network?", salienceQuestion: "Is this specialist in your {slot}?" },
      { id: "insurance-plan-referral-fu", question: "How would you ask your doctor for a referral?", salienceQuestion: "How do you request a {slot} from your doctor?" },
      { id: "insurance-plan-eob-fu", question: "How would you ask what an EOB document means?", salienceQuestion: "What does this {slot} document say?" },
      { id: "insurance-plan-oop-fu", question: "How would you ask what your out-of-pocket maximum is?", salienceQuestion: "What is the most you will pay under this {slot}?" },
    ],
  },
  {
    id: "topic-insurance-auto-accident",
    labelEn: "Using Auto Insurance After An Accident",
    labelVi: "Sử dụng bảo hiểm xe hơi sau tai nạn",
    category: "insurance-customer",
    seedInputs: ["I just had a minor accident. What do I do now with my insurance?"],
    detectionPatterns: [
      /\b(?:auto insurance|car insurance|file a claim|accident report|fender bender|fault|liability|collision|comprehensive|rental car coverage)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "insurance-auto-khai-bao",
        label: "Khai báo tai nạn → 'file a claim'",
        note: "'Khai báo tai nạn với bảo hiểm' is 'file a claim.' Call your insurer as soon as possible: 'I need to file a claim.' Have your policy number ready.",
      },
      {
        id: "insurance-auto-loi",
        label: "Lỗi của ai → 'at fault'",
        note: "Insurers ask who is 'at fault' — the party responsible for the accident. Saying 'I'm not sure who was at fault' is fine; do not admit fault before the insurer investigates.",
      },
      {
        id: "insurance-auto-deductible-apply",
        label: "Khoản khấu trừ áp dụng sau tai nạn",
        note: "If you file a collision claim, your deductible applies first — you pay that amount, insurance pays the rest. Asking 'Will my deductible apply here?' tells you your out-of-pocket cost.",
      },
    ],
    followUps: [
      { id: "insurance-auto-call-fu", question: "How would you call your insurer to report the accident?", salienceQuestion: "How do you start a {slot} call after an accident?" },
      { id: "insurance-auto-info-fu", question: "What information would you exchange with the other driver?", salienceQuestion: "What details do you share for the {slot} process?" },
      { id: "insurance-auto-repair-fu", question: "How would you ask about getting your car repaired?", salienceQuestion: "How does the {slot} handle the repair?" },
      { id: "insurance-auto-rental-fu", question: "How would you ask if rental car coverage is included?", salienceQuestion: "Does your {slot} cover a rental car?" },
      { id: "insurance-auto-timeline-fu", question: "How would you ask how long the claim process takes?", salienceQuestion: "How long does the {slot} process take?" },
    ],
  },
  {
    id: "topic-insurance-renters-home",
    labelEn: "Getting Renters Or Home Insurance",
    labelVi: "Mua bảo hiểm nhà thuê hoặc bảo hiểm nhà ở",
    category: "insurance-customer",
    seedInputs: ["My landlord says I need renters insurance. How do I get it?"],
    detectionPatterns: [
      /\b(?:renters insurance|homeowners insurance|liability coverage|personal property|replace (?:my )?belongings|coverage amount|home insurance quote)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "insurance-renters-thue-nha",
        label: "Bảo hiểm nhà thuê → 'renters insurance'",
        note: "'Bảo hiểm nhà thuê' is 'renters insurance.' It covers your belongings (laptop, clothes, furniture) and gives you 'liability' if someone is hurt in your home. It is usually affordable — ask: 'How much is a basic renters policy?'",
      },
      {
        id: "insurance-renters-contents",
        label: "Đồ đạc cá nhân → 'personal property'",
        note: "'Đồ đạc' or 'tài sản cá nhân' is 'personal property' in insurance language. Your policy covers it up to a limit — ask: 'What is the personal property limit?' to make sure it covers your things.",
      },
      {
        id: "insurance-renters-quote",
        label: "Báo giá → 'quote'",
        note: "'Báo giá' is a 'quote' — an estimate of your premium. Getting multiple quotes from different insurers takes minutes online and can save money. 'Can I get a quote online?'",
      },
    ],
    followUps: [
      { id: "insurance-renters-get-fu", question: "How would you ask your landlord what kind of renters insurance is required?", salienceQuestion: "What does your landlord require for {slot}?" },
      { id: "insurance-renters-quote-fu", question: "How would you get a price quote for renters insurance?", salienceQuestion: "How do you get a {slot} quote?" },
      { id: "insurance-renters-cover-fu", question: "How would you ask what the policy covers?", salienceQuestion: "What does this {slot} cover?" },
      { id: "insurance-renters-proof-fu", question: "How would you ask for proof of insurance to show your landlord?", salienceQuestion: "How do you get proof of {slot}?" },
      { id: "insurance-renters-cancel-fu", question: "How would you cancel your policy when you move?", salienceQuestion: "How do you end the {slot} when you leave?" },
    ],
  },
  {
    id: "topic-insurance-file-claim",
    labelEn: "Filing An Insurance Claim",
    labelVi: "Nộp yêu cầu bồi thường bảo hiểm",
    category: "insurance-customer",
    seedInputs: ["Something was stolen from my apartment. How do I file a claim?"],
    detectionPatterns: [
      /\b(?:file a claim|insurance claim|claim number|claims department|adjuster|settlement|payout|stolen|damaged property|claim status)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "insurance-claim-yeu-cau",
        label: "Yêu cầu bồi thường → 'file a claim'",
        note: "'Yêu cầu bồi thường bảo hiểm' is 'file a claim.' Start by calling or going online: 'I need to file a claim.' You will receive a claim number to track everything.",
      },
      {
        id: "insurance-claim-adjuster",
        label: "Chuyên viên thẩm định → 'adjuster'",
        note: "An 'adjuster' is the person who evaluates your loss and decides how much the insurer pays. They may call or visit. Saying 'When will the adjuster contact me?' moves things forward.",
      },
      {
        id: "insurance-claim-documentation",
        label: "Giấy tờ chứng minh → 'documentation'",
        note: "Claims go faster with 'documentation' — photos, receipts, a police report if theft is involved. Asking 'What documentation do I need?' at the start saves delays.",
      },
    ],
    followUps: [
      { id: "insurance-claim-start-fu", question: "How would you start a claim by phone or online?", salienceQuestion: "How do you open a {slot}?" },
      { id: "insurance-claim-number-fu", question: "How would you ask for your claim number?", salienceQuestion: "How do you track your {slot}?" },
      { id: "insurance-claim-docs-fu", question: "How would you ask what documents or photos you need to submit?", salienceQuestion: "What do you send in for the {slot}?" },
      { id: "insurance-claim-adjuster-fu", question: "How would you ask when you will hear from the adjuster?", salienceQuestion: "When does someone review your {slot}?" },
      { id: "insurance-claim-status-fu", question: "How would you follow up on the status of your claim?", salienceQuestion: "How do you check the {slot} status?" },
    ],
  },
  {
    id: "topic-insurance-dispute-bill",
    labelEn: "Disputing A Medical Bill Or Insurance Decision",
    labelVi: "Tranh chấp hóa đơn y tế hoặc quyết định bảo hiểm",
    category: "insurance-customer",
    seedInputs: ["I got a big medical bill even though I have insurance. Can I dispute it?"],
    detectionPatterns: [
      /\b(?:dispute (?:a )?(?:medical )?bill|appeal (?:a )?(?:claim )?denial|insurance denial|appeal process|balance billing|surprise bill|itemized bill|billing error)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "insurance-dispute-khang-cao",
        label: "Kháng cáo → 'appeal'",
        note: "If your insurer denies a claim or a procedure, you can 'appeal' — 'kháng cáo.' Saying 'I'd like to appeal this denial' formally requests a review and often succeeds.",
      },
      {
        id: "insurance-dispute-itemized",
        label: "Hóa đơn chi tiết → 'itemized bill'",
        note: "Always ask for an 'itemized bill' — a line-by-line breakdown. 'Hóa đơn chi tiết' may show billing errors. Saying 'Can I get an itemized bill?' is a normal, accepted request.",
      },
      {
        id: "insurance-dispute-surprise",
        label: "Hóa đơn bất ngờ → 'surprise bill' or 'balance billing'",
        note: "'Balance billing' means a provider charges you the gap between their rate and your insurer's rate. In many US states this is illegal for emergency care. Saying 'Is this balance billing?' starts the right conversation.",
      },
    ],
    followUps: [
      { id: "insurance-dispute-appeal-fu", question: "How would you ask how to appeal an insurance denial?", salienceQuestion: "How do you challenge the {slot} decision?" },
      { id: "insurance-dispute-itemized-fu", question: "How would you request an itemized bill from a hospital?", salienceQuestion: "How do you get a detailed {slot}?" },
      { id: "insurance-dispute-error-fu", question: "How would you point out a possible billing error?", salienceQuestion: "How do you flag an error on the {slot}?" },
      { id: "insurance-dispute-advocate-fu", question: "How would you ask for a patient advocate or financial counselor?", salienceQuestion: "Who helps you with a complex {slot} dispute?" },
      { id: "insurance-dispute-payment-plan-fu", question: "How would you ask for a payment plan if you owe a large amount?", salienceQuestion: "Can you set up a {slot} payment plan?" },
    ],
  },
];
