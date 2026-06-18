import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:          '#0E1117',
  surface:     '#12151E',
  surfaceAlt:  '#161A24',
  border:      '#1C2030',
  borderSub:   '#141720',
  accent:      '#6366F1',
  accentDim:   '#818CF8',
  accentBg:    'rgba(99,102,241,0.10)',
  green:       '#34D399',
  greenBg:     'rgba(16,185,129,0.09)',
  amber:       '#FBBF24',
  amberBg:     'rgba(251,191,36,0.09)',
  blue:        '#60A5FA',
  blueBg:      'rgba(96,165,250,0.09)',
  purple:      '#A78BFA',
  purpleBg:    'rgba(167,139,250,0.09)',
  pink:        '#F472B6',
  pinkBg:      'rgba(244,114,182,0.09)',
  red:         '#EF4444',
  redBg:       'rgba(239,68,68,0.09)',
  teal:        '#2DD4BF',
  tealBg:      'rgba(45,212,191,0.09)',
  textPrimary:   '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted:     '#4A5060',
  textDim:       '#2E3245',
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChildDetail {
  id: string;
  nom: string;
  prenoms: string;
  photo?: string;
  dateNaissance: string;
  matricule: string;
  classe: string;
  cycle: string;
  moyenneGenerale?: number;
  rang?: number;
  effectifClasse?: number;
  nbAbsences: number;
  nbRetards: number;
  tauxPresence?: number;
  mention?: string;
  schoolName?: string;
}

// ─── Mock ─────────────────────────────────────────────────────────────────────
const MOCK_CHILD: ChildDetail = {
  id: '1',
  nom: 'MOUKOKO',
  prenoms: 'Jean Junior',
  dateNaissance: '15 mai 2010',
  matricule: 'LMB-2025-001',
  classe: '3ème A',
  cycle: 'COLLÈGE',
  moyenneGenerale: 15.5,
  rang: 3,
  effectifClasse: 32,
  nbAbsences: 2,
  nbRetards: 1,
  tauxPresence: 92,
  mention: 'BIEN',
  schoolName: 'Lycée Moderne',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
type FeatherIconName = keyof typeof Feather.glyphMap;

const getMentionConfig = (mention?: string) => {
  switch (mention) {
    case 'EXCELLENT':  return { label: 'Excellent',  color: C.green,  bg: C.greenBg  };
    case 'TRES_BIEN':  return { label: 'Très bien',  color: C.blue,   bg: C.blueBg   };
    case 'BIEN':       return { label: 'Bien',       color: C.accent, bg: C.accentBg };
    case 'ASSEZ_BIEN': return { label: 'Assez bien', color: C.amber,  bg: C.amberBg  };
    default: return null;
  }
};

const getGradeColor = (note: number) => {
  if (note >= 16) return C.green;
  if (note >= 14) return C.blue;
  if (note >= 12) return C.accent;
  if (note >= 10) return C.amber;
  return C.red;
};

const AVATAR_GRADIENTS: [string, string][] = [
  ['#3730A3', '#6366F1'],
  ['#065F46', '#34D399'],
  ['#7C2D12', '#F97316'],
  ['#4C1D95', '#A78BFA'],
];

// ─── Composants atomiques ─────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: string }) => (
  <Text style={{
    fontSize: 11, fontWeight: '700', color: '#7880A0',
    textTransform: 'uppercase', letterSpacing: 1.2,
    marginBottom: 10, marginTop: 22,
  }}>
    {children}
  </Text>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon, value, label, color, subtitle, onPress,
}: {
  icon: FeatherIconName; value: string | number;
  label: string; color: string; subtitle?: string; onPress?: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    style={{
      flex: 1,
      backgroundColor: C.surface,
      borderRadius: 16, borderWidth: 1, borderColor: C.border,
      padding: 14, alignItems: 'center',
    }}
  >
    <View style={{
      width: 38, height: 38, borderRadius: 11,
      backgroundColor: color + '18',
      alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    }}>
      <Feather name={icon} size={18} color={color} />
    </View>
    <Text style={{ fontSize: 20, fontWeight: '800', color, letterSpacing: -0.5 }}>
      {value}
    </Text>
    {subtitle && (
      <Text style={{ fontSize: 10, color: color + '80', fontWeight: '600' }}>{subtitle}</Text>
    )}
    <Text style={{ fontSize: 10, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── Quick Action ─────────────────────────────────────────────────────────────
const QuickAction = ({
  label, icon, color, onPress,
}: {
  label: string; icon: FeatherIconName; color: string; onPress?: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    style={{
      width: '30%',
      backgroundColor: C.surface,
      borderRadius: 14, borderWidth: 1, borderColor: C.border,
      padding: 14, alignItems: 'center',
    }}
  >
    <View style={{
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: color + '15',
      alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    }}>
      <Feather name={icon} size={20} color={color} />
    </View>
    <Text style={{
      fontSize: 10, fontWeight: '600', textAlign: 'center',
      color: C.textSecondary, lineHeight: 14,
    }}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({
  label, value, icon, iconColor, noBorder = false,
}: {
  label: string; value: string;
  icon?: FeatherIconName; iconColor?: string; noBorder?: boolean;
}) => (
  <View style={{
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: noBorder ? 0 : 1,
    borderBottomColor: C.borderSub,
  }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {icon && (
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: (iconColor || C.accent) + '15',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Feather name={icon} size={13} color={iconColor || C.accent} />
        </View>
      )}
      <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '500' }}>{label}</Text>
    </View>
    <Text style={{ fontSize: 13, fontWeight: '600', color: C.textSecondary }}>{value}</Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export const ChildDetailScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [child] = useState(MOCK_CHILD);

  const headerAnim  = useRef(new Animated.Value(0)).current;
  const profileAnim = useRef(new Animated.Value(0)).current;
  const statsAnim   = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(80, [
      Animated.spring(headerAnim,  { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      Animated.spring(profileAnim, { toValue: 1, tension: 55, friction: 11, useNativeDriver: true }),
      Animated.spring(statsAnim,   { toValue: 1, tension: 55, friction: 11, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  const parentInitials = `${user.prenoms?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase();
  const childInitials  = `${child.prenoms[0]}${child.nom[0]}`.toUpperCase();
  const fullName       = `${child.prenoms} ${child.nom}`;
  const mentionConfig  = getMentionConfig(child.mention);
  const gradeColor     = child.moyenneGenerale !== undefined
    ? getGradeColor(child.moyenneGenerale)
    : C.textMuted;

  const quickActions: Array<{
    label: string; icon: FeatherIconName; color: string; screen: string; params?: any;
  }> = [
    { label: 'Emploi du temps', icon: 'calendar',     color: C.blue,   screen: 'StudentTimetable' },
    { label: 'Notes',           icon: 'book-open',    color: C.green,  screen: 'StudentGradeDetail', params: { reportId: '1' } },
    { label: 'Paiements',       icon: 'credit-card',  color: C.amber,  screen: 'ParentPayments',     params: { childId: child.id } },
    { label: 'Présences',       icon: 'check-square', color: C.purple, screen: 'StudentAttendance',  params: { childId: child.id } },
    { label: 'Clubs',           icon: 'users',        color: C.pink,   screen: 'StudentClubDetail',  params: { clubId: '1' } },
    { label: 'Réclamation',     icon: 'message-square', color: C.red,  screen: 'StudentComplaint' },
    { label: 'Cours',           icon: 'book',         color: C.teal,   screen: 'StudentCourse' },
  ];

  const services = [
    { label: 'Parcours scolaire',     icon: 'trending-up'  as FeatherIconName, color: C.teal,  screen: 'StudentGrades' },
    { label: 'Historique paiements',  icon: 'credit-card'  as FeatherIconName, color: C.green, screen: 'ParentPaymentHistory', params: { childId: child.id } },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
      >

        {/* ───── Header ───── */}
        <Animated.View style={{ opacity: headerAnim }}>
          <View style={{
            backgroundColor: '#12151E',
            paddingTop: 56, paddingBottom: 28, paddingHorizontal: 22,
            overflow: 'hidden', position: 'relative',
          }}>
            {/* Halos */}
            <View style={{
              position: 'absolute', top: -50, right: -50,
              width: 200, height: 200, borderRadius: 100,
              backgroundColor: 'rgba(99,102,241,0.06)',
            }} />
            <View style={{
              position: 'absolute', bottom: -40, left: -30,
              width: 160, height: 160, borderRadius: 80,
              backgroundColor: 'rgba(52,211,153,0.04)',
            }} />

            {/* Barre top */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 20,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{
                    width: 40, height: 40,
                    backgroundColor: C.surfaceAlt,
                    borderRadius: 12, borderWidth: 1, borderColor: C.border,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Feather name="arrow-left" size={20} color={C.textSecondary} />
                </TouchableOpacity>
                <Text style={{
                  fontSize: 11, fontWeight: '700',
                  letterSpacing: 2.5, color: C.accent, textTransform: 'uppercase',
                }}>
                  ✦ SURYA
                </Text>
              </View>

              {/* Avatar parent */}
              <LinearGradient
                colors={['#3730A3', '#6366F1']}
                style={{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#C7D2FE' }}>
                  {parentInitials}
                </Text>
              </LinearGradient>
            </View>

            <Text style={{ fontSize: 23, fontWeight: '800', color: '#E8EAF0', letterSpacing: -0.4 }}>
              Profil de l'élève
            </Text>
            <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
              {child.schoolName}
            </Text>
          </View>
        </Animated.View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>

          {/* ───── Carte profil — entièrement centrée ───── */}
          <Animated.View style={{
            opacity: profileAnim,
            transform: [{
              scale: profileAnim.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }),
            }],
          }}>
            <View style={{
              backgroundColor: C.surface,
              borderRadius: 24, borderWidth: 1, borderColor: C.border,
              marginTop: -20,
              paddingTop: 28,
              paddingBottom: 24,
              paddingHorizontal: 20,
              // Tout le contenu centré horizontalement
              alignItems: 'center',
              overflow: 'hidden',
            }}>
              {/* Halo derrière l'avatar */}
              <View style={{
                position: 'absolute', top: -30,
                width: 180, height: 180, borderRadius: 90,
                backgroundColor: 'rgba(99,102,241,0.05)',
                alignSelf: 'center',
              }} />

              {/* ── Avatar centré ── */}
              <View style={{
                width: 96, height: 96,
                borderRadius: 48,
                // Anneau extérieur accent
                borderWidth: 3,
                borderColor: C.accent + '60',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                // Glow
                shadowColor: C.accent,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
                elevation: 10,
              }}>
                <LinearGradient
                  colors={AVATAR_GRADIENTS[0]}
                  style={{
                    width: 86, height: 86, borderRadius: 43,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 30, fontWeight: '800', color: '#E0E7FF' }}>
                    {childInitials}
                  </Text>
                </LinearGradient>
              </View>

              {/* ── Nom centré ── */}
              <Text style={{
                fontSize: 20, fontWeight: '800',
                color: C.textPrimary, letterSpacing: -0.3,
                textAlign: 'center',
              }}>
                {fullName}
              </Text>

              {/* ── Badges centrés ── */}
              <View style={{
                flexDirection: 'row', gap: 8,
                marginTop: 10, justifyContent: 'center', flexWrap: 'wrap',
              }}>
                {/* Badge classe */}
                <View style={{
                  backgroundColor: C.accentBg,
                  borderRadius: 8, borderWidth: 1, borderColor: C.accent + '30',
                  paddingVertical: 4, paddingHorizontal: 12,
                }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: C.accentDim, letterSpacing: 0.3 }}>
                    {child.classe}
                  </Text>
                </View>

                {/* Badge mention */}
                {mentionConfig && (
                  <View style={{
                    backgroundColor: mentionConfig.bg,
                    borderRadius: 8, borderWidth: 1, borderColor: mentionConfig.color + '30',
                    paddingVertical: 4, paddingHorizontal: 12,
                  }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: mentionConfig.color, letterSpacing: 0.3 }}>
                      {mentionConfig.label}
                    </Text>
                  </View>
                )}
              </View>

              {/* ── Matricule centré ── */}
              <Text style={{
                fontSize: 11, color: C.textDim,
                marginTop: 8, letterSpacing: 0.5,
                textAlign: 'center',
              }}>
                {child.matricule}
              </Text>

              {/* ── Séparateur ── */}
              <View style={{
                width: '100%', height: 1,
                backgroundColor: C.borderSub,
                marginTop: 20, marginBottom: 16,
              }} />

              {/* ── Mini stats inline centrées ── */}
              <View style={{ flexDirection: 'row', width: '100%' }}>
                {[
                  { label: 'Cycle',    value: child.cycle,   color: C.accentDim },
                  { label: 'Absences', value: `${child.nbAbsences}j`, color: C.red    },
                  { label: 'Retards',  value: `${child.nbRetards}x`,  color: C.amber  },
                ].map((item, i) => (
                  <View key={item.label} style={{
                    flex: 1, alignItems: 'center',
                    borderRightWidth: i < 2 ? 1 : 0,
                    borderRightColor: C.borderSub,
                  }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: item.color }}>
                      {item.value}
                    </Text>
                    <Text style={{ fontSize: 9, color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* ───── Stats clés ───── */}
          <Animated.View style={{
            flexDirection: 'row', gap: 10, marginTop: 12,
            opacity: statsAnim,
            transform: [{
              translateY: statsAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }),
            }],
          }}>
            <StatCard
              icon="trending-up"
              value={child.moyenneGenerale?.toFixed(1) || '-'}
              label="Moyenne"
              color={gradeColor}
              subtitle="/ 20"
              onPress={() => navigation.navigate('StudentGradeDetail', { reportId: '1' })}
            />
            <StatCard
              icon="award"
              value={`${child.rang}e`}
              label="Classement"
              color={C.amber}
              subtitle={`/ ${child.effectifClasse}`}
            />
            <StatCard
              icon="check-circle"
              value={`${child.tauxPresence}%`}
              label="Présence"
              color={C.green}
              onPress={() => navigation.navigate('StudentAttendance', { childId: child.id })}
            />
          </Animated.View>

          {/* ───── Actions rapides ───── */}
          <Animated.View style={{ opacity: contentAnim }}>
            <SectionLabel>Actions rapides</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {quickActions.map((a) => (
                <QuickAction
                  key={a.label}
                  label={a.label}
                  icon={a.icon}
                  color={a.color}
                  onPress={() => navigation.navigate(a.screen, a.params)}
                />
              ))}
            </View>

            {/* ───── Services ───── */}
            <SectionLabel>Services</SectionLabel>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {services.map((s) => (
                <TouchableOpacity
                  key={s.label}
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate(s.screen, s.params)}
                  style={{
                    width: '47.5%',
                    backgroundColor: C.surface,
                    borderRadius: 14, borderWidth: 1, borderColor: C.border,
                    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
                  }}
                >
                  <View style={{
                    width: 38, height: 38, borderRadius: 11,
                    backgroundColor: s.color + '15',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Feather name={s.icon} size={18} color={s.color} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary, flexShrink: 1 }}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ───── Informations ───── */}
            <SectionLabel>Informations</SectionLabel>
            <View style={{
              backgroundColor: C.surface,
              borderRadius: 18, borderWidth: 1, borderColor: C.border,
              paddingHorizontal: 16, overflow: 'hidden',
            }}>
              <InfoRow label="Date de naissance" value={child.dateNaissance} icon="calendar" iconColor={C.accent} />
              <InfoRow label="Cycle"             value={child.cycle}         icon="layers"   iconColor={C.blue}   />
              <InfoRow label="Classe"            value={child.classe}        icon="users"    iconColor={C.green}  />
              <InfoRow label="Absences"          value={`${child.nbAbsences} jour${child.nbAbsences > 1 ? 's' : ''}`} icon="alert-circle" iconColor={C.red}   />
              <InfoRow label="Retards"           value={`${child.nbRetards} fois`}  icon="clock"    iconColor={C.amber}  noBorder />
            </View>

            {/* ───── Bouton téléchargement ───── */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={{
                backgroundColor: C.surface,
                borderRadius: 14, borderWidth: 1, borderColor: C.border,
                padding: 15,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
                marginTop: 12,
              }}
            >
              <Feather name="download" size={17} color={C.accentDim} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.accentDim, letterSpacing: 0.2 }}>
                Télécharger la fiche élève
              </Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
};