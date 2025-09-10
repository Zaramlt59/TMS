import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import {
  getAllUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser
} from '../controllers/userManagementController'

const router = Router()

// All routes require authentication and admin access
router.use(authenticateToken)
router.use(requireAdmin)

// User management routes
router.get('/', getAllUsers)
router.post('/', createUser)
router.put('/:id', updateUser)
router.patch('/:id/toggle-status', toggleUserStatus)
router.delete('/:id', deleteUser)

export default router
