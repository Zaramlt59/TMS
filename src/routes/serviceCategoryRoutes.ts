import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { ServiceCategoryController } from '../controllers/serviceCategoryController';

const router = Router();
const controller = new ServiceCategoryController();

const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  next();
};

router.get('/', controller.getAll.bind(controller));
router.get('/active', controller.getActive.bind(controller));
router.get('/:id', [param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')], handleValidationErrors, controller.getById.bind(controller));

router.post('/', [body('name').isString().trim().isLength({ min: 1 }).withMessage('Name is required'), body('is_active').optional().isBoolean()], handleValidationErrors, controller.create.bind(controller));

router.put('/:id', [param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'), body('name').isString().trim().isLength({ min: 1 }).withMessage('Name is required'), body('is_active').optional().isBoolean()], handleValidationErrors, controller.update.bind(controller));

router.delete('/:id', [param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')], handleValidationErrors, controller.delete.bind(controller));
router.delete('/:id/permanent', [param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')], handleValidationErrors, controller.hardDelete.bind(controller));

export default router;


