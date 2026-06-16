// components/zenith/TimetableCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export interface TimetableEntry {
  id: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  professeur: string;
  salle: string;
  type?: 'CM' | 'TD' | 'TP' | 'EXAMEN';
}

interface TimetableCardProps {
  entries: TimetableEntry[];
  dayName: string;
  dayNumber: number;
  isToday?: boolean;
  onPressEntry?: (entry: TimetableEntry) => void;
  onPressDay?: () => void;
}

const getTypeColor = (type?: string) => {
  switch (type) {
    case 'CM': return '#3B82F6';
    case 'TD': return '#10B981';
    case 'TP': return '#F59E0B';
    case 'EXAMEN': return '#EF4444';
    default: return '#6B7280';
  }
};

const getTypeLabel = (type?: string) => {
  switch (type) {
    case 'CM': return 'CM';
    case 'TD': return 'TD';
    case 'TP': return 'TP';
    case 'EXAMEN': return 'EXAMEN';
    default: return '';
  }
};

export const TimetableCard: React.FC<TimetableCardProps> = ({
  entries,
  dayName,
  dayNumber,
  isToday = false,
  onPressEntry,
  onPressDay,
}) => {
  const hasEntries = entries.length > 0;

  return (
    <Card
      variant="elevated"
      className={cn('mb-4', isToday && 'border-l-4 border-l-primary-500')}
    >
      {/* En-tête du jour */}
      <TouchableOpacity onPress={onPressDay} activeOpacity={0.7}>
        <View className="flex-row justify-between items-center mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
          <View>
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {dayName} {dayNumber}
            </Text>
            {isToday && (
              <Badge text="Aujourd'hui" variant="primary" size="sm" className="mt-1" />
            )}
          </View>
          <Feather name="chevron-right" size={18} color="#9CA3AF" />
        </View>
      </TouchableOpacity>

      {/* Liste des cours */}
      {hasEntries ? (
        <View className="gap-2">
          {entries.map((entry, index) => (
            <MotiView
              key={entry.id}
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 50 }}
            >
              <TouchableOpacity
                onPress={() => onPressEntry?.(entry)}
                className="flex-row items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 active:bg-gray-100 dark:active:bg-gray-700/50"
              >
                {/* Heure */}
                <View className="w-16">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    {entry.heureDebut}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.heureFin}
                  </Text>
                </View>

                <View className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-3" />

                {/* Infos cours */}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {entry.matiere}
                    </Text>
                    {entry.type && (
                      <View
                        className="px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${getTypeColor(entry.type)}15` }}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{ color: getTypeColor(entry.type) }}
                        >
                          {getTypeLabel(entry.type)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center gap-3 mt-1">
                    <View className="flex-row items-center gap-1">
                      <Feather name="user" size={11} color="#94A3B8" />
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.professeur}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Feather name="map-pin" size={11} color="#94A3B8" />
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.salle}
                      </Text>
                    </View>
                  </View>
                </View>

                <Feather name="chevron-right" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>
      ) : (
        <View className="py-6 items-center justify-center">
          <Feather name="calendar" size={28} color="#9CA3AF" />
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Aucun cours ce jour
          </Text>
        </View>
      )}
    </Card>
  );
};