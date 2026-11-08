// screens/parent/ParentPaymentHistoryScreen.tsx
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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── GRADIENTS TYPES ──────────────────────────────────────────────────────
const GRADIENT_BRAND: [string, string] = ['#F97316', '#8B5CF6'];

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface Payment {
  id: string;
  reference: string;
  montant: number;
  date: string;
  mode: string;
  statut: 'VALIDE' | 'EN_ATTENTE' | 'ECHOUE';
  factureNumero: string;
  description?: string;
}

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    reference: 'PAY-2025-001',
    montant: 150000,
    date: '10 sept. 2025',
    mode: 'Mobile Money',
    statut: 'VALIDE',
    factureNumero: 'FACT-2025-001',
    description: 'Frais de scolarité 1er trimestre',
  },
  {
    id: '2',
    reference: 'PAY-2025-002',
    montant: 50000,
    date: '05 déc. 2025',
    mode: 'Carte bancaire',
    statut: 'VALIDE',
    factureNumero: 'FACT-2025-002',
    description: 'Frais d\'examen',
  },
  {
    id: '3',
    reference: 'PAY-2025-003',
    montant: 25000,
    date: '15 nov. 2025',
    mode: 'Espèces',
    statut: 'EN_ATTENTE',
    factureNumero: 'FACT-2025-003',
    description: 'Cotisation club sportif',
  },
  {
    id: '4',
    reference: 'PAY-2025-004',
    montant: 75000,
    date: '20 août 2025',
    mode: 'Mobile Money',
    statut: 'ECHOUE',
    factureNumero: 'FACT-2025-004',
    description: 'Frais de scolarité 2ème trimestre',
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────
const getStatutConfig = (statut: string, colors: any) => {
  switch (statut) {
    case 'VALIDE':
      return { 
        label: 'Validé', 
        color: colors.success, 
        bg: `${colors.success}15`,
        icon: 'check-circle' as keyof typeof Feather.glyphMap,
      };
    case 'EN_ATTENTE':
      return { 
        label: 'En attente', 
        color: colors.warning, 
        bg: `${colors.warning}15`,
        icon: 'clock' as keyof typeof Feather.glyphMap,
      };
    default:
      return { 
        label: 'Échoué', 
        color: colors.error, 
        bg: `${colors.error}15`,
        icon: 'x-circle' as keyof typeof Feather.glyphMap,
      };
  }
};

const formatMontant = (montant: number) => `${montant.toLocaleString()} FCFA`;

const getModeIcon = (mode: string): keyof typeof Feather.glyphMap => {
  switch (mode) {
    case 'Mobile Money': return 'smartphone';
    case 'Carte bancaire': return 'credit-card';
    case 'Espèces': return 'dollar-sign';
    default: return 'credit-card';
  }
};

// ─── PAYMENT CARD ──────────────────────────────────────────────────────────
const PaymentCard = ({ payment, index, colors, isDark }: { payment: Payment; index: number; colors: any; isDark: boolean }) => {
  const statutConfig = getStatutConfig(payment.statut, colors);
  const modeIcon = getModeIcon(payment.mode);
  const shadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)';

  const translateY = useRef(new Animated.Value(15)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 25,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: opacity,
        transform: [{ translateY: translateY }],
        marginBottom: 12,
      }}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.2 : 0.04,
          shadowRadius: 8,
          elevation: isDark ? 2 : 1,
          padding: 16,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
                letterSpacing: -0.3,
              }}
            >
              {formatMontant(payment.montant)}
            </Text>
            {payment.description && (
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
                {payment.description}
              </Text>
            )}
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: statutConfig.bg,
              borderWidth: 1,
              borderColor: statutConfig.color + '30',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Feather name={statutConfig.icon} size={10} color={statutConfig.color} />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: statutConfig.color,
              }}
            >
              {statutConfig.label}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="hash" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {payment.reference}
            </Text>
          </View>

          <View
            style={{
              width: 1,
              height: 14,
              backgroundColor: colors.border,
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="calendar" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {payment.date}
            </Text>
          </View>

          <View
            style={{
              width: 1,
              height: 14,
              backgroundColor: colors.border,
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name={modeIcon} size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>
              {payment.mode}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 11, color: colors.textMuted }}>
            Facture: {payment.factureNumero}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.primary }}>
              Voir la facture
            </Text>
            <Feather name="chevron-right" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// ─── FILTER BUTTON ──────────────────────────────────────────────────────────
const FilterButton = ({ 
  label, 
  count, 
  isActive, 
  onPress, 
  colors 
}: { 
  label: string; 
  count: number; 
  isActive: boolean; 
  onPress: () => void; 
  colors: any;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={{
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: isActive ? colors.primary : 'transparent',
      borderWidth: 1,
      borderColor: isActive ? colors.primary : colors.border,
      alignItems: 'center',
      marginRight: 6,
    }}
  >
    <Text
      style={{
        fontSize: 11,
        fontWeight: isActive ? '600' : '500',
        color: isActive ? '#FFFFFF' : colors.textSecondary,
      }}
    >
      {label}
    </Text>
    {count > 0 && (
      <Text
        style={{
          fontSize: 9,
          fontWeight: '500',
          color: isActive ? 'rgba(255,255,255,0.6)' : colors.textMuted,
        }}
      >
        {count}
      </Text>
    )}
  </TouchableOpacity>
);

// ─── EMPTY STATE ────────────────────────────────────────────────────────────
const EmptyState = ({ title, description, icon, colors }: { title: string; description: string; icon: keyof typeof Feather.glyphMap; colors: any }) => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 50,
    }}
  >
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary + '12',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
      }}
    >
      <Feather name={icon} size={24} color={colors.primary} />
    </View>
    <Text
      style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'center',
      }}
    >
      {description}
    </Text>
  </View>
);

// ─── SCREEN PRINCIPAL ──────────────────────────────────────────────────────
export const ParentPaymentHistoryScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const [payments] = useState(MOCK_PAYMENTS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'TOUS' | 'VALIDE' | 'EN_ATTENTE' | 'ECHOUE'>('TOUS');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredPayments = filter === 'TOUS' 
    ? payments 
    : payments.filter(p => p.statut === filter);

  const stats = {
    total: payments.length,
    valide: payments.filter(p => p.statut === 'VALIDE').length,
    enAttente: payments.filter(p => p.statut === 'EN_ATTENTE').length,
    echoue: payments.filter(p => p.statut === 'ECHOUE').length,
  };

  const totalValide = payments
    .filter(p => p.statut === 'VALIDE')
    .reduce((sum, p) => sum + p.montant, 0);

  const initials = 'JD';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item, index }) => (
          <PaymentCard
            payment={item}
            index={index}
            colors={colors}
            isDark={isDark}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* ───── BANNIÈRE ───── */}
            <LinearGradient
              colors={GRADIENT_BRAND}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingTop: 56,
                paddingBottom: 24,
                paddingHorizontal: 22,
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 28,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 12,
                      padding: 10,
                      marginRight: 12,
                    }}
                  >
                    <Feather name="arrow-left" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '800', color: '#FFFFFF' }}>Z</Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '700',
                        letterSpacing: 2.5,
                        color: 'rgba(255,255,255,0.8)',
                        textTransform: 'uppercase',
                      }}
                    >
                      ZENITH
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    padding: 10,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
                    {initials}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  letterSpacing: -0.3,
                }}
              >
                Historique des paiements
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  {payments.length} paiement{payments.length > 1 ? 's' : ''}
                </Text>
                <View
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  }}
                />
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  Total: <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>
                    {formatMontant(totalValide)}
                  </Text>
                </Text>
              </View>
            </LinearGradient>

            {/* ───── FILTRES ───── */}
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 0,
                paddingVertical: 12,
                backgroundColor: colors.background,
              }}
            >
              <FilterButton
                label="Tous"
                count={stats.total}
                isActive={filter === 'TOUS'}
                onPress={() => setFilter('TOUS')}
                colors={colors}
              />
              <FilterButton
                label="Validés"
                count={stats.valide}
                isActive={filter === 'VALIDE'}
                onPress={() => setFilter('VALIDE')}
                colors={colors}
              />
              <FilterButton
                label="En attente"
                count={stats.enAttente}
                isActive={filter === 'EN_ATTENTE'}
                onPress={() => setFilter('EN_ATTENTE')}
                colors={colors}
              />
              <FilterButton
                label="Échoués"
                count={stats.echoue}
                isActive={filter === 'ECHOUE'}
                onPress={() => setFilter('ECHOUE')}
                colors={colors}
              />
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Aucun paiement"
            description="Aucun paiement ne correspond à ce filtre"
            icon="filter"
            colors={colors}
          />
        )}
        ListFooterComponent={() => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              paddingVertical: 12,
            }}
          >
            <Feather name="info" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 10, color: colors.textMuted }}>
              {filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''} affiché{filteredPayments.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      />
    </View>
  );
};