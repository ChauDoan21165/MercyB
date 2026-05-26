// src/data/mock-interviews/scenarios.ts
//
// Step 7 (AI Teacher v2) — hand-crafted mock-interview scenarios.
//
// Five scenarios were chosen to mirror real Vietnamese-diaspora job
// realities (US, Australia, Canada). The "tech support" and "office
// admin" tracks reach for the upskilling crowd; "restaurant," "nail
// salon," and "tutor" cover the existing-trade crowd that needs
// English to deal with customers, supervisors, and tax/legal forms.
//
// Tone:
//   - Vietnamese (`*_vi`) is the primary surface — the learner will
//     usually open the page and read VN first to orient. English
//     (`*_en`) is the practice target.
//   - `what_to_listen_for` is VN-language coaching the UI shows AFTER
//     the learner submits an answer ("things a real interviewer
//     listens for"). Not a grammar checklist — it's interview-craft.
//   - `common_mistakes_vi` ties to L1 weakness tags so we can later
//     route a learner from a flagged mistake into the matching
//     micro-lesson (out of scope for this PR).
//
// Adding a new scenario:
//   1. Add an entry to SCENARIOS keyed by slug (kebab-case).
//   2. Slug must be URL-safe — it appears in /interview/:slug.
//   3. 5–8 questions per scenario; tested in scenarios.test.ts.
//   4. Every text field must be non-empty (VN AND EN).
//   5. Hand-craft. Do not LLM-generate the content — we want
//      teacher-warm voice that matches MercyBlade's other surfaces.

export type InterviewIndustry =
  | "tech"
  | "service"
  | "retail"
  | "medical"
  | "general";

export type InterviewDifficulty = "A2" | "B1" | "B2";

export interface InterviewQuestion {
  /** The English prompt the interviewer would say. */
  prompt_en: string;
  /** Vietnamese translation / paraphrase so the learner can prepare. */
  prompt_vi: string;
  /** A natural, short, native-sounding model answer in English. */
  sample_answer_en: string;
  /** Vietnamese gloss of the model answer — bilingual study mode. */
  sample_answer_vi: string;
  /** VN-language coaching: what a real interviewer is listening for. */
  what_to_listen_for: string[];
  /** L1-rooted mistakes a Vietnamese speaker typically makes here. */
  common_mistakes_vi: string[];
}

export interface InterviewScenario {
  /** URL-safe identifier used in /interview/:slug. */
  slug: string;
  title_vi: string;
  title_en: string;
  industry: InterviewIndustry;
  difficulty: InterviewDifficulty;
  /** 1–2 sentence VN intro framing why this interview matters. */
  intro_vi: string;
  /** 1–2 sentence EN intro mirroring the VN. */
  intro_en: string;
  questions: InterviewQuestion[];
  /** What a Mercy review looks at. Surface in summary screen. */
  evaluation_criteria: string[];
}

// ──────────────────────────────────────────────────────────────────────
// Scenarios
// ──────────────────────────────────────────────────────────────────────

const TECH_SUPPORT: InterviewScenario = {
  slug: "tech-support-helpdesk",
  title_vi: "Hỗ trợ kỹ thuật — Helpdesk cấp 1",
  title_en: "Tech support — first-tier helpdesk",
  industry: "tech",
  difficulty: "B1",
  intro_vi:
    "Bạn đang phỏng vấn cho vị trí helpdesk cấp 1 — trả lời điện thoại, hướng dẫn người dùng reset password, mở ticket. Người phỏng vấn sẽ xem bạn có nói rõ ràng dưới áp lực, có chịu hỏi lại để hiểu đúng vấn đề hay không.",
  intro_en:
    "You're interviewing for a first-tier helpdesk role — phones, password resets, opening tickets. The interviewer is checking whether you stay clear under pressure and ask clarifying questions before guessing.",
  questions: [
    {
      prompt_en: "Tell me about yourself in one minute.",
      prompt_vi: "Bạn hãy giới thiệu về bản thân trong khoảng một phút.",
      sample_answer_en:
        "I'm Lan. I've worked in customer support for two years, mostly over chat and email. I'm comfortable with Windows, basic networking, and ticketing tools like Jira. I enjoy figuring out what a user really needs — even when they describe the problem in non-technical words.",
      sample_answer_vi:
        "Em tên Lan. Em đã làm hỗ trợ khách hàng hai năm, chủ yếu qua chat và email. Em quen với Windows, mạng cơ bản, và các công cụ ticket như Jira. Em thích tìm ra điều người dùng thực sự cần — kể cả khi họ mô tả vấn đề bằng từ ngữ không kỹ thuật.",
      what_to_listen_for: [
        "Mở đầu chắc, không lan man.",
        "Có ví dụ cụ thể (Windows, Jira) chứ không chỉ tính từ chung chung.",
        "Kết thúc bằng một câu nói được giá trị bạn mang lại.",
      ],
      common_mistakes_vi: [
        "Bỏ động từ to be: 'I two years experience' → 'I have two years of experience'.",
        "Quên -s số nhiều: 'two year' → 'two years'.",
        "Dùng 'good' khi nên dùng 'comfortable' hoặc 'familiar' — nghe trẻ con.",
      ],
    },
    {
      prompt_en:
        "A user says, 'My computer is broken.' What's your next step?",
      prompt_vi:
        "Người dùng nói 'Máy tính tôi bị hỏng'. Bước tiếp theo của bạn là gì?",
      sample_answer_en:
        "I'd ask one short clarifying question first — for example, 'Can you tell me what happens when you turn it on?' — before guessing. A vague problem usually means the user doesn't know the technical word. My job is to translate.",
      sample_answer_vi:
        "Em sẽ hỏi một câu làm rõ ngắn gọn trước — ví dụ 'Anh/chị có thể tả lại điều gì xảy ra khi bật máy không?' — trước khi đoán. Vấn đề mơ hồ thường có nghĩa là người dùng chưa có từ kỹ thuật để diễn tả. Nhiệm vụ của em là dịch lại cho rõ.",
      what_to_listen_for: [
        "Có hỏi lại trước khi đoán không?",
        "Câu hỏi có mở (open-ended) không, hay chỉ yes/no?",
        "Có thể hiện được sự kiên nhẫn không?",
      ],
      common_mistakes_vi: [
        "Câu hỏi không có trợ động từ: 'You see error?' → 'Do you see an error?'",
        "Thiếu mạo từ: 'see error' → 'see an error message'.",
      ],
    },
    {
      prompt_en:
        "How do you handle an angry customer who keeps interrupting you?",
      prompt_vi: "Bạn xử lý thế nào khi khách hàng nóng giận và liên tục cắt ngang?",
      sample_answer_en:
        "I let them finish their sentence first — interrupting back makes it worse. Then I summarise what they said in my own words so they know I heard them. Once they feel heard, ninety percent of the heat is gone, and we can move to the actual fix.",
      sample_answer_vi:
        "Em để họ nói hết câu trước — cắt lại chỉ làm họ nóng hơn. Sau đó em tóm tắt lại bằng lời của em để họ biết em đã nghe. Khi họ cảm thấy được lắng nghe, chín mươi phần trăm cơn nóng đã hạ, và mình mới chuyển sang sửa vấn đề được.",
      what_to_listen_for: [
        "Không thể hiện sự đối đầu — không 'you' đổ lỗi.",
        "Có nói tới khâu xác nhận đã nghe (paraphrase) không?",
        "Có giữ kế hoạch hành động cụ thể ở cuối không?",
      ],
      common_mistakes_vi: [
        "Dùng 'they' số ít sai số: 'they is angry' → 'they are angry' (số nhiều), hoặc 'he/she is angry' (số ít).",
        "'I will let they finish' → 'I'll let them finish' (object pronoun).",
      ],
    },
    {
      prompt_en:
        "Describe a time you didn't know the answer to a customer's problem. What did you do?",
      prompt_vi:
        "Hãy kể một lần bạn không biết câu trả lời cho vấn đề của khách. Bạn đã làm gì?",
      sample_answer_en:
        "Last year a user reported an outage I'd never seen. I told them honestly, 'I haven't seen this before, but let me check with my team and get back to you in fifteen minutes.' I then escalated to a senior engineer, learned the cause, and called the user back inside that window. Honesty plus a deadline kept their trust.",
      sample_answer_vi:
        "Năm ngoái một khách báo lỗi mà em chưa gặp. Em nói thẳng 'Em chưa thấy lỗi này, để em hỏi đội rồi gọi lại trong mười lăm phút.' Em chuyển lên kỹ sư chính, học được nguyên nhân, rồi gọi lại đúng giờ hứa. Trung thực cộng với hạn rõ ràng giữ được niềm tin của khách.",
      what_to_listen_for: [
        "Có dám nói 'I don't know' không?",
        "Có hứa khoảng thời gian cụ thể không (deadline)?",
        "Có học được điều gì từ tình huống đó không?",
      ],
      common_mistakes_vi: [
        "Thì quá khứ thiếu -ed: 'last year I escalate' → 'last year I escalated'.",
        "Dùng 'will' trong câu kể: 'I will told the user' — phải 'I told the user'.",
      ],
    },
    {
      prompt_en:
        "You see two tickets in your queue: one urgent from a senior executive, and one from a regular user that came in earlier. Which do you take first?",
      prompt_vi:
        "Bạn có hai ticket: một khẩn từ giám đốc, một từ nhân viên thường đến trước. Bạn xử lý cái nào trước?",
      sample_answer_en:
        "It depends on impact, not title. If the executive ticket blocks a meeting starting in ten minutes, that wins. If both are at the same urgency, I take the older one first — fairness matters and seniors see it. I'd also tell the executive an honest ETA.",
      sample_answer_vi:
        "Phụ thuộc vào tác động, không phải chức danh. Nếu ticket của giám đốc đang chặn cuộc họp bắt đầu trong mười phút, thì đó ưu tiên. Nếu cả hai cùng mức khẩn, em làm cái đến trước — công bằng quan trọng và sếp cũng thấy. Em cũng sẽ báo giám đốc thời gian dự kiến rõ ràng.",
      what_to_listen_for: [
        "Có nguyên tắc rõ (impact > title) không?",
        "Có nhắc đến giao tiếp (báo ETA cho cả hai bên) không?",
        "Câu trả lời có thể bảo vệ được trước câu hỏi tiếp theo không?",
      ],
      common_mistakes_vi: [
        "'depend' → 'depends' (chia động từ ngôi 3 it).",
        "Dùng 'more' với 'urgent' đã có form so sánh: 'more urgent' đúng, 'more urgenter' sai.",
      ],
    },
    {
      prompt_en: "Why should we hire you over someone with more experience?",
      prompt_vi: "Vì sao chúng tôi nên chọn bạn thay vì người có nhiều kinh nghiệm hơn?",
      sample_answer_en:
        "Experience matters, but I'd say two things. First, I'm coachable — I take feedback fast and don't repeat the same mistake. Second, I genuinely like the messy, undefined problems support work brings. A more senior candidate may want a cleaner role; I want this one.",
      sample_answer_vi:
        "Kinh nghiệm quan trọng, nhưng em xin nói hai điều. Một, em dễ dạy — em nhận feedback nhanh và không lặp lại lỗi cũ. Hai, em thật sự thích những vấn đề rối rắm, chưa rõ của công việc support. Người kinh nghiệm hơn có thể muốn vị trí gọn hơn; em muốn vị trí này.",
      what_to_listen_for: [
        "Có nhận khuyết điểm (ít kinh nghiệm hơn) một cách trung thực không?",
        "Có chuyển sang điểm mạnh thật sự, có ví dụ?",
        "Tránh lời sáo rỗng kiểu 'I'm a hard worker'.",
      ],
      common_mistakes_vi: [
        "'someone has more experience' → 'someone with more experience' (giới từ).",
        "'I'm hard worker' → 'I'm a hard worker' (mạo từ).",
      ],
    },
  ],
  evaluation_criteria: [
    "Có cấu trúc trả lời rõ (mở đầu — ví dụ — kết).",
    "Có hỏi làm rõ thay vì đoán.",
    "Trung thực khi không biết, nhưng kèm theo deadline.",
    "Tránh lỗi L1 phổ biến: thiếu to be, sai chia động từ ngôi 3, thiếu mạo từ.",
  ],
};

const RESTAURANT_SERVER: InterviewScenario = {
  slug: "restaurant-server",
  title_vi: "Phục vụ nhà hàng — fast casual",
  title_en: "Restaurant server — fast casual",
  industry: "service",
  difficulty: "A2",
  intro_vi:
    "Bạn xin việc phục vụ ở nhà hàng kiểu fast-casual (Chipotle, Panera, Sweetgreen). Quản lý muốn nghe bạn có thể chào khách, ghi đơn rõ ràng, và xử lý tình huống nhỏ — không cần tiếng Anh học thuật.",
  intro_en:
    "You're applying to wait tables at a fast-casual restaurant (Chipotle, Panera, Sweetgreen). The manager wants to hear you greet a guest cleanly, take an order accurately, and handle small surprises — academic English isn't needed.",
  questions: [
    {
      prompt_en: "How would you greet a customer who just walked in?",
      prompt_vi: "Bạn sẽ chào một khách vừa bước vào như thế nào?",
      sample_answer_en:
        "Hi, welcome in! Is it just the two of you tonight? Right this way.",
      sample_answer_vi:
        "Xin chào, mời quý khách! Bàn cho hai người tối nay phải không ạ? Mời đi lối này.",
      what_to_listen_for: [
        "Giọng tươi, không đọc thuộc lòng.",
        "Có hỏi số người để dẫn bàn đúng không?",
        "Tránh 'thank you very much' đầu câu — nghe rất sách giáo khoa.",
      ],
      common_mistakes_vi: [
        "'Welcome to here' → 'Welcome in' hoặc 'Welcome'.",
        "'How many person?' → 'How many people?' (số nhiều bất quy tắc).",
      ],
    },
    {
      prompt_en: "A customer asks, 'What do you recommend?' What do you say?",
      prompt_vi: "Khách hỏi 'Bạn gợi ý món nào?' Bạn trả lời sao?",
      sample_answer_en:
        "Our chicken bowl is the most popular — fresh, not too spicy. If you like a kick, the spicy beef one is great. Are you good with cilantro?",
      sample_answer_vi:
        "Món chicken bowl ở quán em được khách thích nhất — tươi, không cay lắm. Nếu anh/chị thích cay, món spicy beef rất ngon. Anh/chị ăn được rau ngò không ạ?",
      what_to_listen_for: [
        "Có gợi ý cụ thể, không nói 'everything is good' (mất giá trị).",
        "Có hỏi sở thích để chọn món tốt hơn (cilantro, allergies, spicy)?",
      ],
      common_mistakes_vi: [
        "'Most popular' đúng, 'more popular' không phải câu trả lời cho recommendation.",
        "'You like spicy?' → 'Do you like spicy food?' hoặc 'Do you like it spicy?'",
      ],
    },
    {
      prompt_en:
        "A customer says, 'There's a hair in my food.' What do you do?",
      prompt_vi: "Khách nói 'Đồ ăn có sợi tóc'. Bạn làm gì?",
      sample_answer_en:
        "Oh, I'm so sorry. Let me take that back right away and bring you a fresh one — and I'll talk to my manager about taking it off your bill. Anything else I can get you while you wait?",
      sample_answer_vi:
        "Ồ, em xin lỗi anh/chị. Để em mang ra ngay và đem món mới — em cũng sẽ báo quản lý để bỏ tiền món đó trên hóa đơn. Trong lúc chờ em có thể mang thêm gì cho anh/chị không?",
      what_to_listen_for: [
        "Xin lỗi nhanh, không đổ lỗi cho bếp.",
        "Hành động cụ thể: thay món + báo manager.",
        "Có quan tâm trải nghiệm khách trong lúc chờ không?",
      ],
      common_mistakes_vi: [
        "'Sorry too much' → 'I'm so sorry' / 'I'm really sorry'.",
        "'Take it off the bill' không phải 'remove from the money'.",
      ],
    },
    {
      prompt_en: "Why do you want to work here?",
      prompt_vi: "Vì sao bạn muốn làm ở đây?",
      sample_answer_en:
        "I live close by, so I can be reliable on early shifts. I like that this place is busy — busy means good tips and I learn faster. And the team here always seems friendly when I come in as a customer.",
      sample_answer_vi:
        "Em ở gần đây nên có thể đi ca sáng đều. Em thích quán này đông — đông nghĩa là tip tốt và em học nhanh hơn. Đội ở đây mỗi lần em đến ăn em thấy đều thân thiện.",
      what_to_listen_for: [
        "Có lý do thực tế (gần nhà, tip tốt) — quản lý thích vì đáng tin.",
        "Tránh sáo rỗng 'I love food' / 'I'm a people person'.",
      ],
      common_mistakes_vi: [
        "'I live near' → 'I live nearby' hoặc 'I live close by'.",
        "'busy mean' → 'busy means' (chia động từ).",
      ],
    },
    {
      prompt_en: "Are you available on weekends?",
      prompt_vi: "Bạn có làm được cuối tuần không?",
      sample_answer_en:
        "Yes — I can do Saturdays all day, and Sunday after twelve. I have a class Sunday morning until eleven, but I'm free after that.",
      sample_answer_vi:
        "Dạ — thứ Bảy em làm cả ngày được, Chủ Nhật sau mười hai giờ. Em có lớp sáng Chủ Nhật đến mười một giờ, nhưng sau đó em rảnh.",
      what_to_listen_for: [
        "Trả lời rõ ràng có hoặc không, kèm khung giờ cụ thể.",
        "Trung thực nếu có ràng buộc — quản lý ghét bị ngạc nhiên sau khi tuyển.",
      ],
      common_mistakes_vi: [
        "'I am free on the Sunday' → 'I'm free on Sunday' (không 'the').",
        "'after twelve hour' → 'after twelve' / 'after noon'.",
      ],
    },
  ],
  evaluation_criteria: [
    "Giọng thân thiện, đủ to để khách nghe rõ.",
    "Câu ngắn, gọn, không dùng từ học thuật.",
    "Khi xử lý complaint: xin lỗi + hành động cụ thể + theo dõi.",
    "Trung thực về lịch trống.",
  ],
};

const NAIL_SALON_TECHNICIAN: InterviewScenario = {
  slug: "nail-salon-technician",
  title_vi: "Thợ nail — phỏng vấn chủ tiệm",
  title_en: "Nail salon technician — owner interview",
  industry: "service",
  difficulty: "A2",
  intro_vi:
    "Đây là phỏng vấn thực tế cho cộng đồng người Việt ở Mỹ — chủ tiệm nail muốn nghe bạn nói được tiếng Anh đủ để hiểu khách yêu cầu, tránh hiểu lầm về kiểu/màu sắc, và xử lý khi khách than phiền. Không cần tiếng Anh hoa mỹ — cần đúng và tự tin.",
  intro_en:
    "A realistic interview for the Vietnamese-American community — the salon owner wants you to speak enough English to understand a customer's request, avoid mix-ups on style and color, and handle complaints calmly. Polished English isn't required — accurate and confident is.",
  questions: [
    {
      prompt_en:
        "A customer points at a picture and says, 'I want this exact design.' What do you say back to confirm?",
      prompt_vi:
        "Khách chỉ vào hình và nói 'Tôi muốn đúng kiểu này'. Bạn xác nhận lại sao?",
      sample_answer_en:
        "Got it. So you want the same color, same length, and the small flower on the ring finger only — is that right? It's about forty-five minutes. Sound good?",
      sample_answer_vi:
        "Dạ. Cô muốn cùng màu, cùng độ dài, và bông nhỏ chỉ trên ngón áp út thôi đúng không ạ? Khoảng bốn lăm phút. Cô đồng ý không ạ?",
      what_to_listen_for: [
        "Có nhắc lại từng chi tiết (color, length, design placement) trước khi bắt đầu không?",
        "Có chốt thời gian không? Tránh khách bực vì 'lâu hơn dự kiến'.",
        "Giọng confirm chứ không hỏi lại nhiều lần — khách quý kiểu rõ ràng.",
      ],
      common_mistakes_vi: [
        "'Same like this' → 'The same as this' / 'Like this'.",
        "'Forty-five minute' → 'Forty-five minutes' (số nhiều).",
        "Quên 'is that right?' / 'sound good?' — khách Mỹ thích được hỏi xác nhận.",
      ],
    },
    {
      prompt_en:
        "After the service, a customer says, 'This isn't what I asked for.' How do you respond?",
      prompt_vi:
        "Làm xong, khách nói 'Cái này không phải cái tôi muốn'. Bạn xử lý sao?",
      sample_answer_en:
        "I'm sorry — let me take a look. Can you show me the picture again? I want to make sure I fix it the right way. Tell me what you'd like changed and I'll redo it.",
      sample_answer_vi:
        "Em xin lỗi — để em xem lại. Cô cho em xem lại tấm hình được không? Em muốn chắc là sửa cho đúng. Cô nói cần đổi gì em làm lại liền.",
      what_to_listen_for: [
        "Không cãi lại, không nói 'you said'.",
        "Có yêu cầu thông tin cụ thể (xem lại hình, chỉ rõ chỗ sai) không?",
        "Có đề nghị sửa lại không, thay vì chỉ xin lỗi?",
      ],
      common_mistakes_vi: [
        "'You don't say like that' → 'I'm sorry, let me check' (không đổ lỗi).",
        "'I redo it' → 'I'll redo it' / 'Let me redo it' (tương lai).",
      ],
    },
    {
      prompt_en:
        "A regular customer asks, 'Can I get a discount today? I always come here.' What do you say?",
      prompt_vi:
        "Khách quen hỏi 'Bữa nay bớt giùm tôi được không? Tôi đến hoài mà.' Bạn trả lời sao?",
      sample_answer_en:
        "I really appreciate you coming in. I can't change the price myself, but let me ask the owner — and I'll add a free quick massage at the end as a thank-you.",
      sample_answer_vi:
        "Em rất cảm ơn cô luôn đến đây. Em không tự đổi giá được, nhưng để em hỏi chủ — em xin tặng cô bài massage nhanh ở cuối, coi như lời cảm ơn.",
      what_to_listen_for: [
        "Không tự ý hứa giảm giá khi không có quyền.",
        "Vẫn giữ khách vui (đề nghị nhỏ thay thế).",
        "Có chuyển câu hỏi cho chủ một cách khéo léo không?",
      ],
      common_mistakes_vi: [
        "'I can't' phát âm 'I can' (mất phụ âm cuối) — khách hiểu ngược.",
        "'Let me to ask the owner' → 'Let me ask the owner' (sau let không có 'to').",
      ],
    },
    {
      prompt_en:
        "What hours can you work, and which days are you available?",
      prompt_vi: "Bạn làm được giờ nào, và những ngày nào trong tuần?",
      sample_answer_en:
        "I can work Tuesday through Sunday, ten in the morning to seven at night. I take Mondays off to bring my kids to school stuff. I can stay late if there's a walk-in.",
      sample_answer_vi:
        "Em làm thứ Ba đến Chủ Nhật, mười giờ sáng đến bảy giờ tối. Em nghỉ thứ Hai để lo việc trường của con. Có khách walk-in, em ở lại được.",
      what_to_listen_for: [
        "Trả lời cụ thể ngày + giờ.",
        "Trung thực về ràng buộc gia đình — chủ tiệm trọng người thẳng thắn.",
        "Sẵn sàng linh hoạt khi đông khách.",
      ],
      common_mistakes_vi: [
        "'From Tuesday to Sunday' đúng, 'Tuesday until Sunday' không tự nhiên.",
        "'Ten morning' → 'Ten in the morning' / '10 AM'.",
      ],
    },
    {
      prompt_en:
        "Why do you want to work here instead of another salon nearby?",
      prompt_vi: "Vì sao bạn chọn tiệm này, không chọn tiệm khác gần đây?",
      sample_answer_en:
        "I've heard your salon is steady — busy on weekends and the regulars come back. I'd rather be busy and learn fast than sit and wait. Also, my friend Linh worked here last year and she said the team helps each other.",
      sample_answer_vi:
        "Em nghe tiệm cô ổn định — cuối tuần đông, khách quen quay lại. Em thích bận rộn để học nhanh hơn ngồi chờ. Bạn em là Linh có làm ở đây năm trước, nói đội ở đây giúp đỡ nhau.",
      what_to_listen_for: [
        "Có lý do thực tế (busy, regulars) thay vì nịnh chung chung.",
        "Có dùng connection (bạn cùng nghề) một cách tự nhiên không?",
      ],
      common_mistakes_vi: [
        "'My friend Linh worked here last year' — chú ý 'worked' (quá khứ -ed) chứ không 'work'.",
        "'I want busy' → 'I'd rather be busy' / 'I prefer to be busy'.",
      ],
    },
  ],
  evaluation_criteria: [
    "Giọng tự tin, đủ rõ để khách hiểu — phát âm phụ âm cuối (s, ed, t).",
    "Xác nhận chi tiết trước khi bắt đầu (color, length, design).",
    "Khi khách phàn nàn: không cãi, không đổ lỗi, đề nghị sửa.",
    "Trung thực về lịch trống và ràng buộc gia đình.",
  ],
};

const TUTOR_TA: InterviewScenario = {
  slug: "tutor-teaching-assistant",
  title_vi: "Gia sư / Trợ giảng",
  title_en: "Tutor / teaching assistant",
  industry: "general",
  difficulty: "B1",
  intro_vi:
    "Bạn phỏng vấn cho vị trí gia sư hoặc trợ giảng tại trung tâm hoặc trường — phụ huynh và quản lý muốn nghe bạn giải thích rõ ràng, kiên nhẫn, và biết cách động viên học sinh khi nản.",
  intro_en:
    "You're interviewing for a tutor or TA role at a learning center or school. Parents and managers want clear explanations, patience, and a track record of motivating students who are stuck.",
  questions: [
    {
      prompt_en:
        "How would you explain the difference between 'a' and 'an' to a beginner?",
      prompt_vi: "Bạn sẽ giải thích khác nhau giữa 'a' và 'an' cho người mới học sao?",
      sample_answer_en:
        "I'd start with sound, not letters. Say 'a book' — easy. Say 'a apple' — your tongue trips. So we use 'an' before vowel sounds: 'an apple', 'an hour' (the h is silent). I'd give five examples and have them say each out loud.",
      sample_answer_vi:
        "Em bắt đầu bằng âm, không phải chữ cái. Nói 'a book' — dễ. Nói 'a apple' — lưỡi vấp. Nên dùng 'an' trước âm nguyên âm: 'an apple', 'an hour' (chữ h câm). Em cho năm ví dụ rồi bắt học sinh đọc to từng cái.",
      what_to_listen_for: [
        "Có ví dụ cụ thể không?",
        "Có cho học sinh nói chứ không chỉ nghe?",
        "Có lưu ý ngoại lệ (silent h, university) không?",
      ],
      common_mistakes_vi: [
        "Giải thích bằng quy tắc chữ cái thuần túy (a + consonant) — sẽ sai với 'hour'.",
        "Quên cho học sinh thực hành ra tiếng.",
      ],
    },
    {
      prompt_en:
        "A student says, 'I'm bad at English. I'll never get it.' How do you respond?",
      prompt_vi:
        "Học sinh nói 'Em dở tiếng Anh, không bao giờ học được'. Bạn trả lời sao?",
      sample_answer_en:
        "I hear that a lot, and I get it. But you said that sentence to me in English — clear, with feeling. That's not 'never gonna get it.' Let's pick one tiny thing that bothers you most this week and beat that one. Just one.",
      sample_answer_vi:
        "Em nghe câu đó hoài, và em hiểu. Nhưng em vừa nói câu đó với cô bằng tiếng Anh — rõ ràng, có cảm xúc. Đó không phải 'không bao giờ học được'. Mình chọn một thứ nhỏ làm em bực nhất tuần này rồi giải quyết cái đó. Chỉ một thôi.",
      what_to_listen_for: [
        "Có công nhận cảm xúc trước khi sửa lý lẽ không?",
        "Có chuyển từ 'không bao giờ' về một bước nhỏ cụ thể không?",
        "Tránh 'don't worry' / 'you can do it' rỗng.",
      ],
      common_mistakes_vi: [
        "Dùng 'I think you wrong' → 'I think you're wrong about that' (cần to be).",
        "'just one things' → 'just one thing' (số ít sau 'one').",
      ],
    },
    {
      prompt_en:
        "How do you keep a class with mixed levels — some advanced, some struggling — engaged at the same time?",
      prompt_vi:
        "Lớp có học sinh nhiều trình độ — bạn vừa giữ học giỏi không chán, vừa kéo học yếu, làm sao?",
      sample_answer_en:
        "Pair work. I match a stronger student with a weaker one and give them a small task — for example, 'Write three sentences using the past tense, then check each other.' The strong student teaches, which deepens their understanding. The weaker one gets one-on-one in their own language. I rotate pairs each week.",
      sample_answer_vi:
        "Cặp đôi. Em ghép một bạn khá với một bạn yếu, giao nhiệm vụ nhỏ — ví dụ 'Viết ba câu dùng thì quá khứ, rồi kiểm bài nhau.' Bạn khá dạy lại sẽ hiểu sâu hơn. Bạn yếu được kèm một-một bằng tiếng mẹ đẻ. Em đổi cặp mỗi tuần.",
      what_to_listen_for: [
        "Có phương pháp cụ thể (pair work, rotation), không lý thuyết suông.",
        "Lý do vì sao học giỏi cũng được lợi — không phải hi sinh.",
      ],
      common_mistakes_vi: [
        "'Mix level' → 'mixed levels' (tính từ phải có -ed).",
        "Dùng 'they teach each other' nhưng quên 'each other' nghĩa nhau, không phải 'themselves'.",
      ],
    },
    {
      prompt_en:
        "A parent says, 'My son hasn't improved after three months with you. What's going on?' What do you say?",
      prompt_vi:
        "Phụ huynh nói 'Con tôi học ba tháng với cô mà chưa giỏi hơn. Sao vậy?' Bạn trả lời sao?",
      sample_answer_en:
        "Thank you for telling me directly. Three months is enough time to see something — let me show you what we've worked on, where he's improved, and what's still hard. After that, can we agree on one specific goal for the next month so we can measure together?",
      sample_answer_vi:
        "Cảm ơn anh/chị đã nói thẳng. Ba tháng là đủ để thấy gì đó — để em cho anh/chị xem cụ thể em và bé đã học gì, bé tiến bộ chỗ nào, chỗ nào còn khó. Sau đó mình có thể chốt một mục tiêu cụ thể cho tháng tới để cùng đo được không ạ?",
      what_to_listen_for: [
        "Không phòng thủ — đón nhận câu hỏi.",
        "Có dữ liệu cụ thể (đã làm gì, tiến bộ ra sao) không?",
        "Có đề xuất một mục tiêu đo được tháng tới không?",
      ],
      common_mistakes_vi: [
        "'After three month' → 'After three months' (số nhiều).",
        "'My son not improve' → 'My son hasn't improved' / 'My son hasn't been improving'.",
      ],
    },
    {
      prompt_en: "Why do you want to teach instead of doing something else?",
      prompt_vi: "Vì sao bạn muốn dạy mà không làm việc khác?",
      sample_answer_en:
        "When a student finally gets a concept they struggled with, their face changes — and that moment is the most rewarding feedback I've ever got at work. I also learn from explaining: every time I teach the past perfect, I understand it a little better.",
      sample_answer_vi:
        "Khi học sinh cuối cùng hiểu được một thứ trước đó bí, gương mặt em ấy thay đổi — và khoảnh khắc đó là phản hồi lớn nhất em từng nhận được trong công việc. Em cũng học từ việc dạy: mỗi lần em dạy quá khứ hoàn thành, em lại hiểu nó thêm một chút.",
      what_to_listen_for: [
        "Có khoảnh khắc cụ thể (gương mặt học sinh, ví dụ thật) không?",
        "Tránh 'I love kids' rỗng.",
      ],
      common_mistakes_vi: [
        "'Their face change' → 'Their face changes' (chia ngôi 3, dù là số ít trong ý vai).",
        "'I learn from to explain' → 'I learn from explaining' (sau giới từ dùng V-ing).",
      ],
    },
  ],
  evaluation_criteria: [
    "Giải thích bằng ví dụ cụ thể, không lý thuyết suông.",
    "Khi gặp câu hỏi nhạy cảm (phụ huynh than phiền): công nhận → dữ liệu → mục tiêu mới.",
    "Cho học sinh nói/làm, không chỉ nghe.",
    "Tự tin nhưng không tự cao — sẵn sàng nói 'em chưa biết' khi cần.",
  ],
};

const OFFICE_ADMIN: InterviewScenario = {
  slug: "office-admin-receptionist",
  title_vi: "Lễ tân / Văn phòng hành chính",
  title_en: "Office admin / receptionist",
  industry: "general",
  difficulty: "B2",
  intro_vi:
    "Phỏng vấn cho vị trí lễ tân hoặc admin văn phòng — bạn sẽ trả lời điện thoại, đón khách quan trọng, lên lịch họp, và viết email ngắn. Người phỏng vấn nhìn cách bạn xử lý nhiều việc cùng lúc và nói chuyện chuyên nghiệp.",
  intro_en:
    "An interview for a receptionist or office admin role — you'd answer phones, greet visitors, schedule meetings, and write short emails. The interviewer is watching how you handle parallel tasks and sound professional.",
  questions: [
    {
      prompt_en:
        "Walk me through how you would handle five things happening at once: a ringing phone, a delivery person at the door, the CEO walking out for lunch, an email marked urgent, and a printer that just jammed.",
      prompt_vi:
        "Hãy mô tả bạn xử lý năm việc cùng lúc: điện thoại reo, người giao hàng ở cửa, CEO đang ra ngoài ăn trưa, email đánh dấu khẩn, và máy in vừa kẹt giấy.",
      sample_answer_en:
        "First I'd say 'Good afternoon!' to the CEO so he knows I noticed — that takes one second. Then I'd ask the delivery person to wait by the desk and pick up the phone — phones can't wait. While on the phone I'd open the urgent email to scan the subject line. After hanging up, I'd sign for the delivery, reply to the email if it's a one-liner, and tell my colleague nearest the printer that it jammed. The printer waits — it's the lowest impact item.",
      sample_answer_vi:
        "Đầu tiên em chào 'Good afternoon!' với CEO để anh ấy biết em thấy — chỉ một giây. Sau đó em mời người giao hàng đứng chờ bên cạnh quầy rồi nhấc máy điện thoại — điện thoại không chờ được. Vừa nghe điện em vừa mở email khẩn xem tiêu đề. Sau khi cúp máy, em ký nhận hàng, trả lời email nếu chỉ một dòng, rồi báo đồng nghiệp gần máy in. Máy in chờ — nó là việc ít ảnh hưởng nhất.",
      what_to_listen_for: [
        "Có nguyên tắc ưu tiên (ai đang đợi, ai mất tiền nếu chậm)?",
        "Có giữ được phong thái xã giao (chào CEO) không?",
        "Có giải thích vì sao máy in xếp cuối không?",
      ],
      common_mistakes_vi: [
        "'I will say' → 'I'd say' (conditional, hợp với 'how would you').",
        "'Phone can't wait' → 'phones can't wait' (số nhiều) hoặc 'the phone can't wait'.",
      ],
    },
    {
      prompt_en:
        "An angry visitor demands to see the CEO, who is in a meeting. What do you say to them?",
      prompt_vi: "Khách giận giữ đòi gặp CEO — CEO đang họp. Bạn nói sao?",
      sample_answer_en:
        "I understand this is urgent for you. The CEO is in a meeting until three. I can do two things: leave him a note the moment he's out, or connect you with someone on his team who can act on this now. Which would you prefer?",
      sample_answer_vi:
        "Em hiểu việc này gấp với anh/chị. CEO đang họp đến ba giờ. Em có thể làm hai cách: để lại ghi chú cho anh ấy ngay khi xong, hoặc nối anh/chị với một người trong nhóm anh ấy có thể xử lý ngay bây giờ. Anh/chị chọn cách nào ạ?",
      what_to_listen_for: [
        "Công nhận cảm xúc trước khi đưa giải pháp.",
        "Đưa hai lựa chọn cụ thể, không hứa suông.",
        "Giữ thông tin riêng tư của CEO (không nói anh ấy đang ở đâu).",
      ],
      common_mistakes_vi: [
        "'Until 3 hour' → 'until three' / 'until 3 PM'.",
        "'Which one you prefer' → 'Which would you prefer?' (cần 'would').",
      ],
    },
    {
      prompt_en:
        "Write me — out loud — a short professional email declining a meeting next Tuesday.",
      prompt_vi:
        "Đọc to giúp tôi một email chuyên nghiệp ngắn từ chối cuộc họp thứ Ba tuần sau.",
      sample_answer_en:
        "Subject: Tuesday meeting — needs to reschedule. Hi Mark, thanks for the invite. I won't be able to make Tuesday because of a prior commitment. Could we move it to Thursday afternoon, or any time on Friday? Happy to send a couple of options if easier. Best, Lan.",
      sample_answer_vi:
        "Tiêu đề: Cuộc họp thứ Ba — xin dời lịch. Chào anh Mark, cảm ơn anh đã mời. Em không tham dự thứ Ba được vì đã có lịch trước. Mình dời sang chiều thứ Năm, hoặc bất kỳ giờ nào thứ Sáu được không ạ? Em sẵn sàng gửi vài lựa chọn nếu tiện hơn. Trân trọng, Lan.",
      what_to_listen_for: [
        "Có subject line cụ thể không?",
        "Lý do ngắn gọn, không kể lể.",
        "Có đề xuất giờ thay thế không, hay chỉ từ chối?",
        "Câu chốt 'best / regards / thanks' — không 'love' (sai văn phong).",
      ],
      common_mistakes_vi: [
        "'I cannot to attend' → 'I won't be able to attend' / 'I can't attend'.",
        "'Move at Thursday' → 'Move it to Thursday'.",
      ],
    },
    {
      prompt_en:
        "Tell me about a time you noticed something was wrong before anyone else did, and how you handled it.",
      prompt_vi:
        "Kể một lần bạn nhận ra có chuyện không ổn trước người khác — và bạn xử lý sao.",
      sample_answer_en:
        "Last quarter I noticed our mailroom was sending invoices to clients without the address line — a label printer issue. No one had complained yet, but I knew billing would be off in a week. I emailed our accountant with a screenshot, paused the mail run for that day, and IT fixed the label template by lunch. We caught about thirty invoices before they went out.",
      sample_answer_vi:
        "Quý trước em phát hiện phòng gửi thư đang gửi hóa đơn khách thiếu dòng địa chỉ — lỗi máy in nhãn. Chưa ai phàn nàn, nhưng em biết tuần sau sẽ rối ở khâu billing. Em gửi email cho kế toán kèm ảnh chụp, tạm dừng đợt gửi hôm đó, và IT sửa template trước trưa. Mình giữ lại được khoảng ba mươi hóa đơn trước khi gửi.",
      what_to_listen_for: [
        "Tình huống cụ thể, có số liệu (30 hóa đơn).",
        "Hành động chủ động, không chờ chỉ đạo.",
        "Có thông báo đúng người (kế toán, IT) không?",
      ],
      common_mistakes_vi: [
        "'Last quarter I notice' → 'Last quarter I noticed' (quá khứ -ed).",
        "'I email' → 'I emailed' (quá khứ).",
      ],
    },
    {
      prompt_en:
        "Where do you see yourself in three years, and how does this role fit?",
      prompt_vi:
        "Ba năm nữa bạn thấy mình ở đâu, và vị trí này phù hợp thế nào?",
      sample_answer_en:
        "In three years I'd like to be running an office operations team — managing schedules, vendors, maybe one or two junior admins. This role gives me the right base: I'd see how a real exec calendar runs, how decisions get made, and learn the company before being trusted with bigger pieces. The growth path here matters more than the starting title.",
      sample_answer_vi:
        "Ba năm nữa em muốn quản lý đội vận hành văn phòng — lo lịch, nhà cung cấp, có thể một hai bạn admin junior. Vị trí này cho em nền đúng: thấy lịch của exec thực tế chạy thế nào, quyết định được đưa ra ra sao, và học công ty trước khi được giao việc lớn. Lộ trình thăng tiến quan trọng hơn chức danh khởi đầu.",
      what_to_listen_for: [
        "Có lộ trình cụ thể, đo được không?",
        "Có liên kết vị trí hiện tại với mục tiêu xa không?",
        "Tránh 'I want to be CEO' (quá xa) hoặc 'I don't know' (thiếu suy nghĩ).",
      ],
      common_mistakes_vi: [
        "'I want to be running' → 'I'd like to be running' (conditional cho mục tiêu).",
        "'In three year' → 'In three years' (số nhiều).",
      ],
    },
  ],
  evaluation_criteria: [
    "Có nguyên tắc ưu tiên rõ khi nhiều việc cùng lúc.",
    "Email có subject line, lý do, lịch thay thế.",
    "Khi xử lý phàn nàn: công nhận → đưa hai lựa chọn cụ thể.",
    "Tự chủ — phát hiện vấn đề trước, hành động không chờ chỉ đạo.",
    "Lộ trình ba năm gắn với vai trò hiện tại, không xa rời.",
  ],
};

// ──────────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────────

export const SCENARIOS: Record<string, InterviewScenario> = Object.freeze({
  [TECH_SUPPORT.slug]: TECH_SUPPORT,
  [RESTAURANT_SERVER.slug]: RESTAURANT_SERVER,
  [NAIL_SALON_TECHNICIAN.slug]: NAIL_SALON_TECHNICIAN,
  [TUTOR_TA.slug]: TUTOR_TA,
  [OFFICE_ADMIN.slug]: OFFICE_ADMIN,
});

export const ALL_SCENARIO_SLUGS: readonly string[] = Object.freeze(
  Object.keys(SCENARIOS),
);

export function getScenarioBySlug(slug: string): InterviewScenario | null {
  return SCENARIOS[slug] ?? null;
}

export function listScenarios(): InterviewScenario[] {
  return ALL_SCENARIO_SLUGS.map((slug) => SCENARIOS[slug]);
}
