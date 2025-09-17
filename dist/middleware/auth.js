"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
    console.log('🔍 authenticateToken middleware called');
    const authHeader = req.headers['authorization'];
    console.log('  - Authorization header:', authHeader);
    const token = jwt_1.JWTUtil.extractTokenFromHeader(authHeader);
    console.log('  - Extracted token:', token ? token.substring(0, 50) + '...' : 'null');
    if (!token) {
        console.log('❌ No token found');
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }
    const payload = jwt_1.JWTUtil.verifyToken(token);
    console.log('  - Token payload:', payload);
    if (!payload) {
        console.log('❌ Token verification failed');
        // Use 401 so clients can refresh tokens automatically
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
    console.log('✅ Token verified, setting req.user');
    req.user = payload;
    next();
};
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    console.log('🔍 requireAdmin middleware called');
    console.log('  - req.user:', req.user);
    console.log('  - Authorization header:', req.headers.authorization);
    if (!req.user) {
        console.log('❌ No user found in request');
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    console.log('  - User role:', req.user.role);
    console.log('  - Role check - admin:', req.user.role === 'admin');
    console.log('  - Role check - super_admin:', req.user.role === 'super_admin');
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && req.user.role !== 'deo' && req.user.role !== 'sdeo' && req.user.role !== 'hoi') {
        console.log('❌ User role not authorized:', req.user.role);
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    console.log('✅ User authorized, proceeding...');
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.js.map