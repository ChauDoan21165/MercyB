/**
 * File: app.ts
 * Path: server/app.ts
 */

import express from 'express';
import cors from 'cors';
import mercyMemoryRoutes from './routes/mercyMemoryRoutes';
import { registerHealthRoutes } from './routes/health';
import { registerGrammarRoutes } from './routes/grammar';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(mercyMemoryRoutes);
  console.log('✅ mercyMemoryRoutes mounted');

  registerHealthRoutes(app);
  registerGrammarRoutes(app);

  return app;
}