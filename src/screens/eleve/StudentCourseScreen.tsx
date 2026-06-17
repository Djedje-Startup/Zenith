// src/screens/eleve/StudentCourseScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Share,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';

const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.10)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.09)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  teal: '#2DD4BF',
  tealBg: 'rgba(45,212,191,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

// Types
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
  horaire: string;
  salle: string;
  coefficient: number;
  description?: string;
  fichiers: CourseFile[];
  coursCount?: number;
}

// Mock Data enrichi
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    nom: 'Mathématiques',
    professeur: 'M. NGOMA',
    horaire: '08:00 - 09:30',
    salle: 'A101',
    coefficient: 4,
    description: 'Cours de mathématiques - Algèbre et Géométrie',
    coursCount: 12,
    fichiers: [
      { id: '1-1', nom: 'Cours Algèbre Chapitre 1', type: 'pdf', url: 'https://example.com/cours1.pdf', taille: '2.4 MB', dateAjout: '15 Oct 2025' },
      { id: '1-2', nom: 'Exercices corrigés - Algèbre', type: 'pdf', url: 'https://example.com/exercices.pdf', taille: '1.8 MB', dateAjout: '12 Oct 2025' },
      { id: '1-3', nom: 'Fiche révision - Géométrie', type: 'word', url: 'https://example.com/fiche.docx', taille: '856 KB', dateAjout: '10 Oct 2025' },
    ],
  },
  {
    id: '2',
    nom: 'Français',
    professeur: 'Mme LOUBAKI',
    horaire: '10:00 - 11:30',
    salle: 'A102',
    coefficient: 4,
    description: 'Cours de français - Littérature et Grammaire',
    coursCount: 10,
    fichiers: [
      { id: '2-1', nom: 'Cours - Le Roman', type: 'pdf', url: 'https://example.com/roman.pdf', taille: '3.2 MB', dateAjout: '14 Oct 2025' },
      { id: '2-2', nom: 'Fiche de révision - Grammaire', type: 'word', url: 'https://example.com/grammaire.docx', taille: '1.2 MB', dateAjout: '11 Oct 2025' },
    ],
  },
  {
    id: '3',
    nom: 'Anglais',
    professeur: 'M. WAMBA',
    horaire: '13:00 - 14:30',
    salle: 'Labo Langues',
    coefficient: 3,
    description: 'Cours d\'anglais - Grammaire et Vocabulaire',
    coursCount: 8,
    fichiers: [
      { id: '3-1', nom: 'Cours - Tenses', type: 'pdf', url: 'https://example.com/tenses.pdf', taille: '1.5 MB', dateAjout: '13 Oct 2025' },
      { id: '3-2', nom: 'Exercices - Tenses', type: 'pdf', url: 'https://example.com/tenses-exercices.pdf', taille: '950 KB', dateAjout: '13 Oct 2025' },
    ],
  },
];

// Configuration des types de fichiers
const FILE_ICONS: Record<CourseFile['type'], { icon: keyof typeof Feather.glyphMap; color: string; label: string }> = {
  pdf: { icon: 'file-text', color: C.red, label: 'PDF' },
  word: { icon: 'file', color: C.blue, label: 'Word' },
  ppt: { icon: 'file', color: C.amber, label: 'PPT' },
  excel: { icon: 'file', color: C.green, label: 'Excel' },
  image: { icon: 'image', color: C.purple, label: 'Image' },
  autre: { icon: 'file', color: C.textMuted, label: 'Fichier' },
};

// Composants
interface FileActionModalProps {
  visible: boolean;
  file: CourseFile | null;
  onClose: () => void;
  onDownload: () => void;
  onOpenWith: () => void;
}

const FileActionModal: React.FC<FileActionModalProps> = ({
  visible,
  file,
  onClose,
  onDownload,
  onOpenWith,
}) => {
  if (!file) return null;

  const fileConfig = FILE_ICONS[file.type] || FILE_ICONS.autre;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{
          backgroundColor: C.surface,
          borderRadius: 24,
          padding: 24,
          width: '85%',
          maxWidth: 340,
          borderWidth: 1,
          borderColor: C.border,
        }}>
          {/* En-tête */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: fileConfig.color + '15',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}>
              <Feather name={fileConfig.icon} size={28} color={fileConfig.color} />
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: C.textPrimary,
              textAlign: 'center',
            }}>
              {file.nom}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
              <Text style={{ fontSize: 12, color: C.textMuted }}>{fileConfig.label}</Text>
              <Text style={{ fontSize: 12, color: C.textDim }}>•</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>{file.taille}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenWith}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: C.accentBg,
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: C.accent + '30',
              }}
            >
              <Feather name="eye" size={20} color={C.accentDim} />
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                color: C.accentDim,
                marginLeft: 12,
              }}>
                Ouvrir avec
              </Text>
              <Feather name="chevron-right" size={18} color={C.accentDim} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDownload}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: C.surfaceAlt,
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Feather name="download" size={20} color={C.textSecondary} />
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                color: C.textSecondary,
                marginLeft: 12,
              }}>
                Télécharger
              </Text>
              <Feather name="chevron-right" size={18} color={C.textMuted} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>

          {/* Bouton fermer */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={{
              marginTop: 16,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: C.textMuted,
            }}>
              Fermer
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Screen principal
export const StudentCourseScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [courses] = useState(MOCK_COURSES);
  const [selectedFile, setSelectedFile] = useState<CourseFile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleFilePress = (file: CourseFile) => {
    setSelectedFile(file);
    setModalVisible(true);
  };

  const handleDownload = async (file: CourseFile) => {
    try {
      // Simulation de téléchargement
      Alert.alert(
        'Téléchargement',
        `Téléchargement de "${file.nom}" en cours...`,
        [{ text: 'OK' }]
      );
      // Dans la vraie vie : utiliser FileSystem.downloadAsync
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de télécharger le fichier');
    }
  };

  const handleOpenWith = async (file: CourseFile) => {
    try {
      // Simulation d'ouverture
      Alert.alert(
        'Ouvrir avec',
        `Choisissez une application pour ouvrir "${file.nom}"`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'PDF Viewer', onPress: () => Alert.alert('Ouverture', `Ouverture de ${file.nom} avec PDF Viewer`) },
          { text: 'Google Drive', onPress: () => Alert.alert('Ouverture', `Ouverture de ${file.nom} avec Google Drive`) },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le fichier');
    }
  };

  const renderFileItem = (file: CourseFile) => {
    const fileConfig = FILE_ICONS[file.type] || FILE_ICONS.autre;

    return (
      <TouchableOpacity
        key={file.id}
        activeOpacity={0.7}
        onPress={() => handleFilePress(file)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: C.surfaceAlt,
          borderRadius: 12,
          padding: 12,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: C.border,
        }}
      >
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: fileConfig.color + '15',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <Feather name={fileConfig.icon} size={18} color={fileConfig.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: C.textPrimary,
          }} numberOfLines={1}>
            {file.nom}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 11, color: C.textMuted }}>{fileConfig.label}</Text>
            <Text style={{ fontSize: 11, color: C.textDim }}>•</Text>
            <Text style={{ fontSize: 11, color: C.textMuted }}>{file.taille}</Text>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedFile(file);
              handleDownload(file);
            }}
            style={{
              padding: 6,
              borderRadius: 8,
              backgroundColor: C.accentBg,
            }}
          >
            <Feather name="download" size={16} color={C.accentDim} />
          </TouchableOpacity>
          <Feather name="chevron-right" size={16} color={C.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderCourseCard = ({ item }: { item: Course }) => {
    const hasFiles = item.fichiers && item.fichiers.length > 0;

    return (
      <View style={{ marginBottom: 16 }}>
        <Card variant="default" padding="md">
          {/* En-tête du cours */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary }}>
                  {item.nom}
                </Text>
                {item.coursCount && (
                  <View style={{
                    backgroundColor: C.accentBg,
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: C.accentDim }}>
                      {item.coursCount} cours
                    </Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 14, color: C.textSecondary, marginTop: 2 }}>
                {item.professeur}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="clock" size={14} color={C.textMuted} />
                  <Text style={{ fontSize: 12, color: C.textMuted }}>{item.horaire}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="map-pin" size={14} color={C.textMuted} />
                  <Text style={{ fontSize: 12, color: C.textMuted }}>{item.salle}</Text>
                </View>
              </View>
            </View>
            <View style={{
              backgroundColor: C.accentBg,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: C.accentDim }}>
                Coef. {item.coefficient}
              </Text>
            </View>
          </View>

          {/* Description */}
          {item.description && (
            <Text style={{
              fontSize: 13,
              color: C.textSecondary,
              marginTop: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}>
              {item.description}
            </Text>
          )}

          {/* Fichiers du cours */}
          {hasFiles && (
            <View style={{ marginTop: 12 }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <Text style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}>
                  Documents ({item.fichiers.length})
                </Text>
                <Text style={{ fontSize: 10, color: C.textMuted }}>
                  {item.fichiers.reduce((acc, f) => acc + parseFloat(f.taille), 0).toFixed(1)} MB
                </Text>
              </View>
              {item.fichiers.map(renderFileItem)}
            </View>
          )}

          {/* Bouton Voir tout */}
          {hasFiles && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                marginTop: 8,
                paddingVertical: 8,
                alignItems: 'center',
                backgroundColor: C.surfaceAlt,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: C.accentDim,
                letterSpacing: 0.3,
              }}>
                Voir tous les documents →
              </Text>
            </TouchableOpacity>
          )}

          {/* Statistiques */}
          <View style={{
            flexDirection: 'row',
            marginTop: hasFiles ? 10 : 0,
            paddingTop: hasFiles ? 10 : 0,
            borderTopWidth: hasFiles ? 1 : 0,
            borderTopColor: C.border,
          }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Documents
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary }}>
                {item.fichiers?.length || 0}
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: C.border }} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Poids total
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary }}>
                {item.fichiers ? item.fichiers.reduce((acc, f) => acc + parseFloat(f.taille), 0).toFixed(1) : '0'} MB
              </Text>
            </View>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <Layout variant="default">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 56,
            paddingBottom: 24,
            paddingHorizontal: 22,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                Élève
              </Text>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}>
                Cours & Documents
              </Text>
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 10,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Total
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {courses.reduce((acc, c) => acc + (c.fichiers?.length || 0), 0)}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={{
            flexDirection: 'row',
            marginTop: 16,
          }}>
            {[
              { label: 'Matières', value: courses.length.toString(), icon: 'book' },
              { label: 'Documents', value: courses.reduce((acc, c) => acc + (c.fichiers?.length || 0), 0).toString(), icon: 'file-text' },
            ].map((stat, index) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: index === 0 ? 10 : 0,
              }}>
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                  <Feather name={stat.icon as any} size={14} color="rgba(255,255,255,0.6)" />
                </View>
                <View>
                  <Text style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {stat.label}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}>
                    {stat.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>

        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={renderCourseCard}
          ListEmptyComponent={
            <View style={{
              padding: 40,
              alignItems: 'center',
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: C.accentBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Feather name="book-open" size={36} color={C.accentDim} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary }}>
                Aucun cours disponible
              </Text>
              <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginTop: 4 }}>
                Aucun cours n'est disponible pour le moment
              </Text>
            </View>
          }
        />

        {/* Modal d'action fichier */}
        <FileActionModal
          visible={modalVisible}
          file={selectedFile}
          onClose={() => {
            setModalVisible(false);
            setSelectedFile(null);
          }}
          onDownload={() => {
            if (selectedFile) {
              handleDownload(selectedFile);
              setModalVisible(false);
            }
          }}
          onOpenWith={() => {
            if (selectedFile) {
              handleOpenWith(selectedFile);
              setModalVisible(false);
            }
          }}
        />
      </View>
    </Layout>
  );
};