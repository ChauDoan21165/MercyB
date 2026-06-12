import type { PlacementPrompt } from "./index.ts";

export const CONVERSATION_PLACEMENT_PROMPTS = [
  {
    id: "a1-c-mercy-greeting",
    modality: "conversation",
    targetLevel: "A1",
    acceptableLevels: ["A1", "A2"],
    promptText:
      "Mercy greets you: 'Hi, I am Mercy. What is your name, and where are you from?' Answer and ask Mercy one simple question.",
    promptTextVi:
      "Mercy chào bạn: 'Hi, I am Mercy. What is your name, and where are you from?' Hãy trả lời và hỏi Mercy một câu đơn giản.",
    expectedDurationSec: 45,
    minResponseLength: 20,
    rubricFocus: ["greetings", "personal_information", "turn_taking", "simple_questions"],
    l1InterferenceTriggers: [
      "question-word-order-transfer",
      "copula-be-omission",
      "missing-pronouns",
    ],
  },
  {
    id: "a2-c-weekend-chat",
    modality: "conversation",
    targetLevel: "A2",
    acceptableLevels: ["A1", "A2", "B1"],
    promptText:
      "Mercy asks what you did last weekend and whether you enjoyed it. Answer, then ask Mercy about her weekend.",
    promptTextVi:
      "Mercy hỏi cuối tuần trước bạn đã làm gì và bạn có thích không. Hãy trả lời, rồi hỏi Mercy về cuối tuần của cô ấy.",
    expectedDurationSec: 60,
    minResponseLength: 35,
    rubricFocus: ["past_simple", "follow_up_question", "likes_dislikes", "conversation_repair"],
    l1InterferenceTriggers: [
      "past-tense-omission",
      "question-word-order-transfer",
      "final-consonant-deletion",
    ],
  },
  {
    id: "b1-c-study-plan",
    modality: "conversation",
    targetLevel: "B1",
    acceptableLevels: ["A2", "B1", "B2"],
    promptText:
      "Mercy asks about your English goal for the next three months. Explain your goal, one obstacle, and what help you want from Mercy.",
    promptTextVi:
      "Mercy hỏi mục tiêu tiếng Anh của bạn trong ba tháng tới. Hãy giải thích mục tiêu, một trở ngại, và phần bạn muốn Mercy hỗ trợ.",
    expectedDurationSec: 90,
    minResponseLength: 55,
    rubricFocus: ["goal_setting", "future_forms", "problem_explanation", "request_language"],
    l1InterferenceTriggers: [
      "verb-form-after-to",
      "direct-translation",
      "connector-overuse",
    ],
  },
  {
    id: "b2-c-opinion-followup",
    modality: "conversation",
    targetLevel: "B2",
    acceptableLevels: ["B1", "B2", "C1"],
    promptText:
      "Mercy says, 'Some learners should focus on pronunciation before grammar.' Do you agree? Give your opinion, then respond to one follow-up question.",
    promptTextVi:
      "Mercy nói: 'Một số người học nên tập trung phát âm trước ngữ pháp.' Bạn có đồng ý không? Nêu ý kiến, rồi trả lời một câu hỏi tiếp theo.",
    expectedDurationSec: 120,
    minResponseLength: 75,
    rubricFocus: ["opinion_support", "spontaneous_followup", "contrast", "learning_strategy_vocab"],
    l1InterferenceTriggers: [
      "register-flattening",
      "collocation-transfer",
      "topic-comment-transfer",
    ],
  },
  {
    id: "c1-c-polished-disagreement",
    modality: "conversation",
    targetLevel: "C1",
    acceptableLevels: ["B2", "C1", "C2"],
    promptText:
      "Mercy challenges your answer and says it may be too simple. Defend your point politely, refine it, and ask Mercy what evidence would make it stronger.",
    promptTextVi:
      "Mercy phản biện câu trả lời của bạn và nói rằng câu trả lời có thể còn quá đơn giản. Hãy bảo vệ quan điểm một cách lịch sự, chỉnh lại cho có sắc thái hơn, và hỏi Mercy bằng chứng nào sẽ làm lập luận mạnh hơn.",
    expectedDurationSec: 150,
    minResponseLength: 90,
    rubricFocus: ["polite_disagreement", "self_revision", "evidence_request", "discourse_control"],
    l1InterferenceTriggers: [
      "register-flattening",
      "relative-clause-transfer",
      "word-family-confusion",
    ],
  },
  {
    id: "c2-c-identity-debate",
    modality: "conversation",
    targetLevel: "C2",
    acceptableLevels: ["C1", "C2"],
    promptText:
      "Mercy asks whether English learning changes how Vietnamese learners see themselves. Explore the question with nuance, including one personal or observed example and one limitation of your view.",
    promptTextVi:
      "Mercy hỏi việc học tiếng Anh có thay đổi cách người Việt nhìn nhận bản thân không. Hãy bàn có sắc thái, gồm một ví dụ cá nhân hoặc quan sát được và một giới hạn trong quan điểm của bạn.",
    expectedDurationSec: 180,
    minResponseLength: 120,
    rubricFocus: ["identity_discussion", "nuance", "self_limitation", "abstract_conversation"],
    l1InterferenceTriggers: [
      "calque-from-vietnamese",
      "conditional-simplification",
      "register-flattening",
    ],
  },
] satisfies PlacementPrompt[];
