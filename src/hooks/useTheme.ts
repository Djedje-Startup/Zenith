// hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { useAppStore } from '../store';
import { lightTheme, darkTheme } from '../theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const { theme: storedTheme, setTheme } = useAppStore();

  // Déterminer le thème effectif
  const effectiveTheme = storedTheme === 'system' 
    ? (systemScheme || 'light') 
    : storedTheme || 'light';
  
  const isDark = effectiveTheme === 'dark';

  // Sélectionner le bon thème
  const colors = isDark ? darkTheme : lightTheme;

  return {
    isDark,
    effectiveTheme,
    colors,
    storedTheme,
    setTheme,
  };
};