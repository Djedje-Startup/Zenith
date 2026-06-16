// screens/shared/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';

interface MenuItem {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
}

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, colors } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    { icon: 'user', label: 'Informations personnelles', onPress: () => {}, color: '#3B82F6' },
    { icon: 'bell', label: 'Notifications', onPress: () => {}, color: '#F59E0B' },
    { icon: 'shield', label: 'Sécurité', onPress: () => {}, color: '#10B981' },
    { icon: 'help-circle', label: 'Aide et support', onPress: () => {}, color: '#8B5CF6' },
    { icon: 'info', label: 'À propos', onPress: () => {}, color: '#6B7280' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" showsVerticalScrollIndicator={false}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={['#F5A623', '#E0950A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 }}
      >
        <Text className="text-white text-xl font-bold text-center">Mon profil</Text>
      </LinearGradient>

      {/* Avatar et infos */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 100 }}
        className="items-center -mt-8"
      >
        <Avatar
          source={user?.photo}
          name={`${user?.nom} ${user?.prenoms}`}
          size="xl"
          variant="circle"
        />
        <Text className="text-xl font-bold text-gray-900 dark:text-white mt-3">
          {user?.prenoms} {user?.nom}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {user?.role === 'PARENT' ? 'Parent d\'élève' :
           user?.role === 'ELEVE' ? 'Élève' :
           user?.role === 'PROFESSEUR' ? 'Enseignant' : 'Utilisateur'}
        </Text>
      </MotiView>

      {/* Menu */}
      <View className="px-5 mt-6">
        {menuItems.map((item, index) => (
          <MotiView
            key={item.label}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 150 + index * 50 }}
          >
            <TouchableOpacity
              onPress={item.onPress}
              className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800"
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Feather name={item.icon} size={18} color={item.color} />
                </View>
                <Text className="text-base text-gray-900 dark:text-white">
                  {item.label}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>

      {/* Version et déconnexion */}
      <View className="px-5 mt-8 mb-10">
        <Text className="text-center text-gray-400 dark:text-gray-600 text-xs mb-6">
          Version 1.0.0
        </Text>
        <Button
          title="Se déconnecter"
          onPress={handleLogout}
          variant="danger"
          size="md"
        />
      </View>
    </ScrollView>
  );
};