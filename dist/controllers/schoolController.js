"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolController = void 0;
const schoolService_1 = require("../services/schoolService");
exports.schoolController = {
    // Get all schools
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page || '1');
            const limit = Math.min(parseInt(req.query.limit || '20'), 100);
            // Pass role filters to the service
            const result = await schoolService_1.schoolService.getAll({
                page,
                limit,
                roleFilters: req.roleFilters
            });
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch schools',
                error: error.message
            });
        }
    },
    // Get schools by district
    async getByDistrict(req, res) {
        try {
            const { district } = req.query;
            if (!district || typeof district !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'District parameter is required'
                });
            }
            const schools = await schoolService_1.schoolService.getByDistrict(district);
            res.json({
                success: true,
                data: schools
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch schools by district',
                error: error.message
            });
        }
    },
    // Get schools by RD block
    async getByRdBlock(req, res) {
        try {
            const { rdBlock } = req.query;
            if (!rdBlock || typeof rdBlock !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'RD Block parameter is required'
                });
            }
            const schools = await schoolService_1.schoolService.getByRdBlock(rdBlock);
            res.json({
                success: true,
                data: schools
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch schools by RD block',
                error: error.message
            });
        }
    },
    // Get schools by school type
    async getBySchoolType(req, res) {
        try {
            const { schoolType } = req.query;
            if (!schoolType || typeof schoolType !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'School Type parameter is required'
                });
            }
            const schools = await schoolService_1.schoolService.getBySchoolType(schoolType);
            res.json({
                success: true,
                data: schools
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch schools by school type',
                error: error.message
            });
        }
    },
    // Get schools by management type
    async getByManagement(req, res) {
        try {
            const { management } = req.query;
            if (!management || typeof management !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Management parameter is required'
                });
            }
            const schools = await schoolService_1.schoolService.getByManagement(management);
            res.json({
                success: true,
                data: schools
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch schools by management',
                error: error.message
            });
        }
    },
    // Get schools by medium
    async getByMedium(req, res) {
        try {
            const { medium } = req.query;
            if (!medium || typeof medium !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Medium parameter is required'
                });
            }
            const schools = await schoolService_1.schoolService.getByMedium(medium);
            res.json({
                success: true,
                data: schools
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch schools by medium',
                error: error.message
            });
        }
    },
    // Get school by ID
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid school ID'
                });
            }
            const school = await schoolService_1.schoolService.getById(id);
            if (!school) {
                return res.status(404).json({
                    success: false,
                    message: 'School not found'
                });
            }
            res.json({
                success: true,
                message: 'School retrieved successfully',
                data: school
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve school',
                error: error.message
            });
        }
    },
    // Get school by school_id (business identifier)
    async getBySchoolId(req, res) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                return res.status(400).json({
                    success: false,
                    message: 'School ID parameter is required'
                });
            }
            const school = await schoolService_1.schoolService.getBySchoolId(schoolId);
            if (!school) {
                return res.status(404).json({
                    success: false,
                    message: 'School not found'
                });
            }
            res.json({
                success: true,
                message: 'School retrieved successfully',
                data: school
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve school',
                error: error.message
            });
        }
    },
    // Search schools
    async search(req, res) {
        try {
            const query = req.query.q;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }
            const schools = await schoolService_1.schoolService.search(query);
            res.json({
                success: true,
                message: 'Schools search completed successfully',
                data: schools
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to search schools',
                error: error.message
            });
        }
    },
    // Create new school
    async create(req, res) {
        try {
            const schoolData = req.body;
            if (!schoolData.school_id || !schoolData.school_name) {
                return res.status(400).json({
                    success: false,
                    message: 'School ID and name are required'
                });
            }
            const school = await schoolService_1.schoolService.create(schoolData);
            res.status(201).json({
                success: true,
                message: 'School created successfully',
                data: school
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create school',
                error: error.message
            });
        }
    },
    // Update school
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid school ID'
                });
            }
            const schoolData = req.body;
            const school = await schoolService_1.schoolService.update(id, schoolData);
            res.json({
                success: true,
                message: 'School updated successfully',
                data: school
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update school',
                error: error.message
            });
        }
    },
    // Update school by school_id (business identifier)
    async updateBySchoolId(req, res) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                return res.status(400).json({
                    success: false,
                    message: 'School ID parameter is required'
                });
            }
            const school = await schoolService_1.schoolService.updateBySchoolId(schoolId, req.body);
            res.json({
                success: true,
                message: 'School updated successfully',
                data: school
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update school',
                error: error.message
            });
        }
    },
    // Delete school (now uses safe deletion)
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid school ID'
                });
            }
            // Get school_id first
            const school = await schoolService_1.schoolService.getById(id);
            if (!school) {
                return res.status(404).json({
                    success: false,
                    message: 'School not found'
                });
            }
            // Use safe deletion
            const { cascadeService } = await Promise.resolve().then(() => __importStar(require('../services/cascadeService')));
            const force = req.query.force === 'true';
            const result = await cascadeService.safeDeleteSchool(school.school_id, force);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.message,
                    data: result.cascadeInfo
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    data: result.cascadeInfo,
                    error: result.error
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete school',
                error: error.message
            });
        }
    },
    // Delete school by school_id (business identifier) - now uses safe deletion
    async deleteBySchoolId(req, res) {
        try {
            const { schoolId } = req.params;
            if (!schoolId) {
                return res.status(400).json({
                    success: false,
                    message: 'School ID parameter is required'
                });
            }
            // Use safe deletion
            const { cascadeService } = await Promise.resolve().then(() => __importStar(require('../services/cascadeService')));
            const force = req.query.force === 'true';
            const result = await cascadeService.safeDeleteSchool(schoolId, force);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.message,
                    data: result.cascadeInfo
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    data: result.cascadeInfo,
                    error: result.error
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete school',
                error: error.message
            });
        }
    },
    // Get school statistics
    async getStats(req, res) {
        try {
            const stats = await schoolService_1.schoolService.getStats();
            res.json({
                success: true,
                message: 'School statistics retrieved successfully',
                data: stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve school statistics',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=schoolController.js.map