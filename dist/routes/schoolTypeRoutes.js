"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schoolTypeController_1 = require("../controllers/schoolTypeController");
const router = express_1.default.Router();
const schoolTypeController = new schoolTypeController_1.SchoolTypeController();
// Get all school types (including inactive)
router.get('/', schoolTypeController.getAllSchoolTypes.bind(schoolTypeController));
// Get all school types including inactive (for admin)
router.get('/all', schoolTypeController.getAllSchoolTypesAdmin.bind(schoolTypeController));
// Get active school types only (for forms)
router.get('/active', schoolTypeController.getActiveSchoolTypes.bind(schoolTypeController));
// Get school type by ID
router.get('/:id', schoolTypeController.getSchoolTypeById.bind(schoolTypeController));
// Create new school type
router.post('/', schoolTypeController.createSchoolType.bind(schoolTypeController));
// Update school type
router.put('/:id', schoolTypeController.updateSchoolType.bind(schoolTypeController));
// Delete school type (soft delete)
router.delete('/:id', schoolTypeController.deleteSchoolType.bind(schoolTypeController));
// Hard delete school type (permanent)
router.delete('/:id/permanent', schoolTypeController.hardDeleteSchoolType.bind(schoolTypeController));
exports.default = router;
//# sourceMappingURL=schoolTypeRoutes.js.map