// screens/professeur/TeacherGradeEntryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
  note?: number;
}

interface Examen {
  id: string;
  nom: string;
  coefficient: number;
  date: string;
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_ELEVES: Eleve[] = [
  { id: '1', nom: 'MOUKOKO', prenoms: 'Jean Junior', note: 15 },
  { id: '2', nom: 'NGOMA', prenoms: 'Paul', note: 14 },
  { id: '3', nom: 'LOUBAT', prenoms: 'Marie', note: 17 },
  { id: '4', nom: 'WAMBA', prenoms: 'Christ', note: 13 },
  { id: '5', nom: 'MFOUMOU', prenoms: 'Alain', note: 11 },
];

const MOCK_EXAMENS: Examen[] = [
  { id: '1', nom: 'Devoir 1', coefficient: 1, date: '2025-10-20' },
  { id: '2', nom: 'Devoir 2', coefficient: 1, date: '2025-11-15' },
  { id: '3', nom: 'Examen Trimestriel', coefficient: 2, date: '2025-12-05' },
];

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const TeacherGradeEntryScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [eleves, setEleves] = useState(MOCK_ELEVES);
  const [selectedExamen, setSelectedExamen] = useState(MOCK_EXAMENS[0].id);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // Informations de la classe (simulées)
  const classeInfo = {
    nom: '3ème A',
    matiere: 'Mathématiques',
    professeur: 'M. NGOMA',
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const updateNote = (id: string, note: string) => {
    const numNote = parseFloat(note);
    if (isNaN(numNote)) return;
    setEleves(prev => prev.map(e => 
      e.id === id ? { ...e, note: Math.min(20, Math.max(0, numNote)) } : e
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('✅ Succès', 'Les notes ont été enregistrées avec succès');
    }, 1000);
  };

  const getNoteColor = (note?: number) => {
    if (!note && note !== 0) return colors.textMuted;
    if (note >= 16) return colors.success;
    if (note >= 12) return colors.warning;
    return colors.error;
  };

  const getNoteBg = (note?: number) => {
    if (!note && note !== 0) return 'transparent';
    if (note >= 16) return colors.success + '15';
    if (note >= 12) return colors.warning + '15';
    return colors.error + '15';
  };

  // Calcul des statistiques
  const notes = eleves.map(e => e.note).filter(n => n !== undefined) as number[];
  const moyenne = notes.length > 0 ? (notes.reduce((a, b) => a + b, 0) / notes.length) : 0;
  const maxNote = notes.length > 0 ? Math.max(...notes) : 0;
  const minNote = notes.length > 0 ? Math.min(...notes) : 0;

  const selectedExam = MOCK_EXAMENS.find(e => e.id === selectedExamen);

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
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
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
              Saisie des notes
            </Text>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.3,
            }}>
              {classeInfo.nom}
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 2,
            }}>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}>
                <Text style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: '600',
                }}>
                  {classeInfo.matiere}
                </Text>
              </View>
              <Text style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.5)',
              }}>
                • {classeInfo.professeur}
              </Text>
            </View>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}>
              <Feather name="users" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.8)',
                fontWeight: '600',
              }}>
                {eleves.length} élèves
              </Text>
            </View>
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

          {/* ─── SÉLECTEUR D'EXAMEN ─── */}
          <Text style={{
            fontSize: 11,
            fontWeight: '700',
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: 12,
          }}>
            Évaluation
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
          >
            {MOCK_EXAMENS.map((exam) => {
              const isSelected = selectedExamen === exam.id;
              return (
                <TouchableOpacity
                  key={exam.id}
                  onPress={() => setSelectedExamen(exam.id)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <View style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : colors.primaryBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Feather 
                      name="file-text" 
                      size={14} 
                      color={isSelected ? '#FFFFFF' : colors.primary} 
                    />
                  </View>
                  <View>
                    <Text style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    }}>
                      {exam.nom}
                    </Text>
                    <Text style={{
                      fontSize: 10,
                      color: isSelected ? 'rgba(255,255,255,0.6)' : colors.textMuted,
                    }}>
                      Coef. {exam.coefficient} • {exam.date}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#FFFFFF',
                    }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ─── LISTE DES ÉLÈVES ─── */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: 28,
            marginBottom: 14,
          }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}>
              Élèves
            </Text>
            <Text style={{
              fontSize: 11,
              color: colors.textMuted,
            }}>
              Note /20
            </Text>
          </View>

          {eleves.map((eleve, index) => {
            const isFocused = focusedId === eleve.id;
            const noteColor = getNoteColor(eleve.note);
            const noteBg = getNoteBg(eleve.note);

            return (
              <View
                key={eleve.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: isFocused ? colors.primary : colors.border,
                  marginBottom: 10,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: colors.primaryBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: colors.primary,
                    }}>
                      {index + 1}
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
                    <Text style={{
                      fontSize: 10,
                      color: colors.textMuted,
                    }}>
                      {eleve.note !== undefined ? `Note actuelle : ${eleve.note}/20` : 'Non noté'}
                    </Text>
                  </View>
                </View>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <View style={{
                    backgroundColor: noteBg,
                    borderRadius: 10,
                    paddingHorizontal: 2,
                  }}>
                    <TextInput
                      placeholder="–"
                      keyboardType="numeric"
                      value={eleve.note?.toString() || ''}
                      onChangeText={(text) => updateNote(eleve.id, text)}
                      onFocus={() => setFocusedId(eleve.id)}
                      onBlur={() => setFocusedId(null)}
                      style={{
                        width: 44,
                        height: 40,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: '700',
                        color: eleve.note !== undefined ? noteColor : colors.textMuted,
                        padding: 0,
                      }}
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textMuted,
                    fontWeight: '500',
                  }}>
                    /20
                  </Text>
                </View>
              </View>
            );
          })}

          {/* ─── STATISTIQUES ─── */}
          <View style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: 10,
            marginBottom: 6,
          }}>
            {[
              { label: 'Moyenne', value: moyenne.toFixed(1), icon: 'bar-chart-2', color: colors.primary },
              { label: 'Max', value: maxNote.toString(), icon: 'arrow-up', color: colors.success },
              { label: 'Min', value: minNote.toString(), icon: 'arrow-down', color: colors.error },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: colors.surfaceElevated,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                alignItems: 'center',
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <Feather name={stat.icon as any} size={14} color={stat.color} />
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: stat.color,
                  }}>
                    {stat.value}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 9,
                  color: colors.textMuted,
                  marginTop: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* ─── RÉCAPITULATIF DE L'ÉVALUATION ─── */}
          {selectedExam && (
            <View style={{
              marginTop: 16,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <View>
                <Text style={{
                  fontSize: 11,
                  color: colors.textMuted,
                  fontWeight: '500',
                }}>
                  {selectedExam.nom}
                </Text>
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                  Coefficient {selectedExam.coefficient}
                </Text>
              </View>
              <View style={{
                backgroundColor: colors.primaryBg,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}>
                <Text style={{
                  fontSize: 10,
                  color: colors.primary,
                  fontWeight: '600',
                }}>
                  {eleves.filter(e => e.note !== undefined).length}/{eleves.length} notés
                </Text>
              </View>
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
                Enregistrer les notes
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};