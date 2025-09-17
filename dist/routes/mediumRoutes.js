"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const mediumService_1 = require("../services/mediumService");
const router = (0, express_1.Router)();
const mediumService = new mediumService_1.MediumService();
// Get all mediums (including inactive)
router.get('/', async (req, res) => {
    try {
        const result = await mediumService.getAllMediums();
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Get all mediums including inactive (for admin)
router.get('/all', async (req, res) => {
    try {
        const result = await mediumService.getAllMediums();
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Get active mediums only (for forms)
router.get('/active', async (req, res) => {
    try {
        const result = await mediumService.getActiveMediums();
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Get medium by ID
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Medium ID must be a positive integer')
], async (req, res) => {
    try {
        const result = await mediumService.getMediumById(parseInt(req.params.id));
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Create medium
router.post('/', [
    (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Medium name is required')
], async (req, res) => {
    try {
        const result = await mediumService.createMedium(req.body);
        if (result.success) {
            res.status(201).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Update medium
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Medium ID must be a positive integer'),
    (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Medium name is required'),
    (0, express_validator_1.body)('is_active').optional().isBoolean().withMessage('is_active must be a boolean')
], async (req, res) => {
    try {
        const result = await mediumService.updateMedium(parseInt(req.params.id), req.body);
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Hard delete medium (permanent removal)
router.delete('/:id/permanent', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Medium ID must be a positive integer')
], async (req, res) => {
    try {
        const result = await mediumService.hardDeleteMedium(parseInt(req.params.id));
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
// Delete medium (soft delete)
router.delete('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Medium ID must be a positive integer')
], async (req, res) => {
    try {
        const result = await mediumService.deleteMedium(parseInt(req.params.id));
        if (result.success) {
            res.json(result);
        }
        else {
            res.status(404).json(result);
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=mediumRoutes.js.map