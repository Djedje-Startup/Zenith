// screens/parent/ParentHomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../store';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const COLORS = {
  bg: '#0E1117',
  surface: '#12151E',
  border: '#1C2030',
  borderSub: '#141720',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.10)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.09)',
  red: '#EF4444',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  textPrimary: '#DDE0ED',
  textSecondary: '#C0C4D8',
  textMuted: '#4A5060',
  textDim: '#3E4458',
};

interface DashboardStats {
  notificationsNonLues: number;
  prochainsCours: any[];
  dernieresNotes: any[];
  evenementsRecents: any[];
}

const MOCK_STATS: DashboardStats = {
  notificationsNonLues: 3,
  prochainsCours: [
    {
      id: '1',
      matiere: 'Mathématiques',
      professeur: 'M. NGOMA',
      salle: 'A101',
      heureDebut: '08:00',
    },
  ],
  dernieresNotes: [
    { id: '1', matiere: 'Mathématiques', note: 15, date: '15 oct. 2025' },
    { id: '2', matiere: 'Français', note: 14, date: '14 oct. 2025' },
    { id: '3', matiere: 'Physique-Chimie', note: 17, date: '12 oct. 2025' },
  ],
  evenementsRecents: [
    {
      id: '1',
      titre: 'Réunion parents-professeurs',
      date: '25 oct. 2025',
      lieu: 'Salle polyvalente',
      color: COLORS.accent,
    },
    {
      id: '2',
      titre: 'Examens de mi-trimestre',
      date: '3 nov. 2025',
      lieu: 'Toutes les salles',
      color: COLORS.green,
    },
  ],
};

// ✅ Services pour les parents - avec icônes Feather valides
// Supprimé: childrenCourses (Cours de mes enfants) et enrollment (Réinscription)
const PARENT_FEATURES = [
  { id: 'announcements', label: 'Annonces', icon: 'bell' as const, screen: 'Announcements', color: COLORS.accent },
  { id: 'schools', label: 'Établissements', icon: 'home' as const, screen: 'SchoolList', color: COLORS.green },
  { id: 'teachers', label: 'Professeurs', icon: 'users' as const, screen: 'ParentTeachers', color: COLORS.purple },
  { id: 'messaging', label: 'Messagerie', icon: 'message-circle' as const, screen: 'Messaging', color: COLORS.amber },
];

// ✅ Accès rapide existant - avec icônes Feather valides
const QUICK_ACCESS = [
  { label: 'Mes enfants', icon: 'users' as const, screen: 'ChildrenList', color: COLORS.blue },
  { label: 'Paiements', icon: 'credit-card' as const, screen: 'ParentPayments', color: COLORS.green },
  { label: 'Clubs', icon: 'users' as const, screen: 'ParentClubs', color: COLORS.purple },
  { label: 'Profil', icon: 'user' as const, screen: 'Profile', color: COLORS.accent },
];

const GradeBubble = ({ note }: { note: number }) => {
  const isGood = note >= 15;
  const isMedium = note >= 10 && note < 15;
  const bg = isGood ? COLORS.greenBg : isMedium ? COLORS.accentBg : 'rgba(239,68,68,0.10)';
  const color = isGood ? COLORS.green : isMedium ? COLORS.accentDim : COLORS.red;
  return (
    <View style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: bg,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{ color, fontSize: 14, fontWeight: '700' }}>{note}</Text>
    </View>
  );
};

const SectionTitle = ({ children }: { children: string }) => (
  <Text style={{
    fontSize: 11,
    fontWeight: '700',
    color: '#7880A0',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 22,
    marginBottom: 10,
  }}>
    {children}
  </Text>
);

export const ParentHomeScreen: React.FC = () => {
  const { user } = useAppStore();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats] = React.useState(MOCK_STATS);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const navigateTo = (screen: string, params?: any) => {
    navigation.navigate(screen, params);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  const initials = `${user.prenoms?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
          />
        }
      >
        {/* ───── Header ───── */}
        <View style={{
          backgroundColor: '#12151E',
          paddingTop: 56,
          paddingBottom: 36,
          paddingHorizontal: 22,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <View style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            backgroundColor: 'rgba(99,102,241,0.06)',
            borderRadius: 110,
          }} />

          {/* Top bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 2.5,
              color: COLORS.accent,
              textTransform: 'uppercase',
            }}>
              SURYA
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity 
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#161A24',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => navigateTo('Notifications')}
              >
                <Feather name="bell" size={18} color="#8088A8" />
                {stats.notificationsNonLues > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: 8,
                    right: 9,
                    width: 8,
                    height: 8,
                    backgroundColor: COLORS.red,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: '#161A24',
                  }} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigateTo('Profile')}>
                <LinearGradient
                  colors={['#3730A3', '#6366F1']}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#C7D2FE' }}>
                    {initials}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ fontSize: 12, color: COLORS.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '600' }}>
            Bonjour,
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#E8EAF0', marginTop: 3, letterSpacing: -0.3 }}>
            {user.prenoms} {user.nom}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>

          {/* ───── Prochain cours ───── */}
          {stats.prochainsCours.length > 0 && (
            <View style={{
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 16,
              marginTop: -16,
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '600', marginBottom: 10 }}>
                Prochain cours
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#DDE0ED', letterSpacing: -0.2 }}>
                    {stats.prochainsCours[0].matiere}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                    {stats.prochainsCours[0].professeur} · Salle {stats.prochainsCours[0].salle}
                  </Text>
                </View>
                <View style={{
                  backgroundColor: '#1A1D2E',
                  borderWidth: 1,
                  borderColor: '#252A40',
                  borderRadius: 10,
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.accentDim }}>
                    {stats.prochainsCours[0].heureDebut}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ───── Stats rapides ───── */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
            <View style={{
              flex: 1,
              backgroundColor: COLORS.surface,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 16,
              alignItems: 'center',
            }}>
              <View style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: COLORS.greenBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}>
                <Feather name="trending-up" size={18} color={COLORS.green} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#DDE0ED', letterSpacing: -0.5 }}>
                15
                <Text style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: '400' }}>/20</Text>
              </Text>
              <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '500' }}>
                Moyenne
              </Text>
            </View>

            <View style={{
              flex: 1,
              backgroundColor: COLORS.surface,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 16,
              alignItems: 'center',
            }}>
              <View style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: COLORS.accentBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}>
                <Feather name="check-square" size={18} color={COLORS.accentDim} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#DDE0ED', letterSpacing: -0.5 }}>
                92
                <Text style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: '400' }}>%</Text>
              </Text>
              <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '500' }}>
                Présence
              </Text>
            </View>
          </View>

          {/* ───── Accès rapide ───── */}
          <SectionTitle>Accès rapide</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {QUICK_ACCESS.map((item) => (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.75}
                onPress={() => navigateTo(item.screen)}
                style={{
                  width: '47.5%',
                  backgroundColor: COLORS.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View style={{
                  width: 38, height: 38,
                  borderRadius: 11,
                  backgroundColor: item.color + '15',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Feather name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, flexShrink: 1 }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ───── Services / Fonctionnalités ───── */}
          <SectionTitle>Services</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {PARENT_FEATURES.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => navigateTo(item.screen, { userRole: 'parent' })}
                style={{
                  width: '47.5%',
                  backgroundColor: COLORS.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View style={{
                  width: 38, height: 38,
                  borderRadius: 11,
                  backgroundColor: item.color + '15',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Feather name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, flexShrink: 1 }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ───── Dernières notes ───── */}
          {stats.dernieresNotes.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <SectionTitle>Dernières notes</SectionTitle>
              {stats.dernieresNotes.map((note) => (
                <View
                  key={note.id}
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 13,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    padding: 13,
                    paddingHorizontal: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#CDD0E0' }}>
                      {note.matiere}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#3E4458', marginTop: 2 }}>
                      {note.date}
                    </Text>
                  </View>
                  <GradeBubble note={note.note} />
                </View>
              ))}
            </View>
          )}

          {/* ───── Événements ───── */}
          {stats.evenementsRecents.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <SectionTitle>Événements à venir</SectionTitle>
              {stats.evenementsRecents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 13,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    padding: 13,
                    paddingHorizontal: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                    gap: 12,
                  }}
                >
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: `${event.color}18`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Feather name="calendar" size={18} color={event.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#C0C4D8' }}>
                      {event.titre}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#3E4458', marginTop: 2 }}>
                      {event.date} · {event.lieu}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#2A2E42" />
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
};