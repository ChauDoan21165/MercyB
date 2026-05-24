import type { PlacementPrompt } from "./index.ts";

export const WRITING_PLACEMENT_PROMPTS = [
  {
    id: "a1-w-self-intro",
    modality: "writing",
    targetLevel: "A1",
    acceptableLevels: ["A1", "A2"],
    promptText:
      "Write 3 sentences about yourself. What is your name? Where do you live? What do you like?",
    promptTextVi:
      "Viết 3 câu về bản thân. Tên bạn là gì? Bạn sống ở đâu? Bạn thích gì?",
    expectedDurationSec: 120,
    minResponseLength: 15,
    rubricFocus: ["simple_present", "be_verbs", "common_vocab", "personal_information"],
    l1InterferenceTriggers: [
      "missing-articles",
      "copula-be-omission",
      "missing-pronouns",
    ],
  },
  {
    id: "a1-w-family-photo",
    modality: "writing",
    targetLevel: "A1",
    acceptableLevels: ["A1", "A2"],
    promptText:
      "Imagine you are showing Mercy a family photo. Write 4 simple sentences about the people in the photo.",
    promptTextVi:
      "Tưởng tượng bạn đang cho Mercy xem ảnh gia đình. Viết 4 câu đơn giản về những người trong ảnh.",
    context: "Family, age, jobs, and simple descriptions familiar to Vietnamese learners.",
    expectedDurationSec: 150,
    minResponseLength: 20,
    rubricFocus: ["be_verbs", "possessives", "family_vocab", "singular_plural"],
    l1InterferenceTriggers: [
      "copula-be-omission",
      "missing-plurals",
      "pronoun-gender-confusion",
    ],
  },
  {
    id: "a2-w-yesterday-after-school",
    modality: "writing",
    targetLevel: "A2",
    acceptableLevels: ["A1", "A2", "B1"],
    promptText:
      "Write 5-6 sentences about what you did yesterday after school or work. Include one time and one place.",
    promptTextVi:
      "Viết 5-6 câu về việc bạn đã làm hôm qua sau giờ học hoặc giờ làm. Nhắc đến một thời gian và một địa điểm.",
    expectedDurationSec: 240,
    minResponseLength: 45,
    rubricFocus: ["past_simple", "time_expressions", "basic_sequence", "everyday_vocab"],
    l1InterferenceTriggers: [
      "past-tense-omission",
      "preposition-transfer",
      "run-on-sentences",
    ],
  },
  {
    id: "a2-w-tet-message",
    modality: "writing",
    targetLevel: "A2",
    acceptableLevels: ["A1", "A2", "B1"],
    promptText:
      "Write a short message to an English-speaking friend about Tet. Explain what your family usually does and invite your friend to visit.",
    promptTextVi:
      "Viết một tin nhắn ngắn cho một người bạn nói tiếng Anh về Tết. Giải thích gia đình bạn thường làm gì và mời bạn ấy đến chơi.",
    expectedDurationSec: 300,
    minResponseLength: 55,
    rubricFocus: ["present_simple", "invitation_language", "cultural_vocab", "basic_connectors"],
    l1InterferenceTriggers: [
      "article-omission",
      "subject-verb-agreement",
      "direct-translation",
    ],
  },
  {
    id: "b1-w-lost-phone",
    modality: "writing",
    targetLevel: "B1",
    acceptableLevels: ["A2", "B1", "B2"],
    promptText:
      "You lost your phone in a Da Nang cafe. Write an email to the cafe manager. Describe when you visited, where you sat, what the phone looks like, and how they can contact you.",
    promptTextVi:
      "Bạn làm mất điện thoại ở một quán cà phê tại Đà Nẵng. Viết email cho quản lý quán. Mô tả thời gian bạn đến, chỗ bạn ngồi, điện thoại trông như thế nào, và cách liên hệ với bạn.",
    expectedDurationSec: 420,
    minResponseLength: 80,
    rubricFocus: ["functional_email", "past_simple", "specific_details", "polite_requests"],
    l1InterferenceTriggers: [
      "past-tense-omission",
      "preposition-transfer",
      "missing-articles",
    ],
  },
  {
    id: "b1-w-learning-problem",
    modality: "writing",
    targetLevel: "B1",
    acceptableLevels: ["A2", "B1", "B2"],
    promptText:
      "Write a forum post asking for advice about one English problem you have, such as pronunciation, listening, or speaking confidence. Explain what you have tried and what help you need.",
    promptTextVi:
      "Viết một bài đăng diễn đàn để xin lời khuyên về một vấn đề tiếng Anh của bạn, ví dụ phát âm, nghe, hoặc thiếu tự tin khi nói. Giải thích bạn đã thử gì và cần được giúp gì.",
    expectedDurationSec: 420,
    minResponseLength: 90,
    rubricFocus: ["problem_explanation", "present_perfect", "advice_requests", "paragraphing"],
    l1InterferenceTriggers: [
      "question-word-order-transfer",
      "verb-form-after-to",
      "lexical-repetition",
    ],
  },
  {
    id: "b2-w-workplace-choice",
    modality: "writing",
    targetLevel: "B2",
    acceptableLevels: ["B1", "B2", "C1"],
    promptText:
      "A Vietnamese company offers young employees two options: a higher salary with long hours, or a lower salary with training and mentoring. Which option is better for early-career workers? Give reasons and examples. Write about 120 words.",
    promptTextVi:
      "Một công ty Việt Nam cho nhân viên trẻ hai lựa chọn: lương cao hơn nhưng làm nhiều giờ, hoặc lương thấp hơn nhưng có đào tạo và người hướng dẫn. Lựa chọn nào tốt hơn cho người mới đi làm? Nêu lý do và ví dụ. Viết khoảng 120 từ.",
    expectedDurationSec: 540,
    minResponseLength: 100,
    rubricFocus: ["argument_structure", "comparison", "supporting_examples", "workplace_vocab"],
    l1InterferenceTriggers: [
      "connector-overuse",
      "conditional-simplification",
      "register-flattening",
    ],
  },
  {
    id: "b2-w-city-air-pollution",
    modality: "writing",
    targetLevel: "B2",
    acceptableLevels: ["B1", "B2", "C1"],
    promptText:
      "Air pollution in Hanoi and Ho Chi Minh City affects students' health and concentration. What should schools, families, and local government each do? Write a clear opinion with practical solutions.",
    promptTextVi:
      "Ô nhiễm không khí ở Hà Nội và TP.HCM ảnh hưởng đến sức khoẻ và khả năng tập trung của học sinh. Nhà trường, gia đình, và chính quyền địa phương mỗi bên nên làm gì? Viết một ý kiến rõ ràng với giải pháp thực tế.",
    expectedDurationSec: 600,
    minResponseLength: 120,
    rubricFocus: ["problem_solution", "modal_verbs", "cohesion", "policy_vocab"],
    l1InterferenceTriggers: [
      "modal-verb-inflection",
      "topic-comment-transfer",
      "collocation-transfer",
    ],
  },
  {
    id: "c1-w-migration-tradeoffs",
    modality: "writing",
    targetLevel: "C1",
    acceptableLevels: ["B2", "C1", "C2"],
    promptText:
      "Many Vietnamese students study English to migrate abroad. Others stay and use English locally. What are the trade-offs of each path? Argue for one. Write about 150 words.",
    promptTextVi:
      "Nhiều học sinh Việt học tiếng Anh để đi nước ngoài. Một số ở lại và dùng tiếng Anh trong nước. Phân tích đánh đổi của mỗi lựa chọn. Lập luận cho một bên. Viết khoảng 150 từ.",
    expectedDurationSec: 600,
    minResponseLength: 120,
    rubricFocus: ["complex_argumentation", "hedging", "register_formal", "nuanced_vocab"],
    l1InterferenceTriggers: [
      "calque-from-vietnamese",
      "register-flattening",
      "connector-overuse",
    ],
  },
  {
    id: "c1-w-ai-tutor-ethics",
    modality: "writing",
    targetLevel: "C1",
    acceptableLevels: ["B2", "C1", "C2"],
    promptText:
      "AI tutors can give Vietnamese learners affordable feedback, but they may also make mistakes or reduce human interaction. Evaluate the risks and benefits, then propose safeguards.",
    promptTextVi:
      "Gia sư AI có thể giúp người học Việt nhận phản hồi với chi phí thấp, nhưng cũng có thể mắc lỗi hoặc làm giảm tương tác với con người. Đánh giá lợi ích và rủi ro, rồi đề xuất biện pháp bảo vệ.",
    expectedDurationSec: 660,
    minResponseLength: 140,
    rubricFocus: ["evaluation", "risk_benefit_analysis", "hedging", "abstract_vocab"],
    l1InterferenceTriggers: [
      "relative-clause-transfer",
      "word-family-confusion",
      "collocation-transfer",
    ],
  },
  {
    id: "c2-w-diaspora-identity",
    modality: "writing",
    targetLevel: "C2",
    acceptableLevels: ["C1", "C2"],
    promptText:
      "For many families, English is both a tool for opportunity and a pressure that can distance children from Vietnamese language and identity. Discuss this tension without simplifying either side.",
    promptTextVi:
      "Với nhiều gia đình, tiếng Anh vừa là công cụ mở ra cơ hội vừa là áp lực có thể làm trẻ xa tiếng Việt và bản sắc Việt. Hãy bàn về mâu thuẫn này mà không đơn giản hoá bên nào.",
    expectedDurationSec: 720,
    minResponseLength: 170,
    rubricFocus: ["nuanced_synthesis", "stance_control", "complex_cohesion", "precise_abstraction"],
    l1InterferenceTriggers: [
      "calque-from-vietnamese",
      "register-flattening",
      "topic-comment-transfer",
    ],
  },
  {
    id: "c2-w-exam-culture-critique",
    modality: "writing",
    targetLevel: "C2",
    acceptableLevels: ["C1", "C2"],
    promptText:
      "Vietnamese English education is often criticized for prioritizing scores over usable fluency, yet high-stakes exams can create discipline and accountability. Write a balanced critique that distinguishes bad exam culture from valid assessment.",
    promptTextVi:
      "Giáo dục tiếng Anh ở Việt Nam thường bị phê bình là ưu tiên điểm số hơn năng lực dùng thật, nhưng các kỳ thi quan trọng cũng có thể tạo kỷ luật và trách nhiệm. Viết một bài phê bình cân bằng, phân biệt văn hoá thi cử tệ với đánh giá có giá trị.",
    expectedDurationSec: 780,
    minResponseLength: 180,
    rubricFocus: ["balanced_critique", "concession", "precision", "academic_register"],
    l1InterferenceTriggers: [
      "connector-overuse",
      "collocation-transfer",
      "conditional-simplification",
    ],
  },
] satisfies PlacementPrompt[];
