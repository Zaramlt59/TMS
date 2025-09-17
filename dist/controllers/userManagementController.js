"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.toggleUserStatus = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const userManagementService_1 = require("../services/userManagementService");
/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await userManagementService_1.UserManagementService.getAllUsers();
        res.json({ success: true, data: users });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};
exports.getAllUsers = getAllUsers;
/**
 * Create a new user
 */
const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const user = await userManagementService_1.UserManagementService.createUser(userData);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create user'
        });
    }
};
exports.createUser = createUser;
/**
 * Update user information
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const user = await userManagementService_1.UserManagementService.updateUser(Number(id), updateData);
        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        if (error.message.includes('already exists')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};
exports.updateUser = updateUser;
/**
 * Toggle user active status
 */
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userManagementService_1.UserManagementService.toggleUserStatus(Number(id));
        res.json({
            success: true,
            message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    }
    catch (error) {
        console.error('Error toggling user status:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to toggle user status'
        });
    }
};
exports.toggleUserStatus = toggleUserStatus;
/**
 * Update user role
 */
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'Role is required'
            });
        }
        const user = await userManagementService_1.UserManagementService.updateUserRole(Number(id), role);
        res.json({
            success: true,
            message: 'User role updated successfully',
            data: user
        });
    }
    catch (error) {
        console.error('Error updating user role:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update user role'
        });
    }
};
exports.updateUserRole = updateUserRole;
/**
 * Delete user
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userManagementService_1.UserManagementService.deleteUser(Number(id));
        res.json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userManagementController.js.map