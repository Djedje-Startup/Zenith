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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme'; // ✅ Thème centralisé

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_CLUBS: Club[] = [
  {
    id: '1',
    nom: 'Club Informatique',
    description: 'Découverte du code, de la robotique et des nouvelles technologies',
    couleur: '#F97316', // ✅ Orange Zenith
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
    couleur: '#10B981', // ✅ Success
    nbMembres: 78,
    isMember: false,
    prochainEvent: 'Tournoi interclasses - 15 Nov 2025',
    activites: ['Football', 'Basket', 'Athlétisme'],
  },
  {
    id: '3',
    nom: 'Club Culturel',
    description: 'Théâtre, danse, musique et arts plastiques',
    couleur: '#8B5CF6', // ✅ Violet Zenith
    nbMembres: 32,
    isMember: false,
    prochainEvent: 'Soirée culturelle - 08 Déc 2025',
    activites: ['Théâtre', 'Danse', 'Musique'],
  },
  {
    id: '4',
    nom: 'Club Scientifique',
    description: 'Expériences scientifiques, astronomie et découvertes',
    couleur: '#3B82F6', // ✅ Info
    nbMembres: 24,
    isMember: false,
    prochainEvent: 'Expo-sciences - 20 Jan 2026',
    activites: ['Chimie', 'Astronomie', 'Biologie'],
  },
];

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const StudentClubsScreen: React.FC = () => {
  const { colors } = useTheme(); // ✅ Thème centralisé
  const navigation = useNavigation<any>();
  const [clubs, setClubs] = useState(MOCK_CLUBS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'member' | 'available'>('all');

  // ─── Animations pour les cartes ───
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

  const handleClubPress = (clubId: string) => {
    navigation.navigate('StudentClubDetail', { clubId });
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

  // ─── Composant SectionTitle ───
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
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
      }}>
        {children}
      </Text>
      {count !== undefined && (
        <Text style={{
          fontSize: 11,
          color: colors.textMuted,
        }}>
          {count} club{count > 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );

  // ─── Rendu d'une carte de club ───
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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleClubPress(item.id)}
        >
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: isMember ? `${colors.success}30` : colors.border,
            overflow: 'hidden',
          }}>
            {/* ─── Bandeau coloré ─── */}
            <View style={{
              height: 4,
              backgroundColor: item.couleur,
            }} />

            <View style={{ padding: 16 }}>
              {/* ─── En-tête ─── */}
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
                      color: colors.text,
                      letterSpacing: -0.2,
                      flex: 1,
                    }}>
                      {item.nom}
                    </Text>
                    {isMember && (
                      <View style={{
                        backgroundColor: `${colors.success}15`,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderWidth: 1,
                        borderColor: `${colors.success}30`,
                        marginLeft: 6,
                      }}>
                        <Text style={{
                          fontSize: 8,
                          fontWeight: '700',
                          color: colors.success,
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
                    <Feather name="users" size={12} color={colors.textMuted} />
                    <Text style={{
                      fontSize: 11,
                      color: colors.textMuted,
                      marginLeft: 4,
                    }}>
                      {item.nbMembres} membres
                    </Text>
                  </View>
                </View>
              </View>

              {/* ─── Description ─── */}
              <Text style={{
                fontSize: 13,
                color: colors.textSecondary,
                lineHeight: 20,
                marginTop: 12,
              }}>
                {item.description}
              </Text>

              {/* ─── Activités ─── */}
              {item.activites && item.activites.length > 0 && (
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 10,
                }}>
                  {item.activites.map((activite, idx) => (
                    <View key={idx} style={{
                      backgroundColor: colors.primaryBg,
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderWidth: 1,
                      borderColor: `${colors.primary}25`,
                      marginRight: 6,
                      marginBottom: 4,
                    }}>
                      <Text style={{
                        fontSize: 9,
                        color: colors.primary,
                        fontWeight: '600',
                        letterSpacing: 0.3,
                      }}>
                        {activite}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* ─── Prochain événement ─── */}
              {item.prochainEvent && (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.surfaceElevated,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginTop: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                  <View style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    backgroundColor: `${colors.warning}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}>
                    <Feather name="calendar" size={14} color={colors.warning} />
                  </View>
                  <Text style={{
                    fontSize: 11,
                    color: colors.textSecondary,
                    flex: 1,
                  }}>
                    {item.prochainEvent}
                  </Text>
                </View>
              )}

              {/* ─── Bouton d'action ─── */}
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
                    borderColor: colors.border,
                    marginTop: 12,
                    backgroundColor: colors.surfaceElevated,
                  }}
                >
                  <Feather name="check" size={16} color={colors.success} />
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: colors.success,
                    marginLeft: 8,
                  }}>
                    Membre
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: colors.textMuted,
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
                    backgroundColor: colors.primary,
                    marginTop: 12,
                    shadowColor: colors.primary,
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
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
              🎯 Vie scolaire
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
              backgroundColor: 'rgba(255,255,255,0.12)',
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
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
                <Feather name={stat.icon as any} size={14} color="rgba(255,255,255,0.8)" />
              </View>
              <View>
                <Text style={{
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.5)',
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

      {/* ─── FILTRES ─── */}
      <View style={{
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
                  backgroundColor: isActive ? colors.primary : colors.surfaceElevated,
                  borderWidth: 1,
                  borderColor: isActive ? colors.primary : colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 4,
                }}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#FFFFFF' : colors.textSecondary,
                }}>
                  {f.label}
                </Text>
                <View style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colors.border,
                  borderRadius: 6,
                  paddingHorizontal: 6,
                  paddingVertical: 1,
                  marginLeft: 6,
                }}>
                  <Text style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: isActive ? '#FFFFFF' : colors.textMuted,
                  }}>
                    {f.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ─── LISTE DES CLUBS ─── */}
      <FlatList
        data={filteredClubs}
        keyExtractor={(item) => item.id}
        renderItem={renderClubCard}
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <SectionTitle count={filteredClubs.length}>
            Clubs disponibles
          </SectionTitle>
        }
        ListEmptyComponent={
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 40,
            alignItems: 'center',
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: colors.primaryBg,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Feather name="users" size={36} color={colors.primary} />
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.text,
            }}>
              Aucun club trouvé
            </Text>
            <Text style={{
              fontSize: 13,
              color: colors.textMuted,
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