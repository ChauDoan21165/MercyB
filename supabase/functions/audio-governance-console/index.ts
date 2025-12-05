/**
 * Audio Governance Console API v4.7
 * 
 * Phase 4.7: Persistent Governance DB with Two-Way Integration
 * 
 * Endpoints:
 *   GET  /pending-reviews - List pending reviews with filters
 *   POST /approve-change - Approve a pending change
 *   POST /reject-change - Reject a pending change
 *   GET  /approved-ready - Get approved changes ready for autopilot
 *   POST /mark-applied - Mark approved changes as applied by autopilot
 *   POST /add-pending - Add new pending reviews (deduped)
 *   GET  /stats - Get governance statistics
 *   POST /cleanup-stale - Remove stale pending items
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface GovernanceReview {
  review_id: string;
  cycle_id: string;
  operation_type: string;
  room_id: string;
  before_filename?: string;
  after_filename?: string;
  confidence: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/audio-governance-console', '');

  console.log(`[audio-governance-console v4.7] ${req.method} ${path}`);

  try {
    // ============================================
    // GET /pending-reviews - List with filters
    // ============================================
    if (req.method === 'GET' && path === '/pending-reviews') {
      const roomFilter = url.searchParams.get('room');
      const confidenceMin = url.searchParams.get('confidence_min');
      const operationType = url.searchParams.get('type');
      const limit = parseInt(url.searchParams.get('limit') || '100');

      let query = supabase
        .from('audio_governance_reviews')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (roomFilter) {
        query = query.ilike('room_id', `%${roomFilter}%`);
      }
      if (confidenceMin) {
        query = query.gte('confidence', parseFloat(confidenceMin));
      }
      if (operationType) {
        query = query.eq('operation_type', operationType);
      }

      const { data: pending, error } = await query;

      if (error) {
        console.error('[audio-governance-console] Error fetching pending:', error);
        throw error;
      }

      // Get counts for stats
      const { count: totalPending } = await supabase
        .from('audio_governance_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: totalApproved } = await supabase
        .from('audio_governance_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: totalRejected } = await supabase
        .from('audio_governance_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            pending: pending || [],
            totalPending: totalPending || 0,
            totalApproved: totalApproved || 0,
            totalRejected: totalRejected || 0,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // POST /approve-change
    // ============================================
    if (req.method === 'POST' && path === '/approve-change') {
      const body = await req.json();
      const { review_id, reviewed_by, notes } = body;

      if (!review_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing review_id parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('audio_governance_reviews')
        .update({
          status: 'approved',
          reviewed_by: reviewed_by || 'admin',
          reviewed_at: new Date().toISOString(),
          notes,
        })
        .eq('review_id', review_id)
        .eq('status', 'pending')
        .select()
        .single();

      if (error || !data) {
        console.error('[audio-governance-console] Error approving:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Review not found or already processed' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[audio-governance-console] Approved review: ${review_id}`);

      return new Response(
        JSON.stringify({
          success: true,
          data: { review: data, message: 'Change approved successfully' },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // POST /reject-change
    // ============================================
    if (req.method === 'POST' && path === '/reject-change') {
      const body = await req.json();
      const { review_id, reviewed_by, notes } = body;

      if (!review_id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing review_id parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('audio_governance_reviews')
        .update({
          status: 'rejected',
          reviewed_by: reviewed_by || 'admin',
          reviewed_at: new Date().toISOString(),
          notes,
        })
        .eq('review_id', review_id)
        .eq('status', 'pending')
        .select()
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ success: false, error: 'Review not found or already processed' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[audio-governance-console] Rejected review: ${review_id}`);

      return new Response(
        JSON.stringify({
          success: true,
          data: { review: data, message: 'Change rejected successfully' },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // GET /approved-ready - Two-way integration
    // Returns approved changes ready for autopilot to apply
    // ============================================
    if (req.method === 'GET' && path === '/approved-ready') {
      const { data, error } = await supabase
        .from('audio_governance_reviews')
        .select('*')
        .eq('status', 'approved')
        .order('reviewed_at', { ascending: true });

      if (error) {
        throw error;
      }

      console.log(`[audio-governance-console] ${data?.length || 0} approved changes ready`);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            approvedChanges: data || [],
            count: data?.length || 0,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // POST /mark-applied - Two-way integration
    // Mark approved changes as applied (after autopilot applies them)
    // ============================================
    if (req.method === 'POST' && path === '/mark-applied') {
      const body = await req.json();
      const { review_ids } = body;

      if (!review_ids || !Array.isArray(review_ids)) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing review_ids array' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Delete applied reviews (they're done)
      const { error } = await supabase
        .from('audio_governance_reviews')
        .delete()
        .in('review_id', review_ids)
        .eq('status', 'approved');

      if (error) {
        throw error;
      }

      console.log(`[audio-governance-console] Marked ${review_ids.length} as applied`);

      return new Response(
        JSON.stringify({
          success: true,
          data: { message: `${review_ids.length} changes marked as applied`, applied: review_ids },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // POST /add-pending - Add pending reviews with dedup
    // ============================================
    if (req.method === 'POST' && path === '/add-pending') {
      const body = await req.json();
      const { reviews } = body;

      if (!reviews || !Array.isArray(reviews)) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing reviews array' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      let added = 0;
      let skipped = 0;

      for (const review of reviews) {
        // Deduplicate by unique constraint (room_id, before_filename, operation_type)
        const { error } = await supabase
          .from('audio_governance_reviews')
          .upsert({
            review_id: review.review_id || `${review.room_id}-${review.operation_type}-${Date.now()}`,
            cycle_id: review.cycle_id,
            operation_type: review.operation_type,
            room_id: review.room_id,
            before_filename: review.before_filename,
            after_filename: review.after_filename,
            confidence: review.confidence,
            reason: review.reason,
            status: 'pending',
          }, {
            onConflict: 'room_id,before_filename,operation_type',
            ignoreDuplicates: true,
          });

        if (error) {
          console.warn(`[audio-governance-console] Skip duplicate: ${review.room_id}`);
          skipped++;
        } else {
          added++;
        }
      }

      console.log(`[audio-governance-console] Added ${added}, skipped ${skipped} duplicates`);

      return new Response(
        JSON.stringify({
          success: true,
          data: { added, skipped, total: reviews.length },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // GET /stats - Governance statistics
    // ============================================
    if (req.method === 'GET' && path === '/stats') {
      const { count: totalPending } = await supabase
        .from('audio_governance_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: totalApproved } = await supabase
        .from('audio_governance_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: totalRejected } = await supabase
        .from('audio_governance_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      // Get pending by room
      const { data: pendingByRoom } = await supabase
        .from('audio_governance_reviews')
        .select('room_id')
        .eq('status', 'pending');

      const roomCounts: Record<string, number> = {};
      for (const r of pendingByRoom || []) {
        roomCounts[r.room_id] = (roomCounts[r.room_id] || 0) + 1;
      }

      // Get average confidence
      const { data: confidenceData } = await supabase
        .from('audio_governance_reviews')
        .select('confidence')
        .eq('status', 'pending');

      const avgConfidence = confidenceData && confidenceData.length > 0
        ? confidenceData.reduce((sum, r) => sum + Number(r.confidence), 0) / confidenceData.length
        : 0;

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            totalPending: totalPending || 0,
            totalApproved: totalApproved || 0,
            totalRejected: totalRejected || 0,
            pendingByRoom: roomCounts,
            avgConfidence,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // POST /cleanup-stale - Remove old pending items
    // ============================================
    if (req.method === 'POST' && path === '/cleanup-stale') {
      const body = await req.json();
      const maxAgeHours = body.max_age_hours || 168; // Default 7 days

      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - maxAgeHours);

      const { data, error } = await supabase
        .from('audio_governance_reviews')
        .delete()
        .eq('status', 'pending')
        .lt('created_at', cutoffDate.toISOString())
        .select();

      if (error) {
        throw error;
      }

      console.log(`[audio-governance-console] Cleaned up ${data?.length || 0} stale items`);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            cleaned: data?.length || 0,
            cutoffDate: cutoffDate.toISOString(),
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ success: false, error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[audio-governance-console] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
