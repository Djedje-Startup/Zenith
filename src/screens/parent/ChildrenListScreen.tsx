// screens/parent/ChildrenListScreen.tsx
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
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/animations/EmptyState';

interface Child {
  id: string;
  nom: string;
  prenoms: string;
  photo?: string;
  classe: string;
  matricule: string;
  schoolName: string;
  moyenne?: number;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
}

const MOCK_CHILDREN: Child[] = [
  {
    id: '1',
    nom: 'MOUKOKO',
    prenoms: 'Jean Junior',
    classe: '3ème A',
    matricule: 'LMB-2025-001',
    schoolName: 'Lycée Moderne',
    moyenne: 15.5,
    statut: 'ACTIF',
  },
  {
    id: '2',
    nom: 'MOUKOKO',
    prenoms: 'Marie Claire',
    classe: '5ème B',
    matricule: 'CSJ-2025-042',
    schoolName: 'Collège Saint Joseph',
    moyenne: 17.2,
    statut: 'ACTIF',
  },
];

const getStatutColor = (statut: string) => {
  switch (statut) {
    case 'ACTIF': return '#10B981';
    case 'INACTIF': return '#6B7280';
    case 'SUSPENDU': return '#F59E0B';
    default: return '#EF4444';
  }
};

const getStatutLabel = (statut: string) => {
  switch (statut) {
    case 'ACTIF': return 'Actif';
    case 'INACTIF': return 'Inactif';
    case 'SUSPENDU': return 'Suspendu';
    default: return statut;
  }
};

export const ChildrenListScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [children, setChildren] = useState(MOCK_CHILDREN);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderChildCard = ({ item, index }: { item: Child; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 100 }}
    >
      <Card variant="elevated" className="mb-4 overflow-hidden">
        <View className="flex-row items-center p-4">
          <Avatar source={item.photo} name={`${item.nom} ${item.prenoms}`} size="lg" />
          <View className="flex-1 ml-3">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.prenoms} {item.nom}
              </Text>
              <Badge text={getStatutLabel(item.statut)} size="sm" />
            </View>
            <Text className="text-sm text-gray-500 dark:text-gray-400">{item.classe}</Text>
            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Matricule: {item.matricule} • {item.schoolName}
            </Text>
          </View>
          {item.moyenne !== undefined && (
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: item.moyenne >= 10 ? '#10B98120' : '#EF444420' }}
            >
              <Text className="text-lg font-bold" style={{ color: item.moyenne >= 10 ? '#10B981' : '#EF4444' }}>
                {item.moyenne.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row justify-around py-3 px-4 border-t border-gray-100 dark:border-gray-800">
          <TouchableOpacity className="flex-row items-center gap-1">
            <Feather name="calendar" size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 dark:text-gray-400">Emploi du temps</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Feather name="book-open" size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 dark:text-gray-400">Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Feather name="credit-card" size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 dark:text-gray-400">Paiements</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </MotiView>
  );

  if (children.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <LinearGradient
          colors={['#F5A623', '#E0950A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 }}
        >
          <Text className="text-white text-2xl font-bold">Mes enfants</Text>
        </LinearGradient>
        <EmptyState
          title="Aucun enfant"
          description="Vous n'avez pas encore d'enfant inscrit"
          icon="users"
        />
      </View>
    );
  }

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
        <Text className="text-white text-2xl font-bold">Mes enfants</Text>
        <Text className="text-white/80 text-sm mt-1">{children.length} enfant(s) inscrit(s)</Text>
      </LinearGradient>

      {/* Liste */}
      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={renderChildCard}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};