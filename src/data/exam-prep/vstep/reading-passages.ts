// src/data/exam-prep/vstep/reading-passages.ts
// VSTEP Reading practice passages — B1 and B2.
// Each passage includes text, questions, vocabulary support, and Vietnamese learner notes.

import type { VstepReadingPassage } from "../../../types/vstep";

export const VSTEP_READING_PASSAGES: VstepReadingPassage[] = [
  {
    id: "vstep_b1_reading_city_email",
    level: "B1",
    section: "email",
    title_en: "City Event Invitation Email",
    title_vi: "Email mời tham dự sự kiện thành phố",
    passage:
      "From: City Events Team\nTo: All Residents\nSubject: Summer Festival This Saturday\n\nDear Residents,\n\nWe are excited to invite you to the annual Summer Festival this Saturday, 15th July, at Central Park. The event will run from 11:00 AM to 6:00 PM and will feature live music, food stalls, and activities for children.\n\nEntry is free for all residents. Please bring this email or your resident card for registration at the entrance. Parking is limited, so we encourage you to use public transport. The number 24 and 36 buses stop directly outside the park.\n\nWe look forward to seeing you there.\n\nBest regards,\nCity Events Team",
    questions: [
      { number: 1, question_en: "When will the Summer Festival take place?", question_vi: "Lễ hội Mùa hè sẽ diễn ra khi nào?", options: ["14th July", "15th July", "16th July", "17th July"], answer: "B" },
      { number: 2, question_en: "What do residents need to bring for registration?", question_vi: "Cư dân cần mang gì để đăng ký?", options: ["A passport", "A ticket", "This email or resident card", "A driving license"], answer: "C" },
      { number: 3, question_en: "Why does the email recommend public transport?", question_vi: "Tại sao email khuyến khích dùng phương tiện công cộng?", options: ["It is cheaper", "Parking is limited", "Buses are free that day", "The park is far away"], answer: "B" },
      { number: 4, question_en: "Which bus routes stop outside Central Park?", question_vi: "Những tuyến xe buýt nào dừng bên ngoài Công viên Trung tâm?", options: ["14 and 26", "24 and 36", "34 and 46", "44 and 56"], answer: "B" },
    ],
    difficulty: "easy",
    vocabulary: [
      { word: "resident", translation_vi: "cư dân" },
      { word: "entry", translation_vi: "vào cửa" },
      { word: "limited", translation_vi: "có giới hạn" },
      { word: "public transport", translation_vi: "phương tiện công cộng" },
    ],
    vietnameseLearnerNotes: "Email ngắn gọn nhưng chứa nhiều chi tiết thực tế. Chú ý thông tin về giờ giấc, yêu cầu khi vào cửa, và lý do khuyến khích dùng xe buýt. Các câu hỏi thường kiểm tra khả năng tìm thông tin cụ thể (scanning).",
  },
  {
    id: "vstep_b1_reading_library_notice",
    level: "B1",
    section: "notice",
    title_en: "Library Closure Notice",
    title_vi: "Thông báo đóng cửa thư viện",
    passage:
      "IMPORTANT NOTICE\n\nLibrary Renovation\n\nThe main library building will be closed for renovation from Monday, 3rd August to Friday, 28th August.\n\nDuring this period:\n- All books must be returned before the closure date.\n- The study area on the ground floor will remain open from 9:00 AM to 5:00 PM.\n- Books can be requested online and collected from the temporary desk on the ground floor.\n- The computer lab will not be available.\n\nWe apologize for any inconvenience. For more information, please contact the library office at extension 245.\n\nLibrary Management",
    questions: [
      { number: 1, question_en: "How long will the library be closed?", question_vi: "Thư viện sẽ đóng cửa trong bao lâu?", options: ["One week", "Two weeks", "Three weeks", "Four weeks"], answer: "D" },
      { number: 2, question_en: "What must be done before the closure date?", question_vi: "Điều gì phải làm trước ngày đóng cửa?", options: ["Pay all fines", "Return all books", "Renew all memberships", "Sign a form"], answer: "B" },
      { number: 3, question_en: "What will remain open during the renovation?", question_vi: "Cái gì vẫn mở trong thời gian sửa chữa?", options: ["The computer lab", "The top floor", "The ground floor study area", "The entire building"], answer: "C" },
      { number: 4, question_en: "How can patrons get more information?", question_vi: "Độc giả có thể lấy thêm thông tin bằng cách nào?", options: ["Visit the website", "Email the director", "Call extension 245", "Write a letter"], answer: "C" },
    ],
    difficulty: "easy",
    vocabulary: [
      { word: "renovation", translation_vi: "cải tạo, sửa chữa" },
      { word: "temporary", translation_vi: "tạm thời" },
      { word: "inconvenience", translation_vi: "sự bất tiện" },
      { word: "extension", translation_vi: "số máy lẻ" },
    ],
    vietnameseLearnerNotes: "Thông báo dạng notice có cấu trúc rõ ràng với các mục liệt kê. Người Việt thường bỏ qua các chi tiết trong danh sách — hãy đọc từng gạch đầu dòng. Từ 'during this period' báo hiệu phần chi tiết quan trọng.",
  },
  {
    id: "vstep_b1_reading_short_article_park",
    level: "B1",
    section: "short_article",
    title_en: "New Park Opening",
    title_vi: "Khai trương công viên mới",
    passage:
      "A new community park opened yesterday in the western district of the city. The park, which covers an area of five hectares, includes a children's playground, a small lake, and over 200 newly planted trees. The project cost approximately two million dollars and was funded jointly by the city council and a local charity.\n\nLocal residents have welcomed the new green space. Maria Santos, who lives nearby, said: 'We have been waiting for a park like this for years. My children now have a safe place to play.' The park is open daily from 6:00 AM to 10:00 PM. At night, solar-powered lights illuminate the walking paths.\n\nCity officials hope the park will encourage more outdoor activities and improve air quality in the neighborhood.",
    questions: [
      { number: 1, question_en: "Where is the new park located?", question_vi: "Công viên mới nằm ở đâu?", options: ["Eastern district", "Western district", "Northern district", "Southern district"], answer: "B" },
      { number: 2, question_en: "How much did the park project cost?", question_vi: "Dự án công viên tiêu tốn bao nhiêu?", options: ["$1 million", "$2 million", "$3 million", "$5 million"], answer: "B" },
      { number: 3, question_en: "Who funded the project?", question_vi: "Ai đã tài trợ cho dự án?", options: ["The city council alone", "A local charity alone", "The city council and a local charity", "The national government"], answer: "C" },
      { number: 4, question_en: "What type of lights are used at night?", question_vi: "Loại đèn nào được sử dụng vào ban đêm?", options: ["Electric lights", "Solar-powered lights", "Gas lamps", "LED strips"], answer: "B" },
    ],
    difficulty: "easy",
    vocabulary: [
      { word: "hectares", translation_vi: "héc-ta (đơn vị đo diện tích)" },
      { word: "funded", translation_vi: "được tài trợ" },
      { word: "illuminate", translation_vi: "chiếu sáng" },
      { word: "air quality", translation_vi: "chất lượng không khí" },
    ],
    vietnameseLearnerNotes: "Bài đọc dạng tin tức ngắn với số liệu cụ thể. Chú ý các con số: diện tích (5 hectares), chi phí ($2 million), giờ mở cửa (6 AM–10 PM). Câu hỏi thường hỏi chính xác các con số này.",
  },
  {
    id: "vstep_b1_reading_email_course",
    level: "B1",
    section: "email",
    title_en: "Course Registration Email",
    title_vi: "Email đăng ký khóa học",
    passage:
      "From: Language Centre\nTo: Sarah Johnson\nSubject: Your English Course Registration\n\nDear Sarah,\n\nThank you for registering for the Intermediate English course. Your registration has been confirmed.\n\nHere are the course details:\n- Course: Intermediate English (Level B1)\n- Start date: Monday, 10th September\n- Schedule: Mondays and Wednesdays, 6:00 PM to 8:00 PM\n- Duration: 12 weeks\n- Room: Building C, Room 304\n- Course fee: $480 (payment due by 5th September)\n\nPlease bring a notebook and a pen to the first class. The course textbook, English File Intermediate, can be purchased from the campus bookstore for $35.\n\nIf you have any questions, please reply to this email or call us at 555-0198.\n\nKind regards,\nLanguage Centre Team",
    questions: [
      { number: 1, question_en: "What level is the course Sarah registered for?", question_vi: "Sarah đã đăng ký khóa học cấp độ nào?", options: ["Beginner", "Elementary", "Intermediate", "Advanced"], answer: "C" },
      { number: 2, question_en: "On which days will the classes take place?", question_vi: "Các buổi học sẽ diễn ra vào những ngày nào?", options: ["Tuesdays and Thursdays", "Mondays and Wednesdays", "Wednesdays and Fridays", "Mondays and Fridays"], answer: "B" },
      { number: 3, question_en: "When is the course fee due?", question_vi: "Học phí phải đóng trước ngày nào?", options: ["1st September", "5th September", "10th September", "12th September"], answer: "B" },
      { number: 4, question_en: "Where can students buy the textbook?", question_vi: "Sinh viên có thể mua sách giáo khoa ở đâu?", options: ["Online", "The campus bookstore", "The library", "From the teacher"], answer: "B" },
    ],
    difficulty: "easy",
    vocabulary: [
      { word: "registration", translation_vi: "đăng ký" },
      { word: "duration", translation_vi: "thời lượng" },
      { word: "fee", translation_vi: "học phí" },
      { word: "textbook", translation_vi: "sách giáo khoa" },
    ],
    vietnameseLearnerNotes: "Email xác nhận đăng ký là dạng bài đọc thực tế cao. Chú ý phân biệt start date (ngày bắt đầu) và payment due date (hạn thanh toán). Từ 'confirmed' là đã xác nhận — không cần làm gì thêm.",
  },
  {
    id: "vstep_b1_reading_notice_rules",
    level: "B1",
    section: "notice",
    title_en: "Gym Rules Notice",
    title_vi: "Thông báo nội quy phòng gym",
    passage:
      "FITNESS CENTRE RULES\n\nTo ensure a safe and enjoyable experience for all members, please follow these rules:\n\n1. Always carry your membership card. Entry without a valid card is not permitted.\n2. Appropriate sportswear and trainers must be worn at all times. Jeans and sandals are not allowed in the exercise area.\n3. Please wipe down equipment after use. Cleaning sprays and towels are provided at every station.\n4. The maximum time on cardio machines during peak hours (5:00 PM – 7:00 PM) is 30 minutes.\n5. Lockers are available free of charge. Please do not leave valuables unattended.\n6. The last entry is 30 minutes before closing time.\n\nFailure to follow these rules may result in suspension of membership.\n\nThank you for your cooperation.\n\n— Fitness Centre Management",
    questions: [
      { number: 1, question_en: "What is required to enter the fitness centre?", question_vi: "Cần gì để vào trung tâm thể hình?", options: ["A passport", "A membership card", "A driver's license", "A credit card"], answer: "B" },
      { number: 2, question_en: "What type of clothing is NOT allowed?", question_vi: "Loại trang phục nào KHÔNG được phép?", options: ["Shorts and T-shirt", "Sportswear and trainers", "Jeans and sandals", "Tracksuits"], answer: "C" },
      { number: 3, question_en: "How long can members use cardio machines during peak hours?", question_vi: "Thành viên được sử dụng máy cardio bao lâu trong giờ cao điểm?", options: ["15 minutes", "20 minutes", "30 minutes", "45 minutes"], answer: "C" },
      { number: 4, question_en: "What could happen if members break the rules?", question_vi: "Điều gì có thể xảy ra nếu thành viên vi phạm nội quy?", options: ["They pay a fine", "Their membership may be suspended", "They are banned permanently", "They receive a warning letter"], answer: "B" },
    ],
    difficulty: "easy",
    vocabulary: [
      { word: "permitted", translation_vi: "được phép" },
      { word: "appropriate", translation_vi: "phù hợp" },
      { word: "valuables", translation_vi: "đồ có giá trị" },
      { word: "suspension", translation_vi: "đình chỉ" },
    ],
    vietnameseLearnerNotes: "Nội quy dạng danh sách đánh số — dễ đọc nhưng cũng dễ bỏ qua chi tiết. Chú ý phân biệt 'must' (bắt buộc) và 'should' (nên). Từ 'peak hours' là giờ cao điểm.",
  },
  {
    id: "vstep_b1_reading_article_volunteer",
    level: "B1",
    section: "short_article",
    title_en: "Volunteer Day Article",
    title_vi: "Bài báo về Ngày Tình nguyện",
    passage:
      "More than 300 volunteers took part in the annual City Clean-Up Day last Saturday. The event, organized by the Green City Group, covered 15 locations across the city, including parks, riverbanks, and public squares.\n\nVolunteers collected over two tonnes of litter in just six hours. Plastic bottles and food wrappers were the most common items found. The collected waste was sorted into recyclable and non-recyclable materials before being sent to the city's waste processing centre.\n\nEmma Collins, the event coordinator, said she was delighted with the turnout. 'Every year, more people join us. It shows that our community really cares about the environment,' she told reporters.\n\nThe Green City Group has announced that the next clean-up event will take place in October and encouraged residents to register early on their website.",
    questions: [
      { number: 1, question_en: "How many volunteers participated in the event?", question_vi: "Có bao nhiêu tình nguyện viên tham gia sự kiện?", options: ["About 200", "More than 300", "Exactly 250", "Nearly 400"], answer: "B" },
      { number: 2, question_en: "How much litter was collected?", question_vi: "Bao nhiêu rác đã được thu gom?", options: ["One tonne", "Two tonnes", "Three tonnes", "Five tonnes"], answer: "B" },
      { number: 3, question_en: "What were the most common items found?", question_vi: "Những vật phẩm phổ biến nhất được tìm thấy là gì?", options: ["Glass bottles", "Plastic bottles and food wrappers", "Newspapers", "Metal cans"], answer: "B" },
      { number: 4, question_en: "When will the next clean-up event take place?", question_vi: "Sự kiện dọn dẹp tiếp theo sẽ diễn ra khi nào?", options: ["September", "October", "November", "December"], answer: "B" },
    ],
    difficulty: "moderate",
    vocabulary: [
      { word: "litter", translation_vi: "rác thải" },
      { word: "recyclable", translation_vi: "có thể tái chế" },
      { word: "turnout", translation_vi: "số người tham gia" },
      { word: "coordinator", translation_vi: "điều phối viên" },
    ],
    vietnameseLearnerNotes: "Bài báo về sự kiện cộng đồng có cấu trúc: số liệu → chi tiết → trích dẫn → thông báo tiếp theo. Chú ý câu hỏi về cảm xúc/thái độ (delighted = very happy).",
  },
  {
    id: "vstep_b2_reading_academic_climate",
    level: "B2",
    section: "academic_text",
    title_en: "Climate Change and Migration",
    title_vi: "Biến đổi khí hậu và di cư",
    passage:
      "Climate change is increasingly recognized as a significant driver of human migration. According to the Internal Displacement Monitoring Centre, weather-related disasters displaced an average of 21.5 million people annually between 2008 and 2020. This figure is projected to rise as extreme weather events become more frequent and intense.\n\nHowever, the relationship between climate change and migration is complex and rarely direct. Most climate-related migration occurs within national borders rather than across them, and it is often temporary rather than permanent. Economic factors, social networks, and government policies all influence whether and where people move. Researchers emphasize that climate is rarely the sole cause of migration but rather acts as a threat multiplier, exacerbating existing vulnerabilities.\n\nPolicymakers face the challenge of distinguishing between voluntary migration and forced displacement. International law currently offers limited protection to those displaced by environmental factors, as the 1951 Refugee Convention does not recognize climate as a basis for refugee status.",
    questions: [
      { number: 1, question_en: "How many people were displaced annually by weather disasters according to the text?", question_vi: "Theo bài đọc, trung bình mỗi năm có bao nhiêu người phải di dời vì thiên tai?", options: ["10.5 million", "15.2 million", "21.5 million", "30 million"], answer: "C" },
      { number: 2, question_en: "Where does most climate-related migration occur?", question_vi: "Hầu hết di cư liên quan đến khí hậu xảy ra ở đâu?", options: ["Across international borders", "Within national borders", "From south to north", "From rural to urban areas"], answer: "B" },
      { number: 3, question_en: "How does the text describe climate's role in migration?", question_vi: "Bài đọc mô tả vai trò của khí hậu trong di cư như thế nào?", options: ["The sole cause", "A minor factor", "A threat multiplier", "Irrelevant"], answer: "C" },
      { number: 4, question_en: "Why does international law offer limited protection to climate migrants?", question_vi: "Tại sao luật pháp quốc tế chỉ bảo vệ hạn chế cho người di cư vì khí hậu?", options: ["Because they move voluntarily", "Because the UN does not care", "Because the 1951 Refugee Convention does not include climate reasons", "Because there are too many climate migrants"], answer: "C" },
    ],
    difficulty: "challenging",
    vocabulary: [
      { word: "displacement", translation_vi: "sự di dời, mất nơi ở" },
      { word: "exacerbating", translation_vi: "làm trầm trọng thêm" },
      { word: "vulnerabilities", translation_vi: "những điểm dễ bị tổn thương" },
      { word: "voluntary", translation_vi: "tự nguyện" },
    ],
    vietnameseLearnerNotes: "Bài đọc học thuật B2 với cấu trúc phức tạp: mở đầu bằng số liệu → giải thích sự phức tạp → kết luận chính sách. Từ 'however' đánh dấu sự chuyển ý quan trọng. Cụm 'threat multiplier' (yếu tố nhân lên mối đe dọa) là thuật ngữ học thuật.",
  },
  {
    id: "vstep_b2_reading_opinion_remote_work",
    level: "B2",
    section: "opinion_piece",
    title_en: "Opinion: The Future of Offices",
    title_vi: "Góc nhìn: Tương lai của văn phòng",
    passage:
      "Three years after the pandemic forced millions of workers into remote arrangements, the debate about the future of the office remains unsettled. Some companies have mandated a full return to the workplace, arguing that in-person collaboration is essential for innovation and company culture. Others have embraced hybrid or fully remote models, citing employee satisfaction and reduced overhead costs.\n\nIn my view, the debate is framed incorrectly. The question should not be 'office or home' but rather 'what type of work benefits from physical proximity and what type does not.' Routine, individual tasks are often performed more efficiently at home. Creative brainstorming sessions, difficult negotiations, and mentorship conversations, on the other hand, gain significantly from face-to-face interaction.\n\nI believe the most successful organizations will be those that design their work around the nature of the task, not around a fixed location. The office of the future should be a collaboration hub, not a daily attendance requirement. This requires a more sophisticated approach to management — one that judges output rather than hours spent at a desk.",
    questions: [
      { number: 1, question_en: "What is the author's main argument?", question_vi: "Lập luận chính của tác giả là gì?", options: ["Everyone should return to the office", "Everyone should work from home", "Work design should depend on the type of task", "Offices should be closed permanently"], answer: "C" },
      { number: 2, question_en: "What does the author say about routine individual tasks?", question_vi: "Tác giả nói gì về các công việc cá nhân thường ngày?", options: ["They are better done at the office", "They are better done at home", "They should be eliminated", "They require constant supervision"], answer: "B" },
      { number: 3, question_en: "What does the author suggest the office should become?", question_vi: "Tác giả gợi ý văn phòng nên trở thành gì?", options: ["A daily requirement", "A collaboration hub", "A storage space", "A social club"], answer: "B" },
      { number: 4, question_en: "What management approach does the author advocate?", question_vi: "Tác giả ủng hộ cách tiếp cận quản lý nào?", options: ["Judging hours spent at a desk", "Judging output rather than hours", "Strict monitoring", "No management at all"], answer: "B" },
    ],
    difficulty: "moderate",
    vocabulary: [
      { word: "mandated", translation_vi: "ra lệnh, bắt buộc" },
      { word: "overhead costs", translation_vi: "chi phí vận hành" },
      { word: "proximity", translation_vi: "sự gần gũi về không gian" },
      { word: "sophisticated", translation_vi: "tinh vi, phức tạp" },
    ],
    vietnameseLearnerNotes: "Bài opinion piece có giọng văn cá nhân (in my view, I believe). Chú ý phân biệt ý kiến tác giả (what the author thinks) với sự thật khách quan (what is stated as fact). Cụm 'on the other hand' là tín hiệu đối lập quan trọng.",
  },
  {
    id: "vstep_b2_reading_report_energy",
    level: "B2",
    section: "report",
    title_en: "Renewable Energy Report",
    title_vi: "Báo cáo về năng lượng tái tạo",
    passage:
      "This report presents findings from a nationwide survey on renewable energy adoption conducted by the National Energy Agency between January and March 2024. The survey gathered responses from 2,500 households and 500 businesses across all regions of the country.\n\nKey findings include: First, 68 percent of households reported using at least some form of renewable energy, up from 45 percent in 2019. Solar panels were the most common technology, installed by 52 percent of respondents. Second, cost remains the primary barrier to wider adoption. Among households that had not adopted any renewable technology, 71 percent cited installation costs as the main reason. Third, business respondents expressed strong interest in government subsidies, with 83 percent stating that financial incentives would significantly influence their decision to invest in renewable energy.\n\nThe report recommends increasing the current subsidy program from 20 percent to 35 percent of installation costs and introducing a low-interest loan scheme for low-income households.",
    questions: [
      { number: 1, question_en: "What percentage of households used renewable energy in 2024?", question_vi: "Tỷ lệ hộ gia đình sử dụng năng lượng tái tạo năm 2024 là bao nhiêu?", options: ["45%", "52%", "68%", "83%"], answer: "C" },
      { number: 2, question_en: "What was the most common renewable technology?", question_vi: "Công nghệ tái tạo phổ biến nhất là gì?", options: ["Wind turbines", "Solar panels", "Hydroelectric systems", "Biomass heaters"], answer: "B" },
      { number: 3, question_en: "What was the main barrier to wider adoption?", question_vi: "Rào cản chính đối với việc áp dụng rộng rãi là gì?", options: ["Lack of information", "Installation costs", "Government regulation", "Space limitations"], answer: "B" },
      { number: 4, question_en: "What does the report recommend for the subsidy program?", question_vi: "Báo cáo khuyến nghị gì về chương trình trợ cấp?", options: ["Remove it entirely", "Keep it at 20%", "Increase it to 35%", "Increase it to 50%"], answer: "C" },
    ],
    difficulty: "moderate",
    vocabulary: [
      { word: "adoption", translation_vi: "sự áp dụng, chấp nhận" },
      { word: "subsidies", translation_vi: "trợ cấp" },
      { word: "incentives", translation_vi: "ưu đãi, khuyến khích" },
      { word: "loan scheme", translation_vi: "chương trình cho vay" },
    ],
    vietnameseLearnerNotes: "Báo cáo có cấu trúc chuẩn: giới thiệu → phát hiện chính → khuyến nghị. Chú ý các con số phần trăm: 68% (hiện tại), 45% (2019), 71% (rào cản), 83% (quan tâm), 20%→35% (khuyến nghị).",
  },
  {
    id: "vstep_b2_reading_academic_memory",
    level: "B2",
    section: "academic_text",
    title_en: "The Science of Memory",
    title_vi: "Khoa học về trí nhớ",
    passage:
      "Memory is not a single, unified system but rather a collection of distinct processes that serve different functions. Psychologists broadly distinguish between short-term memory, which holds information for a matter of seconds, and long-term memory, which can store information indefinitely. Within long-term memory, a further distinction is made between explicit memory (conscious recall of facts and events) and implicit memory (unconscious skills such as riding a bicycle).\n\nResearch has shown that sleep plays a crucial role in memory consolidation — the process by which temporary memories are transformed into more stable, long-term representations. During deep sleep, the brain replays the day's experiences, strengthening important connections and weakening irrelevant ones. Studies have demonstrated that students who sleep after studying retain significantly more information than those who remain awake for an equivalent period.\n\nThis has practical implications for education. Rather than encouraging students to study for long, uninterrupted hours, educators might achieve better outcomes by spacing learning sessions and emphasizing the importance of adequate sleep.",
    questions: [
      { number: 1, question_en: "What distinction is made within long-term memory?", question_vi: "Sự phân biệt nào được thực hiện trong trí nhớ dài hạn?", options: ["Visual and auditory", "Explicit and implicit", "Fast and slow", "Active and passive"], answer: "B" },
      { number: 2, question_en: "What role does sleep play in memory?", question_vi: "Giấc ngủ đóng vai trò gì trong trí nhớ?", options: ["It erases memories", "It consolidates memories", "It creates new memories", "It has no effect"], answer: "B" },
      { number: 3, question_en: "What happens during deep sleep according to the text?", question_vi: "Theo bài đọc, điều gì xảy ra trong giấc ngủ sâu?", options: ["The brain shuts down", "The brain replays experiences", "The brain only rests", "The brain creates dreams"], answer: "B" },
      { number: 4, question_en: "What educational implication does the text suggest?", question_vi: "Bài đọc gợi ý hàm ý giáo dục gì?", options: ["Longer study hours", "Spacing learning and adequate sleep", "More homework", "Less sleep, more study"], answer: "B" },
    ],
    difficulty: "challenging",
    vocabulary: [
      { word: "consolidation", translation_vi: "sự củng cố" },
      { word: "indefinitely", translation_vi: "vô thời hạn" },
      { word: "implications", translation_vi: "hàm ý, hệ quả" },
      { word: "spacing", translation_vi: "giãn cách (thời gian)" },
    ],
    vietnameseLearnerNotes: "Bài đọc khoa học với nhiều thuật ngữ chuyên ngành. Từ 'consolidation' là từ khóa chính — xuất hiện trong cả câu hỏi lẫn đáp án. Chú ý cấu trúc: 'Rather than X, Y' (thay vì X, hãy Y) trong đoạn cuối.",
  },
  {
    id: "vstep_b2_reading_opinion_social_media",
    level: "B2",
    section: "opinion_piece",
    title_en: "Opinion: Social Media and Teen Mental Health",
    title_vi: "Góc nhìn: Mạng xã hội và sức khỏe tâm thần thanh thiếu niên",
    passage:
      "The relationship between social media use and teenage mental health has become one of the most contested topics in public health. On one side, researchers point to rising rates of anxiety and depression among adolescents, which correlate closely with the spread of smartphones and social media platforms. On the other side, critics argue that correlation is not causation, and that other factors — such as academic pressure and economic uncertainty — may be driving the trend.\n\nIn my assessment, the evidence for harm is now strong enough that we should act, even if the precise causal mechanisms are still being studied. Waiting for perfect evidence while a generation grows up in an uncontrolled experiment is not a neutral position — it is a decision with consequences of its own.\n\nI propose three practical measures. First, social media platforms should be required to disable auto-play and infinite scroll for users under 18. Second, schools should incorporate digital literacy into their curriculum from an early age. Third, parents should be provided with evidence-based guidance on managing screen time, rather than being left to navigate this issue alone. None of these measures would ban social media, but together they could significantly reduce its potential harms.",
    questions: [
      { number: 1, question_en: "What trend correlates with social media use according to some researchers?", question_vi: "Xu hướng nào tương quan với việc sử dụng mạng xã hội theo một số nhà nghiên cứu?", options: ["Improved grades", "Rising anxiety and depression", "Better physical health", "More friendships"], answer: "B" },
      { number: 2, question_en: "What counter-argument does the text mention?", question_vi: "Bài đọc đề cập đến phản biện nào?", options: ["Social media is good for teens", "Correlation is not causation", "Teens don't use social media", "The evidence is perfect"], answer: "B" },
      { number: 3, question_en: "How many practical measures does the author propose?", question_vi: "Tác giả đề xuất bao nhiêu biện pháp thực tế?", options: ["Two", "Three", "Four", "Five"], answer: "B" },
      { number: 4, question_en: "What does the author say about waiting for perfect evidence?", question_vi: "Tác giả nói gì về việc chờ đợi bằng chứng hoàn hảo?", options: ["It is the right thing to do", "It is a decision with consequences", "It is required by law", "It is the scientific method"], answer: "B" },
    ],
    difficulty: "moderate",
    vocabulary: [
      { word: "contested", translation_vi: "gây tranh cãi" },
      { word: "causal mechanisms", translation_vi: "cơ chế nhân quả" },
      { word: "digital literacy", translation_vi: "hiểu biết về kỹ thuật số" },
      { word: "infinite scroll", translation_vi: "cuộn trang vô tận" },
    ],
    vietnameseLearnerNotes: "Bài opinion piece có cấu trúc lập luận chặt chẽ: vấn đề → phản biện → quan điểm tác giả → đề xuất. Chú ý giọng văn: 'in my assessment' (theo đánh giá của tôi) và các biện pháp được đánh số rõ ràng.",
  },
  {
    id: "vstep_b2_reading_report_tourism",
    level: "B2",
    section: "report",
    title_en: "Tourism Impact Report",
    title_vi: "Báo cáo tác động du lịch",
    passage:
      "The Tourism Impact Assessment, commissioned by the Ministry of Tourism, examines the economic, environmental, and social effects of the rapid growth in international tourism over the past decade. International arrivals have increased from 5 million in 2010 to 18 million in 2024, making tourism the second-largest sector of the national economy.\n\nEconomically, the benefits are clear. The sector now accounts for 12 percent of GDP and employs approximately 1.2 million people directly. However, the environmental costs are becoming increasingly apparent. Popular destinations are experiencing water shortages during peak seasons, and waste management infrastructure has struggled to keep pace with visitor numbers. Three major beach destinations have reported a 40 percent decline in coral reef health over the past five years, which scientists attribute partly to tourism-related pollution.\n\nThe report concludes that the current model of mass tourism is environmentally unsustainable and recommends a shift toward higher-value, lower-volume tourism. Specific recommendations include introducing visitor caps at sensitive sites, increasing the tourism tax from 5 to 15 dollars per visitor, and investing the additional revenue in conservation projects.",
    questions: [
      { number: 1, question_en: "How many international arrivals were there in 2024?", question_vi: "Có bao nhiêu lượt khách quốc tế đến vào năm 2024?", options: ["5 million", "10 million", "18 million", "25 million"], answer: "C" },
      { number: 2, question_en: "What percentage of GDP does tourism account for?", question_vi: "Du lịch chiếm bao nhiêu phần trăm GDP?", options: ["5%", "8%", "12%", "15%"], answer: "C" },
      { number: 3, question_en: "What environmental problem is mentioned?", question_vi: "Vấn đề môi trường nào được đề cập?", options: ["Air pollution in cities", "Water shortages and coral reef decline", "Deforestation", "Oil spills"], answer: "B" },
      { number: 4, question_en: "What does the report recommend for the tourism tax?", question_vi: "Báo cáo khuyến nghị gì về thuế du lịch?", options: ["Remove it", "Keep it at $5", "Increase it to $15", "Increase it to $25"], answer: "C" },
    ],
    difficulty: "moderate",
    vocabulary: [
      { word: "commissioned", translation_vi: "được ủy quyền thực hiện" },
      { word: "infrastructure", translation_vi: "cơ sở hạ tầng" },
      { word: "unsustainable", translation_vi: "không bền vững" },
      { word: "caps", translation_vi: "giới hạn, trần" },
    ],
    vietnameseLearnerNotes: "Báo cáo ngành với cấu trúc: số liệu → lợi ích → chi phí môi trường → khuyến nghị. Chú ý sự tương phản giữa lợi ích kinh tế (GDP, việc làm) và chi phí môi trường (nước, rạn san hô). Từ 'however' là từ khóa chuyển ý.",
  },
];
