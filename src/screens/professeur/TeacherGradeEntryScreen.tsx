// screens/professeur/TeacherGradeEntryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

interface Eleve {
  id: string;
  nom: string;
  prenoms: string;
  note?: number;
}

const MOCK_ELEVES: Eleve[] = [
  { id: '1', nom: 'MOUKOKO', prenoms: 'Jean Junior', note: 15 },
  { id: '2', nom: 'NGOMA', prenoms: 'Paul', note: 14 },
  { id: '3', nom: 'LOUBAT', prenoms: 'Marie', note: 17 },
  { id: '4', nom: 'WAMBA', prenoms: 'Christ', note: 13 },
  { id: '5', nom: 'MFOUMOU', prenoms: 'Alain', note: 11 },
];

const MOCK_EXAMENS = [
  { id: '1', nom: 'Devoir 1', coefficient: 1, date: '2025-10-20' },
  { id: '2', nom: 'Devoir 2', coefficient: 1, date: '2025-11-15' },
  { id: '3', nom: 'Examen Trimestriel', coefficient: 2, date: '2025-12-05' },
];

export const TeacherGradeEntryScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [eleves, setEleves] = useState(MOCK_ELEVES);
  const [selectedExamen, setSelectedExamen] = useState(MOCK_EXAMENS[0].id);
  const [isSaving, setIsSaving] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const updateNote = (id: string, note: string) => {
    const numNote = parseFloat(note);
    if (isNaN(numNote)) return;
    setEleves(prev => prev.map(e => e.id === id ? { ...e, note: Math.min(20, Math.max(0, numNote)) } : e));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Succès', 'Les notes ont été enregistrées');
    }, 1000);
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
        <Text className="text-white text-xl font-bold">Saisie des notes</Text>
        <Text className="text-white/80 text-sm mt-1">Classe: 3ème A</Text>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-5">
          {/* Sélecteur d'examen */}
          <Card variant="elevated" className="p-4 mb-5">
            <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-3">
              Examen / Évaluation
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {MOCK_EXAMENS.map((exam) => (
                <TouchableOpacity
                  key={exam.id}
                  onPress={() => setSelectedExamen(exam.id)}
                  className={`px-4 py-2 rounded-full ${
                    selectedExamen === exam.id ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Text className={selectedExamen === exam.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'}>
                    {exam.nom} (coef {exam.coefficient})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card>

          {/* Liste des élèves */}
          <Text className="text-gray-700 dark:text-gray-300 text-base font-semibold mb-3">
            Élèves ({eleves.length})
          </Text>
          {eleves.map((eleve, index) => (
            <MotiView
              key={eleve.id}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 50 }}
            >
              <Card variant="elevated" className="mb-3 p-4 flex-row justify-between items-center">
                <Text className="text-gray-900 dark:text-white font-semibold">
                  {eleve.prenoms} {eleve.nom}
                </Text>
                <View className="flex-row items-center gap-3">
                  <TextInput
                    placeholder="Note"
                    keyboardType="numeric"
                    value={eleve.note?.toString() || ''}
                    onChangeText={(text) => updateNote(eleve.id, text)}
                    className="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl text-center text-gray-900 dark:text-white text-lg font-bold"
                    placeholderTextColor="#94A3B8"
                  />
                  <Text className="text-gray-400 text-sm">/20</Text>
                </View>
              </Card>
            </MotiView>
          ))}
        </View>
      </ScrollView>

      {/* Bouton de sauvegarde */}
      <View className="p-5 pb-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <Button
          title={isSaving ? 'Enregistrement...' : 'Enregistrer les notes'}
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          variant="primary"
          size="lg"
        />
      </View>
    </View>
  );
};