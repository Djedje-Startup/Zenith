// screens/parent/ChildDetailScreen.tsx
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
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// ─── Tokens ───────────────────────────────────────────────────────────────────
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
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  pink: '#F472B6',
  pinkBg: 'rgba(244,114,182,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

// ─── Types ──────────────────────────────────────────────────────────────────
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

// ─── Mock data ──────────────────────────────────────────────────────────────
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

// ─── Helpers ────────────────────────────────────────────────────────────────
const getMentionConfig = (mention?: string) => {
  switch (mention) {
    case 'EXCELLENT':
      return { label: 'Excellent', color: C.green, bg: C.greenBg, icon: '🌟' };
    case 'TRES_BIEN':
      return { label: 'Très bien', color: C.blue, bg: C.blueBg, icon: '⭐' };
    case 'BIEN':
      return { label: 'Bien', color: C.accent, bg: C.accentBg, icon: '✨' };
    case 'ASSEZ_BIEN':
      return { label: 'Assez bien', color: C.amber, bg: C.amberBg, icon: '📈' };
    default:
      return null;
  }
};

const getGradeColor = (note: number) => {
  if (note >= 16) return C.green;
  if (note >= 14) return C.blue;
  if (note >= 12) return C.accent;
  if (note >= 10) return C.amber;
  return C.red;
};

// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({
  icon,
  value,
  label,
  color,
  subtitle,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  subtitle?: string;
}) => (
  <View
    style={{
      flex: 1,
      backgroundColor: C.surfaceAlt,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: C.border,
      padding: 14,
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: color + '12',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
      }}
    >
      {icon}
    </View>
    <Text
      style={{
        fontSize: 18,
        fontWeight: '700',
        color: color,
        letterSpacing: -0.5,
      }}
    >
      {value}
    </Text>
    <Text
      style={{
        fontSize: 10,
        fontWeight: '500',
        color: C.textMuted,
      }}
    >
      {label}
    </Text>
    {subtitle && (
      <Text
        style={{
          fontSize: 8,
          marginTop: 2,
          color: C.textDim,
        }}
      >
        {subtitle}
      </Text>
    )}
  </View>
);

// ─── Quick Action ──────────────────────────────────────────────────────────
type FeatherIconName = keyof typeof Feather.glyphMap;

const QuickAction = ({
  label,
  icon,
  color,
}: {
  label: string;
  icon: FeatherIconName;
  color: string;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={{
      width: '30%',
      backgroundColor: C.surfaceAlt,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: C.border,
      padding: 14,
      alignItems: 'center',
    }}
  >
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: color + '12',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
      }}
    >
      <Feather name={icon} size={20} color={color} />
    </View>
    <Text
      style={{
        fontSize: 10,
        fontWeight: '500',
        textAlign: 'center',
        color: C.textSecondary,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── Info Row ──────────────────────────────────────────────────────────────
interface InfoRowProps {
  label: string;
  value: string;
  icon?: FeatherIconName;
  iconColor?: string;
  noBorder?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  icon,
  iconColor,
  noBorder = false,
}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: noBorder ? 0 : 1,
      borderBottomColor: C.border,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {icon && (
        <Feather name={icon} size={14} color={iconColor || C.textMuted} />
      )}
      <Text style={{ fontSize: 12, color: C.textMuted }}>
        {label}
      </Text>
    </View>
    <Text style={{ fontSize: 12, fontWeight: '500', color: C.textSecondary }}>
      {value}
    </Text>
  </View>
);

// ─── Screen ─────────────────────────────────────────────────────────────────
export const ChildDetailScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [child] = useState(MOCK_CHILD);

  // Animations
  const profileScale = useRef(new Animated.Value(0.9)).current;
  const profileOpacity = useRef(new Animated.Value(0)).current;
  const statsTranslateY = useRef(new Animated.Value(10)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const actionsOpacity = useRef(new Animated.Value(0)).current;
  const infoTranslateY = useRef(new Animated.Value(10)).current;
  const infoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation du profil
    Animated.parallel([
      Animated.spring(profileScale, {
        toValue: 1,
        damping: 25,
        useNativeDriver: true,
      }),
      Animated.timing(profileOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation des statistiques
    Animated.parallel([
      Animated.spring(statsTranslateY, {
        toValue: 0,
        damping: 25,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(statsOpacity, {
        toValue: 1,
        duration: 300,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation des actions
    Animated.timing(actionsOpacity, {
      toValue: 1,
      duration: 300,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Animation des informations
    Animated.parallel([
      Animated.spring(infoTranslateY, {
        toValue: 0,
        damping: 25,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.timing(infoOpacity, {
        toValue: 1,
        duration: 300,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  const initials = `${user.prenoms?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase();
  const fullName = `${child.prenoms} ${child.nom}`;
  const mentionConfig = getMentionConfig(child.mention);
  const gradeColor = child.moyenneGenerale !== undefined
    ? getGradeColor(child.moyenneGenerale)
    : C.textMuted;

  const quickActions: Array<{ label: string; icon: FeatherIconName; color: string }> = [
    { label: 'Emploi du temps', icon: 'calendar', color: C.blue },
    { label: 'Notes', icon: 'book-open', color: C.green },
    { label: 'Paiements', icon: 'credit-card', color: C.amber },
    { label: 'Présences', icon: 'check-square', color: C.purple },
    { label: 'Clubs', icon: 'users', color: C.pink },
    { label: 'Réclamation', icon: 'message-square', color: C.red },
  ];

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
        <View
          style={{
            backgroundColor: C.surface,
            paddingTop: 56,
            paddingBottom: 32,
            paddingHorizontal: 22,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Halos décoratifs */}
          <View
            style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              backgroundColor: 'rgba(99,102,241,0.06)',
              borderRadius: 100,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -40,
              left: -30,
              width: 160,
              height: 160,
              backgroundColor: 'rgba(52,211,153,0.04)',
              borderRadius: 80,
            }}
          />

          {/* Top bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: C.surfaceAlt,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: C.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="arrow-left" size={20} color={C.textSecondary} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 2.5,
                  color: C.accent,
                  textTransform: 'uppercase',
                }}
              >
                ✦ SURYA
              </Text>
            </View>

            <LinearGradient
              colors={['#3730A3', '#6366F1']}
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#C7D2FE' }}>
                {initials}
              </Text>
            </LinearGradient>
          </View>

          {/* Titre */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#E8EAF0',
              letterSpacing: -0.3,
            }}
          >
            Profil de l'élève
          </Text>
          <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 4, letterSpacing: 0.2 }}>
            {child.schoolName}
          </Text>
        </View>

        {/* ───── Profil ───── */}
        <View style={{ paddingHorizontal: 16 }}>
          <Animated.View
            style={{
              alignItems: 'center',
              marginTop: -20,
              transform: [{ scale: profileScale }],
              opacity: profileOpacity,
            }}
          >
            <Card
              variant="default"
              padding="lg"
              glow
            >
              {/* Avatar */}
              <View style={{ marginTop: -36 }}>
                <Avatar
                  source={child.photo}
                  name={fullName}
                  size="xl"
                  gradient
                  ring
                  ringColor={C.accent}
                  online
                />
              </View>

              {/* Nom */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: C.textPrimary,
                  letterSpacing: -0.3,
                  marginTop: 12,
                }}
              >
                {fullName}
              </Text>

              {/* Badges */}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                <Badge
                  text={`📚 ${child.classe}`}
                  variant="primary"
                  size="sm"
                />
                {mentionConfig && (
                  <Badge
                    text={`${mentionConfig.icon} ${mentionConfig.label}`}
                    variant={
                      child.mention === 'EXCELLENT' ? 'success' :
                      child.mention === 'TRES_BIEN' ? 'info' :
                      child.mention === 'BIEN' ? 'primary' :
                      child.mention === 'ASSEZ_BIEN' ? 'warning' : 'default'
                    }
                    size="sm"
                    glow
                  />
                )}
              </View>

              {/* Matricule */}
              <Text
                style={{
                  fontSize: 12,
                  color: C.textMuted,
                  letterSpacing: 0.3,
                  marginTop: 8,
                }}
              >
                Matricule: {child.matricule}
              </Text>
            </Card>
          </Animated.View>

          {/* ───── Statistiques ───── */}
          <Animated.View
            style={{
              flexDirection: 'row',
              gap: 10,
              marginTop: 16,
              transform: [{ translateY: statsTranslateY }],
              opacity: statsOpacity,
            }}
          >
            <StatCard
              icon={<Feather name="trending-up" size={16} color={gradeColor} />}
              value={child.moyenneGenerale?.toFixed(1) || '-'}
              label="Moyenne"
              color={gradeColor}
              subtitle="/ 20"
            />

            <StatCard
              icon={<Feather name="award" size={16} color={C.amber} />}
              value={`${child.rang || '-'}/${child.effectifClasse || '-'}`}
              label="Rang"
              color={C.amber}
            />

            <StatCard
              icon={<Feather name="check-circle" size={16} color={C.green} />}
              value={`${child.tauxPresence || 0}%`}
              label="Présence"
              color={C.green}
            />
          </Animated.View>

          {/* ───── Actions rapides ───── */}
          <Animated.View
            style={{
              marginTop: 20,
              opacity: actionsOpacity,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: C.textSecondary,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                Actions rapides
              </Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {quickActions.map((action) => (
                <QuickAction
                  key={action.label}
                  label={action.label}
                  icon={action.icon}
                  color={action.color}
                />
              ))}
            </View>
          </Animated.View>

          {/* ───── Informations ───── */}
          <Animated.View
            style={{
              marginTop: 20,
              marginBottom: 32,
              transform: [{ translateY: infoTranslateY }],
              opacity: infoOpacity,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: C.textSecondary,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Informations
            </Text>

            <Card variant="default" padding="md">
              <InfoRow
                label="Date de naissance"
                value={child.dateNaissance}
                icon="calendar"
                iconColor={C.accent}
              />
              <InfoRow
                label="Cycle"
                value={child.cycle}
                icon="layers"
                iconColor={C.blue}
              />
              <InfoRow
                label="Classe"
                value={child.classe}
                icon="users"
                iconColor={C.green}
              />
              <InfoRow
                label="Absences"
                value={`${child.nbAbsences} jour${child.nbAbsences > 1 ? 's' : ''}`}
                icon="alert-circle"
                iconColor={C.red}
              />
              <InfoRow
                label="Retards"
                value={`${child.nbRetards} fois`}
                icon="clock"
                iconColor={C.amber}
                noBorder
              />
            </Card>

            {/* Bouton téléchargement */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                backgroundColor: C.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: C.border,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginTop: 16,
              }}
            >
              <Feather name="download" size={18} color={C.accentDim} />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: C.accentDim,
                  letterSpacing: 0.2,
                }}
              >
                Télécharger la fiche élève
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};