// screens/shared/SecurityScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

// ──────────────────────────────────────────────────────────────
// COMPOSANT ITEM DE SÉCURITÉ
// ──────────────────────────────────────────────────────────────
interface SecurityItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  onPress?: () => void;
  isSwitch?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  color?: string;
  showArrow?: boolean;
}

const SecurityItem: React.FC<SecurityItemProps> = ({
  icon,
  title,
  description,
  onPress,
  isSwitch = false,
  value = false,
  onValueChange,
  color,
  showArrow = true,
}) => {
  const { colors } = useTheme();
  const itemColor = color || colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isSwitch}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: itemColor + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}>
        <Feather name={icon} size={18} color={itemColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
        }}>
          {title}
        </Text>
        <Text style={{
          fontSize: 12,
          color: colors.textMuted,
          marginTop: 1,
        }}>
          {description}
        </Text>
      </View>

      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
          ios_backgroundColor={colors.border}
        />
      ) : showArrow && (
        <Feather name="chevron-right" size={18} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
};

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const SecurityScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();

  // États des switches
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  // ─── Fonctions ───
  const handleChangePassword = () => {
    Alert.alert(
      'Changer le mot de passe',
      'Voulez-vous modifier votre mot de passe ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => Alert.alert('Info', 'Page de changement de mot de passe en développement') },
      ]
    );
  };

  const handleChangeEmail = () => {
    Alert.alert(
      'Changer l\'email',
      'Voulez-vous modifier votre adresse email ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => Alert.alert('Info', 'Page de changement d\'email en développement') },
      ]
    );
  };

  const handleSessions = () => {
    Alert.alert('Sessions actives', 'Liste des sessions actives en développement');
  };

  const handleDataExport = () => {
    Alert.alert(
      'Exporter mes données',
      'Voulez-vous exporter toutes vos données ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Exporter', onPress: () => Alert.alert('Info', 'Téléchargement en cours...') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => Alert.alert('Info', 'Compte supprimé (simulation)') },
      ]
    );
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
                onPress={() => {}}
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
                  Sécurité
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginTop: 2,
                  letterSpacing: -0.5,
                }}>
                  Sécurité & confidentialité
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
              <Feather name="shield" size={20} color="#FFFFFF" />
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
          {/* Compte et accès */}
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
              Compte et accès
            </Text>

            <SecurityItem
              icon="lock"
              title="Changer le mot de passe"
              description="Modifier votre mot de passe"
              onPress={handleChangePassword}
              color={colors.primary}
            />

            <SecurityItem
              icon="mail"
              title="Changer l'email"
              description="Modifier votre adresse email"
              onPress={handleChangeEmail}
              color={colors.info}
            />

            <SecurityItem
              icon="smartphone"
              title="Authentification biométrique"
              description="Utiliser votre empreinte digitale"
              isSwitch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              color={colors.secondary}
              showArrow={false}
            />

            <SecurityItem
              icon="shield"
              title="Authentification à deux facteurs"
              description="Sécuriser votre compte avec 2FA"
              isSwitch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              color={colors.success}
              showArrow={false}
            />
          </View>

          {/* Confidentialité */}
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
              Confidentialité
            </Text>

            <SecurityItem
              icon="bell"
              title="Notifications"
              description="Recevoir des alertes de sécurité"
              isSwitch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color={colors.warning}
              showArrow={false}
            />

            <SecurityItem
              icon="monitor"
              title="Sessions actives"
              description="Gérer vos appareils connectés"
              onPress={handleSessions}
              color={colors.info}
            />

            <SecurityItem
              icon="download"
              title="Exporter mes données"
              description="Télécharger toutes vos données"
              onPress={handleDataExport}
              color={colors.secondary}
            />
          </View>

          {/* Danger */}
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
              color: colors.error,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 8,
            }}>
              Zone dangereuse
            </Text>

            <SecurityItem
              icon="trash-2"
              title="Supprimer le compte"
              description="Supprimer définitivement votre compte"
              onPress={handleDeleteAccount}
              color={colors.error}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};