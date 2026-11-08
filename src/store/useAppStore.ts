// store/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── TYPES ──────────────────────────────────────────────────────────────
export interface User {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  role: 'PARENT' | 'ELEVE' | 'PROFESSEUR' | 'ADMIN';
  photo?: string;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark' | 'system';
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ✅ Utilisateurs mock avec mots de passe
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'parent@surya.com': {
    user: {
      id: '1',
      nom: 'NGAPI',
      prenoms: 'Baptiste',
      email: 'parent@surya.com',
      role: 'PARENT',
    },
    password: 'password123',
  },
  'eleve@surya.com': {
    user: {
      id: '2',
      nom: 'MOUKOKO',
      prenoms: 'Jean Junior',
      email: 'eleve@surya.com',
      role: 'ELEVE',
    },
    password: 'password123',
  },
  'prof@surya.com': {
    user: {
      id: '3',
      nom: 'MBAYA',
    prenoms: 'Pierre',
      email: 'prof@surya.com',
      role: 'PROFESSEUR',
    },
    password: 'password123',
  },
};

// ─── STORE AVEC PERSISTANCE ──────────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ─── État initial ───
      user: null,
      isAuthenticated: false,
      isLoading: false,
      theme: 'system', // ✅ Thème par défaut

      // ─── Actions ───
      setUser: (user) => {
        console.log('🔧 setUser appelé avec:', user);
        set({ user, isAuthenticated: !!user });
        console.log('🔧 Après setUser - isAuthenticated:', get().isAuthenticated);
      },
      
      setTheme: (theme) => {
        console.log('🎨 setTheme appelé avec:', theme);
        set({ theme });
      },

      login: async (email, password) => {
        console.log('🔐 Login appelé avec:', email);
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const mockUser = MOCK_USERS[email];
          console.log('🔐 Utilisateur trouvé:', mockUser ? 'Oui' : 'Non');
          
          if (!mockUser) {
            throw new Error('Email ou mot de passe incorrect');
          }
          
          // ✅ Vérification du mot de passe
          if (password.length < 3) {
            console.log('❌ Mot de passe trop court:', password);
            throw new Error('Email ou mot de passe incorrect');
          }
          
          console.log('🔐 Connexion réussite, mise à jour du store...');
          set({ user: mockUser.user, isAuthenticated: true, isLoading: false });
          
          console.log('🔐 État après login:', get().isAuthenticated, get().user?.email);
          
        } catch (error) {
          console.log('❌ Erreur de connexion:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        console.log('🚪 Logout');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'app-storage', // ✅ Nom du stockage persistant
      storage: createJSONStorage(() => AsyncStorage),
      // ✅ On persiste uniquement le thème et l'utilisateur
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);