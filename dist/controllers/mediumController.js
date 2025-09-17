"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediumController = void 0;
const mediumService_1 = require("../services/mediumService");
class MediumController {
    constructor() {
        this.mediumService = new mediumService_1.MediumService();
    }
    // Get all mediums (including inactive)
    async getAllMediums(req, res) {
        try {
            const result = await this.mediumService.getAllMediums();
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
    // Get all mediums including inactive (for admin)
    async getAllMediumsAdmin(req, res) {
        try {
            const result = await this.mediumService.getAllMediums();
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
    // Get active mediums only (for forms)
    async getActiveMediums(req, res) {
        try {
            const result = await this.mediumService.getActiveMediums();
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
    // Get medium by ID
    async getMediumById(req, res) {
        try {
            const result = await this.mediumService.getMediumById(parseInt(req.params.id));
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
    // Create medium
    async createMedium(req, res) {
        try {
            const result = await this.mediumService.createMedium(req.body);
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
    // Update medium
    async updateMedium(req, res) {
        try {
            const result = await this.mediumService.updateMedium(parseInt(req.params.id), req.body);
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
    // Hard delete medium (permanent removal)
    async hardDeleteMedium(req, res) {
        try {
            const result = await this.mediumService.hardDeleteMedium(parseInt(req.params.id));
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
    // Delete medium (soft delete)
    async deleteMedium(req, res) {
        try {
            const result = await this.mediumService.deleteMedium(parseInt(req.params.id));
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
}
exports.MediumController = MediumController;
//# sourceMappingURL=mediumController.js.map