// screens/parent/ChildDetailScreen.tsx
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
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface ChildDetail {
  id: string;
  nom: string;
  prenoms: string;
  photo?: string;
  dateNaissance: string;
  matricule: string;
  classe: string;
  cycle: string;
  moyenneGenerale?: number;
  rang?: number;
  effectifClasse?: number;
  nbAbsences: number;
  nbRetards: number;
}

const MOCK_CHILD: ChildDetail = {
  id: '1',
  nom: 'MOUKOKO',
  prenoms: 'Jean Junior',
  dateNaissance: '2010-05-15',
  matricule: 'LMB-2025-001',
  classe: '3ème A',
  cycle: 'COLLEGE',
  moyenneGenerale: 15.5,
  rang: 3,
  effectifClasse: 32,
  nbAbsences: 2,
  nbRetards: 1,
};

export const ChildDetailScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [child] = useState(MOCK_CHILD);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const quickActions = [
    { label: 'Emploi du temps', icon: 'calendar', color: '#3B82F6' },
    { label: 'Notes', icon: 'book-open', color: '#10B981' },
    { label: 'Paiements', icon: 'credit-card', color: '#F5A623' },
    { label: 'Présences', icon: 'check-square', color: '#8B5CF6' },
    { label: 'Clubs', icon: 'users', color: '#EC4899' },
    { label: 'Réclamation', icon: 'message-square', color: '#EF4444' },
  ];

  if (!child) return <LoadingSpinner fullScreen />;

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
        style={{ paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 }}
      >
        <Text className="text-white text-xl font-bold">Détail de l'élève</Text>
      </LinearGradient>

      {/* Profil */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 100 }}
        className="items-center -mt-8"
      >
        <Avatar
          source={child.photo}
          name={`${child.nom} ${child.prenoms}`}
          size="xl"
          variant="circle"
        />
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
          {child.prenoms} {child.nom}
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400">{child.classe}</Text>
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Matricule: {child.matricule}
        </Text>
      </MotiView>

      {/* Stats */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 150 }}
        className="flex-row px-5 gap-4 mt-6"
      >
        <Card variant="elevated" className="flex-1 items-center py-3">
          <Feather name="trending-up" size={22} color="#10B981" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {child.moyenneGenerale?.toFixed(1) || '-'}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Moyenne</Text>
        </Card>
        <Card variant="elevated" className="flex-1 items-center py-3">
          <Feather name="award" size={22} color="#F5A623" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {child.rang || '-'}/{child.effectifClasse || '-'}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Rang</Text>
        </Card>
        <Card variant="elevated" className="flex-1 items-center py-3">
          <Feather name="calendar" size={22} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white mt-1">
            {child.nbAbsences}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Absences</Text>
        </Card>
      </MotiView>

      {/* Actions rapides */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 200 }}
        className="px-5 mt-6"
      >
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Actions rapides
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              className="w-[30%] bg-white dark:bg-gray-800 rounded-xl p-3 items-center shadow-sm"
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <Feather name={action.icon as any} size={20} color={action.color} />
              </View>
              <Text className="text-xs text-gray-700 dark:text-gray-300 text-center">
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </MotiView>

      {/* Informations */}
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: 250 }}
        className="px-5 mt-6 mb-8"
      >
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Informations
        </Text>
        <Card variant="elevated" className="p-4">
          <View className="flex-row justify-between py-3 border-b border-gray-100 dark:border-gray-800">
            <Text className="text-gray-500 dark:text-gray-400">Date de naissance</Text>
            <Text className="text-gray-900 dark:text-white">{child.dateNaissance}</Text>
          </View>
          <View className="flex-row justify-between py-3 border-b border-gray-100 dark:border-gray-800">
            <Text className="text-gray-500 dark:text-gray-400">Cycle</Text>
            <Text className="text-gray-900 dark:text-white">{child.cycle}</Text>
          </View>
          <View className="flex-row justify-between py-3">
            <Text className="text-gray-500 dark:text-gray-400">Retards</Text>
            <Text className="text-gray-900 dark:text-white">{child.nbRetards}</Text>
          </View>
        </Card>
      </MotiView>
    </ScrollView>
  );
};