// screens/shared/AboutScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';

interface LinkItem {
  title: string;
  url: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

export const AboutScreen: React.FC = () => {
  const { isDark } = useTheme();

  const links: LinkItem[] = [
    { title: 'Site web', url: 'https://surya-education.com', icon: 'globe', color: '#3B82F6' },
    { title: 'Support technique', url: 'mailto:support@surya-education.com', icon: 'mail', color: '#F5A623' },
    { title: "Conditions d'utilisation", url: 'https://surya-education.com/terms', icon: 'file-text', color: '#6B7280' },
    { title: 'Politique de confidentialité', url: 'https://surya-education.com/privacy', icon: 'shield', color: '#10B981' },
  ];

  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then(() => Linking.openURL(url));
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: isDark ? '#0E1117' : '#F9FAFB' }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
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
              À propos
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              ZENITH
            </Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.7}
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.6)',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
              Version
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              1.0.0
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ─── Logo et infos ───────────────────────────────────────────────────── */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 100 }}
        style={{ alignItems: 'center', marginTop: 24 }}
      >
        <LinearGradient
          colors={['#4F46E5', '#6366F1']}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="star" size={40} color="#FFFFFF" />
        </LinearGradient>
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: isDark ? '#E8EAF0' : '#1A1A2E',
          marginTop: 16,
        }}>
          ZENITH
        </Text>
        <Text style={{
          fontSize: 14,
          color: isDark ? '#4A5060' : '#6B7280',
        }}>
          par SURYA
        </Text>
      </MotiView>

      {/* ─── Description ─────────────────────────────────────────────────────── */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 150 }}
        style={{ paddingHorizontal: 20, marginTop: 24 }}
      >
        <View style={{ padding: 20 }}>
          <Card variant="elevated">
            <Text style={{
              fontSize: 14,
              color: isDark ? '#CDD0E0' : '#4A5568',
              lineHeight: 24,
              textAlign: 'center',
            }}>
              ZENITH est l'application mobile de SURYA,
              la solution complète de gestion pour établissements d'enseignement.
            </Text>
          </Card>
        </View>
      </MotiView>

      {/* ─── Liens ───────────────────────────────────────────────────────────── */}
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: 200 }}
        style={{ paddingHorizontal: 20, marginTop: 24 }}
      >
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: isDark ? '#CDD0E0' : '#4A5568',
          marginBottom: 12,
        }}>
          Liens utiles
        </Text>
        <View style={{ overflow: 'hidden' }}>
          <Card variant="elevated">
            {links.map((link, index) => (
              <TouchableOpacity
                key={link.title}
                onPress={() => handleLinkPress(link.url)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  borderBottomWidth: index < links.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? '#1C2030' : '#E5E7EB',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: link.color + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name={link.icon} size={16} color={link.color} />
                  </View>
                  <Text style={{
                    fontSize: 14,
                    color: isDark ? '#E8EAF0' : '#1A1A2E',
                  }}>
                    {link.title}
                  </Text>
                </View>
                <Feather name="external-link" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      </MotiView>

      {/* ─── Crédits ─────────────────────────────────────────────────────────── */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 250 }}
        style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 40 }}
      >
        <View style={{ padding: 20 }}>
          <Card variant="elevated">
            <Text style={{
              textAlign: 'center',
              fontSize: 13,
              color: isDark ? '#4A5060' : '#6B7280',
            }}>
              © 2026 SURYA. Tous droits réservés.
            </Text>
            <Text style={{
              textAlign: 'center',
              fontSize: 12,
              color: isDark ? '#2E3245' : '#9CA3AF',
              marginTop: 8,
            }}>
              Conçu et développé par SURYA Tech
            </Text>
          </Card>
        </View>
      </MotiView>
    </ScrollView>
  );
};