// screens/shared/NotificationsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { EmptyState } from '../../components/animations/EmptyState';
import { cn } from '../../utils/cn';

interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  date: string;
}

// Mock data
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', titre: 'Nouvelle note', message: 'Note publiée en Mathématiques', type: 'info', isRead: false, date: '2025-10-16' },
  { id: '2', titre: 'Paiement échu', message: 'Facture de cantine en retard', type: 'warning', isRead: false, date: '2025-10-01' },
  { id: '3', titre: 'Nouvel événement', message: 'Hackathon le 25 octobre', type: 'success', isRead: true, date: '2025-10-10' },
];

const getTypeIcon = (type: string): keyof typeof Feather.glyphMap => {
  switch (type) {
    case 'success': return 'check-circle';
    case 'warning': return 'alert-triangle';
    case 'error': return 'x-circle';
    default: return 'info';
  }
};

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'success': return '#10B981';
    case 'warning': return '#F59E0B';
    case 'error': return '#EF4444';
    default: return '#3B82F6';
  }
};

export const NotificationsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <Text className="text-white text-xl font-bold">Notifications</Text>
        {unreadCount > 0 && (
          <Text className="text-white/80 text-sm mt-1">
            {unreadCount} notification(s) non lue(s)
          </Text>
        )}
      </LinearGradient>

      {/* Liste des notifications */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => {
          const icon = getTypeIcon(item.type);
          const color = getTypeColor(item.type);
          return (
            <MotiView
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 50 }}
            >
              <TouchableOpacity
                onPress={() => markAsRead(item.id)}
                className={cn(
                  'flex-row p-4 border-b border-gray-100 dark:border-gray-800',
                  !item.isRead && 'bg-primary-50 dark:bg-primary-900/10'
                )}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Feather name={icon} size={18} color={color} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.titre}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.message}
                  </Text>
                  <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {item.date}
                  </Text>
                </View>
                {!item.isRead && (
                  <View className="w-2 h-2 rounded-full self-center" style={{ backgroundColor: '#F5A623' }} />
                )}
              </TouchableOpacity>
            </MotiView>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="Aucune notification"
            description="Vous n'avez pas encore de notifications"
            icon="bell-off"
          />
        }
      />
    </View>
  );
};