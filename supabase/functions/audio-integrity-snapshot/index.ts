/**
 * Audio Integrity Snapshot API
 * Phase 5: Provides centralized integrity data for the Crystal Dashboard
 * 
 * Returns:
 * - System integrity score
 * - Lowest integrity rooms
 * - Violation breakdown
 * - Autopilot status
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RoomIntegrity {
  roomId: string;
  score: number;
  missingEn: number;
  missingVi: number;
  orphans: number;
  duplicates: number;
  namingIssues: number;
}

interface IntegritySnapshot {
  updatedAt: string;
  systemIntegrity: number;
  totalRooms: number;
  totalAudioFiles: number;
  lowestRooms: RoomIntegrity[];
  violations: {
    missing: number;
    orphans: number;
    duplicates: number;
    namingIssues: number;
    reversedLang: number;
  };
  autopilot: {
    enabled: boolean;
    lastRun: string | null;
    fixesApplied: number;
    lastIntegrity: number;
  };
  byTier: Record<string, {
    rooms: number;
    avgScore: number;
    issues: number;
  }>;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch rooms with entries
    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id, tier, entries, title_en")
      .order("id");

    if (roomsError) {
      throw new Error(`Failed to fetch rooms: ${roomsError.message}`);
    }

    // Fetch audio audit data
    const { data: auditData, error: auditError } = await supabase
      .from("audio_audit_room")
      .select("*");

    const auditMap = new Map(
      (auditData || []).map((a: any) => [a.room_id, a])
    );

    // Calculate integrity for each room
    const roomIntegrities: RoomIntegrity[] = [];
    let totalMissing = 0;
    let totalOrphans = 0;
    let totalDuplicates = 0;
    let totalNamingIssues = 0;
    
    const tierStats: Record<string, { rooms: number; totalScore: number; issues: number }> = {};

    for (const room of rooms || []) {
      const entries = room.entries || [];
      const entryCount = Array.isArray(entries) ? entries.length : 0;
      const audit = auditMap.get(room.id);
      
      const missingEn = audit?.missing_en || 0;
      const missingVi = audit?.missing_vi || 0;
      const orphans = audit?.orphan_count || 0;
      
      // Calculate score (simplified)
      const expectedFiles = entryCount * 2; // EN + VI for each entry
      const missing = missingEn + missingVi;
      const score = expectedFiles > 0 
        ? Math.round(((expectedFiles - missing) / expectedFiles) * 100)
        : 100;
      
      roomIntegrities.push({
        roomId: room.id,
        score,
        missingEn,
        missingVi,
        orphans,
        duplicates: 0, // Would need separate tracking
        namingIssues: 0, // Would need separate tracking
      });
      
      totalMissing += missing;
      totalOrphans += orphans;
      
      // Tier aggregation
      const tier = room.tier || 'unknown';
      if (!tierStats[tier]) {
        tierStats[tier] = { rooms: 0, totalScore: 0, issues: 0 };
      }
      tierStats[tier].rooms++;
      tierStats[tier].totalScore += score;
      tierStats[tier].issues += missing + orphans;
    }

    // Sort by score to find lowest
    roomIntegrities.sort((a, b) => a.score - b.score);
    const lowestRooms = roomIntegrities.slice(0, 10);

    // Calculate system integrity
    const avgScore = roomIntegrities.length > 0
      ? roomIntegrities.reduce((sum, r) => sum + r.score, 0) / roomIntegrities.length
      : 100;

    // Format tier stats
    const byTier: Record<string, { rooms: number; avgScore: number; issues: number }> = {};
    for (const [tier, stats] of Object.entries(tierStats)) {
      byTier[tier] = {
        rooms: stats.rooms,
        avgScore: stats.rooms > 0 ? Math.round(stats.totalScore / stats.rooms) : 100,
        issues: stats.issues,
      };
    }

    const snapshot: IntegritySnapshot = {
      updatedAt: new Date().toISOString(),
      systemIntegrity: Math.round(avgScore),
      totalRooms: rooms?.length || 0,
      totalAudioFiles: 0, // Would need manifest data
      lowestRooms,
      violations: {
        missing: totalMissing,
        orphans: totalOrphans,
        duplicates: totalDuplicates,
        namingIssues: totalNamingIssues,
        reversedLang: 0,
      },
      autopilot: {
        enabled: true,
        lastRun: null, // Would need to track this
        fixesApplied: 0,
        lastIntegrity: Math.round(avgScore),
      },
      byTier,
    };

    return new Response(JSON.stringify(snapshot), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Integrity snapshot error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
