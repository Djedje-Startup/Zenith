// screens/professeur/TeacherClubsScreen.tsx
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
import { EmptyState } from '../../components/animations/EmptyState';

interface Club {
  id: string;
  nom: string;
  description: string;
  couleur: string;
  role: 'RESPONSABLE' | 'ENCADRANT' | 'MEMBRE';
  nbMembres: number;
  prochainEvent?: string;
}

const MOCK_CLUBS: Club[] = [
  {
    id: '1',
    nom: 'Club Informatique',
    description: 'Découverte du code, de la robotique et des nouvelles technologies',
    couleur: '#3B82F6',
    role: 'RESPONSABLE',
    nbMembres: 45,
    prochainEvent: 'Hackathon Junior - 25 Oct 2025',
  },
  {
    id: '2',
    nom: 'Club Culturel',
    description: 'Théâtre, danse, musique et arts plastiques',
    couleur: '#8B5CF6',
    role: 'ENCADRANT',
    nbMembres: 32,
    prochainEvent: 'Soirée culturelle - 08 Déc 2025',
  },
];

const getRoleConfig = (role: string) => {
  switch (role) {
    case 'RESPONSABLE':
      return { label: 'Responsable', color: '#F5A623', icon: 'crown' };
    case 'ENCADRANT':
      return { label: 'Encadrant', color: '#2DD4BF', icon: 'users' };
    default:
      return { label: 'Membre', color: '#64748B', icon: 'user' };
  }
};

export const TeacherClubsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [clubs, setClubs] = useState(MOCK_CLUBS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderClubCard = ({ item, index }: { item: Club; index: number }) => {
    const roleConfig = getRoleConfig(item.role);
    return (
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: index * 100 }}
      >
        <Card variant="elevated" className="mb-4 overflow-hidden">
          <LinearGradient
            colors={[item.couleur, `${item.couleur}CC`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-4 py-3"
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-lg font-bold">{item.nom}</Text>
              <View className="bg-white/20 rounded-full px-3 py-1 flex-row items-center gap-1">
                <Feather name={roleConfig.icon as any} size={12} color="white" />
                <Text className="text-white text-xs font-medium">{roleConfig.label}</Text>
              </View>
            </View>
          </LinearGradient>

          <View className="p-4">
            <Text className="text-gray-600 dark:text-gray-400 text-sm" numberOfLines={2}>
              {item.description}
            </Text>
            <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center gap-1">
                <Feather name="users" size={14} color="#94A3B8" />
                <Text className="text-gray-500 text-xs">{item.nbMembres} membres</Text>
              </View>
              {item.prochainEvent && (
                <View className="flex-row items-center gap-1">
                  <Feather name="calendar" size={14} color="#F5A623" />
                  <Text className="text-primary-500 text-xs">{item.prochainEvent}</Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </MotiView>
    );
  };

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
        <Text className="text-white text-2xl font-bold">Clubs encadrés</Text>
        <Text className="text-white/80 text-sm mt-1">{clubs.length} club(s) sous votre responsabilité</Text>
      </LinearGradient>

      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        renderItem={renderClubCard}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};