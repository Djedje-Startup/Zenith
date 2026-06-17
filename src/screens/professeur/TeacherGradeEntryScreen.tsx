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
  note?: number;
}

interface Examen {
  id: string;
  nom: string;
  coefficient: number;
  date: string;
}

// ─── Données Mock ────────────────────────────────────────────────────────────
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

// ─── Composant principal ──────────────────────────────────────────────────────
export const TeacherGradeEntryScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [eleves, setEleves] = useState(MOCK_ELEVES);
  const [selectedExamen, setSelectedExamen] = useState(MOCK_EXAMENS[0].id);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
      Alert.alert('Succès', 'Les notes ont été enregistrées');
    }, 1000);
  };

  const getNoteColor = (note?: number) => {
    if (!note) return C.textMuted;
    if (note >= 16) return C.green;
    if (note >= 12) return C.amber;
    return C.red;
  };

  const getNoteBg = (note?: number) => {
    if (!note) return 'transparent';
    if (note >= 16) return C.greenBg;
    if (note >= 12) return C.amberBg;
    return C.redBg;
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4F46E5']}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.5)',
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
              Classe 3ème A
            </Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}>
              <Feather name="users" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                {eleves.length} élèves
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>

          {/* ─── Sélecteur d'examen ──────────────────────────────────────────── */}
          <Text style={{
            fontSize: 11,
            fontWeight: '700',
            color: C.textMuted,
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
                    backgroundColor: isSelected ? C.accent : C.surface,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isSelected ? C.accent : C.border,
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
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : C.accentBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Feather 
                      name="file-text" 
                      size={14} 
                      color={isSelected ? '#FFFFFF' : C.accentDim} 
                    />
                  </View>
                  <View>
                    <Text style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isSelected ? '#FFFFFF' : C.textSecondary,
                    }}>
                      {exam.nom}
                    </Text>
                    <Text style={{
                      fontSize: 10,
                      color: isSelected ? 'rgba(255,255,255,0.6)' : C.textMuted,
                    }}>
                      Coef. {exam.coefficient}
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

          {/* ─── Liste des élèves ────────────────────────────────────────────── */}
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
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}>
              Élèves
            </Text>
            <Text style={{
              fontSize: 11,
              color: C.textMuted,
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
                  backgroundColor: C.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: isFocused ? C.accent : C.border,
                  marginBottom: 10,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: C.accentBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: C.accentDim,
                    }}>
                      {index + 1}
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
                    <Text style={{
                      fontSize: 10,
                      color: C.textMuted,
                    }}>
                      {eleve.note !== undefined ? `Note actuelle : ${eleve.note}/20` : 'Non noté'}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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
                        color: eleve.note ? noteColor : C.textMuted,
                        padding: 0,
                      }}
                      placeholderTextColor={C.textDim}
                    />
                  </View>
                  <Text style={{
                    fontSize: 12,
                    color: C.textMuted,
                    fontWeight: '500',
                  }}>
                    /20
                  </Text>
                </View>
              </View>
            );
          })}

          {/* ─── Statistiques ────────────────────────────────────────────────── */}
          <View style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: 10,
            marginBottom: 6,
          }}>
            {[
              { label: 'Moyenne', value: '14.2', icon: 'bar-chart-2', color: C.accent },
              { label: 'Max', value: '17', icon: 'arrow-up', color: C.green },
              { label: 'Min', value: '11', icon: 'arrow-down', color: C.red },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: C.surfaceAlt,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: C.border,
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
                  color: C.textMuted,
                  marginTop: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

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
            backgroundColor: isSaving ? C.textMuted : C.accent,
            borderRadius: 16,
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            shadowColor: C.accent,
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
                Enregistrer les notes
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};