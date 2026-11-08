// screens/shared/ProfileScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  useColorScheme,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';

// ──────────────────────────────────────────────────────────────
// 🔧 HOOK USETHEME INTÉGRÉ
// ──────────────────────────────────────────────────────────────
const useTheme = () => {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === 'dark';

  const lightColors = {
    primary: '#F97316',
    secondary: '#8B5CF6',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceElevated: '#F4F4F5',
    text: '#18181B',
    textSecondary: '#52525B',
    textMuted: '#A1A1AA',
    border: '#E4E4E7',
    shadow: '#000000',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    primaryBg: '#FFF7ED',
    secondaryBg: '#F5F3FF',
  };

  const darkColors = {
    primary: '#FB923C',
    secondary: '#A78BFA',
    background: '#0F1117',
    surface: '#1A1D26',
    surfaceElevated: '#222633',
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textMuted: '#4A5060',
    border: '#2D3342',
    shadow: '#000000',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    primaryBg: 'rgba(251,146,60,0.12)',
    secondaryBg: 'rgba(167,139,250,0.12)',
  };

  const colors = isDark ? darkColors : lightColors;

  return {
    isDark,
    colors,
  };
};

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface MenuItem {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
}

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  // ─── Fonctions de navigation ───
  const goToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const goToAbout = () => {
    navigation.navigate('About');
  };

  const goToSecurity = () => {
    navigation.navigate('Security');
  };

  const goToPersonalInfo = () => {
    navigation.navigate('PersonalInfo');
  };

  const goToPreferences = () => {
    navigation.navigate('Preferences');
  };

  // ─── Menu items avec navigation ───
  const menuItems: MenuItem[] = [
    {
      icon: 'user',
      label: 'Informations personnelles',
      onPress: goToPersonalInfo,
      color: colors.info,
    },
    {
      icon: 'bell',
      label: 'Notifications',
      onPress: goToNotifications,
      color: colors.warning,
    },
    {
      icon: 'shield',
      label: 'Sécurité',
      onPress: goToSecurity,
      color: colors.success,
    },
    {
      icon: 'settings',
      label: 'Préférences',
      onPress: goToPreferences,
      color: colors.secondary,
    },
    {
      icon: 'info',
      label: 'À propos',
      onPress: goToAbout,
      color: colors.textMuted,
    },
  ];

  // ─── Animations ───
  const avatarScale = useRef(new Animated.Value(0.9)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;

  const menuAnimations = menuItems.map(() => ({
    translateX: useRef(new Animated.Value(-20)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    // Animation de l'avatar
    Animated.parallel([
      Animated.spring(avatarScale, {
        toValue: 1,
        damping: 20,
        useNativeDriver: true,
      }),
      Animated.timing(avatarOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animations du menu (décalées)
    menuAnimations.forEach((anim, index) => {
      Animated.parallel([
        Animated.spring(anim.translateX, {
          toValue: 0,
          damping: 20,
          delay: 150 + index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 300,
          delay: 150 + index * 50,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: logout },
      ]
    );
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
          paddingBottom: 28,
          paddingHorizontal: 22,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              Profil
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}
            >
              Mon compte
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 12,
              padding: 10,
            }}
          >
            <Feather name="edit-2" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ─── AVATAR ET INFOS ─── */}
      <Animated.View
        style={{
          alignItems: 'center',
          marginTop: -24,
          paddingHorizontal: 22,
          transform: [{ scale: avatarScale }],
          opacity: avatarOpacity,
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            width: '100%',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Avatar
            source={user?.photo}
            name={`${user?.nom} ${user?.prenoms}`}
            size="xl"
            variant="circle"
            ring
            ringColor={colors.primary}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.text,
              marginTop: 12,
            }}
          >
            {user?.prenoms} {user?.nom}
          </Text>
          <View
            style={{
              backgroundColor: colors.primaryBg,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 4,
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.primary,
                fontWeight: '500',
              }}
            >
              {user?.role === 'PARENT'
                ? "Parent d'élève"
                : user?.role === 'ELEVE'
                ? 'Élève'
                : user?.role === 'PROFESSEUR'
                ? 'Enseignant'
                : 'Utilisateur'}
            </Text>
          </View>

          {/* Email */}
          {user?.email && (
            <Text
              style={{
                fontSize: 13,
                color: colors.textMuted,
                marginTop: 8,
              }}
            >
              {user.email}
            </Text>
          )}
        </View>
      </Animated.View>

      {/* ─── MENU ─── */}
      <View style={{ paddingHorizontal: 18, marginTop: 20 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: 12,
          }}
        >
          Paramètres
        </Text>

        {menuItems.map((item, index) => {
          const anim = menuAnimations[index];
          return (
            <Animated.View
              key={item.label}
              style={{
                transform: [{ translateX: anim.translateX }],
                opacity: anim.opacity,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={item.onPress}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 14,
                  paddingHorizontal: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: item.color + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.text,
                      fontWeight: '500',
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* ─── VERSION ET DÉCONNEXION ─── */}
      <View style={{ paddingHorizontal: 18, marginTop: 24, marginBottom: 40 }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: colors.textMuted,
            marginBottom: 20,
          }}
        >
          ZENITH · Version 1.0.0
        </Text>
        <View style={{ marginTop: 8 }}>
          <Button
            title="Se déconnecter"
            onPress={handleLogout}
            variant="danger"
            size="md"
          />
        </View>
      </View>
    </ScrollView>
  );
};