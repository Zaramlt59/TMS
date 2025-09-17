"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const rolesController_1 = require("../controllers/rolesController");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Get all available roles and their information
router.get('/', rolesController_1.rolesController.getAllRoles);
// Get permissions for a specific role
router.get('/:role/permissions', [
    (0, express_validator_1.param)('role').isIn(['super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher'])
        .withMessage('Invalid role specified')
], rolesController_1.rolesController.getRolePermissions);
// Get role hierarchy information
router.get('/hierarchy', rolesController_1.rolesController.getRoleHierarchy);
// Get all available permissions
router.get('/permissions/all', rolesController_1.rolesController.getAllPermissions);
exports.default = router;
//# sourceMappingURL=rolesRoutes.js.map