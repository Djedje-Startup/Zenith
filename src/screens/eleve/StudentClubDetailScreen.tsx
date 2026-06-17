// screens/eleve/StudentClubDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
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
interface ClubDetail {
  id: string;
  nom: string;
  description: string;
  logo?: string;
  couleur: string;
  bureau: { id: string; nom: string; prenoms: string; role: string; photo?: string }[];
  evenements: { id: string; titre: string; date: string; lieu: string }[];
  isMember: boolean;
  nbMembres: number;
  activites?: string[];
  horaires?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_CLUB_DETAIL: ClubDetail = {
  id: '1',
  nom: 'Club Informatique',
  description: 'Découverte du code, de la robotique et des nouvelles technologies. Ateliers hebdomadaires, projets collaboratifs et participation aux compétitions nationales.',
  couleur: '#4F46E5',
  bureau: [
    { id: '1', nom: 'NGOMA', prenoms: 'Paul', role: 'Président', photo: undefined },
    { id: '2', nom: 'LOUBAT', prenoms: 'Marie', role: 'Vice-présidente', photo: undefined },
    { id: '3', nom: 'WAMBA', prenoms: 'Christ', role: 'Trésorier', photo: undefined },
    { id: '4', nom: 'MFOUMOU', prenoms: 'Alain', role: 'Secrétaire', photo: undefined },
  ],
  evenements: [
    { id: '1', titre: 'Hackathon Junior', date: '25 Oct 2025', lieu: 'Salle Informatique' },
    { id: '2', titre: 'Atelier Python', date: '10 Nov 2025', lieu: 'Labo Info' },
    { id: '3', titre: 'Compétition Robotique', date: '05 Déc 2025', lieu: 'Gymnase' },
  ],
  isMember: false,
  nbMembres: 45,
  activites: ['Programmation', 'Robotique', 'Intelligence Artificielle', 'Sécurité'],
  horaires: 'Mercredi 14h-17h • Samedi 9h-12h',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (nom: string, prenoms: string) => {
  return `${prenoms[0]}${nom[0]}`.toUpperCase();
};

// ─── Composants ──────────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: string }) => (
  <Text style={{
    fontSize: 11,
    fontWeight: '700',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  }}>
    {children}
  </Text>
);

// ─── Screen ──────────────────────────────────────────────────────────────────
export const StudentClubDetailScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [club, setClub] = useState(MOCK_CLUB_DETAIL);
  const [isJoining, setIsJoining] = useState(false);

  // Animations
  const descriptionTranslateY = useRef(new Animated.Value(20)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const activitesTranslateY = useRef(new Animated.Value(20)).current;
  const activitesOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const bureauTranslateY = useRef(new Animated.Value(20)).current;
  const bureauOpacity = useRef(new Animated.Value(0)).current;
  const eventsTranslateY = useRef(new Animated.Value(20)).current;
  const eventsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation de la description
    Animated.parallel([
      Animated.spring(descriptionTranslateY, {
        toValue: 0,
        damping: 25,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation des activités
    Animated.parallel([
      Animated.spring(activitesTranslateY, {
        toValue: 0,
        damping: 25,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(activitesOpacity, {
        toValue: 1,
        duration: 300,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation du bouton
    Animated.parallel([
      Animated.spring(buttonTranslateY, {
        toValue: 0,
        damping: 25,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation du bureau
    Animated.parallel([
      Animated.spring(bureauTranslateY, {
        toValue: 0,
        damping: 25,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.timing(bureauOpacity, {
        toValue: 1,
        duration: 300,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation des événements
    Animated.parallel([
      Animated.spring(eventsTranslateY, {
        toValue: 0,
        damping: 25,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(eventsOpacity, {
        toValue: 1,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleJoin = () => {
    Alert.alert(
      'Rejoindre le club',
      `Voulez-vous rejoindre ${club.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setIsJoining(true);
            setTimeout(() => {
              setClub({ ...club, isMember: true });
              setIsJoining(false);
              Alert.alert('Succès', 'Vous avez rejoint le club avec succès');
            }, 1000);
          },
        },
      ]
    );
  };

  const handleLeave = () => {
    Alert.alert(
      'Quitter le club',
      `Voulez-vous vraiment quitter ${club.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            setClub({ ...club, isMember: false });
            Alert.alert('Info', 'Vous avez quitté le club');
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
      >
        {/* ───── Header avec dégradé ────────────────────────────────────────────── */}
        <LinearGradient
          colors={[club.couleur, club.couleur + 'CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 56,
            paddingBottom: 80,
            paddingHorizontal: 22,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
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

          <View style={{ alignItems: 'center', marginTop: 8 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: 'rgba(255,255,255,0.3)',
            }}>
              <Feather name="users" size={36} color="#FFFFFF" />
            </View>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 12,
              letterSpacing: -0.5,
            }}>
              {club.nom}
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 6,
            }}>
              <Feather name="users" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.8)',
                marginLeft: 6,
              }}>
                {club.nbMembres} membres
              </Text>
              {club.isMember && (
                <>
                  <View style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    marginHorizontal: 8,
                  }} />
                  <View style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}>
                    <Text style={{
                      fontSize: 9,
                      fontWeight: '700',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      Membre
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* ───── Contenu ────────────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 18, marginTop: -24, paddingBottom: 40 }}>

          {/* ─── Description ────────────────────────────────────────────────────── */}
          <Animated.View
            style={{
              backgroundColor: C.surface,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: C.border,
              padding: 18,
              marginBottom: 16,
              transform: [{ translateY: descriptionTranslateY }],
              opacity: descriptionOpacity,
            }}
          >
            <Text style={{
              fontSize: 14,
              color: C.textSecondary,
              lineHeight: 22,
            }}>
              {club.description}
            </Text>

            {/* Horaires */}
            {club.horaires && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: C.border,
              }}>
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: C.accentBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                  <Feather name="clock" size={14} color={C.accentDim} />
                </View>
                <Text style={{
                  fontSize: 12,
                  color: C.textMuted,
                }}>
                  {club.horaires}
                </Text>
              </View>
            )}
          </Animated.View>

          {/* ─── Activités ────────────────────────────────────────────────────── */}
          {club.activites && club.activites.length > 0 && (
            <Animated.View
              style={{
                marginBottom: 16,
                transform: [{ translateY: activitesTranslateY }],
                opacity: activitesOpacity,
              }}
            >
              <SectionTitle>Activités</SectionTitle>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
                {club.activites.map((activite, idx) => (
                  <View key={idx} style={{
                    backgroundColor: C.accentBg,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: `${C.accent}25`,
                    marginRight: 6,
                    marginBottom: 6,
                  }}>
                    <Text style={{
                      fontSize: 11,
                      color: C.accentDim,
                      fontWeight: '600',
                      letterSpacing: 0.3,
                    }}>
                      {activite}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* ─── Bouton d'adhésion ────────────────────────────────────────────── */}
          <Animated.View
            style={{
              marginBottom: 20,
              transform: [{ translateY: buttonTranslateY }],
              opacity: buttonOpacity,
            }}
          >
            {club.isMember ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLeave}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 14,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: C.red,
                  backgroundColor: C.redBg,
                }}
              >
                <Feather name="log-out" size={18} color={C.red} />
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: C.red,
                  marginLeft: 10,
                }}>
                  Quitter le club
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleJoin}
                disabled={isJoining}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: isJoining ? C.textMuted : C.accent,
                  shadowColor: C.accent,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 6,
                }}
              >
                {isJoining ? (
                  <>
                    <View style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: 'rgba(255,255,255,0.3)',
                      borderTopColor: '#FFFFFF',
                      transform: [{ rotate: '45deg' }],
                    }} />
                    <Text style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: '#FFFFFF',
                      marginLeft: 10,
                    }}>
                      Adhésion en cours...
                    </Text>
                  </>
                ) : (
                  <>
                    <Feather name="user-plus" size={18} color="#FFFFFF" />
                    <Text style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: '#FFFFFF',
                      marginLeft: 10,
                    }}>
                      Rejoindre le club
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* ─── Bureau ────────────────────────────────────────────────────────── */}
          {club.bureau.length > 0 && (
            <Animated.View
              style={{
                marginBottom: 20,
                transform: [{ translateY: bureauTranslateY }],
                opacity: bureauOpacity,
              }}
            >
              <SectionTitle>Bureau</SectionTitle>
              {club.bureau.map((membre, index) => (
                <View key={membre.id} style={{
                  backgroundColor: C.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: C.border,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: C.accentBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: C.accentDim,
                    }}>
                      {getInitials(membre.nom, membre.prenoms)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: C.textPrimary,
                    }}>
                      {membre.prenoms} {membre.nom}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: C.accentDim,
                      fontWeight: '500',
                    }}>
                      {membre.role}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={C.textMuted} />
                </View>
              ))}
            </Animated.View>
          )}

          {/* ─── Événements ────────────────────────────────────────────────────── */}
          {club.evenements.length > 0 && (
            <Animated.View
              style={{
                transform: [{ translateY: eventsTranslateY }],
                opacity: eventsOpacity,
              }}
            >
              <SectionTitle>Événements à venir</SectionTitle>
              {club.evenements.map((event) => (
                <View key={event.id} style={{
                  backgroundColor: C.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: C.border,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: C.amberBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Feather name="calendar" size={20} color={C.amber} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: C.textPrimary,
                    }}>
                      {event.titre}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 2,
                    }}>
                      <Text style={{
                        fontSize: 11,
                        color: C.textMuted,
                      }}>
                        {event.date}
                      </Text>
                      <View style={{
                        width: 3,
                        height: 3,
                        borderRadius: 1.5,
                        backgroundColor: C.textMuted,
                        marginHorizontal: 6,
                      }} />
                      <Text style={{
                        fontSize: 11,
                        color: C.textMuted,
                      }}>
                        {event.lieu}
                      </Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={18} color={C.textMuted} />
                </View>
              ))}
            </Animated.View>
          )}

        </View>
      </ScrollView>
    </View>
  );
};