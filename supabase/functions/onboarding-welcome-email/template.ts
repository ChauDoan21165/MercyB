// supabase/functions/onboarding-welcome-email/template.ts
//
// Pure functions for the welcome email — testable without Deno runtime.
// index.ts imports these and wires the Resend API call.

const SITE_URL = "https://mercyblade.com";
const SUPPORT_EMAIL = "support@mercyblade.com";

export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function renderWelcomeHtml(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f4f4f5;padding:40px 20px;margin:0">
<div style="max-width:480px;margin:0 auto;background:white;border-radius:12px;padding:40px;box-shadow:0 4px 6px rgba(0,0,0,0.08)">
<h1 style="color:#b8541b;margin:0 0 8px;font-size:24px">Chào mừng bạn đến với MercyBlade!</h1>
<p style="color:#71717a;margin:0 0 24px;font-size:14px">Welcome to MercyBlade!</p>

<p style="color:#27272a;font-size:16px;line-height:1.6;margin:0 0 12px">Chào mừng bạn! Chúng tôi rất vui khi bạn tham gia MercyBlade.</p>
<p style="color:#52525b;font-size:14px;line-height:1.5;margin:0 0 20px">Welcome! We're glad you joined MercyBlade.</p>

<p style="color:#27272a;font-size:15px;line-height:1.6;margin:0 0 8px">Bạn có <strong>3 ngày dùng thử miễn phí</strong> để khám phá tất cả tính năng của ứng dụng.</p>
<p style="color:#52525b;font-size:13px;line-height:1.5;margin:0 0 24px">You have <strong>3 free days</strong> to explore everything MercyBlade has to offer.</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:24px 0">
<p style="color:#475569;font-size:14px;font-weight:700;margin:0 0 12px">Bạn có thể làm gì? / What can you do?</p>
<ul style="margin:0;padding:0 0 0 20px;color:#334155;font-size:14px;line-height:1.8">
<li>Học tiếng Anh theo trình độ từ A1 đến C2 / Learn English from A1 to C2</li>
<li>Luyện thi VSTEP với bài thi thử / Practice VSTEP with mock exams</li>
<li>Luyện phát âm với AI / Practice pronunciation with AI</li>
</ul>
</div>

<div style="text-align:center;margin:32px 0">
<a href="${SITE_URL}" style="display:inline-block;background:#b8541b;color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:16px">Bắt đầu học ngay / Start learning →</a>
</div>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:24px 0">
<p style="color:#475569;font-size:13px;line-height:1.6;margin:0">Nếu bạn có bất kỳ câu hỏi nào, chúng tôi luôn sẵn sàng giải đáp. Reply email này hoặc liên hệ qua: <a href="mailto:${SUPPORT_EMAIL}" style="color:#b8541b">${SUPPORT_EMAIL}</a>.</p>
<p style="color:#94a3b8;font-size:12px;line-height:1.5;margin:8px 0 0">If you have any questions, we're happy to help. Reply to this email or contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#b8541b">${SUPPORT_EMAIL}</a>.</p>
</div>

<hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0">
<p style="color:#a1a1aa;font-size:12px;text-align:center;margin:0;line-height:1.5">Bạn nhận được email này vì đã đăng ký MercyBlade.<br>You received this email because you signed up for MercyBlade.</p>
</div>
</body>
</html>`;
}