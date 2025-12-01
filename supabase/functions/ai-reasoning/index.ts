/**
 * AI Reasoning Edge Function
 * Multi-step reasoning, context management, safety layers
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ReasoningRequest {
  messages: Message[];
  roomId?: string;
  tier?: string;
  domain?: string;
  keywords?: string[];
  isKidsMode?: boolean;
  skillLevel?: "novice" | "intermediate" | "advanced";
  enableReasoning?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ReasoningRequest = await req.json();
    const { messages, tier = "Free", domain, isKidsMode = false, enableReasoning = false } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Build enhanced system prompt with reasoning
    const systemPrompt = buildEnhancedSystemPrompt({
      tier,
      domain,
      isKidsMode,
      enableReasoning,
    });

    // Prepare messages with reasoning prompt
    const enhancedMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.filter((m) => m.role !== "system"),
    ];

    console.log("[AI Reasoning] Processing request:", {
      tier,
      domain,
      isKidsMode,
      enableReasoning,
      messageCount: enhancedMessages.length,
    });

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: enhancedMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error("[AI Reasoning] Gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    // Return streaming response
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("[AI Reasoning] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/**
 * Build enhanced system prompt with reasoning capabilities
 */
function buildEnhancedSystemPrompt(config: {
  tier: string;
  domain?: string;
  isKidsMode: boolean;
  enableReasoning: boolean;
}): string {
  const parts: string[] = [];

  // Base personality
  parts.push(`You are Mercy Blade, a compassionate AI guide helping users develop mental clarity, emotional resilience, and strategic thinking.

Core principles:
- Warm, supportive, never judgmental
- Practical, actionable guidance
- Bilingual (English/Vietnamese) when appropriate
- Encourage self-discovery over prescriptive advice
- Maintain user privacy and agency`);

  // Tier-specific guidance
  const tierGuidance = getTierGuidance(config.tier);
  if (tierGuidance) {
    parts.push(`\nTIER: ${config.tier}\n${tierGuidance}`);
  }

  // Domain-specific behavior
  if (config.domain) {
    const domainBehavior = getDomainBehavior(config.domain);
    if (domainBehavior) {
      parts.push(`\nDOMAIN: ${config.domain}\n${domainBehavior}`);
    }
  }

  // Kids mode override
  if (config.isKidsMode) {
    parts.push(`\nKIDS MODE:
- Use simple words (5-7 year old level)
- Short sentences (max 10 words)
- Add emojis: 🌟 ✨ 💪 🎉
- Celebrate small wins
- Make learning feel like play`);
  }

  // Reasoning mode
  if (config.enableReasoning) {
    parts.push(`\nREASONING MODE:
Before answering, think through:
1. What is the user really asking?
2. What context matters most?
3. What would be most helpful?
4. What's the clearest way to explain this?

Then provide your answer. Do not expose your reasoning process.`);
  }

  // Safety protocols
  parts.push(`\nSAFETY:
- Never provide medical diagnoses
- For crisis situations, direct to professional help
- Refuse harmful instructions
- Add disclaimers for medical/legal topics`);

  // Output formatting
  parts.push(`\nFORMAT:
- Clean, readable text
- 2-4 focused paragraphs
- Use **bold** sparingly (max 3)
- Bullet points for lists
- End with actionable next step`);

  return parts.join("\n");
}

/**
 * Get tier-specific guidance
 */
function getTierGuidance(tier: string): string | null {
  const guidance: Record<string, string> = {
    Free: "Simple, encouraging language. Extra patient. Step-by-step clarity.",
    VIP1: "Gentle coaching. Clear breakdowns. Small wins.",
    VIP2: "Balanced guidance. Concrete examples. Skill-building.",
    VIP3: "Precise, elegant. Nuanced insights. Trust capability.",
    VIP4: "Professional depth. Technical + practical. Multi-layered.",
    VIP5: "Advanced concepts. Strategic frameworks. Higher autonomy.",
    VIP6: "Deep psychology. Shadow work. Handle complexity.",
    VIP7: "Systems thinking. Interconnected patterns. Sophisticated.",
    VIP8: "Mastery-level. Subtle distinctions. Executive view.",
    VIP9: "Strategic mindset. Historical wisdom. CEO-level thinking.",
  };
  return guidance[tier] || null;
}

/**
 * Get domain-specific behavior
 */
function getDomainBehavior(domain: string): string | null {
  const behaviors: Record<string, string> = {
    "Health & Wellness": "Holistic wellbeing. Sustainable habits. Safety disclaimers.",
    "Emotional Intelligence": "Empathetic listening. Emotional validation. Self-awareness.",
    "Career & Skills": "Career strategy. Skill paths. Growth mindset.",
    "Shadow Psychology": "Handle sensitively. Validate emotions. Gentle exploration.",
    "Strategic Thinking": "Systems view. Patterns. Long-term thinking.",
    "Kids English": "Simple vocabulary. Short sentences. Encouraging. Emojis! 🌟",
    "English Foundation": "Patient teaching. Clear guidance. Celebrate progress.",
  };
  return behaviors[domain] || null;
}
