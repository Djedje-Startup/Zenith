// screens/eleve/StudentGradeDetailScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, Pressable, Share, Alert, RefreshControl, StatusBar, Animated, StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#7C3AED';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];
const BAR_H = 168;

// ─── TYPES ────────────────────────────────────────────────────────────────
interface NoteDetail { examen: string; note: number; coefficient: number }
interface MatiereDetail { id: string; nom: string; court: string; moyenne: number; coefficient: number; appreciation: string; notes: NoteDetail[] }
interface GradeDetail {
  id: string;
  eleve: { prenoms: string; nom: string; photo?: string };
  periode: string;
  dateEmission: string;
  moyenneGenerale: number;
  mention: string;
  appreciation: string;
  matieres: MatiereDetail[];
}

// ─── MOCK (à remplacer par le hook React Query réel) ──────────────────────
const MOCK_GRADE_DETAIL: GradeDetail = {
  id: '1',
  eleve: { prenoms: 'Jean Junior', nom: 'MOUKOKO', photo: 'https://i.pravatar.cc/500?img=12' },
  periode: '1er Trimestre 2025-2026',
  dateEmission: '15 déc. 2025',
  moyenneGenerale: 15.5,
  mention: 'BIEN',
  appreciation: 'Bon trimestre, encourageant. Continue tes efforts sur ce rythme.',
  matieres: [
    { id: '1', nom: 'Mathématiques', court: 'Maths', moyenne: 14.5, coefficient: 4, appreciation: 'Bon travail, participation active',
      notes: [{ examen: 'Devoir 1', note: 13, coefficient: 1 }, { examen: 'Devoir 2', note: 15, coefficient: 1 }, { examen: 'Examen trimestriel', note: 15, coefficient: 2 }] },
    { id: '2', nom: 'Français', court: 'Franç.', moyenne: 16.2, coefficient: 4, appreciation: 'Excellente expression écrite',
      notes: [{ examen: 'Devoir 1', note: 15, coefficient: 1 }, { examen: 'Devoir 2', note: 16, coefficient: 1 }, { examen: 'Examen trimestriel', note: 17, coefficient: 2 }] },
    { id: '3', nom: 'Anglais', court: 'Angl.', moyenne: 14.8, coefficient: 3, appreciation: 'Bonne progression',
      notes: [{ examen: 'Devoir 1', note: 14, coefficient: 1 }, { examen: 'Examen trimestriel', note: 15, coefficient: 2 }] },
    { id: '4', nom: 'Physique-Chimie', court: 'Phys.', moyenne: 13.5, coefficient: 3, appreciation: 'Travaille la méthodologie',
      notes: [{ examen: 'Devoir 1', note: 12, coefficient: 1 }, { examen: 'Devoir 2', note: 14, coefficient: 1 }, { examen: 'Examen trimestriel', note: 14, coefficient: 2 }] },
    { id: '5', nom: 'SVT', court: 'SVT', moyenne: 17.0, coefficient: 2, appreciation: 'Excellentes connaissances',
      notes: [{ examen: 'Devoir 1', note: 16, coefficient: 1 }, { examen: 'Examen trimestriel', note: 18, coefficient: 2 }] },
  ],
};

const MENTION: Record<string, string> = { EXCELLENT: 'Excellent', TRES_BIEN: 'Très bien', BIEN: 'Bien', ASSEZ_BIEN: 'Assez bien' };

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(v, { toValue: 1, duration: 420, delay, useNativeDriver: true }).start(); }, []);
  return <Animated.View style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }}>{children}</Animated.View>;
};

// ─── ÉCRAN ────────────────────────────────────────────────────────────────
export const StudentGradeDetailScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [g] = useState(MOCK_GRADE_DETAIL);
  const [selectedId, setSelectedId] = useState(g.matieres[0].id);
  const [photoFailed, setPhotoFailed] = useState(false);

  const grow = useRef(g.matieres.map(() => new Animated.Value(0))).current;
  const avg = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.stagger(90, grow.map(v => Animated.timing(v, { toValue: 1, duration: 800, useNativeDriver: false }))).start();
    Animated.timing(avg, { toValue: g.moyenneGenerale / 20, duration: 1000, delay: 200, useNativeDriver: false }).start();
  }, []);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };
  const handleShare = async () => {
    try {
      await Share.share({ message: `Bulletin ${g.periode}\n${g.eleve.prenoms} ${g.eleve.nom}\nMoyenne : ${g.moyenneGenerale.toFixed(1)}/20` });
    } catch { Alert.alert('Erreur', 'Impossible de partager le bulletin'); }
  };

  const sel = g.matieres.find(m => m.id === selectedId) || g.matieres[0];
  const initials = `${g.eleve.prenoms[0]}${g.eleve.nom[0]}`;
  const inner = 96;

  return (
    <Layout variant="default" withSafeArea={false}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        <LinearGradient
          pointerEvents="none"
          colors={[`${BRAND_VIOLET}40`, `${BRAND_ORANGE}22`, 'transparent']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[StyleSheet.absoluteFill, { height: 420 }]}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 36 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          {/* Barre du haut */}
          <View style={styles.topBar}>
            <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour" style={[styles.roundBtn, { backgroundColor: colors.surfaceElevated }]}>
              <Feather name="arrow-left" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.topTitle, { color: colors.text }]}>Bulletin</Text>
            <TouchableOpacity activeOpacity={0.75} onPress={handleShare} accessibilityRole="button" accessibilityLabel="Partager" style={[styles.roundBtn, { backgroundColor: colors.surfaceElevated }]}>
              <Feather name="share-2" size={17} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* ───── HÉROS : photo + moyenne ───── */}
          <FadeIn>
            <View style={styles.hero}>
              <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ring}>
                <View style={[styles.ringGap, { backgroundColor: colors.background }]}>
                  <View style={[styles.photo, { backgroundColor: colors.surfaceElevated }]}>
                    {g.eleve.photo && !photoFailed
                      ? <Image source={{ uri: g.eleve.photo }} style={{ width: inner, height: inner }} resizeMode="cover" onError={() => setPhotoFailed(true)} />
                      : <Text style={{ fontSize: 30, fontWeight: '600', color: colors.text }}>{initials}</Text>}
                  </View>
                </View>
              </LinearGradient>

              <Text style={[styles.name, { color: colors.text }]}>{g.eleve.prenoms} {g.eleve.nom}</Text>
              <Text style={[styles.period, { color: colors.textMuted }]}>{g.periode}</Text>

              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 22 }}>
                <Text style={[styles.avg, { color: colors.text }]}>{g.moyenneGenerale.toFixed(1)}</Text>
                <Text style={[styles.avgUnit, { color: colors.textMuted }]}>/20</Text>
              </View>

              <View style={[styles.track, { backgroundColor: colors.surfaceElevated }]}>
                <Animated.View style={{ height: 5, borderRadius: 3, overflow: 'hidden', width: avg.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }}>
                  <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                </Animated.View>
              </View>

              <View style={[styles.mention, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.mentionText, { color: colors.text }]}>Mention {MENTION[g.mention] ?? g.mention}</Text>
              </View>

              <Text style={[styles.appreciation, { color: colors.textMuted }]}>{g.appreciation}</Text>
            </View>
          </FadeIn>

          {/* ───── PROFIL PAR MATIÈRE : barres ───── */}
          <FadeIn delay={150}>
            <View style={[styles.chart, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.chartHead}>
                <Text style={[styles.chartTitle, { color: colors.text }]}>Résultats par matière</Text>
                <Text style={[styles.chartHint, { color: colors.textMuted }]}>Touchez une barre</Text>
              </View>

              <View style={styles.bars}>
                {g.matieres.map((m, i) => {
                  const active = m.id === sel.id;
                  return (
                    <Pressable key={m.id} onPress={() => setSelectedId(m.id)} accessibilityRole="button" accessibilityLabel={`${m.nom}, ${m.moyenne.toFixed(1)}`} style={styles.barCol}>
                      <Text style={[styles.barValue, { color: active ? colors.text : colors.textMuted, fontWeight: active ? '700' : '500' }]}>{m.moyenne.toFixed(1)}</Text>
                      <View style={[styles.barTrack, { backgroundColor: colors.surfaceElevated }]}>
                        <Animated.View style={{ width: '100%', opacity: active ? 1 : 0.38, height: grow[i].interpolate({ inputRange: [0, 1], outputRange: [0, (BAR_H * m.moyenne) / 20] }) }}>
                          <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
                        </Animated.View>
                      </View>
                      <Text style={[styles.barLabel, { color: active ? colors.text : colors.textMuted, fontWeight: active ? '600' : '500' }]} numberOfLines={1}>{m.court}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </FadeIn>

          {/* ───── DÉTAIL DE LA MATIÈRE ───── */}
          <View key={sel.id} style={{ paddingHorizontal: 22 }}>
            <FadeIn>
              <View style={styles.detailHead}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.detailName, { color: colors.text }]}>{sel.nom}</Text>
                  <Text style={[styles.detailMeta, { color: colors.textMuted }]}>Coefficient {sel.coefficient}  ·  {sel.appreciation}</Text>
                </View>
                <Text style={[styles.detailGrade, { color: colors.text }]}>{sel.moyenne.toFixed(1)}</Text>
              </View>

              {sel.notes.map((n, i) => (
                <View key={`${n.examen}-${i}`} style={[styles.noteRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.noteName, { color: colors.text }]}>{n.examen}</Text>
                    <Text style={[styles.noteCoef, { color: colors.textMuted }]}>Coef. {n.coefficient}</Text>
                  </View>
                  <View style={[styles.notePill, { backgroundColor: colors.surfaceElevated }]}>
                    <Text style={[styles.noteValue, { color: colors.text }]}>{n.note}<Text style={{ color: colors.textMuted, fontWeight: '400' }}> /20</Text></Text>
                  </View>
                </View>
              ))}
            </FadeIn>
          </View>

          <Text style={[styles.footer, { color: colors.textMuted }]}>Émis le {g.dateEmission}</Text>
        </ScrollView>
      </View>
    </Layout>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  roundBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },

  hero: { alignItems: 'center', paddingHorizontal: 28, paddingTop: 26 },
  ring: { width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center' },
  ringGap: { width: 106, height: 106, borderRadius: 53, alignItems: 'center', justifyContent: 'center' },
  photo: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontWeight: '600', letterSpacing: -0.5, marginTop: 16, textAlign: 'center' },
  period: { fontSize: 13, marginTop: 4 },
  avg: { fontSize: 68, fontWeight: '200', letterSpacing: -3 },
  avgUnit: { fontSize: 18, fontWeight: '400', marginLeft: 4 },
  track: { width: 150, height: 5, borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  mention: { paddingHorizontal: 16, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  mentionText: { fontSize: 12.5, fontWeight: '600' },
  appreciation: { fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 16, fontStyle: 'italic' },

  chart: { marginHorizontal: 16, marginTop: 30, borderRadius: 28, borderWidth: StyleSheet.hairlineWidth, paddingTop: 20, paddingBottom: 16, paddingHorizontal: 12 },
  chartHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 18 },
  chartTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },
  chartHint: { fontSize: 11.5 },
  bars: { flexDirection: 'row' },
  barCol: { flex: 1, alignItems: 'center' },
  barValue: { fontSize: 13, marginBottom: 8 },
  barTrack: { width: 34, height: BAR_H, borderRadius: 17, overflow: 'hidden', justifyContent: 'flex-end' },
  barLabel: { fontSize: 11.5, marginTop: 10 },

  detailHead: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 14 },
  detailName: { fontSize: 20, fontWeight: '600', letterSpacing: -0.4 },
  detailMeta: { fontSize: 12.5, marginTop: 4, lineHeight: 18, paddingRight: 12 },
  detailGrade: { fontSize: 34, fontWeight: '300', letterSpacing: -1 },
  noteRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  noteName: { fontSize: 14.5, fontWeight: '500' },
  noteCoef: { fontSize: 12, marginTop: 2 },
  notePill: { paddingHorizontal: 14, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  noteValue: { fontSize: 14, fontWeight: '700' },

  footer: { fontSize: 12, textAlign: 'center', marginTop: 26 },
});