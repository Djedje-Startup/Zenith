// src/screens/eleve/StudentElectionsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Layout } from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

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

const MOCK_CANDIDATES = [
  { id: '1', nom: 'MOUKOKO', prenoms: 'Jean', role: 'Président', programme: 'Modernisation du BDE', votes: 45 },
  { id: '2', nom: 'LOUBAT', prenoms: 'Marie', role: 'Vice-présidente', programme: 'Plus d\'activités', votes: 32 },
  { id: '3', nom: 'WAMBA', prenoms: 'Christ', role: 'Trésorier', programme: 'Transparence financière', votes: 28 },
];

export const StudentElectionsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [candidates] = useState(MOCK_CANDIDATES);
  const [voted, setVoted] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleVote = (candidate: typeof MOCK_CANDIDATES[0]) => {
    if (voted) {
      Alert.alert('Déjà voté', 'Vous avez déjà voté pour cette élection');
      return;
    }
    Alert.alert(
      'Confirmation',
      `Voulez-vous voter pour ${candidate.prenoms} ${candidate.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            setVoted(true);
            Alert.alert('Vote enregistré', 'Votre vote a été pris en compte');
          }
        },
      ]
    );
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
            Élections & BDE
          </Text>
        </LinearGradient>

        <FlatList
          data={candidates}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <Card variant="default" padding="md">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Avatar name={`${item.prenoms} ${item.nom}`} size="lg" variant="circle" gradient />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary }}>
                      {item.prenoms} {item.nom}
                    </Text>
                    <Text style={{ fontSize: 13, color: C.accentDim, fontWeight: '600' }}>
                      {item.role}
                    </Text>
                    <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                      {item.programme}
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: C.accentBg,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: C.accentDim }}>
                      {item.votes}
                    </Text>
                  </View>
                </View>
                {!voted && (
                  <View style={{ marginTop: 12 }}>
                    <Button
                      title="Voter"
                      onPress={() => handleVote(item)}
                      variant="primary"
                      size="sm"
                      fullWidth
                    />
                  </View>
                )}
              </Card>
            </View>
          )}
          ListHeaderComponent={
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 14,
                color: C.textSecondary,
                lineHeight: 22,
              }}>
                Votez pour vos représentants au Bureau des Élèves (BDE)
              </Text>
              {voted && (
                <View style={{
                  backgroundColor: C.greenBg,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: C.green + '30',
                  marginTop: 8,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Feather name="check-circle" size={18} color={C.green} />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: C.green }}>
                      Vous avez déjà voté pour cette élection
                    </Text>
                  </View>
                </View>
              )}
            </View>
          }
        />
      </View>
    </Layout>
  );
};