// src/screens/eleve/StudentPaymentHistoryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface Payment {
  id: string;
  reference: string;
  libelle: string;
  montant: number;
  date: string;
  mode: string;
  statut: 'VALIDE' | 'EN_ATTENTE' | 'ECHOUE' | 'ANNULE';
  facture?: string;
  description?: string;
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    reference: 'PAY-2025-001',
    libelle: 'Frais de scolarité 1er trimestre',
    montant: 150000,
    date: '10 sept. 2025',
    mode: 'Mobile Money',
    statut: 'VALIDE',
    facture: 'FACT-2025-001',
    description: 'Paiement effectué via Orange Money',
  },
  {
    id: '2',
    reference: 'PAY-2025-002',
    libelle: 'Frais de scolarité 2ème trimestre',
    montant: 150000,
    date: '05 déc. 2025',
    mode: 'Carte bancaire',
    statut: 'VALIDE',
    facture: 'FACT-2025-002',
    description: 'Paiement par carte Visa',
  },
  {
    id: '3',
    reference: 'PAY-2025-003',
    libelle: 'Frais de cantine',
    montant: 75000,
    date: '15 nov. 2025',
    mode: 'Espèces',
    statut: 'EN_ATTENTE',
    facture: 'FACT-2025-003',
    description: 'En attente de validation',
  },
  {
    id: '4',
    reference: 'PAY-2025-004',
    libelle: "Frais d'examen",
    montant: 50000,
    date: '20 août 2025',
    mode: 'Mobile Money',
    statut: 'ECHOUE',
    facture: 'FACT-2025-004',
    description: 'Transaction annulée - Solde insuffisant',
  },
  {
    id: '5',
    reference: 'PAY-2025-005',
    libelle: 'Cotisation club sportif',
    montant: 25000,
    date: '08 oct. 2025',
    mode: 'Carte bancaire',
    statut: 'VALIDE',
    facture: 'FACT-2025-005',
    description: 'Paiement effectué avec succès',
  },
];

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const StudentPaymentHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [payments] = useState(MOCK_PAYMENTS);
  const [filter, setFilter] = useState<'TOUS' | 'VALIDE' | 'EN_ATTENTE' | 'ECHOUE'>('TOUS');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // ─── Configuration du statut ───
  const getStatutConfig = (statut: string) => {
    const configs: Record<string, { label: string; color: string; bg: string; icon: keyof typeof Feather.glyphMap }> = {
      VALIDE: { label: 'Validé', color: colors.success, bg: colors.success + '15', icon: 'check-circle' },
      EN_ATTENTE: { label: 'En attente', color: colors.warning, bg: colors.warning + '15', icon: 'clock' },
      ECHOUE: { label: 'Échoué', color: colors.error, bg: colors.error + '15', icon: 'x-circle' },
      ANNULE: { label: 'Annulé', color: colors.textMuted, bg: colors.surfaceElevated, icon: 'slash' },
    };
    return configs[statut] || { label: 'Inconnu', color: colors.textMuted, bg: colors.surfaceElevated, icon: 'help-circle' };
  };

  const formatMontant = (montant: number) => {
    return `${montant.toLocaleString()} FCFA`;
  };

  const filteredPayments = filter === 'TOUS' 
    ? payments 
    : payments.filter(p => p.statut === filter);

  const stats = {
    total: payments.length,
    valide: payments.filter(p => p.statut === 'VALIDE').length,
    enAttente: payments.filter(p => p.statut === 'EN_ATTENTE').length,
    echoue: payments.filter(p => p.statut === 'ECHOUE').length,
    totalMontant: payments.filter(p => p.statut === 'VALIDE').reduce((sum, p) => sum + p.montant, 0),
  };

  // ─── Composant SectionTitle ───
  const SectionTitle = ({ children, count }: { children: string; count?: number }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    }}>
      <Text style={{
        fontSize: 11,
        fontWeight: '700',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
      }}>
        {children}
      </Text>
      {count !== undefined && (
        <Text style={{
          fontSize: 11,
          color: colors.textMuted,
        }}>
          {count} paiement{count > 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );

  // ─── Rendu d'une carte de paiement (CARTE CLAIRE) ───
  const renderPaymentCard = ({ item }: { item: Payment }) => {
    const statutConfig = getStatutConfig(item.statut);
    const isSuccess = item.statut === 'VALIDE';

    return (
      <View style={{ marginBottom: 12 }}>
        {/* ✅ CARTE CLAIRE - remplacement du composant Card */}
        <View style={{
          backgroundColor: colors.surface, // ✅ BLANC (#FFFFFF)
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border, // ✅ BORDURE CLAIRE
          padding: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Bandeau de statut */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: statutConfig.color,
          }} />

          <View style={{ marginTop: 6 }}>
            {/* En-tête */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.text, // ✅ TEXTE NOIR
                  letterSpacing: -0.2,
                }}>
                  {item.libelle}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  marginTop: 2,
                }}>
                  Réf: {item.reference}
                </Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: statutConfig.bg,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: statutConfig.color + '30',
              }}>
                <Feather name={statutConfig.icon} size={12} color={statutConfig.color} />
                <Text style={{
                  fontSize: 10,
                  fontWeight: '700',
                  color: statutConfig.color,
                  marginLeft: 4,
                }}>
                  {statutConfig.label}
                </Text>
              </View>
            </View>

            {/* Montant */}
            <Text style={{
              fontSize: 24,
              fontWeight: '800',
              color: isSuccess ? colors.success : colors.text,
              marginTop: 8,
              letterSpacing: -0.5,
            }}>
              {formatMontant(item.montant)}
            </Text>

            {/* Détails */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="calendar" size={14} color={colors.textMuted} />
                <Text style={{ fontSize: 12, color: colors.textMuted }}>{item.date}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="credit-card" size={14} color={colors.textMuted} />
                <Text style={{ fontSize: 12, color: colors.textMuted }}>{item.mode}</Text>
              </View>
            </View>

            {/* Description */}
            {item.description && (
              <Text style={{
                fontSize: 12,
                color: colors.textMuted,
                marginTop: 8,
                fontStyle: 'italic',
              }}>
                {item.description}
              </Text>
            )}

            {/* Facture */}
            {item.facture && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 8,
                  paddingTop: 8,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="file-text" size={14} color={colors.textMuted} />
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>
                    Facture {item.facture}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  // ─── RENDU ───
  return (
    <Layout variant="default">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

        {/* ─── HEADER AVEC DÉGRADÉ ZENITH ─── */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
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
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View>
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                Élève
              </Text>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}>
                Historique des paiements
              </Text>
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
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
                Total payé
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {formatMontant(stats.totalMontant)}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={{
            flexDirection: 'row',
            marginTop: 16,
          }}>
            {[
              { label: 'Validés', value: stats.valide, color: colors.success },
              { label: 'En attente', value: stats.enAttente, color: colors.warning },
              { label: 'Échoués', value: stats.echoue, color: colors.error },
            ].map((stat, index) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: index < 2 ? 10 : 0,
              }}>
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: stat.color + '30',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>
                    {stat.value}
                  </Text>
                </View>
                <View>
                  <Text style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {stat.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ─── FILTRES ─── */}
        <View style={{
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { key: 'TOUS', label: 'Tous', count: stats.total },
              { key: 'VALIDE', label: 'Validés', count: stats.valide },
              { key: 'EN_ATTENTE', label: 'En attente', count: stats.enAttente },
              { key: 'ECHOUE', label: 'Échoués', count: stats.echoue },
            ].map((f) => {
              const isActive = filter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.7}
                  onPress={() => setFilter(f.key as any)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: isActive ? colors.primary : colors.surfaceElevated,
                    borderWidth: 1,
                    borderColor: isActive ? colors.primary : colors.border,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? '#FFFFFF' : colors.textSecondary,
                  }}>
                    {f.label}
                  </Text>
                  <Text style={{
                    fontSize: 9,
                    fontWeight: '500',
                    marginTop: 1,
                    color: isActive ? 'rgba(255,255,255,0.6)' : colors.textMuted,
                  }}>
                    {f.count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── LISTE DES PAIEMENTS ─── */}
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
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={renderPaymentCard}
          ListHeaderComponent={
            <SectionTitle count={filteredPayments.length}>
              Historique
            </SectionTitle>
          }
          ListEmptyComponent={
            <View style={{
              padding: 40,
              alignItems: 'center',
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: colors.primaryBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Feather name="credit-card" size={36} color={colors.primary} />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
              }}>
                Aucun paiement
              </Text>
              <Text style={{
                fontSize: 13,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Aucun historique de paiement n'est disponible
              </Text>
            </View>
          }
          ListFooterComponent={
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 8,
              paddingVertical: 12,
            }}>
              <Feather name="info" size={12} color={colors.textMuted} />
              <Text style={{ fontSize: 10, color: colors.textMuted }}>
                {filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''} affiché{filteredPayments.length > 1 ? 's' : ''}
              </Text>
            </View>
          }
        />
      </View>
    </Layout>
  );
};