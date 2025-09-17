"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.villageController = void 0;
const villageService_1 = require("../services/villageService");
exports.villageController = {
    // Get all active villages
    async getAllActive(req, res) {
        try {
            const villages = await villageService_1.villageService.getAllActive();
            res.json({
                success: true,
                message: 'Active villages retrieved successfully',
                data: villages
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve villages',
                error: error.message
            });
        }
    },
    // Get all villages (including inactive)
    async getAll(req, res) {
        try {
            const villages = await villageService_1.villageService.getAll();
            res.json({
                success: true,
                message: 'All villages retrieved successfully',
                data: villages
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve villages',
                error: error.message
            });
        }
    },
    // Get villages by RD block
    async getByRdBlock(req, res) {
        try {
            const rdBlockId = parseInt(req.params.rdBlockId);
            const villages = await villageService_1.villageService.getByRdBlock(rdBlockId);
            res.json({
                success: true,
                message: 'Villages by RD block retrieved successfully',
                data: villages
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve villages by RD block',
                error: error.message
            });
        }
    },
    // Get villages by district
    async getByDistrict(req, res) {
        try {
            const districtId = parseInt(req.params.districtId);
            const villages = await villageService_1.villageService.getByDistrict(districtId);
            res.json({
                success: true,
                message: 'Villages by district retrieved successfully',
                data: villages
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve villages by district',
                error: error.message
            });
        }
    },
    // Get village by ID
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const village = await villageService_1.villageService.getById(id);
            if (!village) {
                return res.status(404).json({
                    success: false,
                    message: 'Village not found'
                });
            }
            res.json({
                success: true,
                message: 'Village retrieved successfully',
                data: village
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve village',
                error: error.message
            });
        }
    },
    // Create new village
    async create(req, res) {
        try {
            const { name, rdBlockId, isActive = true } = req.body;
            if (!name || !rdBlockId) {
                return res.status(400).json({
                    success: false,
                    message: 'Village name and RD block ID are required'
                });
            }
            const village = await villageService_1.villageService.create({ name, rdBlockId, isActive });
            res.status(201).json({
                success: true,
                message: 'Village created successfully',
                data: village
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create village',
                error: error.message
            });
        }
    },
    // Update village
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { name, rdBlockId, isActive } = req.body;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Village name is required'
                });
            }
            const village = await villageService_1.villageService.update(id, { name, rdBlockId, isActive });
            res.json({
                success: true,
                message: 'Village updated successfully',
                data: village
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update village',
                error: error.message
            });
        }
    },
    // Soft delete village
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const village = await villageService_1.villageService.delete(id);
            res.json({
                success: true,
                message: 'Village deleted successfully',
                data: village
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete village',
                error: error.message
            });
        }
    },
    // Hard delete village
    async hardDelete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const village = await villageService_1.villageService.hardDelete(id);
            res.json({
                success: true,
                message: 'Village permanently deleted',
                data: village
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete village',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=villageController.js.map