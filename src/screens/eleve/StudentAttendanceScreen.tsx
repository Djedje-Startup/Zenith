// screens/eleve/StudentAttendanceScreen.tsx
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

interface AttendanceData {
  totalJours: number;
  presents: number;
  absents: number;
  retards: number;
  excuses: number;
  tauxPresence: number;
  historique: {
    date: string;
    statut: 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';
    motif?: string;
  }[];
}

const MOCK_ATTENDANCE: AttendanceData = {
  totalJours: 22,
  presents: 18,
  absents: 2,
  retards: 2,
  excuses: 1,
  tauxPresence: 81.8,
  historique: [
    { date: '2025-10-01', statut: 'PRESENT' },
    { date: '2025-10-02', statut: 'PRESENT' },
    { date: '2025-10-03', statut: 'RETARD' },
    { date: '2025-10-04', statut: 'PRESENT' },
    { date: '2025-10-05', statut: 'PRESENT' },
    { date: '2025-10-08', statut: 'ABSENT', motif: 'Maladie' },
    { date: '2025-10-09', statut: 'PRESENT' },
    { date: '2025-10-10', statut: 'PRESENT' },
    { date: '2025-10-11', statut: 'PRESENT' },
    { date: '2025-10-12', statut: 'ABSENT', motif: 'Rendez-vous médical' },
    { date: '2025-10-15', statut: 'PRESENT' },
    { date: '2025-10-16', statut: 'RETARD' },
    { date: '2025-10-17', statut: 'PRESENT' },
    { date: '2025-10-18', statut: 'PRESENT' },
    { date: '2025-10-19', statut: 'PRESENT' },
    { date: '2025-10-22', statut: 'PRESENT' },
    { date: '2025-10-23', statut: 'PRESENT' },
    { date: '2025-10-24', statut: 'PRESENT' },
    { date: '2025-10-25', statut: 'PRESENT' },
    { date: '2025-10-26', statut: 'PRESENT' },
    { date: '2025-10-29', statut: 'PRESENT' },
    { date: '2025-10-30', statut: 'PRESENT' },
    { date: '2025-10-31', statut: 'PRESENT' },
  ],
};

const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const getStatutColor = (statut: string) => {
  switch (statut) {
    case 'PRESENT': return '#10B981';
    case 'ABSENT': return '#EF4444';
    case 'RETARD': return '#F59E0B';
    case 'EXCUSE': return '#8B5CF6';
    default: return '#6B7280';
  }
};

const getStatutIcon = (statut: string): keyof typeof Feather.glyphMap => {
  switch (statut) {
    case 'PRESENT': return 'check-circle';
    case 'ABSENT': return 'x-circle';
    case 'RETARD': return 'clock';
    case 'EXCUSE': return 'file-text';
    default: return 'help-circle';
  }
};

export const StudentAttendanceScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(9); // Octobre
  const [attendance] = useState(MOCK_ATTENDANCE);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

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
        <Text className="text-white text-xl font-bold">Mes présences</Text>
      </LinearGradient>

      {/* Sélecteur de mois */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-4 px-5"
        contentContainerStyle={{ gap: 10 }}
      >
        {mois.map((month, index) => (
          <TouchableOpacity
            key={month}
            onPress={() => setSelectedMonth(index)}
            className={cn(
              'px-4 py-2 rounded-full',
              selectedMonth === index
                ? 'bg-primary-500'
                : 'bg-white dark:bg-gray-800'
            )}
          >
            <Text
              className={selectedMonth === index ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
            >
              {month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenu */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Statistiques */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 100 }}
          className="mb-6"
        >
          <Card variant="elevated" className="items-center py-6">
            <View
              className="w-28 h-28 rounded-full items-center justify-center mb-3"
              style={{
                backgroundColor: '#F5A62315',
                borderWidth: 3,
                borderColor: '#F5A623',
              }}
            >
              <Text className="text-3xl font-bold text-primary-500">
                {attendance.tauxPresence}%
              </Text>
            </View>
            <Text className="text-sm text-gray-500 dark:text-gray-400">Taux de présence</Text>

            <View className="flex-row justify-around w-full mt-6">
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {attendance.presents}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">Présents</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {attendance.absents}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">Absents</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {attendance.retards}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">Retards</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {attendance.excuses}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">Excusés</Text>
              </View>
            </View>
          </Card>
        </MotiView>

        {/* Historique */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 150 }}
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Historique
          </Text>
          {attendance.historique.map((item, index) => {
            const statutColor = getStatutColor(item.statut);
            const statutIcon = getStatutIcon(item.statut);
            return (
              <MotiView
                key={item.date}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 200 + index * 30 }}
              >
                <Card variant="elevated" className="mb-3 p-4">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${statutColor}20` }}
                      >
                        <Feather name={statutIcon} size={18} color={statutColor} />
                      </View>
                      <View>
                        <Text className="font-medium text-gray-900 dark:text-white">
                          {item.date}
                        </Text>
                        {item.motif && (
                          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {item.motif}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Badge
                      text={item.statut}
                      variant={
                        item.statut === 'PRESENT' ? 'success' :
                        item.statut === 'ABSENT' ? 'error' :
                        item.statut === 'RETARD' ? 'warning' : 'info'
                      }
                      size="sm"
                    />
                  </View>
                </Card>
              </MotiView>
            );
          })}
        </MotiView>
      </ScrollView>
    </View>
  );
};