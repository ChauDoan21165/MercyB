import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { sendEmail } from "../../../src/lib/sendEmail.ts";

serve(async () => {
  const templateUrl = new URL(
    "../../../src/emails/access_vip_granted.txt",
    import.meta.url
  );

  await sendEmail({
    to: "your_email_here@example.com",
    templateUrl,
    variables: {
      vip_tier: "VIP3",
      effective_date: "2026-01-05",
    },
  });

  return new Response(
    JSON.stringify({ ok: true }),
    { headers: { "Content-Type": "application/json" } }
  );
});
