/**
 * Content Quality Audit Edge Function
 * Analyzes and fixes content quality issues across all room JSON files
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QualityIssue {
  roomId: string;
  issueType: 'tone' | 'wordCount' | 'keywords' | 'bilingual' | 'structure';
  severity: 'low' | 'medium' | 'high';
  message: string;
  field: string;
  currentValue?: string;
  suggestedFix?: string;
}

interface ContentAuditResult {
  totalRooms: number;
  issuesFound: number;
  issues: QualityIssue[];
  summary: Record<string, number>;
}

// Word count validation
function validateWordCount(text: string, min: number, max: number): boolean {
  const wordCount = text.trim().split(/\s+/).length;
  return wordCount >= min && wordCount <= max;
}

// Tone analysis (basic pattern matching)
function checkTone(text: string): { isWarm: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for overly formal language
  const formalPatterns = [
    /therefore/gi,
    /moreover/gi,
    /furthermore/gi,
    /in order to/gi,
    /in addition to/gi,
  ];
  
  formalPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      issues.push(`Overly formal language detected: ${pattern.source}`);
    }
  });
  
  // Check for absolute claims
  const absolutePatterns = [
    /will cure/gi,
    /guarantees?/gi,
    /always works?/gi,
    /never fails?/gi,
  ];
  
  absolutePatterns.forEach(pattern => {
    if (pattern.test(text)) {
      issues.push(`Absolute claim detected: ${pattern.source}`);
    }
  });
  
  return {
    isWarm: issues.length === 0,
    issues,
  };
}

// Keyword validation
function validateKeywords(keywords: string[]): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!keywords || keywords.length < 3 || keywords.length > 5) {
    issues.push(`Keyword count should be 3-5, found ${keywords?.length || 0}`);
  }
  
  // Check for duplicates
  const unique = new Set(keywords);
  if (unique.size !== keywords.length) {
    issues.push('Duplicate keywords found');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
}

// Bilingual validation
function validateBilingual(en: string, vi: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!en || !vi) {
    issues.push('Missing English or Vietnamese content');
    return { isValid: false, issues };
  }
  
  const enWords = en.trim().split(/\s+/).length;
  const viWords = vi.trim().split(/\s+/).length;
  
  // Check if lengths are wildly different (>50% difference)
  const ratio = Math.abs(enWords - viWords) / Math.max(enWords, viWords);
  if (ratio > 0.5) {
    issues.push(`Length mismatch: EN ${enWords} words vs VI ${viWords} words`);
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
}

// Main audit function
async function auditRoom(roomData: any): Promise<QualityIssue[]> {
  const issues: QualityIssue[] = [];
  const roomId = roomData.id;
  
  // 1. Validate room intro (80-140 words)
  if (roomData.content?.en) {
    if (!validateWordCount(roomData.content.en, 80, 140)) {
      const wordCount = roomData.content.en.trim().split(/\s+/).length;
      issues.push({
        roomId,
        issueType: 'wordCount',
        severity: 'medium',
        message: `Room intro should be 80-140 words, found ${wordCount}`,
        field: 'content.en',
        currentValue: `${wordCount} words`,
      });
    }
    
    // Check tone
    const toneCheck = checkTone(roomData.content.en);
    if (!toneCheck.isWarm) {
      issues.push({
        roomId,
        issueType: 'tone',
        severity: 'low',
        message: toneCheck.issues.join(', '),
        field: 'content.en',
      });
    }
  }
  
  // 2. Validate bilingual content
  if (roomData.content?.en && roomData.content?.vi) {
    const bilingualCheck = validateBilingual(roomData.content.en, roomData.content.vi);
    if (!bilingualCheck.isValid) {
      issues.push({
        roomId,
        issueType: 'bilingual',
        severity: 'medium',
        message: bilingualCheck.issues.join(', '),
        field: 'content',
      });
    }
  }
  
  // 3. Validate entries
  if (roomData.entries && Array.isArray(roomData.entries)) {
    roomData.entries.forEach((entry: any, index: number) => {
      // Entry word count (50-150 words)
      if (entry.copy?.en) {
        if (!validateWordCount(entry.copy.en, 50, 150)) {
          const wordCount = entry.copy.en.trim().split(/\s+/).length;
          issues.push({
            roomId,
            issueType: 'wordCount',
            severity: 'medium',
            message: `Entry ${index + 1} should be 50-150 words, found ${wordCount}`,
            field: `entries[${index}].copy.en`,
            currentValue: `${wordCount} words`,
          });
        }
      }
      
      // Keyword validation
      if (entry.keywords_en) {
        const keywordCheck = validateKeywords(entry.keywords_en);
        if (!keywordCheck.isValid) {
          issues.push({
            roomId,
            issueType: 'keywords',
            severity: 'low',
            message: keywordCheck.issues.join(', '),
            field: `entries[${index}].keywords_en`,
          });
        }
      }
      
      // Bilingual entry validation
      if (entry.copy?.en && entry.copy?.vi) {
        const bilingualCheck = validateBilingual(entry.copy.en, entry.copy.vi);
        if (!bilingualCheck.isValid) {
          issues.push({
            roomId,
            issueType: 'bilingual',
            severity: 'medium',
            message: bilingualCheck.issues.join(', '),
            field: `entries[${index}].copy`,
          });
        }
      }
    });
  }
  
  // 4. Validate structure
  if (!roomData.id || typeof roomData.id !== 'string') {
    issues.push({
      roomId,
      issueType: 'structure',
      severity: 'high',
      message: 'Missing or invalid room ID',
      field: 'id',
    });
  }
  
  if (!/^[a-z0-9_]+$/.test(roomData.id)) {
    issues.push({
      roomId,
      issueType: 'structure',
      severity: 'medium',
      message: 'Room ID should be lowercase snake_case',
      field: 'id',
      currentValue: roomData.id,
    });
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
    
    console.log(`[Content Quality Audit] Started by user ${user.id}`);
    
    // Fetch all rooms from database
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('id, title_en, title_vi, tier, domain, entries, content_en, content_vi');
    
    if (roomsError) {
      throw new Error(`Failed to fetch rooms: ${roomsError.message}`);
    }
    
    console.log(`[Content Quality Audit] Analyzing ${rooms.length} rooms`);
    
    // Audit each room
    const allIssues: QualityIssue[] = [];
    
    for (const room of rooms) {
      const roomData = {
        id: room.id,
        content: {
          en: room.content_en,
          vi: room.content_vi,
        },
        entries: room.entries,
      };
      
      const roomIssues = await auditRoom(roomData);
      allIssues.push(...roomIssues);
    }
    
    // Summarize issues by type
    const summary: Record<string, number> = {};
    allIssues.forEach(issue => {
      summary[issue.issueType] = (summary[issue.issueType] || 0) + 1;
    });
    
    const result: ContentAuditResult = {
      totalRooms: rooms.length,
      issuesFound: allIssues.length,
      issues: allIssues,
      summary,
    };
    
    console.log(`[Content Quality Audit] Found ${allIssues.length} issues across ${rooms.length} rooms`);
    console.log(`[Content Quality Audit] Summary:`, summary);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('[Content Quality Audit] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
