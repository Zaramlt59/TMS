import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { TeacherController } from '../controllers/teacherController';

const router = Router();
const teacherController = new TeacherController();

// Validation middleware
const validateTeacherData = [
  body('teacher_name').isString().trim().isLength({ min: 1 }).withMessage('Teacher name is required'),
  body('date_of_birth').isISO8601().withMessage('Valid date of birth is required'),
  body('joining_date').isISO8601().withMessage('Valid joining date is required'),
  body('phone_number').optional().isString().trim().isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits'),
  body('social_group').isIn(['ST', 'SC', 'OBC', 'General']).withMessage('Valid social group is required'),
  body('religion').isIn(['Hindu', 'Islam', 'Christian', 'Sikh', 'Buddhist', 'Jain']).withMessage('Valid religion is required'),
  body('gender').isIn(['Male', 'Female', 'Others']).withMessage('Valid gender is required'),
  body('aadhaar_number').optional().isString().trim().isLength({ min: 12, max: 12 }).withMessage('Aadhaar number must be exactly 12 digits'),
  body('area_village').optional().isString().trim(),
  body('subjects_taught').isArray({ min: 1 }).withMessage('At least one subject is required'),
  body('subjects_taught.*').isIn(['Maths', 'Mizo', 'English', 'Social Science', 'Science', 'Hindi', 'W.E']).withMessage('Invalid subject'),
  body('classes_taught').isArray({ min: 1 }).withMessage('At least one class is required'),
  body('classes_taught.*').matches(/^Class \d{1,2}$/).withMessage('Invalid class format'),
  body('school_id').isString().trim().isLength({ min: 1 }).withMessage('School ID is required'),
  body('current_school_name').isString().trim().isLength({ min: 1 }).withMessage('Current school name is required'),
  body('school_level').isString().trim().isLength({ min: 1 }).withMessage('School level is required'),
  body('management').isIn(['Adhoc Aided', 'Central', 'Council Aided', 'Deficit', 'Deficit Mission', 'Government', 'Local Body', 'Lumpsum Aided', 'Private', 'Samagra']).withMessage('Invalid management type'),
  body('medium').isIn(['Bengali', 'Chakma', 'English', 'Hindi', 'Mizo', 'Nepali']).withMessage('Invalid medium'),
  body('habitation').optional().isString().trim(),
  body('pincode').optional().isString().trim(),
  body('district').optional().isString().trim(),
  body('rd_block').optional().isString().trim(),
  body('school_phone').optional().isString().trim(),
  body('habitation_class').optional().isIn(['Rural', 'Urban']).withMessage('Invalid habitation class'),
  body('habitation_category').optional().isIn(['City', 'Town', 'Village']).withMessage('Invalid habitation category'),
  body('block_office').isIn(['DEO Aizawl', 'DEO Champhai', 'DEO Hnahthial', 'DEO Khawzawl', 'DEO Kolasib', 'DEO Lawngtlai', 'DEO Lunglei', 'DEO Mamit', 'DEO Saitual', 'DEO Serchhip', 'DEO Siaha', 'Education Office(CADC)', 'Education Office (LADC)', 'Education Office (MADC)', 'SDEO Aizawl East', 'SDEO Aizawl South', 'SDEO Aizawl West', 'SDEO Champhai', 'SDEO Darlawn', 'SDEO Hnahthial', 'SDEO Kawnpui', 'SDEO Kawrthah', 'SDEO Khawzawl', 'SDEO Kolasib', 'SDEO Lunglei North', 'SDEO Lunglei South', 'SDEO Lungsen', 'SDEO Mamit', 'SDEO North Vanlaiphai', 'SDEO Saitual', 'SDEO Serchhip', 'SDEO Thenzawl', 'SDEO West Phaileng']).withMessage('Invalid block office')
];

// Create teacher
router.post('/', validateTeacherData, teacherController.createTeacher.bind(teacherController));

// Get all teachers with pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], teacherController.getAllTeachers.bind(teacherController));

// Search teachers
router.get('/search', [
  query('q').isString().trim().isLength({ min: 1 }).withMessage('Search query is required')
], teacherController.searchTeachers.bind(teacherController));

// Get teachers by school
router.get('/school/:schoolId', [
  param('schoolId').isString().trim().isLength({ min: 1 }).withMessage('School ID is required')
], teacherController.getTeachersBySchool.bind(teacherController));

// Get teacher by ID
router.get('/:teacherId', [
  param('teacherId').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], teacherController.getTeacherById.bind(teacherController));

// Update teacher
router.put('/:teacherId', [
  param('teacherId').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], teacherController.updateTeacher.bind(teacherController));

// Delete teacher
router.delete('/:teacherId', [
  param('teacherId').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], teacherController.deleteTeacher.bind(teacherController));

export default router;
