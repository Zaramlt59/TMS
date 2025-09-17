import express from 'express';
import { param, query } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { cascadeController } from '../controllers/cascadeController';

const router = express.Router();

// All routes require authentication and admin access
router.use(authenticateToken);
router.use(requireAdmin);

// Get cascade information for school deletion
router.get('/school/:schoolId', [
  param('schoolId').notEmpty().withMessage('School ID is required')
], cascadeController.getSchoolCascadeInfo);

// Get cascade information for teacher deletion
router.get('/teacher/:teacherId', [
  param('teacherId').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], cascadeController.getTeacherCascadeInfo);

// Get cascade information for user deletion
router.get('/user/:userId', [
  param('userId').isInt({ min: 1 }).withMessage('User ID must be a positive integer')
], cascadeController.getUserCascadeInfo);

// Safe delete school with cascade warning
router.delete('/school/:schoolId', [
  param('schoolId').notEmpty().withMessage('School ID is required'),
  query('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController.safeDeleteSchool);

// Safe delete teacher with cascade warning
router.delete('/teacher/:teacherId', [
  param('teacherId').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer'),
  query('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController.safeDeleteTeacher);

// Safe delete user with cascade warning
router.delete('/user/:userId', [
  param('userId').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  query('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController.safeDeleteUser);

// Get cascade information for district deletion
router.get('/district/:districtId', [
  param('districtId').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], cascadeController.getDistrictCascadeInfo);

// Get cascade information for RD block deletion
router.get('/rd-block/:rdBlockId', [
  param('rdBlockId').isInt({ min: 1 }).withMessage('RD Block ID must be a positive integer')
], cascadeController.getRdBlockCascadeInfo);

// Get cascade information for village deletion
router.get('/village/:villageId', [
  param('villageId').isInt({ min: 1 }).withMessage('Village ID must be a positive integer')
], cascadeController.getVillageCascadeInfo);

// Safe delete district with cascade warning
router.delete('/district/:districtId', [
  param('districtId').isInt({ min: 1 }).withMessage('District ID must be a positive integer'),
  query('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController.safeDeleteDistrict);

// Safe delete RD block with cascade warning
router.delete('/rd-block/:rdBlockId', [
  param('rdBlockId').isInt({ min: 1 }).withMessage('RD Block ID must be a positive integer'),
  query('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController.safeDeleteRdBlock);

// Safe delete village with cascade warning
router.delete('/village/:villageId', [
  param('villageId').isInt({ min: 1 }).withMessage('Village ID must be a positive integer'),
  query('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController.safeDeleteVillage);

export default router;
