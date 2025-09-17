"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockOfficeController = void 0;
const blockOfficeService_1 = require("../services/blockOfficeService");
class BlockOfficeController {
    constructor() {
        this.blockOfficeService = new blockOfficeService_1.BlockOfficeService();
    }
    // Get all block offices (including inactive)
    async getAllBlockOffices(req, res) {
        try {
            const result = await this.blockOfficeService.getAllBlockOffices();
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
    // Get all block offices (including inactive) - duplicate endpoint
    async getAllBlockOfficesAdmin(req, res) {
        try {
            const result = await this.blockOfficeService.getAllBlockOffices();
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
    // Get active block offices only
    async getActiveBlockOffices(req, res) {
        try {
            const result = await this.blockOfficeService.getActiveBlockOffices();
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
    // Get block office by ID
    async getBlockOfficeById(req, res) {
        try {
            const result = await this.blockOfficeService.getBlockOfficeById(parseInt(req.params.id));
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
    // Create block office
    async createBlockOffice(req, res) {
        try {
            const result = await this.blockOfficeService.createBlockOffice(req.body);
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
    // Update block office
    async updateBlockOffice(req, res) {
        try {
            const result = await this.blockOfficeService.updateBlockOffice(parseInt(req.params.id), req.body);
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
    // Delete block office (soft delete)
    async deleteBlockOffice(req, res) {
        try {
            const result = await this.blockOfficeService.deleteBlockOffice(parseInt(req.params.id));
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
    // Hard delete block office (permanent removal)
    async hardDeleteBlockOffice(req, res) {
        try {
            const result = await this.blockOfficeService.hardDeleteBlockOffice(parseInt(req.params.id));
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
exports.BlockOfficeController = BlockOfficeController;
//# sourceMappingURL=blockOfficeController.js.map