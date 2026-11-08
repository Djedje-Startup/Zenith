// screens/auth/SelectSchoolScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useTheme } from '../../theme'; // ✅ Thème centralisé

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface School {
  id: string;
  nom: string;
  logo?: string;
  ville: string;
  statut: 'ACTIF' | 'INACTIF';
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_SCHOOLS: School[] = [
  { id: '1', nom: 'Lycée Moderne de Brazzaville', ville: 'Brazzaville', statut: 'ACTIF' },
  { id: '2', nom: 'Collège Saint Joseph', ville: 'Pointe-Noire', statut: 'ACTIF' },
  { id: '3', nom: 'École Internationale de Brazzaville', ville: 'Brazzaville', statut: 'INACTIF' },
];

// ──────────────────────────────────────────────────────────────
// SCREEN PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const SelectSchoolScreen: React.FC = () => {
  const { colors } = useTheme();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  // Animations
  const buttonTranslateY = useRef(new Animated.Value(100)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedSchoolId) {
      Animated.parallel([
        Animated.spring(buttonTranslateY, {
          toValue: 0,
          damping: 25,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(buttonTranslateY, {
          toValue: 100,
          damping: 25,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedSchoolId]);

  const handleSelectSchool = async () => {
    if (!selectedSchoolId) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    navigation.navigate('Main');
  };

  // Animations pour les cartes
  const cardAnimations = MOCK_SCHOOLS.map(() => ({
    translateX: useRef(new Animated.Value(-20)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    cardAnimations.forEach((anim, index) => {
      Animated.parallel([
        Animated.spring(anim.translateX, {
          toValue: 0,
          damping: 20,
          delay: index * 80,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 300,
          delay: index * 80,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  // ─── Rendu d'une carte d'école ───
  const renderSchoolCard = ({ item, index }: { item: School; index: number }) => {
    const isSelected = selectedSchoolId === item.id;
    const isInactive = item.statut === 'INACTIF';
    const anim = cardAnimations[index] || cardAnimations[0];

    // Initiales de l'école
    const getInitials = (name: string) => {
      const words = name.split(' ');
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    return (
      <Animated.View
        style={{
          marginBottom: 12,
          transform: [{ translateX: anim.translateX }],
          opacity: anim.opacity,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => !isInactive && setSelectedSchoolId(item.id)}
          disabled={isInactive}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 18,
            borderWidth: 2,
            backgroundColor: isSelected ? colors.primaryBg : colors.surface,
            borderColor: isSelected ? colors.primary : isInactive ? colors.border : colors.border,
            opacity: isInactive ? 0.5 : 1,
          }}
        >
          {/* Logo */}
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={{ width: 48, height: 48, borderRadius: 24 }} />
          ) : (
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
                {getInitials(item.nom)}
              </Text>
            </LinearGradient>
          )}

          {/* Infos */}
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{
              fontSize: 15,
              fontWeight: '600',
              color: isInactive ? colors.textMuted : colors.text,
            }}>
              {item.nom}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Feather name="map-pin" size={12} color={colors.textMuted} />
              <Text style={{
                fontSize: 12,
                color: colors.textMuted,
                marginLeft: 4,
              }}>
                {item.ville}
              </Text>
              {isInactive && (
                <>
                  <View style={{
                    width: 3,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: colors.textMuted,
                    marginHorizontal: 6,
                  }} />
                  <Text style={{
                    fontSize: 10,
                    color: colors.textMuted,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 0.3,
                  }}>
                    Indisponible
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Indicateur de sélection */}
          {isSelected ? (
            <View style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Feather name="check" size={16} color="#FFFFFF" />
            </View>
          ) : (
            !isInactive && (
              <View style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: colors.border,
              }} />
            )
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Connexion en cours..." />;
  }

  // ─── RENDU ───
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
              Sélection
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              Votre établissement
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
              Disponibles
            </Text>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              {MOCK_SCHOOLS.filter(s => s.statut === 'ACTIF').length}
            </Text>
          </View>
        </View>

        {/* Message de bienvenue */}
        <Text style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.7)',
          marginTop: 12,
        }}>
          Bonjour {user?.prenoms || 'Utilisateur'} {user?.nom || ''}
        </Text>
      </LinearGradient>

      {/* ─── LISTE DES ÉCOLES ─── */}
      <FlatList
        data={MOCK_SCHOOLS}
        keyExtractor={(item) => item.id}
        renderItem={renderSchoolCard}
        contentContainerStyle={{ padding: 18, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={{
            fontSize: 11,
            fontWeight: '700',
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: 14,
          }}>
            Choisissez un établissement
          </Text>
        }
      />

      {/* ─── BOUTON DE VALIDATION ─── */}
      {selectedSchoolId && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 18,
            paddingTop: 14,
            paddingBottom: 28,
            backgroundColor: 'transparent',
            transform: [{ translateY: buttonTranslateY }],
            opacity: buttonOpacity,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSelectSchool}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              height: 56,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#FFFFFF',
              marginLeft: 10,
              letterSpacing: 0.3,
            }}>
              Continuer
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};