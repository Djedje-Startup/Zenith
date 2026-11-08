// screens/professeur/TeacherHomeScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface TeacherData {
  nom: string;
  prenoms: string;
  matieres: { id: string; nom: string }[];
  classes: { id: string; nom: string; effectif: number }[];
  coursAujourdhui: {
    id: string;
    matiere: string;
    classe: string;
    heureDebut: string;
    heureFin: string;
    salle: string;
    statut: 'EN_COURS' | 'A_VENIR';
  }[];
  emploiDuTemps: {
    jour: string;
    cours: {
      id: string;
      matiere: string;
      classe: string;
      heureDebut: string;
      heureFin: string;
      salle: string;
    }[];
  }[];
  notificationsNonLues: number;
  statistiques: {
    totalEleves: number;
    moyenneClasses: number;
  };
  bulletinsPaie?: {
    id: string;
    mois: string;
    annee: number;
    montant: number;
    statut: 'PAYE' | 'EN_ATTENTE' | 'EN_RETARD';
    dateEmission: string;
  }[];
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_TEACHER: TeacherData = {
  nom: 'NGOMA',
  prenoms: 'Paul',
  matieres: [
    { id: '1', nom: 'Mathématiques' },
    { id: '2', nom: 'Physique-Chimie' },
  ],
  classes: [
    { id: '1', nom: '3ème A', effectif: 32 },
    { id: '2', nom: '4ème B', effectif: 28 },
    { id: '3', nom: 'Terminale C', effectif: 24 },
  ],
  coursAujourdhui: [
    {
      id: '1',
      matiere: 'Mathématiques',
      classe: '3ème A',
      heureDebut: '08:00',
      heureFin: '09:30',
      salle: 'A101',
      statut: 'EN_COURS',
    },
    {
      id: '2',
      matiere: 'Physique-Chimie',
      classe: '4ème B',
      heureDebut: '10:00',
      heureFin: '11:30',
      salle: 'Labo Sciences',
      statut: 'A_VENIR',
    },
  ],
  emploiDuTemps: [
    {
      jour: 'Lundi',
      cours: [
        { id: '1', matiere: 'Mathématiques', classe: '3ème A', heureDebut: '08:00', heureFin: '09:30', salle: 'A101' },
        { id: '2', matiere: 'Physique-Chimie', classe: '4ème B', heureDebut: '10:00', heureFin: '11:30', salle: 'Labo Sciences' },
        { id: '3', matiere: 'Mathématiques', classe: 'Terminale C', heureDebut: '14:00', heureFin: '15:30', salle: 'A102' },
      ],
    },
    {
      jour: 'Mardi',
      cours: [
        { id: '4', matiere: 'Physique-Chimie', classe: '3ème A', heureDebut: '08:00', heureFin: '09:30', salle: 'Labo Sciences' },
        { id: '5', matiere: 'Mathématiques', classe: '4ème B', heureDebut: '10:00', heureFin: '11:30', salle: 'A101' },
      ],
    },
    {
      jour: 'Mercredi',
      cours: [
        { id: '6', matiere: 'Mathématiques', classe: '3ème A', heureDebut: '09:00', heureFin: '10:30', salle: 'A101' },
        { id: '7', matiere: 'Physique-Chimie', classe: 'Terminale C', heureDebut: '11:00', heureFin: '12:30', salle: 'Labo Sciences' },
      ],
    },
    {
      jour: 'Jeudi',
      cours: [
        { id: '8', matiere: 'Mathématiques', classe: '4ème B', heureDebut: '08:00', heureFin: '09:30', salle: 'A101' },
        { id: '9', matiere: 'Physique-Chimie', classe: '3ème A', heureDebut: '14:00', heureFin: '15:30', salle: 'Labo Sciences' },
      ],
    },
    {
      jour: 'Vendredi',
      cours: [
        { id: '10', matiere: 'Mathématiques', classe: 'Terminale C', heureDebut: '08:00', heureFin: '09:30', salle: 'A102' },
      ],
    },
  ],
  notificationsNonLues: 3,
  statistiques: {
    totalEleves: 84,
    moyenneClasses: 14.5,
  },
  bulletinsPaie: [
    {
      id: '1',
      mois: 'Janvier',
      annee: 2025,
      montant: 450000,
      statut: 'PAYE',
      dateEmission: '2025-01-25',
    },
    {
      id: '2',
      mois: 'Février',
      annee: 2025,
      montant: 450000,
      statut: 'PAYE',
      dateEmission: '2025-02-25',
    },
    {
      id: '3',
      mois: 'Mars',
      annee: 2025,
      montant: 450000,
      statut: 'EN_ATTENTE',
      dateEmission: '2025-03-25',
    },
  ],
};

// ─── GRADIENTS TYPES ──────────────────────────────────────────────────────
const GRADIENT_BRAND: [string, string] = ['#F97316', '#8B5CF6'];

// ─── COMPOSANTS ────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: string }) => {
  const { colors } = useTheme();
  return (
    <Text style={{
      fontSize: 11,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginTop: 22,
      marginBottom: 12,
    }}>
      {children}
    </Text>
  );
};

// ─── COMPOSANT CERCLE ORANGE ──────────────────────────────────────────
const QuickAccessCircle = ({ 
  item, 
  onPress 
}: { 
  item: { label: string; icon: keyof typeof Feather.glyphMap; color: string; bg: string }; 
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={{ alignItems: 'center', width: 72 }}
    >
      <Animated.View style={{
        transform: [{ scale: scaleAnim }],
        alignItems: 'center',
      }}>
        <LinearGradient
          colors={['#F97316', '#FB923C']}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#F97316',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Feather name={item.icon} size={24} color="#FFFFFF" />
        </LinearGradient>
        <Text style={{
          fontSize: 11,
          fontWeight: '500',
          color: colors.textSecondary,
          marginTop: 6,
          textAlign: 'center',
        }}>
          {item.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── COMPOSANT STAT CARD ──────────────────────────────────────────────
const StatCard = ({ value, label, icon, color }: { 
  value: string | number; 
  label: string; 
  icon: keyof typeof Feather.glyphMap;
  color: string;
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      alignItems: 'center',
    }}>
      <View style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: color + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
      }}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={{
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        letterSpacing: -0.5,
      }}>
        {value}
      </Text>
      <Text style={{
        fontSize: 10,
        color: colors.textMuted,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        fontWeight: '500',
      }}>
        {label}
      </Text>
    </View>
  );
};

// ─── SCREEN PRINCIPAL ──────────────────────────────────────────────────
export const TeacherHomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [teacher] = useState(MOCK_TEACHER);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const navigateTo = (screen: string, params?: any) => {
    navigation.navigate(screen, params);
  };

  // ─── Actions rapides ───
  const QUICK_ACCESS = [
    { label: 'Saisir notes', icon: 'edit-3' as const, screen: 'TeacherGradeEntry' },
    { label: "Appel", icon: 'check-square' as const, screen: 'TeacherAttendance' },
    { label: 'Mes classes', icon: 'users' as const, screen: 'TeacherClasses' },
    { label: 'Bulletins', icon: 'file-text' as const, screen: 'TeacherPaySlips' },
  ];

  // ─── Services ───
  const SERVICES = [
    { id: 'timetable', label: 'Emploi du temps', icon: 'calendar' as const, screen: 'TeacherTimetable' },
    { id: 'students', label: 'Élèves', icon: 'users' as const, screen: 'TeacherStudents' },
    { id: 'messaging', label: 'Messagerie', icon: 'message-circle' as const, screen: 'Messaging' },
    { id: 'profile', label: 'Profil', icon: 'user' as const, screen: 'Profile' },
  ];

  if (!user) return <LoadingSpinner fullScreen />;

  const initials = `${teacher.prenoms[0]}${teacher.nom[0]}`.toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* ───── BANNIÈRE ZENITH ───── */}
        <LinearGradient
          colors={GRADIENT_BRAND}
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                Accueil
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginTop: 2,
                  letterSpacing: -0.5,
                }}
              >
                Bonjour, {teacher.prenoms}
              </Text>
              {/* Matières */}
              <View style={{
                flexDirection: 'row',
                gap: 6,
                marginTop: 8,
                flexWrap: 'wrap',
              }}>
                {teacher.matieres.map((m) => (
                  <View key={m.id} style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 6,
                    paddingVertical: 2,
                    paddingHorizontal: 8,
                  }}>
                    <Text style={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: '600',
                    }}>
                      {m.nom}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: 10,
                }}
                onPress={() => navigateTo('Notifications')}
              >
                <Feather name="bell" size={20} color="#FFFFFF" />
                {teacher.notificationsNonLues > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 10,
                    height: 10,
                    backgroundColor: '#EF4444',
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.8)',
                  }} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('Profile')}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: 10,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
                  {initials}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>

          {/* ───── STATS RAPIDES ───── */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <StatCard
              value={teacher.classes.length}
              label="Classes"
              icon="book-open"
              color={colors.info}
            />
            <StatCard
              value={teacher.statistiques.totalEleves}
              label="Élèves"
              icon="users"
              color={colors.success}
            />
            <StatCard
              value={teacher.statistiques.moyenneClasses.toFixed(1)}
              label="Moyenne"
              icon="trending-up"
              color={colors.warning}
            />
          </View>

          {/* ───── ACCÈS RAPIDE (CERCLES ORANGE) ───── */}
          <SectionTitle>Accès rapide</SectionTitle>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 4 }}>
            {QUICK_ACCESS.map((item) => (
              <QuickAccessCircle
                key={item.label}
                item={item}
                onPress={() => navigateTo(item.screen)}
              />
            ))}
          </View>

          {/* ───── SERVICES (CARTE ORANGE PREMIUM) ───── */}
          <SectionTitle>Services</SectionTitle>
          <LinearGradient
            colors={['#F97316', '#FB923C', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 20,
              shadowColor: '#F97316',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {SERVICES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => navigateTo(item.screen)}
                  style={{ alignItems: 'center' }}
                >
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 6,
                  }}>
                    <Feather name={item.icon} size={22} color="#FFFFFF" />
                  </View>
                  <Text style={{
                    fontSize: 10,
                    fontWeight: '500',
                    color: 'rgba(255,255,255,0.9)',
                    textAlign: 'center',
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>

          {/* ───── COURS DU JOUR ───── */}
          <SectionTitle>Cours du jour</SectionTitle>
          {teacher.coursAujourdhui.map((cours) => {
            const enCours = cours.statut === 'EN_COURS';
            return (
              <TouchableOpacity
                key={cours.id}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Cours', `${cours.matiere} - ${cours.classe}`)}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 13,
                  borderWidth: 1,
                  borderColor: enCours ? `${colors.success}40` : colors.border,
                  padding: 14,
                  marginBottom: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: enCours ? `${colors.success}20` : `${colors.primary}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Feather name="clock" size={18} color={enCours ? colors.success : colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text,
                  }}>
                    {cours.matiere}
                  </Text>
                  <Text style={{
                    fontSize: 11,
                    color: colors.textMuted,
                    marginTop: 2,
                  }}>
                    {cours.classe} · {cours.heureDebut} – {cours.heureFin} · {cours.salle}
                  </Text>
                </View>
                <View style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: enCours ? `${colors.success}15` : `${colors.primary}15`,
                  borderWidth: 1,
                  borderColor: enCours ? `${colors.success}25` : `${colors.primary}25`,
                }}>
                  <Text style={{
                    fontSize: 8,
                    fontWeight: '700',
                    color: enCours ? colors.success : colors.primary,
                  }}>
                    {enCours ? 'En cours' : 'À venir'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* ───── BULLETINS DE PAIE ───── */}
          {teacher.bulletinsPaie && teacher.bulletinsPaie.length > 0 && (
            <>
              <SectionTitle>Bulletins de paie</SectionTitle>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {teacher.bulletinsPaie.slice(0, 2).map((bulletin) => {
                  const statutConfig = {
                    PAYE: { label: 'Payé', color: colors.success, bg: `${colors.success}15` },
                    EN_ATTENTE: { label: 'En attente', color: colors.warning, bg: `${colors.warning}15` },
                    EN_RETARD: { label: 'En retard', color: colors.error, bg: `${colors.error}15` },
                  }[bulletin.statut] || { label: bulletin.statut, color: colors.textMuted, bg: colors.surfaceElevated };

                  return (
                    <TouchableOpacity
                      key={bulletin.id}
                      activeOpacity={0.7}
                      onPress={() => navigateTo('TeacherPaySlips')}
                      style={{
                        flex: 1,
                        backgroundColor: colors.surface,
                        borderRadius: 13,
                        borderWidth: 1,
                        borderColor: colors.border,
                        padding: 14,
                      }}
                    >
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}>
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: colors.text,
                        }}>
                          {bulletin.mois} {bulletin.annee}
                        </Text>
                        <View style={{
                          backgroundColor: statutConfig.bg,
                          borderRadius: 4,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                        }}>
                          <Text style={{
                            fontSize: 8,
                            fontWeight: '700',
                            color: statutConfig.color,
                          }}>
                            {statutConfig.label}
                          </Text>
                        </View>
                      </View>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: colors.primary,
                      }}>
                        {bulletin.montant.toLocaleString()} FCFA
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

        </View>
      </ScrollView>
    </View>
  );
};