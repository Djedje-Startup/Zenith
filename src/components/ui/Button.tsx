// components/ui/Button.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  View, 
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onPress: () => void;
  className?: string;
}

const C = {
  bg: '#0E1117',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.10)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  border: '#1C2030',
};

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onPress,
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation pour l'effet de pression
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isPressed ? 0.97 : 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [isPressed]);

  const sizes = {
    sm: { px: 14, py: 8, fontSize: 11, gap: 4 },
    md: { px: 20, py: 12, fontSize: 13, gap: 6 },
    lg: { px: 26, py: 16, fontSize: 15, gap: 8 },
  };

  const sizeStyle = sizes[size];

  // Styles pour chaque variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: C.accent,
          text: '#FFFFFF',
          border: 'transparent',
          glow: 'rgba(99,102,241,0.30)',
        };
      case 'secondary':
        return {
          bg: C.accentBg,
          text: C.accentDim,
          border: C.border,
          glow: 'rgba(99,102,241,0.08)',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: C.textPrimary,
          border: C.border,
          glow: 'transparent',
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: C.textMuted,
          border: 'transparent',
          glow: 'transparent',
        };
      case 'danger':
        return {
          bg: C.redBg,
          text: C.red,
          border: 'rgba(239,68,68,0.15)',
          glow: 'rgba(239,68,68,0.10)',
        };
      case 'gradient':
        return {
          bg: 'transparent',
          text: '#FFFFFF',
          border: 'transparent',
          glow: 'rgba(99,102,241,0.30)',
          gradient: true,
        };
      default:
        return {
          bg: C.accent,
          text: '#FFFFFF',
          border: 'transparent',
          glow: 'rgba(99,102,241,0.30)',
        };
    }
  };

  const styles = getVariantStyles();

  const ButtonContent = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        overflow: 'hidden',
        paddingHorizontal: sizeStyle.px,
        paddingVertical: sizeStyle.py,
        gap: sizeStyle.gap,
        backgroundColor: variant === 'gradient' ? 'transparent' : styles.bg,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: styles.border,
        opacity: disabled ? 0.4 : 1,
        ...(fullWidth && { width: '100%' }),
        ...(variant === 'ghost' && { backgroundColor: 'transparent' }),
      }}
    >
      {/* Gradient variant */}
      {variant === 'gradient' && (
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {/* Glow pour primary */}
      {variant === 'primary' && (
        <View
          style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 80,
            height: 80,
            backgroundColor: styles.glow,
            borderRadius: 40,
            opacity: 0.3,
          }}
        />
      )}

      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? C.accentDim : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View>{icon}</View>}
          <Text
            style={{
              fontWeight: '600',
              letterSpacing: 0.3,
              fontSize: sizeStyle.fontSize,
              color: styles.text,
              ...(variant === 'ghost' && { color: C.textMuted }),
            }}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View>{icon}</View>}
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || loading}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={fullWidth ? { width: '100%' } : {}}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <ButtonContent />
      </Animated.View>
    </TouchableOpacity>
  );
};