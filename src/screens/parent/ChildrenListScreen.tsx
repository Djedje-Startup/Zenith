// screens/parent/ChildrenListScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#7C3AED';
const GRADIENT_BRAND: [string, string] = [BRAND_VIOLET, BRAND_ORANGE];
const INK = '#16131F';
// Fonds des avatars : teintes très claires de la marque
const PASTELS = ['#EDE4FF', '#FFE4CC'];

// ─── TYPES ────────────────────────────────────────────────────────────────
interface Child {
  id: string;
  nom: string;
  prenoms: string;
  classe: string;
  matricule: string;
  schoolName: string;
  photo?: string; // URL http(s) de la photo de l'enfant
  moyenne?: number;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  tauxPresence?: number;
  anneeScolaire?: string;
}

// ─── MOCK (à remplacer par les vraies données ; `photo` = URL fournie par le backend) ───
const MOCK_CHILDREN: Child[] = [
  { id: '1', nom: 'MOUKOKO', prenoms: 'Jean Junior', classe: '3ème A', matricule: 'LMB-2025-001', schoolName: 'Lycée Moderne', photo: 'https://i.pravatar.cc/500?img=12', moyenne: 15.5, statut: 'ACTIF', tauxPresence: 92, anneeScolaire: '2025-2026' },
  { id: '2', nom: 'MOUKOKO', prenoms: 'Marie Claire', classe: '5ème B', matricule: 'CSJ-2025-042', schoolName: 'Collège Saint Joseph', photo: 'https://i.pravatar.cc/500?img=47', moyenne: 17.2, statut: 'ACTIF', tauxPresence: 88, anneeScolaire: '2025-2026' },
  { id: '3', nom: 'MOUKOKO', prenoms: 'David', classe: '1ère C', matricule: 'LMB-2025-089', schoolName: 'Lycée Moderne', photo: 'https://i.pravatar.cc/500?img=15', moyenne: 12.8, statut: 'SUSPENDU', tauxPresence: 65, anneeScolaire: '2024-2025' },
  { id: '4', nom: 'MOUKOKO', prenoms: 'Sarah', classe: '6ème A', matricule: 'LMB-2025-123', schoolName: 'Lycée Moderne', photo: 'https://i.pravatar.cc/500?img=32', moyenne: 16.8, statut: 'ACTIF', tauxPresence: 95, anneeScolaire: '2025-2026' },
];

const STATUT_LABEL: Record<Child['statut'], string> = { ACTIF: 'Actif', SUSPENDU: 'Suspendu', INACTIF: 'Inactif' };
const STATUT_COLOR: Record<Child['statut'], string> = { ACTIF: '#16A34A', SUSPENDU: '#DC2626', INACTIF: '#D97706' };

const initialsOf = (c: Child) =>
  `${c.prenoms} ${c.nom}`.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase();

// ─── AVATAR (photo, repli sur les initiales si l'image ne charge pas) ───
const Avatar = ({ child, size, tint, selected = false }: { child: Child; size: number; tint: string; selected?: boolean }) => {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const outer = size + 12;
  return (
    <View style={{ width: outer, height: outer, borderRadius: outer / 2, alignItems: 'center', justifyContent: 'center' }}>
      {selected && (
        <>
          <LinearGradient
            colors={GRADIENT_BRAND}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: outer / 2 }]}
          />
          <View style={{ position: 'absolute', top: 2.5, left: 2.5, right: 2.5, bottom: 2.5, borderRadius: outer / 2, backgroundColor: colors.background }} />
        </>
      )}
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: tint, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
        {child.photo && !failed ? (
          <Image source={{ uri: child.photo }} style={{ width: size, height: size }} resizeMode="cover" onError={() => setFailed(true)} />
        ) : (
          <Text style={{ color: INK, fontWeight: '700', fontSize: size * 0.34 }}>{initialsOf(child)}</Text>
        )}
      </View>
    </View>
  );
};

const StatusPill = ({ statut }: { statut: Child['statut'] }) => (
  <View style={styles.pill}>
    <View style={[styles.pillDot, { backgroundColor: STATUT_COLOR[statut] }]} />
    <Text style={styles.pillText}>{STATUT_LABEL[statut]}</Text>
  </View>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── SCREEN PRINCIPAL ───────────────────────────────────────────────────
export const ChildrenListScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { width, height } = useWindowDimensions();

  const [children] = useState(MOCK_CHILDREN);
  const [selectedId, setSelectedId] = useState(MOCK_CHILDREN[0]?.id);

  const selectedIndex = Math.max(0, children.findIndex((c) => c.id === selectedId));
  const selected = children[selectedIndex];
  const tint = PASTELS[selectedIndex % PASTELS.length];
  const single = children.length === 1;

  // Transition douce quand on change d'enfant
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(14)).current;
  useEffect(() => {
    fade.setValue(0);
    lift.setValue(14);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.spring(lift, { toValue: 0, damping: 18, useNativeDriver: true }),
    ]).start();
  }, [selectedId]);

  const openProfile = (c: Child) => navigation.navigate('ChildDetail', { childId: c.id });

  if (!selected) return null;

  const colW = (width - 40) / 4;
  const moyenne = selected.moyenne !== undefined ? selected.moyenne.toFixed(1) : '—';

  // ─── EN-TÊTE sobre ───
  const header = (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      <View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mes enfants</Text>
        <Text style={[styles.headerSub, { color: colors.textMuted }]}>
          {children.length} enfant{children.length > 1 ? 's' : ''} inscrit{children.length > 1 ? 's' : ''}
        </Text>
        <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerBar} />
      </View>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Retour"
        style={[styles.backBtn, { backgroundColor: colors.surfaceElevated }]}
      >
        <Feather name="arrow-left" size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderProfileButton = (onCard: boolean) => (
    <TouchableOpacity activeOpacity={0.88} onPress={() => openProfile(selected)} accessibilityRole="button">
      {onCard ? (
        <View style={[styles.profileBtn, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.profileBtnText, { color: INK }]}>Voir le profil</Text>
          <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profileArrow}>
            <Feather name="arrow-right" size={15} color="#FFFFFF" />
          </LinearGradient>
        </View>
      ) : (
        <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.profileBtn}>
          <Text style={styles.profileBtnText}>Voir le profil</Text>
          <Feather name="arrow-right" size={16} color="#FFFFFF" />
        </LinearGradient>
      )}
    </TouchableOpacity>
  );

  // ─── UN SEUL ENFANT : grande photo au centre ───
  if (single) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={colors.background === '#FFFFFF' ? 'dark-content' : 'light-content'} />
        {header}
        <Animated.View style={[styles.singleWrap, { opacity: fade, transform: [{ translateY: lift }] }]}>
          <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.singleRing}>
            <View style={[styles.singlePhoto, { backgroundColor: tint }]}>
              {selected.photo ? (
                <Image source={{ uri: selected.photo }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              ) : (
                <Text style={{ color: INK, fontSize: 64, fontWeight: '700' }}>{initialsOf(selected)}</Text>
              )}
            </View>
          </LinearGradient>

          <Text style={[styles.singleName, { color: colors.text }]}>{selected.prenoms} {selected.nom}</Text>
          <Text style={[styles.singleMeta, { color: colors.textMuted }]}>
            {selected.classe} · {selected.schoolName}
          </Text>

          <View style={[styles.singleStats, { backgroundColor: colors.surfaceElevated }]}>
            <View style={[styles.statCol]}><Text style={[styles.statValue, { color: colors.text }]}>{moyenne}</Text><Text style={[styles.statLabel, { color: colors.textMuted }]}>Moyenne</Text></View>
            <View style={[styles.statCol]}><Text style={[styles.statValue, { color: colors.text }]}>{selected.tauxPresence ?? 0}%</Text><Text style={[styles.statLabel, { color: colors.textMuted }]}>Présence</Text></View>
            <View style={[styles.statCol]}><Text style={[styles.statValue, { color: STATUT_COLOR[selected.statut] }]}>{STATUT_LABEL[selected.statut]}</Text><Text style={[styles.statLabel, { color: colors.textMuted }]}>Statut</Text></View>
          </View>

          <View style={{ width: '100%', marginTop: 24 }}>{renderProfileButton(false)}</View>
        </Animated.View>
      </View>
    );
  }

  // ─── PLUSIEURS ENFANTS : carte en haut + grille de photos ───
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.background === '#FFFFFF' ? 'dark-content' : 'light-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {header}

        {/* Carte de l'enfant sélectionné */}
        <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: lift }] }]}>
          <LinearGradient colors={[BRAND_VIOLET, '#B4478F', BRAND_ORANGE]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={styles.cardTop}>
            <Avatar child={selected} size={96} tint="#FFFFFF" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardName} numberOfLines={2}>{selected.prenoms}{'\n'}{selected.nom}</Text>
              <Text style={styles.cardMeta} numberOfLines={1}>{selected.classe} · {selected.schoolName}</Text>
              <Text style={styles.cardMatricule}>{selected.matricule}</Text>
            </View>
            <View style={{ alignSelf: 'flex-start' }}><StatusPill statut={selected.statut} /></View>
          </View>

          <View style={styles.cardStats}>
            <Stat label="Moyenne" value={moyenne} />
            <View style={styles.statDivider} />
            <Stat label="Présence" value={`${selected.tauxPresence ?? 0}%`} />
            <View style={styles.statDivider} />
            <Stat label="Année" value={selected.anneeScolaire ?? '—'} />
          </View>

          {renderProfileButton(true)}
        </Animated.View>

        {/* Grille des enfants */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Tous les enfants</Text>
        <View style={styles.grid}>
          {children.map((c, i) => {
            const active = c.id === selectedId;
            return (
              <TouchableOpacity
                key={c.id}
                activeOpacity={0.8}
                onPress={() => setSelectedId(c.id)}
                accessibilityRole="button"
                accessibilityLabel={`${c.prenoms}, ${c.classe}`}
                style={{ width: colW, alignItems: 'center', marginBottom: 22 }}
              >
                <Avatar child={c} size={colW - 22} tint={PASTELS[i % PASTELS.length]} selected={active} />
                <Text style={[styles.gridName, { color: active ? BRAND_VIOLET : colors.text }]} numberOfLines={1}>
                  {c.prenoms.split(' ')[0]}
                </Text>
                <Text style={[styles.gridClass, { color: colors.textMuted }]} numberOfLines={1}>{c.classe}</Text>
              </TouchableOpacity>
            );
          })}

          {/* Ajouter */}
          <TouchableOpacity activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Ajouter un enfant" style={{ width: colW, alignItems: 'center', marginBottom: 22 }}>
            <View
              style={{
                width: colW - 22 + 12,
                height: colW - 22 + 12,
                borderRadius: (colW - 22 + 12) / 2,
                borderWidth: 1.5,
                borderStyle: 'dashed',
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.addDot}>
                <Feather name="plus" size={18} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={[styles.gridName, { color: colors.text }]}>Ajouter</Text>
            <Text style={[styles.gridClass, { color: colors.textMuted }]}> </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 22 },
  headerTitle: { fontSize: 26, fontWeight: '300', letterSpacing: -0.5 },
  headerSub: { fontSize: 12.5, marginTop: 3 },
  headerBar: { width: 34, height: 3, borderRadius: 2, marginTop: 10 },
  backBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },

  card: { marginHorizontal: 16, borderRadius: 30, padding: 20, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  cardName: { fontSize: 21, fontWeight: '600', color: '#FFFFFF', letterSpacing: -0.4, lineHeight: 26 },
  cardMeta: { fontSize: 12.5, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  cardMatricule: { fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  cardStats: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 18, paddingVertical: 14, marginTop: 20, marginBottom: 16 },
  statDivider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.28)' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  statLabel: { fontSize: 10.5, color: 'rgba(255,255,255,0.7)', marginTop: 3 },

  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', paddingHorizontal: 11, paddingVertical: 6, borderRadius: 14 },
  pillDot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontSize: 11.5, fontWeight: '600', color: INK },

  profileBtn: { height: 52, borderRadius: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  profileArrow: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  profileBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', letterSpacing: 0.2 },

  addDot: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 14, marginTop: 30, marginBottom: 18, paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20 },
  gridName: { fontSize: 13, fontWeight: '600', marginTop: 10 },
  gridClass: { fontSize: 10.5, marginTop: 2 },

  singleWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingBottom: 40 },
  singleRing: { width: 236, height: 236, borderRadius: 118, alignItems: 'center', justifyContent: 'center' },
  singlePhoto: { width: 226, height: 226, borderRadius: 113, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFFFFF' },
  singleName: { fontSize: 26, fontWeight: '600', letterSpacing: -0.5, marginTop: 24, textAlign: 'center' },
  singleMeta: { fontSize: 13.5, marginTop: 6, textAlign: 'center' },
  singleStats: { flexDirection: 'row', width: '100%', borderRadius: 20, paddingVertical: 16, marginTop: 26 },
  statCol: { flex: 1, alignItems: 'center' },
});