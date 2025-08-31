import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email?: string;
  walletAddress: string;
  profileImage?: string;
  userType: 'entrepreneur' | 'investor';
  description?: string;
  ensName?: string;
  linkedin?: string;
  experience?: string;
  bio?: string;
}

export class UserService {
  /**
   * Crear un nuevo usuario
   */
  static async createUser(userData: CreateUserData): Promise<IUser> {
    try {
      // Verificar si ya existe un usuario con esa wallet
      const existingUser = await User.findOne({ 
        walletAddress: userData.walletAddress.toLowerCase() 
      });

      if (existingUser) {
        throw new Error('Un usuario con esta wallet ya existe');
      }

      // Crear el nuevo usuario
      const user = new User({
        ...userData,
        walletAddress: userData.walletAddress.toLowerCase()
      });

      await user.save();
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al crear el usuario');
    }
  }

  /**
   * Buscar usuario por wallet address
   */
  static async getUserByWallet(walletAddress: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ 
        walletAddress: walletAddress.toLowerCase() 
      });
      return user;
    } catch (error) {
      throw new Error('Error al buscar el usuario');
    }
  }

  /**
   * Buscar usuario por email
   */
  static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      return user;
    } catch (error) {
      throw new Error('Error al buscar el usuario por email');
    }
  }

  /**
   * Buscar usuario por token de verificación
   */
  static async getUserByVerificationToken(token: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ emailVerificationToken: token });
      return user;
    } catch (error) {
      throw new Error('Error al buscar el usuario por token de verificación');
    }
  }

  /**
   * Actualizar usuario
   */
  static async updateUser(
    walletAddress: string, 
    updateData: Partial<CreateUserData>
  ): Promise<IUser | null> {
    try {
      const user = await User.findOneAndUpdate(
        { walletAddress: walletAddress.toLowerCase() },
        { ...updateData },
        { new: true, runValidators: true }
      );
      return user;
    } catch (error) {
      throw new Error('Error al actualizar el usuario');
    }
  }

  /**
   * Verificar si existe un usuario
   */
  static async userExists(walletAddress: string): Promise<boolean> {
    try {
      const user = await User.findOne({ 
        walletAddress: walletAddress.toLowerCase() 
      });
      return !!user;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener todos los usuarios (con paginación)
   */
  static async getAllUsers(
    page: number = 1, 
    limit: number = 10,
    userType?: 'entrepreneur' | 'investor'
  ): Promise<{ users: IUser[], total: number, pages: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter = userType ? { userType } : {};
      
      const [users, total] = await Promise.all([
        User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        User.countDocuments(filter)
      ]);

      const pages = Math.ceil(total / limit);

      return { users, total, pages };
    } catch (error) {
      throw new Error('Error al obtener los usuarios');
    }
  }
}