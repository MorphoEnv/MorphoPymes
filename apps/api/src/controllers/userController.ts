import { Request, Response } from 'express';
import { UserService, CreateUserData } from '../services/userService';

export class UserController {
  /**
   * POST /api/users/register
   * Registrar un nuevo usuario
   */
  static async register(req: Request, res: Response) {
    try {
      const userData: CreateUserData = req.body;

      // Validar que la wallet address esté presente
      if (!userData.walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address es requerida'
        });
      }

      // Validaciones básicas
      if (!userData.firstName || !userData.lastName) {
        return res.status(400).json({
          success: false,
          message: 'Nombre y apellido son requeridos'
        });
      }

      if (!userData.userType || !['entrepreneur', 'investor'].includes(userData.userType)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de usuario debe ser entrepreneur o investor'
        });
      }

      // Crear el usuario
      const user = await UserService.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
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
      console.error('Error registering user:', error);
      
      if (error instanceof Error) {
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
   * GET /api/users/profile/:walletAddress
   * Obtener perfil de usuario por wallet
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;

      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address es requerida'
        });
      }

      const user = await UserService.getUserByWallet(walletAddress);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            walletAddress: user.walletAddress,
            userType: user.userType,
            profileImage: user.profileImage,
            description: user.description,
            verified: user.verified,
            ensName: user.ensName,
            linkedin: user.linkedin,
            experience: user.experience,
            bio: user.bio,
            emailNotifications: user.emailNotifications,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * PUT /api/users/profile/:walletAddress
   * Actualizar perfil de usuario
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;
      const updateData = req.body;

      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address es requerida'
        });
      }

      const user = await UserService.updateUser(walletAddress, updateData);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            walletAddress: user.walletAddress,
            userType: user.userType,
            profileImage: user.profileImage,
            description: user.description,
            verified: user.verified,
            ensName: user.ensName,
            linkedin: user.linkedin,
            experience: user.experience,
            bio: user.bio,
            emailNotifications: user.emailNotifications,
            updatedAt: user.updatedAt
          }
        }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/users/check/:walletAddress
   * Verificar si existe un usuario
   */
  static async checkUserExists(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;

      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address es requerida'
        });
      }

      const exists = await UserService.userExists(walletAddress);

      res.json({
        success: true,
        data: {
          exists,
          walletAddress
        }
      });
    } catch (error) {
      console.error('Error checking user existence:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/users
   * Obtener lista de usuarios
   */
  static async getUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userType = req.query.userType as 'entrepreneur' | 'investor' | undefined;

      const result = await UserService.getAllUsers(page, limit, userType);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
