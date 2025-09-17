"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserId = exports.validateUpdateUser = exports.validateCreateUser = void 0;
/**
 * Validate user creation data
 */
const validateCreateUser = (req, res, next) => {
    const { username, email, role, password } = req.body;
    // Check required fields
    if (!username || !email || !role || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username, email, role, and password are required'
        });
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }
    // Validate password strength
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }
    // Validate role
    const validRoles = ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role. Must be one of: ' + validRoles.join(', ')
        });
    }
    next();
};
exports.validateCreateUser = validateCreateUser;
/**
 * Validate user update data
 */
const validateUpdateUser = (req, res, next) => {
    const { username, email, role, password } = req.body;
    // Validate email format if provided
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
    }
    // Validate password strength if provided
    if (password && password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }
    // Validate role if provided
    if (role) {
        const validRoles = ['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be one of: ' + validRoles.join(', ')
            });
        }
    }
    next();
};
exports.validateUpdateUser = validateUpdateUser;
/**
 * Validate user ID parameter
 */
const validateUserId = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            success: false,
            message: 'Valid user ID is required'
        });
    }
    next();
};
exports.validateUserId = validateUserId;
//# sourceMappingURL=userValidation.js.map