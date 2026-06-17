// screens/shared/NotificationsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { EmptyState } from '../../components/animations/EmptyState';

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
    case 'success': return '#34D399';
    case 'warning': return '#FBBF24';
    case 'error': return '#EF4444';
    default: return '#60A5FA';
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

  // Couleurs dynamiques
  const bgColor = isDark ? '#0E1117' : '#F9FAFB';
  const textColor = isDark ? '#E8EAF0' : '#1A1A2E';
  const textSecondary = isDark ? '#CDD0E0' : '#4A5568';
  const textMuted = isDark ? '#4A5060' : '#9CA3AF';
  const borderColor = isDark ? '#1C2030' : '#E5E7EB';

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ─── Header Premium ──────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 56,
          paddingBottom: 24,
          paddingHorizontal: 22,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}>
              Notifications
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              Mes notifications
            </Text>
          </View>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 10,
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.6)',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
              Non lues
            </Text>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              {unreadCount}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* ─── Liste des notifications ────────────────────────────────────────── */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDark ? '#818CF8' : '#6366F1'} 
          />
        }
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 40,
        }}
        renderItem={({ item, index }) => {
          const icon = getTypeIcon(item.type);
          const color = getTypeColor(item.type);
          const isUnread = !item.isRead;

          return (
            <MotiView
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 50 }}
              style={{ paddingHorizontal: 18 }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => markAsRead(item.id)}
                style={{
                  flexDirection: 'row',
                  padding: 16,
                  marginBottom: 8,
                  borderRadius: 14,
                  backgroundColor: isUnread 
                    ? isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'
                    : 'transparent',
                  borderWidth: 1,
                  borderColor: isUnread 
                    ? isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.10)'
                    : borderColor,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: color + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Feather name={icon} size={18} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: isUnread ? '700' : '500',
                    color: isUnread ? textColor : textMuted,
                  }}>
                    {item.titre}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: isUnread ? textSecondary : textMuted,
                    marginTop: 2,
                  }}>
                    {item.message}
                  </Text>
                  <Text style={{
                    fontSize: 11,
                    color: textMuted,
                    marginTop: 6,
                  }}>
                    {item.date}
                  </Text>
                </View>
                {isUnread && (
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: color,
                    alignSelf: 'center',
                    marginLeft: 8,
                  }} />
                )}
              </TouchableOpacity>
            </MotiView>
          );
        }}
        ListEmptyComponent={
          <View style={{ marginTop: 40 }}>
            <EmptyState
              title="Aucune notification"
              description="Vous n'avez pas encore de notifications"
              icon="bell"
              variant="default"
            />
          </View>
        }
      />
    </View>
  );
};