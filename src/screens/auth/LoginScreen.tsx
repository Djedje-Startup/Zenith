// screens/auth/LoginScreen.tsx
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
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // ✅ Ajout
import { useAppStore } from '../../store';

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
  keyboardType?: any;
  autoCapitalize?: any;
  icon: keyof typeof Feather.glyphMap;
  rightAction?: () => void;
  rightIcon?: React.ReactNode;
}

const SuryaInput: React.FC<SuryaInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  icon,
  rightAction,
  rightIcon,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontSize: 11,
        fontWeight: '600',
        color: focused ? C.accentDim : C.textMuted,
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
        borderColor: focused ? C.borderFocus : C.border,
        paddingHorizontal: 14,
        height: 52,
      }}>
        <Feather 
          name={icon} 
          size={18} 
          color={focused ? C.accentDim : C.textMuted} 
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
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'sentences'}
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
    </View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────
export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // ✅ Navigation
  const navigation = useNavigation<any>();
  
  // ✅ Utilisation directe du store
  const { login, isLoading } = useAppStore();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setError('');
    
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || 'Email ou mot de passe incorrect');
    }
  };

  // ✅ Fonction pour naviguer vers ForgotPassword
  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

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

          {/* ───── Logo & titre ───── */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>

            {/* Halo derrière le logo */}
            <View style={{
              position: 'absolute',
              top: -20,
              width: 160,
              height: 160,
              backgroundColor: 'rgba(99,102,241,0.07)',
              borderRadius: 80,
            }} />

            {/* Cercle logo */}
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: C.surface,
              borderWidth: 1,
              borderColor: '#252A40',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
              <LinearGradient
                colors={['#4F46E5', '#818CF8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="star" size={28} color="#FFFFFF" />
              </LinearGradient>
            </View>

            <Text style={{
              fontSize: 26,
              fontWeight: '800',
              color: C.textPrimary,
              letterSpacing: 6,
              textTransform: 'uppercase',
            }}>
              SURYA
            </Text>
            <Text style={{
              fontSize: 12,
              color: C.textMuted,
              marginTop: 6,
              letterSpacing: 0.4,
            }}>
              Système de gestion scolaire
            </Text>
          </View>

          {/* ───── Formulaire ───── */}
          <View style={{
            backgroundColor: C.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: C.border,
            padding: 20,
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 15,
              fontWeight: '700',
              color: C.textSecondary,
              marginBottom: 20,
              letterSpacing: -0.2,
            }}>
              Connexion à votre compte
            </Text>

            <SuryaInput
              label="Adresse email"
              placeholder="exemple@surya.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail"
            />

            <SuryaInput
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon="lock"
              rightAction={() => setShowPassword(!showPassword)}
              rightIcon={
                <Feather 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={18} 
                  color={C.textMuted} 
                />
              }
            />

            {/* Mot de passe oublié - ✅ avec navigation */}
            <TouchableOpacity 
              style={{ alignSelf: 'flex-end', marginTop: -4, marginBottom: 20 }}
              activeOpacity={0.7}
              onPress={goToForgotPassword} // ✅ Ajout
            >
              <Text style={{ fontSize: 12, color: C.accentDim, fontWeight: '600' }}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            {/* Erreur */}
            {error ? (
              <View style={{
                backgroundColor: C.redBg,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(239,68,68,0.18)',
                padding: 12,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Feather name="alert-circle" size={16} color={C.red} />
                <Text style={{ fontSize: 13, color: C.red, flex: 1, marginLeft: 8 }}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Bouton connexion */}
            <TouchableOpacity
              onPress={handleLogin}
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
                      Connexion en cours…
                    </Text>
                  </>
                ) : (
                  <>
                    <Feather name="log-in" size={18} color="#FFFFFF" />
                    <Text style={{ 
                      fontSize: 15, 
                      fontWeight: '700', 
                      color: '#FFFFFF', 
                      letterSpacing: 0.3,
                      marginLeft: 10,
                    }}>
                      Se connecter
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ───── Version ───── */}
          <Text style={{
            textAlign: 'center',
            fontSize: 11,
            color: C.textDim,
            letterSpacing: 0.3,
            marginTop: 12,
          }}>
            SURYA · Version 1.0.0
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};