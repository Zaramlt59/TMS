"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
class UserService {
    constructor() {
        this.saltRounds = 10;
    }
    async createUser(userData) {
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
            const hashedPassword = await bcrypt_1.default.hash(userData.password, this.saltRounds);
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
        }
        catch (error) {
            throw error;
        }
    }
    async authenticateUser(loginData) {
        try {
            // Find user by username
            const user = await prisma.users.findUnique({
                where: { username: loginData.username }
            });
            if (!user || !user.is_active) {
                return null;
            }
            // Verify password
            const isPasswordValid = await bcrypt_1.default.compare(loginData.password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            // Return user without password
            const { password, ...userResponse } = user;
            return userResponse;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserById(id) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async getAllUsers() {
        try {
            const users = await prisma.users.findMany({
                where: { is_active: true },
                orderBy: { created_at: 'desc' }
            });
            // Return users without passwords
            return users.map(({ password, ...user }) => user);
        }
        catch (error) {
            throw error;
        }
    }
    async updateUser(id, updateData) {
        try {
            const existingUser = await prisma.users.findUnique({
                where: { id }
            });
            if (!existingUser) {
                return null;
            }
            const updatePayload = { ...updateData };
            // Hash password if provided and persist it
            if (typeof updateData.password === 'string' && updateData.password.length > 0) {
                updatePayload.password = await bcrypt_1.default.hash(updateData.password, this.saltRounds);
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
        }
        catch (error) {
            throw error;
        }
    }
    async updateLastLogin(id) {
        try {
            // Try to update last_login field
            await prisma.users.update({
                where: { id },
                data: {
                    last_login: new Date(),
                    updated_at: new Date()
                }
            });
        }
        catch (error) {
            // If last_login field doesn't exist, just update updated_at
            if (error.code === 'P2021' || error.message?.includes('last_login')) {
                try {
                    await prisma.users.update({
                        where: { id },
                        data: {
                            updated_at: new Date()
                        }
                    });
                }
                catch (updateError) {
                    console.error('Failed to update user timestamp:', updateError);
                }
            }
            else {
                console.error('Failed to update last login:', error);
            }
        }
    }
    async deleteUser(id) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async createDefaultAdmin() {
        try {
            // Check if admin already exists
            const existingAdmin = await prisma.users.findFirst({
                where: { role: 'admin' }
            });
            if (existingAdmin) {
                return null; // Admin already exists
            }
            // Create default admin
            const adminData = {
                username: 'admin',
                email: 'admin@tms.com',
                password: 'admin123', // Default password - should be changed
                role: 'admin'
            };
            return await this.createUser(adminData);
        }
        catch (error) {
            throw error;
        }
    }
    async verifyPassword(user, password) {
        try {
            return await bcrypt_1.default.compare(password, user.password);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = new UserService();
//# sourceMappingURL=userService.js.map