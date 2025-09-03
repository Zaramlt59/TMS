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
import userRoutes from './routes/userRoutes'
import { loadEnv } from './utils/env'

export function createApp() {
  const app = express()
  const env = loadEnv()
  const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

  const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false })
  app.use(globalLimiter)
  app.use(pinoHttp({ logger }))
  app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], scriptSrc: ["'self'"], imgSrc: ["'self'", "data:", "https:"] } } }))
  app.use(cors({ origin: env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }))
  app.use(cookieParser())
  app.use(compression())
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() }))

  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: { title: 'TMS API', version: '1.0.0' },
      tags: [
        { name: 'Users' },
        { name: 'Schools' },
        { name: 'Teachers' },
        { name: 'Districts' },
        { name: 'Mediums' },
        { name: 'Management Types' },
        { name: 'Block Offices' },
        { name: 'Locations' },
        { name: 'Subjects' },
        { name: 'School Types' },
        { name: 'Religions' },
        { name: 'Service Categories' }
      ]
    },
    apis: ['docs/**/*.yaml']
  })
  if (process.env.NODE_ENV !== 'production' || process.env.EXPOSE_DOCS === 'true') {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  }

  app.use('/api/schools', schoolRoutes)
  app.use('/api/teachers', teacherRoutes)
  app.use('/api/districts', districtRoutes)
  app.use('/api/mediums', mediumRoutes)
  app.use('/api/management-types', managementTypeRoutes)
  app.use('/api/block-offices', blockOfficeRoutes)
  app.use('/api/locations', locationRoutes)
  app.use('/api/subjects', subjectRoutes)
  app.use('/api/school-types', schoolTypeRoutes)
  app.use('/api/religions', religionRoutes)
  app.use('/api/service-categories', serviceCategoryRoutes)
  app.use('/api/users', userRoutes)

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


