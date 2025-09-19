"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = __importDefault(require("pino-http"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const schoolRoutes_1 = __importDefault(require("./routes/schoolRoutes"));
const teacherRoutes_1 = __importDefault(require("./routes/teacherRoutes"));
const districtRoutes_1 = __importDefault(require("./routes/districtRoutes"));
const mediumRoutes_1 = __importDefault(require("./routes/mediumRoutes"));
const managementTypeRoutes_1 = __importDefault(require("./routes/managementTypeRoutes"));
const blockOfficeRoutes_1 = __importDefault(require("./routes/blockOfficeRoutes"));
const locationRoutes_1 = __importDefault(require("./routes/locationRoutes"));
const subjectRoutes_1 = __importDefault(require("./routes/subjectRoutes"));
const schoolTypeRoutes_1 = __importDefault(require("./routes/schoolTypeRoutes"));
const religionRoutes_1 = __importDefault(require("./routes/religionRoutes"));
const serviceCategoryRoutes_1 = __importDefault(require("./routes/serviceCategoryRoutes"));
const medicalRecordRoutes_1 = __importDefault(require("./routes/medicalRecordRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const userManagementRoutes_1 = __importDefault(require("./routes/userManagementRoutes"));
const otpAuthRoutes_1 = __importDefault(require("./routes/otpAuthRoutes"));
const reportsRoutes_1 = __importDefault(require("./routes/reportsRoutes"));
const auditRoutes_1 = __importDefault(require("./routes/auditRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const rolesRoutes_1 = __importDefault(require("./routes/rolesRoutes"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const cascadeRoutes_1 = __importDefault(require("./routes/cascadeRoutes"));
const env_1 = require("./utils/env");
const auditCleanupJob_1 = require("./jobs/auditCleanupJob");
function createApp() {
    const app = (0, express_1.default)();
    const env = (0, env_1.loadEnv)();
    const logger = (0, pino_1.default)({ level: process.env.LOG_LEVEL || 'info' });
    // Configure Express to trust proxies for proper IP extraction
    // This is important for getting real client IPs in development and production
    // Trust proxies when in production or when TRUST_PROXY is set
    if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === 'true') {
        app.set('trust proxy', 1); // Trust first proxy
    }
    else {
        app.set('trust proxy', false); // Don't trust proxies in development
    }
    const globalLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 1000, standardHeaders: true, legacyHeaders: false });
    app.use(globalLimiter);
    app.use((0, pino_http_1.default)({ logger }));
    app.use((0, helmet_1.default)({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], scriptSrc: ["'self'"], imgSrc: ["'self'", "data:", "https:"], objectSrc: ["'self'"], mediaSrc: ["'self'"] } } }));
    app.use((0, cors_1.default)({ origin: env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() }));
    // Import the modular Swagger specification
    const swaggerSpec = require('./swagger');
    if (process.env.NODE_ENV !== 'production' || process.env.EXPOSE_DOCS === 'true') {
        // Add route for Swagger JSON
        app.get('/api/docs/swagger.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(swaggerSpec);
        });
        app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
            explorer: true,
            swaggerOptions: {
                docExpansion: 'none', // Collapse all operations by default
                filter: true, // Enable search/filter functionality
                showRequestHeaders: true,
                showCommonExtensions: true,
                tryItOutEnabled: true,
                requestInterceptor: (req) => {
                    // Add authorization header if available
                    const token = req.headers?.authorization || 'Bearer ' + (req.body?.token || '');
                    if (token) {
                        req.headers.Authorization = token;
                    }
                    return req;
                },
                responseInterceptor: (res) => {
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
        }));
    }
    app.use('/api/schools', schoolRoutes_1.default);
    app.use('/api/teachers', teacherRoutes_1.default);
    app.use('/api/districts', districtRoutes_1.default);
    app.use('/api/mediums', mediumRoutes_1.default);
    app.use('/api/management-types', managementTypeRoutes_1.default);
    app.use('/api/block-offices', blockOfficeRoutes_1.default);
    app.use('/api/locations', locationRoutes_1.default);
    app.use('/api/subjects', subjectRoutes_1.default);
    app.use('/api/medical-records', medicalRecordRoutes_1.default);
    app.use('/api/uploads', uploadRoutes_1.default);
    app.use('/api/school-types', schoolTypeRoutes_1.default);
    app.use('/api/religions', religionRoutes_1.default);
    app.use('/api/service-categories', serviceCategoryRoutes_1.default);
    app.use('/api/auth', authRoutes_1.default);
    app.use('/api/users', userRoutes_1.default);
    app.use('/api/user-management', userManagementRoutes_1.default);
    app.use('/api/otp-auth', otpAuthRoutes_1.default);
    app.use('/api/reports', reportsRoutes_1.default);
    app.use('/api/audit', auditRoutes_1.default);
    app.use('/api/roles', rolesRoutes_1.default);
    app.use('/api/sessions', sessionRoutes_1.default);
    app.use('/api/cascade', cascadeRoutes_1.default);
    // Start audit cleanup jobs
    auditCleanupJob_1.AuditCleanupJob.start();
    logger.info('Audit cleanup jobs started');
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
    app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api/'))
            return res.status(404).json({ success: false, message: 'Route not found' });
        res.sendFile(path_1.default.join(__dirname, '../frontend/dist/index.html'));
    });
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' });
    });
    return app;
}
//# sourceMappingURL=app.js.map