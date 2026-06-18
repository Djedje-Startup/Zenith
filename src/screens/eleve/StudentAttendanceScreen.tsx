import React, { useState, useRef, useEffect } from 'react';
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

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:          '#0E1117',
  surface:     '#12151E',
  surfaceAlt:  '#161A24',
  border:      '#1C2030',
  borderSub:   '#141720',
  accent:      '#6366F1',
  accentDim:   '#818CF8',
  accentBg:    'rgba(99,102,241,0.10)',
  green:       '#34D399',
  greenBg:     'rgba(16,185,129,0.09)',
  amber:       '#FBBF24',
  amberBg:     'rgba(251,191,36,0.09)',
  red:         '#EF4444',
  redBg:       'rgba(239,68,68,0.09)',
  purple:      '#A78BFA',
  purpleBg:    'rgba(167,139,250,0.09)',
  textPrimary:   '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted:     '#4A5060',
  textDim:       '#2E3245',
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Statut = 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';

interface HistoriqueItem {
  date: string;        // ISO YYYY-MM-DD
  statut: Statut;
  motif?: string;
}

interface AttendanceData {
  totalJours:   number;
  presents:     number;
  absents:      number;
  retards:      number;
  excuses:      number;
  tauxPresence: number;
  historique:   HistoriqueItem[];
}

// ─── Mock ─────────────────────────────────────────────────────────────────────
const MOCK: AttendanceData = {
  totalJours: 22, presents: 18, absents: 2, retards: 2, excuses: 1,
  tauxPresence: 81.8,
  historique: [
    { date: '2025-10-01', statut: 'PRESENT' },
    { date: '2025-10-02', statut: 'PRESENT' },
    { date: '2025-10-03', statut: 'RETARD'  },
    { date: '2025-10-04', statut: 'PRESENT' },
    { date: '2025-10-05', statut: 'PRESENT' },
    { date: '2025-10-08', statut: 'ABSENT',  motif: 'Maladie' },
    { date: '2025-10-09', statut: 'PRESENT' },
    { date: '2025-10-10', statut: 'PRESENT' },
    { date: '2025-10-11', statut: 'PRESENT' },
    { date: '2025-10-12', statut: 'ABSENT',  motif: 'Rendez-vous médical' },
    { date: '2025-10-15', statut: 'PRESENT' },
    { date: '2025-10-16', statut: 'RETARD'  },
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
    { date: '2025-10-31', statut: 'EXCUSE',  motif: 'Sortie scolaire' },
  ],
};

const MOIS_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];
const JOURS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const JOURS_LONG = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatDateLong = (iso: string) => {
  const d = parseDate(iso);
  return {
    jour:    JOURS_LONG[d.getDay()],
    jourCourt: JOURS_FR[d.getDay()],
    num:     d.getDate(),
    mois:    MOIS_FR[d.getMonth()],
    annee:   d.getFullYear(),
    dayNum:  d.getDay(),   // 0 = dim
  };
};

const getStatutConfig = (s: Statut) => {
  switch (s) {
    case 'PRESENT': return { label: 'Présent',  color: C.green,  bg: C.greenBg,  icon: 'check-circle' as const };
    case 'ABSENT':  return { label: 'Absent',   color: C.red,    bg: C.redBg,    icon: 'x-circle'     as const };
    case 'RETARD':  return { label: 'En retard',color: C.amber,  bg: C.amberBg,  icon: 'clock'        as const };
    case 'EXCUSE':  return { label: 'Excusé',   color: C.purple, bg: C.purpleBg, icon: 'file-text'    as const };
  }
};

// Calcule le pourcentage de la barre de progression
const getProgressColor = (taux: number) =>
  taux >= 90 ? C.green : taux >= 75 ? C.amber : C.red;

// ─── Composants atomiques ─────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: string }) => (
  <Text style={{
    fontSize: 11, fontWeight: '700', color: '#7880A0',
    textTransform: 'uppercase', letterSpacing: 1.2,
    marginBottom: 12, marginTop: 24,
  }}>{children}</Text>
);

// ─── Carte stat header ────────────────────────────────────────────────────────
interface MiniStatProps {
  value: number | string;
  label: string;
  color: string;
}
const MiniStat: React.FC<MiniStatProps> = ({ value, label, color }) => (
  <View style={{
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  }}>
    <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 }}>
      {value}
    </Text>
    <View style={{ width: 20, height: 2, borderRadius: 1, backgroundColor: color, marginVertical: 4 }} />
    <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '600' }}>
      {label}
    </Text>
  </View>
);

// ─── Ligne historique ─────────────────────────────────────────────────────────
interface HistRowProps {
  item: HistoriqueItem;
  animTX: Animated.Value;
  animOp: Animated.Value;
}
const HistRow: React.FC<HistRowProps> = ({ item, animTX, animOp }) => {
  const cfg = getStatutConfig(item.statut);
  const { jour, num, mois, jourCourt, dayNum } = formatDateLong(item.date);
  const isWeekend = dayNum === 0 || dayNum === 6;

  return (
    <Animated.View style={{
      marginBottom: 8,
      transform: [{ translateX: animTX }],
      opacity: animOp,
    }}>
      <View style={{
        backgroundColor: C.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: item.statut !== 'PRESENT' ? `${cfg.color}25` : C.border,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Bande latérale colorée */}
        <View style={{
          width: 4,
          alignSelf: 'stretch',
          backgroundColor: cfg.color,
          opacity: item.statut === 'PRESENT' ? 0.35 : 0.75,
        }} />

        {/* Bloc date */}
        <View style={{
          width: 62,
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 6,
          borderRightWidth: 1,
          borderRightColor: C.borderSub,
        }}>
          <Text style={{
            fontSize: 9, fontWeight: '700',
            color: isWeekend ? C.amber : C.textMuted,
            textTransform: 'uppercase', letterSpacing: 0.8,
          }}>
            {jourCourt}
          </Text>
          <Text style={{
            fontSize: 22, fontWeight: '800',
            color: item.statut !== 'PRESENT' ? cfg.color : C.textPrimary,
            letterSpacing: -0.5, lineHeight: 26,
          }}>
            {num}
          </Text>
          <Text style={{
            fontSize: 9, color: C.textDim,
            fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4,
          }}>
            {mois.slice(0, 3)}
          </Text>
        </View>

        {/* Corps */}
        <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12 }}>
          <Text style={{
            fontSize: 13, fontWeight: '700',
            color: item.statut !== 'PRESENT' ? cfg.color : C.textSecondary,
            letterSpacing: -0.1,
          }}>
            {jour}
          </Text>
          {item.motif ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
              <Feather name="info" size={10} color={C.textMuted} />
              <Text style={{ fontSize: 11, color: C.textMuted, fontStyle: 'italic' }}>
                {item.motif}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
              {item.statut === 'PRESENT' ? 'Journée complète' : '—'}
            </Text>
          )}
        </View>

        {/* Badge statut */}
        <View style={{
          backgroundColor: cfg.bg,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: cfg.color + '30',
          paddingVertical: 5,
          paddingHorizontal: 9,
          marginRight: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}>
          <Feather name={cfg.icon} size={11} color={cfg.color} />
          <Text style={{
            fontSize: 9, fontWeight: '800',
            color: cfg.color, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            {cfg.label}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// ─── Barre de progression circulaire simulée ──────────────────────────────────
interface RingProps { taux: number }
const Ring: React.FC<RingProps> = ({ taux }) => {
  const color = getProgressColor(taux);
  const mention =
    taux >= 90 ? 'Excellent' :
    taux >= 75 ? 'Satisfaisant' : 'Insuffisant';
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{
        width: 110, height: 110, borderRadius: 55,
        backgroundColor: `${color}12`,
        borderWidth: 6, borderColor: `${color}35`,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <View style={{
          position: 'absolute', width: 110, height: 110, borderRadius: 55,
          borderWidth: 6, borderColor: color,
          borderTopColor: 'transparent', borderRightColor: taux > 50 ? color : 'transparent',
          opacity: 0.9,
        }} />
        <Text style={{ fontSize: 26, fontWeight: '900', color, letterSpacing: -1 }}>
          {taux}%
        </Text>
      </View>
      <View style={{
        marginTop: 10,
        backgroundColor: `${color}15`,
        borderRadius: 8, borderWidth: 1, borderColor: `${color}25`,
        paddingVertical: 3, paddingHorizontal: 12,
      }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color, letterSpacing: 0.3 }}>
          {mention}
        </Text>
      </View>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export const StudentAttendanceScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(9);   // Octobre = index 9
  const [attendance]   = useState(MOCK);

  const headerAnim  = useRef(new Animated.Value(0)).current;
  const cardAnim    = useRef(new Animated.Value(0)).current;

  // Une valeur par ligne d'historique
  const rowAnims = useRef(
    attendance.historique.map(() => ({
      tx: new Animated.Value(-16),
      op: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(cardAnim,   { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();

    const staggered = rowAnims.map((a, i) =>
      Animated.parallel([
        Animated.spring(a.tx, { toValue: 0, tension: 60, friction: 10, delay: 120 + i * 25, useNativeDriver: true }),
        Animated.timing(a.op, { toValue: 1, duration: 200, delay: 120 + i * 25, useNativeDriver: true }),
      ])
    );
    Animated.stagger(0, staggered).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filtrage sur le mois sélectionné
  const filtered = attendance.historique.filter(item => {
    const d = parseDate(item.date);
    return d.getMonth() === selectedMonth;
  });

  const progressColor = getProgressColor(attendance.tauxPresence);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
      >
        {/* ───── Header ───── */}
        <Animated.View style={{ opacity: headerAnim }}>
          <LinearGradient
            colors={['#1A1035', '#2D1B69', '#4C1D95']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: 56, paddingBottom: 28, paddingHorizontal: 22,
              borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
              overflow: 'hidden',
            }}
          >
            {/* Halo décoratif */}
            <View style={{
              position: 'absolute', top: -40, right: -40,
              width: 180, height: 180, borderRadius: 90,
              backgroundColor: 'rgba(167,139,250,0.08)',
            }} />

            {/* Logo + titre */}
            <Text style={{
              fontSize: 11, fontWeight: '700', color: 'rgba(167,139,250,0.7)',
              letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 16,
            }}>
              ✦ SURYA
            </Text>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Suivi des présences
            </Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFF', letterSpacing: -0.5, marginTop: 2, marginBottom: 20 }}>
              Mes présences
            </Text>

            {/* Stats 4 colonnes */}
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <MiniStat value={attendance.presents}  label="Présents" color={C.green}  />
              <MiniStat value={attendance.absents}   label="Absents"  color={C.red}    />
              <MiniStat value={attendance.retards}   label="Retards"  color={C.amber}  />
              <MiniStat value={attendance.excuses}   label="Excusés"  color={C.purple} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ───── Sélecteur de mois ───── */}
        <View style={{
          backgroundColor: C.surface,
          borderBottomWidth: 1, borderBottomColor: C.border,
          paddingVertical: 12,
        }}>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {MOIS_FR.map((month, index) => {
              const active = selectedMonth === index;
              return (
                <TouchableOpacity
                  key={month}
                  activeOpacity={0.7}
                  onPress={() => setSelectedMonth(index)}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 7,
                    borderRadius: 10,
                    backgroundColor: active ? C.accent : C.surfaceAlt,
                    borderWidth: 1,
                    borderColor: active ? `${C.accent}80` : C.border,
                  }}
                >
                  <Text style={{
                    fontSize: 12, fontWeight: active ? '700' : '500',
                    color: active ? '#FFF' : C.textMuted,
                  }}>
                    {month.slice(0, 4)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>

          {/* ───── Carte synthèse ───── */}
          <Animated.View style={{
            marginTop: 20,
            backgroundColor: C.surface,
            borderRadius: 22, borderWidth: 1, borderColor: C.border,
            padding: 20, marginBottom: 4,
            opacity: cardAnim,
            transform: [{ scale: cardAnim.interpolate({ inputRange: [0,1], outputRange: [0.95, 1] }) }],
          }}>
            <Text style={{
              fontSize: 10, fontWeight: '700', color: C.textMuted,
              textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', marginBottom: 16,
            }}>
              {MOIS_FR[selectedMonth]} 2025
            </Text>

            {/* Ring */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Ring taux={attendance.tauxPresence} />
            </View>

            {/* Barre de progression linéaire */}
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: '600' }}>
                  Progression mensuelle
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: progressColor }}>
                  {attendance.presents} / {attendance.totalJours} jours
                </Text>
              </View>
              <View style={{
                height: 6, backgroundColor: C.surfaceAlt,
                borderRadius: 3, overflow: 'hidden',
              }}>
                <View style={{
                  height: 6, borderRadius: 3,
                  width: `${attendance.tauxPresence}%`,
                  backgroundColor: progressColor,
                }} />
              </View>
            </View>

            {/* 3 chiffres clés */}
            <View style={{
              flexDirection: 'row',
              borderTopWidth: 1, borderTopColor: C.borderSub,
              paddingTop: 16,
            }}>
              {[
                { label: 'Total jours',  value: attendance.totalJours, color: C.accentDim },
                { label: 'Présents',     value: attendance.presents,   color: C.green     },
                { label: 'Absences',     value: attendance.absents,    color: C.red       },
              ].map((s, i) => (
                <View key={s.label} style={{
                  flex: 1, alignItems: 'center',
                  borderRightWidth: i < 2 ? 1 : 0,
                  borderRightColor: C.borderSub,
                }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: s.color, letterSpacing: -0.5 }}>
                    {s.value}
                  </Text>
                  <Text style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '600', marginTop: 2 }}>
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ───── Légende rapide ───── */}
          <View style={{
            flexDirection: 'row', flexWrap: 'wrap', gap: 6,
            marginBottom: 4, marginTop: 8,
          }}>
            {(['PRESENT','ABSENT','RETARD','EXCUSE'] as Statut[]).map(s => {
              const cfg = getStatutConfig(s);
              return (
                <View key={s} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 5,
                  backgroundColor: cfg.bg,
                  borderRadius: 8, paddingVertical: 4, paddingHorizontal: 9,
                  borderWidth: 1, borderColor: cfg.color + '25',
                }}>
                  <Feather name={cfg.icon} size={10} color={cfg.color} />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: cfg.color }}>
                    {cfg.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* ───── Historique ───── */}
          <SectionTitle>
            Historique — {MOIS_FR[selectedMonth]} 2025
          </SectionTitle>

          {filtered.length === 0 ? (
            <View style={{
              backgroundColor: C.surface, borderRadius: 16, borderWidth: 1,
              borderColor: C.border, padding: 32, alignItems: 'center',
            }}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>📭</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMuted, textAlign: 'center' }}>
                Aucune donnée pour ce mois
              </Text>
            </View>
          ) : (
            filtered.map((item, index) => {
              const originalIdx = attendance.historique.findIndex(h => h.date === item.date);
              const anim = rowAnims[originalIdx] ?? rowAnims[0];
              return (
                <HistRow
                  key={item.date}
                  item={item}
                  animTX={anim.tx}
                  animOp={anim.op}
                />
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};