// screens/eleve/StudentClubDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedViewNative from '@react-native-masked-view/masked-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // ✅ Navigation
import { useTheme } from '../../theme'; // ✅ Thème centralisé

// Évite le conflit de typage JSX entre MaskedView et @types/react
const MaskedView = MaskedViewNative as unknown as React.ComponentType<any>;

// ──────────────────────────────────────────────────────────────
// IDENTITÉ ZENIT
// ──────────────────────────────────────────────────────────────
const BRAND_ORANGE = '#F97316';
const BRAND_VIOLET = '#8B5CF6';
const GRADIENT_BRAND: [string, string] = [BRAND_ORANGE, BRAND_VIOLET];

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface ClubDetail {
  id: string;
  nom: string;
  description: string;
  logo?: string;
  photo?: string;
  couleur: string;
  bureau: { id: string; nom: string; prenoms: string; role: string; photo?: string }[];
  evenements: { id: string; titre: string; date: string; lieu: string }[];
  isMember: boolean;
  nbMembres: number;
  activites?: string[];
  horaires?: string;
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────
const MOCK_CLUB_DETAIL: ClubDetail = {
  id: '1',
  nom: 'Club Informatique',
  description: 'Découverte du code, de la robotique et des nouvelles technologies. Ateliers hebdomadaires, projets collaboratifs et participation aux compétitions nationales.',
  couleur: '#F97316', // ✅ Orange Zenith
  photo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
  bureau: [
    { id: '1', nom: 'NGOMA', prenoms: 'Paul', role: 'Président', photo: 'https://i.pravatar.cc/300?img=12' },
    { id: '2', nom: 'LOUBAT', prenoms: 'Marie', role: 'Vice-présidente', photo: 'https://i.pravatar.cc/300?img=47' },
    { id: '3', nom: 'WAMBA', prenoms: 'Christ', role: 'Trésorier', photo: 'https://i.pravatar.cc/300?img=33' },
    { id: '4', nom: 'MFOUMOU', prenoms: 'Alain', role: 'Secrétaire', photo: 'https://i.pravatar.cc/300?img=15' },
  ],
  evenements: [
    { id: '1', titre: 'Hackathon Junior', date: '25 Oct 2025', lieu: 'Salle Informatique' },
    { id: '2', titre: 'Atelier Python', date: '10 Nov 2025', lieu: 'Labo Info' },
    { id: '3', titre: 'Compétition Robotique', date: '05 Déc 2025', lieu: 'Gymnase' },
  ],
  isMember: false,
  nbMembres: 45,
  activites: ['Programmation', 'Robotique', 'Intelligence Artificielle', 'Sécurité'],
  horaires: 'Mercredi 14h-17h • Samedi 9h-12h',
};

const ACTIVITE_ICON: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  Programmation: 'code',
  Robotique: 'cpu',
  'Intelligence Artificielle': 'zap',
  Sécurité: 'shield',
};

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────
const getInitials = (nom: string, prenoms: string) => `${prenoms[0]}${nom[0]}`.toUpperCase();

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 420, delay, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }}>
      {children}
    </Animated.View>
  );
};

const SectionTitle = ({ children, color }: { children: string; color: string }) => (
  <Text style={{ fontSize: 18, fontWeight: '700', color, letterSpacing: -0.4, marginBottom: 14 }}>
    {children}
  </Text>
);

// Icône Feather remplie par le dégradé orange → violet
const GradientIcon = ({ name, size }: { name: React.ComponentProps<typeof Feather>['name']; size: number }) => (
  <MaskedView
    style={{ width: size, height: size }}
    maskElement={
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
        <Feather name={name} size={size} color="#000000" />
      </View>
    }
  >
    <LinearGradient
      colors={GRADIENT_BRAND}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    />
  </MaskedView>
);

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const StudentClubDetailScreen: React.FC = () => {
  const { colors } = useTheme(); // ✅ Thème centralisé
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [club, setClub] = useState(MOCK_CLUB_DETAIL);
  const [isJoining, setIsJoining] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // ⚠️ Remplace 'StudentClubChat' par le nom réel de ton écran de discussion de groupe
  const handleWriteGroup = () => {
    navigation.navigate('StudentClubChat', { clubId: club.id, clubName: club.nom });
  };

  const handleJoin = () => {
    Alert.alert(
      'Rejoindre le club',
      `Voulez-vous rejoindre ${club.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setIsJoining(true);
            setTimeout(() => {
              setClub({ ...club, isMember: true });
              setIsJoining(false);
              Alert.alert('Succès', 'Vous avez rejoint le club avec succès');
            }, 1000);
          },
        },
      ]
    );
  };

  const handleLeave = () => {
    Alert.alert(
      'Quitter le club',
      `Voulez-vous vraiment quitter ${club.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            setClub({ ...club, isMember: false });
            Alert.alert('Info', 'Vous avez quitté le club');
          },
        },
      ]
    );
  };

  const longDescription = club.description.length > 110;

  // ─── RENDU ───
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* ─── HERO PHOTO ─── */}
        <View style={{ height: 430, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden' }}>
          <LinearGradient
            colors={GRADIENT_BRAND}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          {club.photo ? (
            <Image
              source={{ uri: club.photo }}
              resizeMode="cover"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
          ) : null}

          {/* Voile pour la lisibilité du texte */}
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(0,0,0,0.30)', 'rgba(0,0,0,0)', 'rgba(15,8,35,0.88)']}
            locations={[0, 0.4, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Retour */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            style={{
              position: 'absolute',
              top: insets.top + 10,
              left: 20,
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="arrow-left" size={20} color="#111111" />
          </TouchableOpacity>

          {/* Badge membre */}
          {club.isMember && (
            <View
              style={{
                position: 'absolute',
                top: insets.top + 16,
                right: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <Feather name="check" size={13} color={BRAND_VIOLET} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#111111', marginLeft: 6 }}>Membre</Text>
            </View>
          )}

          {/* Titre + membres */}
          <View style={{ position: 'absolute', left: 24, right: 24, bottom: 28 }}>
            <Feather name="users" size={22} color="#FFFFFF" />
            <Text
              style={{
                fontSize: 34,
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: -1,
                marginTop: 10,
                lineHeight: 40,
              }}
            >
              {club.nom}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {club.bureau.slice(0, 3).map((m, i) => (
                  <View
                    key={m.id}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginLeft: i === 0 ? 0 : -10,
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                      overflow: 'hidden',
                      backgroundColor: BRAND_VIOLET,
                    }}
                  >
                    {m.photo ? (
                      <Image source={{ uri: m.photo }} style={{ width: 26, height: 26 }} resizeMode="cover" />
                    ) : null}
                  </View>
                ))}
              </View>
              <Text style={{ fontSize: 14, color: '#FFFFFF', marginLeft: 12, fontWeight: '500' }}>
                {club.nbMembres} membres
              </Text>
            </View>
          </View>
        </View>

        {/* ─── CONTENU ─── */}
        <View style={{ paddingTop: 28 }}>

          {/* ─── Activités ─── */}
          {club.activites && club.activites.length > 0 && (
            <FadeIn delay={80}>
              <View style={{ marginBottom: 28 }}>
                <View style={{ paddingHorizontal: 22 }}>
                  <SectionTitle color={colors.text}>Activités</SectionTitle>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 22 }}
                >
                  {club.activites.map((activite, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.surface,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: colors.border,
                        paddingHorizontal: 14,
                        paddingVertical: 11,
                        marginRight: 10,
                      }}
                    >
                      <GradientIcon name={ACTIVITE_ICON[activite] || 'star'} size={17} />
                      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginLeft: 8 }}>
                        {activite}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </FadeIn>
          )}

          {/* ─── Description ─── */}
          <FadeIn delay={140}>
            <View style={{ paddingHorizontal: 22, marginBottom: 28 }}>
              <SectionTitle color={colors.text}>Description</SectionTitle>
              <Text
                numberOfLines={expanded ? undefined : 3}
                style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 23 }}
              >
                {club.description}
              </Text>
              {longDescription && (
                <TouchableOpacity
                  onPress={() => setExpanded(!expanded)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={expanded ? 'Voir moins' : 'Voir plus'}
                  style={{ marginTop: 8, alignSelf: 'flex-start' }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: BRAND_VIOLET }}>
                    {expanded ? 'Voir moins' : 'Voir plus'}
                  </Text>
                </TouchableOpacity>
              )}

              {club.horaires && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                  <Feather name="clock" size={15} color={colors.textMuted} />
                  <Text style={{ fontSize: 13, color: colors.textMuted, marginLeft: 8 }}>{club.horaires}</Text>
                </View>
              )}
            </View>
          </FadeIn>

          {/* ─── Bureau ─── */}
          {club.bureau.length > 0 && (
            <FadeIn delay={200}>
              <View style={{ marginBottom: 28 }}>
                <View style={{ paddingHorizontal: 22 }}>
                  <SectionTitle color={colors.text}>Le bureau</SectionTitle>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 22 }}
                >
                  {club.bureau.map((membre) => (
                    <View key={membre.id} style={{ width: 88, alignItems: 'center', marginRight: 12 }}>
                      <LinearGradient
                        colors={GRADIENT_BRAND}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <View
                          style={{
                            width: 70,
                            height: 70,
                            borderRadius: 35,
                            borderWidth: 3,
                            borderColor: colors.background,
                            backgroundColor: colors.surfaceElevated,
                            overflow: 'hidden',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
                            {getInitials(membre.nom, membre.prenoms)}
                          </Text>
                          {membre.photo ? (
                            <Image
                              source={{ uri: membre.photo }}
                              resizeMode="cover"
                              style={{ position: 'absolute', top: 0, left: 0, width: 64, height: 64 }}
                            />
                          ) : null}
                        </View>
                      </LinearGradient>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 10 }}
                      >
                        {membre.prenoms}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}
                      >
                        {membre.role}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </FadeIn>
          )}

          {/* ─── Événements ─── */}
          {club.evenements.length > 0 && (
            <FadeIn delay={260}>
              <View style={{ paddingHorizontal: 22 }}>
                <SectionTitle color={colors.text}>Événements à venir</SectionTitle>
                {club.evenements.map((event, i) => {
                  const [jour, mois] = event.date.split(' ');
                  const last = i === club.evenements.length - 1;
                  return (
                    <View
                      key={event.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 14,
                        borderBottomWidth: last ? 0 : 1,
                        borderBottomColor: colors.border,
                      }}
                    >
                      <View
                        style={{
                          width: 56,
                          height: 60,
                          borderRadius: 18,
                          backgroundColor: colors.surface,
                          borderWidth: 1,
                          borderColor: colors.border,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 14,
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, letterSpacing: -0.5 }}>
                          {jour}
                        </Text>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: BRAND_ORANGE, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                          {mois}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>{event.titre}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                          <Feather name="map-pin" size={12} color={colors.textMuted} />
                          <Text style={{ fontSize: 12, color: colors.textMuted, marginLeft: 5 }}>{event.lieu}</Text>
                        </View>
                      </View>
                      <Feather name="chevron-right" size={18} color={colors.textMuted} />
                    </View>
                  );
                })}
              </View>
            </FadeIn>
          )}
        </View>
      </ScrollView>

      {/* ─── BARRE D'ACTION ─── */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingHorizontal: 22,
          paddingTop: 14,
          paddingBottom: insets.bottom + 12,
        }}
      >
        {club.isMember ? (
          <>
            {/* Quitter le club */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLeave}
              accessibilityRole="button"
              accessibilityLabel="Quitter le club"
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                borderWidth: 1.5,
                borderColor: colors.error,
                backgroundColor: colors.background,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="log-out" size={18} color={colors.error} />
            </TouchableOpacity>

            {/* Écrire au groupe */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleWriteGroup}
              accessibilityRole="button"
              accessibilityLabel="Écrire au groupe du club"
              style={{ flex: 1, marginLeft: 12, borderRadius: 27, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={GRADIENT_BRAND}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 54,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="message-circle" size={18} color="#FFFFFF" />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 }}>
                  Écrire au groupe
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View>
              <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: -1 }}>
                {club.nbMembres}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: -2 }}>membres</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleJoin}
              disabled={isJoining}
              accessibilityRole="button"
              accessibilityLabel="Rejoindre le club"
              style={{ borderRadius: 27, overflow: 'hidden', opacity: isJoining ? 0.8 : 1 }}
            >
              <LinearGradient
                colors={GRADIENT_BRAND}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 54,
                  paddingHorizontal: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isJoining ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 }}>
                      Adhésion en cours...
                    </Text>
                  </>
                ) : (
                  <>
                    <Feather name="user-plus" size={17} color="#FFFFFF" />
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 }}>
                      Rejoindre le club
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};