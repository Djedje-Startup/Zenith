// components/ui/Avatar.tsx
import React from 'react';
import { View, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circle' | 'rounded' | 'square';
  gradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  ring?: boolean;
  ringColor?: string;
  online?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const C = {
  accent: '#6366F1',
  accentDim: '#818CF8',
  green: '#34D399',
  red: '#EF4444',
  amber: '#FBBF24',
  textMuted: '#4A5060',
  bg: '#0E1117',
};

// Utiliser 'as const' pour un tuple de type exact
const GRADIENT_COLORS = ['#6366F1', '#8B5CF6', '#A78BFA'] as const;

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  variant = 'circle',
  gradient = false,
  gradientColors = GRADIENT_COLORS,
  ring = false,
  ringColor = C.accent,
  online = false,
  status,
}) => {
  const sizes = {
    xs: { container: 28, fontSize: 10, ring: 2 },
    sm: { container: 36, fontSize: 12, ring: 2.5 },
    md: { container: 44, fontSize: 14, ring: 3 },
    lg: { container: 52, fontSize: 16, ring: 3.5 },
    xl: { container: 64, fontSize: 18, ring: 4 },
    '2xl': { container: 80, fontSize: 24, ring: 5 },
  };

  const shapeStyles = {
    circle: { borderRadius: 999 },
    rounded: { borderRadius: 16 },
    square: { borderRadius: 8 },
  };

  const statusColors = {
    online: C.green,
    offline: C.textMuted,
    away: C.amber,
    busy: C.red,
  };

  const statusDot = status || (online ? 'online' : undefined);
  const dotColor = statusDot ? statusColors[statusDot] : undefined;

  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  const sizeConfig = sizes[size];
  const containerSize = sizeConfig.container;
  const ringWidth = ring ? sizeConfig.ring : 0;
  const shapeStyle = shapeStyles[variant];

  const AvatarContent = () => {
    if (source) {
      return (
        <Image
          source={{ uri: source }}
          style={{ width: containerSize, height: containerSize }}
        />
      );
    }

    if (gradient) {
      return (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: containerSize,
            height: containerSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontWeight: '700',
              fontSize: sizeConfig.fontSize,
              color: '#FFFFFF',
            }}
          >
            {initials}
          </Text>
        </LinearGradient>
      );
    }

    return (
      <View
        style={{
          width: containerSize,
          height: containerSize,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(99,102,241,0.08)',
        }}
      >
        <Text
          style={{
            fontWeight: '600',
            fontSize: sizeConfig.fontSize,
            color: C.accentDim,
          }}
        >
          {initials}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ position: 'relative' }}>
      {/* Ring décoratif */}
      {ring && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            ...shapeStyle,
            borderWidth: ringWidth,
            borderColor: ringColor,
            opacity: 0.3,
          }}
        />
      )}

      {/* Avatar principal */}
      <View
        style={{
          overflow: 'hidden',
          ...shapeStyle,
          width: containerSize,
          height: containerSize,
          backgroundColor: 'rgba(99,102,241,0.05)',
        }}
      >
        <AvatarContent />
      </View>

      {/* Statut */}
      {dotColor && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: C.bg,
            width: containerSize / 3.5,
            height: containerSize / 3.5,
            backgroundColor: dotColor,
          }}
        />
      )}
    </View>
  );
};