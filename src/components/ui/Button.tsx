// components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { cn } from '../../utils/cn';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onPress: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onPress,
  className,
}) => {
  const variants = {
    primary: 'bg-primary-500',
    secondary: 'bg-teal-500',
    outline: 'border border-primary-500 bg-transparent',
    ghost: 'bg-transparent',
    danger: 'bg-red-500',
  };

  const textVariants = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary-500',
    ghost: 'text-gray-600 dark:text-gray-400',
    danger: 'text-white',
  };

  const sizes = {
    sm: 'px-3 py-2 rounded-lg',
    md: 'px-4 py-3 rounded-xl',
    lg: 'px-6 py-4 rounded-xl',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      className={cn('opacity-100', disabled && 'opacity-50')}
    >
      <MotiView
        animate={{ scale: 1 }}
        transition={{ type: 'timing', duration: 150 }}
        className={cn(
          'flex-row items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className
        )}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variant === 'outline' ? '#F5A623' : 'white'} />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <Text className={cn(textVariants[variant], textSizes[size], 'font-semibold')}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </MotiView>
    </TouchableOpacity>
  );
};