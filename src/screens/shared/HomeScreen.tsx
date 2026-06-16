// screens/shared/HomeScreen.tsx
import React from 'react';
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

// Types
interface DashboardStats {
  notificationsNonLues: number;
  prochainsCours: any[];
  dernieresNotes: any[];
  evenementsRecents: any[];
}

// Mock data
const MOCK_STATS: DashboardStats = {
  notificationsNonLues: 3,
  prochainsCours: [
    { id: '1', matiere: 'Mathématiques', professeur: 'M. NGOMA', salle: 'A101', heureDebut: '08:00' },
  ],
  dernieresNotes: [
    { id: '1', matiere: 'Mathématiques', note: 15, date: '15/10/2025' },
    { id: '2', matiere: 'Français', note: 14, date: '14/10/2025' },
  ],
  evenementsRecents: [
    { id: '1', titre: 'Réunion parents-professeurs', date: '25 Oct 2025', lieu: 'Salle polyvalente' },
  ],
};

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDark, colors } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats] = React.useState(MOCK_STATS);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

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
            {stats.notificationsNonLues > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {stats.notificationsNonLues > 9 ? '9+' : stats.notificationsNonLues}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Contenu */}
      <View className="px-5 -mt-5">
        {/* Prochain cours */}
        {stats.prochainsCours.length > 0 && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 100 }}
            className="mb-6"
          >
            <Card variant="elevated" className="p-4">
              <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Prochain cours</Text>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.prochainsCours[0].matiere}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stats.prochainsCours[0].professeur} • Salle {stats.prochainsCours[0].salle}
                  </Text>
                </View>
                <Badge text={stats.prochainsCours[0].heureDebut} variant="primary" size="md" />
              </View>
            </Card>
          </MotiView>
        )}

        {/* Stats rapides */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 150 }}
          className="flex-row gap-4 mb-6"
        >
          <Card variant="elevated" className="flex-1 items-center py-4">
            <Feather name="trending-up" size={24} color="#10B981" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">15.5</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">Moyenne</Text>
          </Card>
          <Card variant="elevated" className="flex-1 items-center py-4">
            <Feather name="check-circle" size={24} color="#F5A623" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-2">92%</Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">Présence</Text>
          </Card>
        </MotiView>

        {/* Dernières notes */}
        {stats.dernieresNotes.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 200 }}
            className="mb-6"
          >
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Dernières notes
            </Text>
            {stats.dernieresNotes.map((note, index) => (
              <Card key={note.id} variant="elevated" className="mb-3 flex-row justify-between items-center">
                <View>
                  <Text className="font-semibold text-gray-900 dark:text-white">{note.matiere}</Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">{note.date}</Text>
                </View>
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: note.note >= 10 ? '#10B98120' : '#EF444420' }}
                >
                  <Text
                    className="text-lg font-bold"
                    style={{ color: note.note >= 10 ? '#10B981' : '#EF4444' }}
                  >
                    {note.note}
                  </Text>
                </View>
              </Card>
            ))}
          </MotiView>
        )}

        {/* Événements */}
        {stats.evenementsRecents.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 250 }}
            className="mb-8"
          >
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Événements à venir
            </Text>
            {stats.evenementsRecents.map((event) => (
              <Card key={event.id} variant="elevated" className="mb-3 flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center mr-3">
                  <Feather name="calendar" size={18} color="#F5A623" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 dark:text-white">{event.titre}</Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">{event.date} • {event.lieu}</Text>
                </View>
                <Feather name="chevron-right" size={16} color="#9CA3AF" />
              </Card>
            ))}
          </MotiView>
        )}
      </View>
    </ScrollView>
  );
};