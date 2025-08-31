// Utilidades para manejo de storage (localStorage con fallback)
export class StorageManager {
  private static isClient = typeof window !== 'undefined';
  
  static setItem(key: string, value: string): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  static getItem(key: string): string | null {
    if (!this.isClient) return null;
    
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
  
  static removeItem(key: string): void {
    if (!this.isClient) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
  
  static clear(): void {
    if (!this.isClient) return;
    
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

// Claves para el storage
export const STORAGE_KEYS = {
  TOKEN: 'morpho_token',
  USER: 'morpho_user',
  THEME: 'morpho_theme',
} as const;
