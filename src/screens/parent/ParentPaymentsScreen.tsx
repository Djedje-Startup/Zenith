// screens/parent/ParentPaymentsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
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
interface Invoice {
  id: string;
  numero: string;
  libelle: string;
  montant: number;
  montantPaye: number;
  solde: number;
  dateEcheance: string;
  statut: 'PAYEE' | 'PARTIELLE' | 'EN_RETARD' | 'EMISE';
  paiements?: Payment[];
}

interface Payment {
  id: string;
  date: string;
  montant: number;
  mode: string;
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    numero: 'FACT-2025-001',
    libelle: 'Frais de scolarité 1er trimestre',
    montant: 150000,
    montantPaye: 150000,
    solde: 0,
    dateEcheance: '15 oct. 2025',
    statut: 'PAYEE',
    paiements: [
      { id: 'p1', date: '10 sept. 2025', montant: 150000, mode: 'Mobile Money' },
    ],
  },
  {
    id: '2',
    numero: 'FACT-2025-002',
    libelle: 'Frais de scolarité 2ème trimestre',
    montant: 150000,
    montantPaye: 50000,
    solde: 100000,
    dateEcheance: '15 janv. 2026',
    statut: 'PARTIELLE',
    paiements: [
      { id: 'p2', date: '05 déc. 2025', montant: 50000, mode: 'Carte bancaire' },
    ],
  },
  {
    id: '3',
    numero: 'FACT-2025-003',
    libelle: 'Frais de cantine',
    montant: 75000,
    montantPaye: 0,
    solde: 75000,
    dateEcheance: '30 sept. 2025',
    statut: 'EN_RETARD',
  },
  {
    id: '4',
    numero: 'FACT-2025-004',
    libelle: 'Frais d\'examen',
    montant: 50000,
    montantPaye: 0,
    solde: 50000,
    dateEcheance: '20 nov. 2025',
    statut: 'EMISE',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const getStatutConfig = (statut: string) => {
  switch (statut) {
    case 'PAYEE':
      return { 
        label: 'Payée', 
        color: C.green, 
        bg: C.greenBg, 
        icon: 'check-circle',
        variant: 'success' as const,
      };
    case 'PARTIELLE':
      return { 
        label: 'Partiel', 
        color: C.amber, 
        bg: C.amberBg, 
        icon: 'clock',
        variant: 'warning' as const,
      };
    case 'EN_RETARD':
      return { 
        label: 'En retard', 
        color: C.red, 
        bg: C.redBg, 
        icon: 'alert-triangle',
        variant: 'error' as const,
      };
    default:
      return { 
        label: 'En attente', 
        color: C.blue, 
        bg: C.blueBg, 
        icon: 'clock',
        variant: 'info' as const,
      };
  }
};

const formatMontant = (montant: number) => `${montant.toLocaleString()} FCFA`;

const getProgressPercentage = (montant: number, montantPaye: number) => {
  if (montant === 0) return 0;
  return Math.round((montantPaye / montant) * 100);
};

// ─── Progress Bar ──────────────────────────────────────────────────────────
const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: Math.min(percentage, 100),
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View
      style={{
        height: 3,
        flex: 1,
        backgroundColor: C.border,
        borderRadius: 1.5,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          height: 3,
          backgroundColor: color,
          borderRadius: 1.5,
          width: widthAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </View>
  );
};

// ─── Invoice Card ──────────────────────────────────────────────────────────
const InvoiceCard = ({
  invoice,
  index,
  onPay,
}: {
  invoice: Invoice;
  index: number;
  onPay: (invoice: Invoice) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statutConfig = getStatutConfig(invoice.statut);
  const isPayable = invoice.statut !== 'PAYEE';
  const progress = getProgressPercentage(invoice.montant, invoice.montantPaye);

  // Animations
  const translateY = useRef(new Animated.Value(15)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const expandHeight = useRef(new Animated.Value(0)).current;
  const expandOpacity = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandHeight, {
        toValue: isExpanded ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(expandOpacity, {
        toValue: isExpanded ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded]);

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
        glow={invoice.statut === 'PAYEE'}
        borderGlow={invoice.statut === 'PAYEE'}
      >
        {/* Bandeau de statut */}
        <LinearGradient
          colors={[
            invoice.statut === 'PAYEE' ? C.green + '60' :
            invoice.statut === 'EN_RETARD' ? C.red + '60' :
            invoice.statut === 'PARTIELLE' ? C.amber + '60' :
            C.blue + '60',
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
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: C.textPrimary,
                    letterSpacing: -0.2,
                  }}
                  numberOfLines={1}
                >
                  {invoice.libelle}
                </Text>
                <Text style={{ fontSize: 12, marginTop: 2, color: C.textMuted }}>
                  N° {invoice.numero}
                </Text>
              </View>
              <Badge
                text={`${statutConfig.icon} ${statutConfig.label}`}
                variant={statutConfig.variant}
                size="sm"
                glow={invoice.statut === 'PAYEE'}
              />
            </View>

            {/* Montant et progression */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: invoice.solde > 0 ? C.textPrimary : C.green,
                }}
              >
                {formatMontant(invoice.montant)}
              </Text>
              {invoice.solde > 0 && (
                <Text style={{ fontSize: 12, color: C.textMuted }}>
                  Reste {formatMontant(invoice.solde)}
                </Text>
              )}
            </View>

            {/* Barre de progression */}
            {invoice.statut !== 'PAYEE' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <ProgressBar percentage={progress} color={statutConfig.color} />
                <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
                  {progress}%
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Expansion */}
          <Animated.View
            style={{
              overflow: 'hidden',
              maxHeight: expandHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 500],
              }),
              opacity: expandOpacity,
            }}
          >
            <View
              style={{
                paddingTop: 14,
                marginTop: 12,
                borderTopWidth: 1,
                borderTopColor: C.border,
              }}
            >
              {/* Détails des paiements */}
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: C.textMuted }}>
                    Date d'échéance
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: invoice.statut === 'EN_RETARD' ? C.red : C.textSecondary,
                    }}
                  >
                    {invoice.dateEcheance}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: C.textMuted }}>
                    Déjà payé
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: C.green }}>
                    {formatMontant(invoice.montantPaye)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12 }}>
                  <Text style={{ fontSize: 12, color: C.textMuted }}>
                    Solde restant
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: invoice.solde > 0 ? C.accent : C.green,
                    }}
                  >
                    {formatMontant(invoice.solde)}
                  </Text>
                </View>

                {/* Historique des paiements */}
                {invoice.paiements && invoice.paiements.length > 0 && (
                  <View
                    style={{
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: C.border,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, color: C.textMuted }}>
                      Historique des paiements
                    </Text>
                    {invoice.paiements.map((payment) => (
                      <View
                        key={payment.id}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: 4,
                        }}
                      >
                        <Text style={{ fontSize: 12, color: C.textMuted }}>
                          {payment.date}
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: '500', color: C.green }}>
                          {formatMontant(payment.montant)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Bouton de paiement */}
                {isPayable && (
                  <View style={{ marginTop: 12 }}>
                    <Button
                      title={`Payer ${formatMontant(invoice.solde)}`}
                      onPress={() => onPay(invoice)}
                      variant="gradient"
                      size="sm"
                      fullWidth
                      icon={<Feather name="credit-card" size={14} color="#FFFFFF" />}
                    />
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Bouton d'expansion */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsExpanded(!isExpanded)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 10,
              marginTop: 10,
              borderTopWidth: 1,
              borderTopColor: C.border,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '500', color: C.textMuted }}>
              {isExpanded ? 'Masquer les détails' : 'Voir les détails'}
            </Text>
            <Feather
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={C.textMuted}
            />
          </TouchableOpacity>
        </View>
      </Card>
    </Animated.View>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────
const Header = ({ children, count }: { children: string; count: number }) => {
  const { user } = useAuth();
  const initials = `${user?.prenoms?.[0] ?? ''}${user?.nom?.[0] ?? ''}`.toUpperCase();

  const totalDu = MOCK_INVOICES.reduce((sum, inv) => sum + inv.solde, 0);
  const pendingCount = MOCK_INVOICES.filter(inv => inv.statut !== 'PAYEE').length;

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
          {count} facture{count > 1 ? 's' : ''}
        </Text>
        {pendingCount > 0 && (
          <>
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: C.textMuted,
              }}
            />
            <Text style={{ fontSize: 12, color: C.textMuted }}>
              {pendingCount} en attente
            </Text>
          </>
        )}
        {totalDu > 0 && (
          <>
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: C.textMuted,
              }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 12, color: C.textMuted }}>Dû</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: C.accent,
                  letterSpacing: -0.2,
                }}
              >
                {formatMontant(totalDu)}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────
export const ParentPaymentsScreen: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePay = (invoice: Invoice) => {
    Alert.alert(
      'Confirmation de paiement',
      `Voulez-vous payer le solde de ${formatMontant(invoice.solde)} pour "${invoice.libelle}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            Alert.alert(
              'Paiement effectué',
              'Votre paiement a été enregistré avec succès',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  if (!user) return <LoadingSpinner fullScreen />;

  if (invoices.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <Header children="Paiements" count={0} />
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
          <EmptyState
            title="Aucune facture"
            description="Aucune facture n'est disponible pour le moment"
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
        data={invoices}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        renderItem={({ item, index }) => (
          <InvoiceCard invoice={item} index={index} onPay={handlePay} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <Header children="Paiements" count={invoices.length} />
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
              {invoices.filter(i => i.statut === 'PAYEE').length} facture{invoices.filter(i => i.statut === 'PAYEE').length > 1 ? 's' : ''} payée{invoices.filter(i => i.statut === 'PAYEE').length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      />
    </View>
  );
};