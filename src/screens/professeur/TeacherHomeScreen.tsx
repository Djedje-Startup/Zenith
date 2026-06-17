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
  teal: '#2DD4BF',
  tealBg: 'rgba(45,212,191,0.09)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  red: '#EF4444',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

const MOCK_TEACHER = {
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
  notificationsNonLues: 3,
  statistiques: {
    totalEleves: 84,
    moyenneClasses: 14.5,
  },
};

const QUICK_ACTIONS = [
  { label: 'Saisir notes',  icon: '✏️', color: C.amber,  bg: C.amberBg  },
  { label: "Faire l'appel", icon: '✅', color: C.teal,   bg: C.tealBg   },
  { label: 'Mes classes',   icon: '👥', color: C.purple, bg: C.purpleBg },
];

const SectionTitle = ({ children, action, onAction }: {
  children: string;
  action?: string;
  onAction?: () => void;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 }}>
    <Text style={{
      fontSize: 11, fontWeight: '700', color: '#7880A0',
      textTransform: 'uppercase', letterSpacing: 1.2,
    }}>
      {children}
    </Text>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={{ fontSize: 12, color: C.accentDim, fontWeight: '600' }}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const TeacherHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [teacher] = useState(MOCK_TEACHER);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  const initials = `${teacher.prenoms[0]}${teacher.nom[0]}`.toUpperCase();

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
          <View style={{
            position: 'absolute', top: -50, right: -50,
            width: 200, height: 200,
            backgroundColor: 'rgba(99,102,241,0.06)',
            borderRadius: 100,
          }} />
          <View style={{
            position: 'absolute', bottom: -30, left: -20,
            width: 140, height: 140,
            backgroundColor: 'rgba(45,212,191,0.04)',
            borderRadius: 70,
          }} />

          {/* Top bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase' }}>
              ✦ SURYA
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {/* Cloche */}
              <TouchableOpacity style={{
                width: 40, height: 40,
                backgroundColor: '#161A24',
                borderRadius: 12, borderWidth: 1, borderColor: C.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 16, color: '#8088A8' }}>🔔</Text>
                {teacher.notificationsNonLues > 0 && (
                  <View style={{
                    position: 'absolute', top: 8, right: 9,
                    width: 8, height: 8,
                    backgroundColor: C.red, borderRadius: 4,
                    borderWidth: 2, borderColor: '#161A24',
                  }} />
                )}
              </TouchableOpacity>

              {/* Avatar */}
              <LinearGradient
                colors={['#3730A3', '#6366F1']}
                style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#C7D2FE' }}>{initials}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Salutation */}
          <Text style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '600' }}>
            Bonjour,
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#E8EAF0', marginTop: 3, letterSpacing: -0.3 }}>
            {teacher.prenoms} {teacher.nom}
          </Text>

          {/* Matières pills */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {teacher.matieres.map((m) => (
              <View key={m.id} style={{
                backgroundColor: C.accentBg,
                borderRadius: 8, borderWidth: 1, borderColor: '#252A40',
                paddingVertical: 4, paddingHorizontal: 10,
              }}>
                <Text style={{ fontSize: 11, color: C.accentDim, fontWeight: '600', letterSpacing: 0.3 }}>
                  {m.nom}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 36 }}>

          {/* ───── Stats rapides ───── */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: -20, marginBottom: 0 }}>
            {[
              { icon: '🏫', value: String(teacher.classes.length), label: 'Classes',     color: C.blue,   bg: C.blueBg   },
              { icon: '👥', value: String(teacher.statistiques.totalEleves), label: 'Élèves', color: C.green,  bg: C.greenBg  },
              { icon: '📈', value: teacher.statistiques.moyenneClasses.toFixed(1), label: 'Moyenne', color: C.amber, bg: C.amberBg  },
            ].map((s) => (
              <View key={s.label} style={{
                flex: 1,
                backgroundColor: C.surface,
                borderRadius: 14, borderWidth: 1, borderColor: C.border,
                padding: 14, alignItems: 'center',
              }}>
                <View style={{
                  width: 34, height: 34, borderRadius: 10,
                  backgroundColor: s.bg,
                  alignItems: 'center', justifyContent: 'center', marginBottom: 8,
                }}>
                  <Text style={{ fontSize: 15 }}>{s.icon}</Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: '800', color: s.color, letterSpacing: -0.5 }}>
                  {s.value}
                </Text>
                <Text style={{ fontSize: 10, color: C.textMuted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '500' }}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>

          {/* ───── Actions rapides ───── */}
          <SectionTitle>Actions rapides</SectionTitle>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                activeOpacity={0.75}
                style={{
                  flex: 1,
                  backgroundColor: C.surface,
                  borderRadius: 14, borderWidth: 1, borderColor: C.border,
                  padding: 14, alignItems: 'center',
                }}
              >
                <View style={{
                  width: 42, height: 42, borderRadius: 12,
                  backgroundColor: action.bg,
                  alignItems: 'center', justifyContent: 'center', marginBottom: 8,
                }}>
                  <Text style={{ fontSize: 18 }}>{action.icon}</Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: '600', color: C.textSecondary, textAlign: 'center' }}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ───── Cours du jour ───── */}
          <SectionTitle action="Voir tout" onAction={() => {}}>
            Cours du jour
          </SectionTitle>

          {teacher.coursAujourdhui.map((cours) => {
            const enCours = cours.statut === 'EN_COURS';
            return (
              <View
                key={cours.id}
                style={{
                  backgroundColor: C.surface,
                  borderRadius: 16, borderWidth: 1,
                  borderColor: enCours ? `${C.green}30` : C.border,
                  padding: 16, marginBottom: 10,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Barre latérale colorée */}
                <View style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: 3, borderRadius: 3,
                  backgroundColor: enCours ? C.green : C.accent,
                }} />

                <View style={{ paddingLeft: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#DDE0ED', letterSpacing: -0.2 }}>
                      {cours.matiere}
                    </Text>
                    <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
                      {cours.classe}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text style={{ fontSize: 11, color: C.textDim }}>🕐</Text>
                        <Text style={{ fontSize: 11, color: C.textDim }}>
                          {cours.heureDebut} – {cours.heureFin}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Text style={{ fontSize: 11, color: C.textDim }}>📍</Text>
                        <Text style={{ fontSize: 11, color: C.textDim }}>{cours.salle}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Badge statut */}
                  <View style={{
                    backgroundColor: enCours ? C.greenBg : C.accentBg,
                    borderRadius: 8, borderWidth: 1,
                    borderColor: enCours ? `${C.green}25` : `${C.accent}25`,
                    paddingVertical: 4, paddingHorizontal: 10,
                  }}>
                    <Text style={{
                      fontSize: 10, fontWeight: '700',
                      color: enCours ? C.green : C.accentDim,
                      textTransform: 'uppercase', letterSpacing: 0.8,
                    }}>
                      {enCours ? 'En cours' : 'À venir'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* ───── Mes classes ───── */}
          <SectionTitle>Mes classes</SectionTitle>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {teacher.classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                activeOpacity={0.75}
                style={{
                  backgroundColor: C.surface,
                  borderRadius: 12, borderWidth: 1, borderColor: C.border,
                  paddingVertical: 10, paddingHorizontal: 16,
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.textSecondary }}>
                  {cls.nom}
                </Text>
                <View style={{
                  backgroundColor: C.purpleBg, borderRadius: 6,
                  paddingVertical: 2, paddingHorizontal: 7,
                }}>
                  <Text style={{ fontSize: 10, color: C.purple, fontWeight: '700' }}>
                    {cls.effectif}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
};