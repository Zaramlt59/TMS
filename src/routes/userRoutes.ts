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

const router = express.Router();

// Public authentication routes
router.post('/login', validateUserLogin, loginUser);
router.post('/setup-admin', createDefaultAdmin); // For initial setup only

// Protected routes - require authentication
router.post('/register', authenticateToken, requireAdmin, validateUserRegistration, registerUser);
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/:id', authenticateToken, requireAdmin, getUserById);
router.put('/:id', authenticateToken, requireAdmin, validateUserUpdate, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;
