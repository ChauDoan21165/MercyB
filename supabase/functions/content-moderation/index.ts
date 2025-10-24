import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModerationRule {
  id: string;
  lang: string;
  category: string;
  severity: number;
  patterns: string[];
}

interface ModerationRules {
  policy: {
    severity_levels: Record<string, string>;
    actions: Array<{
      score_gte: number;
      window_hours: number;
      action: string;
      message_en: string;
      message_vi: string;
    }>;
    scoring: Record<string, number>;
  };
  rules: ModerationRule[];
  normalization_pipeline: string[];
}

// Load moderation rules
const MODERATION_RULES: ModerationRules = {
  "policy": {
    "severity_levels": {
      "1": "mild profanity / coarse language",
      "2": "direct insult / harassment",
      "3": "sexual explicitness / graphic profanity",
      "4": "violent threats / targeted harassment",
      "5": "hate slurs / sexual violence / child exploitation"
    },
    "actions": [
      {
        "score_gte": 1,
        "window_hours": 24,
        "action": "warn",
        "message_en": "⚠️ Language not allowed in Mercy Blade. Please be respectful.",
        "message_vi": "⚠️ Ngôn từ này không được phép trên Mercy Blade. Vui lòng dùng lời lẽ lịch sự."
      },
      {
        "score_gte": 2,
        "window_hours": 24,
        "action": "suspend",
        "message_en": "🚫 Second violation in 24h. Your account has been suspended.",
        "message_vi": "🚫 Vi phạm lần 2 trong 24 giờ. Tài khoản của bạn bị tạm khóa."
      }
    ],
    "scoring": {
      "severity1": 1,
      "severity2": 1,
      "severity3": 2,
      "severity4": 2,
      "severity5": 3
    }
  },
  "normalization_pipeline": ["lowercase", "trim"],
  "rules": [
    {
      "id": "en_prof_1",
      "lang": "en",
      "category": "profanity",
      "severity": 1,
      "patterns": ["\\bass(es)?\\b", "\\b(crap|shit+)\\b", "\\b(hell|damn)\\b"]
    },
    {
      "id": "en_prof_2",
      "lang": "en",
      "category": "profanity",
      "severity": 2,
      "patterns": ["\\b(bitch(es)?|bastard(s)?)\\b", "\\b(dick|prick)\\b"]
    },
    {
      "id": "en_prof_3",
      "lang": "en",
      "category": "profanity",
      "severity": 3,
      "patterns": ["\\bfuck(ing|er|s)?\\b", "\\bmotherfucker(s)?\\b", "\\bcunt(s)?\\b"]
    },
    {
      "id": "vi_prof_1",
      "lang": "vi",
      "category": "profanity",
      "severity": 1,
      "patterns": ["\\b(đ[ồố]ng|chó|khốn)\\b", "\\b(ngu|hèn)\\b"]
    },
    {
      "id": "vi_prof_2",
      "lang": "vi",
      "category": "profanity",
      "severity": 2,
      "patterns": ["\\b(đ[ụứừử][ấậ]|m[ẹệ]|lồn|buồi)\\b", "\\b(c[ặắ]c|đéo|vãi)\\b"]
    },
    {
      "id": "vi_prof_3",
      "lang": "vi",
      "category": "profanity",
      "severity": 3,
      "patterns": ["\\b(đ[ụứừử]m[ẹệ]|c[ụứừử]m[ẹệ])\\b", "\\b(đĩ|con đĩ)\\b"]
    }
  ]
};

function normalizeText(text: string): string {
  let normalized = text;
  for (const step of MODERATION_RULES.normalization_pipeline) {
    if (step === "lowercase") normalized = normalized.toLowerCase();
    if (step === "trim") normalized = normalized.trim();
  }
  return normalized;
}

function checkContent(content: string): { violated: boolean; severity: number; matchedRule?: string } {
  const normalized = normalizeText(content);
  
  for (const rule of MODERATION_RULES.rules) {
    for (const pattern of rule.patterns) {
      const regex = new RegExp(pattern, 'gi');
      if (regex.test(normalized)) {
        return {
          violated: true,
          severity: rule.severity,
          matchedRule: rule.id
        };
      }
    }
  }
  
  return { violated: false, severity: 0 };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { content, userId, roomId, language = "en" } = await req.json();

    if (!content || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check content for violations
    const moderationResult = checkContent(content);

    if (!moderationResult.violated) {
      return new Response(
        JSON.stringify({ allowed: true, message: "Content approved" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get or create user moderation status
    const { data: statusData } = await supabase
      .from('user_moderation_status')
      .select('*')
      .eq('user_id', userId)
      .single();

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Calculate score based on severity
    const scoreKey = `severity${moderationResult.severity}` as keyof typeof MODERATION_RULES.policy.scoring;
    const score = MODERATION_RULES.policy.scoring[scoreKey] || 1;

    // Check recent violations
    const { data: recentViolations } = await supabase
      .from('user_moderation_violations')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', twentyFourHoursAgo.toISOString());

    const violationCount = (recentViolations?.length || 0) + 1;
    const totalScore = (statusData?.violation_score || 0) + score;

    // Determine action
    let action = "warn";
    let actionMessage = MODERATION_RULES.policy.actions[0][language === "vi" ? "message_vi" : "message_en"];
    
    for (const policyAction of MODERATION_RULES.policy.actions) {
      if (totalScore >= policyAction.score_gte) {
        action = policyAction.action;
        actionMessage = policyAction[language === "vi" ? "message_vi" : "message_en"];
      }
    }

    // Record violation
    await supabase
      .from('user_moderation_violations')
      .insert({
        user_id: userId,
        violation_type: moderationResult.matchedRule || 'unknown',
        severity_level: moderationResult.severity,
        message_content: content.substring(0, 500),
        room_id: roomId,
        action_taken: action
      });

    // Update or create moderation status
    if (statusData) {
      await supabase
        .from('user_moderation_status')
        .update({
          violation_score: totalScore,
          total_violations: (statusData.total_violations || 0) + 1,
          last_violation_at: now.toISOString(),
          is_suspended: action === 'suspend',
          updated_at: now.toISOString()
        })
        .eq('user_id', userId);
    } else {
      await supabase
        .from('user_moderation_status')
        .insert({
          user_id: userId,
          violation_score: totalScore,
          total_violations: 1,
          last_violation_at: now.toISOString(),
          is_suspended: action === 'suspend',
        });
    }

    return new Response(
      JSON.stringify({
        allowed: false,
        action,
        message: actionMessage,
        severity: moderationResult.severity,
        suspended: action === 'suspend'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Moderation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
