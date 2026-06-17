// screens/eleve/StudentTimetableScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
interface TimetableEntry {
  id: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  professeur: string;
  salle: string;
  type?: 'CM' | 'TD' | 'TP' | 'DS';
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_TIMETABLE: Record<string, TimetableEntry[]> = {
  Lundi: [
    { id: '1', heureDebut: '08:00', heureFin: '09:30', matiere: 'Mathématiques', professeur: 'M. NGOMA', salle: 'A101', type: 'CM' },
    { id: '2', heureDebut: '10:00', heureFin: '11:30', matiere: 'Français', professeur: 'Mme LOUBAKI', salle: 'A102', type: 'TD' },
    { id: '3', heureDebut: '14:00', heureFin: '15:30', matiere: 'Physique-Chimie', professeur: 'M. MFOUMOU', salle: 'Labo Sciences', type: 'TP' },
  ],
  Mardi: [
    { id: '4', heureDebut: '08:00', heureFin: '09:30', matiere: 'Physique-Chimie', professeur: 'M. MFOUMOU', salle: 'Labo Sciences', type: 'TP' },
    { id: '5', heureDebut: '10:00', heureFin: '11:30', matiere: 'Anglais', professeur: 'M. WAMBA', salle: 'Labo Langues', type: 'TD' },
  ],
  Mercredi: [
    { id: '6', heureDebut: '09:00', heureFin: '12:00', matiere: 'Mathématiques', professeur: 'M. NGOMA', salle: 'A101', type: 'DS' },
  ],
  Jeudi: [
    { id: '7', heureDebut: '08:00', heureFin: '09:30', matiere: 'Anglais', professeur: 'M. WAMBA', salle: 'Labo Langues', type: 'TD' },
    { id: '8', heureDebut: '14:00', heureFin: '15:30', matiere: 'Histoire-Géo', professeur: 'Mme MOUKALA', salle: 'A103', type: 'CM' },
  ],
  Vendredi: [
    { id: '9', heureDebut: '08:00', heureFin: '09:30', matiere: 'Histoire-Géo', professeur: 'Mme MOUKALA', salle: 'A103', type: 'CM' },
  ],
  Samedi: [],
};

const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getTypeConfig = (type?: string) => {
  switch (type) {
    case 'CM':
      return { label: 'Cours Magistral', color: C.blue, bg: C.blueBg };
    case 'TD':
      return { label: 'Travaux Dirigés', color: C.teal, bg: C.tealBg };
    case 'TP':
      return { label: 'Travaux Pratiques', color: C.purple, bg: C.purpleBg };
    case 'DS':
      return { label: 'Devoir Surveillé', color: C.red, bg: C.redBg };
    default:
      return { label: 'Cours', color: C.textMuted, bg: C.surfaceAlt };
  }
};

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
        {count} cours
      </Text>
    )}
  </View>
);

// ─── Screen ──────────────────────────────────────────────────────────────────
export const StudentTimetableScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(joursSemaine[0]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const currentCours = MOCK_TIMETABLE[selectedDay] || [];
  const hasData = currentCours.length > 0;

  const totalHeures = currentCours.reduce((acc, cours) => {
    const debut = parseInt(cours.heureDebut.split(':')[0]);
    const fin = parseInt(cours.heureFin.split(':')[0]);
    return acc + (fin - debut);
  }, 0);

  // Animations pour les cours
  const courseAnimations = currentCours.map(() => ({
    translateX: useRef(new Animated.Value(-10)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    courseAnimations.forEach((anim, index) => {
      Animated.parallel([
        Animated.spring(anim.translateX, {
          toValue: 0,
          damping: 25,
          delay: 150 + index * 40,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 300,
          delay: 150 + index * 40,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [selectedDay]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
      >
        {/* ───── Header Premium ──────────────────────────────────────────────── */}
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
                Élève
              </Text>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}>
                Mon emploi du temps
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
                Semaine
              </Text>
              <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                S-42
              </Text>
            </View>
          </View>

          {/* Stats du jour */}
          {hasData && (
            <View style={{
              flexDirection: 'row',
              marginTop: 16,
            }}>
              {[
                { label: 'Cours', value: currentCours.length.toString(), icon: 'book-open' },
                { label: 'Heures', value: totalHeures.toString(), icon: 'clock' },
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
          )}
        </LinearGradient>

        {/* ─── Sélecteur de jour ────────────────────────────────────────────── */}
        <View style={{
          backgroundColor: C.surface,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          paddingVertical: 12,
        }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}
          >
            {joursSemaine.map((jour) => {
              const isActive = selectedDay === jour;
              const hasCours = MOCK_TIMETABLE[jour]?.length > 0;

              return (
                <TouchableOpacity
                  key={jour}
                  activeOpacity={0.7}
                  onPress={() => setSelectedDay(jour)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 14,
                    backgroundColor: isActive ? C.accent : C.surfaceAlt,
                    borderWidth: 1,
                    borderColor: isActive ? C.accent : C.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 13,
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? '#FFFFFF' : C.textSecondary,
                  }}>
                    {jour}
                  </Text>
                  {hasCours && (
                    <View style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: isActive ? 'rgba(255,255,255,0.5)' : C.accent,
                      marginLeft: 6,
                    }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ─── Cours du jour ────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 40 }}>
          {hasData ? (
            <>
              <SectionTitle count={currentCours.length}>
                {selectedDay}
              </SectionTitle>

              {currentCours.map((cours, index) => {
                const typeConfig = getTypeConfig(cours.type);
                const isCurrent = (() => {
                  const now = new Date();
                  const heureActuelle = now.getHours().toString().padStart(2, '0');
                  const minuteActuelle = now.getMinutes().toString().padStart(2, '0');
                  const maintenant = `${heureActuelle}:${minuteActuelle}`;
                  return cours.heureDebut <= maintenant && maintenant <= cours.heureFin;
                })();
                const anim = courseAnimations[index] || courseAnimations[0];

                return (
                  <Animated.View
                    key={cours.id}
                    style={{
                      marginBottom: 10,
                      transform: [{ translateX: anim.translateX }],
                      opacity: anim.opacity,
                    }}
                  >
                    <View style={{
                      backgroundColor: isCurrent ? `${C.accent}15` : C.surface,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: isCurrent ? C.accent : C.border,
                      padding: 16,
                    }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                          {/* En-tête du cours */}
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                              width: 4,
                              height: 32,
                              borderRadius: 2,
                              backgroundColor: typeConfig.color,
                              marginRight: 10,
                            }} />
                            <View>
                              <Text style={{
                                fontSize: 17,
                                fontWeight: '700',
                                color: C.textPrimary,
                                letterSpacing: -0.3,
                              }}>
                                {cours.matiere}
                              </Text>
                              <Text style={{
                                fontSize: 12,
                                color: C.textSecondary,
                                marginTop: 1,
                              }}>
                                {cours.professeur}
                              </Text>
                            </View>
                          </View>

                          {/* Infos horaires et salle */}
                          <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginTop: 12,
                            paddingTop: 12,
                            borderTopWidth: 1,
                            borderTopColor: C.border,
                          }}>
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginRight: 16,
                            }}>
                              <Feather name="clock" size={14} color={C.textMuted} />
                              <Text style={{
                                fontSize: 12,
                                color: C.textMuted,
                                marginLeft: 6,
                              }}>
                                {cours.heureDebut} - {cours.heureFin}
                              </Text>
                            </View>
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                              <Feather name="map-pin" size={14} color={C.textMuted} />
                              <Text style={{
                                fontSize: 12,
                                color: C.textMuted,
                                marginLeft: 6,
                              }}>
                                Salle {cours.salle}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Badge type */}
                        <View style={{
                          backgroundColor: typeConfig.bg,
                          borderRadius: 8,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderWidth: 1,
                          borderColor: typeConfig.color + '30',
                          marginLeft: 10,
                          alignSelf: 'flex-start',
                        }}>
                          <Text style={{
                            fontSize: 9,
                            fontWeight: '700',
                            color: typeConfig.color,
                            letterSpacing: 0.5,
                          }}>
                            {cours.type || 'Cours'}
                          </Text>
                        </View>
                      </View>

                      {/* Indicateur "En cours" */}
                      {isCurrent && (
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                          paddingTop: 10,
                          borderTopWidth: 1,
                          borderTopColor: C.border,
                        }}>
                          <View style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: C.green,
                            marginRight: 8,
                          }} />
                          <Text style={{
                            fontSize: 10,
                            fontWeight: '600',
                            color: C.green,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}>
                            En cours
                          </Text>
                        </View>
                      )}
                    </View>
                  </Animated.View>
                );
              })}
            </>
          ) : (
            // ─── État vide ──────────────────────────────────────────────────────
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
                <Feather name="calendar" size={36} color={C.accentDim} />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: C.textPrimary,
              }}>
                Aucun cours
              </Text>
              <Text style={{
                fontSize: 13,
                color: C.textMuted,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Aucun cours n'est planifié pour ce jour
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};