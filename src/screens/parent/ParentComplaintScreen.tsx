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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
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
interface Category {
  value: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { value: 'PEDAGOGIE', label: 'Pédagogie', icon: 'book-open', color: C.blue, bg: C.blueBg },
  { value: 'ADMINISTRATION', label: 'Administration', icon: 'briefcase', color: C.purple, bg: C.purpleBg },
  { value: 'FINANCE', label: 'Finance', icon: 'credit-card', color: C.amber, bg: C.amberBg },
  { value: 'COMPORTEMENT', label: 'Comportement', icon: 'users', color: C.pink, bg: C.pinkBg },
  { value: 'TECHNIQUE', label: 'Technique', icon: 'cpu', color: C.green, bg: C.greenBg },
  { value: 'AUTRE', label: 'Autre', icon: 'more-horizontal', color: C.textMuted, bg: C.surfaceAlt },
];

// ─── Category Chip ──────────────────────────────────────────────────────────
const CategoryChip = ({
  category,
  isSelected,
  onPress,
}: {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={{
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: isSelected ? category.color : C.surfaceAlt,
      borderWidth: 1,
      borderColor: isSelected ? category.color : C.border,
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
        color: isSelected ? '#FFFFFF' : C.textSecondary,
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

// ─── Step Indicator ─────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={{
            width: 24,
            height: 4,
            borderRadius: 2,
            backgroundColor: step <= currentStep ? C.accent : C.border,
          }}
        />
      ))}
    </View>
    <Text style={{ fontSize: 10, color: C.textMuted, marginLeft: 4 }}>
      Étape {currentStep}/3
    </Text>
  </View>
);

// ─── Success State ──────────────────────────────────────────────────────────
const SuccessState = ({ onReset }: { onReset: () => void }) => {
  // Animation
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
          backgroundColor: C.greenBg,
          borderWidth: 2,
          borderColor: C.green + '30',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Feather name="check" size={36} color={C.green} />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: C.textPrimary,
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
          color: C.textMuted,
        }}
      >
        Votre réclamation a été transmise avec succès. Vous serez notifié dès qu'elle sera traitée.
      </Text>
      <View style={{ marginTop: 24 }}>
        <Button
          title="Nouvelle réclamation"
          variant="secondary"
          size="md"
          onPress={onReset}
          icon={<Feather name="plus" size={16} color={C.accentDim} />}
        />
      </View>
    </Animated.View>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────
const Header = ({ children }: { children: string }) => {
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
      <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 4, letterSpacing: 0.2 }}>
        Nous vous répondrons dans les plus brefs délais
      </Text>
    </View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────
export const ParentComplaintScreen: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('AUTRE');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Animation du formulaire
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

  if (!user) return <LoadingSpinner fullScreen />;

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
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <Header children="Nouvelle réclamation" />
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <SuccessState onReset={handleReset} />
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: C.bg }}
    >
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <Header children="Nouvelle réclamation" />

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Indicateur d'étape */}
        <StepIndicator currentStep={currentStep} />

        <Animated.View
          style={{
            opacity: formOpacity,
            transform: [{ translateY: formTranslateY }],
          }}
        >
          {/* ─── Catégorie ─── */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: C.textSecondary,
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
              />
            ))}
          </ScrollView>

          {/* ─── Formulaire ─── */}
          <Card variant="default" padding="md" style={{ marginBottom: 24 }}>
            <Input
              label="Titre"
              placeholder="Ex: Problème de connexion à la plateforme"
              value={title}
              onChangeText={setTitle}
              leftIcon={<Feather name="edit-2" size={16} color={C.textMuted} />}
              required
            />

            <Input
              label="Description"
              placeholder="Décrivez votre problème en détail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              leftIcon={<Feather name="file-text" size={16} color={C.textMuted} />}
              required
              helper="Minimum 20 caractères"
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
                backgroundColor: C.surfaceAlt,
                borderWidth: 1,
                borderColor: C.border,
                borderStyle: 'dashed',
                marginTop: 4,
              }}
            >
              <Feather name="paperclip" size={16} color={C.textMuted} />
              <Text style={{ fontSize: 12, color: C.textMuted }}>
                Ajouter une pièce jointe (facultatif)
              </Text>
              <View style={{ marginLeft: 'auto' }}>
                <Feather name="chevron-right" size={14} color={C.textMuted} />
              </View>
            </TouchableOpacity>
          </Card>

          {/* ─── Résumé de la catégorie ─── */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              padding: 12,
              borderRadius: 12,
              backgroundColor: selectedCategoryData.bg,
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

          {/* ─── Bouton d'envoi ─── */}
          <View style={{ marginBottom: 32 }}>
            <Button
              title={isLoading ? 'Envoi en cours...' : 'Envoyer la réclamation'}
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              variant="gradient"
              size="lg"
              fullWidth
              icon={!isLoading ? <Feather name="send" size={16} color="#FFFFFF" /> : undefined}
            />
          </View>

          {/* ─── Informations ─── */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 32,
            }}
          >
            <Feather name="info" size={12} color={C.textMuted} />
            <Text style={{ fontSize: 10, color: C.textMuted, textAlign: 'center' }}>
              Votre réclamation sera traitée sous 48h ouvrées
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};