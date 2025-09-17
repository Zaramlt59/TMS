"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDataController = void 0;
const masterDataService_1 = require("../services/masterDataService");
exports.masterDataController = {
    // School Type operations
    schoolType: {
        async getAll(req, res) {
            try {
                const schoolTypes = await masterDataService_1.masterDataService.schoolType.getAll();
                res.json({
                    success: true,
                    message: 'School types retrieved successfully',
                    data: schoolTypes
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve school types',
                    error: error.message
                });
            }
        },
        async getById(req, res) {
            try {
                const id = parseInt(req.params.id);
                const schoolType = await masterDataService_1.masterDataService.schoolType.getById(id);
                if (!schoolType) {
                    return res.status(404).json({
                        success: false,
                        message: 'School type not found'
                    });
                }
                res.json({
                    success: true,
                    message: 'School type retrieved successfully',
                    data: schoolType
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve school type',
                    error: error.message
                });
            }
        },
        async create(req, res) {
            try {
                const { name, isActive = true } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'School type name is required'
                    });
                }
                const schoolType = await masterDataService_1.masterDataService.schoolType.create({ name, is_active: isActive });
                res.status(201).json({
                    success: true,
                    message: 'School type created successfully',
                    data: schoolType
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create school type',
                    error: error.message
                });
            }
        },
        async update(req, res) {
            try {
                const id = parseInt(req.params.id);
                const { name, isActive } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'School type name is required'
                    });
                }
                const schoolType = await masterDataService_1.masterDataService.schoolType.update(id, { name, is_active: isActive });
                res.json({
                    success: true,
                    message: 'School type updated successfully',
                    data: schoolType
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update school type',
                    error: error.message
                });
            }
        },
        async delete(req, res) {
            try {
                const id = parseInt(req.params.id);
                const schoolType = await masterDataService_1.masterDataService.schoolType.delete(id);
                res.json({
                    success: true,
                    message: 'School type deleted successfully',
                    data: schoolType
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete school type',
                    error: error.message
                });
            }
        }
    },
    // Medium operations
    medium: {
        async getAll(req, res) {
            try {
                const mediums = await masterDataService_1.masterDataService.medium.getAll();
                res.json({
                    success: true,
                    message: 'Mediums retrieved successfully',
                    data: mediums
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve mediums',
                    error: error.message
                });
            }
        },
        async getById(req, res) {
            try {
                const id = parseInt(req.params.id);
                const medium = await masterDataService_1.masterDataService.medium.getById(id);
                if (!medium) {
                    return res.status(404).json({
                        success: false,
                        message: 'Medium not found'
                    });
                }
                res.json({
                    success: true,
                    message: 'Medium retrieved successfully',
                    data: medium
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve medium',
                    error: error.message
                });
            }
        },
        async create(req, res) {
            try {
                const { name, isActive = true } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Medium name is required'
                    });
                }
                const medium = await masterDataService_1.masterDataService.medium.create({ name, is_active: isActive });
                res.status(201).json({
                    success: true,
                    message: 'Medium created successfully',
                    data: medium
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create medium',
                    error: error.message
                });
            }
        },
        async update(req, res) {
            try {
                const id = parseInt(req.params.id);
                const { name, isActive } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Medium name is required'
                    });
                }
                const medium = await masterDataService_1.masterDataService.medium.update(id, { name, is_active: isActive });
                res.json({
                    success: true,
                    message: 'Medium updated successfully',
                    data: medium
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update medium',
                    error: error.message
                });
            }
        },
        async delete(req, res) {
            try {
                const id = parseInt(req.params.id);
                const medium = await masterDataService_1.masterDataService.medium.delete(id);
                res.json({
                    success: true,
                    message: 'Medium deleted successfully',
                    data: medium
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete medium',
                    error: error.message
                });
            }
        }
    },
    // Management Type operations
    managementType: {
        async getAll(req, res) {
            try {
                const managementTypes = await masterDataService_1.masterDataService.managementType.getAll();
                res.json({
                    success: true,
                    message: 'Management types retrieved successfully',
                    data: managementTypes
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve management types',
                    error: error.message
                });
            }
        },
        async getById(req, res) {
            try {
                const id = parseInt(req.params.id);
                const managementType = await masterDataService_1.masterDataService.managementType.getById(id);
                if (!managementType) {
                    return res.status(404).json({
                        success: false,
                        message: 'Management type not found'
                    });
                }
                res.json({
                    success: true,
                    message: 'Management type retrieved successfully',
                    data: managementType
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve management type',
                    error: error.message
                });
            }
        },
        async create(req, res) {
            try {
                const { name, isActive = true } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Management type name is required'
                    });
                }
                const managementType = await masterDataService_1.masterDataService.managementType.create({ name, is_active: isActive });
                res.status(201).json({
                    success: true,
                    message: 'Management type created successfully',
                    data: managementType
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create management type',
                    error: error.message
                });
            }
        },
        async update(req, res) {
            try {
                const id = parseInt(req.params.id);
                const { name, isActive } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Management type name is required'
                    });
                }
                const managementType = await masterDataService_1.masterDataService.managementType.update(id, { name, is_active: isActive });
                res.json({
                    success: true,
                    message: 'Management type updated successfully',
                    data: managementType
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update management type',
                    error: error.message
                });
            }
        },
        async delete(req, res) {
            try {
                const id = parseInt(req.params.id);
                const managementType = await masterDataService_1.masterDataService.managementType.delete(id);
                res.json({
                    success: true,
                    message: 'Management type deleted successfully',
                    data: managementType
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete management type',
                    error: error.message
                });
            }
        }
    },
    // Block Office operations
    blockOffice: {
        async getAll(req, res) {
            try {
                const blockOffices = await masterDataService_1.masterDataService.blockOffice.getAll();
                res.json({
                    success: true,
                    message: 'Block offices retrieved successfully',
                    data: blockOffices
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve block offices',
                    error: error.message
                });
            }
        },
        async getById(req, res) {
            try {
                const id = parseInt(req.params.id);
                const blockOffice = await masterDataService_1.masterDataService.blockOffice.getById(id);
                if (!blockOffice) {
                    return res.status(404).json({
                        success: false,
                        message: 'Block office not found'
                    });
                }
                res.json({
                    success: true,
                    message: 'Block office retrieved successfully',
                    data: blockOffice
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve block office',
                    error: error.message
                });
            }
        },
        async create(req, res) {
            try {
                const { name, isActive = true } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Block office name is required'
                    });
                }
                const blockOffice = await masterDataService_1.masterDataService.blockOffice.create({ name, is_active: isActive });
                res.status(201).json({
                    success: true,
                    message: 'Block office created successfully',
                    data: blockOffice
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create block office',
                    error: error.message
                });
            }
        },
        async update(req, res) {
            try {
                const id = parseInt(req.params.id);
                const { name, isActive } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Block office name is required'
                    });
                }
                const blockOffice = await masterDataService_1.masterDataService.blockOffice.update(id, { name, is_active: isActive });
                res.json({
                    success: true,
                    message: 'Block office updated successfully',
                    data: blockOffice
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update block office',
                    error: error.message
                });
            }
        },
        async delete(req, res) {
            try {
                const id = parseInt(req.params.id);
                const blockOffice = await masterDataService_1.masterDataService.blockOffice.delete(id);
                res.json({
                    success: true,
                    message: 'Block office deleted successfully',
                    data: blockOffice
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete block office',
                    error: error.message
                });
            }
        }
    },
    // Religion operations
    religion: {
        async getAll(req, res) {
            try {
                const religions = await masterDataService_1.masterDataService.religion.getAll();
                res.json({
                    success: true,
                    message: 'Religions retrieved successfully',
                    data: religions
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve religions',
                    error: error.message
                });
            }
        },
        async getById(req, res) {
            try {
                const id = parseInt(req.params.id);
                const religion = await masterDataService_1.masterDataService.religion.getById(id);
                if (!religion) {
                    return res.status(404).json({
                        success: false,
                        message: 'Religion not found'
                    });
                }
                res.json({
                    success: true,
                    message: 'Religion retrieved successfully',
                    data: religion
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve religion',
                    error: error.message
                });
            }
        },
        async create(req, res) {
            try {
                const { name, isActive = true } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Religion name is required'
                    });
                }
                const religion = await masterDataService_1.masterDataService.religion.create({ name, is_active: isActive });
                res.status(201).json({
                    success: true,
                    message: 'Religion created successfully',
                    data: religion
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create religion',
                    error: error.message
                });
            }
        },
        async update(req, res) {
            try {
                const id = parseInt(req.params.id);
                const { name, isActive } = req.body;
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Religion name is required'
                    });
                }
                const religion = await masterDataService_1.masterDataService.religion.update(id, { name, is_active: isActive });
                res.json({
                    success: true,
                    message: 'Religion updated successfully',
                    data: religion
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update religion',
                    error: error.message
                });
            }
        },
        async delete(req, res) {
            try {
                const id = parseInt(req.params.id);
                const religion = await masterDataService_1.masterDataService.religion.delete(id);
                res.json({
                    success: true,
                    message: 'Religion deleted successfully',
                    data: religion
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete religion',
                    error: error.message
                });
            }
        }
    }
};
//# sourceMappingURL=masterDataController.js.map