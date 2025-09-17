// Role-based access control configuration
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DEO: 'deo',
  SDEO: 'sdeo',
  HOI: 'hoi',
  TEACHER: 'teacher'
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 6,
  [ROLES.ADMIN]: 5,
  [ROLES.DEO]: 4,
  [ROLES.SDEO]: 3,
  [ROLES.HOI]: 2,
  [ROLES.TEACHER]: 1
} as const

// Permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // User Management
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'users.manage_roles',
    
    // School Management
    'schools.create',
    'schools.read',
    'schools.update',
    'schools.delete',
    'schools.export',
    
    // Teacher Management
    'teachers.create',
    'teachers.read',
    'teachers.update',
    'teachers.delete',
    'teachers.export',
    
    // Medical Records
    'medical_records.create',
    'medical_records.read',
    'medical_records.update',
    'medical_records.delete',
    
    // Master Data Management
    'master_data.create',
    'master_data.read',
    'master_data.update',
    'master_data.delete',
    
    // System Settings
    'settings.read',
    'settings.update',
    'settings.manage_roles',
    
    // Reports and Analytics
    'reports.read',
    'reports.export',
    'analytics.read'
  ],
  
  [ROLES.ADMIN]: [
    // School Management
    'schools.create',
    'schools.read',
    'schools.update',
    'schools.delete',
    'schools.export',
    
    // Teacher Management
    'teachers.create',
    'teachers.read',
    'teachers.update',
    'teachers.delete',
    'teachers.export',
    
    // Medical Records
    'medical_records.create',
    'medical_records.read',
    'medical_records.update',
    'medical_records.delete',
    
    // Master Data Management
    'master_data.create',
    'master_data.read',
    'master_data.update',
    'master_data.delete',
    
    // System Settings
    'settings.read',
    'settings.update',
    
    // Reports and Analytics
    'reports.read',
    'reports.export',
    'analytics.read'
  ],
  
  [ROLES.DEO]: [
    // School Management (District Level)
    'schools.read',
    'schools.update',
    'schools.export',
    
    // Teacher Management (District Level)
    'teachers.read',
    'teachers.update',
    'teachers.export',
    
    // Medical Records (View Only)
    'medical_records.read',
    
    // Master Data Management (View Only)
    'master_data.read',
    
    // Reports and Analytics (District Level)
    'reports.read',
    'reports.export',
    'analytics.read'
  ],
  
  [ROLES.SDEO]: [
    // School Management (Sub-Division Level)
    'schools.read',
    'schools.update',
    'schools.export',
    
    // Teacher Management (Sub-Division Level)
    'teachers.read',
    'teachers.update',
    'teachers.export',
    
    // Medical Records (View Only)
    'medical_records.read',
    
    // Master Data Management (View Only)
    'master_data.read',
    
    // Reports and Analytics (Sub-Division Level)
    'reports.read',
    'reports.export',
    'analytics.read'
  ],
  
  [ROLES.HOI]: [
    // School Management (Institution Level)
    'schools.read',
    'schools.update',
    'schools.export',
    
    // Teacher Management (Institution Level)
    'teachers.read',
    'teachers.update',
    'teachers.export',
    
    // Medical Records (View Only)
    'medical_records.read',
    
    // Master Data Management (View Only)
    'master_data.read',
    
    // Reports and Analytics (Institution Level)
    'reports.read',
    'reports.export',
    'analytics.read'
  ],
  
  [ROLES.TEACHER]: [
    // Limited access
    'teachers.read_own',
    'medical_records.read_own',
    'profile.update_own'
  ]
} as const

// Helper functions
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || []
  return rolePermissions.includes(permission as any)
}

export const canAccess = (userRole: UserRole, requiredRole: UserRole, permission?: string): boolean => {
  if (!hasRole(userRole, requiredRole)) {
    return false
  }
  
  if (permission && !hasPermission(userRole, permission)) {
    return false
  }
  
  return true
}

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.SUPER_ADMIN]: 'Super Administrator',
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.DEO]: 'District Education Officer',
  [ROLES.SDEO]: 'Sub-Division Education Officer',
  [ROLES.HOI]: 'Head of Institution',
  [ROLES.TEACHER]: 'Teacher'
} as const

// Role descriptions
export const ROLE_DESCRIPTIONS = {
  [ROLES.SUPER_ADMIN]: 'Full system access including user management and role assignment',
  [ROLES.ADMIN]: 'Administrative access to manage schools, teachers, and system data',
  [ROLES.DEO]: 'District-level access to manage schools and teachers within assigned district',
  [ROLES.SDEO]: 'Sub-division level access to manage schools and teachers within assigned sub-division',
  [ROLES.HOI]: 'Institution-level access to manage teachers and school data within assigned institution',
  [ROLES.TEACHER]: 'Limited access to view own profile and medical records'
} as const
