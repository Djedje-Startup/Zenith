// screens/eleve/StudentAttendanceScreen.tsx
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
interface AttendanceData {
  totalJours: number;
  presents: number;
  absents: number;
  retards: number;
  excuses: number;
  tauxPresence: number;
  historique: {
    date: string;
    statut: 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';
    motif?: string;
  }[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_ATTENDANCE: AttendanceData = {
  totalJours: 22,
  presents: 18,
  absents: 2,
  retards: 2,
  excuses: 1,
  tauxPresence: 81.8,
  historique: [
    { date: '2025-10-01', statut: 'PRESENT' },
    { date: '2025-10-02', statut: 'PRESENT' },
    { date: '2025-10-03', statut: 'RETARD' },
    { date: '2025-10-04', statut: 'PRESENT' },
    { date: '2025-10-05', statut: 'PRESENT' },
    { date: '2025-10-08', statut: 'ABSENT', motif: 'Maladie' },
    { date: '2025-10-09', statut: 'PRESENT' },
    { date: '2025-10-10', statut: 'PRESENT' },
    { date: '2025-10-11', statut: 'PRESENT' },
    { date: '2025-10-12', statut: 'ABSENT', motif: 'Rendez-vous médical' },
    { date: '2025-10-15', statut: 'PRESENT' },
    { date: '2025-10-16', statut: 'RETARD' },
    { date: '2025-10-17', statut: 'PRESENT' },
    { date: '2025-10-18', statut: 'PRESENT' },
    { date: '2025-10-19', statut: 'PRESENT' },
    { date: '2025-10-22', statut: 'PRESENT' },
    { date: '2025-10-23', statut: 'PRESENT' },
    { date: '2025-10-24', statut: 'PRESENT' },
    { date: '2025-10-25', statut: 'PRESENT' },
    { date: '2025-10-26', statut: 'PRESENT' },
    { date: '2025-10-29', statut: 'PRESENT' },
    { date: '2025-10-30', statut: 'PRESENT' },
    { date: '2025-10-31', statut: 'PRESENT' },
  ],
};

const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStatutConfig = (statut: string) => {
  switch (statut) {
    case 'PRESENT':
      return { label: 'Présent', color: C.green, bg: C.greenBg, icon: 'check-circle' as const };
    case 'ABSENT':
      return { label: 'Absent', color: C.red, bg: C.redBg, icon: 'x-circle' as const };
    case 'RETARD':
      return { label: 'Retard', color: C.amber, bg: C.amberBg, icon: 'clock' as const };
    case 'EXCUSE':
      return { label: 'Excusé', color: C.purple, bg: C.purpleBg, icon: 'file-text' as const };
    default:
      return { label: 'Inconnu', color: C.textMuted, bg: C.surfaceAlt, icon: 'help-circle' as const };
  }
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

// ─── Screen ──────────────────────────────────────────────────────────────────
export const StudentAttendanceScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [attendance] = useState(MOCK_ATTENDANCE);

  // Animations
  const summaryScale = useRef(new Animated.Value(0.95)).current;
  const summaryOpacity = useRef(new Animated.Value(0)).current;

  const historyAnimations = attendance.historique.map(() => ({
    translateX: useRef(new Animated.Value(-10)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    // Animation de la carte de synthèse
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

    // Animations de l'historique (décalées)
    historyAnimations.forEach((anim, index) => {
      Animated.parallel([
        Animated.spring(anim.translateX, {
          toValue: 0,
          damping: 25,
          delay: 150 + index * 30,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 300,
          delay: 150 + index * 30,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const currentMonth = mois[selectedMonth];
  const year = '2025';

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
                Suivi des présences
              </Text>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}>
                Mes présences
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
                Taux
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {attendance.tauxPresence}%
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={{
            flexDirection: 'row',
            marginTop: 16,
          }}>
            {[
              { label: 'Présents', value: attendance.presents, color: C.green },
              { label: 'Absents', value: attendance.absents, color: C.red },
              { label: 'Retards', value: attendance.retards, color: C.amber },
              { label: 'Excusés', value: attendance.excuses, color: C.purple },
            ].map((stat, index) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 8,
                alignItems: 'center',
                marginRight: index < 3 ? 6 : 0,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#FFFFFF',
                }}>
                  {stat.value}
                </Text>
                <Text style={{
                  fontSize: 8,
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.3,
                  marginTop: 2,
                }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ───── Sélecteur de mois ──────────────────────────────────────────── */}
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
            {mois.map((month, index) => {
              const isActive = selectedMonth === index;
              return (
                <TouchableOpacity
                  key={month}
                  activeOpacity={0.7}
                  onPress={() => setSelectedMonth(index)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: isActive ? C.accent : C.surfaceAlt,
                    borderWidth: 1,
                    borderColor: isActive ? C.accent : C.border,
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? '#FFFFFF' : C.textSecondary,
                  }}>
                    {month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ───── Contenu ────────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 40 }}>

          {/* ─── Carte de synthèse ───────────────────────────────────────────── */}
          <Animated.View
            style={{
              backgroundColor: C.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: C.border,
              padding: 20,
              marginBottom: 24,
              alignItems: 'center',
              transform: [{ scale: summaryScale }],
              opacity: summaryOpacity,
            }}
          >
            <Text style={{
              fontSize: 12,
              color: C.textMuted,
              marginBottom: 12,
            }}>
              {currentMonth} {year}
            </Text>

            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: C.accentBg,
              borderWidth: 3,
              borderColor: C.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 28,
                fontWeight: '800',
                color: C.accent,
                letterSpacing: -0.5,
              }}>
                {attendance.tauxPresence}%
              </Text>
            </View>
            <Text style={{
              fontSize: 12,
              color: C.textMuted,
              marginTop: 8,
            }}>
              Taux de présence
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}>
              {[
                { label: 'Total jours', value: attendance.totalJours },
                { label: 'Présents', value: attendance.presents },
                { label: 'Absents', value: attendance.absents },
              ].map((stat, index) => (
                <View key={stat.label} style={{ alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: C.textPrimary,
                  }}>
                    {stat.value}
                  </Text>
                  <Text style={{
                    fontSize: 9,
                    color: C.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: 0.3,
                  }}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ─── Historique ───────────────────────────────────────────────────── */}
          <SectionTitle>Historique des présences</SectionTitle>

          {attendance.historique.map((item, index) => {
            const config = getStatutConfig(item.statut);
            const anim = historyAnimations[index];

            return (
              <Animated.View
                key={item.date}
                style={{
                  marginBottom: 8,
                  transform: [{ translateX: anim.translateX }],
                  opacity: anim.opacity,
                }}
              >
                <View style={{
                  backgroundColor: C.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: C.border,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: config.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                      <Feather name={config.icon} size={18} color={config.color} />
                    </View>
                    <View>
                      <Text style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: C.textPrimary,
                      }}>
                        {item.date}
                      </Text>
                      {item.motif && (
                        <Text style={{
                          fontSize: 11,
                          color: C.textMuted,
                          marginTop: 1,
                        }}>
                          {item.motif}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={{
                    backgroundColor: config.bg,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: config.color + '30',
                  }}>
                    <Text style={{
                      fontSize: 9,
                      fontWeight: '700',
                      color: config.color,
                      textTransform: 'uppercase',
                      letterSpacing: 0.3,
                    }}>
                      {config.label}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};