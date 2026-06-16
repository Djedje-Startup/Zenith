// screens/professeur/TeacherHomeScreen.tsx
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
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Mock data
const MOCK_TEACHER = {
  nom: 'NGOMA',
  prenoms: 'Paul',
  matieres: [
    { id: '1', nom: 'Mathématiques' },
    { id: '2', nom: 'Physique-Chimie' },
  ],
  classes: [
    { id: '1', nom: '3ème A', niveau: '3ème', effectif: 32 },
    { id: '2', nom: '4ème B', niveau: '4ème', effectif: 28 },
    { id: '3', nom: 'Terminale C', niveau: 'Terminale', effectif: 24 },
  ],
  coursAujourdhui: [
    {
      id: '1',
      matiere: 'Mathématiques',
      classe: '3ème A',
      heureDebut: '08:00',
      heureFin: '09:30',
      salle: 'A101',
      statut: 'A_VENIR',
    },
    {
      id: '2',
      matiere: 'Physique-Chimie',
      classe: '4ème B',
      heureDebut: '10:00',
      heureFin: '11:30',
      salle: 'Labo Sciences',
      statut: 'A_VENIR',
    },
  ],
  notificationsNonLues: 3,
  statistiques: {
    totalEleves: 84,
    moyenneClasses: 14.5,
  },
};

export const TeacherHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [teacher] = useState(MOCK_TEACHER);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header avec dégradé */}
      <LinearGradient
        colors={['#F5A623', '#E0950A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 48, paddingBottom: 28, paddingHorizontal: 20 }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white/80 text-sm">Bonjour,</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              {teacher.prenoms} {teacher.nom}
            </Text>
          </View>
          <TouchableOpacity className="relative p-2">
            <Feather name="bell" size={22} color="white" />
            {teacher.notificationsNonLues > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {teacher.notificationsNonLues > 9 ? '9+' : teacher.notificationsNonLues}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Contenu */}
      <View className="px-5 -mt-5">
        {/* Stats rapides */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 100 }}
          className="flex-row gap-4 mb-6"
        >
          <Card variant="elevated" className="flex-1 items-center py-4">
            <Feather name="users" size={24} color="#3B82F6" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {teacher.classes.length}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">Mes classes</Text>
          </Card>
          <Card variant="elevated" className="flex-1 items-center py-4">
            <Feather name="users" size={24} color="#10B981" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {teacher.statistiques.totalEleves}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">Total élèves</Text>
          </Card>
          <Card variant="elevated" className="flex-1 items-center py-4">
            <Feather name="trending-up" size={24} color="#F5A623" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {teacher.statistiques.moyenneClasses.toFixed(1)}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">Moyenne</Text>
          </Card>
        </MotiView>

        {/* Actions rapides */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 150 }}
          className="mb-6"
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Actions rapides
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 items-center shadow-sm">
              <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: '#F5A62320' }}>
                <Feather name="edit-3" size={22} color="#F5A623" />
              </View>
              <Text className="text-sm text-gray-700 dark:text-gray-300">Saisir notes</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 items-center shadow-sm">
              <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: '#2DD4BF20' }}>
                <Feather name="check-square" size={22} color="#2DD4BF" />
              </View>
              <Text className="text-sm text-gray-700 dark:text-gray-300">Faire l'appel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 items-center shadow-sm">
              <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: '#8B5CF620' }}>
                <Feather name="users" size={22} color="#8B5CF6" />
              </View>
              <Text className="text-sm text-gray-700 dark:text-gray-300">Mes classes</Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Cours du jour */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 200 }}
          className="mb-6"
        >
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">Cours du jour</Text>
            <TouchableOpacity>
              <Text className="text-primary-500 text-sm">Voir tout</Text>
            </TouchableOpacity>
          </View>
          {teacher.coursAujourdhui.map((cours, index) => (
            <MotiView
              key={cours.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 250 + index * 50 }}
            >
              <Card variant="elevated" className="mb-3 p-4">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {cours.matiere}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {cours.classe}
                    </Text>
                    <View className="flex-row items-center gap-3 mt-2">
                      <View className="flex-row items-center gap-1">
                        <Feather name="clock" size={12} color="#94A3B8" />
                        <Text className="text-xs text-gray-400">
                          {cours.heureDebut} - {cours.heureFin}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Feather name="map-pin" size={12} color="#94A3B8" />
                        <Text className="text-xs text-gray-400">Salle {cours.salle}</Text>
                      </View>
                    </View>
                  </View>
                  <Badge
                    text={cours.statut === 'EN_COURS' ? 'En cours' : 'À venir'}
                    variant={cours.statut === 'EN_COURS' ? 'success' : 'default'}
                    size="sm"
                  />
                </View>
              </Card>
            </MotiView>
          ))}
        </MotiView>

        {/* Matières enseignées */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 300 }}
          className="mb-8"
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Mes matières
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {teacher.matieres.map((matiere) => (
              <View
                key={matiere.id}
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: '#F5A62315' }}
              >
                <Text className="text-sm font-medium text-primary-600">
                  {matiere.nom}
                </Text>
              </View>
            ))}
          </View>
        </MotiView>
      </View>
    </ScrollView>
  );
};