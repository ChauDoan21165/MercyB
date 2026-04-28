// src/data/writing-prompts/prompts.ts
//
// 40 real-life writing prompts across 8 categories. Bilingual (VN
// primary). The list page (/writing) renders these via a static
// import — there is no Supabase fetch on the list path because the
// content is shipped with the bundle.
//
// Why ship as static data instead of seeding into Supabase: editors
// (Chau, future contributors) can change copy without DB access, and
// the FK target in `user_writing_submissions.prompt_id` stays valid as
// long as the migration's UPSERT step runs (or as long as we treat the
// prompts table as a soft index — submissions reference prompt id
// strings which match the static dataset).
//
// Distribution: 5 workplace email, 5 customer service, 5 social media,
// 5 personal message, 3 dating profile, 5 job application, 6 daily
// life, 6 creative — exactly 40 rows.

import type { WritingPrompt } from "@/lib/writing/types";

export const WRITING_PROMPTS: readonly WritingPrompt[] = [
  // ── Workplace email (5) ─────────────────────────────────────────────
  {
    id: "we_sick_leave",
    category: "workplace_email",
    title_vi: "Xin nghỉ ốm",
    title_en: "Asking for sick leave",
    scenario_vi:
      "Bạn bị sốt cao từ tối qua, sáng nay không thể đi làm. Viết email cho sếp xin nghỉ ốm 1 ngày, hứa sẽ trả lời tin nhắn quan trọng từ điện thoại nếu cần.",
    scenario_en:
      "You came down with a fever last night and can't make it in today. Write a short email to your manager requesting one day of sick leave, promising to answer urgent messages from your phone if needed.",
    target_words_min: 60,
    target_words_max: 120,
    difficulty: "easy",
  },
  {
    id: "we_request_raise",
    category: "workplace_email",
    title_vi: "Đề xuất tăng lương",
    title_en: "Requesting a raise",
    scenario_vi:
      "Bạn đã làm tốt công việc trong 14 tháng qua và đảm nhận thêm trách nhiệm sau khi đồng nghiệp nghỉ. Viết email cho sếp xin một cuộc họp để bàn về việc tăng lương. Lịch sự, có dẫn chứng cụ thể, không nêu con số trong email.",
    scenario_en:
      "You've been performing well for 14 months and took on extra responsibilities after a teammate left. Write an email to your manager requesting a meeting to discuss a raise. Polite, with concrete evidence, no specific number mentioned in the email itself.",
    target_words_min: 100,
    target_words_max: 180,
    difficulty: "hard",
  },
  {
    id: "we_decline_meeting",
    category: "workplace_email",
    title_vi: "Từ chối tham gia họp",
    title_en: "Declining a meeting",
    scenario_vi:
      "Bạn được mời họp 1 tiếng vào lúc bạn có deadline khác. Viết email từ chối lịch sự, đề xuất gửi note hoặc họp lại vào hôm sau.",
    scenario_en:
      "You've been invited to a 1-hour meeting that conflicts with another deadline. Write a polite decline, offering to send notes or reschedule for the next day.",
    target_words_min: 50,
    target_words_max: 100,
    difficulty: "easy",
  },
  {
    id: "we_report_issue",
    category: "workplace_email",
    title_vi: "Báo cáo sự cố hệ thống",
    title_en: "Reporting a system issue",
    scenario_vi:
      "Hệ thống thanh toán nội bộ bị lỗi từ 9 giờ sáng — đơn hàng không xử lý được. Viết email cho team kỹ thuật mô tả vấn đề, thời gian bắt đầu, và mức độ ảnh hưởng đến khách hàng.",
    scenario_en:
      "The internal payment system has been down since 9am and orders aren't processing. Write an email to the tech team describing the issue, when it started, and the customer impact.",
    target_words_min: 80,
    target_words_max: 150,
    difficulty: "medium",
  },
  {
    id: "we_thank_colleague",
    category: "workplace_email",
    title_vi: "Cảm ơn đồng nghiệp",
    title_en: "Thanking a colleague",
    scenario_vi:
      "Một đồng nghiệp đã ở lại muộn giúp bạn hoàn thành dự án quan trọng. Viết email cảm ơn, cụ thể về việc họ đã làm và CC sếp của họ để công việc của họ được ghi nhận.",
    scenario_en:
      "A colleague stayed late to help you finish an important project. Write a thank-you email — specific about what they did, and CC their manager so their effort is recognized.",
    target_words_min: 60,
    target_words_max: 120,
    difficulty: "easy",
  },

  // ── Customer service (5) ────────────────────────────────────────────
  {
    id: "cs_complaint",
    category: "customer_service",
    title_vi: "Khiếu nại sản phẩm hỏng",
    title_en: "Product complaint",
    scenario_vi:
      "Bạn đặt một chiếc điện thoại trên Amazon, khi nhận thì màn hình bị nứt. Viết email khiếu nại, mô tả vấn đề, kèm yêu cầu cụ thể (thay mới hoặc hoàn tiền).",
    scenario_en:
      "You ordered a phone on Amazon and it arrived with a cracked screen. Write a complaint email describing the issue and stating exactly what you want (replacement or refund).",
    target_words_min: 80,
    target_words_max: 150,
    difficulty: "medium",
  },
  {
    id: "cs_refund_request",
    category: "customer_service",
    title_vi: "Yêu cầu hoàn tiền",
    title_en: "Refund request",
    scenario_vi:
      "Bạn đăng ký gói tập gym 1 năm nhưng phải chuyển nhà sau 2 tháng. Viết email yêu cầu hoàn lại phần chưa sử dụng, đính kèm lý do hợp lý.",
    scenario_en:
      "You signed up for a one-year gym membership but have to move after two months. Write an email requesting a refund for the unused portion, with a reasonable explanation.",
    target_words_min: 80,
    target_words_max: 140,
    difficulty: "medium",
  },
  {
    id: "cs_review",
    category: "customer_service",
    title_vi: "Viết review nhà hàng",
    title_en: "Writing a restaurant review",
    scenario_vi:
      "Bạn vừa ăn tối ở một nhà hàng Việt Nam ở Mỹ. Đồ ăn ngon nhưng phục vụ chậm. Viết review 4/5 sao trên Yelp — trung thực, công bằng.",
    scenario_en:
      "You just had dinner at a Vietnamese restaurant in the US. Food was great but service was slow. Write a 4/5-star Yelp review — honest and fair.",
    target_words_min: 80,
    target_words_max: 160,
    difficulty: "medium",
  },
  {
    id: "cs_feedback_form",
    category: "customer_service",
    title_vi: "Điền form góp ý",
    title_en: "Filling a feedback form",
    scenario_vi:
      "Một công ty bảo hiểm gửi form khảo sát sau khi xử lý hồ sơ của bạn. Viết phần 'comments' — nói rõ điểm tốt và điểm cần cải thiện.",
    scenario_en:
      "An insurance company sent you a survey after processing your claim. Fill in the 'comments' field — clear on what was good and what needs improving.",
    target_words_min: 60,
    target_words_max: 120,
    difficulty: "easy",
  },
  {
    id: "cs_support_ticket",
    category: "customer_service",
    title_vi: "Mở ticket hỗ trợ kỹ thuật",
    title_en: "Opening a support ticket",
    scenario_vi:
      "Phần mềm kế toán của công ty không cho phép xuất báo cáo PDF từ hôm qua. Viết support ticket — mô tả các bước đã thử, lỗi nhận được, và mức độ ảnh hưởng.",
    scenario_en:
      "Your company's accounting software has been failing to export PDF reports since yesterday. Open a support ticket — describe the steps you tried, the error message, and the business impact.",
    target_words_min: 80,
    target_words_max: 150,
    difficulty: "medium",
  },

  // ── Social media (5) ────────────────────────────────────────────────
  {
    id: "sm_self_intro",
    category: "social_media",
    title_vi: "Giới thiệu bản thân trên LinkedIn",
    title_en: "Introducing yourself on LinkedIn",
    scenario_vi:
      "Bạn vừa chuyển sang Mỹ và đang tìm việc trong ngành software. Viết phần 'About' trên LinkedIn — kể về kỹ năng, kinh nghiệm, và mục tiêu nghề nghiệp.",
    scenario_en:
      "You just moved to the US and are job-hunting in software. Write a LinkedIn 'About' section — your skills, experience, and what you're looking for next.",
    target_words_min: 100,
    target_words_max: 180,
    difficulty: "medium",
  },
  {
    id: "sm_weekend_post",
    category: "social_media",
    title_vi: "Post cuối tuần trên Facebook",
    title_en: "Weekend Facebook post",
    scenario_vi:
      "Bạn vừa đi hiking lần đầu ở một công viên gần nhà. Viết post Facebook chia sẻ trải nghiệm — ngắn, tự nhiên, có chỗ để bạn bè comment.",
    scenario_en:
      "You went hiking for the first time at a park near home. Write a Facebook post about it — short, natural, leaves room for friends to chime in.",
    target_words_min: 50,
    target_words_max: 110,
    difficulty: "easy",
  },
  {
    id: "sm_recommendation",
    category: "social_media",
    title_vi: "Giới thiệu sản phẩm yêu thích",
    title_en: "Recommending a favorite product",
    scenario_vi:
      "Một nồi chiên không dầu đã thay đổi việc nấu ăn của bạn. Viết post Instagram giới thiệu — không phải quảng cáo, kể trải nghiệm thật.",
    scenario_en:
      "An air fryer has changed how you cook. Write an Instagram post recommending it — not an ad, just a real experience.",
    target_words_min: 60,
    target_words_max: 120,
    difficulty: "easy",
  },
  {
    id: "sm_holiday_greeting",
    category: "social_media",
    title_vi: "Lời chúc Tết tới bạn bè",
    title_en: "Lunar New Year greeting",
    scenario_vi:
      "Sắp Tết. Viết lời chúc trên Facebook gửi tới bạn bè — bao gồm cả bạn bè người Mỹ chưa biết Tết là gì. Một câu giải thích ngắn về Tết, lời chúc cụ thể.",
    scenario_en:
      "Lunar New Year is coming up. Write a Facebook greeting for friends — including American friends who don't know what Tết is. One short line explaining the holiday, then your wishes.",
    target_words_min: 70,
    target_words_max: 140,
    difficulty: "medium",
  },
  {
    id: "sm_opinion_post",
    category: "social_media",
    title_vi: "Chia sẻ quan điểm về một tin tức",
    title_en: "Sharing an opinion on a news story",
    scenario_vi:
      "Một tin tức về AI thay thế việc làm vừa lan truyền. Viết post LinkedIn chia sẻ quan điểm của bạn — có lý lẽ, không gây tranh cãi không cần thiết.",
    scenario_en:
      "A news story about AI replacing jobs is going viral. Write a LinkedIn post with your perspective — reasoned, not unnecessarily inflammatory.",
    target_words_min: 100,
    target_words_max: 180,
    difficulty: "hard",
  },

  // ── Personal message (5) ────────────────────────────────────────────
  {
    id: "pm_apology",
    category: "personal_message",
    title_vi: "Xin lỗi bạn thân",
    title_en: "Apology to a close friend",
    scenario_vi:
      "Bạn quên sinh nhật của bạn thân. Đó là tuần thứ ba bạn 'quên' một việc quan trọng. Viết tin nhắn xin lỗi — chân thành, không bào chữa.",
    scenario_en:
      "You forgot your best friend's birthday. It's the third week in a row you've forgotten something important. Write an apology — sincere, no excuses.",
    target_words_min: 60,
    target_words_max: 120,
    difficulty: "medium",
  },
  {
    id: "pm_congrats",
    category: "personal_message",
    title_vi: "Chúc mừng anh chị em đỗ đại học",
    title_en: "Congratulating a sibling on college admission",
    scenario_vi:
      "Em trai vừa được nhận vào đại học UC Berkeley. Viết tin nhắn chúc mừng — chân thành, kể lại bạn thấy nỗ lực của em ra sao.",
    scenario_en:
      "Your younger brother just got into UC Berkeley. Write a congratulations message — sincere, mention the effort you saw him put in.",
    target_words_min: 50,
    target_words_max: 110,
    difficulty: "easy",
  },
  {
    id: "pm_ask_favor",
    category: "personal_message",
    title_vi: "Nhờ bạn chở ra sân bay",
    title_en: "Asking a friend for an airport ride",
    scenario_vi:
      "Bạn cần ai đó chở ra sân bay 4 giờ sáng thứ Bảy. Nhắn cho một người bạn — không gây áp lực, có phương án dự phòng.",
    scenario_en:
      "You need someone to drive you to the airport at 4am on Saturday. Message a friend — no pressure, with a fallback plan if they can't.",
    target_words_min: 50,
    target_words_max: 100,
    difficulty: "easy",
  },
  {
    id: "pm_decline_invitation",
    category: "personal_message",
    title_vi: "Từ chối lời mời tiệc",
    title_en: "Declining a party invitation",
    scenario_vi:
      "Bạn được mời tới tiệc cưới của một đồng nghiệp không thân lắm vào cuối tuần bạn đã có kế hoạch riêng. Viết tin nhắn từ chối — lịch sự, không nói dối.",
    scenario_en:
      "You've been invited to a wedding of a colleague you're not close to, on a weekend you already have plans. Write a polite decline — no lies.",
    target_words_min: 50,
    target_words_max: 100,
    difficulty: "medium",
  },
  {
    id: "pm_breakup",
    category: "personal_message",
    title_vi: "Chia tay qua tin nhắn (mối quan hệ ngắn)",
    title_en: "Ending a short relationship via text",
    scenario_vi:
      "Sau 6 tuần hẹn hò, bạn nhận ra hai người không hợp. Viết tin nhắn chấm dứt mối quan hệ — tử tế, không đổ lỗi, không hy vọng giả.",
    scenario_en:
      "After six weeks of dating you've realized you're not a good match. Write a message ending things — kind, not blaming, no false hope.",
    target_words_min: 60,
    target_words_max: 130,
    difficulty: "hard",
  },

  // ── Dating profile (3) ─────────────────────────────────────────────
  {
    id: "dp_bio",
    category: "dating_profile",
    title_vi: "Viết bio Tinder",
    title_en: "Tinder bio",
    scenario_vi:
      "Bạn 28 tuổi, làm engineer, thích leo núi, nấu ăn, và phim Hàn. Viết bio Tinder 4-5 dòng — vui, có cá tính, không sáo rỗng.",
    scenario_en:
      "You're 28, work as an engineer, into hiking, cooking, and Korean movies. Write a 4-5 line Tinder bio — fun, has personality, no clichés.",
    target_words_min: 40,
    target_words_max: 80,
    difficulty: "medium",
  },
  {
    id: "dp_opener",
    category: "dating_profile",
    title_vi: "Tin nhắn mở đầu",
    title_en: "Opener message",
    scenario_vi:
      "Bạn match với một người trên Hinge. Bio của họ có nhắc tới việc thích đi du lịch và làm gốm. Viết tin nhắn mở đầu — không 'hi', cá nhân hóa, mở câu hỏi.",
    scenario_en:
      "You matched with someone on Hinge. Their bio mentions traveling and pottery. Write an opener — no plain 'hi', personalized, with an open question.",
    target_words_min: 30,
    target_words_max: 70,
    difficulty: "medium",
  },
  {
    id: "dp_response_to_match",
    category: "dating_profile",
    title_vi: "Trả lời match đầu tiên",
    title_en: "Reply to a first match message",
    scenario_vi:
      "Match của bạn vừa nhắn 'Bạn cuối tuần làm gì vui không?'. Viết câu trả lời — kể trải nghiệm cụ thể, hỏi lại họ, để cuộc trò chuyện kéo dài.",
    scenario_en:
      "Your match just messaged 'What did you do this weekend?'. Write a reply — give a specific story, return the question, keep the chat alive.",
    target_words_min: 40,
    target_words_max: 90,
    difficulty: "easy",
  },

  // ── Job application (5) ─────────────────────────────────────────────
  {
    id: "ja_cover_letter_intro",
    category: "job_application",
    title_vi: "Mở đầu cover letter",
    title_en: "Cover letter opening",
    scenario_vi:
      "Bạn ứng tuyển vị trí Software Engineer tại Stripe. Viết đoạn mở đầu cover letter — 2-3 câu, hook người đọc, không sáo rỗng kiểu 'I am writing to apply for...'.",
    scenario_en:
      "You're applying to a Software Engineer role at Stripe. Write the cover-letter opening — 2-3 sentences, hook the reader, no clichéd 'I am writing to apply for...'.",
    target_words_min: 50,
    target_words_max: 90,
    difficulty: "hard",
  },
  {
    id: "ja_why_company",
    category: "job_application",
    title_vi: "Tại sao chọn công ty này",
    title_en: "Why this company",
    scenario_vi:
      "Trong cover letter cho một startup AI, viết đoạn 'Why this company' — cụ thể, có dẫn chứng (sản phẩm, blog, người sáng lập), không generic.",
    scenario_en:
      "In a cover letter for an AI startup, write the 'Why this company' paragraph — specific, citing the product / blog / founder, not generic.",
    target_words_min: 80,
    target_words_max: 150,
    difficulty: "hard",
  },
  {
    id: "ja_why_role",
    category: "job_application",
    title_vi: "Tại sao chọn vị trí này",
    title_en: "Why this role",
    scenario_vi:
      "Bạn từ developer chuyển sang vị trí product manager. Viết đoạn 'Why this role' giải thích chuyển hướng — có lý do mạnh, có ví dụ.",
    scenario_en:
      "You're transitioning from developer to product manager. Write the 'Why this role' paragraph — strong reasoning, with an example.",
    target_words_min: 80,
    target_words_max: 150,
    difficulty: "hard",
  },
  {
    id: "ja_salary_expectation",
    category: "job_application",
    title_vi: "Trả lời câu hỏi mức lương mong muốn",
    title_en: "Answering a salary expectation question",
    scenario_vi:
      "Recruiter hỏi mức lương mong muốn qua email. Viết câu trả lời — khoảng lương có cơ sở, để chỗ thương lượng, không cam kết quá sớm.",
    scenario_en:
      "A recruiter asks your salary expectations by email. Write a reply — a researched range, leaves room to negotiate, doesn't commit too early.",
    target_words_min: 60,
    target_words_max: 120,
    difficulty: "hard",
  },
  {
    id: "ja_followup_after_interview",
    category: "job_application",
    title_vi: "Email cảm ơn sau phỏng vấn",
    title_en: "Follow-up email after an interview",
    scenario_vi:
      "Bạn vừa phỏng vấn vòng cuối ở một công ty bạn rất thích. Viết email cảm ơn — nhắc lại một điểm cụ thể từ buổi phỏng vấn, ngắn gọn.",
    scenario_en:
      "You just had your final interview at a company you really want. Write a thank-you email — reference one specific moment from the interview, keep it short.",
    target_words_min: 60,
    target_words_max: 130,
    difficulty: "medium",
  },

  // ── Daily life (6) ──────────────────────────────────────────────────
  {
    id: "dl_apartment_lease",
    category: "daily_life",
    title_vi: "Hỏi điều khoản hợp đồng thuê nhà",
    title_en: "Apartment lease question",
    scenario_vi:
      "Bạn xem xét ký hợp đồng thuê 1 năm. Viết email cho landlord hỏi rõ về cọc, phụ phí thú cưng, và điều khoản chấm dứt sớm.",
    scenario_en:
      "You're considering a 1-year lease. Email the landlord with clear questions about the deposit, pet fees, and early-termination terms.",
    target_words_min: 80,
    target_words_max: 150,
    difficulty: "medium",
  },
  {
    id: "dl_doctor_symptoms",
    category: "daily_life",
    title_vi: "Mô tả triệu chứng cho bác sĩ qua portal",
    title_en: "Describing symptoms via patient portal",
    scenario_vi:
      "Bạn có triệu chứng đau lưng kéo dài 3 tuần. Viết tin nhắn qua patient portal cho bác sĩ — mô tả thời gian, vị trí, mức độ, hoạt động làm tệ hơn.",
    scenario_en:
      "You've had lower-back pain for three weeks. Send a message via the patient portal — duration, location, severity, what makes it worse.",
    target_words_min: 80,
    target_words_max: 150,
    difficulty: "medium",
  },
  {
    id: "dl_school_enrollment",
    category: "daily_life",
    title_vi: "Email đăng ký nhập học cho con",
    title_en: "School enrollment email",
    scenario_vi:
      "Bạn vừa chuyển nhà sang một học khu mới. Viết email cho văn phòng trường tiểu học hỏi quy trình đăng ký, giấy tờ cần chuẩn bị, và lịch hẹn.",
    scenario_en:
      "You just moved to a new school district. Email the elementary school office asking about the enrollment process, required documents, and how to schedule an appointment.",
    target_words_min: 70,
    target_words_max: 140,
    difficulty: "medium",
  },
  {
    id: "dl_landlord_complaint",
    category: "daily_life",
    title_vi: "Khiếu nại với landlord về vấn đề bảo trì",
    title_en: "Maintenance complaint to landlord",
    scenario_vi:
      "Máy nước nóng đã bị hỏng 5 ngày, landlord chưa phản hồi. Viết email lần thứ hai — chuyên nghiệp, nhắc deadline cũ, nói rõ bước tiếp theo nếu vẫn không sửa.",
    scenario_en:
      "Your water heater has been broken for 5 days and the landlord hasn't responded. Write a follow-up email — professional, reference the prior request, state the next step if still unresolved.",
    target_words_min: 100,
    target_words_max: 180,
    difficulty: "hard",
  },
  {
    id: "dl_neighbor_note",
    category: "daily_life",
    title_vi: "Note để lại cho hàng xóm",
    title_en: "Note for a neighbor",
    scenario_vi:
      "Bạn sẽ tổ chức tiệc nhỏ tối thứ Bảy. Viết note ngắn dán ở cửa hàng xóm bên cạnh — báo trước, để số điện thoại nếu họ thấy ồn.",
    scenario_en:
      "You're hosting a small party Saturday night. Write a short note for your neighbor's door — heads-up, with your phone number in case it gets too loud.",
    target_words_min: 40,
    target_words_max: 90,
    difficulty: "easy",
  },
  {
    id: "dl_lost_item_report",
    category: "daily_life",
    title_vi: "Báo cáo mất đồ trên xe Uber",
    title_en: "Lost item report (Uber)",
    scenario_vi:
      "Bạn để quên ba lô có laptop trên Uber. Viết tin nhắn qua app cho tài xế — mô tả ba lô, thời gian, đề xuất hẹn gặp để nhận lại.",
    scenario_en:
      "You left your backpack with a laptop in an Uber. Message the driver through the app — describe the bag, when, propose a place to meet up.",
    target_words_min: 60,
    target_words_max: 120,
    difficulty: "medium",
  },

  // ── Creative (6) ────────────────────────────────────────────────────
  {
    id: "cr_favorite_food",
    category: "creative",
    title_vi: "Mô tả món ăn yêu thích",
    title_en: "Describing a favorite food",
    scenario_vi:
      "Viết một đoạn văn mô tả một món ăn Việt Nam mà bạn yêu thích — đủ chi tiết để người chưa từng ăn cảm nhận được. Mùi, vị, kết cấu, ký ức gắn với món đó.",
    scenario_en:
      "Write a paragraph about a Vietnamese dish you love — vivid enough that someone who's never had it can almost taste it. Smell, taste, texture, memory.",
    target_words_min: 100,
    target_words_max: 200,
    difficulty: "medium",
  },
  {
    id: "cr_hometown",
    category: "creative",
    title_vi: "Viết về quê hương",
    title_en: "Writing about your hometown",
    scenario_vi:
      "Một bài viết blog ngắn về quê bạn — không phải quảng cáo du lịch, mà những chi tiết nhỏ chỉ người ở đó mới biết.",
    scenario_en:
      "A short blog post about your hometown — not a tourism ad, but the small details only locals know.",
    target_words_min: 120,
    target_words_max: 220,
    difficulty: "medium",
  },
  {
    id: "cr_explain_tradition",
    category: "creative",
    title_vi: "Giải thích phong tục Việt cho bạn Mỹ",
    title_en: "Explaining a Vietnamese tradition to an American friend",
    scenario_vi:
      "Bạn người Mỹ hỏi về tục mừng tuổi đầu năm. Viết tin nhắn giải thích — không học thuật, dùng so sánh dễ hiểu (ví dụ: giống Christmas bonus dạng nhỏ).",
    scenario_en:
      "Your American friend asks about lì xì (lucky money). Write a reply explaining — not academic, use a relatable comparison (e.g. like a small Christmas bonus).",
    target_words_min: 80,
    target_words_max: 160,
    difficulty: "medium",
  },
  {
    id: "cr_recommend_movie",
    category: "creative",
    title_vi: "Đề xuất một bộ phim",
    title_en: "Recommending a movie",
    scenario_vi:
      "Bạn vừa xem một bộ phim hay. Viết review ngắn cho group chat — không spoiler, nói rõ ai sẽ thích nó, ai sẽ không.",
    scenario_en:
      "You just watched a movie you loved. Write a short review for a group chat — no spoilers, who'll like it and who won't.",
    target_words_min: 60,
    target_words_max: 130,
    difficulty: "easy",
  },
  {
    id: "cr_share_memory",
    category: "creative",
    title_vi: "Chia sẻ một kỷ niệm",
    title_en: "Sharing a memory",
    scenario_vi:
      "Viết một đoạn ngắn về một ngày đáng nhớ trong đời bạn — không phải kỷ niệm 'lớn' (đám cưới, tốt nghiệp), mà một ngày bình thường nhưng để lại ấn tượng.",
    scenario_en:
      "Write a short piece about a memorable day in your life — not a 'big' day (wedding, graduation), but an ordinary day that stuck with you.",
    target_words_min: 120,
    target_words_max: 220,
    difficulty: "hard",
  },
  {
    id: "cr_future_goal",
    category: "creative",
    title_vi: "Viết về mục tiêu 5 năm tới",
    title_en: "Writing about a 5-year goal",
    scenario_vi:
      "Bạn đang xin học bổng và phải viết essay 'Mục tiêu 5 năm tới của bạn là gì?'. Viết draft đầu tiên — chân thật, có kế hoạch cụ thể, không sáo rỗng.",
    scenario_en:
      "You're applying for a scholarship that asks 'What's your 5-year goal?'. Write a first draft — honest, with concrete plans, not vague.",
    target_words_min: 150,
    target_words_max: 250,
    difficulty: "hard",
  },
];

// ── Lookup helpers ───────────────────────────────────────────────────

const PROMPTS_BY_ID = new Map<string, WritingPrompt>(
  WRITING_PROMPTS.map((p) => [p.id, p]),
);

export function getWritingPromptById(id: string): WritingPrompt | null {
  return PROMPTS_BY_ID.get(id) ?? null;
}

export function listPromptsByCategory(
  category: WritingPrompt["category"],
): WritingPrompt[] {
  return WRITING_PROMPTS.filter((p) => p.category === category);
}
