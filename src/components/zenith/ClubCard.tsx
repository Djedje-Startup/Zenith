// components/zenith/ClubCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface Club {
  id: string;
  nom: string;
  description: string;
  logo?: string;
  couleur: string;
  nbMembres: number;
  isMember?: boolean;
  role?: 'RESPONSABLE' | 'ENCADRANT' | 'MEMBRE';
  prochainEvent?: string;
  categories?: string[];
  activites?: string[];
}

interface ClubCardProps {
  club: Club;
  variant?: 'default' | 'featured' | 'compact';
  onPress?: () => void;
  onJoin?: () => void;
  onLeave?: () => void;
  onEventPress?: () => void;
  className?: string;
}

// Palette de couleurs premium
const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  borderSub: '#141720',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.08)',
  accentBgStrong: 'rgba(99,102,241,0.15)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.08)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.08)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.08)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.08)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.08)',
  pink: '#F472B6',
  pinkBg: 'rgba(244,114,182,0.08)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

const { width: screenWidth } = Dimensions.get('window');

// Configuration des rôles
const ROLE_CONFIG = {
  RESPONSABLE: {
    label: 'Responsable',
    color: C.amber,
    bg: C.amberBg,
    icon: '👑',
    variant: 'warning' as const,
  },
  ENCADRANT: {
    label: 'Encadrant',
    color: C.blue,
    bg: C.blueBg,
    icon: '🎯',
    variant: 'info' as const,
  },
  MEMBRE: {
    label: 'Membre',
    color: C.purple,
    bg: C.purpleBg,
    icon: '👤',
    variant: 'primary' as const,
  },
};

const getRoleConfig = (role?: string) => {
  if (!role) return ROLE_CONFIG.MEMBRE;
  return ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.MEMBRE;
};

// Composant pour l'avatar du club
const ClubAvatar = ({
  name,
  color,
  logo,
  size = 'md',
}: {
  name: string;
  color: string;
  logo?: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizes = {
    sm: { container: 40, icon: 18 },
    md: { container: 52, icon: 24 },
    lg: { container: 64, icon: 30 },
  };

  const sizeConfig = sizes[size];
  const initial = name.charAt(0).toUpperCase();

  if (logo) {
    return (
      <View
        style={{
          width: sizeConfig.container,
          height: sizeConfig.container,
          borderRadius: sizeConfig.container / 2,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: color + '30',
        }}
      >
        <Image
          source={{ uri: logo }}
          style={{
            width: sizeConfig.container,
            height: sizeConfig.container,
          }}
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[color, color + '80']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: sizeConfig.container,
        height: sizeConfig.container,
        borderRadius: sizeConfig.container / 2,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Feather name="users" size={sizeConfig.icon} color="#FFFFFF" />
    </LinearGradient>
  );
};

// Composant pour la bannière de catégorie
const CategoryBadge = ({ label }: { label: string }) => (
  <View
    style={{
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 12,
      backgroundColor: C.accentBg,
      borderWidth: 1,
      borderColor: C.border,
    }}
  >
    <Text style={{ fontSize: 8, fontWeight: '500', letterSpacing: 0.4, color: C.textMuted }}>
      {label}
    </Text>
  </View>
);

// Composant pour l'indicateur de statut
const StatusIndicator = ({ isMember }: { isMember: boolean }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
    <View
      style={{
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: isMember ? C.green : C.textDim,
      }}
    />
    <Text
      style={{
        fontSize: 9,
        fontWeight: '500',
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        color: isMember ? C.green : C.textDim,
      }}
    >
      {isMember ? 'Membre' : 'Non membre'}
    </Text>
  </View>
);

// Composant pour les statistiques
const StatItem = ({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
}) => (
  <View style={{ alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {icon}
      <Text style={{ fontSize: 12, fontWeight: '600', color: color || C.textPrimary }}>
        {value}
      </Text>
    </View>
    <Text style={{ fontSize: 9, fontWeight: '500', color: C.textMuted }}>
      {label}
    </Text>
  </View>
);

// Composant principal
export const ClubCard: React.FC<ClubCardProps> = ({
  club,
  variant = 'default',
  onPress,
  onJoin,
  onLeave,
  onEventPress,
  className,
}) => {
  const roleConfig = getRoleConfig(club.role);
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  const isMember = club.isMember || false;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95, translateY: 10 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <View style={{ position: 'relative', overflow: 'hidden' }}>
        <Card
          variant={isFeatured ? 'elevated' : 'default'}
          padding={isCompact ? 'sm' : 'md'}
          glow={isFeatured}
          borderGlow={isFeatured}
        >
          {/* Bandeau décoratif */}
          <LinearGradient
            colors={[club.couleur + '80', club.couleur + '10']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: isCompact ? 2 : 3,
            }}
          />

          {/* Fond avec effet glass pour le featured */}
          {isFeatured && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: club.couleur + '04',
                borderRadius: 16,
              }}
            />
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={!onPress}
            style={isCompact ? { paddingVertical: 4 } : {}}
          >
            <View style={{ position: 'relative' }}>
              {/* En-tête */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <ClubAvatar
                  name={club.nom}
                  color={club.couleur}
                  logo={club.logo}
                  size={isCompact ? 'sm' : 'md'}
                />

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text
                      style={{
                        fontSize: isCompact ? 14 : 16,
                        fontWeight: '700',
                        color: C.textPrimary,
                      }}
                      numberOfLines={1}
                    >
                      {club.nom}
                    </Text>
                    {isFeatured && (
                      <View style={{ marginLeft: 4 }}>
                        <Badge
                          text="En vedette"
                          variant="primary"
                          size="sm"
                          glow
                        />
                      </View>
                    )}
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                    <StatusIndicator isMember={isMember} />
                    <View style={{ width: 1, height: 10, backgroundColor: C.border }} />
                    <StatItem
                      icon={<Feather name="users" size={10} color={C.textMuted} />}
                      value={club.nbMembres}
                      label="membres"
                    />
                    {isMember && (
                      <>
                        <View style={{ width: 1, height: 10, backgroundColor: C.border }} />
                        <Badge
                          text={roleConfig.label}
                          variant={roleConfig.variant}
                          size="sm"
                          icon={<Text>{roleConfig.icon}</Text>}
                        />
                      </>
                    )}
                  </View>
                </View>

                {!isCompact && (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      onPress?.();
                    }}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      backgroundColor: C.surfaceAlt,
                    }}
                  >
                    <Feather name="chevron-right" size={16} color={C.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Description */}
              {!isCompact && (
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 16,
                    marginBottom: 12,
                    color: C.textSecondary,
                  }}
                  numberOfLines={isFeatured ? 3 : 2}
                >
                  {club.description}
                </Text>
              )}

              {/* Catégories */}
              {club.categories && club.categories.length > 0 && !isCompact && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {club.categories.slice(0, 3).map((category) => (
                    <CategoryBadge key={category} label={category} />
                  ))}
                  {club.categories.length > 3 && (
                    <CategoryBadge label={`+${club.categories.length - 3}`} />
                  )}
                </View>
              )}

              {/* Prochain événement */}
              {club.prochainEvent && !isCompact && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onEventPress}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 12,
                    padding: 10,
                    borderRadius: 12,
                    backgroundColor: C.surfaceAlt,
                    borderWidth: 1,
                    borderColor: C.border,
                  }}
                >
                  <View
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      backgroundColor: C.accentBg,
                    }}
                  >
                    <Feather name="calendar" size={14} color={C.accentDim} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '500', flex: 1, color: C.textSecondary }}>
                    {club.prochainEvent}
                  </Text>
                  <Feather name="chevron-right" size={14} color={C.textMuted} />
                </TouchableOpacity>
              )}

              {/* Boutons d'action */}
              {!isCompact && (
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                  {isMember ? (
                    <>
                      <View style={{ flex: 1 }}>
                        <Button
                          title="Voir le club"
                          variant="secondary"
                          size="sm"
                          onPress={onPress || (() => {})}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button
                          title="Quitter"
                          variant="danger"
                          size="sm"
                          onPress={onLeave || (() => {})}
                        />
                      </View>
                    </>
                  ) : (
                    <Button
                      title="Rejoindre le club"
                      variant="gradient"
                      size="md"
                      onPress={onJoin || (() => {})}
                      fullWidth
                      icon={<Feather name="user-plus" size={16} color="#FFFFFF" />}
                    />
                  )}
                </View>
              )}

              {/* Version compacte */}
              {isCompact && isMember && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 8,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: C.border,
                  }}
                >
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Feather name="calendar" size={12} color={C.textMuted} />
                    <Text style={{ fontSize: 10, color: C.textMuted }}>
                      {club.prochainEvent || 'Aucun événement'}
                    </Text>
                  </View>
                  <Badge
                    text={roleConfig.label}
                    variant={roleConfig.variant}
                    size="sm"
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Card>
      </View>
    </MotiView>
  );
};

// Composant pour une liste de clubs
export const ClubList: React.FC<{
  clubs: Club[];
  onPressClub?: (club: Club) => void;
  onJoinClub?: (club: Club) => void;
  onLeaveClub?: (club: Club) => void;
  variant?: 'default' | 'featured' | 'compact';
}> = ({
  clubs,
  onPressClub,
  onJoinClub,
  onLeaveClub,
  variant = 'default',
}) => {
  return (
    <View style={{ gap: 12 }}>
      {clubs.map((club, index) => (
        <ClubCard
          key={club.id}
          club={club}
          variant={variant}
          onPress={() => onPressClub?.(club)}
          onJoin={() => onJoinClub?.(club)}
          onLeave={() => onLeaveClub?.(club)}
        />
      ))}
    </View>
  );
};