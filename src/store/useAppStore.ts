// store/useAppStore.ts
import { create } from 'zustand';

// Types
export interface User {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  role: 'PARENT' | 'ELEVE' | 'PROFESSEUR' | 'ADMIN';
  photo?: string;
}

export interface AppState {
  // État
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Store unique
export const useAppStore = create<AppState>((set) => ({
  // État initial
  user: null,
  isAuthenticated: false,
  isLoading: false,
  theme: 'system',

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setTheme: (theme) => set({ theme }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // Simulation API - À remplacer par votre vraie API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        nom: 'NGAPI',
        prenoms: 'Baptiste',
        email: email,
        role: 'PARENT',
      };
      
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));