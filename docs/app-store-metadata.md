# MercyBlade App Store Metadata

Prepared: 2026-06-09

## Core Listing

- App name: MercyBlade
- Short description: AI English tutor with pronunciation practice for Vietnamese learners.
- Category: Education
- Required permissions:
  - Microphone: pronunciation practice and speech scoring.
  - Internet: AI tutor, account sync, Supabase authentication/storage, subscriptions, and cloud pronunciation scoring.

Length checks:
- Short description: 69 characters, under the 80-character submission limit.
- English full description: 1,655 characters, under the 4,000-character limit.
- Vietnamese full description: 1,982 characters, under the 4,000-character limit.

## Full Description - English

MercyBlade is an English learning app built for Vietnamese learners who want practical speaking, pronunciation, grammar, IELTS/TOEIC/VSTEP preparation, and everyday communication support in one place.

Practice pronunciation with microphone-based speaking drills, phoneme-level feedback, and progress tracking designed around the pronunciation patterns Vietnamese speakers often struggle with. Learn with guided lessons, vocabulary review, grammar support, notebook tools, streaks, and progress insights that help you see what to practice next.

Teacher Mercy, the in-app AI tutor, helps you ask questions, review mistakes, practice conversation, and get learning support when you are stuck. The app includes lessons and practice paths for general English, exam preparation, workplace English, kids learning, and confidence-building communication.

MercyBlade is built for serious self-study: short daily practice, clear feedback, and a calm learning flow that helps you keep moving without guessing what to do next.

Key features:
- Pronunciation practice with microphone-based scoring
- AI tutor support for grammar, writing, speaking, and study questions
- English lessons designed for Vietnamese learners
- IELTS, TOEIC, VSTEP, and speaking practice surfaces
- Vocabulary, notebook, streak, and progress tools
- Kids and family learning areas
- Premium lesson rooms and guided practice paths

Privacy matters. You can delete your account in the app from Account -> Delete my account. Microphone access is used only when you choose pronunciation practice, and audio is processed for scoring rather than stored as a long-term recording by MercyBlade.

## Full Description - Vietnamese

MercyBlade là ứng dụng học tiếng Anh được xây dựng cho người Việt muốn luyện nói, phát âm, ngữ pháp, IELTS/TOEIC/VSTEP và giao tiếp hằng ngày trong một nơi.

Bạn có thể luyện phát âm bằng micro, nhận phản hồi theo từng âm vị, và theo dõi tiến bộ theo thời gian. Các bài luyện được thiết kế quanh những lỗi phát âm và cách dùng tiếng Anh mà người Việt thường gặp. MercyBlade cũng có bài học, từ vựng, ngữ pháp, sổ tay học tập, streak, và gợi ý tiến bộ để bạn biết mình nên luyện gì tiếp theo.

Teacher Mercy, gia sư AI trong ứng dụng, giúp bạn hỏi đáp, sửa lỗi, luyện hội thoại, ôn ngữ pháp, luyện viết và nhận hỗ trợ khi bị kẹt. Ứng dụng có các lộ trình cho tiếng Anh tổng quát, luyện thi, tiếng Anh công việc, chế độ trẻ em, và kỹ năng giao tiếp tự tin hơn.

MercyBlade phù hợp với việc tự học nghiêm túc: mỗi ngày luyện một chút, nhận phản hồi rõ ràng, và đi tiếp theo một dòng học tập bình tĩnh thay vì phải đoán mình nên học gì.

Tính năng chính:
- Luyện phát âm bằng micro và chấm điểm
- Gia sư AI hỗ trợ ngữ pháp, viết, nói và câu hỏi học tập
- Bài học tiếng Anh thiết kế cho người Việt
- Luyện IELTS, TOEIC, VSTEP và kỹ năng nói
- Từ vựng, sổ tay, streak và theo dõi tiến bộ
- Khu vực học cho trẻ em và gia đình
- Phòng bài học premium và lộ trình luyện tập có hướng dẫn

Quyền riêng tư được ưu tiên. Bạn có thể xóa tài khoản ngay trong ứng dụng tại Account -> Delete my account. Quyền truy cập micro chỉ được dùng khi bạn chủ động luyện phát âm; âm thanh được xử lý để chấm điểm, không được MercyBlade lưu thành bản ghi dài hạn.

## ASO Keywords

English learning, learn English, Vietnamese learners, English for Vietnamese, pronunciation, speaking practice, AI tutor, IELTS, TOEIC, VSTEP, grammar, vocabulary, phoneme, accent training, English conversation, study English, ESL, EFL, language learning, kids English, workplace English.

App Store keyword string candidate:

`ielts,toeic,vstep,english,vietnamese,pronunciation,grammar,speaking,ai tutor,learn english,esl`

## Age Rating Justification

Recommended store rating: 13+ target audience, Education category.

Justification:
- No gambling, sexual content, drugs, alcohol, tobacco, or graphic violence.
- AI tutor and community/support surfaces make the app unsuitable to market as directed to children under 13.
- Kids learning content exists, but the app should not be submitted to Apple's Kids category or Google Play Designed for Families until analytics/tracking carve-outs and child-directed SDK review are complete.
- User-generated/community features should be answered conservatively during store questionnaires if public posting or chat surfaces are included in the submitted build.

## Account Deletion Audit

Status: implemented.

Evidence:
- In-app UI exists at `src/pages/AccountPage.tsx` under Account -> Legal & account -> Delete my account.
- Flow requires typing `DELETE`, then calls `runDeleteAccountFlow`.
- `src/pages/account/deleteAccountFlow.ts` invokes the Supabase Edge Function `delete-account` with the authenticated bearer token.
- `supabase/functions/delete-account/index.ts` deletes personal-data rows from the manifest, anonymizes retained audit/financial/security rows, deletes `profiles`, then deletes the Supabase Auth user.
- MFA-protected accounts require AAL2 before irreversible deletion.

Apple 5.1.1(v): passes the in-app deletion requirement. This is not an "email us" only flow.

Backend note for Lane B: no new Supabase RPC is required for launch because deletion is already implemented as a reviewed Supabase Edge Function with service-role access. If Lane B wants SQL-RPC parity later, the RPC should only enqueue or authorize deletion; the service-role `auth.users` deletion still has to run server-side, because client-side SQL RPCs cannot safely delete Supabase Auth users.

Optional future RPC spec, not launch-blocking:
- Name: `request_account_deletion()`
- Auth: authenticated users only; `auth.uid()` must equal the deletion target.
- Behavior: insert an immutable deletion-request row with `user_id`, `requested_at`, request source, and current AAL; do not delete data directly.
- Server handoff: the existing `delete-account` Edge Function or a service-role worker consumes the request, applies the manifest, anonymizes retained audit/billing/security records, deletes `profiles`, then deletes `auth.users`.
- Security: require AAL2 when the user has a verified MFA factor; fail closed if MFA factor lookup is unavailable.

## Privacy / Legal URL Audit

Status: implemented with copy update on 2026-06-09.

Routes:
- Privacy Policy: `https://mercyblade.com/privacy`
- Privacy alias: `https://mercyblade.com/legal/privacy`
- Terms: `https://mercyblade.com/terms`
- Terms alias: `https://mercyblade.com/legal/terms`
- Support: `https://mercyblade.com/support`

Privacy policy now explicitly mentions:
- Data collected: email/account data, pronunciation audio recordings, learning progress, usage/diagnostics, support messages, billing/subscription status.
- Third parties: Supabase, Microsoft Azure Speech, OpenAI/AI providers, Sentry.
- Data deletion rights: Account -> Delete my account, with retained records anonymized where legally required.
- Contact: `admin@mercyblade.com`.

Known residual risk: the source file already notes Vietnamese legal translation drift. For store launch, the English policy contains the required disclosures; a professional Vietnamese legal translation remains recommended.

Terms status: implemented. `https://mercyblade.com/terms` and `https://mercyblade.com/legal/terms` exist and include account, subscription, refund, acceptable-use, deletion, termination, disclaimer, and contact sections.

## Review Guidelines Check

Apple 4.2 - Minimum Functionality: low risk. The app has substantive lessons, pronunciation practice, AI tutor flows, progress tracking, account/billing surfaces, and legal/support pages. Risk to verify before submission: screenshots and reviewer demo account must expose enough unlocked content for review.

Apple 5.1.1 - Data Collection and Consent: medium-low risk after this pass. Account deletion is in-app, privacy policy covers collected data and providers, microphone use is consent-gated, and tracking consent controls exist. Residual risk: Kids mode currently uses the same analytics treatment as adults per Privacy section 7, so do not submit as Kids Category or Play Designed for Families.

Google Permissions Policy: low risk if the Android manifest requests only permissions used by shipped features. Microphone is justified by pronunciation practice; internet is justified by AI tutor, Supabase sync, subscriptions, and cloud scoring. Avoid requesting background/location/contact/SMS permissions unless a shipped feature requires them.
