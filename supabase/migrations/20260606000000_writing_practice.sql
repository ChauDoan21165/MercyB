-- Real-life writing practice (PR feat/writing-practice).
--
-- Two tables:
--   1. writing_prompts — the seed library of practical writing scenarios
--      (workplace email, customer complaints, dating profile, etc.).
--      Public-read; admin-managed. Seed rows live in the application
--      layer (`src/data/writing-prompts/prompts.ts`) and are upserted
--      from there at deploy time so editors don't need SQL access.
--   2. user_writing_submissions — one row per submitted attempt.
--      Owner-only RLS. Stores the raw user text, the AI feedback as
--      JSONB, an integer score, and `time_spent_seconds` so we can spot
--      surface-level patterns (e.g., users rage-submitting <30s drafts).
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.user_writing_submissions;
--   DROP TABLE IF EXISTS public.writing_prompts;
--   DROP TYPE  IF EXISTS public.writing_prompt_difficulty;
--   DROP TYPE  IF EXISTS public.writing_prompt_category;

-- ── Enums ─────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'writing_prompt_difficulty') then
    create type public.writing_prompt_difficulty as enum ('easy', 'medium', 'hard');
  end if;
  if not exists (select 1 from pg_type where typname = 'writing_prompt_category') then
    create type public.writing_prompt_category as enum (
      'workplace_email',
      'customer_service',
      'social_media',
      'personal_message',
      'dating_profile',
      'job_application',
      'daily_life',
      'creative'
    );
  end if;
end$$;

-- ── writing_prompts ──────────────────────────────────────────────────
create table if not exists public.writing_prompts (
  id text primary key,
  category public.writing_prompt_category not null,
  title_vi text not null check (char_length(title_vi) between 1 and 200),
  title_en text not null check (char_length(title_en) between 1 and 200),
  scenario_vi text not null check (char_length(scenario_vi) between 10 and 2000),
  scenario_en text not null check (char_length(scenario_en) between 10 and 2000),
  target_words_min int not null check (target_words_min between 10 and 1000),
  target_words_max int not null check (target_words_max between 10 and 2000),
  difficulty public.writing_prompt_difficulty not null default 'medium',
  created_at timestamptz not null default now(),
  constraint writing_prompts_word_range_chk check (target_words_max >= target_words_min)
);

comment on table public.writing_prompts is
  'Real-life writing practice library. Bilingual (VN primary). Seeded from src/data/writing-prompts/prompts.ts.';

create index if not exists writing_prompts_category_idx
  on public.writing_prompts (category, difficulty);

-- ── user_writing_submissions ─────────────────────────────────────────
create table if not exists public.user_writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id text not null references public.writing_prompts(id) on delete cascade,
  submission_text text not null check (char_length(submission_text) between 1 and 8000),
  ai_feedback jsonb,
  score int check (score is null or score between 0 and 100),
  submitted_at timestamptz not null default now(),
  time_spent_seconds int not null default 0 check (time_spent_seconds >= 0)
);

comment on table public.user_writing_submissions is
  'One row per writing-practice attempt. ai_feedback is the full structured payload from writing-feedback edge fn.';

create index if not exists user_writing_submissions_user_idx
  on public.user_writing_submissions (user_id, submitted_at desc);

create index if not exists user_writing_submissions_user_prompt_idx
  on public.user_writing_submissions (user_id, prompt_id, submitted_at desc);

-- ── RLS ──────────────────────────────────────────────────────────────
alter table public.writing_prompts enable row level security;
alter table public.user_writing_submissions enable row level security;

-- writing_prompts: public read, admin write. Mirrors the convention used
-- across other content tables (e.g. user_interview_prompts published rows).
drop policy if exists "writing_prompts_public_read" on public.writing_prompts;
create policy "writing_prompts_public_read"
  on public.writing_prompts
  for select
  using (true);

drop policy if exists "writing_prompts_admin_all" on public.writing_prompts;
create policy "writing_prompts_admin_all"
  on public.writing_prompts
  for all
  using (public.get_admin_level() >= 9)
  with check (public.get_admin_level() >= 9);

-- user_writing_submissions: owner-only. The authenticated user can
-- INSERT / SELECT / DELETE their own rows. UPDATE deliberately omitted —
-- once a submission is scored we keep it immutable so retake history
-- shows real progression instead of edit-your-grade games.
drop policy if exists "user_writing_submissions_select_own" on public.user_writing_submissions;
create policy "user_writing_submissions_select_own"
  on public.user_writing_submissions
  for select
  using (auth.uid() = user_id);

drop policy if exists "user_writing_submissions_insert_own" on public.user_writing_submissions;
create policy "user_writing_submissions_insert_own"
  on public.user_writing_submissions
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_writing_submissions_delete_own" on public.user_writing_submissions;
create policy "user_writing_submissions_delete_own"
  on public.user_writing_submissions
  for delete
  using (auth.uid() = user_id);

drop policy if exists "user_writing_submissions_admin_all" on public.user_writing_submissions;
create policy "user_writing_submissions_admin_all"
  on public.user_writing_submissions
  for all
  using (public.get_admin_level() >= 9)
  with check (public.get_admin_level() >= 9);

-- ── Grants ──────────────────────────────────────────────────────────
grant select on public.writing_prompts to anon, authenticated;
grant select, insert, delete on public.user_writing_submissions to authenticated;

-- ── Seed: 40 prompts ─────────────────────────────────────────────
-- Generated from src/data/writing-prompts/prompts.ts. ON CONFLICT DO NOTHING
-- so re-running this migration after editing the static dataset is safe;
-- updates to existing rows go through admin SQL or a follow-up migration.

insert into public.writing_prompts
  (id, category, title_vi, title_en, scenario_vi, scenario_en, target_words_min, target_words_max, difficulty)
values
  ('we_sick_leave', 'workplace_email', 'Xin nghỉ ốm', 'Asking for sick leave', 'Bạn bị sốt cao từ tối qua, sáng nay không thể đi làm. Viết email cho sếp xin nghỉ ốm 1 ngày, hứa sẽ trả lời tin nhắn quan trọng từ điện thoại nếu cần.', 'You came down with a fever last night and can''t make it in today. Write a short email to your manager requesting one day of sick leave, promising to answer urgent messages from your phone if needed.', 60, 120, 'easy'),
  ('we_request_raise', 'workplace_email', 'Đề xuất tăng lương', 'Requesting a raise', 'Bạn đã làm tốt công việc trong 14 tháng qua và đảm nhận thêm trách nhiệm sau khi đồng nghiệp nghỉ. Viết email cho sếp xin một cuộc họp để bàn về việc tăng lương. Lịch sự, có dẫn chứng cụ thể, không nêu con số trong email.', 'You''ve been performing well for 14 months and took on extra responsibilities after a teammate left. Write an email to your manager requesting a meeting to discuss a raise. Polite, with concrete evidence, no specific number mentioned in the email itself.', 100, 180, 'hard'),
  ('we_decline_meeting', 'workplace_email', 'Từ chối tham gia họp', 'Declining a meeting', 'Bạn được mời họp 1 tiếng vào lúc bạn có deadline khác. Viết email từ chối lịch sự, đề xuất gửi note hoặc họp lại vào hôm sau.', 'You''ve been invited to a 1-hour meeting that conflicts with another deadline. Write a polite decline, offering to send notes or reschedule for the next day.', 50, 100, 'easy'),
  ('we_report_issue', 'workplace_email', 'Báo cáo sự cố hệ thống', 'Reporting a system issue', 'Hệ thống thanh toán nội bộ bị lỗi từ 9 giờ sáng — đơn hàng không xử lý được. Viết email cho team kỹ thuật mô tả vấn đề, thời gian bắt đầu, và mức độ ảnh hưởng đến khách hàng.', 'The internal payment system has been down since 9am and orders aren''t processing. Write an email to the tech team describing the issue, when it started, and the customer impact.', 80, 150, 'medium'),
  ('we_thank_colleague', 'workplace_email', 'Cảm ơn đồng nghiệp', 'Thanking a colleague', 'Một đồng nghiệp đã ở lại muộn giúp bạn hoàn thành dự án quan trọng. Viết email cảm ơn, cụ thể về việc họ đã làm và CC sếp của họ để công việc của họ được ghi nhận.', 'A colleague stayed late to help you finish an important project. Write a thank-you email — specific about what they did, and CC their manager so their effort is recognized.', 60, 120, 'easy'),
  ('cs_complaint', 'customer_service', 'Khiếu nại sản phẩm hỏng', 'Product complaint', 'Bạn đặt một chiếc điện thoại trên Amazon, khi nhận thì màn hình bị nứt. Viết email khiếu nại, mô tả vấn đề, kèm yêu cầu cụ thể (thay mới hoặc hoàn tiền).', 'You ordered a phone on Amazon and it arrived with a cracked screen. Write a complaint email describing the issue and stating exactly what you want (replacement or refund).', 80, 150, 'medium'),
  ('cs_refund_request', 'customer_service', 'Yêu cầu hoàn tiền', 'Refund request', 'Bạn đăng ký gói tập gym 1 năm nhưng phải chuyển nhà sau 2 tháng. Viết email yêu cầu hoàn lại phần chưa sử dụng, đính kèm lý do hợp lý.', 'You signed up for a one-year gym membership but have to move after two months. Write an email requesting a refund for the unused portion, with a reasonable explanation.', 80, 140, 'medium'),
  ('cs_review', 'customer_service', 'Viết review nhà hàng', 'Writing a restaurant review', 'Bạn vừa ăn tối ở một nhà hàng Việt Nam ở Mỹ. Đồ ăn ngon nhưng phục vụ chậm. Viết review 4/5 sao trên Yelp — trung thực, công bằng.', 'You just had dinner at a Vietnamese restaurant in the US. Food was great but service was slow. Write a 4/5-star Yelp review — honest and fair.', 80, 160, 'medium'),
  ('cs_feedback_form', 'customer_service', 'Điền form góp ý', 'Filling a feedback form', 'Một công ty bảo hiểm gửi form khảo sát sau khi xử lý hồ sơ của bạn. Viết phần ''comments'' — nói rõ điểm tốt và điểm cần cải thiện.', 'An insurance company sent you a survey after processing your claim. Fill in the ''comments'' field — clear on what was good and what needs improving.', 60, 120, 'easy'),
  ('cs_support_ticket', 'customer_service', 'Mở ticket hỗ trợ kỹ thuật', 'Opening a support ticket', 'Phần mềm kế toán của công ty không cho phép xuất báo cáo PDF từ hôm qua. Viết support ticket — mô tả các bước đã thử, lỗi nhận được, và mức độ ảnh hưởng.', 'Your company''s accounting software has been failing to export PDF reports since yesterday. Open a support ticket — describe the steps you tried, the error message, and the business impact.', 80, 150, 'medium'),
  ('sm_self_intro', 'social_media', 'Giới thiệu bản thân trên LinkedIn', 'Introducing yourself on LinkedIn', 'Bạn vừa chuyển sang Mỹ và đang tìm việc trong ngành software. Viết phần ''About'' trên LinkedIn — kể về kỹ năng, kinh nghiệm, và mục tiêu nghề nghiệp.', 'You just moved to the US and are job-hunting in software. Write a LinkedIn ''About'' section — your skills, experience, and what you''re looking for next.', 100, 180, 'medium'),
  ('sm_weekend_post', 'social_media', 'Post cuối tuần trên Facebook', 'Weekend Facebook post', 'Bạn vừa đi hiking lần đầu ở một công viên gần nhà. Viết post Facebook chia sẻ trải nghiệm — ngắn, tự nhiên, có chỗ để bạn bè comment.', 'You went hiking for the first time at a park near home. Write a Facebook post about it — short, natural, leaves room for friends to chime in.', 50, 110, 'easy'),
  ('sm_recommendation', 'social_media', 'Giới thiệu sản phẩm yêu thích', 'Recommending a favorite product', 'Một nồi chiên không dầu đã thay đổi việc nấu ăn của bạn. Viết post Instagram giới thiệu — không phải quảng cáo, kể trải nghiệm thật.', 'An air fryer has changed how you cook. Write an Instagram post recommending it — not an ad, just a real experience.', 60, 120, 'easy'),
  ('sm_holiday_greeting', 'social_media', 'Lời chúc Tết tới bạn bè', 'Lunar New Year greeting', 'Sắp Tết. Viết lời chúc trên Facebook gửi tới bạn bè — bao gồm cả bạn bè người Mỹ chưa biết Tết là gì. Một câu giải thích ngắn về Tết, lời chúc cụ thể.', 'Lunar New Year is coming up. Write a Facebook greeting for friends — including American friends who don''t know what Tết is. One short line explaining the holiday, then your wishes.', 70, 140, 'medium'),
  ('sm_opinion_post', 'social_media', 'Chia sẻ quan điểm về một tin tức', 'Sharing an opinion on a news story', 'Một tin tức về AI thay thế việc làm vừa lan truyền. Viết post LinkedIn chia sẻ quan điểm của bạn — có lý lẽ, không gây tranh cãi không cần thiết.', 'A news story about AI replacing jobs is going viral. Write a LinkedIn post with your perspective — reasoned, not unnecessarily inflammatory.', 100, 180, 'hard'),
  ('pm_apology', 'personal_message', 'Xin lỗi bạn thân', 'Apology to a close friend', 'Bạn quên sinh nhật của bạn thân. Đó là tuần thứ ba bạn ''quên'' một việc quan trọng. Viết tin nhắn xin lỗi — chân thành, không bào chữa.', 'You forgot your best friend''s birthday. It''s the third week in a row you''ve forgotten something important. Write an apology — sincere, no excuses.', 60, 120, 'medium'),
  ('pm_congrats', 'personal_message', 'Chúc mừng anh chị em đỗ đại học', 'Congratulating a sibling on college admission', 'Em trai vừa được nhận vào đại học UC Berkeley. Viết tin nhắn chúc mừng — chân thành, kể lại bạn thấy nỗ lực của em ra sao.', 'Your younger brother just got into UC Berkeley. Write a congratulations message — sincere, mention the effort you saw him put in.', 50, 110, 'easy'),
  ('pm_ask_favor', 'personal_message', 'Nhờ bạn chở ra sân bay', 'Asking a friend for an airport ride', 'Bạn cần ai đó chở ra sân bay 4 giờ sáng thứ Bảy. Nhắn cho một người bạn — không gây áp lực, có phương án dự phòng.', 'You need someone to drive you to the airport at 4am on Saturday. Message a friend — no pressure, with a fallback plan if they can''t.', 50, 100, 'easy'),
  ('pm_decline_invitation', 'personal_message', 'Từ chối lời mời tiệc', 'Declining a party invitation', 'Bạn được mời tới tiệc cưới của một đồng nghiệp không thân lắm vào cuối tuần bạn đã có kế hoạch riêng. Viết tin nhắn từ chối — lịch sự, không nói dối.', 'You''ve been invited to a wedding of a colleague you''re not close to, on a weekend you already have plans. Write a polite decline — no lies.', 50, 100, 'medium'),
  ('pm_breakup', 'personal_message', 'Chia tay qua tin nhắn (mối quan hệ ngắn)', 'Ending a short relationship via text', 'Sau 6 tuần hẹn hò, bạn nhận ra hai người không hợp. Viết tin nhắn chấm dứt mối quan hệ — tử tế, không đổ lỗi, không hy vọng giả.', 'After six weeks of dating you''ve realized you''re not a good match. Write a message ending things — kind, not blaming, no false hope.', 60, 130, 'hard'),
  ('dp_bio', 'dating_profile', 'Viết bio Tinder', 'Tinder bio', 'Bạn 28 tuổi, làm engineer, thích leo núi, nấu ăn, và phim Hàn. Viết bio Tinder 4-5 dòng — vui, có cá tính, không sáo rỗng.', 'You''re 28, work as an engineer, into hiking, cooking, and Korean movies. Write a 4-5 line Tinder bio — fun, has personality, no clichés.', 40, 80, 'medium'),
  ('dp_opener', 'dating_profile', 'Tin nhắn mở đầu', 'Opener message', 'Bạn match với một người trên Hinge. Bio của họ có nhắc tới việc thích đi du lịch và làm gốm. Viết tin nhắn mở đầu — không ''hi'', cá nhân hóa, mở câu hỏi.', 'You matched with someone on Hinge. Their bio mentions traveling and pottery. Write an opener — no plain ''hi'', personalized, with an open question.', 30, 70, 'medium'),
  ('dp_response_to_match', 'dating_profile', 'Trả lời match đầu tiên', 'Reply to a first match message', 'Match của bạn vừa nhắn ''Bạn cuối tuần làm gì vui không?''. Viết câu trả lời — kể trải nghiệm cụ thể, hỏi lại họ, để cuộc trò chuyện kéo dài.', 'Your match just messaged ''What did you do this weekend?''. Write a reply — give a specific story, return the question, keep the chat alive.', 40, 90, 'easy'),
  ('ja_cover_letter_intro', 'job_application', 'Mở đầu cover letter', 'Cover letter opening', 'Bạn ứng tuyển vị trí Software Engineer tại Stripe. Viết đoạn mở đầu cover letter — 2-3 câu, hook người đọc, không sáo rỗng kiểu ''I am writing to apply for...''.', 'You''re applying to a Software Engineer role at Stripe. Write the cover-letter opening — 2-3 sentences, hook the reader, no clichéd ''I am writing to apply for...''.', 50, 90, 'hard'),
  ('ja_why_company', 'job_application', 'Tại sao chọn công ty này', 'Why this company', 'Trong cover letter cho một startup AI, viết đoạn ''Why this company'' — cụ thể, có dẫn chứng (sản phẩm, blog, người sáng lập), không generic.', 'In a cover letter for an AI startup, write the ''Why this company'' paragraph — specific, citing the product / blog / founder, not generic.', 80, 150, 'hard'),
  ('ja_why_role', 'job_application', 'Tại sao chọn vị trí này', 'Why this role', 'Bạn từ developer chuyển sang vị trí product manager. Viết đoạn ''Why this role'' giải thích chuyển hướng — có lý do mạnh, có ví dụ.', 'You''re transitioning from developer to product manager. Write the ''Why this role'' paragraph — strong reasoning, with an example.', 80, 150, 'hard'),
  ('ja_salary_expectation', 'job_application', 'Trả lời câu hỏi mức lương mong muốn', 'Answering a salary expectation question', 'Recruiter hỏi mức lương mong muốn qua email. Viết câu trả lời — khoảng lương có cơ sở, để chỗ thương lượng, không cam kết quá sớm.', 'A recruiter asks your salary expectations by email. Write a reply — a researched range, leaves room to negotiate, doesn''t commit too early.', 60, 120, 'hard'),
  ('ja_followup_after_interview', 'job_application', 'Email cảm ơn sau phỏng vấn', 'Follow-up email after an interview', 'Bạn vừa phỏng vấn vòng cuối ở một công ty bạn rất thích. Viết email cảm ơn — nhắc lại một điểm cụ thể từ buổi phỏng vấn, ngắn gọn.', 'You just had your final interview at a company you really want. Write a thank-you email — reference one specific moment from the interview, keep it short.', 60, 130, 'medium'),
  ('dl_apartment_lease', 'daily_life', 'Hỏi điều khoản hợp đồng thuê nhà', 'Apartment lease question', 'Bạn xem xét ký hợp đồng thuê 1 năm. Viết email cho landlord hỏi rõ về cọc, phụ phí thú cưng, và điều khoản chấm dứt sớm.', 'You''re considering a 1-year lease. Email the landlord with clear questions about the deposit, pet fees, and early-termination terms.', 80, 150, 'medium'),
  ('dl_doctor_symptoms', 'daily_life', 'Mô tả triệu chứng cho bác sĩ qua portal', 'Describing symptoms via patient portal', 'Bạn có triệu chứng đau lưng kéo dài 3 tuần. Viết tin nhắn qua patient portal cho bác sĩ — mô tả thời gian, vị trí, mức độ, hoạt động làm tệ hơn.', 'You''ve had lower-back pain for three weeks. Send a message via the patient portal — duration, location, severity, what makes it worse.', 80, 150, 'medium'),
  ('dl_school_enrollment', 'daily_life', 'Email đăng ký nhập học cho con', 'School enrollment email', 'Bạn vừa chuyển nhà sang một học khu mới. Viết email cho văn phòng trường tiểu học hỏi quy trình đăng ký, giấy tờ cần chuẩn bị, và lịch hẹn.', 'You just moved to a new school district. Email the elementary school office asking about the enrollment process, required documents, and how to schedule an appointment.', 70, 140, 'medium'),
  ('dl_landlord_complaint', 'daily_life', 'Khiếu nại với landlord về vấn đề bảo trì', 'Maintenance complaint to landlord', 'Máy nước nóng đã bị hỏng 5 ngày, landlord chưa phản hồi. Viết email lần thứ hai — chuyên nghiệp, nhắc deadline cũ, nói rõ bước tiếp theo nếu vẫn không sửa.', 'Your water heater has been broken for 5 days and the landlord hasn''t responded. Write a follow-up email — professional, reference the prior request, state the next step if still unresolved.', 100, 180, 'hard'),
  ('dl_neighbor_note', 'daily_life', 'Note để lại cho hàng xóm', 'Note for a neighbor', 'Bạn sẽ tổ chức tiệc nhỏ tối thứ Bảy. Viết note ngắn dán ở cửa hàng xóm bên cạnh — báo trước, để số điện thoại nếu họ thấy ồn.', 'You''re hosting a small party Saturday night. Write a short note for your neighbor''s door — heads-up, with your phone number in case it gets too loud.', 40, 90, 'easy'),
  ('dl_lost_item_report', 'daily_life', 'Báo cáo mất đồ trên xe Uber', 'Lost item report (Uber)', 'Bạn để quên ba lô có laptop trên Uber. Viết tin nhắn qua app cho tài xế — mô tả ba lô, thời gian, đề xuất hẹn gặp để nhận lại.', 'You left your backpack with a laptop in an Uber. Message the driver through the app — describe the bag, when, propose a place to meet up.', 60, 120, 'medium'),
  ('cr_favorite_food', 'creative', 'Mô tả món ăn yêu thích', 'Describing a favorite food', 'Viết một đoạn văn mô tả một món ăn Việt Nam mà bạn yêu thích — đủ chi tiết để người chưa từng ăn cảm nhận được. Mùi, vị, kết cấu, ký ức gắn với món đó.', 'Write a paragraph about a Vietnamese dish you love — vivid enough that someone who''s never had it can almost taste it. Smell, taste, texture, memory.', 100, 200, 'medium'),
  ('cr_hometown', 'creative', 'Viết về quê hương', 'Writing about your hometown', 'Một bài viết blog ngắn về quê bạn — không phải quảng cáo du lịch, mà những chi tiết nhỏ chỉ người ở đó mới biết.', 'A short blog post about your hometown — not a tourism ad, but the small details only locals know.', 120, 220, 'medium'),
  ('cr_explain_tradition', 'creative', 'Giải thích phong tục Việt cho bạn Mỹ', 'Explaining a Vietnamese tradition to an American friend', 'Bạn người Mỹ hỏi về tục mừng tuổi đầu năm. Viết tin nhắn giải thích — không học thuật, dùng so sánh dễ hiểu (ví dụ: giống Christmas bonus dạng nhỏ).', 'Your American friend asks about lì xì (lucky money). Write a reply explaining — not academic, use a relatable comparison (e.g. like a small Christmas bonus).', 80, 160, 'medium'),
  ('cr_recommend_movie', 'creative', 'Đề xuất một bộ phim', 'Recommending a movie', 'Bạn vừa xem một bộ phim hay. Viết review ngắn cho group chat — không spoiler, nói rõ ai sẽ thích nó, ai sẽ không.', 'You just watched a movie you loved. Write a short review for a group chat — no spoilers, who''ll like it and who won''t.', 60, 130, 'easy'),
  ('cr_share_memory', 'creative', 'Chia sẻ một kỷ niệm', 'Sharing a memory', 'Viết một đoạn ngắn về một ngày đáng nhớ trong đời bạn — không phải kỷ niệm ''lớn'' (đám cưới, tốt nghiệp), mà một ngày bình thường nhưng để lại ấn tượng.', 'Write a short piece about a memorable day in your life — not a ''big'' day (wedding, graduation), but an ordinary day that stuck with you.', 120, 220, 'hard'),
  ('cr_future_goal', 'creative', 'Viết về mục tiêu 5 năm tới', 'Writing about a 5-year goal', 'Bạn đang xin học bổng và phải viết essay ''Mục tiêu 5 năm tới của bạn là gì?''. Viết draft đầu tiên — chân thật, có kế hoạch cụ thể, không sáo rỗng.', 'You''re applying for a scholarship that asks ''What''s your 5-year goal?''. Write a first draft — honest, with concrete plans, not vague.', 150, 250, 'hard')
on conflict (id) do nothing;
