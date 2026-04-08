/**
 * File: index.ts
 * Path: server/index.ts
 */

import mercyMemoryRoutes from './routes/mercyMemoryRoutes';
import { createApp } from './app';

console.log('🔥 NEW MERCY SERVER ACTIVE');

const PORT = 3001;
const app = createApp();

app.use(mercyMemoryRoutes);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Grammar API running on http://localhost:${PORT}`);
  console.log(`Grammar API health check on http://localhost:${PORT}/health`);
  console.log(`Mercy memory API on http://localhost:${PORT}/api/mercy/memory`);
});

server.on('listening', () => {
  console.log('✅ Express server is listening');
});

server.on('close', () => {
  console.log('🛑 Express server closed');
});

server.on('error', (error) => {
  console.error('❌ Express server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled rejection:', reason);
});

process.on('exit', (code) => {
  console.log(`ℹ️ Process exiting with code ${code}`);
});

const heartbeat = setInterval(() => {
  console.log(`💓 Mercy server heartbeat ${new Date().toISOString()}`);
}, 15000);

function shutdown(signal: string) {
  console.log(`\n${signal} received. Shutting down Mercy server...`);
  clearInterval(heartbeat);

  server.close((error) => {
    if (error) {
      console.error('❌ Error while closing server:', error);
      process.exit(1);
      return;
    }

    console.log('✅ Mercy server shut down cleanly');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));