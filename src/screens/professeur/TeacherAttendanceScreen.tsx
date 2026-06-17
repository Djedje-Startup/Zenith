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
interface Eleve {
  id: string;
  nom: string;
  prenoms: string;
  present: boolean;
  justifie?: boolean;
}

// ─── Données Mock ────────────────────────────────────────────────────────────
const MOCK_ELEVES: Eleve[] = [
  { id: '1', nom: 'MOUKOKO', prenoms: 'Jean Junior', present: true },
  { id: '2', nom: 'NGOMA', prenoms: 'Paul', present: true },
  { id: '3', nom: 'LOUBAT', prenoms: 'Marie', present: true },
  { id: '4', nom: 'WAMBA', prenoms: 'Christ', present: false, justifie: true },
  { id: '5', nom: 'MFOUMOU', prenoms: 'Alain', present: false, justifie: false },
  { id: '6', nom: 'KOUMA', prenoms: 'David', present: true },
  { id: '7', nom: 'MBOULA', prenoms: 'Sandrine', present: false, justifie: false },
];

// ─── Composant principal ──────────────────────────────────────────────────────
export const TeacherAttendanceScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [eleves, setEleves] = useState(MOCK_ELEVES);
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
      Alert.alert('✅ Succès', 'L\'appel a été enregistré avec succès');
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

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ─── Header Premium ──────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#064E3B', '#065F46', '#0D9488']}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.5)',
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
            backgroundColor: 'rgba(255,255,255,0.12)',
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.teal} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>

          {/* ─── Statistiques ──────────────────────────────────────────────────── */}
          <View style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 20,
          }}>
            {[
              { label: 'Présents', value: stats.presents, icon: 'user-check', color: C.green, bg: C.greenBg },
              { label: 'Absents', value: stats.absents, icon: 'user-x', color: C.red, bg: C.redBg },
              { label: 'Justifiés', value: stats.justifies, icon: 'file-text', color: C.amber, bg: C.amberBg },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: C.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: C.border,
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
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginTop: 2,
                }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* ─── Filtres ────────────────────────────────────────────────────────── */}
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
                    backgroundColor: isActive ? C.teal : C.surface,
                    borderWidth: 1,
                    borderColor: isActive ? C.teal : C.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isActive ? '#FFFFFF' : C.textMuted,
                  }}>
                    {f.label}
                  </Text>
                  <View style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : C.border,
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                  }}>
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: isActive ? '#FFFFFF' : C.textMuted,
                    }}>
                      {f.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ─── Liste des élèves ────────────────────────────────────────────── */}
          {filteredEleves.map((eleve, index) => {
            const isPresent = eleve.present;
            const isJustifie = eleve.justifie;

            return (
              <View
                key={eleve.id}
                style={{
                  backgroundColor: C.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isPresent ? `${C.green}30` : isJustifie ? `${C.amber}30` : `${C.red}30`,
                  marginBottom: 10,
                  padding: 14,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Infos élève */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: isPresent ? C.greenBg : isJustifie ? C.amberBg : C.redBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: isPresent ? C.green : isJustifie ? C.amber : C.red,
                      }}>
                        {`${eleve.prenoms[0]}${eleve.nom[0]}`.toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: C.textPrimary,
                        letterSpacing: -0.2,
                      }}>
                        {eleve.prenoms} {eleve.nom}
                      </Text>
                      {!isPresent && isJustifie && (
                        <Text style={{
                          fontSize: 10,
                          color: C.amber,
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
                        backgroundColor: isPresent ? C.green : C.red,
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
                          backgroundColor: isJustifie ? C.amber : C.border,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Feather 
                          name="file-text" 
                          size={16} 
                          color={isJustifie ? '#FFFFFF' : C.textMuted} 
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
                  borderTopColor: C.border,
                }}>
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isPresent ? C.green : isJustifie ? C.amber : C.red,
                  }} />
                  <Text style={{
                    fontSize: 10,
                    color: C.textMuted,
                  }}>
                    {isPresent ? 'Présent aujourd\'hui' : 
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
              backgroundColor: C.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: C.border,
              padding: 30,
              alignItems: 'center',
            }}>
              <Feather name="users" size={40} color={C.textMuted} />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: C.textSecondary,
                marginTop: 10,
              }}>
                Aucun élève trouvé
              </Text>
              <Text style={{
                fontSize: 13,
                color: C.textMuted,
                marginTop: 4,
              }}>
                Aucun élève ne correspond à ce filtre
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ─── Bouton de sauvegarde flottant ────────────────────────────────────── */}
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
            backgroundColor: isSaving ? C.textMuted : C.teal,
            borderRadius: 16,
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            shadowColor: C.teal,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
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
            backgroundColor: stats.tauxPresence >= 80 ? C.green : stats.tauxPresence >= 50 ? C.amber : C.red,
          }} />
          <Text style={{
            fontSize: 11,
            color: C.textMuted,
          }}>
            Taux de présence : {stats.tauxPresence}%
          </Text>
        </View>
      </View>
    </View>
  );
};