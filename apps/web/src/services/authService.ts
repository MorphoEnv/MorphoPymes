// apps/web/src/services/authService.ts
import { User } from '@/hooks/useWeb3Auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class AuthService {
  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Login o registro automático con wallet
  async loginOrRegister(walletAddress: string): Promise<User> {
    return this.apiCall<User>('/api/auth/wallet', {
      method: 'POST',
      body: JSON.stringify({ address: walletAddress }),
    });
  }

  // Obtener perfil de usuario
  async getUserProfile(userId: string): Promise<User> {
    return this.apiCall<User>(`/api/users/${userId}`);
  }

  // Actualizar perfil de usuario
  async updateProfile(userId: string, profileData: { email?: string; username?: string }): Promise<User> {
    return this.apiCall<User>(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Verificar si un username está disponible
  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    return this.apiCall<{ available: boolean }>(`/api/users/check-username?username=${encodeURIComponent(username)}`);
  }

  // Obtener estadísticas del usuario
  async getUserStats(userId: string): Promise<{
    transactionsCount: number;
    totalVolume: string;
    joinedDate: Date;
  }> {
    return this.apiCall(`/api/users/${userId}/stats`);
  }

  // Logout (limpiar datos locales si es necesario)
  async logout(): Promise<void> {
    // Aquí puedes limpiar localStorage, cookies, etc.
    // Por ahora solo retornamos void ya que la desconexión del wallet
    // es manejada por ThirdWeb
    return Promise.resolve();
  }

  // Validar formato de dirección de wallet
  isValidWalletAddress(address: string): boolean {
    // Validación básica para direcciones Ethereum
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Formatear dirección de wallet para mostrar
  formatWalletAddress(address: string, chars: number = 4): string {
    if (!address) return '';
    if (address.length <= chars * 2 + 2) return address;
    
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  }
}

export const authService = new AuthService();