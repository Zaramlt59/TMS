"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategoryController = void 0;
const serviceCategoryService_1 = require("../services/serviceCategoryService");
class ServiceCategoryController {
    constructor() {
        this.service = new serviceCategoryService_1.ServiceCategoryService();
    }
    async getAll(req, res) {
        const result = await this.service.getAll();
        res.status(result.success ? 200 : 400).json(result);
    }
    async getActive(req, res) {
        const result = await this.service.getActive();
        res.status(result.success ? 200 : 400).json(result);
    }
    async getById(req, res) {
        const id = parseInt(req.params.id);
        const result = await this.service.getById(id);
        res.status(result.success ? 200 : 404).json(result);
    }
    async create(req, res) {
        const result = await this.service.create(req.body);
        res.status(result.success ? 201 : 400).json(result);
    }
    async update(req, res) {
        const id = parseInt(req.params.id);
        const result = await this.service.update(id, req.body);
        res.status(result.success ? 200 : 400).json(result);
    }
    async delete(req, res) {
        const id = parseInt(req.params.id);
        const result = await this.service.delete(id);
        res.status(result.success ? 200 : 404).json(result);
    }
    async hardDelete(req, res) {
        const id = parseInt(req.params.id);
        const result = await this.service.hardDelete(id);
        res.status(result.success ? 200 : 400).json(result);
    }
}
exports.ServiceCategoryController = ServiceCategoryController;
//# sourceMappingURL=serviceCategoryController.js.map