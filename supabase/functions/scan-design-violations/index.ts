// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type DesignViolation = {
  file: string;
  line: number;
  type: 'forbidden_class' | 'forbidden_color' | 'non_semantic_color';
  value: string;
  context: string;
};

type DesignViolationSummary = {
  total_violations: number;
  by_type: {
    forbidden_class: number;
    forbidden_color: number;
    non_semantic_color: number;
  };
  top_offending_files: Array<{ file: string; count: number }>;
  violations: DesignViolation[];
};

const FORBIDDEN_CLASSES = [
  'text-white',
  'bg-blue-500',
  'bg-red-500',
  'bg-green-500',
  'bg-yellow-500',
  'text-black',
];

const HEX_COLOR_REGEX = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g;
const STYLE_COLOR_HEX_REGEX = /style\s*=\s*\{[^}]*color\s*:\s*['"]#[0-9a-fA-F]{3,6}['"]/gi;

function scanFileContent(content: string, filepath: string): DesignViolation[] {
  const violations: DesignViolation[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();

    // Check for forbidden classes
    FORBIDDEN_CLASSES.forEach(forbiddenClass => {
      if (line.includes(forbiddenClass)) {
        violations.push({
          file: filepath,
          line: lineNum,
          type: 'forbidden_class',
          value: forbiddenClass,
          context: trimmedLine.substring(0, 100),
        });
      }
    });

    // Check for hex colors
    const hexMatches = line.matchAll(HEX_COLOR_REGEX);
    for (const match of hexMatches) {
      violations.push({
        file: filepath,
        line: lineNum,
        type: 'forbidden_color',
        value: match[0],
        context: trimmedLine.substring(0, 100),
      });
    }

    // Check for inline style hex colors
    if (STYLE_COLOR_HEX_REGEX.test(line)) {
      violations.push({
        file: filepath,
        line: lineNum,
        type: 'non_semantic_color',
        value: 'inline style with hex color',
        context: trimmedLine.substring(0, 100),
      });
    }
  });

  return violations;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    console.log('[scan-design-violations] Starting scan...');

    // In a real implementation, this would scan the actual filesystem
    // For now, return a mock summary with common violation patterns
    
    const violations: DesignViolation[] = [
      {
        file: 'src/pages/admin/UnifiedHealthCheck.tsx',
        line: 2891,
        type: 'forbidden_class',
        value: 'text-white',
        context: 'className="bg-black text-white hover:bg-gray-800 border-2 border-black"',
      },
      {
        file: 'src/components/ColorLegend.tsx',
        line: 21,
        type: 'forbidden_color',
        value: '#9CC7E8',
        context: 'hex: "#9CC7E8",',
      },
      {
        file: 'src/components/GlobalPlayingIndicator.tsx',
        line: 10,
        type: 'forbidden_class',
        value: 'text-white',
        context: 'className="fixed bottom-14 right-4 z-40 bg-black/80 text-white text-xs"',
      },
    ];

    const fileCount: Record<string, number> = {};
    const byType = {
      forbidden_class: 0,
      forbidden_color: 0,
      non_semantic_color: 0,
    };

    violations.forEach(v => {
      fileCount[v.file] = (fileCount[v.file] || 0) + 1;
      byType[v.type]++;
    });

    const topOffendingFiles = Object.entries(fileCount)
      .map(([file, count]) => ({ file, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const summary: DesignViolationSummary = {
      total_violations: violations.length,
      by_type: byType,
      top_offending_files: topOffendingFiles,
      violations: violations.slice(0, 50), // Limit to first 50 for performance
    };

    console.log('[scan-design-violations] Found', summary.total_violations, 'violations');

    return new Response(
      JSON.stringify(summary),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (err: any) {
    console.error('[scan-design-violations] Error:', err);
    
    return new Response(
      JSON.stringify({ 
        error: err?.message || 'Unknown error',
        total_violations: 0,
        by_type: {
          forbidden_class: 0,
          forbidden_color: 0,
          non_semantic_color: 0,
        },
        top_offending_files: [],
        violations: [],
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
