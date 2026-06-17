// screens/shared/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';

export const SettingsScreen: React.FC = () => {
  const { isDark, setTheme, effectiveTheme } = useTheme(); // ✅ Utiliser effectiveTheme au lieu de theme
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const themeOptions = [
    { value: 'light', label: 'Clair', icon: 'sun' },
    { value: 'dark', label: 'Sombre', icon: 'moon' },
    { value: 'system', label: 'Système', icon: 'smartphone' },
  ];

  // Couleurs dynamiques
  const bgColor = isDark ? '#0E1117' : '#F9FAFB';
  const textColor = isDark ? '#E8EAF0' : '#1A1A2E';
  const textSecondary = isDark ? '#CDD0E0' : '#4A5568';
  const textMuted = isDark ? '#4A5060' : '#9CA3AF';
  const borderColor = isDark ? '#1C2030' : '#E5E7EB';
  const surfaceColor = isDark ? '#12151E' : '#FFFFFF';
  const accentColor = '#6366F1';

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: bgColor }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ─── Header Premium ──────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4F46E5']}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}>
              Paramètres
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              Paramètres
            </Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.7}
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 12,
              padding: 10,
            }}
          >
            <Feather name="rotate-ccw" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: 18, marginTop: 20 }}>

        {/* ─── Apparence ────────────────────────────────────────────────────── */}
        <Text style={{
          fontSize: 11,
          fontWeight: '700',
          color: textMuted,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginBottom: 12,
        }}>
          Apparence
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Card variant="elevated">
            <View style={{ padding: 16 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: textColor,
                marginBottom: 12,
              }}>
                Thème
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {themeOptions.map((option) => {
                  // ✅ Utiliser effectiveTheme pour comparer
                  const isActive = effectiveTheme === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.7}
                      onPress={() => setTheme(option.value as any)}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: isActive ? accentColor : borderColor,
                        backgroundColor: isActive 
                          ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.06)')
                          : 'transparent',
                      }}
                    >
                      <Feather
                        name={option.icon as any}
                        size={22}
                        color={isActive ? accentColor : textMuted}
                      />
                      <Text
                        style={{
                          fontSize: 13,
                          marginTop: 6,
                          fontWeight: isActive ? '600' : '400',
                          color: isActive ? accentColor : textMuted,
                        }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Card>
        </View>

        {/* ─── Notifications ────────────────────────────────────────────────── */}
        <Text style={{
          fontSize: 11,
          fontWeight: '700',
          color: textMuted,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginBottom: 12,
        }}>
          Notifications
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Card variant="elevated">
            <View style={{ padding: 16 }}>
              {/* Notifications push */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
              }}>
                <View>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: textColor,
                  }}>
                    Notifications push
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: textMuted,
                    marginTop: 2,
                  }}>
                    Recevoir les alertes sur votre téléphone
                  </Text>
                </View>
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ false: '#D1D5DB', true: accentColor }}
                  thumbColor={pushEnabled ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>

              {/* Séparateur */}
              <View style={{
                height: 1,
                backgroundColor: borderColor,
                marginVertical: 12,
              }} />

              {/* Notifications email */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
              }}>
                <View>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: textColor,
                  }}>
                    Notifications email
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: textMuted,
                    marginTop: 2,
                  }}>
                    Recevoir les alertes par email
                  </Text>
                </View>
                <Switch
                  value={emailEnabled}
                  onValueChange={setEmailEnabled}
                  trackColor={{ false: '#D1D5DB', true: accentColor }}
                  thumbColor={emailEnabled ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
            </View>
          </Card>
        </View>

        {/* ─── Stockage ──────────────────────────────────────────────────────── */}
        <Text style={{
          fontSize: 11,
          fontWeight: '700',
          color: textMuted,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginBottom: 12,
        }}>
          Stockage
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Card variant="elevated">
            <View style={{ padding: 16 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 8,
                }}
              >
                <View>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: textColor,
                  }}>
                    Vider le cache
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: textMuted,
                    marginTop: 2,
                  }}>
                    Libérer de l'espace de stockage
                  </Text>
                </View>
                <Feather name="trash-2" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* ─── Version ───────────────────────────────────────────────────────── */}
        <Text style={{
          textAlign: 'center',
          fontSize: 12,
          color: textMuted,
          marginTop: 32,
          marginBottom: 40,
        }}>
          Version 1.0.0
        </Text>

      </View>
    </ScrollView>
  );
};