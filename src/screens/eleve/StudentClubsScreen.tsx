// screens/eleve/StudentClubsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
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
  nbMembres: number;
  isMember?: boolean;
  role?: string;
  prochainEvent?: string;
}

const MOCK_CLUBS: Club[] = [
  {
    id: '1',
    nom: 'Club Informatique',
    description: 'Découverte du code, de la robotique et des nouvelles technologies',
    couleur: '#3B82F6',
    nbMembres: 45,
    isMember: true,
    role: 'Membre',
    prochainEvent: 'Hackathon Junior - 25 Oct 2025',
  },
  {
    id: '2',
    nom: 'Club Sportif',
    description: 'Football, basket, athlétisme et autres activités sportives',
    couleur: '#10B981',
    nbMembres: 78,
    isMember: false,
    prochainEvent: 'Tournoi interclasses - 15 Nov 2025',
  },
  {
    id: '3',
    nom: 'Club Culturel',
    description: 'Théâtre, danse, musique et arts plastiques',
    couleur: '#8B5CF6',
    nbMembres: 32,
    isMember: false,
    prochainEvent: 'Soirée culturelle - 08 Déc 2025',
  },
];

export const StudentClubsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [clubs, setClubs] = useState(MOCK_CLUBS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleJoinClub = (clubId: string, clubName: string) => {
    Alert.alert(
      'Adhésion',
      `Voulez-vous rejoindre ${clubName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setClubs(prev =>
              prev.map(c =>
                c.id === clubId ? { ...c, isMember: true, role: 'Membre' } : c
              )
            );
            Alert.alert('Succès', 'Vous avez rejoint le club');
          },
        },
      ]
    );
  };

  const renderClubCard = ({ item, index }: { item: Club; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 100 }}
    >
      <Card variant="elevated" className="mb-4 overflow-hidden">
        <View className="h-1" style={{ backgroundColor: item.couleur }} />
        <View className="p-4">
          <View className="flex-row items-center gap-3 mb-3">
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: `${item.couleur}20` }}
            >
              <Feather name="users" size={22} color={item.couleur} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900 dark:text-white">
                {item.nom}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <Feather name="users" size={12} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {item.nbMembres} membres
                </Text>
                {item.isMember && (
                  <Badge text={item.role || 'Membre'} variant="primary" size="sm" />
                )}
              </View>
            </View>
          </View>

          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3" numberOfLines={2}>
            {item.description}
          </Text>

          {item.prochainEvent && (
            <View className="flex-row items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Feather name="calendar" size={14} color="#F5A623" />
              <Text className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                {item.prochainEvent}
              </Text>
            </View>
          )}

          {item.isMember ? (
            <TouchableOpacity className="flex-row items-center justify-center gap-2 py-2 rounded-xl border border-gray-300 dark:border-gray-700">
              <Feather name="check" size={16} color="#10B981" />
              <Text className="text-sm font-medium text-green-600 dark:text-green-400">
                Déjà membre
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handleJoinClub(item.id, item.nom)}
              className="flex-row items-center justify-center gap-2 py-2 rounded-xl bg-primary-500"
            >
              <Feather name="user-plus" size={16} color="white" />
              <Text className="text-sm font-medium text-white">Rejoindre le club</Text>
            </TouchableOpacity>
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
        <Text className="text-white text-2xl font-bold">Clubs et activités</Text>
        <Text className="text-white/80 text-sm mt-1">{clubs.length} club(s) disponible(s)</Text>
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