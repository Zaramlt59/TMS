"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferApplicationController = void 0;
const transferApplicationService_1 = require("../services/transferApplicationService");
exports.transferApplicationController = {
    // Get all transfer applications
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page || '1');
            const limit = Math.min(parseInt(req.query.limit || '20'), 100);
            const status = req.query.status;
            const district = req.query.district;
            const result = await transferApplicationService_1.transferApplicationService.getAll({
                page,
                limit,
                status,
                district,
                ...req.roleFilters
            });
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch transfer applications',
                error: error.message
            });
        }
    },
    // Get transfer application by ID
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await transferApplicationService_1.transferApplicationService.getById(id);
            res.json(result);
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || 'Transfer application not found'
            });
        }
    },
    // Create new transfer application
    async create(req, res) {
        try {
            const result = await transferApplicationService_1.transferApplicationService.create(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create transfer application'
            });
        }
    },
    // Update transfer application status (admin only)
    async updateStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { status, review_notes, reviewed_by } = req.body;
            if (!status || !['pending', 'under_review', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be one of: pending, under_review, approved, rejected'
                });
            }
            const result = await transferApplicationService_1.transferApplicationService.updateStatus(id, status, review_notes, reviewed_by);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to update transfer application status'
            });
        }
    },
    // Get transfer applications by teacher
    async getByTeacher(req, res) {
        try {
            const teacherId = parseInt(req.params.teacherId);
            const result = await transferApplicationService_1.transferApplicationService.getByTeacher(teacherId);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch teacher transfer applications',
                error: error.message
            });
        }
    },
    // Get statistics
    async getStats(req, res) {
        try {
            const result = await transferApplicationService_1.transferApplicationService.getStats();
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch transfer application statistics',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=transferApplicationController.js.map