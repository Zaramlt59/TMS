import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || '15m';

export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
  email: string;
}

export class JWTUtil {
  static generateToken(payload: JWTPayload): string {
    const options: SignOptions = { expiresIn: ((process.env.JWT_EXPIRES_IN as any) || '15m') } as any;
    return jwt.sign(payload, JWT_SECRET, options);
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  }
}
