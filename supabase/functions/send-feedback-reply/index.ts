import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackReplyRequest {
  userEmail: string;
  userName: string;
  originalMessage: string;
  replyMessage: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, originalMessage, replyMessage }: FeedbackReplyRequest = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Send email using Resend REST API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mercy Blade Admin <onboarding@resend.dev>",
        to: [userEmail],
        subject: "Reply to Your Feedback",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000;">Reply from Mercy Blade Admin</h2>
            
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #000; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 12px;">Your original message:</p>
              <p style="margin: 10px 0 0 0; color: #333;">${originalMessage}</p>
            </div>

            <div style="margin: 20px 0;">
              <p style="font-weight: bold; color: #000;">Admin Reply:</p>
              <p style="color: #333; line-height: 1.6;">${replyMessage}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
            
            <p style="color: #666; font-size: 12px;">
              Thank you for your feedback!<br/>
              The Mercy Blade Team
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const emailData = await emailResponse.json();

    console.log("Feedback reply sent successfully:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending feedback reply:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
