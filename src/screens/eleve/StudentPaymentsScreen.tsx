// screens/eleve/StudentPaymentsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Design Tokens ────────────────────────────────────────────────────────────
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
  teal: '#2DD4BF',
  tealBg: 'rgba(45,212,191,0.09)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
  white: '#FFFFFF',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Invoice {
  id: string;
  numero: string;
  libelle: string;
  montant: number;
  montantPaye: number;
  solde: number;
  dateEcheance: string;
  statut: 'PAYEE' | 'PARTIELLE' | 'EN_RETARD' | 'EMISE';
  paiements?: { id: string; montant: number; date: string; mode: string }[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
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
    paiements: [
      { id: '1', montant: 150000, date: '2025-09-10', mode: 'Mobile Money' },
    ],
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
    paiements: [
      { id: '2', montant: 50000, date: '2025-12-05', mode: 'Carte' },
    ],
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStatutConfig = (statut: string) => {
  switch (statut) {
    case 'PAYEE':
      return { label: 'Payée', color: C.green, bg: C.greenBg, icon: 'check-circle' as const };
    case 'PARTIELLE':
      return { label: 'Partiel', color: C.amber, bg: C.amberBg, icon: 'clock' as const };
    case 'EN_RETARD':
      return { label: 'En retard', color: C.red, bg: C.redBg, icon: 'alert-triangle' as const };
    default:
      return { label: 'En attente', color: C.textMuted, bg: C.surfaceAlt, icon: 'clock' as const };
  }
};

const formatMontant = (montant: number) => `${montant.toLocaleString()} FCFA`;

// ─── Composants ──────────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: string }) => (
  <Text style={{
    fontSize: 11,
    fontWeight: '700',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  }}>
    {children}
  </Text>
);

const StatutBadge = ({ statut }: { statut: string }) => {
  const config = getStatutConfig(statut);
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: config.bg,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: config.color + '30',
    }}>
      <Feather name={config.icon} size={12} color={config.color} />
      <Text style={{
        fontSize: 10,
        fontWeight: '700',
        color: config.color,
        letterSpacing: 0.3,
        marginLeft: 4,
      }}>
        {config.label}
      </Text>
    </View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────
export const StudentPaymentsScreen: React.FC = () => {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Animations pour les cartes
  const cardAnimations = invoices.map(() => ({
    translateY: useRef(new Animated.Value(20)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    cardAnimations.forEach((anim, index) => {
      Animated.parallel([
        Animated.spring(anim.translateY, {
          toValue: 0,
          damping: 20,
          delay: index * 80,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 300,
          delay: index * 80,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePay = (invoice: Invoice) => {
    Alert.alert(
      'Confirmation de paiement',
      `Voulez-vous payer ${formatMontant(invoice.solde)} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', onPress: () => Alert.alert('Succès', 'Paiement effectué avec succès') },
      ]
    );
  };

  const totalDu = invoices.reduce((sum, inv) => sum + inv.solde, 0);
  const totalPaye = invoices.reduce((sum, inv) => sum + inv.montantPaye, 0);
  const pendingCount = invoices.filter(inv => inv.statut !== 'PAYEE').length;

  // Animation d'expansion
  const expandAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  const getExpandAnimation = (id: string) => {
    if (!expandAnimations[id]) {
      expandAnimations[id] = new Animated.Value(0);
    }
    return expandAnimations[id];
  };

  useEffect(() => {
    invoices.forEach((item) => {
      const anim = getExpandAnimation(item.id);
      const isExpanded = expandedId === item.id;
      Animated.timing(anim, {
        toValue: isExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [expandedId]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ─── Header Premium ──────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4F46E5']}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}>
              Gestion financière
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              Mes paiements
            </Text>
          </View>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
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
              En attente
            </Text>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              {pendingCount}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{
          flexDirection: 'row',
          marginTop: 16,
        }}>
          {[
            { label: 'Total dû', value: formatMontant(totalDu), icon: 'credit-card' as const, color: C.accent },
            { label: 'Total payé', value: formatMontant(totalPaye), icon: 'check-circle' as const, color: C.green },
          ].map((stat, index) => (
            <View key={stat.label} style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: index === 0 ? 10 : 0,
            }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
                <Feather name={stat.icon} size={16} color={stat.color} />
              </View>
              <View>
                <Text style={{
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  {stat.label}
                </Text>
                <Text style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#FFFFFF',
                }}>
                  {stat.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* ─── Liste des factures ────────────────────────────────────────────────── */}
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const isExpanded = expandedId === item.id;
          const isPayable = item.statut !== 'PAYEE';
          const progress = item.montant > 0 ? (item.montantPaye / item.montant) * 100 : 0;
          const anim = cardAnimations[index] || cardAnimations[0];
          const expandAnim = getExpandAnimation(item.id);

          return (
            <Animated.View
              style={{
                marginBottom: 12,
                transform: [{ translateY: anim.translateY }],
                opacity: anim.opacity,
              }}
            >
              <View style={{
                backgroundColor: C.surface,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: isExpanded ? C.accent : C.border,
                overflow: 'hidden',
              }}>
                {/* ─── En-tête de la carte ────────────────────────────────────── */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                  style={{ padding: 16 }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: C.textPrimary,
                        letterSpacing: -0.2,
                        marginBottom: 2,
                      }}>
                        {item.libelle}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: C.textMuted,
                      }}>
                        N° {item.numero}
                      </Text>
                    </View>
                    <StatutBadge statut={item.statut} />
                  </View>

                  {/* ─── Barre de progression ────────────────────────────────── */}
                  <View style={{
                    height: 4,
                    backgroundColor: C.border,
                    borderRadius: 2,
                    marginTop: 14,
                    overflow: 'hidden',
                  }}>
                    <View style={{
                      width: `${Math.min(100, progress)}%`,
                      height: '100%',
                      backgroundColor: progress >= 100 ? C.green : C.accent,
                      borderRadius: 2,
                    }} />
                  </View>

                  {/* ─── Montants ────────────────────────────────────────────── */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 12,
                  }}>
                    <View>
                      <Text style={{
                        fontSize: 10,
                        color: C.textMuted,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}>
                        Montant
                      </Text>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: C.textPrimary,
                      }}>
                        {formatMontant(item.montant)}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{
                        fontSize: 10,
                        color: C.textMuted,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}>
                        {item.solde > 0 ? 'Solde restant' : 'Payé'}
                      </Text>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: item.solde > 0 ? C.amber : C.green,
                      }}>
                        {item.solde > 0 ? formatMontant(item.solde) : 'Complet'}
                      </Text>
                    </View>
                  </View>

                  {/* ─── Indicateur d'expansion ────────────────────────────── */}
                  <View style={{
                    alignItems: 'center',
                    marginTop: 8,
                  }}>
                    <Feather
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={C.textMuted}
                    />
                  </View>
                </TouchableOpacity>

                {/* ─── Contenu expansé ────────────────────────────────────────── */}
                <Animated.View
                  style={{
                    maxHeight: expandAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 500],
                    }),
                    opacity: expandAnim,
                    overflow: 'hidden',
                  }}
                >
                  <View style={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                    borderTopWidth: 1,
                    borderTopColor: C.border,
                    paddingTop: 14,
                  }}>
                    {/* Détails paiement */}
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}>
                      <Text style={{ fontSize: 12, color: C.textMuted }}>
                        Déjà payé
                      </Text>
                      <Text style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: C.green,
                      }}>
                        {formatMontant(item.montantPaye)}
                      </Text>
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                      paddingBottom: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: C.border,
                    }}>
                      <Text style={{ fontSize: 12, color: C.textMuted }}>
                        Date d'échéance
                      </Text>
                      <Text style={{
                        fontSize: 13,
                        fontWeight: '500',
                        color: C.textSecondary,
                      }}>
                        {item.dateEcheance}
                      </Text>
                    </View>

                    {/* Historique des paiements */}
                    {item.paiements && item.paiements.length > 0 && (
                      <View style={{ marginBottom: 14 }}>
                        <Text style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: C.textMuted,
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                          marginBottom: 8,
                        }}>
                          Historique des paiements
                        </Text>
                        {item.paiements.map((paiement) => (
                          <View key={paiement.id} style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: C.surfaceAlt,
                            borderRadius: 10,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            marginBottom: 4,
                          }}>
                            <Text style={{
                              fontSize: 11,
                              color: C.textMuted,
                            }}>
                              {paiement.date} · {paiement.mode}
                            </Text>
                            <Text style={{
                              fontSize: 12,
                              fontWeight: '600',
                              color: C.green,
                            }}>
                              +{formatMontant(paiement.montant)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Bouton payer */}
                    {isPayable && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handlePay(item)}
                        style={{
                          backgroundColor: C.accent,
                          borderRadius: 14,
                          paddingVertical: 14,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          shadowColor: C.accent,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 12,
                          elevation: 6,
                        }}
                      >
                        <Feather name="credit-card" size={18} color="#FFFFFF" />
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#FFFFFF',
                          marginLeft: 10,
                        }}>
                          Payer {formatMontant(item.solde)}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Animated.View>
              </View>
            </Animated.View>
          );
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <SectionTitle>
              {invoices.length} facture{invoices.length > 1 ? 's' : ''}
            </SectionTitle>
          </View>
        }
        ListEmptyComponent={
          <View style={{
            backgroundColor: C.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: C.border,
            padding: 40,
            alignItems: 'center',
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              backgroundColor: C.accentBg,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Feather name="credit-card" size={36} color={C.accentDim} />
            </View>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: C.textPrimary,
            }}>
              Aucune facture
            </Text>
            <Text style={{
              fontSize: 13,
              color: C.textMuted,
              textAlign: 'center',
              marginTop: 4,
            }}>
              Aucune facture n'est disponible
            </Text>
          </View>
        }
      />
    </View>
  );
};