// screens/eleve/StudentGradeDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface GradeDetail {
  id: string;
  periode: string;
  dateEmission: string;
  moyenneGenerale: number;
  mention: string;
  rang: number;
  effectifClasse: number;
  appreciation: string;
  matieres: {
    id: string;
    nom: string;
    moyenne: number;
    coefficient: number;
    appreciation: string;
    notes: {
      examen: string;
      note: number;
      coefficient: number;
    }[];
  }[];
}

const MOCK_GRADE_DETAIL: GradeDetail = {
  id: '1',
  periode: '1er Trimestre 2025-2026',
  dateEmission: '2025-12-15',
  moyenneGenerale: 15.5,
  mention: 'BIEN',
  rang: 3,
  effectifClasse: 32,
  appreciation: 'Bon trimestre, encourageant mais peut mieux faire.',
  matieres: [
    {
      id: '1',
      nom: 'Mathématiques',
      moyenne: 14.5,
      coefficient: 4,
      appreciation: 'Bon travail, participation active',
      notes: [
        { examen: 'Devoir 1', note: 13, coefficient: 1 },
        { examen: 'Devoir 2', note: 15, coefficient: 1 },
        { examen: 'Examen Trimestriel', note: 15, coefficient: 2 },
      ],
    },
    {
      id: '2',
      nom: 'Français',
      moyenne: 16.2,
      coefficient: 4,
      appreciation: 'Excellente expression écrite',
      notes: [
        { examen: 'Devoir 1', note: 15, coefficient: 1 },
        { examen: 'Devoir 2', note: 16, coefficient: 1 },
        { examen: 'Examen Trimestriel', note: 17, coefficient: 2 },
      ],
    },
    {
      id: '3',
      nom: 'Anglais',
      moyenne: 14.8,
      coefficient: 3,
      appreciation: 'Bonne progression',
      notes: [
        { examen: 'Devoir 1', note: 14, coefficient: 1 },
        { examen: 'Examen Trimestriel', note: 15, coefficient: 2 },
      ],
    },
  ],
};

const getGradeColor = (note: number) => {
  if (note >= 16) return '#10B981';
  if (note >= 14) return '#3B82F6';
  if (note >= 12) return '#8B5CF6';
  if (note >= 10) return '#F59E0B';
  return '#EF4444';
};

export const StudentGradeDetailScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [gradeDetail] = useState(MOCK_GRADE_DETAIL);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Bulletin ${gradeDetail.periode} - Moyenne: ${gradeDetail.moyenneGenerale.toFixed(2)}/20 - ${gradeDetail.mention}`,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le bulletin');
    }
  };

  if (!gradeDetail) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={['#F5A623', '#E0950A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 }}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold">Détail du bulletin</Text>
          <TouchableOpacity onPress={handleShare}>
            <Feather name="share-2" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View className="px-5 pt-6 pb-8">
        {/* En-tête bulletin */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 100 }}
        >
          <Card variant="elevated" className="items-center py-6 mb-6">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {gradeDetail.periode}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Émis le {gradeDetail.dateEmission}
            </Text>

            <View className="flex-row justify-between w-full mt-6">
              <View className="items-center flex-1">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Moyenne</Text>
                <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                  {gradeDetail.moyenneGenerale.toFixed(2)}
                </Text>
                <Text className="text-xs text-gray-400">/ 20</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Mention</Text>
                <Badge
                  text={gradeDetail.mention}
                  variant={
                    gradeDetail.mention === 'EXCELLENT' ? 'success' :
                    gradeDetail.mention === 'TRES_BIEN' ? 'info' :
                    gradeDetail.mention === 'BIEN' ? 'info' :
                    gradeDetail.mention === 'ASSEZ_BIEN' ? 'warning' : 'error'
                  }
                  size="md"
                />
              </View>
              <View className="items-center flex-1">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Rang</Text>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  {gradeDetail.rang}
                </Text>
                <Text className="text-xs text-gray-400">/ {gradeDetail.effectifClasse}</Text>
              </View>
            </View>

            {gradeDetail.appreciation && (
              <View className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl w-full">
                <Text className="text-sm italic text-gray-600 dark:text-gray-400 text-center">
                  "{gradeDetail.appreciation}"
                </Text>
              </View>
            )}
          </Card>
        </MotiView>

        {/* Détail des matières */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 150 }}
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Détail des matières
          </Text>
          {gradeDetail.matieres.map((matiere, index) => (
            <MotiView
              key={matiere.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 200 + index * 50 }}
            >
              <Card variant="elevated" className="mb-4 p-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-base font-semibold text-gray-900 dark:text-white">
                    {matiere.nom}
                  </Text>
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${getGradeColor(matiere.moyenne)}20` }}
                  >
                    <Text
                      className="text-lg font-bold"
                      style={{ color: getGradeColor(matiere.moyenne) }}
                    >
                      {matiere.moyenne.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Coefficient: {matiere.coefficient}
                  </Text>
                </View>

                {matiere.notes.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Détail des évaluations
                    </Text>
                    {matiere.notes.map((note, idx) => (
                      <View key={idx} className="flex-row justify-between py-1">
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          {note.examen}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Text className="text-sm font-medium text-gray-900 dark:text-white">
                            {note.note}
                          </Text>
                          <Text className="text-xs text-gray-400">coef {note.coefficient}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {matiere.appreciation && (
                  <Text className="text-xs italic text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                    {matiere.appreciation}
                  </Text>
                )}
              </Card>
            </MotiView>
          ))}
        </MotiView>
      </View>
    </ScrollView>
  );
};