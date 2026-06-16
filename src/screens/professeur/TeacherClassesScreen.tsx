// screens/professeur/TeacherClassesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/animations/EmptyState';

interface Classe {
  id: string;
  nom: string;
  niveau: string;
  effectif: number;
  matiere: string;
  moyenne?: number;
  dernierCours?: string;
}

const MOCK_CLASSES: Classe[] = [
  { id: '1', nom: '3ème A', niveau: '3ème', effectif: 32, matiere: 'Mathématiques', moyenne: 14.2, dernierCours: '2025-10-13' },
  { id: '2', nom: '4ème B', niveau: '4ème', effectif: 28, matiere: 'Mathématiques', moyenne: 13.5, dernierCours: '2025-10-12' },
  { id: '3', nom: 'Terminale C', niveau: 'Terminale', effectif: 24, matiere: 'Mathématiques', moyenne: 15.8, dernierCours: '2025-10-14' },
];

export const TeacherClassesScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderClasseCard = ({ item, index }: { item: Classe; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 80 }}
    >
      <Card variant="elevated" className="mb-4 overflow-hidden">
        <LinearGradient
          colors={['#F5A623', '#E0950A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="px-4 py-3"
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-lg font-bold">{item.nom}</Text>
            <View className="bg-white/20 rounded-full px-3 py-1">
              <Text className="text-white text-xs font-medium">{item.matiere}</Text>
            </View>
          </View>
        </LinearGradient>

        <View className="p-4">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-2">
              <Feather name="users" size={16} color="#94A3B8" />
              <Text className="text-gray-600 dark:text-gray-400 text-sm">{item.effectif} élèves</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Feather name="book-open" size={16} color="#94A3B8" />
              <Text className="text-gray-600 dark:text-gray-400 text-sm">{item.niveau}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2 mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Feather name="trending-up" size={16} color="#F5A623" />
            <Text className="text-gray-600 dark:text-gray-400 text-sm">Moyenne de la classe</Text>
            <Text className="text-primary-500 font-bold ml-auto">{item.moyenne?.toFixed(2)}/20</Text>
          </View>

          {item.dernierCours && (
            <Text className="text-gray-400 text-xs mt-3">Dernier cours: {item.dernierCours}</Text>
          )}
        </View>
      </Card>
    </MotiView>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={['#F5A623', '#E0950A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 }}
      >
        <Text className="text-white text-2xl font-bold">Mes classes</Text>
        <Text className="text-white/80 text-sm mt-1">{classes.length} classe(s) à charge</Text>
      </LinearGradient>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderClasseCard}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};