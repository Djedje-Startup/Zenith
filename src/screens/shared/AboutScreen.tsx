// screens/shared/AboutScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface LinkItem {
  title: string;
  url: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const AboutScreen: React.FC = () => {
  const { colors } = useTheme();

  // ─── Références pour les animations ───
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const linksTranslateX = useRef(new Animated.Value(-20)).current;
  const linksOpacity = useRef(new Animated.Value(0)).current;
  const creditsOpacity = useRef(new Animated.Value(0)).current;

  // ─── Animations ───
  useEffect(() => {
    // Animation du logo
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        damping: 20,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de la description
    Animated.timing(descriptionOpacity, {
      toValue: 1,
      duration: 300,
      delay: 150,
      useNativeDriver: true,
    }).start();

    // Animation des liens
    Animated.parallel([
      Animated.spring(linksTranslateX, {
        toValue: 0,
        damping: 20,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(linksOpacity, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation des crédits
    Animated.timing(creditsOpacity, {
      toValue: 1,
      duration: 300,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // ─── Liens vers le site web Surya (uniquement Site web et Nous contacter) ───
  const links: LinkItem[] = [
    { title: 'Site web Surya', url: 'https://surya-education.com', icon: 'globe', color: colors.primary },
    { title: 'Nous contacter', url: 'https://surya-education.com/contact', icon: 'message-circle', color: colors.info },
  ];

  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then(() => Linking.openURL(url));
  };

  // ─── RENDU ───
  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

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
          <View>
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.6)',
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
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 10,
            alignItems: 'center',
          }}>
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
          </View>
        </View>
      </LinearGradient>

      {/* ─── LOGO ET INFOS ──────────────────────────────────────────────── */}
      <Animated.View
        style={{
          alignItems: 'center',
          marginTop: 24,
          transform: [{ scale: logoScale }],
          opacity: logoOpacity,
        }}
      >
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          backgroundColor: colors.primaryBg,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: colors.border,
        }}>
          <Image
            source={require('../../../assets/zenith.png')}
            style={{ width: 48, height: 48 }}
            resizeMode="contain"
          />
        </View>
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: colors.text,
          marginTop: 16,
        }}>
          ZENITH
        </Text>
        <Text style={{
          fontSize: 14,
          color: colors.textMuted,
        }}>
          par SURYA
        </Text>
        <Text style={{
          fontSize: 11,
          color: colors.textMuted,
          marginTop: 4,
          fontStyle: 'italic',
        }}>
          We shine, you glow.
        </Text>
      </Animated.View>

      {/* ─── DESCRIPTION ──────────────────────────────────────────────────── */}
      <Animated.View
        style={{
          paddingHorizontal: 20,
          marginTop: 24,
          opacity: descriptionOpacity,
        }}
      >
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 20,
        }}>
          <Text style={{
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 24,
            textAlign: 'center',
          }}>
            ZENITH est l'application mobile de SURYA,
            la solution complète de gestion pour établissements d'enseignement.
          </Text>
          <Text style={{
            fontSize: 13,
            color: colors.textMuted,
            lineHeight: 22,
            textAlign: 'center',
            marginTop: 8,
          }}>
            Développée à Pointe-Noire, République du Congo 🇨🇬
          </Text>
        </View>
      </Animated.View>

      {/* ─── LIENS UTILES ────────────────────────────────────────────────── */}
      <Animated.View
        style={{
          paddingHorizontal: 20,
          marginTop: 24,
          transform: [{ translateX: linksTranslateX }],
          opacity: linksOpacity,
        }}
      >
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: colors.textSecondary,
          marginBottom: 12,
        }}>
          Liens utiles
        </Text>
        
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        }}>
          {links.map((link, index) => (
            <TouchableOpacity
              key={link.title}
              activeOpacity={0.7}
              onPress={() => handleLinkPress(link.url)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderBottomWidth: index < links.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
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
                  color: colors.text,
                }}>
                  {link.title}
                </Text>
              </View>
              <Feather name="external-link" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* ─── CRÉDITS ──────────────────────────────────────────────────────── */}
      <Animated.View
        style={{
          paddingHorizontal: 20,
          marginTop: 24,
          marginBottom: 40,
          opacity: creditsOpacity,
        }}
      >
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 20,
          alignItems: 'center',
        }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 13,
            color: colors.textMuted,
          }}>
            © 2026 SURYA. Tous droits réservés.
          </Text>
          <Text style={{
            textAlign: 'center',
            fontSize: 12,
            color: colors.textMuted,
            marginTop: 4,
          }}>
            Conçu et développé à Pointe-Noire 🇨🇬
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleLinkPress('https://surya-education.com')}
            style={{
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Feather name="globe" size={14} color={colors.primary} />
            <Text style={{
              fontSize: 12,
              color: colors.primary,
              fontWeight: '600',
            }}>
              surya-education.com
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};