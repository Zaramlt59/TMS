import prisma from './prismaService';
import { ApiResponse } from '../types';

export interface ServiceCategory {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class ServiceCategoryService {
  async getAll(): Promise<ApiResponse<ServiceCategory[]>> {
    try {
      const items = await prisma.$queryRaw<ServiceCategory[]>`
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories
        ORDER BY name ASC
      `;
      return { success: true, message: 'Service categories retrieved successfully', data: items };
    } catch (error: any) {
      return { success: false, message: 'Failed to retrieve service categories', error: error.message };
    }
  }

  async getActive(): Promise<ApiResponse<ServiceCategory[]>> {
    try {
      const items = await prisma.$queryRaw<ServiceCategory[]>`
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories
        WHERE COALESCE(is_active, TRUE) = TRUE
        ORDER BY name ASC
      `;
      return { success: true, message: 'Active service categories retrieved successfully', data: items };
    } catch (error: any) {
      return { success: false, message: 'Failed to retrieve active service categories', error: error.message };
    }
  }

  async getById(id: number): Promise<ApiResponse<ServiceCategory>> {
    try {
      const rows = await prisma.$queryRaw<ServiceCategory[]>`
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories
        WHERE id = ${id} AND COALESCE(is_active, TRUE) = TRUE
        LIMIT 1
      `;
      const item = rows[0];
      if (!item) return { success: false, message: 'Service category not found' };
      return { success: true, message: 'Service category retrieved successfully', data: item };
    } catch (error: any) {
      return { success: false, message: 'Failed to retrieve service category', error: error.message };
    }
  }

  async create(data: ServiceCategory): Promise<ApiResponse<ServiceCategory>> {
    try {
      const isActive = data.is_active !== undefined ? data.is_active : true;
      await prisma.$executeRawUnsafe(
        'INSERT IGNORE INTO service_categories (name, is_active) VALUES (?, ?)',
        data.name,
        isActive
      );
      const rows = await prisma.$queryRaw<ServiceCategory[]>`
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories
        WHERE name = ${data.name}
        ORDER BY id DESC
        LIMIT 1
      `;
      const item = rows[0];
      return { success: true, message: 'Service category created successfully', data: item };
    } catch (error: any) {
      return { success: false, message: 'Failed to create service category', error: error.message };
    }
  }

  async update(id: number, data: Partial<ServiceCategory>): Promise<ApiResponse<ServiceCategory>> {
    try {
      const isActive = data.is_active !== undefined ? data.is_active : true;
      await prisma.$executeRawUnsafe(
        'UPDATE service_categories SET name = ?, is_active = ?, updated_at = NOW() WHERE id = ?',
        data.name,
        isActive,
        id
      );
      const rows = await prisma.$queryRaw<ServiceCategory[]>`
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories WHERE id = ${id} LIMIT 1
      `;
      const item = rows[0];
      return { success: true, message: 'Service category updated successfully', data: item };
    } catch (error: any) {
      return { success: false, message: 'Failed to update service category', error: error.message };
    }
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      await prisma.$executeRawUnsafe(
        'UPDATE service_categories SET is_active = FALSE, updated_at = NOW() WHERE id = ?',
        id
      );
      return { success: true, message: 'Service category deleted successfully' };
    } catch (error: any) {
      return { success: false, message: 'Failed to delete service category', error: error.message };
    }
  }

  async hardDelete(id: number): Promise<ApiResponse<void>> {
    try {
      await prisma.$executeRawUnsafe('DELETE FROM service_categories WHERE id = ?', id);
      return { success: true, message: 'Service category permanently deleted' };
    } catch (error: any) {
      return { success: false, message: 'Failed to hard delete service category', error: error.message };
    }
  }
}


