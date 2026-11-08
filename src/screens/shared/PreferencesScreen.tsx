// screens/shared/PreferencesScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeOption {
  id: ThemeMode;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  description: string;
}

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const PreferencesScreen: React.FC = () => {
  const { colors, effectiveTheme } = useTheme();
  const { theme, setTheme } = useAppStore();
  const navigation = useNavigation<any>();

  // ─── Animations ───
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ─── Options de thème ───
  const themeOptions: ThemeOption[] = [
    {
      id: 'light',
      label: 'Clair',
      icon: 'sun',
      description: 'Thème lumineux pour une utilisation en journée',
    },
    {
      id: 'dark',
      label: 'Sombre',
      icon: 'moon',
      description: 'Thème sombre pour une utilisation en soirée',
    },
    {
      id: 'system',
      label: 'Système',
      icon: 'smartphone',
      description: 'Suit les préférences système de votre appareil',
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
    Alert.alert(
      'Thème mis à jour',
      `Le thème ${mode === 'light' ? 'clair' : mode === 'dark' ? 'sombre' : 'système'} a été appliqué`,
      [{ text: 'OK' }]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // ─── RENDU ───
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ─── HEADER AVEC DÉGRADÉ ZENITH ─── */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 56,
            paddingBottom: 24,
            paddingHorizontal: 22,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleGoBack}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="arrow-left" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <View>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}>
                  Préférences
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginTop: 2,
                  letterSpacing: -0.5,
                }}>
                  Personnalisation
                </Text>
              </View>
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 10,
              alignItems: 'center',
            }}>
              <Feather name="settings" size={20} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>

        {/* ─── CONTENU ─── */}
        <Animated.View
          style={{
            paddingHorizontal: 20,
            paddingTop: 24,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          {/* Thème actuel */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 8,
            }}>
              Thème actuel
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: colors.primaryBg,
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.primary + '30',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather 
                  name={theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'smartphone'} 
                  size={20} 
                  color={colors.primary} 
                />
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.primary,
                }}>
                  {theme === 'light' ? 'Clair' : theme === 'dark' ? 'Sombre' : 'Système'}
                </Text>
              </View>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}>
                <Text style={{
                  fontSize: 9,
                  color: colors.textMuted,
                }}>
                  Actif
                </Text>
              </View>
            </View>
          </View>

          {/* Options de thème */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
          }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 12,
            }}>
              Choisissez votre thème
            </Text>

            {themeOptions.map((option, index) => {
              const isSelected = theme === option.id;
              const isActive = effectiveTheme === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.7}
                  onPress={() => handleThemeChange(option.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 4,
                    borderBottomWidth: index < themeOptions.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                    backgroundColor: isSelected ? colors.primaryBg : 'transparent',
                    borderRadius: isSelected ? 10 : 0,
                    marginHorizontal: isSelected ? -4 : 0,
                    // ✅ Correction : une seule propriété paddingHorizontal
                    paddingLeft: isSelected ? 8 : 4,
                    paddingRight: isSelected ? 8 : 4,
                  }}
                >
                  {/* Icône */}
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: isSelected ? colors.primary + '20' : colors.surfaceElevated,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Feather 
                      name={option.icon} 
                      size={20} 
                      color={isSelected ? colors.primary : colors.textMuted} 
                    />
                  </View>

                  {/* Infos */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{
                        fontSize: 15,
                        fontWeight: isSelected ? '700' : '600',
                        color: isSelected ? colors.primary : colors.text,
                      }}>
                        {option.label}
                      </Text>
                      {isActive && isSelected && (
                        <View style={{
                          backgroundColor: colors.success + '15',
                          borderRadius: 4,
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                        }}>
                          <Text style={{
                            fontSize: 8,
                            fontWeight: '700',
                            color: colors.success,
                            textTransform: 'uppercase',
                            letterSpacing: 0.3,
                          }}>
                            Actif
                          </Text>
                        </View>
                      )}
                      {isSelected && !isActive && (
                        <View style={{
                          backgroundColor: colors.warning + '15',
                          borderRadius: 4,
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                        }}>
                          <Text style={{
                            fontSize: 8,
                            fontWeight: '700',
                            color: colors.warning,
                            textTransform: 'uppercase',
                            letterSpacing: 0.3,
                          }}>
                            Sélectionné
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      marginTop: 1,
                    }}>
                      {option.description}
                    </Text>
                  </View>

                  {/* Indicateur de sélection */}
                  {isSelected ? (
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Feather name="check" size={14} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: colors.border,
                    }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Informations */}
          <View style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="info" size={16} color={colors.info} />
              <Text style={{
                fontSize: 12,
                color: colors.textMuted,
                flex: 1,
              }}>
                Le thème système s'adapte automatiquement aux préférences de votre appareil.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};