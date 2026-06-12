import type { ReadingPlacementPrompt } from "./index.ts";

export const READING_PLACEMENT_PROMPTS = [
  {
    id: "a1-r-library-card",
    modality: "reading",
    targetLevel: "A1",
    acceptableLevels: ["A1", "A2"],
    title: "Library Card Notice",
    titleVi: "Thông báo thẻ thư viện",
    promptText: "Read the notice and answer the questions.",
    promptTextVi: "Đọc thông báo và trả lời câu hỏi.",
    passageText:
      "New students can get a library card at the front desk. Please bring your student ID and one photo. The library is open from 8 a.m. to 5 p.m. Monday to Friday.",
    passageTextVi:
      "Sinh viên mới có thể làm thẻ thư viện tại quầy lễ tân. Vui lòng mang thẻ sinh viên và một ảnh. Thư viện mở cửa từ 8 giờ sáng đến 5 giờ chiều, từ thứ Hai đến thứ Sáu.",
    expectedDurationSec: 120,
    minResponseLength: 2,
    rubricFocus: ["scanning", "time_words", "school_vocab", "literal_comprehension"],
    l1InterferenceTriggers: ["missing-articles", "preposition-transfer"],
    questions: [
      {
        id: "a1-r-library-card-q1",
        questionText: "What must students bring?",
        questionTextVi: "Sinh viên phải mang gì?",
        options: ["Student ID and one photo", "Passport and money", "Two books"],
        correctAnswer: "Student ID and one photo",
      },
      {
        id: "a1-r-library-card-q2",
        questionText: "When is the library open?",
        questionTextVi: "Thư viện mở cửa khi nào?",
        options: ["Weekends", "Monday to Friday", "Only Monday"],
        correctAnswer: "Monday to Friday",
      },
    ],
  },
  {
    id: "a1-r-cafe-menu",
    modality: "reading",
    targetLevel: "A1",
    acceptableLevels: ["A1", "A2"],
    title: "Cafe Menu",
    titleVi: "Thực đơn quán cà phê",
    promptText: "Read the cafe menu and answer the questions.",
    promptTextVi: "Đọc thực đơn quán cà phê và trả lời câu hỏi.",
    passageText:
      "Morning Set: egg sandwich and tea, 45,000 VND. Student Set: banh mi and iced milk coffee, 55,000 VND. Fruit Set: banana, yogurt, and water, 50,000 VND.",
    passageTextVi:
      "Phần ăn sáng: sandwich trứng và trà, 45.000 đồng. Phần sinh viên: bánh mì và cà phê sữa đá, 55.000 đồng. Phần trái cây: chuối, sữa chua, và nước, 50.000 đồng.",
    expectedDurationSec: 120,
    minResponseLength: 2,
    rubricFocus: ["food_vocab", "number_scanning", "simple_inference"],
    l1InterferenceTriggers: ["classifier-transfer", "missing-plurals"],
    questions: [
      {
        id: "a1-r-cafe-menu-q1",
        questionText: "Which set has iced milk coffee?",
        questionTextVi: "Phần nào có cà phê sữa đá?",
        options: ["Morning Set", "Student Set", "Fruit Set"],
        correctAnswer: "Student Set",
      },
      {
        id: "a1-r-cafe-menu-q2",
        questionText: "Which set is cheapest?",
        questionTextVi: "Phần nào rẻ nhất?",
        options: ["Morning Set", "Student Set", "Fruit Set"],
        correctAnswer: "Morning Set",
      },
    ],
  },
  {
    id: "a2-r-zalo-class-message",
    modality: "reading",
    targetLevel: "A2",
    acceptableLevels: ["A1", "A2", "B1"],
    title: "Class Group Message",
    titleVi: "Tin nhắn nhóm lớp",
    promptText: "Read the group message and answer the questions.",
    promptTextVi: "Đọc tin nhắn nhóm và trả lời câu hỏi.",
    passageText:
      "Hi everyone, tomorrow's English club will start at 6:30 p.m., not 6:00. Please prepare one short story about a mistake you made while learning English. We will meet in Room B204 because Room B101 is being cleaned.",
    passageTextVi:
      "Chào mọi người, câu lạc bộ tiếng Anh ngày mai sẽ bắt đầu lúc 6:30 tối, không phải 6:00. Hãy chuẩn bị một câu chuyện ngắn về một lỗi bạn từng mắc khi học tiếng Anh. Chúng ta sẽ gặp ở phòng B204 vì phòng B101 đang được dọn.",
    expectedDurationSec: 180,
    minResponseLength: 3,
    rubricFocus: ["changed_details", "reason_recognition", "classroom_vocab"],
    l1InterferenceTriggers: ["past-tense-omission", "preposition-transfer"],
    questions: [
      {
        id: "a2-r-zalo-class-message-q1",
        questionText: "What time will the club start?",
        questionTextVi: "Câu lạc bộ sẽ bắt đầu lúc mấy giờ?",
        options: ["6:00 p.m.", "6:30 p.m.", "B204"],
        correctAnswer: "6:30 p.m.",
      },
      {
        id: "a2-r-zalo-class-message-q2",
        questionText: "Why will students meet in B204?",
        questionTextVi: "Tại sao học sinh gặp ở B204?",
        options: ["B101 is being cleaned", "The teacher is late", "The club is cancelled"],
        correctAnswer: "B101 is being cleaned",
      },
    ],
  },
  {
    id: "a2-r-homestay-note",
    modality: "reading",
    targetLevel: "A2",
    acceptableLevels: ["A1", "A2", "B1"],
    title: "Homestay Note",
    titleVi: "Ghi chú nhà homestay",
    promptText: "Read the note from a host family and answer the questions.",
    promptTextVi: "Đọc ghi chú từ gia đình chủ nhà và trả lời câu hỏi.",
    passageText:
      "Welcome to our home in Hoi An. Breakfast is served from 7:00 to 9:00 in the kitchen. Please lock the front door after 10 p.m. If you need laundry service, put your clothes in the blue basket before noon.",
    passageTextVi:
      "Chào mừng bạn đến nhà chúng tôi ở Hội An. Bữa sáng phục vụ từ 7:00 đến 9:00 trong bếp. Vui lòng khóa cửa trước sau 10 giờ tối. Nếu cần giặt đồ, hãy bỏ quần áo vào giỏ xanh trước buổi trưa.",
    expectedDurationSec: 180,
    minResponseLength: 3,
    rubricFocus: ["instructions", "time_prepositions", "conditionals_basic", "travel_vocab"],
    l1InterferenceTriggers: ["preposition-transfer", "missing-articles"],
    questions: [
      {
        id: "a2-r-homestay-note-q1",
        questionText: "Where is breakfast served?",
        questionTextVi: "Bữa sáng phục vụ ở đâu?",
        options: ["In the kitchen", "In the garden", "In the blue basket"],
        correctAnswer: "In the kitchen",
      },
      {
        id: "a2-r-homestay-note-q2",
        questionText: "What should guests do before noon for laundry?",
        questionTextVi: "Khách cần làm gì trước buổi trưa nếu muốn giặt đồ?",
        options: ["Lock the door", "Put clothes in the blue basket", "Eat breakfast"],
        correctAnswer: "Put clothes in the blue basket",
      },
    ],
  },
  {
    id: "b1-r-internship-email",
    modality: "reading",
    targetLevel: "B1",
    acceptableLevels: ["A2", "B1", "B2"],
    title: "Internship Email",
    titleVi: "Email thực tập",
    promptText: "Read the email and answer the questions.",
    promptTextVi: "Đọc email và trả lời câu hỏi.",
    passageText:
      "Dear Minh, thank you for applying for the summer internship at GreenTech. We were impressed by your volunteer experience and your interest in renewable energy. The next step is a 20-minute online interview on Thursday afternoon. Please choose one time slot before 5 p.m. today. If selected, interns will receive a travel allowance but no salary.",
    passageTextVi:
      "Minh thân mến, cảm ơn bạn đã ứng tuyển kỳ thực tập mùa hè tại GreenTech. Chúng tôi ấn tượng với kinh nghiệm tình nguyện và sự quan tâm của bạn đến năng lượng tái tạo. Bước tiếp theo là phỏng vấn trực tuyến 20 phút vào chiều thứ Năm. Vui lòng chọn một khung giờ trước 5 giờ chiều hôm nay. Nếu được chọn, thực tập sinh sẽ nhận phụ cấp đi lại nhưng không có lương.",
    expectedDurationSec: 240,
    minResponseLength: 4,
    rubricFocus: ["email_purpose", "detail_scanning", "contrast", "workplace_vocab"],
    l1InterferenceTriggers: ["word-family-confusion", "preposition-transfer"],
    questions: [
      {
        id: "b1-r-internship-email-q1",
        questionText: "What must Minh do today?",
        questionTextVi: "Minh phải làm gì hôm nay?",
        correctAnswer: "Choose an interview time slot before 5 p.m.",
      },
      {
        id: "b1-r-internship-email-q2",
        questionText: "What payment will selected interns receive?",
        questionTextVi: "Thực tập sinh được chọn sẽ nhận khoản tiền gì?",
        correctAnswer: "A travel allowance but no salary.",
      },
    ],
  },
  {
    id: "b1-r-festival-volunteer",
    modality: "reading",
    targetLevel: "B1",
    acceptableLevels: ["A2", "B1", "B2"],
    title: "Festival Volunteers",
    titleVi: "Tình nguyện viên lễ hội",
    promptText: "Read the announcement and answer the questions.",
    promptTextVi: "Đọc thông báo và trả lời câu hỏi.",
    passageText:
      "The Da Nang International Fireworks Festival is recruiting student volunteers. Volunteers will guide visitors, translate basic questions, and help elderly guests find seats. Applicants must be at least 18 and able to work two evening shifts. Previous volunteer experience is helpful but not required. Training will be provided one week before the festival.",
    passageTextVi:
      "Lễ hội pháo hoa quốc tế Đà Nẵng đang tuyển tình nguyện viên sinh viên. Tình nguyện viên sẽ hướng dẫn du khách, dịch các câu hỏi cơ bản, và giúp khách lớn tuổi tìm chỗ ngồi. Ứng viên phải ít nhất 18 tuổi và có thể làm hai ca tối. Kinh nghiệm tình nguyện là lợi thế nhưng không bắt buộc. Đào tạo sẽ được cung cấp một tuần trước lễ hội.",
    expectedDurationSec: 240,
    minResponseLength: 4,
    rubricFocus: ["requirements", "main_idea", "not_required_detail", "service_vocab"],
    l1InterferenceTriggers: ["modal-verb-inflection", "relative-clause-transfer"],
    questions: [
      {
        id: "b1-r-festival-volunteer-q1",
        questionText: "What is one duty of the volunteers?",
        questionTextVi: "Một nhiệm vụ của tình nguyện viên là gì?",
        correctAnswer: "Guide visitors, translate basic questions, or help elderly guests find seats.",
      },
      {
        id: "b1-r-festival-volunteer-q2",
        questionText: "Is previous volunteer experience required?",
        questionTextVi: "Có bắt buộc phải có kinh nghiệm tình nguyện trước đó không?",
        correctAnswer: "No, it is helpful but not required.",
      },
    ],
  },
  {
    id: "b2-r-shadow-education",
    modality: "reading",
    targetLevel: "B2",
    acceptableLevels: ["B1", "B2", "C1"],
    title: "Private Tutoring Debate",
    titleVi: "Tranh luận về học thêm",
    promptText: "Read the passage and answer the questions.",
    promptTextVi: "Đọc đoạn văn và trả lời câu hỏi.",
    passageText:
      "Private English tutoring has become almost normal in many Vietnamese cities. Supporters argue that extra classes help students receive individual attention that crowded schools cannot provide. Critics, however, warn that tutoring can widen inequality because wealthier families can buy more practice and better feedback. The issue is not simply whether tutoring is good or bad, but whether schools can offer enough quality support so that tutoring becomes a choice rather than a necessity.",
    passageTextVi:
      "Học thêm tiếng Anh đã trở nên gần như bình thường ở nhiều thành phố Việt Nam. Người ủng hộ cho rằng lớp học thêm giúp học sinh nhận được sự hỗ trợ cá nhân mà trường đông học sinh khó cung cấp. Tuy nhiên, người phê bình cảnh báo rằng học thêm có thể làm tăng bất bình đẳng vì gia đình khá giả mua được nhiều thời gian luyện tập và phản hồi tốt hơn. Vấn đề không chỉ là học thêm tốt hay xấu, mà là liệu nhà trường có thể cung cấp đủ hỗ trợ chất lượng để học thêm trở thành lựa chọn thay vì nhu cầu bắt buộc.",
    expectedDurationSec: 300,
    minResponseLength: 5,
    rubricFocus: ["argument_recognition", "contrast", "implicit_claim", "education_vocab"],
    l1InterferenceTriggers: ["connector-overuse", "calque-from-vietnamese"],
    questions: [
      {
        id: "b2-r-shadow-education-q1",
        questionText: "What concern do critics raise about tutoring?",
        questionTextVi: "Người phê bình lo ngại điều gì về học thêm?",
        correctAnswer: "It can widen inequality.",
      },
      {
        id: "b2-r-shadow-education-q2",
        questionText: "What is the author's main point?",
        questionTextVi: "Ý chính của tác giả là gì?",
        correctAnswer:
          "Schools should offer enough support so tutoring is a choice, not a necessity.",
      },
    ],
  },
  {
    id: "b2-r-remote-work-vietnam",
    modality: "reading",
    targetLevel: "B2",
    acceptableLevels: ["B1", "B2", "C1"],
    title: "Remote Work and Smaller Cities",
    titleVi: "Làm việc từ xa và thành phố nhỏ",
    promptText: "Read the passage and answer the questions.",
    promptTextVi: "Đọc đoạn văn và trả lời câu hỏi.",
    passageText:
      "Remote work has allowed some young professionals to leave Hanoi or Ho Chi Minh City for smaller places such as Da Lat, Hue, or Quy Nhon. Lower rent and cleaner air are obvious attractions, but the shift is uneven. Workers in technology and design benefit most, while people in hospitality, manufacturing, and retail still depend on physical workplaces. Remote work may reduce pressure on big cities, but it will not automatically create equal opportunity unless smaller cities also invest in internet infrastructure, transport, and professional networks.",
    passageTextVi:
      "Làm việc từ xa đã cho phép một số người trẻ rời Hà Nội hoặc TP.HCM đến các nơi nhỏ hơn như Đà Lạt, Huế, hoặc Quy Nhơn. Tiền thuê thấp hơn và không khí sạch hơn là điểm hấp dẫn rõ ràng, nhưng sự chuyển dịch này không đồng đều. Người làm công nghệ và thiết kế hưởng lợi nhiều nhất, trong khi người làm khách sạn, sản xuất, và bán lẻ vẫn phụ thuộc vào nơi làm việc trực tiếp. Làm việc từ xa có thể giảm áp lực cho thành phố lớn, nhưng không tự động tạo cơ hội công bằng trừ khi thành phố nhỏ cũng đầu tư vào hạ tầng internet, giao thông, và mạng lưới nghề nghiệp.",
    expectedDurationSec: 330,
    minResponseLength: 5,
    rubricFocus: ["qualification", "inference", "sector_vocab", "policy_implication"],
    l1InterferenceTriggers: ["conditional-simplification", "collocation-transfer"],
    questions: [
      {
        id: "b2-r-remote-work-vietnam-q1",
        questionText: "Which workers benefit most from remote work according to the passage?",
        questionTextVi: "Theo bài đọc, nhóm lao động nào hưởng lợi nhiều nhất từ làm việc từ xa?",
        correctAnswer: "Workers in technology and design.",
      },
      {
        id: "b2-r-remote-work-vietnam-q2",
        questionText: "Why will remote work not automatically create equal opportunity?",
        questionTextVi: "Tại sao làm việc từ xa không tự động tạo cơ hội công bằng?",
        correctAnswer:
          "Because smaller cities also need infrastructure, transport, and professional networks.",
      },
    ],
  },
] satisfies ReadingPlacementPrompt[];
