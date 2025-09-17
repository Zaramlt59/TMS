import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { ROLES, hasRole, hasPermission, canAccess, type UserRole } from '../constants/roles'

export function useRoleGuard() {
  const authStore = useAuthStore()

  // Current user role
  const currentRole = computed(() => authStore.currentUser?.role as UserRole || ROLES.TEACHER)

  // Role checks
  const isSuperAdmin = computed(() => hasRole(currentRole.value, ROLES.SUPER_ADMIN))
  const isAdmin = computed(() => hasRole(currentRole.value, ROLES.ADMIN))
  const isDEO = computed(() => hasRole(currentRole.value, ROLES.DEO))
  const isSDEO = computed(() => hasRole(currentRole.value, ROLES.SDEO))
  const isHOI = computed(() => hasRole(currentRole.value, ROLES.HOI))
  const isTeacher = computed(() => hasRole(currentRole.value, ROLES.TEACHER))

  // Permission checks
  const can = (permission: string): boolean => {
    return hasPermission(currentRole.value, permission)
  }

  // Role-based access checks
  const canAccessRole = (requiredRole: UserRole, permission?: string): boolean => {
    return canAccess(currentRole.value, requiredRole, permission)
  }

  // Specific permission helpers
  const canManageUsers = computed(() => can('users.manage_roles'))
  const canManageSchools = computed(() => can('schools.create') || can('schools.update') || can('schools.delete'))
  const canManageTeachers = computed(() => can('teachers.create') || can('teachers.update') || can('teachers.delete'))
  const canManageMedicalRecords = computed(() => can('medical_records.create') || can('medical_records.update') || can('medical_records.delete'))
  const canManageMasterData = computed(() => can('master_data.create') || can('master_data.update') || can('master_data.delete'))
  const canViewReports = computed(() => can('reports.read'))
  const canExportData = computed(() => can('reports.export') || can('schools.export') || can('teachers.export'))

  // UI visibility helpers
  const showUserManagement = computed(() => canManageUsers.value)
  const showSettings = computed(() => can('settings.read'))
  const showMasterData = computed(() => canManageMasterData.value)
  const showReports = computed(() => canViewReports.value)

  return {
    // Current role info
    currentRole,
    isSuperAdmin,
    isAdmin,
    isDEO,
    isSDEO,
    isHOI,
    isTeacher,
    
    // Permission checks
    can,
    canAccessRole,
    
    // Specific permission helpers
    canManageUsers,
    canManageSchools,
    canManageTeachers,
    canManageMedicalRecords,
    canManageMasterData,
    canViewReports,
    canExportData,
    
    // UI visibility helpers
    showUserManagement,
    showSettings,
    showMasterData,
    showReports
  }
}
