"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const sessionController_1 = require("../controllers/sessionController");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Get current user's active sessions
router.get('/', sessionController_1.sessionController.getUserSessions);
// Revoke a specific session
router.delete('/:sessionId', sessionController_1.sessionController.revokeSession);
// Revoke all sessions except current
router.delete('/others', sessionController_1.sessionController.revokeOtherSessions);
// Get session information
router.get('/:sessionId', sessionController_1.sessionController.getSessionInfo);
exports.default = router;
//# sourceMappingURL=sessionRoutes.js.map