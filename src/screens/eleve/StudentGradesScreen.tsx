// screens/eleve/StudentGradesScreen.tsx
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
interface Grade {
  id: string;
  matiere: string;
  moyenne: number;
  coefficient: number;
  appreciation?: string;
}

interface ReportCard {
  id: string;
  periode: string;
  moyenneGenerale: number;
  mention: string;
  matieres: Grade[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_REPORT_CARDS: ReportCard[] = [
  {
    id: '1',
    periode: '1er Trimestre 2025-2026',
    moyenneGenerale: 15.5,
    mention: 'BIEN',
    matieres: [
      { id: '1', matiere: 'Mathématiques', moyenne: 14.5, coefficient: 4, appreciation: 'Bon travail' },
      { id: '2', matiere: 'Français', moyenne: 16.2, coefficient: 4, appreciation: 'Excellent' },
      { id: '3', matiere: 'Anglais', moyenne: 14.8, coefficient: 3, appreciation: 'Bonne progression' },
      { id: '4', matiere: 'Physique-Chimie', moyenne: 13.5, coefficient: 3, appreciation: 'Peut mieux faire' },
      { id: '5', matiere: 'SVT', moyenne: 17.0, coefficient: 2, appreciation: 'Très bon travail' },
    ],
  },
  {
    id: '2',
    periode: '2ème Trimestre 2025-2026',
    moyenneGenerale: 16.2,
    mention: 'TRES_BIEN',
    matieres: [
      { id: '6', matiere: 'Mathématiques', moyenne: 15.5, coefficient: 4, appreciation: 'Progression' },
      { id: '7', matiere: 'Français', moyenne: 17.0, coefficient: 4, appreciation: 'Excellent' },
      { id: '8', matiere: 'Anglais', moyenne: 15.2, coefficient: 3, appreciation: 'Très bien' },
    ],
  },
  {
    id: '3',
    periode: '3ème Trimestre 2025-2026',
    moyenneGenerale: 17.8,
    mention: 'EXCELLENT',
    matieres: [
      { id: '9', matiere: 'Mathématiques', moyenne: 18.0, coefficient: 4, appreciation: 'Excellent' },
      { id: '10', matiere: 'Français', moyenne: 17.5, coefficient: 4, appreciation: 'Très bon' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getMentionConfig = (mention: string) => {
  switch (mention) {
    case 'EXCELLENT':
      return { label: 'Excellent', color: C.green, bg: C.greenBg, icon: '⭐' };
    case 'TRES_BIEN':
      return { label: 'Très bien', color: C.blue, bg: C.blueBg, icon: '⭐' };
    case 'BIEN':
      return { label: 'Bien', color: C.accent, bg: C.accentBg, icon: '✦' };
    case 'ASSEZ_BIEN':
      return { label: 'Assez bien', color: C.amber, bg: C.amberBg, icon: '📈' };
    default:
      return { label: 'Insuffisant', color: C.red, bg: C.redBg, icon: '⚠️' };
  }
};

const getGradeColor = (note: number) => {
  if (note >= 16) return C.green;
  if (note >= 14) return C.blue;
  if (note >= 12) return C.accent;
  if (note >= 10) return C.amber;
  return C.red;
};

const getGradeLevel = (note: number) => {
  if (note >= 16) return 'Excellent';
  if (note >= 14) return 'Très bien';
  if (note >= 12) return 'Bien';
  if (note >= 10) return 'Passable';
  return 'Insuffisant';
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
        {count} matière{count > 1 ? 's' : ''}
      </Text>
    )}
  </View>
);

const GradeCircle = ({ note, size = 'md' }: { note: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: { container: 36, fontSize: 13 },
    md: { container: 48, fontSize: 17 },
    lg: { container: 60, fontSize: 22 },
  };

  const color = getGradeColor(note);
  const sizeConfig = sizes[size];

  // Animation
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 20,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: sizeConfig.container,
        height: sizeConfig.container,
        borderRadius: sizeConfig.container / 2,
        backgroundColor: color + '15',
        borderWidth: 2,
        borderColor: color + '30',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale }],
        opacity: opacity,
      }}
    >
      <Text
        style={{
          fontWeight: '700',
          fontSize: sizeConfig.fontSize,
          color: color,
        }}
      >
        {note.toFixed(1)}
      </Text>
    </Animated.View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────
export const StudentGradesScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(MOCK_REPORT_CARDS[0].id);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const currentReport = MOCK_REPORT_CARDS.find(r => r.id === selectedPeriod);
  const mentionConfig = currentReport ? getMentionConfig(currentReport.mention) : null;
  const totalCoef = currentReport?.matieres.reduce((acc, m) => acc + m.coefficient, 0) || 0;

  // Animations
  const contentScale = useRef(new Animated.Value(0.95)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const matiereAnimations = currentReport?.matieres.map(() => ({
    translateX: useRef(new Animated.Value(-10)).current,
    opacity: useRef(new Animated.Value(0)).current,
  })) || [];

  useEffect(() => {
    // Animation du contenu
    Animated.parallel([
      Animated.spring(contentScale, {
        toValue: 1,
        damping: 25,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animations des matières (décalées)
    matiereAnimations.forEach((anim, index) => {
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
  }, [selectedPeriod]);

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
                Mes notes
              </Text>
            </View>
            {currentReport && (
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
                  Moyenne
                </Text>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#FFFFFF',
                }}>
                  {currentReport.moyenneGenerale.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          {/* Stats */}
          {currentReport && (
            <View style={{
              flexDirection: 'row',
              marginTop: 16,
            }}>
              {[
                { label: 'Matières', value: currentReport.matieres.length.toString(), icon: 'book-open' },
                { label: 'Coefficients', value: totalCoef.toString(), icon: 'layers' },
                { label: 'Mention', value: mentionConfig?.label || '—', icon: 'award' },
              ].map((stat, index) => (
                <View key={stat.label} style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: index < 2 ? 10 : 0,
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
                      fontSize: 13,
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

        {/* ───── Sélecteur de période ──────────────────────────────────────────── */}
        {MOCK_REPORT_CARDS.length > 0 && (
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
              {MOCK_REPORT_CARDS.map((report) => {
                const isActive = selectedPeriod === report.id;
                const config = getMentionConfig(report.mention);
                return (
                  <TouchableOpacity
                    key={report.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedPeriod(report.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 14,
                      backgroundColor: isActive ? C.accent : C.surfaceAlt,
                      borderWidth: 1,
                      borderColor: isActive ? C.accent : C.border,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: 4,
                    }}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontWeight: isActive ? '700' : '600',
                      color: isActive ? '#FFFFFF' : C.textSecondary,
                      letterSpacing: 0.2,
                    }}>
                      {report.periode}
                    </Text>
                    {isActive && (
                      <View style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#FFFFFF',
                        marginLeft: 8,
                      }} />
                    )}
                    <Text style={{
                      fontSize: 10,
                      color: isActive ? 'rgba(255,255,255,0.6)' : C.textMuted,
                      marginLeft: 6,
                    }}>
                      {config.icon}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ───── Contenu ────────────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 40 }}>
          {currentReport && mentionConfig ? (
            <Animated.View
              style={{
                transform: [{ scale: contentScale }],
                opacity: contentOpacity,
              }}
            >
              {/* ───── Carte résumé ────────────────────────────────────────────── */}
              <View style={{
                backgroundColor: C.surface,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: C.border,
                padding: 20,
                marginBottom: 24,
                alignItems: 'center',
              }}>
                {/* Bandeau supérieur */}
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: mentionConfig.color,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }} />

                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: C.textSecondary,
                  letterSpacing: 0.3,
                  marginTop: 8,
                }}>
                  {currentReport.periode}
                </Text>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                  {/* Moyenne */}
                  <View style={{ alignItems: 'center', marginRight: 32 }}>
                    <Text style={{
                      fontSize: 10,
                      color: C.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      fontWeight: '600',
                    }}>
                      Moyenne
                    </Text>
                    <View style={{
                      marginTop: 6,
                      width: 72,
                      height: 72,
                      borderRadius: 36,
                      backgroundColor: mentionConfig.bg,
                      borderWidth: 2,
                      borderColor: mentionConfig.color + '40',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Text style={{
                        fontSize: 24,
                        fontWeight: '800',
                        color: mentionConfig.color,
                        letterSpacing: -0.5,
                      }}>
                        {currentReport.moyenneGenerale.toFixed(1)}
                      </Text>
                      <Text style={{
                        fontSize: 9,
                        color: mentionConfig.color + '80',
                        fontWeight: '600',
                      }}>
                        /20
                      </Text>
                    </View>
                  </View>

                  {/* Séparateur */}
                  <View style={{
                    width: 1,
                    height: 60,
                    backgroundColor: C.border,
                    marginRight: 32,
                  }} />

                  {/* Mention */}
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{
                      fontSize: 10,
                      color: C.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      fontWeight: '600',
                    }}>
                      Mention
                    </Text>
                    <View style={{
                      marginTop: 6,
                      backgroundColor: mentionConfig.bg,
                      borderRadius: 10,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: mentionConfig.color + '30',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: mentionConfig.color,
                        letterSpacing: 0.3,
                      }}>
                        {mentionConfig.icon} {mentionConfig.label}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 10,
                      color: C.textDim,
                      marginTop: 4,
                    }}>
                      {totalCoef} coefficients
                    </Text>
                  </View>
                </View>
              </View>

              {/* ───── Détail des matières ────────────────────────────────────── */}
              <SectionTitle count={currentReport.matieres.length}>
                Détail des matières
              </SectionTitle>

              {currentReport.matieres.map((matiere, index) => {
                const color = getGradeColor(matiere.moyenne);
                const level = getGradeLevel(matiere.moyenne);
                const anim = matiereAnimations[index] || matiereAnimations[0];

                return (
                  <Animated.View
                    key={matiere.id}
                    style={{
                      marginBottom: 10,
                      transform: [{ translateX: anim.translateX }],
                      opacity: anim.opacity,
                    }}
                  >
                    <View style={{
                      backgroundColor: C.surfaceAlt,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: C.border,
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      {/* Indicateur latéral */}
                      <View style={{
                        width: 3,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: color,
                        marginRight: 12,
                      }} />

                      <View style={{ flex: 1 }}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <Text style={{
                            fontSize: 15,
                            fontWeight: '700',
                            color: C.textPrimary,
                            letterSpacing: -0.2,
                          }}>
                            {matiere.matiere}
                          </Text>
                          <GradeCircle note={matiere.moyenne} size="sm" />
                        </View>

                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 4,
                        }}>
                          <Text style={{
                            fontSize: 11,
                            color: C.textMuted,
                            marginRight: 12,
                          }}>
                            Coef. {matiere.coefficient}
                          </Text>
                          <View style={{
                            width: 3,
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: C.textMuted,
                            marginRight: 12,
                          }} />
                          <Text style={{
                            fontSize: 11,
                            color: color,
                            fontWeight: '600',
                          }}>
                            {level}
                          </Text>
                        </View>

                        {matiere.appreciation && (
                          <Text style={{
                            fontSize: 11,
                            color: C.textDim,
                            marginTop: 6,
                            fontStyle: 'italic',
                          }}>
                            "{matiere.appreciation}"
                          </Text>
                        )}
                      </View>
                    </View>
                  </Animated.View>
                );
              })}

              {/* ───── Bouton de téléchargement ───────────────────────────────── */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor: C.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: C.border,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 16,
                }}
              >
                <Feather name="download" size={18} color={C.accentDim} />
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: C.accentDim,
                  letterSpacing: 0.2,
                  marginLeft: 10,
                }}>
                  Télécharger le bulletin
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
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
                <Feather name="book-open" size={36} color={C.accentDim} />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: C.textPrimary,
              }}>
                Aucun bulletin
              </Text>
              <Text style={{
                fontSize: 13,
                color: C.textMuted,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Aucun bulletin n'est disponible pour le moment
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};