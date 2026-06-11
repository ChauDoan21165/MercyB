import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Veterinary / pet-care theme. Everyday English for a Vietnamese learner
// taking their pet to the vet — booking, symptoms, vaccinations, diagnosis,
// medication, emergency, billing. Copy is warm, low-shame, and focuses on
// communication, never medical advice. l1InterferenceNotes surface genuine
// Vietnamese→English interference as friendly context.
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-vet-petcare-booking",
    labelEn: "Booking A Vet Appointment",
    labelVi: "Đặt lịch khám thú y cho thú cưng",
    category: "vet-petcare",
    seedInputs: [
      "I'd like to make an appointment for my dog.",
      "Hi, can I schedule a check-up for my cat this week?",
      "My pet needs a routine wellness visit — do you have availability?",
    ],
    detectionPatterns: [
      /\b(?:book a vet|make an appointment for my (?:dog|cat|pet|rabbit)|schedule a (?:check-?up|visit|appointment) for my|wellness visit|vet appointment)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vet-booking-thu-cung",
        label: "\"Thú cưng\" said word for word",
        note: "'Thú cưng' means 'beloved animal,' but saying 'my beloved animal' sounds odd in English. The natural word is just 'my pet' or the animal's name — 'I'd like to bring Luna in.'",
      },
      {
        id: "vet-booking-kham-tong-quat",
        label: "\"Khám tổng quát\" → wellness exam",
        note: "Vietnamese 'khám tổng quát' (general examination) maps to 'wellness exam' or 'check-up' at the vet. 'I'd like a wellness exam for my cat' is the warmest, most natural phrasing.",
      },
      {
        id: "vet-booking-mang-den",
        label: "\"Mang đến\" → bring in",
        note: "'Mang thú cưng đến' becomes 'bring my pet to' in direct translation. Vets say 'bring him in' or 'bring her in' — using the pet's gender or name sounds natural and friendly.",
      },
      {
        id: "vet-booking-first-available",
        label: "\"First available\" saves time",
        note: "Khi bạn linh hoạt về ngày giờ, nói 'I'll take the first available appointment' hoặc 'whenever you have an opening' báo hiệu rõ ràng điều đó và thường giúp bạn được xếp lịch nhanh hơn.",
      },
    ],
    followUps: [
      { id: "vet-booking-fu-reason", question: "What would you tell them the visit is for?", salienceQuestion: "How would you explain the reason for the {slot}?" },
      { id: "vet-booking-fu-name", question: "How would you give your pet's name and type of animal?", salienceQuestion: "How would you introduce your pet for the {slot}?" },
      { id: "vet-booking-fu-time", question: "What day or time would you ask for?", salienceQuestion: "What time would you request for the {slot}?" },
      { id: "vet-booking-fu-confirm", question: "How would you repeat the time back to confirm?", salienceQuestion: "How would you confirm the details of the {slot}?" },
      { id: "vet-booking-fu-newpatient", question: "How would you mention this is your first visit at this clinic?", salienceQuestion: "How would you note you are new for the {slot}?" },
      { id: "vet-booking-fu-insurance", question: "Would you ask whether they accept your pet insurance?", salienceQuestion: "How would you ask about coverage for the {slot}?" },
    ],
  },
  {
    id: "topic-vet-petcare-symptoms",
    labelEn: "Describing Your Pet's Symptoms",
    labelVi: "Mô tả triệu chứng của thú cưng",
    category: "vet-petcare",
    seedInputs: [
      "My dog hasn't been eating for two days.",
      "She keeps scratching her ear and shaking her head.",
      "He seems really tired and is limping on his front leg.",
    ],
    detectionPatterns: [
      /\b(?:hasn't been eating|not eating|limping|scratching|throwing up|vomiting|lethargic|runny nose|watery eyes|not drinking|describe.*symptoms?|something wrong with my pet)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vet-symptoms-bi",
        label: "\"Bị\" particle in symptom descriptions",
        note: "In Vietnamese, 'con chó bị ốm' (the dog got sick) uses 'bị' to mark an undesirable state. English drops that particle: 'my dog is sick' or 'my dog isn't feeling well.' Short and direct is natural.",
      },
      {
        id: "vet-symptoms-subject",
        label: "Animal as subject, not object",
        note: "Vietnamese often uses 'con mèo' (the cat) as a topic, not always the grammatical subject. In English, the pet should be the subject: 'she has been scratching a lot' rather than 'the cat, scratching a lot.'",
      },
      {
        id: "vet-symptoms-duration",
        label: "Saying how long symptoms have lasted",
        note: "'For' + time period marks duration in English: 'she hasn't eaten for three days.' Vietnamese 'được ba ngày' maps to 'for three days' — putting 'for' before the number is the key.",
      },
      {
        id: "vet-symptoms-seem",
        label: "\"Có vẻ\" → seems / appears",
        note: "'Có vẻ mệt' literally means 'seems tired.' In English that maps directly: 'he seems really tired' or 'she looks like she's in pain.' Both are warm, natural ways to describe what you observe.",
      },
    ],
    followUps: [
      { id: "vet-symptoms-fu-when", question: "When did you first notice something was wrong?", salienceQuestion: "How would you say when the {slot} started?" },
      { id: "vet-symptoms-fu-worse", question: "Has it been getting better or worse?", salienceQuestion: "How would you describe the change in the {slot}?" },
      { id: "vet-symptoms-fu-other", question: "Are there any other signs, like changes in behavior or energy?", salienceQuestion: "What else would you mention about the {slot}?" },
      { id: "vet-symptoms-fu-eating", question: "How would you describe your pet's eating and drinking?", salienceQuestion: "How would you explain eating habits related to the {slot}?" },
      { id: "vet-symptoms-fu-bowel", question: "Would you mention any changes in bathroom habits?", salienceQuestion: "How would you bring up any physical changes for the {slot}?" },
      { id: "vet-symptoms-fu-history", question: "Has your pet had this problem before?", salienceQuestion: "How would you give background for the {slot}?" },
    ],
  },
  {
    id: "topic-vet-petcare-vaccination",
    labelEn: "Vaccinations And Preventive Care",
    labelVi: "Tiêm phòng và chăm sóc sức khỏe định kỳ",
    category: "vet-petcare",
    seedInputs: [
      "My cat is due for her annual shots.",
      "Can you tell me which vaccines my dog needs this year?",
      "I'd like to get my puppy started on the vaccination schedule.",
    ],
    detectionPatterns: [
      /\b(?:vaccination|vaccines?|annual shots?|due for (?:her|his|their) (?:shots?|vaccines?)|booster|flea (?:treatment|prevention)|heartworm|rabies shot|preventive care)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vet-vax-tiem-phong",
        label: "\"Tiêm phòng\" → get vaccinated / get shots",
        note: "'Tiêm phòng' literally means 'inject to prevent,' which maps to 'vaccination' or 'getting her shots.' Both 'shots' and 'vaccines' are natural in conversation — the vet will use both.",
      },
      {
        id: "vet-vax-due",
        label: "\"Due for\" marks overdue care",
        note: "'Due for' là cụm từ mà bác sĩ thú y hay dùng: 'your cat is due for her rabies booster.' Người học người Việt đôi khi nói 'must get the vaccine now,' nhưng 'she's due for her shots' tự nhiên và nhẹ nhàng hơn.",
      },
      {
        id: "vet-vax-schedule",
        label: "Vaccine schedule vs vaccination card",
        note: "'Vaccination schedule' (lịch tiêm) is the plan of what shots and when. 'Vaccination record' or 'shot record' is the document. In conversation you might say: 'can I get a copy of her vaccination record?'",
      },
      {
        id: "vet-vax-core-noncore",
        label: "Core vs non-core vaccines",
        note: "Bác sĩ thú y phân biệt 'core vaccines' (bắt buộc cho mọi thú cưng, như rabies) và 'non-core' (dựa trên lối sống, như Lyme). Biết cặp từ này giúp bạn hỏi: 'which non-core vaccines do you recommend for a dog that goes to the dog park?'",
      },
    ],
    followUps: [
      { id: "vet-vax-fu-which", question: "How would you ask which vaccines your pet needs?", salienceQuestion: "How would you find out which vaccines are needed for the {slot}?" },
      { id: "vet-vax-fu-record", question: "How would you ask for a copy of the vaccine record?", salienceQuestion: "How would you request documentation after the {slot}?" },
      { id: "vet-vax-fu-reaction", question: "What would you say if you're worried about a reaction?", salienceQuestion: "How would you ask about side effects from the {slot}?" },
      { id: "vet-vax-fu-cost", question: "How would you ask about the cost of the vaccines?", salienceQuestion: "How would you ask about pricing for the {slot}?" },
      { id: "vet-vax-fu-next", question: "How would you ask when the next round of shots is due?", salienceQuestion: "How would you schedule a follow-up for the {slot}?" },
      { id: "vet-vax-fu-flea", question: "How would you ask about flea or heartworm prevention?", salienceQuestion: "How would you inquire about preventive treatments for the {slot}?" },
    ],
  },
  {
    id: "topic-vet-petcare-diagnosis",
    labelEn: "Understanding The Vet's Diagnosis",
    labelVi: "Hiểu kết quả chẩn đoán của bác sĩ thú y",
    category: "vet-petcare",
    seedInputs: [
      "Can you explain what that means for my dog?",
      "I'm not sure I understood — could you go over the diagnosis again?",
      "What does that test result mean, and what are our options?",
    ],
    detectionPatterns: [
      /\b(?:explain.*diagnosis|what does that mean|go over.*results?|what are (?:our|the) options|understand(?:ing)? the vet|test results?|what.*wrong with my|prognosis)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vet-diag-chan-doan",
        label: "\"Chẩn đoán\" → diagnosis, not \"result\"",
        note: "'Chẩn đoán' (diagnosis) can feel interchangeable with 'kết quả' (result) in Vietnamese. In English they are distinct: the diagnosis is what the vet thinks is wrong; the test result is the data. 'What is the diagnosis?' vs 'What did the blood test show?'",
      },
      {
        id: "vet-diag-clarify",
        label: "Asking for clarification politely",
        note: "Người học người Việt đôi khi im lặng khi không hiểu để tránh mất lịch sự. Nhưng bác sĩ thú y mong bạn đặt câu hỏi. 'Could you say that again more slowly?' và 'Could you write that down?' đều hoàn toàn bình thường.",
      },
      {
        id: "vet-diag-options",
        label: "\"What are our options?\" opens the door",
        note: "'What are our options?' là cụm từ quan trọng giúp mời bác sĩ thú y giải thích các lựa chọn điều trị thay vì chỉ nói cho bạn biết phải làm gì. Nghe có vẻ hợp tác và có hiểu biết, không phải áp lực.",
      },
      {
        id: "vet-diag-prognosis",
        label: "Prognosis vs diagnosis",
        note: "'Prognosis' (tiên lượng) is how the vet expects the pet to do going forward. Diagnosis is what it is now; prognosis is what comes next. 'What's the prognosis if we treat it?' is a natural follow-up question.",
      },
    ],
    followUps: [
      { id: "vet-diag-fu-repeat", question: "How would you ask the vet to explain again more simply?", salienceQuestion: "How would you request a clearer explanation of the {slot}?" },
      { id: "vet-diag-fu-serious", question: "How would you ask how serious the condition is?", salienceQuestion: "How would you gauge the severity of the {slot}?" },
      { id: "vet-diag-fu-treatment", question: "How would you ask what treatment options are available?", salienceQuestion: "How would you find out about treatments for the {slot}?" },
      { id: "vet-diag-fu-notreat", question: "How would you ask what happens if you wait or don't treat?", salienceQuestion: "How would you ask about not acting on the {slot}?" },
      { id: "vet-diag-fu-writedown", question: "How would you ask the vet to write the diagnosis down?", salienceQuestion: "How would you request written information about the {slot}?" },
      { id: "vet-diag-fu-secondopinion", question: "How would you politely ask about getting a second opinion?", salienceQuestion: "How would you raise the idea of another view on the {slot}?" },
    ],
  },
  {
    id: "topic-vet-petcare-medication",
    labelEn: "Getting Your Pet's Medication",
    labelVi: "Nhận thuốc và hướng dẫn dùng thuốc cho thú cưng",
    category: "vet-petcare",
    seedInputs: [
      "How do I give this medicine to my cat?",
      "Can I get a refill of my dog's prescription?",
      "He keeps spitting out the pill — is there another form?",
    ],
    detectionPatterns: [
      /\b(?:give.*medicine|refill.*prescription|pet.*medication|pill|chewable|liquid medicine|how to give|spit out the pill|dosage for my|how many times a day)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vet-med-dosage",
        label: "Asking about dosage clearly",
        note: "'Dosage' (liều lượng) sounds technical, but the everyday question is simple: 'How much do I give, and how often?' — 'How many times a day?' and 'How many days?' are the two key follow-up questions.",
      },
      {
        id: "vet-med-refill",
        label: "\"Refill\" for repeat prescriptions",
        note: "'I need a refill' means you want the same medicine prescribed again. Vietnamese 'lấy thêm thuốc' maps to this. You might say: 'Can I get a refill on the antibiotic?' or 'My dog is out of his heart medication — can I get more?'",
      },
      {
        id: "vet-med-forms",
        label: "Pill vs liquid vs chewable",
        note: "Nếu thú cưng không chịu nuốt thuốc viên, hoàn toàn bình thường khi hỏi: 'Is there a liquid form?' hoặc 'Do you have a chewable version?' Bác sĩ thú y gặp thú khó tính mỗi ngày và sẽ đề xuất dạng khác nếu bạn hỏi.",
      },
      {
        id: "vet-med-finishing-course",
        label: "Finishing the full course",
        note: "Vets will often say 'finish all the medication even if he seems better.' In Vietnamese 'uống hết thuốc' maps directly to this. The key phrase to understand is 'finish the full course' — stopping early can make antibiotics less effective.",
      },
    ],
    followUps: [
      { id: "vet-med-fu-howoften", question: "How would you ask how often to give the medicine?", salienceQuestion: "How would you clarify the timing for the {slot}?" },
      { id: "vet-med-fu-food", question: "How would you ask if it should be given with food?", salienceQuestion: "How would you ask about food instructions for the {slot}?" },
      { id: "vet-med-fu-sideeffects", question: "How would you ask what side effects to watch for?", salienceQuestion: "How would you ask about reactions during the {slot}?" },
      { id: "vet-med-fu-wonteat", question: "How would you explain that your pet refuses to eat the pill?", salienceQuestion: "How would you describe difficulty giving the {slot}?" },
      { id: "vet-med-fu-storage", question: "How would you ask how to store the medicine?", salienceQuestion: "How would you ask about storage for the {slot}?" },
      { id: "vet-med-fu-refill", question: "How would you call to ask for a refill before you run out?", salienceQuestion: "How would you request more of the {slot}?" },
    ],
  },
  {
    id: "topic-vet-petcare-emergency",
    labelEn: "Emergency Vet Visit",
    labelVi: "Đưa thú cưng đi cấp cứu",
    category: "vet-petcare",
    seedInputs: [
      "My dog just ate something he shouldn't have.",
      "My cat is breathing really fast and won't move — it's an emergency.",
      "She got hit by a car — where is the nearest emergency vet?",
    ],
    detectionPatterns: [
      /\b(?:emergency vet|ate something|poison(?:ed)?|can't breathe|breathing (?:fast|hard|labored)|hit by a (?:car|vehicle)|won't move|collapsed|emergency animal|urgent care.*pet|after-hours vet)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vet-emergency-cap-cuu",
        label: "\"Cấp cứu\" → emergency, not \"first aid\"",
        note: "'Cấp cứu' means urgent medical help. In English the word is 'emergency' — 'I have a pet emergency' or 'this is an emergency' gets you immediate attention at the front desk. Don't soften it; saying 'I have a small problem' loses urgency.",
      },
      {
        id: "vet-emergency-swallowed",
        label: "\"An phải\" → swallowed / ingested / ate",
        note: "'Con chó ăn phải thuốc' (the dog ingested medicine) maps to 'my dog swallowed medication' or 'my dog ate something he shouldn't have.' 'Ingested' is the vet's word; 'swallowed' and 'ate' are just as clear.",
      },
      {
        id: "vet-emergency-symptoms-urgent",
        label: "Describing urgent symptoms fast",
        note: "Trong tình huống cấp cứu thú y, ngắn gọn và trực tiếp là tốt nhất: 'She's not breathing normally.' 'He can't stand up.' 'She ate rat poison about an hour ago.' Bác sĩ cần sự kiện nhanh — câu ngắn rõ ràng tốt hơn giải thích dài.",
      },
      {
        id: "vet-emergency-after-hours",
        label: "\"After-hours\" emergency clinics",
        note: "Hầu hết phòng khám thú y đóng cửa buổi tối và cuối tuần. 'Emergency animal hospital' hoặc 'after-hours vet clinic' là cụm từ để tìm khi bác sĩ thú y thường của bạn đóng cửa. Câu hỏi cần hỏi: 'Is there a 24-hour emergency animal hospital nearby?'",
      },
    ],
    followUps: [
      { id: "vet-emergency-fu-describe", question: "How would you quickly describe what happened?", salienceQuestion: "How would you explain the situation during the {slot}?" },
      { id: "vet-emergency-fu-when", question: "How would you say when the emergency started?", salienceQuestion: "How would you give the timeline for the {slot}?" },
      { id: "vet-emergency-fu-ate", question: "How would you describe what your pet swallowed or was exposed to?", salienceQuestion: "How would you report what caused the {slot}?" },
      { id: "vet-emergency-fu-directions", question: "How would you ask for the address of the emergency clinic?", salienceQuestion: "How would you get directions for the {slot}?" },
      { id: "vet-emergency-fu-phone", question: "How would you call ahead to say you're on your way?", salienceQuestion: "How would you alert the clinic about the {slot}?" },
      { id: "vet-emergency-fu-cost", question: "How would you ask about the cost when you arrive?", salienceQuestion: "How would you address payment concerns during the {slot}?" },
    ],
  },
  {
    id: "topic-vet-petcare-billing",
    labelEn: "Paying The Vet Bill",
    labelVi: "Thanh toán hóa đơn thú y",
    category: "vet-petcare",
    seedInputs: [
      "Can you explain what's on this bill?",
      "Do you offer a payment plan for a large bill?",
      "Does my pet insurance cover any of this?",
    ],
    detectionPatterns: [
      /\b(?:vet bill|payment plan|pet insurance.*cover|what(?:'s| is) on (?:this|the) bill|itemized.*bill|charge for|cost of the visit|invoice|how much (?:do|will) I owe)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "vet-billing-hoa-don",
        label: "\"Hóa đơn\" → bill or invoice",
        note: "'Hóa đơn' maps to 'bill' in everyday speech and 'invoice' in more formal settings. At the vet you'll hear 'your bill' most often. 'Can I see an itemized bill?' asks them to list each charge separately.",
      },
      {
        id: "vet-billing-payment-plan",
        label: "Payment plans are normal to ask about",
        note: "Hóa đơn thú y có thể cao và bất ngờ. Hoàn toàn bình thường khi hỏi: 'Do you offer a payment plan?' hoặc 'Can I pay in installments?' Nhiều phòng khám hợp tác với CareCredit hoặc có chương trình trả góp riêng.",
      },
      {
        id: "vet-billing-insurance-claim",
        label: "Pet insurance vs health insurance",
        note: "Bảo hiểm thú cưng tách biệt với bảo hiểm sức khỏe con người. Câu hỏi chính khi gặp bác sĩ: 'Does my pet insurance cover this?' Thường bạn thanh toán trước rồi nộp claim lên bảo hiểm để được hoàn tiền.",
      },
      {
        id: "vet-billing-estimate",
        label: "Asking for an estimate before treatment",
        note: "Bạn luôn có thể hỏi chi phí trước khi đồng ý điều trị: 'Can you give me an estimate before we proceed?' Điều này hoàn toàn bình thường và không mất lịch sự — nó giúp bạn lên kế hoạch và quyết định có đầy đủ thông tin.",
      },
    ],
    followUps: [
      { id: "vet-billing-fu-explain", question: "How would you ask the receptionist to go over each charge?", salienceQuestion: "How would you get an explanation of the {slot}?" },
      { id: "vet-billing-fu-plan", question: "How would you ask about paying in installments?", salienceQuestion: "How would you request a flexible payment option for the {slot}?" },
      { id: "vet-billing-fu-insurance", question: "How would you ask whether your pet insurance applies?", salienceQuestion: "How would you bring up coverage for the {slot}?" },
      { id: "vet-billing-fu-estimate", question: "How would you ask for a cost estimate before agreeing to a procedure?", salienceQuestion: "How would you get a price upfront for the {slot}?" },
      { id: "vet-billing-fu-receipt", question: "How would you ask for a receipt or itemized invoice?", salienceQuestion: "How would you ask for documentation of the {slot}?" },
      { id: "vet-billing-fu-discount", question: "How would you ask if there are any discounts for low-income owners or rescue pets?", salienceQuestion: "How would you inquire about financial assistance for the {slot}?" },
    ],
  },
];
