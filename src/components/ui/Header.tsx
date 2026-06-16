// components/ui/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '../../utils/cn';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
  variant?: 'default' | 'gradient';
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  rightIcon?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showNotification = false,
  variant = 'default',
  onBackPress,
  onNotificationPress,
  rightIcon,
}) => {
  const isDark = false; // À connecter avec votre hook useTheme

  const HeaderContent = () => (
    <View
      className={cn(
        'flex-row items-center justify-between px-5',
        Platform.OS === 'ios' ? 'pt-12 pb-4' : 'pt-10 pb-3',
        variant === 'default' && (isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'),
        variant === 'default' && 'border-b'
      )}
    >
      <View className="flex-row items-center gap-3">
        {showBack && (
          <TouchableOpacity onPress={onBackPress} className="p-2 -ml-2">
            <Feather name="arrow-left" size={22} color={isDark ? '#FFFFFF' : '#1E293B'} />
          </TouchableOpacity>
        )}
      </View>

      <Text className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
        {title}
      </Text>

      <View className="flex-row items-center gap-2">
        {rightIcon}
        {showNotification && (
          <TouchableOpacity onPress={onNotificationPress} className="p-2">
            <Feather name="bell" size={20} color={isDark ? '#FFFFFF' : '#1E293B'} />
          </TouchableOpacity>
        )}
        <View style={{ width: 24 }} />
      </View>
    </View>
  );

  if (variant === 'gradient') {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#F5A623', '#E0950A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        >
          <HeaderContent />
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <HeaderContent />
    </>
  );
};