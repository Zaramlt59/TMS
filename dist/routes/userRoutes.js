"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Setup admin route (for initial setup only)
if (process.env.NODE_ENV !== 'production') {
    router.post('/setup-admin', userController_1.createDefaultAdmin);
}
// Protected routes - require authentication
router.post('/register', auth_1.authenticateToken, auth_1.requireAdmin, userController_1.validateUserRegistration, userController_1.registerUser);
router.get('/', auth_1.authenticateToken, auth_1.requireAdmin, userController_1.getAllUsers);
router.get('/:id', auth_1.authenticateToken, auth_1.requireAdmin, userController_1.getUserById);
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, userController_1.validateUserUpdate, userController_1.updateUser);
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, userController_1.deleteUser);
// User profile management routes
router.get('/me', auth_1.authenticateToken, userController_1.getCurrentUser);
router.put('/me', auth_1.authenticateToken, userController_1.updateCurrentUser);
router.post('/change-password', auth_1.authenticateToken, userController_1.changePassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map