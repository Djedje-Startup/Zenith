// components/ui/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  color?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  color = '#F5A623',
}) => {
  const content = (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ loop: true, duration: 800, repeatReverse: true }}
    >
      <ActivityIndicator size="large" color={color} />
    </MotiView>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        {content}
      </View>
    );
  }

  return content;
};