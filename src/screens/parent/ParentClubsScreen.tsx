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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';

// ─── GRADIENTS TYPES ──────────────────────────────────────────────────────
const GRADIENT_BRAND: [string, string] = ['#F97316', '#8B5CF6'];

// ─── TYPES ──────────────────────────────────────────────────────────────────
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

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const MOCK_CLUBS: Club[] = [
  {
    id: '1',
    nom: 'Club Informatique',
    description: 'Découverte du code, de la robotique et des nouvelles technologies',
    couleur: '#F97316',
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
    couleur: '#8B5CF6',
    nbMembres: 78,
    isMember: false,
    prochainEvent: 'Tournoi interclasses - 15 Nov 2025',
    categories: ['Sport', 'Compétition'],
  },
  {
    id: '3',
    nom: 'Club Culturel',
    description: 'Théâtre, danse, musique et arts plastiques',
    couleur: '#F5A623',
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

// ─── HELPERS ──────────────────────────────────────────────────────────────
const getRoleConfig = (role: string | undefined, colors: any) => {
  switch (role) {
    case 'Responsable':
      return { label: 'Responsable', color: colors.warning, bg: `${colors.warning}15` };
    case 'Encadrant':
      return { label: 'Encadrant', color: colors.info, bg: `${colors.info}15` };
    default:
      return { label: 'Membre', color: colors.secondary, bg: `${colors.secondary}15` };
  }
};

// ─── CLUB CARD ──────────────────────────────────────────────────────────────
const ClubCard = ({
  club,
  onJoin,
  index,
  colors,
  isDark,
}: {
  club: Club;
  onJoin: (club: Club) => void;
  index: number;
  colors: any;
  isDark: boolean;
}) => {
  const roleConfig = getRoleConfig(club.role, colors);
  const isMember = club.isMember || false;
  const shadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)';

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
        marginBottom: 12,
      }}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.2 : 0.04,
          shadowRadius: 8,
          elevation: isDark ? 2 : 1,
          padding: 16,
        }}
      >
        {/* En-tête */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: club.couleur + '12',
            }}
          >
            <Feather name="users" size={20} color={club.couleur} />
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.text,
                }}
                numberOfLines={1}
              >
                {club.nom}
              </Text>
              {isMember && (
                <View
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    backgroundColor: roleConfig.bg,
                  }}
                >
                  <Text style={{ fontSize: 8, fontWeight: '600', color: roleConfig.color }}>
                    {roleConfig.label}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Feather name="users" size={11} color={colors.textMuted} />
              <Text style={{ fontSize: 11, color: colors.textMuted }}>
                {club.nbMembres} membres
              </Text>
              {club.categories && club.categories.length > 0 && (
                <>
                  <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: colors.textMuted }} />
                  <Text style={{ fontSize: 11, color: colors.textMuted }}>
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
                backgroundColor: colors.success + '12',
                borderWidth: 1,
                borderColor: colors.success + '30',
              }}
            >
              <Text style={{ fontSize: 8, fontWeight: '600', color: colors.success }}>
                Inscrit
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text
          style={{
            fontSize: 13,
            lineHeight: 18,
            marginTop: 10,
            color: colors.textSecondary,
            paddingLeft: 56,
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
              marginTop: 12,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: colors.surfaceElevated,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor: colors.primary + '12',
              }}
            >
              <Feather name="calendar" size={12} color={colors.primary} />
            </View>
            <Text
              style={{
                flex: 1,
                fontSize: 11,
                fontWeight: '500',
                color: colors.textSecondary,
              }}
              numberOfLines={1}
            >
              {club.prochainEvent}
            </Text>
            <Feather name="chevron-right" size={14} color={colors.textMuted} />
          </View>
        )}

        {/* Séparateur */}
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          {isMember ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: colors.surfaceElevated,
              }}
            >
              <Feather name="check-circle" size={14} color={colors.success} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: colors.success }}>
                Déjà membre
              </Text>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>
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
                gap: 6,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: colors.primary,
              }}
            >
              <Feather name="user-plus" size={15} color="#FFFFFF" />
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFFFFF' }}>
                Inscrire mon enfant
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// ─── SCREEN PRINCIPAL ──────────────────────────────────────────────────────
export const ParentClubsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
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
              '✅ Inscription réussie',
              `Votre enfant a été inscrit au ${club.nom}`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const memberCount = clubs.filter(c => c.isMember).length;
  const initials = 'JD';

  if (clubs.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={GRADIENT_BRAND}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 56,
            paddingBottom: 24,
            paddingHorizontal: 22,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            width: '100%',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 10, marginRight: 12 }}
              >
                <Feather name="arrow-left" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#FFFFFF' }}>Z</Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 2.5, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>
                  ZENITH
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 10 }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>{initials}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 }}>
            Clubs
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
            Aucun club disponible
          </Text>
        </LinearGradient>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
          <View style={{ alignItems: 'center', paddingVertical: 50 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary + '12', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Feather name="users" size={24} color={colors.primary} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 }}>
              Aucun club
            </Text>
            <Text style={{ fontSize: 12, color: colors.textMuted, textAlign: 'center' }}>
              Aucun club n'est actuellement disponible
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ClubCard
            club={item}
            onJoin={handleJoinClub}
            index={index}
            colors={colors}
            isDark={isDark}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={() => (
          <LinearGradient
            colors={GRADIENT_BRAND}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingTop: 56,
              paddingBottom: 24,
              paddingHorizontal: 22,
              borderBottomLeftRadius: 28,
              borderBottomRightRadius: 28,
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 10, marginRight: 12 }}
                >
                  <Feather name="arrow-left" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#FFFFFF' }}>Z</Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 2.5, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>
                    ZENITH
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 10 }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>{initials}</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 22, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 }}>
              Clubs
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                {clubs.length} club{clubs.length > 1 ? 's' : ''} disponible{clubs.length > 1 ? 's' : ''}
              </Text>
              {memberCount > 0 && (
                <>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    {memberCount} rejoint{memberCount > 1 ? 's' : ''}
                  </Text>
                </>
              )}
            </View>
          </LinearGradient>
        )}
        ListFooterComponent={() => (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 }}>
            <Feather name="info" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 10, color: colors.textMuted }}>
              {memberCount} club{memberCount > 1 ? 's' : ''} rejoint{memberCount > 1 ? 's' : ''}
              {memberCount > 0 && ` · ${clubs.length - memberCount} disponible${clubs.length - memberCount > 1 ? 's' : ''}`}
            </Text>
          </View>
        )}
      />
    </View>
  );
};