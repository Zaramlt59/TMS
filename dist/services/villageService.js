"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.villageService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
exports.villageService = {
    // Get all active villages
    async getAllActive() {
        try {
            return await prismaService_1.default.villages.findMany({
                where: { is_active: true },
                include: {
                    rd_blocks: {
                        include: {
                            districts: true
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
        }
        catch (error) {
            console.error('Error fetching active villages:', error);
            throw new Error('Failed to fetch villages');
        }
    },
    // Get all villages (including inactive)
    async getAll() {
        try {
            return await prismaService_1.default.villages.findMany({
                include: {
                    rd_blocks: {
                        include: {
                            districts: true
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
        }
        catch (error) {
            console.error('Error fetching all villages:', error);
            throw new Error('Failed to fetch villages');
        }
    },
    // Get villages by RD block
    async getByRdBlock(rdBlockId) {
        try {
            return await prismaService_1.default.villages.findMany({
                where: {
                    rd_block_id: rdBlockId,
                    is_active: true
                },
                orderBy: { name: 'asc' }
            });
        }
        catch (error) {
            console.error('Error fetching villages by RD block:', error);
            throw new Error('Failed to fetch villages by RD block');
        }
    },
    // Get villages by district
    async getByDistrict(districtId) {
        try {
            return await prismaService_1.default.villages.findMany({
                where: {
                    rd_blocks: {
                        district_id: districtId
                    },
                    is_active: true
                },
                include: {
                    rd_blocks: true
                },
                orderBy: { name: 'asc' }
            });
        }
        catch (error) {
            console.error('Error fetching villages by district:', error);
            throw new Error('Failed to fetch villages by district');
        }
    },
    // Get village by ID
    async getById(id) {
        try {
            return await prismaService_1.default.villages.findUnique({
                where: { id },
                include: {
                    rd_blocks: {
                        include: {
                            districts: true
                        }
                    }
                }
            });
        }
        catch (error) {
            console.error('Error fetching village by ID:', error);
            throw new Error('Failed to fetch village');
        }
    },
    // Create new village
    async create(data) {
        try {
            return await prismaService_1.default.villages.create({
                data,
                include: {
                    rd_blocks: {
                        include: {
                            districts: true
                        }
                    }
                }
            });
        }
        catch (error) {
            console.error('Error creating village:', error);
            throw new Error('Failed to create village');
        }
    },
    // Update village
    async update(id, data) {
        try {
            return await prismaService_1.default.villages.update({
                where: { id },
                data,
                include: {
                    rd_blocks: {
                        include: {
                            districts: true
                        }
                    }
                }
            });
        }
        catch (error) {
            console.error('Error updating village:', error);
            throw new Error('Failed to update village');
        }
    },
    // Soft delete village
    async delete(id) {
        try {
            return await prismaService_1.default.villages.update({
                where: { id },
                data: { is_active: false }
            });
        }
        catch (error) {
            console.error('Error deleting village:', error);
            throw new Error('Failed to delete village');
        }
    },
    // Hard delete village
    async hardDelete(id) {
        try {
            return await prismaService_1.default.villages.delete({
                where: { id }
            });
        }
        catch (error) {
            console.error('Error hard deleting village:', error);
            throw new Error('Failed to delete village');
        }
    }
};
//# sourceMappingURL=villageService.js.map