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
  validateUserUpdate,
  getCurrentUser,
  updateCurrentUser,
  changePassword
} from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Setup admin route (for initial setup only)
if (process.env.NODE_ENV !== 'production') {
  router.post('/setup-admin', createDefaultAdmin);
}

// Protected routes - require authentication
router.post('/register', authenticateToken, requireAdmin, validateUserRegistration, registerUser);
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/:id', authenticateToken, requireAdmin, getUserById);
router.put('/:id', authenticateToken, requireAdmin, validateUserUpdate, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

// User profile management routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/me', authenticateToken, updateCurrentUser);
router.post('/change-password', authenticateToken, changePassword);

export default router;
