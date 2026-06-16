// screens/professeur/TeacherClassDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { cn } from '../../utils/cn';

interface Eleve {
  id: string;
  nom: string;
  prenoms: string;
  matricule: string;
  moyenne?: number;
}

interface ClassDetail {
  id: string;
  nom: string;
  niveau: string;
  matiere: string;
  effectif: number;
  moyenneClasse: number;
  eleves: Eleve[];
}

const MOCK_CLASS_DETAIL: ClassDetail = {
  id: '1',
  nom: '3ème A',
  niveau: '3ème',
  matiere: 'Mathématiques',
  effectif: 32,
  moyenneClasse: 14.2,
  eleves: [
    { id: '1', nom: 'MOUKOKO', prenoms: 'Jean Junior', matricule: 'LMB-2025-001', moyenne: 15.5 },
    { id: '2', nom: 'NGOMA', prenoms: 'Paul', matricule: 'LMB-2025-002', moyenne: 14.2 },
    { id: '3', nom: 'LOUBAT', prenoms: 'Marie', matricule: 'LMB-2025-003', moyenne: 17.8 },
    { id: '4', nom: 'WAMBA', prenoms: 'Christ', matricule: 'LMB-2025-004', moyenne: 13.5 },
    { id: '5', nom: 'MFOUMOU', prenoms: 'Alain', matricule: 'LMB-2025-005', moyenne: 11.2 },
  ],
};

export const TeacherClassDetailScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [classDetail] = useState(MOCK_CLASS_DETAIL);
  const [activeTab, setActiveTab] = useState<'eleves' | 'notes' | 'presences'>('eleves');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!classDetail) return <LoadingSpinner fullScreen />;

  const tabs = [
    { key: 'eleves', label: 'Élèves', icon: 'users', count: classDetail.eleves.length },
    { key: 'notes', label: 'Notes', icon: 'edit-3' },
    { key: 'presences', label: 'Présences', icon: 'check-square' },
  ] as const;

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={['#F5A623', '#E0950A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 }}
      >
        <Text className="text-white text-2xl font-bold">{classDetail.nom}</Text>
        <Text className="text-white/80 text-sm mt-1">{classDetail.niveau} • {classDetail.matiere}</Text>
        <View className="flex-row justify-between mt-4">
          <View className="flex-1">
            <Text className="text-white/70 text-xs">Effectif</Text>
            <Text className="text-white text-xl font-bold">{classDetail.effectif} élèves</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white/70 text-xs">Moyenne classe</Text>
            <Text className="text-white text-xl font-bold">{classDetail.moyenneClasse.toFixed(2)}/20</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Onglets */}
      <View className="flex-row px-5 mt-4 gap-2">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2',
              activeTab === tab.key ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-800'
            )}
          >
            <Feather name={tab.icon} size={16} color={activeTab === tab.key ? 'white' : isDark ? '#CBD5E1' : '#64748B'} />
            <Text className={cn(
              'text-sm font-medium',
              activeTab === tab.key ? 'text-white' : 'text-gray-600 dark:text-gray-400'
            )}>
              {tab.label}
              {tab.count !== undefined && ` (${tab.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu */}
      <View className="p-5">
        {activeTab === 'eleves' && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 100 }}>
            {classDetail.eleves.map((eleve, index) => (
              <MotiView
                key={eleve.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 150 + index * 50 }}
              >
                <Card variant="elevated" className="mb-3 p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Avatar name={`${eleve.nom} ${eleve.prenoms}`} size="md" />
                    <View>
                      <Text className="font-semibold text-gray-900 dark:text-white">
                        {eleve.prenoms} {eleve.nom}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Matricule: {eleve.matricule}
                      </Text>
                    </View>
                  </View>
                  {eleve.moyenne && (
                    <View className="items-end">
                      <Text className="text-lg font-bold" style={{ color: eleve.moyenne >= 10 ? '#10B981' : '#EF4444' }}>
                        {eleve.moyenne.toFixed(2)}
                      </Text>
                      <Text className="text-xs text-gray-400">Moyenne</Text>
                    </View>
                  )}
                </Card>
              </MotiView>
            ))}
          </MotiView>
        )}

        {activeTab === 'notes' && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 100 }}>
            <Button
              title="Saisir les notes"
              onPress={() => {}}
              variant="primary"
              size="lg"
              className="mb-4"
            />
            <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
              <Feather name="info" size={20} color="#F5A623" />
              <Text className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">
                Cliquez sur "Saisir les notes" pour enregistrer ou modifier les notes des élèves
              </Text>
            </View>
          </MotiView>
        )}

        {activeTab === 'presences' && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 100 }}>
            <Button
              title="Faire l'appel"
              onPress={() => {}}
              variant="secondary"
              size="lg"
              className="mb-4"
            />
            <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
              <Feather name="info" size={20} color="#2DD4BF" />
              <Text className="text-gray-600 dark:text-gray-400 text-sm text-center mt-2">
                Cliquez sur "Faire l'appel" pour enregistrer les présences du jour
              </Text>
            </View>
          </MotiView>
        )}
      </View>
    </ScrollView>
  );
};