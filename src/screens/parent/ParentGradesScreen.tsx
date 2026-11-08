// screens/parent/ParentGradesScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#7C3AED';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];

type FeatherIconName = keyof typeof Feather.glyphMap;

// ─── TYPES ────────────────────────────────────────────────────────────────
interface Grade {
  id: string;
  matiere: string;
  moyenne: number;
  coefficient: number;
  appreciation?: string;
  rang?: number;
  effectif?: number;
}

interface ReportCard {
  id: string;
  periode: string;
  periodeCourte: string;
  moyenneGenerale: number;
  mention: string;
  matieres: Grade[];
}

// ─── MOCK (à remplacer par les hooks React Query réels) ───────────────────
const MOCK_REPORT_CARDS: ReportCard[] = [
  {
    id: '1',
    periode: '1er Trimestre — 2025-2026',
    periodeCourte: 'Trim. 1',
    moyenneGenerale: 15.5,
    mention: 'BIEN',
    matieres: [
      { id: '1', matiere: 'Mathématiques', moyenne: 14.5, coefficient: 4, appreciation: 'Bon travail, reste concentré', rang: 4, effectif: 32 },
      { id: '2', matiere: 'Français', moyenne: 16.2, coefficient: 4, appreciation: 'Excellent trimestre', rang: 2, effectif: 32 },
      { id: '3', matiere: 'Anglais', moyenne: 14.8, coefficient: 3, appreciation: 'Bonne progression', rang: 5, effectif: 32 },
    ],
  },
  {
    id: '2',
    periode: '2e Trimestre — 2025-2026',
    periodeCourte: 'Trim. 2',
    moyenneGenerale: 16.2,
    mention: 'TRES_BIEN',
    matieres: [
      { id: '6', matiere: 'Mathématiques', moyenne: 15.5, coefficient: 4, appreciation: 'Belle progression', rang: 3, effectif: 32 },
      { id: '7', matiere: 'Français', moyenne: 17.0, coefficient: 4, appreciation: 'Excellent', rang: 1, effectif: 32 },
    ],
  },
  {
    id: '3',
    periode: '3e Trimestre — 2025-2026',
    periodeCourte: 'Trim. 3',
    moyenneGenerale: 17.8,
    mention: 'EXCELLENT',
    matieres: [
      { id: '9', matiere: 'Mathématiques', moyenne: 18.0, coefficient: 4, appreciation: 'Excellent, félicitations', rang: 1, effectif: 32 },
      { id: '10', matiere: 'Français', moyenne: 17.5, coefficient: 4, appreciation: 'Très bon niveau', rang: 1, effectif: 32 },
    ],
  },
];

const CATEGORY_TABS: { key: CategoryKey; label: string; icon: FeatherIconName }[] = [
  { key: 'notes', label: 'Notes', icon: 'book-open' },
  { key: 'timetable', label: 'Emploi', icon: 'calendar' },
  { key: 'attendance', label: 'Présences', icon: 'check-square' },
  { key: 'courses', label: 'Cours', icon: 'book' },
  { key: 'clubs', label: 'Clubs', icon: 'users' },
  { key: 'teachers', label: 'Professeurs', icon: 'user' },
];

type CategoryKey = 'notes' | 'timetable' | 'attendance' | 'courses' | 'clubs' | 'teachers';

// ─── HELPERS COULEUR ────────────────────────────────────────────────────
const getMentionConfig = (mention: string, colors: any) => {
  switch (mention) {
    case 'EXCELLENT': return { label: 'Excellent', color: colors.success };
    case 'TRES_BIEN': return { label: 'Très bien', color: colors.info };
    case 'BIEN': return { label: 'Bien', color: BRAND_VIOLET };
    case 'ASSEZ_BIEN': return { label: 'Assez bien', color: colors.warning };
    default: return { label: 'Insuffisant', color: colors.error };
  }
};

const getGradeColor = (note: number, colors: any) => {
  if (note >= 16) return colors.success;
  if (note >= 14) return colors.info;
  if (note >= 12) return BRAND_VIOLET;
  if (note >= 10) return colors.warning;
  return colors.error;
};

// ─── ONGLET À SOULIGNEMENT ANIMÉ ─────────────────────────────────────────
// Remplace les boutons pleins colorés par un système éditorial : le texte
// s'assombrit/s'éclaircit, un trait fin en dégradé apparaît sous l'onglet
// actif. Pas de fond plein, pas de pastille — juste de la typographie.
const UnderlineTab = ({
  label,
  icon,
  active,
  onPress,
  compact,
}: {
  label: string;
  icon?: FeatherIconName;
  active: boolean;
  onPress: () => void;
  compact?: boolean;
}) => {
  const { colors } = useTheme();
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: active ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  }, [active]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.tabItem, compact && styles.tabItemCompact]}
    >
      <View style={styles.tabItemRow}>
        {icon && <Feather name={icon} size={13} color={active ? colors.text : colors.textMuted} />}
        <Text
          style={[
            compact ? styles.tabLabelCompact : styles.tabLabel,
            { color: active ? colors.text : colors.textMuted, fontWeight: active ? '700' : '500' },
          ]}
        >
          {label}
        </Text>
      </View>
      <Animated.View style={[styles.tabUnderlineTrack, { opacity: progress }]}>
        <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tabUnderline} />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── BADGE DE NOTE EN ANNEAU ──────────────────────────────────────────────
// Un anneau fin plutôt qu'un disque rempli : la couleur reste un signal
// (performance), pas un aplat qui alourdit chaque ligne.
const GradeRing = ({ note, colors }: { note: number; colors: any }) => {
  const color = getGradeColor(note, colors);
  return (
    <View style={[styles.gradeRing, { borderColor: color }]}>
      <Text style={[styles.gradeRingText, { color }]}>{note.toFixed(1)}</Text>
    </View>
  );
};

// ─── LIGNE MATIÈRE ──────────────────────────────────────────────────────
// Plus de carte individuelle avec bordure colorée à gauche : les matières
// vivent dans une seule surface, séparées par des filets fins — comme un
// vrai relevé de notes plutôt qu'un empilement de widgets.
const SubjectRow = ({ grade, isLast, colors }: { grade: Grade; isLast: boolean; colors: any }) => (
  <View style={[styles.subjectRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
    <View style={{ flex: 1, marginRight: 14 }}>
      <Text style={[styles.subjectName, { color: colors.text }]}>{grade.matiere}</Text>
      <View style={styles.subjectMetaRow}>
        <Text style={[styles.subjectMeta, { color: colors.textMuted }]}>Coef. {grade.coefficient}</Text>
        {grade.rang && grade.effectif && (
          <>
            <View style={[styles.metaDot, { backgroundColor: colors.textMuted }]} />
            <Text style={[styles.subjectMeta, { color: colors.textMuted }]}>
              {grade.rang}ᵉ / {grade.effectif}
            </Text>
          </>
        )}
      </View>
      {grade.appreciation && (
        <Text style={[styles.appreciation, { color: colors.textSecondary }]} numberOfLines={2}>
          {grade.appreciation}
        </Text>
      )}
    </View>
    <GradeRing note={grade.moyenne} colors={colors} />
  </View>
);

// ─── CARTE BULLETIN ─────────────────────────────────────────────────────
const ReportCardView = ({ report, colors }: { report: ReportCard; colors: any }) => {
  const mentionConfig = getMentionConfig(report.mention, colors);
  return (
    <View style={[styles.reportCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
      {/* ── En-tête : moyenne en grand format éditorial ── */}
      <View style={styles.reportHead}>
        <Text style={[styles.reportPeriod, { color: colors.textMuted }]}>{report.periode}</Text>
        <View style={styles.reportHeroRow}>
          <Text style={[styles.reportHero, { color: mentionConfig.color }]}>
            {report.moyenneGenerale.toFixed(1)}
            <Text style={[styles.reportHeroSuffix, { color: colors.textMuted }]}>/20</Text>
          </Text>
          <View style={[styles.mentionPill, { borderColor: `${mentionConfig.color}45` }]}>
            <Text style={[styles.mentionText, { color: mentionConfig.color }]}>{mentionConfig.label}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.reportDivider, { backgroundColor: colors.border }]} />

      {/* ── Matières ── */}
      <View style={{ paddingHorizontal: 20 }}>
        {report.matieres.map((grade, i) => (
          <SubjectRow key={grade.id} grade={grade} isLast={i === report.matieres.length - 1} colors={colors} />
        ))}
      </View>
    </View>
  );
};

// ─── EMPTY STATE ────────────────────────────────────────────────────────
const EmptyState = ({ title, description, icon }: { title: string; description: string; icon: FeatherIconName }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.emptyWrap}>
      <View style={[styles.emptyIcon, { backgroundColor: `${BRAND_VIOLET}10` }]}>
        <Feather name={icon} size={22} color={BRAND_VIOLET} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.emptyDescription, { color: colors.textMuted }]}>{description}</Text>
    </View>
  );
};

// ─── SCREEN PRINCIPAL ───────────────────────────────────────────────────
export const ParentGradesScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState(MOCK_REPORT_CARDS[MOCK_REPORT_CARDS.length - 1]?.id ?? '');
  const [activeTab, setActiveTab] = useState<CategoryKey>('notes');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const currentReport = MOCK_REPORT_CARDS.find((r) => r.id === selectedPeriodId);

  const emptyByTab: Record<Exclude<CategoryKey, 'notes'>, { title: string; description: string; icon: FeatherIconName }> = {
    timetable: { title: 'Emploi du temps', description: "L'emploi du temps de votre enfant sera disponible ici.", icon: 'calendar' },
    attendance: { title: 'Présences', description: 'Le suivi des présences de votre enfant sera disponible ici.', icon: 'check-square' },
    courses: { title: 'Cours', description: 'La liste des cours de votre enfant sera disponible ici.', icon: 'book' },
    clubs: { title: 'Clubs', description: 'Les clubs de votre enfant seront disponibles ici.', icon: 'users' },
    teachers: { title: 'Professeurs', description: 'La liste des professeurs de votre enfant sera disponible ici.', icon: 'user' },
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* ───── HEADER ───── */}
        <LinearGradient
          colors={GRADIENT_BRAND}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 18 }]}
        >
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Retour"
                style={styles.headerBackBtn}
              >
                <Feather name="arrow-left" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerEyebrow}>Suivi de l'élève</Text>
                <Text style={styles.headerTitle} numberOfLines={1}>Résultats scolaires</Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => navigation.navigate('Profile')}
              accessibilityRole="button"
              accessibilityLabel="Profil"
              style={styles.headerAvatarBtn}
            >
              <Text style={styles.headerAvatarText}>JD</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ───── ONGLETS DE CATÉGORIE ───── */}
        <View style={[styles.tabsBar, { borderBottomColor: colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsBarContent}>
            {CATEGORY_TABS.map((tab) => (
              <UnderlineTab
                key={tab.key}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.key}
                onPress={() => setActiveTab(tab.key)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.body}>
          {activeTab === 'notes' ? (
            <>
              {/* ───── SÉLECTEUR DE PÉRIODE ───── */}
              <View style={styles.periodRow}>
                {MOCK_REPORT_CARDS.map((report) => (
                  <UnderlineTab
                    key={report.id}
                    label={report.periodeCourte}
                    active={selectedPeriodId === report.id}
                    onPress={() => setSelectedPeriodId(report.id)}
                    compact
                  />
                ))}
              </View>

              {currentReport ? (
                <ReportCardView report={currentReport} colors={colors} />
              ) : (
                <EmptyState title="Aucun bulletin" description="Aucun bulletin n'est disponible pour le moment." icon="book-open" />
              )}

              {currentReport && (
                <TouchableOpacity
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel="Télécharger le bulletin"
                  style={[styles.downloadBtn, { borderColor: colors.border }]}
                >
                  <Feather name="download" size={15} color={BRAND_VIOLET} />
                  <Text style={[styles.downloadLabel, { color: BRAND_VIOLET }]}>Télécharger le bulletin</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <EmptyState {...emptyByTab[activeTab]} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerBackBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  headerEyebrow: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 1.2, textTransform: 'uppercase' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginTop: 2, letterSpacing: -0.3 },
  headerAvatarBtn: { width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  tabsBar: { borderBottomWidth: 1 },
  tabsBarContent: { paddingHorizontal: 16, gap: 22 },
  tabItem: { alignItems: 'center', paddingTop: 14, paddingBottom: 11 },
  tabItemCompact: { paddingTop: 0, paddingBottom: 8 },
  tabItemRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tabLabel: { fontSize: 13 },
  tabLabelCompact: { fontSize: 12.5 },
  tabUnderlineTrack: { height: 2, width: '100%', marginTop: 9, borderRadius: 1, overflow: 'hidden' },
  tabUnderline: { flex: 1, borderRadius: 1 },

  body: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 36 },

  periodRow: { flexDirection: 'row', gap: 22, marginBottom: 16, paddingLeft: 2 },

  reportCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingTop: 22,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 12 },
      android: { elevation: 1 },
    }),
  },
  reportHead: { paddingHorizontal: 20 },
  reportPeriod: { fontSize: 11.5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  reportHeroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reportHero: { fontSize: 40, fontWeight: '700', letterSpacing: -1.2 },
  reportHeroSuffix: { fontSize: 16, fontWeight: '500' },
  mentionPill: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 6 },
  mentionText: { fontSize: 12, fontWeight: '700' },
  reportDivider: { height: 1, marginTop: 20, marginBottom: 4 },

  subjectRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  subjectName: { fontSize: 14.5, fontWeight: '600', marginBottom: 5 },
  subjectMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  subjectMeta: { fontSize: 11.5 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5 },
  appreciation: { fontSize: 12, fontStyle: 'italic', marginTop: 6, lineHeight: 16 },

  gradeRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeRingText: { fontSize: 13.5, fontWeight: '700' },

  downloadBtn: {
    borderRadius: 13,
    borderWidth: 1,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  downloadLabel: { fontSize: 12.5, fontWeight: '600' },

  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 52 },
  emptyIcon: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 15.5, fontWeight: '700', marginBottom: 5 },
  emptyDescription: { fontSize: 12.5, textAlign: 'center', maxWidth: 260, lineHeight: 18 },
});