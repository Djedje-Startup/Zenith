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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface Cours {
  id: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  classe: string;
  salle: string;
  type?: 'CM' | 'TD' | 'TP' | 'DS';
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const TeacherTimetableScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(joursSemaine[0]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const currentCours = MOCK_TIMETABLE[selectedDay] || [];
  const hasData = currentCours.length > 0;

  const totalHeures = currentCours.reduce((acc, cours) => {
    const debut = parseInt(cours.heureDebut.split(':')[0]);
    const fin = parseInt(cours.heureFin.split(':')[0]);
    return acc + (fin - debut);
  }, 0);

  const matieresUniques = new Set(currentCours.map(c => c.matiere)).size;

  // ─── Configuration des types de cours ───
  const getTypeConfig = (type?: string) => {
    const configs: Record<string, { label: string; color: string; bg: string }> = {
      CM: { label: 'Cours Magistral', color: colors.info, bg: colors.info + '15' },
      TD: { label: 'Travaux Dirigés', color: colors.secondary, bg: colors.secondaryBg },
      TP: { label: 'Travaux Pratiques', color: colors.primary, bg: colors.primaryBg },
      DS: { label: 'Devoir Surveillé', color: colors.error, bg: colors.error + '15' },
    };
    return configs[type || ''] || { label: type || 'Cours', color: colors.textMuted, bg: 'transparent' };
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
            {/* Bouton retour */}
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={goBack}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
              }}
            >
              <Feather name="arrow-left" size={18} color="rgba(255,255,255,0.6)" />
              <Text style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: '500',
              }}>
                Retour
              </Text>
            </TouchableOpacity>
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.6)',
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
            backgroundColor: 'rgba(255,255,255,0.15)',
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
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
                <Feather name={stat.icon as any} size={14} color="rgba(255,255,255,0.8)" />
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
                    color: 'rgba(255,255,255,0.5)',
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

      {/* ─── SÉLECTEUR DE JOUR ─── */}
      <View style={{
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
                  backgroundColor: isActive ? colors.primary : colors.surfaceElevated,
                  borderWidth: 1,
                  borderColor: isActive ? colors.primary : colors.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: isActive ? '#FFFFFF' : colors.textSecondary,
                }}>
                  {jour}
                </Text>
                {hasCours && (
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.5)' : colors.primary,
                  }} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── LISTE DES COURS ─── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
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
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
              }}>
                {currentCours.length} cours
              </Text>
              <Text style={{
                fontSize: 11,
                color: colors.textMuted,
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
                    backgroundColor: isCurrent ? colors.primaryBg : colors.surface,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: isCurrent ? colors.primary : colors.border,
                    marginBottom: 12,
                    padding: 16,
                  }}
                >
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}>
                    <View style={{ flex: 1 }}>
                      {/* En-tête du cours */}
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
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
                            color: colors.text,
                            letterSpacing: -0.3,
                          }}>
                            {cours.matiere}
                          </Text>
                          <Text style={{
                            fontSize: 13,
                            color: colors.textSecondary,
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
                        borderTopColor: colors.border,
                      }}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}>
                          <Feather name="clock" size={14} color={colors.textMuted} />
                          <Text style={{
                            fontSize: 12,
                            color: colors.textMuted,
                          }}>
                            {cours.heureDebut} - {cours.heureFin}
                          </Text>
                        </View>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}>
                          <Feather name="map-pin" size={14} color={colors.textMuted} />
                          <Text style={{
                            fontSize: 12,
                            color: colors.textMuted,
                          }}>
                            Salle {cours.salle}
                          </Text>
                        </View>
                        {isCurrent && (
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                            backgroundColor: colors.success + '15',
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 6,
                          }}>
                            <View style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: colors.success,
                            }} />
                            <Text style={{
                              fontSize: 9,
                              fontWeight: '700',
                              color: colors.success,
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
          // ─── ÉTAT VIDE ───
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
              <Feather name="calendar" size={36} color={colors.primary} />
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.text,
            }}>
              Aucun cours
            </Text>
            <Text style={{
              fontSize: 13,
              color: colors.textMuted,
              textAlign: 'center',
              marginTop: 4,
            }}>
              Aucun cours n'est planifié pour ce jour
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                marginTop: 16,
                backgroundColor: colors.primaryBg,
                borderRadius: 12,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: `${colors.primary}30`,
              }}
            >
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: colors.primary,
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