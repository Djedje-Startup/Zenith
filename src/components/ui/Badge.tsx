// components/ui/Badge.tsx
import React from 'react';
import { View, Text } from 'react-native';


interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'purple' | 'pink';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  glow?: boolean;
  className?: string;
}

const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  accent: '#6366F1',
  accentDim: '#818CF8',
  green: '#34D399',
  purple: '#A78BFA',
  pink: '#F472B6',
  blue: '#60A5FA',
  amber: '#FBBF24',
  red: '#EF4444',
};

const variantStyles = {
  default: {
    bg: C.surfaceAlt,
    text: C.textSecondary,
    border: C.border,
    glow: 'rgba(99,102,241,0.03)',
  },
  primary: {
    bg: 'rgba(99,102,241,0.12)',
    text: C.accentDim,
    border: 'rgba(99,102,241,0.20)',
    glow: 'rgba(99,102,241,0.15)',
  },
  success: {
    bg: 'rgba(16,185,129,0.09)',
    text: C.green,
    border: 'rgba(16,185,129,0.20)',
    glow: 'rgba(16,185,129,0.12)',
  },
  warning: {
    bg: 'rgba(251,191,36,0.09)',
    text: C.amber,
    border: 'rgba(251,191,36,0.20)',
    glow: 'rgba(251,191,36,0.12)',
  },
  error: {
    bg: 'rgba(239,68,68,0.09)',
    text: C.red,
    border: 'rgba(239,68,68,0.20)',
    glow: 'rgba(239,68,68,0.12)',
  },
  info: {
    bg: 'rgba(96,165,250,0.09)',
    text: C.blue,
    border: 'rgba(96,165,250,0.20)',
    glow: 'rgba(96,165,250,0.12)',
  },
  purple: {
    bg: 'rgba(167,139,250,0.09)',
    text: C.purple,
    border: 'rgba(167,139,250,0.20)',
    glow: 'rgba(167,139,250,0.12)',
  },
  pink: {
    bg: 'rgba(244,114,182,0.09)',
    text: C.pink,
    border: 'rgba(244,114,182,0.20)',
    glow: 'rgba(244,114,182,0.12)',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'md',
  icon,
  glow = false,
  className = '',
}) => {
  const styles = variantStyles[variant];
  const isDefault = variant === 'default';

  const sizeStyles = {
    sm: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    md: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  };

  const textSizes = {
    sm: 10,
    md: 11,
  };

  const sizeConfig = sizeStyles[size];
  const fontSize = textSizes[size];

  return (
    <View
      style={{
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        overflow: 'hidden',
        ...sizeConfig,
        backgroundColor: styles.bg,
        borderWidth: isDefault ? 1 : 1,
        borderColor: isDefault ? C.border : styles.border,
      }}
    >
      {/* Glow subtil */}
      {glow && !isDefault && (
        <View
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 60,
            height: 60,
            backgroundColor: styles.glow,
            borderRadius: 30,
            opacity: 0.5,
          }}
        />
      )}

      {icon && <View style={{ marginRight: 2 }}>{icon}</View>}
      <Text
        style={{
          fontWeight: '600',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          fontSize: fontSize,
          color: isDefault ? C.textMuted : styles.text,
        }}
      >
        {text}
      </Text>
    </View>
  );
};