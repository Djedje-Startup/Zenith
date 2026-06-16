// screens/parent/ParentComplaintScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const categories = [
  { value: 'PEDAGOGIE', label: 'Pédagogie', icon: 'book-open' },
  { value: 'ADMINISTRATION', label: 'Administration', icon: 'briefcase' },
  { value: 'FINANCE', label: 'Finance', icon: 'credit-card' },
  { value: 'COMPORTEMENT', label: 'Comportement', icon: 'users' },
  { value: 'TECHNIQUE', label: 'Technique', icon: 'cpu' },
  { value: 'AUTRE', label: 'Autre', icon: 'more-horizontal' },
];

export const ParentComplaintScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('AUTRE');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    Alert.alert('Succès', 'Votre réclamation a été envoyée', [
      { text: 'OK', onPress: () => {} },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={['#F5A623', '#E0950A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 }}
      >
        <Text className="text-white text-xl font-bold">Nouvelle réclamation</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Catégories */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Catégorie
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ gap: 10 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full flex-row items-center gap-2 ${
                selectedCategory === cat.value
                  ? 'bg-primary-500'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <Feather
                name={cat.icon as any}
                size={14}
                color={selectedCategory === cat.value ? 'white' : '#6B7280'}
              />
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === cat.value ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Titre */}
        <Input
          label="Titre"
          placeholder="Ex: Problème de connexion"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description */}
        <Input
          label="Description"
          placeholder="Décrivez votre problème en détail..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        {/* Bouton d'envoi */}
        <Button
          title={isLoading ? 'Envoi en cours...' : 'Envoyer la réclamation'}
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          variant="primary"
          size="lg"
          className="mt-4 mb-8"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};