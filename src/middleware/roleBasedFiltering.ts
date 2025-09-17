import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../utils/jwt';

// Extend Express Request interface to include filtering parameters
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      roleFilters?: {
        school_id?: string;
        district?: string;
        rd_block?: string;
      };
    }
  }
}

/**
 * Middleware to add role-based filtering parameters to the request
 * This ensures users only see data relevant to their role and scope
 */
export const addRoleBasedFilters = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next();
  }

  const user = req.user;
  const roleFilters: any = {};

  // Apply role-based filtering based on user role
  switch (user.role) {
    case 'teacher':
    case 'hoi':
      // Teachers and HOIs can only see their school's data
      if (user.school_id) {
        roleFilters.school_id = user.school_id;
      }
      break;

    case 'sdeo':
      // SDEOs can see data from their RD block
      if (user.rd_block) {
        roleFilters.rd_block = user.rd_block;
      }
      break;

    case 'deo':
      // DEOs can see data from their district
      if (user.district) {
        roleFilters.district = user.district;
      }
      break;

    case 'admin':
    case 'super_admin':
      // Admins and Super Admins can see all data (no filters)
      break;

    default:
      // For unknown roles, apply no filters (will be handled by permission checks)
      break;
  }

  // Add the filters to the request object
  req.roleFilters = roleFilters;

  console.log(`🔍 Role-based filtering for ${user.role}:`, roleFilters);
  next();
};

/**
 * Helper function to build Prisma where clause based on role filters
 */
export const buildRoleBasedWhereClause = (roleFilters: any, baseWhere: any = {}) => {
  const whereClause = { ...baseWhere };

  // Apply school_id filter
  if (roleFilters.school_id) {
    whereClause.school_id = roleFilters.school_id;
  }

  // Apply district filter
  if (roleFilters.district) {
    whereClause.district = roleFilters.district;
  }

  // Apply rd_block filter
  if (roleFilters.rd_block) {
    whereClause.rd_block = roleFilters.rd_block;
  }

  return whereClause;
};

/**
 * Helper function to check if user can access specific data
 */
export const canAccessData = (user: JWTPayload, data: any): boolean => {
  switch (user.role) {
    case 'teacher':
    case 'hoi':
      return user.school_id ? data.school_id === user.school_id : false;

    case 'sdeo':
      return user.rd_block ? data.rd_block === user.rd_block : false;

    case 'deo':
      return user.district ? data.district === user.district : false;

    case 'admin':
    case 'super_admin':
      return true;

    default:
      return false;
  }
};
