"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ttms_db',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};
class Database {
    constructor() {
        this.pool = null;
    }
    async connect() {
        try {
            this.pool = promise_1.default.createPool(dbConfig);
            // Test the connection
            const connection = await this.pool.getConnection();
            console.log('✅ Database connected successfully');
            connection.release();
        }
        catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }
    async query(sql, params) {
        if (!this.pool) {
            throw new Error('Database not connected');
        }
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        }
        catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    }
    async getConnection() {
        if (!this.pool) {
            throw new Error('Database not connected');
        }
        return await this.pool.getConnection();
    }
    async close() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('Database connection closed');
        }
    }
}
exports.database = new Database();
exports.default = exports.database;
//# sourceMappingURL=connection.js.map