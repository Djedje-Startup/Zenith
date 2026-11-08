// src/components/shared/AnnouncementsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface Announcement {
  id: string;
  titre: string;
  date: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  urgent: boolean;
  source?: string;
  image?: string;
}

interface AnnouncementsScreenProps {
  announcements?: Announcement[];
  userRole: 'student' | 'parent' | 'teacher';
  onBack?: () => void;
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { 
    id: '1', 
    titre: 'Réunion parents-professeurs', 
    date: '25 oct. 2025', 
    description: 'Réunion trimestrielle en salle polyvalente', 
    type: 'info', 
    urgent: false,
    source: 'Administration'
  },
  { 
    id: '2', 
    titre: 'Examens de mi-trimestre', 
    date: '3 nov. 2025', 
    description: 'Planification des examens pour tous les niveaux', 
    type: 'warning', 
    urgent: true,
    source: 'Direction'
  },
  { 
    id: '3', 
    titre: 'Journée sportive', 
    date: '10 nov. 2025', 
    description: 'Tournoi interclasses avec remise de prix', 
    type: 'success', 
    urgent: false,
    source: 'BDE'
  },
  { 
    id: '4', 
    titre: 'Fermeture exceptionnelle', 
    date: '15 nov. 2025', 
    description: 'L\'établissement sera fermé pour maintenance', 
    type: 'urgent', 
    urgent: true,
    source: 'Administration'
  },
];

// ─── COMPOSANT CARTE D'ANNONCE ──────────────────────────────────────────
const AnnouncementItem = ({ item, index, colors }: { item: Announcement; index: number; colors: any }) => {
  const translateX = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        damping: 25,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTypeConfig = (type: Announcement['type']) => {
    const configs: Record<Announcement['type'], { icon: keyof typeof Feather.glyphMap; bg: string }> = {
      info: { icon: 'info', bg: colors.primary + '12' },
      warning: { icon: 'alert-triangle', bg: colors.warning + '12' },
      success: { icon: 'check-circle', bg: colors.success + '12' },
      urgent: { icon: 'alert-circle', bg: colors.error + '12' },
    };
    return configs[type] || configs.info;
  };

  const config = getTypeConfig(item.type);

  return (
    <Animated.View
      style={{
        opacity: opacity,
        transform: [{ translateX: translateX }],
        marginBottom: 10,
      }}
    >
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
      }}>
        {/* En-tête */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: config.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Feather name={config.icon} size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.text,
              }}>
                {item.titre}
              </Text>
              {item.urgent && (
                <View style={{
                  backgroundColor: colors.error + '12',
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                }}>
                  <Text style={{
                    fontSize: 8,
                    fontWeight: '700',
                    color: colors.error,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    Urgent
                  </Text>
                </View>
              )}
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 2,
            }}>
              <Feather name="calendar" size={10} color={colors.textMuted} />
              <Text style={{ fontSize: 11, color: colors.textMuted }}>
                {item.date}
              </Text>
              {item.source && (
                <>
                  <View style={{
                    width: 2,
                    height: 2,
                    borderRadius: 1,
                    backgroundColor: colors.textMuted,
                  }} />
                  <Feather name="user" size={10} color={colors.textMuted} />
                  <Text style={{ fontSize: 11, color: colors.textMuted }}>
                    {item.source}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={{
          fontSize: 13,
          color: colors.textSecondary,
          marginTop: 10,
          lineHeight: 20,
          paddingLeft: 48,
        }}>
          {item.description}
        </Text>

        {/* Séparateur et bouton lire plus */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{
              fontSize: 11,
              fontWeight: '500',
              color: colors.primary,
            }}>
              Lire plus
            </Text>
            <Feather name="chevron-right" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────
export const AnnouncementsScreen: React.FC<AnnouncementsScreenProps> = ({ 
  announcements = MOCK_ANNOUNCEMENTS,
  userRole,
  onBack 
}) => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'student': return 'Élève';
      case 'parent': return 'Parent';
      case 'teacher': return 'Professeur';
      default: return '';
    }
  };

  return (
    <Layout variant="default">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* ─── BANNIÈRE ZENITH ─── */}
        <LinearGradient
          colors={['#F97316', '#8B5CF6']}
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
              {onBack && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onBack}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="arrow-left" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              <View>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}>
                  {getRoleLabel()}
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginTop: 2,
                  letterSpacing: -0.5,
                }}>
                  Annonces
                </Text>
              </View>
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 8,
              alignItems: 'center',
              flexDirection: 'row',
              gap: 6,
            }}>
              <Feather name="bell" size={16} color="#FFFFFF" />
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {announcements.filter(a => a.urgent).length}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ─── LISTE DES ANNONCES ─── */}
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}
          renderItem={({ item, index }) => (
            <AnnouncementItem item={item} index={index} colors={colors} />
          )}
          ListEmptyComponent={
            <View style={{
              padding: 40,
              alignItems: 'center',
              marginTop: 20,
            }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: colors.primary + '12',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Feather name="bell" size={28} color={colors.primary} />
              </View>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
              }}>
                Aucune annonce
              </Text>
              <Text style={{
                fontSize: 13,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Aucune annonce n'est disponible pour le moment
              </Text>
            </View>
          }
        />
      </View>
    </Layout>
  );
};