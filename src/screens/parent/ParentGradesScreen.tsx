// screens/parent/ParentGradesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/animations/EmptyState';
import { cn } from '../../utils/cn';

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

const MOCK_REPORT_CARDS: ReportCard[] = [
  {
    id: '1',
    periode: '1er Trimestre 2025-2026',
    moyenneGenerale: 15.5,
    mention: 'BIEN',
    matieres: [
      { id: '1', matiere: 'Mathématiques', moyenne: 14.5, coefficient: 4, appreciation: 'Bon travail' },
      { id: '2', matiere: 'Français', moyenne: 16.2, coefficient: 4, appreciation: 'Excellent' },
      { id: '3', matiere: 'Anglais', moyenne: 14.8, coefficient: 3, appreciation: 'Bonne progression' },
    ],
  },
  {
    id: '2',
    periode: '2ème Trimestre 2025-2026',
    moyenneGenerale: 16.2,
    mention: 'TRES_BIEN',
    matieres: [
      { id: '4', matiere: 'Mathématiques', moyenne: 15.5, coefficient: 4, appreciation: 'Progression' },
      { id: '5', matiere: 'Français', moyenne: 17.0, coefficient: 4, appreciation: 'Excellent' },
    ],
  },
];

const getMentionColor = (mention: string) => {
  switch (mention) {
    case 'EXCELLENT': return '#10B981';
    case 'TRES_BIEN': return '#3B82F6';
    case 'BIEN': return '#8B5CF6';
    case 'ASSEZ_BIEN': return '#F59E0B';
    default: return '#EF4444';
  }
};

const getGradeColor = (note: number) => {
  if (note >= 16) return '#10B981';
  if (note >= 14) return '#3B82F6';
  if (note >= 12) return '#8B5CF6';
  if (note >= 10) return '#F59E0B';
  return '#EF4444';
};

export const ParentGradesScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(MOCK_REPORT_CARDS[0].id);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const currentReport = MOCK_REPORT_CARDS.find(r => r.id === selectedPeriod);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={['#F5A623', '#E0950A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 }}
      >
        <Text className="text-white text-xl font-bold">Notes et bulletins</Text>
      </LinearGradient>

      {/* Sélecteur de période */}
      {MOCK_REPORT_CARDS.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-4 px-5"
          contentContainerStyle={{ gap: 10 }}
        >
          {MOCK_REPORT_CARDS.map((report) => (
            <TouchableOpacity
              key={report.id}
              onPress={() => setSelectedPeriod(report.id)}
              className={cn(
                'px-4 py-2 rounded-full',
                selectedPeriod === report.id
                  ? 'bg-primary-500'
                  : 'bg-white dark:bg-gray-800'
              )}
            >
              <Text
                className={selectedPeriod === report.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
              >
                {report.periode}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Contenu */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {currentReport ? (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 100 }}
          >
            {/* En-tête bulletin */}
            <Card variant="elevated" className="items-center py-6 mb-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                {currentReport.periode}
              </Text>

              <View className="flex-row justify-between w-full mt-6">
                <View className="items-center flex-1">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Moyenne</Text>
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentReport.moyenneGenerale.toFixed(2)}
                  </Text>
                  <Text className="text-xs text-gray-400">/ 20</Text>
                </View>
                <View className="items-center flex-1">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Mention</Text>
                  <Badge
                    text={currentReport.mention}
                    variant={
                      currentReport.mention === 'EXCELLENT' ? 'success' :
                      currentReport.mention === 'TRES_BIEN' ? 'info' :
                      currentReport.mention === 'BIEN' ? 'info' :
                      currentReport.mention === 'ASSEZ_BIEN' ? 'warning' : 'error'
                    }
                    size="md"
                  />
                </View>
              </View>
            </Card>

            {/* Détail des matières */}
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Détail des matières
            </Text>
            {currentReport.matieres.map((matiere, index) => (
              <MotiView
                key={matiere.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 150 + index * 50 }}
              >
                <Card variant="elevated" className="mb-4 p-4">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {matiere.matiere}
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
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Coefficient: {matiere.coefficient}
                    </Text>
                  </View>
                  {matiere.appreciation && (
                    <Text className="text-xs italic text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      {matiere.appreciation}
                    </Text>
                  )}
                </Card>
              </MotiView>
            ))}
          </MotiView>
        ) : (
          <EmptyState
            title="Aucun bulletin"
            description="Aucun bulletin n'est disponible pour le moment"
            icon="book-open"
          />
        )}
      </ScrollView>
    </View>
  );
};