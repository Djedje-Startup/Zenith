// screens/eleve/StudentTimetableScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedViewNative from '@react-native-masked-view/masked-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#8B5CF6';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];
const MaskedView = MaskedViewNative as unknown as React.ComponentType<any>;

type FeatherIconName = keyof typeof Feather.glyphMap;

// ─── TYPES & MOCK ────────────────────────────────────────────────────────
interface TimetableEntry {
  id: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  professeur: string;
  salle: string;
  type?: 'CM' | 'TD' | 'TP' | 'DS';
}

const e = (id: string, d: string, f: string, matiere: string, professeur: string, salle: string, type: TimetableEntry['type']): TimetableEntry =>
  ({ id, heureDebut: d, heureFin: f, matiere, professeur, salle, type });

const MOCK_TIMETABLE: Record<string, TimetableEntry[]> = {
  Lundi: [
    e('1', '08:00', '09:30', 'Mathématiques', 'M. NGOMA', 'A101', 'CM'),
    e('2', '10:00', '11:30', 'Français', 'Mme LOUBAKI', 'A102', 'TD'),
    e('3', '14:00', '15:30', 'Physique-Chimie', 'M. MFOUMOU', 'Labo Sciences', 'TP'),
  ],
  Mardi: [
    e('4', '08:00', '09:30', 'Physique-Chimie', 'M. MFOUMOU', 'Labo Sciences', 'TP'),
    e('5', '10:00', '11:30', 'Anglais', 'M. WAMBA', 'Labo Langues', 'TD'),
  ],
  Mercredi: [e('6', '09:00', '12:00', 'Mathématiques', 'M. NGOMA', 'A101', 'DS')],
  Jeudi: [
    e('7', '08:00', '09:30', 'Anglais', 'M. WAMBA', 'Labo Langues', 'TD'),
    e('8', '14:00', '15:30', 'Histoire-Géo', 'Mme MOUKALA', 'A103', 'CM'),
  ],
  Vendredi: [e('9', '08:00', '09:30', 'Histoire-Géo', 'Mme MOUKALA', 'A103', 'CM')],
  Samedi: [],
  Dimanche: [],
};

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const JOURS_COURTS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const TYPE_META: Record<string, { label: string; icon: FeatherIconName }> = {
  CM: { label: 'Cours magistral', icon: 'book-open' },
  TD: { label: 'Travaux dirigés', icon: 'edit-3' },
  TP: { label: 'Travaux pratiques', icon: 'cpu' },
  DS: { label: 'Devoir surveillé', icon: 'file-text' },
};

// ─── DATES ────────────────────────────────────────────────────────────────
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const startOfWeek = (d: Date) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return addDays(x, -((x.getDay() + 6) % 7)); };
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const coursOf = (d: Date) => MOCK_TIMETABLE[JOURS[d.getDay()]] || [];
const isNow = (c: TimetableEntry) => {
  const n = new Date();
  const t = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
  return c.heureDebut <= t && t <= c.heureFin;
};

// ─── BRIQUES ──────────────────────────────────────────────────────────────
const GradientIcon = ({ name, size }: { name: FeatherIconName; size: number }) => (
  <MaskedView
    style={{ width: size, height: size }}
    maskElement={<View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}><Feather name={name} size={size} color="#000" /></View>}
  >
    <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: size, height: size }} />
  </MaskedView>
);

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(v, { toValue: 1, duration: 380, delay, useNativeDriver: true }).start(); }, []);
  return <Animated.View style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>{children}</Animated.View>;
};

// ─── ÉCRAN ────────────────────────────────────────────────────────────────
export const StudentTimetableScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date();
  const week = useMemo(() => { const ws = startOfWeek(selected); return Array.from({ length: 7 }, (_, i) => addDays(ws, i)); }, [selected]);
  const cours = coursOf(selected);
  const viewingToday = sameDay(selected, today);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

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
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour" style={[styles.backBtn, { backgroundColor: colors.surfaceElevated }]}>
            <Feather name="arrow-left" size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { color: colors.text }]}>Mon emploi du temps</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* ───── CALENDRIER SEMAINE ───── */}
        <View style={[styles.calendar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.monthRow}>
            <View>
              <Text style={[styles.month, { color: colors.text }]}>{MOIS[selected.getMonth()]} {selected.getFullYear()}</Text>
              <Text style={[styles.monthSub, { color: colors.textMuted }]}>{JOURS[selected.getDay()]} {selected.getDate()}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity onPress={() => setSelected(addDays(selected, -7))} accessibilityRole="button" accessibilityLabel="Semaine précédente" style={styles.chevBtn}>
                <Feather name="chevron-left" size={20} color={colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelected(addDays(selected, 7))} accessibilityRole="button" accessibilityLabel="Semaine suivante" style={styles.chevBtn}>
                <Feather name="chevron-right" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.weekRow}>
            {week.map((d, i) => {
              const active = sameDay(d, selected);
              const isToday = sameDay(d, today);
              const has = coursOf(d).length > 0;
              return (
                <TouchableOpacity key={i} activeOpacity={0.7} onPress={() => setSelected(d)} accessibilityRole="button" style={styles.dayCol}>
                  <Text style={[styles.dayName, { color: colors.textMuted }]}>{JOURS_COURTS[i]}</Text>
                  {active ? (
                    <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dayCircle}>
                      <Text style={[styles.dayNum, { color: '#FFFFFF', fontWeight: '700' }]}>{d.getDate()}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.dayCircle}>
                      <Text style={[styles.dayNum, { color: isToday ? BRAND_VIOLET : colors.text, fontWeight: isToday ? '700' : '500' }]}>{d.getDate()}</Text>
                    </View>
                  )}
                  <View style={[styles.dot, { backgroundColor: has ? (active ? BRAND_VIOLET : colors.textMuted) : 'transparent' }]} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ───── COURS DU JOUR ───── */}
        <View key={selected.toDateString()} style={{ paddingHorizontal: 22 }}>
          <FadeIn>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Cours du jour</Text>
              <Text style={[styles.sectionCount, { color: colors.textMuted }]}>{cours.length > 0 ? `${cours.length} cours` : ''}</Text>
            </View>
          </FadeIn>

          {cours.length > 0 ? (
            cours.map((c, i) => {
              const meta = TYPE_META[c.type || 'CM'];
              const now = viewingToday && isNow(c);
              return (
                <FadeIn key={c.id} delay={60 + i * 70}>
                  <View style={[styles.item, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
                    <View style={[styles.iconCircle, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
                      <GradientIcon name={meta.icon} size={18} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <Text style={[styles.itemLabel, { color: colors.textMuted }]}>{meta.label}</Text>
                        {now && (
                          <>
                            <View style={[styles.liveDot, { backgroundColor: BRAND_VIOLET }]} />
                            <Text style={[styles.itemLabel, { color: BRAND_VIOLET, fontWeight: '600' }]}>En cours</Text>
                          </>
                        )}
                      </View>
                      <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{c.matiere}</Text>
                      <Text style={[styles.itemMeta, { color: colors.textMuted }]} numberOfLines={1}>
                        {c.heureDebut} – {c.heureFin}  ·  {c.salle}  ·  {c.professeur}
                      </Text>
                    </View>
                  </View>
                </FadeIn>
              );
            })
          ) : (
            <FadeIn delay={80}>
              <View style={styles.empty}>
                <GradientIcon name="calendar" size={30} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun cours</Text>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Rien de planifié pour cette journée</Text>
              </View>
            </FadeIn>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 18 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  screenTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },

  calendar: { marginHorizontal: 16, borderRadius: 28, borderWidth: StyleSheet.hairlineWidth, paddingTop: 20, paddingBottom: 14, paddingHorizontal: 12 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 18 },
  month: { fontSize: 20, fontWeight: '600', letterSpacing: -0.4 },
  monthSub: { fontSize: 12.5, marginTop: 3 },
  chevBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },

  weekRow: { flexDirection: 'row' },
  dayCol: { flex: 1, alignItems: 'center' },
  dayName: { fontSize: 11, fontWeight: '500', marginBottom: 8 },
  dayCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  dayNum: { fontSize: 15 },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 6 },

  sectionRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 30, marginBottom: 6 },
  sectionTitle: { fontSize: 19, fontWeight: '600', letterSpacing: -0.4 },
  sectionCount: { fontSize: 12.5 },

  item: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 11.5 },
  liveDot: { width: 5, height: 5, borderRadius: 2.5 },
  itemTitle: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
  itemMeta: { fontSize: 12.5, marginTop: 3 },

  empty: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600', marginTop: 6 },
  emptyText: { fontSize: 12.5 },
});