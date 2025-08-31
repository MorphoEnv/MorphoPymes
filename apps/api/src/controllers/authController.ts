import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthService, AUTH_CODES } from '../services/authService';
import { EmailService } from '../services/emailService';
import crypto from 'crypto';

export class AuthController {
  /**
   * POST /api/auth/login
   * Login con wallet address
   */
  static async login(req: Request, res: Response) {
    try {
      console.log('🚀 LOGIN REQUEST RECEIVED');
      console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
      console.log('🔗 Request headers:', {
        'content-type': req.headers['content-type'],
        'origin': req.headers.origin,
        'user-agent': req.headers['user-agent']?.substring(0, 50) + '...'
      });
      
      const { walletAddress } = req.body;
      console.log('📝 Extracted walletAddress:', walletAddress);

      if (!walletAddress) {
        console.log('❌ No wallet address provided');
        return res.status(400).json({
          success: false,
          message: 'Wallet address es requerida'
        });
      }

      console.log('🔍 Searching for user in database with wallet:', walletAddress);
      
      // Buscar usuario por wallet
      const user = await UserService.getUserByWallet(walletAddress);
      console.log('👤 User search result:', user ? '✅ FOUND' : '❌ NOT FOUND');
      
      if (user) {
        console.log('📊 User details:', {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          userType: user.userType
        });
      }

      if (!user) {
        console.log('⚠️  User not found, returning registration required');
        // Usuario no existe, necesita registrarse
        return res.status(200).json({
          success: false,
          code: AUTH_CODES.REGISTRATION_REQUIRED,
          message: 'Usuario no encontrado. Registro requerido.',
          data: {
            walletAddress,
            requiresRegistration: true
          }
        });
      }

      console.log('🔐 Generating JWT token for user');
      // Usuario existe, generar JWT
      const token = AuthService.generateToken(user);
      console.log('✅ JWT generated successfully');

      res.json({
        success: true,
        code: AUTH_CODES.SUCCESS,
        message: 'Login exitoso',
        data: {
          token,
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            walletAddress: user.walletAddress,
            userType: user.userType,
            profileImage: user.profileImage,
            verified: user.verified,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      console.error('💥 ERROR in login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/auth/register
   * Registro de usuario (después del login fallido)
   */
  static async register(req: Request, res: Response) {
    try {
      console.log('📝 REGISTER REQUEST RECEIVED');
      console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
      
      const userData = req.body;

      // Validar que la wallet address esté presente
      if (!userData.walletAddress) {
        console.log('❌ No wallet address provided in registration');
        return res.status(400).json({
          success: false,
          message: 'Wallet address es requerida'
        });
      }

      // Validaciones básicas
      if (!userData.firstName || !userData.lastName) {
        console.log('❌ Missing firstName or lastName');
        return res.status(400).json({
          success: false,
          message: 'Nombre y apellido son requeridos'
        });
      }

      if (!userData.userType || !['entrepreneur', 'investor'].includes(userData.userType)) {
        console.log('❌ Invalid userType:', userData.userType);
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuario debe ser entrepreneur o investor'
        });
      }

      console.log('✅ All validations passed, creating user...');
      
      // Crear el usuario
      const user = await UserService.createUser(userData);
      console.log('👤 User created successfully:', user._id);

      // Generar JWT
      const token = AuthService.generateToken(user);
      console.log('🔐 JWT token generated for new user');

      // Generar token de verificación de email
      if (user.email) {
        const verificationToken = crypto.randomBytes(24).toString('hex');
        user.emailVerificationToken = verificationToken;
        user.verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
        await user.save();

        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        try {
          await EmailService.sendVerificationEmail(user.email, `${user.firstName} ${user.lastName}`, verifyUrl);
          console.log('✉️ Verification email queued/sent');
        } catch (err) {
          console.warn('⚠️ Failed to send verification email:', err);
        }
      }

      res.status(201).json({
        success: true,
        code: AUTH_CODES.SUCCESS,
        message: 'Usuario registrado y autenticado exitosamente',
        data: {
          token,
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            walletAddress: user.walletAddress,
            userType: user.userType,
            profileImage: user.profileImage,
            verified: user.verified,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      console.error('💥 ERROR in register:', error);
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/auth/verify
   * Verificar token JWT
   */
  static async verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      console.log('🔎 /api/auth/verify called - headers snapshot:', {
        authorization: authHeader ? '[present]' : '[missing]',
        origin: req.headers.origin,
        'user-agent': req.headers['user-agent']?.substring(0, 80) || '[unknown]',
      });

      const token = AuthService.extractTokenFromHeader(authHeader);
      console.log('🔑 Extracted token:', token ? `${token.slice(0, 10)}...(${token.length} chars)` : '[none]');

      if (!token) {
        return res.status(401).json({
          success: false,
          code: AUTH_CODES.INVALID_TOKEN,
          message: 'Token no proporcionado'
        });
      }

      const payload = AuthService.verifyToken(token);

      if (!payload) {
        console.warn('⚠️ Token verification failed for provided token');
        return res.status(401).json({
          success: false,
          code: AUTH_CODES.INVALID_TOKEN,
          message: 'Token inválido'
        });
      }

      console.log('📦 Token payload:', payload);

      // Buscar usuario actualizado
      const user = await UserService.getUserByWallet(payload.walletAddress);

      if (!user) {
        console.warn('⚠️ User referenced in token not found in DB:', payload.walletAddress);
        return res.status(404).json({
          success: false,
          code: AUTH_CODES.USER_NOT_FOUND,
          message: 'Usuario no encontrado'
        });
      }

      console.log('✅ User found for token:', { wallet: user.walletAddress, id: user._id });

      res.json({
        success: true,
        code: AUTH_CODES.SUCCESS,
        message: 'Token válido',
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            walletAddress: user.walletAddress,
            userType: user.userType,
            profileImage: user.profileImage,
            verified: user.verified,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/auth/send-verification
   * Enviar correo de verificación (usa email en body or user from token)
   */
  static async sendVerification(req: Request, res: Response) {
    try {
      const { email, walletAddress } = req.body;

      if (!email && !walletAddress) {
        return res.status(400).json({ success: false, message: 'Email o walletAddress requerido' });
      }

      const user = email ? await UserService.getUserByEmail(email) : await UserService.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const crypto = await import('crypto');
      const verificationToken = crypto.randomBytes(24).toString('hex');
      user.emailVerificationToken = verificationToken;
      user.verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
      await user.save();

      const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
      await EmailService.sendVerificationEmail(user.email!, `${user.firstName} ${user.lastName}`, verifyUrl);

      res.json({ success: true, message: 'Verification email sent' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ success: false, message: 'Error sending verification email' });
    }
  }

  /**
   * GET /api/auth/verify-email?token=...
   * Verificar el token de email y marcar el usuario
   */
  static async verifyEmailToken(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        return res.status(400).json({ success: false, message: 'Token requerido' });
      }

      const user = await UserService.getUserByVerificationToken(token);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Token inválido o usuario no encontrado' });
      }

      if (user.verificationExpires && user.verificationExpires < new Date()) {
        return res.status(410).json({ success: false, message: 'Token expirado' });
      }

      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.verificationExpires = undefined;
      user.verified = true;
      await user.save();

      res.json({ success: true, message: 'Email verificado correctamente' });
    } catch (error) {
      console.error('Error verifying email token:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  }
}
