import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: 'admin';
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: Date;
}

class UserService {
  private readonly saltRounds = 10;

  async createUser(userData: CreateUserData): Promise<UserResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [
            { username: userData.username },
            { email: userData.email }
          ]
        }
      });

      if (existingUser) {
        throw new Error('User with this username or email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);

      // Create user
      const user = await prisma.users.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: userData.role || 'admin',
          is_active: true
        }
      });

      // Return user without password
      const { password, ...userResponse } = user;
      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async authenticateUser(loginData: LoginData): Promise<UserResponse | null> {
    try {
      // Find user by username
      const user = await prisma.users.findUnique({
        where: { username: loginData.username }
      });

      if (!user || !user.is_active) {
        return null;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      
      if (!isPasswordValid) {
        return null;
      }

      // Return user without password
      const { password, ...userResponse } = user;
      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number): Promise<UserResponse | null> {
    try {
      const user = await prisma.users.findUnique({
        where: { id }
      });

      if (!user) {
        return null;
      }

      // Return user without password
      const { password, ...userResponse } = user;
      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const users = await prisma.users.findMany({
        where: { is_active: true },
        orderBy: { created_at: 'desc' }
      });

      // Return users without passwords
      return users.map(({ password, ...user }) => user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, updateData: Partial<CreateUserData>): Promise<UserResponse | null> {
    try {
      const existingUser = await prisma.users.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return null;
      }

      const updatePayload: any = { ...updateData };

      // Hash password if provided and persist it
      if (typeof updateData.password === 'string' && updateData.password.length > 0) {
        updatePayload.password = await bcrypt.hash(updateData.password, this.saltRounds);
      }

      const user = await prisma.users.update({
        where: { id },
        data: {
          ...updatePayload,
          updated_at: new Date()
        }
      });

      // Return user without password
      const { password, ...userResponse } = user;
      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await prisma.users.findUnique({
        where: { id }
      });

      if (!user) {
        return false;
      }

      // Soft delete by setting is_active to false
      await prisma.users.update({
        where: { id },
        data: {
          is_active: false,
          updated_at: new Date()
        }
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  async createDefaultAdmin(): Promise<UserResponse | null> {
    try {
      // Check if admin already exists
      const existingAdmin = await prisma.users.findFirst({
        where: { role: 'admin' }
      });

      if (existingAdmin) {
        return null; // Admin already exists
      }

      // Create default admin
      const adminData: CreateUserData = {
        username: 'admin',
        email: 'admin@tms.com',
        password: 'admin123', // Default password - should be changed
        role: 'admin'
      };

      return await this.createUser(adminData);
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();

