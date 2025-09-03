import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

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
import serviceCategoryRoutes from './routes/serviceCategoryRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5004',
  credentials: true
}));
app.use(compression());
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
app.use('/api/service-categories', serviceCategoryRoutes);
app.use('/api/users', userRoutes);

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  }
  
  // Serve the frontend app for all other routes
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
async function startServer() {
  try {
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
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

startServer();
