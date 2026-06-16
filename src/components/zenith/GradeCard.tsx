// components/zenith/GradeCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export interface Grade {
  id: string;
  matiere: string;
  moyenne: number;
  coefficient: number;
  appreciation?: string;
  rang?: number;
  effectif?: number;
}

interface GradeCardProps {
  grades: Grade[];
  moyenneGenerale: number;
  mention: string;
  periode: string;
  onPressGrade?: (grade: Grade) => void;
  onPressBulletin?: () => void;
}

const getMentionColor = (mention: string) => {
  switch (mention) {
    case 'EXCELLENT': return '#10B981';
    case 'TRES_BIEN': return '#3B82F6';
    case 'BIEN': return '#8B5CF6';
    case 'ASSEZ_BIEN': return '#F59E0B';
    case 'PASSABLE': return '#F97316';
    default: return '#EF4444';
  }
};

const getMentionVariant = (mention: string) => {
  switch (mention) {
    case 'EXCELLENT': return 'success';
    case 'TRES_BIEN': return 'info';
    case 'BIEN': return 'info';
    case 'ASSEZ_BIEN': return 'warning';
    case 'PASSABLE': return 'warning';
    default: return 'error';
  }
};

const getGradeColor = (note: number) => {
  if (note >= 16) return '#10B981';
  if (note >= 14) return '#3B82F6';
  if (note >= 12) return '#8B5CF6';
  if (note >= 10) return '#F59E0B';
  return '#EF4444';
};

export const GradeCard: React.FC<GradeCardProps> = ({
  grades,
  moyenneGenerale,
  mention,
  periode,
  onPressGrade,
  onPressBulletin,
}) => {
  const mentionColor = getMentionColor(mention);

  return (
    <Card variant="elevated" className="mb-4">
      {/* En-tête */}
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {periode}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">Bulletin scolaire</Text>
        </View>
        <TouchableOpacity onPress={onPressBulletin} className="p-2">
          <Feather name="download" size={20} color="#F5A623" />
        </TouchableOpacity>
      </View>

      {/* Moyenne générale */}
      <View className="items-center mb-6">
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 100 }}
          className="w-24 h-24 rounded-full items-center justify-center mb-2"
          style={{ backgroundColor: `${mentionColor}15`, borderWidth: 2, borderColor: mentionColor }}
        >
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {moyenneGenerale.toFixed(2)}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">/ 20</Text>
        </MotiView>
        <Badge text={mention} variant={getMentionVariant(mention) as any} size="md" />
      </View>

      {/* Liste des notes par matière */}
      <View className="gap-3">
        {grades.map((grade, index) => (
          <MotiView
            key={grade.id}
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 150 + index * 30 }}
          >
            <TouchableOpacity
              onPress={() => onPressGrade?.(grade)}
              className="flex-row items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
            >
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 dark:text-white">
                  {grade.matiere}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Coef: {grade.coefficient}
                  </Text>
                  {grade.rang && grade.effectif && (
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Rang: {grade.rang}/{grade.effectif}
                    </Text>
                  )}
                </View>
              </View>

              <View className="items-end">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${getGradeColor(grade.moyenne)}15` }}
                >
                  <Text
                    className="text-base font-bold"
                    style={{ color: getGradeColor(grade.moyenne) }}
                  >
                    {grade.moyenne.toFixed(1)}
                  </Text>
                </View>
                {grade.appreciation && (
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {grade.appreciation}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </Card>
  );
};