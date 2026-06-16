// screens/shared/AboutScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';

interface LinkItem {
  title: string;
  url: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

export const AboutScreen: React.FC = () => {
  const { isDark } = useTheme();

  const links: LinkItem[] = [
    { title: 'Site web', url: 'https://surya-education.com', icon: 'globe', color: '#3B82F6' },
    { title: 'Support technique', url: 'mailto:support@surya-education.com', icon: 'mail', color: '#F5A623' },
    { title: 'Conditions d\'utilisation', url: 'https://surya-education.com/terms', icon: 'file-text', color: '#6B7280' },
    { title: 'Politique de confidentialité', url: 'https://surya-education.com/privacy', icon: 'shield', color: '#10B981' },
  ];

  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then(() => Linking.openURL(url));
  };

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
        <Text className="text-white text-xl font-bold">À propos</Text>
      </LinearGradient>

      {/* Logo et infos */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 100 }}
        className="items-center mt-6"
      >
        <LinearGradient
          colors={['#F5A623', '#E0950A']}
          className="w-20 h-20 rounded-full items-center justify-center"
        >
          <Feather name="sun" size={40} color="white" />
        </LinearGradient>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          ZENITH
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          par SURYA
        </Text>
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Version 1.0.0
        </Text>
      </MotiView>

      {/* Description */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 150 }}
        className="px-5 mt-6"
      >
        <Card variant="elevated" className="p-5">
          <Text className="text-base text-gray-700 dark:text-gray-300 leading-6 text-center">
            ZENITH est l'application mobile de SURYA,
            la solution complète de gestion pour établissements d'enseignement.
          </Text>
        </Card>
      </MotiView>

      {/* Liens */}
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: 200 }}
        className="px-5 mt-6"
      >
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Liens utiles
        </Text>
        <Card variant="elevated" className="overflow-hidden">
          {links.map((link, index) => (
            <TouchableOpacity
              key={link.title}
              onPress={() => handleLinkPress(link.url)}
              className={cn(
                'flex-row items-center justify-between p-4',
                index < links.length - 1 && 'border-b border-gray-100 dark:border-gray-800'
              )}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${link.color}20` }}
                >
                  <Feather name={link.icon} size={16} color={link.color} />
                </View>
                <Text className="text-base text-gray-900 dark:text-white">
                  {link.title}
                </Text>
              </View>
              <Feather name="external-link" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </Card>
      </MotiView>

      {/* Crédits */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 250 }}
        className="px-5 mt-6 mb-10"
      >
        <Card variant="elevated" className="p-5">
          <Text className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © 2026 SURYA. Tous droits réservés.
          </Text>
          <Text className="text-center text-gray-400 dark:text-gray-500 text-xs mt-2">
            Conçu et développé par SURYA Tech
          </Text>
        </Card>
      </MotiView>
    </ScrollView>
  );
};

// Import manquant
import { cn } from '../../utils/cn';