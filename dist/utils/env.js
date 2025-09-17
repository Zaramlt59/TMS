"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
function requireString(name, fallback) {
    const v = process.env[name] ?? fallback;
    if (!v)
        throw new Error(`Missing env: ${name}`);
    return v;
}
function requireNumber(name, fallback) {
    const raw = process.env[name];
    const v = raw ? Number(raw) : fallback;
    if (v === undefined || Number.isNaN(v))
        throw new Error(`Invalid numeric env: ${name}`);
    return v;
}
function loadEnv() {
    return {
        PORT: requireNumber('PORT', 5004),
        DB_HOST: requireString('DB_HOST', 'localhost'),
        DB_USER: requireString('DB_USER', 'root'),
        DB_PASSWORD: process.env.DB_PASSWORD ?? '',
        DB_NAME: requireString('DB_NAME', 'ttms_db'),
        DB_PORT: requireNumber('DB_PORT', 3306),
        JWT_SECRET: requireString('JWT_SECRET', 'change-me'),
        CORS_ORIGIN: process.env.CORS_ORIGIN,
        SENTRY_DSN: process.env.SENTRY_DSN,
    };
}
//# sourceMappingURL=env.js.map