// theme/index.ts
// Ce fichier exporte tout ce qui est nécessaire pour utiliser le thème

import { useColorScheme } from 'react-native';
import { useAppStore } from '../store';

// ─── TYPES ──────────────────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark' | 'system';

// ─── PALETTE DE COULEURS ZENITH ──────────────────────────────────────
export const COLORS = {
  // Primaires - Orange
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Orange principal
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  // Secondaires - Violet
  secondary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6', // Violet principal
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  // Neutres
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
  },
  // Fonctionnels
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// ─── THÈMES LIGHT & DARK ──────────────────────────────────────────────
export const lightTheme = {
  id: 'light',
  name: 'Clair',
  
  // Couleurs de fond
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#F4F4F5',
  
  // Couleurs de texte
  text: '#18181B',
  textSecondary: '#52525B',
  textMuted: '#A1A1AA',
  textInverse: '#FFFFFF',
  
  // Bordures
  border: '#E4E4E7',
  borderLight: '#F4F4F5',
  
  // Primaires (Orange)
  primary: COLORS.primary[500],
  primaryLight: COLORS.primary[100],
  primaryDark: COLORS.primary[700],
  primaryBg: COLORS.primary[50],
  
  // Secondaires (Violet)
  secondary: COLORS.secondary[500],
  secondaryLight: COLORS.secondary[100],
  secondaryDark: COLORS.secondary[700],
  secondaryBg: COLORS.secondary[50],
  
  // Dégradés
  gradientPrimary: ['#F97316', '#EA580C'],
  gradientSecondary: ['#8B5CF6', '#7C3AED'],
  gradientBrand: ['#F97316', '#8B5CF6'],
  
  // Ombres
  shadow: '#000000',
  shadowOpacity: 0.08,
  
  // Statut
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
  info: COLORS.info,
};

export const darkTheme = {
  id: 'dark',
  name: 'Sombre',
  
  // Couleurs de fond
  background: '#0F1117',
  surface: '#1A1D26',
  surfaceElevated: '#222633',
  
  // Couleurs de texte
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#4A5060',
  textInverse: '#18181B',
  
  // Bordures
  border: '#2D3342',
  borderLight: '#1E2230',
  
  // Primaires (Orange - légèrement ajusté pour le dark)
  primary: '#FB923C',
  primaryLight: '#C2410C',
  primaryDark: '#F97316',
  primaryBg: 'rgba(251,146,60,0.12)',
  
  // Secondaires (Violet - légèrement ajusté pour le dark)
  secondary: '#A78BFA',
  secondaryLight: '#5B21B6',
  secondaryDark: '#8B5CF6',
  secondaryBg: 'rgba(167,139,250,0.12)',
  
  // Dégradés
  gradientPrimary: ['#FB923C', '#F97316'],
  gradientSecondary: ['#A78BFA', '#8B5CF6'],
  gradientBrand: ['#FB923C', '#A78BFA'],
  
  // Ombres
  shadow: '#000000',
  shadowOpacity: 0.4,
  
  // Statut
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
};

export type Theme = typeof lightTheme;

// ─── HOOK useTheme AVEC PERSISTANCE ──────────────────────────────────
export const useTheme = () => {
  const systemScheme = useColorScheme();
  const { theme: storedTheme, setTheme } = useAppStore();

  // Déterminer le thème effectif
  const effectiveTheme = storedTheme === 'system' 
    ? (systemScheme || 'light') 
    : storedTheme || 'light';
  
  const isDark = effectiveTheme === 'dark';

  // Sélectionner le bon thème
  const currentTheme = isDark ? darkTheme : lightTheme;

  return {
    isDark,
    effectiveTheme,
    theme: currentTheme,
    colors: currentTheme,
    storedTheme,
    setTheme,
  };
};

// ─── FONCTION POUR RÉCUPÉRER LES COULEURS DIRECTEMENT ──────────────
export const getThemeColors = (mode: ThemeMode) => {
  const isDark = mode === 'dark';
  return isDark ? darkTheme : lightTheme;
};

// ─── FONCTION POUR VÉRIFIER SI LE THÈME EST SOMBRE ──────────────────
export const isDarkMode = (mode: ThemeMode, systemScheme?: 'light' | 'dark') => {
  if (mode === 'system') {
    return systemScheme === 'dark';
  }
  return mode === 'dark';
};