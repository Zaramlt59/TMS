import express from 'express';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { createApp } from './app';
import { AuditCleanupJob } from './jobs/auditCleanupJob';
import prisma from './services/prismaService';

// Load environment variables
dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 5004;

// Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
    profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE || 0.1),
    integrations: [nodeProfilingIntegration()]
  });
}

// (All middleware, routes, health/docs configured inside createApp)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  if (process.env.SENTRY_DSN) {
    try { Sentry.captureException(err); } catch {}
  }
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database before accepting requests (fail fast if DB is down)
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Monolithic TMS Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 Frontend: http://localhost:${PORT}`);
      console.log(`🏫 Schools API: http://localhost:${PORT}/api/schools`);
      console.log(`👨‍🏫 Teachers API: http://localhost:${PORT}/api/teachers`);
      console.log(`🗺️  Districts API: http://localhost:${PORT}/api/districts`);
      console.log(`📚 Mediums API: http://localhost:${PORT}/api/mediums`);
      console.log(`🏢 Management Types API: http://localhost:${PORT}/api/management-types`);
      console.log(`🏛️  Block Offices API: http://localhost:${PORT}/api/block-offices`);
      console.log(`📍 Locations API: http://localhost:${PORT}/api/locations`);
      console.log(`📚 Subjects API: http://localhost:${PORT}/api/subjects`);
      console.log(`🏫 School Types API: http://localhost:${PORT}/api/school-types`);
      console.log(`🙏 Religions API: http://localhost:${PORT}/api/religions`);
      console.log(`🧾 Service Categories API: http://localhost:${PORT}/api/service-categories`);
      console.log(`👤 Users API: http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    if (error && typeof (error as any).message === 'string') {
      const msg = (error as Error).message;
      if (msg.includes('connect') || msg.includes('ECONNREFUSED') || msg.includes('Unknown database')) {
        console.error('\n💡 Database may not be running or DATABASE_URL is wrong. Check:');
        console.error('   - MySQL is running (e.g. port 3306)');
        console.error('   - .env has DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/ttms_db');
        console.error('   - Database "ttms_db" exists (run: npx prisma db push  or  migrate)');
      }
    }
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown() {
  console.log('\n🛑 Shutting down server...');
  try {
    await AuditCleanupJob.shutdown();
    console.log('✅ Audit cleanup jobs stopped gracefully');
  } catch (error) {
    console.error('❌ Error during audit cleanup shutdown:', error);
  }
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting database:', error);
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
