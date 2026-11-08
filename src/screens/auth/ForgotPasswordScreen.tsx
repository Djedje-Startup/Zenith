// screens/auth/ForgotPasswordScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
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
  keyboardType?: any;
  autoCapitalize?: any;
  icon: keyof typeof Feather.glyphMap;
  error?: string;
}

const SuryaInput: React.FC<SuryaInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  icon,
  error,
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
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
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
export const ForgotPasswordScreen: React.FC = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<any>();

  // Animations
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateX = useRef(new Animated.Value(-20)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.9)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation du header
    Animated.parallel([
      Animated.spring(headerTranslateY, {
        toValue: 0,
        damping: 20,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation du formulaire
    Animated.parallel([
      Animated.spring(formTranslateX, {
        toValue: 0,
        damping: 20,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation du bouton
    Animated.parallel([
      Animated.spring(buttonTranslateY, {
        toValue: 0,
        damping: 20,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animation de succès
  useEffect(() => {
    if (isSent) {
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          damping: 20,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSent]);

  const handleSend = async () => {
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    setIsLoading(true);
    setError('');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSent(true);
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  // ─── ÉTAT SUCCÈS ───
  if (isSent) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={{ paddingHorizontal: 24, alignItems: 'center' }}>
            <Animated.View
              style={{
                alignItems: 'center',
                transform: [{ scale: successScale }],
                opacity: successOpacity,
              }}
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
                Email envoyé !
              </Text>
              <Text style={{
                fontSize: 14,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 8,
                lineHeight: 20,
              }}>
                Nous vous avons envoyé un lien de réinitialisation à votre adresse email.
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
                  Retour à la connexion
                </Text>
              </TouchableOpacity>
            </Animated.View>
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
          <Animated.View
            style={{
              alignItems: 'center',
              marginBottom: 40,
              transform: [{ translateY: headerTranslateY }],
              opacity: headerOpacity,
            }}
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
              <Feather name="key" size={28} color={colors.primary} />
            </View>
            
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.text,
              textAlign: 'center',
            }}>
              Mot de passe oublié
            </Text>
            <Text style={{
              fontSize: 13,
              color: colors.textMuted,
              textAlign: 'center',
              marginTop: 4,
            }}>
              Entrez votre email pour recevoir un lien de réinitialisation
            </Text>
          </Animated.View>

          {/* ───── FORMULAIRE ───── */}
          <Animated.View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 20,
              marginBottom: 20,
              transform: [{ translateX: formTranslateX }],
              opacity: formOpacity,
            }}
          >
            <SuryaInput
              label="Adresse email"
              placeholder="exemple@zenith.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail"
              error={error}
            />
          </Animated.View>

          {/* ───── BOUTON ───── */}
          <Animated.View
            style={{
              transform: [{ translateY: buttonTranslateY }],
              opacity: buttonOpacity,
            }}
          >
            <TouchableOpacity
              onPress={handleSend}
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
                      Envoi en cours...
                    </Text>
                  </>
                ) : (
                  <>
                    <Feather name="send" size={18} color="#FFFFFF" />
                    <Text style={{ 
                      fontSize: 15, 
                      fontWeight: '700', 
                      color: '#FFFFFF', 
                      letterSpacing: 0.3,
                      marginLeft: 10,
                    }}>
                      Envoyer le lien
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
          </Animated.View>

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