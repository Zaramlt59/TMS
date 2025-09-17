"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionController = void 0;
const authService_1 = require("../services/authService");
exports.sessionController = {
    // Get current user's active sessions
    getUserSessions: async (req, res) => {
        try {
            if (!req.user?.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const sessions = await authService_1.authService.getUserSessions(req.user.userId);
            res.json({
                success: true,
                message: 'User sessions retrieved successfully',
                data: {
                    sessions,
                    currentSession: req.headers['user-agent'] || 'Unknown'
                }
            });
        }
        catch (error) {
            console.error('Error getting user sessions:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve user sessions'
            });
        }
    },
    // Revoke a specific session
    revokeSession: async (req, res) => {
        try {
            if (!req.user?.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const { sessionId } = req.params;
            const revoked = await authService_1.authService.revokeSession(sessionId, req.user.userId);
            if (!revoked) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found or not authorized to revoke'
                });
            }
            res.json({
                success: true,
                message: 'Session revoked successfully'
            });
        }
        catch (error) {
            console.error('Error revoking session:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to revoke session'
            });
        }
    },
    // Revoke all sessions except current
    revokeOtherSessions: async (req, res) => {
        try {
            if (!req.user?.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const currentToken = req.cookies?.['rt']; // Current refresh token
            const revoked = await authService_1.authService.revokeAllForUser(req.user.userId, currentToken);
            res.json({
                success: true,
                message: 'All other sessions revoked successfully',
                data: {
                    revokedCount: revoked
                }
            });
        }
        catch (error) {
            console.error('Error revoking other sessions:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to revoke other sessions'
            });
        }
    },
    // Get session information
    getSessionInfo: async (req, res) => {
        try {
            if (!req.user?.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const { sessionId } = req.params;
            const sessionInfo = await authService_1.authService.getSessionInfo(sessionId, req.user.userId);
            if (!sessionInfo) {
                return res.status(404).json({
                    success: false,
                    message: 'Session not found or not authorized to view'
                });
            }
            res.json({
                success: true,
                message: 'Session information retrieved successfully',
                data: sessionInfo
            });
        }
        catch (error) {
            console.error('Error getting session info:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve session information'
            });
        }
    }
};
//# sourceMappingURL=sessionController.js.map