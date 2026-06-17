// screens/parent/ParentGradesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/animations/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// ─── Tokens ───────────────────────────────────────────────────────────────────
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
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface Grade {
  id: string;
  matiere: string;
  moyenne: number;
  coefficient: number;
  appreciation?: string;
  rang?: number;
  effectif?: number;
}

interface ReportCard {
  id: string;
  periode: string;
  moyenneGenerale: number;
  mention: string;
  matieres: Grade[];
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_REPORT_CARDS: ReportCard[] = [
  {
    id: '1',
    periode: '1er Trimestre 2025-2026',
    moyenneGenerale: 15.5,
    mention: 'BIEN',
    matieres: [
      { id: '1', matiere: 'Mathématiques', moyenne: 14.5, coefficient: 4, appreciation: 'Bon travail', rang: 4, effectif: 32 },
      { id: '2', matiere: 'Français', moyenne: 16.2, coefficient: 4, appreciation: 'Excellent', rang: 2, effectif: 32 },
      { id: '3', matiere: 'Anglais', moyenne: 14.8, coefficient: 3, appreciation: 'Bonne progression', rang: 5, effectif: 32 },
      { id: '4', matiere: 'Physique-Chimie', moyenne: 13.5, coefficient: 3, appreciation: 'Peut mieux faire', rang: 8, effectif: 32 },
      { id: '5', matiere: 'SVT', moyenne: 17.0, coefficient: 2, appreciation: 'Très bon travail', rang: 1, effectif: 32 },
    ],
  },
  {
    id: '2',
    periode: '2ème Trimestre 2025-2026',
    moyenneGenerale: 16.2,
    mention: 'TRES_BIEN',
    matieres: [
      { id: '6', matiere: 'Mathématiques', moyenne: 15.5, coefficient: 4, appreciation: 'Progression', rang: 3, effectif: 32 },
      { id: '7', matiere: 'Français', moyenne: 17.0, coefficient: 4, appreciation: 'Excellent', rang: 1, effectif: 32 },
      { id: '8', matiere: 'Anglais', moyenne: 15.2, coefficient: 3, appreciation: 'Très bien', rang: 4, effectif: 32 },
    ],
  },
  {
    id: '3',
    periode: '3ème Trimestre 2025-2026',
    moyenneGenerale: 17.8,
    mention: 'EXCELLENT',
    matieres: [
      { id: '9', matiere: 'Mathématiques', moyenne: 18.0, coefficient: 4, appreciation: 'Excellent', rang: 1, effectif: 32 },
      { id: '10', matiere: 'Français', moyenne: 17.5, coefficient: 4, appreciation: 'Très bon', rang: 1, effectif: 32 },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const getMentionConfig = (mention: string) => {
  switch (mention) {
    case 'EXCELLENT':
      return { label: 'Excellent', color: C.green, bg: C.greenBg, icon: '🌟' };
    case 'TRES_BIEN':
      return { label: 'Très bien', color: C.blue, bg: C.blueBg, icon: '⭐' };
    case 'BIEN':
      return { label: 'Bien', color: C.accent, bg: C.accentBg, icon: '✨' };
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

// ─── Grade Circle ──────────────────────────────────────────────────────────
const GradeCircle = ({ note, size = 'md' }: { note: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: { container: 36, fontSize: 13 },
    md: { container: 48, fontSize: 17 },
    lg: { container: 60, fontSize: 22 },
  };

  const color = getGradeColor(note);
  const sizeConfig = sizes[size];

  return (
    <MotiView
      from={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      style={{
        width: sizeConfig.container,
        height: sizeConfig.container,
        borderRadius: sizeConfig.container / 2,
        backgroundColor: color + '12',
        borderWidth: 2,
        borderColor: color + '30',
        alignItems: 'center',
        justifyContent: 'center',
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
    </MotiView>
  );
};

// ─── Period Selector ──────────────────────────────────────────────────────
const PeriodSelector = ({
  reports,
  selectedId,
  onSelect,
}: {
  reports: ReportCard[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingHorizontal: 16, paddingBottom: 16 }}
      contentContainerStyle={{ marginHorizontal: 4 }}
    >
      {reports.map((report) => {
        const isActive = selectedId === report.id;
        const mentionConfig = getMentionConfig(report.mention);

        return (
          <TouchableOpacity
            key={report.id}
            activeOpacity={0.7}
            onPress={() => onSelect(report.id)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 14,
              backgroundColor: isActive ? C.accent : C.surface,
              borderWidth: 1,
              borderColor: isActive ? C.accent : C.border,
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: isActive ? '700' : '600',
                color: isActive ? '#FFFFFF' : C.textSecondary,
                letterSpacing: 0.2,
              }}
            >
              {report.periode}
            </Text>
            {isActive && (
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#FFFFFF',
                  marginLeft: 6,
                }}
              />
            )}
            <Text
              style={{
                fontSize: 10,
                color: isActive ? 'rgba(255,255,255,0.6)' : C.textMuted,
                marginLeft: 6,
              }}
            >
              {mentionConfig.icon}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// ─── Grade Item ────────────────────────────────────────────────────────────
const GradeItem = ({ grade, index }: { grade: Grade; index: number }) => {
  const color = getGradeColor(grade.moyenne);
  const level = getGradeLevel(grade.moyenne);

  return (
    <MotiView
      from={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 300, delay: 150 + index * 40 }}
    >
      <View
        style={{
          backgroundColor: C.surfaceAlt,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: C.border,
          padding: 14,
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {/* Indicateur latéral */}
        <View
          style={{
            width: 3,
            height: 36,
            borderRadius: 2,
            backgroundColor: color,
            marginRight: 12,
          }}
        />

        {/* Infos matière */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: C.textPrimary,
                letterSpacing: -0.2,
                marginRight: 8,
              }}
            >
              {grade.matiere}
            </Text>
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 6,
                backgroundColor: C.accentBg,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '600',
                  color: C.accentDim,
                  letterSpacing: 0.3,
                }}
              >
                Coef. {grade.coefficient}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Text style={{ fontSize: 11, color: C.textMuted, marginRight: 10 }}>
              {level}
            </Text>
            {grade.rang && grade.effectif && (
              <>
                <View
                  style={{
                    width: 2,
                    height: 2,
                    borderRadius: 1,
                    backgroundColor: C.textMuted,
                    marginRight: 10,
                  }}
                />
                <Text style={{ fontSize: 11, color: C.textMuted }}>
                  Rang #{grade.rang}/{grade.effectif}
                </Text>
              </>
            )}
          </View>

          {grade.appreciation && (
            <Text
              style={{
                fontSize: 11,
                color: C.textDim,
                marginTop: 4,
                fontStyle: 'italic',
              }}
            >
              "{grade.appreciation}"
            </Text>
          )}
        </View>

        {/* Note */}
        <GradeCircle note={grade.moyenne} size="md" />
      </View>
    </MotiView>
  );
};

// ─── Screen ─────────────────────────────────────────────────────────────────
export const ParentGradesScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(MOCK_REPORT_CARDS[0]?.id || '');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  const currentReport = MOCK_REPORT_CARDS.find(r => r.id === selectedPeriod);
  const mentionConfig = currentReport ? getMentionConfig(currentReport.mention) : null;
  const totalCoef = currentReport?.matieres.reduce((acc, m) => acc + m.coefficient, 0) || 0;

  const initials = `${user.prenoms?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
      >
        {/* ───── Header ───── */}
        <View
          style={{
            backgroundColor: C.surface,
            paddingTop: 56,
            paddingBottom: 28,
            paddingHorizontal: 22,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Halos décoratifs */}
          <View
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              backgroundColor: 'rgba(99,102,241,0.06)',
              borderRadius: 100,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -30,
              left: -20,
              width: 140,
              height: 140,
              backgroundColor: 'rgba(52,211,153,0.04)',
              borderRadius: 70,
            }}
          />

          {/* Top bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: C.surfaceAlt,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: C.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Feather name="arrow-left" size={20} color={C.textSecondary} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 2.5,
                  color: C.accent,
                  textTransform: 'uppercase',
                }}
              >
                ✦ SURYA
              </Text>
            </View>

            <LinearGradient
              colors={['#3730A3', '#6366F1']}
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#C7D2FE' }}>
                {initials}
              </Text>
            </LinearGradient>
          </View>

          {/* Titre */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#E8EAF0',
              letterSpacing: -0.3,
            }}
          >
            Notes & bulletins
          </Text>
          <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 4, letterSpacing: 0.2 }}>
            Suivez les performances de vos enfants
          </Text>
        </View>

        {/* ───── Sélecteur de période ───── */}
        {MOCK_REPORT_CARDS.length > 0 && (
          <PeriodSelector
            reports={MOCK_REPORT_CARDS}
            selectedId={selectedPeriod}
            onSelect={setSelectedPeriod}
          />
        )}

        {/* ───── Contenu ───── */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
          {currentReport && mentionConfig ? (
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* ───── Carte résumé ───── */}
              <View style={{ marginBottom: 20 }}>
                <Card
                  variant="elevated"
                  padding="lg"
                  glow
                >
                  {/* Bandeau supérieur */}
                  <LinearGradient
                    colors={[mentionConfig.color + '20', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                    }}
                  />

                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: C.textSecondary,
                        letterSpacing: 0.3,
                      }}
                    >
                      {currentReport.periode}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                      {/* Moyenne */}
                      <View style={{ alignItems: 'center', marginRight: 24 }}>
                        <Text style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '600' }}>
                          Moyenne
                        </Text>
                        <View
                          style={{
                            marginTop: 4,
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: mentionConfig.bg,
                            borderWidth: 2,
                            borderColor: mentionConfig.color + '40',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: '800',
                              color: mentionConfig.color,
                              letterSpacing: -0.5,
                            }}
                          >
                            {currentReport.moyenneGenerale.toFixed(1)}
                          </Text>
                          <Text
                            style={{
                              fontSize: 8,
                              color: mentionConfig.color + '80',
                              fontWeight: '600',
                            }}
                          >
                            /20
                          </Text>
                        </View>
                      </View>

                      {/* Séparateur */}
                      <View
                        style={{
                          width: 1,
                          height: 50,
                          backgroundColor: C.border,
                          marginRight: 24,
                        }}
                      />

                      {/* Mention */}
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '600' }}>
                          Mention
                        </Text>
                        <View style={{ marginTop: 4 }}>
                          <Badge
                            text={`${mentionConfig.icon} ${mentionConfig.label}`}
                            variant={
                              currentReport.mention === 'EXCELLENT' ? 'success' :
                              currentReport.mention === 'TRES_BIEN' ? 'info' :
                              currentReport.mention === 'BIEN' ? 'primary' :
                              currentReport.mention === 'ASSEZ_BIEN' ? 'warning' : 'error'
                            }
                            size="md"
                            glow
                          />
                        </View>
                        <Text style={{ fontSize: 10, color: C.textDim, marginTop: 4 }}>
                          {totalCoef} coefficients
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              </View>

              {/* ───── Détail des matières ───── */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: C.textSecondary,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Détail des matières
                </Text>
                <Text style={{ fontSize: 11, color: C.textMuted }}>
                  {currentReport.matieres.length} matières
                </Text>
              </View>

              {currentReport.matieres.map((matiere, index) => (
                <GradeItem key={matiere.id} grade={matiere} index={index} />
              ))}

              {/* ───── Bouton téléchargement ───── */}
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
                <Feather name="download" size={18} color={C.accentDim} style={{ marginRight: 10 }} />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: C.accentDim,
                    letterSpacing: 0.2,
                  }}
                >
                  Télécharger le bulletin
                </Text>
              </TouchableOpacity>
            </MotiView>
          ) : (
            <EmptyState
              title="Aucun bulletin"
              description="Aucun bulletin n'est disponible pour le moment"
              icon="book-open"
              variant="default"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};