"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
const app_1 = require("./app");
// Load environment variables
dotenv_1.default.config();
const app = (0, app_1.createApp)();
const PORT = process.env.PORT || 5004;
// Sentry
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
        profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE || 0.1),
        integrations: [(0, profiling_node_1.nodeProfilingIntegration)()]
    });
}
// (All middleware, routes, health/docs configured inside createApp)
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (process.env.SENTRY_DSN) {
        try {
            Sentry.captureException(err);
        }
        catch { }
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
    }
    catch (error) {
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
//# sourceMappingURL=index.js.map