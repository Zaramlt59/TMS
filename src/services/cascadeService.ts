import prisma from './prismaService';

export class CascadeService {
  /**
   * Check what will be cascade deleted when deleting a school
   */
  async getSchoolCascadeInfo(schoolId: string): Promise<{
    teachers: number;
    medicalRecords: number;
    attachments: number;
    deputations: number;
    postingHistories: number;
  }> {
    const [teachers, medicalRecords, attachments, deputations, postingHistories] = await Promise.all([
      prisma.teachers.count({ where: { school_id: schoolId, deleted_at: null } as any }),
      prisma.medical_records.count({ 
        where: { 
          teachers: { school_id: schoolId, deleted_at: null } as any 
        } 
      }),
      prisma.attachments.count({ 
        where: { 
          teachers: { school_id: schoolId, deleted_at: null } as any 
        } 
      }),
      prisma.deputations.count({ 
        where: { 
          teachers: { school_id: schoolId, deleted_at: null } as any 
        } 
      }),
      prisma.posting_histories.count({ 
        where: { 
          teachers: { school_id: schoolId, deleted_at: null } as any 
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
  async getTeacherCascadeInfo(teacherId: number): Promise<{
    medicalRecords: number;
    attachments: number;
    deputations: number;
    postingHistories: number;
  }> {
    const [medicalRecords, attachments, deputations, postingHistories] = await Promise.all([
      prisma.medical_records.count({ where: { teacher_id: teacherId } }),
      prisma.attachments.count({ where: { teacher_id: teacherId } }),
      prisma.deputations.count({ where: { teacher_id: teacherId } }),
      prisma.posting_histories.count({ where: { teacher_id: teacherId } })
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
  async getUserCascadeInfo(userId: number): Promise<{
    refreshTokens: number;
    medicalRecordsEntered: number;
    auditLogs: number;
  }> {
    const [refreshTokens, medicalRecordsEntered, auditLogs] = await Promise.all([
      prisma.refresh_tokens.count({ where: { user_id: userId } }),
      prisma.medical_records.count({ where: { entered_by_id: userId } }),
      prisma.audit_logs.count({ where: { user_id: userId } })
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
  async safeDeleteSchool(schoolId: string, force: boolean = false): Promise<{
    success: boolean;
    message: string;
    cascadeInfo?: any;
    error?: string;
  }> {
    try {
      console.log('🔍 safeDeleteSchool - schoolId:', schoolId, 'force:', force)
      const cascadeInfo = await this.getSchoolCascadeInfo(schoolId);
      console.log('🔍 safeDeleteSchool - cascadeInfo:', cascadeInfo)
      const totalAffected = cascadeInfo.teachers + cascadeInfo.medicalRecords + 
                           cascadeInfo.attachments + cascadeInfo.deputations + 
                           cascadeInfo.postingHistories;

      // For soft delete, we don't need to block deletion due to related records
      // since we're not actually deleting the data, just marking it as deleted
      if (totalAffected > 0 && !force) {
        console.log(`School deletion will affect ${totalAffected} related records, but proceeding with soft delete`);
      }

      // Proceed with soft deletion
      console.log('🔍 safeDeleteSchool - proceeding with soft delete for schoolId:', schoolId)
      const result = await prisma.schools.update({ 
        where: { school_id: schoolId },
        data: { 
          deleted_at: new Date(),
          updated_at: new Date()
        } as any
      });
      console.log('🔍 safeDeleteSchool - soft delete result:', result)

      return {
        success: true,
        message: `School deleted successfully. ${totalAffected} related records were also deleted.`,
        cascadeInfo
      };
    } catch (error: any) {
      console.error('🔍 safeDeleteSchool - error:', error)
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
  async safeDeleteTeacher(teacherId: number, force: boolean = false): Promise<{
    success: boolean;
    message: string;
    cascadeInfo?: any;
    error?: string;
  }> {
    try {
      console.log('🔍 safeDeleteTeacher - teacherId:', teacherId, 'force:', force)
      const cascadeInfo = await this.getTeacherCascadeInfo(teacherId);
      console.log('🔍 safeDeleteTeacher - cascadeInfo:', cascadeInfo)
      const totalAffected = cascadeInfo.medicalRecords + cascadeInfo.attachments + 
                           cascadeInfo.deputations + cascadeInfo.postingHistories;

      // For soft delete, we don't need to block deletion due to related records
      // since we're not actually deleting the data, just marking it as deleted
      if (totalAffected > 0 && !force) {
        console.log(`Teacher deletion will affect ${totalAffected} related records, but proceeding with soft delete`);
      }

      // Proceed with soft deletion
      console.log('🔍 safeDeleteTeacher - proceeding with soft delete for teacherId:', teacherId)
      const result = await prisma.teachers.update({ 
        where: { id: teacherId },
        data: { 
          deleted_at: new Date(),
          updated_at: new Date()
        } as any
      });
      console.log('🔍 safeDeleteTeacher - soft delete result:', result)

      return {
        success: true,
        message: `Teacher deleted successfully. ${totalAffected} related records were also deleted.`,
        cascadeInfo
      };
    } catch (error: any) {
      console.error('🔍 safeDeleteTeacher - error:', error)
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
  async safeDeleteUser(userId: number, force: boolean = false): Promise<{
    success: boolean;
    message: string;
    cascadeInfo?: any;
    error?: string;
  }> {
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
      await prisma.users.delete({ where: { id: userId } });

      return {
        success: true,
        message: `User deleted successfully. ${totalAffected} related records were also deleted.`,
        cascadeInfo
      };
    } catch (error: any) {
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
  async getCascadeInfo(entityType: 'school' | 'teacher' | 'user' | 'district' | 'rd-block' | 'village', entityId: string | number): Promise<any> {
    switch (entityType) {
      case 'school':
        return await this.getSchoolCascadeInfo(entityId as string);
      case 'teacher':
        return await this.getTeacherCascadeInfo(entityId as number);
      case 'user':
        return await this.getUserCascadeInfo(entityId as number);
      case 'district':
        return await this.getDistrictCascadeInfo(entityId as number);
      case 'rd-block':
        return await this.getRdBlockCascadeInfo(entityId as number);
      case 'village':
        return await this.getVillageCascadeInfo(entityId as number);
      default:
        throw new Error('Invalid entity type');
    }
  }

  /**
   * Check what will be cascade deleted when deleting a district
   */
  async getDistrictCascadeInfo(districtId: number): Promise<{
    rdBlocks: number;
    villages: number;
    schools: number;
    teachers: number;
    users: number;
  }> {
    // Get district name first
    const district = await prisma.districts.findUnique({
      where: { id: districtId },
      select: { name: true }
    });

    if (!district) {
      throw new Error('District not found');
    }

    const [rdBlocks, villages, schools, teachers, users] = await Promise.all([
      prisma.rd_blocks.count({ where: { district_id: districtId } }),
      prisma.villages.count({ 
        where: { 
          rd_blocks: { district_id: districtId } 
        } 
      }),
      prisma.schools.count({ where: { district: district.name, deleted_at: null } as any }),
      prisma.teachers.count({ where: { district: district.name, deleted_at: null } as any }),
      prisma.users.count({ where: { district: district.name } })
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
  async getRdBlockCascadeInfo(rdBlockId: number): Promise<{
    villages: number;
    schools: number;
    teachers: number;
  }> {
    // Get RD block name first
    const rdBlock = await prisma.rd_blocks.findUnique({
      where: { id: rdBlockId },
      select: { name: true }
    });

    if (!rdBlock) {
      throw new Error('RD Block not found');
    }

    const [villages, schools, teachers] = await Promise.all([
      prisma.villages.count({ where: { rd_block_id: rdBlockId } }),
      prisma.schools.count({ where: { rd_block: rdBlock.name, deleted_at: null } as any }),
      prisma.teachers.count({ where: { rd_block: rdBlock.name, deleted_at: null } as any })
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
  async getVillageCascadeInfo(villageId: number): Promise<{
    schools: number;
    teachers: number;
  }> {
    // Get village name first
    const village = await prisma.villages.findUnique({
      where: { id: villageId },
      select: { name: true }
    });

    if (!village) {
      throw new Error('Village not found');
    }

    const [schools, teachers] = await Promise.all([
      prisma.schools.count({ where: { habitation: village.name, deleted_at: null } as any }),
      prisma.teachers.count({ where: { habitation: village.name, deleted_at: null } as any })
    ]);

    return {
      schools,
      teachers
    };
  }

  /**
   * Safe delete district with cascade protection
   */
  async safeDeleteDistrict(districtId: number, force: boolean = false): Promise<any> {
    const cascadeInfo = await this.getDistrictCascadeInfo(districtId);
    const totalAffected = cascadeInfo.rdBlocks + cascadeInfo.villages + cascadeInfo.schools + cascadeInfo.teachers + cascadeInfo.users;

    if (totalAffected > 0 && !force) {
      throw new Error(`District deletion will affect ${totalAffected} related records. Use force=true to proceed.`);
    }

    return await prisma.districts.delete({
      where: { id: districtId }
    });
  }

  /**
   * Safe delete RD block with cascade protection
   */
  async safeDeleteRdBlock(rdBlockId: number, force: boolean = false): Promise<any> {
    const cascadeInfo = await this.getRdBlockCascadeInfo(rdBlockId);
    const totalAffected = cascadeInfo.villages + cascadeInfo.schools + cascadeInfo.teachers;

    if (totalAffected > 0 && !force) {
      throw new Error(`RD Block deletion will affect ${totalAffected} related records. Use force=true to proceed.`);
    }

    return await prisma.rd_blocks.delete({
      where: { id: rdBlockId }
    });
  }

  /**
   * Safe delete village with cascade protection
   */
  async safeDeleteVillage(villageId: number, force: boolean = false): Promise<any> {
    const cascadeInfo = await this.getVillageCascadeInfo(villageId);
    const totalAffected = cascadeInfo.schools + cascadeInfo.teachers;

    if (totalAffected > 0 && !force) {
      throw new Error(`Village deletion will affect ${totalAffected} related records. Use force=true to proceed.`);
    }

    return await prisma.villages.delete({
      where: { id: villageId }
    });
  }
}

export const cascadeService = new CascadeService();
