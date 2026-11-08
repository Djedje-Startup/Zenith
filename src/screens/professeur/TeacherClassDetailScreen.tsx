// screens/professeur/TeacherClassDetailScreen.tsx
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
interface Eleve {
  id: string;
  nom: string;
  prenoms: string;
  matricule: string;
  moyenne?: number;
  rang?: number;
}

interface ClassDetail {
  id: string;
  nom: string;
  niveau: string;
  matiere: string;
  effectif: number;
  moyenneClasse: number;
  eleves: Eleve[];
  anneeScolaire: string;
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_CLASS_DETAIL: ClassDetail = {
  id: '1',
  nom: '3ème A',
  niveau: '3ème',
  matiere: 'Mathématiques',
  effectif: 32,
  moyenneClasse: 14.2,
  anneeScolaire: '2024-2025',
  eleves: [
    { id: '1', nom: 'MOUKOKO', prenoms: 'Jean Junior', matricule: 'LMB-2025-001', moyenne: 15.5, rang: 3 },
    { id: '2', nom: 'NGOMA', prenoms: 'Paul', matricule: 'LMB-2025-002', moyenne: 14.2, rang: 5 },
    { id: '3', nom: 'LOUBAT', prenoms: 'Marie', matricule: 'LMB-2025-003', moyenne: 17.8, rang: 1 },
    { id: '4', nom: 'WAMBA', prenoms: 'Christ', matricule: 'LMB-2025-004', moyenne: 13.5, rang: 6 },
    { id: '5', nom: 'MFOUMOU', prenoms: 'Alain', matricule: 'LMB-2025-005', moyenne: 11.2, rang: 8 },
  ],
};

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const TeacherClassDetailScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [classDetail] = useState(MOCK_CLASS_DETAIL);
  const [activeTab, setActiveTab] = useState<'eleves' | 'notes' | 'presences'>('eleves');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getMoyenneColor = (moyenne?: number) => {
    if (!moyenne) return colors.textMuted;
    if (moyenne >= 16) return colors.success;
    if (moyenne >= 12) return colors.warning;
    return colors.error;
  };

  const getInitials = (nom: string, prenoms: string) => {
    return `${prenoms[0]}${nom[0]}`.toUpperCase();
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToGradeEntry = () => {
    navigation.navigate('TeacherGradeEntry', { 
      classeId: classDetail.id, 
      className: classDetail.nom 
    });
  };

  const goToAttendance = () => {
    navigation.navigate('TeacherAttendance', { 
      classeId: classDetail.id, 
      className: classDetail.nom 
    });
  };

  // ✅ Correction : chaque tab a la même structure avec 'count' facultatif
  interface Tab {
    key: 'eleves' | 'notes' | 'presences';
    label: string;
    icon: keyof typeof Feather.glyphMap;
    count?: number;
  }

  const tabs: Tab[] = [
    { key: 'eleves', label: 'Élèves', icon: 'users', count: classDetail.eleves.length },
    { key: 'notes', label: 'Notes', icon: 'edit-3' },
    { key: 'presences', label: 'Présences', icon: 'check-square' },
  ];

  // ─── RENDU ───
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
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
          {/* Navigation retour */}
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={goBack}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <Feather name="arrow-left" size={20} color="rgba(255,255,255,0.7)" />
            <Text style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: '500',
            }}>
              Retour
            </Text>
          </TouchableOpacity>

          {/* Titre et infos */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <View>
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                Détails de la classe
              </Text>
              <Text style={{
                fontSize: 26,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}>
                {classDetail.nom}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 4,
              }}>
                <Text style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {classDetail.niveau}
                </Text>
                <View style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }} />
                <Text style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {classDetail.matiere}
                </Text>
              </View>
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: '#FFFFFF',
                letterSpacing: 0.5,
              }}>
                {classDetail.anneeScolaire}
              </Text>
            </View>
          </View>

          {/* Statistiques */}
          <View style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: 18,
          }}>
            {[
              { label: 'Effectif', value: classDetail.effectif.toString(), icon: 'users' },
              { label: 'Moyenne', value: classDetail.moyenneClasse.toFixed(1), icon: 'trending-up', suffix: '/20' },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Feather name={stat.icon as any} size={16} color="rgba(255,255,255,0.8)" />
                </View>
                <View>
                  <Text style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {stat.label}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#FFFFFF',
                    }}>
                      {stat.value}
                    </Text>
                    {stat.suffix && (
                      <Text style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: '500',
                      }}>
                        {stat.suffix}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ─── ONGLETS ─── */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 18,
          marginTop: 20,
          gap: 8,
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 14,
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: isActive ? colors.primary : colors.border,
                }}
              >
                <Feather 
                  name={tab.icon as any} 
                  size={16} 
                  color={isActive ? '#FFFFFF' : colors.textMuted} 
                />
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: isActive ? '#FFFFFF' : colors.textSecondary,
                }}>
                  {tab.label}
                  {tab.count !== undefined && ` (${tab.count})`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── CONTENU ─── */}
        <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>

          {/* ─── ÉLÈVES ─── */}
          {activeTab === 'eleves' && (
            <View>
              {/* Barre de recherche */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 14,
                marginBottom: 16,
              }}>
                <Feather name="search" size={18} color={colors.textMuted} />
                <Text style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  fontSize: 14,
                  color: colors.textSecondary,
                }}>
                  Rechercher un élève...
                </Text>
                <Feather name="filter" size={18} color={colors.textMuted} />
              </View>

              {/* Liste des élèves */}
              {classDetail.eleves.map((eleve, index) => {
                const moyenneColor = getMoyenneColor(eleve.moyenne);
                const isTop = eleve.rang && eleve.rang <= 3;
                const isBottom = eleve.rang && eleve.rang > classDetail.eleves.length - 3;

                return (
                  <View
                    key={eleve.id}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: isTop ? `${colors.primary}30` : colors.border,
                      marginBottom: 10,
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                      {/* Avatar */}
                      <LinearGradient
                        colors={isTop ? [colors.primary, colors.secondary] : [colors.surfaceElevated, colors.surfaceElevated]}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{
                          fontSize: 15,
                          fontWeight: '700',
                          color: isTop ? '#FFFFFF' : colors.textMuted,
                        }}>
                          {getInitials(eleve.nom, eleve.prenoms)}
                        </Text>
                      </LinearGradient>

                      <View>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}>
                          <Text style={{
                            fontSize: 15,
                            fontWeight: '600',
                            color: colors.text,
                            letterSpacing: -0.2,
                          }}>
                            {eleve.prenoms} {eleve.nom}
                          </Text>
                          {isTop && (
                            <View style={{
                              backgroundColor: colors.primaryBg,
                              borderRadius: 6,
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                            }}>
                              <Text style={{
                                fontSize: 8,
                                fontWeight: '700',
                                color: colors.primary,
                                letterSpacing: 0.5,
                              }}>
                                TOP
                              </Text>
                            </View>
                          )}
                          {isBottom && (
                            <View style={{
                              backgroundColor: colors.error + '15',
                              borderRadius: 6,
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                            }}>
                              <Text style={{
                                fontSize: 8,
                                fontWeight: '700',
                                color: colors.error,
                                letterSpacing: 0.5,
                              }}>
                                À AMÉLIORER
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={{
                          fontSize: 11,
                          color: colors.textMuted,
                          marginTop: 2,
                        }}>
                          Matricule: {eleve.matricule}
                        </Text>
                      </View>
                    </View>

                    {eleve.moyenne && (
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{
                          fontSize: 20,
                          fontWeight: '800',
                          color: moyenneColor,
                          letterSpacing: -0.5,
                        }}>
                          {eleve.moyenne.toFixed(1)}
                        </Text>
                        <Text style={{
                          fontSize: 9,
                          color: colors.textMuted,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}>
                          Moyenne
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* ─── NOTES ─── */}
          {activeTab === 'notes' && (
            <View>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 20,
                alignItems: 'center',
              }}>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  backgroundColor: colors.primaryBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Feather name="edit-3" size={28} color={colors.primary} />
                </View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: colors.text,
                  marginBottom: 4,
                }}>
                  Saisie des notes
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginBottom: 16,
                }}>
                  Gérez les notes des {classDetail.effectif} élèves de la classe
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={goToGradeEntry}
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: 14,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <Feather name="plus" size={20} color="#FFFFFF" />
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#FFFFFF',
                  }}>
                    Saisir les notes
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Dernières notes */}
              <View style={{ marginTop: 16 }}>
                <Text style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  marginBottom: 10,
                }}>
                  Dernières évaluations
                </Text>
                <View style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 16,
                }}>
                  <Text style={{
                    fontSize: 13,
                    color: colors.textMuted,
                    textAlign: 'center',
                  }}>
                    Aucune évaluation enregistrée
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ─── PRÉSENCES ─── */}
          {activeTab === 'presences' && (
            <View>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 20,
                alignItems: 'center',
              }}>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  backgroundColor: colors.success + '15',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Feather name="check-square" size={28} color={colors.success} />
                </View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: colors.text,
                  marginBottom: 4,
                }}>
                  Gestion des présences
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginBottom: 16,
                }}>
                  Enregistrez les présences du jour pour la classe
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={goToAttendance}
                  style={{
                    backgroundColor: colors.success,
                    borderRadius: 14,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    shadowColor: colors.success,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <Feather name="check" size={20} color="#FFFFFF" />
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#FFFFFF',
                  }}>
                    Faire l'appel
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Statistiques présences */}
              <View style={{
                flexDirection: 'row',
                gap: 10,
                marginTop: 16,
              }}>
                {[
                  { label: 'Présents', value: '28', color: colors.success, icon: 'user-check' },
                  { label: 'Absents', value: '4', color: colors.error, icon: 'user-x' },
                ].map((stat) => (
                  <View key={stat.label} style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 14,
                    alignItems: 'center',
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      <Feather name={stat.icon as any} size={14} color={stat.color} />
                      <Text style={{
                        fontSize: 20,
                        fontWeight: '800',
                        color: stat.color,
                      }}>
                        {stat.value}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 10,
                      color: colors.textMuted,
                      marginTop: 2,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
};