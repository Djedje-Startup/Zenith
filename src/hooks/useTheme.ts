// hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { useAppStore } from '../store';

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const { theme, setTheme } = useAppStore();

  const effectiveTheme = theme === 'system' ? (systemScheme || 'light') : theme;
  const isDark = effectiveTheme === 'dark';

  const colors = {
    primary: '#F5A623',
    secondary: '#2DD4BF',
    accent: '#FF6B6B',
    background: isDark ? '#0F1117' : '#FAFAFC',
    surface: isDark ? '#1A1D26' : '#FFFFFF',
    text: isDark ? '#F1F5F9' : '#1E293B',
    textSecondary: isDark ? '#CBD5E1' : '#475569',
    border: isDark ? '#2D3342' : '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  return {
    isDark,
    effectiveTheme,
    colors,
    setTheme,
  };
};