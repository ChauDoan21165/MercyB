import type { ListeningPlacementPrompt } from "./index.ts";

export const LISTENING_PLACEMENT_PROMPTS = [
  {
    id: "a1-l-school-schedule",
    modality: "listening",
    targetLevel: "A1",
    acceptableLevels: ["A1", "A2"],
    title: "New English Class",
    titleVi: "Lớp tiếng Anh mới",
    promptText: "Listen to a short announcement and answer the questions.",
    promptTextVi: "Nghe một thông báo ngắn và trả lời câu hỏi.",
    audioScript:
      "Hello students. Your new English class starts on Monday at nine o'clock. Please bring a notebook and a blue pen. The classroom is A12.",
    audioScriptVi:
      "Chào các em. Lớp tiếng Anh mới bắt đầu vào thứ Hai lúc 9 giờ. Vui lòng mang vở và bút xanh. Phòng học là A12.",
    expectedDurationSec: 90,
    minResponseLength: 2,
    rubricFocus: ["literal_listening", "time_recognition", "school_items", "room_numbers"],
    l1InterferenceTriggers: ["final-consonant-deletion", "preposition-transfer"],
    questions: [
      {
        id: "a1-l-school-schedule-q1",
        questionText: "When does the class start?",
        questionTextVi: "Lớp bắt đầu khi nào?",
        options: ["Monday at 9:00", "Monday at 12:00", "Friday at 9:00"],
        correctAnswer: "Monday at 9:00",
      },
      {
        id: "a1-l-school-schedule-q2",
        questionText: "What should students bring?",
        questionTextVi: "Học sinh nên mang gì?",
        options: ["A notebook and a blue pen", "A book and red pen", "A phone"],
        correctAnswer: "A notebook and a blue pen",
      },
    ],
  },
  {
    id: "a2-l-food-order",
    modality: "listening",
    targetLevel: "A2",
    acceptableLevels: ["A1", "A2", "B1"],
    title: "Takeaway Order",
    titleVi: "Gọi đồ mang đi",
    promptText: "Listen to a customer ordering food and answer the questions.",
    promptTextVi: "Nghe một khách hàng gọi đồ ăn và trả lời câu hỏi.",
    audioScript:
      "Customer: Hi, I'd like one chicken banh mi and an iced tea, please. Server: Sure. Anything else? Customer: No, that's all. Can I pick it up in ten minutes?",
    audioScriptVi:
      "Khách: Chào bạn, cho tôi một bánh mì gà và một ly trà đá. Nhân viên: Vâng. Còn gì nữa không ạ? Khách: Không, vậy thôi. Tôi có thể lấy sau mười phút không?",
    expectedDurationSec: 120,
    minResponseLength: 3,
    rubricFocus: ["transactional_listening", "food_vocab", "polite_requests", "time_detail"],
    l1InterferenceTriggers: ["missing-articles", "question-word-order-transfer"],
    questions: [
      {
        id: "a2-l-food-order-q1",
        questionText: "What food does the customer order?",
        questionTextVi: "Khách gọi món ăn gì?",
        options: ["Chicken banh mi", "Beef pho", "Fried rice"],
        correctAnswer: "Chicken banh mi",
      },
      {
        id: "a2-l-food-order-q2",
        questionText: "When does the customer want to pick it up?",
        questionTextVi: "Khách muốn lấy đồ khi nào?",
        options: ["In five minutes", "In ten minutes", "Tomorrow"],
        correctAnswer: "In ten minutes",
      },
    ],
  },
  {
    id: "b1-l-parent-teacher",
    modality: "listening",
    targetLevel: "B1",
    acceptableLevels: ["A2", "B1", "B2"],
    title: "Parent-Teacher Call",
    titleVi: "Cuộc gọi phụ huynh và giáo viên",
    promptText: "Listen to a phone call and answer the questions.",
    promptTextVi: "Nghe một cuộc gọi điện thoại và trả lời câu hỏi.",
    audioScript:
      "Teacher: Mai is doing well in reading, but she is quiet during speaking activities. Parent: She practices at home, but she is afraid of making mistakes. Teacher: That's normal. I will pair her with a patient partner next week.",
    audioScriptVi:
      "Giáo viên: Mai đọc tốt, nhưng khá im lặng trong các hoạt động nói. Phụ huynh: Ở nhà cháu có luyện tập, nhưng cháu sợ mắc lỗi. Giáo viên: Điều đó bình thường. Tuần tới tôi sẽ ghép cháu với một bạn kiên nhẫn.",
    expectedDurationSec: 150,
    minResponseLength: 4,
    rubricFocus: ["problem_identification", "contrast", "emotion_recognition", "school_vocab"],
    l1InterferenceTriggers: ["collocation-transfer", "past-tense-omission"],
    questions: [
      {
        id: "b1-l-parent-teacher-q1",
        questionText: "What is Mai's strength?",
        questionTextVi: "Điểm mạnh của Mai là gì?",
        correctAnswer: "Reading.",
      },
      {
        id: "b1-l-parent-teacher-q2",
        questionText: "Why is Mai quiet in speaking activities?",
        questionTextVi: "Tại sao Mai im lặng khi hoạt động nói?",
        correctAnswer: "She is afraid of making mistakes.",
      },
    ],
  },
  {
    id: "b1-l-delivery-problem",
    modality: "listening",
    targetLevel: "B1",
    acceptableLevels: ["A2", "B1", "B2"],
    title: "Delivery Problem",
    titleVi: "Vấn đề giao hàng",
    promptText: "Listen to a customer service call and answer the questions.",
    promptTextVi: "Nghe cuộc gọi dịch vụ khách hàng và trả lời câu hỏi.",
    audioScript:
      "Agent: Your package was sent to the old address because the address change happened after shipping. Customer: I understand, but I updated it before paying. Agent: I see. We can redirect it, but delivery may be delayed by two days.",
    audioScriptVi:
      "Nhân viên: Gói hàng của bạn được gửi đến địa chỉ cũ vì việc đổi địa chỉ diễn ra sau khi giao hàng bắt đầu. Khách: Tôi hiểu, nhưng tôi đã cập nhật trước khi thanh toán. Nhân viên: Tôi thấy rồi. Chúng tôi có thể chuyển hướng, nhưng giao hàng có thể chậm hai ngày.",
    expectedDurationSec: 150,
    minResponseLength: 4,
    rubricFocus: ["sequence_of_events", "customer_service_vocab", "problem_solution", "polite_tone"],
    l1InterferenceTriggers: ["tense-aspect-transfer", "preposition-transfer"],
    questions: [
      {
        id: "b1-l-delivery-problem-q1",
        questionText: "Why was the package sent to the old address?",
        questionTextVi: "Tại sao gói hàng được gửi đến địa chỉ cũ?",
        correctAnswer: "The address change happened after shipping.",
      },
      {
        id: "b1-l-delivery-problem-q2",
        questionText: "What is the possible result of redirecting it?",
        questionTextVi: "Kết quả có thể xảy ra khi chuyển hướng gói hàng là gì?",
        correctAnswer: "Delivery may be delayed by two days.",
      },
    ],
  },
  {
    id: "b2-l-scholarship-advice",
    modality: "listening",
    targetLevel: "B2",
    acceptableLevels: ["B1", "B2", "C1"],
    title: "Scholarship Advice",
    titleVi: "Lời khuyên học bổng",
    promptText: "Listen to a mentor giving advice and answer the questions.",
    promptTextVi: "Nghe một cố vấn đưa lời khuyên và trả lời câu hỏi.",
    audioScript:
      "Mentor: Your grades are strong, so don't spend the whole essay repeating them. The committee already has your transcript. Use the essay to show why your work with rural students matters and what you learned when the first workshop failed.",
    audioScriptVi:
      "Cố vấn: Điểm của em tốt, nên đừng dành cả bài luận để lặp lại điều đó. Hội đồng đã có bảng điểm. Hãy dùng bài luận để cho thấy vì sao việc em làm với học sinh nông thôn có ý nghĩa và em học được gì khi buổi workshop đầu tiên thất bại.",
    expectedDurationSec: 180,
    minResponseLength: 5,
    rubricFocus: ["main_advice", "implicit_reasoning", "academic_vocab", "contrast"],
    l1InterferenceTriggers: ["lexical-repetition", "register-flattening"],
    questions: [
      {
        id: "b2-l-scholarship-advice-q1",
        questionText: "What should the student avoid doing in the essay?",
        questionTextVi: "Học sinh nên tránh làm gì trong bài luận?",
        correctAnswer: "Repeating their grades/transcript.",
      },
      {
        id: "b2-l-scholarship-advice-q2",
        questionText: "What story should the student include?",
        questionTextVi: "Học sinh nên đưa câu chuyện nào vào?",
        correctAnswer: "Their work with rural students and what they learned from a failed workshop.",
      },
    ],
  },
  {
    id: "c1-l-workplace-feedback",
    modality: "listening",
    targetLevel: "C1",
    acceptableLevels: ["B2", "C1", "C2"],
    title: "Manager Feedback",
    titleVi: "Phản hồi của quản lý",
    promptText: "Listen to nuanced workplace feedback and answer the questions.",
    promptTextVi: "Nghe phản hồi công việc có sắc thái và trả lời câu hỏi.",
    audioScript:
      "Manager: Your analysis was careful, and the client trusted your numbers. What didn't land as well was the recommendation section. It sounded safe rather than decisive. For the next version, keep the evidence, but make the trade-off explicit and state which option you recommend.",
    audioScriptVi:
      "Quản lý: Phân tích của em cẩn thận, và khách hàng tin số liệu của em. Phần chưa hiệu quả bằng là phần khuyến nghị. Nó nghe an toàn hơn là dứt khoát. Bản tiếp theo hãy giữ bằng chứng, nhưng nói rõ sự đánh đổi và nêu lựa chọn em đề xuất.",
    expectedDurationSec: 210,
    minResponseLength: 5,
    rubricFocus: ["nuanced_feedback", "inference", "business_vocab", "recommendation_language"],
    l1InterferenceTriggers: ["register-flattening", "collocation-transfer"],
    questions: [
      {
        id: "c1-l-workplace-feedback-q1",
        questionText: "What did the manager praise?",
        questionTextVi: "Quản lý khen điều gì?",
        correctAnswer: "Careful analysis and trustworthy numbers.",
      },
      {
        id: "c1-l-workplace-feedback-q2",
        questionText: "What should be improved in the next version?",
        questionTextVi: "Bản tiếp theo cần cải thiện điều gì?",
        correctAnswer: "Make the trade-off explicit and state a recommendation.",
      },
    ],
  },
] satisfies ListeningPlacementPrompt[];
