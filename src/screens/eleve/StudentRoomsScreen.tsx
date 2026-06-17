// src/screens/eleve/StudentRoomsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
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
  purple: '#A78BFA',
  purpleBg: 'rgba(167,139,250,0.09)',
  teal: '#2DD4BF',
  tealBg: 'rgba(45,212,191,0.09)',
  textPrimary: '#E8EAF0',
  textSecondary: '#CDD0E0',
  textMuted: '#4A5060',
  textDim: '#2E3245',
};

interface Room {
  id: string;
  nom: string;
  type: string;
  capacite: number;
  disponible: boolean;
  description?: string;
  equipements?: string[];
  horaires?: string;
  prix?: string;
  disponibilites?: {
    lundi?: { debut: string; fin: string };
    mardi?: { debut: string; fin: string };
    mercredi?: { debut: string; fin: string };
    jeudi?: { debut: string; fin: string };
    vendredi?: { debut: string; fin: string };
    samedi?: { debut: string; fin: string };
    dimanche?: { debut: string; fin: string };
  };
}

interface MyReservation {
  id: string;
  roomId: string;
  roomName: string;
  roomType: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  motif: string;
  statut: 'en_attente' | 'confirmee' | 'annulee';
  codeReservation: string;
  dateReservation: string;
}

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const JOURS_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// Génération d'un code de réservation unique
const generateReservationCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RES-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    nom: 'Salle A101',
    type: 'Salle de classe',
    capacite: 30,
    disponible: true,
    description: 'Salle spacieuse avec tableau interactif, idéale pour les travaux de groupe',
    equipements: ['Tableau interactif', 'Projecteur', 'Wi-Fi', 'Climatisation'],
    prix: 'Gratuit',
    disponibilites: {
      lundi: { debut: '08:00', fin: '18:00' },
      mardi: { debut: '08:00', fin: '18:00' },
      mercredi: { debut: '08:00', fin: '18:00' },
      jeudi: { debut: '08:00', fin: '18:00' },
      vendredi: { debut: '08:00', fin: '18:00' },
      samedi: { debut: '09:00', fin: '13:00' },
    },
  },
  {
    id: '2',
    nom: 'Labo Sciences',
    type: 'Laboratoire',
    capacite: 20,
    disponible: true,
    description: 'Laboratoire équipé pour les expériences scientifiques',
    equipements: ['Microscopes', 'Matériel de chimie', 'Paillasses', 'Climatisation'],
    prix: 'Gratuit',
    disponibilites: {
      lundi: { debut: '08:00', fin: '17:00' },
      mardi: { debut: '08:00', fin: '17:00' },
      mercredi: { debut: '08:00', fin: '17:00' },
      jeudi: { debut: '08:00', fin: '17:00' },
      vendredi: { debut: '08:00', fin: '16:00' },
    },
  },
  {
    id: '3',
    nom: 'Salle Polyvalente',
    type: 'Amphithéâtre',
    capacite: 80,
    disponible: false,
    description: 'Grande salle pour conférences, réunions et événements',
    equipements: ['Sonorisation', 'Projecteur géant', 'Scène', 'Climatisation'],
    prix: 'Sur demande',
    disponibilites: {
      lundi: { debut: '08:00', fin: '22:00' },
      mardi: { debut: '08:00', fin: '22:00' },
      mercredi: { debut: '08:00', fin: '22:00' },
      jeudi: { debut: '08:00', fin: '22:00' },
      vendredi: { debut: '08:00', fin: '22:00' },
    },
  },
  {
    id: '4',
    nom: 'Bibliothèque',
    type: 'Espace de travail',
    capacite: 50,
    disponible: true,
    description: 'Espace calme pour le travail individuel ou en groupe',
    equipements: ['Wi-Fi', 'Prise électrique', 'Tables de travail', 'Climatisation'],
    prix: 'Gratuit',
    disponibilites: {
      lundi: { debut: '08:00', fin: '20:00' },
      mardi: { debut: '08:00', fin: '20:00' },
      mercredi: { debut: '08:00', fin: '20:00' },
      jeudi: { debut: '08:00', fin: '20:00' },
      vendredi: { debut: '08:00', fin: '20:00' },
      samedi: { debut: '09:00', fin: '17:00' },
    },
  },
  {
    id: '5',
    nom: 'Salle de Réunion B12',
    type: 'Salle de réunion',
    capacite: 12,
    disponible: true,
    description: 'Salle équipée pour les réunions de projet',
    equipements: ['Visioconférence', 'Tableau blanc', 'Écran', 'Wi-Fi'],
    prix: 'Gratuit',
    disponibilites: {
      lundi: { debut: '08:00', fin: '18:00' },
      mardi: { debut: '08:00', fin: '18:00' },
      mercredi: { debut: '08:00', fin: '18:00' },
      jeudi: { debut: '08:00', fin: '18:00' },
      vendredi: { debut: '08:00', fin: '18:00' },
    },
  },
];

const ROOM_TYPES = ['Toutes', 'Salle de classe', 'Laboratoire', 'Amphithéâtre', 'Espace de travail', 'Salle de réunion'];

// Modal de réservation
interface ReservationModalProps {
  visible: boolean;
  room: Room | null;
  onClose: () => void;
  onConfirm: (reservation: { date: string; heureDebut: string; heureFin: string; motif: string }) => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  visible,
  room,
  onClose,
  onConfirm,
}) => {
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [motif, setMotif] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    if (!date || !heureDebut || !heureFin || !motif) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs');
      return;
    }

    // Vérifier que la capacité est respectée (pas de réservation individuelle pour les salles de classe)
    if (room?.type === 'Salle de classe' && room?.capacite > 1) {
      Alert.alert(
        'Attention',
        'Les salles de classe sont réservées pour des activités collectives (minimum 2 personnes). Souhaitez-vous continuer ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Continuer', onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              onConfirm({ date, heureDebut, heureFin, motif });
              onClose();
            }, 1500);
          }},
        ]
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onConfirm({ date, heureDebut, heureFin, motif });
      onClose();
    }, 1500);
  };

  if (!room) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: C.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 20,
          paddingBottom: Platform.OS === 'ios' ? 40 : 20,
          maxHeight: '90%',
        }}>
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: C.border,
            borderRadius: 2,
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
          }} />

          <Text style={{
            fontSize: 22,
            fontWeight: '700',
            color: C.textPrimary,
            marginBottom: 4,
          }}>
            Réserver {room.nom}
          </Text>
          <Text style={{
            fontSize: 13,
            color: C.textMuted,
            marginBottom: 20,
          }}>
            {room.type} • Capacité: {room.capacite} personnes
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: C.textMuted,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}>
                Date (JJ/MM/AAAA)
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
                placeholder="Ex: 25/12/2025"
                placeholderTextColor={C.textDim}
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, marginBottom: 16 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: C.textMuted,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}>
                  Heure début
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
                  placeholder="Ex: 14:00"
                  placeholderTextColor={C.textDim}
                  value={heureDebut}
                  onChangeText={setHeureDebut}
                />
              </View>

              <View style={{ flex: 1, marginBottom: 16 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: C.textMuted,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}>
                  Heure fin
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
                  placeholder="Ex: 16:00"
                  placeholderTextColor={C.textDim}
                  value={heureFin}
                  onChangeText={setHeureFin}
                />
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: C.textMuted,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}>
                Motif de la réservation
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
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
                placeholder="Décrivez l'utilisation prévue..."
                placeholderTextColor={C.textDim}
                value={motif}
                onChangeText={setMotif}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: C.surfaceAlt,
                  borderWidth: 1,
                  borderColor: C.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: C.textMuted,
                }}>
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleConfirm}
                disabled={isLoading}
                style={{
                  flex: 2,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: isLoading ? C.textMuted : C.accent,
                  alignItems: 'center',
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#FFFFFF',
                  }}>
                    Confirmer
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Screen principal
export const StudentRoomsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'disponibles' | 'mesReservations'>('disponibles');
  
  // Mes réservations
  const [myReservations, setMyReservations] = useState<MyReservation[]>([
    {
      id: 'r1',
      roomId: '1',
      roomName: 'Salle A101',
      roomType: 'Salle de classe',
      date: '20/12/2025',
      heureDebut: '10:00',
      heureFin: '12:00',
      motif: 'Travail de groupe sur le projet de mathématiques',
      statut: 'confirmee',
      codeReservation: 'RES-X7K9M2P4',
      dateReservation: '15/12/2025',
    },
    {
      id: 'r2',
      roomId: '4',
      roomName: 'Bibliothèque',
      roomType: 'Espace de travail',
      date: '22/12/2025',
      heureDebut: '14:00',
      heureFin: '17:00',
      motif: 'Révision pour les examens',
      statut: 'en_attente',
      codeReservation: 'RES-A3F8D1Q7',
      dateReservation: '16/12/2025',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleReserve = (room: Room) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  const handleConfirmReservation = (reservation: { date: string; heureDebut: string; heureFin: string; motif: string }) => {
    if (!selectedRoom) return;

    const newReservation: MyReservation = {
      id: `r${Date.now()}`,
      roomId: selectedRoom.id,
      roomName: selectedRoom.nom,
      roomType: selectedRoom.type,
      date: reservation.date,
      heureDebut: reservation.heureDebut,
      heureFin: reservation.heureFin,
      motif: reservation.motif,
      statut: 'confirmee',
      codeReservation: generateReservationCode(),
      dateReservation: new Date().toLocaleDateString('fr-FR'),
    };

    setMyReservations([newReservation, ...myReservations]);

    // Mettre à jour la disponibilité de la salle
    setRooms(rooms.map(room =>
      room.id === selectedRoom.id ? { ...room, disponible: false } : room
    ));

    Alert.alert(
      'Réservation confirmée',
      `Votre réservation a été effectuée avec succès.\n\nCode: ${newReservation.codeReservation}\nSalle: ${selectedRoom.nom}\nDate: ${reservation.date}\nHoraires: ${reservation.heureDebut} - ${reservation.heureFin}\n\nPrésentez ce code à l'accueil pour validation.`,
      [{ text: 'OK' }]
    );
    setModalVisible(false);
  };

  const handleCancelReservation = (reservationId: string, roomId: string) => {
    Alert.alert(
      'Annuler la réservation',
      'Voulez-vous vraiment annuler cette réservation ?',
      [
        { text: 'Non', style: 'cancel' },
        { 
          text: 'Oui, annuler', 
          style: 'destructive',
          onPress: () => {
            setMyReservations(myReservations.filter(r => r.id !== reservationId));
            // Réactiver la disponibilité de la salle
            setRooms(rooms.map(room =>
              room.id === roomId ? { ...room, disponible: true } : room
            ));
            Alert.alert('Réservation annulée', 'La réservation a été annulée avec succès');
          }
        },
      ]
    );
  };

  const filteredRooms = rooms
    .filter(room => selectedType === 'Toutes' || room.type === selectedType)
    .filter(room => 
      room.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const availableCount = rooms.filter(r => r.disponible).length;

  const renderDisponibilites = (room: Room) => {
    if (!room.disponibilites) return null;
    
    const joursDispo = JOURS.filter(jour => room.disponibilites?.[jour as keyof typeof room.disponibilites]);
    
    if (joursDispo.length === 0) return null;

    return (
      <View style={{ marginTop: 10 }}>
        <Text style={{
          fontSize: 10,
          fontWeight: '700',
          color: C.textMuted,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          marginBottom: 6,
        }}>
          Disponibilités
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
          {joursDispo.map((jour) => {
            const dispo = room.disponibilites?.[jour as keyof typeof room.disponibilites];
            const jourIndex = JOURS.indexOf(jour);
            return (
              <View key={jour} style={{
                backgroundColor: C.surfaceAlt,
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: C.border,
              }}>
                <Text style={{
                  fontSize: 9,
                  color: C.textSecondary,
                }}>
                  {JOURS_LABELS[jourIndex]}: {dispo?.debut || '--'} - {dispo?.fin || '--'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const getStatutConfig = (statut: string) => {
    switch (statut) {
      case 'confirmee':
        return { label: 'Confirmée', color: C.green, bg: C.greenBg, icon: 'check-circle' };
      case 'en_attente':
        return { label: 'En attente', color: C.amber, bg: C.amberBg, icon: 'clock' };
      case 'annulee':
        return { label: 'Annulée', color: C.red, bg: C.redBg, icon: 'x-circle' };
      default:
        return { label: statut, color: C.textMuted, bg: C.surfaceAlt, icon: 'circle' };
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
            <View>
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
                Réservation de salles
              </Text>
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
                {activeTab === 'disponibles' ? 'Disponibles' : 'Mes réservations'}
              </Text>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#FFFFFF',
              }}>
                {activeTab === 'disponibles' ? availableCount : myReservations.length}
              </Text>
            </View>
          </View>

          {/* Tab switcher */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: 4,
            marginTop: 12,
          }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveTab('disponibles')}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: activeTab === 'disponibles' ? 'rgba(255,255,255,0.12)' : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: activeTab === 'disponibles' ? '700' : '600',
                color: activeTab === 'disponibles' ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
              }}>
                Salles disponibles
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveTab('mesReservations')}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: activeTab === 'mesReservations' ? 'rgba(255,255,255,0.12)' : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: activeTab === 'mesReservations' ? '700' : '600',
                color: activeTab === 'mesReservations' ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
              }}>
                Mes réservations
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {activeTab === 'disponibles' ? (
          // Vue des salles disponibles
          <View style={{ flex: 1 }}>
            {/* Filtres */}
            <View style={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 12,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: C.surfaceAlt,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: C.border,
                paddingHorizontal: 14,
                marginBottom: 12,
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
                  placeholder="Rechercher une salle..."
                  placeholderTextColor={C.textDim}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {ROOM_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    activeOpacity={0.7}
                    onPress={() => setSelectedType(type)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 20,
                      backgroundColor: selectedType === type ? C.accent : C.surfaceAlt,
                      borderWidth: 1,
                      borderColor: selectedType === type ? C.accent : C.border,
                    }}
                  >
                    <Text style={{
                      fontSize: 12,
                      fontWeight: selectedType === type ? '700' : '600',
                      color: selectedType === type ? '#FFFFFF' : C.textSecondary,
                    }}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <FlatList
              data={filteredRooms}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
              }
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 12 }}>
                  <Card variant="default" padding="md">
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary }}>
                          {item.nom}
                        </Text>
                        <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>
                          {item.type}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <Feather name="users" size={14} color={C.textMuted} />
                          <Text style={{ fontSize: 12, color: C.textMuted }}>
                            Capacité: {item.capacite} personnes
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 6,
                        backgroundColor: item.disponible ? C.greenBg : C.redBg,
                      }}>
                        <Text style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: item.disponible ? C.green : C.red,
                        }}>
                          {item.disponible ? 'Disponible' : 'Occupée'}
                        </Text>
                      </View>
                    </View>

                    {item.description && (
                      <Text style={{
                        fontSize: 13,
                        color: C.textSecondary,
                        marginTop: 10,
                        lineHeight: 18,
                      }}>
                        {item.description}
                      </Text>
                    )}

                    {item.equipements && item.equipements.length > 0 && (
                      <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                          {item.equipements.map((equip, idx) => (
                            <View key={idx} style={{
                              backgroundColor: C.accentBg,
                              borderRadius: 6,
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                            }}>
                              <Text style={{ fontSize: 10, color: C.accentDim }}>
                                {equip}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {renderDisponibilites(item)}

                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                      paddingTop: 10,
                      borderTopWidth: 1,
                      borderTopColor: C.border,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Feather name="tag" size={14} color={C.textMuted} />
                        <Text style={{ fontSize: 11, color: C.textMuted }}>
                          {item.prix || 'Gratuit'}
                        </Text>
                      </View>
                    </View>

                    {item.disponible && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleReserve(item)}
                        style={{
                          marginTop: 12,
                          backgroundColor: C.accent,
                          borderRadius: 12,
                          paddingVertical: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                        }}
                      >
                        <Feather name="calendar" size={18} color="#FFFFFF" />
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#FFFFFF',
                        }}>
                          Réserver cette salle
                        </Text>
                      </TouchableOpacity>
                    )}

                    {!item.disponible && (
                      <View style={{
                        marginTop: 12,
                        backgroundColor: C.surfaceAlt,
                        borderRadius: 12,
                        paddingVertical: 12,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: C.border,
                      }}>
                        <Text style={{
                          fontSize: 13,
                          color: C.textMuted,
                        }}>
                          Salle actuellement occupée
                        </Text>
                      </View>
                    )}
                  </Card>
                </View>
              )}
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
                    <Feather name="map-pin" size={36} color={C.accentDim} />
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary }}>
                    Aucune salle trouvée
                  </Text>
                  <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginTop: 4 }}>
                    Aucune salle ne correspond à vos critères
                  </Text>
                </View>
              }
            />
          </View>
        ) : (
          // Vue Mes réservations
          <FlatList
            data={myReservations}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
            }
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            renderItem={({ item }) => {
              const statutConfig = getStatutConfig(item.statut);
              return (
                <View style={{ marginBottom: 12 }}>
                  <Card variant="default" padding="md">
                    {/* Code de réservation */}
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}>
                      <View style={{
                        backgroundColor: C.accentBg,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                      }}>
                        <Text style={{
                          fontSize: 11,
                          fontWeight: '700',
                          color: C.accentDim,
                          letterSpacing: 1,
                        }}>
                          {item.codeReservation}
                        </Text>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: statutConfig.bg,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}>
                        <Feather name={statutConfig.icon as any} size={10} color={statutConfig.color} />
                        <Text style={{
                          fontSize: 9,
                          fontWeight: '700',
                          color: statutConfig.color,
                        }}>
                          {statutConfig.label}
                        </Text>
                      </View>
                    </View>

                    {/* Infos salle */}
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: C.textPrimary,
                    }}>
                      {item.roomName}
                    </Text>
                    <Text style={{
                      fontSize: 13,
                      color: C.textSecondary,
                      marginTop: 2,
                    }}>
                      {item.roomType}
                    </Text>

                    {/* Détails */}
                    <View style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 12,
                      marginTop: 10,
                      paddingTop: 10,
                      borderTopWidth: 1,
                      borderTopColor: C.border,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Feather name="calendar" size={14} color={C.textMuted} />
                        <Text style={{ fontSize: 12, color: C.textMuted }}>{item.date}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Feather name="clock" size={14} color={C.textMuted} />
                        <Text style={{ fontSize: 12, color: C.textMuted }}>
                          {item.heureDebut} - {item.heureFin}
                        </Text>
                      </View>
                    </View>

                    <Text style={{
                      fontSize: 13,
                      color: C.textSecondary,
                      marginTop: 8,
                      fontStyle: 'italic',
                    }}>
                      {item.motif}
                    </Text>

                    <Text style={{
                      fontSize: 10,
                      color: C.textDim,
                      marginTop: 6,
                    }}>
                      Réservé le {item.dateReservation}
                    </Text>

                    {/* Boutons d'action */}
                    {item.statut !== 'annulee' && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleCancelReservation(item.id, item.roomId)}
                        style={{
                          marginTop: 12,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: C.redBg,
                          borderWidth: 1,
                          borderColor: C.red + '30',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: C.red,
                        }}>
                          Annuler la réservation
                        </Text>
                      </TouchableOpacity>
                    )}
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
                  <Feather name="calendar" size={36} color={C.accentDim} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: C.textPrimary }}>
                  Aucune réservation
                </Text>
                <Text style={{ fontSize: 13, color: C.textMuted, textAlign: 'center', marginTop: 4 }}>
                  Vous n'avez pas encore de réservation de salle
                </Text>
              </View>
            }
          />
        )}

        {/* Modal de réservation */}
        <ReservationModal
          visible={modalVisible}
          room={selectedRoom}
          onClose={() => {
            setModalVisible(false);
            setSelectedRoom(null);
          }}
          onConfirm={handleConfirmReservation}
        />
      </View>
    </Layout>
    
  );
};