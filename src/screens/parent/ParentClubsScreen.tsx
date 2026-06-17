// screens/parent/ParentClubsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/animations/EmptyState';
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
interface Club {
  id: string;
  nom: string;
  description: string;
  couleur: string;
  nbMembres: number;
  isMember?: boolean;
  role?: string;
  prochainEvent?: string;
  categories?: string[];
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_CLUBS: Club[] = [
  {
    id: '1',
    nom: 'Club Informatique',
    description: 'Découverte du code, de la robotique et des nouvelles technologies',
    couleur: '#6366F1',
    nbMembres: 45,
    isMember: true,
    role: 'Membre',
    prochainEvent: 'Hackathon Junior - 25 Oct 2025',
    categories: ['Tech', 'Robotique'],
  },
  {
    id: '2',
    nom: 'Club Sportif',
    description: 'Football, basket, athlétisme et autres activités sportives',
    couleur: '#34D399',
    nbMembres: 78,
    isMember: false,
    prochainEvent: 'Tournoi interclasses - 15 Nov 2025',
    categories: ['Sport', 'Compétition'],
  },
  {
    id: '3',
    nom: 'Club Culturel',
    description: 'Théâtre, danse, musique et arts plastiques',
    couleur: '#A78BFA',
    nbMembres: 32,
    isMember: true,
    role: 'Responsable',
    prochainEvent: 'Soirée culturelle - 08 Déc 2025',
    categories: ['Arts', 'Culture'],
  },
  {
    id: '4',
    nom: 'Club Sciences',
    description: 'Expériences scientifiques, astronomie et découvertes',
    couleur: '#60A5FA',
    nbMembres: 28,
    isMember: false,
    prochainEvent: 'Foire des sciences - 20 Nov 2025',
    categories: ['Sciences', 'Découverte'],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const getRoleConfig = (role?: string) => {
  switch (role) {
    case 'Responsable':
      return { label: 'Responsable', color: C.amber, bg: C.amberBg, icon: '👑' };
    case 'Encadrant':
      return { label: 'Encadrant', color: C.blue, bg: C.blueBg, icon: '🎯' };
    default:
      return { label: 'Membre', color: C.purple, bg: C.purpleBg, icon: '👤' };
  }
};

// ─── Club Card ──────────────────────────────────────────────────────────────
const ClubCard = ({
  club,
  onJoin,
  index,
}: {
  club: Club;
  onJoin: (club: Club) => void;
  index: number;
}) => {
  const roleConfig = getRoleConfig(club.role);
  const isMember = club.isMember || false;

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
        glow={isMember}
        borderGlow={isMember}
      >
        {/* Bandeau coloré */}
        <LinearGradient
          colors={[club.couleur + '80', club.couleur + '20']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
          }}
        />

        <View style={{ paddingTop: 4 }}>
          {/* En-tête */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: club.couleur + '15',
              }}
            >
              <Feather name="users" size={22} color={club.couleur} />
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: '700',
                    color: C.textPrimary,
                  }}
                  numberOfLines={1}
                >
                  {club.nom}
                </Text>
                {isMember && (
                  <Badge
                    text={`${roleConfig.icon} ${roleConfig.label}`}
                    variant={club.role === 'Responsable' ? 'warning' : 'primary'}
                    size="sm"
                  />
                )}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <Feather name="users" size={11} color={C.textMuted} />
                <Text style={{ fontSize: 12, color: C.textMuted }}>
                  {club.nbMembres} membres
                </Text>
                {club.categories && club.categories.length > 0 && (
                  <>
                    <View
                      style={{
                        width: 2,
                        height: 2,
                        borderRadius: 1,
                        backgroundColor: C.textMuted,
                      }}
                    />
                    <Text style={{ fontSize: 12, color: C.textMuted }}>
                      {club.categories.join(' · ')}
                    </Text>
                  </>
                )}
              </View>
            </View>

            {isMember && (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: C.greenBg,
                  borderWidth: 1,
                  borderColor: C.green + '20',
                }}
              >
                <Text style={{ fontSize: 8, fontWeight: '600', color: C.green }}>
                  INSCRIT
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text
            style={{
              fontSize: 12,
              lineHeight: 16,
              marginBottom: 12,
              color: C.textSecondary,
            }}
            numberOfLines={2}
          >
            {club.description}
          </Text>

          {/* Prochain événement */}
          {club.prochainEvent && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: C.surfaceAlt,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: C.accentBg,
                }}
              >
                <Feather name="calendar" size={14} color={C.accentDim} />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: '500',
                  color: C.textSecondary,
                }}
              >
                {club.prochainEvent}
              </Text>
              <Feather name="chevron-right" size={14} color={C.textMuted} />
            </View>
          )}

          {/* Bouton d'action */}
          {isMember ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: C.surfaceAlt,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Feather name="check-circle" size={16} color={C.green} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: C.green }}>
                Déjà membre
              </Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>
                · {club.role || 'Membre'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onJoin(club)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: C.accent,
              }}
            >
              <Feather name="user-plus" size={16} color="#FFFFFF" />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
                Inscrire mon enfant
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </Animated.View>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────
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
          {count} club{count > 1 ? 's' : ''} disponible{count > 1 ? 's' : ''}
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

// ─── Screen ──────────────────────────────────────────────────────────────────
export const ParentClubsScreen: React.FC = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState(MOCK_CLUBS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleJoinClub = (club: Club) => {
    Alert.alert(
      'Inscription au club',
      `Voulez-vous inscrire votre enfant au ${club.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setClubs(prev =>
              prev.map(c =>
                c.id === club.id ? { ...c, isMember: true, role: 'Membre' } : c
              )
            );
            Alert.alert(
              'Inscription réussie',
              `Votre enfant a été inscrit au ${club.nom}`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  if (!user) return <LoadingSpinner fullScreen />;

  if (clubs.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <Header children="Clubs et activités" count={0} />
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
          <EmptyState
            title="Aucun club disponible"
            description="Aucun club n'est actuellement disponible"
            icon="users"
          />
        </View>
      </View>
    );
  }

  const memberCount = clubs.filter(c => c.isMember).length;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ClubCard club={item} onJoin={handleJoinClub} index={index} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
        ListHeaderComponent={() => (
          <Header children="Clubs et activités" count={clubs.length} />
        )}
        ListFooterComponent={() => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 4,
              paddingVertical: 12,
            }}
          >
            <Feather name="info" size={12} color={C.textMuted} />
            <Text style={{ fontSize: 10, color: C.textMuted }}>
              {memberCount} club{memberCount > 1 ? 's' : ''} rejoint{memberCount > 1 ? 's' : ''}
              {memberCount > 0 && ` · ${clubs.length - memberCount} disponible${clubs.length - memberCount > 1 ? 's' : ''}`}
            </Text>
          </View>
        )}
      />
    </View>
  );
};