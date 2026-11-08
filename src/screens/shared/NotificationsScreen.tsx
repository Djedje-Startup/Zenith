// screens/shared/NotificationsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { EmptyState } from '../../components/animations/EmptyState';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  date: string;
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', titre: 'Nouvelle note', message: 'Note publiée en Mathématiques', type: 'info', isRead: false, date: '2025-10-16' },
  { id: '2', titre: 'Paiement échu', message: 'Facture de cantine en retard', type: 'warning', isRead: false, date: '2025-10-01' },
  { id: '3', titre: 'Nouvel événement', message: 'Hackathon le 25 octobre', type: 'success', isRead: true, date: '2025-10-10' },
];

// ──────────────────────────────────────────────────────────────
// COMPOSANT POUR UNE NOTIFICATION INDIVIDUELLE
// ──────────────────────────────────────────────────────────────
interface NotificationItemProps {
  item: Notification;
  index: number;
  onMarkAsRead: (id: string) => void;
  colors: any;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  item, 
  index, 
  onMarkAsRead,
  colors 
}) => {
  const isUnread = !item.isRead;

  // ✅ Hook appelé au top-level du composant
  const translateX = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        damping: 20,
        delay: 50 + index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: 50 + index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: keyof typeof Feather.glyphMap; color: string; bg: string }> = {
      success: { icon: 'check-circle', color: colors.success, bg: colors.success + '15' },
      warning: { icon: 'alert-triangle', color: colors.warning, bg: colors.warning + '15' },
      error: { icon: 'x-circle', color: colors.error, bg: colors.error + '15' },
      info: { icon: 'info', color: colors.info, bg: colors.info + '15' },
    };
    return configs[type] || configs.info;
  };

  const config = getTypeConfig(item.type);

  return (
    <Animated.View
      style={{
        paddingHorizontal: 18,
        transform: [{ translateX }],
        opacity,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onMarkAsRead(item.id)}
        style={{
          flexDirection: 'row',
          padding: 16,
          marginBottom: 8,
          borderRadius: 14,
          backgroundColor: isUnread 
            ? colors.primaryBg
            : colors.surface,
          borderWidth: 1,
          borderColor: isUnread 
            ? colors.primary + '30'
            : colors.border,
        }}
      >
        {/* Icône */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: config.bg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Feather name={config.icon} size={18} color={config.color} />
        </View>

        {/* Contenu */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: isUnread ? '700' : '500',
            color: isUnread ? colors.text : colors.textMuted,
          }}>
            {item.titre}
          </Text>
          <Text style={{
            fontSize: 12,
            color: isUnread ? colors.textSecondary : colors.textMuted,
            marginTop: 2,
          }}>
            {item.message}
          </Text>
          <Text style={{
            fontSize: 11,
            color: colors.textMuted,
            marginTop: 6,
          }}>
            {item.date}
          </Text>
        </View>

        {/* Indicateur non lu */}
        {isUnread && (
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: config.color,
            alignSelf: 'center',
            marginLeft: 8,
          }} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  // ─── Animations ───
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  // ─── RENDU ───
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ─── HEADER AVEC DÉGRADÉ ZENITH ─── */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
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
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <View>
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.6)',
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
            backgroundColor: 'rgba(255,255,255,0.2)',
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

      {/* ─── LISTE DES NOTIFICATIONS ─── */}
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        }}
      >
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 40,
          }}
          renderItem={({ item, index }) => (
            <NotificationItem
              item={item}
              index={index}
              onMarkAsRead={markAsRead}
              colors={colors}
            />
          )}
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
      </Animated.View>
    </View>
  );
};