// components/ui/Header.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from './Avatar';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showNotification?: boolean;
  showAvatar?: boolean;
  variant?: 'default' | 'gradient' | 'transparent';
  withSafeArea?: boolean;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
  rightIcon?: React.ReactNode;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const C = {
  bg: '#0E1117',
  surface: '#12151E',
  border: '#1C2030',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  accent: '#6366F1',
  accentDim: '#818CF8',
};

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showNotification = false,
  showAvatar = false,
  variant = 'default',
  withSafeArea = true,
  onBackPress,
  onNotificationPress,
  onAvatarPress,
  rightIcon,
  leftComponent,
  rightComponent,
}) => {
  const isDark = true; // À connecter avec votre theme hook

  // Animation pour l'apparition du header
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        damping: 20,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const headerStyles = {
    default: {
      bg: isDark ? C.surface : '#FFFFFF',
      border: isDark ? C.border : '#E8EAF0',
      text: isDark ? C.textPrimary : '#1A1A2E',
      subtitle: isDark ? C.textMuted : '#64748B',
      statusBar: isDark ? 'light-content' : 'dark-content',
    },
    gradient: {
      bg: 'transparent',
      border: 'transparent',
      text: '#FFFFFF',
      subtitle: 'rgba(255,255,255,0.7)',
      statusBar: 'light-content',
    },
    transparent: {
      bg: 'transparent',
      border: 'transparent',
      text: isDark ? C.textPrimary : '#1A1A2E',
      subtitle: isDark ? C.textMuted : '#64748B',
      statusBar: isDark ? 'light-content' : 'dark-content',
    },
  };

  const style = headerStyles[variant];
  const isGradient = variant === 'gradient';

  const HeaderContent = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: Platform.OS === 'ios' ? 16 : 12,
        backgroundColor: style.bg,
        borderBottomWidth: variant !== 'gradient' && variant !== 'transparent' ? 1 : 0,
        borderBottomColor: style.border,
      }}
    >
      {/* Gauche */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBackPress}
            style={{ padding: 8, marginLeft: -8 }}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color={style.text} />
          </TouchableOpacity>
        ) : (
          leftComponent
        )}
      </View>

      {/* Centre - Titre */}
      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 8 }}>
        {title && (
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              letterSpacing: 0.3,
              color: style.text,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              letterSpacing: 0.4,
              color: style.subtitle,
            }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Droite */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {rightComponent}
        {showNotification && (
          <TouchableOpacity
            onPress={onNotificationPress}
            style={{ padding: 8, position: 'relative' }}
            activeOpacity={0.7}
          >
            <Feather name="bell" size={20} color={style.text} />
            {/* Petit indicateur */}
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: C.accent,
                borderWidth: 1.5,
                borderColor: variant === 'gradient' ? 'transparent' : C.surface,
              }}
            />
          </TouchableOpacity>
        )}
        {showAvatar && (
          <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.7}>
            <Avatar
              name="Jean Moukoko"
              size="sm"
              variant="circle"
              gradient={isGradient}
              ring
              ringColor={isGradient ? 'rgba(255,255,255,0.2)' : C.accent}
            />
          </TouchableOpacity>
        )}
        {rightIcon && rightIcon}
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle={style.statusBar as any} backgroundColor={style.bg} />

      {isGradient ? (
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#A78BFA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
            }}
          >
            {withSafeArea ? (
              <SafeAreaView>
                <HeaderContent />
              </SafeAreaView>
            ) : (
              <HeaderContent />
            )}
          </Animated.View>
        </LinearGradient>
      ) : (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateY }],
          }}
        >
          {withSafeArea ? (
            <SafeAreaView style={{ backgroundColor: style.bg }}>
              <HeaderContent />
            </SafeAreaView>
          ) : (
            <HeaderContent />
          )}
        </Animated.View>
      )}
    </>
  );
};