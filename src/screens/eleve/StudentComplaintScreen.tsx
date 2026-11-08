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
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme'; // ✅ Thème centralisé

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

// ──────────────────────────────────────────────────────────────
// CATÉGORIES AVEC ICÔNES FEATHER
// ──────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: 'pedagogie', label: 'Pédagogie', icon: 'book-open' },
  { id: 'administration', label: 'Administration', icon: 'briefcase' },
  { id: 'finance', label: 'Finance', icon: 'credit-card' },
  { id: 'comportement', label: 'Comportement', icon: 'users' },
  { id: 'technique', label: 'Technique', icon: 'cpu' },
  { id: 'autre', label: 'Autre', icon: 'more-horizontal' },
];

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const StudentComplaintScreen: React.FC = () => {
  const { colors } = useTheme(); // ✅ Thème centralisé
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert('Champ manquant', 'Veuillez sélectionner une catégorie');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Champ manquant', 'Veuillez saisir un titre');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Champ manquant', 'Veuillez décrire votre réclamation');
      return;
    }

    Alert.alert(
      'Confirmation',
      'Voulez-vous envoyer cette réclamation ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Envoyer',
          onPress: () => {
            Alert.alert(
              'Réclamation envoyée',
              'Votre réclamation a été transmise avec succès. Vous recevrez une réponse sous 48h.'
            );
            // Réinitialisation du formulaire
            setSelectedCategory(null);
            setTitle('');
            setDescription('');
          },
        },
      ]
    );
  };

  // ─── Rendu du badge de catégorie sélectionnée ───
  const renderCategoryBadge = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return null;

    const colorMap: Record<string, string> = {
      pedagogie: colors.primary,
      administration: colors.secondary,
      finance: colors.warning,
      comportement: colors.error,
      technique: colors.success,
      autre: colors.textMuted,
    };

    const bgMap: Record<string, string> = {
      pedagogie: colors.primaryBg,
      administration: colors.secondaryBg,
      finance: colors.warning + '15',
      comportement: colors.error + '15',
      technique: colors.success + '15',
      autre: colors.surfaceElevated,
    };

    const categoryColor = colorMap[categoryId] || colors.textMuted;
    const categoryBg = bgMap[categoryId] || colors.surfaceElevated;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: categoryBg,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 6,
        borderWidth: 1,
        borderColor: categoryColor + '30',
      }}>
        <Feather name={category.icon} size={12} color={categoryColor} />
        <Text style={{
          fontSize: 11,
          fontWeight: '600',
          color: categoryColor,
        }}>
          {category.label}
        </Text>
      </View>
    );
  };

  // ─── RENDU ───
  return (
    <Layout variant="default">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* ─── HEADER AVEC DÉGRADÉ ZENITH ─── */}
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
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
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}>
                  📝 Élève
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
              </View>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
                <Feather name="clock" size={16} color="rgba(255,255,255,0.6)" />
                <Text style={{
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: 0.3,
                  marginTop: 2,
                }}>
                  Réponse sous 48h
                </Text>
              </View>
            </View>

            {/* Info supplémentaire */}
            <View style={{
              marginTop: 12,
              padding: 12,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
              <Feather name="info" size={16} color="rgba(255,255,255,0.6)" />
              <Text style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                flex: 1,
              }}>
                Vous pouvez signaler tout problème rencontré dans votre vie scolaire.
              </Text>
            </View>
          </LinearGradient>

          {/* ─── CONTENU ─── */}
          <View style={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 40 }}>

            {/* ─── CATÉGORIES ─── */}
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 12,
            }}>
              Catégorie
            </Text>

            {/* Catégorie sélectionnée affichée */}
            {selectedCategory && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 12,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Feather name="check-circle" size={18} color={colors.success} />
                  <Text style={{
                    fontSize: 13,
                    color: colors.text,
                    fontWeight: '500',
                  }}>
                    Catégorie sélectionnée :
                  </Text>
                  {renderCategoryBadge(selectedCategory)}
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategory(null)}
                >
                  <Feather name="x" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            )}

            {/* Grille des catégories */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 20,
            }}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;

                const colorMap: Record<string, string> = {
                  pedagogie: colors.primary,
                  administration: colors.secondary,
                  finance: colors.warning,
                  comportement: colors.error,
                  technique: colors.success,
                  autre: colors.textMuted,
                };

                const bgMap: Record<string, string> = {
                  pedagogie: colors.primaryBg,
                  administration: colors.secondaryBg,
                  finance: colors.warning + '15',
                  comportement: colors.error + '15',
                  technique: colors.success + '15',
                  autre: colors.surfaceElevated,
                };

                const categoryColor = colorMap[cat.id] || colors.textMuted;
                const categoryBg = bgMap[cat.id] || colors.surfaceElevated;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor: isSelected ? categoryColor : colors.surface,
                      borderWidth: 1,
                      borderColor: isSelected ? categoryColor : colors.border,
                      gap: 6,
                    }}
                  >
                    <Feather
                      name={cat.icon}
                      size={14}
                      color={isSelected ? '#FFFFFF' : categoryColor}
                    />
                    <Text style={{
                      fontSize: 12,
                      fontWeight: isSelected ? '700' : '600',
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    }}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ─── FORMULAIRE ─── */}
            <Card variant="default" padding="md">
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: colors.textMuted,
                  marginBottom: 6,
                }}>
                  Titre *
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: colors.text,
                  }}
                  placeholder="Résumé de la réclamation"
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: colors.textMuted,
                  marginBottom: 6,
                }}>
                  Description *
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: colors.text,
                    minHeight: 120,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Décrivez votre problème en détail..."
                  placeholderTextColor={colors.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={5}
                />
              </View>

              {/* Indicateur des champs obligatoires */}
              <Text style={{
                fontSize: 10,
                color: colors.textMuted,
                marginBottom: 12,
              }}>
                * Champs obligatoires
              </Text>

              <Button
                title="Envoyer la réclamation"
                onPress={handleSubmit}
                variant="gradient"
                size="lg"
                fullWidth
                icon={<Feather name="send" size={18} color="#FFFFFF" />}
              />
            </Card>

            {/* ─── INFO SUR LE TRAITEMENT ─── */}
            <View style={{
              marginTop: 16,
              padding: 14,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 10,
            }}>
              <Feather name="shield" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                  Traitement confidentiel
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  marginTop: 2,
                  lineHeight: 18,
                }}>
                  Votre réclamation sera traitée de manière confidentielle par l'administration.
                  Vous serez notifié de la réponse dans les plus brefs délais.
                </Text>
              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};