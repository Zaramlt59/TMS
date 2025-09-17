"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.districtController = void 0;
const districtService_1 = require("../services/districtService");
exports.districtController = {
    // Get all active districts
    async getAllActive(req, res) {
        try {
            const districts = await districtService_1.districtService.getAllActive();
            res.json({
                success: true,
                message: 'Active districts retrieved successfully',
                data: districts
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve districts',
                error: error.message
            });
        }
    },
    // Get all districts (including inactive)
    async getAll(req, res) {
        try {
            const districts = await districtService_1.districtService.getAll();
            res.json({
                success: true,
                message: 'All districts retrieved successfully',
                data: districts
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve districts',
                error: error.message
            });
        }
    },
    // Get district by ID
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const district = await districtService_1.districtService.getById(id);
            if (!district) {
                return res.status(404).json({
                    success: false,
                    message: 'District not found'
                });
            }
            res.json({
                success: true,
                message: 'District retrieved successfully',
                data: district
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve district',
                error: error.message
            });
        }
    },
    // Create new district
    async create(req, res) {
        try {
            const { name, is_active = true } = req.body;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'District name is required'
                });
            }
            const district = await districtService_1.districtService.create({ name, is_active });
            res.status(201).json({
                success: true,
                message: 'District created successfully',
                data: district
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create district',
                error: error.message
            });
        }
    },
    // Update district
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { name, is_active } = req.body;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'District name is required'
                });
            }
            const district = await districtService_1.districtService.update(id, { name, is_active });
            res.json({
                success: true,
                message: 'District updated successfully',
                data: district
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update district',
                error: error.message
            });
        }
    },
    // Soft delete district
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const district = await districtService_1.districtService.delete(id);
            res.json({
                success: true,
                message: 'District deleted successfully',
                data: district
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete district',
                error: error.message
            });
        }
    },
    // Hard delete district
    async hardDelete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const district = await districtService_1.districtService.hardDelete(id);
            res.json({
                success: true,
                message: 'District permanently deleted',
                data: district
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete district',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=districtController.js.map