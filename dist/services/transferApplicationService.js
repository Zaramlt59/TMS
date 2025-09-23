"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferApplicationService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
exports.transferApplicationService = {
    // Get all transfer applications with optional filtering
    async getAll(filters = {}) {
        try {
            const page = filters.page || 1;
            const limit = Math.min(filters.limit || 20, 100);
            const skip = (page - 1) * limit;
            const where = {};
            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.district) {
                where.current_district = filters.district;
            }
            if (filters.teacher_id) {
                where.teacher_id = filters.teacher_id;
            }
            const [applications, total] = await Promise.all([
                prismaService_1.default.teacher_transfer_applications.findMany({
                    where,
                    include: {
                        preferred_schools: {
                            orderBy: { priority: 'asc' }
                        },
                        teachers: {
                            select: {
                                id: true,
                                teacher_name: true,
                                teacher_ID: true,
                                phone_number: true,
                                email: true
                            }
                        }
                    },
                    orderBy: { applied_date: 'desc' },
                    skip,
                    take: limit
                }),
                prismaService_1.default.teacher_transfer_applications.count({ where })
            ]);
            return {
                success: true,
                data: applications,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        }
        catch (error) {
            console.error('Error fetching transfer applications:', error);
            throw new Error('Failed to fetch transfer applications');
        }
    },
    // Get transfer application by ID
    async getById(id) {
        try {
            const application = await prismaService_1.default.teacher_transfer_applications.findUnique({
                where: { id },
                include: {
                    preferred_schools: {
                        orderBy: { priority: 'asc' }
                    },
                    teachers: {
                        select: {
                            id: true,
                            teacher_name: true,
                            teacher_ID: true,
                            phone_number: true,
                            email: true,
                            current_school_name: true,
                            district: true,
                            rd_block: true
                        }
                    }
                }
            });
            if (!application) {
                throw new Error('Transfer application not found');
            }
            return {
                success: true,
                data: application
            };
        }
        catch (error) {
            console.error('Error fetching transfer application:', error);
            throw new Error('Failed to fetch transfer application');
        }
    },
    // Create new transfer application
    async create(data) {
        try {
            const { preferred_schools, ...applicationData } = data;
            // Validate that teacher exists
            const teacher = await prismaService_1.default.teachers.findUnique({
                where: { id: applicationData.teacher_id },
                select: {
                    id: true,
                    teacher_name: true,
                    teacher_ID: true,
                    school_id: true,
                    current_school_name: true,
                    district: true,
                    rd_block: true
                }
            });
            if (!teacher) {
                throw new Error('Teacher not found');
            }
            // Check if teacher already has a pending application
            const existingApplication = await prismaService_1.default.teacher_transfer_applications.findFirst({
                where: {
                    teacher_id: applicationData.teacher_id,
                    status: { in: ['pending', 'under_review'] }
                }
            });
            if (existingApplication) {
                throw new Error('Teacher already has a pending transfer application');
            }
            // Create the application
            const application = await prismaService_1.default.teacher_transfer_applications.create({
                data: {
                    ...applicationData,
                    teacher_name: teacher.teacher_name,
                    teacher_identifier: teacher.teacher_ID,
                    current_school_id: teacher.school_id,
                    current_school_name: teacher.current_school_name,
                    current_district: teacher.district || '',
                    current_rd_block: teacher.rd_block,
                    preferred_schools: {
                        create: preferred_schools.map((school, index) => ({
                            school_id: school.school_id,
                            school_name: school.school_name,
                            district: school.district,
                            rd_block: school.rd_block,
                            priority: index + 1,
                            reason: school.reason
                        }))
                    }
                },
                include: {
                    preferred_schools: {
                        orderBy: { priority: 'asc' }
                    }
                }
            });
            return {
                success: true,
                message: 'Transfer application submitted successfully',
                data: application
            };
        }
        catch (error) {
            console.error('Error creating transfer application:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to create transfer application');
        }
    },
    // Update transfer application status (admin only)
    async updateStatus(id, status, reviewNotes, reviewedBy) {
        try {
            const application = await prismaService_1.default.teacher_transfer_applications.findUnique({
                where: { id }
            });
            if (!application) {
                throw new Error('Transfer application not found');
            }
            const updatedApplication = await prismaService_1.default.teacher_transfer_applications.update({
                where: { id },
                data: {
                    status: status,
                    review_notes: reviewNotes,
                    reviewed_by: reviewedBy,
                    reviewed_date: new Date()
                },
                include: {
                    preferred_schools: {
                        orderBy: { priority: 'asc' }
                    },
                    teachers: {
                        select: {
                            id: true,
                            teacher_name: true,
                            teacher_ID: true,
                            phone_number: true,
                            email: true
                        }
                    }
                }
            });
            return {
                success: true,
                message: 'Transfer application status updated successfully',
                data: updatedApplication
            };
        }
        catch (error) {
            console.error('Error updating transfer application status:', error);
            throw new Error('Failed to update transfer application status');
        }
    },
    // Get transfer applications by teacher
    async getByTeacher(teacherId) {
        try {
            const applications = await prismaService_1.default.teacher_transfer_applications.findMany({
                where: { teacher_id: teacherId },
                include: {
                    preferred_schools: {
                        orderBy: { priority: 'asc' }
                    }
                },
                orderBy: { applied_date: 'desc' }
            });
            return {
                success: true,
                data: applications
            };
        }
        catch (error) {
            console.error('Error fetching teacher transfer applications:', error);
            throw new Error('Failed to fetch teacher transfer applications');
        }
    },
    // Get statistics
    async getStats() {
        try {
            const [total, pending, approved, rejected, underReview] = await Promise.all([
                prismaService_1.default.teacher_transfer_applications.count(),
                prismaService_1.default.teacher_transfer_applications.count({ where: { status: 'pending' } }),
                prismaService_1.default.teacher_transfer_applications.count({ where: { status: 'approved' } }),
                prismaService_1.default.teacher_transfer_applications.count({ where: { status: 'rejected' } }),
                prismaService_1.default.teacher_transfer_applications.count({ where: { status: 'under_review' } })
            ]);
            return {
                success: true,
                data: {
                    total,
                    pending,
                    approved,
                    rejected,
                    underReview
                }
            };
        }
        catch (error) {
            console.error('Error fetching transfer application stats:', error);
            throw new Error('Failed to fetch transfer application statistics');
        }
    }
};
//# sourceMappingURL=transferApplicationService.js.map