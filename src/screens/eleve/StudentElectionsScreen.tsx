// src/screens/eleve/StudentElectionsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { useTheme } from '../../theme'; // ✅ Thème centralisé

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface Candidate {
  id: string;
  nom: string;
  prenoms: string;
  role: string;
  programme: string;
  votes: number;
  photo?: string;
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_CANDIDATES: Candidate[] = [
  { id: '1', nom: 'MOUKOKO', prenoms: 'Jean', role: 'Président', programme: 'Modernisation du BDE', votes: 45 },
  { id: '2', nom: 'LOUBAT', prenoms: 'Marie', role: 'Vice-présidente', programme: "Plus d'activités", votes: 32 },
  { id: '3', nom: 'WAMBA', prenoms: 'Christ', role: 'Trésorier', programme: 'Transparence financière', votes: 28 },
];

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const StudentElectionsScreen: React.FC = () => {
  const { colors } = useTheme(); // ✅ Thème centralisé
  const [refreshing, setRefreshing] = useState(false);
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [voted, setVoted] = useState(false);
  const [isCandidate, setIsCandidate] = useState(false);

  // ─── État pour le formulaire de candidature ───
  const [showCandidatureModal, setShowCandidatureModal] = useState(false);
  const [candidatureData, setCandidatureData] = useState({
    role: '',
    programme: '',
    motivations: '',
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleVote = (candidate: Candidate) => {
    if (voted) {
      Alert.alert('Déjà voté', 'Vous avez déjà voté pour cette élection');
      return;
    }
    Alert.alert(
      'Confirmation',
      `Voulez-vous voter pour ${candidate.prenoms} ${candidate.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            setVoted(true);
            Alert.alert('Vote enregistré', 'Votre vote a été pris en compte');
          }
        },
      ]
    );
  };

  // ─── Gestion de la candidature ───
  const handleSubmitCandidature = () => {
    if (!candidatureData.role.trim()) {
      Alert.alert('Champ requis', 'Veuillez indiquer le poste visé');
      return;
    }
    if (!candidatureData.programme.trim()) {
      Alert.alert('Champ requis', 'Veuillez décrire votre programme');
      return;
    }

    Alert.alert(
      'Confirmation de candidature',
      `Vous allez vous présenter pour le poste de ${candidatureData.role}. Confirmez-vous ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            // Simulation d'envoi de candidature
            const newCandidate: Candidate = {
              id: Date.now().toString(),
              nom: 'MOI',
              prenoms: 'Étudiant',
              role: candidatureData.role,
              programme: candidatureData.programme,
              votes: 0,
            };
            
            setCandidates([...candidates, newCandidate]);
            setIsCandidate(true);
            setShowCandidatureModal(false);
            setCandidatureData({ role: '', programme: '', motivations: '' });
            
            Alert.alert(
              'Candidature enregistrée',
              'Votre candidature a été soumise avec succès. Un administrateur validera votre dossier.'
            );
          }
        },
      ]
    );
  };

  const handleCancelCandidature = () => {
    Alert.alert(
      'Annuler la candidature',
      'Voulez-vous vraiment annuler votre candidature ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => {
            setCandidates(candidates.filter(c => c.id !== 'moi'));
            setIsCandidate(false);
            Alert.alert('Candidature annulée');
          }
        },
      ]
    );
  };

  // ─── Calcul des statistiques ───
  const totalVotes = candidates.reduce((acc, c) => acc + c.votes, 0);
  const getVotePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
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
                🗳️ Élève
              </Text>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}>
                Élections & BDE
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
                Candidats
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {candidates.length}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={{
            flexDirection: 'row',
            marginTop: 16,
          }}>
            {[
              { label: 'Votants', value: totalVotes.toString(), icon: 'users' },
              { label: 'Participation', value: `${Math.round((totalVotes / (totalVotes + 10)) * 100)}%`, icon: 'trending-up' },
            ].map((stat, index) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: index === 0 ? 10 : 0,
              }}>
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                  <Feather name={stat.icon as any} size={14} color="rgba(255,255,255,0.8)" />
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
                  <Text style={{
                    fontSize: 14,
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

        {/* ─── LISTE DES CANDIDATS ─── */}
        <FlatList
          data={candidates}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const percentage = getVotePercentage(item.votes);
            const isMyCandidature = item.id === 'moi';

            return (
              <View style={{ marginBottom: 12 }}>
                <Card variant="default" padding="md">
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {/* Avatar */}
                    <Avatar
                      name={`${item.prenoms} ${item.nom}`}
                      size="lg"
                      variant="circle"
                      gradient
                    />

                    {/* Infos candidat */}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: colors.text,
                        }}>
                          {item.prenoms} {item.nom}
                        </Text>
                        {isMyCandidature && (
                          <View style={{
                            backgroundColor: colors.primaryBg,
                            borderRadius: 6,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderWidth: 1,
                            borderColor: colors.primary + '30',
                          }}>
                            <Text style={{
                              fontSize: 8,
                              fontWeight: '700',
                              color: colors.primary,
                              textTransform: 'uppercase',
                              letterSpacing: 0.3,
                            }}>
                              Moi
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={{
                        fontSize: 13,
                        color: colors.primary,
                        fontWeight: '600',
                      }}>
                        {item.role}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: colors.textMuted,
                        marginTop: 2,
                      }}>
                        {item.programme}
                      </Text>
                    </View>

                    {/* Votes */}
                    <View style={{
                      alignItems: 'center',
                    }}>
                      <View style={{
                        backgroundColor: colors.primaryBg,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderWidth: 1,
                        borderColor: `${colors.primary}25`,
                      }}>
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: colors.primary,
                        }}>
                          {item.votes}
                        </Text>
                      </View>
                      <Text style={{
                        fontSize: 9,
                        color: colors.textMuted,
                        marginTop: 2,
                      }}>
                        {percentage}%
                      </Text>
                    </View>
                  </View>

                  {/* Barre de progression des votes */}
                  <View style={{
                    marginTop: 10,
                    height: 4,
                    backgroundColor: colors.border,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <View style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: isMyCandidature ? colors.secondary : colors.primary,
                      borderRadius: 2,
                    }} />
                  </View>

                  {/* Actions */}
                  {isMyCandidature ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleCancelCandidature}
                      style={{
                        marginTop: 12,
                        paddingVertical: 10,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.error,
                        backgroundColor: `${colors.error}15`,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: colors.error,
                      }}>
                        Annuler ma candidature
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    !voted && (
                      <View style={{ marginTop: 12 }}>
                        <Button
                          title="Voter"
                          onPress={() => handleVote(item)}
                          variant="primary"
                          size="sm"
                          fullWidth
                        />
                      </View>
                    )
                  )}
                </Card>
              </View>
            );
          }}
          ListHeaderComponent={
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 14,
                color: colors.textSecondary,
                lineHeight: 22,
              }}>
                Votez pour vos représentants au Bureau des Élèves (BDE)
              </Text>

              {/* ✅ ALERTE DÉJÀ VOTÉ */}
              {voted && (
                <View style={{
                  backgroundColor: `${colors.success}15`,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: `${colors.success}30`,
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Feather name="check-circle" size={18} color={colors.success} />
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: colors.success,
                  }}>
                    Vous avez déjà voté pour cette élection
                  </Text>
                </View>
              )}

              {/* ✅ BOUTON SE PRÉSENTER */}
              {!isCandidate ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowCandidatureModal(true)}
                  style={{
                    marginTop: 12,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: colors.secondary,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    shadowColor: colors.secondary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 4,
                  }}
                >
                  <Feather name="user-plus" size={18} color="#FFFFFF" />
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}>
                    Se présenter aux élections
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: `${colors.success}15`,
                  borderWidth: 1,
                  borderColor: `${colors.success}30`,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <Feather name="check-circle" size={18} color={colors.success} />
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: colors.success,
                    flex: 1,
                  }}>
                    Vous êtes candidat ! Votre dossier est en attente de validation.
                  </Text>
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
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
                <Feather name="users" size={36} color={colors.primary} />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
              }}>
                Aucun candidat
              </Text>
              <Text style={{
                fontSize: 13,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Aucun candidat n'est disponible pour cette élection
              </Text>
            </View>
          }
        />
      </View>

      {/* ─── MODAL DE CANDIDATURE ─── */}
      <Modal
        visible={showCandidatureModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCandidatureModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 24,
            width: '100%',
            maxHeight: '85%',
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            {/* En-tête */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: colors.text,
              }}>
                Candidature
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowCandidatureModal(false)}
              >
                <Feather name="x" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Poste visé */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 6,
                }}>
                  Poste visé *
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 15,
                    color: colors.text,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                  placeholder="Ex: Président, Vice-président..."
                  placeholderTextColor={colors.textMuted}
                  value={candidatureData.role}
                  onChangeText={(text) => setCandidatureData({ ...candidatureData, role: text })}
                />
              </View>

              {/* Programme */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 6,
                }}>
                  Programme / Projet *
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 15,
                    color: colors.text,
                    borderWidth: 1,
                    borderColor: colors.border,
                    minHeight: 80,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Décrivez votre programme et vos engagements..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  value={candidatureData.programme}
                  onChangeText={(text) => setCandidatureData({ ...candidatureData, programme: text })}
                />
              </View>

              {/* Motivations */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 6,
                }}>
                  Motivations
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 15,
                    color: colors.text,
                    borderWidth: 1,
                    borderColor: colors.border,
                    minHeight: 60,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Pourquoi voulez-vous vous présenter ?"
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                  value={candidatureData.motivations}
                  onChangeText={(text) => setCandidatureData({ ...candidatureData, motivations: text })}
                />
              </View>

              {/* Boutons */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowCandidatureModal(false)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: colors.textMuted,
                  }}>
                    Annuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSubmitCandidature}
                  style={{
                    flex: 2,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 4,
                  }}
                >
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}>
                    Soumettre ma candidature
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};