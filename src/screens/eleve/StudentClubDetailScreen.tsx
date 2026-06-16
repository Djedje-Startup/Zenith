// screens/eleve/StudentClubDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface ClubDetail {
  id: string;
  nom: string;
  description: string;
  logo?: string;
  couleur: string;
  bureau: { id: string; nom: string; prenoms: string; role: string; photo?: string }[];
  evenements: { id: string; titre: string; date: string; lieu: string }[];
  isMember: boolean;
  nbMembres: number;
}

const MOCK_CLUB_DETAIL: ClubDetail = {
  id: '1',
  nom: 'Club Informatique',
  description: 'Découverte du code, de la robotique et des nouvelles technologies. Ateliers hebdomadaires, projets collaboratifs et participation aux compétitions nationales.',
  couleur: '#3B82F6',
  bureau: [
    { id: '1', nom: 'NGOMA', prenoms: 'Paul', role: 'Président', photo: undefined },
    { id: '2', nom: 'LOUBAT', prenoms: 'Marie', role: 'Vice-présidente', photo: undefined },
    { id: '3', nom: 'WAMBA', prenoms: 'Christ', role: 'Trésorier', photo: undefined },
  ],
  evenements: [
    { id: '1', titre: 'Hackathon Junior', date: '25 Oct 2025', lieu: 'Salle Informatique' },
    { id: '2', titre: 'Atelier Python', date: '10 Nov 2025', lieu: 'Labo Info' },
  ],
  isMember: false,
  nbMembres: 45,
};

export const StudentClubDetailScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [club, setClub] = useState(MOCK_CLUB_DETAIL);
  const [isJoining, setIsJoining] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleJoin = () => {
    Alert.alert(
      'Rejoindre le club',
      `Voulez-vous rejoindre ${club.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setIsJoining(true);
            setTimeout(() => {
              setClub({ ...club, isMember: true });
              setIsJoining(false);
              Alert.alert('Succès', 'Vous avez rejoint le club');
            }, 1000);
          },
        },
      ]
    );
  };

  const handleLeave = () => {
    Alert.alert(
      'Quitter le club',
      `Voulez-vous vraiment quitter ${club.nom} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            setClub({ ...club, isMember: false });
            Alert.alert('Succès', 'Vous avez quitté le club');
          },
        },
      ]
    );
  };

  if (!club) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header avec dégradé */}
      <LinearGradient
        colors={[club.couleur, `${club.couleur}CC`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingBottom: 80, paddingHorizontal: 20 }}
      >
        <TouchableOpacity onPress={() => {}} className="mb-4">
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <Feather name="arrow-left" size={22} color="white" />
          </View>
        </TouchableOpacity>

        <View className="items-center -mt-8">
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-3 border-4 border-white shadow-lg"
            style={{ backgroundColor: `${club.couleur}20` }}
          >
            <Feather name="users" size={40} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold">{club.nom}</Text>
          <View className="flex-row items-center gap-3 mt-2">
            <Feather name="users" size={14} color="white" />
            <Text className="text-white/90 text-sm">{club.nbMembres} membres</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Contenu */}
      <View className="px-5 -mt-5">
        {/* Description */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 100 }}
        >
          <Card variant="elevated" className="p-5 mb-6">
            <Text className="text-gray-700 dark:text-gray-300 text-base leading-6">
              {club.description}
            </Text>
          </Card>
        </MotiView>

        {/* Bouton d'adhésion */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 150 }}
          className="mb-6"
        >
          {club.isMember ? (
            <Button
              title={isJoining ? 'Départ en cours...' : 'Quitter le club'}
              onPress={handleLeave}
              variant="danger"
              size="md"
            />
          ) : (
            <Button
              title={isJoining ? 'Adhésion en cours...' : 'Rejoindre le club'}
              onPress={handleJoin}
              variant="primary"
              size="md"
              loading={isJoining}
            />
          )}
        </MotiView>

        {/* Bureau */}
        {club.bureau.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 200 }}
            className="mb-6"
          >
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Bureau
            </Text>
            {club.bureau.map((membre, index) => (
              <Card key={membre.id} variant="elevated" className="mb-3 flex-row items-center p-4">
                <Avatar
                  source={membre.photo}
                  name={`${membre.nom} ${membre.prenoms}`}
                  size="md"
                />
                <View className="flex-1 ml-3">
                  <Text className="font-semibold text-gray-900 dark:text-white">
                    {membre.prenoms} {membre.nom}
                  </Text>
                  <Text className="text-sm text-primary-500">{membre.role}</Text>
                </View>
              </Card>
            ))}
          </MotiView>
        )}

        {/* Événements */}
        {club.evenements.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 250 }}
            className="mb-8"
          >
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Événements à venir
            </Text>
            {club.evenements.map((event) => (
              <Card key={event.id} variant="elevated" className="mb-3 flex-row items-center p-4">
                <View className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center mr-3">
                  <Feather name="calendar" size={20} color="#F5A623" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 dark:text-white">{event.titre}</Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">{event.date} • {event.lieu}</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#9CA3AF" />
              </Card>
            ))}
          </MotiView>
        )}
      </View>
    </ScrollView>
  );
};