import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { SchoolController } from '../controllers/schoolController';

const router = Router();
const schoolController = new SchoolController();

// Validation middleware
const validateSchoolData = [
  body('school_id').isString().trim().isLength({ min: 1 }).withMessage('School ID is required'),
  body('school_name').isString().trim().isLength({ min: 1 }).withMessage('School name is required'),
  body('school_type').isIn(['Co-educational', 'Girls']).withMessage('Invalid school type'),
  body('school_level').isIn(['Primary School', 'Middle School', 'High School', 'Higher Secondary School']).withMessage('Invalid school level'),
  body('management').isIn(['Adhoc Aided', 'Central', 'Council Aided', 'Deficit', 'Deficit Mission', 'Government', 'Local Body', 'Lumpsum Aided', 'Private', 'Samagra']).withMessage('Invalid management type'),
  body('medium').isIn(['Bengali', 'Chakma', 'English', 'Hindi', 'Mizo', 'Nepali']).withMessage('Invalid medium'),
  body('pincode').optional().isString().trim(),
  body('district').optional().isString().trim(),
  body('rd_block').optional().isString().trim(),
  body('school_phone').optional().isString().trim(),
  body('school_email').optional().isEmail().withMessage('Invalid email format'),
  body('habitation').optional().isString().trim(),
  body('habitation_class').optional().isIn(['Rural', 'Urban']).withMessage('Invalid habitation class'),
  body('habitation_category').optional().isIn(['City', 'Town', 'Village']).withMessage('Invalid habitation category'),
  body('block_office').isIn(['DEO Aizawl', 'DEO Champhai', 'DEO Hnahthial', 'DEO Khawzawl', 'DEO Kolasib', 'DEO Lawngtlai', 'DEO Lunglei', 'DEO Mamit', 'DEO Saitual', 'DEO Serchhip', 'DEO Siaha', 'Education Office(CADC)', 'Education Office (LADC)', 'Education Office (MADC)', 'SDEO Aizawl East', 'SDEO Aizawl South', 'SDEO Aizawl West', 'SDEO Champhai', 'SDEO Darlawn', 'SDEO Hnahthial', 'SDEO Kawnpui', 'SDEO Kawrthah', 'SDEO Khawzawl', 'SDEO Kolasib', 'SDEO Lunglei North', 'SDEO Lunglei South', 'SDEO Lungsen', 'SDEO Mamit', 'SDEO North Vanlaiphai', 'SDEO Saitual', 'SDEO Serchhip', 'SDEO Thenzawl', 'SDEO West Phaileng']).withMessage('Invalid block office')
];

// Create school
router.post('/', validateSchoolData, schoolController.createSchool.bind(schoolController));

// Get all schools with pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], schoolController.getAllSchools.bind(schoolController));

// Get statistics (total schools and unique districts)
router.get('/stats', schoolController.getStats.bind(schoolController));

// Search schools
router.get('/search', [
  query('q').isString().trim().isLength({ min: 1 }).withMessage('Search query is required')
], schoolController.searchSchools.bind(schoolController));

// Get school by ID
router.get('/:schoolId', [
  param('schoolId').isString().trim().isLength({ min: 1 }).withMessage('School ID is required')
], schoolController.getSchoolById.bind(schoolController));

// Update school
router.put('/:schoolId', [
  param('schoolId').isString().trim().isLength({ min: 1 }).withMessage('School ID is required'),
  ...validateSchoolData.map(validation => validation.optional())
], schoolController.updateSchool.bind(schoolController));

// Delete school
router.delete('/:schoolId', [
  param('schoolId').isString().trim().isLength({ min: 1 }).withMessage('School ID is required')
], schoolController.deleteSchool.bind(schoolController));

export default router;
