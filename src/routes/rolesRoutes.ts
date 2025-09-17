import express from 'express';
import { body, param } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { rolesController } from '../controllers/rolesController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all available roles and their information
router.get('/', rolesController.getAllRoles);

// Get permissions for a specific role
router.get('/:role/permissions', [
  param('role').isIn(['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher'])
    .withMessage('Invalid role specified')
], rolesController.getRolePermissions);

// Get role hierarchy information
router.get('/hierarchy', rolesController.getRoleHierarchy);

// Get all available permissions
router.get('/permissions/all', rolesController.getAllPermissions);

export default router;
