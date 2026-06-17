// components/zenith/SchoolSelector.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  TextInput,
} from 'react-native';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface School {
  id: string;
  nom: string;
  logo?: string;
  ville: string;
  statut: 'ACTIF' | 'INACTIF';
  type?: 'PUBLIC' | 'PRIVE' | 'CONVENTIONNE';
  code?: string;
}

interface SchoolSelectorProps {
  schools: School[];
  selectedSchool: School | null;
  onSelectSchool: (school: School) => void;
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

// Composant pour l'avatar de l'école
const SchoolAvatar = ({
  name,
  logo,
  size = 'md',
  active = true,
}: {
  name: string;
  logo?: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}) => {
  const sizes = {
    sm: { container: 36, fontSize: 11, icon: 16 },
    md: { container: 44, fontSize: 14, icon: 20 },
    lg: { container: 52, fontSize: 16, icon: 24 },
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
          borderWidth: 1,
          borderColor: active ? 'rgba(99,102,241,0.15)' : C.border,
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
      colors={active ? ['#6366F1', '#8B5CF6'] : ['#2E3245', '#4A5060']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: sizeConfig.container,
        height: sizeConfig.container,
        borderRadius: sizeConfig.container / 2,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: active ? 1 : 0.6,
      }}
    >
      <Text
        style={{
          fontWeight: '700',
          fontSize: sizeConfig.fontSize,
          color: '#FFFFFF',
          letterSpacing: 0.5,
        }}
      >
        {initial}
      </Text>
    </LinearGradient>
  );
};

// Composant pour le statut de l'école
const SchoolStatus = ({ statut }: { statut: 'ACTIF' | 'INACTIF' }) => {
  const isActive = statut === 'ACTIF';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: isActive ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
        borderWidth: 1,
        borderColor: isActive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
      }}
    >
      <View
        style={{
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: isActive ? C.green : C.red,
        }}
      />
      <Text
        style={{
          fontSize: 9,
          fontWeight: '600',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          color: isActive ? C.green : C.red,
        }}
      >
        {isActive ? 'Actif' : 'Inactif'}
      </Text>
    </View>
  );
};

// Composant pour le type d'école
const SchoolTypeBadge = ({ type }: { type?: string }) => {
  if (!type) return null;

  const typeConfig = {
    PUBLIC: { label: 'Public', color: C.blue, bg: C.blueBg },
    PRIVE: { label: 'Privé', color: C.purple, bg: C.purpleBg },
    CONVENTIONNE: { label: 'Conventionné', color: C.amber, bg: C.amberBg },
  };

  const config = typeConfig[type as keyof typeof typeConfig];
  if (!config) return null;

  return (
    <View
      style={{
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: config.bg,
      }}
    >
      <Text
        style={{
          fontSize: 9,
          fontWeight: '500',
          letterSpacing: 0.4,
          color: config.color,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
};

// Composant pour un élément de la liste
const SchoolItem = ({
  school,
  isSelected,
  onPress,
  index,
}: {
  school: School;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}) => {
  const isActive = school.statut === 'ACTIF';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 50 }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={!isActive}
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
            opacity: isActive ? 1 : 0.5,
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

          <SchoolAvatar
            name={school.nom}
            logo={school.logo}
            size="md"
            active={isActive}
          />

          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: isActive ? C.textPrimary : C.textMuted,
                }}
              >
                {school.nom}
              </Text>
              <SchoolTypeBadge type={school.type} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="map-pin" size={11} color={C.textMuted} />
                <Text style={{ fontSize: 12, color: C.textMuted }}>
                  {school.ville}
                </Text>
              </View>

              {school.code && (
                <>
                  <View
                    style={{
                      width: 2,
                      height: 2,
                      borderRadius: 1,
                      backgroundColor: C.textMuted,
                    }}
                  />
                  <Text style={{ fontSize: 12, color: C.textDim }}>
                    {school.code}
                  </Text>
                </>
              )}
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <SchoolStatus statut={school.statut} />
            {isSelected && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: C.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="check" size={12} color="#FFFFFF" />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

// Composant principal
export const SchoolSelector: React.FC<SchoolSelectorProps> = ({
  schools,
  selectedSchool,
  onSelectSchool,
  label = "Établissement",
  placeholder = "Sélectionner un établissement",
  className,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSelect = (school: School) => {
    if (school.statut === 'INACTIF') return;
    onSelectSchool(school);
    setModalVisible(false);
  };

  const filteredSchools = schools.filter((school) =>
    school.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.ville.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSchools = filteredSchools.filter((s) => s.statut === 'ACTIF');
  const inactiveSchools = filteredSchools.filter((s) => s.statut === 'INACTIF');
  const sortedSchools = [...activeSchools, ...inactiveSchools];

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
            borderColor: selectedSchool ? 'rgba(99,102,241,0.15)' : C.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            {selectedSchool ? (
              <>
                <SchoolAvatar
                  name={selectedSchool.nom}
                  logo={selectedSchool.logo}
                  size="sm"
                  active={selectedSchool.statut === 'ACTIF'}
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
                    {selectedSchool.nom}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Text style={{ fontSize: 12, color: C.textMuted }}>
                      {selectedSchool.ville}
                    </Text>
                    {selectedSchool.statut === 'ACTIF' && (
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
              </>
            ) : (
              <Text style={{ fontSize: 14, color: C.textMuted }}>
                {placeholder}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {selectedSchool && selectedSchool.statut === 'ACTIF' && (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  backgroundColor: C.accentBg,
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: '600', color: C.accentDim }}>
                  ACTIF
                </Text>
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
                  {schools.filter((s) => s.statut === 'ACTIF').length} établissements actifs
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
                placeholder="Rechercher..."
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

            {/* Liste des écoles */}
            <FlatList
              ref={flatListRef}
              data={sortedSchools}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: 24,
              }}
              renderItem={({ item, index }) => (
                <SchoolItem
                  school={item}
                  isSelected={selectedSchool?.id === item.id}
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
                    Aucun établissement trouvé
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