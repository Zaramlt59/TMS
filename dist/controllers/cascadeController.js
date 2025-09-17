"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cascadeController = void 0;
const cascadeService_1 = require("../services/cascadeService");
exports.cascadeController = {
    // Get cascade information for school deletion
    getSchoolCascadeInfo: async (req, res) => {
        try {
            const { schoolId } = req.params;
            const cascadeInfo = await cascadeService_1.cascadeService.getSchoolCascadeInfo(schoolId);
            const totalAffected = cascadeInfo.teachers + cascadeInfo.medicalRecords +
                cascadeInfo.attachments + cascadeInfo.deputations +
                cascadeInfo.postingHistories;
            res.json({
                success: true,
                message: 'Cascade information retrieved successfully',
                data: {
                    schoolId,
                    cascadeInfo,
                    totalAffected,
                    warning: totalAffected > 0 ? `Deleting this school will affect ${totalAffected} related records` : 'No related records will be affected'
                }
            });
        }
        catch (error) {
            console.error('Error getting school cascade info:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve cascade information',
                error: error.message
            });
        }
    },
    // Get cascade information for teacher deletion
    getTeacherCascadeInfo: async (req, res) => {
        try {
            const { teacherId } = req.params;
            const cascadeInfo = await cascadeService_1.cascadeService.getTeacherCascadeInfo(parseInt(teacherId));
            const totalAffected = cascadeInfo.medicalRecords + cascadeInfo.attachments +
                cascadeInfo.deputations + cascadeInfo.postingHistories;
            res.json({
                success: true,
                message: 'Cascade information retrieved successfully',
                data: {
                    teacherId: parseInt(teacherId),
                    cascadeInfo,
                    totalAffected,
                    warning: totalAffected > 0 ? `Deleting this teacher will affect ${totalAffected} related records` : 'No related records will be affected'
                }
            });
        }
        catch (error) {
            console.error('Error getting teacher cascade info:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve cascade information',
                error: error.message
            });
        }
    },
    // Get cascade information for user deletion
    getUserCascadeInfo: async (req, res) => {
        try {
            const { userId } = req.params;
            const cascadeInfo = await cascadeService_1.cascadeService.getUserCascadeInfo(parseInt(userId));
            const totalAffected = cascadeInfo.refreshTokens + cascadeInfo.auditLogs;
            const canDelete = cascadeInfo.medicalRecordsEntered === 0;
            res.json({
                success: true,
                message: 'Cascade information retrieved successfully',
                data: {
                    userId: parseInt(userId),
                    cascadeInfo,
                    totalAffected,
                    canDelete,
                    warning: !canDelete
                        ? `Cannot delete user: they have entered ${cascadeInfo.medicalRecordsEntered} medical records`
                        : totalAffected > 0
                            ? `Deleting this user will affect ${totalAffected} related records`
                            : 'No related records will be affected'
                }
            });
        }
        catch (error) {
            console.error('Error getting user cascade info:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve cascade information',
                error: error.message
            });
        }
    },
    // Safe delete school with cascade warning
    safeDeleteSchool: async (req, res) => {
        try {
            const { schoolId } = req.params;
            const force = req.query.force === 'true';
            const result = await cascadeService_1.cascadeService.safeDeleteSchool(schoolId, force);
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
            console.error('Error safe deleting school:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete school',
                error: error.message
            });
        }
    },
    // Safe delete teacher with cascade warning
    safeDeleteTeacher: async (req, res) => {
        try {
            const { teacherId } = req.params;
            const force = req.query.force === 'true';
            const result = await cascadeService_1.cascadeService.safeDeleteTeacher(parseInt(teacherId), force);
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
            console.error('Error safe deleting teacher:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete teacher',
                error: error.message
            });
        }
    },
    // Safe delete user with cascade warning
    safeDeleteUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const force = req.query.force === 'true';
            const result = await cascadeService_1.cascadeService.safeDeleteUser(parseInt(userId), force);
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
            console.error('Error safe deleting user:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete user',
                error: error.message
            });
        }
    },
    // Get cascade information for district deletion
    getDistrictCascadeInfo: async (req, res) => {
        try {
            const { districtId } = req.params;
            const cascadeInfo = await cascadeService_1.cascadeService.getDistrictCascadeInfo(parseInt(districtId));
            const totalAffected = cascadeInfo.rdBlocks + cascadeInfo.villages +
                cascadeInfo.schools + cascadeInfo.teachers + cascadeInfo.users;
            res.json({
                success: true,
                message: 'Cascade information retrieved successfully',
                data: {
                    districtId: parseInt(districtId),
                    cascadeInfo,
                    totalAffected,
                    warning: totalAffected > 0 ? `Deleting this district will affect ${totalAffected} related records` : 'No related records will be affected'
                }
            });
        }
        catch (error) {
            console.error('Error getting district cascade info:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve cascade information',
                error: error.message
            });
        }
    },
    // Get cascade information for RD block deletion
    getRdBlockCascadeInfo: async (req, res) => {
        try {
            const { rdBlockId } = req.params;
            const cascadeInfo = await cascadeService_1.cascadeService.getRdBlockCascadeInfo(parseInt(rdBlockId));
            const totalAffected = cascadeInfo.villages + cascadeInfo.schools + cascadeInfo.teachers;
            res.json({
                success: true,
                message: 'Cascade information retrieved successfully',
                data: {
                    rdBlockId: parseInt(rdBlockId),
                    cascadeInfo,
                    totalAffected,
                    warning: totalAffected > 0 ? `Deleting this RD block will affect ${totalAffected} related records` : 'No related records will be affected'
                }
            });
        }
        catch (error) {
            console.error('Error getting RD block cascade info:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve cascade information',
                error: error.message
            });
        }
    },
    // Get cascade information for village deletion
    getVillageCascadeInfo: async (req, res) => {
        try {
            const { villageId } = req.params;
            const cascadeInfo = await cascadeService_1.cascadeService.getVillageCascadeInfo(parseInt(villageId));
            const totalAffected = cascadeInfo.schools + cascadeInfo.teachers;
            res.json({
                success: true,
                message: 'Cascade information retrieved successfully',
                data: {
                    villageId: parseInt(villageId),
                    cascadeInfo,
                    totalAffected,
                    warning: totalAffected > 0 ? `Deleting this village will affect ${totalAffected} related records` : 'No related records will be affected'
                }
            });
        }
        catch (error) {
            console.error('Error getting village cascade info:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve cascade information',
                error: error.message
            });
        }
    },
    // Safe delete district with cascade protection
    safeDeleteDistrict: async (req, res) => {
        try {
            const { districtId } = req.params;
            const force = req.query.force === 'true';
            const result = await cascadeService_1.cascadeService.safeDeleteDistrict(parseInt(districtId), force);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'District deleted successfully',
                    data: result.data
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'District deletion will affect related records',
                    data: result.cascadeInfo,
                    error: result.error
                });
            }
        }
        catch (error) {
            console.error('Error safe deleting district:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete district',
                error: error.message
            });
        }
    },
    // Safe delete RD block with cascade protection
    safeDeleteRdBlock: async (req, res) => {
        try {
            const { rdBlockId } = req.params;
            const force = req.query.force === 'true';
            const result = await cascadeService_1.cascadeService.safeDeleteRdBlock(parseInt(rdBlockId), force);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'RD Block deleted successfully',
                    data: result.data
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'RD Block deletion will affect related records',
                    data: result.cascadeInfo,
                    error: result.error
                });
            }
        }
        catch (error) {
            console.error('Error safe deleting RD block:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete RD block',
                error: error.message
            });
        }
    },
    // Safe delete village with cascade protection
    safeDeleteVillage: async (req, res) => {
        try {
            const { villageId } = req.params;
            const force = req.query.force === 'true';
            const result = await cascadeService_1.cascadeService.safeDeleteVillage(parseInt(villageId), force);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'Village deleted successfully',
                    data: result.data
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'Village deletion will affect related records',
                    data: result.cascadeInfo,
                    error: result.error
                });
            }
        }
        catch (error) {
            console.error('Error safe deleting village:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete village',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=cascadeController.js.map