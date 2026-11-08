// src/screens/eleve/StudentLibraryScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  StatusBar,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../theme';

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────
type BookType = 'physique' | 'numerique';

interface Book {
  id: string;
  titre: string;
  auteur: string;
  categorie: string;
  type: BookType;
  disponible: boolean;
  empruntePar?: string;
  dateEmprunt?: string;
  dateRetourPrevu?: string;
  fichierUrl?: string;
  description?: string;
}

interface Emprunt {
  id: string;
  bookId: string;
  bookTitre: string;
  dateEmprunt: string;
  dateRetourPrevu: string;
  statut: 'en_cours' | 'retourne' | 'en_retard';
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA (sans émojis)
// ──────────────────────────────────────────────────────────────
const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    titre: 'Mathématiques 3ème',
    auteur: 'M. NGOMA',
    categorie: 'Scolaire',
    type: 'physique',
    disponible: true,
    description: 'Manuel de mathématiques pour la classe de 3ème',
  },
  {
    id: '2',
    titre: 'Physique Chimie',
    auteur: 'M. MFOUMOU',
    categorie: 'Scolaire',
    type: 'physique',
    disponible: false,
    empruntePar: 'Jean MOUKOKO',
    dateEmprunt: '2025-10-01',
    dateRetourPrevu: '2025-10-15',
    description: 'Cours de physique chimie',
  },
  {
    id: '3',
    titre: 'Histoire du Congo',
    auteur: 'Mme MOUKALA',
    categorie: 'Histoire',
    type: 'physique',
    disponible: true,
    description: "L'histoire complète du Congo",
  },
  {
    id: '4',
    titre: 'Programmation Python',
    auteur: 'M. TECH',
    categorie: 'Informatique',
    type: 'numerique',
    disponible: true,
    fichierUrl: 'https://example.com/python.pdf',
    description: 'Apprenez Python facilement',
  },
  {
    id: '5',
    titre: 'Anglais 3ème',
    auteur: 'M. WAMBA',
    categorie: 'Langues',
    type: 'numerique',
    disponible: true,
    fichierUrl: 'https://example.com/anglais.pdf',
    description: "Cours d'anglais niveau 3ème",
  },
];

const MOCK_EMPRUNTS: Emprunt[] = [
  {
    id: 'e1',
    bookId: '2',
    bookTitre: 'Physique Chimie',
    dateEmprunt: '2025-10-01',
    dateRetourPrevu: '2025-10-15',
    statut: 'en_cours',
  },
];

// ──────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ──────────────────────────────────────────────────────────────
export const StudentLibraryScreen: React.FC = () => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'physique' | 'numerique'>('all');
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [emprunts, setEmprunts] = useState(MOCK_EMPRUNTS);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEmpruntsModal, setShowEmpruntsModal] = useState(false);

  // ─── Animations ───
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 25,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // ─── Filtrage ───
  const filteredBooks = books.filter(book => {
    const matchSearch = book.titre.toLowerCase().includes(search.toLowerCase()) ||
                        book.auteur.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || book.type === filterType;
    return matchSearch && matchType;
  });

  // ─── Emprunter ───
  const handleEmprunter = (book: Book) => {
    if (!book.disponible) {
      Alert.alert('Indisponible', 'Ce livre est déjà emprunté');
      return;
    }

    Alert.alert(
      'Emprunter le livre',
      `Voulez-vous emprunter "${book.titre}" ?\nDurée d'emprunt : 14 jours`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Emprunter',
          onPress: () => {
            const dateEmprunt = new Date();
            const dateRetour = new Date(dateEmprunt);
            dateRetour.setDate(dateRetour.getDate() + 14);

            setBooks(prev =>
              prev.map(b =>
                b.id === book.id
                  ? {
                      ...b,
                      disponible: false,
                      empruntePar: 'Moi',
                      dateEmprunt: dateEmprunt.toISOString().split('T')[0],
                      dateRetourPrevu: dateRetour.toISOString().split('T')[0],
                    }
                  : b
              )
            );

            setEmprunts(prev => [
              ...prev,
              {
                id: Date.now().toString(),
                bookId: book.id,
                bookTitre: book.titre,
                dateEmprunt: dateEmprunt.toISOString().split('T')[0],
                dateRetourPrevu: dateRetour.toISOString().split('T')[0],
                statut: 'en_cours',
              },
            ]);

            Alert.alert(
              'Emprunt enregistré',
              `Vous avez emprunté "${book.titre}"\nRetour prévu le ${dateRetour.toLocaleDateString('fr-FR')}`
            );
            setShowDetailModal(false);
          },
        },
      ]
    );
  };

  // ─── Retourner ───
  const handleRetourner = (book: Book) => {
    Alert.alert(
      'Retourner le livre',
      `Voulez-vous retourner "${book.titre}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retourner',
          onPress: () => {
            setBooks(prev =>
              prev.map(b =>
                b.id === book.id
                  ? {
                      ...b,
                      disponible: true,
                      empruntePar: undefined,
                      dateEmprunt: undefined,
                      dateRetourPrevu: undefined,
                    }
                  : b
              )
            );

            setEmprunts(prev =>
              prev.map(e =>
                e.bookId === book.id ? { ...e, statut: 'retourne' } : e
              )
            );

            Alert.alert('Retour effectué', 'Le livre a été retourné avec succès');
            setShowDetailModal(false);
          },
        },
      ]
    );
  };

  // ─── Télécharger ───
  const handleTelecharger = (book: Book) => {
    Alert.alert(
      'Téléchargement',
      `Téléchargement de "${book.titre}" en cours...`,
      [{ text: 'OK' }]
    );
  };

  // ─── Rendu du type de livre (avec icônes Feather) ───
  const renderBookType = (type: BookType) => {
    if (type === 'physique') {
      return (
        <View style={{
          backgroundColor: colors.primaryBg,
          borderRadius: 6,
          paddingHorizontal: 8,
          paddingVertical: 2,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}>
          <Feather name="book" size={10} color={colors.primary} />
          <Text style={{ fontSize: 9, color: colors.primary, fontWeight: '600' }}>
            Physique
          </Text>
        </View>
      );
    }
    return (
      <View style={{
        backgroundColor: colors.secondaryBg,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}>
        <Feather name="download-cloud" size={10} color={colors.secondary} />
        <Text style={{ fontSize: 9, color: colors.secondary, fontWeight: '600' }}>
          Numérique
        </Text>
      </View>
    );
  };

  // ─── Rendu du statut ───
  const renderStatut = (book: Book) => {
    if (book.type === 'numerique') {
      return (
        <View style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 6,
          backgroundColor: colors.success + '15',
          alignSelf: 'flex-start',
        }}>
          <Text style={{
            fontSize: 10,
            fontWeight: '700',
            color: colors.success,
          }}>
            Disponible
          </Text>
        </View>
      );
    }

    return (
      <View style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: book.disponible ? colors.success + '15' : colors.error + '15',
        alignSelf: 'flex-start',
      }}>
        <Text style={{
          fontSize: 10,
          fontWeight: '700',
          color: book.disponible ? colors.success : colors.error,
        }}>
          {book.disponible ? 'Disponible' : `Emprunté${book.empruntePar ? ` par ${book.empruntePar}` : ''}`}
        </Text>
      </View>
    );
  };

  // ─── Icône pour la couverture ───
  const getBookIcon = (book: Book) => {
    if (book.type === 'physique') {
      return <Feather name="book" size={24} color={colors.primary} />;
    }
    return <Feather name="download-cloud" size={24} color={colors.secondary} />;
  };

  // ─── RENDU ───
  return (
    <Layout variant="default">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

        {/* ─── HEADER ─── */}
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
                Élève
              </Text>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#FFFFFF',
                marginTop: 2,
                letterSpacing: -0.5,
              }}>
                Bibliothèque
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowEmpruntsModal(true)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 10,
                alignItems: 'center',
                flexDirection: 'row',
                gap: 6,
              }}
            >
              <Feather name="clock" size={16} color="#FFFFFF" />
              <Text style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Emprunts
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={{
            flexDirection: 'row',
            marginTop: 16,
          }}>
            {[
              { label: 'Total', value: books.length.toString(), icon: 'book-open' },
              { label: 'Disponibles', value: books.filter(b => b.disponible || b.type === 'numerique').length.toString(), icon: 'check-circle' },
              { label: 'Empruntés', value: books.filter(b => !b.disponible && b.type === 'physique').length.toString(), icon: 'clock' },
            ].map((stat, index) => (
              <View key={stat.label} style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: index === 0 ? 10 : 0,
              }}>
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}>
                  <Feather name={stat.icon as any} size={14} color="rgba(255,255,255,0.8)" />
                </View>
                <View>
                  <Text style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {stat.label}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: '#FFFFFF',
                  }}>
                    {stat.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ─── BARRE DE RECHERCHE ─── */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 14,
          }}>
            <Feather name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={{
                flex: 1,
                fontSize: 15,
                color: colors.text,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
              placeholder="Rechercher un livre..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* ─── FILTRES ─── */}
          <View style={{
            flexDirection: 'row',
            gap: 8,
            marginTop: 12,
          }}>
            {[
              { key: 'all', label: 'Tous', icon: 'grid' },
              { key: 'physique', label: 'Physiques', icon: 'book' },
              { key: 'numerique', label: 'Numériques', icon: 'download-cloud' },
            ].map((filter) => {
              const isActive = filterType === filter.key;
              return (
                <TouchableOpacity
                  key={filter.key}
                  activeOpacity={0.7}
                  onPress={() => setFilterType(filter.key as any)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 10,
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderWidth: 1,
                    borderColor: isActive ? colors.primary : colors.border,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Feather
                    name={filter.icon as any}
                    size={14}
                    color={isActive ? '#FFFFFF' : colors.textMuted}
                  />
                  <Text style={{
                    fontSize: 12,
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? '#FFFFFF' : colors.textSecondary,
                  }}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── LISTE DES LIVRES ─── */}
        <Animated.View
          style={{
            flex: 1,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedBook(item);
                    setShowDetailModal(true);
                  }}
                >
                  {/* ✅ CARD AVEC COULEURS CLAIRES */}
                  <View style={{
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    {/* Icône/Couverture */}
                    <View style={{
                      width: 50,
                      height: 64,
                      borderRadius: 8,
                      backgroundColor: colors.primaryBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}>
                      {getBookIcon(item)}
                    </View>

                    {/* Infos */}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: colors.text,
                          flex: 1,
                        }}>
                          {item.titre}
                        </Text>
                        {renderBookType(item.type)}
                      </View>
                      <Text style={{
                        fontSize: 13,
                        color: colors.textSecondary,
                        marginTop: 2,
                      }}>
                        {item.auteur}
                      </Text>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 4,
                        flexWrap: 'wrap',
                      }}>
                        <View style={{
                          backgroundColor: colors.accentBg,
                          borderRadius: 4,
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                        }}>
                          <Text style={{ fontSize: 9, color: colors.accentDim }}>
                            {item.categorie}
                          </Text>
                        </View>
                        {renderStatut(item)}
                      </View>
                    </View>

                    <Feather name="chevron-right" size={18} color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 40,
                alignItems: 'center',
              }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  backgroundColor: colors.primaryBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Feather name="book-open" size={36} color={colors.primary} />
                </View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: colors.text,
                }}>
                  Aucun livre trouvé
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  Aucun livre ne correspond à votre recherche
                </Text>
              </View>
            }
          />
        </Animated.View>
      </View>

      {/* ─── MODAL DÉTAIL ─── */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
            maxHeight: '85%',
          }}>
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: colors.border,
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 20,
            }} />

            {selectedBook && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* En-tête */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <View style={{
                    width: 80,
                    height: 100,
                    borderRadius: 12,
                    backgroundColor: colors.primaryBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {selectedBook.type === 'physique' ? (
                      <Feather name="book" size={40} color={colors.primary} />
                    ) : (
                      <Feather name="download-cloud" size={40} color={colors.secondary} />
                    )}
                  </View>
                  <Text style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color: colors.text,
                    marginTop: 12,
                    textAlign: 'center',
                  }}>
                    {selectedBook.titre}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                  }}>
                    {selectedBook.auteur}
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    gap: 8,
                    marginTop: 8,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}>
                    {renderBookType(selectedBook.type)}
                    <View style={{
                      backgroundColor: colors.accentBg,
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}>
                      <Text style={{ fontSize: 9, color: colors.accentDim }}>
                        {selectedBook.categorie}
                      </Text>
                    </View>
                    {renderStatut(selectedBook)}
                  </View>
                </View>

                {/* Description */}
                {selectedBook.description && (
                  <View style={{
                    marginBottom: 16,
                    padding: 14,
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 12,
                  }}>
                    <Text style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      lineHeight: 22,
                    }}>
                      {selectedBook.description}
                    </Text>
                  </View>
                )}

                {/* Infos emprunt */}
                {selectedBook.type === 'physique' && selectedBook.empruntePar && (
                  <View style={{
                    marginBottom: 16,
                    padding: 14,
                    backgroundColor: colors.error + '15',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.error + '30',
                  }}>
                    <Text style={{ fontSize: 12, color: colors.error, fontWeight: '600' }}>
                      Emprunté par {selectedBook.empruntePar}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                      Retour prévu le {selectedBook.dateRetourPrevu}
                    </Text>
                  </View>
                )}

                {/* Actions */}
                <View style={{ gap: 10 }}>
                  {selectedBook.type === 'physique' ? (
                    selectedBook.disponible ? (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleEmprunter(selectedBook)}
                        style={{
                          paddingVertical: 14,
                          borderRadius: 14,
                          backgroundColor: colors.primary,
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          gap: 10,
                          shadowColor: colors.primary,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.25,
                          shadowRadius: 12,
                          elevation: 4,
                        }}
                      >
                        <Feather name="book-open" size={18} color="#FFFFFF" />
                        <Text style={{
                          fontSize: 15,
                          fontWeight: '700',
                          color: '#FFFFFF',
                        }}>
                          Emprunter (14 jours)
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      selectedBook.empruntePar === 'Moi' && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleRetourner(selectedBook)}
                          style={{
                            paddingVertical: 14,
                            borderRadius: 14,
                            backgroundColor: colors.success,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 10,
                          }}
                        >
                          <Feather name="check-circle" size={18} color="#FFFFFF" />
                          <Text style={{
                            fontSize: 15,
                            fontWeight: '700',
                            color: '#FFFFFF',
                          }}>
                            Retourner le livre
                          </Text>
                        </TouchableOpacity>
                      )
                    )
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleTelecharger(selectedBook)}
                      style={{
                        paddingVertical: 14,
                        borderRadius: 14,
                        backgroundColor: colors.secondary,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 10,
                        shadowColor: colors.secondary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.25,
                        shadowRadius: 12,
                        elevation: 4,
                      }}
                    >
                      <Feather name="download" size={18} color="#FFFFFF" />
                      <Text style={{
                        fontSize: 15,
                        fontWeight: '700',
                        color: '#FFFFFF',
                      }}>
                        Télécharger
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowDetailModal(false)}
                    style={{
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.textMuted,
                    }}>
                      Fermer
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ─── MODAL MES EMPRUNTS ─── */}
      <Modal
        visible={showEmpruntsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmpruntsModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
            maxHeight: '80%',
          }}>
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: colors.border,
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 20,
            }} />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: colors.text,
              }}>
                Mes emprunts
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowEmpruntsModal(false)}
              >
                <Feather name="x" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {emprunts.filter(e => e.statut === 'en_cours').length === 0 ? (
              <View style={{
                padding: 30,
                alignItems: 'center',
              }}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 20,
                  backgroundColor: colors.primaryBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Feather name="book-open" size={28} color={colors.primary} />
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                  Aucun emprunt en cours
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  Vous n'avez pas de livre emprunté actuellement
                </Text>
              </View>
            ) : (
              <FlatList
                data={emprunts.filter(e => e.statut === 'en_cours')}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const book = books.find(b => b.id === item.bookId);
                  const isRetard = new Date(item.dateRetourPrevu) < new Date();

                  return (
                    <View style={{
                      backgroundColor: colors.surfaceElevated,
                      borderRadius: 14,
                      padding: 14,
                      marginBottom: 10,
                      borderWidth: 1,
                      borderColor: isRetard ? colors.error + '30' : colors.border,
                    }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{
                            fontSize: 15,
                            fontWeight: '600',
                            color: colors.text,
                          }}>
                            {item.bookTitre}
                          </Text>
                          <Text style={{
                            fontSize: 12,
                            color: colors.textMuted,
                            marginTop: 2,
                          }}>
                            Emprunté le {item.dateEmprunt}
                          </Text>
                          <Text style={{
                            fontSize: 12,
                            color: isRetard ? colors.error : colors.textMuted,
                            fontWeight: isRetard ? '700' : '400',
                          }}>
                            Retour prévu le {item.dateRetourPrevu}
                            {isRetard && ' ⚠️ En retard'}
                          </Text>
                        </View>
                        {book && book.disponible === false && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleRetourner(book)}
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: colors.success + '15',
                              alignSelf: 'flex-start',
                            }}
                          >
                            <Text style={{
                              fontSize: 11,
                              fontWeight: '600',
                              color: colors.success,
                            }}>
                              Retourner
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowEmpruntsModal(false)}
              style={{
                marginTop: 12,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.textMuted,
              }}>
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};