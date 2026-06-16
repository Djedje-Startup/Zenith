// utils/colors.ts

export const SURYA_COLORS = {
  // Or SURYA
  gold: {
    50: '#FFF9EB',
    100: '#FEF0C7',
    200: '#FDE193',
    300: '#FCD260',
    400: '#FBC32D',
    500: '#F5A623',
    600: '#E0950A',
    700: '#C27D08',
    800: '#A36506',
    900: '#844D04',
  },
  // Teal
  teal: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C5',
    400: '#38B2AC',
    500: '#2DD4BF',
    600: '#14B8A6',
    700: '#0F9F8F',
    800: '#0B7E6F',
    900: '#075E52',
  },
  // Coral
  coral: {
    500: '#FF6B6B',
    600: '#EE5A5A',
  },
  // États
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  // Mode clair
  light: {
    background: '#FAFAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F8F9FE',
    border: '#EDF2F7',
    text: {
      primary: '#1E293B',
      secondary: '#475569',
      tertiary: '#94A3B8',
    },
  },
  // Mode sombre
  dark: {
    background: '#0F1117',
    surface: '#1A1D26',
    surfaceElevated: '#222631',
    border: '#2D3342',
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
    },
  },
};

export const COLORS = {
  primary: SURYA_COLORS.gold[500],
  secondary: SURYA_COLORS.teal[500],
  accent: SURYA_COLORS.coral[500],
  success: SURYA_COLORS.success,
  warning: SURYA_COLORS.warning,
  error: SURYA_COLORS.error,
  info: SURYA_COLORS.info,
};

export default SURYA_COLORS;