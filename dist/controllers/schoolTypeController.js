"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolTypeController = void 0;
const schoolTypeService_1 = require("../services/schoolTypeService");
class SchoolTypeController {
    constructor() {
        this.schoolTypeService = new schoolTypeService_1.SchoolTypeService();
    }
    // Get all school types (including inactive)
    async getAllSchoolTypes(req, res) {
        try {
            const result = await this.schoolTypeService.getAllSchoolTypes();
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve school types',
                error: error.message
            });
        }
    }
    // Get all school types including inactive (for admin)
    async getAllSchoolTypesAdmin(req, res) {
        try {
            const result = await this.schoolTypeService.getAllSchoolTypes();
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve school types',
                error: error.message
            });
        }
    }
    // Get active school types only (for forms)
    async getActiveSchoolTypes(req, res) {
        try {
            const result = await this.schoolTypeService.getActiveSchoolTypes();
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve active school types',
                error: error.message
            });
        }
    }
    // Get school type by ID
    async getSchoolTypeById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.schoolTypeService.getSchoolTypeById(id);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve school type',
                error: error.message
            });
        }
    }
    // Create new school type
    async createSchoolType(req, res) {
        try {
            const result = await this.schoolTypeService.createSchoolType(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create school type',
                error: error.message
            });
        }
    }
    // Update school type
    async updateSchoolType(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.schoolTypeService.updateSchoolType(id, req.body);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update school type',
                error: error.message
            });
        }
    }
    // Delete school type (soft delete)
    async deleteSchoolType(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.schoolTypeService.deleteSchoolType(id);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete school type',
                error: error.message
            });
        }
    }
    // Hard delete school type (permanent)
    async hardDeleteSchoolType(req, res) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.schoolTypeService.hardDeleteSchoolType(id);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to permanently delete school type',
                error: error.message
            });
        }
    }
}
exports.SchoolTypeController = SchoolTypeController;
//# sourceMappingURL=schoolTypeController.js.map