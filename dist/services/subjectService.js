"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
exports.subjectService = {
    // Get all subjects
    async getAll() {
        try {
            return await prismaService_1.default.subjects.findMany({
                orderBy: { name: 'asc' }
            });
        }
        catch (error) {
            console.error('Error fetching subjects:', error);
            throw new Error('Failed to fetch subjects');
        }
    },
    // Get subject by ID
    async getById(id) {
        try {
            return await prismaService_1.default.subjects.findUnique({
                where: { id }
            });
        }
        catch (error) {
            console.error('Error fetching subject by ID:', error);
            throw new Error('Failed to fetch subject');
        }
    },
    // Get subject by code
    async getByCode(code) {
        try {
            return await prismaService_1.default.subjects.findFirst({
                where: { code }
            });
        }
        catch (error) {
            console.error('Error fetching subject by code:', error);
            throw new Error('Failed to fetch subject');
        }
    },
    // Create new subject
    async create(data) {
        try {
            return await prismaService_1.default.subjects.create({
                data
            });
        }
        catch (error) {
            console.error('Error creating subject:', error);
            throw new Error('Failed to create subject');
        }
    },
    // Update subject
    async update(id, data) {
        try {
            return await prismaService_1.default.subjects.update({
                where: { id },
                data
            });
        }
        catch (error) {
            console.error('Error updating subject:', error);
            throw new Error('Failed to update subject');
        }
    },
    // Delete subject
    async delete(id) {
        try {
            return await prismaService_1.default.subjects.delete({
                where: { id }
            });
        }
        catch (error) {
            console.error('Error deleting subject:', error);
            throw new Error('Failed to delete subject');
        }
    }
};
//# sourceMappingURL=subjectService.js.map