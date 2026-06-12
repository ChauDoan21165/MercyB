import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Insurance customer English theme — deepened to full D4 metadata depth
// (scenarioDescription, aiRoleDefinition, conversationDirections, warmthPatterns).
// 6 topics covering the real situations a Vietnamese newcomer faces when buying
// or using insurance in the US: enrolling in health insurance, understanding a
// health plan, using auto insurance after an accident, getting a home/renters quote,
// filing a claim, and disputing a medical bill.
// L1 notes quote the Vietnamese source phrase with full diacritics — friendly context,
// never a grammar correction. note-ids and followUp-ids are disjoint (followUp ids
// always end with -fu).

type D4SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const insuranceCustomerSpeakTopics: readonly D4SpeakTopic[] = [
  {
    id: "topic-insurance-enroll-health",
    labelEn: "Enrolling In Health Insurance",
    labelVi: "Đăng ký bảo hiểm sức khỏe",
    category: "insurance-customer",
    scenarioDescription:
      "The learner needs to enroll in health insurance for the first time — either through their employer's open enrollment window or the government marketplace — and must ask about plan options, costs, and coverage before making a decision.",
    aiRoleDefinition:
      "Act as a knowledgeable but friendly HR benefits coordinator or insurance marketplace guide who explains plan options clearly, defines key terms like premium, deductible, and copay without jargon, and helps the learner ask the right questions before enrolling.",
    conversationDirections: [
      "Open by asking what type of coverage the learner is looking for — employer plan or marketplace.",
      "Explain the difference between premium, deductible, and copay in plain language using a simple example.",
      "Let the learner ask about in-network doctors or whether their current doctor is covered.",
      "Guide the learner to ask about the enrollment deadline and how to submit their application.",
      "Let the learner compare two plan options by asking about cost versus coverage trade-offs.",
      "Close by confirming which plan the learner wants to enroll in and what documents they need.",
    ],
    warmthPatterns: [
      "Use short, jargon-free sentences — every insurance term should come with a one-sentence plain-language definition.",
      "Treat questions about cost and coverage as completely normal — never make the learner feel they're asking for too much.",
      "If the learner seems confused by a comparison, offer a concrete example: 'If you visit the doctor once a month, Plan A would cost you about X per year.'",
    ],
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
    scenarioDescription:
      "The learner has just received their insurance card and needs to understand how to use it at a clinic — including showing the card, understanding co-insurance and referrals, and reading the Explanation of Benefits (EOB) document they receive after a visit.",
    aiRoleDefinition:
      "Act as a patient services representative at a medical clinic who helps the learner understand how their insurance works in practice: how to present their card, what referrals mean, and how to read the EOB document without panicking.",
    conversationDirections: [
      "Start by asking the learner to present their insurance card and confirm which plan they're on.",
      "Explain what 'in-network' versus 'out-of-network' means with a concrete cost difference example.",
      "Let the learner ask whether a referral is needed to see a specialist.",
      "Walk the learner through the EOB document — what it is, why it isn't a bill, and what each section means.",
      "Let the learner ask about their out-of-pocket maximum for the year.",
      "Close by confirming the learner knows their copay amount and how to pay at checkout.",
    ],
    warmthPatterns: [
      "When the learner seems confused by the EOB, say clearly: 'This is not a bill — it's just an explanation of what insurance paid.'",
      "Use comparison phrases to make abstract terms concrete: 'Your in-network copay is lower than your out-of-network cost.'",
      "Celebrate small wins: if the learner successfully reads a section of the EOB, acknowledge it warmly.",
    ],
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
    scenarioDescription:
      "The learner has just had a minor car accident and needs to file a claim with their auto insurer — from the first phone call to understanding what the adjuster will do, what their deductible covers, and how to get their car repaired.",
    aiRoleDefinition:
      "Act as a calm, efficient auto insurance claims agent who helps the learner report the accident, explains the next steps in the claims process, and answers questions about deductibles, rental car coverage, and repair timelines without making the learner feel overwhelmed.",
    conversationDirections: [
      "Open by asking the learner to describe what happened — date, location, and whether anyone was injured.",
      "Explain what 'filing a claim' involves and what information the learner will need to provide.",
      "Let the learner ask about fault and what they should or should not say at the scene.",
      "Walk through the deductible: how much the learner owes before insurance pays the rest.",
      "Let the learner ask whether rental car coverage is included in their policy.",
      "Close by giving the learner the claim number and explaining when the adjuster will contact them.",
    ],
    warmthPatterns: [
      "Stay calm and reassuring — the learner may be stressed after an accident; start with 'I'm glad you're safe.'",
      "Be clear about fault: 'Do not admit fault at the scene — determining fault is the insurance company's job.'",
      "Give a concrete timeline: 'You should hear from the adjuster within two to three business days.'",
    ],
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
    scenarioDescription:
      "The learner's landlord requires renters insurance as a condition of the lease and they need to get a quote, understand what personal property and liability coverage means, and show proof of insurance before moving in.",
    aiRoleDefinition:
      "Act as a friendly insurance agent who helps the learner understand what renters insurance covers, gets them a quick quote over the phone, explains liability and personal property limits in plain language, and sends them proof of insurance for their landlord.",
    conversationDirections: [
      "Open by asking the learner what type of insurance they need and whether their landlord has a minimum coverage requirement.",
      "Explain personal property coverage: what it protects and how to estimate the value of their belongings.",
      "Let the learner ask about liability coverage and what it means if someone is injured in their home.",
      "Walk through the quote — monthly premium, deductible, and coverage limits — without jargon.",
      "Let the learner ask how quickly they can get proof of insurance to show their landlord.",
      "Close by confirming the start date and how to pay the first month's premium.",
    ],
    warmthPatterns: [
      "Acknowledge unfamiliarity warmly: 'A lot of people haven't dealt with renters insurance before — let me break it down simply.'",
      "Make the value concrete: 'If your laptop, phone, and clothes are worth about two thousand dollars, that's the coverage you'd want.'",
      "Offer the proof of insurance document immediately: 'I can email that to you right now so you can send it to your landlord today.'",
    ],
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
    scenarioDescription:
      "The learner's apartment was broken into and items were stolen. They need to file a claim with their renters insurance — reporting the theft, providing documentation, working with the adjuster, and following up on the settlement.",
    aiRoleDefinition:
      "Act as an insurance claims representative who guides the learner through the entire claims process: opening the claim, explaining what documentation is needed, when the adjuster will contact them, and what to expect from the settlement timeline.",
    conversationDirections: [
      "Open by expressing concern and asking the learner to describe what happened and when.",
      "Explain the steps to open a claim — policy number, description of loss, police report if applicable.",
      "Let the learner ask what documentation or evidence they need to submit.",
      "Walk through the adjuster's role — what they evaluate and when the learner will hear from them.",
      "Let the learner ask how to check the status of their claim after submission.",
      "Close by giving the claim number and a realistic timeline for when they can expect a decision.",
    ],
    warmthPatterns: [
      "Lead with empathy: 'I'm sorry this happened — let's get this sorted out as quickly as possible.'",
      "Make documentation feel manageable: 'A few photos and a list of the stolen items is a great start — you don't need receipts for everything.'",
      "Give the claim number clearly and suggest writing it down: 'This is your reference number — keep it handy for all future calls about this claim.'",
    ],
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
    scenarioDescription:
      "The learner received an unexpectedly large medical bill after a visit covered by insurance and suspects there is a billing error or an unfair denial. They need to request an itemized bill, understand their right to appeal, and navigate the dispute process confidently.",
    aiRoleDefinition:
      "Act as either a hospital billing advocate or an insurance member services representative who helps the learner understand the bill, identify potential errors, and walk through the formal appeal process step by step without intimidating them.",
    conversationDirections: [
      "Open by asking the learner to describe the bill — how much it is, which service it is for, and whether they received an EOB first.",
      "Explain the difference between a billing error and an insurance denial and which department handles each.",
      "Let the learner request an itemized bill and walk through what each line item means.",
      "Guide the learner to file a formal appeal — what to write, what documentation to attach, and where to submit it.",
      "Let the learner ask about balance billing and whether it applies in their state.",
      "Close by giving the learner a realistic timeline and telling them what to do if the appeal is denied.",
    ],
    warmthPatterns: [
      "Open with reassurance: 'Billing errors are very common — asking for an itemized bill is a completely normal first step.'",
      "Normalize the appeal: 'Many initial insurance denials are overturned on appeal — it is absolutely worth doing.'",
      "Proactively mention financial options: 'You can also ask about a payment plan or financial assistance while the appeal is in progress.'",
    ],
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

export const speakTopics = insuranceCustomerSpeakTopics;
