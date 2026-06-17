// components/zenith/TimetableCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export interface TimetableEntry {
  id: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  professeur: string;
  salle: string;
  type?: 'CM' | 'TD' | 'TP' | 'EXAMEN' | 'DEVOIR';
  color?: string;
}

interface TimetableCardProps {
  entries: TimetableEntry[];
  dayName: string;
  dayNumber: number;
  isToday?: boolean;
  onPressEntry?: (entry: TimetableEntry) => void;
  onPressDay?: () => void;
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
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.08)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.08)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.08)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.08)',
  pink: '#F472B6',
  pinkBg: 'rgba(244,114,182,0.08)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

const { width: screenWidth } = Dimensions.get('window');

// Configurations des types de cours (sans emojis)
const TYPE_CONFIG = {
  CM: {
    label: 'CM',
    gradient: ['#6366F1', '#8B5CF6'] as const,
    bg: 'rgba(99,102,241,0.10)',
    text: '#818CF8',
    icon: 'book-open',
  },
  TD: {
    label: 'TD',
    gradient: ['#34D399', '#10B981'] as const,
    bg: 'rgba(16,185,129,0.10)',
    text: '#34D399',
    icon: 'edit-3',
  },
  TP: {
    label: 'TP',
    gradient: ['#FBBF24', '#F59E0B'] as const,
    bg: 'rgba(251,191,36,0.10)',
    text: '#FBBF24',
    icon: 'tool',
  },
  EXAMEN: {
    label: 'Examen',
    gradient: ['#EF4444', '#EC4899'] as const,
    bg: 'rgba(239,68,68,0.10)',
    text: '#EF4444',
    icon: 'file-text',
  },
  DEVOIR: {
    label: 'Devoir',
    gradient: ['#A78BFA', '#8B5CF6'] as const,
    bg: 'rgba(167,139,250,0.10)',
    text: '#A78BFA',
    icon: 'clipboard',
  },
};

const getTypeConfig = (type?: string) => {
  if (!type) return null;
  return TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || null;
};

// Composant pour le statut du jour
const DayStatus = ({ isToday, hasEntries }: { isToday: boolean; hasEntries: boolean }) => {
  if (!isToday) return null;
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: C.green,
        }}
      />
      <Text style={{ fontSize: 10, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase', color: C.green }}>
        {hasEntries ? 'En cours' : "Aujourd'hui"}
      </Text>
    </View>
  );
};

// Composant pour les heures
const TimeSlot = ({ start, end }: { start: string; end: string }) => (
  <View style={{ alignItems: 'center', width: 56 }}>
    <Text style={{ fontSize: 14, fontWeight: '600', color: C.textPrimary }}>
      {start}
    </Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
      <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: C.textMuted }} />
      <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
        {end}
      </Text>
      <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: C.textMuted }} />
    </View>
  </View>
);

// Composant pour le type de cours
const CourseTypeBadge = ({ type }: { type?: string }) => {
  const config = getTypeConfig(type);
  if (!config) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: config.bg,
      }}
    >
      <Text style={{ fontSize: 10, fontWeight: '600', color: config.text }}>
        {config.label}
      </Text>
    </View>
  );
};

// Composant pour une entrée de cours individuelle
const CourseEntry = ({
  entry,
  index,
  onPress,
}: {
  entry: TimetableEntry;
  index: number;
  onPress?: (entry: TimetableEntry) => void;
}) => {
  const config = getTypeConfig(entry.type);

  return (
    <MotiView
      from={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 60 }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress?.(entry)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
          backgroundColor: C.surfaceAlt,
          borderWidth: 1,
          borderColor: C.border,
        }}
      >
        {/* Glow subtil du cours */}
        <LinearGradient
          colors={['rgba(255,255,255,0.02)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 16,
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
          {/* Indicateur de type (barre latérale) */}
          {config && (
            <LinearGradient
              colors={config.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                width: 3,
                height: 32,
                borderRadius: 2,
              }}
            />
          )}

          {/* Heure */}
          <TimeSlot start={entry.heureDebut} end={entry.heureFin} />

          {/* Séparateur vertical */}
          <View style={{ width: 1, height: 32, backgroundColor: C.border }} />

          {/* Infos cours */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.textPrimary }}>
                {entry.matiere}
              </Text>
              {config && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name={config.icon as any} size={12} color={config.text} />
                  <CourseTypeBadge type={entry.type} />
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="user" size={11} color={C.textMuted} />
                <Text style={{ fontSize: 11, fontWeight: '500', color: C.textMuted }}>
                  {entry.professeur}
                </Text>
              </View>
              <View
                style={{
                  width: 2,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: C.textMuted,
                }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="map-pin" size={11} color={C.textMuted} />
                <Text style={{ fontSize: 11, fontWeight: '500', color: C.textMuted }}>
                  Salle {entry.salle}
                </Text>
              </View>
            </View>
          </View>

          {/* Flèche de navigation */}
          <Feather
            name="chevron-right"
            size={16}
            color={C.textMuted}
            style={{ opacity: 0.4 }}
          />
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

// Composant d'état vide
const EmptyState = () => (
  <MotiView
    from={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'timing', duration: 400 }}
    style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32 }}
  >
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(99,102,241,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
      }}
    >
      <Feather name="calendar" size={22} color={C.textMuted} />
    </View>
    <Text style={{ fontSize: 14, fontWeight: '500', color: C.textMuted }}>
      Aucun cours ce jour
    </Text>
    <Text style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>
      Profitez de votre temps libre
    </Text>
  </MotiView>
);

// Composant principal
export const TimetableCard: React.FC<TimetableCardProps> = ({
  entries,
  dayName,
  dayNumber,
  isToday = false,
  onPressEntry,
  onPressDay,
  className,
}) => {
  const hasEntries = entries.length > 0;
  const currentDay = new Date().getDate();

  return (
    <View style={{ marginBottom: 16 }}>
      <Card
        variant={isToday ? 'elevated' : 'default'}
        padding="md"
        glow={isToday}
        borderGlow={isToday}
      >
        {/* En-tête du jour */}
        <TouchableOpacity
          onPress={onPressDay}
          activeOpacity={0.7}
          style={{ marginBottom: 12 }}
        >
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {/* Numéro du jour */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: isToday ? C.accentBg : C.surfaceAlt,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: isToday ? 1 : 0,
                  borderColor: isToday ? 'rgba(99,102,241,0.20)' : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: isToday ? C.accentDim : C.textMuted,
                  }}
                >
                  {dayNumber}
                </Text>
              </View>

              <View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: C.textPrimary }}>
                  {dayName}
                </Text>
                {isToday && (
                  <View style={{ marginTop: 2 }}>
                    <Badge
                      text="Aujourd'hui"
                      variant="primary"
                      size="sm"
                      glow
                    />
                  </View>
                )}
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text
                  style={{ fontSize: 12, fontWeight: '500', color: C.textMuted }}
                >
                  {hasEntries ? `${entries.length} cours` : 'Libre'}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={C.textMuted} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Liste des cours */}
        {hasEntries ? (
          <View style={{ gap: 10 }}>
            {entries.map((entry, index) => (
              <CourseEntry
                key={entry.id}
                entry={entry}
                index={index}
                onPress={onPressEntry}
              />
            ))}
          </View>
        ) : (
          <EmptyState />
        )}
      </Card>
    </View>
  );
};