// screens/shared/PersonalInfoScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

// ──────────────────────────────────────────────────────────────
// COMPOSANT INPUT PERSONNALISÉ
// ──────────────────────────────────────────────────────────────
interface InfoInputProps {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  editable?: boolean;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  required?: boolean;
}

const InfoInput: React.FC<InfoInputProps> = ({
  label,
  value,
  icon,
  editable = true,
  onChangeText,
  keyboardType = 'default',
  required = false,
}) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontSize: 11,
        fontWeight: '600',
        color: focused ? colors.primary : colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.1,
        marginBottom: 6,
      }}>
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: focused ? colors.primaryBg : colors.surfaceElevated,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: focused ? colors.primary : colors.border,
        paddingHorizontal: 14,
        height: 50,
        opacity: editable ? 1 : 0.6,
      }}>
        <Feather 
          name={icon} 
          size={18} 
          color={focused ? colors.primary : colors.textMuted} 
          style={{ marginRight: 10 }} 
        />
        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            color: colors.text,
            paddingVertical: 0,
          }}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {!editable && (
          <Feather name="lock" size={14} color={colors.textMuted} />
        )}
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const PersonalInfoScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ États pour les champs - Utilisation des propriétés disponibles
  const [nom, setNom] = useState(user?.nom || '');
  const [prenoms, setPrenoms] = useState(user?.prenoms || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telephone, setTelephone] = useState(''); // Champ local
  const [adresse, setAdresse] = useState(''); // Champ local

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

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    if (!nom.trim() || !prenoms.trim() || !email.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      Alert.alert('Succès', 'Vos informations ont été mises à jour');
    }, 1500);
  };

  const handleCancel = () => {
    // Réinitialiser les valeurs
    setNom(user?.nom || '');
    setPrenoms(user?.prenoms || '');
    setEmail(user?.email || '');
    setTelephone('');
    setAdresse('');
    setIsEditing(false);
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
                  Profil
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginTop: 2,
                  letterSpacing: -0.5,
                }}>
                  Informations personnelles
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsEditing(!isEditing)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Feather name={isEditing ? 'x' : 'edit-2'} size={16} color="#FFFFFF" />
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                {isEditing ? 'Annuler' : 'Modifier'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ─── FORMULAIRE ─── */}
        <Animated.View
          style={{
            paddingHorizontal: 20,
            paddingTop: 24,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
          }}>
            {/* Avatar */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primaryBg,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: colors.primary + '30',
              }}>
                <Text style={{
                  fontSize: 32,
                  fontWeight: '700',
                  color: colors.primary,
                }}>
                  {prenoms.charAt(0)}{nom.charAt(0)}
                </Text>
              </View>
              {isEditing && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    marginTop: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Feather name="camera" size={14} color={colors.primary} />
                  <Text style={{
                    fontSize: 12,
                    color: colors.primary,
                    fontWeight: '600',
                  }}>
                    Changer la photo
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Champs */}
            <InfoInput
              label="Nom"
              value={nom}
              icon="user"
              editable={isEditing}
              onChangeText={setNom}
              required
            />

            <InfoInput
              label="Prénoms"
              value={prenoms}
              icon="user"
              editable={isEditing}
              onChangeText={setPrenoms}
              required
            />

            <InfoInput
              label="Email"
              value={email}
              icon="mail"
              editable={isEditing}
              onChangeText={setEmail}
              keyboardType="email-address"
              required
            />

            <InfoInput
              label="Téléphone"
              value={telephone}
              icon="phone"
              editable={isEditing}
              onChangeText={setTelephone}
              keyboardType="phone-pad"
            />

            <InfoInput
              label="Adresse"
              value={adresse}
              icon="map-pin"
              editable={isEditing}
              onChangeText={setAdresse}
            />

            {/* Boutons d'action */}
            {isEditing && (
              <View style={{
                flexDirection: 'row',
                gap: 10,
                marginTop: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCancel}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.textMuted,
                  }}>
                    Annuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSave}
                  disabled={isSaving}
                  style={{
                    flex: 2,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: isSaving ? colors.textMuted : colors.primary,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}>
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Informations de sécurité */}
            {!isEditing && (
              <View style={{
                marginTop: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Feather name="shield" size={16} color={colors.success} />
                  <Text style={{
                    fontSize: 12,
                    color: colors.textMuted,
                  }}>
                    Vos informations sont sécurisées
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};