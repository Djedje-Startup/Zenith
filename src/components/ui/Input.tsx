// components/ui/Input.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  success?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  helper?: string;
  className?: string;
}

const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  borderSub: '#141720',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.08)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.08)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.08)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  success = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  disabled = false,
  required = false,
  helper,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);
  
  // Animations
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isError = !!error;
  const isSuccess = success && !isError;
  const isSecureField = secureTextEntry;
  const isInteractive = !disabled;

  // Animation du label flottant
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    // Animation de la bordure et de l'échelle
    const getBorderColorValue = () => {
      if (isError) return 2;
      if (isFocused) return 1;
      if (isSuccess) return 3;
      return 0;
    };

    Animated.parallel([
      Animated.timing(borderColorAnim, {
        toValue: getBorderColorValue(),
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.002 : 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation du label flottant
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, isError, isSuccess]);

  // Interpolation des couleurs de bordure
  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [C.border, C.accent, C.red, C.green],
  });

  const getBackgroundColor = () => {
    if (disabled) return C.surfaceAlt;
    return C.surface;
  };

  const bgColor = getBackgroundColor();

  const labelStyle = {
    position: 'absolute' as const,
    left: leftIcon ? 44 : 16,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 11],
    }),
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [C.textMuted, isError ? C.red : C.accentDim],
    }),
    fontWeight: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['400', '600'],
    }),
    backgroundColor: isFocused ? C.surface : 'transparent',
    paddingHorizontal: 4,
  };

  return (
    <View style={{ marginBottom: 20 }}>
      {/* Label avec astérisque si requis */}
      {label && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', letterSpacing: 0.4, color: C.textSecondary }}>
            {label}
          </Text>
          {required && (
            <Text style={{ fontSize: 12, fontWeight: '700', marginLeft: 2, color: C.red }}>
              *
            </Text>
          )}
        </View>
      )}

      <Animated.View
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1.5,
          backgroundColor: bgColor,
          borderColor: borderColor,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {/* Icône gauche */}
          {leftIcon && (
            <View style={{ paddingLeft: 16, paddingRight: 6, opacity: isFocused ? 1 : 0.5 }}>
              {leftIcon}
            </View>
          )}

          {/* Input */}
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              paddingVertical: 14,
              paddingHorizontal: 16,
              color: disabled ? C.textMuted : C.textPrimary,
              fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
              ...(multiline && { textAlign: 'left', minHeight: 80 }),
              ...(leftIcon && { paddingLeft: 8 }),
              ...((rightIcon || isSecureField) && { paddingRight: 8 }),
              ...(!label && { paddingVertical: 16 }),
            }}
            placeholder={placeholder}
            placeholderTextColor={C.textMuted}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={!showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            textAlignVertical={multiline ? 'top' : 'center'}
            maxLength={maxLength}
            editable={isInteractive}
            selectTextOnFocus={isInteractive}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            selectionColor={C.accentDim}
          />

          {/* Bouton de révélation mot de passe */}
          {isSecureField && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ paddingRight: 14, paddingVertical: 8 }}
              activeOpacity={0.7}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={18}
                color={isFocused ? C.accentDim : C.textMuted}
              />
            </TouchableOpacity>
          )}

          {/* Icône droite personnalisée */}
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={{ paddingRight: 14, paddingVertical: 8 }}
              activeOpacity={0.7}
              disabled={!onRightIconPress}
            >
              {rightIcon}
            </TouchableOpacity>
          )}

          {/* Indicateur de succès/erreur */}
          {isSuccess && (
            <View style={{ paddingRight: 14 }}>
              <Feather name="check-circle" size={18} color={C.green} />
            </View>
          )}
          {isError && (
            <View style={{ paddingRight: 14 }}>
              <Feather name="alert-circle" size={18} color={C.red} />
            </View>
          )}
        </View>
      </Animated.View>

      {/* Messages d'aide et d'erreur */}
      <View style={{ marginTop: 6, marginLeft: 4 }}>
        {isError ? (
          <Text style={{ fontSize: 12, fontWeight: '500', color: C.red }}>
            {error}
          </Text>
        ) : helper ? (
          <Text style={{ fontSize: 12, color: C.textMuted }}>
            {helper}
          </Text>
        ) : null}
      </View>
    </View>
  );
};