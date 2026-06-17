// screens/eleve/StudentClubsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  nbMembres: number;
  isMember?: boolean;
  role?: string;
  prochainEvent?: string;
  activites?: string[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_CLUBS: Club[] = [
  {
    id: '1',
    nom: 'Club Informatique',
    description: 'Découverte du code, de la robotique et des nouvelles technologies',
    couleur: '#4F46E5',
    nbMembres: 45,
    isMember: true,
    role: 'Membre',
    prochainEvent: 'Hackathon Junior - 25 Oct 2025',
    activites: ['Python', 'Robotique', 'IA'],
  },
  {
    id: '2',
    nom: 'Club Sportif',
    description: 'Football, basket, athlétisme et autres activités sportives',
    couleur: '#059669',
    nbMembres: 78,
    isMember: false,
    prochainEvent: 'Tournoi interclasses - 15 Nov 2025',
    activites: ['Football', 'Basket', 'Athlétisme'],
  },
  {
    id: '3',
    nom: 'Club Culturel',
    description: 'Théâtre, danse, musique et arts plastiques',
    couleur: '#7C3AED',
    nbMembres: 32,
    isMember: false,
    prochainEvent: 'Soirée culturelle - 08 Déc 2025',
    activites: ['Théâtre', 'Danse', 'Musique'],
  },
  {
    id: '4',
    nom: 'Club Scientifique',
    description: 'Expériences scientifiques, astronomie et découvertes',
    couleur: '#0D9488',
    nbMembres: 24,
    isMember: false,
    prochainEvent: 'Expo-sciences - 20 Jan 2026',
    activites: ['Chimie', 'Astronomie', 'Biologie'],
  },
];

// ─── Composants ──────────────────────────────────────────────────────────────
const SectionTitle = ({ children, count }: { children: string; count?: number }) => (
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
      {children}
    </Text>
    {count !== undefined && (
      <Text style={{
        fontSize: 11,
        color: C.textMuted,
      }}>
        {count} club{count > 1 ? 's' : ''}
      </Text>
    )}
  </View>
);

// ─── Screen ──────────────────────────────────────────────────────────────────
export const StudentClubsScreen: React.FC = () => {
  const [clubs, setClubs] = useState(MOCK_CLUBS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'member' | 'available'>('all');

  // Animations pour les cartes
  const cardAnimations = clubs.map(() => ({
    translateY: useRef(new Animated.Value(20)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    cardAnimations.forEach((anim, index) => {
      Animated.parallel([
        Animated.spring(anim.translateY, {
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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleJoinClub = (clubId: string, clubName: string) => {
    Alert.alert(
      'Adhésion au club',
      `Voulez-vous rejoindre ${clubName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setClubs(prev =>
              prev.map(c =>
                c.id === clubId ? { ...c, isMember: true, role: 'Membre' } : c
              )
            );
            Alert.alert('Succès', 'Vous avez rejoint le club avec succès');
          },
        },
      ]
    );
  };

  const handleLeaveClub = (clubId: string, clubName: string) => {
    Alert.alert(
      'Quitter le club',
      `Voulez-vous quitter ${clubName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            setClubs(prev =>
              prev.map(c =>
                c.id === clubId ? { ...c, isMember: false, role: undefined } : c
              )
            );
            Alert.alert('Info', 'Vous avez quitté le club');
          },
        },
      ]
    );
  };

  const filteredClubs = clubs.filter(club => {
    if (filter === 'member') return club.isMember;
    if (filter === 'available') return !club.isMember;
    return true;
  });

  const memberCount = clubs.filter(c => c.isMember).length;

  const renderClubCard = ({ item, index }: { item: Club; index: number }) => {
    const isMember = item.isMember || false;
    const anim = cardAnimations[index] || cardAnimations[0];

    return (
      <Animated.View
        style={{
          marginBottom: 14,
          transform: [{ translateY: anim.translateY }],
          opacity: anim.opacity,
        }}
      >
        <View style={{
          backgroundColor: C.surface,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: isMember ? `${C.green}30` : C.border,
          overflow: 'hidden',
        }}>
          {/* ─── Bandeau coloré ──────────────────────────────────────────────── */}
          <View style={{
            height: 4,
            backgroundColor: item.couleur,
          }} />

          <View style={{ padding: 16 }}>
            {/* ─── En-tête ────────────────────────────────────────────────────── */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: item.couleur + '15',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Feather name="users" size={22} color={item.couleur} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: C.textPrimary,
                    letterSpacing: -0.2,
                    flex: 1,
                  }}>
                    {item.nom}
                  </Text>
                  {isMember && (
                    <View style={{
                      backgroundColor: C.greenBg,
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderWidth: 1,
                      borderColor: C.green + '30',
                      marginLeft: 6,
                    }}>
                      <Text style={{
                        fontSize: 8,
                        fontWeight: '700',
                        color: C.green,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}>
                        {item.role || 'Membre'}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 2,
                }}>
                  <Feather name="users" size={12} color={C.textMuted} />
                  <Text style={{
                    fontSize: 11,
                    color: C.textMuted,
                    marginLeft: 4,
                  }}>
                    {item.nbMembres} membres
                  </Text>
                </View>
              </View>
            </View>

            {/* ─── Description ────────────────────────────────────────────────── */}
            <Text style={{
              fontSize: 13,
              color: C.textSecondary,
              lineHeight: 20,
              marginTop: 12,
            }}>
              {item.description}
            </Text>

            {/* ─── Activités ───────────────────────────────────────────────────── */}
            {item.activites && item.activites.length > 0 && (
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 10,
              }}>
                {item.activites.map((activite, idx) => (
                  <View key={idx} style={{
                    backgroundColor: C.accentBg,
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: `${C.accent}25`,
                    marginRight: 6,
                    marginBottom: 4,
                  }}>
                    <Text style={{
                      fontSize: 9,
                      color: C.accentDim,
                      fontWeight: '600',
                      letterSpacing: 0.3,
                    }}>
                      {activite}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* ─── Prochain événement ──────────────────────────────────────────── */}
            {item.prochainEvent && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: C.surfaceAlt,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginTop: 12,
                borderWidth: 1,
                borderColor: C.border,
              }}>
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: C.amberBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                  <Feather name="calendar" size={14} color={C.amber} />
                </View>
                <Text style={{
                  fontSize: 11,
                  color: C.textSecondary,
                  flex: 1,
                }}>
                  {item.prochainEvent}
                </Text>
              </View>
            )}

            {/* ─── Bouton d'action ────────────────────────────────────────────── */}
            {isMember ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleLeaveClub(item.id, item.nom)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: C.border,
                  marginTop: 12,
                  backgroundColor: C.surfaceAlt,
                }}
              >
                <Feather name="check" size={16} color={C.green} />
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: C.green,
                  marginLeft: 8,
                }}>
                  Membre
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: C.textMuted,
                  marginLeft: 4,
                }}>
                  · Quitter
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleJoinClub(item.id, item.nom)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: C.accent,
                  marginTop: 12,
                  shadowColor: C.accent,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                <Feather name="user-plus" size={16} color="#FFFFFF" />
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginLeft: 8,
                }}>
                  Rejoindre le club
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

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
              Vie scolaire
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              Clubs & activités
            </Text>
          </View>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
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
              Mes clubs
            </Text>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              {memberCount}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: 'row',
          marginTop: 16,
        }}>
          {[
            { label: 'Total', value: clubs.length.toString(), icon: 'grid' },
            { label: 'Disponibles', value: clubs.filter(c => !c.isMember).length.toString(), icon: 'user-plus' },
          ].map((stat, index) => (
            <View key={stat.label} style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: index === 0 ? 10 : 0,
            }}>
              <View style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
                <Feather name={stat.icon as any} size={14} color="rgba(255,255,255,0.6)" />
              </View>
              <View>
                <Text style={{
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  {stat.label}
                </Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#FFFFFF',
                }}>
                  {stat.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* ─── Filtres ────────────────────────────────────────────────────────── */}
      <View style={{
        backgroundColor: C.surface,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        paddingVertical: 12,
        paddingHorizontal: 18,
      }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[
            { key: 'all', label: 'Tous', count: clubs.length },
            { key: 'member', label: 'Mes clubs', count: memberCount },
            { key: 'available', label: 'Disponibles', count: clubs.filter(c => !c.isMember).length },
          ].map((f) => {
            const isActive = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                activeOpacity={0.7}
                onPress={() => setFilter(f.key as any)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: isActive ? C.accent : C.surfaceAlt,
                  borderWidth: 1,
                  borderColor: isActive ? C.accent : C.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 4,
                }}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#FFFFFF' : C.textSecondary,
                }}>
                  {f.label}
                </Text>
                <View style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : C.border,
                  borderRadius: 6,
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                  marginLeft: 6,
                }}>
                  <Text style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: isActive ? '#FFFFFF' : C.textMuted,
                  }}>
                    {f.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ─── Liste des clubs ────────────────────────────────────────────────── */}
      <FlatList
        data={filteredClubs}
        keyExtractor={(item) => item.id}
        renderItem={renderClubCard}
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        ListHeaderComponent={
          <SectionTitle count={filteredClubs.length}>
            Clubs disponibles
          </SectionTitle>
        }
        ListEmptyComponent={
          <View style={{
            backgroundColor: C.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: C.border,
            padding: 40,
            alignItems: 'center',
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: C.accentBg,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Feather name="users" size={36} color={C.accentDim} />
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: C.textPrimary,
            }}>
              Aucun club trouvé
            </Text>
            <Text style={{
              fontSize: 13,
              color: C.textMuted,
              textAlign: 'center',
              marginTop: 4,
            }}>
              Aucun club ne correspond à ce filtre
            </Text>
          </View>
        }
      />
    </View>
  );
};