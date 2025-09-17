"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientIP = getClientIP;
exports.isLocalIP = isLocalIP;
const os = __importStar(require("os"));
/**
 * Extract the real client IP address from the request
 * This handles various proxy scenarios and development environments
 */
function getClientIP(req) {
    // Check for various headers that proxies might set
    const forwardedFor = req.headers['x-forwarded-for'];
    const realIP = req.headers['x-real-ip'];
    const cfConnectingIP = req.headers['cf-connecting-ip']; // Cloudflare
    const xClientIP = req.headers['x-client-ip'];
    const xForwarded = req.headers['x-forwarded'];
    const forwarded = req.headers['forwarded'];
    // Priority order for IP extraction
    let clientIP;
    // 1. Check X-Forwarded-For (most common proxy header)
    if (forwardedFor) {
        // X-Forwarded-For can contain multiple IPs, take the first one (original client)
        clientIP = forwardedFor.split(',')[0].trim();
    }
    // 2. Check X-Real-IP (nginx proxy)
    if (!clientIP && realIP) {
        clientIP = realIP;
    }
    // 3. Check Cloudflare connecting IP
    if (!clientIP && cfConnectingIP) {
        clientIP = cfConnectingIP;
    }
    // 4. Check other common headers
    if (!clientIP && xClientIP) {
        clientIP = xClientIP;
    }
    if (!clientIP && xForwarded) {
        clientIP = xForwarded;
    }
    if (!clientIP && forwarded) {
        // Parse Forwarded header (RFC 7239)
        const forwardedMatch = forwarded.match(/for=([^;,\s]+)/);
        if (forwardedMatch) {
            clientIP = forwardedMatch[1].replace(/"/g, '');
        }
    }
    // 5. Fall back to connection remote address
    if (!clientIP) {
        clientIP = req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.connection?.socket?.remoteAddress ||
            req.ip;
    }
    // 6. Special handling for development/localhost scenarios
    if (!clientIP || clientIP === '::1' || clientIP === '127.0.0.1' || clientIP === 'localhost') {
        // In development, try to get the actual local network IP
        // This is a fallback for when we're running locally
        const networkInterfaces = os.networkInterfaces();
        for (const interfaceName in networkInterfaces) {
            const interfaces = networkInterfaces[interfaceName];
            for (const iface of interfaces) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    clientIP = iface.address;
                    break;
                }
            }
            if (clientIP && clientIP !== '::1' && clientIP !== '127.0.0.1') {
                break;
            }
        }
    }
    // Clean up the IP address
    if (clientIP) {
        // Remove IPv6 prefix if present
        if (clientIP.startsWith('::ffff:')) {
            clientIP = clientIP.substring(7);
        }
        // Remove IPv6 brackets if present
        if (clientIP.startsWith('[') && clientIP.endsWith(']')) {
            clientIP = clientIP.slice(1, -1);
        }
        // Validate IP format (basic validation)
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        if (ipv4Regex.test(clientIP) || ipv6Regex.test(clientIP)) {
            return clientIP;
        }
    }
    // If all else fails, return a default
    return 'unknown';
}
/**
 * Check if the IP address is a local/private address
 */
function isLocalIP(ip) {
    if (ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
        return true;
    }
    // Check for private IPv4 ranges
    const privateRanges = [
        /^10\./, // 10.0.0.0/8
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
        /^192\.168\./, // 192.168.0.0/16
        /^127\./, // 127.0.0.0/8 (loopback)
        /^169\.254\./, // 169.254.0.0/16 (link-local)
    ];
    return privateRanges.some(range => range.test(ip));
}
//# sourceMappingURL=ipExtractor.js.map