// screens/eleve/StudentGradesScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar, Animated, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#7C3AED';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];

// ─── TYPES ────────────────────────────────────────────────────────────────
interface Grade {
  id: string;
  matiere: string;
  moyenne: number;
  coefficient: number;
  appreciation?: string;
}

interface ReportCard {
  id: string;
  periode: string;
  moyenneGenerale: number;
  mention: string;
  matieres: Grade[];
}

interface Parcours {
  id: string;
  annee: string;
  classe: string;
  statut: 'ADMIS' | 'REDOUBLE' | 'EN_COURS';
  moyenne?: number;
  mention?: string;
  appreciation?: string;
}

// ─── MOCK (à remplacer par les hooks React Query réels) ───────────────────
const MOCK_PARCOURS: Parcours[] = [
  { id: 'p1', annee: '2024-2025', classe: '3ème A', statut: 'EN_COURS', moyenne: 15.5, mention: 'BIEN', appreciation: 'Bon parcours, continue tes efforts' },
  { id: 'p2', annee: '2023-2024', classe: '4ème B', statut: 'ADMIS', moyenne: 14.2, mention: 'BIEN', appreciation: 'Admis avec mention Bien' },
  { id: 'p3', annee: '2022-2023', classe: '5ème A', statut: 'REDOUBLE', moyenne: 8.5, mention: 'INSUFFISANT', appreciation: 'Résultats insuffisants, redoublement nécessaire' },
];

const MOCK_REPORT_CARDS: ReportCard[] = [
  {
    id: '1', periode: '1er Trimestre 2024-2025', moyenneGenerale: 15.5, mention: 'BIEN',
    matieres: [
      { id: '1', matiere: 'Mathématiques', moyenne: 14.5, coefficient: 4 },
      { id: '2', matiere: 'Français', moyenne: 16.2, coefficient: 4 },
      { id: '3', matiere: 'Anglais', moyenne: 14.8, coefficient: 3 },
      { id: '4', matiere: 'Physique-Chimie', moyenne: 13.5, coefficient: 3 },
      { id: '5', matiere: 'SVT', moyenne: 17.0, coefficient: 2 },
    ],
  },
  {
    id: '2', periode: '2e Trimestre 2024-2025', moyenneGenerale: 16.2, mention: 'TRES_BIEN',
    matieres: [
      { id: '6', matiere: 'Mathématiques', moyenne: 15.5, coefficient: 4 },
      { id: '7', matiere: 'Français', moyenne: 17.0, coefficient: 4 },
      { id: '8', matiere: 'Anglais', moyenne: 15.2, coefficient: 3 },
      { id: '9', matiere: 'Histoire-Géo', moyenne: 14.8, coefficient: 2 },
    ],
  },
  {
    id: '3', periode: '3e Trimestre 2024-2025', moyenneGenerale: 17.8, mention: 'EXCELLENT',
    matieres: [
      { id: '10', matiere: 'Mathématiques', moyenne: 18.0, coefficient: 4 },
      { id: '11', matiere: 'Français', moyenne: 17.5, coefficient: 4 },
      { id: '12', matiere: 'Anglais', moyenne: 16.8, coefficient: 3 },
    ],
  },
];

const STATUT_LABEL: Record<Parcours['statut'], string> = { ADMIS: 'Admis', REDOUBLE: 'Redoublé', EN_COURS: 'En cours' };

// ─── HELPERS COULEUR ────────────────────────────────────────────────────
const getMentionConfig = (mention: string | undefined, colors: any) => {
  switch (mention) {
    case 'EXCELLENT': return { label: 'Excellent', color: colors.success };
    case 'TRES_BIEN': return { label: 'Très bien', color: colors.info };
    case 'BIEN': return { label: 'Bien', color: BRAND_VIOLET };
    case 'ASSEZ_BIEN': return { label: 'Assez bien', color: colors.warning };
    default: return { label: 'Insuffisant', color: colors.error };
  }
};

const statutColor = (colors: any, statut: Parcours['statut']) =>
  statut === 'ADMIS' ? colors.success : statut === 'REDOUBLE' ? colors.error : colors.info;

// ─── ONGLETS DU HEADER (posés sur le dégradé — texte et trait blancs) ────
const UnderlineTab = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, { toValue: active ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  }, [active]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }} style={styles.tabItem}>
      <Text style={[styles.tabLabel, { opacity: active ? 1 : 0.65, fontWeight: active ? '700' : '500' }]}>{label}</Text>
      <Animated.View style={[styles.tabUnderlineTrack, { opacity: progress }]}>
        <View style={styles.tabUnderline} />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── ANNEAU DE NOTE ─────────────────────────────────────────────────────
const GradeRing = ({ note, color, size = 46 }: { note: number; color: string; size?: number }) => (
  <View style={[styles.gradeRing, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
    <Text style={[styles.gradeRingText, { color, fontSize: size * 0.3 }]}>{note.toFixed(1)}</Text>
  </View>
);

const Pill = ({ label, color }: { label: string; color: string }) => (
  <View style={[styles.pill, { borderColor: `${color}45` }]}>
    <Text style={[styles.pillText, { color }]}>{label}</Text>
  </View>
);

// ─── LIGNE BULLETIN ─────────────────────────────────────────────────────
const ReportRow = ({ report, isLast, onPress, colors }: { report: ReportCard; isLast: boolean; onPress: () => void; colors: any }) => {
  const mentionConfig = getMentionConfig(report.mention, colors);
  const totalCoef = report.matieres.reduce((acc, m) => acc + m.coefficient, 0);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${report.periode}, moyenne ${report.moyenneGenerale.toFixed(1)}`}
      style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
    >
      <View style={{ flex: 1, marginRight: 14 }}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{report.periode}</Text>
        <View style={styles.rowMetaRow}>
          <Pill label={mentionConfig.label} color={mentionConfig.color} />
          <Text style={[styles.rowMeta, { color: colors.textMuted }]}>
            {report.matieres.length} matières · Coef. {totalCoef}
          </Text>
        </View>
      </View>
      <GradeRing note={report.moyenneGenerale} color={mentionConfig.color} />
      <Feather name="chevron-right" size={16} color={colors.textMuted} style={{ marginLeft: 10 }} />
    </TouchableOpacity>
  );
};

// ─── LIGNE PARCOURS ─────────────────────────────────────────────────────
const ParcoursRow = ({ item, isLast, colors }: { item: Parcours; isLast: boolean; colors: any }) => {
  const mentionConfig = getMentionConfig(item.mention, colors);
  const sColor = statutColor(colors, item.statut);

  return (
    <View style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
      <View style={{ flex: 1, marginRight: 14 }}>
        <View style={styles.parcoursHead}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>{item.classe}</Text>
          <Text style={[styles.rowMeta, { color: colors.textMuted }]}>{item.annee}</Text>
        </View>
        <View style={styles.rowMetaRow}>
          <Pill label={STATUT_LABEL[item.statut]} color={sColor} />
          {item.mention && <Pill label={mentionConfig.label} color={mentionConfig.color} />}
        </View>
        {item.appreciation && (
          <Text style={[styles.appreciation, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.appreciation}
          </Text>
        )}
      </View>
      {item.moyenne !== undefined && <GradeRing note={item.moyenne} color={mentionConfig.color} />}
    </View>
  );
};

// ─── SCREEN PRINCIPAL ───────────────────────────────────────────────────
export const StudentGradesScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'bulletins' | 'parcours'>('bulletins');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* ───── HEADER ───── */}
        <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.header, { paddingTop: insets.top + 18 }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerEyebrow}>Élève</Text>
              <Text style={styles.headerTitle}>Mes notes</Text>
            </View>
            <View style={styles.headerChip}>
              <Text style={styles.headerChipLabel}>Bulletins</Text>
              <Text style={styles.headerChipValue}>{MOCK_REPORT_CARDS.length}</Text>
            </View>
          </View>

          <View style={styles.headerTabsRow}>
            <UnderlineTab label="Bulletins" active={activeTab === 'bulletins'} onPress={() => setActiveTab('bulletins')} />
            <UnderlineTab label="Mon parcours" active={activeTab === 'parcours'} onPress={() => setActiveTab('parcours')} />
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {activeTab === 'bulletins' ? (
            <>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Périodes</Text>
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
                {MOCK_REPORT_CARDS.map((report, i) => (
                  <ReportRow
                    key={report.id}
                    report={report}
                    isLast={i === MOCK_REPORT_CARDS.length - 1}
                    onPress={() => navigation.navigate('StudentGradeDetail', { reportId: report.id })}
                    colors={colors}
                  />
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Historique</Text>
              <Text style={[styles.introText, { color: colors.textSecondary }]}>
                L'historique de ton parcours scolaire, classe par classe.
              </Text>
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow, marginTop: 12 }]}>
                {MOCK_PARCOURS.map((item, i) => (
                  <ParcoursRow key={item.id} item={item} isLast={i === MOCK_PARCOURS.length - 1} colors={colors} />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: { paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerEyebrow: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 1.4, textTransform: 'uppercase' },
  headerTitle: { fontSize: 23, fontWeight: '700', color: '#FFFFFF', marginTop: 3, letterSpacing: -0.4 },
  headerChip: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 8, alignItems: 'center' },
  headerChipLabel: { fontSize: 9.5, color: 'rgba(255,255,255,0.7)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.4 },
  headerChipValue: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginTop: 1 },

  headerTabsRow: { flexDirection: 'row', gap: 22, marginTop: 18 },
  tabItem: { alignItems: 'center', paddingBottom: 4 },
  tabLabel: { fontSize: 13.5, color: '#FFFFFF' },
  tabUnderlineTrack: { height: 2, width: '100%', marginTop: 8, borderRadius: 1, overflow: 'hidden' },
  tabUnderline: { flex: 1, borderRadius: 1, backgroundColor: '#FFFFFF' },

  body: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 36 },
  sectionLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.1, marginBottom: 10 },
  introText: { fontSize: 12.5, lineHeight: 18, marginBottom: 2 },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 10 },
      android: { elevation: 1 },
    }),
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  rowTitle: { fontSize: 14.5, fontWeight: '600', marginBottom: 6 },
  rowMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  rowMeta: { fontSize: 11.5 },
  parcoursHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 6 },
  appreciation: { fontSize: 12, fontStyle: 'italic', marginTop: 6, lineHeight: 16 },

  gradeRing: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  gradeRingText: { fontWeight: '700' },

  pill: { borderWidth: 1, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 3 },
  pillText: { fontSize: 10.5, fontWeight: '700' },
});