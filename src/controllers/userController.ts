import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import userService from '../services/userService';
import { JWTUtil } from '../utils/jwt';

export const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

export const validateUserLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateUserUpdate = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Register a new user (admin only)
export const registerUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password, role } = req.body;

    const user = await userService.createUser({
      username,
      email,
      password,
      role: role || 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user'
    });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    const user = await userService.authenticateUser({ username, password });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = JWTUtil.generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error: any) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const updateData = req.body;
    const user = await userService.updateUser(userId, updateData);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
};

// Delete user (soft delete)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const deleted = await userService.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// Create default admin (for initial setup)
export const createDefaultAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await userService.createDefaultAdmin();

    if (!admin) {
      return res.status(409).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Default admin created successfully',
      data: admin
    });
  } catch (error: any) {
    console.error('Error creating default admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create default admin'
    });
  }
};
