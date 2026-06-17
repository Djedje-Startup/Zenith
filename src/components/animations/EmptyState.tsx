// components/animations/EmptyState.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'compact' | 'minimal';
  animated?: boolean;
  className?: string;
}

// Palette de couleurs premium
const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.08)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.08)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.08)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.08)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.08)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.08)',
  pink: '#F472B6',
  pinkBg: 'rgba(244,114,182,0.08)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

// Configuration des icônes avec couleurs par défaut
const ICON_CONFIG = {
  inbox: { color: C.blue, bg: C.blueBg },
  'file-text': { color: C.purple, bg: C.purpleBg },
  calendar: { color: C.accent, bg: C.accentBg },
  users: { color: C.green, bg: C.greenBg },
  'user-plus': { color: C.green, bg: C.greenBg },
  search: { color: C.amber, bg: C.amberBg },
  'alert-circle': { color: C.red, bg: C.redBg },
  'message-circle': { color: C.blue, bg: C.blueBg },
  'edit-2': { color: C.purple, bg: C.purpleBg },
  'check-circle': { color: C.green, bg: C.greenBg },
  'x-circle': { color: C.red, bg: C.redBg },
  clock: { color: C.amber, bg: C.amberBg },
  bell: { color: C.accent, bg: C.accentBg },
  heart: { color: C.pink, bg: C.pinkBg },
  star: { color: C.amber, bg: C.amberBg },
};

// Composant pour l'icône animée
const AnimatedIcon = ({
  icon,
  color,
  isCompact,
}: {
  icon: keyof typeof Feather.glyphMap;
  color: string;
  isCompact: boolean;
}) => {
  const iconSize = isCompact ? 28 : 36;
  const containerSize = isCompact ? 64 : 80;

  return (
    <MotiView
      from={{ scale: 0.8, opacity: 0, rotate: '-10deg' }}
      animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      }}
    >
      <View
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor: color + '12',
          borderWidth: 1.5,
          borderColor: color + '25',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Glow subtil */}
        <View
          style={{
            position: 'absolute',
            width: containerSize * 0.6,
            height: containerSize * 0.6,
            borderRadius: containerSize * 0.3,
            backgroundColor: color + '08',
          }}
        />
        <Feather name={icon} size={iconSize} color={color} />
      </View>
    </MotiView>
  );
};

// Composant pour l'état minimal
const MinimalEmptyState = ({
  title,
  description,
  icon,
  iconColor,
}: {
  title: string;
  description?: string;
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
    <Feather name={icon} size={20} color={iconColor} />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: C.textPrimary }}>
        {title}
      </Text>
      {description && (
        <Text style={{ fontSize: 12, color: C.textMuted }}>
          {description}
        </Text>
      )}
    </View>
  </View>
);

// Composant principal
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'inbox',
  iconColor,
  actionLabel,
  onAction,
  variant = 'default',
  animated = true,
  className,
}) => {
  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  // Configuration de l'icône
  const iconConfig = ICON_CONFIG[icon as keyof typeof ICON_CONFIG] || ICON_CONFIG.inbox;
  const color = iconColor || iconConfig.color;

  // Si minimal, afficher une version simplifiée
  if (isMinimal) {
    return (
      <MinimalEmptyState
        title={title}
        description={description}
        icon={icon}
        iconColor={color}
      />
    );
  }

  return (
    <MotiView
      from={animated ? { opacity: 0, scale: 0.95, translateY: 10 } : undefined}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300,
        mass: 0.9,
        delay: 100,
      }}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: isCompact ? 32 : 48,
        paddingHorizontal: isCompact ? 16 : 24,
      }}
    >
      {/* Icône animée */}
      <AnimatedIcon
        icon={icon}
        color={color}
        isCompact={isCompact}
      />

      {/* Titre */}
      <Text
        style={{
          fontWeight: '700',
          textAlign: 'center',
          marginTop: 16,
          fontSize: isCompact ? 16 : 20,
          color: C.textPrimary,
        }}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <MotiView
          from={animated ? { opacity: 0, translateY: 5 } : undefined}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
        >
          <Text
            style={{
              textAlign: 'center',
              marginTop: 6,
              maxWidth: 320,
              fontSize: isCompact ? 12 : 14,
              color: C.textMuted,
            }}
          >
            {description}
          </Text>
        </MotiView>
      )}

      {/* Bouton d'action */}
      {actionLabel && onAction && (
        <MotiView
          from={animated ? { opacity: 0, translateY: 10 } : undefined}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
          style={{ marginTop: 20 }}
        >
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="gradient"
            size={isCompact ? 'sm' : 'md'}
            icon={<Feather name="plus" size={16} color="#FFFFFF" />}
          />
        </MotiView>
      )}
    </MotiView>
  );
};

// Composant pour les états vides avec illustration
export const IllustratedEmptyState: React.FC<{
  title: string;
  description?: string;
  illustration: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}> = ({
  title,
  description,
  illustration,
  actionLabel,
  onAction,
}) => (
  <MotiView
    from={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', damping: 25 }}
    style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 }}
  >
    <View style={{ marginBottom: 16 }}>
      {illustration}
    </View>

    <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center', color: C.textPrimary }}>
      {title}
    </Text>

    {description && (
      <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 6, maxWidth: 320, color: C.textMuted }}>
        {description}
      </Text>
    )}

    {actionLabel && onAction && (
      <View style={{ marginTop: 20 }}>
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="gradient"
        />
      </View>
    )}
  </MotiView>
);

// Exemple d'illustration pour EmptyState
export const EmptyStateIllustration = ({
  icon,
  color,
}: {
  icon: keyof typeof Feather.glyphMap;
  color: string;
}) => (
  <View
    style={{
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: color + '08',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: color + '12',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Feather name={icon} size={40} color={color} />
    </View>
  </View>
);