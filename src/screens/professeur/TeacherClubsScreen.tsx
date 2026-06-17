// screens/professeur/TeacherClubsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  borderSub: '#141720',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.10)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.09)',
  teal: '#2DD4BF',
  tealBg: 'rgba(45,212,191,0.09)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
  white: '#FFFFFF',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Club {
  id: string;
  nom: string;
  description: string;
  couleur: string;
  role: 'RESPONSABLE' | 'ENCADRANT' | 'MEMBRE';
  nbMembres: number;
  prochainEvent?: string;
  activites?: string[];
}

// ─── Données Mock ────────────────────────────────────────────────────────────
const MOCK_CLUBS: Club[] = [
  {
    id: '1',
    nom: 'Club Informatique',
    description: 'Découverte du code, de la robotique et des nouvelles technologies',
    couleur: '#4F46E5',
    role: 'RESPONSABLE',
    nbMembres: 45,
    prochainEvent: 'Hackathon Junior - 25 Oct 2025',
    activites: ['Python', 'Robotique', 'IA'],
  },
  {
    id: '2',
    nom: 'Club Culturel',
    description: 'Théâtre, danse, musique et arts plastiques',
    couleur: '#7C3AED',
    role: 'ENCADRANT',
    nbMembres: 32,
    prochainEvent: 'Soirée culturelle - 08 Déc 2025',
    activites: ['Théâtre', 'Danse', 'Musique'],
  },
  {
    id: '3',
    nom: 'Club Sportif',
    description: 'Basketball, football et athlétisme',
    couleur: '#059669',
    role: 'ENCADRANT',
    nbMembres: 28,
    prochainEvent: 'Tournoi inter-classe - 15 Nov 2025',
    activites: ['Basket', 'Football', 'Athlétisme'],
  },
];

const getRoleConfig = (role: string) => {
  switch (role) {
    case 'RESPONSABLE':
      return { label: 'Responsable', color: C.amber, icon: 'award' };
    case 'ENCADRANT':
      return { label: 'Encadrant', color: C.teal, icon: 'users' };
    default:
      return { label: 'Membre', color: C.textMuted, icon: 'user' };
  }
};

// ─── Composant principal ──────────────────────────────────────────────────────
export const TeacherClubsScreen: React.FC = () => {
  const [clubs, setClubs] = useState(MOCK_CLUBS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderClubCard = ({ item, index }: { item: Club; index: number }) => {
    const roleConfig = getRoleConfig(item.role);
    const isResponsable = item.role === 'RESPONSABLE';

    return (
      <View
        style={{
          backgroundColor: C.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: C.border,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        {/* ─── Header de la carte ────────────────────────────────────────────── */}
        <LinearGradient
          colors={[item.couleur, `${item.couleur}BB`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 18,
            paddingVertical: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Feather 
                name={isResponsable ? 'star' : 'activity'} 
                size={22} 
                color="#FFFFFF" 
              />
            </View>
            <View>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: -0.3,
              }}>
                {item.nom}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <Feather name={roleConfig.icon as any} size={12} color="rgba(255,255,255,0.7)" />
                <Text style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  {roleConfig.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Badge nombre de membres */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}>
            <Feather name="users" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={{
              fontSize: 13,
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              {item.nbMembres}
            </Text>
          </View>
        </LinearGradient>

        {/* ─── Contenu ────────────────────────────────────────────────────────── */}
        <View style={{ padding: 16 }}>
          {/* Description */}
          <Text style={{
            fontSize: 13,
            color: C.textSecondary,
            lineHeight: 20,
            marginBottom: 14,
          }}>
            {item.description}
          </Text>

          {/* Activités */}
          {item.activites && item.activites.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              <Text style={{
                fontSize: 10,
                fontWeight: '700',
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginBottom: 8,
              }}>
                Activités
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {item.activites.map((activite, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: C.accentBg,
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderWidth: 1,
                      borderColor: `${C.accent}25`,
                    }}
                  >
                    <Text style={{
                      fontSize: 10,
                      color: C.accentDim,
                      fontWeight: '600',
                      letterSpacing: 0.3,
                    }}>
                      {activite}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Prochain événement */}
          {item.prochainEvent && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: C.amberBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Feather name="calendar" size={16} color={C.amber} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 10,
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  Prochain événement
                </Text>
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: C.textSecondary,
                }}>
                  {item.prochainEvent}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor: C.accentBg,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <Text style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: C.accentDim,
                }}>
                  Détails
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ─── Footer avec actions ────────────────────────────────────────────── */}
        <View style={{
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: C.border,
          backgroundColor: C.surfaceAlt,
        }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 12,
            }}
          >
            <Feather name="edit-2" size={16} color={C.textMuted} />
            <Text style={{
              fontSize: 12,
              color: C.textMuted,
              fontWeight: '500',
            }}>
              Gérer
            </Text>
          </TouchableOpacity>
          <View style={{
            width: 1,
            backgroundColor: C.border,
          }} />
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 12,
            }}
          >
            <Feather name="message-circle" size={16} color={C.textMuted} />
            <Text style={{
              fontSize: 12,
              color: C.textMuted,
              fontWeight: '500',
            }}>
              Discussions
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
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
              Clubs encadrés
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              Vos clubs
            </Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
              <Feather name="grid" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {clubs.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Indicateur de répartition */}
        <View style={{
          flexDirection: 'row',
          gap: 8,
          marginTop: 16,
        }}>
          {[
            { label: 'Responsable', count: clubs.filter(c => c.role === 'RESPONSABLE').length, color: C.amber },
            { label: 'Encadrant', count: clubs.filter(c => c.role === 'ENCADRANT').length, color: C.teal },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: stat.color,
              }} />
              <Text style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
              }}>
                {stat.label}: 
              </Text>
              <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {stat.count}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* ─── Liste des clubs ──────────────────────────────────────────────────── */}
      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        renderItem={renderClubCard}
        contentContainerStyle={{ padding: 18, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        ListHeaderComponent={
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}>
              {clubs.length} club{clubs.length > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{
                fontSize: 12,
                color: C.accentDim,
                fontWeight: '600',
              }}>
                Tout voir
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* ─── Bouton flottant (créer un club) ──────────────────────────────────── */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          bottom: 28,
          right: 22,
          backgroundColor: C.accent,
          width: 56,
          height: 56,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: C.accent,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};