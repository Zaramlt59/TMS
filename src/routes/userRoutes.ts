import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createDefaultAdmin,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate
} from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { authLogin, authRefresh, authLogout, requestPasswordReset, resetPassword } from '../controllers/authController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Public authentication routes
const authLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
router.post('/login', validateUserLogin, authLogin);
// Guard setup-admin for non-production only
if (process.env.NODE_ENV !== 'production') {
  router.post('/setup-admin', createDefaultAdmin); // For initial setup only
}
router.post('/refresh', authLimiter, authRefresh);
router.post('/logout', authLogout);
router.post('/password/reset-request', authLimiter, requestPasswordReset);
router.post('/password/reset', authLimiter, resetPassword);

// Protected routes - require authentication
router.post('/register', authenticateToken, requireAdmin, validateUserRegistration, registerUser);
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/:id', authenticateToken, requireAdmin, getUserById);
router.put('/:id', authenticateToken, requireAdmin, validateUserUpdate, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;
