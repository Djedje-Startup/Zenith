// screens/parent/ParentHomeScreen.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, RefreshControl, StatusBar, Animated, FlatList, StyleSheet, Pressable, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#8B5CF6';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];

// ─── DONNÉES ─────────────────────────────────────────────────────────────
interface DashboardStats {
  notificationsNonLues: number;
  dernieresNotes: { id: string; matiere: string; note: number; date: string }[];
  evenementsRecents: { id: string; titre: string; date: string; lieu: string }[];
}

const MOCK_STATS: DashboardStats = {
  notificationsNonLues: 3,
  dernieresNotes: [
    { id: '1', matiere: 'Mathématiques', note: 15, date: '15 oct. 2025' },
    { id: '2', matiere: 'Français', note: 14, date: '14 oct. 2025' },
    { id: '3', matiere: 'Physique-Chimie', note: 17, date: '12 oct. 2025' },
    { id: '4', matiere: 'Anglais', note: 16, date: '11 oct. 2025' },
    { id: '5', matiere: 'Histoire', note: 12, date: '10 oct. 2025' },
  ],
  evenementsRecents: [
    { id: '1', titre: 'Réunion parents-professeurs', date: '25 oct. 2025', lieu: 'Salle polyvalente' },
    { id: '2', titre: 'Examens de mi-trimestre', date: '3 nov. 2025', lieu: 'Toutes les salles' },
  ],
};

const PARENT_FEATURES = [
  { id: 'announcements', label: 'Annonces', icon: 'bell' as const, screen: 'Announcements' },
  { id: 'schools', label: 'Établissements', icon: 'home' as const, screen: 'SchoolList' },
  { id: 'teachers', label: 'Professeurs', icon: 'users' as const, screen: 'ParentTeachers' },
  { id: 'messaging', label: 'Messagerie', icon: 'message-circle' as const, screen: 'Messaging' },
];

const QUICK_ACCESS = [
  { label: 'Enfants', icon: 'users' as const, screen: 'ChildrenList' },
  { label: 'Paiements', icon: 'credit-card' as const, screen: 'ParentPayments' },
  { label: 'Clubs', icon: 'award' as const, screen: 'ParentClubs' },
  { label: 'Profil', icon: 'user' as const, screen: 'Profile' },
];

const greeting = () => (new Date().getHours() < 18 ? 'Bonjour,' : 'Bonsoir,');

// ─── ANIMATIONS DISCRÈTES ────────────────────────────────────────────────
/** Apparition simple : fondu + léger glissement */
const Reveal = ({ index = 0, children }: { index?: number; children: React.ReactNode }) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 450, delay: index * 70, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }}>
      {children}
    </Animated.View>
  );
};

/** Pression : très léger retour d'échelle */
const Press = ({ onPress, children, style, label }: { onPress?: () => void; children: React.ReactNode; style?: any; label?: string }) => {
  const s = useRef(new Animated.Value(1)).current;
  const go = (val: number) => Animated.spring(s, { toValue: val, damping: 16, stiffness: 260, useNativeDriver: true }).start();
  return (
    <Pressable onPressIn={() => go(0.96)} onPressOut={() => go(1)} onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <Animated.View style={[style, { transform: [{ scale: s }] }]}>{children}</Animated.View>
    </Pressable>
  );
};

// ─── TITRE DE SECTION ────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: string }) => {
  const { colors } = useTheme();
  return <Text style={[styles.sectionTitle, { color: colors.text }]}>{children}</Text>;
};

// ─── ACCÈS RAPIDE ────────────────────────────────────────────────────────
const QuickAccessCircle = ({ item, onPress }: { item: (typeof QUICK_ACCESS)[0]; onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <Press onPress={onPress} label={item.label} style={{ alignItems: 'center', width: 76 }}>
      <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.qaRing}>
        <View style={[styles.qaInner, { backgroundColor: colors.surface }]}>
          <Feather name={item.icon} size={22} color={BRAND_VIOLET} />
        </View>
      </LinearGradient>
      <Text style={[styles.qaLabel, { color: colors.textSecondary }]}>{item.label}</Text>
    </Press>
  );
};

// ─── CARTE NOTE ──────────────────────────────────────────────────────────
const NoteCard = ({ note }: { note: DashboardStats['dernieresNotes'][0] }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.noteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.noteSubject, { color: colors.text }]} numberOfLines={1}>{note.matiere}</Text>
      <Text style={[styles.noteDate, { color: colors.textMuted }]}>{note.date}</Text>
      <Text style={[styles.noteValue, { color: colors.text }]}>
        {note.note}
        <Text style={[styles.noteOutOf, { color: colors.textMuted }]}>/20</Text>
      </Text>
      <View style={[styles.noteTrack, { backgroundColor: colors.surfaceElevated }]}>
        <LinearGradient
          colors={GRADIENT_BRAND}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 4, borderRadius: 2, width: `${Math.min(note.note / 20, 1) * 100}%` }}
        />
      </View>
    </View>
  );
};

// ─── ÉCRAN PRINCIPAL ─────────────────────────────────────────────────────
export const ParentHomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [stats] = useState(MOCK_STATS);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const navigateTo = (screen: string, params?: any) => navigation.navigate(screen, params);

  const user = { prenoms: 'Jean', nom: 'Dupont' };
  const initials = `${user.prenoms?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* ───── BANNIÈRE (dégradé pur, sans décor) ───── */}
        <LinearGradient
          colors={GRADIENT_BRAND}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.banner, { paddingTop: insets.top + 18 }]}
        >
          <View style={styles.bannerRow}>
            <View>
              <Text style={styles.hello}>{greeting()}</Text>
              <Text style={styles.name}>{user.prenoms}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity activeOpacity={0.75} onPress={() => navigateTo('Notifications')} accessibilityRole="button" accessibilityLabel="Notifications" style={styles.roundBtn}>
                <Feather name="bell" size={19} color="#FFFFFF" />
                {stats.notificationsNonLues > 0 && <View style={styles.badge} />}
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.75} onPress={() => navigateTo('Profile')} accessibilityRole="button" accessibilityLabel="Profil" style={styles.roundBtn}>
                <Text style={styles.initials}>{initials}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20 }}>
          {/* ───── STATS ───── */}
          <Reveal index={0}>
            <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
              <View style={styles.statItem}>
                <Feather name="trending-up" size={18} color={BRAND_VIOLET} />
                <View>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    15<Text style={[styles.statUnit, { color: colors.textMuted }]}>/20</Text>
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>Moyenne</Text>
                </View>
              </View>

              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

              <View style={styles.statItem}>
                <Feather name="check-square" size={18} color={BRAND_ORANGE} />
                <View>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    92<Text style={[styles.statUnit, { color: colors.textMuted }]}>%</Text>
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>Présence</Text>
                </View>
              </View>
            </View>
          </Reveal>

          {/* ───── ACCÈS RAPIDE ───── */}
          <Reveal index={1}>
            <SectionTitle>Accès rapide</SectionTitle>
            <View style={styles.qaRow}>
              {QUICK_ACCESS.map((item) => (
                <QuickAccessCircle key={item.label} item={item} onPress={() => navigateTo(item.screen)} />
              ))}
            </View>
          </Reveal>

          {/* ───── SERVICES ───── */}
          <Reveal index={2}>
            <SectionTitle>Services</SectionTitle>
            <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.servicesCard}>
              {PARENT_FEATURES.map((item) => (
                <Press key={item.id} onPress={() => navigateTo(item.screen, { userRole: 'parent' })} label={item.label} style={{ alignItems: 'center' }}>
                  <Feather name={item.icon} size={22} color="#FFFFFF" />
                  <Text style={styles.serviceLabel} numberOfLines={1}>{item.label}</Text>
                </Press>
              ))}
            </LinearGradient>
          </Reveal>

          {/* ───── DERNIÈRES NOTES ───── */}
          {stats.dernieresNotes.length > 0 && (
            <Reveal index={3}>
              <SectionTitle>Dernières notes</SectionTitle>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={stats.dernieresNotes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NoteCard note={item} />}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              />
            </Reveal>
          )}

          {/* ───── ÉVÉNEMENTS ───── */}
          {stats.evenementsRecents.length > 0 && (
            <Reveal index={4}>
              <SectionTitle>Événements à venir</SectionTitle>
              {stats.evenementsRecents.map((event, i) => {
                const [day, month] = event.date.split(' ');
                return (
                  <Press key={event.id} style={[styles.eventRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
                    <View style={styles.eventDate}>
                      <Text style={[styles.eventDay, { color: colors.text }]}>{day}</Text>
                      <Text style={[styles.eventMonth, { color: BRAND_VIOLET }]}>{month?.replace('.', '')}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={1}>{event.titre}</Text>
                      <Text style={[styles.eventPlaceText, { color: colors.textMuted }]} numberOfLines={1}>{event.lieu}</Text>
                    </View>
                    <Feather name="chevron-right" size={18} color={colors.textMuted} />
                  </Press>
                );
              })}
            </Reveal>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  banner: { paddingBottom: 64, paddingHorizontal: 22, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  bannerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hello: { fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: 0.3 },
  name: { fontSize: 30, fontWeight: '300', color: '#FFFFFF', letterSpacing: -0.8, marginTop: 2 },
  roundBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  badge: { position: 'absolute', top: 11, right: 12, width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: BRAND_ORANGE },

  statsCard: {
    flexDirection: 'row', alignItems: 'center', marginTop: -34, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 18, paddingHorizontal: 22,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 14, elevation: 3,
  },
  statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  statValue: { fontSize: 22, fontWeight: '600', letterSpacing: -0.5 },
  statUnit: { fontSize: 13, fontWeight: '400' },
  statLabel: { fontSize: 11.5, marginTop: 1 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 34, marginHorizontal: 14 },

  sectionTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, marginTop: 32, marginBottom: 16 },

  qaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  qaRing: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center' },
  qaInner: { width: 57, height: 57, borderRadius: 28.5, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontSize: 12, fontWeight: '500', marginTop: 9, textAlign: 'center' },

  servicesCard: { flexDirection: 'row', justifyContent: 'space-around', borderRadius: 24, paddingVertical: 22, paddingHorizontal: 8 },
  serviceLabel: { fontSize: 11, fontWeight: '500', color: 'rgba(255,255,255,0.95)', textAlign: 'center', marginTop: 8 },

  noteCard: { width: 148, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: 16, marginRight: 12 },
  noteSubject: { fontSize: 13.5, fontWeight: '600' },
  noteDate: { fontSize: 11, marginTop: 3, marginBottom: 14 },
  noteValue: { fontSize: 28, fontWeight: '300', letterSpacing: -1 },
  noteOutOf: { fontSize: 13, fontWeight: '400' },
  noteTrack: { height: 4, borderRadius: 2, marginTop: 12, overflow: 'hidden' },

  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14 },
  eventDate: { width: 40, alignItems: 'center' },
  eventDay: { fontSize: 22, fontWeight: '300', letterSpacing: -0.5 },
  eventMonth: { fontSize: 10.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 1 },
  eventTitle: { fontSize: 14.5, fontWeight: '600', letterSpacing: -0.1 },
  eventPlaceText: { fontSize: 12, marginTop: 3 },
});