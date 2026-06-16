// screens/parent/ParentHomeScreen.tsx
import React, { useState, useEffect } from 'react';
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
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ChildSelector, Child } from '../../components/zenith/ChildSelector';
import { cn } from '../../utils/cn';

// Mock data
const MOCK_CHILDREN: Child[] = [
  {
    id: '1',
    nom: 'MOUKOKO',
    prenoms: 'Jean Junior',
    classe: '3ème A',
    schoolId: '1',
    schoolName: 'Lycée Moderne',
    moyenne: 15.5,
  },
  {
    id: '2',
    nom: 'MOUKOKO',
    prenoms: 'Marie Claire',
    classe: '5ème B',
    schoolId: '2',
    schoolName: 'Collège Saint Joseph',
    moyenne: 17.2,
  },
];

export const ParentHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDark, colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [notificationsCount] = useState(3);

  useEffect(() => {
    if (MOCK_CHILDREN.length > 0 && !selectedChild) {
      setSelectedChild(MOCK_CHILDREN[0]);
    }
  }, []);

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
              {user.prenoms} {user.nom}
            </Text>
          </View>
          <TouchableOpacity className="relative p-2">
            <Feather name="bell" size={22} color="white" />
            {notificationsCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {notificationsCount > 9 ? '9+' : notificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Contenu */}
      <View className="px-5 -mt-5">
        {/* Sélecteur d'enfant */}
        {MOCK_CHILDREN.length > 1 && (
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100 }}
            className="mb-5"
          >
            <ChildSelector
              children={MOCK_CHILDREN}
              selectedChild={selectedChild}
              onSelectChild={setSelectedChild}
            />
          </MotiView>
        )}

        {/* Cartes stats */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 150 }}
          className="flex-row gap-4 mb-6"
        >
          <Card variant="elevated" className="flex-1 items-center py-4">
            <Feather name="trending-up" size={24} color="#10B981" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {selectedChild?.moyenne?.toFixed(1) || '-'}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">Moyenne générale</Text>
          </Card>
          <Card variant="elevated" className="flex-1 items-center py-4">
            <Feather name="credit-card" size={24} color="#F5A623" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">2</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">Paiements en attente</Text>
          </Card>
        </MotiView>

        {/* Accès rapide */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 200 }}
          className="mb-6"
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Accès rapide
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { label: 'Emploi du temps', icon: 'calendar', color: '#3B82F6', route: 'ParentTimetable' },
              { label: 'Notes', icon: 'book-open', color: '#10B981', route: 'ParentGrades' },
              { label: 'Paiements', icon: 'credit-card', color: '#F5A623', route: 'ParentPayments' },
              { label: 'Clubs', icon: 'users', color: '#8B5CF6', route: 'ParentClubs' },
              { label: 'Réclamation', icon: 'message-square', color: '#EF4444', route: 'ParentComplaint' },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                className="w-[30%] bg-white dark:bg-gray-800 rounded-xl p-3 items-center shadow-sm"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Feather name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text className="text-xs text-gray-700 dark:text-gray-300 text-center">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </MotiView>

        {/* Événements récents */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 250 }}
          className="mb-8"
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Événements à venir
          </Text>
          <Card variant="elevated" className="flex-row items-center p-4">
            <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center mr-3">
              <Feather name="calendar" size={18} color="#F5A623" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900 dark:text-white">Réunion parents-professeurs</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">25 Oct 2025 • Salle polyvalente</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#9CA3AF" />
          </Card>
        </MotiView>
      </View>
    </ScrollView>
  );
};