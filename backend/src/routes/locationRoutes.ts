import express from 'express'
import { param } from 'express-validator'
import { database } from '../database/connection'

const router = express.Router()

// Get all districts
router.get('/districts', async (req, res) => {
  try {
    const districts = await database.query<any[]>('SELECT id, name FROM districts WHERE is_active = TRUE ORDER BY name')
    res.json({
      success: true,
      message: 'Districts retrieved successfully',
      data: districts
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve districts',
      error: error.message
    })
  }
})

// Get all RD blocks (for settings) - MUST come before the specific route
router.get('/rd-blocks', async (req, res) => {
  try {
    const rdBlocks = await database.query<any[]>(
      'SELECT rb.id, rb.name, rb.district_id, rb.is_active, d.name as district_name FROM rd_blocks rb JOIN districts d ON rb.district_id = d.id ORDER BY d.name, rb.name'
    )
    res.json({
      success: true,
      message: 'RD Blocks retrieved successfully',
      data: rdBlocks
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve RD Blocks',
      error: error.message
    })
  }
})

// Get all RD blocks (including inactive)
router.get('/rd-blocks/all', async (req, res) => {
  try {
    const rdBlocks = await database.query<any[]>(
      'SELECT rb.id, rb.name, rb.district_id, rb.is_active, d.name as district_name FROM rd_blocks rb JOIN districts d ON rb.district_id = d.id ORDER BY d.name, rb.name'
    )
    res.json({
      success: true,
      message: 'All RD Blocks retrieved successfully',
      data: rdBlocks
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve all RD Blocks',
      error: error.message
    })
  }
})

// Get active RD blocks only
router.get('/rd-blocks/active', async (req, res) => {
  try {
    const rdBlocks = await database.query<any[]>(
      'SELECT rb.id, rb.name, rb.district_id, rb.is_active, d.name as district_name FROM rd_blocks rb JOIN districts d ON rb.district_id = d.id WHERE rb.is_active = TRUE ORDER BY d.name, rb.name'
    )
    res.json({
      success: true,
      message: 'Active RD Blocks retrieved successfully',
      data: rdBlocks
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active RD Blocks',
      error: error.message
    })
  }
})

// Get all villages/habitations (for settings) - MUST come before the specific route
router.get('/villages', async (req, res) => {
  try {
    const villages = await database.query<any[]>(
      'SELECT v.id, v.name, v.rd_block_id, v.is_active, rb.name as rd_block_name, d.name as district_name FROM villages v JOIN rd_blocks rb ON v.rd_block_id = rb.id JOIN districts d ON rb.district_id = d.id ORDER BY d.name, rb.name, v.name'
    )
    res.json({
      success: true,
      message: 'Villages retrieved successfully',
      data: villages
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve villages',
      error: error.message
    })
  }
})

// Get all villages/habitations (including inactive)
router.get('/villages/all', async (req, res) => {
  try {
    const villages = await database.query<any[]>(
      'SELECT v.id, v.name, v.rd_block_id, v.is_active, rb.name as rd_block_name, d.name as district_name FROM villages v JOIN rd_blocks rb ON v.rd_block_id = rb.id JOIN districts d ON rb.district_id = d.id ORDER BY d.name, rb.name, v.name'
    )
    res.json({
      success: true,
      message: 'All Villages retrieved successfully',
      data: villages
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve all villages',
      error: error.message
    })
  }
})

// Get active villages/habitations only
router.get('/villages/active', async (req, res) => {
  try {
    const villages = await database.query<any[]>(
      'SELECT v.id, v.name, v.rd_block_id, v.is_active, rb.name as rd_block_name, d.name as district_name FROM villages v JOIN rd_blocks rb ON v.rd_block_id = rb.id JOIN districts d ON rb.district_id = d.id WHERE v.is_active = TRUE ORDER BY d.name, rb.name, v.name'
    )
    res.json({
      success: true,
      message: 'Active Villages retrieved successfully',
      data: villages
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active villages',
      error: error.message
    })
  }
})

// Get RD Blocks by district ID
router.get('/rd-blocks/:districtId', [
  param('districtId').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], async (req, res) => {
  try {
    const { districtId } = req.params
    const rdBlocks = await database.query<any[]>(
      'SELECT id, name FROM rd_blocks WHERE district_id = ? AND is_active = TRUE ORDER BY name',
      [districtId]
    )
    res.json({
      success: true,
      message: 'RD Blocks retrieved successfully',
      data: rdBlocks
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve RD Blocks',
      error: error.message
    })
  }
})

// Get villages by RD Block ID
router.get('/villages/:rdBlockId', [
  param('rdBlockId').isInt({ min: 1 }).withMessage('RD Block ID must be a positive integer')
], async (req, res) => {
  try {
    const { rdBlockId } = req.params
    const villages = await database.query<any[]>(
      'SELECT id, name FROM villages WHERE rd_block_id = ? AND is_active = TRUE ORDER BY name',
      [rdBlockId]
    )
    res.json({
      success: true,
      message: 'Villages retrieved successfully',
      data: villages
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve villages',
      error: error.message
    })
  }
})

// Create RD Block
router.post('/rd-blocks', async (req, res) => {
  try {
    const { name, district_id } = req.body
    if (!name || !district_id) {
      return res.status(400).json({
        success: false,
        message: 'Name and district_id are required'
      })
    }
    
    const result = await database.query(
      'INSERT INTO rd_blocks (name, district_id) VALUES (?, ?)',
      [name, district_id]
    )
    
    const newRdBlock = await database.query<any[]>(
      'SELECT id, name, district_id FROM rd_blocks WHERE id = ?',
      [(result as any).insertId]
    )
    
    res.status(201).json({
      success: true,
      message: 'RD Block created successfully',
      data: newRdBlock[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create RD Block',
      error: error.message
    })
  }
})

// Update RD Block
router.put('/rd-blocks/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, district_id, is_active } = req.body
    
    if (!name || !district_id) {
      return res.status(400).json({
        success: false,
        message: 'Name and district_id are required'
      })
    }
    
    const isActive = is_active !== undefined ? is_active : true
    
    await database.query(
      'UPDATE rd_blocks SET name = ?, district_id = ?, is_active = ? WHERE id = ?',
      [name, district_id, isActive, id]
    )
    
    const updatedRdBlock = await database.query<any[]>(
      'SELECT id, name, district_id, is_active FROM rd_blocks WHERE id = ?',
      [id]
    )
    
    res.json({
      success: true,
      message: 'RD Block updated successfully',
      data: updatedRdBlock[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update RD Block',
      error: error.message
    })
  }
})

// Delete RD Block (soft delete)
router.delete('/rd-blocks/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if RD Block is being used by any habitation
    const checkResult = await database.query<any[]>(
      'SELECT COUNT(*) as count FROM villages WHERE rd_block_id = ?',
      [id]
    )
    
    if (checkResult[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete RD Block',
        error: `RD Block is being used by ${checkResult[0].count} habitation(s)`
      })
    }
    
    // Soft delete - set is_active to false
    await database.query('UPDATE rd_blocks SET is_active = FALSE WHERE id = ?', [id])
    
    res.json({
      success: true,
      message: 'RD Block deleted successfully',
      data: null
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete RD Block',
      error: error.message
    })
  }
})

// Hard delete RD Block (permanent removal)
router.delete('/rd-blocks/:id/permanent', async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if RD Block is being used by any habitation
    const checkResult = await database.query<any[]>(
      'SELECT COUNT(*) as count FROM villages WHERE rd_block_id = ?',
      [id]
    )
    
    if (checkResult[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete RD Block',
        error: `RD Block is being used by ${checkResult[0].count} habitation(s)`
      })
    }
    
    // Hard delete - remove from database
    await database.query('DELETE FROM rd_blocks WHERE id = ?', [id])
    
    res.json({
      success: true,
      message: 'RD Block permanently deleted',
      data: null
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete RD Block',
      error: error.message
    })
  }
})

// Create Habitation
router.post('/habitations', async (req, res) => {
  try {
    const { name, rd_block_id } = req.body
    if (!name || !rd_block_id) {
      return res.status(400).json({
        success: false,
        message: 'Name and rd_block_id are required'
      })
    }
    
    const result = await database.query(
      'INSERT INTO villages (name, rd_block_id) VALUES (?, ?)',
      [name, rd_block_id]
    )
    
    const newHabitation = await database.query<any[]>(
      'SELECT id, name, rd_block_id FROM villages WHERE id = ?',
      [(result as any).insertId]
    )
    
    res.status(201).json({
      success: true,
      message: 'Habitation created successfully',
      data: newHabitation[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create habitation',
      error: error.message
    })
  }
})

// Update Habitation
router.put('/habitations/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, rd_block_id, is_active } = req.body
    
    if (!name || !rd_block_id) {
      return res.status(400).json({
        success: false,
        message: 'Name and rd_block_id are required'
      })
    }
    
    const isActive = is_active !== undefined ? is_active : true
    
    await database.query(
      'UPDATE villages SET name = ?, rd_block_id = ?, is_active = ? WHERE id = ?',
      [name, rd_block_id, isActive, id]
    )
    
    const updatedHabitation = await database.query<any[]>(
      'SELECT id, name, rd_block_id, is_active FROM villages WHERE id = ?',
      [id]
    )
    
    res.json({
      success: true,
      message: 'Habitation updated successfully',
      data: updatedHabitation[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update habitation',
      error: error.message
    })
  }
})

// Delete Habitation (soft delete)
router.delete('/habitations/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if habitation is being used by any teacher
    const checkResult = await database.query<any[]>(
      'SELECT COUNT(*) as count FROM teachers WHERE habitation = (SELECT name FROM villages WHERE id = ?)',
      [id]
    )
    
    if (checkResult[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete habitation',
        error: `Habitation is being used by ${checkResult[0].count} teacher(s)`
      })
    }
    
    // Soft delete - set is_active to false
    await database.query('UPDATE villages SET is_active = FALSE WHERE id = ?', [id])
    
    res.json({
      success: true,
      message: 'Habitation deleted successfully',
      data: null
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete habitation',
      error: error.message
    })
  }
})

// Hard delete Habitation (permanent removal)
router.delete('/habitations/:id/permanent', async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if habitation is being used by any teacher
    const checkResult = await database.query<any[]>(
      'SELECT COUNT(*) as count FROM teachers WHERE habitation = (SELECT name FROM villages WHERE id = ?)',
      [id]
    )
    
    if (checkResult[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete habitation',
        error: `Habitation is being used by ${checkResult[0].count} teacher(s)`
      })
    }
    
    // Hard delete - remove from database
    await database.query('DELETE FROM villages WHERE id = ?', [id])
    
    res.json({
      success: true,
      message: 'Habitation permanently deleted',
      data: null
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete habitation',
      error: error.message
    })
  }
})

export default router
