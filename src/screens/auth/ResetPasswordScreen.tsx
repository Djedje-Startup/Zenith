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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme'; // ✅ Thème centralisé

// ──────────────────────────────────────────────────────────────
// COMPOSANT INPUT PERSONNALISÉ
// ──────────────────────────────────────────────────────────────
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
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontSize: 11,
        fontWeight: '600',
        color: hasError ? colors.error : focused ? colors.primary : colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.1,
        marginBottom: 8,
      }}>
        {label}
      </Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: focused ? colors.primaryBg : colors.surfaceElevated,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: hasError ? colors.error : focused ? colors.primary : colors.border,
        paddingHorizontal: 14,
        height: 52,
      }}>
        <Feather 
          name={icon} 
          size={18} 
          color={hasError ? colors.error : focused ? colors.primary : colors.textMuted} 
          style={{ marginRight: 10 }} 
        />
        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            color: colors.text,
            letterSpacing: 0.2,
            paddingVertical: 0,
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
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
          <Feather name="alert-circle" size={12} color={colors.error} />
          <Text style={{ fontSize: 11, color: colors.error, marginLeft: 4 }}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// ──────────────────────────────────────────────────────────────
// SCREEN PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const ResetPasswordScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const goToLogin = () => {
    navigation.navigate('Login');
  };

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

  // ─── ÉTAT SUCCÈS ───
  if (isSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={{ paddingHorizontal: 24, alignItems: 'center' }}>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              style={{ alignItems: 'center' }}
            >
              <LinearGradient
                colors={[colors.success, colors.success + 'CC']}
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
                color: colors.text,
                textAlign: 'center',
              }}>
                Mot de passe modifié !
              </Text>
              <Text style={{
                fontSize: 14,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 8,
                lineHeight: 20,
              }}>
                Votre mot de passe a été réinitialisé avec succès.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToLogin}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 14,
                  paddingHorizontal: 32,
                  paddingVertical: 14,
                  marginTop: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                  elevation: 4,
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

  // ─── RENDU PRINCIPAL ───
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}>

          {/* ───── HEADER ───── */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 100 }}
            style={{ alignItems: 'center', marginBottom: 40 }}
          >
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={goToLogin}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                padding: 8,
              }}
            >
              <Feather name="arrow-left" size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Feather name="lock" size={28} color={colors.primary} />
            </View>
            
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.text,
              textAlign: 'center',
            }}>
              Nouveau mot de passe
            </Text>
            <Text style={{
              fontSize: 13,
              color: colors.textMuted,
              textAlign: 'center',
              marginTop: 4,
            }}>
              Choisissez un mot de passe sécurisé
            </Text>
          </MotiView>

          {/* ───── FORMULAIRE ───── */}
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 200 }}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
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
                  color={colors.textMuted} 
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

          {/* ───── BOUTON ───── */}
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
                colors={isLoading ? [colors.textMuted, colors.textMuted] : [colors.primary, colors.secondary]}
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
                    <ActivityIndicator color="rgba(255,255,255,0.6)" size="small" />
                    <Text style={{ 
                      fontSize: 15, 
                      fontWeight: '700', 
                      color: 'rgba(255,255,255,0.6)', 
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
              onPress={goToLogin}
              style={{ marginTop: 16, alignItems: 'center' }}
            >
              <Text style={{ 
                fontSize: 13, 
                color: colors.primary, 
                fontWeight: '600' 
              }}>
                Retour à la connexion
              </Text>
            </TouchableOpacity>
          </MotiView>

          {/* ───── VERSION ───── */}
          <Text style={{
            textAlign: 'center',
            fontSize: 11,
            color: colors.textMuted,
            letterSpacing: 0.3,
            marginTop: 24,
          }}>
            ZENITH · Version 1.0.0
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};