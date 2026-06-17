// src/screens/eleve/StudentLibraryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';

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
  amber: '#FBBF24',
  amberBg: 'rgba(251,191,36,0.09)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

const MOCK_BOOKS = [
  { id: '1', titre: 'Mathématiques 3ème', auteur: 'M. NGOMA', disponible: true, categorie: 'Scolaire' },
  { id: '2', titre: 'Physique Chimie', auteur: 'M. MFOUMOU', disponible: false, categorie: 'Scolaire' },
  { id: '3', titre: 'Histoire du Congo', auteur: 'Mme MOUKALA', disponible: true, categorie: 'Histoire' },
];

export const StudentLibraryScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <Layout variant="default">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
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
            Bibliothèque
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: C.surfaceAlt,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: C.border,
            paddingHorizontal: 14,
          }}>
            <Feather name="search" size={18} color={C.textMuted} />
            <TextInput
              style={{
                flex: 1,
                fontSize: 15,
                color: C.textPrimary,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
              placeholder="Rechercher un livre..."
              placeholderTextColor={C.textDim}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <FlatList
          data={MOCK_BOOKS}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <Card variant="default" padding="md">
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary }}>
                      {item.titre}
                    </Text>
                    <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>
                      {item.auteur}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      <View style={{
                        backgroundColor: C.accentBg,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}>
                        <Text style={{ fontSize: 10, color: C.accentDim }}>
                          {item.categorie}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 6,
                    backgroundColor: item.disponible ? C.greenBg : C.redBg,
                    alignSelf: 'flex-start',
                  }}>
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: item.disponible ? C.green : C.red,
                    }}>
                      {item.disponible ? 'Disponible' : 'Emprunté'}
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
          )}
        />
      </View>
    </Layout>
  );
};