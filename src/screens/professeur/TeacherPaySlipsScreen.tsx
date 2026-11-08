// screens/professeur/TeacherPaySlipsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Modal,
  Alert,
  Share,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface PaySlip {
  id: string;
  mois: string;
  annee: number;
  montant: number;
  statut: 'PAYE' | 'EN_ATTENTE' | 'EN_RETARD';
  dateEmission: string;
  details?: {
    salaireBase: number;
    primes: { label: string; montant: number }[];
    retenues: { label: string; montant: number }[];
    netAPayer: number;
  };
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_PAYSLIPS: PaySlip[] = [
  {
    id: '1',
    mois: 'Janvier',
    annee: 2025,
    montant: 450000,
    statut: 'PAYE',
    dateEmission: '2025-01-25',
    details: {
      salaireBase: 350000,
      primes: [
        { label: 'Prime de rendement', montant: 50000 },
        { label: 'Prime d\'ancienneté', montant: 30000 },
        { label: 'Indemnité de transport', montant: 20000 },
      ],
      retenues: [
        { label: 'Impôt sur le revenu', montant: 45000 },
        { label: 'Cotisation sociale', montant: 35000 },
        { label: 'Assurance', montant: 20000 },
      ],
      netAPayer: 450000,
    },
  },
  {
    id: '2',
    mois: 'Février',
    annee: 2025,
    montant: 450000,
    statut: 'PAYE',
    dateEmission: '2025-02-25',
    details: {
      salaireBase: 350000,
      primes: [
        { label: 'Prime de rendement', montant: 50000 },
        { label: 'Prime d\'ancienneté', montant: 30000 },
        { label: 'Indemnité de transport', montant: 20000 },
      ],
      retenues: [
        { label: 'Impôt sur le revenu', montant: 45000 },
        { label: 'Cotisation sociale', montant: 35000 },
        { label: 'Assurance', montant: 20000 },
      ],
      netAPayer: 450000,
    },
  },
  {
    id: '3',
    mois: 'Mars',
    annee: 2025,
    montant: 450000,
    statut: 'EN_ATTENTE',
    dateEmission: '2025-03-25',
    details: {
      salaireBase: 350000,
      primes: [
        { label: 'Prime de rendement', montant: 50000 },
        { label: 'Prime d\'ancienneté', montant: 30000 },
        { label: 'Indemnité de transport', montant: 20000 },
      ],
      retenues: [
        { label: 'Impôt sur le revenu', montant: 45000 },
        { label: 'Cotisation sociale', montant: 35000 },
        { label: 'Assurance', montant: 20000 },
      ],
      netAPayer: 450000,
    },
  },
  {
    id: '4',
    mois: 'Avril',
    annee: 2025,
    montant: 450000,
    statut: 'EN_RETARD',
    dateEmission: '2025-04-25',
    details: {
      salaireBase: 350000,
      primes: [
        { label: 'Prime de rendement', montant: 50000 },
        { label: 'Prime d\'ancienneté', montant: 30000 },
        { label: 'Indemnité de transport', montant: 20000 },
      ],
      retenues: [
        { label: 'Impôt sur le revenu', montant: 45000 },
        { label: 'Cotisation sociale', montant: 35000 },
        { label: 'Assurance', montant: 20000 },
      ],
      netAPayer: 450000,
    },
  },
];

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const TeacherPaySlipsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [paySlips, setPaySlips] = useState(MOCK_PAYSLIPS);
  const [selectedPaySlip, setSelectedPaySlip] = useState<PaySlip | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<'TOUS' | 'PAYE' | 'EN_ATTENTE' | 'EN_RETARD'>('TOUS');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const formatMontant = (montant: number) => {
    return `${montant.toLocaleString()} FCFA`;
  };

  const getStatutConfig = (statut: string) => {
    const configs: Record<string, { label: string; color: string; bg: string; icon: keyof typeof Feather.glyphMap }> = {
      PAYE: { label: 'Payé', color: colors.success, bg: colors.success + '15', icon: 'check-circle' },
      EN_ATTENTE: { label: 'En attente', color: colors.warning, bg: colors.warning + '15', icon: 'clock' },
      EN_RETARD: { label: 'En retard', color: colors.error, bg: colors.error + '15', icon: 'alert-triangle' },
    };
    return configs[statut] || configs.PAYE;
  };

  const handlePaySlipPress = (paySlip: PaySlip) => {
    setSelectedPaySlip(paySlip);
    setModalVisible(true);
  };

  const handleDownload = () => {
    Alert.alert(
      'Téléchargement',
      'Téléchargement du bulletin de paie en cours...',
      [{ text: 'OK' }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Bulletin de paie ${selectedPaySlip?.mois} ${selectedPaySlip?.annee}\nMontant: ${formatMontant(selectedPaySlip?.montant || 0)}`,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le bulletin');
    }
  };

  const filteredPaySlips = paySlips.filter(p => {
    if (filter === 'TOUS') return true;
    return p.statut === filter;
  });

  const stats = {
    total: paySlips.length,
    paye: paySlips.filter(p => p.statut === 'PAYE').length,
    enAttente: paySlips.filter(p => p.statut === 'EN_ATTENTE').length,
    enRetard: paySlips.filter(p => p.statut === 'EN_RETARD').length,
    totalMontant: paySlips.reduce((sum, p) => sum + p.montant, 0),
  };

  // ─── Composant SectionTitle ───
  const SectionTitle = ({ children }: { children: string }) => (
    <Text style={{
      fontSize: 11,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 12,
    }}>
      {children}
    </Text>
  );

  // ─── RENDU ───
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ─── HEADER AVEC DÉGRADÉ ZENITH ─── */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 56,
            paddingBottom: 28,
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
              {/* Bouton retour */}
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={goBack}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <Feather name="arrow-left" size={18} color="rgba(255,255,255,0.6)" />
                <Text style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: '500',
                }}>
                  Retour
                </Text>
              </TouchableOpacity>
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                Finances
              </Text>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}>
                Bulletins de paie
              </Text>
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
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
            gap: 8,
            marginTop: 16,
          }}>
            {[
              { label: 'Payés', value: stats.paye, color: colors.success },
              { label: 'En attente', value: stats.enAttente, color: colors.warning },
              { label: 'En retard', value: stats.enRetard, color: colors.error },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: stat.color + '30',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}>
                    {stat.value}
                  </Text>
                </View>
                <View>
                  <Text style={{
                    fontSize: 8,
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
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 18,
          paddingVertical: 16,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          {[
            { key: 'TOUS', label: 'Tous', count: stats.total },
            { key: 'PAYE', label: 'Payés', count: stats.paye },
            { key: 'EN_ATTENTE', label: 'En attente', count: stats.enAttente },
            { key: 'EN_RETARD', label: 'En retard', count: stats.enRetard },
          ].map((f) => {
            const isActive = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                activeOpacity={0.7}
                onPress={() => setFilter(f.key as any)}
                style={{
                  flex: 1,
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  borderRadius: 10,
                  backgroundColor: isActive ? colors.primary : colors.surfaceElevated,
                  borderWidth: 1,
                  borderColor: isActive ? colors.primary : colors.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 11,
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#FFFFFF' : colors.textSecondary,
                }}>
                  {f.label}
                </Text>
                <Text style={{
                  fontSize: 9,
                  fontWeight: '500',
                  color: isActive ? 'rgba(255,255,255,0.6)' : colors.textMuted,
                }}>
                  {f.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ─── LISTE DES BULLETINS ─── */}
        <View style={{ paddingHorizontal: 18, paddingTop: 16 }}>
          <SectionTitle>
            {filteredPaySlips.length} bulletin{filteredPaySlips.length > 1 ? 's' : ''}
          </SectionTitle>

          {filteredPaySlips.map((paySlip) => {
            const statutConfig = getStatutConfig(paySlip.statut);

            return (
              <TouchableOpacity
                key={paySlip.id}
                activeOpacity={0.7}
                onPress={() => handlePaySlipPress(paySlip)}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                  <View>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: colors.text,
                    }}>
                      {paySlip.mois} {paySlip.annee}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      marginTop: 2,
                    }}>
                      Émis le {paySlip.dateEmission}
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: statutConfig.bg,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <Feather name={statutConfig.icon} size={12} color={statutConfig.color} />
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: statutConfig.color,
                    }}>
                      {statutConfig.label}
                    </Text>
                  </View>
                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textMuted,
                  }}>
                    Montant net
                  </Text>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '800',
                    color: paySlip.statut === 'PAYE' ? colors.success : colors.warning,
                  }}>
                    {formatMontant(paySlip.montant)}
                  </Text>
                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 8,
                }}>
                  <Feather name="chevron-right" size={18} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            );
          })}

          {/* État vide */}
          {filteredPaySlips.length === 0 && (
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
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
                <Feather name="file-text" size={36} color={colors.primary} />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
              }}>
                Aucun bulletin
              </Text>
              <Text style={{
                fontSize: 13,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Aucun bulletin de paie ne correspond à ce filtre
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ─── MODAL DÉTAIL DU BULLETIN ─── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingBottom: 30,
            maxHeight: '85%',
          }}>
            {/* Indicateur de fermeture */}
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: colors.border,
              borderRadius: 2,
              alignSelf: 'center',
              marginTop: 10,
              marginBottom: 20,
            }} />

            {selectedPaySlip && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* En-tête du modal */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                  <Text style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color: colors.text,
                  }}>
                    {selectedPaySlip.mois} {selectedPaySlip.annee}
                  </Text>
                  <View style={{
                    backgroundColor: getStatutConfig(selectedPaySlip.statut).bg,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <Feather 
                      name={getStatutConfig(selectedPaySlip.statut).icon} 
                      size={14} 
                      color={getStatutConfig(selectedPaySlip.statut).color} 
                    />
                    <Text style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: getStatutConfig(selectedPaySlip.statut).color,
                    }}>
                      {getStatutConfig(selectedPaySlip.statut).label}
                    </Text>
                  </View>
                </View>

                {selectedPaySlip.details ? (
                  <>
                    {/* Salaire de base */}
                    <View style={{
                      backgroundColor: colors.surfaceElevated,
                      borderRadius: 14,
                      padding: 16,
                      marginBottom: 12,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                        }}>
                          Salaire de base
                        </Text>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: colors.text,
                        }}>
                          {formatMontant(selectedPaySlip.details.salaireBase)}
                        </Text>
                      </View>
                    </View>

                    {/* Primes */}
                    {selectedPaySlip.details.primes.length > 0 && (
                      <View style={{
                        backgroundColor: colors.success + '10',
                        borderRadius: 14,
                        padding: 16,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: colors.success + '20',
                      }}>
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: colors.success,
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                          marginBottom: 10,
                        }}>
                          Primes
                        </Text>
                        {selectedPaySlip.details.primes.map((prime, index) => (
                          <View key={index} style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: index < selectedPaySlip.details!.primes.length - 1 ? 6 : 0,
                          }}>
                            <Text style={{
                              fontSize: 13,
                              color: colors.textSecondary,
                            }}>
                              {prime.label}
                            </Text>
                            <Text style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: colors.success,
                            }}>
                              +{formatMontant(prime.montant)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Retenues */}
                    {selectedPaySlip.details.retenues.length > 0 && (
                      <View style={{
                        backgroundColor: colors.error + '10',
                        borderRadius: 14,
                        padding: 16,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: colors.error + '20',
                      }}>
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: colors.error,
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                          marginBottom: 10,
                        }}>
                          Retenues
                        </Text>
                        {selectedPaySlip.details.retenues.map((retenue, index) => (
                          <View key={index} style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: index < selectedPaySlip.details!.retenues.length - 1 ? 6 : 0,
                          }}>
                            <Text style={{
                              fontSize: 13,
                              color: colors.textSecondary,
                            }}>
                              {retenue.label}
                            </Text>
                            <Text style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: colors.error,
                            }}>
                              -{formatMontant(retenue.montant)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Total net */}
                    <View style={{
                      backgroundColor: colors.primaryBg,
                      borderRadius: 14,
                      padding: 16,
                      marginBottom: 16,
                      borderWidth: 1,
                      borderColor: colors.primary + '20',
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: colors.primary,
                        }}>
                          Net à payer
                        </Text>
                        <Text style={{
                          fontSize: 24,
                          fontWeight: '800',
                          color: colors.primary,
                        }}>
                          {formatMontant(selectedPaySlip.details.netAPayer)}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={{
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 14,
                    padding: 20,
                    alignItems: 'center',
                    marginBottom: 16,
                  }}>
                    <Feather name="file-text" size={40} color={colors.textMuted} />
                    <Text style={{
                      fontSize: 14,
                      color: colors.textMuted,
                      marginTop: 8,
                      textAlign: 'center',
                    }}>
                      Détails non disponibles
                    </Text>
                  </View>
                )}

                {/* Actions */}
                <View style={{
                  flexDirection: 'row',
                  gap: 10,
                }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleShare}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: colors.border,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Feather name="share-2" size={18} color={colors.textSecondary} />
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.textSecondary,
                    }}>
                      Partager
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleDownload}
                    style={{
                      flex: 2,
                      paddingVertical: 14,
                      borderRadius: 14,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Feather name="download" size={18} color="#FFFFFF" />
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#FFFFFF',
                    }}>
                      Télécharger
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Fermer */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 12,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.textMuted,
                  }}>
                    Fermer
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};