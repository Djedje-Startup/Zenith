// components/animations/EmptyState.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Feather.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'compact';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'inbox',
  actionLabel,
  onAction,
  variant = 'default',
}) => {
  const isCompact = variant === 'compact';

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
      className={cn(
        'items-center justify-center',
        isCompact ? 'py-8 px-4' : 'py-12 px-6'
      )}
    >
      <View
        className={cn(
          'rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4',
          isCompact ? 'w-16 h-16' : 'w-20 h-20'
        )}
      >
        <Feather
          name={icon}
          size={isCompact ? 32 : 40}
          color="#9CA3AF"
        />
      </View>

      <Text
        className={cn(
          'text-gray-900 dark:text-white font-semibold text-center',
          isCompact ? 'text-base' : 'text-lg'
        )}
      >
        {title}
      </Text>

      {description && (
        <Text
          className={cn(
            'text-gray-500 dark:text-gray-400 text-center mt-1',
            isCompact ? 'text-xs' : 'text-sm'
          )}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size={isCompact ? 'sm' : 'md'}
          className="mt-4"
        />
      )}
    </MotiView>
  );
};

// Import manquant
import { cn } from '../../utils/cn';