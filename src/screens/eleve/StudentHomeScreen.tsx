// screens/eleve/StudentHomeScreen.tsx
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
import { cn } from '../../utils/cn';

// Mock data
const MOCK_STUDENT = {
  id: '1',
  nom: 'MOUKOKO',
  prenoms: 'Jean Junior',
  classe: '3ème A',
  moyenneGenerale: 15.5,
  mention: 'BIEN',
  rang: 3,
  effectifClasse: 32,
  tauxPresence: 92,
  prochainCours: {
    matiere: 'Mathématiques',
    professeur: 'M. NGOMA',
    salle: 'A101',
    heureDebut: '08:00',
    heureFin: '09:30',
  },
  dernieresNotes: [
    { id: '1', matiere: 'Mathématiques', note: 15, date: '15/10/2025' },
    { id: '2', matiere: 'Français', note: 14, date: '14/10/2025' },
    { id: '3', matiere: 'Anglais', note: 16, date: '13/10/2025' },
  ],
};

const getMentionColor = (mention: string) => {
  switch (mention) {
    case 'EXCELLENT': return '#10B981';
    case 'TRES_BIEN': return '#3B82F6';
    case 'BIEN': return '#8B5CF6';
    case 'ASSEZ_BIEN': return '#F59E0B';
    default: return '#EF4444';
  }
};

export const StudentHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [student] = useState(MOCK_STUDENT);

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
              {user.prenoms}
            </Text>
          </View>
          <TouchableOpacity>
            <Avatar
              name={`${user.nom} ${user.prenoms}`}
              source={user.photo}
              size="md"
            />
          </TouchableOpacity>
        </View>
        <Text className="text-white/70 text-sm mt-2">{student.classe}</Text>
      </LinearGradient>

      {/* Contenu */}
      <View className="px-5 -mt-5">
        {/* Moyenne générale */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 100 }}
          className="mb-6"
        >
          <Card variant="elevated" className="items-center py-6">
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">Moyenne générale</Text>
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: `${getMentionColor(student.mention)}20` }}
            >
              <Text
                className="text-3xl font-bold"
                style={{ color: getMentionColor(student.mention) }}
              >
                {student.moyenneGenerale.toFixed(2)}
              </Text>
            </View>
            <Badge
              text={student.mention}
              variant={
                student.mention === 'EXCELLENT' ? 'success' :
                student.mention === 'TRES_BIEN' ? 'info' :
                student.mention === 'BIEN' ? 'info' :
                student.mention === 'ASSEZ_BIEN' ? 'warning' : 'error'
              }
              size="md"
            />
            <View className="flex-row gap-6 mt-4">
              <View className="items-center">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Rang</Text>
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  {student.rang}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500">
                  / {student.effectifClasse}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Présence</Text>
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  {student.tauxPresence}%
                </Text>
              </View>
            </View>
          </Card>
        </MotiView>

        {/* Prochain cours */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 150 }}
          className="mb-6"
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Prochain cours
          </Text>
          <Card variant="elevated" className="p-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                  {student.prochainCours.matiere}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {student.prochainCours.professeur} • Salle {student.prochainCours.salle}
                </Text>
                <View className="flex-row items-center gap-1 mt-2">
                  <Feather name="clock" size={12} color="#94A3B8" />
                  <Text className="text-xs text-gray-400">
                    {student.prochainCours.heureDebut} - {student.prochainCours.heureFin}
                  </Text>
                </View>
              </View>
              <Badge text={student.prochainCours.heureDebut} variant="primary" size="md" />
            </View>
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
              { label: 'Emploi du temps', icon: 'calendar', color: '#3B82F6', route: 'StudentTimetable' },
              { label: 'Mes notes', icon: 'book-open', color: '#10B981', route: 'StudentGrades' },
              { label: 'Présences', icon: 'check-square', color: '#8B5CF6', route: 'StudentAttendance' },
              { label: 'Clubs', icon: 'users', color: '#EC4899', route: 'StudentClubs' },
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

        {/* Dernières notes */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 250 }}
          className="mb-8"
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Dernières notes
          </Text>
          {student.dernieresNotes.map((note, index) => (
            <Card key={note.id} variant="elevated" className="mb-3 flex-row justify-between items-center p-4">
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
          <TouchableOpacity className="items-center py-2">
            <Text className="text-primary-500 text-sm font-medium">Voir toutes mes notes</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </ScrollView>
  );
};