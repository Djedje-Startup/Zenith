// components/ui/LoadingSpinner.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  color?: string;
  size?: 'small' | 'large';
  text?: string;
  variant?: 'default' | 'gradient' | 'dots';
  overlay?: boolean;
}

const C = {
  bg: '#0E1117',
  surface: '#12151E',
  accent: '#6366F1',
  accentDim: '#818CF8',
  textPrimary: '#E8EAF0',
  textMuted: '#4A5060',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  color = C.accent,
  size = 'large',
  text,
  variant = 'default',
  overlay = false,
}) => {
  const spinnerColor = variant === 'gradient' ? '#FFFFFF' : color;
  
  // Animation pour le spinner par défaut
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Animation pour les dots
  const dotAnimations = [0, 1, 2].map((i) => {
    const dotValue = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotValue, {
            toValue: 1,
            duration: 400,
            delay: i * 150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dotValue, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    return dotValue;
  });

  // Variante Dots avec animation
  const DotsSpinner = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {[0, 1, 2].map((i) => {
        const scale = dotAnimations[i]?.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }) || 1;
        
        const opacity = dotAnimations[i]?.interpolate({
          inputRange: [0, 1],
          outputRange: [0.2, 1],
        }) || 0.2;

        return (
          <Animated.View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: C.accent,
              transform: [{ scale }],
              opacity,
            }}
          />
        );
      })}
    </View>
  );

  // Variante Gradient avec LinearGradient
  const GradientSpinner = () => (
    <View style={{ position: 'relative' }}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: 'rgba(99,102,241,0.08)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#A78BFA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="small" color="#FFFFFF" />
        </LinearGradient>
      </View>
    </View>
  );

  // Spinner par défaut avec animation
  const DefaultSpinner = () => (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <ActivityIndicator size={size} color={spinnerColor} />
    </Animated.View>
  );

  const SpinnerContent = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      {variant === 'dots' ? (
        <DotsSpinner />
      ) : variant === 'gradient' ? (
        <GradientSpinner />
      ) : (
        <DefaultSpinner />
      )}

      {text && (
        <Text
          style={{
            fontSize: 12,
            fontWeight: '500',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: C.textMuted,
          }}
        >
          {text}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: C.bg,
        }}
      >
        <SpinnerContent />
      </View>
    );
  }

  if (overlay) {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backgroundColor: 'rgba(14,17,23,0.85)',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(14,17,23,0.4)',
          }}
        />
        <SpinnerContent />
      </View>
    );
  }

  return <SpinnerContent />;
};