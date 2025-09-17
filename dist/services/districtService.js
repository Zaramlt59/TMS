"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.districtService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
exports.districtService = {
    // Get all active districts
    async getAllActive() {
        try {
            return await prismaService_1.default.districts.findMany({
                where: { is_active: true },
                orderBy: { name: 'asc' }
            });
        }
        catch (error) {
            console.error('Error fetching active districts:', error);
            throw new Error('Failed to fetch districts');
        }
    },
    // Get all districts (including inactive)
    async getAll() {
        try {
            return await prismaService_1.default.districts.findMany({
                orderBy: { name: 'asc' }
            });
        }
        catch (error) {
            console.error('Error fetching all districts:', error);
            throw new Error('Failed to fetch districts');
        }
    },
    // Get district by ID
    async getById(id) {
        try {
            return await prismaService_1.default.districts.findUnique({
                where: { id },
                include: {
                    rd_blocks: true
                }
            });
        }
        catch (error) {
            console.error('Error fetching district by ID:', error);
            throw new Error('Failed to fetch district');
        }
    },
    // Create new district
    async create(data) {
        try {
            return await prismaService_1.default.districts.create({
                data
            });
        }
        catch (error) {
            console.error('Error creating district:', error);
            throw new Error('Failed to create district');
        }
    },
    // Update district
    async update(id, data) {
        try {
            return await prismaService_1.default.districts.update({
                where: { id },
                data
            });
        }
        catch (error) {
            console.error('Error updating district:', error);
            throw new Error('Failed to update district');
        }
    },
    // Soft delete district
    async delete(id) {
        try {
            return await prismaService_1.default.districts.update({
                where: { id },
                data: { is_active: false }
            });
        }
        catch (error) {
            console.error('Error deleting district:', error);
            throw new Error('Failed to delete district');
        }
    },
    // Hard delete district
    async hardDelete(id) {
        try {
            return await prismaService_1.default.districts.delete({
                where: { id }
            });
        }
        catch (error) {
            console.error('Error hard deleting district:', error);
            throw new Error('Failed to delete district');
        }
    }
};
//# sourceMappingURL=districtService.js.map