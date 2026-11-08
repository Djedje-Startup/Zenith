// screens/parent/ChildDetailScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, Pressable, RefreshControl, StatusBar, Animated, StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedViewNative from '@react-native-masked-view/masked-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#7C3AED';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];

type FeatherIconName = keyof typeof Feather.glyphMap;

// Cast : évite le conflit de types JSX entre MaskedView et la version de @types/react
const MaskedView = MaskedViewNative as unknown as React.ComponentType<any>;

// ─── TYPES ────────────────────────────────────────────────────────────────
interface ChildDetail {
  id: string;
  nom: string;
  prenoms: string;
  photo?: string;
  dateNaissance: string;
  matricule: string;
  classe: string;
  cycle: string;
  moyenneGenerale?: number;
  rang?: number;
  effectifClasse?: number;
  nbAbsences: number;
  nbRetards: number;
  tauxPresence?: number;
  mention?: string;
  schoolName?: string;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
}

// ─── MOCK (à remplacer par le hook React Query réel) ──────────────────────
const MOCK_CHILD: ChildDetail = {
  id: '1',
  nom: 'MOUKOKO',
  prenoms: 'Jean Junior',
  photo: 'https://i.pravatar.cc/500?img=12',
  dateNaissance: '15 mai 2010',
  matricule: 'LMB-2025-001',
  classe: '3ème A',
  cycle: 'Collège',
  moyenneGenerale: 15.5,
  rang: 3,
  effectifClasse: 32,
  nbAbsences: 2,
  nbRetards: 1,
  tauxPresence: 92,
  mention: 'Bien',
  schoolName: 'Lycée Moderne',
  statut: 'ACTIF',
};

const STATUT_LABEL = { ACTIF: 'Actif', INACTIF: 'Inactif', SUSPENDU: 'Suspendu' } as const;
const STATUT_DOT = { ACTIF: '#22C55E', INACTIF: '#9CA3AF', SUSPENDU: '#EF4444' } as const;

// ─── AVATAR : anneau dégradé fin + photo (repli initiales) ───────────────
const Avatar = ({ child, size = 100 }: { child: ChildDetail; size?: number }) => {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const inner = size - 8;
  const initials = `${child.prenoms[0]}${child.nom[0]}`.toUpperCase();
  return (
    <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: inner + 4, height: inner + 4, borderRadius: (inner + 4) / 2, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: inner, height: inner, borderRadius: inner / 2, overflow: 'hidden', backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' }}>
          {child.photo && !failed ? (
            <Image source={{ uri: child.photo }} style={{ width: inner, height: inner }} resizeMode="cover" onError={() => setFailed(true)} />
          ) : (
            <Text style={{ color: colors.text, fontSize: inner * 0.32, fontWeight: '600' }}>{initials}</Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

// ─── ICÔNE EN DÉGRADÉ (le dégradé est masqué par la forme de l'icône) ────
const GradientIcon = ({ name, size }: { name: FeatherIconName; size: number }) => (
  <MaskedView
    style={{ width: size, height: size }}
    maskElement={<View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}><Feather name={name} size={size} color="#000000" /></View>}
  >
    <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: size, height: size }} />
  </MaskedView>
);

// ─── ACTION RONDE (navigation) ───────────────────────────────────────────
interface QuickAction { icon: FeatherIconName; label: string; screen: string; params?: Record<string, unknown> }

const ActionButton = ({ action, onPress }: { action: QuickAction; onPress: () => void }) => {
  const { colors } = useTheme();
  const s = useRef(new Animated.Value(1)).current;
  const go = (v: number) => Animated.spring(s, { toValue: v, damping: 15, stiffness: 260, useNativeDriver: true }).start();
  return (
    <Pressable onPressIn={() => go(0.92)} onPressOut={() => go(1)} onPress={onPress} accessibilityRole="button" accessibilityLabel={action.label} style={styles.actionItem}>
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: s }] }}>
        <View style={[styles.actionCircle, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <GradientIcon name={action.icon} size={21} />
        </View>
        <Text style={[styles.actionLabel, { color: colors.textMuted }]} numberOfLines={1}>{action.label}</Text>
      </Animated.View>
    </Pressable>
  );
};

// ─── LIGNE DE DÉTAIL : libellé à gauche, valeur en pastille à droite ─────
const DetailRow = ({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity activeOpacity={0.7} disabled={!onPress} onPress={onPress} style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{label}</Text>
      <View style={[styles.valuePill, { backgroundColor: colors.surfaceElevated }]}>
        <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
        {onPress && <Feather name="chevron-right" size={14} color={colors.textMuted} />}
      </View>
    </TouchableOpacity>
  );
};

// ─── SCREEN PRINCIPAL ───────────────────────────────────────────────────
export const ChildDetailScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [child] = useState(MOCK_CHILD);

  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.stagger(110, [
      Animated.timing(a1, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(a2, { toValue: 1, duration: 450, useNativeDriver: true }),
    ]).start();
  }, []);
  const rise = (v: Animated.Value) => ({ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const actions: QuickAction[] = [
    { icon: 'book', label: 'Cours', screen: 'StudentCourse' },
    { icon: 'calendar', label: 'Emploi', screen: 'StudentTimetable' },
    { icon: 'book-open', label: 'Notes', screen: 'StudentGradeDetail', params: { reportId: '1' } },
    { icon: 'credit-card', label: 'Paiements', screen: 'ParentPayments', params: { childId: child.id } },
    { icon: 'check-square', label: 'Présences', screen: 'StudentAttendance', params: { childId: child.id } },
    { icon: 'users', label: 'Clubs', screen: 'StudentClubDetail', params: { clubId: '1' } },
    { icon: 'message-square', label: 'Réclamation', screen: 'StudentComplaint' },
  ];
  const goTo = (a: QuickAction) => navigation.navigate(a.screen, a.params);

  const fullName = `${child.prenoms} ${child.nom}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Halo de marque en haut de page (comme le dégradé de la référence) */}
      <LinearGradient
        pointerEvents="none"
        colors={[`${BRAND_VIOLET}40`, `${BRAND_ORANGE}1F`, 'transparent']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: 380 }]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Retour */}
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour" style={[styles.backBtn, { backgroundColor: colors.surfaceElevated }]}>
            <Feather name="arrow-left" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* ───── CARTE PROFIL ───── */}
        <Animated.View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }, rise(a1)]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={{ marginTop: 22 }}><Avatar child={child} /></View>

          <Text style={[styles.name, { color: colors.text }]}>{fullName}</Text>
          <Text style={[styles.role, { color: colors.textMuted }]}>{child.classe} · {child.schoolName}</Text>

          <View style={[styles.statusPill, { backgroundColor: colors.surfaceElevated }]}>
            <View style={[styles.statusDot, { backgroundColor: STATUT_DOT[child.statut] }]} />
            <Text style={[styles.statusText, { color: colors.text }]}>{STATUT_LABEL[child.statut]}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 26, alignSelf: 'stretch' }} contentContainerStyle={styles.actionsRow}>
            {actions.map((a) => <ActionButton key={a.label} action={a} onPress={() => goTo(a)} />)}
          </ScrollView>
        </Animated.View>

        {/* ───── DÉTAILS ───── */}
        <Animated.View style={[styles.details, { backgroundColor: colors.surface, borderColor: colors.border }, rise(a2)]}>
          <View style={styles.detailsHeader}>
            <Text style={[styles.detailsTitle, { color: colors.text }]}>Détails</Text>
          </View>

          <DetailRow label="Moyenne" value={`${child.moyenneGenerale?.toFixed(1) ?? '—'} / 20`} onPress={() => navigation.navigate('StudentGradeDetail', { reportId: '1' })} />
          <DetailRow label="Classement" value={`${child.rang}e / ${child.effectifClasse}`} />
          <DetailRow label="Présence" value={`${child.tauxPresence}%`} onPress={() => navigation.navigate('StudentAttendance', { childId: child.id })} />
          <DetailRow label="Mention" value={child.mention ?? '—'} />
          <DetailRow label="Absences" value={`${child.nbAbsences} jour${child.nbAbsences > 1 ? 's' : ''}`} />
          <DetailRow label="Retards" value={`${child.nbRetards} fois`} />
          <DetailRow label="Cycle" value={child.cycle} />
          <DetailRow label="Naissance" value={child.dateNaissance} />
          <DetailRow label="Matricule" value={child.matricule} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 20, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  sheet: { marginHorizontal: 16, borderRadius: 30, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', paddingTop: 10, paddingBottom: 24 },
  handle: { width: 42, height: 4, borderRadius: 2 },
  name: { fontSize: 26, fontWeight: '600', letterSpacing: -0.6, marginTop: 18, textAlign: 'center', paddingHorizontal: 20 },
  role: { fontSize: 13.5, marginTop: 5, textAlign: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, marginTop: 16 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12.5, fontWeight: '600' },

  actionsRow: { paddingHorizontal: 14 },
  actionItem: { width: 70, alignItems: 'center' },
  actionCircle: { width: 54, height: 54, borderRadius: 27, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, marginTop: 8, fontWeight: '500' },

  details: { marginHorizontal: 16, marginTop: 14, borderRadius: 28, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  detailsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  detailsTitle: { fontSize: 19, fontWeight: '600', letterSpacing: -0.3 },

  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 9 },
  detailLabel: { fontSize: 13.5 },
  valuePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 36, borderRadius: 18 },
  valueText: { fontSize: 13, fontWeight: '600' },
});