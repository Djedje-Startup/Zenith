// screens/parent/ParentComplaintScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme, COLORS } from '../../theme';

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface Category {
  value: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { value: 'PEDAGOGIE', label: 'Pédagogie', icon: 'book-open', color: '#60A5FA' },
  { value: 'ADMINISTRATION', label: 'Administration', icon: 'briefcase', color: '#A78BFA' },
  { value: 'FINANCE', label: 'Finance', icon: 'credit-card', color: '#FBBF24' },
  { value: 'COMPORTEMENT', label: 'Comportement', icon: 'users', color: '#F472B6' },
  { value: 'TECHNIQUE', label: 'Technique', icon: 'cpu', color: '#34D399' },
  { value: 'AUTRE', label: 'Autre', icon: 'more-horizontal', color: '#6B7280' },
];

// ─── COMPOSANTS ──────────────────────────────────────────────────────────────
const CategoryChip = ({
  category,
  isSelected,
  onPress,
  colors,
}: {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
  colors: any;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={{
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: isSelected ? category.color : colors.surfaceElevated,
      borderWidth: 1,
      borderColor: isSelected ? category.color : colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <Feather
      name={category.icon}
      size={15}
      color={isSelected ? '#FFFFFF' : category.color}
    />
    <Text
      style={{
        fontSize: 11,
        fontWeight: isSelected ? '700' : '600',
        color: isSelected ? '#FFFFFF' : colors.textSecondary,
        letterSpacing: 0.2,
      }}
    >
      {category.label}
    </Text>
    {isSelected && (
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: 'rgba(255,255,255,0.5)',
        }}
      />
    )}
  </TouchableOpacity>
);

// ─── STEP INDICATOR ─────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep, colors }: { currentStep: number; colors: any }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={{
            width: 24,
            height: 4,
            borderRadius: 2,
            backgroundColor: step <= currentStep ? colors.primary : colors.border,
          }}
        />
      ))}
    </View>
    <Text style={{ fontSize: 10, color: colors.textMuted, marginLeft: 4 }}>
      Étape {currentStep}/3
    </Text>
  </View>
);

// ─── SUCCESS STATE ──────────────────────────────────────────────────────────
const SuccessState = ({ onReset, colors }: { onReset: () => void; colors: any }) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 25,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        transform: [{ scale }],
        opacity: opacity,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.success + '20',
          borderWidth: 2,
          borderColor: colors.success + '30',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Feather name="check" size={36} color={colors.success} />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
          letterSpacing: -0.3,
        }}
      >
        Réclamation envoyée !
      </Text>
      <Text
        style={{
          fontSize: 14,
          textAlign: 'center',
          marginTop: 8,
          maxWidth: 280,
          color: colors.textMuted,
        }}
      >
        Votre réclamation a été transmise avec succès. Vous serez notifié dès qu'elle sera traitée.
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 24,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
        onPress={onReset}
      >
        <Feather name="plus" size={16} color={colors.primary} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>
          Nouvelle réclamation
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── HEADER ──────────────────────────────────────────────────────────────────
const Header = ({ children, colors }: { children: string; colors: any }) => {
  const navigation = useNavigation<any>();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        paddingTop: 56,
        paddingBottom: 28,
        paddingHorizontal: 22,
        overflow: 'hidden',
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          backgroundColor: colors.primary + '12',
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
          backgroundColor: colors.secondary + '10',
          borderRadius: 70,
        }}
      />

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
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="arrow-left" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <LinearGradient
              colors={colors.gradientBrand}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#FFFFFF' }}>Z</Text>
            </LinearGradient>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 2.5,
                color: colors.primary,
                textTransform: 'uppercase',
              }}
            >
              ZENITH
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <LinearGradient
            colors={colors.gradientBrand}
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>JD</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: colors.text,
          letterSpacing: -0.3,
        }}
      >
        {children}
      </Text>
      <Text style={{
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 4,
        letterSpacing: 0.2,
      }}>
        Nous vous répondrons dans les plus brefs délais
      </Text>
    </View>
  );
};

// ─── INPUT COMPOSANT PERSONNALISÉ ──────────────────────────────────────────
const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  required = false,
  icon,
  helper,
  colors,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  required?: boolean;
  icon?: React.ReactNode;
  helper?: string;
  colors: any;
}) => (
  <View style={{ marginBottom: 16 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>
        {label}
      </Text>
      {required && <Text style={{ color: colors.error }}>*</Text>}
    </View>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceElevated,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
        paddingVertical: multiline ? 12 : 0,
        minHeight: 48,
      }}
    >
      {icon && <View style={{ marginRight: 10 }}>{icon}</View>}
      <TextInput
        style={{
          flex: 1,
          color: colors.text,
          fontSize: 14,
          fontFamily: 'Inter_400Regular',
          textAlignVertical: multiline ? 'top' : 'center',
          minHeight: multiline ? 80 : 48,
          paddingVertical: multiline ? 4 : 0,
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
    {helper && (
      <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>
        {helper}
      </Text>
    )}
  </View>
);

// ─── SCREEN PRINCIPAL ──────────────────────────────────────────────────────
export const ParentComplaintScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('AUTRE');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const formTranslateY = useRef(new Animated.Value(20)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(formTranslateY, {
        toValue: 0,
        damping: 25,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs pour continuer');
      return;
    }

    setIsLoading(true);
    setCurrentStep(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep(3);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setSelectedCategory('AUTRE');
    setIsSuccess(false);
    setCurrentStep(1);
  };

  const selectedCategoryData = CATEGORIES.find(c => c.value === selectedCategory) || CATEGORIES[5];

  if (isSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <Header children="Nouvelle réclamation" colors={colors} />
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <SuccessState onReset={handleReset} colors={colors} />
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <Header children="Nouvelle réclamation" colors={colors} />

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepIndicator currentStep={currentStep} colors={colors} />

        <Animated.View
          style={{
            opacity: formOpacity,
            transform: [{ translateY: formTranslateY }],
          }}
        >
          {/* Catégorie */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: colors.textSecondary,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Catégorie
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
            contentContainerStyle={{ gap: 8, paddingRight: 16 }}
          >
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.value}
                category={cat}
                isSelected={selectedCategory === cat.value}
                onPress={() => setSelectedCategory(cat.value)}
                colors={colors}
              />
            ))}
          </ScrollView>

          {/* Formulaire */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              marginBottom: 24,
              shadowColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 12,
              elevation: isDark ? 4 : 2,
            }}
          >
            <FormInput
              label="Titre"
              placeholder="Ex: Problème de connexion à la plateforme"
              value={title}
              onChangeText={setTitle}
              required
              icon={<Feather name="edit-2" size={16} color={colors.textMuted} />}
              colors={colors}
            />

            <FormInput
              label="Description"
              placeholder="Décrivez votre problème en détail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              required
              icon={<Feather name="file-text" size={16} color={colors.textMuted} />}
              helper="Minimum 20 caractères"
              colors={colors}
            />

            {/* Pièce jointe (optionnel) */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                backgroundColor: colors.surfaceElevated,
                borderWidth: 1,
                borderColor: colors.border,
                borderStyle: 'dashed',
                marginTop: 4,
              }}
            >
              <Feather name="paperclip" size={16} color={colors.textMuted} />
              <Text style={{ fontSize: 12, color: colors.textMuted }}>
                Ajouter une pièce jointe (facultatif)
              </Text>
              <View style={{ marginLeft: 'auto' }}>
                <Feather name="chevron-right" size={14} color={colors.textMuted} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Résumé de la catégorie */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              padding: 12,
              borderRadius: 12,
              backgroundColor: selectedCategoryData.color + '15',
              borderWidth: 1,
              borderColor: selectedCategoryData.color + '20',
              marginBottom: 20,
            }}
          >
            <Feather
              name={selectedCategoryData.icon}
              size={16}
              color={selectedCategoryData.color}
            />
            <Text
              style={{
                fontSize: 11,
                color: selectedCategoryData.color,
                fontWeight: '500',
              }}
            >
              Catégorie sélectionnée : {selectedCategoryData.label}
            </Text>
          </View>

          {/* Bouton d'envoi */}
          <View style={{ marginBottom: 32 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isLoading}
              style={{
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: isLoading ? colors.border : colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                      borderTopColor: 'transparent',
                    }}
                  />
                  <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>
                    Envoi en cours...
                  </Text>
                </>
              ) : (
                <>
                  <Feather name="send" size={18} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>
                    Envoyer la réclamation
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Informations */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 32,
            }}
          >
            <Feather name="info" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 10, color: colors.textMuted, textAlign: 'center' }}>
              Votre réclamation sera traitée sous 48h ouvrées
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};