// src/screens/eleve/StudentCourseScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Pressable, RefreshControl, Modal, Alert, StatusBar,
  Image, TextInput, Animated, StyleSheet, useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedViewNative from '@react-native-masked-view/masked-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '../../components/ui/Layout';
import { useTheme } from '../../theme';

// ─── IDENTITÉ ZENIT ──────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#8B5CF6';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];
const MaskedView = MaskedViewNative as unknown as React.ComponentType<any>;
type FeatherIconName = keyof typeof Feather.glyphMap;

// ─── TYPES & MOCK ────────────────────────────────────────────────────────
interface CourseFile {
  id: string;
  nom: string;
  type: 'pdf' | 'word' | 'ppt' | 'excel' | 'image' | 'autre';
  url: string;
  taille: string;
  dateAjout: string;
}
interface Course {
  id: string;
  nom: string;
  professeur: string;
  professeurPhoto?: string;
  horaire: string;
  salle: string;
  coefficient: number;
  fichiers: CourseFile[];
}

const f = (id: string, nom: string, type: CourseFile['type'], taille: string, dateAjout: string): CourseFile =>
  ({ id, nom, type, url: 'https://example.com/' + id, taille, dateAjout });

const MOCK_COURSES: Course[] = [
  {
    id: '1', nom: 'Mathématiques', professeur: 'M. NGOMA', professeurPhoto: 'https://i.pravatar.cc/150?u=ngoma',
    horaire: '08:00 – 09:30', salle: 'A101', coefficient: 4,
    fichiers: [
      f('1-1', 'Cours Algèbre Chapitre 1', 'pdf', '2.4 MB', '15 Oct 2025'),
      f('1-2', 'Exercices corrigés Algèbre', 'pdf', '1.8 MB', '12 Oct 2025'),
      f('1-3', 'Fiche révision Géométrie', 'word', '856 KB', '10 Oct 2025'),
      f('1-4', 'Formulaire du trimestre', 'pdf', '640 KB', '08 Oct 2025'),
    ],
  },
  {
    id: '2', nom: 'Français', professeur: 'Mme LOUBAKI', professeurPhoto: 'https://i.pravatar.cc/150?u=loubaki',
    horaire: '10:00 – 11:30', salle: 'A102', coefficient: 4,
    fichiers: [
      f('2-1', 'Cours Le Roman', 'pdf', '3.2 MB', '14 Oct 2025'),
      f('2-2', 'Fiche Grammaire', 'word', '1.2 MB', '11 Oct 2025'),
    ],
  },
  {
    id: '3', nom: 'Anglais', professeur: 'M. WAMBA', professeurPhoto: 'https://i.pravatar.cc/150?u=wamba',
    horaire: '13:00 – 14:30', salle: 'Labo Langues', coefficient: 3,
    fichiers: [
      f('3-1', 'Cours Tenses', 'pdf', '1.5 MB', '13 Oct 2025'),
      f('3-2', 'Exercices Tenses', 'pdf', '950 KB', '13 Oct 2025'),
      f('3-3', 'Vocabulary list', 'ppt', '4.1 MB', '09 Oct 2025'),
    ],
  },
];

const FILE_LABEL: Record<CourseFile['type'], string> = { pdf: 'PDF', word: 'DOC', ppt: 'PPT', excel: 'XLS', image: 'IMG', autre: 'FILE' };
const LINES = ['72%', '100%', '92%', '100%', '84%', '100%', '58%'];

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

/** Matière = dossier (onglet + corps). Actif : rempli du dégradé de marque. */
const FolderCard = ({ course, active, onPress, colors }: { course: Course; active: boolean; onPress: () => void; colors: any }) => {
  const s = useRef(new Animated.Value(active ? 1 : 0.95)).current;
  useEffect(() => { Animated.spring(s, { toValue: active ? 1 : 0.95, damping: 15, stiffness: 200, useNativeDriver: true }).start(); }, [active]);
  const n = course.fichiers.length;
  const inner = (
    <>
      <View style={styles.folderTop}>
        {active ? <Feather name="folder" size={22} color="#FFFFFF" /> : <GradientIcon name="folder" size={22} />}
        <Feather name="more-vertical" size={16} color={active ? 'rgba(255,255,255,0.8)' : colors.textMuted} />
      </View>
      <View>
        <Text style={[styles.folderName, { color: active ? '#FFFFFF' : colors.text }]} numberOfLines={1}>{course.nom}</Text>
        <Text style={[styles.folderCount, { color: active ? 'rgba(255,255,255,0.8)' : colors.textMuted }]}>{n} fichier{n > 1 ? 's' : ''}</Text>
      </View>
    </>
  );
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={course.nom}>
      <Animated.View style={{ width: 158, marginRight: 12, transform: [{ scale: s }] }}>
        <View style={[styles.folderTab, { backgroundColor: active ? BRAND_ORANGE : colors.surfaceElevated, borderColor: colors.border, borderWidth: active ? 0 : StyleSheet.hairlineWidth }]} />
        {active ? (
          <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.folderBody}>{inner}</LinearGradient>
        ) : (
          <View style={[styles.folderBody, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderWidth: StyleSheet.hairlineWidth }]}>{inner}</View>
        )}
      </Animated.View>
    </Pressable>
  );
};

/** Fichier = miniature de page */
const FileThumb = ({ file, width, colors, onPress }: { file: CourseFile; width: number; colors: any; onPress: () => void }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ width, marginBottom: 20 }} accessibilityRole="button" accessibilityLabel={file.nom}>
    <View style={[styles.page, { height: width * 1.28, backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.pageHead}>
        <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '42%', height: 5, borderRadius: 3 }} />
        <Text style={[styles.pageType, { color: colors.textMuted }]}>{FILE_LABEL[file.type]}</Text>
      </View>
      {LINES.map((w, i) => (
        <View key={i} style={{ width: w as any, height: 3.5, borderRadius: 2, backgroundColor: colors.border, marginTop: i === 0 ? 12 : 7, opacity: 0.9 }} />
      ))}
    </View>
    <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={2}>{file.nom}</Text>
    <Text style={[styles.fileMeta, { color: colors.textMuted }]}>{file.taille}</Text>
  </TouchableOpacity>
);

// ─── ÉCRAN ────────────────────────────────────────────────────────────────
export const StudentCourseScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(MOCK_COURSES[0].id);
  const [selectedFile, setSelectedFile] = useState<CourseFile | null>(null);

  const q = query.trim().toLowerCase();
  const courses = MOCK_COURSES.filter(c =>
    !q || c.nom.toLowerCase().includes(q) || c.professeur.toLowerCase().includes(q) || c.fichiers.some(x => x.nom.toLowerCase().includes(q)));
  const course = courses.find(c => c.id === selectedId) || courses[0];
  const files = course ? course.fichiers.filter(x => !q || x.nom.toLowerCase().includes(q) || course.nom.toLowerCase().includes(q) || course.professeur.toLowerCase().includes(q)) : [];
  const thumbW = (width - 44 - 24) / 3;

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };
  const download = (file: CourseFile) => Alert.alert('Téléchargement', `Téléchargement de "${file.nom}" en cours...`, [{ text: 'OK' }]);
  const openWith = (file: CourseFile) => Alert.alert('Ouvrir avec', `Choisissez une application pour ouvrir "${file.nom}"`, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'PDF Viewer', onPress: () => Alert.alert('Ouverture', `Ouverture de ${file.nom} avec PDF Viewer`) },
    { text: 'Google Drive', onPress: () => Alert.alert('Ouverture', `Ouverture de ${file.nom} avec Google Drive`) },
  ]);

  return (
    <Layout variant="default">
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
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 32 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          <View style={{ paddingHorizontal: 22 }}>
            <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour" style={[styles.backBtn, { backgroundColor: colors.surfaceElevated }]}>
              <Feather name="arrow-left" size={18} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: colors.text }]}>Mes cours</Text>

            <View style={[styles.search, { backgroundColor: colors.surfaceElevated }]}>
              <Feather name="search" size={17} color={colors.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Rechercher une matière ou un document"
                placeholderTextColor={colors.textMuted}
                style={{ flex: 1, marginLeft: 10, fontSize: 14.5, color: colors.text }}
              />
              {!!query && <TouchableOpacity onPress={() => setQuery('')}><Feather name="x" size={16} color={colors.textMuted} /></TouchableOpacity>}
            </View>

            <Text style={[styles.label, { color: colors.textMuted }]}>MATIÈRES</Text>
          </View>

          {/* Dossiers */}
          {courses.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22 }} decelerationRate="fast" snapToInterval={170}>
              {courses.map(c => <FolderCard key={c.id} course={c} active={c.id === course?.id} onPress={() => setSelectedId(c.id)} colors={colors} />)}
            </ScrollView>
          ) : null}

          {course ? (
            <View key={course.id} style={{ paddingHorizontal: 22 }}>
              {/* Infos matière */}
              <FadeIn>
                <View style={styles.teacherRow}>
                  <View style={[styles.avatar, { backgroundColor: colors.surfaceElevated }]}>
                    {course.professeurPhoto
                      ? <Image source={{ uri: course.professeurPhoto }} style={{ width: 40, height: 40 }} />
                      : <Text style={{ fontWeight: '700', color: colors.text }}>{course.professeur[0]}</Text>}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.teacherName, { color: colors.text }]}>{course.professeur}</Text>
                    <Text style={[styles.teacherMeta, { color: colors.textMuted }]}>{course.horaire}  ·  {course.salle}  ·  Coef. {course.coefficient}</Text>
                  </View>
                </View>
              </FadeIn>

              <View style={styles.sectionRow}>
                <Text style={[styles.label, { color: colors.textMuted, marginTop: 0 }]}>DOCUMENTS</Text>
                <Text style={[styles.sectionCount, { color: colors.textMuted }]}>Date  ⌄</Text>
              </View>

              {files.length > 0 ? (
                <FadeIn delay={80}>
                  <View style={styles.grid}>
                    {files.map(file => <FileThumb key={file.id} file={file} width={thumbW} colors={colors} onPress={() => setSelectedFile(file)} />)}
                  </View>
                </FadeIn>
              ) : (
                <View style={styles.empty}>
                  <GradientIcon name="file-text" size={30} />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun document</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.empty}>
              <GradientIcon name={query ? 'search' : 'book-open'} size={32} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{query ? 'Aucun résultat' : 'Aucun cours disponible'}</Text>
            </View>
          )}
        </ScrollView>

        {/* ─── Actions fichier ─── */}
        <Modal visible={!!selectedFile} transparent animationType="fade" onRequestClose={() => setSelectedFile(null)}>
          <Pressable style={styles.backdrop} onPress={() => setSelectedFile(null)}>
            {selectedFile && (
              <Pressable style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.sheetIcon, { backgroundColor: colors.surfaceElevated }]}>
                  <GradientIcon name="file-text" size={26} />
                </View>
                <Text style={[styles.sheetTitle, { color: colors.text }]} numberOfLines={2}>{selectedFile.nom}</Text>
                <Text style={[styles.sheetMeta, { color: colors.textMuted }]}>{FILE_LABEL[selectedFile.type]}  ·  {selectedFile.taille}  ·  {selectedFile.dateAjout}</Text>

                <TouchableOpacity activeOpacity={0.85} onPress={() => { const x = selectedFile; setSelectedFile(null); openWith(x); }} style={{ marginTop: 22 }}>
                  <LinearGradient colors={GRADIENT_BRAND} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryBtn}>
                    <Feather name="eye" size={18} color="#FFFFFF" />
                    <Text style={styles.primaryText}>Ouvrir</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { const x = selectedFile; setSelectedFile(null); download(x); }} style={[styles.secondaryBtn, { backgroundColor: colors.surfaceElevated }]}>
                  <Feather name="download" size={17} color={colors.text} />
                  <Text style={[styles.secondaryText, { color: colors.text }]}>Télécharger</Text>
                </TouchableOpacity>
              </Pressable>
            )}
          </Pressable>
        </Modal>
      </View>
    </Layout>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -1, marginTop: 18 },
  search: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24, paddingHorizontal: 16, marginTop: 18 },
  label: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.2, marginTop: 28, marginBottom: 14 },

  folderTab: { width: 58, height: 14, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  folderBody: { height: 116, borderRadius: 20, borderTopLeftRadius: 0, padding: 16, justifyContent: 'space-between' },
  folderTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  folderName: { fontSize: 16, fontWeight: '600', letterSpacing: -0.3 },
  folderCount: { fontSize: 12, marginTop: 3 },

  teacherRow: { flexDirection: 'row', alignItems: 'center', marginTop: 26 },
  avatar: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  teacherName: { fontSize: 15, fontWeight: '600' },
  teacherMeta: { fontSize: 12.5, marginTop: 2 },

  sectionRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 28, marginBottom: 14 },
  sectionCount: { fontSize: 12.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 12 },

  page: { borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, padding: 10, overflow: 'hidden' },
  pageHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageType: { fontSize: 8.5, fontWeight: '700', letterSpacing: 0.6 },
  fileName: { fontSize: 12.5, fontWeight: '600', marginTop: 9, lineHeight: 16 },
  fileMeta: { fontSize: 11, marginTop: 2 },

  empty: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600', marginTop: 6 },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  sheet: { width: '86%', maxWidth: 340, borderRadius: 28, borderWidth: StyleSheet.hairlineWidth, padding: 24, alignItems: 'center' },
  sheetIcon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 17, fontWeight: '600', textAlign: 'center', marginTop: 14, letterSpacing: -0.3 },
  sheetMeta: { fontSize: 12.5, marginTop: 5, textAlign: 'center' },
  primaryBtn: { height: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, width: 260 },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  secondaryBtn: { height: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, width: 260, marginTop: 10 },
  secondaryText: { fontSize: 15, fontWeight: '600' },
});