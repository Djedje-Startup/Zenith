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
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/animations/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  borderSub: '#141720',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.10)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.09)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  pink: '#F472B6',
  pinkBg: 'rgba(244,114,182,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface Payment {
  id: string;
  reference: string;
  montant: number;
  date: string;
  mode: string;
  statut: 'VALIDE' | 'EN_ATTENTE' | 'ECHOUE';
  factureNumero: string;
  description?: string;
  modeIcon?: keyof typeof Feather.glyphMap;
}

// ─── Mock data ──────────────────────────────────────────────────────────────
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
    modeIcon: 'smartphone',
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
    modeIcon: 'credit-card',
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
    modeIcon: 'dollar-sign',
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
    modeIcon: 'smartphone',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const getStatutConfig = (statut: string) => {
  switch (statut) {
    case 'VALIDE':
      return { 
        label: 'Validé', 
        color: C.green, 
        bg: C.greenBg, 
        icon: 'check-circle',
        variant: 'success' as const,
      };
    case 'EN_ATTENTE':
      return { 
        label: 'En attente', 
        color: C.amber, 
        bg: C.amberBg, 
        icon: 'clock',
        variant: 'warning' as const,
      };
    default:
      return { 
        label: 'Échoué', 
        color: C.red, 
        bg: C.redBg, 
        icon: 'x-circle',
        variant: 'error' as const,
      };
  }
};

const formatMontant = (montant: number) => `${montant.toLocaleString()} FCFA`;

const getModeIcon = (mode?: string) => {
  switch (mode) {
    case 'Mobile Money': return 'smartphone';
    case 'Carte bancaire': return 'credit-card';
    case 'Espèces': return 'dollar-sign';
    default: return 'credit-card';
  }
};

// ─── Payment Card ──────────────────────────────────────────────────────────
const PaymentCard = ({ payment, index }: { payment: Payment; index: number }) => {
  const statutConfig = getStatutConfig(payment.statut);
  const modeIcon = payment.modeIcon || getModeIcon(payment.mode);

  // Animation
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
        marginBottom: 16,
      }}
    >
      <Card
        variant="default"
        padding="md"
        glow={payment.statut === 'VALIDE'}
        borderGlow={payment.statut === 'VALIDE'}
      >
        {/* Bandeau de statut */}
        <LinearGradient
          colors={[
            payment.statut === 'VALIDE' ? C.green + '60' :
            payment.statut === 'EN_ATTENTE' ? C.amber + '60' :
            C.red + '60',
            'transparent'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2.5,
          }}
        />

        <View style={{ paddingTop: 4 }}>
          {/* En-tête */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: C.textPrimary,
                    letterSpacing: -0.3,
                  }}
                >
                  {formatMontant(payment.montant)}
                </Text>
                <Badge
                  text={`${statutConfig.icon} ${statutConfig.label}`}
                  variant={statutConfig.variant}
                  size="sm"
                  glow={payment.statut === 'VALIDE'}
                />
              </View>
              {payment.description && (
                <Text style={{ fontSize: 12, marginTop: 4, color: C.textMuted }}>
                  {payment.description}
                </Text>
              )}
            </View>
          </View>

          {/* Détails */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}
          >
            {/* Référence */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="hash" size={11} color={C.textMuted} />
              <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                {payment.reference}
              </Text>
            </View>

            {/* Séparateur */}
            <View
              style={{
                width: 1,
                height: 12,
                backgroundColor: C.border,
              }}
            />

            {/* Date */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="calendar" size={11} color={C.textMuted} />
              <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                {payment.date}
              </Text>
            </View>

            {/* Séparateur */}
            <View
              style={{
                width: 1,
                height: 12,
                backgroundColor: C.border,
              }}
            />

            {/* Mode */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name={modeIcon as any} size={11} color={C.textMuted} />
              <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                {payment.mode}
              </Text>
            </View>
          </View>

          {/* Facture */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="file-text" size={11} color={C.textMuted} />
              <Text style={{ fontSize: 10, color: C.textMuted }}>
                Facture
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: C.accentBg,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '600', color: C.accentDim }}>
                {payment.factureNumero}
              </Text>
              <Feather name="chevron-right" size={10} color={C.accentDim} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────
const Header = ({ children, count }: { children: string; count: number }) => {
  const { user } = useAuth();
  const initials = `${user?.prenoms?.[0] ?? ''}${user?.nom?.[0] ?? ''}`.toUpperCase();

  // Calcul du total
  const total = MOCK_PAYMENTS
    .filter(p => p.statut === 'VALIDE')
    .reduce((sum, p) => sum + p.montant, 0);

  return (
    <View
      style={{
        backgroundColor: C.surface,
        paddingTop: 56,
        paddingBottom: 28,
        paddingHorizontal: 22,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Halos décoratifs */}
      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          backgroundColor: 'rgba(99,102,241,0.06)',
          borderRadius: 100,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -30,
          left: -20,
          width: 140,
          height: 140,
          backgroundColor: 'rgba(52,211,153,0.04)',
          borderRadius: 70,
        }}
      />

      {/* Top bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              backgroundColor: C.surfaceAlt,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: C.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="arrow-left" size={20} color={C.textSecondary} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 2.5,
              color: C.accent,
              textTransform: 'uppercase',
            }}
          >
            ✦ SURYA
          </Text>
        </View>

        <LinearGradient
          colors={['#3730A3', '#6366F1']}
          style={{
            width: 40,
            height: 40,
            borderRadius: 13,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#C7D2FE' }}>
            {initials}
          </Text>
        </LinearGradient>
      </View>

      {/* Titre */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          color: '#E8EAF0',
          letterSpacing: -0.3,
        }}
      >
        {children}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
        <Text style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.2 }}>
          {count} paiement{count > 1 ? 's' : ''}
        </Text>
        <View
          style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: C.textMuted,
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 12, color: C.textMuted }}>Total</Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: C.green,
              letterSpacing: -0.2,
            }}
          >
            {formatMontant(total)}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────
export const ParentPaymentHistoryScreen: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'TOUS' | 'VALIDE' | 'EN_ATTENTE' | 'ECHOUE'>('TOUS');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  const filteredPayments = filter === 'TOUS' 
    ? payments 
    : payments.filter(p => p.statut === filter);

  const stats = {
    total: payments.length,
    valide: payments.filter(p => p.statut === 'VALIDE').length,
    enAttente: payments.filter(p => p.statut === 'EN_ATTENTE').length,
    echoue: payments.filter(p => p.statut === 'ECHOUE').length,
  };

  if (payments.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <Header children="Historique des paiements" count={0} />
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
          <EmptyState
            title="Aucun paiement"
            description="Aucun historique de paiement n'est disponible"
            icon="credit-card"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        renderItem={({ item, index }) => <PaymentCard payment={item} index={index} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            <Header children="Historique des paiements" count={payments.length} />
            
            {/* ─── Filtres ─── */}
            <View
              style={{
                flexDirection: 'row',
                gap: 6,
                marginBottom: 16,
                marginTop: 4,
              }}
            >
              {[
                { key: 'TOUS', label: 'Tous', count: stats.total },
                { key: 'VALIDE', label: 'Validés', count: stats.valide, color: C.green },
                { key: 'EN_ATTENTE', label: 'En attente', count: stats.enAttente, color: C.amber },
                { key: 'ECHOUE', label: 'Échoués', count: stats.echoue, color: C.red },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.7}
                  onPress={() => setFilter(item.key as typeof filter)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: filter === item.key ? C.accent : C.surfaceAlt,
                    borderWidth: 1,
                    borderColor: filter === item.key ? C.accent : C.border,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: filter === item.key ? '#FFFFFF' : C.textSecondary,
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.count > 0 && (
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '500',
                        marginTop: 2,
                        color: filter === item.key ? 'rgba(255,255,255,0.6)' : C.textMuted,
                      }}
                    >
                      {item.count}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={{ paddingVertical: 40 }}>
            <EmptyState
              title="Aucun paiement"
              description="Aucun paiement ne correspond à ce filtre"
              icon="filter"
              variant="compact"
            />
          </View>
        )}
        ListFooterComponent={() => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 4,
              paddingVertical: 12,
            }}
          >
            <Feather name="info" size={12} color={C.textMuted} />
            <Text style={{ fontSize: 10, color: C.textMuted }}>
              {filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''} affiché{filteredPayments.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      />
    </View>
  );
};