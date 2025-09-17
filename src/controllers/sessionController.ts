import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const sessionController = {
  // Get current user's active sessions
  getUserSessions: async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const sessions = await authService.getUserSessions(req.user.userId);

      res.json({
        success: true,
        message: 'User sessions retrieved successfully',
        data: {
          sessions,
          currentSession: req.headers['user-agent'] || 'Unknown'
        }
      });
    } catch (error: any) {
      console.error('Error getting user sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user sessions'
      });
    }
  },

  // Revoke a specific session
  revokeSession: async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { sessionId } = req.params;
      const revoked = await authService.revokeSession(sessionId, req.user.userId);

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
    } catch (error: any) {
      console.error('Error revoking session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to revoke session'
      });
    }
  },

  // Revoke all sessions except current
  revokeOtherSessions: async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const currentToken = req.cookies?.['rt']; // Current refresh token
      const revoked = await authService.revokeAllForUser(req.user.userId, currentToken);

      res.json({
        success: true,
        message: 'All other sessions revoked successfully',
        data: {
          revokedCount: revoked
        }
      });
    } catch (error: any) {
      console.error('Error revoking other sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to revoke other sessions'
      });
    }
  },

  // Get session information
  getSessionInfo: async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { sessionId } = req.params;
      const sessionInfo = await authService.getSessionInfo(sessionId, req.user.userId);

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
    } catch (error: any) {
      console.error('Error getting session info:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve session information'
      });
    }
  }
};
