// screens/eleve/StudentTimetableScreen.tsx
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

interface TimetableEntry {
  id: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  professeur: string;
  salle: string;
  type?: 'CM' | 'TD' | 'TP';
}

const MOCK_TIMETABLE: Record<string, TimetableEntry[]> = {
  Lundi: [
    { id: '1', heureDebut: '08:00', heureFin: '09:30', matiere: 'Mathématiques', professeur: 'M. NGOMA', salle: 'A101', type: 'CM' },
    { id: '2', heureDebut: '10:00', heureFin: '11:30', matiere: 'Français', professeur: 'Mme LOUBAKI', salle: 'A102', type: 'TD' },
  ],
  Mardi: [
    { id: '3', heureDebut: '08:00', heureFin: '09:30', matiere: 'Physique-Chimie', professeur: 'M. MFOUMOU', salle: 'Labo Sciences', type: 'TP' },
  ],
  Mercredi: [],
  Jeudi: [
    { id: '4', heureDebut: '08:00', heureFin: '09:30', matiere: 'Anglais', professeur: 'M. WAMBA', salle: 'Labo Langues', type: 'TD' },
  ],
  Vendredi: [
    { id: '5', heureDebut: '08:00', heureFin: '09:30', matiere: 'Histoire-Géo', professeur: 'Mme MOUKALA', salle: 'A103', type: 'CM' },
  ],
  Samedi: [],
};

const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const getTypeColor = (type?: string) => {
  switch (type) {
    case 'CM': return '#3B82F6';
    case 'TD': return '#10B981';
    case 'TP': return '#F59E0B';
    default: return '#6B7280';
  }
};

export const StudentTimetableScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState(joursSemaine[0]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const currentCours = MOCK_TIMETABLE[selectedDay] || [];
  const hasData = currentCours.length > 0;

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
        <Text className="text-white text-xl font-bold">Mon emploi du temps</Text>
      </LinearGradient>

      {/* Sélecteur de jour */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-4 px-5"
        contentContainerStyle={{ gap: 10 }}
      >
        {joursSemaine.map((jour) => (
          <TouchableOpacity
            key={jour}
            onPress={() => setSelectedDay(jour)}
            className={`px-5 py-2 rounded-full ${
              selectedDay === jour
                ? 'bg-primary-500'
                : 'bg-white dark:bg-gray-800'
            }`}
          >
            <Text
              className={selectedDay === jour ? 'text-white font-medium' : 'text-gray-600 dark:text-gray-400'}
            >
              {jour}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cours du jour */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {hasData ? (
          currentCours.map((cours, index) => (
            <MotiView
              key={cours.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 80 }}
            >
              <Card variant="elevated" className="mb-3 p-4">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-gray-900 dark:text-white">
                        {cours.matiere}
                      </Text>
                      {cours.type && (
                        <Badge
                          text={cours.type}
                          variant="default"
                          size="sm"
                        />
                      )}
                    </View>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {cours.professeur}
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
                </View>
              </Card>
            </MotiView>
          ))
        ) : (
          <EmptyState
            title="Aucun cours"
            description="Aucun cours n'est planifié pour ce jour"
            icon="calendar"
            variant="compact"
          />
        )}
      </ScrollView>
    </View>
  );
};