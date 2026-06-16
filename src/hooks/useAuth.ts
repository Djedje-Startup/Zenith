// hooks/useAuth.ts
import { useAppStore } from '../store';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, setUser } = useAppStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
  };
};