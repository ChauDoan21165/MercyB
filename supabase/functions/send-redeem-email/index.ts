import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Email configuration - easy to change later when moving to Zoho
const EMAIL_CONFIG = {
  from: "Mercy Blade <no-reply@mercyblade.link>",
  bcc: "cd12536@gmail.com",
  siteUrl: "https://mercyblade.link",
};

function send(data: object) {
  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
    status: 200,
  });
}

Deno.serve(async (req) => {
  console.log("[send-redeem-email] Request received:", req.method);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("[send-redeem-email] RESEND_API_KEY not configured");
      return send({ ok: false, error: "Email service not configured" });
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return send({ ok: false, error: "Invalid request format" });
    }

    const { email, tier } = body;

    if (!email || !tier) {
      return send({ ok: false, error: "Missing email or tier" });
    }

    console.log("[send-redeem-email] Sending email to:", email, "tier:", tier);

    const resend = new Resend(resendApiKey);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; margin: 0;">
  <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #7c3aed; margin: 0 0 8px 0; font-size: 28px;">🎁 Welcome to ${tier}!</h1>
      <p style="color: #71717a; margin: 0; font-size: 14px;">Mercy Blade VIP Access Activated</p>
    </div>
    
    <p style="color: #27272a; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      Hello <strong>${email}</strong>,
    </p>
    
    <p style="color: #27272a; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
      Congratulations! Your <strong>${tier}</strong> access has been successfully activated.
    </p>
    
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); border-radius: 8px; padding: 20px; margin: 24px 0; color: white;">
      <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.9;">Access Level</p>
      <p style="margin: 0 0 16px 0; font-size: 24px; font-weight: bold;">${tier}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.9;">Duration</p>
      <p style="margin: 0; font-size: 20px; font-weight: bold;">1 Year</p>
    </div>
    
    <p style="color: #27272a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      You now have access to all ${tier} rooms and features. Start exploring your new content today!
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${EMAIL_CONFIG.siteUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Start Exploring →
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
    
    <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin: 0;">
      Mercy Blade — Your journey to inner peace<br>
      <a href="${EMAIL_CONFIG.siteUrl}" style="color: #7c3aed;">mercyblade.link</a>
    </p>
  </div>
</body>
</html>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [email],
      bcc: [EMAIL_CONFIG.bcc],
      subject: `Welcome to Mercy Blade ${tier} Access!`,
      html: htmlContent,
    });

    if (emailError) {
      console.error("[send-redeem-email] Resend error:", emailError);
      return send({ ok: false, error: emailError.message || "Failed to send email" });
    }

    console.log("[send-redeem-email] Email sent successfully:", emailData?.id);
    return send({ ok: true, emailId: emailData?.id });

  } catch (err) {
    console.error("[send-redeem-email] Unexpected error:", err);
    return send({ ok: false, error: "Unexpected server error" });
  }
});
