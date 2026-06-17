// components/zenith/ChildSelector.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  Pressable,
  TextInput,
} from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export interface Child {
  id: string;
  nom: string;
  prenoms: string;
  classe: string;
  photo?: string;
  schoolId: string;
  schoolName: string;
  moyenne?: number;
  statut?: 'PRESENT' | 'ABSENT' | 'RETARD';
  progression?: number;
}

interface ChildSelectorProps {
  children: Child[];
  selectedChild: Child | null;
  onSelectChild: (child: Child) => void;
  label?: string;
  placeholder?: string;
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
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

const { height: screenHeight } = Dimensions.get('window');

// Configuration des statuts (sans emojis)
const STATUT_CONFIG = {
  PRESENT: {
    label: 'Présent',
    color: C.green,
    bg: C.greenBg,
    icon: 'check-circle',
  },
  ABSENT: {
    label: 'Absent',
    color: C.red,
    bg: C.redBg,
    icon: 'x-circle',
  },
  RETARD: {
    label: 'En retard',
    color: C.amber,
    bg: C.amberBg,
    icon: 'clock',
  },
};

const getStatutConfig = (statut?: string) => {
  if (!statut) return null;
  return STATUT_CONFIG[statut as keyof typeof STATUT_CONFIG] || null;
};

// Composant pour la moyenne
const AverageBadge = ({ moyenne }: { moyenne?: number }) => {
  if (moyenne === undefined) return null;

  const getColor = (note: number) => {
    if (note >= 15) return C.green;
    if (note >= 12) return C.blue;
    if (note >= 10) return C.amber;
    return C.red;
  };

  const color = getColor(moyenne);

  return (
    <View
      style={{
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: color + '15',
        borderWidth: 1,
        borderColor: color + '30',
      }}
    >
      <Text style={{ fontSize: 9, fontWeight: '600', color }}>
        {moyenne.toFixed(1)}/20
      </Text>
    </View>
  );
};

// Composant pour la barre de progression
const ProgressBar = ({ value }: { value?: number }) => {
  if (value === undefined) return null;

  return (
    <View
      style={{
        width: 60,
        height: 3,
        backgroundColor: C.border,
        borderRadius: 1.5,
        overflow: 'hidden',
      }}
    >
      <MotiView
        from={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ type: 'timing', duration: 600 }}
        style={{
          height: 3,
          backgroundColor: value >= 70 ? C.green : value >= 50 ? C.amber : C.red,
          borderRadius: 1.5,
        }}
      />
    </View>
  );
};

// Composant pour un élément de la liste
const ChildItem = ({
  child,
  isSelected,
  onPress,
  index,
}: {
  child: Child;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}) => {
  const statutConfig = getStatutConfig(child.statut);
  const fullName = `${child.prenoms} ${child.nom}`;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 50 }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{ position: 'relative' }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 16,
            backgroundColor: isSelected ? C.accentBg : 'transparent',
            borderWidth: isSelected ? 1 : 0,
            borderColor: isSelected ? 'rgba(99,102,241,0.20)' : 'transparent',
          }}
        >
          {/* Indicateur de sélection */}
          {isSelected && (
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: 'absolute',
                left: 0,
                top: 8,
                bottom: 8,
                width: 3,
                borderRadius: 2,
              }}
            />
          )}

          {/* Avatar */}
          <Avatar
            name={fullName}
            source={child.photo}
            size="md"
            gradient
            ring={isSelected}
            ringColor={C.accent}
            status={child.statut === 'PRESENT' ? 'online' : child.statut === 'ABSENT' ? 'busy' : 'away'}
          />

          {/* Informations */}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: C.textPrimary,
                }}
              >
                {fullName}
              </Text>
              <AverageBadge moyenne={child.moyenne} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Text style={{ fontSize: 12, color: C.textMuted }}>
                {child.classe}
              </Text>
              <View
                style={{
                  width: 2,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: C.textMuted,
                }}
              />
              <Text style={{ fontSize: 12, color: C.textMuted }}>
                {child.schoolName}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              {statutConfig && (
                <Badge
                  text={statutConfig.label}
                  variant={
                    child.statut === 'PRESENT'
                      ? 'success'
                      : child.statut === 'RETARD'
                      ? 'warning'
                      : 'error'
                  }
                  size="sm"
                  icon={<Feather name={statutConfig.icon as any} size={12} color={statutConfig.color} />}
                />
              )}
              {child.progression !== undefined && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <ProgressBar value={child.progression} />
                  <Text style={{ fontSize: 9, fontWeight: '500', color: C.textMuted }}>
                    {Math.min(child.progression, 100)}%
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Indicateur de sélection */}
          {isSelected && (
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: C.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="check" size={13} color="#FFFFFF" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

// Composant principal
export const ChildSelector: React.FC<ChildSelectorProps> = ({
  children,
  selectedChild,
  onSelectChild,
  label = "Enfant",
  placeholder = "Sélectionner un enfant",
  className,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSelect = (child: Child) => {
    onSelectChild(child);
    setModalVisible(false);
  };

  const filteredChildren = children.filter((child) => {
    const fullName = `${child.prenoms} ${child.nom}`.toLowerCase();
    const search = searchQuery.toLowerCase();
    return (
      fullName.includes(search) ||
      child.classe.toLowerCase().includes(search) ||
      child.schoolName.toLowerCase().includes(search)
    );
  });

  const fullName = selectedChild
    ? `${selectedChild.prenoms} ${selectedChild.nom}`
    : '';

  return (
    <>
      {/* Bouton de sélection */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        style={{
          position: 'relative',
          ...(className ? { /* on garde className pour compatibilité */ } : {}),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 14,
            borderRadius: 16,
            backgroundColor: C.surface,
            borderWidth: 1,
            borderColor: selectedChild ? 'rgba(99,102,241,0.15)' : C.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            {selectedChild ? (
              <>
                <Avatar
                  name={fullName}
                  source={selectedChild.photo}
                  size="sm"
                  gradient
                  ring
                  ringColor={C.accent}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: C.textPrimary,
                    }}
                    numberOfLines={1}
                  >
                    {fullName}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Text style={{ fontSize: 12, color: C.textMuted }}>
                      {selectedChild.classe}
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
                      {selectedChild.schoolName}
                    </Text>
                    {selectedChild.moyenne !== undefined && (
                      <>
                        <View
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: C.textMuted,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '600',
                            color:
                              selectedChild.moyenne >= 15
                                ? C.green
                                : selectedChild.moyenne >= 12
                                ? C.blue
                                : selectedChild.moyenne >= 10
                                ? C.amber
                                : C.red,
                          }}
                        >
                          {selectedChild.moyenne.toFixed(1)}/20
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </>
            ) : (
              <Text style={{ fontSize: 14, color: C.textMuted }}>
                {placeholder}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {selectedChild && selectedChild.statut === 'PRESENT' && (
              <View style={{ marginRight: 4 }}>
                <Badge
                  text="Présent"
                  variant="success"
                  size="sm"
                />
              </View>
            )}
            <Feather
              name={modalVisible ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={C.textMuted}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal de sélection */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
          onPress={() => setModalVisible(false)}
        >
          <MotiView
            from={{ translateY: screenHeight }}
            animate={{ translateY: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: 'hidden',
              backgroundColor: C.bg,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: C.border,
              }}
            >
              <View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary }}>
                  {label}
                </Text>
                <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                  {children.length} enfants
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  padding: 8,
                  borderRadius: 12,
                  backgroundColor: C.surfaceAlt,
                }}
              >
                <Feather name="x" size={18} color={C.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Barre de recherche */}
            <View
              style={{
                marginHorizontal: 16,
                marginTop: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: C.surfaceAlt,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Feather name="search" size={16} color={C.textMuted} />
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: C.textPrimary,
                  padding: 0,
                }}
                placeholder="Rechercher un enfant..."
                placeholderTextColor={C.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x-circle" size={16} color={C.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Liste des enfants */}
            <FlatList
              ref={flatListRef}
              data={filteredChildren}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: 24,
              }}
              renderItem={({ item, index }) => (
                <ChildItem
                  child={item}
                  isSelected={selectedChild?.id === item.id}
                  onPress={() => handleSelect(item)}
                  index={index}
                />
              )}
              ListEmptyComponent={() => (
                <MotiView
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 48,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: 'rgba(99,102,241,0.06)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name="search" size={24} color={C.textMuted} />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: C.textMuted, marginTop: 12 }}>
                    Aucun enfant trouvé
                  </Text>
                  <Text style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>
                    Essayez de modifier votre recherche
                  </Text>
                </MotiView>
              )}
            />
          </MotiView>
        </Pressable>
      </Modal>
    </>
  );
};