// screens/eleve/StudentHomeScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// DONNÉES MOCKÉES
// ──────────────────────────────────────────────────────────────
const MOCK_STUDENT = {
  nom: 'MOUKOKO',
  prenoms: 'Jean Junior',
  classe: '3ème A',
  moyenneGenerale: 15.5,
  mention: 'BIEN',
  rang: 3,
  effectifClasse: 32,
  tauxPresence: 92,
  prochainCours: {
    matiere: 'Mathématiques',
    professeur: 'M. NGOMA',
    salle: 'A101',
    heureDebut: '08:00',
    heureFin: '09:30',
  },
  dernieresNotes: [
    { id: '1', matiere: 'Mathématiques', note: 15, date: '15 oct. 2025' },
    { id: '2', matiere: 'Français', note: 14, date: '14 oct. 2025' },
    { id: '3', matiere: 'Anglais', note: 16, date: '13 oct. 2025' },
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
  item: { label: string; icon: keyof typeof Feather.glyphMap; screen: string }; 
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
export const StudentHomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [student] = useState(MOCK_STUDENT);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const navigateTo = (screen: string, params?: any) => {
    navigation.navigate(screen, params);
  };

  // ─── Actions rapides ───
  const QUICK_ACCESS = [
    { label: 'Emploi du temps', icon: 'calendar' as const, screen: 'StudentTimetable' },
    { label: 'Mes notes', icon: 'book-open' as const, screen: 'StudentGrades' },
    { label: 'Présences', icon: 'check-square' as const, screen: 'StudentAttendance' },
    { label: 'Clubs', icon: 'users' as const, screen: 'StudentClubs' },
  ];

  // ─── Services ───
  const SERVICES = [
    { id: 'announcements', label: 'Annonces', icon: 'bell' as const, screen: 'Announcements' },
    { id: 'elections', label: 'Élections & BDE', icon: 'award' as const, screen: 'StudentElections' },
    { id: 'courses', label: 'Cours', icon: 'book' as const, screen: 'StudentCourse' },
    { id: 'messaging', label: 'Messagerie', icon: 'message-circle' as const, screen: 'Messaging' },
    { id: 'library', label: 'Bibliothèque', icon: 'book-open' as const, screen: 'StudentLibrary' },
    { id: 'rooms', label: 'Salles', icon: 'map-pin' as const, screen: 'StudentRooms' },
    { id: 'paymentHistory', label: 'Historique paiements', icon: 'credit-card' as const, screen: 'StudentPaymentHistory' },
  ];

  if (!user) return <LoadingSpinner fullScreen />;

  const initials = `${student.prenoms[0]}${student.nom[0]}`.toUpperCase();

  // Gestion des mentions
  const getMentionStyle = (mention: string) => {
    switch (mention) {
      case 'EXCELLENT':  return { color: colors.success, bg: colors.success + '15' };
      case 'TRES_BIEN':  return { color: colors.info, bg: colors.info + '15' };
      case 'BIEN':       return { color: colors.primary, bg: colors.primary + '15' };
      case 'ASSEZ_BIEN': return { color: colors.warning, bg: colors.warning + '15' };
      default:           return { color: colors.error, bg: colors.error + '15' };
    }
  };

  const mentionStyle = getMentionStyle(student.mention);
  const avg = student.moyenneGenerale.toFixed(1);

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
                Bonjour, {student.prenoms}
              </Text>
              <View style={{
                flexDirection: 'row',
                gap: 6,
                marginTop: 8,
                flexWrap: 'wrap',
              }}>
                <View style={{
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
                    {student.classe}
                  </Text>
                </View>
                <View style={{
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
                    {student.mention}
                  </Text>
                </View>
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
              value={avg}
              label="Moyenne"
              icon="trending-up"
              color={mentionStyle.color}
            />
            <StatCard
              value={`${student.rang}e`}
              label="Rang"
              icon="award"
              color={colors.warning}
            />
            <StatCard
              value={`${student.tauxPresence}%`}
              label="Présence"
              icon="check-square"
              color={colors.success}
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
              {SERVICES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => navigateTo(item.screen, { userRole: 'student' })}
                  style={{ alignItems: 'center', width: '30%', marginBottom: 12 }}
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
                    fontSize: 9,
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

          {/* ───── PROCHAIN COURS ───── */}
          <SectionTitle>Prochain cours</SectionTitle>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('StudentTimetable')}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 13,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: `${colors.primary}20`,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Feather name="clock" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.text,
              }}>
                {student.prochainCours.matiere}
              </Text>
              <Text style={{
                fontSize: 11,
                color: colors.textMuted,
                marginTop: 2,
              }}>
                {student.prochainCours.professeur} · Salle {student.prochainCours.salle}
              </Text>
              <Text style={{
                fontSize: 11,
                color: colors.textMuted,
              }}>
                {student.prochainCours.heureDebut} – {student.prochainCours.heureFin}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* ───── DERNIÈRES NOTES ───── */}
          <SectionTitle>Dernières notes</SectionTitle>
          {student.dernieresNotes.map((note) => {
            const isGood = note.note >= 15;
            const isMid = note.note >= 10;
            const color = isGood ? colors.success : isMid ? colors.primary : colors.error;
            const bg = isGood ? `${colors.success}20` : isMid ? `${colors.primary}20` : `${colors.error}20`;

            return (
              <View
                key={note.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 13,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 13,
                  paddingHorizontal: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <View>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.textSecondary,
                  }}>
                    {note.matiere}
                  </Text>
                  <Text style={{
                    fontSize: 11,
                    color: colors.textMuted,
                    marginTop: 2,
                  }}>
                    {note.date}
                  </Text>
                </View>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color }}>
                    {note.note}
                  </Text>
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigateTo('StudentGrades')}
            style={{
              marginTop: 4,
              paddingVertical: 12,
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: 13,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: colors.primary,
              letterSpacing: 0.2,
            }}>
              Voir toutes mes notes →
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};