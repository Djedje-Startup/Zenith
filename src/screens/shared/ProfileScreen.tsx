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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';

interface MenuItem {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
}

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, colors } = useTheme();

  // ✅ Déclarer menuItems AVANT de l'utiliser
  const menuItems: MenuItem[] = [
    { icon: 'user', label: 'Informations personnelles', onPress: () => {}, color: '#60A5FA' },
    { icon: 'bell', label: 'Notifications', onPress: () => {}, color: '#FBBF24' },
    { icon: 'shield', label: 'Sécurité', onPress: () => {}, color: '#34D399' },
    { icon: 'help-circle', label: 'Aide et support', onPress: () => {}, color: '#A78BFA' },
    { icon: 'info', label: 'À propos', onPress: () => {}, color: '#6B7280' },
  ];

  // ✅ Maintenant menuItems est disponible
  // Animation pour l'avatar et les infos
  const avatarScale = useRef(new Animated.Value(0.9)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;

  // Animations pour les éléments du menu
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

  // Couleurs dynamiques
  const bgColor = isDark ? '#0E1117' : '#F9FAFB';
  const textColor = isDark ? '#E8EAF0' : '#1A1A2E';
  const textSecondary = isDark ? '#CDD0E0' : '#4A5568';
  const textMuted = isDark ? '#4A5060' : '#9CA3AF';
  const borderColor = isDark ? '#1C2030' : '#E5E7EB';
  const surfaceColor = isDark ? '#12151E' : '#FFFFFF';

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
          paddingBottom: 28,
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
              Profil
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              Mon compte
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
            <Feather name="edit-2" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ─── Avatar et infos ────────────────────────────────────────────────── */}
      <Animated.View
        style={{
          alignItems: 'center',
          marginTop: -24,
          paddingHorizontal: 22,
          transform: [{ scale: avatarScale }],
          opacity: avatarOpacity,
        }}
      >
        <View style={{
          backgroundColor: surfaceColor,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: borderColor,
          padding: 20,
          width: '100%',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <Avatar
            source={user?.photo}
            name={`${user?.nom} ${user?.prenoms}`}
            size="xl"
            variant="circle"
            ring
            ringColor="#6366F1"
          />
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: textColor,
            marginTop: 12,
          }}>
            {user?.prenoms} {user?.nom}
          </Text>
          <View style={{
            backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 4,
            marginTop: 4,
          }}>
            <Text style={{
              fontSize: 12,
              color: '#818CF8',
              fontWeight: '500',
            }}>
              {user?.role === 'PARENT' ? 'Parent d\'élève' :
               user?.role === 'ELEVE' ? 'Élève' :
               user?.role === 'PROFESSEUR' ? 'Enseignant' : 'Utilisateur'}
            </Text>
          </View>
          
          {/* Email */}
          {user?.email && (
            <Text style={{
              fontSize: 13,
              color: textMuted,
              marginTop: 8,
            }}>
              {user.email}
            </Text>
          )}
        </View>
      </Animated.View>

      {/* ─── Menu ───────────────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 18, marginTop: 20 }}>
        <Text style={{
          fontSize: 11,
          fontWeight: '700',
          color: textMuted,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          marginBottom: 12,
        }}>
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
                  borderBottomColor: borderColor,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
                  <Text style={{
                    fontSize: 15,
                    color: textColor,
                    fontWeight: '500',
                  }}>
                    {item.label}
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color={textMuted} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* ─── Version et déconnexion ────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 18, marginTop: 24, marginBottom: 40 }}>
        <Text style={{
          textAlign: 'center',
          fontSize: 12,
          color: textMuted,
          marginBottom: 20,
        }}>
          Version 1.0.0
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