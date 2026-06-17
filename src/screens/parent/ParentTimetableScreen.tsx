// screens/parent/ParentTimetableScreen.tsx
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
  pink: '#F472B6',
  pinkBg: 'rgba(244,114,182,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface TimetableEntry {
  id: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  professeur: string;
  salle: string;
  type?: 'CM' | 'TD' | 'TP' | 'EXAMEN' | 'DEVOIR';
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_TIMETABLE: Record<string, TimetableEntry[]> = {
  Lundi: [
    { 
      id: '1', 
      heureDebut: '08:00', 
      heureFin: '09:30', 
      matiere: 'Mathématiques', 
      professeur: 'M. NGOMA', 
      salle: 'A101', 
      type: 'CM' 
    },
    { 
      id: '2', 
      heureDebut: '10:00', 
      heureFin: '11:30', 
      matiere: 'Français', 
      professeur: 'Mme LOUBAKI', 
      salle: 'A102', 
      type: 'TD' 
    },
    { 
      id: '3', 
      heureDebut: '13:00', 
      heureFin: '14:30', 
      matiere: 'Anglais', 
      professeur: 'M. WAMBA', 
      salle: 'Labo Langues', 
      type: 'TD' 
    },
  ],
  Mardi: [
    { 
      id: '4', 
      heureDebut: '08:00', 
      heureFin: '09:30', 
      matiere: 'Physique-Chimie', 
      professeur: 'M. MFOUMOU', 
      salle: 'Labo Sciences', 
      type: 'TP' 
    },
    { 
      id: '5', 
      heureDebut: '10:00', 
      heureFin: '11:30', 
      matiere: 'SVT', 
      professeur: 'Mme MASSAMBA', 
      salle: 'A103', 
      type: 'CM' 
    },
  ],
  Mercredi: [],
  Jeudi: [
    { 
      id: '6', 
      heureDebut: '08:00', 
      heureFin: '09:30', 
      matiere: 'Histoire-Géo', 
      professeur: 'Mme MOUKALA', 
      salle: 'A104', 
      type: 'CM' 
    },
    { 
      id: '7', 
      heureDebut: '10:00', 
      heureFin: '11:30', 
      matiere: 'Anglais', 
      professeur: 'M. WAMBA', 
      salle: 'Labo Langues', 
      type: 'TD' 
    },
  ],
  Vendredi: [
    { 
      id: '8', 
      heureDebut: '08:00', 
      heureFin: '09:30', 
      matiere: 'Mathématiques', 
      professeur: 'M. NGOMA', 
      salle: 'A101', 
      type: 'CM' 
    },
    { 
      id: '9', 
      heureDebut: '10:00', 
      heureFin: '11:30', 
      matiere: 'Français', 
      professeur: 'Mme LOUBAKI', 
      salle: 'A102', 
      type: 'TD' 
    },
  ],
  Samedi: [],
};

const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const today = new Date().getDay();
const todayIndex = today === 0 ? 6 : today - 1;
const todayName = joursSemaine[todayIndex] || 'Lundi';

// ─── Helpers ────────────────────────────────────────────────────────────────
const getTypeConfig = (type?: string) => {
  switch (type) {
    case 'CM':
      return { label: 'CM', color: C.blue, bg: C.blueBg, icon: '🎓' };
    case 'TD':
      return { label: 'TD', color: C.green, bg: C.greenBg, icon: '📝' };
    case 'TP':
      return { label: 'TP', color: C.amber, bg: C.amberBg, icon: '🔬' };
    case 'EXAMEN':
      return { label: 'Examen', color: C.red, bg: C.redBg, icon: '📋' };
    case 'DEVOIR':
      return { label: 'Devoir', color: C.purple, bg: C.purpleBg, icon: '📄' };
    default:
      return { label: '', color: C.textMuted, bg: 'transparent', icon: '' };
  }
};

// ─── Day Selector ──────────────────────────────────────────────────────────
const DaySelector = ({
  selectedDay,
  onSelectDay,
}: {
  selectedDay: string;
  onSelectDay: (day: string) => void;
}) => {
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingHorizontal: 16, paddingBottom: 16 }}
      contentContainerStyle={{ gap: 8 }}
    >
      {joursSemaine.map((jour) => {
        const isActive = selectedDay === jour;
        const isToday = joursSemaine[todayIndex] === jour;
        const hasCours = (MOCK_TIMETABLE[jour] || []).length > 0;

        return (
          <TouchableOpacity
            key={jour}
            activeOpacity={0.7}
            onPress={() => onSelectDay(jour)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 14,
              backgroundColor: isActive ? C.accent : C.surface,
              borderWidth: 1,
              borderColor: isActive ? C.accent : C.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
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
              {jour}
            </Text>
            {isToday && (
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: isActive ? '#FFFFFF' : C.green,
                }}
              />
            )}
            {hasCours && (
              <View
                style={{
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 4,
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : C.accentBg,
                }}
              >
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: '700',
                    color: isActive ? 'rgba(255,255,255,0.8)' : C.accentDim,
                  }}
                >
                  {(MOCK_TIMETABLE[jour] || []).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// ─── Course Card ────────────────────────────────────────────────────────────
const CourseCard = ({ course, index }: { course: TimetableEntry; index: number }) => {
  const typeConfig = getTypeConfig(course.type);

  // Animation
  const translateX = useRef(new Animated.Value(-10)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        damping: 25,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: opacity,
        transform: [{ translateX: translateX }],
        marginBottom: 12,
      }}
    >
      <Card
        variant="default"
        padding="md"
        glow={!!typeConfig.label}
        borderGlow={!!typeConfig.label}
      >
        {/* Indicateur de type */}
        {typeConfig.label && (
          <LinearGradient
            colors={[typeConfig.color + '60', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2.5,
            }}
          />
        )}

        <View style={{ paddingTop: 4 }}>
          {/* En-tête */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: C.textPrimary,
                    letterSpacing: -0.2,
                  }}
                >
                  {course.matiere}
                </Text>
                {typeConfig.label && (
                  <Badge
                    text={`${typeConfig.icon} ${typeConfig.label}`}
                    variant={
                      course.type === 'CM' ? 'info' :
                      course.type === 'TD' ? 'success' :
                      course.type === 'TP' ? 'warning' :
                      course.type === 'EXAMEN' ? 'error' : 'primary'
                    }
                    size="sm"
                  />
                )}
              </View>

              <Text style={{ fontSize: 12, marginTop: 4, color: C.textMuted }}>
                {course.professeur}
              </Text>
            </View>

            {/* Heure */}
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: C.accentBg,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: C.accentDim }}>
                {course.heureDebut}
              </Text>
            </View>
          </View>

          {/* Détails */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              marginTop: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="clock" size={12} color={C.textMuted} />
              <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                {course.heureDebut} - {course.heureFin}
              </Text>
            </View>

            <View
              style={{
                width: 1,
                height: 10,
                backgroundColor: C.border,
              }}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="map-pin" size={12} color={C.textMuted} />
              <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                Salle {course.salle}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────
const Header = ({ children }: { children: string }) => {
  const { user } = useAuth();
  const initials = `${user?.prenoms?.[0] ?? ''}${user?.nom?.[0] ?? ''}`.toUpperCase();

  return (
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
        {children}
      </Text>
      <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 4, letterSpacing: 0.2 }}>
        Consultez l'emploi du temps de votre enfant
      </Text>
    </View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────
export const ParentTimetableScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(todayName);

  // Animation pour EmptyState
  const emptyScale = useRef(new Animated.Value(0.95)).current;
  const emptyOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const hasData = (MOCK_TIMETABLE[selectedDay] || []).length > 0;
    if (!hasData) {
      Animated.parallel([
        Animated.spring(emptyScale, {
          toValue: 1,
          damping: 25,
          useNativeDriver: true,
        }),
        Animated.timing(emptyOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedDay]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  const currentCours = MOCK_TIMETABLE[selectedDay] || [];
  const hasData = currentCours.length > 0;
  const totalCourses = Object.values(MOCK_TIMETABLE).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
      >
        <Header children="Emploi du temps" />

        {/* Sélecteur de jour */}
        <View style={{ marginTop: 8 }}>
          <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        </View>

        {/* Cours du jour */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          {/* En-tête du jour */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: C.textSecondary,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              {selectedDay}
            </Text>
            <Text style={{ fontSize: 11, color: C.textMuted }}>
              {hasData ? `${currentCours.length} cours` : 'Aucun cours'}
            </Text>
          </View>

          {hasData ? (
            currentCours.map((cours, index) => (
              <CourseCard key={cours.id} course={cours} index={index} />
            ))
          ) : (
            <Animated.View
              style={{
                transform: [{ scale: emptyScale }],
                opacity: emptyOpacity,
              }}
            >
              <EmptyState
                title="Aucun cours"
                description="Aucun cours n'est planifié pour ce jour"
                icon="calendar"
                variant="compact"
              />
            </Animated.View>
          )}

          {/* Footer */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: hasData ? 12 : 0,
              paddingVertical: 12,
            }}
          >
            <Feather name="info" size={12} color={C.textMuted} />
            <Text style={{ fontSize: 10, color: C.textMuted }}>
              {totalCourses} cours au total sur la semaine
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};