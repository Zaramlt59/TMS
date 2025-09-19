import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import path from 'path'
import pino from 'pino'
import pinoHttp from 'pino-http'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

import schoolRoutes from './routes/schoolRoutes'
import teacherRoutes from './routes/teacherRoutes'
import districtRoutes from './routes/districtRoutes'
import mediumRoutes from './routes/mediumRoutes'
import managementTypeRoutes from './routes/managementTypeRoutes'
import blockOfficeRoutes from './routes/blockOfficeRoutes'
import locationRoutes from './routes/locationRoutes'
import subjectRoutes from './routes/subjectRoutes'
import schoolTypeRoutes from './routes/schoolTypeRoutes'
import religionRoutes from './routes/religionRoutes'
import serviceCategoryRoutes from './routes/serviceCategoryRoutes'
import medicalRecordRoutes from './routes/medicalRecordRoutes'
import uploadRoutes from './routes/uploadRoutes'
import userRoutes from './routes/userRoutes'
import userManagementRoutes from './routes/userManagementRoutes'
import otpAuthRoutes from './routes/otpAuthRoutes'
import reportsRoutes from './routes/reportsRoutes'
import auditRoutes from './routes/auditRoutes'
import authRoutes from './routes/authRoutes'
import rolesRoutes from './routes/rolesRoutes'
import sessionRoutes from './routes/sessionRoutes'
import cascadeRoutes from './routes/cascadeRoutes'
import { loadEnv } from './utils/env'

export function createApp() {
  const app = express()
  const env = loadEnv()
  const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

  // Configure Express to trust proxies for proper IP extraction
  // This is important for getting real client IPs in development and production
  // Trust proxies when in production or when TRUST_PROXY is set
  if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1) // Trust first proxy
  } else {
    app.set('trust proxy', false) // Don't trust proxies in development
  }

  const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false })
  app.use(globalLimiter)
  app.use(pinoHttp({ logger }))
  app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], scriptSrc: ["'self'"], imgSrc: ["'self'", "data:", "https:"], objectSrc: ["'self'"], mediaSrc: ["'self'"] } } }))
  app.use(cors({ origin: env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }))
  app.use(cookieParser())
  app.use(compression())
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() }))

  // Import the modular Swagger specification
  const swaggerSpec = require('./swagger')
  if (process.env.NODE_ENV !== 'production' || process.env.EXPOSE_DOCS === 'true') {
    // Add route for Swagger JSON
    app.get('/api/docs/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.json(swaggerSpec)
    })
    
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: {
        docExpansion: 'none', // Collapse all operations by default
        filter: true, // Enable search/filter functionality
        showRequestHeaders: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        requestInterceptor: (req: any) => {
          // Add authorization header if available
          const token = req.headers?.authorization || 'Bearer ' + (req.body?.token || '');
          if (token) {
            req.headers.Authorization = token;
          }
          return req;
        },
        responseInterceptor: (res: any) => {
          return res;
        }
      },
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #1f2937; font-size: 2.5rem; }
        .swagger-ui .info .description { color: #6b7280; font-size: 1.1rem; }
        .swagger-ui .scheme-container { background: #f9fafb; border-radius: 8px; }
        .swagger-ui .opblock-tag { border-radius: 8px 8px 0 0; }
        .swagger-ui .opblock { border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .swagger-ui .opblock.opblock-post { border-color: #10b981; }
        .swagger-ui .opblock.opblock-get { border-color: #3b82f6; }
        .swagger-ui .opblock.opblock-put { border-color: #f59e0b; }
        .swagger-ui .opblock.opblock-delete { border-color: #ef4444; }
      `,
      customSiteTitle: 'TMS API Documentation',
      customfavIcon: '/favicon.ico'
    }))
  }

  app.use('/api/schools', schoolRoutes)
  app.use('/api/teachers', teacherRoutes)
  app.use('/api/districts', districtRoutes)
  app.use('/api/mediums', mediumRoutes)
  app.use('/api/management-types', managementTypeRoutes)
  app.use('/api/block-offices', blockOfficeRoutes)
  app.use('/api/locations', locationRoutes)
  app.use('/api/subjects', subjectRoutes)
  app.use('/api/medical-records', medicalRecordRoutes)
  app.use('/api/uploads', uploadRoutes)
  app.use('/api/school-types', schoolTypeRoutes)
  app.use('/api/religions', religionRoutes)
  app.use('/api/service-categories', serviceCategoryRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/user-management', userManagementRoutes)
  app.use('/api/otp-auth', otpAuthRoutes)
  app.use('/api/reports', reportsRoutes)
  app.use('/api/audit', auditRoutes)
  app.use('/api/roles', rolesRoutes)
  app.use('/api/sessions', sessionRoutes)
  app.use('/api/cascade', cascadeRoutes)

  app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ success: false, message: 'Route not found' })
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
  })

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err)
    res.status(500).json({ success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' })
  })

  return app
}


