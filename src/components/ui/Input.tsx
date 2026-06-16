// components/ui/Input.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { cn } from '../../utils/cn';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn('mb-4', className)}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}
      <MotiView
        animate={{
          borderColor: error ? '#EF4444' : isFocused ? '#F5A623' : '#E2E8F0',
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ type: 'timing', duration: 200 }}
        className="rounded-xl border bg-white"
        style={{ borderWidth: 1 }}
      >
        <View className="flex-row items-center">
          {leftIcon && <View className="pl-3">{leftIcon}</View>}
          <TextInput
            className={cn(
              'flex-1 py-3 px-4 text-gray-900 text-base',
              multiline && 'text-left',
              leftIcon && 'pl-2',
              rightIcon && 'pr-2'
            )}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? 'top' : 'center'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {rightIcon && (
            <TouchableOpacity onPress={onRightIconPress} className="pr-3">
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </MotiView>
      {error && <Text className="text-xs text-red-500 mt-1 ml-1">{error}</Text>}
    </View>
  );
};