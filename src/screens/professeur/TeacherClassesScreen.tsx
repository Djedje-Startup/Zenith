// screens/professeur/TeacherClassesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const TeacherClassesScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getMoyenneColor = (moyenne?: number) => {
    if (!moyenne) return colors.textMuted;
    if (moyenne >= 16) return colors.success;
    if (moyenne >= 12) return colors.warning;
    return colors.error;
  };

  const getPerformanceText = (moyenne?: number) => {
    if (!moyenne) return 'Non évalué';
    if (moyenne >= 16) return 'Excellent ! La classe est au top';
    if (moyenne >= 12) return 'Performance correcte';
    return "Besoin d'amélioration";
  };

  // ─── Fonctions de navigation ───
  const goToGradeEntry = (classeId: string, className: string) => {
    navigation.navigate('TeacherGradeEntry', { 
      classeId, 
      className 
    });
  };

  const goToClassDetail = (classeId: string) => {
    navigation.navigate('TeacherClassDetail', { classeId });
  };

  const goToTimetable = () => {
    navigation.navigate('TeacherTimetable');
  };

  // ─── Rendu d'une carte de classe ───
  const renderClasseCard = ({ item, index }: { item: Classe; index: number }) => {
    const moyenneColor = getMoyenneColor(item.moyenne);
    const performanceText = getPerformanceText(item.moyenne);

    // ✅ Taille adaptative en fonction de l'écran
    const isSmallScreen = SCREEN_WIDTH < 380;

    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        {/* ─── HEADER AVEC DÉGRADÉ ZENITH ─── */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: isSmallScreen ? 14 : 18,
            paddingVertical: isSmallScreen ? 14 : 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{
              width: isSmallScreen ? 36 : 44,
              height: isSmallScreen ? 36 : 44,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Feather name="book" size={isSmallScreen ? 16 : 20} color="rgba(255,255,255,0.9)" />
            </View>
            <View>
              <Text style={{
                fontSize: isSmallScreen ? 16 : 18,
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: -0.3,
              }}>
                {item.nom}
              </Text>
              <Text style={{
                fontSize: isSmallScreen ? 10 : 11,
                color: 'rgba(255,255,255,0.7)',
                fontWeight: '500',
              }}>
                {item.matiere}
              </Text>
            </View>
          </View>

          <View style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            paddingHorizontal: isSmallScreen ? 8 : 12,
            paddingVertical: isSmallScreen ? 4 : 6,
          }}>
            <Text style={{
              fontSize: isSmallScreen ? 10 : 11,
              fontWeight: '600',
              color: '#FFFFFF',
            }}>
              {item.niveau}
            </Text>
          </View>
        </LinearGradient>

        {/* ─── CONTENU ─── */}
        <View style={{ padding: isSmallScreen ? 12 : 16 }}>
          {/* Stats principales */}
          <View style={{
            flexDirection: 'row',
            gap: isSmallScreen ? 8 : 12,
            marginBottom: 14,
          }}>
            {[
              { icon: 'users', label: 'Élèves', value: item.effectif.toString() },
              { icon: 'clock', label: 'Dernier cours', value: item.dernierCours || '—' },
            ].map((stat) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: colors.surfaceElevated,
                borderRadius: 12,
                padding: isSmallScreen ? 8 : 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name={stat.icon as any} size={isSmallScreen ? 12 : 14} color={colors.textMuted} />
                  <Text style={{
                    fontSize: isSmallScreen ? 8 : 10,
                    color: colors.textMuted,
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {stat.label}
                  </Text>
                </View>
                <Text style={{
                  fontSize: isSmallScreen ? 14 : 16,
                  fontWeight: '700',
                  color: colors.text,
                  marginTop: 2,
                }}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Moyenne avec barre de progression */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => goToClassDetail(item.id)}
            style={{
              backgroundColor: colors.surfaceElevated,
              borderRadius: 12,
              padding: isSmallScreen ? 10 : 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="trending-up" size={isSmallScreen ? 14 : 16} color={moyenneColor} />
                <Text style={{
                  fontSize: isSmallScreen ? 11 : 12,
                  color: colors.textSecondary,
                  fontWeight: '500',
                }}>
                  Moyenne de la classe
                </Text>
              </View>
              <Text style={{
                fontSize: isSmallScreen ? 18 : 20,
                fontWeight: '800',
                color: moyenneColor,
                letterSpacing: -0.5,
              }}>
                {item.moyenne?.toFixed(1) || '—'}
                <Text style={{ fontSize: isSmallScreen ? 11 : 13, color: colors.textMuted, fontWeight: '600' }}>
                  /20
                </Text>
              </Text>
            </View>

            {/* Barre de progression */}
            <View style={{
              height: 4,
              backgroundColor: colors.border,
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
                fontSize: isSmallScreen ? 9 : 10,
                color: colors.textMuted,
              }}>
                {performanceText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── FOOTER AVEC ACTIONS (CORRIGÉ) ─── */}
        <View style={{
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surfaceElevated,
        }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => goToGradeEntry(item.id, item.nom)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isSmallScreen ? 4 : 6,
              paddingVertical: isSmallScreen ? 10 : 12,
              paddingHorizontal: 4,
            }}
          >
            <Feather name="edit-2" size={isSmallScreen ? 14 : 16} color={colors.primary} />
            <Text style={{
              fontSize: isSmallScreen ? 10 : 12,
              color: colors.primary,
              fontWeight: '600',
              textAlign: 'center',
            }}>
              Notes
            </Text>
          </TouchableOpacity>
          
          <View style={{
            width: 1,
            backgroundColor: colors.border,
          }} />
          
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goToTimetable}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isSmallScreen ? 4 : 6,
              paddingVertical: isSmallScreen ? 10 : 12,
              paddingHorizontal: 4,
            }}
          >
            <Feather name="calendar" size={isSmallScreen ? 14 : 16} color={colors.textSecondary} />
            <Text style={{
              fontSize: isSmallScreen ? 10 : 12,
              color: colors.textSecondary,
              fontWeight: '500',
              textAlign: 'center',
            }}>
              Emploi
            </Text>
          </TouchableOpacity>
          
          <View style={{
            width: 1,
            backgroundColor: colors.border,
          }} />
          
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => goToClassDetail(item.id)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isSmallScreen ? 4 : 6,
              paddingVertical: isSmallScreen ? 10 : 12,
              paddingHorizontal: 4,
            }}
          >
            <Feather name="users" size={isSmallScreen ? 14 : 16} color={colors.textSecondary} />
            <Text style={{
              fontSize: isSmallScreen ? 10 : 12,
              color: colors.textSecondary,
              fontWeight: '500',
              textAlign: 'center',
            }}>
              Liste
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: 'rgba(255,255,255,0.6)',
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
              backgroundColor: 'rgba(255,255,255,0.15)',
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
              backgroundColor: 'rgba(255,255,255,0.12)',
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
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Feather name={stat.icon as any} size={16} color="rgba(255,255,255,0.8)" />
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

      {/* ─── LISTE DES CLASSES ─── */}
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderClasseCard}
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
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
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}>
              {classes.length} classe{classes.length > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{
                fontSize: 12,
                color: colors.primary,
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