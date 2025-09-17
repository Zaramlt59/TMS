"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectController = void 0;
const subjectService_1 = require("../services/subjectService");
exports.subjectController = {
    // Get all subjects
    async getAll(req, res) {
        try {
            const subjects = await subjectService_1.subjectService.getAll();
            res.json({
                success: true,
                message: 'Subjects retrieved successfully',
                data: subjects
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve subjects',
                error: error.message
            });
        }
    },
    // Get subject by ID
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const subject = await subjectService_1.subjectService.getById(id);
            if (!subject) {
                return res.status(404).json({
                    success: false,
                    message: 'Subject not found'
                });
            }
            res.json({
                success: true,
                message: 'Subject retrieved successfully',
                data: subject
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve subject',
                error: error.message
            });
        }
    },
    // Get subject by code
    async getByCode(req, res) {
        try {
            const { code } = req.query;
            if (!code || typeof code !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Subject code is required'
                });
            }
            const subject = await subjectService_1.subjectService.getByCode(code);
            if (!subject) {
                return res.status(404).json({
                    success: false,
                    message: 'Subject not found'
                });
            }
            res.json({
                success: true,
                message: 'Subject retrieved successfully',
                data: subject
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve subject',
                error: error.message
            });
        }
    },
    // Create new subject
    async create(req, res) {
        try {
            const { name, code, classes } = req.body;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Subject name is required'
                });
            }
            const subject = await subjectService_1.subjectService.create({ name, code, classes });
            res.status(201).json({
                success: true,
                message: 'Subject created successfully',
                data: subject
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create subject',
                error: error.message
            });
        }
    },
    // Update subject
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { name, code, classes } = req.body;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Subject name is required'
                });
            }
            const subject = await subjectService_1.subjectService.update(id, { name, code, classes });
            res.json({
                success: true,
                message: 'Subject updated successfully',
                data: subject
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update subject',
                error: error.message
            });
        }
    },
    // Delete subject
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const subject = await subjectService_1.subjectService.delete(id);
            res.json({
                success: true,
                message: 'Subject deleted successfully',
                data: subject
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete subject',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=subjectController.js.map