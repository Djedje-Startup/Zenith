// components/zenith/GradeCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export interface Grade {
  id: string;
  matiere: string;
  moyenne: number;
  coefficient: number;
  appreciation?: string;
  rang?: number;
  effectif?: number;
  credits?: number;
}

interface GradeCardProps {
  grades: Grade[];
  moyenneGenerale: number;
  mention: string;
  periode: string;
  onPressGrade?: (grade: Grade) => void;
  onPressBulletin?: () => void;
  className?: string;
}

// Palette de couleurs premium
const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  borderSub: '#141720',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.08)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.08)',
  emerald: '#10B981',
  emeraldBg: 'rgba(16,185,129,0.08)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.08)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.08)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.08)',
  orange: '#FB923C',
  orangeBg: 'rgba(251,146,60,0.08)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.08)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

const { width: screenWidth } = Dimensions.get('window');

// Configuration des mentions
const MENTION_CONFIG = {
  EXCELLENT: {
    label: 'Excellent',
    color: C.green,
    bg: C.greenBg,
    gradient: ['#34D399', '#10B981'] as const,
    icon: '🌟',
    variant: 'success' as const,
  },
  TRES_BIEN: {
    label: 'Très bien',
    color: C.blue,
    bg: C.blueBg,
    gradient: ['#60A5FA', '#3B82F6'] as const,
    icon: '⭐',
    variant: 'info' as const,
  },
  BIEN: {
    label: 'Bien',
    color: C.purple,
    bg: C.purpleBg,
    gradient: ['#A78BFA', '#8B5CF6'] as const,
    icon: '✨',
    variant: 'primary' as const,
  },
  ASSEZ_BIEN: {
    label: 'Assez bien',
    color: C.amber,
    bg: C.amberBg,
    gradient: ['#FBBF24', '#F59E0B'] as const,
    icon: '📈',
    variant: 'warning' as const,
  },
  PASSABLE: {
    label: 'Passable',
    color: C.orange,
    bg: C.orangeBg,
    gradient: ['#FB923C', '#F97316'] as const,
    icon: '📊',
    variant: 'warning' as const,
  },
  INSUFFISANT: {
    label: 'Insuffisant',
    color: C.red,
    bg: C.redBg,
    gradient: ['#EF4444', '#DC2626'] as const,
    icon: '⚠️',
    variant: 'error' as const,
  },
};

const getMentionConfig = (mention: string) => {
  return MENTION_CONFIG[mention as keyof typeof MENTION_CONFIG] || MENTION_CONFIG.INSUFFISANT;
};

// Configuration des couleurs de notes
const getGradeColor = (note: number) => {
  if (note >= 16) return { color: C.green, bg: C.greenBg, label: 'Excellent' };
  if (note >= 14) return { color: C.blue, bg: C.blueBg, label: 'Très bien' };
  if (note >= 12) return { color: C.purple, bg: C.purpleBg, label: 'Bien' };
  if (note >= 10) return { color: C.amber, bg: C.amberBg, label: 'Passable' };
  return { color: C.red, bg: C.redBg, label: 'Insuffisant' };
};

// Composant pour le cercle de note
const GradeCircle = ({ note, size = 'md' }: { note: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: { container: 32, fontSize: 11 },
    md: { container: 44, fontSize: 14 },
    lg: { container: 56, fontSize: 18 },
  };

  const sizeConfig = sizes[size];
  const gradeColor = getGradeColor(note);

  return (
    <MotiView
      from={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, mass: 0.8 }}
      style={{
        width: sizeConfig.container,
        height: sizeConfig.container,
        borderRadius: sizeConfig.container / 2,
        backgroundColor: gradeColor.bg,
        borderWidth: 2,
        borderColor: gradeColor.color + '30',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontWeight: '700',
          fontSize: sizeConfig.fontSize,
          color: gradeColor.color,
        }}
      >
        {note.toFixed(1)}
      </Text>
    </MotiView>
  );
};

// Composant pour la barre de progression
const ProgressBar = ({ value, color }: { value: number; color: string }) => (
  <View
    style={{
      height: 2,
      flex: 1,
      backgroundColor: C.border,
      borderRadius: 1,
      overflow: 'hidden',
    }}
  >
    <MotiView
      from={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ type: 'timing', duration: 800, delay: 300 }}
      style={{
        height: 2,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
  </View>
);

// Composant pour un élément de note
const GradeItem = ({
  grade,
  index,
  onPress,
}: {
  grade: Grade;
  index: number;
  onPress?: (grade: Grade) => void;
}) => {
  const gradeColor = getGradeColor(grade.moyenne);
  const notePercentage = Math.min((grade.moyenne / 20) * 100, 100);

  return (
    <MotiView
      from={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 300, delay: 150 + index * 40 }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress?.(grade)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
          backgroundColor: C.surfaceAlt,
          borderWidth: 1,
          borderColor: C.border,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 14,
          gap: 12,
        }}>
          {/* Indicateur de performance */}
          <View
            style={{
              width: 3,
              height: 32,
              borderRadius: 2,
              backgroundColor: gradeColor.color,
            }}
          />

          {/* Infos matière */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.textPrimary }}>
                {grade.matiere}
              </Text>
              <View
                style={{
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 12,
                  backgroundColor: C.accentBg,
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: '500', color: C.accentDim }}>
                  Coef. {grade.coefficient}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
              <ProgressBar value={notePercentage} color={gradeColor.color} />
              {grade.rang && grade.effectif && (
                <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                  #{grade.rang}/{grade.effectif}
                </Text>
              )}
            </View>

            {grade.appreciation && (
              <Text style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>
                {grade.appreciation}
              </Text>
            )}
          </View>

          {/* Note */}
          <GradeCircle note={grade.moyenne} size="sm" />

          {/* Icône de crédits */}
          {grade.credits && (
            <View
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                paddingHorizontal: 4,
                paddingVertical: 1,
                borderRadius: 4,
                backgroundColor: 'rgba(99,102,241,0.06)',
              }}
            >
              <Text style={{ fontSize: 8, fontWeight: '500', color: C.textMuted }}>
                {grade.credits} crédits
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

// Composant principal
export const GradeCard: React.FC<GradeCardProps> = ({
  grades,
  moyenneGenerale,
  mention,
  periode,
  onPressGrade,
  onPressBulletin,
  className,
}) => {
  const mentionConfig = getMentionConfig(mention);
  const gradeCount = grades.length;
  const avgRounded = moyenneGenerale.toFixed(2);

  return (
    <View style={{ marginBottom: 16 }}>
      <Card
        variant="elevated"
        padding="md"
        glow
      >
        {/* En-tête avec dégradé */}
        <LinearGradient
          colors={['rgba(99,102,241,0.04)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 120,
            borderRadius: 16,
          }}
        />

        <View style={{ position: 'relative' }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary }}>
                  {periode}
                </Text>
                <Badge
                  text={`${gradeCount} matières`}
                  variant="primary"
                  size="sm"
                />
              </View>
              <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                Bulletin scolaire
              </Text>
            </View>

            <TouchableOpacity
              onPress={onPressBulletin}
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: C.accentBg,
              }}
            >
              <Feather name="download" size={18} color={C.accentDim} />
            </TouchableOpacity>
          </View>

          {/* Moyenne générale */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ position: 'relative' }}>
              {/* Anneau de progression */}
              <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 100, damping: 20 }}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  backgroundColor: mentionConfig.bg,
                  borderWidth: 3,
                  borderColor: mentionConfig.color + '40',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 24, fontWeight: '700', color: mentionConfig.color }}>
                  {avgRounded}
                </Text>
                <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                  / 20
                </Text>
              </MotiView>

              {/* Icône mention */}
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: C.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <Text style={{ fontSize: 14 }}>{mentionConfig.icon}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <Badge
                text={mentionConfig.label}
                variant={mentionConfig.variant}
                size="md"
                glow
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: mentionConfig.color,
                  }}
                />
                <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                  {grades.reduce((acc, g) => acc + g.coefficient, 0)} coefficients
                </Text>
              </View>
            </View>
          </View>

          {/* Liste des notes */}
          <View style={{ gap: 10, marginTop: 4 }}>
            {grades.map((grade, index) => (
              <GradeItem
                key={grade.id}
                grade={grade}
                index={index}
                onPress={onPressGrade}
              />
            ))}
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="bar-chart-2" size={14} color={C.textMuted} />
              <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                {gradeCount} matières évaluées
              </Text>
            </View>

            <TouchableOpacity
              onPress={onPressBulletin}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Text style={{ fontSize: 10, fontWeight: '500', color: C.accentDim }}>
                Voir le bulletin
              </Text>
              <Feather name="chevron-right" size={14} color={C.accentDim} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </View>
  );
};