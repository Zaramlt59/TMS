import { Request } from 'express'
import * as os from 'os'

/**
 * Extract the real client IP address from the request
 * This handles various proxy scenarios and development environments
 */
export function getClientIP(req: Request): string {
  // Check for various headers that proxies might set
  const forwardedFor = req.headers['x-forwarded-for'] as string
  const realIP = req.headers['x-real-ip'] as string
  const cfConnectingIP = req.headers['cf-connecting-ip'] as string // Cloudflare
  const xClientIP = req.headers['x-client-ip'] as string
  const xForwarded = req.headers['x-forwarded'] as string
  const forwarded = req.headers['forwarded'] as string

  // Priority order for IP extraction
  let clientIP: string | undefined

  // 1. Check X-Forwarded-For (most common proxy header)
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one (original client)
    clientIP = forwardedFor.split(',')[0].trim()
  }
  
  // 2. Check X-Real-IP (nginx proxy)
  if (!clientIP && realIP) {
    clientIP = realIP
  }
  
  // 3. Check Cloudflare connecting IP
  if (!clientIP && cfConnectingIP) {
    clientIP = cfConnectingIP
  }
  
  // 4. Check other common headers
  if (!clientIP && xClientIP) {
    clientIP = xClientIP
  }
  
  if (!clientIP && xForwarded) {
    clientIP = xForwarded
  }
  
  if (!clientIP && forwarded) {
    // Parse Forwarded header (RFC 7239)
    const forwardedMatch = forwarded.match(/for=([^;,\s]+)/)
    if (forwardedMatch) {
      clientIP = forwardedMatch[1].replace(/"/g, '')
    }
  }

  // 5. Fall back to connection remote address
  if (!clientIP) {
    clientIP = req.connection?.remoteAddress || 
               req.socket?.remoteAddress || 
               (req.connection as any)?.socket?.remoteAddress ||
               req.ip
  }

  // 6. Special handling for development/localhost scenarios
  if (!clientIP || clientIP === '::1' || clientIP === '127.0.0.1' || clientIP === 'localhost') {
    // In development, try to get the actual local network IP
    // This is a fallback for when we're running locally
    const networkInterfaces = os.networkInterfaces()
    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName]
      for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          clientIP = iface.address
          break
        }
      }
      if (clientIP && clientIP !== '::1' && clientIP !== '127.0.0.1') {
        break
      }
    }
  }

  // Clean up the IP address
  if (clientIP) {
    // Remove IPv6 prefix if present
    if (clientIP.startsWith('::ffff:')) {
      clientIP = clientIP.substring(7)
    }
    
    // Remove IPv6 brackets if present
    if (clientIP.startsWith('[') && clientIP.endsWith(']')) {
      clientIP = clientIP.slice(1, -1)
    }
    
    // Validate IP format (basic validation)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    
    if (ipv4Regex.test(clientIP) || ipv6Regex.test(clientIP)) {
      return clientIP
    }
  }

  // If all else fails, return a default
  return 'unknown'
}

/**
 * Check if the IP address is a local/private address
 */
export function isLocalIP(ip: string): boolean {
  if (ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
    return true
  }
  
  // Check for private IPv4 ranges
  const privateRanges = [
    /^10\./,                    // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
    /^192\.168\./,              // 192.168.0.0/16
    /^127\./,                   // 127.0.0.0/8 (loopback)
    /^169\.254\./,              // 169.254.0.0/16 (link-local)
  ]
  
  return privateRanges.some(range => range.test(ip))
}
