import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  walletAddress: string;
  userType: 'entrepreneur' | 'investor';
}

export class AuthService {
  /**
   * Generar token JWT
   */
  static generateToken(user: IUser): string {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      walletAddress: user.walletAddress,
      userType: user.userType,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Verificar token JWT
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('Error verifying JWT:', error);
      return null;
    }
  }

  /**
   * Extraer token del header Authorization
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1];
  }
}

// Códigos de respuesta para diferentes estados de autenticación
export const AUTH_CODES = {
  SUCCESS: 'AUTH_SUCCESS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  REGISTRATION_REQUIRED: 'REGISTRATION_REQUIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
} as const;

export type AuthCode = typeof AUTH_CODES[keyof typeof AUTH_CODES];
