// PATH: server/routes/grammar.ts

import type { Express, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { analyzeGrammar } from '../mercy/grammarEngine';
// L1 hint adapter + feature-flag resolver live under api/_lib/ so the
// Vercel bundler can see them. Local dev imports from the same canonical
// source to avoid drift between the two runtimes. Explicit `.js`
// extensions match the Vercel ESM resolver requirement and are also
// accepted by tsx at dev time.
import { firstL1HintFromIssues } from '../../api/_lib/l1HintAdapter.js';
import { isFlagEnabledForUser } from '../../api/_lib/featureFlags.js';

// ─────────────────────────────────────────────────────────────────────────
// Supabase client — used to resolve the per-user feature flag that gates
// L1 detector output. Lazy — built once at module load. No-ops (flag OFF)
// if env vars are missing so the grammar route keeps working in isolated
// tests that don't wire Supabase.
// ─────────────────────────────────────────────────────────────────────────
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

const L1_FLAG_KEY = 'feedbackL1DetectorEnabled';

export function registerGrammarRoutes(app: Express) {
  app.post('/api/mercy/grammar', async (req: Request, res: Response) => {
    try {
      console.log('🔥 Grammar route loaded with advanced response');

      const text = String(req.body?.text ?? '').trim();

      if (!text) {
        return res.status(400).json({ error: 'Text is required.' });
      }

      const learnerId = String(req.body?.learnerId ?? 'demo-learner');
      const userId =
        typeof req.body?.userId === 'string' && req.body.userId.trim()
          ? req.body.userId.trim()
          : null;

      const result = analyzeGrammar(text, learnerId);

      // ── L1 detector (feature-flagged, default OFF globally) ──────────
      // Only runs when (a) Supabase is configured, (b) the request carries
      // a userId, and (c) the user is in the flag's enabled_user_ids
      // cohort OR the flag is globally ON. When any precondition fails,
      // the response is identical to the pre-L1 shape — existing callers
      // see zero behavior change.
      let l1FlagOn = false;
      if (supabase && userId) {
        try {
          l1FlagOn = await isFlagEnabledForUser(
            supabase,
            L1_FLAG_KEY,
            userId,
          );
        } catch (err) {
          console.warn('[grammar] L1 flag lookup failed (silently off):', err);
        }
      }

      if (l1FlagOn) {
        const hint = firstL1HintFromIssues(result.issues);
        if (hint) {
          // Attach as an optional `l1Hint` alongside the existing response.
          // Clients that don't know about the field keep working unchanged;
          // clients that do can render it instead of the generic explanation.
          (result as typeof result & { l1Hint?: typeof hint }).l1Hint = hint;
        }
      }

      return res.json(result);
    } catch (error) {
      console.error('Grammar API failed:', error);
      return res.status(500).json({ error: 'Grammar analysis failed.' });
    }
  });
}
