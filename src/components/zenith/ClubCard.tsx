// components/zenith/ClubCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export interface Club {
  id: string;
  nom: string;
  description: string;
  logo?: string;
  couleur: string;
  nbMembres: number;
  isMember?: boolean;
  role?: 'RESPONSABLE' | 'ENCADRANT' | 'MEMBRE';
  prochainEvent?: string;
}

interface ClubCardProps {
  club: Club;
  onPress?: () => void;
  onJoin?: () => void;
  onLeave?: () => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  club,
  onPress,
  onJoin,
  onLeave,
}) => {
  const getRoleConfig = (role?: string) => {
    switch (role) {
      case 'RESPONSABLE':
        return { label: 'Responsable', color: '#F5A623' };
      case 'ENCADRANT':
        return { label: 'Encadrant', color: '#2DD4BF' };
      default:
        return { label: 'Membre', color: '#6B7280' };
    }
  };

  const roleConfig = getRoleConfig(club.role);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
    >
      <Card onPress={onPress} variant="elevated" className="overflow-hidden">
        {/* Bandeau couleur */}
        <View
          className="h-1 absolute top-0 left-0 right-0"
          style={{ backgroundColor: club.couleur }}
        />

        <View className="pt-2">
          {/* En-tête */}
          <View className="flex-row items-center gap-3 mb-3">
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: `${club.couleur}15` }}
            >
              <Feather name="users" size={22} color={club.couleur} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900 dark:text-white">
                {club.nom}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <Feather name="users" size={12} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {club.nbMembres} membres
                </Text>
                {club.isMember && (
                  <Badge text={roleConfig.label} variant="primary" size="sm" />
                )}
              </View>
            </View>
          </View>

          {/* Description */}
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3" numberOfLines={2}>
            {club.description}
          </Text>

          {/* Prochain événement */}
          {club.prochainEvent && (
            <View className="flex-row items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Feather name="calendar" size={14} color="#F5A623" />
              <Text className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                {club.prochainEvent}
              </Text>
            </View>
          )}

          {/* Boutons d'action */}
          {club.isMember ? (
            <TouchableOpacity
              onPress={onLeave}
              className="flex-row items-center justify-center gap-2 py-2 rounded-xl border border-red-500"
            >
              <Feather name="log-out" size={16} color="#EF4444" />
              <Text className="text-sm font-medium text-red-500">Quitter le club</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onJoin}
              className="flex-row items-center justify-center gap-2 py-2 rounded-xl bg-primary-500"
            >
              <Feather name="user-plus" size={16} color="white" />
              <Text className="text-sm font-medium text-white">Rejoindre le club</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </MotiView>
  );
};