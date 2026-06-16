// components/ui/Avatar.tsx
import React from 'react';
import { View, Image, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded';
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  variant = 'circle',
  online = false,
}) => {
  const sizes = {
    xs: { container: 24, text: 'text-xs' },
    sm: { container: 32, text: 'text-sm' },
    md: { container: 40, text: 'text-base' },
    lg: { container: 48, text: 'text-lg' },
    xl: { container: 64, text: 'text-xl' },
  };

  const shape = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
  };

  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <View className="relative">
      <View
        className={cn(
          'bg-orange-100 items-center justify-center overflow-hidden',
          shape[variant]
        )}
        style={{ width: sizes[size].container, height: sizes[size].container }}
      >
        {source ? (
          <Image
            source={{ uri: source }}
            className="w-full h-full"
            style={{ width: sizes[size].container, height: sizes[size].container }}
          />
        ) : (
          <Text className={cn('font-semibold text-orange-600', sizes[size].text)}>
            {initials}
          </Text>
        )}
      </View>
      {online && (
        <View
          className="absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-white"
          style={{ width: sizes[size].container / 3.5, height: sizes[size].container / 3.5 }}
        />
      )}
    </View>
  );
};