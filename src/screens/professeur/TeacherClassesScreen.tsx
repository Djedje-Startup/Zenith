// screens/professeur/TeacherClassesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
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
interface Classe {
  id: string;
  nom: string;
  niveau: string;
  effectif: number;
  matiere: string;
  moyenne?: number;
  dernierCours?: string;
  progression?: number;
}

// ─── Données Mock ────────────────────────────────────────────────────────────
const MOCK_CLASSES: Classe[] = [
  { 
    id: '1', 
    nom: '3ème A', 
    niveau: '3ème', 
    effectif: 32, 
    matiere: 'Mathématiques', 
    moyenne: 14.2, 
    dernierCours: '2025-10-13',
    progression: 78,
  },
  { 
    id: '2', 
    nom: '4ème B', 
    niveau: '4ème', 
    effectif: 28, 
    matiere: 'Mathématiques', 
    moyenne: 13.5, 
    dernierCours: '2025-10-12',
    progression: 65,
  },
  { 
    id: '3', 
    nom: 'Terminale C', 
    niveau: 'Terminale', 
    effectif: 24, 
    matiere: 'Mathématiques', 
    moyenne: 15.8, 
    dernierCours: '2025-10-14',
    progression: 92,
  },
];

// ─── Composant principal ──────────────────────────────────────────────────────
export const TeacherClassesScreen: React.FC = () => {
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getMoyenneColor = (moyenne?: number) => {
    if (!moyenne) return C.textMuted;
    if (moyenne >= 16) return C.green;
    if (moyenne >= 12) return C.amber;
    return C.red;
  };

  const renderClasseCard = ({ item, index }: { item: Classe; index: number }) => {
    const moyenneColor = getMoyenneColor(item.moyenne);
    const isHigh = item.moyenne && item.moyenne >= 16;
    const isLow = item.moyenne && item.moyenne < 12;

    return (
      <View
        style={{
          backgroundColor: C.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: C.border,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        {/* ─── Header avec dégradé ────────────────────────────────────────────── */}
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 18,
            paddingVertical: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Feather name="book" size={20} color="rgba(255,255,255,0.9)" />
            </View>
            <View>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: -0.3,
              }}>
                {item.nom}
              </Text>
              <Text style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: '500',
              }}>
                {item.matiere}
              </Text>
            </View>
          </View>

          <View style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '600',
              color: '#FFFFFF',
            }}>
              {item.niveau}
            </Text>
          </View>
        </LinearGradient>

        {/* ─── Contenu ────────────────────────────────────────────────────────── */}
        <View style={{ padding: 16 }}>
          {/* Stats principales */}
          <View style={{
            flexDirection: 'row',
            gap: 12,
            marginBottom: 14,
          }}>
            {[
              { icon: 'users', label: 'Élèves', value: item.effectif.toString() },
              { icon: 'clock', label: 'Dernier cours', value: item.dernierCours || '—' },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: C.surfaceAlt,
                borderRadius: 12,
                padding: 10,
                borderWidth: 1,
                borderColor: C.border,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Feather name={stat.icon as any} size={14} color={C.textMuted} />
                  <Text style={{
                    fontSize: 10,
                    color: C.textMuted,
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {stat.label}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: C.textPrimary,
                  marginTop: 2,
                }}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Moyenne avec barre de progression */}
          <View style={{
            backgroundColor: C.surfaceAlt,
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: C.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="trending-up" size={16} color={moyenneColor} />
                <Text style={{
                  fontSize: 12,
                  color: C.textSecondary,
                  fontWeight: '500',
                }}>
                  Moyenne de la classe
                </Text>
              </View>
              <Text style={{
                fontSize: 20,
                fontWeight: '800',
                color: moyenneColor,
                letterSpacing: -0.5,
              }}>
                {item.moyenne?.toFixed(1) || '—'}
                <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '600' }}>
                  /20
                </Text>
              </Text>
            </View>

            {/* Barre de progression */}
            <View style={{
              height: 4,
              backgroundColor: C.border,
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <View style={{
                width: `${Math.min(100, ((item.moyenne || 0) / 20) * 100)}%`,
                height: '100%',
                backgroundColor: moyenneColor,
                borderRadius: 2,
              }} />
            </View>

            {/* Indicateur de performance */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
            }}>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: moyenneColor,
              }} />
              <Text style={{
                fontSize: 10,
                color: C.textMuted,
              }}>
                {isHigh ? 'Excellent ! La classe est au top' : 
                 isLow ? 'Besoin d\'amélioration' : 
                 'Performance correcte'}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Footer avec actions ────────────────────────────────────────────── */}
        <View style={{
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: C.border,
          backgroundColor: C.surfaceAlt,
        }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 12,
            }}
          >
            <Feather name="edit-2" size={16} color={C.accentDim} />
            <Text style={{
              fontSize: 12,
              color: C.accentDim,
              fontWeight: '600',
            }}>
              Saisir notes
            </Text>
          </TouchableOpacity>
          <View style={{
            width: 1,
            backgroundColor: C.border,
          }} />
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 12,
            }}
          >
            <Feather name="calendar" size={16} color={C.textMuted} />
            <Text style={{
              fontSize: 12,
              color: C.textMuted,
              fontWeight: '500',
            }}>
              Emploi du temps
            </Text>
          </TouchableOpacity>
          <View style={{
            width: 1,
            backgroundColor: C.border,
          }} />
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 12,
            }}
          >
            <Feather name="users" size={16} color={C.textMuted} />
            <Text style={{
              fontSize: 12,
              color: C.textMuted,
              fontWeight: '500',
            }}>
              Liste
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
              Enseignant
            </Text>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              marginTop: 2,
              letterSpacing: -0.5,
            }}>
              Mes classes
            </Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
              <Feather name="grid" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {classes.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistiques rapides */}
        <View style={{
          flexDirection: 'row',
          gap: 10,
          marginTop: 16,
        }}>
          {[
            { label: 'Total élèves', value: classes.reduce((acc, c) => acc + c.effectif, 0).toString(), icon: 'users' },
            { label: 'Moyenne générale', value: (classes.reduce((acc, c) => acc + (c.moyenne || 0), 0) / classes.length).toFixed(1), icon: 'trending-up' },
          ].map((stat) => (
            <View key={stat.label} style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Feather name={stat.icon as any} size={16} color="rgba(255,255,255,0.6)" />
              </View>
              <View>
                <Text style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  {stat.label}
                </Text>
                <Text style={{
                  fontSize: 16,
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

      {/* ─── Liste des classes ────────────────────────────────────────────────── */}
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderClasseCard}
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        ListHeaderComponent={
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}>
              {classes.length} classe{classes.length > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{
                fontSize: 12,
                color: C.accentDim,
                fontWeight: '600',
              }}>
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};