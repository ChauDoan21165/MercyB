/**
 * Audio Governance Console API v4.6
 * 
 * Endpoints:
 *   GET  /pending-reviews - List all pending human reviews
 *   POST /approve-change - Approve a pending change
 *   POST /reject-change - Reject a pending change
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PendingGovernanceReview {
  id: string;
  cycleId: string;
  timestamp: string;
  operation: {
    type: string;
    roomId: string;
    before: string;
    after?: string;
    confidence: number;
  };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

interface PendingGovernanceDB {
  version: string;
  updatedAt: string;
  pending: PendingGovernanceReview[];
  approved: PendingGovernanceReview[];
  rejected: PendingGovernanceReview[];
}

// In-memory storage for edge function (would use file system or DB in production)
// This is a placeholder - in real implementation, this would read from public/audio/pending-governance.json
let governanceDB: PendingGovernanceDB = {
  version: '4.6',
  updatedAt: new Date().toISOString(),
  pending: [],
  approved: [],
  rejected: [],
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace('/audio-governance-console', '');

  console.log(`[audio-governance-console] ${req.method} ${path}`);

  try {
    // GET /pending-reviews
    if (req.method === 'GET' && path === '/pending-reviews') {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            pending: governanceDB.pending,
            totalPending: governanceDB.pending.length,
            totalApproved: governanceDB.approved.length,
            totalRejected: governanceDB.rejected.length,
            lastUpdated: governanceDB.updatedAt,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /approve-change
    if (req.method === 'POST' && path === '/approve-change') {
      const body = await req.json();
      const { id, reviewedBy, notes } = body;

      if (!id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing id parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const index = governanceDB.pending.findIndex(r => r.id === id);
      if (index === -1) {
        return new Response(
          JSON.stringify({ success: false, error: 'Review not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const review = governanceDB.pending.splice(index, 1)[0];
      review.status = 'approved';
      review.reviewedBy = reviewedBy || 'admin';
      review.reviewedAt = new Date().toISOString();
      review.notes = notes;
      governanceDB.approved.push(review);
      governanceDB.updatedAt = new Date().toISOString();

      console.log(`[audio-governance-console] Approved review: ${id}`);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            review,
            message: 'Change approved successfully',
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /reject-change
    if (req.method === 'POST' && path === '/reject-change') {
      const body = await req.json();
      const { id, reviewedBy, notes } = body;

      if (!id) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing id parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const index = governanceDB.pending.findIndex(r => r.id === id);
      if (index === -1) {
        return new Response(
          JSON.stringify({ success: false, error: 'Review not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const review = governanceDB.pending.splice(index, 1)[0];
      review.status = 'rejected';
      review.reviewedBy = reviewedBy || 'admin';
      review.reviewedAt = new Date().toISOString();
      review.notes = notes;
      governanceDB.rejected.push(review);
      governanceDB.updatedAt = new Date().toISOString();

      console.log(`[audio-governance-console] Rejected review: ${id}`);

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            review,
            message: 'Change rejected successfully',
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /sync-db - Sync with JSON file (internal use)
    if (req.method === 'POST' && path === '/sync-db') {
      const body = await req.json();
      if (body.db) {
        governanceDB = body.db;
        console.log(`[audio-governance-console] Synced DB with ${governanceDB.pending.length} pending reviews`);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'DB synced' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /stats
    if (req.method === 'GET' && path === '/stats') {
      const pendingByRoom: Record<string, number> = {};
      for (const review of governanceDB.pending) {
        const room = review.operation.roomId;
        pendingByRoom[room] = (pendingByRoom[room] || 0) + 1;
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            totalPending: governanceDB.pending.length,
            totalApproved: governanceDB.approved.length,
            totalRejected: governanceDB.rejected.length,
            pendingByRoom,
            avgConfidence: governanceDB.pending.length > 0
              ? governanceDB.pending.reduce((sum, r) => sum + r.operation.confidence, 0) / governanceDB.pending.length
              : 0,
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
