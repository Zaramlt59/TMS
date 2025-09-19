"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cascadeService = exports.CascadeService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
class CascadeService {
    /**
     * Check what will be cascade deleted when deleting a school
     */
    async getSchoolCascadeInfo(schoolId) {
        const [teachers, medicalRecords, attachments, deputations, postingHistories] = await Promise.all([
            prismaService_1.default.teachers.count({ where: { school_id: schoolId, deleted_at: null } }),
            prismaService_1.default.medical_records.count({
                where: {
                    teachers: { school_id: schoolId, deleted_at: null }
                }
            }),
            prismaService_1.default.attachments.count({
                where: {
                    teachers: { school_id: schoolId, deleted_at: null }
                }
            }),
            prismaService_1.default.deputations.count({
                where: {
                    teachers: { school_id: schoolId, deleted_at: null }
                }
            }),
            prismaService_1.default.posting_histories.count({
                where: {
                    teachers: { school_id: schoolId, deleted_at: null }
                }
            })
        ]);
        return {
            teachers,
            medicalRecords,
            attachments,
            deputations,
            postingHistories
        };
    }
    /**
     * Check what will be cascade deleted when deleting a teacher
     */
    async getTeacherCascadeInfo(teacherId) {
        const [medicalRecords, attachments, deputations, postingHistories] = await Promise.all([
            prismaService_1.default.medical_records.count({ where: { teacher_id: teacherId } }),
            prismaService_1.default.attachments.count({ where: { teacher_id: teacherId } }),
            prismaService_1.default.deputations.count({ where: { teacher_id: teacherId } }),
            prismaService_1.default.posting_histories.count({ where: { teacher_id: teacherId } })
        ]);
        return {
            medicalRecords,
            attachments,
            deputations,
            postingHistories
        };
    }
    /**
     * Check what will be cascade deleted when deleting a user
     */
    async getUserCascadeInfo(userId) {
        const [refreshTokens, medicalRecordsEntered, auditLogs] = await Promise.all([
            prismaService_1.default.refresh_tokens.count({ where: { user_id: userId } }),
            prismaService_1.default.medical_records.count({ where: { entered_by_id: userId } }),
            prismaService_1.default.audit_logs.count({ where: { user_id: userId } })
        ]);
        return {
            refreshTokens,
            medicalRecordsEntered,
            auditLogs
        };
    }
    /**
     * Safe delete school with cascade warning
     */
    async safeDeleteSchool(schoolId, force = false) {
        try {
            console.log('🔍 safeDeleteSchool - schoolId:', schoolId, 'force:', force);
            const cascadeInfo = await this.getSchoolCascadeInfo(schoolId);
            console.log('🔍 safeDeleteSchool - cascadeInfo:', cascadeInfo);
            const totalAffected = cascadeInfo.teachers + cascadeInfo.medicalRecords +
                cascadeInfo.attachments + cascadeInfo.deputations +
                cascadeInfo.postingHistories;
            // For soft delete, we don't need to block deletion due to related records
            // since we're not actually deleting the data, just marking it as deleted
            if (totalAffected > 0 && !force) {
                console.log(`School deletion will affect ${totalAffected} related records, but proceeding with soft delete`);
            }
            // Proceed with soft deletion
            console.log('🔍 safeDeleteSchool - proceeding with soft delete for schoolId:', schoolId);
            const result = await prismaService_1.default.schools.update({
                where: { school_id: schoolId },
                data: {
                    deleted_at: new Date(),
                    updated_at: new Date()
                }
            });
            console.log('🔍 safeDeleteSchool - soft delete result:', result);
            return {
                success: true,
                message: `School deleted successfully. ${totalAffected} related records were also deleted.`,
                cascadeInfo
            };
        }
        catch (error) {
            console.error('🔍 safeDeleteSchool - error:', error);
            return {
                success: false,
                message: 'Failed to delete school',
                error: error.message
            };
        }
    }
    /**
     * Safe delete teacher with cascade warning
     */
    async safeDeleteTeacher(teacherId, force = false) {
        try {
            console.log('🔍 safeDeleteTeacher - teacherId:', teacherId, 'force:', force);
            const cascadeInfo = await this.getTeacherCascadeInfo(teacherId);
            console.log('🔍 safeDeleteTeacher - cascadeInfo:', cascadeInfo);
            const totalAffected = cascadeInfo.medicalRecords + cascadeInfo.attachments +
                cascadeInfo.deputations + cascadeInfo.postingHistories;
            // For soft delete, we don't need to block deletion due to related records
            // since we're not actually deleting the data, just marking it as deleted
            if (totalAffected > 0 && !force) {
                console.log(`Teacher deletion will affect ${totalAffected} related records, but proceeding with soft delete`);
            }
            // Proceed with soft deletion
            console.log('🔍 safeDeleteTeacher - proceeding with soft delete for teacherId:', teacherId);
            const result = await prismaService_1.default.teachers.update({
                where: { id: teacherId },
                data: {
                    deleted_at: new Date(),
                    updated_at: new Date()
                }
            });
            console.log('🔍 safeDeleteTeacher - soft delete result:', result);
            return {
                success: true,
                message: `Teacher deleted successfully. ${totalAffected} related records were also deleted.`,
                cascadeInfo
            };
        }
        catch (error) {
            console.error('🔍 safeDeleteTeacher - error:', error);
            return {
                success: false,
                message: 'Failed to delete teacher',
                error: error.message
            };
        }
    }
    /**
     * Safe delete user with cascade warning
     */
    async safeDeleteUser(userId, force = false) {
        try {
            const cascadeInfo = await this.getUserCascadeInfo(userId);
            // Check if user has medical records they entered (RESTRICT constraint)
            if (cascadeInfo.medicalRecordsEntered > 0) {
                return {
                    success: false,
                    message: 'Cannot delete user',
                    cascadeInfo,
                    error: `User has entered ${cascadeInfo.medicalRecordsEntered} medical records. Please reassign these records to another user first.`
                };
            }
            const totalAffected = cascadeInfo.refreshTokens + cascadeInfo.auditLogs;
            if (totalAffected > 0 && !force) {
                return {
                    success: false,
                    message: 'User deletion will affect related records',
                    cascadeInfo,
                    error: `This will delete ${cascadeInfo.refreshTokens} refresh tokens and ${cascadeInfo.auditLogs} audit logs. Use force=true to proceed.`
                };
            }
            // Proceed with deletion
            await prismaService_1.default.users.delete({ where: { id: userId } });
            return {
                success: true,
                message: `User deleted successfully. ${totalAffected} related records were also deleted.`,
                cascadeInfo
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete user',
                error: error.message
            };
        }
    }
    /**
     * Get cascade information for any entity
     */
    async getCascadeInfo(entityType, entityId) {
        switch (entityType) {
            case 'school':
                return await this.getSchoolCascadeInfo(entityId);
            case 'teacher':
                return await this.getTeacherCascadeInfo(entityId);
            case 'user':
                return await this.getUserCascadeInfo(entityId);
            case 'district':
                return await this.getDistrictCascadeInfo(entityId);
            case 'rd-block':
                return await this.getRdBlockCascadeInfo(entityId);
            case 'village':
                return await this.getVillageCascadeInfo(entityId);
            default:
                throw new Error('Invalid entity type');
        }
    }
    /**
     * Check what will be cascade deleted when deleting a district
     */
    async getDistrictCascadeInfo(districtId) {
        // Get district name first
        const district = await prismaService_1.default.districts.findUnique({
            where: { id: districtId },
            select: { name: true }
        });
        if (!district) {
            throw new Error('District not found');
        }
        const [rdBlocks, villages, schools, teachers, users] = await Promise.all([
            prismaService_1.default.rd_blocks.count({ where: { district_id: districtId } }),
            prismaService_1.default.villages.count({
                where: {
                    rd_blocks: { district_id: districtId }
                }
            }),
            prismaService_1.default.schools.count({ where: { district: district.name, deleted_at: null } }),
            prismaService_1.default.teachers.count({ where: { district: district.name, deleted_at: null } }),
            prismaService_1.default.users.count({ where: { district: district.name } })
        ]);
        return {
            rdBlocks,
            villages,
            schools,
            teachers,
            users
        };
    }
    /**
     * Check what will be cascade deleted when deleting an RD block
     */
    async getRdBlockCascadeInfo(rdBlockId) {
        // Get RD block name first
        const rdBlock = await prismaService_1.default.rd_blocks.findUnique({
            where: { id: rdBlockId },
            select: { name: true }
        });
        if (!rdBlock) {
            throw new Error('RD Block not found');
        }
        const [villages, schools, teachers] = await Promise.all([
            prismaService_1.default.villages.count({ where: { rd_block_id: rdBlockId } }),
            prismaService_1.default.schools.count({ where: { rd_block: rdBlock.name, deleted_at: null } }),
            prismaService_1.default.teachers.count({ where: { rd_block: rdBlock.name, deleted_at: null } })
        ]);
        return {
            villages,
            schools,
            teachers
        };
    }
    /**
     * Check what will be cascade deleted when deleting a village
     */
    async getVillageCascadeInfo(villageId) {
        // Get village name first
        const village = await prismaService_1.default.villages.findUnique({
            where: { id: villageId },
            select: { name: true }
        });
        if (!village) {
            throw new Error('Village not found');
        }
        const [schools, teachers] = await Promise.all([
            prismaService_1.default.schools.count({ where: { habitation: village.name, deleted_at: null } }),
            prismaService_1.default.teachers.count({ where: { habitation: village.name, deleted_at: null } })
        ]);
        return {
            schools,
            teachers
        };
    }
    /**
     * Safe delete district with cascade protection
     */
    async safeDeleteDistrict(districtId, force = false) {
        const cascadeInfo = await this.getDistrictCascadeInfo(districtId);
        const totalAffected = cascadeInfo.rdBlocks + cascadeInfo.villages + cascadeInfo.schools + cascadeInfo.teachers + cascadeInfo.users;
        if (totalAffected > 0 && !force) {
            throw new Error(`District deletion will affect ${totalAffected} related records. Use force=true to proceed.`);
        }
        return await prismaService_1.default.districts.delete({
            where: { id: districtId }
        });
    }
    /**
     * Safe delete RD block with cascade protection
     */
    async safeDeleteRdBlock(rdBlockId, force = false) {
        const cascadeInfo = await this.getRdBlockCascadeInfo(rdBlockId);
        const totalAffected = cascadeInfo.villages + cascadeInfo.schools + cascadeInfo.teachers;
        if (totalAffected > 0 && !force) {
            throw new Error(`RD Block deletion will affect ${totalAffected} related records. Use force=true to proceed.`);
        }
        return await prismaService_1.default.rd_blocks.delete({
            where: { id: rdBlockId }
        });
    }
    /**
     * Safe delete village with cascade protection
     */
    async safeDeleteVillage(villageId, force = false) {
        const cascadeInfo = await this.getVillageCascadeInfo(villageId);
        const totalAffected = cascadeInfo.schools + cascadeInfo.teachers;
        if (totalAffected > 0 && !force) {
            throw new Error(`Village deletion will affect ${totalAffected} related records. Use force=true to proceed.`);
        }
        return await prismaService_1.default.villages.delete({
            where: { id: villageId }
        });
    }
}
exports.CascadeService = CascadeService;
exports.cascadeService = new CascadeService();
//# sourceMappingURL=cascadeService.js.map