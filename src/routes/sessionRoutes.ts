import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { sessionController } from '../controllers/sessionController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get current user's active sessions
router.get('/', sessionController.getUserSessions);

// Revoke a specific session
router.delete('/:sessionId', sessionController.revokeSession);

// Revoke all sessions except current
router.delete('/others', sessionController.revokeOtherSessions);

// Get session information
router.get('/:sessionId', sessionController.getSessionInfo);

export default router;
