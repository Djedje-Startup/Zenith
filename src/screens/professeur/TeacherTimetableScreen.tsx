// screens/professeur/TeacherTimetableScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
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
interface Cours {
  id: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  classe: string;
  salle: string;
  type?: 'CM' | 'TD' | 'TP' | 'DS';
}

// ─── Données Mock ────────────────────────────────────────────────────────────
const MOCK_TIMETABLE: Record<string, Cours[]> = {
  Lundi: [
    { id: '1', heureDebut: '08:00', heureFin: '09:30', matiere: 'Mathématiques', classe: '3ème A', salle: 'A101', type: 'CM' },
    { id: '2', heureDebut: '10:00', heureFin: '11:30', matiere: 'Mathématiques', classe: '4ème B', salle: 'A102', type: 'TD' },
    { id: '3', heureDebut: '14:00', heureFin: '15:30', matiere: 'Physique-Chimie', classe: '3ème A', salle: 'Labo', type: 'TP' },
  ],
  Mardi: [
    { id: '4', heureDebut: '08:00', heureFin: '09:30', matiere: 'Physique-Chimie', classe: 'Terminale C', salle: 'Labo Sciences', type: 'TP' },
    { id: '5', heureDebut: '10:00', heureFin: '11:30', matiere: 'Mathématiques', classe: '4ème B', salle: 'A102', type: 'TD' },
  ],
  Mercredi: [
    { id: '6', heureDebut: '09:00', heureFin: '12:00', matiere: 'Mathématiques', classe: '3ème A', salle: 'A101', type: 'DS' },
  ],
  Jeudi: [
    { id: '7', heureDebut: '08:00', heureFin: '09:30', matiere: 'Mathématiques', classe: '3ème A', salle: 'A101', type: 'CM' },
    { id: '8', heureDebut: '14:00', heureFin: '15:30', matiere: 'Physique-Chimie', classe: 'Terminale C', salle: 'Labo', type: 'TP' },
  ],
  Vendredi: [
    { id: '9', heureDebut: '08:00', heureFin: '09:30', matiere: 'Mathématiques', classe: '4ème B', salle: 'A102', type: 'TD' },
  ],
  Samedi: [],
};

const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

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
      return { label: type || 'Cours', color: C.textMuted, bg: 'transparent' };
  }
};

// ─── Composant principal ──────────────────────────────────────────────────────
export const TeacherTimetableScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(joursSemaine[0]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const currentCours = MOCK_TIMETABLE[selectedDay] || [];
  const hasData = currentCours.length > 0;

  // Statistiques de la journée
  const totalHeures = currentCours.reduce((acc, cours) => {
    const debut = parseInt(cours.heureDebut.split(':')[0]);
    const fin = parseInt(cours.heureFin.split(':')[0]);
    return acc + (fin - debut);
  }, 0);

  const matieresUniques = new Set(currentCours.map(c => c.matiere)).size;

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
              Enseignant
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
            gap: 10,
            marginTop: 16,
          }}>
            {[
              { label: 'Cours', value: currentCours.length.toString(), icon: 'book-open' },
              { label: 'Matières', value: matieresUniques.toString(), icon: 'layers' },
              { label: 'Heures', value: totalHeures.toString(), icon: 'clock' },
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
                <Feather name={stat.icon as any} size={14} color="rgba(255,255,255,0.5)" />
                <View>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}>
                    {stat.value}
                  </Text>
                  <Text style={{
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {stat.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>

      {/* ─── Sélecteur de jour ────────────────────────────────────────────────── */}
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
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: isActive ? C.accent : C.surfaceAlt,
                  borderWidth: 1,
                  borderColor: isActive ? C.accent : C.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
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
                  }} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── Liste des cours ──────────────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
      >
        {hasData ? (
          <>
            {/* En-tête de la journée */}
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
                {currentCours.length} cours
              </Text>
              <Text style={{
                fontSize: 11,
                color: C.textMuted,
              }}>
                {totalHeures}h de cours
              </Text>
            </View>

            {currentCours.map((cours, index) => {
              const typeConfig = getTypeConfig(cours.type);
              const isCurrent = (() => {
                const now = new Date();
                const heureActuelle = now.getHours().toString().padStart(2, '0');
                const minuteActuelle = now.getMinutes().toString().padStart(2, '0');
                const maintenant = `${heureActuelle}:${minuteActuelle}`;
                return cours.heureDebut <= maintenant && maintenant <= cours.heureFin;
              })();

              return (
                <View
                  key={cours.id}
                  style={{
                    backgroundColor: isCurrent ? `${C.accent}15` : C.surface,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: isCurrent ? C.accent : C.border,
                    marginBottom: 12,
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      {/* En-tête du cours */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{
                          width: 4,
                          height: 32,
                          borderRadius: 2,
                          backgroundColor: typeConfig.color,
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
                            fontSize: 13,
                            color: C.textSecondary,
                            marginTop: 1,
                          }}>
                            {cours.classe}
                          </Text>
                        </View>
                      </View>

                      {/* Infos horaires et salle */}
                      <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 14,
                        marginTop: 12,
                        paddingTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: C.border,
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Feather name="clock" size={14} color={C.textMuted} />
                          <Text style={{
                            fontSize: 12,
                            color: C.textMuted,
                          }}>
                            {cours.heureDebut} - {cours.heureFin}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Feather name="map-pin" size={14} color={C.textMuted} />
                          <Text style={{
                            fontSize: 12,
                            color: C.textMuted,
                          }}>
                            Salle {cours.salle}
                          </Text>
                        </View>
                        {isCurrent && (
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            backgroundColor: C.greenBg,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 6,
                          }}>
                            <View style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: C.green,
                            }} />
                            <Text style={{
                              fontSize: 9,
                              fontWeight: '700',
                              color: C.green,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                            }}>
                              En cours
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Badge type */}
                    {cours.type && (
                      <View style={{
                        backgroundColor: typeConfig.bg,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderWidth: 1,
                        borderColor: `${typeConfig.color}30`,
                      }}>
                        <Text style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: typeConfig.color,
                          letterSpacing: 0.5,
                        }}>
                          {cours.type}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          // ─── État vide ──────────────────────────────────────────────────────────
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
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                marginTop: 16,
                backgroundColor: C.accentBg,
                borderRadius: 12,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: `${C.accent}30`,
              }}
            >
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: C.accentDim,
              }}>
                Voir planning complet
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};