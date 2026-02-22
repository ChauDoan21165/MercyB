// supabase/functions/stripe/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  return new Response(JSON.stringify({ ok: true, fn: "stripe" }), {
    headers: { "Content-Type": "application/json" },
  });
});