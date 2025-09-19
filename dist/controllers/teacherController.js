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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherController = void 0;
const teacherService_1 = require("../services/teacherService");
const prismaService_1 = __importDefault(require("../services/prismaService"));
exports.teacherController = {
    // Get all teachers
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page || '1');
            const limit = Math.min(parseInt(req.query.limit || '20'), 100);
            // Pass role filters to the service
            const result = await teacherService_1.teacherService.getAll({
                page,
                limit,
                roleFilters: req.roleFilters
            });
            res.json(result);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch teachers',
                error: error.message
            });
        }
    },
    // Get teachers by district
    async getByDistrict(req, res) {
        try {
            const { district } = req.query;
            if (!district || typeof district !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'District parameter is required'
                });
            }
            const teachers = await teacherService_1.teacherService.getByDistrict(district);
            res.json({
                success: true,
                data: teachers
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch teachers by district',
                error: error.message
            });
        }
    },
    // Get teachers by school
    async getBySchool(req, res) {
        try {
            const { schoolId } = req.query;
            if (!schoolId || typeof schoolId !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'School ID parameter is required'
                });
            }
            const teachers = await teacherService_1.teacherService.getBySchool(schoolId);
            res.json({
                success: true,
                data: teachers
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch teachers by school',
                error: error.message
            });
        }
    },
    // Get teachers by subject
    async getBySubject(req, res) {
        try {
            const subject = req.params.subject;
            const teachers = await teacherService_1.teacherService.getBySubject(subject);
            res.json({
                success: true,
                message: 'Teachers by subject retrieved successfully',
                data: teachers
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve teachers by subject',
                error: error.message
            });
        }
    },
    // Get teacher by ID
    async getById(req, res) {
        try {
            const idParam = req.params.id;
            // Convert teacher_ID to database id if needed
            let id = parseInt(idParam);
            if (isNaN(id)) {
                // If idParam is a teacher_ID (string), find the corresponding database id
                const teacher = await prismaService_1.default.teachers.findFirst({
                    where: { teacher_ID: idParam },
                    select: { id: true }
                });
                if (!teacher) {
                    return res.status(404).json({
                        success: false,
                        message: 'Teacher not found with the provided Teacher ID'
                    });
                }
                id = teacher.id;
            }
            const teacher = await teacherService_1.teacherService.getById(id);
            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher not found'
                });
            }
            res.json({
                success: true,
                message: 'Teacher retrieved successfully',
                data: teacher
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve teacher',
                error: error.message
            });
        }
    },
    // Search teachers
    async search(req, res) {
        try {
            const query = req.query.q;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }
            const teachers = await teacherService_1.teacherService.search(query);
            res.json({
                success: true,
                message: 'Teachers search completed successfully',
                data: teachers
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to search teachers',
                error: error.message
            });
        }
    },
    // Create new teacher
    async create(req, res) {
        try {
            const teacherData = req.body;
            if (!teacherData.teacher_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Teacher name is required'
                });
            }
            // Validate teacher_ID - if provided, it must be non-empty and unique
            if (teacherData.teacher_ID !== undefined && teacherData.teacher_ID !== null) {
                if (typeof teacherData.teacher_ID === 'string' && teacherData.teacher_ID.trim() === '') {
                    // Convert empty string to null to avoid unique constraint issues
                    teacherData.teacher_ID = null;
                }
                else if (teacherData.teacher_ID && typeof teacherData.teacher_ID === 'string') {
                    // Check if teacher_ID already exists
                    const existingTeacher = await prismaService_1.default.teachers.findFirst({
                        where: { teacher_ID: teacherData.teacher_ID }
                    });
                    if (existingTeacher) {
                        return res.status(400).json({
                            success: false,
                            message: 'Teacher ID already exists. Please use a different Teacher ID.'
                        });
                    }
                }
            }
            else {
                // If teacher_ID is undefined, set it to null
                teacherData.teacher_ID = null;
            }
            const teacher = await teacherService_1.teacherService.create(teacherData);
            res.status(201).json({
                success: true,
                message: 'Teacher created successfully',
                data: teacher
            });
        }
        catch (error) {
            console.error('Teacher creation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create teacher',
                error: error.message
            });
        }
    },
    // Update teacher
    async update(req, res) {
        try {
            const idParam = req.params.id;
            // Convert teacher_ID to database id if needed
            let id = parseInt(idParam);
            if (isNaN(id)) {
                // If idParam is a teacher_ID (string), find the corresponding database id
                const teacher = await prismaService_1.default.teachers.findFirst({
                    where: { teacher_ID: idParam },
                    select: { id: true }
                });
                if (!teacher) {
                    return res.status(404).json({
                        success: false,
                        message: 'Teacher not found with the provided Teacher ID'
                    });
                }
                id = teacher.id;
            }
            const teacherData = req.body;
            // Validate teacher_ID - if provided, it must be non-empty and unique
            if (teacherData.teacher_ID !== undefined && teacherData.teacher_ID !== null) {
                if (typeof teacherData.teacher_ID === 'string' && teacherData.teacher_ID.trim() === '') {
                    // Convert empty string to null to avoid unique constraint issues
                    teacherData.teacher_ID = null;
                }
                else if (teacherData.teacher_ID && typeof teacherData.teacher_ID === 'string') {
                    // Check if teacher_ID already exists (excluding current teacher)
                    const existingTeacher = await prismaService_1.default.teachers.findFirst({
                        where: {
                            teacher_ID: teacherData.teacher_ID,
                            id: { not: id }
                        }
                    });
                    if (existingTeacher) {
                        return res.status(400).json({
                            success: false,
                            message: 'Teacher ID already exists. Please use a different Teacher ID.'
                        });
                    }
                }
            }
            else {
                // If teacher_ID is undefined, set it to null
                teacherData.teacher_ID = null;
            }
            const teacher = await teacherService_1.teacherService.update(id, teacherData);
            res.json({
                success: true,
                message: 'Teacher updated successfully',
                data: teacher
            });
        }
        catch (error) {
            console.error('Teacher update error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update teacher',
                error: error.message
            });
        }
    },
    // Delete teacher (now uses safe deletion)
    async delete(req, res) {
        try {
            const idParam = req.params.id;
            console.log('🔍 Teacher delete - idParam:', idParam);
            // Convert teacher_ID to database id if needed
            let id = parseInt(idParam);
            if (isNaN(id)) {
                // If idParam is a teacher_ID (string), find the corresponding database id
                console.log('🔍 Teacher delete - looking up teacher_ID:', idParam);
                const teacher = await prismaService_1.default.teachers.findFirst({
                    where: {
                        teacher_ID: idParam,
                        deleted_at: null
                    },
                    select: { id: true }
                });
                console.log('🔍 Teacher delete - found teacher:', teacher);
                if (!teacher) {
                    // Check if teacher exists but is already soft-deleted
                    const deletedTeacher = await prismaService_1.default.teachers.findFirst({
                        where: {
                            teacher_ID: idParam,
                            deleted_at: { not: null }
                        },
                        select: { id: true, deleted_at: true }
                    });
                    if (deletedTeacher) {
                        return res.status(400).json({
                            success: false,
                            message: 'Teacher has already been deleted'
                        });
                    }
                    return res.status(404).json({
                        success: false,
                        message: 'Teacher not found with the provided Teacher ID'
                    });
                }
                id = teacher.id;
            }
            else {
                // If it's a numeric ID, check if the teacher exists and is not soft-deleted
                const teacher = await prismaService_1.default.teachers.findFirst({
                    where: {
                        id: id,
                        deleted_at: null
                    },
                    select: { id: true }
                });
                if (!teacher) {
                    // Check if teacher exists but is already soft-deleted
                    const deletedTeacher = await prismaService_1.default.teachers.findFirst({
                        where: {
                            id: id,
                            deleted_at: { not: null }
                        },
                        select: { id: true, deleted_at: true }
                    });
                    if (deletedTeacher) {
                        return res.status(400).json({
                            success: false,
                            message: 'Teacher has already been deleted'
                        });
                    }
                    return res.status(404).json({
                        success: false,
                        message: 'Teacher not found'
                    });
                }
            }
            console.log('🔍 Teacher delete - using database id:', id);
            // Use safe deletion
            const { cascadeService } = await Promise.resolve().then(() => __importStar(require('../services/cascadeService')));
            const force = req.query.force === 'true';
            const result = await cascadeService.safeDeleteTeacher(id, force);
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
                message: 'Failed to delete teacher',
                error: error.message
            });
        }
    },
    // Get teacher statistics
    async getStats(req, res) {
        try {
            const stats = await teacherService_1.teacherService.getStats();
            res.json({
                success: true,
                message: 'Teacher statistics retrieved successfully',
                data: stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve teacher statistics',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=teacherController.js.map