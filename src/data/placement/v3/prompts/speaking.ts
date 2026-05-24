import type { PlacementPrompt } from "./index.ts";

export const SPEAKING_PLACEMENT_PROMPTS = [
  {
    id: "a1-s-daily-routine",
    modality: "speaking",
    targetLevel: "A1",
    acceptableLevels: ["A1", "A2"],
    promptText:
      "Tell Mercy about your morning. Say 4 simple sentences. What time do you wake up? What do you eat? Where do you go?",
    promptTextVi:
      "Nói với Mercy về buổi sáng của bạn. Nói 4 câu đơn giản. Bạn thức dậy lúc mấy giờ? Bạn ăn gì? Bạn đi đâu?",
    expectedDurationSec: 45,
    minResponseLength: 20,
    rubricFocus: ["simple_present", "routine_vocab", "pronunciation_clarity", "basic_fluency"],
    l1InterferenceTriggers: [
      "copula-be-omission",
      "final-consonant-deletion",
      "subject-verb-agreement",
    ],
  },
  {
    id: "a1-s-favorite-food",
    modality: "speaking",
    targetLevel: "A1",
    acceptableLevels: ["A1", "A2"],
    promptText:
      "Talk about one food you like, such as pho, banh mi, or fruit. Say what it is, when you eat it, and why you like it.",
    promptTextVi:
      "Nói về một món bạn thích, ví dụ phở, bánh mì, hoặc trái cây. Nói đó là món gì, khi nào bạn ăn, và tại sao bạn thích.",
    expectedDurationSec: 45,
    minResponseLength: 20,
    rubricFocus: ["likes_dislikes", "food_vocab", "basic_reasons", "sentence_completion"],
    l1InterferenceTriggers: [
      "missing-articles",
      "tone-stress-transfer",
      "missing-pronouns",
    ],
  },
  {
    id: "a2-s-weekend-plan",
    modality: "speaking",
    targetLevel: "A2",
    acceptableLevels: ["A1", "A2", "B1"],
    promptText:
      "You are making weekend plans with an English-speaking friend. Say where you want to go, what you want to do, and what time to meet.",
    promptTextVi:
      "Bạn đang lên kế hoạch cuối tuần với một người bạn nói tiếng Anh. Hãy nói bạn muốn đi đâu, muốn làm gì, và gặp lúc mấy giờ.",
    expectedDurationSec: 60,
    minResponseLength: 35,
    rubricFocus: ["future_with_going_to", "suggestions", "time_place", "interactional_language"],
    l1InterferenceTriggers: [
      "verb-form-after-to",
      "preposition-transfer",
      "question-word-order-transfer",
    ],
  },
  {
    id: "a2-s-last-trip",
    modality: "speaking",
    targetLevel: "A2",
    acceptableLevels: ["A1", "A2", "B1"],
    promptText:
      "Tell Mercy about a short trip you took in Vietnam. Where did you go, who went with you, and what did you do there?",
    promptTextVi:
      "Kể cho Mercy về một chuyến đi ngắn ở Việt Nam. Bạn đã đi đâu, đi với ai, và làm gì ở đó?",
    expectedDurationSec: 75,
    minResponseLength: 40,
    rubricFocus: ["past_simple", "narrative_sequence", "travel_vocab", "pronunciation_of_ed"],
    l1InterferenceTriggers: [
      "past-tense-omission",
      "final-consonant-deletion",
      "run-on-sentences",
    ],
  },
  {
    id: "b1-s-cafe-problem",
    modality: "speaking",
    targetLevel: "B1",
    acceptableLevels: ["A2", "B1", "B2"],
    promptText:
      "You ordered iced coffee but received hot coffee. Politely explain the problem to the cafe staff and ask for a replacement.",
    promptTextVi:
      "Bạn gọi cà phê đá nhưng nhận cà phê nóng. Hãy lịch sự giải thích vấn đề với nhân viên quán và yêu cầu đổi ly khác.",
    context: "Role-play: learner speaks as a customer in a Vietnamese cafe serving foreign visitors.",
    expectedDurationSec: 90,
    minResponseLength: 45,
    rubricFocus: ["polite_complaint", "past_context", "request_language", "repair_strategies"],
    l1InterferenceTriggers: [
      "register-flattening",
      "article-omission",
      "preposition-transfer",
    ],
  },
  {
    id: "b1-s-study-advice",
    modality: "speaking",
    targetLevel: "B1",
    acceptableLevels: ["A2", "B1", "B2"],
    promptText:
      "A younger student says, 'I understand grammar, but I cannot speak English.' Give them three practical pieces of advice.",
    promptTextVi:
      "Một học sinh nhỏ hơn nói: 'Em hiểu ngữ pháp, nhưng không nói được tiếng Anh.' Hãy cho bạn ấy ba lời khuyên thực tế.",
    expectedDurationSec: 90,
    minResponseLength: 50,
    rubricFocus: ["advice_modals", "organization", "learning_vocab", "examples"],
    l1InterferenceTriggers: [
      "modal-verb-inflection",
      "connector-overuse",
      "direct-translation",
    ],
  },
  {
    id: "b2-s-job-interview-strength",
    modality: "speaking",
    targetLevel: "B2",
    acceptableLevels: ["B1", "B2", "C1"],
    promptText:
      "In a job interview, answer this question: 'Tell me about a strength you developed while studying English, and how it would help our team.'",
    promptTextVi:
      "Trong phỏng vấn xin việc, hãy trả lời câu hỏi: 'Hãy kể về một điểm mạnh bạn phát triển khi học tiếng Anh, và nó sẽ giúp đội ngũ của chúng tôi như thế nào.'",
    expectedDurationSec: 120,
    minResponseLength: 70,
    rubricFocus: ["professional_register", "specific_example", "cause_effect", "fluency_under_pressure"],
    l1InterferenceTriggers: [
      "register-flattening",
      "collocation-transfer",
      "tense-aspect-transfer",
    ],
  },
  {
    id: "b2-s-city-transport-opinion",
    modality: "speaking",
    targetLevel: "B2",
    acceptableLevels: ["B1", "B2", "C1"],
    promptText:
      "Some people in big Vietnamese cities prefer motorbikes, while others want better buses and metro lines. Give your opinion and support it with examples.",
    promptTextVi:
      "Một số người ở các thành phố lớn của Việt Nam thích xe máy, trong khi người khác muốn xe buýt và metro tốt hơn. Hãy nêu ý kiến và đưa ví dụ.",
    expectedDurationSec: 120,
    minResponseLength: 75,
    rubricFocus: ["opinion_development", "contrast", "urban_vocab", "cohesive_devices"],
    l1InterferenceTriggers: [
      "topic-comment-transfer",
      "connector-overuse",
      "missing-plurals",
    ],
  },
  {
    id: "c1-s-parent-expectations",
    modality: "speaking",
    targetLevel: "C1",
    acceptableLevels: ["B2", "C1", "C2"],
    promptText:
      "Discuss how family expectations can both support and pressure Vietnamese learners of English. Give a nuanced answer, not only one side.",
    promptTextVi:
      "Hãy thảo luận việc kỳ vọng của gia đình vừa có thể hỗ trợ vừa có thể tạo áp lực cho người Việt học tiếng Anh. Trả lời có sắc thái, không chỉ một chiều.",
    expectedDurationSec: 150,
    minResponseLength: 95,
    rubricFocus: ["nuanced_argument", "concession", "abstract_vocab", "spoken_cohesion"],
    l1InterferenceTriggers: [
      "calque-from-vietnamese",
      "register-flattening",
      "relative-clause-transfer",
    ],
  },
  {
    id: "c1-s-feedback-disagreement",
    modality: "speaking",
    targetLevel: "C1",
    acceptableLevels: ["B2", "C1", "C2"],
    promptText:
      "Mercy says your essay sounds too direct for academic English. You partly disagree. Explain your view politely and ask for more specific feedback.",
    promptTextVi:
      "Mercy nói bài luận của bạn nghe quá trực tiếp trong tiếng Anh học thuật. Bạn không hoàn toàn đồng ý. Hãy giải thích quan điểm lịch sự và hỏi phản hồi cụ thể hơn.",
    context: "Role-play: learner must manage disagreement without sounding rude.",
    expectedDurationSec: 150,
    minResponseLength: 90,
    rubricFocus: ["polite_disagreement", "metalinguistic_awareness", "hedging", "repair_questions"],
    l1InterferenceTriggers: [
      "register-flattening",
      "question-word-order-transfer",
      "word-family-confusion",
    ],
  },
  {
    id: "c2-s-education-reform",
    modality: "speaking",
    targetLevel: "C2",
    acceptableLevels: ["C1", "C2"],
    promptText:
      "Argue for one reform to Vietnamese English education that would improve real-life fluency without ignoring exam pressure. Anticipate one strong objection.",
    promptTextVi:
      "Hãy lập luận cho một cải cách giáo dục tiếng Anh ở Việt Nam giúp tăng năng lực dùng thật mà không bỏ qua áp lực thi cử. Dự đoán một phản biện mạnh.",
    expectedDurationSec: 180,
    minResponseLength: 120,
    rubricFocus: ["persuasive_speech", "counterargument", "policy_precision", "rhetorical_control"],
    l1InterferenceTriggers: [
      "conditional-simplification",
      "connector-overuse",
      "collocation-transfer",
    ],
  },
  {
    id: "c2-s-cultural-translation",
    modality: "speaking",
    targetLevel: "C2",
    acceptableLevels: ["C1", "C2"],
    promptText:
      "Explain a Vietnamese concept that is difficult to translate into English, such as duyên, nể, or quê. Preserve its cultural meaning while making it understandable to a foreign colleague.",
    promptTextVi:
      "Giải thích một khái niệm Việt khó dịch sang tiếng Anh, như duyên, nể, hoặc quê. Giữ được nghĩa văn hoá nhưng làm cho một đồng nghiệp nước ngoài hiểu được.",
    expectedDurationSec: 180,
    minResponseLength: 120,
    rubricFocus: ["cultural_explanation", "paraphrase", "precision", "audience_awareness"],
    l1InterferenceTriggers: [
      "calque-from-vietnamese",
      "direct-translation",
      "register-flattening",
    ],
  },
] satisfies PlacementPrompt[];
