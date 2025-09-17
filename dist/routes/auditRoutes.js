"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auditController_1 = require("../controllers/auditController");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const router = express_1.default.Router();
// All audit routes require authentication and admin privileges
router.use(auth_1.authenticateToken);
router.use(auth_2.requireAdmin);
// Get audit logs with filtering and pagination
router.get('/logs', auditController_1.AuditController.getAuditLogs);
// Get security alerts
router.get('/security-alerts', auditController_1.AuditController.getSecurityAlerts);
// Get audit statistics
router.get('/stats', auditController_1.AuditController.getAuditStats);
// Get audit log details by ID
router.get('/logs/:id', auditController_1.AuditController.getAuditLogById);
// Export audit logs to CSV
router.get('/export', auditController_1.AuditController.exportAuditLogs);
exports.default = router;
//# sourceMappingURL=auditRoutes.js.map