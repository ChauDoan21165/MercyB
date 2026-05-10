// supabase/functions/onboarding-welcome-email/index.ts
//
// Sends a VI-first bilingual welcome email to new users on signup.
//
// Trigger: POST { email: string } from frontend after signInWithOtp,
// or via Supabase Auth Hook (configured in Dashboard → Auth → Hooks
// after deploy — the hook calls this function with the user's email).
//
// Sender: MercyBlade <noreply@mercyblade.com> (verified Resend domain).
// Failure: email send failures are logged but never block the caller.

import { Resend } from "https://esm.sh/resend@2.0.0";
import { isEmailValid, renderWelcomeHtml } from "./template.ts";
export { isEmailValid, renderWelcomeHtml } from "./template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const FROM_ADDRESS = "MercyBlade <noreply@mercyblade.com>";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email || !isEmailValid(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), { status: 400, headers: corsHeaders });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.warn("[onboarding-welcome-email] RESEND_API_KEY missing");
      return new Response(JSON.stringify({ ok: false, error: "Not configured" }), { status: 200, headers: corsHeaders });
    }

    const resend = new Resend(apiKey);
    const { data, error: sendError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [email],
      subject: "Chào mừng bạn đến với MercyBlade! / Welcome to MercyBlade!",
      html: renderWelcomeHtml(),
    });

    if (sendError) {
      console.error("[onboarding-welcome-email] Resend failed:", sendError);
      return new Response(JSON.stringify({ ok: false, error: "Send failed" }), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true, id: data?.id }), { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[onboarding-welcome-email] unexpected:", err);
    return new Response(JSON.stringify({ ok: false, error: "Unexpected error" }), { status: 200, headers: corsHeaders });
  }
});