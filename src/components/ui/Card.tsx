// components/ui/Card.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  className,
}) => {
  const paddings = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 20,
  };

  const variants = {
    default: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#F1F5F9',
      shadowOpacity: 0,
    },
    elevated: {
      backgroundColor: '#FFFFFF',
      borderWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      shadowOpacity: 0,
    },
  };

  const Container = onPress ? TouchableOpacity : MotiView;

  return (
    <Container
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className={cn('rounded-2xl overflow-hidden', className)}
      style={[
        variants[variant],
        { padding: paddings[padding] },
      ]}
    >
      {children}
    </Container>
  );
};