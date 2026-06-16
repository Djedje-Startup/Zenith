// screens/parent/ParentPaymentsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/animations/EmptyState';

interface Invoice {
  id: string;
  numero: string;
  libelle: string;
  montant: number;
  montantPaye: number;
  solde: number;
  dateEcheance: string;
  statut: 'PAYEE' | 'PARTIELLE' | 'EN_RETARD' | 'EMISE';
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    numero: 'FACT-2025-001',
    libelle: 'Frais de scolarité 1er trimestre',
    montant: 150000,
    montantPaye: 150000,
    solde: 0,
    dateEcheance: '2025-10-15',
    statut: 'PAYEE',
  },
  {
    id: '2',
    numero: 'FACT-2025-002',
    libelle: 'Frais de scolarité 2ème trimestre',
    montant: 150000,
    montantPaye: 50000,
    solde: 100000,
    dateEcheance: '2026-01-15',
    statut: 'PARTIELLE',
  },
  {
    id: '3',
    numero: 'FACT-2025-003',
    libelle: 'Frais de cantine',
    montant: 75000,
    montantPaye: 0,
    solde: 75000,
    dateEcheance: '2025-09-30',
    statut: 'EN_RETARD',
  },
];

const getStatutConfig = (statut: string) => {
  switch (statut) {
    case 'PAYEE': return { label: 'Payée', color: '#10B981', icon: 'check-circle' };
    case 'PARTIELLE': return { label: 'Partiel', color: '#F59E0B', icon: 'clock' };
    case 'EN_RETARD': return { label: 'En retard', color: '#EF4444', icon: 'alert-triangle' };
    default: return { label: 'En attente', color: '#6B7280', icon: 'clock' };
  }
};

const formatMontant = (montant: number) => `${montant.toLocaleString()} FCFA`;

export const ParentPaymentsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePay = (invoice: Invoice) => {
    Alert.alert(
      'Paiement',
      `Voulez-vous payer ${formatMontant(invoice.solde)} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Payer', onPress: () => Alert.alert('Succès', 'Paiement effectué') },
      ]
    );
  };

  const totalDu = invoices.reduce((sum, inv) => sum + inv.solde, 0);
  const pendingCount = invoices.filter(inv => inv.statut !== 'PAYEE').length;

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
        <Text className="text-white text-xl font-bold">Paiements</Text>
        <Text className="text-white/80 text-sm mt-1">{pendingCount} facture(s) en attente</Text>
      </LinearGradient>

      {/* Résumé financier */}
      {totalDu > 0 && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 100 }}
          className="mx-5 mt-5"
        >
          <Card variant="elevated" className="flex-row justify-between items-center p-4">
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">Total restant dû</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMontant(totalDu)}
              </Text>
            </View>
            <Feather name="credit-card" size={32} color="#F5A623" />
          </Card>
        </MotiView>
      )}

      {/* Liste des factures */}
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => {
          const statutConfig = getStatutConfig(item.statut);
          const isExpanded = expandedId === item.id;
          const isPayable = item.statut !== 'PAYEE';

          return (
            <MotiView
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: index * 100 }}
              className="mx-5 mb-4"
            >
              <Card variant="elevated" className="overflow-hidden">
                <TouchableOpacity
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.libelle}
                    </Text>
                    <Badge text={statutConfig.label} size="sm" />
                  </View>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Facture N° {item.numero}
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">Montant total</Text>
                    <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatMontant(item.montant)}
                    </Text>
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ type: 'timing', duration: 200 }}
                    className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800"
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm text-gray-500 dark:text-gray-400">Déjà payé</Text>
                      <Text className="text-sm text-green-600 dark:text-green-400">
                        {formatMontant(item.montantPaye)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                      <Text className="text-sm text-gray-500 dark:text-gray-400">Solde restant</Text>
                      <Text className="text-base font-bold text-primary-500">
                        {formatMontant(item.solde)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-sm text-gray-500 dark:text-gray-400">Date d'échéance</Text>
                      <Text className="text-sm text-gray-900 dark:text-white">
                        {item.dateEcheance}
                      </Text>
                    </View>
                    {isPayable && (
                      <Button
                        title="Payer maintenant"
                        onPress={() => handlePay(item)}
                        variant="primary"
                        size="sm"
                      />
                    )}
                  </MotiView>
                )}

                {item.paiements && item.paiements.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setExpandedId(isExpanded ? null : item.id)}
                    className="py-2 items-center border-t border-gray-100 dark:border-gray-800"
                  >
                    <Feather
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                )}
              </Card>
            </MotiView>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="Aucune facture"
            description="Aucune facture n'est disponible"
            icon="credit-card"
          />
        }
      />
    </View>
  );
};