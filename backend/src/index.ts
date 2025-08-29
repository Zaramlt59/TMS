import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { database } from './database/connection';
import schoolRoutes from './routes/schoolRoutes';
import teacherRoutes from './routes/teacherRoutes';
import districtRoutes from './routes/districtRoutes';
import mediumRoutes from './routes/mediumRoutes';
import managementTypeRoutes from './routes/managementTypeRoutes';
import blockOfficeRoutes from './routes/blockOfficeRoutes';
import locationRoutes from './routes/locationRoutes';
import subjectRoutes from './routes/subjectRoutes';
import schoolTypeRoutes from './routes/schoolTypeRoutes';
import religionRoutes from './routes/religionRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/schools', schoolRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/mediums', mediumRoutes);
app.use('/api/management-types', managementTypeRoutes);
app.use('/api/block-offices', blockOfficeRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/school-types', schoolTypeRoutes);
app.use('/api/religions', religionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await database.connect();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
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
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await database.close();
  process.exit(0);
});

startServer();
