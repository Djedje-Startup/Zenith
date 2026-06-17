import React, { useState } from 'react';
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
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

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
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  pink: '#F472B6',
  pinkBg: 'rgba(244,114,182,0.09)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

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

const QUICK_ACCESS = [
  { label: 'Emploi du temps', icon: 'calendar' as const, color: C.blue,   bg: C.blueBg   },
  { label: 'Mes notes',       icon: 'book-open' as const, color: C.green,  bg: C.greenBg  },
  { label: 'Présences',       icon: 'check-square' as const, color: C.purple, bg: C.purpleBg },
  { label: 'Clubs',           icon: 'users' as const, color: C.pink,   bg: C.pinkBg   },
];

const getMentionStyle = (mention: string) => {
  switch (mention) {
    case 'EXCELLENT':  return { color: C.green,  bg: C.greenBg,  label: 'Excellent'  };
    case 'TRES_BIEN':  return { color: C.blue,   bg: C.blueBg,   label: 'Très bien'  };
    case 'BIEN':       return { color: C.accent, bg: C.accentBg, label: 'Bien'       };
    case 'ASSEZ_BIEN': return { color: C.amber,  bg: C.amberBg,  label: 'Assez bien' };
    default:           return { color: C.red,    bg: C.redBg,    label: 'Insuffisant'};
  }
};

const GradeBubble = ({ note }: { note: number }) => {
  const isGood = note >= 15;
  const isMid  = note >= 10;
  const color  = isGood ? C.green : isMid ? C.accentDim : C.red;
  const bg     = isGood ? C.greenBg : isMid ? C.accentBg : C.redBg;
  return (
    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color }}>{note}</Text>
    </View>
  );
};

const SectionTitle = ({ children }: { children: string }) => (
  <Text style={{
    fontSize: 11, fontWeight: '700', color: '#7880A0',
    textTransform: 'uppercase', letterSpacing: 1.2,
    marginTop: 22, marginBottom: 10,
  }}>
    {children}
  </Text>
);

export const StudentHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [student] = useState(MOCK_STUDENT);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  const mention = getMentionStyle(student.mention);
  const initials = `${student.prenoms[0]}${student.nom[0]}`.toUpperCase();
  const avg = student.moyenneGenerale.toFixed(1);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
      >
        {/* ───── Header ───── */}
        <View style={{
          backgroundColor: '#12151E',
          paddingTop: 56,
          paddingBottom: 40,
          paddingHorizontal: 22,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Halo décoratif */}
          <View style={{
            position: 'absolute', top: -50, right: -50,
            width: 200, height: 200,
            backgroundColor: 'rgba(99,102,241,0.06)',
            borderRadius: 100,
          }} />
          <View style={{
            position: 'absolute', bottom: -30, left: -20,
            width: 140, height: 140,
            backgroundColor: 'rgba(167,139,250,0.05)',
            borderRadius: 70,
          }} />

          {/* Top bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase' }}>
              SURYA
            </Text>
            {/* Avatar */}
            <LinearGradient
              colors={['#3730A3', '#6366F1']}
              style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#C7D2FE' }}>{initials}</Text>
            </LinearGradient>
          </View>

          {/* Salutation */}
          <Text style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '600' }}>
            Bonjour,
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#E8EAF0', marginTop: 3, letterSpacing: -0.3 }}>
            {user.prenoms}
          </Text>
          <View style={{
            marginTop: 10, alignSelf: 'flex-start',
            backgroundColor: C.accentBg,
            borderRadius: 8, borderWidth: 1, borderColor: '#252A40',
            paddingVertical: 4, paddingHorizontal: 10,
          }}>
            <Text style={{ fontSize: 12, color: C.accentDim, fontWeight: '600', letterSpacing: 0.3 }}>
              {student.classe}
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 36 }}>

          {/* ───── Carte moyenne générale ───── */}
          <View style={{
            backgroundColor: C.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: C.border,
            padding: 20,
            marginTop: -20,
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '600', marginBottom: 14 }}>
              Moyenne générale
            </Text>

            {/* Cercle moyenne */}
            <View style={{
              width: 96, height: 96, borderRadius: 48,
              backgroundColor: mention.bg,
              borderWidth: 2, borderColor: `${mention.color}30`,
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 26, fontWeight: '800', color: mention.color, letterSpacing: -1 }}>
                {avg}
              </Text>
              <Text style={{ fontSize: 11, color: `${mention.color}80`, fontWeight: '600', marginTop: -2 }}>
                /20
              </Text>
            </View>

            {/* Badge mention */}
            <View style={{
              backgroundColor: mention.bg,
              borderRadius: 8, borderWidth: 1,
              borderColor: `${mention.color}25`,
              paddingVertical: 4, paddingHorizontal: 14,
              marginBottom: 18,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: mention.color, letterSpacing: 1, textTransform: 'uppercase' }}>
                {mention.label}
              </Text>
            </View>

            {/* Rang & Présence */}
            <View style={{
              flexDirection: 'row',
              width: '100%',
              borderTopWidth: 1,
              borderTopColor: C.borderSub,
              paddingTop: 16,
            }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '600', marginBottom: 6 }}>
                  Rang
                </Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5 }}>
                  {student.rang}
                  <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '400' }}> / {student.effectifClasse}</Text>
                </Text>
              </View>

              {/* Séparateur vertical */}
              <View style={{ width: 1, backgroundColor: C.borderSub, marginHorizontal: 8 }} />

              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '600', marginBottom: 6 }}>
                  Présence
                </Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: C.green, letterSpacing: -0.5 }}>
                  {student.tauxPresence}
                  <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '400' }}>%</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* ───── Prochain cours ───── */}
          <SectionTitle>Prochain cours</SectionTitle>
          <View style={{
            backgroundColor: C.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: C.border,
            padding: 16,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#DDE0ED', letterSpacing: -0.2 }}>
                  {student.prochainCours.matiere}
                </Text>
                <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
                  {student.prochainCours.professeur} · Salle {student.prochainCours.salle}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 5 }}>
                  <Feather name="clock" size={14} color={C.textDim} />
                  <Text style={{ fontSize: 11, color: C.textDim }}>
                    {student.prochainCours.heureDebut} – {student.prochainCours.heureFin}
                  </Text>
                </View>
              </View>
              <View style={{
                backgroundColor: '#1A1D2E',
                borderWidth: 1, borderColor: '#252A40',
                borderRadius: 10,
                paddingVertical: 7, paddingHorizontal: 12,
              }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.accentDim }}>
                  {student.prochainCours.heureDebut}
                </Text>
              </View>
            </View>
          </View>

          {/* ───── Accès rapide ───── */}
          <SectionTitle>Accès rapide</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {QUICK_ACCESS.map((item) => (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.75}
                style={{
                  width: '47.5%',
                  backgroundColor: C.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: C.border,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View style={{
                  width: 38, height: 38,
                  borderRadius: 11,
                  backgroundColor: item.bg,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Feather name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary, flexShrink: 1 }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ───── Dernières notes ───── */}
          <SectionTitle>Dernières notes</SectionTitle>

          {student.dernieresNotes.map((note) => (
            <View
              key={note.id}
              style={{
                backgroundColor: C.surface,
                borderRadius: 13,
                borderWidth: 1,
                borderColor: C.border,
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
                <Text style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                  {note.date}
                </Text>
              </View>
              <GradeBubble note={note.note} />
            </View>
          ))}

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              marginTop: 4,
              paddingVertical: 12,
              alignItems: 'center',
              backgroundColor: C.surface,
              borderRadius: 13,
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.accentDim, letterSpacing: 0.2 }}>
              Voir toutes mes notes →
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};