// screens/auth/SelectSchoolScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface School {
  id: string;
  nom: string;
  logo?: string;
  ville: string;
  statut: 'ACTIF' | 'INACTIF';
}

// Mock data (à remplacer par l'appel API)
const MOCK_SCHOOLS: School[] = [
  { id: '1', nom: 'Lycée Moderne de Brazzaville', ville: 'Brazzaville', statut: 'ACTIF' },
  { id: '2', nom: 'Collège Saint Joseph', ville: 'Pointe-Noire', statut: 'ACTIF' },
];

export const SelectSchoolScreen: React.FC = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSelectSchool = async () => {
    if (!selectedSchoolId) return;
    setIsLoading(true);
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    // Navigation vers Main
  };

  const renderSchoolCard = ({ item, index }: { item: School; index: number }) => {
    const isSelected = selectedSchoolId === item.id;
    const isInactive = item.statut === 'INACTIF';

    return (
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: index * 100 }}
      >
        <TouchableOpacity
          onPress={() => !isInactive && setSelectedSchoolId(item.id)}
          disabled={isInactive}
          className={`flex-row items-center p-4 rounded-2xl mb-3 border-2 ${
            isSelected
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : isInactive
              ? 'border-gray-200 dark:border-gray-700 opacity-50'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          }`}
        >
          {/* Logo */}
          {item.logo ? (
            <Image source={{ uri: item.logo }} className="w-12 h-12 rounded-full" />
          ) : (
            <LinearGradient
              colors={['#F5A623', '#E0950A']}
              className="w-12 h-12 rounded-full items-center justify-center"
            >
              <Text className="text-white text-lg font-bold">
                {item.nom.charAt(0)}
              </Text>
            </LinearGradient>
          )}

          {/* Infos */}
          <View className="flex-1 ml-3">
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {item.nom}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {item.ville}
            </Text>
          </View>

          {/* Indicateur de sélection */}
          {isSelected && (
            <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
              <Feather name="check" size={14} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </MotiView>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Connexion en cours..." />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style="dark" />

      {/* Header */}
      <LinearGradient
        colors={['#F5A623', '#E0950A']}
        className="pt-12 pb-6 px-6"
        style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      >
        <Text className="text-white text-2xl font-bold">
          Sélectionner un établissement
        </Text>
        <Text className="text-white/80 text-sm mt-1">
          Bonjour {user?.prenoms} {user?.nom}
        </Text>
      </LinearGradient>

      {/* Liste des écoles */}
      <FlatList
        data={MOCK_SCHOOLS}
        keyExtractor={(item) => item.id}
        renderItem={renderSchoolCard}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Bouton de validation */}
      {selectedSchoolId && (
        <MotiView
          from={{ translateY: 100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
        >
          <Button
            title="Continuer"
            onPress={handleSelectSchool}
            variant="primary"
            size="lg"
          />
        </MotiView>
      )}
    </View>
  );
};