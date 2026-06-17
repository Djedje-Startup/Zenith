// screens/auth/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  borderFocus: '#6366F1',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.10)',
  accentBgFocus: 'rgba(99,102,241,0.07)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.08)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
  white: '#FFFFFF',
};

// ─── Composants ──────────────────────────────────────────────────────────────
interface SuryaInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  icon: keyof typeof Feather.glyphMap;
  error?: string;
  rightAction?: () => void;
  rightIcon?: React.ReactNode;
}

const SuryaInput: React.FC<SuryaInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  icon,
  error,
  rightAction,
  rightIcon,
}) => {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontSize: 11,
        fontWeight: '600',
        color: hasError ? C.red : focused ? C.accentDim : C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.1,
        marginBottom: 8,
      }}>
        {label}
      </Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: focused ? C.accentBgFocus : C.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: hasError ? C.red : focused ? C.borderFocus : C.border,
        paddingHorizontal: 14,
        height: 52,
      }}>
        <Feather 
          name={icon} 
          size={18} 
          color={hasError ? C.red : focused ? C.accentDim : C.textMuted} 
          style={{ marginRight: 10 }} 
        />
        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            color: C.textPrimary,
            letterSpacing: 0.2,
            paddingVertical: 0,
          }}
          placeholder={placeholder}
          placeholderTextColor={C.textDim}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightAction && rightIcon && (
          <TouchableOpacity 
            onPress={rightAction} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {hasError && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Feather name="alert-circle" size={12} color={C.red} />
          <Text style={{ fontSize: 11, color: C.red, marginLeft: 4 }}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────
export const ResetPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    setError('');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={{ paddingHorizontal: 24, alignItems: 'center' }}>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              style={{ alignItems: 'center' }}
            >
              <LinearGradient
                colors={['#34D399', '#059669']}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Feather name="check" size={36} color="#FFFFFF" />
              </LinearGradient>

              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: C.textPrimary,
                textAlign: 'center',
              }}>
                Mot de passe modifié !
              </Text>
              <Text style={{
                fontSize: 14,
                color: C.textMuted,
                textAlign: 'center',
                marginTop: 8,
                lineHeight: 20,
              }}>
                Votre mot de passe a été réinitialisé avec succès.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  backgroundColor: C.accent,
                  borderRadius: 14,
                  paddingHorizontal: 32,
                  paddingVertical: 14,
                  marginTop: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Feather name="log-in" size={18} color="#FFFFFF" />
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 10,
                }}>
                  Se connecter
                </Text>
              </TouchableOpacity>
            </MotiView>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: C.bg }}
    >
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>

          {/* ───── Header ───── */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 100 }}
            style={{ alignItems: 'center', marginBottom: 40 }}
          >
            <TouchableOpacity 
              activeOpacity={0.7}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                padding: 8,
              }}
            >
              <Feather name="arrow-left" size={24} color={C.accentDim} />
            </TouchableOpacity>
            
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: C.surface,
              borderWidth: 1,
              borderColor: C.border,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Feather name="lock" size={28} color={C.accentDim} />
            </View>
            
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: C.textPrimary,
              textAlign: 'center',
            }}>
              Nouveau mot de passe
            </Text>
            <Text style={{
              fontSize: 13,
              color: C.textMuted,
              textAlign: 'center',
              marginTop: 4,
            }}>
              Choisissez un mot de passe sécurisé
            </Text>
          </MotiView>

          {/* ───── Formulaire ───── */}
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 200 }}
            style={{
              backgroundColor: C.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: C.border,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <SuryaInput
              label="Nouveau mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon="lock"
              error={error && !confirmPassword ? error : undefined}
              rightAction={() => setShowPassword(!showPassword)}
              rightIcon={
                <Feather 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={18} 
                  color={C.textMuted} 
                />
              }
            />

            <SuryaInput
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              icon="check-circle"
              error={error && password ? error : undefined}
            />
          </MotiView>

          {/* ───── Bouton ───── */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 300 }}
          >
            <TouchableOpacity
              onPress={handleReset}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={isLoading ? ['#2D2F45', '#2D2F45'] : ['#4F46E5', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 52,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                {isLoading ? (
                  <>
                    <ActivityIndicator color={C.accentDim} size="small" />
                    <Text style={{ 
                      fontSize: 15, 
                      fontWeight: '700', 
                      color: C.accentDim, 
                      letterSpacing: 0.3,
                      marginLeft: 10,
                    }}>
                      Réinitialisation...
                    </Text>
                  </>
                ) : (
                  <>
                    <Feather name="refresh-cw" size={18} color="#FFFFFF" />
                    <Text style={{ 
                      fontSize: 15, 
                      fontWeight: '700', 
                      color: '#FFFFFF', 
                      letterSpacing: 0.3,
                      marginLeft: 10,
                    }}>
                      Réinitialiser le mot de passe
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Lien retour */}
            <TouchableOpacity 
              activeOpacity={0.7}
              style={{ marginTop: 16, alignItems: 'center' }}
            >
              <Text style={{ 
                fontSize: 13, 
                color: C.accentDim, 
                fontWeight: '600' 
              }}>
                Retour à la connexion
              </Text>
            </TouchableOpacity>
          </MotiView>

          {/* ───── Version ───── */}
          <Text style={{
            textAlign: 'center',
            fontSize: 11,
            color: C.textDim,
            letterSpacing: 0.3,
            marginTop: 24,
          }}>
            SURYA · Version 1.0.0
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};