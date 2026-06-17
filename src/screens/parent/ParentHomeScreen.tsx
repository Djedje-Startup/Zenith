// screens/parent/ParentHomeScreen.tsx (ou HomeScreen.tsx)
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
import { useAppStore } from '../../store'; // ✅ Changement ici
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

export const ParentHomeScreen: React.FC = () => {
  const { user } = useAppStore(); // ✅ Changement ici
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats] = React.useState(MOCK_STATS);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

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
              ✦ SURYA
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity style={{
                width: 40,
                height: 40,
                backgroundColor: '#161A24',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: COLORS.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 16, color: '#8088A8' }}>🔔</Text>
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
                <Text style={{ fontSize: 16 }}>📈</Text>
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
                <Text style={{ fontSize: 16 }}>✅</Text>
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

          {/* ───── Dernières notes ───── */}
          {stats.dernieresNotes.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '700',
                color: '#7880A0',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                marginTop: 18,
                marginBottom: 10,
              }}>
                Dernières notes
              </Text>
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
              <Text style={{
                fontSize: 11,
                fontWeight: '700',
                color: '#7880A0',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                marginTop: 18,
                marginBottom: 10,
              }}>
                Événements à venir
              </Text>
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
                    <Text style={{ fontSize: 15, color: event.color }}>📅</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#C0C4D8' }}>
                      {event.titre}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#3E4458', marginTop: 2 }}>
                      {event.date} · {event.lieu}
                    </Text>
                  </View>
                  <Text style={{ color: '#2A2E42', fontSize: 18 }}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
};