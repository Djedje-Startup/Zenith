// src/screens/eleve/StudentComplaintScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const C = {
  bg: '#0E1117',
  surface: '#12151E',
  surfaceAlt: '#161A24',
  border: '#1C2030',
  accent: '#6366F1',
  accentDim: '#818CF8',
  accentBg: 'rgba(99,102,241,0.10)',
  green: '#34D399',
  greenBg: 'rgba(16,185,129,0.09)',
  blue: '#60A5FA',
  blueBg: 'rgba(96,165,250,0.09)',
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

const CATEGORIES = [
  { id: 'pedagogie', label: 'Pédagogie', icon: 'book-open', color: C.blue },
  { id: 'administration', label: 'Administration', icon: 'briefcase', color: C.purple },
  { id: 'finance', label: 'Finance', icon: 'credit-card', color: C.amber },
  { id: 'comportement', label: 'Comportement', icon: 'users', color: C.red },
  { id: 'technique', label: 'Technique', icon: 'cpu', color: C.green },
  { id: 'autre', label: 'Autre', icon: 'more-horizontal', color: C.textMuted },
];

export const StudentComplaintScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSubmit = () => {
    if (!selectedCategory || !title.trim() || !description.trim()) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs');
      return;
    }
    Alert.alert('Réclamation envoyée', 'Votre réclamation a été transmise avec succès');
  };

  return (
    <Layout variant="default">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['#1E1B4B', '#312E81', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 56,
            paddingBottom: 24,
            paddingHorizontal: 22,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <Text style={{
            fontSize: 12,
            fontWeight: '700',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}>
            Élève
          </Text>
          <Text style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#FFFFFF',
            marginTop: 2,
            letterSpacing: -0.5,
          }}>
            Réclamation
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 40 }}>
          {/* Catégories */}
          <Text style={{
            fontSize: 12,
            fontWeight: '700',
            color: C.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            marginBottom: 12,
          }}>
            Catégorie
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: isSelected ? cat.color : C.surfaceAlt,
                    borderWidth: 1,
                    borderColor: isSelected ? cat.color : C.border,
                    gap: 6,
                  }}
                >
                  <Feather name={cat.icon as any} size={14} color={isSelected ? '#FFFFFF' : cat.color} />
                  <Text style={{
                    fontSize: 12,
                    fontWeight: isSelected ? '700' : '600',
                    color: isSelected ? '#FFFFFF' : C.textSecondary,
                  }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Formulaire */}
          <Card variant="default" padding="md">
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: C.textMuted,
                marginBottom: 6,
              }}>
                Titre
              </Text>
              <TextInput
                style={{
                  backgroundColor: C.surfaceAlt,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: C.border,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: C.textPrimary,
                }}
                placeholder="Résumé de la réclamation"
                placeholderTextColor={C.textDim}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: C.textMuted,
                marginBottom: 6,
              }}>
                Description
              </Text>
              <TextInput
                style={{
                  backgroundColor: C.surfaceAlt,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: C.border,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: C.textPrimary,
                  minHeight: 120,
                  textAlignVertical: 'top',
                }}
                placeholder="Décrivez votre problème en détail..."
                placeholderTextColor={C.textDim}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
              />
            </View>

            <Button
              title="Envoyer la réclamation"
              onPress={handleSubmit}
              variant="gradient"
              size="lg"
              fullWidth
              icon={<Feather name="send" size={18} color="#FFFFFF" />}
            />
          </Card>
        </View>
      </ScrollView>
    </Layout>
  );
};