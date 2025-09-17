"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const prismaService_1 = __importDefault(require("../services/prismaService"));
const router = express_1.default.Router();
// Get all districts
router.get('/districts', async (req, res) => {
    try {
        const districts = await prismaService_1.default.districts.findMany({
            where: { is_active: true },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
        res.json({
            success: true,
            message: 'Districts retrieved successfully',
            data: districts
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve districts',
            error: error.message
        });
    }
});
// Get all RD blocks (for settings) - MUST come before the specific route
router.get('/rd-blocks', async (req, res) => {
    try {
        const rdBlocks = await prismaService_1.default.rd_blocks.findMany({
            include: {
                districts: {
                    select: { name: true }
                }
            },
            orderBy: [
                { districts: { name: 'asc' } },
                { name: 'asc' }
            ]
        });
        const formattedRdBlocks = rdBlocks.map(rb => ({
            id: rb.id,
            name: rb.name,
            district_id: rb.district_id,
            is_active: rb.is_active,
            district_name: rb.districts.name
        }));
        res.json({
            success: true,
            message: 'RD Blocks retrieved successfully',
            data: formattedRdBlocks
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve RD Blocks',
            error: error.message
        });
    }
});
// Get all RD blocks (including inactive)
router.get('/rd-blocks/all', async (req, res) => {
    try {
        const rdBlocks = await prismaService_1.default.rd_blocks.findMany({
            include: {
                districts: {
                    select: { name: true }
                }
            },
            orderBy: [
                { districts: { name: 'asc' } },
                { name: 'asc' }
            ]
        });
        const formattedRdBlocks = rdBlocks.map(rb => ({
            id: rb.id,
            name: rb.name,
            district_id: rb.district_id,
            is_active: rb.is_active,
            district_name: rb.districts.name
        }));
        res.json({
            success: true,
            message: 'All RD Blocks retrieved successfully',
            data: formattedRdBlocks
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve all RD Blocks',
            error: error.message
        });
    }
});
// Get active RD blocks only
router.get('/rd-blocks/active', async (req, res) => {
    try {
        const rdBlocks = await prismaService_1.default.rd_blocks.findMany({
            where: { is_active: true },
            include: {
                districts: {
                    select: { name: true }
                }
            },
            orderBy: [
                { districts: { name: 'asc' } },
                { name: 'asc' }
            ]
        });
        const formattedRdBlocks = rdBlocks.map(rb => ({
            id: rb.id,
            name: rb.name,
            district_id: rb.district_id,
            is_active: rb.is_active,
            district_name: rb.districts.name
        }));
        res.json({
            success: true,
            message: 'Active RD Blocks retrieved successfully',
            data: formattedRdBlocks
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve active RD Blocks',
            error: error.message
        });
    }
});
// Get all villages/habitations (for settings) - MUST come before the specific route
router.get('/villages', async (req, res) => {
    try {
        const villages = await prismaService_1.default.villages.findMany({
            include: {
                rd_blocks: {
                    include: {
                        districts: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: [
                { rd_blocks: { districts: { name: 'asc' } } },
                { rd_blocks: { name: 'asc' } },
                { name: 'asc' }
            ]
        });
        const formattedVillages = villages.map(v => ({
            id: v.id,
            name: v.name,
            rd_block_id: v.rd_block_id,
            is_active: v.is_active,
            rd_block_name: v.rd_blocks.name,
            district_name: v.rd_blocks.districts.name
        }));
        res.json({
            success: true,
            message: 'Villages retrieved successfully',
            data: formattedVillages
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve villages',
            error: error.message
        });
    }
});
// Get all villages/habitations (including inactive)
router.get('/villages/all', async (req, res) => {
    try {
        const villages = await prismaService_1.default.villages.findMany({
            include: {
                rd_blocks: {
                    include: {
                        districts: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: [
                { rd_blocks: { districts: { name: 'asc' } } },
                { rd_blocks: { name: 'asc' } },
                { name: 'asc' }
            ]
        });
        const formattedVillages = villages.map(v => ({
            id: v.id,
            name: v.name,
            rd_block_id: v.rd_block_id,
            is_active: v.is_active,
            rd_block_name: v.rd_blocks.name,
            district_name: v.rd_blocks.districts.name
        }));
        res.json({
            success: true,
            message: 'All Villages retrieved successfully',
            data: formattedVillages
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve all villages',
            error: error.message
        });
    }
});
// Get active villages/habitations only
router.get('/villages/active', async (req, res) => {
    try {
        const villages = await prismaService_1.default.villages.findMany({
            where: { is_active: true },
            include: {
                rd_blocks: {
                    include: {
                        districts: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: [
                { rd_blocks: { districts: { name: 'asc' } } },
                { rd_blocks: { name: 'asc' } },
                { name: 'asc' }
            ]
        });
        const formattedVillages = villages.map(v => ({
            id: v.id,
            name: v.name,
            rd_block_id: v.rd_block_id,
            is_active: v.is_active,
            rd_block_name: v.rd_blocks.name,
            district_name: v.rd_blocks.districts.name
        }));
        res.json({
            success: true,
            message: 'Active Villages retrieved successfully',
            data: formattedVillages
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve active villages',
            error: error.message
        });
    }
});
// Get RD Blocks by district ID
router.get('/rd-blocks/:districtId', [
    (0, express_validator_1.param)('districtId').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], async (req, res) => {
    try {
        const { districtId } = req.params;
        const rdBlocks = await prismaService_1.default.rd_blocks.findMany({
            where: {
                district_id: parseInt(districtId),
                is_active: true
            },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
        res.json({
            success: true,
            message: 'RD Blocks retrieved successfully',
            data: rdBlocks
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve RD Blocks',
            error: error.message
        });
    }
});
// Get villages by RD Block ID
router.get('/villages/:rdBlockId', [
    (0, express_validator_1.param)('rdBlockId').isInt({ min: 1 }).withMessage('RD Block ID must be a positive integer')
], async (req, res) => {
    try {
        const { rdBlockId } = req.params;
        const villages = await prismaService_1.default.villages.findMany({
            where: {
                rd_block_id: parseInt(rdBlockId),
                is_active: true
            },
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });
        res.json({
            success: true,
            message: 'Villages retrieved successfully',
            data: villages
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve villages',
            error: error.message
        });
    }
});
// Create RD Block
router.post('/rd-blocks', async (req, res) => {
    try {
        const { name, district_id } = req.body;
        if (!name || !district_id) {
            return res.status(400).json({
                success: false,
                message: 'Name and district_id are required'
            });
        }
        const newRdBlock = await prismaService_1.default.rd_blocks.create({
            data: {
                name,
                district_id: parseInt(district_id)
            }
        });
        res.status(201).json({
            success: true,
            message: 'RD Block created successfully',
            data: newRdBlock
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create RD Block',
            error: error.message
        });
    }
});
// Update RD Block
router.put('/rd-blocks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, district_id, is_active } = req.body;
        if (!name || !district_id) {
            return res.status(400).json({
                success: false,
                message: 'Name and district_id are required'
            });
        }
        const isActive = is_active !== undefined ? is_active : true;
        const updatedRdBlock = await prismaService_1.default.rd_blocks.update({
            where: { id: parseInt(id) },
            data: {
                name,
                district_id: parseInt(district_id),
                is_active
            }
        });
        res.json({
            success: true,
            message: 'RD Block updated successfully',
            data: updatedRdBlock
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update RD Block',
            error: error.message
        });
    }
});
// Delete RD Block (soft delete)
router.delete('/rd-blocks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if RD Block is being used by any habitation
        const checkResult = await prismaService_1.default.villages.findMany({
            where: { rd_block_id: parseInt(id) }
        });
        if (checkResult.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete RD Block',
                error: `RD Block is being used by ${checkResult.length} habitation(s)`
            });
        }
        // Soft delete - set is_active to false
        await prismaService_1.default.rd_blocks.update({
            where: { id: parseInt(id) },
            data: { is_active: false }
        });
        res.json({
            success: true,
            message: 'RD Block deleted successfully',
            data: null
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete RD Block',
            error: error.message
        });
    }
});
// Hard delete RD Block (permanent removal)
router.delete('/rd-blocks/:id/permanent', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if RD Block is being used by any habitation
        const checkResult = await prismaService_1.default.villages.findMany({
            where: { rd_block_id: parseInt(id) }
        });
        if (checkResult.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete RD Block',
                error: `RD Block is being used by ${checkResult.length} habitation(s)`
            });
        }
        // Hard delete - remove from database
        await prismaService_1.default.rd_blocks.delete({
            where: { id: parseInt(id) }
        });
        res.json({
            success: true,
            message: 'RD Block permanently deleted',
            data: null
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to permanently delete RD Block',
            error: error.message
        });
    }
});
// Create Habitation
router.post('/habitations', async (req, res) => {
    try {
        const { name, rd_block_id } = req.body;
        if (!name || !rd_block_id) {
            return res.status(400).json({
                success: false,
                message: 'Name and rd_block_id are required'
            });
        }
        const newHabitation = await prismaService_1.default.villages.create({
            data: {
                name,
                rd_block_id: parseInt(rd_block_id)
            }
        });
        res.status(201).json({
            success: true,
            message: 'Habitation created successfully',
            data: newHabitation
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create habitation',
            error: error.message
        });
    }
});
// Update Habitation
router.put('/habitations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rd_block_id, is_active } = req.body;
        if (!name || !rd_block_id) {
            return res.status(400).json({
                success: false,
                message: 'Name and rd_block_id are required'
            });
        }
        const isActive = is_active !== undefined ? is_active : true;
        const updatedHabitation = await prismaService_1.default.villages.update({
            where: { id: parseInt(id) },
            data: {
                name,
                rd_block_id: parseInt(rd_block_id),
                is_active
            }
        });
        res.json({
            success: true,
            message: 'Habitation updated successfully',
            data: updatedHabitation
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update habitation',
            error: error.message
        });
    }
});
// Delete Habitation (soft delete)
router.delete('/habitations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if habitation is being used by any teacher
        const checkResult = await prismaService_1.default.teachers.findMany({
            where: { habitation: (await prismaService_1.default.villages.findUnique({ where: { id: parseInt(id) } }))?.name }
        });
        if (checkResult.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete habitation',
                error: `Habitation is being used by ${checkResult.length} teacher(s)`
            });
        }
        // Soft delete - set is_active to false
        await prismaService_1.default.villages.update({
            where: { id: parseInt(id) },
            data: { is_active: false }
        });
        res.json({
            success: true,
            message: 'Habitation deleted successfully',
            data: null
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete habitation',
            error: error.message
        });
    }
});
// Hard delete Habitation (permanent removal)
router.delete('/habitations/:id/permanent', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if habitation is being used by any teacher
        const checkResult = await prismaService_1.default.teachers.findMany({
            where: { habitation: (await prismaService_1.default.villages.findUnique({ where: { id: parseInt(id) } }))?.name }
        });
        if (checkResult.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete habitation',
                error: `Habitation is being used by ${checkResult.length} teacher(s)`
            });
        }
        // Hard delete - remove from database
        await prismaService_1.default.villages.delete({
            where: { id: parseInt(id) }
        });
        res.json({
            success: true,
            message: 'Habitation permanently deleted',
            data: null
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to permanently delete habitation',
            error: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=locationRoutes.js.map