"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
const roleBasedFiltering_1 = require("../middleware/roleBasedFiltering");
exports.reportsService = {
    // Get role-specific dashboard statistics
    async getDashboardStats(userRole, roleFilters) {
        try {
            const whereClause = (0, roleBasedFiltering_1.buildRoleBasedWhereClause)(roleFilters);
            switch (userRole) {
                case 'teacher':
                    return await this.getTeacherStats(roleFilters);
                case 'hoi':
                    return await this.getHOIStats(roleFilters);
                case 'sdeo':
                    return await this.getSDEOStats(roleFilters);
                case 'deo':
                    return await this.getDEOStats(roleFilters);
                case 'admin':
                case 'super_admin':
                    return await this.getAdminStats();
                default:
                    return { success: false, message: 'Invalid user role' };
            }
        }
        catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return { success: false, message: 'Failed to fetch dashboard statistics' };
        }
    },
    // Teacher-specific statistics
    async getTeacherStats(roleFilters) {
        const schoolId = roleFilters?.school_id;
        if (!schoolId) {
            return { success: false, message: 'School ID required for teacher stats' };
        }
        const [schoolInfo, totalTeachers, totalStudents, medicalRecords, recentActivity] = await Promise.all([
            // School information
            prismaService_1.default.schools.findFirst({
                where: { school_id: schoolId },
                select: {
                    school_name: true,
                    school_type: true,
                    school_level: true,
                    management: true,
                    medium: true,
                    district: true,
                    rd_block: true
                }
            }),
            // Total teachers in school
            prismaService_1.default.teachers.count({
                where: { school_id: schoolId }
            }),
            // Estimate students (assuming average class size)
            prismaService_1.default.teachers.aggregate({
                where: { school_id: schoolId },
                _count: { id: true }
            }).then(result => result._count.id * 30), // Rough estimate
            // Medical records count
            prismaService_1.default.medical_records.count({
                where: {
                    teachers: { school_id: schoolId }
                }
            }),
            // Recent teacher activities (last 30 days)
            prismaService_1.default.teachers.count({
                where: {
                    school_id: schoolId,
                    created_at: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ]);
        return {
            success: true,
            data: {
                schoolInfo,
                stats: {
                    totalTeachers,
                    estimatedStudents: totalStudents,
                    medicalRecords,
                    recentActivity
                },
                role: 'teacher'
            }
        };
    },
    // HOI (Head of Institution) statistics
    async getHOIStats(roleFilters) {
        const schoolId = roleFilters?.school_id;
        if (!schoolId) {
            return { success: false, message: 'School ID required for HOI stats' };
        }
        const [schoolInfo, teacherStats, subjectDistribution, medicalRecords, performanceMetrics] = await Promise.all([
            // School information
            prismaService_1.default.schools.findFirst({
                where: { school_id: schoolId },
                select: {
                    school_name: true,
                    school_type: true,
                    school_level: true,
                    management: true,
                    medium: true,
                    district: true,
                    rd_block: true,
                    created_at: true
                }
            }),
            // Teacher statistics
            prismaService_1.default.teachers.groupBy({
                by: ['gender', 'social_group'],
                where: { school_id: schoolId },
                _count: { id: true }
            }),
            // Subject distribution
            prismaService_1.default.teachers.findMany({
                where: { school_id: schoolId },
                select: { subjects_taught: true }
            }).then(teachers => {
                const subjectCount = {};
                teachers.forEach(teacher => {
                    try {
                        const subjects = JSON.parse(teacher.subjects_taught);
                        subjects.forEach((subject) => {
                            subjectCount[subject] = (subjectCount[subject] || 0) + 1;
                        });
                    }
                    catch (e) {
                        // Handle non-JSON subjects_taught
                    }
                });
                return subjectCount;
            }),
            // Medical records summary
            prismaService_1.default.medical_records.groupBy({
                by: ['severity'],
                where: {
                    teachers: { school_id: schoolId }
                },
                _count: { id: true }
            }),
            // Performance metrics (recent activity)
            prismaService_1.default.teachers.count({
                where: {
                    school_id: schoolId,
                    created_at: {
                        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ]);
        return {
            success: true,
            data: {
                schoolInfo,
                teacherStats,
                subjectDistribution,
                medicalRecords,
                performanceMetrics,
                role: 'hoi'
            }
        };
    },
    // SDEO (Sub-Divisional Education Officer) statistics
    async getSDEOStats(roleFilters) {
        const rdBlock = roleFilters?.rd_block;
        if (!rdBlock) {
            return { success: false, message: 'RD Block required for SDEO stats' };
        }
        const [schoolsInBlock, teachersInBlock, districtDistribution, managementDistribution, recentActivity] = await Promise.all([
            // Schools in RD Block
            prismaService_1.default.schools.findMany({
                where: { rd_block: rdBlock },
                select: {
                    school_id: true,
                    school_name: true,
                    school_type: true,
                    management: true,
                    district: true
                }
            }),
            // Teachers in RD Block
            prismaService_1.default.teachers.groupBy({
                by: ['gender', 'social_group'],
                where: { rd_block: rdBlock },
                _count: { id: true }
            }),
            // District distribution
            prismaService_1.default.schools.groupBy({
                by: ['district'],
                where: { rd_block: rdBlock },
                _count: { id: true }
            }),
            // Management type distribution
            prismaService_1.default.schools.groupBy({
                by: ['management'],
                where: { rd_block: rdBlock },
                _count: { id: true }
            }),
            // Recent activity (last 30 days)
            prismaService_1.default.teachers.count({
                where: {
                    rd_block: rdBlock,
                    created_at: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ]);
        return {
            success: true,
            data: {
                schoolsInBlock,
                teachersInBlock,
                districtDistribution,
                managementDistribution,
                recentActivity,
                role: 'sdeo'
            }
        };
    },
    // DEO (District Education Officer) statistics
    async getDEOStats(roleFilters) {
        const district = roleFilters?.district;
        if (!district) {
            return { success: false, message: 'District required for DEO stats' };
        }
        const [schoolsInDistrict, teachersInDistrict, rdBlockDistribution, managementDistribution, performanceMetrics] = await Promise.all([
            // Schools in district
            prismaService_1.default.schools.findMany({
                where: { district: district },
                select: {
                    school_id: true,
                    school_name: true,
                    school_type: true,
                    management: true,
                    rd_block: true
                }
            }),
            // Teachers in district
            prismaService_1.default.teachers.groupBy({
                by: ['gender', 'social_group'],
                where: { district: district },
                _count: { id: true }
            }),
            // RD Block distribution
            prismaService_1.default.schools.groupBy({
                by: ['rd_block'],
                where: { district: district },
                _count: { id: true }
            }),
            // Management type distribution
            prismaService_1.default.schools.groupBy({
                by: ['management'],
                where: { district: district },
                _count: { id: true }
            }),
            // Performance metrics
            prismaService_1.default.teachers.count({
                where: {
                    district: district,
                    created_at: {
                        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ]);
        return {
            success: true,
            data: {
                schoolsInDistrict,
                teachersInDistrict,
                rdBlockDistribution,
                managementDistribution,
                performanceMetrics,
                role: 'deo'
            }
        };
    },
    // Admin/Super Admin statistics
    async getAdminStats() {
        const [totalSchools, totalTeachers, totalDistricts, totalRdBlocks, managementDistribution, districtDistribution, recentActivity] = await Promise.all([
            // Total schools
            prismaService_1.default.schools.count(),
            // Total teachers
            prismaService_1.default.teachers.count(),
            // Total districts
            prismaService_1.default.schools.groupBy({
                by: ['district'],
                _count: { id: true }
            }),
            // Total RD Blocks
            prismaService_1.default.schools.groupBy({
                by: ['rd_block'],
                _count: { id: true }
            }),
            // Management type distribution
            prismaService_1.default.schools.groupBy({
                by: ['management'],
                _count: { id: true }
            }),
            // District distribution
            prismaService_1.default.schools.groupBy({
                by: ['district'],
                _count: { id: true }
            }),
            // Recent activity (last 30 days)
            prismaService_1.default.teachers.count({
                where: {
                    created_at: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            })
        ]);
        return {
            success: true,
            data: {
                totalSchools,
                totalTeachers,
                totalDistricts: totalDistricts.length,
                totalRdBlocks: totalRdBlocks.length,
                managementDistribution,
                districtDistribution,
                recentActivity,
                role: 'admin'
            }
        };
    },
    // Export data based on role
    async exportData(userRole, roleFilters, format = 'excel') {
        try {
            const whereClause = (0, roleBasedFiltering_1.buildRoleBasedWhereClause)(roleFilters);
            switch (userRole) {
                case 'teacher':
                    return await this.exportTeacherData(roleFilters, format);
                case 'hoi':
                    return await this.exportSchoolData(roleFilters, format);
                case 'sdeo':
                    return await this.exportRdBlockData(roleFilters, format);
                case 'deo':
                    return await this.exportDistrictData(roleFilters, format);
                case 'admin':
                case 'super_admin':
                    return await this.exportAllData(format);
                default:
                    return { success: false, message: 'Invalid user role' };
            }
        }
        catch (error) {
            console.error('Error exporting data:', error);
            return { success: false, message: 'Failed to export data' };
        }
    },
    // Export teacher data
    async exportTeacherData(roleFilters, format = 'excel') {
        const schoolId = roleFilters?.school_id;
        if (!schoolId) {
            return { success: false, message: 'School ID required for teacher export' };
        }
        const teachers = await prismaService_1.default.teachers.findMany({
            where: { school_id: schoolId },
            select: {
                teacher_name: true,
                date_of_birth: true,
                joining_date: true,
                phone_number: true,
                email: true,
                social_group: true,
                religion: true,
                gender: true,
                subjects_taught: true,
                classes_taught: true,
                current_school_name: true,
                district: true,
                rd_block: true
            }
        });
        return {
            success: true,
            data: teachers,
            format,
            filename: `teachers_school_${schoolId}_${new Date().toISOString().split('T')[0]}.${format}`
        };
    },
    // Export school data
    async exportSchoolData(roleFilters, format = 'excel') {
        const schoolId = roleFilters?.school_id;
        if (!schoolId) {
            return { success: false, message: 'School ID required for school export' };
        }
        const [school, teachers] = await Promise.all([
            prismaService_1.default.schools.findFirst({
                where: { school_id: schoolId }
            }),
            prismaService_1.default.teachers.findMany({
                where: { school_id: schoolId },
                select: {
                    teacher_name: true,
                    subjects_taught: true,
                    classes_taught: true,
                    gender: true,
                    social_group: true
                }
            })
        ]);
        return {
            success: true,
            data: { school, teachers },
            format,
            filename: `school_${schoolId}_${new Date().toISOString().split('T')[0]}.${format}`
        };
    },
    // Export RD Block data
    async exportRdBlockData(roleFilters, format = 'excel') {
        const rdBlock = roleFilters?.rd_block;
        if (!rdBlock) {
            return { success: false, message: 'RD Block required for export' };
        }
        const [schools, teachers] = await Promise.all([
            prismaService_1.default.schools.findMany({
                where: { rd_block: rdBlock }
            }),
            prismaService_1.default.teachers.findMany({
                where: { rd_block: rdBlock },
                select: {
                    teacher_name: true,
                    current_school_name: true,
                    subjects_taught: true,
                    gender: true,
                    social_group: true,
                    district: true
                }
            })
        ]);
        return {
            success: true,
            data: { schools, teachers },
            format,
            filename: `rd_block_${rdBlock.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`
        };
    },
    // Export district data
    async exportDistrictData(roleFilters, format = 'excel') {
        const district = roleFilters?.district;
        if (!district) {
            return { success: false, message: 'District required for export' };
        }
        const [schools, teachers] = await Promise.all([
            prismaService_1.default.schools.findMany({
                where: { district: district }
            }),
            prismaService_1.default.teachers.findMany({
                where: { district: district },
                select: {
                    teacher_name: true,
                    current_school_name: true,
                    subjects_taught: true,
                    gender: true,
                    social_group: true,
                    rd_block: true
                }
            })
        ]);
        return {
            success: true,
            data: { schools, teachers },
            format,
            filename: `district_${district.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`
        };
    },
    // Export all data (admin only)
    async exportAllData(format = 'excel') {
        const [schools, teachers] = await Promise.all([
            prismaService_1.default.schools.findMany(),
            prismaService_1.default.teachers.findMany({
                select: {
                    teacher_name: true,
                    current_school_name: true,
                    subjects_taught: true,
                    gender: true,
                    social_group: true,
                    district: true,
                    rd_block: true
                }
            })
        ]);
        return {
            success: true,
            data: { schools, teachers },
            format,
            filename: `complete_data_${new Date().toISOString().split('T')[0]}.${format}`
        };
    },
    // Get teacher details
    async getTeacherDetails(teacherId) {
        try {
            const teacher = await prismaService_1.default.teachers.findUnique({
                where: { id: teacherId },
                include: {
                    schools: true,
                    medical_records: true
                }
            });
            if (!teacher) {
                return { success: false, message: 'Teacher not found' };
            }
            return {
                success: true,
                message: 'Teacher details retrieved successfully',
                data: teacher
            };
        }
        catch (error) {
            console.error('Error fetching teacher details:', error);
            return { success: false, message: 'Failed to fetch teacher details' };
        }
    },
    // Get school details
    async getSchoolDetails(schoolId) {
        try {
            const school = await prismaService_1.default.schools.findUnique({
                where: { school_id: schoolId },
                include: {
                    teachers: true
                }
            });
            if (!school) {
                return { success: false, message: 'School not found' };
            }
            return {
                success: true,
                message: 'School details retrieved successfully',
                data: school
            };
        }
        catch (error) {
            console.error('Error fetching school details:', error);
            return { success: false, message: 'Failed to fetch school details' };
        }
    },
    // Get district details
    async getDistrictDetails(district) {
        try {
            const districtData = await prismaService_1.default.teachers.findMany({
                where: { district },
                include: {
                    schools: true
                }
            });
            const schools = await prismaService_1.default.schools.findMany({
                where: { district }
            });
            return {
                success: true,
                message: 'District details retrieved successfully',
                data: {
                    district,
                    teachers: districtData,
                    schools,
                    totalTeachers: districtData.length,
                    totalSchools: schools.length
                }
            };
        }
        catch (error) {
            console.error('Error fetching district details:', error);
            return { success: false, message: 'Failed to fetch district details' };
        }
    }
};
//# sourceMappingURL=reportsService.js.map