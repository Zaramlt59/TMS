"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDataService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
exports.masterDataService = {
    schoolType: {
        async getAll() {
            try {
                return await prismaService_1.default.school_types.findMany({
                    where: { is_active: true },
                    orderBy: { name: 'asc' }
                });
            }
            catch (error) {
                console.error('Error fetching school types:', error);
                throw new Error('Failed to fetch school types');
            }
        },
        async getById(id) {
            try {
                return await prismaService_1.default.school_types.findUnique({
                    where: { id }
                });
            }
            catch (error) {
                console.error('Error fetching school type by ID:', error);
                throw new Error('Failed to fetch school type');
            }
        },
        async create(data) {
            try {
                return await prismaService_1.default.school_types.create({
                    data
                });
            }
            catch (error) {
                console.error('Error creating school type:', error);
                throw new Error('Failed to create school type');
            }
        },
        async update(id, data) {
            try {
                return await prismaService_1.default.school_types.update({
                    where: { id },
                    data
                });
            }
            catch (error) {
                console.error('Error updating school type:', error);
                throw new Error('Failed to update school type');
            }
        },
        async delete(id) {
            try {
                return await prismaService_1.default.school_types.update({
                    where: { id },
                    data: { is_active: false }
                });
            }
            catch (error) {
                console.error('Error deleting school type:', error);
                throw new Error('Failed to delete school type');
            }
        }
    },
    medium: {
        async getAll() {
            try {
                return await prismaService_1.default.mediums.findMany({
                    where: { is_active: true },
                    orderBy: { name: 'asc' }
                });
            }
            catch (error) {
                console.error('Error fetching mediums:', error);
                throw new Error('Failed to fetch mediums');
            }
        },
        async getById(id) {
            try {
                return await prismaService_1.default.mediums.findUnique({
                    where: { id }
                });
            }
            catch (error) {
                console.error('Error fetching medium by ID:', error);
                throw new Error('Failed to fetch medium');
            }
        },
        async create(data) {
            try {
                return await prismaService_1.default.mediums.create({
                    data
                });
            }
            catch (error) {
                console.error('Error creating medium:', error);
                throw new Error('Failed to create medium');
            }
        },
        async update(id, data) {
            try {
                return await prismaService_1.default.mediums.update({
                    where: { id },
                    data
                });
            }
            catch (error) {
                console.error('Error updating medium:', error);
                throw new Error('Failed to update medium');
            }
        },
        async delete(id) {
            try {
                return await prismaService_1.default.mediums.update({
                    where: { id },
                    data: { is_active: false }
                });
            }
            catch (error) {
                console.error('Error deleting medium:', error);
                throw new Error('Failed to delete medium');
            }
        }
    },
    managementType: {
        async getAll() {
            try {
                return await prismaService_1.default.management_types.findMany({
                    where: { is_active: true },
                    orderBy: { name: 'asc' }
                });
            }
            catch (error) {
                console.error('Error fetching management types:', error);
                throw new Error('Failed to fetch management types');
            }
        },
        async getById(id) {
            try {
                return await prismaService_1.default.management_types.findUnique({
                    where: { id }
                });
            }
            catch (error) {
                console.error('Error fetching management type by ID:', error);
                throw new Error('Failed to fetch management type');
            }
        },
        async create(data) {
            try {
                return await prismaService_1.default.management_types.create({
                    data
                });
            }
            catch (error) {
                console.error('Error creating management type:', error);
                throw new Error('Failed to create management type');
            }
        },
        async update(id, data) {
            try {
                return await prismaService_1.default.management_types.update({
                    where: { id },
                    data
                });
            }
            catch (error) {
                console.error('Error updating management type:', error);
                throw new Error('Failed to update management type');
            }
        },
        async delete(id) {
            try {
                return await prismaService_1.default.management_types.update({
                    where: { id },
                    data: { is_active: false }
                });
            }
            catch (error) {
                console.error('Error deleting management type:', error);
                throw new Error('Failed to delete management type');
            }
        }
    },
    blockOffice: {
        async getAll() {
            try {
                return await prismaService_1.default.block_offices.findMany({
                    where: { is_active: true },
                    orderBy: { name: 'asc' }
                });
            }
            catch (error) {
                console.error('Error fetching block offices:', error);
                throw new Error('Failed to fetch block offices');
            }
        },
        async getById(id) {
            try {
                return await prismaService_1.default.block_offices.findUnique({
                    where: { id }
                });
            }
            catch (error) {
                console.error('Error fetching block office by ID:', error);
                throw new Error('Failed to fetch block office');
            }
        },
        async create(data) {
            try {
                return await prismaService_1.default.block_offices.create({
                    data
                });
            }
            catch (error) {
                console.error('Error creating block office:', error);
                throw new Error('Failed to create block office');
            }
        },
        async update(id, data) {
            try {
                return await prismaService_1.default.block_offices.update({
                    where: { id },
                    data
                });
            }
            catch (error) {
                console.error('Error updating block office:', error);
                throw new Error('Failed to update block office');
            }
        },
        async delete(id) {
            try {
                return await prismaService_1.default.block_offices.update({
                    where: { id },
                    data: { is_active: false }
                });
            }
            catch (error) {
                console.error('Error deleting block office:', error);
                throw new Error('Failed to delete block office');
            }
        }
    },
    religion: {
        async getAll() {
            try {
                return await prismaService_1.default.religions.findMany({
                    where: { is_active: true },
                    orderBy: { name: 'asc' }
                });
            }
            catch (error) {
                console.error('Error fetching religions:', error);
                throw new Error('Failed to fetch religions');
            }
        },
        async getById(id) {
            try {
                return await prismaService_1.default.religions.findUnique({
                    where: { id }
                });
            }
            catch (error) {
                console.error('Error fetching religion by ID:', error);
                throw new Error('Failed to fetch religion');
            }
        },
        async create(data) {
            try {
                return await prismaService_1.default.religions.create({
                    data
                });
            }
            catch (error) {
                console.error('Error creating religion:', error);
                throw new Error('Failed to create religion');
            }
        },
        async update(id, data) {
            try {
                return await prismaService_1.default.religions.update({
                    where: { id },
                    data
                });
            }
            catch (error) {
                console.error('Error updating religion:', error);
                throw new Error('Failed to update religion');
            }
        },
        async delete(id) {
            try {
                return await prismaService_1.default.religions.update({
                    where: { id },
                    data: { is_active: false }
                });
            }
            catch (error) {
                console.error('Error deleting religion:', error);
                throw new Error('Failed to delete religion');
            }
        }
    }
};
//# sourceMappingURL=masterDataService.js.map