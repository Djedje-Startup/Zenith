// screens/shared/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

export const SettingsScreen: React.FC = () => {
  const { isDark, setTheme, theme } = useTheme();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const themeOptions = [
    { value: 'light', label: 'Clair', icon: 'sun' },
    { value: 'dark', label: 'Sombre', icon: 'moon' },
    { value: 'system', label: 'Système', icon: 'smartphone' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" showsVerticalScrollIndicator={false}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={['#F5A623', '#E0950A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 }}
      >
        <Text className="text-white text-xl font-bold">Paramètres</Text>
      </LinearGradient>

      <View className="px-5 mt-6">
        {/* Thème */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Apparence
        </Text>
        <Card variant="elevated" className="p-4 mb-6">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Thème
          </Text>
          <View className="flex-row gap-3">
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setTheme(option.value as any)}
                className={cn(
                  'flex-1 py-3 rounded-xl items-center border',
                  theme === option.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                )}
              >
                <Feather
                  name={option.icon as any}
                  size={22}
                  color={theme === option.value ? '#F5A623' : '#94A3B8'}
                />
                <Text
                  className={cn(
                    'text-sm mt-2',
                    theme === option.value
                      ? 'text-primary-500 font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Notifications */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Notifications
        </Text>
        <Card variant="elevated" className="p-4 mb-6">
          <View className="flex-row justify-between items-center py-2">
            <View>
              <Text className="text-base font-medium text-gray-900 dark:text-white">
                Notifications push
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Recevoir les alertes sur votre téléphone
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#D1D5DB', true: '#F5A623' }}
            />
          </View>
          <View className="flex-row justify-between items-center py-2 mt-3">
            <View>
              <Text className="text-base font-medium text-gray-900 dark:text-white">
                Notifications email
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Recevoir les alertes par email
              </Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: '#D1D5DB', true: '#F5A623' }}
            />
          </View>
        </Card>

        {/* Stockage */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Stockage
        </Text>
        <Card variant="elevated" className="p-4">
          <TouchableOpacity className="flex-row justify-between items-center py-2">
            <View>
              <Text className="text-base font-medium text-gray-900 dark:text-white">
                Vider le cache
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Libérer de l'espace de stockage
              </Text>
            </View>
            <Feather name="trash-2" size={18} color="#EF4444" />
          </TouchableOpacity>
        </Card>

        {/* Version */}
        <Text className="text-center text-gray-400 dark:text-gray-600 text-xs mt-8 mb-10">
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};