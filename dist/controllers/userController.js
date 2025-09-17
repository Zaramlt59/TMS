"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateCurrentUser = exports.getCurrentUser = exports.createDefaultAdmin = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.loginUser = exports.registerUser = exports.validateUserUpdate = exports.validateUserLogin = exports.validateUserRegistration = void 0;
const express_validator_1 = require("express-validator");
const userService_1 = __importDefault(require("../services/userService"));
const jwt_1 = require("../utils/jwt");
exports.validateUserRegistration = [
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 100 })
        .withMessage('Username must be between 3 and 100 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];
exports.validateUserLogin = [
    (0, express_validator_1.body)('username')
        .notEmpty()
        .withMessage('Username is required'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
exports.validateUserUpdate = [
    (0, express_validator_1.body)('username')
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('Username must be between 3 and 100 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];
// Register a new user (admin only)
const registerUser = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { username, email, password, role } = req.body;
        const user = await userService_1.default.createUser({
            username,
            email,
            password,
            role: role || 'admin'
        });
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create user'
        });
    }
};
exports.registerUser = registerUser;
// Login user
const loginUser = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { username, password } = req.body;
        const user = await userService_1.default.authenticateUser({ username, password });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        // Update last login time
        await userService_1.default.updateLastLogin(user.id);
        // Generate JWT token
        const token = jwt_1.JWTUtil.generateToken({
            userId: user.id,
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            school_id: user.school_id,
            district: user.district,
            rd_block: user.rd_block
        });
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};
exports.loginUser = loginUser;
// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await userService_1.default.getAllUsers();
        res.json({
            success: true,
            message: 'Users retrieved successfully',
            data: users
        });
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
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }
        const user = await userService_1.default.getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
};
exports.getUserById = getUserById;
// Update user
const updateUser = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }
        const updateData = req.body;
        const user = await userService_1.default.updateUser(userId, updateData);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user'
        });
    }
};
exports.updateUser = updateUser;
// Delete user (soft delete)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }
        const deleted = await userService_1.default.deleteUser(userId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};
exports.deleteUser = deleteUser;
// Create default admin (for initial setup)
const createDefaultAdmin = async (req, res) => {
    try {
        const admin = await userService_1.default.createDefaultAdmin();
        if (!admin) {
            return res.status(409).json({
                success: false,
                message: 'Admin user already exists'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Default admin created successfully',
            data: admin
        });
    }
    catch (error) {
        console.error('Error creating default admin:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create default admin'
        });
    }
};
exports.createDefaultAdmin = createDefaultAdmin;
// Get current user profile
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const user = await userService_1.default.getUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Remove sensitive information
        const { password, ...userProfile } = user;
        res.json({
            success: true,
            message: 'User profile retrieved successfully',
            data: userProfile
        });
    }
    catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve user profile'
        });
    }
};
exports.getCurrentUser = getCurrentUser;
// Update current user profile
const updateCurrentUser = async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const updateData = req.body;
        // Remove fields that users shouldn't be able to update themselves
        delete updateData.role;
        delete updateData.is_active;
        delete updateData.password; // Use change-password endpoint for password changes
        const user = await userService_1.default.updateUser(req.user.userId, updateData);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Remove sensitive information
        const { password, ...userProfile } = user;
        res.json({
            success: true,
            message: 'User profile updated successfully',
            data: userProfile
        });
    }
    catch (error) {
        console.error('Error updating current user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user profile'
        });
    }
};
exports.updateCurrentUser = updateCurrentUser;
// Change password for current user
const changePassword = async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }
        // Verify current password
        const user = await userService_1.default.getUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const isCurrentPasswordValid = await userService_1.default.verifyPassword(user, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        // Update password
        const updated = await userService_1.default.updateUser(req.user.userId, { password: newPassword });
        if (!updated) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update password'
            });
        }
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password'
        });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=userController.js.map