// screens/professeur/TeacherAttendanceScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface Eleve {
  id: string;
  nom: string;
  prenoms: string;
  present: boolean;
  justifie?: boolean;
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_ELEVES: Eleve[] = [
  { id: '1', nom: 'MOUKOKO', prenoms: 'Jean Junior', present: true },
  { id: '2', nom: 'NGOMA', prenoms: 'Paul', present: true },
  { id: '3', nom: 'LOUBAT', prenoms: 'Marie', present: true },
  { id: '4', nom: 'WAMBA', prenoms: 'Christ', present: false, justifie: true },
  { id: '5', nom: 'MFOUMOU', prenoms: 'Alain', present: false, justifie: false },
  { id: '6', nom: 'KOUMA', prenoms: 'David', present: true },
  { id: '7', nom: 'MBOULA', prenoms: 'Sandrine', present: false, justifie: false },
];

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const TeacherAttendanceScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [eleves, setEleves] = useState(MOCK_ELEVES);
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const togglePresence = (id: string) => {
    setEleves(prev => prev.map(e => 
      e.id === id ? { ...e, present: !e.present, justifie: e.present ? false : e.justifie } : e
    ));
  };

  const toggleJustifie = (id: string) => {
    setEleves(prev => prev.map(e => 
      e.id === id ? { ...e, justifie: !e.justifie } : e
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('✅ Succès', "L'appel a été enregistré avec succès");
    }, 1000);
  };

  const stats = {
    presents: eleves.filter(e => e.present).length,
    absents: eleves.filter(e => !e.present).length,
    justifies: eleves.filter(e => !e.present && e.justifie).length,
    total: eleves.length,
    tauxPresence: Math.round((eleves.filter(e => e.present).length / eleves.length) * 100),
  };

  const filteredEleves = eleves.filter(e => {
    if (filter === 'present') return e.present;
    if (filter === 'absent') return !e.present;
    return true;
  });

  // ─── RENDU ───
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

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
                marginBottom: 8,
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
              Gestion des présences
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              Faire l'appel
            </Text>
            <Text style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 2,
            }}>
              Classe 3ème A • {stats.total} élèves
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
              fontSize: 22,
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              {stats.tauxPresence}%
            </Text>
            <Text style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
              Présence
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>

          {/* ─── STATISTIQUES ─── */}
          <View style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 20,
          }}>
            {[
              { label: 'Présents', value: stats.presents, icon: 'user-check', color: colors.success, bg: colors.success + '15' },
              { label: 'Absents', value: stats.absents, icon: 'user-x', color: colors.error, bg: colors.error + '15' },
              { label: 'Justifiés', value: stats.justifies, icon: 'file-text', color: colors.warning, bg: colors.warning + '15' },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                alignItems: 'center',
              }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: stat.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 6,
                }}>
                  <Feather name={stat.icon as any} size={16} color={stat.color} />
                </View>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: stat.color,
                  letterSpacing: -0.5,
                }}>
                  {stat.value}
                </Text>
                <Text style={{
                  fontSize: 9,
                  color: colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginTop: 2,
                }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* ─── FILTRES ─── */}
          <View style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: 16,
          }}>
            {[
              { key: 'all', label: 'Tous', count: stats.total },
              { key: 'present', label: 'Présents', count: stats.presents },
              { key: 'absent', label: 'Absents', count: stats.absents },
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
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: isActive ? colors.primary : colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isActive ? '#FFFFFF' : colors.textMuted,
                  }}>
                    {f.label}
                  </Text>
                  <View style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colors.border,
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                  }}>
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: isActive ? '#FFFFFF' : colors.textMuted,
                    }}>
                      {f.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ─── LISTE DES ÉLÈVES ─── */}
          {filteredEleves.map((eleve, index) => {
            const isPresent = eleve.present;
            const isJustifie = eleve.justifie;

            return (
              <View
                key={eleve.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isPresent ? `${colors.success}30` : isJustifie ? `${colors.warning}30` : `${colors.error}30`,
                  marginBottom: 10,
                  padding: 14,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  {/* Infos élève */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: isPresent ? colors.success + '15' : isJustifie ? colors.warning + '15' : colors.error + '15',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: isPresent ? colors.success : isJustifie ? colors.warning : colors.error,
                      }}>
                        {`${eleve.prenoms[0]}${eleve.nom[0]}`.toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: colors.text,
                        letterSpacing: -0.2,
                      }}>
                        {eleve.prenoms} {eleve.nom}
                      </Text>
                      {!isPresent && isJustifie && (
                        <Text style={{
                          fontSize: 10,
                          color: colors.warning,
                          fontWeight: '600',
                          marginTop: 1,
                        }}>
                          ✓ Absence justifiée
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {/* Bouton Présent/Absent */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => togglePresence(eleve.id)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor: isPresent ? colors.success : colors.error,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Feather 
                        name={isPresent ? 'check' : 'x'} 
                        size={14} 
                        color="#FFFFFF" 
                      />
                      <Text style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: '#FFFFFF',
                      }}>
                        {isPresent ? 'Présent' : 'Absent'}
                      </Text>
                    </TouchableOpacity>

                    {/* Bouton Justification (visible seulement si absent) */}
                    {!isPresent && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => toggleJustifie(eleve.id)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 12,
                          backgroundColor: isJustifie ? colors.warning : colors.border,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Feather 
                          name="file-text" 
                          size={16} 
                          color={isJustifie ? '#FFFFFF' : colors.textMuted} 
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Indicateur de statut */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 10,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}>
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isPresent ? colors.success : isJustifie ? colors.warning : colors.error,
                  }} />
                  <Text style={{
                    fontSize: 10,
                    color: colors.textMuted,
                  }}>
                    {isPresent ? "Présent aujourd'hui" : 
                     isJustifie ? 'Absence justifiée' : 
                     'Absence non justifiée'}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Message vide */}
          {filteredEleves.length === 0 && (
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 30,
              alignItems: 'center',
            }}>
              <Feather name="users" size={40} color={colors.textMuted} />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.textSecondary,
                marginTop: 10,
              }}>
                Aucun élève trouvé
              </Text>
              <Text style={{
                fontSize: 13,
                color: colors.textMuted,
                marginTop: 4,
              }}>
                Aucun élève ne correspond à ce filtre
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ─── BOUTON DE SAUVEGARDE FLOTTANT ─── */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 28,
        backgroundColor: 'transparent',
      }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isSaving}
          style={{
            backgroundColor: isSaving ? colors.textMuted : colors.primary,
            borderRadius: 16,
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          {isSaving ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
                borderTopColor: '#FFFFFF',
                transform: [{ rotate: '45deg' }],
              }} />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                Enregistrement...
              </Text>
            </View>
          ) : (
            <>
              <Feather name="save" size={20} color="#FFFFFF" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                Enregistrer l'appel
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Indicateur de progression */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginTop: 10,
        }}>
          <View style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: stats.tauxPresence >= 80 ? colors.success : stats.tauxPresence >= 50 ? colors.warning : colors.error,
          }} />
          <Text style={{
            fontSize: 11,
            color: colors.textMuted,
          }}>
            Taux de présence : {stats.tauxPresence}%
          </Text>
        </View>
      </View>
    </View>
  );
};