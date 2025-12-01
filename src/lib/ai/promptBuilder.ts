/**
 * AI Prompt Builder
 * Tier-aware, domain-specific, context-rich system prompts
 */

import type { ConversationContext } from "./contextManager";

export interface PromptConfig {
  tier: string;
  domain?: string;
  roomTitle?: string;
  keywords?: string[];
  isKidsMode?: boolean;
  skillLevel?: "novice" | "intermediate" | "advanced";
  userGoals?: string[];
}

/**
 * Base Mercy Blade personality
 */
const BASE_PERSONALITY = `You are Mercy Blade, a compassionate AI guide helping users develop mental clarity, emotional resilience, and strategic thinking.

Core principles:
- Warm, supportive, never judgmental
- Practical, actionable guidance
- Bilingual (English/Vietnamese) when appropriate
- Respect user privacy and agency
- Encourage self-discovery over prescriptive advice`;

/**
 * Tier-specific tone adjustments
 */
const TIER_TONES = {
  Free: "Use simple, encouraging language. Focus on step-by-step clarity. Be extra patient.",
  VIP1: "Gentle coaching tone. Break down concepts clearly. Encourage small wins.",
  VIP2: "Balanced guidance. Provide concrete examples. Support skill-building.",
  VIP3: "Precise, elegant language. Offer nuanced insights. Trust user capability.",
  VIP4: "Professional depth. Balanced technical and practical. Multi-layered reasoning.",
  VIP5: "Advanced concepts. Strategic frameworks. Assume higher autonomy.",
  VIP6: "Deep psychological insights. Shadow work language. Handle complexity.",
  VIP7: "Systems thinking. Interconnected patterns. High sophistication.",
  VIP8: "Mastery-level guidance. Subtle distinctions. Executive perspective.",
  VIP9: "Strategic mindset. Historical wisdom. Geopolitical awareness. CEO-level thinking.",
};

/**
 * Domain-specific behaviors
 */
const DOMAIN_BEHAVIORS = {
  "Health & Wellness": "Focus on holistic wellbeing. Emphasize sustainable habits. Safety disclaimers for medical topics.",
  "Emotional Intelligence": "Empathetic listening. Emotional validation. Self-awareness development.",
  "Career & Skills": "Practical career strategy. Skill development paths. Professional growth mindset.",
  "Shadow Psychology": "Handle sensitive topics carefully. Validate difficult emotions. Encourage gentle self-exploration.",
  "Strategic Thinking": "Systems perspective. Pattern recognition. Long-term thinking.",
  "Kids English": "Simple vocabulary. Short sentences. Encouraging tone. More emojis! 🌟",
  "English Foundation": "Patient teaching. Clear pronunciation guidance. Celebrate progress.",
};

/**
 * Skill level adjustments
 */
const SKILL_ADJUSTMENTS = {
  novice: "Break concepts into smallest steps. Use analogies. Check understanding frequently.",
  intermediate: "Balance explanation with practice. Introduce frameworks. Build connections.",
  advanced: "Deep dive into nuance. Challenge assumptions. Explore edge cases.",
};

/**
 * Kids Mode modifications
 */
const KIDS_MODE_RULES = `
KIDS MODE ACTIVE:
- Use simple words (5-7 year old level)
- Short sentences (max 10 words)
- Add encouraging emojis: 🌟 ✨ 💪 🎉
- Celebrate every small win
- Make learning feel like a game
- Be extra patient and gentle`;

/**
 * Safety filters
 */
const SAFETY_RULES = `
SAFETY PROTOCOLS:
- Never provide medical diagnoses or prescriptions
- For crisis keywords (suicide, self-harm, abuse), respond with: "I hear you're going through something difficult. Please reach out to a professional: [Crisis Hotline]. I'm here to support you, but trained professionals can help most."
- Refuse harmful instructions (illegal activities, violence, manipulation)
- Maintain appropriate boundaries
- Protect user privacy`;

/**
 * Output formatting rules
 */
const FORMAT_RULES = `
OUTPUT RULES:
- No console fragments or debug text
- No excessive markdown (use sparingly)
- Clean spacing: one blank line between paragraphs
- Bullet points for lists
- **Bold** for emphasis (max 3 per response)
- Keep responses focused: 2-4 paragraphs ideal
- End with actionable next step when appropriate`;

/**
 * Build complete system prompt
 */
export function buildSystemPrompt(config: PromptConfig, context?: ConversationContext): string {
  const parts: string[] = [BASE_PERSONALITY];

  // Add tier-specific tone
  const tierTone = TIER_TONES[config.tier as keyof typeof TIER_TONES];
  if (tierTone) {
    parts.push(`\nTIER: ${config.tier}\n${tierTone}`);
  }

  // Add domain behavior
  if (config.domain) {
    const domainBehavior = DOMAIN_BEHAVIORS[config.domain as keyof typeof DOMAIN_BEHAVIORS];
    if (domainBehavior) {
      parts.push(`\nDOMAIN: ${config.domain}\n${domainBehavior}`);
    }
  }

  // Add room context
  if (config.roomTitle) {
    parts.push(`\nCURRENT ROOM: "${config.roomTitle}"`);
  }

  if (config.keywords && config.keywords.length > 0) {
    parts.push(`\nKEY TOPICS: ${config.keywords.slice(0, 5).join(", ")}`);
  }

  // Add skill level adjustment
  if (config.skillLevel) {
    const skillAdjustment = SKILL_ADJUSTMENTS[config.skillLevel];
    parts.push(`\nUSER SKILL LEVEL: ${config.skillLevel}\n${skillAdjustment}`);
  }

  // Add user goals if available
  if (config.userGoals && config.userGoals.length > 0) {
    parts.push(`\nUSER GOALS: ${config.userGoals.join("; ")}`);
  }

  // Kids Mode override
  if (config.isKidsMode) {
    parts.push(KIDS_MODE_RULES);
  }

  // Add context summary if available
  if (context && context.messages.length > 1) {
    const conversationCount = context.messages.filter((m) => m.role !== "system").length;
    parts.push(`\nCONVERSATION HISTORY: ${conversationCount} messages exchanged. Maintain consistency with previous guidance.`);
  }

  // Add safety and format rules
  parts.push(SAFETY_RULES);
  parts.push(FORMAT_RULES);

  return parts.join("\n");
}

/**
 * Build user message with preprocessing
 */
export function preprocessUserInput(input: string): string {
  let cleaned = input.trim();

  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, " ");

  // Fix common punctuation issues
  cleaned = cleaned.replace(/\s+([.,!?;:])/g, "$1");
  cleaned = cleaned.replace(/([.,!?;:])\s+/g, "$1 ");

  // Normalize quotes
  cleaned = cleaned.replace(/[""]/g, '"');
  cleaned = cleaned.replace(/['']/g, "'");

  return cleaned;
}

/**
 * Post-process AI output
 */
export function normalizeAIOutput(output: string): string {
  let cleaned = output.trim();

  // Remove console fragments
  cleaned = cleaned.replace(/console\.(log|error|warn)\(.*?\)/g, "");
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ""); // Remove code blocks unless needed

  // Enforce spacing
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n"); // Max 2 newlines
  cleaned = cleaned.replace(/([.!?])\s*\n\s*/g, "$1\n\n"); // Paragraph breaks after sentences

  // Clean up excessive markdown
  cleaned = cleaned.replace(/\*\*\*+/g, "**"); // Triple asterisks to double
  cleaned = cleaned.replace(/___+/g, "__");

  return cleaned.trim();
}

/**
 * Check if output contains safety violations
 */
export function checkSafety(output: string): { safe: boolean; reason?: string } {
  const lowerOutput = output.toLowerCase();

  // Crisis keywords
  const crisisKeywords = ["kill myself", "end my life", "want to die", "suicide"];
  if (crisisKeywords.some((kw) => lowerOutput.includes(kw))) {
    return { safe: false, reason: "Contains crisis content without proper support resources" };
  }

  // Harmful instructions
  const harmfulPatterns = ["how to harm", "illegal", "manipulate someone"];
  if (harmfulPatterns.some((pattern) => lowerOutput.includes(pattern))) {
    return { safe: false, reason: "Contains potentially harmful instructions" };
  }

  return { safe: true };
}
