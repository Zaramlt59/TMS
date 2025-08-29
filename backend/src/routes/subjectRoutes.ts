import express from 'express';
import { SubjectController } from '../controllers/subjectController';

const router = express.Router();
const subjectController = new SubjectController();

// Get all subjects
router.get('/', subjectController.getAllSubjects.bind(subjectController));

// Get subject by ID
router.get('/:id', subjectController.getSubjectById.bind(subjectController));

// Create new subject
router.post('/', subjectController.createSubject.bind(subjectController));

// Update subject
router.put('/:id', subjectController.updateSubject.bind(subjectController));

// Delete subject
router.delete('/:id', subjectController.deleteSubject.bind(subjectController));

export default router;
