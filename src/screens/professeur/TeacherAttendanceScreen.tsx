// screens/professeur/TeacherAttendanceScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';

interface Eleve {
  id: string;
  nom: string;
  prenoms: string;
  present: boolean;
  justifie?: boolean;
}

const MOCK_ELEVES: Eleve[] = [
  { id: '1', nom: 'MOUKOKO', prenoms: 'Jean Junior', present: true },
  { id: '2', nom: 'NGOMA', prenoms: 'Paul', present: true },
  { id: '3', nom: 'LOUBAT', prenoms: 'Marie', present: true },
  { id: '4', nom: 'WAMBA', prenoms: 'Christ', present: false, justifie: true },
  { id: '5', nom: 'MFOUMOU', prenoms: 'Alain', present: false, justifie: false },
];

export const TeacherAttendanceScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [eleves, setEleves] = useState(MOCK_ELEVES);
  const [isSaving, setIsSaving] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const togglePresence = (id: string) => {
    setEleves(prev => prev.map(e => e.id === id ? { ...e, present: !e.present } : e));
  };

  const toggleJustifie = (id: string) => {
    setEleves(prev => prev.map(e => e.id === id ? { ...e, justifie: !e.justifie } : e));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Succès', 'L\'appel a été enregistré');
    }, 1000);
  };

  const stats = {
    presents: eleves.filter(e => e.present).length,
    absents: eleves.filter(e => !e.present).length,
    justifies: eleves.filter(e => !e.present && e.justifie).length,
    total: eleves.length,
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={['#2DD4BF', '#14B8A6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 }}
      >
        <Text className="text-white text-xl font-bold">Faire l'appel</Text>
        <Text className="text-white/80 text-sm mt-1">Classe: 3ème A</Text>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-5">
          {/* Statistiques rapides */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 100 }}
            className="flex-row justify-between gap-3 mb-6"
          >
            <View className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-3 items-center shadow-sm">
              <Feather name="check-circle" size={20} color="#10B981" />
              <Text className="text-green-600 dark:text-green-400 text-2xl font-bold mt-1">
                {stats.presents}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Présents</Text>
            </View>
            <View className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-3 items-center shadow-sm">
              <Feather name="x-circle" size={20} color="#EF4444" />
              <Text className="text-red-600 dark:text-red-400 text-2xl font-bold mt-1">
                {stats.absents}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Absents</Text>
            </View>
            <View className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-3 items-center shadow-sm">
              <Feather name="file-text" size={20} color="#F59E0B" />
              <Text className="text-yellow-600 dark:text-yellow-400 text-2xl font-bold mt-1">
                {stats.justifies}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Justifiés</Text>
            </View>
          </MotiView>

          {/* Liste des élèves */}
          <Text className="text-gray-700 dark:text-gray-300 text-base font-semibold mb-3">
            Liste des élèves ({stats.total})
          </Text>
          {eleves.map((eleve, index) => (
            <MotiView
              key={eleve.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 150 + index * 50 }}
            >
              <Card variant="elevated" className="mb-3 p-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-900 dark:text-white font-semibold">
                    {eleve.prenoms} {eleve.nom}
                  </Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => togglePresence(eleve.id)}
                      className={cn(
                        'px-4 py-2 rounded-xl flex-row items-center gap-2',
                        eleve.present ? 'bg-green-500' : 'bg-red-500'
                      )}
                    >
                      <Feather name={eleve.present ? 'check' : 'x'} size={14} color="white" />
                      <Text className="text-white text-xs font-medium">
                        {eleve.present ? 'Présent' : 'Absent'}
                      </Text>
                    </TouchableOpacity>
                    {!eleve.present && (
                      <TouchableOpacity
                        onPress={() => toggleJustifie(eleve.id)}
                        className={cn(
                          'px-3 py-2 rounded-xl',
                          eleve.justifie ? 'bg-yellow-500' : 'bg-gray-200 dark:bg-gray-700'
                        )}
                      >
                        <Feather name="file-text" size={14} color={eleve.justifie ? 'white' : '#64748B'} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {!eleve.present && eleve.justifie && (
                  <Text className="text-yellow-600 dark:text-yellow-400 text-xs mt-2">
                    ✓ Absence justifiée
                  </Text>
                )}
              </Card>
            </MotiView>
          ))}
        </View>
      </ScrollView>

      {/* Bouton de sauvegarde */}
      <View className="p-5 pb-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <Button
          title={isSaving ? 'Enregistrement...' : 'Enregistrer l\'appel'}
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          variant="secondary"
          size="lg"
        />
      </View>
    </View>
  );
};