// src/data/profession-packs/tech-worker/content.ts
//
// Lesson-shaped content for the tech-worker profession pack. Fifth
// VN-diaspora work vertical after nail-tech (#169), restaurant, and
// customer-service (#179) — software engineers, QA, technical PMs,
// designers, devops. ~30k Vietnamese-Americans in tech, average comp
// $130k+. Highest-paying vertical in this series.
//
// 50 lessons across 8 categories per the brief. Each lesson:
//
//   id                 tech_worker_<slug> — forward-compatible with
//                      future room IDs in roomRegistry.
//   title_vi/title_en  bilingual title.
//   category           one of TECH_WORKER_CATEGORIES.
//   sentences          4–6 short utterances, each with a Vietnamese
//                      gloss and tech-specific phoneme keys (acronym
//                      pronunciation, brand names, /θ/ in throughput).
//   cultural_notes_vi  US tech communication norms — disagree-and-commit,
//                      async-first, direct PR feedback as professional
//                      respect, salary negotiation as expectation, the
//                      stack-rank performance-review concept.
//   tip_advice_vi      practical advice — PR-review tone tricks,
//                      standup brevity, salary research before
//                      negotiation, documentation as career insurance.
//
// Authenticity: every line matches what's actually said in US tech
// teams. PR-review phrasing like "consider X" / "what do you think
// about Y?" / "I've seen people do Z" reflects how senior engineers
// soften feedback to keep team morale up while still pushing for
// quality.

export type TechWorkerCategoryId =
  | "technical_interviews"
  | "standup_sprint_planning"
  | "pr_reviews"
  | "bug_reporting"
  | "demo_presentation"
  | "oncall_incidents"
  | "career_conversations"
  | "team_dynamics";

export type TechWorkerCategoryMeta = {
  id: TechWorkerCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const TECH_WORKER_CATEGORIES: ReadonlyArray<TechWorkerCategoryMeta> = [
  {
    id: "technical_interviews",
    title_vi: "Phỏng vấn kỹ thuật",
    title_en: "Technical interviews",
    expected_count: 10,
  },
  {
    id: "standup_sprint_planning",
    title_vi: "Standup và sprint planning",
    title_en: "Daily standup and sprint planning",
    expected_count: 5,
  },
  {
    id: "pr_reviews",
    title_vi: "Review pull request",
    title_en: "PR reviews and code feedback",
    expected_count: 10,
  },
  {
    id: "bug_reporting",
    title_vi: "Báo bug và phân loại",
    title_en: "Bug reporting and triaging",
    expected_count: 5,
  },
  {
    id: "demo_presentation",
    title_vi: "Demo và thuyết trình",
    title_en: "Demos and presentations",
    expected_count: 5,
  },
  {
    id: "oncall_incidents",
    title_vi: "On-call và xử lý sự cố",
    title_en: "On-call and incident management",
    expected_count: 5,
  },
  {
    id: "career_conversations",
    title_vi: "Trao đổi sự nghiệp",
    title_en: "Career conversations",
    expected_count: 5,
  },
  {
    id: "team_dynamics",
    title_vi: "Bất đồng và động lực nhóm",
    title_en: "Team dynamics and disagreements",
    expected_count: 5,
  },
];

export type LessonSentence = {
  en: string;
  vi: string;
  /** Light IPA-ish phoneme keys VN learners struggle with in tech English. */
  pronunciation_focus: string[];
};

export type TechWorkerLesson = {
  id: string;
  category: TechWorkerCategoryId;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
};

// ── 1. Technical interviews (10) ─────────────────────────────────────────

const INTERVIEWS: TechWorkerLesson[] = [
  {
    id: "tech_worker_interview_tell_me_about_yourself",
    category: "technical_interviews",
    title_vi: "'Tell me about yourself' — câu mở đầu",
    title_en: "Opening 'tell me about yourself'",
    sentences: [
      { en: "Sure, I'd love to. I'm a back-end engineer with five years of experience, mostly in Python and Go.", vi: "Chắc rồi. Em là kỹ sư back-end 5 năm kinh nghiệm, chủ yếu Python và Go ạ.", pronunciation_focus: ["love to", "back-end", "experience"] },
      { en: "Most recently I led the migration of our payments service from a monolith to event-driven microservices.", vi: "Gần nhất, em dẫn dắt việc chuyển hệ thống thanh toán từ monolith sang microservices event-driven ạ.", pronunciation_focus: ["microservices", "event-driven"] },
      { en: "What drew me to this role is the team's focus on reliability at scale — that's where I do my best work.", vi: "Điều thu hút em ở vị trí này là nhóm chú trọng độ tin cậy ở quy mô lớn — đó là chỗ em làm tốt nhất ạ.", pronunciation_focus: ["reliability", "scale"] },
      { en: "Happy to go deeper on any of that.", vi: "Em sẵn sàng đi sâu vào phần nào ạ.", pronunciation_focus: ["happy", "deeper"] },
    ],
    cultural_notes_vi:
      "Câu mở đầu phải dài 60-90 giây — không quá dài, không quá ngắn. Cấu trúc Mỹ chuẩn: hiện tại (mình là ai) → quá khứ (gần nhất làm gì) → tại sao role này. ĐỪNG kể tuổi thơ, đại học. Quá khứ chỉ kể project gần nhất.",
    tip_advice_vi:
      "Tập câu này đến mức nói được trong giấc ngủ. Mọi cuộc phỏng vấn Mỹ bắt đầu bằng câu này. Nói tự tin = ấn tượng đầu tốt = cả buổi suôn sẻ. Nói lúng túng = recruiter ghi note tiêu cực ngay từ phút đầu.",
  },
  {
    id: "tech_worker_interview_system_design_clarify",
    category: "technical_interviews",
    title_vi: "System design — hỏi làm rõ",
    title_en: "System design: clarifying questions",
    sentences: [
      { en: "Before I jump in, can I ask a few clarifying questions?", vi: "Trước khi bắt đầu, em hỏi vài câu cho rõ ạ?", pronunciation_focus: ["jump in", "clarifying"] },
      { en: "What's the expected scale — are we talking thousands of users or millions?", vi: "Quy mô dự kiến là gì — vài nghìn user hay vài triệu ạ?", pronunciation_focus: ["scale", "thousands"] },
      { en: "Are read-heavy or write-heavy workloads more important here?", vi: "Workload đọc nhiều hay ghi nhiều quan trọng hơn ạ?", pronunciation_focus: ["read-heavy", "write-heavy"] },
      { en: "Got it — let me sketch out a high-level architecture first, then we can dive into trade-offs.", vi: "Em hiểu rồi — em vẽ kiến trúc tổng thể trước, sau đó mình bàn các trade-off ạ.", pronunciation_focus: ["sketch", "trade-offs"] },
    ],
    cultural_notes_vi:
      "System design KHÔNG bắt đầu bằng giải pháp — bắt đầu bằng câu hỏi. Interviewer cố tình mơ hồ để xem ứng viên có hỏi đủ không. Nhảy vào giải pháp ngay = -2 điểm 'no requirements gathering'.",
    tip_advice_vi:
      "Hỏi 4-6 câu trước khi vẽ. Ghi câu trả lời lên màn hình share để cả hai cùng thấy. Đây là dấu hiệu senior engineer — biết đặt scope trước khi code.",
  },
  {
    id: "tech_worker_interview_algorithm_thinking_aloud",
    category: "technical_interviews",
    title_vi: "Coding — nói to suy nghĩ",
    title_en: "Algorithm: thinking aloud",
    sentences: [
      { en: "Let me think through this out loud.", vi: "Em suy nghĩ ra tiếng nhé.", pronunciation_focus: ["through", "loud"] },
      { en: "My first instinct is a hash map for O(1) lookup, but let me check the constraints.", vi: "Linh tính đầu tiên là dùng hash map cho O(1) lookup, nhưng để em check ràng buộc ạ.", pronunciation_focus: ["instinct", "lookup"] },
      { en: "Actually, that won't work because the input could be huge — let me try a streaming approach.", vi: "Mà không, input có thể rất lớn — để em thử cách streaming ạ.", pronunciation_focus: ["actually", "streaming"] },
      { en: "I'll start with a brute-force solution, then optimize.", vi: "Em làm brute-force trước, sau đó tối ưu ạ.", pronunciation_focus: ["brute-force", "optimize"] },
    ],
    cultural_notes_vi:
      "Im lặng coding 10 phút = -1 điểm 'communication'. Nói to suy nghĩ là yêu cầu ngầm. Ngay cả khi sai hướng, interviewer thích nghe quá trình hơn kết quả im lặng.",
    tip_advice_vi:
      "Học cụm 'My first instinct...', 'Let me check...', 'Actually...'. Cụm chuyển hướng tự nhiên. Người Việt hay im lặng vì nghĩ phải nói chuẩn — sai. Ậm ừ ('hmm', 'let me see') còn tốt hơn im.",
  },
  {
    id: "tech_worker_interview_behavioral_star",
    category: "technical_interviews",
    title_vi: "Behavioral — cấu trúc STAR",
    title_en: "Behavioral: STAR format",
    sentences: [
      { en: "Sure, I have a good example. The situation was...", vi: "Có, em có ví dụ. Bối cảnh là...", pronunciation_focus: ["situation"] },
      { en: "My task was to reduce checkout latency from 800ms to under 300ms.", vi: "Nhiệm vụ của em là giảm latency thanh toán từ 800ms xuống dưới 300ms ạ.", pronunciation_focus: ["task", "latency"] },
      { en: "The action I took was profiling the entire flow, and I found that 60% of the time was in a single ORM query.", vi: "Hành động em làm là profile toàn bộ flow, và em phát hiện 60% thời gian ở trong một câu ORM.", pronunciation_focus: ["action", "profiling"] },
      { en: "The result was we got latency down to 180ms — beat the goal by 40%.", vi: "Kết quả là giảm latency xuống 180ms — vượt mục tiêu 40% ạ.", pronunciation_focus: ["result", "beat"] },
    ],
    cultural_notes_vi:
      "STAR (Situation, Task, Action, Result) là format chuẩn US behavioral. Bỏ R (kết quả) = câu chuyện không kết — interviewer không biết tại sao quan trọng. Số liệu cụ thể (800ms → 180ms) > mô tả mơ hồ ('faster').",
    tip_advice_vi:
      "Chuẩn bị 5 câu chuyện STAR trước phỏng vấn: 1 thành công lớn, 1 thất bại học được nhiều, 1 conflict, 1 leadership, 1 ambiguous problem. Có thể tái sử dụng cho 80% câu hỏi behavioral.",
  },
  {
    id: "tech_worker_interview_behavioral_failure",
    category: "technical_interviews",
    title_vi: "'Lỗi lớn nhất' — biến thất bại thành học",
    title_en: "Biggest failure: turning loss into learning",
    sentences: [
      { en: "Honestly, my biggest one was shipping a database migration without a rollback plan.", vi: "Thật lòng, lỗi lớn nhất của em là deploy migration database mà không có rollback plan ạ.", pronunciation_focus: ["honestly", "rollback"] },
      { en: "When the migration failed at 2am, we had three hours of partial data inconsistency.", vi: "Khi migration fail lúc 2 giờ sáng, dữ liệu không nhất quán suốt 3 tiếng ạ.", pronunciation_focus: ["inconsistency"] },
      { en: "What I learned is that any irreversible change needs a documented rollback path approved before merge.", vi: "Bài học là thay đổi không thể đảo ngược phải có rollback path được duyệt trước khi merge ạ.", pronunciation_focus: ["irreversible", "rollback"] },
      { en: "Since then, I've made it a team standard.", vi: "Từ đó, em làm thành chuẩn cho cả team ạ.", pronunciation_focus: ["standard"] },
    ],
    cultural_notes_vi:
      "Đừng né câu hỏi này bằng 'I can't think of any' — interviewer ghi 'lacks self-awareness'. Câu hỏi thực sự là: 'Bạn có học từ thất bại không?'. Đáp án phải có (1) lỗi cụ thể, (2) hậu quả, (3) bài học, (4) thay đổi sau đó.",
    tip_advice_vi:
      "Chọn lỗi 2-3 năm trước (đủ xa để không còn nhạy cảm), nhưng đủ gần để nhớ chi tiết. ĐỪNG kể lỗi của team — phải lỗi của mình. Nhận trách nhiệm = senior. Đổ lỗi = junior.",
  },
  {
    id: "tech_worker_interview_take_home_intro",
    category: "technical_interviews",
    title_vi: "Take-home — giới thiệu trước review",
    title_en: "Take-home: walking through your solution",
    sentences: [
      { en: "Thanks for taking time to review this. I want to spend two minutes walking through my approach.", vi: "Cảm ơn các anh/chị đã review. Em xin 2 phút giải thích cách tiếp cận ạ.", pronunciation_focus: ["walking through", "approach"] },
      { en: "I optimized for readability and testability over raw performance.", vi: "Em ưu tiên dễ đọc và dễ test hơn là tốc độ tối đa ạ.", pronunciation_focus: ["readability", "testability"] },
      { en: "If I had another day, the first thing I'd add is metrics and structured logging.", vi: "Nếu có thêm 1 ngày, việc đầu tiên em thêm là metrics và structured logging ạ.", pronunciation_focus: ["metrics", "logging"] },
      { en: "Anything you'd like to dig into?", vi: "Anh/chị muốn đi sâu phần nào ạ?", pronunciation_focus: ["dig into"] },
    ],
    cultural_notes_vi:
      "Câu 'If I had another day, I'd add...' rất quan trọng — chứng minh ứng viên biết solution chưa hoàn hảo nhưng có vision. Submit code 'perfect' không đề cập gì = -1 điểm 'lacks self-awareness'.",
    tip_advice_vi:
      "Chuẩn bị 3 câu trước review: (1) ưu tiên gì, (2) đánh đổi gì, (3) nếu có thêm thời gian sẽ làm gì. Không cần đợi câu hỏi — chủ động giới thiệu. Đây là dấu hiệu senior.",
  },
  {
    id: "tech_worker_interview_question_for_them",
    category: "technical_interviews",
    title_vi: "Câu hỏi ngược cho interviewer",
    title_en: "Asking the interviewer good questions",
    sentences: [
      { en: "What does a successful first six months look like in this role?", vi: "6 tháng đầu thành công ở vị trí này như thế nào ạ?", pronunciation_focus: ["successful", "months"] },
      { en: "How does the team handle disagreements on technical direction?", vi: "Team xử lý bất đồng về hướng kỹ thuật ra sao ạ?", pronunciation_focus: ["disagreements", "direction"] },
      { en: "What's something about working here that surprised you?", vi: "Có điều gì làm việc ở đây làm bạn bất ngờ không ạ?", pronunciation_focus: ["surprised"] },
      { en: "Thanks — that gives me a really clear picture.", vi: "Cảm ơn — em hiểu rõ hơn nhiều ạ.", pronunciation_focus: ["clear", "picture"] },
    ],
    cultural_notes_vi:
      "Cuối phỏng vấn 'Do you have any questions?' KHÔNG được trả lời 'No' — đó là tín hiệu tiêu cực. Ít nhất 2 câu hỏi sâu. Câu hỏi tốt = ứng viên thật sự quan tâm.",
    tip_advice_vi:
      "Tránh câu hỏi tự trả lời được trên website công ty (tech stack, location). Hỏi về văn hóa, quyết định, conflict — những thứ chỉ insider biết. Câu hỏi 'what surprised you' hay vì gợi câu trả lời chân thật.",
  },
  {
    id: "tech_worker_interview_dont_know_answer",
    category: "technical_interviews",
    title_vi: "Khi không biết câu trả lời",
    title_en: "When you don't know the answer",
    sentences: [
      { en: "Honestly, I'm not familiar with that specific tool.", vi: "Thật lòng, em chưa làm quen với tool đó ạ.", pronunciation_focus: ["honestly", "familiar"] },
      { en: "But based on what you described, it sounds similar to X — and the way I'd approach it is...", vi: "Nhưng theo mô tả thì nghe giống X — cách em tiếp cận sẽ là...", pronunciation_focus: ["described", "approach"] },
      { en: "If I had to use it on the job, my first step would be reading the docs and a small spike.", vi: "Nếu phải dùng trong công việc, bước đầu là đọc tài liệu và làm spike nhỏ ạ.", pronunciation_focus: ["docs", "spike"] },
      { en: "Is that helpful, or would you like a different angle?", vi: "Như vậy có ích không, hay anh/chị muốn góc nhìn khác ạ?", pronunciation_focus: ["helpful", "angle"] },
    ],
    cultural_notes_vi:
      "Nói 'I don't know' rồi im = -1. Nói 'I don't know but here's how I'd figure it out' = +1. Sự khác biệt: ứng viên show 'how to learn'. Ở Mỹ, không ai biết tất cả — biết cách học mới quan trọng.",
    tip_advice_vi:
      "Cụm 'sounds similar to X' / 'first step would be...' là cứu cánh. Tránh 'I have no idea' — quá tuyệt đối. Junior thường giả vờ biết → bị bóc trần. Senior thẳng thắn không biết → respect.",
  },
  {
    id: "tech_worker_interview_salary_redirect",
    category: "technical_interviews",
    title_vi: "Chuyển hướng câu hỏi lương",
    title_en: "Deflecting the salary question early",
    sentences: [
      { en: "I'd love to learn more about the role first before talking numbers.", vi: "Em muốn hiểu rõ về vị trí trước khi bàn về lương ạ.", pronunciation_focus: ["love", "numbers"] },
      { en: "What range do you have budgeted for this position?", vi: "Bên anh/chị có khoảng ngân sách nào cho vị trí này ạ?", pronunciation_focus: ["budgeted", "position"] },
      { en: "I'm flexible — happy to discuss when we're at the offer stage.", vi: "Em linh hoạt — sẵn sàng bàn ở giai đoạn offer ạ.", pronunciation_focus: ["flexible", "stage"] },
      { en: "But to give you a number now, I'd say something in the upper end of senior.", vi: "Nhưng nếu phải đưa số ngay, em ở mức cao của senior ạ.", pronunciation_focus: ["upper", "senior"] },
    ],
    cultural_notes_vi:
      "Recruiter screen luôn hỏi 'expected salary?' đầu tiên. ĐỪNG đưa số ngay — đó là bẫy. Nói trước = bị anchor xuống. Câu 'what range do you have budgeted?' chuyển bóng — chuyên nghiệp.",
    tip_advice_vi:
      "Research lương trên Levels.fyi, Blind, Glassdoor TRƯỚC phỏng vấn. Biết base/equity/bonus của level mình. Khi offer đến, đàm phán dựa trên data — không phải cảm tính.",
  },
  {
    id: "tech_worker_interview_close_strong",
    category: "technical_interviews",
    title_vi: "Kết thúc phỏng vấn mạnh mẽ",
    title_en: "Closing the interview strong",
    sentences: [
      { en: "This was a great conversation — thank you for the time.", vi: "Cuộc trò chuyện rất hay — cảm ơn anh/chị đã dành thời gian ạ.", pronunciation_focus: ["great", "time"] },
      { en: "I'm even more excited about the role after this.", vi: "Sau khi nói chuyện em còn thích vị trí này hơn ạ.", pronunciation_focus: ["excited", "role"] },
      { en: "What are the next steps from your side?", vi: "Bước tiếp theo phía anh/chị là gì ạ?", pronunciation_focus: ["next", "steps"] },
      { en: "I'll send a follow-up note later today.", vi: "Em sẽ gửi email cảm ơn trong hôm nay ạ.", pronunciation_focus: ["follow-up", "today"] },
    ],
    cultural_notes_vi:
      "Câu 'I'm even more excited' chuẩn Mỹ — bộc lộ enthusiasm rõ ràng. Người Việt thường khiêm tốn quá → recruiter nghĩ 'không quan tâm lắm'. Mỹ: enthusiasm = positive signal.",
    tip_advice_vi:
      "Follow-up email trong 24 giờ. 3-4 câu: cảm ơn + 1 detail từ buổi phỏng vấn (chứng minh nghe kỹ) + nhắc lại tại sao mình hợp. Dài hơn = khoe; ngắn hơn = lười.",
  },
];

// ── 2. Standup / sprint planning (5) ─────────────────────────────────────

const STANDUP: TechWorkerLesson[] = [
  {
    id: "tech_worker_standup_yesterday_today_blockers",
    category: "standup_sprint_planning",
    title_vi: "Cấu trúc 3 phần chuẩn",
    title_en: "Yesterday / today / blockers formula",
    sentences: [
      { en: "Yesterday I finished the auth refactor and got it merged.", vi: "Hôm qua em hoàn thành refactor auth và đã merge ạ.", pronunciation_focus: ["yesterday", "merged"] },
      { en: "Today I'm picking up the rate-limiter ticket — should have a draft PR by EOD.", vi: "Hôm nay em làm ticket rate-limiter — sẽ có draft PR cuối ngày ạ.", pronunciation_focus: ["picking up", "draft"] },
      { en: "No blockers from my side.", vi: "Phía em không có blocker ạ.", pronunciation_focus: ["blockers"] },
      { en: "That's it from me.", vi: "Em xong rồi ạ.", pronunciation_focus: ["that's it"] },
    ],
    cultural_notes_vi:
      "Standup là 3 câu, KHÔNG 3 phút. Yesterday → today → blockers. Bỏ chi tiết technical — discussion sau standup. Người Việt hay nói dài vì muốn show effort — trong tech Mỹ, ngắn gọn = senior.",
    tip_advice_vi:
      "Tập viết standup trước trên Slack/notebook. 30-45 giây nói. Vượt 1 phút = team mệt. Câu 'EOD' (end of day) là chuẩn — học thuộc các viết tắt: EOD, EOW (week), TBD (decided).",
  },
  {
    id: "tech_worker_standup_blocker_clear",
    category: "standup_sprint_planning",
    title_vi: "Báo blocker rõ ràng",
    title_en: "Reporting a blocker clearly",
    sentences: [
      { en: "I'm blocked on the deploy pipeline — the staging build has been red since Tuesday.", vi: "Em đang bị block ở deploy pipeline — staging build đỏ từ thứ Ba ạ.", pronunciation_focus: ["blocked", "staging"] },
      { en: "I've pinged DevOps but haven't heard back.", vi: "Em đã ping DevOps nhưng chưa có phản hồi ạ.", pronunciation_focus: ["pinged", "back"] },
      { en: "If we can't unblock by EOD, I'll switch to the docs ticket instead.", vi: "Nếu không gỡ được trong hôm nay, em chuyển sang ticket docs ạ.", pronunciation_focus: ["unblock", "switch"] },
      { en: "Anyone has bandwidth to help debug?", vi: "Ai có thời gian giúp debug không ạ?", pronunciation_focus: ["bandwidth", "debug"] },
    ],
    cultural_notes_vi:
      "Báo blocker phải có (1) blocker cụ thể, (2) đã thử gì, (3) plan B nếu không gỡ được. KHÔNG nói chung chung 'I'm stuck'. Senior phân biệt = có plan B đề xuất.",
    tip_advice_vi:
      "'Anyone has bandwidth?' (Ai có thời gian) là câu rất Mỹ. KHÔNG nói 'time' (nghe ngắn) — 'bandwidth' đúng tech-speak. Help-seeking công khai trong standup nhanh hơn DM riêng.",
  },
  {
    id: "tech_worker_standup_estimate_uncertain",
    category: "standup_sprint_planning",
    title_vi: "Estimate khi chưa chắc chắn",
    title_en: "Estimating with uncertainty",
    sentences: [
      { en: "I'd estimate 3 to 5 days, but I want to flag uncertainty around the third-party API.", vi: "Em ước 3-5 ngày, nhưng có rủi ro phía API bên thứ ba ạ.", pronunciation_focus: ["estimate", "uncertainty"] },
      { en: "If their docs are wrong, that could push us to 8 days.", vi: "Nếu docs họ sai, có thể kéo dài đến 8 ngày ạ.", pronunciation_focus: ["push", "days"] },
      { en: "Want me to do a one-day spike first to de-risk?", vi: "Em làm spike 1 ngày trước để giảm rủi ro nhé?", pronunciation_focus: ["spike", "de-risk"] },
      { en: "That'll give us a much tighter estimate.", vi: "Sẽ giúp estimate sát hơn ạ.", pronunciation_focus: ["tighter", "estimate"] },
    ],
    cultural_notes_vi:
      "Estimate Mỹ phải có range (3-5 ngày), không phải số đơn (4 ngày). Range = honest về uncertainty. Số đơn = cam kết cứng. Sai estimate liên tục = -1 trust.",
    tip_advice_vi:
      "Spike (nghiên cứu time-boxed) là kỹ thuật chuẩn Scrum. Đề xuất spike khi không chắc — dấu hiệu engineer trưởng thành. Junior cam kết bừa rồi vượt deadline; senior request spike trước.",
  },
  {
    id: "tech_worker_standup_pickup_someone_task",
    category: "standup_sprint_planning",
    title_vi: "Đề nghị nhận việc giúp",
    title_en: "Offering to take a task",
    sentences: [
      { en: "I have some bandwidth this afternoon — I can take that off your plate.", vi: "Em có thời gian chiều nay — em làm giúp ạ.", pronunciation_focus: ["bandwidth", "plate"] },
      { en: "If it's a quick one, I can probably ship it today.", vi: "Nếu việc ngắn, em có thể xong hôm nay ạ.", pronunciation_focus: ["quick", "ship"] },
      { en: "Just send me the ticket and any context.", vi: "Gửi em ticket và context ạ.", pronunciation_focus: ["ticket", "context"] },
      { en: "Happy to help.", vi: "Em sẵn sàng giúp ạ.", pronunciation_focus: ["happy", "help"] },
    ],
    cultural_notes_vi:
      "Đề nghị giúp = team player score +1. 'Take it off your plate' là idiom thân thiện. Junior chỉ tập trung task của mình → chậm thăng tiến. Senior chủ động giúp → được nhớ ở performance review.",
    tip_advice_vi:
      "Lưu ý cân bằng: giúp 1-2 việc/sprint là tốt, giúp 5 việc = quên task chính. Manager đánh giá theo work balance. 'Helpful but not focused' là feedback thường gặp.",
  },
  {
    id: "tech_worker_standup_pushback_scope",
    category: "standup_sprint_planning",
    title_vi: "Pushback khi scope tăng",
    title_en: "Pushing back on expanded scope",
    sentences: [
      { en: "Just to flag — that requirement wasn't in the original spec.", vi: "Em xin lưu ý — yêu cầu đó không có trong spec ban đầu ạ.", pronunciation_focus: ["flag", "spec"] },
      { en: "Adding it now will push the deadline by about three days.", vi: "Thêm bây giờ sẽ kéo deadline thêm 3 ngày ạ.", pronunciation_focus: ["push", "deadline"] },
      { en: "Are we okay with that, or should we cut something else?", vi: "Mình chấp nhận, hay cắt phần khác ạ?", pronunciation_focus: ["okay", "cut"] },
      { en: "Want to align before I commit either way.", vi: "Em muốn thống nhất trước khi cam kết ạ.", pronunciation_focus: ["align", "commit"] },
    ],
    cultural_notes_vi:
      "Scope creep là rủi ro lớn nhất sprint. Không pushback = bị quá tải = chậm deadline = fail. Pushback đúng cách = đề xuất trade-off, không phải 'no'. Câu 'or should we cut something else' chuẩn.",
    tip_advice_vi:
      "Người Việt văn hóa hay 'gật cho xong' — sai. Mỹ tech yêu cầu pushback có lý. Im lặng = đồng ý = trách nhiệm khi miss. Pushback có data = chuyên nghiệp = manager respect.",
  },
];

// ── 3. PR reviews (10) ───────────────────────────────────────────────────

const PR_REVIEWS: TechWorkerLesson[] = [
  {
    id: "tech_worker_pr_request_review",
    category: "pr_reviews",
    title_vi: "Đề nghị review PR",
    title_en: "Asking for a PR review",
    sentences: [
      { en: "Hi, mind taking a look at this when you have a sec?", vi: "Anh/chị xem giúp em PR này khi rảnh được không ạ?", pronunciation_focus: ["mind", "sec"] },
      { en: "It's about 200 lines and touches the auth flow you owned.", vi: "Khoảng 200 dòng, có ảnh hưởng đến auth flow của anh/chị ạ.", pronunciation_focus: ["touches", "owned"] },
      { en: "Not blocking anything urgent — by EOW is great.", vi: "Không gấp — cuối tuần này là ổn ạ.", pronunciation_focus: ["blocking", "urgent"] },
      { en: "Happy to walk through it on a quick call if easier.", vi: "Em call qua giải thích nhanh nếu tiện hơn ạ.", pronunciation_focus: ["walk through", "easier"] },
    ],
    cultural_notes_vi:
      "PR review request phải có (1) ai phù hợp review, (2) độ lớn, (3) độ gấp. Nói 'blocking' = thu hút chú ý ngay. Không gấp = nói rõ deadline. Mặc định 'urgent' khi không cần = team ghi nhớ tiêu cực.",
    tip_advice_vi:
      "Đính kèm context trong PR description: tại sao thay đổi, screenshots/tests đã chạy, areas cần focus review. Reviewer tốn thời gian đoán = -1 review quality. Description tốt = review nhanh hơn 50%.",
  },
  {
    id: "tech_worker_pr_giving_suggestion",
    category: "pr_reviews",
    title_vi: "Gợi ý 'consider' thay vì 'should'",
    title_en: "Soft suggestion: 'consider' over 'should'",
    sentences: [
      { en: "Consider extracting this into a helper — it's used in three places now.", vi: "Cân nhắc tách thành helper — đang dùng 3 nơi ạ.", pronunciation_focus: ["consider", "extracting"] },
      { en: "What do you think about caching this result?", vi: "Cache kết quả này thì sao ạ?", pronunciation_focus: ["caching", "result"] },
      { en: "I've seen people use a state machine here — might be worth exploring.", vi: "Em từng thấy nhiều người dùng state machine ở đây — có thể đáng thử ạ.", pronunciation_focus: ["state machine", "exploring"] },
      { en: "Not blocking — just a thought.", vi: "Không bắt buộc — chỉ là ý tưởng ạ.", pronunciation_focus: ["blocking", "thought"] },
    ],
    cultural_notes_vi:
      "'You should X' = áp đặt, ego cao. 'Consider X' / 'What do you think about Y?' = tôn trọng tác giả. PR review là conversation, không phải command. Junior thường 'should'; senior 'consider'.",
    tip_advice_vi:
      "Câu 'I've seen people do Z' chuyển ego — không phải 'tôi nghĩ Z' (đối đầu). Học 5 cụm gợi ý mềm: 'consider', 'what do you think about', 'I've seen', 'might be worth', 'one option is'. Dùng luân phiên.",
  },
  {
    id: "tech_worker_pr_blocking_change",
    category: "pr_reviews",
    title_vi: "Bắt buộc thay đổi (blocking)",
    title_en: "Requesting a required change",
    sentences: [
      { en: "This is blocking for me — we can't ship without input validation here.", vi: "Cái này em chặn merge — không thể ship mà thiếu input validation ạ.", pronunciation_focus: ["blocking", "validation"] },
      { en: "Right now a malformed request would bypass the rate-limiter entirely.", vi: "Hiện tại request sai định dạng có thể bypass rate-limiter hoàn toàn ạ.", pronunciation_focus: ["malformed", "bypass"] },
      { en: "Happy to pair if it speeds things up.", vi: "Em pair cùng nếu nhanh hơn ạ.", pronunciation_focus: ["pair", "speeds"] },
      { en: "Once that's fixed, I'm an LGTM.", vi: "Sửa xong, em duyệt ngay ạ.", pronunciation_focus: ["fixed", "LGTM"] },
    ],
    cultural_notes_vi:
      "'Blocking' không phải tấn công — là chỉ ra rủi ro. Phải có (1) lý do cụ thể, (2) hệ quả. KHÔNG nói 'this is wrong' — nói 'this could cause X'. LGTM (Looks Good To Me) là viết tắt chuẩn approve.",
    tip_advice_vi:
      "Đề nghị pair khi blocking = giảm bực bội. Tác giả hiểu mình muốn giúp, không phải gây khó. Câu 'happy to pair' đặc biệt hiệu quả với junior đang stress vì PR bị chặn.",
  },
  {
    id: "tech_worker_pr_defending_design",
    category: "pr_reviews",
    title_vi: "Bảo vệ thiết kế của mình",
    title_en: "Defending your design choice",
    sentences: [
      { en: "Good question — I went with hash map because the read pattern is hot.", vi: "Câu hỏi hay — em chọn hash map vì read pattern rất nóng ạ.", pronunciation_focus: ["pattern", "hot"] },
      { en: "Tree map would be cleaner, but it's 30% slower in our benchmarks.", vi: "Tree map gọn hơn, nhưng chậm hơn 30% trong benchmark ạ.", pronunciation_focus: ["benchmarks"] },
      { en: "I documented the trade-off in the comment above the function.", vi: "Em ghi trade-off trong comment phía trên hàm ạ.", pronunciation_focus: ["trade-off", "function"] },
      { en: "Open to changing if you see something I missed.", vi: "Em sẵn sàng đổi nếu anh/chị thấy gì em sót ạ.", pronunciation_focus: ["open", "missed"] },
    ],
    cultural_notes_vi:
      "Bảo vệ thiết kế = CHỨNG MINH với data, KHÔNG cãi. Đáp 'tôi đúng' = ego cao. Đáp 'đây là data của em, anh/chị thấy gì khác?' = senior. Đáp 'open to changing' giữ tâm thế hợp tác.",
    tip_advice_vi:
      "Khi pushback PR review, ALWAYS có data: benchmark, profiler output, trade-off table. Không có data = chỉ là ý kiến = không thuyết phục. Document trade-offs trong code comment để PR review sau khỏi tranh cãi lại.",
  },
  {
    id: "tech_worker_pr_accepting_feedback",
    category: "pr_reviews",
    title_vi: "Nhận feedback một cách nhã nhặn",
    title_en: "Accepting feedback gracefully",
    sentences: [
      { en: "Good catch — I missed that edge case.", vi: "Bắt hay — em sót edge case đó ạ.", pronunciation_focus: ["catch", "edge case"] },
      { en: "You're right — let me refactor that.", vi: "Anh/chị đúng — em refactor ạ.", pronunciation_focus: ["right", "refactor"] },
      { en: "Honestly hadn't thought about that angle.", vi: "Thật lòng em chưa nghĩ đến góc đó ạ.", pronunciation_focus: ["thought", "angle"] },
      { en: "Will update and re-request review.", vi: "Em update và xin review lại ạ.", pronunciation_focus: ["update", "re-request"] },
    ],
    cultural_notes_vi:
      "'Good catch' / 'You're right' = senior. Defending mọi feedback = junior. Tâm lý Mỹ tech: nhận feedback = improve. Resist feedback = ego problem. Câu 'honestly hadn't thought about that' chân thành.",
    tip_advice_vi:
      "Quy tắc: feedback đúng → cảm ơn + sửa nhanh. Feedback sai → trả lời với data. Feedback mơ hồ → hỏi cho rõ. ĐỪNG defensive bằng 'why' — câu này nghe đối đầu trong tech Mỹ.",
  },
  {
    id: "tech_worker_pr_nit_pick",
    category: "pr_reviews",
    title_vi: "Comment 'nit' — góp ý nhỏ",
    title_en: "Marking small style suggestions as 'nit'",
    sentences: [
      { en: "Nit: variable name could be more descriptive — maybe 'parsedHeaders' instead of 'p'.", vi: "Góp ý nhỏ: tên biến có thể rõ hơn — 'parsedHeaders' thay 'p' chẳng hạn ạ.", pronunciation_focus: ["nit", "descriptive"] },
      { en: "Nit: minor — could combine these two if-statements.", vi: "Nhỏ thôi — có thể gộp hai if-statement này ạ.", pronunciation_focus: ["combine", "statements"] },
      { en: "Nit: trailing whitespace on line 47.", vi: "Nhỏ: thừa whitespace dòng 47 ạ.", pronunciation_focus: ["trailing", "whitespace"] },
      { en: "Take it or leave it — not blocking.", vi: "Tùy anh/chị — không chặn ạ.", pronunciation_focus: ["take", "leave"] },
    ],
    cultural_notes_vi:
      "'Nit' = nitpick = góp ý nhỏ về style/preference, không bắt buộc. Đánh dấu 'nit' rõ ràng = reviewer ưu tiên thông điệp lớn (logic/security). Không 'nit' = tác giả nghĩ everything quan trọng = stress.",
    tip_advice_vi:
      "Tỷ lệ nit/blocking nên là 5:1 hoặc cao hơn. Quá nhiều blocking = khó tính. Quá nhiều nit không đánh dấu = mơ hồ. Senior reviewer biết phân loại — junior thường 'blocking' tất cả.",
  },
  {
    id: "tech_worker_pr_thanks_reviewer",
    category: "pr_reviews",
    title_vi: "Cảm ơn reviewer cuối PR",
    title_en: "Thanking the reviewer at merge",
    sentences: [
      { en: "Thanks for the thorough review — really sharpened the design.", vi: "Cảm ơn anh/chị review kỹ — thiết kế tốt hơn nhiều ạ.", pronunciation_focus: ["thorough", "sharpened"] },
      { en: "Took your suggestions on caching and the helper extraction.", vi: "Em đã làm theo gợi ý cache và tách helper ạ.", pronunciation_focus: ["caching", "extraction"] },
      { en: "Ping me if anything comes up post-merge.", vi: "Có gì sau merge anh/chị nhắn em ạ.", pronunciation_focus: ["ping", "post-merge"] },
      { en: "Merging now.", vi: "Em merge ạ.", pronunciation_focus: ["merging"] },
    ],
    cultural_notes_vi:
      "Cảm ơn reviewer = team culture tốt. Tác giả không cảm ơn = lạnh = team xa cách. Nói 'sharpened the design' công nhận giá trị của review. Nhỏ nhặt nhưng tích lũy thành reputation tốt.",
    tip_advice_vi:
      "Nếu PR có 5+ reviewer, tag từng người trong comment cảm ơn. Đặc biệt junior — họ rất nhớ khi senior cảm ơn. Đây là cách xây team relationships kéo dài 5-10 năm trong industry.",
  },
  {
    id: "tech_worker_pr_disagree_politely",
    category: "pr_reviews",
    title_vi: "Không đồng ý nhưng giữ lịch sự",
    title_en: "Politely disagreeing on a review point",
    sentences: [
      { en: "I see where you're coming from, but I'd push back a little here.", vi: "Em hiểu ý anh/chị, nhưng em xin đề xuất khác ạ.", pronunciation_focus: ["coming", "push back"] },
      { en: "The trade-off I'm optimizing for is readability, not performance.", vi: "Em đang ưu tiên đọc dễ chứ không phải tốc độ ạ.", pronunciation_focus: ["trade-off", "optimizing"] },
      { en: "If we measured this is hot path, I'd absolutely refactor — but profiler shows it's cold.", vi: "Nếu đây là hot path em sẽ refactor — nhưng profiler cho thấy là cold ạ.", pronunciation_focus: ["measured", "profiler"] },
      { en: "Curious what you think.", vi: "Anh/chị nghĩ sao ạ?", pronunciation_focus: ["curious"] },
    ],
    cultural_notes_vi:
      "'I see where you're coming from' = công nhận ý người khác trước khi disagree. ĐỪNG bắt đầu bằng 'No' hoặc 'But' — quá đối đầu. Câu 'curious what you think' mở conversation, không đóng.",
    tip_advice_vi:
      "Quy tắc 'agree first, disagree second': công nhận điểm hợp lý của họ → đưa lý do mình → mời họ phản hồi. Cấu trúc này gọi là 'sandwich technique'. Người Việt vốn lịch sự — kỹ năng này tự nhiên với chúng ta.",
  },
  {
    id: "tech_worker_pr_too_large",
    category: "pr_reviews",
    title_vi: "Đề nghị tách PR lớn",
    title_en: "Asking to split a large PR",
    sentences: [
      { en: "This is over 800 lines — would you mind splitting into smaller PRs?", vi: "PR này hơn 800 dòng — anh/chị tách nhỏ giúp em được không ạ?", pronunciation_focus: ["splitting", "smaller"] },
      { en: "I can review the refactor part separately from the new feature.", vi: "Em review phần refactor riêng khỏi tính năng mới ạ.", pronunciation_focus: ["refactor", "feature"] },
      { en: "Smaller PRs get more careful eyes.", vi: "PR nhỏ hơn được review kỹ hơn ạ.", pronunciation_focus: ["careful", "eyes"] },
      { en: "Happy to merge in pieces.", vi: "Em vui lòng merge từng phần ạ.", pronunciation_focus: ["pieces"] },
    ],
    cultural_notes_vi:
      "PR > 500 dòng được review qua loa hơn — research thực tế. Reviewer mỏi mắt → bug lọt qua. Tác giả thường nghĩ PR lớn = tiến bộ; thực ra PR nhỏ = chất lượng cao + ship nhanh.",
    tip_advice_vi:
      "Quy tắc 200-400 dòng/PR. Trên 500 = đỏ cờ. Câu 'smaller PRs get more careful eyes' là argument có data — research từ Google, Microsoft. Dùng khi pushback PR khổng lồ.",
  },
  {
    id: "tech_worker_pr_ask_clarification",
    category: "pr_reviews",
    title_vi: "Hỏi cho rõ trước khi review",
    title_en: "Asking for clarification before reviewing",
    sentences: [
      { en: "Quick question before I dive in — what problem does this PR solve?", vi: "Hỏi nhanh trước — PR này giải quyết vấn đề gì ạ?", pronunciation_focus: ["dive", "solve"] },
      { en: "I want to make sure I'm reviewing for the right thing.", vi: "Em muốn chắc review đúng trọng tâm ạ.", pronunciation_focus: ["reviewing", "right"] },
      { en: "Is there a design doc or ticket I should read first?", vi: "Có design doc hay ticket nào em đọc trước không ạ?", pronunciation_focus: ["design doc", "ticket"] },
      { en: "Then I'll do a proper review.", vi: "Sau đó em review kỹ ạ.", pronunciation_focus: ["proper"] },
    ],
    cultural_notes_vi:
      "Review không có context = review tệ. Hỏi context = chuyên nghiệp. Tác giả responsible viết description tốt — nếu không, reviewer được phép hỏi. Đừng đoán bừa và 'rubber stamp' approve.",
    tip_advice_vi:
      "'Rubber stamp' = approve mà không đọc kỹ. Junior thường rubber stamp PR của senior vì sợ hỏi. Sai — senior thực sự muốn review thật. Hỏi context = senior reviewer respect.",
  },
];

// ── 4. Bug reporting and triaging (5) ────────────────────────────────────

const BUG_REPORTING: TechWorkerLesson[] = [
  {
    id: "tech_worker_bug_clear_repro",
    category: "bug_reporting",
    title_vi: "Repro steps rõ ràng",
    title_en: "Clear repro steps",
    sentences: [
      { en: "Steps to reproduce: 1) Log in as a free-tier user, 2) Click 'Upgrade', 3) Modal shows wrong price.", vi: "Các bước tái hiện: 1) Đăng nhập tier free, 2) Bấm 'Upgrade', 3) Modal hiện sai giá ạ.", pronunciation_focus: ["reproduce", "modal"] },
      { en: "Expected: $9.99/month. Actual: $99/month.", vi: "Mong đợi: 9.99 đô/tháng. Thực tế: 99 đô/tháng ạ.", pronunciation_focus: ["expected", "actual"] },
      { en: "Reproducible 100% on staging in Chrome and Firefox.", vi: "Tái hiện 100% trên staging với Chrome và Firefox ạ.", pronunciation_focus: ["reproducible", "staging"] },
      { en: "Screenshot and HAR file attached.", vi: "Em đính kèm screenshot và HAR file ạ.", pronunciation_focus: ["screenshot", "HAR"] },
    ],
    cultural_notes_vi:
      "Bug report tệ = tốn 30 phút back-and-forth. Bug report tốt = fix trong giờ. Format chuẩn: Steps + Expected + Actual + Reproducibility + Attachments. Thiếu một phần = bị reject.",
    tip_advice_vi:
      "Học cụm 'Expected vs Actual' đến mức bản năng. Đây là khung tư duy QA. Người Việt hay viết 'It doesn't work' → engineer không biết bắt đầu từ đâu. Nói rõ what you saw vs what you expected.",
  },
  {
    id: "tech_worker_bug_severity",
    category: "bug_reporting",
    title_vi: "Phân loại mức độ nghiêm trọng",
    title_en: "Classifying severity",
    sentences: [
      { en: "I'd classify this as P1 — payment flow is broken for 100% of new signups.", vi: "Em phân loại là P1 — flow thanh toán hỏng 100% với signup mới ạ.", pronunciation_focus: ["classify", "broken"] },
      { en: "This is P3 — cosmetic issue on a settings page used by less than 5% of users.", vi: "P3 — lỗi giao diện trên trang settings, dưới 5% user dùng ạ.", pronunciation_focus: ["cosmetic", "settings"] },
      { en: "Can you confirm the severity before I escalate?", vi: "Anh/chị xác nhận mức độ trước khi em escalate ạ?", pronunciation_focus: ["confirm", "escalate"] },
      { en: "If P1, we should page on-call.", vi: "Nếu P1, mình page on-call ạ.", pronunciation_focus: ["page", "on-call"] },
    ],
    cultural_notes_vi:
      "Severity (P0-P4) là ngôn ngữ chung tech: P0 = production down, P1 = critical, P2 = major, P3 = minor, P4 = trivial. Phân loại đúng = team prioritize đúng. Phân loại P1 mọi thứ = team mệt mỏi.",
    tip_advice_vi:
      "Justify severity bằng impact: bao nhiêu user, bao nhiêu revenue, có workaround không. 'It's important to me' = không phải severity. 'Affects 100% of paying customers' = severity rõ.",
  },
  {
    id: "tech_worker_bug_reproducibility",
    category: "bug_reporting",
    title_vi: "Tái hiện có ổn định không",
    title_en: "Reproducibility — flake or solid",
    sentences: [
      { en: "Reproduces 1 in 5 attempts — likely a race condition.", vi: "Tái hiện 1 trên 5 lần — có thể là race condition ạ.", pronunciation_focus: ["reproduces", "race"] },
      { en: "I've ruled out browser cache and extensions.", vi: "Em đã loại trừ cache trình duyệt và extensions ạ.", pronunciation_focus: ["ruled out", "extensions"] },
      { en: "Same machine, same network — flake is on the server side.", vi: "Cùng máy, cùng mạng — flake ở server ạ.", pronunciation_focus: ["flake", "server"] },
      { en: "Logs show a 503 from the load-balancer.", vi: "Log cho thấy 503 từ load-balancer ạ.", pronunciation_focus: ["logs", "load-balancer"] },
    ],
    cultural_notes_vi:
      "'Flake' (lỗi không ổn định) khó debug nhất. Nói rõ tỷ lệ tái hiện = engineer nắm scope. 'Sometimes happens' = vô ích — nói '1 in 5' / '30% of time'. Số liệu giúp narrow down.",
    tip_advice_vi:
      "Khi báo flake, attach: tần suất, môi trường, đã thử gì để rule out. 'Race condition' / 'memory leak' / 'timeout' là các nguyên nhân thường gặp — đoán có học vị > đoán bừa.",
  },
  {
    id: "tech_worker_bug_workaround",
    category: "bug_reporting",
    title_vi: "Đề xuất workaround tạm thời",
    title_en: "Suggesting a temporary workaround",
    sentences: [
      { en: "Until this is fixed, users can clear cookies as a workaround.", vi: "Trước khi fix, user xóa cookies như workaround tạm ạ.", pronunciation_focus: ["fixed", "workaround"] },
      { en: "I've added the workaround steps to the help-center article.", vi: "Em đã thêm các bước workaround vào bài help-center ạ.", pronunciation_focus: ["help-center", "article"] },
      { en: "Customer support has the script if anyone calls in.", vi: "CS đã có script nếu khách gọi ạ.", pronunciation_focus: ["script", "calls"] },
      { en: "Should buy us 24-48 hours to ship a real fix.", vi: "Đủ thời gian 24-48 giờ để ship fix thật ạ.", pronunciation_focus: ["buy us", "ship"] },
    ],
    cultural_notes_vi:
      "Engineer giỏi nghĩ workaround song song với fix. Workaround = giảm áp lực = fix có chất lượng hơn. Junior chỉ nghĩ fix → bị áp lực → ship fix tệ → bug mới. Senior nghĩ cả hai.",
    tip_advice_vi:
      "Document workaround ở 3 nơi: (1) bug ticket, (2) Slack channel team, (3) help-center cho CS dùng. Forget step (3) = CS gọi engineer mỗi lần khách hỏi = workflow tệ.",
  },
  {
    id: "tech_worker_bug_cant_repro",
    category: "bug_reporting",
    title_vi: "Khi không tái hiện được",
    title_en: "When you can't reproduce",
    sentences: [
      { en: "I tried for 30 minutes and couldn't reproduce on my end.", vi: "Em thử 30 phút nhưng không tái hiện được phía em ạ.", pronunciation_focus: ["tried", "reproduce"] },
      { en: "Can you share the exact browser version and any error messages?", vi: "Cho em xin browser version và error message cụ thể ạ?", pronunciation_focus: ["browser", "messages"] },
      { en: "Also, what time did this happen — I'll check server logs.", vi: "Lúc nào xảy ra — em check server log ạ.", pronunciation_focus: ["check", "logs"] },
      { en: "If we can't repro, I'll add observability and we revisit if it happens again.", vi: "Nếu vẫn không repro, em thêm observability và revisit nếu lặp lại ạ.", pronunciation_focus: ["observability", "revisit"] },
    ],
    cultural_notes_vi:
      "ĐỪNG đóng ticket vì 'cant repro' — đây là junior move. Senior add observability (log, metrics, alerts) trước khi đóng. Nếu lặp lại, log có sẵn để debug. 'Cant repro + closed' = sẽ comeback to bite.",
    tip_advice_vi:
      "Câu 'add observability and we revisit' chuyên nghiệp. Show ứng cứ kỷ luật engineer — không bỏ qua, không hứa fix khi không có data. Manager đánh giá cao thái độ này ở performance review.",
  },
];

// ── 5. Demo / presentation (5) ───────────────────────────────────────────

const DEMO: TechWorkerLesson[] = [
  {
    id: "tech_worker_demo_set_context_first",
    category: "demo_presentation",
    title_vi: "Đặt context trước khi demo",
    title_en: "Setting context before the demo",
    sentences: [
      { en: "Before I show the demo, let me set context — three minutes max.", vi: "Trước khi demo, em đặt context — tối đa 3 phút ạ.", pronunciation_focus: ["context", "minutes"] },
      { en: "The problem we're solving: customers were dropping off at checkout.", vi: "Vấn đề: khách rời ở bước thanh toán ạ.", pronunciation_focus: ["dropping off", "checkout"] },
      { en: "What you'll see in this demo addresses two of the top three reasons.", vi: "Demo này giải quyết 2 trong 3 lý do hàng đầu ạ.", pronunciation_focus: ["addresses", "reasons"] },
      { en: "Then we'll have time for questions at the end.", vi: "Cuối buổi mình có thời gian Q&A ạ.", pronunciation_focus: ["questions", "end"] },
    ],
    cultural_notes_vi:
      "Demo Mỹ luôn bắt đầu bằng problem statement. Nhảy vào 'đây là tính năng' = audience không hiểu tại sao quan trọng. Cấu trúc: (1) problem, (2) solution overview, (3) demo, (4) impact, (5) Q&A.",
    tip_advice_vi:
      "Tập demo 3 lần trước khi present. Lần 1: timing. Lần 2: chuyển tiếp giữa các phần. Lần 3: anticipate questions. Demo 'cold' (không tập) = bị bug live = mất uy tín ngay.",
  },
  {
    id: "tech_worker_demo_non_technical_audience",
    category: "demo_presentation",
    title_vi: "Demo cho non-technical audience",
    title_en: "Explaining to non-technical stakeholders",
    sentences: [
      { en: "I'll skip the technical details and focus on what this means for users.", vi: "Em bỏ qua chi tiết kỹ thuật, tập trung vào ý nghĩa cho user ạ.", pronunciation_focus: ["technical", "users"] },
      { en: "Think of it like a smarter spam filter — but for fraud detection.", vi: "Hình dung như spam filter thông minh hơn — nhưng cho phát hiện gian lận ạ.", pronunciation_focus: ["filter", "fraud"] },
      { en: "The result: fewer false alarms and faster legitimate transactions.", vi: "Kết quả: ít cảnh báo nhầm hơn, giao dịch thật nhanh hơn ạ.", pronunciation_focus: ["false alarms", "legitimate"] },
      { en: "Happy to go deeper on the tech if anyone wants.", vi: "Sẵn sàng đi sâu kỹ thuật nếu ai muốn ạ.", pronunciation_focus: ["deeper", "tech"] },
    ],
    cultural_notes_vi:
      "Stakeholder non-technical = product, sales, exec. Họ KHÔNG quan tâm Kafka vs RabbitMQ — họ quan tâm impact. Engineer giỏi dịch tech sang business value. 'Smarter spam filter' = analogy hay vì familiar.",
    tip_advice_vi:
      "Chuẩn bị 3 analogy cho dự án mình: (1) cho engineer khác, (2) cho product manager, (3) cho exec. Ví dụ: 'database index' → engineer (B-tree), PM (book index), exec (faster lookups → faster app).",
  },
  {
    id: "tech_worker_demo_handle_question",
    category: "demo_presentation",
    title_vi: "Trả lời câu hỏi khó",
    title_en: "Handling a hard question",
    sentences: [
      { en: "Great question — let me think for a moment.", vi: "Câu hỏi hay — cho em suy nghĩ chút ạ.", pronunciation_focus: ["great", "moment"] },
      { en: "I don't have data for that off the top of my head — I'll follow up by EOD.", vi: "Em không có data ngay — em follow up cuối ngày ạ.", pronunciation_focus: ["off the top", "follow up"] },
      { en: "Off the top — I'd estimate 15-20% but want to verify.", vi: "Em ước 15-20%, nhưng cần kiểm tra lại ạ.", pronunciation_focus: ["estimate", "verify"] },
      { en: "Anyone else have additional context?", vi: "Có ai có context thêm không ạ?", pronunciation_focus: ["additional", "context"] },
    ],
    cultural_notes_vi:
      "Câu 'I don't know but I'll find out' = senior. Bịa số liệu = mất uy tín lâu dài. 'Off the top of my head' (đoán nhanh) báo trước rằng số chưa chắc chắn. Mời người khác trả lời = team player.",
    tip_advice_vi:
      "Khi không biết, ĐỪNG ậm ừ kéo dài 30 giây. 5 giây thinking → câu trả lời rõ ràng (kể cả 'không biết'). Người Việt hay sợ 'không biết' → bịa → bị bóc trần. Mỹ tech: 'I'll get back to you' chuyên nghiệp.",
  },
  {
    id: "tech_worker_demo_status_update",
    category: "demo_presentation",
    title_vi: "Update tiến độ ngắn",
    title_en: "Quick status update",
    sentences: [
      { en: "Quick status — we're 70% done with the migration.", vi: "Update nhanh — migration đã 70% ạ.", pronunciation_focus: ["status", "migration"] },
      { en: "On track to finish by end of sprint.", vi: "Đúng kế hoạch xong cuối sprint ạ.", pronunciation_focus: ["on track", "sprint"] },
      { en: "One risk: the third-party API rate limit might slow us down on Friday.", vi: "Một rủi ro: rate limit của API bên thứ ba có thể chậm thứ Sáu ạ.", pronunciation_focus: ["risk", "rate limit"] },
      { en: "I'll flag again if it materializes.", vi: "Em báo lại nếu thành vấn đề ạ.", pronunciation_focus: ["flag", "materializes"] },
    ],
    cultural_notes_vi:
      "Status update = (1) progress %, (2) on/off track, (3) risk. KHÔNG nói chi tiết technical. Manager cần signal nhanh: ổn / cảnh báo / cháy. Update dài = manager skim → miss risk.",
    tip_advice_vi:
      "'On track' / 'at risk' / 'off track' = 3 trạng thái chuẩn. Học và dùng đúng. 'On track + risk' khác 'at risk' — risk chưa thành vấn đề. Phân biệt = manager tin tưởng.",
  },
  {
    id: "tech_worker_demo_roadmap_review",
    category: "demo_presentation",
    title_vi: "Trình bày roadmap",
    title_en: "Presenting a roadmap",
    sentences: [
      { en: "Here's our Q3 roadmap — three themes, six initiatives.", vi: "Đây là roadmap Q3 — 3 theme, 6 initiative ạ.", pronunciation_focus: ["roadmap", "themes"] },
      { en: "Theme one: reliability — focused on cutting incidents in half.", vi: "Theme 1: độ tin cậy — giảm sự cố một nửa ạ.", pronunciation_focus: ["reliability", "incidents"] },
      { en: "Theme two: developer velocity — reducing PR review time.", vi: "Theme 2: tốc độ phát triển — giảm thời gian review PR ạ.", pronunciation_focus: ["velocity", "review"] },
      { en: "What questions do you have?", vi: "Anh/chị có câu hỏi gì ạ?", pronunciation_focus: ["questions"] },
    ],
    cultural_notes_vi:
      "Roadmap Mỹ tổ chức theo theme (mục tiêu) chứ không phải feature list. 'Theme: reliability' rõ business value. 'Feature: redo logging' = chi tiết — exec không quan tâm. Theme = ngôn ngữ leadership.",
    tip_advice_vi:
      "Quy tắc 3-5 theme. Quá nhiều = scattered. Mỗi theme có 1 metric đo lường. Câu cuối luôn là 'What questions do you have?' (mở) — không 'any questions?' (đóng, hay nhận 'no').",
  },
];

// ── 6. On-call / incidents (5) ───────────────────────────────────────────

const ONCALL: TechWorkerLesson[] = [
  {
    id: "tech_worker_oncall_initial_sitrep",
    category: "oncall_incidents",
    title_vi: "Sitrep ban đầu khi page",
    title_en: "Initial sitrep when paged",
    sentences: [
      { en: "I've got the page — looking now. Will update in 5 minutes.", vi: "Em đã nhận page — đang xem. Update trong 5 phút ạ.", pronunciation_focus: ["page", "update"] },
      { en: "Initial read: API error rate spiked at 14:23 UTC.", vi: "Đọc đầu: API error rate tăng vọt lúc 14:23 UTC ạ.", pronunciation_focus: ["error rate", "spiked"] },
      { en: "Affecting 8% of requests — checking which endpoints.", vi: "Ảnh hưởng 8% request — em check endpoint nào ạ.", pronunciation_focus: ["affecting", "endpoints"] },
      { en: "Bringing in DB on-call as a precaution.", vi: "Em gọi DB on-call để phòng ngừa ạ.", pronunciation_focus: ["bringing", "precaution"] },
    ],
    cultural_notes_vi:
      "Sitrep (situation report) = câu đầu khi nhận page. Phải có (1) đã thấy, (2) đang làm gì, (3) ETA update tiếp. Im lặng 10 phút sau page = manager hoảng. Nhắn 'on it' không đủ — phải có substance.",
    tip_advice_vi:
      "Học format 'I've got it / looking now / update in N min'. Ngắn gọn nhưng chuyên nghiệp. Ngày làm on-call đầu tiên: tập câu này 5 lần để không lúng túng khi page lúc 3 giờ sáng.",
  },
  {
    id: "tech_worker_oncall_status_update_running",
    category: "oncall_incidents",
    title_vi: "Update khi sự cố đang diễn ra",
    title_en: "Status update during ongoing incident",
    sentences: [
      { en: "Update at 14:35 UTC — root cause identified as a bad config push.", vi: "Update 14:35 UTC — nguyên nhân là config push sai ạ.", pronunciation_focus: ["root cause", "config"] },
      { en: "Rolling back now — ETA recovery 5 minutes.", vi: "Đang rollback — ETA hồi phục 5 phút ạ.", pronunciation_focus: ["rolling back", "recovery"] },
      { en: "Error rate dropping — currently at 2% and falling.", vi: "Error rate giảm — còn 2% và đang xuống ạ.", pronunciation_focus: ["dropping", "falling"] },
      { en: "Will declare resolved when below 0.1% for 5 minutes.", vi: "Em declare resolved khi dưới 0.1% liên tục 5 phút ạ.", pronunciation_focus: ["declare", "resolved"] },
    ],
    cultural_notes_vi:
      "Update mỗi 10-15 phút trong incident — quá lâu = stakeholder hoảng. Format: timestamp + status + ETA + numbers. Số liệu giảm dần (8% → 2%) trấn an. Vague update ('still working') = manager mất tin.",
    tip_advice_vi:
      "Pin update vào incident channel + email exec list nếu P0/P1. Đừng để stakeholder phải hỏi 'còn live không?'. Proactive update = sự cố vẫn nghiêm trọng nhưng team kiểm soát = trust giữ.",
  },
  {
    id: "tech_worker_oncall_resolved",
    category: "oncall_incidents",
    title_vi: "Tuyên bố resolved",
    title_en: "Declaring resolved",
    sentences: [
      { en: "Declaring resolved at 14:52 UTC.", vi: "Em declare resolved lúc 14:52 UTC ạ.", pronunciation_focus: ["declaring", "resolved"] },
      { en: "Total impact: 29 minutes, 8% peak error rate, no data loss.", vi: "Tổng tác động: 29 phút, đỉnh lỗi 8%, không mất dữ liệu ạ.", pronunciation_focus: ["impact", "peak"] },
      { en: "Post-mortem will be scheduled this week.", vi: "Post-mortem sẽ lên lịch tuần này ạ.", pronunciation_focus: ["post-mortem", "scheduled"] },
      { en: "Thanks to everyone who helped.", vi: "Cảm ơn mọi người đã giúp ạ.", pronunciation_focus: ["thanks", "helped"] },
    ],
    cultural_notes_vi:
      "Resolved declaration phải có (1) timestamp, (2) tổng tác động, (3) data loss yes/no, (4) next step (post-mortem). Cảm ơn team = essential. Solo declaration không cảm ơn = lone-wolf signal.",
    tip_advice_vi:
      "Đừng ăn mừng quá nhiều khi resolved. 'Thanks to everyone' đủ. Câu 'no data loss' rất quan trọng cho stakeholder không tech — đó là điều exec hỏi đầu tiên. Báo rõ ngay.",
  },
  {
    id: "tech_worker_oncall_postmortem_blameless",
    category: "oncall_incidents",
    title_vi: "Post-mortem không đổ lỗi",
    title_en: "Blameless post-mortem",
    sentences: [
      { en: "This is a blameless post-mortem — focus on systems, not individuals.", vi: "Đây là post-mortem không đổ lỗi — tập trung vào hệ thống, không cá nhân ạ.", pronunciation_focus: ["blameless"] },
      { en: "Root cause: deploy script didn't validate config before pushing.", vi: "Nguyên nhân gốc: deploy script không validate config trước khi push ạ.", pronunciation_focus: ["root cause", "validate"] },
      { en: "Action items: 1) Add config validation step, 2) Improve rollback automation.", vi: "Action item: 1) Thêm bước validate config, 2) Cải thiện rollback tự động ạ.", pronunciation_focus: ["action items", "automation"] },
      { en: "Each item has an owner and a target date.", vi: "Mỗi item có owner và deadline ạ.", pronunciation_focus: ["owner", "target"] },
    ],
    cultural_notes_vi:
      "Blameless post-mortem là chuẩn US tech (Google SRE book). 'Anh A push code sai' = blame → người A che giấu lần sau. 'Hệ thống không validate' = systemic → fix được. Đây là khác biệt văn hóa lớn với VN management.",
    tip_advice_vi:
      "Post-mortem template: timeline (timestamps + actions) + root cause + contributing factors + action items (owner + date). Tránh từ 'fault', 'blame', 'should have'. Dùng 'system', 'process', 'gap'.",
  },
  {
    id: "tech_worker_oncall_handoff",
    category: "oncall_incidents",
    title_vi: "Bàn giao on-call",
    title_en: "On-call handoff",
    sentences: [
      { en: "Handoff time — anything still active?", vi: "Đến giờ bàn giao — còn gì đang xử lý không ạ?", pronunciation_focus: ["handoff", "active"] },
      { en: "Open: P3 ticket about email delays — investigated, not urgent.", vi: "Đang mở: ticket P3 về email chậm — đã điều tra, không gấp ạ.", pronunciation_focus: ["delays", "urgent"] },
      { en: "Watch out for the deploy at 16:00 — last week it caused brief blip.", vi: "Lưu ý deploy lúc 16:00 — tuần trước có nháy nhẹ ạ.", pronunciation_focus: ["deploy", "blip"] },
      { en: "All yours — good luck.", vi: "Em bàn giao xong — chúc may mắn ạ.", pronunciation_focus: ["all yours", "luck"] },
    ],
    cultural_notes_vi:
      "Handoff phải verbal hoặc bằng tin nhắn rõ ràng — không chỉ '#oncall channel'. Người nhận hỏi 'anything active' = chuẩn. Người giao chủ động báo risk = chuẩn. Bàn giao tệ = sự cố lúc 3 giờ sáng người mới không biết bắt đầu từ đâu.",
    tip_advice_vi:
      "Tạo handoff doc cuối shift: open tickets + ongoing investigations + scheduled events + risks to watch. 5 phút viết = giảm 1 giờ shift sau. Senior on-call luôn document tốt — đó là dấu hiệu chuyên nghiệp.",
  },
];

// ── 7. Career conversations (5) ──────────────────────────────────────────

const CAREER: TechWorkerLesson[] = [
  {
    id: "tech_worker_career_promotion_ask",
    category: "career_conversations",
    title_vi: "Đề nghị thăng chức",
    title_en: "Asking about promotion",
    sentences: [
      { en: "I'd like to talk about my path to senior in our next 1:1.", vi: "Em muốn bàn về lộ trình lên senior trong 1:1 lần tới ạ.", pronunciation_focus: ["path", "senior"] },
      { en: "Looking at the rubric, I've been operating at the senior level for the past two quarters.", vi: "Theo rubric, em đã làm việc ở mức senior 2 quý qua ạ.", pronunciation_focus: ["rubric", "operating"] },
      { en: "Examples: led the migration project, mentored two juniors, drove the design review for X.", vi: "Ví dụ: dẫn dự án migration, mentor 2 junior, dẫn design review cho X ạ.", pronunciation_focus: ["mentored", "design review"] },
      { en: "What would you need to see to support a promotion case this cycle?", vi: "Anh/chị cần thấy gì để ủng hộ promotion case kỳ này ạ?", pronunciation_focus: ["support", "cycle"] },
    ],
    cultural_notes_vi:
      "Promotion KHÔNG tự đến. Phải ASK. 'Leadership' không hỏi = không biết. Câu 'what would you need to see' chuyên nghiệp — không hỏi 'sao em chưa được lên?' (passive). Có evidence → có scope cụ thể.",
    tip_advice_vi:
      "Đọc rubric (career ladder) công ty kỹ. So sánh hành vi mình với ladder. Sưu tập 'evidence' suốt năm — ai mentor, dự án nào dẫn, design review nào chủ trì. Không có evidence = manager không có gì để argue.",
  },
  {
    id: "tech_worker_career_salary_negotiation",
    category: "career_conversations",
    title_vi: "Đàm phán lương",
    title_en: "Salary negotiation",
    sentences: [
      { en: "Thanks for the offer — I'm very interested but need to discuss the comp.", vi: "Cảm ơn offer — em rất quan tâm nhưng cần bàn về lương ạ.", pronunciation_focus: ["interested", "comp"] },
      { en: "Based on Levels.fyi data, senior engineers at peer companies are at 195k base.", vi: "Theo data Levels.fyi, senior ở công ty tương đương ở mức 195k base ạ.", pronunciation_focus: ["peer", "base"] },
      { en: "I'm asking for 195 base, with the same equity and bonus structure.", vi: "Em đề xuất 195 base, equity và bonus giữ nguyên ạ.", pronunciation_focus: ["equity", "bonus"] },
      { en: "Is there flexibility on the base?", vi: "Base có linh hoạt được không ạ?", pronunciation_focus: ["flexibility"] },
    ],
    cultural_notes_vi:
      "Đàm phán lương ở Mỹ = expectation, không phải rude. Recruiter biết offer đầu thấp 5-15% — họ ĐỢI mình counter. Không counter = mất 10-30k. VN văn hóa coi đàm phán là 'tham' — sai trong context Mỹ.",
    tip_advice_vi:
      "Quy tắc: counter 10-15% trên base + xin signing bonus + xin extra equity. Recruiter rejects all 3 = chấp nhận 1-2. ĐỪNG nói 'I need X to pay rent' — số liệu thị trường là argument duy nhất hợp lý.",
  },
  {
    id: "tech_worker_career_role_transition",
    category: "career_conversations",
    title_vi: "Chuyển vai trò",
    title_en: "Role transition conversation",
    sentences: [
      { en: "I've been thinking about moving toward platform engineering.", vi: "Em đang nghĩ chuyển sang platform engineering ạ.", pronunciation_focus: ["thinking", "platform"] },
      { en: "I'd love to start by shadowing the team for a sprint.", vi: "Em muốn bắt đầu bằng shadow team đó 1 sprint ạ.", pronunciation_focus: ["shadowing", "sprint"] },
      { en: "If it feels like a fit, we can plan a fuller transition over the next quarter.", vi: "Nếu hợp, mình lên kế hoạch chuyển toàn phần trong quý sau ạ.", pronunciation_focus: ["fit", "transition"] },
      { en: "What's your honest take?", vi: "Anh/chị nghĩ thật lòng thế nào ạ?", pronunciation_focus: ["honest", "take"] },
    ],
    cultural_notes_vi:
      "Role transition phải đề xuất TRƯỚC, không chờ manager đoán. Câu 'shadow for a sprint' = low-risk thử nghiệm — manager dễ approve. Nhảy thẳng sang team mới = burn current team. Transition khéo = không burn bridges.",
    tip_advice_vi:
      "Transition 3-step: (1) shadow 1 sprint, (2) part-time 1 quý, (3) full-time. Mỗi bước có exit nếu không hợp. Hỏi 'what's your honest take' = mời feedback thật. Manager vốn ngại push back → mời = họ thoải mái nói.",
  },
  {
    id: "tech_worker_career_performance_review",
    category: "career_conversations",
    title_vi: "Thảo luận performance review",
    title_en: "Performance review discussion",
    sentences: [
      { en: "Thanks for the review — there are a few points I'd like to dig into.", vi: "Cảm ơn review — em muốn đi sâu vài điểm ạ.", pronunciation_focus: ["review", "dig"] },
      { en: "On the 'collaboration' rating — could you give me a specific example?", vi: "Phần 'collaboration' — anh/chị có ví dụ cụ thể không ạ?", pronunciation_focus: ["collaboration", "specific"] },
      { en: "I want to make sure I understand so I can improve.", vi: "Em muốn hiểu rõ để cải thiện ạ.", pronunciation_focus: ["understand", "improve"] },
      { en: "What does great look like at the next level?", vi: "Ở mức tiếp theo, xuất sắc trông như thế nào ạ?", pronunciation_focus: ["great", "next level"] },
    ],
    cultural_notes_vi:
      "Performance review không phải 1 chiều — phép hỏi để rõ. ĐỪNG argue ngay tại buổi review (cảm xúc cao). Câu 'could you give me a specific example' chuyên nghiệp — buộc manager justify rating bằng evidence.",
    tip_advice_vi:
      "Sau review, ngủ 1 đêm rồi đặt 1:1 follow-up nếu disagree. Đừng email tranh luận ngay (record lại cảm xúc). Hỏi 'what does great look like' = chuyển từ defensive sang growth-oriented. Manager respect.",
  },
  {
    id: "tech_worker_career_mentor_request",
    category: "career_conversations",
    title_vi: "Đề nghị mentor",
    title_en: "Asking for mentorship",
    sentences: [
      { en: "I really respect how you handle technical disagreements — would you be open to mentoring me?", vi: "Em rất khâm phục cách anh/chị xử lý bất đồng kỹ thuật — anh/chị có thể mentor em không ạ?", pronunciation_focus: ["respect", "open"] },
      { en: "Maybe a 30-minute chat once a month?", vi: "30 phút mỗi tháng được không ạ?", pronunciation_focus: ["thirty", "month"] },
      { en: "I'd come prepared with specific questions each time.", vi: "Em chuẩn bị câu hỏi cụ thể mỗi lần ạ.", pronunciation_focus: ["prepared", "specific"] },
      { en: "Totally understand if you don't have bandwidth.", vi: "Em hiểu nếu anh/chị bận ạ.", pronunciation_focus: ["bandwidth"] },
    ],
    cultural_notes_vi:
      "Mentor culture mạnh ở US tech. Hỏi mentor = không bị coi yếu. Specific (lý do, format, frequency) = mentor dễ đồng ý. 'Mentor me' chung chung = bị từ chối. 'Once a month, 30 min, I bring questions' = realistic.",
    tip_advice_vi:
      "Mentor giỏi nhất không phải sếp mình — kỹ năng mentor # quản lý. Tìm senior khác team. Mentor + manager riêng biệt = perspective phong phú. Mentor 'cross-team' nhìn được điểm mù.",
  },
];

// ── 8. Team dynamics / disagreements (5) ─────────────────────────────────

const TEAM_DYNAMICS: TechWorkerLesson[] = [
  {
    id: "tech_worker_team_disagree_commit",
    category: "team_dynamics",
    title_vi: "Disagree and commit",
    title_en: "Disagree and commit",
    sentences: [
      { en: "I disagree with the direction, but I'll commit to executing it.", vi: "Em không đồng ý hướng đi, nhưng em commit thực thi ạ.", pronunciation_focus: ["disagree", "commit"] },
      { en: "I want my concerns documented for the record.", vi: "Em muốn ghi nhận concern em ạ.", pronunciation_focus: ["concerns", "record"] },
      { en: "If we hit the issues I flagged, we revisit.", vi: "Nếu gặp vấn đề em đã flag, mình xem lại ạ.", pronunciation_focus: ["flagged", "revisit"] },
      { en: "Until then, full support from me.", vi: "Đến lúc đó, em hoàn toàn ủng hộ ạ.", pronunciation_focus: ["full support"] },
    ],
    cultural_notes_vi:
      "'Disagree and commit' (Amazon principle) = nguyên tắc cốt lõi US tech. Pre-decision: bạn được pushback hết sức. Post-decision: bạn execute như chưa từng disagree. Không commit = team không thể vận hành.",
    tip_advice_vi:
      "Câu 'disagree and commit' khác 'commit silently' — nói rõ mình đã disagree là dấu hiệu integrity. Document concern bằng email/Slack = về sau nếu vấn đề thật, mình không bị blame.",
  },
  {
    id: "tech_worker_team_pushback_constructive",
    category: "team_dynamics",
    title_vi: "Pushback có tính xây dựng",
    title_en: "Constructive pushback",
    sentences: [
      { en: "I want to push back on this — and here's why.", vi: "Em không đồng ý — và đây là lý do ạ.", pronunciation_focus: ["push back", "why"] },
      { en: "The risk I see is X, with impact Y.", vi: "Rủi ro em thấy là X, tác động Y ạ.", pronunciation_focus: ["risk", "impact"] },
      { en: "Have we considered alternative approach Z?", vi: "Mình đã xem xét cách Z chưa ạ?", pronunciation_focus: ["considered", "approach"] },
      { en: "Open to being convinced — what am I missing?", vi: "Sẵn sàng được thuyết phục — em sót gì ạ?", pronunciation_focus: ["convinced", "missing"] },
    ],
    cultural_notes_vi:
      "Pushback constructive = (1) lý do, (2) rủi ro cụ thể, (3) đề xuất thay thế, (4) mời convince. Pushback chỉ 'No' = đối đầu. Pushback có alternative = collaborative. Mỹ tech: silent agreement với decision tệ = bị blame sau.",
    tip_advice_vi:
      "Câu 'what am I missing?' giảm ego — show mình open. Người Việt hay sợ pushback → bị xem 'không có chính kiến'. Mỹ tech: pushback có data = senior signal mạnh. Không pushback = junior.",
  },
  {
    id: "tech_worker_team_escalation",
    category: "team_dynamics",
    title_vi: "Escalation đúng cách",
    title_en: "Proper escalation",
    sentences: [
      { en: "I've tried to resolve this directly with the team but we're at an impasse.", vi: "Em đã cố giải quyết trực tiếp nhưng đang bế tắc ạ.", pronunciation_focus: ["resolve", "impasse"] },
      { en: "I want to escalate so we can get unblocked.", vi: "Em muốn escalate để gỡ ạ.", pronunciation_focus: ["escalate", "unblocked"] },
      { en: "Heads up — I'm looping in our skip-level for input.", vi: "Em báo trước — em sẽ loop in skip-level ạ.", pronunciation_focus: ["heads up", "skip-level"] },
      { en: "Want to make sure you're not surprised.", vi: "Em muốn anh/chị không bất ngờ ạ.", pronunciation_focus: ["surprised"] },
    ],
    cultural_notes_vi:
      "Escalation chuẩn = báo TRƯỚC khi loop in cấp trên. 'No surprises' rule là chuẩn US management. Loop skip-level mà không báo manager = burn trust = manager không bao giờ tin nữa. Báo trước = chuyên nghiệp.",
    tip_advice_vi:
      "'Skip-level' = cấp trên của manager mình. 'Heads up' / 'No surprises' là cụm bắt buộc khi escalate. Sai = manager mất mặt = quan hệ rạn nứt vĩnh viễn. Cẩn trọng — escalation là lực lớn, dùng đúng.",
  },
  {
    id: "tech_worker_team_express_concern",
    category: "team_dynamics",
    title_vi: "Bày tỏ lo ngại",
    title_en: "Expressing a concern",
    sentences: [
      { en: "I want to flag a concern about the timeline.", vi: "Em muốn flag lo ngại về timeline ạ.", pronunciation_focus: ["flag", "concern"] },
      { en: "Don't think we have enough context to commit to a date yet.", vi: "Em chưa nghĩ mình đủ context để cam kết deadline ạ.", pronunciation_focus: ["context", "commit"] },
      { en: "Could we lock the date after the design phase instead?", vi: "Mình chốt date sau pha design được không ạ?", pronunciation_focus: ["lock", "design phase"] },
      { en: "Just want to set the team up to succeed.", vi: "Em chỉ muốn team thành công ạ.", pronunciation_focus: ["set up", "succeed"] },
    ],
    cultural_notes_vi:
      "'Flag a concern' = chuyên nghiệp, neutral. KHÔNG nói 'this is bad' (đối đầu) hoặc 'I'm worried' (cảm xúc). Concern + alternative + intent ('set the team up') = mature signal.",
    tip_advice_vi:
      "Expression của lo ngại trong tech Mỹ phải concrete: bao nhiêu thời gian, bao nhiêu tiền, ai bị ảnh hưởng. 'I'm worried it might fail' = không actionable. 'Risk: 30% timeline slip due to X' = actionable.",
  },
  {
    id: "tech_worker_team_celebrate_others",
    category: "team_dynamics",
    title_vi: "Ghi nhận thành công đồng nghiệp",
    title_en: "Celebrating teammates",
    sentences: [
      { en: "Quick shoutout to Anna for landing the migration cleanly.", vi: "Xin shoutout Anna đã hoàn thành migration suôn sẻ ạ.", pronunciation_focus: ["shoutout", "cleanly"] },
      { en: "Three weeks of work, zero rollbacks — really impressive.", vi: "3 tuần làm việc, không rollback nào — thực sự ấn tượng ạ.", pronunciation_focus: ["rollbacks", "impressive"] },
      { en: "Couldn't have shipped without her debugging that race condition.", vi: "Không thể ship được nếu không có cô ấy debug race condition ạ.", pronunciation_focus: ["debugging", "race"] },
      { en: "Thanks Anna.", vi: "Cảm ơn Anna ạ.", pronunciation_focus: ["thanks"] },
    ],
    cultural_notes_vi:
      "Public shoutout trong all-hands / Slack channel = norm Mỹ tech. Người Việt khiêm tốn → ít praise đồng nghiệp công khai → team xa cách. Mỹ: praise công khai = team cohesion + được sếp đánh giá 'team player'.",
    tip_advice_vi:
      "Quy tắc 1:1 — mỗi tuần ít nhất 1 public shoutout cho ai đó. Specific (việc gì, kết quả gì) chứ không chung chung 'great job'. Đây là hành vi senior signaler — kèm career advance.",
  },
];

// ── Aggregate + helpers ──────────────────────────────────────────────────

export const TECH_WORKER_LESSONS: ReadonlyArray<TechWorkerLesson> = [
  ...INTERVIEWS,
  ...STANDUP,
  ...PR_REVIEWS,
  ...BUG_REPORTING,
  ...DEMO,
  ...ONCALL,
  ...CAREER,
  ...TEAM_DYNAMICS,
];

export function getLessonsByCategory(
  category: TechWorkerCategoryId,
): TechWorkerLesson[] {
  return TECH_WORKER_LESSONS.filter((l) => l.category === category);
}

export function getLessonById(id: string): TechWorkerLesson | undefined {
  return TECH_WORKER_LESSONS.find((l) => l.id === id);
}

/** Pack-level metadata, mirroring the nail-tech / customer-service shape. */
export const TECH_WORKER_PACK = Object.freeze({
  slug: "tech-worker",
  title_vi: "Tiếng Anh dành cho dân tech",
  title_en: "English for tech workers",
  intro_vi:
    "Tiếng Anh cho dev, QA, technical PM, designer, devops. Made by người Việt — học cách giao tiếp trong môi trường engineering Mỹ. 50 bài tập trung vào phỏng vấn kỹ thuật, standup, review PR, on-call, và các tình huống nghề nghiệp người Việt thường gặp ở Big Tech và startup.",
});

export default TECH_WORKER_PACK;
