"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementTypeController = void 0;
const managementTypeService_1 = require("../services/managementTypeService");
class ManagementTypeController {
    constructor() {
        this.managementTypeService = new managementTypeService_1.ManagementTypeService();
    }
    // Get all management types (admin view - includes active and inactive)
    async getAllManagementTypes(req, res) {
        try {
            const result = await this.managementTypeService.getAllManagementTypes();
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
    }
    // Get only active management types (for forms and public use)
    async getActiveManagementTypes(req, res) {
        try {
            const result = await this.managementTypeService.getActiveManagementTypes();
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
    }
    // Get management type by ID
    async getManagementTypeById(req, res) {
        try {
            const result = await this.managementTypeService.getManagementTypeById(parseInt(req.params.id));
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
    }
    // Create management type
    async createManagementType(req, res) {
        try {
            const result = await this.managementTypeService.createManagementType(req.body);
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
    }
    // Update management type
    async updateManagementType(req, res) {
        try {
            const result = await this.managementTypeService.updateManagementType(parseInt(req.params.id), req.body);
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
    }
    // Delete management type (soft delete)
    async deleteManagementType(req, res) {
        try {
            const result = await this.managementTypeService.deleteManagementType(parseInt(req.params.id));
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
    }
    // Hard delete management type (permanent removal)
    async hardDeleteManagementType(req, res) {
        try {
            const result = await this.managementTypeService.hardDeleteManagementType(parseInt(req.params.id));
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
    }
}
exports.ManagementTypeController = ManagementTypeController;
//# sourceMappingURL=managementTypeController.js.map