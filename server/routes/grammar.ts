// PATH: server/routes/grammar.ts

import type { Express, Request, Response } from 'express';
import { analyzeGrammar } from '../mercy/grammarEngine';

export function registerGrammarRoutes(app: Express) {
  app.post('/api/mercy/grammar', (req: Request, res: Response) => {
    try {
      console.log('🔥 Grammar route loaded with advanced response');

      const text = String(req.body?.text ?? '').trim();

      if (!text) {
        return res.status(400).json({ error: 'Text is required.' });
      }

      const learnerId = String(req.body?.learnerId ?? 'demo-learner');
      const result = analyzeGrammar(text, learnerId);
      return res.json(result);
    } catch (error) {
      console.error('Grammar API failed:', error);
      return res.status(500).json({ error: 'Grammar analysis failed.' });
    }
  });
}