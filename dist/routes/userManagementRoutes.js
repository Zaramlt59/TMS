"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const userValidation_1 = require("../middleware/userValidation");
const userManagementController_1 = require("../controllers/userManagementController");
const router = (0, express_1.Router)();
// All routes require authentication and admin access
router.use(auth_1.authenticateToken);
router.use(auth_1.requireAdmin);
// User management routes with validation
router.get('/', userManagementController_1.getAllUsers);
router.post('/', userValidation_1.validateCreateUser, userManagementController_1.createUser);
router.put('/:id', userValidation_1.validateUserId, userValidation_1.validateUpdateUser, userManagementController_1.updateUser);
router.patch('/:id/role', userValidation_1.validateUserId, userManagementController_1.updateUserRole);
router.patch('/:id/toggle-status', userValidation_1.validateUserId, userManagementController_1.toggleUserStatus);
router.delete('/:id', userValidation_1.validateUserId, userManagementController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userManagementRoutes.js.map