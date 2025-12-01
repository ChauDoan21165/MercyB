/**
 * Safety Audit Edge Function
 * Detects crisis content, validates safety disclaimers, and checks for harmful advice
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SafetyIssue {
  roomId: string;
  issueType: 'crisis' | 'disclaimer' | 'harmful' | 'medical' | 'trauma' | 'kids';
  severity: 1 | 2 | 3 | 4 | 5;
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  message: string;
  field: string;
  triggerWords?: string[];
  suggestedAction?: string;
}

interface SafetyAuditResult {
  totalRooms: number;
  issuesFound: number;
  criticalIssues: number;
  issues: SafetyIssue[];
  summary: Record<string, number>;
}

// Crisis detection patterns
const CRISIS_PATTERNS = [
  { pattern: /suicid(e|al)/gi, severity: 5, urgency: 'immediate' },
  { pattern: /self[\s-]harm/gi, severity: 5, urgency: 'immediate' },
  { pattern: /kill(ing)?\s+(myself|yourself)/gi, severity: 5, urgency: 'immediate' },
  { pattern: /want to die/gi, severity: 5, urgency: 'immediate' },
  { pattern: /end(ing)?\s+(my|your)\s+life/gi, severity: 5, urgency: 'immediate' },
  { pattern: /severe depression/gi, severity: 4, urgency: 'high' },
  { pattern: /abuse(d)?/gi, severity: 4, urgency: 'high' },
  { pattern: /trauma(tic)?/gi, severity: 3, urgency: 'medium' },
  { pattern: /violence/gi, severity: 3, urgency: 'medium' },
];

// Harmful advice patterns
const HARMFUL_PATTERNS = [
  /will cure/gi,
  /guaranteed? (to )?heal/gi,
  /always works?/gi,
  /never fails?/gi,
  /completely fix(es)?/gi,
  /permanent(ly)? solve(s)?/gi,
];

// Medical claim patterns
const MEDICAL_PATTERNS = [
  /diagnose/gi,
  /prescribe/gi,
  /medication/gi,
  /medical treatment/gi,
  /clinical diagnosis/gi,
];

// Detect crisis content
function detectCrisisContent(text: string): { hasCrisis: boolean; triggers: string[]; severity: number; urgency: string } {
  const triggers: string[] = [];
  let maxSeverity = 0;
  let maxUrgency = 'low';
  
  CRISIS_PATTERNS.forEach(({ pattern, severity, urgency }) => {
    const matches = text.match(pattern);
    if (matches) {
      triggers.push(...matches.map(m => m.toLowerCase()));
      if (severity > maxSeverity) {
        maxSeverity = severity;
        maxUrgency = urgency as string;
      }
    }
  });
  
  return {
    hasCrisis: triggers.length > 0,
    triggers: [...new Set(triggers)],
    severity: maxSeverity,
    urgency: maxUrgency,
  };
}

// Detect harmful advice
function detectHarmfulAdvice(text: string): { isHarmful: boolean; patterns: string[] } {
  const patterns: string[] = [];
  
  HARMFUL_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) {
      patterns.push(pattern.source);
    }
  });
  
  return {
    isHarmful: patterns.length > 0,
    patterns,
  };
}

// Detect medical claims
function detectMedicalClaims(text: string): { hasClaims: boolean; patterns: string[] } {
  const patterns: string[] = [];
  
  MEDICAL_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) {
      patterns.push(pattern.source);
    }
  });
  
  return {
    hasClaims: patterns.length > 0,
    patterns,
  };
}

// Check for safety disclaimers
function hasDisclaimers(roomData: any): { hasDisclaimer: boolean; hasCrisisFooter: boolean } {
  return {
    hasDisclaimer: !!(roomData.safety_disclaimer_en || roomData.safety_disclaimer_vi),
    hasCrisisFooter: !!(roomData.crisis_footer_en || roomData.crisis_footer_vi),
  };
}

// Audit room safety
async function auditRoomSafety(roomData: any): Promise<SafetyIssue[]> {
  const issues: SafetyIssue[] = [];
  const roomId = roomData.id;
  
  // Combine all text for analysis
  const allText = [
    roomData.content_en || '',
    roomData.content_vi || '',
    ...(roomData.entries || []).map((e: any) => e.copy?.en || ''),
    ...(roomData.entries || []).map((e: any) => e.copy?.vi || ''),
  ].join(' ');
  
  // 1. Crisis detection
  const crisisCheck = detectCrisisContent(allText);
  if (crisisCheck.hasCrisis) {
    issues.push({
      roomId,
      issueType: 'crisis',
      severity: crisisCheck.severity as 5,
      urgency: crisisCheck.urgency as 'immediate',
      message: `Crisis content detected: ${crisisCheck.triggers.join(', ')}`,
      field: 'content',
      triggerWords: crisisCheck.triggers,
      suggestedAction: 'Add crisis hotline footer and safety disclaimer',
    });
  }
  
  // 2. Check disclaimers
  const disclaimerCheck = hasDisclaimers(roomData);
  if (!disclaimerCheck.hasDisclaimer && roomData.tier !== 'free') {
    issues.push({
      roomId,
      issueType: 'disclaimer',
      severity: 3,
      urgency: 'medium',
      message: 'Missing safety disclaimer',
      field: 'safety_disclaimer',
      suggestedAction: 'Add bilingual safety disclaimer',
    });
  }
  
  if (crisisCheck.hasCrisis && !disclaimerCheck.hasCrisisFooter) {
    issues.push({
      roomId,
      issueType: 'disclaimer',
      severity: 5,
      urgency: 'immediate',
      message: 'Crisis content without crisis footer',
      field: 'crisis_footer',
      suggestedAction: 'Add crisis hotline information',
    });
  }
  
  // 3. Harmful advice detection
  const harmfulCheck = detectHarmfulAdvice(allText);
  if (harmfulCheck.isHarmful) {
    issues.push({
      roomId,
      issueType: 'harmful',
      severity: 4,
      urgency: 'high',
      message: `Potentially harmful absolute claims: ${harmfulCheck.patterns.join(', ')}`,
      field: 'content',
      suggestedAction: 'Replace with softer language: "may help", "can support", "often helps"',
    });
  }
  
  // 4. Medical claim detection
  const medicalCheck = detectMedicalClaims(allText);
  if (medicalCheck.hasClaims) {
    issues.push({
      roomId,
      issueType: 'medical',
      severity: 4,
      urgency: 'high',
      message: `Medical claims detected: ${medicalCheck.patterns.join(', ')}`,
      field: 'content',
      suggestedAction: 'Add "not a substitute for professional help" disclaimer',
    });
  }
  
  // 5. Kids content check
  if (roomData.tier && roomData.tier.startsWith('kids')) {
    const kidsCheck = detectCrisisContent(allText);
    if (kidsCheck.hasCrisis) {
      issues.push({
        roomId,
        issueType: 'kids',
        severity: 5,
        urgency: 'immediate',
        message: 'Kids content contains adult crisis topics',
        field: 'content',
        triggerWords: kidsCheck.triggers,
        suggestedAction: 'Remove or significantly simplify content for children',
      });
    }
  }
  
  return issues;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`[Safety Audit] Started by user ${user.id}`);
    
    // Fetch all rooms from database
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');
    
    if (roomsError) {
      throw new Error(`Failed to fetch rooms: ${roomsError.message}`);
    }
    
    console.log(`[Safety Audit] Analyzing ${rooms.length} rooms`);
    
    // Audit each room
    const allIssues: SafetyIssue[] = [];
    
    for (const room of rooms) {
      const roomIssues = await auditRoomSafety(room);
      allIssues.push(...roomIssues);
    }
    
    // Count critical issues (severity 4-5)
    const criticalIssues = allIssues.filter(issue => issue.severity >= 4).length;
    
    // Summarize issues by type
    const summary: Record<string, number> = {};
    allIssues.forEach(issue => {
      summary[issue.issueType] = (summary[issue.issueType] || 0) + 1;
    });
    
    const result: SafetyAuditResult = {
      totalRooms: rooms.length,
      issuesFound: allIssues.length,
      criticalIssues,
      issues: allIssues,
      summary,
    };
    
    console.log(`[Safety Audit] Found ${allIssues.length} issues (${criticalIssues} critical) across ${rooms.length} rooms`);
    console.log(`[Safety Audit] Summary:`, summary);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('[Safety Audit] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
