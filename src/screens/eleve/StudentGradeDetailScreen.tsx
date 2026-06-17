// screens/eleve/StudentGradeDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
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
interface GradeDetail {
  id: string;
  periode: string;
  dateEmission: string;
  moyenneGenerale: number;
  mention: string;
  rang: number;
  effectifClasse: number;
  appreciation: string;
  matieres: {
    id: string;
    nom: string;
    moyenne: number;
    coefficient: number;
    appreciation: string;
    notes: {
      examen: string;
      note: number;
      coefficient: number;
    }[];
  }[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_GRADE_DETAIL: GradeDetail = {
  id: '1',
  periode: '1er Trimestre 2025-2026',
  dateEmission: '2025-12-15',
  moyenneGenerale: 15.5,
  mention: 'BIEN',
  rang: 3,
  effectifClasse: 32,
  appreciation: 'Bon trimestre, encourageant mais peut mieux faire. Continuez vos efforts !',
  matieres: [
    {
      id: '1',
      nom: 'Mathématiques',
      moyenne: 14.5,
      coefficient: 4,
      appreciation: 'Bon travail, participation active',
      notes: [
        { examen: 'Devoir 1', note: 13, coefficient: 1 },
        { examen: 'Devoir 2', note: 15, coefficient: 1 },
        { examen: 'Examen Trimestriel', note: 15, coefficient: 2 },
      ],
    },
    {
      id: '2',
      nom: 'Français',
      moyenne: 16.2,
      coefficient: 4,
      appreciation: 'Excellente expression écrite',
      notes: [
        { examen: 'Devoir 1', note: 15, coefficient: 1 },
        { examen: 'Devoir 2', note: 16, coefficient: 1 },
        { examen: 'Examen Trimestriel', note: 17, coefficient: 2 },
      ],
    },
    {
      id: '3',
      nom: 'Anglais',
      moyenne: 14.8,
      coefficient: 3,
      appreciation: 'Bonne progression',
      notes: [
        { examen: 'Devoir 1', note: 14, coefficient: 1 },
        { examen: 'Examen Trimestriel', note: 15, coefficient: 2 },
      ],
    },
    {
      id: '4',
      nom: 'Physique-Chimie',
      moyenne: 13.5,
      coefficient: 3,
      appreciation: 'Peut mieux faire, travaillez la méthodologie',
      notes: [
        { examen: 'Devoir 1', note: 12, coefficient: 1 },
        { examen: 'Devoir 2', note: 14, coefficient: 1 },
        { examen: 'Examen Trimestriel', note: 14, coefficient: 2 },
      ],
    },
    {
      id: '5',
      nom: 'SVT',
      moyenne: 17.0,
      coefficient: 2,
      appreciation: 'Très bon travail, excellentes connaissances',
      notes: [
        { examen: 'Devoir 1', note: 16, coefficient: 1 },
        { examen: 'Examen Trimestriel', note: 18, coefficient: 2 },
      ],
    },
  ],
};

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
export const StudentGradeDetailScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [gradeDetail] = useState(MOCK_GRADE_DETAIL);
  const [expandedMatiere, setExpandedMatiere] = useState<string | null>(null);

  // Animations
  const summaryScale = useRef(new Animated.Value(0.95)).current;
  const summaryOpacity = useRef(new Animated.Value(0)).current;

  const matiereAnimations = gradeDetail.matieres.map(() => ({
    translateX: useRef(new Animated.Value(-10)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    // Animation de la carte résumé
    Animated.parallel([
      Animated.spring(summaryScale, {
        toValue: 1,
        damping: 25,
        useNativeDriver: true,
      }),
      Animated.timing(summaryOpacity, {
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
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Bulletin ${gradeDetail.periode}\nMoyenne: ${gradeDetail.moyenneGenerale.toFixed(1)}/20\nMention: ${gradeDetail.mention}\nRang: ${gradeDetail.rang}/${gradeDetail.effectifClasse}`,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le bulletin');
    }
  };

  const mentionConfig = getMentionConfig(gradeDetail.mention);
  const totalCoef = gradeDetail.matieres.reduce((acc, m) => acc + m.coefficient, 0);

  // Animation pour l'expansion
  const getExpandStyle = (isExpanded: boolean) => {
    return {
      maxHeight: isExpanded ? 500 : 0,
      opacity: isExpanded ? 1 : 0,
    };
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
                Détail du bulletin
              </Text>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}>
                {gradeDetail.periode}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleShare}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Feather name="share-2" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={{
            flexDirection: 'row',
            marginTop: 16,
          }}>
            {[
              { label: 'Moyenne', value: gradeDetail.moyenneGenerale.toFixed(1), icon: 'trending-up', suffix: '/20' },
              { label: 'Rang', value: `${gradeDetail.rang}`, icon: 'award', suffix: `/${gradeDetail.effectifClasse}` },
              { label: 'Matières', value: gradeDetail.matieres.length.toString(), icon: 'book-open' },
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
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}>
                    {stat.value}
                    {stat.suffix && (
                      <Text style={{
                        fontSize: 10,
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: '400',
                      }}>
                        {stat.suffix}
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ───── Contenu ────────────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 40 }}>

          {/* ───── Carte résumé ────────────────────────────────────────────────── */}
          <Animated.View
            style={{
              backgroundColor: C.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: C.border,
              padding: 20,
              marginBottom: 24,
              transform: [{ scale: summaryScale }],
              opacity: summaryOpacity,
            }}
          >
            {/* Bandeau supérieur coloré */}
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

            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 12,
                color: C.textMuted,
                marginTop: 8,
              }}>
                Émis le {gradeDetail.dateEmission}
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
                      {gradeDetail.moyenneGenerale.toFixed(1)}
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

                {/* Mention & Rang */}
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

              {/* Appréciation */}
              {gradeDetail.appreciation && (
                <View style={{
                  marginTop: 16,
                  padding: 14,
                  backgroundColor: C.surfaceAlt,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: C.border,
                  width: '100%',
                }}>
                  <Text style={{
                    fontSize: 13,
                    color: C.textSecondary,
                    fontStyle: 'italic',
                    textAlign: 'center',
                    lineHeight: 20,
                  }}>
                    "{gradeDetail.appreciation}"
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* ───── Détail des matières ──────────────────────────────────────────── */}
          <SectionTitle>Détail des matières</SectionTitle>

          {gradeDetail.matieres.map((matiere, index) => {
            const color = getGradeColor(matiere.moyenne);
            const level = getGradeLevel(matiere.moyenne);
            const isExpanded = expandedMatiere === matiere.id;
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
                  backgroundColor: C.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isExpanded ? C.accent : C.border,
                  overflow: 'hidden',
                }}>
                  {/* ─── En-tête matière ──────────────────────────────────────── */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setExpandedMatiere(isExpanded ? null : matiere.id)}
                    style={{ padding: 14 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {/* Indicateur latéral */}
                      <View style={{
                        width: 3,
                        height: 36,
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
                            {matiere.nom}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Text style={{
                              fontSize: 10,
                              color: C.textMuted,
                            }}>
                              Coef. {matiere.coefficient}
                            </Text>
                            <GradeCircle note={matiere.moyenne} size="sm" />
                          </View>
                        </View>

                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 4,
                        }}>
                          <Text style={{
                            fontSize: 11,
                            color: color,
                            fontWeight: '600',
                          }}>
                            {level}
                          </Text>
                          {matiere.appreciation && (
                            <>
                              <View style={{
                                width: 3,
                                height: 3,
                                borderRadius: 1.5,
                                backgroundColor: C.textMuted,
                                marginHorizontal: 10,
                              }} />
                              <Text style={{
                                fontSize: 11,
                                color: C.textMuted,
                                fontStyle: 'italic',
                              }}>
                                {matiere.appreciation}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>

                      <Feather
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={C.textMuted}
                        style={{ marginLeft: 10 }}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* ─── Détail des notes (expansé) ────────────────────────────── */}
                  {isExpanded && matiere.notes.length > 0 && (
                    <Animated.View
                      style={{
                        paddingHorizontal: 16,
                        paddingBottom: 14,
                        borderTopWidth: 1,
                        borderTopColor: C.border,
                        paddingTop: 12,
                        maxHeight: 500,
                        opacity: 1,
                      }}
                    >
                      <Text style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: C.textMuted,
                        textTransform: 'uppercase',
                        letterSpacing: 0.8,
                        marginBottom: 8,
                      }}>
                        Évaluations
                      </Text>
                      {matiere.notes.map((note, idx) => (
                        <View key={idx} style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          backgroundColor: C.surfaceAlt,
                          borderRadius: 10,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          marginBottom: 4,
                        }}>
                          <Text style={{
                            fontSize: 12,
                            color: C.textSecondary,
                          }}>
                            {note.examen}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{
                              fontSize: 13,
                              fontWeight: '700',
                              color: getGradeColor(note.note),
                            }}>
                              {note.note}
                            </Text>
                            <Text style={{
                              fontSize: 10,
                              color: C.textMuted,
                            }}>
                              coef {note.coefficient}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </Animated.View>
                  )}
                </View>
              </Animated.View>
            );
          })}

          {/* ───── Boutons d'action ────────────────────────────────────────────── */}
          <View style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: 16,
          }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleShare}
              style={{
                flex: 1,
                backgroundColor: C.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: C.border,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="share-2" size={18} color={C.accentDim} />
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: C.accentDim,
                letterSpacing: 0.2,
                marginLeft: 10,
              }}>
                Partager
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: C.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: C.border,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
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
                Télécharger
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};