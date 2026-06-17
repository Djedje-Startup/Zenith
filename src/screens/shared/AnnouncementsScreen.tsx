// src/components/shared/AnnouncementsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
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

interface Announcement {
  id: string;
  titre: string;
  date: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  urgent: boolean;
  source?: string;
  image?: string;
}

interface AnnouncementsScreenProps {
  announcements?: Announcement[];
  userRole: 'student' | 'parent' | 'teacher';
  onBack?: () => void;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { 
    id: '1', 
    titre: 'Réunion parents-professeurs', 
    date: '25 oct. 2025', 
    description: 'Réunion trimestrielle en salle polyvalente', 
    type: 'info', 
    urgent: false,
    source: 'Administration'
  },
  { 
    id: '2', 
    titre: 'Examens de mi-trimestre', 
    date: '3 nov. 2025', 
    description: 'Planification des examens pour tous les niveaux', 
    type: 'warning', 
    urgent: true,
    source: 'Direction'
  },
  { 
    id: '3', 
    titre: 'Journée sportive', 
    date: '10 nov. 2025', 
    description: 'Tournoi interclasses avec remise de prix', 
    type: 'success', 
    urgent: false,
    source: 'BDE'
  },
  { 
    id: '4', 
    titre: 'Fermeture exceptionnelle', 
    date: '15 nov. 2025', 
    description: 'L\'établissement sera fermé pour maintenance', 
    type: 'urgent', 
    urgent: true,
    source: 'Administration'
  },
];

export const AnnouncementsScreen: React.FC<AnnouncementsScreenProps> = ({ 
  announcements = MOCK_ANNOUNCEMENTS,
  userRole,
  onBack 
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'student': return 'Élève';
      case 'parent': return 'Parent';
      case 'teacher': return 'Professeur';
      default: return '';
    }
  };

  const getTypeColor = (type: Announcement['type']) => {
    switch (type) {
      case 'info': return C.blue;
      case 'warning': return C.amber;
      case 'success': return C.green;
      case 'urgent': return C.red;
      default: return C.textMuted;
    }
  };

  const getTypeIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'alert-triangle';
      case 'success': return 'check-circle';
      case 'urgent': return 'alert-circle';
      default: return 'bell';
    }
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {onBack && (
                <TouchableOpacity onPress={onBack}>
                  <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              <View>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}>
                  {getRoleLabel()}
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginTop: 2,
                  letterSpacing: -0.5,
                }}>
                  Annonces
                </Text>
              </View>
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 10,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Nouvelles
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {announcements.filter(a => a.urgent).length}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const typeColor = getTypeColor(item.type);
            const typeIcon = getTypeIcon(item.type);

            return (
              <View style={{ marginBottom: 12 }}>
                <Card variant="default" padding="md">
                  {item.urgent && (
                    <View style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: C.red,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }} />
                  )}
                  
                  {/* En-tête */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: typeColor + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Feather name={typeIcon} size={18} color={typeColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: C.textPrimary }}>
                          {item.titre}
                        </Text>
                        {item.urgent && (
                          <View style={{
                            backgroundColor: C.redBg,
                            borderRadius: 4,
                            paddingHorizontal: 6,
                            paddingVertical: 1,
                          }}>
                            <Text style={{
                              fontSize: 8,
                              fontWeight: '700',
                              color: C.red,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                            }}>
                              Urgent
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
                        <Text style={{ fontSize: 12, color: C.textMuted }}>
                          {item.date}
                        </Text>
                        {item.source && (
                          <>
                            <View style={{
                              width: 3,
                              height: 3,
                              borderRadius: 1.5,
                              backgroundColor: C.textMuted,
                            }} />
                            <Text style={{ fontSize: 11, color: C.textMuted }}>
                              {item.source}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  <Text style={{
                    fontSize: 14,
                    color: C.textSecondary,
                    marginTop: 10,
                    lineHeight: 20,
                  }}>
                    {item.description}
                  </Text>
                </Card>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={{
              padding: 40,
              alignItems: 'center',
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: C.accentBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Feather name="bell" size={36} color={C.accentDim} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary }}>
                Aucune annonce
              </Text>
              <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginTop: 4 }}>
                Aucune annonce n'est disponible pour le moment
              </Text>
            </View>
          }
        />
      </View>
    </Layout>
  );
};