import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import { validateCreateUser, validateUpdateUser, validateUserId } from '../middleware/userValidation'
import {
  getAllUsers,
  createUser,
  updateUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser
} from '../controllers/userManagementController'

const router = Router()

// All routes require authentication and admin access
router.use(authenticateToken)
router.use(requireAdmin)

// User management routes with validation
router.get('/', getAllUsers)
router.post('/', validateCreateUser, createUser)
router.put('/:id', validateUserId, validateUpdateUser, updateUser)
router.patch('/:id/role', validateUserId, updateUserRole)
router.patch('/:id/toggle-status', validateUserId, toggleUserStatus)
router.delete('/:id', validateUserId, deleteUser)

export default router
