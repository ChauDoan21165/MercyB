// src/data/mock-interviews/professional-scenarios.ts
//
// A9 — High-stakes professional mock-interview scenarios.
//
// Why a separate file from scenarios.ts:
//   scenarios.ts holds 5 hand-crafted diaspora-role scenarios (server,
//   nail tech, etc.) with a strict shape used by the existing
//   /interview flow. This file holds 30 *professional* scenarios with
//   a richer schema (depth tags, weak-phrasing alternatives, system
//   prompts for Mercy-as-interviewer). Splitting keeps the existing
//   test contract intact.
//
// Coverage — 5 verticals × 6 scenarios:
//   software    — junior dev, senior dev, DevOps, designer, PM, QA
//   university  — why-this-uni, challenge, research, community, career, major
//   visa        — US tourist, US F-1, US H-1B, AU skilled, UK visitor, CA study
//   promotion   — deserve-it, conflict, weakness, change-team, failure, 5-years
//   sales       — cold call, objections, demo, negotiation, onboarding, complaint
//
// Voice rules (same as scenarios.ts):
//   - Hand-written. Not LLM-generated. Vietnamese-speaker pitfalls
//     are culturally specific, not generic ESL advice.
//   - VN is primary surface; EN is the practice target.
//   - `vietnamese_speaker_pitfalls` are the things a Vietnamese
//     candidate, specifically, gets wrong — modesty culture, dropped
//     past tense, "we" instead of "I", over-apologizing, etc.
//   - `common_weak_phrasings` give a *better alternative*, not a
//     grammar correction — register matters more than tense here.

export type ProVertical =
  | "software"
  | "university"
  | "visa"
  | "promotion"
  | "sales";

export type ProLevel = "entry" | "mid" | "senior";

export type QuestionDepth = "surface" | "follow-up" | "stress test";

export interface ProInterviewQuestion {
  question_en: string;
  question_vi: string;
  depth: QuestionDepth;
}

export interface WeakPhrasing {
  what_not_to_say: string;
  why: string;
  better_alternative: string;
}

export interface ProInterviewScenario {
  id: string;
  vertical: ProVertical;
  role: string;
  level: ProLevel;
  title_vi: string;
  title_en: string;
  /** VN-first 1–3 sentence framing: setting, interviewer style, pressure. */
  context: string;
  typical_questions: ProInterviewQuestion[];
  /** 5+ Vietnamese-speaker pitfalls — culturally specific, not generic. */
  vietnamese_speaker_pitfalls: string[];
  /** What a band-7+ answer looks like for the headline question. */
  sample_strong_answer: string;
  common_weak_phrasings: WeakPhrasing[];
  estimated_time_minutes: number;
  /** System prompt for Mercy-as-interviewer; reused by the chat layer. */
  interviewer_system_prompt: string;
}

// ──────────────────────────────────────────────────────────────────────
// Software / IT (6)
// ──────────────────────────────────────────────────────────────────────

const SOFTWARE: ProInterviewScenario[] = [
  {
    id: "software_junior_intro",
    vertical: "software",
    role: "Junior software engineer",
    level: "entry",
    title_vi: "Junior dev — \"Giới thiệu bản thân\"",
    title_en: "Junior dev — \"Tell me about yourself\"",
    context:
      "Phỏng vấn vòng đầu cho vị trí junior tại công ty công nghệ Mỹ/Sing. Người phỏng vấn (kỹ sư cấp cao) chỉ có 30 phút, mở đầu bằng câu hỏi mềm để xem bạn nói tiếng Anh có lưu loát không — không phải để nghe tiểu sử.",
    typical_questions: [
      {
        question_en: "Tell me about yourself.",
        question_vi: "Bạn hãy giới thiệu về bản thân.",
        depth: "surface",
      },
      {
        question_en: "What kind of code have you actually shipped?",
        question_vi: "Bạn đã thực sự đẩy code nào lên production chưa?",
        depth: "follow-up",
      },
      {
        question_en: "Why are you leaving your current job — or why now?",
        question_vi: "Vì sao bạn rời công ty hiện tại — hoặc vì sao là lúc này?",
        depth: "follow-up",
      },
      {
        question_en: "What part of the stack do you want to grow into?",
        question_vi: "Bạn muốn phát triển sâu hơn ở mảng nào trong stack?",
        depth: "surface",
      },
      {
        question_en:
          "If I gave you a feature spec right now and no one to ask, what would you do first?",
        question_vi:
          "Nếu tôi giao bạn một spec ngay bây giờ và không có ai để hỏi, bạn sẽ làm gì đầu tiên?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Đọc CV thành tiếng. Câu hỏi này không phải để nghe lại CV — họ đã đọc rồi. Hãy nói 2 câu về bạn là ai, 2 câu về cái bạn đã làm gần nhất, 1 câu về vì sao bạn ở đây hôm nay.",
      "Khiêm tốn quá mức kiểu \"em chỉ là junior thôi\" — văn hoá Việt coi đó là lịch sự, người Mỹ nghe thấy là thiếu tự tin và họ sẽ không tin bạn làm được việc.",
      "Dùng \"we\" thay cho \"I\" khi kể project. Người phỏng vấn cần biết *bạn* đã làm gì, không phải team. \"We built\" → \"I built the auth flow; the team handled the rest.\"",
      "Nói \"I graduate from\" thay vì \"I graduated from\" — bỏ -ed quá khứ là lỗi sửa được trong 5 phút và tạo ấn tượng cẩu thả.",
      "Kết bằng \"That's all about me, thank you\" — nghe như học sinh đọc bài. Kết bằng một câu mở: \"Happy to go deeper on any of that.\"",
      "Trả lời quá dài (3+ phút). Mục tiêu là 60–90 giây. Người phỏng vấn sẽ ngắt nếu bạn lê thê và đó là điểm trừ ngầm.",
    ],
    sample_strong_answer:
      "I'm a backend engineer with about two years of experience, mostly Python and Postgres. At my last company I owned the billing webhook pipeline — Stripe events to internal ledger, with retries and idempotency. The thing I'm proudest of is cutting our duplicate-charge rate to zero in the first month I owned it. I'm here today because I want to work somewhere with stronger code review culture and learn from senior engineers. Happy to go deeper on any of that.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I am a hard-working person and I love coding.",
        why: "Trống rỗng. Không cho người phỏng vấn data point nào.",
        better_alternative:
          "I'm a backend engineer focused on Python and Postgres — most recently owning a billing webhook pipeline.",
      },
      {
        what_not_to_say: "I graduate from university in 2023.",
        why: "Bỏ -ed quá khứ. Lỗi này lặp lại sẽ làm bạn mất điểm độ chính xác ngôn ngữ.",
        better_alternative: "I graduated from [university] in 2023.",
      },
      {
        what_not_to_say: "I just want a chance to learn from your company.",
        why: "Nghe phụ thuộc. Phỏng vấn ở Mỹ là trao đổi giá trị hai chiều, không phải xin cơ hội.",
        better_alternative:
          "I'm looking for a team with strong review culture — that's why this role caught my eye.",
      },
    ],
    estimated_time_minutes: 8,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a senior software engineer at a US tech company conducting a 30-minute first-round interview. Your style: warm but efficient, slight time pressure, you cut off rambling answers politely after ~90 seconds. After each answer, ask one sharp follow-up that probes a specific claim. Speak only in English unless the candidate gets stuck — then offer a Vietnamese paraphrase of the question only.",
  },
  {
    id: "software_senior_project",
    vertical: "software",
    role: "Senior software engineer",
    level: "senior",
    title_vi: "Senior dev — \"Kể về một project bạn đã dẫn\"",
    title_en: "Senior dev — \"Walk me through a project you led\"",
    context:
      "Vòng technical leadership cho vị trí senior. Người phỏng vấn (engineering manager) muốn nghe bạn kể về một dự án có scope thật, có tradeoff, có người đụng chạm — không phải side project cuối tuần. Họ sẽ đào rất sâu vào quyết định của bạn.",
    typical_questions: [
      {
        question_en:
          "Walk me through a project you led from kickoff to ship.",
        question_vi:
          "Kể tôi nghe một dự án bạn đã dẫn từ lúc bắt đầu đến lúc ra mắt.",
        depth: "surface",
      },
      {
        question_en:
          "What tradeoff did you push back on, and who did you push back to?",
        question_vi:
          "Tradeoff nào bạn đã phản biện, và phản biện với ai?",
        depth: "follow-up",
      },
      {
        question_en:
          "When you disagreed with your tech lead, how did that conversation go?",
        question_vi:
          "Khi bạn bất đồng với tech lead, cuộc nói chuyện đó diễn ra thế nào?",
        depth: "stress test",
      },
      {
        question_en: "What broke after launch, and what did you do?",
        question_vi: "Sau khi launch có gì hỏng, bạn xử lý ra sao?",
        depth: "follow-up",
      },
      {
        question_en:
          "Knowing what you know now, what would you have done differently?",
        question_vi:
          "Nếu được làm lại với những gì biết hiện tại, bạn sẽ làm khác chỗ nào?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Bắt đầu bằng \"In my company we have a project…\" — nghe vô danh. Hãy đặt scene cụ thể: số user bị ảnh hưởng, deadline, ai trên bàn.",
      "Né phần xung đột. Người phỏng vấn senior *muốn* nghe bạn cãi với ai. Nếu bạn nói \"everyone agreed\" họ nghĩ bạn không thật sự dẫn.",
      "Dùng \"we decided\" cho mọi quyết định. Phải tách: \"the team decided X; my call was Y\". Senior interview là về *bạn* ra quyết định gì.",
      "Tránh nói số. Người Việt thường ngại con số vì sợ sai — nhưng \"reduced by ~30%\" mạnh hơn \"reduced significantly\". Ước lượng còn hơn không có.",
      "Trả lời câu \"what broke\" bằng \"nothing broke\". Không tin nổi — và nghe như bạn không quan tâm sau khi ship. Luôn có gì đó break; kể nó ra.",
      "Khi bị hỏi \"what would you do differently\", trả lời \"nothing, it went well\". Đó là lỗi tự kiêu kiểu Việt che giấu sự không chắc — câu trả lời này là test khả năng tự phản biện.",
    ],
    sample_strong_answer:
      "Last year I led the migration of our search backend from Elasticsearch to Postgres full-text. Scope: about 40 million documents, p95 latency budget of 200ms, four engineers, six weeks. The hard call was whether to write a dual-read migration or do a hard cutover — I pushed for dual-read against my tech lead's preference because we had no rollback plan otherwise. We caught two ranking regressions during the dual-read window that would have been incidents in a hard cutover. What I'd do differently: I underestimated reindex time by 2x. Next time I'd run the reindex on a staging mirror first.",
    common_weak_phrasings: [
      {
        what_not_to_say: "Our team did a big project for company.",
        why: "Không có scope, không có vai trò của bạn. Nghe như background context của ai đó khác.",
        better_alternative:
          "I led a six-week migration of our search backend — four engineers, 40M documents.",
      },
      {
        what_not_to_say: "It went smoothly, no problem.",
        why: "Không thật và không hữu ích. Senior interview cần thấy bạn xử lý việc xấu.",
        better_alternative:
          "We hit two ranking regressions in week three; I'll walk you through how we caught them.",
      },
      {
        what_not_to_say: "I think the project was successful.",
        why: "\"I think\" làm yếu câu nói khi bạn đang kể fact của chính mình.",
        better_alternative: "We shipped on time and held the latency budget.",
      },
    ],
    estimated_time_minutes: 25,
    interviewer_system_prompt:
      "You are Mercy, playing the role of an engineering manager interviewing a senior candidate. Your style: probing, you ask 'why' three times in a row, you push back on vague claims and ask for specific numbers. You especially probe conflict and disagreement — if the candidate says everyone agreed, you ask 'so when was the last time you disagreed with your manager?'. Speak only in English.",
  },
  {
    id: "software_devops_failure",
    vertical: "software",
    role: "DevOps / SRE engineer",
    level: "mid",
    title_vi: "DevOps — \"Kể về một lần deploy hỏng\"",
    title_en: "DevOps — \"Tell me about a deployment that failed\"",
    context:
      "Phỏng vấn cho vị trí DevOps cấp giữa. Người phỏng vấn là staff SRE; họ muốn xem bạn có giữ được bình tĩnh khi mọi thứ cháy không, có blame culture hay không, và có học ra được gì không.",
    typical_questions: [
      {
        question_en: "Tell me about a deployment that failed.",
        question_vi: "Kể tôi nghe một lần deploy bị hỏng.",
        depth: "surface",
      },
      {
        question_en: "Who was on call, and what was your first action?",
        question_vi:
          "Ai đang oncall, và hành động đầu tiên của bạn là gì?",
        depth: "follow-up",
      },
      {
        question_en: "How long was the user-facing impact?",
        question_vi: "Thời gian user bị ảnh hưởng là bao lâu?",
        depth: "follow-up",
      },
      {
        question_en: "What did the postmortem actually change?",
        question_vi: "Postmortem thực sự đã thay đổi điều gì?",
        depth: "stress test",
      },
      {
        question_en: "Whose fault was it?",
        question_vi: "Lỗi của ai?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Đổ lỗi cho \"the developer who pushed the code\" — văn hoá SRE Mỹ là blameless. Câu trả lời đúng là về system, process, monitoring — không về người.",
      "Né câu hỏi \"whose fault\" bằng cười trừ. Cứ nói thẳng: \"It was a process gap, not a person — let me explain why.\"",
      "Dùng quá nhiều passive voice (\"the deploy was failed\") khi căng thẳng. Tập nói chủ động: \"the deploy failed\", \"I rolled it back\", \"we caught it\".",
      "Quên mention timeline cụ thể. SRE interview rất kỹ về MTTR (mean time to recover) — phải có số phút.",
      "Bỏ qua phần monitoring/alerting. Người phỏng vấn muốn nghe bạn nghĩ về systems chứ không chỉ kể chuyện.",
      "Trả lời theo lối kể chuyện cảm xúc kiểu Việt (\"em hoảng lắm…\") — chỉ kể fact. \"I noticed the alert at 14:32. I rolled back at 14:35.\"",
    ],
    sample_strong_answer:
      "Six months ago I pushed a config change that took down our staging API for 18 minutes. The change was a Redis connection pool tweak — looked safe in code review but I missed that the new value didn't match the actual Redis instance size in staging. I caught it from the alert about 90 seconds in, rolled back, confirmed recovery at 18 minutes. The blameless postmortem changed two things: we added a config-validation step to CI that diffs against environment-specific limits, and we made staging deploys go through the same canary process as production. The real fault was a missing guardrail, not a person.",
    common_weak_phrasings: [
      {
        what_not_to_say: "It was the developer's fault for pushing bad code.",
        why: "Phá nguyên tắc blameless. Đây là red flag với mọi team SRE Mỹ.",
        better_alternative:
          "The proximate cause was a config change, but the root cause was a missing CI validation step.",
      },
      {
        what_not_to_say: "We fix it very quickly.",
        why: "Bỏ -ed; không có số liệu.",
        better_alternative: "We rolled back within three minutes; full recovery at 18 minutes.",
      },
      {
        what_not_to_say: "Luckily nobody notice.",
        why: "Bỏ -d; và \"luckily\" làm yếu vai trò của bạn.",
        better_alternative:
          "Customer impact was contained to staging — production never saw it.",
      },
    ],
    estimated_time_minutes: 15,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a staff SRE conducting a behavioral interview. Your style: calm, factual, you push for specific timestamps, MTTR numbers, and blameless framing. If the candidate blames a person, gently challenge them with 'what would have prevented that, system-side?'. Speak only in English.",
  },
  {
    id: "software_designer_feedback",
    vertical: "software",
    role: "Product designer",
    level: "mid",
    title_vi: "Designer — \"Bạn xử lý feedback từ stakeholder thế nào\"",
    title_en: "Designer — \"How do you handle stakeholder feedback\"",
    context:
      "Phỏng vấn product designer cấp giữa. Người phỏng vấn là design manager; họ kiểm tra xem bạn có để cái tôi cản trở work không, và có biết phân biệt feedback đúng vs feedback nhiễu không.",
    typical_questions: [
      {
        question_en: "How do you handle stakeholder feedback that you disagree with?",
        question_vi:
          "Bạn xử lý thế nào khi stakeholder cho feedback mà bạn không đồng ý?",
        depth: "surface",
      },
      {
        question_en:
          "Tell me about a time a PM overruled your design decision.",
        question_vi:
          "Kể về lúc một PM phủ quyết quyết định design của bạn.",
        depth: "follow-up",
      },
      {
        question_en: "How do you decide which feedback to act on?",
        question_vi: "Bạn quyết định feedback nào nên làm theo bằng cách nào?",
        depth: "follow-up",
      },
      {
        question_en:
          "If the CEO and a user researcher disagree, who do you side with?",
        question_vi:
          "Nếu CEO và một user researcher bất đồng, bạn theo bên nào?",
        depth: "stress test",
      },
      {
        question_en: "When was the last time you changed your mind on a design?",
        question_vi: "Lần gần nhất bạn đổi ý về một design là khi nào?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I always do what my manager says\" vì văn hoá tôn trọng cấp trên. Người phỏng vấn nghe thấy là không có quan điểm.",
      "Đồng thời, đẩy quá xa hướng \"I fight for my design\" — cũng sai. Designer giỏi biết khi push back và khi nhường.",
      "Dùng \"my boss\" thay vì \"my manager\" hoặc tên/role cụ thể. \"My boss\" nghe formal kiểu cũ, không tự nhiên.",
      "Né câu \"CEO vs researcher\". Trả lời thẳng: \"Depends on the question — if it's about user behavior, I weight the researcher; if it's about strategy, the CEO.\"",
      "Không có ví dụ cụ thể về việc đổi ý. Vietnamese candidates thường ngại nhận \"em sai\" — đây chính là điểm họ test.",
      "Khi kể conflict, dùng từ \"argue\" theo nghĩa cãi nhau (negative). Trong tiếng Anh công sở: \"push back\", \"disagree\", \"raise a concern\" — không \"argue\".",
    ],
    sample_strong_answer:
      "I separate feedback into two buckets: feedback about the goal versus feedback about the solution. If a stakeholder questions whether we're solving the right problem, I take that seriously even if I disagree — they often have context I don't. If they're questioning the specific solution, I push back with the user research. Last quarter our PM wanted to add a third onboarding step that I thought hurt completion. I shared the funnel data, suggested an A/B test, and we shipped my version after it won by 12 points. The hardest one for me is when senior leaders weigh in late — I've learned to bring them in earlier rather than fighting at the end.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I always listen to my boss because he is more experienced.",
        why: "Bỏ qua user; không có quan điểm độc lập.",
        better_alternative:
          "I weight feedback by how close the person is to the user — and ground decisions in research where I can.",
      },
      {
        what_not_to_say: "I argue with the PM until I win.",
        why: "Nghe như khó hợp tác. Tiếng Anh công sở dùng \"push back\", không \"argue\".",
        better_alternative:
          "I push back with data and propose an A/B test if we're stuck.",
      },
      {
        what_not_to_say: "I never change my mind because design is my expertise.",
        why: "Đỏ cờ về cái tôi. Không ai tin được câu này.",
        better_alternative:
          "Last quarter I changed my mind on a navigation pattern after watching three usability sessions.",
      },
    ],
    estimated_time_minutes: 20,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a design manager. Your style: collaborative tone but you probe for specifics and watch for ego. You ask follow-up questions about exactly how a conversation went — words used, who said what. If the answer is too abstract, you ask 'can you give me a concrete example from the last six months?'. Speak only in English.",
  },
  {
    id: "software_pm_priority",
    vertical: "software",
    role: "Product manager",
    level: "mid",
    title_vi: "PM — \"Bạn ưu tiên features thế nào\"",
    title_en: "PM — \"How do you prioritize features\"",
    context:
      "Phỏng vấn product manager. Người phỏng vấn là head of product; họ kiểm tra framework tư duy của bạn, không phải framework tên gì. Họ ghét câu trả lời thuộc lòng kiểu RICE, MoSCoW.",
    typical_questions: [
      {
        question_en: "How do you prioritize features when everything feels urgent?",
        question_vi:
          "Bạn ưu tiên features thế nào khi mọi thứ đều thấy gấp?",
        depth: "surface",
      },
      {
        question_en:
          "Walk me through how you'd cut your roadmap by 50% next quarter.",
        question_vi:
          "Kể tôi nghe bạn sẽ cắt 50% roadmap quý sau bằng cách nào.",
        depth: "follow-up",
      },
      {
        question_en:
          "What's a feature you killed that the team wanted to ship?",
        question_vi:
          "Một feature bạn đã giết mặc dù team muốn launch — kể tôi nghe.",
        depth: "stress test",
      },
      {
        question_en: "How do you say no to a sales-driven request?",
        question_vi: "Bạn từ chối yêu cầu từ Sales bằng cách nào?",
        depth: "follow-up",
      },
      {
        question_en:
          "If revenue and user trust pull opposite directions, what do you do?",
        question_vi:
          "Nếu doanh thu và niềm tin của user kéo về hai hướng, bạn xử lý ra sao?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Bắt đầu bằng \"I use RICE framework\" — nghe rỗng và thuộc lòng. Senior PM ghét tên framework, họ thích nghe bạn nghĩ thật.",
      "Trả lời \"I ask my manager what to prioritize\" — sai vai trò. PM là người *quyết định* prioritization, không phải người chạy việc.",
      "Né câu \"feature bạn đã giết\". Phải có ví dụ thật. Nếu chưa từng cắt feature nào, bạn chưa thật sự là PM.",
      "Dùng \"customer\" cho cả user lẫn người trả tiền lẫn sales. Phải tách: user, customer, buyer — ba thứ khác nhau.",
      "Khi nói về \"trade-off\", phát âm thành \"trade-up\" hoặc \"trade-of\". Tập riêng từ này — nó xuất hiện trong mọi PM interview.",
      "Trả lời câu \"revenue vs trust\" kiểu \"both are important\" — đây là câu test có dám có quan điểm không. Phải chọn và giải thích.",
    ],
    sample_strong_answer:
      "My default frame is: what's the smallest set of work that moves our top metric the most? Last quarter our team had 14 candidate features and capacity for maybe four. I started by killing everything that didn't tie to one of two goals — activation rate and weekly retention. That cut us to nine. Then I sequenced by dependency and shipped the unblockers first. The hard call was killing a feature engineering had been excited about — a new export format — because no user had asked for it in three months of feedback. I told the team directly, showed the data, and we redirected to a churn-driver instead. Sales pushed for a custom integration that quarter and I said no by offering a one-off services contract instead.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I use RICE framework to score everything.",
        why: "Câu thuộc lòng. Không cho thấy bạn nghĩ.",
        better_alternative:
          "I anchor on one or two top metrics and cut anything that doesn't move them.",
      },
      {
        what_not_to_say: "Both revenue and trust are important.",
        why: "Né câu hỏi. Test này là về có dám có quan điểm.",
        better_alternative:
          "I weight long-term trust higher because revenue follows trust, not the other way around.",
      },
      {
        what_not_to_say: "I never say no to sales.",
        why: "Mất thẩm quyền PM ngay. Sales phải bị nói no thường xuyên.",
        better_alternative:
          "I say no to most sales requests by offering them a workaround or a services contract instead.",
      },
    ],
    estimated_time_minutes: 22,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a head of product at a Series-B startup. Your style: skeptical of frameworks, you ask 'okay but specifically how' twice. You probe for moments the candidate said no to a powerful stakeholder. If they cite a framework name, you ask them to walk through it without naming it. Speak only in English.",
  },
  {
    id: "software_qa_process",
    vertical: "software",
    role: "QA engineer",
    level: "mid",
    title_vi: "QA — \"Kể tôi nghe quy trình test của bạn\"",
    title_en: "QA — \"Walk me through your testing process\"",
    context:
      "Phỏng vấn QA cấp giữa. Người phỏng vấn là QA lead; họ kiểm tra bạn có tư duy systematic về risk không, hay chỉ chạy test cases ai đó viết sẵn.",
    typical_questions: [
      {
        question_en: "Walk me through your testing process for a new feature.",
        question_vi:
          "Kể tôi nghe quy trình test của bạn cho một feature mới.",
        depth: "surface",
      },
      {
        question_en:
          "How do you decide what NOT to test?",
        question_vi: "Bạn quyết định cái gì *không* cần test bằng cách nào?",
        depth: "stress test",
      },
      {
        question_en:
          "Tell me about a bug you let through that hit production.",
        question_vi:
          "Kể về một bug bạn đã bỏ sót và nó lên production.",
        depth: "follow-up",
      },
      {
        question_en:
          "How do you push back when an engineer says 'it's not a bug, it's by design'?",
        question_vi:
          "Bạn phản biện thế nào khi engineer nói \"không phải bug, đây là design\"?",
        depth: "follow-up",
      },
      {
        question_en:
          "If you only had time to write one test, what would it test?",
        question_vi:
          "Nếu chỉ có thời gian viết một test, bạn sẽ test cái gì?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Liệt kê tools (Selenium, Jest, Cypress) thay vì kể tư duy. QA lead muốn biết bạn nghĩ về risk thế nào, không phải bạn biết tool nào.",
      "Trả lời \"I test everything\" — vô lý và không khả thi. Phải biết phân biệt: critical path, edge cases, regression.",
      "Khi bị hỏi \"bug bạn để lọt\", trả lời \"I never let bugs through\". Đây là red flag tự kiêu — mọi QA đều có bug lọt.",
      "Tránh xung đột với engineer. Văn hoá Việt né mặt — nhưng QA mà không dám tranh luận với dev là QA không làm được việc.",
      "Phát âm \"regression\" sai (thường thành \"re-gress-on\"). Tập từ này riêng — nó xuất hiện 10 lần trong mỗi QA interview.",
      "Dùng \"check\" thay cho \"verify\" hoặc \"validate\" — nghe junior. \"I checked it works\" → \"I verified the boundary conditions\".",
    ],
    sample_strong_answer:
      "My process starts before any code is written — I read the spec and write down what could break. For a new feature I split into three buckets: critical path that has to work or revenue stops, edge cases that hit maybe one percent of users, and regression risk on adjacent features. I write the critical path tests first and run them against the staging build. The hardest bug I let through was a timezone edge case last year — our reporting was off by one day for users in UTC+12 because we tested in UTC+7 only. After that I added a timezone matrix to our regression suite. If I only had time for one test, it would be the most expensive thing to fix in production.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I use Selenium, Cypress, Jest, and Playwright.",
        why: "Liệt kê tool không trả lời câu hỏi về *process*.",
        better_alternative:
          "I start with risk: what's the most expensive thing to fix in production, and I work backwards from there.",
      },
      {
        what_not_to_say: "I never let bugs through to production.",
        why: "Không tin được. Tự kiêu là red flag QA.",
        better_alternative:
          "Last year I missed a timezone edge case — let me walk you through what I changed in our process.",
      },
      {
        what_not_to_say: "I always agree with what developer says.",
        why: "QA mà không dám không đồng ý là không làm được nghề này.",
        better_alternative:
          "When a developer says 'by design', I ask to see the spec — usually that surfaces whether it's a real disagreement.",
      },
    ],
    estimated_time_minutes: 18,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a QA lead. Your style: methodical, you probe risk reasoning over tool knowledge. You push back if the candidate lists tools or says 'I test everything'. You ask 'what's the most expensive bug you've shipped' and don't accept 'I haven't shipped any'. Speak only in English.",
  },
];

// ──────────────────────────────────────────────────────────────────────
// University admissions (6) — US / UK / AU / CA English-speaking unis
// ──────────────────────────────────────────────────────────────────────

const UNIVERSITY: ProInterviewScenario[] = [
  {
    id: "uni_why_university",
    vertical: "university",
    role: "Undergraduate applicant",
    level: "entry",
    title_vi: "Đại học — \"Vì sao trường chúng tôi\"",
    title_en: "University — \"Why this university\"",
    context:
      "Phỏng vấn admissions cho đại học Mỹ (loại liberal arts hoặc state university). Người phỏng vấn là alumni interviewer — không phải ai làm tuyển sinh chuyên nghiệp. Họ muốn nghe lý do thật, có nghiên cứu, không phải \"top ranking\".",
    typical_questions: [
      {
        question_en: "Why this university?",
        question_vi: "Vì sao bạn chọn trường chúng tôi?",
        depth: "surface",
      },
      {
        question_en: "What specifically about our program drew you in?",
        question_vi: "Điều cụ thể nào của chương trình thu hút bạn?",
        depth: "follow-up",
      },
      {
        question_en: "Which professor's work caught your eye?",
        question_vi: "Công trình của giáo sư nào thu hút bạn?",
        depth: "stress test",
      },
      {
        question_en: "If you got into your top three schools, how would you decide?",
        question_vi:
          "Nếu trúng cả ba trường top của bạn, bạn quyết định bằng cách nào?",
        depth: "follow-up",
      },
      {
        question_en: "What's something you don't love about our school?",
        question_vi: "Có điều gì ở trường mà bạn *không* thích?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"because your university is top ranked\" — câu killer. Họ nghe câu này 50 lần một mùa và luôn đánh trượt.",
      "Nói \"my parents recommend\" — admissions Mỹ muốn quyết định của *bạn*, không của bố mẹ. Văn hoá Việt nói thế là tôn trọng; họ nghe thấy là không tự lập.",
      "Liệt kê \"good professors, good facilities, good location\" — nghe như brochure. Phải cụ thể: tên giáo sư, tên course, tên club.",
      "Khi được hỏi \"giáo sư nào\", trả lời \"I don't know yet\". Câu này test xem bạn có thật sự research không. Phải có ít nhất một tên.",
      "Né câu \"điều bạn không thích\". Văn hoá Việt né phê bình. Nhưng câu này test xem bạn có suy nghĩ thật hay chỉ flatter — phải có một concern.",
      "Phát âm tên trường sai. Nghe nhỏ nhặt nhưng \"Cor-NELL\" vs \"COR-nell\", \"Duke\" vs \"Du-key\" — tập trước.",
    ],
    sample_strong_answer:
      "Two specific things drew me to your program. First, Professor Chen's research on second-language acquisition — I read her 2022 paper on Vietnamese learners and it directly relates to what I want to study. Second, your study-abroad partnership with the National University of Singapore, because I want to understand education systems beyond the US. Honestly, what I'm less sure about is the size — your intro classes are larger than I'm used to, and I'll have to be intentional about getting to know professors. If I get into all three of my top schools, I'll decide based on which advisor I connect with at admitted-student weekend.",
    common_weak_phrasings: [
      {
        what_not_to_say: "Your university is top ranked in the world.",
        why: "Câu thuộc lòng. Ranking không phải lý do.",
        better_alternative:
          "Professor Chen's 2022 paper on second-language acquisition — that's the specific work that drew me in.",
      },
      {
        what_not_to_say: "My parents told me your school is the best.",
        why: "Cho thấy quyết định không phải của bạn.",
        better_alternative:
          "I researched the program myself after reading a paper from your linguistics department.",
      },
      {
        what_not_to_say: "I love everything about your school.",
        why: "Không tin được, và tránh câu hỏi probe.",
        better_alternative:
          "Honestly, the intro class sizes are larger than I'd like — I'll have to be intentional about office hours.",
      },
    ],
    estimated_time_minutes: 12,
    interviewer_system_prompt:
      "You are Mercy, playing the role of an alumni interviewer for a US university. Your style: warm, conversational, but you probe specifics. If the candidate mentions ranking or generic 'good professors', you ask 'which one specifically' or 'what about the curriculum'. You ask one question that tests whether they did real research. Speak only in English.",
  },
  {
    id: "uni_overcome_challenge",
    vertical: "university",
    role: "Undergraduate applicant",
    level: "entry",
    title_vi: "Đại học — \"Một thử thách bạn đã vượt qua\"",
    title_en: "University — \"Discuss a challenge you've overcome\"",
    context:
      "Câu phỏng vấn cổ điển. Người phỏng vấn muốn nghe bạn xử lý nghịch cảnh thế nào — không phải để đánh giá nghịch cảnh. Câu trả lời tệ nhất là không có thử thách nào hoặc thử thách quá nhỏ.",
    typical_questions: [
      {
        question_en: "Tell me about a challenge you've overcome.",
        question_vi: "Kể tôi nghe một thử thách bạn đã vượt qua.",
        depth: "surface",
      },
      {
        question_en: "What did you learn from it?",
        question_vi: "Bạn học được gì từ nó?",
        depth: "follow-up",
      },
      {
        question_en: "Who helped you through it?",
        question_vi: "Ai đã giúp bạn vượt qua?",
        depth: "follow-up",
      },
      {
        question_en: "Looking back, what would you have done differently?",
        question_vi: "Nhìn lại, bạn sẽ làm khác chỗ nào?",
        depth: "stress test",
      },
      {
        question_en: "How does that experience apply to college life?",
        question_vi:
          "Trải nghiệm đó liên quan thế nào đến đời sống đại học?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Chọn thử thách quá nhỏ kiểu \"em thi điểm thấp một lần\". Cần thử thách thật — chuyển trường, gia đình khó khăn, mất người thân, áp lực thi đại học VN.",
      "Đồng thời, đừng kể quá đau khổ chỉ để xin thương hại. Tỉ lệ vàng: 20% mô tả vấn đề, 80% kể bạn xử lý gì.",
      "Né phần cảm xúc. Văn hoá Việt coi thể hiện cảm xúc là yếu — admissions Mỹ thì coi đó là chín chắn. Nói \"I felt overwhelmed\" là OK.",
      "Trả lời \"I solved it alone\" — admissions ghét câu này. Họ muốn thấy bạn biết tìm giúp đỡ — đó là kỹ năng đại học.",
      "Đặt từ \"struggle\" sai. \"I struggled with X\" — không \"I had struggle with X\". Tập riêng cấu trúc này.",
      "Kết bằng \"and now I'm stronger\" — quá sáo. Kết bằng việc cụ thể bạn làm khác sau đó.",
    ],
    sample_strong_answer:
      "When I was 15, my father lost his job and we moved from Hanoi to a smaller town for six months. I had to switch schools mid-year and the curriculum was different — I went from top of my class to barely passing math. The hardest part wasn't the math; it was admitting to my new teacher that I was lost. When I finally asked her for help, she gave me her old textbook and let me eat lunch in her classroom while I worked through it. I caught up by the end of the semester. What I learned: asking for help is a skill, not a weakness. In college I'll go to office hours in the first two weeks, before I think I need them.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I solved my problem by myself.",
        why: "Admissions Mỹ muốn thấy bạn biết tìm support.",
        better_alternative:
          "I asked my math teacher for help — that turned out to be the hardest and most useful part.",
      },
      {
        what_not_to_say: "And now I'm a stronger person.",
        why: "Quá sáo. Không cụ thể.",
        better_alternative:
          "What I changed: in college I'll go to office hours in the first two weeks.",
      },
      {
        what_not_to_say: "I had a struggle with math.",
        why: "Lỗi cấu trúc. \"struggle\" là verb, không noun ở đây.",
        better_alternative: "I struggled with math.",
      },
    ],
    estimated_time_minutes: 12,
    interviewer_system_prompt:
      "You are Mercy, playing the role of an admissions interviewer. Your style: empathetic but probing. You give space for the emotional content but follow up on what specifically the candidate did, who they asked for help, and what they changed afterward. You don't accept 'I solved it alone' as a final answer. Speak only in English.",
  },
  {
    id: "uni_research_interest",
    vertical: "university",
    role: "Graduate / PhD applicant",
    level: "senior",
    title_vi: "Cao học — \"Hướng nghiên cứu của bạn là gì\"",
    title_en: "Graduate — \"What's your research interest\"",
    context:
      "Phỏng vấn PhD/master's research. Người phỏng vấn là giáo sư potential advisor; họ muốn nghe câu hỏi nghiên cứu cụ thể, không phải \"em thích lĩnh vực X\". Đây là câu khó nhất — phải show fit với lab họ.",
    typical_questions: [
      {
        question_en: "What's your research interest?",
        question_vi: "Hướng nghiên cứu của bạn là gì?",
        depth: "surface",
      },
      {
        question_en: "What's an unanswered question in your field that you'd want to tackle?",
        question_vi:
          "Câu hỏi nào trong lĩnh vực của bạn còn chưa được trả lời mà bạn muốn nghiên cứu?",
        depth: "follow-up",
      },
      {
        question_en: "Whose work in our department aligns with that?",
        question_vi:
          "Công trình của ai trong khoa chúng tôi gần với hướng đó?",
        depth: "follow-up",
      },
      {
        question_en: "What's a paper that changed how you think?",
        question_vi: "Một paper đã thay đổi cách bạn nghĩ?",
        depth: "stress test",
      },
      {
        question_en:
          "If your hypothesis turns out to be wrong, what's your fallback?",
        question_vi:
          "Nếu giả thuyết của bạn sai, kế hoạch dự phòng là gì?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời quá rộng: \"I'm interested in machine learning\" — quá rộng, không phải research interest. Phải cụ thể đến mức câu hỏi.",
      "Liệt kê 5 hướng cùng lúc để \"giữ option\". Người phỏng vấn nghe thấy là chưa thật sự nghĩ kỹ. Một hướng + một hướng phụ là tối đa.",
      "Không đọc paper của giáo sư đang phỏng vấn. Cực kỳ phổ biến với candidates Việt — và là dấu chấm hết. Phải đọc ít nhất 2 paper gần nhất của họ.",
      "Trả lời câu \"unanswered question\" bằng câu hỏi đã có nhiều người làm. Cho thấy chưa đọc literature.",
      "Né câu \"hypothesis sai thì sao\". Trong văn hoá Việt thừa nhận sai = mất mặt. Trong nghiên cứu, đó là dấu hiệu mature thinking.",
      "Phát âm tên author/paper sai. Người phỏng vấn không trừ điểm trực tiếp nhưng nó cho thấy bạn chưa đọc to lên bao giờ.",
    ],
    sample_strong_answer:
      "My interest is in interpretability of large language models — specifically, whether the features we extract with sparse autoencoders correspond to what the model actually uses for a given task. Anthropic's work with Bricken and team in 2023 reframed the problem for me, but their evaluation was indirect. The unanswered question I'd want to tackle is causal: if we ablate a feature, does downstream behavior change in the predicted way? Professor Singh's lab here has the closest infrastructure for that — I read her paper on circuit tracing last month. If my hypothesis fails, the negative result is still publishable because the field is moving fast and we'd be telling people what doesn't work.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I'm interested in AI / NLP / ML.",
        why: "Quá rộng. Không phải research interest.",
        better_alternative:
          "My specific interest is causal interpretability of large language models.",
      },
      {
        what_not_to_say: "I haven't read your papers yet.",
        why: "Dấu chấm hết. Không thể recover từ câu này.",
        better_alternative:
          "Your 2023 paper on circuit tracing — that's actually why I applied to your lab.",
      },
      {
        what_not_to_say: "If my hypothesis is wrong, I will choose another topic.",
        why: "Cho thấy chưa hiểu nghiên cứu. Negative result vẫn là kết quả.",
        better_alternative:
          "A negative result is still publishable — and informs whoever picks up the question next.",
      },
    ],
    estimated_time_minutes: 30,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a professor interviewing a graduate research applicant. Your style: precise, you ask 'specifically what' relentlessly. You probe whether the candidate has read your work — be ready to ask 'whose work in this department lines up'. You give credit for negative-result thinking. Speak only in English.",
  },
  {
    id: "uni_community_contribution",
    vertical: "university",
    role: "Undergraduate applicant",
    level: "entry",
    title_vi: "Đại học — \"Bạn sẽ đóng góp gì cho cộng đồng trường\"",
    title_en: "University — \"How will you contribute to our community\"",
    context:
      "Câu này test xem bạn có vision về vai trò của mình ở campus không. Đáp án dở: \"I will study hard\". Đáp án giỏi: kể một thứ cụ thể bạn sẽ start hoặc join.",
    typical_questions: [
      {
        question_en: "How will you contribute to our community?",
        question_vi: "Bạn sẽ đóng góp gì cho cộng đồng trường?",
        depth: "surface",
      },
      {
        question_en: "What club or activity would you start?",
        question_vi:
          "Bạn sẽ lập club hay hoạt động gì?",
        depth: "follow-up",
      },
      {
        question_en: "How will you bring a Vietnamese perspective to campus?",
        question_vi:
          "Bạn sẽ mang góc nhìn Việt Nam đến campus thế nào?",
        depth: "follow-up",
      },
      {
        question_en: "What kind of roommate are you?",
        question_vi: "Bạn là kiểu bạn ở chung phòng thế nào?",
        depth: "stress test",
      },
      {
        question_en:
          "Tell me about a time you had to work with someone you didn't like.",
        question_vi:
          "Kể về một lần bạn phải làm việc với người bạn không thích.",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I will study very hard\" — vô nghĩa. Học là mặc định, không phải đóng góp.",
      "Hứa hẹn quá lớn: \"I will start a club, organize events, become president\" — admissions không tin câu hứa, họ tin hành vi quá khứ.",
      "Né câu \"Vietnamese perspective\". Đây là cơ hội nói thật — nhưng nhiều bạn sợ \"playing the Asian card\". Cứ nói: bạn lớn lên ở VN, bạn có gì cụ thể để mang.",
      "Trả lời câu \"roommate\" theo lối tiếng Anh trang trọng (\"I am a respectful person\"). Câu này là social check — phải nghe thật.",
      "Khi nói về conflict, dùng \"I never have conflict with anyone\". Không tin được. Phải có ít nhất một ví dụ nhẹ.",
      "Bỏ -ed quá khứ trong tense kể chuyện: \"Last year I work with…\" → phải \"I worked with\".",
    ],
    sample_strong_answer:
      "Two specific things. First, I'd want to join the existing Vietnamese Students Association but also try to bridge it with the broader Asian-American community — at home I noticed a gap between international students and second-generation kids and I think small programming, like cross-cultural cooking nights, can change that. Second, I've been writing a Vietnamese-language tech blog for two years; I'd want to start an English-Vietnamese translation initiative for your CS open courseware so Vietnamese high schoolers can access it. As a roommate I'm tidy but flexible — I had to share a small room with my younger brother for years, so I learned to negotiate quiet hours. The hardest person I worked with was my high school debate partner — we disagreed on every topic. We agreed up front on how we'd resolve disagreements, and that ended up being the most useful thing I learned that year.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I will study very hard and get good grades.",
        why: "Học là mặc định. Không phải đóng góp.",
        better_alternative:
          "I want to start a Vietnamese-English translation initiative for your CS open courseware.",
      },
      {
        what_not_to_say: "I never have conflict with anyone.",
        why: "Không tin được; tránh câu hỏi.",
        better_alternative:
          "My high school debate partner — we disagreed on every topic and had to learn how to work through it.",
      },
      {
        what_not_to_say: "I will respect everyone.",
        why: "Trống rỗng. Không cụ thể.",
        better_alternative:
          "I'd want to bridge international and second-generation students through small programming.",
      },
    ],
    estimated_time_minutes: 12,
    interviewer_system_prompt:
      "You are Mercy, playing the role of an admissions interviewer. Your style: friendly, you ask follow-ups about specific clubs, programs, and personal traits. You especially probe how the candidate would bridge cultural differences and how they handle conflict. You don't accept 'I will study hard' as an answer. Speak only in English.",
  },
  {
    id: "uni_career_goals",
    vertical: "university",
    role: "Undergraduate / graduate applicant",
    level: "entry",
    title_vi: "Đại học — \"Mục tiêu sự nghiệp dài hạn\"",
    title_en: "University — \"Long-term career goals\"",
    context:
      "Câu này tricky: phải đủ cụ thể để nghe thật, đủ flexible để không nghe robot. Người phỏng vấn biết bạn 18 tuổi — họ không expect plan 30 năm. Họ muốn nghe bạn nghĩ về tương lai theo cách có cấu trúc.",
    typical_questions: [
      {
        question_en: "What are your long-term career goals?",
        question_vi: "Mục tiêu sự nghiệp dài hạn của bạn?",
        depth: "surface",
      },
      {
        question_en: "How does this degree get you closer to that?",
        question_vi: "Bằng cấp này đưa bạn gần hơn với mục tiêu thế nào?",
        depth: "follow-up",
      },
      {
        question_en:
          "What if you graduate and the job market for that field has collapsed?",
        question_vi:
          "Nếu bạn tốt nghiệp mà thị trường việc cho ngành đó sụp, bạn làm gì?",
        depth: "stress test",
      },
      {
        question_en: "Will you go back to Vietnam, or stay in the US?",
        question_vi: "Bạn sẽ về Việt Nam hay ở lại Mỹ?",
        depth: "follow-up",
      },
      {
        question_en: "Five years from now, what does success look like?",
        question_vi: "Năm năm nữa, thành công với bạn là gì?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I want to be successful\" — vô nghĩa. \"Successful\" ở đây là gì? Tiền? Title? Impact?",
      "Trả lời \"I want to make a lot of money\" — sai văn hoá. Mỹ OK với việc kiếm tiền nhưng không phải câu trả lời chính cho admissions.",
      "Né câu về về VN. Văn hoá Việt sợ nói thẳng nhưng admissions không bias against câu này — họ muốn câu trả lời thật.",
      "Quá cứng kiểu \"I will be CEO of company X by age 30\" — nghe robot. Plan flexible hơn.",
      "Liên kết yếu giữa goals và degree. Phải có chuỗi: degree → first job → mid-career → goal. Không cần chính xác nhưng phải logical.",
      "Phát âm \"long-term\" thành \"long-tem\". Tập từ này riêng.",
    ],
    sample_strong_answer:
      "My long-term goal is to work on education technology specifically for non-English-speaking learners — I think there's a 50-million person market that ELSA and Duolingo aren't serving well. To get there I need three things: a strong CS foundation, exposure to product thinking, and time in the US to understand what makes American edtech effective. Your CS program plus the entrepreneurship minor gets me the first two. I'd plan to work at a US edtech company for three to five years after graduation, then either go back to Vietnam to build or start something while still in the US. Five years from now success is having shipped a product that real learners are using — not the title.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I want to be successful in my career.",
        why: "Trống. Không có nội dung.",
        better_alternative:
          "I want to ship education technology that real learners are using — not aim for a title.",
      },
      {
        what_not_to_say: "I will return to Vietnam to make my country proud.",
        why: "Quá sáo và mơ hồ. Mỹ không đánh giá patriotism ở đây.",
        better_alternative:
          "I'd plan to work in US edtech for three to five years before deciding where to build.",
      },
      {
        what_not_to_say: "I want to be CEO of a big company.",
        why: "Title-driven nghe ngây thơ.",
        better_alternative:
          "I want to be in a role where I'm shipping product, not where I'm managing managers.",
      },
    ],
    estimated_time_minutes: 12,
    interviewer_system_prompt:
      "You are Mercy, playing the role of an admissions interviewer. Your style: forward-looking, you probe the connection between goals and the degree being applied for. You ask the 'what if the field collapses' question to test flexibility. You don't penalize honesty about staying in the US or returning home. Speak only in English.",
  },
  {
    id: "uni_why_major",
    vertical: "university",
    role: "Undergraduate applicant",
    level: "entry",
    title_vi: "Đại học — \"Vì sao chuyên ngành này\"",
    title_en: "University — \"Why this major specifically\"",
    context:
      "Câu hỏi này lọc xem bạn đã thực sự suy nghĩ chưa hay chỉ chọn major bố mẹ chọn. Câu trả lời tệ: \"because it has good job prospects\". Câu trả lời giỏi: kể về một moment cụ thể khiến bạn quan tâm.",
    typical_questions: [
      {
        question_en: "Why this major specifically?",
        question_vi: "Vì sao bạn chọn chuyên ngành này cụ thể?",
        depth: "surface",
      },
      {
        question_en: "What's a course you've taken that's related?",
        question_vi: "Course nào bạn đã học có liên quan?",
        depth: "follow-up",
      },
      {
        question_en: "What's a book or paper that drew you in?",
        question_vi: "Sách hay paper nào đã thu hút bạn vào ngành?",
        depth: "follow-up",
      },
      {
        question_en: "If you weren't doing this, what would your second choice be?",
        question_vi:
          "Nếu không học ngành này, lựa chọn thứ hai của bạn là gì?",
        depth: "stress test",
      },
      {
        question_en: "What's the part of this field you're least excited about?",
        question_vi:
          "Phần nào của ngành bạn ít hào hứng nhất?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"my parents chose this for me\" — quay đi. Quyết định phải là của bạn.",
      "Trả lời \"because the salary is high\" — Mỹ OK với kiếm tiền nhưng không phải câu trả lời chính cho admissions interview.",
      "Không có câu chuyện origin. Mọi major giỏi đều có một moment khởi đầu — phải kể được nó.",
      "Né câu \"second choice\". Phải có một đáp án thật — cho thấy bạn nghĩ về options.",
      "Né câu \"phần ít hào hứng\". Văn hoá Việt sợ chê ngành mình. Câu này test xem bạn có thực sự hiểu ngành không.",
      "Dùng \"I want to learn\" cho mọi câu. Quá đơn giản. Đa dạng: \"I'm drawn to\", \"I'm curious about\", \"I want to dig into\".",
    ],
    sample_strong_answer:
      "I came to computer science the long way. I started in physics — I was fascinated by quantum mechanics in high school — and I took a computational physics course that required Python. The Python part ended up being more interesting than the physics part. The moment I knew was writing a small simulation of two-slit interference and watching the pattern emerge from the code. Since then I've taken three online CS courses and built two small projects. My second choice would be cognitive science because it shares the question I actually care about: how do systems represent the world. The part I'm least excited about is web frontend — I respect the craft but it's not where my curiosity goes.",
    common_weak_phrasings: [
      {
        what_not_to_say: "Because computer science has good job prospects.",
        why: "Job-driven. Admissions không thấy đây là quyết định cá nhân.",
        better_alternative:
          "I came to CS through physics — a computational physics course turned out to be more about Python than physics, and that was the moment I knew.",
      },
      {
        what_not_to_say: "My parents told me to study this.",
        why: "Quyết định không phải của bạn.",
        better_alternative:
          "My family encouraged it but the moment I committed was writing my first small simulation.",
      },
      {
        what_not_to_say: "I love everything about this major.",
        why: "Không tin được. Tránh probe.",
        better_alternative:
          "The part I'm least excited about is web frontend — I respect it but my curiosity goes elsewhere.",
      },
    ],
    estimated_time_minutes: 10,
    interviewer_system_prompt:
      "You are Mercy, playing the role of an alumni admissions interviewer. Your style: curious, you push for an origin story — 'when did you know'. You probe by asking what the candidate is *least* excited about within the field. You don't accept 'good job prospects' or 'my parents'. Speak only in English.",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Visa / Immigration interviews (6)
// ──────────────────────────────────────────────────────────────────────

const VISA: ProInterviewScenario[] = [
  {
    id: "visa_us_tourist",
    vertical: "visa",
    role: "B1/B2 tourist visa applicant",
    level: "entry",
    title_vi: "Visa du lịch Mỹ (B1/B2)",
    title_en: "US tourist visa interview (B1/B2)",
    context:
      "Phỏng vấn ở Lãnh sự quán Mỹ tại HCM/HN. 90 giây trung bình mỗi case. Officer đứng sau cửa kính, không thân thiện, hỏi nhanh. Mục tiêu duy nhất của họ: xác định bạn có ý định ở lại Mỹ bất hợp pháp hay không (Section 214(b)). Tất cả câu hỏi đều dẫn về cái này.",
    typical_questions: [
      {
        question_en: "What is the purpose of your trip?",
        question_vi: "Mục đích chuyến đi của bạn là gì?",
        depth: "surface",
      },
      {
        question_en: "How long will you stay?",
        question_vi: "Bạn sẽ ở lại bao lâu?",
        depth: "surface",
      },
      {
        question_en: "Who is paying for your trip?",
        question_vi: "Ai trả tiền cho chuyến đi?",
        depth: "follow-up",
      },
      {
        question_en: "What do you do for work in Vietnam?",
        question_vi: "Bạn làm việc gì ở Việt Nam?",
        depth: "follow-up",
      },
      {
        question_en: "Do you have family in the US?",
        question_vi: "Bạn có người thân ở Mỹ không?",
        depth: "stress test",
      },
      {
        question_en: "What will bring you back to Vietnam?",
        question_vi: "Điều gì sẽ đưa bạn quay lại Việt Nam?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời quá dài. Officer cho 90 giây — câu trả lời nên 5–10 giây mỗi câu. Càng nói nhiều càng nghi.",
      "Nói \"I want to stay if possible\" — câu killer ngay lập tức. Đừng đùa, đừng test waters.",
      "Quên mention các \"strong ties\" về VN: việc làm, nhà cửa, gia đình, business. Officer cần lý do cụ thể bạn sẽ về.",
      "Nói dối về người thân ở Mỹ. Họ có database; nếu họ hỏi mà bạn nói không có, đơn bị reject ngay.",
      "Trả lời câu \"who pays\" mơ hồ kiểu \"my family\" — phải cụ thể: \"my husband, who works as X and earns Y\". Chuẩn bị tài chính rõ ràng.",
      "Đem theo nhiều giấy tờ để \"chứng minh\" — sai chiến lược. Officer hỏi bằng miệng, không xem giấy. Câu trả lời rõ ràng quan trọng hơn folder dày.",
      "Lo lắng quá mức và run khi nói. Tập câu trả lời trước; đến lúc đứng trước cửa kính chỉ trả lời, không nghĩ.",
    ],
    sample_strong_answer:
      "I'm visiting my sister in Seattle for two weeks in July. She's a US citizen, works as a nurse, and she's covering my flights and accommodation. I work as a marketing manager at [Company] in Hanoi — I've been there for six years and I have approved leave for this trip. My husband and our two children stay in Vietnam; my husband owns a small business there. I'll come back to Vietnam because my job, my family, and our home are there.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I want to stay in America if I find a good job.",
        why: "Killer câu. 100% rejection — đây là đúng định nghĩa intent to immigrate.",
        better_alternative:
          "I'm visiting for two weeks. My job and family are in Vietnam.",
      },
      {
        what_not_to_say: "Maybe one or two months, depends.",
        why: "Mơ hồ = nghi ngờ.",
        better_alternative: "Two weeks. I return on July 22nd.",
      },
      {
        what_not_to_say: "I don't know who will pay, my family will help.",
        why: "Nghe không có kế hoạch tài chính.",
        better_alternative:
          "My sister, who is a US citizen working as a nurse, is paying for the trip.",
      },
    ],
    estimated_time_minutes: 5,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a US consular officer at HCMC. Your style: terse, fast, you ask short questions and expect short answers. You decide quickly. You probe ties to Vietnam (job, family, property) and any indication of intent to stay. You will sometimes ask the same question twice in different words to check consistency. Speak only in English.",
  },
  {
    id: "visa_us_f1",
    vertical: "visa",
    role: "F-1 student visa applicant",
    level: "entry",
    title_vi: "Visa du học Mỹ (F-1)",
    title_en: "US student visa interview (F-1)",
    context:
      "Phỏng vấn F-1 — chỉ có ~2 phút trước officer. Họ kiểm tra ba thứ: (1) bạn là sinh viên thật, (2) bạn đủ tiền, (3) bạn có ý định về VN sau khi học xong. Reject rate cao cho VN candidates đặc biệt là community college hoặc trường ranking thấp.",
    typical_questions: [
      {
        question_en: "Why this university?",
        question_vi: "Vì sao bạn chọn trường này?",
        depth: "surface",
      },
      {
        question_en: "What will you study?",
        question_vi: "Bạn sẽ học chuyên ngành gì?",
        depth: "surface",
      },
      {
        question_en: "Who is funding your studies?",
        question_vi: "Ai tài trợ việc học của bạn?",
        depth: "follow-up",
      },
      {
        question_en: "What does your sponsor do for work?",
        question_vi: "Người tài trợ làm nghề gì?",
        depth: "follow-up",
      },
      {
        question_en: "What will you do after graduation?",
        question_vi: "Sau khi tốt nghiệp bạn sẽ làm gì?",
        depth: "stress test",
      },
      {
        question_en: "Why not study in Vietnam?",
        question_vi: "Sao không học ở Việt Nam?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I want to work in the US after graduation\" — gần như chắc chắn reject. F-1 là non-immigrant visa — câu trả lời phải về quay lại VN.",
      "Quá học thuộc, đọc như robot. Officer phát hiện ngay. Tập đến mức tự nhiên, không học từng từ.",
      "Trả lời câu \"why this university\" bằng ranking. Sai. Phải có lý do cụ thể: program, professor, fit với career VN.",
      "Sponsor tài chính không rõ ràng. Officer phải hiểu trong 5 giây ai trả tiền và họ kiếm tiền thế nào.",
      "Không biết tên người tài trợ làm nghề gì. Nếu bố mẹ trả tiền mà bạn không nói được \"my father runs a textile business with annual revenue of X\", officer nghi ngờ.",
      "Né câu \"why not study in Vietnam\" — phải có câu trả lời: program cụ thể không có ở VN, hoặc ranking, hoặc lab/research.",
      "Plan sau tốt nghiệp mơ hồ. Không cần plan chi tiết nhưng cần direction: \"work in [VN industry] applying [degree]\".",
    ],
    sample_strong_answer:
      "I'm studying biomedical engineering at Purdue. I chose Purdue because their BME program has a specific track in medical imaging — that's the area I want to work in, and Vietnam doesn't yet have a strong program in it. My father is funding my studies; he runs a textile manufacturing business in Bac Ninh with annual revenue of about 20 billion VND, and we have the bank statements to support the four years. After graduation, I'll come back to Vietnam — Vinmec and the new VinUni teaching hospital are hiring biomedical engineers, and that's where I want to apply what I learn.",
    common_weak_phrasings: [
      {
        what_not_to_say: "After graduation I want to work in America for some years.",
        why: "Killer câu. F-1 yêu cầu intent quay về VN.",
        better_alternative:
          "After graduation I'll return to Vietnam — Vinmec is hiring in my field.",
      },
      {
        what_not_to_say: "Because Purdue is a top university.",
        why: "Ranking-based. Không cụ thể.",
        better_alternative:
          "Purdue's BME program has a medical imaging track that doesn't exist in Vietnam yet.",
      },
      {
        what_not_to_say: "My parents pay, they have a business.",
        why: "Quá mơ hồ. Officer cần con số.",
        better_alternative:
          "My father runs a textile business in Bac Ninh with revenue of about 20 billion VND a year.",
      },
    ],
    estimated_time_minutes: 6,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a US consular officer interviewing an F-1 student visa applicant. Your style: rapid-fire, you ask questions and judge in 90 seconds. You probe three things in this order: real student, real funding, intent to return. You'll ask 'why not study in Vietnam' as a stress test. Speak only in English.",
  },
  {
    id: "visa_us_h1b",
    vertical: "visa",
    role: "H-1B work visa applicant",
    level: "mid",
    title_vi: "Visa làm việc Mỹ (H-1B)",
    title_en: "US H-1B work visa interview",
    context:
      "Phỏng vấn H-1B đã chấp thuận, lấy visa stamp ở consulate. Officer kiểm tra: (1) công việc thực sự specialty occupation, (2) employer-employee relationship hợp pháp, (3) trình độ bạn match job. Đặc biệt nghi ngờ với consulting firms.",
    typical_questions: [
      {
        question_en: "What company will you work for?",
        question_vi: "Bạn sẽ làm cho công ty nào?",
        depth: "surface",
      },
      {
        question_en: "What is your job title and what will you do day to day?",
        question_vi:
          "Chức danh của bạn và công việc hàng ngày là gì?",
        depth: "follow-up",
      },
      {
        question_en: "What's your salary, and how does that compare to similar roles?",
        question_vi:
          "Lương bạn bao nhiêu, so với vị trí tương tự thế nào?",
        depth: "follow-up",
      },
      {
        question_en: "Will you be working at the petitioner's office or at a client site?",
        question_vi:
          "Bạn sẽ làm tại office công ty bảo lãnh hay tại client site?",
        depth: "stress test",
      },
      {
        question_en: "How does your degree relate to this job?",
        question_vi: "Bằng của bạn liên quan thế nào đến công việc này?",
        depth: "follow-up",
      },
      {
        question_en: "Has your employer started this role for you yet?",
        question_vi:
          "Employer đã bắt đầu vai trò này cho bạn chưa?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Không biết job description. Phải nói được trong 30 giây bạn làm gì hàng ngày — không đọc title.",
      "Trả lời mơ hồ về client site. Nếu là consulting firm placement, phải biết tên client cuối, location, và project.",
      "Không biết lương cụ thể. Phải nói được con số chính xác bằng USD/year, kể cả base + bonus structure.",
      "Bằng cấp không match job. Phải kết nối: \"My MS in CS is required because the role involves [specific technical work]\".",
      "Mặc đồ quá formal kiểu suit cài huy hiệu. H-1B là kỹ thuật — mặc business casual nghe natural hơn.",
      "Trả lời câu \"how is this different from US workers\" sai. Đừng nói bạn làm tốt hơn — chỉ nói \"role requires specialty knowledge\".",
      "Không có giấy tờ approval notice (I-797), employment letter dự phòng. Mặc dù officer thường không xem, vẫn phải có sẵn.",
    ],
    sample_strong_answer:
      "I'll work for Stripe in San Francisco as a Senior Software Engineer on the payments infrastructure team. Day to day I'll be designing and implementing services that process card payments — primarily in Go and Ruby. My salary is $185,000 base plus equity, which is consistent with the prevailing wage for senior engineers in SF. The work site is Stripe's main office on Townsend Street; this isn't a client placement. My MS in Computer Science from Carnegie Mellon, focusing on distributed systems, directly maps to the infrastructure work — the role specifically requires backend systems experience.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I will work for the company that sponsors me.",
        why: "Quá mơ hồ. Officer nghi ngờ ngay là consulting placement.",
        better_alternative:
          "I'll work for Stripe at their San Francisco office on Townsend Street.",
      },
      {
        what_not_to_say: "I'm not sure about the exact salary.",
        why: "Phải biết. Không biết = nghi ngờ về tính thật của offer.",
        better_alternative:
          "$185,000 base, plus equity — that matches the prevailing wage for senior engineers in SF.",
      },
      {
        what_not_to_say: "I will do whatever the manager asks me.",
        why: "Cho thấy không có specialty role.",
        better_alternative:
          "I'll be designing and implementing payment processing services in Go and Ruby.",
      },
    ],
    estimated_time_minutes: 8,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a US consular officer interviewing an H-1B applicant for visa stamping. Your style: technical, you probe whether the role is genuinely specialty occupation, whether the employer-employee relationship is direct, and whether the candidate's degree maps to the role. You're especially skeptical of consulting placements. Speak only in English.",
  },
  {
    id: "visa_au_skilled",
    vertical: "visa",
    role: "Skilled migration applicant (subclass 189/190)",
    level: "mid",
    title_vi: "Visa định cư diện tay nghề Úc",
    title_en: "Australian skilled migration interview",
    context:
      "Phỏng vấn skilled migration Úc — không phải universal nhưng có thể xảy ra với case có vấn đề về documentation hoặc skill assessment. Department of Home Affairs officer hoặc qua điện thoại. Kiểm tra: thật sự có skill, intent định cư, không gian lận employment history.",
    typical_questions: [
      {
        question_en:
          "Walk me through your work history for the past five years.",
        question_vi:
          "Kể tôi nghe lịch sử làm việc 5 năm qua.",
        depth: "surface",
      },
      {
        question_en: "What's your nominated occupation, and why?",
        question_vi:
          "Nghề bạn chọn để định cư là gì, vì sao?",
        depth: "follow-up",
      },
      {
        question_en: "Have you been to Australia before?",
        question_vi: "Bạn đã đến Úc chưa?",
        depth: "follow-up",
      },
      {
        question_en: "Why Australia and not another country?",
        question_vi: "Vì sao là Úc, không phải nước khác?",
        depth: "stress test",
      },
      {
        question_en:
          "Can you describe your day-to-day work in your last role?",
        question_vi:
          "Bạn mô tả công việc hàng ngày ở vai trò gần nhất ra sao?",
        depth: "stress test",
      },
      {
        question_en:
          "What state will you settle in, and why?",
        question_vi:
          "Bạn sẽ định cư ở bang nào, vì sao?",
        depth: "follow-up",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Không biết employment history chi tiết. Officer có thể hỏi \"in March 2023, what project were you on\" — phải trả lời được.",
      "Mô tả công việc khác với job code skill assessment. Nếu skill assessment là \"Software Engineer 261313\", mô tả công việc phải match ANZSCO description đó.",
      "Trả lời câu \"why Australia\" bằng \"better life\" — quá mơ hồ. Phải cụ thể: lifestyle, ngành nghề, điểm số test.",
      "Không biết bang. \"Anywhere in Australia\" nghe như chưa research. Phải có một bang chính + lý do.",
      "Phát âm \"Australia\" thành \"Au-stra-li-a\" 4 âm tiết — đúng là 3 âm tiết \"o-strey-li-a\". Tập kỹ.",
      "Văn hoá Việt: trả lời \"yes\" cho mọi câu kể cả khi không hiểu. Nếu không nghe rõ, hỏi lại — đừng đoán.",
      "Lo về việc nói \"I will return to Vietnam\" — sai. Skilled migration là intent ở lại. Đừng confuse với student visa.",
    ],
    sample_strong_answer:
      "For the past five years I've worked as a software developer — first at FPT Software in Hanoi from 2020 to 2022 building Java backend services for a Japanese client, then since 2022 at a fintech startup in Singapore, where I'm now lead developer for our payment integrations. My nominated occupation is Software Engineer, ANZSCO 261313 — that's what my work has been. I've been to Australia twice, on tourist visas in 2019 and 2023, and I spent a week in Melbourne and a week in Brisbane. We chose Australia over the US because the points-based system is transparent, the work-life balance fits how we want to raise our daughter, and my partner has a job offer in Melbourne starting in three months. We'll settle in Victoria.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I want better life for my family.",
        why: "Quá chung chung. Mọi người di cư đều nói câu này.",
        better_alternative:
          "We chose Australia because the work-life balance fits how we want to raise our daughter — and my partner has a job offer in Melbourne.",
      },
      {
        what_not_to_say: "I'm not sure which state, anywhere is fine.",
        why: "Cho thấy không research.",
        better_alternative:
          "Victoria — my partner's job is in Melbourne and we have family friends there.",
      },
      {
        what_not_to_say: "I do many things, manager assigns me work.",
        why: "Không match ANZSCO description.",
        better_alternative:
          "I lead the payment integration work — designing APIs in Java and reviewing my team's pull requests.",
      },
    ],
    estimated_time_minutes: 15,
    interviewer_system_prompt:
      "You are Mercy, playing the role of an Australian Department of Home Affairs case officer conducting a skilled migration interview. Your style: methodical, factual, you probe whether the candidate's described work matches the ANZSCO occupation they're claiming. You ask date-specific questions about employment to check consistency. Speak only in English.",
  },
  {
    id: "visa_uk_visitor",
    vertical: "visa",
    role: "UK Standard Visitor visa applicant",
    level: "entry",
    title_vi: "Visa thăm thân Anh quốc",
    title_en: "UK Standard Visitor visa interview",
    context:
      "UK ít khi phỏng vấn miệng — phần lớn dựa trên giấy tờ. Nhưng nếu được mời phỏng vấn (qua video hoặc tại VFS center), nghĩa là application có dấu hiệu nghi ngờ. Officer đánh giá: genuine visitor, đủ tiền, có ý định quay về.",
    typical_questions: [
      {
        question_en: "What is the purpose of your visit to the UK?",
        question_vi: "Mục đích bạn đến UK?",
        depth: "surface",
      },
      {
        question_en: "Where will you stay?",
        question_vi: "Bạn sẽ ở đâu?",
        depth: "surface",
      },
      {
        question_en: "How will you fund your trip?",
        question_vi: "Bạn dùng tiền gì để đi?",
        depth: "follow-up",
      },
      {
        question_en:
          "Tell me about your job in Vietnam.",
        question_vi: "Kể cho tôi nghe về công việc của bạn ở VN.",
        depth: "follow-up",
      },
      {
        question_en:
          "Have you been refused a visa before — for any country?",
        question_vi:
          "Bạn đã từng bị từ chối visa nước nào chưa?",
        depth: "stress test",
      },
      {
        question_en:
          "Why are you visiting now, specifically?",
        question_vi: "Vì sao bạn đến UK *vào lúc này*?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Nói dối về previous refusals. UK chia sẻ data với US/Schengen/AU. Phải khai trung thực; che giấu = ban dài hạn.",
      "Itinerary mơ hồ. UK officer thích kế hoạch cụ thể: ngày, thành phố, hotel, chuyến bay. Mang itinerary in sẵn.",
      "Không biết người mời mình làm gì. Nếu sponsor là họ hàng, phải nói được tên đầy đủ, nghề nghiệp, status (citizen/PR), địa chỉ.",
      "Tiền dưới mức yêu cầu. UK cần ~£100/ngày phí sinh hoạt — phải show được trong tài khoản 6 tháng.",
      "Phát âm địa danh UK sai: \"Leicester\" là \"Les-ter\", \"Edinburgh\" là \"Ed-in-bra\", không \"Edinburg\". Tập trước thành phố nào bạn sẽ thăm.",
      "Trả lời \"why now\" mơ hồ. Phải có lý do cụ thể: dự event, sinh nhật người thân, conference, mùa du lịch nhất định.",
      "Văn hoá Việt nói nhỏ — UK officer cần nghe rõ. Nói chậm và rõ.",
    ],
    sample_strong_answer:
      "I'm visiting my brother in Manchester for ten days, from June 5th to June 15th. He's been a UK citizen for six years, works as a doctor at Manchester Royal Infirmary, and I'll be staying at his home — I have his invitation letter and proof of address. I'm funding the trip myself; my salary as a senior accountant in Hanoi is around 35 million VND a month and I have £4,000 in savings ringfenced for this trip. I'm visiting now specifically because his daughter, my niece, is being baptized on June 10th. I've never been refused a visa, and I have approved leave from work — I return on June 15th and I'm back in the office June 17th.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I want to travel and see UK.",
        why: "Mơ hồ; không tie to a specific reason or person.",
        better_alternative:
          "I'm visiting my brother for his daughter's baptism on June 10th.",
      },
      {
        what_not_to_say: "Maybe two weeks or three, depends.",
        why: "Mơ hồ về thời gian = nghi ngờ ý định.",
        better_alternative: "Ten days. I arrive June 5th and leave June 15th.",
      },
      {
        what_not_to_say: "No, I never apply visa before.",
        why: "Bỏ -ed; sai grammar lớn.",
        better_alternative: "I have not applied for any other visa before.",
      },
    ],
    estimated_time_minutes: 10,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a UK Visa & Immigration officer conducting an interview for a Standard Visitor visa. Your style: polite, methodical, you probe specific dates, names, and amounts. You ask about previous visa refusals and check internal consistency between the candidate's story and the documents on file. Speak only in English.",
  },
  {
    id: "visa_ca_study",
    vertical: "visa",
    role: "Canadian study permit applicant",
    level: "entry",
    title_vi: "Study permit Canada",
    title_en: "Canadian study permit interview",
    context:
      "Canadian study permit — phỏng vấn không phải universal nhưng common với Vietnamese applicants vì SDS (Student Direct Stream) yêu cầu giấy tờ cụ thể. Officer kiểm tra: program genuine, funding adequate, intent to leave after studies (mặc dù PR pathway tồn tại).",
    typical_questions: [
      {
        question_en: "What program have you been admitted to?",
        question_vi:
          "Bạn được nhận vào chương trình nào?",
        depth: "surface",
      },
      {
        question_en: "Why this college and not another in Canada?",
        question_vi:
          "Sao chọn college này mà không phải college khác ở Canada?",
        depth: "follow-up",
      },
      {
        question_en:
          "How does this program connect to your work in Vietnam?",
        question_vi:
          "Chương trình này liên quan thế nào đến công việc của bạn ở VN?",
        depth: "follow-up",
      },
      {
        question_en:
          "What are your plans after graduation?",
        question_vi: "Sau khi tốt nghiệp bạn dự định làm gì?",
        depth: "stress test",
      },
      {
        question_en: "Is your GIC funded?",
        question_vi: "Tài khoản GIC của bạn đã có tiền chưa?",
        depth: "follow-up",
      },
      {
        question_en: "Do you have family in Canada?",
        question_vi: "Bạn có người thân ở Canada không?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I will apply for PR after graduation\" — không hẳn killer (Canada cho phép) nhưng phải khéo. Ngôn ngữ: \"I'd consider PGWP\" thay vì hứa định cư.",
      "Chương trình không match background. Officer nghi ngờ nếu CS bachelor học Hospitality Diploma — phải có rationale rõ.",
      "Không biết college's location. Văn hoá Việt: chọn theo agent, không research. Phải biết city, tỉnh, climate, có gì xung quanh.",
      "Trả lời câu \"connect to VN work\" mơ hồ. Phải có chuỗi: VN job → why upskill → CA program → CA experience → return path.",
      "Phát âm tên college sai (Centennial = \"Sen-ten-i-al\" không \"Cen-ten-ial\"). Tập trước.",
      "Trả lời quá nhanh, vội vã, run. Canadian officers note ấn tượng \"genuineness\" — nói chậm, rõ, tự nhiên.",
      "Không khai người thân ở Canada nếu có. Database chia sẻ với US — sẽ bị phát hiện.",
    ],
    sample_strong_answer:
      "I've been admitted to a two-year diploma in supply chain management at Centennial College in Toronto, starting September. I chose Centennial specifically because their program has a co-op component with companies like Loblaw and Indigo, and supply chain in Canada is mature in a way it isn't yet in Vietnam. I've been working as a logistics coordinator at a freight forwarder in HCMC for three years; this program directly upgrades that work. After graduation I'd consider applying for a PGWP to gain Canadian work experience for one to three years, then return to Vietnam to work in the growing third-party logistics market here — companies like ITL Logistics are scaling up and hiring people with Canadian operations experience. My GIC is funded with $20,635 CAD as of last month, and I have one cousin in Calgary, who is a permanent resident.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I want to immigrate to Canada permanently.",
        why: "Quá thẳng. Study permit là temporary; phải khéo.",
        better_alternative:
          "After my PGWP I plan to return to Vietnam — the supply chain industry here is scaling and hiring people with Canadian experience.",
      },
      {
        what_not_to_say: "Centennial is a famous college.",
        why: "Không cụ thể. Centennial không particularly famous.",
        better_alternative:
          "Centennial's supply chain program has a co-op with Loblaw — that's the specific reason.",
      },
      {
        what_not_to_say: "No, I don't have family in Canada.",
        why: "Nếu có family thì khai. Database sẽ phát hiện và đó là misrepresentation — ban 5 năm.",
        better_alternative:
          "Yes, my cousin is a permanent resident in Calgary. We have not lived together.",
      },
    ],
    estimated_time_minutes: 10,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a Canadian visa officer reviewing a study permit application. Your style: warm but probing, you ask specific questions about program, college, and post-graduation plans. You give credit for honest answers about PR intent and family connections. You probe whether the program logically connects to the candidate's career trajectory. Speak only in English.",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Corporate promotion / annual review (6)
// ──────────────────────────────────────────────────────────────────────

const PROMOTION: ProInterviewScenario[] = [
  {
    id: "promo_deserve",
    vertical: "promotion",
    role: "Internal candidate for promotion",
    level: "mid",
    title_vi: "Promotion — \"Vì sao bạn xứng đáng được thăng chức\"",
    title_en: "Promotion — \"Why do you deserve this promotion\"",
    context:
      "Cuộc thảo luận với manager hoặc skip-level. Mục tiêu: chứng minh bạn đã hoạt động ở level cao trong 6–12 tháng qua, không phải hứa hẹn tương lai. Văn hoá Việt: ngại tự khen — đây chính là phần khó nhất.",
    typical_questions: [
      {
        question_en: "Why do you deserve this promotion?",
        question_vi: "Vì sao bạn xứng đáng được thăng chức?",
        depth: "surface",
      },
      {
        question_en: "What have you done in the last six months that's at the next level?",
        question_vi:
          "Trong 6 tháng qua, bạn đã làm gì ở mức độ next level?",
        depth: "follow-up",
      },
      {
        question_en: "Where are you still operating below the next level?",
        question_vi:
          "Ở đâu bạn vẫn còn dưới mức next level?",
        depth: "stress test",
      },
      {
        question_en:
          "Why now and not next cycle?",
        question_vi: "Vì sao bây giờ chứ không phải cycle sau?",
        depth: "follow-up",
      },
      {
        question_en:
          "If I don't promote you this cycle, what would change?",
        question_vi:
          "Nếu cycle này tôi không thăng chức cho bạn, điều gì sẽ thay đổi?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I work very hard\" — không tính. Promotion không cho effort, cho impact.",
      "Né tự khen. Văn hoá Việt nói \"em chỉ làm phần việc của em thôi\" là lịch sự — manager nghe thấy là không deserve.",
      "Dùng \"we\" cho mọi thành tựu. Phải tách cá nhân: \"the team did X, my contribution was Y\".",
      "Không có số liệu. \"I improved performance\" → \"I cut deploy time from 40 minutes to 12\". Số luôn mạnh hơn tính từ.",
      "Né câu \"where are you below\". Văn hoá Việt sợ thừa nhận yếu — nhưng câu này test self-awareness. Phải có một điểm thật.",
      "Trả lời \"if not promoted I will leave\" — chiến thuật xấu nếu không thật sự sẵn rời. Manager note là leverage threat.",
      "Phát âm \"deserve\" thành \"de-serve\" rõ hai âm tiết — đúng là gần \"di-zurv\". Tập từ này.",
    ],
    sample_strong_answer:
      "In the last six months I've been operating at the senior level on three concrete things. First, I led the search backend migration from kickoff to ship — six weeks, four engineers, on time, hit the latency budget. Second, I started running our weekly system design review and three senior engineers told me the quality of design docs has gone up since. Third, I've been mentoring two new hires, and one of them just shipped his first feature solo this month. Where I'm still below: I haven't yet driven a cross-team initiative. That's the gap I'd close in the next cycle. Why now: the migration was the work that put me at the next level, and waiting another cycle without explicit signal feels like the calibration is wrong.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I work very hard every day.",
        why: "Effort không phải bằng chứng. Manager cần impact.",
        better_alternative:
          "I led the search backend migration — six weeks, four engineers, on time.",
      },
      {
        what_not_to_say: "If you don't promote me, I will leave.",
        why: "Threat. Trừ khi bạn thật sự có offer ngoài, đừng dùng.",
        better_alternative:
          "If the calibration says I'm not there yet, I want to know specifically what would change your mind.",
      },
      {
        what_not_to_say: "I think I deserve it.",
        why: "Hedging với \"I think\". Yếu.",
        better_alternative:
          "Here are three pieces of senior-level work I've shipped this half — let me walk you through them.",
      },
    ],
    estimated_time_minutes: 20,
    interviewer_system_prompt:
      "You are Mercy, playing the role of an engineering manager during a promotion conversation. Your style: collegial but candid, you ask for specific senior-level work, push back on 'I work hard' framing, and probe self-awareness about gaps. You especially watch for hedging language and the use of 'we' versus 'I'. Speak only in English.",
  },
  {
    id: "promo_conflict",
    vertical: "promotion",
    role: "Internal candidate / annual review",
    level: "mid",
    title_vi: "Annual review — \"Kể về xung đột với đồng nghiệp\"",
    title_en: "Annual review — \"Describe a conflict with a colleague\"",
    context:
      "Một câu mềm trong annual review nhưng có ý nghĩa đánh giá: collaboration & maturity. Văn hoá Việt né conflict — câu trả lời \"never had any\" là red flag.",
    typical_questions: [
      {
        question_en: "Tell me about a conflict you had with a colleague this year.",
        question_vi:
          "Kể tôi nghe một xung đột với đồng nghiệp trong năm nay.",
        depth: "surface",
      },
      {
        question_en: "How did the conversation actually go?",
        question_vi: "Cuộc nói chuyện thực sự diễn ra thế nào?",
        depth: "follow-up",
      },
      {
        question_en:
          "What would your colleague say about how you handled it?",
        question_vi:
          "Đồng nghiệp đó sẽ kể lại bạn xử lý thế nào?",
        depth: "stress test",
      },
      {
        question_en: "Was there any conflict you avoided that you shouldn't have?",
        question_vi:
          "Có xung đột nào bạn đã né nhưng đáng lẽ không nên?",
        depth: "stress test",
      },
      {
        question_en: "How do you bring up a hard topic?",
        question_vi:
          "Bạn nêu ra một chủ đề khó bằng cách nào?",
        depth: "follow-up",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I never have conflict, I get along with everyone\" — red flag. Manager nghe thấy là tránh conflict, không phải không có.",
      "Kể conflict quá nhẹ kiểu \"we disagreed about lunch place\". Phải là conflict thật về work.",
      "Đổ lỗi cho colleague hoàn toàn. Test này muốn thấy bạn nhận một phần trách nhiệm.",
      "Né câu \"what would they say about you\". Văn hoá Việt sợ tự đặt mình vào vị trí người khác. Câu trả lời tốt: thừa nhận một thứ họ có thể critique.",
      "Khi nói về conflict, dùng từ tiếng Việt như \"argue\" theo nghĩa cãi nhau ầm ĩ. Tiếng Anh công sở: \"disagreement\", \"pushback\", \"tension\".",
      "Né câu \"conflict bạn đã né\". Câu này test self-awareness. Phải có một ví dụ.",
      "Phát âm \"colleague\" thành \"col-lee-gue\" 3 âm — đúng là 2 âm \"col-leeg\". Tập trước.",
    ],
    sample_strong_answer:
      "Earlier this year I had a real disagreement with our PM, Linh, about deprioritizing accessibility work in Q2. I thought we were committing to ship something we knew didn't meet our own standard. The conversation went badly the first time — I came in too hot and made it about her judgment. I asked to talk again the next morning and led with what I'd gotten wrong: I'd skipped the step of understanding her timeline pressure. Once I did that, we agreed on a smaller scope that kept the accessibility work in. If you asked Linh, she'd say I was right on the substance but I lost the room the first time. The conflict I avoided that I shouldn't have was raising the lack of design review in our team retro — I'm bringing that up next cycle.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I never have conflict with my colleagues.",
        why: "Không tin được. Red flag.",
        better_alternative:
          "Earlier this year I had a real disagreement with our PM about deprioritizing accessibility work.",
      },
      {
        what_not_to_say: "It was completely her fault.",
        why: "Không nhận một phần trách nhiệm = không mature.",
        better_alternative:
          "I came in too hot the first time and made it about her judgment — that was on me.",
      },
      {
        what_not_to_say: "I argue with him until he agrees.",
        why: "\"argue\" và phong cách này nghe khó hợp tác.",
        better_alternative: "I pushed back with data and asked for a follow-up conversation.",
      },
    ],
    estimated_time_minutes: 15,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a manager in an annual review. Your style: warm but probing, you ask 'how did the conversation actually go' to surface tone and word choice. You probe self-awareness through the 'what would they say about you' question. You don't accept 'I never have conflicts'. Speak only in English.",
  },
  {
    id: "promo_weakness",
    vertical: "promotion",
    role: "Internal candidate / annual review",
    level: "mid",
    title_vi: "Annual review — \"Điểm yếu lớn nhất của bạn\"",
    title_en: "Annual review — \"What's your biggest weakness\"",
    context:
      "Câu hỏi cliché nhưng vẫn dùng vì nó lọc được mature vs immature candidates. Trả lời \"perfectionist\" là dấu chấm hết. Trả lời thật + đang làm gì để fix = mature.",
    typical_questions: [
      {
        question_en: "What's your biggest weakness?",
        question_vi: "Điểm yếu lớn nhất của bạn?",
        depth: "surface",
      },
      {
        question_en:
          "What are you actively doing to address it?",
        question_vi: "Bạn đang chủ động làm gì để khắc phục?",
        depth: "follow-up",
      },
      {
        question_en: "Who has given you that feedback?",
        question_vi: "Ai đã cho bạn feedback đó?",
        depth: "follow-up",
      },
      {
        question_en:
          "When was the last time it cost you something at work?",
        question_vi:
          "Lần gần nhất nó khiến bạn mất một thứ gì đó ở work là khi nào?",
        depth: "stress test",
      },
      {
        question_en: "What's a weakness you used to have but no longer do?",
        question_vi:
          "Điểm yếu nào bạn đã từng có nhưng giờ không còn?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I'm a perfectionist\" — câu cliché kinh điển. Manager đảo mắt ngay.",
      "Trả lời \"I work too hard\" — humble brag, càng tệ.",
      "Trả lời thật nhưng không có hành động. \"I'm bad at public speaking\" → manager hỏi \"so what are you doing about it\". Phải có hành động cụ thể.",
      "Né câu \"khi nào nó cost bạn\". Văn hoá Việt che giấu thất bại. Câu này test xem bạn có dám nhận thiệt hại không.",
      "Trả lời quá generic kiểu \"time management\". Phải cụ thể hơn: \"I underestimate how long code review takes me when I'm context switching\".",
      "Không có ai đã cho feedback đó. Điểm yếu thật phải có nguồn — manager, peer, 360 review.",
      "Phát âm \"weakness\" thành \"wik-nis\". Đúng là \"week-nis\" với \"ee\" dài.",
    ],
    sample_strong_answer:
      "My biggest weakness is over-committing in writing. When someone asks me 'can you take this on', I default to yes in the moment and then realize a week later I've taken on too much. My manager flagged this in my last 1:1 — she said I was looking burned out by the end of the quarter and tracked it back to commitment-creep. What I'm doing now: I have a 24-hour rule. For any non-urgent ask, I say 'let me check my load and come back tomorrow'. It's awkward at first but I've turned down two things this month I would have said yes to before. The last time it cost me something was Q3 — I missed the deadline on a smaller project because I'd doubled up. A weakness I used to have but no longer do: I used to over-explain in code reviews. I learned to ask one question instead of writing three paragraphs.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I'm a perfectionist.",
        why: "Cliché kinh điển. Tự động trừ điểm.",
        better_alternative:
          "I over-commit in writing — when asked I default to yes and regret it a week later.",
      },
      {
        what_not_to_say: "I don't really have weaknesses.",
        why: "Lack of self-awareness = mature signal mạnh nhất bị thiếu.",
        better_alternative:
          "The honest one is over-commitment — and I have a concrete habit I'm using to fix it.",
      },
      {
        what_not_to_say: "I work too hard sometimes.",
        why: "Humble brag.",
        better_alternative:
          "I don't pace myself well across a quarter — by week 10 my code review quality drops.",
      },
    ],
    estimated_time_minutes: 15,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a manager in an annual review. Your style: warm, probing for self-awareness. You don't accept 'perfectionist' or 'I work too hard'. You ask follow-ups: who gave you that feedback, what are you actively doing, when did it last cost you something. Speak only in English.",
  },
  {
    id: "promo_change_team",
    vertical: "promotion",
    role: "Internal candidate / annual review",
    level: "mid",
    title_vi: "Annual review — \"Bạn sẽ thay đổi gì ở team\"",
    title_en: "Annual review — \"What would you change about our team\"",
    context:
      "Câu này nhìn dễ nhưng tricky. Phải đủ honest để có giá trị, không quá thẳng để bị xem là khó hợp tác. Manager đang test xem bạn có ownership thinking hay chỉ phàn nàn.",
    typical_questions: [
      {
        question_en: "What would you change about our team?",
        question_vi: "Bạn sẽ thay đổi gì ở team chúng ta?",
        depth: "surface",
      },
      {
        question_en: "What's stopping that change from happening?",
        question_vi: "Điều gì đang cản thay đổi đó?",
        depth: "follow-up",
      },
      {
        question_en:
          "What's something you appreciate that we shouldn't change?",
        question_vi:
          "Có điều gì bạn quý ở team mà chúng ta không nên thay đổi?",
        depth: "follow-up",
      },
      {
        question_en:
          "What change have you tried to make that didn't take?",
        question_vi:
          "Có thay đổi nào bạn đã cố làm nhưng không thành công?",
        depth: "stress test",
      },
      {
        question_en:
          "If you were running this team next quarter, what's the first thing you'd do?",
        question_vi:
          "Nếu quý sau bạn dẫn team này, việc đầu tiên bạn làm là gì?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"nothing, the team is great\" — văn hoá Việt nịnh sếp; manager nghe thấy là không thinking critically.",
      "Phàn nàn không kèm proposal. \"We have too many meetings\" → manager hỏi \"so what would you change\". Phải có giải pháp.",
      "Đổ lỗi cho manager. Câu này không phải để khiếu nại — nói về system, process, culture.",
      "Né câu \"thay đổi nào bạn đã cố nhưng không thành công\". Câu này test ownership. Phải có ví dụ.",
      "Trả lời \"if I run the team\" theo lối tự kiêu. Câu này test priority thinking, không phải ego.",
      "Dùng \"should\" cho mọi proposal: \"we should do X, we should do Y\". Yếu. \"I'd propose X\" hoặc \"I think Y is the next step\" mạnh hơn.",
      "Phát âm \"appreciate\" thành \"ap-pre-she-ate\" 4 âm — đúng là \"a-pree-shee-ayt\".",
    ],
    sample_strong_answer:
      "One change: our retros are honest in private but go quiet in the room. I'd propose we collect retro topics async 24 hours before, anonymously, so the room is reading concrete items rather than waiting for someone to speak first. What's stopping that: nobody owns retros — they happen because the manager runs them. I'd own the change if I had the room. What I'd keep: our code review culture is genuinely good — engineers comment with care and we ship cleaner code than I have anywhere else. Change I tried that didn't take: I started a 'demo Friday' last summer and it died after three weeks because I didn't tie it to anyone's incentives. If I were running the team next quarter, the first thing I'd do is pair every senior with a junior on a small project — that signal alone shifts how reviews happen.",
    common_weak_phrasings: [
      {
        what_not_to_say: "Nothing, our team is perfect.",
        why: "Không thinking critically.",
        better_alternative:
          "One change: I'd run retros differently — collect topics async to get past the silence problem.",
      },
      {
        what_not_to_say: "We have too many meetings.",
        why: "Phàn nàn không kèm proposal.",
        better_alternative:
          "I'd cut our standing 1-hour design review to 30 minutes with mandatory pre-reads.",
      },
      {
        what_not_to_say: "Our manager should listen more.",
        why: "Đổ lỗi; cá nhân hoá.",
        better_alternative:
          "I think the team would benefit from a clearer way to surface dissent before decisions are made.",
      },
    ],
    estimated_time_minutes: 18,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a manager in an annual review. Your style: receptive but probing. You ask 'what's stopping that change' to test whether the candidate has actually thought about cause. You probe ownership by asking what they've tried that didn't take. Speak only in English.",
  },
  {
    id: "promo_failure",
    vertical: "promotion",
    role: "Internal candidate / annual review",
    level: "mid",
    title_vi: "Annual review — \"Kể về một lần thất bại\"",
    title_en: "Annual review — \"Describe a time you failed\"",
    context:
      "Câu cổ điển. Test maturity, self-awareness, growth. Câu trả lời tệ nhất: thất bại giả (\"I failed because I worked too hard\"). Câu trả lời tốt: thật, đau, có học.",
    typical_questions: [
      {
        question_en: "Describe a time you failed.",
        question_vi: "Kể về một lần bạn thất bại.",
        depth: "surface",
      },
      {
        question_en: "What did you do in the next 24 hours after you realized?",
        question_vi:
          "24 giờ đầu sau khi nhận ra, bạn đã làm gì?",
        depth: "follow-up",
      },
      {
        question_en:
          "Who else knew about it, and how did you tell them?",
        question_vi:
          "Còn ai khác biết, và bạn nói với họ thế nào?",
        depth: "follow-up",
      },
      {
        question_en:
          "What's a failure you still haven't fully recovered from?",
        question_vi:
          "Có thất bại nào bạn vẫn chưa hoàn toàn vượt qua?",
        depth: "stress test",
      },
      {
        question_en: "What's the cost of that failure to the company?",
        question_vi: "Thất bại đó thiệt hại cho công ty thế nào?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I never really failed at anything important\" — đỏ cờ tự kiêu.",
      "Trả lời thất bại giả: \"I failed because I cared too much\". Cliché không tin được.",
      "Bao biện: kể thất bại nhưng đổ lỗi cho hoàn cảnh, người khác. Phải own nó.",
      "Skip phần \"24 giờ đầu\". Đây là câu test bạn xử lý crisis thế nào — không phải kể câu chuyện.",
      "Né câu \"chưa hoàn toàn vượt qua\". Văn hoá Việt: thất bại phải đã được \"giải quyết\" mới được kể. Câu này muốn nghe thật ngược lại.",
      "Trả lời câu \"cost\" mơ hồ. Phải có số: tiền, thời gian, người, opportunity cost.",
      "Cảm xúc quá đà kiểu kể chuyện đời. Câu này là professional — kể fact, một câu cảm xúc đủ.",
    ],
    sample_strong_answer:
      "Last year I missed a critical bug in a Stripe webhook integration that double-charged about 200 customers. I caught it from a customer support escalation about 36 hours after the affected code shipped — the bug was in a corner case I hadn't tested. In the first 24 hours after I realized, I rolled the code back, wrote a customer-facing note for support to send, and reached out to my manager and finance lead before they reached out to me. Telling finance was the hardest part — I was the one who had to give them the refund total. The cost was about $4,800 in refunds plus operational time across three teams. What I still haven't fully recovered from: I'm now over-cautious on payment-related code. I push back on changes that I shouldn't push back on. That's something I'm working on this half.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I haven't really failed at anything important.",
        why: "Lack of self-awareness.",
        better_alternative:
          "Last year I missed a webhook bug that double-charged about 200 customers — let me walk you through what I learned.",
      },
      {
        what_not_to_say: "I failed because I cared too much.",
        why: "Cliché. Không thật.",
        better_alternative:
          "I failed because I skipped a test case I knew was a corner case. That's on me.",
      },
      {
        what_not_to_say: "It was the QA team's fault for not catching it.",
        why: "Đổ lỗi. Maturity = bạn own thất bại của bạn.",
        better_alternative:
          "QA didn't catch it but I was the author — I should have written the test myself.",
      },
    ],
    estimated_time_minutes: 18,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a manager in an annual review. Your style: warm but probing. You ask 'what did you do in the first 24 hours' to test crisis response. You probe ongoing impact, not just past. You don't accept 'I cared too much' or 'no real failures'. Speak only in English.",
  },
  {
    id: "promo_5_years",
    vertical: "promotion",
    role: "Internal candidate / annual review",
    level: "mid",
    title_vi: "Annual review — \"Bạn thấy mình ở đâu sau 5 năm\"",
    title_en: "Annual review — \"Where do you see yourself in 5 years\"",
    context:
      "Câu cliché nhưng vẫn được hỏi vì nó lọc xem bạn có suy nghĩ về career hay chỉ làm việc đến đâu hay đến đó. Manager đang đánh giá: bạn sẽ ở lại không, bạn cần gì để stay engaged, bạn có ambition phù hợp với role không.",
    typical_questions: [
      {
        question_en: "Where do you see yourself in 5 years?",
        question_vi: "Bạn thấy mình ở đâu sau 5 năm?",
        depth: "surface",
      },
      {
        question_en: "Are you on the IC track or the management track?",
        question_vi:
          "Bạn theo IC track (cá nhân đóng góp) hay management track?",
        depth: "follow-up",
      },
      {
        question_en:
          "What would you need from us to stay for those 5 years?",
        question_vi:
          "Bạn cần gì từ chúng tôi để ở lại 5 năm?",
        depth: "stress test",
      },
      {
        question_en:
          "What if 5 years from now you're still in this exact role?",
        question_vi:
          "Nếu 5 năm sau bạn vẫn ở vị trí này thì sao?",
        depth: "stress test",
      },
      {
        question_en: "What's outside of work that you want for those 5 years?",
        question_vi:
          "Ngoài work, bạn muốn gì cho 5 năm đó?",
        depth: "follow-up",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Trả lời \"I will be a manager / director / VP\" — title-driven nghe ngây thơ và threatening cho current manager.",
      "Trả lời \"I will still be at this company\" — quá flatter, không tin được.",
      "Né câu \"track nào\". Văn hoá Việt: management = thành công. Nhưng IC track ở Mỹ là path hợp lệ và respected.",
      "Né câu \"if still in same role\". Phải có câu trả lời: hoặc đó là OK với bạn, hoặc bạn sẽ rời — nói thật.",
      "Né câu \"outside of work\". Văn hoá Việt: work là tất cả khi nói với sếp. Mỹ thì coi việc bạn có life outside là healthy signal.",
      "Phát âm \"five years\" liên tục dính vào nhau \"five-yers\". Tách rõ.",
      "Trả lời quá robot, có cấu trúc. Câu này thân thiện, có thể chậm rãi và nói thật.",
    ],
    sample_strong_answer:
      "In five years I want to be a staff engineer on the IC track — that's the path that fits how I think about work. Specifically, I want to be the person teams call when there's a complicated systems decision to make, and I want to be coaching three or four senior engineers under me. To get there I need stretch projects with cross-team scope, which I'd want to start in the next promotion cycle. What I'd need from us to stay: clear feedback when I'm off-track, and time to do staff-level work, not just tech-lead work. If five years from now I'm still in the same role with no growth, I'd want to know now — that would tell me I'm at the wrong company. Outside of work, I want to be back in Vietnam at least three months a year to be near my parents — remote-friendly time is part of what makes this role sustainable.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I want to be a director.",
        why: "Title-driven; nghe ngây thơ và có thể threatening.",
        better_alternative:
          "I want to be a staff engineer on the IC track — coaching three or four seniors and being the person called for hard systems decisions.",
      },
      {
        what_not_to_say: "I want to still be working here.",
        why: "Quá flatter; không cụ thể.",
        better_alternative:
          "I want to still be here if the work keeps growing with me — that's the conditional part.",
      },
      {
        what_not_to_say: "I don't really know.",
        why: "Lack of agency = lack of promotion-readiness.",
        better_alternative:
          "I'm leaning toward IC track, and I'd like the next year to confirm that.",
      },
    ],
    estimated_time_minutes: 15,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a manager in a forward-looking part of an annual review. Your style: open, you ask about life outside work, you give credit for honest answers about staying or leaving. You probe whether the candidate has thought about IC vs management. Speak only in English.",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Sales / customer-facing (6)
// ──────────────────────────────────────────────────────────────────────

const SALES: ProInterviewScenario[] = [
  {
    id: "sales_cold_call",
    vertical: "sales",
    role: "B2B sales development rep",
    level: "entry",
    title_vi: "Sales — Luyện cold call",
    title_en: "Sales — Cold call practice",
    context:
      "Practice cold call cho B2B SDR. Bạn gọi cho VP of Engineering tại một công ty 200 người. Họ không biết bạn. Bạn có 30 giây để vượt qua reaction \"who are you\".",
    typical_questions: [
      {
        question_en: "Hi, this is [name] — can I help you?",
        question_vi: "Xin chào, tôi là [tên] — tôi giúp gì được anh/chị?",
        depth: "surface",
      },
      {
        question_en: "How did you get my number?",
        question_vi: "Sao anh/chị có số của tôi?",
        depth: "follow-up",
      },
      {
        question_en: "I'm in the middle of something. What is this about?",
        question_vi:
          "Tôi đang dở việc. Có chuyện gì?",
        depth: "stress test",
      },
      {
        question_en: "Send me an email instead.",
        question_vi: "Gửi email cho tôi đi.",
        depth: "stress test",
      },
      {
        question_en:
          "We already have a vendor for that.",
        question_vi:
          "Chúng tôi đã có vendor cho việc đó.",
        depth: "follow-up",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Mở đầu xin lỗi: \"I'm sorry to bother you\" — yếu ngay từ giây đầu. Mỹ: bạn đang gọi vì lý do, không phải xin phép.",
      "Đọc script. Người nghe phát hiện ngay 5 giây và cúp máy. Tập đến mức flow tự nhiên.",
      "Quá formal: \"Good morning sir, may I have a moment of your time\". Cold call B2B Mỹ là conversational, không formal.",
      "Không có \"reason for calling\" rõ ràng trong 10 giây đầu. Phải có một câu nêu lý do cụ thể: \"I'm calling because…\".",
      "Nói tốc độ nhanh do hồi hộp. Người Mỹ phát âm khác nhịp người Việt — tốc độ nhanh + accent = không hiểu được.",
      "Trả lời \"send me email\" bằng \"OK I will\" — fail. Phải có push back: \"Happy to. Quick question first — are you the right person for X?\"",
      "Văn hoá Việt: nghe \"already have vendor\" là rút lui. Sale Mỹ: pivot thành discovery question.",
    ],
    sample_strong_answer:
      "Hi Sarah, this is Minh from MercyBlade. I know I'm calling cold so I'll be quick — I'm reaching out because I saw your team posted three Vietnamese-speaking customer success roles last month, and we work with companies that need to onboard Vietnamese users without hiring a full local team. Is now a bad time, or do you have ninety seconds to hear what we do? — On 'we already have a vendor': totally hear you. Most of the teams we end up working with had something else first; can I ask which vendor you're using? I'm not trying to displace it — I want to know whether what we do is genuinely different.",
    common_weak_phrasings: [
      {
        what_not_to_say: "I'm sorry to bother you, do you have time?",
        why: "Xin lỗi mở đầu = yếu ngay.",
        better_alternative:
          "Hi Sarah, this is Minh — I'll be quick. I'm calling because I saw your team posted Vietnamese-speaking CS roles.",
      },
      {
        what_not_to_say: "OK I'll send email.",
        why: "Cuộc gọi đã chết. Phải push back.",
        better_alternative:
          "Happy to email — quick question first: are you the right person for this, or should I reach someone else?",
      },
      {
        what_not_to_say: "OK thank you, sorry to disturb.",
        why: "Tự gập mình.",
        better_alternative:
          "Sounds like you've got something working — can I ask which vendor, just so I know how we'd be different?",
      },
    ],
    estimated_time_minutes: 10,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a busy VP of Engineering receiving a cold call. Your style: brief, mildly impatient, you give vague brushoffs ('send me email', 'we have a vendor', 'now is a bad time') and judge how the candidate handles each. You're warmer if they're concise and have a real reason; you hang up if they ramble. Speak only in English.",
  },
  {
    id: "sales_objections",
    vertical: "sales",
    role: "Account executive",
    level: "mid",
    title_vi: "Sales — Xử lý phản đối",
    title_en: "Sales — Handling objections",
    context:
      "Cuộc gọi với prospect đã có 2 lần demo, đang sắp ký nhưng đột nhiên đưa ra phản đối lớn về giá. Bạn là AE, deal $80K/year. Mục tiêu: không discount thêm, nhưng giữ được deal.",
    typical_questions: [
      {
        question_en: "Honestly, your price is too high. Your competitor is 30% less.",
        question_vi:
          "Thẳng thắn, giá của bên anh quá cao. Đối thủ rẻ hơn 30%.",
        depth: "surface",
      },
      {
        question_en: "I need to think about it.",
        question_vi: "Tôi cần thời gian suy nghĩ.",
        depth: "follow-up",
      },
      {
        question_en:
          "Can you do $50K instead of $80K?",
        question_vi:
          "Có thể giảm xuống $50K thay vì $80K không?",
        depth: "stress test",
      },
      {
        question_en: "We're not sure about ROI.",
        question_vi: "Chúng tôi không chắc về ROI.",
        depth: "follow-up",
      },
      {
        question_en: "I need to talk to my CFO.",
        question_vi: "Tôi phải nói chuyện với CFO.",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Lập tức discount khi nghe \"too high\". Văn hoá Việt: muốn closeloop nhanh = nhường giá. Mỹ: phản đối giá thường là proxy cho lý do khác.",
      "Đồng ý \"yes you should think about it\" — deal chết. Phải pivot: \"What specifically do you need to think through?\"",
      "Né phần CFO. Phải hỏi: \"Helpful — what does your CFO need to see to say yes?\"",
      "Trả lời ROI bằng feature list. Sai. ROI = số tiền cụ thể họ tiết kiệm/kiếm được.",
      "Phát âm \"objection\" thành \"ob-jec-tion\" 3 âm rõ — đúng là \"ub-jek-shun\".",
      "Sợ silence. Văn hoá Việt: không thoải mái với khoảng lặng. Sales: silence sau câu hỏi tốt = vàng.",
      "Quá thân thiện, mất professional edge. Sales relationship Mỹ là warm + direct, không sycophantic.",
    ],
    sample_strong_answer:
      "I hear you on the price. Before we talk numbers — can I ask what specifically the competitor delivers in their proposal? In our experience, when teams compare us, the 30% gap usually maps to specific things they don't include — Vietnamese localization quality, the support team SLA, or the implementation week we cover. If those don't matter to you, you're right that we're not the best fit. If they do, the math changes. — On the $50K ask: I can't get to $50K and keep what we've scoped. What I can do is give you a 6-month payment plan and prioritize the implementation engineer. — On thinking about it: totally, what specifically would you want to think through? — On ROI: based on what you told me, our average customer your size sees about $180K of savings in year one from the support deflection alone. I can put that math in writing.",
    common_weak_phrasings: [
      {
        what_not_to_say: "OK I can give you 20% discount.",
        why: "Discount reflexive — đầu hàng quá nhanh.",
        better_alternative:
          "Before we talk discount — what specifically does the competitor's proposal include?",
      },
      {
        what_not_to_say: "OK take your time, let me know.",
        why: "Deal chết.",
        better_alternative:
          "Of course — what specifically would you want to think through? I'd rather answer the real question now.",
      },
      {
        what_not_to_say: "Yes our ROI is great.",
        why: "Không có số.",
        better_alternative:
          "Based on your team size, average customer sees $180K savings in year one from support deflection alone.",
      },
    ],
    estimated_time_minutes: 18,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a prospect raising objections in a late-stage sales call. Your style: skeptical but engaged, you raise multiple objections in sequence (price, ROI, timing, CFO), and you judge whether the candidate caves, deflects, or actually addresses them. Don't accept easy reframes — push back twice. Speak only in English.",
  },
  {
    id: "sales_demo",
    vertical: "sales",
    role: "Solutions engineer / AE",
    level: "mid",
    title_vi: "Sales — Demo presentation",
    title_en: "Sales — Demo presentation",
    context:
      "Bạn đang demo product cho 5 người buying committee. Mỗi người quan tâm thứ khác nhau: CTO (security), CFO (cost), VP Sales (UX), Product (integrations), Procurement (contract). Bạn có 30 phút.",
    typical_questions: [
      {
        question_en:
          "Walk us through your product.",
        question_vi: "Demo product của bạn cho chúng tôi.",
        depth: "surface",
      },
      {
        question_en:
          "How do you compare to [competitor]?",
        question_vi: "So với [đối thủ] thì sao?",
        depth: "follow-up",
      },
      {
        question_en: "What about security and compliance?",
        question_vi: "Còn security và compliance thì sao?",
        depth: "follow-up",
      },
      {
        question_en:
          "Can you show me what the worst case looks like?",
        question_vi:
          "Cho tôi xem case xấu nhất sẽ trông thế nào.",
        depth: "stress test",
      },
      {
        question_en:
          "We have specific compliance needs. Will you support them?",
        question_vi:
          "Chúng tôi có yêu cầu compliance cụ thể. Bên anh có hỗ trợ không?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Demo bằng cách click qua mọi feature. Sai — demo phải là story xoay quanh business problem họ có.",
      "Bỏ qua phần discovery trước demo. Phải hỏi 2 phút đầu: \"Before I show, what would success look like for each of you?\"",
      "Trả lời mọi câu bằng \"yes we can do that\". Mất uy tín. Phải có \"yes\", \"yes with caveat\", và một \"no\".",
      "Né câu so sánh đối thủ. Phải có 2 điểm bạn thật sự khác và 1 điểm đối thủ tốt hơn — admitting weakness builds trust.",
      "Hỏi quá nhiều câu xác nhận \"do you understand?\" — văn hoá Việt nhưng nghe insecure trong sales Mỹ.",
      "Quên addressing từng persona trong room. CTO câu khác, CFO câu khác. Tracking từng người.",
      "Phát âm \"compliance\" thành \"com-pli-ance\" 3 âm rõ — đúng là \"kum-plai-uns\".",
    ],
    sample_strong_answer:
      "Before I show anything — quick check around the room. Sarah, you mentioned security is the gate for you; Tom, you care most about how this connects to Salesforce. I want to make sure I cover both. I'll do a six-minute walkthrough on the main flow, then go deeper on what each of you raised. — As for [competitor], two real differences: we ship Vietnamese localization that's been reviewed by native speakers, and our SLA is 99.9% with credits, not just a target. Where they win: their reporting UI is genuinely cleaner than ours today. We're shipping a redesign in Q3. — Worst case looks like this: if our API is down, your fallback is the read-only mirror, which preserves all reads but blocks writes for up to 15 minutes. I can show you the runbook. — On your specific compliance: SOC 2 Type II is current, HIPAA we're not — that's an honest no.",
    common_weak_phrasings: [
      {
        what_not_to_say: "Let me show you all our features.",
        why: "Feature dump — không tie to their problem.",
        better_alternative:
          "I'll cover the two things you flagged as gates, then leave time for the rest.",
      },
      {
        what_not_to_say: "Yes, we can do everything you need.",
        why: "Mất uy tín.",
        better_alternative:
          "SOC 2 yes, HIPAA no — that's an honest gap if you need it.",
      },
      {
        what_not_to_say: "Our competitor is much worse.",
        why: "Trash-talking. Yếu.",
        better_alternative:
          "Their reporting UI is cleaner than ours today — we're shipping a redesign in Q3.",
      },
    ],
    estimated_time_minutes: 25,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a multi-stakeholder buying committee — sometimes the CTO asking about security, sometimes the CFO asking about cost. Your style: probing from different angles within the same call, you push for honest comparisons with competitors and you reward 'no, we don't do that' as much as 'yes'. Speak only in English.",
  },
  {
    id: "sales_negotiate",
    vertical: "sales",
    role: "Account executive",
    level: "senior",
    title_vi: "Sales — Đàm phán giá",
    title_en: "Sales — Negotiating price",
    context:
      "Final call để đóng deal. Prospect đã đồng ý value. Bây giờ về terms. Họ muốn discount lớn, payment terms dài hơn, và một free seat. Bạn cần giữ mostly margin nhưng đóng deal trong tuần.",
    typical_questions: [
      {
        question_en:
          "We need 25% off list price to make this work.",
        question_vi:
          "Chúng tôi cần giảm 25% so với list price để đồng ý.",
        depth: "surface",
      },
      {
        question_en: "Net-90 payment terms instead of Net-30.",
        question_vi:
          "Thanh toán Net-90 thay vì Net-30.",
        depth: "follow-up",
      },
      {
        question_en:
          "Throw in a free admin seat for our procurement team.",
        question_vi:
          "Tặng thêm một admin seat free cho team procurement.",
        depth: "follow-up",
      },
      {
        question_en:
          "If you can't do this, we'll go with [competitor].",
        question_vi:
          "Nếu bên anh không làm được, chúng tôi sẽ chọn [đối thủ].",
        depth: "stress test",
      },
      {
        question_en: "When can you have the contract back to us?",
        question_vi:
          "Khi nào bên anh có thể gửi lại hợp đồng?",
        depth: "follow-up",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Đồng ý 25% discount để đóng deal nhanh. Văn hoá Việt: không quen pushback giá. Sales Mỹ: discount = mất margin và precedent.",
      "Đồng ý mọi concession không asked for return. Mỗi concession phải kèm một give-back: \"I can do 15% if you sign a 3-year deal\".",
      "Tin threat \"we'll go with competitor\". 80% là bluff. Đáp lại bình tĩnh: \"that's a real option for you — what would they need to do for you to walk?\"",
      "Phát âm \"Net-30\" thành \"net thirty\" stretched — đúng là \"net thirdy\".",
      "Nói \"thank you so much for considering us\" sau mỗi câu của prospect. Quá grateful trong negotiation = lost leverage.",
      "Quên close mỗi negotiation step bằng \"and if I can do that, we have a deal — yes?\". Văn hoá Việt né câu kết. Sales: phải close.",
      "Không track tổng concession. Sau 5 phút có thể đã cho đi 30% giá trị deal mà không nhận lại gì.",
    ],
    sample_strong_answer:
      "Let me play these back: 25% off list, Net-90, plus a free seat. Each one I can address but I want to be honest about the trade. On the discount: I can't do 25% on a 1-year deal — the most I can do at one year is 12%. If you commit to three years, I can get you to 22%. On Net-90: I can do Net-60 if we add the standard 1.5% late-pay clause; Net-90 needs CFO sign-off and I'd rather not slow this down. On the free seat: I can include it if we close by end of week — that's the trade. On the competitor: that's a real option for you. Honestly, what would they need to do for you to choose them? — And to your last question: if we agree on these terms today, I can have a contract in your inbox in two hours.",
    common_weak_phrasings: [
      {
        what_not_to_say: "OK we can do 25% discount, no problem.",
        why: "No give-back; mất margin reflexively.",
        better_alternative:
          "I can get to 22% but only on a three-year commitment — that's the trade.",
      },
      {
        what_not_to_say: "Please don't go with the competitor.",
        why: "Yếu. Lost leverage.",
        better_alternative:
          "That's a real option for you — what would they need to do for you to choose them?",
      },
      {
        what_not_to_say: "Yes free seat, yes Net-90, yes everything.",
        why: "Concession không kèm return.",
        better_alternative:
          "Free seat if we close by Friday — that's the trade.",
      },
    ],
    estimated_time_minutes: 20,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a procurement-savvy buyer in final negotiations. Your style: friendly but you stack asks (discount, payment terms, free seats, urgency, competitor threat) and you watch whether the candidate gives concessions without trades. You bluff once with the competitor threat to test composure. Speak only in English.",
  },
  {
    id: "sales_onboard",
    vertical: "sales",
    role: "Customer success / onboarding",
    level: "mid",
    title_vi: "Sales — Onboarding khách hàng mới",
    title_en: "Sales — Onboarding a new client",
    context:
      "Kickoff call với khách hàng vừa ký contract $80K/year. 8 người trong room — bạn quản lý experience của họ trong 90 ngày tới. Việc của bạn: set expectations, build trust, surface risks sớm.",
    typical_questions: [
      {
        question_en:
          "Walk us through how the next 90 days will look.",
        question_vi:
          "Kể tôi nghe 90 ngày tới sẽ như thế nào.",
        depth: "surface",
      },
      {
        question_en:
          "What does success look like at day 90 from your side?",
        question_vi:
          "Thành công ở ngày 90 trông thế nào từ phía bạn?",
        depth: "follow-up",
      },
      {
        question_en:
          "Who do we contact when something breaks?",
        question_vi:
          "Khi có gì hỏng chúng tôi liên hệ ai?",
        depth: "follow-up",
      },
      {
        question_en:
          "What's the most common reason customers your size struggle in onboarding?",
        question_vi:
          "Lý do phổ biến nhất khiến khách hàng cùng size struggle trong onboarding là gì?",
        depth: "stress test",
      },
      {
        question_en:
          "What if we hit a delay on our side?",
        question_vi:
          "Nếu phía chúng tôi bị trễ thì sao?",
        depth: "stress test",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Chỉ list tasks: \"week 1 we do X, week 2 we do Y\". Sai. Phải kể câu chuyện về outcomes mỗi mốc.",
      "Né câu \"common struggle\". Sợ scare prospect. Nhưng customer mới đang ký vì trust — surface risk = trust.",
      "Hứa \"we'll handle everything\". Sai. Phải nói ai làm gì — bạn vs họ. Phụ thuộc đôi bên thì onboarding mới success.",
      "Phát âm \"onboarding\" thành \"on-boarding\" tách rõ. Đúng là \"on-bord-ing\" liền mạch.",
      "Trả lời câu \"what if delay\" bằng \"don't worry, no problem\" — yếu. Phải có protocol rõ.",
      "Quên define success metrics ngay từ kickoff. Văn hoá Việt: bắt đầu rồi tính. Sales SaaS: đo từ ngày một.",
      "Không introduce team member khác. Customer cần biết technical lead, support contact, escalation path.",
    ],
    sample_strong_answer:
      "Here's how I think about the next 90 days. Days 1–14 are setup: we get your data flowing in, we run a parallel test against your existing system, and you and I meet twice a week. Days 15–45 we go live with one team — typically your support org first because it's lowest risk — and we measure two specific things: ticket deflection rate and CSAT. Days 46–90 we expand to the rest of the org. Now: success at day 90 from our side is your team using us without help, and a 20% reduction in tickets your reps handle manually. What does it look like from yours? — On the failure mode: the most common reason teams your size struggle is internal change management, not the product. We'll address it by having me check in with each of your team leads weekly. — Delay protocol: if either of us hits a slip, we surface it in the weekly meeting, document the new date, and adjust scope before we adjust quality.",
    common_weak_phrasings: [
      {
        what_not_to_say: "Don't worry, we'll handle everything for you.",
        why: "Hứa quá. Khách hàng phải own một phần.",
        better_alternative:
          "Here's the split — your side owns data access; our side owns the parallel test and the cutover.",
      },
      {
        what_not_to_say: "Most customers do fine, no problem.",
        why: "Né phần thật. Mất cơ hội build trust.",
        better_alternative:
          "The most common struggle isn't the product — it's internal change management. Here's how we address it.",
      },
      {
        what_not_to_say: "Don't worry about delay.",
        why: "Vague.",
        better_alternative:
          "If either side slips, we document it in the weekly check-in and adjust scope before quality.",
      },
    ],
    estimated_time_minutes: 22,
    interviewer_system_prompt:
      "You are Mercy, playing the role of a customer success manager facing the new client. Your style: warm, structured, you set expectations clearly. You're testing whether the candidate names risks early, names a clear success metric, and gives a concrete delay protocol. Speak only in English.",
  },
  {
    id: "sales_complaint",
    vertical: "sales",
    role: "Customer service / account manager",
    level: "mid",
    title_vi: "Sales — Xử lý khiếu nại khách hàng",
    title_en: "Sales — Customer service complaint",
    context:
      "Khách hàng gọi giận dữ vì product đã bị lỗi 4 ngày, support trả lời chậm, và họ đang dọa rời sang đối thủ. Bạn là account manager. Mục tiêu: bình ổn cảm xúc, fix root cause, giữ relationship.",
    typical_questions: [
      {
        question_en:
          "I've been dealing with this for four days. What is going on?",
        question_vi:
          "Tôi đã chịu đựng cái này 4 ngày. Chuyện gì đang xảy ra?",
        depth: "surface",
      },
      {
        question_en:
          "Why didn't anyone tell me about this?",
        question_vi:
          "Sao không ai báo cho tôi biết?",
        depth: "follow-up",
      },
      {
        question_en:
          "How do I know this won't happen again?",
        question_vi:
          "Làm sao tôi biết chuyện này không tái diễn?",
        depth: "stress test",
      },
      {
        question_en:
          "I want a refund — what are you going to do?",
        question_vi:
          "Tôi muốn refund — bạn sẽ làm gì?",
        depth: "stress test",
      },
      {
        question_en:
          "Can I trust your team after this?",
        question_vi:
          "Sau chuyện này tôi còn tin team bạn được không?",
        depth: "follow-up",
      },
    ],
    vietnamese_speaker_pitfalls: [
      "Defensive ngay: \"actually it's not our fault\". Sai. Đầu tiên là acknowledge cảm xúc, sau đó mới fact.",
      "Xin lỗi quá đà 5 lần. Một xin lỗi rõ ràng > 5 cái rời rạc. \"I'm sorry — let me tell you exactly what happened\".",
      "Hứa quá: \"this will never happen again\". Không thể đảm bảo. Phải nói \"here's what we're changing so it's much less likely\".",
      "Bypass authority: hứa refund mà chưa biết policy. Phải nói: \"I'm going to escalate the refund question to my director and have an answer by EOD\".",
      "Văn hoá Việt: tránh đối đầu, nhường mọi thứ. Customer service Mỹ: empathy first, but not endless concession.",
      "Phát âm \"apologize\" thành \"apo-lo-gize\" 4 âm rõ — đúng là \"u-pol-u-jaiz\".",
      "Né câu \"can I trust your team\". Phải có câu trả lời thật: \"Honestly, you have reason to be skeptical right now. Here's what I'm going to do to earn it back\".",
    ],
    sample_strong_answer:
      "I'm sorry — four days is too long, and I understand why you're frustrated. Let me tell you what I know and what I don't. What I know: the issue was a misconfigured webhook on our side, fixed yesterday, and we should have proactively notified you on day one. What I don't know yet: why the proactive alert didn't fire — I'm meeting with our SRE lead this afternoon and I'll have an answer to you by tomorrow. On the refund question: I want to make this right but I need to confirm the credit amount with my director — I'll have a number to you by end of day, not tomorrow. On trust: honestly, you have every reason to be skeptical of us this week. The thing I can promise is more transparency: I'll send you a written postmortem within five business days, and I'll set up a weekly check-in with you for the next month so you have a direct line. Does that start to address it?",
    common_weak_phrasings: [
      {
        what_not_to_say: "Actually it's not our fault, it's a third-party issue.",
        why: "Defensive trước khi acknowledge cảm xúc.",
        better_alternative:
          "I'm sorry — four days is too long. Let me tell you what I know.",
      },
      {
        what_not_to_say: "This will never happen again, I promise.",
        why: "Không thể đảm bảo.",
        better_alternative:
          "Here's what we're changing so it's much less likely — and here's how we'll catch it faster if it does.",
      },
      {
        what_not_to_say: "Yes I'll refund everything right now.",
        why: "Có thể không thẩm quyền; promise rồi rút lại worse than chậm trả lời.",
        better_alternative:
          "I want to make this right — let me confirm the credit amount with my director and get back to you by EOD.",
      },
    ],
    estimated_time_minutes: 18,
    interviewer_system_prompt:
      "You are Mercy, playing the role of an angry customer who has been dealing with a 4-day outage. Your style: frustrated but reachable, you escalate if the candidate is defensive or under-empathetic, you de-escalate if they acknowledge first and have a concrete plan. You ask 'can I trust your team' as a final test. Speak only in English.",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Registry
// ──────────────────────────────────────────────────────────────────────

export const PRO_SCENARIOS: ProInterviewScenario[] = [
  ...SOFTWARE,
  ...UNIVERSITY,
  ...VISA,
  ...PROMOTION,
  ...SALES,
];

export const PRO_SCENARIO_BY_ID: Readonly<
  Record<string, ProInterviewScenario>
> = Object.freeze(
  Object.fromEntries(PRO_SCENARIOS.map((s) => [s.id, s])),
);

export const ALL_PRO_SCENARIO_IDS: ReadonlyArray<string> = PRO_SCENARIOS.map(
  (s) => s.id,
);

export const PRO_VERTICALS: ReadonlyArray<ProVertical> = [
  "software",
  "university",
  "visa",
  "promotion",
  "sales",
];

export const PRO_VERTICAL_LABELS: Record<
  ProVertical,
  { vi: string; en: string }
> = {
  software: { vi: "Phỏng vấn IT / phần mềm", en: "Software / IT" },
  university: { vi: "Tuyển sinh đại học", en: "University admissions" },
  visa: { vi: "Phỏng vấn visa / định cư", en: "Visa / immigration" },
  promotion: { vi: "Đánh giá / thăng chức", en: "Promotion / annual review" },
  sales: { vi: "Sales / dịch vụ khách hàng", en: "Sales / customer-facing" },
};

export function listProScenarios(): ProInterviewScenario[] {
  return [...PRO_SCENARIOS];
}

export function getProScenarioById(id: string): ProInterviewScenario | null {
  return PRO_SCENARIO_BY_ID[id] ?? null;
}

export function listProScenariosByVertical(
  vertical: ProVertical,
): ProInterviewScenario[] {
  return PRO_SCENARIOS.filter((s) => s.vertical === vertical);
}



