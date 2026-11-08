// screens/eleve/StudentAttendanceScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl, StatusBar, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#8B5CF6';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];

// Teintes sobres pour les états de présence
const SAGE = '#37806F';   // présent : vert sauge profond
const OCHRE = '#B07D2E';  // retard : ocre doré
const BRICK = '#A9514A';  // absent : terre cuite

// ─── DONNÉES ──────────────────────────────────────────────────────────────
type Statut = 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';
interface HistoriqueItem { date: string; statut: Statut; motif?: string }
const ANNEE = 2025;
const ELEVE = { prenoms: 'Jean Junior', nom: 'MOUKOKO', photo: 'https://i.pravatar.cc/300?img=12' };

const h = (date: string, statut: Statut, motif?: string): HistoriqueItem => ({ date, statut, motif });
const HISTORIQUE: HistoriqueItem[] = [
  h('2025-10-01', 'PRESENT'), h('2025-10-02', 'PRESENT'), h('2025-10-03', 'RETARD'), h('2025-10-04', 'PRESENT'),
  h('2025-10-05', 'PRESENT'), h('2025-10-08', 'ABSENT', 'Maladie'), h('2025-10-09', 'PRESENT'), h('2025-10-10', 'PRESENT'),
  h('2025-10-11', 'PRESENT'), h('2025-10-12', 'ABSENT', 'Rendez-vous médical'), h('2025-10-15', 'PRESENT'),
  h('2025-10-16', 'RETARD'), h('2025-10-17', 'PRESENT'), h('2025-10-18', 'PRESENT'), h('2025-10-19', 'PRESENT'),
  h('2025-10-22', 'PRESENT'), h('2025-10-23', 'PRESENT'), h('2025-10-24', 'PRESENT'), h('2025-10-25', 'PRESENT'),
  h('2025-10-26', 'PRESENT'), h('2025-10-29', 'PRESENT'), h('2025-10-30', 'PRESENT'), h('2025-10-31', 'EXCUSE', 'Sortie scolaire'),
];

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const JOURS_COURTS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const parseDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };

// 3 états seulement : Présent / Retard / Absent (une absence justifiée compte comme absent)
type Etat = 'PRESENT' | 'RETARD' | 'ABSENT';
const etatOf = (s: Statut): Etat => (s === 'EXCUSE' ? 'ABSENT' : s);
const TONE: Record<Etat, string> = { PRESENT: SAGE, RETARD: OCHRE, ABSENT: BRICK };
const LABEL: Record<Etat, string> = { PRESENT: 'Présent', RETARD: 'Retard', ABSENT: 'Absent' };

// Pastille de jour : présent = disque doux teinté, retard / absent = disque plein (les exceptions ressortent)
const DayMark = ({ etat, size, label, colors }: { etat?: Etat; size: number; label?: number; colors: any }) => {
  const base = { width: size, height: size, borderRadius: size / 2, alignItems: 'center' as const, justifyContent: 'center' as const };
  const t = { fontSize: size * 0.4, fontWeight: '600' as const };
  if (!etat) return <View style={base}><Text style={[t, { color: colors.textMuted, fontWeight: '400' }]}>{label}</Text></View>;
  if (etat === 'PRESENT') return (
    <View style={[base, { backgroundColor: `${SAGE}26` }]}>
      {label !== undefined ? <Text style={[t, { color: SAGE }]}>{label}</Text> : null}
    </View>
  );
  return (
    <View style={[base, { backgroundColor: TONE[etat] }]}>
      {label !== undefined ? <Text style={[t, { color: '#FFF' }]}>{label}</Text> : null}
    </View>
  );
};

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(v, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start(); }, []);
  return <Animated.View style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>{children}</Animated.View>;
};

// ─── ÉCRAN ────────────────────────────────────────────────────────────────
export const StudentAttendanceScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [month, setMonth] = useState(9);
  const [photoFailed, setPhotoFailed] = useState(false);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

  const items = HISTORIQUE.filter(i => parseDate(i.date).getMonth() === month);
  const byDay: Record<number, Etat> = {};
  items.forEach(i => { byDay[parseDate(i.date).getDate()] = etatOf(i.statut); });
  const n = (e: Etat) => items.filter(i => etatOf(i.statut) === e).length;

  const first = new Date(ANNEE, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const nbDays = new Date(ANNEE, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: nbDays }, (_, i) => i + 1)];

  const etats: Etat[] = ['PRESENT', 'RETARD', 'ABSENT'];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <LinearGradient
        pointerEvents="none"
        colors={[`${BRAND_VIOLET}33`, `${BRAND_ORANGE}1A`, 'transparent']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: 340 }]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 36 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour" style={[styles.roundBtn, { backgroundColor: colors.surfaceElevated }]}>
            <Feather name="arrow-left" size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.topTitle, { color: colors.text }]}>Présences</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Photo de l'élève */}
        <View style={styles.who}>
          <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ring}>
            <View style={[styles.photo, { backgroundColor: colors.surfaceElevated, borderColor: colors.background }]}>
              {!photoFailed
                ? <Image source={{ uri: ELEVE.photo }} style={{ width: 84, height: 84 }} resizeMode="cover" onError={() => setPhotoFailed(true)} />
                : <Text style={{ fontSize: 26, fontWeight: '600', color: colors.text }}>{ELEVE.prenoms[0]}{ELEVE.nom[0]}</Text>}
            </View>
          </LinearGradient>
          <Text style={[styles.whoName, { color: colors.text }]}>{ELEVE.prenoms} {ELEVE.nom}</Text>
        </View>

        {/* Mois */}
        <View style={styles.monthRow}>
          <TouchableOpacity disabled={month === 0} onPress={() => setMonth(month - 1)} accessibilityRole="button" accessibilityLabel="Mois précédent" style={[styles.chev, month === 0 && { opacity: 0.3 }]}>
            <Feather name="chevron-left" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.monthText, { color: colors.text }]}>{MOIS[month]}</Text>
          <TouchableOpacity disabled={month === 11} onPress={() => setMonth(month + 1)} accessibilityRole="button" accessibilityLabel="Mois suivant" style={[styles.chev, month === 11 && { opacity: 0.3 }]}>
            <Feather name="chevron-right" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="calendar" size={30} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Aucune information</Text>
          </View>
        ) : (
          <>
            {/* 3 chiffres, c'est tout */}
            <FadeIn>
              <View style={styles.stats}>
                {etats.map((e, i) => (
                  <React.Fragment key={e}>
                    {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                    <View style={styles.stat}>
                      <Text style={[styles.statValue, { color: colors.text }]}>{n(e)}</Text>
                      <View style={styles.statLabelRow}>
                        <View style={[styles.dot, { backgroundColor: TONE[e] }]} />
                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>{LABEL[e]}</Text>
                      </View>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </FadeIn>

            {/* Calendrier */}
            <FadeIn delay={120}>
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.weekHead}>
                  {JOURS_COURTS.map((j, i) => <Text key={i} style={[styles.weekDay, { color: colors.textMuted }]}>{j}</Text>)}
                </View>
                <View style={styles.grid}>
                  {cells.map((d, i) => (
                    <View key={i} style={styles.cell}>
                      {d !== null && <DayMark etat={byDay[d]} size={36} label={d} colors={colors} />}
                    </View>
                  ))}
                </View>
              </View>
            </FadeIn>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  roundBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },

  who: { alignItems: 'center', marginTop: 22 },
  ring: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  photo: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  whoName: { fontSize: 16, fontWeight: '600', letterSpacing: -0.3, marginTop: 12 },

  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 14 },
  chev: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  monthText: { fontSize: 26, fontWeight: '600', letterSpacing: -0.6, minWidth: 150, textAlign: 'center' },

  stats: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 22, marginTop: 34 },
  stat: { flex: 1, alignItems: 'center' },
  divider: { width: StyleSheet.hairlineWidth, height: 56 },
  statValue: { fontSize: 56, fontWeight: '200', letterSpacing: -2 },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 2 },
  statLabel: { fontSize: 14 },
  dot: { width: 8, height: 8, borderRadius: 4 },

  card: { marginHorizontal: 16, marginTop: 36, borderRadius: 28, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 14, paddingVertical: 20 },
  weekHead: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: 46, alignItems: 'center', justifyContent: 'center' },

  empty: { alignItems: 'center', paddingVertical: 64, gap: 10 },
  emptyText: { fontSize: 14 },
});