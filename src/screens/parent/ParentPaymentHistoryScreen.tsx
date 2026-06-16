// screens/parent/ParentPaymentHistoryScreen.tsx
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
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/animations/EmptyState';

interface Payment {
  id: string;
  reference: string;
  montant: number;
  date: string;
  mode: string;
  statut: 'VALIDE' | 'EN_ATTENTE' | 'ECHOUE';
  factureNumero: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    reference: 'PAY-2025-001',
    montant: 150000,
    date: '2025-09-10',
    mode: 'MOBILE_MONEY',
    statut: 'VALIDE',
    factureNumero: 'FACT-2025-001',
  },
  {
    id: '2',
    reference: 'PAY-2025-002',
    montant: 50000,
    date: '2025-12-05',
    mode: 'CARTE',
    statut: 'VALIDE',
    factureNumero: 'FACT-2025-002',
  },
];

const getStatutConfig = (statut: string) => {
  switch (statut) {
    case 'VALIDE': return { label: 'Validé', color: '#10B981' };
    case 'EN_ATTENTE': return { label: 'En attente', color: '#F59E0B' };
    default: return { label: 'Échoué', color: '#EF4444' };
  }
};

const formatMontant = (montant: number) => `${montant.toLocaleString()} FCFA`;

export const ParentPaymentHistoryScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

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
        <Text className="text-white text-xl font-bold">Historique des paiements</Text>
        <Text className="text-white/80 text-sm mt-1">{payments.length} paiement(s) effectué(s)</Text>
      </LinearGradient>

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => {
          const statutConfig = getStatutConfig(item.statut);
          return (
            <MotiView
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 100 }}
              className="mx-5 mb-4"
            >
              <Card variant="elevated" className="p-4">
                <View className="flex-row justify-between items-center mb-3">
                  <View>
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {formatMontant(item.montant)}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Réf: {item.reference}
                    </Text>
                  </View>
                  <Badge text={statutConfig.label} size="sm" />
                </View>

                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Date</Text>
                  <Text className="text-sm text-gray-900 dark:text-white">{item.date}</Text>
                </View>

                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Mode de paiement</Text>
                  <View className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {item.mode}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Facture</Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.factureNumero}
                  </Text>
                </View>
              </Card>
            </MotiView>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="Aucun paiement"
            description="Aucun historique de paiement n'est disponible"
            icon="credit-card"
          />
        }
      />
    </View>
  );
};