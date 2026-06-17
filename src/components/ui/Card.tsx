// components/ui/Card.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onPress?: () => void;
  glow?: boolean;
  borderGlow?: boolean;
  className?: string;
}

const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  borderSub: '#141720',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.06)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  radius = 'lg',
  onPress,
  glow = false,
  borderGlow = false,
  className,
}) => {
  const paddings = {
    none: 0,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  };

  const radii = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  };

  // Fonction pour obtenir les styles avec un type explicite
  const getVariantStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.border,
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyles,
          shadowOpacity: 0,
        };
      case 'elevated':
        return {
          ...baseStyles,
          shadowColor: 'rgba(0,0,0,0.8)',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 4,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: C.border,
          shadowOpacity: 0,
        };
      case 'gradient':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          shadowOpacity: 0,
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',
          shadowOpacity: 0,
        };
      default:
        return {
          ...baseStyles,
          shadowOpacity: 0,
        };
    }
  };

  const paddingValue = paddings[padding];
  const radiusValue = radii[radius];

  const isGradient = variant === 'gradient';
  const variantStyle = getVariantStyles();

  const CardContent = () => (
    <View
      style={{
        overflow: 'hidden',
        borderRadius: radiusValue,
        backgroundColor: isGradient ? 'transparent' : variantStyle.backgroundColor,
        borderWidth: variantStyle.borderWidth || 0,
        borderColor: borderGlow ? 'rgba(99,102,241,0.15)' : variantStyle.borderColor || C.border,
        shadowColor: variantStyle.shadowColor,
        shadowOffset: variantStyle.shadowOffset,
        shadowOpacity: variantStyle.shadowOpacity || 0,
        shadowRadius: variantStyle.shadowRadius || 0,
        elevation: variantStyle.elevation || 0,
        padding: paddingValue,
        position: 'relative',
      }}
    >
      {/* Glow subtil */}
      {glow && (
        <View
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            backgroundColor: 'rgba(99,102,241,0.04)',
            borderRadius: 60,
          }}
        />
      )}

      {/* Border glow animé */}
      {borderGlow && (
        <View
          style={{
            position: 'absolute',
            top: -1,
            left: -1,
            right: -1,
            bottom: -1,
            borderRadius: radiusValue + 2,
            borderWidth: 1.5,
            borderColor: 'rgba(99,102,241,0.10)',
            opacity: 0.5,
          }}
        />
      )}

      {/* Gradient variant */}
      {isGradient && (
        <LinearGradient
          colors={['rgba(99,102,241,0.06)', 'rgba(167,139,250,0.03)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: radiusValue,
          }}
        />
      )}

      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={className ? {} : {}}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={className ? {} : {}}>
      <CardContent />
    </View>
  );
};

// Composant Card.Header intégré
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <View
    style={{
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    {children}
  </View>
);

// Composant Card.Title intégré
export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text
    style={{
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.4,
      color: C.textPrimary,
    }}
  >
    {children}
  </Text>
);

// Composant Card.Subtitle intégré
export const CardSubtitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children }) => (
  <Text
    style={{
      fontSize: 12,
      fontWeight: '500',
      color: C.textMuted,
    }}
  >
    {children}
  </Text>
);

// Composant Card.Divider intégré
export const CardDivider: React.FC<{
  className?: string;
}> = ({ className }) => (
  <View
    style={{
      height: 1,
      backgroundColor: C.border,
      marginVertical: 12,
    }}
  />
);