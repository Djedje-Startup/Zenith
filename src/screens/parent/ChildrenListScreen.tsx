// screens/parent/ChildrenListScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/animations/EmptyState';

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
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface Child {
  id: string;
  nom: string;
  prenoms: string;
  photo?: string;
  classe: string;
  matricule: string;
  schoolName: string;
  moyenne?: number;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  tauxPresence?: number;
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_CHILDREN: Child[] = [
  {
    id: '1',
    nom: 'MOUKOKO',
    prenoms: 'Jean Junior',
    classe: '3ème A',
    matricule: 'LMB-2025-001',
    schoolName: 'Lycée Moderne',
    moyenne: 15.5,
    statut: 'ACTIF',
    tauxPresence: 92,
  },
  {
    id: '2',
    nom: 'MOUKOKO',
    prenoms: 'Marie Claire',
    classe: '5ème B',
    matricule: 'CSJ-2025-042',
    schoolName: 'Collège Saint Joseph',
    moyenne: 17.2,
    statut: 'ACTIF',
    tauxPresence: 88,
  },
  {
    id: '3',
    nom: 'MOUKOKO',
    prenoms: 'David',
    classe: '1ère C',
    matricule: 'LMB-2025-089',
    schoolName: 'Lycée Moderne',
    moyenne: 12.8,
    statut: 'SUSPENDU',
    tauxPresence: 65,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const getStatutConfig = (statut: string) => {
  switch (statut) {
    case 'ACTIF':
      return { label: 'Actif', color: C.green, bg: C.greenBg, icon: '✅' };
    case 'INACTIF':
      return { label: 'Inactif', color: C.textMuted, bg: C.textDim + '30', icon: '⏸️' };
    case 'SUSPENDU':
      return { label: 'Suspendu', color: C.amber, bg: C.amberBg, icon: '⚠️' };
    default:
      return { label: statut, color: C.red, bg: C.redBg, icon: '❌' };
  }
};

const getGradeColor = (note: number) => {
  if (note >= 16) return C.green;
  if (note >= 14) return C.blue;
  if (note >= 12) return C.accent;
  if (note >= 10) return C.amber;
  return C.red;
};

// ─── Child Card ─────────────────────────────────────────────────────────────
const ChildCard = ({ child, index }: { child: Child; index: number }) => {
  const statutConfig = getStatutConfig(child.statut);
  const fullName = `${child.prenoms} ${child.nom}`;
  const gradeColor = child.moyenne !== undefined ? getGradeColor(child.moyenne) : C.textMuted;
  const isActive = child.statut === 'ACTIF';

  // Animation
  const translateY = useRef(new Animated.Value(15)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 25,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: opacity,
        transform: [{ translateY: translateY }],
        marginBottom: 16,
      }}
    >
      <Card
        variant="default"
        padding="md"
        glow={isActive}
        borderGlow={isActive}
      >
        {/* Bandeau supérieur */}
        <LinearGradient
          colors={[isActive ? C.green + '60' : statutConfig.color + '40', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2.5,
          }}
        />

        {/* Contenu principal */}
        <View style={{ paddingTop: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Avatar */}
            <Avatar
              source={child.photo}
              name={fullName}
              size="lg"
              gradient
              ring={isActive}
              ringColor={isActive ? C.green : C.textMuted}
            />

            <View style={{ flex: 1, marginLeft: 12 }}>
              {/* Nom et statut */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: '700',
                    color: isActive ? C.textPrimary : C.textMuted,
                  }}
                  numberOfLines={1}
                >
                  {fullName}
                </Text>
                <Badge
                  text={`${statutConfig.icon} ${statutConfig.label}`}
                  variant={child.statut === 'ACTIF' ? 'success' : child.statut === 'SUSPENDU' ? 'warning' : 'default'}
                  size="sm"
                />
              </View>

              {/* Classe et école */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <Text style={{ fontSize: 14, color: C.textSecondary }}>
                  {child.classe}
                </Text>
                <View
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: C.textMuted,
                  }}
                />
                <Text style={{ fontSize: 12, color: C.textMuted }}>
                  {child.schoolName}
                </Text>
              </View>

              {/* Matricule */}
              <Text style={{ fontSize: 12, marginTop: 2, color: C.textDim }}>
                Matricule: {child.matricule}
              </Text>
            </View>

            {/* Moyenne */}
            {child.moyenne !== undefined && (
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: gradeColor + '12',
                  borderWidth: 1.5,
                  borderColor: gradeColor + '30',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: gradeColor,
                    letterSpacing: -0.5,
                  }}
                >
                  {child.moyenne.toFixed(1)}
                </Text>
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: '600',
                    color: gradeColor + '80',
                  }}
                >
                  /20
                </Text>
              </View>
            )}
          </View>

          {/* Statistiques */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 14,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}
          >
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="users" size={12} color={C.textMuted} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>
                  {child.tauxPresence || 0}%
                </Text>
              </View>
              <Text style={{ fontSize: 9, marginTop: 2, color: C.textMuted }}>
                Présence
              </Text>
            </View>

            <View
              style={{
                width: 1,
                height: 24,
                backgroundColor: C.border,
              }}
            />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="book" size={12} color={C.textMuted} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>
                  12
                </Text>
              </View>
              <Text style={{ fontSize: 9, marginTop: 2, color: C.textMuted }}>
                Matières
              </Text>
            </View>

            <View
              style={{
                width: 1,
                height: 24,
                backgroundColor: C.border,
              }}
            />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="calendar" size={12} color={C.textMuted} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>
                  5
                </Text>
              </View>
              <Text style={{ fontSize: 9, marginTop: 2, color: C.textMuted }}>
                Évaluations
              </Text>
            </View>
          </View>

          {/* Actions rapides */}
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              marginTop: 12,
            }}
          >
            {[
              { label: 'Notes', icon: 'book-open', color: C.accent },
              { label: 'Emploi du temps', icon: 'calendar', color: C.blue },
              { label: 'Présences', icon: 'check-circle', color: C.green },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: C.surfaceAlt,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <Feather name={action.icon as any} size={13} color={action.color} />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '500',
                    color: action.color,
                  }}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

// ─── Header ─────────────────────────────────────────────────────────────────
const Header = ({ children, count }: { children: string; count: number }) => {
  const { user } = useAuth();
  const initials = `${user?.prenoms?.[0] ?? ''}${user?.nom?.[0] ?? ''}`.toUpperCase();

  return (
    <View
      style={{
        backgroundColor: C.surface,
        paddingTop: 56,
        paddingBottom: 28,
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
          bottom: -30,
          left: -20,
          width: 140,
          height: 140,
          backgroundColor: 'rgba(52,211,153,0.04)',
          borderRadius: 70,
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
        {children}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <Text style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.2 }}>
          {count} enfant{count > 1 ? 's' : ''} inscrit{count > 1 ? 's' : ''}
        </Text>
        {count > 0 && (
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: C.green,
            }}
          />
        )}
      </View>
    </View>
  );
};

// ─── Screen ─────────────────────────────────────────────────────────────────
export const ChildrenListScreen: React.FC = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState(MOCK_CHILDREN);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) return <LoadingSpinner fullScreen />;

  const activeCount = children.filter(c => c.statut === 'ACTIF').length;

  if (children.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <Header children="Mes enfants" count={0} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            title="Aucun enfant"
            description="Vous n'avez pas encore d'enfant inscrit dans l'application"
            icon="users"
            actionLabel="Ajouter un enfant"
            onAction={() => {}}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <ChildCard child={item} index={index} />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        ListHeaderComponent={() => (
          <Header children="Mes enfants" count={children.length} />
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: C.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: C.border,
              borderStyle: 'dashed',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginTop: 8,
            }}
          >
            <Feather name="plus" size={18} color={C.accentDim} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: C.accentDim,
                letterSpacing: 0.2,
              }}
            >
              Ajouter un enfant
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};