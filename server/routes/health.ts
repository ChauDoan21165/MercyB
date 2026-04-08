// PATH: server/routes/health.ts

import type { Express, Request, Response } from 'express';

const VERSION = 'mercy-advanced-v10-server-stable';
const SERVICE = 'mercy-grammar-api';

function buildHealthPayload() {
  return {
    ok: true,
    service: SERVICE,
    version: VERSION,
    timestamp: new Date().toISOString(),
  };
}

export function registerHealthRoutes(app: Express) {
  app.get('/health', (_req: Request, res: Response) => {
    return res.status(200).json(buildHealthPayload());
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    return res.status(200).json(buildHealthPayload());
  });
}