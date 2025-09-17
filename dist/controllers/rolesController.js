"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesController = void 0;
// Define roles and permissions directly in the controller
const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    DEO: 'deo',
    SDEO: 'sdeo',
    HOI: 'hoi',
    TEACHER: 'teacher'
};
const ROLE_HIERARCHY = {
    [ROLES.SUPER_ADMIN]: 6,
    [ROLES.ADMIN]: 5,
    [ROLES.DEO]: 4,
    [ROLES.SDEO]: 3,
    [ROLES.HOI]: 2,
    [ROLES.TEACHER]: 1
};
const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: [
        'users.create', 'users.read', 'users.update', 'users.delete', 'users.manage_roles',
        'schools.create', 'schools.read', 'schools.update', 'schools.delete', 'schools.export',
        'teachers.create', 'teachers.read', 'teachers.update', 'teachers.delete', 'teachers.export',
        'medical_records.create', 'medical_records.read', 'medical_records.update', 'medical_records.delete',
        'master_data.create', 'master_data.read', 'master_data.update', 'master_data.delete',
        'settings.read', 'settings.update', 'settings.manage_roles',
        'reports.read', 'reports.export', 'analytics.read'
    ],
    [ROLES.ADMIN]: [
        'schools.create', 'schools.read', 'schools.update', 'schools.delete', 'schools.export',
        'teachers.create', 'teachers.read', 'teachers.update', 'teachers.delete', 'teachers.export',
        'medical_records.create', 'medical_records.read', 'medical_records.update', 'medical_records.delete',
        'master_data.create', 'master_data.read', 'master_data.update', 'master_data.delete',
        'settings.read', 'settings.update',
        'reports.read', 'reports.export', 'analytics.read'
    ],
    [ROLES.DEO]: [
        'schools.read', 'schools.update', 'schools.export',
        'teachers.read', 'teachers.update', 'teachers.export',
        'medical_records.read',
        'master_data.read',
        'reports.read', 'reports.export', 'analytics.read'
    ],
    [ROLES.SDEO]: [
        'schools.read', 'schools.update', 'schools.export',
        'teachers.read', 'teachers.update', 'teachers.export',
        'medical_records.read',
        'master_data.read',
        'reports.read', 'reports.export', 'analytics.read'
    ],
    [ROLES.HOI]: [
        'schools.read', 'schools.update', 'schools.export',
        'teachers.read', 'teachers.update', 'teachers.export',
        'medical_records.read',
        'master_data.read',
        'reports.read', 'reports.export', 'analytics.read'
    ],
    [ROLES.TEACHER]: [
        'teachers.read_own',
        'medical_records.read_own',
        'reports.read_own',
        'analytics.read_own'
    ]
};
exports.rolesController = {
    // Get all available roles with their information
    getAllRoles: async (req, res) => {
        try {
            const roles = Object.values(ROLES).map(role => ({
                name: role,
                display_name: getRoleDisplayName(role),
                description: getRoleDescription(role),
                level: ROLE_HIERARCHY[role],
                permissions: ROLE_PERMISSIONS[role] || []
            }));
            res.json({
                success: true,
                message: 'Roles retrieved successfully',
                data: {
                    roles,
                    hierarchy: ROLE_HIERARCHY,
                    permissions: ROLE_PERMISSIONS
                }
            });
        }
        catch (error) {
            console.error('Error getting roles:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve roles',
                error: error.message
            });
        }
    },
    // Get permissions for a specific role
    getRolePermissions: async (req, res) => {
        try {
            const { role } = req.params;
            if (!Object.values(ROLES).includes(role)) {
                return res.status(404).json({
                    success: false,
                    message: 'Role not found'
                });
            }
            const permissions = ROLE_PERMISSIONS[role] || [];
            const level = ROLE_HIERARCHY[role];
            res.json({
                success: true,
                message: 'Role permissions retrieved successfully',
                data: {
                    role,
                    display_name: getRoleDisplayName(role),
                    description: getRoleDescription(role),
                    level,
                    permissions
                }
            });
        }
        catch (error) {
            console.error('Error getting role permissions:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve role permissions',
                error: error.message
            });
        }
    },
    // Get role hierarchy information
    getRoleHierarchy: async (req, res) => {
        try {
            const hierarchy = Object.entries(ROLE_HIERARCHY).map(([role, level]) => ({
                role,
                level,
                display_name: getRoleDisplayName(role),
                description: getRoleDescription(role)
            })).sort((a, b) => b.level - a.level); // Sort by level descending
            res.json({
                success: true,
                message: 'Role hierarchy retrieved successfully',
                data: {
                    hierarchy,
                    levels: ROLE_HIERARCHY
                }
            });
        }
        catch (error) {
            console.error('Error getting role hierarchy:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve role hierarchy',
                error: error.message
            });
        }
    },
    // Get all available permissions
    getAllPermissions: async (req, res) => {
        try {
            const allPermissions = new Set();
            // Collect all unique permissions from all roles
            Object.values(ROLE_PERMISSIONS).forEach(permissions => {
                permissions.forEach(permission => allPermissions.add(permission));
            });
            // Group permissions by category
            const permissionsByCategory = Array.from(allPermissions).reduce((acc, permission) => {
                const category = permission.split('.')[0];
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(permission);
                return acc;
            }, {});
            res.json({
                success: true,
                message: 'All permissions retrieved successfully',
                data: {
                    permissions: Array.from(allPermissions).sort(),
                    permissionsByCategory,
                    totalCount: allPermissions.size
                }
            });
        }
        catch (error) {
            console.error('Error getting all permissions:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve permissions',
                error: error.message
            });
        }
    }
};
// Helper functions
function getRoleDisplayName(role) {
    const displayNames = {
        'super_admin': 'Super Administrator',
        'admin': 'Administrator',
        'deo': 'District Education Officer',
        'sdeo': 'Sub-Division Education Officer',
        'hoi': 'Head of Institution',
        'teacher': 'Teacher'
    };
    return displayNames[role] || role;
}
function getRoleDescription(role) {
    const descriptions = {
        'super_admin': 'Full system access including user management and role assignment',
        'admin': 'Administrative access to manage schools, teachers, and system data',
        'deo': 'District-level access to manage schools and teachers within assigned district',
        'sdeo': 'Sub-division level access to manage schools and teachers within assigned sub-division',
        'hoi': 'Institution-level access to manage teachers and school data within assigned institution',
        'teacher': 'Limited access to view own profile and medical records'
    };
    return descriptions[role] || 'No description available';
}
//# sourceMappingURL=rolesController.js.map