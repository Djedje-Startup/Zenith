// components/ui/Badge.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  size = 'md',
  icon,
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    error: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
    primary: 'bg-orange-50 text-orange-600',
  };

  const sizes = {
    sm: 'px-2 py-0.5 rounded-md',
    md: 'px-3 py-1 rounded-lg',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <View className={cn('flex-row items-center gap-1 self-start', sizes[size], variants[variant])}>
      {icon}
      <Text className={cn(textSizes[size], 'font-medium', variants[variant])}>
        {text}
      </Text>
    </View>
  );
};