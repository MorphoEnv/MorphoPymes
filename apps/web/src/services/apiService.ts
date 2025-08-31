// Use relative API routes for frontend calls. DO NOT store sensitive keys in client bundles.
// All secrets (private keys, API secrets) must be kept on the server and accessed via secure API endpoints under /api/*
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper to build full path — keeps code consistent
function apiPath(path: string) {
  if (path.startsWith('/')) return path;
  return `/${path}`;
}

// Tipos para el usuario
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  walletAddress: string;
  userType: 'entrepreneur' | 'investor';
  profileImage?: string;
  description?: string;
  verified: boolean;
  ensName?: string;
  linkedin?: string;
  experience?: string;
  bio?: string;
  emailNotifications: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email?: string;
  walletAddress: string;
  userType: 'entrepreneur' | 'investor';
  description?: string;
  profileImage?: string;
  ensName?: string;
  linkedin?: string;
  experience?: string;
  bio?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
  errors?: any[];
}

export interface LoginResponse {
  token?: string;
  user?: User;
  requiresRegistration?: boolean;
  walletAddress?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
  console.log('🚀 Frontend making API request to:', `${API_BASE_URL}${endpoint}`);
  console.log('📋 Frontend request options:', JSON.stringify(options, null, 2));
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('📡 Frontend response status:', response.status);
      console.log('📡 Frontend response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
  console.log('📦 Frontend response data:', JSON.stringify(data, null, 2));
      
      return data;
    } catch (error) {
      console.error('💥 Frontend API Request error:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
      };
    }
  }

  // Login con wallet
  async loginWithWallet(walletAddress: string): Promise<ApiResponse<LoginResponse>> {
    console.log('🔐 Frontend attempting login with wallet:', walletAddress);
    return this.makeRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }

  // Registro de usuario (para completar después del login fallido)
  async completeRegistration(userData: CreateUserData): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Verificar token JWT
  async verifyToken(token: string): Promise<ApiResponse<{ user: User }>> {
    console.log('🔁 apiService.verifyToken called');
    return this.makeRequest<{ user: User }>('/api/auth/verify', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Verificar email por token (GET /api/auth/verify-email?token=...)
  async verifyEmailToken(token: string): Promise<ApiResponse<{ message?: string }>> {
    console.log('🔁 apiService.verifyEmailToken called');
    const endpoint = `/api/auth/verify-email?token=${encodeURIComponent(token)}`;
    return this.makeRequest<{ message?: string }>(endpoint, {
      method: 'GET',
    });
  }

  // Registro de usuario (método original mantenido para compatibilidad)
  async registerUser(userData: CreateUserData): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Obtener perfil de usuario por wallet
  async getUserProfile(walletAddress: string): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>(`/api/users/profile/${walletAddress}`);
  }

  // Actualizar perfil de usuario
  async updateUserProfile(
    walletAddress: string,
    updateData: Partial<CreateUserData>
  ): Promise<ApiResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>(`/api/users/profile/${walletAddress}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Verificar si un usuario existe
  async checkUserExists(walletAddress: string): Promise<ApiResponse<{ exists: boolean; walletAddress: string }>> {
    return this.makeRequest<{ exists: boolean; walletAddress: string }>(`/api/users/check/${walletAddress}`);
  }

  // Subir imagen de perfil (multipart/form-data)
  async uploadProfileImage(walletAddress: string, file: File, token?: string): Promise<ApiResponse<{ url: string; user?: User }>> {
    try {
  const form = new FormData();
  // backend expects field name 'photo' (see userRoutes upload.single('photo'))
  form.append('photo', file);

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Use fetch directly to allow multipart body
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${walletAddress}/photo`, {
        method: 'POST',
        headers,
        body: form,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading profile image (frontend):', error);
      return { success: false, message: 'Error uploading image' } as ApiResponse<any>;
    }
  }

  // Obtener lista de usuarios
  async getUsers(
    page: number = 1,
    limit: number = 10,
    userType?: 'entrepreneur' | 'investor'
  ): Promise<ApiResponse<{ users: User[]; total: number; pages: number }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (userType) {
      params.append('userType', userType);
    }

    return this.makeRequest<{ users: User[]; total: number; pages: number }>(
      `/api/users?${params.toString()}`
    );
  }

  // Projects
  async getProjectsByEntrepreneur(walletAddress: string, token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return this.makeRequest<{ projects: any[]; total: number; pages: number }>(`/api/projects/entrepreneur/${walletAddress}`, { method: 'GET', headers });
  }

  async createProject(payload: any, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return this.makeRequest<{ project: any }>(`/api/projects`, { method: 'POST', headers, body: JSON.stringify(payload) });
  }

  // Upload project images (multipart) - returns { urls: string[] }
  async uploadProjectImages(files: File[], token?: string) {
    try {
      const form = new FormData();
      files.forEach((f) => form.append('images', f));
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/projects/images/upload`, {
        method: 'POST',
        headers,
        body: form,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading project images (apiService):', error);
      return { success: false, message: 'Error uploading images' } as any;
    }
  }

  async getProjectById(id: string, token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return this.makeRequest<{ project: any }>(`/api/projects/${id}`, { method: 'GET', headers });
  }

  async investProject(projectId: string, walletAddress: string, amount: number) {
    return this.makeRequest<{ investment: any; project: any }>(`/api/projects/${projectId}/invest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, amount })
    });
  }

  async listPublicProjects(page = 1, limit = 20, category?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category && category !== 'All') params.append('category', category);
    return this.makeRequest<{ projects: any[]; total: number; pages: number }>(`/api/projects/public?${params.toString()}`);
  }

  async getCategories() {
    // returns { categories: Array<{ label: string; value: string }> }
    return this.makeRequest<{ categories: Array<{ label: string; value: string }> }>(`/api/projects/categories`);
  }

  async updateProject(id: string, payload: any, token?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return this.makeRequest<{ project: any }>(`/api/projects/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
  }
}

// Exportar una instancia singleton
export const apiService = new ApiService();
